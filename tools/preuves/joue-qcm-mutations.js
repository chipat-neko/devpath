"use strict";
/* =============================================================================
   tools/preuves/joue-qcm-mutations.js — ON CASSE LES QCM EXPRÈS, ET ON REGARDE
   SI LA SONDE QUI LES JOUE S'EN APERÇOIT. (Point A1 du chantier V18.)

   POURQUOI
   `tools/preuves/joue-qcm.js` rend « Aucun problème » sur les QCM du site. Un
   vert ne vaut que ce que vaut l'œil qui regarde : chaque faute ci-dessous vise
   UNE affirmation de la sonde, et la sonde doit rougir (code 1) en NOMMANT la
   faute visée — rougir pour une autre raison ne compte pas.

   LES FAUTES, dix, dont les trois que le plan exige :
     - une bonne réponse qui ne compte pas (deux formes : aucune, puis la seule
       première question — la plus discrète, le score dit N-1 / N) ;
     - un score qui ne s'enregistre pas dans `syntaxe-quiz` (plus deux formes
       voisines : les questions ratées perdues, le score rangé sous la mauvaise
       sorte) ;
     - une option en double (trois formes : le moteur affiche une option deux
       fois ; deux distracteurs identiques dans les DONNÉES d'un QCM de leçon —
       la sonde de B5 ne l'aurait pas vu ; un distracteur identique à la bonne
       réponse dans un QCM bilan) ;
     - et deux fautes du juge : un distracteur qui compte comme juste, un
       meilleur score d'avant qui n'est plus affiché.
   Huit fautes sont posées dans `js/lecon.js` (le moteur de QCM), deux dans le
   bloc JSON d'une leçon. Les motifs du moteur sont cherchés quelles que soient
   les fins de ligne (`motifSouple`, la parade du F1 du V16) et injectés avec
   celles du fichier ; les fautes de données passent par le JSON du bloc, donc
   ne dépendent pas des fins de ligne.

   Chaque fichier touché est restauré À L'OCTET PRÈS quoi qu'il arrive — fin
   normale, exception, Ctrl-C — et relu pour le vérifier. RÉSERVE HONNÊTE : un
   arrêt BRUTAL de la machine pendant une mutation laisserait le fichier
   modifié ; `git checkout -- <fichier>` le répare (et `verif.js --mutations`
   le restaure lui-même).

   Les deux moitiés de la preuve sont rejouées à chaque passage : la sonde
   doit être verte AVANT toute faute (témoin) et de nouveau APRÈS la
   restauration (témoin final), sur les deux mêmes pages.

   USAGE   node tools/preuves/joue-qcm-mutations.js
   Codes de sortie : 0 toutes vues · 1 une faute est passée (ou ne s'est pas
   posée) · 2 rien n'a pu être mesuré (sonde pas verte avant toute mutation
   ou après la restauration, Chrome absent, restauration en échec).
   ============================================================================= */
var fs = require("fs");
var path = require("path");
var cp = require("child_process");

var RACINE = path.resolve(__dirname, "..", "..");
var SONDE = path.join(RACINE, "tools", "preuves", "joue-qcm.js");
var MOTEUR = "js/lecon.js";
var PAGE_QUIZ = "pages/js/lecon-01.html";      /* un QCM de leçon */
var PAGE_BILAN = "pages/maths/lecon-13.html";  /* un QCM de leçon ET un QCM bilan */
var ECHANTILLON = [PAGE_QUIZ, PAGE_BILAN];

/* ------------------------------------------------------------ les fautes */
/* Fautes de moteur : un motif exact de js/lecon.js et son remplacement. */
var MUTATIONS = [
  {
    nom: "aucune bonne réponse ne compte",
    fichier: MOTEUR,
    de: "          if (ok) {\n            good++;",
    vers: "          if (ok) {\n            /* good++ retiré */",
    attendu: /toutes les bonnes réponses cochées, le score dit « Score : 0 \//
  },
  {
    nom: "la bonne réponse de la PREMIÈRE question ne compte pas",
    fichier: MOTEUR,
    de: "          if (ok) {\n            good++;",
    vers: "          if (ok) {\n            if (qi > 0) good++;",
    attendu: /toutes les bonnes réponses cochées, le score dit « Score : \d+ \//
  },
  {
    nom: "le score ne s'enregistre pas dans syntaxe-quiz",
    fichier: MOTEUR,
    de: "      q[courseId][lessonFile][scoreKey] = entree;\n      window.SyntaxeStore.setJSON(QKEY, q);",
    vers: "      q[courseId][lessonFile][scoreKey] = entree;",
    attendu: /après (\d+) \/ \1, syntaxe-quiz contient/
  },
  {
    nom: "les questions ratées ne s'enregistrent pas",
    fichier: MOTEUR,
    de: "      if (rates && rates.length) entree.rates = rates.slice();",
    vers: "      /* rates perdus */",
    attendu: /après 0 \/ \d+, syntaxe-quiz contient \{"best":0,"total":\d+\} au lieu/
  },
  {
    nom: "le score du bilan s'enregistre sous la sorte « quiz »",
    fichier: MOTEUR,
    de: "      q[courseId][lessonFile][scoreKey] = entree;",
    vers: "      q[courseId][lessonFile][\"quiz\"] = entree;",
    attendu: /\[bilan\] après (\d+) \/ \1, syntaxe-quiz contient/
  },
  {
    nom: "le moteur affiche une option deux fois",
    fichier: MOTEUR,
    de: "      opts = shuffle(opts);\n",
    vers: "      opts = shuffle(opts);\n      opts.push(opts[opts.length - 1]);\n",
    attendu: /option affichée en double/
  },
  {
    nom: "un distracteur compte comme une bonne réponse",
    fichier: MOTEUR,
    de: "          var ok = btn.getAttribute(\"data-correct\") === \"1\";",
    vers: "          var ok = true;",
    attendu: /un distracteur coché partout, le score dit « Score : (?!0 \/)/
  },
  {
    nom: "le meilleur score d'avant n'est plus affiché au chargement",
    fichier: MOTEUR,
    de: "    paintBest();\n\n    function updateScore() {",
    vers: "\n    function updateScore() {",
    attendu: /score d'avant mal relu : «\s*» au lieu de « 🏆 Meilleur score/
  },
  /* Fautes de données : posées dans le bloc JSON de la leçon, par le JSON lui-même. */
  {
    nom: "deux distracteurs identiques dans les données d'un QCM de leçon",
    fichier: PAGE_QUIZ,
    donnees: { bloc: "quiz", forme: "distracteur-double" },
    attendu: /\[quiz\] option affichée en double : q1\b/
  },
  {
    nom: "un distracteur identique à la bonne réponse dans un QCM bilan",
    fichier: PAGE_BILAN,
    donnees: { bloc: "bilan", forme: "copie-de-la-bonne" },
    attendu: /\[bilan\] bonne réponse dont le texte est aussi celui d'une autre option : q1\b/
  }
];

/* ------------------------------------------------------------ poser une faute */
var ORIGINAUX = {};
function lireOriginal(rel) {
  if (!ORIGINAUX[rel]) ORIGINAUX[rel] = fs.readFileSync(path.join(RACINE, rel));
  return ORIGINAUX[rel];
}
function motifSouple(texte) {
  return new RegExp(texte.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/\r?\n/g, "\\r?\\n"));
}

var RE_BLOC = {
  quiz: /(<script\b[^>]*\bdata-quiz(?=[\s>=\/])[^>]*>)([\s\S]*?)(<\/script>)/i,
  bilan: /(<script\b[^>]*\bdata-quiz-bilan\b[^>]*>)([\s\S]*?)(<\/script>)/i
};
/* Renvoie le texte muté, ou une chaîne d'explication commençant par « ! » si la faute
   ne peut pas se poser (elle sera comptée NON APPLICABLE, donc en échec). */
function muterDonnees(texte, d) {
  var m = RE_BLOC[d.bloc].exec(texte);
  if (!m) return "! bloc " + d.bloc + " introuvable";
  var contenu = m[2], data;
  try { data = JSON.parse(contenu); } catch (e) { return "! bloc " + d.bloc + " illisible : " + e.message; }
  var q = data[0], c = q.correct || 0;
  var distracteurs = q.a.map(function (_, i) { return i; }).filter(function (i) { return i !== c; });
  var source, cible;
  if (d.forme === "distracteur-double") {
    if (distracteurs.length < 2) return "! la question 1 n'a pas deux distracteurs";
    source = distracteurs[0]; cible = distracteurs[1];
  } else {
    source = c; cible = distracteurs[0];
  }
  var brutCible = JSON.stringify(q.a[cible]), brutSource = JSON.stringify(q.a[source]);
  var pos = contenu.indexOf(brutCible);
  if (pos < 0) return "! l'option visée n'est pas écrite telle quelle dans le bloc";
  var nouveau = contenu.slice(0, pos) + brutSource + contenu.slice(pos + brutCible.length);
  var relu;
  try { relu = JSON.parse(nouveau); } catch (e) { return "! la faute rend le bloc illisible"; }
  if (relu[0].a[cible] !== q.a[source]) return "! la faute ne s'est pas posée sur la question 1";
  return texte.slice(0, m.index) + m[1] + nouveau + m[3] + texte.slice(m.index + m[0].length);
}
function texteMute(mu) {
  var original = lireOriginal(mu.fichier).toString("utf8");
  if (mu.donnees) return muterDonnees(original, mu.donnees);
  if (!motifSouple(mu.de).test(original)) return "! le texte à muter n'existe plus dans " + mu.fichier;
  var NL = /\r\n/.test(original) ? "\r\n" : "\n";
  var vers = mu.vers.replace(/\r?\n/g, NL);
  return original.replace(motifSouple(mu.de), function () { return vers; });
}

/* ------------------------------------------------------------ restaurer, quoi qu'il arrive */
function restaurer() {
  Object.keys(ORIGINAUX).forEach(function (rel) {
    try { fs.writeFileSync(path.join(RACINE, rel), ORIGINAUX[rel]); } catch (e) { /* on retentera à la sortie */ }
  });
}
function intacts() {
  return Object.keys(ORIGINAUX).every(function (rel) {
    try { return fs.readFileSync(path.join(RACINE, rel)).equals(ORIGINAUX[rel]); } catch (e) { return false; }
  });
}
process.on("exit", restaurer);
process.on("SIGINT", function () { restaurer(); process.exit(2); });
process.on("SIGTERM", function () { restaurer(); process.exit(2); });
process.on("uncaughtException", function (e) {
  restaurer();
  console.log("ÉCHEC TECHNIQUE : " + (e && e.stack || e));
  process.exit(2);
});

function lancerSonde() {
  var r = cp.spawnSync(process.execPath, [SONDE, "--pages=" + ECHANTILLON.join(","), "--paralleles=2"],
    { encoding: "utf8", cwd: RACINE, timeout: 600000, maxBuffer: 32 * 1024 * 1024 });
  return { code: r.status, sortie: String(r.stdout || "") + String(r.stderr || "") };
}

/* ------------------------------------------------------------ l'épreuve */
var t0 = Date.now();
MUTATIONS.forEach(function (mu) { lireOriginal(mu.fichier); });
console.log("joue-qcm-mutations.js — " + MUTATIONS.length + " fautes posées dans le moteur de QCM et ses données ;");
console.log("  la sonde joue " + ECHANTILLON.join(" et ") + " à chaque fois\n");

var temoin = lancerSonde();
if (temoin.code !== 0) {
  restaurer();
  console.log("La sonde n'est PAS verte avant toute mutation (code " + temoin.code + ") : la mesure n'aurait pas de sens.");
  console.log(temoin.sortie.split("\n").slice(-16).join("\n"));
  process.exit(2);
}
var lignesTemoin = temoin.sortie.split("\n").filter(function (l) { return /questions jouées|durée/.test(l); }).map(function (l) { return l.trim(); });
console.log("[témoin] sans mutation : sonde VERTE (code 0) — " + lignesTemoin.join(" · ") + "\n");

var vues = 0, ratees = [], impossibles = [];
MUTATIONS.forEach(function (mu, i) {
  var tete = "[" + (i + 1) + "/" + MUTATIONS.length + "] " + mu.nom + " (" + mu.fichier + ")";
  var t = texteMute(mu);
  if (t.charAt(0) === "!") {
    impossibles.push(mu.nom + " — " + t.slice(2));
    console.log(tete + " : NON APPLICABLE — " + t.slice(2));
    return;
  }
  if (Buffer.from(t, "utf8").equals(ORIGINAUX[mu.fichier])) {
    impossibles.push(mu.nom + " — la faute ne change aucun octet");
    console.log(tete + " : NON APPLICABLE — la faute ne change aucun octet");
    return;
  }
  fs.writeFileSync(path.join(RACINE, mu.fichier), t, "utf8");
  var r = lancerSonde();
  restaurer();
  if (!intacts()) {
    console.log("ARRÊT — la restauration de " + mu.fichier + " a échoué.");
    process.exit(2);
  }
  var raison = (r.sortie.split("\n").filter(function (l) { return mu.attendu.test(l); })[0] || "").trim();
  if (r.code === 1 && raison) {
    vues++;
    console.log(tete + " : VUE (code 1)");
    console.log("        dit  " + raison.slice(0, 170));
  } else {
    var premiere = (r.sortie.split("\n").filter(function (l) { return /^\s{6}\S/.test(l); })[0] || "").trim();
    ratees.push(mu.nom + " (code " + r.code + (r.code === 1 ? ", mais pas pour la raison visée : " + premiere.slice(0, 120) : "") + ")");
    console.log(tete + " : PASSÉE INAPERÇUE — code " + r.code + (premiere ? " ; dit « " + premiere.slice(0, 120) + " »" : ""));
  }
});

restaurer();
/* L'autre moitié de la preuve : sans les fautes, la sonde REVERDIT. Un rouge ici, fichiers
   relus intacts, voudrait dire que la sonde rougit sans faute — la mesure ne vaudrait rien. */
var final = intacts() ? lancerSonde() : { code: null, sortie: "" };
console.log("\n[témoin final] fichiers restaurés, sonde relancée : " +
  (final.code === 0 ? "VERTE (code 0)" : "PAS VERTE (code " + final.code + ")"));
var duree = ((Date.now() - t0) / 1000).toFixed(1);
console.log("");
console.log("=== BILAN ===");
console.log("  fautes posées ...... " + MUTATIONS.length);
console.log("  VUES ............... " + vues);
console.log("  passées inaperçues . " + ratees.length);
console.log("  non applicables .... " + impossibles.length);
impossibles.forEach(function (s) { console.log("    - " + s); });
ratees.forEach(function (s) { console.log("    X " + s); });
console.log("  fichiers restaurés à l'octet près : " + (intacts() ? "oui" : "NON"));
console.log("  durée .............. " + duree + " s");
if (!intacts()) process.exit(2);
if (ratees.length || impossibles.length) process.exit(1);
if (final.code !== 0) {
  console.log("\n  La sonde ne reverdit pas sans les fautes : l'épreuve ne prouve rien.");
  console.log(final.sortie.split("\n").slice(-12).join("\n"));
  process.exit(2);
}
console.log("\n  Chaque faute posée dans le moteur de QCM ou ses données a rougi la sonde, pour la raison visée ;");
console.log("  sans elles, la sonde est verte avant et après.");
process.exit(0);
