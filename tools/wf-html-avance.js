export const meta = {
  name: 'syntaxe-html-avance',
  description: 'Rédige les 12 leçons du cours « HTML avancé : le web platform moderne »',
  phases: [{ title: 'Rédaction' }, { title: 'Relecture' }],
};

function buildLesson(p) {
  const objectives = p.objectives.map((o) => '                  <li>' + o + '</li>').join('\n');
  return `<!DOCTYPE html>
<html lang="fr" data-theme="light">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${p.title} — Leçon ${p.num} · HTML avancé · Syntaxe</title>
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

  <body data-course="html-avance" data-lesson="lecon-${p.num}.html">
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
            <li><a href="cours.html">HTML avancé</a></li>
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

const INSTRUCTIONS = `Tu rédiges une leçon du cours « HTML avancé : le web platform moderne » (site Syntaxe). Public :
développeurs qui maîtrisent DÉJÀ le HTML (cours débutant→confirmé : structure, sémantique, formulaires,
accessibilité de base) et un peu de JavaScript et de CSS. NE réexplique pas les bases ; va vers l'avancé.
Français, tutoiement, ton précis et technique.

ATOUT : sur les blocs HTML, un bouton « 👁 Aperçu » rend le code en direct dans une iframe (qui autorise
les scripts) ; sur les blocs JS de logique pure, un bouton « ▶ Tester ». Écris des exemples HTML COMPLETS
et VISIBLES, et invite (une fois, via un encadré Astuce) à cliquer « 👁 Aperçu ». Quand une démo a besoin
de JavaScript (ex. dialog.showModal, custom element), tu peux inclure un &lt;script&gt; ÉCHAPPÉ dans le bloc
d'exemple HTML (language-markup) : l'aperçu l'exécutera.

TU PRODUIS UNIQUEMENT { metaDesc, objectives, body } :
- metaDesc : ~150 caractères.
- objectives : 3 à 4 chaînes (« savoir faire X »), HTML inline autorisé. «&nbsp;;» puis «.» pour la dernière.
- body : HTML INTÉRIEUR de <article class="prose"> (sans la balise article, sans bouton « terminer », sans nav).

STRUCTURE (≈1200–1700 mots) : 1–2 <p> d'intro ; 5–8 sections <h2> (avec exemples commentés) ; <h2>Pièges fréquents</h2> ;
<h2>Pour aller plus loin</h2> ; <h2>Récap et vérification</h2> (résumé <ul> + lesson-check) ; <h2>Exercices</h2> (3 gradués avec solutions).

COMPOSANTS (n'invente pas d'autres classes) :
- Code HTML : <figure class="code-block" data-file="index.html"><pre><code class="language-markup">CODE_ÉCHAPPÉ</code></pre></figure>.
- Code JS : class="language-javascript" ; Code CSS : class="language-css".
- Légende : <p class="code-caption">…</p>
- Note : <div class="callout callout--note">${ICON_NOTE}<div class="callout__body"><p class="callout__title">Note</p><p>…</p></div></div>
- Piège : <div class="callout callout--warn">${ICON_WARN}<div class="callout__body"><p class="callout__title">Piège fréquent</p><p>…</p></div></div>
- Astuce : <div class="callout callout--tip">${ICON_TIP}<div class="callout__body"><p class="callout__title">Astuce</p><p>…</p></div></div>
- Pour aller plus loin : <div class="callout callout--more">${ICON_MORE}<div class="callout__body"><p class="callout__title">Pour aller plus loin</p><p>…</p></div></div>
- Vérification : <div class="lesson-check"><p class="kicker kicker--gold">Vérifie ta compréhension</p><ol><li>…</li><li>…</li><li>…</li></ol></div>
- Exercice : <div class="exercise"><div class="exercise__head"><span class="exercise__num">Exercice 1</span><span class="exercise__level">Échauffement</span></div><p>…</p><details><summary>Voir une solution</summary><figure class="code-block" data-file="solution.html"><pre><code class="language-markup">…</code></pre></figure></details></div>

ÉCHAPPEMENT (CRITIQUE) : DANS un <code>, toute balise est échappée : « < »→« &lt; », « > »→« &gt; », « & »→« &amp; »
(donc « &amp;&amp; »). Aucune balise réelle ne doit traîner dans un bloc de code.

RÈGLES : HTML d'exemple VALIDE et ACCESSIBLE. Aucun attribut style= dans les exemples (classes ou &lt;style&gt; échappé).
Pas de <script>/<style>/style= RÉELS dans la page (ton body = prose + blocs de code).`;

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
  { num: '01', modNum: '01', modName: 'Éléments interactifs natifs', durationMin: 24, title: 'Divulgation progressive : details et summary', prereq: 'Cours HTML (bases) recommandé',
    brief: `Sujet : créer des sections repliables SANS JavaScript.
Sections : (1) &lt;details&gt;&lt;summary&gt;Titre cliquable&lt;/summary&gt;&lt;p&gt;Contenu caché&lt;/p&gt;&lt;/details&gt; : un widget de divulgation NATIF (clic, clavier, ARIA gérés automatiquement). (2) L'attribut open (ouvert par défaut) ; l'événement toggle (JS, mention). (3) Un ACCORDÉON exclusif : plusieurs &lt;details name="faq"&gt; partageant le même name ne s'ouvrent qu'un à la fois (fonctionnalité récente). (4) Styliser : le marqueur (triangle) via summary { list-style: none } ou ::marker, et personnaliser. (5) Cas d'usage : FAQ, détails techniques, contenu optionnel. EXEMPLE VISIBLE (une mini-FAQ) — invite « 👁 Aperçu » (c'est interactif dans l'aperçu).
Pièges : ajouter du JS là où le natif suffit ; oublier que summary doit être le PREMIER enfant ; styliser sans gérer le marqueur ; mettre des titres (h2) à la fois dans et hors summary.
Pour aller plus loin : animer l'ouverture (CSS récent), details comme base d'un menu, l'accessibilité native (rôle group/button).
Exercices : (1) créer un &lt;details&gt; replié par défaut ; (2) faire une FAQ de 3 questions ; (3) transformer la FAQ en accordéon exclusif avec name.`,
  },
  { num: '02', modNum: '01', modName: 'Éléments interactifs natifs', durationMin: 28, title: 'La modale native : l\'élément dialog', prereq: 'Leçon 01 recommandée',
    brief: `Sujet : la boîte de dialogue native &lt;dialog&gt;.
Sections : (1) &lt;dialog&gt;...&lt;/dialog&gt; : masqué par défaut. (2) L'ouvrir : dialog.showModal() (MODAL : bloque la page, piège le focus, ajoute ::backdrop, Échap ferme) vs dialog.show() (non modal). La fermer : dialog.close(valeur). (3) Un FORMULAIRE dans la modale : &lt;form method="dialog"&gt; ferme le dialog au submit et renseigne returnValue (= la value du bouton). (4) Styliser le fond avec ::backdrop. (5) Accessibilité : rôle dialog natif, aria-labelledby vers le titre, focus géré automatiquement. (6) EXEMPLE VISIBLE : un bouton qui ouvre une modale — inclure un petit &lt;script&gt; (échappé) appelant showModal() pour que l'aperçu fonctionne ; invite « 👁 Aperçu ».
Pièges : afficher dialog en CSS au lieu de showModal (perd le focus trap et ::backdrop) ; oublier un moyen de fermer ; ne pas associer de titre (a11y) ; show() au lieu de showModal() pour une vraie modale.
Pour aller plus loin : la gestion du focus de retour, l'animation d'ouverture/fermeture, dialog vs popover (leçon suivante).
Exercices : (1) écrire une modale avec un titre et un bouton fermer ; (2) y mettre un &lt;form method="dialog"&gt; ; (3) styliser le ::backdrop.`,
  },
  { num: '03', modNum: '01', modName: 'Éléments interactifs natifs', durationMin: 26, title: 'L\'API Popover et le menu', prereq: 'Leçon 02 recommandée',
    brief: `Sujet : les surcouches transitoires sans JavaScript.
Sections : (1) L'attribut popover : &lt;div popover id="info"&gt;...&lt;/div&gt; crée une surcouche cachée. (2) Le déclencheur DÉCLARATIF : &lt;button popovertarget="info"&gt;Afficher&lt;/button&gt; l'ouvre/ferme SANS JavaScript. popovertargetaction (show/hide/toggle). (3) popover="auto" (fermeture au clic extérieur et à Échap — « light dismiss ») vs "manual". (4) Styliser : le popover et son ::backdrop ; positionnement (anchor, mention). (5) popover vs &lt;dialog&gt; : popover = transitoire/non bloquant ; dialog modal = bloquant. Quand choisir quoi. (6) &lt;menu&gt; : sémantiquement une liste d'actions (équivalent &lt;ul&gt; pour des commandes). (7) EXEMPLE VISIBLE (un bouton + popover) — fonctionne dans l'aperçu SANS script ; invite « 👁 Aperçu ».
Pièges : confondre popover et dialog ; oublier que popovertarget suffit (pas besoin de JS) ; support navigateur récent (prévoir un repli) ; abuser des popover « manual ».
Pour aller plus loin : le positionnement par ancre (anchor positioning, CSS), les menus accessibles, l'état des navigateurs.
Exercices : (1) créer un popover déclenché par un bouton, sans JS ; (2) le passer en light-dismiss (auto) ; (3) décrire la différence d'usage entre popover et dialog.`,
  },
  { num: '04', modNum: '02', modName: 'Web Components', durationMin: 26, title: 'template et slot', prereq: 'Module 1 recommandé',
    brief: `Sujet : les patrons de contenu réutilisables.
Sections : (1) &lt;template&gt; : son contenu n'est NI rendu, NI exécuté tant qu'on ne le clone pas. Sert de PATRON HTML. (2) L'utiliser en JS : const tpl = document.querySelector("template"); const copie = tpl.content.cloneNode(true); document.body.append(copie); (bloc JS). (3) Pourquoi : générer des éléments répétés (cartes, lignes) à partir d'un modèle propre, plutôt que des chaînes HTML. (4) &lt;slot&gt; : un EMPLACEMENT à remplir, surtout dans les Web Components (leçon 5-6). slot nommé (name) et contenu projeté (slot="..."). (5) Contenu de repli d'un slot. (6) EXEMPLE : un &lt;template&gt; de carte + le JS qui le clone (« ▶ Tester » n'apparaît pas car le code touche au DOM — c'est normal ; l'exemple HTML, lui, se prévisualise).
Pièges : croire qu'un &lt;template&gt; s'affiche tout seul ; oublier cloneNode(true) (sinon contenu vide) ; manipuler template.content sans cloner ; slot hors d'un shadow DOM.
Pour aller plus loin : template + custom element (leçon suivante), la performance du clonage vs innerHTML, les slots nommés.
Exercices : (1) déclarer un &lt;template&gt; d'élément de liste ; (2) écrire le JS qui le clone 3 fois ; (3) ajouter un &lt;slot&gt; nommé dans un template.`,
  },
  { num: '05', modNum: '02', modName: 'Web Components', durationMin: 30, title: 'Les custom elements', prereq: 'Leçon 04 recommandée',
    brief: `Sujet : créer ses propres balises HTML.
Sections : (1) customElements.define("mon-compteur", class extends HTMLElement { ... }) : définit une nouvelle balise. Le nom DOIT contenir un tiret (mon-compteur). (2) Le cycle de vie : constructor (init, PAS d'accès au DOM enfant), connectedCallback (ajouté au DOM — c'est ICI qu'on rend), disconnectedCallback (retiré), attributeChangedCallback(nom, ancien, nouveau) avec static get observedAttributes() { return ["valeur"]; }. (3) Lire/écrire des attributs (getAttribute/setAttribute), exposer des propriétés. (4) Custom elements AUTONOMES (extends HTMLElement, &lt;mon-element&gt;) vs CUSTOMISÉS (extends HTMLButtonElement + is="mon-bouton"). (5) EXEMPLE : un &lt;compteur-clic&gt; simple (bloc JS de définition + un bloc HTML qui l'utilise — l'aperçu HTML inclura un &lt;script&gt; échappé qui définit l'élément pour le voir fonctionner).
Pièges : nom sans tiret (refusé) ; manipuler les enfants dans le constructor (faire en connectedCallback) ; oublier observedAttributes ; ne pas nettoyer dans disconnectedCallback.
Pour aller plus loin : le Shadow DOM (leçon suivante), les form-associated custom elements, l'hydratation, les bibliothèques (Lit).
Exercices : (1) définir un custom element qui affiche un texte dans connectedCallback ; (2) réagir à un attribut via attributeChangedCallback ; (3) expliquer la différence autonome vs customisé.`,
  },
  { num: '06', modNum: '02', modName: 'Web Components', durationMin: 28, title: 'Le Shadow DOM', prereq: 'Leçon 05 recommandée',
    brief: `Sujet : encapsuler structure et styles d'un composant.
Sections : (1) Le problème : les styles d'une page « fuient » dans les composants et inversement. Le Shadow DOM ISOLE. (2) this.attachShadow({ mode: "open" }) dans un custom element crée un arbre SHADOW (encapsulé) ; on y met du HTML et un &lt;style&gt; LOCAL (qui ne fuit pas). (3) Les &lt;slot&gt; dans le shadow projettent le contenu « light DOM » fourni par l'utilisateur du composant. (4) Styler : :host (le composant lui-même), :host(.classe), ::slotted(...) (le contenu projeté), et exposer des points de personnalisation avec part="..." + ::part(...). (5) mode "open" (shadowRoot accessible) vs "closed". (6) EXEMPLE : une &lt;carte-info&gt; avec shadow DOM, un style local et un slot (bloc JS + usage HTML prévisualisable).
Pièges : croire que le CSS global stylise le shadow (non — utiliser :host/::part) ; mode closed inutilement ; oublier le slot (contenu non affiché) ; accessibilité (le shadow doit rester accessible).
Pour aller plus loin : ::part et les thèmes, les Custom State, Declarative Shadow DOM (SSR), constructable stylesheets.
Exercices : (1) attacher un shadow DOM et y mettre un style local ; (2) ajouter un &lt;slot&gt; et l'utiliser ; (3) exposer un élément interne avec part et le styler via ::part.`,
  },
  { num: '07', modNum: '03', modName: 'Accessibilité experte', durationMin: 30, title: 'Les patterns ARIA', prereq: 'Module 2 recommandé',
    brief: `Sujet : construire des composants accessibles avec les bons rôles ARIA.
Sections : (1) Rappel de la règle d'or : le HTML natif d'abord ; ARIA seulement quand il n'existe pas d'élément adapté. ARIA ne change PAS le comportement, seulement ce qu'annonce le lecteur d'écran — le clavier, c'est à TOI de le gérer. (2) Rôles, états (aria-expanded, aria-selected, aria-checked) et propriétés (aria-controls, aria-labelledby). (3) Le pattern ONGLETS : role="tablist" &gt; role="tab" (aria-selected, aria-controls) + role="tabpanel" (aria-labelledby) ; navigation aux flèches. (4) Le pattern ACCORDÉON : un &lt;button aria-expanded&gt; par en-tête (ou &lt;details&gt; natif, plus simple). (5) Le pattern MODALE : préférer &lt;dialog&gt; (leçon 2) ; sinon role="dialog" aria-modal. (6) Le clavier attendu pour chaque pattern (Tab, flèches, Échap, Entrée/Espace). (7) Renvoyer à la WAI-ARIA Authoring Practices (APG).
Pièges : ARIA sans le comportement clavier ; rôles redondants (role="button" sur un &lt;button&gt;) ; aria-label qui écrase un contenu textuel ; réinventer des composants natifs.
Pour aller plus loin : l'APG (Authoring Practices Guide), tester au lecteur d'écran, le focus management (leçon suivante).
Exercices : (1) ajouter aria-expanded à un bouton d'accordéon ; (2) baliser un jeu d'onglets avec les rôles ARIA ; (3) citer le clavier attendu pour des onglets.`,
  },
  { num: '08', modNum: '03', modName: 'Accessibilité experte', durationMin: 28, title: 'Régions live, focus et formulaires accessibles', prereq: 'Leçon 07 recommandée',
    brief: `Sujet : annoncer les changements et gérer le focus.
Sections : (1) Les RÉGIONS LIVE : aria-live="polite" (annonce quand l'utilisateur est libre) vs "assertive" (interrompt) ; les rôles raccourcis role="status" (polite) et role="alert" (assertive). Cas : message de confirmation, erreur, compteur. (2) La GESTION DU FOCUS : après une action (ouvrir un panneau, supprimer un élément), déplacer le focus au bon endroit ; tabindex="-1" pour rendre un élément focusable par script sans l'ajouter à la tabulation ; ne JAMAIS utiliser tabindex positif. (3) Un FOCUS VISIBLE (rappel CSS :focus-visible). (4) FORMULAIRES accessibles : &lt;label&gt; (rappel), aria-describedby vers un texte d'aide ou d'erreur, aria-invalid="true" sur un champ en erreur, regrouper avec fieldset/legend, annoncer les erreurs via une région live. (5) EXEMPLE : un message de statut en aria-live + un champ avec aide/erreur (prévisualisable).
Pièges : aria-live trop bavard (assertive partout) ; voler le focus à l'utilisateur ; tabindex positif (casse l'ordre) ; messages d'erreur non reliés au champ.
Pour aller plus loin : le focus trap d'une modale, les skip links, l'ordre de lecture, tester au clavier.
Exercices : (1) créer une région live qui annonce « Enregistré » ; (2) relier un message d'aide à un champ via aria-describedby ; (3) marquer un champ invalide et l'annoncer.`,
  },
  { num: '09', modNum: '04', modName: 'Métadonnées, données structurées & performance', durationMin: 28, title: 'Les données structurées (schema.org)', prereq: 'Module 3 recommandé',
    brief: `Sujet : décrire le SENS de tes données pour les machines.
Sections : (1) Pourquoi : permettre aux moteurs de recherche d'afficher des RÉSULTATS ENRICHIS (étoiles, prix, recette, FAQ). Le vocabulaire de référence : schema.org. (2) Trois formats : MICRODATA (attributs dans le HTML : itemscope, itemtype="https://schema.org/Product", itemprop="name"), RDFa (mention), et JSON-LD (RECOMMANDÉ). (3) JSON-LD : un &lt;script type="application/ld+json"&gt; contenant un objet JSON décrivant l'entité ("@context", "@type", propriétés). Exemple d'un Product ou d'un Article. (4) Quelques types utiles : Article, Product, Recipe, BreadcrumbList, Organization, FAQPage. (5) Valider avec les outils (Rich Results Test). (6) EXEMPLE : un bloc JSON-LD d'Article (bloc de code) + un exemple microdata.
Pièges : déclarer des données qui ne correspondent PAS au contenu visible (pénalité Google) ; mauvais @type ; JSON-LD invalide ; mélanger les formats.
Pour aller plus loin : les rich results par type, les sitemaps, la relation avec le SEO, Open Graph (leçon suivante).
Exercices : (1) écrire un JSON-LD minimal de type Organization ; (2) baliser un produit en microdata (name, price) ; (3) expliquer pourquoi JSON-LD est souvent préféré.`,
  },
  { num: '10', modNum: '04', modName: 'Métadonnées, données structurées & performance', durationMin: 28, title: 'Métadonnées avancées & PWA', prereq: 'Leçon 09 recommandée',
    brief: `Sujet : le &lt;head&gt; au service de la performance et de l'installation.
Sections : (1) Les RESOURCE HINTS : &lt;link rel="preconnect" href="..."&gt; (établir tôt une connexion, ex. vers une CDN de polices), dns-prefetch, &lt;link rel="preload" as="font/style/script" href="..."&gt; (charger en priorité une ressource critique), prefetch (préparer la navigation suivante). (2) preload : bien indiquer as et crossorigin ; ne pas en abuser. (3) theme-color (&lt;meta name="theme-color"&gt;) et color-scheme (clair/sombre). (4) La PWA : &lt;link rel="manifest" href="manifest.webmanifest"&gt; rend le site installable (nom, icônes, mode d'affichage — le manifeste lui-même est hors périmètre). (5) &lt;base href&gt; (URL de base des liens relatifs — à manier avec prudence). (6) http-equiv (ex. refresh, content-security-policy en mention). (7) canonical, alternate/hreflang (versions linguistiques).
Pièges : trop de preload (ralentit) ; preload sans as (inutile) ; &lt;base&gt; qui casse des ancres ; manifest mal référencé.
Pour aller plus loin : les Core Web Vitals, le Service Worker (PWA, hors périmètre), Content-Security-Policy, le rendu critique.
Exercices : (1) précharger une police avec preload (+ as + crossorigin) ; (2) ajouter un preconnect vers un domaine de CDN ; (3) relier un manifeste PWA et un theme-color.`,
  },
  { num: '11', modNum: '04', modName: 'Métadonnées, données structurées & performance', durationMin: 28, title: 'Performance et attributs de plateforme', prereq: 'Leçon 10 recommandée',
    brief: `Sujet : les attributs HTML qui pilotent chargement et comportement.
Sections : (1) Images performantes : loading="lazy" (différer les images hors écran), decoding="async", fetchpriority="high/low", et TOUJOURS width/height (évite le décalage CLS). (2) Scripts : defer (exécuter après le parsing, dans l'ordre) vs async (dès que prêt). (3) inert : rendre toute une sous-arborescence NON interactive (ni focus, ni clic) — utile derrière une modale. (4) hidden : masquer (et la valeur hidden="until-found" qui se révèle via la recherche dans la page / les ancres). (5) contenteditable (rendre un élément éditable), draggable (glisser-déposer), spellcheck, translate, autocapitalize. (6) Les attributs de saisie mobile : inputmode, enterkeyhint, autocomplete (tokens). (7) Mention de content-visibility (CSS) pour ne pas rendre le hors-écran.
Pièges : loading="lazy" sur une image AU-DESSUS du pli (la retarde) ; oublier width/height (CLS) ; abuser de contenteditable sans gérer le contenu ; inert mal retiré ; async pour un script qui dépend de l'ordre.
Pour aller plus loin : les Core Web Vitals (LCP, CLS, INP), le lazy-loading des iframes, content-visibility, la priorisation des ressources.
Exercices : (1) optimiser une image (lazy, decoding, dimensions) ; (2) différer un script avec defer et expliquer ; (3) rendre une zone inerte derrière une modale.`,
  },
  { num: '12', modNum: '05', modName: 'Aller plus loin', durationMin: 28, title: 'Internationalisation & sous le capot du HTML', prereq: 'Module 4 recommandé',
    brief: `Sujet : adapter le HTML aux langues du monde, et comprendre comment il fonctionne — puis synthèse.
Sections : (1) lang : sur &lt;html lang="fr"&gt; ET sur tout passage dans une autre langue (&lt;span lang="en"&gt;...&lt;/span&gt;) — important pour les lecteurs d'écran et la typographie. (2) La DIRECTION du texte : dir="rtl" (arabe, hébreu), "ltr", "auto". (3) &lt;bdi&gt; (isoler un texte de direction inconnue, ex. un pseudo utilisateur) et &lt;bdo dir&gt; (forcer la direction). (4) Les annotations &lt;ruby&gt;&lt;rt&gt;&lt;rp&gt; (prononciation au-dessus des caractères, ex. japonais). (5) Les entités et l'encodage (UTF-8, &amp;amp; &amp;copy; &amp;#x...). (6) &lt;h2&gt;Sous le capot&lt;/h2&gt; : le HTML est un STANDARD VIVANT (WHATWG, pas de versions figées) ; le navigateur PARSE le HTML en un arbre (le DOM) avec une grande TOLÉRANCE aux erreurs (il referme/insère des balises) ; le doctype déclenche le mode « standards » — sans lui, le « quirks mode » (compatibilité ancienne). (7) &lt;h2&gt;Et après&lt;/h2&gt; : tu maîtrises désormais le HTML moderne ; la suite, c'est le CSS pour la mise en forme et JavaScript pour l'interactivité avancée. Encourager.
Remplace « Pièges fréquents » par une courte note de bonnes pratiques i18n. GARDE « Pour aller plus loin », « Récap et vérification » et « Exercices ».
Exercices : (1) baliser un mot étranger avec lang ; (2) afficher un court texte en dir="rtl" ; (3) expliquer ce qu'est le quirks mode et comment l'éviter.`,
  },
];

log('Rédaction de ' + SPECS.length + ' leçons (HTML avancé)…');

const results = await pipeline(
  SPECS,
  (s) =>
    agent(
      INSTRUCTIONS +
        '\n\n=== LEÇON À RÉDIGER ===\nNuméro : ' + s.num + ' | Module ' + s.modNum + ' (' + s.modName + ')\nTitre : ' + s.title +
        '\n\nBRIEF DÉTAILLÉ (intègre fidèlement le contenu et les exemples ; échappe toutes les balises ; rends les exemples visibles) :\n' + s.brief,
      { label: 'écrit L' + s.num, phase: 'Rédaction', schema: SCHEMA }
    ),
  (parts, s) =>
    agent(
      INSTRUCTIONS +
        '\n\n=== RELECTURE CRITIQUE (corrige et renvoie la version finale, même schéma) ===\nLeçon ' + s.num + ' « ' + s.title + ' ».\n' +
        '1. EXACTITUDE : APIs correctes (details/dialog/popover, customElements, attachShadow, ARIA, JSON-LD, resource hints, attributs de perf, i18n selon la leçon).\n' +
        '2. ÉCHAPPEMENT : DANS les blocs de code, toute balise échappée (« < »→« &lt; », « > »→« &gt; », « & »→« &amp; »). Aucune balise réelle dans un &lt;code&gt;.\n' +
        '3. EXEMPLES VISIBLES : les blocs HTML rendent quelque chose au clic « 👁 Aperçu » ; pour les démos qui exigent du JS (dialog, custom element), un &lt;script&gt; échappé est inclus dans l\'exemple.\n' +
        '4. STRUCTURE : intro, 5–8 sections <h2>, Pièges fréquents (sauf L12 : note i18n), Pour aller plus loin, Récap et vérification (lesson-check), Exercices (3 avec solutions).\n' +
        '5. Public AVANCÉ ; pas de réexplication des bases ; aucun style/script réel dans la page.\n\n' +
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
