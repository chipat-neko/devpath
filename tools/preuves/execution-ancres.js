/* =============================================================================
   execution-ancres.js — LE VISUALISEUR ATTEINT PAR L'ANCRE, ET DEROULE JUSQU'AU
   BOUT, RESEAU COUPE. (chantier V15, point F3.) Node pur, ZERO dependance.

   POURQUOI CET OUTIL, PUISQUE `verif-execution.js` EXISTE DEJA
   `verif-execution.js` pilote les 26 exemples par le SELECTEUR : il ouvre la
   page une fois, puis change la valeur d'un `<select>`. C'est le chemin de
   quelqu'un qui est deja sur la page. Ce n'est PAS le chemin de l'apprenant :
   les 19 lecons liees au visualiseur pointent vers `execution.html#<id>`, donc
   l'apprenant arrive par une ANCRE, sur une page qui vient de se charger.

   Ce chemin-la passe par un autre code (`chargerAncre()`), il depend de l'ordre
   dans lequel la page monte, et `verif-execution-liens.js` n'en eprouvait que
   TROIS sur 26 — il verifiait que les liens menaient quelque part, pas que ce
   quelque part se deroulait. Une ancre qui chargerait le mauvais programme, ou
   un programme qui s'arreterait au troisieme pas, passait donc inapercue.

   CE QUI EST VERIFIE, POUR CHACUN DES 26 EXEMPLES
   1. La page est ouverte a NEUF sur `execution.html#<id>` (vraie navigation,
      pas un changement de valeur dans un menu).
   2. Le programme charge est le BON, compare caractere par caractere a la
      source du fichier d'exemples — le selecteur seul ne prouverait rien, il
      peut afficher un nom sans que le code suive.
   3. La page annonce « pas 1 sur N », et N est le nombre de pas que le moteur
      calcule ici, dans Node. « Precedent » est desactive au premier pas.
   4. « Tout derouler » atteint le DERNIER pas, « Suivant » s'y desactive, et la
      sortie affichee est EXACTEMENT celle du programme, ligne a ligne.
   5. Un exemple qui doit echouer (`erreurAttendue`) affiche son erreur.
   6. LE CHEMIN SANS RECHARGEMENT : sur une page deja ouverte, changer l'ancre
      (retour dans l'historique, second lien d'une meme lecon) doit charger le
      nouvel exemple. C'est le defaut trouve en B6 ; il est ici eprouve sur les
      26, et pas sur 3.
   7. UNE ANCRE INCONNUE ne casse rien : la page reste utilisable et n'ecrit pas
      dans la console.
   8. RESEAU COUPE (`--host-resolver-rules=MAP * ~NOTFOUND`) : zero requete hors
      `file://`, zero erreur de console sur l'ensemble de la campagne.

   L'ATTENTE EST UN ETAT, JAMAIS UNE DUREE. On sonde toutes les 100 ms jusqu'a
   15 s que la page ait fini de monter l'exemple attendu. Un delai fixe rend un
   verdict qui depend de la charge de la machine — c'est la lecon de F1.

   USAGE   node tools/preuves/execution-ancres.js [-v]
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

var VERBEUX = process.argv.indexOf("-v") !== -1;
var RACINE = path.resolve(__dirname, "..", "..");
var Interpreteur = require(path.join(RACINE, "js", "interpreteur.js"));
var EXEMPLES = require(path.join(RACINE, "js", "execution-exemples.js"));
var PAGE = path.join(RACINE, "pages", "execution.html");
var PORT = 9341;

var CHROME = ["C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
  "/usr/bin/google-chrome", "/usr/bin/chromium"].find(function (p) { return fs.existsSync(p); });

process.on("uncaughtException", function (e) {
  console.log("");
  console.log("execution-ancres.js — ECHEC TECHNIQUE, rien n'a pu etre mesure : " + (e && e.message ? e.message : e));
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

/* --------------------------------------------------------- client CDP nu --- */
function connecter(wsUrl) {
  var u = new URL(wsUrl);
  var sock = net.connect(Number(u.port), u.hostname, function () {
    var key = crypto.randomBytes(16).toString("base64");
    sock.write("GET " + u.pathname + " HTTP/1.1\r\nHost: " + u.host + "\r\nUpgrade: websocket\r\n" +
      "Connection: Upgrade\r\nSec-WebSocket-Key: " + key + "\r\nSec-WebSocket-Version: 13\r\n\r\n");
  });
  var buf = Buffer.alloc(0), hs = false, id = 0, attentes = {};
  var evenements = { console: [], reseau: [] };
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
        evenements.console.push("exception : " + ((d && d.exception && d.exception.description) || (d && d.text) || "?"));
      } else if (m.method === "Runtime.consoleAPICalled" && m.params && (m.params.type === "error" || m.params.type === "warning")) {
        evenements.console.push(m.params.type + " : " + (m.params.args || []).map(function (a) { return String(a.value); }).join(" "));
      } else if (m.method === "Log.entryAdded" && m.params && m.params.entry && m.params.entry.level === "error") {
        evenements.console.push("log : " + m.params.entry.text);
      } else if (m.method === "Network.requestWillBeSent" && m.params && m.params.request) {
        evenements.reseau.push(m.params.request.url);
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
    sock: sock,
    evenements: evenements,
    envoyer: envoyer,
    evaluer: function (expression) {
      return envoyer("Runtime.evaluate", { expression: expression, returnByValue: true, awaitPromise: false })
        .then(function (res) { return res && res.result ? res.result.value : undefined; });
    }
  };
}

/* ------------------------------------------------- lecture de l'affichage --- */
var LIRE_ETAT =
  "JSON.stringify((function(){" +
  "var sel=document.getElementById('vex-exemple');" +
  "var code=document.getElementById('vex-code');" +
  "return {" +
  "choisi: sel ? sel.value : ''," +
  "code: code ? code.value : ''," +
  "position: (document.getElementById('vex-position')||{}).textContent||''," +
  "erreur: (document.getElementById('vex-err')||{}).textContent||''," +
  "sortie: [].slice.call(document.querySelectorAll('#vex-sortie .vex-sortie__ligne')).map(function(s){return s.textContent;})," +
  "suivDesactive: !!(document.getElementById('vex-suiv')||{}).disabled," +
  "precDesactive: !!(document.getElementById('vex-prec')||{}).disabled," +
  "hash: location.hash" +
  "};})())";

function numeroDePas(position) {
  var m = /pas (\d+) sur (\d+)/.exec(position || "");
  return m ? { i: Number(m[1]), n: Number(m[2]) } : null;
}

/* On attend un ETAT, pas une duree : la page a fini de monter l'exemple `id`
   quand le selecteur le designe ET que la position est lisible (ou qu'une
   erreur est affichee, pour les exemples qui doivent echouer). */
async function attendrePret(cx, id, veutErreur) {
  var debut = Date.now(), dernier = null;
  while (Date.now() - debut < 15000) {
    var brut = await cx.evaluer(LIRE_ETAT);
    if (brut) {
      dernier = JSON.parse(brut);
      var pret = dernier.choisi === id &&
        (veutErreur ? !!dernier.erreur : !!numeroDePas(dernier.position));
      if (pret) return dernier;
    }
    await attendre(100);
  }
  return { _jamaisPret: true, dernier: dernier };
}

(async function () {
  if (!CHROME) { console.log("execution-ancres.js — Chrome introuvable, rien de mesure."); process.exit(2); }
  console.log("execution-ancres.js — les " + EXEMPLES.length +
    " exemples atteints PAR L'ANCRE, deroules jusqu'au bout, reseau coupe\n");

  var profil = fs.mkdtempSync(path.join(os.tmpdir(), "syntaxe-ancres-"));
  /* --host-resolver-rules : aucun nom de domaine ne se resout. Une URL de CDN
     qui reviendrait dans la page se verrait ici, et pas six mois plus tard. */
  var proc = cp.spawn(CHROME, ["--headless=new", "--remote-debugging-port=" + PORT, "--disable-gpu",
    "--no-first-run", "--no-default-browser-check", "--disable-extensions",
    "--host-resolver-rules=MAP * ~NOTFOUND",
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
  await cx.envoyer("Log.enable");
  await cx.envoyer("Network.enable");
  await cx.envoyer("Page.enable");

  var URLPAGE = "file:///" + PAGE.replace(/\\/g, "/");
  var pbs = [];
  var m = { ouverts: 0, derouls: 0, pas: 0, lignesSortie: 0, erreursAttendues: 0,
    sansRechargement: 0, chargementsNeufs: 0 };

  /* ============ 1. CHAQUE EXEMPLE, ATTEINT PAR UNE VRAIE NAVIGATION ============ */
  for (var e = 0; e < EXEMPLES.length; e++) {
    var ex = EXEMPLES[e];
    var attendu = Interpreteur.executer(ex.src, { maxTrace: 4000, maxPas: 400000 });

    /* PIEGE : deux URL qui ne different que par leur FRAGMENT ne rechargent pas
       la page — le navigateur se contente d'un `hashchange`. Sans ce passage par
       `about:blank`, cette boucle eprouverait le chemin du point 6 et croirait
       eprouver celui du point 1. On passe donc par une page vide, et on POSE un
       temoin dans le document : s'il survit a la navigation, c'est que le
       document n'a pas ete recharge et la mesure ne vaut rien. */
    await cx.envoyer("Page.navigate", { url: "about:blank" });
    await attendre(60);
    await cx.envoyer("Page.navigate", { url: URLPAGE + "#" + ex.id });
    var etat = await attendrePret(cx, ex.id, !!ex.erreurAttendue);
    var temoinSurvivant = await cx.evaluer("typeof window.__dejaVu !== 'undefined'");
    if (temoinSurvivant) {
      pbs.push(ex.id + " : le document n'a PAS ete recharge — cette mesure eprouverait le hashchange, pas l'ouverture par ancre");
      continue;
    }
    await cx.evaluer("window.__dejaVu = 1");
    m.chargementsNeufs++;
    if (etat._jamaisPret) {
      pbs.push(ex.id + " : la page n'a jamais charge cet exemple par son ancre apres 15 s" +
        (etat.dernier ? " (selecteur = « " + etat.dernier.choisi + " », position = « " + etat.dernier.position + " »)" : ""));
      continue;
    }
    m.ouverts++;

    /* --- le BON programme, et pas seulement le bon nom --- */
    if (etat.code !== ex.src) {
      pbs.push(ex.id + " : l'ancre designe le bon exemple mais le code charge n'est pas le sien (" +
        etat.code.length + " caracteres contre " + ex.src.length + ")");
      continue;
    }

    if (ex.erreurAttendue) {
      m.erreursAttendues++;
      if (etat.erreur.indexOf(ex.erreurAttendue) === -1) {
        pbs.push(ex.id + " : atteint par l'ancre, le message affiche ne cite pas « " + ex.erreurAttendue + " » — « " + etat.erreur + " »");
      }
      continue;                       /* un exemple qui echoue n'a pas de pas a derouler */
    }
    if (etat.erreur) { pbs.push(ex.id + " : la page affiche une erreur — " + etat.erreur); continue; }

    var pos = numeroDePas(etat.position);
    if (!pos) { pbs.push(ex.id + " : position illisible (« " + etat.position + " »)"); continue; }
    if (pos.n !== attendu.trace.length) {
      pbs.push(ex.id + " : la page annonce " + pos.n + " pas, le moteur en calcule " + attendu.trace.length);
    }
    if (pos.i !== 1) pbs.push(ex.id + " : l'ancre ne depose pas au pas 1 (elle depose au pas " + pos.i + ")");
    if (!etat.precDesactive) pbs.push(ex.id + " : « Precedent » est actif alors qu'on est au premier pas");

    /* --- deroule jusqu'au bout --- */
    await cx.evaluer("document.getElementById('vex-fin').click()");
    var fin = null, debutFin = Date.now();
    while (Date.now() - debutFin < 15000) {
      fin = JSON.parse(await cx.evaluer(LIRE_ETAT));
      var pf = numeroDePas(fin.position);
      if (pf && pf.i === pf.n) break;
      await attendre(100);
    }
    var posFin = numeroDePas(fin ? fin.position : "");
    if (!posFin || posFin.i !== posFin.n) {
      pbs.push(ex.id + " : « Tout derouler » n'atteint pas le dernier pas (" + (fin ? fin.position : "?") + ")");
      continue;
    }
    m.derouls++;
    m.pas += posFin.n;
    if (!fin.suivDesactive) pbs.push(ex.id + " : « Suivant » reste actif au dernier pas");
    if (fin.sortie.join("\n") !== attendu.sortie.join("\n")) {
      pbs.push(ex.id + " : au dernier pas la sortie affichee differe de celle du moteur\n" +
        "        page   : " + JSON.stringify(fin.sortie) + "\n" +
        "        moteur : " + JSON.stringify(attendu.sortie));
    } else {
      m.lignesSortie += fin.sortie.length;
    }
    if (VERBEUX) console.log("  ok  " + ex.id + " — " + posFin.n + " pas, " + fin.sortie.length + " ligne(s) affichee(s)");
  }

  /* ====== 2. LE CHEMIN SANS RECHARGEMENT : changer d'ancre sur une page ouverte ====== */
  /* C'est le retour dans l'historique, et le second lien d'une meme lecon. La page
     n'est PAS rechargee : seul `hashchange` peut la faire changer d'exemple. */
  await cx.envoyer("Page.navigate", { url: URLPAGE + "#" + EXEMPLES[0].id });
  await attendrePret(cx, EXEMPLES[0].id, !!EXEMPLES[0].erreurAttendue);
  for (var k = 1; k < EXEMPLES.length; k++) {
    var cible2 = EXEMPLES[k];
    await cx.evaluer("location.hash = " + JSON.stringify("#" + cible2.id));
    var apres = await attendrePret(cx, cible2.id, !!cible2.erreurAttendue);
    if (apres._jamaisPret || apres.code !== cible2.src) {
      pbs.push(cible2.id + " : changer l'ancre SANS rechargement ne charge pas cet exemple" +
        (apres.dernier ? " (selecteur reste sur « " + apres.dernier.choisi + " »)" : ""));
    } else {
      m.sansRechargement++;
    }
  }

  /* ============ 3. UNE ANCRE INCONNUE NE CASSE RIEN ============ */
  /* Deux situations, et elles n'appellent pas la meme bonne reponse :
     (a) la page s'OUVRE sur une ancre inconnue (lien peri me dans une vieille
         lecon) : elle doit retomber sur le premier exemple, pas rester vide ;
     (b) l'ancre change sur une page DEJA ouverte vers un identifiant inconnu :
         la page doit GARDER l'exemple en cours — remplacer le travail de
         l'apprenant par autre chose serait pire que de ne rien faire. */
  var avantConsole = cx.evenements.console.length;
  await cx.envoyer("Page.navigate", { url: "about:blank" });
  await attendre(60);
  await cx.envoyer("Page.navigate", { url: URLPAGE + "#pas-un-exemple-connu" });
  var inconnu = null, debutInc = Date.now();
  while (Date.now() - debutInc < 15000) {
    inconnu = JSON.parse(await cx.evaluer(LIRE_ETAT));
    if (numeroDePas(inconnu.position)) break;
    await attendre(100);
  }
  if (!inconnu || !numeroDePas(inconnu.position)) {
    pbs.push("ancre inconnue a l'ouverture : la page ne montre plus aucun pas — elle est cassee");
  } else if (inconnu.choisi !== EXEMPLES[0].id) {
    pbs.push("ancre inconnue a l'ouverture : la page charge « " + inconnu.choisi + " » au lieu de retomber sur le premier exemple");
  }
  var garde = EXEMPLES[3];
  await cx.evaluer("location.hash = " + JSON.stringify("#" + garde.id));
  await attendrePret(cx, garde.id, !!garde.erreurAttendue);
  await cx.evaluer("location.hash = '#pas-un-exemple-connu-non-plus'");
  await attendre(300);
  var apresInconnu = JSON.parse(await cx.evaluer(LIRE_ETAT));
  if (apresInconnu.choisi !== garde.id || apresInconnu.code !== garde.src) {
    pbs.push("ancre inconnue en cours de route : la page a quitte « " + garde.id +
      " » pour « " + apresInconnu.choisi + " » alors qu'aucun exemple ne porte ce nom");
  }
  if (cx.evenements.console.length > avantConsole) {
    pbs.push("ancre inconnue : la page ecrit dans la console — " +
      cx.evenements.console.slice(avantConsole).join(" | "));
  }

  /* ============ 4. RESEAU ET CONSOLE, SUR TOUTE LA CAMPAGNE ============ */
  var externes = cx.evenements.reseau.filter(function (u) { return u.indexOf("file://") !== 0; });
  if (externes.length) {
    pbs.push("la page a tente " + externes.length + " requete(s) hors file:// : " + externes.slice(0, 3).join(", "));
  }
  if (cx.evenements.console.length) {
    pbs.push("console : " + cx.evenements.console.slice(0, 4).join(" | "));
  }

  try { cx.sock.destroy(); } catch (err) { /* rien */ }
  proc.kill();
  try { fs.rmSync(profil, { recursive: true, force: true }); } catch (err) { /* rien */ }

  console.log("\n=== BILAN ===");
  console.log("  chargements NEUFS de la page ....... " + m.chargementsNeufs + " / " + EXEMPLES.length);
  console.log("  exemples ouverts par leur ancre .... " + m.ouverts + " / " + EXEMPLES.length);
  console.log("  deroules jusqu'au dernier pas ...... " + m.derouls);
  console.log("  pas parcourus au total ............. " + m.pas);
  console.log("  lignes de sortie comparees ......... " + m.lignesSortie);
  console.log("  erreurs volontaires affichees ...... " + m.erreursAttendues);
  console.log("  changements d'ancre sans recharger . " + m.sansRechargement + " / " + (EXEMPLES.length - 1));
  console.log("  requetes reseau .................... " + cx.evenements.reseau.length + " (dont hors file:// : " + externes.length + ")");
  console.log("  erreurs de console ................. " + cx.evenements.console.length);
  console.log("  problemes .......................... " + pbs.length);

  if (pbs.length) {
    console.log("");
    pbs.forEach(function (p) { console.log("  X " + p); });
    console.log("\nRESULTAT : " + pbs.length + " PROBLEME(S)");
    process.exit(1);
  }
  console.log("\nRESULTAT : 0 PROBLEME");
  process.exit(0);
})();
