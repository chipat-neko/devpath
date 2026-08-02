/* =============================================================================
   fil-rouge-securite-data.js — FIL ROUGE « Sécuriser une application ».
   UNE application qu'on rend sûre de bout en bout : on AUDITE et corrige ses
   failles (securite), on PROTÈGE l'API exposée (api), on DURCIT le transport et
   les en-têtes (http), puis on VERROUILLE par des tests (tests) :
   securite → api → http → tests.
   Définit window.FIL_ROUGE → moteur générique js/fil-rouge.js.
   Page : pages/fil-rouge-securite.html. 100 % file://.
   ============================================================================= */
window.FIL_ROUGE = {
  id: "securite",
  titre: "Sécuriser une application",
  sousTitre: "Prends une application qui marche et rends-la sûre, couche par couche : failles applicatives, API, transport, puis tests.",
  intro:
    "<p>Une application « qui fonctionne » n'est pas une application <strong>sûre</strong>. La sécurité ne s'ajoute pas à " +
    "la fin : elle se construit en <strong>couches</strong>, du code jusqu'au transport. Ce fil rouge prend une application " +
    "existante et la durcit méthodiquement, en suivant la logique de la <strong>défense en profondeur</strong>.</p>" +
    "<p>On commence par <strong>repérer et corriger</strong> les failles applicatives, puis on <strong>protège l'API</strong> " +
    "exposée, on <strong>durcit le transport</strong> et les en-têtes du navigateur, et on <strong>verrouille</strong> le tout " +
    "par des tests qui empêchent les failles de revenir. Chaque étape s'appuie sur la précédente : aucune couche ne suffit " +
    "seule, mais ensemble elles forment une vraie protection.</p>",
  etapes: [
    {
      n: 1,
      course: "securite",
      courseTitle: "Sécurité applicative",
      dir: "securite",
      accent: "securite",
      phase: "Auditer",
      titre: "Repérer et corriger les failles applicatives",
      depart: "Une application web fonctionnelle (un formulaire, une connexion, quelques pages dynamiques).",
      objectif:
        "<p>Adopter l'<strong>état d'esprit attaquant</strong> pour trouver les failles, puis les corriger : ne jamais faire " +
        "confiance à l'entrée, neutraliser les <strong>injections</strong>, le <strong>XSS</strong> et le <strong>CSRF</strong>, " +
        "et solidifier l'<strong>authentification</strong> et le <strong>contrôle d'accès</strong>.</p>",
      ajoute: [
        "Une <strong>validation/échappement</strong> systématique des entrées utilisateur.",
        "Des <strong>requêtes préparées</strong> (paramétrées) contre l'injection SQL.",
        "Des protections <strong>XSS</strong> (échappement en sortie) et <strong>CSRF</strong> (jetons).",
        "Une <strong>authentification</strong> robuste (mots de passe hachés) et un <strong>contrôle d'accès</strong> vérifié côté serveur.",
      ],
      criteres: [
        "Aucune entrée utilisateur n'est utilisée sans <strong>validation</strong> ni <strong>échappement</strong>.",
        "Les requêtes vers la base sont <strong>paramétrées</strong> (zéro concaténation).",
        "Les sorties sont <strong>échappées</strong> (anti-XSS) et les actions sensibles protégées (anti-CSRF).",
        "Les mots de passe sont <strong>hachés</strong> (fonction lente + sel), jamais en clair.",
        "Le <strong>contrôle d'accès</strong> est vérifié côté serveur à chaque requête sensible.",
      ],
      livrable: "Une application dont les failles applicatives courantes (OWASP) sont identifiées et corrigées.",
    },
    {
      n: 2,
      course: "api",
      courseTitle: "API REST",
      dir: "api",
      accent: "api",
      phase: "Protéger",
      titre: "Sécuriser l'API exposée",
      depart: "L'application durcie de l'étape 1, dont l'API est appelée par le front (ou des clients tiers).",
      objectif:
        "<p>Une API exposée est une porte d'entrée : il faut <strong>authentifier</strong> qui appelle, <strong>autoriser</strong> " +
        "chaque action, <strong>valider</strong> rigoureusement les données reçues et configurer correctement <strong>CORS</strong>.</p>",
      ajoute: [
        "Une <strong>authentification</strong> des requêtes (jeton, session) sur les routes protégées.",
        "Une <strong>autorisation</strong> par ressource (le bon utilisateur, le bon rôle) vérifiée côté serveur.",
        "Une <strong>validation stricte</strong> du corps et des paramètres (schéma, types, bornes).",
        "Une politique <strong>CORS</strong> restreinte aux seules origines nécessaires.",
      ],
      criteres: [
        "Les routes sensibles exigent une <strong>authentification</strong> valide.",
        "Chaque action vérifie l'<strong>autorisation</strong> (pas seulement « connecté », mais « a le droit »).",
        "Les données reçues sont <strong>validées</strong> avant tout traitement (rejet propre sinon).",
        "<strong>CORS</strong> n'autorise que les origines attendues (pas de <code>*</code> sur une API privée).",
        "Les messages d'erreur ne <strong>divulguent</strong> ni détails internes ni données sensibles.",
      ],
      livrable: "Une API qui authentifie, autorise, valide ses entrées et n'expose rien d'inutile.",
    },
    {
      n: 3,
      course: "http",
      courseTitle: "HTTP",
      dir: "http",
      accent: "http",
      phase: "Durcir",
      titre: "Durcir le transport et les en-têtes",
      depart: "L'application et son API sécurisées (étapes 1 et 2), servies sur le réseau.",
      objectif:
        "<p>Protéger les données <strong>en transit</strong> et dire au navigateur de se comporter prudemment : forcer " +
        "<strong>HTTPS</strong>, activer <strong>HSTS</strong>, et poser les <strong>en-têtes de sécurité</strong> (CSP, " +
        "anti-clickjacking, nosniff).</p>",
      ajoute: [
        "Le <strong>HTTPS</strong> partout, avec redirection du HTTP en clair et <strong>HSTS</strong>.",
        "Une <strong>Content-Security-Policy</strong> qui restreint les sources de scripts (anti-XSS).",
        "Des en-têtes <strong>X-Content-Type-Options</strong>, <strong>X-Frame-Options</strong> (ou <code>frame-ancestors</code>).",
        "Une <strong>Referrer-Policy</strong> raisonnable et des cookies marqués <code>Secure</code>/<code>HttpOnly</code>.",
      ],
      criteres: [
        "Tout le trafic passe en <strong>HTTPS</strong> ; le HTTP en clair est redirigé et <strong>HSTS</strong> est actif.",
        "Une <strong>CSP</strong> est en place (déployée progressivement, du mode rapport vers l'application).",
        "Les en-têtes <strong>nosniff</strong> et anti-<strong>clickjacking</strong> sont présents.",
        "Les cookies de session sont <code>Secure</code>, <code>HttpOnly</code> et <code>SameSite</code> adaptés.",
        "Un scan d'en-têtes ne signale plus de manque <strong>critique</strong>.",
      ],
      livrable: "Une application servie en HTTPS, avec des en-têtes de sécurité qui durcissent le navigateur.",
    },
    {
      n: 4,
      course: "tests",
      courseTitle: "Tests & qualité",
      dir: "tests",
      accent: "tests",
      phase: "Verrouiller",
      titre: "Verrouiller par des tests de sécurité",
      depart: "L'application durcie de bout en bout (étapes 1 à 3).",
      objectif:
        "<p>Empêcher les failles de <strong>revenir</strong> : transformer chaque correction en <strong>test automatisé</strong> " +
        "(cas d'abus, entrées malveillantes, accès non autorisé) et brancher ces tests dans l'intégration continue.</p>",
      ajoute: [
        "Des <strong>tests de non-régression</strong> pour chaque faille corrigée (elle ne doit plus repasser).",
        "Des tests d'<strong>entrées malveillantes</strong> (injection, XSS) et de <strong>cas limites</strong>.",
        "Des tests d'<strong>autorisation</strong> : un utilisateur ne peut pas accéder aux données d'un autre.",
        "L'exécution de ces tests (et d'un <strong>audit de dépendances</strong>) en <strong>intégration continue</strong>.",
      ],
      criteres: [
        "Chaque faille corrigée est couverte par un <strong>test</strong> qui échouerait si elle réapparaissait.",
        "Des tests vérifient le <strong>rejet</strong> des entrées malveillantes et des accès non autorisés.",
        "Les tests s'exécutent <strong>automatiquement</strong> (CI) et bloquent en cas d'échec.",
        "Un <strong>audit des dépendances</strong> tourne régulièrement (vulnérabilités connues).",
        "La sécurité est devenue un <strong>processus continu</strong>, pas un contrôle ponctuel.",
      ],
      livrable: "🏁 Une application sécurisée en profondeur — code, API, transport — et protégée durablement par des tests automatisés !",
    },
  ],
};
