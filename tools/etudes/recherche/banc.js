/* Banc d'essai de la recherche : ce qu'un index pré-calculé coûte, et ce qu'il évite.

   Rien n'est chronométré ici — un temps varie d'une machine à l'autre et d'une
   exécution à l'autre. On compte des OPÉRATIONS : elles, elles sont les mêmes
   partout, et c'est ce qui rend cette sortie reproductible.

   La fonction de décodage ci-dessous n'est pas une imitation : elle est extraite de
   js/recherche.js à chaque assemblage de la page.

   @@ORIGINE@@ */

/* ------------------------------------------- A. Décoder de vrais postings du site */

/* Une entrée réelle de l'index publié : le mot « @@TEMOIN@@ » et la liste des leçons
   qui le contiennent. Copiée depuis js/search-index.js à l'assemblage. */
var INV = { "@@TEMOIN@@": "@@BRUT@@" };

@@POSTINGS@@

console.log("A. Décoder l'index tel qu'il est publié");
console.log('  la chaîne brute pour « @@TEMOIN@@ » : @@BRUT@@');
var decode = postings("@@TEMOIN@@");
console.log("  une fois décodée : " + decode.length + " leçons");
decode.forEach(function (p) {
  console.log("    leçon nº " + p[0] + "   le mot y apparaît " + p[1] + " fois");
});
console.log("  chaque nombre écrit dans l'index est un ÉCART, en base 36 :");
console.log("    " + "@@BRUT@@".split(",").map(function (p, i) {
  var d = p.indexOf(".") === -1 ? p : p.slice(0, p.indexOf("."));
  return d + "(base 36) = " + parseInt(d, 36) + (i ? " de plus" : "");
}).join(", "));

/* --------------------- B. Ce que l'index évite : le balayage de tous les documents */

/* Corpus DÉTERMINISTE. Un générateur congruentiel à graine fixe : la même suite de
   nombres partout, donc le même corpus dans Node et dans le navigateur. */
var graine = 12345;
function alea(n) { graine = (graine * 48271) % 2147483647; return graine % n; }

var RACINES = ["var", "fonc", "tabl", "object", "class", "boucl", "index", "cle", "valeur", "type"];
var SUFFIXES = ["", "s", "er", "ion", "able", "ique"];
var VOCAB = [];
RACINES.forEach(function (r) { SUFFIXES.forEach(function (s) { VOCAB.push(r + s); }); });
while (VOCAB.length < 1000) VOCAB.push("mot" + VOCAB.length);

/* 1 523 documents : le nombre de leçons du site. Le corpus, lui, est synthétique —
   on mesure un coût, pas un contenu. */
var DOCS = 1523, PAR_DOC = 40;
var corpus = [];
for (var d = 0; d < DOCS; d++) {
  var doc = [];
  for (var w = 0; w < PAR_DOC; w++) doc.push(VOCAB[alea(VOCAB.length)]);
  corpus.push(doc);
}

/* Le balayage naïf : pour trouver les documents contenant un terme, on regarde
   chaque mot de chaque texte. C'est ce que fait une recherche sans index. */
function balayage(terme) {
  var vus = 0, trouves = [];
  for (var i = 0; i < corpus.length; i++) {
    var dedans = false;
    for (var j = 0; j < corpus[i].length; j++) {
      vus++;
      if (corpus[i][j].indexOf(terme) !== -1) dedans = true;
    }
    if (dedans) trouves.push(i);
  }
  return { vus: vus, trouves: trouves };
}

/* La construction de l'index inverse : mot → liste des documents. Elle coûte
   exactement un balayage complet… mais UNE SEULE FOIS, et pas chez le visiteur. */
var construitVus = 0;
var inverse = Object.create(null);
for (var i2 = 0; i2 < corpus.length; i2++) {
  for (var j2 = 0; j2 < corpus[i2].length; j2++) {
    construitVus++;
    var m = corpus[i2][j2];
    if (!inverse[m]) inverse[m] = [];
    if (inverse[m][inverse[m].length - 1] !== i2) inverse[m].push(i2);
  }
}
var CLEFS = Object.keys(inverse);

/* La recherche avec index : on ne regarde plus les documents, seulement les CLEFS.
   `sousChaine` est le test que fait réellement js/recherche.js. */
function parIndex(terme, sousChaine) {
  var vus = 0, dedans = Object.create(null);
  for (var k = 0; k < CLEFS.length; k++) {
    vus++;
    var W = CLEFS[k];
    var colle = sousChaine ? W.indexOf(terme) !== -1 : W.indexOf(terme) === 0;
    if (!colle) continue;
    var liste = inverse[W];
    for (var p = 0; p < liste.length; p++) dedans[liste[p]] = 1;
  }
  return { vus: vus, trouves: Object.keys(dedans) };
}

console.log("");
console.log("B. Chercher « index » dans " + DOCS + " documents de " + PAR_DOC + " mots");
var b = balayage("index");
var x = parIndex("index", true);
console.log("  sans index — mots examinés ....... " + b.vus + "   (" + b.trouves.length + " documents trouvés)");
console.log("  avec index — clefs examinées ..... " + x.vus + "   (" + x.trouves.length + " documents trouvés)");
console.log("  les deux trouvent le même ensemble : " + (b.trouves.join(",") === x.trouves.join(",")));
console.log("  rapport ............................ " + Math.round(b.vus / x.vus) + " fois moins d'examens");
console.log("  ce que l'index a coûté à construire : " + construitVus + " mots examinés, UNE fois");
console.log("  amorti dès la ...................... " + (Math.ceil(construitVus / (b.vus - x.vus)) + 1) + "ᵉ recherche");

/* ------------------------- C. Le prix de la recherche par sous-chaîne */

console.log("");
console.log("C. Sous-chaîne ou préfixe ? le même coût, pas les mêmes résultats");
["index", "dex", "bje"].forEach(function (t) {
  var s = parIndex(t, true), p = parIndex(t, false);
  console.log(
    ("  « " + t + " »").padEnd(16) +
    " sous-chaîne : " + String(s.trouves.length).padStart(3) + " documents" +
    "   ·   préfixe : " + String(p.trouves.length).padStart(3) + " documents" +
    "   ·   clefs examinées : " + s.vus + " dans les deux cas"
  );
});
