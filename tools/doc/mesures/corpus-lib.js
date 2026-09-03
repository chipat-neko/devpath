/* Lecture du corpus : les titres <h2> des leçons, tels que le NAVIGATEUR les
   verrait dans textContent. Un seul décodeur, partagé par toutes les mesures de
   la leçon — deux décodeurs différents rendraient deux chiffres différents.

   DEUX RÈGLES D'EXCLUSION, toutes deux nées d'une relecture adversariale :

   1. LE COURS « doc » EST EXCLU DU CORPUS. La leçon qui publie ces chiffres est
      elle-même une leçon du site : incluse, elle se compterait elle-même, et
      chaque leçon ajoutée au cours périmerait les chiffres déjà publiés. Une
      mesure qui bouge quand on la publie n'est pas une mesure.

   2. UN FICHIER SANS <article class="prose"> N'EST PAS UNE LEÇON. Le dossier
      pages/ contient des pages de REDIRECTION portant un nom de leçon (cours
      fusionnés). Les compter donnait « 1 625 leçons » là où le site en annonce
      1 537 — l'écart exact du nombre de redirections.                        */
'use strict';
const fs = require('fs'), path = require('path');
const RACINE = path.join(__dirname, '..', '..', '..');
const COURS_EXCLU = 'doc';

/* Les entités que les leçons emploient réellement. &nbsp; devient une VRAIE
   espace insécable (U+00A0), pas une espace ordinaire : c'est ce que le
   navigateur met dans textContent, et le chiffre publié doit valoir pour lui. */
const ENTITES = {
  '&nbsp;': ' ', '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"',
  '&#39;': "'", '&apos;': "'", '&hellip;': '…', '&mdash;': '—',
  '&ndash;': '–', '&laquo;': '«', '&raquo;': '»', '&times;': '×',
  '&rarr;': '→', '&larr;': '←', '&deg;': '°', '&eacute;': 'é',
};
function texteDe(html) {
  let t = html.replace(/<[^>]*>/g, '');
  t = t.replace(/&[a-z#0-9]+;/gi, (e) => (ENTITES.hasOwnProperty(e) ? ENTITES[e] : e));
  return t.replace(/[ \t\r\n]+/g, ' ').trim();
}

/* Tous les fichiers nommés lecon-NN.html, cours « doc » exclu. */
function fichiersCandidats(dir, acc) {
  acc = acc || [];
  const base = dir || path.join(RACINE, 'pages');
  for (const e of fs.readdirSync(base, { withFileTypes: true }).sort((a, b) => (a.name < b.name ? -1 : 1))) {
    if (e.isDirectory() && e.name === COURS_EXCLU) continue;
    const p = path.join(base, e.name);
    if (e.isDirectory()) fichiersCandidats(p, acc);
    else if (/^lecon-\d+\.html$/.test(e.name)) acc.push(p);
  }
  return acc;
}

/* Les VRAIES leçons : celles qui portent un article de contenu. */
function fichiersLecons() {
  return fichiersCandidats().filter(function (f) {
    return /<article class="prose"/.test(fs.readFileSync(f, 'utf8'));
  });
}
function redirections() {
  return fichiersCandidats().length - fichiersLecons().length;
}

/* Tous les h2 de l'article .prose, dans l'ordre de lecture. */
function titres() {
  const out = [];
  for (const f of fichiersLecons()) {
    const html = fs.readFileSync(f, 'utf8');
    const art = html.match(/<article class="prose"[\s\S]*?<\/article>/);
    if (!art) continue;
    for (const h of art[0].matchAll(/<h2([^>]*)>([\s\S]*?)<\/h2>/g)) {
      out.push({
        fichier: path.relative(RACINE, f).replace(/\\/g, '/'),
        avecId: /\bid=/.test(h[1]),
        texte: texteDe(h[2]),
      });
    }
  }
  return out;
}

/* La VRAIE fonction du site, extraite de js/lecon.js — jamais recopiée. */
function slugifyDuSite() {
  const src = fs.readFileSync(path.join(RACINE, 'js', 'lecon.js'), 'utf8');
  const m = src.match(/function slugify\(s\) \{[\s\S]*?\n  \}/);
  if (!m) throw new Error('slugify() introuvable dans js/lecon.js');
  return { source: m[0], fn: new Function('"use strict";' + m[0] + '; return slugify;')() };
}

const AVEC_LIGATURE = /[œŒæÆßﬁﬂ]/;

/* LE relevé, calculé une fois et servi à tout le monde : gen.js l'injecte dans
   la prose, verif-doc.js le recompare à ce qui est publié. */
function releve() {
  const { source, fn: slugify } = slugifyDuSite();
  const tous = titres();
  const r = {
    lignesFonction: source.split('\n').length,
    lecons: fichiersLecons().length,
    redirections: redirections(),
    titres: tous.length,
    avecId: 0, horsAscii: 0, ligature: 0,
    vides: [], collisions: [], distincts: 0,
  };
  const vus = new Set();
  const parPage = new Map();
  for (const t of tous) {
    if (t.avecId) { r.avecId++; continue; }
    if (/[^\x00-\x7f]/.test(t.texte)) r.horsAscii++;
    if (AVEC_LIGATURE.test(t.texte)) r.ligature++;
    const s = slugify(t.texte);
    vus.add(s);
    if (s === '') r.vides.push(t);
    if (!parPage.has(t.fichier)) parPage.set(t.fichier, new Map());
    const dansLaPage = parPage.get(t.fichier);
    if (s !== '' && dansLaPage.has(s)) r.collisions.push([t.fichier, dansLaPage.get(s), t.texte, s]);
    else dansLaPage.set(s, t.texte);
  }
  r.circonflexe = tous.filter(function (t) { return /[\^`]/.test(t.texte); }).length;
  r.distincts = vus.size;
  r.sansId = tous.length - r.avecId;
  return r;
}

module.exports = {
  RACINE, COURS_EXCLU, texteDe, fichiersCandidats, fichiersLecons, redirections,
  titres, slugifyDuSite, releve, AVEC_LIGATURE,
};
