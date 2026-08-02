export const meta = {
  name: 'syntaxe-css-avance',
  description: 'Rédige les 12 leçons du cours « CSS avancé : le CSS moderne en profondeur »',
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

const INSTRUCTIONS = `Tu rédiges une leçon du cours « CSS avancé : le CSS moderne en profondeur » (site Syntaxe). Public :
développeurs qui MAÎTRISENT DÉJÀ le CSS de base (sélecteurs, cascade & spécificité, modèle de boîte, typographie,
Flexbox, Grid, responsive/media queries, transitions/animations, variables CSS, calc/clamp). NE réexplique PAS les
bases ; va droit à l'avancé et au CSS MODERNE. Français, tutoiement, ton précis et technique mais clair.

ATOUT MAJEUR — APERÇU EN DIRECT : un bouton « 👁 Aperçu » sur les blocs HTML rend le code dans une iframe isolée.
Pour montrer un EFFET VISUEL (cascade de couches, :has, oklch, subgrid, container query, transform 3D, animation,
filtre, masque…), écris un bloc <figure class="code-block" data-file="demo.html"><pre><code class="language-markup">
qui contient une PETITE structure HTML ET un &lt;style&gt; (le tout ÉCHAPPÉ), pour que « 👁 Aperçu » affiche le résultat.
Quand une démo a besoin d'un peu de JavaScript (rare), inclus un &lt;script&gt; ÉCHAPPÉ dans le bloc language-markup.
Pour une règle de RÉFÉRENCE isolée, un bloc class="language-css" suffit (coloré, mais non prévisualisable).
Invite explicitement (au moins une fois, via un encadré Astuce) à cliquer « 👁 Aperçu » et à modifier les valeurs.

TU PRODUIS UNIQUEMENT { metaDesc, objectives, body } :
- metaDesc : ~150 caractères.
- objectives : 3 à 4 chaînes (« savoir faire X »), HTML inline autorisé (<code>, <strong>). «&nbsp;;» puis «.» pour la dernière.
- body : HTML INTÉRIEUR de <article class="prose"> (sans la balise article, sans bouton « terminer », sans nav).

STRUCTURE (≈1300–1800 mots) : 1–2 <p> d'intro ; 5–8 sections <h2> (chacune avec un exemple, souvent prévisualisable) ;
<h2>Pièges fréquents</h2> ; <h2>Pour aller plus loin</h2> ; <h2>Récap et vérification</h2> (résumé <ul> + lesson-check) ;
<h2>Exercices</h2> (3 gradués avec solutions repliables).

SUPPORT NAVIGATEUR : ces fonctionnalités sont MODERNES. Quand c'est pertinent, mentionne l'amélioration progressive
et @supports (selector(...) / (propriété: valeur)) pour un repli — sans alourdir la leçon.

COMPOSANTS (n'invente pas d'autres classes) :
- Démo HTML+CSS (prévisualisable) : <figure class="code-block" data-file="demo.html"><pre><code class="language-markup">&lt;style&gt; … &lt;/style&gt; &lt;div class="..."&gt;…&lt;/div&gt;</code></pre></figure>.
- Règle CSS de référence : <figure class="code-block" data-file="styles.css"><pre><code class="language-css">…</code></pre></figure>.
- Légende : <p class="code-caption">…</p>
- Note : <div class="callout callout--note">${ICON_NOTE}<div class="callout__body"><p class="callout__title">Note</p><p>…</p></div></div>
- Piège : <div class="callout callout--warn">${ICON_WARN}<div class="callout__body"><p class="callout__title">Piège fréquent</p><p>…</p></div></div>
- Astuce : <div class="callout callout--tip">${ICON_TIP}<div class="callout__body"><p class="callout__title">Astuce</p><p>…</p></div></div>
- Pour aller plus loin : <div class="callout callout--more">${ICON_MORE}<div class="callout__body"><p class="callout__title">Pour aller plus loin</p><p>…</p></div></div>
- Vérification : <div class="lesson-check"><p class="kicker kicker--gold">Vérifie ta compréhension</p><ol><li>…</li><li>…</li><li>…</li></ol></div>
- Exercice : <div class="exercise"><div class="exercise__head"><span class="exercise__num">Exercice 1</span><span class="exercise__level">Échauffement</span></div><p>…</p><details><summary>Voir une solution</summary><figure class="code-block" data-file="solution.css"><pre><code class="language-css">…</code></pre></figure></details></div>

ÉCHAPPEMENT (CRITIQUE) : DANS un <code>, « < »→« &lt; », « > »→« &gt; », « & »→« &amp; ». Donc &lt;style&gt;, &lt;div&gt;
sont échappés ; le combinateur enfant « > » s'écrit « &gt; » ; dans @property, syntax: "&lt;angle&gt;" est échappé.

RÈGLES : CSS MODERNE, exact et à jour. Pas de style= / <style> / <script> RÉELS dans la page (ton body = prose + blocs de
code ; les &lt;style&gt; et &lt;script&gt; n'apparaissent qu'ÉCHAPPÉS, à l'intérieur de blocs de code). Exemples accessibles
(contraste correct, prefers-reduced-motion respecté pour les animations).`;

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
  { num: '01', modNum: '01', modName: 'Maîtriser la cascade moderne', durationMin: 28, title: 'Les couches de cascade (@layer)', prereq: 'Cours CSS (cascade) recommandé',
    brief: `Sujet : reprendre le contrôle de la cascade à grande échelle avec les couches.
Sections : (1) Rappel express : la cascade départage par origine, importance, SPÉCIFICITÉ puis ORDRE. Le problème à l'échelle : les guerres de spécificité et le recours à !important. (2) @layer : déclarer des COUCHES ordonnées, ex. @layer reset, base, composants, utilitaires; l'ordre de DÉCLARATION des couches prime sur la spécificité — une règle d'une couche déclarée plus tard gagne même si elle est MOINS spécifique. (3) Assigner des règles : @layer composants { ... } ou via @import url(...) layer(nom). (4) Les règles HORS couche l'emportent sur toutes les couches ; et !important INVERSE l'ordre des couches (surprenant mais logique). (5) Couches IMBRIQUÉES (nom.sous-nom). (6) Cas d'usage phare : mettre un framework tiers dans une couche basse pour le surcharger sans bataille de spécificité. (7) DÉMO prévisualisable : deux couches où la couche déclarée en DERNIER gagne malgré une spécificité plus faible — invite « 👁 Aperçu ».
Pièges : croire que la spécificité prime encore ENTRE couches (non : l'ordre des couches d'abord) ; oublier de déclarer l'ordre des couches en tête de feuille ; !important qui inverse la priorité ; tout laisser hors couche.
Pour aller plus loin : @scope, revert-layer, l'intégration progressive d'anciennes feuilles, la stratégie de couches d'un design system.
Exercices : (1) déclarer 3 couches dans un ordre voulu ; (2) montrer qu'une couche tardive bat une règle plus spécifique d'une couche antérieure ; (3) intégrer un style « tiers » dans une couche surchargeable.`,
  },
  { num: '02', modNum: '01', modName: 'Maîtriser la cascade moderne', durationMin: 28, title: 'Sélecteurs modernes : :is(), :where() et :has()', prereq: 'Leçon 01 recommandée',
    brief: `Sujet : les sélecteurs fonctionnels et relationnels qui changent la donne.
Sections : (1) :is(sel, sel) FACTORISE une liste : :is(h1, h2, h3) strong remplace trois sélecteurs ; sa SPÉCIFICITÉ vaut celle de son argument le PLUS spécifique. (2) :where(...) est identique à :is mais de SPÉCIFICITÉ ZÉRO — parfait pour des styles de base facilement surchargeables (utile dans un design system). (3) :has(...) le sélecteur « PARENT » : cibler un élément SELON ses descendants ou son état — figure:has(figcaption), label:has(input:checked), un frère avec :has(+ p). (4) Composer : form:has(input:invalid) stylise le formulaire selon son contenu ; .galerie:has(:nth-child(4)) réagit à la QUANTITÉ ; :not(:has(...)). (5) Des layouts CONDITIONNELS sans JavaScript. (6) Le support : @supports selector(:has(*)) pour un repli. (7) DÉMO prévisualisable : une carte qui change quand elle CONTIENT une image, et un label stylé quand sa case est cochée (:has) — invite « 👁 Aperçu ».
Pièges : oublier que :where a une spécificité nulle (surchargé sans le vouloir) ; :has trop large (coût) ; croire que :has « remonte » plusieurs niveaux au hasard (il cible bien l'élément du sélecteur) ; support à vérifier.
Pour aller plus loin : :has pour des mises en page réactives au contenu, :is/:where dans une architecture, la performance des sélecteurs, :not() avancé.
Exercices : (1) factoriser trois sélecteurs avec :is ; (2) écrire un style de base à spécificité nulle avec :where ; (3) styler un label quand sa case est cochée avec :has.`,
  },
  { num: '03', modNum: '02', modName: 'Couleur & mise en page avancées', durationMin: 28, title: 'La couleur moderne : oklch, color-mix et couleurs relatives', prereq: 'Module 1 recommandé',
    brief: `Sujet : les espaces de couleur perceptuels et les fonctions de couleur modernes.
Sections : (1) Au-delà de hsl : les espaces PERCEPTUELS. oklch(L C H) (luminosité perceptuelle, chroma, teinte) produit des variations et dégradés bien plus RÉGULIERS que hsl/rgb ; mention d'oklab. (2) La syntaxe moderne sans virgules + alpha avec une barre : rgb(0 0 0 / 50%), hsl(210 100% 50% / 0.6). (3) color-mix(in oklch, var(--accent) 70%, white) pour ÉCLAIRCIR, assombrir ou mélanger — dériver toute une gamme (survol, surfaces) depuis UNE seule couleur. (4) Les COULEURS RELATIVES : oklch(from var(--accent) l c h / 50%), rgb(from ...) pour transformer une couleur existante. (5) Le gamut large P3 : color(display-p3 1 0 0) pour des couleurs plus vives sur écrans récents. (6) currentColor, color-scheme et accent-color (contrôles natifs). (7) DÉMO prévisualisable : une palette entière dérivée d'un seul accent avec color-mix — invite « 👁 Aperçu » et à changer l'accent.
Pièges : chroma trop élevé hors gamut (couleur écrêtée) ; croire hsl perceptuellement uniforme (d'où oklch) ; oublier un repli (hex / @supports) ; confondre oklch et oklab.
Pour aller plus loin : les dégradés interpolés en oklch (linear-gradient(in oklch, …)), la gestion de thèmes, la Relative Color Syntax avancée, le contraste APCA.
Exercices : (1) définir un accent en oklch puis deux variantes via color-mix ; (2) ajouter une alpha avec la syntaxe à barre oblique ; (3) éclaircir une couleur de 20 % avec color-mix.`,
  },
  { num: '04', modNum: '02', modName: 'Couleur & mise en page avancées', durationMin: 30, title: 'CSS Grid avancé et subgrid', prereq: 'Leçon 03 recommandée',
    brief: `Sujet : exploiter toute la puissance de la grille, jusqu'à subgrid.
Sections : (1) Rappel éclair, puis les LIGNES NOMMÉES : grid-template-columns: [bord] 1fr [milieu] 1fr [fin], et le placement par nom. (2) Placement avancé : grid-column: span 2, lignes NÉGATIVES (-1 = dernière ligne), superposer plusieurs éléments dans une même cellule, grid-auto-flow: dense (combler les trous). (3) Les pistes IMPLICITES : grid-auto-rows / grid-auto-columns. (4) SUBGRID : grid-template-columns: subgrid sur un enfant grille pour qu'il HÉRITE des pistes (et des gaps) du parent — ainsi les titres et les boutons de plusieurs cartes s'ALIGNENT entre eux. (5) auto-fill vs auto-fit avec minmax() — la différence concrète sur les pistes vides. (6) Alignement fin : justify/align-items, -content, -self, place-*. (7) DÉMO prévisualisable : une rangée de cartes dont les pieds s'alignent grâce à subgrid — invite « 👁 Aperçu ».
Pièges : confondre auto-fill et auto-fit ; subgrid sans display:grid sur l'enfant ; oublier que subgrid hérite des pistes ET des gaps ; attendre du « masonry » (pas encore standard partout).
Pour aller plus loin : le masonry CSS (expérimental), Grid + container queries, les lignes nommées générées par grid-template-areas, l'alignement de composants complexes.
Exercices : (1) faire se chevaucher deux éléments dans une même cellule ; (2) aligner les pieds de trois cartes avec subgrid ; (3) illustrer la différence entre auto-fill et auto-fit.`,
  },
  { num: '05', modNum: '02', modName: 'Couleur & mise en page avancées', durationMin: 28, title: 'Dimensionnement intrinsèque et aspect-ratio', prereq: 'Leçon 04 recommandée',
    brief: `Sujet : laisser le contenu et le contexte dicter les tailles.
Sections : (1) Les mots-clés INTRINSÈQUES : min-content (la plus petite largeur sans débordement), max-content (largeur idéale du contenu), fit-content(limite) — ex. une colonne qui s'ajuste au plus long mot. (2) aspect-ratio: 16 / 9 — réserver un RATIO (vidéos, vignettes) sans l'ancien hack du padding ; se combine avec width/height auto. (3) min(), max(), clamp() en usage avancé : width: min(100%, 60ch) pour une mesure de lecture fluide et bornée. (4) Les UNITÉS modernes : vi/vb (logiques), dvh/svh/lvh (viewport DYNAMIQUE — résout le bug de la barre d'adresse mobile), et les unités de conteneur cqi/cqw (annonce de la leçon 6). (5) Le contenu remplaçant : object-fit / object-position avec aspect-ratio sur une image. (6) DÉMO prévisualisable : une vignette en aspect-ratio 1 / 1 et une boîte en fit-content — invite « 👁 Aperçu ».
Pièges : aspect-ratio contredit par une hauteur explicite ; vh sur mobile (préférer dvh) ; min-content/max-content mal compris ; oublier object-fit sur une image contrainte.
Pour aller plus loin : les container query units (leçon 6), text-wrap: balance / pretty, contain-intrinsic-size (perf), le dimensionnement dans Grid et Flexbox.
Exercices : (1) réserver un ratio 16 / 9 pour une vidéo ; (2) limiter un texte à min(100%, 65ch) ; (3) utiliser dvh pour une section plein écran fiable sur mobile.`,
  },
  { num: '06', modNum: '02', modName: 'Couleur & mise en page avancées', durationMin: 30, title: 'Les container queries (@container)', prereq: 'Leçon 05 recommandée',
    brief: `Sujet : styliser selon la taille du CONTENEUR, pas de la fenêtre.
Sections : (1) La limite des media queries : un composant ignore l'espace dans lequel il est posé. La solution moderne : les CONTAINER QUERIES, qui rendent un composant vraiment réutilisable. (2) Déclarer un conteneur : container-type: inline-size (ou size) sur le parent, et un container-name optionnel ; le raccourci container: nom / inline-size. (3) Interroger : @container (min-width: 400px) { ... } stylise les DESCENDANTS selon la largeur du conteneur le plus proche ; @container nom (…). (4) Les UNITÉS de conteneur : cqi (inline), cqw, cqh, cqb, cqmin, cqmax — dimensionner relativement au conteneur (ex. un titre en cqi). (5) Un même composant carte qui passe d'empilé à horizontal selon l'espace DISPONIBLE, placé n'importe où. (6) Mention des STYLE queries (@container style(...)). (7) DÉMO prévisualisable : une carte « réactive au conteneur » — invite « 👁 Aperçu » et à imaginer le composant dans une colonne étroite puis large.
Pièges : oublier container-type (la requête ne s'applique jamais) ; vouloir styler le conteneur lui-même (on cible ses DESCENDANTS) ; container-type: size qui exige une hauteur ; confondre cqi et vw.
Pour aller plus loin : les style queries, container queries + subgrid, la composition de composants autonomes, le repli (@supports / mobile-first).
Exercices : (1) déclarer un conteneur en inline-size ; (2) faire passer une carte en deux colonnes au-delà de 400px de CONTENEUR ; (3) dimensionner un titre avec l'unité cqi.`,
  },
  { num: '07', modNum: '03', modName: 'Mouvement & effets visuels', durationMin: 28, title: 'Transformations 3D et perspective', prereq: 'Module 2 recommandé',
    brief: `Sujet : ajouter une 3e dimension aux transformations.
Sections : (1) Rappel des transform 2D, puis la 3D : translateZ / translate3d, rotateX / rotateY / rotateZ, scaleZ. (2) La PROFONDEUR : la propriété perspective sur le PARENT (ou la fonction perspective() par élément) et perspective-origin — plus la valeur est petite, plus l'effet est marqué. (3) transform-style: preserve-3d pour que les enfants conservent leur position 3D (un cube, un retournement). (4) backface-visibility: hidden pour cacher le DOS d'un élément — la classique carte qui se RETOURNE (flip recto/verso). (5) L'ordre des fonctions transform compte ; transform-origin. (6) Performance : transform et opacity sont COMPOSABLES (GPU, pas de reflow) ; will-change avec parcimonie. (7) DÉMO prévisualisable : une carte qui se retourne en 3D au survol — invite « 👁 Aperçu » (et respecte prefers-reduced-motion).
Pièges : oublier perspective (effet « plat ») ; preserve-3d manquant (enfants aplatis) ; will-change permanent (coûteux) ; transform-origin non maîtrisé.
Pour aller plus loin : les animations 3D liées au scroll (leçon 8), les carrousels/cartes 3D, la composition GPU, l'accessibilité du mouvement.
Exercices : (1) appliquer une perspective et un rotateY au survol ; (2) construire une carte recto/verso avec backface-visibility ; (3) expliquer le rôle de preserve-3d.`,
  },
  { num: '08', modNum: '03', modName: 'Mouvement & effets visuels', durationMin: 30, title: 'Animations modernes : @property et scroll-driven', prereq: 'Leçon 07 recommandée',
    brief: `Sujet : animer plus loin que les transitions classiques.
Sections : (1) @property : TYPER une variable CSS pour pouvoir l'ANIMER. Ex. @property --angle { syntax: "&lt;angle&gt;"; inherits: false; initial-value: 0deg; } permet d'animer un dégradé conique qui tourne (sans @property, la variable « saute » au lieu d'interpoler). (2) Rappel @keyframes / animation, puis les fonctions d'easing modernes (linear() pour des courbes personnalisées). (3) Les SCROLL-DRIVEN ANIMATIONS : animation-timeline: scroll() lie la progression d'une animation au DÉFILEMENT (barre de progression de lecture) ; view() déclenche selon l'entrée d'un élément dans la vue, avec animation-range — des révélations à l'apparition, SANS JavaScript. (4) scroll-snap (scroll-snap-type, scroll-snap-align) pour un défilement par paliers (carrousels). (5) prefers-reduced-motion : IMPÉRATIF de prévoir une version réduite. (6) DÉMO prévisualisable : un dégradé conique animé via une variable typée @property — invite « 👁 Aperçu ».
Pièges : animer une variable NON typée (saut au lieu d'interpolation — d'où @property) ; scroll-driven sans repli/support ; oublier prefers-reduced-motion ; scroll-snap trop agressif.
Pour aller plus loin : la View Transitions API (mention, côté JS), animer une hauteur via grid/clamp, les keyframes par pourcentage, Houdini (leçon 12).
Exercices : (1) typer une variable d'angle avec @property et l'animer ; (2) créer une barre de progression liée au scroll ; (3) ajouter scroll-snap à un carrousel horizontal.`,
  },
  { num: '09', modNum: '03', modName: 'Mouvement & effets visuels', durationMin: 28, title: 'Filtres, fusion, découpe et masques', prereq: 'Leçon 08 recommandée',
    brief: `Sujet : les effets graphiques avancés du CSS.
Sections : (1) filter : blur(), brightness(), contrast(), grayscale(), saturate(), hue-rotate(), et drop-shadow() (une ombre qui épouse la FORME réelle, contrairement à box-shadow rectangulaire). (2) backdrop-filter : flouter/altérer ce qui est DERRIÈRE un élément — l'effet « verre dépoli » (glassmorphism). (3) mix-blend-mode (fusion d'un élément avec l'arrière-plan : multiply, screen, overlay…) et background-blend-mode. (4) clip-path : DÉCOUPER une forme — inset(), circle(), polygon(), path() — pour des formes non rectangulaires et des révélations. (5) mask / mask-image : masquer avec un dégradé ou une image (fondu en bord, icônes monochromes recolorables). (6) Mention de shape-outside (habiller du texte autour d'une forme). (7) DÉMO prévisualisable : un panneau « verre dépoli » (backdrop-filter) et une image découpée en polygon() — invite « 👁 Aperçu ».
Pièges : backdrop-filter sans support ou sans contenu derrière (effet invisible) ; filtres COÛTEUX surtout animés ; clip-path qui coupe aussi l'ombre ; le support/syntaxe de mask (préfixes selon navigateurs).
Pour aller plus loin : les masques en dégradé pour des fondus, les filtres SVG (filter: url(#id)), drop-shadow vs box-shadow, le contraste à préserver sous un blend-mode.
Exercices : (1) créer un panneau « verre dépoli » avec backdrop-filter ; (2) découper une image en cercle puis en polygone ; (3) appliquer un fondu de bord avec un masque en dégradé.`,
  },
  { num: '10', modNum: '04', modName: 'Architecture, accessibilité & performance', durationMin: 28, title: 'Nesting natif, @scope et architecture', prereq: 'Module 3 recommandé',
    brief: `Sujet : structurer un CSS moderne, lisible et encapsulé, sans préprocesseur.
Sections : (1) Le NESTING NATIF : imbriquer les règles comme en Sass, mais nativement — .carte { & .titre { ... } &:hover { ... } } ; le rôle du & (référence au parent) ; imbriquer aussi les media et container queries. (2) Garder une SPÉCIFICITÉ PLATE malgré l'imbrication (ne pas empiler les niveaux). (3) @scope : limiter des styles à un SOUS-ARBRE — @scope (.carte) to (.contenu) { ... } encapsule sans fuite et gère la « proximité ». (4) Rappel de @layer (leçon 1) pour ordonner les couches d'architecture. (5) Les stratégies aujourd'hui : BEM, utilitaires, CSS-in-JS — et comment le natif (nesting, @layer, @scope, variables) remplace une partie des préprocesseurs. (6) Organiser : tokens (variables), base, composants, utilitaires ; conventions de nommage. (7) DÉMO prévisualisable : un composant écrit en nesting natif — invite « 👁 Aperçu ».
Pièges : la SUR-imbrication (spécificité qui grimpe, illisibilité) ; le & mal placé ; @scope/nesting sans support (prévoir un repli ou un build) ; confondre le & du CSS natif et celui de Sass (différences subtiles).
Pour aller plus loin : Sass/PostCSS sont-ils encore utiles, les design tokens, ITCSS / Cube CSS, @scope avancé (limite « to »).
Exercices : (1) réécrire un composant en nesting natif ; (2) limiter un style à un sous-arbre avec @scope ; (3) proposer une organisation en couches @layer pour un design system.`,
  },
  { num: '11', modNum: '04', modName: 'Architecture, accessibilité & performance', durationMin: 28, title: 'Propriétés logiques, préférences & robustesse', prereq: 'Leçon 10 recommandée',
    brief: `Sujet : un CSS internationalisé, adaptatif aux préférences et résilient.
Sections : (1) Les PROPRIÉTÉS LOGIQUES : margin-inline / margin-block, padding-inline, inset, border-start-start-radius, et les valeurs start/end — au lieu de left/right/top/bottom. Elles suivent automatiquement la DIRECTION et le mode d'écriture (RTL, vertical). (2) writing-mode et direction (rappel i18n). (3) Les MEDIA FEATURES de préférence : prefers-color-scheme (thème clair/sombre avec color-scheme), prefers-reduced-motion, prefers-contrast, prefers-reduced-transparency. (4) forced-colors (mode contraste élevé) et forced-color-adjust : ne pas casser l'accessibilité dans ce mode. (5) Les FEATURE QUERIES @supports : @supports (display: grid) ou @supports selector(:has(*)) pour une AMÉLIORATION PROGRESSIVE et des replis propres. (6) accent-color et color-scheme pour des contrôles natifs cohérents. (7) DÉMO prévisualisable : une boîte en propriétés logiques qui se réagence en dir="rtl" — invite « 👁 Aperçu ».
Pièges : coder en left/right (casse en RTL) ; ignorer prefers-reduced-motion ; écraser les couleurs système en forced-colors ; @supports mal parenthésé.
Pour aller plus loin : le RTL complet, les modes d'écriture verticaux, l'amélioration progressive comme philosophie, tester les préférences système dans les DevTools.
Exercices : (1) convertir des marges left/right en propriétés logiques ; (2) adapter un composant au mode sombre via prefers-color-scheme ; (3) fournir un repli avec @supports.`,
  },
  { num: '12', modNum: '04', modName: 'Architecture, accessibilité & performance', durationMin: 30, title: 'Performance, containment & synthèse', prereq: 'Leçon 11 recommandée',
    brief: `Sujet : un CSS rapide — et synthèse du cours.
Sections : (1) Le COÛT du rendu : style, layout (reflow), paint, composite. Règle d'or : animer transform/opacity (composite, GPU) plutôt que width/height/top (reflow). (2) contain : layout / paint / size / content pour ISOLER une sous-arborescence et limiter les recalculs ; content-visibility: auto + contain-intrinsic-size pour NE PAS rendre le hors-écran (gros gain sur les longues pages). (3) will-change : créer une couche seulement au besoin, pas en permanence. (4) Réduire la portée des sélecteurs coûteux ; limiter les ombres/filtres/backdrop animés. (5) Mention de CSS HOUDINI : les Custom Properties typées (@property, déjà vu), la Paint API (paintWorklet) pour dessiner des fonds en JS, le Typed OM — l'avenir extensible du CSS. (6) Outiller : l'onglet Rendering/Performance des DevTools pour repérer les reflows et les couches. (7) &lt;h2&gt;Et après&lt;/h2&gt; : tu maîtrises le CSS moderne et avancé ; combine-le avec JavaScript (View Transitions, animations pilotées) et un vrai design system. Encourage.
Remplace « Pièges fréquents » par une CHECKLIST DE PERFORMANCE (à puces). GARDE « Pour aller plus loin », « Récap et vérification » et « Exercices ».
Exercices : (1) repérer une animation qui provoque un reflow et la corriger en transform ; (2) appliquer content-visibility à une longue liste ; (3) établir une checklist de performance CSS en 5 points.`,
  },
];

log('Rédaction de ' + SPECS.length + ' leçons (CSS avancé)…');

const results = await pipeline(
  SPECS,
  (s) =>
    agent(
      INSTRUCTIONS +
        '\n\n=== LEÇON À RÉDIGER ===\nNuméro : ' + s.num + ' | Module ' + s.modNum + ' (' + s.modName + ')\nTitre : ' + s.title +
        '\n\nBRIEF DÉTAILLÉ (intègre fidèlement le contenu et les exemples ; rends les démos visuelles prévisualisables ; échappe les balises) :\n' + s.brief,
      { label: 'écrit L' + s.num, phase: 'Rédaction', schema: SCHEMA }
    ),
  (parts, s) =>
    agent(
      INSTRUCTIONS +
        '\n\n=== RELECTURE CRITIQUE (corrige et renvoie la version finale, même schéma) ===\nLeçon ' + s.num + ' « ' + s.title + ' ».\n' +
        '1. EXACTITUDE du CSS moderne (@layer, :has/:is/:where, oklch/color-mix, subgrid, container queries, transform 3D, @property/scroll-driven, filtres/masques, nesting/@scope, propriétés logiques/préférences, containment selon la leçon).\n' +
        '2. APERÇU : les effets VISUELS sont des blocs language-markup avec un &lt;style&gt; échappé (prévisualisables) ; les règles isolées en language-css.\n' +
        '3. ÉCHAPPEMENT : DANS les blocs de code, « < »→« &lt; », « > »→« &gt; » (dont le combinateur enfant « &gt; » et syntax: "&lt;angle&gt;"), « & »→« &amp; ». Aucune balise réelle dans un &lt;code&gt;.\n' +
        '4. STRUCTURE : intro, 5–8 sections <h2>, Pièges fréquents (sauf L12 : checklist de performance), Pour aller plus loin, Récap et vérification (lesson-check), Exercices (3 avec solutions).\n' +
        '5. Public AVANCÉ : pas de réexplication des bases ; amélioration progressive/@supports si pertinent ; aucun style/script réel dans la page (les &lt;style&gt;/&lt;script&gt; n\'apparaissent qu\'échappés dans des blocs de code).\n\n' +
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
