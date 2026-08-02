export const meta = {
  name: 'syntaxe-html-avance-comp',
  description: 'Rédige 2 leçons de compléments du cours HTML avancé (drag & drop + History, sécurité client)',
  phases: [{ title: 'Rédaction' }, { title: 'Relecture' }],
};

function buildLesson(p) {
  const objectives = p.objectives.map((o) => '                  <li>' + o + '</li>').join('\n');
  return `<!DOCTYPE html>
<html lang="fr" data-theme="light">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${p.title} — Leçon ${p.num} · HTML avancé · Syntaxe</title>
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

  <body data-course="html-avance" data-lesson="lecon-${p.num}.html">
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
            <li><a href="cours.html">HTML avancé</a></li>
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
    <script src="../../assets/vendor/prism/prism-css.min.js" defer></script>
    <script src="../../assets/vendor/prism/prism-javascript.min.js" defer></script>
  </body>
</html>
`;
}

const ICON_NOTE = '<svg class="callout__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M12 8h.01M11 12h1v4h1" /></svg>';
const ICON_WARN = '<svg class="callout__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" /><path d="M12 9v4M12 17h.01" /></svg>';
const ICON_TIP = '<svg class="callout__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12c.7.7 1 1.2 1 2h6c0-.8.3-1.3 1-2a7 7 0 0 0-4-12Z" /></svg>';
const ICON_MORE = '<svg class="callout__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 3v14M5 10l7 7 7-7M5 21h14" /></svg>';

const INSTRUCTIONS = `Tu rédiges une leçon de COMPLÉMENTS du cours « HTML avancé : le web platform moderne » (Syntaxe). Public :
développeurs ayant fini ce cours (details/dialog/popover, Web Components, ARIA, schema.org, PWA, perf, i18n) et qui
connaissent un peu JavaScript. Ces deux leçons ajoutent des API d'interaction et la sécurité côté client. Français,
tutoiement, ton précis et technique. Plateforme web MODERNE. NE réexplique pas les bases.

ATOUT : un bouton « 👁 Aperçu » rend les blocs HTML dans une iframe (qui autorise les scripts). Pour une démo
interactive (glisser-déposer…), écris un bloc <figure class="code-block" data-file="demo.html"><pre><code class="language-markup">
avec une PETITE structure HTML et un &lt;script&gt; ÉCHAPPÉS. Pour le code JS seul, utilise class="language-javascript".

TU PRODUIS UNIQUEMENT { metaDesc, objectives, body } :
- metaDesc : ~150 caractères.
- objectives : 3 à 4 chaînes (« savoir faire X »), HTML inline autorisé (<code>, <strong>). «&nbsp;;» puis «.» pour la dernière.
- body : HTML INTÉRIEUR de <article class="prose"> (sans la balise article, sans bouton « terminer », sans nav).

STRUCTURE (≈1200–1700 mots) : 1–2 <p> d'intro ; 5–8 sections <h2> (chacune avec un exemple commenté) ;
<h2>Pièges fréquents</h2> ; <h2>Pour aller plus loin</h2> ; <h2>Récap et vérification</h2> (résumé <ul> + lesson-check) ;
<h2>Exercices</h2> (3 gradués avec solutions repliables).

COMPOSANTS (n'invente pas d'autres classes) :
- Démo HTML : <figure class="code-block" data-file="demo.html"><pre><code class="language-markup">…</code></pre></figure>.
- Code JS : class="language-javascript". Légende : <p class="code-caption">…</p>
- Note : <div class="callout callout--note">${ICON_NOTE}<div class="callout__body"><p class="callout__title">Note</p><p>…</p></div></div>
- Piège : <div class="callout callout--warn">${ICON_WARN}<div class="callout__body"><p class="callout__title">Piège fréquent</p><p>…</p></div></div>
- Astuce : <div class="callout callout--tip">${ICON_TIP}<div class="callout__body"><p class="callout__title">Astuce</p><p>…</p></div></div>
- Pour aller plus loin : <div class="callout callout--more">${ICON_MORE}<div class="callout__body"><p class="callout__title">Pour aller plus loin</p><p>…</p></div></div>
- Vérification : <div class="lesson-check"><p class="kicker kicker--gold">Vérifie ta compréhension</p><ol><li>…</li><li>…</li><li>…</li></ol></div>
- Exercice : <div class="exercise"><div class="exercise__head"><span class="exercise__num">Exercice 1</span><span class="exercise__level">Échauffement</span></div><p>…</p><details><summary>Voir une solution</summary><figure class="code-block" data-file="solution.html"><pre><code class="language-markup">…</code></pre></figure></details></div>

ÉCHAPPEMENT (CRITIQUE) : DANS un <code>, « < »→« &lt; », « > »→« &gt; », « & »→« &amp; » (dont &amp;&amp; et la flèche =&gt;).
Toute balise est échappée (&lt;script&gt;, &lt;meta&gt;, &lt;iframe&gt;…). Aucun « < », « > » ou « & » brut dans un &lt;code&gt;.

RÈGLES : HTML/JS d'exemple VALIDE et SÛR. Aucun style=, aucun &lt;style&gt;/&lt;script&gt; RÉEL dans la page
(le HTML/JS d'exemple n'apparaît qu'ÉCHAPPÉ dans des blocs de code).`;

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
  { num: '13', modNum: '06', modName: 'Interactions & sécurité', durationMin: 30, title: 'Glisser-déposer et l\'API History', prereq: 'Cours HTML avancé recommandé',
    brief: `Sujet : deux API de plateforme pour des interactions riches.
Sections : (1) Le GLISSER-DÉPOSER natif : rendre un élément déplaçable avec draggable="true" ; les événements côté SOURCE (dragstart, dragend) et côté CIBLE (dragenter, dragover — preventDefault OBLIGATOIRE pour autoriser le dépôt —, dragleave, drop). (2) L'objet dataTransfer : setData / getData (avec un type MIME), effectAllowed / dropEffect (le curseur). (3) Glisser des FICHIERS depuis le système (dataTransfer.files) pour un dépôt d'upload. (4) L'ACCESSIBILITÉ du glisser-déposer (souvent médiocre — prévoir une alternative clavier / boutons). (5) L'API HISTORY : history.pushState(state, "", url) et replaceState pour changer l'URL SANS recharger la page ; l'événement popstate (boutons Précédent/Suivant) ; bâtir une navigation « single page ». (6) history.back() / forward() / go() ; un state SÉRIALISABLE. (7) Le lien avec le routage (cours React). Donne une démo HTML+JS échappée (le glisser-déposer est prévisualisable via « 👁 Aperçu »).
Pièges : OUBLIER preventDefault sur dragover (le drop ne se déclenche jamais) ; un glisser-déposer inaccessible au clavier ; croire que pushState déclenche popstate (NON — seule la navigation utilisateur le fait) ; un state non sérialisable ; casser le bouton « Précédent ».
Pour aller plus loin : l'API File (lecture des fichiers déposés), les bibliothèques de DnD accessibles, l'API Navigation (récente), le routage côté client.
Exercices : (1) rendre un élément déplaçable et créer une zone de dépôt ; (2) lire la liste des fichiers déposés ; (3) changer l'URL avec pushState puis réagir à popstate.`,
  },
  { num: '14', modNum: '06', modName: 'Interactions & sécurité', durationMin: 30, title: 'Sécurité côté client (CSP, SRI, sandbox)', prereq: 'Leçon 13 recommandée',
    brief: `Sujet : protéger les utilisateurs directement depuis le HTML et les en-têtes.
Sections : (1) Les MENACES côté client : le XSS (injection de script), le clickjacking, les dépendances compromises. (2) La CSP (Content-Security-Policy) : une LISTE BLANCHE des sources autorisées (script-src, style-src, img-src…), via un en-tête HTTP ou une &lt;meta http-equiv&gt; ; bloque le JS injecté et le JS inline ; les valeurs 'self', 'nonce-…', 'strict-dynamic'. (3) Le SRI (Subresource Integrity) : l'attribut integrity (un hash) + crossorigin sur un &lt;script&gt; ou &lt;link&gt; chargé d'un CDN → le navigateur REFUSE un fichier altéré. (4) L'iframe SANDBOX : sandbox="allow-scripts allow-forms…" pour ISOLER du contenu tiers ; le danger de combiner allow-scripts ET allow-same-origin sur du contenu non fiable. (5) Les liens : rel="noopener noreferrer" sur target="_blank" (éviter le « tabnabbing ») ; referrerpolicy. (6) HTTPS et les en-têtes utiles (X-Content-Type-Options: nosniff, frame-ancestors / X-Frame-Options). (7) Échapper les données utilisateur (rappel : textContent plutôt qu'innerHTML). Donne des exemples (&lt;meta&gt; CSP, &lt;script&gt; integrity, &lt;iframe sandbox&gt;).
Pièges : une CSP avec 'unsafe-inline' (annule la protection) ; integrity SANS crossorigin (ne fonctionne pas) ; target="_blank" sans noopener (tabnabbing) ; injecter du HTML utilisateur avec innerHTML ; sandbox allow-scripts + allow-same-origin sur du contenu non fiable.
Pour aller plus loin : les nonces CSP, Trusted Types, Permissions-Policy, les rapports CSP (report-to), l'audit des dépendances.
Exercices : (1) écrire une &lt;meta&gt; CSP qui n'autorise que ses propres scripts ; (2) ajouter integrity + crossorigin à un script de CDN ; (3) sécuriser un lien target="_blank".`,
  },
];

log('Rédaction de ' + SPECS.length + ' leçons (compléments HTML avancé)…');

const results = await pipeline(
  SPECS,
  (s) =>
    agent(
      INSTRUCTIONS +
        '\n\n=== LEÇON À RÉDIGER ===\nNuméro : ' + s.num + ' | Module ' + s.modNum + ' (' + s.modName + ')\nTitre : ' + s.title +
        '\n\nBRIEF DÉTAILLÉ (intègre fidèlement le contenu ; démos échappées ; échappe < > & et => dans le code) :\n' + s.brief,
      { label: 'écrit L' + s.num, phase: 'Rédaction', schema: SCHEMA }
    ),
  (parts, s) =>
    agent(
      INSTRUCTIONS +
        '\n\n=== RELECTURE CRITIQUE (corrige et renvoie la version finale, même schéma) ===\nLeçon ' + s.num + ' « ' + s.title + ' ».\n' +
        '1. EXACTITUDE (Drag & Drop + History API ; OU CSP/SRI/sandbox selon la leçon).\n' +
        '2. APERÇU : les démos interactives sont des blocs language-markup ÉCHAPPÉS (avec &lt;script&gt; échappé) ; le code JS seul en language-javascript.\n' +
        '3. ÉCHAPPEMENT : DANS les blocs de code, « < »→« &lt; », « > »→« &gt; », « & »→« &amp; » (dont &amp;&amp; et =&gt;). Aucune balise réelle dans un &lt;code&gt;.\n' +
        '4. STRUCTURE : intro, 5–8 sections <h2>, Pièges fréquents, Pour aller plus loin, Récap et vérification (lesson-check), Exercices (3 avec solutions).\n' +
        '5. Public AVANCÉ ; aucun style/script réel dans la page.\n\n' +
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
