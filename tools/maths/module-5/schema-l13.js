/* Génère le schéma « le même code, deux arbres » de la leçon 13, et VÉRIFIE sa
   géométrie. Les deux arbres dessinés sont construits ICI par le code
   d'insertion d'arbres.js — l'un en ordre croissant, l'autre en ordre choisi
   pour être équilibré. Aucune coordonnée n'est écrite à la main.
   Sortie : le <figure> à coller dans le corps. Les contrôles vont sur stderr. */
'use strict';

function noeud(v) { return { v: v, g: null, d: null }; }
function inserer(racine, v) {
  if (racine === null) return noeud(v);
  let c = racine;
  for (;;) {
    if (v < c.v) { if (c.g === null) { c.g = noeud(v); return racine; } c = c.g; }
    else { if (c.d === null) { c.d = noeud(v); return racine; } c = c.d; }
  }
}
function hauteur(n) { return n === null ? 0 : 1 + Math.max(hauteur(n.g), hauteur(n.d)); }
function chercher(racine, v) { let c = racine, k = 0; while (c) { k++; if (v === c.v) return k; c = v < c.v ? c.g : c.d; } return k; }

const VALEURS = [1, 2, 3, 4, 5, 6, 7];
const ORDRE_CROISSANT = VALEURS.slice();
const ORDRE_EQUILIBRE = [4, 2, 6, 1, 3, 5, 7];

function bati(ordre) { let r = null; ordre.forEach((v) => { r = inserer(r, v); }); return r; }
const gauche = bati(ORDRE_CROISSANT);
const droite = bati(ORDRE_EQUILIBRE);

const W = 660, H = 330;
const R = 15;
const PAS_Y = 29;

/* Place un arbre : la profondeur donne l'ordonnée, le rang en parcours infixe
   donne l'abscisse. C'est la seule disposition qui garantit qu'aucun nœud n'en
   recouvre un autre — et le contrôle ci-dessous le vérifie quand même. */
function placer(racine, x0, largeur, y0) {
  const pos = new Map();
  let rang = 0;
  (function infixe(n, prof) {
    if (!n) return;
    infixe(n.g, prof + 1);
    pos.set(n, { rang: rang++, prof: prof });
    infixe(n.d, prof + 1);
  })(racine, 0);
  const total = pos.size;
  pos.forEach((p, n) => {
    p.x = x0 + (largeur * (p.rang + 0.5)) / total;
    p.y = y0 + p.prof * PAS_Y;
  });
  return pos;
}

const posG = placer(gauche, 40, 240, 78);
const posD = placer(droite, 380, 240, 78);

const out = [];
out.push('<text class="d-label" x="' + (W / 2) + '" y="22" text-anchor="middle" font-size="13">Les mêmes sept valeurs, le même code d’insertion, deux arbres</text>');
out.push('<text class="d-mut" x="160" y="46" text-anchor="middle" font-size="11">insérées dans l’ordre 1, 2, 3, 4, 5, 6, 7</text>');
out.push('<text class="d-mut" x="500" y="46" text-anchor="middle" font-size="11">insérées dans l’ordre 4, 2, 6, 1, 3, 5, 7</text>');
out.push('<text class="d-mut" x="160" y="60" text-anchor="middle" font-size="11">hauteur ' + hauteur(gauche) + '</text>');
out.push('<text class="d-mut" x="500" y="60" text-anchor="middle" font-size="11">hauteur ' + hauteur(droite) + '</text>');

function dessiner(racine, pos) {
  (function liens(n) {
    if (!n) return;
    [n.g, n.d].forEach((f) => {
      if (!f) return;
      const a = pos.get(n), b = pos.get(f);
      out.push('<line class="d-line" x1="' + a.x.toFixed(1) + '" y1="' + a.y.toFixed(1) +
        '" x2="' + b.x.toFixed(1) + '" y2="' + b.y.toFixed(1) + '" />');
      liens(f);
    });
  })(racine);
  pos.forEach((p, n) => {
    out.push('<circle class="d-box" cx="' + p.x.toFixed(1) + '" cy="' + p.y.toFixed(1) + '" r="' + R + '" />');
    out.push('<text class="d-text" x="' + p.x.toFixed(1) + '" y="' + (p.y + 4).toFixed(1) + '" text-anchor="middle" font-size="12">' + n.v + '</text>');
  });
}
dessiner(gauche, posG);
dessiner(droite, posD);

/* Le coût moyen d'une recherche, calculé et non estimé. */
const moyG = VALEURS.reduce((s, v) => s + chercher(gauche, v), 0) / VALEURS.length;
const moyD = VALEURS.reduce((s, v) => s + chercher(droite, v), 0) / VALEURS.length;
out.push('<text class="d-mut" x="20" y="' + (H - 34) + '" font-size="11">Coût moyen d’une recherche : ' +
  moyG.toFixed(2) + ' comparaisons à gauche, ' + moyD.toFixed(2) + ' à droite — sur sept valeurs seulement.</text>');
out.push('<text class="d-mut" x="20" y="' + (H - 16) + '" font-size="11">À mille valeurs, l’écart mesuré par le programme de cette section passe à 500,50 contre 8,99.</text>');

/* ------------------------------------------- contrôles, avant de publier --- */
const alertes = [];
const tous = [];
posG.forEach((p, n) => tous.push({ p: p, v: n.v, cote: 'gauche' }));
posD.forEach((p, n) => tous.push({ p: p, v: n.v, cote: 'droite' }));
tous.forEach((a) => {
  if (a.p.x - R < 0 || a.p.x + R > W || a.p.y - R < 0 || a.p.y + R > H - 46) {
    alertes.push('noeud ' + a.v + ' (' + a.cote + ') hors cadre');
  }
});
for (let i = 0; i < tous.length; i++) {
  for (let j = i + 1; j < tous.length; j++) {
    const d = Math.hypot(tous[i].p.x - tous[j].p.x, tous[i].p.y - tous[j].p.y);
    if (d < 2 * R + 2) alertes.push('noeuds ' + tous[i].v + '/' + tous[j].v + ' se touchent (' + d.toFixed(1) + ' px)');
  }
}
if (hauteur(gauche) !== VALEURS.length) alertes.push('l arbre croissant devrait avoir la hauteur n');
if (hauteur(droite) !== 3) alertes.push('l arbre equilibre devrait avoir la hauteur 3');
if (!(moyG > moyD)) alertes.push('le degenere devrait couter plus cher que l equilibre');
/* les deux arbres doivent contenir exactement les mêmes valeurs */
const contenu = (r) => { const t = []; (function p(n) { if (!n) return; p(n.g); t.push(n.v); p(n.d); })(r); return t.join(','); };
if (contenu(gauche) !== contenu(droite)) alertes.push('les deux arbres ne contiennent pas les memes valeurs');
if (contenu(gauche) !== VALEURS.join(',')) alertes.push('le parcours infixe ne rend pas les valeurs triees');
console.error('controles geometriques : ' + (alertes.length ? alertes.join(' | ') : '0 alerte'));
console.error('hauteurs : ' + hauteur(gauche) + ' contre ' + hauteur(droite) +
  ' | couts moyens : ' + moyG.toFixed(2) + ' contre ' + moyD.toFixed(2));

const alt = 'Schéma comparant deux arbres binaires de recherche contenant les mêmes sept valeurs, de 1 à 7. ' +
  'À gauche, les valeurs ont été insérées dans l’ordre croissant : chaque nœud n’a qu’un enfant, à droite, ' +
  'et l’arbre forme une chaîne de ' + hauteur(gauche) + ' niveaux, indiscernable d’une liste. ' +
  'À droite, les mêmes valeurs insérées dans l’ordre 4, 2, 6, 1, 3, 5, 7 forment un arbre équilibré de ' +
  hauteur(droite) + ' niveaux, avec 4 à la racine, 2 et 6 au deuxième niveau, 1, 3, 5 et 7 en feuilles. ' +
  'Le coût moyen d’une recherche vaut ' + moyG.toFixed(2) + ' comparaisons à gauche contre ' + moyD.toFixed(2) + ' à droite. ' +
  'Le code d’insertion est le même dans les deux cas : seul l’ordre d’arrivée des valeurs change.';

console.log('<figure class="diagram">');
console.log('  <svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="' + alt + '">');
out.forEach((l) => console.log('    ' + l));
console.log('  </svg>');
console.log('  <figcaption>Un arbre ne coûte pas log&nbsp;<em>n</em> par nature&nbsp;: il coûte <strong>sa hauteur</strong>. Et sa hauteur ne dépend pas du code d’insertion, mais de l’ordre dans lequel les valeurs sont arrivées.</figcaption>');
console.log('</figure>');
