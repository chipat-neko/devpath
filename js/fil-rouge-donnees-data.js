/* =============================================================================
   fil-rouge-donnees-data.js — FIL ROUGE « Une analyse de données de bout en bout ».
   Un même jeu de données mené du prototype à la production : explorer (Python),
   CONCEVOIR SA BASE (bdd), stocker & interroger (SQL), modéliser & visualiser
   (R), accélérer (Julia), industrialiser (Python avancé), puis EXPLOITER LE
   PIPELINE tous les jours (data-eng).
   Les étapes `bdd` (2) et `data-eng` (7) ont été ajoutées au chantier V13-A3 :
   ces deux cours ne figuraient dans aucun fil rouge, alors que le fil sautait
   de l'exploration aux requêtes SQL sans jamais concevoir de schéma, et
   s'arrêtait à un pipeline qui tourne une fois, à la main.
   Définit window.FIL_ROUGE → moteur générique js/fil-rouge.js.
   Page : pages/fil-rouge-donnees.html. 100 % file://.
   ============================================================================= */
window.FIL_ROUGE = {
  id: "donnees",
  titre: "Une analyse de données de bout en bout",
  sousTitre: "Un même jeu de données, de l'exploration au pipeline qui tourne tout seul — Python, conception de base, SQL, R, Julia, Python avancé, ingénierie de données.",
  intro:
    "<p>Une vraie analyse de données ne tient pas dans un seul outil. Tu pars d'un <strong>jeu de données</strong> (par ex. " +
    "des ventes), tu l'<strong>explores</strong> en Python, tu <strong>conçois le schéma</strong> qui l'accueillera, tu le " +
    "<strong>stockes et l'interroges</strong> en SQL, tu le <strong>modélises et le visualises</strong> en R, tu " +
    "<strong>accélères</strong> les calculs lourds en Julia, puis tu <strong>industrialises</strong> le tout en Python " +
    "avancé — et tu finis par en faire un <strong>pipeline exploité</strong>, qui tourne chaque jour sans toi.</p>" +
    "<p>Le fil conducteur, c'est <strong>la donnée</strong> : à chaque étape elle est mieux rangée, mieux comprise, et le " +
    "traitement devient plus fiable et reproductible.</p>",
  /* Renumérotation V13-A3 (cf. migrerStore dans js/fil-rouge.js) : le fil était
     python=1, sql=2, r=3, julia=4, python avancé=5. */
  remapVersion: 1,
  remap: { "2": 3, "3": 4, "4": 5, "5": 6 },
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
      course: "bdd",
      courseTitle: "Concevoir une base de données",
      dir: "bdd",
      accent: "bdd",
      phase: "Concevoir",
      titre: "Concevoir le schéma avant de le remplir",
      depart: "Un jeu exploré et nettoyé — et la tentation de le verser tel quel dans une table unique de quarante colonnes.",
      objectif:
        "<p>Un tableau plat n'est pas une base. Avant la première requête, repérer les <strong>entités</strong> et leurs " +
        "<strong>relations</strong>, choisir les <strong>clés</strong>, poser les <strong>contraintes</strong> qui " +
        "laisseront la base refuser une donnée absurde, et <strong>normaliser</strong> juste ce qu'il faut — puis savoir " +
        "quand <strong>dénormaliser</strong> pour une lecture qui compte.</p>" +
        "<p>C'est l'étape la plus rentable du fil : un schéma bancal se paye dans toutes les requêtes qui suivront.</p>",
      ajoute: [
        "Les <strong>entités</strong> du jeu et leurs attributs, séparées de ce qui n'est qu'une mesure.",
        "Les <strong>relations</strong> et leurs cardinalités (un client, plusieurs commandes).",
        "Une <strong>clé primaire</strong> par table et les <strong>clés étrangères</strong> qui relient.",
        "Des <strong>contraintes</strong> qui rendent une donnée fausse impossible à insérer.",
        "Une <strong>normalisation</strong> jusqu'à la 3<sup>e</sup> forme, et les dénormalisations assumées.",
      ],
      criteres: [
        "Chaque table représente <strong>une seule</strong> chose, nommée d'après ce qu'elle décrit.",
        "Chaque ligne est <strong>identifiable</strong> par une clé primaire stable.",
        "Les <strong>clés étrangères</strong> existent et l'intégrité référentielle est active.",
        "Une donnée absurde est <strong>refusée par la base</strong>, pas seulement par le code.",
        "Toute <strong>dénormalisation</strong> est justifiée par une lecture précise, pas par confort.",
      ],
      livrable: "Un schéma relationnel justifié : entités, relations, clés et contraintes — prêt à être créé.",
    },
    {
      n: 3,
      course: "sql",
      courseTitle: "SQL",
      dir: "sql",
      accent: "sql",
      phase: "Stocker & interroger",
      titre: "Stocker et interroger en base",
      depart: "Les données explorées de l'étape 1 et le schéma conçu à l'étape 2 — il ne reste qu'à le créer pour de vrai.",
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
      n: 4,
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
      n: 5,
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
      n: 6,
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
      livrable: "Une analyse complète, de l'exploration au pipeline industrialisé et testé — qui tourne quand on le lance.",
    },
    {
      n: 7,
      course: "data-eng",
      courseTitle: "Ingénierie de données",
      dir: "data-eng",
      accent: "data-eng",
      phase: "Exploiter",
      titre: "Le faire tourner tous les jours, sans toi",
      depart: "Un pipeline reproductible qu'il faut encore lancer à la main — et qui doublonne si on le relance deux fois.",
      objectif:
        "<p>Passer du script qu'on lance au <strong>pipeline qu'on exploite</strong>. Décider entre " +
        "<strong>ETL et ELT</strong>, choisir un <strong>format</strong> (le CSV a des limites que Parquet n'a pas), " +
        "<strong>partitionner</strong> le stockage pour ne pas tout relire, rendre chaque traitement " +
        "<strong>idempotent</strong> — rejouer une journée ne doit rien doublonner —, l'<strong>orchestrer</strong> " +
        "(dépendances, planification, reprise), et le <strong>surveiller</strong> : fraîcheur, volumétrie, qualité.</p>" +
        "<p>C'est ici qu'un pipeline cesse d'être un script personnel pour devenir une source sur laquelle d'autres " +
        "s'appuient — et qu'on doit prévenir quand la donnée est en retard.</p>",
      ajoute: [
        "Un choix <strong>ETL / ELT</strong> argumenté, et une ingestion <strong>pleine ou incrémentale</strong> assumée.",
        "Un <strong>format</strong> et un <strong>partitionnement</strong> adaptés au volume et aux requêtes.",
        "Des étapes <strong>idempotentes</strong> : rejouer une exécution ne crée aucun doublon.",
        "Une <strong>orchestration</strong> : dépendances entre étapes, planification, reprise après échec.",
        "Des <strong>contrôles de qualité</strong> et une alerte sur la <strong>fraîcheur</strong> des données.",
      ],
      criteres: [
        "Le pipeline se <strong>relance sans dégâts</strong> : la même exécution rejouée donne le même résultat.",
        "Le <strong>partitionnement</strong> évite de tout relire à chaque exécution, et c'est mesuré.",
        "Les étapes s'enchaînent par <strong>dépendances</strong>, pas par ordre d'écriture.",
        "Un <strong>test de qualité</strong> bloque la publication d'un lot manifestement faux.",
        "Une <strong>alerte</strong> se déclenche si la donnée n'est pas arrivée à l'heure.",
      ],
      livrable: "🏁 Une analyse de données complète, du premier coup d'oeil au pipeline exploité : schéma pensé, calculs accélérés, exécution quotidienne surveillée !",
    },
  ],
};
