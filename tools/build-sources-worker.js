'use strict';
/**
 * tools/build-sources-worker.js — Livrer le CODE des deux moteurs sous forme de CHAÎNE.
 *
 * POURQUOI CE FICHIER EXISTE. Jusqu'au 2026-08-26, les Workers de `js/runner.js` et
 * `js/lecon.js` chargeaient sql.js et Pyodide par `importScripts()` sur une URL
 * `file://` absolue. Chrome 152 a fermé cette porte : depuis un Worker issu d'un
 * `Blob`, `importScripts('file:///…')` échoue — quelle que soit la TAILLE du fichier
 * (mesuré le 2026-09-02 : le fichier de 0,8 Ko échoue comme celui de 4,10 Mo). Les
 * deux moteurs ne démarraient plus du tout chez l'apprenant : 41 blocs SQL cliqués,
 * 41 échecs ; 43 blocs Python cliqués, 43 échecs.
 *
 * CE QUI MARCHE ENCORE. Une PAGE `file://` peut toujours charger un `<script src>`
 * local, et une chaîne de caractères passe intacte au Worker par `postMessage`.
 * Les DONNÉES (les base64 du `.wasm`, de la bibliothèque standard, du verrou) sont
 * déjà des chaînes : il suffit de les transmettre. Le CODE, lui, doit à son tour
 * devenir une chaîne pour faire le voyage — c'est ce que ce script fabrique. Le
 * Worker l'évalue au lieu de l'importer.
 *
 *   node tools/build-sources-worker.js            → contrôle (code 1 si un écart)
 *   node tools/build-sources-worker.js --write    → régénère les deux fichiers
 *
 * LE CONTRÔLE EST LE POINT IMPORTANT : il relit chaque chaîne générée et la compare
 * CARACTÈRE PAR CARACTÈRE au fichier d'origine. Une copie qui dérive de son original
 * est exactement le genre de panne muette que ce chantier existe pour empêcher.
 */
var fs = require('fs');
var path = require('path');

var RACINE = path.resolve(__dirname, '..');
var VENDOR = path.join(RACINE, 'assets', 'vendor');

/* Chaque cible : le fichier produit, et les sources qu'il porte (nom global -> fichier). */
var CIBLES = [
  {
    sortie: path.join(VENDOR, 'sqljs', 'sql-wasm-src.js'),
    titre: 'sql-wasm-src.js',
    quoi: 'le code de sql.js (dist/sql-wasm.js), pour que le Worker l\'evalue au lieu de l\'importer',
    parts: [{ nom: 'SQLJS_SRC', fichier: path.join(VENDOR, 'sqljs', 'sql-wasm.js') }],
  },
  {
    sortie: path.join(VENDOR, 'pyodide', 'pyodide-src.js'),
    titre: 'pyodide-src.js',
    quoi: 'le code de Pyodide (chargeur, glue Emscripten) et notre pyodide-charge.js',
    parts: [
      { nom: 'PYODIDE_ASM_SRC', fichier: path.join(VENDOR, 'pyodide', 'pyodide.asm.js') },
      { nom: 'PYODIDE_JS_SRC', fichier: path.join(VENDOR, 'pyodide', 'pyodide.js') },
      { nom: 'PYODIDE_CHARGE_SRC', fichier: path.join(VENDOR, 'pyodide', 'pyodide-charge.js') },
    ],
  },
];

/* Chaîne JS sûre : tout ce qui n'est pas ASCII imprimable part en \uXXXX. Ainsi le
   fichier produit est du pur ASCII — il ne dépend plus du jeu de caractères que le
   navigateur devine pour un `<script src>` en file://, et U+2028/U+2029 (interdits
   dans une chaîne JS avant ES2019) ne peuvent pas s'y glisser. */
function chaineJS(txt) {
  var out = '"';
  for (var i = 0; i < txt.length; i++) {
    var c = txt.charCodeAt(i);
    var ch = txt[i];
    if (ch === '"') out += '\\"';
    else if (ch === '\\') out += '\\\\';
    else if (ch === '\n') out += '\\n';
    else if (ch === '\r') out += '\\r';
    else if (ch === '\t') out += '\\t';
    else if (c < 0x20 || c > 0x7e) out += '\\u' + ('000' + c.toString(16)).slice(-4);
    else out += ch;
  }
  return out + '"';
}

function entete(c) {
  return '/* ' + c.titre + ' — ' + c.quoi + '.\n' +
    '   Pourquoi une chaine et non le fichier lui-meme : depuis Chrome 152, un Worker issu\n' +
    '   d un Blob ne peut plus faire importScripts() sur une URL file://. La PAGE, elle,\n' +
    '   charge encore un <script src> local ; elle transmet donc ces chaines au Worker par\n' +
    '   postMessage, et le Worker les evalue. Voir js/runner.js.\n' +
    '   ⚠ Expose self.X, jamais window.X : ce script peut aussi etre lu depuis un Worker.\n' +
    '   GENERE — ne pas editer a la main. Regenerable et VERIFIABLE :\n' +
    '     node tools/build-sources-worker.js [--write]\n' +
    '   Le mode sans argument compare chaque chaine, caractere par caractere, au fichier\n' +
    '   d origine ; un ecart sort en code 1. */\n';
}

function construire(c) {
  var corps = entete(c);
  c.parts.forEach(function (p) {
    var txt = fs.readFileSync(p.fichier, 'utf8');
    corps += 'self.' + p.nom + '=' + chaineJS(txt) + ';\n';
  });
  return corps;
}

/* Relit le fichier produit et rend, pour chaque part, la chaîne effectivement stockée.
   On n'analyse pas le texte à la main : on l'ÉVALUE dans un bac à sable minimal, ce
   qui teste du même coup que le fichier est du JavaScript valide. */
function relire(c) {
  var txt = fs.readFileSync(c.sortie, 'utf8');
  var bac = {};
  var f = new Function('self', txt);
  f(bac);
  return bac;
}

var ecrire = process.argv.indexOf('--write') !== -1;
var ecarts = 0;

CIBLES.forEach(function (c) {
  if (ecrire) {
    fs.writeFileSync(c.sortie, construire(c), 'utf8');
  }
  if (!fs.existsSync(c.sortie)) {
    console.error('ABSENT : ' + path.relative(RACINE, c.sortie) + ' (lancer --write)');
    ecarts++;
    return;
  }
  var lu;
  try {
    lu = relire(c);
  } catch (e) {
    console.error('ILLISIBLE : ' + path.relative(RACINE, c.sortie) + ' — ' + e.message);
    ecarts++;
    return;
  }
  console.log(path.relative(RACINE, c.sortie) + '  (' + fs.statSync(c.sortie).size + ' octets)');
  c.parts.forEach(function (p) {
    var attendu = fs.readFileSync(p.fichier, 'utf8');
    var obtenu = lu[p.nom];
    var ok = obtenu === attendu;
    if (!ok) ecarts++;
    console.log('  ' + p.nom + ' : ' + (obtenu ? obtenu.length : 0) + ' caractères, attendu ' +
      attendu.length + ' — ' + (ok ? 'identique' : 'ÉCART'));
  });
});

if (ecarts) { console.error('\n' + ecarts + ' écart(s).'); process.exit(1); }
console.log('\naucun écart.');
