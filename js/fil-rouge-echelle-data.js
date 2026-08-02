/* =============================================================================
   fil-rouge-echelle-data.js — FIL ROUGE « Concevoir & déployer à l'échelle ».
   UNE application qu'on porte du tableau blanc à la production reproductible : on
   CONÇOIT son architecture (archi), on l'HÉBERGE dans le cloud (cloud), puis on
   PROVISIONNE toute l'infrastructure en code (iac) : archi → cloud → iac.
   Définit window.FIL_ROUGE → moteur générique js/fil-rouge.js.
   Page : pages/fil-rouge-echelle.html. 100 % file://.
   ============================================================================= */
window.FIL_ROUGE = {
  id: "echelle",
  titre: "Concevoir & déployer à l'échelle",
  sousTitre: "Mène une application du tableau blanc à la production reproductible : conçois son architecture, héberge-la dans le cloud, puis décris toute l'infra en code.",
  intro:
    "<p>Construire une application qui tient la charge ne s'improvise pas : cela demande de bien la <strong>concevoir</strong>, " +
    "de choisir <em>où</em> et <em>comment</em> l'héberger, et de rendre tout l'environnement <strong>reproductible</strong>. " +
    "Ce fil rouge enchaîne ces trois temps, du plan d'architecture jusqu'à l'infrastructure décrite en code.</p>" +
    "<p>On commence par <strong>concevoir l'architecture</strong> (découpe, responsabilités, dépendances), puis on choisit " +
    "les bons services <strong>cloud</strong> pour l'héberger (calcul, stockage, réseau, coûts), et enfin on <strong>provisionne</strong> " +
    "toute cette infrastructure en <strong>code</strong> (Terraform) pour la recréer à l'identique. De l'idée à un déploiement " +
    "que l'on maîtrise de bout en bout.</p>",
  etapes: [
    {
      n: 1,
      course: "archi",
      courseTitle: "Architecture logicielle",
      dir: "archi",
      accent: "archi",
      phase: "Concevoir",
      titre: "Concevoir l'architecture de l'application",
      depart: "Une application à construire (ou à restructurer) : on part des besoins, pas de la technologie.",
      objectif:
        "<p>Poser une <strong>architecture</strong> solide : découper en parties aux <strong>responsabilités claires</strong>, " +
        "viser un <strong>faible couplage</strong> et une <strong>forte cohésion</strong>, isoler le métier des détails " +
        "techniques et choisir un <strong>style</strong> adapté au contexte.</p>",
      ajoute: [
        "Une <strong>découpe</strong> en couches/modules avec le rôle de chacun.",
        "Un schéma des <strong>dépendances</strong>, orientées vers le cœur métier.",
        "Un <strong>style</strong> justifié (monolithe modulaire par défaut), sans sur-ingénierie.",
        "Quelques <strong>décisions</strong> structurantes documentées (ADR).",
      ],
      criteres: [
        "Chaque partie a une <strong>responsabilité claire et unique</strong> (forte cohésion).",
        "Le <strong>couplage</strong> est faible ; les dépendances pointent vers le <strong>domaine</strong>.",
        "Le <strong>style</strong> est justifié par le contexte (taille, équipe, charge attendue).",
        "Le <strong>métier</strong> ne dépend pas des détails techniques (base, framework, UI).",
        "Les <strong>décisions</strong> structurantes sont documentées (ADR) avec leurs raisons.",
      ],
      livrable: "Un dossier d'architecture : découpe, dépendances, style justifié et décisions documentées.",
    },
    {
      n: 2,
      course: "cloud",
      courseTitle: "Cloud & déploiement",
      dir: "cloud",
      accent: "cloud",
      phase: "Héberger",
      titre: "Héberger l'application dans le cloud",
      depart: "L'architecture conçue à l'étape 1, qu'il faut maintenant faire tourner quelque part.",
      objectif:
        "<p>Choisir les bons <strong>services cloud</strong> pour héberger l'application : le bon modèle de <strong>calcul</strong> " +
        "(VM, conteneurs, serverless), le <strong>stockage</strong> et la base adaptés, le <strong>réseau</strong>, en gardant un œil " +
        "sur la <strong>sécurité</strong> (IAM) et les <strong>coûts</strong>.</p>",
      ajoute: [
        "Le choix d'un modèle de <strong>calcul</strong> (VM / conteneurs / serverless) justifié.",
        "Le <strong>stockage</strong> et la <strong>base gérée</strong> adaptés au besoin.",
        "Une organisation <strong>réseau</strong> et des accès <strong>IAM</strong> au moindre privilège.",
        "Une estimation des <strong>coûts</strong> et un dimensionnement raisonnable.",
      ],
      criteres: [
        "Le modèle de <strong>calcul</strong> retenu correspond au profil de l'application.",
        "Le <strong>stockage</strong>/la base choisis conviennent aux données et à la charge.",
        "Les accès suivent le <strong>moindre privilège</strong> (IAM), rien d'ouvert inutilement.",
        "Le <strong>coût</strong> est estimé et le dimensionnement justifié (ni sous- ni surdimensionné).",
        "Le choix cloud <strong>sert l'architecture</strong> de l'étape 1, sans la trahir.",
      ],
      livrable: "Un plan de déploiement cloud : calcul, stockage, réseau, IAM et coûts maîtrisés.",
    },
    {
      n: 3,
      course: "iac",
      courseTitle: "Infrastructure as Code",
      dir: "iac",
      accent: "iac",
      phase: "Provisionner",
      titre: "Décrire l'infrastructure en code (Terraform)",
      depart: "Le plan cloud de l'étape 2, encore créé « à la main » dans la console.",
      objectif:
        "<p>Rendre l'infrastructure <strong>reproductible</strong> : décrire avec <strong>Terraform</strong> les ressources " +
        "(calcul, stockage, réseau…) en <strong>code versionné</strong>, paramétré et modulaire, pour la recréer à l'identique " +
        "d'un <code>terraform apply</code>.</p>",
      ajoute: [
        "Un <strong>provider</strong> et des <strong>ressources</strong> décrivant l'infra du plan cloud.",
        "Des <strong>variables</strong> et des <strong>modules</strong> réutilisables (environnements dev/prod).",
        "La gestion du <strong>state</strong> et la lecture d'un <code>plan</code> avant chaque <code>apply</code>.",
        "Le code d'infra <strong>versionné</strong> (fin des modifications manuelles dans la console).",
      ],
      criteres: [
        "L'infrastructure est décrite en <strong>code versionné</strong> (plus de création manuelle).",
        "Un <code>terraform plan</code> montre clairement ce qui sera créé/modifié avant d'agir.",
        "La configuration est <strong>paramétrée</strong> (variables) et <strong>modulaire</strong>.",
        "Le <strong>state</strong> est géré proprement et l'<code>apply</code> est reproductible.",
        "L'environnement complet se <strong>recrée à l'identique</strong> depuis le code.",
      ],
      livrable: "🏁 Une application conçue, hébergée et entièrement décrite en code : du tableau blanc au terraform apply !",
    },
  ],
};
