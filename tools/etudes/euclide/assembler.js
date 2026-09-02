/* Assemble pages/etude-euclide.html.

   Comme pour les quatre études précédentes : aucun code recopié à la main, aucun
   chiffre écrit de tête. En plus ici — parce que le texte de la page NOMME des paires
   (89, 55), (987, 610), (6765, 4181) — l'assembleur vérifie que ces paires sont bien
   celles que la mesure désigne, et refuse d'écrire sinon. Une valeur citée dans une
   phrase est aussi fragile qu'une valeur citée dans un tableau. */

var fs = require("fs");
var cp = require("child_process");
var os = require("os");
var path = require("path");

var ICI = __dirname;
var RACINE = path.resolve(ICI, "..", "..", "..");

function echapper(txt) { return txt.replace(/&/g, "&amp;").replace(/</g, "&lt;"); }
function lireIci(f) { return fs.readFileSync(path.join(ICI, f), "utf8").replace(/\r\n/g, "\n"); }
function stop(quoi) { console.log("✗ " + quoi); process.exit(1); }

var mesures = require("./mesures.js");
var domaine = require("./domaine.js");

var algo = lireIci("algo.js").replace(/\n+$/, "");
var lignesAlgo = algo.split("\n");

/* -------------------------------------------------- 1. les extraits, à bornes vérifiées */
function extraire(debut) {
  var i = lignesAlgo.indexOf(debut);
  if (i === -1) stop("extrait introuvable dans algo.js : " + JSON.stringify(debut));
  var j = lignesAlgo.indexOf("}", i);
  if (j === -1) stop("fin d'extrait introuvable pour : " + debut);
  return lignesAlgo.slice(i, j + 1).join("\n");
}
var extraitEtendu = extraire("function euclideEtendu(a, b) {");
var extraitInverse = extraire("function inverseModulaire(a, n) {");
if (algo.indexOf(extraitEtendu) === -1 || algo.indexOf(extraitInverse) === -1) {
  stop("un extrait publié ne se retrouve pas dans algo.js");
}
console.log("✓ 2 extraits relus dans algo.js (" + lignesAlgo.length + " lignes)");

/* ------------------------------------------------------------------- 2. les mesures */
var m = mesures.tout();
var sortieMesures = cp.execSync('node "' + path.join(ICI, "mesures.js") + '"', { encoding: "utf8" })
  .replace(/\r\n/g, "\n").replace(/\n+$/, "");

if (m.confrontation.ecarts !== 0) stop("Euclide diverge de la force brute : " + m.confrontation.ecarts + " écart(s).");
if (m.bezout.faux !== 0) stop("l'identité de Bézout est fausse sur " + m.bezout.faux + " paire(s).");
console.log("✓ " + m.confrontation.paires + " paires confrontées à la force brute, " +
            m.confrontation.ecarts + " écart · Bézout " + m.bezout.faux + " faux");

/* La page NOMME ces paires : on vérifie qu'elles sont bien celles mesurées. */
var ATTENDUES = { 100: [89, 55], 1000: [987, 610], 10000: [6765, 4181] };
m.pireCas.forEach(function (p) {
  var att = ATTENDUES[p.borne];
  if (!att) return;
  if (p.paires[0][0] !== att[0] || p.paires[0][1] !== att[1]) {
    stop("la page nomme la paire (" + att.join(", ") + ") jusqu'à " + p.borne +
         ", la mesure donne (" + p.paires[0].join(", ") + ").");
  }
  if (!p.premiereEstFibonacci) stop("la paire record jusqu'à " + p.borne + " n'est plus faite de deux Fibonacci consécutifs.");
});
console.log("✓ 3 paires records nommées dans le texte, 3 confirmées par la mesure (et Fibonacci)");

/* Le texte affirme que sur deux Fibonacci le reste ne gagne rien : on le vérifie. */
var fib = m.course.filter(function (c) { return c.a === 46368 && c.b === 28657; })[0];
if (!fib) stop("le cas (46368, 28657) a disparu des mesures.");
if (fib.toursReste !== fib.toursSoustraction) {
  stop("sur (46368, 28657), reste " + fib.toursReste + " tours et soustraction " + fib.toursSoustraction +
       " : le texte affirme qu'ils sont égaux.");
}
var ordinaire = m.course.filter(function (c) { return c.a === 1071 && c.b === 462; })[0];
if (!ordinaire) stop("le cas ordinaire (1071, 462) a disparu des mesures.");
console.log("✓ sur deux Fibonacci, reste et soustraction demandent le même nombre de tours (" + fib.toursReste + ")");

/* -------------------------------------------------------------------- 3. le domaine */
var d = domaine.mesurer();
var sortieDomaine = cp.execSync('node "' + path.join(ICI, "domaine.js") + '"', { encoding: "utf8" })
  .replace(/\r\n/g, "\n").replace(/\n+$/, "");
if (d.divergences !== 0) stop("le garde-fou change " + d.divergences + " résultat(s) valide(s) : c'est une régression.");
if (d.attrapes !== d.cas.length - 1) stop("le garde-fou n'attrape que " + d.attrapes + " cas hors domaine sur " + (d.cas.length - 1) + ".");
console.log("✓ garde-fou : " + d.attrapes + "/" + (d.cas.length - 1) + " cas hors domaine refusés, " +
            d.rejouees + " paires rejouées, " + d.divergences + " changement");

/* ---------------------------------------------------------------------- 4. le banc */
var banc = lireIci("banc.js")
  .split("@@ORIGINE@@").join("Extraite de tools/etudes/euclide/algo.js le jour de l'assemblage.")
  .split("@@EUCLIDE@@").join(extraitEtendu)
  .replace(/\n+$/, "");
if (banc.indexOf("@@") !== -1) stop("jeton non remplacé dans le banc.");

/* ⚠️ PIÈGE MESURÉ (étude nº 3) : runner.js refuse de poser un bouton « Tester » sur un
   bloc contenant certains mots — dont « document » au singulier dans un commentaire
   français. On recopie son test et on refuse de publier un banc muet. */
var BROWSER_ONLY = /(?:^|[^\w$À-ɏ])(document|window|localStorage|sessionStorage|alert|prompt|confirm|location|navigator|process|Buffer|__dirname|__filename)(?![\w$À-ɏ])|require\s*\(|module\.exports|\bexports\.|\bglobalThis\b|node:|new Worker|postMessage|SharedArrayBuffer|Atomics|importScripts/;
var interdit = BROWSER_ONLY.exec(banc);
if (interdit) stop("le banc contient « " + interdit[0].trim() + " » : runner.js n'y mettrait pas de bouton « Tester ».");

function executer(source, etiquette) {
  var tmp = path.join(os.tmpdir(), "syntaxe-euclide-" + etiquette + "-" + process.pid + ".js");
  fs.writeFileSync(tmp, source);
  try {
    return cp.execSync('node "' + tmp + '"', { encoding: "utf8" }).replace(/\r\n/g, "\n").replace(/\n+$/, "");
  } finally { fs.unlinkSync(tmp); }
}
var sortieBanc = executer(banc, "banc");

function lire(motif, quoi) {
  var r = motif.exec(sortieBanc);
  if (!r) stop("introuvable dans la sortie du banc : " + quoi);
  return r[1];
}
var rsaD = lire(/clé privée d = inverse de e mod (?:\d+) \.+ (\d+)/, "la clé privée");
var rsaPhi = lire(/clé privée d = inverse de e mod (\d+)/, "phi");
var rsaChiffre = lire(/message (?:\d+) chiffré \.+ (\d+)/, "le message chiffré");
var rsaMsg = lire(/message (\d+) chiffré/, "le message clair");
var rsaN = lire(/n = (\d+), e =/, "le module n");
var rsaE = lire(/n = (?:\d+), e = (\d+)/, "l'exposant e");
var retrouve = /puis déchiffré \.+ (\d+)\s+retrouvé/.exec(sortieBanc);
if (!retrouve || retrouve[1] !== rsaMsg) stop("le banc ne retrouve pas le message déchiffré : la page l'affirme.");
var rsaTours = String(mesures.euclideEtendu(Number(rsaE), Number(rsaPhi)).tours);
console.log("✓ banc exécuté : " + sortieBanc.split("\n").length + " lignes · clé privée " + rsaD +
            " en " + rsaTours + " tours · " + rsaMsg + " → " + rsaChiffre + " → " + retrouve[1]);

/* ----------------------------------------------------------------------- 5. la page */
var parBorne = {};
m.pireCas.forEach(function (p) { parBorne[p.borne] = p; });

var CHIFFRES = {
  "@@N_LIGNES@@": String(lignesAlgo.length),
  "@@N_PAIRES@@": String(m.confrontation.paires),
  "@@ECARTS@@": String(m.confrontation.ecarts),
  "@@BEZOUT_FAUX@@": String(m.bezout.faux),
  "@@MAX_U@@": String(m.bezout.maxU),
  "@@TOURS_100@@": String(parBorne[100].tours),
  "@@TOURS_1000@@": String(parBorne[1000].tours),
  "@@TOURS_10000@@": String(parBorne[10000].tours),
  "@@RECORD_10000@@": String(parBorne[10000].combien),
  "@@SOUS_TOURS@@": String(ordinaire.toursSoustraction),
  "@@RESTE_TOURS@@": String(ordinaire.toursReste),
  "@@GARDE_ATTRAPES@@": String(d.attrapes),
  "@@GARDE_CAS@@": String(d.cas.length - 1),
  "@@GARDE_REJOUEES@@": String(d.rejouees),
  "@@GARDE_DIVERGENCES@@": String(d.divergences),
  "@@RSA_D@@": rsaD,
  "@@RSA_E@@": rsaE,
  "@@RSA_PHI@@": rsaPhi,
  "@@RSA_N@@": rsaN,
  "@@RSA_MSG@@": rsaMsg,
  "@@RSA_CHIFFRE@@": rsaChiffre,
  "@@RSA_TOURS@@": rsaTours
};

var page = lireIci("gabarit.html")
  .replace("@@ALGO@@", echapper(algo))
  .replace("@@EXTRAIT_ETENDU@@", echapper(extraitEtendu))
  .replace("@@EXTRAIT_INVERSE@@", echapper(extraitInverse))
  .replace("@@BANC@@", echapper(banc))
  .replace("@@SORTIE_BANC@@", echapper(sortieBanc))
  .replace("@@SORTIE_MESURES@@", echapper(sortieMesures))
  .replace("@@SORTIE_DOMAINE@@", echapper(sortieDomaine))
  .replace("@@GARDE@@", echapper(domaine.GARDE.split("\n").slice(0, 3).join("\n")));

Object.keys(CHIFFRES).forEach(function (jeton) { page = page.split(jeton).join(CHIFFRES[jeton]); });

if (page.indexOf("@@") !== -1) {
  stop("il reste un jeton non remplacé : " + page.slice(page.indexOf("@@"), page.indexOf("@@") + 30));
}
if (page.indexOf(echapper(sortieBanc)) === -1) stop("la sortie du banc publiée n'est pas celle qui vient d'être exécutée.");
if (page.indexOf(echapper(algo)) === -1) stop("le programme publié n'est pas celui du fichier.");

var cible = path.join(RACINE, "pages", "etude-euclide.html");
fs.writeFileSync(cible, page);
console.log("✓ écrit : " + path.relative(RACINE, cible) + " (" + page.length + " octets)");
