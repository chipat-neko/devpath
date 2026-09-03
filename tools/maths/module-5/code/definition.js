/* Ce que « O(n²) » veut dire EXACTEMENT, et ce que ça ne dit pas.
   Définition : f est en O(g) s’il existe une constante c > 0 et un rang n0
   tels que f(n) ≤ c · g(n) pour tout n ≥ n0. Deux quantificateurs, deux
   nombres à exhiber. On les exhibe. */

function f(n) { return 3 * n * n + 50 * n + 200; }   // le coût exact d’un algorithme
function g(n) { return n * n; }                      // la famille annoncée

/* 1. Trouver le plus petit rang n0 qui marche, pour un c donné. */
function plusPetitRang(c, borne) {
  for (let n = 1; n <= borne; n++) {
    let tient = true;
    for (let m = n; m <= borne; m++) if (f(m) > c * g(m)) { tient = false; break; }
    if (tient) return n;
  }
  return null;
}

console.log('f(n) = 3n² + 50n + 200,  g(n) = n²');
console.log('');
console.log('  c     plus petit n0 tel que f(n) ≤ c·n² pour tout n ≥ n0');
console.log('  ---   ---------------------------------------------------');
[3, 3.5, 4, 5, 10, 53].forEach(function (c) {
  const n0 = plusPetitRang(c, 100000);
  console.log('  ' + String(c).padEnd(5) + ' ' + (n0 === null ? 'aucun (c est trop petit)' : String(n0)));
});
console.log('');
console.log('Un seul couple suffit à prouver f ∈ O(n²). Avec c = 4 il existe,');
console.log('donc c’est prouvé — et le choix de c change n0, jamais la conclusion.');
console.log('Avec c = 3 il n’en existe aucun : 3n² est toujours dépassé par f.');

/* 2. Le poids réel des termes qu’on jette. */
console.log('');
console.log('CE QU’ON JETTE, ET QUAND ON A LE DROIT');
console.log('    n        f(n)          3n²      part des termes jetés');
console.log('  -----  ------------  ------------  ---------------------');
[1, 5, 10, 17, 50, 100, 1000, 10000].forEach(function (n) {
  const jete = 50 * n + 200;
  const part = (100 * jete / f(n));
  console.log('  ' + String(n).padStart(5) + '  ' + String(f(n)).padStart(12) + '  ' +
    String(3 * n * n).padStart(12) + '' + '  ' + part.toFixed(2).padStart(19) + ' %');
});
let bascule = 1;
while (50 * bascule + 200 >= 3 * bascule * bascule) bascule++;
console.log('');
console.log('Les termes jetés pèsent AU MOINS AUTANT que 3n² jusqu’à n = ' + (bascule - 1) + ' inclus :');
console.log('  à n = ' + (bascule - 1) + ', 50n + 200 = ' + (50 * (bascule - 1) + 200) +
  ' et 3n² = ' + (3 * (bascule - 1) * (bascule - 1)) + ' — égalité exacte.');
console.log('  à n = ' + bascule + ', 50n + 200 = ' + (50 * bascule + 200) +
  ' et 3n² = ' + (3 * bascule * bascule) + ' — le terme dominant l’emporte enfin.');
console.log('Ils passent sous 1 % à partir de n = ' + (function () {
  let n = 1; while (100 * (50 * n + 200) / f(n) >= 1) n++; return n;
})() + '.');

/* 3. Un O(n²) qui bat un O(n log n) : la constante décide, en dessous du croisement. */
const rapide = (n) => 3 * n * n;                  // quadratique, constante 3
const lent   = (n) => 1000 * n * Math.log2(n);    // quasi-linéaire, constante 1000
let croisement = 2;   // n = 1 est exclu : log₂1 = 0, B y coûterait 0
while (rapide(croisement) <= lent(croisement)) croisement++;
console.log('');
console.log('DEUX ALGORITHMES : A = 3n² (quadratique), B = 1000·n·log₂n (quasi-linéaire)');
console.log('A, la « mauvaise » classe, est le plus rapide des deux jusqu’à n = ' + (croisement - 1) +
  ' inclus ;');
console.log('B ne passe devant qu’au rang suivant, n = ' + croisement + '.');
console.log('À n = 100 ... : A fait ' + rapide(100) + ' opérations, B en fait ' + Math.round(lent(100)) +
  ' — ' + (lent(100) / rapide(100)).toFixed(0) + ' fois plus.');
console.log('À n = 200 ... : A fait ' + rapide(200) + ', B en fait ' + Math.round(lent(200)) +
  ' — ' + (lent(200) / rapide(200)).toFixed(1) + ' fois plus.');
console.log('À n = 4000 .. : A fait ' + rapide(4000) + ', B en fait ' + Math.round(lent(4000)) + '.');
console.log('À n = 10^6 .. : A fait ' + rapide(1e6).toExponential(2) +
  ', B en fait ' + lent(1e6).toExponential(2) +
  ' — ' + (rapide(1e6) / lent(1e6)).toFixed(0) + ' fois moins.');
console.log('La classe ne dit pas qui gagne. Elle dit qui gagne À LA FIN.');
