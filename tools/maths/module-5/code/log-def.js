/* UN LOGARITHME EST UN COMPTEUR DE DIVISIONS. Rien de plus.
   log₂(n) = combien de fois peut-on couper n en deux avant d’arriver à 1.
   On ne le suppose pas : on compte. */

function diviserEntier(n) {          // on divise des ENTIERS : c’est ce que fait un algorithme
  let coups = 0, v = n;
  while (v > 1) { v = Math.floor(v / 2); coups++; }
  return coups;
}

console.log('           n   divisions par 2   log₂(n)   Math.log2   écart');
console.log('  ----------   ---------------   -------   ---------   -----');
[1, 2, 3, 4, 8, 10, 100, 1000, 1024, 1000000, 1073741824].forEach(function (n) {
  const compte = diviserEntier(n);
  const exact = Math.log2(n);
  console.log('  ' + String(n).padStart(10) + '   ' + String(compte).padStart(15) + '   ' +
    exact.toFixed(3).padStart(7) + '   ' + exact.toFixed(6).padStart(9) + '   ' +
    (compte - exact).toFixed(3).padStart(5));
});
console.log('');
console.log('Le compte entier vaut ⌊log₂ n⌋ : il coïncide exactement avec le logarithme');
console.log('quand n est une puissance de 2, et lui est inférieur sinon, de moins de 1.');

/* --- ce qui rend le logarithme si plat ----------------------------------- */
console.log('');
console.log('CE QUI REND LE LOGARITHME SI PLAT');
console.log('  Passer de n à 2n ajoute UNE division. Toujours une, jamais plus :');
[1000, 2000, 4000, 8000].forEach(function (m) {
  console.log('    log₂(' + String(m).padStart(4) + ') = ' + Math.log2(m).toFixed(4));
});
console.log('  Et passer de n à 1000n en ajoute log₂(1000) = ' + Math.log2(1000).toFixed(2) + ' :');
console.log('');
console.log('              n   log₂(n)   ajouté depuis la ligne précédente');
console.log('  -------------   -------   ---------------------------------');
let prec = null;
[1000, 1000000, 1000000000, 1000000000000, 1e15, 1e18].forEach(function (n) {
  const l = Math.log2(n);
  console.log('  ' + n.toExponential(0).padStart(13) + '   ' + l.toFixed(2).padStart(7) + '   ' +
    (prec === null ? '' : '+' + (l - prec).toFixed(2)).padStart(33));
  prec = l;
});
console.log('');
console.log('De mille à un milliard de milliards — un facteur 10^15 —, le logarithme');
console.log('passe de ' + Math.log2(1000).toFixed(2) + ' à ' + Math.log2(1e18).toFixed(2) +
  '. Il est multiplié par ' + (Math.log2(1e18) / Math.log2(1000)).toFixed(1) + ', quand n l’est par 10^15.');
console.log('C’est POUR CELA qu’un algorithme logarithmique ne s’écroule jamais.');

/* --- les trois logarithmes qu’on croise, et leur rapport ----------------- */
console.log('');
console.log('LES TROIS LOGARITHMES QU’ON CROISE');
const n = 1000000;
console.log('  log₂(' + n + ')  = ' + Math.log2(n).toFixed(4) + '   « combien de divisions par 2 »');
console.log('  log₁₀(' + n + ') = ' + Math.log10(n).toFixed(4) + '   « combien de chiffres, moins un »');
console.log('  ln(' + n + ')    = ' + Math.log(n).toFixed(4) + '   « le logarithme des mathématiciens »');
console.log('');
console.log('  log₂ / log₁₀ = ' + (Math.log2(n) / Math.log10(n)).toFixed(6) + '  et 1/log₁₀(2) = ' +
  (1 / Math.log10(2)).toFixed(6));
console.log('  log₂ / ln ... = ' + (Math.log2(n) / Math.log(n)).toFixed(6) + '  et 1/ln(2) ... = ' +
  (1 / Math.LN2).toFixed(6));
console.log('');
console.log('Le rapport entre deux logarithmes ne dépend PAS de n : c’est une constante.');
console.log('Vérifions-le sur des tailles qui n’ont rien à voir :');
[7, 1000, 123456789].forEach(function (m) {
  console.log('  n = ' + String(m).padStart(9) + '   log₂/log₁₀ = ' + (Math.log2(m) / Math.log10(m)).toFixed(9));
});
console.log('');
console.log('C’est pour cela qu’on écrit O(log n) SANS PRÉCISER LA BASE : changer de base');
console.log('multiplie par une constante, et la notation jette les constantes.');
