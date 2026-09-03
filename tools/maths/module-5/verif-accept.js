/* Les exercices « type:text » déclarent une valeur attendue dans `accept`.
   Rien ne vérifiait jusqu'ici que cette valeur est bien celle que la SOLUTION
   PUBLIÉE affiche sur sa dernière ligne — or c'est exactement la promesse faite
   à l'apprenant par les indices : « la solution le redonne seul sur sa dernière
   ligne ». Un `accept` recopié à la main est un piège silencieux : l'apprenant
   qui exécute la solution obtient un nombre que le champ refuse.

   Usage : node tools/maths/module-5/verif-accept.js */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

/* Le moteur du Worker de js/runner.js, à l'identique. */
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
  vm.runInNewContext(code, vm.createContext(bac), { timeout: 20000 });
  return out.join('\n');
}

/* Le juge de js/lecon.js, pour normaliser comme lui. */
const srcLecon = fs.readFileSync('js/lecon.js', 'utf8');
const mNorm = srcLecon.match(/function normExo\(s\)\s*\{[\s\S]*?\n  \}/);
if (!mNorm) throw new Error('normExo introuvable dans js/lecon.js');
const normExo = new Function('return ' + mNorm[0])();

/* Chaque exercice « type:text », dans l'ordre du bloc data-exos, avec la
   solution qui doit produire sa réponse. */
const PAIRES = [
  ['pages/maths/lecon-12.html', 1, 'tools/maths/module-5/code/solution-2.js'],
  ['pages/maths/lecon-12.html', 2, 'tools/maths/module-5/code/solution-3.js'],
  ['pages/maths/lecon-13.html', 1, 'tools/maths/module-5/code/solution-5.js'],
  ['pages/maths/lecon-13.html', 2, 'tools/maths/module-5/code/solution-6.js'],
];

let ok = 0, ko = 0;
PAIRES.forEach(function (p) {
  const [page, rang, solution] = p;
  const html = fs.readFileSync(page, 'utf8');
  const m = html.match(/<script[^>]*data-exos[^>]*>([\s\S]*?)<\/script>/);
  if (!m) throw new Error('data-exos introuvable dans ' + page);
  const exos = JSON.parse(m[1]);
  const exo = exos[rang];
  if (!exo || exo.type !== 'text') throw new Error('exo ' + rang + ' de ' + page + ' n est pas un type:text');

  const sortie = executer(fs.readFileSync(solution, 'utf8')).split('\n');
  let derniere = '';
  for (let i = sortie.length - 1; i >= 0; i--) { if (sortie[i].trim()) { derniere = sortie[i].trim(); break; } }

  const accepte = exo.accept.some(function (a) { return normExo(a) === normExo(derniere); });
  console.log((accepte ? 'OK   ' : 'ÉCHEC') + '  ' + path.basename(page) + ' · exo ' + (rang + 1) +
    '  accept = ' + JSON.stringify(exo.accept) + '  · dernière ligne de ' + path.basename(solution) +
    ' = ' + JSON.stringify(derniere));
  if (accepte) ok++; else ko++;
});
console.log('');
console.log(ok + '/' + PAIRES.length + ' champs « accept » confirmés par la dernière ligne de leur solution, ' + ko + ' en échec.');
process.exit(ko ? 1 : 0);
