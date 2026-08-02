/* =============================================================================
   fil-rouge-devops-data.js — FIL ROUGE « De l'image au cluster » (DevOps/Cloud).
   UNE application qu'on met en production de bout en bout : on la conteneurise
   (Docker), on la déploie sur un cluster (Kubernetes), puis on automatise le tout
   (CI/CD) : docker → kubernetes → cicd.
   Définit window.FIL_ROUGE → moteur générique js/fil-rouge.js.
   Page : pages/fil-rouge-devops.html. 100 % file://.
   ============================================================================= */
window.FIL_ROUGE = {
  id: "devops",
  titre: "De l'image au cluster",
  sousTitre: "Prends une application et mène-la jusqu'en production : conteneur, cluster, déploiement automatisé, puis infrastructure en code.",
  intro:
    "<p>Faire tourner du code sur sa machine est une chose ; le <strong>mettre en production</strong> de façon fiable en " +
    "est une autre. Ce fil rouge prend une application simple et la conduit, étape par étape, jusqu'à une infrastructure " +
    "entièrement décrite en code : on l'<strong>emballe</strong> dans une image, on l'<strong>orchestre</strong> sur un " +
    "cluster, on <strong>automatise</strong> sa livraison, puis on <strong>provisionne</strong> tout l'environnement en " +
    "Infrastructure as Code.</p>" +
    "<p>Chaque étape réutilise le livrable de la précédente : l'image construite avec Docker est déployée par Kubernetes, " +
    "lui-même piloté par le pipeline CI/CD, et l'ensemble de l'infrastructure est enfin décrit avec Terraform pour devenir " +
    "<strong>reproductible</strong>. À la fin, un <code>git push</code> livre l'application, et un <code>terraform apply</code> " +
    "recrée tout l'environnement.</p>",
  etapes: [
    {
      n: 1,
      course: "docker",
      courseTitle: "Docker",
      dir: "docker",
      accent: "docker",
      phase: "Conteneuriser",
      titre: "Emballer l'application dans une image",
      depart: "Une petite application qui tourne en local (un serveur web, une API…).",
      objectif:
        "<p>Rendre l'application <strong>portable</strong> en la conteneurisant : un <code>Dockerfile</code> qui décrit son " +
        "environnement, une image construite, un conteneur qui tourne à l'identique partout.</p>",
      ajoute: [
        "Un <strong>Dockerfile</strong> qui décrit l'image (base, dépendances, code, commande de démarrage).",
        "La <strong>construction</strong> de l'image (<code>docker build</code>) et son <strong>exécution</strong> (<code>docker run</code>).",
        "L'exposition d'un <strong>port</strong> et le passage de <strong>variables d'environnement</strong>.",
        "Un <code>.dockerignore</code> et une image la plus <strong>légère</strong> possible.",
      ],
      criteres: [
        "Le <strong>Dockerfile</strong> construit l'image sans erreur.",
        "Le conteneur <strong>démarre</strong> et l'application répond sur le port exposé.",
        "La configuration passe par des <strong>variables d'environnement</strong> (rien en dur).",
        "L'image reste <strong>raisonnablement légère</strong> (base adaptée, <code>.dockerignore</code>).",
        "L'application se comporte de façon <strong>identique</strong> à la version locale.",
      ],
      livrable: "Une image Docker de l'application, exécutable n'importe où.",
    },
    {
      n: 2,
      course: "kubernetes",
      courseTitle: "Kubernetes",
      dir: "kubernetes",
      accent: "kubernetes",
      phase: "Orchestrer",
      titre: "Déployer l'image sur un cluster",
      depart: "L'image Docker de l'étape 1.",
      objectif:
        "<p>Faire tourner l'image <strong>de façon résiliente</strong> sur un cluster : plusieurs répliques, configuration " +
        "externalisée, exposition réseau et sondes de santé — le tout décrit en <strong>YAML déclaratif</strong>.</p>",
      ajoute: [
        "Un <strong>Deployment</strong> répliqué qui utilise ton image.",
        "Une <strong>ConfigMap</strong> (et un <strong>Secret</strong> si besoin) pour la configuration.",
        "Un <strong>Service</strong> qui expose les pods par leurs labels.",
        "Des <strong>sondes</strong> liveness/readiness et des <strong>requests/limits</strong>.",
      ],
      criteres: [
        "Le <strong>Deployment</strong> maintient ses répliques (auto-réparation vérifiée).",
        "La configuration est <strong>externalisée</strong> (ConfigMap/Secret), pas dans l'image.",
        "Le <strong>Service</strong> cible bien les pods (selector = labels) et publie un port.",
        "Les <strong>sondes</strong> liveness/readiness sont définies.",
        "Les manifestes s'appliquent avec <code>kubectl apply -f</code> sans erreur.",
      ],
      livrable: "Des manifestes Kubernetes qui déploient l'application sur un cluster.",
    },
    {
      n: 3,
      course: "cicd",
      courseTitle: "CI/CD",
      dir: "cicd",
      accent: "cicd",
      phase: "Automatiser",
      titre: "Automatiser la livraison (CI/CD)",
      depart: "L'image (étape 1) et les manifestes de déploiement (étape 2).",
      objectif:
        "<p>Relier le tout dans un <strong>pipeline</strong> : à chaque <code>git push</code>, tester, construire l'image, " +
        "la publier, puis déployer sur le cluster — <strong>sans intervention manuelle</strong>.</p>",
      ajoute: [
        "Un <strong>pipeline</strong> déclenché par un push (étapes : test → build → deploy).",
        "La <strong>construction</strong> et la <strong>publication</strong> de l'image (registry).",
        "Le <strong>déploiement</strong> automatique des manifestes sur le cluster.",
        "La gestion des <strong>secrets</strong> du pipeline (clés, identifiants) en sécurité.",
      ],
      criteres: [
        "Le pipeline se <strong>déclenche automatiquement</strong> sur un push.",
        "Les <strong>tests</strong> s'exécutent avant la construction (échec = pas de déploiement).",
        "L'<strong>image</strong> est construite et publiée par le pipeline.",
        "Le <strong>déploiement</strong> sur le cluster est automatisé (plus de <code>kubectl</code> à la main).",
        "Les <strong>secrets</strong> ne sont jamais en clair dans le dépôt ni les logs.",
      ],
      livrable: "Une application livrée en production d'un simple git push : image, cluster, pipeline.",
    },
    {
      n: 4,
      course: "iac",
      courseTitle: "Infrastructure as Code",
      dir: "iac",
      accent: "iac",
      phase: "Provisionner",
      titre: "Décrire l'infrastructure en code (Terraform)",
      depart: "L'application livrée par le pipeline (étapes 1 à 3), qui tourne sur une infrastructure créée à la main.",
      objectif:
        "<p>Rendre l'infrastructure elle-même <strong>reproductible</strong> : décrire avec Terraform les ressources qui " +
        "portent l'application (cluster, registry d'images, réseau…) en <strong>code versionné</strong>, pour pouvoir la " +
        "recréer à l'identique d'un <code>terraform apply</code>.</p>",
      ajoute: [
        "Un <strong>provider</strong> et des <strong>ressources</strong> Terraform décrivant l'infrastructure cible.",
        "Des <strong>variables</strong> pour paramétrer (région, tailles, nom de l'environnement).",
        "La gestion du <strong>state</strong> et la lecture d'un <code>plan</code> avant chaque <code>apply</code>.",
        "Des <strong>modules</strong> réutilisables et des environnements séparés (dev/prod).",
      ],
      criteres: [
        "L'infrastructure est décrite en <strong>code versionné</strong> (plus de création manuelle).",
        "Un <code>terraform plan</code> montre clairement ce qui sera créé/modifié avant d'agir.",
        "La configuration est <strong>paramétrée</strong> par des variables (rien d'environnement-spécifique en dur).",
        "Le <strong>state</strong> est géré proprement et l'<code>apply</code> est reproductible.",
        "L'environnement complet se <strong>recrée à l'identique</strong> depuis le code.",
      ],
      livrable: "🏁 Une application ET son infrastructure entièrement en code : git push pour livrer, terraform apply pour tout recréer !",
    },
  ],
};
