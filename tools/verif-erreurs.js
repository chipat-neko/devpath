'use strict';
/**
 * tools/verif-erreurs.js — Le décodeur d'erreurs, VÉRIFIÉ PAR EXÉCUTION.
 *
 * POURQUOI. `js/erreurs-data.js` affirme, pour 31 erreurs, le message exact que produit
 * le moteur. Une affirmation que rien n'exécute est exactement ce qui a laissé passer
 * cinq exemples faux sous quatre vérificateurs verts (le constat qui fonde le chantier
 * V14). Ce contrôle-ci refait tourner CHAQUE extrait :
 *
 *   1. l'extrait FAUTIF doit produire EXACTEMENT le `message` publié — pas « à peu
 *      près », pas « le même type d'erreur » : le même texte, caractère pour caractère,
 *      puisque c'est ce texte que l'apprenant collera dans la recherche ;
 *   2. l'extrait CORRIGÉ ne doit produire AUCUNE erreur — sinon le remède est faux ;
 *   3. le `motif` (expression rationnelle de recherche) doit reconnaître le message ;
 *   4. la leçon citée doit exister sur le disque, et son titre correspondre au libellé ;
 *   5. les champs obligatoires doivent être présents et non vides, et les identifiants
 *      uniques.
 *
 * ⚠️ Ce script EXÉCUTE du code. Les extraits sont ceux du fichier de données, écrits à la
 * main et volontairement inoffensifs ; un garde-fou refuse néanmoins tout extrait qui
 * touche au disque, au réseau ou aux processus (`require`, `import os`, `open(`, `fetch`,
 * `subprocess`…). Tout tourne dans un répertoire temporaire jetable.
 *
 *   node tools/verif-erreurs.js            contrôle tout
 *   node tools/verif-erreurs.js --lent     inclut les deux extraits de récursion (lents)
 */
var fs = require('fs'), os = require('os'), path = require('path'), cp = require('child_process');
var RACINE = path.resolve(__dirname, '..');
var LENT = process.argv.indexOf('--lent') !== -1;

/* Chargement du fichier de données : c'est un script classique qui pose window.ERREURS. */
var src = fs.readFileSync(path.join(RACINE, 'js', 'erreurs-data.js'), 'utf8');
var sandbox = { window: {} };
try { new Function('window', src)(sandbox.window); }
catch (e) { console.log('✗ js/erreurs-data.js ne s\'évalue pas : ' + e.message); process.exit(1); }
var ERREURS = sandbox.window.ERREURS;
if (!Array.isArray(ERREURS) || !ERREURS.length) { console.log('✗ window.ERREURS absent ou vide'); process.exit(1); }

var INTERDIT = /\brequire\s*\(|\bimport\s+(?:os|sys|subprocess|shutil|socket|urllib|requests)\b|\bopen\s*\(|\bfetch\s*\(|\bsubprocess\b|\bprocess\.|\bchild_process\b|\bXMLHttpRequest\b/;
/* ⚠️ `fetch(` figure dans l'extrait FAUTIF de `js-await-hors-async` — mais il ne
   s'exécute jamais : le fichier ne passe pas l'analyse syntaxique, c'est tout l'objet
   de l'erreur. On l'autorise nommément plutôt que d'affaiblir le garde-fou. */
var DEROGATION = { 'js-await-hors-async': 'fetch() est écrit dans un fichier qui ne compile pas : il ne s\'exécute jamais' };

var tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'verif-erreurs-'));
function executer(code, langue, cle) {
  var f = path.join(tmp, cle + (langue === 'javascript' ? '.js' : '.py'));
  fs.writeFileSync(f, code, 'utf8');
  try {
    cp.execFileSync(langue === 'javascript' ? 'node' : 'python', [f],
      { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], timeout: 20000 });
    return '';
  } catch (err) {
    var sortie = ((err.stderr || '') + (err.stdout || '')).replace(/\r\n?/g, '\n');
    var l = sortie.split('\n').filter(function (x) { return x.trim(); });
    if (!l.length) return '(échec sans message)';
    if (langue === 'python') return l[l.length - 1].trim();
    for (var i = 0; i < l.length; i++) if (/^[A-Za-z]*Error[:\s]/.test(l[i].trim())) return l[i].trim();
    return l[l.length - 1].trim();
  }
}
function titreDe(href) {
  /* ⚠️ LA BASE DES LIENS EST `pages/`, parce que la page du décodeur vivra à la racine
     de `pages/`, comme les autres pages transverses (`projets.html`, `fils-rouges.html`).
     Ce contrôle existe parce que la convention n'est PAS respectée ailleurs :
     `js/projets-data.js` écrit `../pandas/cours.html` dans ses 38 liens, qui ne
     résolvent ni depuis `pages/` ni depuis la racine — 29 liens distincts CASSÉS, non
     surveillés (relévé le 2026-08-26, chantier à part). */
  var f = path.resolve(RACINE, 'pages', href);
  if (!fs.existsSync(f)) return null;
  var s = fs.readFileSync(f, 'utf8');
  var m = s.match(/<h1[^>]*>([\s\S]*?)<\/h1>/);
  return m ? m[1].replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim() : '';
}

var CHAMPS = ['id', 'langue', 'type', 'message', 'gabarit', 'motif', 'cles', 'cause', 'remede', 'exemple', 'lecon', 'moteur'];
var fautes = [], vus = {}, testes = 0, sautes = 0;

ERREURS.forEach(function (e, i) {
  var id = e.id || ('#' + i);
  CHAMPS.forEach(function (c) {
    if (e[c] === undefined || e[c] === null || e[c] === '') fautes.push(id + ' : champ « ' + c + ' » absent ou vide');
  });
  if (vus[e.id]) fautes.push(id + ' : identifiant en double');
  vus[e.id] = 1;
  if (['javascript', 'python'].indexOf(e.langue) < 0) fautes.push(id + ' : langue inconnue (' + e.langue + ')');
  if (!e.exemple || !e.exemple.fautif || !e.exemple.corrige) { fautes.push(id + ' : exemple incomplet'); return; }
  if (e.message.indexOf(e.type) !== 0) fautes.push(id + ' : le message ne commence pas par le type déclaré (' + e.type + ')');

  /* 3. le motif de recherche doit reconnaître le message publié. */
  var re;
  try { re = new RegExp(e.motif); } catch (err) { fautes.push(id + ' : motif illisible — ' + err.message); }
  if (re && !re.test(e.message)) fautes.push(id + ' : le motif ne reconnaît PAS son propre message');

  /* 4. la leçon citée doit exister, et son titre correspondre au libellé. */
  var t = titreDe(e.lecon.href);
  if (t === null) fautes.push(id + ' : la leçon citée n\'existe pas (' + e.lecon.href + ')');
  else if (t !== e.lecon.label && t.indexOf(e.lecon.label) !== 0) {
    fautes.push(id + ' : le libellé du lien dit « ' + e.lecon.label + ' », la leçon s\'appelle « ' + t + ' »');
  }

  /* garde-fou avant toute exécution */
  var suspect = [e.exemple.fautif, e.exemple.corrige].filter(function (c) { return INTERDIT.test(c); });
  if (suspect.length && !DEROGATION[e.id]) {
    fautes.push(id + ' : un extrait touche au disque, au réseau ou aux processus — NON EXÉCUTÉ');
    return;
  }
  if (!LENT && /recursion|stack/.test(e.id)) { sautes++; return; }

  /* 1. le fautif produit-il EXACTEMENT le message publié ? */
  var vu = executer(e.exemple.fautif, e.langue, e.id + '-ko');
  testes++;
  if (vu !== e.message) fautes.push(id + ' : le moteur écrit « ' + vu +' »\n        le fichier publie  « ' + e.message + ' »');

  /* 2. le corrigé doit être muet. */
  var apres = executer(e.exemple.corrige, e.langue, e.id + '-ok');
  if (apres) fautes.push(id + ' : la CORRECTION échoue encore — « ' + apres + ' »');
});
try { fs.rmSync(tmp, { recursive: true, force: true }); } catch (e) { /* rien */ }

var parLangue = {};
ERREURS.forEach(function (e) { parLangue[e.langue] = (parLangue[e.langue] || 0) + 1; });
console.log('Décodeur d\'erreurs — ' + ERREURS.length + ' entrée(s) : ' +
  Object.keys(parLangue).map(function (k) { return parLangue[k] + ' ' + k; }).join(', '));
console.log('  extraits réexécutés : ' + (testes * 2) + ' (' + testes + ' fautifs + ' + testes + ' corrigés)' +
  (sautes ? ', ' + sautes + ' sauté(s) — récursion, lents : --lent pour les inclure' : ''));
if (fautes.length) {
  console.log('\n  FAUTES :');
  fautes.forEach(function (f) { console.log('   · ' + f); });
  process.exit(1);
}
console.log('  Aucune faute : chaque message publié est celui que le moteur produit, et chaque correction est muette.');
