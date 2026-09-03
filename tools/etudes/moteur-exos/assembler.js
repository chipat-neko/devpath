/* Assemble pages/etude-moteur-exos.html.

   Principe, identique à celui de l'étude nº 1 et c'est tout l'intérêt : la page ne
   contient AUCUN code recopié à la main. Les extraits de `js/lecon.js` sont relus
   dans le fichier réel à chaque assemblage, à des bornes qui sont vérifiées ici même ;
   la sortie du banc d'essai est RE-MESURÉE en l'exécutant ; les chiffres de la carte
   et de l'inventaire sont recalculés. Si le moteur du site change, l'assemblage soit
   suit, soit échoue — il ne peut pas publier une page périmée en silence. */
var fs = require("fs");
var cp = require("child_process");
var os = require("os");
var path = require("path");

var ICI = __dirname;
var RACINE = path.resolve(ICI, "..", "..", "..");
var LECON_JS = path.join(RACINE, "js", "lecon.js");

/* Convention du site, contrôlée par tools/verif-html.js : dans un bloc <pre><code>,
   tout « < » s'écrit « &lt; » et tout « & » « &amp; ». */
function echapper(txt) {
  return txt.replace(/&/g, "&amp;").replace(/</g, "&lt;");
}

function lireIci(f) { return fs.readFileSync(path.join(ICI, f), "utf8").replace(/\r\n/g, "\n"); }

var srcLecon = fs.readFileSync(LECON_JS, "utf8").replace(/\r\n/g, "\n").replace(/\n$/, "");
var lignesLecon = srcLecon.split("\n");

var fautes = [];

/* ----------------------------------------------------------- les repères de lignes
   Chaque extrait publié est décrit par ses bornes ET par ce qu'on doit y lire. Un
   décalage d'une seule ligne dans js/lecon.js fait échouer l'assemblage. */
var REPERES = {
  ENTREE:    { a: 1223, b: 1229, debut: /^  function initExos\(\) \{$/,          fin: /var exercises = document\.querySelectorAll/ },
  APPARIER:  { a: 1231, b: 1236, debut: /^    \/\/ L'appariement se fait par index/, fin: /if \(data\.length !== exercises\.length/ },
  TYPES:     { a: 1258, b: 1269, debut: /^      var isCode = entry\.type === "code";$/, fin: /^      var multiligne = isCode \|\| isSql \|\| isPython;$/ },
  LABEL:     { a: 1275, b: 1284, debut: /^      \/\* La vraie micro-question/,    fin: /"Ta réponse :"\);$/ },
  AIDE:      { a: 1334, b: 1340, debut: /^      function refreshHelp\(\) \{$/,   fin: /while \(shownHints < target\) \{$/ },
  VERDICT:   { a: 1409, b: 1423, debut: /^            var pass;$/,               fin: /^              pass = normExo\(output\) === normExo\(expect\) \|\| uneLigneEgale\(output, expect\);$/ },
  UNELIGNE:  { a: 706,  b: 715,  debut: /^  \/\* Vrai si l'une des lignes de la sortie/, fin: /^  \}$/ },
  NORMEXO:   { a: 717,  b: 725,  debut: /^  function normExo\(s\) \{$/,          fin: /^  \}$/ },
};

function extrait(a, b) { return lignesLecon.slice(a - 1, b).join("\n"); }

Object.keys(REPERES).forEach(function (nom) {
  var r = REPERES[nom];
  var premiere = lignesLecon[r.a - 1];
  var derniere = lignesLecon[r.b - 1];
  if (premiere === undefined || !r.debut.test(premiere)) {
    fautes.push(nom + " : la ligne " + r.a + " ne commence pas l'extrait attendu, on y lit " + JSON.stringify(premiere));
  }
  if (derniere === undefined || !r.fin.test(derniere)) {
    fautes.push(nom + " : la ligne " + r.b + " ne termine pas l'extrait attendu, on y lit " + JSON.stringify(derniere));
  }
  r.texte = extrait(r.a, r.b);
});

if (lignesLecon.length !== 2019) {
  fautes.push("js/lecon.js fait " + lignesLecon.length + " lignes ; l'étude en annonce 2019 (mets à jour le texte de la page)");
}

if (fautes.length) {
  fautes.forEach(function (f) { console.log("✗ " + f); });
  process.exit(1);
}
console.log("✓ " + Object.keys(REPERES).length + " extraits relus dans js/lecon.js (" + lignesLecon.length + " lignes)");

/* Le code extrait vit à l'intérieur d'une fonction anonyme : il est indenté de deux
   espaces. Le banc, lui, est un programme autonome. */
function desindenter(txt) {
  return txt.split("\n").map(function (l) { return l.replace(/^ {2}/, ""); }).join("\n");
}

/* --------------------------------------------------------------- le banc d'essai */
var origine =
  "Extraites de js/lecon.js le jour de l'assemblage : uneLigneEgale aux lignes " +
  REPERES.UNELIGNE.a + " à " + REPERES.UNELIGNE.b + ", normExo aux lignes " +
  REPERES.NORMEXO.a + " à " + REPERES.NORMEXO.b + ".";

var banc = lireIci("banc.js")
  .replace("@@ORIGINE@@", origine)
  .replace("@@UNELIGNE@@", desindenter(REPERES.UNELIGNE.texte))
  .replace("@@NORMEXO@@", desindenter(REPERES.NORMEXO.texte))
  .replace(/\n+$/, "");

if (banc.indexOf("@@") !== -1) { console.log("✗ jeton non remplacé dans le banc"); process.exit(1); }

/* ⚠️ js/runner.js refuse d'exécuter un bloc JavaScript contenant certains mots
   (document, window, require…) : le bouton « Tester » disparaîtrait sans un mot
   d'explication. Le mot « document » au singulier dans un commentaire français suffit
   — c'est arrivé à l'étude nº 3. On recopie donc le test de runner.js ici. */
var BROWSER_ONLY = /(?:^|[^\w$À-ɏ])(document|window|localStorage|sessionStorage|alert|prompt|confirm|location|navigator|process|Buffer|__dirname|__filename)(?![\w$À-ɏ])|require\s*\(|module\.exports|\bexports\.|\bglobalThis\b|node:|new Worker|postMessage|SharedArrayBuffer|Atomics|importScripts/;
var interdit = BROWSER_ONLY.exec(banc);
if (interdit) {
  console.log("✗ le banc contient « " + interdit[0].trim() + " » : runner.js n'y mettrait PAS de bouton « Tester ».");
  process.exit(1);
}

/* Le banc est exécuté DANS LA FORME EXACTE où il sera publié : le fichier temporaire
   ci-dessous a le texte de la page, caractère pour caractère. */
function executer(source, etiquette) {
  var tmp = path.join(os.tmpdir(), "syntaxe-banc-" + etiquette + "-" + process.pid + ".js");
  fs.writeFileSync(tmp, source);
  try {
    return cp.execSync('node "' + tmp + '"', { encoding: "utf8" }).replace(/\r\n/g, "\n").replace(/\n+$/, "");
  } finally {
    fs.unlinkSync(tmp);
  }
}

var sortieBanc = executer(banc, "publie");

/* ------------------------------------------- la modification demandée, et sa mesure
   L'exercice est : « rends le correcteur strict sur les accents ». On applique la
   modification au banc PUBLIÉ, on le rejoue, et on compte les verdicts qui basculent.
   Le chiffre imprimé dans la page vient de cette exécution, jamais d'une estimation. */
var LIGNE_ACCENTS = REPERES.NORMEXO.texte
  .split("\n")
  .filter(function (l) { return l.indexOf("normalize(\"NFD\")") !== -1; })
  .map(function (l) { return l.replace(/^ {2}/, ""); })[0];

if (!LIGNE_ACCENTS) { console.log("✗ la ligne qui retire les accents est introuvable dans normExo"); process.exit(1); }

var bancStrict = banc.replace(LIGNE_ACCENTS + "\n", "");
if (bancStrict === banc) { console.log("✗ la modification n'a rien changé au banc"); process.exit(1); }
var sortieStricte = executer(bancStrict, "strict");

var a = sortieBanc.split("\n"), b = sortieStricte.split("\n");
var bascules = [];
for (var i = 0; i < Math.max(a.length, b.length); i++) {
  if (a[i] !== b[i]) bascules.push({ ligne: i + 1, avant: a[i], apres: b[i] });
}
/* Une bascule de verdict est une ligne de cas dont le mot ACCEPTE devient refuse.
   La dernière ligne du banc (le décompte) change forcément aussi : on la distingue. */
var verdicts = bascules.filter(function (d) { return /^\s*(ACCEPTE|refuse)/.test(d.avant || ""); });

/* La page NOMME les cas qui basculent (« eleve » et « ELEVE ») : on vérifie donc que
   ce sont bien ceux-là, sans quoi le texte publié mentirait sur sa propre mesure. */
var ATTENDU_BASCULE = ['saisie "eleve"', 'saisie "ELEVE"'];
var nommes = verdicts.map(function (d) { return d.avant.replace(/^\s*ACCEPTE\s+/, "").trim(); });
ATTENDU_BASCULE.forEach(function (att) {
  if (!nommes.some(function (n) { return n.indexOf(att) === 0; })) {
    console.log("✗ la page annonce que « " + att + " » bascule, or il ne bascule pas. Basculés : " + JSON.stringify(nommes));
    process.exit(1);
  }
});
if (verdicts.length !== ATTENDU_BASCULE.length) {
  console.log("✗ " + verdicts.length + " verdicts basculent, la page en nomme " + ATTENDU_BASCULE.length + " : " + JSON.stringify(nommes));
  process.exit(1);
}

/* Le nombre de cas est LU dans la sortie du banc, pas recompté à côté. */
var mCas = /^(\d+) cas, (\d+) acceptés/m.exec(sortieBanc);
if (!mCas) { console.log("✗ le banc n'a pas imprimé son décompte final"); process.exit(1); }

console.log("✓ banc exécuté : " + sortieBanc.split("\n").length + " lignes de sortie");
console.log("✓ variante stricte exécutée : " + verdicts.length + " verdict(s) basculé(s), " + bascules.length + " ligne(s) de sortie différentes");

/* ------------------------------------------------------ carte et inventaire */
var sortieCarte = cp.execSync('node "' + path.join(ICI, "carte.js") + '"', { encoding: "utf8" })
  .replace(/\r\n/g, "\n").replace(/\n+$/, "");
var sortieInventaire = cp.execSync('node "' + path.join(ICI, "inventaire.js") + '"', { encoding: "utf8" })
  .replace(/\r\n/g, "\n").replace(/\n+$/, "");

var carte = require("./carte.js").carte(fs.readFileSync(LECON_JS, "utf8"));
var inv = require("./inventaire.js").inventaire();
var initExos = carte.fns.filter(function (f) { return f.nom === "initExos"; })[0];
if (!initExos) { console.log("✗ initExos introuvable dans la carte"); process.exit(1); }

/* Les chiffres cités DANS LE TEXTE de la page sont vérifiés contre la mesure : si
   l'un d'eux ne colle plus, l'assemblage refuse de publier. */
var CHIFFRES = {
  "@@N_LIGNES@@": String(carte.lignes),
  "@@N_FONCTIONS@@": String(carte.fns.length),
  "@@N_INITEXOS@@": String(initExos.taille),
  "@@INITEXOS_BORNES@@": initExos.debut + " à " + initExos.fin,
  "@@N_LECONS_EXOS@@": String(inv.avecExos),
  "@@N_EXOS@@": String(inv.entrees),
  "@@N_TEXT@@": String(inv.types.text || 0),
  "@@N_CODE@@": String(inv.types.code || 0),
  "@@N_BASCULES@@": String(verdicts.length),
  "@@N_CAS@@": mCas[1],
};

var page = lireIci("gabarit.html")
  .replace("@@BANC@@", echapper(banc))
  .replace("@@SORTIE_BANC@@", echapper(sortieBanc))
  .replace("@@SORTIE_CARTE@@", echapper(sortieCarte))
  .replace("@@SORTIE_INVENTAIRE@@", echapper(sortieInventaire))
  .replace("@@EXTRAIT_ENTREE@@", echapper(REPERES.ENTREE.texte))
  .replace("@@EXTRAIT_APPARIER@@", echapper(REPERES.APPARIER.texte))
  .replace("@@EXTRAIT_TYPES@@", echapper(REPERES.TYPES.texte))
  .replace("@@EXTRAIT_LABEL@@", echapper(REPERES.LABEL.texte))
  .replace("@@EXTRAIT_AIDE@@", echapper(REPERES.AIDE.texte))
  .replace("@@EXTRAIT_VERDICT@@", echapper(REPERES.VERDICT.texte))
  .replace("@@SOLUTION@@", echapper(LIGNE_ACCENTS));

Object.keys(CHIFFRES).forEach(function (jeton) {
  page = page.split(jeton).join(CHIFFRES[jeton]);
});

if (page.indexOf("@@") !== -1) {
  console.log("✗ il reste un jeton non remplacé : " + page.slice(page.indexOf("@@"), page.indexOf("@@") + 30));
  process.exit(1);
}

var cible = path.join(RACINE, "pages", "etude-moteur-exos.html");
fs.writeFileSync(cible, page);
console.log("✓ écrit : " + path.relative(RACINE, cible) + " (" + page.length + " octets)");
