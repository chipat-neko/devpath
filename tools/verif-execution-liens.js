/* =============================================================================
   verif-execution-liens.js — LES LECONS MENENT-ELLES VRAIMENT AU VISUALISEUR ?
   (chantier V15, point B6.) Node pur, ZERO dependance, Chrome sans fenetre.

   POURQUOI UN NAVIGATEUR ET PAS UN GREP
   L'encart n'existe dans AUCUN fichier HTML : `js/lecon.js` le construit a
   l'execution, a partir d'une table, et deduit sa profondeur (`../`) de l'URL
   courante. Un `grep` sur les pages rendrait donc zero, et un `grep` sur la
   table rendrait un vert qui ne prouve rien — ni que l'encart apparait, ni que
   le lien pointe quelque part. C'est exactement le piege releve au point A7 :
   il FAUT ouvrir les pages.

   CE QUI EST VERIFIE
   1. La table de `js/lecon.js` et le fichier des exemples COINCIDENT : chaque
      identifiant cite existe, et chaque titre recopie est le vrai titre. Sans
      cet invariant, une lecon renverrait vers un exemple disparu, et la page
      s'ouvrirait tres bien quand meme.
   2. Sur CHAQUE lecon liee, ouverte pour de vrai : l'encart existe, il porte
      autant de liens que la table l'annonce, chaque `href` pointe vers un
      fichier QUI EXISTE sur le disque, et l'ancre correspond a un exemple.
   3. Le CAVEAT : une lecon d'un cours qui n'est pas de la famille JavaScript
      doit DIRE que le visualiseur execute du JavaScript. Une lecon Pascal qui
      renverrait vers du JS sans le dire serait un piege.
   4. DES TEMOINS NEGATIFS : des lecons qui ne doivent PAS porter l'encart —
      sans quoi un encart pose partout passerait pour vert. Dont
      `python/lecon-26`, ecartee A DESSEIN : l'`asyncio` de Python n'est pas la
      boucle d'evenements de JavaScript.
   5. L'ancre marche : ouvrir `execution.html#<id>` charge bien CET exemple.

   Codes de sortie : 0 tout va bien · 1 divergence · 2 l'outil n'a pas pu mesurer.
   ============================================================================= */
"use strict";

var fs = require("fs");
var os = require("os");
var net = require("net");
var http = require("http");
var path = require("path");
var crypto = require("crypto");
var cp = require("child_process");

var RACINE = path.resolve(__dirname, "..");
var EXEMPLES = require(path.join(RACINE, "js", "execution-exemples.js"));
var PORT = 9351;

/* Les temoins negatifs. Chacun a une RAISON, et elle compte autant que la liste. */
var TEMOINS_NEGATIFS = [
  { page: "js/lecon-01.html", raison: "une premiere lecon de JS ne parle d'aucun de ces mecanismes" },
  { page: "html/lecon-01.html", raison: "HTML n'a ni pile d'appels ni fermetures" },
  { page: "python/lecon-26.html", raison: "ECARTEE A DESSEIN : l'asyncio de Python n'est pas la boucle d'evenements de JavaScript" },
  { page: "kotlin/lecon-13.html", raison: "ECARTEE A DESSEIN : les coroutines de Kotlin ne sont pas des promesses" },
  { page: "prolog/lecon-06.html", raison: "ECARTEE A DESSEIN : la recursion de Prolog ne se ramene pas a une pile d'appels JavaScript" },
  { page: "git/lecon-02.html", raison: "porte deja l'encart du bac a sable Git : il ne doit pas y en avoir deux" }
];

var CHROME = ["C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
  "/usr/bin/google-chrome", "/usr/bin/chromium"].find(function (p) { return fs.existsSync(p); });

process.on("uncaughtException", function (e) {
  console.log("");
  console.log("verif-execution-liens.js — ECHEC TECHNIQUE : " + (e && e.message ? e.message : e));
  process.exit(2);
});

var attendre = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
var get = function (u) {
  return new Promise(function (res, rej) {
    http.get(u, function (r) {
      var d = "";
      r.on("data", function (c) { d += c; });
      r.on("end", function () { res(JSON.parse(d)); });
    }).on("error", rej);
  });
};

function connecter(wsUrl) {
  var u = new URL(wsUrl);
  var sock = net.connect(Number(u.port), u.hostname, function () {
    var key = crypto.randomBytes(16).toString("base64");
    sock.write("GET " + u.pathname + " HTTP/1.1\r\nHost: " + u.host + "\r\nUpgrade: websocket\r\n" +
      "Connection: Upgrade\r\nSec-WebSocket-Key: " + key + "\r\nSec-WebSocket-Version: 13\r\n\r\n");
  });
  var buf = Buffer.alloc(0), hs = false, id = 0, attentes = {};
  var journal = [];
  sock.on("error", function () { /* Chrome coupe la socket a la fermeture */ });
  sock.on("data", function (chunk) {
    buf = Buffer.concat([buf, chunk]);
    if (!hs) { var i = buf.indexOf("\r\n\r\n"); if (i < 0) return; hs = true; buf = buf.slice(i + 4); }
    while (buf.length >= 2) {
      var len = buf[1] & 127, off = 2;
      if (len === 126) { len = buf.readUInt16BE(2); off = 4; }
      else if (len === 127) { len = Number(buf.readBigUInt64BE(2)); off = 10; }
      if (buf.length < off + len) return;
      var m;
      try { m = JSON.parse(buf.slice(off, off + len).toString()); } catch (e) { m = {}; }
      buf = buf.slice(off + len);
      if (m.id && attentes[m.id]) { attentes[m.id](m.result); delete attentes[m.id]; continue; }
      if (m.method === "Runtime.exceptionThrown") {
        var d = m.params && m.params.exceptionDetails;
        journal.push((d && d.exception && d.exception.description) || (d && d.text) || "?");
      }
    }
  });
  function envoyer(method, params) {
    return new Promise(function (r) {
      var msg = Buffer.from(JSON.stringify({ id: ++id, method: method, params: params || {} }));
      attentes[id] = function (res) { r(res); };
      var mk = crypto.randomBytes(4), e;
      if (msg.length < 126) e = Buffer.from([0x81, 0x80 | msg.length]);
      else if (msg.length < 65536) { e = Buffer.alloc(4); e[0] = 0x81; e[1] = 0xfe; e.writeUInt16BE(msg.length, 2); }
      else { e = Buffer.alloc(10); e[0] = 0x81; e[1] = 0xff; e.writeBigUInt64BE(BigInt(msg.length), 2); }
      var c = Buffer.from(msg);
      for (var k = 0; k < c.length; k++) c[k] ^= mk[k % 4];
      sock.write(Buffer.concat([e, mk, c]));
    });
  }
  return {
    sock: sock, journal: journal, envoyer: envoyer,
    evaluer: function (expr) {
      return envoyer("Runtime.evaluate", { expression: expr, returnByValue: true })
        .then(function (res) { return res && res.result ? res.result.value : undefined; });
    }
  };
}

/* La table est LUE dans js/lecon.js, sans l'executer : le fichier suppose un
   document, donc on ne peut pas simplement le charger dans Node. */
function lireTable() {
  var src = fs.readFileSync(path.join(RACINE, "js", "lecon.js"), "utf8");
  function bloc(nom) {
    var i = src.indexOf("var " + nom + " = {");
    if (i < 0) throw new Error("table « " + nom + " » introuvable dans js/lecon.js");
    var j = src.indexOf("\n  };", i);
    return src.slice(i + src.indexOf("{", i) - i, j + 4).replace(/;\s*$/, "");
  }
  var table = JSON.parse(bloc("VISUALISEUR").replace(/'/g, '"').replace(/,(\s*})/g, "$1")
    .replace(/([{,]\s*)"?([A-Za-z0-9_\-\/]+)"?\s*:/g, '$1"$2":'));
  var titres = JSON.parse(bloc("TITRES_VISUALISEUR").replace(/,(\s*})/g, "$1")
    .replace(/([{,]\s*)"?([A-Za-z0-9_\-]+)"?\s*:/g, '$1"$2":'));
  var famille = JSON.parse(/var FAMILLE_JS = (\[[^\]]*\]);/.exec(src)[1].replace(/'/g, '"'));
  return { table: table, titres: titres, famille: famille };
}

(async function () {
  if (!CHROME) { console.log("Chrome introuvable, rien de mesure."); process.exit(2); }
  var T = lireTable();
  var ids = {};
  EXEMPLES.forEach(function (e) { ids[e.id] = e; });
  var pages = Object.keys(T.table);

  console.log("verif-execution-liens.js — " + pages.length + " lecons liees + " +
    TEMOINS_NEGATIFS.length + " temoins negatifs, ouvertes pour de vrai dans Chrome\n");

  var pbs = [], mesures = { pages: 0, liens: 0, caveats: 0, temoins: 0 };

  /* ---- 1. la table et les exemples coincident-ils ? ---- */
  pages.forEach(function (cle) {
    T.table[cle].forEach(function (id) {
      if (!ids[id]) pbs.push(cle + " : renvoie vers l'exemple « " + id + " », qui n'existe pas");
      else if (T.titres[id] !== ids[id].titre) {
        pbs.push("titre recopie faux pour « " + id + " » : « " + T.titres[id] + " » au lieu de « " + ids[id].titre + " »");
      }
    });
  });
  Object.keys(T.titres).forEach(function (id) {
    if (!ids[id]) pbs.push("la table des titres cite « " + id + " », qui n'est pas un exemple");
  });

  /* ---- Chrome ---- */
  var profil = fs.mkdtempSync(path.join(os.tmpdir(), "syntaxe-liens-"));
  var proc = cp.spawn(CHROME, ["--headless=new", "--remote-debugging-port=" + PORT, "--disable-gpu",
    "--no-first-run", "--no-default-browser-check", "--disable-extensions",
    "--user-data-dir=" + profil, "about:blank"], { stdio: "ignore" });
  var cible = null;
  for (var t = 0; t < 40 && !cible; t++) {
    await attendre(300);
    try {
      var liste = await get("http://127.0.0.1:" + PORT + "/json/list");
      cible = liste.find(function (x) { return x.type === "page" && x.webSocketDebuggerUrl; });
    } catch (e) { /* Chrome demarre encore */ }
  }
  if (!cible) { proc.kill(); console.log("Chrome n'a pas repondu."); process.exit(2); }
  var cx = connecter(cible.webSocketDebuggerUrl);
  await attendre(200);
  await cx.envoyer("Runtime.enable");
  await cx.envoyer("Page.enable");

  var LIRE = "JSON.stringify((function(){" +
    "var b=document.querySelector('.lesson-vex');" +
    "if(!b)return {present:false};" +
    "return {present:true," +
    "liens:[].slice.call(b.querySelectorAll('a')).map(function(a){return {href:a.getAttribute('href'), texte:a.textContent};})," +
    "note:!!b.querySelector('.lesson-vex__note')," +
    "texte:b.textContent" +
    "};})())";

  async function ouvrir(rel) {
    var abs = path.join(RACINE, "pages", rel);
    await cx.envoyer("Page.navigate", { url: "file:///" + abs.replace(/\\/g, "/") });
    await attendre(700);
  }

  /* ---- 2 et 3. chaque lecon liee ---- */
  for (var p = 0; p < pages.length; p++) {
    var cle = pages[p];
    var rel = cle + ".html";
    if (!fs.existsSync(path.join(RACINE, "pages", rel))) {
      pbs.push(cle + " : la lecon citee dans la table n'existe pas sur le disque");
      continue;
    }
    await ouvrir(rel);
    mesures.pages++;
    var vu = JSON.parse(await cx.evaluer(LIRE));
    if (!vu.present) { pbs.push(cle + " : aucun encart vers le visualiseur sur la page ouverte"); continue; }
    var attendus = T.table[cle];
    if (vu.liens.length !== attendus.length) {
      pbs.push(cle + " : " + vu.liens.length + " lien(s) dans l'encart, la table en annonce " + attendus.length);
      continue;
    }
    for (var l = 0; l < vu.liens.length; l++) {
      mesures.liens++;
      var href = vu.liens[l].href || "";
      var m = /^\.\.\/execution\.html#(.+)$/.exec(href);
      if (!m) { pbs.push(cle + " : href inattendu « " + href + " »"); continue; }
      if (m[1] !== attendus[l]) pbs.push(cle + " : le lien " + (l + 1) + " vise « " + m[1] + " » au lieu de « " + attendus[l] + " »");
      if (!ids[m[1]]) pbs.push(cle + " : le lien " + (l + 1) + " vise un exemple inconnu « " + m[1] + " »");
      /* La PROFONDEUR : une lecon vit dans pages/<cours>/, la page visee dans pages/. */
      var vise = path.resolve(RACINE, "pages", cle, "..", href.split("#")[0]);
      if (!fs.existsSync(vise)) pbs.push(cle + " : le lien " + (l + 1) + " mene a un fichier inexistant (" + vise + ")");
      if (!vu.liens[l].texte || vu.liens[l].texte.length < 5) pbs.push(cle + " : le lien " + (l + 1) + " n'a pas de libelle lisible");
    }
    var cours = cle.split("/")[0];
    var estJS = T.famille.indexOf(cours) !== -1;
    if (!estJS) {
      mesures.caveats++;
      if (!vu.note) pbs.push(cle + " : cours hors famille JavaScript, et l'encart ne previent pas que le visualiseur execute du JavaScript");
      else if (vu.texte.indexOf("JavaScript") === -1) pbs.push(cle + " : la mise en garde ne nomme pas JavaScript");
    } else if (vu.note) {
      pbs.push(cle + " : cours de la famille JavaScript, et l'encart porte pourtant la mise en garde « ce n'est pas votre langage »");
    }
  }

  /* ---- 4. les temoins negatifs ---- */
  for (var w = 0; w < TEMOINS_NEGATIFS.length; w++) {
    var tn = TEMOINS_NEGATIFS[w];
    if (!fs.existsSync(path.join(RACINE, "pages", tn.page))) {
      pbs.push("temoin negatif introuvable sur le disque : " + tn.page);
      continue;
    }
    await ouvrir(tn.page);
    mesures.temoins++;
    var vt = JSON.parse(await cx.evaluer(LIRE));
    if (vt.present) pbs.push("TEMOIN NEGATIF ROMPU — " + tn.page + " porte un encart alors que : " + tn.raison);
  }

  /* ---- 5. l'ancre charge-t-elle le bon exemple ? ---- */
  var essais = ["factorielle", "async-then-promesse", "this-impose"];
  for (var a = 0; a < essais.length; a++) {
    var abs = path.join(RACINE, "pages", "execution.html");
    await cx.envoyer("Page.navigate", { url: "file:///" + abs.replace(/\\/g, "/") + "#" + essais[a] });
    await attendre(700);
    var choisi = await cx.evaluer("(document.getElementById('vex-exemple')||{}).value||''");
    if (choisi !== essais[a]) {
      pbs.push("l'ancre #" + essais[a] + " ouvre « " + choisi + " » au lieu de l'exemple vise");
    }
  }

  if (cx.journal.length) pbs.push("exceptions dans les pages : " + cx.journal.slice(0, 3).join(" | "));

  try { cx.sock.destroy(); } catch (e2) { /* rien */ }
  proc.kill();
  try { fs.rmSync(profil, { recursive: true, force: true }); } catch (e3) { /* rien */ }

  console.log("=== BILAN ===");
  console.log("  lecons liees ouvertes ....... " + mesures.pages);
  console.log("  liens verifies .............. " + mesures.liens);
  console.log("  mises en garde exigees ...... " + mesures.caveats + " (cours hors famille JavaScript)");
  console.log("  temoins negatifs tenus ...... " + mesures.temoins);
  console.log("  ancres essayees ............. " + essais.length);
  console.log("  problemes ................... " + pbs.length);
  if (pbs.length) {
    console.log("");
    pbs.forEach(function (x) { console.log("  - " + x); });
    console.log("");
    console.log("RESULTAT : PROBLEMES");
    process.exit(1);
  }
  console.log("");
  console.log("RESULTAT : 0 PROBLEME");
  process.exit(0);
})();
