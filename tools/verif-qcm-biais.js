/* =============================================================================
   verif-qcm-biais.js — le cliquet : le biais des QCM ne doit plus jamais empirer.

   POURQUOI CET OUTIL EXISTE (point B2 du chantier V16). Un apprenant qui choisit
   toujours la reponse la plus longue reussit 89,5 % des 6 167 questions du site
   (mesure B1). C'est une dette editoriale enorme — 40 cours et 3 417 questions a
   reecrire pour la ramener sous 60 % — et un verificateur qui exigerait la cible
   tout de suite rougirait pendant des mois, donc ne serait plus lu. C'est ainsi
   qu'un outil devient decoratif.

   IL NE JUGE DONC PAS LE PASSE, IL VERROUILLE LE PRESENT. Quatre echecs :
     1. REGRESSION — un cours dont le biais REMONTE de plus d'un point par rapport
        a `tools/qcm-biais-reference.json`. Ajouter une question devinable a un
        cours existant est desormais impossible sans le voir.
     2. CIBLE PERDUE — un cours marque `traite: true` qui repasse au-dessus de la
        cible (40 % sur la longueur, 60 % sur toute strategie exploitable). Le
        travail de B3 et B4 ne peut pas se defaire en silence.
     3. COURS NEUF NON CONFORME — un cours absent de la reference doit naitre sous
        la cible. Les cinq cours ecrits apres le constat le prouvent faisable :
        `doc` est a 0,0 %, `distribue` a 5,6 %.
     4. REFERENCE ORPHELINE — un cours de la reference qui n'existe plus sur le
        disque, sinon la reference devient un cimetiere qu'on ne relit plus.

   IL NE MESURE RIEN LUI-MEME : il demande la mesure a `mesure-biais-qcm.js --json`,
   qui lit les blocs `data-quiz` et `data-quiz-bilan` des sources. Recopier une
   mesure au lieu de la lire est le defaut qui a rendu la surveillance du projet
   aveugle a son propre chantier.

   LES TROIS INDICES QU'IL IGNORE, ET C'EST MESURE : le tiret d'explication
   (27,3 %), l'evitement des affirmations absolues (26,3 %) et la prudence de
   formulation (30,2 %) sont au niveau du hasard (25,0 %). Les controler serait
   fabriquer du faux positif.

   USAGE
     node tools/verif-qcm-biais.js            # verdict
     node tools/verif-qcm-biais.js --detail   # + le tableau par cours
     node tools/verif-qcm-biais.js --ecrire   # refiger la reference (a faire APRES
                                              #   avoir ameliore un cours, jamais pour
                                              #   faire taire une regression)

   CODE DE SORTIE : 0 si rien n'a empire, 1 si un des quatre cas se presente,
   2 si la mesure elle-meme n'a pas pu tourner.
   ============================================================================= */
"use strict";

var fs = require("fs");
var path = require("path");
var cp = require("child_process");

var TOOLS = __dirname;
var REF = path.join(TOOLS, "qcm-biais-reference.json");
var DETAIL = process.argv.indexOf("--detail") !== -1;
var ECRIRE = process.argv.indexOf("--ecrire") !== -1;

/* Les strategies EXPLOITABLES, retenues par la mesure B1 : nettement au-dessus du
   hasard. Les trois autres sont ignorees a dessein.

   AJOUT B4 (2026-09-04) : « l'incise entre parentheses », 59,2 % sur les 6 167
   questions — le DEUXIEME indice du site, et B1 ne l'avait pas vu. Six relecteurs
   adversariaux du lot `js` l'ont signale sans se concerter ; la mesure les a
   confirmes. Verifie avant de l'inscrire ici : les six cours marques `traite` en
   B3 sont entre 36,6 % et 48,9 % dessus, donc l'ajouter ne fait rougir personne
   — c'est la condition pour qu'un cliquet reste lu.

   NON retenue, et il faut dire pourquoi : « la MAJUSCULE d'emphase » vaut 31,2 %
   sur le site, soit le niveau exact de « la plus prudente » (30,1 %) que B1 avait
   ecartee. La meme regle doit valoir pour les deux. Elle reste MESUREE par
   mesure-biais-qcm.js, parce qu'elle monte a 44,9 % sur certains cours.

   AJOUT B4 (2026-09-05) : « la ponctuation finale unique », et son cas OBLIGE A
   CHANGER LA REGLE D'ADMISSION. Les cinq strategies ci-dessus sont entrees ici
   parce qu'elles depassaient nettement le hasard SUR TOUT LE SITE. Celle-ci vaut
   25,1 % sur les 6 167 questions -- le hasard exactement. Elle entre quand meme,
   parce que sur `react` la vague de reecriture des distracteurs a termine par un
   POINT les 45 distracteurs des lecons 16 a 20 en laissant leur bonne reponse
   sans ponctuation finale : sur ce LOT, l'indice designait la bonne reponse 15
   fois sur 15. Un indice fabrique par une passe d'ecriture nait a 100 % sur un
   LOT et se dilue a 38 % sur le cours, puis a 25,1 % sur le site : la moyenne du
   site est donc exactement le mauvais endroit pour decider de l'admission.
   NOUVELLE REGLE : une strategie entre ici si elle depasse nettement le hasard
   sur le site, OU si on l'a vue atteindre 100 % sur un lot de lecons.
   Verifie avant de l'inscrire, comme pour la parenthese : le cours le plus
   expose est `erlang` a 27,8 %, les 15 cours marques `traite` sont entre 24,7 %
   et 25,0 %, donc l'ajouter ne fait rougir personne aujourd'hui.
   ⚠️ CE QUE CET AJOUT NE REGLE PAS, et qu'il faut savoir : le cliquet mesure PAR
   COURS alors que l'ecriture se fait PAR LOT DE LECONS. Le defaut de `react`
   plafonnait a 38,1 % au niveau du cours, sous la cible de 60 % : meme inscrite
   ici, cette strategie ne l'aurait pas fait rougir. Seule une mesure par FENETRE
   DE LECONS le verrait. C'est le manque le plus net laisse par B4. */
var EXPLOITABLES = ["la plus longue", "la plus detaillee", "le mot technique exclusif",
                    "l'echo de la question", "l'incise entre parentheses",
                    "la ponctuation finale unique"];
var CLEF_LONGUEUR = "la plus longue";

/* ------------------------------------------------------------------- la mesure */
var r = cp.spawnSync(process.execPath, [path.join(TOOLS, "mesure-biais-qcm.js"), "--json"],
  { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
if (r.status !== 0 || !r.stdout) {
  console.error("verif-qcm-biais : mesure-biais-qcm.js n'a pas rendu de mesure.");
  console.error((r.stderr || "").trim().slice(0, 500));
  process.exit(2);
}
var mesure;
try { mesure = JSON.parse(r.stdout); }
catch (e) { console.error("verif-qcm-biais : mesure illisible — " + e.message); process.exit(2); }

var actuel = {};
mesure.parCours.forEach(function (c) { actuel[c.cours] = c; });

/* -------------------------------------------------------------- la reference */
var ref = null;
if (fs.existsSync(REF)) {
  try { ref = JSON.parse(fs.readFileSync(REF, "utf8")); }
  catch (e) { console.error("verif-qcm-biais : qcm-biais-reference.json illisible — " + e.message); process.exit(1); }
}

function referenceNeuve(precedent) {
  var cours = {};
  Object.keys(actuel).sort().forEach(function (c) {
    var a = actuel[c];
    var vieux = precedent && precedent.cours && precedent.cours[c];
    cours[c] = {
      questions: a.questions,
      longueur: Number(a.longueur.toFixed(4)),
      pire: Number(a.taux.toFixed(4)),
      pireStrategie: a.meilleure,
      traite: vieux ? !!vieux.traite : false,
    };
  });
  return {
    "_lisez-moi": [
      "Le CLIQUET du biais des QCM. Chaque ligne est le taux de reussite d'un apprenant",
      "qui ne comprend rien, cours par cours, releve par tools/mesure-biais-qcm.js.",
      "`tools/verif-qcm-biais.js` echoue si un taux REMONTE de plus d'un point, si un cours",
      "marque `traite` repasse au-dessus de la cible, ou si un cours NEUF nait non conforme.",
      "Refiger avec --ecrire seulement APRES avoir ameliore un cours : jamais pour faire",
      "taire une regression. Passer `traite` a true quand un cours atteint la cible : il est",
      "alors verrouille a la cible et non plus a son taux du jour."
    ],
    cible: { longueur: 0.40, exploitable: 0.60 },
    tolerance: 0.01,
    releve: new Date().toISOString().slice(0, 10),
    total: { questions: mesure.questions, longueur: Number((mesure.strategies.filter(function (s) { return s.nom === CLEF_LONGUEUR; })[0] || {}).taux.toFixed(4)) },
    cours: cours,
  };
}

if (!ref) {
  if (!ECRIRE) {
    console.error("verif-qcm-biais : aucune reference. La creer une premiere fois avec --ecrire.");
    process.exit(2);
  }
  fs.writeFileSync(REF, JSON.stringify(referenceNeuve(null), null, 2) + "\n", "utf8");
  console.log("reference creee : tools/qcm-biais-reference.json (" + Object.keys(actuel).length + " cours)");
  process.exit(0);
}

var CIBLE = ref.cible || { longueur: 0.40, exploitable: 0.60 };
var TOL = typeof ref.tolerance === "number" ? ref.tolerance : 0.01;

/* ------------------------------------------------------------------- le verdict */
var fautes = [];
var progres = [];

Object.keys(actuel).sort().forEach(function (c) {
  var a = actuel[c];
  var v = ref.cours && ref.cours[c];
  var pireExploitable = { nom: "", taux: -1 };
  EXPLOITABLES.forEach(function (s) {
    var t = a.parStrategie[s];
    if (typeof t === "number" && t > pireExploitable.taux) pireExploitable = { nom: s, taux: t };
  });

  if (!v) {
    /* 3 — un cours neuf doit naitre conforme. */
    if (a.longueur > CIBLE.longueur || pireExploitable.taux > CIBLE.exploitable) {
      fautes.push({ quoi: "cours neuf non conforme", cours: c,
        dit: a.questions + " questions · longueur " + pc(a.longueur) + " (cible " + pc(CIBLE.longueur) + ")" +
          " · pire indice « " + pireExploitable.nom + " » " + pc(pireExploitable.taux) + " (cible " + pc(CIBLE.exploitable) + ")",
        faire: "etoffer les distracteurs avant de publier, comme l'ont fait doc, distribue et neurones" });
    }
    return;
  }
  /* 1 — la regression, quel que soit l'etat du cours. */
  if (a.longueur > v.longueur + TOL) {
    fautes.push({ quoi: "regression", cours: c,
      dit: "longueur " + pc(v.longueur) + " -> " + pc(a.longueur) + " (+" + ((a.longueur - v.longueur) * 100).toFixed(1) + " points, tolerance " + pc(TOL) + ")",
      faire: "la ou les questions ajoutees sont devinables a leur taille : etoffer leurs distracteurs" });
  }
  /* 2 — un cours traite reste sous la cible. */
  if (v.traite) {
    if (a.longueur > CIBLE.longueur) {
      fautes.push({ quoi: "cible perdue", cours: c,
        dit: "cours marque traite, longueur " + pc(a.longueur) + " au-dessus de la cible " + pc(CIBLE.longueur),
        faire: "reprendre les questions ajoutees depuis, ou retirer le marquage traite en l'expliquant" });
    }
    if (pireExploitable.taux > CIBLE.exploitable) {
      fautes.push({ quoi: "cible perdue", cours: c,
        dit: "cours marque traite, « " + pireExploitable.nom + " » a " + pc(pireExploitable.taux) + " (cible " + pc(CIBLE.exploitable) + ")",
        faire: "les distracteurs sont trop pauvres sur un autre indice que la longueur" });
    }
  }
  if (a.longueur < v.longueur - TOL) {
    progres.push({ cours: c, de: v.longueur, a: a.longueur });
  }
});

/* 4 — une reference qui ne designe plus rien. */
Object.keys(ref.cours || {}).forEach(function (c) {
  if (!actuel[c]) {
    fautes.push({ quoi: "reference orpheline", cours: c,
      dit: "declare dans la reference, aucune question trouvee sous pages/" + c,
      faire: "retirer sa ligne : le cours a ete renomme ou supprime" });
  }
});

function pc(x) { return (x * 100).toFixed(1) + " %"; }

var global = (mesure.strategies.filter(function (s) { return s.nom === CLEF_LONGUEUR; })[0] || {}).taux;
console.log("verif-qcm-biais — " + mesure.questions + " questions, " + Object.keys(actuel).length + " cours");
console.log("  reference du " + (ref.releve || "?") + " : " + Object.keys(ref.cours || {}).length + " cours, " +
  "global « la plus longue » " + pc((ref.total && ref.total.longueur) || 0) + " -> aujourd'hui " + pc(global));
console.log("  cible : longueur " + pc(CIBLE.longueur) + ", toute strategie exploitable " + pc(CIBLE.exploitable) +
  " · cours marques traites : " + Object.keys(ref.cours || {}).filter(function (c) { return ref.cours[c].traite; }).length);

if (DETAIL) {
  console.log("\n    cours                questions   longueur   reference   pire indice exploitable");
  Object.keys(actuel).sort(function (x, y) { return actuel[y].longueur - actuel[x].longueur; }).forEach(function (c) {
    var a = actuel[c], v = (ref.cours || {})[c];
    var pire = { nom: "", taux: -1 };
    EXPLOITABLES.forEach(function (s) { if (a.parStrategie[s] > pire.taux) pire = { nom: s, taux: a.parStrategie[s] }; });
    console.log("    " + (c + (v && v.traite ? " *" : "") + "                    ").slice(0, 20) +
      " " + ("      " + a.questions).slice(-9) +
      "   " + ("       " + pc(a.longueur)).slice(-8) +
      "   " + ("        " + (v ? pc(v.longueur) : "neuf")).slice(-9) +
      "   " + pc(pire.taux) + "  " + pire.nom);
  });
  console.log("    (* = cours marque traite, verrouille a la cible)");
}

if (progres.length) {
  console.log("\n  " + progres.length + " cours ont PROGRESSE depuis la reference :");
  progres.forEach(function (p) { console.log("    " + p.cours + " : " + pc(p.de) + " -> " + pc(p.a)); });
  console.log("  -> refiger avec --ecrire pour que le gain soit verrouille (et passer `traite` a true si la cible est atteinte).");
}

if (ECRIRE) {
  fs.writeFileSync(REF, JSON.stringify(referenceNeuve(ref), null, 2) + "\n", "utf8");
  console.log("\nreference refigee : tools/qcm-biais-reference.json");
}

if (!fautes.length) {
  console.log("\nOK — aucun cours n'a empire, aucun cours traite n'a perdu sa cible, aucun cours neuf hors cible.");
  process.exit(0);
}
console.log("\n" + fautes.length + " probleme(s) :");
fautes.forEach(function (f, i) {
  console.log("\n  " + (i + 1) + ". [" + f.quoi + "] cours " + f.cours);
  console.log("     " + f.dit);
  console.log("     -> " + f.faire);
});
console.log("\nECHEC — le biais des QCM a empire quelque part.");
process.exit(1);
