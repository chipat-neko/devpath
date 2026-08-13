/* =============================================================================
   projets-data.js — Briefs de « projets fil rouge » contextualisés (un par cours).
   On pose un CONTEXTE + un cahier des charges ; l'apprenant réalise le livrable
   lui-même (≠ le mini-projet GUIDÉ de la dernière leçon). 100 % file://.
   Format d'un brief :
     { id, course, courseTitle, dir, accent, type, niveau, titre,
       contexte(HTML), objectif(HTML), livrable,
       fonctionnalites:[HTML], criteres:[HTML court], pistes(HTML) }
   Rendu : js/projets.js · Page : pages/projets.html.
   Prototype : trio web (HTML, CSS, JavaScript). À compléter pour les autres cours.
   ============================================================================= */
window.PROJETS = [
  {
    id: "html-cafe",
    course: "html",
    courseTitle: "HTML",
    dir: "html",
    accent: "html",
    type: "Site web statique",
    niveau: "Débutant",
    titre: "Le site vitrine d'un café de quartier",
    contexte:
      "<p>Le café <strong>« Le Comptoir »</strong> vient d'ouvrir et veut une présence en ligne simple : " +
      "présenter le lieu, afficher la carte, indiquer les horaires et permettre de le contacter. " +
      "Pas de design avancé pour l'instant — ce sera le projet du cours CSS. Ici, on se concentre sur une " +
      "<strong>structure HTML propre et sémantique</strong>, sans feuille de style ni JavaScript.</p>",
    objectif:
      "<p>Construire un petit <strong>site statique en HTML pur</strong> (1 à 3 pages) qui présente le café. " +
      "L'objectif est de mettre en pratique la structure d'un document, les liens, les images, les tableaux, " +
      "les formulaires et les balises sémantiques.</p>",
    livrable: "Un site web statique en HTML (1 à 3 pages : accueil, carte, contact).",
    fonctionnalites: [
      "Une page d'accueil : nom du café, courte présentation, ambiance.",
      "Une <strong>barre de navigation</strong> reliant les pages (ou les sections) entre elles.",
      "La <strong>carte</strong> (boissons et pâtisseries) sous forme de <code>&lt;table&gt;</code> : nom, description, prix.",
      "Les <strong>horaires</strong> d'ouverture (liste ou petit tableau).",
      "Une <strong>galerie de photos</strong> avec des textes alternatifs pertinents.",
      "Un <strong>formulaire de contact</strong> : nom, e-mail, message, bouton d'envoi.",
      "Un <strong>pied de page</strong> avec l'adresse et des liens vers les réseaux sociaux.",
    ],
    criteres: [
      "Le document commence par <code>&lt;!DOCTYPE html&gt;</code> et utilise <code>&lt;html lang=\"fr\"&gt;</code>.",
      "Le <code>&lt;head&gt;</code> contient un <code>&lt;title&gt;</code> et <code>&lt;meta charset=\"utf-8\"&gt;</code>.",
      "La page s'appuie sur des balises sémantiques : <code>header</code>, <code>nav</code>, <code>main</code>, <code>section</code>, <code>footer</code>.",
      "Toutes les images <code>&lt;img&gt;</code> ont un attribut <code>alt</code> qui décrit l'image.",
      "La navigation utilise des liens <code>&lt;a href&gt;</code> qui mènent réellement quelque part.",
      "La carte est un vrai <code>&lt;table&gt;</code> avec des en-têtes <code>&lt;th&gt;</code>.",
      "Le formulaire relie chaque <code>&lt;label&gt;</code> à son champ (<code>for</code> / <code>id</code>).",
      "Aucune balise n'est laissée ouverte : le HTML est bien équilibré.",
    ],
    pistes:
      "<p>Mobilise les leçons sur la <strong>structure d'un document</strong>, les <strong>liens et images</strong>, " +
      "les <strong>listes et tableaux</strong>, les <strong>formulaires</strong> et la <strong>sémantique</strong>.</p>" +
      "<p>Structure suggérée d'une page :</p>" +
      "<ul>" +
      "<li><code>&lt;header&gt;</code> : le nom du café + le <code>&lt;nav&gt;</code> ;</li>" +
      "<li><code>&lt;main&gt;</code> : une <code>&lt;section&gt;</code> par bloc (présentation, carte, horaires, galerie, contact) ;</li>" +
      "<li><code>&lt;footer&gt;</code> : adresse et liens.</li>" +
      "</ul>" +
      "<p>Commence par une seule page bien structurée, puis duplique-la pour « carte » et « contact » si tu veux plusieurs pages. " +
      "Ouvre le fichier dans ton navigateur à chaque étape pour vérifier.</p>",
  },

  {
    id: "css-produit",
    course: "css",
    courseTitle: "CSS",
    dir: "css",
    accent: "css",
    type: "Mise en forme (CSS)",
    niveau: "Débutant → intermédiaire",
    titre: "Habiller la page d'un produit",
    contexte:
      "<p>Une marque lance un <strong>casque audio</strong> et te confie le <strong>HTML brut</strong> de sa page de " +
      "présentation : tout le contenu est là, mais sans aucun style. Ta mission : l'<strong>habiller entièrement en CSS</strong> " +
      "pour en faire une <em>landing page</em> moderne et responsive — sans toucher au contenu, seulement au style.</p>",
    objectif:
      "<p>Écrire une <strong>feuille de style complète</strong> qui transforme une page HTML brute en page produit " +
      "attrayante et lisible sur tous les écrans, en mobilisant couleurs, typographie, modèle de boîte, Flexbox, Grid et responsive.</p>",
    livrable: "Une page web mise en forme avec une feuille de style CSS (un fichier .css lié au HTML).",
    fonctionnalites: [
      "Une <strong>palette de couleurs</strong> cohérente, définie avec des <strong>variables CSS</strong>.",
      "Une <strong>typographie</strong> soignée : familles, tailles, interlignage, hiérarchie des titres.",
      "Une <strong>barre de navigation</strong> disposée avec <strong>Flexbox</strong>.",
      "Une <strong>grille de caractéristiques</strong> du produit disposée avec <strong>CSS Grid</strong>.",
      "Un <strong>bouton d'action</strong> avec un effet au survol (<code>:hover</code>) et une transition.",
      "Un <strong>design responsive</strong> : la page reste lisible sur mobile (media query).",
    ],
    criteres: [
      "Le CSS est dans un <strong>fichier séparé</strong>, relié par <code>&lt;link rel=\"stylesheet\"&gt;</code>.",
      "Au moins <strong>3 variables CSS</strong> (dans <code>:root</code>) servent aux couleurs.",
      "La navigation est disposée avec <strong>Flexbox</strong> (<code>display: flex</code>).",
      "Au moins une section utilise <strong>CSS Grid</strong> (<code>display: grid</code>).",
      "Il y a au moins un <code>:hover</code> accompagné d'une <code>transition</code>.",
      "Une <strong>media query</strong> adapte la mise en page aux petits écrans.",
      "Le <strong>contenu HTML n'a pas été modifié</strong> : seul le style change.",
    ],
    pistes:
      "<p>Mobilise les leçons sur les <strong>couleurs et variables</strong>, la <strong>typographie</strong>, le " +
      "<strong>modèle de boîte</strong>, <strong>Flexbox</strong>, <strong>Grid</strong>, le <strong>responsive</strong> et les <strong>transitions</strong>.</p>" +
      "<p>Conseils :</p>" +
      "<ul>" +
      "<li>Pars d'un HTML simple (titre, nav, image du produit, liste de caractéristiques, bouton) ;</li>" +
      "<li>définis d'abord tes variables dans <code>:root</code> (couleur principale, fond, texte) ;</li>" +
      "<li>travaille <em>mobile d'abord</em>, puis ajoute une <code>@media (min-width: 700px)</code> pour les grands écrans ;</li>" +
      "<li>garde les espacements réguliers (une même unité de marge) pour un rendu net.</li>" +
      "</ul>",
  },

  {
    id: "js-quiz",
    course: "javascript",
    courseTitle: "JavaScript",
    dir: "js",
    accent: "javascript",
    type: "Application web interactive",
    niveau: "Intermédiaire",
    titre: "Un quiz interactif",
    contexte:
      "<p>Un site éducatif veut un petit <strong>quiz à choix multiples</strong> pour tester ses visiteurs : " +
      "une question à la fois, un score qui évolue, et un récapitulatif à la fin. Tout doit se passer " +
      "<strong>dans le navigateur</strong>, sans rechargement de page.</p>" +
      "<p>Pour ne pas refaire le gestionnaire de tâches (le fil rouge du cours), on construit ici un projet différent " +
      "qui mobilise les mêmes notions : tableaux, objets, DOM et événements.</p>",
    objectif:
      "<p>Construire une <strong>application de quiz</strong> entièrement en JavaScript qui manipule le DOM pour " +
      "afficher les questions, réagir aux clics, calculer le score et afficher un résultat final.</p>",
    livrable: "Une application web (HTML + CSS + JavaScript) : un quiz interactif fonctionnel.",
    fonctionnalites: [
      "Une liste de <strong>questions</strong> stockée dans un <strong>tableau d'objets</strong> (énoncé, réponses, bonne réponse).",
      "L'affichage d'<strong>une question à la fois</strong>, avec ses réponses sous forme de boutons.",
      "La réaction au <strong>clic</strong> : indiquer si la réponse choisie est bonne ou mauvaise.",
      "Le <strong>passage</strong> à la question suivante.",
      "Le calcul et l'affichage du <strong>score</strong> en direct.",
      "Un <strong>écran de fin</strong> avec le score final et un bouton « Recommencer ».",
      "(Bonus) La sauvegarde du <strong>meilleur score</strong> avec <code>localStorage</code>.",
    ],
    criteres: [
      "Les questions sont dans un <strong>tableau d'objets</strong>, pas écrites en dur dans le HTML.",
      "Le DOM est mis à jour en JavaScript (<code>createElement</code> / <code>textContent</code> / <code>innerHTML</code>).",
      "Les boutons de réponse réagissent à un événement <code>click</code> (<code>addEventListener</code>).",
      "Le score est <strong>calculé correctement</strong> et affiché à l'écran.",
      "L'<strong>écran de fin</strong> apparaît après la dernière question.",
      "Le bouton « Recommencer » <strong>réinitialise</strong> le quiz sans recharger la page.",
      "Aucune <strong>erreur</strong> n'apparaît dans la console du navigateur.",
    ],
    pistes:
      "<p>Mobilise les leçons sur les <strong>tableaux</strong>, les <strong>objets</strong>, les <strong>fonctions</strong>, " +
      "le <strong>DOM</strong>, les <strong>événements</strong> et les <strong>conditions</strong> (et <code>localStorage</code> pour le bonus).</p>" +
      "<p>Une organisation possible :</p>" +
      "<ul>" +
      "<li>un tableau <code>questions</code> = objets <code>{ enonce, reponses: [...], bonne: 2 }</code> ;</li>" +
      "<li>un état : <code>indexCourant</code> et <code>score</code> ;</li>" +
      "<li>une fonction <code>afficherQuestion()</code> qui construit les boutons ;</li>" +
      "<li>une fonction <code>repondre(i)</code> qui vérifie, met à jour le score, puis passe à la suite ;</li>" +
      "<li>une fonction <code>afficherFin()</code> pour le récapitulatif.</li>" +
      "</ul>" +
      "<p>Astuce : commence avec 3 questions « en dur » pour faire fonctionner la boucle, puis enrichis la liste.</p>",
  },

  {
    id: "python-budget",
    course: "python",
    courseTitle: "Python",
    dir: "python",
    accent: "python",
    type: "Application en ligne de commande",
    niveau: "Débutant → intermédiaire",
    titre: "Un gestionnaire de budget personnel",
    contexte:
      "<p>Tu veux suivre tes dépenses du mois sans tableur. Construis un petit <strong>programme en ligne de commande</strong> " +
      "qui enregistre tes dépenses, les range par catégorie et te donne le total — le tout sauvegardé d'une exécution à l'autre.</p>",
    objectif:
      "<p>Écrire une <strong>application Python</strong> qui mobilise les listes, les dictionnaires, les fonctions, " +
      "les boucles, la lecture/écriture de fichiers et la gestion des erreurs.</p>",
    livrable: "Un programme Python exécutable en console (un ou plusieurs fichiers .py).",
    fonctionnalites: [
      "Un <strong>menu</strong> en boucle : ajouter une dépense, lister, voir les totaux, quitter.",
      "Chaque dépense a un <strong>montant</strong>, une <strong>catégorie</strong> et une description.",
      "Le calcul du <strong>total par catégorie</strong> et du total général.",
      "La <strong>sauvegarde</strong> des dépenses dans un fichier (texte, JSON ou CSV) et leur rechargement au démarrage.",
      "Une <strong>validation</strong> des entrées (un montant doit être un nombre positif).",
    ],
    criteres: [
      "Les données sont organisées avec des <strong>listes et des dictionnaires</strong>.",
      "Le code est découpé en <strong>fonctions</strong> (une responsabilité chacune).",
      "Une <strong>boucle</strong> fait tourner le menu jusqu'à « quitter ».",
      "Les dépenses sont <strong>écrites dans un fichier</strong> et relues au lancement suivant.",
      "Les entrées invalides sont gérées avec <code>try/except</code> sans planter.",
      "Le total par catégorie est <strong>correct</strong>.",
    ],
    pistes:
      "<p>Mobilise les leçons sur les <strong>types</strong>, les <strong>structures de données</strong>, les " +
      "<strong>fonctions</strong>, les <strong>fichiers</strong> et la <strong>gestion des erreurs</strong>.</p>" +
      "<p>Organisation possible : une liste <code>depenses</code> de dictionnaires <code>{\"montant\": .., \"categorie\": .., \"desc\": ..}</code> ; " +
      "des fonctions <code>ajouter()</code>, <code>lister()</code>, <code>totaux()</code>, <code>sauver()</code>, <code>charger()</code> ; " +
      "le module <code>json</code> est le plus simple pour la sauvegarde.</p>",
  },

  {
    id: "sql-bibliotheque",
    course: "sql",
    courseTitle: "SQL",
    dir: "sql",
    accent: "sql",
    type: "Base de données & requêtes",
    niveau: "Intermédiaire",
    titre: "La base de données d'une bibliothèque",
    contexte:
      "<p>Une petite <strong>bibliothèque</strong> veut informatiser ses prêts : qui a emprunté quoi, quels livres sont " +
      "disponibles, lesquels sont en retard. À toi de <strong>concevoir la base</strong> et d'écrire les requêtes qui répondent à ces questions.</p>",
    objectif:
      "<p>Concevoir un <strong>schéma relationnel</strong> et écrire les requêtes qui l'exploitent : création de tables, " +
      "insertions, sélections, jointures et agrégats.</p>",
    livrable: "Un script SQL : la création des tables, des données d'exemple et une série de requêtes.",
    fonctionnalites: [
      "Trois tables au moins : <strong>livres</strong>, <strong>membres</strong>, <strong>emprunts</strong>, reliées par des clés.",
      "Des <strong>données d'exemple</strong> insérées dans chaque table.",
      "Une requête « <strong>livres actuellement disponibles</strong> ».",
      "Une requête « <strong>emprunts en retard</strong> » (date de retour dépassée).",
      "Un <strong>classement</strong> : les auteurs ou les livres les plus empruntés.",
    ],
    criteres: [
      "Chaque table a une <code>PRIMARY KEY</code> ; les emprunts ont des <code>FOREIGN KEY</code>.",
      "Des lignes sont insérées avec <code>INSERT INTO</code>.",
      "Au moins une requête filtre avec <code>WHERE</code>.",
      "Au moins une requête utilise une <code>JOIN</code> entre deux tables.",
      "Au moins une requête agrège avec <code>GROUP BY</code> (par ex. <code>COUNT</code>).",
      "Un <code>ORDER BY</code> trie un résultat (par ex. le classement).",
    ],
    pistes:
      "<p>Mobilise les leçons sur la <strong>création de tables</strong>, les <strong>clés</strong>, " +
      "<code>SELECT</code>/<code>WHERE</code>, les <strong>jointures</strong> et les <strong>agrégats</strong>.</p>" +
      "<p>Commence par modéliser : <code>emprunts</code> fait le lien entre <code>membres</code> et <code>livres</code> " +
      "(une ligne = un membre emprunte un livre, avec une date de prêt et une date de retour). " +
      "Teste tes requêtes une à une dans la console SQL du site.</p>",
  },

  {
    id: "algo-classement",
    course: "algo",
    courseTitle: "Algorithmes",
    dir: "algo",
    accent: "algo",
    type: "Programme algorithmique",
    niveau: "Intermédiaire",
    titre: "Un classement de joueurs (tri & recherche)",
    contexte:
      "<p>Un petit jeu en ligne veut afficher le <strong>classement</strong> de ses joueurs et retrouver rapidement le rang " +
      "de l'un d'eux. L'occasion d'écrire toi-même un <strong>tri</strong> et une <strong>recherche</strong>, sans te reposer sur les fonctions toutes faites.</p>",
    objectif:
      "<p>Implémenter à la main les algorithmes classiques du cours (tri, recherche) sur un jeu de données, et savoir " +
      "<strong>raisonner sur leur complexité</strong>.</p>",
    livrable: "Un programme qui trie, recherche et analyse une liste de joueurs (langage au choix, JS conseillé).",
    fonctionnalites: [
      "Une structure de données pour les joueurs (nom + score).",
      "Un <strong>tri</strong> des joueurs par score, <strong>écrit par toi</strong> (pas la fonction native).",
      "Une <strong>recherche binaire</strong> d'un joueur dans la liste triée.",
      "Le calcul du <strong>rang</strong> d'un joueur donné.",
      "Une note sur la <strong>complexité</strong> de ton tri et de ta recherche.",
    ],
    criteres: [
      "Le tri est <strong>implémenté à la main</strong> (tri à bulles, par insertion, fusion…).",
      "La <strong>recherche binaire</strong> fonctionne sur des données triées.",
      "Une <strong>fonction récursive</strong> apparaît quelque part (tri fusion, ou la recherche).",
      "La <strong>complexité</strong> (O(n²), O(n log n), O(log n)…) est annoncée et justifiée.",
      "Les <strong>cas limites</strong> sont gérés : liste vide, joueur absent.",
      "Le résultat du tri et des recherches est <strong>correct</strong>.",
    ],
    pistes:
      "<p>Mobilise les leçons sur les <strong>tris</strong>, la <strong>recherche dichotomique</strong>, la " +
      "<strong>récursivité</strong> et la <strong>complexité</strong>.</p>" +
      "<p>Étapes : commence par un tri simple (à bulles) pour avoir un classement, puis remplace-le par un tri " +
      "plus efficace (fusion) ; la recherche binaire suppose une liste <em>déjà triée</em> ; le rang, c'est la position " +
      "dans la liste triée par score décroissant.</p>",
  },

  {
    id: "typescript-contacts",
    course: "typescript",
    courseTitle: "TypeScript",
    dir: "typescript",
    accent: "typescript",
    type: "Application typée",
    niveau: "Intermédiaire",
    titre: "Un carnet de contacts typé",
    contexte:
      "<p>Tu reprends un carnet de contacts en JavaScript truffé de bugs « <em>undefined is not a function</em> ». " +
      "On te demande de le <strong>réécrire en TypeScript</strong> pour que le compilateur attrape les erreurs avant l'exécution.</p>",
    objectif:
      "<p>Construire une petite <strong>application typée</strong> qui exploite interfaces, types union, génériques et " +
      "le contrôle de <code>null</code>/<code>undefined</code>.</p>",
    livrable: "Une application TypeScript qui compile sans erreur (sortie .js exécutable).",
    fonctionnalites: [
      "Une <strong>interface</strong> (ou <code>type</code>) <code>Contact</code> : nom, e-mail, catégorie.",
      "Une <strong>union de littéraux</strong> pour la catégorie (ex. <code>\"famille\" | \"travail\" | \"ami\"</code>).",
      "Des fonctions <strong>typées</strong> : ajouter, rechercher, filtrer par catégorie.",
      "Un <strong>type générique</strong> pour un petit utilitaire réutilisable.",
      "La gestion des cas « <strong>contact introuvable</strong> » sans planter.",
    ],
    criteres: [
      "Les <strong>types et interfaces</strong> sont définis explicitement.",
      "Aucun <code>any</code> implicite (le code compile en mode strict).",
      "Une <strong>union de types littéraux</strong> est utilisée.",
      "Au moins une fonction ou structure <strong>générique</strong> est présente.",
      "Le <strong>rétrécissement de type</strong> (narrowing) gère <code>undefined</code>.",
      "Le projet <strong>compile sans erreur</strong> (<code>tsc</code>).",
    ],
    pistes:
      "<p>Mobilise les leçons sur les <strong>types de base</strong>, les <strong>interfaces</strong>, les " +
      "<strong>unions</strong>, les <strong>génériques</strong> et le <strong>narrowing</strong>.</p>" +
      "<p>Commence par typer la donnée (<code>interface Contact</code>), puis les fonctions qui la manipulent ; " +
      "laisse le compilateur te guider : chaque erreur rouge est un bug évité.</p>",
  },

  {
    id: "react-films",
    course: "react",
    courseTitle: "React",
    dir: "react",
    accent: "react",
    type: "Application web (React)",
    niveau: "Intermédiaire",
    titre: "Un explorateur de films",
    contexte:
      "<p>Un cinéphile veut une petite appli pour <strong>parcourir et filtrer</strong> sa collection de films, et marquer " +
      "ses favoris. Tout doit être <strong>réactif</strong> : on tape, on filtre, l'affichage se met à jour tout seul.</p>",
    objectif:
      "<p>Construire une <strong>application React</strong> découpée en composants, avec de l'état, des props, des listes " +
      "et la gestion d'événements.</p>",
    livrable: "Une application React (composants) fonctionnelle.",
    fonctionnalites: [
      "Une liste de films affichée par un composant <strong>Carte</strong> réutilisable.",
      "Une <strong>recherche</strong> par titre et un <strong>filtre</strong> par genre.",
      "Un bouton <strong>favori</strong> qui bascule (ajoute/retire) sur chaque film.",
      "Un <strong>compteur</strong> de favoris ou de résultats affichés.",
      "Un message quand <strong>aucun film</strong> ne correspond.",
    ],
    criteres: [
      "L'interface est <strong>découpée en composants</strong> avec des <strong>props</strong>.",
      "L'état est géré avec <code>useState</code>.",
      "Les listes utilisent <code>.map()</code> avec une <strong>clé</strong> (<code>key</code>) unique.",
      "Au moins un <strong>événement</strong> est géré (<code>onClick</code>, <code>onChange</code>).",
      "Un <strong>affichage conditionnel</strong> est présent (résultats vides, favori actif…).",
      "Aucune <strong>erreur ni avertissement</strong> de clé dans la console.",
    ],
    pistes:
      "<p>Mobilise les leçons sur les <strong>composants</strong>, les <strong>props</strong>, <code>useState</code>, " +
      "le <strong>rendu de listes</strong> et les <strong>événements</strong>.</p>" +
      "<p>Garde les films dans un état au niveau du parent ; passe à chaque <code>Carte</code> les données et une fonction " +
      "« basculer favori » en prop. Le filtrage se fait avant le <code>.map()</code> d'affichage.</p>",
  },

  {
    id: "nodejs-api-notes",
    course: "nodejs",
    courseTitle: "Node.js",
    dir: "nodejs",
    accent: "nodejs",
    type: "API / serveur",
    niveau: "Intermédiaire → avancé",
    titre: "Une API REST de notes",
    contexte:
      "<p>Une application de prise de notes a besoin d'un <strong>back-end</strong>. Construis l'<strong>API REST</strong> qui " +
      "permet de créer, lire, modifier et supprimer des notes, avec les bons verbes et les bons codes de statut.</p>",
    objectif:
      "<p>Écrire un <strong>serveur Node.js</strong> (Express ou module <code>http</code>) exposant une API REST propre, " +
      "avec stockage, validation et gestion des erreurs.</p>",
    livrable: "Un serveur Node.js qui démarre, écoute un port et répond aux requêtes REST.",
    fonctionnalites: [
      "Les routes REST : <code>GET</code>, <code>POST</code>, <code>PUT</code>, <code>DELETE</code> sur <code>/notes</code>.",
      "Un <strong>stockage</strong> des notes (en mémoire ou dans un fichier JSON).",
      "Des <strong>codes de statut</strong> corrects (200, 201, 204, 404).",
      "La <strong>lecture du corps JSON</strong> des requêtes et la validation des champs.",
      "La gestion des erreurs (note inexistante, données manquantes).",
    ],
    criteres: [
      "Le serveur <strong>démarre et écoute</strong> un port.",
      "Les <strong>quatre verbes</strong> (GET/POST/PUT/DELETE) sont implémentés.",
      "Les <strong>statuts</strong> 201 (création), 204 (suppression), 404 (introuvable) sont renvoyés à bon escient.",
      "Le <strong>corps JSON</strong> est lu et utilisé (création/modification).",
      "Une <strong>entrée invalide</strong> renvoie une erreur claire (4xx), pas un crash.",
      "La <strong>logique</strong> est séparée du code des routes.",
    ],
    pistes:
      "<p>Mobilise les leçons sur le module <code>http</code> / <strong>Express</strong>, les <strong>routes</strong>, " +
      "<code>req</code>/<code>res</code>, le <strong>JSON</strong> et la <strong>gestion d'erreurs</strong>.</p>" +
      "<p>Avec Express : <code>express.json()</code> pour lire le corps, un tableau <code>notes</code> en mémoire pour commencer, " +
      "puis une route par verbe ; teste avec l'outil de ton choix (navigateur pour GET, ou un client REST).</p>",
  },

  {
    id: "python-logs",
    course: "python",
    courseTitle: "Python",
    dir: "python",
    accent: "python",
    type: "Outil Python avancé",
    niveau: "Avancé",
    titre: "Un analyseur de logs concurrent et typé",
    contexte:
      "<p>Une équipe doit analyser des <strong>dizaines de fichiers de logs</strong> chaque jour. Construis un outil " +
      "Python <strong>robuste, typé et testé</strong> qui les parcourt, en extrait des statistiques et traite plusieurs " +
      "fichiers <strong>en parallèle</strong>.</p>",
    objectif:
      "<p>Écrire une application Python <strong>avancée</strong> mobilisant les annotations de type, la concurrence " +
      "(async ou threads), un décorateur, un gestionnaire de contexte et des tests.</p>",
    livrable: "Un petit paquet Python (plusieurs modules .py) typé, avec des tests.",
    fonctionnalites: [
      "La lecture des fichiers ligne à ligne via un <strong>générateur</strong> (mémoire maîtrisée).",
      "Des fonctions <strong>annotées</strong> (types, <code>Optional</code>, <code>Protocol</code>/<code>TypeVar</code> si utile).",
      "Le traitement <strong>en parallèle</strong> des fichiers (<code>asyncio</code> ou <code>ThreadPoolExecutor</code>).",
      "Un <strong>décorateur</strong> maison (chronométrage ou mise en cache).",
      "Un <strong>gestionnaire de contexte</strong> (<code>@contextmanager</code>) pour ouvrir/fermer une ressource.",
      "Des <strong>tests</strong> (pytest) sur les fonctions d'analyse.",
    ],
    criteres: [
      "Les fonctions publiques sont <strong>annotées</strong> et passent un vérificateur de types sans erreur.",
      "Un <strong>décorateur</strong> est écrit à la main (avec <code>functools.wraps</code>).",
      "Un <strong>générateur</strong> (<code>yield</code>) parcourt les données.",
      "La concurrence passe par <code>asyncio.gather</code> <strong>ou</strong> un pool de threads/processus.",
      "Un <code>with</code> <strong>personnalisé</strong> est utilisé (<code>@contextmanager</code> ou <code>__enter__/__exit__</code>).",
      "Au moins <strong>trois tests</strong> pytest passent.",
    ],
    pistes:
      "<p>Mobilise les leçons sur le <strong>typing</strong>, les <strong>décorateurs</strong>, les <strong>générateurs</strong>, " +
      "l'<strong>asynchrone</strong>/la <strong>concurrence</strong>, les <strong>gestionnaires de contexte</strong> et les <strong>tests</strong>.</p>" +
      "<p>Commence par un module qui lit un fichier et compte (par ex.) les erreurs ; ajoute le typage ; parallélise " +
      "ensuite sur plusieurs fichiers ; termine par les tests sur de petits exemples connus.</p>",
  },

  {
    id: "html-composants",
    course: "html",
    courseTitle: "HTML",
    dir: "html",
    accent: "html",
    type: "Composants web accessibles",
    niveau: "Intermédiaire → avancé",
    titre: "Des composants interactifs accessibles",
    contexte:
      "<p>Une application a besoin de composants interactifs — une <strong>fenêtre modale</strong>, un <strong>menu</strong> " +
      "ou des <strong>onglets</strong> — qui fonctionnent au <strong>clavier</strong> et avec un <strong>lecteur d'écran</strong>, " +
      "pas seulement à la souris.</p>",
    objectif:
      "<p>Construire des composants web modernes et <strong>accessibles</strong> avec les API natives du navigateur " +
      "(<code>&lt;dialog&gt;</code>, ARIA, <code>template</code>/<code>slot</code> ou éléments personnalisés).</p>",
    livrable: "Une page HTML (avec un peu de JavaScript) exposant des composants accessibles.",
    fonctionnalites: [
      "Une <strong>fenêtre modale</strong> avec <code>&lt;dialog&gt;</code> / <code>showModal()</code> / <code>::backdrop</code>.",
      "Un <strong>menu</strong> ou des <strong>onglets</strong> pilotables au clavier (focus, flèches, Échap).",
      "Un <strong>composant réutilisable</strong> (<code>&lt;template&gt;</code>/<code>slot</code> ou élément personnalisé).",
      "Des attributs <strong>ARIA</strong> pertinents (<code>aria-expanded</code>, <code>aria-controls</code>…).",
      "La gestion du <strong>focus</strong> (piégé dans la modale, restitué à la fermeture).",
    ],
    criteres: [
      "La modale s'ouvre via <code>showModal()</code> et se ferme (bouton + touche Échap).",
      "Toute l'interaction est possible <strong>au clavier seul</strong> (Tab, Échap, flèches).",
      "Les attributs <strong>ARIA</strong> reflètent l'état (par ex. <code>aria-expanded</code>).",
      "Le <strong>focus</strong> est géré correctement à l'ouverture et à la fermeture.",
      "Au moins un <strong>composant réutilisable</strong> (template/slot ou custom element) est présent.",
      "Validé en n'utilisant <strong>que le clavier</strong>.",
    ],
    pistes:
      "<p>Mobilise les leçons sur <code>&lt;dialog&gt;</code>, les <strong>attributs ARIA</strong>, " +
      "<code>&lt;template&gt;</code>/<code>slot</code>, les <strong>éléments personnalisés</strong> et la <strong>gestion du focus</strong>.</p>" +
      "<p>Commence par la modale (la plus simple avec <code>&lt;dialog&gt;</code>), puis le menu/onglets, et soigne " +
      "le parcours clavier en dernier : c'est lui qui fait l'accessibilité.</p>",
  },

  {
    id: "css-carte",
    course: "css",
    courseTitle: "CSS",
    dir: "css",
    accent: "css",
    type: "Interface stylée avancée",
    niveau: "Intermédiaire → avancé",
    titre: "Une carte animée, fluide et thématisable",
    contexte:
      "<p>On te demande une <strong>carte produit</strong> qui s'<strong>anime</strong> à l'apparition et au survol, " +
      "s'<strong>adapte à la largeur de son conteneur</strong> (pas seulement de l'écran) et suit le <strong>thème clair/sombre</strong>.</p>",
    objectif:
      "<p>Construire un composant <strong>CSS avancé</strong> mobilisant animations, variables, <em>container queries</em> " +
      "et dimensionnement fluide.</p>",
    livrable: "Une page ou un composant mis en forme avec une feuille de style CSS.",
    fonctionnalites: [
      "Une <strong>animation</strong> <code>@keyframes</code> (apparition ou pulsation).",
      "Des <strong>transitions</strong> au survol avec <code>transform</code>.",
      "Des <strong>variables CSS</strong> pour les couleurs et les espacements.",
      "Une <strong>container query</strong> (<code>@container</code>) qui réagit à la largeur du conteneur.",
      "Un dimensionnement <strong>fluide</strong> avec <code>clamp()</code>.",
      "Un <strong>thème clair/sombre</strong>.",
    ],
    criteres: [
      "Au moins une <code>@keyframes</code> est définie et <strong>utilisée</strong>.",
      "Un <code>:hover</code> combine <code>transform</code> et <code>transition</code>.",
      "Des <strong>variables CSS</strong> centralisent les couleurs/espaces.",
      "Une <code>@container</code> modifie la mise en page selon le conteneur.",
      "<code>clamp()</code> (ou <code>min()</code>/<code>max()</code>) rend une taille fluide.",
      "Le rendu s'adapte au <strong>clair et au sombre</strong> (<code>prefers-color-scheme</code> ou <code>[data-theme]</code>).",
    ],
    pistes:
      "<p>Mobilise les leçons sur les <strong>animations</strong>, les <strong>variables</strong>, les " +
      "<strong>container queries</strong>, les <strong>fonctions de comparaison</strong> et les <strong>thèmes</strong>.</p>" +
      "<p>Construis d'abord la carte statique, ajoute les variables, puis les animations, et finis par la container " +
      "query (n'oublie pas <code>container-type: inline-size</code> sur le parent).</p>",
  },

  {
    id: "js-biblio",
    course: "javascript",
    courseTitle: "JavaScript",
    dir: "js",
    accent: "javascript",
    type: "Bibliothèque utilitaire (modules ES)",
    niveau: "Avancé",
    titre: "Ta mini-bibliothèque d'utilitaires",
    contexte:
      "<p>Plutôt que de copier les mêmes helpers de projet en projet, tu veux ta propre <strong>boîte à outils JavaScript</strong> " +
      "(façon mini-Lodash) : composition de fonctions, utilitaires de collections et quelques helpers asynchrones.</p>",
    objectif:
      "<p>Écrire une <strong>bibliothèque en modules ES</strong> exploitant la programmation fonctionnelle, " +
      "les générateurs/itérateurs et l'asynchrone.</p>",
    livrable: "Un ou plusieurs modules JavaScript (export/import) avec des utilitaires et des exemples.",
    fonctionnalites: [
      "Des fonctions d'<strong>ordre supérieur</strong> : <code>pipe</code>/<code>compose</code>, voire <code>map</code>/<code>filter</code> maison.",
      "Un <strong>générateur</strong> (par ex. <code>range</code> ou un parcours paresseux).",
      "Un <strong>utilitaire asynchrone</strong> (<code>debounce</code>, <code>retry</code> ou une pause <code>sleep</code>).",
      "Une organisation en <strong>modules ES</strong> (<code>export</code> / <code>import</code>).",
      "Des <strong>exemples</strong> d'utilisation qui s'exécutent.",
    ],
    criteres: [
      "Le code est découpé en <strong>modules ES</strong> (<code>export</code>/<code>import</code>).",
      "Au moins une fonction <strong>d'ordre supérieur</strong> (reçoit ou renvoie une fonction).",
      "Un <strong>générateur</strong> (<code>function*</code> / <code>yield</code>) est présent.",
      "Un <strong>utilitaire asynchrone</strong> correct (Promise / <code>async</code>).",
      "Les utilitaires sont des <strong>fonctions pures</strong> quand c'est possible (sans effet de bord).",
      "Au moins un <strong>exemple</strong> démontre la bibliothèque.",
    ],
    pistes:
      "<p>Mobilise les leçons sur le <strong>fonctionnel</strong> (<code>reduce</code>, composition), les " +
      "<strong>générateurs/itérateurs</strong>, l'<strong>asynchrone</strong> et les <strong>modules</strong>.</p>" +
      "<p><code>pipe</code> s'écrit avec <code>reduce</code> ; <code>compose</code> est <code>pipe</code> à l'envers ; " +
      "<code>debounce</code> repose sur <code>setTimeout</code> et une variable capturée par closure.</p>",
  },

  {
    id: "projets-js-memory",
    course: "projets-js",
    courseTitle: "Projets JavaScript",
    dir: "projets-js",
    accent: "projets-js",
    type: "Mini-jeu (JavaScript + DOM)",
    niveau: "Intermédiaire",
    titre: "Le jeu de memory",
    contexte:
      "<p>Un classique du navigateur : le <strong>jeu de memory</strong>. On retourne les cartes deux par deux, on retrouve " +
      "les paires, et on gagne en un minimum de coups. Tout se joue dans la page, sans rechargement.</p>",
    objectif:
      "<p>Construire un <strong>jeu interactif complet</strong> qui manipule le DOM, gère les événements, un état et un compteur.</p>",
    livrable: "Un jeu jouable dans le navigateur (HTML + CSS + JavaScript).",
    fonctionnalites: [
      "Une <strong>grille de cartes</strong> générée en JS à partir de paires <strong>mélangées</strong>.",
      "Le <strong>retournement</strong> d'une carte au clic.",
      "La <strong>détection des paires</strong> (et leur verrouillage une fois trouvées).",
      "Un <strong>compteur</strong> de coups et/ou un minuteur.",
      "Un <strong>message de victoire</strong> et un bouton « Rejouer ».",
    ],
    criteres: [
      "La grille est <strong>générée dynamiquement</strong> (<code>createElement</code>) depuis un tableau mélangé.",
      "Le clic <strong>retourne</strong> la carte (classe CSS + événement).",
      "La <strong>logique de paire</strong> est correcte (deux cartes comparées, puis verrouillage).",
      "Le <strong>compteur de coups</strong> ou le minuteur fonctionne.",
      "La <strong>victoire</strong> est détectée quand toutes les paires sont trouvées.",
      "« Rejouer » <strong>réinitialise</strong> la partie sans recharger la page.",
    ],
    pistes:
      "<p>Mobilise les leçons sur la <strong>création d'éléments</strong>, les <strong>événements</strong> et la gestion " +
      "d'un <strong>état</strong>.</p>" +
      "<p>Mélange le tableau des cartes (algorithme de Fisher-Yates) ; au 2<sup>e</sup> clic, compare les deux cartes : si " +
      "elles diffèrent, utilise <code>setTimeout</code> pour les retourner après un court instant.</p>",
  },

  {
    id: "git-workflow",
    course: "git",
    courseTitle: "Git",
    dir: "git",
    accent: "git",
    type: "Flux de travail Git",
    niveau: "Intermédiaire",
    titre: "Gérer un projet à plusieurs avec Git",
    contexte:
      "<p>Tu rejoins une petite équipe : il faut travailler sur des <strong>branches de fonctionnalités</strong>, " +
      "<strong>fusionner</strong> proprement, <strong>résoudre un conflit</strong> et garder un <strong>historique lisible</strong>.</p>",
    objectif:
      "<p>Mettre en pratique un véritable <strong>flux de travail Git</strong> sur un dépôt, des branches à la fusion " +
      "en passant par les conflits.</p>",
    livrable: "Un dépôt Git local (avec son historique) qui démontre le flux de travail.",
    fonctionnalites: [
      "Un dépôt initialisé avec des <strong>commits clairs</strong> et atomiques.",
      "Une <strong>branche de fonctionnalité</strong> par tâche.",
      "La <strong>fusion</strong> d'une branche dans la principale.",
      "Un <strong>conflit</strong> provoqué puis <strong>résolu</strong> volontairement.",
      "Un <strong>historique propre</strong> (messages soignés, éventuel <code>rebase</code>) et un <code>.gitignore</code>.",
    ],
    criteres: [
      "L'historique contient <strong>plusieurs commits</strong> aux messages clairs.",
      "Au moins <strong>deux branches</strong> de fonctionnalité créées puis fusionnées.",
      "Un <strong>conflit de fusion</strong> a été résolu (visible dans l'historique).",
      "Un <code>.gitignore</code> utile est présent (pas de fichiers indésirables versionnés).",
      "L'historique est <strong>lisible</strong> (<code>git log --oneline --graph</code> clair).",
      "Les commits sont <strong>atomiques</strong> (un changement cohérent par commit).",
    ],
    pistes:
      "<p>Mobilise les leçons sur les <strong>branches</strong> et la <strong>fusion</strong>, les <strong>conflits</strong>, " +
      "le <strong>rebase</strong>, le <strong>stash</strong> et <code>.gitignore</code>.</p>" +
      "<p>Crée un petit projet (même un simple fichier texte suffit), puis joue le scénario : deux branches modifient la " +
      "<strong>même ligne</strong> pour forcer un conflit, et résous-le à la main avant de fusionner.</p>",
  },

  {
    id: "bash-sauvegarde",
    course: "bash",
    courseTitle: "Bash",
    dir: "bash",
    accent: "bash",
    type: "Script d'automatisation (shell)",
    niveau: "Intermédiaire",
    titre: "Un script de sauvegarde automatisée",
    contexte:
      "<p>Tu veux automatiser la <strong>sauvegarde</strong> de ton dossier de travail : créer une archive datée, la ranger, " +
      "ne garder que les dernières et tout journaliser — sans le refaire à la main chaque jour.</p>",
    objectif:
      "<p>Écrire un <strong>script shell</strong> mobilisant variables, arguments, conditions, boucles, fonctions et redirections.</p>",
    livrable: "Un script shell exécutable (un fichier .sh).",
    fonctionnalites: [
      "Le script prend le <strong>dossier source</strong> en argument.",
      "Il crée une <strong>archive horodatée</strong> (par ex. <code>tar</code> + date).",
      "Il <strong>vérifie</strong> que le dossier existe avant d'agir.",
      "Il applique une <strong>rotation</strong> : ne garder que les N sauvegardes les plus récentes.",
      "Il <strong>journalise</strong> ses actions dans un fichier de log.",
    ],
    criteres: [
      "Le script lit des <strong>arguments</strong> (<code>$1</code>, <code>$@</code>) et utilise des <strong>variables</strong>.",
      "Une <strong>condition</strong> teste l'existence du dossier (<code>if</code> / <code>test</code>).",
      "Une <strong>boucle</strong> (<code>for</code>/<code>while</code>) parcourt des fichiers.",
      "Au moins une <strong>fonction</strong> est définie et appelée.",
      "Les actions sont <strong>redirigées</strong> vers un fichier log (<code>&gt;&gt;</code>).",
      "Le script renvoie un <strong>code de sortie</strong> cohérent (<code>exit 0</code> / <code>exit 1</code>).",
    ],
    pistes:
      "<p>Mobilise les leçons sur les <strong>variables et arguments</strong>, les <strong>conditions</strong>, les " +
      "<strong>boucles</strong>, les <strong>fonctions</strong> et les <strong>redirections</strong>.</p>" +
      "<p>Construis-le par paliers : d'abord l'archive, puis le contrôle d'erreurs, puis la rotation, puis le log. " +
      "À réaliser et exécuter dans un vrai terminal.</p>",
  },

  {
    id: "regex-validateur",
    course: "regex",
    courseTitle: "Regex",
    dir: "regex",
    accent: "regex",
    type: "Validateur / extracteur (regex)",
    niveau: "Intermédiaire",
    titre: "Un jeu de motifs pour valider et extraire",
    contexte:
      "<p>Un formulaire reçoit des données en vrac. Tu dois écrire les <strong>expressions régulières</strong> qui " +
      "<strong>valident</strong> chaque champ et qui <strong>extraient</strong> les informations utiles d'un texte libre.</p>",
    objectif:
      "<p>Concevoir et tester un ensemble d'<strong>expressions régulières</strong> (validation et extraction) couvrant " +
      "les notions du cours.</p>",
    livrable: "Un jeu de regex documentées + un petit script (langage au choix) qui les applique.",
    fonctionnalites: [
      "Valider un <strong>e-mail</strong>, un <strong>numéro de téléphone</strong> et une <strong>date</strong>.",
      "Extraire d'un texte tous les <strong>liens</strong> (ou montants, dates…).",
      "Utiliser au moins un <strong>groupe de capture</strong>.",
      "Utiliser des <strong>ancres</strong> (début / fin) pour la validation stricte.",
      "Tester chaque motif sur des cas <strong>valides ET invalides</strong>.",
    ],
    criteres: [
      "Les motifs utilisent des <strong>classes</strong> (<code>[...]</code>) et des <strong>quantificateurs</strong> (<code>+ * {n,m}</code>).",
      "Au moins une <strong>ancre</strong> (<code>^</code> ou <code>$</code>) borne une validation.",
      "Au moins un <strong>groupe de capture</strong> <code>( )</code> est présent.",
      "Une <strong>alternative</strong> (<code>|</code>) est utilisée quelque part.",
      "Chaque motif est <strong>testé</strong> sur des cas positifs et négatifs.",
      "Un motif d'<strong>extraction</strong> renvoie plusieurs résultats sur un texte.",
    ],
    pistes:
      "<p>Mobilise les leçons sur les <strong>classes de caractères</strong>, les <strong>quantificateurs</strong>, les " +
      "<strong>ancres</strong>, les <strong>groupes</strong> et les <strong>alternatives</strong>.</p>" +
      "<p>Teste tes motifs au fur et à mesure dans le testeur de regex du site (<code>pages/regex-test.html</code>) ; " +
      "attention à la casse et aux caractères à échapper.</p>",
  },

  {
    id: "docker-conteneur",
    course: "docker",
    courseTitle: "Docker",
    dir: "docker",
    accent: "docker",
    type: "Conteneurisation",
    niveau: "Intermédiaire",
    titre: "Conteneuriser une petite application web",
    contexte:
      "<p>Tu as une petite appli web (par ex. une API + une base de données) et tu veux qu'elle démarre <strong>partout</strong> " +
      "d'une <strong>seule commande</strong>, sans rien installer à la main.</p>",
    objectif:
      "<p>Écrire un <strong>Dockerfile</strong> et un fichier <strong>Compose</strong> pour conteneuriser une application " +
      "et ses dépendances.</p>",
    livrable: "Un Dockerfile + un docker-compose.yml (et l'application associée).",
    fonctionnalites: [
      "Un <strong>Dockerfile</strong> qui construit l'image de l'appli (<code>FROM</code>, <code>WORKDIR</code>, <code>COPY</code>, <code>RUN</code>, <code>CMD</code>).",
      "Un <strong>docker-compose</strong> avec au moins <strong>deux services</strong> (appli + base).",
      "Un <strong>volume</strong> pour persister les données de la base.",
      "Une liaison entre services (<code>depends_on</code> ou un <strong>réseau</strong>).",
      "Des <strong>variables d'environnement</strong> pour la configuration.",
    ],
    criteres: [
      "Le Dockerfile contient <code>FROM</code>, <code>WORKDIR</code>, <code>COPY</code> et une commande de démarrage (<code>CMD</code>/<code>ENTRYPOINT</code>).",
      "L'image se <strong>construit</strong> (<code>docker build</code>) et <strong>démarre</strong> (<code>docker run</code>).",
      "Le <code>docker-compose</code> définit au moins <strong>deux services</strong>.",
      "Un <strong>volume</strong> persiste les données de la base.",
      "Les services sont <strong>reliés</strong> (<code>depends_on</code> ou réseau).",
      "La configuration passe par des <strong>variables d'environnement</strong>.",
    ],
    pistes:
      "<p>Mobilise les leçons sur le <strong>Dockerfile</strong>, <strong>build/run</strong>, les <strong>volumes</strong>, " +
      "les <strong>réseaux</strong> et <strong>Compose</strong>.</p>" +
      "<p>Conteneurise d'abord l'appli seule (Dockerfile + run), puis ajoute la base et le volume dans le Compose. " +
      "À réaliser avec Docker installé localement.</p>",
  },

  {
    id: "api-blog",
    course: "api",
    courseTitle: "API REST",
    dir: "api",
    accent: "api",
    type: "Conception d'API REST",
    niveau: "Intermédiaire",
    titre: "Concevoir l'API REST d'un blog",
    contexte:
      "<p>Une équipe front a besoin de l'<strong>API d'un blog</strong>. À toi de la <strong>concevoir</strong> : quelles " +
      "ressources, quelles URL, quels verbes, quels codes de statut et quels corps de réponse.</p>",
    objectif:
      "<p>Concevoir une <strong>API REST cohérente</strong> (ressources, verbes, statuts) en appliquant les bonnes " +
      "pratiques du cours.</p>",
    livrable: "Une spécification d'API (la liste des endpoints) — et, en bonus, une implémentation minimale.",
    fonctionnalites: [
      "Identifier les <strong>ressources</strong> (articles, commentaires).",
      "Définir les <strong>endpoints</strong> REST (collections et éléments).",
      "Associer le <strong>bon verbe</strong> à chaque action (GET/POST/PUT/PATCH/DELETE).",
      "Choisir les <strong>codes de statut</strong> adaptés.",
      "Prévoir la <strong>pagination</strong> ou le <strong>filtrage</strong> d'une liste.",
      "Décrire un <strong>corps JSON</strong> d'exemple (requête et réponse).",
    ],
    criteres: [
      "Les URL nomment des <strong>ressources</strong> (noms au pluriel, pas de verbe dans l'URL).",
      "Chaque action utilise le <strong>verbe HTTP</strong> correct.",
      "Les <strong>statuts</strong> sont justes (201 création, 204 suppression, 404 absent, 400 invalide).",
      "Une <strong>création</strong> renvoie la ressource créée.",
      "Une <strong>liste</strong> prévoit pagination et/ou filtre.",
      "Les <strong>corps JSON</strong> d'exemple sont cohérents.",
    ],
    pistes:
      "<p>Mobilise les leçons sur les <strong>ressources/URL</strong>, les <strong>verbes</strong>, les <strong>statuts</strong>, " +
      "le <strong>versioning</strong> et la <strong>pagination</strong>.</p>" +
      "<p>Raisonne « <strong>ressources, pas actions</strong> » : <code>/articles</code>, <code>/articles/{id}/commentaires</code>. " +
      "Le verbe porte l'action, pas l'URL.</p>",
  },

  {
    id: "securite-durcissement",
    course: "securite",
    courseTitle: "Sécurité",
    dir: "securite",
    accent: "securite",
    type: "Audit & durcissement",
    niveau: "Avancé",
    titre: "Sécuriser une application vulnérable",
    contexte:
      "<p>On te confie une petite appli web truffée de <strong>failles</strong> (injection, XSS, mots de passe en clair…). " +
      "Mission : <strong>repérer</strong> les vulnérabilités et les <strong>corriger</strong>.</p>",
    objectif:
      "<p>Identifier et corriger les <strong>vulnérabilités classiques</strong> d'une application web, en appliquant la " +
      "<strong>défense en profondeur</strong>.</p>",
    livrable: "L'application corrigée + une courte note listant les failles trouvées et les corrections.",
    fonctionnalites: [
      "Corriger une <strong>injection SQL</strong> (requêtes préparées).",
      "Neutraliser une faille <strong>XSS</strong> (échappement / <code>textContent</code>).",
      "<strong>Hacher</strong> les mots de passe (<code>bcrypt</code>).",
      "<strong>Valider</strong> et filtrer les entrées (liste blanche).",
      "Empêcher un accès non autorisé à une ressource (<strong>IDOR</strong>).",
      "Sécuriser les <strong>cookies</strong> (<code>HttpOnly</code> / <code>Secure</code>).",
    ],
    criteres: [
      "Les requêtes SQL sont <strong>paramétrées</strong> (plus de concaténation).",
      "Les sorties utilisateur sont <strong>échappées</strong> (plus d'injection de HTML).",
      "Les mots de passe sont <strong>hachés</strong> (bcrypt/argon2), jamais en clair.",
      "Les entrées sont <strong>validées côté serveur</strong> (liste blanche).",
      "Un <strong>contrôle d'autorisation</strong> bloque l'IDOR.",
      "Les cookies sensibles sont <code>HttpOnly</code> (et <code>Secure</code>) ; chaque correction est justifiée.",
    ],
    pistes:
      "<p>Mobilise les leçons sur l'<strong>injection SQL</strong>, le <strong>XSS</strong>, l'<strong>authentification</strong> " +
      "(bcrypt), l'<strong>IDOR</strong>, la <strong>validation</strong> et les <strong>cookies</strong>.</p>" +
      "<p>Principe directeur : ne jamais faire confiance à l'entrée utilisateur, et empiler les protections " +
      "(<em>défense en profondeur</em>).</p>",
  },

  {
    id: "tests-suite",
    course: "tests",
    courseTitle: "Tests & qualité",
    dir: "tests",
    accent: "tests",
    type: "Suite de tests (TDD)",
    niveau: "Intermédiaire",
    titre: "Tester un module en TDD",
    contexte:
      "<p>Un module — par exemple un <strong>panier d'achat</strong> avec remises — doit être fiable. Tu vas le construire " +
      "(ou le sécuriser) en écrivant ses <strong>tests d'abord</strong>, façon TDD.</p>",
    objectif:
      "<p>Écrire une <strong>suite de tests structurée</strong> pour un module, en appliquant le TDD, le schéma AAA et " +
      "l'isolation des dépendances.</p>",
    livrable: "Un module + sa suite de tests (framework au choix : Jest, pytest…).",
    fonctionnalites: [
      "Une suite de tests <strong>organisée</strong> (<code>describe</code>/<code>it</code> ou équivalent).",
      "Des tests suivant le schéma <strong>Arrange-Act-Assert</strong>.",
      "Le cycle <strong>rouge-vert-refactor</strong> (une fonctionnalité écrite après son test).",
      "Des <strong>cas limites</strong> testés (vide, valeurs extrêmes, erreurs).",
      "Un test qui <strong>isole une dépendance</strong> (stub / mock).",
      "Une <strong>initialisation partagée</strong> (<code>beforeEach</code>).",
    ],
    criteres: [
      "Chaque test suit <strong>Arrange-Act-Assert</strong>.",
      "Au moins une fonctionnalité a été écrite <strong>en TDD</strong> (test d'abord, échec, puis code).",
      "Les <strong>cas limites</strong> sont couverts (entrée vide, erreurs).",
      "Une dépendance externe est remplacée par un <strong>stub/mock</strong>.",
      "Une <strong>initialisation commune</strong> évite la répétition (<code>beforeEach</code>).",
      "<strong>Tous les tests passent</strong> (vert).",
    ],
    pistes:
      "<p>Mobilise les leçons sur le schéma <strong>AAA</strong>, le <strong>TDD</strong> (rouge-vert-refactor), les " +
      "<strong>stubs/mocks</strong>, l'<strong>injection de dépendance</strong> et <code>beforeEach</code>.</p>" +
      "<p>Commence par le test le plus simple, fais-le passer avec le minimum de code, refactorise, puis recommence " +
      "avec le cas suivant.</p>",
  },

  {
    id: "patterns-refactor",
    course: "patterns",
    courseTitle: "Design patterns",
    dir: "patterns",
    accent: "patterns",
    type: "Refactorisation (design patterns)",
    niveau: "Avancé",
    titre: "Refactoriser un code spaghetti avec des patterns",
    contexte:
      "<p>Tu hérites d'un code « <strong>spaghetti</strong> » : un énorme objet qui fait tout, des <code>if/else</code> partout, " +
      "du copier-coller. À toi de le <strong>refactoriser</strong> proprement avec des design patterns.</p>",
    objectif:
      "<p>Appliquer plusieurs <strong>design patterns</strong> et les principes <strong>SOLID</strong> pour rendre un code " +
      "lisible, extensible et testable — sans changer son comportement.</p>",
    livrable: "Le code refactorisé + une note expliquant les patterns choisis et pourquoi.",
    fonctionnalites: [
      "Découper le « <strong>God Object</strong> » en responsabilités claires.",
      "Remplacer une cascade de <code>if/else</code> par une <strong>Strategy</strong> (ou du polymorphisme).",
      "Introduire une <strong>Factory</strong> pour la création d'objets.",
      "Notifier des changements via un <strong>Observer</strong>.",
      "Justifier chaque choix par un principe <strong>SOLID</strong>.",
    ],
    criteres: [
      "Au moins <strong>deux design patterns</strong> sont appliqués à bon escient (Strategy, Factory, Observer, Decorator…).",
      "La <strong>responsabilité unique</strong> est respectée (chaque classe a un rôle).",
      "Une <strong>extension</strong> nouvelle ne force pas à modifier l'existant (ouvert/fermé).",
      "Plus de grosse cascade de <code>if/else</code> pour choisir un comportement.",
      "Le <strong>comportement final est identique</strong> à l'original (pas de régression).",
      "Chaque pattern est <strong>justifié</strong> dans la note.",
    ],
    pistes:
      "<p>Mobilise les leçons sur <strong>Factory</strong>, <strong>Strategy</strong>, <strong>Observer</strong>, " +
      "<strong>Decorator</strong> et <strong>SOLID</strong>.</p>" +
      "<p>Ne « plaque » pas un pattern pour le plaisir : pars d'un <strong>problème concret</strong> (duplication, rigidité) " +
      "et choisis le pattern qui le résout.</p>",
  },

  {
    id: "formats-convertisseur",
    course: "formats",
    courseTitle: "Formats de données",
    dir: "formats",
    accent: "formats",
    type: "Convertisseur / validateur",
    niveau: "Intermédiaire",
    titre: "Un convertisseur JSON ⇄ CSV ⇄ YAML",
    contexte:
      "<p>Des données arrivent dans des formats variés (<strong>JSON</strong>, <strong>CSV</strong>, <strong>YAML</strong>) et " +
      "tu dois les <strong>convertir</strong> de l'un à l'autre, tout en <strong>vérifiant</strong> qu'elles sont valides.</p>",
    objectif:
      "<p>Construire un petit outil de <strong>conversion</strong> et de <strong>validation</strong> entre formats de données " +
      "structurées.</p>",
    livrable: "Un programme (langage au choix) qui convertit et valide des données.",
    fonctionnalites: [
      "Convertir du <strong>JSON</strong> en <strong>CSV</strong> et inversement.",
      "Convertir du <strong>YAML</strong> en JSON (ou l'inverse).",
      "<strong>Valider</strong> qu'une entrée est bien formée (signaler l'erreur sinon).",
      "Préserver l'<strong>UTF-8</strong> (les accents) à travers les conversions.",
      "Respecter les <strong>types</strong> (un nombre reste un nombre).",
    ],
    criteres: [
      "La conversion <strong>JSON↔CSV</strong> fonctionne sur un jeu de données simple.",
      "La conversion <strong>YAML→JSON</strong> (ou l'inverse) fonctionne.",
      "Une entrée <strong>mal formée</strong> est détectée et signalée (pas de plantage).",
      "Les caractères <strong>accentués</strong> sont préservés.",
      "Les <strong>types</strong> sont respectés (nombre, booléen, chaîne).",
      "Un <strong>cas limite</strong> est géré (champ vide, liste vide).",
    ],
    pistes:
      "<p>Mobilise les leçons sur le <strong>JSON</strong>, le <strong>CSV</strong>, le <strong>YAML</strong>, la " +
      "<strong>sérialisation</strong> et l'<strong>UTF-8</strong>.</p>" +
      "<p>Appuie-toi sur les bibliothèques standard de ton langage pour le <em>parsing</em> ; concentre ton effort sur la " +
      "logique de conversion et la validation.</p>",
  },

  {
    id: "cicd-pipeline",
    course: "cicd",
    courseTitle: "CI/CD",
    dir: "cicd",
    accent: "cicd",
    type: "Pipeline CI/CD",
    niveau: "Intermédiaire",
    titre: "Un pipeline d'intégration et de déploiement continus",
    contexte:
      "<p>Ton projet doit être <strong>testé et déployé automatiquement</strong> à chaque <em>push</em>. Tu vas écrire le " +
      "pipeline qui installe, vérifie, teste et déploie — sans intervention manuelle.</p>",
    objectif:
      "<p>Écrire un <strong>pipeline CI/CD</strong> (workflow) appliquant les bonnes pratiques du cours.</p>",
    livrable: "Un fichier de workflow (par ex. .github/workflows/ci.yml).",
    fonctionnalites: [
      "Le pipeline se déclenche à chaque <strong>push / pull request</strong>.",
      "Des étapes ordonnées : <strong>installer → linter → tester → construire</strong>.",
      "Un <strong>arrêt rapide</strong> (fail fast) en cas d'échec.",
      "Des <strong>jobs dépendants</strong> (<code>needs</code>) et/ou une <strong>matrice</strong> de versions.",
      "La production d'un <strong>artefact</strong> (le build).",
      "Un <strong>déploiement conditionnel</strong> (seulement sur la branche principale).",
    ],
    criteres: [
      "Le workflow se déclenche sur <strong>push</strong> et/ou <strong>pull request</strong>.",
      "Les étapes installer / linter / tester / construire sont présentes et <strong>ordonnées</strong>.",
      "Un échec d'étape <strong>arrête</strong> le pipeline (fail fast).",
      "Au moins un job <strong>dépend</strong> d'un autre (<code>needs</code>) ou une <strong>matrice</strong> teste plusieurs versions.",
      "Un <strong>artefact</strong> de build est produit/stocké.",
      "Le <strong>déploiement</strong> est conditionné à la branche (par ex. <code>main</code>).",
    ],
    pistes:
      "<p>Mobilise les leçons sur l'<strong>intégration continue</strong>, le <strong>fail fast</strong>, <code>needs</code>, " +
      "la <strong>matrice</strong>, les <strong>artefacts</strong> et le <strong>déploiement/rollback</strong>.</p>" +
      "<p>Commence par un workflow minimal (installer + tester) qui passe, puis ajoute le build, la matrice et le " +
      "déploiement. À pousser sur une vraie plateforme pour le voir tourner.</p>",
  },

  {
    id: "nosql-reseau",
    course: "nosql",
    courseTitle: "NoSQL",
    dir: "nosql",
    accent: "nosql",
    type: "Modélisation NoSQL",
    niveau: "Intermédiaire → avancé",
    titre: "Modéliser un réseau social en base documentaire",
    contexte:
      "<p>Une appli de réseau social (utilisateurs, posts, commentaires, <em>likes</em>) doit stocker beaucoup de données " +
      "<strong>très lues</strong>. Tu choisis une approche <strong>NoSQL</strong> et tu la modélises.</p>",
    objectif:
      "<p>Modéliser des données en base <strong>documentaire</strong> en appliquant la <strong>dénormalisation</strong>, " +
      "et écrire les requêtes principales.</p>",
    livrable: "Le schéma des documents + les requêtes principales (MongoDB ou équivalent).",
    fonctionnalites: [
      "Modéliser les <strong>collections</strong> (utilisateurs, posts…) en documents.",
      "Choisir entre <strong>imbrication</strong> et <strong>référence</strong> selon les accès.",
      "<strong>Dénormaliser</strong> ce qui est lu souvent ensemble.",
      "Écrire les <strong>requêtes clés</strong> (le fil d'un utilisateur, les posts populaires).",
      "Prévoir une <strong>mise à jour</strong> ciblée (un compteur de <em>likes</em>).",
    ],
    criteres: [
      "Les données sont modélisées en <strong>documents</strong> (pas un schéma relationnel déguisé).",
      "Le choix <strong>imbrication vs référence</strong> est justifié par les accès.",
      "Au moins un endroit est <strong>dénormalisé</strong> volontairement (avec sa raison).",
      "Les requêtes principales sont écrites (<strong>filtre, tri, limite</strong>).",
      "Une <strong>mise à jour ciblée</strong> est prévue (incrément d'un compteur).",
      "Les compromis <strong>cohérence / disponibilité</strong> (CAP) sont évoqués.",
    ],
    pistes:
      "<p>Mobilise les leçons sur <strong>ACID/CAP</strong>, les <strong>documents</strong> (MongoDB), la " +
      "<strong>dénormalisation</strong> et les autres familles (clé-valeur, graphe).</p>" +
      "<p>Règle d'or NoSQL : « <strong>modélise selon tes requêtes</strong> », pas selon une forme normale relationnelle.</p>",
  },

  {
    id: "markdown-doc",
    course: "markdown",
    courseTitle: "Markdown",
    dir: "markdown",
    accent: "markdown",
    type: "Documentation (Markdown)",
    niveau: "Débutant",
    titre: "La documentation complète d'un projet",
    contexte:
      "<p>Ton projet open source a besoin d'une vraie <strong>documentation</strong>. Tu vas rédiger un <strong>README</strong> " +
      "clair et complet, entièrement en <strong>Markdown</strong>.</p>",
    objectif:
      "<p>Produire une documentation <strong>structurée et lisible</strong> en mobilisant l'essentiel de la syntaxe Markdown.</p>",
    livrable: "Un fichier README.md (et éventuellement d'autres pages .md).",
    fonctionnalites: [
      "Une <strong>hiérarchie de titres</strong> et un sommaire avec liens internes.",
      "Des <strong>blocs de code</strong> avec le langage précisé.",
      "Un <strong>tableau</strong> (par ex. les options de configuration).",
      "Des <strong>listes</strong> à puces, numérotées et à cases à cocher (feuille de route).",
      "Des <strong>liens</strong> et au moins une <strong>image</strong> (badge ou capture).",
    ],
    criteres: [
      "Les titres sont <strong>hiérarchisés</strong> correctement (un seul <code>#</code> principal).",
      "Au moins un <strong>bloc de code</strong> délimité par ``` avec le langage indiqué.",
      "Un <strong>tableau</strong> Markdown bien formé (en-tête + ligne de séparation).",
      "Des listes <strong>à puces ET numérotées</strong>.",
      "Au moins un <strong>lien</strong> et une <strong>image</strong> (<code>![alt](url)</code>).",
      "Une <strong>liste de tâches</strong> avec cases à cocher (<code>[ ]</code> / <code>[x]</code>).",
    ],
    pistes:
      "<p>Mobilise les leçons sur les <strong>titres</strong>, l'<strong>emphase</strong>, les <strong>listes</strong>, les " +
      "<strong>liens/images</strong>, le <strong>code</strong> et les <strong>tableaux</strong>.</p>" +
      "<p>Prévisualise le rendu au fur et à mesure dans l'éditeur Markdown du site (<code>pages/markdown.html</code>).</p>",
  },

  {
    id: "vscode-environnement",
    course: "vscode",
    courseTitle: "VS Code",
    dir: "vscode",
    accent: "vscode",
    type: "Configuration d'environnement",
    niveau: "Débutant → intermédiaire",
    titre: "Configurer ton environnement de dev idéal",
    contexte:
      "<p>Tu veux un environnement de développement <strong>propre et partageable</strong> pour ton projet : mêmes réglages, " +
      "mêmes extensions, mêmes tâches pour toute l'équipe.</p>",
    objectif:
      "<p>Configurer un environnement de développement <strong>reproductible</strong> avec les fichiers de configuration de l'éditeur.</p>",
    livrable: "Un dossier .vscode (settings, tasks, extensions, launch) + quelques snippets.",
    fonctionnalites: [
      "Un <code>settings.json</code> de projet (format à la sauvegarde, indentation…).",
      "Une liste d'<strong>extensions recommandées</strong> (<code>extensions.json</code>).",
      "Une <strong>tâche</strong> automatisée (<code>tasks.json</code> : lancer les tests ou le build).",
      "Une configuration de <strong>débogage</strong> (<code>launch.json</code>).",
      "Au moins un <strong>snippet</strong> personnalisé.",
    ],
    criteres: [
      "Un <code>.vscode/settings.json</code> applique des réglages de projet (par ex. <em>Format On Save</em>).",
      "Un <code>.vscode/extensions.json</code> recommande des extensions.",
      "Une <strong>tâche</strong> (<code>tasks.json</code>) lance une commande du projet.",
      "Une configuration de <strong>débogage</strong> existe (<code>launch.json</code>).",
      "Au moins un <strong>snippet</strong> personnalisé est défini.",
      "La configuration est <strong>partageable</strong> (versionnée, sans chemin absolu personnel).",
    ],
    pistes:
      "<p>Mobilise les leçons sur <code>settings.json</code>, les <strong>tâches</strong>, le <strong>débogueur</strong>, " +
      "les <strong>snippets</strong> et les <strong>extensions</strong>.</p>" +
      "<p>Pense « <strong>reproductible</strong> » : tout ce qui est dans <code>.vscode</code> doit fonctionner pour un " +
      "nouveau venu, sans réglage manuel.</p>",
  },

  {
    id: "sass-design-system",
    course: "sass",
    courseTitle: "Sass",
    dir: "sass",
    accent: "sass",
    type: "Système de styles (Sass)",
    niveau: "Intermédiaire",
    titre: "Un petit système de styles réutilisable",
    contexte:
      "<p>Tu veux une base de styles <strong>cohérente et réutilisable</strong> pour tes projets — couleurs, espacements, " +
      "composants — sans répéter le même CSS partout. Sass est fait pour ça.</p>",
    objectif:
      "<p>Construire un petit <strong>système de styles en Sass</strong> mobilisant variables, partials, mixins, fonctions et boucles.</p>",
    livrable: "Un ensemble de fichiers Sass (.scss) compilés en CSS.",
    fonctionnalites: [
      "Des <strong>variables</strong> (<code>$</code>) pour les couleurs et les espacements.",
      "Une organisation en <strong>partials</strong> (<code>_base</code>, <code>_composants</code>…) reliés par <code>@use</code>/<code>@forward</code>.",
      "Un <strong>mixin</strong> réutilisable (par ex. un bouton ou un point de rupture responsive).",
      "Une <strong>fonction</strong> Sass maison (par ex. un calcul d'espacement).",
      "Une <strong>boucle</strong> (<code>@each</code> ou <code>@for</code>) qui génère des classes utilitaires.",
    ],
    criteres: [
      "Des <strong>variables Sass</strong> (<code>$</code>) centralisent les valeurs.",
      "Le code est découpé en <strong>partials</strong> importés via <code>@use</code>/<code>@forward</code>.",
      "Au moins un <code>@mixin</code> est défini et <code>@include</code>.",
      "Au moins une <code>@function</code> maison est utilisée.",
      "Une <strong>boucle</strong> (<code>@each</code>/<code>@for</code>) génère plusieurs règles.",
      "Le Sass <strong>compile sans erreur</strong> en CSS.",
    ],
    pistes:
      "<p>Mobilise les leçons sur les <strong>variables</strong>, les <strong>partials</strong>, les <strong>mixins</strong>, " +
      "les <strong>fonctions</strong>, les <strong>boucles</strong> et l'<strong>imbrication</strong>.</p>" +
      "<p>Structure : un fichier d'entrée qui <code>@use</code> les partials ; teste la compilation au fur et à mesure " +
      "(<code>sass</code>).</p>",
  },

  {
    id: "http-analyse",
    course: "http",
    courseTitle: "HTTP",
    dir: "http",
    accent: "http",
    type: "Analyse d'échanges HTTP",
    niveau: "Intermédiaire",
    titre: "Décortiquer des échanges HTTP réels",
    contexte:
      "<p>Pour comprendre vraiment le web, tu vas observer ce qui circule « sur le fil » : ouvrir les <strong>outils du " +
      "navigateur</strong>, décortiquer des <strong>requêtes</strong> et des <strong>réponses</strong> HTTP, et savoir les reconstituer.</p>",
    objectif:
      "<p>Analyser et documenter des <strong>échanges HTTP réels</strong> (méthodes, en-têtes, statuts, cookies) en " +
      "mobilisant les notions du cours.</p>",
    livrable: "Un document d'analyse (requêtes/réponses annotées) + une requête reconstruite à la main.",
    fonctionnalites: [
      "Capturer plusieurs échanges réels (onglet <strong>Réseau</strong> des outils de dev).",
      "Identifier pour chacun la <strong>méthode</strong>, l'<strong>URL</strong>, la <em>query string</em> et le <strong>code de statut</strong>.",
      "Repérer les <strong>en-têtes</strong> clés (<code>Content-Type</code>, <code>Set-Cookie</code>, <code>Cache-Control</code>).",
      "Distinguer un <strong>GET</strong> d'un <strong>POST</strong> (où vont les données).",
      "Suivre le cycle d'un <strong>cookie</strong> de session (<code>Set-Cookie</code> puis renvoi).",
      "Reconstruire une <strong>requête à la main</strong> (ligne de requête + en-têtes).",
    ],
    criteres: [
      "Au moins <strong>trois échanges réels</strong> sont décrits (méthode, URL, statut).",
      "La <em>query string</em> et le <strong>corps</strong> sont distingués (GET vs POST).",
      "<code>Content-Type</code> et au moins un en-tête de <strong>cookie</strong> sont identifiés.",
      "Le sens d'un <strong>code de statut</strong> (2xx/3xx/4xx/5xx) est expliqué pour chaque cas.",
      "Le cycle d'un <strong>cookie</strong> (<code>Set-Cookie</code> → renvoi) est tracé.",
      "Une <strong>requête</strong> est reconstituée correctement à la main.",
    ],
    pistes:
      "<p>Mobilise les leçons sur le <strong>client/serveur</strong>, les <strong>méthodes</strong>, les <strong>statuts</strong>, " +
      "les <strong>en-têtes</strong>, les <strong>cookies</strong> et <strong>CORS</strong>.</p>" +
      "<p>L'onglet « <strong>Réseau</strong> » des outils de développement de ton navigateur est ton laboratoire : recharge " +
      "une page et observe chaque ligne.</p>",
  },

  {
    id: "vue-panier",
    course: "vue",
    courseTitle: "Vue.js",
    dir: "vue",
    accent: "vue",
    type: "Application web (Vue)",
    niveau: "Intermédiaire",
    titre: "Un panier d'achat réactif",
    contexte:
      "<p>Une boutique veut un <strong>panier d'achat réactif</strong> : on ajoute des articles, on change les quantités, " +
      "et le total se <strong>recalcule instantanément</strong>.</p>",
    objectif:
      "<p>Construire une application <strong>Vue</strong> avec des composants, la réactivité, des propriétés calculées et la " +
      "liaison de données.</p>",
    livrable: "Une application Vue (composants).",
    fonctionnalites: [
      "Une liste d'articles affichée avec <code>v-for</code>.",
      "L'ajout / le retrait d'articles au panier (<code>v-on</code>/<code>@click</code>).",
      "La modification des <strong>quantités</strong> liée par <code>v-model</code>.",
      "Un <strong>total calculé</strong> automatiquement (<code>computed</code>).",
      "Un composant <strong>Article</strong> réutilisable recevant des <strong>props</strong>.",
      "Une <strong>remontée</strong> d'événement enfant → parent (<code>emit</code>).",
    ],
    criteres: [
      "L'affichage des listes utilise <code>v-for</code> avec une <strong>clé</strong>.",
      "Des <strong>événements</strong> sont gérés avec <code>v-on</code>/<code>@</code>.",
      "Une donnée est liée en <strong>deux sens</strong> avec <code>v-model</code> (quantité).",
      "Une <strong>propriété calculée</strong> (<code>computed</code>) produit le total.",
      "L'app est découpée en <strong>composants</strong> avec <code>props</code>.",
      "Un événement enfant remonte au parent via <code>emit</code>.",
    ],
    pistes:
      "<p>Mobilise les leçons sur les <strong>directives</strong> (<code>v-for</code>/<code>v-model</code>/<code>v-on</code>), " +
      "les <strong>computed</strong>, les <strong>composants/props</strong> et <code>emit</code>.</p>" +
      "<p>Garde l'état du panier dans le parent, passe chaque article en <code>prop</code>, et fais remonter les actions " +
      "(ajouter, changer la quantité) par <code>emit</code>.</p>",
  },

  {
    id: "java-inventaire",
    course: "java",
    courseTitle: "Java",
    dir: "java",
    accent: "java",
    type: "Logiciel (POO)",
    niveau: "Intermédiaire",
    titre: "Un logiciel de gestion d'inventaire",
    contexte:
      "<p>Un magasin veut un logiciel simple pour gérer son <strong>inventaire</strong> : ajouter des produits, suivre les " +
      "stocks, alerter quand c'est bas. L'occasion d'appliquer la <strong>POO</strong> pour de vrai.</p>",
    objectif:
      "<p>Construire une application <strong>Java orientée objet</strong> mobilisant classes, encapsulation, collections, " +
      "exceptions et polymorphisme.</p>",
    livrable: "Une application Java en console (plusieurs classes).",
    fonctionnalites: [
      "Une classe <strong>Produit</strong> (nom, prix, quantité) encapsulée.",
      "Un <strong>inventaire</strong> qui stocke les produits dans une collection (<code>List</code>/<code>Map</code>).",
      "L'ajout, la recherche et la mise à jour du <strong>stock</strong>.",
      "Une <strong>alerte</strong> quand un stock passe sous un seuil.",
      "La gestion des erreurs par <strong>exceptions</strong> (produit introuvable, quantité négative).",
      "Un <strong>menu</strong> en console.",
    ],
    criteres: [
      "Les attributs sont <strong>privés</strong> avec des accesseurs (encapsulation).",
      "Les produits sont stockés dans une <strong>collection</strong> Java (<code>List</code>/<code>Map</code>).",
      "Au moins une <strong>exception</strong> est levée et capturée (<code>try/catch</code>).",
      "Le <strong>polymorphisme</strong> (interface/héritage) est utilisé (ex. catégories de produits).",
      "Le code est réparti en <strong>plusieurs classes</strong> cohérentes.",
      "Le programme <strong>compile et tourne</strong> sans planter sur une entrée invalide.",
    ],
    pistes:
      "<p>Mobilise les leçons sur les <strong>classes/encapsulation</strong>, les <strong>collections</strong>, les " +
      "<strong>exceptions</strong> et l'<strong>héritage/les interfaces</strong>.</p>" +
      "<p>Commence par la classe <code>Produit</code>, puis l'<code>Inventaire</code> qui la gère, puis le menu console " +
      "qui appelle l'inventaire.</p>",
  },

  {
    id: "c-carnet",
    course: "c",
    courseTitle: "C",
    dir: "c",
    accent: "c",
    type: "Programme système",
    niveau: "Intermédiaire → avancé",
    titre: "Un carnet d'adresses en C",
    contexte:
      "<p>Tu veux un <strong>carnet d'adresses</strong> en ligne de commande, écrit en C : ajouter des contacts, les " +
      "sauvegarder dans un fichier, les recharger — en <strong>gérant toi-même la mémoire</strong>.</p>",
    objectif:
      "<p>Écrire un programme <strong>C</strong> mobilisant structures, pointeurs, allocation dynamique, chaînes et fichiers.</p>",
    livrable: "Un programme C compilé (un exécutable).",
    fonctionnalites: [
      "Une structure <strong>Contact</strong> (nom, téléphone, e-mail).",
      "Un <strong>tableau dynamique</strong> de contacts (<code>malloc</code>/<code>realloc</code>).",
      "L'ajout, l'affichage et la <strong>recherche</strong> d'un contact.",
      "La <strong>sauvegarde</strong> dans un fichier et le rechargement.",
      "La <strong>libération</strong> propre de la mémoire (<code>free</code>).",
      "Un <strong>menu</strong> en boucle.",
    ],
    criteres: [
      "Une <code>struct</code> modélise un contact.",
      "La mémoire est <strong>allouée dynamiquement</strong> (<code>malloc</code>/<code>realloc</code>) et <strong>libérée</strong> (<code>free</code>).",
      "Les <strong>pointeurs</strong> sont manipulés correctement (pas d'accès hors limites).",
      "Les <strong>chaînes</strong> sont gérées proprement (taille, terminaison <code>\\0</code>).",
      "Les contacts sont <strong>écrits puis relus</strong> depuis un fichier.",
      "Le programme <strong>compile sans avertissement</strong> (<code>-Wall</code>) et ne plante pas.",
    ],
    pistes:
      "<p>Mobilise les leçons sur les <strong>structures</strong>, les <strong>pointeurs</strong>, l'<strong>allocation " +
      "mémoire</strong>, les <strong>chaînes</strong> et les <strong>fichiers</strong>.</p>" +
      "<p>Attention à la taille des allocations et à toujours <code>free</code> ce que tu <code>malloc</code> ; compile " +
      "avec <code>-Wall</code> pour voir tous les avertissements.</p>",
  },

  {
    id: "cpp-bibliotheque",
    course: "cpp",
    courseTitle: "C++",
    dir: "cpp",
    accent: "cpp",
    type: "Application C++",
    niveau: "Avancé",
    titre: "Un gestionnaire de bibliothèque en C++ moderne",
    contexte:
      "<p>Tu reprends l'idée d'un inventaire, mais cette fois en <strong>C++ moderne</strong> : tu t'appuies sur la " +
      "bibliothèque standard (<strong>STL</strong>) plutôt que de tout gérer à la main.</p>",
    objectif:
      "<p>Construire une application <strong>C++</strong> mobilisant les classes, la <strong>STL</strong> (conteneurs et " +
      "algorithmes), les références et la gestion automatique des ressources (<strong>RAII</strong>).</p>",
    livrable: "Une application C++ compilée (un exécutable).",
    fonctionnalites: [
      "Des <strong>classes</strong> modélisant le domaine (ex. <code>Livre</code>, <code>Bibliotheque</code>).",
      "Des <strong>conteneurs STL</strong> (<code>std::vector</code>, <code>std::map</code>) pour stocker les données.",
      "Au moins un <strong>algorithme standard</strong> (<code>std::sort</code>, <code>std::find_if</code>).",
      "Le passage par <strong>référence</strong> pour éviter les copies.",
      "La gestion <strong>automatique</strong> des ressources (conteneurs / smart pointers).",
      "Un <strong>menu</strong> en console.",
    ],
    criteres: [
      "Au moins une <strong>classe</strong> avec encapsulation est définie.",
      "Un <strong>conteneur STL</strong> (<code>vector</code>/<code>map</code>) stocke les données.",
      "Au moins un <strong>algorithme</strong> de la STL est utilisé (<code>sort</code>, <code>find_if</code>…).",
      "Le passage par <strong>référence</strong> (<code>const&amp;</code>) évite des copies inutiles.",
      "Aucune gestion mémoire <strong>manuelle risquée</strong> (pas de <code>new</code>/<code>delete</code> crus ; RAII).",
      "Le programme <strong>compile</strong> (<code>-std=c++17</code>) et tourne correctement.",
    ],
    pistes:
      "<p>Mobilise les leçons sur les <strong>classes</strong>, la <strong>STL</strong> (conteneurs), les <strong>templates</strong>, " +
      "les <strong>références</strong> et le <strong>RAII</strong>/smart pointers.</p>" +
      "<p>Préfère <code>std::vector</code> à un tableau brut, et les algorithmes de <code>&lt;algorithm&gt;</code> aux " +
      "boucles écrites à la main.</p>",
  },

  {
    id: "csharp-mediatheque",
    course: "csharp",
    courseTitle: "C#",
    dir: "csharp",
    accent: "csharp",
    type: "Application .NET",
    niveau: "Intermédiaire",
    titre: "Une médiathèque en C#",
    contexte:
      "<p>Une <strong>médiathèque</strong> veut un logiciel pour gérer ses emprunts. Tu vas l'écrire en <strong>C#</strong>, " +
      "en profitant des propriétés, des collections et de <strong>LINQ</strong>.</p>",
    objectif:
      "<p>Construire une application <strong>C# orientée objet</strong> exploitant propriétés, collections génériques, " +
      "LINQ et exceptions.</p>",
    livrable: "Une application C# en console.",
    fonctionnalites: [
      "Des classes avec <strong>propriétés</strong> (<code>Livre</code>, <code>Membre</code>, <code>Emprunt</code>).",
      "Des <strong>collections génériques</strong> (<code>List&lt;T&gt;</code>, <code>Dictionary</code>).",
      "Des requêtes <strong>LINQ</strong> (livres disponibles, emprunts d'un membre).",
      "La gestion d'erreurs par <strong>exceptions</strong>.",
      "Un <strong>menu</strong> en console.",
    ],
    criteres: [
      "Les classes utilisent des <strong>propriétés</strong> (<code>get</code>/<code>set</code>).",
      "Les données sont stockées dans des <strong>collections génériques</strong>.",
      "Au moins <strong>deux requêtes LINQ</strong> (<code>Where</code>/<code>Select</code>/<code>OrderBy</code>) sont utilisées.",
      "Une <strong>exception</strong> est levée et capturée (<code>try/catch</code>).",
      "Une <strong>interface</strong> ou de l'héritage structure le code.",
      "Le programme <strong>compile et tourne</strong> sans planter.",
    ],
    pistes:
      "<p>Mobilise les leçons sur les <strong>propriétés</strong>, les <strong>collections</strong>, <strong>LINQ</strong>, " +
      "les <strong>exceptions</strong> et les <strong>interfaces</strong>.</p>" +
      "<p>LINQ remplace avantageusement les boucles de filtrage/tri : <code>livres.Where(l =&gt; l.Disponible)</code>.</p>",
  },

  {
    id: "go-serveur",
    course: "go",
    courseTitle: "Go",
    dir: "go",
    accent: "go",
    type: "Service concurrent (Go)",
    niveau: "Intermédiaire → avancé",
    titre: "Un service web concurrent en Go",
    contexte:
      "<p>Tu veux un petit <strong>service web</strong> en Go qui gère plusieurs requêtes à la fois (ou un outil qui " +
      "interroge plusieurs entrées <strong>en parallèle</strong>) : la <strong>concurrence</strong> est la force de Go.</p>",
    objectif:
      "<p>Construire un programme <strong>Go</strong> exploitant les goroutines, les channels, les interfaces et la gestion " +
      "d'erreurs idiomatique.</p>",
    livrable: "Un programme Go compilé (serveur HTTP ou outil en ligne de commande).",
    fonctionnalites: [
      "Un serveur <code>net/http</code> avec quelques routes (ou un outil traitant plusieurs entrées).",
      "Du traitement <strong>concurrent</strong> via des <strong>goroutines</strong>.",
      "La communication / synchronisation par <strong>channels</strong> (ou <code>sync.WaitGroup</code>).",
      "La gestion <strong>idiomatique</strong> des erreurs (valeur <code>error</code> retournée et vérifiée).",
      "Une <strong>struct</strong> et une <strong>interface</strong> pour structurer le code.",
    ],
    criteres: [
      "Le programme lance <strong>plusieurs goroutines</strong>.",
      "La synchronisation passe par des <strong>channels</strong> (ou <code>WaitGroup</code>).",
      "Les erreurs sont <strong>retournées et vérifiées</strong> (<code>if err != nil</code>).",
      "Une <strong>struct</strong> et une <strong>interface</strong> sont définies et utilisées.",
      "Le programme <strong>compile</strong> (<code>go build</code>) et s'exécute correctement.",
      "L'accès concurrent aux données partagées est <strong>sûr</strong> (pas de <em>data race</em>).",
    ],
    pistes:
      "<p>Mobilise les leçons sur les <strong>goroutines</strong>, les <strong>channels</strong>, les <strong>interfaces</strong> " +
      "et la <strong>gestion d'erreurs</strong>.</p>" +
      "<p>Écris d'abord une version séquentielle, puis ajoute la concurrence ; teste avec <code>go run -race</code> pour " +
      "détecter les accès concurrents dangereux.</p>",
  },

  {
    id: "rust-cli",
    course: "rust",
    courseTitle: "Rust",
    dir: "rust",
    accent: "rust",
    type: "Outil en ligne de commande (Rust)",
    niveau: "Avancé",
    titre: "Un mini-grep en Rust",
    contexte:
      "<p>Tu veux un petit outil en ligne de commande — par exemple un <strong>mini-grep</strong> ou un compteur de mots — " +
      "écrit en <strong>Rust</strong> : rapide, <strong>sûr</strong>, sans plantage.</p>",
    objectif:
      "<p>Construire un <strong>outil CLI en Rust</strong> mobilisant possession/emprunts, <code>Result</code>/<code>Option</code>, " +
      "le <em>pattern matching</em> et les traits.</p>",
    livrable: "Un programme Rust compilé (un outil en ligne de commande).",
    fonctionnalites: [
      "Lire des <strong>arguments</strong> et/ou un <strong>fichier</strong>.",
      "Traiter le contenu (compter, filtrer, chercher un <strong>motif</strong>).",
      "Gérer les erreurs avec <code>Result</code> (et l'opérateur <code>?</code>).",
      "Utiliser <code>Option</code> pour l'absence de valeur.",
      "Un <strong>pattern matching</strong> (<code>match</code>) sur les cas.",
      "Structurer avec un <code>struct</code> et/ou un <strong>trait</strong>.",
    ],
    criteres: [
      "Les erreurs sont gérées avec <code>Result</code> (pas de <code>unwrap()</code> sauvage ; <code>?</code> ou <code>match</code>).",
      "<code>Option</code> modélise l'<strong>absence</strong> de valeur.",
      "Un <code>match</code> couvre les cas de façon <strong>exhaustive</strong>.",
      "L'<strong>emprunt</strong> (<code>&amp;</code>) évite des copies inutiles.",
      "Le programme <strong>compile</strong> (<code>cargo build</code>) et ne <em>panique</em> pas sur une entrée invalide.",
      "Un <code>struct</code> ou un <strong>trait</strong> structure le code.",
    ],
    pistes:
      "<p>Mobilise les leçons sur la <strong>possession/les emprunts</strong>, <code>Result</code>/<code>Option</code>, le " +
      "<strong>pattern matching</strong> et les <strong>traits</strong>.</p>" +
      "<p>Le compilateur est ton allié : suis ses messages. Préfère <code>?</code> et <code>match</code> à <code>unwrap()</code>.</p>",
  },

  {
    id: "php-livre-or",
    course: "php",
    courseTitle: "PHP",
    dir: "php",
    accent: "php",
    type: "Back-end PHP",
    niveau: "Intermédiaire",
    titre: "Un livre d'or en PHP",
    contexte:
      "<p>Un site veut un <strong>livre d'or</strong> : les visiteurs laissent un message, qui s'affiche ensuite sur la page. " +
      "À écrire en <strong>PHP</strong>, côté serveur.</p>",
    objectif:
      "<p>Construire un petit <strong>back-end PHP</strong> qui traite un formulaire, stocke des données et les réaffiche, " +
      "en gérant la <strong>sécurité de base</strong>.</p>",
    livrable: "Une petite application PHP (pages + traitement serveur).",
    fonctionnalites: [
      "Un <strong>formulaire</strong> (nom + message) envoyé en <code>POST</code>.",
      "La réception et la <strong>validation</strong> des données (<code>$_POST</code>).",
      "Le <strong>stockage</strong> des messages (fichier ou base via <code>PDO</code>).",
      "L'<strong>affichage</strong> de tous les messages.",
      "L'<strong>échappement</strong> des sorties (<code>htmlspecialchars</code>) contre le XSS.",
      "Un message de <strong>confirmation</strong> après envoi.",
    ],
    criteres: [
      "Le formulaire est traité <strong>côté serveur</strong> (<code>$_POST</code>).",
      "Les entrées sont <strong>validées</strong> (champ vide rejeté).",
      "Les messages sont <strong>persistés</strong> (fichier ou base de données).",
      "Les sorties sont <strong>échappées</strong> avec <code>htmlspecialchars</code> (anti-XSS).",
      "Si base de données : les requêtes sont <strong>préparées</strong> (PDO).",
      "La page <strong>réaffiche</strong> correctement les messages stockés.",
    ],
    pistes:
      "<p>Mobilise les leçons sur les <strong>formulaires</strong> (<code>$_POST</code>), la <strong>validation</strong>, les " +
      "<strong>fichiers/PDO</strong> et la <strong>sécurité</strong>.</p>" +
      "<p>N'affiche <strong>jamais</strong> une saisie utilisateur sans <code>htmlspecialchars</code>. Il te faut un serveur " +
      "PHP pour exécuter le projet.</p>",
  },

  {
    id: "ruby-rangement",
    course: "ruby",
    courseTitle: "Ruby",
    dir: "ruby",
    accent: "ruby",
    type: "Script / outil (Ruby)",
    niveau: "Intermédiaire",
    titre: "Un organiseur de fichiers en Ruby",
    contexte:
      "<p>Ton dossier de téléchargements est un fouillis. Tu veux un <strong>script Ruby</strong> qui range automatiquement " +
      "les fichiers dans des sous-dossiers <strong>par type</strong> (images, documents, archives…).</p>",
    objectif:
      "<p>Écrire un <strong>script Ruby idiomatique</strong> mobilisant les blocs/itérateurs, les classes, les hash et la " +
      "manipulation de fichiers.</p>",
    livrable: "Un script Ruby (.rb) exécutable.",
    fonctionnalites: [
      "Parcourir un dossier (<code>Dir</code>) et lister ses fichiers.",
      "Classer chaque fichier par <strong>catégorie</strong> selon son extension (un <strong>hash</strong> extension → catégorie).",
      "Créer les sous-dossiers et <strong>déplacer</strong> les fichiers.",
      "Utiliser des <strong>blocs/itérateurs</strong> (<code>each</code>, <code>map</code>, <code>group_by</code>).",
      "Organiser le code dans une <strong>classe</strong> ou un <strong>module</strong>.",
      "Un <strong>compte-rendu</strong> de ce qui a été rangé.",
    ],
    criteres: [
      "Le script parcourt un dossier et ses fichiers (<code>Dir</code>/<code>File</code>).",
      "Un <strong>hash</strong> associe extensions et catégories.",
      "Des <strong>blocs/itérateurs</strong> idiomatiques sont utilisés (<code>each</code>, <code>map</code>, <code>group_by</code>…).",
      "Les fichiers sont <strong>déplacés</strong> dans les bons sous-dossiers.",
      "Le code est organisé en <strong>classe ou module</strong>.",
      "Un <strong>cas limite</strong> est géré (dossier vide, extension inconnue).",
    ],
    pistes:
      "<p>Mobilise les leçons sur les <strong>blocs/itérateurs</strong>, les <strong>hash</strong>, les " +
      "<strong>classes/modules</strong> et les <strong>fichiers</strong>.</p>" +
      "<p><code>group_by</code> est idéal pour regrouper par catégorie. Teste d'abord en mode « simulation » (afficher au " +
      "lieu de déplacer) avant de bouger de vrais fichiers.</p>",
  },

  {
    id: "kotlin-habitudes",
    course: "kotlin",
    courseTitle: "Kotlin",
    dir: "kotlin",
    accent: "kotlin",
    type: "Application Kotlin",
    niveau: "Intermédiaire",
    titre: "Un suivi d'habitudes en Kotlin",
    contexte:
      "<p>Tu veux suivre tes <strong>habitudes</strong> quotidiennes (sport, lecture…) : les ajouter, cocher celles du jour, " +
      "voir ta régularité. À écrire en <strong>Kotlin</strong>, en profitant de sa sûreté et de sa concision.</p>",
    objectif:
      "<p>Construire une application <strong>Kotlin idiomatique</strong> exploitant data classes, null safety, " +
      "lambdas/collections et <code>when</code>.</p>",
    livrable: "Une application Kotlin en console.",
    fonctionnalites: [
      "Une <strong>data class</strong> <code>Habitude</code> (nom, jours réalisés).",
      "Une collection d'habitudes manipulée par des <strong>fonctions de haut niveau</strong> (<code>filter</code>/<code>map</code>/<code>count</code>).",
      "Le marquage d'une habitude comme <strong>faite aujourd'hui</strong>.",
      "Un calcul de <strong>statistiques</strong> (taux de réussite, plus longue série).",
      "La gestion <strong>sûre</strong> des valeurs nulles (<code>?.</code>, <code>?:</code>).",
      "Un <code>when</code> pour le menu ou les catégories.",
    ],
    criteres: [
      "Une <strong>data class</strong> est définie et utilisée.",
      "Les collections sont traitées avec des <strong>lambdas</strong> (<code>filter</code>/<code>map</code>/<code>count</code>…).",
      "La <strong>null safety</strong> est respectée (pas de <code>!!</code> ; usage de <code>?.</code>/<code>?:</code>).",
      "Un <code>when</code> structure une décision.",
      "Le code est <strong>concis et idiomatique</strong> (pas un style Java déguisé).",
      "Le programme <strong>compile et tourne</strong> correctement.",
    ],
    pistes:
      "<p>Mobilise les leçons sur les <strong>data classes</strong>, la <strong>null safety</strong>, les " +
      "<strong>lambdas/collections</strong> et <code>when</code>.</p>" +
      "<p>Les fonctions de collection (<code>filter</code>, <code>map</code>, <code>sumOf</code>) remplacent les boucles ; " +
      "évite <code>!!</code> au profit de <code>?.</code> et <code>?:</code>.</p>",
  },

  {
    id: "swift-courses",
    course: "swift",
    courseTitle: "Swift",
    dir: "swift",
    accent: "swift",
    type: "Application Swift",
    niveau: "Intermédiaire",
    titre: "Une liste de courses en Swift",
    contexte:
      "<p>Tu veux une appli de <strong>liste de courses</strong> : ajouter des articles avec une quantité et un rayon, " +
      "cocher ce qui est pris, et regrouper par rayon. À écrire en <strong>Swift</strong>.</p>",
    objectif:
      "<p>Construire une application <strong>Swift idiomatique</strong> mobilisant structures, optionnels, énumérations, " +
      "closures et collections.</p>",
    livrable: "Un programme Swift (console ou playground).",
    fonctionnalites: [
      "Une <code>struct</code> <strong>Article</strong> (nom, quantité, rayon).",
      "Un <code>enum</code> pour le <strong>rayon</strong> (Fruits, Frais, Épicerie…).",
      "L'ajout et le marquage « <strong>pris</strong> » d'un article.",
      "Le <strong>regroupement</strong> par rayon (<code>Dictionary</code> / closures).",
      "La gestion sûre de l'absence avec les <strong>optionnels</strong>.",
      "Un calcul (nombre d'articles <strong>restants</strong>).",
    ],
    criteres: [
      "Une <code>struct</code> et un <code>enum</code> sont définis et utilisés.",
      "Les <strong>optionnels</strong> sont gérés sûrement (<code>if let</code>/<code>guard let</code>, pas de <code>!</code> forcé).",
      "Des <strong>closures</strong>/fonctions de haut niveau traitent les collections (<code>map</code>/<code>filter</code>/<code>reduce</code>).",
      "Le <strong>regroupement</strong> par rayon fonctionne.",
      "Le code est <strong>idiomatique</strong> (Swift, pas du C déguisé).",
      "Le programme <strong>compile et tourne</strong>.",
    ],
    pistes:
      "<p>Mobilise les leçons sur les <strong>structures/énumérations</strong>, les <strong>optionnels</strong>, les " +
      "<strong>closures</strong> et les <strong>collections</strong>.</p>" +
      "<p><code>if let</code> et <code>guard let</code> évitent les plantages ; <code>Dictionary(grouping:by:)</code> " +
      "regroupe par rayon en une ligne.</p>",
  },

  {
    id: "r-analyse",
    course: "r",
    courseTitle: "R",
    dir: "r",
    accent: "r",
    type: "Analyse de données (R)",
    niveau: "Intermédiaire",
    titre: "Analyser un jeu de données en R",
    contexte:
      "<p>On te confie un petit <strong>jeu de données</strong> (par ex. des ventes ou des notes) et on te demande d'en " +
      "tirer des enseignements : moyennes, tendances, et un <strong>graphique parlant</strong>.</p>",
    objectif:
      "<p>Réaliser une <strong>analyse de données en R</strong> : import, manipulation de <em>data frame</em>, statistiques " +
      "et visualisation.</p>",
    livrable: "Un script R (.R) qui charge, analyse et visualise les données.",
    fonctionnalites: [
      "Charger les données dans un <strong>data frame</strong> (CSV ou jeu intégré).",
      "<strong>Nettoyer/filtrer</strong> (valeurs manquantes, colonnes utiles).",
      "Calculer des <strong>statistiques</strong> (moyenne, médiane, par groupe).",
      "<strong>Agréger</strong> par catégorie.",
      "Produire au moins un <strong>graphique</strong> (histogramme, barres, nuage).",
      "<strong>Commenter</strong> les résultats.",
    ],
    criteres: [
      "Les données sont dans un <strong>data frame</strong>.",
      "Un <strong>filtrage/nettoyage</strong> est appliqué (NA, sous-ensemble).",
      "Des <strong>statistiques descriptives</strong> sont calculées (<code>mean</code>/<code>median</code>/<code>summary</code>).",
      "Une <strong>agrégation par groupe</strong> est faite (<code>aggregate</code>/<code>tapply</code>/dplyr).",
      "Au moins un <strong>graphique</strong> est produit.",
      "Les <strong>conclusions</strong> sont commentées dans le script.",
    ],
    pistes:
      "<p>Mobilise les leçons sur les <strong>vecteurs/data frames</strong>, la <strong>manipulation</strong>, les " +
      "<strong>statistiques</strong> et les <strong>graphiques</strong>.</p>" +
      "<p>Un jeu intégré (<code>mtcars</code>, <code>iris</code>) évite d'avoir un CSV sous la main ; <code>summary()</code> " +
      "donne un aperçu rapide.</p>",
  },

  {
    id: "dart-quiz",
    course: "dart",
    courseTitle: "Dart",
    dir: "dart",
    accent: "dart",
    type: "Application Dart",
    niveau: "Intermédiaire",
    titre: "Un quiz en ligne de commande (Dart)",
    contexte:
      "<p>Tu veux un petit <strong>quiz</strong> en ligne de commande écrit en <strong>Dart</strong> : poser des questions, " +
      "lire les réponses, calculer le score — un bon terrain pour la sûreté de Dart.</p>",
    objectif:
      "<p>Construire une application <strong>Dart</strong> mobilisant classes, collections, <em>null safety</em> et " +
      "éventuellement l'asynchrone.</p>",
    livrable: "Un programme Dart (console).",
    fonctionnalites: [
      "Une classe <strong>Question</strong> (énoncé, options, bonne réponse).",
      "Une <strong>liste de questions</strong> parcourue une à une.",
      "La <strong>lecture</strong> des réponses de l'utilisateur.",
      "Le <strong>calcul et l'affichage</strong> du score.",
      "La gestion sûre des valeurs nulles (<strong>null safety</strong>).",
      "Un <strong>résumé</strong> final.",
    ],
    criteres: [
      "Une <strong>classe</strong> modélise une question.",
      "Les données sont dans des <strong>collections</strong> (<code>List</code>/<code>Map</code>).",
      "La <strong>null safety</strong> est respectée (types nullables explicites <code>?</code>, pas de plantage).",
      "Des fonctions de collection ou des boucles parcourent les questions.",
      "Le <strong>score</strong> est correct.",
      "Le programme <strong>compile</strong> (<code>dart</code>) et s'exécute.",
    ],
    pistes:
      "<p>Mobilise les leçons sur les <strong>classes</strong>, les <strong>collections</strong>, la <strong>null safety</strong> " +
      "et les <strong>fonctions</strong>.</p>" +
      "<p>Déclare <em>nullable</em> seulement quand c'est nécessaire (<code>String?</code> vs <code>String</code>) ; pour un " +
      "vrai Flutter, l'interface viendrait au-dessus de cette logique.</p>",
  },

  {
    id: "lua-dialogues",
    course: "lua",
    courseTitle: "Lua",
    dir: "lua",
    accent: "lua",
    type: "Script Lua (moteur de jeu)",
    niveau: "Intermédiaire",
    titre: "Un moteur de dialogues piloté par des tables",
    contexte:
      "<p>Dans beaucoup de jeux, les <strong>dialogues</strong> et les réglages sont décrits en Lua. Tu vas construire un " +
      "petit <strong>moteur de dialogues à embranchements</strong>, piloté par des <strong>tables</strong> Lua.</p>",
    objectif:
      "<p>Écrire un programme <strong>Lua idiomatique</strong> mobilisant les tables, les fonctions, les closures et " +
      "éventuellement les métatables.</p>",
    livrable: "Un ou plusieurs scripts Lua (.lua).",
    fonctionnalites: [
      "Des <strong>dialogues</strong> décrits par des tables (texte + choix → suite).",
      "Un <strong>moteur</strong> qui parcourt l'arbre de dialogue selon les choix.",
      "Des <strong>fonctions</strong> associées à certains choix (closures/callbacks).",
      "Une table de <strong>configuration</strong> séparée (réglages).",
      "La gestion d'un <strong>état</strong> (variables du joueur).",
      "Un cas de <strong>fin</strong> de dialogue.",
    ],
    criteres: [
      "Les données (dialogues, config) sont structurées avec des <strong>tables Lua</strong>.",
      "Des <strong>fonctions</strong> parcourent et exécutent le dialogue.",
      "Des <strong>closures</strong> ou callbacks sont associés à des choix.",
      "L'<strong>état</strong> évolue selon les choix du joueur.",
      "Le code est organisé en <strong>fonctions réutilisables</strong>.",
      "Le script <strong>s'exécute</strong> correctement (<code>lua</code>).",
    ],
    pistes:
      "<p>Mobilise les leçons sur les <strong>tables</strong>, les <strong>fonctions</strong>, les <strong>closures</strong> " +
      "et les <strong>métatables</strong>.</p>" +
      "<p>En Lua, la <strong>table</strong> est LA structure de données : utilise-la pour tout (liste, dictionnaire, objet). " +
      "Une métatable peut fournir des valeurs par défaut.</p>",
  },

  {
    id: "asm-routines",
    course: "asm",
    courseTitle: "Assembleur",
    dir: "asm",
    accent: "asm",
    type: "Programme en assembleur",
    niveau: "Avancé",
    titre: "Des routines en assembleur x86-64",
    contexte:
      "<p>Pour comprendre ce que fait <strong>vraiment la machine</strong>, tu vas écrire quelques routines directement en " +
      "<strong>assembleur x86-64</strong> : calculs, boucles, et un appel depuis un programme C.</p>",
    objectif:
      "<p>Écrire et assembler des routines en <strong>assembleur x86-64</strong> mobilisant registres, instructions " +
      "arithmétiques, sauts et pile.</p>",
    livrable: "Un fichier assembleur (.asm/.s) assemblé et exécutable (éventuellement appelé depuis C).",
    fonctionnalites: [
      "Une <strong>routine de calcul</strong> (somme d'un tableau, ou factorielle).",
      "L'usage des <strong>registres</strong> et d'instructions arithmétiques (<code>add</code>, <code>imul</code>…).",
      "Une <strong>boucle</strong> avec comparaison et saut conditionnel.",
      "Le respect de la <strong>convention d'appel</strong> (arguments, valeur de retour).",
      "L'utilisation de la <strong>pile</strong> (<code>push</code>/<code>pop</code>, cadre de pile).",
      "Un programme qui <strong>appelle</strong> la routine et affiche le résultat.",
    ],
    criteres: [
      "Au moins une <strong>routine</strong> effectue un calcul correct.",
      "Les <strong>registres</strong> sont utilisés conformément à la convention d'appel.",
      "Une <strong>boucle</strong> est implémentée avec comparaison + saut conditionnel (<code>cmp</code>/<code>jl</code>…).",
      "La <strong>pile</strong> est utilisée correctement (équilibre <code>push</code>/<code>pop</code>).",
      "La <strong>valeur de retour</strong> est placée dans le bon registre.",
      "Le programme <strong>s'assemble</strong> et donne le bon résultat.",
    ],
    pistes:
      "<p>Mobilise les leçons sur les <strong>registres</strong>, les <strong>instructions</strong>, les <strong>sauts</strong>, " +
      "la <strong>pile</strong> et la <strong>convention d'appel</strong>.</p>" +
      "<p>Commence par une routine sans boucle (additionner deux nombres), puis ajoute la boucle. Convention System V : " +
      "arguments dans <code>rdi</code>, <code>rsi</code>… ; retour dans <code>rax</code>.</p>",
  },

  {
    id: "haskell-eval",
    course: "haskell",
    courseTitle: "Haskell",
    dir: "haskell",
    accent: "haskell",
    type: "Programme fonctionnel pur",
    niveau: "Avancé",
    titre: "Un évaluateur d'expressions en Haskell",
    contexte:
      "<p>Tu veux un petit <strong>évaluateur d'expressions</strong> arithmétiques (par ex. <code>2 + 3 * 4</code>) écrit en " +
      "<strong>Haskell pur</strong>, en t'appuyant sur les types algébriques et la récursivité.</p>",
    objectif:
      "<p>Écrire un programme <strong>Haskell fonctionnel pur</strong> mobilisant types algébriques, <em>pattern matching</em>, " +
      "récursivité et gestion des erreurs (<code>Maybe</code>/<code>Either</code>).</p>",
    livrable: "Un programme Haskell (.hs).",
    fonctionnalites: [
      "Un <strong>type algébrique</strong> représentant une expression (nombre, addition, multiplication…).",
      "Une fonction d'<strong>évaluation récursive</strong> par <em>pattern matching</em>.",
      "La gestion des <strong>erreurs</strong> avec <code>Maybe</code> ou <code>Either</code> (division par zéro).",
      "Des fonctions <strong>pures</strong> (sans effet de bord).",
      "Quelques <strong>expressions de test</strong> et l'affichage des résultats.",
    ],
    criteres: [
      "Un <strong>type de données algébrique</strong> (<code>data</code>) modélise les expressions.",
      "L'évaluation se fait par <strong>pattern matching récursif</strong>.",
      "Les erreurs sont gérées avec <code>Maybe</code> ou <code>Either</code> (pas de crash).",
      "Les <strong>fonctions sont pures</strong> (les effets restent dans <code>main</code>).",
      "Les <strong>signatures de type</strong> sont déclarées.",
      "Le programme <strong>compile</strong> (<code>ghc</code>/<code>runghc</code>) et donne les bons résultats.",
    ],
    pistes:
      "<p>Mobilise les leçons sur les <strong>types algébriques</strong>, le <strong>pattern matching</strong>, la " +
      "<strong>récursivité</strong> et <code>Maybe</code>/<code>Either</code>.</p>" +
      "<p>Définis <code>data Expr = Num Double | Add Expr Expr | Mul Expr Expr</code> ; <code>eval</code> fait un cas par " +
      "constructeur.</p>",
  },

  {
    id: "elixir-compteur",
    course: "elixir",
    courseTitle: "Elixir",
    dir: "elixir",
    accent: "elixir",
    type: "Service concurrent (Elixir)",
    niveau: "Avancé",
    titre: "Un compteur d'événements concurrent",
    contexte:
      "<p>Tu veux un petit service en mémoire qui compte des événements (visites, votes) de façon <strong>concurrente</strong> " +
      "et tolérante aux pannes — le terrain de jeu naturel d'<strong>Elixir</strong>.</p>",
    objectif:
      "<p>Construire un programme <strong>Elixir</strong> mobilisant l'immuabilité, le <em>pattern matching</em>, le " +
      "<em>pipe</em> et les processus (<code>Agent</code>/<code>GenServer</code>).</p>",
    livrable: "Un module Elixir (.ex / .exs).",
    fonctionnalites: [
      "Un <strong>état</strong> conservé dans un processus (<code>Agent</code> ou <code>GenServer</code>).",
      "Des fonctions pour <strong>incrémenter</strong> et <strong>lire</strong> le compteur.",
      "Du <strong>pattern matching</strong> sur les arguments / messages.",
      "L'usage du <strong>pipe</strong> (<code>|&gt;</code>) pour enchaîner des transformations.",
      "Des <strong>fonctions pures</strong> pour la logique.",
      "Plusieurs <strong>processus</strong> qui modifient l'état en concurrence.",
    ],
    criteres: [
      "L'état est géré par un <strong>processus</strong> (<code>Agent</code> ou <code>GenServer</code>).",
      "Le <strong>pattern matching</strong> est utilisé (clauses multiples ou <code>case</code>).",
      "Au moins un <strong>pipeline</strong> <code>|&gt;</code> enchaîne des transformations.",
      "Les données sont <strong>immuables</strong> (on renvoie de nouvelles valeurs, pas de mutation).",
      "Plusieurs processus accèdent à l'état <strong>sans corruption</strong>.",
      "Le code <strong>s'exécute</strong> (<code>elixir</code> / <code>iex</code>).",
    ],
    pistes:
      "<p>Mobilise les leçons sur l'<strong>immuabilité</strong>, le <strong>pattern matching</strong>, le <strong>pipe</strong> " +
      "et les <strong>processus</strong> (<code>Agent</code>/<code>GenServer</code>).</p>" +
      "<p>Un <code>Agent</code> suffit pour un état simple ; rappelle-toi qu'en Elixir on ne <em>mute</em> pas, on transforme.</p>",
  },

  {
    id: "scala-texte",
    course: "scala",
    courseTitle: "Scala",
    dir: "scala",
    accent: "scala",
    type: "Application Scala",
    niveau: "Intermédiaire → avancé",
    titre: "Un analyseur de texte en Scala",
    contexte:
      "<p>Tu veux analyser un texte : compter les mots, trouver les plus fréquents, sortir des statistiques — en " +
      "<strong>Scala</strong>, dans un style <strong>fonctionnel et immuable</strong>.</p>",
    objectif:
      "<p>Construire une application <strong>Scala</strong> mobilisant les collections immuables, les fonctions de haut " +
      "niveau, les <em>case classes</em> et le <em>pattern matching</em>.</p>",
    livrable: "Un programme Scala (.scala).",
    fonctionnalites: [
      "Lire un texte et le <strong>découper en mots</strong>.",
      "Compter la <strong>fréquence</strong> de chaque mot (<code>groupBy</code>/<code>map</code>).",
      "Trouver les <strong>N mots les plus fréquents</strong> (<code>sortBy</code>/<code>take</code>).",
      "Des <strong>statistiques</strong> (nombre de mots, longueur moyenne).",
      "Une <strong>case class</strong> pour un résultat.",
      "Du <strong>pattern matching</strong> (<code>Option</code>/<code>match</code>).",
    ],
    criteres: [
      "Les collections sont <strong>immuables</strong> et traitées fonctionnellement (<code>map</code>/<code>filter</code>/<code>groupBy</code>/<code>fold</code>).",
      "Au moins une <strong>case class</strong> est définie.",
      "Le <strong>pattern matching</strong> est utilisé (<code>match</code>/<code>Option</code>).",
      "Aucune <strong>mutation</strong> dans la logique (<code>val</code>, pas <code>var</code>).",
      "Le <strong>top N</strong> des mots est correct.",
      "Le programme <strong>compile et tourne</strong> (<code>scala</code>).",
    ],
    pistes:
      "<p>Mobilise les leçons sur les <strong>collections</strong>, les <strong>case classes</strong>, le " +
      "<strong>pattern matching</strong>, l'<strong>immuabilité</strong> et <code>Option</code>.</p>" +
      "<p><code>groupBy(identity).view.mapValues(_.size)</code> donne les fréquences ; privilégie <code>val</code> partout " +
      "où c'est possible.</p>",
  },

  {
    id: "powershell-rapport",
    course: "powershell",
    courseTitle: "PowerShell",
    dir: "powershell",
    accent: "powershell",
    type: "Script d'automatisation (PowerShell)",
    niveau: "Intermédiaire",
    titre: "Un rapport système automatisé",
    contexte:
      "<p>Tu veux un état des lieux automatique de ta machine : top des processus gourmands, espace disque, services " +
      "arrêtés — exporté dans un <strong>rapport propre</strong>. <strong>PowerShell</strong> est fait pour ça.</p>",
    objectif:
      "<p>Écrire un script <strong>PowerShell</strong> exploitant le <strong>pipeline d'objets</strong>, le filtrage/tri et " +
      "l'export, organisé en fonctions.</p>",
    livrable: "Un script PowerShell (.ps1) qui produit un rapport (CSV ou HTML).",
    fonctionnalites: [
      "Collecter des infos via des <strong>cmdlets</strong> (<code>Get-Process</code>, <code>Get-Service</code>…).",
      "Filtrer et trier avec le <strong>pipeline</strong> (<code>Where-Object</code>, <code>Sort-Object</code>, <code>Select-Object</code>).",
      "Mettre en forme une <strong>sélection de propriétés</strong>.",
      "<strong>Exporter</strong> le résultat (<code>Export-Csv</code> ou <code>ConvertTo-Html</code>).",
      "Organiser le code en <strong>fonctions</strong>.",
      "Gérer un <strong>paramètre</strong> (ex. nombre de processus à lister).",
    ],
    criteres: [
      "Le script utilise le <strong>pipeline d'objets</strong> (<code>cmdlet | Where | Sort | Select</code>).",
      "Au moins un <code>Where-Object</code> <strong>filtre</strong> des objets.",
      "Un <strong>tri</strong> (<code>Sort-Object</code>) est appliqué.",
      "Le résultat est <strong>exporté</strong> (<code>Export-Csv</code>/<code>ConvertTo-Html</code>).",
      "Le code est organisé en au moins une <strong>fonction avec paramètre</strong>.",
      "Le script <strong>s'exécute</strong> sans erreur.",
    ],
    pistes:
      "<p>Mobilise les leçons sur les <strong>cmdlets</strong>, le <strong>pipeline</strong>, le <strong>filtrage/tri</strong>, " +
      "les <strong>fonctions</strong> et l'<strong>export</strong>.</p>" +
      "<p>Rappelle-toi que le pipeline transporte des <strong>objets</strong>, pas du texte : tu filtres et tries sur des " +
      "<em>propriétés</em>.</p>",
  },

  {
    id: "perl-logs",
    course: "perl",
    courseTitle: "Perl",
    dir: "perl",
    accent: "perl",
    type: "Traitement de texte (Perl)",
    niveau: "Intermédiaire",
    titre: "Un analyseur de fichiers journaux en Perl",
    contexte:
      "<p>Tu dois extraire des informations d'un gros <strong>fichier journal</strong> (adresses IP, codes d'erreur, dates). " +
      "Perl et ses <strong>expressions régulières</strong> sont l'outil rêvé.</p>",
    objectif:
      "<p>Écrire un script <strong>Perl</strong> exploitant les expressions régulières, les <em>hash</em> et les tableaux " +
      "pour analyser du texte.</p>",
    livrable: "Un script Perl (.pl).",
    fonctionnalites: [
      "Lire un fichier <strong>ligne à ligne</strong>.",
      "Extraire des champs avec des <strong>regex</strong> (groupes de capture).",
      "Agréger des compteurs dans un <strong>hash</strong> (ex. requêtes par IP).",
      "<strong>Trier</strong> et afficher un classement.",
      "<strong>Filtrer</strong> certaines lignes (erreurs uniquement).",
      "Un <strong>résumé</strong> final.",
    ],
    criteres: [
      "Le fichier est lu <strong>ligne à ligne</strong>.",
      "Des <strong>regex</strong> avec groupes de capture extraient les champs.",
      "Un <strong>hash</strong> agrège des compteurs (clé → total).",
      "Un <strong>tri</strong> produit un classement (<code>sort</code> sur les valeurs du hash).",
      "Un <strong>filtrage</strong> par condition est appliqué.",
      "Le script <strong>s'exécute</strong> correctement (<code>perl</code>).",
    ],
    pistes:
      "<p>Mobilise les leçons sur les <strong>scalaires/tableaux/hash</strong>, les <strong>regex</strong> et les " +
      "<strong>fichiers</strong>.</p>" +
      "<p><code>$compteur{$ip}++</code> agrège en une ligne ; les regex sont natives en Perl (opérateur <code>=~</code>).</p>",
  },

  {
    id: "cobol-paie",
    course: "cobol",
    courseTitle: "COBOL",
    dir: "cobol",
    accent: "cobol",
    type: "Programme de gestion (COBOL)",
    niveau: "Intermédiaire",
    titre: "Un état de paie en COBOL",
    contexte:
      "<p>Dans la gestion d'entreprise, COBOL traite encore des paies et des facturations. Tu vas écrire un programme qui " +
      "lit des enregistrements d'employés et produit un <strong>état de paie</strong> avec des totaux.</p>",
    objectif:
      "<p>Écrire un programme <strong>COBOL structuré</strong> (divisions) qui lit des données, calcule et produit un état formaté.</p>",
    livrable: "Un programme COBOL (.cob / .cbl).",
    fonctionnalites: [
      "Les quatre <strong>divisions</strong> correctement structurées.",
      "Des données décrites avec des clauses <strong>PIC</strong> (numériques et alphanumériques).",
      "La <strong>lecture</strong> d'enregistrements (fichier séquentiel ou table interne).",
      "Des <strong>calculs</strong> (salaire brut, net, totaux).",
      "Une boucle <code>PERFORM</code> pour traiter chaque enregistrement.",
      "Un <strong>état formaté</strong> en sortie (colonnes alignées, total général).",
    ],
    criteres: [
      "Les divisions <strong>IDENTIFICATION / ENVIRONMENT / DATA / PROCEDURE</strong> sont présentes.",
      "Les données utilisent des clauses <strong>PIC</strong> adaptées (<code>9</code>, <code>X</code>, <code>V</code>, <code>S</code>).",
      "Une boucle <code>PERFORM</code> traite les enregistrements.",
      "Les <strong>calculs</strong> (totaux/sous-totaux) sont corrects.",
      "L'<strong>état de sortie</strong> est formaté lisiblement (colonnes alignées).",
      "Le programme <strong>compile et s'exécute</strong> (ex. GnuCOBOL).",
    ],
    pistes:
      "<p>Mobilise les leçons sur les <strong>divisions</strong>, les clauses <strong>PIC</strong>, les <strong>fichiers/tables</strong>, " +
      "<code>PERFORM</code> et les <strong>calculs</strong>.</p>" +
      "<p><code>PIC 9(5)V99</code> = un nombre à deux décimales ; soigne l'alignement des colonnes de l'état imprimé.</p>",
  },

  {
    id: "fortran-stats",
    course: "fortran",
    courseTitle: "Fortran",
    dir: "fortran",
    accent: "fortran",
    type: "Calcul numérique (Fortran)",
    niveau: "Intermédiaire",
    titre: "Des statistiques numériques en Fortran",
    contexte:
      "<p>Fortran reste roi du <strong>calcul scientifique</strong>. Tu vas écrire un programme qui lit une série de mesures " +
      "et calcule des <strong>statistiques</strong> (moyenne, écart-type, min/max).</p>",
    objectif:
      "<p>Écrire un programme <strong>Fortran</strong> mobilisant tableaux, boucles <code>DO</code>, fonctions/subroutines et " +
      "calcul numérique.</p>",
    livrable: "Un programme Fortran (.f90).",
    fonctionnalites: [
      "Déclarer et remplir un <strong>tableau</strong> de mesures.",
      "Calculer la <strong>moyenne</strong> et l'<strong>écart-type</strong>.",
      "Trouver le <strong>minimum</strong> et le <strong>maximum</strong>.",
      "Organiser les calculs en <strong>subroutines</strong> ou <strong>fonctions</strong>.",
      "Parcourir le tableau avec des boucles <code>DO</code>.",
      "Afficher les <strong>résultats formatés</strong>.",
    ],
    criteres: [
      "Les données sont stockées dans un <strong>tableau</strong> (array).",
      "Des boucles <code>DO</code> parcourent les données.",
      "Au moins une <strong>fonction ou subroutine</strong> encapsule un calcul.",
      "La <strong>moyenne</strong> et l'<strong>écart-type</strong> sont corrects.",
      "Les <strong>types numériques</strong> sont déclarés explicitement (<code>real</code>, <code>integer</code>).",
      "Le programme <strong>compile</strong> (<code>gfortran</code>) et donne les bons résultats.",
    ],
    pistes:
      "<p>Mobilise les leçons sur les <strong>tableaux</strong>, les boucles <code>DO</code>, les <strong>subroutines/fonctions</strong> " +
      "et le <strong>calcul</strong>.</p>" +
      "<p>Mets <code>implicit none</code> en tête pour éviter les pièges de typage ; un tableau Fortran est indexé à partir " +
      "de 1 par défaut.</p>",
  },

  {
    id: "julia-montecarlo",
    course: "julia",
    courseTitle: "Julia",
    dir: "julia",
    accent: "julia",
    type: "Calcul scientifique (Julia)",
    niveau: "Intermédiaire",
    titre: "Estimer π par la méthode de Monte-Carlo",
    contexte:
      "<p>Julia combine la simplicité de Python et la vitesse du C pour le calcul. Tu vas écrire une petite <strong>simulation " +
      "numérique</strong> — estimer <strong>π</strong> par la méthode de Monte-Carlo — et analyser la précision.</p>",
    objectif:
      "<p>Écrire un programme <strong>Julia</strong> mobilisant les tableaux, le <em>broadcasting</em>, les fonctions et " +
      "éventuellement le <em>multiple dispatch</em>.</p>",
    livrable: "Un programme Julia (.jl).",
    fonctionnalites: [
      "Générer des données (points aléatoires ou une grille).",
      "Un calcul <strong>vectorisé</strong> avec le <em>broadcasting</em> (<code>.</code>).",
      "Des <strong>fonctions</strong> pour la logique de simulation.",
      "L'<strong>estimation</strong> d'une grandeur (π, une intégrale, une moyenne).",
      "Une mesure de l'<strong>erreur</strong> selon le nombre d'échantillons.",
      "L'affichage des <strong>résultats</strong>.",
    ],
    criteres: [
      "Des <strong>tableaux/vecteurs</strong> sont utilisés.",
      "Au moins une opération est <strong>vectorisée</strong> via le <em>broadcasting</em> (point <code>.</code>).",
      "Des <strong>fonctions</strong> encapsulent la logique.",
      "Le <strong>résultat</strong> est correct (proche de la valeur attendue).",
      "Un <strong>type</strong> est annoté ou le <em>multiple dispatch</em> est exploité quelque part.",
      "Le programme <strong>s'exécute</strong> (<code>julia</code>).",
    ],
    pistes:
      "<p>Mobilise les leçons sur les <strong>tableaux/broadcasting</strong>, les <strong>fonctions</strong>, les " +
      "<strong>types/dispatch</strong> et la <strong>performance</strong>.</p>" +
      "<p>Monte-Carlo de π : tire des points dans le carré unité, compte ceux qui tombent dans le quart de cercle ; le " +
      "point <code>.</code> vectorise une opération sur tout un tableau.</p>",
  },

  {
    id: "zig-outil",
    course: "zig",
    courseTitle: "Zig",
    dir: "zig",
    accent: "zig",
    type: "Programme système (Zig)",
    niveau: "Avancé",
    titre: "Un compteur de fichier en Zig",
    contexte:
      "<p>Zig vise un <strong>contrôle total et sans surprise</strong> sur la mémoire et les erreurs. Tu vas écrire un petit " +
      "outil en ligne de commande (par ex. un compteur de lignes/mots/octets) qui gère <strong>explicitement</strong> sa mémoire.</p>",
    objectif:
      "<p>Écrire un programme <strong>Zig</strong> mobilisant les allocateurs explicites, la gestion d'erreurs " +
      "(<em>error union</em>), les <em>slices</em> et <code>defer</code>.</p>",
    livrable: "Un programme Zig (.zig) compilé.",
    fonctionnalites: [
      "Lire des <strong>arguments</strong> et/ou un <strong>fichier</strong>.",
      "Traiter le contenu (compter <strong>lignes/mots/octets</strong>).",
      "Gérer la mémoire avec un <strong>allocateur explicite</strong>.",
      "Gérer les erreurs avec les <strong>error unions</strong> (<code>try</code>/<code>catch</code>).",
      "Libérer les ressources avec <code>defer</code>.",
      "Afficher le <strong>résultat</strong> formaté.",
    ],
    criteres: [
      "La mémoire est gérée via un <strong>allocateur explicite</strong> (passé en argument).",
      "Les erreurs sont gérées avec une <strong>error union</strong> (<code>try</code> ou <code>catch</code>).",
      "<code>defer</code> libère les ressources allouées.",
      "Les <strong>slices</strong> (<code>[]const u8</code>) portent les données.",
      "Le programme <strong>compile</strong> (<code>zig build-exe</code>) et tourne sans fuite.",
      "Le <strong>résultat</strong> (les comptes) est correct.",
    ],
    pistes:
      "<p>Mobilise les leçons sur les <strong>allocateurs</strong>, les <strong>error unions</strong>, les <strong>slices</strong>, " +
      "<code>defer</code> et <code>comptime</code>.</p>" +
      "<p>En Zig, l'allocation est explicite : tu reçois un <code>allocator</code>, et tu places le <code>defer</code> de " +
      "libération juste après l'allocation.</p>",
  },

  {
    id: "lisp-calculatrice",
    course: "lisp",
    courseTitle: "Lisp",
    dir: "lisp",
    accent: "lisp",
    type: "Programme Lisp / Scheme",
    niveau: "Avancé",
    titre: "Une calculatrice d'expressions en Lisp",
    contexte:
      "<p>En Lisp, le <strong>code est une liste</strong>. Tu vas écrire une petite calculatrice qui évalue des expressions " +
      "préfixées (par ex. <code>(+ 1 (* 2 3))</code>) en t'appuyant sur les listes et la récursivité.</p>",
    objectif:
      "<p>Écrire un programme <strong>Lisp</strong> (ou Scheme) mobilisant les listes, la récursivité et les fonctions de " +
      "première classe.</p>",
    livrable: "Un programme Lisp / Scheme (.lisp / .scm).",
    fonctionnalites: [
      "Représenter les <strong>expressions</strong> comme des listes.",
      "Une fonction d'<strong>évaluation récursive</strong> (<code>car</code>/<code>cdr</code>).",
      "La gestion des <strong>opérateurs</strong> (<code>+ - * /</code>) via un <code>cond</code> ou une table.",
      "Le traitement des <strong>expressions imbriquées</strong>.",
      "Une <strong>fonction de première classe</strong> (<code>map</code>, <code>apply</code> ou une lambda).",
      "Des <strong>exemples</strong> de test.",
    ],
    criteres: [
      "Les expressions sont des <strong>listes</strong> manipulées avec <code>car</code>/<code>cdr</code>.",
      "L'évaluation est <strong>récursive</strong>.",
      "Les opérateurs sont <strong>dispatchés</strong> (<code>cond</code>/<code>case</code> ou table).",
      "Les expressions <strong>imbriquées</strong> sont correctement évaluées.",
      "Au moins une <strong>fonction de première classe</strong> est utilisée (<code>map</code>/<code>apply</code>/lambda).",
      "Le programme <strong>s'exécute</strong> et donne les bons résultats.",
    ],
    pistes:
      "<p>Mobilise les leçons sur les <strong>listes</strong>, la <strong>récursivité</strong>, les <strong>fonctions de " +
      "première classe</strong> et les <strong>macros</strong>.</p>" +
      "<p>Le premier élément d'une expression est l'opérateur, le reste sont les arguments : évalue récursivement chaque " +
      "argument avant d'appliquer l'opérateur.</p>",
  },

  {
    id: "ocaml-interpreteur",
    course: "ocaml",
    courseTitle: "OCaml",
    dir: "ocaml",
    accent: "ocaml",
    type: "Programme OCaml",
    niveau: "Avancé",
    titre: "Un mini-interpréteur typé en OCaml",
    contexte:
      "<p>Tu veux un petit <strong>évaluateur d'expressions</strong> arithmétiques en OCaml, en t'appuyant sur les types " +
      "algébriques (<em>variants</em>) et le <em>pattern matching</em> — le cœur du langage.</p>",
    objectif:
      "<p>Écrire un programme <strong>OCaml</strong> mobilisant les types algébriques, le <em>pattern matching</em>, les " +
      "fonctions et <code>option</code>/<code>result</code>.</p>",
    livrable: "Un programme OCaml (.ml).",
    fonctionnalites: [
      "Un type <strong>variant</strong> pour les expressions (<code>Num</code>, <code>Add</code>, <code>Mul</code>, <code>Div</code>…).",
      "Une fonction d'<strong>évaluation récursive</strong> par <em>pattern matching</em>.",
      "La gestion des <strong>erreurs</strong> avec <code>option</code> ou <code>result</code> (division par zéro).",
      "Des <strong>fonctions pures</strong>.",
      "Quelques <strong>expressions de test</strong> et l'affichage des résultats.",
    ],
    criteres: [
      "Un <strong>type variant</strong> (<code>type expr = ...</code>) modélise les expressions.",
      "L'évaluation se fait par <strong>pattern matching exhaustif</strong> (<code>match</code>).",
      "Les erreurs sont gérées avec <code>option</code>/<code>result</code> (pas d'exception non rattrapée).",
      "Les <strong>fonctions sont pures</strong> et l'immutabilité respectée.",
      "Les cas du <code>match</code> sont <strong>complets</strong> (aucun oubli signalé par le compilateur).",
      "Le programme <strong>compile</strong> (<code>ocaml</code>/<code>dune</code>) et donne les bons résultats.",
    ],
    pistes:
      "<p>Mobilise les leçons sur les <strong>variants</strong>, le <strong>pattern matching</strong>, les <strong>fonctions</strong>, " +
      "les <strong>modules</strong> et <code>option</code>/<code>result</code>.</p>" +
      "<p><code>type expr = Num of float | Add of expr * expr | ...</code> ; <code>let rec eval = function ...</code> ; le " +
      "compilateur t'avertit si un cas manque.</p>",
  },

  {
    id: "fsharp-pipeline",
    course: "fsharp",
    courseTitle: "F#",
    dir: "fsharp",
    accent: "fsharp",
    type: "Application F#",
    niveau: "Intermédiaire → avancé",
    titre: "Un pipeline de traitement de données en F#",
    contexte:
      "<p>Tu veux transformer un jeu de données (par ex. des transactions) en quelques statistiques utiles, en enchaînant " +
      "des étapes claires avec l'opérateur <strong>pipe</strong> — l'idiome de F#.</p>",
    objectif:
      "<p>Écrire une application <strong>F#</strong> mobilisant les fonctions, le <em>pipe</em>, les types " +
      "(<em>records</em>/unions), le <em>pattern matching</em> et l'immutabilité.</p>",
    livrable: "Un programme F# (.fsx / .fs).",
    fonctionnalites: [
      "Un type <strong>record</strong> (et/ou union) pour les données.",
      "Le chargement d'une <strong>liste</strong> de données.",
      "Un <strong>pipeline</strong> <code>|&gt;</code> qui filtre, transforme et agrège.",
      "Des <strong>fonctions de haut niveau</strong> (<code>List.filter</code>/<code>map</code>/<code>sumBy</code>/<code>groupBy</code>).",
      "Du <strong>pattern matching</strong> (<code>match</code>/union).",
      "Un <strong>résultat synthétique</strong> affiché.",
    ],
    criteres: [
      "Un type <strong>record</strong> ou <strong>union</strong> est défini et utilisé.",
      "Au moins un <strong>pipeline</strong> <code>|&gt;</code> enchaîne plusieurs étapes.",
      "Les <strong>fonctions de liste</strong> (<code>filter</code>/<code>map</code>/<code>sumBy</code>…) sont utilisées.",
      "Le <strong>pattern matching</strong> est présent (<code>match</code>).",
      "Aucune <strong>mutation</strong> (<code>let</code>, immutabilité).",
      "Le programme <strong>s'exécute</strong> (<code>dotnet fsi</code>) avec le bon résultat.",
    ],
    pistes:
      "<p>Mobilise les leçons sur les <strong>fonctions</strong>, le <strong>pipe</strong>, les <strong>types</strong>, le " +
      "<strong>pattern matching</strong> et l'<strong>immutabilité</strong>.</p>" +
      "<p><code>data |&gt; List.filter ... |&gt; List.map ... |&gt; List.sumBy ...</code> se lit comme une recette, étape " +
      "par étape.</p>",
  },

  {
    id: "clojure-aggregation",
    course: "clojure",
    courseTitle: "Clojure",
    dir: "clojure",
    accent: "clojure",
    type: "Programme Clojure",
    niveau: "Avancé",
    titre: "Un agrégateur de données immuables en Clojure",
    contexte:
      "<p>En Clojure, <strong>tout est donnée immuable et fonction</strong>. Tu vas analyser une collection (par ex. des " +
      "ventes ou des employés) avec les fonctions de séquence et les <em>threading macros</em>.</p>",
    objectif:
      "<p>Écrire un programme <strong>Clojure</strong> mobilisant les structures immuables, les fonctions de séquence et les " +
      "<em>threading macros</em>.</p>",
    livrable: "Un programme Clojure (.clj).",
    fonctionnalites: [
      "Des données en <strong>structures immuables</strong> (vecteurs de <em>maps</em>).",
      "Des transformations avec <code>map</code>/<code>filter</code>/<code>reduce</code>.",
      "L'usage des <strong>threading macros</strong> (<code>-&gt;</code> ou <code>-&gt;&gt;</code>) pour enchaîner.",
      "Un <strong>regroupement</strong> (<code>group-by</code>) et une agrégation.",
      "Des <strong>fonctions pures</strong> réutilisables.",
      "Un <strong>résultat synthétique</strong>.",
    ],
    criteres: [
      "Les données sont des <strong>structures immuables</strong> (maps/vecteurs).",
      "Les transformations utilisent <code>map</code>/<code>filter</code>/<code>reduce</code>.",
      "Au moins une <strong>threading macro</strong> (<code>-&gt;</code>/<code>-&gt;&gt;</code>) enchaîne des étapes.",
      "<code>group-by</code> (ou <code>frequencies</code>) réalise un regroupement.",
      "Aucune <strong>mutation</strong> d'état (tout est pur).",
      "Le programme <strong>s'exécute</strong> (<code>clojure</code>) avec le bon résultat.",
    ],
    pistes:
      "<p>Mobilise les leçons sur les <strong>données immuables</strong>, les <strong>fonctions de séquence</strong>, les " +
      "<strong>threading macros</strong> et le <strong>REPL</strong>.</p>" +
      "<p><code>(-&gt;&gt; data (filter ...) (map ...) (reduce ...))</code> se lit de gauche à droite ; teste chaque étape au REPL.</p>",
  },

  {
    id: "prolog-genealogie",
    course: "prolog",
    courseTitle: "Prolog",
    dir: "prolog",
    accent: "prolog",
    type: "Base de connaissances (Prolog)",
    niveau: "Intermédiaire → avancé",
    titre: "Un arbre généalogique en Prolog",
    contexte:
      "<p>Prolog raisonne à partir de <strong>faits</strong> et de <strong>règles</strong>. Tu vas modéliser un arbre " +
      "généalogique : qui est parent de qui, puis laisser Prolog déduire grands-parents, ancêtres, frères et sœurs.</p>",
    objectif:
      "<p>Écrire une <strong>base de connaissances Prolog</strong> mobilisant faits, règles, unification, récursivité et requêtes.</p>",
    livrable: "Un programme Prolog (.pl) interrogeable.",
    fonctionnalites: [
      "Des <strong>faits</strong> de base (<code>parent(X, Y)</code>, <code>homme</code>/<code>femme</code>).",
      "Des <strong>règles</strong> dérivées (grand-parent, frère/sœur).",
      "Une <strong>règle récursive</strong> (ancêtre).",
      "Des <strong>requêtes</strong> exploitant l'unification et le <em>backtracking</em>.",
      "La gestion d'un cas à <strong>plusieurs solutions</strong>.",
      "Des <strong>exemples de requêtes</strong> commentés.",
    ],
    criteres: [
      "Des <strong>faits</strong> décrivent les relations de base.",
      "Au moins une <strong>règle</strong> combine plusieurs faits (grand-parent).",
      "Une règle est <strong>récursive</strong> (ancêtre).",
      "Les <strong>requêtes</strong> renvoient les bonnes solutions (via l'unification).",
      "Le <strong>backtracking</strong> est exploité (plusieurs réponses pour une requête).",
      "Le programme se <strong>charge et répond</strong> correctement (<code>swipl</code>).",
    ],
    pistes:
      "<p>Mobilise les leçons sur les <strong>faits</strong>, les <strong>règles</strong>, l'<strong>unification</strong>, la " +
      "<strong>récursivité</strong> et les <strong>requêtes</strong>.</p>" +
      "<p>La récursivité s'écrit en deux clauses : <code>ancetre(X,Y) :- parent(X,Y).</code> et " +
      "<code>ancetre(X,Y) :- parent(X,Z), ancetre(Z,Y).</code></p>",
  },

  {
    id: "ada-reservations",
    course: "ada",
    courseTitle: "Ada",
    dir: "ada",
    accent: "ada",
    type: "Programme robuste (Ada)",
    niveau: "Avancé",
    titre: "Un gestionnaire de réservations en Ada",
    contexte:
      "<p>Dans l'aéronautique et le ferroviaire, Ada est choisi pour sa <strong>fiabilité</strong>. Tu vas écrire un " +
      "gestionnaire de <strong>réservations</strong> (salles, créneaux) où le typage fort empêche les erreurs dès la compilation.</p>",
    objectif:
      "<p>Écrire un programme <strong>Ada</strong> mobilisant le typage fort, les sous-types contraints, les <em>records</em>, " +
      "les <em>packages</em> et les exceptions.</p>",
    livrable: "Un programme Ada (.adb / .ads).",
    fonctionnalites: [
      "Des <strong>types contraints</strong> (ex. <code>Heure range 0..23</code>, <code>Capacite range 1..100</code>).",
      "Un <strong>record</strong> pour une réservation.",
      "Un <strong>package</strong> qui regroupe le type et ses opérations.",
      "L'ajout et la <strong>vérification</strong> d'une réservation (pas de double réservation).",
      "La levée d'<strong>exceptions</strong> sur les cas invalides.",
      "Un <strong>menu</strong> en console.",
    ],
    criteres: [
      "Au moins un <strong>sous-type contraint</strong> (<code>range</code>) est défini et utilisé.",
      "Un <strong>record</strong> modélise une réservation.",
      "Le code est organisé en <strong>package</strong> (spec <code>.ads</code> + corps <code>.adb</code>).",
      "Une <strong>exception</strong> est déclarée et levée/rattrapée.",
      "Une <strong>contrainte invalide</strong> est rejetée (à la compilation ou à l'exécution).",
      "Le programme <strong>compile</strong> (<code>gnat</code>) et tourne.",
    ],
    pistes:
      "<p>Mobilise les leçons sur le <strong>typage fort</strong>, les <strong>sous-types/contraintes</strong>, les " +
      "<strong>records</strong>, les <strong>packages</strong> et les <strong>exceptions</strong>.</p>" +
      "<p>En Ada, contraindre les types (<code>range</code>) attrape des bugs gratuitement ; sépare la spécification " +
      "(<code>.ads</code>) du corps (<code>.adb</code>).</p>",
  },

  {
    id: "pascal-comptes",
    course: "pascal",
    courseTitle: "Pascal",
    dir: "pascal",
    accent: "pascal",
    type: "Programme Pascal",
    niveau: "Intermédiaire",
    titre: "Un mini-livre de comptes en Pascal",
    contexte:
      "<p>Tu veux tenir un <strong>livre de comptes</strong> simple : saisir des opérations (recette ou dépense), voir le " +
      "solde, sauvegarder. À écrire en <strong>Pascal</strong>, langage clair et structuré.</p>",
    objectif:
      "<p>Écrire un programme <strong>Pascal</strong> mobilisant les <em>records</em>, les tableaux, les " +
      "procédures/fonctions et les fichiers.</p>",
    livrable: "Un programme Pascal (.pas).",
    fonctionnalites: [
      "Un <strong>record</strong> <code>Operation</code> (libellé, montant, type).",
      "Un <strong>tableau</strong> d'opérations.",
      "La <strong>saisie</strong> d'opérations via un menu.",
      "Le calcul du <strong>solde</strong> courant.",
      "La <strong>sauvegarde</strong> et le chargement depuis un fichier.",
      "L'<strong>affichage</strong> de la liste des opérations.",
    ],
    criteres: [
      "Un <strong>record</strong> modélise une opération.",
      "Un <strong>tableau</strong> stocke les opérations.",
      "Le code est découpé en <strong>procédures et fonctions</strong>.",
      "Le <strong>solde</strong> est calculé correctement.",
      "Les opérations sont <strong>écrites puis relues</strong> depuis un fichier.",
      "Le programme <strong>compile</strong> (<code>fpc</code>) et tourne sans erreur.",
    ],
    pistes:
      "<p>Mobilise les leçons sur les <strong>records</strong>, les <strong>tableaux</strong>, les " +
      "<strong>procédures/fonctions</strong> et les <strong>fichiers</strong>.</p>" +
      "<p>Commence par le type <code>Operation</code> et le tableau, puis le menu, puis la persistance dans un fichier.</p>",
  },

  {
    id: "vb-annuaire",
    course: "vb",
    courseTitle: "Visual Basic",
    dir: "vb",
    accent: "vb",
    type: "Application Visual Basic",
    niveau: "Débutant → intermédiaire",
    titre: "Un annuaire d'entreprise en Visual Basic",
    contexte:
      "<p>Une petite entreprise veut un <strong>annuaire interne</strong> simple : ajouter des employés, rechercher par " +
      "nom, lister par service. À écrire en <strong>Visual Basic</strong>.</p>",
    objectif:
      "<p>Construire une application <strong>Visual Basic</strong> mobilisant les structures de contrôle, les " +
      "procédures/fonctions, les collections et une classe.</p>",
    livrable: "Une application Visual Basic (console).",
    fonctionnalites: [
      "Une classe <strong>Employe</strong> (nom, service, poste).",
      "Une <strong>collection</strong> (<code>List</code>) d'employés.",
      "L'<strong>ajout</strong> et la <strong>recherche</strong> par nom.",
      "Le <strong>filtrage</strong> par service.",
      "Un menu avec <code>Select Case</code>.",
      "La gestion des <strong>entrées invalides</strong>.",
    ],
    criteres: [
      "Une <strong>classe</strong> modélise un employé (propriétés).",
      "Une <strong>collection</strong> (<code>List</code>) stocke les données.",
      "Des <strong>procédures/fonctions</strong> structurent le code.",
      "Un <code>Select Case</code> gère le menu.",
      "La <strong>recherche</strong> et le <strong>filtrage</strong> fonctionnent.",
      "Le programme <strong>s'exécute</strong> sans erreur.",
    ],
    pistes:
      "<p>Mobilise les leçons sur les <strong>variables/conditions</strong>, les <strong>boucles</strong>, les " +
      "<strong>procédures/fonctions</strong>, les <strong>collections</strong> et les <strong>classes</strong>.</p>" +
      "<p><code>Select Case</code> rend le menu lisible ; une <code>List(Of Employe)</code> remplace un tableau à taille fixe.</p>",
  },

  {
    id: "objc-lecture",
    course: "objc",
    courseTitle: "Objective-C",
    dir: "objc",
    accent: "objc",
    type: "Application Objective-C",
    niveau: "Intermédiaire → avancé",
    titre: "Une liste de lecture en Objective-C",
    contexte:
      "<p>Tu veux gérer ta <strong>liste de lecture</strong> (livres à lire, en cours, lus) en Objective-C, le langage " +
      "historique des applis Apple, avec ses classes et son <strong>passage de messages</strong>.</p>",
    objectif:
      "<p>Écrire un programme <strong>Objective-C</strong> mobilisant les classes, le passage de messages, les conteneurs " +
      "Foundation et les propriétés.</p>",
    livrable: "Un programme Objective-C (.m).",
    fonctionnalites: [
      "Une classe <strong>Livre</strong> (<code>@interface</code>/<code>@implementation</code>) avec des propriétés.",
      "Un <code>NSMutableArray</code> (ou <code>NSMutableDictionary</code>) pour stocker les livres.",
      "L'ajout et le <strong>changement de statut</strong> (à lire / en cours / lu).",
      "Le <strong>passage de messages</strong> pour les opérations (<code>[liste ajouter:livre]</code>).",
      "L'<strong>affichage filtré</strong> par statut.",
      "L'usage de <code>NSString</code> / <code>NSLog</code>.",
    ],
    criteres: [
      "Une classe est définie avec <code>@interface</code>/<code>@implementation</code> et des propriétés.",
      "Les opérations se font par <strong>passage de messages</strong> (<code>[objet methode:arg]</code>).",
      "Un <strong>conteneur Foundation</strong> (<code>NSMutableArray</code>/<code>NSDictionary</code>) stocke les données.",
      "Le <strong>changement de statut</strong> fonctionne.",
      "L'<strong>affichage filtré</strong> par statut est correct.",
      "Le programme <strong>compile</strong> (<code>clang</code>) et tourne.",
    ],
    pistes:
      "<p>Mobilise les leçons sur les <strong>classes</strong> (<code>@interface</code>/<code>@implementation</code>), le " +
      "<strong>passage de messages</strong>, les <strong>conteneurs Foundation</strong>, les <strong>propriétés</strong> et l'<strong>ARC</strong>.</p>" +
      "<p><code>[tableau addObject:livre]</code> ajoute un élément ; <code>NSLog</code> affiche une chaîne en console.</p>",
  },

  {
    id: "erlang-acteurs",
    course: "erlang",
    courseTitle: "Erlang",
    dir: "erlang",
    accent: "erlang",
    type: "Système concurrent (Erlang)",
    niveau: "Avancé",
    titre: "Un mini-système d'acteurs tolérant aux pannes",
    contexte:
      "<p>Erlang fait tourner des systèmes qui <strong>ne tombent jamais</strong>. Tu vas construire un petit système " +
      "d'<strong>acteurs</strong> : des processus qui s'échangent des messages, et un superviseur qui en relance un s'il plante.</p>",
    objectif:
      "<p>Écrire un programme <strong>Erlang</strong> mobilisant les processus légers, le passage de messages, le " +
      "<em>pattern matching</em> et la tolérance aux pannes.</p>",
    livrable: "Un module Erlang (.erl).",
    fonctionnalites: [
      "Un processus <strong>serveur</strong> qui maintient un état (compteur ou registre).",
      "Le <strong>passage de messages</strong> (<code>!</code> pour envoyer, <code>receive</code> pour recevoir).",
      "Le <strong>pattern matching</strong> sur les messages reçus.",
      "Une <strong>boucle récursive</strong> qui porte l'état.",
      "Plusieurs processus <strong>clients</strong> qui sollicitent le serveur.",
      "Un mécanisme de <strong>redémarrage</strong> en cas de crash (lien/superviseur simple).",
    ],
    criteres: [
      "Au moins un processus est créé avec <code>spawn</code>.",
      "La communication se fait par <strong>messages</strong> (<code>!</code> et <code>receive</code>).",
      "Le <strong>pattern matching</strong> distingue les types de messages.",
      "L'<strong>état</strong> est porté par une fonction récursive (pas de variable mutable).",
      "Plusieurs processus <strong>interagissent</strong> correctement.",
      "Un <strong>crash</strong> est détecté et géré (<code>link</code>/<code>trap_exit</code> ou supervision).",
    ],
    pistes:
      "<p>Mobilise les leçons sur les <strong>processus</strong>, les <strong>messages</strong> (<code>!</code>/<code>receive</code>), " +
      "le <strong>pattern matching</strong>, la <strong>récursivité</strong> et la <strong>supervision</strong>.</p>" +
      "<p>L'état vit dans les arguments d'une fonction qui se rappelle elle-même après chaque message traité.</p>",
  },

  {
    id: "groovy-rapport",
    course: "groovy",
    courseTitle: "Groovy",
    dir: "groovy",
    accent: "groovy",
    type: "Script d'automatisation (Groovy)",
    niveau: "Intermédiaire",
    titre: "Un script de rapport de projet en Groovy",
    contexte:
      "<p>Groovy brille pour scripter sur la JVM (Gradle, Jenkins). Tu vas écrire un script qui <strong>parcourt un dossier " +
      "de projet</strong>, collecte des infos (taille, nombre de fichiers par type) et génère un <strong>rapport</strong>.</p>",
    objectif:
      "<p>Écrire un script <strong>Groovy idiomatique</strong> mobilisant les closures, les fonctions de collection, les " +
      "<em>GStrings</em> et éventuellement un <em>builder</em>.</p>",
    livrable: "Un script Groovy (.groovy).",
    fonctionnalites: [
      "Parcourir un dossier et ses fichiers.",
      "Regrouper/compter par extension avec les <strong>fonctions de collection</strong> (<code>groupBy</code>/<code>collect</code>/<code>findAll</code>).",
      "Utiliser des <strong>closures</strong> (<code>each</code>, <code>with</code>).",
      "Construire des chaînes avec des <strong>GStrings</strong> (<code>${...}</code>).",
      "Générer un <strong>rapport</strong> (texte, JSON via <code>JsonBuilder</code>, ou HTML via <code>MarkupBuilder</code>).",
      "Afficher un <strong>résumé</strong>.",
    ],
    criteres: [
      "Des <strong>closures</strong> sont utilisées (<code>each</code>/<code>collect</code>/<code>findAll</code>).",
      "Au moins une <strong>fonction de collection</strong> regroupe ou filtre (<code>groupBy</code>/<code>findAll</code>).",
      "Des <strong>GStrings</strong> interpolent des valeurs (<code>${...}</code>).",
      "Un <strong>rapport</strong> est généré (fichier ou sortie structurée).",
      "Le code est <strong>concis et idiomatique</strong> (pas du Java verbeux).",
      "Le script <strong>s'exécute</strong> (<code>groovy</code>).",
    ],
    pistes:
      "<p>Mobilise les leçons sur les <strong>closures</strong>, les <strong>collections</strong>, les <strong>GStrings</strong>, " +
      "les <strong>builders</strong> et les <strong>scripts</strong>.</p>" +
      "<p><code>new File('.').eachFile { ... }</code> parcourt un dossier ; un <code>JsonBuilder</code> ou un " +
      "<code>MarkupBuilder</code> construit le rapport élégamment.</p>",
  },

  {
    id: "solidity-crowdfunding",
    course: "solidity",
    courseTitle: "Solidity",
    dir: "solidity",
    accent: "solidity",
    type: "Smart contract (Solidity)",
    niveau: "Avancé",
    titre: "Un contrat de financement participatif",
    contexte:
      "<p>Tu veux un <strong>smart contract</strong> de financement participatif sur Ethereum : les gens contribuent, si " +
      "l'objectif est atteint le créateur retire les fonds, sinon les contributeurs sont <strong>remboursés</strong>.</p>",
    objectif:
      "<p>Écrire un <strong>smart contract Solidity</strong> mobilisant l'état, les fonctions <code>payable</code>, les " +
      "<em>mappings</em>, les <em>modifiers</em>, les <em>events</em> et <code>require</code>.</p>",
    livrable: "Un contrat Solidity (.sol).",
    fonctionnalites: [
      "Des <strong>variables d'état</strong> (objectif, échéance, total collecté, créateur).",
      "Une fonction <code>contribuer()</code> <strong>payable</strong> qui enregistre les contributions (mapping adresse → montant).",
      "Un <strong>modifier</strong> de contrôle (seulement le créateur, ou après l'échéance).",
      "Une fonction de <strong>retrait</strong> des fonds si l'objectif est atteint.",
      "Une fonction de <strong>remboursement</strong> si l'objectif a échoué.",
      "Des <strong>events</strong> (Contribution, Retrait).",
    ],
    criteres: [
      "Des <strong>variables d'état</strong> stockent les paramètres de la campagne.",
      "Une fonction <code>payable</code> reçoit des fonds et enregistre le contributeur (<strong>mapping</strong>).",
      "<code>require</code> valide les conditions (échéance, objectif, montant).",
      "Au moins un <strong>modifier</strong> restreint l'accès (créateur, période).",
      "Des <strong>events</strong> sont émis aux étapes clés.",
      "Le contrat gère <strong>retrait ET remboursement</strong> selon le résultat, et compile (<code>solc</code>, version indiquée par <code>pragma</code>).",
    ],
    pistes:
      "<p>Mobilise les leçons sur les <strong>contrats/l'état</strong>, les fonctions <code>payable</code>, les " +
      "<strong>mappings</strong>, les <strong>modifiers</strong>, les <strong>events</strong> et <code>require</code>.</p>" +
      "<p><code>require(...)</code> protège chaque fonction ; n'envoie les fonds qu'<strong>après</strong> avoir mis à jour " +
      "l'état (protection contre la réentrance).</p>",
  },
  {
    id: "pandas-ventes",
    course: "pandas",
    courseTitle: "pandas",
    dir: "pandas",
    accent: "pandas",
    type: "Projet d'analyse de données",
    niveau: "Intermédiaire",
    titre: "Le tableau de bord des ventes d'une librairie",
    contexte:
      "<p>Une petite librairie en ligne t'ouvre ses données. On te remet deux fichiers&nbsp;: " +
      "<code>ventes.csv</code> (une ligne par produit commandé&nbsp;: date, commande, client, ville, catégorie, " +
      "produit, quantité, prix unitaire) et <code>clients.csv</code> (client, ville, segment). Le fichier de " +
      "ventes n'est pas parfait&nbsp;: quelques villes et prix <strong>manquent</strong>, et la colonne des dates " +
      "est lue comme du texte. On te demande d'en tirer un <strong>petit tableau de bord</strong>.</p>",
    objectif:
      "<p>Mener une <strong>analyse de bout en bout</strong> avec pandas&nbsp;: charger et inspecter, corriger les " +
      "types, traiter les valeurs manquantes, calculer le chiffre d'affaires, le résumer par ville et par catégorie, " +
      "le relier au segment de clientèle, suivre son évolution dans le temps, puis <strong>exporter</strong> un " +
      "résultat propre. L'objectif est la <strong>chaîne correcte</strong>, pas un chiffre spectaculaire.</p>",
    livrable: "Un script (ou notebook) Python utilisant pandas, qui lit les CSV et écrit un fichier de synthèse.",
    fonctionnalites: [
      "Le <strong>chargement</strong> et l'inspection des données (<code>read_csv</code>, <code>info</code>, <code>describe</code>, repérage des manquants).",
      "Le <strong>nettoyage</strong>&nbsp;: conversion des dates (<code>to_datetime</code>), traitement explicite des <code>NaN</code> (supprimer ou remplir, en le justifiant).",
      "Une <strong>colonne calculée</strong> <code>montant = quantite * prix_unitaire</code> (vectorisée).",
      "Le <strong>chiffre d'affaires par ville et par catégorie</strong> avec <code>groupby</code> et un <code>pivot_table</code>.",
      "Une <strong>jointure</strong> avec <code>clients.csv</code> (<code>merge</code>) pour un CA par <strong>segment</strong>.",
      "Le <strong>CA par mois</strong> via un index temporel et <code>resample</code>, puis l'<strong>export</strong> en CSV (<code>index=False</code>).",
    ],
    criteres: [
      "Les <strong>types</strong> sont corrects (dates en <code>datetime</code>, montants numériques) avant toute analyse.",
      "Les <strong>valeurs manquantes</strong> sont traitées explicitement, avec un choix justifié (supprimer vs remplir).",
      "Les <strong>filtres</strong> combinés utilisent des parenthèses (<code>(a) &amp; (b)</code>), sans erreur de priorité.",
      "Les agrégats (<code>groupby</code>, <code>pivot_table</code>) sont corrects et lisibles (colonnes nommées).",
      "La <strong>jointure</strong> est un <code>merge</code> maîtrisé (le bon <code>how</code>, pas de lignes perdues par accident).",
      "L'export est propre&nbsp;: <code>to_csv(index=False)</code>, encodage et séparateur adaptés, fichier rechargé pour vérifier.",
    ],
    pistes:
      "<p>Mobilise les leçons sur le <strong>chargement</strong>, les <strong>types</strong> et les " +
      "<strong>valeurs manquantes</strong>, puis <strong>groupby</strong>, <strong>pivot_table</strong>, " +
      "<strong>merge</strong> et les <strong>séries temporelles</strong>.</p>" +
      "<p>Avance par étapes&nbsp;: charge et regarde d'abord (<code>head</code>, <code>info</code>), nettoie ensuite, " +
      "et n'agrège qu'une fois les types sûrs. Préfère le calcul <strong>vectorisé</strong> à <code>apply</code>, et " +
      "vérifie chaque résultat sur quelques lignes connues avant de faire confiance au total.</p>",
  },
  {
    id: "dataviz-belleville",
    course: "dataviz",
    courseTitle: "Data visualisation",
    dir: "dataviz",
    accent: "dataviz",
    type: "Projet de visualisation",
    niveau: "Intermédiaire",
    titre: "Le tableau de bord ouvert de la ville de Belleville",
    contexte:
      "<p>La ville de <strong>Belleville</strong> ouvre ses données au public et te confie la réalisation de son " +
      "<strong>tableau de bord</strong>. On te remet plusieurs fichiers&nbsp;: la <strong>fréquentation</strong> " +
      "mensuelle de cinq équipements (médiathèque, piscine, stade, théâtre, musée), le <strong>climat</strong> " +
      "(température et précipitations par mois), les <strong>temps de trajet</strong> domicile-travail de 2&nbsp;000 " +
      "habitants, la <strong>surface et le loyer</strong> de logements, la <strong>répartition modale</strong> des " +
      "déplacements, et la <strong>population par quartier</strong>. Le service communication a déjà produit une " +
      "version… avec un axe tronqué et un camembert à douze parts. À toi de faire honnête.</p>",
    objectif:
      "<p>Produire une série de graphiques qui <strong>disent vrai et se lisent vite</strong>. Pour chaque question, " +
      "<strong>choisir la forme</strong> adaptée (comparer, évoluer, distribuer, corréler, composer, cartographier), " +
      "régler correctement l'<strong>échelle</strong> et la <strong>couleur</strong>, gérer la <strong>densité</strong>, " +
      "puis <strong>annoter</strong> chaque graphique d'un titre qui porte le message. L'objectif est la " +
      "<strong>justesse</strong> et la lisibilité, pas l'effet spectaculaire.</p>",
    livrable: "Une planche de graphiques (script Python + matplotlib, ou notebook) accompagnée d'une courte note de lecture par graphique.",
    fonctionnalites: [
      "Un <strong>diagramme en barres</strong> trié de la fréquentation des équipements (barres horizontales si les noms sont longs, axe démarrant à zéro).",
      "Une <strong>courbe multi-séries</strong> de l'évolution mensuelle, et une lecture du climat (température vs précipitations) sans double axe trompeur.",
      "Une <strong>distribution</strong> des temps de trajet&nbsp;: histogramme (choix des classes justifié) et boîte à moustaches (médiane, quartiles, valeurs extrêmes).",
      "Un <strong>nuage de points</strong> surface × loyer avec droite de tendance, en gérant la surcharge (transparence ou agrégation) si les points se chevauchent.",
      "Une <strong>composition</strong> de la répartition modale (barre empilée 100&nbsp;% plutôt qu'un camembert surchargé).",
      "Une <strong>carte choroplèthe</strong> des quartiers exprimée en <strong>taux</strong> (et non en effectifs bruts), avec une palette lisible pour les daltoniens.",
    ],
    criteres: [
      "La <strong>forme</strong> est choisie en fonction de la question&nbsp;; aucun camembert à plus de cinq parts.",
      "Les <strong>barres</strong> partent toujours de <strong>zéro</strong>&nbsp;; aucun axe tronqué qui exagère un écart.",
      "La <strong>couleur</strong> encode une variable (pas de décor)&nbsp;: palette séquentielle/divergente/qualitative adaptée, testée pour le <strong>daltonisme</strong>.",
      "La <strong>densité</strong> est maîtrisée&nbsp;: pas de nuage illisible, recours à la transparence, à l'agrégation ou aux petits multiples.",
      "La <strong>carte</strong> montre un <strong>taux</strong> normalisé, pas une simple carte de population.",
      "Chaque graphique a un <strong>titre porteur du message</strong> (« La piscine fait le plein en été » plutôt que « Fréquentation ») et se lit sans la légende.",
    ],
    pistes:
      "<p>Mobilise les leçons sur le <strong>choix de la forme</strong>, les <strong>barres</strong>, les " +
      "<strong>courbes</strong>, les <strong>distributions</strong>, le <strong>nuage de points</strong> et la " +
      "<strong>composition</strong>, puis celles sur l'<strong>échelle</strong>, la <strong>couleur</strong>, la " +
      "<strong>densité</strong> et les <strong>cartes</strong>.</p>" +
      "<p>Commence par écrire, pour chaque fichier, la <strong>question</strong> à laquelle le graphique répond&nbsp;: " +
      "la forme en découle presque toujours. Prépare et agrège les données avec <a href=\"../pandas/cours.html\">pandas</a> " +
      "avant de tracer, et relis chaque graphique avec la <strong>checklist du lecteur critique</strong> de la dernière leçon.</p>",
  },
  {
    id: "stats-orbit",
    course: "stats",
    courseTitle: "Statistiques appliquées",
    dir: "stats",
    accent: "stats",
    type: "Projet d'analyse",
    niveau: "Intermédiaire",
    titre: "L'analyse honnête d'un test A/B pour l'application Orbit",
    contexte:
      "<p>Tu es l'analyste de <strong>Orbit</strong>, une petite application web SaaS. L'équipe produit a testé un " +
      "nouveau bouton d'inscription et te remet plusieurs jeux de données&nbsp;: les <strong>temps de réponse</strong> " +
      "de l'API (des milliers de mesures en millisecondes, à longue traîne), le résultat d'un <strong>test A/B</strong> " +
      "(variante A&nbsp;: 1&nbsp;000 visiteurs, 80 inscriptions&nbsp;; variante B&nbsp;: 1&nbsp;000 visiteurs, " +
      "104 inscriptions), les <strong>temps de chargement</strong> des pages et le <strong>taux de rebond</strong> " +
      "associé, et les <strong>notes de satisfaction</strong> par appareil. Le directeur veut une phrase&nbsp;: " +
      "«&nbsp;le nouveau bouton est-il vraiment meilleur&nbsp;?&nbsp;» — sans se faire piéger par le hasard.</p>",
    objectif:
      "<p>Produire une <strong>analyse statistique honnête</strong>&nbsp;: décrire chaque distribution avec le bon " +
      "indicateur (médiane et percentiles plutôt que moyenne pour une latence à longue traîne), <strong>comparer les " +
      "deux variantes</strong> du test A/B avec un test d'hypothèse et un <strong>intervalle de confiance</strong>, " +
      "mesurer une <strong>corrélation</strong> sans la confondre avec une cause, et conclure en énonçant clairement " +
      "l'<strong>incertitude</strong>. L'objectif est la <strong>justesse</strong> et la prudence, pas un résultat " +
      "spectaculaire.</p>",
    livrable: "Un rapport d'analyse (script Python + module statistics/numpy, ou notebook) qui répond à la question posée en quantifiant l'incertitude, graphiques à l'appui.",
    fonctionnalites: [
      "Un <strong>résumé de la distribution</strong> des temps de réponse&nbsp;: moyenne, médiane, écart-type et percentiles p50/p95/p99, avec un commentaire sur l'asymétrie.",
      "La <strong>comparaison du test A/B</strong>&nbsp;: taux de conversion de chaque variante, différence observée, et un <strong>test d'hypothèse</strong> avec sa valeur p correctement interprétée.",
      "L'<strong>intervalle de confiance</strong> à 95&nbsp;% de la différence de taux entre A et B, avec sa lecture en clair.",
      "Un <strong>nuage</strong> temps de chargement × taux de rebond et son coefficient de <strong>corrélation</strong>, accompagné d'une phrase sur la causalité.",
      "Une <strong>régression simple</strong> (par exemple rebond en fonction du temps de chargement) avec l'interprétation de la pente et du R².",
      "Un <strong>encadré «&nbsp;pièges évités&nbsp;»</strong>&nbsp;: comparaisons multiples, biais de survie des avis, vérification d'un éventuel paradoxe de Simpson par appareil.",
    ],
    criteres: [
      "Le bon <strong>indicateur de centre</strong> est choisi selon la forme de la distribution&nbsp;; une latence à longue traîne est décrite par la <strong>médiane et les percentiles</strong>, pas par la seule moyenne.",
      "La conclusion du test A/B <strong>quantifie l'incertitude</strong> (valeur p et/ou intervalle de confiance)&nbsp;; elle ne dit jamais «&nbsp;c'est prouvé&nbsp;» sur un simple écart de pourcentages.",
      "La <strong>valeur p</strong> est interprétée correctement&nbsp;: elle n'est pas «&nbsp;la probabilité que B soit meilleur&nbsp;», et un résultat non significatif n'est pas «&nbsp;une preuve d'égalité&nbsp;».",
      "Toute <strong>corrélation</strong> est présentée comme telle&nbsp;: aucun raccourci vers la causalité sans justification.",
      "Les <strong>pièges</strong> (comparaisons multiples, biais de sélection/survie, agrégation trompeuse) sont explicitement cherchés et commentés.",
      "Le rapport reste <strong>lisible par un non-statisticien</strong>&nbsp;: chaque chiffre est traduit en une phrase de décision.",
    ],
    pistes:
      "<p>Mobilise les leçons sur la <strong>description d'une distribution</strong>, l'<strong>échantillonnage</strong>, " +
      "l'<strong>intervalle de confiance</strong>, le <strong>test d'hypothèse</strong>, la <strong>corrélation</strong> " +
      "et la <strong>régression</strong>, puis le module sur les <strong>pièges</strong>.</p>" +
      "<p>Commence par <strong>tracer</strong> chaque jeu de données avant de le résumer (le réflexe d'Anscombe), " +
      "calcule les statistiques avec <a href=\"../pandas/cours.html\">pandas</a> et visualise-les avec " +
      "<a href=\"../dataviz/cours.html\">matplotlib</a>. Termine par une phrase unique, prudente et chiffrée, adressée " +
      "au directeur produit.</p>",
  },
  {
    id: "bdd-patoune",
    course: "bdd",
    courseTitle: "Concevoir une base de données",
    dir: "bdd",
    accent: "bdd",
    type: "Projet de modélisation",
    niveau: "Intermédiaire",
    titre: "La base de données de la clinique vétérinaire Patoune",
    contexte:
      "<p>La clinique vétérinaire <strong>Patoune</strong> gère aujourd'hui ses rendez-vous et sa facturation dans une " +
      "grande feuille de calcul&nbsp;: une ligne par acte facturé, avec, recopiés à chaque fois, le nom du " +
      "<strong>propriétaire</strong>, son téléphone, le nom et l'espèce de l'<strong>animal</strong>, le vétérinaire, la " +
      "date, l'acte pratiqué et son prix. Résultat&nbsp;: un propriétaire qui déménage a deux adresses selon les lignes, " +
      "un tarif d'acte changé la semaine dernière cohabite avec l'ancien, et personne n'ose supprimer une vieille ligne " +
      "de peur d'effacer le seul endroit où figure un animal. La clinique veut passer à une <strong>vraie base " +
      "relationnelle</strong>, saine, sur laquelle bâtir un petit logiciel de gestion.</p>",
    objectif:
      "<p>Concevoir <strong>de zéro</strong> le schéma de la base de Patoune, du besoin au SQL. Il faut " +
      "<strong>identifier les entités</strong> (propriétaires, animaux, vétérinaires, consultations, actes, factures) et " +
      "leurs <strong>relations</strong>, choisir des <strong>clés</strong>, <strong>normaliser</strong> jusqu'à la 3e " +
      "forme pour supprimer les redondances, poser les <strong>contraintes</strong> qui garantissent l'intégrité, puis " +
      "réfléchir aux <strong>index</strong> utiles et à une première <strong>migration</strong> d'évolution. L'objectif " +
      "est un schéma dont les incohérences d'aujourd'hui deviennent <strong>impossibles à écrire</strong>.</p>",
    livrable:
      "Un schéma complet&nbsp;: un diagramme entité-association, le SQL des <code>CREATE TABLE</code> avec clés primaires, " +
      "clés étrangères et contraintes, une note justifiant le niveau de normalisation atteint, deux ou trois index " +
      "argumentés, et le script d'une migration d'évolution (par exemple l'ajout des rappels de vaccination).",
    fonctionnalites: [
      "Un <strong>modèle entité-association</strong> qui distingue clairement les entités (propriétaire, animal, vétérinaire, consultation, acte, facture) et le type de chaque relation (un propriétaire a plusieurs animaux, une consultation porte sur plusieurs actes).",
      "Un jeu de <strong>tables normalisées</strong>&nbsp;: le nom d'un propriétaire, l'espèce d'un animal ou le tarif d'un acte ne sont écrits qu'à un seul endroit, jamais recopiés à chaque facture.",
      "Des <strong>clés étrangères</strong> qui relient les tables et une politique claire de suppression (que devient l'historique d'un animal si son propriétaire quitte la clinique&nbsp;?).",
      "Des <strong>contraintes d'intégrité</strong>&nbsp;: un prix positif, une espèce prise dans une liste, un e-mail unique par propriétaire, une date de consultation obligatoire.",
      "La table d'association <strong>consultation ↔ acte</strong> (une consultation regroupe plusieurs actes, un même acte se pratique en de nombreuses consultations) avec le prix facturé conservé au moment de l'acte.",
      "Deux ou trois <strong>index</strong> justifiés (retrouver les consultations d'un animal, les factures d'un mois) et une <strong>migration</strong> d'évolution du schéma sans casser l'existant.",
    ],
    criteres: [
      "Chaque <strong>fait est écrit une seule fois</strong>&nbsp;: aucune information (coordonnées, espèce, tarif) n'est recopiée d'une ligne à l'autre. La 3e forme normale est atteinte, ou l'écart est justifié.",
      "Les <strong>relations</strong> sont correctement typées (1-N, N-N) et chaque N-N passe par une table d'association dédiée.",
      "Les <strong>contraintes</strong> rendent les incohérences du départ impossibles&nbsp;: on ne peut pas saisir deux adresses contradictoires pour un même propriétaire.",
      "Les <strong>clés étrangères</strong> sont posées avec une action de suppression réfléchie, et l'intégrité référentielle est garantie (pas d'animal orphelin sans propriétaire).",
      "Les <strong>index</strong> proposés répondent à des requêtes réelles de la clinique, et leur coût en écriture est mentionné, pas seulement leur bénéfice en lecture.",
      "La <strong>migration</strong> fournie fait évoluer le schéma (ajout d'une fonctionnalité) sans perdre de données et sans bloquer l'application existante.",
    ],
    pistes:
      "<p>Mobilise les leçons sur les <strong>entités et relations</strong>, les <strong>clés primaires et " +
      "étrangères</strong>, la <strong>normalisation</strong>, les <strong>contraintes</strong>, les <strong>index</strong> " +
      "et les <strong>migrations</strong>.</p>" +
      "<p>Commence par <strong>raconter le domaine à voix haute</strong> — «&nbsp;un propriétaire a des animaux&nbsp;», " +
      "«&nbsp;un animal a des consultations&nbsp;», «&nbsp;une consultation regroupe des actes&nbsp;» — les noms deviennent " +
      "tes tables, les verbes tes relations. Écris ensuite les <a href=\"../sql/cours.html\">CREATE TABLE</a> en t'appuyant " +
      "sur le <a href=\"../sql/cours.html\">cours SQL</a>, et demande-toi, à la toute fin, si une partie du domaine (les " +
      "rappels, l'historique) gagnerait à être pensée en <a href=\"../nosql/cours.html\">NoSQL</a>. Termine par un scénario " +
      "d'incohérence du tableur de départ — «&nbsp;deux adresses pour le même propriétaire&nbsp;» — et montre que ton " +
      "schéma le rend tout simplement impossible.</p>",
  },
  {
    id: "data-eng-velociti",
    course: "data-eng",
    courseTitle: "Ingénierie de données",
    dir: "data-eng",
    accent: "data-eng",
    type: "Projet de pipeline",
    niveau: "Intermédiaire",
    titre: "Le pipeline de données de Vélociti, le vélo en libre-service",
    contexte:
      "<p>Tu rejoins l'équipe data de <strong>Vélociti</strong>, un service de vélos en libre-service présent dans " +
      "une grande ville. Chaque nuit, plusieurs sources doivent converger vers un entrepôt exploitable&nbsp;: un export " +
      "quotidien des <strong>trajets</strong> (CSV volumineux, un fichier par jour), un référentiel des " +
      "<strong>stations</strong> (JSON tiré d'une API, qui change lentement), les relevés des <strong>capteurs</strong> " +
      "de bornes (événements bruts, parfois en double), et la <strong>météo</strong> (API externe, une ligne par heure). " +
      "Aujourd'hui, des scripts éparpillés recopient des fichiers à la main&nbsp;: rien n'est rejouable, personne ne sait " +
      "si les chiffres du matin sont à jour, et un doublon de capteur fausse déjà le taux de rotation affiché aux élus.</p>",
    objectif:
      "<p>Concevoir un <strong>pipeline reproductible</strong> qui transforme ces sources brutes en tables fiables pour " +
      "les tableaux de bord. Il faut <strong>ingérer</strong> chaque source avec la bonne stratégie (pleine ou " +
      "incrémentale), <strong>transformer</strong> par couches (brut → nettoyé → agrégé), <strong>partitionner</strong> " +
      "le stockage par date, garantir l'<strong>idempotence</strong> (un jour rejoué ne crée pas de doublon), " +
      "<strong>orchestrer</strong> les dépendances, <strong>tester la qualité</strong> et <strong>surveiller</strong> la " +
      "fraîcheur. L'objectif est la <strong>fiabilité</strong> et la reprise sur incident, pas la sophistication.</p>",
    livrable: "Un pipeline documenté (schéma du DAG + scripts SQL/Python ou pseudo-code d'orchestration) qui produit des tables « gold » partitionnées, idempotentes, testées et observées, avec une procédure de backfill.",
    fonctionnalites: [
      "Un <strong>schéma du pipeline</strong> (le DAG)&nbsp;: sources, étapes de transformation, tables produites et dépendances entre elles.",
      "Une <strong>stratégie d'ingestion</strong> par source&nbsp;: pleine pour les stations (petit référentiel), incrémentale par date pour les trajets et la météo (gros volumes).",
      "Des <strong>couches</strong> explicites (bronze/silver/gold)&nbsp;: données brutes conservées, table nettoyée typée et dédoublonnée, agrégats métier (trajets et taux de rotation par station et par jour).",
      "Un <strong>stockage partitionné</strong> par date de trajet, au format colonnes (Parquet) pour les grandes tables, avec une justification du choix.",
      "Une étape <strong>idempotente</strong>&nbsp;: relancer le pipeline sur une journée déjà traitée remplace la partition au lieu d'empiler des doublons (write-truncate ou <code>MERGE</code> sur une clé).",
      "Un jeu de <strong>tests de qualité</strong>&nbsp;: unicité de la clé de trajet, absence de station inconnue, fraîcheur (le dernier jour est bien là), volumétrie plausible — avec mise en quarantaine des lignes fautives.",
      "Un <strong>contrat de données</strong> minimal (schéma attendu de la table gold) et une règle d'évolution, plus quelques <strong>métriques d'observabilité</strong> (durée, lignes écrites, taux de rejet) et une <strong>procédure de backfill</strong>.",
    ],
    criteres: [
      "Chaque source a une <strong>stratégie d'ingestion justifiée</strong> (pleine vs incrémentale) cohérente avec son volume et sa fréquence de changement.",
      "Le pipeline est <strong>idempotent</strong>&nbsp;: la solution montre explicitement qu'un jour rejoué ne duplique aucune donnée.",
      "Les données sont <strong>partitionnées</strong> par date et le choix du <strong>format</strong> (colonnes pour l'analytique) est argumenté en termes de coût et de volumétrie.",
      "Au moins <strong>quatre contrôles de qualité</strong> sont définis, avec ce qui se passe quand ils échouent (bloquer, alerter, mettre en quarantaine).",
      "Les <strong>dépendances</strong> entre étapes sont explicites (un DAG), et la reprise après échec d'une étape est pensée (retry, backfill ciblé).",
      "Le pipeline est <strong>observable</strong>&nbsp;: on sait dire, sans ouvrir les fichiers, si les données du jour sont fraîches, complètes et dans les volumes attendus.",
    ],
    pistes:
      "<p>Mobilise les leçons sur le <strong>trajet d'une donnée</strong>, le choix <strong>ETL/ELT</strong>, les " +
      "<strong>formats</strong>, le <strong>partitionnement</strong>, l'<strong>idempotence</strong>, " +
      "l'<strong>orchestration</strong>, la <strong>qualité</strong> et l'<strong>observabilité</strong>.</p>" +
      "<p>Commence par <strong>dessiner le DAG</strong> avant d'écrire la moindre ligne&nbsp;: les dépendances révèlent " +
      "l'ordre des étapes. Écris les transformations en <a href=\"../sql/cours.html\">SQL</a>, réfléchis au stockage avec " +
      "les idées de <a href=\"../nosql/cours.html\">NoSQL</a> et de <a href=\"../iac/cours.html\">l'infrastructure comme " +
      "code</a>, et surveille le tout avec les réflexes du cours <a href=\"../observabilite/cours.html\">observabilité</a>. " +
      "Termine par un scénario d'incident&nbsp;: «&nbsp;le fichier d'hier est arrivé en double&nbsp;» — montre que ton " +
      "pipeline s'en remet sans intervention manuelle.</p>",
  },
  {
    id: "mobile-poche",
    course: "mobile",
    courseTitle: "Application mobile",
    dir: "mobile",
    accent: "mobile",
    type: "Projet d'application mobile",
    niveau: "Intermédiaire",
    titre: "« Poche » — une liste de courses partagée qui marche dans le magasin",
    contexte:
      "<p>Un foyer partage une liste de courses. Le problème&nbsp;: c'est <strong>au fond du magasin</strong>, là où le " +
      "réseau ne passe pas, qu'on a besoin de cocher un article — et que deux personnes peuvent modifier la liste " +
      "<strong>en même temps</strong>, chacune de son côté. Les applications qui exigent une connexion permanente sont " +
      "inutilisables dans ce moment précis. On veut une app <strong>« hors-ligne d'abord »</strong>&nbsp;: elle répond " +
      "instantanément sans réseau, mémorise ce qui a changé, puis se <strong>synchronise</strong> dès que la connexion " +
      "revient — sans écraser le travail de l'autre.</p>",
    objectif:
      "<p>Concevoir une application mobile <strong>utilisable sans réseau</strong> qui met en œuvre les briques du cours&nbsp;: " +
      "un <strong>stockage local</strong> comme source de vérité, une <strong>file de synchronisation</strong> qui rejoue les " +
      "changements quand le réseau revient, une <strong>résolution de conflits</strong> simple mais explicite, des " +
      "<strong>listes performantes</strong>, quelques <strong>notifications</strong> utiles (« un membre a ajouté un " +
      "article ») et des <strong>permissions</strong> réduites au strict nécessaire. L'objectif est la " +
      "<strong>fiabilité perçue</strong> — l'app ne « ment » jamais sur son état —, pas la richesse fonctionnelle.</p>",
    livrable:
      "Une conception d'application documentée (maquette d'écrans + schéma de l'état et de la synchronisation) et, au choix, " +
      "un prototype dans l'un des trois écosystèmes (SwiftUI, Jetpack Compose ou Flutter) qui fonctionne hors-ligne et " +
      "synchronise à la reconnexion.",
    fonctionnalites: [
      "Un <strong>écran liste</strong> performant (articles à cocher/décocher) et un <strong>écran détail</strong> pour ajouter une quantité ou une note, avec une navigation claire entre les deux.",
      "Un <strong>stockage local</strong> qui fait autorité&nbsp;: l'app lit et écrit d'abord sur l'appareil, l'affichage ne dépend jamais du réseau.",
      "Un <strong>indicateur d'état de synchronisation</strong> honnête&nbsp;: « à jour », « modifications en attente », « hors ligne » — l'utilisateur sait toujours où en est sa liste.",
      "Une <strong>file de changements</strong> qui mémorise les actions faites hors-ligne et les <strong>rejoue</strong> (de façon idempotente) quand la connexion revient.",
      "Une <strong>règle de résolution de conflits</strong> décrite noir sur blanc (par exemple « le dernier qui coche gagne », ou fusion des ajouts) et son comportement quand deux membres modifient le même article.",
      "Des <strong>notifications</strong> parcimonieuses et pertinentes (un membre a ajouté un article), avec demande de permission <strong>au bon moment</strong> et un refus géré proprement.",
      "Une <strong>adaptation aux écrans</strong> (téléphone/tablette, orientation) et le respect du <strong>cycle de vie</strong>&nbsp;: fermer puis rouvrir l'app retrouve la liste exactement dans l'état laissé.",
    ],
    criteres: [
      "L'application est <strong>utilisable entièrement hors-ligne</strong>&nbsp;: ajouter, cocher et modifier un article ne nécessite aucune connexion.",
      "La <strong>synchronisation</strong> est décrite et <strong>idempotente</strong>&nbsp;: rejouer la file après une coupure ne duplique ni ne perd de changement.",
      "Le <strong>conflit</strong> entre deux modifications concurrentes a une règle <strong>explicite</strong> et un comportement prévisible, pas un « ça dépend ».",
      "L'<strong>état de synchronisation</strong> est visible et exact&nbsp;: l'app n'affiche jamais « à jour » alors que des changements sont en attente.",
      "Les <strong>permissions</strong> demandées sont <strong>minimales et justifiées</strong>, et l'app fonctionne (en mode dégradé) si l'utilisateur les refuse.",
      "L'app respecte le <strong>cycle de vie</strong>&nbsp;: passage en arrière-plan, fermeture et réouverture ne perdent aucune donnée saisie.",
    ],
    pistes:
      "<p>Mobilise les leçons sur le <strong>stockage local</strong>, le <strong>réseau</strong>, le <strong>mode " +
      "hors ligne</strong>, l'<strong>état et sa remontée</strong>, les <strong>listes performantes</strong>, les " +
      "<strong>permissions</strong> et les <strong>notifications</strong>.</p>" +
      "<p>Commence par le plus important&nbsp;: décide que le <strong>stockage local est la source de vérité</strong> et que " +
      "le réseau n'est qu'un <em>miroir</em> qu'on rattrape plus tard. Dessine ensuite la <strong>file de synchronisation</strong> " +
      "et choisis ta <strong>règle de conflit</strong> avant d'écrire une ligne — c'est là que tout se joue. Illustre avec " +
      "l'écosystème que tu préfères (<a href=\"../swift/cours.html\">SwiftUI</a>, <a href=\"../kotlin/cours.html\">Compose</a> " +
      "ou <a href=\"../dart/cours.html\">Flutter</a>) et soigne l'<strong>ergonomie tactile</strong> avec les réflexes du " +
      "cours <a href=\"../ux/cours.html\">UX</a>. Termine par un scénario&nbsp;: «&nbsp;deux membres cochent le même article " +
      "hors-ligne, chacun de son côté&nbsp;» — montre ce que ton app fait à la reconnexion.</p>",
  },
  {
    id: "equipe-cartotroc",
    course: "equipe",
    courseTitle: "Travailler à plusieurs sur du code",
    dir: "equipe",
    accent: "equipe",
    type: "Projet d'organisation d'équipe",
    niveau: "Intermédiaire",
    titre: "Le kit de collaboration d'une équipe qui grandit",
    contexte:
      "<p><strong>Cartotroc</strong>, une plateforme de troc d'objets entre voisins, vient de passer de <strong>deux à cinq " +
      "développeurs</strong>. Tant qu'ils étaient deux, tout marchait à l'instinct&nbsp;: on poussait directement sur la branche " +
      "principale, personne ne relisait, la documentation tenait dans la tête d'une seule personne, et les rares pannes se " +
      "réglaient en s'accusant à voix haute. Depuis l'arrivée des trois nouveaux, c'est la friction permanente&nbsp;: des " +
      "changements qui s'écrasent, du code que personne d'autre n'ose toucher, les <strong>mêmes bugs qui reviennent</strong> " +
      "faute d'en tirer les leçons, et des recrues qui mettent des semaines à devenir utiles. L'équipe ne veut pas de " +
      "bureaucratie&nbsp;; elle veut un <strong>cadre léger</strong> qui rende le travail à plusieurs fluide.</p>",
    objectif:
      "<p>Ce projet ne consiste pas à coder une fonctionnalité, mais à <strong>outiller la collaboration</strong> de Cartotroc " +
      "avec les pratiques du cours. Tu dois produire le <strong>cadre</strong> qui manque&nbsp;: comment on propose un " +
      "changement, comment on le relit, comment on trace le <em>pourquoi</em>, comment on intègre un nouveau venu, et comment " +
      "on apprend d'un incident sans chercher de coupable. L'objectif est qu'un développeur qui rejoint l'équipe puisse, avec " +
      "ce seul kit, <strong>contribuer sereinement dès la première semaine</strong> — et que les frictions d'aujourd'hui " +
      "(écrasements, bugs qui reviennent, code opaque) deviennent l'exception.</p>",
    livrable:
      "Un « kit de collaboration » réutilisable&nbsp;: un jeu de documents et de conventions courts (guide de contribution, " +
      "modèles de demande de fusion et de message de commit, check-list de revue, guide d'intégration, modèle de post-mortem " +
      "et suivi de la dette), accompagné d'une note brève qui justifie chaque choix au regard des leçons du cours.",
    fonctionnalites: [
      "Un <strong>guide de contribution</strong> qui rend le cycle explicite&nbsp;: le chemin d'un changement (branche → demande de fusion → revue → fusion) et la <strong>taille attendue</strong> d'une demande (petite, ciblée, une seule chose).",
      "Un <strong>modèle de demande de fusion</strong> (quoi, pourquoi, comment tester, ce qu'elle ne fait pas volontairement) et un <strong>modèle de message de commit</strong> qui pousse à écrire l'intention, pas «&nbsp;maj&nbsp;».",
      "Une <strong>convention de style automatisée</strong>&nbsp;: le principe qu'un formateur tranche la mise en forme une fois pour toutes, et ce qui est délégué à l'outil plutôt que débattu en revue.",
      "Une <strong>check-list de revue</strong> qui aide à hiérarchiser les retours (bloquant / suggestion / question), rappelle de les formuler en questions et de relire le <strong>code</strong>, pas la personne.",
      "Un <strong>guide d'intégration</strong> pour un nouveau venu&nbsp;: par où commencer, qui solliciter, à quoi ressemble un bon «&nbsp;premier changement&nbsp;», comment aller chercher le contexte.",
      "Un <strong>modèle de post-mortem sans blâme</strong> (chronologie factuelle, causes multiples, actions concrètes) et un <strong>suivi de la dette technique</strong> visible, où atterrissent les actions.",
    ],
    criteres: [
      "Le <strong>cycle</strong> d'un changement est explicite&nbsp;: n'importe qui sait comment proposer, faire relire et fusionner, sans avoir à demander à chaque fois.",
      "Les <strong>modèles</strong> (demande de fusion, commit) poussent à dire le <strong>pourquoi</strong>, pas seulement le quoi&nbsp;: un lecteur dans six mois comprendrait la décision.",
      "Le <strong>style</strong> est traité comme <strong>automatisé</strong>&nbsp;: rien, dans la check-list de revue, n'invite à débattre d'indentation ou de virgules.",
      "La <strong>check-list de revue</strong> distingue la <strong>force</strong> des retours (bloquant vs suggestion vs question) et vise le code, jamais la personne.",
      "Le <strong>modèle de post-mortem</strong> est réellement <strong>sans blâme</strong>&nbsp;: il interroge le système et produit des actions <strong>assignées, datées et vérifiables</strong>.",
      "Un nouveau venu pourrait, avec ce <strong>kit seul</strong>, réussir sa première contribution sans déranger toute l'équipe&nbsp;: c'est le test ultime de sa clarté.",
    ],
    pistes:
      "<p>Mobilise les leçons sur la <strong>revue</strong>, l'<strong>automatisation du style</strong>, les <strong>messages " +
      "de commit</strong> et <strong>demandes de fusion</strong>, la <strong>documentation</strong>, l'<strong>intégration</strong>, " +
      "la <strong>dette technique</strong> et le <strong>post-mortem</strong>.</p>" +
      "<p>Commence par dessiner le <strong>cycle</strong> (le chemin d'un changement, du début à la fusion)&nbsp;: tout le reste " +
      "en découle. Écris ensuite les <strong>modèles</strong> qui rendent ce cycle facile à suivre, et garde tout <strong>court</strong> " +
      "— un kit qu'on lit d'une traite est un kit qu'on applique, un pavé finit ignoré. Appuie-toi sur " +
      "<a href=\"../git/cours.html\">Git</a> pour les branches et l'historique, sur <a href=\"../tests/cours.html\">les tests</a> " +
      "pour la confiance qui rend la revue rapide, et sur <a href=\"../cicd/cours.html\">la CI/CD</a> pour brancher le formatage, " +
      "les tests et le rollback. Termine par un test grandeur nature&nbsp;: fais relire ton kit par quelqu'un qui ne connaît pas " +
      "Cartotroc et demande-lui s'il saurait contribuer avec.</p>",
  },
  {
    id: "ml-churn",
    course: "ml",
    courseTitle: "Machine Learning",
    dir: "ml",
    accent: "ml",
    type: "Projet Machine Learning",
    niveau: "Intermédiaire",
    titre: "Prédire le départ des clients (churn)",
    contexte:
      "<p>Un service par abonnement constate que des clients résilient chaque mois. L'équipe veut " +
      "<strong>anticiper</strong> les départs pour agir à temps. On te confie un fichier <code>clients.csv</code> " +
      "(ancienneté, forfait, consommation, incidents, a-résilié) et on te demande un modèle qui <strong>prédit " +
      "le risque de départ</strong> d'un client.</p>",
    objectif:
      "<p>Mener un <strong>projet de classification de bout en bout</strong> avec scikit-learn : charger et préparer " +
      "les données, séparer entraînement/test, entraîner un modèle, l'évaluer honnêtement et conclure. " +
      "L'objectif est le <strong>workflow correct</strong>, pas le score parfait.</p>",
    livrable: "Un script (ou notebook) Python utilisant pandas et scikit-learn.",
    fonctionnalites: [
      "Le <strong>chargement</strong> et l'exploration du jeu de données (pandas : <code>head</code>, <code>describe</code>, valeurs manquantes).",
      "La <strong>préparation</strong> : gestion des manquants, encodage des colonnes catégorielles (one-hot), séparation X / y.",
      "Un découpage <strong>entraînement / test</strong> avec <code>train_test_split</code> (et <code>random_state</code> fixé).",
      "L'entraînement d'un <strong>classifieur</strong> (régression logistique ou forêt aléatoire).",
      "Une <strong>évaluation</strong> : exactitude, matrice de confusion, et surtout le rappel de la classe « part ».",
      "Une comparaison entraînement / test pour détecter un éventuel <strong>surapprentissage</strong>.",
    ],
    criteres: [
      "Les données sont préparées <strong>sans fuite</strong> (la préparation s'apprend sur l'entraînement).",
      "Le modèle est entraîné avec <code>fit</code> et évalué sur le <strong>jeu de test</strong>, jamais sur l'entraînement seul.",
      "L'évaluation regarde la <strong>matrice de confusion</strong> et le rappel, pas que l'exactitude (classes déséquilibrées).",
      "Les colonnes catégorielles sont <strong>encodées</strong> (one-hot) et non laissées en texte.",
      "Le code est reproductible : <code>random_state</code> fixé, étapes commentées.",
      "Une courte conclusion interprète les résultats (le modèle est-il utile ? que regarder ensuite ?).",
    ],
    pistes:
      "<p>Mobilise les leçons sur le <strong>workflow ML</strong>, la <strong>préparation des données</strong>, la " +
      "<strong>classification</strong> et l'<strong>évaluation</strong>. Un <code>Pipeline</code> (mise à l'échelle + modèle) " +
      "évite proprement la fuite de données.</p>" +
      "<p>Commence simple (une régression logistique), mesure, puis essaie une forêt aléatoire et compare. " +
      "Surveille le <strong>rappel</strong> de la classe minoritaire : rater un client qui part coûte plus cher qu'une fausse alerte.</p>",
  },
  {
    id: "kubernetes-deploy",
    course: "kubernetes",
    courseTitle: "Kubernetes",
    dir: "kubernetes",
    accent: "kubernetes",
    type: "Déploiement Kubernetes",
    niveau: "Intermédiaire",
    titre: "Déployer une application web résiliente",
    contexte:
      "<p>Une petite équipe a conteneurisé son application web et veut la faire tourner <strong>de façon fiable</strong> " +
      "sur un cluster : plusieurs répliques, configuration externalisée, exposition réseau et auto-réparation. " +
      "On te demande d'écrire les <strong>manifestes Kubernetes</strong> qui décrivent ce déploiement, testables sur " +
      "un cluster local (minikube ou kind).</p>",
    objectif:
      "<p>Décrire en <strong>YAML déclaratif</strong> une application complète : un déploiement répliqué, sa " +
      "configuration, son exposition par un service et ses sondes de santé. L'objectif est d'assembler correctement " +
      "les ressources de base et de raisonner en <strong>état désiré</strong>.</p>",
    livrable: "Un ensemble de manifestes YAML (Deployment, Service, ConfigMap) appliqués avec kubectl.",
    fonctionnalites: [
      "Un <strong>Deployment</strong> avec au moins 3 répliques d'une image (ex. un serveur web).",
      "Une <strong>ConfigMap</strong> injectée dans les conteneurs (variables d'environnement).",
      "Un <strong>Service</strong> qui cible les pods par leurs labels et publie un port.",
      "Des <strong>sondes</strong> liveness et readiness sur les conteneurs.",
      "Des <strong>requests / limits</strong> de ressources (CPU, mémoire).",
      "Une démonstration d'<strong>auto-réparation</strong> (supprimer un pod, le voir recréé) et de mise à l'échelle (<code>kubectl scale</code>).",
    ],
    criteres: [
      "Le <code>selector</code> du Service correspond aux <strong>labels</strong> des pods du Deployment.",
      "La configuration est <strong>externalisée</strong> (ConfigMap), pas codée en dur dans l'image.",
      "Les sondes <strong>liveness</strong> et <strong>readiness</strong> sont définies et cohérentes.",
      "Le Deployment maintient son nombre de <strong>répliques</strong> (auto-réparation vérifiée).",
      "Les manifestes s'appliquent sans erreur avec <code>kubectl apply -f</code>.",
      "Aucune donnée sensible n'est en clair dans une ConfigMap (utiliser un Secret le cas échéant).",
    ],
    pistes:
      "<p>Mobilise les leçons sur les <strong>pods</strong>, les <strong>déploiements</strong>, les <strong>services</strong>, " +
      "la <strong>configuration</strong> et les <strong>sondes</strong>. Démarre un cluster local avec <code>minikube start</code>.</p>" +
      "<p>Procède par étapes : un Deployment qui tourne, puis le Service pour l'exposer, puis la ConfigMap, puis les " +
      "sondes et les ressources. Vérifie à chaque étape avec <code>kubectl get</code> et <code>kubectl describe</code>.</p>",
  },
  {
    id: "graphql-api",
    course: "graphql",
    courseTitle: "GraphQL",
    dir: "graphql",
    accent: "graphql",
    type: "API GraphQL",
    niveau: "Intermédiaire",
    titre: "L'API GraphQL d'une médiathèque",
    contexte:
      "<p>Une médiathèque veut exposer son catalogue à ses applications (web, mobile) sans multiplier les points " +
      "d'accès ni sur-charger les réponses. On te demande de concevoir une <strong>API GraphQL</strong> permettant " +
      "de consulter les livres et leurs auteurs, et d'en ajouter — avec un schéma typé et des résolveurs.</p>",
    objectif:
      "<p>Construire une <strong>API GraphQL complète</strong> : un schéma typé (types, requêtes, mutations) et les " +
      "résolveurs qui le relient aux données. L'objectif est d'enchaîner correctement schéma → résolveurs → test.</p>",
    livrable: "Un serveur GraphQL (schéma + résolveurs), par ex. avec Apollo Server sur Node.js.",
    fonctionnalites: [
      "Des <strong>types</strong> <code>Book</code> et <code>Author</code> avec leurs champs typés et la relation entre eux.",
      "Des <strong>queries</strong> : lister les livres, en lire un par identifiant, lister les livres d'un auteur.",
      "Une <strong>mutation</strong> d'ajout de livre utilisant un <strong>input type</strong>.",
      "Des <strong>résolveurs</strong> pour chaque champ racine et pour la relation auteur → livres.",
      "L'usage de <strong>variables</strong> et d'<strong>arguments</strong> dans les requêtes de test.",
      "Un jeu de requêtes de démonstration (lecture + écriture) testées dans un explorateur.",
    ],
    criteres: [
      "Le <strong>schéma</strong> déclare les types, le type <code>Query</code> et le type <code>Mutation</code>.",
      "Les champs non nuls portent <code>!</code> à bon escient ; les listes garanties sont bien typées.",
      "La mutation reçoit un <strong>input type</strong> (pas un type de sortie) et <strong>renvoie</strong> l'objet créé.",
      "Chaque champ racine et la relation auteur → livres ont un <strong>résolveur</strong>.",
      "Les requêtes de test utilisent des <strong>variables</strong> plutôt que des valeurs codées en dur.",
      "Une requête ne renvoie que les champs demandés (pas de sur-récupération).",
    ],
    pistes:
      "<p>Mobilise les leçons sur le <strong>schéma &amp; les types</strong>, les <strong>queries</strong>, les " +
      "<strong>mutations</strong> et les <strong>résolveurs</strong>. Pour rester en file://, des données en mémoire " +
      "(un tableau) suffisent comme source.</p>" +
      "<p>Commence par le schéma (le contrat), puis écris les résolveurs un par un, et teste au fur et à mesure dans " +
      "l'explorateur intégré (Apollo Sandbox / GraphiQL). Pense au <strong>problème N+1</strong> sur la relation.</p>",
  },
  {
    id: "llm-tri-tickets",
    course: "llm",
    courseTitle: "Développer avec l'IA & les LLM",
    dir: "llm",
    accent: "llm",
    type: "Application IA",
    niveau: "Intermédiaire",
    titre: "Un assistant de tri de tickets de support",
    contexte:
      "<p>Un service client reçoit des centaines de messages par jour. On te demande un petit service qui, pour " +
      "chaque message, renvoie une <strong>catégorie</strong> et une <strong>priorité</strong> exploitables par le " +
      "logiciel de support — donc une sortie <strong>structurée et fiable</strong>, pas du texte libre.</p>",
    objectif:
      "<p>Assembler les briques du cours en une <strong>petite application IA</strong> : un prompt soigné, un appel " +
      "d'API de LLM, une <strong>sortie JSON validée</strong> et des garde-fous. L'objectif est la <strong>fiabilité</strong> " +
      "de bout en bout, clé d'API protégée comprise.</p>",
    livrable: "Un script (ou petit service back-end) qui classe un message en JSON validé.",
    fonctionnalites: [
      "Un <strong>message système</strong> précis qui impose le schéma de sortie (catégorie, priorité) et interdit le texte autour.",
      "Un <strong>appel d'API</strong> de LLM avec la clé lue depuis une <strong>variable d'environnement</strong>.",
      "Une <strong>température basse</strong> pour des classements stables et répétables.",
      "La <strong>validation</strong> de la sortie : parser le JSON et vérifier les valeurs autorisées.",
      "Une <strong>gestion d'erreur</strong> si la réponse n'est pas un JSON conforme.",
      "Quelques messages d'exemple traités, avec leur résultat.",
    ],
    criteres: [
      "La <strong>clé d'API</strong> n'est jamais en dur dans le code ni exposée côté navigateur.",
      "La sortie est un <strong>JSON</strong> conforme à un schéma fixé, et elle est <strong>validée</strong> côté code.",
      "La <strong>température</strong> est basse (déterminisme) pour une tâche de classification.",
      "Les valeurs de catégorie et de priorité sont <strong>contrôlées</strong> (liste fermée).",
      "Le code <strong>gère l'échec</strong> (réponse non JSON) sans planter.",
      "Le prompt délimite clairement le message à traiter (donnée) des instructions.",
    ],
    pistes:
      "<p>Mobilise les leçons sur le <strong>prompt</strong>, l'<strong>appel d'API</strong>, les <strong>sorties " +
      "structurées</strong> et l'architecture d'une <strong>app IA</strong>. Le message système fixe le format ; le code valide.</p>" +
      "<p>Pour aller plus loin : ajoute une troisième sortie (un court <em>résumé</em> du ticket), ou branche un peu de " +
      "<strong>RAG</strong> pour suggérer une réponse type à partir d'une FAQ interne.</p>",
  },
  {
    id: "a11y-audit",
    course: "a11y",
    courseTitle: "Accessibilité web (a11y)",
    dir: "a11y",
    accent: "a11y",
    type: "Audit & correction d'accessibilité",
    niveau: "Intermédiaire",
    titre: "Rendre accessible une page existante",
    contexte:
      "<p>Une petite association a un site « qui marche » mais que plusieurs visiteurs n'arrivent pas à utiliser : " +
      "navigation impossible au clavier, images sans description, texte gris pâle illisible. On te confie une page " +
      "(la tienne ou une page simple que tu recrées) avec pour mission de la rendre <strong>accessible</strong>.</p>",
    objectif:
      "<p>Mener un <strong>audit d'accessibilité</strong> puis <strong>corriger</strong> les problèmes : sémantique, " +
      "navigation clavier, alternatives textuelles, contrastes et focus. Viser le niveau <strong>WCAG AA</strong>.</p>",
    livrable: "Une page web corrigée + une courte liste des problèmes trouvés et des corrections apportées.",
    fonctionnalites: [
      "Un <strong>audit</strong> initial (Lighthouse ou axe DevTools) et un test au <strong>clavier</strong>.",
      "Une structure <strong>sémantique</strong> avec repères (<code>header</code>, <code>nav</code>, <code>main</code>, <code>footer</code>) et titres hiérarchisés.",
      "Des <strong>textes alternatifs</strong> pertinents sur les images.",
      "Des <strong>formulaires</strong> avec <code>label</code> liés, et tout utilisable au clavier (focus visible).",
      "Des <strong>contrastes</strong> de couleur conformes (texte/fond).",
      "Un <strong>lien d'évitement</strong> vers le contenu principal.",
    ],
    criteres: [
      "La page se parcourt <strong>entièrement au clavier</strong>, dans un ordre logique, avec un focus toujours visible.",
      "Les images ont un <code>alt</code> adapté (vide si décoratives).",
      "Les champs de formulaire ont un <strong>libellé</strong> associé (<code>for</code>/<code>id</code>).",
      "Les <strong>contrastes</strong> texte/fond atteignent le seuil AA.",
      "La structure utilise des <strong>repères</strong> et une hiérarchie de titres correcte (un seul <code>h1</code>).",
      "Un audit automatique ne remonte plus d'erreur bloquante, et un test clavier confirme l'usage.",
    ],
    pistes:
      "<p>Mobilise les leçons sur la <strong>sémantique</strong>, le <strong>clavier</strong>, les <strong>formulaires</strong>, " +
      "<strong>ARIA</strong> et les <strong>contrastes</strong>. Commence par un audit pour prioriser, corrige, puis re-teste.</p>" +
      "<p>Privilégie toujours l'<strong>élément HTML natif</strong> avant ARIA. Garde une trace « avant / après » de chaque " +
      "correction : c'est ton livrable autant que la page elle-même.</p>",
  },
  {
    id: "perf-web-audit",
    course: "perf-web",
    courseTitle: "Performance & SEO web",
    dir: "perf-web",
    accent: "perf-web",
    type: "Audit & optimisation web",
    niveau: "Intermédiaire",
    titre: "Accélérer et référencer un site",
    contexte:
      "<p>Une page vitrine met « une éternité » à s'afficher sur mobile et n'apparaît pas dans les résultats de " +
      "recherche. On te confie cette page (la tienne ou une page simple que tu recrées, volontairement non optimisée) " +
      "avec pour mission de la rendre <strong>rapide</strong> et <strong>trouvable</strong>.</p>",
    objectif:
      "<p>Mener un <strong>audit Lighthouse</strong>, corriger les principaux freins de <strong>performance</strong> " +
      "(images, JavaScript, cache) et poser les bases du <strong>SEO technique</strong> (métadonnées, sitemap, robots). " +
      "Mesurer le gain avant/après.</p>",
    livrable: "Une page optimisée + un court rapport « avant / après » des scores et des corrections.",
    fonctionnalites: [
      "Un <strong>audit Lighthouse</strong> initial (performance + SEO), bridé mobile.",
      "L'<strong>optimisation des images</strong> (format, compression, dimensions réservées, lazy-loading).",
      "La réduction du coût <strong>JavaScript</strong> (différer/charger moins, supprimer l'inutile).",
      "La mise en place du <strong>cache</strong> des ressources statiques.",
      "Les <strong>métadonnées</strong> SEO (title, meta description, balises Open Graph).",
      "Un <strong>sitemap</strong> et un <strong>robots.txt</strong> cohérents.",
    ],
    criteres: [
      "Les <strong>Web Vitals</strong> s'améliorent nettement entre l'audit initial et final (LCP, CLS, INP).",
      "Les <strong>images</strong> sont optimisées et leurs dimensions réservées (pas de saut de mise en page).",
      "Le <strong>chemin critique</strong> est allégé (JS différé, ressources inutiles retirées).",
      "Chaque page a un <strong>title</strong> et une <strong>meta description</strong> uniques et pertinents.",
      "Un <strong>sitemap.xml</strong> et un <strong>robots.txt</strong> valides sont présents.",
      "Le rapport montre les scores <strong>avant / après</strong> et les corrections apportées.",
    ],
    pistes:
      "<p>Mobilise les leçons sur les <strong>Web Vitals</strong>, l'<strong>optimisation du chargement</strong>, le " +
      "<strong>rendu</strong>, le <strong>SEO technique</strong> et les <strong>données structurées</strong>. " +
      "Commence par mesurer (Lighthouse bridé), corrige le plus gros frein, puis re-mesure.</p>" +
      "<p>Concentre-toi d'abord sur les <strong>images</strong> et le <strong>JavaScript</strong> : c'est presque " +
      "toujours le meilleur rapport effort/gain. Le SEO technique vient ensuite, une fois la page saine.</p>",
  },
  {
    id: "cloud-archi",
    course: "cloud",
    courseTitle: "Cloud & déploiement",
    dir: "cloud",
    accent: "cloud",
    type: "Conception d'architecture cloud",
    niveau: "Intermédiaire",
    titre: "Concevoir l'hébergement cloud d'une application",
    contexte:
      "<p>Une jeune entreprise lance une application web (front + API + base de données) et doit choisir <strong>comment " +
      "l'héberger</strong> dans le cloud, sans se ruiner ni se complexifier la vie. On te demande de proposer une " +
      "<strong>architecture cloud</strong> raisonnée et de la documenter — un travail de conception, pas de facturation réelle.</p>",
    objectif:
      "<p>Concevoir (sur le papier ou en schéma) le <strong>déploiement cloud</strong> d'une application : choix du " +
      "<strong>modèle de service</strong>, du <strong>calcul</strong>, du <strong>stockage</strong> et de la " +
      "<strong>base</strong>, de la <strong>région</strong>, avec une estimation de <strong>coût</strong> et les bases de la <strong>sécurité</strong>.</p>",
    livrable: "Un document (ou schéma) d'architecture cloud commenté, indépendant du fournisseur.",
    fonctionnalites: [
      "Le choix d'un <strong>modèle de service</strong> (IaaS/PaaS/serverless) justifié pour chaque composant.",
      "L'option de <strong>calcul</strong> (VM, conteneurs, serverless) adaptée à l'application.",
      "Le <strong>stockage</strong> (objet pour les fichiers) et une <strong>base de données gérée</strong>.",
      "Le choix d'une <strong>région</strong> et une réflexion sur la <strong>disponibilité</strong>.",
      "Une <strong>estimation de coût</strong> grossière et des leviers pour la maîtriser.",
      "Les bases de la <strong>sécurité</strong> : gestion des accès (IAM, moindre privilège), secrets.",
    ],
    criteres: [
      "Chaque composant a un <strong>modèle de service</strong> et un type de <strong>calcul</strong> justifiés.",
      "Le <strong>stockage</strong> et la <strong>base</strong> sont adaptés (objet pour les fichiers, base gérée).",
      "La <strong>région</strong> est choisie (latence, données) et la <strong>résilience</strong> évoquée.",
      "Une <strong>estimation de coût</strong> est fournie, avec des pistes d'optimisation.",
      "La <strong>sécurité</strong> applique le <strong>moindre privilège</strong> (IAM) et protège les secrets.",
      "Le document reste <strong>indépendant du fournisseur</strong> (concepts, pas noms commerciaux).",
    ],
    pistes:
      "<p>Mobilise les leçons sur les <strong>modèles de service</strong>, le <strong>calcul</strong>, le " +
      "<strong>stockage</strong> et les <strong>bases gérées</strong>, les <strong>coûts</strong> et l'<strong>IAM</strong>. " +
      "Pars des besoins réels de l'app avant de choisir les briques.</p>" +
      "<p>Préfère les <strong>services gérés</strong> quand l'équipe est petite (moins d'exploitation), et chiffre " +
      "le coût avant de t'engager. Note aussi le risque de <strong>verrouillage</strong> (lock-in) de chaque choix.</p>",
  },
  {
    id: "iac-infra",
    course: "iac",
    courseTitle: "Infrastructure as Code",
    dir: "iac",
    accent: "iac",
    type: "Infrastructure as Code",
    niveau: "Intermédiaire",
    titre: "Décrire une infrastructure en Terraform",
    contexte:
      "<p>Une équipe en a assez de configurer ses environnements « à la main » : chacun diverge, rien n'est " +
      "reproductible. On te demande de <strong>décrire son infrastructure en code</strong> (Terraform) pour pouvoir " +
      "la recréer à l'identique et la faire évoluer par revue de code.</p>",
    objectif:
      "<p>Écrire une configuration <strong>Terraform</strong> qui décrit une petite infrastructure (de façon " +
      "déclarative), paramétrée par des <strong>variables</strong>, factorisée en <strong>module</strong>, et " +
      "déclinable en plusieurs <strong>environnements</strong>. Cours conceptuel : pas de cloud réel requis.</p>",
    livrable: "Un dossier Terraform (.tf) : ressources, variables, outputs, un module, et deux environnements.",
    fonctionnalites: [
      "Un <strong>provider</strong> et plusieurs <strong>ressources</strong> déclarées (calcul, stockage, réseau…).",
      "Des <strong>variables</strong> d'entrée (région, taille, noms) et des <strong>outputs</strong> utiles.",
      "Un <strong>module</strong> réutilisable regroupant un ensemble cohérent de ressources.",
      "Deux <strong>environnements</strong> (test / prod) à partir du même code, paramétré différemment.",
      "Une gestion propre du <strong>state</strong> (et l'idée de le stocker à distance, partagé).",
      "Un cycle <code>plan</code> / <code>apply</code> décrit, et la prise en compte de la <strong>dérive</strong>.",
    ],
    criteres: [
      "La configuration est <strong>déclarative</strong> et <strong>idempotente</strong> (réappliquer ne change rien d'inutile).",
      "Les valeurs variables sont des <strong>variables</strong>, pas codées en dur.",
      "Un <strong>module</strong> factorise un ensemble réutilisable de ressources.",
      "Les <strong>environnements</strong> partagent le code et ne diffèrent que par les variables.",
      "Le <strong>state</strong> est géré proprement (idéalement distant et verrouillé).",
      "Aucun <strong>secret</strong> n'est en dur dans le code ; tout changement passe par le code (pas la console).",
    ],
    pistes:
      "<p>Mobilise les leçons sur les <strong>providers/ressources</strong>, les <strong>variables/state</strong>, le " +
      "cycle <strong>plan/apply</strong>, les <strong>modules</strong> et les <strong>environnements</strong>. " +
      "Commence petit (une ressource), vérifie le <code>plan</code>, puis enrichis.</p>" +
      "<p>Évite toute modification manuelle dans la console une fois l'IaC en place (sinon : dérive). La source de " +
      "vérité, c'est le <strong>code</strong>. Ce projet prolonge le fil rouge DevOps (conteneur → cluster → CI/CD → infra).</p>",
  },
  {
    id: "archi-conception",
    course: "archi",
    courseTitle: "Architecture logicielle",
    dir: "archi",
    accent: "archi",
    type: "Conception d'architecture",
    niveau: "Intermédiaire",
    titre: "Concevoir l'architecture d'une application",
    contexte:
      "<p>Une application (par exemple une boutique en ligne, ou un gestionnaire de tâches collaboratif) doit être " +
      "<strong>structurée</strong> avant d'être codée — ou re-structurée parce qu'elle est devenue ingérable. On te " +
      "demande d'en <strong>concevoir l'architecture</strong> : découpe, responsabilités, dépendances, style, et de " +
      "justifier chaque choix.</p>",
    objectif:
      "<p>Produire un <strong>dossier d'architecture</strong> (texte + diagrammes) : organiser l'application en " +
      "<strong>couches</strong>/composants aux responsabilités claires, viser un <strong>faible couplage</strong> et " +
      "une <strong>forte cohésion</strong>, choisir un <strong>style</strong> (monolithe modulaire, etc.) et isoler le " +
      "<strong>domaine</strong> des détails techniques.</p>",
    livrable: "Un document d'architecture : diagramme(s), responsabilités des parties, et décisions justifiées (ADR).",
    fonctionnalites: [
      "Une <strong>découpe</strong> en couches/composants avec le rôle de chacun.",
      "Un schéma des <strong>dépendances</strong> (qui dépend de qui), orientées vers le cœur métier.",
      "Le choix d'un <strong>style</strong> (monolithe modulaire, hexagonal…) justifié par le contexte.",
      "L'<strong>isolation du domaine</strong> (règles métier) vis-à-vis de la base et des frameworks.",
      "Quelques <strong>ADR</strong> (décisions d'architecture) écrites : choix et raisons.",
      "Une réflexion sur la <strong>testabilité</strong> et l'<strong>évolution</strong> future.",
    ],
    criteres: [
      "Chaque partie a une <strong>responsabilité claire et unique</strong> (forte cohésion).",
      "Le <strong>couplage</strong> est faible ; les dépendances pointent vers le <strong>domaine</strong>.",
      "Le <strong>style</strong> retenu est justifié par le contexte (taille, équipe, besoins), sans sur-ingénierie.",
      "Le <strong>domaine</strong> ne dépend pas des détails techniques (base, framework, UI).",
      "Les <strong>décisions</strong> structurantes sont documentées (ADR) avec leurs raisons.",
      "L'architecture reste <strong>simple</strong> : pas plus de complexité que le besoin réel.",
    ],
    pistes:
      "<p>Mobilise les leçons sur les <strong>couches</strong>, le <strong>couplage/cohésion</strong>, le choix " +
      "<strong>monolithe vs microservices</strong>, la <strong>clean/hexagonale</strong> et le <strong>DDD</strong>. " +
      "Pars des besoins, pas d'un style à la mode.</p>" +
      "<p>Privilégie le <strong>plus simple qui répond au besoin actuel</strong> tout en restant évolutif (souvent un " +
      "monolithe bien modularisé). Documente chaque décision structurante : ton dossier vaut autant que le futur code.</p>",
  },
  {
    id: "wasm-module",
    course: "wasm",
    courseTitle: "WebAssembly",
    dir: "wasm",
    accent: "wasm",
    type: "Module Wasm + page web",
    niveau: "Intermédiaire",
    titre: "Accélérer un calcul avec WebAssembly",
    contexte:
      "<p>Une page web doit faire un <strong>calcul intensif</strong> côté navigateur — par exemple un filtre sur une " +
      "image, le calcul de nombres premiers, ou une simulation. En JavaScript pur, ça rame. On te demande de confier " +
      "ce calcul à un <strong>module WebAssembly</strong>, et de mesurer le gain.</p>",
    objectif:
      "<p>Écrire une petite fonction de calcul en <strong>C ou en Rust</strong>, la <strong>compiler en " +
      "<code>.wasm</code></strong>, la <strong>charger depuis JavaScript</strong> et l'appeler. JS pilote la page et " +
      "l'interface, Wasm fait le gros du calcul ; les deux échangent des données.</p>",
    livrable: "Une page servie en local qui appelle un module .wasm pour un calcul, avec une comparaison JS vs Wasm.",
    fonctionnalites: [
      "Une <strong>fonction de calcul</strong> écrite dans un langage compilable vers Wasm (C, Rust…).",
      "Une <strong>compilation</strong> vers un fichier <code>.wasm</code> via la chaîne d'outils adaptée.",
      "Le <strong>chargement</strong> et l'<strong>instanciation</strong> du module depuis JavaScript.",
      "L'<strong>appel</strong> de la fonction exportée et l'affichage du résultat dans la page.",
      "Un échange de <strong>données</strong> JS ⇄ Wasm (au moins des nombres ; idéalement la mémoire pour un tableau).",
      "Une <strong>mesure</strong> comparant la version JavaScript et la version WebAssembly.",
    ],
    criteres: [
      "Le module <strong>.wasm</strong> est bien chargé et instancié, sans erreur en console.",
      "La fonction exportée est <strong>appelée depuis JS</strong> et renvoie le bon résultat.",
      "Le calcul lourd est <strong>réellement délégué</strong> à Wasm, pas refait en JS.",
      "La page est servie via un <strong>serveur local</strong> (pas en <code>file://</code>) et fonctionne.",
      "Le choix de Wasm est <strong>justifié</strong> par une mesure : le calcul est bien le goulot d'étranglement.",
      "Le rôle de chacun est clair : <strong>JS orchestre</strong>, <strong>Wasm calcule</strong>.",
    ],
    pistes:
      "<p>Commence par une fonction simple (somme, factorielle, test de primalité), fais-la marcher en C/Rust, puis " +
      "compile-la (Emscripten pour C, <code>wasm-pack</code> pour Rust). Charge le <code>.wasm</code> avec " +
      "<code>WebAssembly.instantiateStreaming</code> et appelle <code>instance.exports</code>.</p>" +
      "<p>Ne porte en Wasm que la <strong>partie qui compte</strong> : mesure d'abord en JS, repère le goulot, puis " +
      "compare. Garde le DOM et l'interface en JavaScript. Ce projet prolonge le cours et le complète bien avec " +
      "<a href=\"../perf-web/cours.html\">Performance web</a>.</p>",
  },
  {
    id: "linux-serveur",
    course: "linux",
    courseTitle: "Linux & administration système",
    dir: "linux",
    accent: "linux",
    type: "Mise en service d'un serveur",
    niveau: "Intermédiaire",
    titre: "Mettre en service un petit serveur Linux",
    contexte:
      "<p>On te confie une machine Linux toute nue (une VM, un conteneur ou un petit serveur cloud) et on te demande d'y " +
      "<strong>mettre en service une application</strong> simple, proprement : utilisateur dédié, application installée, " +
      "service géré, accès distant sécurisé.</p>",
    objectif:
      "<p>Partir d'un système vierge et le <strong>préparer</strong> pour héberger une petite application&nbsp;: organiser les " +
      "fichiers, créer un <strong>utilisateur</strong> non privilégié, installer les <strong>paquets</strong> nécessaires, " +
      "lancer l'application comme un <strong>service</strong> et te connecter en <strong>SSH</strong> en sécurité.</p>",
    livrable: "Un serveur Linux où une petite application tourne comme un service, accessible en SSH, documenté en quelques notes.",
    fonctionnalites: [
      "Un <strong>utilisateur</strong> dédié non privilégié (on n'opère pas en root au quotidien).",
      "L'installation des <strong>paquets</strong> nécessaires via le gestionnaire de la distribution.",
      "L'application lancée et supervisée comme un <strong>service</strong> (systemd), démarrée au boot.",
      "Une connexion <strong>SSH</strong> par clé (mot de passe désactivé si possible).",
      "Des <strong>permissions</strong> de fichiers correctes (ni trop ouvertes, ni bloquantes).",
      "La consultation des <strong>journaux</strong> pour vérifier que tout fonctionne.",
    ],
    criteres: [
      "L'application tourne comme un <strong>service</strong> et redémarre automatiquement au boot.",
      "On administre via un <strong>utilisateur dédié</strong> et <code>sudo</code>, pas en root permanent.",
      "L'accès <strong>SSH</strong> est sécurisé (clé plutôt que mot de passe).",
      "Les <strong>permissions</strong> des fichiers sont justes (principe du moindre privilège).",
      "Les <strong>journaux</strong> confirment le bon fonctionnement (et aident en cas d'erreur).",
      "Quelques <strong>notes</strong> documentent ce qui a été fait (reproductible).",
    ],
    pistes:
      "<p>Procède par étapes&nbsp;: mets à jour les paquets, crée l'utilisateur, installe l'application, écris (ou adapte) " +
      "un service systemd, puis configure SSH. Vérifie chaque étape avec les <strong>journaux</strong> avant de passer à la " +
      "suivante.</p>" +
      "<p>Pense « moindre privilège » partout&nbsp;: pas de root inutile, des permissions serrées, un accès distant par clé. " +
      "Ce projet prolonge naturellement <a href=\"../bash/cours.html\">Bash</a> et prépare le terrain pour " +
      "<a href=\"../docker/cours.html\">Docker</a> et le <a href=\"../cloud/cours.html\">cloud</a>.</p>",
  },
  {
    id: "reseaux-trace",
    course: "reseaux",
    courseTitle: "Réseaux : comment marche Internet",
    dir: "reseaux",
    accent: "reseaux",
    type: "Analyse réseau",
    niveau: "Intermédiaire",
    titre: "Tracer le voyage d'une requête web",
    contexte:
      "<p>Quand tu tapes une adresse dans ton navigateur, une cascade d'événements réseau se déclenche en quelques " +
      "millisecondes. On te demande de <strong>décortiquer ce voyage</strong>, couche par couche, pour un site de ton choix, " +
      "et d'en faire un compte rendu clair.</p>",
    objectif:
      "<p>Suivre une requête HTTP <strong>de bout en bout</strong>&nbsp;: la <strong>résolution DNS</strong> du nom en adresse IP, " +
      "le <strong>chemin</strong> des paquets (routage), l'<strong>ouverture de la connexion</strong> (TCP + port), la " +
      "<strong>poignée de main TLS</strong>, puis l'échange <strong>HTTP</strong> — en reliant chaque étape à sa couche.</p>",
    livrable: "Un compte rendu (schéma + notes) du trajet complet d'une requête, de la saisie de l'URL à l'affichage.",
    fonctionnalites: [
      "La <strong>résolution DNS</strong> du domaine en adresse IP (avec un outil comme <code>dig</code>/<code>nslookup</code>).",
      "Le <strong>chemin réseau</strong> vers le serveur (avec <code>traceroute</code>/<code>tracert</code>).",
      "L'identification du <strong>port</strong> et du <strong>protocole de transport</strong> (TCP, 443).",
      "Le repérage de la <strong>poignée de main TLS</strong> et du certificat.",
      "L'échange <strong>HTTP</strong> (méthode, code de statut, en-têtes principaux).",
      "Un <strong>schéma en couches</strong> reliant chaque étape à son niveau réseau.",
    ],
    criteres: [
      "Chaque étape est <strong>reliée à sa couche</strong> (application/transport/Internet/lien).",
      "La <strong>résolution DNS</strong> est observée et expliquée (nom → IP).",
      "Le <strong>chemin</strong> des paquets est tracé et commenté.",
      "La distinction <strong>TCP/port</strong> et <strong>TLS</strong> est claire.",
      "Le <strong>schéma</strong> rend le trajet compréhensible d'un coup d'œil.",
      "Le compte rendu permet de <strong>diagnostiquer</strong> où un problème se situerait.",
    ],
    pistes:
      "<p>Utilise les outils du terminal (<code>dig</code>, <code>ping</code>, <code>traceroute</code>) et l'onglet " +
      "« Réseau » des outils de développement du navigateur pour observer concrètement chaque étape. Note ce que tu vois.</p>" +
      "<p>Garde la <strong>grille des couches</strong> comme fil conducteur&nbsp;: chaque observation se range à un niveau. " +
      "Ce projet complète très bien le cours <a href=\"../http/cours.html\">HTTP</a>.</p>",
  },
  {
    id: "ux-refonte",
    course: "ux",
    courseTitle: "UX & design d'interface",
    dir: "ux",
    accent: "ux",
    type: "Refonte d'interface",
    niveau: "Débutant",
    titre: "Repenser l'écran d'une application",
    contexte:
      "<p>On te confie un écran existant jugé « confus » ou « pas terrible » (un formulaire d'inscription, un tableau de " +
      "bord, une page de paramètres…). On te demande de le <strong>repenser</strong> pour le rendre plus clair et agréable, " +
      "en justifiant chaque choix par l'expérience utilisateur — pas par le goût.</p>",
    objectif:
      "<p>Améliorer un écran en appliquant les principes du cours&nbsp;: identifier l'<strong>utilisateur</strong> et son " +
      "<strong>but</strong>, clarifier la <strong>hiérarchie visuelle</strong>, soigner <strong>couleur</strong> et " +
      "<strong>typographie</strong>, et rendre les <strong>interactions</strong> et <strong>états</strong> compréhensibles.</p>",
    livrable: "Un avant/après (maquette ou page) de l'écran repensé, accompagné des décisions de design justifiées.",
    fonctionnalites: [
      "Une analyse de l'<strong>utilisateur</strong> et de son <strong>but</strong> sur cet écran.",
      "Une <strong>hiérarchie visuelle</strong> claire (l'action principale saute aux yeux).",
      "Des choix de <strong>couleur</strong> et de <strong>typographie</strong> cohérents et lisibles.",
      "Des <strong>retours</strong> et <strong>états</strong> explicites (chargement, succès, erreur, vide).",
      "Une attention à l'<strong>accessibilité</strong> (contrastes, libellés, navigation clavier).",
      "Un <strong>avant/après</strong> commenté qui justifie chaque changement.",
    ],
    criteres: [
      "L'<strong>action principale</strong> de l'écran est immédiatement identifiable.",
      "La <strong>hiérarchie</strong> guide l'œil ; rien d'important n'est noyé.",
      "Couleur et typographie servent la <strong>lisibilité</strong> et la <strong>cohérence</strong>.",
      "Les <strong>états</strong> (erreur, chargement, vide) sont prévus et clairs.",
      "Chaque choix est <strong>justifié</strong> par l'utilisateur, pas par le goût personnel.",
      "L'écran reste <strong>accessible</strong> (contrastes suffisants, libellés clairs).",
    ],
    pistes:
      "<p>Commence par écrire&nbsp;: <em>qui</em> utilise cet écran et <em>pour quoi</em>. Repère ensuite l'action " +
      "principale et assure-toi qu'elle domine visuellement. Réduis le superflu (« moins, mais mieux »).</p>" +
      "<p>Teste mentalement le parcours&nbsp;: où l'utilisateur pourrait-il hésiter ? Ajoute des retours à chaque action. " +
      "Ce projet se marie très bien avec l'<a href=\"../a11y/cours.html\">accessibilité</a> et le <a href=\"../css/cours.html\">CSS</a>.</p>",
  },
  {
    id: "observabilite-instrumenter",
    course: "observabilite",
    courseTitle: "Observabilité & SRE",
    dir: "observabilite",
    accent: "observabilite",
    type: "Plan d'observabilité",
    niveau: "Intermédiaire",
    titre: "Rendre une application observable",
    contexte:
      "<p>Une application tourne en production (un service web, une API…) mais c'est une <strong>boîte noire</strong> : quand " +
      "ça ralentit ou casse, personne ne sait pourquoi. On te demande de la rendre <strong>observable</strong> et de définir " +
      "ce qu'on surveille et comment on est alerté.</p>",
    objectif:
      "<p>Concevoir l'<strong>observabilité</strong> d'un service : instrumenter les <strong>trois piliers</strong> (journaux " +
      "structurés, métriques, traces si pertinent), définir un <strong>tableau de bord</strong> de santé, des <strong>alertes</strong> " +
      "actionnables et un ou deux <strong>SLO</strong>.</p>",
    livrable: "Un plan d'observabilité : ce qu'on journalise, les métriques clés, le tableau de bord, les alertes et les SLO.",
    fonctionnalites: [
      "Des <strong>journaux structurés</strong> aux points clés (requêtes, erreurs, événements métier).",
      "Des <strong>métriques</strong> essentielles (trafic, erreurs, latence — par ex. les « signaux dorés »).",
      "Un <strong>tableau de bord</strong> montrant la santé du service d'un coup d'œil.",
      "Des <strong>alertes</strong> actionnables (qui signalent un vrai problème, sans bruit inutile).",
      "Un ou deux <strong>SLO</strong> (objectifs de fiabilité) basés sur des SLI mesurables.",
      "Si l'app est répartie : du <strong>tracing</strong> pour suivre une requête entre services.",
    ],
    criteres: [
      "Les <strong>journaux</strong> sont structurés et porteurs de contexte (pas du texte libre).",
      "Les <strong>métriques</strong> couvrent au moins trafic, erreurs et latence.",
      "Le <strong>tableau de bord</strong> permet de juger la santé en quelques secondes.",
      "Les <strong>alertes</strong> sont <strong>actionnables</strong> (peu de faux positifs, un signal = une action).",
      "Les <strong>SLO</strong> sont définis avec des SLI mesurables et un objectif clair.",
      "On saurait, grâce à ce plan, <strong>diagnostiquer</strong> un incident plutôt que deviner.",
    ],
    pistes:
      "<p>Commence par les <strong>signaux dorés</strong> (trafic, erreurs, latence, saturation) : ils couvrent l'essentiel " +
      "pour la plupart des services. Structure tes logs (clé/valeur) pour pouvoir les filtrer.</p>" +
      "<p>Pour les alertes, vise l'<strong>actionnable</strong> : alerter sur les symptômes vécus par l'utilisateur (erreurs, " +
      "lenteur) plutôt que sur chaque pic technique. Ce projet prolonge le <a href=\"../cloud/cours.html\">cloud</a> et " +
      "<a href=\"../kubernetes/cours.html\">Kubernetes</a>.</p>",
  },
  {
    id: "os-analyser",
    course: "os",
    courseTitle: "Systèmes d'exploitation",
    dir: "os",
    accent: "os",
    type: "Analyse système",
    niveau: "Intermédiaire",
    titre: "Analyser le comportement d'un programme",
    contexte:
      "<p>Un programme tourne sur ta machine — un calcul, un petit serveur, un script. On te demande d'<strong>observer ce " +
      "qu'il fait vraiment</strong> au niveau du système : combien de processus/threads, combien de mémoire, quels appels " +
      "système, et d'expliquer son comportement.</p>",
    objectif:
      "<p>Utiliser les outils du système pour <strong>regarder sous le code</strong> : suivre un <strong>processus</strong> et " +
      "ses <strong>threads</strong>, mesurer son usage <strong>CPU</strong> et <strong>mémoire</strong>, observer ses " +
      "<strong>appels système</strong>, et relier ces observations aux concepts du cours.</p>",
    livrable: "Un compte rendu : ce que fait le programme au niveau système (processus, mémoire, appels), avec une explication.",
    fonctionnalites: [
      "L'identification du <strong>processus</strong> (PID) et de ses éventuels <strong>threads</strong>.",
      "La mesure de l'usage <strong>CPU</strong> et <strong>mémoire</strong> dans le temps (top/htop).",
      "L'observation des <strong>appels système</strong> principaux (par ex. avec strace).",
      "Le repérage de ce qui domine&nbsp;: calcul (CPU) ou attente d'<strong>entrées/sorties</strong> ?",
      "Le lien entre les observations et les <strong>concepts</strong> (ordonnancement, mémoire, E/S).",
      "Une explication d'un éventuel comportement surprenant (lenteur, mémoire, threads).",
    ],
    criteres: [
      "Le <strong>processus</strong> et son usage des ressources sont correctement mesurés.",
      "On distingue un programme <strong>limité par le CPU</strong> d'un programme <strong>limité par les E/S</strong>.",
      "Les <strong>appels système</strong> observés sont reliés à ce que fait le programme.",
      "Les observations sont <strong>expliquées</strong> par les concepts du cours, pas juste décrites.",
      "Le compte rendu permettrait de <strong>diagnostiquer</strong> un problème de performance.",
      "On reste rigoureux&nbsp;: mesurer plusieurs fois, éviter les conclusions hâtives.",
    ],
    pistes:
      "<p>Commence simple&nbsp;: lance <code>top</code>/<code>htop</code> et repère ton programme&nbsp;; est-il à 100&nbsp;% de " +
      "CPU (calcul) ou souvent en attente (E/S)&nbsp;? Puis observe ses appels système avec <code>strace</code> pour voir " +
      "concrètement ce qu'il demande au noyau.</p>" +
      "<p>Relie chaque observation à une leçon&nbsp;: pourquoi plusieurs threads n'accélèrent pas un calcul pur, pourquoi un " +
      "programme « attend » sans consommer de CPU… Ce projet éclaire aussi <a href=\"../linux/cours.html\">Linux</a> et " +
      "l'<a href=\"../algo/cours.html\">algorithmique</a>.</p>",
  },
];
