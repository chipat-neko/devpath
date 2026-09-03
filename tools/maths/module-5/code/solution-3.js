/* Exercice 3 — une file construite avec deux piles, et sa preuve d’amortissement. */

function alea(graine) {
  let e = graine >>> 0;
  return function () { e ^= e << 13; e >>>= 0; e ^= e >>> 17; e ^= e << 5; e >>>= 0; return e / 4294967296; };
}

let elementaires = 0;   // un push ou un pop sur une pile = une opération élémentaire

function FileDeuxPiles() {
  const entree = [], sortie = [];
  return {
    enfiler: function (v) { elementaires++; entree.push(v); },
    defiler: function () {
      if (sortie.length === 0) {
        while (entree.length) { elementaires += 2; sortie.push(entree.pop()); }
      }
      if (sortie.length === 0) return undefined;
      elementaires++;
      return sortie.pop();
    },
    taille: function () { return entree.length + sortie.length; },
  };
}

/* Témoin : une file naïve qui décale tout le tableau à chaque défilement. */
let decalages = 0;
function FileNaive() {
  const t = [];
  return {
    enfiler: function (v) { decalages++; t.push(v); },
    defiler: function () { if (!t.length) return undefined; decalages += t.length; return t.shift(); },
    taille: function () { return t.length; },
  };
}

const N = 100000;
const r = alea(20260913);
const f = FileDeuxPiles(), g = FileNaive();
const couts = [];
let enfilees = 0, defilees = 0, memeReponse = 0, comparees = 0;

for (let i = 0; i < N; i++) {
  const avant = elementaires;
  if (r() < 0.55 || f.taille() === 0) { const v = i; f.enfiler(v); g.enfiler(v); enfilees++; }
  else { const a = f.defiler(), b = g.defiler(); defilees++; comparees++; if (a === b) memeReponse++; }
  couts.push(elementaires - avant);
}

const total = couts.reduce(function (a, b) { return a + b; }, 0);
let pire = 0;   // pas de Math.max.apply : 100 000 arguments débordent la pile d’un Worker
couts.forEach(function (c) { if (c > pire) pire = c; });
const amorti = total / N;

console.log(N + ' opérations : ' + enfilees + ' enfilements, ' + defilees + ' défilements');
console.log('la file à deux piles rend la même valeur que la file naïve : ' +
  (memeReponse === comparees) + ' (' + memeReponse + ' / ' + comparees + ')');
console.log('');
console.log('opérations élémentaires, deux piles ... : ' + total);
console.log('coût amorti par opération ............. : ' + amorti.toFixed(4));
console.log('coût de l’opération la plus chère ..... : ' + pire + ' — soit ' +
  Math.round(pire / amorti) + ' fois le coût amorti');
console.log('opérations à coût 1 ................... : ' + couts.filter(function (c) { return c === 1; }).length);
console.log('');
console.log('LA PREUVE : chaque élément est poussé sur la pile d’entrée (1), dépilé (1),');
console.log('poussé sur la pile de sortie (1), puis dépilé (1). Quatre opérations, JAMAIS');
console.log('plus, quelle que soit la suite d’appels. Donc au plus 4 par élément :');
console.log('  4 × ' + enfilees + ' enfilements = ' + (4 * enfilees) + ' au maximum');
console.log('  mesuré .................. = ' + total);
console.log('  la borne tient : ' + (total <= 4 * enfilees));
console.log('');
console.log('LE TÉMOIN : la même file écrite avec shift(), qui décale tout le tableau');
console.log('opérations élémentaires, file naïve ... : ' + decalages);
console.log('rapport avec la version à deux piles .. : ' + Math.round(decalages / total) + ' fois');
console.log('');
console.log('Les deux files sont « O(1) par opération » si l’on ne regarde que le code.');
console.log('Une seule l’est vraiment. shift() est en O(n) : la file naïve est quadratique,');
console.log('et le test du doublement le montre.');
console.log('       n   deux piles   rapport        naïve   rapport');
console.log('  ------   ----------   -------   ----------   -------');
let p1 = null, p2 = null;
[12500, 25000, 50000, 100000].forEach(function (n) {
  const rr = alea(20260913);
  elementaires = 0; decalages = 0;
  const A = FileDeuxPiles(), B = FileNaive();
  for (let i = 0; i < n; i++) {
    if (rr() < 0.55 || A.taille() === 0) { A.enfiler(i); B.enfiler(i); }
    else { A.defiler(); B.defiler(); }
  }
  console.log('  ' + String(n).padStart(6) + '   ' + String(elementaires).padStart(10) + '   ' +
    (p1 === null ? '' : (elementaires / p1).toFixed(2)).padStart(7) + '   ' + String(decalages).padStart(10) + '   ' +
    (p2 === null ? '' : (decalages / p2).toFixed(2)).padStart(7));
  p1 = elementaires; p2 = decalages;
});
console.log('');
console.log(amorti.toFixed(2));
