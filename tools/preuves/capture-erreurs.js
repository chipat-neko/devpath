'use strict';
/**
 * tools/preuves/capture-erreurs.js — CAPTURER de vrais messages d'erreur, pour le
 * décodeur du chantier V14 (phase C).
 *
 * POURQUOI. La case C1 pose une exigence non négociable : « chaque message doit être copié
 * d'une exécution réelle, pas reconstitué de mémoire — un message approximatif ne sera
 * jamais retrouvé par recherche ». Un décodeur qui contient « undefined is not a function »
 * là où Node écrit « x.foo is not a function » ne répondra jamais à qui colle son erreur.
 *
 * CE QUE FAIT CE SCRIPT. Il porte une liste d'EXTRAITS FAUTIFS — quelques lignes chacun,
 * du code qu'un débutant écrit vraiment — les exécute (`node` pour JavaScript, `python`
 * pour Python), et récupère le message que le moteur produit. Il n'invente rien : ce qui
 * n'échoue pas est signalé comme tel, et ce qui échoue autrement que prévu aussi.
 *
 * ⚠️ LA VERSION FAIT PARTIE DU RÉSULTAT. Les messages de Python ont changé plusieurs fois
 * (3.10 a ajouté les suggestions « did you mean », 3.11 a réécrit UnboundLocalError, 3.12
 * a précisé les erreurs de syntaxe). Le site, lui, exécute du **Python 3.12.1** (Pyodide,
 * embarqué en A4). Ce script relève la version de l'interpréteur local et l'inscrit dans
 * sa sortie ; `--compare-pyodide` liste les cas dont le message doit être revérifié dans
 * le moteur du site.
 *
 * ⚠️ ON EXÉCUTE DU CODE : chaque extrait est écrit ici même, à la main, court et sans effet
 * de bord (ni fichier, ni réseau, ni processus). Aucun n'est lu depuis le site.
 *
 *   node tools/preuves/capture-erreurs.js              exécute et affiche
 *   node tools/preuves/capture-erreurs.js --json       écrit scratchpad/v14-c1/messages.json
 */
var fs = require('fs'), os = require('os'), path = require('path'), cp = require('child_process');
var RACINE = path.resolve(__dirname, '..', '..');
var JSON_OUT = process.argv.indexOf('--json') !== -1;

/* --- les extraits fautifs ---------------------------------------------------------
   `cle` sert d'identifiant stable dans le fichier de données ; `code` est exécuté tel
   quel ; `attendu` est le TYPE d'erreur espéré — s'il ne sort pas, le script le dit. */
var CAS = [
  /* ============================ JavaScript ============================ */
  { cle: 'js-not-defined', langue: 'js', attendu: 'ReferenceError', code:
    'const total = 10;\nconsole.log(totl);' },
  { cle: 'js-undefined-prop', langue: 'js', attendu: 'TypeError', code:
    'const utilisateur = { nom: "Ada" };\nconsole.log(utilisateur.adresse.ville);' },
  { cle: 'js-not-a-function', langue: 'js', attendu: 'TypeError', code:
    'const nombres = [1, 2, 3];\nnombres.push(4);\nnombres.pusk(5);' },
  { cle: 'js-const', langue: 'js', attendu: 'TypeError', code:
    'const total = 10;\ntotal = 20;' },
  { cle: 'js-tdz', langue: 'js', attendu: 'ReferenceError', code:
    'console.log(compteur);\nlet compteur = 0;' },
  { cle: 'js-not-iterable', langue: 'js', attendu: 'TypeError', code:
    'const options = { a: 1, b: 2 };\nfor (const x of options) console.log(x);' },
  { cle: 'js-stack', langue: 'js', attendu: 'RangeError', code:
    'function compter(n) { return compter(n + 1); }\ncompter(0);' },
  { cle: 'js-json-vide', langue: 'js', attendu: 'SyntaxError', code:
    'const brut = "";\nJSON.parse(brut);' },
  { cle: 'js-json-simple', langue: 'js', attendu: 'SyntaxError', code:
    "JSON.parse(\"{'nom': 'Ada'}\");" },
  { cle: 'js-null-prop', langue: 'js', attendu: 'TypeError', code:
    'const bouton = null;\nbouton.textContent = "Envoyer";' },
  { cle: 'js-map-objet', langue: 'js', attendu: 'TypeError', code:
    'const scores = { ada: 12 };\nscores.map(function (x) { return x; });' },
  { cle: 'js-deja-declaree', langue: 'js', attendu: 'SyntaxError', code:
    'let total = 1;\nlet total = 2;' },
  { cle: 'js-parenthese', langue: 'js', attendu: 'SyntaxError', code:
    'console.log("bonjour";' },
  { cle: 'js-tofixed', langue: 'js', attendu: 'RangeError', code:
    'const prix = 12.3456;\nconsole.log(prix.toFixed(105));' },
  { cle: 'js-await-hors-async', langue: 'js', attendu: 'SyntaxError', code:
    'function charger() {\n  const r = await fetch("/x");\n}' },

  /* ============================== Python ============================== */
  { cle: 'py-name', langue: 'py', attendu: 'NameError', code:
    'total = 10\nprint(totl)' },
  { cle: 'py-concat', langue: 'py', attendu: 'TypeError', code:
    'age = 30\nprint("age : " + age)' },
  { cle: 'py-indent', langue: 'py', attendu: 'IndentationError', code:
    'if True:\nprint("oui")' },
  { cle: 'py-index', langue: 'py', attendu: 'IndexError', code:
    'notes = [12, 15, 9]\nprint(notes[3])' },
  { cle: 'py-key', langue: 'py', attendu: 'KeyError', code:
    'personne = {"nom": "Ada"}\nprint(personne["age"])' },
  { cle: 'py-attribute', langue: 'py', attendu: 'AttributeError', code:
    'nombres = [1, 2, 3]\nnombres.push(4)' },
  { cle: 'py-int', langue: 'py', attendu: 'ValueError', code:
    'age = int("trente")' },
  { cle: 'py-zero', langue: 'py', attendu: 'ZeroDivisionError', code:
    'total, n = 10, 0\nprint(total / n)' },
  { cle: 'py-str-item', langue: 'py', attendu: 'TypeError', code:
    'mot = "chat"\nmot[0] = "r"' },
  { cle: 'py-deux-points', langue: 'py', attendu: 'SyntaxError', code:
    'if 3 > 2\n    print("oui")' },
  { cle: 'py-parenthese', langue: 'py', attendu: 'SyntaxError', code:
    'print("bonjour"\nprint("fin")' },
  { cle: 'py-module', langue: 'py', attendu: 'ModuleNotFoundError', code:
    'import requetes' },
  { cle: 'py-argument', langue: 'py', attendu: 'TypeError', code:
    'def additionner(a, b):\n    return a + b\n\nadditionner(3)' },
  { cle: 'py-unbound', langue: 'py', attendu: 'UnboundLocalError', code:
    'compteur = 0\n\ndef incrementer():\n    compteur = compteur + 1\n\nincrementer()' },
  { cle: 'py-recursion', langue: 'py', attendu: 'RecursionError', code:
    'def compter(n):\n    return compter(n + 1)\n\ncompter(0)' },
  { cle: 'py-int-iterable', langue: 'py', attendu: 'TypeError', code:
    'for x in 5:\n    print(x)' }
];

/* --- exécution -------------------------------------------------------------------- */
var tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'capture-err-'));
function version(cmd, args) {
  try { return cp.execFileSync(cmd, args, { encoding: 'utf8' }).trim().split('\n')[0]; }
  catch (e) { return '(introuvable)'; }
}
var VNODE = version('node', ['--version']);
var VPY = version('python', ['--version']);

/** La ligne canonique d'une erreur : la dernière ligne non vide de la trace. */
function ligneErreur(sortie, langue) {
  var l = sortie.replace(/\r\n?/g, '\n').split('\n').filter(function (x) { return x.trim(); });
  if (!l.length) return '';
  if (langue === 'py') return l[l.length - 1].trim();
  /* Node : la première ligne qui commence par un nom d'erreur. */
  for (var i = 0; i < l.length; i++) {
    if (/^[A-Za-z]*Error[:\s]/.test(l[i].trim())) return l[i].trim();
  }
  return l[l.length - 1].trim();
}

var res = [], sansErreur = 0, autreType = 0;
CAS.forEach(function (c) {
  var f = path.join(tmp, c.cle + (c.langue === 'js' ? '.js' : '.py'));
  fs.writeFileSync(f, c.code, 'utf8');
  var sortie = '', code = 0;
  try {
    cp.execFileSync(c.langue === 'js' ? 'node' : 'python', [f],
      { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], timeout: 15000 });
  } catch (err) {
    code = err.status === undefined ? -1 : err.status;
    sortie = (err.stderr || '') + (err.stdout || '');
  }
  var msg = ligneErreur(sortie, c.langue);
  var typeVu = (msg.match(/^([A-Za-z]+Error)/) || [])[1] || '';
  if (!msg) { console.log('⚠ ' + c.cle + ' : AUCUNE erreur — cet extrait ne casse pas'); sansErreur++; }
  else if (typeVu !== c.attendu) { console.log('⚠ ' + c.cle + ' : ' + typeVu + ' au lieu de ' + c.attendu + ' — « ' + msg + ' »'); autreType++; }
  else console.log('✓ ' + c.cle + '  ' + msg);
  res.push({ cle: c.cle, langue: c.langue, attendu: c.attendu, vu: typeVu, message: msg, code: c.code, sortie: code });
});
try { fs.rmSync(tmp, { recursive: true, force: true }); } catch (e) { /* rien */ }

console.log('\n' + CAS.length + ' extrait(s) exécuté(s) — ' + (CAS.length - sansErreur - autreType) +
  ' conformes, ' + autreType + ' d\'un autre type, ' + sansErreur + ' sans erreur.');
console.log('Moteurs : node ' + VNODE + ' · python ' + VPY +
  '  ⚠️ le site, lui, exécute Python 3.12.1 (Pyodide) — les messages de syntaxe et les ' +
  'suggestions « did you mean » varient d\'une version à l\'autre.');
if (JSON_OUT) {
  var dir = path.join(RACINE, 'scratchpad', 'v14-c1');
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'messages.json'),
    JSON.stringify({ node: VNODE, python: VPY, cas: res }, null, 2), 'utf8');
  console.log('→ scratchpad/v14-c1/messages.json');
}
process.exit(sansErreur ? 1 : 0);
