/* Exercice 6 — l’exponentiation rapide : b multiplications, ou log₂(b) ? */

let mults = 0;

function puissanceNaive(a, b, m) {          // b multiplications : on part de 1
  let r = 1;
  for (let i = 0; i < b; i++) { mults++; r = (r * a) % m; }
  return r;
}

/* Exponentiation rapide : on lit l’exposant en BINAIRE. a^13 = a^8 · a^4 · a^1,
   parce que 13 s’écrit 1101. Chaque bit coûte un carré, chaque bit à 1 coûte
   une multiplication de plus. */
function puissanceRapide(a, b, m) {
  let r = 1, base = a % m, e = b;
  while (e > 0) {
    if (e % 2 === 1) { mults++; r = (r * base) % m; }
    e = Math.floor(e / 2);
    if (e > 0) { mults++; base = (base * base) % m; }
  }
  return r;
}

function alea(graine) {
  let e = graine >>> 0;
  return function () { e ^= e << 13; e >>>= 0; e ^= e >>> 17; e ^= e << 5; e >>>= 0; return e / 4294967296; };
}

/* --- 1. les deux méthodes donnent-elles la même chose ? ------------------ */
const r = alea(20260917);
let essais = 0, identiques = 0;
for (let k = 0; k < 20000; k++) {
  const a = 1 + Math.floor(r() * 1000);
  const b = Math.floor(r() * 2000);
  const m = 2 + Math.floor(r() * 9999);
  mults = 0;
  if (puissanceNaive(a, b, m) === puissanceRapide(a, b, m)) identiques++;
  essais++;
}
console.log('20 000 triplets (a, b, m) tirés au sort, a ≤ 1000, b < 2000, m ≤ 10000');
console.log('les deux méthodes rendent la même valeur : ' + (identiques === essais) +
  ' (' + identiques + ' / ' + essais + ')');

/* --- 2. le décompte --------------------------------------------------- */
console.log('');
console.log('MULTIPLICATIONS EFFECTUÉES, m = 1 000 003, a = 7');
console.log('');
console.log('            b     naïve   rapide   bits de b   rapport');
console.log('  -----------   -------   ------   ---------   -------');
const M = 1000003, A = 7;
let refRapide = 0;
[10, 100, 1000, 10000, 100000, 1000000].forEach(function (b) {
  mults = 0; const vn = puissanceNaive(A, b, M); const on = mults;
  mults = 0; const vr = puissanceRapide(A, b, M); const or = mults;
  if (vn !== vr) throw new Error('divergence à b=' + b);
  if (b === 1000000) refRapide = or;
  console.log('  ' + String(b).padStart(11) + '   ' + String(on).padStart(7) + '   ' + String(or).padStart(6) +
    '   ' + String(b.toString(2).length).padStart(9) + '   ' + Math.round(on / or).toString().padStart(7));
});
console.log('');
console.log('La colonne « rapide » suit les BITS de b, pas sa valeur. Le compte exact vaut');
console.log('(L−1) carrés + (nombre de bits à 1) multiplications, où L est le nombre de bits :');
[10, 1000, 1000000].forEach(function (b) {
  const L = b.toString(2).length;
  const uns = b.toString(2).split('').filter(function (c) { return c === '1'; }).length;
  mults = 0; puissanceRapide(A, b, M);
  console.log('  b = ' + String(b).padStart(7) + '   ' + L + ' bits, ' + uns + ' à 1   →   (' +
    (L - 1) + ') + (' + uns + ') = ' + ((L - 1) + uns) + '   mesuré : ' + mults);
});
console.log('Le compte est donc borné : au moins L, au plus 2L−1 — soit, pour b = 1 000 000,');
console.log('au moins ' + (1000000).toString(2).length + ' et au plus ' +
  (2 * (1000000).toString(2).length - 1) + ' multiplications. Jamais moins, jamais plus.');

/* --- 3. le test du doublement, sur l’exposant ---------------------------- */
console.log('');
console.log('LE TEST DU DOUBLEMENT SUR b');
console.log('            b   rapide   ajouté');
console.log('  -----------   ------   ------');
let prec = null;
[62500, 125000, 250000, 500000, 1000000].forEach(function (b) {
  mults = 0; puissanceRapide(A, b, M);
  console.log('  ' + String(b).padStart(11) + '   ' + String(mults).padStart(6) + '   ' +
    (prec === null ? '' : '+' + (mults - prec)).padStart(6));
  prec = mults;
});
console.log('');
console.log('Le travail ne double pas quand b double : il augmente d’une poignée d’unités.');
console.log('C’est la signature du logarithme, vue sur l’exposant au lieu de la taille.');

/* --- 4. pourquoi cela rend RSA possible ---------------------------------- */
console.log('');
console.log('CE QUE CELA REND POSSIBLE');
[256, 1024, 2048, 4096].forEach(function (bits) {
  console.log('  exposant de ' + String(bits).padStart(4) + ' bits : la naïve demanderait 2^' + bits +
    ' multiplications,');
  console.log('    la rapide en demande au plus ' + (2 * bits) + '. Rapport : 2^' + bits + ' / ' + (2 * bits) +
    ', un nombre à ' + (Math.floor((bits - Math.log2(2 * bits)) * Math.log10(2)) + 1) + ' chiffres.');
});
console.log('');
console.log('  Un chiffrement RSA élève un nombre à une puissance de plusieurs centaines de');
console.log('  chiffres. Sans cette méthode, aucune clé publique ne serait calculable ;');
console.log('  avec elle, cela prend quelques milliers de multiplications.');
console.log('');
console.log('  Et la sécurité de RSA tient au fait que l’opération INVERSE — retrouver');
console.log('  l’exposant — n’a, elle, aucun raccourci connu de ce genre.');
console.log('');
console.log(String(refRapide));
