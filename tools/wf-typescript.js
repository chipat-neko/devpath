export const meta = {
  name: 'syntaxe-typescript',
  description: 'Rédige le cours complet TypeScript (10 leçons, 3 modules) du typage de base aux génériques et à la pratique',
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
    <title>${p.title} — Leçon ${p.num} · TypeScript · Syntaxe</title>
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

  <body data-course="typescript" data-lesson="lecon-${p.num}.html">
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
            <li><a href="cours.html">TypeScript</a></li>
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
    <script src="../../assets/vendor/prism/prism-javascript.min.js" defer></script>
    <script src="../../assets/vendor/prism/prism-typescript.min.js" defer></script>
  </body>
</html>
`;
}

const ICON_NOTE = '<svg class="callout__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M12 8h.01M11 12h1v4h1" /></svg>';
const ICON_WARN = '<svg class="callout__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" /><path d="M12 9v4M12 17h.01" /></svg>';
const ICON_TIP = '<svg class="callout__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12c.7.7 1 1.2 1 2h6c0-.8.3-1.3 1-2a7 7 0 0 0-4-12Z" /></svg>';
const ICON_MORE = '<svg class="callout__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 3v14M5 10l7 7 7-7M5 21h14" /></svg>';

const INSTRUCTIONS = `Tu rédiges une leçon du cours « TypeScript : du typage au quotidien » (Syntaxe). Public : connaît
JavaScript moderne (fonctions, objets, async, modules ES) et DÉCOUVRE TypeScript. Français, tutoiement,
ton précis et pédagogique, du connu (JS) vers l'inconnu (le typage statique). NE suppose AUCUNE
connaissance préalable de TypeScript ; introduis chaque notion par un besoin concret.

PAS D'EXÉCUTION DANS LE NAVIGATEUR : TypeScript se COMPILE (tsc) — le code ne tourne pas dans l'éditeur du
site. N'invite JAMAIS à cliquer « Tester »/« Aperçu ». Montre le code en blocs « language-typescript » et
montre le RÉSULTAT (erreur du compilateur, type inféré, ou sortie console) en COMMENTAIRE dans le code.

TU PRODUIS UNIQUEMENT { metaDesc, objectives, body } :
- metaDesc : ~150 caractères.
- objectives : 3 à 4 chaînes (« savoir faire X »), HTML inline autorisé (<code>, <strong>). «&nbsp;;» puis «.» pour la dernière.
- body : HTML INTÉRIEUR de <article class="prose"> (sans la balise article, sans bouton « terminer », sans nav).

STRUCTURE (≈1300–1800 mots) : 1–2 <p> d'intro ; 5–8 sections <h2> (chacune avec un exemple commenté) ;
<h2>Pièges fréquents</h2> ; <h2>Pour aller plus loin</h2> ; <h2>Récap et vérification</h2> (résumé <ul> + lesson-check) ;
<h2>Exercices</h2> (3 gradués avec solutions repliables contenant du code).

COMPOSANTS (n'invente pas d'autres classes) :
- Code TypeScript : <figure class="code-block" data-file="exemple.ts"><pre><code class="language-typescript">… CODE ÉCHAPPÉ …</code></pre></figure>.
- Commandes terminal (tsc, npm) : <figure class="code-block" data-file="Terminal"><pre><code class="language-bash">… ÉCHAPPÉ …</code></pre></figure>. Légende : <p class="code-caption">…</p>
- Note : <div class="callout callout--note">${ICON_NOTE}<div class="callout__body"><p class="callout__title">Note</p><p>…</p></div></div>
- Piège : <div class="callout callout--warn">${ICON_WARN}<div class="callout__body"><p class="callout__title">Piège fréquent</p><p>…</p></div></div>
- Astuce : <div class="callout callout--tip">${ICON_TIP}<div class="callout__body"><p class="callout__title">Astuce</p><p>…</p></div></div>
- Pour aller plus loin : <div class="callout callout--more">${ICON_MORE}<div class="callout__body"><p class="callout__title">Pour aller plus loin</p><p>…</p></div></div>
- Vérification : <div class="lesson-check"><p class="kicker kicker--gold">Vérifie ta compréhension</p><ol><li>…</li><li>…</li><li>…</li></ol></div>
- Exercice : <div class="exercise"><div class="exercise__head"><span class="exercise__num">Exercice 1</span><span class="exercise__level">Échauffement</span></div><p>…</p><details><summary>Voir une solution</summary><figure class="code-block" data-file="solution.ts"><pre><code class="language-typescript">…</code></pre></figure></details></div>

ÉCHAPPEMENT (ABSOLUMENT CRITIQUE — TS est plein de chevrons génériques) : DANS un <code>, « < »→« &lt; »,
« > »→« &gt; », « & »→« &amp; ». Donc les génériques « Array<string> »→« Array&lt;string&gt; », « <T> »→« &lt;T&gt; »,
les flèches « () => … »→« () =&gt; … », les « a && b »→« a &amp;&amp; b », les comparaisons « n > 0 »→« n &gt; 0 ».
AUCUN « < », « > » ou « & » brut dans un &lt;code&gt;.

RÈGLES : TypeScript idiomatique et moderne (mode strict supposé). Préfère l'inférence quand elle suffit ;
montre les annotations explicites quand elles éclairent. Aucun style=, aucun <style>, aucun <script> RÉEL dans la page.`;

const SCHEMA = {
  type: 'object', additionalProperties: false,
  required: ['metaDesc', 'objectives', 'body'],
  properties: {
    metaDesc: { type: 'string' },
    objectives: { type: 'array', items: { type: 'string' }, minItems: 3, maxItems: 4 },
    body: { type: 'string' },
  },
};

const M1 = 'Démarrer avec TypeScript';
const M2 = 'Le système de types';
const M3 = 'TypeScript en pratique';

const SPECS = [
  { num: '01', modNum: '01', modName: M1, level: 'intermediaire', durationMin: 26, title: 'Pourquoi TypeScript ?', prereq: 'Cours JavaScript recommandé',
    brief: `Sujet : ce qu'apporte TypeScript et comment l'exécuter.
Sections : (1) Le PROBLÈME que résout TS : en JS, une faute de type (passer une string où on attend un number, accéder à une propriété qui n'existe pas) explose À L'EXÉCUTION, parfois en prod. TS ajoute un TYPAGE STATIQUE vérifié AVANT l'exécution, dans l'éditeur. (2) TS est un SUR-ENSEMBLE de JS : tout JS valide est du TS valide ; on ajoute progressivement des types. (3) La compilation : tsc transpile le .ts en .js (les types sont EFFACÉS, « type erasure » — ils n'existent pas à l'exécution). Installer (npm install -D typescript), npx tsc fichier.ts, npx tsc --init. (4) tsconfig.json et l'option clé strict: true. (5) L'INFÉRENCE : TS devine souvent le type, on n'annote pas tout (let n = 3 est déjà number). (6) Un premier exemple : une fonction annotée qui refuse un mauvais argument (montrer l'erreur tsc en commentaire). (7) Où TS tourne : éditeur (VS Code), build, et les outils modernes (Vite, ts-node, Deno, Bun). Montrer l'erreur du compilateur en commentaire.
Pièges : croire que les types existent à l'exécution (ils sont effacés) ; oublier que TS ne PROTÈGE pas des erreurs de données externes (JSON, fetch) sans validation ; confondre erreur de TYPE (compilation) et erreur d'EXÉCUTION.
Pour aller plus loin : le mode strict, les playgrounds TS en ligne, ts-node/Deno/Bun qui exécutent le TS directement, l'intégration éditeur (IntelliSense).
Exercices : (1) annoter une fonction addition(a: number, b: number): number ; (2) repérer pourquoi tsc refuse un appel ; (3) initialiser un tsconfig et compiler un fichier.`,
  },
  { num: '02', modNum: '01', modName: M1, level: 'intermediaire', durationMin: 30, title: 'Les types de base', prereq: 'Leçon 1 recommandée',
    brief: `Sujet : le vocabulaire de types primitifs et de collections de TypeScript.
Sections : (1) Annoter une variable : let nom: string. Les primitifs string, number, boolean. (2) L'INFÉRENCE vs l'annotation explicite : quand laisser TS deviner, quand annoter (paramètres, retours publics). (3) Les TABLEAUX : number[] ou Array&lt;number&gt; ; tableaux de types mixtes via union. (4) Les TUPLES : [string, number] (longueur et types fixes par position). (5) any (la porte de sortie du typage — à ÉVITER), unknown (le « any sûr » : il faut affiner avant d'utiliser), void (fonction qui ne retourne rien), never (ne retourne jamais). (6) null et undefined, et l'option strictNullChecks qui force à gérer l'absence. (7) Les ENUM (et l'alternative union de littéraux, souvent préférée). (8) Les ASSERTIONS de type (value as Type) et quand elles sont légitimes/dangereuses. Montrer types inférés et erreurs en commentaire.
Pièges : abuser de any (on perd tout l'intérêt) ; confondre any et unknown ; oublier que sans strictNullChecks, null se faufile partout ; une assertion as qui MENT au compilateur (pas de vérification réelle).
Pour aller plus loin : unknown et le narrowing (leçon 4), les littéraux comme types, bigint et symbol, pourquoi préférer les unions aux enums.
Exercices : (1) typer un tableau et un tuple ; (2) remplacer un any par unknown + vérification ; (3) gérer une valeur possiblement null.`,
  },
  { num: '03', modNum: '01', modName: M1, level: 'intermediaire', durationMin: 30, title: 'Objets, interfaces et alias de types', prereq: 'Leçon 2 recommandée',
    brief: `Sujet : décrire la forme des objets.
Sections : (1) Le type d'un objet en ligne : { nom: string; age: number }. (2) INTERFACE : nommer une forme réutilisable (interface Utilisateur { … }). (3) TYPE ALIAS : type Utilisateur = { … } ; interface vs type (interface extensible/déclarations fusionnables ; type plus général : unions, intersections, primitifs). Recommandation pratique. (4) Propriétés OPTIONNELLES (age?: number) et readonly (lecture seule). (5) Les INDEX SIGNATURES : { [cle: string]: number } pour un dictionnaire. (6) L'IMBRICATION et la composition (un objet qui contient un autre type, des tableaux d'objets). (7) extends (interface) et l'INTERSECTION & (type) pour composer. (8) Le typage STRUCTUREL (« duck typing ») : TS compare les FORMES, pas les noms. Montrer erreurs (propriété manquante, en trop) en commentaire.
Pièges : confondre optionnel (age?) et union avec undefined ; oublier readonly sur des données qui ne doivent pas muter ; croire que TS est nominal alors qu'il est STRUCTUREL ; objets littéraux et vérification « excess property ».
Pour aller plus loin : interface vs type en détail, l'héritage d'interfaces multiples, les types récursifs (arbres), les utility types (leçon 7).
Exercices : (1) écrire une interface avec une propriété optionnelle et une readonly ; (2) composer deux types avec & ; (3) typer un dictionnaire avec une index signature.`,
  },
  { num: '04', modNum: '02', modName: M2, level: 'intermediaire', durationMin: 32, title: 'Unions, littéraux et affinage (narrowing)', prereq: 'Leçon 3 recommandée',
    brief: `Sujet : exprimer « l'une de plusieurs possibilités » et restreindre un type au fil du code.
Sections : (1) Les UNIONS : string | number (une valeur qui peut être l'un OU l'autre). (2) Les types LITTÉRAUX : type Sens = "haut" | "bas" | "gauche" | "droite" (un ensemble fini de valeurs précises) — souvent mieux qu'un enum. (3) Le NARROWING : TS restreint le type selon le contexte. Les gardes : typeof (primitifs), instanceof (classes), le test de vérité (if (x)), l'opérateur in (présence de propriété). (4) Les UNIONS DISCRIMINÉES : un champ « tag » littéral commun (type: "cercle" | "carre") qui permet à TS de distinguer les variantes dans un switch — le pattern central des données modélisées. (5) Les TYPE GUARDS personnalisés (fonction qui retourne « x is Type »). (6) never et la VÉRIFICATION D'EXHAUSTIVITÉ (le default d'un switch qui assigne à never garantit que tous les cas sont traités). Montrer le narrowing pas à pas en commentaire.
Pièges : accéder à une propriété propre à une variante sans avoir discriminé d'abord ; oublier un cas dans un switch (la vérification never l'attrape) ; un type guard mal écrit qui ment ; confondre union et intersection.
Pour aller plus loin : les assertions de type vs les type guards, les unions discriminées dans les réducteurs (Redux), le contrôle d'exhaustivité, les template literal types.
Exercices : (1) une fonction qui accepte string | number et se comporte selon typeof ; (2) modéliser des formes en union discriminée + une fonction aire() ; (3) écrire un type guard estChaine(x): x is string.`,
  },
  { num: '05', modNum: '02', modName: M2, level: 'intermediaire', durationMin: 30, title: 'Typer les fonctions', prereq: 'Leçon 4 recommandée',
    brief: `Sujet : annoter précisément les fonctions.
Sections : (1) Paramètres et type de RETOUR : function aire(r: number): number. Les fonctions fléchées typées. (2) Le type d'une FONCTION comme valeur : type Operation = (a: number, b: number) =&gt; number (utile pour les callbacks). (3) Paramètres OPTIONNELS (x?: number), PAR DÉFAUT (x = 0), et REST (...nombres: number[]). (4) void en retour et le cas des callbacks (un callback typé void peut retourner quelque chose qu'on ignore). (5) Les SURCHARGES (overloads) : plusieurs signatures pour une même fonction selon les arguments. (6) this typé (le paramètre this fictif). (7) Les fonctions GÉNÉRIQUES en teaser (leçon 6). (8) unknown/never en position de retour. Montrer les erreurs d'arité/type en commentaire.
Pièges : oublier le type de retour sur une API publique (l'inférence peut surprendre) ; confondre paramètre optionnel et union undefined ; mal ordonner les surcharges (de la plus spécifique à la plus large) ; annoter un callback avec un retour trop strict.
Pour aller plus loin : les génériques (leçon 6), les types de fonctions d'ordre supérieur, Parameters&lt;T&gt; et ReturnType&lt;T&gt;, les assertions de fonction.
Exercices : (1) typer une fonction d'ordre supérieur (qui prend un callback) ; (2) une fonction à paramètres rest typés ; (3) écrire deux surcharges pour une fonction inverser(string)/inverser(array).`,
  },
  { num: '06', modNum: '02', modName: M2, level: 'avance', durationMin: 34, title: 'Les génériques', prereq: 'Leçon 5 recommandée',
    brief: `Sujet : écrire du code réutilisable qui préserve les types.
Sections : (1) Le PROBLÈME : une fonction identite(x) qui doit retourner le MÊME type qu'elle reçoit, sans tomber dans any. (2) Les FONCTIONS génériques : function premier&lt;T&gt;(liste: T[]): T | undefined — T est une variable de TYPE déduite à l'appel. (3) Plusieurs paramètres de type (&lt;K, V&gt;). (4) Les CONTRAINTES : &lt;T extends { length: number }&gt; (T doit avoir une propriété length) ; T extends keyof O pour des accès sûrs. (5) Les INTERFACES et CLASSES génériques (Boite&lt;T&gt;, une pile typée Pile&lt;T&gt;). (6) Les valeurs par défaut de paramètre de type (&lt;T = string&gt;). (7) Pourquoi les génériques sont partout : Array&lt;T&gt;, Promise&lt;T&gt;, Map&lt;K, V&gt;. (8) Bonnes pratiques : ne pas sur-généraliser, nommer T/K/V/E par convention. Montrer l'inférence du type à l'appel en commentaire.
Pièges : utiliser any au lieu d'un générique (on perd le lien entre entrée et sortie) ; oublier une contrainte et accéder à une propriété non garantie ; sur-paramétrer (génériques inutiles) ; confondre un paramètre de type et un paramètre de valeur.
Pour aller plus loin : les types conditionnels et les types mappés (leçon 7), la variance, infer, les génériques dans React (composants/props).
Exercices : (1) une fonction générique dernier&lt;T&gt; ; (2) une fonction avec contrainte extends keyof ; (3) une classe Pile&lt;T&gt; (push/pop typés).`,
  },
  { num: '07', modNum: '02', modName: M2, level: 'avance', durationMin: 32, title: 'Types utilitaires et transformation de types', prereq: 'Leçon 6 recommandée',
    brief: `Sujet : dériver des types à partir d'autres types, sans se répéter.
Sections : (1) L'idée : un type « source de vérité » (ex. une interface Utilisateur) dont on DÉRIVE des variantes. (2) keyof (les clés d'un type comme union de littéraux) et typeof (le type d'une VALEUR existante). (3) L'ACCÈS indexé : Utilisateur["email"] récupère le type d'une propriété. (4) Les UTILITY TYPES intégrés : Partial&lt;T&gt; (tout optionnel), Required&lt;T&gt;, Readonly&lt;T&gt;, Pick&lt;T, K&gt;, Omit&lt;T, K&gt;, Record&lt;K, V&gt;, ReturnType&lt;F&gt;, Parameters&lt;F&gt;, NonNullable&lt;T&gt;. Des cas concrets (un type « brouillon » Partial, un index Record). (5) Les TYPES MAPPÉS : { [K in keyof T]: … } pour transformer chaque propriété (rendre tout readonly/optionnel/nullable). (6) Les TYPES CONDITIONNELS en survol : T extends U ? X : Y et infer. (7) Quand s'arrêter : la lisibilité prime sur la virtuosité. Montrer le type résultant en commentaire.
Pièges : recopier à la main un type au lieu de le dériver (désynchronisation) ; abuser des types conditionnels illisibles ; oublier que Omit ne vérifie pas les clés inexistantes (selon version) ; confondre keyof (type) et Object.keys (valeur, runtime).
Pour aller plus loin : les template literal types, les types récursifs, des bibliothèques de types (type-fest), la manipulation de types avancée.
Exercices : (1) dériver un type « aperçu » avec Pick ; (2) un Record&lt;string, number&gt; pour un compteur ; (3) un type mappé qui rend toutes les propriétés nullables.`,
  },
  { num: '08', modNum: '03', modName: M3, level: 'intermediaire', durationMin: 30, title: 'Classes et POO typée', prereq: 'Leçon 7 recommandée',
    brief: `Sujet : la programmation orientée objet avec les garanties de TypeScript.
Sections : (1) Rappel express : une classe en TS, avec des CHAMPS TYPÉS et un constructeur. (2) Les MODIFICATEURS d'accès : public (défaut), private (vraiment privé au sens TS ; mentionner aussi le # privé natif JS), protected. (3) Les RACCOURCIS de constructeur (déclarer un champ via un paramètre public/private). (4) readonly sur les champs. (5) Les GETTERS/SETTERS typés. (6) L'HÉRITAGE (extends, super) et les classes/méthodes ABSTRAITES (abstract). (7) implements : une classe qui respecte une INTERFACE (contrat). (8) Les classes GÉNÉRIQUES (rappel leçon 6) et les membres statiques. (9) Quand préférer un simple type/fonction à une classe. Montrer une erreur d'accès à un membre private en commentaire.
Pièges : exposer des champs qui devraient être private ; oublier que private TS n'est pas une barrière à l'exécution (utiliser # pour un vrai privé) ; confondre implements (contrat) et extends (héritage) ; classes anémiques là où un type suffirait.
Pour aller plus loin : la composition vs l'héritage, les décorateurs (TS/Angular), les champs privés # natifs, les patterns (fabrique, singleton typés).
Exercices : (1) une classe CompteBancaire avec un solde private et des méthodes ; (2) une interface + une classe qui l'implements ; (3) une classe abstraite Forme + deux sous-classes avec aire().`,
  },
  { num: '09', modNum: '03', modName: M3, level: 'intermediaire', durationMin: 30, title: 'Modules, déclarations et configuration', prereq: 'Leçon 8 recommandée',
    brief: `Sujet : organiser un projet TS et l'intégrer à l'écosystème.
Sections : (1) Les MODULES ES en TS : export / import (types ET valeurs) ; import type pour n'importer qu'un type (effacé à la compilation). (2) Le tsconfig.json en détail : strict, target, module, outDir, rootDir, les options qui comptent. (3) Les fichiers de DÉCLARATION .d.ts : décrire les types d'un code JS existant ; declare. (4) Les types des bibliothèques : les paquets @types/* (DefinitelyTyped) pour les libs JS non typées ; beaucoup de libs livrent leurs types. (5) Typer process.env / les imports non-code (selon config). (6) declare global et l'augmentation de modules (survol). (7) La chaîne d'outils : tsc pour vérifier/compiler, mais aussi les bundlers (Vite, esbuild) qui transpilent sans vérifier — d'où tsc --noEmit en garde-fou CI. Montrer un import type et un .d.ts minimal.
Pièges : importer une lib JS sans ses @types (erreurs « could not find declaration ») ; croire que le bundler vérifie les types (il transpile, il ne vérifie pas) ; mélanger valeurs et types sans import type ; un tsconfig trop laxiste (strict désactivé).
Pour aller plus loin : DefinitelyTyped, écrire ses propres .d.ts, les project references (monorepo), la publication d'un paquet typé, l'option strict détaillée.
Exercices : (1) découper un module en export/import avec import type ; (2) écrire un .d.ts minimal pour une fonction JS ; (3) repérer l'option tsconfig qui force la gestion des null.`,
  },
  { num: '10', modNum: '03', modName: M3, level: 'intermediaire', durationMin: 30, title: 'TypeScript au quotidien', prereq: 'Leçon 9 recommandée',
    brief: `Sujet : utiliser TS dans de vrais projets et migrer du JS existant.
Sections : (1) MIGRER JS → TS progressivement : renommer en .ts, activer allowJs, corriger au fil de l'eau, viser strict à terme. (2) Les bonnes pratiques : préférer l'inférence, éviter any (et activer noImplicitAny), modéliser les données par des types/unions, ne pas mentir au compilateur (as avec parcimonie). (3) Données EXTERNES (fetch/JSON) : le danger du as non vérifié ; valider à la frontière (zod, ou un type guard manuel) pour que le typage reflète la réalité. (4) TS avec REACT (mention) : typer les props/état (lien avec le cours React) ; TS avec NODE (typer une API ; lien cours Node.js). (5) Les ERREURS de compilateur fréquentes et comment les lire (« Type X is not assignable to type Y », « Object is possibly undefined »). (6) Outillage : ESLint + TS, le strict mode, tsc --noEmit en CI. (7) Pourquoi l'effort en vaut la peine sur un vrai projet (refactors sûrs, autocomplétion, doc vivante). Montrer un exemple de validation à la frontière.
Pièges : tout typer en any « pour avancer » (dette) ; faire confiance à un as sur des données réseau ; désactiver strict ; ignorer les erreurs avec @ts-ignore au lieu de les comprendre.
Pour aller plus loin : zod/valibot (validation runtime + inférence de types), tRPC, la config stricte avancée, TS dans un monorepo, les Server Components typés.
Exercices : (1) valider une réponse JSON avec un type guard avant usage ; (2) corriger une erreur « possibly undefined » ; (3) typer les props d'un petit composant (style React).`,
  },
];

log('Rédaction de ' + SPECS.length + ' leçons (cours TypeScript complet)…');

const results = await pipeline(
  SPECS,
  (s) =>
    agent(
      INSTRUCTIONS +
        '\n\n=== LEÇON À RÉDIGER ===\nNuméro : ' + s.num + ' | Module ' + s.modNum + ' (' + s.modName + ')\nTitre : ' + s.title +
        '\n\nBRIEF DÉTAILLÉ (intègre fidèlement le contenu ; montre erreurs/types en commentaire ; ÉCHAPPE génériques &lt;T&gt;, flèches =>, && et <, >, &) :\n' + s.brief,
      { label: 'écrit L' + s.num, phase: 'Rédaction', schema: SCHEMA }
    ),
  (parts, s) =>
    agent(
      INSTRUCTIONS +
        '\n\n=== RELECTURE CRITIQUE (corrige et renvoie la version finale, même schéma) ===\nLeçon ' + s.num + ' « ' + s.title + ' ».\n' +
        '1. EXACTITUDE du TypeScript moderne (mode strict ; types corrects ; inférence vs annotation justes).\n' +
        '2. PÉDAGOGIE : public connaît JS, découvre TS ; chaque notion motivée ; PAS d\'invitation à « Tester »/« Aperçu ».\n' +
        '3. ÉCHAPPEMENT (CRITIQUE) : génériques « Array&lt;string&gt; », « &lt;T&gt; », flèches « =&gt; », « < »→« &lt; », « > »→« &gt; », « & »→« &amp; » (dont &amp;&amp;). AUCUN chevron ni & brut dans un &lt;code&gt;.\n' +
        '4. STRUCTURE : intro, 5–8 sections <h2>, Pièges fréquents, Pour aller plus loin, Récap et vérification (lesson-check), Exercices (3 avec solutions).\n' +
        '5. Aucun style/script réel dans la page ; résultats/erreurs montrés en commentaire dans le code.\n\n' +
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
