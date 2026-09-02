'use strict';
/**
 * tools/build-pyodide.js — Fabriquer `assets/vendor/pyodide/` à partir d'une
 * distribution Pyodide, et en contrôler l'intégrité.
 *
 * POURQUOI CE SCRIPT EXISTE
 * -------------------------
 * Le site tourne en `file://` : Chrome traite chaque fichier local comme une origine
 * opaque et refuse `fetch()` vers `pyodide.asm.wasm` ou `python_stdlib.zip`. Les
 * binaires ne peuvent donc pas rester des fichiers — ils sont portés DANS des scripts
 * classiques, encodés en base64, et servis au chargeur de Pyodide par un `fetch`
 * détourné (voir `assets/vendor/pyodide/pyodide-charge.js`).
 *
 * TROIS DÉCISIONS, TOUTES MESURÉES LE 2026-08-26
 * ----------------------------------------------
 *  1. **Le `.wasm` est GZIPPÉ avant d'être encodé.** En base64 brut il pèse 13,45 Mo ;
 *     gzippé puis encodé, 4,10 Mo. Le décompresser dans le Worker par
 *     `DecompressionStream('gzip')` coûte 35 ms. Économie : 8,7 Mo sur le dépôt.
 *  2. **`python_stdlib.zip` n'est PAS gzippé** : c'est déjà un zip, gzip lui fait
 *     gagner 1 % (2,23 -> 2,20 Mo). On l'encode tel quel.
 *  3. **Le fichier de verrouillage est REMPLACÉ par un index VIDE.** Le vrai
 *     `pyodide-lock.json` déclare 310 paquets (numpy, pandas…) téléchargeables depuis
 *     un CDN. Aucun n'est embarqué ; laisser l'index complet, c'est laisser une porte
 *     vers le réseau. Avec `packages: {}`, `loadPackage` ne peut littéralement rien
 *     demander. Vérifié : Pyodide démarre normalement.
 *
 * L'URL de CDN présente dans `pyodide.js` (`setCdnUrl`) est neutralisée à la copie —
 * le dépôt ne contient AUCUNE URL de CDN, c'est une règle du projet.
 *
 * USAGE
 *   node tools/build-pyodide.js <dossier-pyodide>   régénère les fichiers
 *   node tools/build-pyodide.js                     contrôle ce qui est stocké
 *
 * Le script ne télécharge rien : le projet n'installe aucune dépendance. Le dossier
 * source doit contenir pyodide.js, pyodide.asm.js, pyodide.asm.wasm,
 * python_stdlib.zip et pyodide-lock.json.
 */
var fs = require('fs');
var path = require('path');
var zlib = require('zlib');

var RACINE = path.resolve(__dirname, '..');
var DEST = path.join(RACINE, 'assets', 'vendor', 'pyodide');
var VERSION = '0.26.4';
var PYTHON = '3.12.1';

/* Ce que chaque fichier généré doit contenir, et comment le contrôler. */
var GENERES = [
  { nom: 'pyodide-wasm-gz-b64.js', variable: 'PYODIDE_WASM_GZ_B64', source: 'pyodide.asm.wasm', gzip: true, magique: [0x00, 0x61, 0x73, 0x6d] },
  { nom: 'pyodide-stdlib-b64.js', variable: 'PYODIDE_STDLIB_B64', source: 'python_stdlib.zip', gzip: false, magique: [0x50, 0x4b, 0x03, 0x04] },
];
var COPIES = ['pyodide.js', 'pyodide.asm.js'];

function ko(n) { return (n / 1024).toFixed(1) + ' Ko'; }
function mo(n) { return (n / 1048576).toFixed(2) + ' Mo'; }

function entete(g, tailleBrute, tailleStockee) {
  return '/* ' + g.nom + ' — ' + g.source + ' de Pyodide ' + VERSION +
    (g.gzip ? ', GZIPPÉ puis encodé en base64.\n' : ', encodé en base64.\n') +
    '   Pourquoi : en file://, un fetch() vers un fichier local est refusé par Chrome\n' +
    '   (origine opaque). Le binaire est donc porté DANS ce script classique, et servi\n' +
    '   au chargeur de Pyodide par le fetch détourné de pyodide-charge.js.\n' +
    (g.gzip
      ? '   Pourquoi gzippé : en base64 brut ce fichier pèserait 13,45 Mo ; gzippé, 4,10 Mo.\n' +
        '   La décompression par DecompressionStream(\'gzip\') coûte 35 ms (mesuré 2026-08-26).\n'
      : '   Pas de gzip ici : c\'est déjà un zip, gzip ne lui gagnerait que 1 %.\n') +
    '   ⚠ Expose self.' + g.variable + ', et NON window : ce script est chargé par\n' +
    '   importScripts() depuis un Web Worker, où window n\'existe pas.\n' +
    '   Source : ' + g.source + ', ' + tailleBrute + ' octets' +
    (g.gzip ? ' (' + tailleStockee + ' octets une fois gzippé)' : '') + '.\n' +
    '   Régénérable : node tools/build-pyodide.js <dossier-pyodide> */\n';
}

var ENTETE_LOCK =
  '/* pyodide-lock-b64.js — index des paquets de Pyodide, VOLONTAIREMENT VIDE.\n' +
  '   Le chargeur réclame ce fichier au démarrage. Le vrai en déclare 310 (numpy,\n' +
  '   pandas, scikit-learn…), tous téléchargeables depuis un CDN — or aucun n\'est\n' +
  '   embarqué et le site n\'émet aucune requête. Un index vide rend `loadPackage`\n' +
  '   incapable de demander quoi que ce soit : c\'est le garde-fou, pas une économie\n' +
  '   (30 Ko). Vérifié le 2026-08-26 : Pyodide démarre normalement avec cet index.\n' +
  '   Contenu : {"info": {…}, "packages": {}}, gzippé puis encodé en base64.\n' +
  '   Régénérable : node tools/build-pyodide.js <dossier-pyodide> */\n';

function encoder(buf, gzip) {
  return (gzip ? zlib.gzipSync(buf, { level: 9 }) : buf).toString('base64');
}

/* ------------------------------------------------------------ régénération */
var source = process.argv[2];
if (source) {
  if (!fs.existsSync(DEST)) fs.mkdirSync(DEST, { recursive: true });
  var total = 0;

  for (var i = 0; i < GENERES.length; i++) {
    var g = GENERES[i];
    var chemin = path.join(source, g.source);
    if (!fs.existsSync(chemin)) { console.error('introuvable : ' + chemin); process.exit(1); }
    var brut = fs.readFileSync(chemin);
    var stocke = g.gzip ? zlib.gzipSync(brut, { level: 9 }) : brut;
    var b64 = stocke.toString('base64');
    var texte = entete(g, brut.length, stocke.length) + 'self.' + g.variable + '=' + JSON.stringify(b64) + ';\n';
    fs.writeFileSync(path.join(DEST, g.nom), texte);
    total += texte.length;
    console.log(g.nom.padEnd(26) + mo(brut.length).padStart(9) + ' brut -> ' + mo(texte.length).padStart(9) + ' de script');
  }

  /* Index des paquets, vidé de ses 310 entrées. */
  var lock = JSON.parse(fs.readFileSync(path.join(source, 'pyodide-lock.json'), 'utf8'));
  var nbPaquets = Object.keys(lock.packages || {}).length;
  var vide = Buffer.from(JSON.stringify({ info: lock.info, packages: {} }));
  var texteLock = ENTETE_LOCK + 'self.PYODIDE_LOCK_GZ_B64=' + JSON.stringify(encoder(vide, true)) + ';\n';
  fs.writeFileSync(path.join(DEST, 'pyodide-lock-b64.js'), texteLock);
  total += texteLock.length;
  console.log('pyodide-lock-b64.js'.padEnd(26) + String(nbPaquets).padStart(9) + ' paquets -> 0 (index vidé), ' + ko(texteLock.length));

  /* Copies telles quelles, URL de CDN neutralisée. */
  for (var j = 0; j < COPIES.length; j++) {
    var nom = COPIES[j];
    var txt = fs.readFileSync(path.join(source, nom), 'utf8');
    var avant = (txt.match(/https?:\/\//g) || []).length;
    txt = txt.replace(/https:\/\/cdn\.jsdelivr\.net\/pyodide\/v\$\{[^}]*\}\/full\//g, './aucun-paquet-embarque/')
             .replace(/https:\/\/cdn\.jsdelivr\.net\/pyodide\/[^"'`]*/g, './aucun-paquet-embarque/');
    var apres = (txt.match(/https?:\/\//g) || []).length;
    fs.writeFileSync(path.join(DEST, nom), txt);
    total += txt.length;
    console.log(nom.padEnd(26) + mo(txt.length).padStart(9) + '  (URL http : ' + avant + ' -> ' + apres + ')');
  }

  console.log('-'.repeat(60));
  console.log('total généré : ' + mo(total));
  process.exit(0);
}

/* --------------------------------------------------------------- contrôle */
var pb = 0;
function verifier(nom, condition, detail) {
  console.log((condition ? '  OK   ' : '  ÉCHEC') + '  ' + nom + (detail ? '  — ' + detail : ''));
  if (!condition) pb++;
}

console.log('contrôle de ' + path.relative(RACINE, DEST));
var poids = 0;
for (var k = 0; k < GENERES.length; k++) {
  var gg = GENERES[k];
  var f = path.join(DEST, gg.nom);
  if (!fs.existsSync(f)) { verifier(gg.nom, false, 'fichier absent'); continue; }
  var contenu = fs.readFileSync(f, 'utf8');
  poids += contenu.length;
  var mAnnonce = contenu.match(/, (\d+) octets/);
  var mB64 = contenu.match(/self\.\w+\s*=\s*"([A-Za-z0-9+/=]+)"/);
  if (!mB64) { verifier(gg.nom, false, 'base64 illisible'); continue; }
  var buf = Buffer.from(mB64[1], 'base64');
  if (gg.gzip) { try { buf = zlib.gunzipSync(buf); } catch (e) { verifier(gg.nom, false, 'gunzip : ' + e.message); continue; } }
  var okMagique = gg.magique.every(function (o, n) { return buf[n] === o; });
  var okTaille = !mAnnonce || buf.length === parseInt(mAnnonce[1], 10);
  verifier(gg.nom, okMagique && okTaille,
    mo(contenu.length) + ' de script -> ' + mo(buf.length) + ' de binaire' +
    (okMagique ? '' : ', NOMBRE MAGIQUE FAUX') + (okTaille ? '' : ', TAILLE ANNONCÉE ' + mAnnonce[1]));
}

var fl = path.join(DEST, 'pyodide-lock-b64.js');
if (!fs.existsSync(fl)) { verifier('pyodide-lock-b64.js', false, 'absent'); }
else {
  var tl = fs.readFileSync(fl, 'utf8');
  poids += tl.length;
  var ml = tl.match(/self\.PYODIDE_LOCK_GZ_B64\s*=\s*"([A-Za-z0-9+/=]+)"/);
  var lockObj = null;
  try { lockObj = JSON.parse(zlib.gunzipSync(Buffer.from(ml[1], 'base64')).toString('utf8')); } catch (e) {}
  verifier('pyodide-lock-b64.js', !!lockObj && Object.keys(lockObj.packages || {}).length === 0,
    lockObj ? 'index à ' + Object.keys(lockObj.packages || {}).length + ' paquet(s), python ' + (lockObj.info || {}).python : 'illisible');
}

for (var c = 0; c < COPIES.length; c++) {
  var fc = path.join(DEST, COPIES[c]);
  if (!fs.existsSync(fc)) { verifier(COPIES[c], false, 'absent'); continue; }
  var tc = fs.readFileSync(fc, 'utf8');
  poids += tc.length;
  var urls = tc.match(/https?:\/\/[^\s"'`]+/g) || [];
  var esm = /(^|\n)\s*(export|import)\s/.test(tc);
  verifier(COPIES[c], urls.length === 0 && !esm,
    ko(tc.length) + (urls.length ? ', ' + urls.length + ' URL http RESTANTE(S) : ' + urls[0] : ', 0 URL http') +
    (esm ? ', MODULE ES' : ''));
}

var charge = path.join(DEST, 'pyodide-charge.js');
if (fs.existsSync(charge)) poids += fs.readFileSync(charge, 'utf8').length;
console.log('-'.repeat(60));
console.log('poids des fichiers Pyodide : ' + mo(poids) + '  (Pyodide ' + VERSION + ', CPython ' + PYTHON + ')');
/* pyodide-src.js n'est pas de Pyodide : c'est la COPIE EN CHAÎNE du code ci-dessus, que
   le Worker évalue depuis que Chrome 152 refuse importScripts() en file:// (cf. F2 du
   chantier V14). Son intégrité est contrôlée par tools/build-sources-worker.js — on la
   compte ici pour que « poids du dossier » ne mente pas de 1,2 Mo. */
var srcW = path.join(DEST, 'pyodide-src.js');
if (fs.existsSync(srcW)) {
  var pSrc = fs.statSync(srcW).size;
  console.log('  + pyodide-src.js (copie en chaîne pour le Worker) : ' + mo(pSrc));
  console.log('poids total du dossier : ' + mo(poids + pSrc));
} else {
  console.log('⚠ pyodide-src.js ABSENT — le Worker ne pourra pas démarrer en file:// ' +
              '(lancer : node tools/build-sources-worker.js --write)');
}
console.log(pb === 0 ? 'aucun écart.' : pb + ' écart(s).');
process.exit(pb === 0 ? 0 : 1);
