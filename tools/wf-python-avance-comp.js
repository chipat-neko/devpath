export const meta = {
  name: 'syntaxe-python-avance-comp',
  description: 'Rédige 2 leçons de compléments du cours Python avancé (regex avancées, interopérabilité native)',
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

const INSTRUCTIONS = `Tu rédiges une leçon de COMPLÉMENTS du cours « Python avancé : maîtriser le langage en profondeur » (Syntaxe).
Public : EXPERTS ayant fini ce cours (décorateurs, data model, générateurs, typage/mypy, dataclasses, contextes,
asyncio, GIL, fonctionnel, tests, performance, métaprogrammation). Ces deux leçons ajoutent la regex EXPERTE et
l'interopérabilité NATIVE. Français, tutoiement, ton précis et technique. Python 3 MODERNE. NE réexplique pas les bases.

PAS D'EXÉCUTION EN DIRECT : Python ne tourne pas dans le navigateur. N'invite JAMAIS à cliquer « Tester »/« Aperçu ».
Code en blocs « language-python », résultats en COMMENTAIRE (« # affiche: … ») ou dans un bloc « Console ».

TU PRODUIS UNIQUEMENT { metaDesc, objectives, body } :
- metaDesc : ~150 caractères.
- objectives : 3 à 4 chaînes (« savoir faire X »), HTML inline autorisé (<code>, <strong>). «&nbsp;;» puis «.» pour la dernière.
- body : HTML INTÉRIEUR de <article class="prose"> (sans la balise article, sans bouton « terminer », sans nav).

STRUCTURE (≈1300–1800 mots) : 1–2 <p> d'intro ; 5–8 sections <h2> (chacune avec un exemple commenté) ;
<h2>Pièges fréquents</h2> ; <h2>Pour aller plus loin</h2> ; <h2>Récap et vérification</h2> (résumé <ul> + lesson-check) ;
<h2>Exercices</h2> (3 gradués avec solutions repliables contenant du code).

COMPOSANTS (n'invente pas d'autres classes) :
- Code Python : <figure class="code-block" data-file="script.py"><pre><code class="language-python">… CODE ÉCHAPPÉ …</code></pre></figure>.
- Sortie : <figure class="code-block" data-file="Console"><pre><code class="language-python">…</code></pre></figure>. Légende : <p class="code-caption">…</p>
- Note : <div class="callout callout--note">${ICON_NOTE}<div class="callout__body"><p class="callout__title">Note</p><p>…</p></div></div>
- Piège : <div class="callout callout--warn">${ICON_WARN}<div class="callout__body"><p class="callout__title">Piège fréquent</p><p>…</p></div></div>
- Astuce : <div class="callout callout--tip">${ICON_TIP}<div class="callout__body"><p class="callout__title">Astuce</p><p>…</p></div></div>
- Pour aller plus loin : <div class="callout callout--more">${ICON_MORE}<div class="callout__body"><p class="callout__title">Pour aller plus loin</p><p>…</p></div></div>
- Vérification : <div class="lesson-check"><p class="kicker kicker--gold">Vérifie ta compréhension</p><ol><li>…</li><li>…</li><li>…</li></ol></div>
- Exercice : <div class="exercise"><div class="exercise__head"><span class="exercise__num">Exercice 1</span><span class="exercise__level">Échauffement</span></div><p>…</p><details><summary>Voir une solution</summary><figure class="code-block" data-file="solution.py"><pre><code class="language-python">…</code></pre></figure></details></div>

ÉCHAPPEMENT (CRITIQUE) : DANS un <code>, « < »→« &lt; », « > »→« &gt; », « & »→« &amp; ». Donc les comparaisons « a < b »→« a &lt; b »,
la flèche d'annotation « -> »→« -&gt; », et dans les regex le lookbehind « (?<=…) »→« (?&lt;=…) », « (?<!…) »→« (?&lt;!…) ».
Vérifie qu'AUCUN « < » ou « > » brut ne subsiste dans un &lt;code&gt;.

RÈGLES : Python 3 correct et pythonique (chaînes brutes r"" pour les regex, ctypes correct). Aucun style=, aucun <style>,
aucun <script> RÉEL dans la page (ton body = prose + blocs de code).`;

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
  { num: '13', modNum: '05', modName: 'Au-delà de Python pur', durationMin: 30, title: 'Expressions régulières avancées', prereq: 'Cours Python avancé recommandé',
    brief: `Sujet : la regex au niveau EXPERT avec le module re (le cours Python de base a posé les fondamentaux).
Sections : (1) Rappel express puis : les GROUPES avancés — groupes NON capturants (?:...), groupes NOMMÉS (?P&lt;nom&gt;...) et les BACKREFERENCES (\\1, (?P=nom)) pour exiger une répétition. (2) Les ASSERTIONS de longueur nulle : lookahead positif (?=...) et négatif (?!...), lookbehind (?&lt;=...) et (?&lt;!...) ; cas d'usage (valider SANS consommer, mot de passe fort). (3) GREEDY vs LAZY (*?) vs POSSESSIVE ; le CATASTROPHIC BACKTRACKING (un motif qui explose en temps exponentiel — ReDoS) et comment l'éviter. (4) re.VERBOSE pour écrire un motif LISIBLE et commenté sur plusieurs lignes ; combiner les drapeaux. (5) re.compile (réutilisation et performance) ; la SUBSTITUTION par FONCTION (re.sub avec un callable). (6) Les limites de re et le module tiers « regex » (lookbehind de longueur variable, propriétés Unicode). Code Python avec sorties commentées.
Pièges : le catastrophic backtracking ((.*)* imbriqués) ; un lookbehind de longueur VARIABLE (interdit dans le module re standard) ; confondre une backreference \\1 et un groupe ; négliger re.VERBOSE pour des motifs complexes illisibles.
Pour aller plus loin : les automates finis derrière les regex, le module regex, la sécurité (ReDoS), savoir quand un VRAI parseur s'impose.
Exercices : (1) valider un mot de passe fort avec plusieurs lookaheads ; (2) remplacer des correspondances via une fonction de substitution ; (3) réécrire un motif complexe en re.VERBOSE commenté.`,
  },
  { num: '14', modNum: '05', modName: 'Au-delà de Python pur', durationMin: 30, title: 'Interfacer Python avec le code natif', prereq: 'Leçon 13 recommandée',
    brief: `Sujet : étendre et accélérer Python avec du code natif (C, Cython, vectorisation).
Sections : (1) Pourquoi : Python pur est lent pour le calcul intensif (interprétation, GIL) ; pour la performance ou pour réutiliser une bibliothèque existante en C, on descend au natif. (2) ctypes : appeler une bibliothèque PARTAGÉE (.so / .dll) depuis du Python pur — charger la lib, déclarer argtypes / restype, passer des structures (ctypes.Structure). (3) CFFI (mention) : une alternative plus haut niveau et plus sûre. (4) Cython : écrire du Python ANNOTÉ (cdef, types statiques) compilé en C — d'énormes gains sur les boucles numériques ; l'idée et un exemple de fonction typée. (5) L'API C de CPython (survol) : écrire une extension en C, et pybind11 pour le C++ ; le concept de wrapper. (6) La VECTORISATION avec NumPy : souvent LA bonne réponse (déléguer les boucles à du C optimisé) AVANT d'écrire soi-même du natif. (7) Profiler d'abord (rappel) : mesurer avant d'optimiser. Code (ctypes + pseudo-Cython annoté) commenté.
Pièges : optimiser sans profiler ; de mauvais types ctypes (corruption mémoire, crash) ; réécrire en C ce que NumPy fait déjà mieux ; sous-estimer le surcoût des appels inter-langages.
Pour aller plus loin : pybind11, PyO3/maturin (Rust), Numba (compilation JIT), libérer le GIL dans du code natif, le packaging d'extensions binaires (wheels).
Exercices : (1) appeler une fonction de la libc avec ctypes ; (2) décrire ce que Cython accélère et pourquoi ; (3) expliquer pourquoi vectoriser avec NumPy avant d'écrire du C.`,
  },
];

log('Rédaction de ' + SPECS.length + ' leçons (compléments Python avancé)…');

const results = await pipeline(
  SPECS,
  (s) =>
    agent(
      INSTRUCTIONS +
        '\n\n=== LEÇON À RÉDIGER ===\nNuméro : ' + s.num + ' | Module ' + s.modNum + ' (' + s.modName + ')\nTitre : ' + s.title +
        '\n\nBRIEF DÉTAILLÉ (intègre fidèlement le contenu ; sorties en commentaire ; r"" pour les regex ; échappe < > & et -> et les lookbehind (?&lt;=…)) :\n' + s.brief,
      { label: 'écrit L' + s.num, phase: 'Rédaction', schema: SCHEMA }
    ),
  (parts, s) =>
    agent(
      INSTRUCTIONS +
        '\n\n=== RELECTURE CRITIQUE (corrige et renvoie la version finale, même schéma) ===\nLeçon ' + s.num + ' « ' + s.title + ' ».\n' +
        '1. EXACTITUDE (regex avancées : lookaround/backreferences/ReDoS ; OU ctypes/Cython/NumPy selon la leçon).\n' +
        '2. PAS d\'invitation à « Tester »/« Aperçu » ; résultats en commentaire ou bloc « Console ».\n' +
        '3. ÉCHAPPEMENT : « < »→« &lt; », « > »→« &gt; » (flèche -&gt;, lookbehind (?&lt;=…) / (?&lt;!…)), « & »→« &amp; ». Aucune balise réelle dans un &lt;code&gt;.\n' +
        '4. STRUCTURE : intro, 5–8 sections <h2>, Pièges fréquents, Pour aller plus loin, Récap et vérification (lesson-check), Exercices (3 avec solutions).\n' +
        '5. Public EXPERT ; aucun style/script réel dans la page.\n\n' +
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
