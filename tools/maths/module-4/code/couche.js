/* « Un réseau de neurones est une suite de produits de matrices. » La phrase est exacte,
   et elle cache la seule chose qui rend ces réseaux capables d'autre chose qu'une droite. */

function fois(M, v) {
  return M.map(function (ligne) {
    let s = 0;
    for (let j = 0; j < v.length; j++) s += ligne[j] * v[j];
    return s;
  });
}
function plus(a, b) { return a.map((x, i) => x + b[i]); }
function produit(X, Y) {
  const Z = Array.from({ length: X.length }, () => new Array(Y[0].length).fill(0));
  for (let i = 0; i < X.length; i++) for (let j = 0; j < Y[0].length; j++) {
    let s = 0;
    for (let k = 0; k < Y.length; k++) s += X[i][k] * Y[k][j];
    Z[i][j] = s;
  }
  return Z;
}

/* UNE COUCHE, c'est exactement ceci : un produit matrice-vecteur, un biais, une fonction
   appliquée case par case. Trois lignes, et c'est tout le vocabulaire de l'apprentissage profond. */
function couche(W, b, activation) {
  return function (x) { return plus(fois(W, x), b).map(activation); };
}
const identite = (x) => x;
const relu = (x) => (x > 0 ? x : 0);

/* Le problème choisi est le plus petit qui résiste à une droite : le OU EXCLUSIF.
   (0,0) et (1,1) valent 0 ; (0,1) et (1,0) valent 1. */
const CAS = [[0, 0], [0, 1], [1, 0], [1, 1]];
const ATTENDU = [0, 1, 1, 0];

/* Des poids posés à la main — deux neurones qui découpent le plan, puis un qui les combine. */
const W1 = [[1, 1], [1, 1]];
const b1 = [0, -1];
const W2 = [[1, -2]];
const b2 = [0];

console.log('-- le reseau AVEC activation (ReLU) --');
const c1 = couche(W1, b1, relu), c2 = couche(W2, b2, identite);
let justes = 0;
CAS.forEach(function (x, i) {
  const cache = c1(x), sortie = c2(cache);
  const ok = Math.abs(sortie[0] - ATTENDU[i]) < 1e-9;
  if (ok) justes++;
  console.log('entree ' + JSON.stringify(x) + '  couche cachee ' + JSON.stringify(cache) +
    '  sortie ' + sortie[0] + '  attendu ' + ATTENDU[i] + (ok ? '  ok' : '  FAUX'));
});
console.log('reponses justes : ' + justes + ' sur ' + CAS.length);

/* MAINTENANT, LE MÊME RÉSEAU SANS ACTIVATION. Rien d'autre ne change. */
console.log('');
console.log('-- le meme reseau SANS activation --');
const l1 = couche(W1, b1, identite), l2 = couche(W2, b2, identite);
let justes2 = 0;
const sansAct = [];
CAS.forEach(function (x, i) {
  const sortie = l2(l1(x));
  sansAct.push(sortie[0]);
  const ok = Math.abs(sortie[0] - ATTENDU[i]) < 1e-9;
  if (ok) justes2++;
  console.log('entree ' + JSON.stringify(x) + '  sortie ' + sortie[0] +
    '  attendu ' + ATTENDU[i] + (ok ? '  ok' : '  FAUX'));
});
console.log('reponses justes : ' + justes2 + ' sur ' + CAS.length);

/* POURQUOI il ne peut pas y arriver : sans activation, les deux couches se REPLIENT
   en une seule matrice. On la calcule, et on vérifie qu'elle donne exactement la même chose. */
const Wplie = produit(W2, W1);
const bplie = plus(fois(W2, b1), b2);
console.log('');
console.log('les deux couches repliees en une seule :');
console.log('  W2 x W1 = ' + JSON.stringify(Wplie) + '   biais = ' + JSON.stringify(bplie));
let ecarts = 0;
CAS.forEach(function (x, i) {
  const parUneCouche = plus(fois(Wplie, x), bplie)[0];
  if (Math.abs(parUneCouche - sansAct[i]) > 1e-12) ecarts++;
});
console.log('  ecarts entre « deux couches sans activation » et « une seule couche » : ' + ecarts +
  ' sur ' + CAS.length);

/* Et AUCUNE couche linéaire unique ne peut résoudre le OU EXCLUSIF. On l'essaie
   sur 200 000 couches tirées au sort — puis on donne la raison, qui tient en une identité. */
function rngA(g) { let x = g >>> 0; return function () { x ^= x << 13; x >>>= 0; x ^= x >> 17; x ^= x << 5; x >>>= 0; return x / 4294967296; }; }
function tirage(tolerance, graine) {
  const tir = rngA(graine);
  let reussites = 0;
  for (let t = 0; t < 200000; t++) {
    const w = [tir() * 20 - 10, tir() * 20 - 10], biais = tir() * 20 - 10;
    let ok = true;
    for (let i = 0; i < CAS.length; i++) {
      const y = w[0] * CAS[i][0] + w[1] * CAS[i][1] + biais;
      if (Math.abs(y - ATTENDU[i]) > tolerance) { ok = false; break; }
    }
    if (ok) reussites++;
  }
  return reussites;
}
console.log('');
console.log('couches lineaires tirees au sort qui resolvent le OU EXCLUSIF, 200 000 tirages par ligne :');
console.log('');
console.log('tolerance   reussites');
[0.5, 0.51, 0.6, 0.75, 1].forEach(function (tol, k) {
  console.log(String(tol).padEnd(12) + String(tirage(tol, 13579 + k * 7919)).padStart(9));
});
console.log('');
console.log('le tableau montre que 0,5 n est PAS une tolerance genereuse : c est le fil du rasoir.');
console.log('la raison ne depend d aucun tirage : pour toute fonction affine,');
console.log('f(0,0) + f(1,1) = f(0,1) + f(1,0). Le OU EXCLUSIF exige ' +
  (ATTENDU[0] + ATTENDU[3]) + ' = ' + (ATTENDU[1] + ATTENDU[2]) + ' , donc un ecart total d au moins 2 :');
console.log('a tolerance ' + 0.5 + ', il faudrait les QUATRE erreurs a exactement 0,5 — un seul point,');
console.log('de mesure nulle dans un espace a trois parametres. L echec etait acquis avant la boucle.');

/* Le résultat vaut pour n'importe quelle profondeur : on empile dix couches au hasard,
   et on montre qu'une seule matrice les remplace, au dernier chiffre près. */
function rng(g) { let x = g >>> 0; return function () { x ^= x << 13; x >>>= 0; x ^= x >> 17; x ^= x << 5; x >>>= 0; return x / 4294967296; }; }
const al = rng(90210);
const T = 4;                                        // largeur des couches
const couches = [];
for (let k = 0; k < 10; k++) {
  couches.push(Array.from({ length: T }, () => Array.from({ length: T }, () => Math.round((al() * 2 - 1) * 100) / 100)));
}
let Wtotal = couches[0];
for (let k = 1; k < couches.length; k++) Wtotal = produit(couches[k], Wtotal);

let pireEcart = 0;
for (let t = 0; t < 500; t++) {
  const x = Array.from({ length: T }, () => Math.round((al() * 20 - 10) * 100) / 100);
  let v = x.slice();
  for (const W of couches) v = fois(W, v);          // dix couches, sans activation
  const w = fois(Wtotal, x);                        // une seule matrice
  for (let i = 0; i < T; i++) pireEcart = Math.max(pireEcart, Math.abs(v[i] - w[i]));
}
console.log('');
console.log('10 couches lineaires empilees, remplacees par UNE matrice ' + T + 'x' + T + ' :');
console.log('  pire ecart sur 500 entrees tirees au sort : ' + pireEcart.toExponential(2));
console.log('  (l ecart n est pas nul a cause des arrondis flottants, sujet de la lecon 9)');

/* Et avec l'activation ? On refait exactement le même empilement, ReLU en plus. */
let pireEcartAvecRelu = 0, differents = 0;
for (let t = 0; t < 500; t++) {
  const x = Array.from({ length: T }, () => Math.round((al() * 20 - 10) * 100) / 100);
  let v = x.slice();
  for (const W of couches) v = fois(W, v).map(relu);
  const w = fois(Wtotal, x);
  let d = 0;
  for (let i = 0; i < T; i++) d = Math.max(d, Math.abs(v[i] - w[i]));
  if (d > 1e-9) differents++;
  pireEcartAvecRelu = Math.max(pireEcartAvecRelu, d);
}
console.log('');
console.log('les memes 10 couches AVEC ReLU, comparees a la meme matrice unique :');
console.log('  entrees ou le resultat differe : ' + differents + ' sur 500');
console.log('  pire ecart : ' + pireEcartAvecRelu.toFixed(2));
console.log('');
console.log('conclusion : sans fonction non lineaire, la profondeur ne sert a RIEN.');
