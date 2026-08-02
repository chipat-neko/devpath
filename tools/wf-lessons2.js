export const meta = {
  name: 'syntaxe-lessons-13-31',
  description: 'Rédige les leçons JavaScript 13 à 31 (modules avancés) et assemble le HTML final',
  phases: [{ title: 'Rédaction' }, { title: 'Relecture' }],
};

/* Gabarit FIXE d'une leçon JS (pages/js/lecon-NN.html — 2 niveaux de profondeur) */
function buildLesson(p) {
  const objectives = p.objectives.map((o) => '                  <li>' + o + '</li>').join('\n');
  return `<!DOCTYPE html>
<html lang="fr" data-theme="light">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${p.title} — Leçon ${p.num} · Syntaxe</title>
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

  <body data-course="javascript" data-lesson="lecon-${p.num}.html">
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
            <li><a href="../js/cours.html">JavaScript</a></li>
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
          <span><a href="../js/cours.html">← Retour au programme du cours</a></span>
        </div>
      </div>
    </footer>

    <script src="../../js/data.js" defer></script>
    <script src="../../js/main.js" defer></script>
    <script src="../../js/lecon.js" defer></script>
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

const INSTRUCTIONS = `Tu rédiges une leçon AVANCÉE du cours « JavaScript : des bases au niveau confirmé » (site Syntaxe).
Français, tutoiement, ton clair et pédagogique, du connu vers l'inconnu, un concept nouveau à la fois.

CONTEXTE — l'apprenant a DÉJÀ suivi les leçons 1 à 12. Il maîtrise : variables (let/const), types,
opérateurs, conditions, boucles, fonctions (déclaration, fléchées, paramètres), tableaux et leurs
méthodes (map/filter/reduce/forEach/find/sort), objets (littéraux, destructuration, spread, JSON),
le DOM (querySelector, createElement, classList), les événements (addEventListener, délégation,
preventDefault) et les bases de l'asynchrone (setTimeout, Promesses .then/.catch, async/await,
localStorage). NE RÉEXPLIQUE PAS ces bases : appuie-toi dessus, va plus loin, en profondeur.

PROJET FIL ROUGE — un gestionnaire de tâches. État actuel (fin L12) : un tableau « taches »
d'objets { id, texte, faite }, rendu dans le DOM, événements délégués, persistance via localStorage.
Chaque leçon le FAIT ÉVOLUER selon l'« épisode » indiqué dans le brief (la section « Projet fil rouge ».

TU PRODUIS UNIQUEMENT { metaDesc, objectives, body } :
- metaDesc : ~150 caractères.
- objectives : 3 à 4 chaînes (« savoir faire X »), HTML inline autorisé (<code>, <strong>). «&nbsp;;» puis «.» pour la dernière.
- body : HTML INTÉRIEUR de <article class="prose"> (sans la balise article, sans bouton « terminer », sans nav précédent/suivant — ajoutés automatiquement).

STRUCTURE du body (≈1300–1900 mots) :
1. 1–2 <p> d'intro (rappel du point d'appui + objectif).
2. 5 à 8 sections, chacune un <h2> court (ils alimentent le sommaire), avec exemples de code commentés pas à pas et au moins un ou deux encadrés.
3. <h2>Pièges fréquents</h2>.
4. <h2>Pour aller plus loin</h2>.
5. <h2>Projet fil rouge — épisode N</h2> (fait avancer le gestionnaire de tâches, voir le brief).
6. <h2>Récap et vérification</h2> : court résumé en <ul> + bloc lesson-check (3 questions).
7. <h2>Exercices</h2> : exactement 3 exercices gradués (Échauffement, Application, Défi) avec solution repliable.

COMPOSANTS HTML EXACTS (n'invente pas d'autres classes) :
- Code : <figure class="code-block" data-file="exemple.js"><pre><code class="language-javascript">CODE</code></pre></figure> (pour du HTML : data-file="index.html" + class="language-markup").
- Légende : <p class="code-caption">…</p>
- Note : <div class="callout callout--note">${ICON_NOTE}<div class="callout__body"><p class="callout__title">Note</p><p>…</p></div></div>
- Piège : <div class="callout callout--warn">${ICON_WARN}<div class="callout__body"><p class="callout__title">Piège fréquent</p><p>…</p></div></div>
- Astuce : <div class="callout callout--tip">${ICON_TIP}<div class="callout__body"><p class="callout__title">Astuce</p><p>…</p></div></div>
- Pour aller plus loin : <div class="callout callout--more">${ICON_MORE}<div class="callout__body"><p class="callout__title">Pour aller plus loin</p><p>…</p></div></div>
- Vérification : <div class="lesson-check"><p class="kicker kicker--gold">Vérifie ta compréhension</p><ol><li>…</li><li>…</li><li>…</li></ol></div>
- Exercice : <div class="exercise"><div class="exercise__head"><span class="exercise__num">Exercice 1</span><span class="exercise__level">Échauffement</span></div><p>…</p><details><summary>Voir une solution</summary><figure class="code-block" data-file="solution.js"><pre><code class="language-javascript">…</code></pre></figure></details></div>

ÉCHAPPEMENT DANS LE CODE (critique) — dans <code> : « & » → « &amp; » (donc « &amp;&amp; »), « < » → « &lt; » (ex. « i &lt; n », « &lt;script&gt; », générateur « function*() » n'a pas de < ). « > » peut rester (flèche « => » telle quelle).

RÈGLES : aucun style inline, aucun style=, aucune balise <style>, aucun <script> ni onclick. Code JS MODERNE et CORRECT, vérifié mentalement. HTML valide et équilibré. Cohérence du fil rouge (objets { id, texte, faite } puis classes selon l'avancement du brief).`;

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
  { num: '13', modNum: '05', modName: 'Données du langage', levelClass: 'intermediaire', levelLabel: 'Intermédiaire', durationMin: 30, title: 'Les chaînes de caractères en profondeur', prereq: 'Module 4 terminé recommandé',
    brief: `Objectif : manipuler le texte avec les méthodes de chaînes. Épisode 13 : normaliser le texte d'une tâche.
Sections : (1) Rappel : une chaîne est une suite de caractères, indexée à partir de 0 ; length ; accès texte[0] ; les chaînes sont IMMUABLES (une méthode renvoie une NOUVELLE chaîne). (2) Extraire : slice(début, fin) (indices négatifs), substring ; texte.slice(0, 3). (3) Chercher : includes, startsWith, endsWith, indexOf, lastIndexOf. (4) Transformer : toUpperCase, toLowerCase, trim/trimStart/trimEnd, replace (1re occurrence) et replaceAll, repeat. (5) Découper/joindre : split(separateur) -> tableau, et l'inverse tableau.join(separateur). Ex : "a,b,c".split(",") //=> ["a","b","c"]. (6) Compléter : padStart / padEnd (ex. "5".padStart(2,"0") //=> "05"). (7) Gabarits avancés : multi-lignes, expressions, et échappement.
Pièges : croire qu'une méthode modifie la chaîne (elle renvoie une copie) ; indexOf renvoie -1 si absent ; oublier que split sur "" donne les caractères ; casse dans une comparaison.
Pour aller plus loin : Unicode et caractères accentués (length compte les unités de code), localeCompare pour trier du texte, normalize.
Fil rouge épisode 13 : function nettoyerTexte(saisie) { const t = saisie.trim(); return t.charAt(0).toUpperCase() + t.slice(1); } et refuser une saisie vide (if (!t) ...). On nettoie le texte avant d'ajouter la tâche.
Exercices : (1) mettre une phrase en MAJUSCULES et compter ses caractères ; (2) extraire le nom de domaine d'un email avec split ; (3) écrire une fonction capitaliser(mot) qui met la 1re lettre en majuscule et le reste en minuscule.`,
  },
  { num: '14', modNum: '05', modName: 'Données du langage', levelClass: 'intermediaire', levelLabel: 'Intermédiaire', durationMin: 28, title: "Les nombres et l'objet Math", prereq: 'Leçon 13 recommandée',
    brief: `Objectif : calculer avec précision et utiliser Math. Épisode 14 : priorité et pourcentage de complétion.
Sections : (1) Un seul type number (entiers et décimaux) ; limites (Number.MAX_SAFE_INTEGER, mention BigInt). (2) Précision des flottants : 0.1 + 0.2 //=> 0.30000000000000004 ; corriger avec toFixed (renvoie une CHAÎNE) : (0.1+0.2).toFixed(2) //=> "0.30". (3) Convertir : Number("42"), parseInt("42px",10), parseFloat ; échec -> NaN ; tester avec Number.isNaN (et pourquoi pas isNaN global). (4) Arrondis : Math.round, Math.floor, Math.ceil, Math.trunc. (5) Utilitaires : Math.abs, Math.min/max, Math.pow (ou **), Math.sqrt. (6) Aléatoire : Math.random() (0..1), formule d'un entier entre min et max : Math.floor(Math.random() * (max - min + 1)) + min.
Pièges : toFixed renvoie une chaîne (reconvertir avec Number) ; parseInt sans la base ; comparer avec NaN (NaN === NaN //=> false) ; arrondi de nombres négatifs (floor vs trunc).
Pour aller plus loin : Number.isInteger, séparateurs numériques 1_000_000, notation exponentielle, Intl.NumberFormat pour afficher des montants.
Fil rouge épisode 14 : ajouter une priorité numérique (1 à 3) à une tâche, et calculer le pourcentage de tâches faites : function pourcentageFait(taches) { if (taches.length === 0) return 0; const faites = taches.filter((t) => t.faite).length; return Math.round((faites / taches.length) * 100); }.
Exercices : (1) afficher 0.1 + 0.2 arrondi à 2 décimales (en nombre) ; (2) tirer un entier aléatoire entre 1 et 6 (dé) ; (3) écrire moyenne(tableau) qui renvoie la moyenne arrondie à 1 décimale.`,
  },
  { num: '15', modNum: '05', modName: 'Données du langage', levelClass: 'intermediaire', levelLabel: 'Intermédiaire', durationMin: 28, title: 'Les dates', prereq: 'Leçon 14 recommandée',
    brief: `Objectif : créer, lire et formater des dates. Épisode 15 : horodater les tâches.
Sections : (1) Créer : new Date() (maintenant), new Date(2026, 0, 31) (ATTENTION : mois de 0 à 11 -> 0 = janvier), new Date("2026-01-31"). (2) Lire : getFullYear, getMonth (0-11), getDate (jour du mois), getDay (0=dimanche), getHours/getMinutes. (3) Horodatage : Date.now() //=> millisecondes depuis 1970 ; un Date en millisecondes via .getTime(). (4) Formater pour l'humain : toLocaleDateString("fr-FR"), toLocaleString("fr-FR", { dateStyle:"long" }) ; toISOString pour stocker. (5) Calculer une différence : soustraire deux timestamps donne des millisecondes ; convertir en jours (/ 1000 / 60 / 60 / 24). Fonction « il y a N jours ».
Pièges : les mois commencent à 0 ; getDay (jour de semaine) vs getDate (jour du mois) ; les dates sont mutables (setX) ; fuseaux horaires ; parser une chaîne non ISO est peu fiable.
Pour aller plus loin : Intl.DateTimeFormat, le caractère mutable de Date, l'API moderne Temporal (mention), bibliothèques (date-fns).
Fil rouge épisode 15 : à la création, stocker creeLe: Date.now() dans la tâche ; afficher « Créée le … » via new Date(t.creeLe).toLocaleDateString("fr-FR") ; bonus : fonction ilYaCombienDeJours(timestamp).
Exercices : (1) afficher la date du jour au format français ; (2) créer la date du 14 juillet 2026 et afficher son jour de la semaine ; (3) écrire ageEnJours(timestamp) qui renvoie le nombre de jours écoulés depuis ce timestamp.`,
  },
  { num: '16', modNum: '06', modName: 'Fonctions avancées', levelClass: 'intermediaire', levelLabel: 'Intermédiaire', durationMin: 34, title: 'Portée, hoisting et fermetures (closures)', prereq: 'Module 5 recommandé',
    brief: `Objectif : comprendre la portée et exploiter les fermetures. Épisode 16 : un générateur d'identifiants par closure.
Sections : (1) Les portées : globale, de fonction, de bloc { } (let/const sont de bloc, var de fonction). Une variable interne n'existe pas dehors. (2) Le hoisting : les déclarations function sont remontées (appelables avant) ; let/const sont en « zone morte temporelle » (erreur si utilisées avant déclaration) ; var est hoistée à undefined. (3) Qu'est-ce qu'une FERMETURE : une fonction « se souvient » des variables de l'endroit où elle a été créée, même après. Exemple compteur : function creerCompteur() { let n = 0; return function () { n++; return n; }; } const c = creerCompteur(); c(); //=> 1 ; c(); //=> 2. (4) Pourquoi c'est utile : données privées (encapsulation), fabriques de fonctions, mémorisation. (5) Fabrique paramétrée : function multiplicateur(facteur) { return (x) => x * facteur; } const double = multiplicateur(2);.
Pièges : la fermeture capture la VARIABLE, pas sa valeur à l'instant t ; le piège classique de var dans une boucle (utiliser let) ; fuite de mémoire si on garde des références.
Pour aller plus loin : le module pattern (IIFE qui renvoie un objet), la mémorisation (cache) avec une closure.
Fil rouge épisode 16 : remplacer les id basés sur Date.now() par un compteur encapsulé : const prochainId = (function () { let n = 0; return () => ++n; })(); puis id: prochainId() à la création. C'est plus fiable que Date.now() pour deux ajouts simultanés.
Exercices : (1) écrire creerCompteur() et l'utiliser pour afficher 1,2,3 ; (2) écrire une fonction salutateur(nom) qui renvoie une fonction affichant « Bonjour <nom> » ; (3) corriger un code qui, à cause de var dans une boucle, affiche 3,3,3 au lieu de 0,1,2 (passer à let, expliquer).`,
  },
  { num: '17', modNum: '06', modName: 'Fonctions avancées', levelClass: 'intermediaire', levelLabel: 'Intermédiaire', durationMin: 32, title: 'this, call, apply et bind', prereq: 'Leçon 16 recommandée',
    brief: `Objectif : maîtriser this selon le contexte. Épisode 17 : regrouper la logique dans un objet « gestionnaire » sans perdre this.
Sections : (1) this dépend de COMMENT la fonction est appelée, pas où elle est définie. (2) Méthode d'objet : obj.methode() -> this = obj. Exemple compteur = { n:0, incr(){ this.n++; } }. (3) Fonction simple appelée seule -> this vaut undefined (mode strict) ou l'objet global. (4) La perte de this : passer une méthode en callback (setTimeout(obj.incr, 1000)) « détache » this -> bug. (5) Fonctions fléchées : pas de this propre, elles héritent du this englobant (this LEXICAL) -> idéales comme callbacks à l'intérieur d'une méthode. (6) Forcer this : call(thisArg, ...args) appelle tout de suite ; apply(thisArg, [args]) idem avec un tableau ; bind(thisArg) renvoie une NOUVELLE fonction liée. Exemple const incrLie = compteur.incr.bind(compteur);.
Pièges : perdre this dans un callback (corriger par fléchée ou bind) ; croire qu'une fléchée a son propre this ; utiliser this dans une fonction qui n'est pas une méthode.
Pour aller plus loin : this dans les gestionnaires d'événements (l'élément), new et this, le mode strict.
Fil rouge épisode 17 : regrouper l'état et les actions dans un objet : const gestionnaire = { taches: [], ajouter(texte) { this.taches.push({ id: prochainId(), texte, faite: false }); } } ; montrer qu'en passant gestionnaire.ajouter comme callback on perd this, et corriger avec une fléchée (bouton.addEventListener("click", () => gestionnaire.ajouter(valeur))).
Exercices : (1) prédire la valeur de this dans 3 appels (méthode, fonction seule, fléchée) ; (2) corriger un setTimeout qui perd this (bind ou fléchée) ; (3) utiliser call pour « emprunter » une méthode d'un objet à un autre.`,
  },
  { num: '18', modNum: '06', modName: 'Fonctions avancées', levelClass: 'intermediaire', levelLabel: 'Intermédiaire', durationMin: 32, title: "Fonctions d'ordre supérieur & récursion", prereq: 'Leçon 17 recommandée',
    brief: `Objectif : traiter les fonctions comme des valeurs et résoudre par récursion. Épisode 18 : tri/filtre paramétrables + sous-tâches récursives.
Sections : (1) Les fonctions sont des valeurs : on peut les stocker, les passer en argument, les renvoyer. (2) Fonction d'ordre supérieur (HOF) : qui prend et/ou renvoie une fonction. Rappel map/filter en sont. Écrire sa propre HOF : function appliquer(valeur, ...fns) { return fns.reduce((v, f) => f(v), valeur); } (composition). (3) Callbacks : passer un comportement (ex. function repeter(n, action) { for (let i = 0; i &lt; n; i++) action(i); }). (4) Renvoyer des fonctions (rappel closures) : un comparateur paramétré parClef(clef) => (a,b) => a[clef] - b[clef]. (5) La récursion : une fonction qui s'appelle elle-même ; il FAUT un cas de base. Exemple factorielle : function fact(n) { return n &lt;= 1 ? 1 : n * fact(n - 1); }. (6) Récursion sur une structure : parcourir un arbre (objet avec enfants) pour tout compter.
Pièges : oublier le cas de base -> débordement de pile (RangeError) ; récursion là où une boucle suffit ; callbacks qui ne renvoient rien.
Pour aller plus loin : récursivité terminale, la pile d'appels, quand préférer l'itération, le currying.
Fil rouge épisode 18 : rendre le tri configurable : function trierTaches(taches, comparateur) { return [...taches].sort(comparateur); } avec parPriorite = (a,b) => a.priorite - b.priorite ; et compter récursivement les sous-tâches d'une tâche qui contient un tableau « sousTaches » : function compterTout(tache) { return 1 + (tache.sousTaches || []).reduce((s, st) => s + compterTout(st), 0); }.
Exercices : (1) écrire appliquerDeux(x, f, g) qui renvoie g(f(x)) ; (2) écrire somme(n) récursive qui additionne de 1 à n ; (3) écrire une fonction qui, donnée une liste de personnes [{nom, age}], renvoie une fonction de tri par la clé passée en argument.`,
  },
  { num: '19', modNum: '07', modName: 'Programmation orientée objet', levelClass: 'avance', levelLabel: 'Avancé', durationMin: 32, title: 'Objets avancés et prototypes', prereq: 'Module 6 recommandé',
    brief: `Objectif : comprendre comment JS partage des comportements via les prototypes. Épisode 19 : un prototype partagé pour les tâches.
Sections : (1) Rappel objets + this. Le problème : créer 100 tâches avec chacune sa copie de la méthode basculer() gaspille la mémoire. (2) La chaîne de prototypes : chaque objet a un objet « parent » caché (son prototype) ; quand on lit une propriété absente, JS remonte la chaîne. Object.getPrototypeOf(obj). (3) Object.create(proto) crée un objet dont le prototype est proto -> les méthodes vivent UNE fois sur le prototype. Exemple tachesProto = { basculer() { this.faite = !this.faite; } } ; const t = Object.create(tachesProto); t.faite = false;. (4) Fonctions constructeur (avant les classes) : function Tache(texte){ this.texte = texte; } Tache.prototype.basculer = function(){...} ; const t = new Tache("Lire"). Ce que fait new. (5) getters/setters : get/set dans un littéral. (6) Object.assign(cible, source) pour fusionner/copier.
Pièges : modifier Object.prototype (à ne jamais faire) ; confondre __proto__ (l'instance) et prototype (la fonction) ; oublier new (this global).
Pour aller plus loin : hasOwnProperty (propre vs hérité), Object.freeze, l'égalité de référence ; les classes (leçon suivante) ne sont qu'une syntaxe par-dessus tout ça.
Fil rouge épisode 19 : factoriser les méthodes des tâches sur un prototype partagé : const protoTache = { basculer() { this.faite = !this.faite; }, libelle() { return (this.faite ? "[x] " : "[ ] ") + this.texte; } } ; function creerTache(texte) { const t = Object.create(protoTache); t.id = prochainId(); t.texte = texte; t.faite = false; return t; }. (Préparer la transition vers class à la leçon suivante.)
Exercices : (1) créer un objet avec Object.create et un prototype contenant une méthode ; (2) ajouter une méthode au prototype d'une fonction constructeur ; (3) écrire un getter « nomComplet » sur un objet { prenom, nom }.`,
  },
  { num: '20', modNum: '07', modName: 'Programmation orientée objet', levelClass: 'avance', levelLabel: 'Avancé', durationMin: 34, title: 'Les classes', prereq: 'Leçon 19 recommandée',
    brief: `Objectif : structurer le code avec les classes ES6. Épisode 20 : la classe Tache.
Sections : (1) class = syntaxe moderne par-dessus les prototypes. class Tache { } ; instancier avec new Tache(). (2) Le constructeur : constructor(texte) { this.texte = texte; this.faite = false; } reçoit les arguments de new. (3) Méthodes : basculer() { this.faite = !this.faite; } (vivent sur le prototype, partagées). (4) Champs de classe : déclarer faite = false; directement. (5) Champs PRIVÉS avec # : #secret ; accessibles seulement dans la classe (vraie encapsulation). get/set. (6) Méthodes et champs STATIQUES : static creer(...) { } appartiennent à la CLASSE, pas à l'instance (ex. fabrique, compteur d'instances). (7) instanceof pour tester le type.
Pièges : oublier new ; oublier this. devant les propriétés ; accéder à un champ # hors de la classe (erreur) ; croire qu'une méthode statique est dispo sur l'instance.
Pour aller plus loin : les classes ne sont PAS « hoistées » comme les fonctions ; getters/setters ; champs privés et méthodes #privees() ; la relation avec le prototype (Tache.prototype).
Fil rouge épisode 20 : refactor des tâches en classe : class Tache { #id; constructor(texte) { this.#id = prochainId(); this.texte = texte; this.faite = false; this.creeLe = Date.now(); } get id() { return this.#id; } basculer() { this.faite = !this.faite; } libelle() { return (this.faite ? "[x] " : "[ ] ") + this.texte; } } ; const taches = [new Tache("Lire"), new Tache("Coder")].
Exercices : (1) écrire une classe Compteur avec incr() et un champ valeur ; (2) ajouter un champ privé #pin à une classe et un getter masquant ; (3) ajouter une méthode statique Tache.depuisTexte(texte) qui renvoie une instance.`,
  },
  { num: '21', modNum: '07', modName: 'Programmation orientée objet', levelClass: 'avance', levelLabel: 'Avancé', durationMin: 32, title: 'Héritage et encapsulation', prereq: 'Leçon 20 recommandée',
    brief: `Objectif : réutiliser et encapsuler avec extends/super. Épisode 21 : une classe ListeDeTaches qui encapsule le tableau.
Sections : (1) extends : une classe enfant hérite d'une parente. class TachePrioritaire extends Tache { }. (2) super : super(...) appelle le constructeur parent (obligatoire avant d'utiliser this) ; super.methode() appelle la méthode parente. Exemple constructor(texte, priorite) { super(texte); this.priorite = priorite; }. (3) Redéfinir (override) une méthode : redéfinir libelle() et réutiliser super.libelle(). (4) Encapsulation : cacher l'état derrière une API. class ListeDeTaches { #taches = []; ajouter(texte) { this.#taches.push(new Tache(texte)); } get toutes() { return [...this.#taches]; } get restantes() { return this.#taches.filter((t) => !t.faite); } }. On ne touche plus le tableau directement : on passe par des méthodes. (5) Composition vs héritage : préférer souvent « a-un » (la liste CONTIENT des tâches) à « est-un ».
Pièges : oublier super() dans le constructeur enfant (ReferenceError) ; héritage trop profond ; exposer l'état interne (renvoyer une copie, pas la référence).
Pour aller plus loin : classes abstraites « par convention », polymorphisme, la composition comme alternative, Symbol pour des clés privées (avant #).
Fil rouge épisode 21 : introduire class ListeDeTaches { #taches = []; ajouter(texte) {...}, basculer(id) {...}, supprimer(id) {...}, get toutes() { return [...this.#taches]; } } et class TachePrioritaire extends Tache { constructor(texte, priorite) { super(texte); this.priorite = priorite; } libelle() { return super.libelle() + " (P" + this.priorite + ")"; } }. L'application manipule désormais une instance de ListeDeTaches.
Exercices : (1) créer Animal avec parler() et Chien extends Animal qui redéfinit parler() ; (2) appeler une méthode parente avec super depuis l'enfant ; (3) écrire une classe Pile (#items, empiler, depiler, get taille) entièrement encapsulée.`,
  },
  { num: '22', modNum: '08', modName: 'Asynchrone & réseau', levelClass: 'avance', levelLabel: 'Avancé', durationMin: 30, title: "La boucle d'événements en profondeur", prereq: 'Module 7 recommandé',
    brief: `Objectif : comprendre l'ordre d'exécution du code asynchrone. Épisode 22 : prévoir l'ordre des logs lors d'une sauvegarde.
Sections : (1) JS est mono-thread : une seule chose à la fois, sur une PILE d'appels. Un calcul long BLOQUE tout (l'UI gèle). (2) Les API du navigateur (setTimeout, fetch, événements) travaillent en dehors et déposent un callback dans une FILE quand c'est prêt. (3) La boucle d'événements : quand la pile est vide, elle prend la prochaine tâche de la file. (4) Microtâches vs macrotâches : les promesses (.then, await) vont dans la file des MICROtâches, traitée AVANT les macrotâches (setTimeout). D'où l'ordre surprenant : console.log("1"); setTimeout(() => console.log("2"), 0); Promise.resolve().then(() => console.log("3")); console.log("4"); //=> 1, 4, 3, 2. (5) Pourquoi setTimeout(fn, 0) n'est pas immédiat. (6) Ne pas bloquer : découper un gros travail.
Pièges : croire que setTimeout(fn, 0) s'exécute tout de suite ; attendre un résultat async de façon synchrone ; bloquer la boucle avec une boucle lourde.
Pour aller plus loin : requestAnimationFrame, les Web Workers (vrai parallélisme), la famine de la file.
Fil rouge épisode 22 : illustrer avec la sauvegarde : montrer que console.log("avant"); Promise.resolve().then(() => console.log("sauvegardé")); console.log("après"); affiche avant, après, sauvegardé — et expliquer pourquoi, pour comprendre quand l'état est réellement persisté.
Exercices : (1) prédire l'ordre de 4 logs mêlant setTimeout et Promise ; (2) expliquer pourquoi une boucle de 1 milliard d'itérations « gèle » la page ; (3) réordonner un extrait pour obtenir un ordre voulu en utilisant une microtâche.`,
  },
  { num: '23', modNum: '08', modName: 'Asynchrone & réseau', levelClass: 'avance', levelLabel: 'Avancé', durationMin: 32, title: 'Les promesses avancées', prereq: 'Leçon 22 recommandée',
    brief: `Objectif : créer et composer des promesses. Épisode 23 : charger plusieurs ressources en parallèle.
Sections : (1) Rappel : une promesse représente un résultat futur (pending -> fulfilled/rejected). (2) CRÉER une promesse : new Promise((resolve, reject) => { ... }). Exemple attendre : function attendre(ms) { return new Promise((resolve) => setTimeout(resolve, ms)); } puis await attendre(1000). (3) Chaînage : chaque .then renvoie une nouvelle promesse ; renvoyer une valeur ou une autre promesse. (4) Erreurs : un .catch attrape toute la chaîne ; en async/await on utilise try/catch ; finally pour le nettoyage. (5) Combiner : Promise.all([p1, p2]) attend TOUTES (rejette si une échoue) ; Promise.allSettled (tous les résultats, succès ou échec) ; Promise.race (la première). Exemple const [a, b] = await Promise.all([charger("a"), charger("b")]);. (6) Convertir un callback en promesse (promisification).
Pièges : oublier de renvoyer la promesse dans un .then (chaîne cassée) ; oublier await (on manipule la promesse, pas la valeur) ; Promise.all qui échoue si UNE rejette (préférer allSettled si tolérant) ; erreurs avalées sans catch.
Pour aller plus loin : exécuter en série vs en parallèle, l'anti-pattern await-dans-une-boucle, Promise.any.
Fil rouge épisode 23 : charger en parallèle l'état des tâches et les préférences utilisateur : async function initialiser() { const [taches, prefs] = await Promise.all([chargerTaches(), chargerPrefs()]); ... } (les fonctions renvoyant des promesses simulées avec attendre()).
Exercices : (1) écrire attendre(ms) et l'utiliser pour logguer après 1 s ; (2) charger 3 promesses en parallèle avec Promise.all et afficher le tableau de résultats ; (3) gérer le cas où une des promesses échoue avec allSettled.`,
  },
  { num: '24', modNum: '08', modName: 'Asynchrone & réseau', levelClass: 'avance', levelLabel: 'Avancé', durationMin: 34, title: 'fetch et les API REST', prereq: 'Leçon 23 recommandée',
    brief: `Objectif : communiquer avec un serveur. Épisode 24 : synchroniser les tâches avec une API.
Sections : (1) Une API REST : des URL (ressources) qu'on interroge avec des méthodes HTTP (GET lire, POST créer, PUT/PATCH modifier, DELETE supprimer) ; réponses au format JSON ; codes de statut (200 OK, 201 créé, 404 absent, 500 erreur serveur). (2) GET avec fetch : const reponse = await fetch(url); const data = await reponse.json();. fetch renvoie une promesse. (3) Vérifier le succès : fetch NE rejette PAS sur 404/500 -> tester reponse.ok et lever une erreur sinon : if (!reponse.ok) throw new Error("HTTP " + reponse.status);. (4) try/catch pour les erreurs réseau (pas de connexion). (5) POST : fetch(url, { method:"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify(donnees) }). (6) Schéma complet d'une fonction async chargerTaches() avec try/catch et reponse.ok. Préciser : un vrai serveur (ou une API publique de test) est nécessaire ; hors connexion, on retombe sur localStorage.
Pièges : oublier que fetch ne rejette pas sur erreur HTTP (vérifier ok) ; oublier await reponse.json() ; oublier les headers/JSON.stringify en POST ; CORS ; bloquer l'UI au lieu d'afficher un état de chargement.
Pour aller plus loin : AbortController (annuler), pagination, authentification par jeton, mise en cache.
Fil rouge épisode 24 : async function chargerTachesDistantes() { try { const r = await fetch("https://exemple.api/taches"); if (!r.ok) throw new Error("HTTP " + r.status); return await r.json(); } catch (e) { console.warn("Hors ligne, on garde le local", e); return chargerLocal(); } } et envoyer une nouvelle tâche en POST. (URL d'exemple, le repli local garde l'app fonctionnelle.)
Exercices : (1) écrire une fonction async qui fait un GET et affiche le résultat JSON, avec try/catch ; (2) ajouter la vérification reponse.ok ; (3) écrire la fonction d'un POST qui envoie un objet en JSON.`,
  },
  { num: '25', modNum: '09', modName: 'Robustesse & outillage', levelClass: 'avance', levelLabel: 'Avancé', durationMin: 30, title: 'La gestion des erreurs', prereq: 'Module 8 recommandé',
    brief: `Objectif : anticiper et traiter les erreurs proprement. Épisode 25 : valider l'ajout d'une tâche.
Sections : (1) Deux familles d'erreurs : de programmation (bugs) et attendues (saisie invalide, réseau). (2) try / catch / finally : le code risqué dans try, la réaction dans catch (reçoit l'erreur), le nettoyage dans finally (toujours exécuté). (3) L'objet Error : message, name, stack. Types intégrés : TypeError, RangeError, SyntaxError. (4) Lever une erreur : throw new Error("message clair"). On arrête la fonction et on remonte jusqu'au premier catch. (5) Créer ses propres erreurs : class ErreurValidation extends Error { constructor(message) { super(message); this.name = "ErreurValidation"; } }. (6) Async : un await qui rejette se rattrape avec try/catch ; sinon « unhandled rejection ». (7) Bonnes pratiques : messages utiles, ne pas avaler les erreurs en silence, échouer tôt.
Pièges : catch vide qui masque le problème ; attraper trop large ; oublier que throw interrompt le flux ; comparer le message plutôt que le type ; erreurs async non rattrapées.
Pour aller plus loin : la pile (stack), remonter/relancer (throw dans catch), error boundaries (frameworks), journalisation.
Fil rouge épisode 25 : valider avant d'ajouter : function ajouterTache(liste, texte) { const t = texte.trim(); if (!t) throw new ErreurValidation("Le texte ne peut pas être vide"); if (t.length &gt; 100) throw new ErreurValidation("Texte trop long"); liste.ajouter(t); } et, côté UI, try { ajouterTache(...); } catch (e) { afficherMessage(e.message); }.
Exercices : (1) entourer un JSON.parse risqué d'un try/catch ; (2) écrire diviser(a,b) qui throw si b vaut 0 ; (3) créer une classe d'erreur personnalisée et la lever puis l'attraper en testant son name.`,
  },
  { num: '26', modNum: '09', modName: 'Robustesse & outillage', levelClass: 'avance', levelLabel: 'Avancé', durationMin: 32, title: 'Les modules ES (import / export)', prereq: 'Leçon 25 recommandée',
    brief: `Objectif : découper le code en fichiers réutilisables. Épisode 26 : éclater l'app en modules.
Sections : (1) Le problème : un seul gros fichier devient ingérable et tout est global. Les MODULES donnent à chaque fichier sa propre portée et des frontières claires. (2) Export NOMMÉ : export function ajouter() {} ; export const PI = 3.14 ; on peut exporter plusieurs choses. (3) Import nommé : import { ajouter, PI } from "./utils.js"; (le chemin commence par ./ et garde l'extension .js dans le navigateur). (4) Export par DÉFAUT : export default class Tache {} ; import Tache from "./tache.js"; (un seul par fichier, nom libre à l'import). (5) Renommer : import { ajouter as ajouterTache }. (6) Côté HTML : &lt;script type="module" src="app.js"&gt;&lt;/script&gt; (les modules sont différés et en mode strict ; ils nécessitent généralement un serveur local, pas file://). Mentionner cette contrainte.
Pièges : oublier l'extension .js dans le navigateur ; oublier type="module" ; mélanger export default et nommé sans le savoir ; les modules ne « fuient » plus dans le global ; le cache des imports (un module n'est évalué qu'une fois).
Pour aller plus loin : imports dynamiques import() (à la demande), re-exports (barrels), les bundlers (Vite/esbuild), la différence avec CommonJS (require).
Fil rouge épisode 26 : proposer une arborescence : tache.js (export default class Tache), stockage.js (export sauver/charger), ui.js (export rendre), app.js (import et orchestration). Donner le code d'au moins deux de ces fichiers avec export/import, et la balise &lt;script type="module" src="app.js"&gt;.
Exercices : (1) créer math.js qui exporte additionner et l'importer ; (2) transformer une classe en export default et l'importer sous un autre nom ; (3) décrire l'arborescence de fichiers d'une petite app et qui importe quoi.`,
  },
  { num: '27', modNum: '09', modName: 'Robustesse & outillage', levelClass: 'avance', levelLabel: 'Avancé', durationMin: 32, title: 'Les expressions régulières (regex)', prereq: 'Leçon 26 recommandée',
    brief: `Objectif : reconnaître et extraire des motifs dans du texte. Épisode 27 : extraire les #tags d'une tâche.
Sections : (1) Qu'est-ce qu'une regex : un motif de recherche dans du texte. Littéral entre slashes : /chat/ ; ou new RegExp("chat"). (2) Tester : motif.test(texte) //=> true/false. (3) Classes de caractères : \\d (chiffre), \\w (lettre/chiffre/_), \\s (espace), . (n'importe quoi), [aeiou] (ensemble), [^...] (négation). (4) Quantificateurs : * (0+), + (1+), ? (0 ou 1), {2,4} (entre 2 et 4). (5) Ancres : ^ (début), $ (fin) ; \\b (frontière de mot). (6) Drapeaux : i (insensible à la casse), g (toutes les occurrences). (7) Extraire : texte.match(/motif/g) ; groupes de capture ( ) ; replace avec motif. Exemple emails, ou « #tag » : texte.match(/#\\w+/g) //=> ["#urgent", "#perso"].
Pièges : oublier le drapeau g pour tout récupérer ; échapper les caractères spéciaux (. \\ ( )) ; regex trop gourmande (greedy) ; illisibilité (commenter !) ; match renvoie null si rien (gérer).
Pour aller plus loin : groupes nommés (?<nom>...), lookahead, méthodes matchAll, performances et catastrophic backtracking.
Fil rouge épisode 27 : permettre des étiquettes dans le texte d'une tâche : function extraireTags(texte) { return texte.match(/#\\w+/g) || []; } ; valider une saisie non vide avec /\\S/.test(texte) ; bonus : surligner les #tags à l'affichage.
Exercices : (1) tester si une chaîne contient au moins un chiffre (\\d) ; (2) extraire tous les mots commençant par # ; (3) valider un code postal français à 5 chiffres avec ^ et $.`,
  },
  { num: '28', modNum: '09', modName: 'Robustesse & outillage', levelClass: 'avance', levelLabel: 'Avancé', durationMin: 30, title: 'Map, Set et structures de données', prereq: 'Leçon 27 recommandée',
    brief: `Objectif : choisir la bonne structure. Épisode 28 : indexer les tâches par id (Map) et collecter les tags (Set).
Sections : (1) Set : une collection de valeurs UNIQUES. new Set([1,1,2]) //=> {1,2} ; add, has, delete, size ; itérable (for...of). Dédoublonner un tableau : [...new Set(tableau)]. (2) Map : des paires clé -> valeur, avec des clés de N'IMPORTE QUEL type (pas seulement des chaînes comme les objets). new Map() ; set(cle, valeur), get(cle), has, delete, size ; itérer avec for (const [cle, valeur] of map). (3) Map vs objet : Map garde l'ordre d'insertion, autorise des clés non-chaînes, a une vraie taille (size), pas de clés héritées. (4) Conversions : Object.entries(obj) -> Map ; [...map] -> tableau de paires ; [...set] -> tableau. (5) Quand utiliser quoi : tableau (liste ordonnée), objet (enregistrement à clés connues), Map (dictionnaire dynamique/recherche par id), Set (unicité/appartenance).
Pièges : comparer des objets par valeur dans un Set (c'est par référence) ; itérer un Map en croyant que c'est un objet ; oublier que get renvoie undefined si absent ; sérialiser un Map en JSON (ne marche pas directement).
Pour aller plus loin : WeakMap/WeakSet (clés faibles), performances de recherche O(1) d'un Map vs find O(n) d'un tableau.
Fil rouge épisode 28 : indexer pour un accès rapide : const index = new Map(taches.map((t) => [t.id, t])); puis index.get(id) au lieu de taches.find(...) ; collecter tous les tags uniques : const tags = new Set(taches.flatMap((t) => extraireTags(t.texte)));.
Exercices : (1) dédoublonner un tableau avec Set ; (2) construire une Map prénom -> âge et lire une valeur ; (3) compter les occurrences de chaque mot d'une phrase avec une Map.`,
  },
  { num: '29', modNum: '10', modName: 'Aller plus loin & projet', levelClass: 'avance', levelLabel: 'Avancé', durationMin: 32, title: 'Itérateurs, générateurs et immutabilité', prereq: 'Module 9 recommandé',
    brief: `Objectif : comprendre l'itération et adopter un état immuable. Épisode 29 : générateur d'ids + refactor immuable.
Sections : (1) Le protocole itérable : ce qui rend un objet utilisable avec for...of et le spread (...). Tableaux, chaînes, Map, Set sont itérables. (2) Les générateurs : function* compteur() { let n = 1; while (true) yield n++; } ; appeler donne un itérateur ; .next() reprend après chaque yield. Production paresseuse (à la demande). Exemple un générateur d'ids. (3) Itérer un générateur avec for...of (avec une condition d'arrêt). (4) L'immutabilité : ne pas MODIFIER les données existantes mais en créer de NOUVELLES. Pourquoi : code prévisible, comparaisons faciles, pas d'effets de bord à distance. (5) Techniques : spread pour copier ([...arr], { ...obj }), map/filter (qui ne mutent pas), Object.freeze (gel superficiel). Ex. ajouter sans muter : const nouvelles = [...taches, nouvelle]; basculer : taches.map((t) => t.id === id ? { ...t, faite: !t.faite } : t). (6) Fonctions pures : même entrée -> même sortie, aucun effet de bord.
Pièges : muter un état « partagé » par accident ; Object.freeze n'est que superficiel ; générateur infini sans condition d'arrêt ; confondre map (nouveau tableau) et forEach (effet de bord).
Pour aller plus loin : structures persistantes, bibliothèques (Immer), la programmation fonctionnelle, le rôle de l'immutabilité dans React/Redux.
Fil rouge épisode 29 : remplacer le compteur par un générateur : function* genId() { let n = 1; while (true) yield n++; } const ids = genId(); ... ids.next().value ; et réécrire les opérations de façon IMMUABLE : ajouter, basculer et supprimer renvoient un NOUVEAU tableau plutôt que de modifier l'ancien.
Exercices : (1) écrire un générateur qui produit les nombres pairs ; (2) ajouter un élément à un tableau sans le muter (spread) ; (3) écrire basculerFait(taches, id) qui renvoie un nouveau tableau avec la tâche basculée, sans modifier l'original.`,
  },
  { num: '30', modNum: '10', modName: 'Aller plus loin & projet', levelClass: 'avance', levelLabel: 'Avancé', durationMin: 30, title: 'Déboguer et tester son code', prereq: 'Leçon 29 recommandée',
    brief: `Objectif : trouver les bugs et se prémunir contre eux. Épisode 30 : tester les fonctions clés du projet.
Sections : (1) La console au-delà de log : console.table (tableaux d'objets), console.group, console.warn/error, console.assert(condition, message). (2) Les points d'arrêt (breakpoints) : onglet Sources des DevTools, exécuter pas à pas, inspecter les variables, la pile d'appels ; le mot-clé debugger;. (3) Lire une erreur : message + pile (stack) pour localiser. (4) Méthode de débogage : reproduire, isoler, formuler une hypothèse, vérifier. (5) Pourquoi tester : empêcher les régressions, documenter le comportement. (6) Un test minimal « maison » : function assert(condition, message) { if (!condition) throw new Error("Échec : " + message); console.log("OK : " + message); } et tester une fonction pure : assert(somme([1,2,3]) === 6, "somme additionne"). (7) Cas limites à toujours tester : tableau vide, valeurs nulles, entrées invalides.
Pièges : déboguer « au hasard » sans hypothèse ; laisser des console.log partout ; ne tester que le cas idéal ; tester du code qui dépend du DOM/réseau sans l'isoler (préférer des fonctions pures).
Pour aller plus loin : les vrais frameworks de test (Vitest, Jest), tests unitaires vs end-to-end, la couverture, le TDD.
Fil rouge épisode 30 : écrire quelques tests pour les fonctions pures du projet : assert(pourcentageFait([]) === 0, "0 tâche -> 0%") ; assert(extraireTags("faire #a #b").length === 2, "deux tags") ; assert(nettoyerTexte("  bonjour ") === "Bonjour", "trim + majuscule"). Montrer comment un test rouge guide la correction.
Exercices : (1) ajouter un console.assert qui vérifie un invariant ; (2) écrire 3 assertions pour une fonction estPair ; (3) débusquer un bug donné en posant une hypothèse et en plaçant un point d'arrêt (décrire la démarche).`,
  },
  { num: '31', modNum: '10', modName: 'Aller plus loin & projet', levelClass: 'avance', levelLabel: 'Avancé', durationMin: 36, title: "Projet final : assembler l'application", prereq: 'Leçon 30 recommandée',
    brief: `Objectif : réunir tout le cours en une application cohérente, et savoir où aller ensuite. Épisode 31 : livraison finale.
Cette leçon est une SYNTHÈSE : peu de notions neuves, on ASSEMBLE.
Sections : (1) L'architecture finale : récapituler les briques posées — la classe Tache (et ListeDeTaches encapsulée), les modules ES (tache.js, stockage.js, ui.js, app.js), la persistance localStorage, la synchronisation fetch avec repli hors-ligne, la validation + erreurs personnalisées, les #tags par regex, l'index Map. Donner un schéma clair de qui fait quoi. (2) Le flux d'une action : « ajouter une tâche » de bout en bout (saisie -> validation -> instance -> liste -> rendu -> sauvegarde). (3) Donner un extrait représentatif de app.js qui orchestre (import des modules, écoute des événements délégués, rendu). (4) Qualité : séparation des responsabilités, fonctions pures testées, état immuable, gestion des erreurs. (5) Les limites de l'app et comment l'améliorer. (6) <h2>Et après&nbsp;?</h2> : les prochaines étapes — un framework (React, déjà en aperçu sur Syntaxe), TypeScript pour le typage, un bundler (Vite), des tests automatisés, le déploiement. Encourager et féliciter.
Pas de section « Pièges » exhaustive ici ; remplace-la par une courte checklist de bonnes pratiques. GARDE quand même « Récap et vérification » et « Exercices » (3 : étendre l'app).
Fil rouge épisode 31 : c'est l'aboutissement — présenter l'application complète (structure de fichiers + extrait d'orchestration) et inviter l'apprenant à la faire sienne.
Exercices (extensions du projet) : (1) ajouter un filtre « toutes / actives / faites » ; (2) ajouter l'édition du texte d'une tâche (avec validation) ; (3) ajouter le tri par priorité ou par date, et persister le choix.`,
  },
];

log('Rédaction de ' + SPECS.length + ' leçons avancées (writer + reviewer)…');

const results = await pipeline(
  SPECS,
  (s) =>
    agent(
      INSTRUCTIONS +
        '\n\n=== LEÇON À RÉDIGER ===\nNuméro : ' + s.num + ' | Module ' + s.modNum + ' (' + s.modName + ') | Niveau : ' + s.levelLabel +
        '\nTitre : ' + s.title + '\n\nBRIEF DÉTAILLÉ (intègre fidèlement le contenu, le code et les pièges ; développe la prose, soigne la progression et la densité) :\n' + s.brief,
      { label: 'écrit L' + s.num, phase: 'Rédaction', schema: SCHEMA }
    ),
  (parts, s) =>
    agent(
      INSTRUCTIONS +
        '\n\n=== RELECTURE CRITIQUE (corrige et renvoie la version finale, même schéma) ===\nLeçon ' + s.num + ' « ' + s.title + ' ».\n' +
        '1. EXACTITUDE du JavaScript moderne : chaque exemple doit s\'exécuter sans erreur et produire le résultat annoncé (classes, closures, async, modules, regex, Map/Set selon la leçon).\n' +
        '2. ÉCHAPPEMENT du code : « & » → « &amp; » (donc « &amp;&amp; »), « < » → « &lt; ». Corrige tout oubli.\n' +
        '3. STRUCTURE complète : intro, 5–8 sections <h2>, Pièges fréquents, Pour aller plus loin, Projet fil rouge — épisode, Récap et vérification (avec lesson-check), Exercices (3 gradués avec solutions).\n' +
        '4. NIVEAU : on s\'adresse à quelqu\'un qui connaît déjà les leçons 1–12 ; ne pas réexpliquer les bases ; profondeur ≈1300–1900 mots.\n' +
        '5. HTML valide, classes autorisées uniquement, AUCUN style/script inline. Cohérence du fil rouge (gestionnaire de tâches).\n\n' +
        'BRIEF DE RÉFÉRENCE :\n' + s.brief + '\n\nBROUILLON (JSON) :\n' + JSON.stringify(parts),
      { label: 'relit L' + s.num, phase: 'Relecture', schema: SCHEMA }
    ).then((fixed) => {
      const p = fixed || parts;
      const html = buildLesson({
        num: s.num, modNum: s.modNum, modName: s.modName, levelClass: s.levelClass,
        levelLabel: s.levelLabel, durationMin: s.durationMin, title: s.title, prereq: s.prereq,
        metaDesc: p.metaDesc, objectives: p.objectives, body: p.body,
      });
      return { file: 'lecon-' + s.num + '.html', html, num: s.num };
    })
);

const ok = results.filter(Boolean);
log('Leçons assemblées : ' + ok.length + '/' + SPECS.length);
return ok;
