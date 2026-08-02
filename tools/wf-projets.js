export const meta = {
  name: 'syntaxe-projets-js',
  description: 'Rédige les 12 leçons du cours « Projets JavaScript : apprendre en construisant »',
  phases: [{ title: 'Rédaction' }, { title: 'Relecture' }],
};

function buildLesson(p) {
  const objectives = p.objectives.map((o) => '                  <li>' + o + '</li>').join('\n');
  return `<!DOCTYPE html>
<html lang="fr" data-theme="light">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${p.title} — Projet ${p.modNum} · Projets JavaScript · Syntaxe</title>
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
              <p class="kicker">Projet ${p.modNum} · ${p.modName} — Leçon ${p.num}</p>
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

const INSTRUCTIONS = `Tu rédiges une leçon du cours « Projets JavaScript : apprendre en construisant » (site Syntaxe).
Public : développeurs qui connaissent déjà JavaScript au niveau confirmé (fonctions, tableaux, objets,
classes, DOM, événements, localStorage). NE réexplique pas ces bases ; mets-les en pratique.
Français, tutoiement, ton concret et orienté construction.

MÉTHODE DU COURS (à respecter) : chaque projet se fait en deux leçons.
- Les leçons de LOGIQUE (1re de chaque projet) construisent des FONCTIONS PURES et testables,
  INDÉPENDANTES du DOM. Le code doit être SELF-CONTAINED et se terminer par des appels
  console.log qui DÉMONTRENT le résultat — ainsi le lecteur peut cliquer « ▶ Tester » et l'exécuter
  dans l'éditeur intégré. N'utilise NI document, NI window, NI localStorage, NI alert dans ces blocs.
- Les leçons d'INTERFACE (2e de chaque projet) branchent la logique au DOM (sélection, événements,
  rendu, parfois localStorage). Là, le code utilise document/etc. (il ne sera pas exécutable dans
  l'éditeur, c'est normal). Montre le HTML (language-markup) et le CSS utile (language-css) + le JS.
Le brief précise si la leçon est « LOGIQUE » ou « INTERFACE ».

TU PRODUIS UNIQUEMENT { metaDesc, objectives, body } :
- metaDesc : ~150 caractères.
- objectives : 3 à 4 chaînes (« savoir faire X »), HTML inline autorisé. «&nbsp;;» puis «.» pour la dernière.
- body : HTML INTÉRIEUR de <article class="prose"> (sans la balise article, sans bouton « terminer », sans nav — ajoutés automatiquement).

STRUCTURE du body (≈1200–1700 mots) :
1. 1–2 <p> d'intro (ce qu'on construit dans cette leçon, sur quoi on s'appuie).
2. 5 à 7 sections <h2> qui CONSTRUISENT le projet étape par étape, avec du code commenté.
3. <h2>Pièges fréquents</h2>.
4. <h2>Pour aller plus loin</h2> (idées d'amélioration du projet).
5. <h2>Récap et vérification</h2> : résumé en <ul> + bloc lesson-check (3 questions).
6. <h2>Exercices</h2> : exactement 3 exercices gradués (Échauffement, Application, Défi) avec solution repliable.

COMPOSANTS HTML EXACTS (n'invente pas d'autres classes) :
- Code : <figure class="code-block" data-file="exemple.js"><pre><code class="language-javascript">CODE</code></pre></figure> (HTML : data-file="index.html" + class="language-markup" ; CSS : class="language-css").
- Légende : <p class="code-caption">…</p>
- Note : <div class="callout callout--note">${ICON_NOTE}<div class="callout__body"><p class="callout__title">Note</p><p>…</p></div></div>
- Piège : <div class="callout callout--warn">${ICON_WARN}<div class="callout__body"><p class="callout__title">Piège fréquent</p><p>…</p></div></div>
- Astuce : <div class="callout callout--tip">${ICON_TIP}<div class="callout__body"><p class="callout__title">Astuce</p><p>…</p></div></div>
- Pour aller plus loin : <div class="callout callout--more">${ICON_MORE}<div class="callout__body"><p class="callout__title">Pour aller plus loin</p><p>…</p></div></div>
- Vérification : <div class="lesson-check"><p class="kicker kicker--gold">Vérifie ta compréhension</p><ol><li>…</li><li>…</li><li>…</li></ol></div>
- Exercice : <div class="exercise"><div class="exercise__head"><span class="exercise__num">Exercice 1</span><span class="exercise__level">Échauffement</span></div><p>…</p><details><summary>Voir une solution</summary><figure class="code-block" data-file="solution.js"><pre><code class="language-javascript">…</code></pre></figure></details></div>

Pour une leçon de LOGIQUE : suggère explicitement au lecteur d'utiliser le bouton « ▶ Tester » sur les
blocs de code (une fois dans le corps, ex. via un encadré Astuce), et assure-toi qu'au moins 2–3 blocs
sont des exemples complets et autonomes avec des console.log.

ÉCHAPPEMENT DANS LE CODE (critique) — dans <code> : « & » → « &amp; » (donc « &amp;&amp; »), « < » → « &lt; »
(comparaisons, balises HTML &lt;div&gt;, &lt;script&gt;). « > » peut rester (« => » tel quel).

RÈGLES : aucun style inline dans le code HTML d'exemple — utilise plutôt une balise &lt;style&gt; ou des
classes dans les exemples de projet ; aucun style/script inline dans la PAGE elle-même (mais le body que
tu produis ne contient que de la prose + des blocs de code, donc pas de souci). Code JS MODERNE et CORRECT.`;

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
  { num: '01', modNum: '01', modName: 'Calculatrice', durationMin: 28, title: 'La logique de la calculatrice', prereq: 'Cours JavaScript confirmé recommandé',
    brief: `TYPE : LOGIQUE (testable dans l'éditeur — code self-contained avec console.log, sans DOM).
Sujet : la logique d'une calculatrice, sans interface.
Sections : (1) Pourquoi séparer la logique de l'affichage. (2) Les opérations comme objet de stratégies :
const operations = { "+": (a, b) => a + b, "-": (a, b) => a - b, "*": (a, b) => a * b, "/": (a, b) => (b === 0 ? null : a / b) };
puis function calculer(a, op, b) { const f = operations[op]; return f ? f(a, b) : null; } — DÉMO console.log(calculer(6, "+", 4)) //=> 10, calculer(5, "/", 0) //=> null. (3) Gérer la précision : arrondir le résultat (Math.round(x * 1e10) / 1e10) ou (Number(x.toFixed(10))) pour éviter 0.1+0.2. (4) Une petite MACHINE À ÉTATS : un objet etat = { affichage: "0", enAttente: null, operateur: null } et des fonctions PURES qui renvoient un NOUVEL état : saisirChiffre(etat, c), choisirOperateur(etat, op), egal(etat), effacer(). (Style immuable avec spread.) (5) DÉMO : enchaîner quelques actions et console.log l'affichage. (6) Encadré Astuce : invite à cliquer « ▶ Tester » pour expérimenter calculer().
Pièges : utiliser eval() (dangereux !) au lieu d'un objet d'opérations ; division par zéro ; flottants ; muter l'état au lieu d'en renvoyer un nouveau.
Pour aller plus loin : gérer une suite d'opérations (file), la priorité, les décimales, le pourcentage.
Exercices : (1) ajouter l'opération modulo à l'objet operations ; (2) écrire calculer en gérant un opérateur inconnu (retour null) ; (3) écrire pourcentage(x) qui renvoie x/100, et l'utiliser.`,
  },
  { num: '02', modNum: '01', modName: 'Calculatrice', durationMin: 30, title: "L'interface de la calculatrice", prereq: 'Leçon 01 recommandée',
    brief: `TYPE : INTERFACE (DOM — code avec document, non exécutable dans l'éditeur, c'est normal).
Sujet : brancher la logique de la leçon 1 à une vraie interface.
Sections : (1) Le HTML : une zone d'affichage + une grille de boutons (chiffres, opérateurs, =, C). Donner le code en language-markup (échappé). (2) Le CSS : disposer les touches en grille (CSS Grid), un style sobre. language-css. (3) Sélectionner les éléments : document.querySelector(".affichage"), la grille de boutons. (4) La DÉLÉGATION d'événements : un seul écouteur sur la grille, lire event.target.dataset (data-chiffre, data-op, data-action) pour savoir quelle touche. (5) Mettre à jour l'affichage : une fonction rendre(etat) qui écrit etat.affichage dans le DOM (textContent). (6) Le support clavier : écouter keydown et router les touches vers les mêmes actions. (7) Assembler : l'état vit dans une variable, chaque action recalcule l'état (via les fonctions pures de la leçon 1) puis rend.
Pièges : un écouteur par bouton (préférer la délégation) ; innerHTML avec des données (préférer textContent) ; oublier preventDefault pour certaines touches ; ne pas réutiliser la logique pure (tout remélanger dans le DOM).
Pour aller plus loin : thème clair/sombre du widget, animation de touche, historique des calculs.
Exercices : (1) ajouter une touche « C » qui réinitialise l'affichage ; (2) gérer la touche Entrée du clavier comme « = » ; (3) afficher un message d'erreur lisible en cas de division par zéro.`,
  },
  { num: '03', modNum: '02', modName: 'Quiz interactif', durationMin: 28, title: 'Le moteur du quiz', prereq: 'Projet 1 recommandé',
    brief: `TYPE : LOGIQUE (testable — console.log, sans DOM).
Sujet : le moteur d'un quiz, indépendant de l'affichage.
Sections : (1) Modéliser les données : const questions = [{ enonce: "...", options: ["a","b","c"], bonne: 1 }, ...] (bonne = index de la bonne réponse). (2) Une classe Quiz : class Quiz { constructor(questions) { this.questions = questions; this.index = 0; this.score = 0; } get courante() { return this.questions[this.index]; } get termine() { return this.index >= this.questions.length; } repondre(i) { const ok = i === this.courante.bonne; if (ok) this.score++; this.index++; return ok; } pourcentage() { return Math.round((this.score / this.questions.length) * 100); } }. (3) DÉMO console.log : créer un quiz, répondre à chaque question, afficher le score et le pourcentage. (4) Mélanger les questions (option) : une fonction melanger(tableau) (Fisher-Yates) — testable. (5) Encadré Astuce : « ▶ Tester » pour jouer une partie en console.
Pièges : stocker la bonne réponse comme texte (fragile) plutôt qu'un index ; index hors borne ; muter le tableau de questions d'origine ; score recalculé incorrectement.
Pour aller plus loin : minuteur par question, plusieurs bonnes réponses, niveaux de difficulté.
Exercices : (1) ajouter une méthode reset() au Quiz ; (2) écrire melanger(tableau) (Fisher-Yates) et vérifier la longueur ; (3) ajouter un getter restantes qui renvoie le nombre de questions restantes.`,
  },
  { num: '04', modNum: '02', modName: 'Quiz interactif', durationMin: 30, title: "L'affichage du quiz", prereq: 'Leçon 03 recommandée',
    brief: `TYPE : INTERFACE (DOM).
Sujet : afficher le quiz et gérer les interactions.
Sections : (1) Le HTML : un conteneur question, une liste d'options (boutons), une barre de progression, un écran de score. language-markup. (2) CSS minimal (options en colonne, état sélectionné). (3) Rendre une question : une fonction afficherQuestion(quiz) qui crée les boutons d'options (createElement) et les insère ; brancher chaque option à quiz.repondre(i). (4) Réagir à la réponse : montrer bonne/mauvaise (classList), désactiver les options, puis passer à la suivante (setTimeout court). (5) La progression : mettre à jour la barre (index / total). (6) L'écran final : quand quiz.termine, afficher le score et un bouton « Recommencer ». (7) Brancher le tout : un rendu qui choisit entre afficher la question ou l'écran final.
Pièges : recréer des écouteurs en double (régénérer proprement le DOM) ; ne pas désactiver les options après réponse ; oublier l'état final ; injecter du HTML utilisateur (textContent).
Pour aller plus loin : animations de transition, retour visuel sur la bonne réponse, enregistrer le meilleur score (localStorage).
Exercices : (1) afficher « Question X / N » ; (2) colorer en vert/rouge l'option choisie ; (3) ajouter le bouton Recommencer qui réinitialise et relance.`,
  },
  { num: '05', modNum: '03', modName: 'Gestionnaire de budget', durationMin: 28, title: 'Le modèle de budget', prereq: 'Projet 2 recommandé',
    brief: `TYPE : LOGIQUE (testable — console.log, sans DOM).
Sujet : le modèle de données d'un suivi de budget.
Sections : (1) Représenter une transaction : { id, libelle, montant } (montant positif = revenu, négatif = dépense). (2) Les opérations pures sur un tableau de transactions : ajouter(liste, t) (renvoie un nouveau tableau, immuable), supprimer(liste, id). (3) Les agrégats avec reduce : solde(liste) = somme des montants ; totalRevenus(liste) = somme des montants positifs ; totalDepenses(liste) = somme des montants négatifs (valeur absolue). DÉMO console.log avec un petit jeu de transactions. (4) Formater un montant : function euros(n) { return n.toLocaleString("fr-FR", { style: "currency", currency: "EUR" }); }. (5) Filtrer : depenses(liste), revenus(liste). (6) Encadré Astuce : « ▶ Tester » pour calculer un solde.
Pièges : muter le tableau (préférer spread/filter/map) ; additionner des chaînes au lieu de nombres ; oublier la valeur absolue pour les dépenses ; id non uniques.
Pour aller plus loin : catégories, regroupement par mois, moyenne, budget cible.
Exercices : (1) écrire totalDepenses(liste) ; (2) écrire parCategorie(liste) qui renvoie un objet { categorie: total } ; (3) écrire plusGrosseDepense(liste).`,
  },
  { num: '06', modNum: '03', modName: 'Gestionnaire de budget', durationMin: 32, title: "L'interface du budget", prereq: 'Leçon 05 recommandée',
    brief: `TYPE : INTERFACE (DOM + localStorage).
Sujet : l'interface complète du gestionnaire de budget.
Sections : (1) Le HTML : un formulaire (libellé, montant, type), un récapitulatif (solde, revenus, dépenses), la liste des transactions. language-markup. (2) CSS minimal. (3) Le formulaire : sur submit, preventDefault, lire les valeurs, créer une transaction (id via Date.now()), l'ajouter à l'état, re-rendre. (4) Rendre la liste : une fonction rendre() qui régénère la liste (chaque ligne avec un bouton supprimer) et met à jour les agrégats (réutilise solde/totaux de la leçon 5). (5) Supprimer : délégation d'événements sur la liste, lire data-id. (6) PERSISTANCE : sauver(liste) -> localStorage.setItem("budget", JSON.stringify(liste)) ; charger() -> JSON.parse(localStorage.getItem("budget")) || []. Charger au démarrage, sauver à chaque changement. (7) Couleur du solde (positif/négatif) via classList.
Pièges : Number(input.value) (les valeurs de formulaire sont des chaînes) ; oublier preventDefault ; JSON.parse(null) -> faire || [] ; recréer des écouteurs (délégation) ; injecter le libellé via innerHTML.
Pour aller plus loin : édition d'une transaction, filtres, graphique simple, export.
Exercices : (1) afficher le solde en vert/rouge selon le signe ; (2) vider le formulaire après ajout ; (3) ajouter un bouton « tout effacer » qui vide la liste et le localStorage.`,
  },
  { num: '07', modNum: '04', modName: 'Générateur de mot de passe', durationMin: 26, title: 'La génération du mot de passe', prereq: 'Projet 3 recommandé',
    brief: `TYPE : LOGIQUE (testable — console.log, sans DOM).
Sujet : générer un mot de passe robuste selon des options.
Sections : (1) Construire l'alphabet selon les options : const JEUX = { minuscules: "abcdefghijklmnopqrstuvwxyz", majuscules: "ABCDEFGHIJKLMNOPQRSTUVWXYZ", chiffres: "0123456789", symboles: "!@#$%^&amp;*-_=+" } ; assembler une chaîne pool à partir des options activées. (2) Tirer un caractère au hasard : pool[Math.floor(Math.random() * pool.length)]. (3) La fonction generer(longueur, options) : boucle qui pioche « longueur » caractères. DÉMO console.log(generer(12, { majuscules: true, chiffres: true })). (4) GARANTIR au moins un caractère de chaque jeu activé (sinon re-tirer ou imposer). (5) Mesurer la FORCE : function force(mdp) qui compte la diversité (longueur, présence de chaque type via des regex /[A-Z]/, /\\d/, /[^a-zA-Z0-9]/) et renvoie un score 0–4 + un libellé. DÉMO. (6) Encadré Astuce : « ▶ Tester » pour générer plusieurs mots de passe.
Pièges : pool vide si aucune option (gérer) ; Math.random n'est pas cryptographique (mention de crypto.getRandomValues comme amélioration) ; ne pas garantir la diversité ; biais de modulo (négligeable ici).
Pour aller plus loin : crypto.getRandomValues, exclure les caractères ambigus (O/0, l/1), phrases de passe.
Exercices : (1) ajouter le jeu « symboles » et l'inclure ; (2) écrire force(mdp) renvoyant un score ; (3) garantir au moins un chiffre quand l'option chiffres est active.`,
  },
  { num: '08', modNum: '04', modName: 'Générateur de mot de passe', durationMin: 28, title: "L'outil complet", prereq: 'Leçon 07 recommandée',
    brief: `TYPE : INTERFACE (DOM + presse-papiers).
Sujet : l'outil interactif complet.
Sections : (1) Le HTML : un champ de résultat (lecture seule), un curseur (range) pour la longueur, des cases à cocher (majuscules, chiffres, symboles), un bouton « Générer » et un bouton « Copier ». language-markup. (2) CSS minimal. (3) Lire les options du DOM : input range .value (Number), cases .checked, construire l'objet options. (4) Générer au clic (et au changement d'option) en réutilisant generer() de la leçon 7 ; afficher le résultat. (5) L'indicateur de FORCE : une barre dont la largeur/couleur dépend de force() (classList). (6) COPIER : navigator.clipboard.writeText(resultat) avec un repli (textarea + execCommand) ; retour visuel « Copié ! ». (7) Accessibilité : libellés, aria, focus.
Pièges : input.value est une chaîne (convertir la longueur) ; clipboard indisponible hors HTTPS/file (prévoir le repli) ; régénérer à chaque interaction pertinente ; ne pas oublier de cocher au moins une option.
Pour aller plus loin : régénérer en direct au déplacement du curseur, mémoriser les préférences (localStorage), bouton « voir/masquer ».
Exercices : (1) mettre à jour l'affichage de la longueur quand on bouge le curseur ; (2) régénérer automatiquement quand une option change ; (3) afficher « Copié ! » pendant 1,5 s après la copie.`,
  },
  { num: '09', modNum: '05', modName: 'Jeu du morpion', durationMin: 28, title: 'La logique du morpion', prereq: 'Projet 4 recommandé',
    brief: `TYPE : LOGIQUE (testable — console.log, sans DOM).
Sujet : la logique du morpion (tic-tac-toe), sans affichage.
Sections : (1) Représenter le plateau : un tableau de 9 cases, valeurs null, "X" ou "O" (indices 0–8 = grille 3×3). (2) Jouer un coup (immuable) : function jouer(plateau, index, joueur) { if (plateau[index]) return plateau; const copie = [...plateau]; copie[index] = joueur; return copie; }. (3) Détecter un GAGNANT : les 8 lignes gagnantes const LIGNES = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]] ; function gagnant(plateau) { for (const [a,b,c] of LIGNES) { if (plateau[a] &amp;&amp; plateau[a] === plateau[b] &amp;&amp; plateau[a] === plateau[c]) return plateau[a]; } return null; }. (4) Match nul : function estPlein(plateau) { return plateau.every((c) => c !== null); }. (5) DÉMO console.log : simuler une partie où X gagne, afficher gagnant(plateau). (6) Le joueur courant : alterner "X"/"O" selon le nombre de coups joués. (7) Encadré Astuce : « ▶ Tester » pour rejouer la partie.
Pièges : jouer sur une case occupée (vérifier) ; muter le plateau (préférer une copie) ; oublier une ligne gagnante ; comparer des null comme égaux (vérifier plateau[a] non vide).
Pour aller plus loin : une IA simple (coup gagnant/bloquant, minimax en mention), plateau N×N.
Exercices : (1) écrire estPlein(plateau) ; (2) écrire joueurCourant(plateau) à partir du nombre de coups ; (3) ajouter coupsPossibles(plateau) qui renvoie les indices libres.`,
  },
  { num: '10', modNum: '05', modName: 'Jeu du morpion', durationMin: 30, title: 'Le jeu jouable', prereq: 'Leçon 09 recommandée',
    brief: `TYPE : INTERFACE (DOM).
Sujet : rendre le morpion jouable dans la page.
Sections : (1) Le HTML : une grille de 9 cellules (boutons) + une zone de statut + un bouton « Rejouer ». language-markup. (2) CSS : grille 3×3 (CSS Grid), grandes cases. (3) L'état du jeu : let plateau = Array(9).fill(null) et le joueur courant. (4) Rendre : une fonction rendre() qui écrit X/O dans chaque cellule (textContent) et le message de statut. (5) Jouer au clic : délégation sur la grille, lire data-index, appeler jouer() (logique L9), vérifier gagnant()/estPlein(), mettre à jour le statut, alterner le joueur. (6) Fin de partie : annoncer le gagnant ou le nul, empêcher de nouveaux coups. (7) Rejouer : réinitialiser l'état et le DOM.
Pièges : continuer à jouer après la fin (verrouiller) ; réécouteurs en double ; index récupéré en string (parseInt) ; ne pas refléter l'état dans le DOM.
Pour aller plus loin : surligner la ligne gagnante, score des manches, mode 2 joueurs vs IA.
Exercices : (1) afficher « Au tour de X » dans le statut ; (2) désactiver la grille à la fin ; (3) compter et afficher le nombre de parties gagnées par chaque joueur.`,
  },
  { num: '11', modNum: '06', modName: 'Minuteur Pomodoro', durationMin: 28, title: 'La logique du minuteur', prereq: 'Projet 5 recommandé',
    brief: `TYPE : LOGIQUE (testable — console.log, sans DOM ni vrai temps).
Sujet : la logique d'un minuteur Pomodoro (cycles travail/pause), modélisée par une machine à états.
Sections : (1) Le concept Pomodoro : des sessions de travail (ex. 25 min) séparées de pauses (5 min). (2) Modéliser l'état : const ETAT_INIT = { phase: "travail", restant: 25 * 60, cycles: 0 } (restant en secondes). Les durées : const DUREES = { travail: 25 * 60, pause: 5 * 60 }. (3) La fonction PURE tic(etat) : renvoie le nouvel état après une seconde — si restant &gt; 0, décrémente ; sinon, on change de phase (travail -> pause, pause -> travail) et on remet restant à la durée de la nouvelle phase (et on incrémente cycles quand une session de travail se termine). DÉMO : appliquer tic plusieurs fois en partant d'un restant de 2 s pour voir la bascule, console.log. (4) Formater : function formater(secondes) { const m = Math.floor(secondes / 60); const s = secondes % 60; return String(m).padStart(2, "0") + ":" + String(s).padStart(2, "0"); } DÉMO formater(90) //=> "01:30". (5) Démarrer/mettre en pause/réinitialiser : ce sont des transformations d'état (un booléen enMarche, reset renvoie ETAT_INIT). (6) Encadré Astuce : « ▶ Tester » pour dérouler quelques tics.
Pièges : muter l'état (préférer renvoyer un nouvel objet) ; mauvaise bascule de phase ; oublier de remettre restant au changement de phase ; formatage sans padStart (« 1:5 »).
Pour aller plus loin : pause longue toutes les 4 sessions, durées configurables, sons.
Exercices : (1) écrire formater(secondes) ; (2) écrire tic pour qu'il bascule travail->pause à 0 ; (3) ajouter une pause longue (15 min) tous les 4 cycles.`,
  },
  { num: '12', modNum: '06', modName: 'Minuteur Pomodoro', durationMin: 30, title: 'Le Pomodoro complet', prereq: 'Leçon 11 recommandée',
    brief: `TYPE : INTERFACE (DOM + setInterval).
Sujet : le minuteur Pomodoro complet et utilisable.
Sections : (1) Le HTML : l'affichage du temps (grand), la phase en cours, des boutons Démarrer/Pause et Réinitialiser, un compteur de cycles. language-markup. (2) CSS minimal (gros chiffres, couleur selon la phase). (3) L'état vit dans une variable (logique L11) ; rendre(etat) écrit le temps formaté et la phase. (4) Le TEMPS RÉEL : démarrer un setInterval(() => { etat = tic(etat); rendre(etat); }, 1000) ; mettre en pause = clearInterval ; ne pas lancer deux intervalles (garder l'id, vérifier). (5) Réinitialiser : clearInterval + état initial + rendu. (6) Retour à la phase : changer la couleur de fond/texte selon travail/pause. (7) Bonus : notifier la fin d'une phase (un simple changement visible, ou Notification si autorisé — en option).
Pièges : lancer plusieurs setInterval (chevauchement) ; oublier clearInterval (fuite) ; recalculer le temps à la main au lieu d'utiliser tic() ; setInterval n'est pas parfaitement précis (acceptable ici).
Pour aller plus loin : précision via timestamps (Date.now) plutôt que comptage de tics, titre de l'onglet qui affiche le temps, persistance de la session.
Exercices : (1) empêcher le double-démarrage ; (2) changer la couleur selon la phase ; (3) afficher le nombre de pomodoros terminés.`,
  },
];

log('Rédaction de ' + SPECS.length + ' leçons (Projets JavaScript)…');

const results = await pipeline(
  SPECS,
  (s) =>
    agent(
      INSTRUCTIONS +
        '\n\n=== LEÇON À RÉDIGER ===\nNuméro : ' + s.num + ' | Projet ' + s.modNum + ' (' + s.modName + ')\nTitre : ' + s.title +
        '\n\nBRIEF DÉTAILLÉ (suis le TYPE indiqué ; intègre fidèlement le code ; développe la prose étape par étape) :\n' + s.brief,
      { label: 'écrit L' + s.num, phase: 'Rédaction', schema: SCHEMA }
    ),
  (parts, s) =>
    agent(
      INSTRUCTIONS +
        '\n\n=== RELECTURE CRITIQUE (corrige et renvoie la version finale, même schéma) ===\nLeçon ' + s.num + ' « ' + s.title + ' ».\n' +
        '1. EXACTITUDE du code : il doit être correct et réaliste pour ce projet.\n' +
        '2. TYPE respecté : si LOGIQUE, le code des exemples principaux est SELF-CONTAINED, sans document/window/localStorage, et se termine par des console.log démonstratifs (exécutables via « ▶ Tester »). Si INTERFACE, le DOM est correctement utilisé.\n' +
        '3. ÉCHAPPEMENT du code : « & » → « &amp; » (donc « &amp;&amp; »), « < » → « &lt; ». Corrige tout oubli (comparaisons, balises HTML).\n' +
        '4. STRUCTURE : intro, 5–7 sections <h2> qui construisent le projet, Pièges fréquents, Pour aller plus loin, Récap et vérification (lesson-check), Exercices (3 gradués avec solutions).\n' +
        '5. HTML valide, classes autorisées uniquement, AUCUN style/script inline dans la page.\n\n' +
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
