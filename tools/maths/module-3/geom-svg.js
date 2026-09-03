/* Contrôle géométrique des schémas, SANS navigateur.
   Motif : au module 1, un pointillé barrait un titre et personne ne l'avait vu.
   Ici on calcule : (1) toute étiquette <text> tient-elle dans le viewBox ?
   (2) un segment de <path> traverse-t-il la boîte d'une étiquette ?
   (3) chaque coordonnée d'arc « A r r . . . x y » est-elle bien à la distance r du centre ?

   La largeur d'un texte est ESTIMÉE (0,52 × taille de police par caractère, mesure
   courante pour une sans-serif) : ce contrôle signale donc des SUSPICIONS, pas des
   verdicts. Il sert à orienter le regard, pas à le remplacer. */
'use strict';
const fs = require('fs');

const PAGES = process.argv.slice(2);
if (!PAGES.length) { console.log('usage : node geom-svg.js <page.html> …'); process.exit(1); }

function texts(svg) {
  const out = [];
  const re = /<text\b([^>]*)>([\s\S]*?)<\/text>/g;
  let m;
  while ((m = re.exec(svg))) {
    const at = m[1];
    const get = (n) => { const r = new RegExp(n + '="([^"]*)"').exec(at); return r ? r[1] : null; };
    const brut = m[2].replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').replace(/&[a-z]+;/g, 'x').trim();
    const taille = Number(get('font-size') || 12);
    const largeur = brut.length * taille * 0.52;
    const x = Number(get('x') || 0), y = Number(get('y') || 0);
    const ancre = get('text-anchor') || 'start';
    const x0 = ancre === 'middle' ? x - largeur / 2 : ancre === 'end' ? x - largeur : x;
    out.push({ texte: brut, x0: x0, x1: x0 + largeur, y0: y - taille * 0.78, y1: y + taille * 0.24 });
  }
  return out;
}

/* Les segments DROITS des <path> (M/L/l/H/V absolus ou relatifs simples). */
function segments(svg) {
  const out = [];
  const re = /<path\b[^>]*\bd="([^"]*)"[^>]*>/g;
  let m;
  while ((m = re.exec(svg))) {
    const d = m[1];
    if (/[Zz]\s*$/.test(d.trim()) && d.split(/[Ll]/).length <= 4) continue; /* petit triangle = pointe de flèche */
    const toks = d.match(/[A-Za-z]|-?\d*\.?\d+/g) || [];
    let i = 0, cx = 0, cy = 0, cmd = '';
    while (i < toks.length) {
      if (/[A-Za-z]/.test(toks[i])) { cmd = toks[i]; i++; continue; }
      const n = () => Number(toks[i++]);
      if (cmd === 'M') { cx = n(); cy = n(); cmd = 'L'; }
      else if (cmd === 'm') { cx += n(); cy += n(); cmd = 'l'; }
      else if (cmd === 'L') { const x = n(), y = n(); out.push([cx, cy, x, y]); cx = x; cy = y; }
      else if (cmd === 'l') { const x = cx + n(), y = cy + n(); out.push([cx, cy, x, y]); cx = x; cy = y; }
      else if (cmd === 'A') { i += 5; const x = n(), y = n(); cx = x; cy = y; }   /* arc : ignoré ici */
      else if (cmd === 'Z' || cmd === 'z') { /* rien */ }
      else { i++; }
    }
  }
  return out;
}

/* Un segment coupe-t-il un rectangle ? Découpage de Liang-Barsky. */
function coupe(s, r) {
  let [x0, y0, x1, y1] = s;
  const dx = x1 - x0, dy = y1 - y0;
  let t0 = 0, t1 = 1;
  const p = [-dx, dx, -dy, dy];
  const q = [x0 - r.x0, r.x1 - x0, y0 - r.y0, r.y1 - y0];
  for (let k = 0; k < 4; k++) {
    if (p[k] === 0) { if (q[k] < 0) return false; continue; }
    const t = q[k] / p[k];
    if (p[k] < 0) { if (t > t1) return false; if (t > t0) t0 = t; }
    else { if (t < t0) return false; if (t < t1) t1 = t; }
  }
  return t0 < t1;
}

/* Les arcs : la coordonnée d'arrivée doit être à la distance r du centre du cercle
   dont le point de départ est aussi à distance r. On vérifie l'égalité des deux rayons. */
function arcs(svg) {
  const out = [];
  const re = /d="M\s*(-?[\d.]+)[\s,]+(-?[\d.]+)\s+A\s*([\d.]+)[\s,]+([\d.]+)[\s,]+[\d.]+[\s,]+([01])[\s,]+([01])[\s,]+(-?[\d.]+)[\s,]+(-?[\d.]+)/g;
  let m;
  while ((m = re.exec(svg))) {
    const [x0, y0, rx, ry, , , x1, y1] = m.slice(1).map(Number);
    const corde = Math.hypot(x1 - x0, y1 - y0);
    out.push({ x0: x0, y0: y0, x1: x1, y1: y1, r: rx, corde: corde, possible: corde <= 2 * rx + 1e-6 });
  }
  return out;
}

let alertes = 0;
for (const page of PAGES) {
  const html = fs.readFileSync(page, 'utf8');
  const re = /<svg\b[^>]*viewBox="([^"]*)"[^>]*>([\s\S]*?)<\/svg>/g;
  let m, n = 0;
  while ((m = re.exec(html))) {
    const [vx, vy, vw, vh] = m[1].trim().split(/\s+/).map(Number);
    const svg = m[2];
    if (svg.indexOf('class="d-') === -1) continue;   /* icônes de callout : ignorées */
    n++;
    const T = texts(svg), S = segments(svg), A = arcs(svg);
    console.log(page + '  schéma n° ' + n + '  (viewBox ' + vw + '×' + vh + ')  ' +
      T.length + ' étiquettes, ' + S.length + ' segments, ' + A.length + ' arc(s)');

    for (const t of T) {
      if (t.x0 < vx - 1 || t.x1 > vx + vw + 1 || t.y0 < vy - 1 || t.y1 > vy + vh + 1) {
        alertes++;
        console.log('  ⚠ HORS CADRE  « ' + t.texte.slice(0, 48) + ' »  x ' +
          t.x0.toFixed(0) + '→' + t.x1.toFixed(0) + ', y ' + t.y0.toFixed(0) + '→' + t.y1.toFixed(0));
      }
    }
    for (const t of T) {
      for (const s of S) {
        if (coupe(s, t)) {
          alertes++;
          console.log('  ⚠ TRAIT SUR TEXTE  segment (' + s.map((v) => v.toFixed(0)).join(',') +
            ') traverse « ' + t.texte.slice(0, 40) + ' »');
        }
      }
    }
    for (const a of A) {
      if (!a.possible) {
        alertes++;
        console.log('  ⚠ ARC IMPOSSIBLE  corde ' + a.corde.toFixed(1) + ' > 2r = ' + (2 * a.r).toFixed(1));
      } else {
        console.log('  · arc de (' + a.x0 + ',' + a.y0 + ') à (' + a.x1 + ',' + a.y1 +
          ') r=' + a.r + ' — corde ' + a.corde.toFixed(1) + ', rayon exigé ≥ ' + (a.corde / 2).toFixed(1));
      }
    }
  }
}
console.log('');
console.log(alertes + ' alerte(s) géométrique(s).');
process.exit(alertes ? 1 : 0);
