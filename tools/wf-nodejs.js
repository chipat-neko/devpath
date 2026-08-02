export const meta = {
  name: 'syntaxe-nodejs',
  description: 'Rédige les 14 leçons du cours « Node.js : JavaScript côté serveur » et assemble le HTML',
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
    <title>${p.title} — Leçon ${p.num} · Node.js · Syntaxe</title>
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

  <body data-course="nodejs" data-lesson="lecon-${p.num}.html">
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
            <li><a href="cours.html">Node.js</a></li>
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
    <script src="../../assets/vendor/prism/prism-javascript.min.js" defer></script>
    <script src="../../assets/vendor/prism/prism-bash.min.js" defer></script>
  </body>
</html>
`;
}

const ICON_NOTE = '<svg class="callout__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M12 8h.01M11 12h1v4h1" /></svg>';
const ICON_WARN = '<svg class="callout__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" /><path d="M12 9v4M12 17h.01" /></svg>';
const ICON_TIP = '<svg class="callout__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12c.7.7 1 1.2 1 2h6c0-.8.3-1.3 1-2a7 7 0 0 0-4-12Z" /></svg>';
const ICON_MORE = '<svg class="callout__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 3v14M5 10l7 7 7-7M5 21h14" /></svg>';

const INSTRUCTIONS = `Tu rédiges une leçon du cours « Node.js : JavaScript côté serveur » (site Syntaxe). Public : développeurs qui
MAÎTRISENT DÉJÀ JavaScript moderne (fonctions, modules, async/await, promesses, tableaux/objets). Ils découvrent Node.
Français, tutoiement, ton clair et technique. Node MODERNE : version LTS récente, ES Modules ET CommonJS (en précisant),
async/await, fetch global (Node ≥ 18), préfixe « node: » pour les modules intégrés, test runner intégré « node:test ».

PAS D'EXÉCUTION EN DIRECT dans l'éditeur : Node tourne dans un terminal, pas dans le navigateur (le site est en file://).
N'invite JAMAIS à cliquer « Tester » ou « Aperçu ». Montre le CODE dans des blocs « language-javascript » et les COMMANDES
de terminal (node, npm) dans des blocs « language-bash ». Montre la SORTIE attendue en COMMENTAIRE (« // affiche: … »)
ou dans un bloc « Terminal ». Exemples réalistes et complets.

TU PRODUIS UNIQUEMENT { metaDesc, objectives, body } :
- metaDesc : ~150 caractères.
- objectives : 3 à 4 chaînes (« savoir faire X »), HTML inline autorisé (<code>, <strong>). «&nbsp;;» puis «.» pour la dernière.
- body : HTML INTÉRIEUR de <article class="prose"> (sans la balise article, sans bouton « terminer », sans nav).

STRUCTURE (≈1300–1800 mots) : 1–2 <p> d'intro ; 5–8 sections <h2> (chacune avec au moins un exemple de code commenté) ;
<h2>Pièges fréquents</h2> ; <h2>Pour aller plus loin</h2> ; <h2>Récap et vérification</h2> (résumé <ul> + lesson-check) ;
<h2>Exercices</h2> (3 gradués avec solutions repliables contenant du code).

COMPOSANTS (n'invente pas d'autres classes) :
- Code Node/JS : <figure class="code-block" data-file="app.js"><pre><code class="language-javascript">… CODE ÉCHAPPÉ …</code></pre></figure>.
- Commandes terminal : <figure class="code-block" data-file="Terminal"><pre><code class="language-bash">… COMMANDES …</code></pre></figure>.
- Légende : <p class="code-caption">…</p>
- Note : <div class="callout callout--note">${ICON_NOTE}<div class="callout__body"><p class="callout__title">Note</p><p>…</p></div></div>
- Piège : <div class="callout callout--warn">${ICON_WARN}<div class="callout__body"><p class="callout__title">Piège fréquent</p><p>…</p></div></div>
- Astuce : <div class="callout callout--tip">${ICON_TIP}<div class="callout__body"><p class="callout__title">Astuce</p><p>…</p></div></div>
- Pour aller plus loin : <div class="callout callout--more">${ICON_MORE}<div class="callout__body"><p class="callout__title">Pour aller plus loin</p><p>…</p></div></div>
- Vérification : <div class="lesson-check"><p class="kicker kicker--gold">Vérifie ta compréhension</p><ol><li>…</li><li>…</li><li>…</li></ol></div>
- Exercice : <div class="exercise"><div class="exercise__head"><span class="exercise__num">Exercice 1</span><span class="exercise__level">Échauffement</span></div><p>…</p><details><summary>Voir une solution</summary><figure class="code-block" data-file="solution.js"><pre><code class="language-javascript">…</code></pre></figure></details></div>

ÉCHAPPEMENT (CRITIQUE) : DANS un <code>, « < »→« &lt; », « > »→« &gt; », « & »→« &amp; ». Donc les comparaisons « a < b »→« a &lt; b »,
les flèches « () => … »→« () =&gt; … », le « && »→« &amp;&amp; », et tout placeholder « &lt;paquet&gt; ». Vérifie qu'aucun « < », « > »
ou « & » brut ne subsiste dans un &lt;code&gt;.

RÈGLES : code Node IDIOMATIQUE et correct (API en version promesse fs/promises, gestion d'erreurs, async/await). Précise CJS vs ESM
quand c'est pertinent. Aucun style=, aucun <style>, aucun <script> RÉEL dans la page (ton body = prose + blocs de code).`;

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
  { num: '01', modNum: '01', modName: 'Les fondations de Node', level: 'intermediaire', durationMin: 26, title: 'Découvrir Node.js', prereq: 'Cours JavaScript recommandé',
    brief: `Sujet : exécuter du JavaScript en dehors du navigateur.
Sections : (1) Qu'est-ce que Node.js : un ENVIRONNEMENT D'EXÉCUTION JavaScript bâti sur le moteur V8 (celui de Chrome), pour le serveur et les outils. (2) À quoi ça sert : serveurs web et API, outils en ligne de commande, scripts d'automatisation. (3) INSTALLER Node (nodejs.org, versions LTS vs Current, et nvm pour gérer plusieurs versions) ; vérifier avec « node --version ». (4) Le REPL (taper « node » seul) pour expérimenter. (5) Exécuter un fichier : « node script.js » ; un premier message puis un script utile. (6) Les DIFFÉRENCES avec le navigateur : PAS de document/window/DOM ; à la place, des modules système (fs, http) et des globals Node (process, __dirname, Buffer). (7) console.log et process.argv (les arguments). Montre des commandes (bash) et du code (js) avec la sortie en commentaire.
Pièges : croire que le code navigateur (DOM) tourne dans Node ; confondre Node (le runtime) et un framework ; une version trop ancienne ; oublier que le JS de Node est mono-thread.
Pour aller plus loin : les modules (leçon 2), les alternatives (Deno, Bun), la boucle d'événements (leçon 4).
Exercices : (1) afficher la version de Node et ouvrir le REPL ; (2) écrire et exécuter un script qui affiche un message ; (3) lire un argument de la ligne de commande via process.argv.`,
  },
  { num: '02', modNum: '01', modName: 'Les fondations de Node', level: 'intermediaire', durationMin: 28, title: 'Les modules (CommonJS et ESM)', prereq: 'Leçon 01 recommandée',
    brief: `Sujet : organiser et réutiliser le code en modules.
Sections : (1) Pourquoi des modules : découper, réutiliser, encapsuler. (2) CommonJS (historique, par défaut pour les fichiers .js) : module.exports pour exporter, require('./fichier') pour importer un module local, require('node:fs') pour un module intégré, require('express') pour un paquet. (3) Les ES MODULES (standard moderne) : export / import, activés par « "type": "module" » dans package.json (ou l'extension .mjs). (4) Différences CJS vs ESM : require synchrone vs import statique, __dirname ABSENT en ESM (utiliser import.meta.url). (5) Les modules INTÉGRÉS et le préfixe « node: » (node:path, node:http…). (6) La résolution des modules (chemins relatifs avec ./, dossier node_modules). Montre les deux syntaxes côte à côte.
Pièges : mélanger require et import sans configuration ; oublier le « ./ » pour un module local ; attendre __dirname en ESM ; require qui s'exécute au chargement (bloquant).
Pour aller plus loin : exports nommés vs défaut, l'interopérabilité CJS/ESM, le champ « exports » de package.json, les imports dynamiques.
Exercices : (1) créer un module qui exporte une fonction (CommonJS) et l'importer ; (2) refaire la même chose en ES Modules ; (3) importer un module intégré avec le préfixe « node: ».`,
  },
  { num: '03', modNum: '01', modName: 'Les fondations de Node', level: 'intermediaire', durationMin: 28, title: 'npm et l\'écosystème', prereq: 'Leçon 02 recommandée',
    brief: `Sujet : gérer les dépendances et les scripts d'un projet.
Sections : (1) npm = le gestionnaire de paquets de Node, adossé au registre npmjs.com (des centaines de milliers de paquets). (2) INITIALISER : « npm init -y » crée package.json (nom, version, scripts, dépendances). (3) INSTALLER : « npm install &lt;paquet&gt; » (dependencies) vs « npm install -D &lt;paquet&gt; » (devDependencies) ; le dossier node_modules/ (à NE PAS versionner) et package-lock.json (versions exactes, à versionner). (4) Les SCRIPTS npm (« npm run &lt;nom&gt; », start, test) pour automatiser des tâches. (5) npx pour exécuter un paquet sans l'installer globalement. (6) Le SEMVER (^1.2.3, ~1.2.3, version exacte) ; mettre à jour (npm update, npm outdated). (7) La sécurité (npm audit) et les alternatives (pnpm, yarn). Montre des commandes (bash) et un package.json.
Pièges : versionner node_modules ; confondre dependencies et devDependencies ; supprimer package-lock.json ; installer en global ce qui devrait être local ; ignorer npm audit.
Pour aller plus loin : les workspaces (monorepo), pnpm, publier un paquet, les scripts pre/post.
Exercices : (1) initialiser un projet et installer une dépendance ; (2) ajouter un script npm et le lancer ; (3) expliquer la différence dependencies / devDependencies.`,
  },
  { num: '04', modNum: '02', modName: 'Le cœur asynchrone', level: 'intermediaire', durationMin: 30, title: 'L\'asynchrone et la boucle d\'événements', prereq: 'Module 1 recommandé',
    brief: `Sujet : comprendre le modèle non bloquant de Node.
Sections : (1) Node est MONO-THREAD mais NON BLOQUANT : la BOUCLE D'ÉVÉNEMENTS délègue les opérations d'E/S (fichiers, réseau) et continue à travailler ; les résultats reviennent plus tard. (2) BLOQUANT vs NON BLOQUANT (fs.readFileSync qui bloque tout, vs fs.readFile asynchrone) ; pourquoi le synchrone est dangereux dans un serveur. (3) Le pattern CALLBACK « error-first » : function(err, data) — toujours traiter err en premier. (4) Le « callback hell » (imbrications) qui motive les promesses (leçon 5). (5) Les phases de l'event loop en intuitif ; setTimeout, setImmediate, process.nextTick (survol). (6) util.promisify pour convertir une fonction à callback en promesse. Montre du code avec la sortie en commentaire.
Pièges : utiliser les versions « …Sync » dans un serveur (bloque tous les clients) ; oublier de gérer err (le 1er argument) ; le callback hell ; croire que le JS de Node s'exécute sur plusieurs threads.
Pour aller plus loin : les promesses (leçon 5), les worker threads (vrai parallélisme), libuv et le thread pool.
Exercices : (1) lire un fichier avec un callback error-first ; (2) illustrer la différence bloquant / non bloquant ; (3) promisifier une fonction à callback.`,
  },
  { num: '05', modNum: '02', modName: 'Le cœur asynchrone', level: 'intermediaire', durationMin: 28, title: 'Promesses et async/await', prereq: 'Leçon 04 recommandée',
    brief: `Sujet : écrire de l'asynchrone lisible et efficace.
Sections : (1) Rappel des Promesses (then/catch) appliquées à Node, et les API modernes en version PROMESSE (node:fs/promises). (2) async / await + try/catch pour un code séquentiel et lisible. (3) Le PARALLÉLISME : Promise.all (tout en parallèle), Promise.allSettled, Promise.race ; le PIÈGE du « await dans une boucle » (séquentiel et lent) à remplacer par Promise.all. (4) fetch est désormais GLOBAL dans Node (≥ 18) — appeler une API HTTP. (5) La gestion des erreurs asynchrones (try/catch ; les rejets non gérés « unhandledRejection »). (6) Préférer l'API promesse à l'API callback. Montre du code async/await avec sortie.
Pièges : « await » dans une boucle au lieu de Promise.all (lent) ; oublier try/catch (rejet non géré) ; mélanger callbacks et promesses ; oublier d'« await » une promesse.
Pour aller plus loin : « for await…of » (flux async), limiter la concurrence (p-limit), AbortController, les Streams (leçon 7).
Exercices : (1) lire un fichier avec fs/promises et async/await ; (2) lancer 3 tâches en parallèle avec Promise.all ; (3) appeler une API avec fetch et gérer l'erreur.`,
  },
  { num: '06', modNum: '02', modName: 'Le cœur asynchrone', level: 'intermediaire', durationMin: 26, title: 'Les événements (EventEmitter)', prereq: 'Leçon 05 recommandée',
    brief: `Sujet : la programmation événementielle, au cœur de Node.
Sections : (1) Le pattern OBSERVATEUR : des objets ÉMETTENT des événements, d'autres y RÉAGISSENT ; beaucoup d'objets Node en héritent (serveurs HTTP, streams). (2) La classe EventEmitter (node:events) : .on(event, écouteur) pour écouter, .emit(event, ...args) pour déclencher, .once (une seule fois), .off/removeListener. (3) Créer SA classe en héritant d'EventEmitter (class X extends EventEmitter). (4) L'événement spécial « error » : sans écouteur, il fait PLANTER le process. (5) Les bonnes pratiques (nombre d'écouteurs, fuites « MaxListenersExceeded »). (6) Le lien avec les streams et le serveur HTTP (qui sont des émetteurs). Montre un EventEmitter personnalisé avec sortie.
Pièges : oublier d'écouter « error » (crash) ; fuite d'écouteurs ; émettre avant d'avoir un écouteur ; confondre once et on.
Pour aller plus loin : les streams (leçon suivante), AbortSignal, le pub/sub, events.on (async iterator d'événements).
Exercices : (1) créer un EventEmitter et écouter un événement ; (2) une classe qui hérite d'EventEmitter et émet ; (3) gérer un événement « error ».`,
  },
  { num: '07', modNum: '02', modName: 'Le cœur asynchrone', level: 'avance', durationMin: 30, title: 'Les streams et les buffers', prereq: 'Leçon 06 recommandée',
    brief: `Sujet : traiter de gros volumes de données par flux, sans saturer la mémoire.
Sections : (1) Le problème : charger un fichier de 2 Go d'un coup sature la RAM ; les STREAMS traitent les données par MORCEAUX (chunks). (2) Les 4 types : Readable, Writable, Duplex, Transform. (3) Lire/écrire en flux (fs.createReadStream / createWriteStream) et les événements « data », « end », « error ». (4) pipe() pour CONNECTER un flux lisible à un flux inscriptible (copier, compresser) ; pipeline() (meilleure gestion d'erreurs). (5) Les BUFFERS : des données BINAIRES brutes (Buffer.from, encodages). (6) Cas réels : gros fichiers, corps d'une requête HTTP, compression (node:zlib). Montre un pipe et un buffer.
Pièges : charger un gros fichier en mémoire au lieu d'un stream ; oublier la gestion d'erreurs (préférer pipeline à pipe) ; mal gérer l'encodage des buffers ; ignorer la « backpressure ».
Pour aller plus loin : les Transform streams personnalisés, la backpressure, « for await…of » sur un stream, zlib/crypto.
Exercices : (1) copier un fichier avec un pipe ; (2) lire un fichier en flux et compter les octets ; (3) créer un Buffer et l'inspecter.`,
  },
  { num: '08', modNum: '03', modName: 'Interagir avec le système', level: 'intermediaire', durationMin: 28, title: 'Le système de fichiers', prereq: 'Module 2 recommandé',
    brief: `Sujet : lire et écrire fichiers et dossiers.
Sections : (1) Le module fs, en version PROMESSE (node:fs/promises) à privilégier. (2) LIRE : readFile (préciser l'encodage « utf-8 », sinon on obtient un Buffer) ; ÉCRIRE : writeFile ; AJOUTER : appendFile. (3) Les DOSSIERS : mkdir (option recursive), readdir (lister), rm, rename. (4) Les MÉTADONNÉES : stat (taille, dates, isDirectory), tester l'existence (access). (5) Le module path : join, resolve, basename, extname, dirname — pour des chemins PORTABLES (ne jamais concaténer avec « / »). (6) __dirname / import.meta.url pour les chemins relatifs AU SCRIPT (vs au dossier courant). (7) Lire/écrire un fichier JSON de configuration. Montre du code fs/promises.
Pièges : concaténer des chemins à la main (utiliser path.join) ; oublier l'encodage (obtenir un Buffer au lieu d'une chaîne) ; confondre chemin relatif au CWD et au script ; les versions Sync bloquantes.
Pour aller plus loin : les streams pour les gros fichiers (leçon 7), fs.watch, les permissions, le globbing.
Exercices : (1) écrire puis relire un fichier texte (fs/promises) ; (2) lister les fichiers d'un dossier ; (3) construire un chemin avec path.join.`,
  },
  { num: '09', modNum: '03', modName: 'Interagir avec le système', level: 'intermediaire', durationMin: 26, title: 'Process, environnement et système', prereq: 'Leçon 08 recommandée',
    brief: `Sujet : dialoguer avec le système d'exploitation depuis Node.
Sections : (1) L'objet global process : process.argv (les arguments de la commande), process.env (les variables d'environnement), process.cwd() (dossier courant), process.exit(code), process.platform. (2) Les VARIABLES D'ENVIRONNEMENT pour la configuration (port, clé d'API) — ne jamais coder les secrets en dur (détaillé leçon 13). (3) Les événements du process : « exit », « SIGINT » (Ctrl+C), « uncaughtException ». (4) Le module os (cpus, totalmem, platform, homedir). (5) Le module child_process en survol (exec/spawn pour lancer d'autres programmes). (6) Construire un petit OUTIL en ligne de commande (lire process.argv et agir). Montre du code.
Pièges : coder des secrets en dur au lieu de process.env ; supposer un seul OS (utiliser path/os) ; mal lire process.argv (les index 0 et 1 sont node et le script) ; process.exit qui coupe une opération asynchrone en cours.
Pour aller plus loin : les bibliothèques de CLI (commander, yargs), l'arrêt propre (graceful shutdown), child_process en détail.
Exercices : (1) lire une variable d'environnement avec une valeur par défaut ; (2) faire un mini-CLI qui lit process.argv ; (3) afficher des infos système avec le module os.`,
  },
  { num: '10', modNum: '04', modName: 'Construire un serveur', level: 'intermediaire', durationMin: 30, title: 'Créer un serveur HTTP', prereq: 'Module 3 recommandé',
    brief: `Sujet : répondre à des requêtes web avec le module natif http.
Sections : (1) Le module node:http : http.createServer((req, res) =&gt; …).listen(port) — comprendre les bases AVANT d'utiliser un framework. (2) La REQUÊTE (req) : req.method (GET/POST…), req.url, req.headers ; lire le CORPS d'une requête (par morceaux/chunks). (3) La RÉPONSE (res) : res.statusCode, res.setHeader('Content-Type', …), res.end(corps) ; renvoyer du texte, du HTML, ou du JSON (JSON.stringify). (4) Un ROUTAGE manuel simple (selon req.method et req.url). (5) Les CODES DE STATUT (200, 201, 404, 500). (6) Pourquoi un framework comme Express simplifiera tout cela (leçon suivante). Montre un petit serveur qui répond du JSON sur quelques routes.
Pièges : oublier res.end (la requête reste en attente) ; mauvais Content-Type ; ne pas gérer les routes inconnues (404) ; lire le corps de manière synchrone.
Pour aller plus loin : Express (leçon suivante), Fastify, HTTPS, les Server-Sent Events, le routage avancé.
Exercices : (1) un serveur qui répond « Bonjour » en texte ; (2) renvoyer du JSON sur une route ; (3) renvoyer un 404 sur une route inconnue.`,
  },
  { num: '11', modNum: '04', modName: 'Construire un serveur', level: 'intermediaire', durationMin: 32, title: 'Une API REST avec Express', prereq: 'Leçon 10 recommandée',
    brief: `Sujet : créer une API proprement avec le framework le plus répandu.
Sections : (1) Express : installer (npm install express), créer une app, app.listen(port). (2) Les ROUTES : app.get/post/put/delete('/chemin', (req, res) =&gt; …) ; renvoyer du JSON avec res.json(), fixer le statut avec res.status(code). (3) Les PARAMÈTRES : de route (req.params, « /users/:id »), de requête (req.query, « ?tri=nom »), et le CORPS (req.body, après avoir activé express.json()). (4) Construire une API CRUD REST : conventions (GET liste/détail, POST créer, PUT/PATCH modifier, DELETE supprimer) et bons codes de statut. (5) Servir des fichiers statiques (express.static). (6) Structurer avec un Router (express.Router). Montre une petite API REST (données en mémoire).
Pièges : oublier express.json() (req.body undefined) ; mauvais verbes/codes HTTP ; l'ordre des routes (il compte) ; mettre toute la logique métier dans les routes.
Pour aller plus loin : les middlewares (leçon suivante), Fastify/NestJS, la validation, l'authentification (JWT), une vraie base de données (cours SQL).
Exercices : (1) une route GET qui renvoie une liste en JSON ; (2) une route POST qui lit req.body ; (3) une route avec un paramètre « :id ».`,
  },
  { num: '12', modNum: '04', modName: 'Construire un serveur', level: 'avance', durationMin: 30, title: 'Middleware, données et erreurs', prereq: 'Leçon 11 recommandée',
    brief: `Sujet : le cœur d'Express et la robustesse d'une API.
Sections : (1) Le MIDDLEWARE : une fonction (req, res, next) qui s'exécute dans la CHAÎNE de traitement ; app.use(...) ; appeler next() pour passer au suivant. (2) Les middlewares intégrés/tiers : express.json (parser le corps), un logger, cors, le service de fichiers statiques. (3) Écrire SON middleware (journalisation, mesure du temps, authentification simple). (4) La gestion des ERREURS : le middleware d'erreur SPÉCIAL à QUATRE arguments (err, req, res, next) ; centraliser les erreurs ; les erreurs ASYNCHRONES (try/catch + next(err), ou un wrapper). (5) Les bons codes/messages (400, 401, 404, 500). (6) Brancher une source de données (mention d'une vraie base — cours SQL). Montre des middlewares et un gestionnaire d'erreurs.
Pièges : oublier next() (la requête reste bloquée) ; le middleware d'erreur sans ses 4 arguments ; les erreurs async non transmises à next ; l'ordre des middlewares.
Pour aller plus loin : express-async-errors, helmet (sécurité), la validation (zod/joi), l'architecture en couches.
Exercices : (1) écrire un middleware de journalisation ; (2) ajouter un middleware d'erreurs centralisé ; (3) renvoyer un 400 sur une entrée invalide.`,
  },
  { num: '13', modNum: '05', modName: 'Qualité & production', level: 'intermediaire', durationMin: 28, title: 'Environnement, débogage et tests', prereq: 'Module 4 recommandé',
    brief: `Sujet : fiabiliser et déboguer une application Node.
Sections : (1) La CONFIGURATION par variables d'environnement : process.env, un fichier .env (chargé par le drapeau natif « --env-file » récent, ou le paquet dotenv), .env à NE PAS versionner ; séparer config et code. (2) Le DÉBOGAGE : un console.log structuré, util.inspect, le débogueur intégré (« node --inspect » + les DevTools), les logs (pino/winston en mention). (3) Les TESTS : le test runner INTÉGRÉ « node:test » (test, assert) — plus besoin de framework externe ; lancer avec « node --test » ; structurer (describe/it). (4) Tester une fonction et une route (supertest en mention). (5) Le linting/formatage (ESLint, Prettier) en bref. Montre un .env, un test « node:test », une commande de debug.
Pièges : committer un .env (secrets exposés) ; des console.log oubliés en production ; aucun test sur la logique critique ; des logs non structurés.
Pour aller plus loin : pino (logs structurés), la couverture de tests, l'intégration continue (CI), le profilage.
Exercices : (1) lire une config depuis un .env ; (2) écrire un test avec « node:test » ; (3) lancer un script en mode debug (--inspect) et décrire la démarche.`,
  },
  { num: '14', modNum: '05', modName: 'Qualité & production', level: 'avance', durationMin: 28, title: 'Bonnes pratiques, sécurité & déploiement', prereq: 'Leçon 13 recommandée',
    brief: `Sujet : passer une application Node en production — et synthèse du cours.
Sections : (1) La STRUCTURE d'un projet sérieux : séparation en couches (routes / services / accès aux données), config par environnement, un point d'entrée clair. (2) La GESTION DES ERREURS robuste : ne pas laisser « uncaughtException » / « unhandledRejection » planter en silence ; l'ARRÊT PROPRE (graceful shutdown sur SIGTERM, fermer le serveur et les connexions). (3) La SÉCURITÉ : ne JAMAIS committer de secrets, VALIDER toutes les entrées, helmet et cors, surveiller les dépendances (npm audit), limiter le débit (rate limiting), éviter l'injection (requêtes paramétrées — cours SQL). (4) La PERFORMANCE : rester non bloquant, le clustering / worker threads pour le CPU, la mise en cache. (5) Le DÉPLOIEMENT en survol : un gestionnaire de process (pm2), les conteneurs (Docker), les hébergeurs, les variables d'environnement en prod. (6) &lt;h2&gt;Et après&lt;/h2&gt; : tu sais construire des outils et des API Node ; pistes — un framework (NestJS), une vraie base (le cours SQL, Prisma), TypeScript, le temps réel (WebSocket), le full-stack avec React. Encourage.
Remplace « Pièges fréquents » par une CHECKLIST (production + sécurité, à puces). GARDE « Pour aller plus loin », « Récap et vérification » et « Exercices ».
Exercices : (1) lister 5 règles de sécurité pour une API Node ; (2) décrire un arrêt propre (graceful shutdown) ; (3) proposer une structure de dossiers pour un projet Node.`,
  },
];

log('Rédaction de ' + SPECS.length + ' leçons (Node.js)…');

const results = await pipeline(
  SPECS,
  (s) =>
    agent(
      INSTRUCTIONS +
        '\n\n=== LEÇON À RÉDIGER ===\nNuméro : ' + s.num + ' | Module ' + s.modNum + ' (' + s.modName + ')\nTitre : ' + s.title +
        '\n\nBRIEF DÉTAILLÉ (intègre fidèlement le contenu et les exemples ; commandes en language-bash ; sorties en commentaire ; échappe < > & et => dans le code) :\n' + s.brief,
      { label: 'écrit L' + s.num, phase: 'Rédaction', schema: SCHEMA }
    ),
  (parts, s) =>
    agent(
      INSTRUCTIONS +
        '\n\n=== RELECTURE CRITIQUE (corrige et renvoie la version finale, même schéma) ===\nLeçon ' + s.num + ' « ' + s.title + ' ».\n' +
        '1. EXACTITUDE du Node moderne (fs/promises, ESM/CJS précisés, fetch global, node:test, préfixe node:) ; chaque exemple correct, sortie commentée plausible.\n' +
        '2. PAS d\'invitation à « Tester »/« Aperçu » (Node tourne dans un terminal). Code en language-javascript, commandes en language-bash.\n' +
        '3. ÉCHAPPEMENT : DANS les blocs de code, « < »→« &lt; », « > »→« &gt; » (comparaisons, flèches =&gt;, placeholders &lt;paquet&gt;), « & »→« &amp; » (dont &amp;&amp;). Aucun caractère brut dans un &lt;code&gt;.\n' +
        '4. STRUCTURE : intro, 5–8 sections <h2>, Pièges fréquents (sauf L14 : checklist), Pour aller plus loin, Récap et vérification (lesson-check), Exercices (3 avec solutions).\n' +
        '5. Public connaît déjà JavaScript ; aucun style/script réel dans la page.\n\n' +
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
