// Workflow GÉNÉRIQUE de création d'un cours complet (réutilisé pour chaque langage via `args`).
// args = {
//   langName, dataCourse, breadcrumb, titleSuffix, prismLangs:[...], codeLang,
//   preamble (intro des INSTRUCTIONS, propre au cours),
//   specs:[{num,modNum,modName,level,durationMin,title,prereq,brief}, ...]
// }
export const meta = {
  name: 'syntaxe-course',
  description: 'Rédige un cours complet (rédacteur + relecteur) à partir d\'une configuration de langage',
  phases: [{ title: 'Rédaction' }, { title: 'Relecture' }],
};

const PILL = { debutant: 'Débutant', intermediaire: 'Intermédiaire', avance: 'Avancé' };

const cfg = typeof args === 'string' ? JSON.parse(args) : args;
if (!cfg || !cfg.specs) {
  throw new Error('Config absente : args=' + (typeof args) + ' ' + JSON.stringify(args).slice(0, 200));
}

function prismTags() {
  const langs = ['core'].concat(cfg.prismLangs || []);
  return langs
    .map((l) => '    <script src="../../assets/vendor/prism/prism-' + l + '.min.js" defer></script>')
    .join('\n');
}

function buildLesson(p) {
  const objectives = p.objectives.map((o) => '                  <li>' + o + '</li>').join('\n');
  const pillClass = 'pill--' + p.level;
  const pillLabel = PILL[p.level];
  return `<!DOCTYPE html>
<html lang="fr" data-theme="light">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${p.title} — Leçon ${p.num}${cfg.titleSuffix}</title>
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

  <body data-course="${cfg.dataCourse}" data-lesson="lecon-${p.num}.html">
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
            <li><a href="cours.html">${cfg.breadcrumb}</a></li>
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
${prismTags()}
  </body>
</html>
`;
}

const ICON_NOTE = '<svg class="callout__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M12 8h.01M11 12h1v4h1" /></svg>';
const ICON_WARN = '<svg class="callout__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" /><path d="M12 9v4M12 17h.01" /></svg>';
const ICON_TIP = '<svg class="callout__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12c.7.7 1 1.2 1 2h6c0-.8.3-1.3 1-2a7 7 0 0 0-4-12Z" /></svg>';
const ICON_MORE = '<svg class="callout__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 3v14M5 10l7 7 7-7M5 21h14" /></svg>';

const RULES =
  '\n\nTU PRODUIS UNIQUEMENT { metaDesc, objectives, body } :\n' +
  '- metaDesc : ~150 caractères.\n' +
  '- objectives : 3 à 4 chaînes (« savoir faire X »), HTML inline autorisé (<code>, <strong>). «&nbsp;;» puis «.» pour la dernière.\n' +
  '- body : HTML INTÉRIEUR de <article class="prose"> (sans la balise article, sans bouton « terminer », sans nav).\n\n' +
  'STRUCTURE (≈1300–1800 mots) : 1–2 <p> d\'intro ; 5–8 sections <h2> (chacune avec un exemple commenté) ;\n' +
  '<h2>Pièges fréquents</h2> ; <h2>Pour aller plus loin</h2> ; <h2>Récap et vérification</h2> (résumé <ul> + lesson-check) ;\n' +
  '<h2>Exercices</h2> (3 gradués avec solutions repliables contenant du code).\n\n' +
  'COMPOSANTS (n\'invente pas d\'autres classes) :\n' +
  '- Code ' + cfg.langName + ' : <figure class="code-block" data-file="' + (cfg.sampleFile || 'exemple') + '"><pre><code class="language-' + cfg.codeLang + '">… CODE ÉCHAPPÉ …</code></pre></figure>.\n' +
  '- Commandes terminal : <figure class="code-block" data-file="Terminal"><pre><code class="language-bash">… ÉCHAPPÉ …</code></pre></figure>. Légende : <p class="code-caption">…</p>\n' +
  '- Note : <div class="callout callout--note">' + ICON_NOTE + '<div class="callout__body"><p class="callout__title">Note</p><p>…</p></div></div>\n' +
  '- Piège : <div class="callout callout--warn">' + ICON_WARN + '<div class="callout__body"><p class="callout__title">Piège fréquent</p><p>…</p></div></div>\n' +
  '- Astuce : <div class="callout callout--tip">' + ICON_TIP + '<div class="callout__body"><p class="callout__title">Astuce</p><p>…</p></div></div>\n' +
  '- Pour aller plus loin : <div class="callout callout--more">' + ICON_MORE + '<div class="callout__body"><p class="callout__title">Pour aller plus loin</p><p>…</p></div></div>\n' +
  '- Vérification : <div class="lesson-check"><p class="kicker kicker--gold">Vérifie ta compréhension</p><ol><li>…</li><li>…</li><li>…</li></ol></div>\n' +
  '- Exercice : <div class="exercise"><div class="exercise__head"><span class="exercise__num">Exercice 1</span><span class="exercise__level">Échauffement</span></div><p>…</p><details><summary>Voir une solution</summary><figure class="code-block" data-file="solution"><pre><code class="language-' + cfg.codeLang + '">…</code></pre></figure></details></div>\n\n' +
  'ÉCHAPPEMENT (ABSOLUMENT CRITIQUE) : DANS un <code>, « < »→« &lt; », « > »→« &gt; », « & »→« &amp; ». Donc les\n' +
  'flèches/opérateurs « => »→« =&gt; », « a && b »→« a &amp;&amp; b », les comparaisons « n > 0 »→« n &gt; 0 », « n < 0 »→« n &lt; 0 »,\n' +
  'les chevrons de type/générique/template « <T> »→« &lt;T&gt; », les redirections shell « 2>&1 »→« 2&gt;&amp;1 », « a << b »→« a &lt;&lt; b ».\n' +
  'AUCUN « < », « > » ou « & » brut dans un &lt;code&gt;. Aucun style=, aucun <style>, aucun <script> RÉEL dans la page.';

const INSTRUCTIONS = cfg.preamble + RULES;

const SCHEMA = {
  type: 'object', additionalProperties: false,
  required: ['metaDesc', 'objectives', 'body'],
  properties: {
    metaDesc: { type: 'string' },
    objectives: { type: 'array', items: { type: 'string' }, minItems: 3, maxItems: 4 },
    body: { type: 'string' },
  },
};

log('Rédaction de ' + cfg.specs.length + ' leçons (cours ' + cfg.langName + ')…');

const results = await pipeline(
  cfg.specs,
  (s) =>
    agent(
      INSTRUCTIONS +
        '\n\n=== LEÇON À RÉDIGER ===\nNuméro : ' + s.num + ' | Module ' + s.modNum + ' (' + s.modName + ')\nTitre : ' + s.title +
        '\n\nBRIEF DÉTAILLÉ (intègre fidèlement ; montre les sorties/erreurs en commentaire ; ÉCHAPPE tous les <, >, & dans le code) :\n' + s.brief,
      { label: 'écrit L' + s.num, phase: 'Rédaction', schema: SCHEMA }
    ),
  (parts, s) =>
    agent(
      INSTRUCTIONS +
        '\n\n=== RELECTURE CRITIQUE (corrige et renvoie la version finale, même schéma) ===\nLeçon ' + s.num + ' « ' + s.title + ' » (' + cfg.langName + ').\n' +
        '1. EXACTITUDE technique et idiomatique du ' + cfg.langName + ' moderne.\n' +
        '2. PÉDAGOGIE : progression du connu vers l\'inconnu ; PAS d\'invitation à « Tester »/« Aperçu » (le code ne s\'exécute pas dans le site).\n' +
        '3. ÉCHAPPEMENT (CRITIQUE) : AUCUN « < », « > » ou « & » brut dans un &lt;code&gt; (flèches « =&gt; », « &amp;&amp; », chevrons « &lt;T&gt; », redirections « 2&gt;&amp;1 », etc.).\n' +
        '4. STRUCTURE : intro, 5–8 <h2>, Pièges fréquents, Pour aller plus loin, Récap et vérification (lesson-check), Exercices (3 avec solutions).\n' +
        '5. Aucun style/script réel ; sorties et erreurs en commentaire dans le code.\n\n' +
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
log('Leçons assemblées : ' + ok.length + '/' + cfg.specs.length);
return ok;
