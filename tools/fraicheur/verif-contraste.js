'use strict';

/**
 * tools/fraicheur/verif-contraste.js — L'ANGLE MORT DU BILAN REPLIÉ.
 *
 * `verif-rendu.js` mesure le contraste de ce qui est VISIBLE. Or le bilan de
 * fraîcheur est un <details> REPLIÉ : son contenu — la note, les dates, les
 * liens — n'est jamais mesuré, et une couleur illisible y passerait inaperçue
 * jusqu'au jour où un lecteur le déplie.
 *
 * Ce contrôle calcule donc les rapports de contraste des couleurs employées par
 * la marque et par le bilan, dans les DEUX thèmes, à partir de
 * `css/variables.css` (formule WCAG 2.1, seuil AA 4,5:1 — l'exposant est du
 * petit texte, il n'a pas droit au seuil assoupli).
 *
 * USAGE : node tools/fraicheur/verif-contraste.js
 * Code de sortie : 1 si un contraste est insuffisant.
 */
const fs = require('fs'), path = require('path');
const src = fs.readFileSync(path.join(__dirname, '..', '..', 'css', 'variables.css'), 'utf8');

function bloc(sel) {
  const i = src.indexOf(sel);
  const j = src.indexOf('}', i);
  return src.slice(i, j);
}
function vars(txt) {
  const o = {};
  const re = /(--[a-z0-9-]+)\s*:\s*([^;]+);/g; let m;
  while ((m = re.exec(txt))) o[m[1]] = m[2].trim().replace(/\s*\/\*[\s\S]*$/, '').trim();
  return o;
}
const clair = vars(bloc(':root'));
const sombre = Object.assign({}, clair, vars(bloc('[data-theme="dark"] {')));

function rgb(h) {
  h = h.replace('#', '');
  if (h.length === 3) h = h.split('').map((c) => c + c).join('');
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
}
function lum(h) {
  return rgb(h).map(function (v) {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  }).reduce(function (a, v, i) { return a + v * [0.2126, 0.7152, 0.0722][i]; }, 0);
}
function ratio(a, b) {
  const l1 = lum(a), l2 = lum(b);
  return ((Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05));
}

const CAS = [
  ['résumé du bilan', '--ink-2', '--bg-2', 4.5],
  ['note du bilan', '--ink-3', '--bg-2', 4.5],
  ['date dans le bilan', '--ink-3', '--bg-2', 4.5],
  ['lien du bilan', '--accent', '--bg-2', 4.5],
  ['année en exposant (sur le fond de page)', '--ink-3', '--bg', 4.5],
  ['année en exposant (sur un encadré)', '--ink-3', '--bg-2', 4.5],
];
let ko = 0;
[['clair', clair], ['sombre', sombre]].forEach(function (t) {
  console.log('\n  thème ' + t[0] + ' :');
  CAS.forEach(function (c) {
    const fg = t[1][c[1]], bg = t[1][c[2]];
    if (!/^#/.test(fg) || !/^#/.test(bg)) { console.log('    ? ' + c[0] + ' : couleur non littérale'); return; }
    const r = ratio(fg, bg);
    const ok = r >= c[3];
    if (!ok) ko++;
    console.log('    ' + (ok ? 'OK ' : 'KO ') + c[0].padEnd(42) + fg + ' sur ' + bg +
      '  =  ' + r.toFixed(2) + ':1   (seuil ' + c[3] + ')');
  });
});
console.log('\n  contrastes insuffisants : ' + ko);
process.exit(ko ? 1 : 0);
