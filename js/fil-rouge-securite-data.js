/* =============================================================================
   fil-rouge-securite-data.js — FIL ROUGE « Sécuriser une application ».
   UNE application qu'on rend sûre de bout en bout : on AUDITE et corrige ses
   failles (securite), on l'ATTAQUE soi-même pour voir ce qui reste (offensive),
   on CHIFFRE ce qui reste lisible derrière la porte (crypto), on PROTÈGE l'API
   exposée (api), on DURCIT le transport et les en-têtes (http), puis on
   VERROUILLE par des tests (tests) :
   securite → offensive → crypto → api → http → tests.
   Définit window.FIL_ROUGE → moteur générique js/fil-rouge.js.
   Page : pages/fil-rouge-securite.html. 100 % file://.
   ============================================================================= */
window.FIL_ROUGE = {
  id: "securite",
  titre: "Sécuriser une application",
  sousTitre: "Prends une application qui marche et rends-la sûre, couche par couche : failles applicatives, audit offensif, chiffrement des secrets et des données, API, transport, puis tests.",
  intro:
    "<p>Une application « qui fonctionne » n'est pas une application <strong>sûre</strong>. La sécurité ne s'ajoute pas à " +
    "la fin : elle se construit en <strong>couches</strong>, du code jusqu'au transport. Ce fil rouge prend une application " +
    "existante et la durcit méthodiquement, en suivant la logique de la <strong>défense en profondeur</strong>.</p>" +
    "<p>On commence par <strong>repérer et corriger</strong> les failles applicatives. Puis on change de camp : on " +
    "<strong>attaque sa propre application</strong> méthodiquement, parce que corriger ce qu'on savait chercher ne prouve " +
    "rien sur le reste — et parce qu'une faille isolée se corrige quand c'est un <em>chemin</em> qu'il faut fermer. On " +
    "<strong>chiffre</strong> alors ce qui reste lisible derrière la porte — mots de passe, données au repos, clés —, parce " +
    "qu'une copie de la base ne s'obtient pas toujours par une faille. On <strong>protège</strong> ensuite l'API exposée, " +
    "on <strong>durcit le transport</strong> et les en-têtes du navigateur, " +
    "et on <strong>verrouille</strong> le tout par des tests qui empêchent les failles de revenir. Chaque étape s'appuie sur " +
    "la précédente : aucune couche ne suffit seule, mais ensemble elles forment une vraie protection.</p>",
  /* Renumérotation V13-E5 (cf. migrerStore dans js/fil-rouge.js) : le fil
     enchaînait securite=1, api=2, http=3, tests=4. Le cours « offensive »
     s'intercale en 2, les trois suivants glissent d'un rang. */
  remaps: {
    1: { "2": 3, "3": 4, "4": 5 },
    2: { "3": 4, "4": 5, "5": 6 },
  },
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
      course: "offensive",
      courseTitle: "Sécurité offensive",
      dir: "offensive",
      accent: "offensive",
      phase: "Attaquer",
      titre: "Attaquer sa propre application, méthodiquement",
      depart: "L'application de l'étape 1, dont les failles évidentes sont corrigées — et dont personne n'a encore vérifié qu'il n'en reste pas.",
      objectif:
        "<p>Corriger ce qu'on savait chercher ne prouve rien sur le reste. Cette étape retourne le point de vue : " +
        "mener sur sa propre application un <strong>audit méthodique</strong>, dans l'ordre — écrire le " +
        "<strong>périmètre</strong>, recenser la <strong>surface d'attaque</strong> (y compris les en-têtes, cookies et " +
        "noms de fichiers, qui n'apparaissent dans aucune URL), <strong>sonder puis reconfirmer</strong> chaque alerte, " +
        "<strong>chaîner</strong> les trouvailles en chemins d'accès, et rédiger un rapport qui se rejoue sans toi.</p>" +
        "<p>Le point qui change tout : une faille isolée se corrige, un <strong>chemin</strong> se ferme. Corriger la " +
        "trouvaille la plus grave laisse souvent un second chemin grand ouvert — il faut calculer le plus petit lot de " +
        "correctifs qui les coupe <em>tous</em>.</p>",
      ajoute: [
        "Un <strong>périmètre écrit</strong> : ce que tu t'autorises à tester, et ce que tu t'interdis (les services tiers, l'hébergeur, le prestataire de paiement).",
        "Un <strong>inventaire des points d'entrée</strong>, en-têtes et cookies compris, avec ceux qui répondent sans authentification.",
        "Des <strong>trouvailles reconfirmées</strong> par un second test, et les faux positifs écartés par écrit.",
        "Un <strong>arbre d'attaque</strong> qui relie les trouvailles, et le <strong>lot minimal de correctifs</strong> qui ferme tous les chemins.",
        "Un <strong>rapport reproductible</strong> : pour chaque faille, les étapes exactes, l'observation chiffrée, le correctif et son délai.",
      ],
      criteres: [
        "Le <strong>périmètre est écrit avant la première requête</strong>, et il exclut nommément ce qui ne t'appartient pas.",
        "L'inventaire recense les points d'entrée <strong>invisibles dans une URL</strong> (en-tête journalisé, cookie, nom de fichier téléversé).",
        "Chaque alerte est passée à un <strong>second test discriminant</strong> ; celles qui n'y survivent pas ne figurent pas au rapport.",
        "Un <strong>chemin complet</strong> d'un visiteur anonyme jusqu'à un compte privilégié est documenté, ou son absence est justifiée.",
        "Chaque fiche contient au moins une <strong>valeur littérale</strong> (adresse, paramètre, charge, nombre) : une autre personne la rejoue sans t'appeler.",
      ],
      livrable: "Un rapport d'audit de ta propre application : les trouvailles prouvées, classées par risque réel, et le plus petit lot de correctifs qui ferme tous les chemins.",
    },
    {
      n: 3,
      course: "crypto",
      courseTitle: "Cryptographie appliquée",
      dir: "crypto",
      accent: "crypto",
      phase: "Chiffrer",
      titre: "Protéger les secrets, les mots de passe et les données au repos",
      depart: "L'application auditée des étapes 1 et 2 : ses failles connues sont corrigées, et ses données sont toujours en clair sur le disque.",
      objectif:
        "<p>Les deux premières étapes ont fermé des portes. Celle-ci s'occupe de ce qui reste <em>derrière</em> la porte&nbsp;: " +
        "le jour où quelqu'un obtient une copie de la base, d'une sauvegarde ou d'un dépôt, que peut-il lire&nbsp;? La réponse " +
        "ne dépend d'aucune faille&nbsp;: elle dépend de trois décisions prises bien avant, et qu'on ne change plus " +
        "facilement — <strong>comment les mots de passe sont rangés</strong>, <strong>ce qui est chiffré au repos et avec " +
        "quelle liaison au contexte</strong>, et <strong>où vivent les clés</strong>.</p>" +
        "<p>Le fil directeur ne change pas d'un iota&nbsp;: on n'écrit jamais sa propre cryptographie. Tout le travail " +
        "consiste à choisir le bon outil avec les bons paramètres, à l'assembler correctement, puis à <strong>rejouer les " +
        "attaques</strong> contre son propre assemblage — falsification, déplacement d'un enregistrement vers un autre " +
        "compte, rejeu d'un état ancien.</p>",
      ajoute: [
        "Un stockage des mots de passe par une <strong>fonction lente et salée</strong> (Argon2id ou scrypt&nbsp;; à défaut PBKDF2), avec le coût réglé sur le matériel réel.",
        "Un <strong>chiffrement authentifié</strong> (AES-GCM ou ChaCha20-Poly1305) sur les champs sensibles, jamais un chiffrement seul.",
        "Des <strong>données associées</strong> qui lient chaque chiffré à son contexte&nbsp;: identifiant de l'enregistrement, rang, version.",
        "Un <strong>format auto-descriptif</strong>&nbsp;: chaque valeur rangée dit l'algorithme et les paramètres qui l'ont produite.",
        "Des clés <strong>hors du dépôt</strong>, rangées en enveloppe, avec une procédure de remplacement écrite et essayée au moins une fois.",
      ],
      criteres: [
        "Aucun mot de passe n'est stocké par une empreinte simple&nbsp;: la fonction employée est <strong>lente, salée et réglable</strong>, et son réglage est justifié par une mesure.",
        "Les champs sensibles sont chiffrés par un mode <strong>authentifié</strong>, et une falsification d'un octet est <strong>rejetée</strong> — tu l'as essayée.",
        "Un chiffré déplacé d'un enregistrement vers un autre est <strong>refusé</strong> grâce aux données associées — tu l'as essayé aussi.",
        "Chaque valeur chiffrée ou hachée porte son <strong>identifiant d'algorithme</strong>&nbsp;: un changement futur ne perd aucun compte.",
        "Aucune clé, aucun secret ne figure dans le dépôt ni dans l'historique&nbsp;; une <strong>recherche dans l'historique complet</strong> le confirme.",
        "Le <strong>modèle de menace</strong> est écrit, y compris la liste de ce que le chiffrement <em>ne</em> protège pas.",
      ],
      livrable: "Une application dont les mots de passe, les données sensibles et les clés résistent au vol d'une copie — avec les attaques correspondantes rejouées et documentées.",
    },
    {
      n: 4,
      course: "api",
      courseTitle: "API REST",
      dir: "api",
      accent: "api",
      phase: "Protéger",
      titre: "Sécuriser l'API exposée",
      depart: "L'application des étapes 1 à 3, dont l'API est appelée par le front (ou des clients tiers).",
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
      n: 5,
      course: "http",
      courseTitle: "HTTP",
      dir: "http",
      accent: "http",
      phase: "Durcir",
      titre: "Durcir le transport et les en-têtes",
      depart: "L'application et son API sécurisées (étapes 1 à 4), servies sur le réseau.",
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
      n: 6,
      course: "tests",
      courseTitle: "Tests & qualité",
      dir: "tests",
      accent: "tests",
      phase: "Verrouiller",
      titre: "Verrouiller par des tests de sécurité",
      depart: "L'application durcie de bout en bout (étapes 1 à 5).",
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
