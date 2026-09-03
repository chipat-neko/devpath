/* Génère le schéma « un graphe, deux écritures » de la leçon 10, et VÉRIFIE sa géométrie
   au lieu de faire confiance à des coordonnées écrites à la main. */
'use strict';
const S = ['A', 'B', 'C', 'D', 'E'];
const P = { A: [90, 90], B: [200, 60], C: [150, 190], D: [265, 165], E: [210, 275] };
const E = [['A', 'B'], ['A', 'C'], ['B', 'C'], ['B', 'D'], ['D', 'E'], ['C', 'E']];

const W = 660, H = 360;
const R = 17;                                   // rayon d'un sommet
const X0 = 400, Y0 = 96, CASE = 34;             // coin haut-gauche de la matrice

const M = S.map(() => S.map(() => 0));
E.forEach(([a, b]) => { M[S.indexOf(a)][S.indexOf(b)] = 1; M[S.indexOf(b)][S.indexOf(a)] = 1; });

const out = [];
out.push('<text class="d-label" x="' + (W / 2) + '" y="24" text-anchor="middle" font-size="13">Le même graphe, deux écritures</text>');
out.push('<text class="d-mut" x="150" y="48" text-anchor="middle" font-size="11">le dessin</text>');
out.push('<text class="d-mut" x="' + (X0 + 2.5 * CASE) + '" y="48" text-anchor="middle" font-size="11">la matrice d\'adjacence</text>');

/* Les arêtes d'abord, pour qu'elles passent SOUS les sommets. */
E.forEach(([a, b]) => {
  out.push('<line class="d-line" x1="' + P[a][0] + '" y1="' + P[a][1] + '" x2="' + P[b][0] + '" y2="' + P[b][1] + '" />');
});
S.forEach((s) => {
  out.push('<circle class="d-box" cx="' + P[s][0] + '" cy="' + P[s][1] + '" r="' + R + '" />');
  out.push('<text class="d-text" x="' + P[s][0] + '" y="' + (P[s][1] + 4) + '" text-anchor="middle" font-size="12">' + s + '</text>');
});

/* La matrice : en-têtes puis cases. */
S.forEach((s, j) => {
  out.push('<text class="d-mut" x="' + (X0 + j * CASE + CASE / 2) + '" y="' + (Y0 - 8) + '" text-anchor="middle" font-size="11">' + s + '</text>');
  out.push('<text class="d-mut" x="' + (X0 - 12) + '" y="' + (Y0 + j * CASE + CASE / 2 + 4) + '" text-anchor="middle" font-size="11">' + s + '</text>');
});
for (let i = 0; i < S.length; i++) for (let j = 0; j < S.length; j++) {
  const cls = M[i][j] ? 'd-accent' : 'd-box';
  out.push('<rect class="' + cls + '" x="' + (X0 + j * CASE) + '" y="' + (Y0 + i * CASE) + '" width="' + CASE + '" height="' + CASE + '" />');
  out.push('<text class="d-text" x="' + (X0 + j * CASE + CASE / 2) + '" y="' + (Y0 + i * CASE + CASE / 2 + 4) + '" text-anchor="middle" font-size="11">' + M[i][j] + '</text>');
}

const degres = S.map((s) => M[S.indexOf(s)].reduce((a, b) => a + b, 0));
out.push('<text class="d-mut" x="20" y="' + (H - 46) + '" font-size="11">La ligne d\'un sommet donne ses voisins ; sa somme donne son degré : ' +
  S.map((s, i) => s + '=' + degres[i]).join(', ') + '.</text>');
out.push('<text class="d-mut" x="20" y="' + (H - 28) + '" font-size="11">La matrice est symétrique parce que le graphe n\'est pas orienté : ' +
  (2 * E.length) + ' cases à 1 pour ' + E.length + ' arêtes.</text>');
out.push('<text class="d-mut" x="20" y="' + (H - 10) + '" font-size="11">Elle occupe 25 cases quand la liste d\'adjacence en occupe ' + (2 * E.length) + '.</text>');

/* --- contrôles géométriques, parce qu'un schéma faux est pire qu'aucun schéma --- */
const alertes = [];
S.forEach((s) => {
  const [x, y] = P[s];
  if (x - R < 0 || x + R > W || y - R < 0 || y + R > H) alertes.push('sommet ' + s + ' hors cadre');
});
for (let i = 0; i < S.length; i++) for (let j = i + 1; j < S.length; j++) {
  const d = Math.hypot(P[S[i]][0] - P[S[j]][0], P[S[i]][1] - P[S[j]][1]);
  if (d < 2 * R + 6) alertes.push('sommets ' + S[i] + ' et ' + S[j] + ' se touchent (' + d.toFixed(1) + ' px)');
}
if (X0 + S.length * CASE > W - 8) alertes.push('la matrice deborde a droite');
if (Y0 + S.length * CASE > H - 60) alertes.push('la matrice recouvre les legendes');
/* aucune arête ne doit passer sur un sommet qui n'est pas l'une de ses deux extrémités */
E.forEach(([a, b]) => {
  S.forEach((s) => {
    if (s === a || s === b) return;
    const [x1, y1] = P[a], [x2, y2] = P[b], [px, py] = P[s];
    const dx = x2 - x1, dy = y2 - y1;
    const t = Math.max(0, Math.min(1, ((px - x1) * dx + (py - y1) * dy) / (dx * dx + dy * dy)));
    const d = Math.hypot(x1 + t * dx - px, y1 + t * dy - py);
    if (d < R + 4) alertes.push('arete ' + a + b + ' passe sur le sommet ' + s + ' (' + d.toFixed(1) + ' px)');
  });
});
console.error('controles geometriques : ' + (alertes.length ? alertes.join(' | ') : '0 alerte'));

const nbArcs = M.flat().reduce((a, b) => a + b, 0);
console.error('cases a 1 : ' + nbArcs + ' , 2 x aretes : ' + (2 * E.length) +
  ' -> ' + (nbArcs === 2 * E.length ? 'coherent' : 'INCOHERENT'));

const alt = "Schéma comparant deux écritures d'un même graphe de cinq sommets nommés A à E. " +
  "À gauche, le dessin : " + E.map(([a, b]) => a + ' relié à ' + b).join(', ') + ". " +
  "À droite, la matrice d'adjacence de cinq lignes et cinq colonnes, où chaque case vaut 1 quand les deux sommets sont reliés et 0 sinon. " +
  "Les " + (2 * E.length) + " cases à 1 sont mises en évidence. La matrice est symétrique par rapport à sa diagonale, " +
  "et la somme de chaque ligne donne le degré du sommet : " + S.map((s, i) => s + ' a ' + degres[i] + ' voisins').join(', ') + ". " +
  "Une légende rappelle que la matrice occupe 25 cases là où la liste d'adjacence en occupe " + (2 * E.length) + ".";

console.log('<figure class="diagram">');
console.log('  <svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="' + alt + '">');
out.forEach((l) => console.log('    ' + l));
console.log('  </svg>');
console.log('  <figcaption>Un graphe et sa matrice d\'adjacence : la même information, deux formes. Le dessin se lit, la matrice se calcule.</figcaption>');
console.log('</figure>');
