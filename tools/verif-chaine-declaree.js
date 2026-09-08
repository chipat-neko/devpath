/* =============================================================================
   verif-chaine-declaree.js — le garde-fou : aucun verificateur ne dort dehors
   sans qu'on l'ait ecrit.

   POURQUOI CET OUTIL EXISTE (point A5 du chantier V16). Le bilan du V15 a nomme
   le defaut qui domine sa fin : « un verificateur hors chaine vaut un
   verificateur inexistant, avec en plus l'illusion qu'il protege ». Le releve A1
   l'a chiffre : 35 outils hors chaine, dont verif-sorties.js qui trouvait deux
   vraies divergences que PERSONNE ne lisait. A2, A3 et A4 les ont fait rentrer.
   Sans ce garde-fou, le probleme reviendrait au chantier suivant : il suffit
   d'ecrire un nouveau verif-*.js et d'oublier de le brancher.

   CE QU'IL EXIGE, et il echoue sur chacun de ces quatre cas :
     1. un verificateur, une epreuve par injection ou une PREUVE que `verif.js` ne
        lance dans AUCUN mode, et qui n'est pas declare dans `tools/hors-chaine.json` ;
     2. une declaration dont la RAISON est vide, absente, ou plus courte que
        40 caracteres — « TODO » n'est pas une raison ;
     3. une declaration PERIMEE : l'outil est entre dans un mode entre-temps, la
        dette est payee, la ligne doit disparaitre (sinon la liste devient un
        cimetiere qu'on ne relit plus) ;
     4. une declaration ORPHELINE : le fichier declare n'existe plus.

   CE QUI A CHANGE AU POINT A4 DU CHANTIER V17. Il ne policait que deux familles
   decidees au PREFIXE du nom de fichier. Mesure : 70 fichiers lances par au moins un
   mode, 63 soumis, et SEPT outils capables de rougir que personne ne lancait, tous
   sous `tools/preuves/` — invisibles parce qu'ils ne s'appellent pas `verif-*`.
   L'ancien garde-fou, mis en presence d'un huitieme fabrique pour l'occasion, a
   imprime « OK » et rendu 0. Depuis A4 : la famille se decide sur le COMPORTEMENT
   (sortir en code non nul), et tout ce que `verif.js` lance est police d'office.

   Il ne lit PAS le source de verif.js a la grep : il demande a
   `recense-chaine.js --json`, qui demande lui-meme a `verif.js --lister` la liste
   de chaque mode. Recopier une liste au lieu de la lire est exactement ce qui a
   rendu la surveillance aveugle au chantier V16 lui-meme.

   USAGE
     node tools/verif-chaine-declaree.js           # verdict
     node tools/verif-chaine-declaree.js --detail  # + le tableau complet

   CODE DE SORTIE : 0 si tout est soit dans un mode, soit declare avec sa raison ;
   1 sinon ; 2 si le recensement lui-meme n'a pas pu tourner.
   ============================================================================= */
"use strict";

var fs = require("fs");
var path = require("path");
var cp = require("child_process");

var TOOLS = __dirname;
var DETAIL = process.argv.indexOf("--detail") !== -1;
var RAISON_MINI = 40;

/* -------------------------------------------------- le recensement, pas une copie */
var r = cp.spawnSync(process.execPath, [path.join(TOOLS, "recense-chaine.js"), "--json"],
  { encoding: "utf8", maxBuffer: 32 * 1024 * 1024 });
if (r.status !== 0 || !r.stdout) {
  console.error("verif-chaine-declaree : recense-chaine.js n'a pas rendu de recensement.");
  console.error((r.stderr || "").trim().slice(0, 500));
  process.exit(2);
}
var recens;
try { recens = JSON.parse(r.stdout); }
catch (e) { console.error("verif-chaine-declaree : recensement illisible — " + e.message); process.exit(2); }

/* QUI EST SOUMIS — deux regles, et la seconde a ete ajoutee au point A4 du
   chantier V17 parce que la premiere laissait un trou mesure.

   1. LES FAMILLES QUI PORTENT UN VERDICT. « verificateur » et « mutation » ne
      suffisaient pas : la famille « preuve » (tout fichier de `tools/preuves/` ou
      `preuve-*.js` capable de sortir en code non nul) echappait a tout, et la
      mesure du point A4 y a trouve SEPT outils sans aucun appelant — dont
      `exos-texte.js`, celui qui avait trouve les 13 exercices dont le champ
      `accept` appartenait a un autre enonce. Rien ne les relancait, et cet
      outil-ci imprimait « OK ».

   2. TOUT CE QUE `verif.js` LANCE EST POLICE, quelle que soit sa famille. Avant
      A4, le filtre par famille s'appliquait AVANT tout : 70 fichiers etaient
      lances par au moins un mode, 63 seulement etaient soumis — 13 etapes de la
      chaine (les `preuves/etude-*.js`, `build-sources-worker.js`…) n'etaient
      surveillees par rien. Le jour ou l'une d'elles sort d'un mode, elle tombe
      dans un angle mort au lieu de rougir ici. Un garde-fou qui ne connait pas
      la moitie de ce qu'il garde n'en garde aucune. */
var SOUMIS = ["verificateur", "mutation", "preuve"];
var outils = recens.tools.filter(function (t) {
  return SOUMIS.indexOf(t.famille) !== -1 || t.dansChaine;
});

/* ------------------------------------------------------- les declarations ecrites */
var CHEMIN = path.join(TOOLS, "hors-chaine.json");
var declare = {};
if (fs.existsSync(CHEMIN)) {
  try { declare = JSON.parse(fs.readFileSync(CHEMIN, "utf8")); }
  catch (e) {
    console.error("verif-chaine-declaree : tools/hors-chaine.json est illisible — " + e.message);
    process.exit(1);
  }
}
/* Les clefs de service (celles qui commencent par un souligne) ne sont pas des
   declarations : `_lisez-moi` porte le mode d'emploi du fichier. */
var clefs = Object.keys(declare).filter(function (k) { return k[0] !== "_"; });

var fautes = [];

/* 1 et 2 — ce qui est dehors doit etre declare, avec une raison qui en soit une. */
outils.forEach(function (t) {
  if (t.dansChaine) return;
  var d = declare[t.fichier];
  if (!d) {
    fautes.push({
      quoi: "non declare", fichier: t.fichier,
      dit: "hors de tous les modes de verif.js, et absent de tools/hors-chaine.json",
      faire: "le brancher dans un mode de verif.js, ou ecrire pourquoi il reste dehors",
    });
    return;
  }
  var raison = typeof d === "string" ? d : (d && d.raison) || "";
  if (raison.trim().length < RAISON_MINI) {
    fautes.push({
      quoi: "raison trop courte", fichier: t.fichier,
      dit: "raison de " + raison.trim().length + " caractere(s), il en faut au moins " + RAISON_MINI,
      faire: "ecrire ce qui a ete MESURE et ce qu'il faudrait pour le faire entrer",
    });
  }
});

/* 3 — une dette payee doit disparaitre de la liste. */
var parFichier = {};
outils.forEach(function (t) { parFichier[t.fichier] = t; });
clefs.forEach(function (f) {
  var t = parFichier[f];
  if (t && t.dansChaine) {
    fautes.push({
      quoi: "declaration perimee", fichier: f,
      dit: "declare hors chaine, mais verif.js le lance en " + t.modes.join(" "),
      faire: "retirer son entree de tools/hors-chaine.json : la dette est payee",
    });
  }
});

/* 4 — et une declaration qui ne designe plus rien non plus. */
clefs.forEach(function (f) {
  if (!fs.existsSync(path.join(TOOLS, f))) {
    fautes.push({
      quoi: "declaration orpheline", fichier: f,
      dit: "aucun fichier tools/" + f + " sur le disque",
      faire: "retirer son entree : le fichier a ete supprime ou renomme",
    });
  }
});

/* ------------------------------------------------------------------------ verdict */
var dedans = outils.filter(function (t) { return t.dansChaine; }).length;
var dehors = outils.length - dedans;
var declares = clefs.filter(function (f) { return parFichier[f] && !parFichier[f].dansChaine; }).length;

function combien(f) { return recens.tools.filter(function (t) { return t.famille === f; }).length; }
var horsFamille = outils.filter(function (t) { return SOUMIS.indexOf(t.famille) === -1; }).length;
console.log("verif-chaine-declaree — " + outils.length + " outils soumis au garde-fou " +
  "(" + combien("verificateur") + " verificateurs, " + combien("mutation") + " epreuves par injection, " +
  combien("preuve") + " preuves, + " + horsFamille + " etape(s) lancee(s) d'une autre famille)");
Object.keys(recens.parMode).forEach(function (m) {
  console.log("  verif.js " + (m === "(defaut)" ? "(sans option)" : m) + " lance " + recens.parMode[m].length + " etape(s)");
});
console.log("  dans un mode : " + dedans + "   hors chaine : " + dehors +
  " (dont " + declares + " declare(s) avec raison)");

if (DETAIL) {
  console.log("");
  outils.forEach(function (t) {
    var etat = t.dansChaine ? "chaine [" + t.modes.join(" ") + "]"
      : (declare[t.fichier] ? "hors chaine, declare" : "HORS CHAINE, NON DECLARE");
    console.log("  " + (t.fichier + "                                            ").slice(0, 46) + " " + etat);
  });
}

if (!fautes.length) {
  console.log("\nOK — tout verificateur est soit dans un mode, soit declare hors chaine avec sa raison.");
  process.exit(0);
}

console.log("\n" + fautes.length + " probleme(s) :");
fautes.forEach(function (f, i) {
  console.log("\n  " + (i + 1) + ". [" + f.quoi + "] tools/" + f.fichier);
  console.log("     " + f.dit);
  console.log("     -> " + f.faire);
});
console.log("\nECHEC — un verificateur hors chaine vaut un verificateur inexistant.");
process.exit(1);
