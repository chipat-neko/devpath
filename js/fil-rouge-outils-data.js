/* =============================================================================
   fil-rouge-outils-data.js — FIL ROUGE « Outiller et fiabiliser un projet web ».
   On part d'un projet web et on l'enrichit, étape par étape, avec les compétences
   transversales : Sass → Vue → HTTP → regex → Bash → Markdown → VS Code.
   Définit window.FIL_ROUGE → moteur générique js/fil-rouge.js.
   Page : pages/fil-rouge-outils.html. 100 % file://.
   ============================================================================= */
window.FIL_ROUGE = {
  id: "outils",
  titre: "Outiller et fiabiliser un projet web",
  sousTitre: "Partir d'un projet web et l'équiper, étape par étape, des compétences qui font un vrai projet.",
  intro:
    "<p>Un projet web ne se résume pas à du code applicatif : il faut <strong>industrialiser les styles</strong>, " +
    "<strong>comprendre le réseau</strong>, <strong>valider les données</strong>, <strong>automatiser</strong> les tâches, " +
    "<strong>documenter</strong> et <strong>configurer l'environnement</strong>. Tu prends un projet web existant (ton " +
    "portfolio, ou un autre) et tu l'<strong>outilles</strong> à chaque étape.</p>" +
    "<p>Le projet de départ ne change pas : ce sont les <strong>bonnes pratiques</strong> autour qui s'ajoutent et le " +
    "rendent solide, maintenable et partageable.</p>",
  etapes: [
    {
      n: 1,
      course: "sass",
      courseTitle: "Sass",
      dir: "sass",
      accent: "sass",
      phase: "Front & styles",
      titre: "Industrialiser les styles",
      depart: "Un projet web existant (ton portfolio, ou un autre), stylé en CSS.",
      objectif:
        "<p>Refondre le CSS du projet en <strong>Sass</strong> : variables, mixins, partials — pour des styles cohérents, " +
        "réutilisables et faciles à faire évoluer.</p>",
      ajoute: [
        "Des <strong>variables</strong> (<code>$</code>) pour couleurs et espacements.",
        "Une organisation en <strong>partials</strong> reliés par <code>@use</code>/<code>@forward</code>.",
        "Un <strong>mixin</strong> réutilisable (bouton, responsive).",
        "Une <strong>boucle</strong> qui génère des classes utilitaires.",
      ],
      criteres: [
        "Des <strong>variables Sass</strong> centralisent les valeurs.",
        "Le code est découpé en <strong>partials</strong> (<code>@use</code>).",
        "Au moins un <code>@mixin</code> est défini et <code>@include</code>.",
        "Une <strong>boucle</strong> (<code>@each</code>/<code>@for</code>) génère des règles.",
        "Le Sass <strong>compile</strong> en CSS, le rendu est inchangé.",
      ],
      livrable: "Les styles du projet, industrialisés en Sass.",
    },
    {
      n: 2,
      course: "vue",
      courseTitle: "Vue.js",
      dir: "vue",
      accent: "vue",
      phase: "Front & styles",
      titre: "Réécrire une partie du front en Vue",
      depart: "Le projet web (styles Sass de l'étape 1).",
      objectif:
        "<p>Reconstruire une portion interactive du projet (une liste, un formulaire) en <strong>composants Vue</strong> — " +
        "une alternative à l'approche en JavaScript pur ou en React.</p>",
      ajoute: [
        "Un <strong>composant</strong> réutilisable avec des <strong>props</strong>.",
        "L'<strong>affichage de listes</strong> (<code>v-for</code>) et la liaison (<code>v-model</code>).",
        "La gestion d'<strong>événements</strong> (<code>v-on</code>/<code>@</code>).",
        "Une <strong>propriété calculée</strong> (<code>computed</code>).",
      ],
      criteres: [
        "L'UI est découpée en <strong>composants</strong> avec props.",
        "<code>v-for</code> a une clé ; <code>v-model</code> lie une donnée.",
        "Un <strong>événement</strong> est géré (<code>@click</code>…).",
        "Une <strong>computed</strong> dérive une valeur.",
        "Aucun avertissement dans la console.",
      ],
      livrable: "Une partie du front réécrite en composants Vue.",
    },
    {
      n: 3,
      course: "http",
      courseTitle: "HTTP",
      dir: "http",
      accent: "http",
      phase: "Réseau & données",
      titre: "Comprendre et déboguer le réseau",
      depart: "Le projet web (front des étapes 1-2).",
      objectif:
        "<p>Ouvrir le capot du <strong>réseau</strong> : observer les requêtes et réponses de ton projet, comprendre les " +
        "méthodes, statuts, en-têtes et cookies — indispensable pour déboguer.</p>",
      ajoute: [
        "L'analyse des <strong>échanges</strong> du projet (onglet Réseau).",
        "L'identification des <strong>méthodes</strong>, <strong>statuts</strong> et <strong>en-têtes</strong> clés.",
        "Le suivi d'un <strong>cookie</strong> (<code>Set-Cookie</code> → renvoi).",
        "Le <strong>diagnostic</strong> d'un échange qui échoue (4xx/5xx).",
      ],
      criteres: [
        "Plusieurs <strong>échanges réels</strong> sont décrits (méthode, URL, statut).",
        "<code>Content-Type</code> et un en-tête de <strong>cookie</strong> sont identifiés.",
        "Le sens des <strong>codes de statut</strong> est expliqué.",
        "Le cycle d'un <strong>cookie</strong> est tracé.",
        "Un échange en erreur est <strong>diagnostiqué</strong>.",
      ],
      livrable: "Une analyse réseau du projet, et de quoi déboguer.",
    },
    {
      n: 4,
      course: "regex",
      courseTitle: "Regex",
      dir: "regex",
      accent: "regex",
      phase: "Réseau & données",
      titre: "Valider les entrées et traiter le texte",
      depart: "Le projet web (avec ses formulaires et ses données).",
      objectif:
        "<p>Fiabiliser les <strong>entrées</strong> et automatiser le <strong>traitement de texte</strong> avec des " +
        "<strong>expressions régulières</strong> : valider un e-mail, extraire des informations.</p>",
      ajoute: [
        "La <strong>validation</strong> des champs du formulaire (e-mail, téléphone…).",
        "Un motif d'<strong>extraction</strong> (liens, montants, dates) dans un texte.",
        "L'usage des <strong>classes</strong>, <strong>quantificateurs</strong> et <strong>ancres</strong>.",
        "Des <strong>tests</strong> sur des cas valides ET invalides.",
      ],
      criteres: [
        "Les motifs utilisent <strong>classes</strong> et <strong>quantificateurs</strong>.",
        "Au moins une <strong>ancre</strong> (<code>^</code>/<code>$</code>) borne une validation.",
        "Un <strong>groupe de capture</strong> est présent.",
        "Un motif d'<strong>extraction</strong> renvoie plusieurs résultats.",
        "Chaque motif est <strong>testé</strong> (cas positifs et négatifs).",
      ],
      livrable: "Des entrées validées et du texte traité par regex.",
    },

    {
      n: 5,
      course: "formats",
      courseTitle: "Formats de données",
      dir: "formats",
      accent: "formats",
      phase: "Réseau & données",
      titre: "Échanger des données proprement",
      depart: "Le projet web (étapes 1-4).",
      objectif:
        "<p>Maîtriser les <strong>formats de données</strong> du projet : sa configuration, l'import et l'export, et la " +
        "validation — en JSON, CSV ou YAML, sans casser l'encodage ni les types.</p>",
      ajoute: [
        "Une <strong>configuration</strong> du projet en JSON ou YAML.",
        "L'<strong>import/export</strong> de données (par ex. JSON ↔ CSV).",
        "La <strong>validation</strong> d'une entrée mal formée.",
        "La préservation de l'<strong>UTF-8</strong> et des <strong>types</strong>.",
      ],
      criteres: [
        "Une <strong>conversion</strong> entre deux formats fonctionne (ex. JSON↔CSV).",
        "Une entrée <strong>mal formée</strong> est détectée (pas de plantage).",
        "Les caractères <strong>accentués</strong> (UTF-8) sont préservés.",
        "Les <strong>types</strong> sont respectés (nombre, booléen, chaîne).",
        "Un <strong>cas limite</strong> est géré (champ vide, liste vide).",
      ],
      livrable: "Les données et la config du projet, bien formatées.",
    },
    {
      n: 6,
      course: "patterns",
      courseTitle: "Design patterns",
      dir: "patterns",
      accent: "patterns",
      phase: "Code & qualité",
      titre: "Structurer le code avec des patterns",
      depart: "Le projet web (étapes 1-5), dont le code a grossi.",
      objectif:
        "<p>Refactorer le code du projet pour le rendre <strong>lisible et extensible</strong> grâce aux " +
        "<strong>design patterns</strong> et aux principes <strong>SOLID</strong>, sans changer son comportement.</p>",
      ajoute: [
        "Repérer la <strong>duplication</strong> et la <strong>rigidité</strong> du code.",
        "Appliquer au moins <strong>deux patterns</strong> (Strategy, Factory, Observer…).",
        "Respecter la <strong>responsabilité unique</strong> (SOLID).",
        "Garder le <strong>comportement identique</strong> (pas de régression).",
      ],
      criteres: [
        "Au moins <strong>deux design patterns</strong> sont appliqués à bon escient.",
        "La <strong>responsabilité unique</strong> est respectée.",
        "Une <strong>extension</strong> ne force pas à modifier l'existant (ouvert/fermé).",
        "Plus de grosse cascade de <code>if/else</code> pour choisir un comportement.",
        "Le <strong>comportement final</strong> est identique.",
      ],
      livrable: "Un code de projet structuré, extensible et maintenable.",
    },
    {
      n: 7,
      course: "bash",
      courseTitle: "Bash",
      dir: "bash",
      accent: "bash",
      phase: "Industrialiser",
      titre: "Automatiser les tâches répétitives",
      depart: "Le projet web (étapes 1-6).",
      objectif:
        "<p>Écrire des <strong>scripts shell</strong> pour automatiser ce qui se répète : construire, sauvegarder, " +
        "nettoyer, déployer — sans le refaire à la main.</p>",
      ajoute: [
        "Un script qui <strong>automatise</strong> une tâche (build, sauvegarde, déploiement).",
        "L'usage de <strong>variables</strong>, <strong>conditions</strong> et <strong>boucles</strong>.",
        "Au moins une <strong>fonction</strong> et des <strong>arguments</strong>.",
        "La <strong>journalisation</strong> et un code de sortie cohérent.",
      ],
      criteres: [
        "Le script lit des <strong>arguments</strong> et utilise des variables.",
        "Une <strong>condition</strong> et une <strong>boucle</strong> sont présentes.",
        "Au moins une <strong>fonction</strong> est définie et appelée.",
        "Les actions sont <strong>journalisées</strong> (redirection).",
        "Le script renvoie un <strong>code de sortie</strong> cohérent.",
      ],
      livrable: "Les tâches répétitives automatisées par des scripts.",
    },
    {
      n: 8,
      course: "markdown",
      courseTitle: "Markdown",
      dir: "markdown",
      accent: "markdown",
      phase: "Industrialiser",
      titre: "Documenter le projet",
      depart: "Le projet web outillé (étapes 1-7).",
      objectif:
        "<p>Rédiger une <strong>documentation</strong> claire en Markdown : un README qui explique le projet, son " +
        "installation, son utilisation et sa feuille de route.</p>",
      ajoute: [
        "Une <strong>hiérarchie de titres</strong> et un sommaire avec liens.",
        "Des <strong>blocs de code</strong> (commandes d'installation, exemples).",
        "Un <strong>tableau</strong> (options, configuration).",
        "Une <strong>liste de tâches</strong> (feuille de route) avec cases à cocher.",
      ],
      criteres: [
        "Les <strong>titres</strong> sont hiérarchisés (un seul <code>#</code> principal).",
        "Au moins un <strong>bloc de code</strong> délimité par ``` avec son langage.",
        "Un <strong>tableau</strong> Markdown bien formé.",
        "Une <strong>liste de tâches</strong> (<code>[ ]</code>/<code>[x]</code>).",
        "Au moins un <strong>lien</strong> et une <strong>image</strong> (badge/capture).",
      ],
      livrable: "Une documentation (README) complète du projet.",
    },
    {
      n: 9,
      course: "vscode",
      courseTitle: "VS Code",
      dir: "vscode",
      accent: "vscode",
      phase: "Industrialiser",
      titre: "Configurer l'environnement de dev",
      depart: "Le projet web documenté (étapes 1-8).",
      objectif:
        "<p>Rendre le projet <strong>agréable et reproductible</strong> à développer pour toute l'équipe : réglages, " +
        "extensions, tâches et débogage partagés.</p>",
      ajoute: [
        "Un <code>.vscode/settings.json</code> de projet (format à la sauvegarde…).",
        "Des <strong>extensions recommandées</strong> (<code>extensions.json</code>).",
        "Une <strong>tâche</strong> (<code>tasks.json</code>) lançant un script du projet.",
        "Une configuration de <strong>débogage</strong> et un <strong>snippet</strong>.",
      ],
      criteres: [
        "Un <code>.vscode/settings.json</code> applique des réglages de projet.",
        "Un <code>extensions.json</code> recommande des extensions.",
        "Une <strong>tâche</strong> lance une commande du projet.",
        "Une configuration de <strong>débogage</strong> existe (<code>launch.json</code>).",
        "La configuration est <strong>partageable</strong> (versionnée, sans chemin perso).",
      ],
      livrable: "🏁 Un projet web outillé de bout en bout : styles, réseau, validation, automatisation, doc et environnement !",
    },
  ],
};
