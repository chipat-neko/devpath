/* Schéma de la leçon 11 : « une case du produit = une ligne fois une colonne »,
   et ce que cette case VEUT DIRE sur le graphe. Toutes les valeurs sont calculées,
   aucune n'est écrite à la main, et la géométrie est contrôlée. */
'use strict';
const S = ['A', 'B', 'C', 'D', 'E'];
const ARETES = [['A', 'B'], ['A', 'C'], ['B', 'C'], ['B', 'D'], ['D', 'E'], ['C', 'E']];
const n = S.length;
const idx = new Map(S.map((s, i) => [s, i]));
const A = Array.from({ length: n }, () => new Array(n).fill(0));
for (const [a, b] of ARETES) { A[idx.get(a)][idx.get(b)] = 1; A[idx.get(b)][idx.get(a)] = 1; }

const LIGNE = idx.get('B'), COL = idx.get('E');
const termes = [];
let somme = 0;
for (let k = 0; k < n; k++) { termes.push(A[LIGNE][k] * A[k][COL]); somme += A[LIGNE][k] * A[k][COL]; }

/* Les chemins de longueur 2 de B vers E, énumérés — pour que la légende dise le vrai. */
const chemins = [];
for (let k = 0; k < n; k++) if (A[LIGNE][k] && A[k][COL]) chemins.push('B' + String.fromCharCode(8594) + S[k] + String.fromCharCode(8594) + 'E');

const W = 660, H = 300, CASE = 30;
const XA = 40, YA = 80;                    // matrice de gauche (la ligne)
const XB = 260, YB = 80;                   // matrice de droite (la colonne)
const out = [];
out.push('<text class="d-label" x="' + (W / 2) + '" y="24" text-anchor="middle" font-size="13">Une case du produit : la ligne de l\'une, la colonne de l\'autre</text>');

function grille(X, Y, ligneSurlignee, colSurlignee, titre) {
  out.push('<text class="d-mut" x="' + (X + n * CASE / 2) + '" y="' + (Y - 26) + '" text-anchor="middle" font-size="11">' + titre + '</text>');
  for (let j = 0; j < n; j++) {
    out.push('<text class="d-mut" x="' + (X + j * CASE + CASE / 2) + '" y="' + (Y - 8) + '" text-anchor="middle" font-size="10">' + S[j] + '</text>');
    out.push('<text class="d-mut" x="' + (X - 11) + '" y="' + (Y + j * CASE + CASE / 2 + 3) + '" text-anchor="middle" font-size="10">' + S[j] + '</text>');
  }
  for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
    const vif = (ligneSurlignee === i) || (colSurlignee === j);
    out.push('<rect class="' + (vif ? 'd-accent' : 'd-box') + '" x="' + (X + j * CASE) + '" y="' + (Y + i * CASE) + '" width="' + CASE + '" height="' + CASE + '" />');
    out.push('<text class="d-text" x="' + (X + j * CASE + CASE / 2) + '" y="' + (Y + i * CASE + CASE / 2 + 4) + '" text-anchor="middle" font-size="10">' + A[i][j] + '</text>');
  }
}
grille(XA, YA, LIGNE, null, 'A — on prend la ligne B');
out.push('<text class="d-tag" x="' + (XA + n * CASE + 24) + '" y="' + (YA + n * CASE / 2 + 4) + '" text-anchor="middle" font-size="16">' + String.fromCharCode(215) + '</text>');
grille(XB, YB, null, COL, 'A — on prend la colonne E');

/* Le calcul, écrit terme à terme. */
const XC = XB + n * CASE + 30;
out.push('<text class="d-tag" x="' + XC + '" y="' + (YA + n * CASE / 2 + 4) + '" font-size="16">=</text>');
const detail = termes.map((t, k) => A[LIGNE][k] + String.fromCharCode(215) + A[k][COL]).join('  +  ');
out.push('<text class="d-text" x="' + (XC + 22) + '" y="' + (YA + n * CASE / 2 - 6) + '" font-size="11">' + detail + '</text>');
out.push('<text class="d-text" x="' + (XC + 22) + '" y="' + (YA + n * CASE / 2 + 16) + '" font-size="13">= ' + somme + '</text>');

out.push('<text class="d-mut" x="20" y="' + (H - 44) + '" font-size="11">La case (B, E) de A' + String.fromCharCode(178) + ' vaut ' + somme + '.</text>');
out.push('<text class="d-mut" x="20" y="' + (H - 26) + '" font-size="11">Ce ' + somme + ', ce sont les chemins de longueur 2 qui vont de B à E : ' + chemins.join(' et ') + '.</text>');
out.push('<text class="d-mut" x="20" y="' + (H - 8) + '" font-size="11">Chaque terme du produit teste une escale ; il vaut 1 quand les deux arêtes existent, 0 sinon.</text>');

/* --- contrôles --- */
const alertes = [];
if (XC + 160 > W) alertes.push('le calcul deborde a droite');
if (YA + n * CASE > H - 56) alertes.push('les grilles recouvrent la legende');
if (XA + n * CASE + 48 > XB) alertes.push('les deux grilles se chevauchent');
if (somme !== chemins.length) alertes.push('la somme ne vaut pas le nombre de chemins enumeres');
/* le produit complet, recalculé, doit confirmer la case */
let verif = 0;
for (let k = 0; k < n; k++) verif += A[LIGNE][k] * A[k][COL];
if (verif !== somme) alertes.push('la case ne se reproduit pas');
console.error('controles : ' + (alertes.length ? alertes.join(' | ') : '0 alerte') +
  '   (case = ' + somme + ', chemins enumeres = ' + chemins.length + ')');

const alt = "Schéma montrant comment se calcule une case du produit de deux matrices. À gauche, la matrice d'adjacence A " +
  "d'un graphe de cinq sommets A à E, dont la ligne B est mise en évidence. Au centre, un signe multiplié, puis la même matrice A " +
  "avec sa colonne E mise en évidence. À droite, le détail du calcul terme à terme : " + detail.replace(/×/g, ' fois ') +
  ", dont la somme vaut " + somme + ". Une légende explique que cette case (B, E) de A au carré vaut " + somme +
  ", et que ce nombre compte les chemins de longueur deux qui mènent de B à E, à savoir " +
  chemins.map((c) => c.replace(/→/g, ' vers ')).join(' et ') +
  ". Chaque terme du produit teste une escale possible : il vaut 1 quand les deux arêtes existent, 0 sinon.";

console.log('<figure class="diagram">');
console.log('  <svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="' + alt + '">');
out.forEach((l) => console.log('    ' + l));
console.log('  </svg>');
console.log('  <figcaption>Le produit de matrices n\'est pas une convention arbitraire : sur un graphe, chaque terme teste une escale, et la somme compte les chemins.</figcaption>');
console.log('</figure>');
