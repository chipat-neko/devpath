export const meta = {
  name: 'syntaxe-python-comp',
  description: 'Rédige 2 leçons de compléments du cours Python (expressions régulières, dates & heures)',
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
    <title>${p.title} — Leçon ${p.num} · Python · Syntaxe</title>
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

  <body data-course="python" data-lesson="lecon-${p.num}.html">
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
            <li><a href="cours.html">Python</a></li>
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
    <script src="../../assets/vendor/prism/prism-python.min.js" defer></script>
  </body>
</html>
`;
}

const ICON_NOTE = '<svg class="callout__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M12 8h.01M11 12h1v4h1" /></svg>';
const ICON_WARN = '<svg class="callout__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" /><path d="M12 9v4M12 17h.01" /></svg>';
const ICON_TIP = '<svg class="callout__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12c.7.7 1 1.2 1 2h6c0-.8.3-1.3 1-2a7 7 0 0 0-4-12Z" /></svg>';
const ICON_MORE = '<svg class="callout__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 3v14M5 10l7 7 7-7M5 21h14" /></svg>';

const INSTRUCTIONS = `Tu rédiges une leçon de COMPLÉMENTS du cours « Python : des bases au niveau confirmé » (site Syntaxe).
Public : a fini les 15 leçons (types, conditions, boucles, fonctions, listes/dicts/sets, chaînes, compréhensions,
modules, fichiers/exceptions, POO, générateurs). Ces deux leçons comblent deux outils essentiels de la bibliothèque
standard. Français, tutoiement, ton clair et concret. Python 3 MODERNE et idiomatique. NE réexplique pas les bases.

PAS D'EXÉCUTION EN DIRECT : Python ne tourne pas dans le navigateur. N'invite JAMAIS à cliquer « Tester »/« Aperçu ».
Montre le code en blocs « language-python » et les résultats en COMMENTAIRE (« # affiche: … ») ou dans un bloc « Console ».

TU PRODUIS UNIQUEMENT { metaDesc, objectives, body } :
- metaDesc : ~150 caractères.
- objectives : 3 à 4 chaînes (« savoir faire X »), HTML inline autorisé (<code>, <strong>). «&nbsp;;» puis «.» pour la dernière.
- body : HTML INTÉRIEUR de <article class="prose"> (sans la balise article, sans bouton « terminer », sans nav).

STRUCTURE (≈1300–1800 mots) : 1–2 <p> d'intro ; 5–8 sections <h2> (chacune avec un exemple commenté) ;
<h2>Pièges fréquents</h2> ; <h2>Pour aller plus loin</h2> ; <h2>Récap et vérification</h2> (résumé <ul> + lesson-check) ;
<h2>Exercices</h2> (3 gradués avec solutions repliables contenant du code).

COMPOSANTS (n'invente pas d'autres classes) :
- Code Python : <figure class="code-block" data-file="script.py"><pre><code class="language-python">… CODE ÉCHAPPÉ …</code></pre></figure>.
- Sortie : <figure class="code-block" data-file="Console"><pre><code class="language-python">…</code></pre></figure>. Légende : <p class="code-caption">…</p>
- Note : <div class="callout callout--note">${ICON_NOTE}<div class="callout__body"><p class="callout__title">Note</p><p>…</p></div></div>
- Piège : <div class="callout callout--warn">${ICON_WARN}<div class="callout__body"><p class="callout__title">Piège fréquent</p><p>…</p></div></div>
- Astuce : <div class="callout callout--tip">${ICON_TIP}<div class="callout__body"><p class="callout__title">Astuce</p><p>…</p></div></div>
- Pour aller plus loin : <div class="callout callout--more">${ICON_MORE}<div class="callout__body"><p class="callout__title">Pour aller plus loin</p><p>…</p></div></div>
- Vérification : <div class="lesson-check"><p class="kicker kicker--gold">Vérifie ta compréhension</p><ol><li>…</li><li>…</li><li>…</li></ol></div>
- Exercice : <div class="exercise"><div class="exercise__head"><span class="exercise__num">Exercice 1</span><span class="exercise__level">Échauffement</span></div><p>…</p><details><summary>Voir une solution</summary><figure class="code-block" data-file="solution.py"><pre><code class="language-python">…</code></pre></figure></details></div>

ÉCHAPPEMENT (CRITIQUE) : DANS un <code>, « < »→« &lt; », « > »→« &gt; », « & »→« &amp; ». Donc les comparaisons « a < b »→« a &lt; b »,
la flèche d'annotation « -> »→« -&gt; ». Les motifs regex utilisent surtout \\ (antislash) et [], sans < > — mais reste vigilant.

RÈGLES : Python 3 correct et pythonique (chaînes brutes r"" pour les regex, datetime moderne, zoneinfo). Aucun style=,
aucun <style>, aucun <script> RÉEL dans la page (ton body = prose + blocs de code).`;

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
  { num: '16', modNum: '06', modName: 'Compléments essentiels', level: 'intermediaire', durationMin: 30, title: 'Les expressions régulières (module re)', prereq: 'Cours Python confirmé recommandé',
    brief: `Sujet : rechercher, extraire et remplacer des MOTIFS dans du texte avec le module re.
Sections : (1) Pourquoi : valider un format, extraire des informations (emails, dates, montants), remplacer par motif — là où les méthodes de chaîne ne suffisent plus. (2) Le module re et les CHAÎNES BRUTES r"..." (indispensables pour éviter que Python interprète l'antislash). (3) Les FONCTIONS : re.search (1re occurrence n'importe où), re.match (au début), re.fullmatch, re.findall (toutes les correspondances), re.finditer, re.sub (remplacer), re.split. (4) La SYNTAXE des motifs : les classes (\\d, \\w, \\s, [...], [^...]), les quantificateurs (*, +, ?, {n,m}), les ancres (^, $, \\b), l'alternative (|), les groupes (...) et les groupes NOMMÉS (?P&lt;nom&gt;...). (5) L'objet Match : group(), groups(), groupdict(), span(). (6) Les DRAPEAUX : re.IGNORECASE, re.MULTILINE, re.DOTALL. (7) re.compile pour réutiliser un motif ; greedy (.*) vs lazy (.*?). Montre des exemples avec la sortie en commentaire.
Pièges : oublier le préfixe r"" (antislash mal interprété) ; un motif TROP gourmand (.* greedy) ; confondre match (ancré au début) et search ; ne pas échapper les caractères spéciaux (. ( ) [ ) ; capturer alors qu'on veut un groupe non capturant (?:...).
Pour aller plus loin : les assertions lookahead/lookbehind, la performance (motifs catastrophiques), tester sur regex101, quand préférer un vrai parseur.
Exercices : (1) extraire tous les nombres d'une chaîne ; (2) valider un code postal à 5 chiffres ; (3) remplacer une date JJ/MM/AAAA en utilisant des groupes nommés.`,
  },
  { num: '17', modNum: '06', modName: 'Compléments essentiels', level: 'intermediaire', durationMin: 28, title: 'Dates, heures et durées (datetime)', prereq: 'Leçon 16 recommandée',
    brief: `Sujet : manipuler le temps en Python (le module datetime).
Sections : (1) Les TYPES : date, time, datetime, et timedelta (une durée). (2) CRÉER : datetime.now(), date.today(), datetime(2026, 6, 10, 14, 30), et depuis une chaîne avec strptime (analyse selon un format). (3) FORMATER une date en chaîne : strftime et ses codes (%Y %m %d %H %M %S, %A jour, %B mois) ; le format ISO (isoformat / fromisoformat). (4) Les DURÉES : timedelta(days=…, hours=…) ; l'ARITHMÉTIQUE (date + timedelta, différence entre deux dates → un timedelta). (5) COMPARER et trier des dates. (6) Les FUSEAUX HORAIRES : datetime « naïf » (sans fuseau) vs « avisé » (aware) ; timezone.utc et le module zoneinfo (ZoneInfo("Europe/Paris")) pour convertir entre fuseaux. (7) Le module time : l'« epoch » (time.time()), et perf_counter() pour CHRONOMÉTRER du code. Montre des exemples avec la sortie en commentaire.
Pièges : mélanger datetime naïf et avisé (erreurs de fuseau) ; mauvais codes strftime (%m mois vs %M minutes) ; oublier que mois et jours commencent à 1 ; soustraire des dates de fuseaux différents ; ne pas tenir compte de l'heure d'été.
Pour aller plus loin : le stockage en UTC (et conversion à l'affichage), dateutil pour un parsing souple, pendulum/arrow, le module calendar.
Exercices : (1) calculer le nombre de jours jusqu'à une date donnée ; (2) formater la date du jour en « 10 juin 2026 » ; (3) analyser une chaîne « 2026-06-10 » avec strptime puis ajouter 30 jours.`,
  },
];

log('Rédaction de ' + SPECS.length + ' leçons (compléments Python)…');

const results = await pipeline(
  SPECS,
  (s) =>
    agent(
      INSTRUCTIONS +
        '\n\n=== LEÇON À RÉDIGER ===\nNuméro : ' + s.num + ' | Module ' + s.modNum + ' (' + s.modName + ')\nTitre : ' + s.title +
        '\n\nBRIEF DÉTAILLÉ (intègre fidèlement le contenu ; sorties en commentaire ; chaînes brutes r"" pour les regex ; échappe < > & et -> dans le code) :\n' + s.brief,
      { label: 'écrit L' + s.num, phase: 'Rédaction', schema: SCHEMA }
    ),
  (parts, s) =>
    agent(
      INSTRUCTIONS +
        '\n\n=== RELECTURE CRITIQUE (corrige et renvoie la version finale, même schéma) ===\nLeçon ' + s.num + ' « ' + s.title + ' ».\n' +
        '1. EXACTITUDE du Python 3 (module re et chaînes r"" / module datetime, zoneinfo selon la leçon) ; exemples corrects, sorties plausibles.\n' +
        '2. PAS d\'invitation à « Tester »/« Aperçu » ; résultats en commentaire ou bloc « Console ».\n' +
        '3. ÉCHAPPEMENT : DANS les blocs de code, « < »→« &lt; », « > »→« &gt; » (groupes nommés (?P&lt;nom&gt;…), flèche -&gt;), « & »→« &amp; ». Aucune balise réelle dans un &lt;code&gt;.\n' +
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
