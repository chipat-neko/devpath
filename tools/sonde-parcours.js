/* =============================================================================
   sonde-parcours.js — JETABLE (chantier V9). Mesure CE QUE LE SITE DIT a
   l'apprenant a differents etats de progression, sur les pages cles du parcours.

   Node pur, zero dependance (WebSocket natif >= 22), pilote Chrome via CDP.
   S'inspire de tools/verif-rendu.js (meme Client, meme lancement Chrome).

   ETATS semes dans localStorage (syntaxe-progress / syntaxe-last) :
     - vierge      : rien du tout (ni progress ni last)
     - visite      : une lecon ouverte (syntaxe-last pose) mais 0 completion
     - encours     : quelques cours partiellement faits
     - fini-1cours : un cours a 100 %, le reste vierge
     - tout        : les 1376 lecons de tous les cours a 100 %

   Pour chaque (etat, page) on releve :
     - accueil : visibilite du bandeau resume, href du bouton, kicker/title/meta
     - toutes  : innerText visible (on grep ensuite des phrases-cles cote Node)

   USAGE : node tools/sonde-parcours.js [--etats=vierge,tout] [--pages=index.html]
   ============================================================================= */
"use strict";
var fs = require("fs");
var path = require("path");
var os = require("os");
var cp = require("child_process");

var args = process.argv.slice(2);
function opt(n, d) {
  for (var i = 0; i < args.length; i++)
    if (args[i].indexOf("--" + n + "=") === 0) return args[i].slice(n.length + 3);
  return d;
}
var ROOT = path.resolve(path.join(__dirname, ".."));

/* ---- data.js en Node : pour construire l'etat « tout termine » ------------ */
function chargerData() {
  var code = fs.readFileSync(path.join(ROOT, "js/data.js"), "utf8");
  var w = {};
  new Function("window", code)(w);
  return w.SITE_DATA;
}
var DATA = chargerData();

function lessonsOf(c) {
  var arr = [];
  (c.modules || []).forEach(function (m) {
    (m.lessons || []).forEach(function (l) { if (l && l.file) arr.push(l.file); });
  });
  return arr;
}

/* progress « tout termine » : chaque lecon de chaque cours a true */
function progressTout() {
  var p = {};
  Object.keys(DATA.content).forEach(function (id) {
    var m = {};
    lessonsOf(DATA.content[id]).forEach(function (f) { m[f] = true; });
    p[id] = m;
  });
  return p;
}
/* un seul cours (html) a 100 %, rien d'autre */
function progressUnCours(id) {
  var p = {};
  var m = {};
  lessonsOf(DATA.content[id]).forEach(function (f) { m[f] = true; });
  p[id] = m;
  return p;
}
/* quelques cours partiellement faits */
function progressEnCours() {
  var p = {};
  ["html", "css", "javascript"].forEach(function (id) {
    var files = lessonsOf(DATA.content[id]);
    var m = {};
    files.slice(0, Math.max(1, Math.floor(files.length / 2))).forEach(function (f) { m[f] = true; });
    p[id] = m;
  });
  return p;
}

/* derniere lecon reelle d'un cours (pour syntaxe-last) */
function lastOf(id) {
  var files = lessonsOf(DATA.content[id]);
  var f = files[files.length - 1];
  return { course: id, file: f, title: DATA.content[id].title };
}

/* Tout terminé sauf deux cours (pour tester « il te reste X et Y »). */
function progressPresque() {
  var p = progressTout();
  delete p.zig;
  delete p.asm;
  return p;
}

var ETATS = {
  vierge: { progress: {}, last: null },
  visite: { progress: {}, last: lastOf("html") },
  encours: { progress: progressEnCours(), last: { course: "javascript", file: "lecon-05.html", title: "JavaScript" } },
  "fini-1cours": { progress: progressUnCours("html"), last: lastOf("html") },
  presque: { progress: progressPresque(), last: lastOf("html") },
  tout: { progress: progressTout(), last: lastOf("zig") },
  /* Montée de palier (B3) : progression « en cours » (niveau > 3) mais dernier
     niveau annoncé = 3 → un toast « Niveau N atteint » doit apparaître. */
  montee: { progress: progressEnCours(), last: { course: "javascript", file: "lecon-05.html", title: "JavaScript" }, xpLevel: 3 },
  /* Même progression, niveau déjà annoncé = niveau courant → AUCUN toast. */
  "sans-montee": { progress: progressEnCours(), last: { course: "javascript", file: "lecon-05.html", title: "JavaScript" }, xpLevel: 99 },
  /* Langue EN forcée (C1) : pour relever l'effet réel sur <html lang>. */
  en: { progress: {}, last: null, lang: "en" },
};

/* ---- Chrome + CDP (repris de verif-rendu.js) ------------------------------ */
function trouverChrome() {
  var c = [
    process.env.CHROME_PATH,
    "C:/Program Files/Google/Chrome/Application/chrome.exe",
    "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
    path.join(os.homedir(), "AppData/Local/Google/Chrome/Application/chrome.exe"),
  ];
  for (var i = 0; i < c.length; i++) if (c[i] && fs.existsSync(c[i])) return c[i];
  return null;
}
function attendre(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }

function Client(url) {
  this.ws = new WebSocket(url);
  this.id = 0; this.encours = {}; this.ecoutes = {};
  var self = this;
  this.pret = new Promise(function (res, rej) {
    self.ws.addEventListener("open", function () { res(); });
    self.ws.addEventListener("error", function (e) { rej(new Error("WS: " + (e.message || "echec"))); });
  });
  this.ws.addEventListener("message", function (ev) {
    var m; try { m = JSON.parse(ev.data); } catch (e) { return; }
    if (m.id && self.encours[m.id]) {
      var f = self.encours[m.id]; delete self.encours[m.id];
      if (m.error) f.rej(new Error(m.error.message)); else f.res(m.result);
    } else if (m.method && self.ecoutes[m.method]) {
      self.ecoutes[m.method].forEach(function (cb) { cb(m.params); });
    }
  });
}
Client.prototype.envoyer = function (method, params) {
  var self = this, id = ++this.id;
  return new Promise(function (res, rej) {
    self.encours[id] = { res: res, rej: rej };
    self.ws.send(JSON.stringify({ id: id, method: method, params: params || {} }));
    setTimeout(function () { if (self.encours[id]) { delete self.encours[id]; rej(new Error("delai: " + method)); } }, 30000);
  });
};

/* SONDE injectee dans la page : ce que le site DIT */
var SONDE = function () {
  function vis(el) { return !!el && el.offsetParent !== null && !el.closest("[hidden]"); }
  var out = { url: location.pathname.split("/").slice(-2).join("/") };
  var band = document.querySelector("[data-home-resume]");
  if (band) {
    var link = band.querySelector("[data-resume-link]");
    out.resume = {
      visible: vis(band),
      hidden: band.hasAttribute("hidden"),
      kicker: (band.querySelector("[data-resume-kicker]") || band.querySelector(".resume-band__kicker") || {}).textContent || "",
      title: (band.querySelector("[data-resume-title]") || {}).textContent || "",
      meta: (band.querySelector("[data-resume-meta]") || {}).textContent || "",
      href: link ? link.getAttribute("href") : null,
      linkText: link ? (link.textContent || "").replace(/\s+/g, " ").trim() : null,
    };
  }
  /* Toasts présents (signal de palier B3) : leur texte. */
  var toasts = [];
  Array.prototype.forEach.call(document.querySelectorAll(".toast-host .toast"), function (t) {
    toasts.push((t.textContent || "").trim());
  });
  if (toasts.length) out.toasts = toasts;
  out.htmlLang = document.documentElement.getAttribute("lang");
  out.hasI18n = !!document.querySelector("[data-i18n]");
  out.langToggle = !!document.querySelector(".lang-toggle");
  var navA = document.querySelector(".primary-nav a");
  out.premierNav = navA ? navA.textContent.trim() : null;
  out.text = (document.body.innerText || "").replace(/\n{2,}/g, "\n").trim();
  /* Débordement horizontal (utile après un ajout CSS) : largeur du document vs
     zone visible, et les premiers éléments qui dépassent le bord droit. */
  var de = document.documentElement;
  out.overflow = Math.max(0, de.scrollWidth - de.clientWidth);
  if (out.overflow > 0) {
    var coup = [];
    Array.prototype.forEach.call(document.querySelectorAll("*"), function (el) {
      var r = el.getBoundingClientRect();
      if (r.width > 0 && r.right > de.clientWidth + 1) {
        var n = el.className && typeof el.className === "string"
          ? "." + el.className.trim().split(/\s+/)[0] : el.tagName.toLowerCase();
        if (coup.indexOf(n) === -1) coup.push(n);
      }
    });
    out.overflowCoupables = coup.slice(0, 8);
  }
  return out;
};

/* ---- main ----------------------------------------------------------------- */
(async function main() {
  var chrome = trouverChrome();
  if (!chrome) { console.error("Chrome introuvable"); process.exit(2); }

  var etats = (opt("etats", "vierge,visite,encours,fini-1cours,tout")).split(",");
  var pages = (opt("pages", "index.html,pages/progression.html,pages/parcours.html,pages/bilan.html,pages/certificat.html")).split(",");
  var grep = opt("grep", "");
  var largeur = parseInt(opt("largeur", "0"), 10) || 0;

  var profil = path.join(os.tmpdir(), "sonde-parcours-" + process.pid);
  var port = 9300 + (process.pid % 400);
  var proc = cp.spawn(chrome, [
    "--headless=new", "--disable-gpu", "--no-first-run", "--no-default-browser-check",
    "--allow-file-access-from-files", "--host-resolver-rules=MAP * ~NOTFOUND",
    "--remote-debugging-port=" + port, "--user-data-dir=" + profil, "about:blank",
  ], { stdio: "ignore" });

  var cible = null;
  for (var e = 0; e < 40 && !cible; e++) {
    await attendre(250);
    try { var r = await fetch("http://127.0.0.1:" + port + "/json/version"); if (r.ok) cible = (await r.json()).webSocketDebuggerUrl; } catch (x) {}
  }
  if (!cible) { proc.kill(); console.error("Chrome muet sur " + port); process.exit(2); }

  var nav = new Client(cible);
  await nav.pret;

  for (var ie = 0; ie < etats.length; ie++) {
    var etat = etats[ie];
    var seed = ETATS[etat];
    if (!seed) { console.error("etat inconnu: " + etat); continue; }
    console.log("\n============================================================");
    console.log("ETAT: " + etat);
    console.log("============================================================");

    for (var ip = 0; ip < pages.length; ip++) {
      var rel = pages[ip];
      var abs = path.join(ROOT, rel);
      if (!fs.existsSync(abs)) { console.log("  (introuvable: " + rel + ")"); continue; }
      var url = "file:///" + abs.replace(/\\/g, "/");

      var cid = (await nav.envoyer("Target.createTarget", { url: "about:blank" })).targetId;
      var sess = (await nav.envoyer("Target.attachToTarget", { targetId: cid, flatten: true })).sessionId;
      var envoyer = function (m, p) {
        var id = ++nav.id;
        return new Promise(function (res, rej) {
          nav.encours[id] = { res: res, rej: rej };
          nav.ws.send(JSON.stringify({ id: id, method: m, params: p || {}, sessionId: sess }));
          setTimeout(function () { if (nav.encours[id]) { delete nav.encours[id]; rej(new Error("delai: " + m)); } }, 30000);
        });
      };
      await envoyer("Page.enable");
      await envoyer("Runtime.enable");
      if (largeur > 0) {
        await envoyer("Emulation.setDeviceMetricsOverride", {
          width: largeur, height: 900, deviceScaleFactor: 1, mobile: false,
        });
      }
      var seedJson = JSON.stringify(seed.progress);
      var lastJson = JSON.stringify(seed.last);
      await envoyer("Page.addScriptToEvaluateOnNewDocument", {
        source:
          "try{localStorage.clear();" +
          (seed.progress && Object.keys(seed.progress).length ? "localStorage.setItem('syntaxe-progress'," + JSON.stringify(seedJson) + ");" : "") +
          (seed.last ? "localStorage.setItem('syntaxe-last'," + JSON.stringify(lastJson) + ");" : "") +
          (seed.xpLevel != null ? "localStorage.setItem('syntaxe-xp-level'," + JSON.stringify(String(seed.xpLevel)) + ");" : "") +
          (seed.lang ? "localStorage.setItem('syntaxe-lang'," + JSON.stringify(String(seed.lang)) + ");" : "") +
          "}catch(e){}",
      });
      await envoyer("Page.navigate", { url: url });
      await attendre(900);
      var res2 = await envoyer("Runtime.evaluate", { expression: "(" + SONDE.toString() + ")()", returnByValue: true });
      var v = (res2.result || {}).value || {};

      console.log("\n-- " + rel + (largeur ? " @" + largeur + "px" : "") + " --");
      console.log("  <html lang> = " + JSON.stringify(v.htmlLang) + " · data-i18n : " + v.hasI18n +
        " · bouton EN : " + v.langToggle + " · 1er lien nav : " + JSON.stringify(v.premierNav));
      if (v.toasts) console.log("  🔔 toast(s) : " + JSON.stringify(v.toasts));
      if (v.overflow) {
        console.log("  ⚠ DÉBORDEMENT +" + v.overflow + "px : " + (v.overflowCoupables || []).join(" · "));
      } else if (largeur) {
        console.log("  débordement : aucun");
      }
      if (v.resume) {
        console.log("  [bandeau resume] visible=" + v.resume.visible + " hidden-attr=" + v.resume.hidden);
        console.log("     kicker : " + JSON.stringify(v.resume.kicker.trim()));
        console.log("     title  : " + JSON.stringify(v.resume.title.trim()));
        console.log("     meta   : " + JSON.stringify(v.resume.meta.trim()));
        console.log("     bouton : " + JSON.stringify(v.resume.linkText) + " -> href=" + JSON.stringify(v.resume.href));
      }
      var txt = v.text || "";
      if (grep) {
        var re = new RegExp(grep, "i");
        txt.split("\n").forEach(function (line) { if (re.test(line)) console.log("     | " + line.trim()); });
      } else {
        /* extrait : les lignes contenant des mots-cles de parcours */
        var motsCles = /(reprend|repren|cours|le[cç]on|termin|fini|niveau|parcours|certificat|bravo|f[eé]licit|commenc|d[eé]bloqu|100|\/\s*\d|\d+\s*\/)/i;
        var lignes = txt.split("\n").map(function (s) { return s.trim(); }).filter(function (s) { return s && motsCles.test(s); });
        lignes.slice(0, 14).forEach(function (l) { console.log("     | " + l.slice(0, 120)); });
      }
      await nav.envoyer("Target.closeTarget", { targetId: cid });
    }
  }

  nav.ws.close();
  proc.kill();
  console.log("\n(fin sonde)");
  process.exit(0);
})();
