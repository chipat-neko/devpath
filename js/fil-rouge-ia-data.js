/* =============================================================================
   fil-rouge-ia-data.js — FIL ROUGE « Construire une app d'IA ».
   UN projet mené de la donnée brute à l'écran : on PRÉPARE un jeu de données
   (pandas), on le COMPREND honnêtement (stats), on entraîne un modèle qui
   prédit (ml), on OUVRE LA BOÎTE en le réécrivant à la main (neurones), on
   fait EXPLIQUER ses résultats par un LLM (llm), puis on les MONTRE dans un
   tableau de bord qui ne ment pas (dataviz) :
   pandas → stats → ml → neurones → llm → dataviz.
   Recomposé au chantier V13-A2 : le fil s'arrêtait sur ml → llm → graphql, où
   l'étape GraphQL n'exposait pas de l'IA mais servait de débouché au cours
   graphql (relogé en étape 7 du fil « backend », à sa vraie place : la même
   API, en REST puis en GraphQL). Le fil suit désormais le parcours « ia ».
   Chantier V13-C5 : le cours de RÉSEAUX DE NEURONES s'est inséré en ÉTAPE 4,
   entre ml et llm ; llm est passé en 5 et dataviz en 6 (remapVersion 2).
   Définit window.FIL_ROUGE → moteur générique js/fil-rouge.js.
   Page : pages/fil-rouge-ia.html. 100 % file://.
   ============================================================================= */
window.FIL_ROUGE = {
  id: "ia",
  titre: "Construire une app d'IA",
  sousTitre: "De la donnée brute à l'écran : prépare un jeu de données, comprends-le, entraîne un modèle qui prédit, fais-lui expliquer ses résultats par un LLM, puis montre-les honnêtement.",
  intro:
    "<p>« Mettre de l'IA » dans une application ne commence pas par le modèle : cela commence par les <strong>données</strong>. " +
    "Un modèle entraîné sur un jeu bancal produit des chiffres faux avec beaucoup d'assurance, et aucune couche d'IA " +
    "générative ne rattrape cela. Ce fil rouge construit <strong>un seul projet</strong>, dans l'ordre où on le fait " +
    "vraiment.</p>" +
    "<p>Le projet : à partir d'un export brut d'un service en ligne, <strong>prédire quels comptes vont se désabonner</strong>, " +
    "puis rendre cette prédiction utilisable par une personne qui ne fait pas de <em>machine learning</em>. On " +
    "<strong>nettoie</strong> le jeu (pandas), on le <strong>décrit honnêtement</strong> (statistiques), on " +
    "<strong>entraîne et on évalue</strong> un modèle (ML), on lui fait <strong>mettre en mots</strong> ses résultats par un " +
    "grand modèle de langage — qui rédige mais ne calcule jamais —, puis on <strong>montre</strong> le tout dans un tableau " +
    "de bord qui ne ment pas sur ses échelles.</p>" +
    "<p>Ce fil suit le parcours <strong>Intelligence artificielle</strong> du site, et passe par les " +
    "<strong>réseaux de neurones</strong> : entre le modèle classique et le LLM, une étape où l'on écrit soi-même " +
    "ce que les deux autres emploient sans le montrer.</p>",
  /* RENUMÉROTATIONS SUCCESSIVES (cf. migrerStore dans js/fil-rouge.js) — les cases
     déjà cochées suivent leur cours, quelle que soit la version d'où part le store.
       v1 (chantier V13-A2) : le fil était ml=1, llm=2, graphql=3 ; graphql est parti
                              au fil « backend », pandas et stats sont arrivés devant.
       v2 (chantier V13-C5) : « neurones » s'insère en 4, entre ml et llm.
     ⚠️ NE JAMAIS RETIRER UNE TABLE ANCIENNE : un apprenant qui a commencé le fil avant
     la v1 et ne rouvre la page qu'aujourd'hui part de v0 et doit subir les DEUX. */
  remapVersion: 2,
  remaps: {
    1: { "1": 3, "2": 4, "3": null },
    2: { "4": 5, "5": 6 },
  },
  etapes: [
    {
      n: 1,
      course: "pandas",
      courseTitle: "pandas",
      dir: "pandas",
      accent: "pandas",
      phase: "Préparer",
      titre: "Rassembler et nettoyer les données",
      depart: "Un export brut : des colonnes mal typées, des cellules vides, des doublons et des dates écrites en texte.",
      objectif:
        "<p>Tout part de là. Charger le fichier, <strong>l'inspecter</strong> avant d'y croire, corriger les " +
        "<strong>types</strong>, décider quoi faire des <strong>valeurs manquantes</strong> (les remplacer n'est jamais " +
        "neutre), puis <strong>regrouper</strong> pour obtenir les colonnes qui décriront chaque compte : ancienneté, " +
        "activité, incidents. C'est ce tableau-là que le modèle verra — pas le fichier d'origine.</p>",
      ajoute: [
        "Un <strong>chargement</strong> et une <strong>inspection</strong> du jeu (dimensions, types, valeurs extrêmes).",
        "Des <strong>types corrigés</strong> : une date est une date, un nombre est un nombre.",
        "Une <strong>décision assumée</strong> sur les valeurs manquantes (supprimer, remplacer, garder — et pourquoi).",
        "Des <strong>colonnes calculées</strong> par regroupement (ancienneté, fréquence d'usage, nombre d'incidents).",
        "Un <strong>export</strong> du jeu propre, réutilisable aux étapes suivantes.",
      ],
      criteres: [
        "Le jeu est <strong>inspecté</strong> avant d'être transformé (on sait ce qu'il contient).",
        "Chaque colonne a le <strong>bon type</strong>, dates comprises.",
        "Le traitement des <strong>valeurs manquantes</strong> est explicite et justifié.",
        "Les <strong>colonnes calculées</strong> sont obtenues par regroupement, pas à la main.",
        "Le jeu propre est <strong>exporté</strong> et se recharge à l'identique.",
      ],
      livrable: "Un jeu de données propre, typé et documenté, prêt à être analysé.",
    },
    {
      n: 2,
      course: "stats",
      courseTitle: "Statistiques appliquées",
      dir: "stats",
      accent: "stats",
      phase: "Comprendre",
      titre: "Regarder les données avant de modéliser",
      depart: "Le jeu propre de l'étape 1 — dont on ne sait encore rien.",
      objectif:
        "<p>Avant d'entraîner quoi que ce soit, il faut savoir ce que le jeu contient : le <strong>centre</strong> et la " +
        "<strong>dispersion</strong> de chaque variable, la <strong>forme</strong> des distributions, les liens avec le " +
        "départ des comptes. Et surtout deux réflexes que le modèle n'aura jamais à votre place : une " +
        "<strong>corrélation n'est pas une cause</strong>, et une mesure faite sur un échantillon vient toujours avec son " +
        "<strong>incertitude</strong>.</p>",
      ajoute: [
        "Une <strong>description</strong> de chaque variable utile (centre, dispersion, forme).",
        "Le repérage des <strong>déséquilibres</strong> : si 3 % des comptes partent, une exactitude de 97 % ne vaut rien.",
        "Des <strong>corrélations</strong> mesurées entre les variables et le départ.",
        "Une lecture <strong>prudente</strong> : ce que la corrélation montre, ce qu'elle ne prouve pas.",
        "L'<strong>incertitude</strong> des chiffres annoncés (intervalle, taille de l'échantillon).",
      ],
      criteres: [
        "Chaque variable utile est <strong>décrite</strong>, pas seulement moyennée.",
        "Le <strong>déséquilibre</strong> des classes est mesuré et noté pour l'étape suivante.",
        "Au moins une <strong>corrélation</strong> est mesurée et interprétée.",
        "Une <strong>confusion cause / corrélation</strong> possible est identifiée et écrite noir sur blanc.",
        "Les chiffres annoncés sont accompagnés de leur <strong>incertitude</strong>.",
      ],
      livrable: "Une description honnête du jeu : ce qu'il montre, et ce qu'il ne prouve pas.",
    },
    {
      n: 3,
      course: "ml",
      courseTitle: "Machine Learning",
      dir: "ml",
      accent: "ml",
      phase: "Modéliser",
      titre: "Entraîner et évaluer un modèle",
      depart: "Le jeu propre et décrit des étapes 1 et 2, et une question à trancher : ce compte va-t-il partir ?",
      objectif:
        "<p>Saisir ce qu'est vraiment l'apprentissage automatique : <strong>séparer</strong> les données, choisir un " +
        "<strong>modèle</strong> adapté au problème (ici une classification), l'<strong>entraîner</strong> et surtout " +
        "l'<strong>évaluer</strong> honnêtement, en évitant le sur-apprentissage et les métriques trompeuses repérées à " +
        "l'étape 2.</p>",
      ajoute: [
        "Une <strong>séparation</strong> propre entraînement / test, faite avant toute mesure.",
        "Le choix d'un <strong>modèle</strong> adapté au type de problème, et d'une référence naïve à battre.",
        "Un <strong>entraînement</strong> et une <strong>évaluation</strong> avec des métriques adaptées au déséquilibre.",
        "Une vigilance sur le <strong>sur-apprentissage</strong> (généralisation, pas de fuite de données).",
        "Une liste des <strong>erreurs</strong> du modèle : sur quels comptes se trompe-t-il, et à quel prix ?",
      ],
      criteres: [
        "Les données sont <strong>séparées</strong> avant toute mesure (aucune fuite du test vers l'entraînement).",
        "Le <strong>modèle</strong> choisi correspond au type de problème et bat une référence naïve.",
        "Le modèle est <strong>évalué</strong> sur des données qu'il n'a pas vues, avec des métriques adaptées.",
        "Le risque de <strong>sur-apprentissage</strong> est identifié et limité.",
        "On sait <strong>expliquer</strong> ce que le modèle fait, où il se trompe et ce que coûte chaque erreur.",
      ],
      livrable: "Un modèle entraîné et évalué, dont on connaît les forces, les erreurs et les limites.",
    },
    {
      n: 4,
      course: "neurones",
      courseTitle: "Réseaux de neurones",
      dir: "neurones",
      accent: "neurones",
      phase: "Ouvrir la boîte",
      titre: "Refaire le modèle à la main, et le comparer honnêtement",
      depart: "Un modèle entraîné qui prédit correctement — et dont personne, dans l'équipe, ne sait dire ce qu'il calcule.",
      objectif:
        "<p>L'étape 3 a produit un modèle qui marche. Celle-ci demande de savoir <strong>ce qu'il y a dedans</strong>, " +
        "en écrivant soi-même le modèle de la famille dont tout le monde parle : un <strong>réseau de neurones</strong>. " +
        "Une somme pondérée, une décision, des couches empilées, une <strong>rétropropagation</strong> écrite à la main — " +
        "aucune bibliothèque d'apprentissage, aucune dérivation automatique.</p>" +
        "<p>Et surtout : le <strong>comparer</strong> au modèle de l'étape 3, sur le même jeu de test, avec la même " +
        "métrique. Le résultat honnête est souvent que le réseau <em>ne gagne pas</em> — sur quelques milliers de lignes " +
        "de données tabulaires, un modèle classique reste difficile à battre. C'est un résultat, pas un échec, et " +
        "savoir le dire vaut mieux que d'empiler des couches.</p>",
      ajoute: [
        "Un <strong>réseau écrit à la main</strong> : couche, activation, perte, rétropropagation — sans bibliothèque d'apprentissage.",
        "Le <strong>compte de ses paramètres</strong>, posé avant de l'entraîner : on doit savoir combien de nombres on règle.",
        "Une <strong>comparaison</strong> au modèle de l'étape 3, sur le <em>même</em> jeu de test et la <em>même</em> métrique.",
        "Une <strong>courbe d'entraînement</strong> à deux traits — apprentissage et test — pour voir le sur-apprentissage arriver.",
        "Une <strong>décision écrite</strong> : lequel des deux modèles part en production, et pourquoi.",
      ],
      criteres: [
        "La <strong>rétropropagation</strong> est écrite à la main et vérifiée (par exemple par différences finies).",
        "Le <strong>nombre de paramètres</strong> du réseau est compté et affiché, pas estimé.",
        "Les deux modèles sont comparés sur le <strong>même</strong> jeu de test, avec la <strong>même</strong> métrique.",
        "Le <strong>sur-apprentissage</strong> est visible sur une courbe à deux traits, et traité (arrêt précoce ou pénalité).",
        "La décision finale est <strong>écrite et argumentée</strong> — y compris si elle consiste à garder le modèle de l'étape 3.",
      ],
      livrable: "Un réseau écrit de bout en bout, et une comparaison chiffrée qui dit lequel des deux modèles mérite la production.",
    },
    {
      n: 5,
      course: "llm",
      courseTitle: "IA & LLM",
      dir: "llm",
      accent: "llm",
      phase: "Générer",
      titre: "Faire expliquer les résultats par un LLM",
      depart: "Un modèle qui sort des chiffres justes — et illisibles pour qui ne fait pas de machine learning.",
      objectif:
        "<p>Ajouter la puissance des <strong>grands modèles de langage</strong> là où elle est réellement utile : " +
        "<strong>mettre en mots</strong>. Le LLM reçoit les chiffres produits à l'étape 3 et rédige la synthèse ; il ne " +
        "recalcule rien. C'est la règle qui tient tout le projet : <strong>les chiffres viennent du modèle, la phrase vient " +
        "du LLM</strong>. Reste à appeler l'API proprement, à écrire un prompt qui contraint, à structurer la sortie et à " +
        "mesurer ce que cela coûte.</p>",
      ajoute: [
        "L'<strong>appel d'un LLM</strong> via son API, avec une clé gérée comme un secret.",
        "Un <strong>prompt</strong> qui fournit les chiffres et interdit d'en inventer d'autres.",
        "Une <strong>sortie structurée</strong> (JSON) que l'application affiche sans la relire à la main.",
        "Une <strong>vérification</strong> : les nombres du texte se retrouvent-ils dans les données fournies ?",
        "La prise en compte des <strong>limites</strong> : hallucinations, coût par appel, confidentialité des données.",
      ],
      criteres: [
        "Un <strong>LLM</strong> est appelé proprement (clé secrète, gestion des erreurs, échec sans casse).",
        "Le <strong>prompt</strong> fournit les chiffres et interdit explicitement d'en produire.",
        "La sortie est <strong>structurée</strong> et exploitable telle quelle.",
        "Un <strong>contrôle</strong> vérifie que le texte n'annonce aucun chiffre absent des données.",
        "Le <strong>coût</strong> et les <strong>limites</strong> sont mesurés, pas ignorés.",
      ],
      livrable: "Une synthèse rédigée automatiquement, vérifiée, qui ne dit que ce que les données disent.",
    },
    {
      n: 6,
      course: "dataviz",
      courseTitle: "Data visualisation",
      dir: "dataviz",
      accent: "dataviz",
      phase: "Montrer",
      titre: "Montrer les résultats sans mentir",
      depart: "Des chiffres justes et un texte fidèle — mais rien à regarder, donc rien de décidable.",
      objectif:
        "<p>Un modèle que personne ne peut lire ne sert à personne. Choisir la <strong>forme</strong> du graphique selon la " +
        "question posée, régler une <strong>échelle honnête</strong>, employer la <strong>couleur</strong> pour dire quelque " +
        "chose, et <strong>annoter</strong> pour que le lecteur voie ce qui compte. Montrer aussi ce que le modèle " +
        "<strong>rate</strong> : un tableau de bord qui ne présente que les réussites est un mensonge par omission.</p>",
      ajoute: [
        "Un graphique par <strong>question</strong>, la forme choisie pour la question (comparer, suivre, relier, répartir).",
        "Des <strong>échelles honnêtes</strong> : axe non tronqué, ou troncature signalée.",
        "Une <strong>couleur</strong> qui porte une information et reste lisible en cas de daltonisme.",
        "Les <strong>erreurs du modèle</strong> rendues visibles, pas seulement ses réussites.",
        "Des <strong>annotations</strong> qui disent au lecteur ce qu'il doit remarquer.",
      ],
      criteres: [
        "Chaque graphique répond à une <strong>question</strong> identifiable.",
        "Aucune <strong>échelle</strong> ne fausse la lecture ; toute troncature est signalée.",
        "La <strong>couleur</strong> encode une information et reste lisible pour tous.",
        "Les <strong>erreurs</strong> du modèle sont montrées au même titre que ses succès.",
        "Le tableau de bord se lit <strong>sans commentaire oral</strong> : titres et annotations suffisent.",
      ],
      livrable: "🏁 Une app d'IA complète : des données propres, un modèle évalué, une synthèse fidèle et un tableau de bord honnête !",
    },
  ],
};
