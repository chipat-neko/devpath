export const meta = {
  name: 'syntaxe-html-comp',
  description: 'Rédige 2 leçons de compléments du cours HTML (images responsives, canvas & graphiques)',
  phases: [{ title: 'Rédaction' }, { title: 'Relecture' }],
};

const PILL = { debutant: 'Débutant', intermediaire: 'Intermédiaire' };

function buildLesson(p) {
  const objectives = p.objectives.map((o) => '                  <li>' + o + '</li>').join('\n');
  const pillClass = 'pill--' + p.level;
  const pillLabel = PILL[p.level];
  return `<!DOCTYPE html>
<html lang="fr" data-theme="light">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${p.title} — Leçon ${p.num} · HTML · Syntaxe</title>
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

  <body data-course="html" data-lesson="lecon-${p.num}.html">
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
            <li><a href="cours.html">HTML</a></li>
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
    <script src="../../assets/vendor/prism/prism-markup.min.js" defer></script>
    <script src="../../assets/vendor/prism/prism-css.min.js" defer></script>
  </body>
</html>
`;
}

const ICON_NOTE = '<svg class="callout__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M12 8h.01M11 12h1v4h1" /></svg>';
const ICON_WARN = '<svg class="callout__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" /><path d="M12 9v4M12 17h.01" /></svg>';
const ICON_TIP = '<svg class="callout__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12c.7.7 1 1.2 1 2h6c0-.8.3-1.3 1-2a7 7 0 0 0-4-12Z" /></svg>';
const ICON_MORE = '<svg class="callout__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 3v14M5 10l7 7 7-7M5 21h14" /></svg>';

const INSTRUCTIONS = `Tu rédiges une leçon de COMPLÉMENTS du cours « HTML : structurer le web » (site Syntaxe). Public : a fini les
15 leçons (structure, texte, liens, images, tableaux, médias, formulaires, sémantique, accessibilité, SEO). Ces deux
leçons ajoutent les images responsives et les éléments graphiques. Français, tutoiement, ton clair et concret.

ATOUT — APERÇU EN DIRECT : un bouton « 👁 Aperçu » rend les blocs HTML dans une iframe (qui exécute les scripts).
Pour une démo VISIBLE (image responsive, canvas, progress…), écris un bloc <figure class="code-block" data-file="demo.html">
<pre><code class="language-markup"> contenant une PETITE structure HTML ÉCHAPPÉE (et, pour le canvas, un &lt;script&gt; ÉCHAPPÉ qui dessine).
Invite (une fois, via un encadré Astuce) à cliquer « 👁 Aperçu ».

TU PRODUIS UNIQUEMENT { metaDesc, objectives, body } :
- metaDesc : ~150 caractères.
- objectives : 3 à 4 chaînes (« savoir faire X »), HTML inline autorisé (<code>, <strong>). «&nbsp;;» puis «.» pour la dernière.
- body : HTML INTÉRIEUR de <article class="prose"> (sans la balise article, sans bouton « terminer », sans nav).

STRUCTURE (≈1200–1700 mots) : 1–2 <p> d'intro ; 5–8 sections <h2> (chacune avec un exemple, souvent prévisualisable) ;
<h2>Pièges fréquents</h2> ; <h2>Pour aller plus loin</h2> ; <h2>Récap et vérification</h2> (résumé <ul> + lesson-check) ;
<h2>Exercices</h2> (3 gradués avec solutions repliables).

COMPOSANTS (n'invente pas d'autres classes) :
- Démo HTML (prévisualisable) : <figure class="code-block" data-file="demo.html"><pre><code class="language-markup">…</code></pre></figure>.
- Code de référence : <figure class="code-block" data-file="index.html"><pre><code class="language-markup">…</code></pre></figure>. Légende : <p class="code-caption">…</p>
- Note : <div class="callout callout--note">${ICON_NOTE}<div class="callout__body"><p class="callout__title">Note</p><p>…</p></div></div>
- Piège : <div class="callout callout--warn">${ICON_WARN}<div class="callout__body"><p class="callout__title">Piège fréquent</p><p>…</p></div></div>
- Astuce : <div class="callout callout--tip">${ICON_TIP}<div class="callout__body"><p class="callout__title">Astuce</p><p>…</p></div></div>
- Pour aller plus loin : <div class="callout callout--more">${ICON_MORE}<div class="callout__body"><p class="callout__title">Pour aller plus loin</p><p>…</p></div></div>
- Vérification : <div class="lesson-check"><p class="kicker kicker--gold">Vérifie ta compréhension</p><ol><li>…</li><li>…</li><li>…</li></ol></div>
- Exercice : <div class="exercise"><div class="exercise__head"><span class="exercise__num">Exercice 1</span><span class="exercise__level">Échauffement</span></div><p>…</p><details><summary>Voir une solution</summary><figure class="code-block" data-file="solution.html"><pre><code class="language-markup">…</code></pre></figure></details></div>

ÉCHAPPEMENT (CRITIQUE) : DANS un <code>, « < »→« &lt; », « > »→« &gt; », « & »→« &amp; ». Donc &lt;picture&gt;, &lt;source&gt;,
&lt;canvas&gt;, &lt;script&gt; sont ÉCHAPPÉS ; dans srcset l'espace et « w » restent ; aucun « < » ou « > » brut dans un &lt;code&gt;.

RÈGLES : HTML d'exemple VALIDE et ACCESSIBLE (alt pertinent, fallback). Aucun style= réel, aucun &lt;style&gt;/&lt;script&gt; RÉEL
hors des blocs de code échappés (le HTML/JS d'exemple n'apparaît qu'ÉCHAPPÉ dans des blocs language-markup).`;

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
  { num: '16', modNum: '06', modName: 'Compléments : images & graphiques', level: 'intermediaire', durationMin: 28, title: 'Images responsives et formats modernes', prereq: 'Cours HTML recommandé',
    brief: `Sujet : servir LA BONNE image selon l'écran et le réseau.
Sections : (1) Rappel : &lt;img src alt width height&gt; ; pourquoi indiquer width/height (réserver la place, éviter le décalage CLS). (2) srcset avec descripteurs de DENSITÉ (1x, 2x) pour les écrans haute résolution (Retina). (3) srcset avec descripteurs de LARGEUR (480w, 800w, 1200w) + l'attribut sizes (la taille D'AFFICHAGE selon la largeur du viewport) → le navigateur CHOISIT le meilleur fichier. (4) L'élément &lt;picture&gt; avec plusieurs &lt;source&gt; : pour l'ART DIRECTION (image cadrée différemment selon le média) et pour proposer des FORMATS modernes (AVIF, WebP) avec un &lt;img&gt; de repli. (5) loading="lazy" et decoding="async" (perf). (6) Les FORMATS : JPEG, PNG, WebP, AVIF, SVG — quand utiliser chacun. (7) Accessibilité : un alt pertinent, alt="" pour une image purement décorative. DÉMO prévisualisable (un &lt;picture&gt; ou un &lt;img srcset&gt;) — invite « 👁 Aperçu ».
Pièges : oublier width/height (décalage de mise en page) ; sizes incohérent avec la largeur réelle en CSS ; pas de &lt;img&gt; de repli dans &lt;picture&gt; ; alt manquant ou redondant ; servir une image énorme pour un petit affichage.
Pour aller plus loin : images responsives + CSS (object-fit, aspect-ratio), les CDN d'images, la densité d'écran, le préchargement d'une image LCP.
Exercices : (1) fournir une version 1x et 2x avec srcset ; (2) un &lt;picture&gt; qui propose du WebP avec repli JPEG ; (3) choisir le bon format pour trois cas (photo, logo, icône).`,
  },
  { num: '17', modNum: '06', modName: 'Compléments : images & graphiques', level: 'intermediaire', durationMin: 28, title: 'Canvas, SVG et éléments graphiques', prereq: 'Leçon 16 recommandée',
    brief: `Sujet : dessiner et afficher des indicateurs avec les éléments graphiques natifs.
Sections : (1) L'élément &lt;canvas width height&gt; : une SURFACE DE DESSIN pilotée par JavaScript (getContext("2d")) ; un petit exemple qui dessine un rectangle et un cercle — à montrer via « 👁 Aperçu » avec un &lt;script&gt; ÉCHAPPÉ dans le bloc. (2) CANVAS vs SVG vs &lt;img&gt; : bitmap dynamique (jeux, visualisations) vs vectoriel (icônes, schémas, net à toute taille) vs image fixe. (3) Le SVG INLINE : un &lt;svg viewBox&gt; dans le HTML, les formes (rect, circle, line, path), currentColor (suivre la couleur du texte), l'accessibilité (role="img", &lt;title&gt;). (4) Les éléments d'ÉTAT : &lt;progress value max&gt; (barre de progression d'une tâche) et &lt;meter value min max&gt; (jauge d'une mesure dans une plage, ex. score, stockage) — bien distinguer les deux. (5) &lt;output&gt; (afficher le résultat d'un calcul de formulaire). (6) Quand le natif suffit (vs une bibliothèque). DÉMO prévisualisable (canvas + progress + meter) — invite « 👁 Aperçu ».
Pièges : un &lt;canvas&gt; sans width/height (taille par défaut 300×150) ; fixer la taille du canvas en CSS (déforme le dessin — utiliser les attributs) ; un SVG sans viewBox (mise à l'échelle cassée) ; confondre &lt;progress&gt; (avancement) et &lt;meter&gt; (mesure) ; un canvas sans solution de repli accessible.
Pour aller plus loin : le canvas animé (cours Projets JS / JavaScript), les bibliothèques de graphiques, le SVG animé, WebGL pour la 3D.
Exercices : (1) dessiner un rectangle et un cercle sur un &lt;canvas&gt; ; (2) afficher une &lt;progress&gt; à 70 % et une &lt;meter&gt; ; (3) écrire un SVG inline avec un cercle coloré accessible.`,
  },
];

log('Rédaction de ' + SPECS.length + ' leçons (compléments HTML)…');

const results = await pipeline(
  SPECS,
  (s) =>
    agent(
      INSTRUCTIONS +
        '\n\n=== LEÇON À RÉDIGER ===\nNuméro : ' + s.num + ' | Module ' + s.modNum + ' (' + s.modName + ')\nTitre : ' + s.title +
        '\n\nBRIEF DÉTAILLÉ (intègre fidèlement le contenu ; rends les démos prévisualisables ; échappe toutes les balises) :\n' + s.brief,
      { label: 'écrit L' + s.num, phase: 'Rédaction', schema: SCHEMA }
    ),
  (parts, s) =>
    agent(
      INSTRUCTIONS +
        '\n\n=== RELECTURE CRITIQUE (corrige et renvoie la version finale, même schéma) ===\nLeçon ' + s.num + ' « ' + s.title + ' ».\n' +
        '1. EXACTITUDE (srcset/sizes/picture/formats ; OU canvas/SVG/progress/meter selon la leçon).\n' +
        '2. APERÇU : les démos visuelles sont des blocs language-markup ÉCHAPPÉS (le canvas inclut un &lt;script&gt; échappé) ; prévisualisables.\n' +
        '3. ÉCHAPPEMENT : DANS les blocs de code, « < »→« &lt; », « > »→« &gt; », « & »→« &amp; ». Aucune balise réelle dans un &lt;code&gt;.\n' +
        '4. STRUCTURE : intro, 5–8 sections <h2>, Pièges fréquents, Pour aller plus loin, Récap et vérification (lesson-check), Exercices (3 avec solutions).\n' +
        '5. Aucun style/script RÉEL dans la page (uniquement échappés dans des blocs de code).\n\n' +
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
