/* Ce que coûte un produit de matrices — compté en multiplications, jamais en millisecondes,
   pour que le chiffre soit le même sur toutes les machines. */

let compteur = 0;
function produitCompte(X, Y) {
  const l = X.length, m = Y.length, c = Y[0].length;
  const Z = Array.from({ length: l }, () => new Array(c).fill(0));
  for (let i = 0; i < l; i++) for (let j = 0; j < c; j++) {
    let s = 0;
    for (let k = 0; k < m; k++) { s += X[i][k] * Y[k][j]; compteur++; }
    Z[i][j] = s;
  }
  return Z;
}

function rng(g) { let x = g >>> 0; return function () { x ^= x << 13; x >>>= 0; x ^= x >> 17; x ^= x << 5; x >>>= 0; return x / 4294967296; }; }
function carree(n, graine, densite) {
  const al = rng(graine);
  return Array.from({ length: n }, () => Array.from({ length: n },
    () => (densite === undefined || al() < densite ? 1 + Math.round(al() * 8) : 0)));
}

console.log('n     multiplications comptees   n au cube   accord');
[2, 4, 8, 16, 32, 64].forEach(function (n) {
  compteur = 0;
  produitCompte(carree(n, 1000 + n), carree(n, 2000 + n));
  console.log(String(n).padEnd(6) + String(compteur).padStart(23) + String(n * n * n).padStart(12) +
    (compteur === n * n * n ? '     oui' : '     NON'));
});

/* La conséquence, en une ligne : doubler n multiplie le travail par HUIT. */
console.log('');
console.log('doubler n multiplie le travail par : ' + (16 * 16 * 16) / (8 * 8 * 8) +
  '  (mesure : ' + (16 * 16 * 16) + ' contre ' + (8 * 8 * 8) + ')');
console.log('');
console.log('a l echelle du terrain, sans rien executer, par le simple n au cube :');
[100, 1000, 10000, 100000].forEach(function (n) {
  const mult = Math.pow(n, 3);
  console.log('  n = ' + String(n).padStart(6) + '  ->  ' + mult.toExponential(1) +
    ' multiplications' + (n >= 10000 ? '   (hors de portee d un navigateur)' : ''));
});

/* Une matrice CREUSE change tout : sauter les zéros ne change pas le résultat,
   seulement le travail. On compte les deux, et on vérifie qu'ils sont d'accord. */
function produitCreux(X, Y) {
  const l = X.length, m = Y.length, c = Y[0].length;
  const Z = Array.from({ length: l }, () => new Array(c).fill(0));
  let ops = 0;
  for (let i = 0; i < l; i++) for (let k = 0; k < m; k++) {
    if (X[i][k] === 0) continue;                     // toute une colonne de travail evitee
    for (let j = 0; j < c; j++) { Z[i][j] += X[i][k] * Y[k][j]; ops++; }
  }
  return { Z: Z, ops: ops };
}

console.log('');
console.log('densite visee   densite reelle de X   mult. denses   mult. creuses   memes resultats');
[1, 0.5, 0.2, 0.05, 0.01].forEach(function (d, i) {
  const n = 64;
  const X = carree(n, 3000 + i * 101, d), Y = carree(n, 4000 + i * 101);   // Y reste DENSE
  const nonNuls = X.reduce(function (a, l) { return a + l.filter(function (x) { return x !== 0; }).length; }, 0);
  compteur = 0;
  const dense = produitCompte(X, Y);
  const opsDenses = compteur;
  const creux = produitCreux(X, Y);
  const identique = JSON.stringify(dense) === JSON.stringify(creux.Z);
  console.log(String(d).padEnd(16) + (nonNuls / (n * n)).toFixed(4).padStart(14) +
    String(opsDenses).padStart(19) + String(creux.ops).padStart(16) +
    (identique ? '   oui' : '   NON').padStart(18));
});
console.log('(seule X est creuse ici : le gain vient de ses zeros, Y reste pleine)');

/* STRASSEN : sept produits au lieu de huit sur des blocs deux fois plus petits.
   Le gain n'est pas dans une constante, il est dans l'EXPOSANT. */
const expStrassen = Math.log(7) / Math.log(2);
console.log('');
console.log('exposant de la methode ordinaire : 3');
console.log('exposant de Strassen : log(7)/log(2) = ' + expStrassen.toFixed(4));
console.log('');
console.log('a CONSTANTES EGALES, ce qu elles ne sont pas : Strassen paie en additions et en memoire.');
console.log('');
console.log('n        n^3            n^' + expStrassen.toFixed(3) + '        rapport');
[128, 1024, 4096].forEach(function (n) {
  const a = Math.pow(n, 3), b = Math.pow(n, expStrassen);
  console.log(String(n).padEnd(9) + a.toExponential(2).padEnd(15) + b.toExponential(2).padEnd(15) +
    (a / b).toFixed(2));
});
console.log('');
console.log('le gain existe, mais il est modeste avant plusieurs centaines de lignes :');
console.log('  a n = 128, le rapport vaut ' + (Math.pow(128, 3) / Math.pow(128, expStrassen)).toFixed(2) +
  ' , et Strassen paie en additions et en memoire ce qu il gagne en produits.');

/* Enfin, ce que coûte une INFERENCE de réseau de neurones : c'est la même formule.
   Une couche (sortie x entree) coûte sortie x entree multiplications. */
const RESEAU = [[784, 512], [512, 256], [256, 10]];    // un classifieur d'images minuscule
let totalReseau = 0, poids = 0;
console.log('');
let biais = 0;
console.log('couche          multiplications   poids   biais   parametres');
RESEAU.forEach(function (c) {
  const mult = c[0] * c[1];
  totalReseau += mult; poids += mult; biais += c[1];
  console.log((c[0] + ' -> ' + c[1]).padEnd(16) + String(mult).padStart(15) + String(mult).padStart(8) +
    String(c[1]).padStart(8) + String(mult + c[1]).padStart(13));
});
console.log('total           ' + String(totalReseau).padStart(15) + String(poids).padStart(8) +
  String(biais).padStart(8) + String(poids + biais).padStart(13));
console.log('(un POIDS par multiplication, exactement : chaque coefficient de W sert une fois par image)');
console.log('');
console.log('pour UNE image. Pour un lot de 128 images : ' + (totalReseau * 128).toExponential(2) +
  ' multiplications.');
console.log('c est exactement pour cela qu on achete des cartes graphiques : elles font ce produit,');
console.log('et rien d autre, par dizaines de milliers en parallele.');
