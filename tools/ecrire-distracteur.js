"use strict";
/* ecrire-distracteur.js — applique un lot de reecritures de DISTRACTEURS de QCM.
 *
 * Pourquoi cet outil existe : depuis le 33e cours de B4, chaque lot d'ecriture
 * refabriquait son propre script de remplacement dans scratchpad/, et deux d'entre
 * eux ont casse un bloc JSON (un heredoc avait mange un backslash, un autre avait
 * remplace un texte present DEUX fois dans la page). Le remplacement est toujours
 * le meme geste : il merite un outil qui REFUSE plutot qu'un script jetable qui
 * ecrit quand meme.
 *
 * Il refuse d'ecrire si :
 *   - le fichier, le bloc, la question ou l'option n'existent pas ;
 *   - l'option visee est la BONNE reponse (elle est intouchable) ;
 *   - le texte « avant » ne correspond pas au caractere pres ;
 *   - le bloc reecrit ne se relit pas en JSON ;
 *   - deux entrees du lot visent la meme option.
 *
 * Il tourne en APERCU par defaut. Il faut --ecrire pour toucher au disque.
 *
 * Usage :
 *   node tools/ecrire-distracteur.js <lot.json> [--ecrire]
 *
 * Format du lot (tableau d'objets) :
 *   [{ "fichier": "pages/pandas/lecon-01.html",
 *      "bloc": 0, "question": 0, "option": 1,
 *      "avant": "Une liste de listes Python sans etiquettes",
 *      "apres": "..." }]
 *
 * `bloc` numerote les blocs data-quiz ET data-quiz-bilan de la page, dans l'ordre
 * ou ils apparaissent ; `question` et `option` sont des index a partir de 0.
 */

var fs = require("fs");
var path = require("path");

var RACINE = path.resolve(__dirname, "..");
var args = process.argv.slice(2);
var ECRIRE = args.indexOf("--ecrire") !== -1;
var LOT = args.filter(function (a) { return a.indexOf("--") !== 0; })[0];

if (!LOT) {
  console.error("usage : node tools/ecrire-distracteur.js <lot.json> [--ecrire]");
  process.exit(2);
}

var RE_BLOC = /(<script type="application\/json" data-quiz(?:-bilan)?>\n)(\[\n[\s\S]*?\n\])(\n<\/script>)/g;

function blocsDe(src) {
  var out = [], m;
  RE_BLOC.lastIndex = 0;
  while ((m = RE_BLOC.exec(src))) {
    out.push({ debut: m.index + m[1].length, fin: m.index + m[1].length + m[2].length, json: m[2] });
  }
  return out;
}

function serialise(arr) {
  return "[\n" + arr.map(function (o) { return "  " + JSON.stringify(o); }).join(",\n") + "\n]";
}

var lot;
try {
  lot = JSON.parse(fs.readFileSync(path.resolve(LOT), "utf8"));
} catch (e) {
  console.error("lot illisible : " + e.message);
  process.exit(2);
}
if (!Array.isArray(lot)) { console.error("le lot doit etre un tableau"); process.exit(2); }

/* --------------------------------------------------- regroupement par fichier --- */
var parFichier = {};
var erreurs = [];
var vus = {};

lot.forEach(function (e, i) {
  var champs = ["fichier", "bloc", "question", "option", "avant", "apres"];
  for (var k = 0; k < champs.length; k++) {
    if (e[champs[k]] === undefined) { erreurs.push("entree " + i + " : champ « " + champs[k] + " » manquant"); return; }
  }
  var cle = e.fichier + "#" + e.bloc + "#" + e.question + "#" + e.option;
  if (vus[cle]) { erreurs.push("entree " + i + " : cette option est visee deux fois (" + cle + ")"); return; }
  vus[cle] = true;
  (parFichier[e.fichier] = parFichier[e.fichier] || []).push(e);
});

/* ------------------------------------------------------------- application ----- */
var aEcrire = [];
var applique = 0;

Object.keys(parFichier).forEach(function (rel) {
  var abs = path.resolve(RACINE, rel);
  if (!fs.existsSync(abs)) { erreurs.push(rel + " : fichier introuvable"); return; }
  var src = fs.readFileSync(abs, "utf8");
  var blocs = blocsDe(src);
  var tables = blocs.map(function (b) { return JSON.parse(b.json); });
  var touche = {};

  parFichier[rel].forEach(function (e) {
    var ref = rel + " bloc" + e.bloc + " q" + (e.question + 1) + " opt" + e.option;
    if (!blocs[e.bloc]) { erreurs.push(ref + " : bloc inexistant (" + blocs.length + " bloc(s))"); return; }
    var t = tables[e.bloc];
    if (!t[e.question]) { erreurs.push(ref + " : question inexistante (" + t.length + " question(s))"); return; }
    var q = t[e.question];
    if (!q.a || q.a[e.option] === undefined) { erreurs.push(ref + " : option inexistante"); return; }
    if (e.option === q.correct) { erreurs.push(ref + " : c'est la BONNE REPONSE, intouchable"); return; }
    if (q.a[e.option] !== e.avant) {
      erreurs.push(ref + " : le texte « avant » ne correspond pas\n        attendu : " + e.avant +
        "\n        trouve  : " + q.a[e.option]);
      return;
    }
    var lBon = Array.from(q.a[q.correct]).length;
    var lAv = Array.from(e.avant).length, lAp = Array.from(e.apres).length;
    if (lAp === lBon) {
      erreurs.push(ref + " : le nouveau texte fait EXACTEMENT la longueur de la bonne reponse (" +
        lBon + ") — plan-rangs-qcm le classera « plus court », hors fenetre");
      return;
    }
    q.a[e.option] = e.apres;
    touche[e.bloc] = true;
    applique++;
    console.log("  " + ref + "  " + lAv + " -> " + lAp + " car. (bonne reponse : " + lBon + ")");
    console.log("      " + e.apres);
  });

  /* reconstruction, du dernier bloc au premier pour ne pas decaler les index */
  var neuf = src;
  var idx = Object.keys(touche).map(Number).sort(function (a, b) { return b - a; });
  idx.forEach(function (b) {
    var s = serialise(tables[b]);
    try { JSON.parse(s); } catch (err) { erreurs.push(rel + " bloc" + b + " : le resultat n'est pas du JSON — " + err.message); return; }
    neuf = neuf.slice(0, blocs[b].debut) + s + neuf.slice(blocs[b].fin);
  });
  if (idx.length) aEcrire.push({ abs: abs, rel: rel, src: neuf, blocs: idx.length });
});

/* ------------------------------------------------------------------ verdict ---- */
console.log("");
if (erreurs.length) {
  console.error("REFUS D'ECRIRE — " + erreurs.length + " probleme(s) :");
  erreurs.forEach(function (e) { console.error("  " + e); });
  process.exit(1);
}

console.log(applique + " distracteur(s) reecrit(s) dans " + aEcrire.length + " fichier(s).");
if (!ECRIRE) {
  console.log("APERCU : rien n'a ete ecrit. Relance avec --ecrire.");
  process.exit(0);
}
aEcrire.forEach(function (f) {
  fs.writeFileSync(f.abs, f.src);
  console.log("  ecrit -> " + f.rel + " (" + f.blocs + " bloc(s))");
});
