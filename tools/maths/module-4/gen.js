/* Générateur des leçons du module 4 du cours « maths ».
   POURQUOI un générateur : les blocs de code publiés sont LITTÉRALEMENT les
   fichiers de tools/maths/module-4/code/ qui ont été exécutés, et les blocs de
   sortie sont LITTÉRALEMENT ce que cette exécution a produit. Aucune recopie
   à la main, donc aucune divergence possible entre le publié et le réel. */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const RACINE = path.join(__dirname, '..', '..', '..');
const CODE = path.join(__dirname, 'code');

/* Le formateur EXACT du Web Worker de js/runner.js — c'est ce que l'apprenant voit. */
function fmt(v) {
  if (typeof v === 'string') return v;
  if (v === undefined) return 'undefined';
  if (v === null) return 'null';
  if (typeof v === 'function') return v.toString();
  try { return JSON.stringify(v); } catch (e) { return String(v); }
}
function executer(src) {
  const out = [];
  const push = function () { out.push(Array.prototype.slice.call(arguments).map(fmt).join(' ')); };
  const bac = { console: { log: push, warn: push, error: push, info: push, debug: push } };
  bac.globalThis = bac;
  try { vm.runInNewContext(src, vm.createContext(bac), { timeout: 5000 }); }
  catch (e) { out.push('!! ' + e.name + ': ' + e.message); }
  return out.join('\n');
}

/* La règle qui a détruit des pages de ce site : tout « < » d'un bloc de code
   s'écrit &lt;. On échappe aussi & et > par symétrie. */
function ech(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function blocCode(nom, src) {
  return '<figure class="code-block" data-file="' + nom + '"><pre><code class="language-javascript">' +
    ech(src.replace(/\n+$/, '')) + '</code></pre></figure>';
}
function blocSortie(nom, sortie) {
  return '<figure class="code-block" data-file="' + nom + '"><pre><code class="language-plaintext">' +
    ech(sortie) + '</code></pre></figure>';
}

const MESURES = {};
function remplirMarqueurs(corps) {
  return corps.replace(/@@(CODE|SORTIE):([a-z0-9-]+\.js)@@/g, function (_, quoi, fichier) {
    const src = fs.readFileSync(path.join(CODE, fichier), 'utf8');
    if (quoi === 'CODE') return blocCode(fichier, src);
    const sortie = executer(src);
    MESURES[fichier] = sortie.split('\n').length;
    return blocSortie(fichier.replace(/\.js$/, '.txt'), sortie);
  });
}

/* ------------------------------------------------------------------ gabarit */
function page(m, corps) {
  const nav = m.num;
  const S = '<' + '/script>';
  return `<!DOCTYPE html>
<html lang="fr" data-theme="light">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${m.titreTexte} — Leçon ${nav} · Cours Mathématiques de l'informatique — Syntaxe</title>
    <meta name="description" content="${m.description}" />
    <link rel="icon" type="image/svg+xml" href="../../assets/img/favicon.svg" />

    <script src="../../js/theme.js">${S}

    <link rel="stylesheet" href="../../css/fonts.css" />

    <link rel="stylesheet" href="../../css/variables.css" />
    <link rel="stylesheet" href="../../css/base.css" />
    <link rel="stylesheet" href="../../css/layout.css" />
    <link rel="stylesheet" href="../../css/components.css" />
    <link rel="stylesheet" href="../../css/pages.css" />
  </head>

  <body data-course="maths" data-lesson="lecon-${nav}.html">
    <a class="skip-link" href="#contenu">Aller au contenu</a>

    <header class="site-header">
      <div class="container--wide container site-header__inner">
        <a class="brand" href="../../index.html" aria-label="Syntaxe — accueil">
          <svg class="brand__mark" viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <rect x="3" y="3" width="26" height="26" rx="8" /><path d="M13 12 L9 16 L13 20" /><path d="M19 12 L23 16 L19 20" />
          </svg>
          <span>Syntaxe<span class="brand__dot" aria-hidden="true">.</span></span>
        </a>
        <button class="nav-toggle" data-nav-toggle aria-expanded="false" aria-controls="primary-nav" aria-label="Ouvrir le menu de navigation">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M3 6h18M3 12h18M3 18h18" /></svg>
        </button>
        <nav class="primary-nav" id="primary-nav" aria-label="Navigation principale">
          <a href="../../index.html">Accueil</a>
          <a href="../catalogue.html">Catalogue</a>
        </nav>
        <div class="header-actions">
          <button class="theme-toggle" data-theme-toggle aria-label="Activer le thème sombre">
            <svg class="icon icon-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" /></svg>
            <svg class="icon icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="4.5" /><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4" /></svg>
          </button>
        </div>
      </div>
    </header>

    <div class="reading-progress" data-reading-progress aria-hidden="true"></div>

    <main id="contenu">
      <div class="container container--wide">
        <nav class="breadcrumb-nav" aria-label="Fil d'Ariane">
          <ol class="breadcrumb">
            <li><a href="../../index.html">Accueil</a></li>
            <li><a href="../catalogue.html">Catalogue</a></li>
            <li><a href="cours.html">Mathématiques de l'informatique</a></li>
            <li aria-current="page">Leçon ${nav}</li>
          </ol>
        </nav>

        <div class="lesson-layout">
          <aside class="lesson-rail lesson-coursenav" data-coursenav-host aria-label="Plan du cours">
            <button class="coursenav-toggle" data-coursenav-toggle aria-expanded="false">
              <span>Plan du cours</span>
              <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M6 9l6 6 6-6" /></svg>
            </button>
            <div class="coursenav-panel"><div data-coursenav></div></div>
          </aside>

          <div class="lesson-main">
            <header class="lesson-header">
              <p class="kicker">Module 4 · Graphes et matrices</p>
              <h1 class="lesson-header__title">${m.titre}</h1>
              <div class="meta-row">
                <span class="duration">
                  <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
                  ~${m.minutes} min
                </span>
                <span class="dot-sep"><span class="pill pill--intermediaire">Intermédiaire</span></span>
                <span class="dot-sep">${m.prerequis}</span>
              </div>

              <div class="objectives">
                <p class="objectives__title">À la fin de cette leçon, tu sauras</p>
                <ul>
${m.objectifs.map((o) => '                  <li>' + o + '</li>').join('\n')}
                </ul>
              </div>
            </header>

            <details class="toc-inline" open>
              <summary>Sommaire de la leçon</summary>
              <nav class="toc" aria-label="Sommaire de la leçon"><div data-toc></div></nav>
            </details>

            <article class="prose">
${corps}

              <button class="btn btn--primary" data-complete-toggle aria-pressed="false">
                <span>Marquer comme terminée</span>
              </button>

              <nav class="lesson-nav" data-lesson-nav aria-label="Navigation entre leçons"></nav>
            </article>
          </div>

          <aside class="lesson-rail lesson-toc-rail" aria-label="Sommaire">
            <p class="toc__title">Sur cette page</p>
            <nav class="toc" aria-label="Sommaire de la leçon"><div data-toc></div></nav>
          </aside>
        </div>
      </div>
    </main>

    <footer class="site-footer">
      <div class="container">
        <div class="site-footer__bottom">
          <span>© <span data-year>2026</span> Syntaxe. Projet de démonstration.</span>
          <span><a href="cours.html">← Retour au programme du cours</a></span>
        </div>
      </div>
    </footer>

    <script src="../../js/data.js" defer>${S}
    <script src="../../js/main.js" defer>${S}
    <script src="../../js/lecon.js" defer>${S}
    <script src="../../js/runner.js" defer>${S}
    <script src="../../assets/vendor/prism/prism-core.min.js" defer>${S}
    <script src="../../assets/vendor/prism/prism-clike.min.js" defer>${S}
    <script src="../../assets/vendor/prism/prism-javascript.min.js" defer>${S}
  </body>
</html>
`;
}

/* ---------------------------------------------------------------- métadonnées */
const META = require('./meta.json');

const sortie = path.join(RACINE, 'pages', 'maths');
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
