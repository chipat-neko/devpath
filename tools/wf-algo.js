export const meta = {
  name: 'syntaxe-algo',
  description: 'Rédige les 15 leçons du cours « Algorithmes & structures de données en JS »',
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
                <span class="dot-sep"><span class="pill pill--${p.levelClass}">${p.levelLabel}</span></span>
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
    <script src="../../assets/vendor/prism/prism-javascript.min.js" defer></script>
  </body>
</html>
`;
}

const ICON_NOTE = '<svg class="callout__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M12 8h.01M11 12h1v4h1" /></svg>';
const ICON_WARN = '<svg class="callout__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" /><path d="M12 9v4M12 17h.01" /></svg>';
const ICON_TIP = '<svg class="callout__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12c.7.7 1 1.2 1 2h6c0-.8.3-1.3 1-2a7 7 0 0 0-4-12Z" /></svg>';
const ICON_MORE = '<svg class="callout__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 3v14M5 10l7 7 7-7M5 21h14" /></svg>';

const INSTRUCTIONS = `Tu rédiges une leçon du cours « Algorithmes & structures de données en JavaScript » (site Syntaxe).
Le langage d'enseignement est JavaScript. Public : développeurs qui connaissent déjà JavaScript (niveau confirmé : fonctions, tableaux, objets, classes, récursion de base, Map/Set). NE réexplique pas la SYNTAXE JS de base ; concentre-toi sur l'ALGORITHMIQUE.
Français, tutoiement, ton précis et pédagogique. Du connu vers l'inconnu.

EXIGENCE PROPRE À CE COURS : pour CHAQUE algorithme ou structure, tu DOIS donner et justifier la
COMPLEXITÉ en temps et en espace (notation Big O), et inclure au moins un EXEMPLE TRAVAILLÉ pas à pas
(un déroulé sur une petite entrée). Le code JavaScript doit être CORRECT et exécutable.

TU PRODUIS UNIQUEMENT { metaDesc, objectives, body } :
- metaDesc : ~150 caractères.
- objectives : 3 à 4 chaînes (« savoir faire X »), HTML inline autorisé. «&nbsp;;» puis «.» pour la dernière.
- body : HTML INTÉRIEUR de <article class="prose"> (sans la balise article, sans bouton « terminer », sans nav — ajoutés automatiquement).

STRUCTURE du body (≈1300–1900 mots) :
1. 1–2 <p> d'intro (le problème que ça résout, l'idée clé).
2. 5 à 8 sections <h2> courtes (alimentent le sommaire) : intuition, déroulé pas à pas, implémentation JS commentée, ANALYSE DE COMPLEXITÉ (temps + espace), variantes/usages.
3. <h2>Pièges fréquents</h2>.
4. <h2>Pour aller plus loin</h2>.
5. <h2>Récap et vérification</h2> : résumé en <ul> (rappelle les complexités) + bloc lesson-check (3 questions).
6. <h2>Exercices</h2> : exactement 3 exercices gradués (Échauffement, Application, Défi) avec solution repliable.
(PAS de section « projet fil rouge » : chaque leçon est autonome.)

COMPOSANTS HTML EXACTS (n'invente pas d'autres classes) :
- Code : <figure class="code-block" data-file="exemple.js"><pre><code class="language-javascript">CODE</code></pre></figure>.
- Légende : <p class="code-caption">…</p>
- Tableau de complexité autorisé via <table><thead><tr><th>…</th></tr></thead><tbody><tr><td>…</td></tr></tbody></table> (la prose le stylise).
- Note : <div class="callout callout--note">${ICON_NOTE}<div class="callout__body"><p class="callout__title">Note</p><p>…</p></div></div>
- Piège : <div class="callout callout--warn">${ICON_WARN}<div class="callout__body"><p class="callout__title">Piège fréquent</p><p>…</p></div></div>
- Astuce : <div class="callout callout--tip">${ICON_TIP}<div class="callout__body"><p class="callout__title">Astuce</p><p>…</p></div></div>
- Pour aller plus loin : <div class="callout callout--more">${ICON_MORE}<div class="callout__body"><p class="callout__title">Pour aller plus loin</p><p>…</p></div></div>
- Vérification : <div class="lesson-check"><p class="kicker kicker--gold">Vérifie ta compréhension</p><ol><li>…</li><li>…</li><li>…</li></ol></div>
- Exercice : <div class="exercise"><div class="exercise__head"><span class="exercise__num">Exercice 1</span><span class="exercise__level">Échauffement</span></div><p>…</p><details><summary>Voir une solution</summary><figure class="code-block" data-file="solution.js"><pre><code class="language-javascript">…</code></pre></figure></details></div>

ÉCHAPPEMENT DANS LE CODE (CRITIQUE pour ce cours, plein de comparaisons) — dans <code> :
- « < » DOIT devenir « &lt; » (ex. « gauche &lt;= droite », « arr[j] &lt; pivot », « i &lt; n »).
- « & » DOIT devenir « &amp; » (donc « &amp;&amp; »).
- « > » peut rester (« => », « a > b »). Pense bien à TOUS les « &lt; » des boucles et comparaisons.

RÈGLES : aucun style inline, aucun style=, aucune balise <style>, aucun <script> ni onclick. Notation Big O en texte : O(n), O(log n), O(n log n), O(n²) (écris « O(n²) » ou « O(n^2) »). HTML valide et équilibré.`;

const SCHEMA = {
  type: 'object', additionalProperties: false,
  required: ['metaDesc', 'objectives', 'body'],
  properties: {
    metaDesc: { type: 'string' },
    objectives: { type: 'array', items: { type: 'string' }, minItems: 3, maxItems: 4 },
    body: { type: 'string' },
  },
};

const I = 'intermediaire', IL = 'Intermédiaire', A = 'avance', AL = 'Avancé';

const SPECS = [
  { num: '01', modNum: '01', modName: 'Penser algorithmes', levelClass: I, levelLabel: IL, durationMin: 30, title: 'La complexité algorithmique (Big O)', prereq: 'Cours JavaScript confirmé recommandé',
    brief: `Sujet : mesurer l'efficacité d'un algorithme indépendamment de la machine.
Sections : (1) Pourquoi : deux solutions correctes peuvent avoir des performances radicalement différentes quand n grandit. On compte le NOMBRE d'opérations en fonction de la taille de l'entrée n, pas les secondes. (2) La notation O() : on garde le terme dominant et on ignore les constantes (3n+5 -> O(n) ; 2n²+n -> O(n²)). (3) Les classes courantes, de la meilleure à la pire : O(1) constant (accès tableau arr[i], push), O(log n) (recherche binaire, diviser par 2), O(n) (un parcours), O(n log n) (bons tris), O(n²) (deux boucles imbriquées), O(2ⁿ) (récursion naïve exponentielle). Donner un tableau avec, pour n=1 000 000, l'ordre de grandeur des opérations. (4) Analyser un extrait : une boucle = O(n) ; deux imbriquées = O(n²) ; diviser l'espace par deux à chaque tour = O(log n). (5) Complexité en TEMPS vs en ESPACE (mémoire supplémentaire). (6) Meilleur / moyen / pire cas (ex. recherche linéaire : best O(1), worst O(n)). (7) Coûts cachés des méthodes JS : arr.includes / indexOf sont O(n), arr.unshift / shift sont O(n), un accès Map/Set est O(1) amorti.
Pièges : ignorer que pour de petits n les constantes comptent ; confondre temps et espace ; oublier le coût caché d'une méthode dans une boucle (O(n) dans une boucle O(n) -> O(n²)).
Pour aller plus loin : Θ (theta) et Ω (omega) en bref, l'amorti (push d'un tableau dynamique), pourquoi O(n log n) est la borne des tris par comparaison.
Exercices : (1) donner la complexité de 3 extraits (une boucle, deux imbriquées, une division par 2) ; (2) dire pourquoi un includes dans une boucle rend l'algorithme O(n²) ; (3) classer 5 complexités de la plus rapide à la plus lente.`,
  },
  { num: '02', modNum: '01', modName: 'Penser algorithmes', levelClass: I, levelLabel: IL, durationMin: 32, title: 'La récursion en profondeur', prereq: 'Leçon 01 recommandée',
    brief: `Sujet : résoudre un problème en le ramenant à une version plus petite de lui-même.
Sections : (1) Anatomie : un CAS DE BASE (qui arrête la récursion) et un CAS RÉCURSIF (qui se rapproche du cas de base). (2) La pile d'appels : chaque appel attend le résultat du suivant ; dérouler factorielle(4) pas à pas. (3) Exemples : factorielle, somme d'un tableau, puissance. (4) L'arbre de récursion et le coût : Fibonacci naïf fib(n)=fib(n-1)+fib(n-2) est O(2ⁿ) (montrer l'arbre qui recalcule). (5) La MÉMOÏSATION : mémoriser les résultats déjà calculés (Map) fait passer Fibonacci de O(2ⁿ) à O(n). (6) Récursion vs itération : équivalence, coût en pile (un trop grand n déclenche « Maximum call stack size exceeded »), quand l'une est plus lisible que l'autre. (7) Récursion sur une structure : parcourir un objet/arbre imbriqué.
Code : factorielle ; fib naïf ; fib mémoïsé avec une Map.
Pièges : cas de base manquant ou inatteignable -> débordement de pile ; recalculer les mêmes sous-problèmes (d'où la mémo) ; récursion là où une simple boucle suffit.
Pour aller plus loin : récursion terminale (et le fait qu'elle n'est pas optimisée en pratique dans les moteurs JS), transformer une récursion en itération avec une pile explicite, lien avec la programmation dynamique (leçon 14).
Exercices : (1) écrire puissance(base, exposant) récursive ; (2) écrire une fonction récursive qui somme les éléments d'un tableau imbriqué (ex. [1,[2,[3,4]]]) ; (3) mémoïser une fonction récursive donnée et expliquer le gain de complexité.`,
  },
  { num: '03', modNum: '01', modName: 'Penser algorithmes', levelClass: I, levelLabel: IL, durationMin: 28, title: 'Rechercher : linéaire et binaire', prereq: 'Leçon 02 recommandée',
    brief: `Sujet : trouver un élément dans une collection, efficacement.
Sections : (1) Recherche LINÉAIRE : parcourir jusqu'à trouver. O(n) au pire. Implémenter rechercheLineaire(arr, cible) renvoyant l'index ou -1. (2) Recherche BINAIRE : sur un tableau TRIÉ, on regarde l'élément du milieu et on élimine la moitié à chaque étape. O(log n). (3) Implémentation itérative : let gauche = 0, droite = arr.length - 1 ; while (gauche &lt;= droite) { const milieu = Math.floor((gauche + droite) / 2) ; if (arr[milieu] === cible) return milieu ; if (arr[milieu] &lt; cible) gauche = milieu + 1 ; else droite = milieu - 1 ; } return -1. (4) Déroulé pas à pas sur un petit tableau trié. (5) Version récursive (mêmes idées). (6) Le compromis du tri : la binaire EXIGE un tableau trié ; trier coûte O(n log n), mais si on fait BEAUCOUP de recherches, ça s'amortit largement.
Pièges : appliquer la binaire sur un tableau NON trié (résultat faux) ; erreurs de bornes (gauche &lt;= droite, milieu ± 1) qui causent une boucle infinie ou un élément manqué ; oublier le cas « non trouvé ».
Pour aller plus loin : trouver la PREMIÈRE/DERNIÈRE occurrence (binaire « lower/upper bound »), la dichotomie sur un espace de réponses (pas seulement un tableau), indexOf vs Set.has.
Exercices : (1) écrire rechercheLineaire ; (2) écrire rechercheBinaire itérative et la tester ; (3) modifier la binaire pour renvoyer l'index d'INSERTION (où insérer la cible pour garder le tri).`,
  },
  { num: '04', modNum: '02', modName: 'Trier', levelClass: I, levelLabel: IL, durationMin: 30, title: 'Les tris élémentaires', prereq: 'Module 1 recommandé',
    brief: `Sujet : les trois tris « scolaires » et pourquoi ils sont en O(n²).
Sections : (1) Trier = réorganiser selon un ordre ; rappel : Array.sort() compare en TEXTE par défaut (piège), d'où l'intérêt de comprendre les tris. (2) Tri à BULLES : comparer les voisins et échanger, répéter ; les grands « remontent ». O(n²). (3) Tri par SÉLECTION : à chaque tour, trouver le minimum du reste et le placer. O(n²), peu d'échanges. (4) Tri par INSERTION : insérer chaque élément à sa place dans la partie déjà triée (comme des cartes en main). O(n²) au pire, mais O(n) sur un tableau PRESQUE trié, et efficace sur les petits tableaux. (5) Déroulé pas à pas de l'insertion sur [5,2,4,1]. (6) Stabilité d'un tri (préserver l'ordre des égaux) et notion de tri en place (espace O(1)).
Code : les trois (insertion bien détaillé). Attention à échapper les « &lt; » des comparaisons.
Pièges : O(n²) inutilisable sur de gros tableaux ; oublier que sort() natif est lexicographique ; tris « en place » qui mutent le tableau d'entrée.
Pour aller plus loin : pourquoi l'insertion sert dans les tris hybrides (Timsort, le sort() natif moderne, utilise l'insertion sur les petites tranches), la borne O(n log n) des tris par comparaison.
Exercices : (1) écrire le tri par sélection ; (2) écrire le tri par insertion et le dérouler sur un exemple ; (3) compter le nombre d'échanges du tri à bulles sur un tableau donné.`,
  },
  { num: '05', modNum: '02', modName: 'Trier', levelClass: I, levelLabel: IL, durationMin: 32, title: 'Le tri fusion (merge sort)', prereq: 'Leçon 04 recommandée',
    brief: `Sujet : un premier tri efficace, en O(n log n), par « diviser pour régner ».
Sections : (1) L'idée DIVISER POUR RÉGNER : couper le tableau en deux, trier chaque moitié (récursivement), puis FUSIONNER les deux moitiés triées. (2) La fusion de deux tableaux triés : avancer deux pointeurs et prendre le plus petit à chaque fois -> O(n). Implémenter fusion(a, b). (3) Le tri récursif : if (arr.length &lt;= 1) return arr ; couper au milieu ; return fusion(triFusion(gauche), triFusion(droite)). (4) Déroulé sur [5,2,4,1] (arbre de découpe puis de fusion). (5) Analyse : log n niveaux de découpe, O(n) de travail de fusion par niveau -> O(n log n) en temps ; O(n) en ESPACE (tableaux temporaires). (6) Propriétés : stable, performances GARANTIES (même au pire cas), idéal pour les listes chaînées et le tri externe.
Code : fusion(a,b) puis triFusion(arr). Bien échapper les « &lt;= ».
Pièges : oublier le cas de base (tableau de 0 ou 1 élément) ; mal fusionner (oublier le reste d'un des deux tableaux) ; sous-estimer le coût mémoire O(n).
Pour aller plus loin : version « bottom-up » itérative, tri stable et son importance (trier par plusieurs clés), pourquoi merge sort est préféré pour les données qui ne tiennent pas en mémoire.
Exercices : (1) écrire fusion(a,b) de deux tableaux triés ; (2) écrire triFusion complet ; (3) compter combien de fois la fonction est appelée pour un tableau de 8 éléments.`,
  },
  { num: '06', modNum: '02', modName: 'Trier', levelClass: A, levelLabel: AL, durationMin: 32, title: 'Tri rapide et tri par tas', prereq: 'Leçon 05 recommandée',
    brief: `Sujet : le tri rapide (quicksort), très utilisé en pratique, et un aperçu du tri par tas.
Sections : (1) QUICKSORT — l'idée : choisir un PIVOT, PARTITIONNER le tableau (éléments &lt; pivot à gauche, &gt; pivot à droite), puis trier récursivement chaque côté. (2) La partition : montrer un schéma simple (par exemple le schéma de Lomuto) ; en place. (3) Implémentation (version lisible avec filtres OU en place) ; déroulé pas à pas. (4) Complexité : O(n log n) en MOYENNE, mais O(n²) au PIRE (pivot mal choisi, ex. tableau déjà trié avec pivot extrême) ; O(log n) d'espace (pile de récursion) en version en place. (5) Choix du pivot : aléatoire ou « médiane de trois » pour éviter le pire cas. (6) Aperçu du TRI PAR TAS (heap sort) : construire un tas puis extraire le maximum n fois -> O(n log n) garanti, en place (renvoyer vers la leçon 11 sur les tas). (7) Tableau RÉCAPITULATIF des tris vus (bulle/sélection/insertion/fusion/rapide/tas) avec temps moyen, pire cas, espace, stabilité.
Code : quickSort avec partition. Échapper « &lt; ».
Pièges : pire cas O(n²) sur entrée déjà triée avec mauvais pivot ; partition incorrecte ; récursion profonde (préférer récurser sur la petite partie).
Pour aller plus loin : tri introspectif (introsort, bascule vers heap sort si la récursion est trop profonde — c'est ce qu'utilisent beaucoup de bibliothèques), tris NON comparatifs (counting/radix sort) en O(n) sous conditions.
Exercices : (1) écrire la fonction de partition ; (2) écrire quickSort complet ; (3) donner une entrée qui déclenche le pire cas O(n²) et expliquer comment l'éviter.`,
  },
  { num: '07', modNum: '03', modName: 'Structures linéaires', levelClass: I, levelLabel: IL, durationMin: 32, title: 'Les listes chaînées', prereq: 'Module 2 recommandé',
    brief: `Sujet : une structure où chaque élément pointe vers le suivant.
Sections : (1) Le problème : un tableau a un coût O(n) pour insérer/supprimer au début (tout décaler). La liste chaînée résout ça. (2) Le NŒUD : { valeur, suivant } ; la liste retient une référence vers la TÊTE. (3) Opérations : insertion en TÊTE O(1) ; parcours O(n) ; recherche O(n) ; insertion/suppression en QUEUE O(n) (ou O(1) si on garde une référence de queue) ; suppression d'un nœud (relier le précédent au suivant). (4) Implémenter une classe ListeChainee (#tete, ajouterDebut, ajouterFin, supprimer(valeur), parcourir/toArray, taille). (5) Déroulé d'une insertion et d'une suppression (gestion des références). (6) Liste DOUBLEMENT chaînée : { valeur, precedent, suivant } -> suppression O(1) si on a le nœud, parcours dans les deux sens. (7) Tableau vs liste chaînée : accès indexé O(1) (tableau) vs O(n) (liste) ; insertion en tête O(n) (tableau) vs O(1) (liste) ; cache/mémoire.
Code : classe ListeChainee (avec champs privés #). Échapper si besoin.
Pièges : perdre la référence à la suite lors d'une insertion (ordre des affectations) ; oublier de gérer la tête (liste vide, suppression de la tête) ; null/undefined en fin de liste.
Pour aller plus loin : liste circulaire, sentinelle (nœud factice) pour simplifier les bords, pourquoi JS n'a pas de liste chaînée native (les tableaux et Map couvrent la plupart des besoins).
Exercices : (1) écrire ajouterDebut et toArray ; (2) écrire supprimer(valeur) ; (3) inverser une liste chaînée en O(n) sans créer de nouvelle liste.`,
  },
  { num: '08', modNum: '03', modName: 'Structures linéaires', levelClass: I, levelLabel: IL, durationMin: 30, title: 'Piles et files', prereq: 'Leçon 07 recommandée',
    brief: `Sujet : deux structures d'accès restreint, omniprésentes.
Sections : (1) La PILE (stack) — LIFO (dernier entré, premier sorti) : opérations empiler (push) et dépiler (pop), voir le sommet (peek). O(1). Usages : annuler/refaire, la pile d'APPELS, l'évaluation d'expressions, le retour arrière (backtracking). (2) Implémentation avec un tableau (push/pop sont déjà O(1)) -> classe Pile. (3) Application concrète : vérifier que des PARENTHÈSES sont équilibrées avec une pile (donner le code). (4) La FILE (queue) — FIFO (premier entré, premier sorti) : enfiler et défiler. Usages : files d'attente, BFS (leçon 12), traitement de tâches. (5) Le piège de la file naïve : arr.shift() est O(n) ! Implémenter une file EFFICACE (deux piles, ou un tableau avec un index de tête, ou une liste chaînée avec référence de queue) pour défiler en O(1) amorti. (6) Le DEQUE (double-ended) en une phrase.
Code : classe Pile ; classe File efficace ; parenthèses équilibrées.
Pièges : utiliser shift() pour une file (O(n)) ; dépiler/défiler une structure vide (gérer) ; confondre LIFO et FIFO.
Pour aller plus loin : pile pour convertir/évaluer une expression (notation polonaise inverse), file circulaire (buffer), file de priorité (leçon 11).
Exercices : (1) écrire une classe Pile et l'utiliser pour inverser une chaîne ; (2) vérifier des parenthèses/accolades/crochets équilibrés ; (3) implémenter une File en O(1) amorti avec deux piles.`,
  },
  { num: '09', modNum: '03', modName: 'Structures linéaires', levelClass: I, levelLabel: IL, durationMin: 32, title: 'Les tables de hachage', prereq: 'Leçon 08 recommandée',
    brief: `Sujet : comment obtenir un accès en O(1) — la structure derrière Map et les objets JS.
Sections : (1) Le problème : trouver une valeur par sa clé sans parcourir (O(1) au lieu de O(n)). (2) La FONCTION DE HACHAGE : transforme une clé (souvent une chaîne) en un index de tableau. Donner un exemple simple de hachage de chaîne (somme/poly des codes de caractères modulo la taille). (3) Les COLLISIONS (deux clés -> même index) sont inévitables ; résolution par CHAÎNAGE (chaque case contient une liste de paires) ou par adressage ouvert (sondage). (4) Implémenter une mini-table par chaînage : set(cle, valeur), get(cle), has(cle), avec hachage + parcours de la petite liste de la case. (5) Complexité : O(1) en MOYENNE (amorti), O(n) au PIRE (toutes les clés en collision) ; importance d'une bonne fonction de hachage et du FACTEUR DE CHARGE (redimensionner quand la table se remplit). (6) En vrai, en JS : Map et Set (et les objets) SONT des tables de hachage optimisées — quand préférer Map à un objet (clés non-chaînes, taille, ordre). (7) Cas d'usage : compter des occurrences, déduplication, index/cache, recherche d'un complément (somme de deux nombres).
Code : classe TableHachage par chaînage (hash, set, get).
Pièges : mauvaise fonction de hachage (trop de collisions -> O(n)) ; muter une clé objet ; croire que l'ordre est aléatoire (Map préserve l'insertion) ; oublier le redimensionnement.
Pour aller plus loin : adressage ouvert vs chaînage, hachage cryptographique vs hachage de table (différents buts), pourquoi l'amorti.
Exercices : (1) écrire une fonction de hachage de chaîne simple ; (2) compter les occurrences de chaque mot d'un texte avec une Map ; (3) trouver en O(n) si deux éléments d'un tableau ont une somme égale à une cible (table de hachage des compléments).`,
  },
  { num: '10', modNum: '04', modName: 'Structures hiérarchiques & graphes', levelClass: A, levelLabel: AL, durationMin: 32, title: 'Arbres binaires et arbres de recherche', prereq: 'Module 3 recommandé',
    brief: `Sujet : organiser des données en hiérarchie, et accélérer la recherche.
Sections : (1) Vocabulaire : racine, nœud, enfant, parent, feuille, sous-arbre, profondeur, HAUTEUR. (2) Arbre BINAIRE : chaque nœud a au plus deux enfants (gauche, droite). Nœud = { valeur, gauche, droite }. (3) Les PARCOURS en profondeur (récursifs) : in-order (gauche, nœud, droite), pre-order (nœud, gauche, droite), post-order (gauche, droite, nœud) ; donner le code des trois. (4) Le parcours en LARGEUR (BFS, par niveau) avec une FILE. (5) L'ARBRE BINAIRE DE RECHERCHE (ABR/BST) : propriété d'ordre — tout à gauche &lt; nœud &lt; tout à droite. Insertion et recherche en suivant la comparaison : O(h) où h est la hauteur. (6) Le point clé de complexité : si l'arbre est ÉQUILIBRÉ, h ≈ log n -> O(log n) ; s'il est DÉGÉNÉRÉ (insertions déjà triées -> peigne), h = n -> O(n). (7) Le parcours in-order d'un ABR donne les valeurs TRIÉES.
Code : classe ABR avec inserer(valeur), contient(valeur), inOrder(). Échapper « &lt; ».
Pièges : arbre dégénéré (d'où les arbres équilibrés) ; confondre les trois parcours ; oublier le cas de l'arbre vide.
Pour aller plus loin : arbres AUTO-ÉQUILIBRÉS (AVL, rouge-noir) qui garantissent O(log n), arbres B (bases de données), tas (leçon suivante) qui sont aussi des arbres.
Exercices : (1) écrire les parcours pre/in/post-order ; (2) insérer dans un ABR et vérifier que l'in-order ressort trié ; (3) calculer la hauteur d'un arbre binaire de façon récursive.`,
  },
  { num: '11', modNum: '04', modName: 'Structures hiérarchiques & graphes', levelClass: A, levelLabel: AL, durationMin: 32, title: 'Tas et file de priorité', prereq: 'Leçon 10 recommandée',
    brief: `Sujet : récupérer toujours le plus petit (ou le plus grand) élément, efficacement.
Sections : (1) Le besoin : une FILE DE PRIORITÉ — défiler l'élément de plus haute priorité, pas le plus ancien. (2) Le TAS BINAIRE (binary heap) : un arbre binaire COMPLET stocké dans un TABLEAU. Tas-min : chaque parent &lt;= ses enfants (la racine est le minimum). (3) Les index dans le tableau : pour un nœud à l'index i, ses enfants sont 2i+1 et 2i+2, son parent est Math.floor((i-1)/2). (4) INSÉRER : ajouter à la fin puis « remonter » (percolate up) tant qu'on est plus petit que son parent. O(log n). (5) EXTRAIRE LE MIN : prendre la racine, mettre le dernier élément à la racine, puis « descendre » (percolate down) vers le plus petit enfant. O(log n). (6) Implémenter une classe TasMin (#tas, inserer, extraireMin, taille). Déroulé pas à pas. (7) Complexité et usages : insertion/extraction O(log n), consultation du min O(1) ; usages = Dijkstra (plus court chemin), ordonnancement, top-K éléments, fusion de k listes triées.
Code : classe TasMin. Échapper « &lt;= ».
Pièges : se tromper dans les formules d'index ; oublier de rétablir la propriété de tas après insertion/extraction ; confondre tas (heap, la structure) et le « tas » mémoire.
Pour aller plus loin : construire un tas en O(n) (heapify), le tri par tas (heap sort), les tas d-aires et de Fibonacci (mention).
Exercices : (1) écrire les helpers indexParent/indexEnfants ; (2) écrire inserer avec la remontée ; (3) trouver les K plus grands éléments d'un tableau avec un tas-min de taille K.`,
  },
  { num: '12', modNum: '04', modName: 'Structures hiérarchiques & graphes', levelClass: A, levelLabel: AL, durationMin: 34, title: 'Les graphes : représentation et parcours', prereq: 'Leçon 11 recommandée',
    brief: `Sujet : modéliser des relations (réseaux, cartes, dépendances) et les explorer.
Sections : (1) Définitions : SOMMETS (nœuds) et ARÊTES (liens) ; graphe ORIENTÉ vs non orienté ; PONDÉRÉ (poids sur les arêtes) ; cycle, connexité. (2) Représentations : LISTE D'ADJACENCE (une Map sommet -> tableau de voisins) — compacte, idéale pour les graphes creux ; MATRICE D'ADJACENCE (tableau 2D booléen) — accès O(1) à une arête mais O(V²) en mémoire. Quand choisir quoi. (3) Construire un graphe en liste d'adjacence (classe Graphe : ajouterSommet, ajouterArete). (4) Le parcours en LARGEUR (BFS) : avec une FILE et un Set de VISITÉS ; explore par « cercles » concentriques ; donne le plus court chemin en NOMBRE d'arêtes dans un graphe non pondéré. (5) Le parcours en PROFONDEUR (DFS) : récursif (ou avec une pile) + visités ; plonge le plus loin possible. (6) Déroulé de BFS et DFS sur un petit graphe. (7) Usages : plus court chemin, détection de cycle, composantes connexes, ordre topologique (mention).
Code : classe Graphe (Map d'adjacence) + bfs(depart) + dfs(depart). Échapper si besoin.
Pièges : OUBLIER l'ensemble des visités -> boucle infinie sur les cycles ; confondre orienté/non orienté (ajouter l'arête dans les deux sens) ; utiliser shift() comme file (O(n)) sur de gros graphes.
Pour aller plus loin : Dijkstra (plus court chemin pondéré, avec un tas), A*, tri topologique, l'union-find pour la connexité.
Exercices : (1) construire un graphe non orienté et lister les voisins d'un sommet ; (2) écrire un BFS qui renvoie l'ordre de visite ; (3) détecter s'il existe un chemin entre deux sommets (DFS/BFS).`,
  },
  { num: '13', modNum: '05', modName: 'Techniques de conception', levelClass: A, levelLabel: AL, durationMin: 30, title: 'Les algorithmes gloutons (greedy)', prereq: 'Module 4 recommandé',
    brief: `Sujet : construire une solution en faisant, à chaque étape, le choix qui semble le meilleur sur le moment.
Sections : (1) Le principe GLOUTON : choix localement optimal, sans revenir en arrière ; simple et rapide quand il marche. (2) Quand ça MARCHE : il faut la « propriété de choix glouton » et une « sous-structure optimale ». (3) Exemple 1 — sélection d'ACTIVITÉS : choisir le maximum d'activités non chevauchantes en triant par heure de FIN puis en prenant gloutonnement. Donner le code et l'intuition de la preuve. (4) Exemple 2 — rendu de MONNAIE : avec un système canonique (ex. euros), prendre la plus grosse pièce possible à chaque fois est optimal ; MONTRER un contre-exemple (système {1,3,4} pour rendre 6) où le glouton ÉCHOUE (donne 4+1+1 au lieu de 3+3) -> il faudra la programmation dynamique (leçon 14). (5) Exemple 3 — sac à dos FRACTIONNAIRE : trier par valeur/poids et remplir gloutonnement (optimal car on peut couper les objets). (6) Comparaison glouton vs DP vs force brute.
Code : sélection d'activités ; rendu de monnaie glouton (+ le contre-exemple).
Pièges : appliquer un glouton à un problème où il n'est pas optimal (sac à dos 0/1, rendu non canonique) ; oublier de PROUVER (ou au moins justifier) l'optimalité ; mauvais critère de tri.
Pour aller plus loin : Huffman (compression), Kruskal/Prim (arbre couvrant minimal) comme algorithmes gloutons, la frontière avec la programmation dynamique.
Exercices : (1) rendu de monnaie glouton sur un système canonique ; (2) sélection d'activités à partir d'une liste d'intervalles ; (3) donner un système de pièces où le glouton n'est pas optimal et l'expliquer.`,
  },
  { num: '14', modNum: '05', modName: 'Techniques de conception', levelClass: A, levelLabel: AL, durationMin: 34, title: 'La programmation dynamique', prereq: 'Leçon 13 recommandée',
    brief: `Sujet : résoudre un problème en combinant les solutions de sous-problèmes qui se répètent.
Sections : (1) Les deux conditions : SOUS-PROBLÈMES QUI SE CHEVAUCHENT (on recalcule les mêmes choses) et SOUS-STRUCTURE OPTIMALE (la solution optimale se compose de solutions optimales de sous-problèmes). (2) Deux styles : MÉMOÏSATION (haut-bas : récursion + cache) et TABULATION (bas-haut : remplir un tableau des petits cas vers les grands). (3) Exemple fil conducteur — FIBONACCI : du naïf O(2ⁿ) au mémoïsé O(n) au tabulé O(n) avec O(1) d'espace. (4) Exemple — MONTÉE D'ESCALIER (combien de façons de monter n marches par pas de 1 ou 2) : c'est Fibonacci déguisé ; identifier l'ÉTAT et la TRANSITION. (5) Exemple — SAC À DOS 0/1 : état dp[i][c] = meilleure valeur avec les i premiers objets et une capacité c ; transition prendre / ne pas prendre ; donner le code (tableau 2D, puis mention de l'optimisation 1D). (6) La MÉTHODE pour concevoir une solution DP : définir l'état, la transition (récurrence), les cas de base, l'ordre de remplissage, lire la réponse. (7) Complexité = (nombre d'états) × (coût par état).
Code : fibTabule ; sacADos01(poids, valeurs, capacite). Échapper « &lt;= ».
Pièges : mal définir l'état (oublier une dimension) ; mauvais ordre de remplissage (dépendances non prêtes) ; confondre 0/1 et fractionnaire ; sous-estimer la complexité spatiale.
Pour aller plus loin : plus longue sous-séquence commune (LCS), distance d'édition, DP sur les intervalles/arbres, la reconstruction de la solution (pas seulement sa valeur).
Exercices : (1) écrire le nombre de façons de monter un escalier (tabulation) ; (2) écrire le sac à dos 0/1 ; (3) calculer la plus longue sous-séquence croissante (au moins en O(n²)).`,
  },
  { num: '15', modNum: '05', modName: 'Techniques de conception', levelClass: I, levelLabel: IL, durationMin: 32, title: "Patterns d'entretien & synthèse", prereq: 'Leçon 14 recommandée',
    brief: `Sujet : les schémas récurrents qui résolvent une grande partie des exercices, et une carte de fin de parcours.
Sections : (1) DEUX POINTEURS (two pointers) : sur un tableau TRIÉ, avancer deux indices depuis les extrémités (ou même sens) ; exemple : trouver une paire de somme cible en O(n) (au lieu de O(n²)). (2) FENÊTRE GLISSANTE (sliding window) : maintenir une fenêtre [g, d] et l'agrandir/rétrécir ; exemples : somme maximale d'un sous-tableau de taille k, plus longue sous-chaîne sans caractère répété. (3) RAPIDE & LENT (Floyd) : deux pointeurs à vitesses différentes ; détecter un cycle, trouver le milieu d'une liste. (4) SOMMES PRÉFIXÉES (prefix sums) : pré-calculer les cumuls pour répondre aux sommes d'intervalles en O(1). (5) DICHOTOMIE SUR LA RÉPONSE : binaire non sur un tableau mais sur l'espace des réponses possibles. (6) <h2>La carte des structures & algorithmes</h2> : un tableau « quel outil pour quel besoin » (recherche -> table de hachage/binaire ; min/max dynamique -> tas ; relations -> graphe + BFS/DFS ; sous-problèmes répétés -> DP ; etc.) avec les complexités. (7) <h2>La méthode en entretien</h2> : clarifier l'énoncé, donner des exemples, partir d'une force brute, optimiser, ANNONCER la complexité, traiter les cas limites, tester à la main. (8) <h2>Et après</h2> : pratiquer (plateformes type LeetCode), revoir les complexités, encourager.
Remplace « Pièges fréquents » par une courte checklist d'entretien ; GARDE « Pour aller plus loin », « Récap et vérification » et « Exercices ».
Code : deux pointeurs (paire de somme cible) ; fenêtre glissante (plus longue sous-chaîne sans répétition). Échapper « &lt; ».
Exercices : (1) paire de somme cible avec deux pointeurs sur un tableau trié ; (2) somme maximale d'un sous-tableau de k éléments (fenêtre glissante) ; (3) détecter un doublon dans un tableau en O(n) temps / O(n) espace, puis discuter une version O(1) espace si le tableau est triable.`,
  },
];

log('Rédaction de ' + SPECS.length + ' leçons (Algorithmes & structures de données)…');

const results = await pipeline(
  SPECS,
  (s) =>
    agent(
      INSTRUCTIONS +
        '\n\n=== LEÇON À RÉDIGER ===\nNuméro : ' + s.num + ' | Module ' + s.modNum + ' (' + s.modName + ') | Niveau : ' + s.levelLabel + '\nTitre : ' + s.title +
        '\n\nBRIEF DÉTAILLÉ (intègre fidèlement le contenu, le code, les complexités et les pièges ; développe la prose et les déroulés) :\n' + s.brief,
      { label: 'écrit L' + s.num, phase: 'Rédaction', schema: SCHEMA }
    ),
  (parts, s) =>
    agent(
      INSTRUCTIONS +
        '\n\n=== RELECTURE CRITIQUE (corrige et renvoie la version finale, même schéma) ===\nLeçon ' + s.num + ' « ' + s.title + ' ».\n' +
        '1. EXACTITUDE algorithmique : le code doit être correct ET la COMPLEXITÉ (temps + espace) doit être donnée et juste pour chaque algorithme/structure.\n' +
        '2. ÉCHAPPEMENT du code (essentiel ici, beaucoup de comparaisons) : « < » → « &lt; » (« gauche &lt;= droite », « i &lt; n »), « & » → « &amp; ». Corrige tout oubli.\n' +
        '3. STRUCTURE : intro, 5–8 sections <h2> (avec déroulé pas à pas + analyse de complexité), Pièges fréquents (sauf L15 : checklist), Pour aller plus loin, Récap et vérification (lesson-check), Exercices (3 gradués avec solutions).\n' +
        '4. PUBLIC : connaît déjà JavaScript ; ne réexplique pas la syntaxe de base ; concentre-toi sur l\'algorithmique ; densité ≈1300–1900 mots.\n' +
        '5. HTML valide, classes autorisées uniquement, AUCUN style/script inline.\n\n' +
        'BRIEF DE RÉFÉRENCE :\n' + s.brief + '\n\nBROUILLON (JSON) :\n' + JSON.stringify(parts),
      { label: 'relit L' + s.num, phase: 'Relecture', schema: SCHEMA }
    ).then((fixed) => {
      const p = fixed || parts;
      const html = buildLesson({
        num: s.num, modNum: s.modNum, modName: s.modName, levelClass: s.levelClass,
        levelLabel: s.levelLabel, durationMin: s.durationMin, title: s.title, prereq: s.prereq,
        metaDesc: p.metaDesc, objectives: p.objectives, body: p.body,
      });
      return { file: 'lecon-' + s.num + '.html', html, num: s.num };
    })
);

const ok = results.filter(Boolean);
log('Leçons assemblées : ' + ok.length + '/' + SPECS.length);
return ok;
