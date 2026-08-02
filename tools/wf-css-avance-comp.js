export const meta = {
  name: 'syntaxe-css-avance-comp',
  description: 'Rédige 2 leçons de compléments du cours CSS avancé (positionnement par ancre, View Transitions)',
  phases: [{ title: 'Rédaction' }, { title: 'Relecture' }],
};

function buildLesson(p) {
  const objectives = p.objectives.map((o) => '                  <li>' + o + '</li>').join('\n');
  return `<!DOCTYPE html>
<html lang="fr" data-theme="light">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${p.title} — Leçon ${p.num} · CSS avancé · Syntaxe</title>
    <meta name="description" content="${p.metaDesc}" />
    <link rel="icon" type="image/svg+xml" href="../../assets/img/favicon.svg" />

    <script src="../../js/theme.js"></script>

    <link rel="stylesheet" href="../../css/fonts.css" />

    <link rel="stylesheet" href="../../css/variables.css" />
    <link rel="stylesheet" href="../../css/base.css" />
    <link rel="stylesheet" href="../../css/layout.css" />
    <link rel="stylesheet" href="../../css/components.css" />
    <link rel="stylesheet" href="../../css/pages.css" />
  </head>

  <body data-course="css-avance" data-lesson="lecon-${p.num}.html">
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
          <a href="../js/cours.html">Cours JavaScript</a>
          <a href="../../index.html#pourquoi">Notre approche</a>
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
            <li><a href="cours.html">CSS avancé</a></li>
            <li aria-current="page">Leçon ${p.num}</li>
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
              <p class="kicker">Module ${p.modNum} · ${p.modName} — Leçon ${p.num}</p>
              <h1 class="lesson-header__title">${p.title}</h1>
              <div class="meta-row">
                <span class="duration">
                  <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
                  ~${p.durationMin} min
                </span>
                <span class="dot-sep"><span class="pill pill--avance">Avancé</span></span>
                <span class="dot-sep">${p.prereq}</span>
              </div>

              <div class="objectives">
                <p class="objectives__title">À la fin de cette leçon, tu sauras</p>
                <ul>
${objectives}
                </ul>
              </div>
            </header>

            <details class="toc-inline" open>
              <summary>Sommaire de la leçon</summary>
              <nav class="toc" aria-label="Sommaire de la leçon"><div data-toc></div></nav>
            </details>

            <article class="prose">
${p.body}

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

    <script src="../../js/data.js" defer></script>
    <script src="../../js/main.js" defer></script>
    <script src="../../js/lecon.js" defer></script>
    <script src="../../js/runner.js" defer></script>
    <script src="../../assets/vendor/prism/prism-core.min.js" defer></script>
    <script src="../../assets/vendor/prism/prism-clike.min.js" defer></script>
    <script src="../../assets/vendor/prism/prism-markup.min.js" defer></script>
    <script src="../../assets/vendor/prism/prism-css.min.js" defer></script>
    <script src="../../assets/vendor/prism/prism-javascript.min.js" defer></script>
  </body>
</html>
`;
}

const ICON_NOTE = '<svg class="callout__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M12 8h.01M11 12h1v4h1" /></svg>';
const ICON_WARN = '<svg class="callout__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" /><path d="M12 9v4M12 17h.01" /></svg>';
const ICON_TIP = '<svg class="callout__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12c.7.7 1 1.2 1 2h6c0-.8.3-1.3 1-2a7 7 0 0 0-4-12Z" /></svg>';
const ICON_MORE = '<svg class="callout__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 3v14M5 10l7 7 7-7M5 21h14" /></svg>';

const INSTRUCTIONS = `Tu rédiges une leçon de COMPLÉMENTS du cours « CSS avancé : le CSS moderne en profondeur » (Syntaxe). Public :
développeurs ayant fini ce cours (@layer, :has, oklch, subgrid, container queries, transformations 3D, @property,
scroll-driven, filtres/masques, nesting/@scope, propriétés logiques, performance). Ces deux leçons ajoutent les
fonctionnalités les plus RÉCENTES. Français, tutoiement, ton précis et technique. CSS de pointe. NE réexplique pas les bases.

ATOUT — APERÇU EN DIRECT : un bouton « 👁 Aperçu » rend les blocs HTML dans une iframe. Pour un EFFET VISUEL, écris un
bloc <figure class="code-block" data-file="demo.html"><pre><code class="language-markup"> avec une PETITE structure HTML ET
un &lt;style&gt; (ÉCHAPPÉS). Quand une démo a besoin d'un déclencheur JS (view transitions), inclus un &lt;script&gt; ÉCHAPPÉ.
SUPPORT : ces fonctionnalités sont TRÈS récentes — mentionne l'amélioration progressive et @supports pour un repli.

TU PRODUIS UNIQUEMENT { metaDesc, objectives, body } :
- metaDesc : ~150 caractères.
- objectives : 3 à 4 chaînes (« savoir faire X »), HTML inline autorisé (<code>, <strong>). «&nbsp;;» puis «.» pour la dernière.
- body : HTML INTÉRIEUR de <article class="prose"> (sans la balise article, sans bouton « terminer », sans nav).

STRUCTURE (≈1300–1800 mots) : 1–2 <p> d'intro ; 5–8 sections <h2> (chacune avec un exemple, souvent prévisualisable) ;
<h2>Pièges fréquents</h2> ; <h2>Pour aller plus loin</h2> ; <h2>Récap et vérification</h2> (résumé <ul> + lesson-check) ;
<h2>Exercices</h2> (3 gradués avec solutions repliables).

COMPOSANTS (n'invente pas d'autres classes) :
- Démo HTML+CSS (prévisualisable) : <figure class="code-block" data-file="demo.html"><pre><code class="language-markup">&lt;style&gt; … &lt;/style&gt; …</code></pre></figure>.
- Règle CSS : <figure class="code-block" data-file="styles.css"><pre><code class="language-css">…</code></pre></figure>. Légende : <p class="code-caption">…</p>
- Note : <div class="callout callout--note">${ICON_NOTE}<div class="callout__body"><p class="callout__title">Note</p><p>…</p></div></div>
- Piège : <div class="callout callout--warn">${ICON_WARN}<div class="callout__body"><p class="callout__title">Piège fréquent</p><p>…</p></div></div>
- Astuce : <div class="callout callout--tip">${ICON_TIP}<div class="callout__body"><p class="callout__title">Astuce</p><p>…</p></div></div>
- Pour aller plus loin : <div class="callout callout--more">${ICON_MORE}<div class="callout__body"><p class="callout__title">Pour aller plus loin</p><p>…</p></div></div>
- Vérification : <div class="lesson-check"><p class="kicker kicker--gold">Vérifie ta compréhension</p><ol><li>…</li><li>…</li><li>…</li></ol></div>
- Exercice : <div class="exercise"><div class="exercise__head"><span class="exercise__num">Exercice 1</span><span class="exercise__level">Échauffement</span></div><p>…</p><details><summary>Voir une solution</summary><figure class="code-block" data-file="solution.css"><pre><code class="language-css">…</code></pre></figure></details></div>

ÉCHAPPEMENT (CRITIQUE) : DANS un <code>, « < »→« &lt; », « > »→« &gt; », « & »→« &amp; ». Donc &lt;style&gt;, &lt;script&gt; sont
échappés ; le combinateur enfant « > » s'écrit « &gt; » ; dans @position-try ou les fonctions, pas de < > bruts. Aucun caractère brut dans un &lt;code&gt;.

RÈGLES : CSS de pointe, exact. Pas de style= / &lt;style&gt; / &lt;script&gt; RÉELS dans la page (uniquement échappés dans des blocs de code).`;

const SCHEMA = {
  type: 'object', additionalProperties: false,
  required: ['metaDesc', 'objectives', 'body'],
  properties: {
    metaDesc: { type: 'string' },
    objectives: { type: 'array', items: { type: 'string' }, minItems: 3, maxItems: 4 },
    body: { type: 'string' },
  },
};

const SPECS = [
  { num: '13', modNum: '05', modName: 'À la pointe du CSS', durationMin: 30, title: 'Le positionnement par ancre', prereq: 'Cours CSS avancé recommandé',
    brief: `Sujet : positionner un élément PAR RAPPORT à un autre, nativement, sans JavaScript.
Sections : (1) Le problème : positionner une infobulle, un menu ou un popover par rapport à son déclencheur exigeait du JS (calculs de position, repositionnement au scroll). L'ANCHOR POSITIONING le fait en CSS pur. (2) Définir une ANCRE : anchor-name: --mon-ancre sur l'élément de référence. (3) Positionner l'élément ancré : position: absolute (ou fixed), position-anchor: --mon-ancre, puis la fonction anchor() — ex. top: anchor(bottom), left: anchor(left) — pour s'aligner sur les bords de l'ancre. (4) position-area : une grille 3×3 autour de l'ancre (top / bottom / start / end / center) pour un placement DÉCLARATIF simple. (5) Le REPLI quand l'élément déborde de l'écran : @position-try et position-try-fallbacks (basculer la position automatiquement). (6) anchor-size() (dimensionner selon l'ancre). (7) Combiner avec l'attribut popover (cours HTML avancé) et @supports pour un repli. DÉMO prévisualisable (une infobulle ancrée sous un bouton) — invite « 👁 Aperçu ».
Pièges : oublier position: absolute/fixed (l'ancre ne fait rien sans positionnement) ; le support très récent (prévoir @supports + un repli) ; confondre anchor() (position) et anchor-size() (dimension) ; un débordement non géré (utiliser @position-try).
Pour aller plus loin : anchor + popover pour des menus, le repli progressif, la bibliothèque Floating UI que cela remplace.
Exercices : (1) ancrer une étiquette sous un bouton avec anchor() ; (2) la placer en haut à droite avec position-area ; (3) ajouter un repli avec @supports.`,
  },
  { num: '14', modNum: '05', modName: 'À la pointe du CSS', durationMin: 30, title: 'Les View Transitions', prereq: 'Leçon 13 recommandée',
    brief: `Sujet : animer en douceur les changements d'état et de page.
Sections : (1) Le problème : passer d'un état A à un état B (filtrer une liste, trier, naviguer) est BRUTAL. Les VIEW TRANSITIONS animent la transition entre deux « captures » du DOM. (2) Même document (SPA) : document.startViewTransition(() =&gt; { /* mise à jour du DOM */ }) déclenche la transition (un peu de JS) ; le CSS pilote l'animation. (3) Les PSEUDO-ÉLÉMENTS générés : ::view-transition, ::view-transition-group(nom), ::view-transition-old(nom) et ::view-transition-new(nom) — pour animer l'ancien et le nouveau visuel. (4) view-transition-name: une-id sur un élément pour qu'il soit animé INDIVIDUELLEMENT (un morphing — ex. une vignette qui s'agrandit en grande image). (5) PERSONNALISER avec des @keyframes sur ces pseudo-éléments (durée, easing). (6) Cross-document (multi-pages) : @view-transition { navigation: auto } pour des transitions entre PAGES (très récent). (7) prefers-reduced-motion IMPÉRATIF. DÉMO : montre le CSS et un petit &lt;script&gt; échappé qui déclenche startViewTransition.
Pièges : un view-transition-name DUPLIQUÉ (il doit être unique pendant la transition) ; oublier prefers-reduced-motion ; ne pas prévoir le repli (amélioration progressive) ; animer des propriétés coûteuses.
Pour aller plus loin : les transitions multi-pages, l'intégration avec les routeurs/frameworks, les scroll-driven animations (leçon 8 de ce cours), la View Transition API côté JS (cours JavaScript).
Exercices : (1) une transition de fondu au changement d'état ; (2) nommer un élément pour qu'il « morphe » entre deux états ; (3) respecter prefers-reduced-motion.`,
  },
];

log('Rédaction de ' + SPECS.length + ' leçons (compléments CSS avancé)…');

const results = await pipeline(
  SPECS,
  (s) =>
    agent(
      INSTRUCTIONS +
        '\n\n=== LEÇON À RÉDIGER ===\nNuméro : ' + s.num + ' | Module ' + s.modNum + ' (' + s.modName + ')\nTitre : ' + s.title +
        '\n\nBRIEF DÉTAILLÉ (intègre fidèlement le contenu ; démos prévisualisables ; mentionne @supports ; échappe les balises) :\n' + s.brief,
      { label: 'écrit L' + s.num, phase: 'Rédaction', schema: SCHEMA }
    ),
  (parts, s) =>
    agent(
      INSTRUCTIONS +
        '\n\n=== RELECTURE CRITIQUE (corrige et renvoie la version finale, même schéma) ===\nLeçon ' + s.num + ' « ' + s.title + ' ».\n' +
        '1. EXACTITUDE (anchor positioning : anchor-name/anchor()/position-area/@position-try ; OU view transitions : startViewTransition/::view-transition-*/view-transition-name selon la leçon) ; amélioration progressive (@supports / prefers-reduced-motion).\n' +
        '2. APERÇU : effets visuels en blocs language-markup avec &lt;style&gt; (et &lt;script&gt; pour les view transitions) ÉCHAPPÉS.\n' +
        '3. ÉCHAPPEMENT : DANS les blocs de code, « < »→« &lt; », « > »→« &gt; » (dont le combinateur &gt; et la flèche =&gt;), « & »→« &amp; ». Aucune balise réelle dans un &lt;code&gt;.\n' +
        '4. STRUCTURE : intro, 5–8 sections <h2>, Pièges fréquents, Pour aller plus loin, Récap et vérification (lesson-check), Exercices (3 avec solutions).\n' +
        '5. Public AVANCÉ ; aucun style/script réel dans la page.\n\n' +
        'BRIEF DE RÉFÉRENCE :\n' + s.brief + '\n\nBROUILLON (JSON) :\n' + JSON.stringify(parts),
      { label: 'relit L' + s.num, phase: 'Relecture', schema: SCHEMA }
    ).then((fixed) => {
      const p = fixed || parts;
      const html = buildLesson({
        num: s.num, modNum: s.modNum, modName: s.modName, durationMin: s.durationMin,
        title: s.title, prereq: s.prereq, metaDesc: p.metaDesc, objectives: p.objectives, body: p.body,
      });
      return { file: 'lecon-' + s.num + '.html', html, num: s.num };
    })
);

const ok = results.filter(Boolean);
log('Leçons assemblées : ' + ok.length + '/' + SPECS.length);
return ok;
