/* Exercice 6 — pourquoi « tourner puis déplacer » ne donne pas « déplacer puis tourner ».
   C'est la non-commutativité du produit matriciel, et elle est visible à l'écran :
   c'est exactement ce que fait la propriété CSS transform, dont l'ordre compte. */

/* Astuce des COORDONNEES HOMOGENES : on ajoute une troisième coordonnée valant 1,
   ce qui permet d'écrire une translation — qui n'est pas linéaire — comme une matrice. */
function produit(X, Y) {
  const Z = Array.from({ length: X.length }, () => new Array(Y[0].length).fill(0));
  for (let i = 0; i < X.length; i++) for (let j = 0; j < Y[0].length; j++) {
    let s = 0;
    for (let k = 0; k < Y.length; k++) s += X[i][k] * Y[k][j];
    Z[i][j] = s;
  }
  return Z;
}
function applique(M, p) {                          // arrondi À L'AFFICHAGE, pour lire des points ronds
  const v = brut(M, p);
  return [Math.round(v[0] * 1e9) / 1e9, Math.round(v[1] * 1e9) / 1e9];
}
function brut(M, p) {                              // sans aucun arrondi : pour MESURER un écart
  const r = produit(M, [[p[0]], [p[1]], [1]]);
  return [r[0][0], r[1][0]];
}

const rotation = (deg) => {
  const a = deg * Math.PI / 180, c = Math.cos(a), s = Math.sin(a);
  return [[c, -s, 0], [s, c, 0], [0, 0, 1]];
};
const translation = (dx, dy) => [[1, 0, dx], [0, 1, dy], [0, 0, 1]];
const echelle = (k) => [[k, 0, 0], [0, k, 0], [0, 0, 1]];

const P = [10, 0];
const R = rotation(90), T = translation(100, 0);

console.log('point de depart : ' + JSON.stringify(P));
console.log('');
console.log('rotation de 90 degres seule    : ' + JSON.stringify(applique(R, P)));
console.log('translation de (100, 0) seule  : ' + JSON.stringify(applique(T, P)));
console.log('');

/* La composition se lit de DROITE à GAUCHE : dans R x T, c'est T qui s'applique d'abord. */
const RT = produit(R, T), TR = produit(T, R);
const a = applique(RT, P), b = applique(TR, P);
console.log('R x T (on translate, PUIS on tourne) : ' + JSON.stringify(a));
console.log('T x R (on tourne, PUIS on translate) : ' + JSON.stringify(b));
console.log('distance entre les deux resultats    : ' +
  Math.hypot(a[0] - b[0], a[1] - b[1]).toFixed(3) + ' pixels');

/* On ne se fie pas à la matrice : on refait les deux à la main, sans aucun produit. */
function tourner90(p) { return [-p[1], p[0]]; }
function translater(p, dx, dy) { return [p[0] + dx, p[1] + dy]; }
const aMain = tourner90(translater(P, 100, 0));
const bMain = translater(tourner90(P), 100, 0);
const arrondi = (p) => p.map((x) => Math.round(x * 1e9) / 1e9);
console.log('');
console.log('les memes calculs sans matrice : ' + JSON.stringify(arrondi(aMain)) +
  ' et ' + JSON.stringify(arrondi(bMain)));
console.log('accord avec les matrices : ' +
  (JSON.stringify(a) === JSON.stringify(arrondi(aMain)) &&
   JSON.stringify(b) === JSON.stringify(arrondi(bMain)) ? 'oui, sur les deux' : 'NON'));

/* Sur combien de paires de transformations l'ordre change-t-il quelque chose ? */
function rng(g) { let x = g >>> 0; return function () { x ^= x << 13; x >>>= 0; x ^= x >> 17; x ^= x << 5; x >>>= 0; return x / 4294967296; }; }
const al = rng(2718281);
const NOMS = ['rotation', 'translation', 'echelle'];
const fabriques = [
  () => rotation(Math.round(al() * 360)),
  () => translation(Math.round(al() * 200 - 100), Math.round(al() * 200 - 100)),
  () => echelle(1 + Math.round(al() * 300) / 100),
];
let essais = 0, differents = 0, pireEcart = 0;
const parType = {};
for (let t = 0; t < 5000; t++) {
  const a = Math.floor(al() * 3), b = Math.floor(al() * 3);
  const X = fabriques[a](), Y = fabriques[b]();
  const p = [Math.round(al() * 200 - 100), Math.round(al() * 200 - 100)];
  const u = applique(produit(X, Y), p), w = applique(produit(Y, X), p);
  essais++;
  const dist = Math.hypot(u[0] - w[0], u[1] - w[1]);
  const cle = [NOMS[a], NOMS[b]].sort().join(' + ');
  if (!parType[cle]) parType[cle] = { total: 0, differents: 0 };
  parType[cle].total++;
  if (dist > 1e-6) { differents++; parType[cle].differents++; if (dist > pireEcart) pireEcart = dist; }
}
console.log('');
console.log('sur ' + essais + ' paires de transformations tirees au sort :');
console.log('  l ordre change le resultat : ' + differents + ' fois (' +
  (differents / essais * 100).toFixed(1) + ' %)');
console.log('  plus grand ecart constate : ' + pireEcart.toFixed(1) + ' pixels');
console.log('');
console.log('  et le detail PAR TYPE de paire, qui dit ou se cache la commutativite :');
Object.keys(parType).sort().forEach(function (k) {
  const r = parType[k];
  console.log('    ' + k.padEnd(26) + String(r.total).padStart(5) + ' paires , ' +
    String(r.differents).padStart(5) + ' differentes (' + (r.differents / r.total * 100).toFixed(1) + ' %)');
});
console.log('  -> ce n est pas « les rotations » qui commutent : c est TOUT ce qui ne contient pas de translation.');

/* Deux rotations, en revanche, commutent toujours : tourner de 30 puis de 50 revient
   au meme que l inverse. On le verifie, parce qu une exception a une regle se verifie. */
let rotDifferentes = 0;
for (let t = 0; t < 5000; t++) {
  const X = rotation(Math.round(al() * 360)), Y = rotation(Math.round(al() * 360));
  const p = [Math.round(al() * 200 - 100), Math.round(al() * 200 - 100)];
  const u = applique(produit(X, Y), p), w = applique(produit(Y, X), p);
  if (Math.hypot(u[0] - w[0], u[1] - w[1]) > 1e-6) rotDifferentes++;
}
console.log('');
console.log('sur 5000 paires de ROTATIONS seules, l ordre change le resultat : ' +
  rotDifferentes + ' fois');
console.log('  (deux rotations autour du meme centre commutent : leurs angles s additionnent)');

/* Et le gain pratique : composer une fois, appliquer un million de fois. */
const chaine = [translation(50, 20), rotation(37), echelle(1.5), translation(-10, 5)];
let composee = chaine[0];
for (let k = 1; k < chaine.length; k++) composee = produit(composee, chaine[k]);
let pire = 0;
for (let t = 0; t < 2000; t++) {
  const p = [Math.round(al() * 400 - 200), Math.round(al() * 400 - 200)];
  let q = p;
  for (let k = chaine.length - 1; k >= 0; k--) q = brut(chaine[k], q);   // AUCUN arrondi :
  const r = brut(composee, p);                                          // sinon on mesurerait
  pire = Math.max(pire, Math.hypot(q[0] - r[0], q[1] - r[1]));          // l instrument, pas l ecart
}
console.log('');
console.log('4 transformations appliquees une par une, contre UNE matrice composee :');
console.log('  pire ecart sur 2000 points, sans aucun arrondi : ' + pire.toExponential(2) + ' pixel');
console.log('  multiplications par point : ' + (4 * 9) + ' contre ' + 9 +
  ' , soit ' + ((4 * 9) / 9) + ' fois moins');

console.log('');
console.log(differents);
