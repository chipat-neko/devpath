export const meta = {
  name: 'syntaxe-algo-comp',
  description: 'Rédige 5 leçons de compléments du cours Algorithmes (graphes avancés, backtracking, fenêtre, tries/bits)',
  phases: [{ title: 'Rédaction' }, { title: 'Relecture' }],
};

function buildLesson(p) {
  const objectives = p.objectives.map((o) => '                  <li>' + o + '</li>').join('\n');
  return `<!DOCTYPE html>
<html lang="fr" data-theme="light">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${p.title} — Leçon ${p.num} · Algorithmes · Syntaxe</title>
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

  <body data-course="algo" data-lesson="lecon-${p.num}.html">
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
            <li><a href="cours.html">Algorithmes</a></li>
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
    <script src="../../assets/vendor/prism/prism-javascript.min.js" defer></script>
  </body>
</html>
`;
}

const ICON_NOTE = '<svg class="callout__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M12 8h.01M11 12h1v4h1" /></svg>';
const ICON_WARN = '<svg class="callout__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" /><path d="M12 9v4M12 17h.01" /></svg>';
const ICON_TIP = '<svg class="callout__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12c.7.7 1 1.2 1 2h6c0-.8.3-1.3 1-2a7 7 0 0 0-4-12Z" /></svg>';
const ICON_MORE = '<svg class="callout__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 3v14M5 10l7 7 7-7M5 21h14" /></svg>';

const INSTRUCTIONS = `Tu rédiges une leçon de COMPLÉMENTS du cours « Algorithmes & structures de données en JS » (site Syntaxe).
Public : a fini le cours (Big O, récursion, tris, recherche, listes/piles/files/hachage, arbres/tas, GRAPHES
représentation + BFS/DFS, glouton, programmation dynamique). Ces leçons ajoutent les graphes AVANCÉS et des techniques
classiques. Français, tutoiement, ton précis. Tout en JavaScript MODERNE et idiomatique. NE réexplique pas les bases.

ÉDITEUR INTÉGRÉ : un bouton « ▶ Tester » apparaît sur les blocs language-javascript de LOGIQUE PURE. Comme ces
algorithmes sont du JS pur, RENDS-LES exécutables et autonomes (petit jeu de données + un appel + la sortie en
commentaire « // affiche: … »), pour que l'apprenant puisse cliquer « Tester ». N'invite pas explicitement à cliquer.

TU PRODUIS UNIQUEMENT { metaDesc, objectives, body } :
- metaDesc : ~150 caractères.
- objectives : 3 à 4 chaînes (« savoir faire X »), HTML inline autorisé (<code>, <strong>). «&nbsp;;» puis «.» pour la dernière.
- body : HTML INTÉRIEUR de <article class="prose"> (sans la balise article, sans bouton « terminer », sans nav).

STRUCTURE (≈1300–1800 mots) : 1–2 <p> d'intro ; 5–8 sections <h2> (chacune avec un exemple de code commenté) ;
inclure la COMPLEXITÉ (Big O) de chaque algorithme ; <h2>Pièges fréquents</h2> ; <h2>Pour aller plus loin</h2> ;
<h2>Récap et vérification</h2> (résumé <ul> + lesson-check) ; <h2>Exercices</h2> (3 gradués avec solutions repliables).

COMPOSANTS (n'invente pas d'autres classes) :
- Code JS : <figure class="code-block" data-file="algo.js"><pre><code class="language-javascript">… CODE ÉCHAPPÉ …</code></pre></figure>.
- Schéma ASCII (graphe, arbre) : un bloc <figure class="code-block" data-file="schema.txt"><pre><code class="language-markup">…</code></pre></figure>. Légende : <p class="code-caption">…</p>
- Note : <div class="callout callout--note">${ICON_NOTE}<div class="callout__body"><p class="callout__title">Note</p><p>…</p></div></div>
- Piège : <div class="callout callout--warn">${ICON_WARN}<div class="callout__body"><p class="callout__title">Piège fréquent</p><p>…</p></div></div>
- Astuce : <div class="callout callout--tip">${ICON_TIP}<div class="callout__body"><p class="callout__title">Astuce</p><p>…</p></div></div>
- Pour aller plus loin : <div class="callout callout--more">${ICON_MORE}<div class="callout__body"><p class="callout__title">Pour aller plus loin</p><p>…</p></div></div>
- Vérification : <div class="lesson-check"><p class="kicker kicker--gold">Vérifie ta compréhension</p><ol><li>…</li><li>…</li><li>…</li></ol></div>
- Exercice : <div class="exercise"><div class="exercise__head"><span class="exercise__num">Exercice 1</span><span class="exercise__level">Échauffement</span></div><p>…</p><details><summary>Voir une solution</summary><figure class="code-block" data-file="solution.js"><pre><code class="language-javascript">…</code></pre></figure></details></div>

ÉCHAPPEMENT (ABSOLUMENT CRITIQUE — algorithmes pleins de comparaisons et d'opérateurs) : DANS un <code>, « < »→« &lt; »,
« > »→« &gt; », « & »→« &amp; ». Donc « i < n »→« i &lt; n », « a <= b »→« a &lt;= b », « && »→« &amp;&amp; », la flèche « => »→« =&gt; »,
et les opérateurs bit-à-bit « &amp; », « | », « &lt;&lt; », « &gt;&gt; », « &gt;&gt;&gt; ». Vérifie qu'AUCUN « < », « > » ou « & » brut ne subsiste dans un &lt;code&gt;.

RÈGLES : code et complexités EXACTS. Aucun style=, aucun <style>, aucun <script> RÉEL dans la page (ton body = prose + blocs de code).`;

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
  { num: '16', modNum: '06', modName: 'Graphes avancés & techniques', durationMin: 32, title: 'Graphes pondérés et plus courts chemins', prereq: 'Cours Algorithmes recommandé',
    brief: `Sujet : trouver le plus court chemin dans un graphe PONDÉRÉ.
Sections : (1) Rappel : graphe pondéré (arêtes avec un coût), liste d'adjacence ; orienté vs non orienté. (2) Le problème du PLUS COURT CHEMIN à source unique. (3) BFS pour le plus court chemin NON pondéré (rappel rapide). (4) DIJKSTRA : principe (avancer toujours vers le sommet non visité le plus proche, RELÂCHER les arêtes), avec une FILE DE PRIORITÉ (tas min) ; implémentation JS ; complexité O((V+E) log V) ; ATTENTION : ne marche PAS avec des poids négatifs. (5) BELLMAN-FORD (présentation) : gère les poids négatifs, détecte les CYCLES négatifs, O(V·E). (6) Le TRI TOPOLOGIQUE d'un graphe orienté acyclique (DAG) : algorithme de Kahn (degrés entrants) ou via DFS ; usages (dépendances, ordonnancement de tâches, build). Donne du code JS exécutable (petit graphe en dur + appel + sortie commentée).
Pièges : appliquer Dijkstra avec des poids négatifs (résultats faux) ; oublier la file de priorité (Dijkstra devient lent) ; tri topologique sur un graphe avec cycle (impossible — il faut le détecter) ; confondre orienté et non orienté.
Pour aller plus loin : A* (recherche heuristique), Floyd-Warshall (tous les couples), les ponts/points d'articulation, union-find (leçon suivante).
Exercices : (1) implémenter Dijkstra sur un petit graphe pondéré ; (2) un tri topologique par degrés entrants (Kahn) ; (3) détecter un cycle dans un graphe orienté.`,
  },
  { num: '17', modNum: '06', modName: 'Graphes avancés & techniques', durationMin: 30, title: 'Union-Find et arbres couvrants minimaux', prereq: 'Leçon 16 recommandée',
    brief: `Sujet : gérer des ensembles disjoints et relier un graphe au coût minimal.
Sections : (1) L'UNION-FIND (ensembles disjoints) : représenter des groupes ; find (trouver le représentant d'un élément), union (fusionner deux groupes). (2) Les OPTIMISATIONS indispensables : compression de chemin (find aplatit l'arbre) + union par rang/taille → quasi O(1) AMORTI (alpha inverse d'Ackermann). (3) Usages : composantes connexes, DÉTECTER UN CYCLE dans un graphe non orienté, regroupement (clustering). (4) Les ARBRES COUVRANTS MINIMAUX (MST) : relier TOUS les sommets au coût total minimal. (5) KRUSKAL : trier les arêtes par poids, ajouter une arête si elle ne crée pas de cycle (test via union-find) ; O(E log E). (6) PRIM : faire croître l'arbre depuis un sommet avec une file de priorité ; O(E log V). (7) Kruskal vs Prim (graphe creux vs dense). Code JS exécutable.
Pièges : union-find naïf sans compression/rang (lent) ; relier sans tenir compte du rang/taille (arbre dégénéré) ; Kruskal sans structure pour la détection de cycle ; croire qu'un MST est toujours unique.
Pour aller plus loin : la connexité dynamique, le clustering par Kruskal, l'union-find pondéré, les applications réseau.
Exercices : (1) implémenter union-find avec compression de chemin et union par taille ; (2) compter les composantes connexes d'un graphe ; (3) construire un MST avec Kruskal.`,
  },
  { num: '18', modNum: '06', modName: 'Graphes avancés & techniques', durationMin: 32, title: 'Le backtracking (retour sur trace)', prereq: 'Leçon 17 recommandée',
    brief: `Sujet : explorer systématiquement un espace de solutions en revenant en arrière.
Sections : (1) Le PRINCIPE : construire une solution PAS À PAS, et REVENIR EN ARRIÈRE (backtrack) dès qu'une branche devient invalide ; c'est un arbre de décision parcouru en profondeur (DFS). (2) Le SCHÉMA générique : choisir → explorer (récursion) → DÉFAIRE le choix. (3) Générer les SOUS-ENSEMBLES, les PERMUTATIONS, les COMBINAISONS. (4) Les N-REINES : placer N reines sur un échiquier sans conflit. (5) Autres : sudoku, coloration de graphe, chemins dans une grille. (6) L'ÉLAGAGE (pruning) : couper tôt les branches sans espoir → gain énorme. (7) La COMPLEXITÉ (souvent exponentielle — d'où l'importance de l'élagage et des bonnes contraintes). Code JS exécutable (sous-ensembles/permutations sur un petit tableau).
Pièges : oublier de DÉFAIRE le choix (état corrompu entre branches) ; absence d'élagage (explosion combinatoire) ; muter une structure partagée sans la restaurer ; condition d'arrêt mal posée.
Pour aller plus loin : branch and bound, la programmation par contraintes, le lien avec la programmation dynamique (mémoïsation), les heuristiques.
Exercices : (1) générer tous les sous-ensembles d'un tableau ; (2) générer toutes les permutations ; (3) compter les solutions du problème des N-reines.`,
  },
  { num: '19', modNum: '06', modName: 'Graphes avancés & techniques', durationMin: 30, title: 'Deux pointeurs et fenêtre glissante', prereq: 'Leçon 18 recommandée',
    brief: `Sujet : deux techniques élégantes pour passer de O(n²) à O(n) sur les tableaux et chaînes.
Sections : (1) Les DEUX POINTEURS : deux indices qui parcourent un tableau — extrémités qui se rapprochent (paire de somme cible dans un tableau TRIÉ, inverser, palindrome), ou pointeurs lent/rapide. (2) Le motif LENT/RAPIDE (tortue et lièvre de Floyd) pour détecter un cycle (tableau « next » ou liste chaînée) et trouver le milieu. (3) La FENÊTRE GLISSANTE (sliding window) : une fenêtre [g, d] qui s'ÉTEND et se RÉTRÉCIT — sous-tableau de somme donnée, plus longue sous-chaîne sans caractère répété ; fenêtre FIXE vs VARIABLE. (4) Pourquoi ça marche : on évite de tout recalculer en mettant à jour la fenêtre de façon incrémentale → O(n). (5) RECONNAÎTRE quand appliquer ces patterns (segment CONTIGU, paires, tableau trié). Code JS exécutable.
Pièges : fenêtre mal rétrécie (oublier de retirer l'élément qui sort) ; deux pointeurs sur un tableau non trié alors que l'algorithme l'exige ; conditions de bord (g &lt;= d) ; recompter toute la fenêtre au lieu de l'ajuster.
Pour aller plus loin : les sommes préfixes (prefix sums), les pointeurs sur listes chaînées, les problèmes « top K » (tas), les fenêtres avec un dictionnaire de fréquences.
Exercices : (1) trouver une paire de somme cible dans un tableau trié (deux pointeurs) ; (2) la plus longue sous-chaîne sans caractère répété (fenêtre) ; (3) détecter un cycle avec lent/rapide.`,
  },
  { num: '20', modNum: '06', modName: 'Graphes avancés & techniques', durationMin: 30, title: 'Tries et manipulation de bits', prereq: 'Leçon 19 recommandée',
    brief: `Sujet : deux outils puissants — l'arbre préfixe et les opérations binaires.
Sections : (1) Le TRIE (arbre préfixe) : stocker un ensemble de chaînes en partageant les PRÉFIXES communs ; les opérations insert, search, startsWith ; usages : autocomplétion, vérificateur d'orthographe, recherche par préfixe ; complexité O(longueur du mot), indépendante du nombre de mots. (2) Implémentation JS : des nœuds avec des enfants indexés par caractère et un marqueur de fin de mot. (3) La MANIPULATION DE BITS : les opérateurs (&amp;, |, ^, ~, &lt;&lt;, &gt;&gt;, &gt;&gt;&gt;) et la notion de MASQUE. (4) Les astuces classiques : tester/positionner/effacer le i-ème bit, compter les bits à 1 (popcount), « n &amp; (n - 1) » efface le bit le plus bas, tester une puissance de 2, la parité. (5) Usages : un ENSEMBLE de bits (bitset/bitmask) pour des états compacts, le XOR pour trouver l'unique élément non dupliqué. (6) La LIMITE de JS : les opérations bit-à-bit travaillent sur 32 bits signés. Code JS exécutable.
Pièges : oublier que les opérations bit-à-bit sont sur 32 bits en JS (faux résultats sur de grands entiers) ; la priorité des opérateurs binaires (mettre des parenthèses) ; confondre &gt;&gt; (décalage arithmétique) et &gt;&gt;&gt; (logique) ; un trie trop gourmand en mémoire.
Pour aller plus loin : les filtres de Bloom, les suffix arrays/trees, BigInt pour aller au-delà de 32 bits, les structures de données succinctes.
Exercices : (1) implémenter un trie avec insert et startsWith ; (2) compter les bits à 1 d'un entier ; (3) trouver l'unique nombre non dupliqué d'un tableau avec le XOR.`,
  },
];

log('Rédaction de ' + SPECS.length + ' leçons (compléments Algorithmes)…');

const results = await pipeline(
  SPECS,
  (s) =>
    agent(
      INSTRUCTIONS +
        '\n\n=== LEÇON À RÉDIGER ===\nNuméro : ' + s.num + ' | Module ' + s.modNum + ' (' + s.modName + ')\nTitre : ' + s.title +
        '\n\nBRIEF DÉTAILLÉ (intègre fidèlement le contenu et les complexités ; rends le code exécutable ; échappe < > & et les opérateurs binaires) :\n' + s.brief,
      { label: 'écrit L' + s.num, phase: 'Rédaction', schema: SCHEMA }
    ),
  (parts, s) =>
    agent(
      INSTRUCTIONS +
        '\n\n=== RELECTURE CRITIQUE (corrige et renvoie la version finale, même schéma) ===\nLeçon ' + s.num + ' « ' + s.title + ' ».\n' +
        '1. EXACTITUDE des algorithmes ET des complexités (Dijkstra, union-find/MST, backtracking, deux pointeurs/fenêtre, tries/bits selon la leçon).\n' +
        '2. Le code est du JS pur EXÉCUTABLE (jeu de données + appel + sortie en commentaire).\n' +
        '3. ÉCHAPPEMENT (CRITIQUE) : DANS les blocs de code, « < »→« &lt; », « > »→« &gt; » (comparaisons i &lt; n, décalages &lt;&lt; / &gt;&gt;), « & »→« &amp; » (&amp;&amp; ET le ET binaire &amp;). Aucun caractère brut dans un &lt;code&gt;.\n' +
        '4. STRUCTURE : intro, 5–8 sections <h2> avec complexités, Pièges fréquents, Pour aller plus loin, Récap et vérification (lesson-check), Exercices (3 avec solutions).\n' +
        '5. Public a fini le cours ; pas de réexplication des bases ; aucun style/script réel dans la page.\n\n' +
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
