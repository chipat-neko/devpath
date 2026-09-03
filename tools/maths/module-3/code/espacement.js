/* Les flottants ne sont pas répartis régulièrement sur la droite des nombres.
   Près de zéro ils sont serrés, loin de zéro ils sont espacés — et cet espacement
   décide de tout ce qu'on peut mesurer. */

function suivant(x) {                           // le flottant immédiatement supérieur
  const buf = new DataView(new ArrayBuffer(8));
  buf.setFloat64(0, x);
  let n = buf.getBigUint64(0);
  n = x >= 0 ? n + 1n : n - 1n;
  buf.setBigUint64(0, n);
  return buf.getFloat64(0);
}
const ecart = (x) => suivant(x) - x;            // l'ULP : unit in the last place

console.log('valeur                    ecart avec le flottant suivant');
for (const x of [0, 1e-300, 0.1, 1, 100, 1e6, 1e9, 2 ** 52, 2 ** 53, 1e15, 1e16, 1e20]) {
  console.log(String(x).padEnd(26) + ecart(x));
}

console.log('');
console.log('Number.EPSILON = ' + Number.EPSILON + '   <- c\'est l\'ecart au voisinage de 1, et de 1 SEULEMENT.');
console.log('ecart au voisinage de 1        : ' + ecart(1));
console.log('ecart au voisinage de 1000000  : ' + ecart(1000000) + '   soit ' + Math.round(ecart(1e6) / Number.EPSILON) + ' fois EPSILON');

// La conséquence directe : au-delà de 2^53, ajouter 1 ne change plus rien.
console.log('');
console.log('2^53     = ' + 2 ** 53);
console.log('2^53 + 1 = ' + (2 ** 53 + 1) + '   <- inchange');
console.log('2^53 + 2 = ' + (2 ** 53 + 2) + '   <- la, ca bouge : l\'ecart y vaut ' + ecart(2 ** 53));

// Combien de flottants dans chaque intervalle ? La densité est un fait, pas une impression.
function index(x) {
  const buf = new DataView(new ArrayBuffer(8));
  buf.setFloat64(0, x);
  return buf.getBigUint64(0);
}
console.log('');
console.log('intervalle                 nombre de flottants qu\'il contient');
for (const [a, b] of [[0, 1], [1, 2], [2, 4], [1, 1e6], [1e6, 1e12]]) {
  console.log((a + ' a ' + b).padEnd(27) + (index(b) - index(a)).toString());
}
const tousPositifs = index(Infinity);
const sousUn = index(1);
console.log('');
console.log('flottants positifs finis au total : ' + tousPositifs);
console.log('dont sous 1                       : ' + sousUn + '  soit ' +
  (100 * Number(sousUn) / Number(tousPositifs)).toFixed(2) + ' %');
console.log('=> presque la moitie des flottants positifs vit entre 0 et 1.');
