export const meta = {
  name: 'syntaxe-lessons-02-12',
  description: 'Rédige les leçons JavaScript 02 à 12 (writer + reviewer) et assemble le HTML final',
  phases: [
    { title: 'Rédaction' },
    { title: 'Relecture' },
  ],
};

/* ---------------------------------------------------------------------------
   Gabarit FIXE de page de leçon — garantit un boilerplate identique partout.
   Les agents ne produisent QUE { metaDesc, objectives[], body }.
   --------------------------------------------------------------------------- */
function buildLesson(p) {
  const objectives = p.objectives.map((o) => '                  <li>' + o + '</li>').join('\n');
  return `<!DOCTYPE html>
<html lang="fr" data-theme="light">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${p.title} — Leçon ${p.num} · Syntaxe</title>
    <meta name="description" content="${p.metaDesc}" />
    <link rel="icon" type="image/svg+xml" href="../assets/img/favicon.svg" />

    <script src="../js/theme.js"></script>

    <link rel="stylesheet" href="../../css/fonts.css" />

    <link rel="stylesheet" href="../css/variables.css" />
    <link rel="stylesheet" href="../css/base.css" />
    <link rel="stylesheet" href="../css/layout.css" />
    <link rel="stylesheet" href="../css/components.css" />
    <link rel="stylesheet" href="../css/pages.css" />
  </head>

  <body data-course="javascript" data-lesson="js-lecon-${p.num}.html">
    <a class="skip-link" href="#contenu">Aller au contenu</a>

    <header class="site-header">
      <div class="container--wide container site-header__inner">
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
    </header>

    <div class="reading-progress" data-reading-progress aria-hidden="true"></div>

    <main id="contenu">
      <div class="container container--wide">
        <nav class="breadcrumb-nav" aria-label="Fil d'Ariane">
          <ol class="breadcrumb">
            <li><a href="../index.html">Accueil</a></li>
            <li><a href="catalogue.html">Catalogue</a></li>
            <li><a href="cours-javascript.html">JavaScript</a></li>
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
          <span><a href="cours-javascript.html">← Retour au programme du cours</a></span>
        </div>
      </div>
    </footer>

    <script src="../js/data.js" defer></script>
    <script src="../js/main.js" defer></script>
    <script src="../js/lecon.js" defer></script>
    <script src="../../assets/vendor/prism/prism-core.min.js" defer></script>
    <script src="../../assets/vendor/prism/prism-clike.min.js" defer></script>
    <script src="../../assets/vendor/prism/prism-markup.min.js" defer></script>
    <script src="../../assets/vendor/prism/prism-javascript.min.js" defer></script>
  </body>
</html>
`;
}

/* ---------------------------------------------------------------------------
   Consignes communes (composants HTML exacts à réutiliser).
   --------------------------------------------------------------------------- */
const ICON_NOTE = '<svg class="callout__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M12 8h.01M11 12h1v4h1" /></svg>';
const ICON_WARN = '<svg class="callout__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" /><path d="M12 9v4M12 17h.01" /></svg>';
const ICON_TIP = '<svg class="callout__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12c.7.7 1 1.2 1 2h6c0-.8.3-1.3 1-2a7 7 0 0 0-4-12Z" /></svg>';
const ICON_MORE = '<svg class="callout__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 3v14M5 10l7 7 7-7M5 21h14" /></svg>';

const INSTRUCTIONS = `Tu rédiges une leçon du cours « JavaScript : des bases à l'intermédiaire » pour le site Syntaxe.
La leçon est en FRANÇAIS, tutoiement, ton clair, pédagogique et chaleureux mais précis.

OBJECTIF DE PROFONDEUR (impératif) : ce n'est PAS un survol. Chaque leçon doit mener du connu vers
l'inconnu, un concept nouveau à la fois, avec des exemples travaillés pas à pas, les pièges fréquents,
des points avancés, un récap et une vérification. Vise une vraie densité (≈ 1200–1800 mots).

TU PRODUIS UNIQUEMENT le contenu pédagogique — un objet { metaDesc, objectives, body } :
- metaDesc : phrase de ~150 caractères décrivant la leçon (pour <meta description>).
- objectives : tableau de 3 à 4 chaînes (verbe à l'infinitif « savoir faire X »), HTML inline autorisé (<code>, <strong>). Termine chaque objectif par «&nbsp;;» sauf le dernier par «.».
- body : le HTML INTÉRIEUR de <article class="prose"> (SANS la balise article, SANS le bouton « terminer », SANS la nav précédent/suivant — ils sont ajoutés automatiquement).

STRUCTURE du body (dans cet ordre) :
1. Un ou deux <p> d'introduction qui rappellent le prérequis et annoncent l'objectif.
2. Plusieurs sections, CHACUNE introduite par un <h2> (5 à 8 sections). Les <h2> alimentent le sommaire automatique : titres courts et clairs.
3. Une section <h2>Pièges fréquents</h2> avec une <ul> ou des encadrés « piège ».
4. Une section <h2>Pour aller plus loin</h2> (points avancés/subtilités).
5. Une section <h2>Projet fil rouge — épisode N</h2> qui fait avancer le gestionnaire de tâches (voir le brief).
6. Une section <h2>Récap et vérification</h2> : un court résumé en <ul>, suivi du bloc lesson-check.
7. Une section <h2>Exercices</h2> : exactement 3 exercices gradués (Échauffement, Application, Défi), chacun avec une solution repliable.

COMPOSANTS HTML EXACTS à utiliser (n'invente pas d'autres classes) :
- Bloc de code :
  <figure class="code-block" data-file="exemple.js"><pre><code class="language-javascript">CODE_ICI</code></pre></figure>
  Pour du HTML, utilise data-file="index.html" et class="language-markup".
- Légende sous un bloc (optionnel) : <p class="code-caption">…</p>
- Encadré Note :
  <div class="callout callout--note">${ICON_NOTE}<div class="callout__body"><p class="callout__title">Note</p><p>…</p></div></div>
- Encadré Piège :
  <div class="callout callout--warn">${ICON_WARN}<div class="callout__body"><p class="callout__title">Piège fréquent</p><p>…</p></div></div>
- Encadré Astuce :
  <div class="callout callout--tip">${ICON_TIP}<div class="callout__body"><p class="callout__title">Astuce</p><p>…</p></div></div>
- Encadré Pour aller plus loin :
  <div class="callout callout--more">${ICON_MORE}<div class="callout__body"><p class="callout__title">Pour aller plus loin</p><p>…</p></div></div>
- Vérification (à la fin du récap) :
  <div class="lesson-check"><p class="kicker kicker--gold">Vérifie ta compréhension</p><ol><li>…</li><li>…</li><li>…</li></ol></div>
- Exercice :
  <div class="exercise"><div class="exercise__head"><span class="exercise__num">Exercice 1</span><span class="exercise__level">Échauffement</span></div><p>Énoncé…</p><details><summary>Voir une solution</summary><figure class="code-block" data-file="solution.js"><pre><code class="language-javascript">CODE</code></pre></figure></details></div>

RÈGLES D'ÉCHAPPEMENT DANS LE CODE (critique) — à l'intérieur de <code> :
- « & » DOIT devenir « &amp; » (donc l'opérateur ET « && » s'écrit « &amp;&amp; »).
- « < » DOIT devenir « &lt; » (ex. comparaison « a < b » → « a &lt; b », balises HTML → « &lt;div&gt; »).
- « > » peut rester tel quel (la flèche « => » s'écrit telle quelle).
- Les guillemets dans le code restent des guillemets droits ".
- Utilise des commentaires // et la convention //=> pour montrer un résultat affiché.

RÈGLES GÉNÉRALES :
- AUCUN style inline, AUCun attribut style=, AUCune balise <style>, AUCun onclick ni <script>.
- Code JavaScript MODERNE et CORRECT (let/const, fonctions fléchées quand pertinent). Vérifie mentalement que chaque exemple s'exécute sans erreur et produit bien le résultat annoncé.
- HTML valide et bien équilibré. N'utilise que les classes listées + <p> <ul> <ol> <li> <strong> <em> <code> <h2> <h3> <kbd>.
- Reste cohérent avec le projet fil rouge (gestionnaire de tâches) déjà commencé : tableau « taches », objets { id, texte, faite }.`;

const SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['metaDesc', 'objectives', 'body'],
  properties: {
    metaDesc: { type: 'string' },
    objectives: { type: 'array', items: { type: 'string' }, minItems: 3, maxItems: 4 },
    body: { type: 'string', description: "HTML intérieur de l'article (voir consignes)" },
  },
};

/* ---------------------------------------------------------------------------
   Specs des 11 leçons. Le code des exemples est fourni pour garantir
   l'exactitude ; l'agent l'intègre (échappé) et rédige la prose autour.
   --------------------------------------------------------------------------- */
const SPECS = [
  {
    num: '02', modNum: '01', modName: 'Fondations', levelClass: 'debutant', levelLabel: 'Débutant',
    durationMin: 28, title: 'Variables, types et valeurs', prereq: 'Leçon 01 recommandée',
    brief: `Objectif : stocker et nommer des données. Épisode fil rouge 2 : modéliser une tâche avec des variables.
Sections suggérées :
- « Qu'est-ce qu'une variable ? » analogie de la boîte étiquetée. Déclarer avec let : let age = 25; puis réassigner age = 26;.
- « let vs const » : const pour ce qui ne change pas (const pi = 3.14;), let pour ce qui change. Montrer qu'une réassignation de const lève une erreur (TypeError: Assignment to constant variable). Conseil : const par défaut, let si besoin de réassigner. Mentionner var brièvement et pourquoi on l'évite (portée surprenante).
- « Bien nommer » : camelCase (nomComplet), noms parlants, sensible à la casse, pas de mots réservés, pas de chiffre en première position.
- « Les types primitifs » : string ("texte" ou 'texte'), number (42, 3.14 — un seul type pour entiers et décimaux), boolean (true/false), undefined (déclarée mais sans valeur), null (vide volontaire). Mentionner bigint et symbol en une phrase comme avancés.
- « typeof » : typeof "salut" //=> "string" ; typeof 42 //=> "number" ; typeof true //=> "boolean" ; typeof undefined //=> "undefined". Piège célèbre : typeof null //=> "object" (bug historique).
- Exemple travaillé : déclarer let prenom = "Sam"; let age = 25; let estMajeur = age >= 18; et afficher via console.log.
Pièges : croire que const rend la VALEUR immuable (un const objet/tableau reste modifiable — teaser leçon 09) ; confondre = (affectation) et == ; NaN qui est un number ; oublier d'initialiser (undefined).
Pour aller plus loin : différence valeur primitive (copiée) vs référence (teaser objets), let prenom = "Sam"; let copie = prenom; copie = "Lou"; prenom reste "Sam".
Fil rouge épisode 2 : const taches = []; et modéliser une tâche en variables avant d'en faire un objet : let texteTache = "Lire la leçon 2"; let estFaite = false;.
Exercices : (1) déclarer 3 variables sur soi et les afficher ; (2) prédire/afficher le typeof de 4 valeurs ; (3) corriger un bout de code qui réassigne un const (le passer en let) et expliquer.`,
  },
  {
    num: '03', modNum: '01', modName: 'Fondations', levelClass: 'debutant', levelLabel: 'Débutant',
    durationMin: 28, title: 'Opérateurs et expressions', prereq: 'Leçon 02 recommandée',
    brief: `Objectif : calculer, combiner et comparer des valeurs. Épisode fil rouge 3 : composer un libellé de tâche.
Sections :
- « Opérateurs arithmétiques » : + - * / et modulo % (reste : 7 % 2 //=> 1, utile pour pair/impair) et puissance ** (2 ** 3 //=> 8). Priorité des opérateurs et parenthèses (2 + 3 * 4 //=> 14, (2 + 3) * 4 //=> 20).
- « Concaténer du texte » : "Bon" + "jour" //=> "Bonjour". Piège : "3" + 4 //=> "34" (le + avec une string concatène).
- « Les littéraux de gabarit (template literals) » : avec les accents graves et \${...}. Exemple : const nom = "Sam"; const phrase = \`Bonjour \${nom}, tu as \${10 + 2} messages\`;. Avantage : lisible, multi-lignes.
- « Comparer » : === et !== (stricts, recommandés) vs == et != (avec conversion, à éviter). Montrer 0 == "" ou 1 == "1" surprenants ; toujours préférer ===. Comparateurs < > <= >=.
- « truthy / falsy » : valeurs falsy = false, 0, "", null, undefined, NaN ; tout le reste est truthy. Conversion en booléen avec Boolean(x) ou !!x.
- « Opérateurs logiques » : && (ET), || (OU), ! (NON). Tables courtes. Court-circuit (teaser leçon 04).
- « Affectations composées » : += -= *=, ex. let total = 0; total += 5;.
Pièges : 0.1 + 0.2 //=> 0.30000000000000004 (flottants) ; == imprévisible ; ! prioritaire ; concat involontaire string+number.
Pour aller plus loin : conversion explicite Number("42") //=> 42, String(42) //=> "42", parseInt, et NaN qui n'est égal à rien (NaN === NaN //=> false).
Fil rouge épisode 3 : composer un résumé : const texte = "Lire"; const faite = false; const libelle = \`[\${faite ? "x" : " "}] \${texte}\`; (le ternaire sera vu leçon 04, ici on peut juste concaténer un état).
Exercices : (1) calculer le reste et le quotient d'une division ; (2) écrire une phrase avec un template literal mêlant texte et calcul ; (3) prédire les résultats de 5 comparaisons === et expliquer une différence == vs ===.`,
  },
  {
    num: '04', modNum: '02', modName: 'Logique', levelClass: 'debutant', levelLabel: 'Débutant',
    durationMin: 30, title: 'Prendre des décisions (conditions)', prereq: 'Module 1 recommandé',
    brief: `Objectif : exécuter du code selon une condition. Épisode fil rouge 4 : afficher l'état d'une tâche.
Sections :
- « if / else » : structure de base. Exemple age : if (age >= 18) { console.log("Majeur"); } else { console.log("Mineur"); }.
- « else if » : enchaîner plusieurs cas (note >= 16 "Très bien", >= 12 "Bien", sinon "À revoir"). Ordre des conditions important.
- « Conditions imbriquées vs retour anticipé » : préférer des conditions claires ; teaser de la simplification.
- « switch » : quand on compare une valeur à plusieurs cas constants. Exemple jour. INSISTER sur break (sinon « fall-through ») et default.
- « L'opérateur ternaire » : condition ? valeurSiVrai : valeurSiFaux. Exemple const etat = faite ? "Terminée" : "À faire";. À réserver aux cas simples.
- « Court-circuit && et || » : valeurParDefaut = saisie || "Anonyme"; et faire && action(). Expliquer que && renvoie la 1re valeur falsy ou la dernière, || la 1re truthy.
- « L'opérateur ?? (nullish) » : ne se déclenche que pour null/undefined (contrairement à || qui réagit aussi à 0 ou ""). Exemple const quantite = saisie ?? 1; quand 0 est une valeur valide.
Pièges : utiliser = (affectation) au lieu de === dans un if ; oublier break dans switch ; ternaires imbriqués illisibles ; comparer avec == .
Pour aller plus loin : valeurs falsy et conditions (if (taches.length) …), différence || vs ??.
Fil rouge épisode 4 : function afficherEtat(tache) { console.log(tache.faite ? "[x] " + tache.texte : "[ ] " + tache.texte); } (objet { texte, faite }).
Exercices : (1) écrire un if/else if/else qui classe une note ; (2) réécrire un if/else simple en ternaire ; (3) un switch sur un code de statut ("todo","doing","done") affichant un message, avec default.`,
  },
  {
    num: '05', modNum: '02', modName: 'Logique', levelClass: 'debutant', levelLabel: 'Débutant',
    durationMin: 30, title: 'Répéter (boucles & itération)', prereq: 'Leçon 04 recommandée',
    brief: `Objectif : répéter une action sans copier-coller. Épisode fil rouge 5 : parcourir et afficher la liste des tâches.
Sections :
- « Pourquoi des boucles » : afficher 1..5 sans boucle = répétitif ; avec boucle = concis.
- « La boucle for » : for (let i = 0; i < 5; i++) { console.log(i); }. Décortiquer initialisation ; condition ; incrément. Afficher 1..5.
- « while » : tant qu'une condition est vraie. Exemple compte à rebours let n = 3; while (n > 0) { console.log(n); n--; }. Mentionner do...while (au moins une fois) brièvement.
- « Parcourir un tableau avec for...of » : const fruits = ["pomme","kiwi"]; for (const fruit of fruits) { console.log(fruit); }. Plus lisible que for avec index quand on n'a pas besoin de l'index.
- « break et continue » : break sort de la boucle, continue saute à l'itération suivante. Exemple chercher un élément et break.
- « Boucles imbriquées » : courte mention (table de multiplication) en signalant le coût.
Pièges : boucle infinie (oublier d'incrémenter, condition toujours vraie) ; erreur d'un cran (off-by-one : i <= length lit un index inexistant) ; modifier la variable de boucle dans le corps.
Pour aller plus loin : for...of vs for...in (in parcourt les CLÉS/index, of les VALEURS ; éviter for...in sur les tableaux). Teaser des méthodes forEach/map (leçon 08).
Fil rouge épisode 5 : const taches = ["Lire","Coder","Réviser"]; for (const t of taches) { console.log("- " + t); }.
Exercices : (1) afficher les nombres pairs de 0 à 10 ; (2) calculer la somme d'un tableau de nombres avec une boucle ; (3) parcourir un tableau et s'arrêter (break) au premier nombre négatif en l'affichant.`,
  },
  {
    num: '06', modNum: '02', modName: 'Logique', levelClass: 'debutant', levelLabel: 'Débutant',
    durationMin: 32, title: 'Factoriser (fonctions)', prereq: 'Leçon 05 recommandée',
    brief: `Objectif : réutiliser de la logique en la nommant. Épisode fil rouge 6 : créer ajouterTache() et formaterTache().
Sections :
- « Pourquoi des fonctions » : éviter la répétition, nommer une intention, tester isolément.
- « Déclarer et appeler » : function direBonjour() { console.log("Bonjour"); } puis direBonjour();. Distinguer définition et appel.
- « Paramètres et arguments » : function saluer(nom) { console.log("Bonjour " + nom); } ; saluer("Sam");. Plusieurs paramètres function aire(l, h) { ... }.
- « return » : renvoyer une valeur. function carre(x) { return x * x; } const r = carre(5); //=> 25. INSISTER : afficher (console.log) ≠ retourner (return). Une fonction sans return renvoie undefined. Le code après return ne s'exécute pas.
- « Paramètres par défaut » : function saluer(nom = "tout le monde") { ... }.
- « Fonctions fléchées » : const carre = (x) => x * x; ; forme courte (retour implicite) et longue avec accolades. Mentionner usage fréquent en callback (leçon 08).
- « Portée (scope) » : variables locales vs globales ; une variable déclarée dans une fonction n'existe pas dehors. Notion de bloc { }.
Pièges : oublier return (fonction renvoie undefined) ; confondre afficher et retourner ; appeler sans parenthèses (référence au lieu d'appel) ; croire qu'une variable locale fuit dehors.
Pour aller plus loin : fonction qui renvoie un booléen (function estPair(n) { return n % 2 === 0; }), introduction douce aux fermetures (closure) : une fonction se souvient des variables de son contexte. Hoisting des déclarations function (appelables avant définition) vs expressions/const (non).
Fil rouge épisode 6 : function ajouterTache(liste, texte) { liste.push(texte); return liste; } et function formaterTache(texte, faite) { return (faite ? "[x] " : "[ ] ") + texte; }.
Exercices : (1) écrire une fonction qui renvoie le plus grand de deux nombres ; (2) une fonction estMajeur(age) qui renvoie un booléen ; (3) transformer une fonction classique en fonction fléchée et expliquer la différence afficher/retourner.`,
  },
  {
    num: '07', modNum: '03', modName: 'Données', levelClass: 'intermediaire', levelLabel: 'Intermédiaire',
    durationMin: 30, title: 'Les tableaux (listes ordonnées)', prereq: 'Module 2 recommandé',
    brief: `Objectif : stocker des collections ordonnées. Épisode fil rouge 7 : le vrai tableau de tâches.
Sections :
- « Créer un tableau » : const fruits = ["pomme", "kiwi", "mangue"];. Tableau vide const t = [];.
- « Accéder par index » : fruits[0] //=> "pomme" (index commence à 0) ; fruits[2] //=> "mangue". Index hors borne : fruits[9] //=> undefined.
- « length » : fruits.length //=> 3 ; dernier élément fruits[fruits.length - 1].
- « Ajouter / retirer » : push (ajoute à la fin), pop (retire la fin), unshift (ajoute au début), shift (retire le début). Montrer chacun avec le tableau résultant en commentaire.
- « Trouver » : indexOf("kiwi") //=> 1, includes("kiwi") //=> true.
- « splice » : retirer/insérer à une position : fruits.splice(1, 1) retire 1 élément à l'index 1. (Brève mention, c'est puissant et muable.)
- « Parcourir » : for...of (rappel) ; mention de forEach (détaillé leçon 08).
- « Copie vs référence » : const a = [1,2]; const b = a; b.push(3); a vaut aussi [1,2,3] (même référence). Copier réellement avec le spread : const c = [...a];.
Pièges : index hors borne renvoie undefined (pas d'erreur) ; oublier que push/pop/etc. MODIFIENT le tableau ; partage de référence inattendu ; const tableau reste modifiable (on peut push, juste pas réassigner).
Pour aller plus loin : tableaux de tableaux (matrice) en une phrase ; Array.isArray ; déstructuration de tableau const [premier, second] = fruits;.
Fil rouge épisode 7 : const taches = []; taches.push({ id: 1, texte: "Lire", faite: false }); (les objets sont vus en détail leçon 09, ici on les manipule comme éléments).
Exercices : (1) créer un tableau de 4 villes, afficher la 1re et la dernière via length ; (2) ajouter une ville à la fin et une au début, afficher le tableau ; (3) écrire une fonction qui reçoit un tableau et renvoie une COPIE avec un élément ajouté, sans modifier l'original (spread).`,
  },
  {
    num: '08', modNum: '03', modName: 'Données', levelClass: 'intermediaire', levelLabel: 'Intermédiaire',
    durationMin: 34, title: 'Transformer les tableaux (map, filter, reduce)', prereq: 'Leçon 07 recommandée',
    brief: `Objectif : traiter des collections sans boucle manuelle, de façon déclarative. Épisode fil rouge 8 : filtrer et rendre les tâches.
Sections :
- « forEach » : exécuter une action pour chaque élément. [1,2,3].forEach((n) => console.log(n));. Ne renvoie rien.
- « map » : transformer chaque élément en un nouveau tableau (même longueur). const doubles = [1,2,3].map((n) => n * 2); //=> [2,4,6]. INSISTER : map RENVOIE un nouveau tableau, n'altère pas l'original ; le callback doit RETOURNER une valeur.
- « filter » : garder les éléments qui passent un test (booléen). const pairs = [1,2,3,4].filter((n) => n % 2 === 0); //=> [2,4].
- « find / findIndex » : premier élément (ou index) qui correspond. users.find((u) => u.id === 3).
- « some / every » : some = au moins un, every = tous. [1,2,3].some((n) => n > 2) //=> true.
- « sort » : trier. PIÈGE : sort compare par défaut en TEXTE ([10,2,1].sort() //=> [1,10,2]) et MODIFIE le tableau. Pour des nombres, fournir un comparateur : nombres.sort((a, b) => a - b);.
- « reduce » : réduire à une seule valeur (somme, etc.). const total = [1,2,3,4].reduce((acc, n) => acc + n, 0); //=> 10. Expliquer accumulateur + valeur initiale.
- « Chaînage » : combiner filter puis map : produits.filter((p) => p.dispo).map((p) => p.nom).
Pièges : oublier le return dans un map/filter (renvoie undefined / ne filtre rien) ; croire que map modifie l'original ; sort sans comparateur sur des nombres ; sort qui mute (copier avant : [...arr].sort()).
Pour aller plus loin : immuabilité (préférer créer de nouveaux tableaux), reduce pour construire un objet (mention), lisibilité vs performance.
Fil rouge épisode 8 : const taches = [{texte:"Lire",faite:true},{texte:"Coder",faite:false}]; const restantes = taches.filter((t) => !t.faite); const libelles = taches.map((t) => (t.faite ? "[x] " : "[ ] ") + t.texte); console.log(\`\${restantes.length} restantes\`);.
Exercices : (1) à partir d'un tableau de nombres, produire le tableau des carrés (map) ; (2) filtrer les mots de plus de 4 lettres ; (3) calculer avec reduce le total d'un panier [{nom,prix}].`,
  },
  {
    num: '09', modNum: '03', modName: 'Données', levelClass: 'intermediaire', levelLabel: 'Intermédiaire',
    durationMin: 32, title: 'Les objets (données nommées)', prereq: 'Leçon 08 recommandée',
    brief: `Objectif : regrouper des données liées sous des noms. Épisode fil rouge 9 : la tâche devient un objet structuré.
Sections :
- « Pourquoi un objet » : un tableau ordonne par position ; un objet nomme. const user = { nom: "Sam", age: 25 };.
- « Accéder aux propriétés » : user.nom //=> "Sam" (notation point) et user["nom"] (notation crochets, utile pour une clé dynamique).
- « Ajouter / modifier / supprimer » : user.email = "a@b.fr"; user.age = 26; delete user.age;.
- « Objets imbriqués » : const tache = { id: 1, texte: "Lire", auteur: { nom: "Sam" } }; accès tache.auteur.nom.
- « Méthodes et this » : une fonction dans un objet. const compteur = { valeur: 0, incr() { this.valeur++; } }; expliquer que this désigne l'objet appelant. Garder simple.
- « Raccourcis » : { texte, faite } quand variables homonymes ; propriétés calculées brièvement.
- « Déstructuration » : const { nom, age } = user; ; avec valeur par défaut const { ville = "?" } = user;.
- « Spread / fusion » : copier const copie = { ...user }; ; fusionner const maj = { ...user, age: 27 };. Crée un NOUVEL objet (immuabilité).
- « Object.keys / values / entries » : Object.keys(user) //=> ["nom","age"]. Parcourir avec for...of sur entries.
- « JSON » : JSON.stringify(user) //=> texte ; JSON.parse(texte) //=> objet. Sert à stocker/transmettre (localStorage, leçon 12).
Pièges : référence partagée (const b = a; b.x = 1 modifie a) → copier avec spread ; this perdu hors contexte ; accéder à une propriété inexistante //=> undefined ; JSON ne sérialise pas les fonctions/undefined.
Pour aller plus loin : tableau d'objets (lien avec map/filter), const par défaut immuable de la VARIABLE mais pas du contenu, Object.freeze (mention).
Fil rouge épisode 9 : modéliser proprement une tâche : function creerTache(texte) { return { id: Date.now(), texte, faite: false }; } et const taches = [creerTache("Lire"), creerTache("Coder")];.
Exercices : (1) créer un objet livre {titre, auteur, annee} et l'afficher proprement ; (2) déstructurer un objet pour en extraire 2 propriétés ; (3) écrire une fonction qui renvoie une COPIE d'un objet avec une propriété modifiée (spread), sans toucher l'original.`,
  },
  {
    num: '10', modNum: '04', modName: 'Navigateur', levelClass: 'intermediaire', levelLabel: 'Intermédiaire',
    durationMin: 34, title: 'Le DOM : sélectionner et modifier', prereq: 'Module 3 recommandé',
    brief: `Objectif : lire et changer le contenu d'une page depuis JavaScript. Épisode fil rouge 10 : afficher les tâches dans la page.
Sections :
- « Qu'est-ce que le DOM » : le navigateur transforme le HTML en un arbre d'objets manipulable ; document est la racine.
- « Sélectionner » : document.querySelector(".titre") (premier qui correspond, sélecteur CSS) et querySelectorAll("li") (tous, renvoie une NodeList). getElementById en une phrase.
- « Lire / écrire le texte » : el.textContent = "Bonjour"; (texte sûr) vs el.innerHTML = "<b>...</b>" (interprète le HTML — risque d'injection si données utilisateur). Préférer textContent par défaut.
- « Classes et style via classes » : el.classList.add("active"), remove, toggle, contains. (On change l'apparence en ajoutant/retirant des CLASSES, pas du style inline.)
- « Attributs et data-* » : el.setAttribute, el.getAttribute, el.dataset.id (pour <li data-id="3">).
- « Créer et insérer » : const li = document.createElement("li"); li.textContent = "Tâche"; liste.append(li); (append à la fin, prepend au début).
- « Supprimer » : el.remove();.
Inclure un exemple HTML (language-markup) minimal : <ul id="liste"></ul> puis le JS qui crée des <li>. Montrer un parcours d'un tableau pour générer les éléments.
Pièges : script exécuté avant que le DOM existe → utiliser defer (rappel leçon 1) ou placer le script en fin de body ; innerHTML et injection (sécurité) ; querySelector renvoie null si rien trouvé (vérifier) ; une NodeList n'est pas un vrai tableau (utiliser forEach ou [...nodeList]).
Pour aller plus loin : différence querySelector (CSS) vs getElementById ; performance (limiter les manipulations, construire puis insérer) ; textContent vs innerText (mention).
Fil rouge épisode 10 : const taches = [{texte:"Lire",faite:false}]; const ul = document.querySelector("#liste"); for (const t of taches) { const li = document.createElement("li"); li.textContent = t.texte; ul.append(li); }.
Exercices : (1) sélectionner un titre et changer son texte ; (2) créer 3 <li> à partir d'un tableau et les insérer dans une <ul> ; (3) ajouter une classe "fait" à un élément et basculer (toggle) cette classe.`,
  },
  {
    num: '11', modNum: '04', modName: 'Navigateur', levelClass: 'intermediaire', levelLabel: 'Intermédiaire',
    durationMin: 34, title: 'Réagir : les événements', prereq: 'Leçon 10 recommandée',
    brief: `Objectif : répondre aux actions de l'utilisateur. Épisode fil rouge 11 : ajouter/cocher/supprimer une tâche via l'UI.
Sections :
- « Qu'est-ce qu'un événement » : clic, saisie, envoi de formulaire… On « écoute » et on réagit.
- « addEventListener » : bouton.addEventListener("click", function () { ... }); ou avec une fonction fléchée. Expliquer (type, callback). Mentionner removeEventListener (besoin d'une référence nommée).
- « L'objet event » : reçu par le callback. event.target (élément déclencheur), event.currentTarget. Exemple : afficher event.target.
- « Formulaires et preventDefault » : sur "submit", event.preventDefault() empêche le rechargement de la page ; lire la valeur d'un champ via input.value.
- « Types courants » : click, input (à chaque frappe), change, keydown (event.key === "Enter").
- « Délégation d'événements » : au lieu d'attacher un écouteur à chaque <li>, écouter sur le parent <ul> et utiliser event.target.closest("li"). INDISPENSABLE quand on recrée la liste après chaque rendu.
Inclure un petit HTML (language-markup) : un <form> avec <input> et <button>, et une <ul>. Puis le JS : à la soumission, créer une tâche et l'afficher.
Pièges : écouteurs ajoutés en double (re-bind après re-render) → délégation ; oublier preventDefault (la page se recharge) ; attacher l'écouteur à un élément qui n'existe pas encore ; confondre target et currentTarget.
Pour aller plus loin : phases capture/bubbling (intuition), passer une fonction nommée pour pouvoir la retirer, debounce (mention).
Fil rouge épisode 11 : le formulaire ajoute une tâche au tableau puis re-rend la liste ; un clic sur la liste (délégation) bascule t.faite (toggle classe "fait") ou supprime la tâche selon le bouton cliqué (data-action).
Exercices : (1) au clic sur un bouton, afficher une alerte/console et changer un texte ; (2) un champ input qui affiche en direct (event input) ce qu'on tape dans un <p> ; (3) un formulaire qui, à la soumission (sans recharger), ajoute la saisie comme <li> dans une liste.`,
  },
  {
    num: '12', modNum: '04', modName: 'Navigateur', levelClass: 'intermediaire', levelLabel: 'Intermédiaire',
    durationMin: 38, title: 'Asynchrone & persistance (+ projet final)', prereq: 'Leçon 11 recommandée',
    brief: `Objectif : différer du travail, attendre, et conserver des données ; FINALISER le projet. Épisode fil rouge 12 : persistance localStorage + bilan.
Sections :
- « Synchrone vs asynchrone » : intuition de la pile et de la file (event loop) ; JS fait une chose à la fois mais délègue l'attente.
- « setTimeout » : setTimeout(() => console.log("plus tard"), 1000); montre que le code continue sans attendre.
- « Les promesses » : objet qui représente un résultat futur. .then(valeur => ...).catch(erreur => ...). Exemple court avec une promesse résolue.
- « async / await » : sucre syntaxique. async function charger() { try { const x = await unefonctionAsync(); } catch (e) { ... } }. INSISTER : await ne s'utilise que dans une fonction async ; oublier await donne une promesse au lieu de la valeur.
- « Aperçu de fetch » : récupérer des données réseau (présentation, sans approfondir) : const reponse = await fetch(url); const data = await reponse.json();. (Préciser que fetch nécessite un serveur/Internet — hors périmètre de ce cours hors ligne.)
- « localStorage » : stocker des chaînes côté navigateur. localStorage.setItem("cle", "valeur") ; localStorage.getItem("cle") ; combiné à JSON pour des objets : localStorage.setItem("taches", JSON.stringify(taches)); const taches = JSON.parse(localStorage.getItem("taches")) || [];.
Pièges : oublier await (manipuler une Promise) ; JSON.parse(null) plante → faire || [] ; localStorage ne stocke que des chaînes ; bloquer le thread avec du travail lourd ; quota limité.
Pour aller plus loin : Promise.all (mention), différence localStorage/sessionStorage, sérialisation (Date redevient une chaîne).
Fil rouge épisode 12 — FINALISATION : function sauver(taches) { localStorage.setItem("taches", JSON.stringify(taches)); } et function charger() { return JSON.parse(localStorage.getItem("taches")) || []; } ; au démarrage on charge, à chaque modification on sauve → l'application de tâches est complète (ajout, affichage, coche, suppression, persistance). Terminer par un mot de félicitations et les pistes pour aller plus loin (modules, frameworks).
Exercices : (1) utiliser setTimeout pour afficher 3 messages espacés ; (2) écrire une fonction async qui « attend » une promesse résolue et affiche sa valeur (try/catch) ; (3) sauver un tableau d'objets dans localStorage puis le recharger et l'afficher (JSON.stringify/parse, avec le repli || []).`,
  },
];

/* ---------------------------------------------------------------------------
   Pipeline : rédaction -> relecture/correction -> assemblage
   --------------------------------------------------------------------------- */
log('Rédaction de ' + SPECS.length + ' leçons (writer + reviewer)…');

const results = await pipeline(
  SPECS,
  // Étape 1 — rédaction
  (s) =>
    agent(
      INSTRUCTIONS +
        '\n\n=== LEÇON À RÉDIGER ===\n' +
        'Numéro : ' + s.num + ' | Module ' + s.modNum + ' (' + s.modName + ') | Niveau : ' + s.levelLabel + '\n' +
        'Titre : ' + s.title + '\n\n' +
        'BRIEF DÉTAILLÉ (intègre fidèlement le contenu, le code et les pièges ; développe la prose, ' +
        'soigne la progression et la densité) :\n' + s.brief,
      { label: 'écrit L' + s.num, phase: 'Rédaction', schema: SCHEMA }
    ),
  // Étape 2 — relecture critique + correction
  (parts, s) =>
    agent(
      INSTRUCTIONS +
        '\n\n=== RELECTURE CRITIQUE ===\n' +
        'Tu reçois un brouillon de la leçon ' + s.num + ' (« ' + s.title + ' »). ' +
        'Vérifie SÉVÈREMENT et CORRIGE puis renvoie la version finale (même schéma) :\n' +
        '1. EXACTITUDE du JavaScript : chaque exemple doit s\'exécuter sans erreur et produire le résultat annoncé.\n' +
        '2. ÉCHAPPEMENT du code : « & » → « &amp; » (donc « &amp;&amp; »), « < » → « &lt; ». Corrige tout oubli.\n' +
        '3. STRUCTURE : intro, 5–8 sections <h2>, « Pièges fréquents », « Pour aller plus loin », ' +
        '« Projet fil rouge — épisode », « Récap et vérification » (avec lesson-check), « Exercices » (3, gradués, avec solutions repliables).\n' +
        '4. PROFONDEUR suffisante (≈1200–1800 mots), progression du connu vers l\'inconnu.\n' +
        '5. HTML valide, classes autorisées uniquement, AUCUN style/script inline.\n' +
        '6. Cohérence du fil rouge (gestionnaire de tâches).\n\n' +
        'BRIEF DE RÉFÉRENCE :\n' + s.brief +
        '\n\nBROUILLON (JSON) :\n' + JSON.stringify(parts),
      { label: 'relit L' + s.num, phase: 'Relecture', schema: SCHEMA }
    ).then((fixed) => {
      const p = fixed || parts;
      const html = buildLesson({
        num: s.num, modNum: s.modNum, modName: s.modName,
        levelClass: s.levelClass, levelLabel: s.levelLabel,
        durationMin: s.durationMin, title: s.title, prereq: s.prereq,
        metaDesc: p.metaDesc, objectives: p.objectives, body: p.body,
      });
      return { file: 'js-lecon-' + s.num + '.html', html, num: s.num };
    })
);

const ok = results.filter(Boolean);
log('Leçons assemblées : ' + ok.length + '/' + SPECS.length);
return ok;
