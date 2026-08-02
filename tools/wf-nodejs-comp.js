export const meta = {
  name: 'syntaxe-nodejs-comp',
  description: 'Rédige 3 leçons de compléments du cours Node.js (base de données, authentification/JWT, WebSockets)',
  phases: [{ title: 'Rédaction' }, { title: 'Relecture' }],
};

const PILL = { debutant: 'Débutant', intermediaire: 'Intermédiaire', avance: 'Avancé' };

function buildLesson(p) {
  const objectives = p.objectives.map((o) => '                  <li>' + o + '</li>').join('\n');
  const pillClass = 'pill--' + p.level;
  const pillLabel = PILL[p.level];
  return `<!DOCTYPE html>
<html lang="fr" data-theme="light">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${p.title} — Leçon ${p.num} · Node.js · Syntaxe</title>
    <meta name="description" content="${p.metaDesc}" />
    <link rel="icon" type="image/svg+xml" href="../../assets/img/favicon.svg" />

    <script src="../../js/theme.js"></script>

    <link rel="stylesheet" href="../../css/fonts.css" />

    <link rel="stylesheet" href="../../css/variables.css" />
    <link rel="stylesheet" href="../../css/base.css" />
    <link rel="stylesheet" href="../../css/layout.css" />
    <link rel="stylesheet" href="../../css/components.css" />
    <link rel="stylesheet" href="../../css/pages.css" />
  </head>

  <body data-course="nodejs" data-lesson="lecon-${p.num}.html">
    <a class="skip-link" href="#contenu">Aller au contenu</a>

    <header class="site-header">
      <div class="container--wide container site-header__inner">
        <a class="brand" href="../../index.html" aria-label="Syntaxe — accueil">
          <svg class="brand__mark" viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <rect x="3" y="3" width="26" height="26" rx="8" /><path d="M13 12 L9 16 L13 20" /><path d="M19 12 L23 16 L19 20" />
          </svg>
          <span>Syntaxe<span class="brand__dot" aria-hidden="true">.</span></span>
        </a>
        <button class="nav-toggle" data-nav-toggle aria-expanded="false" aria-controls="primary-nav" aria-label="Ouvrir le menu de navigation">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M3 6h18M3 12h18M3 18h18" /></svg>
        </button>
        <nav class="primary-nav" id="primary-nav" aria-label="Navigation principale">
          <a href="../../index.html">Accueil</a>
          <a href="../catalogue.html">Catalogue</a>
          <a href="../js/cours.html">Cours JavaScript</a>
          <a href="../../index.html#pourquoi">Notre approche</a>
        </nav>
        <div class="header-actions">
          <button class="theme-toggle" data-theme-toggle aria-label="Activer le thème sombre">
            <svg class="icon icon-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" /></svg>
            <svg class="icon icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="4.5" /><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4" /></svg>
          </button>
        </div>
      </div>
    </header>

    <div class="reading-progress" data-reading-progress aria-hidden="true"></div>

    <main id="contenu">
      <div class="container container--wide">
        <nav class="breadcrumb-nav" aria-label="Fil d'Ariane">
          <ol class="breadcrumb">
            <li><a href="../../index.html">Accueil</a></li>
            <li><a href="../catalogue.html">Catalogue</a></li>
            <li><a href="cours.html">Node.js</a></li>
            <li aria-current="page">Leçon ${p.num}</li>
          </ol>
        </nav>

        <div class="lesson-layout">
          <aside class="lesson-rail lesson-coursenav" data-coursenav-host aria-label="Plan du cours">
            <button class="coursenav-toggle" data-coursenav-toggle aria-expanded="false">
              <span>Plan du cours</span>
              <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M6 9l6 6 6-6" /></svg>
            </button>
            <div class="coursenav-panel"><div data-coursenav></div></div>
          </aside>

          <div class="lesson-main">
            <header class="lesson-header">
              <p class="kicker">Module ${p.modNum} · ${p.modName} — Leçon ${p.num}</p>
              <h1 class="lesson-header__title">${p.title}</h1>
              <div class="meta-row">
                <span class="duration">
                  <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
                  ~${p.durationMin} min
                </span>
                <span class="dot-sep"><span class="pill ${pillClass}">${pillLabel}</span></span>
                <span class="dot-sep">${p.prereq}</span>
              </div>

              <div class="objectives">
                <p class="objectives__title">À la fin de cette leçon, tu sauras</p>
                <ul>
${objectives}
                </ul>
              </div>
            </header>

            <details class="toc-inline" open>
              <summary>Sommaire de la leçon</summary>
              <nav class="toc" aria-label="Sommaire de la leçon"><div data-toc></div></nav>
            </details>

            <article class="prose">
${p.body}

              <button class="btn btn--primary" data-complete-toggle aria-pressed="false">
                <span>Marquer comme terminée</span>
              </button>

              <nav class="lesson-nav" data-lesson-nav aria-label="Navigation entre leçons"></nav>
            </article>
          </div>

          <aside class="lesson-rail lesson-toc-rail" aria-label="Sommaire">
            <p class="toc__title">Sur cette page</p>
            <nav class="toc" aria-label="Sommaire de la leçon"><div data-toc></div></nav>
          </aside>
        </div>
      </div>
    </main>

    <footer class="site-footer">
      <div class="container">
        <div class="site-footer__bottom">
          <span>© <span data-year>2026</span> Syntaxe. Projet de démonstration.</span>
          <span><a href="cours.html">← Retour au programme du cours</a></span>
        </div>
      </div>
    </footer>

    <script src="../../js/data.js" defer></script>
    <script src="../../js/main.js" defer></script>
    <script src="../../js/lecon.js" defer></script>
    <script src="../../js/runner.js" defer></script>
    <script src="../../assets/vendor/prism/prism-core.min.js" defer></script>
    <script src="../../assets/vendor/prism/prism-clike.min.js" defer></script>
    <script src="../../assets/vendor/prism/prism-javascript.min.js" defer></script>
    <script src="../../assets/vendor/prism/prism-bash.min.js" defer></script>
  </body>
</html>
`;
}

const ICON_NOTE = '<svg class="callout__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M12 8h.01M11 12h1v4h1" /></svg>';
const ICON_WARN = '<svg class="callout__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" /><path d="M12 9v4M12 17h.01" /></svg>';
const ICON_TIP = '<svg class="callout__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12c.7.7 1 1.2 1 2h6c0-.8.3-1.3 1-2a7 7 0 0 0-4-12Z" /></svg>';
const ICON_MORE = '<svg class="callout__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 3v14M5 10l7 7 7-7M5 21h14" /></svg>';

const INSTRUCTIONS = `Tu rédiges une leçon de COMPLÉMENTS du cours « Node.js : JavaScript côté serveur » (Syntaxe). Public : a fini les
14 leçons (runtime, modules CommonJS/ESM, npm, boucle d'événements, promesses/async-await, EventEmitter, streams,
système de fichiers, process/env, serveur HTTP, API REST avec Express, middleware, tests, sécurité, déploiement).
Ces leçons ajoutent la connexion à une base de données, l'authentification (mots de passe + JWT) et le temps réel (WebSockets).
Français, tutoiement, ton précis et technique. Node MODERNE (ESM par défaut, async/await, Node 18+/20+). NE réexplique pas les bases.

PAS D'EXÉCUTION DANS LE NAVIGATEUR : ce code a besoin d'un serveur, d'un réseau ou d'une base — il ne tourne pas dans
l'éditeur du site. N'invite JAMAIS à cliquer « Tester »/« Aperçu ». Montre le code et DÉCRIS le comportement attendu
(sortie du terminal en commentaire, réponse curl, etc.).

TU PRODUIS UNIQUEMENT { metaDesc, objectives, body } :
- metaDesc : ~150 caractères.
- objectives : 3 à 4 chaînes (« savoir faire X »), HTML inline autorisé (<code>, <strong>). «&nbsp;;» puis «.» pour la dernière.
- body : HTML INTÉRIEUR de <article class="prose"> (sans la balise article, sans bouton « terminer », sans nav).

STRUCTURE (≈1300–1800 mots) : 1–2 <p> d'intro ; 5–8 sections <h2> (chacune avec un exemple commenté) ;
<h2>Pièges fréquents</h2> ; <h2>Pour aller plus loin</h2> ; <h2>Récap et vérification</h2> (résumé <ul> + lesson-check) ;
<h2>Exercices</h2> (3 gradués avec solutions repliables contenant du code).

COMPOSANTS (n'invente pas d'autres classes) :
- Code Node/JS : <figure class="code-block" data-file="app.js"><pre><code class="language-javascript">… CODE ÉCHAPPÉ …</code></pre></figure>.
- Commandes terminal/npm : <figure class="code-block" data-file="Terminal"><pre><code class="language-bash">… ÉCHAPPÉ …</code></pre></figure>. Légende : <p class="code-caption">…</p>
- Note : <div class="callout callout--note">${ICON_NOTE}<div class="callout__body"><p class="callout__title">Note</p><p>…</p></div></div>
- Piège : <div class="callout callout--warn">${ICON_WARN}<div class="callout__body"><p class="callout__title">Piège fréquent</p><p>…</p></div></div>
- Astuce : <div class="callout callout--tip">${ICON_TIP}<div class="callout__body"><p class="callout__title">Astuce</p><p>…</p></div></div>
- Pour aller plus loin : <div class="callout callout--more">${ICON_MORE}<div class="callout__body"><p class="callout__title">Pour aller plus loin</p><p>…</p></div></div>
- Vérification : <div class="lesson-check"><p class="kicker kicker--gold">Vérifie ta compréhension</p><ol><li>…</li><li>…</li><li>…</li></ol></div>
- Exercice : <div class="exercise"><div class="exercise__head"><span class="exercise__num">Exercice 1</span><span class="exercise__level">Échauffement</span></div><p>…</p><details><summary>Voir une solution</summary><figure class="code-block" data-file="solution.js"><pre><code class="language-javascript">…</code></pre></figure></details></div>

ÉCHAPPEMENT (ABSOLUMENT CRITIQUE) : DANS un <code>, « < »→« &lt; », « > »→« &gt; », « & »→« &amp; ». Donc les flèches
« () => … »→« () =&gt; … », les « a && b »→« a &amp;&amp; b », les « a || b » restent, les comparaisons « n > 0 »→« n &gt; 0 »,
les redirections shell « 2>&1 »→« 2&gt;&amp;1 », les opérateurs « &amp;&amp; » en bash. AUCUN « < », « > » ou « & » brut dans un &lt;code&gt;.

RÈGLES : Node idiomatique (async/await, gestion d'erreurs, requêtes paramétrées contre l'injection). JAMAIS de secret en
clair dans le code (variables d'environnement). Aucun style=, aucun <style>, aucun <script> RÉEL dans la page.`;

const SCHEMA = {
  type: 'object', additionalProperties: false,
  required: ['metaDesc', 'objectives', 'body'],
  properties: {
    metaDesc: { type: 'string' },
    objectives: { type: 'array', items: { type: 'string' }, minItems: 3, maxItems: 4 },
    body: { type: 'string' },
  },
};

const SPECS = [
  { num: '15', modNum: '06', modName: 'Données, authentification & temps réel', level: 'intermediaire', durationMin: 32, title: 'Connecter une base de données', prereq: 'Cours Node.js + notions SQL recommandés',
    brief: `Sujet : remplacer le tableau en mémoire par une VRAIE base de données depuis Node.
Sections : (1) Le problème : les données en mémoire disparaissent au redémarrage ; il faut un stockage PERSISTANT. Deux familles : relationnel (PostgreSQL/MySQL/SQLite, voir le cours SQL) et NoSQL (MongoDB). On choisit PostgreSQL avec le pilote « pg » (et SQLite via node:sqlite ou better-sqlite3 en mention pour les petits projets). (2) Installer et CONNECTER : npm install pg ; un Pool de connexions (pas une connexion unique) ; lire l'URL de connexion depuis process.env (JAMAIS en dur). (3) REQUÊTER : await pool.query(text, params) ; le résultat result.rows. Toujours du async/await avec try/catch. (4) Les REQUÊTES PARAMÉTRÉES ($1, $2) : la défense contre l'INJECTION SQL — NE JAMAIS concaténer une entrée utilisateur dans la requête. (5) Brancher sur une route Express : GET /livres lit en base, POST /livres insère avec RETURNING. (6) Les TRANSACTIONS : BEGIN/COMMIT/ROLLBACK pour les opérations multi-étapes (ex. virement) ; libérer le client. (7) Un mot sur les ORM/query builders (Prisma, Knex, Drizzle) qui automatisent migrations et typage. Code Node commenté + sorties.
Pièges : concaténer les entrées dans le SQL (injection) au lieu de $1/$2 ; ouvrir une connexion par requête au lieu d'un pool ; oublier le try/catch (rejet non géré) ; mettre l'URL/mot de passe en dur dans le code ; ne pas libérer le client d'une transaction (fuite).
Pour aller plus loin : les ORM (Prisma, Drizzle), les migrations, le pooling externe (PgBouncer), MongoDB avec Mongoose, le cours SQL pour les requêtes avancées.
Exercices : (1) se connecter avec un Pool et faire un SELECT simple en async/await ; (2) une route GET /users/:id en requête paramétrée ; (3) un INSERT ... RETURNING déclenché par POST.`,
  },
  { num: '16', modNum: '06', modName: 'Données, authentification & temps réel', level: 'avance', durationMin: 34, title: 'Authentification : mots de passe et JWT', prereq: 'Leçon 15 recommandée',
    brief: `Sujet : authentifier les utilisateurs d'une API Node de façon sûre.
Sections : (1) AUTHENTIFICATION (qui es-tu) vs AUTORISATION (as-tu le droit). (2) Stocker un mot de passe : JAMAIS en clair, JAMAIS un simple hash type SHA-256 ; on utilise bcrypt (ou argon2) avec un SEL et un coût ajustable : await bcrypt.hash(motDePasse, 12) à l'inscription, await bcrypt.compare(saisi, hash) à la connexion. (3) Les JETONS JWT : après une connexion réussie, le serveur signe un jeton (jsonwebtoken : jwt.sign(payload, secret, { expiresIn })) ; le client le renvoie à chaque requête dans l'en-tête Authorization: Bearer <token>. Le serveur le vérifie (jwt.verify) sans état côté serveur. (4) Un MIDDLEWARE d'authentification Express : (req, res, next) qui lit l'en-tête, vérifie le jeton, pose req.user ou répond 401. (5) PROTÉGER des routes en appliquant ce middleware ; l'autorisation par rôle (req.user.role). (6) La SÉCURITÉ : le secret dans process.env, HTTPS obligatoire, expiration courte + refresh token, cookies httpOnly comme alternative au stockage du jeton côté client, ne jamais renvoyer le hash. Code commenté.
Pièges : stocker les mots de passe en clair ou avec un hash rapide non salé ; mettre le secret JWT en dur ; un jeton sans expiration ; renvoyer le mot de passe/hash dans la réponse JSON ; confondre authentification et autorisation ; faire confiance à un payload JWT non vérifié.
Pour aller plus loin : OAuth 2 / OpenID Connect (« Se connecter avec Google »), Passport.js, les sessions côté serveur (express-session), les refresh tokens, la limitation de débit (rate limiting) contre le brute-force.
Exercices : (1) hacher puis vérifier un mot de passe avec bcrypt ; (2) signer un JWT à la connexion et le renvoyer ; (3) un middleware qui protège GET /profil et renvoie 401 sans jeton valide.`,
  },
  { num: '17', modNum: '06', modName: 'Données, authentification & temps réel', level: 'avance', durationMin: 32, title: 'Le temps réel avec les WebSockets', prereq: 'Leçon 16 recommandée',
    brief: `Sujet : ajouter de la communication BIDIRECTIONNELLE en temps réel à une application Node.
Sections : (1) La LIMITE de HTTP : le client demande, le serveur répond — le serveur ne peut pas « pousser » spontanément. Le polling (interroger en boucle) est lourd. Les WEBSOCKETS ouvrent une connexion PERSISTANTE et bidirectionnelle (ws://, wss:// en TLS) après un « handshake » HTTP (en-tête Upgrade). (2) Un serveur avec la bibliothèque « ws » : new WebSocketServer({ server }) ; les événements 'connection', puis sur chaque socket 'message', 'close', 'error' ; envoyer avec socket.send(...). (3) DIFFUSER (broadcast) à tous les clients : parcourir wss.clients et envoyer à ceux dont readyState === OPEN — un mini-chat. (4) Côté navigateur : new WebSocket(url), les événements onopen/onmessage/onclose et ws.send (rappel, le client est du JS navigateur). (5) Socket.IO : la couche au-dessus qui ajoute la reconnexion auto, les « rooms », les salons et un repli si WebSocket indisponible ; quand le préférer à « ws » brut. (6) Robustesse : le heartbeat (ping/pong) pour détecter les morts, gérer la montée en charge (plusieurs instances + adaptateur Redis), valider/authentifier à la connexion (réutiliser le JWT de la leçon précédente). Code serveur + client commenté.
Pièges : croire que WebSocket remplace HTTP (il le complète) ; oublier de vérifier readyState avant d'envoyer (erreur sur un socket fermé) ; ne pas gérer 'close'/'error' (fuites, sockets morts) ; ne pas authentifier la connexion ; ignorer la montée en charge multi-instances (un broadcast ne touche que les clients de l'instance locale).
Pour aller plus loin : Socket.IO et ses rooms, l'adaptateur Redis pour le multi-instances, les Server-Sent Events (SSE) pour un flux unidirectionnel plus simple, WebRTC pour le pair-à-pair, les files de messages (RabbitMQ, Kafka).
Exercices : (1) un serveur « ws » qui renvoie en écho chaque message reçu ; (2) un broadcast à tous les clients connectés (mini-chat) ; (3) un client navigateur qui se connecte, envoie un message et affiche les réponses.`,
  },
];

log('Rédaction de ' + SPECS.length + ' leçons (compléments Node.js)…');

const results = await pipeline(
  SPECS,
  (s) =>
    agent(
      INSTRUCTIONS +
        '\n\n=== LEÇON À RÉDIGER ===\nNuméro : ' + s.num + ' | Module ' + s.modNum + ' (' + s.modName + ')\nTitre : ' + s.title +
        '\n\nBRIEF DÉTAILLÉ (intègre fidèlement le contenu ; décris le comportement ; ÉCHAPPE toutes les flèches =>, les && et les <, >, &) :\n' + s.brief,
      { label: 'écrit L' + s.num, phase: 'Rédaction', schema: SCHEMA }
    ),
  (parts, s) =>
    agent(
      INSTRUCTIONS +
        '\n\n=== RELECTURE CRITIQUE (corrige et renvoie la version finale, même schéma) ===\nLeçon ' + s.num + ' « ' + s.title + ' ».\n' +
        '1. EXACTITUDE du Node moderne (pg/pool/requêtes paramétrées ; OU bcrypt/JWT/middleware d\'auth ; OU ws/broadcast/Socket.IO selon la leçon).\n' +
        '2. SÉCURITÉ : requêtes paramétrées, secrets en process.env, mots de passe hachés (bcrypt), jamais de secret en dur.\n' +
        '3. PAS d\'invitation à « Tester »/« Aperçu ».\n' +
        '4. ÉCHAPPEMENT (CRITIQUE) : les flèches « =&gt; », « < »→« &lt; », « > »→« &gt; », « & »→« &amp; » (dont &amp;&amp; et 2&gt;&amp;1). AUCUN chevron ni & brut dans un &lt;code&gt;.\n' +
        '5. STRUCTURE : intro, 5–8 sections <h2>, Pièges fréquents, Pour aller plus loin, Récap et vérification (lesson-check), Exercices (3 avec solutions).\n' +
        '6. Public a fini le cours ; aucun style/script réel dans la page.\n\n' +
        'BRIEF DE RÉFÉRENCE :\n' + s.brief + '\n\nBROUILLON (JSON) :\n' + JSON.stringify(parts),
      { label: 'relit L' + s.num, phase: 'Relecture', schema: SCHEMA }
    ).then((fixed) => {
      const p = fixed || parts;
      const html = buildLesson({
        num: s.num, modNum: s.modNum, modName: s.modName, level: s.level, durationMin: s.durationMin,
        title: s.title, prereq: s.prereq, metaDesc: p.metaDesc, objectives: p.objectives, body: p.body,
      });
      return { file: 'lecon-' + s.num + '.html', html, num: s.num };
    })
);

const ok = results.filter(Boolean);
log('Leçons assemblées : ' + ok.length + '/' + SPECS.length);
return ok;
