/* =============================================================================
   fil-rouge-jvm-data.js — FIL ROUGE « Une médiathèque sur la JVM ».
   Le même domaine (gérer une médiathèque : livres, membres, emprunts) ré-implémenté
   en montant en EXPRESSIVITÉ sur la même plateforme : Java → Kotlin → Scala → Groovy.
   Définit window.FIL_ROUGE → moteur générique js/fil-rouge.js.
   Page : pages/fil-rouge-jvm.html. 100 % file://.
   ============================================================================= */
window.FIL_ROUGE = {
  id: "jvm",
  titre: "Une médiathèque sur la JVM",
  sousTitre: "Le même logiciel, du Java classique au Groovy expressif — quatre langages, une seule plateforme.",
  intro:
    "<p>Tous ces langages tournent sur la <strong>même machine virtuelle</strong> (la JVM) et partagent ses bibliothèques. " +
    "Tu construis une <strong>médiathèque</strong> (livres, membres, emprunts) en Java, puis tu la ré-implémentes en " +
    "montant en <strong>expressivité</strong> : la concision de Kotlin, le fonctionnel de Scala, le scripting de Groovy.</p>" +
    "<p>Le domaine ne change pas : c'est l'occasion de <strong>comparer</strong> comment chaque langage exprime les mêmes idées " +
    "(modèle, collections, immuabilité) avec plus ou moins de cérémonie.</p>",
  etapes: [
    {
      n: 1,
      course: "java",
      courseTitle: "Java",
      dir: "java",
      accent: "java",
      phase: "Les fondations (POO)",
      titre: "La médiathèque en Java",
      depart: "Une page blanche — on démarre le domaine.",
      objectif:
        "<p>Poser le modèle en <strong>Java orienté objet</strong> : des classes encapsulées, des collections, des " +
        "exceptions — la version de référence, un peu verbeuse mais solide.</p>",
      ajoute: [
        "Des classes <strong>Livre</strong>, <strong>Membre</strong>, <strong>Emprunt</strong> (encapsulées).",
        "Une médiathèque qui stocke les données dans des <strong>collections</strong> (<code>List</code>/<code>Map</code>).",
        "L'<strong>emprunt</strong> et le <strong>retour</strong> d'un livre, avec contrôle (déjà emprunté ?).",
        "La gestion des erreurs par <strong>exceptions</strong>.",
      ],
      criteres: [
        "Les attributs sont <strong>privés</strong> avec accesseurs (encapsulation).",
        "Les données sont dans des <strong>collections</strong> Java.",
        "Une <strong>exception</strong> est levée et capturée.",
        "L'emprunt/retour est <strong>correct</strong> (pas de double emprunt).",
        "Le programme <strong>compile et tourne</strong>.",
      ],
      livrable: "La médiathèque en Java (POO de référence).",
    },
    {
      n: 2,
      course: "kotlin",
      courseTitle: "Kotlin",
      dir: "kotlin",
      accent: "kotlin",
      phase: "Concision & sûreté",
      titre: "La même chose, en plus concis et sûr",
      depart: "La médiathèque Java de l'étape 1.",
      objectif:
        "<p>Réécrire le modèle en <strong>Kotlin</strong> : <em>data classes</em>, <strong>null safety</strong> et fonctions " +
        "de collection remplacent une bonne partie de la cérémonie de Java.</p>",
      ajoute: [
        "Les entités en <strong>data classes</strong> (égalité, copie, <code>toString</code> gratuits).",
        "La <strong>null safety</strong> (<code>?.</code>, <code>?:</code>) pour les cas « membre introuvable ».",
        "Les traitements avec les <strong>fonctions de collection</strong> (<code>filter</code>/<code>map</code>/<code>count</code>).",
        "Un <code>when</code> pour le menu ou les statuts.",
      ],
      criteres: [
        "Des <strong>data classes</strong> modélisent les entités.",
        "La <strong>null safety</strong> est respectée (pas de <code>!!</code>).",
        "Les collections sont traitées avec des <strong>lambdas</strong>.",
        "Le code est nettement plus <strong>concis</strong> que la version Java.",
        "Le programme <strong>compile et tourne</strong>.",
      ],
      livrable: "La médiathèque en Kotlin (concise et sûre).",
    },
    {
      n: 3,
      course: "scala",
      courseTitle: "Scala",
      dir: "scala",
      accent: "scala",
      phase: "Vers le fonctionnel",
      titre: "Vers un style immuable et fonctionnel",
      depart: "La médiathèque Kotlin de l'étape 2.",
      objectif:
        "<p>Pousser vers le <strong>fonctionnel</strong> avec Scala : des <em>case classes</em> immuables, le " +
        "<em>pattern matching</em> et des collections traitées sans mutation.</p>",
      ajoute: [
        "Les entités en <strong>case classes</strong> immuables.",
        "Des opérations qui <strong>renvoient un nouvel état</strong> (pas de mutation).",
        "Du <strong>pattern matching</strong> (statuts, <code>Option</code>).",
        "Des collections traitées fonctionnellement (<code>map</code>/<code>filter</code>/<code>groupBy</code>/<code>fold</code>).",
      ],
      criteres: [
        "Des <strong>case classes</strong> immuables modélisent les entités.",
        "Les opérations <strong>ne mutent pas</strong> l'état (<code>val</code>).",
        "Le <strong>pattern matching</strong> est utilisé (<code>match</code>/<code>Option</code>).",
        "Les collections sont traitées <strong>fonctionnellement</strong>.",
        "Le programme <strong>compile et tourne</strong> (<code>scala</code>).",
      ],
      livrable: "La médiathèque en Scala (immuable, fonctionnelle).",
    },
    {
      n: 4,
      course: "groovy",
      courseTitle: "Groovy",
      dir: "groovy",
      accent: "groovy",
      phase: "Scripting & automatisation",
      titre: "Scripter et automatiser autour du modèle",
      depart: "La médiathèque des étapes 1-3.",
      objectif:
        "<p>Avec <strong>Groovy</strong>, on scripte : charger des données, générer un <strong>rapport</strong> de la " +
        "médiathèque (emprunts en retard, livres populaires) avec closures, <em>GStrings</em> et <em>builders</em>.</p>",
      ajoute: [
        "Le modèle réutilisé, manipulé par des <strong>closures</strong> (<code>each</code>/<code>findAll</code>/<code>collect</code>).",
        "Un <strong>rapport</strong> (retards, classements) généré avec un <em>builder</em> (JSON/HTML).",
        "Des chaînes construites avec des <strong>GStrings</strong> (<code>${...}</code>).",
        "Un script court et <strong>idiomatique</strong>.",
      ],
      criteres: [
        "Des <strong>closures</strong> traitent les collections (<code>findAll</code>/<code>collect</code>).",
        "Un <strong>rapport</strong> est généré (fichier ou sortie structurée).",
        "Des <strong>GStrings</strong> interpolent des valeurs (<code>${...}</code>).",
        "Le code est <strong>concis et idiomatique</strong> (pas du Java verbeux).",
        "Le script <strong>s'exécute</strong> (<code>groovy</code>).",
      ],
      livrable: "La médiathèque scriptée et automatisée, en Groovy.",
    },

    {
      n: 5,
      course: "clojure",
      courseTitle: "Clojure",
      dir: "clojure",
      accent: "clojure",
      phase: "Données immuables",
      titre: "La médiathèque en Clojure",
      depart: "La médiathèque des étapes 1-4 (Java, Kotlin, Scala, Groovy).",
      objectif:
        "<p>Réécrire le cœur en <strong>Clojure</strong> (un Lisp sur la JVM) : tout en <strong>données immuables</strong>, " +
        "transformées par les fonctions de séquence et les <em>threading macros</em>, mis au point au REPL.</p>",
      ajoute: [
        "Les entités en <strong>maps immuables</strong> (vecteurs de maps).",
        "Des transformations avec <code>map</code>/<code>filter</code>/<code>reduce</code>.",
        "L'usage des <strong>threading macros</strong> (<code>-&gt;</code>/<code>-&gt;&gt;</code>).",
        "Un état géré <strong>sans mutation</strong>, mis au point au REPL.",
      ],
      criteres: [
        "Les données sont des <strong>structures immuables</strong> (maps/vecteurs).",
        "Les transformations utilisent <code>map</code>/<code>filter</code>/<code>reduce</code>.",
        "Au moins une <strong>threading macro</strong> (<code>-&gt;</code>/<code>-&gt;&gt;</code>) est utilisée.",
        "Aucune <strong>mutation</strong> d'état (tout est pur).",
        "Le programme <strong>s'exécute</strong> (<code>clojure</code>).",
      ],
      livrable: "🏁 Une médiathèque vue par cinq langages de la JVM — de la POO classique (Java) à l'immuabilité fonctionnelle (Clojure) !",
    },
  ],
};
