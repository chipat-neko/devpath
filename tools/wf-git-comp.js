export const meta = {
  name: 'syntaxe-git-comp',
  description: 'Rédige 2 leçons de compléments du cours Git (internes de Git, submodules/worktrees/hooks/signature)',
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
    <title>${p.title} — Leçon ${p.num} · Git & GitHub · Syntaxe</title>
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

  <body data-course="git" data-lesson="lecon-${p.num}.html">
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
            <li><a href="cours.html">Git &amp; GitHub</a></li>
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
    <script src="../../assets/vendor/prism/prism-bash.min.js" defer></script>
  </body>
</html>
`;
}

const ICON_NOTE = '<svg class="callout__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M12 8h.01M11 12h1v4h1" /></svg>';
const ICON_WARN = '<svg class="callout__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" /><path d="M12 9v4M12 17h.01" /></svg>';
const ICON_TIP = '<svg class="callout__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12c.7.7 1 1.2 1 2h6c0-.8.3-1.3 1-2a7 7 0 0 0-4-12Z" /></svg>';
const ICON_MORE = '<svg class="callout__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 3v14M5 10l7 7 7-7M5 21h14" /></svg>';

const INSTRUCTIONS = `Tu rédiges une leçon de COMPLÉMENTS du cours « Git & GitHub : versionner son code » (Syntaxe). Public : a fini les
14 leçons (commits, branches, fusion, conflits, annulation, distant, GitHub, pull requests, forks, rebase, stash/tags).
Ces deux leçons révèlent le fonctionnement INTERNE de Git et des outils avancés. Français, tutoiement, ton précis.
Git MODERNE. NE réexplique pas les bases.

PAS D'EXÉCUTION : ni Git ni le terminal ne tournent dans le navigateur. N'invite JAMAIS à cliquer « Tester »/« Aperçu ».
Montre les COMMANDES en blocs « language-bash » et la SORTIE en COMMENTAIRE (« # ... ») ou dans un bloc « Terminal ».
Tu peux illustrer la structure des objets avec un SCHÉMA ASCII dans un bloc de code.

TU PRODUIS UNIQUEMENT { metaDesc, objectives, body } :
- metaDesc : ~150 caractères.
- objectives : 3 à 4 chaînes (« savoir faire X »), HTML inline autorisé (<code>, <strong>). «&nbsp;;» puis «.» pour la dernière.
- body : HTML INTÉRIEUR de <article class="prose"> (sans la balise article, sans bouton « terminer », sans nav).

STRUCTURE (≈1200–1700 mots) : 1–2 <p> d'intro ; 5–8 sections <h2> (chacune avec un exemple de commande commenté) ;
<h2>Pièges fréquents</h2> ; <h2>Pour aller plus loin</h2> ; <h2>Récap et vérification</h2> (résumé <ul> + lesson-check) ;
<h2>Exercices</h2> (3 gradués avec solutions repliables).

COMPOSANTS (n'invente pas d'autres classes) :
- Commandes : <figure class="code-block" data-file="bash"><pre><code class="language-bash">…</code></pre></figure>.
- Sortie / schéma : <figure class="code-block" data-file="Terminal"><pre><code class="language-bash">…</code></pre></figure>. Légende : <p class="code-caption">…</p>
- Note : <div class="callout callout--note">${ICON_NOTE}<div class="callout__body"><p class="callout__title">Note</p><p>…</p></div></div>
- Piège : <div class="callout callout--warn">${ICON_WARN}<div class="callout__body"><p class="callout__title">Piège fréquent</p><p>…</p></div></div>
- Astuce : <div class="callout callout--tip">${ICON_TIP}<div class="callout__body"><p class="callout__title">Astuce</p><p>…</p></div></div>
- Pour aller plus loin : <div class="callout callout--more">${ICON_MORE}<div class="callout__body"><p class="callout__title">Pour aller plus loin</p><p>…</p></div></div>
- Vérification : <div class="lesson-check"><p class="kicker kicker--gold">Vérifie ta compréhension</p><ol><li>…</li><li>…</li><li>…</li></ol></div>
- Exercice : <div class="exercise"><div class="exercise__head"><span class="exercise__num">Exercice 1</span><span class="exercise__level">Échauffement</span></div><p>…</p><details><summary>Voir une solution</summary><figure class="code-block" data-file="bash"><pre><code class="language-bash">…</code></pre></figure></details></div>

ÉCHAPPEMENT (CRITIQUE) : DANS un <code>, « < »→« &lt; », « > »→« &gt; », « & »→« &amp; ». Donc les placeholders « &lt;sha&gt; »,
« &lt;url&gt; » sont échappés ; les redirections « > » deviennent « &gt; » ; le chaînage « && » devient « &amp;&amp; ». Aucun caractère brut dans un &lt;code&gt;.

RÈGLES : commandes Git EXACTES et modernes. Aucun style=, aucun <style>, aucun <script> RÉEL dans la page (ton body = prose + blocs de code).`;

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
  { num: '15', modNum: '05', modName: 'Git en profondeur', level: 'intermediaire', durationMin: 30, title: 'Sous le capot : les objets de Git', prereq: 'Cours Git recommandé',
    brief: `Sujet : comprendre comment Git stocke RÉELLEMENT tes données.
Sections : (1) Git est un MAGASIN clé-valeur adressé par CONTENU : chaque objet a un identifiant (un hash SHA-1/SHA-256 de son contenu) — d'où l'intégrité. (2) Les TYPES d'OBJETS : le BLOB (le CONTENU d'un fichier, SANS son nom), le TREE (un répertoire : il associe des noms à des blobs/trees), le COMMIT (un instantané : il pointe vers un tree RACINE, vers son ou ses PARENTS, et porte auteur + date + message), et le TAG annoté. (3) EXPLORER : git cat-file -t / -p &lt;sha&gt;, git hash-object, git ls-tree. (4) Les RÉFÉRENCES : une branche n'est qu'un FICHIER contenant un SHA (refs/heads/main) ; HEAD pointe vers la branche courante ; les tags vivent dans refs/tags. (5) Le dossier .git : objects/, refs/, HEAD, index, config — un tour d'horizon. (6) Conséquences : un commit « contient » tout l'historique via la chaîne de ses parents ; Git stocke des INSTANTANÉS (pas des diffs), compressés ensuite. (7) Plumbing (bas niveau) vs porcelain (convivial). Donne un schéma ASCII des objets et des commandes bash avec sortie commentée.
Pièges : croire qu'une branche « contient » des commits (c'est un POINTEUR) ; confondre un blob (contenu) et un fichier (un nom dans un tree) ; éditer .git à la main ; croire que Git stocke des différences.
Pour aller plus loin : les packfiles (compression), git gc, git fsck, le reflog, les objets inaccessibles.
Exercices : (1) inspecter un commit avec git cat-file -p ; (2) remonter du commit à son tree puis à un blob ; (3) expliquer ce que contient refs/heads/main.`,
  },
  { num: '16', modNum: '05', modName: 'Git en profondeur', level: 'intermediaire', durationMin: 30, title: 'Submodules, worktrees, hooks et signature', prereq: 'Leçon 15 recommandée',
    brief: `Sujet : la boîte à outils des projets complexes.
Sections : (1) Les SUBMODULES : inclure un autre dépôt Git DANS le tien (git submodule add &lt;url&gt;, le fichier .gitmodules) ; le commit du parent FIGE le SHA du sous-module ; cloner avec git clone --recursive ou git submodule update --init --recursive. (2) Les WORKTREES : git worktree add &lt;chemin&gt; &lt;branche&gt; pour avoir PLUSIEURS répertoires de travail liés au MÊME dépôt (travailler sur deux branches sans stash ni nouveau clone) ; list / remove. (3) Les HOOKS côté client : des scripts dans .git/hooks (pre-commit, commit-msg, pre-push) pour automatiser lint, tests, formatage ; les outils qui les versionnent (Husky, le framework pre-commit). (4) La SIGNATURE des commits (GPG ou SSH) : git commit -S pour PROUVER l'auteur ; la config user.signingkey et commit.gpgsign ; le badge « Verified » sur GitHub. (5) Git LFS (Large File Storage) en mention : versionner de gros binaires sans gonfler le dépôt. (6) Quand utiliser quoi. Commandes bash avec sortie commentée.
Pièges : cloner SANS --recursive (sous-modules vides) ; modifier un sous-module sans committer dans les DEUX dépôts ; des hooks dans .git/hooks NON versionnés (utiliser un outil comme Husky) ; oublier de publier sa clé publique pour la signature.
Pour aller plus loin : les subtrees (alternative aux submodules), worktree pour la CI, les hooks côté serveur, sigstore/gitsign.
Exercices : (1) ajouter un sous-module et le récupérer avec --recursive ; (2) créer un worktree pour une branche ; (3) écrire un hook pre-commit simple.`,
  },
];

log('Rédaction de ' + SPECS.length + ' leçons (compléments Git)…');

const results = await pipeline(
  SPECS,
  (s) =>
    agent(
      INSTRUCTIONS +
        '\n\n=== LEÇON À RÉDIGER ===\nNuméro : ' + s.num + ' | Module ' + s.modNum + ' (' + s.modName + ')\nTitre : ' + s.title +
        '\n\nBRIEF DÉTAILLÉ (intègre fidèlement le contenu ; sorties en commentaire ; échappe < > & dans le code) :\n' + s.brief,
      { label: 'écrit L' + s.num, phase: 'Rédaction', schema: SCHEMA }
    ),
  (parts, s) =>
    agent(
      INSTRUCTIONS +
        '\n\n=== RELECTURE CRITIQUE (corrige et renvoie la version finale, même schéma) ===\nLeçon ' + s.num + ' « ' + s.title + ' ».\n' +
        '1. EXACTITUDE (objets/refs/.git ; OU submodules/worktrees/hooks/signature selon la leçon).\n' +
        '2. PAS d\'invitation à « Tester »/« Aperçu » ; sorties en commentaire ou bloc « Terminal ».\n' +
        '3. ÉCHAPPEMENT : DANS les blocs de code, « < »→« &lt; », « > »→« &gt; » (placeholders &lt;sha&gt;/&lt;url&gt;), « & »→« &amp; » (&amp;&amp;). Aucun caractère brut dans un &lt;code&gt;.\n' +
        '4. STRUCTURE : intro, 5–8 sections <h2>, Pièges fréquents, Pour aller plus loin, Récap et vérification (lesson-check), Exercices (3 avec solutions).\n' +
        '5. Public a fini le cours ; aucun style/script réel dans la page.\n\n' +
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
