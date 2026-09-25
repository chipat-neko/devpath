/* Simule un remplacement de distracteur et verifie SIX contraintes AVANT ecriture.
   La question est designee par un FRAGMENT de son enonce (les index du corpus ne sont
   pas stables : readdirSync change d'ordre apres une reecriture des fichiers).
   usage : node essai.js "<fragment de l'enonce>" [<index option> "<nouveau texte>"] */
var fs = require("fs"), path = require("path");
var RACINE = path.join(__dirname, "..", "..");
var m = require("../../tools/mesure-biais-qcm.js");
var corpus = m.lireCorpus().filter(function (q) { return q.cours === "vue"; });

function dens(t) { var w = t.match(/[A-Za-zÀ-ÿ0-9_]+/g) || []; return w.length ? w.join("").length / w.length : 0; }
function nmots(t) { return (t.match(/[A-Za-zÀ-ÿ0-9_]+/g) || []).length; }
/* meme definition que tools/mesure-lexique-qcm.js : mots de contenu = 6 lettres et plus */
function motsLongs(t) {
  var w = String(t).toLowerCase().match(/[a-zà-öø-ÿ][a-zà-öø-ÿ'-]{5,}/g) || [];
  return w.map(function (x) { return x.replace(/^[' -]+|[' -]+$/g, ""); }).filter(Boolean);
}
function excl(a) {
  var sets = a.map(function (t) { return new Set(t.toLowerCase().match(/[a-zà-ÿ][a-zà-ÿ-]{8,}/g) || []); });
  return sets.map(function (s, i) {
    var out = [];
    s.forEach(function (w) { if (!sets.some(function (o, j) { return j !== i && o.has(w); })) out.push(w); });
    return out;
  });
}
function rangs(a) {
  var L = a.map(function (t) { return t.length; });
  var tri = L.slice().sort(function (x, y) { return y - x; });
  return L.map(function (v) { return tri.indexOf(v); });
}

var frag = process.argv[2], j = Number(process.argv[3]), neuf = process.argv[4];
var trouves = corpus.filter(function (q) { return q.q.indexOf(frag) >= 0; });
if (trouves.length !== 1) { console.log("REFUS : " + trouves.length + " question(s) pour ce fragment"); process.exit(1); }
var q = trouves[0];

/* vocabulaire de la page, blocs de quiz exclus — comme mesure-lexique-qcm */
var src = fs.readFileSync(path.join(RACINE, "pages", "vue", q.fichier), "utf8");
var vocab = new Set(motsLongs(src.replace(/<script[^>]*data-quiz(?:-bilan)?[^>]*>[\s\S]*?<\/script>/g, " ")));
function etrangers(t) {
  return Array.from(new Set(motsLongs(t))).filter(function (w) { return !vocab.has(w); });
}

var avant = q.a.slice(), apres = q.a.slice();
if (neuf !== undefined) apres[j] = neuf;
function tableau(a, titre) {
  var e = excl(a), r = rangs(a);
  console.log(titre);
  a.forEach(function (t, k) {
    var et = etrangers(t);
    console.log("   " + (k === q.k ? "*B" : " d" + k) + " car=" + String(t.length).padStart(4) +
      " rang=" + r[k] + " mots=" + String(nmots(t)).padStart(3) +
      " dens=" + dens(t).toFixed(3) + " w=" + String(motsLongs(t).length).padStart(2) +
      " k=" + et.length + " " + JSON.stringify(et) + " excl=" + e[k].length);
    if (neuf === undefined) console.log("       " + t);
  });
  return { e: e, r: r };
}
var A = tableau(avant, "AVANT " + q.fichier + (q.bilan ? " [BILAN]" : "") + " — " + q.q.slice(0, 60));
if (neuf === undefined) process.exit(0);
var B = tableau(apres, "APRES");
var ok = true;
function test(nom, cond) { console.log((cond ? "  OK   " : "  ECHEC") + " " + nom); if (!cond) ok = false; }
test("densite du distracteur > densite de la bonne", dens(apres[j]) > dens(apres[q.k]));
test("la bonne reste seule la moins bavarde", apres.every(function (t, k) { return k === q.k || nmots(t) > nmots(apres[q.k]); }));
test("rangs de longueur inchanges", JSON.stringify(A.r) === JSON.stringify(B.r));
test("mots 9+ exclusifs inchanges par option", JSON.stringify(A.e.map(function (x) { return x.length; })) === JSON.stringify(B.e.map(function (x) { return x.length; })));
test("w (mots de 6+) egal a celui de la bonne", motsLongs(apres[j]).length === motsLongs(apres[q.k]).length);
test("k (mots etrangers) egal a celui de la bonne", etrangers(apres[j]).length === etrangers(apres[q.k]).length);
process.exitCode = ok ? 0 : 1;
