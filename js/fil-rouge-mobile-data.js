/* =============================================================================
   fil-rouge-mobile-data.js — FIL ROUGE « Une app de notes mobile ».
   La même petite application (des notes : créer, lister, éditer) conçue d'abord
   hors langage, puis du natif iOS au multiplateforme :
   mobile → Swift → Objective-C → Kotlin → Dart (Flutter).
   L'étape 1 a été ajoutée au chantier V13-A3 : le cours `mobile` — ce qui fait
   une application mobile, par-delà le langage — ne figurait dans aucun fil
   rouge, alors que ce fil enchaînait quatre langages sans jamais poser la
   question du cycle de vie, de la navigation ni du hors-ligne.
   Définit window.FIL_ROUGE → moteur générique js/fil-rouge.js.
   Page : pages/fil-rouge-mobile.html. 100 % file://.
   ⚠️ Projet conceptuel : se réalise dans Xcode / Flutter (pas dans le navigateur).
   ============================================================================= */
window.FIL_ROUGE = {
  id: "mobile",
  titre: "Une app de notes mobile",
  sousTitre: "La même app, conçue une fois puis écrite partout : ce qui fait une app mobile, puis Swift, Objective-C, Kotlin et Dart (Flutter).",
  intro:
    "<p>Une petite <strong>application de notes</strong> (créer, lister, éditer, supprimer) sert de fil conducteur. Tu " +
    "commences par ce qui ne dépend d'<strong>aucun langage</strong> — le cycle de vie, la navigation, l'état, le " +
    "hors-ligne, les permissions —, puis tu la " +
    "construis en <strong>Swift</strong> (le natif iOS moderne), tu apprends à lire et maintenir du code " +
    "<strong>Objective-C</strong> (le legacy d'Apple), puis tu la portes en <strong>Dart/Flutter</strong> pour qu'elle " +
    "tourne sur iOS <em>et</em> Android.</p>" +
    "<p>Le modèle (une note : titre, contenu, date) ne change pas : c'est la <strong>plateforme</strong> et le " +
    "<strong>langage</strong> qui évoluent. ⚠️ Ce fil rouge se réalise dans un vrai environnement mobile (Xcode, " +
    "Android Studio, Flutter), pas dans le navigateur — sauf l'étape 1, qui se conçoit sur le papier.</p>",
  /* Renumérotation V13-A3 (cf. migrerStore dans js/fil-rouge.js) : le fil
     commençait sur swift=1, objc=2, kotlin=3, dart=4. */
  remapVersion: 1,
  remap: { "1": 2, "2": 3, "3": 4, "4": 5 },
  etapes: [
    {
      n: 1,
      course: "mobile",
      courseTitle: "Développer une application mobile",
      dir: "mobile",
      accent: "mobile",
      phase: "Concevoir",
      titre: "Ce qui fait une app mobile, avant tout langage",
      depart: "Une idée d'app de notes (titre, contenu, date) — et l'envie d'ouvrir tout de suite un éditeur.",
      objectif:
        "<p>Une application mobile n'est pas un site rétréci. Elle est <strong>interrompue</strong> sans prévenir (appel, " +
        "notification, batterie), elle perd le réseau, elle demande des <strong>permissions</strong>, et elle est jugée " +
        "sur des listes qui doivent défiler sans accroc. Ces contraintes ne dépendent d'aucun langage : les décider " +
        "d'abord évite de les redécouvrir quatre fois.</p>" +
        "<p>On choisit ici <strong>natif ou multiplateforme</strong> en connaissance de cause, on dessine les " +
        "<strong>écrans</strong> et la <strong>navigation</strong>, on décide où vit l'<strong>état</strong>, et on " +
        "tranche la question qui décide de tout le reste : que fait l'app <strong>sans réseau</strong> ?</p>",
      ajoute: [
        "Un choix <strong>natif ou multiplateforme</strong> argumenté (public visé, équipe, budget, accès matériel).",
        "La carte des <strong>écrans</strong> et de la <strong>navigation</strong> entre eux.",
        "Le <strong>modèle</strong> d'une note et l'endroit où vit son <strong>état</strong>.",
        "La règle du <strong>hors-ligne</strong> : ce qui fait autorité, l'appareil ou le serveur.",
        "La liste des <strong>permissions</strong> réellement nécessaires — et de celles dont on se passe.",
      ],
      criteres: [
        "Le choix <strong>natif / multiplateforme</strong> est justifié par des contraintes réelles, pas par une mode.",
        "La <strong>navigation</strong> est dessinée : on sait revenir en arrière de partout.",
        "L'endroit où vit l'<strong>état</strong> est décidé, et le cycle de vie (mise en veille, retour) est prévu.",
        "Le comportement <strong>hors ligne</strong> est écrit noir sur blanc.",
        "Chaque <strong>permission</strong> demandée est justifiée par une fonctionnalité visible.",
      ],
      livrable: "Une conception d'app mobile tenant sur une page : écrans, navigation, état, hors-ligne, permissions — indépendante du langage.",
    },
    {
      n: 2,
      course: "swift",
      courseTitle: "Swift",
      dir: "swift",
      accent: "swift",
      phase: "iOS natif",
      titre: "L'app de notes en Swift",
      depart: "La conception de l'étape 1 : les écrans, la navigation et le modèle d'une note (titre, contenu, date), sur le papier.",
      objectif:
        "<p>Construire l'application en <strong>Swift</strong>, le langage moderne d'Apple : un modèle sûr, une liste de " +
        "notes, l'ajout et la suppression.</p>",
      ajoute: [
        "Une <code>struct</code> <strong>Note</strong> (titre, contenu, date) et un <code>enum</code> si utile (catégorie).",
        "Une <strong>collection</strong> de notes, l'ajout et la suppression.",
        "La gestion sûre de l'absence avec les <strong>optionnels</strong> (<code>if let</code>/<code>guard let</code>).",
        "Des <strong>closures</strong>/fonctions de haut niveau pour filtrer/trier.",
      ],
      criteres: [
        "Une <code>struct</code> (et un <code>enum</code> si pertinent) modélise une note.",
        "Les <strong>optionnels</strong> sont gérés sûrement (pas de <code>!</code> forcé).",
        "Des <strong>closures</strong> traitent la collection (<code>map</code>/<code>filter</code>).",
        "L'ajout / la suppression de notes <strong>fonctionne</strong>.",
        "Le code est <strong>idiomatique</strong> Swift et compile (Xcode / playground).",
      ],
      livrable: "L'app de notes en Swift natif.",
    },
    {
      n: 3,
      course: "objc",
      courseTitle: "Objective-C",
      dir: "objc",
      accent: "objc",
      phase: "iOS natif",
      titre: "Lire et maintenir le code Objective-C",
      depart: "L'app Swift de l'étape 1.",
      objectif:
        "<p>Comprendre le <strong>legacy d'Apple</strong> : réécrire (ou interfacer) une partie de l'app en " +
        "<strong>Objective-C</strong>, avec ses classes et son passage de messages — indispensable pour maintenir " +
        "des projets existants.</p>",
      ajoute: [
        "Une classe <strong>Note</strong> (<code>@interface</code>/<code>@implementation</code>) avec des propriétés.",
        "Un <code>NSMutableArray</code> pour stocker les notes.",
        "Les opérations par <strong>passage de messages</strong> (<code>[liste addObject:note]</code>).",
        "L'usage des conteneurs <strong>Foundation</strong> et des propriétés.",
      ],
      criteres: [
        "Une classe est définie avec <code>@interface</code>/<code>@implementation</code> et des propriétés.",
        "Les opérations se font par <strong>passage de messages</strong> (<code>[objet methode:arg]</code>).",
        "Un <strong>conteneur Foundation</strong> (<code>NSMutableArray</code>) stocke les notes.",
        "L'ajout / la suppression <strong>fonctionne</strong>.",
        "Le code <strong>compile</strong> (clang / Xcode).",
      ],
      livrable: "Une partie de l'app comprise et réécrite en Objective-C.",
    },

    {
      n: 4,
      course: "kotlin",
      courseTitle: "Kotlin",
      dir: "kotlin",
      accent: "kotlin",
      phase: "Android natif",
      titre: "L'app de notes sur Android, en Kotlin",
      depart: "L'app iOS native (Swift, Objective-C) des étapes 1-2.",
      objectif:
        "<p>Porter l'application sur <strong>Android</strong> avec <strong>Kotlin</strong>, le langage officiel du système : " +
        "un modèle sûr et concis, et une liste qui réagit aux changements.</p>",
      ajoute: [
        "Une <strong>data class</strong> <code>Note</code>.",
        "Une <strong>collection</strong> de notes et les opérations (ajout, suppression).",
        "La <strong>null safety</strong> (<code>?.</code>, <code>?:</code>) pour les cas vides.",
        "La gestion d'<strong>état</strong> (la liste se met à jour, ex. Jetpack Compose) — conceptuelle.",
      ],
      criteres: [
        "Une <strong>data class</strong> modélise une note.",
        "La <strong>null safety</strong> est respectée (pas de <code>!!</code>).",
        "Les collections sont traitées avec des <strong>lambdas</strong>.",
        "L'ajout / la suppression <strong>fonctionne</strong>.",
        "Le code <strong>compile</strong> (Android Studio).",
      ],
      livrable: "L'app de notes en Kotlin (Android natif).",
    },
    {
      n: 5,
      course: "dart",
      courseTitle: "Dart",
      dir: "dart",
      accent: "dart",
      phase: "Multiplateforme",
      titre: "Porter l'app en Flutter (multiplateforme)",
      depart: "L'app native iOS (Swift, Objective-C) et Android (Kotlin) des étapes 1-3.",
      objectif:
        "<p>Donner à l'app une <strong>seule base de code</strong> pour iOS <em>et</em> Android avec <strong>Dart/Flutter</strong> : " +
        "le modèle est porté, l'interface devient des <em>widgets</em>.</p>",
      ajoute: [
        "Une classe <strong>Note</strong> en Dart (avec la <strong>null safety</strong>).",
        "Une <strong>collection</strong> de notes et les opérations (ajout, suppression).",
        "La gestion d'<strong>état</strong> de l'application (la liste réagit aux changements).",
        "Une interface en <strong>widgets</strong> (liste, formulaire) — conceptuelle.",
      ],
      criteres: [
        "Une <strong>classe</strong> modélise une note (types nullables explicites <code>?</code>).",
        "La <strong>null safety</strong> est respectée (pas de plantage).",
        "Les <strong>collections</strong> portent les notes ; ajout/suppression OK.",
        "L'<strong>état</strong> est géré (la liste se met à jour).",
        "Le code <strong>compile</strong> (Dart / Flutter).",
      ],
      livrable: "🏁 Une app de notes, du natif iOS (Swift, Objective-C) au multiplateforme (Flutter) !",
    },
  ],
};
