/* LE TEST DU DOUBLEMENT : la seule technique de ce cours qui s’applique à un
   programme dont on n’a PAS lu le code. On double n, on regarde par combien
   le travail est multiplié, et l’exposant se lit directement :
   rapport ≈ 2 → linéaire ; ≈ 4 → quadratique ; ≈ 8 → cubique ;
   ≈ 1 → constant ; un peu plus de 2 → n log n. */

function alea(graine) {
  let e = graine >>> 0;
  return function () { e ^= e << 13; e >>>= 0; e ^= e >>> 17; e ^= e << 5; e >>>= 0; return e / 4294967296; };
}
function jeu(n, graine, trie) {
  const t = [], r = alea(graine);
  for (let i = 0; i < n; i++) t.push(Math.floor(r() * 1000000));
  return trie ? t.sort((x, y) => x - y) : t;
}

let ops = 0;

const CANDIDATS = [
  { nom: 'premier élément', attendu: 'O(1)', f: function (t) { ops++; return t[0]; } },
  { nom: 'recherche linéaire (absent)', attendu: 'O(n)', f: function (t) {
      for (let i = 0; i < t.length; i++) { ops++; if (t[i] === -1) return i; } return -1; } },
  /* trie : le tri préalable est fait AVANT la mise à zéro du compteur ; il
     n’est pas mesuré, puisque la question porte sur la recherche seule. */
  { nom: 'recherche dichotomique', attendu: 'O(log n)', trie: true, f: function (a) {
      let g = 0, d = a.length - 1;
      while (g <= d) { ops++; const m = (g + d) >> 1; if (a[m] === -1) return m; if (a[m] < -1) g = m + 1; else d = m - 1; }
      return -1; } },
  { nom: 'tri fusion', attendu: 'O(n log n)', f: function fus(t) {
      if (t.length < 2) return t.slice();
      const m = t.length >> 1, g = fus(t.slice(0, m)), d = fus(t.slice(m)), r = [];
      let i = 0, j = 0;
      while (i < g.length && j < d.length) { ops++; r.push(g[i] <= d[j] ? g[i++] : d[j++]); }
      while (i < g.length) { ops++; r.push(g[i++]); }
      while (j < d.length) { ops++; r.push(d[j++]); }
      return r; } },
  { nom: 'doublons, deux boucles', attendu: 'O(n²)', f: function (t) {
      let c = 0;
      for (let i = 0; i < t.length; i++) for (let j = i + 1; j < t.length; j++) { ops++; if (t[i] === t[j]) c++; }
      return c; } },
  { nom: 'triplets qui somment à 0', attendu: 'O(n³)', f: function (t) {
      let c = 0;
      for (let i = 0; i < t.length; i++) for (let j = i + 1; j < t.length; j++)
        for (let k = j + 1; k < t.length; k++) { ops++; if (t[i] + t[j] + t[k] === 0) c++; }
      return c; } },
];

const N = [125, 250, 500, 1000];

console.log('Opérations comptées, puis rapport avec la taille précédente');
console.log('');
const entete = 'algorithme                    attendu    ' + N.map((n) => String(n).padStart(12)).join('') + '        rapports';
console.log(entete);
console.log('-'.repeat(entete.length));

const COMPTES = {};   // mesuré une seule fois, relu ensuite : le cubique coûte cher
CANDIDATS.forEach(function (c) {
  const comptes = N.map(function (n) { const t = jeu(n, 20260903 + n, c.trie); ops = 0; c.f(t); return ops; });
  COMPTES[c.nom] = comptes;
  const rapports = [];
  for (let i = 1; i < comptes.length; i++) rapports.push((comptes[i] / comptes[i - 1]).toFixed(2));
  console.log(c.nom.padEnd(30) + c.attendu.padEnd(11) +
    comptes.map((v) => String(v).padStart(12)).join('') + '   ' + rapports.join('  '));
});

console.log('');
console.log('LECTURE : le rapport, quand n double.');
console.log('  ≈ 1,0  → constant      : le travail ne dépend pas de n');
console.log('  ≈ 1,1  → logarithmique : une opération de plus à chaque doublement');
console.log('  ≈ 2,0  → linéaire');
console.log('  ≈ 2,2  → n log n       : 2, plus un petit supplément qui décroît');
console.log('  ≈ 4,0  → quadratique   : 2² — l’exposant est log₂(rapport)');
console.log('  ≈ 8,0  → cubique       : 2³');
console.log('');
console.log('EXPOSANT DÉDUIT DU DERNIER RAPPORT, sans avoir lu une ligne de code :');
CANDIDATS.forEach(function (c) {
  const a = COMPTES[c.nom][N.length - 2];
  const b = COMPTES[c.nom][N.length - 1];
  const exposant = Math.log2(b / a);
  console.log('  ' + c.nom.padEnd(30) + 'log₂(' + (b / a).toFixed(2) + ') = ' + exposant.toFixed(2) +
    '   annoncé ' + c.attendu);
});
console.log('');
console.log('La dichotomie donne un exposant proche de 0 (' +
  Math.log2(COMPTES[CANDIDATS[2].nom][3] / COMPTES[CANDIDATS[2].nom][2]).toFixed(2) +
  ') : c’est la signature du logarithme,');
console.log('que ce test ne distingue pas d’un coût constant. Deux doublements de plus le trancheraient.');
