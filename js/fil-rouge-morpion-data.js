/* =============================================================================
   fil-rouge-morpion-data.js — FIL ROUGE « Une IA imbattable au morpion ».
   Le même jeu (le morpion / tic-tac-toe) et son IA, vus sous plusieurs angles :
   Python (impératif) → algo (minimax) → Prolog (logique) → Haskell (fonctionnel)
   → JavaScript (jouer dans le navigateur). Définit window.FIL_ROUGE.
   Page : pages/fil-rouge-morpion.html. 100 % file://.
   ============================================================================= */
window.FIL_ROUGE = {
  id: "morpion",
  titre: "Une IA imbattable au morpion",
  sousTitre: "Le même jeu, la même IA vue sous tous les angles — impératif, algorithmique, logique, fonctionnel, web.",
  intro:
    "<p>Le <strong>morpion</strong> (tic-tac-toe) est minuscule, mais il cache un trésor pédagogique : une <strong>IA " +
    "imbattable</strong>. Tu construis le jeu, puis tu écris l'algorithme <strong>minimax</strong> qui ne perd jamais, et " +
    "tu le revisites dans plusieurs <strong>paradigmes</strong> : impératif (Python), théorie (algo), logique (Prolog), " +
    "fonctionnel pur (Haskell), interactif (JavaScript).</p>" +
    "<p>Les règles ne changent pas : c'est ta <strong>façon de penser l'IA</strong> qui change à chaque étape. Une même " +
    "idée, cinq éclairages.</p>",
  etapes: [
    {
      n: 1,
      course: "python",
      courseTitle: "Python",
      dir: "python",
      accent: "python",
      phase: "Le jeu & l'IA",
      titre: "Le jeu jouable et une première IA",
      depart: "Une idée de morpion à deux joueurs.",
      objectif:
        "<p>Construire le <strong>morpion</strong> jouable en Python (plateau, coups, détection de victoire) et lui donner " +
        "une <strong>première IA</strong> simple (coups valides, aléatoire ou règles).</p>",
      ajoute: [
        "Le <strong>plateau</strong> (3×3) et l'alternance des joueurs.",
        "La détection des <strong>coups valides</strong> et de la <strong>victoire</strong>/match nul.",
        "Une <strong>première IA</strong> (coup aléatoire, ou règles simples).",
        "Une boucle de <strong>partie</strong> jouable en console.",
      ],
      criteres: [
        "Le <strong>plateau</strong> et les coups sont modélisés clairement.",
        "La <strong>victoire</strong> et le <strong>match nul</strong> sont détectés.",
        "Une <strong>IA</strong> joue des coups valides.",
        "Une partie complète est <strong>jouable</strong> (humain vs IA).",
        "Le programme <strong>tourne</strong> sans erreur.",
      ],
      livrable: "Un morpion jouable avec une IA basique, en Python.",
    },
    {
      n: 2,
      course: "algo",
      courseTitle: "Algorithmes",
      dir: "algo",
      accent: "algo",
      phase: "Le jeu & l'IA",
      titre: "L'IA imbattable (minimax)",
      depart: "Le morpion Python de l'étape 1.",
      objectif:
        "<p>Rendre l'IA <strong>imbattable</strong> avec l'algorithme <strong>minimax</strong> (théorie des jeux), puis " +
        "l'accélérer avec l'<strong>élagage alpha-bêta</strong>.</p>",
      ajoute: [
        "L'algorithme <strong>minimax</strong> récursif (explorer les coups, choisir le meilleur).",
        "Une <strong>fonction d'évaluation</strong> des positions (gagné / perdu / nul).",
        "L'<strong>élagage alpha-bêta</strong> pour couper les branches inutiles.",
        "Une analyse de la <strong>complexité</strong> (arbre des coups).",
      ],
      criteres: [
        "L'IA <strong>minimax</strong> est récursive et explore l'arbre des coups.",
        "L'IA est <strong>imbattable</strong> (elle ne perd jamais, au pire match nul).",
        "L'<strong>élagage alpha-bêta</strong> réduit le nombre de nœuds explorés.",
        "La <strong>complexité</strong> est annoncée et discutée.",
        "Les <strong>cas limites</strong> (plateau plein, victoire immédiate) sont gérés.",
      ],
      livrable: "Une IA imbattable (minimax + alpha-bêta).",
    },
    {
      n: 3,
      course: "prolog",
      courseTitle: "Prolog",
      dir: "prolog",
      accent: "prolog",
      phase: "Autres paradigmes",
      titre: "Le morpion en règles logiques",
      depart: "Le jeu et son IA (étapes 1-2).",
      objectif:
        "<p>Changer de point de vue : en <strong>Prolog</strong>, le jeu se décrit par des <strong>règles logiques</strong>. " +
        "Tu déclares ce qu'est une victoire et un coup valide, le moteur déduit le reste.</p>",
      ajoute: [
        "Les <strong>faits</strong> et règles du plateau (cases, joueurs).",
        "Les règles de <strong>victoire</strong> (lignes, colonnes, diagonales).",
        "La génération des <strong>coups valides</strong> par unification.",
        "Des <strong>requêtes</strong> qui exploitent le backtracking.",
      ],
      criteres: [
        "Des <strong>règles</strong> décrivent la victoire (lignes/colonnes/diagonales).",
        "Les <strong>coups valides</strong> sont obtenus par <strong>unification</strong>.",
        "Le <strong>backtracking</strong> explore les possibilités.",
        "Les <strong>requêtes</strong> répondent correctement (qui gagne, quels coups).",
        "Le programme se <strong>charge et répond</strong> (<code>swipl</code>).",
      ],
      livrable: "Le morpion décrit en règles logiques (Prolog).",
    },
    {
      n: 4,
      course: "haskell",
      courseTitle: "Haskell",
      dir: "haskell",
      accent: "haskell",
      phase: "Autres paradigmes",
      titre: "L'IA en fonctionnel pur",
      depart: "Le jeu et son IA (étapes 1-3).",
      objectif:
        "<p>Écrire l'IA en <strong>Haskell pur</strong> : un <strong>minimax</strong> élégant et sans effet de bord, où " +
        "les types et la récursivité rendent l'algorithme limpide.</p>",
      ajoute: [
        "Un <strong>type</strong> pour le plateau et l'état de la partie.",
        "L'évaluation d'une position par <strong>pattern matching</strong>.",
        "Le <strong>minimax</strong> en fonction récursive pure.",
        "Des <strong>fonctions pures</strong> (les effets restent dans <code>main</code>).",
      ],
      criteres: [
        "Un <strong>type</strong> modélise le plateau / l'état.",
        "L'<strong>évaluation</strong> se fait par pattern matching.",
        "Le <strong>minimax</strong> est une fonction récursive <strong>pure</strong>.",
        "L'IA reste <strong>imbattable</strong> (mêmes décisions que l'étape 2).",
        "Le programme <strong>compile</strong> (<code>ghc</code>) et joue correctement.",
      ],
      livrable: "L'IA du morpion en Haskell fonctionnel pur.",
    },
    {
      n: 5,
      course: "javascript",
      courseTitle: "JavaScript",
      dir: "js",
      accent: "javascript",
      phase: "Jouer",
      titre: "Jouer contre l'IA dans le navigateur",
      depart: "Le jeu et l'IA imbattable (étapes 1-4).",
      objectif:
        "<p>Donner une vraie <strong>interface</strong> : une grille cliquable dans le navigateur, où l'on affronte l'IA " +
        "minimax — qui ne perd jamais.</p>",
      ajoute: [
        "Une <strong>grille</strong> 3×3 cliquable, dessinée en DOM.",
        "Le portage de l'<strong>IA minimax</strong> en JavaScript.",
        "La gestion des <strong>événements</strong> (clic) et de l'alternance des tours.",
        "L'affichage du <strong>résultat</strong> (victoire / nul) et un bouton « Rejouer ».",
      ],
      criteres: [
        "La <strong>grille</strong> est cliquable et se met à jour (DOM).",
        "L'<strong>IA minimax</strong> joue dans le navigateur et reste imbattable.",
        "Les <strong>tours</strong> alternent correctement (humain ↔ IA).",
        "Le <strong>résultat</strong> s'affiche ; « Rejouer » réinitialise sans recharger.",
        "Aucune <strong>erreur</strong> dans la console.",
      ],
      livrable: "🏁 Un morpion jouable contre une IA imbattable — la même idée vue en cinq paradigmes !",
    },
  ],
};
