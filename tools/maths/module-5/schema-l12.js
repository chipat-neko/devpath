/* Génère le schéma « les courbes se croisent » de la leçon 12, et VÉRIFIE sa
   géométrie plutôt que de faire confiance à des coordonnées écrites à la main.
   Les deux courbes tracées sont EXACTEMENT les deux fonctions de definition.js :
   A(n) = 3n² et B(n) = 1000·n·log₂n. Le point de croisement dessiné est calculé
   ici, pas placé à l'œil.
   Sortie : le <figure> à coller dans le corps. Les contrôles vont sur stderr. */
'use strict';

const A = (n) => 3 * n * n;
const B = (n) => 1000 * n * Math.log2(n);

/* Le croisement, cherché comme dans le programme de la leçon. */
let croisement = 2;
while (A(croisement) <= B(croisement)) croisement++;

const W = 660, H = 340;
const MG = 62, MD = 26, MH = 42, MB = 54;       // marges
const X0 = MG, X1 = W - MD, Y0 = MH, Y1 = H - MB;

/* Échelles logarithmiques sur les deux axes : sans elles, tout est écrasé. */
const NMIN = 10, NMAX = 100000;
const CMIN = 100, CMAX = 3e10;
const px = (n) => X0 + (Math.log10(n) - Math.log10(NMIN)) / (Math.log10(NMAX) - Math.log10(NMIN)) * (X1 - X0);
const py = (c) => Y1 - (Math.log10(c) - Math.log10(CMIN)) / (Math.log10(CMAX) - Math.log10(CMIN)) * (Y1 - Y0);

function courbe(f) {
  const pts = [];
  for (let k = 0; k <= 200; k++) {
    const n = Math.pow(10, Math.log10(NMIN) + (k / 200) * (Math.log10(NMAX) - Math.log10(NMIN)));
    const c = f(n);
    if (c < CMIN || c > CMAX) continue;
    pts.push(px(n).toFixed(1) + ',' + py(c).toFixed(1));
  }
  return pts;
}

const out = [];
out.push('<text class="d-label" x="' + (W / 2) + '" y="22" text-anchor="middle" font-size="13">Deux algorithmes, deux classes — et le rang où l’ordre s’inverse</text>');

/* Cadre et graduations. */
out.push('<line class="d-line" x1="' + X0 + '" y1="' + Y0 + '" x2="' + X0 + '" y2="' + Y1 + '" />');
out.push('<line class="d-line" x1="' + X0 + '" y1="' + Y1 + '" x2="' + X1 + '" y2="' + Y1 + '" />');
[10, 100, 1000, 10000, 100000].forEach((n) => {
  const x = px(n);
  out.push('<line class="d-line" x1="' + x.toFixed(1) + '" y1="' + Y1 + '" x2="' + x.toFixed(1) + '" y2="' + (Y1 + 5) + '" />');
  out.push('<text class="d-mut" x="' + x.toFixed(1) + '" y="' + (Y1 + 18) + '" text-anchor="middle" font-size="10">' +
    (n >= 1000 ? '10^' + Math.round(Math.log10(n)) : String(n)) + '</text>');
});
[1e2, 1e4, 1e6, 1e8, 1e10].forEach((c) => {
  const y = py(c);
  out.push('<line class="d-line" x1="' + (X0 - 5) + '" y1="' + y.toFixed(1) + '" x2="' + X0 + '" y2="' + y.toFixed(1) + '" />');
  out.push('<text class="d-mut" x="' + (X0 - 9) + '" y="' + (y + 3.5).toFixed(1) + '" text-anchor="end" font-size="10">10^' +
    Math.round(Math.log10(c)) + '</text>');
});
out.push('<text class="d-mut" x="' + ((X0 + X1) / 2) + '" y="' + (H - 22) + '" text-anchor="middle" font-size="11">taille de l’entrée, n (échelle logarithmique)</text>');
out.push('<text class="d-mut" x="14" y="' + ((Y0 + Y1) / 2) + '" text-anchor="middle" font-size="11" transform="rotate(-90 14 ' + ((Y0 + Y1) / 2) + ')">opérations</text>');

/* Les deux courbes. */
out.push('<polyline class="d-line" fill="none" points="' + courbe(A).join(' ') + '" />');
out.push('<polyline class="d-accent" fill="none" points="' + courbe(B).join(' ') + '" />');

/* Le croisement, calculé puis marqué. */
const cx = px(croisement), cy = py(A(croisement));
out.push('<circle class="d-accent" cx="' + cx.toFixed(1) + '" cy="' + cy.toFixed(1) + '" r="5" />');
out.push('<line class="d-line" x1="' + cx.toFixed(1) + '" y1="' + cy.toFixed(1) + '" x2="' + cx.toFixed(1) + '" y2="' + Y1 + '" stroke-dasharray="3 3" />');
out.push('<text class="d-text" x="' + (cx + 8).toFixed(1) + '" y="' + (cy - 8).toFixed(1) + '" font-size="11">n = ' + croisement + '</text>');

/* Les étiquettes des deux courbes, posées là où elles ne se recouvrent pas. */
const nA = 60000, nB = 300;
out.push('<text class="d-text" x="' + (px(nA) - 6).toFixed(1) + '" y="' + (py(A(nA)) - 8).toFixed(1) + '" text-anchor="end" font-size="11">A = 3n² (quadratique)</text>');
out.push('<text class="d-text" x="' + (px(nB) + 6).toFixed(1) + '" y="' + (py(B(nB)) - 8).toFixed(1) + '" font-size="11">B = 1000·n·log₂n (quasi-linéaire)</text>');
out.push('<text class="d-mut" x="' + (X0 + 6) + '" y="' + (Y0 + 12) + '" font-size="10">à gauche du trait, la « mauvaise » classe est la plus rapide</text>');

/* ------------------------------------------- contrôles, avant de publier --- */
const alertes = [];
function dedans(x, y) { return x >= 0 && x <= W && y >= 0 && y <= H; }
if (!dedans(cx, cy)) alertes.push('le point de croisement sort du cadre');
if (cx < X0 || cx > X1) alertes.push('le croisement sort de l’axe des abscisses');
/* le croisement dessiné doit être là où les deux courbes se touchent */
const ecart = Math.abs(py(A(croisement)) - py(B(croisement)));
if (ecart > 1.5) alertes.push('les deux courbes ne se touchent pas au point marqué (' + ecart.toFixed(2) + ' px)');
/* avant le croisement A doit être SOUS B, après au-dessus — sur le dessin comme dans les nombres */
if (!(A(1000) < B(1000))) alertes.push('à n = 1000, A devrait coûter moins que B');
if (!(A(100000) > B(100000))) alertes.push('à n = 100000, A devrait coûter plus que B');
if (!(py(A(1000)) > py(B(1000)))) alertes.push('à n = 1000, la courbe A devrait être PLUS BAS que B sur le dessin');
if (!(py(A(100000)) < py(B(100000)))) alertes.push('à n = 100000, la courbe A devrait être PLUS HAUT que B sur le dessin');
/* les deux courbes doivent rester dans la zone tracée */
[A, B].forEach((f, i) => {
  if (courbe(f).length < 50) alertes.push('la courbe ' + (i ? 'B' : 'A') + ' est presque vide (échelle mal choisie)');
});
console.error('controles geometriques : ' + (alertes.length ? alertes.join(' | ') : '0 alerte'));
console.error('croisement calcule : n = ' + croisement + '  A=' + A(croisement).toFixed(0) + '  B=' + B(croisement).toFixed(0));

const alt = 'Graphique à deux courbes, en échelles logarithmiques sur les deux axes. ' +
  'En abscisse la taille de l’entrée, de 10 à 100 000 ; en ordonnée le nombre d’opérations, de 10^2 à 10^10. ' +
  'La première courbe est A = 3n², quadratique ; la seconde est B = 1000·n·log₂n, quasi-linéaire. ' +
  'Jusqu’à n = ' + (croisement - 1) + ', la courbe A passe sous la courbe B : l’algorithme de la « mauvaise » classe coûte moins cher. ' +
  'Les deux se croisent à n = ' + croisement + ', point marqué d’un cercle et d’un trait pointillé vertical. ' +
  'Au-delà, A monte plus vite et s’éloigne définitivement de B.';

console.log('<figure class="diagram">');
console.log('  <svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="' + alt + '">');
out.forEach((l) => console.log('    ' + l));
console.log('  </svg>');
console.log('  <figcaption>La classe de complexité ne dit pas qui gagne&nbsp;: elle dit qui gagne <em>à la fin</em>. Le croisement, ici à n&nbsp;=&nbsp;' +
  croisement + ', est calculé par le programme de cette section, pas placé à l’œil.</figcaption>');
console.log('</figure>');
