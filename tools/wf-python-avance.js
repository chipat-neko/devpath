export const meta = {
  name: 'syntaxe-python-avance',
  description: 'Rédige les 12 leçons du cours « Python avancé : maîtriser le langage en profondeur »',
  phases: [{ title: 'Rédaction' }, { title: 'Relecture' }],
};

function buildLesson(p) {
  const objectives = p.objectives.map((o) => '                  <li>' + o + '</li>').join('\n');
  return `<!DOCTYPE html>
<html lang="fr" data-theme="light">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${p.title} — Leçon ${p.num} · Python avancé · Syntaxe</title>
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

  <body data-course="python-avance" data-lesson="lecon-${p.num}.html">
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
            <li><a href="cours.html">Python avancé</a></li>
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
    <script src="../../assets/vendor/prism/prism-python.min.js" defer></script>
  </body>
</html>
`;
}

const ICON_NOTE = '<svg class="callout__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M12 8h.01M11 12h1v4h1" /></svg>';
const ICON_WARN = '<svg class="callout__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" /><path d="M12 9v4M12 17h.01" /></svg>';
const ICON_TIP = '<svg class="callout__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12c.7.7 1 1.2 1 2h6c0-.8.3-1.3 1-2a7 7 0 0 0-4-12Z" /></svg>';
const ICON_MORE = '<svg class="callout__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 3v14M5 10l7 7 7-7M5 21h14" /></svg>';

const INSTRUCTIONS = `Tu rédiges une leçon du cours « Python avancé : maîtriser le langage en profondeur » (site Syntaxe). Public :
développeurs qui MAÎTRISENT DÉJÀ le Python de base (types, conditions, boucles, fonctions, listes/dicts/sets, chaînes,
compréhensions, modules, fichiers, exceptions, POO de base, générateurs simples). NE réexplique PAS les bases ; va droit
à l'avancé et au Python 3 MODERNE (idiomes 3.10/3.11/3.12 : « X | Y », match-case, TaskGroup, StrEnum, slots de dataclass…).
Français, tutoiement, ton précis et technique mais clair.

PAS D'EXÉCUTION EN DIRECT : Python ne tourne PAS dans le navigateur (le site s'ouvre en file://). N'invite donc JAMAIS
à cliquer « Tester » ou « Aperçu » (ces boutons n'existent que pour JavaScript et HTML). Montre les résultats en
COMMENTAIRE dans le code (« # affiche: ... ») ou dans un court bloc « Console ». Les exemples doivent être autonomes,
corrects et idiomatiques.

TU PRODUIS UNIQUEMENT { metaDesc, objectives, body } :
- metaDesc : ~150 caractères.
- objectives : 3 à 4 chaînes (« savoir faire X »), HTML inline autorisé (<code>, <strong>). «&nbsp;;» puis «.» pour la dernière.
- body : HTML INTÉRIEUR de <article class="prose"> (sans la balise article, sans bouton « terminer », sans nav).

STRUCTURE (≈1300–1800 mots) : 1–2 <p> d'intro ; 5–8 sections <h2> (chacune avec au moins un exemple de code commenté) ;
<h2>Pièges fréquents</h2> ; <h2>Pour aller plus loin</h2> ; <h2>Récap et vérification</h2> (résumé <ul> + lesson-check) ;
<h2>Exercices</h2> (3 gradués avec solutions repliables contenant du code).

COMPOSANTS (n'invente pas d'autres classes) :
- Code Python : <figure class="code-block" data-file="script.py"><pre><code class="language-python">… CODE ÉCHAPPÉ …</code></pre></figure>.
- Sortie console (optionnel) : <figure class="code-block" data-file="Console"><pre><code class="language-python">… SORTIE …</code></pre></figure>.
- Légende : <p class="code-caption">…</p>
- Note : <div class="callout callout--note">${ICON_NOTE}<div class="callout__body"><p class="callout__title">Note</p><p>…</p></div></div>
- Piège : <div class="callout callout--warn">${ICON_WARN}<div class="callout__body"><p class="callout__title">Piège fréquent</p><p>…</p></div></div>
- Astuce : <div class="callout callout--tip">${ICON_TIP}<div class="callout__body"><p class="callout__title">Astuce</p><p>…</p></div></div>
- Pour aller plus loin : <div class="callout callout--more">${ICON_MORE}<div class="callout__body"><p class="callout__title">Pour aller plus loin</p><p>…</p></div></div>
- Vérification : <div class="lesson-check"><p class="kicker kicker--gold">Vérifie ta compréhension</p><ol><li>…</li><li>…</li><li>…</li></ol></div>
- Exercice : <div class="exercise"><div class="exercise__head"><span class="exercise__num">Exercice 1</span><span class="exercise__level">Échauffement</span></div><p>…</p><details><summary>Voir une solution</summary><figure class="code-block" data-file="solution.py"><pre><code class="language-python">…</code></pre></figure></details></div>

ÉCHAPPEMENT (CRITIQUE) : DANS un <code>, « < »→« &lt; », « > »→« &gt; », « & »→« &amp; ». Attention surtout aux ANNOTATIONS
de type omniprésentes : la flèche de retour « -> » s'écrit « -&gt; » (def f() -&gt; int:), les comparaisons « a < b »→« a &lt; b »,
« x >= 0 »→« x &gt;= 0 ». Les crochets de génériques (list[int], Callable[[int], str], dict[str, int]) ne posent pas de souci.
Vérifie qu'AUCUNE flèche -> ni comparaison < / > ne reste avec un caractère brut dans un bloc de code.

RÈGLES : Python 3 moderne, exact et idiomatique (type hints, dataclasses, pathlib, async, f-strings, snake_case). Aucun style=,
aucun <style>, aucun <script> RÉEL dans la page (ton body = prose + blocs de code). Code de niveau professionnel et lisible.`;

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
  { num: '01', modNum: '01', modName: 'Fonctions & objets avancés', durationMin: 30, title: 'Les décorateurs', prereq: 'Cours Python (fonctions) recommandé',
    brief: `Sujet : modifier ou envelopper des fonctions et des classes sans toucher à leur corps.
Sections : (1) Rappel express : les fonctions sont des objets de première classe (passées, renvoyées) ; fonctions imbriquées et CLOSURES. (2) Un décorateur = une fonction qui prend une fonction et en renvoie une autre ; la syntaxe « @decorateur » au-dessus du def n'est que du sucre (f = decorateur(f)). (3) Le motif WRAPPER avec *args/**kwargs pour préserver la signature, et @functools.wraps pour conserver __name__/__doc__/la signature. (4) Les décorateurs PARAMÉTRÉS : une fabrique à TROIS niveaux (decorateur(param) renvoie le vrai décorateur qui renvoie le wrapper). (5) EMPILER plusieurs décorateurs (ordre d'application de bas en haut). (6) Décorateurs de CLASSE et décorateurs intégrés (@staticmethod, @classmethod, @property). (7) Cas d'usage concrets : journalisation, mesure du temps, mise en cache, contrôle d'accès. Montre les sorties en commentaire.
Pièges : oublier @functools.wraps (perte des métadonnées et de l'aide) ; mal transmettre *args/**kwargs ; se tromper dans l'ordre d'empilement ; un décorateur paramétré qui oublie un niveau d'imbrication.
Pour aller plus loin : functools.lru_cache (leçon 9), les décorateurs à état (objet appelable avec __call__), la bibliothèque wrapt, les décorateurs de coroutines.
Exercices : (1) un décorateur qui mesure et affiche le temps d'exécution ; (2) un décorateur paramétré @repeter(n) qui rappelle la fonction n fois ; (3) corriger un décorateur en lui ajoutant @wraps.`,
  },
  { num: '02', modNum: '01', modName: 'Fonctions & objets avancés', durationMin: 32, title: 'Le modèle de données : méthodes spéciales & descripteurs', prereq: 'Leçon 01 recommandée',
    brief: `Sujet : exploiter le « data model » pour des objets vraiment pythoniques.
Sections : (1) Les méthodes DUNDER d'identité/affichage : __repr__ (sans ambiguïté, idéalement évaluable) vs __str__ (lisible), __eq__ et __hash__ (cohérence), l'ordre avec __lt__ et @functools.total_ordering. (2) Rendre un objet APPELABLE (__call__) et CONTENEUR (__len__, __getitem__, __setitem__, __contains__, __iter__). (3) Surcharger les OPÉRATEURS (__add__, __mul__, et les versions réfléchies __radd__). (4) La gestion d'attributs : __getattr__ vs __getattribute__ (risque de récursion), __setattr__, et __slots__ (mémoire réduite + attributs figés). (5) Les DESCRIPTEURS (protocole __get__/__set__/__set_name__) : ce qui se cache derrière @property et les méthodes ; écrire un descripteur RÉUTILISABLE (ex. attribut validé). (6) Aperçu de __enter__/__exit__ (gestionnaires de contexte, leçon 6). Montre des exemples avec sorties.
Pièges : un __repr__ ambigu ; définir __eq__ sans __hash__ (objet non hachable) ; récursion infinie dans __getattribute__ ; oublier __set_name__ dans un descripteur.
Pour aller plus loin : collections.abc (hériter de Sequence/Mapping), numbers, typing.Protocol (leçon 4), functools.total_ordering.
Exercices : (1) une classe Vecteur avec __add__ et __repr__ ; (2) rendre une classe itérable via __iter__ ; (3) écrire un descripteur de validation (entier positif).`,
  },
  { num: '03', modNum: '01', modName: 'Fonctions & objets avancés', durationMin: 30, title: 'Générateurs avancés, itérateurs & coroutines', prereq: 'Leçon 02 recommandée',
    brief: `Sujet : produire et consommer des flux de données paresseux.
Sections : (1) Rappel express : iter()/next(), le protocole d'itération ; construire un ITÉRATEUR avec __iter__/__next__ et StopIteration. (2) Les GÉNÉRATEURS (yield) : état suspendu, paresse, économie de mémoire ; les expressions génératrices. (3) « yield from » pour DÉLÉGUER à un sous-générateur (chaînage, aplatissement). (4) Les générateurs comme COROUTINES classiques : send(), throw(), close() — à distinguer des coroutines async (leçon 7). (5) itertools en profondeur : islice, chain, groupby, tee, count, cycle, accumulate, combinations. (6) Construire un PIPELINE paresseux par composition de générateurs (lire → filtrer → transformer). Montre les sorties en commentaire.
Pièges : un générateur s'ÉPUISE (le recréer pour reparcourir) ; itertools.tee qui met en mémoire ; confondre coroutine classique (send) et coroutine async ; effets de bord cachés dans une expression génératrice.
Pour aller plus loin : asyncio (leçon 7), la bibliothèque more-itertools, les flux infinis maîtrisés par islice, @contextmanager qui repose sur yield (leçon 6).
Exercices : (1) un générateur qui aplatit une liste imbriquée avec « yield from » ; (2) un pipeline paresseux à trois étages ; (3) regrouper des données avec itertools.groupby.`,
  },
  { num: '04', modNum: '02', modName: 'Typage & données structurées', durationMin: 30, title: 'Le typage statique (typing & mypy)', prereq: 'Module 1 recommandé',
    brief: `Sujet : annoter et vérifier les types sans perdre le dynamisme de Python.
Sections : (1) Pourquoi : lisibilité, refactoring sûr, erreurs détectées par un OUTIL (mypy/pyright) — les annotations ne changent PAS l'exécution. (2) Les bases modernes : paramètres et retour (« -> »), conteneurs intégrés (list[int], dict[str, int], tuple[int, ...]). (3) Optional[X] (= X | None) et l'union « X | Y » (3.10+) ; Any vs object ; les alias de type ; Final ; Literal. (4) Les GÉNÉRIQUES : TypeVar, Generic[T], les types abstraits (Iterable, Sequence, Mapping), Callable[[int], str]. (5) Les PROTOCOLES (typing.Protocol) : le typage STRUCTUREL (un « duck typing » vérifié statiquement). (6) TypedDict, NewType, cast, Self (3.11) ; lancer mypy en ligne de commande. Montre des exemples annotés et le type d'erreur que mypy signalerait (en commentaire).
Pièges : croire que les annotations sont vérifiées à l'exécution (il faut mypy) ; abuser de Any ; oublier Optional alors que None est possible ; importer List/Dict de typing au lieu des génériques intégrés list/dict.
Pour aller plus loin : pydantic (validation à l'exécution), ParamSpec et les génériques avancés, typer les décorateurs, intégrer mypy en CI.
Exercices : (1) annoter une fonction (paramètres + retour) ; (2) définir un Protocol et une fonction qui l'accepte ; (3) typer une fonction générique avec TypeVar.`,
  },
  { num: '05', modNum: '02', modName: 'Typage & données structurées', durationMin: 28, title: 'Dataclasses, Enum & structures de données', prereq: 'Leçon 04 recommandée',
    brief: `Sujet : modéliser des données proprement et choisir la bonne structure.
Sections : (1) @dataclass : génère __init__, __repr__, __eq__ ; champs avec valeurs par défaut, field(default_factory=list) (résout le piège du défaut mutable), __post_init__. (2) Les options : frozen=True (immuable et hachable), order=True, kw_only, slots=True (3.10+). (3) Les ALTERNATIVES : typing.NamedTuple / collections.namedtuple (tuples nommés immuables), TypedDict (dictionnaire typé). (4) Les ÉNUMÉRATIONS : enum.Enum, auto(), IntEnum, Flag, StrEnum (3.11) ; itérer et comparer par identité. (5) Les conteneurs spécialisés de collections : defaultdict, Counter, deque, ChainMap. (6) Quand choisir quoi (dataclass vs namedtuple vs dict vs Enum). Montre des exemples avec sorties.
Pièges : un champ mutable par défaut sans default_factory ; muter une dataclass frozen ; comparer des membres d'Enum par valeur plutôt que par identité ; réimplémenter Counter/defaultdict à la main.
Pour aller plus loin : pydantic et attrs, l'héritage de dataclasses, le match-case sur des dataclasses, les conteforces immuables.
Exercices : (1) une dataclass Produit avec un champ liste (default_factory) ; (2) une Enum de statuts ; (3) compter des occurrences avec collections.Counter.`,
  },
  { num: '06', modNum: '02', modName: 'Typage & données structurées', durationMin: 28, title: 'Gestionnaires de contexte & contextlib', prereq: 'Leçon 05 recommandée',
    brief: `Sujet : gérer proprement les ressources avec le cycle setup/teardown.
Sections : (1) Rappel du bloc « with » ; le protocole __enter__/__exit__ ; ce que renvoie __enter__ (la cible de « as ») ; __exit__ reçoit l'éventuelle exception et renvoyer True la SUPPRIME. (2) Écrire un gestionnaire de contexte sous forme de CLASSE (chronomètre, connexion, transaction). (3) @contextlib.contextmanager : transformer un GÉNÉRATEUR (un seul yield, encadré d'un try/finally) en gestionnaire — bien plus concis. (4) Plusieurs ressources : « with a as x, b as y » et contextlib.ExitStack (nombre VARIABLE de ressources). (5) Les utilitaires : suppress, redirect_stdout, closing, nullcontext. (6) Les gestionnaires de contexte ASYNCHRONES (async with, __aenter__/__aexit__) — teaser leçon 7. Montre des exemples.
Pièges : oublier le try/finally dans un @contextmanager (ressource non libérée en cas d'exception) ; renvoyer True dans __exit__ par mégarde (masque les erreurs) ; ne pas utiliser ExitStack pour un nombre variable de ressources.
Pour aller plus loin : ExitStack avancé, les gestionnaires réentrants, async with (leçon 7), contextvars.
Exercices : (1) un gestionnaire « chronomètre » en classe ; (2) le même avec @contextmanager ; (3) ignorer une exception précise avec contextlib.suppress.`,
  },
  { num: '07', modNum: '03', modName: 'Asynchrone & concurrence', durationMin: 32, title: 'Asynchrone avec async/await et asyncio', prereq: 'Module 2 recommandé',
    brief: `Sujet : la concurrence d'entrées/sorties sur un seul thread.
Sections : (1) Le problème : les opérations d'E/S (réseau, disque) ATTENDENT ; l'asynchrone permet d'en mener plusieurs de front sans threads. (2) « async def » définit une COROUTINE, « await » suspend jusqu'au résultat ; une coroutine ne s'exécute que dans une BOUCLE D'ÉVÉNEMENTS lancée par asyncio.run(). (3) Lancer en CONCURRENCE : asyncio.gather, asyncio.create_task, et asyncio.TaskGroup (3.11). (4) Les outils : asyncio.sleep, asyncio.wait_for (délais), as_completed, asyncio.Semaphore (limiter la concurrence). (5) async with / async for / les générateurs asynchrones. (6) Ne PAS bloquer la boucle : déléguer le code synchrone lourd à run_in_executor. (7) Cas d'usage : N appels réseau en parallèle (code illustratif, sans réseau réel). Montre la structure avec sorties commentées.
Pièges : oublier await (on récupère une coroutine non exécutée) ; bloquer la boucle avec un calcul synchrone ; créer une tâche sans la conserver ni l'attendre ; confondre concurrence (asyncio) et parallélisme (processus, leçon 8).
Pour aller plus loin : httpx/aiohttp, asyncio.Queue, anyio/trio, comparer coroutines et threads (leçon 8).
Exercices : (1) lancer trois coroutines avec gather ; (2) ajouter un délai d'expiration avec wait_for ; (3) limiter la concurrence avec un Semaphore.`,
  },
  { num: '08', modNum: '03', modName: 'Asynchrone & concurrence', durationMin: 30, title: 'Threads, processus et le GIL', prereq: 'Leçon 07 recommandée',
    brief: `Sujet : le vrai parallélisme en Python et ses limites.
Sections : (1) Le GIL (Global Interpreter Lock) : un seul thread exécute du bytecode Python à la fois → les threads N'ACCÉLÈRENT PAS le calcul pur (CPU-bound), mais conviennent aux E/S (I/O-bound). (2) threading : Thread, Lock/RLock, Event, queue.Queue (communication sûre) ; les conditions de course. (3) multiprocessing : de VRAIS processus (qui contournent le GIL) pour le calcul ; Pool, Process, échange par Queue/Pipe, coût de SÉRIALISATION (pickle). (4) concurrent.futures : ThreadPoolExecutor vs ProcessPoolExecutor (API unifiée submit/map, objets Future). (5) CHOISIR : I/O-bound → asyncio ou threads ; CPU-bound → processus. (6) Mention du « no-GIL » (3.13, expérimental) et des sous-interpréteurs. Montre des exemples commentés.
Pièges : attendre une accélération CPU avec des threads (le GIL l'empêche) ; conditions de course sans verrou ; surcoût de multiprocessing pour de petites tâches ; envoyer un objet non picklable à un processus.
Pour aller plus loin : concurrent.futures avancé, joblib, NumPy (qui libère le GIL pendant le calcul), les files distribuées.
Exercices : (1) paralléliser des E/S avec ThreadPoolExecutor ; (2) un calcul CPU avec ProcessPoolExecutor ; (3) expliquer pourquoi des threads n'accélèrent pas un calcul pur.`,
  },
  { num: '09', modNum: '03', modName: 'Asynchrone & concurrence', durationMin: 28, title: 'Programmation fonctionnelle (functools & itertools)', prereq: 'Leçon 08 recommandée',
    brief: `Sujet : composer et transformer avec des outils fonctionnels.
Sections : (1) Rappel lambda, map/filter, sorted(key=...) ; et l'idiome : souvent une compréhension est plus lisible. (2) functools : reduce, partial (application partielle), lru_cache/cache (MÉMOÏSATION), singledispatch (surcharge selon le type du premier argument), cmp_to_key. (3) Le module operator (itemgetter, attrgetter, methodcaller) comme fonctions clés efficaces. (4) itertools pour les PIPELINES (rappel/approfondissement). (5) La COMPOSITION de fonctions et le style « point-free » (avec mesure). (6) Fonctions PURES et immuabilité : testabilité, sûreté, mémoïsation possible. Montre des exemples avec sorties.
Pièges : lru_cache sur des arguments non hachables ou une fonction à effets de bord ; un reduce illisible (préférer sum/une boucle) ; partial vs lambda (lisibilité) ; recalculer la clé de tri au lieu d'utiliser key.
Pour aller plus loin : functools.singledispatchmethod, les bibliothèques toolz/funcy, la mémoïsation avec expiration, le pattern matching (3.10).
Exercices : (1) mémoïser une fonction récursive avec lru_cache ; (2) trier des objets avec operator.attrgetter ; (3) traiter plusieurs types avec singledispatch.`,
  },
  { num: '10', modNum: '04', modName: 'Robustesse, performance & métaprogrammation', durationMin: 30, title: 'Tests et qualité (pytest)', prereq: 'Module 3 recommandé',
    brief: `Sujet : garantir un code correct et maintenable.
Sections : (1) Pourquoi tester ; tests unitaires vs intégration ; la pyramide des tests. (2) pytest : écrire des tests avec un simple assert, les organiser et les lancer ; les FIXTURES (préparation/partage de contexte), la PARAMÉTRISATION (@pytest.mark.parametrize). (3) Tester les ERREURS avec pytest.raises et les approximations avec pytest.approx. (4) Les MOCKS (unittest.mock : Mock, MagicMock, patch) pour ISOLER des dépendances (réseau, horloge, E/S). (5) doctest (des tests dans les docstrings). (6) La COUVERTURE (coverage) et l'intégration continue ; le débogage avec breakpoint()/pdb. (7) Linting et formatage (ruff, black, mypy) en bref. Montre des exemples de tests et leur résultat.
Pièges : des tests dépendants de l'ordre ou les uns des autres ; tout mocker (des tests qui ne testent plus rien) ; négliger les cas limites ; des fixtures à portée trop large.
Pour aller plus loin : hypothesis (tests par propriétés), tox/nox, les tests d'intégration, l'approche TDD.
Exercices : (1) écrire trois tests pytest d'une fonction ; (2) paramétrer un test avec plusieurs jeux de données ; (3) mocker une dépendance avec patch.`,
  },
  { num: '11', modNum: '04', modName: 'Robustesse, performance & métaprogrammation', durationMin: 30, title: 'Performance et profilage', prereq: 'Leçon 10 recommandée',
    brief: `Sujet : écrire du Python rapide, mesures à l'appui.
Sections : (1) MESURER d'abord : timeit (micro-mesure), cProfile + pstats (profilage), tracemalloc (mémoire) — « ne devine pas, mesure ». (2) Les bonnes STRUCTURES de données : set/dict pour l'appartenance en O(1), collections.deque pour les extrémités, bisect pour une liste triée maintenue. (3) Les idiomes rapides : compréhensions vs boucles, génération PARESSEUSE (mémoire), éviter le travail redondant (mémoïsation), variables locales, « "".join(...) » plutôt que des « += » de chaînes. (4) __slots__ pour réduire l'empreinte mémoire des instances. (5) Quand DÉLÉGUER : NumPy (vectorisation), Cython/extensions C, multiprocessing (CPU). (6) Repérer la complexité cachée (un O(n²) involontaire, des copies inutiles). Montre des mesures commentées.
Pièges : optimiser sans mesurer ; micro-optimiser le mauvais endroit ; concaténer des chaînes avec « + » dans une boucle ; recréer des structures à chaque itération.
Pour aller plus loin : line_profiler/memory_profiler, l'interpréteur PyPy, functools.cache, revoir le cours Algorithmes pour la complexité.
Exercices : (1) comparer deux implémentations avec timeit ; (2) accélérer un test d'appartenance avec un set ; (3) profiler une fonction avec cProfile.`,
  },
  { num: '12', modNum: '04', modName: 'Robustesse, performance & métaprogrammation', durationMin: 32, title: 'Métaprogrammation, packaging & synthèse', prereq: 'Leçon 11 recommandée',
    brief: `Sujet : agir sur le code lui-même, distribuer un projet — et synthèse du cours.
Sections : (1) L'INTROSPECTION : type(), isinstance(), dir(), getattr/setattr/hasattr, le module inspect (signatures), vars()/__dict__. (2) Créer des classes DYNAMIQUEMENT avec type(nom, bases, dict). (3) __init_subclass__ (hook appelé à la création d'une sous-classe) et __set_name__ — souvent PLUS SIMPLES qu'une métaclasse. (4) Les MÉTACLASSES (class Meta(type), __new__/__init__) : à quoi ça sert (frameworks, ORM), et pourquoi les ÉVITER quand un décorateur de classe ou __init_subclass__ suffit. (5) Le PACKAGING moderne : structurer un paquet (modules, __init__.py), pyproject.toml, construire et installer, les environnements virtuels (venv), publier (mention de PyPI). (6) &lt;h2&gt;Et après&lt;/h2&gt; : tu maîtrises le Python avancé ; pistes — la data (NumPy/pandas), le web (FastAPI/Django), l'automatisation, les performances natives (Cython/Rust), la contribution open source. Encourage.
Remplace « Pièges fréquents » par une CHECKLIST (à puces) : « quand recourir à la métaprogrammation, et quand s'en abstenir ». GARDE « Pour aller plus loin », « Récap et vérification » et « Exercices ».
Exercices : (1) inspecter une fonction avec inspect.signature ; (2) enregistrer automatiquement des sous-classes via __init_subclass__ ; (3) décrire la structure minimale d'un paquet installable (pyproject.toml).`,
  },
];

log('Rédaction de ' + SPECS.length + ' leçons (Python avancé)…');

const results = await pipeline(
  SPECS,
  (s) =>
    agent(
      INSTRUCTIONS +
        '\n\n=== LEÇON À RÉDIGER ===\nNuméro : ' + s.num + ' | Module ' + s.modNum + ' (' + s.modName + ')\nTitre : ' + s.title +
        '\n\nBRIEF DÉTAILLÉ (intègre fidèlement le contenu et les exemples ; montre les sorties en commentaire ; échappe < > & et la flèche -> dans le code) :\n' + s.brief,
      { label: 'écrit L' + s.num, phase: 'Rédaction', schema: SCHEMA }
    ),
  (parts, s) =>
    agent(
      INSTRUCTIONS +
        '\n\n=== RELECTURE CRITIQUE (corrige et renvoie la version finale, même schéma) ===\nLeçon ' + s.num + ' « ' + s.title + ' ».\n' +
        '1. EXACTITUDE du Python 3 avancé et idiomatique ; chaque exemple correct, sortie commentée plausible.\n' +
        '2. PAS d\'invitation à « Tester »/« Aperçu » (Python ne tourne pas dans le navigateur) ; résultats en commentaire ou bloc « Console ».\n' +
        '3. ÉCHAPPEMENT : DANS les blocs de code, « < »→« &lt; », « > »→« &gt; » — SURTOUT la flèche d\'annotation « -> »→« -&gt; » (def f() -&gt; T:) et les comparaisons a &lt; b, x &gt;= 0 ; « & »→« &amp; ». Aucune balise réelle dans un &lt;code&gt;.\n' +
        '4. STRUCTURE : intro, 5–8 sections <h2>, Pièges fréquents (sauf L12 : checklist), Pour aller plus loin, Récap et vérification (lesson-check), Exercices (3 avec solutions).\n' +
        '5. Public EXPERT : pas de réexplication des bases ; aucun style/script réel dans la page.\n\n' +
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
