/* Assemble pages/etude-journal.html à partir du gabarit et des FICHIERS RÉELLEMENT
   EXÉCUTÉS. Le programme publié est ainsi, par construction, celui dont la sortie a
   été mesurée : il ne peut pas diverger d'une recopie à la main. */
var fs = require('fs');
var cp = require('child_process');
var path = require('path');

var ICI = __dirname;
var RACINE = path.resolve(ICI, '..', '..', '..');

/* Convention du site, contrôlée par tools/verif-html.js : dans un bloc <pre><code>,
   tout « < » s'écrit « &lt; » et tout « & » « &amp; ». Le « > » n'a pas besoin
   d'être échappé et ne l'est donc pas, comme partout ailleurs sur le site. */
function echapper(txt) {
  return txt.replace(/&/g, '&amp;').replace(/</g, '&lt;');
}

function lire(f) { return fs.readFileSync(path.join(ICI, f), 'utf8').replace(/\r\n/g, '\n'); }

var programme = lire('analyse-journal.js').replace(/\n+$/, '');

/* La SOLUTION de la modification est régénérée ici, à partir du programme ci-dessus :
   elle ne peut donc pas dater d'une version antérieure du fichier. C'est un artefact
   dérivé — il n'a pas à être versionné, la commande le refait. */
cp.execSync('node "' + path.join(ICI, 'patch-modif.js') + '"', { encoding: 'utf8' });

/* La sortie est RE-MESURÉE ici, à l'assemblage : si le programme changeait sans que la
   sortie soit refaite, la page publierait une sortie fausse — exactement le défaut qui
   fonde ces chantiers. */
var sortie = cp.execSync('node "' + path.join(ICI, 'analyse-journal.js') + '"',
                         { encoding: 'utf8' }).replace(/\r\n/g, '\n').replace(/\n+$/, '');

var lignes = programme.split('\n');
function extrait(a, b) { return lignes.slice(a - 1, b).join('\n'); }

/* Les repères de lignes cités dans la page sont vérifiés ici, pas supposés. */
var REPERES = [
  { nom: 'journal', a: 15, b: 34, attendu: /^var JOURNAL = \[/ },
  { nom: 'regex', a: 40, b: 40, attendu: /^var LIGNE = / },
  { nom: 'analyserLigne', a: 45, b: 56, attendu: /^function analyserLigne\(/ },
  { nom: 'compter', a: 69, b: 71, attendu: /^function compter\(/ },
  { nom: 'agreger', a: 76, b: 96, attendu: /^function agreger\(/ },
  { nom: 'palmares', a: 105, b: 109, attendu: /^function palmares\(/ },
  { nom: 'taille', a: 112, b: 116, attendu: /^function taille\(/ },
  { nom: 'formaterRapport', a: 121, b: 150, attendu: /^function formaterRapport\(/ },
];
var fautes = [];
REPERES.forEach(function (r) {
  var premiere = lignes[r.a - 1];
  if (!r.attendu.test(premiere)) {
    fautes.push('ligne ' + r.a + ' devrait commencer ' + r.nom + ', on y lit : ' + JSON.stringify(premiere));
  }
});
if (lignes.length !== 152) fautes.push('le programme fait ' + lignes.length + ' lignes, la page en annonce 152');
if (fautes.length) { fautes.forEach(function (f) { console.log('✗ ' + f); }); process.exit(1); }
console.log('✓ ' + REPERES.length + ' repères de lignes vérifiés · programme de ' + lignes.length + ' lignes');

/* Les deux lignes de la solution, extraites du fichier RÉELLEMENT exécuté. */
var sol = lire('solution-modif.js').split('\n');
var iSol = sol.findIndex(function (l) { return l.indexOf('var taux = stat.valides') !== -1; });
if (iSol === -1) { console.log('✗ solution introuvable'); process.exit(1); }
var solution = sol.slice(iSol, iSol + 2).join('\n');

var page = lire('gabarit.html')
  .replace('@@PROGRAMME@@', echapper(programme))
  .replace('@@SORTIE@@', echapper(sortie))
  .replace('@@EXTRAIT_REGEX@@', echapper(extrait(40, 40)))
  .replace('@@EXTRAIT_TRI@@', echapper(extrait(105, 109)))
  .replace('@@SOLUTION@@', echapper(solution));

if (page.indexOf('@@') !== -1) {
  console.log('✗ il reste un jeton non remplacé : ' + page.slice(page.indexOf('@@'), page.indexOf('@@') + 30));
  process.exit(1);
}

var cible = path.join(RACINE, 'pages', 'etude-journal.html');
require("../../lib/publier-etude.js").publier(cible, page, RACINE);
console.log('  sortie mesurée à l\'assemblage : ' + sortie.split('\n').length + ' lignes');
