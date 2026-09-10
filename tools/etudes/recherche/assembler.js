/* Assemble pages/etude-recherche.html.

   Même principe que les deux études précédentes : la page ne contient aucun code
   recopié à la main. Les extraits de `js/recherche.js` sont relus dans le fichier réel
   à des bornes vérifiées ici ; l'entrée d'index publiée est relue dans
   `js/search-index.js` ; la sortie du banc est RE-MESURÉE en l'exécutant ; et la
   modification proposée à l'apprenant est appliquée puis rejouée pour que le chiffre
   annoncé soit celui qu'elle produit vraiment. */
var fs = require("fs");
var cp = require("child_process");
var os = require("os");
var path = require("path");

var ICI = __dirname;
var RACINE = path.resolve(ICI, "..", "..", "..");
var RECHERCHE_JS = path.join(RACINE, "js", "recherche.js");

function echapper(txt) {
  return txt.replace(/&/g, "&amp;").replace(/</g, "&lt;");
}
function lireIci(f) { return fs.readFileSync(path.join(ICI, f), "utf8").replace(/\r\n/g, "\n"); }

var srcRech = fs.readFileSync(RECHERCHE_JS, "utf8").replace(/\r\n/g, "\n").replace(/\n$/, "");
var lignesRech = srcRech.split("\n");
var fautes = [];

/* ----------------------------------------------------------- les repères de lignes */
var REPERES = {
  ENTETE:    { a: 1,   b: 16,  debut: /^\/\* ={10}/,                                   fin: /^   ={10}/ },
  PARESSEUX: { a: 57,  b: 68,  debut: /^  function ensureIndex\(cb\) \{$/,             fin: /^  \}$/ },
  POSTINGS:  { a: 118, b: 138, debut: /^  \/\* Décodage paresseux des postings/,       fin: /^  \}$/ },
  INTERSECT: { a: 186, b: 200, debut: /^    \/\* inText : intersection sur les tokens/, fin: /^          if \(ti === 0\) freq0\[id\] = \(freq0\[id\] \|\| 0\) \+ posts\[k\]\[1\];$/ },
};

function extrait(a, b) { return lignesRech.slice(a - 1, b).join("\n"); }

Object.keys(REPERES).forEach(function (nom) {
  var r = REPERES[nom];
  var premiere = lignesRech[r.a - 1], derniere = lignesRech[r.b - 1];
  if (premiere === undefined || !r.debut.test(premiere)) {
    fautes.push(nom + " : la ligne " + r.a + " ne commence pas l'extrait attendu, on y lit " + JSON.stringify(premiere));
  }
  if (derniere === undefined || !r.fin.test(derniere)) {
    fautes.push(nom + " : la ligne " + r.b + " ne termine pas l'extrait attendu, on y lit " + JSON.stringify(derniere));
  }
  r.texte = extrait(r.a, r.b);
});

if (fautes.length) { fautes.forEach(function (f) { console.log("✗ " + f); }); process.exit(1); }
console.log("✓ " + Object.keys(REPERES).length + " extraits relus dans js/recherche.js (" + lignesRech.length + " lignes)");

function desindenter(txt) {
  return txt.split("\n").map(function (l) { return l.replace(/^ {2}/, ""); }).join("\n");
}

/* ------------------------------------------------------------- les mesures du site */
var mesuresRech = require("./mesures.js");
var mes = mesuresRech.mesurer();
/* ⚠️ POINT C3 : le bloc publié venait d'une SECONDE mesure lancée en sous-processus.
   C'est le rendu de LA mesure ci-dessus, celle dont les chiffres partent en jetons. */
var sortieMesures = mesuresRech.rendre(mes);

/* --------------------------------------------------------------- le banc d'essai */
var banc = lireIci("banc.js")
  .split("@@ORIGINE@@").join("Extraite de js/recherche.js le jour de l'assemblage : lignes " +
                              REPERES.POSTINGS.a + " à " + REPERES.POSTINGS.b + ".")
  .split("@@POSTINGS@@").join(desindenter(REPERES.POSTINGS.texte))
  .split("@@TEMOIN@@").join(mes.temoin)
  .split("@@BRUT@@").join(mes.brut)
  .replace(/\n+$/, "");

if (banc.indexOf("@@") !== -1) { console.log("✗ jeton non remplacé dans le banc"); process.exit(1); }

/* ⚠️ PIÈGE MESURÉ, le 2026-09-02 : js/runner.js refuse d'exécuter un bloc JavaScript
   qui contient certains mots (document, window, require…), pour ne pas proposer un
   bouton qui échouerait dans un Worker. Le mot « document » AU SINGULIER dans un
   commentaire français suffit à faire disparaître le bouton « Tester » — c'est
   exactement ce qui est arrivé au premier assemblage de cette page. On recopie donc
   ici le test de runner.js, et on refuse de publier un banc qui ne serait pas
   exécutable. */
var BROWSER_ONLY = /(?:^|[^\w$À-ɏ])(document|window|localStorage|sessionStorage|alert|prompt|confirm|location|navigator|process|Buffer|__dirname|__filename)(?![\w$À-ɏ])|require\s*\(|module\.exports|\bexports\.|\bglobalThis\b|node:|new Worker|postMessage|SharedArrayBuffer|Atomics|importScripts/;
var interdit = BROWSER_ONLY.exec(banc);
if (interdit) {
  console.log("✗ le banc contient « " + interdit[0].trim() + " » : runner.js n'y mettrait PAS de bouton « Tester ».");
  process.exit(1);
}

function executer(source, etiquette) {
  var tmp = path.join(os.tmpdir(), "syntaxe-banc-rech-" + etiquette + "-" + process.pid + ".js");
  fs.writeFileSync(tmp, source);
  try {
    return cp.execSync('node "' + tmp + '"', { encoding: "utf8" }).replace(/\r\n/g, "\n").replace(/\n+$/, "");
  } finally { fs.unlinkSync(tmp); }
}

var sortieBanc = executer(banc, "publie");

/* ------------------------------------------ la modification demandée, et sa mesure
   L'exercice : « le banc ne compte pas tout — ajoute le parcours des listes de
   documents ». On applique la modification au banc PUBLIÉ, on rejoue, et on lit le
   nouveau rapport dans SA sortie. Le chiffre publié est donc celui de l'exécution. */
var AVANT_MODIF = "    for (var p = 0; p < liste.length; p++) dedans[liste[p]] = 1;";
var APRES_MODIF = "    for (var p = 0; p < liste.length; p++) { vus++; dedans[liste[p]] = 1; }";
if (banc.indexOf(AVANT_MODIF) === -1) {
  console.log("✗ la ligne à modifier est introuvable dans le banc");
  process.exit(1);
}
var sortieModif = executer(banc.split(AVANT_MODIF).join(APRES_MODIF), "modif");

function lire(motif, sortie, quoi) {
  var m = motif.exec(sortie);
  if (!m) { console.log("✗ " + quoi + " : introuvable dans la sortie du banc"); process.exit(1); }
  return m[1];
}
var rapportAvant = lire(/rapport \.+ (\d+) fois moins/, sortieBanc, "le rapport publié");
var rapportApres = lire(/rapport \.+ (\d+) fois moins/, sortieModif, "le rapport après modification");
var clefsAvant = lire(/avec index — clefs examinées \.+ (\d+)/, sortieBanc, "les clefs examinées");
var clefsApres = lire(/avec index — clefs examinées \.+ (\d+)/, sortieModif, "les examens après modification");

if (rapportApres === rapportAvant) {
  console.log("✗ la modification ne change pas le rapport (" + rapportAvant + ") : l'exercice n'aurait plus d'objet");
  process.exit(1);
}
console.log("✓ banc exécuté : " + sortieBanc.split("\n").length + " lignes · rapport " + rapportAvant +
            "× → " + rapportApres + "× une fois les postings comptés (" + clefsAvant + " → " + clefsApres + " examens)");

/* ---------------------------------------------------------------------- la page */
var CHIFFRES = {
  "@@TEMOIN@@": mes.temoin,
  "@@N_DOCS@@": String(mes.docs),
  "@@N_MOTS@@": String(mes.mots),
  "@@N_POSTINGS@@": String(mes.postings),
  "@@TAILLE_INDEX@@": (mes.tIndex / (1024 * 1024)).toFixed(2),
  "@@TAILLE_LITE@@": String(Math.round(mes.tLite / 1024)),
  "@@GAIN_ENCODAGE@@": String(mes.gain),
  "@@BRUT@@": mes.brut,
  "@@NAIF@@": mes.naif,
  "@@N_TEMOIN@@": String(mes.ids.length),
  "@@RAPPORT_AVANT@@": rapportAvant,
  "@@RAPPORT_APRES@@": rapportApres,
  "@@EXAMENS_AVANT@@": clefsAvant,
  "@@EXAMENS_APRES@@": clefsApres,
};

var page = lireIci("gabarit.html")
  .replace("@@BANC@@", echapper(banc))
  .replace("@@SORTIE_BANC@@", echapper(sortieBanc))
  .replace("@@SORTIE_MESURES@@", echapper(sortieMesures))
  .replace("@@EXTRAIT_ENTETE@@", echapper(REPERES.ENTETE.texte))
  .replace("@@EXTRAIT_PARESSEUX@@", echapper(REPERES.PARESSEUX.texte))
  .replace("@@EXTRAIT_INTERSECT@@", echapper(REPERES.INTERSECT.texte))
  .replace("@@SOLUTION@@", echapper(APRES_MODIF.replace(/^ {4}/, "")));

Object.keys(CHIFFRES).forEach(function (jeton) {
  page = page.split(jeton).join(CHIFFRES[jeton]);
});

if (page.indexOf("@@") !== -1) {
  console.log("✗ il reste un jeton non remplacé : " + page.slice(page.indexOf("@@"), page.indexOf("@@") + 30));
  process.exit(1);
}

var cible = path.join(RACINE, "pages", "etude-recherche.html");
fs.writeFileSync(cible, page);
console.log("✓ écrit : " + path.relative(RACINE, cible) + " (" + page.length + " octets)");
