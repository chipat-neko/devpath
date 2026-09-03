/* Comment comparer deux nombres à virgule. Trois règles circulent ; deux sont fausses
   dans un cas au moins, et on va le montrer plutôt que le dire. */

// RÈGLE 1 : l'égalité stricte.
console.log('0.1 + 0.2 === 0.3            : ' + (0.1 + 0.2 === 0.3));

// RÈGLE 2 : |a - b| < EPSILON. C'est celle que tout le monde copie.
const proche2 = (a, b) => Math.abs(a - b) < Number.EPSILON;

// RÈGLE 3 : une tolérance RELATIVE à la taille des nombres comparés.
const proche3 = (a, b, tol) => {
  if (a === b) return true;
  const d = Math.abs(a - b);
  return d <= (tol === undefined ? 1e-9 : tol) * Math.max(Math.abs(a), Math.abs(b));
};

console.log('');
console.log('');
console.log('comparaison                                        stricte  epsilon  relative  attendu');
const cas = [
  ['0.1 + 0.2   et 0.3', 0.1 + 0.2, 0.3, true],
  ['1e9 + 0.1   et 1e9 + 0.2', 1e9 + 0.1, 1e9 + 0.2, true],
  ['1e16 + 1    et 1e16 + 2', 1e16 + 1, 1e16 + 2, true],
  ['1e-20       et 2e-20', 1e-20, 2e-20, false],
  ['0.1*3       et 0.3', 0.1 * 3, 0.3, true],
  ['somme de 0.1 dix fois et 1', Array(10).fill(0.1).reduce((s, x) => s + x, 0), 1, true],
];
// La colonne « attendu » est le verdict qu'un humain donnerait. Elle n'est pas
// décorative : on s'en sert pour COMPTER les erreurs de chaque règle.
let errStricte = 0, errEps = 0, errRel = 0;
for (const [nom, a, b, att] of cas) {
  if ((a === b) !== att) errStricte++;
  if (proche2(a, b) !== att) errEps++;
  if (proche3(a, b) !== att) errRel++;
  console.log(nom.padEnd(51) + String(a === b).padEnd(9) + String(proche2(a, b)).padEnd(9) +
    String(proche3(a, b)).padEnd(10) + att);
}
console.log('');
console.log('desaccords avec la colonne « attendu » : stricte ' + errStricte + '/6, epsilon ' +
  errEps + '/6, relative ' + errRel + '/6');

// Où la règle 2 se casse : elle est ABSOLUE, donc elle ne survit pas au changement d'échelle.
console.log('');
console.log('la regle « |a-b| < EPSILON » sur deux nombres distants de 0.1, a des echelles croissantes :');
// L'écart réel entre deux flottants voisins (l'ULP), et non « base × EPSILON » qui
// le surestime jusqu'à 1,9 fois — la ligne 10^15 s'en contredirait elle-même.
function ulp(x) {
  const d = new DataView(new ArrayBuffer(8));
  d.setFloat64(0, x);
  d.setBigUint64(0, d.getBigUint64(0) + 1n);
  return d.getFloat64(0) - x;
}
console.log('echelle    ecart calcule            ecart entre deux flottants voisins   verdict de la regle 2');
for (const k of [0, 6, 12, 15, 16, 17]) {
  const base = 10 ** k;
  const a = base + 0.1, b = base + 0.2;
  console.log(('10^' + k).padEnd(11) + String(Math.abs(a - b)).padEnd(25) +
    String(ulp(base)).padEnd(37) + proche2(a, b));
}

console.log("=> des 10^15 l'ecart calcule vaut 0.125 et non 0.1 ; a partir de 10^16 il vaut ZERO,");
console.log("   et la regle 2 repond « egaux ». Non parce que les deux nombres sont proches, mais");
console.log("   parce que le 0.1 a disparu a l'addition : la regle n'a rien detecte, elle a lu zero.");

// Et la règle 3 a AUSSI sa limite : près de zéro, chaque règle échoue à sa manière.
console.log('');
console.log('1e-20 et 2e-20 : un facteur 2 d\'ecart, donc DEUX valeurs tres differentes.');
console.log('  regle 2, |a-b| < EPSILON       -> proches ? ' + proche2(1e-20, 2e-20) + '   <- faux positif');
console.log('  regle 3, tolerance relative    -> proches ? ' + proche3(1e-20, 2e-20) + '   <- correct ici');
console.log('  regle 3 avec une tolerance 0.6 -> proches ? ' + proche3(1e-20, 2e-20, 0.6) + '   <- tout depend du seuil');
console.log('aucune regle universelle : la tolerance depend de ce que le nombre MESURE.');
console.log('un prix, une distance et une probabilite n\'ont pas la meme tolerance acceptable.');

// Le seul cas où l'égalité stricte est sûre : les entiers sous 2^53.
let surprises = 0;
for (let i = 0; i < 100000; i++) if ((i + 1) - 1 !== i) surprises++;
console.log('');
console.log('100000 entiers passes par « (i+1)-1 » puis compares strictement : ' + surprises + ' surprise(s).');
console.log('l\'egalite stricte n\'est pas « interdite » : elle l\'est sur des CALCULS fractionnaires.');
