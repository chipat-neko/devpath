export const meta = {
  name: 'syntaxe-git',
  description: 'Rédige les leçons Git 02 à 14 (cours complet « Git & GitHub ») et assemble le HTML',
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

const INSTRUCTIONS = `Tu rédiges une leçon du cours « Git & GitHub : versionner son code » (site Syntaxe). Public : DÉBUTANTS
qui savent ouvrir un terminal et éditer des fichiers, mais découvrent le contrôle de version. La leçon 1 a déjà
posé le POURQUOI (sauvegarder l'historique, revenir en arrière, collaborer ; dépôt local vs distant ; installer Git).
Français, tutoiement, ton clair et concret. Git MODERNE (branche par défaut « main », « git switch »/« git restore »
en plus de « checkout », URLs HTTPS/SSH).

PAS D'EXÉCUTION EN DIRECT : ni Git ni le terminal ne tournent dans le navigateur (le site s'ouvre en file://).
N'invite donc JAMAIS à cliquer « Tester » ou « Aperçu ». Montre les COMMANDES dans des blocs « language-bash »,
et la SORTIE attendue en COMMENTAIRE (« # ... ») ou dans un bloc séparé « Terminal ». Tu peux illustrer l'historique
ou les branches avec un petit SCHÉMA ASCII placé dans un bloc de code.

TU PRODUIS UNIQUEMENT { metaDesc, objectives, body } :
- metaDesc : ~150 caractères.
- objectives : 3 à 4 chaînes (« savoir faire X »), HTML inline autorisé (<code>, <strong>). «&nbsp;;» puis «.» pour la dernière.
- body : HTML INTÉRIEUR de <article class="prose"> (sans la balise article, sans bouton « terminer », sans nav).

STRUCTURE (≈1200–1700 mots) : 1–2 <p> d'intro ; 5–8 sections <h2> (chacune avec au moins un exemple de commande commenté) ;
<h2>Pièges fréquents</h2> ; <h2>Pour aller plus loin</h2> ; <h2>Récap et vérification</h2> (résumé <ul> + lesson-check) ;
<h2>Exercices</h2> (3 gradués avec solutions repliables contenant des commandes).

COMPOSANTS (n'invente pas d'autres classes) :
- Commandes : <figure class="code-block" data-file="bash"><pre><code class="language-bash">… COMMANDES ÉCHAPPÉES …</code></pre></figure>.
- Sortie/terminal (optionnel) : <figure class="code-block" data-file="Terminal"><pre><code class="language-bash">… SORTIE …</code></pre></figure>.
- Légende : <p class="code-caption">…</p>
- Note : <div class="callout callout--note">${ICON_NOTE}<div class="callout__body"><p class="callout__title">Note</p><p>…</p></div></div>
- Piège : <div class="callout callout--warn">${ICON_WARN}<div class="callout__body"><p class="callout__title">Piège fréquent</p><p>…</p></div></div>
- Astuce : <div class="callout callout--tip">${ICON_TIP}<div class="callout__body"><p class="callout__title">Astuce</p><p>…</p></div></div>
- Pour aller plus loin : <div class="callout callout--more">${ICON_MORE}<div class="callout__body"><p class="callout__title">Pour aller plus loin</p><p>…</p></div></div>
- Vérification : <div class="lesson-check"><p class="kicker kicker--gold">Vérifie ta compréhension</p><ol><li>…</li><li>…</li><li>…</li></ol></div>
- Exercice : <div class="exercise"><div class="exercise__head"><span class="exercise__num">Exercice 1</span><span class="exercise__level">Échauffement</span></div><p>…</p><details><summary>Voir une solution</summary><figure class="code-block" data-file="bash"><pre><code class="language-bash">…</code></pre></figure></details></div>

ÉCHAPPEMENT (CRITIQUE) : DANS un <code>, « < »→« &lt; », « > »→« &gt; », « & »→« &amp; ». Donc les PLACEHOLDERS
« &lt;message&gt; », « &lt;branche&gt; », « &lt;fichier&gt; » sont échappés ; les commandes CHAÎNÉES « && » s'écrivent « &amp;&amp; » ;
une redirection « > » s'écrit « &gt; ». Vérifie qu'aucun « < », « > » ou « & » brut ne traîne dans un bloc de code.

RÈGLES : commandes Git EXACTES et modernes. Emploie des exemples réalistes (noms de fichiers, branches, messages).
Aucun style=, aucun <style>, aucun <script> RÉEL dans la page (ton body = prose + blocs de code).`;

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
  { num: '02', modNum: '01', modName: 'Démarrer avec Git', level: 'debutant', durationMin: 26, title: 'Premier dépôt et commits', prereq: 'Leçon 01 recommandée',
    brief: `Sujet : créer un dépôt et enregistrer ses premières versions.
Sections : (1) La configuration initiale : git config --global user.name / user.email (et core.editor) — obligatoire pour signer ses commits. (2) Créer un dépôt : git init (le dossier .git), ou partir d'un dossier existant. (3) Les TROIS ZONES : répertoire de travail → zone d'index (staging) → dépôt. git status pour voir où en sont les fichiers. (4) git add (fichier, dossier, ou « . ») pour indexer ; git restore --staged pour désindexer. (5) git commit -m "message" : créer un instantané ; la notion de commit (un point de sauvegarde avec un identifiant SHA, un auteur, une date, un parent). (6) Écrire de BONS messages de commit (impératif, concis). (7) git log pour voir l'historique. Montre les commandes et leur sortie en commentaire.
Pièges : oublier git config (commits « anonymes ») ; croire que git add suffit à sauvegarder (il faut commit) ; committer des fichiers non voulus ; messages vagues (« update », « fix »).
Pour aller plus loin : .gitignore (leçon 3), git commit -a (raccourci add+commit pour les fichiers suivis), les alias git.
Exercices : (1) configurer son identité Git ; (2) initialiser un dépôt et faire un premier commit ; (3) modifier un fichier, l'indexer et le committer.`,
  },
  { num: '03', modNum: '01', modName: 'Démarrer avec Git', level: 'debutant', durationMin: 26, title: 'Lire l\'historique et ignorer des fichiers', prereq: 'Leçon 02 recommandée',
    brief: `Sujet : explorer l'historique et exclure ce qui ne doit pas être versionné.
Sections : (1) git log et ses options : --oneline (compact), --graph (branches visuelles), --stat (fichiers modifiés), -p (le détail), -n / --since (filtrer), --author. (2) Lire un commit : git show &lt;sha&gt;. (3) Comparer : git diff (travail vs index), git diff --staged (index vs dernier commit), git diff &lt;sha1&gt; &lt;sha2&gt;. (4) Les RÉFÉRENCES : HEAD (le commit courant), HEAD~1 / HEAD^ (parents), un SHA court. (5) Le .gitignore : EXCLURE les fichiers générés/secrets (node_modules/, *.log, .env) ; la syntaxe des motifs ; le piège du fichier DÉJÀ suivi (git rm --cached). (6) git blame (qui a écrit quoi). Montre les commandes et leur sortie.
Pièges : committer des secrets (.env) ou node_modules ; ajouter au .gitignore un fichier déjà suivi (sans effet → git rm --cached) ; confondre git diff et git diff --staged.
Pour aller plus loin : les templates de .gitignore (github/gitignore), git log --grep, git shortlog, les formats de log personnalisés.
Exercices : (1) afficher l'historique en --oneline --graph ; (2) écrire un .gitignore qui exclut un dossier et un type de fichier ; (3) comparer deux versions d'un fichier avec git diff.`,
  },
  { num: '04', modNum: '02', modName: 'Branches & corrections', level: 'debutant', durationMin: 28, title: 'Travailler avec des branches', prereq: 'Module 1 recommandé',
    brief: `Sujet : développer en parallèle sans casser le travail principal.
Sections : (1) Pourquoi une branche : une ligne de développement indépendante (une fonctionnalité, un correctif) sans toucher à « main ». (2) Une branche est un POINTEUR léger vers un commit ; HEAD pointe vers la branche courante. (3) Lister/créer : git branch, git branch &lt;nom&gt;. (4) Changer de branche : git switch &lt;nom&gt; (moderne) ou git checkout &lt;nom&gt; ; créer et basculer d'un coup : git switch -c &lt;nom&gt;. (5) Ce qui se passe quand on committe sur une branche (elle avance, main reste en place). (6) Renommer (git branch -m) et supprimer (git branch -d). (7) Un schéma ASCII de deux branches qui divergent. Montre les commandes et leur sortie.
Pièges : travailler directement sur main au lieu d'une branche ; oublier sur quelle branche on est (git status / git branch) ; perdre des modifications non committées en changeant de branche ; supprimer une branche non fusionnée (-d refuse, -D force).
Pour aller plus loin : la fusion (leçon suivante), les conventions de nommage des branches, git switch - (revenir à la précédente).
Exercices : (1) créer une branche et y basculer ; (2) y faire un commit et vérifier que main n'a pas bougé ; (3) renommer puis supprimer une branche.`,
  },
  { num: '05', modNum: '02', modName: 'Branches & corrections', level: 'debutant', durationMin: 28, title: 'Fusionner des branches', prereq: 'Leçon 04 recommandée',
    brief: `Sujet : réunir le travail de deux branches.
Sections : (1) Le principe : intégrer les commits d'une branche dans une autre. On se place sur la branche de DESTINATION (souvent main) puis git merge &lt;branche-source&gt;. (2) La fusion FAST-FORWARD : si main n'a pas divergé, le pointeur avance simplement (pas de commit de fusion). (3) La fusion à TROIS BRANCHES (true merge) : si les deux ont divergé, Git crée un COMMIT DE FUSION (deux parents). (4) git merge --no-ff pour forcer un commit de fusion (historique explicite). (5) Après fusion : supprimer la branche (git branch -d). (6) Visualiser avec git log --graph --oneline. (7) Un schéma ASCII avant/après fusion. (Les CONFLITS sont traités à la leçon suivante.) Montre les commandes et leur sortie.
Pièges : fusionner depuis la mauvaise branche (on intègre VERS la branche courante) ; croire qu'un fast-forward crée un commit de fusion ; oublier de mettre à jour main avant de fusionner.
Pour aller plus loin : merge vs rebase (leçon 12), --squash (regrouper en un commit), les stratégies de fusion.
Exercices : (1) fusionner une branche de fonctionnalité dans main (fast-forward) ; (2) provoquer une vraie fusion à trois branches ; (3) forcer un commit de fusion avec --no-ff.`,
  },
  { num: '06', modNum: '02', modName: 'Branches & corrections', level: 'intermediaire', durationMin: 28, title: 'Résoudre les conflits', prereq: 'Leçon 05 recommandée',
    brief: `Sujet : gérer les conflits quand deux branches modifient la même chose.
Sections : (1) QUAND survient un conflit : deux branches ont modifié les MÊMES lignes d'un fichier (ou suppression vs modification). Git ne peut pas choisir → il s'arrête et marque le fichier. (2) Les MARQUEURS de conflit dans le fichier : « &lt;&lt;&lt;&lt;&lt;&lt;&lt; HEAD », « ======= », « &gt;&gt;&gt;&gt;&gt;&gt;&gt; branche » — comprendre les deux versions. (3) RÉSOUDRE : éditer le fichier pour garder la bonne version (ou combiner), SUPPRIMER les marqueurs, puis git add le fichier et git commit (ou git merge --continue). (4) git status guide à chaque étape ; git merge --abort pour tout annuler et revenir en arrière. (5) Les outils : git mergetool, l'éditeur/IDE. (6) Réduire les conflits : commits petits, communication, fusionner souvent. Montre un exemple de fichier en conflit et sa résolution.
Pièges : laisser des marqueurs de conflit dans le code (&lt;&lt;&lt;&lt;&lt;&lt;&lt;) ; paniquer et faire n'importe quoi (utiliser --abort) ; oublier git add après résolution ; résoudre en écrasant le travail de l'autre sans le lire.
Pour aller plus loin : git rerere, les conflits lors d'un rebase (leçon 12), les stratégies (ours/theirs), les outils de fusion graphiques.
Exercices : (1) provoquer un conflit volontairement ; (2) le résoudre proprement et committer ; (3) annuler une fusion en cours avec --abort.`,
  },
  { num: '07', modNum: '02', modName: 'Branches & corrections', level: 'intermediaire', durationMin: 30, title: 'Annuler et corriger', prereq: 'Leçon 06 recommandée',
    brief: `Sujet : revenir en arrière sans paniquer.
Sections : (1) Modifier le DERNIER commit : git commit --amend (corriger le message ou ajouter un fichier oublié) — à éviter sur un commit déjà poussé. (2) DÉSINDEXER / DÉFAIRE des modifications : git restore &lt;fichier&gt; (jeter les changements du fichier), git restore --staged &lt;fichier&gt; (désindexer). (3) git reset : --soft (déplace HEAD, garde l'index), --mixed (par défaut, garde le travail), --hard (TOUT jeter — dangereux). Bien distinguer les trois. (4) git revert &lt;sha&gt; : créer un commit qui ANNULE un commit passé (sûr, garde l'historique — idéal sur une branche partagée). (5) reset vs revert : réécrire l'historique (local) vs annuler proprement (partagé). (6) Le FILET DE SÉCURITÉ : git reflog pour retrouver un commit « perdu ». Montre les commandes et leur effet.
Pièges : git reset --hard qui détruit du travail non sauvegardé ; --amend / reset sur des commits déjà poussés (réécrit l'historique des autres) ; confondre reset et revert ; oublier reflog comme filet.
Pour aller plus loin : git restore en profondeur, git clean (supprimer les non-suivis), le rebase interactif (leçon 12), récupérer via reflog.
Exercices : (1) corriger le message du dernier commit avec --amend ; (2) annuler un commit publié avec revert ; (3) retrouver un commit perdu via reflog.`,
  },
  { num: '08', modNum: '03', modName: 'Collaborer avec GitHub', level: 'debutant', durationMin: 28, title: 'Les dépôts distants', prereq: 'Module 2 recommandé',
    brief: `Sujet : synchroniser son dépôt local avec un dépôt distant.
Sections : (1) Ce qu'est un REMOTE : une copie du dépôt hébergée ailleurs (GitHub, GitLab...). Le nom par défaut « origin ». (2) Lier : git remote add origin &lt;url&gt;, git remote -v (lister). (3) CLONER un dépôt existant : git clone &lt;url&gt; (récupère tout l'historique et configure origin). (4) ENVOYER : git push (origin main) ; le premier push : git push -u origin main (établit le suivi). (5) RÉCUPÉRER : git fetch (télécharge sans fusionner) vs git pull (fetch + merge). (6) Les branches de SUIVI (origin/main) et la notion « en avance/en retard » (ahead/behind). (7) HTTPS vs SSH (mention, authentification). Montre les commandes et leur sortie.
Pièges : confondre fetch (télécharge) et pull (télécharge ET fusionne) ; push refusé car le distant a des commits qu'on n'a pas (faire pull d'abord) ; oublier -u au premier push ; pousser sur la mauvaise branche.
Pour aller plus loin : git remote set-url, plusieurs remotes, git pull --rebase, l'authentification (tokens/SSH, leçon suivante).
Exercices : (1) cloner un dépôt et inspecter ses remotes ; (2) faire un commit local et le pousser ; (3) expliquer la différence entre fetch et pull.`,
  },
  { num: '09', modNum: '03', modName: 'Collaborer avec GitHub', level: 'debutant', durationMin: 28, title: 'GitHub : héberger et publier', prereq: 'Leçon 08 recommandée',
    brief: `Sujet : mettre son projet sur GitHub.
Sections : (1) GitHub = une plateforme qui HÉBERGE des dépôts Git et ajoute la collaboration (issues, pull requests, revue). Distinguer Git (l'outil) de GitHub (le service). (2) Créer un compte et un DÉPÔT (public vs privé) ; pousser un projet existant (git remote add + git push -u). (3) L'AUTHENTIFICATION moderne : token d'accès personnel (HTTPS) ou clé SSH — le mot de passe simple n'est plus accepté. (4) Le README.md (présentation, en Markdown) et la licence. (5) Les ISSUES (suivre bugs et tâches) et les Releases/tags (mention). (6) GitHub Pages (publier un site statique — utile pour ce genre de projet). (7) Le profil, les étoiles, l'écosystème. Montre les commandes de mise en ligne et un exemple de README.
Pièges : utiliser un mot de passe (refusé → token ou SSH) ; pousser des secrets en dépôt PUBLIC ; confondre Git et GitHub ; dépôt public/privé mal choisi.
Pour aller plus loin : GitHub Pages, les Actions (CI/CD, mention), les organisations, la sécurité (secrets, .gitignore).
Exercices : (1) décrire les étapes pour publier un projet local sur GitHub ; (2) rédiger un petit README.md ; (3) expliquer pourquoi un token/SSH remplace le mot de passe.`,
  },
  { num: '10', modNum: '03', modName: 'Collaborer avec GitHub', level: 'intermediaire', durationMin: 30, title: 'Pull requests et revue de code', prereq: 'Leçon 09 recommandée',
    brief: `Sujet : proposer et relire des changements en équipe.
Sections : (1) La PULL REQUEST (PR) : proposer de fusionner une branche dans une autre, avec discussion et revue avant l'intégration. (2) Le flux typique : créer une branche → committer → push → ouvrir une PR sur GitHub (base ← compare). (3) La REVUE de code : commentaires ligne par ligne, demandes de changement, approbation ; pousser de nouveaux commits met la PR à jour automatiquement. (4) Les VÉRIFICATIONS automatiques (CI : tests, lint) qui s'exécutent sur la PR. (5) FUSIONNER une PR : merge commit, squash and merge (un seul commit propre), rebase and merge — quand choisir quoi. (6) Lier une PR à une issue (closes #12), supprimer la branche après fusion. (7) Garder sa branche à jour (pull de main / rebase). Montre les commandes côté local et décris les étapes côté GitHub.
Pièges : PR énorme (difficile à relire — préférer des PR petites) ; brancher depuis une main périmée ; ignorer les retours de revue ou la CI rouge ; oublier de supprimer la branche fusionnée.
Pour aller plus loin : les templates de PR, les CODEOWNERS, les protections de branche, les brouillons de PR (draft).
Exercices : (1) décrire les étapes pour ouvrir une PR depuis une branche ; (2) expliquer squash vs merge commit ; (3) lier une PR à une issue avec « closes ».`,
  },
  { num: '11', modNum: '03', modName: 'Collaborer avec GitHub', level: 'intermediaire', durationMin: 28, title: 'Forks et contribution open source', prereq: 'Leçon 10 recommandée',
    brief: `Sujet : contribuer à un projet dont on n'est pas membre.
Sections : (1) Le FORK : une copie PERSONNELLE d'un dépôt sur ton compte GitHub, quand tu n'as pas les droits d'écriture sur l'original. (2) Le flux de contribution : fork → clone de ton fork → créer une branche → committer → push sur TON fork → ouvrir une PR vers le dépôt D'ORIGINE. (3) Le remote « upstream » : ajouter le dépôt original (git remote add upstream &lt;url&gt;) pour SYNCHRONISER (git fetch upstream + merge/rebase) — éviter que ton fork prenne du retard. (4) Les bonnes pratiques OSS : lire le CONTRIBUTING.md et le code de conduite, discuter dans une issue avant, respecter le style du projet, PR ciblée. (5) Le cycle de revue avec les mainteneurs. Montre les commandes du flux fork.
Pièges : travailler sur main de son fork (préférer une branche) ; fork qui diverge sans synchroniser upstream ; PR qui ne respecte pas les conventions du projet ; ne pas lire CONTRIBUTING.md.
Pour aller plus loin : git pull upstream main --rebase, les « good first issues », la signature de commits (GPG), les Discussions GitHub.
Exercices : (1) décrire le flux complet fork → PR ; (2) ajouter un remote upstream et synchroniser ; (3) lister 3 bonnes pratiques avant d'ouvrir une PR sur un projet open source.`,
  },
  { num: '12', modNum: '04', modName: 'Maîtrise & workflows', level: 'intermediaire', durationMin: 30, title: 'Rebase et historique propre', prereq: 'Module 3 recommandé',
    brief: `Sujet : réécrire l'historique pour le rendre clair.
Sections : (1) git rebase &lt;base&gt; : REJOUER ses commits au-dessus d'une autre base — un historique LINÉAIRE (vs le commit de fusion du merge). (2) merge vs rebase : quand préférer l'un (préserver l'historique réel) ou l'autre (historique propre) ; mettre à jour sa branche avec git rebase main. (3) Le REBASE INTERACTIF : git rebase -i HEAD~n pour RÉÉCRIRE (reorder, squash/fixup pour regrouper, reword, edit, drop) — nettoyer avant une PR. (4) git cherry-pick &lt;sha&gt; : reprendre un commit précis sur une autre branche. (5) La RÈGLE D'OR : ne JAMAIS rebaser/réécrire des commits déjà POUSSÉS et partagés (sinon push --force-with-lease, avec prudence). (6) Résoudre les conflits pendant un rebase (--continue / --abort). Montre les commandes et un schéma avant/après.
Pièges : rebaser une branche publique partagée (casse l'historique des autres) ; push --force qui écrase le travail distant (préférer --force-with-lease) ; se perdre dans un rebase interactif (--abort) ; cherry-pick qui duplique des commits.
Pour aller plus loin : git rebase --onto, l'autosquash (--fixup), git reflog pour récupérer, les politiques d'historique d'équipe.
Exercices : (1) rebaser une branche sur main à jour ; (2) regrouper 3 commits en un avec un rebase interactif (squash) ; (3) reprendre un commit avec cherry-pick.`,
  },
  { num: '13', modNum: '04', modName: 'Maîtrise & workflows', level: 'intermediaire', durationMin: 28, title: 'Stash, tags, bisect et autres outils', prereq: 'Leçon 12 recommandée',
    brief: `Sujet : la boîte à outils du quotidien.
Sections : (1) git stash : METTRE DE CÔTÉ des modifications non committées pour changer de branche, puis git stash pop / git stash list / git stash apply. (2) Les TAGS : marquer une version (git tag -a v1.0 -m "..."), tags légers vs annotés, git push --tags ; les Releases GitHub. (3) git bisect : retrouver le commit qui a INTRODUIT un bug par dichotomie (start / bad / good / reset). (4) git blame &lt;fichier&gt; : qui a modifié chaque ligne (et quand). (5) git clean (supprimer les fichiers non suivis, -n pour simuler). (6) Les ALIAS git (git config alias) et quelques raccourcis utiles. (7) git show, git reflog (rappel filet de sécurité). Montre les commandes et leur sortie.
Pièges : oublier un stash et croire son travail perdu (git stash list) ; tag non poussé (git push --tags) ; git clean -f qui supprime définitivement (essayer -n d'abord) ; confondre tag léger et annoté.
Pour aller plus loin : git worktree, les submodules, git bisect run (automatisé), les hooks (leçon suivante).
Exercices : (1) mettre de côté son travail avec stash puis le récupérer ; (2) créer et pousser un tag annoté ; (3) décrire comment bisect trouve un commit fautif.`,
  },
  { num: '14', modNum: '04', modName: 'Maîtrise & workflows', level: 'intermediaire', durationMin: 28, title: 'Workflows d\'équipe & bonnes pratiques', prereq: 'Leçon 13 recommandée',
    brief: `Sujet : organiser le travail à plusieurs — et synthèse du cours.
Sections : (1) Les MODÈLES DE BRANCHES : GitHub Flow (simple : main + branches de fonctionnalité + PR, déploiement continu) vs Git Flow (main/develop/release/hotfix, plus lourd) ; trunk-based development. Quand choisir quoi. (2) Les BONS MESSAGES de commit : impératif, ligne de résumé courte + corps explicatif ; les Conventional Commits (feat:, fix:...). (3) La PROTECTION de branche (revue obligatoire, CI verte, pas de push direct sur main). (4) Le .gitignore d'équipe et la gestion des SECRETS (jamais en clair). (5) L'INTÉGRATION CONTINUE (CI/CD) en bref (GitHub Actions : tests/lint automatiques sur chaque PR). (6) Les hooks (pre-commit) pour automatiser les vérifications. (7) &lt;h2&gt;Et après&lt;/h2&gt; : tu maîtrises Git et GitHub ; pistes — CI/CD avancée, monorepos, GitLab/Bitbucket, la signature de commits, contribuer à l'open source. Encourage.
Remplace « Pièges fréquents » par une CHECKLIST DE BONNES PRATIQUES (à puces). GARDE « Pour aller plus loin », « Récap et vérification » et « Exercices ».
Exercices : (1) comparer GitHub Flow et Git Flow en quelques lignes ; (2) rédiger 3 messages de commit conventionnels ; (3) lister 5 règles d'or pour collaborer proprement avec Git.`,
  },
];

log('Rédaction de ' + SPECS.length + ' leçons (Git & GitHub)…');

const results = await pipeline(
  SPECS,
  (s) =>
    agent(
      INSTRUCTIONS +
        '\n\n=== LEÇON À RÉDIGER ===\nNuméro : ' + s.num + ' | Module ' + s.modNum + ' (' + s.modName + ')\nTitre : ' + s.title +
        '\n\nBRIEF DÉTAILLÉ (intègre fidèlement le contenu et les commandes ; montre la sortie en commentaire ; échappe < > & dans le code) :\n' + s.brief,
      { label: 'écrit L' + s.num, phase: 'Rédaction', schema: SCHEMA }
    ),
  (parts, s) =>
    agent(
      INSTRUCTIONS +
        '\n\n=== RELECTURE CRITIQUE (corrige et renvoie la version finale, même schéma) ===\nLeçon ' + s.num + ' « ' + s.title + ' ».\n' +
        '1. EXACTITUDE des commandes Git modernes (main, switch/restore, --force-with-lease…) ; chaque exemple correct, sortie commentée plausible.\n' +
        '2. PAS d\'invitation à « Tester »/« Aperçu » (Git ne tourne pas dans le navigateur) ; sorties en commentaire ou bloc « Terminal ».\n' +
        '3. ÉCHAPPEMENT : DANS les blocs de code, « < »→« &lt; », « > »→« &gt; » (placeholders &lt;branche&gt;, marqueurs de conflit &lt;&lt;&lt;&lt;&lt;&lt;&lt;, redirection &gt;), « & »→« &amp; » (chaînage &amp;&amp;). Aucun caractère brut dans un &lt;code&gt;.\n' +
        '4. STRUCTURE : intro, 5–8 sections <h2>, Pièges fréquents (sauf L14 : checklist), Pour aller plus loin, Récap et vérification (lesson-check), Exercices (3 avec solutions).\n' +
        '5. Public débutant→intermédiaire ; aucun style/script réel dans la page.\n\n' +
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
