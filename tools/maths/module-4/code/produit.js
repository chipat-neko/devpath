/* Le produit de DEUX matrices. La définition tient en une ligne, et elle dit exactement
   la même chose que le produit matrice-vecteur, répété une fois par colonne. */

function produit(X, Y) {
  const l = X.length, m = Y.length, c = Y[0].length;
  if (X[0].length !== m) throw new Error('dimensions incompatibles : ' + X[0].length + ' colonnes contre ' + m + ' lignes');
  const Z = Array.from({ length: l }, () => new Array(c).fill(0));
  for (let i = 0; i < l; i++) for (let j = 0; j < c; j++) {
    let s = 0;
    for (let k = 0; k < m; k++) s += X[i][k] * Y[k][j];   // ligne i de X, colonne j de Y
    Z[i][j] = s;
  }
  return Z;
}

function afficher(nom, M, noms) {
  console.log(nom);
  console.log('     ' + noms.map((s) => s.padStart(5)).join(''));
  M.forEach(function (ligne, i) {
    console.log(noms[i].padEnd(5) + ligne.map((x) => String(x).padStart(5)).join(''));
  });
}

const S = ['A', 'B', 'C', 'D', 'E'];
const ARETES = [['A', 'B'], ['A', 'C'], ['B', 'C'], ['B', 'D'], ['D', 'E'], ['C', 'E']];
const n = S.length;
const idx = new Map(S.map((s, i) => [s, i]));
const M = Array.from({ length: n }, () => new Array(n).fill(0));
for (const [a, b] of ARETES) { M[idx.get(a)][idx.get(b)] = 1; M[idx.get(b)][idx.get(a)] = 1; }

afficher('A, la matrice d\'adjacence :', M, S);

const A2 = produit(M, M);
console.log('');
afficher('A x A : le nombre de chemins de longueur 2 entre chaque paire', A2, S);

/* Ce que la case (i, j) de A^k vaut, on ne le croit pas : on le compte à la main. */
function cheminsDeLongueur(depart, but, k) {
  const voisins = S.map((_, i) => S.map((_, j) => j).filter((j) => M[i][j] === 1));
  let total = 0;
  (function marcher(s, reste) {
    if (reste === 0) { if (s === but) total++; return; }
    for (const v of voisins[s]) marcher(v, reste - 1);
  })(depart, k);
  return total;
}

let P = M.map((l) => l.slice());
let desaccords = 0, casesVerifiees = 0;
console.log('');
console.log('k    cases de A^k comparees a une enumeration directe    desaccords');
for (let k = 1; k <= 5; k++) {
  if (k > 1) P = produit(P, M);
  let mauvais = 0;
  for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
    casesVerifiees++;
    if (P[i][j] !== cheminsDeLongueur(i, j, k)) mauvais++;
  }
  desaccords += mauvais;
  console.log(String(k).padEnd(5) + String(n * n).padStart(20) + String(mauvais).padStart(35));
}
console.log('total : ' + casesVerifiees + ' cases verifiees, ' + desaccords + ' desaccords');

/* Un chemin n'est pas un chemin SIMPLE : A x A rend 2 pour la case (A, A), parce qu'on
   compte A -> B -> A et A -> C -> A. La diagonale de A^2 donne donc les DEGRES. */
console.log('');
console.log('diagonale de A^2 : ' + S.map((s, i) => s + '=' + A2[i][i]).join(', '));
console.log('degres           : ' + S.map((s, i) => s + '=' + M[i].reduce((x, y) => x + y, 0)).join(', '));

/* La diagonale de A^3 compte les chemins fermés de longueur 3, c'est-à-dire les TRIANGLES —
   chacun compté 6 fois : 3 sommets de départ, 2 sens de parcours. */
const A3 = produit(A2, M);
const trace = A3.reduce((s, l, i) => s + l[i], 0);
let triangles = 0;
for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) for (let k = j + 1; k < n; k++) {
  if (M[i][j] && M[j][k] && M[i][k]) triangles++;
}
console.log('');
console.log('trace de A^3 (somme de la diagonale) : ' + trace);
console.log('trace / 6 = ' + (trace / 6) + '   triangles comptes un par un : ' + triangles +
  '   -> ' + (trace / 6 === triangles ? 'egal' : 'DIFFERENT'));

/* LE PRODUIT N'EST PAS COMMUTATIF. Ce n'est pas une subtilité : c'est la règle. */
const X = [[1, 2], [0, 1]];
const Y = [[1, 0], [3, 1]];
console.log('');
console.log('X x Y = ' + JSON.stringify(produit(X, Y)));
console.log('Y x X = ' + JSON.stringify(produit(Y, X)) +
  '   -> ' + (JSON.stringify(produit(X, Y)) === JSON.stringify(produit(Y, X)) ? 'egaux' : 'DIFFERENTS'));

/* Sur combien de paires tirées au sort le produit commute-t-il ? */
function rng(g) { let x = g >>> 0; return function () { x ^= x << 13; x >>>= 0; x ^= x >> 17; x ^= x << 5; x >>>= 0; return x / 4294967296; }; }
const al = rng(20250903);
let commutent = 0, essais = 0;
for (let t = 0; t < 10000; t++) {
  const a = [[Math.floor(al() * 5), Math.floor(al() * 5)], [Math.floor(al() * 5), Math.floor(al() * 5)]];
  const b = [[Math.floor(al() * 5), Math.floor(al() * 5)], [Math.floor(al() * 5), Math.floor(al() * 5)]];
  essais++;
  if (JSON.stringify(produit(a, b)) === JSON.stringify(produit(b, a))) commutent++;
}
console.log('sur ' + essais + ' paires de matrices 2x2 a coefficients entiers de 0 a 4, X x Y = Y x X : ' +
  commutent + ' fois (' + (commutent / essais * 100).toFixed(2) + ' %)');

/* Un tirage donne une estimation ; la loi etant finie, on peut faire mieux : les ENUMERER TOUTES.
   5^4 matrices, donc 5^8 paires — 390 625, c est a portee. */
let toutes = 0, toutesCommutent = 0, triviales = 0;
const M2 = [];
for (let a = 0; a < 5; a++) for (let b = 0; b < 5; b++) for (let c = 0; c < 5; c++) for (let e = 0; e < 5; e++) M2.push([[a, b], [c, e]]);
for (const X2 of M2) for (const Y2 of M2) {
  toutes++;
  if (JSON.stringify(produit(X2, Y2)) === JSON.stringify(produit(Y2, X2))) {
    toutesCommutent++;
    const scalaire = (Z) => Z[0][1] === 0 && Z[1][0] === 0 && Z[0][0] === Z[1][1];
    if (scalaire(X2) || scalaire(Y2) || JSON.stringify(X2) === JSON.stringify(Y2)) triviales++;
  }
}
console.log('en les enumerant TOUTES (' + toutes + ' paires) : ' + toutesCommutent + ' commutent, soit ' +
  (toutesCommutent / toutes * 100).toFixed(2) + ' %');
console.log('  dont ' + triviales + ' cas triviaux (une matrice scalaire, ou X = Y), soit ' +
  (triviales / toutesCommutent * 100).toFixed(0) + ' % des cas de commutation');

/* IL EST EN REVANCHE ASSOCIATIF. On le vérifie sur 2 000 triplets. */
let associent = 0;
for (let t = 0; t < 2000; t++) {
  const a = [[Math.floor(al() * 9), Math.floor(al() * 9)], [Math.floor(al() * 9), Math.floor(al() * 9)]];
  const b = [[Math.floor(al() * 9), Math.floor(al() * 9)], [Math.floor(al() * 9), Math.floor(al() * 9)]];
  const c = [[Math.floor(al() * 9), Math.floor(al() * 9)], [Math.floor(al() * 9), Math.floor(al() * 9)]];
  if (JSON.stringify(produit(produit(a, b), c)) === JSON.stringify(produit(a, produit(b, c)))) associent++;
}
console.log('sur 2000 triplets ENTIERS, (X x Y) x Z = X x (Y x Z) : ' + associent + ' fois');

/* MAIS : l associativite est vraie en mathematiques, pas au bit pres en virgule flottante.
   On refait exactement le meme essai avec des coefficients decimaux. */
let assocFlottants = 0, pireAssoc = 0;
for (let t = 0; t < 2000; t++) {
  const tirer = () => Array.from({ length: 3 }, () => Array.from({ length: 3 }, () => al() * 2 - 1));
  const a = tirer(), b = tirer(), c = tirer();
  const g = produit(produit(a, b), c), dr = produit(a, produit(b, c));
  let ecart = 0;
  for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) ecart = Math.max(ecart, Math.abs(g[i][j] - dr[i][j]));
  if (ecart === 0) assocFlottants++;
  if (ecart > pireAssoc) pireAssoc = ecart;
}
console.log('sur 2000 triplets FLOTTANTS, resultats identiques au bit pres : ' + assocFlottants + ' fois');
console.log('  pire ecart : ' + pireAssoc.toExponential(2) + '  -> l associativite est vraie en maths,');
console.log('  pas au dernier bit en virgule flottante : c est le sujet de la lecon 9.');

/* Et cette associativité N'EST PAS gratuite : elle laisse le choix de l'ordre, et l'ordre
   change le nombre de multiplications. On les compte, pour une chaine (50x5)(5x60)(60x4). */
function coutChaine(d) {                          // d = [50, 5, 60, 4] : les dimensions successives
  const gauche = d[0] * d[1] * d[2] + d[0] * d[2] * d[3];   // ((AB)C)
  const droite = d[1] * d[2] * d[3] + d[0] * d[1] * d[3];   // (A(BC))
  return { gauche: gauche, droite: droite };
}
const c1 = coutChaine([50, 5, 60, 4]);
console.log('');
console.log('chaine (50x5)(5x60)(60x4) : ((AB)C) coute ' + c1.gauche +
  ' multiplications, (A(BC)) en coute ' + c1.droite +
  '  -> rapport ' + (c1.gauche / c1.droite).toFixed(1));
const c2 = coutChaine([10, 100, 5, 50]);
console.log('chaine (10x100)(100x5)(5x50) : ((AB)C) coute ' + c2.gauche +
  ' , (A(BC)) en coute ' + c2.droite + '  -> rapport ' + (c2.droite / c2.gauche).toFixed(1) +
  ' dans l autre sens');
console.log('meme resultat dans les deux cas, mais pas le meme travail.');
