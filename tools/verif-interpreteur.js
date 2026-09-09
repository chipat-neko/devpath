/* =============================================================================
   verif-interpreteur.js — le mini-interpreteur (js/interpreteur.js, chantier
   V15 point B1) confronte au VRAI moteur JavaScript. Node pur, ZERO dependance.

   POURQUOI CET OUTIL EXISTE
   Un visualiseur d'execution est une affirmation permanente : « voila ce que le
   moteur ferait ». Rien ne distingue, a la lecture, un interpreteur juste d'un
   interpreteur qui a l'air juste — c'est exactement ce qui a laisse passer cinq
   exemples faux sous quatre verificateurs verts. Donc on ne relit pas le code :
   on execute CHAQUE programme DEUX FOIS et on compare.

   COMMENT LA COMPARAISON EST HONNETE
   1. Le cote « verite de terrain » n'est PAS un vm sandboxe : c'est un vrai
      processus `node` separe, avec sa vraie boucle d'evenements et ses vrais
      minuteurs. Un ordonnancement invente ne passerait pas.
   2. Les DEUX cotes formatent avec la MEME fonction, `Interpreteur.representer`,
      chargee par le programme temoin lui-meme. Un ecart est donc toujours un
      ecart de SEMANTIQUE, jamais de mise en forme.
   3. Ce qui est compare : la SUITE DES LIGNES affichees, dans l'ordre, a
      l'identique ; et, en cas d'erreur non interceptee, le TYPE de l'erreur
      (`TypeError`, `RangeError`…). Les messages ne sont pas compares : les
      notres sont en francais, ceux de Node en anglais, et c'est voulu.

   MODES
     node tools/verif-interpreteur.js              tout le corpus
     node tools/verif-interpreteur.js --seul=nom   un seul programme, en detail
     node tools/verif-interpreteur.js --trace      + controles sur la trace
   ============================================================================= */
"use strict";

var fs = require("fs");
var os = require("os");
var path = require("path");
var cp = require("child_process");

var RACINE = path.resolve(__dirname, "..");
var CHEMIN_INTERP = path.join(RACINE, "js", "interpreteur.js");
var Interpreteur = require(CHEMIN_INTERP);
var PROGRAMMES = require(path.join(RACINE, "tools", "preuves", "interpreteur-programmes.js"))
  .concat(require(path.join(RACINE, "tools", "preuves", "interpreteur-contre-exemples.js")));

var args = process.argv.slice(2);
var seul = null, fichier = null;
for (var ai = 0; ai < args.length; ai++) {
  if (args[ai].indexOf("--seul=") === 0) seul = args[ai].slice(7);
  if (args[ai].indexOf("--fichier=") === 0) fichier = args[ai].slice(10);
}
var avecTrace = args.indexOf("--trace") !== -1;
var avecNavigateur = args.indexOf("--navigateur") !== -1;

/* --------------------------------------------------------------------------
   Preuve file:// — la MEME bibliotheque, chargee par Chrome depuis le disque,
   sans serveur ni module ES. On compare son resultat a celui obtenu dans Node :
   si les deux divergent, c'est que le code depend de quelque chose que le
   navigateur n'a pas (ou l'inverse), et l'apprenant verrait autre chose.
   -------------------------------------------------------------------------- */
function cheminChrome() {
  var candidats = [
    "C:/Program Files/Google/Chrome/Application/chrome.exe",
    "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
    "/usr/bin/google-chrome", "/usr/bin/chromium"
  ];
  for (var i = 0; i < candidats.length; i++) if (fs.existsSync(candidats[i])) return candidats[i];
  return null;
}

function preuveNavigateur() {
  var chrome = cheminChrome();
  if (!chrome) { console.log("  Chrome introuvable : preuve file:// NON MESURÉE."); return { nonMesure: true }; }
  var page = path.join(RACINE, "tools", "preuves", "interpreteur-navigateur.html");
  var profil = fs.mkdtempSync(path.join(os.tmpdir(), "syntaxe-chrome-"));
  var r = cp.spawnSync(chrome, [
    "--headless=new", "--disable-gpu", "--no-first-run", "--no-default-browser-check",
    "--user-data-dir=" + profil,
    "--dump-dom", "file:///" + page.replace(/\\/g, "/")
  ], { encoding: "utf8", timeout: 120000, maxBuffer: 64 * 1024 * 1024 });
  try { fs.rmSync(profil, { recursive: true, force: true }); } catch (e) { /* rien */ }
  var dom = String(r.stdout || "");
  var i = dom.indexOf(MARQUE);
  if (i === -1) return { erreur: "la page n'a rien rendu (dom de " + dom.length + " octets, code de sortie " + r.status + ")" };
  var fin = dom.indexOf("</pre>", i);
  var brut = dom.slice(i + MARQUE.length, fin === -1 ? undefined : fin);
  /* Le DOM est echappe : on remet les entites que JSON pourrait rencontrer. */
  brut = brut.replace(/&quot;/g, "\"").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
  try { return { res: JSON.parse(brut) }; }
  catch (e) { return { erreur: "resultat illisible : " + e.message + " — " + brut.slice(0, 200) }; }
}

var MARQUE = "RESULTAT";

/* --------------------------------------------------------------------------
   Cote verite de terrain : un vrai processus node.
   -------------------------------------------------------------------------- */
function prelude() {
  return [
    /* Le temoin tourne en MODE STRICT, parce que notre interpreteur applique le
       mode strict : c'est celui des classes, des modules, et celui que tout
       cours moderne enseigne. Sans cette ligne, `this` dans une fonction
       appelee nue vaudrait l'objet global d'un cote et `undefined` de l'autre —
       un ecart de MODE, pas un ecart de justesse. */
    "\"use strict\";",
    "var __I = require(" + JSON.stringify(CHEMIN_INTERP.replace(/\\/g, "/")) + ");",
    "var __sortie = [];",
    "var __erreur = null;",
    "function __log() {",
    "  var o = [];",
    "  for (var i = 0; i < arguments.length; i++) o.push(__I.representer(arguments[i], 0));",
    "  __sortie.push(o.join(' '));",
    "}",
    "var console = { log: __log, info: __log, warn: __log, error: __log, debug: __log };",
    "var __rendu = false;",
    "function __rendre() {",
    "  if (__rendu) return; __rendu = true;",
    "  process.stdout.write(" + JSON.stringify(MARQUE) + " + JSON.stringify({ sortie: __sortie, erreur: __erreur }));",
    "}",
    "process.on('uncaughtException', function (e) { __erreur = (e && e.name) || 'Error'; __rendre(); process.exit(0); });",
    "process.on('unhandledRejection', function (e) { __erreur = (e && e.name) || 'Error'; __rendre(); process.exit(0); });",
    "process.on('exit', __rendre);",
    "/* ---- programme de l'apprenant, a partir d'ici ---- */"
  ].join("\n") + "\n";
}

function executerDansVraiNode(src) {
  var dossier = fs.mkdtempSync(path.join(os.tmpdir(), "syntaxe-interp-"));
  var fichier = path.join(dossier, "temoin.js");
  /* Le programme est enferme dans une fonction appelee avec `this` = undefined.
     Sans cela, le temoin serait un module CommonJS ou `this` vaut au plus haut
     niveau `module.exports`, alors que notre interpreteur modelise un SCRIPT
     strict ou `this` vaut `undefined` : un ecart de CONTEXTE DE CODE, pas de
     justesse, qui faisait perdre du temps a la lecture. */
  fs.writeFileSync(fichier, prelude() + "(function () {\n" + src + "\n}).call(undefined);\n", "utf8");
  var r;
  try {
    r = cp.spawnSync(process.execPath, [fichier], { encoding: "utf8", timeout: 20000 });
  } finally {
    try { fs.unlinkSync(fichier); fs.rmdirSync(dossier); } catch (e) { /* rien */ }
  }
  var sortie = String(r.stdout || "");
  var i = sortie.indexOf(MARQUE);
  if (i === -1) {
    /* Node peut REFUSER D'ANALYSER le programme (`-2 ** 2` est une erreur de
       syntaxe, pas un calcul). Rien n'est alors ecrit sur la sortie standard :
       la verite de terrain est dans stderr, et c'est un resultat legitime, pas
       une panne du banc d'essai. */
    var err = String(r.stderr || "");
    var m = err.match(/^\s*(\w*Error)\b/m);
    if (m) return { sortie: [], erreur: m[1] };
    return { sortie: [], erreur: "PAS_DE_RESULTAT", brut: sortie + err };
  }
  var obj;
  try { obj = JSON.parse(sortie.slice(i + MARQUE.length)); }
  catch (e) { return { sortie: [], erreur: "RESULTAT_ILLISIBLE", brut: sortie }; }
  return obj;
}

/* --------------------------------------------------------------------------
   Comparaison
   -------------------------------------------------------------------------- */
function comparer(nom, src) {
  var nous = Interpreteur.executer(src, { maxTrace: 20000, maxPas: 500000 });
  var eux = executerDansVraiNode(src);
  var ecarts = [];

  if (eux.erreur === "PAS_DE_RESULTAT" || eux.erreur === "RESULTAT_ILLISIBLE") {
    ecarts.push({ quoi: "temoin", detail: "le programme temoin n'a rien rendu : " + String(eux.brut).slice(0, 300) });
    return { nom: nom, ecarts: ecarts, nous: nous, eux: eux };
  }

  var a = nous.sortie, b = eux.sortie;
  var n = Math.max(a.length, b.length);
  for (var i = 0; i < n; i++) {
    if (a[i] !== b[i]) {
      ecarts.push({
        quoi: "ligne " + (i + 1),
        detail: "nous : " + JSON.stringify(a[i] === undefined ? null : a[i]) +
          "   |   vrai node : " + JSON.stringify(b[i] === undefined ? null : b[i])
      });
    }
  }

  var typeNous = nous.erreur ? nous.erreur.nom : null;
  var typeEux = eux.erreur || null;
  if (typeNous === "Erreur de syntaxe") typeNous = "SyntaxError";
  if (!!typeNous !== !!typeEux) {
    ecarts.push({ quoi: "erreur", detail: "nous : " + typeNous + "   |   vrai node : " + typeEux });
  } else if (typeNous && typeEux && typeNous !== typeEux) {
    ecarts.push({ quoi: "type d'erreur", detail: "nous : " + typeNous + "   |   vrai node : " + typeEux });
  }

  return { nom: nom, ecarts: ecarts, nous: nous, eux: eux };
}

/* --------------------------------------------------------------------------
   Controles sur la TRACE elle-meme (elle n'a pas de verite de terrain externe,
   mais elle doit rester coherente avec la sortie qu'elle accompagne).
   -------------------------------------------------------------------------- */
function verifierTrace(nom, res) {
  var t = res.nous.trace, pbs = [];
  /* Un programme REFUSÉ à l'analyse n'a pas de trace : c'est normal, il n'a
     jamais commencé à s'exécuter. */
  if (res.nous.erreur && res.nous.erreur.nom === "Erreur de syntaxe") return pbs;
  if (!t.length) { pbs.push("trace vide"); return pbs; }
  var maxLignes = res.nous.sortie.length;
  for (var i = 0; i < t.length; i++) {
    var p = t[i];
    if (typeof p.ligne !== "number" || p.ligne < 0) pbs.push("pas " + i + " : ligne invalide (" + p.ligne + ")");
    if (!Array.isArray(p.pile)) pbs.push("pas " + i + " : pile absente");
    if (!Array.isArray(p.portees)) pbs.push("pas " + i + " : portees absentes");
    if (p.sortie > maxLignes) pbs.push("pas " + i + " : index de sortie " + p.sortie + " > " + maxLignes);
    if (i > 0 && p.sortie < t[i - 1].sortie) pbs.push("pas " + i + " : la sortie recule");
  }
  var dernier = t[t.length - 1];
  if (dernier.genre !== "fin" && dernier.genre !== "erreur" && !res.nous.tronquee) {
    pbs.push("le dernier pas est « " + dernier.genre + " » et non « fin »");
  }
  if (dernier.sortie !== maxLignes && !res.nous.tronquee) {
    pbs.push("le dernier pas annonce " + dernier.sortie + " lignes affichees, il y en a " + maxLignes);
  }
  return pbs;
}

/* -------------------------------------------------------------------------- */
function main() {
  var liste = PROGRAMMES;
  if (fichier) {
    liste = [{ nom: path.basename(fichier), src: fs.readFileSync(fichier, "utf8") }];
    seul = liste[0].nom;
  }
  else if (seul) liste = PROGRAMMES.filter(function (p) { return p.nom === seul; });
  if (!liste.length) {
    console.log("Aucun programme nomme « " + seul + " ». Programmes connus :");
    PROGRAMMES.forEach(function (p) { console.log("  " + p.nom); });
    process.exit(2);
  }

  console.log("=== verif-interpreteur : " + liste.length + " programmes, executes DEUX FOIS ===");
  console.log("    (une fois dans js/interpreteur.js, une fois dans un vrai processus node " + process.version + ")");
  console.log("");

  var t0 = Date.now();
  var totalLignes = 0, totalPas = 0, fautifs = [], pbsTrace = [];

  var limitesTenues = 0, limitesTombees = [];
  liste.forEach(function (p) {
    var r = comparer(p.nom, p.src);
    totalLignes += r.eux.sortie ? r.eux.sortie.length : 0;
    totalPas += r.nous.pas;
    /* Une LIMITE ASSUMEE doit s'ecarter : si elle cesse de s'ecarter, c'est
       que la limite a disparu et que la liste doit etre mise a jour. */
    if (p.limite) {
      if (r.ecarts.length) { limitesTenues++; console.log("[limite] " + p.nom + " — " + p.limite); }
      else { limitesTombees.push(p.nom); console.log("[LIMITE LEVEE ?] " + p.nom + " ne s'ecarte plus : mettre a jour la liste des limites."); }
      return;
    }
    var etat = r.ecarts.length ? "ECART" : "  ok ";
    console.log("[" + etat + "] " + p.nom +
      "  (" + (r.eux.sortie ? r.eux.sortie.length : 0) + " lignes, " + r.nous.pas + " pas, " + r.nous.trace.length + " pas traces)");
    if (r.ecarts.length) {
      fautifs.push(p.nom);
      r.ecarts.forEach(function (e) { console.log("         " + e.quoi + " : " + e.detail); });
    }
    if (avecTrace) {
      var pbs = verifierTrace(p.nom, r);
      if (pbs.length) { pbsTrace.push(p.nom); pbs.slice(0, 5).forEach(function (m) { console.log("         trace : " + m); }); }
    }
    if (seul) {
      console.log("  --- sortie de notre interpreteur ---");
      r.nous.sortie.forEach(function (l, i) { console.log("      " + (i + 1) + " | " + l); });
      console.log("  --- sortie du vrai node ---");
      (r.eux.sortie || []).forEach(function (l, i) { console.log("      " + (i + 1) + " | " + l); });
      if (r.nous.erreur) console.log("  erreur (nous) : " + r.nous.erreur.nom + " ligne " + r.nous.erreur.ligne + " — " + r.nous.erreur.message);
      if (r.eux.erreur) console.log("  erreur (node) : " + r.eux.erreur);
    }
  });

  var ecartsNav = null;
  /* Demander la preuve file:// et ne pas pouvoir la faire n'est pas « 0 ecart » :
     c'est RIEN DE MESURE. Point A7 du chantier V17 — sans ce drapeau, l'outil
     rendait 0, donc VERT, sur une machine sans Chrome, alors que la moitie du
     controle qu'on venait de lui demander n'avait pas eu lieu. */
  var navNonMesure = false;
  if (avecNavigateur && !seul) {
    console.log("");
    console.log("--- preuve file:// : la même bibliothèque, dans Chrome, depuis le disque ---");
    var nav = preuveNavigateur();
    if (nav && nav.nonMesure) { navNonMesure = true; }
    else if (nav && nav.erreur) { ecartsNav = [nav.erreur]; console.log("  " + nav.erreur); }
    else if (nav && nav.res) {
      ecartsNav = [];
      var parNom = {};
      liste.forEach(function (p) { parNom[p.nom] = Interpreteur.executer(p.src, { maxTrace: 20000, maxPas: 500000 }); });
      nav.res.forEach(function (rn) {
        var rNode = parNom[rn.nom];
        if (!rNode) return;
        var aNav = (rn.sortie || []).join(""), aNode = rNode.sortie.join("");
        if (aNav !== aNode) ecartsNav.push(rn.nom + " : sortie différente entre Chrome et Node");
        var eNav = rn.erreur || null, eNode = rNode.erreur ? rNode.erreur.nom : null;
        if (eNav !== eNode) ecartsNav.push(rn.nom + " : erreur « " + eNav + " » dans Chrome, « " + eNode + " » dans Node");
        if (rn.pas !== rNode.pas) ecartsNav.push(rn.nom + " : " + rn.pas + " pas dans Chrome, " + rNode.pas + " dans Node");
      });
      console.log("  " + nav.res.length + " programmes rejoués dans Chrome (file://, sans serveur) — " +
        ecartsNav.length + " écart(s) avec Node");
      ecartsNav.slice(0, 10).forEach(function (m) { console.log("    " + m); });
    }
  }

  var ms = Date.now() - t0;
  console.log("");
  console.log("=== BILAN ===");
  console.log("  programmes comparés ......... " + liste.length);
  console.log("  lignes de sortie comparées .. " + totalLignes);
  console.log("  pas d'exécution interprétés . " + totalPas);
  console.log("  programmes en écart ......... " + fautifs.length + (fautifs.length ? " : " + fautifs.join(", ") : ""));
  console.log("  limites assumées tenues ..... " + limitesTenues + (limitesTombees.length ? " (à revoir : " + limitesTombees.join(", ") + ")" : ""));
  if (avecTrace) console.log("  traces incohérentes ......... " + pbsTrace.length + (pbsTrace.length ? " : " + pbsTrace.join(", ") : ""));
  if (ecartsNav) console.log("  écarts Chrome ⇄ Node ........ " + ecartsNav.length);
  if (navNonMesure) console.log("  écarts Chrome ⇄ Node ........ NON MESURÉ (Chrome introuvable)");
  console.log("  durée ....................... " + (ms / 1000).toFixed(1) + " s");
  console.log("");
  if (fautifs.length || pbsTrace.length || (ecartsNav && ecartsNav.length)) { console.log("RESULTAT : ECARTS"); process.exit(1); }
  if (navNonMesure) { console.log("RESULTAT : NON MESURÉ — la preuve file:// demandée n’a pas pu être faite"); process.exit(2); }
  console.log("RESULTAT : 0 ECART");
}

main();
