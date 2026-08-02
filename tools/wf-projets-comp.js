export const meta = {
  name: 'syntaxe-projets-comp',
  description: 'Rédige 4 leçons de compléments du cours Projets JS (appli météo via API, jeu du serpent sur canvas)',
  phases: [{ title: 'Rédaction' }, { title: 'Relecture' }],
};

function buildLesson(p) {
  const objectives = p.objectives.map((o) => '                  <li>' + o + '</li>').join('\n');
  return `<!DOCTYPE html>
<html lang="fr" data-theme="light">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${p.title} — Projet ${p.projNum} · Projets JavaScript · Syntaxe</title>
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

  <body data-course="projets-js" data-lesson="lecon-${p.num}.html">
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
            <li><a href="cours.html">Projets JavaScript</a></li>
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
              <p class="kicker">Projet ${p.projNum} · ${p.projName} — Leçon ${p.num}</p>
              <h1 class="lesson-header__title">${p.title}</h1>
              <div class="meta-row">
                <span class="duration">
                  <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
                  ~${p.durationMin} min
                </span>
                <span class="dot-sep"><span class="pill pill--intermediaire">Intermédiaire</span></span>
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

const INSTRUCTIONS = `Tu rédiges une leçon du cours « Projets JavaScript : apprendre en construisant » (site Syntaxe). Public : a fini le
cours JS confirmé et déjà construit 6 projets (calculatrice, quiz, budget, mot de passe, morpion, Pomodoro). MÉTHODE du
cours : chaque projet se fait en 2 leçons — d'abord la LOGIQUE PURE (testable dans l'éditeur), puis l'INTERFACE (DOM).
Français, tutoiement, ton concret de mentor qui construit avec l'apprenant. JavaScript MODERNE.

ÉDITEUR INTÉGRÉ : un bouton « ▶ Tester » apparaît sur les blocs language-javascript de LOGIQUE PURE (sans
document/window/fetch/canvas…). Pour les leçons de LOGIQUE, rends le code EXÉCUTABLE et autonome (données d'exemple +
appel + sortie en commentaire « // affiche: … »). Pour les leçons d'INTERFACE (fetch, canvas, DOM), le code n'est pas
exécutable ici : décris son effet en commentaire et donne le HTML en bloc language-markup. N'invite pas explicitement à cliquer.

TU PRODUIS UNIQUEMENT { metaDesc, objectives, body } :
- metaDesc : ~150 caractères.
- objectives : 3 à 4 chaînes (« savoir faire X »), HTML inline autorisé (<code>, <strong>). «&nbsp;;» puis «.» pour la dernière.
- body : HTML INTÉRIEUR de <article class="prose"> (sans la balise article, sans bouton « terminer », sans nav).

STRUCTURE (≈1300–1800 mots) : 1–2 <p> d'intro qui situe le projet ; 5–8 sections <h2> construites pas à pas (chacune
avec un exemple commenté) ; <h2>Pièges fréquents</h2> ; <h2>Pour aller plus loin</h2> ; <h2>Récap et vérification</h2>
(résumé <ul> + lesson-check) ; <h2>Exercices</h2> (3 gradués avec solutions repliables).

COMPOSANTS (n'invente pas d'autres classes) :
- Code JS : <figure class="code-block" data-file="jeu.js"><pre><code class="language-javascript">… CODE ÉCHAPPÉ …</code></pre></figure>.
- HTML : class="language-markup" (balises ÉCHAPPÉES) ; CSS : class="language-css". Légende : <p class="code-caption">…</p>
- Note : <div class="callout callout--note">${ICON_NOTE}<div class="callout__body"><p class="callout__title">Note</p><p>…</p></div></div>
- Piège : <div class="callout callout--warn">${ICON_WARN}<div class="callout__body"><p class="callout__title">Piège fréquent</p><p>…</p></div></div>
- Astuce : <div class="callout callout--tip">${ICON_TIP}<div class="callout__body"><p class="callout__title">Astuce</p><p>…</p></div></div>
- Pour aller plus loin : <div class="callout callout--more">${ICON_MORE}<div class="callout__body"><p class="callout__title">Pour aller plus loin</p><p>…</p></div></div>
- Vérification : <div class="lesson-check"><p class="kicker kicker--gold">Vérifie ta compréhension</p><ol><li>…</li><li>…</li><li>…</li></ol></div>
- Exercice : <div class="exercise"><div class="exercise__head"><span class="exercise__num">Exercice 1</span><span class="exercise__level">Échauffement</span></div><p>…</p><details><summary>Voir une solution</summary><figure class="code-block" data-file="solution.js"><pre><code class="language-javascript">…</code></pre></figure></details></div>

ÉCHAPPEMENT (CRITIQUE) : DANS un <code>, « < »→« &lt; », « > »→« &gt; », « & »→« &amp; » (dont &amp;&amp; et la flèche =&gt;) ;
toute balise HTML d'exemple est échappée (&lt;canvas&gt;, &lt;form&gt;, &lt;input&gt;). Aucun caractère brut dans un &lt;code&gt;.

RÈGLES : code complet et correct, construit progressivement. Aucun style=, aucun <style>, aucun <script> RÉEL dans la page
(le CSS d'exemple va dans des blocs language-css ; le HTML dans language-markup).`;

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
  { num: '13', projNum: '07', projName: 'Application météo (API)', durationMin: 28, title: 'Traiter les données d\'une API météo', prereq: 'Cours Projets JS recommandé',
    brief: `Sujet : la LOGIQUE PURE d'une appli météo — transformer des données brutes d'API en données prêtes à afficher, SANS réseau (donc testable dans l'éditeur).
Sections : (1) Présentation du projet : une appli météo qui interroge une API publique gratuite (ex. Open-Meteo, sans clé) ; cette leçon construit la LOGIQUE de transformation, la suivante l'interface. (2) La FORME des données : un exemple de réponse JSON en dur (température actuelle, code météo, vent, tableau de prévisions horaires). (3) Des FONCTIONS PURES : codeVersLibelle (mapper un code météo → texte + emoji), formaterTemperature, formaterHeure (ISO → HH:MM), choisirTenue (conseil selon la température). (4) AGRÉGER : réduire un tableau d'heures en statistiques (min, max, moyenne via Math.min/max/reduce). (5) Gérer les CAS LIMITES : données manquantes, valeurs nulles, tableau vide (valeurs par défaut). (6) Pourquoi séparer : toutes ces fonctions sont TESTABLES dans l'éditeur (jeu de données + appel + sortie commentée), indépendamment du fetch. Code JS PUR exécutable.
Pièges : mélanger transformation et fetch (rend la logique intestable) ; coder en dur l'unité (°C/°F) ; ignorer les données manquantes ; muter le JSON reçu au lieu d'en dériver de nouvelles valeurs.
Pour aller plus loin : mettre en cache les résultats, l'internationalisation (Intl.NumberFormat/DateTimeFormat), les prévisions multi-jours, les tests unitaires de ces fonctions.
Exercices : (1) mapper un code météo en libellé + emoji ; (2) calculer la température min et max d'une journée à partir des heures ; (3) formater une heure ISO en HH:MM.`,
  },
  { num: '14', projNum: '07', projName: 'Application météo (API)', durationMin: 30, title: 'L\'interface météo : fetch et affichage', prereq: 'Leçon 13 recommandée',
    brief: `Sujet : connecter la logique à une VRAIE API et l'afficher (leçon d'INTERFACE — fetch + DOM, décrite en commentaire).
Sections : (1) L'HTML de l'appli : un champ de recherche de ville, un bouton, une zone de résultat (bloc language-markup échappé) ; un peu de CSS (bloc language-css). (2) Le flux à DEUX requêtes : GÉOCODER la ville → latitude/longitude (premier fetch), puis récupérer la météo à ces coordonnées (second fetch) ; async/await + try/catch. (3) Les ÉTATS d'interface : chargement (afficher un indicateur), erreur (ville introuvable, réseau coupé), succès ; une seule fonction qui rend l'état courant. (4) RENDRE le résultat dans le DOM en RÉUTILISANT les fonctions pures de la leçon 13. (5) L'événement de recherche (submit + preventDefault), éviter les requêtes inutiles. (6) ACCESSIBILITÉ : aria-live sur la zone de résultat, messages clairs, comportement hors-ligne. Donne le HTML/CSS en blocs, et le JS (fetch/DOM) décrit en commentaire.
Pièges : ne pas gérer l'erreur réseau ou « ville introuvable » ; figer l'interface pendant le fetch ; oublier preventDefault ; injecter des données dans innerHTML sans précaution (préférer textContent).
Pour aller plus loin : AbortController (annuler la recherche précédente), la géolocalisation du navigateur, un cache local, le debounce de la saisie.
Exercices : (1) afficher un état de chargement pendant la requête ; (2) gérer proprement le cas « ville introuvable » ; (3) afficher la météo en réutilisant les fonctions pures de la leçon précédente.`,
  },
  { num: '15', projNum: '08', projName: 'Jeu du serpent (canvas)', durationMin: 30, title: 'La logique du serpent', prereq: 'Projet 07 recommandé',
    brief: `Sujet : le MOTEUR d'un jeu du serpent (Snake), en logique PURE testable (sans affichage).
Sections : (1) Présentation : un jeu du serpent sur une grille ; cette leçon construit l'état et les RÈGLES, la suivante le rendu sur canvas. (2) L'ÉTAT du jeu (un objet) : la grille (largeur, hauteur), le serpent (tableau de cases { x, y }, la tête en premier), la direction, la pomme, le score, le statut (en cours / perdu). (3) Le DÉPLACEMENT : calculer la NOUVELLE TÊTE selon la direction, puis avancer (ajouter la tête en début, retirer la queue — sauf si on mange). (4) Les COLLISIONS : sortie de grille (mur) et la tête qui touche le corps → partie perdue. (5) Manger la POMME : si la tête atteint la pomme, GRANDIR (ne pas retirer la queue) puis poser une nouvelle pomme sur une case LIBRE. (6) Empêcher le DEMI-TOUR (on ne peut pas inverser sa direction). Écris des fonctions PURES (état → nouvel état) : testables dans l'éditeur. Code JS pur exécutable.
Pièges : MUTER l'état au lieu d'en renvoyer un nouveau ; générer la pomme SUR le serpent ; autoriser le demi-tour (mort immédiate) ; mauvais ordre avancer / manger / détecter la collision.
Pour aller plus loin : la difficulté progressive (vitesse), des obstacles, un mode deux joueurs, une IA qui joue.
Exercices : (1) calculer la prochaine position de la tête selon la direction ; (2) détecter une collision du serpent avec lui-même ; (3) faire grandir le serpent quand il mange la pomme.`,
  },
  { num: '16', projNum: '08', projName: 'Jeu du serpent (canvas)', durationMin: 32, title: 'Le rendu sur canvas et la boucle de jeu', prereq: 'Leçon 15 recommandée',
    brief: `Sujet : DESSINER le jeu et l'ANIMER (leçon d'interface — canvas + boucle, décrite en commentaire).
Sections : (1) Le CANVAS : la balise &lt;canvas&gt; (bloc language-markup), getContext("2d"), le repère (origine en haut à gauche, y vers le bas), fillRect / clearRect ; dessiner la grille, le serpent et la pomme à partir de l'état (leçon 15). (2) La BOUCLE DE JEU : requestAnimationFrame avec un PAS DE TEMPS FIXE (le serpent avance toutes les X ms grâce à un accumulateur de temps) ; pourquoi pas setInterval (saccades, désynchronisation). (3) Les CONTRÔLES clavier : keydown → changer la direction ; empêcher le défilement de la page sur les flèches (preventDefault). (4) Le RENDU = lire l'état puis le DESSINER : bien SÉPARER logique (leçon 15) et rendu. (5) Les ÉCRANS : démarrage, partie en cours, game over (score + rejouer). (6) Finitions : focus clavier, instructions, couleurs, responsive. Donne le HTML (&lt;canvas&gt;) et décris le JS (canvas/rAF/clavier) en commentaire.
Pièges : mélanger logique et rendu ; faire avancer le jeu à chaque frame (trop rapide — utiliser un pas de temps) ; oublier de clearRect (traînées) ; oublier preventDefault sur les flèches ; redessiner sans que l'état ait changé.
Pour aller plus loin : l'interpolation pour un mouvement fluide, des sprites/images, le son, les contrôles tactiles (mobile), OffscreenCanvas.
Exercices : (1) dessiner le serpent et la pomme sur le canvas à partir de l'état ; (2) faire avancer le jeu à intervalle fixe avec requestAnimationFrame ; (3) changer la direction au clavier en interdisant le demi-tour.`,
  },
];

log('Rédaction de ' + SPECS.length + ' leçons (compléments Projets JS)…');

const results = await pipeline(
  SPECS,
  (s) =>
    agent(
      INSTRUCTIONS +
        '\n\n=== LEÇON À RÉDIGER ===\nProjet ' + s.projNum + ' (' + s.projName + ') — Leçon ' + s.num + '\nTitre : ' + s.title +
        '\n\nBRIEF DÉTAILLÉ (construis le projet pas à pas ; logique pure exécutable, interface décrite ; échappe < > & et les balises) :\n' + s.brief,
      { label: 'écrit L' + s.num, phase: 'Rédaction', schema: SCHEMA }
    ),
  (parts, s) =>
    agent(
      INSTRUCTIONS +
        '\n\n=== RELECTURE CRITIQUE (corrige et renvoie la version finale, même schéma) ===\nLeçon ' + s.num + ' « ' + s.title + ' » (Projet ' + s.projNum + ').\n' +
        '1. COHÉRENCE projet : la leçon de LOGIQUE est du JS pur exécutable (sortie commentée) ; la leçon d\'INTERFACE donne le HTML/CSS et décrit le JS (fetch/canvas).\n' +
        '2. EXACTITUDE du code (transformation de données API / moteur de jeu / canvas+rAF selon la leçon).\n' +
        '3. ÉCHAPPEMENT : « < »→« &lt; », « > »→« &gt; », « & »→« &amp; » (dont &amp;&amp; et =&gt;) ; balises d\'exemple échappées (&lt;canvas&gt;…). Aucun caractère brut dans un &lt;code&gt;.\n' +
        '4. STRUCTURE : intro, 5–8 sections <h2>, Pièges fréquents, Pour aller plus loin, Récap et vérification (lesson-check), Exercices (3 avec solutions).\n' +
        '5. Aucun style/script réel dans la page (CSS en language-css, HTML en language-markup).\n\n' +
        'BRIEF DE RÉFÉRENCE :\n' + s.brief + '\n\nBROUILLON (JSON) :\n' + JSON.stringify(parts),
      { label: 'relit L' + s.num, phase: 'Relecture', schema: SCHEMA }
    ).then((fixed) => {
      const p = fixed || parts;
      const html = buildLesson({
        num: s.num, projNum: s.projNum, projName: s.projName, durationMin: s.durationMin,
        title: s.title, prereq: s.prereq, metaDesc: p.metaDesc, objectives: p.objectives, body: p.body,
      });
      return { file: 'lecon-' + s.num + '.html', html, num: s.num };
    })
);

const ok = results.filter(Boolean);
log('Leçons assemblées : ' + ok.length + '/' + SPECS.length);
return ok;
