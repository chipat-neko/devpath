/* =============================================================================
   fil-rouge-patrimoine-data.js — FIL ROUGE « Explorer le patrimoine logiciel ».
   Quatre langages historiques qui font ENCORE tourner des pans entiers de
   l'industrie : la gestion (COBOL), le calcul scientifique (Fortran), la
   programmation structurée (Pascal) et l'automatisation de bureau (VBA) :
   cobol → fortran → pascal → vb.
   L'étape VBA a été ajoutée au chantier V13-A3 : `vb` ne figurait dans aucun
   fil rouge, et le patrimoine ne vit pas que sur les gros systèmes.
   Définit window.FIL_ROUGE → moteur générique js/fil-rouge.js.
   Page : pages/fil-rouge-patrimoine.html. 100 % file://.
   ============================================================================= */
window.FIL_ROUGE = {
  id: "patrimoine",
  titre: "Explorer le patrimoine logiciel",
  sousTitre: "Quatre langages historiques toujours bien vivants : la gestion (COBOL), le calcul scientifique (Fortran), la structure (Pascal) — et les macros de bureau (VBA), le patrimoine qu'on oublie.",
  intro:
    "<p>Une part énorme du logiciel qui fait tourner le monde — banques, assurances, administrations, laboratoires — repose " +
    "sur des langages <strong>anciens mais toujours actifs</strong>. Les comprendre, c'est pouvoir <strong>lire</strong>, " +
    "<strong>maintenir</strong> et <strong>moderniser</strong> ce code hérité au lieu d'en avoir peur.</p>" +
    "<p>Ce fil rouge traverse quatre visages du patrimoine : <strong>COBOL</strong> et ses traitements de gestion, " +
    "<strong>Fortran</strong> et son calcul scientifique, <strong>Pascal</strong> et sa rigueur structurée, puis " +
    "<strong>VBA</strong> — le patrimoine le plus proche de nous, celui qui dort dans les classeurs de tous les " +
    "services. Pour chacun, on écrit un petit programme représentatif de ce pour quoi il a été conçu — et on comprend " +
    "<em>pourquoi</em> il a duré.</p>",
  etapes: [
    {
      n: 1,
      course: "cobol",
      courseTitle: "COBOL",
      dir: "cobol",
      accent: "cobol",
      phase: "Gestion",
      titre: "Un traitement de gestion (COBOL)",
      depart: "Un fichier d'enregistrements (clients, comptes, transactions) à traiter par lots.",
      objectif:
        "<p>Découvrir la logique du <strong>traitement par lots</strong> qui fait tourner banques et assurances : des " +
        "<strong>enregistrements</strong> structurés, lus séquentiellement, traités et totalisés, avec la verbosité assumée " +
        "et la lisibilité « métier » de <strong>COBOL</strong>.</p>",
      ajoute: [
        "Une <strong>structure d'enregistrement</strong> (DATA DIVISION) décrivant les données.",
        "La <strong>lecture séquentielle</strong> d'un fichier et le traitement de chaque enregistrement.",
        "Des <strong>calculs de gestion</strong> (totaux, agrégats) et un état de sortie.",
        "Une organisation en <strong>divisions/sections</strong> conforme à l'esprit du langage.",
      ],
      criteres: [
        "Les données sont décrites par des <strong>enregistrements</strong> structurés.",
        "Le fichier est <strong>parcouru</strong> et chaque enregistrement traité.",
        "Les <strong>totaux/agrégats</strong> de gestion sont corrects.",
        "Le programme respecte la <strong>structure</strong> en divisions de COBOL.",
        "La sortie est un <strong>état lisible</strong> (façon rapport de gestion).",
      ],
      livrable: "Un programme COBOL qui traite un lot d'enregistrements et produit un état de gestion.",
    },
    {
      n: 2,
      course: "fortran",
      courseTitle: "Fortran",
      dir: "fortran",
      accent: "fortran",
      phase: "Calcul",
      titre: "Un calcul scientifique (Fortran)",
      depart: "Un problème numérique : des tableaux de mesures à traiter (moyennes, produit matriciel, série).",
      objectif:
        "<p>Mettre Fortran sur son terrain de prédilection : le <strong>calcul numérique</strong> performant. Manipuler des " +
        "<strong>tableaux</strong>, écrire des <strong>boucles de calcul</strong> et des <strong>subroutines</strong>, et " +
        "comprendre pourquoi il reste roi en calcul scientifique haute performance.</p>",
      ajoute: [
        "Des <strong>tableaux</strong> et des opérations numériques sur ceux-ci.",
        "Des <strong>boucles</strong> de calcul (sommes, moyennes, produit matriciel).",
        "Des <strong>subroutines/fonctions</strong> pour structurer le calcul.",
        "Un usage correct des <strong>types numériques</strong> (réels, précision).",
      ],
      criteres: [
        "Le programme effectue un <strong>calcul numérique</strong> juste sur des tableaux.",
        "Les <strong>boucles</strong> de calcul sont correctes et lisibles.",
        "Le code est structuré en <strong>subroutines/fonctions</strong> réutilisables.",
        "Les <strong>types numériques</strong> et la précision sont adaptés au problème.",
        "Le résultat est <strong>vérifiable</strong> (comparé à un calcul à la main sur un petit cas).",
      ],
      livrable: "Un programme Fortran qui résout un petit problème de calcul numérique sur des tableaux.",
    },
    {
      n: 3,
      course: "pascal",
      courseTitle: "Pascal",
      dir: "pascal",
      accent: "pascal",
      phase: "Structure",
      titre: "La programmation structurée (Pascal)",
      depart: "Un petit utilitaire à écrire proprement (gestion d'une liste, menu interactif).",
      objectif:
        "<p>Revenir aux sources de la <strong>programmation structurée</strong> avec Pascal, longtemps langage " +
        "d'<strong>enseignement</strong> : typage clair, procédures et fonctions, et structures de données bien définies — " +
        "la rigueur qui forme de bonnes habitudes.</p>",
      ajoute: [
        "Un programme au <strong>typage explicite</strong> (déclarations claires).",
        "Des <strong>procédures et fonctions</strong> bien séparées.",
        "Des <strong>structures de données</strong> (records, tableaux) adaptées.",
        "Un flux <strong>structuré</strong> et lisible (pas de raccourcis douteux).",
      ],
      criteres: [
        "Les données et variables sont <strong>typées explicitement</strong>.",
        "La logique est découpée en <strong>procédures/fonctions</strong> cohérentes.",
        "Les <strong>structures de données</strong> choisies conviennent au problème.",
        "Le programme est <strong>structuré et lisible</strong> de bout en bout.",
        "Il <strong>fonctionne</strong> et illustre la discipline structurée de Pascal.",
      ],
      livrable: "Trois piliers du patrimoine parcourus : la gestion (COBOL), le calcul (Fortran) et la structure (Pascal).",
    },
    {
      n: 4,
      course: "vb",
      courseTitle: "Visual Basic",
      dir: "vb",
      accent: "vb",
      phase: "Bureau",
      titre: "Le patrimoine qui dort dans les tableurs (VBA)",
      depart: "Un classeur de travail réel : des données recopiées à la main tous les mois, et une procédure que tout le monde connaît de tête.",
      objectif:
        "<p>Le patrimoine n'est pas que sur des gros systèmes : il est aussi dans les <strong>classeurs</strong> d'un " +
        "service comptable, sous forme de macros écrites il y a quinze ans par quelqu'un qui est parti. " +
        "<strong>VBA</strong> pilote encore une quantité considérable de travail de bureau, et <strong>VB.NET</strong> " +
        "prolonge la même syntaxe dans l'écosystème .NET moderne.</p>" +
        "<p>Ici, on <strong>automatise une tâche répétitive</strong> réelle : lire une feuille, transformer, écrire un " +
        "résultat — puis on la rend <strong>lisible et reprenable</strong> par le suivant, ce qui est exactement le " +
        "problème que pose tout code hérité.</p>",
      ajoute: [
        "Une <strong>macro</strong> qui remplace une manipulation faite à la main chaque semaine ou chaque mois.",
        "Des <strong>procédures et fonctions</strong> nommées, plutôt qu'un seul bloc enregistré au magnétophone.",
        "Une <strong>gestion d'erreurs</strong> : un classeur mal formé ne doit pas laisser le travail à moitié fait.",
        "Un <strong>mode d'emploi</strong> court dans le fichier : ce que fait la macro, ce qu'elle attend en entrée.",
        "Un regard sur <strong>VB.NET</strong> : ce que deviendrait ce code hors du tableur.",
      ],
      criteres: [
        "La macro <strong>fait vraiment gagner du temps</strong> sur une tâche identifiée, mesurée avant/après.",
        "Le code est <strong>découpé</strong> et nommé, pas enregistré d'un bloc.",
        "Les <strong>cas anormaux</strong> (colonne absente, cellule vide, format inattendu) sont traités.",
        "Un <strong>collègue</strong> peut reprendre le fichier sans explication orale.",
        "On sait dire ce qui <strong>justifierait</strong> — ou non — de porter ce code vers VB.NET.",
      ],
      livrable: "🏁 Quatre visages du patrimoine : la gestion (COBOL), le calcul (Fortran), la structure (Pascal) et l'automatisation de bureau (VBA) !",
    },
  ],
};
