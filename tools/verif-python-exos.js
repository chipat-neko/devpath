'use strict';

/**
 * tools/verif-python-exos.js — la SOLUTION PUBLIÉE d'un exercice `type:"python"`
 * produit-elle vraiment ce que son `run.expect` annonce ?
 *
 * POURQUOI CE SCRIPT EXISTE
 * -------------------------
 * Les exercices `type:"python"` sont jugés dans le navigateur par CPython 3.12
 * (Pyodide embarqué, cf. A4). C'est la bonne preuve — c'est aussi la plus lente :
 * `tools/preuves/exos-code.js` met ~3 s par page, parce qu'il faut charger 8,27 Mo
 * d'interpréteur. Un contrôle qui coûte deux minutes ne tourne pas à chaque passe,
 * donc il ne protège de rien au quotidien.
 *
 * Celui-ci exécute la solution publiée avec le CPython DE LA MACHINE, et applique la
 * règle EXACTE de `js/lecon.js` (normExo + uneLigneEgale : une LIGNE entière de la
 * sortie doit être égale à `run.expect`). Il tourne en quelques secondes.
 *
 * CE QU'IL VÉRIFIE, pour chaque entrée `type:"python"` :
 *   · la solution repliée existe et est bien du `language-python` ;
 *   · elle s'exécute sans erreur et produit `run.expect` ;
 *   · elle n'importe RIEN qui soit absent de Pyodide (numpy, pandas, matplotlib,
 *     scikit-learn, requests, sqlite3…) : l'index des paquets y est vidé exprès,
 *     et un exercice qui en dépendrait serait mort dans le navigateur.
 *
 * ⚠️ CE QU'IL NE PROUVE PAS : que la version locale de Python se comporte comme la
 * 3.12 embarquée. Pour cela, et seulement pour cela, il faut le navigateur.
 *
 * USAGE   node tools/verif-python-exos.js [--details]
 * SORTIE  0 si tout tient, 1 sinon, 2 si aucun interpréteur Python n'est installé.
 */

var fs = require('fs');
var os = require('os');
var path = require('path');
var cp = require('child_process');

var RACINE = path.resolve(__dirname, '..');
var DETAILS = process.argv.indexOf('--details') !== -1;

/* ---- La règle de correction du site (js/lecon.js) --------------------------- */
function normExo(s) {
  s = s == null ? '' : String(s);
  s = s.replace(/ /g, ' ').replace(/[‘’]/g, "'").replace(/[“”]/g, '"');
  if (s.normalize) s = s.normalize('NFD').replace(/[̀-ͯ]/g, '');
  return s.trim().replace(/\s+/g, ' ').replace(/;+\s*$/, '').toLowerCase();
}
function uneLigneEgale(sortie, attendu) {
  var lignes = String(sortie == null ? '' : sortie).split(/\r?\n/);
  for (var i = 0; i < lignes.length; i++) if (normExo(lignes[i]) === normExo(attendu)) return true;
  return false;
}

/* ---- L'interpréteur de la machine ------------------------------------------- */
function pythonExe() {
  var cands = ['python', 'python3', 'py'];
  for (var i = 0; i < cands.length; i++) {
    try {
      var r = cp.spawnSync(cands[i], ['-c', 'print(1)'], { encoding: 'utf8' });
      if (!r.error && r.status === 0) return cands[i];
    } catch (e) { /* candidat suivant */ }
  }
  return null;
}

/* Ce que Pyodide n'a PAS : son index de paquets est vidé (garde-fou réseau, cf. A4),
   donc la stdlib seule — et sans sqlite3, qui n'est pas compilé dans ce build. */
var INTERDITS = /^\s*(?:import|from)\s+(numpy|pandas|matplotlib|scipy|sklearn|seaborn|requests|sqlite3)\b/m;

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

function decode(s) {
  return s
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'").replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&');
}

/* ---- Contrôle --------------------------------------------------------------- */
var PY = pythonExe();
if (!PY) {
  console.log('verif-python-exos.js — aucun interpréteur Python sur cette machine : contrôle sauté.');
  process.exit(2);
}

var fautes = [];
var nExos = 0, nFichiers = 0;
var tmp = path.join(os.tmpdir(), 'verif-python-exo.py');

lecons().forEach(function (f) {
  var src = fs.readFileSync(f, 'utf8');
  var m = src.match(/<script type="application\/json" data-exos>([\s\S]*?)<\/script>/);
  if (!m) return;
  var arr;
  try { arr = JSON.parse(m[1]); } catch (e) { return; }
  var debuts = [], re = /<div class="exercise">/g, mm;
  while ((mm = re.exec(src))) debuts.push(mm.index);
  var rel = path.relative(RACINE, f).replace(/\\/g, '/');
  var vu = false;

  arr.forEach(function (e, i) {
    if (!e || e.type !== 'python') return;
    vu = true;
    nExos++;
    var ou = rel + ' · exercice ' + (i + 1);

    if (!e.run || e.run.expect == null) {
      fautes.push(ou + ' : type:"python" sans `run.expect` — rien à comparer.');
      return;
    }
    var debut = debuts[i];
    var zone = debut == null ? '' : src.slice(debut, i + 1 < debuts.length ? debuts[i + 1] : src.length);
    var blocs = [];
    var reb = /<code class="language-python">([\s\S]*?)<\/code>/g, mb;
    while ((mb = reb.exec(zone))) blocs.push(decode(mb[1]));
    if (!blocs.length) {
      fautes.push(ou + " : aucune solution `language-python` dans le bloc — rien n'est montré à l'apprenant.");
      return;
    }
    /* La solution est le DERNIER bloc Python de l'exercice : l'énoncé peut en
       contenir un avant elle (code à corriger, sortie de départ). */
    var solution = blocs[blocs.length - 1];
    if (INTERDITS.test(solution)) {
      fautes.push(ou + ' : la solution importe un paquet ABSENT de Pyodide — elle échouera dans le navigateur.');
      return;
    }
    fs.writeFileSync(tmp, solution, 'utf8');
    var r = cp.spawnSync(PY, [tmp], { encoding: 'utf8', timeout: 20000 });
    var sortie = ((r.stdout || '') + (r.stderr || '')).replace(/\r\n/g, '\n').trim();
    var passe = normExo(sortie) === normExo(e.run.expect) || uneLigneEgale(sortie, e.run.expect);
    if (!passe) {
      fautes.push(ou + ' : la solution publiée ne produit PAS son run.expect.\n      attendu : ' +
        JSON.stringify(e.run.expect) + '\n      produit : ' + JSON.stringify(sortie.slice(0, 300)));
    } else if (DETAILS) {
      console.log('  ✓ ' + ou + ' — ' + JSON.stringify(e.run.expect));
    }
  });
  if (vu) nFichiers++;
});
try { fs.unlinkSync(tmp); } catch (e) { /* rien */ }

console.log('\n=== EXERCICES type:"python" ===');
console.log('  interpréteur ............ ' + PY);
console.log('  fichiers ................ ' + nFichiers);
console.log('  exercices ............... ' + nExos);
console.log('  fautes .................. ' + fautes.length);
if (fautes.length) {
  console.log('\n--- FAUTES ---');
  fautes.forEach(function (x) { console.log('  ✗ ' + x); });
}
process.exit(fautes.length ? 1 : 0);
