export const meta = {
  name: 'syntaxe-react-comp',
  description: 'Rédige 3 leçons de compléments du cours React (routage, performance/hooks, robustesse/tests)',
  phases: [{ title: 'Rédaction' }, { title: 'Relecture' }],
};

const PILL = { debutant: 'Débutant', intermediaire: 'Intermédiaire', avance: 'Avancé' };

function buildLesson(p) {
  const objectives = p.objectives.map((o) => '                  <li>' + o + '</li>').join('\n');
  const pillClass = 'pill--' + p.level;
  const pillLabel = PILL[p.level];
  return `<!DOCTYPE html>
<html lang="fr" data-theme="light">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${p.title} — Leçon ${p.num} · React · Syntaxe</title>
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

  <body data-course="react" data-lesson="lecon-${p.num}.html">
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
            <li><a href="cours.html">React</a></li>
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
                <span class="dot-sep"><span class="pill ${pillClass}">${pillLabel}</span></span>
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
    <script src="../../assets/vendor/prism/prism-javascript.min.js" defer></script>
    <script src="../../assets/vendor/prism/prism-jsx.min.js" defer></script>
  </body>
</html>
`;
}

const ICON_NOTE = '<svg class="callout__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M12 8h.01M11 12h1v4h1" /></svg>';
const ICON_WARN = '<svg class="callout__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" /><path d="M12 9v4M12 17h.01" /></svg>';
const ICON_TIP = '<svg class="callout__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12c.7.7 1 1.2 1 2h6c0-.8.3-1.3 1-2a7 7 0 0 0-4-12Z" /></svg>';
const ICON_MORE = '<svg class="callout__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 3v14M5 10l7 7 7-7M5 21h14" /></svg>';

const INSTRUCTIONS = `Tu rédiges une leçon de COMPLÉMENTS du cours « React : interfaces à composants » (Syntaxe). Public : a fini les
14 leçons (JSX, props, listes, conditionnel, useState, événements, formulaires, useEffect, fetch, lever l'état, useRef,
useContext, useReducer, hooks personnalisés). Ces leçons ajoutent le routage, la performance et la robustesse/tests.
Français, tutoiement, ton précis et technique. React MODERNE (composants fonction + hooks, React 18/19). NE réexplique pas les bases.

PAS D'EXÉCUTION : React exige un build (le code ne tourne pas dans l'éditeur du site). N'invite JAMAIS à cliquer
« Tester »/« Aperçu ». Montre le code en blocs « language-jsx » et DÉCRIS le comportement.

TU PRODUIS UNIQUEMENT { metaDesc, objectives, body } :
- metaDesc : ~150 caractères.
- objectives : 3 à 4 chaînes (« savoir faire X »), HTML inline autorisé (<code>, <strong>). «&nbsp;;» puis «.» pour la dernière.
- body : HTML INTÉRIEUR de <article class="prose"> (sans la balise article, sans bouton « terminer », sans nav).

STRUCTURE (≈1300–1800 mots) : 1–2 <p> d'intro ; 5–8 sections <h2> (chacune avec un exemple commenté) ;
<h2>Pièges fréquents</h2> ; <h2>Pour aller plus loin</h2> ; <h2>Récap et vérification</h2> (résumé <ul> + lesson-check) ;
<h2>Exercices</h2> (3 gradués avec solutions repliables contenant du code).

COMPOSANTS (n'invente pas d'autres classes) :
- Code React/JSX : <figure class="code-block" data-file="App.jsx"><pre><code class="language-jsx">… CODE ÉCHAPPÉ …</code></pre></figure>.
- Code JS simple : class="language-javascript". Légende : <p class="code-caption">…</p>
- Note : <div class="callout callout--note">${ICON_NOTE}<div class="callout__body"><p class="callout__title">Note</p><p>…</p></div></div>
- Piège : <div class="callout callout--warn">${ICON_WARN}<div class="callout__body"><p class="callout__title">Piège fréquent</p><p>…</p></div></div>
- Astuce : <div class="callout callout--tip">${ICON_TIP}<div class="callout__body"><p class="callout__title">Astuce</p><p>…</p></div></div>
- Pour aller plus loin : <div class="callout callout--more">${ICON_MORE}<div class="callout__body"><p class="callout__title">Pour aller plus loin</p><p>…</p></div></div>
- Vérification : <div class="lesson-check"><p class="kicker kicker--gold">Vérifie ta compréhension</p><ol><li>…</li><li>…</li><li>…</li></ol></div>
- Exercice : <div class="exercise"><div class="exercise__head"><span class="exercise__num">Exercice 1</span><span class="exercise__level">Échauffement</span></div><p>…</p><details><summary>Voir une solution</summary><figure class="code-block" data-file="solution.jsx"><pre><code class="language-jsx">…</code></pre></figure></details></div>

ÉCHAPPEMENT (ABSOLUMENT CRITIQUE — le JSX est plein de chevrons) : DANS un <code>, « < »→« &lt; », « > »→« &gt; »,
« & »→« &amp; ». Donc CHAQUE balise JSX est échappée (&lt;Link&gt;, &lt;Route&gt;, &lt;Suspense&gt;, &lt;/&gt;), les flèches « () => … »→« () =&gt; … »,
les expressions « {a && b} »→« {a &amp;&amp; b} », « {n > 0} »→« {n &gt; 0} ». AUCUN « < », « > » ou « & » brut dans un &lt;code&gt;.

RÈGLES : React idiomatique (hooks au sommet, clés stables). Aucun style=, aucun <style>, aucun <script> RÉEL dans la page.`;

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
  { num: '15', modNum: '05', modName: 'Aller plus loin : routage, perf, robustesse', level: 'intermediaire', durationMin: 30, title: 'Le routage avec React Router', prereq: 'Cours React recommandé',
    brief: `Sujet : naviguer entre des « pages » dans une application React (SPA).
Sections : (1) Le problème : une SPA n'a qu'UNE page HTML ; le ROUTAGE côté client affiche des vues différentes selon l'URL, SANS recharger. React Router est la bibliothèque de référence. (2) Configurer : createBrowserRouter + &lt;RouterProvider&gt; (ou &lt;BrowserRouter&gt; englobant &lt;Routes&gt; et des &lt;Route path element&gt;). (3) NAVIGUER : &lt;Link to="/a-propos"&gt; (PAS un &lt;a&gt; qui recharge), &lt;NavLink&gt; (style « actif »), et useNavigate (navigation programmatique après une action). (4) Les PARAMÈTRES d'URL : &lt;Route path="/users/:id"&gt; + useParams ; les paramètres de requête avec useSearchParams. (5) Les routes IMBRIQUÉES et &lt;Outlet&gt; (un layout partagé qui rend la route enfant). (6) La route 404 (path="*"), et un mot sur les loaders/actions (data router). (7) Le lien avec l'API History (cours HTML avancé). Code JSX commenté.
Pièges : utiliser &lt;a href&gt; au lieu de &lt;Link&gt; (recharge toute l'app) ; oublier &lt;Outlet&gt; dans un layout (les enfants ne s'affichent pas) ; un mauvais ordre/spécificité de routes ; ne pas prévoir la route 404.
Pour aller plus loin : les data routers (loaders/actions), le code splitting par route (lazy), les routes protégées (authentification), Next.js (routage par fichiers).
Exercices : (1) deux routes reliées par des &lt;Link&gt; ; (2) une route avec un paramètre :id lu par useParams ; (3) un layout partagé avec &lt;Outlet&gt;.`,
  },
  { num: '16', modNum: '05', modName: 'Aller plus loin : routage, perf, robustesse', level: 'avance', durationMin: 30, title: 'Performance : mémoïsation, lazy et hooks récents', prereq: 'Leçon 15 recommandée',
    brief: `Sujet : éviter les rendus inutiles et accélérer une application React.
Sections : (1) POURQUOI un composant se re-rend (changement d'état, de props ou de contexte) et quand cela devient un problème. (2) React.memo : mémoïser un composant pour qu'il ne se re-rende QUE si ses props changent (comparaison superficielle). (3) useMemo : mémoïser une VALEUR calculée coûteuse ; useCallback : mémoïser une FONCTION (pour ne pas casser le React.memo d'un enfant). (4) Le PIÈGE de la sur-optimisation : MESURER d'abord (le Profiler des React DevTools) ; ces hooks ont un coût. (5) Le DÉCOUPAGE de code : React.lazy + &lt;Suspense fallback={…}&gt; pour charger un composant À LA DEMANDE (souvent par route). (6) Les hooks RÉCENTS (React 18) : useTransition (marquer une mise à jour comme non urgente), useDeferredValue (différer une valeur, ex. une recherche), useId (un identifiant stable et accessible). (7) Les listes (clés stables, virtualisation en mention). Code JSX commenté.
Pièges : tout mémoïser (optimisation prématurée : le coût dépasse le gain) ; useMemo/useCallback avec des dépendances incorrectes ; un React.memo cassé par une prop objet/fonction recréée à chaque rendu ; &lt;Suspense&gt; sans fallback.
Pour aller plus loin : le React Compiler (mémoïsation automatique), la virtualisation des longues listes, le profilage, les Server Components.
Exercices : (1) mémoïser un composant avec React.memo + useCallback ; (2) charger un composant en lazy dans un &lt;Suspense&gt; ; (3) différer une recherche avec useDeferredValue.`,
  },
  { num: '17', modNum: '05', modName: 'Aller plus loin : routage, perf, robustesse', level: 'intermediaire', durationMin: 30, title: 'Robustesse : error boundaries, portals et tests', prereq: 'Leçon 16 recommandée',
    brief: `Sujet : rendre une application React fiable et testée.
Sections : (1) Les ERROR BOUNDARIES : capter une erreur de RENDU dans un sous-arbre et afficher un repli (au lieu d'un écran blanc) ; un composant de CLASSE avec getDerivedStateFromError / componentDidCatch (ou la bibliothèque react-error-boundary) ; ce qu'elles NE captent PAS (les gestionnaires d'événements, l'asynchrone). (2) Les PORTALS : createPortal(enfant, conteneur) pour rendre un enfant AILLEURS dans le DOM (modales, infobulles) tout en restant dans l'arbre React (les événements bouillonnent dans l'arbre React, pas le DOM). (3) TESTER avec React Testing Library : render, screen, les requêtes par RÔLE/texte (getByRole, getByText), simuler des interactions (userEvent), affirmer (expect) — la philosophie « tester comme un utilisateur, pas l'implémentation ». (4) Tester un hook (renderHook), mocker un fetch. (5) Le DÉBOGAGE : les React DevTools, &lt;StrictMode&gt; (double rendu en dev pour révéler les bugs). Code JSX + un exemple de test commenté.
Pièges : écrire une error boundary en composant FONCTION (ce doit être une classe, ou react-error-boundary) ; croire qu'elle capte les erreurs ASYNC ; tester l'implémentation plutôt que le comportement ; retirer &lt;StrictMode&gt; pour faire taire un avertissement (c'est un signal).
Pour aller plus loin : Vitest/Jest, les tests end-to-end (Playwright), MSW (simuler le réseau), TypeScript avec React.
Exercices : (1) une error boundary qui affiche un message de repli ; (2) une modale avec createPortal ; (3) un test « cliquer sur le bouton incrémente le compteur affiché ».`,
  },
];

log('Rédaction de ' + SPECS.length + ' leçons (compléments React)…');

const results = await pipeline(
  SPECS,
  (s) =>
    agent(
      INSTRUCTIONS +
        '\n\n=== LEÇON À RÉDIGER ===\nNuméro : ' + s.num + ' | Module ' + s.modNum + ' (' + s.modName + ')\nTitre : ' + s.title +
        '\n\nBRIEF DÉTAILLÉ (intègre fidèlement le contenu ; décris le comportement ; ÉCHAPPE toutes les balises JSX, les flèches => et les &) :\n' + s.brief,
      { label: 'écrit L' + s.num, phase: 'Rédaction', schema: SCHEMA }
    ),
  (parts, s) =>
    agent(
      INSTRUCTIONS +
        '\n\n=== RELECTURE CRITIQUE (corrige et renvoie la version finale, même schéma) ===\nLeçon ' + s.num + ' « ' + s.title + ' ».\n' +
        '1. EXACTITUDE du React moderne (React Router ; OU memo/useMemo/useCallback/lazy/hooks 18 ; OU error boundaries/portals/Testing Library selon la leçon).\n' +
        '2. PAS d\'invitation à « Tester »/« Aperçu ».\n' +
        '3. ÉCHAPPEMENT (CRITIQUE) : CHAQUE balise JSX échappée (&lt;Link&gt;, &lt;Suspense&gt;, fragment &lt;&gt;…&lt;/&gt;), les flèches « =&gt; », « < »→« &lt; », « > »→« &gt; », « & »→« &amp; » (dont &amp;&amp;). AUCUN chevron ni & brut dans un &lt;code&gt;.\n' +
        '4. STRUCTURE : intro, 5–8 sections <h2>, Pièges fréquents, Pour aller plus loin, Récap et vérification (lesson-check), Exercices (3 avec solutions).\n' +
        '5. Public a fini le cours ; aucun style/script réel dans la page.\n\n' +
        'BRIEF DE RÉFÉRENCE :\n' + s.brief + '\n\nBROUILLON (JSON) :\n' + JSON.stringify(parts),
      { label: 'relit L' + s.num, phase: 'Relecture', schema: SCHEMA }
    ).then((fixed) => {
      const p = fixed || parts;
      const html = buildLesson({
        num: s.num, modNum: s.modNum, modName: s.modName, level: s.level, durationMin: s.durationMin,
        title: s.title, prereq: s.prereq, metaDesc: p.metaDesc, objectives: p.objectives, body: p.body,
      });
      return { file: 'lecon-' + s.num + '.html', html, num: s.num };
    })
);

const ok = results.filter(Boolean);
log('Leçons assemblées : ' + ok.length + '/' + SPECS.length);
return ok;
