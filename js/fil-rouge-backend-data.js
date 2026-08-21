/* =============================================================================
   fil-rouge-backend-data.js — FIL ROUGE « Une API REST multi-langages ».
   La MÊME API (un service de tâches) conçue une fois, puis ré-implémentée dans
   plusieurs langages backend, dotée d'une base, et enfin ré-exposée dans un
   autre style : api → Go → C# → PHP → Ruby → NoSQL → GraphQL.
   L'étape GraphQL a été ajoutée au chantier V13-A2 : elle venait du fil « ia »,
   où « exposer l'IA en GraphQL » était un débouché artificiel. Ici, elle a un
   vrai sujet — la même ressource, vue par REST puis par GraphQL.
   Définit window.FIL_ROUGE → moteur générique js/fil-rouge.js.
   Page : pages/fil-rouge-backend.html. 100 % file://.
   ============================================================================= */
window.FIL_ROUGE = {
  id: "backend",
  titre: "Une API REST, dans plusieurs langages",
  sousTitre: "Concevoir une API une fois, puis la ré-implémenter en Go, C#, PHP et Ruby, lui donner une base — et finir en la ré-exposant en GraphQL.",
  intro:
    "<p>Côté serveur, ce ne sont pas les idées qui changent (ressources, verbes, statuts, JSON) mais la <strong>façon de " +
    "les écrire</strong>. Tu <strong>conçois</strong> une API de tâches, puis tu la <strong>ré-implémentes</strong> dans " +
    "plusieurs langages backend pour les comparer, et tu lui ajoutes une <strong>base de données</strong>.</p>" +
    "<p>Le contrat de l'API (les mêmes routes, les mêmes réponses) reste identique : seul le langage change. À toi de voir " +
    "ce que chacun apporte en confort, en concision et en performance.</p>" +
    "<p>La dernière étape change d'axe : ce n'est plus le langage qui varie, mais le <strong>style d'API</strong>. La même " +
    "ressource est ré-exposée en <strong>GraphQL</strong>, où le client choisit ses champs — l'occasion de mesurer, sur ton " +
    "propre code, ce que chaque style fait gagner et ce qu'il complique.</p>",
  etapes: [
    {
      n: 1,
      course: "api",
      courseTitle: "API REST",
      dir: "api",
      accent: "api",
      phase: "Concevoir",
      titre: "Concevoir le contrat de l'API",
      depart: "Un besoin : un service de tâches (créer, lister, modifier, supprimer).",
      objectif:
        "<p>Définir une <strong>API REST</strong> propre <em>avant</em> d'écrire une ligne de serveur : les ressources, " +
        "les URL, les verbes, les statuts et les corps JSON.</p>",
      ajoute: [
        "Les <strong>ressources</strong> et leurs <strong>URL</strong> (collections + éléments).",
        "Le <strong>verbe</strong> et le <strong>statut</strong> attendus pour chaque action.",
        "Des <strong>exemples de corps JSON</strong> (requête et réponse).",
        "La <strong>pagination</strong> ou le filtrage d'une liste.",
      ],
      criteres: [
        "Les URL nomment des <strong>ressources</strong> (pas de verbe dans l'URL).",
        "Chaque action a le <strong>bon verbe</strong> (GET/POST/PUT/PATCH/DELETE).",
        "Les <strong>statuts</strong> sont justes (201, 204, 404, 400).",
        "Des <strong>exemples JSON</strong> documentent les échanges.",
        "Une <strong>liste</strong> prévoit pagination/filtrage.",
      ],
      livrable: "Le contrat de l'API (spécification des endpoints).",
    },
    {
      n: 2,
      course: "go",
      courseTitle: "Go",
      dir: "go",
      accent: "go",
      phase: "Implémenter",
      titre: "Implémenter l'API en Go",
      depart: "Le contrat d'API de l'étape 1.",
      objectif:
        "<p>Donner vie au contrat en <strong>Go</strong> : un serveur <code>net/http</code> concurrent, simple et rapide, " +
        "qui respecte exactement les routes et statuts définis.</p>",
      ajoute: [
        "Un serveur <code>net/http</code> qui implémente les routes du contrat.",
        "La lecture/écriture du <strong>JSON</strong> (encodage, décodage).",
        "Les <strong>bons statuts</strong> et la gestion d'erreurs idiomatique (<code>if err != nil</code>).",
        "Un stockage en mémoire protégé pour l'<strong>accès concurrent</strong>.",
      ],
      criteres: [
        "Le serveur <strong>écoute</strong> un port et implémente les 4 verbes.",
        "Le <strong>JSON</strong> est lu et renvoyé conformément au contrat.",
        "Les <strong>statuts</strong> respectent l'étape 1.",
        "Les erreurs sont <strong>vérifiées</strong> (pas ignorées).",
        "L'accès aux données partagées est <strong>sûr</strong> (pas de data race).",
      ],
      livrable: "L'API implémentée en Go.",
    },
    {
      n: 3,
      course: "csharp",
      courseTitle: "C#",
      dir: "csharp",
      accent: "csharp",
      phase: "Implémenter",
      titre: "La même API en C# (.NET)",
      depart: "Le contrat (étape 1) et la version Go (étape 2).",
      objectif:
        "<p>Ré-implémenter la même API en <strong>C#</strong> : profite des classes, des propriétés et de LINQ pour un code " +
        "structuré, et <strong>compare</strong> avec la version Go.</p>",
      ajoute: [
        "Des <strong>classes</strong> et propriétés pour le modèle (Tâche).",
        "Les mêmes <strong>routes</strong> que le contrat.",
        "Des requêtes <strong>LINQ</strong> pour filtrer/transformer.",
        "La gestion d'erreurs par <strong>exceptions</strong> → statuts.",
      ],
      criteres: [
        "Le modèle utilise des <strong>classes/propriétés</strong>.",
        "Les <strong>routes et statuts</strong> respectent le contrat.",
        "Au moins une requête <strong>LINQ</strong> est utilisée.",
        "Les erreurs deviennent des <strong>statuts</strong> corrects (4xx/5xx).",
        "Le comportement est <strong>identique</strong> à la version Go.",
      ],
      livrable: "L'API ré-implémentée en C#.",
    },
    {
      n: 4,
      course: "php",
      courseTitle: "PHP",
      dir: "php",
      accent: "php",
      phase: "Implémenter",
      titre: "La même API en PHP",
      depart: "Le contrat et les versions Go/C# (étapes 1-3).",
      objectif:
        "<p>Ré-implémenter l'API en <strong>PHP</strong>, le langage historique du web côté serveur : router les requêtes, " +
        "lire le JSON et sécuriser les entrées.</p>",
      ajoute: [
        "Un <strong>routeur</strong> simple (méthode + chemin → action).",
        "La lecture du <strong>corps JSON</strong> et l'envoi de réponses JSON.",
        "La <strong>validation</strong> des entrées.",
        "Les <strong>bons statuts</strong> (codes de réponse HTTP).",
      ],
      criteres: [
        "Les requêtes sont <strong>routées</strong> par méthode + chemin.",
        "Le <strong>JSON</strong> est lu et renvoyé.",
        "Les entrées sont <strong>validées</strong>.",
        "Les <strong>statuts</strong> respectent le contrat.",
        "Le comportement est <strong>identique</strong> aux versions précédentes.",
      ],
      livrable: "L'API ré-implémentée en PHP.",
    },
    {
      n: 5,
      course: "ruby",
      courseTitle: "Ruby",
      dir: "ruby",
      accent: "ruby",
      phase: "Implémenter",
      titre: "La même API en Ruby",
      depart: "Le contrat et les versions précédentes (étapes 1-4).",
      objectif:
        "<p>Ré-implémenter l'API en <strong>Ruby</strong>, réputé pour son élégance : un code expressif et concis qui " +
        "respecte le même contrat.</p>",
      ajoute: [
        "Une classe/structure pour le modèle (Tâche).",
        "Le routage des requêtes et la <strong>sérialisation JSON</strong>.",
        "Des <strong>blocs/itérateurs</strong> idiomatiques pour traiter les collections.",
        "Les <strong>bons statuts</strong> et la gestion des cas d'erreur.",
      ],
      criteres: [
        "Le code est <strong>idiomatique</strong> (blocs, enumerable).",
        "Les <strong>routes et statuts</strong> respectent le contrat.",
        "Le <strong>JSON</strong> est lu et renvoyé.",
        "Les cas d'erreur renvoient les <strong>bons statuts</strong>.",
        "Le comportement est <strong>identique</strong> aux versions précédentes.",
      ],
      livrable: "L'API ré-implémentée en Ruby.",
    },
    {
      n: 6,
      course: "nosql",
      courseTitle: "NoSQL",
      dir: "nosql",
      accent: "nosql",
      phase: "Persister",
      titre: "Donner une base de données à l'API",
      depart: "Une (ou plusieurs) implémentation de l'API (étapes 2-5).",
      objectif:
        "<p>Remplacer le stockage en mémoire par une vraie <strong>base NoSQL</strong> (documentaire) : les tâches " +
        "persistent et l'API tire des <strong>statistiques</strong>.</p>",
      ajoute: [
        "Une <strong>collection</strong> de documents pour les tâches.",
        "Le branchement de l'API : <strong>lire/écrire</strong> en base au lieu de la mémoire.",
        "Des <strong>requêtes</strong> (filtre, tri, limite) pour les listes.",
        "Une <strong>agrégation</strong> simple (compteur, regroupement).",
      ],
      criteres: [
        "Les tâches sont stockées comme <strong>documents</strong> (modélisation NoSQL).",
        "L'API <strong>lit et écrit</strong> en base (plus de stockage volatil).",
        "Les <strong>requêtes</strong> de liste (filtre/tri/limite) fonctionnent.",
        "Une <strong>agrégation</strong> alimente une statistique.",
        "Le choix imbrication/référence est <strong>justifié</strong>.",
      ],
      livrable: "Une API REST conçue une fois, vue par quatre langages, avec sa base de données.",
    },
    {
      n: 7,
      course: "graphql",
      courseTitle: "GraphQL",
      dir: "graphql",
      accent: "graphql",
      phase: "Comparer",
      titre: "Ré-exposer la même API en GraphQL",
      depart: "L'API REST des étapes 1 à 6, complète et branchée à sa base — et un client qui reçoit toujours trop de champs, ou pas assez.",
      objectif:
        "<p>Changer de style sans changer de métier : les mêmes tâches, exposées cette fois par un <strong>schéma " +
        "typé</strong> où le client demande <strong>exactement</strong> les champs dont il a besoin. Un point d'entrée " +
        "unique au lieu d'une route par ressource, des <strong>requêtes</strong> pour lire, des <strong>mutations</strong> " +
        "pour écrire, des <strong>résolveurs</strong> qui tapent dans la même base qu'à l'étape 6.</p>" +
        "<p>Le but n'est pas de désigner un vainqueur : c'est de <strong>mesurer</strong>, sur ton propre code, ce que " +
        "GraphQL supprime (la sur-récupération, les appels en cascade) et ce qu'il ramène (le problème <strong>N+1</strong>, " +
        "le cache HTTP qu'on perd, la profondeur des requêtes à limiter).</p>",
      ajoute: [
        "Un <strong>schéma typé</strong> décrivant la tâche et ses opérations.",
        "Les <strong>requêtes</strong> et <strong>mutations</strong> équivalentes aux routes REST des étapes précédentes.",
        "Des <strong>résolveurs</strong> branchés sur la <strong>même base</strong> qu'à l'étape 6 (aucune donnée dupliquée).",
        "Un traitement du <strong>N+1</strong> (regroupement des accès) et une limite de profondeur.",
        "Une <strong>comparaison chiffrée</strong> REST / GraphQL sur un même écran client (champs reçus, nombre d'appels).",
      ],
      criteres: [
        "Le <strong>schéma</strong> décrit les mêmes opérations que l'API REST, sans en inventer.",
        "Les <strong>résolveurs</strong> lisent et écrivent dans la base de l'étape 6.",
        "Le client obtient <strong>exactement</strong> les champs demandés, ni plus ni moins.",
        "Le <strong>N+1</strong> est identifié et traité ; la profondeur des requêtes est bornée.",
        "La <strong>comparaison</strong> REST / GraphQL est chiffrée et honnête (ce que chacun coûte).",
      ],
      livrable: "🏁 Une API conçue une fois, écrite en quatre langages, posée sur une base — et ré-exposée en GraphQL, chiffres de comparaison à l'appui !",
    },
  ],
};
