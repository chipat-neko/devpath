'use strict';
/**
 * tools/build-sqljs.js — Régénérer `assets/vendor/sqljs/sql-wasm-base64.js`.
 *
 * Le site tourne en `file://` : Chrome refuse `fetch()` et `XMLHttpRequest` vers un
 * fichier local, donc le `.wasm` de SQLite ne peut pas être chargé comme un fichier.
 * On le porte dans un script classique, encodé en base64 (+33 % : 643 Ko -> 858 Ko).
 *
 * Ce script ne télécharge RIEN — le projet n'installe aucune dépendance. Il attend
 * le binaire déjà présent et se contente de l'encoder :
 *   node tools/build-sqljs.js <chemin/vers/sql-wasm.wasm>
 * Sans argument, il vérifie que le fichier généré correspond bien au binaire décrit
 * dans son propre en-tête (contrôle d'intégrité, code 1 en cas d'écart).
 */
var fs = require('fs');
var path = require('path');

var RACINE = path.resolve(__dirname, '..');
var CIBLE = path.join(RACINE, 'assets', 'vendor', 'sqljs', 'sql-wasm-base64.js');
var VERSION = '1.14.2';

function entete(taille) {
  return '/* sql-wasm-base64.js — le binaire WebAssembly de SQLite, encodé en base64.\n' +
    '   Pourquoi : en file://, un fetch() ou un XMLHttpRequest vers un fichier local est\n' +
    '   refusé par Chrome (origine opaque). Le seul moyen de charger le .wasm sans serveur\n' +
    '   est donc de le porter DANS un script classique. Expose window.SQL_WASM_BASE64,\n' +
    '   que assets/vendor/sqljs/sql-charge.js décode en Uint8Array et passe à initSqlJs\n' +
    '   via l option wasmBinary — ce qui supprime toute requête.\n' +
    '   Source : sql.js ' + VERSION + ' (MIT), dist/sql-wasm.wasm, ' + taille + ' octets.\n' +
    '   Régénérable : node tools/build-sqljs.js */\n';
}

var source = process.argv[2];

if (!source) {
  /* Mode contrôle : le base64 stocké redonne-t-il bien un WebAssembly de la taille annoncée ? */
  if (!fs.existsSync(CIBLE)) { console.error('absent : ' + CIBLE); process.exit(1); }
  var txt = fs.readFileSync(CIBLE, 'utf8');
  var m = txt.match(/dist\/sql-wasm\.wasm, (\d+) octets/);
  var b = txt.match(/window\.SQL_WASM_BASE64\s*=\s*"([A-Za-z0-9+/=]+)"/);
  if (!m || !b) { console.error('en-tête ou contenu illisible.'); process.exit(1); }
  var attendu = parseInt(m[1], 10);
  var buf = Buffer.from(b[1], 'base64');
  var magique = buf[0] === 0x00 && buf[1] === 0x61 && buf[2] === 0x73 && buf[3] === 0x6d;
  console.log('sql-wasm-base64.js  : ' + txt.length + ' octets de script');
  console.log('binaire décodé      : ' + buf.length + ' octets (annoncé ' + attendu + ')');
  console.log('nombre magique \\0asm: ' + (magique ? 'OK' : 'ABSENT'));
  if (buf.length !== attendu || !magique) { console.error('INCOHÉRENT.'); process.exit(1); }
  console.log('intégrité           : OK');
  process.exit(0);
}

var bin = fs.readFileSync(source);
if (!(bin[0] === 0x00 && bin[1] === 0x61 && bin[2] === 0x73 && bin[3] === 0x6d)) {
  console.error(source + " n'est pas un binaire WebAssembly."); process.exit(1);
}
var out = entete(bin.length) + 'window.SQL_WASM_BASE64="' + bin.toString('base64') + '";\n';
fs.writeFileSync(CIBLE, out);
console.log('écrit : ' + CIBLE);
console.log('  wasm ' + bin.length + ' octets -> script ' + out.length + ' octets (+' +
  ((out.length / bin.length - 1) * 100).toFixed(1) + ' %)');
