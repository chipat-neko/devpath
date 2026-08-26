'use strict';

/**
 * tools/verif-sql-exos.js — les exercices `type:"sql"` sont-ils VRAIMENT corrigés ?
 *
 * POURQUOI CE SCRIPT EXISTE
 * -------------------------
 * Même raison que `verif-regex-exos.js`, un cran plus loin. Un exercice de requête
 * corrigé par `accept:[…]` ne compare que des GRAPHIES : il refuse une requête juste
 * écrite autrement, et il accepte n'importe quelle variante voisine de la réponse
 * notée, juste ou fausse. Depuis ce point, la requête de l'apprenant est EXÉCUTÉE par
 * SQLite (`JUGE_SQL` dans `js/lecon.js`) et c'est le RÉSULTAT qui est comparé.
 *
 * Restait la faiblesse du deuxième étage : rien ne garantit que le jeu de données
 * DISCRIMINE. Une table où toutes les lignes se ressemblent laisse passer une requête
 * fausse — c'est un « compteur câblé », pas une mesure.
 *
 * CE QUE CET OUTIL VÉRIFIE, pour chaque entrée `type:"sql"` :
 *   · le `schema` de l'exercice s'exécute sans erreur ;
 *   · `ref` (la requête de référence) rend EXACTEMENT le tableau `attendu` ;
 *   · chaque requête de `contre` — plausibles mais FAUSSES : oubli du WHERE, mauvaise
 *     jointure, GROUP BY absent — est REFUSÉE. Sans cela, le jeu ne prouve rien ;
 *   · `attendu.lignes` n'est pas vide : un attendu vide serait passé par une requête
 *     qui ne trouve rien ;
 *   · `ref` figure LITTÉRALEMENT dans la solution repliée de l'exercice, pour que ce
 *     qui est testé et ce qui est montré ne puissent pas diverger en silence ;
 *   · `accept` contient `ref`, seul filet quand le Worker est indisponible.
 *
 * Le juge est celui du site, EXTRAIT de `js/lecon.js` (fonction JUGE_SQL) et non
 * recopié : deux copies divergent, une extraction non. Le moteur est le sql.js du
 * dépôt, décodé depuis son base64 — le même binaire que celui du navigateur.
 *
 * USAGE   node tools/verif-sql-exos.js [--details]
 * SORTIE  0 si tout tient, 1 sinon, 2 si le juge est introuvable (moteur déplacé).
 */

var fs = require('fs');
var path = require('path');
var vm = require('vm');

var RACINE = path.resolve(__dirname, '..');
var DETAILS = process.argv.indexOf('--details') !== -1;

/* ---- Le juge du site, extrait de js/lecon.js -------------------------------- */
function jugeDuSite() {
  var src = fs.readFileSync(path.join(RACINE, 'js', 'lecon.js'), 'utf8');
  var i = src.indexOf('  function JUGE_SQL(');
  if (i < 0) {
    console.log('verif-sql-exos.js — JUGE_SQL introuvable dans js/lecon.js : moteur déplacé ou renommé.');
    process.exit(2);
  }
  /* La fonction s'arrête à sa propre accolade fermante de premier niveau. */
  var j = src.indexOf('\n  }\n', i);
  if (j < 0) {
    console.log('verif-sql-exos.js — fin de JUGE_SQL introuvable.');
    process.exit(2);
  }
  var corps = src.slice(i, j + 4);
  var ctx = {};
  vm.createContext(ctx);
  vm.runInContext(corps + '\n', ctx);
  return function (res, attendu, ordre) {
    ctx.__res = res; ctx.__att = attendu; ctx.__ord = ordre;
    return vm.runInContext('JUGE_SQL(__res, __att, __ord)', ctx);
  };
}

/* ---- Le moteur SQLite du dépôt (le même binaire que le navigateur) ---------- */
var initSqlJs = require(path.join(RACINE, 'assets', 'vendor', 'sqljs', 'sql-wasm.js'));
var b64src = fs.readFileSync(path.join(RACINE, 'assets', 'vendor', 'sqljs', 'sql-wasm-base64.js'), 'utf8');
var mb = b64src.match(/self\.SQL_WASM_BASE64\s*=\s*"([A-Za-z0-9+/=]+)"/);
if (!mb) { console.error('base64 illisible dans sql-wasm-base64.js'); process.exit(2); }
var wasmBinary = Buffer.from(mb[1], 'base64');

/* ---- Lecture des leçons ----------------------------------------------------- */
function lecons() {
  var out = [];
  var base = path.join(RACINE, 'pages');
  fs.readdirSync(base).forEach(function (d) {
    var dir = path.join(base, d);
    if (!fs.statSync(dir).isDirectory()) return;
    fs.readdirSync(dir).forEach(function (f) {
      if (/^lecon-\d+\.html$/.test(f)) out.push(path.join(dir, f));
    });
  });
  return out;
}

function zonesExercice(src) {
  return src.split('<div class="exercise">').slice(1);
}

function decode(s) {
  return s
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'").replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&');
}

/* Comparer des requêtes à l'espace près serait absurde : la solution repliée est mise
   en forme sur plusieurs lignes, `ref` tient sur une. On compare donc les deux après
   écrasement des blancs ET des espaces autour des parenthèses et des virgules. */
function aplati(s) {
  return String(s).replace(/\s+/g, ' ').replace(/\s*([(),])\s*/g, '$1').trim().toLowerCase();
}

/* ---- Contrôle --------------------------------------------------------------- */
initSqlJs({ wasmBinary: wasmBinary, locateFile: function (f) { return f; } }).then(function (SQL) {
  var juger = jugeDuSite();
  var nExos = 0, nFichiers = 0, nContre = 0, nLignes = 0;
  var fautes = [];

  /* Exécute `requete` sur une base neuve où `schema` vient d'être posé, puis rend le
     verdict du juge du site. Une base NEUVE par requête : deux exercices ne doivent
     jamais se contaminer, et un `contre` qui écrirait dans la base ne doit pas fausser
     la référence. */
  function verdict(schema, requete, attendu, ordre) {
    var db = new SQL.Database(), res;
    try { db.exec(schema); }
    catch (e) { try { db.close(); } catch (e0) {} return { erreurSchema: String((e && e.message) || e) }; }
    try { res = db.exec(requete); }
    catch (e1) { try { db.close(); } catch (e2) {} return { texte: 'SQLite refuse : ' + String((e1 && e1.message) || e1) }; }
    var t;
    try { t = juger(res, attendu, ordre === true); }
    catch (e3) { t = 'juge en erreur : ' + String((e3 && e3.message) || e3); }
    try { db.close(); } catch (e4) {}
    return { texte: t };
  }

  lecons().forEach(function (f) {
    var src = fs.readFileSync(f, 'utf8');
    var m = src.match(/<script type="application\/json" data-exos>([\s\S]*?)<\/script>/);
    if (!m) return;
    var arr;
    try { arr = JSON.parse(m[1]); } catch (e) { return; }
    var zones = zonesExercice(src);
    var rel = path.relative(RACINE, f).replace(/\\/g, '/');
    var vu = false;

    arr.forEach(function (e, i) {
      if (!e || e.type !== 'sql') return;
      vu = true;
      nExos++;
      var ou = rel + ' · exercice ' + (i + 1);

      if (!e.schema) { fautes.push(ou + ' : type:"sql" sans `schema` — il n\'y a rien à interroger.'); return; }
      if (!e.attendu) { fautes.push(ou + ' : pas d\'`attendu` — le moteur retombe sur accept, donc sur une comparaison de chaînes.'); return; }
      if (!e.ref) { fautes.push(ou + ' : pas de `ref` (requête de référence) — rien à vérifier.'); return; }
      var att = e.attendu.lignes || [];
      if (!att.length) { fautes.push(ou + ' : `attendu.lignes` est vide — une requête qui ne trouve rien passerait.'); return; }
      nLignes += att.length;

      var r = verdict(e.schema, e.ref, e.attendu, e.ordre);
      if (r.erreurSchema) {
        fautes.push(ou + ' : le `schema` de l\'exercice ne s\'exécute pas — ' + r.erreurSchema);
        return;
      }
      if (!/^SQL-OK\b/.test(r.texte)) {
        fautes.push(ou + ' : la RÉFÉRENCE échoue son propre exercice —\n      ' + String(r.texte).replace(/\n/g, '\n      '));
      }

      var contre = e.contre || [];
      if (!contre.length) fautes.push(ou + ' : aucune requête `contre` — rien ne prouve que le jeu de données discrimine.');
      contre.forEach(function (c) {
        nContre++;
        var rc = verdict(e.schema, c, e.attendu, e.ordre);
        if (rc.erreurSchema) return; // déjà signalé
        if (/^SQL-OK\b/.test(rc.texte)) {
          fautes.push(ou + ' : la contre-requête ' + JSON.stringify(c) + ' PASSE — le jeu de données ne discrimine pas.');
        }
      });

      var texte = decode(zones[i] || '');
      if (aplati(texte).indexOf(aplati(e.ref)) < 0) {
        fautes.push(ou + ' : la référence n\'apparaît pas dans la solution affichée — testé ≠ montré.\n      ref = ' + e.ref);
      }
      var acc = e.accept || [];
      if (acc.indexOf(e.ref) < 0) fautes.push(ou + ' : `accept` ne contient pas `ref` — le repli sans Worker refuserait la bonne réponse.');

      if (DETAILS) console.log('  ' + (/^SQL-OK\b/.test(r.texte) ? '✓' : '✗') + ' ' + ou + ' — ' + att.length + ' ligne(s) attendue(s), ' + contre.length + ' contre-requête(s)');
    });
    if (vu) nFichiers++;
  });

  console.log('\n=== EXERCICES type:"sql" ===');
  console.log('  fichiers ..................... ' + nFichiers);
  console.log('  exercices .................... ' + nExos);
  console.log('  lignes de résultat comparées . ' + nLignes);
  console.log('  contre-requêtes éprouvées .... ' + nContre);
  console.log('  fautes ....................... ' + fautes.length);
  if (fautes.length) {
    console.log('\n--- FAUTES ---');
    fautes.forEach(function (x) { console.log('  ✗ ' + x); });
  }
  process.exit(fautes.length ? 1 : 0);
}).catch(function (e) {
  console.error('verif-sql-exos.js — SQLite n\'a pas pu se charger : ' + ((e && e.message) || e));
  process.exit(2);
});
