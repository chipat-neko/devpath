/* LA MÉMOIRE A SA PROPRE COMPLEXITÉ, et ce n’est pas la même que le temps.
   Un programme peut être rapide et gourmand, lent et sobre, ou les deux à la fois. */

/* --- 1. trois façons de calculer le même nombre -------------------------- */
let appels = 0, profondeur = 0, profondeurMax = 0;

function fibNaif(n) {
  appels++; profondeur++; if (profondeur > profondeurMax) profondeurMax = profondeur;
  const r = n < 2 ? n : fibNaif(n - 1) + fibNaif(n - 2);
  profondeur--;
  return r;
}
function fibMemo(n, memo) {
  appels++; profondeur++; if (profondeur > profondeurMax) profondeurMax = profondeur;
  let r;
  if (n < 2) r = n;
  else if (memo.has(n)) r = memo.get(n);
  else { r = fibMemo(n - 1, memo) + fibMemo(n - 2, memo); memo.set(n, r); }
  profondeur--;
  return r;
}
function fibIteratif(n) {
  let a = 0, b = 1;
  for (let i = 0; i < n; i++) { const s = a + b; a = b; b = s; appels++; }
  return a;
}

const N = 30;
appels = 0; profondeurMax = 0; const vNaif = fibNaif(N);
const aNaif = appels, pNaif = profondeurMax;
const memo = new Map();
appels = 0; profondeurMax = 0; const vMemo = fibMemo(N, memo);
const aMemo = appels, pMemo = profondeurMax, casesMemo = memo.size;
appels = 0; const vIter = fibIteratif(N);

console.log('FIBONACCI DE ' + N + ' — la même valeur, trois coûts');
console.log('');
console.log('méthode        valeur    appels   profondeur de pile   mémoire gardée');
console.log('----------   --------   -------   ------------------   --------------');
console.log('récursif     ' + String(vNaif).padStart(8) + '   ' + String(aNaif).padStart(7) + '   ' +
  String(pNaif).padStart(18) + '   ' + 'O(n) — la pile'.padStart(14));
console.log('mémoïsé      ' + String(vMemo).padStart(8) + '   ' + String(aMemo).padStart(7) + '   ' +
  String(pMemo).padStart(18) + '   ' + (casesMemo + ' cases').padStart(14));
console.log('itératif     ' + String(vIter).padStart(8) + '   ' + String(appels).padStart(7) + '   ' +
  String(1).padStart(18) + '   ' + '2 variables'.padStart(14));
console.log('');
console.log('les trois donnent la même valeur : ' + (vNaif === vMemo && vNaif === vIter));
console.log('le récursif fait ' + Math.round(aNaif / aMemo) + ' fois plus d’appels que le mémoïsé,');
console.log('et ' + Math.round(aNaif / N) + ' fois plus que l’itératif — pour le même résultat.');

/* --- 2. la croissance du récursif : un rapport très reconnaissable ------- */
console.log('');
console.log('APPELS DU RÉCURSIF NAÏF, QUAND n AUGMENTE DE 2');
console.log('   n    appels   rapport');
console.log('  ---   -------  -------');
let precedent = null;
for (let n = 20; n <= 30; n += 2) {
  appels = 0; profondeurMax = 0; fibNaif(n);
  const r = precedent === null ? '' : (appels / precedent).toFixed(4);
  console.log('  ' + String(n).padStart(3) + '   ' + String(appels).padStart(7) + '   ' + r.padStart(7));
  precedent = appels;
}
const phi = (1 + Math.sqrt(5)) / 2;
console.log('');
console.log('Le rapport pour n+2 tend vers φ² = ' + (phi * phi).toFixed(4) + ', où φ est le nombre d’or.');
console.log('Le coût du récursif naïf est donc en O(φ^n) : EXPONENTIEL, avec une base de');
console.log(phi.toFixed(4) + ' au lieu de 2. Il croît donc MOINS VITE que 2^n — ' +
  Math.round(Math.pow(2, 30) / Math.pow(phi, 30)) + ' fois moins à n = 30 —');
console.log('mais il reste exponentiel, et c’est cela qui décide.');

/* --- 3. le piège : une complexité en mémoire cachée dans une tranche ----- */
console.log('');
console.log('LE PIÈGE : DEUX SOMMES RÉCURSIVES QUI SEMBLENT IDENTIQUES');
let cellules = 0, cellulesMax = 0;
function sommeTranche(t) {              // t.slice(1) alloue un tableau à chaque étage
  if (t.length === 0) return 0;
  const reste = t.slice(1);
  cellules += reste.length; if (cellules > cellulesMax) cellulesMax = cellules;
  const r = t[0] + sommeTranche(reste);
  cellules -= reste.length;
  return r;
}
function sommeIndice(t, i) {            // aucune allocation
  i = i || 0;
  return i === t.length ? 0 : t[i] + sommeIndice(t, i + 1);
}
console.log('');
console.log('    n   cellules allouées par la version « slice »   par la version « indice »');
console.log('  ----  ------------------------------------------   -------------------------');
[10, 100, 200, 400, 800].forEach(function (n) {
  const t = []; for (let i = 0; i < n; i++) t.push(i);
  cellules = 0; cellulesMax = 0;
  const a = sommeTranche(t);
  const b = sommeIndice(t);
  if (a !== b) throw new Error('les deux sommes divergent');
  console.log('  ' + String(n).padStart(4) + '  ' + String(cellulesMax).padStart(42) + '   ' + String(0).padStart(25));
});
console.log('');
console.log('La version « slice » alloue (n−1) + (n−2) + … + 1 + 0 cellules — chaque étage');
console.log('recopie tout sauf la première case — soit n(n−1)/2 au total :');
console.log('à n = 800 elle a mobilisé ' + (800 * 799 / 2) + ' cellules pour additionner 800 nombres,');
console.log('et toutes sont vivantes en même temps, puisque chaque étage tient la sienne.');
console.log('Sa complexité est QUADRATIQUE en mémoire — et en temps aussi, puisque copier');
console.log('ces cellules est du travail. La version « indice » n’alloue rien : sa mémoire');
console.log('se limite à sa pile, qui est linéaire, comme celle de l’autre.');
console.log('');
console.log('Les deux fonctions rendent le même résultat sur toutes les tailles essayées,');
console.log('ont le même air, et l’une passe à l’échelle quand l’autre non. Ce qui les');
console.log('sépare tient dans un appel de méthode : le « .slice(1) » de la première.');
