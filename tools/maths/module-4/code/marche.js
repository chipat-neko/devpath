/* La question qui a fondé un moteur de recherche : si l'on clique au hasard, indéfiniment,
   sur quelles pages passe-t-on le plus de temps ? La réponse est une puissance de matrice. */

const PAGES = ['accueil', 'cours', 'catalogue', 'blog', 'contact', 'archive'];
const LIENS = {                                   // liens SORTANTS de chaque page
  accueil:   ['cours', 'catalogue', 'blog'],
  cours:     ['accueil', 'catalogue'],
  catalogue: ['cours'],
  blog:      ['accueil', 'contact'],
  contact:   ['accueil'],
  archive:   [],                                  // une page sans lien sortant : un « puits »
};
const n = PAGES.length;
const idx = new Map(PAGES.map((p, i) => [p, i]));

/* La matrice de TRANSITION : T[i][j] = probabilité d'aller en i quand on est en j.
   Chaque COLONNE somme à 1 — c'est ce qui en fait une matrice stochastique.
   Un puits n'a aucun lien : on considère qu'on repart alors vers n'importe quelle page. */
const T = Array.from({ length: n }, () => new Array(n).fill(0));
for (const p of PAGES) {
  const j = idx.get(p), sortants = LIENS[p];
  if (sortants.length === 0) { for (let i = 0; i < n; i++) T[i][j] = 1 / n; continue; }
  for (const q of sortants) T[idx.get(q)][j] = 1 / sortants.length;
}

console.log('sommes des colonnes (doivent toutes valoir 1) :');
console.log('  ' + PAGES.map(function (p, j) {
  let s = 0;
  for (let i = 0; i < n; i++) s += T[i][j];
  return p + '=' + s.toFixed(3);
}).join('  '));

/* L'AMORTISSEMENT, noté d et fixé à 0,85 : c'est la probabilité de SUIVRE un lien.
   Avec la probabilité restante, 1 - d = 0,15, on saute vers n'importe quelle page.
   ATTENTION à ce qu'on itère : ce n'est PAS T, c'est G(v) = (1-d)/n + d x T x v. */
const d = 0.85;
function pas(v) {
  const out = new Array(n).fill((1 - d) / n);
  for (let i = 0; i < n; i++) {
    let s = 0;
    for (let j = 0; j < n; j++) s += T[i][j] * v[j];
    out[i] += d * s;
  }
  return out;
}

let v = new Array(n).fill(1 / n);
console.log('');
console.log('pas    ' + PAGES.map((p) => p.slice(0, 9).padStart(10)).join('') + '     variation');
console.log('0      ' + v.map((x) => x.toFixed(4).padStart(10)).join(''));
let variation = 1;
for (let k = 1; k <= 40 && variation > 1e-9; k++) {
  const w = pas(v);
  variation = w.reduce((s, x, i) => s + Math.abs(x - v[i]), 0);
  v = w;
  if (k <= 5 || k % 10 === 0 || variation <= 1e-9) {
    console.log(String(k).padEnd(7) + v.map((x) => x.toFixed(4).padStart(10)).join('') +
      '   ' + variation.toExponential(1));
  }
}
console.log('');
console.log('somme du vecteur final : ' + v.reduce((a, b) => a + b, 0).toFixed(6));

/* Ce vecteur est-il vraiment un point FIXE ? Un pas de plus ne doit rien changer. */
const encore = pas(v);
const bouge = encore.reduce((s, x, i) => s + Math.abs(x - v[i]), 0);
console.log('un pas de plus deplace le vecteur de : ' + bouge.toExponential(2) +
  '   -> ' + (bouge < 1e-9 ? 'point fixe atteint' : 'PAS ENCORE STABLE'));

/* MAIS POINT FIXE DE QUOI ? Pas de T : de G. La distinction n est pas un detail,
   et elle se verifie en appliquant T au vecteur obtenu. */
function foisT(w) {
  const out = new Array(n).fill(0);
  for (let i = 0; i < n; i++) { let s = 0; for (let j = 0; j < n; j++) s += T[i][j] * w[j]; out[i] = s; }
  return out;
}
const Tv = foisT(v);
console.log('');
console.log('T applique au vecteur obtenu :');
console.log('  T x v : ' + Tv.map((x) => x.toFixed(4)).join('  '));
console.log('  v     : ' + v.map((x) => x.toFixed(4)).join('  '));
console.log('  rapports (T x v) / v : ' + Tv.map((x, i) => (x / v[i]).toFixed(3)).join('  '));
console.log('  -> ces rapports ne sont pas tous egaux : v n est PAS un vecteur propre de T.');
console.log('  il est le vecteur propre de G(v) = (1-d)/n + d x T x v, la matrice reellement iteree.');

/* Et le vecteur propre de T, celui qu on obtiendrait SANS amortissement ? Il existe,
   il est simplement different — et c est justement ce que l amortissement corrige. */
let w = new Array(n).fill(1 / n), varT = 1, pasT = 0;
while (varT > 1e-9 && pasT < 2000) { const z = foisT(w); varT = z.reduce((s, x, i) => s + Math.abs(x - w[i]), 0); w = z; pasT++; }
console.log('');
console.log('sans amortissement, en iterant T SEULE : ' + pasT + ' pas');
console.log('  ' + PAGES.map((p, i) => p + '=' + w[i].toFixed(4)).join('  '));
console.log('  ecart maximal avec le vecteur amorti : ' +
  Math.max.apply(null, w.map((x, i) => Math.abs(x - v[i]))).toFixed(4));
console.log('  « archive » y tombe a ' + w[idx0('archive')].toFixed(4) +
  ' : le groupe ferme accueil/cours/catalogue a absorbe la masse.');
function idx0(p) { return PAGES.indexOf(p); }

/* LA VÉRIFICATION QUI COMPTE : on ne croit pas la matrice, on MARCHE.
   Un million de clics au hasard, avec la même règle, et on compte les visites. */
function rng(g) { let x = g >>> 0; return function () { x ^= x << 13; x >>>= 0; x ^= x >> 17; x ^= x << 5; x >>>= 0; return x / 4294967296; }; }
const al = rng(31415926);
const PAS = 1000000;
const visites = new Array(n).fill(0);
let ici = 0;
for (let t = 0; t < PAS; t++) {
  visites[ici]++;
  if (al() > d) { ici = Math.floor(al() * n); continue; }   // saut au hasard
  const sortants = LIENS[PAGES[ici]];
  if (sortants.length === 0) { ici = Math.floor(al() * n); continue; }
  ici = idx.get(sortants[Math.floor(al() * sortants.length)]);
}

console.log('');
console.log('page          par la matrice   par ' + (PAS / 1e6) + ' million de clics   ecart');
let pireEcart = 0;
PAGES.forEach(function (p, i) {
  const simule = visites[i] / PAS;
  const e = Math.abs(simule - v[i]);
  if (e > pireEcart) pireEcart = e;
  console.log(p.padEnd(14) + v[i].toFixed(4).padStart(14) + simule.toFixed(4).padStart(23) +
    e.toFixed(4).padStart(10));
});
console.log('');
console.log('pire ecart entre le calcul et la simulation : ' + pireEcart.toFixed(4));

/* Le classement, qui est ce qu'on cherchait vraiment. */
const classement = PAGES.map((p, i) => [p, v[i]]).sort((a, b) => b[1] - a[1]);
console.log('');
console.log('classement : ' + classement.map((c, r) => (r + 1) + '. ' + c[0]).join('  '));
console.log('');
console.log('a comparer au simple comptage des liens ENTRANTS :');
const entrants = PAGES.map(function (p) {
  let c = 0;
  for (const q of PAGES) if (LIENS[q].indexOf(p) !== -1) c++;
  return [p, c];
}).sort((a, b) => b[1] - a[1]);
console.log('  ' + entrants.map((c) => c[0] + '=' + c[1]).join('  '));
/* Les deux classements sont-ils les mêmes ? On ne le suppose pas : on les compare. */
const rangPage = new Map(classement.map((c, r) => [c[0], r + 1]));
const desaccords = [];
for (let a = 0; a < PAGES.length; a++) for (let b = a + 1; b < PAGES.length; b++) {
  const p1 = PAGES[a], p2 = PAGES[b];
  const sensMarche = Math.sign(rangPage.get(p1) - rangPage.get(p2));
  const nbA = entrants.find((c) => c[0] === p1)[1], nbB = entrants.find((c) => c[0] === p2)[1];
  const sensLiens = Math.sign(nbB - nbA);
  if (sensLiens !== 0 && sensMarche !== sensLiens) desaccords.push([p1, p2]);
}
console.log('');
console.log('paires classees DANS L ORDRE INVERSE par les deux methodes : ' + desaccords.length +
  ' sur ' + (PAGES.length * (PAGES.length - 1) / 2));
desaccords.forEach(function (paire) {
  const a = paire[0], b = paire[1];
  console.log('  ' + a + ' (' + entrants.find((c) => c[0] === a)[1] + ' liens entrants, temps ' +
    v[idx.get(a)].toFixed(4) + ') contre ' + b + ' (' + entrants.find((c) => c[0] === b)[1] +
    ' liens entrants, temps ' + v[idx.get(b)].toFixed(4) + ')');
});
console.log('');
console.log('un lien depuis une page importante vaut plus qu un lien quelconque :');
console.log('c est toute la difference entre COMPTER des liens et RESOUDRE un systeme.');
