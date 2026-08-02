export const meta = {
  name: 'syntaxe-react',
  description: 'Rédige les leçons React 02 à 14 (cours complet « React ») et assemble le HTML',
  phases: [{ title: 'Rédaction' }, { title: 'Relecture' }],
};

const PILL = { debutant: 'Débutant', intermediaire: 'Intermédiaire', avance: 'Avancé' };

function buildLesson(p) {
  const objectives = p.objectives.map((o) => '                  <li>' + o + '</li>').join('\n');
  const pillClass = 'pill--' + p.level;
  const pillLabel = PILL[p.level];
  return `<!DOCTYPE html>
<html lang="fr" data-theme="light">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${p.title} — Leçon ${p.num} · React · Syntaxe</title>
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

  <body data-course="react" data-lesson="lecon-${p.num}.html">
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
            <li><a href="cours.html">React</a></li>
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
    <script src="../../assets/vendor/prism/prism-javascript.min.js" defer></script>
    <script src="../../assets/vendor/prism/prism-jsx.min.js" defer></script>
  </body>
</html>
`;
}

const ICON_NOTE = '<svg class="callout__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M12 8h.01M11 12h1v4h1" /></svg>';
const ICON_WARN = '<svg class="callout__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" /><path d="M12 9v4M12 17h.01" /></svg>';
const ICON_TIP = '<svg class="callout__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12c.7.7 1 1.2 1 2h6c0-.8.3-1.3 1-2a7 7 0 0 0-4-12Z" /></svg>';
const ICON_MORE = '<svg class="callout__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 3v14M5 10l7 7 7-7M5 21h14" /></svg>';

const INSTRUCTIONS = `Tu rédiges une leçon du cours « React : interfaces à composants » (site Syntaxe). Public : développeurs qui
MAÎTRISENT DÉJÀ JavaScript moderne (fonctions fléchées, destructuration, map/filter, modules ES, async, le DOM).
La leçon 1 a déjà posé : ce qu'est React (une bibliothèque pour construire des interfaces à base de COMPOSANTS), le
composant FONCTION qui renvoie du JSX, et un premier exemple. Français, tutoiement, ton clair et technique.
React MODERNE : composants FONCTION + HOOKS uniquement (ne PRÉSENTE PAS les composants classe, sauf brève mention
historique). Cible React 18/19.

PAS D'EXÉCUTION EN DIRECT : React exige une étape de build (transpilation du JSX par Babel/Vite) et le DOM ; il ne
tourne donc PAS dans l'éditeur du site (ouvert en file://). N'invite JAMAIS à cliquer « Tester » ou « Aperçu ».
Montre le code dans des blocs « language-jsx » et DÉCRIS ce qui s'affiche / le comportement (« # rend : … » en commentaire,
ou une phrase). Les exemples doivent être réalistes et complets.

TU PRODUIS UNIQUEMENT { metaDesc, objectives, body } :
- metaDesc : ~150 caractères.
- objectives : 3 à 4 chaînes (« savoir faire X »), HTML inline autorisé (<code>, <strong>). «&nbsp;;» puis «.» pour la dernière.
- body : HTML INTÉRIEUR de <article class="prose"> (sans la balise article, sans bouton « terminer », sans nav).

STRUCTURE (≈1300–1800 mots) : 1–2 <p> d'intro ; 5–8 sections <h2> (chacune avec au moins un exemple de code commenté) ;
<h2>Pièges fréquents</h2> ; <h2>Pour aller plus loin</h2> ; <h2>Récap et vérification</h2> (résumé <ul> + lesson-check) ;
<h2>Exercices</h2> (3 gradués avec solutions repliables contenant du code).

COMPOSANTS (n'invente pas d'autres classes) :
- Code React/JSX : <figure class="code-block" data-file="App.jsx"><pre><code class="language-jsx">… CODE ÉCHAPPÉ …</code></pre></figure>.
- Code JS simple : class="language-javascript". Légende : <p class="code-caption">…</p>
- Note : <div class="callout callout--note">${ICON_NOTE}<div class="callout__body"><p class="callout__title">Note</p><p>…</p></div></div>
- Piège : <div class="callout callout--warn">${ICON_WARN}<div class="callout__body"><p class="callout__title">Piège fréquent</p><p>…</p></div></div>
- Astuce : <div class="callout callout--tip">${ICON_TIP}<div class="callout__body"><p class="callout__title">Astuce</p><p>…</p></div></div>
- Pour aller plus loin : <div class="callout callout--more">${ICON_MORE}<div class="callout__body"><p class="callout__title">Pour aller plus loin</p><p>…</p></div></div>
- Vérification : <div class="lesson-check"><p class="kicker kicker--gold">Vérifie ta compréhension</p><ol><li>…</li><li>…</li><li>…</li></ol></div>
- Exercice : <div class="exercise"><div class="exercise__head"><span class="exercise__num">Exercice 1</span><span class="exercise__level">Échauffement</span></div><p>…</p><details><summary>Voir une solution</summary><figure class="code-block" data-file="solution.jsx"><pre><code class="language-jsx">…</code></pre></figure></details></div>

ÉCHAPPEMENT (ABSOLUMENT CRITIQUE — le JSX est plein de chevrons) : DANS un <code>, « < »→« &lt; », « > »→« &gt; »,
« & »→« &amp; ». Donc CHAQUE balise JSX est échappée : &lt;div&gt;, &lt;button&gt;, une balise auto-fermante &lt;img /&gt;,
un FRAGMENT &lt;&gt;…&lt;/&gt;. Les flèches des gestionnaires « () => … »→« () =&gt; … ». Les expressions « {count > 0} »→« {count &gt; 0} »,
« {a && b} »→« {a &amp;&amp; b} ». Vérifie qu'AUCUN « < », « > » ou « & » brut ne subsiste dans un &lt;code&gt; (sinon la page casse).

RÈGLES : code React idiomatique (composants en PascalCase, hooks appelés au sommet, état immuable, clés stables sur les listes).
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
  { num: '02', modNum: '01', modName: 'Les fondations', level: 'intermediaire', durationMin: 28, title: 'JSX en profondeur', prereq: 'Leçon 01 recommandée',
    brief: `Sujet : comprendre vraiment ce qu'est le JSX.
Sections : (1) JSX = du SUCRE syntaxique transpilé en appels React.createElement(type, props, ...enfants) ; ce n'est ni du HTML ni une chaîne. (2) Les EXPRESSIONS JavaScript entre accolades {} (variables, calculs, appels) ; on y met des EXPRESSIONS, pas des instructions (pas de if/for directs). (3) Les ATTRIBUTS JSX : className (et non class), htmlFor, le camelCase (onClick, tabIndex), et style en OBJET (style avec double accolade et propriétés camelCase). (4) Une expression JSX doit avoir UNE seule racine → les FRAGMENTS (la balise vide ou Fragment). (5) Les balises auto-fermantes OBLIGATOIRES (img, br, input). (6) Les commentaires en accolades. (7) false, null, undefined ne rendent RIEN (utile pour le conditionnel, leçon 5). Montre des exemples et décris le rendu.
Pièges : écrire class au lieu de className ; oublier de fermer une balise ; plusieurs éléments racine sans fragment ; vouloir mettre un if dans le JSX ; confondre {} (expression) et {{}} (objet, ex. style).
Pour aller plus loin : React.createElement sous le capot, le rôle du transpileur (Babel/Vite), extraire une expression complexe dans une variable avant le return, JSX et la sécurité (échappement automatique).
Exercices : (1) afficher une variable et un calcul dans du JSX ; (2) corriger un JSX à deux racines avec un fragment ; (3) appliquer une classe et un style en ligne.`,
  },
  { num: '03', modNum: '01', modName: 'Les fondations', level: 'intermediaire', durationMin: 28, title: 'Les props', prereq: 'Leçon 02 recommandée',
    brief: `Sujet : passer des données à un composant.
Sections : (1) Les PROPS : un composant reçoit un objet de propriétés en argument ; on les passe comme des attributs JSX (texte entre guillemets, expression entre accolades). (2) La DESTRUCTURATION des props dans la signature (function Carte({ titre, prix })) — pratique courante. (3) Les props sont en LECTURE SEULE (un composant ne doit jamais modifier ses props — flux de données DESCENDANT, du parent vers l'enfant). (4) Les valeurs par défaut (paramètres par défaut de la destructuration). (5) props.children : le contenu placé ENTRE les balises du composant (composition). (6) Passer des fonctions en props (pour remonter des événements, leçon 7). (7) Le spread des props (transmettre un objet). Montre un composant réutilisable appelé avec différentes props.
Pièges : modifier une prop (interdit) ; oublier les accolades pour une valeur non textuelle (nombre, booléen, objet) ; confondre props (du parent) et état (interne, leçon 6) ; mauvaise casse (les composants en PascalCase).
Pour aller plus loin : le typage des props (PropTypes, TypeScript), children typés, les render props, la composition vs la configuration.
Exercices : (1) créer un composant Carte qui reçoit des props ; (2) lui donner une valeur par défaut ; (3) utiliser children pour envelopper du contenu.`,
  },
  { num: '04', modNum: '01', modName: 'Les fondations', level: 'intermediaire', durationMin: 26, title: 'Afficher des listes et les clés', prereq: 'Leçon 03 recommandée',
    brief: `Sujet : générer des éléments à partir d'un tableau.
Sections : (1) Rendre une LISTE avec .map() : transformer un tableau de données en un tableau d'éléments JSX. (2) La PROP key : React a besoin d'une clé STABLE et UNIQUE par élément pour suivre les éléments entre deux rendus (ajout, suppression, réordonnancement). (3) Utiliser un IDENTIFIANT métier comme clé (id), PAS l'index du tableau (sauf liste statique) — expliquer pourquoi (bugs d'état/perf au réordonnancement). (4) Filtrer/trier avant de mapper. (5) Rendre une liste vide proprement (état « aucun élément »). (6) Extraire l'élément de liste dans un composant dédié. Montre une liste mappée avec des clés.
Pièges : oublier la prop key (avertissement React) ; utiliser l'index comme clé sur une liste dynamique ; muter le tableau source ; clés non uniques.
Pour aller plus loin : les clés et la réconciliation, la virtualisation des longues listes, key sur un Fragment, les listes imbriquées.
Exercices : (1) afficher une liste de produits avec map et key ; (2) filtrer la liste avant de l'afficher ; (3) gérer le cas « liste vide ».`,
  },
  { num: '05', modNum: '02', modName: 'État & interactivité', level: 'intermediaire', durationMin: 26, title: 'Le rendu conditionnel', prereq: 'Module 1 recommandé',
    brief: `Sujet : afficher (ou non) selon une condition.
Sections : (1) Pourquoi : montrer un élément selon l'état (connecté/déconnecté, chargement, liste vide). (2) Le ET logique && pour afficher si vrai (condition && du JSX) — ATTENTION au piège du 0 (un nombre 0 s'affiche !). (3) Le TERNAIRE condition ? A : B pour choisir entre deux rendus. (4) Extraire dans une VARIABLE avant le return (ou un early return) pour les cas complexes. (5) Rendre null pour n'afficher RIEN. (6) Combiner avec les listes (état vide). Montre les trois techniques.
Pièges : le piège du && avec 0 (afficher 0 au lieu de rien — convertir en booléen) ; des ternaires imbriqués illisibles ; mettre un if dans le JSX (le sortir avant le return) ; oublier que false/null ne rendent rien.
Pour aller plus loin : les composants de garde, les patterns de chargement (squelettes), les error boundaries (mention), la lisibilité.
Exercices : (1) afficher un message si une liste est vide (&&) ; (2) basculer entre deux textes avec un ternaire ; (3) faire un early return selon une prop.`,
  },
  { num: '06', modNum: '02', modName: 'État & interactivité', level: 'intermediaire', durationMin: 32, title: 'L\'état avec useState', prereq: 'Leçon 05 recommandée',
    brief: `Sujet : donner une mémoire à un composant.
Sections : (1) Le problème : les variables locales sont réinitialisées à chaque rendu ; l'ÉTAT persiste entre les rendus et déclenche un RE-RENDU quand il change. (2) const [valeur, setValeur] = useState(initial) : la destructuration, l'initialiseur (valeur ou fonction paresseuse). (3) setValeur déclenche un nouveau rendu ; l'état est IMMUABLE : ne JAMAIS le modifier directement, toujours passer une NOUVELLE valeur. (4) Mettre à jour à partir de l'ancien état avec la forme FONCTION (setN(n => n + 1)) — indispensable pour les mises à jour successives. (5) État OBJET/TABLEAU : créer une copie (spread) plutôt que muter ; mettre à jour un champ. (6) Plusieurs états vs un état objet. (7) Les règles des hooks (au sommet du composant, jamais conditionnels). Montre un compteur et un état objet.
Pièges : muter l'état directement (pas de re-rendu) ; se baser sur l'état courant au lieu de la forme fonction (mises à jour groupées) ; appeler un hook dans une condition/boucle ; trop d'états redondants.
Pour aller plus loin : l'état dérivé (à calculer, pas à stocker), le batching, useReducer (leçon 13), remonter l'état (leçon 11).
Exercices : (1) un compteur avec + et − ; (2) un champ contrôlé par l'état ; (3) mettre à jour un champ d'un objet d'état sans le muter.`,
  },
  { num: '07', modNum: '02', modName: 'État & interactivité', level: 'intermediaire', durationMin: 28, title: 'Gérer les événements', prereq: 'Leçon 06 recommandée',
    brief: `Sujet : réagir aux actions de l'utilisateur.
Sections : (1) Les gestionnaires d'événements en JSX : onClick, onChange, onSubmit… qui reçoivent une FONCTION (pas son appel : onClick={faire}, pas onClick={faire()}). (2) Définir le handler dans le composant ; lui passer des arguments via une fonction fléchée (onClick={() => supprimer(id)}). (3) L'objet ÉVÉNEMENT (e) : e.target.value, e.preventDefault() (empêcher le rechargement d'un formulaire). (4) Les événements synthétiques de React (cohérents entre navigateurs). (5) Remonter un événement au PARENT via une prop fonction (l'enfant appelle la fonction reçue). (6) Éviter de recréer des handlers coûteux (mention useCallback, leçon 13). Montre des boutons et un champ qui modifient l'état.
Pièges : appeler la fonction au lieu de la passer (onClick={faire()}) ; oublier preventDefault sur un submit ; muter l'état dans un handler ; passer mal les arguments (sans fonction fléchée).
Pour aller plus loin : la délégation et les événements natifs, useCallback, les événements clavier/focus, l'accessibilité (clavier).
Exercices : (1) un bouton qui incrémente l'état ; (2) passer un id à un handler via une fonction fléchée ; (3) empêcher le rechargement d'un formulaire avec preventDefault.`,
  },
  { num: '08', modNum: '02', modName: 'État & interactivité', level: 'intermediaire', durationMin: 30, title: 'Les formulaires contrôlés', prereq: 'Leçon 07 recommandée',
    brief: `Sujet : maîtriser les champs de saisie avec React.
Sections : (1) Le composant CONTRÔLÉ : la valeur du champ vient de l'état (value={texte}) et chaque frappe met l'état à jour (onChange) — React est la « source de vérité ». (2) Différents champs : input texte, textarea, checkbox (checked), radio, select (value sur le select). (3) Gérer PLUSIEURS champs avec un état OBJET et un handler générique (e.target.name). (4) La SOUMISSION : onSubmit + preventDefault, lire l'état, réinitialiser. (5) La VALIDATION simple (champ requis, format) et l'affichage des erreurs. (6) Mention des composants non contrôlés (useRef, leçon 12) et des bibliothèques de formulaires. Montre un petit formulaire contrôlé à plusieurs champs.
Pièges : un input avec value mais sans onChange (champ en lecture seule, avertissement) ; checkbox via value au lieu de checked ; muter l'état objet ; oublier name pour un handler générique.
Pour aller plus loin : les formulaires non contrôlés (useRef), React Hook Form / Formik, la validation avancée, l'accessibilité des formulaires (labels).
Exercices : (1) un champ contrôlé qui affiche sa valeur en direct ; (2) un formulaire à 2 champs avec un état objet ; (3) valider qu'un champ n'est pas vide à la soumission.`,
  },
  { num: '09', modNum: '03', modName: 'Effets & données', level: 'intermediaire', durationMin: 32, title: 'useEffect et le cycle de vie', prereq: 'Module 2 recommandé',
    brief: `Sujet : synchroniser un composant avec l'extérieur.
Sections : (1) Un EFFET DE BORD : tout ce qui sort du rendu pur (requête réseau, abonnement, minuteur, manipulation directe du DOM, titre du document). (2) useEffect(() => { … }, [dépendances]) : le code s'exécute APRÈS le rendu. (3) Le TABLEAU DE DÉPENDANCES : vide [] = une seule fois (au montage) ; [a, b] = à chaque changement de a ou b ; absent = à chaque rendu (rare). (4) La fonction de NETTOYAGE (return () => …) : se désabonner, annuler un minuteur, éviter les fuites — appelée avant le prochain effet et au démontage. (5) Le piège des dépendances manquantes (valeurs périmées) ; la règle du linter exhaustive-deps. (6) Quand NE PAS utiliser useEffect (état dérivé, transformation pendant le rendu, réagir à un événement). Montre un minuteur avec nettoyage et la mise à jour du titre.
Pièges : oublier le tableau de dépendances (boucle de rendus) ; dépendances incomplètes (bugs de valeur périmée) ; oublier le nettoyage (fuites, doublons) ; mettre dans un effet ce qui devrait être calculé pendant le rendu.
Pour aller plus loin : le mode strict (double exécution en dev), useLayoutEffect, les hooks de données (React Query), « tu n'as peut-être pas besoin d'un effet ».
Exercices : (1) mettre à jour document.title selon l'état ; (2) un minuteur avec setInterval et son nettoyage ; (3) déclencher un effet quand une prop change.`,
  },
  { num: '10', modNum: '03', modName: 'Effets & données', level: 'intermediaire', durationMin: 30, title: 'Récupérer des données (fetch)', prereq: 'Leçon 09 recommandée',
    brief: `Sujet : charger des données depuis une API.
Sections : (1) Le schéma classique : un useEffect au montage qui appelle fetch, plus TROIS états — données, chargement (loading), erreur. (2) async/await dans un effet : définir une fonction async À L'INTÉRIEUR de l'effet (l'effet lui-même ne peut pas être async) puis l'appeler. (3) Gérer le CYCLE : afficher un indicateur pendant loading, le message d'erreur en cas d'échec (try/catch + vérifier response.ok), les données ensuite. (4) Le NETTOYAGE : annuler avec AbortController ou un drapeau « ignore » pour éviter de mettre à jour un composant démonté (course). (5) Re-déclencher quand un paramètre change (id en dépendance). (6) Mention des bibliothèques (React Query/SWR) qui gèrent cache, revalidation, etc. Montre un composant qui charge et affiche une liste.
Pièges : effet async directement (interdit) ; oublier les états loading/erreur ; ne pas vérifier response.ok ; mises à jour après démontage (course) sans annulation ; boucle de rendus (dépendances).
Pour aller plus loin : AbortController en détail, React Query/SWR, la pagination/infinite scroll, le rendu côté serveur (mention).
Exercices : (1) charger une liste au montage avec loading/erreur ; (2) recharger quand un id change ; (3) annuler proprement la requête au démontage.`,
  },
  { num: '11', modNum: '03', modName: 'Effets & données', level: 'intermediaire', durationMin: 30, title: 'Lever l\'état et composer', prereq: 'Leçon 10 recommandée',
    brief: `Sujet : faire communiquer les composants.
Sections : (1) Le flux de données DESCENDANT (les props vont du parent vers l'enfant) et le besoin de PARTAGER un état entre frères. (2) LEVER L'ÉTAT (lifting state up) : placer l'état dans le plus proche PARENT commun, lui passer la valeur (prop) et une fonction de mise à jour (prop) aux enfants. (3) Les enfants deviennent CONTRÔLÉS par le parent ; ils remontent les changements en appelant la fonction reçue. (4) La COMPOSITION : composer des composants via children et des props de rendu plutôt que de tout imbriquer. (5) Éviter le « prop drilling » excessif (passer une prop sur de nombreux niveaux) → annonce de useContext (leçon 12). (6) Découper en composants : présentation vs logique. Montre deux composants frères synchronisés par un parent.
Pièges : dupliquer l'état dans plusieurs composants (le remonter) ; prop drilling sur trop de niveaux ; un état au mauvais endroit (trop haut ou trop bas) ; composants trop gros.
Pour aller plus loin : useContext (leçon suivante), les gestionnaires d'état (Redux, Zustand), la colocation de l'état, les patterns de composition.
Exercices : (1) remonter l'état d'un champ dans le parent ; (2) synchroniser deux composants frères ; (3) remplacer une imbrication rigide par children.`,
  },
  { num: '12', modNum: '04', modName: 'Hooks avancés & application', level: 'avance', durationMin: 30, title: 'useRef et useContext', prereq: 'Module 3 recommandé',
    brief: `Sujet : deux hooks essentiels au-delà de l'état.
Sections : (1) useRef : une « boîte » MUTABLE qui PERSISTE entre les rendus SANS provoquer de re-rendu — pour deux usages. (2) Référencer un nœud du DOM : const champ = useRef(null) + ref={champ} sur l'élément, puis champ.current pour, par ex., donner le focus. (3) Stocker une valeur mutable (un id de minuteur, la valeur précédente) sans déclencher de rendu. (4) ref vs state (quand le changement doit-il rendre l'UI ?). (5) useContext : éviter le prop drilling en partageant des données « globales » (thème, utilisateur connecté). createContext, le Provider qui fournit une value, useContext pour la consommer. (6) Quand le contexte est adapté (données rarement modifiées, transverses) et ses limites (re-rendus). Montre un focus via useRef et un thème via contexte.
Pièges : utiliser useRef là où il faut un état (l'UI ne se met pas à jour) ; lire ref.current pendant le rendu ; oublier le Provider (valeur par défaut) ; tout mettre dans un seul contexte (re-rendus).
Pour aller plus loin : forwardRef, useImperativeHandle, plusieurs contextes, les performances du contexte, les gestionnaires d'état.
Exercices : (1) donner le focus à un champ avec useRef ; (2) mémoriser une valeur sans re-rendu ; (3) partager un thème via useContext.`,
  },
  { num: '13', modNum: '04', modName: 'Hooks avancés & application', level: 'avance', durationMin: 30, title: 'useReducer et les hooks personnalisés', prereq: 'Leçon 12 recommandée',
    brief: `Sujet : structurer la logique d'état et la réutiliser.
Sections : (1) useReducer : quand l'état devient complexe (plusieurs sous-valeurs, transitions liées) ; const [state, dispatch] = useReducer(reducer, initial). (2) Le REDUCER (state, action) => nouvelState : une fonction PURE qui décrit les transitions selon action.type ; dispatch envoie une action. (3) useState vs useReducer (quand préférer l'un ou l'autre). (4) Les HOOKS PERSONNALISÉS : extraire une logique à état réutilisable dans une fonction useQuelqueChose qui appelle d'autres hooks et renvoie ce qu'on veut (ex. useToggle, useFetch, useLocalStorage). (5) Les règles (commencer par « use », hooks au sommet). (6) Aperçu de useMemo / useCallback (mémoriser une valeur/fonction pour éviter des recalculs ou des re-rendus) — sans sur-optimiser. Montre un reducer et un hook personnalisé.
Pièges : un reducer impur (effets de bord, mutation de l'état) ; sur-utiliser useReducer pour un état trivial ; oublier le préfixe « use » ; abuser de useMemo/useCallback (optimisation prématurée).
Pour aller plus loin : useReducer + contexte (mini Redux), les bibliothèques d'état, useMemo/useCallback en détail, tester un hook personnalisé.
Exercices : (1) un compteur géré par useReducer ; (2) un hook personnalisé useToggle ; (3) extraire la logique de fetch (leçon 10) dans un hook useFetch.`,
  },
  { num: '14', modNum: '04', modName: 'Hooks avancés & application', level: 'avance', durationMin: 30, title: 'Organiser une application & bonnes pratiques', prereq: 'Leçon 13 recommandée',
    brief: `Sujet : assembler une vraie application React — et synthèse du cours.
Sections : (1) La STRUCTURE d'un projet : un outil moderne (Vite), l'arborescence (components/, hooks/, le point d'entrée), un composant = un fichier. (2) Découper l'UI en COMPOSANTS (présentation vs conteneur, petits et réutilisables) ; où placer l'état (colocation). (3) Le ROUTAGE côté client (React Router) : naviguer entre des « pages » sans recharger (mention, vue d'ensemble). (4) Les BONNES PRATIQUES : clés stables, état minimal et dérivé calculé, listes/handlers propres, accessibilité, nommage. (5) La PERFORMANCE : éviter les rendus inutiles (mémoïsation avec mesure), le découpage de code (lazy/Suspense, mention). (6) L'écosystème (state management, data fetching, tests, TypeScript). (7) &lt;h2&gt;Et après&lt;/h2&gt; : tu maîtrises React moderne ; pistes — React Router, un gestionnaire d'état, TypeScript, Next.js, les tests (React Testing Library). Encourage.
Remplace « Pièges fréquents » par une CHECKLIST DE BONNES PRATIQUES React (à puces). GARDE « Pour aller plus loin », « Récap et vérification » et « Exercices ».
Exercices : (1) proposer une découpe en composants d'une petite interface ; (2) décider où placer un état partagé ; (3) lister 5 bonnes pratiques React.`,
  },
];

log('Rédaction de ' + SPECS.length + ' leçons (React)…');

const results = await pipeline(
  SPECS,
  (s) =>
    agent(
      INSTRUCTIONS +
        '\n\n=== LEÇON À RÉDIGER ===\nNuméro : ' + s.num + ' | Module ' + s.modNum + ' (' + s.modName + ')\nTitre : ' + s.title +
        '\n\nBRIEF DÉTAILLÉ (intègre fidèlement le contenu et les exemples ; décris le rendu ; ÉCHAPPE toutes les balises JSX, les flèches => et les & dans le code) :\n' + s.brief,
      { label: 'écrit L' + s.num, phase: 'Rédaction', schema: SCHEMA }
    ),
  (parts, s) =>
    agent(
      INSTRUCTIONS +
        '\n\n=== RELECTURE CRITIQUE (corrige et renvoie la version finale, même schéma) ===\nLeçon ' + s.num + ' « ' + s.title + ' ».\n' +
        '1. EXACTITUDE du React moderne (hooks au sommet, état immuable, key stables, composants fonction) ; chaque exemple correct, rendu décrit.\n' +
        '2. PAS d\'invitation à « Tester »/« Aperçu » (React exige un build ; il ne tourne pas dans le navigateur du site).\n' +
        '3. ÉCHAPPEMENT (CRITIQUE, le JSX est plein de chevrons) : DANS les blocs de code, CHAQUE balise JSX échappée (&lt;div&gt;, &lt;img /&gt;, fragment &lt;&gt;…&lt;/&gt;), les flèches « =&gt; », et « < »→« &lt; », « > »→« &gt; », « & »→« &amp; » (dont &amp;&amp;). AUCUN chevron ni & brut dans un &lt;code&gt;.\n' +
        '4. STRUCTURE : intro, 5–8 sections <h2>, Pièges fréquents (sauf L14 : checklist), Pour aller plus loin, Récap et vérification (lesson-check), Exercices (3 avec solutions).\n' +
        '5. Public connaît déjà JavaScript ; aucun style/script réel dans la page.\n\n' +
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
