/* De l'argent en flottants : le cas où l'erreur d'arrondi devient un litige.
   On facture, on compare, on choisit. */

// 1) Le calcul de TVA, en euros flottants.
const prixHT = 19.99, taux = 0.2;
const tva = prixHT * taux;
console.log('prix HT   : ' + prixHT);
console.log('TVA 20 %  : ' + tva);
console.log('total TTC : ' + (prixHT + tva));
console.log('arrondi au centime : ' + (prixHT + tva).toFixed(2));

// 2) Le même panier, en CENTIMES entiers.
const prixC = 1999, tvaC = Math.round(prixC * 20 / 100);
console.log('');
console.log('en centimes : ' + prixC + ' + ' + tvaC + ' = ' + (prixC + tvaC) + ' centimes, soit ' +
  ((prixC + tvaC) / 100).toFixed(2) + ' euros');

// 3) Cent lignes de facture : les deux méthodes divergent-elles ?
const lignes = [];
for (let i = 1; i <= 100; i++) lignes.push(Math.round(100 + i * 37.13) / 100 * 100);
let flottant = 0, centimes = 0;
for (const c of lignes) { flottant += c / 100; centimes += Math.round(c); }
console.log('');
console.log('100 lignes de facture');
console.log('  total en euros flottants : ' + flottant);
console.log('  total en centimes        : ' + centimes + ' centimes, soit ' + (centimes / 100).toFixed(2));
console.log('  ecart                    : ' + (flottant * 100 - centimes) + ' centimes');
console.log('  les deux affichent-ils la meme chose apres toFixed(2) ? ' +
  (flottant.toFixed(2) === (centimes / 100).toFixed(2)));

// 4) toFixed n'est pas un arrondi mathématique : il arrondit la valeur BINAIRE stockée.
console.log('');
console.log('valeur     toFixed(2)   valeur exacte stockee');
for (const x of [1.005, 1.015, 1.025, 2.675, 8.575]) {
  console.log(String(x).padEnd(11) + x.toFixed(2).padEnd(13) + x.toPrecision(20));
}
console.log('=> 1.005.toFixed(2) rend ' + (1.005).toFixed(2) + ' : le nombre stocke est un CHEVEU sous 1.005,');
console.log('   donc l\'arrondi au plus proche descend. Ce n\'est pas un defaut de toFixed :');
console.log('   c\'est que le nombre 1.005 n\'a jamais ete dans la variable.');

// 5) Combien de valeurs ÉCRITES au demi-centime sont mal arrondies par toFixed ?
// Il faut les ÉCRIRE, pas les calculer : « i/100 + 0.005 » empile deux arrondis de
// plus et ne donne pas le même flottant que le littéral dans un tiers des cas.
let mauvais = 0, total = 0, ecrites = 0;
const exemples = [];
for (let i = 0; i < 10000; i++) {
  const texte = Math.floor(i / 100) + '.' + String(i % 100).padStart(2, '0') + '5';
  const v = Number(texte);                      // le flottant du littéral « x.xx5 »
  if (v !== i / 100 + 0.005) ecrites++;         // combien diffèrent de la version calculée
  total++;
  const attendu = ((i + 1) / 100).toFixed(2);   // la règle « moitié vers le haut »
  if (v.toFixed(2) !== attendu) { mauvais++; if (exemples.length < 5) exemples.push(texte + ' -> ' + v.toFixed(2) + ' au lieu de ' + attendu); }
}
console.log('');
console.log('valeurs ECRITES « x,xx5 » essayees   : ' + total);
console.log('arrondies vers le BAS par toFixed    : ' + mauvais + '  (' + (100 * mauvais / total).toFixed(1) + ' %)');
console.log('exemples : ' + exemples.join(' | '));
console.log('pour information, « i/100 + 0.005 » donne un AUTRE flottant dans ' + ecrites + ' cas sur ' + total + ' :');
console.log('  ce calcul-la n aurait pas mesure ce qu on ecrit, mais ce qu on calcule.');
console.log('=> ce n est ni aleatoire ni un bogue : cela depend, pour chaque valeur, du cote');
console.log('   ou tombe l approximation binaire.');

// 6) La règle de survie.
console.log('');
console.log('REGLE : stocker et calculer en unites entieres indivisibles (centimes),');
console.log('        ne convertir en decimal QU\'A L\'AFFICHAGE.');
console.log('centimes disponibles avant de depasser 2^53 : ' + Number.MAX_SAFE_INTEGER);
console.log("soit environ " + Math.round(Number.MAX_SAFE_INTEGER / 100 / 1e9) + " milliards d'euros : assez pour toute comptabilite d'entreprise.");
