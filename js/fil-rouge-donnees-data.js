/* =============================================================================
   fil-rouge-donnees-data.js — FIL ROUGE « Une analyse de données de bout en bout ».
   Un même jeu de données mené du prototype à la production : explorer (Python),
   stocker & interroger (SQL), modéliser & visualiser (R), industrialiser (Python
   avancé). Définit window.FIL_ROUGE → moteur générique js/fil-rouge.js.
   Page : pages/fil-rouge-donnees.html. 100 % file://.
   ============================================================================= */
window.FIL_ROUGE = {
  id: "donnees",
  titre: "Une analyse de données de bout en bout",
  sousTitre: "Un même jeu de données, de l'exploration au pipeline industrialisé — Python, SQL, R, Python avancé.",
  intro:
    "<p>Une vraie analyse de données ne tient pas dans un seul outil. Tu pars d'un <strong>jeu de données</strong> (par ex. " +
    "des ventes), tu l'<strong>explores</strong> en Python, tu le <strong>stockes et l'interroges</strong> en SQL, tu le " +
    "<strong>modélises et le visualises</strong> en R, puis tu <strong>industrialises</strong> le tout en Python avancé.</p>" +
    "<p>Le fil conducteur, c'est <strong>la donnée</strong> : à chaque étape elle est mieux rangée, mieux comprise, et le " +
    "traitement devient plus fiable et reproductible.</p>",
  etapes: [
    {
      n: 1,
      course: "python",
      courseTitle: "Python",
      dir: "python",
      accent: "python",
      phase: "Explorer",
      titre: "Explorer et nettoyer les données",
      depart: "Un jeu de données brut (CSV) et beaucoup de questions.",
      objectif:
        "<p>Faire connaissance avec les données en <strong>Python</strong> : les charger, les nettoyer, et en tirer les " +
        "premières statistiques — le prototype d'analyse.</p>",
      ajoute: [
        "Le <strong>chargement</strong> des données (CSV) et un premier survol.",
        "Le <strong>nettoyage</strong> (valeurs manquantes, types, doublons).",
        "Des <strong>statistiques</strong> de base (totaux, moyennes, par catégorie).",
        "Une organisation en <strong>fonctions</strong> réutilisables.",
      ],
      criteres: [
        "Les données sont <strong>chargées</strong> et parcourues (dictionnaires/listes ou pandas).",
        "Un <strong>nettoyage</strong> est appliqué (valeurs manquantes, types).",
        "Des <strong>statistiques</strong> par catégorie sont calculées.",
        "Le code est découpé en <strong>fonctions</strong>.",
        "Le programme <strong>s'exécute</strong> sans erreur sur le jeu de données.",
      ],
      livrable: "Un prototype d'exploration des données, en Python.",
    },
    {
      n: 2,
      course: "sql",
      courseTitle: "SQL",
      dir: "sql",
      accent: "sql",
      phase: "Stocker & interroger",
      titre: "Stocker et interroger en base",
      depart: "Les données explorées et nettoyées de l'étape 1.",
      objectif:
        "<p>Donner une vraie maison aux données : un <strong>schéma relationnel</strong> et des <strong>requêtes SQL</strong> " +
        "pour répondre efficacement aux questions, même sur de gros volumes.</p>",
      ajoute: [
        "Un <strong>schéma</strong> (tables + clés) pour les données.",
        "L'<strong>import</strong> des données nettoyées en base.",
        "Des requêtes d'<strong>agrégation</strong> (<code>GROUP BY</code>, totaux par catégorie/période).",
        "Au moins une <strong>jointure</strong> et une <strong>fonction de fenêtrage</strong> (classement, cumul).",
      ],
      criteres: [
        "Les tables ont des <strong>clés</strong> (<code>PRIMARY KEY</code>, <code>FOREIGN KEY</code>).",
        "Les données sont <strong>insérées</strong> en base.",
        "Une requête <strong>agrège</strong> (<code>GROUP BY</code> + <code>SUM</code>/<code>COUNT</code>).",
        "Au moins une <strong>jointure</strong> est utilisée.",
        "Une <strong>fonction de fenêtrage</strong> (<code>ROW_NUMBER</code>/<code>SUM OVER</code>) produit un classement ou un cumul.",
      ],
      livrable: "Les données rangées en base, interrogeables en SQL.",
    },
    {
      n: 3,
      course: "r",
      courseTitle: "R",
      dir: "r",
      accent: "r",
      phase: "Modéliser & visualiser",
      titre: "Modéliser et visualiser",
      depart: "Les données en base de l'étape 2 (ou exportées).",
      objectif:
        "<p>Faire parler les données avec <strong>R</strong> : statistiques plus poussées, une tendance ou un modèle, et " +
        "surtout des <strong>graphiques</strong> qui rendent les résultats évidents.</p>",
      ajoute: [
        "Le chargement dans un <strong>data frame</strong> et une agrégation.",
        "Des <strong>statistiques</strong> descriptives (corrélation, tendance).",
        "Au moins un <strong>modèle</strong> simple (régression) ou un test.",
        "Plusieurs <strong>graphiques</strong> (barres, nuage de points, courbe).",
      ],
      criteres: [
        "Les données sont dans un <strong>data frame</strong>.",
        "Des <strong>statistiques</strong> descriptives sont calculées.",
        "Un <strong>modèle</strong> ou une tendance est produit (régression, test…).",
        "Au moins <strong>deux graphiques</strong> différents sont générés.",
        "Les <strong>conclusions</strong> sont commentées dans le script.",
      ],
      livrable: "Une analyse statistique visualisée, en R.",
    },

    {
      n: 4,
      course: "julia",
      courseTitle: "Julia",
      dir: "julia",
      accent: "julia",
      phase: "Calculer",
      titre: "Accélérer les calculs avec Julia",
      depart: "L'analyse (exploration → base → modèle) des étapes 1-3.",
      objectif:
        "<p>Quand les calculs deviennent lourds (simulation, modèle numérique), <strong>Julia</strong> allie la simplicité " +
        "de Python et la vitesse du C. Tu accélères la partie la plus coûteuse de l'analyse.</p>",
      ajoute: [
        "Charger ou générer des données <strong>numériques</strong>.",
        "Un calcul <strong>vectorisé</strong> avec le <em>broadcasting</em> (<code>.</code>).",
        "Une <strong>simulation</strong> ou un modèle numérique.",
        "Une <strong>comparaison de performance</strong> avec le prototype Python.",
      ],
      criteres: [
        "Des <strong>tableaux/vecteurs</strong> portent les données numériques.",
        "Au moins une opération est <strong>vectorisée</strong> (<em>broadcasting</em>, point <code>.</code>).",
        "Des <strong>fonctions</strong> encapsulent la logique de calcul.",
        "Le <strong>résultat numérique</strong> est correct.",
        "Le programme <strong>s'exécute</strong> (<code>julia</code>).",
      ],
      livrable: "Un calcul scientifique performant, en Julia.",
    },
    {
      n: 5,
      course: "python",
      courseTitle: "Python",
      dir: "python",
      accent: "python",
      phase: "Industrialiser",
      titre: "Industrialiser le pipeline",
      depart: "L'analyse complète (exploration → base → modèle → calcul) des étapes 1-4.",
      objectif:
        "<p>Transformer le prototype en <strong>pipeline robuste et reproductible</strong> en <strong>Python avancé</strong> : " +
        "typé, modulaire, testé, et capable de traiter de gros volumes efficacement.</p>",
      ajoute: [
        "Le pipeline <strong>modulaire</strong> (charger → nettoyer → analyser → exporter) et <strong>typé</strong>.",
        "Le traitement efficace de <strong>gros volumes</strong> (générateurs, voire concurrence).",
        "Des <strong>tests</strong> (pytest) sur les fonctions clés.",
        "Un <strong>rapport</strong> ou un export automatisé des résultats.",
      ],
      criteres: [
        "Le code est <strong>modulaire</strong> et <strong>typé</strong> (annotations).",
        "Les données sont parcourues efficacement (<strong>générateurs</strong>, mémoire maîtrisée).",
        "Au moins <strong>trois tests</strong> (pytest) passent.",
        "Le pipeline est <strong>reproductible</strong> (une commande relance tout).",
        "Un <strong>rapport / export</strong> des résultats est produit automatiquement.",
      ],
      livrable: "🏁 Une analyse de données complète, de l'exploration au pipeline industrialisé et testé !",
    },
  ],
};
