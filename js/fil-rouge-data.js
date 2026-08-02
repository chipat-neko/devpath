/* =============================================================================
   fil-rouge-data.js — Le FIL ROUGE PROGRESSIF : un SEUL projet (« Mon portfolio
   + tableau de bord ») construit étape par étape, un cours après l'autre. Le
   livrable d'une étape devient la base de la suivante. 100 % file://.
   ≠ briefs autonomes (js/projets-data.js) qui restent indépendants par cours.
   Rendu : js/fil-rouge.js · Page : pages/fil-rouge.html.
   Une étape : { n, course, courseTitle, dir, accent, phase, titre, depart,
                 objectif(HTML), ajoute:[HTML], criteres:[HTML], livrable }.
   ============================================================================= */
window.FIL_ROUGE = {
  id: "portfolio",
  titre: "Mon portfolio + tableau de bord",
  sousTitre: "Un seul projet, enrichi cours après cours — du site statique au full-stack déployé.",
  intro:
    "<p>Ici, pas un projet différent par cours : c'est <strong>le même projet</strong> qui grandit. " +
    "Tu construis ton <strong>portfolio</strong> (présentation, projets, contact) puis tu lui ajoutes une " +
    "couche à chaque cours — le style, l'interactivité, un backend, une base de données, la sécurité, le " +
    "déploiement. À la fin, tu as un <strong>site full-stack complet</strong>, et tu as touché à tout le parcours web.</p>" +
    "<p>Chaque étape indique <strong>d'où tu pars</strong> (le livrable précédent), <strong>ce que le cours " +
    "ajoute</strong>, et des <strong>critères</strong> à cocher. Reprends ton code d'une étape à l'autre.</p>",
  etapes: [
    {
      n: 1,
      course: "html",
      courseTitle: "HTML",
      dir: "html",
      accent: "html",
      phase: "Frontend",
      titre: "Structurer le portfolio",
      depart: "Une page blanche — on démarre le projet.",
      objectif:
        "<p>Poser la <strong>structure HTML</strong> de ton portfolio : qui tu es, tes projets, et comment te contacter. " +
        "Pas encore de style ni de script — juste un document propre et sémantique.</p>",
      ajoute: [
        "Une page d'accueil avec une <strong>présentation</strong> (« à propos »).",
        "Une <strong>galerie de projets</strong> : chaque projet dans un <code>&lt;article&gt;</code> (titre, image, description).",
        "Un <strong>formulaire de contact</strong> (nom, e-mail, message) avec des <code>&lt;label&gt;</code>.",
        "Une <strong>navigation</strong> entre les sections et un pied de page (liens, réseaux).",
      ],
      criteres: [
        "Structure sémantique : <code>header</code>, <code>nav</code>, <code>main</code>, <code>section</code>, <code>footer</code>.",
        "Chaque projet est un <code>&lt;article&gt;</code> ; les images ont un <code>alt</code>.",
        "Le formulaire relie chaque <code>&lt;label&gt;</code> à son champ (<code>for</code>/<code>id</code>).",
        "Le document est valide (<code>&lt;!DOCTYPE html&gt;</code>, <code>lang</code>, balises équilibrées).",
      ],
      livrable: "Le portfolio en HTML, structuré mais sans style.",
    },
    {
      n: 2,
      course: "css",
      courseTitle: "CSS",
      dir: "css",
      accent: "css",
      phase: "Frontend",
      titre: "Habiller le portfolio",
      depart: "Le portfolio HTML de l'étape 1.",
      objectif:
        "<p>Donner vie à ta structure : une <strong>identité visuelle</strong>, une mise en page <strong>responsive</strong>, " +
        "et un <strong>mode clair/sombre</strong> — sans toucher au HTML, seulement au style.</p>",
      ajoute: [
        "Une palette et une typographie cohérentes via des <strong>variables CSS</strong>.",
        "Une <strong>navigation en Flexbox</strong> et une <strong>galerie en Grid</strong>.",
        "Un design <strong>responsive</strong> (media query) lisible sur mobile.",
        "Un <strong>thème clair/sombre</strong> et des effets au survol (transition).",
      ],
      criteres: [
        "Le CSS est dans un fichier séparé, relié par <code>&lt;link&gt;</code>.",
        "Au moins 3 <strong>variables</strong> (<code>:root</code>) pour les couleurs.",
        "<strong>Flexbox</strong> (nav) et <strong>Grid</strong> (galerie) sont utilisés.",
        "Une <strong>media query</strong> adapte la page ; un <code>:hover</code> a une <code>transition</code>.",
        "Le contenu HTML de l'étape 1 n'a pas changé.",
      ],
      livrable: "Le portfolio stylé, responsive, avec thème clair/sombre.",
    },
    {
      n: 3,
      course: "javascript",
      courseTitle: "JavaScript",
      dir: "js",
      accent: "javascript",
      phase: "Frontend",
      titre: "Rendre le portfolio interactif",
      depart: "Le portfolio stylé des étapes 1-2.",
      objectif:
        "<p>Ajouter de la <strong>vie</strong> : filtrer les projets, valider le formulaire, retenir le thème choisi — " +
        "tout dans le navigateur, sans rechargement.</p>",
      ajoute: [
        "Les projets stockés dans un <strong>tableau d'objets</strong> et affichés via le DOM.",
        "Un <strong>filtre</strong> des projets par catégorie (au clic).",
        "La <strong>validation</strong> du formulaire de contact avant envoi.",
        "La <strong>bascule de thème</strong> mémorisée dans <code>localStorage</code>.",
      ],
      criteres: [
        "Les projets sont dans un tableau d'objets, rendus en JS (<code>createElement</code>).",
        "Des <code>addEventListener</code> gèrent le filtre et le formulaire.",
        "Le filtre fonctionne ; la validation bloque un envoi incomplet.",
        "Le thème choisi est <strong>mémorisé</strong> (rechargement = même thème).",
        "Aucune erreur dans la console.",
      ],
      livrable: "Le portfolio interactif (filtre, formulaire validé, thème persistant).",
    },
    {
      n: 4,
      course: "html",
      courseTitle: "HTML",
      dir: "html",
      accent: "html",
      phase: "Frontend",
      titre: "Rendre le portfolio accessible",
      depart: "Le portfolio interactif de l'étape 3.",
      objectif:
        "<p>Faire en sorte que ton site soit utilisable <strong>au clavier</strong> et avec un <strong>lecteur d'écran</strong> — " +
        "et ajouter une <strong>fenêtre modale</strong> pour le détail d'un projet.</p>",
      ajoute: [
        "Une <strong>modale</strong> de détail de projet avec <code>&lt;dialog&gt;</code> / <code>showModal()</code>.",
        "Une navigation et des composants <strong>pilotables au clavier</strong> (Tab, Échap).",
        "Des attributs <strong>ARIA</strong> qui reflètent l'état (<code>aria-expanded</code>…).",
        "Une <strong>gestion du focus</strong> (piégé dans la modale, restitué à la fermeture).",
      ],
      criteres: [
        "La modale s'ouvre via <code>showModal()</code> et se ferme (bouton + Échap).",
        "Tout est utilisable <strong>au clavier seul</strong>.",
        "Les attributs <strong>ARIA</strong> sont corrects.",
        "Le <strong>focus</strong> est géré à l'ouverture et à la fermeture.",
      ],
      livrable: "Le portfolio accessible, avec une modale de projet.",
    },
    {
      n: 5,
      course: "css",
      courseTitle: "CSS",
      dir: "css",
      accent: "css",
      phase: "Frontend",
      titre: "Soigner les finitions visuelles",
      depart: "Le portfolio accessible de l'étape 4.",
      objectif:
        "<p>Passer du « propre » au « <strong>pro</strong> » : des <strong>animations</strong> à l'apparition, des cartes qui " +
        "s'adaptent à leur conteneur, des tailles fluides.</p>",
      ajoute: [
        "Une <strong>animation</strong> <code>@keyframes</code> (apparition des cartes de projet).",
        "Des <strong>container queries</strong> (<code>@container</code>) pour des cartes vraiment adaptatives.",
        "Un dimensionnement <strong>fluide</strong> avec <code>clamp()</code>.",
        "Des <strong>transitions</strong> et micro-interactions soignées.",
      ],
      criteres: [
        "Au moins une <code>@keyframes</code> est utilisée.",
        "Une <code>@container</code> adapte une carte à son conteneur.",
        "<code>clamp()</code> rend au moins une taille fluide.",
        "Le thème clair/sombre est toujours respecté.",
      ],
      livrable: "Le portfolio aux finitions modernes (animations, adaptatif).",
    },
    {
      n: 6,
      course: "javascript",
      courseTitle: "JavaScript",
      dir: "js",
      accent: "javascript",
      phase: "Frontend",
      titre: "Structurer le code du frontend",
      depart: "Le portfolio des étapes 1-5 (un seul gros script).",
      objectif:
        "<p>Réorganiser ton JavaScript pour qu'il soit <strong>maintenable</strong> : des modules, des utilitaires, et le " +
        "chargement <strong>asynchrone</strong> des données de projets.</p>",
      ajoute: [
        "Le code réparti en <strong>modules ES</strong> (<code>import</code>/<code>export</code>).",
        "Les projets chargés <strong>en asynchrone</strong> depuis un fichier JSON (<code>fetch</code>/<code>await</code>).",
        "Des <strong>utilitaires</strong> réutilisables (ex. <code>debounce</code> sur la recherche).",
        "Du code <strong>sans variables globales</strong> qui traînent.",
      ],
      criteres: [
        "Le JS est découpé en <strong>modules ES</strong>.",
        "Les données sont chargées de façon <strong>asynchrone</strong>.",
        "Au moins une fonction <strong>d'ordre supérieur</strong> ou un utilitaire (debounce…).",
        "Le comportement de l'étape 3 est conservé (rien de cassé).",
      ],
      livrable: "Le frontend bien structuré (modules, données async).",
    },
    {
      n: 7,
      course: "typescript",
      courseTitle: "TypeScript",
      dir: "typescript",
      accent: "typescript",
      phase: "Frontend",
      titre: "Fiabiliser avec les types",
      depart: "Le frontend modulaire de l'étape 6.",
      objectif:
        "<p>Réécrire ton code en <strong>TypeScript</strong> pour que le compilateur attrape les bugs avant l'exécution : " +
        "typer les projets, les messages, et les fonctions.</p>",
      ajoute: [
        "Une <strong>interface</strong> <code>Projet</code> et une interface <code>Message</code>.",
        "Des <strong>fonctions typées</strong> (paramètres et retours).",
        "Une <strong>union de littéraux</strong> pour les catégories de projets.",
        "La <strong>compilation</strong> vers du JavaScript exécutable.",
      ],
      criteres: [
        "Les <strong>types/interfaces</strong> sont définis explicitement.",
        "Aucun <code>any</code> implicite (mode strict).",
        "Une <strong>union de littéraux</strong> est utilisée.",
        "Le projet <strong>compile sans erreur</strong> (<code>tsc</code>).",
      ],
      livrable: "Le frontend typé (TypeScript), compilé.",
    },
    {
      n: 8,
      course: "react",
      courseTitle: "React",
      dir: "react",
      accent: "react",
      phase: "Frontend",
      titre: "Reconstruire l'UI en composants",
      depart: "Le frontend typé de l'étape 7.",
      objectif:
        "<p>Refaire l'interface en <strong>composants React</strong> : la galerie de projets et le futur tableau de bord " +
        "deviennent des composants réactifs, en réutilisant tes types.</p>",
      ajoute: [
        "Un composant <strong>Carte de projet</strong> réutilisable (props).",
        "L'<strong>état</strong> de la galerie avec <code>useState</code> (filtre, recherche).",
        "Le rendu des listes avec <code>.map()</code> et une <strong>clé</strong>.",
        "La base du <strong>tableau de bord</strong> en composant.",
      ],
      criteres: [
        "L'UI est <strong>découpée en composants</strong> avec des <strong>props</strong>.",
        "<code>useState</code> gère l'état ; <code>.map()</code> a une <code>key</code>.",
        "Au moins un <strong>événement</strong> et un <strong>affichage conditionnel</strong>.",
        "Aucun avertissement de clé dans la console.",
      ],
      livrable: "Le frontend en React (galerie + base du dashboard).",
    },
    {
      n: 9,
      course: "nodejs",
      courseTitle: "Node.js",
      dir: "nodejs",
      accent: "nodejs",
      phase: "Back-end",
      titre: "Construire le backend",
      depart: "Le frontend React de l'étape 8 (sans serveur).",
      objectif:
        "<p>Donner un <strong>backend</strong> à ton site : un serveur qui le sert et expose une <strong>API</strong> pour " +
        "recevoir les messages de contact et alimenter le tableau de bord.</p>",
      ajoute: [
        "Un serveur <strong>Express</strong> qui sert le site.",
        "Une route <code>POST /contact</code> pour <strong>recevoir</strong> un message.",
        "Une route <code>GET /projets</code> pour <strong>lister</strong> les projets.",
        "Une route protégée pour le <strong>tableau de bord</strong> (lister les messages reçus).",
      ],
      criteres: [
        "Le serveur <strong>écoute</strong> un port et sert le frontend.",
        "Les routes REST lisent le <strong>corps JSON</strong> et renvoient les bons <strong>statuts</strong> (201, 200, 404).",
        "Les <strong>erreurs</strong> sont gérées (entrée invalide → 4xx, pas de crash).",
        "La <strong>logique</strong> est séparée du code des routes.",
      ],
      livrable: "Le site servi par un backend + une API.",
    },
    {
      n: 10,
      course: "sql",
      courseTitle: "SQL",
      dir: "sql",
      accent: "sql",
      phase: "Back-end",
      titre: "Persister les données en base",
      depart: "Le backend de l'étape 9 (données en mémoire / fichier).",
      objectif:
        "<p>Remplacer le stockage temporaire par une vraie <strong>base de données</strong> : les projets et les messages " +
        "y vivent, et le tableau de bord en tire des <strong>statistiques</strong>.</p>",
      ajoute: [
        "Des tables <strong>projets</strong> et <strong>messages</strong> (avec clés).",
        "Le backend qui <strong>lit/écrit</strong> en base au lieu de la mémoire.",
        "Des requêtes pour le <strong>dashboard</strong> (nombre de messages, derniers reçus).",
        "Au moins une <strong>jointure</strong> ou un <strong>agrégat</strong> (statistiques).",
      ],
      criteres: [
        "Les tables ont une <code>PRIMARY KEY</code> (et une <code>FOREIGN KEY</code> si pertinent).",
        "Le backend utilise <code>INSERT</code>/<code>SELECT</code> sur la base.",
        "Une requête <strong>agrège</strong> (<code>COUNT</code>/<code>GROUP BY</code>) pour le dashboard.",
        "Les requêtes sont <strong>préparées</strong> (anti-injection).",
      ],
      livrable: "Les données persistées en base, dashboard alimenté.",
    },
    {
      n: 11,
      course: "git",
      courseTitle: "Git",
      dir: "git",
      accent: "git",
      phase: "Industrialisation",
      titre: "Versionner le projet",
      depart: "Le site full-stack des étapes 1-10.",
      objectif:
        "<p>Mettre ton projet sous <strong>contrôle de version</strong> : un historique propre, des branches de " +
        "fonctionnalités, et rien d'inutile versionné.</p>",
      ajoute: [
        "Un dépôt initialisé avec des <strong>commits clairs</strong>.",
        "Un <code>.gitignore</code> (<code>node_modules</code>, secrets, fichiers de build).",
        "Une <strong>branche de fonctionnalité</strong> par évolution, puis fusionnée.",
        "Un <strong>historique lisible</strong> (messages soignés).",
      ],
      criteres: [
        "L'historique a <strong>plusieurs commits</strong> aux messages clairs.",
        "Un <code>.gitignore</code> utile évite de versionner l'inutile.",
        "Au moins une <strong>branche</strong> a été créée puis fusionnée.",
        "Aucun fichier indésirable (dépendances, secrets) n'est versionné.",
      ],
      livrable: "Le projet versionné proprement avec Git.",
    },
    {
      n: 12,
      course: "securite",
      courseTitle: "Sécurité",
      dir: "securite",
      accent: "securite",
      phase: "Industrialisation",
      titre: "Sécuriser le site",
      depart: "Le site versionné des étapes 1-11.",
      objectif:
        "<p>Protéger ton site et ses utilisateurs : sécuriser le <strong>formulaire</strong>, l'<strong>accès au " +
        "tableau de bord</strong> et les <strong>données</strong>.</p>",
      ajoute: [
        "La <strong>validation côté serveur</strong> et l'<strong>échappement</strong> des messages (anti-XSS).",
        "Une <strong>authentification</strong> du tableau de bord (mots de passe <strong>hachés</strong>, bcrypt).",
        "Des <strong>requêtes préparées</strong> partout (anti-injection SQL).",
        "Des <strong>cookies sécurisés</strong> (<code>HttpOnly</code> / <code>Secure</code>).",
      ],
      criteres: [
        "Les entrées sont <strong>validées côté serveur</strong> ; les sorties <strong>échappées</strong>.",
        "Les mots de passe sont <strong>hachés</strong> (bcrypt/argon2).",
        "Les requêtes SQL sont <strong>préparées</strong>.",
        "L'accès au dashboard est <strong>protégé</strong> et les cookies sont <code>HttpOnly</code>.",
      ],
      livrable: "Le site durci contre les failles courantes.",
    },
    {
      n: 13,
      course: "tests",
      courseTitle: "Tests & qualité",
      dir: "tests",
      accent: "tests",
      phase: "Industrialisation",
      titre: "Tester le site",
      depart: "Le site sécurisé des étapes 1-12.",
      objectif:
        "<p>Garantir que ton site <strong>reste fiable</strong> quand tu le modifies : une suite de tests sur les fonctions " +
        "clés et sur l'API.</p>",
      ajoute: [
        "Des tests des <strong>fonctions clés</strong> (validation, calcul des stats du dashboard).",
        "Au moins un <strong>test de l'API</strong> (POST /contact, GET /projets).",
        "Une nouvelle fonctionnalité écrite en <strong>TDD</strong> (test d'abord).",
        "Le remplacement d'une dépendance par un <strong>stub/mock</strong>.",
      ],
      criteres: [
        "Les tests suivent le schéma <strong>Arrange-Act-Assert</strong>.",
        "Un <strong>test d'API</strong> vérifie une route.",
        "Les <strong>cas limites</strong> sont couverts (entrée vide, erreur).",
        "Tous les tests <strong>passent</strong> (vert).",
      ],
      livrable: "Le site couvert par une suite de tests.",
    },
    {
      n: 14,
      course: "docker",
      courseTitle: "Docker",
      dir: "docker",
      accent: "docker",
      phase: "Industrialisation",
      titre: "Conteneuriser le site",
      depart: "Le site testé des étapes 1-13.",
      objectif:
        "<p>Faire en sorte que ton site démarre <strong>partout</strong> d'une seule commande : l'application et sa base " +
        "dans des conteneurs.</p>",
      ajoute: [
        "Un <strong>Dockerfile</strong> pour l'application (<code>FROM</code>, <code>COPY</code>, <code>CMD</code>…).",
        "Un <strong>docker-compose</strong> : service appli + service base de données.",
        "Un <strong>volume</strong> pour persister la base.",
        "Des <strong>variables d'environnement</strong> pour la configuration.",
      ],
      criteres: [
        "L'image se <strong>construit</strong> et <strong>démarre</strong> (<code>docker build</code>/<code>run</code>).",
        "Le <code>docker-compose</code> a au moins <strong>deux services</strong> reliés.",
        "Un <strong>volume</strong> persiste les données.",
        "La configuration passe par des <strong>variables d'environnement</strong>.",
      ],
      livrable: "Le site conteneurisé (appli + base), démarrable d'une commande.",
    },
    {
      n: 15,
      course: "cicd",
      courseTitle: "CI/CD",
      dir: "cicd",
      accent: "cicd",
      phase: "Industrialisation",
      titre: "Déployer automatiquement",
      depart: "Le site conteneurisé des étapes 1-14.",
      objectif:
        "<p>La dernière couche : à chaque <em>push</em>, ton site est <strong>testé puis déployé automatiquement</strong>. " +
        "Ton portfolio est en ligne, et le reste à jour tout seul. 🎉</p>",
      ajoute: [
        "Un <strong>pipeline</strong> déclenché à chaque push / pull request.",
        "Des étapes <strong>installer → linter → tester → construire</strong>.",
        "La production d'un <strong>artefact</strong> (l'image / le build).",
        "Un <strong>déploiement conditionnel</strong> (seulement sur la branche principale).",
      ],
      criteres: [
        "Le workflow se déclenche sur <strong>push</strong> et exécute les étapes dans l'ordre.",
        "Un échec d'étape <strong>arrête</strong> le pipeline (fail fast).",
        "Un <strong>artefact</strong> est produit.",
        "Le <strong>déploiement</strong> est conditionné à la branche <code>main</code>.",
      ],
      livrable: "🎉 Le portfolio full-stack déployé automatiquement — fil rouge terminé !",
    },
  ],
};
