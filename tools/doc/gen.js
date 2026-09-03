/* Générateur des leçons du cours « doc » (Lire la documentation).
   POURQUOI un générateur : les blocs de code publiés sont LITTÉRALEMENT les
   fichiers de tools/doc/code/, et les blocs de sortie sont LITTÉRALEMENT ce que
   leur exécution produit. Aucune sortie n'est écrite à la main.
   EN PLUS : le marqueur @@SLUGIFY@@ relit la fonction slugify() dans js/lecon.js
   à CHAQUE assemblage. Le code lu par l'apprenant est donc le code du site, pas
   une copie qui pourrait dériver. */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const RACINE = path.join(__dirname, '..', '..');
const CODE = path.join(__dirname, 'code');

/* ---- la fonction du site, relue à chaque assemblage ---------------------- */
function sourceSlugify() {
  const src = fs.readFileSync(path.join(RACINE, 'js', 'lecon.js'), 'utf8');
  const m = src.match(/function slugify\(s\) \{[\s\S]*?\n  \}/);
  if (!m) { console.error('ARRÊT : slugify() introuvable dans js/lecon.js.'); process.exit(1); }
  /* le fichier l'indente de 2 espaces (elle vit dans une IIFE) : on désindente. */
  return m[0].split('\n').map((l, i) => (i === 0 ? l : l.replace(/^ {2}/, ''))).join('\n');
}
const SLUGIFY = sourceSlugify();

/* Le formateur EXACT du Web Worker de js/runner.js — c'est ce que l'apprenant voit. */
function fmt(v) {
  if (typeof v === 'string') return v;
  if (v === undefined) return 'undefined';
  if (v === null) return 'null';
  if (typeof v === 'function') return v.toString();
  try { return JSON.stringify(v); } catch (e) { return String(v); }
}

const PLAFOND_MS = 5000;
const PLAFOND_NAVIGATEUR_MS = 3000;   // js/runner.js interrompt un bloc après 3 s
const MARGE_MS = 1500;
const DUREES = {};

function executer(src, nom) {
  const out = [];
  const push = function () { out.push(Array.prototype.slice.call(arguments).map(fmt).join(' ')); };
  const bac = { console: { log: push, warn: push, error: push, info: push, debug: push } };
  bac.globalThis = bac;
  const t0 = Date.now();
  let incident = null;
  try { vm.runInNewContext(src, vm.createContext(bac), { timeout: PLAFOND_MS }); }
  catch (e) { incident = e.name + ': ' + e.message; out.push('!! ' + incident); }
  const ms = Date.now() - t0;
  DUREES[nom || '?'] = ms;
  if (incident) {
    console.error('ARRÊT : ' + nom + ' a levé « ' + incident + ' ». Rien n a été écrit.');
    process.exit(1);
  }
  if (ms > PLAFOND_NAVIGATEUR_MS - MARGE_MS) {
    console.error('ARRÊT : ' + nom + ' a mis ' + ms + ' ms, trop près du plafond de ' +
      PLAFOND_NAVIGATEUR_MS + ' ms de js/runner.js.');
    process.exit(1);
  }
  return out.join('\n');
}

/* La règle qui a détruit des pages de ce site : tout « < » d'un bloc de code
   s'écrit &lt;. On échappe aussi & et > par symétrie. */
function ech(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
function blocCode(nom, src, langue) {
  return '<figure class="code-block" data-file="' + nom + '"><pre><code class="language-' +
    (langue || 'javascript') + '">' + ech(src.replace(/\n+$/, '')) + '</code></pre></figure>';
}
function blocSortie(nom, sortie) {
  return '<figure class="code-block" data-file="' + nom + '"><pre><code class="language-plaintext">' +
    ech(sortie) + '</code></pre></figure>';
}

const MESURES = {};
function lireCode(fichier) {
  const brut = fs.readFileSync(path.join(CODE, fichier), 'utf8');
  if (brut.indexOf('/*@@SLUGIFY@@*/') === -1) return brut;
  return brut.replace('/*@@SLUGIFY@@*/', SLUGIFY);
}
/* @@MESURE:cle@@ — un CHIFFRE DE CORPUS, calculé à l'assemblage et jamais écrit
   dans la prose. Né d'une relecture adversariale : les chiffres avaient été
   codés en dur, et la publication de la leçon les avait périmés le jour même,
   puisqu'elle s'ajoutait au corpus qu'elle décrivait. Désormais le corpus exclut
   le cours « doc », et la prose ne contient plus un seul de ces nombres. */
const RELEVE = require('./mesures/corpus-lib.js').releve();
const MENTIONS = (function () {
  const fsx = require('fs');
  const lib = require('./mesures/corpus-lib.js');
  const MOTIFS = [/documentation officielle/gi, /\bdoc officielle/gi, /\bMDN\b/g,
    /la sp[ée]cification/gi, /\bRFC\s?\d{3,5}\b/g];
  const pages = new Set(), cours = new Set();
  for (const f of lib.fichiersLecons()) {
    const html = fsx.readFileSync(f, 'utf8');
    const art = html.match(/<article class="prose"[\s\S]*?<\/article>/);
    if (!art) continue;
    if (MOTIFS.some((re) => re.test(art[0]))) {
      const rel = path.relative(lib.RACINE, f).replace(/\\/g, '/');
      pages.add(rel); cours.add(rel.split('/')[1]);
    }
    MOTIFS.forEach((re) => { re.lastIndex = 0; });
  }
  return { lecons: pages.size, cours: cours.size };
})();

function milliers(n) {
  return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '&nbsp;');
}
const MESURES_CORPUS = {
  lecons: milliers(RELEVE.lecons),
  redirections: milliers(RELEVE.redirections),
  titres: milliers(RELEVE.titres),
  avecId: milliers(RELEVE.avecId),
  horsAscii: milliers(RELEVE.horsAscii),
  pctHorsAscii: String(Math.round((RELEVE.horsAscii / RELEVE.sansId) * 100)),
  ligature: milliers(RELEVE.ligature),
  distincts: milliers(RELEVE.distincts),
  vides: milliers(RELEVE.vides.length),
  collisions: milliers(RELEVE.collisions.length),
  lignesFonction: milliers(RELEVE.lignesFonction),
  circonflexe: milliers(RELEVE.circonflexe),
  mentionsLecons: milliers(MENTIONS.lecons),
  mentionsCours: milliers(MENTIONS.cours),
};
function remplirMesures(corps) {
  return corps.replace(/@@MESURE:([a-zA-Z]+)@@/g, function (_, cle) {
    if (!MESURES_CORPUS.hasOwnProperty(cle)) {
      console.error('ARRÊT : mesure inconnue « ' + cle +' ».');
      process.exit(1);
    }
    return MESURES_CORPUS[cle];
  });
}

/* @@TEXTE:x.txt@@ — un document lu tel quel dans tools/doc/reference/. C'est ainsi
   que la page de référence en anglais est publiée : elle vit dans un fichier, elle
   est vérifiée dans ce fichier, et la page ne peut pas en dériver. */
function remplirTextes(corps) {
  return corps.replace(/@@TEXTE:([a-z0-9-]+\.txt)@@/g, function (_, fichier) {
    const t = fs.readFileSync(path.join(__dirname, 'reference', fichier), 'utf8');
    return blocSortie(fichier, t.replace(/\n+$/, ''));
  });
}

function remplirMarqueurs(corps) {
  return remplirTextes(remplirMesures(corps)).replace(/@@(CODE|SORTIE):([a-z0-9-]+\.js)@@/g, function (_, quoi, fichier) {
    const src = lireCode(fichier);
    if (quoi === 'CODE') return blocCode(fichier, src);
    const sortie = executer(src, fichier);
    MESURES[fichier] = sortie.split('\n').length;
    return blocSortie(fichier.replace(/\.js$/, '.txt'), sortie);
  });
}

/* ------------------------------------------------------------------ gabarit */
function page(m, corps) {
  const nav = m.num;
  const S = '<' + '/script>';
  return '<!DOCTYPE html>\n' +
'<html lang="fr" data-theme="light">\n' +
'  <head>\n' +
'    <meta charset="utf-8" />\n' +
'    <meta name="viewport" content="width=device-width, initial-scale=1" />\n' +
'    <title>' + m.titreTexte + ' — Leçon ' + nav + ' · Cours Lire la documentation — Syntaxe</title>\n' +
'    <meta name="description" content="' + m.description + '" />\n' +
'    <link rel="icon" type="image/svg+xml" href="../../assets/img/favicon.svg" />\n' +
'\n' +
'    <script src="../../js/theme.js">' + S + '\n' +
'\n' +
'    <link rel="stylesheet" href="../../css/fonts.css" />\n' +
'\n' +
'    <link rel="stylesheet" href="../../css/variables.css" />\n' +
'    <link rel="stylesheet" href="../../css/base.css" />\n' +
'    <link rel="stylesheet" href="../../css/layout.css" />\n' +
'    <link rel="stylesheet" href="../../css/components.css" />\n' +
'    <link rel="stylesheet" href="../../css/pages.css" />\n' +
'  </head>\n' +
'\n' +
'  <body data-course="doc" data-lesson="lecon-' + nav + '.html">\n' +
'    <a class="skip-link" href="#contenu">Aller au contenu</a>\n' +
'\n' +
'    <header class="site-header">\n' +
'      <div class="container--wide container site-header__inner">\n' +
'        <a class="brand" href="../../index.html" aria-label="Syntaxe — accueil">\n' +
'          <svg class="brand__mark" viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">\n' +
'            <rect x="3" y="3" width="26" height="26" rx="8" /><path d="M13 12 L9 16 L13 20" /><path d="M19 12 L23 16 L19 20" />\n' +
'          </svg>\n' +
'          <span>Syntaxe<span class="brand__dot" aria-hidden="true">.</span></span>\n' +
'        </a>\n' +
'        <button class="nav-toggle" data-nav-toggle aria-expanded="false" aria-controls="primary-nav" aria-label="Ouvrir le menu de navigation">\n' +
'          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M3 6h18M3 12h18M3 18h18" /></svg>\n' +
'        </button>\n' +
'        <nav class="primary-nav" id="primary-nav" aria-label="Navigation principale">\n' +
'          <a href="../../index.html">Accueil</a>\n' +
'          <a href="../catalogue.html">Catalogue</a>\n' +
'        </nav>\n' +
'        <div class="header-actions">\n' +
'          <button class="theme-toggle" data-theme-toggle aria-label="Activer le thème sombre">\n' +
'            <svg class="icon icon-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" /></svg>\n' +
'            <svg class="icon icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="4.5" /><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4" /></svg>\n' +
'          </button>\n' +
'        </div>\n' +
'      </div>\n' +
'    </header>\n' +
'\n' +
'    <div class="reading-progress" data-reading-progress aria-hidden="true"></div>\n' +
'\n' +
'    <main id="contenu">\n' +
'      <div class="container container--wide">\n' +
'        <nav class="breadcrumb-nav" aria-label="Fil d\'Ariane">\n' +
'          <ol class="breadcrumb">\n' +
'            <li><a href="../../index.html">Accueil</a></li>\n' +
'            <li><a href="../catalogue.html">Catalogue</a></li>\n' +
'            <li><a href="cours.html">Lire la documentation</a></li>\n' +
'            <li aria-current="page">Leçon ' + nav + '</li>\n' +
'          </ol>\n' +
'        </nav>\n' +
'\n' +
'        <div class="lesson-layout">\n' +
'          <aside class="lesson-rail lesson-coursenav" data-coursenav-host aria-label="Plan du cours">\n' +
'            <button class="coursenav-toggle" data-coursenav-toggle aria-expanded="false">\n' +
'              <span>Plan du cours</span>\n' +
'              <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M6 9l6 6 6-6" /></svg>\n' +
'            </button>\n' +
'            <div class="coursenav-panel"><div data-coursenav></div></div>\n' +
'          </aside>\n' +
'\n' +
'          <div class="lesson-main">\n' +
'            <header class="lesson-header">\n' +
'              <p class="kicker">' + m.module + '</p>\n' +
'              <h1 class="lesson-header__title">' + m.titre + '</h1>\n' +
'              <div class="meta-row">\n' +
'                <span class="duration">\n' +
'                  <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>\n' +
'                  ~' + m.minutes + ' min\n' +
'                </span>\n' +
'                <span class="dot-sep"><span class="pill pill--' + m.niveau + '">' + m.niveauTexte + '</span></span>\n' +
'                <span class="dot-sep">' + m.prerequis + '</span>\n' +
'              </div>\n' +
'\n' +
'              <div class="objectives">\n' +
'                <p class="objectives__title">À la fin de cette leçon, tu sauras</p>\n' +
'                <ul>\n' +
m.objectifs.map(function (o) { return '                  <li>' + o + '</li>'; }).join('\n') + '\n' +
'                </ul>\n' +
'              </div>\n' +
'            </header>\n' +
'\n' +
'            <details class="toc-inline" open>\n' +
'              <summary>Sommaire de la leçon</summary>\n' +
'              <nav class="toc" aria-label="Sommaire de la leçon"><div data-toc></div></nav>\n' +
'            </details>\n' +
'\n' +
'            <article class="prose">\n' +
corps + '\n' +
'\n' +
'              <button class="btn btn--primary" data-complete-toggle aria-pressed="false">\n' +
'                <span>Marquer comme terminée</span>\n' +
'              </button>\n' +
'\n' +
'              <nav class="lesson-nav" data-lesson-nav aria-label="Navigation entre leçons"></nav>\n' +
'            </article>\n' +
'          </div>\n' +
'\n' +
'          <aside class="lesson-rail lesson-toc-rail" aria-label="Sommaire">\n' +
'            <p class="toc__title">Sur cette page</p>\n' +
'            <nav class="toc" aria-label="Sommaire de la leçon"><div data-toc></div></nav>\n' +
'          </aside>\n' +
'        </div>\n' +
'      </div>\n' +
'    </main>\n' +
'\n' +
'    <footer class="site-footer">\n' +
'      <div class="container">\n' +
'        <div class="site-footer__bottom">\n' +
'          <span>© <span data-year>2026</span> Syntaxe. Projet de démonstration.</span>\n' +
'          <span><a href="cours.html">← Retour au programme du cours</a></span>\n' +
'        </div>\n' +
'      </div>\n' +
'    </footer>\n' +
'\n' +
'    <script src="../../js/data.js" defer>' + S + '\n' +
'    <script src="../../js/main.js" defer>' + S + '\n' +
'    <script src="../../js/lecon.js" defer>' + S + '\n' +
'    <script src="../../js/runner.js" defer>' + S + '\n' +
'    <script src="../../assets/vendor/prism/prism-core.min.js" defer>' + S + '\n' +
'    <script src="../../assets/vendor/prism/prism-clike.min.js" defer>' + S + '\n' +
'    <script src="../../assets/vendor/prism/prism-javascript.min.js" defer>' + S + '\n' +
'  </body>\n' +
'</html>\n';
}

/* ---------------------------------------------------------------- métadonnées */
const META = require('./meta.json');
const sortie = path.join(RACINE, 'pages', 'doc');
if (!fs.existsSync(sortie)) fs.mkdirSync(sortie, { recursive: true });

META.forEach(function (m) {
  const src = path.join(__dirname, 'corps', 'l' + Number(m.num) + '.html');
  if (!fs.existsSync(src)) { console.log('corps absent, leçon ' + m.num + ' non générée'); return; }
  const corps = remplirMarqueurs(fs.readFileSync(src, 'utf8'));
  const html = page(m, corps.replace(/\n+$/, ''));
  const cible = path.join(sortie, 'lecon-' + m.num + '.html');
  fs.writeFileSync(cible, html, 'utf8');
  const visible = html.replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]*>/g, ' ').replace(/&[a-z]+;|&#\d+;/gi, ' ').replace(/\s+/g, ' ').trim();
  console.log('écrit ' + cible + '  ' + Math.round(html.length / 1024) + ' Ko, ' + visible.split(/\s+/).length + ' mots visibles');
});
console.log('lignes de sortie insérées : ' + JSON.stringify(MESURES));
const lent = Object.keys(DUREES).sort(function (a, b) { return DUREES[b] - DUREES[a]; }).slice(0, 3);
console.log('le plus lent : ' + lent.map(function (n) { return n + ' ' + DUREES[n] + ' ms'; }).join(', ') +
  '  (plafond du navigateur : ' + PLAFOND_NAVIGATEUR_MS + ' ms)');
