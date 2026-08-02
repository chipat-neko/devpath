/* =============================================================================
   fil-rouge-ia-data.js — FIL ROUGE « Construire une app d'IA ».
   UNE application intelligente bâtie en trois temps : on COMPREND et entraîne un
   modèle (ml), on EXPLOITE l'IA générative des grands modèles de langage (llm),
   puis on EXPOSE le tout via une API moderne et flexible (graphql) :
   ml → llm → graphql.
   Définit window.FIL_ROUGE → moteur générique js/fil-rouge.js.
   Page : pages/fil-rouge-ia.html. 100 % file://.
   ============================================================================= */
window.FIL_ROUGE = {
  id: "ia",
  titre: "Construire une app d'IA",
  sousTitre: "Bâtis une application intelligente de bout en bout : comprends et entraîne un modèle, exploite l'IA générative, puis expose le tout via une API moderne.",
  intro:
    "<p>« Mettre de l'IA » dans une application ne se résume pas à appeler une API magique. Pour faire les bons choix, il " +
    "faut <strong>comprendre</strong> ce qu'est un modèle, savoir <strong>exploiter</strong> l'IA générative à bon escient, " +
    "et <strong>exposer</strong> ces capacités proprement au reste de l'application. Ce fil rouge enchaîne ces trois temps.</p>" +
    "<p>On part des <strong>fondations du machine learning</strong> (données, entraînement, évaluation), on ajoute la " +
    "puissance des <strong>grands modèles de langage</strong> (génération, prompts, intégration), puis on <strong>expose</strong> " +
    "ces fonctions d'IA via une <strong>API GraphQL</strong> flexible que le front pourra interroger sur mesure. De la " +
    "donnée brute à une app intelligente et bien architecturée.</p>",
  etapes: [
    {
      n: 1,
      course: "ml",
      courseTitle: "Machine Learning",
      dir: "ml",
      accent: "ml",
      phase: "Comprendre",
      titre: "Comprendre et entraîner un modèle",
      depart: "Un jeu de données et un problème à résoudre (prédire une valeur, classer des éléments).",
      objectif:
        "<p>Saisir ce qu'est vraiment l'apprentissage automatique : <strong>préparer les données</strong>, choisir un " +
        "<strong>modèle</strong> adapté (régression, classification), l'<strong>entraîner</strong> et surtout l'<strong>évaluer</strong> " +
        "honnêtement, en évitant le sur-apprentissage.</p>",
      ajoute: [
        "Une <strong>préparation des données</strong> (nettoyage, séparation entraînement/test).",
        "Le choix d'un <strong>modèle</strong> adapté au problème (régression ou classification).",
        "Un <strong>entraînement</strong> et une <strong>évaluation</strong> avec des métriques honnêtes.",
        "Une vigilance sur le <strong>sur-apprentissage</strong> (généralisation, pas de fuite de données).",
      ],
      criteres: [
        "Les données sont <strong>préparées</strong> et séparées proprement (entraînement / test).",
        "Le <strong>modèle</strong> choisi correspond au type de problème.",
        "Le modèle est <strong>évalué</strong> sur des données qu'il n'a pas vues, avec des métriques claires.",
        "Le risque de <strong>sur-apprentissage</strong> est identifié et limité.",
        "On sait <strong>expliquer</strong> ce que le modèle fait et ses limites.",
      ],
      livrable: "Un modèle entraîné et évalué, dont on comprend les forces et les limites.",
    },
    {
      n: 2,
      course: "llm",
      courseTitle: "IA & LLM",
      dir: "llm",
      accent: "llm",
      phase: "Générer",
      titre: "Exploiter l'IA générative (LLM)",
      depart: "Le socle ML de l'étape 1, qu'on enrichit d'une brique d'IA générative.",
      objectif:
        "<p>Ajouter la puissance des <strong>grands modèles de langage</strong> : appeler un <strong>LLM</strong> via son API, " +
        "rédiger de bons <strong>prompts</strong>, structurer les réponses, et augmenter le modèle avec du contexte " +
        "(récupération de documents) tout en gardant la maîtrise des <strong>coûts</strong> et des limites.</p>",
      ajoute: [
        "L'<strong>appel d'un LLM</strong> via son API, avec une clé gérée comme un secret.",
        "Des <strong>prompts</strong> clairs et, si besoin, une sortie <strong>structurée</strong> (JSON).",
        "L'<strong>augmentation</strong> par du contexte (documents) pour des réponses pertinentes.",
        "La prise en compte des <strong>limites</strong> : hallucinations, coûts, confidentialité.",
      ],
      criteres: [
        "Un <strong>LLM</strong> est appelé proprement (clé secrète, gestion des erreurs).",
        "Les <strong>prompts</strong> sont réfléchis et donnent des réponses exploitables.",
        "Le modèle est <strong>augmenté</strong> de contexte quand c'est utile (au lieu de tout inventer).",
        "Les <strong>limites</strong> (hallucinations, coûts) sont prises en compte, pas ignorées.",
        "L'IA générative <strong>complète</strong> la brique ML, chacune à sa place.",
      ],
      livrable: "Une fonctionnalité d'IA générative intégrée et maîtrisée (prompts, contexte, limites).",
    },
    {
      n: 3,
      course: "graphql",
      courseTitle: "GraphQL",
      dir: "graphql",
      accent: "graphql",
      phase: "Exposer",
      titre: "Exposer l'IA via une API GraphQL",
      depart: "Les capacités d'IA des étapes 1 et 2, qu'il faut offrir au front (ou à des clients tiers).",
      objectif:
        "<p>Donner accès aux fonctions d'IA via une <strong>API GraphQL</strong> flexible : un <strong>schéma</strong> typé, " +
        "des <strong>requêtes</strong> et <strong>mutations</strong> qui déclenchent prédiction et génération, et des " +
        "<strong>résolveurs</strong> qui orchestrent le modèle — le client demande exactement ce dont il a besoin.</p>",
      ajoute: [
        "Un <strong>schéma GraphQL</strong> typé exposant les opérations d'IA (prédire, générer).",
        "Des <strong>requêtes</strong> et <strong>mutations</strong> reliées aux briques ML/LLM.",
        "Des <strong>résolveurs</strong> qui appellent le modèle et renvoient des données structurées.",
        "Une <strong>gestion des erreurs</strong> et des limites (taille, débit) côté API.",
      ],
      criteres: [
        "Le <strong>schéma</strong> GraphQL décrit clairement les opérations d'IA disponibles.",
        "Les <strong>résolveurs</strong> orchestrent correctement le modèle ML et/ou le LLM.",
        "Le client peut demander <strong>exactement</strong> les champs voulus (force de GraphQL).",
        "Les <strong>erreurs</strong> et limites sont gérées proprement (pas de plantage brut).",
        "L'API <strong>respecte l'architecture</strong> : elle expose, le métier IA reste isolé.",
      ],
      livrable: "🏁 Une app d'IA complète : un modèle compris, l'IA générative maîtrisée, le tout exposé par une API GraphQL flexible !",
    },
  ],
};
