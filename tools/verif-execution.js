/* =============================================================================
   verif-execution.js — LE VISUALISEUR, PILOTE POUR DE VRAI (chantier V15, B2).
   Node pur, ZERO dependance. Chrome sans fenetre, page ouverte en file://.

   POURQUOI CET OUTIL EXISTE, ET POURQUOI IL OUVRE LA VRAIE PAGE
   `verif-interpreteur.js` prouve que le MOTEUR dit vrai. Il ne prouve rien sur
   ce que l'apprenant VOIT : un identifiant mal orthographie, un ecouteur jamais
   pose, un panneau qui affiche l'etat du pas precedent — rien de tout cela ne
   se voit dans le moteur. Une page d'essai ne le prouverait pas davantage :
   elle prouverait que le code marche, pas que pages/execution.html l'emploie
   correctement. Donc on ouvre LA page et on clique SES boutons.

   CE QUI EST VERIFIE
   1. La page se charge en file:// sans erreur de console et SANS AUCUNE requete
      reseau (le site est hors ligne : une URL de CDN se verrait ici).
   2. Chaque exemple du selecteur s'execute sans erreur et produit des pas.
   3. L'AFFICHAGE NE DERIVE PAS DU MOTEUR : a chaque pas, la ligne surlignee, la
      hauteur de la pile et le nombre de lignes affichees sont compares a la
      trace calculee ici, dans Node, par le meme interpreteur.
   4. La REVERSIBILITE : on avance de N pas, on recule de N pas, et la suite des
      lignes surlignees doit etre exactement l'inverse. C'est la propriete que
      « pas precedent » promet, et elle n'est pas gratuite.
   5. « Tout derouler » mene au dernier pas, ou la sortie affichee doit etre
      EXACTEMENT celle du programme.
   6. Les fleches du clavier avancent et reculent.
   7. La ligne surlignee reste DANS le champ de vision — controle qui ne mesure
      rien tant qu'aucun exemple n'est plus long que la fenetre, d'ou l'exemple
      long du selecteur.
   8. Un exemple du groupe « recursivite » doit VRAIMENT montrer la pile monter
      (au moins 3 cadres) puis redescendre a 1. Un exemple qui cesserait de le
      faire resterait sinon au catalogue en n'enseignant rien.
   9. Un exemple peut DEVOIR echouer (`erreurAttendue`) : l'outil exige alors
      l'erreur, son type, et que la page l'affiche AVEC son numero de ligne.
  10. Un exemple du groupe « portee » doit montrer une CHAINE de portees (2 au
      moins), et ceux qui annoncent `montreThis` doivent afficher `this` avec
      une valeur dans au moins une portee.
  11. Un exemple peut n'exister que pour l'ECART entre deux de ses lignes
      (`lignesDifferentes`) : « var : 3 3 3 » contre « let : 0 1 2 ». Si les
      deux se mettaient a dire la meme chose, l'exemple enseignerait le
      contraire de son titre — l'outil le refuse.

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
var Interpreteur = require(path.join(RACINE, "js", "interpreteur.js"));
var EXEMPLES = require(path.join(RACINE, "js", "execution-exemples.js"));
var PAGE = path.join(RACINE, "pages", "execution.html");
var PORT = 9333;

var CHROME = ["C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
  "/usr/bin/google-chrome", "/usr/bin/chromium"].find(function (p) { return fs.existsSync(p); });

process.on("uncaughtException", function (e) {
  console.log("");
  console.log("verif-execution.js — ECHEC TECHNIQUE, rien n'a pu etre mesure : " + (e && e.message ? e.message : e));
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
/* Une seule expression, evaluee dans la page, qui rend l'etat VISIBLE. */
var LIRE_ETAT =
  "JSON.stringify((function(){" +
  "var c=document.querySelector('.vex-ligne.is-courante');" +
  "var sorties=[].slice.call(document.querySelectorAll('#vex-sortie .vex-sortie__ligne')).map(function(s){return s.textContent;});" +
  "return {" +
  "ligne: c ? Number(c.getAttribute('data-n')) : 0," +
  "pile: document.querySelectorAll('#vex-pile .vex-cadre').length," +
  "portees: [].slice.call(document.querySelectorAll('#vex-portees .vex-portee')).map(function(p){" +
  "return [].slice.call(p.querySelectorAll('.vex-var')).map(function(v){" +
  "return v.querySelector('.vex-var__nom').textContent + '=' + v.querySelector('.vex-var__valeur').textContent;});})," +
  "sortie: sorties," +
  "position: (document.getElementById('vex-position')||{}).textContent||''," +
  "explication: (document.getElementById('vex-explication')||{}).textContent||''," +
  "erreur: (document.getElementById('vex-err')||{}).textContent||''," +
  "visible: (function(){var l=document.getElementById('vex-lignes');" +
  "if(!c||!l)return true;var a=l.getBoundingClientRect(),b=c.getBoundingClientRect();" +
  "return b.top >= a.top - 1 && b.bottom <= a.bottom + 1;})()," +
  "defilable: (function(){var l=document.getElementById('vex-lignes');" +
  "return !!l && l.scrollHeight > l.clientHeight + 4;})()," +
  "suivDesactive: !!(document.getElementById('vex-suiv')||{}).disabled," +
  "precDesactive: !!(document.getElementById('vex-prec')||{}).disabled" +
  "};})())";

function numeroDePas(position) {
  var m = /pas (\d+) sur (\d+)/.exec(position || "");
  return m ? { i: Number(m[1]), n: Number(m[2]) } : null;
}

(async function () {
  if (!CHROME) { console.log("verif-execution.js — Chrome introuvable, rien de mesure."); process.exit(2); }
  console.log("verif-execution.js — la VRAIE page pages/execution.html, ouverte en file://, boutons cliques pour de vrai");
  console.log("  " + EXEMPLES.length + " exemple(s) au selecteur\n");

  var profil = fs.mkdtempSync(path.join(os.tmpdir(), "syntaxe-vex-"));
  var url = "file:///" + PAGE.replace(/\\/g, "/");
  var proc = cp.spawn(CHROME, ["--headless=new", "--remote-debugging-port=" + PORT, "--disable-gpu",
    "--no-first-run", "--no-default-browser-check", "--disable-extensions",
    "--user-data-dir=" + profil, url], { stdio: "ignore" });

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
  await cx.evaluer("location.reload()");
  await attendre(1500);

  var pbs = [];
  var mesures = { exemples: 0, pas: 0, comparaisons: 0, reculs: 0, defilements: 0, recursifs: 0, profondeurMax: 0, portees: 0, porteeMax: 0, contrastes: 0 };

  /* ---- 1. la page a-t-elle seulement demarre ? ---- */
  var pret = await cx.evaluer("!!document.getElementById('vex-lignes') && !!window.Interpreteur && !!window.EXECUTION_EXEMPLES");
  if (!pret) { pbs.push("la page n'a pas charge ses scripts (vex-lignes, Interpreteur ou EXECUTION_EXEMPLES manquant)"); }

  var options = JSON.parse(await cx.evaluer(
    "JSON.stringify([].slice.call(document.querySelectorAll('#vex-exemple option')).map(function(o){return o.value;}))") || "[]");
  if (options.length !== EXEMPLES.length) {
    pbs.push("le selecteur montre " + options.length + " exemple(s), le fichier en declare " + EXEMPLES.length);
  }

  /* ---- 2 a 6. chaque exemple, pas a pas ---- */
  for (var e = 0; e < EXEMPLES.length && pret; e++) {
    var ex = EXEMPLES[e];
    var attendu = Interpreteur.executer(ex.src, { maxTrace: 4000, maxPas: 400000 });
    mesures.exemples++;

    /* Un exemple peut DEVOIR echouer : « quand la recursivite ne s'arrete pas »
       n'enseigne rien d'autre que son RangeError. Il le declare (`erreurAttendue`)
       et l'outil exige alors l'erreur au lieu de la refuser — un exemple qui
       cesserait d'echouer serait tout aussi faux qu'un exemple qui casse. */
    if (ex.erreurAttendue) {
      if (!attendu.erreur) { pbs.push(ex.id + " : l'exemple annonce une erreur « " + ex.erreurAttendue + " » et n'en produit aucune"); continue; }
      if (attendu.erreur.nom !== ex.erreurAttendue) { pbs.push(ex.id + " : erreur « " + attendu.erreur.nom + " » alors que l'exemple annonce « " + ex.erreurAttendue + " »"); continue; }
    } else if (attendu.erreur) {
      pbs.push(ex.id + " : le moteur refuse l'exemple (" + attendu.erreur.nom + " ligne " + attendu.erreur.ligne + " : " + attendu.erreur.message + ")");
      continue;
    }
    if (!attendu.trace.length) { pbs.push(ex.id + " : le moteur ne produit aucun pas"); continue; }

    await cx.evaluer("(function(){var s=document.getElementById('vex-exemple');s.value=" +
      JSON.stringify(ex.id) + ";s.dispatchEvent(new Event('change'));return 1;})()");
    await attendre(120);

    var etat = JSON.parse(await cx.evaluer(LIRE_ETAT));
    if (ex.erreurAttendue) {
      /* Et la page doit le DIRE : une erreur que l'apprenant ne voit pas ne lui
         apprend rien. On exige le nom de l'erreur et un numero de ligne. */
      if (!etat.erreur) { pbs.push(ex.id + " : la page n'affiche pas l'erreur attendue"); continue; }
      if (etat.erreur.indexOf(ex.erreurAttendue) === -1) { pbs.push(ex.id + " : le message affiche ne cite pas « " + ex.erreurAttendue + " » — « " + etat.erreur + " »"); }
      if (etat.erreur.indexOf("ligne") === -1) { pbs.push(ex.id + " : le message d'erreur affiche ne cite aucune ligne — « " + etat.erreur + " »"); }
    } else if (etat.erreur) {
      pbs.push(ex.id + " : la page affiche une erreur — " + etat.erreur);
      continue;
    }

    var pos = numeroDePas(etat.position);
    if (!pos) { pbs.push(ex.id + " : la position affichee est illisible (« " + etat.position + " »)"); continue; }
    if (pos.n !== attendu.trace.length) {
      pbs.push(ex.id + " : la page annonce " + pos.n + " pas, le moteur en calcule " + attendu.trace.length);
    }
    if (pos.i !== 1) pbs.push(ex.id + " : la page ne demarre pas au pas 1 (elle est au pas " + pos.i + ")");
    if (!etat.precDesactive) pbs.push(ex.id + " : « Precedent » est actif alors qu'on est au premier pas");

    /* --- un exemple de recursivite doit VRAIMENT montrer la pile monter, puis
       redescendre. Sans ce controle, un exemple mal choisi (ou casse plus tard)
       resterait au catalogue en ne montrant rien du tout. La mesure porte sur la
       trace du moteur ; que l'affichage la suive est verifie juste apres, cadre
       par cadre. --- */
    if ((ex.groupe || "").indexOf("cursi") !== -1) {
      var profondeurs = attendu.trace.map(function (p) { return p.pile.length; });
      var maxP = Math.max.apply(null, profondeurs);
      mesures.recursifs++;
      if (maxP > mesures.profondeurMax) mesures.profondeurMax = maxP;
      if (maxP < 3) {
        pbs.push(ex.id + " : la pile ne depasse pas " + maxP + " cadre(s) — cet exemple ne montre aucune recursivite");
      }
      if (!ex.erreurAttendue) {
        var apres = profondeurs.slice(profondeurs.indexOf(maxP));
        if (Math.min.apply(null, apres) > 1) {
          pbs.push(ex.id + " : la pile monte a " + maxP + " cadres mais ne redescend jamais a 1");
        }
      }
    }

    /* --- un exemple de portee doit MONTRER une chaine de portees, et non une
       seule case. Meme raison qu'au-dessus : ajouter un programme ne prouve pas
       qu'il enseigne quelque chose. Ce qui est mesure ici l'est sur la trace du
       moteur ; que l'affichage la reproduise exactement est verifie juste apres,
       variable par variable. --- */
    if ((ex.groupe || "").indexOf("Port") === 0) {
      mesures.portees++;
      var profP = 0, voitThis = false;
      attendu.trace.forEach(function (p) {
        if (p.portees.length > profP) profP = p.portees.length;
        p.portees.forEach(function (s) {
          s.vars.forEach(function (v) { if (v.nom === "this" && v.valeur !== "undefined") voitThis = true; });
        });
      });
      if (profP > mesures.porteeMax) mesures.porteeMax = profP;
      if (profP < 2) pbs.push(ex.id + " : la chaine des portees ne depasse jamais " + profP + " niveau — cet exemple ne montre aucune portee");
      if (ex.montreThis && !voitThis) {
        pbs.push(ex.id + " : l'exemple annonce montrer « this » et aucune portee ne l'affiche avec une valeur");
      }
    }
    /* Certains exemples n'existent que pour l'ECART entre deux de leurs lignes :
       « var : 3 3 3 » contre « let : 0 1 2 ». Si les deux se mettaient a dire la
       meme chose, l'exemple enseignerait le contraire de son titre. */
    if (ex.lignesDifferentes) {
      var la = attendu.sortie[ex.lignesDifferentes[0]], lb = attendu.sortie[ex.lignesDifferentes[1]];
      if (la === undefined || lb === undefined) {
        pbs.push(ex.id + " : les lignes " + ex.lignesDifferentes.join(" et ") + " annoncees comme differentes n'existent pas toutes");
      } else if (la.replace(/^[^:]*:/, "") === lb.replace(/^[^:]*:/, "")) {
        pbs.push(ex.id + " : les deux lignes censees differer disent la meme chose — « " + la + " » / « " + lb + " »");
      } else {
        mesures.contrastes++;
      }
    }

    /* --- l'affichage suit-il le moteur, pas par pas ? --- */
    var n = attendu.trace.length;
    var aVerifier = Math.min(n, 120);
    var lignesVues = [];
    for (var k = 0; k < aVerifier; k++) {
      if (k > 0) { await cx.evaluer("document.getElementById('vex-suiv').click()"); }
      var v = JSON.parse(await cx.evaluer(LIRE_ETAT));
      var att = attendu.trace[k];
      mesures.pas++;
      mesures.comparaisons += 3;
      lignesVues.push(v.ligne);
      if (att.ligne && v.ligne !== att.ligne) {
        pbs.push(ex.id + " pas " + (k + 1) + " : ligne surlignee " + v.ligne + ", le moteur dit " + att.ligne);
        break;
      }
      if (v.pile !== att.pile.length) {
        pbs.push(ex.id + " pas " + (k + 1) + " : " + v.pile + " cadre(s) de pile affiches, le moteur en compte " + att.pile.length);
        break;
      }
      if (v.sortie.length !== att.sortie) {
        pbs.push(ex.id + " pas " + (k + 1) + " : " + v.sortie.length + " ligne(s) de sortie affichees, le moteur en compte " + att.sortie);
        break;
      }
      /* Les VARIABLES sont l'essentiel de ce panneau : les compter ne suffit
         pas, il faut comparer les noms et les valeurs, portee par portee.
         Le test par mutation a montre que sans cela, un panneau entierement
         vide passait pour vert. */
      mesures.comparaisons++;
      var attVars = att.portees.map(function (p) {
        return p.vars.filter(function (x) { return x.nom !== "__classe__"; })
          .map(function (x) { return x.nom + "=" + x.valeur; });
      });
      if (JSON.stringify(v.portees) !== JSON.stringify(attVars)) {
        pbs.push(ex.id + " pas " + (k + 1) + " : les variables affichees different de celles du moteur\n" +
          "        page   : " + JSON.stringify(v.portees) + "\n" +
          "        moteur : " + JSON.stringify(attVars));
        break;
      }
      if (!v.explication) { pbs.push(ex.id + " pas " + (k + 1) + " : aucune explication affichee"); break; }
      /* Une ligne surlignee hors du champ de vision ne sert a rien. Le controle
         n'a de sens que si la fenetre de code DEFILE vraiment : sans le
         programme long du selecteur, il serait toujours vrai — donc vide. */
      if (v.defilable) {
        mesures.defilements++;
        if (!v.visible) {
          pbs.push(ex.id + " pas " + (k + 1) + " : la ligne " + v.ligne + " est surlignee hors du champ de vision");
          break;
        }
      }
    }

    /* --- reversibilite : reculer doit rejouer la meme suite a l'envers --- */
    var lignesRecul = [];
    for (var r = aVerifier - 1; r >= 0; r--) {
      var vr = JSON.parse(await cx.evaluer(LIRE_ETAT));
      lignesRecul.push(vr.ligne);
      if (r > 0) { await cx.evaluer("document.getElementById('vex-prec').click()"); mesures.reculs++; }
    }
    lignesRecul.reverse();
    for (var q = 0; q < lignesVues.length; q++) {
      if (lignesVues[q] !== lignesRecul[q]) {
        pbs.push(ex.id + " : en reculant, le pas " + (q + 1) + " montre la ligne " + lignesRecul[q] + " au lieu de " + lignesVues[q]);
        break;
      }
    }

    /* --- « tout derouler » --- */
    await cx.evaluer("document.getElementById('vex-fin').click()");
    await attendre(80);
    var fin = JSON.parse(await cx.evaluer(LIRE_ETAT));
    var posFin = numeroDePas(fin.position);
    if (!posFin || posFin.i !== posFin.n) {
      pbs.push(ex.id + " : « Tout derouler » n'atteint pas le dernier pas (" + fin.position + ")");
    }
    if (!fin.suivDesactive) pbs.push(ex.id + " : « Suivant » reste actif au dernier pas");
    if (fin.sortie.join("\n") !== attendu.sortie.join("\n")) {
      pbs.push(ex.id + " : au dernier pas la sortie affichee differe de celle du moteur\n" +
        "        page   : " + JSON.stringify(fin.sortie) + "\n" +
        "        moteur : " + JSON.stringify(attendu.sortie));
    }

    /* --- clavier --- */
    await cx.evaluer("document.getElementById('vex-debut').click()");
    await cx.evaluer("document.body.focus();document.dispatchEvent(new KeyboardEvent('keydown',{key:'ArrowRight',bubbles:true}))");
    await attendre(60);
    var apresClavier = numeroDePas(JSON.parse(await cx.evaluer(LIRE_ETAT)).position);
    if (!apresClavier || apresClavier.i !== 2) {
      pbs.push(ex.id + " : la fleche droite du clavier n'avance pas d'un pas (position « " +
        (apresClavier ? apresClavier.i : "?") + " »)");
    }
  }

  /* ---- 7. un programme refuse doit le DIRE ---- */
  if (pret) {
    await cx.evaluer("(function(){var t=document.getElementById('vex-code');t.value='var x = ;';" +
      "document.getElementById('vex-relancer').click();return 1;})()");
    await attendre(150);
    var mauvais = JSON.parse(await cx.evaluer(LIRE_ETAT));
    if (!mauvais.erreur) pbs.push("un programme invalide (« var x = ; ») ne provoque aucun message d'erreur visible");
    else if (mauvais.erreur.indexOf("ligne") === -1) pbs.push("le message d'erreur ne cite pas de ligne : « " + mauvais.erreur + " »");
  }

  /* ---- 8. console et reseau ---- */
  var externes = cx.evenements.reseau.filter(function (u) { return u.indexOf("file://") !== 0 && u.indexOf("data:") !== 0; });
  if (externes.length) pbs.push("la page a tente " + externes.length + " requete(s) hors file:// : " + externes.slice(0, 3).join(", "));
  if (cx.evenements.console.length) pbs.push("console : " + cx.evenements.console.slice(0, 4).join(" | "));

  try { cx.sock.destroy(); } catch (e2) { /* rien */ }
  proc.kill();
  try { fs.rmSync(profil, { recursive: true, force: true }); } catch (e3) { /* rien */ }

  console.log("=== BILAN ===");
  console.log("  exemples pilotes ............ " + mesures.exemples);
  console.log("  pas affiches et compares .... " + mesures.pas);
  console.log("  comparaisons page/moteur .... " + mesures.comparaisons);
  console.log("  reculs joues ................ " + mesures.reculs);
  console.log("  controles de defilement ..... " + mesures.defilements);
  console.log("  exemples recursifs .......... " + mesures.recursifs + " (pile la plus haute : " + mesures.profondeurMax + " cadres)");
  console.log("  exemples de portee .......... " + mesures.portees + " (chaine la plus longue : " + mesures.porteeMax + " portees)");
  console.log("  contrastes exiges ........... " + mesures.contrastes);
  console.log("  requetes reseau ............. " + cx.evenements.reseau.length + " (dont hors file:// : " + externes.length + ")");
  console.log("  erreurs de console .......... " + cx.evenements.console.length);
  console.log("  problemes ................... " + pbs.length);
  if (pbs.length) {
    console.log("");
    pbs.forEach(function (p) { console.log("  - " + p); });
    console.log("");
    console.log("RESULTAT : PROBLEMES");
    process.exit(1);
  }
  console.log("");
  console.log("RESULTAT : 0 PROBLEME");
  process.exit(0);
})();
