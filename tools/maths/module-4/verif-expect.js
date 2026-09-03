/* Les exercices « type:code » du module portent un run.expect que
   verif-exemples.js classe « non vérifiable » : il n'exécute que l'ÉNONCÉ, et
   un énoncé de création ne produit rien. On comble l'angle mort ici en rejouant
   la SOLUTION PUBLIÉE de chaque exercice, avec le juge EXACT de js/lecon.js
   (normExo + uneLigneEgale) : si la solution que la leçon montre ne passait pas
   son propre exercice, l'apprenant serait refusé en recopiant la correction. */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

/* --- le juge, repris de js/lecon.js ------------------------------------- */
const src = fs.readFileSync('js/lecon.js', 'utf8');
const mNorm = src.match(/function normExo\(s\)\s*\{[\s\S]*?\n  \}/);
if (!mNorm) throw new Error('normExo introuvable dans js/lecon.js');
const normExo = new Function('return ' + mNorm[0])();
function uneLigneEgale(sortie, attendu) {
  const lignes = String(sortie).split('\n');
  const cible = normExo(attendu);
  for (let i = 0; i < lignes.length; i++) if (normExo(lignes[i]) === cible) return true;
  return false;
}

/* --- le moteur, repris du Worker de js/runner.js ------------------------ */
function fmt(v) {
  if (typeof v === 'string') return v;
  if (v === undefined) return 'undefined';
  if (v === null) return 'null';
  if (typeof v === 'function') return v.toString();
  try { return JSON.stringify(v); } catch (e) { return String(v); }
}
function executer(code) {
  const out = [];
  const push = function () { out.push(Array.prototype.slice.call(arguments).map(fmt).join(' ')); };
  const bac = { console: { log: push, warn: push, error: push, info: push, debug: push } };
  bac.globalThis = bac;
  vm.runInNewContext(code, vm.createContext(bac), { timeout: 5000 });
  return out.join('\n');
}

/* --- l'appariement exercice ↔ solution, déclaré ici ---------------------- */
const PAIRES = [
  ['pages/maths/lecon-10.html', 'tools/maths/module-4/code/solution-1.js'],
  ['pages/maths/lecon-11.html', 'tools/maths/module-4/code/solution-4.js'],
];

let ok = 0, ko = 0;
PAIRES.forEach(function (p) {
  const [page, solution] = p;
  const html = fs.readFileSync(page, 'utf8');
  const m = html.match(/<script[^>]*data-exos[^>]*>([\s\S]*?)<\/script>/);
  if (!m) throw new Error('data-exos introuvable dans ' + page);
  const exos = JSON.parse(m[1]);
  const codes = exos.filter(function (e) { return e.type === 'code' && e.run && e.run.expect != null; });
  if (codes.length !== 1) throw new Error(codes.length + ' exercices type:code dans ' + page + ' (attendu 1)');
  const attendu = codes[0].run.expect;
  const sortie = executer(fs.readFileSync(solution, 'utf8'));
  const passe = normExo(sortie) === normExo(attendu) || uneLigneEgale(sortie, attendu);
  console.log(
    (passe ? 'OK   ' : 'ÉCHEC') + '  ' + path.basename(page) +
    '  run.expect = ' + JSON.stringify(attendu) +
    '  · la solution publiée produit ' + sortie.split('\n').length + ' ligne(s)'
  );
  if (passe) ok++; else { ko++; console.log('        sortie obtenue :\n' + sortie.split('\n').map(function (l) { return '        | ' + l; }).join('\n')); }
});
console.log('');
console.log(ok + '/' + PAIRES.length + ' run.expect confirmés par la solution publiée, ' + ko + ' en échec.');
process.exit(ko ? 1 : 0);
