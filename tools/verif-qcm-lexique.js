/* =============================================================================
   verif-qcm-lexique.js — le cliquet de l'INDICE LEXICAL des QCM.

   POURQUOI CET OUTIL EXISTE (B4 du chantier V16, cours `os`, le 2026-09-06).
   Un apprenant qui ne comprend rien peut ouvrir la lecon, chercher au clavier les
   mots de chaque option DANS LA PAGE, et choisir celle dont tout le vocabulaire
   figure dans le cours : la bonne reponse est ecrite avec les mots enseignes, un
   distracteur invente avec des mots que la page ne contient pas.

   ET C'EST LA CORRECTION QUI LE FABRIQUE. Mesure sur `os`, meme corpus, avant et
   apres la vague d'ecriture de B4 : le rendement de la variante STRICTE passe de
   38,1 % a 100,0 %. Le classement du site le confirme — les cours EN TETE sont
   exactement les cours DEJA DETORDUS (bdd, iac, mobile, os a 100 %) tandis que
   `c`, `go` et `haskell`, jamais traites, sont a 0,0 %. En allongeant les
   distracteurs avec du vocabulaire invente, on ferme la longueur en ouvrant le
   Ctrl+F. Sans cliquet, chaque cours traite reouvre la faille en silence.

   AUCUNE des 23 strategies de `mesure-biais-qcm.js` ne le voit : l'indice ne porte
   ni sur la longueur, ni sur la ponctuation, ni sur la forme. `verif-qcm-biais.js`
   est donc structurellement aveugle a cette regression-la.

   IL NE JUGE PAS LE PASSE, IL VERROUILLE LE PRESENT — meme principe que
   `verif-qcm-biais.js`, et pour la meme raison : le site entier est aujourd'hui a
   54,1 % de rendement sur la variante STRICTE. Un verificateur qui exigerait la
   cible tout de suite rougirait pendant des mois, donc ne serait plus lu.

   ⚠️ LA VARIANTE INVERSE, ajoutee le 2026-09-06, quelques heures apres cet outil.
   Le cours `mobile` a ete detordu selon la premiere consigne — « ZERO mot etranger
   dans les quatre options ». Les six lots l'ont tenue : STRICTE et PROPORTION sont
   passees de 100,0 % et 88,4 % a « ne tranche plus du tout ». ET CE CLIQUET EST
   RESTE VERT alors que le cours restait devinable a 100 % : la bonne reponse etant
   INTOUCHABLE, ses mots etrangers a elle sont restes pendant que les 219
   distracteurs passaient a zero, si bien qu'il suffisait de RETOURNER la regle —
   « choisis l'option qui contient un mot ABSENT de la page » — pour avoir juste
   37 fois sur 37. Un cliquet qui ne mesure qu'un sens d'un indice ne protege de
   rien : il deplace la faille. La variante INVERSE est donc surveillee ici au meme
   titre que les deux autres.

   TROIS ECHECS :
     1. REGRESSION — le rendement STRICTE, PROPORTION ou INVERSE d'un cours remonte
        de plus de LATITUDE (2 points) au-dessus de `tools/qcm-lexique-reference.json`.
        C'est le cas qui compte : il attrape la vague d'ecriture qui refabrique
        l'indice, au moment ou elle le fabrique.
     2. CIBLE PERDUE — un cours marque `traite: true` repasse au-dessus de la cible
        (60 % de rendement, la meme borne que celle des strategies exploitables de
        `verif-qcm-biais.js`) sur l'UNE QUELCONQUE des trois variantes.
     3. REFERENCE ORPHELINE — un cours de la reference qui n'existe plus sur disque.

   IL NE MESURE RIEN LUI-MEME : il demande la mesure a
   `mesure-lexique-qcm.js --json`. Recopier une mesure au lieu de la lire est le
   defaut qui a rendu la surveillance du projet aveugle a son propre chantier.

   USAGE
     node tools/verif-qcm-lexique.js            # verdict
     node tools/verif-qcm-lexique.js --detail   # + le tableau par cours
     node tools/verif-qcm-lexique.js --ecrire   # refiger la reference (APRES avoir
                                                #   ameliore un cours, jamais pour
                                                #   faire taire une regression)

   CODE DE SORTIE : 0 si rien n'a empire, 1 si un des trois cas se presente,
   2 si la mesure elle-meme n'a pas pu tourner.
   ============================================================================= */
"use strict";

var fs = require("fs");
var path = require("path");
var cp = require("child_process");

var TOOLS = __dirname;
var REF = path.join(TOOLS, "qcm-lexique-reference.json");
var DETAIL = process.argv.indexOf("--detail") !== -1;
var ECRIRE = process.argv.indexOf("--ecrire") !== -1;

var LATITUDE = 0.02;  /* 2 points : le bruit d'une reformulation isolee */
var CIBLE = 0.60;     /* rendement vise pour un cours declare traite */

function pc(x) { return (100 * x).toFixed(1) + " %"; }

/* ---- la mesure, demandee a l'outil qui la fait ---- */
var brut;
try {
  brut = cp.execFileSync(process.execPath,
    [path.join(TOOLS, "mesure-lexique-qcm.js"), "--json"],
    { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
} catch (e) {
  console.error("verif-qcm-lexique : la mesure n'a pas pu tourner — " + e.message);
  process.exit(2);
}
var mesure;
try { mesure = JSON.parse(brut); } catch (e) {
  console.error("verif-qcm-lexique : la mesure n'a pas rendu du JSON — " + e.message);
  process.exit(2);
}
var aujourdhui = mesure.cours || {};

/* ---- la reference ---- */
var ref = { date: null, cours: {} };
if (fs.existsSync(REF)) {
  try { ref = JSON.parse(fs.readFileSync(REF, "utf8")); } catch (e) {
    console.error("verif-qcm-lexique : reference illisible — " + e.message);
    process.exit(2);
  }
}
ref.cours = ref.cours || {};

if (ECRIRE) {
  var neuf = {
    _lisezMoi: [
      "Cliquet de l'INDICE LEXICAL des QCM (voir l'entete de tools/verif-qcm-lexique.js).",
      "`stricte` = rendement de « la seule option dont aucun mot n'est etranger a la page ».",
      "`proportion` = rendement de « l'option dont la part de mots du cours est la plus forte ».",
      "`inverse` = rendement de « l'option qui porte le PLUS de mots absents de la page » ;",
      "c'est le sens que la correction fabrique quand elle nettoie les distracteurs a zero.",
      "`traite: true` = cours dont l'indice lexical a ete ferme ; il ne peut plus repasser",
      "au-dessus de " + Math.round(CIBLE * 100) + " % sans faire echouer la chaine.",
      "Refiger APRES avoir ameliore un cours — jamais pour faire taire une regression."
    ],
    date: new Date().toISOString().slice(0, 10),
    cours: {}
  };
  Object.keys(aujourdhui).sort().forEach(function (c) {
    var a = aujourdhui[c], ancien = ref.cours[c] || {};
    neuf.cours[c] = {
      questions: a.questions,
      stricte: a.stricteRendement,
      stricteCouverture: a.stricteCouverture,
      proportion: a.proportionRendement,
      inverse: a.inverseRendement,
      inverseCouverture: a.inverseCouverture,
      traite: ancien.traite === true
    };
  });
  fs.writeFileSync(REF, JSON.stringify(neuf, null, 2) + "\n", "utf8");
  console.log("reference refigee : tools/qcm-lexique-reference.json");
  ref = neuf;
}

/* ---- les trois echecs ---- */
var regressions = [], ciblesPerdues = [], orphelins = [], progres = [];

Object.keys(ref.cours).forEach(function (c) {
  if (!aujourdhui[c]) orphelins.push(c);
});

Object.keys(aujourdhui).sort().forEach(function (c) {
  var a = aujourdhui[c], r = ref.cours[c];
  if (!r) return;
  /* `inverse` peut manquer d'une reference figee avant le 2026-09-06 : on ne
     compare que ce que la reference contient reellement. */
  var refInv = typeof r.inverse === "number" ? r.inverse : null;
  if (a.stricteRendement > r.stricte + LATITUDE) {
    regressions.push(c + " : STRICTE " + pc(r.stricte) + " -> " + pc(a.stricteRendement));
  } else if (a.proportionRendement > r.proportion + LATITUDE) {
    regressions.push(c + " : PROPORTION " + pc(r.proportion) + " -> " + pc(a.proportionRendement));
  } else if (refInv !== null && a.inverseRendement > refInv + LATITUDE) {
    regressions.push(c + " : INVERSE " + pc(refInv) + " -> " + pc(a.inverseRendement) +
                     "  (des distracteurs ont ete nettoyes SOUS le niveau de la bonne reponse)");
  } else if (a.stricteRendement < r.stricte - LATITUDE) {
    progres.push(c + " : STRICTE " + pc(r.stricte) + " -> " + pc(a.stricteRendement));
  }
  if (r.traite === true) {
    if (a.stricteRendement > CIBLE) {
      ciblesPerdues.push(c + " : marque traite, STRICTE a " + pc(a.stricteRendement) +
                         " (cible " + pc(CIBLE) + ")");
    }
    if (a.proportionRendement > CIBLE) {
      ciblesPerdues.push(c + " : marque traite, PROPORTION a " + pc(a.proportionRendement) +
                         " (cible " + pc(CIBLE) + ")");
    }
    if (a.inverseRendement > CIBLE) {
      ciblesPerdues.push(c + " : marque traite, INVERSE a " + pc(a.inverseRendement) +
                         " (cible " + pc(CIBLE) + ")");
    }
  }
});

if (DETAIL) {
  console.log("\n  cours            questions   STRICTE (couv.)      PROPORTION   INVERSE (couv.)   traite");
  Object.keys(aujourdhui).sort(function (x, y) {
    return aujourdhui[y].stricteRendement - aujourdhui[x].stricteRendement;
  }).forEach(function (c) {
    var a = aujourdhui[c], r = ref.cours[c] || {};
    console.log("  " + c.padEnd(16) + String(a.questions).padStart(6) + "   " +
      pc(a.stricteRendement).padStart(8) + " (" + pc(a.stricteCouverture).padStart(7) + ")   " +
      pc(a.proportionRendement).padStart(9) + "   " +
      pc(a.inverseRendement).padStart(8) + " (" + pc(a.inverseCouverture).padStart(7) + ")   " +
      (r.traite ? "oui" : "-"));
  });
}

var g = mesure.global || {};
console.log("\n  reference du " + (ref.date || "—") + " : " + Object.keys(ref.cours).length +
            " cours · latitude " + pc(LATITUDE) + " · cible " + pc(CIBLE) +
            " pour un cours marque traite");
if (g.n) {
  console.log("  site : " + g.n + " questions · STRICTE tranche sur " + pc(g.sTr / g.n) +
              " et rend " + pc(g.sTr ? g.sOk / g.sTr : 0) +
              " · PROPORTION rend " + pc(g.pTr ? g.pOk / g.pTr : 0) +
              " · INVERSE tranche sur " + pc(g.iTr / g.n) + " et rend " + pc(g.iTr ? g.iOk / g.iTr : 0));
}

if (progres.length) {
  console.log("\n  " + progres.length + " cours ont PROGRESSE depuis la reference :");
  progres.forEach(function (l) { console.log("    " + l); });
  console.log("  -> refiger avec --ecrire pour que le gain soit verrouille.");
}

var echecs = 0;
if (regressions.length) {
  echecs += regressions.length;
  console.log("\nECHEC — l'indice lexical a EMPIRE sur " + regressions.length + " cours :");
  regressions.forEach(function (l) { console.log("    " + l); });
  console.log("  Une vague d'ecriture vient probablement d'allonger des distracteurs avec du");
  console.log("  vocabulaire absent de la lecon — ou, pour l'INVERSE, de nettoyer les trois");
  console.log("  distracteurs a zero alors que la bonne reponse, elle, garde des mots etrangers.");
  console.log("  `node tools/mesure-lexique-qcm.js --liste=<cours>` donne le travail exact :");
  console.log("  si la bonne reponse porte k mots etrangers, DEUX distracteurs a zero, UN a k.");
}
if (ciblesPerdues.length) {
  echecs += ciblesPerdues.length;
  console.log("\nECHEC — " + ciblesPerdues.length + " cours marque(s) traite(s) ont perdu la cible :");
  ciblesPerdues.forEach(function (l) { console.log("    " + l); });
}
if (orphelins.length) {
  echecs += orphelins.length;
  console.log("\nECHEC — " + orphelins.length + " cours de la reference n'existe(nt) plus :");
  orphelins.forEach(function (l) { console.log("    " + l); });
}

if (!echecs) {
  console.log("\nOK — l'indice lexical n'a empire nulle part, aucun cours traite n'a perdu sa cible.");
}
process.exit(echecs ? 1 : 0);
