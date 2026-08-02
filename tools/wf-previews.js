export const meta = {
  name: 'syntaxe-previews',
  description: 'Génère 5 pages de cours en aperçu + 5 leçons d\'exemple (Python, HTML/CSS, Git, SQL, React)',
  phases: [
    { title: 'Rédaction' },
    { title: 'Relecture' },
  ],
};

/* --- URLs Prism (cdnjs) ---------------------------------------------------- */
function prismTags(langs) {
  const base = '../../assets/vendor/prism/';
  return ['core'].concat(langs)
    .map((l) => '    <script src="' + base + 'prism-' + l + '.min.js" defer></script>')
    .join('\n');
}

/* --- En-tête commun (pages dans /pages) ----------------------------------- */
function head(title, desc) {
  return `<!DOCTYPE html>
<html lang="fr" data-theme="light">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${title}</title>
    <meta name="description" content="${desc}" />
    <link rel="icon" type="image/svg+xml" href="../assets/img/favicon.svg" />
    <script src="../js/theme.js"></script>
    <link rel="stylesheet" href="../../css/fonts.css" />
    <link rel="stylesheet" href="../css/variables.css" />
    <link rel="stylesheet" href="../css/base.css" />
    <link rel="stylesheet" href="../css/layout.css" />
    <link rel="stylesheet" href="../css/components.css" />
    <link rel="stylesheet" href="../css/pages.css" />
  </head>`;
}

function header(currentCourseHref) {
  return `    <header class="site-header">
      <div class="container site-header__inner">
        <a class="brand" href="../index.html" aria-label="Syntaxe — accueil">
          <svg class="brand__mark" viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <rect x="3" y="3" width="26" height="26" rx="8" /><path d="M13 12 L9 16 L13 20" /><path d="M19 12 L23 16 L19 20" />
          </svg>
          <span>Syntaxe<span class="brand__dot" aria-hidden="true">.</span></span>
        </a>
        <button class="nav-toggle" data-nav-toggle aria-expanded="false" aria-controls="primary-nav" aria-label="Ouvrir le menu de navigation">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M3 6h18M3 12h18M3 18h18" /></svg>
        </button>
        <nav class="primary-nav" id="primary-nav" aria-label="Navigation principale">
          <a href="../index.html">Accueil</a>
          <a href="catalogue.html">Catalogue</a>
          <a href="cours-javascript.html">Cours JavaScript</a>
          <a href="../index.html#pourquoi">Notre approche</a>
        </nav>
        <div class="header-actions">
          <button class="theme-toggle" data-theme-toggle aria-label="Activer le thème sombre">
            <svg class="icon icon-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" /></svg>
            <svg class="icon icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="4.5" /><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4" /></svg>
          </button>
        </div>
      </div>
    </header>`;
}

/* --- Gabarit : page de cours (aperçu) ------------------------------------- */
function buildOverview(p) {
  const objectives = p.objectives.map((o) => '                <li>' + o + '</li>').join('\n');
  return `${head('Cours ' + p.name + ' (aperçu) — Syntaxe', p.metaDesc)}

  <body data-course="${p.id}">
    <a class="skip-link" href="#programme">Aller au programme</a>
${header()}

    <main id="contenu">
      <div class="page-head">
        <div class="container">
          <nav class="breadcrumb-nav" aria-label="Fil d'Ariane">
            <ol class="breadcrumb">
              <li><a href="../index.html">Accueil</a></li>
              <li><a href="catalogue.html">Catalogue</a></li>
              <li aria-current="page">${p.name}</li>
            </ol>
          </nav>
          <div class="course-hero" data-accent="${p.id}">
            <span class="course-hero__glyph" aria-hidden="true">${p.glyph}</span>
            <div>
              <span class="badge badge--apercu">Aperçu</span>
              <h1 class="course-hero__title">${p.title}</h1>
              <p class="course-hero__lead">${p.lead}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="container course-layout">
        <div>
          <div class="callout callout--note">
            <svg class="callout__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M12 8h.01M11 12h1v4h1" /></svg>
            <div class="callout__body">
              <p class="callout__title">Cours en aperçu</p>
              <p>Le programme complet est défini ci-dessous et la <strong>première leçon est rédigée</strong>. Les autres leçons arrivent bientôt. Le cours <a href="cours-javascript.html">JavaScript</a>, lui, est entièrement disponible.</p>
            </div>
          </div>

          <section>
            <p class="kicker">Ce que tu vas apprendre</p>
            <h2 class="u-mt-0">Objectifs du cours</h2>
            <div class="objectives">
              <p class="objectives__title">À la fin du cours, tu sauras</p>
              <ul>
${objectives}
              </ul>
            </div>
          </section>

          <section>
${p.introHTML}
          </section>

          <section id="programme">
            <p class="kicker">Programme</p>
            <h2 class="u-mt-0">Le parcours complet</h2>
            <p>Déplie un module pour voir ses leçons. La leçon marquée « Aperçu » est disponible dès maintenant.</p>
            <div data-course-modules></div>
          </section>
        </div>

        <aside class="course-aside" aria-label="Démarrer le cours">
          <div class="start-card">
            <span class="badge badge--apercu">Aperçu · gratuit</span>
            <h2 class="u-mt-0">Découvre ce cours</h2>
            <p>Lis la leçon d'exemple pour te faire une idée du style et de la profondeur.</p>
            <div class="start-card__stats" data-course-stats></div>
            <div class="progress" data-course-progress></div>
            <a class="btn btn--primary btn--block btn--lg" href="${p.sampleFile}">
              Lire la leçon d'exemple
              <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
            </a>
          </div>
        </aside>
      </div>
    </main>

    <footer class="site-footer">
      <div class="container">
        <div class="site-footer__bottom">
          <span>© <span data-year>2026</span> Syntaxe. Projet de démonstration.</span>
          <span><a href="catalogue.html">← Tous les cours</a></span>
        </div>
      </div>
    </footer>

    <script src="../js/data.js" defer></script>
    <script src="../js/main.js" defer></script>
    <script src="../js/cours.js" defer></script>
  </body>
</html>
`;
}

/* --- Gabarit : leçon d'exemple -------------------------------------------- */
function buildPreviewLesson(p) {
  const objectives = p.objectives.map((o) => '                  <li>' + o + '</li>').join('\n');
  return `${head(p.title + ' — Leçon ' + p.num + ' · Syntaxe', p.metaDesc)}

  <body data-course="${p.id}" data-lesson="${p.file}">
    <a class="skip-link" href="#contenu">Aller au contenu</a>
${header()}

    <div class="reading-progress" data-reading-progress aria-hidden="true"></div>

    <main id="contenu">
      <div class="container container--wide">
        <nav class="breadcrumb-nav" aria-label="Fil d'Ariane">
          <ol class="breadcrumb">
            <li><a href="../index.html">Accueil</a></li>
            <li><a href="catalogue.html">Catalogue</a></li>
            <li><a href="${p.overview}">${p.name}</a></li>
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
                <span class="dot-sep"><span class="pill pill--${p.levelClass}">${p.levelLabel}</span></span>
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
          <span><a href="${p.overview}">← Retour au programme du cours</a></span>
        </div>
      </div>
    </footer>

    <script src="../js/data.js" defer></script>
    <script src="../js/main.js" defer></script>
    <script src="../js/lecon.js" defer></script>
${prismTags(p.prismLangs)}
  </body>
</html>
`;
}

/* --- Consignes communes (icônes + règles) --------------------------------- */
const ICON_NOTE = '<svg class="callout__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M12 8h.01M11 12h1v4h1" /></svg>';
const ICON_WARN = '<svg class="callout__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" /><path d="M12 9v4M12 17h.01" /></svg>';
const ICON_TIP = '<svg class="callout__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12c.7.7 1 1.2 1 2h6c0-.8.3-1.3 1-2a7 7 0 0 0-4-12Z" /></svg>';
const ICON_MORE = '<svg class="callout__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 3v14M5 10l7 7 7-7M5 21h14" /></svg>';

const RULES = `RÈGLES STRICTES :
- Français, tutoiement, ton pédagogique clair, du connu vers l'inconnu, un concept à la fois.
- AUCUN style inline, AUCun style=, AUCune balise <style>, AUCun <script> ni onclick.
- N'utilise que ces classes : code-block, code-caption, callout (--note/--warn/--tip/--more), callout__icon, callout__body, callout__title, lesson-check, kicker (kicker--gold), exercise (exercise__head/__num/__level), plus <p> <ul> <ol> <li> <strong> <em> <code> <h2> <h3> <kbd> <details> <summary> <figure> <pre>.
- Bloc de code : <figure class="code-block" data-file="NOM"><pre><code class="language-LANG">CODE</code></pre></figure>.
- Échappement DANS le code : « & » -> « &amp; », « < » -> « &lt; ». « > » peut rester. (Crucial pour le HTML, les balises, les comparaisons, &amp;&amp;.)
- Encadrés (copie l'icône exacte) :
  Note : <div class="callout callout--note">${ICON_NOTE}<div class="callout__body"><p class="callout__title">Note</p><p>…</p></div></div>
  Piège : <div class="callout callout--warn">${ICON_WARN}<div class="callout__body"><p class="callout__title">Piège fréquent</p><p>…</p></div></div>
  Astuce : <div class="callout callout--tip">${ICON_TIP}<div class="callout__body"><p class="callout__title">Astuce</p><p>…</p></div></div>
  Plus loin : <div class="callout callout--more">${ICON_MORE}<div class="callout__body"><p class="callout__title">Pour aller plus loin</p><p>…</p></div></div>`;

const OVERVIEW_INSTRUCTIONS = `Tu rédiges le contenu d'une page de PRÉSENTATION de cours (aperçu) pour le site Syntaxe.
Renvoie un objet { metaDesc, lead, objectives, introHTML }.
- metaDesc : ~150 caractères pour <meta description>.
- lead : 1–2 phrases d'accroche (HTML inline autorisé : <strong>, <em>) décrivant le cours et son intérêt.
- objectives : 5 à 6 chaînes (compétences finales « savoir faire X »), HTML inline autorisé. Terminer par «&nbsp;;» sauf la dernière par «.».
- introHTML : 2 à 3 paragraphes <p> (et éventuellement 1 encadré callout) présentant le cours : à qui il s'adresse, prérequis, et la philosophie. Tu peux ouvrir par un <h2>Pour qui, et pourquoi</h2>. Reste concis (la page affiche déjà le programme détaillé en dessous).
` + RULES;

const LESSON_INSTRUCTIONS = `Tu rédiges UNE leçon d'exemple complète et approfondie (≈1100–1600 mots) pour le site Syntaxe.
Renvoie un objet { metaDesc, objectives, body }.
- metaDesc : ~150 caractères.
- objectives : 3–4 chaînes (« savoir faire X »), HTML inline autorisé, «&nbsp;;» puis «.» pour la dernière.
- body : HTML INTÉRIEUR de <article class="prose"> (sans la balise article, sans bouton « terminer », sans nav précédent/suivant — ajoutés automatiquement).
STRUCTURE du body :
1. 1–2 <p> d'intro (objectif + ancrage).
2. 5 à 7 sections <h2> (titres courts ; ils alimentent le sommaire) menant au savoir-faire, avec exemples de code commentés pas à pas et au moins un ou deux encadrés.
3. <h2>Pièges fréquents</h2>.
4. <h2>Pour aller plus loin</h2>.
5. <h2>Récap et vérification</h2> : court résumé en <ul> puis le bloc lesson-check (3 questions).
6. <h2>Exercices</h2> : exactement 3 exercices gradués (Échauffement, Application, Défi) avec solution repliable.
Termine la section « Pour aller plus loin » ou ajoute un encadré « Note » rappelant que c'est une leçon d'exemple et que la suite du cours arrive bientôt.
Exercice : <div class="exercise"><div class="exercise__head"><span class="exercise__num">Exercice 1</span><span class="exercise__level">Échauffement</span></div><p>…</p><details><summary>Voir une solution</summary><figure class="code-block" data-file="NOM"><pre><code class="language-LANG">…</code></pre></figure></details></div>
lesson-check : <div class="lesson-check"><p class="kicker kicker--gold">Vérifie ta compréhension</p><ol><li>…</li><li>…</li><li>…</li></ol></div>
` + RULES;

const SCHEMA_OVERVIEW = {
  type: 'object', additionalProperties: false,
  required: ['metaDesc', 'lead', 'objectives', 'introHTML'],
  properties: {
    metaDesc: { type: 'string' },
    lead: { type: 'string' },
    objectives: { type: 'array', items: { type: 'string' }, minItems: 5, maxItems: 6 },
    introHTML: { type: 'string' },
  },
};
const SCHEMA_LESSON = {
  type: 'object', additionalProperties: false,
  required: ['metaDesc', 'objectives', 'body'],
  properties: {
    metaDesc: { type: 'string' },
    objectives: { type: 'array', items: { type: 'string' }, minItems: 3, maxItems: 4 },
    body: { type: 'string' },
  },
};

/* --- SPECS des 5 cours ----------------------------------------------------- */
const COURSES = [
  {
    id: 'python', name: 'Python', glyph: 'Py', overview: 'cours-python.html',
    title: 'Python pour débuter',
    sampleFile: 'python-lecon-01.html',
    overviewBrief: `Cours Python débutant. Public : grands débutants. Prérequis : aucun. Philosophie : syntaxe lisible, on apprend par petits scripts utiles. Objectifs : écrire et exécuter un script ; variables et types ; conditions et boucles ; listes et dictionnaires ; fonctions ; lire/écrire des fichiers simples.`,
    lesson: {
      num: '01', modNum: '01', modName: 'Premiers pas', file: 'python-lecon-01.html',
      title: 'Premiers pas en Python', prereq: 'Aucun prérequis', durationMin: 26,
      levelClass: 'debutant', levelLabel: 'Débutant', prismLangs: ['clike', 'python'], lang: 'python',
      brief: `Sujet : prendre en main Python.
Sections : (1) Qu'est-ce que Python (langage interprété, lisible, polyvalent : web, data, scripts). (2) Où l'exécuter : interpréteur/REPL et fichier .py exécuté avec python mon_fichier.py. (3) print() pour afficher : print("Bonjour") ; print(2 + 3). (4) Variables et typage dynamique : age = 25 (pas de mot-clé, pas de point-virgule), nom = "Sam" ; réassignation libre. (5) Types de base : int (25), float (3.14), str ("texte" ou 'texte'), bool (True/False — MAJUSCULE). type(age) renvoie le type. (6) input() pour lire l'utilisateur (renvoie toujours une str ; convertir avec int(input(...))). (7) f-strings : nom = "Sam"; print(f"Bonjour {nom}, {10 + 2} messages"). (8) Commentaires avec # ; l'INDENTATION est significative (4 espaces) — teaser des blocs.
Pièges : indentation incohérente (IndentationError) ; True/False/None avec majuscule ; print() n'est pas return ; input() renvoie une chaîne (ex. "5" + 1 plante, faire int()). Mentionner Python 2 vs 3 (utiliser Python 3).
Pour aller plus loin : la philosophie « lisibilité » (import this), un type dynamique mais fort (pas de "3" + 4 silencieux contrairement à JS — ça lève une erreur).
Exercices : (1) afficher son prénom et son âge avec print ; (2) demander un nombre avec input, le convertir, afficher son double ; (3) une f-string qui mélange texte et calcul.
Tous les blocs de code en language-python.`,
    },
  },
  {
    id: 'html-css', name: 'HTML & CSS', glyph: '<>', overview: 'cours-html-css.html',
    title: 'HTML & CSS : construire des pages',
    sampleFile: 'htmlcss-lecon-01.html',
    overviewBrief: `Cours HTML & CSS débutant. Public : débutants voulant créer des pages web. Prérequis : aucun. Objectifs : structurer une page en HTML sémantique ; liens, images, listes ; formulaires ; mettre en forme avec CSS (sélecteurs, modèle de boîte, couleurs/typo) ; mise en page Flexbox et Grid ; responsive.`,
    lesson: {
      num: '01', modNum: '01', modName: 'Structurer en HTML', file: 'htmlcss-lecon-01.html',
      title: 'Structurer une page en HTML', prereq: 'Aucun prérequis', durationMin: 28,
      levelClass: 'debutant', levelLabel: 'Débutant', prismLangs: ['clike', 'markup', 'css'], lang: 'markup',
      brief: `Sujet : structurer le CONTENU d'une page en HTML (le style viendra avec CSS).
Sections : (1) Qu'est-ce que le HTML : un langage de balisage qui décrit le sens du contenu (pas l'apparence). (2) Une balise : <p>texte</p> — ouvrante/fermante, parfois auto-fermante (<img>, <br>). Attributs : <a href="..."> . (3) Le squelette d'un document : <!DOCTYPE html>, <html lang="fr">, <head> (meta charset, title) et <body>. Donner l'exemple complet (language-markup, bien échappé avec &lt;). (4) Titres et paragraphes : <h1>..<h6>, <p>. Un seul <h1> par page, hiérarchie logique. (5) Balises sémantiques : <header>, <nav>, <main>, <section>, <article>, <footer> — pourquoi (accessibilité, SEO, lisibilité) vs « soupe de <div> ». (6) Liens et images : <a href="page.html">, <img src="photo.jpg" alt="description"> (toujours un alt utile). (7) Listes : <ul>/<ol> avec <li>.
Pièges : oublier de fermer une balise ; oublier alt sur les images ; abuser des <div> au lieu des balises sémantiques ; mettre plusieurs <h1> ; sauter des niveaux de titre.
Pour aller plus loin : la séparation contenu (HTML) / présentation (CSS) / comportement (JS) ; validation W3C ; attributs id/class qui serviront au CSS.
Exercices : (1) écrire le squelette minimal d'une page avec un titre ; (2) construire une page « à propos » avec header/main/footer, un h1, deux paragraphes et une liste ; (3) ajouter un lien et une image avec alt.
Blocs de code en language-markup (HTML). Si tu montres un tout petit bout de CSS, language-css.`,
    },
  },
  {
    id: 'git', name: 'Git & GitHub', glyph: 'Git', overview: 'cours-git.html',
    title: 'Git & GitHub : versionner son code',
    sampleFile: 'git-lecon-01.html',
    overviewBrief: `Cours Git & GitHub débutant. Public : toute personne qui code. Prérequis : savoir utiliser un terminal de base. Objectifs : comprendre l'intérêt du contrôle de version ; créer un dépôt et committer ; lire l'historique ; travailler par branches ; résoudre des conflits ; collaborer via GitHub (push/pull, pull requests).`,
    lesson: {
      num: '01', modNum: '01', modName: 'Les bases', file: 'git-lecon-01.html',
      title: 'Pourquoi le contrôle de version', prereq: 'Terminal de base utile', durationMin: 24,
      levelClass: 'debutant', levelLabel: 'Débutant', prismLangs: ['clike', 'bash'], lang: 'bash',
      brief: `Sujet : comprendre POURQUOI Git existe, et faire ses premiers pas.
Sections : (1) Le problème sans contrôle de version : dossiers "projet_final_v2_vraiment_final", peur de casser, collaboration chaotique. (2) Ce qu'est Git : un système qui enregistre l'HISTORIQUE de ton projet sous forme d'instantanés (commits). Distribué (chacun a tout l'historique). (3) Le modèle mental : dépôt (repository), zone de préparation (staging), commit (instantané daté avec message). (4) Premier dépôt — commandes (language-bash) : git init ; git status ; git add fichier.txt (ou git add .) ; git commit -m "Message clair". (5) Lire l'historique : git log (et git log --oneline). (6) Un bon message de commit : impératif, concis, explique le pourquoi. (7) .gitignore en une phrase (ignorer node_modules, fichiers secrets).
Pièges : committer sans message clair ; tout committer (secrets, fichiers générés) sans .gitignore ; confondre git add (préparer) et git commit (enregistrer) ; oublier git init.
Pour aller plus loin : Git (l'outil) vs GitHub (l'hébergement distant) ; un commit = une intention ; committer souvent et petit.
Exercices : (1) lister les 3 étapes init -> add -> commit dans l'ordre avec leur rôle ; (2) écrire les commandes pour créer un dépôt et faire un premier commit d'un fichier readme.md ; (3) proposer 3 bons messages de commit pour des changements donnés.
Blocs de code en language-bash.`,
    },
  },
  {
    id: 'sql', name: 'SQL', glyph: 'SQL', overview: 'cours-sql.html',
    title: 'SQL : interroger les bases de données',
    sampleFile: 'sql-lecon-01.html',
    overviewBrief: `Cours SQL débutant. Public : débutants en données / back-end. Prérequis : aucun. Objectifs : comprendre une base relationnelle ; lire des données avec SELECT ; filtrer (WHERE), trier (ORDER BY) ; jointures ; agrégations (GROUP BY) ; modifier (INSERT/UPDATE/DELETE) ; bases du schéma.`,
    lesson: {
      num: '01', modNum: '01', modName: 'Lire des données', file: 'sql-lecon-01.html',
      title: 'SELECT : interroger une table', prereq: 'Aucun prérequis', durationMin: 26,
      levelClass: 'debutant', levelLabel: 'Débutant', prismLangs: ['clike', 'sql'], lang: 'sql',
      brief: `Sujet : lire des données avec SELECT.
Sections : (1) Une base relationnelle : des TABLES (lignes = enregistrements, colonnes = champs). Présenter une table exemple "clients" (id, nom, ville, age) avec 3-4 lignes décrites en texte. (2) SELECT de base : SELECT nom FROM clients; ; expliquer la lecture. Mot-clés en MAJUSCULES par convention ; le point-virgule final. (3) Plusieurs colonnes : SELECT nom, ville FROM clients;. (4) Toutes les colonnes : SELECT * FROM clients; — pratique pour explorer, à éviter en production. (5) Renommer avec AS : SELECT nom AS client, ville AS localite FROM clients;. (6) Éviter les doublons : SELECT DISTINCT ville FROM clients;. (7) Trier (aperçu) : SELECT nom, age FROM clients ORDER BY age DESC; (introduit la suite du cours pour WHERE/filtre).
Pièges : oublier le point-virgule (selon le SGBD) ; SELECT * en production (lourd, fragile) ; sensibilité à la casse des données vs mots-clés ; confondre nom de colonne et chaîne (guillemets).
Pour aller plus loin : SQL est déclaratif (on décrit le RÉSULTAT voulu, pas le COMMENT) ; différents SGBD (PostgreSQL, MySQL, SQLite) avec un cœur commun.
Exercices : (1) écrire une requête qui affiche tous les noms de la table clients ; (2) afficher nom et ville renommés avec AS ; (3) lister les villes distinctes triées.
Blocs de code en language-sql.`,
    },
  },
  {
    id: 'react', name: 'React', glyph: 'Re', overview: 'cours-react.html',
    title: 'React : interfaces à composants',
    sampleFile: 'react-lecon-01.html',
    overviewBrief: `Cours React intermédiaire. Public : développeurs connaissant déjà JavaScript (le cours JS de Syntaxe est un bon prérequis). Objectifs : penser en composants ; écrire du JSX ; passer des données via props ; gérer l'état avec useState ; les événements ; les effets (useEffect) ; composer une petite application.`,
    lesson: {
      num: '01', modNum: '01', modName: 'Composants & JSX', file: 'react-lecon-01.html',
      title: 'Premier composant & JSX', prereq: 'Bases de JavaScript requises', durationMin: 30,
      levelClass: 'intermediaire', levelLabel: 'Intermédiaire', prismLangs: ['clike', 'markup', 'javascript', 'jsx'], lang: 'jsx',
      brief: `Sujet : créer un premier composant React et comprendre JSX. (Public : connaît déjà JS.)
Sections : (1) L'idée de React : décrire l'UI comme des COMPOSANTS réutilisables, et laisser React mettre à jour le DOM. (2) Un composant = une fonction qui RENVOIE du JSX : function Salutation() { return <h1>Bonjour</h1>; }. Le nom commence par une MAJUSCULE. (3) JSX, c'est quoi : une syntaxe proche du HTML dans le JS, transformée en appels JavaScript. (4) Règles JSX : un seul élément racine (sinon un fragment <>...</>), className au lieu de class, attributs en camelCase (htmlFor...), balises auto-fermées <img />. (5) Insérer du JavaScript avec des accolades : const nom = "Sam"; return <p>Bonjour {nom}, {2 + 3} messages</p>;. (6) Afficher/rendre un composant : <Salutation /> dans un autre composant ; mention de createRoot/render en une phrase. (7) Teaser props : passer des données <Salutation nom="Sam" /> (détaillé leçon suivante).
Pièges : class au lieu de className ; oublier le retour d'UN seul élément racine ; minuscule au nom de composant (React le prend pour une balise HTML) ; mettre des instructions (if, for) directement dans le JSX au lieu d'expressions.
Pour aller plus loin : JSX est du « sucre » compilé (Babel) en React.createElement ; un composant doit être pur (mêmes props -> même rendu).
Exercices : (1) écrire un composant Titre qui renvoie un <h1> ; (2) un composant Profil qui affiche un nom stocké dans une variable via {} ; (3) corriger un JSX fautif (class -> className, deux éléments racines -> fragment).
Blocs de code en language-jsx.`,
    },
  },
];

/* --- Pipeline -------------------------------------------------------------- */
log('Génération de ' + COURSES.length + ' aperçus (page de cours + leçon d\'exemple)…');

const out = await pipeline(
  COURSES,
  // Étape 1 — rédaction parallèle de l'aperçu ET de la leçon
  (c) =>
    parallel([
      () =>
        agent(
          OVERVIEW_INSTRUCTIONS + '\n\n=== COURS ===\n' + c.title + '\n\nBRIEF :\n' + c.overviewBrief,
          { label: 'cours ' + c.id, phase: 'Rédaction', schema: SCHEMA_OVERVIEW }
        ),
      () =>
        agent(
          LESSON_INSTRUCTIONS + '\n\n=== LEÇON ===\n' + c.lesson.title +
            ' (cours ' + c.name + ')\n\nBRIEF :\n' + c.lesson.brief,
          { label: 'leçon ' + c.id, phase: 'Rédaction', schema: SCHEMA_LESSON }
        ),
    ]).then((r) => ({ course: c, overview: r[0], lesson: r[1] })),
  // Étape 2 — relecture de la leçon, puis assemblage des deux fichiers
  (r) => {
    const c = r.course;
    return agent(
      LESSON_INSTRUCTIONS +
        '\n\n=== RELECTURE CRITIQUE (corrige et renvoie la version finale) ===\n' +
        'Leçon « ' + c.lesson.title + ' » (cours ' + c.name + ', code en language-' + c.lesson.lang + ').\n' +
        'Vérifie : exactitude du code, échappement (&amp; et &lt;), structure complète (sections + pièges + pour aller plus loin + récap/lesson-check + 3 exercices), profondeur, HTML valide, aucune classe interdite, aucun style/script inline.\n\n' +
        'BRIEF :\n' + c.lesson.brief + '\n\nBROUILLON (JSON) :\n' + JSON.stringify(r.lesson),
      { label: 'relit ' + c.id, phase: 'Relecture', schema: SCHEMA_LESSON }
    ).then((fixedLesson) => {
      const ov = r.overview;
      const ls = fixedLesson || r.lesson;
      const files = [];
      if (ov) {
        files.push({
          file: c.overview,
          html: buildOverview({
            id: c.id, name: c.name, glyph: c.glyph, title: c.title,
            sampleFile: c.sampleFile, metaDesc: ov.metaDesc, lead: ov.lead,
            objectives: ov.objectives, introHTML: ov.introHTML,
          }),
        });
      }
      files.push({
        file: c.lesson.file,
        html: buildPreviewLesson({
          id: c.id, name: c.name, overview: c.overview,
          num: c.lesson.num, modNum: c.lesson.modNum, modName: c.lesson.modName,
          title: c.lesson.title, prereq: c.lesson.prereq, durationMin: c.lesson.durationMin,
          levelClass: c.lesson.levelClass, levelLabel: c.lesson.levelLabel,
          prismLangs: c.lesson.prismLangs, file: c.lesson.file,
          metaDesc: ls.metaDesc, objectives: ls.objectives, body: ls.body,
        }),
      });
      return files;
    });
  }
);

const files = out.filter(Boolean).reduce((a, b) => a.concat(b), []);
log('Fichiers assemblés : ' + files.length);
return files;
