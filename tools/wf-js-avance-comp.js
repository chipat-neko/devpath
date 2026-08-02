export const meta = {
  name: 'syntaxe-js-avance-comp',
  description: 'Rédige 3 leçons de compléments du cours JavaScript avancé (binaire, Web Workers, Streams) et assemble le HTML',
  phases: [{ title: 'Rédaction' }, { title: 'Relecture' }],
};

function buildLesson(p) {
  const objectives = p.objectives.map((o) => '                  <li>' + o + '</li>').join('\n');
  return `<!DOCTYPE html>
<html lang="fr" data-theme="light">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${p.title} — Leçon ${p.num} · JavaScript avancé · Syntaxe</title>
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

  <body data-course="js-avance" data-lesson="lecon-${p.num}.html">
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
            <li><a href="cours.html">JavaScript avancé</a></li>
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
                <span class="dot-sep"><span class="pill pill--avance">Avancé</span></span>
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
    <script src="../../assets/vendor/prism/prism-markup.min.js" defer></script>
    <script src="../../assets/vendor/prism/prism-javascript.min.js" defer></script>
  </body>
</html>
`;
}

const ICON_NOTE = '<svg class="callout__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M12 8h.01M11 12h1v4h1" /></svg>';
const ICON_WARN = '<svg class="callout__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" /><path d="M12 9v4M12 17h.01" /></svg>';
const ICON_TIP = '<svg class="callout__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12c.7.7 1 1.2 1 2h6c0-.8.3-1.3 1-2a7 7 0 0 0-4-12Z" /></svg>';
const ICON_MORE = '<svg class="callout__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 3v14M5 10l7 7 7-7M5 21h14" /></svg>';

const INSTRUCTIONS = `Tu rédiges une leçon de COMPLÉMENTS du cours « JavaScript avancé : niveau expert » (site Syntaxe).
Public : développeurs EXPERTS qui ont fini ce cours (Symboles, Proxy/Reflect, async expert, patterns, mémoire, regex
avancées, Intl, décorateurs). Ces leçons ajoutent la plateforme bas niveau : données binaires, parallélisme, flux.
Français, tutoiement, ton précis et technique. JavaScript MODERNE. NE réexplique pas les bases.

ÉDITEUR INTÉGRÉ : un bouton « ▶ Tester » apparaît sur les blocs language-javascript de LOGIQUE PURE (sans
document/window/Worker/postMessage/SharedArrayBuffer…). Les exemples de TypedArray/DataView sur de la logique pure
sont exécutables : montre une sortie en commentaire (// affiche: …). Les exemples qui touchent au navigateur ou aux
Workers ne sont PAS exécutables ici : décris leur effet en commentaire. N'invite pas explicitement à cliquer.

TU PRODUIS UNIQUEMENT { metaDesc, objectives, body } :
- metaDesc : ~150 caractères.
- objectives : 3 à 4 chaînes (« savoir faire X »), HTML inline autorisé (<code>, <strong>). «&nbsp;;» puis «.» pour la dernière.
- body : HTML INTÉRIEUR de <article class="prose"> (sans la balise article, sans bouton « terminer », sans nav).

STRUCTURE (≈1300–1800 mots) : 1–2 <p> d'intro ; 5–8 sections <h2> (chacune avec un exemple commenté) ;
<h2>Pièges fréquents</h2> ; <h2>Pour aller plus loin</h2> ; <h2>Récap et vérification</h2> (résumé <ul> + lesson-check) ;
<h2>Exercices</h2> (3 gradués avec solutions repliables contenant du code).

COMPOSANTS (n'invente pas d'autres classes) :
- Code JS : <figure class="code-block" data-file="script.js"><pre><code class="language-javascript">… CODE ÉCHAPPÉ …</code></pre></figure>.
- Exemple HTML : class="language-markup" (balises ÉCHAPPÉES). Légende : <p class="code-caption">…</p>
- Note : <div class="callout callout--note">${ICON_NOTE}<div class="callout__body"><p class="callout__title">Note</p><p>…</p></div></div>
- Piège : <div class="callout callout--warn">${ICON_WARN}<div class="callout__body"><p class="callout__title">Piège fréquent</p><p>…</p></div></div>
- Astuce : <div class="callout callout--tip">${ICON_TIP}<div class="callout__body"><p class="callout__title">Astuce</p><p>…</p></div></div>
- Pour aller plus loin : <div class="callout callout--more">${ICON_MORE}<div class="callout__body"><p class="callout__title">Pour aller plus loin</p><p>…</p></div></div>
- Vérification : <div class="lesson-check"><p class="kicker kicker--gold">Vérifie ta compréhension</p><ol><li>…</li><li>…</li><li>…</li></ol></div>
- Exercice : <div class="exercise"><div class="exercise__head"><span class="exercise__num">Exercice 1</span><span class="exercise__level">Échauffement</span></div><p>…</p><details><summary>Voir une solution</summary><figure class="code-block" data-file="solution.js"><pre><code class="language-javascript">…</code></pre></figure></details></div>

ÉCHAPPEMENT (CRITIQUE) : DANS un <code>, « < »→« &lt; », « > »→« &gt; », « & »→« &amp; » (dont &amp;&amp; et la flèche =&gt;).
Aucun « < », « > » ou « & » brut dans un &lt;code&gt;.

RÈGLES : JavaScript idiomatique et exact. Aucun style=, aucun <style>, aucun <script> RÉEL dans la page (ton body = prose + blocs de code).`;

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
  { num: '13', modNum: '05', modName: 'La plateforme bas niveau & les flux', durationMin: 30, title: 'Données binaires : ArrayBuffer, TypedArray, DataView', prereq: 'Cours JS avancé recommandé',
    brief: `Sujet : manipuler des données binaires (octets bruts) en JavaScript.
Sections : (1) Pourquoi : traiter des octets bruts — fichiers, protocoles réseau, WebGL, audio, formats binaires. (2) ArrayBuffer : un bloc de MÉMOIRE BRUTE de taille fixe (en octets), non lisible directement. (3) Les VUES TypedArray : Uint8Array, Int16Array, Float64Array… une fenêtre TYPÉE sur un ArrayBuffer (length, BYTES_PER_ELEMENT, .buffer, subarray) ; deux vues sur le MÊME buffer partagent la mémoire (modifier l'une change l'autre). (4) DataView : lire/écrire des valeurs HÉTÉROGÈNES à des offsets précis avec contrôle de l'ENDIANNESS (getInt32(offset, littleEndian), setFloat64…). (5) Conversions texte↔octets : TextEncoder / TextDecoder (UTF-8) ; le base64 (atob/btoa) et sa limite sur le binaire. (6) Blob et File (intro) : données binaires de haut niveau ; Blob.arrayBuffer(), URL.createObjectURL. (7) Cas réel : lire l'en-tête d'un fichier / parser un format binaire. Les exemples de pure logique TypedArray sont exécutables (sortie en commentaire).
Pièges : confondre l'ArrayBuffer (la mémoire) et la vue (l'interface) ; ignorer l'endianness avec DataView ; le partage de mémoire involontaire entre vues ; base64 et caractères non-ASCII ; dépasser les bornes.
Pour aller plus loin : SharedArrayBuffer & Atomics (leçon suivante), la mémoire WebAssembly, les flux binaires (Streams, leçon 15), ImageData (Canvas/WebGL).
Exercices : (1) écrire puis relire des entiers dans un ArrayBuffer via une Uint8Array ; (2) lire un Float en big-endian avec DataView ; (3) encoder une chaîne en UTF-8 avec TextEncoder et compter ses octets.`,
  },
  { num: '14', modNum: '05', modName: 'La plateforme bas niveau & les flux', durationMin: 30, title: 'Web Workers et parallélisme', prereq: 'Leçon 13 recommandée',
    brief: `Sujet : exécuter du JavaScript en VRAI parallèle, hors du thread principal.
Sections : (1) Le problème : JS est mono-thread ; une tâche CPU lourde GÈLE l'interface. Les WEB WORKERS exécutent du code sur un AUTRE thread. (2) Créer : new Worker("worker.js") ; communiquer par MESSAGES — worker.postMessage(data) et worker.onmessage côté principal ; self.onmessage / self.postMessage côté worker ; PAS d'accès au DOM. (3) Le passage de données : le « structured clone » (COPIE) vs le TRANSFER (transferable objects : un ArrayBuffer transféré SANS copie via postMessage(buf, [buf])). (4) SharedArrayBuffer : une mémoire PARTAGÉE entre threads ; les opérations ATOMIQUES (Atomics.add, Atomics.wait/notify) pour éviter les conditions de course. (5) Les variantes : dedicated workers, shared workers (mention), service workers (mention, PWA). (6) Un POOL de workers pour paralléliser un calcul (diviser pour régner). (7) Quand : calcul CPU lourd (image, crypto, parsing) — JAMAIS pour l'I/O (déjà asynchrone). Les exemples de Worker ne sont pas exécutables dans l'éditeur (décris l'effet en commentaire).
Pièges : croire que les workers partagent la mémoire par défaut (les messages sont COPIÉS) ; accéder au DOM depuis un worker (impossible) ; oublier worker.terminate() ; conditions de course sur un SharedArrayBuffer sans Atomics ; surcoût de création pour de petites tâches.
Pour aller plus loin : Comlink (RPC sur worker), OffscreenCanvas, les threads WebAssembly, les en-têtes COOP/COEP requis pour SharedArrayBuffer.
Exercices : (1) décrire l'échange de messages principal↔worker pour un calcul ; (2) transférer un ArrayBuffer sans copie ; (3) expliquer le rôle des Atomics sur un SharedArrayBuffer.`,
  },
  { num: '15', modNum: '05', modName: 'La plateforme bas niveau & les flux', durationMin: 30, title: 'La Streams API', prereq: 'Leçon 14 recommandée',
    brief: `Sujet : traiter des données en FLUX, morceau par morceau, sans tout charger en mémoire.
Sections : (1) Pourquoi : traiter de gros volumes (téléchargement, fichiers, vidéo) et commencer à traiter AVANT la fin. (2) ReadableStream : une source lisible par MORCEAUX (chunks) ; le reader (getReader(), read() → { value, done }) ; la boucle de lecture. (3) WritableStream : une destination ; le writer. (4) TransformStream : transformer un flux à la volée (ex. décoder, découper en lignes, compresser). (5) CHAÎNER avec pipeThrough() et pipeTo() (response.body.pipeThrough(new TextDecoderStream())). (6) fetch en STREAMING : response.body est un ReadableStream — lire une réponse au fur et à mesure et afficher une progression. (7) La BACKPRESSURE : le consommateur régule le producteur (concept clé). Les exemples (fetch streaming) sont décrits en commentaire.
Pièges : tout bufferiser au lieu de streamer (perd l'intérêt) ; oublier reader.releaseLock() ; ignorer la backpressure ; confondre les Streams WEB et les streams Node (API différentes — cours Node.js).
Pour aller plus loin : les TransformStream personnalisés, CompressionStream/DecompressionStream, File.stream(), les streams Node.js.
Exercices : (1) lire une réponse fetch via son ReadableStream et compter les octets reçus ; (2) décoder un flux en texte avec TextDecoderStream et pipeThrough ; (3) expliquer ce qu'est la backpressure.`,
  },
];

log('Rédaction de ' + SPECS.length + ' leçons (compléments JavaScript avancé)…');

const results = await pipeline(
  SPECS,
  (s) =>
    agent(
      INSTRUCTIONS +
        '\n\n=== LEÇON À RÉDIGER ===\nNuméro : ' + s.num + ' | Module ' + s.modNum + ' (' + s.modName + ')\nTitre : ' + s.title +
        '\n\nBRIEF DÉTAILLÉ (intègre fidèlement le contenu ; sorties en commentaire ; échappe < > & et => dans le code) :\n' + s.brief,
      { label: 'écrit L' + s.num, phase: 'Rédaction', schema: SCHEMA }
    ),
  (parts, s) =>
    agent(
      INSTRUCTIONS +
        '\n\n=== RELECTURE CRITIQUE (corrige et renvoie la version finale, même schéma) ===\nLeçon ' + s.num + ' « ' + s.title + ' ».\n' +
        '1. EXACTITUDE du JS moderne (ArrayBuffer/TypedArray/DataView, Web Workers/transfer/Atomics, Streams API selon la leçon) ; exemples corrects.\n' +
        '2. Blocs de logique pure exécutables (sortie en commentaire) ; blocs navigateur/worker décrits (pas d\'invitation à « Tester »).\n' +
        '3. ÉCHAPPEMENT : « < »→« &lt; », « > »→« &gt; », « & »→« &amp; » (dont &amp;&amp; et =&gt;) dans tous les blocs de code. Aucun caractère brut dans un &lt;code&gt;.\n' +
        '4. STRUCTURE : intro, 5–8 sections <h2>, Pièges fréquents, Pour aller plus loin, Récap et vérification (lesson-check), Exercices (3 avec solutions).\n' +
        '5. Public EXPERT ; aucun style/script réel dans la page.\n\n' +
        'BRIEF DE RÉFÉRENCE :\n' + s.brief + '\n\nBROUILLON (JSON) :\n' + JSON.stringify(parts),
      { label: 'relit L' + s.num, phase: 'Relecture', schema: SCHEMA }
    ).then((fixed) => {
      const p = fixed || parts;
      const html = buildLesson({
        num: s.num, modNum: s.modNum, modName: s.modName, durationMin: s.durationMin,
        title: s.title, prereq: s.prereq, metaDesc: p.metaDesc, objectives: p.objectives, body: p.body,
      });
      return { file: 'lecon-' + s.num + '.html', html, num: s.num };
    })
);

const ok = results.filter(Boolean);
log('Leçons assemblées : ' + ok.length + '/' + SPECS.length);
return ok;
