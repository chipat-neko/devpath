export const meta = {
  name: 'syntaxe-css',
  description: 'Rédige les leçons CSS 02 à 15 (cours complet) et assemble le HTML',
  phases: [{ title: 'Rédaction' }, { title: 'Relecture' }],
};

function buildLesson(p) {
  const objectives = p.objectives.map((o) => '                  <li>' + o + '</li>').join('\n');
  return `<!DOCTYPE html>
<html lang="fr" data-theme="light">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${p.title} — Leçon ${p.num} · CSS · Syntaxe</title>
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

  <body data-course="css" data-lesson="lecon-${p.num}.html">
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
            <li><a href="cours.html">CSS</a></li>
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
                <span class="dot-sep"><span class="pill pill--debutant">Débutant</span></span>
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
  </body>
</html>
`;
}

const ICON_NOTE = '<svg class="callout__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M12 8h.01M11 12h1v4h1" /></svg>';
const ICON_WARN = '<svg class="callout__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" /><path d="M12 9v4M12 17h.01" /></svg>';
const ICON_TIP = '<svg class="callout__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12c.7.7 1 1.2 1 2h6c0-.8.3-1.3 1-2a7 7 0 0 0-4-12Z" /></svg>';
const ICON_MORE = '<svg class="callout__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 3v14M5 10l7 7 7-7M5 21h14" /></svg>';

const INSTRUCTIONS = `Tu rédiges une leçon du cours « CSS : mettre en forme le web » (site Syntaxe). Public : DÉBUTANTS.
La leçon 1 a déjà posé : le rôle du CSS, comment le relier (link), l'anatomie d'une règle (sélecteur { propriété: valeur }),
les sélecteurs de base (balise, .classe, #id) et quelques propriétés. L'apprenant connaît aussi les bases du HTML.
Français, tutoiement, ton clair et visuel, du connu vers l'inconnu.

ATOUT MAJEUR — APERÇU EN DIRECT : un bouton « 👁 Aperçu » sur les blocs HTML rend le code dans une iframe.
Pour montrer un EFFET VISUEL (couleur, boîte, flexbox, grid, animation…), écris un bloc
<figure class="code-block" data-file="demo.html"><pre><code class="language-markup"> qui contient une PETITE structure HTML ET un &lt;style&gt; (le tout ÉCHAPPÉ), afin que « 👁 Aperçu » affiche le résultat stylé.
Pour une règle de RÉFÉRENCE isolée, un bloc class="language-css" suffit (coloré, mais non prévisualisable).
Invite explicitement (au moins une fois, via un encadré Astuce) à cliquer « 👁 Aperçu » et à modifier les valeurs.

TU PRODUIS UNIQUEMENT { metaDesc, objectives, body } :
- metaDesc : ~150 caractères.
- objectives : 3 à 4 chaînes (« savoir faire X »), HTML inline autorisé (<code>, <strong>). «&nbsp;;» puis «.» pour la dernière.
- body : HTML INTÉRIEUR de <article class="prose"> (sans la balise article, sans bouton « terminer », sans nav).

STRUCTURE (≈1200–1700 mots) : 1–2 <p> d'intro ; 5–8 sections <h2> (chacune avec un exemple, souvent prévisualisable) ;
<h2>Pièges fréquents</h2> ; <h2>Pour aller plus loin</h2> ; <h2>Récap et vérification</h2> (résumé <ul> + lesson-check) ;
<h2>Exercices</h2> (3 gradués avec solutions repliables).

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
sont échappés ; le CSS lui-même contient rarement < ou &, mais le combinateur enfant « > » s'écrit « &gt; » et « &amp;&amp; » n'existe pas en CSS.

RÈGLES : CSS MODERNE et correct. Pas de style= / <style> / <script> RÉELS dans la page (ton body = prose + blocs de code ;
les &lt;style&gt; n'apparaissent qu'ÉCHAPPÉS, à l'intérieur de blocs de code). Exemples accessibles (contraste correct).`;

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
  { num: '02', modNum: '01', modName: 'Fondations', durationMin: 28, title: 'Les sélecteurs en profondeur', prereq: 'Leçon 01 recommandée',
    brief: `Sujet : cibler précisément les éléments à styler.
Sections : (1) Rappel des sélecteurs simples (balise, .classe, #id, universel *) et le groupage (h1, h2 { ... }). (2) Les COMBINATEURS : descendant (espace : "article p"), enfant direct (&gt; : "ul &gt; li"), frère adjacent (+), frère général (~). (3) Les sélecteurs d'ATTRIBUT : [type="email"], [href^="https"] (commence par), [href$=".pdf"] (finit par), [class*="btn"] (contient). (4) Les PSEUDO-CLASSES d'état (:hover, :focus, :active, :checked, :disabled) et structurelles (:first-child, :last-child, :nth-child(2n), :not(...)). (5) Les PSEUDO-ÉLÉMENTS : ::before et ::after (avec content), ::first-line, ::selection, ::placeholder. (6) Une DÉMO prévisualisable : une liste où :hover et :nth-child colorent les éléments — invite « 👁 Aperçu ».
Pièges : confondre pseudo-classe (:hover, un deux-points) et pseudo-élément (::before, deux deux-points) ; oublier content sur ::before ; sélecteurs trop génériques ; espace (descendant) vs &gt; (enfant) confondus.
Pour aller plus loin : :is()/:where() et :has() (cours CSS avancé), la performance des sélecteurs, nth-child avancé.
Exercices : (1) cibler les liens externes avec [href^="http"] ; (2) colorer une ligne sur deux avec :nth-child ; (3) ajouter une puce personnalisée avec ::before et content.`,
  },
  { num: '03', modNum: '01', modName: 'Fondations', durationMin: 28, title: 'Cascade, spécificité et héritage', prereq: 'Leçon 02 recommandée',
    brief: `Sujet : comprendre QUELLE règle gagne quand plusieurs s'appliquent.
Sections : (1) La CASCADE : quand plusieurs règles ciblent un élément, le navigateur les départage par origine, puis SPÉCIFICITÉ, puis ORDRE d'apparition (la dernière gagne, à spécificité égale). (2) La SPÉCIFICITÉ : un score (id, classe, type). Un #id (1-0-0) bat une .classe (0-1-0) qui bat une balise (0-0-1). Le style inline est encore plus fort (à éviter). Donner des exemples chiffrés. (3) !important : surcharge tout — à ÉVITER (casse la cascade) sauf cas rares. (4) L'HÉRITAGE : certaines propriétés (color, font-family, line-height) se transmettent des parents aux enfants ; d'autres non (margin, border…). Les mots-clés inherit, initial, unset, revert. (5) Une DÉMO prévisualisable montrant qu'une classe l'emporte sur une balise, et qu'un id l'emporte sur la classe.
Pièges : se battre avec !important au lieu de revoir la spécificité ; spécificité trop forte (id) difficile à surcharger ; croire que tout s'hérite ; ordre des règles ignoré.
Pour aller plus loin : les couches de cascade @layer (cours CSS avancé), la spécificité de :where() (zéro), garder une spécificité basse et plate.
Exercices : (1) calculer la spécificité de 3 sélecteurs ; (2) prédire la couleur d'un élément ciblé par 2 règles concurrentes ; (3) corriger un conflit sans recourir à !important.`,
  },
  { num: '04', modNum: '01', modName: 'Fondations', durationMin: 26, title: 'Couleurs et unités', prereq: 'Leçon 03 recommandée',
    brief: `Sujet : exprimer couleurs et tailles.
Sections : (1) Les COULEURS : noms (red), hexadécimal (#3a76c2, #fff), rgb()/rgba() (avec alpha), hsl()/hsla() (teinte, saturation, luminosité — pratique pour décliner), currentColor, transparent. (2) Les UNITÉS ABSOLUES : px (pixels). (3) Les UNITÉS RELATIVES À LA POLICE : em (relatif à la taille du parent) et rem (relatif à la racine html — à privilégier pour les tailles de texte). (4) Les unités RELATIVES AU CONTENEUR/VUE : % (du parent), vw/vh (de la fenêtre), ch (largeur d'un « 0 », pour la mesure de lecture). (5) Quand utiliser quoi : rem pour le texte et l'espacement cohérent, % et fr pour la mise en page, px pour les bordures fines. (6) Une DÉMO prévisualisable comparant em vs rem, ou des fonds en hsl.
Pièges : tout en px (peu accessible : ne respecte pas le zoom texte) ; confondre em (cumulatif) et rem ; oublier l'alpha ; vh sur mobile (barre d'adresse).
Pour aller plus loin : hsl pour créer une palette, les fonctions de couleur modernes (oklch, color-mix — cours avancé), clamp() pour des tailles fluides (leçon 13).
Exercices : (1) définir une couleur en hsl et sa variante plus claire ; (2) régler une taille de texte en rem ; (3) limiter la largeur d'un paragraphe à ~65ch.`,
  },
  { num: '05', modNum: '02', modName: 'Le texte et la boîte', durationMin: 30, title: 'Le modèle de boîte', prereq: 'Module 1 recommandé',
    brief: `Sujet : LA notion fondamentale de mise en page.
Sections : (1) Chaque élément est une BOÎTE composée de 4 couches : le CONTENU, le PADDING (remplissage intérieur), la BORDER (bordure), la MARGIN (marge extérieure). (2) padding et margin : les 4 côtés (padding: 10px 20px ; margin: 0 auto pour centrer un bloc de largeur fixe). (3) border : width style color, et border-radius. (4) LE PIÈGE HISTORIQUE et sa solution : par défaut width ne compte QUE le contenu (le padding/border s'ajoutent). box-sizing: border-box fait que width inclut padding+border — on le met souvent sur * { box-sizing: border-box }. (5) La FUSION DES MARGES verticales (margin collapse). (6) overflow (visible/hidden/auto/scroll). (7) display: block / inline / inline-block (rappel et impact sur la boîte). (8) Une DÉMO prévisualisable d'une boîte avec padding/border/margin visibles — invite « 👁 Aperçu » et à changer box-sizing.
Pièges : oublier box-sizing: border-box (largeurs qui débordent) ; padding sur un inline (vertical sans effet sur le flux) ; marges qui fusionnent ; margin: auto sans largeur définie.
Pour aller plus loin : les propriétés logiques (margin-inline, padding-block — cours avancé), min/max-width, le contexte de bloc (BFC).
Exercices : (1) créer une carte avec padding et border-radius ; (2) centrer un bloc de 600px avec margin auto ; (3) montrer la différence de largeur avec et sans border-box.`,
  },
  { num: '06', modNum: '02', modName: 'Le texte et la boîte', durationMin: 28, title: 'La typographie', prereq: 'Leçon 05 recommandée',
    brief: `Sujet : mettre en forme le texte.
Sections : (1) font-family et les PILES de polices (font-family: "Inter", system-ui, sans-serif) ; les polices web (Google Fonts via &lt;link&gt;, ou @font-face). (2) font-size (en rem), font-weight (400/700, bold), font-style (italic), la propriété raccourcie font. (3) line-height (hauteur de ligne, ~1.5 pour le corps — sans unité de préférence). (4) letter-spacing, word-spacing. (5) text-align (left/center/right/justify), text-decoration (underline, none), text-transform (uppercase, capitalize), text-indent. (6) La MESURE de lecture (largeur en ch). (7) white-space, text-overflow: ellipsis. (8) Une DÉMO prévisualisable d'un bloc de texte stylé (titre + paragraphe).
Pièges : line-height avec une unité (px) qui ne s'adapte pas ; justify qui crée des « rivières » ; texte trop petit (&lt; 16px corps) ; trop de familles ; majuscules sans letter-spacing.
Pour aller plus loin : @font-face et font-display, les variable fonts, la fluidité avec clamp() (leçon 13), text-wrap: balance.
Exercices : (1) appliquer une pile de polices avec repli ; (2) régler un line-height confortable ; (3) tronquer un texte trop long avec ellipsis.`,
  },
  { num: '07', modNum: '02', modName: 'Le texte et la boîte', durationMin: 28, title: 'Arrière-plans, bordures et ombres', prereq: 'Leçon 06 recommandée',
    brief: `Sujet : décorer les boîtes.
Sections : (1) background-color (rappel). (2) background-image : url("...") ; background-size (cover/contain/valeur), background-position, background-repeat, background-attachment. (3) Les DÉGRADÉS sont des images : linear-gradient(to right, #a, #b), radial-gradient(...), conic-gradient(...). On peut superposer plusieurs fonds. (4) Les BORDURES : border (raccourci), border-radius (coins arrondis, 50% pour un cercle), bordures individuelles. (5) Les OMBRES : box-shadow (offset-x offset-y flou étalement couleur, inset pour intérieure), text-shadow. (6) outline (vs border, ne prend pas de place — utile pour le focus). (7) Une DÉMO prévisualisable : une jolie carte (fond dégradé, border-radius, box-shadow) — invite « 👁 Aperçu ».
Pièges : confondre background (raccourci) et background-color ; oublier background-size: cover ; box-shadow trop forte (effet « flottant » générique) ; supprimer outline du focus sans remplacement (accessibilité).
Pour aller plus loin : les fonds multiples, les motifs en CSS, filter et backdrop-filter (cours avancé), les bordures en image (border-image).
Exercices : (1) appliquer un dégradé linéaire en fond ; (2) arrondir une image en cercle ; (3) ajouter une ombre douce à une carte.`,
  },
  { num: '08', modNum: '03', modName: 'La mise en page', durationMin: 30, title: 'Le flux, display et position', prereq: 'Module 2 recommandé',
    brief: `Sujet : comment les éléments se placent.
Sections : (1) Le FLUX NORMAL : les éléments block s'empilent verticalement (toute la largeur), les inline se suivent horizontalement. (2) display : block, inline, inline-block (taille + suit le flux horizontal), none (retire du flux). (3) La propriété POSITION : static (par défaut, dans le flux) ; relative (décalé par rapport à sa position, top/left… ; sert aussi d'ancrage) ; absolute (RETIRÉ du flux, positionné par rapport au plus proche parent « positionné ») ; fixed (par rapport à la fenêtre) ; sticky (collant : normal puis fixé au défilement). (4) top/right/bottom/left et z-index (empilement). (5) float (héritage, brève mention — éviter pour la mise en page moderne). (6) Une DÉMO prévisualisable : un badge en position absolute sur une carte, ou un en-tête sticky.
Pièges : absolute sans parent positionné (se cale sur la page) ; z-index sans position ; sticky sans top défini ou parent à overflow caché ; utiliser float pour la mise en page (préférer Flexbox/Grid).
Pour aller plus loin : le contexte d'empilement (stacking context), Flexbox et Grid (leçons suivantes) pour la vraie mise en page, position: sticky en pratique.
Exercices : (1) placer un badge « Nouveau » en haut à droite d'une carte (absolute) ; (2) rendre un en-tête sticky ; (3) expliquer la différence entre relative et absolute.`,
  },
  { num: '09', modNum: '03', modName: 'La mise en page', durationMin: 32, title: 'Flexbox', prereq: 'Leçon 08 recommandée',
    brief: `Sujet : disposer des éléments sur UNE dimension (ligne OU colonne).
Sections : (1) display: flex sur le CONTENEUR : ses enfants deviennent des éléments flex alignés en ligne. (2) flex-direction (row/column/…-reverse) : l'axe principal. (3) Distribuer sur l'axe principal : justify-content (flex-start, center, space-between, space-around, space-evenly). (4) Aligner sur l'axe transversal : align-items (stretch, center, flex-start, flex-end, baseline). (5) gap (espacement entre éléments — moderne, remplace les marges). (6) flex-wrap (passer à la ligne). (7) Sur les ENFANTS : flex-grow / flex-shrink / flex-basis (et le raccourci flex: 1), align-self, order. (8) Une DÉMO prévisualisable : une barre de navigation (logo à gauche, liens à droite) et une rangée de cartes — invite « 👁 Aperçu » et à changer justify-content.
Pièges : confondre justify-content (axe principal) et align-items (axe transversal) ; oublier que les propriétés vont sur le CONTENEUR ou l'ENFANT selon le cas ; flex: 1 vs width ; marges au lieu de gap.
Pour aller plus loin : flex vs grid (quand l'un, quand l'autre), flex-basis et le contenu intrinsèque, l'alignement avec place-content.
Exercices : (1) centrer parfaitement un élément (justify + align center) ; (2) faire une barre logo/menu avec space-between ; (3) une rangée de 3 cartes de largeur égale (flex: 1).`,
  },
  { num: '10', modNum: '03', modName: 'La mise en page', durationMin: 32, title: 'CSS Grid', prereq: 'Leçon 09 recommandée',
    brief: `Sujet : disposer des éléments sur DEUX dimensions (lignes ET colonnes).
Sections : (1) display: grid sur le conteneur. (2) Définir les COLONNES : grid-template-columns (ex. 200px 1fr 1fr ; l'unité fr = fraction de l'espace libre) ; grid-template-rows. (3) repeat() et minmax() : repeat(3, 1fr), repeat(auto-fill, minmax(200px, 1fr)) (grille responsive sans media query !). (4) gap (espacement). (5) Placer les éléments : grid-column / grid-row (span 2, lignes nommées), grid-template-areas (zones nommées, très lisible). (6) Aligner : justify-items / align-items, justify-content / align-content. (7) Une DÉMO prévisualisable : une galerie responsive en auto-fill minmax, et un layout en zones nommées (header/sidebar/main/footer) — invite « 👁 Aperçu ».
Pièges : confondre les propriétés du conteneur et des éléments ; oublier fr (tout en px = non flexible) ; areas mal alignées (toutes les lignes même nombre de colonnes) ; vouloir tout faire en Grid là où Flexbox suffit.
Pour aller plus loin : subgrid, le placement automatique (grid-auto-flow: dense), Grid + Flexbox combinés, masonry (cours avancé).
Exercices : (1) une grille responsive de cartes avec auto-fill/minmax ; (2) un layout en grid-template-areas ; (3) faire qu'un élément occupe 2 colonnes (span).`,
  },
  { num: '11', modNum: '04', modName: 'Responsive & dynamique', durationMin: 30, title: 'Le responsive (media queries)', prereq: 'Module 3 recommandé',
    brief: `Sujet : adapter la page à toutes les tailles d'écran.
Sections : (1) Le responsive : une même page qui s'adapte au téléphone, à la tablette, au bureau. La base : &lt;meta name="viewport" content="width=device-width, initial-scale=1"&gt; (rappel HTML). (2) Les MEDIA QUERIES : @media (min-width: 768px) { ... } applique des styles à partir d'une largeur. min-width (mobile-first) vs max-width. (3) L'approche MOBILE-FIRST : on écrit d'abord le style mobile (par défaut), puis on AJOUTE des règles pour les écrans plus larges avec min-width. (4) Choisir des POINTS DE RUPTURE selon le contenu (pas selon des appareils précis). (5) Les unités FLUIDES qui réduisent le besoin de media queries : %, fr, clamp() (leçon 13), auto-fill/minmax (grid). (6) Les media features utiles : (prefers-color-scheme), (orientation), (prefers-reduced-motion). (7) Une DÉMO prévisualisable : une grille qui passe de 1 à 3 colonnes selon la largeur (l'iframe d'aperçu est étroite : montrer le code mobile-first) — invite « 👁 Aperçu ».
Pièges : oublier la balise viewport (zoom sur mobile) ; desktop-first (max-width) plus dur à maintenir ; points de rupture « par appareil » ; media queries là où une unité fluide suffirait.
Pour aller plus loin : container queries (@container — cours avancé) qui s'adaptent au CONTENEUR et non à la fenêtre, les images responsives (HTML), le responsive typography.
Exercices : (1) passer une mise en page d'une à deux colonnes au-delà de 600px ; (2) écrire une media query mobile-first ; (3) adapter un menu (vertical sur mobile, horizontal sur grand écran).`,
  },
  { num: '12', modNum: '04', modName: 'Responsive & dynamique', durationMin: 30, title: 'Transitions et animations', prereq: 'Leçon 11 recommandée',
    brief: `Sujet : donner du mouvement.
Sections : (1) Les TRANSITIONS : animer le passage d'un état à un autre (ex. au :hover). transition: propriété durée fonction-de-timing délai (ex. transition: background-color 0.2s ease). On peut animer plusieurs propriétés. (2) Les FONCTIONS DE TIMING : ease, linear, ease-in-out, cubic-bezier(...). (3) Les TRANSFORMATIONS : transform: translate(x,y) / scale() / rotate() / skew() — performantes (n'affectent pas le flux), parfaites à animer. (4) Les ANIMATIONS par images-clés : @keyframes nom { from {…} to {…} } (ou 0%/50%/100%) puis animation: nom durée iteration-count direction fill-mode. (5) L'ACCESSIBILITÉ : @media (prefers-reduced-motion: reduce) pour réduire/supprimer les animations. (6) Une DÉMO prévisualisable : un bouton qui change au survol (transition) et un élément animé en boucle (keyframes) — invite « 👁 Aperçu ».
Pièges : animer des propriétés coûteuses (width/height/top) au lieu de transform/opacity (saccades) ; transition sans état de départ ; animations trop longues/agressives ; ignorer prefers-reduced-motion.
Pour aller plus loin : will-change, les animations 3D (perspective — cours avancé), les scroll-driven animations (cours avancé), animer une hauteur (grid).
Exercices : (1) faire grandir une carte au survol avec transform: scale ; (2) écrire une animation de pulsation en @keyframes ; (3) respecter prefers-reduced-motion.`,
  },
  { num: '13', modNum: '04', modName: 'Responsive & dynamique', durationMin: 28, title: 'Les variables CSS et calc()', prereq: 'Leçon 12 recommandée',
    brief: `Sujet : un CSS plus maintenable et dynamique.
Sections : (1) Les CUSTOM PROPERTIES (variables) : on les déclare avec un double tiret (--couleur-accent: #2540f0) et on les lit avec var(--couleur-accent). (2) On les place souvent sur :root (portée globale) ; elles SUIVENT la cascade et l'héritage (on peut les redéfinir localement). (3) Valeur de repli : var(--x, valeur-par-defaut). (4) Pourquoi : centraliser couleurs/espacements (un thème), éviter la répétition, créer un thème clair/sombre (redéfinir les variables sous une classe ou un media query). (5) calc() : mêler les unités (width: calc(100% - 2rem)). (6) min(), max(), clamp(valeur-min, idéale, valeur-max) — une taille FLUIDE bornée (ex. font-size: clamp(1rem, 2.5vw, 1.5rem)). (7) Une DÉMO prévisualisable : un mini design system avec des variables + un titre en clamp() — invite « 👁 Aperçu » et à changer une variable.
Pièges : oublier le double tiret ou le var() ; croire que les variables CSS sont comme en Sass (elles sont DYNAMIQUES, lues à l'exécution) ; clamp avec min &gt; max ; calc sans espaces autour des opérateurs.
Pour aller plus loin : les thèmes clair/sombre avec variables, @property (cours avancé) pour typer une variable et l'animer, les variables dans les media queries.
Exercices : (1) définir 3 variables sur :root et les utiliser ; (2) une largeur en calc(100% - 40px) ; (3) une taille de titre fluide avec clamp().`,
  },
  { num: '14', modNum: '05', modName: 'Organisation & qualité', durationMin: 28, title: 'Organiser son CSS (méthodologies)', prereq: 'Module 4 recommandé',
    brief: `Sujet : garder un CSS lisible quand le projet grandit.
Sections : (1) Le problème : sans organisation, le CSS devient un enchevêtrement où l'on n'ose plus rien changer (peur des régressions). (2) NOMMER ses classes : des noms qui décrivent le RÔLE (.carte, .bouton--primaire) pas l'apparence (.rouge). (3) La méthode BEM : Bloc, Élément (bloc__element), Modificateur (bloc--modifieur) — ex. .carte, .carte__titre, .carte--mise-en-avant. Avantage : des classes plates (faible spécificité), pas de conflits. (4) Garder une SPÉCIFICITÉ BASSE ET PLATE (surtout des classes, éviter id et imbrication profonde). (5) Découper le CSS en fichiers par rôle (variables, base, composants, utilitaires) — comme ce site (variables/base/layout/components/pages). (6) Les classes UTILITAIRES (une classe = une propriété, ex. .text-center) en bref. (7) Commentaires et sections.
Pièges : nommer par l'apparence (.bleu) ; imbrication/spécificité qui explose ; CSS « append-only » qu'on n'ose plus toucher ; sur-ingénierie pour un petit site.
Pour aller plus loin : ITCSS, le nesting CSS natif (cours avancé), @layer pour maîtriser la cascade (cours avancé), les approches utility-first (Tailwind), CSS Modules.
Exercices : (1) renommer des classes « apparence » en classes « rôle » ; (2) écrire un composant carte en BEM ; (3) proposer un découpage en fichiers pour un petit site.`,
  },
  { num: '15', modNum: '05', modName: 'Organisation & qualité', durationMin: 28, title: 'Bonnes pratiques & synthèse', prereq: 'Leçon 14 recommandée',
    brief: `Sujet : produire un CSS robuste — et synthèse du cours.
Sections : (1) Repartir sur une base saine : un petit RESET / normalize (ex. * { box-sizing: border-box; margin: 0 }) pour gommer les différences entre navigateurs. (2) Maîtriser la CASCADE (rappel) : spécificité basse, éviter !important, ordre logique. (3) DÉBOGUER dans les DevTools : l'inspecteur, voir les règles appliquées et lesquelles sont barrées, la box model, modifier en direct ; outline: 1px solid red pour visualiser les boîtes. (4) ACCESSIBILITÉ : contraste suffisant (AA), un focus VISIBLE (:focus-visible, ne jamais supprimer outline sans remplacement), respecter prefers-reduced-motion, ne pas coder l'info par la seule couleur. (5) PERFORMANCE : éviter les sélecteurs ultra-coûteux, animer transform/opacity, limiter les reflows. (6) &lt;h2&gt;Et après&lt;/h2&gt; : tu maîtrises le CSS moderne ; pour aller plus loin, le cours « CSS avancé » (couches de cascade, container queries, :has(), animations modernes…), et JavaScript pour l'interactivité.
Remplace « Pièges fréquents » par une CHECKLIST DE QUALITÉ (à puces). GARDE « Pour aller plus loin », « Récap et vérification » et « Exercices ».
Exercices : (1) écrire un petit reset (box-sizing + reset des marges) ; (2) rendre un focus bien visible et accessible ; (3) établir sa checklist CSS de fin de projet en 5 points.`,
  },
];

log('Rédaction de ' + SPECS.length + ' leçons (CSS)…');

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
        '1. EXACTITUDE du CSS moderne ; chaque démo doit être correcte.\n' +
        '2. APERÇU : les effets VISUELS sont des blocs language-markup avec un &lt;style&gt; échappé (prévisualisables) ; les règles isolées en language-css.\n' +
        '3. ÉCHAPPEMENT : DANS les blocs de code, « < »→« &lt; », « > »→« &gt; » (dont le combinateur enfant « &gt; »), « & »→« &amp; ». Aucune balise réelle dans un &lt;code&gt;.\n' +
        '4. STRUCTURE : intro, 5–8 sections <h2>, Pièges fréquents (sauf L15 : checklist), Pour aller plus loin, Récap et vérification (lesson-check), Exercices (3 avec solutions).\n' +
        '5. Aucun style/script réel dans la page (les &lt;style&gt; n\'apparaissent qu\'échappés dans des blocs de code).\n\n' +
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
