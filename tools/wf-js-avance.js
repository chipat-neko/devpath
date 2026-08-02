export const meta = {
  name: 'syntaxe-js-avance',
  description: 'Rédige les 12 leçons du cours « JavaScript avancé (expert) » et assemble le HTML',
  phases: [{ title: 'Rédaction' }, { title: 'Relecture' }],
};

function buildLesson(p) {
  const objectives = p.objectives.map((o) => '                  <li>' + o + '</li>').join('\n');
  return `<!DOCTYPE html>
<html lang="fr" data-theme="light">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${p.title} — Leçon ${p.num} · JavaScript avancé · Syntaxe</title>
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

  <body data-course="js-avance" data-lesson="lecon-${p.num}.html">
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
            <li><a href="cours.html">JavaScript avancé</a></li>
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
    <script src="../../assets/vendor/prism/prism-core.min.js" defer></script>
    <script src="../../assets/vendor/prism/prism-clike.min.js" defer></script>
    <script src="../../assets/vendor/prism/prism-markup.min.js" defer></script>
    <script src="../../assets/vendor/prism/prism-javascript.min.js" defer></script>
  </body>
</html>
`;
}

const ICON_NOTE = '<svg class="callout__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M12 8h.01M11 12h1v4h1" /></svg>';
const ICON_WARN = '<svg class="callout__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" /><path d="M12 9v4M12 17h.01" /></svg>';
const ICON_TIP = '<svg class="callout__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12c.7.7 1 1.2 1 2h6c0-.8.3-1.3 1-2a7 7 0 0 0-4-12Z" /></svg>';
const ICON_MORE = '<svg class="callout__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 3v14M5 10l7 7 7-7M5 21h14" /></svg>';

const INSTRUCTIONS = `Tu rédiges une leçon du cours « JavaScript avancé : niveau expert » (site Syntaxe). Public : développeurs qui maîtrisent DÉJÀ JavaScript jusqu'au niveau confirmé (closures, this, classes/prototypes, async/await & promesses, fetch, modules ES, gestion d'erreurs, Map/Set, bases des générateurs et de l'immutabilité). NE RÉEXPLIQUE PAS ces acquis : pars d'eux et va en PROFONDEUR.
Français, tutoiement, ton précis et technique mais clair. Du connu (acquis confirmés) vers l'inconnu (expert).

TU PRODUIS UNIQUEMENT { metaDesc, objectives, body } :
- metaDesc : ~150 caractères.
- objectives : 3 à 4 chaînes (« savoir faire X »), HTML inline autorisé. «&nbsp;;» puis «.» pour la dernière.
- body : HTML INTÉRIEUR de <article class="prose"> (sans la balise article, sans bouton « terminer », sans nav — ajoutés automatiquement).

STRUCTURE du body (≈1300–1900 mots, DENSE et technique) :
1. 1–2 <p> d'intro (le point d'appui confirmé + ce que cette leçon débloque).
2. 5 à 8 sections <h2> courtes (alimentent le sommaire), avec exemples de code commentés pas à pas, cas d'usage réels, et au moins deux encadrés.
3. <h2>Pièges fréquents</h2>.
4. <h2>Pour aller plus loin</h2>.
5. <h2>Récap et vérification</h2> : résumé en <ul> + bloc lesson-check (3 questions).
6. <h2>Exercices</h2> : exactement 3 exercices gradués (Échauffement, Application, Défi) avec solution repliable.
(PAS de section « projet fil rouge » : ce cours est thématique, chaque leçon est autonome.)

COMPOSANTS HTML EXACTS (n'invente pas d'autres classes) :
- Code : <figure class="code-block" data-file="exemple.js"><pre><code class="language-javascript">CODE</code></pre></figure> (HTML : data-file="index.html" + class="language-markup").
- Légende : <p class="code-caption">…</p>
- Note : <div class="callout callout--note">${ICON_NOTE}<div class="callout__body"><p class="callout__title">Note</p><p>…</p></div></div>
- Piège : <div class="callout callout--warn">${ICON_WARN}<div class="callout__body"><p class="callout__title">Piège fréquent</p><p>…</p></div></div>
- Astuce : <div class="callout callout--tip">${ICON_TIP}<div class="callout__body"><p class="callout__title">Astuce</p><p>…</p></div></div>
- Pour aller plus loin : <div class="callout callout--more">${ICON_MORE}<div class="callout__body"><p class="callout__title">Pour aller plus loin</p><p>…</p></div></div>
- Vérification : <div class="lesson-check"><p class="kicker kicker--gold">Vérifie ta compréhension</p><ol><li>…</li><li>…</li><li>…</li></ol></div>
- Exercice : <div class="exercise"><div class="exercise__head"><span class="exercise__num">Exercice 1</span><span class="exercise__level">Échauffement</span></div><p>…</p><details><summary>Voir une solution</summary><figure class="code-block" data-file="solution.js"><pre><code class="language-javascript">…</code></pre></figure></details></div>

ÉCHAPPEMENT DANS LE CODE (critique) — dans <code> : « & » → « &amp; » (donc « &amp;&amp; »), « < » → « &lt; » (ex. « i &lt; n », « &lt;T&gt; », « new Proxy »). « > » peut rester (« => » tel quel).

RÈGLES : aucun style inline, aucun style=, aucune balise <style>, aucun <script> ni onclick. Code JS MODERNE et CORRECT, vérifié mentalement (Symbol, Proxy/Reflect, générateurs async, AbortController, WeakMap, regex avancées, Intl selon la leçon). HTML valide et équilibré.`;

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
  { num: '01', modNum: '01', modName: 'Le langage en profondeur', durationMin: 30, title: 'Symboles et propriétés cachées', prereq: 'Cours JavaScript confirmé requis',
    brief: `Sujet : le type primitif Symbol et son rôle dans le langage.
Sections : (1) Créer un symbole : const s = Symbol("description") ; chaque appel renvoie une valeur UNIQUE (Symbol("x") !== Symbol("x")). À quoi ça sert : des clés de propriété garanties sans collision. (2) Symbole comme clé : const ID = Symbol("id"); obj[ID] = 42 ; ces clés sont IGNORÉES par Object.keys, for...in et JSON.stringify — propriétés « cachées » ; on les lit avec Object.getOwnPropertySymbols(obj). (3) Le registre global : Symbol.for("clef") (partagé) vs Symbol() (local) ; Symbol.keyFor. (4) Les symboles « bien connus » (well-known) personnalisent le comportement du langage : Symbol.iterator (rend itérable), Symbol.asyncIterator, Symbol.toPrimitive (contrôle la conversion), Symbol.toStringTag (personnalise Object.prototype.toString), Symbol.hasInstance (instanceof). (5) Exemple : rendre un objet itérable via [Symbol.iterator]() { ... } pour qu'il marche avec for...of et le spread. (6) Symbol.toPrimitive : un objet « température » qui se convertit en nombre ou en chaîne selon le contexte.
Pièges : pas de coercition implicite (sym + "" lève une TypeError ; utiliser String(sym) ou sym.description) ; les symboles disparaissent en JSON ; ce ne sont pas de vraies propriétés « privées » (getOwnPropertySymbols les expose) — pour du vrai privé, préférer #champs.
Pour aller plus loin : implémenter un protocole custom, l'usage des symboles dans les bibliothèques (clés internes), Reflect.ownKeys (chaînes + symboles).
Exercices : (1) créer deux symboles homonymes et vérifier qu'ils diffèrent ; (2) ajouter une propriété par symbole à un objet et montrer qu'elle est absente de Object.keys mais présente via getOwnPropertySymbols ; (3) rendre un objet « plage » { de, à } itérable avec Symbol.iterator pour produire les entiers de la plage.`,
  },
  { num: '02', modNum: '01', modName: 'Le langage en profondeur', durationMin: 32, title: 'Itérateurs et générateurs avancés', prereq: 'Leçon 01 recommandée',
    brief: `Sujet : aller au fond des protocoles d'itération et des générateurs (au-delà du for...of de base).
Sections : (1) Le protocole : un ITÉRATEUR a une méthode next() qui renvoie { value, done } ; un ITÉRABLE a [Symbol.iterator]() qui renvoie un itérateur. Écrire un itérateur à la main. (2) Les générateurs (function*) produisent un itérateur ; yield suspend, next() reprend ; ils sont paresseux (lazy) et peuvent être INFINIS (un générateur d'entiers). (3) Communication bidirectionnelle : la valeur passée à next(v) devient le résultat du yield ; .return() et .throw() pour piloter/terminer. (4) Délégation avec yield* : un générateur peut déléguer à un autre itérable (yield* autreGen()). (5) Composition d'itérateurs paresseux : écrire prendre(iter, n), map paresseux, filter paresseux qui ne calculent qu'à la demande. (6) Générateurs ASYNCHRONES : async function* + for await...of, pour produire des valeurs au fil d'opérations asynchrones (paginer une API). Exemple async function* pages(url) { ... yield data; ... }.
Pièges : un générateur est à usage unique (épuisé après parcours) ; oublier que c'est paresseux (rien ne s'exécute avant le premier next) ; boucle infinie sans condition d'arrêt ; mélanger for...of (sync) et for await...of (async).
Pour aller plus loin : les itérateurs comme abstraction de flux, l'intérêt mémoire (ne pas tout matérialiser), la proposition iterator helpers (.map/.filter/.take sur les itérateurs).
Exercices : (1) écrire un générateur infini de la suite de Fibonacci et en prendre les 10 premiers ; (2) écrire prendre(iterable, n) qui renvoie un tableau des n premières valeurs ; (3) écrire un générateur async qui « émet » 3 valeurs espacées d'un délai et les consommer avec for await...of.`,
  },
  { num: '03', modNum: '01', modName: 'Le langage en profondeur', durationMin: 34, title: 'Proxy et Reflect (métaprogrammation)', prereq: 'Leçon 02 recommandée',
    brief: `Sujet : intercepter et personnaliser les opérations fondamentales sur les objets.
Sections : (1) Métaprogrammation : agir sur le comportement du langage lui-même. (2) new Proxy(cible, handler) : un objet qui enveloppe « cible » et dont les opérations passent par des « trappes » (traps) définies dans handler. (3) Trappe get : const p = new Proxy(obj, { get(cible, clef, recepteur) { ... } }) ; exemple : valeur par défaut pour une clé absente, ou journalisation des accès. (4) Trappe set : valider une affectation (refuser une valeur invalide en lançant une erreur ou en renvoyant false en mode strict). (5) Autres trappes utiles : has (opérateur in), deleteProperty, apply (appel de fonction), construct (new). (6) Reflect : l'API « par défaut » miroir des trappes — Reflect.get/set/has/deleteProperty/ownKeys… À utiliser DANS une trappe pour exécuter le comportement standard (return Reflect.get(cible, clef, recepteur)) afin de préserver this. (7) Cas d'usage réels : objets « réactifs » (observer les changements), validation, propriétés calculées, tableaux à index négatif.
Pièges : les invariants des proxys (on ne peut pas mentir sur une propriété non configurable/non writable) ; this dans les méthodes de la cible (passer recepteur à Reflect) ; coût en performance (ne pas en abuser sur du code chaud) ; un Proxy n'est pas === à sa cible.
Pour aller plus loin : la réactivité de Vue 3 repose sur Proxy ; Reflect.ownKeys ; revocable proxies (Proxy.revocable).
Exercices : (1) un proxy qui renvoie 0 pour toute propriété numérique absente ; (2) un proxy de validation qui interdit d'affecter un âge négatif (throw) ; (3) un proxy qui journalise chaque lecture/écriture en déléguant le comportement réel à Reflect.`,
  },
  { num: '04', modNum: '02', modName: 'Asynchrone expert', durationMin: 32, title: "Maîtriser la boucle d'événements et la concurrence", prereq: 'Module 1 recommandé',
    brief: `Sujet : contrôler finement l'ordonnancement et la concurrence (au-delà de async/await de base).
Sections : (1) Rappel express : pile, file de macrotâches (setTimeout, événements), file de MICROtâches (promesses) traitée en priorité jusqu'à épuisement. (2) queueMicrotask(fn) : planifier une microtâche explicitement ; différence avec setTimeout(fn, 0) ; Promise.resolve().then(fn). (3) Le risque de famine : une microtâche qui en planifie d'autres sans fin bloque le rendu. (4) Séquentiel vs parallèle : await dans une boucle for = séquentiel (lent) ; lancer puis Promise.all = parallèle. Quand choisir quoi. (5) Limiter le parallélisme : un « pool » qui n'exécute que N promesses à la fois (utile pour ne pas saturer une API) — donner une implémentation simple. (6) Ne pas bloquer le thread : découper un gros calcul en morceaux rendus à la boucle (chunking) avec setTimeout/queueMicrotask, ou déléguer (Web Worker, mention). requestIdleCallback / requestAnimationFrame (mention selon le contexte).
Pièges : await séquentiel par mégarde dans une boucle (au lieu de Promise.all) ; bloquer l'UI avec une boucle synchrone lourde ; oublier que les microtâches passent avant le rendu ; conditions de course sur un état partagé.
Pour aller plus loin : Promise.all vs allSettled vs race vs any pour la stratégie de concurrence, structuredClone, les Web Workers pour le vrai parallélisme.
Exercices : (1) prédire l'ordre de logs mêlant queueMicrotask, setTimeout et un await ; (2) transformer une boucle d'await séquentiels en exécution parallèle plafonnée à 3 ; (3) écrire mapLimite(tableau, n, tacheAsync) qui traite au plus n éléments en parallèle.`,
  },
  { num: '05', modNum: '02', modName: 'Asynchrone expert', durationMin: 32, title: 'Annulation, délais et limites (AbortController)', prereq: 'Leçon 04 recommandée',
    brief: `Sujet : annuler des opérations asynchrones et poser des limites de temps.
Sections : (1) Le problème : une requête lancée mais devenue inutile (l'utilisateur a changé de page, tapé une nouvelle recherche). (2) AbortController : const c = new AbortController(); on passe c.signal à fetch(url, { signal }) ; c.abort() annule -> la promesse rejette avec une AbortError. Détecter : catch (e) { if (e.name === "AbortError") ... }. (3) Délai d'expiration (timeout) : AbortSignal.timeout(ms) crée un signal qui s'annule seul ; ou un setTimeout qui appelle abort. Implémenter fetchAvecTimeout. (4) Combiner des signaux : AbortSignal.any([s1, s2]) annule si l'un s'annule (timeout OU action utilisateur). (5) Rendre SA PROPRE fonction async annulable : écouter signal.addEventListener("abort", …) ou vérifier signal.aborted. (6) Patterns de contrôle de débit côté client : debounce (attendre la fin des saisies) et throttle (au plus une fois par intervalle) — donner des implémentations ; annuler la requête précédente quand une nouvelle part.
Pièges : oublier de gérer l'AbortError comme un cas normal (et pas une vraie erreur) ; fuite si on n'annule jamais ; un signal déjà « aborted » avant l'appel ; debounce vs throttle confondus.
Pour aller plus loin : annuler une chaîne de traitements, propager le signal en profondeur, l'absence d'annulation native des promesses (d'où AbortController).
Exercices : (1) annuler un fetch au bout de 2 s avec AbortSignal.timeout ; (2) écrire un debounce(fn, délai) ; (3) une recherche « au fil de la frappe » qui annule la requête précédente à chaque nouvelle saisie.`,
  },
  { num: '06', modNum: '02', modName: 'Asynchrone expert', durationMin: 32, title: 'Flux de données asynchrones (async iterators)', prereq: 'Leçon 05 recommandée',
    brief: `Sujet : traiter des données qui arrivent progressivement, au fil de l'eau.
Sections : (1) Pourquoi : tout charger en mémoire puis traiter ne marche pas pour de gros volumes ou des sources continues (pagination, fichiers, réseau). On veut consommer au fur et à mesure. (2) Itérable asynchrone : un objet avec [Symbol.asyncIterator]() ; se parcourt avec for await...of. (3) Générateur async (rappel) : async function* paginer(url) { let suivant = url; while (suivant) { const r = await fetch(suivant); const data = await r.json(); yield* data.items; suivant = data.next; } } puis for await (const item of paginer(url)) { ... }. (4) Composer des étapes paresseuses async : un mapAsync, un filterAsync, un take qui n'avancent qu'à la demande. (5) ReadableStream (aperçu) : le corps d'une réponse fetch est un flux (response.body) qu'on peut lire par morceaux avec un reader (getReader) ou parcourir ; notion de chunk. (6) Idée de backpressure : le consommateur impose le rythme.
Pièges : oublier le « await » dans for await...of ; mélanger sync/async iterators ; ne pas gérer les erreurs au milieu d'un flux (try/catch autour du for await) ; un flux est à usage unique.
Pour aller plus loin : les Streams (TransformStream), la composition de pipelines, comparaison avec les Observables (RxJS) pour le pousser (push) vs le tirer (pull).
Exercices : (1) écrire un générateur async qui « émet » les nombres 1 à 5 avec un délai et les sommer via for await ; (2) écrire prendreAsync(asyncIterable, n) ; (3) paginer une API fictive (chaque page renvoie { items, next }) avec un générateur async et collecter tous les items.`,
  },
  { num: '07', modNum: '03', modName: 'Conception & qualité', durationMin: 32, title: 'Patterns de conception en JavaScript', prereq: 'Module 2 recommandé',
    brief: `Sujet : les patterns de conception, version idiomatique JavaScript (pas la transposition naïve de Java).
Sections : (1) Avertissement : en JS, les fonctions de première classe et les closures rendent beaucoup de patterns GoF plus simples, voire inutiles. (2) Module : encapsuler état et API via une closure/IIFE ou, mieux aujourd'hui, les modules ES (export). Donner l'exemple d'un compteur encapsulé. (3) Singleton : une seule instance partagée ; en JS, un module EST déjà un singleton (son objet exporté). Montrer le piège du « vrai » singleton. (4) Observateur (pub/sub) : un sujet notifie des abonnés. Implémenter un mini EventEmitter (on/off/emit), ou utiliser EventTarget natif. (5) Fabrique (factory) : une fonction qui crée des objets configurés sans exposer le new. (6) Stratégie : injecter un comportement (une fonction) plutôt qu'un if/else géant — ex. un objet de stratégies { json: ..., csv: ... }[format]. (7) Décorateur (fonction) : envelopper une fonction pour ajouter un comportement (mémorisation, journalisation) — const withLog = (fn) => (...args) => { ...; return fn(...args); }.
Pièges : sur-ingénierie (appliquer un pattern là où une fonction suffit) ; singletons qui cachent un état global difficile à tester ; fuites d'abonnés (oublier off) dans l'observateur.
Pour aller plus loin : composition plutôt qu'héritage, l'injection de dépendances en JS, où ces patterns apparaissent dans les frameworks (hooks = stratégie/observateur).
Exercices : (1) écrire un EventEmitter avec on, off, emit ; (2) refactorer un gros switch de formats en objet de stratégies ; (3) écrire un décorateur withMesure(fn) qui journalise le temps d'exécution d'une fonction.`,
  },
  { num: '08', modNum: '03', modName: 'Conception & qualité', durationMin: 32, title: 'Programmation fonctionnelle avancée', prereq: 'Leçon 07 recommandée',
    brief: `Sujet : pousser le style fonctionnel (au-delà de map/filter/reduce).
Sections : (1) Rappel des piliers : fonctions pures (mêmes entrées -> même sortie, zéro effet de bord) et immutabilité. Pourquoi : testabilité, prévisibilité, parallélisation. (2) Composition : combiner de petites fonctions. Implémenter compose(...fns) (droite->gauche) et pipe(...fns) (gauche->droite) : const pipe = (...fns) => (x) => fns.reduce((v, f) => f(v), x);. (3) Currying et application partielle : transformer f(a, b, c) en f(a)(b)(c) ; pourquoi (spécialiser une fonction). Implémenter un curry simple, ou utiliser bind pour l'application partielle. (4) Style « point-free » (tacite) : composer sans nommer l'argument ; avantages et limites (lisibilité). (5) reduce comme couteau suisse : reconstruire map et filter avec reduce ; construire un objet ; aplatir. (6) Mémorisation (memoize) d'une fonction pure via une Map. (7) Éviter les effets de bord : renvoyer de nouvelles structures (spread, map), ne pas muter les arguments.
Pièges : « pure » trahie par une mutation cachée (trier sur place, push) ; sur-abstraction point-free illisible ; mémoriser une fonction non pure (résultats faux) ; currying qui nuit à la clarté.
Pour aller plus loin : foncteurs/monades en bref (Option/Result), les transducers, les bibliothèques (Ramda), le lien avec React (composants purs, useMemo).
Exercices : (1) écrire pipe(...fns) et composer 3 transformations sur un nombre ; (2) réimplémenter map et filter à l'aide de reduce ; (3) écrire memoize(fn) qui met en cache les résultats par argument.`,
  },
  { num: '09', modNum: '03', modName: 'Conception & qualité', durationMin: 30, title: 'Mémoire : références faibles et fuites', prereq: 'Leçon 08 recommandée',
    brief: `Sujet : comprendre le ramasse-miettes et éviter les fuites mémoire.
Sections : (1) Le ramasse-miettes (GC) : il libère ce qui n'est plus ATTEIGNABLE depuis les « racines » (variables globales, pile). Ce n'est pas du comptage de références : des cycles isolés sont collectés. (2) Une « fuite » en JS = garder par erreur une référence vivante. Sources fréquentes : variables globales oubliées, closures qui capturent de gros objets, écouteurs d'événements non retirés (removeEventListener), timers/intervals jamais arrêtés (clearInterval), caches qui grossissent sans borne, références à des nœuds DOM détachés. (3) WeakMap / WeakSet : des clés tenues FAIBLEMENT — si la clé n'est plus référencée ailleurs, la paire peut être collectée. Idéal pour associer des métadonnées à un objet sans empêcher sa libération (cache par objet, données privées). Non itérables (par conception). (4) WeakRef et FinalizationRegistry (expert, à manier avec parcimonie) : une référence faible explicite et un rappel « après collecte » ; pourquoi c'est non déterministe et rarement nécessaire. (5) Mesurer : les instantanés de tas (heap snapshots) des DevTools, comparer, repérer ce qui grandit.
Pièges : un cache en Map normal qui retient indéfiniment (préférer WeakMap ou une éviction) ; oublier de retirer un écouteur sur un composant détruit ; setInterval non nettoyé ; croire que WeakRef garantit la libération à un instant précis.
Pour aller plus loin : la structure générationnelle du GC, l'impact des fermetures, profiler la mémoire d'une page.
Exercices : (1) repérer la fuite dans un extrait (un setInterval qui capture un gros tableau) et la corriger ; (2) utiliser une WeakMap pour mémoriser un résultat par objet sans empêcher sa collecte ; (3) lister trois causes de fuite et leur correction.`,
  },
  { num: '10', modNum: '04', modName: 'Outils du langage', durationMin: 32, title: 'Expressions régulières avancées', prereq: 'Module 3 recommandé',
    brief: `Sujet : les fonctionnalités avancées des regex (au-delà des classes et quantificateurs de base).
Sections : (1) Groupes nommés : (?<annee>\\d{4}) ; on récupère match.groups.annee ; backreference nommée \\k<annee>. (2) Assertions de tête (lookahead) : (?=...) positif, (?!...) négatif — « suivi de » sans consommer. Ex. valider un mot de passe (au moins un chiffre) avec (?=.*\\d). (3) Assertions arrière (lookbehind) : (?<=...) / (?<!...) — « précédé de ». Ex. capturer un montant précédé de €. (4) Les drapeaux avancés : s (dotAll, le . matche aussi le saut de ligne), u (mode unicode, requis pour \\p{...}), y (sticky, ancre à lastIndex), d (indices des groupes), g (global). (5) Propriétés Unicode : \\p{Letter}, \\p{Number} avec le drapeau u. (6) matchAll : itérer tous les résultats avec leurs groupes : for (const m of texte.matchAll(/.../g)). (7) replace avec une FONCTION : remplacer dynamiquement selon chaque correspondance ; arguments (match, ...groupes, offset, chaine, groupesNommés).
Pièges : le « catastrophic backtracking » (regex exponentielle sur certains motifs, ex. (a+)+) — savoir le reconnaître ; greedy vs lazy (.* vs .*?) ; oublier le drapeau u pour \\p{...} ; lastIndex partagé d'une regex globale réutilisée ; lisibilité (commenter les regex complexes).
Pour aller plus loin : tester/visualiser ses regex, les limites (ne pas parser du HTML avec une regex), le drapeau v (ensembles).
Exercices : (1) valider avec un seul motif un mot de passe d'au moins 8 caractères contenant au moins un chiffre et une majuscule (lookaheads) ; (2) extraire toutes les dates AAAA-MM-JJ avec groupes nommés via matchAll ; (3) avec replace + fonction, mettre en MAJUSCULE chaque mot précédé d'un #.`,
  },
  { num: '11', modNum: '04', modName: 'Outils du langage', durationMin: 30, title: 'Internationalisation avec Intl', prereq: 'Leçon 10 recommandée',
    brief: `Sujet : formater nombres, dates et textes selon la langue et la région, avec l'API Intl native.
Sections : (1) Le problème : « 1,000.50 » vs « 1 000,50 », formats de date, tri des accents… Ne JAMAIS formater à la main. (2) Intl.NumberFormat : new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(1234.5) //=> "1 234,50 €" ; styles percent, unit ; notation "compact". (3) Intl.DateTimeFormat : new Intl.DateTimeFormat("fr-FR", { dateStyle: "long", timeStyle: "short" }).format(new Date()) ; options de fuseau (timeZone). (4) Intl.RelativeTimeFormat : "il y a 3 jours", "dans 2 heures" : new Intl.RelativeTimeFormat("fr", { numeric: "auto" }).format(-3, "day"). (5) Intl.Collator : trier correctement des chaînes selon la locale (les accents, la casse) : [...].sort(new Intl.Collator("fr").compare). (6) Intl.PluralRules : choisir la bonne forme (0 jour / 1 jour / 2 jours), surtout pour les langues à pluriels complexes. (7) Intl.ListFormat : « a, b et c ». Locales et repli (fallback).
Pièges : concaténer/arrondir soi-même au lieu d'utiliser Intl ; recréer un formatter à chaque appel (coûteux — le réutiliser) ; confondre la locale de l'utilisateur et celle des données ; les fuseaux horaires.
Pour aller plus loin : toLocaleString réutilise Intl en interne ; la négociation de langue (Accept-Language) ; les données CLDR.
Exercices : (1) afficher 1234567.89 en euros au format français ; (2) afficher « il y a 5 minutes » avec RelativeTimeFormat ; (3) trier ["éclair","echo","Eric","àme"] correctement avec un Collator français.`,
  },
  { num: '12', modNum: '04', modName: 'Outils du langage', durationMin: 32, title: 'Décorateurs et synthèse expert', prereq: 'Leçon 11 recommandée',
    brief: `Sujet : les décorateurs (proposition stage 3) et une carte de fin de parcours.
Cette leçon mêle une nouveauté concrète (décorateurs) et une SYNTHÈSE.
Sections : (1) Décorateurs : une syntaxe @decorateur pour ENVELOPPER une classe, une méthode, un accesseur ou un champ, afin d'ajouter un comportement de façon déclarative. État : proposition avancée (stage 3), nécessite un transpileur (Babel) ou TypeScript aujourd'hui. (2) Anatomie : un décorateur de méthode est une fonction qui reçoit (valeurOriginale, contexte) et renvoie éventuellement un remplacement ; le contexte donne { kind, name, addInitializer, ... }. Donner l'exemple d'un @journalise qui enveloppe une méthode pour tracer ses appels (montrer aussi l'équivalent SANS décorateur, avec une fonction d'ordre supérieur, pour démystifier). (3) Cas d'usage : journalisation, mémorisation, mesure du temps, validation, liaison de this (@bound). (4) Auto-accessors et @field. (5) Pourquoi c'est puissant ET à manier avec discernement (magie cachée, débogage). (6) <h2>La carte du JavaScript expert</h2> : relier ce qui a été vu (symboles, itérateurs/générateurs, Proxy/Reflect, concurrence, annulation, flux, patterns, FP, mémoire, regex, Intl, décorateurs) et tracer la suite : TypeScript (typage), Node.js (back-end), la performance (profilage, WebAssembly), l'écosystème d'outils (bundlers, tests), et le processus TC39 qui fait évoluer le langage chaque année. Encourager.
Remplace la section « Pièges fréquents » par une courte mise en garde sur l'usage des décorateurs ; GARDE « Pour aller plus loin », « Récap et vérification » et « Exercices ».
Exercices : (1) écrire l'équivalent fonctionnel (sans syntaxe @) d'un décorateur de journalisation, en enveloppant une méthode ; (2) décrire ce que ferait un décorateur @memo sur une méthode pure ; (3) citer trois directions d'approfondissement après ce cours et pourquoi.`,
  },
];

log('Rédaction de ' + SPECS.length + ' leçons (JavaScript avancé)…');

const results = await pipeline(
  SPECS,
  (s) =>
    agent(
      INSTRUCTIONS +
        '\n\n=== LEÇON À RÉDIGER ===\nNuméro : ' + s.num + ' | Module ' + s.modNum + ' (' + s.modName + ') | Niveau : Avancé\nTitre : ' + s.title +
        '\n\nBRIEF DÉTAILLÉ (intègre fidèlement le contenu, le code et les pièges ; développe la prose, soigne la densité technique) :\n' + s.brief,
      { label: 'écrit L' + s.num, phase: 'Rédaction', schema: SCHEMA }
    ),
  (parts, s) =>
    agent(
      INSTRUCTIONS +
        '\n\n=== RELECTURE CRITIQUE (corrige et renvoie la version finale, même schéma) ===\nLeçon ' + s.num + ' « ' + s.title + ' ».\n' +
        '1. EXACTITUDE du JavaScript moderne (Symbol, Proxy/Reflect, générateurs async, AbortController, WeakMap, regex avancées, Intl, décorateurs selon la leçon) : chaque exemple doit être correct.\n' +
        '2. ÉCHAPPEMENT du code : « & » → « &amp; » (donc « &amp;&amp; »), « < » → « &lt; ». Corrige tout oubli.\n' +
        '3. STRUCTURE complète : intro, 5–8 sections <h2>, Pièges fréquents (sauf L12 : mise en garde), Pour aller plus loin, Récap et vérification (lesson-check), Exercices (3 gradués avec solutions).\n' +
        '4. NIVEAU EXPERT : public déjà confirmé en JS ; ne pas réexpliquer les bases ; densité technique ≈1300–1900 mots.\n' +
        '5. HTML valide, classes autorisées uniquement, AUCUN style/script inline.\n\n' +
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
