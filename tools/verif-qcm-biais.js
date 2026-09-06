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
        a `tools/qcm-biais-reference.json`, que ce soit sur l'ECART AU HASARD de la
        longueur ou sur son PIRE INDICE exploitable. Ajouter une question devinable
        a un cours existant est desormais impossible sans le voir.
     2. CIBLE PERDUE — un cours marque `traite: true` qui repasse au-dessus de la
        cible (bande 10-40 % sur la longueur, 60 % sur toute strategie
        exploitable). Le travail de B3 et B4 ne peut pas se defaire en silence.
     3. COURS NEUF NON CONFORME — un cours absent de la reference doit naitre sous
        la cible. Les cours ecrits apres le constat le prouvent faisable.
     4. REFERENCE ORPHELINE — un cours de la reference qui n'existe plus sur le
        disque, sinon la reference devient un cimetiere qu'on ne relit plus.

   ⚠️ LA CIBLE EST UNE BANDE, PAS UN PLAFOND (mesure du 2026-09-06). « Le plus bas
   possible » est un contresens sur la longueur : `doc`, a 0,0 % — le meilleur
   chiffre du site — se laissait deviner 60,2 % du temps par « la DEUXIEME plus
   longue ». Ce qui compte est la DISTANCE AU HASARD (25,0 %), dans les deux sens.

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

   AJOUT B4 (2026-09-07, cours `stats`) : « ECARTER l'echo de la question ». C'est la
   PREMIERE strategie INVERSE du cliquet, et elle repare un defaut de l'OUTIL, pas du
   contenu : les vingt-trois strategies precedentes sont toutes directionnelles sauf
   quatre. Un indice qu'on ferme trop fort ne disparait pas, il SE RETOURNE — lecon du
   cours `mobile` transposee a la forme de la mesure. Declencheur : sur `stats` detordu,
   « l'echo » tombe a 10,9 %, tres SOUS le hasard.

   ⚠️ CE QUE LA MESURE A DIT, ET QUI CORRIGE CE QUE J'ATTENDAIS. La note qui reclamait
   cet ajout (`scratchpad/b4-echo-inverse.md`) annoncait qu'il ferait remonter `pire`
   « sur une dizaine de cours d'un coup ». Mesure faite : il le fait remonter sur DEUX
   (`stats` 27,1 % -> 32,6 %, `data-eng` 29,0 % -> 30,4 %), et le plus haut du site est
   `doc` a 34,2 %, tres loin de la cible de 60 %. Personne ne rougit. La reference est
   tout de meme refigee dans LE MEME COMMIT : ce n'est pas une regression, c'est une
   dimension neuve.

   NON retenue, et il faut dire pourquoi : « ECARTER la plus detaillee » vaut 12,4 % sur
   le site et ne depasse le hasard NULLE PART (25,2 % au plus haut, sur `stats`). Elle
   reste MESUREE par mesure-biais-qcm.js — c'est la trajectoire qui compte — mais elle
   n'a pas sa place dans un cliquet tant qu'aucun cours n'est exploitable dessus.

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
   DE LECONS le verrait. C'est le manque le plus net laisse par B4.

   AJOUT B4 (2026-09-06) : LES TROIS STRATEGIES DE RANG, et c'est le trou le plus
   grave que ce cliquet ait eu. `mesure-biais-qcm.js` sait depuis le 2026-09-05
   que corriger « la plus longue » ne ferme pas le biais mais le DEPLACE d'un
   rang ; le cliquet, lui, ne l'avait jamais appris. Resultat mesure : `doc`
   affichait 0,0 % sur la longueur -- le meilleur chiffre du site -- et se
   laissait deviner 60,2 % du temps par « la DEUXIEME plus longue », sans qu'une
   seule ligne rouge le dise. Un cliquet aveugle a la moitie du phenomene qu'il
   surveille vaut l'illusion de protection, pas la protection.
   Verifie avant de les inscrire, comme pour les deux precedentes : une fois
   `doc` et `archi` repris, les 18 cours marques `traite` sont entre 25,3 %
   (`ruby`) et 36,3 % (`iac`) sur la pire des trois, et le cours le plus expose
   du site entier est `neurones` a 42,6 % -- donc les ajouter ne fait rougir
   personne aujourd'hui. */
/* AJOUT B4 (2026-09-06, cours `git`) : « la seule qui nie ». Le plan la laissait en
   suspens depuis deux passes, faute d'avoir mesure ce que son entree coute. Mesure
   faite avant de l'ecrire : 31,3 % de reussite sur le site pour 31,2 % de couverture,
   soit un RENDEMENT de 40,6 % la ou elle tranche — nettement au-dessus du hasard, et
   c'est le critere retenu depuis la lecon du cours `doc` (la reussite moyenne noie un
   indice rare). Ce qu'elle coute aujourd'hui : RIEN. AUCUN des 90 cours n'est au-dessus
   de la cible de 60 % ; le plus haut du site est `crypto` a 46,1 %, puis `cicd` 43,6 % et
   `data-eng` 41,9 %, et le plus haut des 19 cours traites est `mobile` a 41,0 % — 13,9
   points de marge. C'est exactement la condition posee en B2 pour qu'un cliquet reste lu :
   il ne rougit sur personne le jour ou on l'ajoute, il fige la cible pour la suite. */
var EXPLOITABLES = ["la plus longue", "la plus detaillee", "le mot technique exclusif",
                    "l'echo de la question", "l'incise entre parentheses",
                    "la ponctuation finale unique", "la seule qui nie",
                    "la DEUXIEME plus longue", "la TROISIEME plus longue",
                    "ecarter les deux extremes", "ECARTER l'echo de la question"];
var CLEF_LONGUEUR = "la plus longue";

/* L'AVANTAGE que « la plus longue » donne a l'apprenant n'est PAS son taux : c'est
   sa DISTANCE AU HASARD. Un cours ou la bonne reponse n'est JAMAIS la plus longue
   (0,0 %) est exactement aussi exploitable qu'un cours ou elle l'est toujours
   (100 %) -- il suffit d'inverser la regle, et c'est ce que fait « la DEUXIEME
   plus longue ». Mesure du 2026-09-06 : le cliquet a compte pour une REGRESSION
   de 25 points le passage de `doc` de 0,0 % a 25,0 %, alors que son pire indice
   tombait dans le meme temps de 60,2 % a 44,1 %. Un critere qui punit la
   correction qu'il reclame ne peut pas etre suivi longtemps. */
var HASARD = 0.25;
function avantage(t) { return Math.abs(t - HASARD); }

/* LE PLANCHER, et c'est la CONTRE-EPREUVE de l'epreuve par injection qui l'a
   impose. Une fois `doc` ramene a 25,0 % pile sur la longueur, son ecart au
   hasard vaut ZERO -- et un cours a zero d'ecart ne peut plus que remonter :
   ajouter six questions PARFAITEMENT EQUILIBREES le faisait passer a 22,9 %,
   soit 2,1 points d'ecart, donc au-dessus de la tolerance d'un point. Le cliquet
   rougissait sur une modification irreprochable. C'est le defaut inverse de
   celui qu'on redoute, et il est aussi grave : un outil qui rougit sur le travail
   bien fait cesse d'etre lu aussi surement qu'un outil qui ne rougit jamais.
   Le plancher applique ici la regle deja retenue par B1 pour ECARTER trois
   strategies : entre 26,3 % et 30,2 %, c'est-a-dire a moins de 5,2 points du
   hasard, un indice ne discrimine pas. On ne police donc pas un ecart de 5
   points ou moins ; au-dela, la tolerance d'un point reprend. */
var PLANCHER = 0.05;
function avantageSurveille(t) { return Math.max(avantage(t) - PLANCHER, 0); }

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

/* La PIRE strategie EXPLOITABLE d'un cours. Elle sert au verdict comme a la
   reference : les deux doivent lire la meme quantite, sans quoi le cliquet se
   compare a un chiffre qu'il ne calcule pas. La reference figeait jusqu'ici
   `a.taux`, c'est-a-dire la meilleure de TOUTES les strategies mesurees, y
   compris celles que B1 a ecartees a dessein. */
function pireExploitableDe(a) {
  var pire = { nom: "", taux: -1 };
  EXPLOITABLES.forEach(function (s) {
    var t = a.parStrategie[s];
    if (typeof t === "number" && t > pire.taux) pire = { nom: s, taux: t };
  });
  return pire;
}

function referenceNeuve(precedent) {
  var cours = {};
  Object.keys(actuel).sort().forEach(function (c) {
    var a = actuel[c];
    var vieux = precedent && precedent.cours && precedent.cours[c];
    var pe = pireExploitableDe(a);
    cours[c] = {
      questions: a.questions,
      longueur: Number(a.longueur.toFixed(4)),
      pire: Number(pe.taux.toFixed(4)),
      pireStrategie: pe.nom,
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
  var pireExploitable = pireExploitableDe(a);

  /* La cible « longueur <= 40 % » de B1 se lit desormais comme un ECART au hasard :
     40 % - 25 % = 15 points, donc la bande admise est [10 %, 40 %]. Un cours a
     0,0 % en sort, et c'est voulu -- voir le commentaire de `avantage`. */
  var ECART_CIBLE = CIBLE.longueur - HASARD;
  var horsBande = avantage(a.longueur) > ECART_CIBLE;

  if (!v) {
    /* 3 — un cours neuf doit naitre conforme. */
    if (horsBande || pireExploitable.taux > CIBLE.exploitable) {
      fautes.push({ quoi: "cours neuf non conforme", cours: c,
        dit: a.questions + " questions · longueur " + pc(a.longueur) + " (bande admise "
          + pc(HASARD - ECART_CIBLE) + " a " + pc(CIBLE.longueur) + ")" +
          " · pire indice « " + pireExploitable.nom + " » " + pc(pireExploitable.taux) + " (cible " + pc(CIBLE.exploitable) + ")",
        faire: "etoffer les distracteurs avant de publier, comme l'ont fait doc, distribue et neurones" });
    }
    return;
  }
  /* 1 — la regression, quel que soit l'etat du cours. Elle se juge sur l'ECART AU
     HASARD de la longueur et sur le PIRE INDICE, jamais sur le taux brut. */
  if (avantageSurveille(a.longueur) > avantageSurveille(v.longueur) + TOL) {
    fautes.push({ quoi: "regression", cours: c,
      dit: "longueur " + pc(v.longueur) + " -> " + pc(a.longueur) + " : l'ecart au hasard passe de "
        + ((avantage(v.longueur)) * 100).toFixed(1) + " a " + ((avantage(a.longueur)) * 100).toFixed(1)
        + " points (tolerance " + pc(TOL) + ")",
      faire: "la ou les questions ajoutees sont devinables a leur taille : etoffer leurs distracteurs" });
  }
  if (typeof v.pire === "number" && pireExploitable.taux > v.pire + TOL) {
    fautes.push({ quoi: "regression", cours: c,
      dit: "pire indice " + pc(v.pire) + " (« " + (v.pireStrategie || "?") + " ») -> "
        + pc(pireExploitable.taux) + " (« " + pireExploitable.nom + " »), tolerance " + pc(TOL),
      faire: "le biais s'est deplace sur un autre indice que celui qu'on venait de fermer" });
  }
  /* 2 — un cours traite reste sous la cible. */
  if (v.traite) {
    if (horsBande) {
      fautes.push({ quoi: "cible perdue", cours: c,
        dit: "cours marque traite, longueur " + pc(a.longueur) + " hors de la bande admise "
          + pc(HASARD - ECART_CIBLE) + " a " + pc(CIBLE.longueur),
        faire: "reprendre les questions ajoutees depuis, ou retirer le marquage traite en l'expliquant" });
    }
    if (pireExploitable.taux > CIBLE.exploitable) {
      fautes.push({ quoi: "cible perdue", cours: c,
        dit: "cours marque traite, « " + pireExploitable.nom + " » a " + pc(pireExploitable.taux) + " (cible " + pc(CIBLE.exploitable) + ")",
        faire: "les distracteurs sont trop pauvres sur un autre indice que la longueur" });
    }
  }
  if (avantageSurveille(a.longueur) < avantageSurveille(v.longueur) - TOL
      || (typeof v.pire === "number" && pireExploitable.taux < v.pire - TOL)) {
    progres.push({ cours: c, de: v.longueur, a: a.longueur,
      pireDe: v.pire, pireA: pireExploitable.taux });
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
  progres.forEach(function (p) {
    console.log("    " + p.cours + " : longueur " + pc(p.de) + " -> " + pc(p.a)
      + "   pire indice " + (typeof p.pireDe === "number" ? pc(p.pireDe) : "?") + " -> " + pc(p.pireA));
  });
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
