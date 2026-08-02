export const meta = {
  name: 'syntaxe-python',
  description: 'Rédige les leçons Python 02 à 15 (cours complet, débutant → confirmé) et assemble le HTML',
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

const INSTRUCTIONS = `Tu rédiges une leçon du cours « Python : des bases au niveau confirmé » (site Syntaxe). Public :
DÉBUTANTS, possiblement Python comme premier langage. La leçon 1 a déjà posé : à quoi sert Python, comment l'exécuter
(interpréteur / REPL / fichier .py), print(), les commentaires (#) et le rôle de l'indentation (teaser). Du connu vers
l'inconnu, français, tutoiement, ton clair, pédagogique et concret. Python 3 MODERNE et IDIOMATIQUE (« pythonique »).

PAS D'EXÉCUTION EN DIRECT : Python ne tourne PAS dans le navigateur (le site s'ouvre en file://). N'invite donc JAMAIS
à cliquer « Tester » ou « Aperçu » (ces boutons n'existent que pour JavaScript et HTML). Pour montrer un résultat, écris-le
en COMMENTAIRE dans le code (ex. « # affiche: 42 ») ou dans un court second bloc de code « Console ». Les exemples doivent
être autonomes et donner envie de les recopier dans un interpréteur.

TU PRODUIS UNIQUEMENT { metaDesc, objectives, body } :
- metaDesc : ~150 caractères.
- objectives : 3 à 4 chaînes (« savoir faire X »), HTML inline autorisé (<code>, <strong>). «&nbsp;;» puis «.» pour la dernière.
- body : HTML INTÉRIEUR de <article class="prose"> (sans la balise article, sans bouton « terminer », sans nav).

STRUCTURE (≈1200–1700 mots) : 1–2 <p> d'intro ; 5–8 sections <h2> (chacune avec au moins un exemple de code commenté) ;
<h2>Pièges fréquents</h2> ; <h2>Pour aller plus loin</h2> ; <h2>Récap et vérification</h2> (résumé <ul> + lesson-check) ;
<h2>Exercices</h2> (3 gradués avec solutions repliables contenant du code).

COMPOSANTS (n'invente pas d'autres classes) :
- Code Python : <figure class="code-block" data-file="script.py"><pre><code class="language-python">… CODE ÉCHAPPÉ …</code></pre></figure>.
- Sortie console (optionnel) : <figure class="code-block" data-file="Console"><pre><code class="language-python">… SORTIE …</code></pre></figure>.
- Légende : <p class="code-caption">…</p>
- Note : <div class="callout callout--note">${ICON_NOTE}<div class="callout__body"><p class="callout__title">Note</p><p>…</p></div></div>
- Piège : <div class="callout callout--warn">${ICON_WARN}<div class="callout__body"><p class="callout__title">Piège fréquent</p><p>…</p></div></div>
- Astuce : <div class="callout callout--tip">${ICON_TIP}<div class="callout__body"><p class="callout__title">Astuce</p><p>…</p></div></div>
- Pour aller plus loin : <div class="callout callout--more">${ICON_MORE}<div class="callout__body"><p class="callout__title">Pour aller plus loin</p><p>…</p></div></div>
- Vérification : <div class="lesson-check"><p class="kicker kicker--gold">Vérifie ta compréhension</p><ol><li>…</li><li>…</li><li>…</li></ol></div>
- Exercice : <div class="exercise"><div class="exercise__head"><span class="exercise__num">Exercice 1</span><span class="exercise__level">Échauffement</span></div><p>…</p><details><summary>Voir une solution</summary><figure class="code-block" data-file="solution.py"><pre><code class="language-python">…</code></pre></figure></details></div>

ÉCHAPPEMENT (CRITIQUE) : DANS un <code>, « < »→« &lt; », « > »→« &gt; », « & »→« &amp; ». Donc les comparaisons
« a < b »→« a &lt; b », « x <= 10 »→« x &lt;= 10 », « n >= 0 »→« n &gt;= 0 » ; l'annotation de retour
« def f() -> int: »→« def f() -&gt; int: » ; les opérateurs d'ensembles « a & b »→« a &amp; b », « a | b » (la barre va bien).
Vérifie qu'AUCUNE comparaison ni flèche -> ne reste avec un « < » ou « > » brut dans un bloc de code.

RÈGLES : Python 3 correct et pythonique (f-strings, with open, type hints quand c'est utile, snake_case). Aucun style=,
aucun <style>, aucun <script> RÉEL dans la page (ton body = prose + blocs de code). Exemples accessibles et lisibles.`;

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
  { num: '02', modNum: '01', modName: 'Fondations', level: 'debutant', durationMin: 26, title: 'Variables et types', prereq: 'Leçon 01 recommandée',
    brief: `Sujet : stocker et nommer des données.
Sections : (1) L'affectation avec = (pas de mot-clé comme let/const ; nommage en snake_case ; une variable est une étiquette posée sur une valeur). (2) Les TYPES de base : int (entiers de taille illimitée), float, str, bool (True/False), NoneType (None). (3) type() pour inspecter, et la CONVERSION explicite (int(), float(), str(), bool()) — le « casting ». (4) Les nombres : + - * / (division qui donne toujours un float), // (division entière), % (modulo), ** (puissance), priorité des opérateurs. (5) Les chaînes : guillemets simples ou doubles, concaténation avec +, répétition avec *, longueur len(). (6) Le typage DYNAMIQUE (une variable peut changer de type) mais FORT (pas de coercition implicite : "âge " + 30 lève une TypeError). (7) input() renvoie TOUJOURS une str — il faut convertir pour calculer. Montre les sorties en commentaire (# affiche: ...).
Pièges : oublier de convertir input() avant un calcul ; additionner str et int (TypeError) ; confondre = (affectation) et == (comparaison) ; croire que / donne un entier.
Pour aller plus loin : les f-strings (leçon 9), la précision des float (0.1 + 0.2), les entiers illimités, les valeurs immuables.
Exercices : (1) demander deux nombres et afficher leur somme (avec conversion) ; (2) convertir une durée en minutes ; (3) prédire le type du résultat de quelques expressions.`,
  },
  { num: '03', modNum: '01', modName: 'Fondations', level: 'debutant', durationMin: 26, title: 'Opérateurs et expressions', prereq: 'Leçon 02 recommandée',
    brief: `Sujet : calculer, comparer et combiner des valeurs.
Sections : (1) Les opérateurs ARITHMÉTIQUES (+ - * / // % **) et la priorité (les parenthèses lèvent le doute). (2) Les opérateurs de COMPARAISON (==, !=, <, >, <=, >=) qui renvoient un bool. (3) Les opérateurs BOOLÉENS and, or, not, et le court-circuit (évaluation paresseuse). (4) Le TRUTHY/FALSY : 0, 0.0, "", [], {}, None sont « faux », le reste est « vrai ». (5) L'AFFECTATION COMPOSÉE (+=, -=, *=, //=, ...). (6) L'APPARTENANCE in / not in (sur une chaîne, une liste...). (7) L'IDENTITÉ is / is not, et le bon usage « is None » (vs ==). (8) Les COMPARAISONS CHAÎNÉES, spécifiques à Python (0 <= x < 10 est valide et lisible). Mention rapide des opérateurs bit-à-bit (&, |, ^). Montre les résultats en commentaire.
Pièges : confondre == (valeur) et is (identité), surtout pour None (toujours « is None ») ; oublier la priorité ; croire que and/or renvoient forcément un bool (ils renvoient un des opérandes) ; comparer à True explicitement (« if x == True » au lieu de « if x »).
Pour aller plus loin : l'expression ternaire (a if cond else b), match-case (3.10+), l'opérateur morse :=.
Exercices : (1) tester si une valeur est dans un intervalle avec une comparaison chaînée ; (2) écrire une expression booléenne combinée ; (3) utiliser += dans un petit cumul.`,
  },
  { num: '04', modNum: '02', modName: 'Logique & flux', level: 'debutant', durationMin: 28, title: 'Les conditions', prereq: 'Module 1 recommandé',
    brief: `Sujet : exécuter du code selon une condition.
Sections : (1) if / elif / else, et le rôle CRUCIAL de l'INDENTATION : en Python, ce sont les espaces (4 par convention) qui délimitent les blocs — pas des accolades. La ligne d'en-tête se termine par un deux-points «:». (2) Les conditions imbriquées vs la cascade elif. (3) Rappel des expressions booléennes (and / or / not, truthy/falsy) au service des conditions. (4) L'EXPRESSION TERNAIRE : « valeur_si_vrai if condition else valeur_si_faux ». (5) match / case (Python 3.10+) pour comparer une valeur à plusieurs motifs. (6) Bonnes pratiques : clauses de garde / sortie anticipée, éviter l'imbrication profonde. Montre des exemples avec la sortie en commentaire.
Pièges : oublier le deux-points «:» en fin d'en-tête ; mélanger espaces et tabulations (IndentationError / TabError) ; écrire = au lieu de == ; comparer explicitement à True/False.
Pour aller plus loin : match-case avancé (motifs, déstructuration, gardes), la lisibilité des conditions, l'opérateur morse dans un if.
Exercices : (1) attribuer une mention à une note ; (2) un petit FizzBuzz ; (3) réécrire un if/else simple en expression ternaire.`,
  },
  { num: '05', modNum: '02', modName: 'Logique & flux', level: 'debutant', durationMin: 28, title: 'Les boucles', prereq: 'Leçon 04 recommandée',
    brief: `Sujet : répéter une action.
Sections : (1) La boucle « for element in iterable » : parcourir une séquence (liste, chaîne, range). (2) range(début, fin, pas) — la BORNE DE FIN EST EXCLUE. (3) La boucle while (condition) et le risque de boucle infinie (penser à faire évoluer la condition). (4) break (sortir de la boucle) et continue (passer à l'itération suivante). (5) La clause else d'une boucle (exécutée seulement si la boucle s'est terminée SANS break) — une particularité de Python. (6) enumerate() (obtenir indice + valeur) et zip() (parcourir deux séquences en parallèle). (7) Brève mention des boucles imbriquées. Montre les sorties en commentaire.
Pièges : la fin de range exclue (erreur d'un cran, « off-by-one ») ; une boucle while qui ne se termine jamais ; modifier une liste pendant qu'on la parcourt ; gérer un index à la main au lieu d'utiliser enumerate.
Pour aller plus loin : les compréhensions (leçon 10), les générateurs (leçon 14), le module itertools.
Exercices : (1) calculer la somme des entiers de 1 à n ; (2) parcourir une liste avec enumerate ; (3) trouver le premier élément qui vérifie une condition (break + else).`,
  },
  { num: '06', modNum: '02', modName: 'Logique & flux', level: 'debutant', durationMin: 30, title: 'Les fonctions', prereq: 'Leçon 05 recommandée',
    brief: `Sujet : réutiliser de la logique.
Sections : (1) Définir : « def nom(parametres): » puis un corps indenté et return (sans return, une fonction renvoie None). (2) Les PARAMÈTRES : positionnels, par défaut (def saluer(nom, message="Bonjour")), nommés (keyword arguments) à l'appel. (3) *args (nombre variable d'arguments positionnels) et **kwargs (arguments nommés). (4) La PORTÉE (scope) : variables locales vs globales, le mot-clé global (à éviter), la règle LEGB en bref. (5) Les DOCSTRINGS (chaîne de doc en première ligne du corps) et les ANNOTATIONS DE TYPE (def aire(r: float) -> float). (6) Les fonctions sont des OBJETS de première classe (on peut les passer en argument, les renvoyer) — teaser. (7) lambda : fonction anonyme courte (mention, détaillée en leçon 14). Montre des appels et leurs résultats.
Pièges : oublier return (la fonction renvoie None) ; l'ARGUMENT PAR DÉFAUT MUTABLE (def f(x, acc=[]) — la liste est partagée entre les appels ; utiliser None puis créer la liste dans le corps) ; confondre print (afficher) et return (renvoyer) ; modifier une globale par mégarde.
Pour aller plus loin : les fonctions d'ordre supérieur (leçon 14), les décorateurs, le typage avancé (Optional, Callable).
Exercices : (1) une fonction qui calcule une moyenne ; (2) une fonction avec un paramètre par défaut ; (3) corriger le piège de l'argument par défaut mutable.`,
  },
  { num: '07', modNum: '03', modName: 'Données structurées', level: 'debutant', durationMin: 30, title: 'Listes et tuples', prereq: 'Module 2 recommandé',
    brief: `Sujet : les séquences ordonnées.
Sections : (1) La LISTE : littéral [], accès par index (commence à 0 ; index NÉGATIFS depuis la fin), len(). (2) MODIFIER (les listes sont MUTABLES) : append, insert, remove, pop, extend, del. (3) Le SLICING : « liste[début:fin:pas] » (fin exclue), et la copie « liste[:] ». (4) Parcours, test in, tri : sort() (modifie la liste en place, renvoie None) vs sorted() (renvoie une nouvelle liste), reverse(). (5) Le TUPLE : littéral (), IMMUABLE — pour des données fixes ; le DÉBALLAGE (a, b = point) et l'échange « a, b = b, a ». (6) COPIE vs RÉFÉRENCE : « b = a » partage la même liste ; copier avec [:] ou copy(). (7) Listes imbriquées. Montre les sorties en commentaire.
Pièges : index hors borne (IndexError) ; modifier une liste partagée par référence sans le vouloir ; écrire « liste = liste.sort() » (sort renvoie None) ; croire qu'un tuple est modifiable.
Pour aller plus loin : les compréhensions de liste (leçon 10), collections (deque, namedtuple), le slicing avancé et la copie profonde (copy.deepcopy).
Exercices : (1) construire et manipuler une liste (ajout/retrait/tri) ; (2) extraire une sous-liste par slicing ; (3) échanger deux variables avec un tuple.`,
  },
  { num: '08', modNum: '03', modName: 'Données structurées', level: 'debutant', durationMin: 30, title: 'Dictionnaires et ensembles', prereq: 'Leçon 07 recommandée',
    brief: `Sujet : associations clé→valeur et collections d'éléments uniques.
Sections : (1) Le DICTIONNAIRE : littéral {cle: valeur}, accès d[cle], get(cle, defaut) (évite l'erreur si absent), ajout/modification d[cle] = ..., del, test « cle in d » (porte sur les CLÉS). (2) PARCOURS : keys(), values(), items() et « for cle, valeur in d.items() ». (3) Les clés doivent être IMMUABLES (str, int, tuple — pas une liste). (4) L'ENSEMBLE (set) : créé avec set() ou {1, 2, 3} ; éléments UNIQUES et NON ORDONNÉS ; add ; opérations union « | », intersection « & », différence « - » ; déduplication d'une liste avec set(liste). (5) Choisir la bonne structure (liste vs dict vs set). (6) Dictionnaires imbriqués (mini base de données). Montre les sorties en commentaire.
Pièges : accéder à une clé absente avec [] (KeyError — préférer get) ; croire que {} crée un set (c'est un DICT vide ; un set vide, c'est set()) ; supposer un ordre pour un set ; utiliser une liste comme clé (non hachable).
Pour aller plus loin : les compréhensions de dict/set (leçon 10), collections.defaultdict et Counter, l'ordre d'insertion conservé (3.7+).
Exercices : (1) compter les occurrences de mots d'un texte ; (2) dédupliquer une liste avec un set ; (3) parcourir un dict avec items().`,
  },
  { num: '09', modNum: '03', modName: 'Données structurées', level: 'debutant', durationMin: 28, title: 'Les chaînes de caractères', prereq: 'Leçon 08 recommandée',
    brief: `Sujet : manipuler le texte.
Sections : (1) CRÉER : guillemets simples ou doubles, triples guillemets (chaînes multi-lignes), séquences d'échappement (\\n, \\t, \\\\). (2) Les chaînes sont IMMUABLES, mais indexables et sliçables comme des séquences. (3) Les MÉTHODES essentielles : upper, lower, strip, replace, split, join, startswith/endswith, find, count, isdigit/isalpha. (4) Le FORMATAGE moderne : les f-strings — f"Bonjour {nom}, tu as {age} ans" ; mention de format() et de l'ancien %. (5) Le FORMAT avancé dans une f-string : {valeur:.2f} (2 décimales), alignement/remplissage, et {expr=} (débogage). (6) Notion d'ENCODAGE (UTF-8, str vs bytes en survol). Montre les sorties en commentaire.
Pièges : vouloir modifier une chaîne « en place » (elle est immuable — les méthodes renvoient une NOUVELLE chaîne) ; oublier le « f » devant une f-string ; intervertir split et join ; mal gérer les accents/encodage.
Pour aller plus loin : les expressions régulières (module re), textwrap, str.translate, les littéraux bruts r"...".
Exercices : (1) nettoyer et normaliser une saisie (strip/lower) ; (2) composer un message avec une f-string formatée (2 décimales) ; (3) compter les mots d'une phrase avec split.`,
  },
  { num: '10', modNum: '03', modName: 'Données structurées', level: 'intermediaire', durationMin: 28, title: 'Les compréhensions', prereq: 'Leçon 09 recommandée',
    brief: `Sujet : créer des collections de façon concise et lisible.
Sections : (1) La COMPRÉHENSION DE LISTE : « [expression for element in iterable] » remplace une boucle + append. (2) Avec FILTRE : « [x for x in iterable if condition] ». (3) Avec TRANSFORMATION : « [x * 2 for x in nombres] ». (4) Les compréhensions de DICT (« {cle: val for ...} ») et de SET (« {x for ...} »). (5) Les compréhensions IMBRIQUÉES (à utiliser avec parcimonie pour rester lisible). (6) Les EXPRESSIONS GÉNÉRATRICES « (x for x in ...) » : paresseuses et économes en mémoire (teaser leçon 14). (7) Quand NE PAS en abuser : pour de simples effets de bord ou une logique complexe, une boucle classique est plus claire. Montre les sorties en commentaire.
Pièges : des compréhensions illisibles (trop imbriquées) ; les utiliser pour leurs effets de bord (mauvais usage) ; confondre {} dict et set ; oublier que c'est souvent plus rapide ET plus lisible qu'une boucle équivalente.
Pour aller plus loin : les expressions génératrices et yield (leçon 14), map/filter (leçon 14), la lisibilité selon PEP 8.
Exercices : (1) les carrés des nombres pairs d'une liste ; (2) un dict {mot: longueur} par compréhension ; (3) filtrer puis transformer en une seule compréhension.`,
  },
  { num: '11', modNum: '04', modName: 'Programmation pratique', level: 'intermediaire', durationMin: 28, title: 'Modules et bibliothèque standard', prereq: 'Module 3 recommandé',
    brief: `Sujet : réutiliser du code et profiter de la « batteries included » de Python.
Sections : (1) IMPORTER : « import module », « from module import nom », « import module as alias ». (2) Créer SON module (un simple fichier .py importable) et le rôle de « if __name__ == "__main__": » (code exécuté seulement si on lance le fichier directement). (3) La BIBLIOTHÈQUE STANDARD : math (sqrt, pi...), random (randint, choice, shuffle), datetime (dates et heures), pathlib/os (fichiers et chemins), json (sérialisation), sys. (4) Les PAQUETS TIERS et pip (et l'idée d'environnement virtuel venv — détaillé leçon 15). (5) Où trouver la documentation (docs.python.org). Montre des exemples concrets et leurs sorties.
Pièges : nommer son fichier comme un module standard (random.py masque le vrai module) ; « from module import * » qui pollue l'espace de noms ; oublier la garde « __main__ » ; confondre bibliothèque standard et paquets à installer.
Pour aller plus loin : pathlib en profondeur, collections, itertools, functools, le packaging et la distribution.
Exercices : (1) tirer un entier aléatoire et un élément d'une liste ; (2) afficher la date du jour formatée ; (3) écrire un petit module avec une garde « __main__ ».`,
  },
  { num: '12', modNum: '04', modName: 'Programmation pratique', level: 'intermediaire', durationMin: 30, title: 'Fichiers et exceptions', prereq: 'Leçon 11 recommandée',
    brief: `Sujet : lire/écrire des fichiers et gérer proprement les erreurs.
Sections : (1) OUVRIR un fichier : open(chemin, mode, encoding="utf-8") avec les modes r (lecture), w (écriture, écrase), a (ajout) ; et SURTOUT le bloc « with open(...) as f: » qui ferme automatiquement le fichier — à privilégier. (2) LIRE (read, readlines, ou itérer ligne par ligne) et ÉCRIRE (write). (3) Les chemins avec pathlib (Path). (4) Le JSON : json.dump / json.load pour persister des structures Python (dict, liste). (5) Les EXCEPTIONS : « try / except / else / finally » ; attraper un type PRÉCIS (except ValueError as e) ; lever avec raise ; définir sa propre exception (class MonErreur(Exception): pass). (6) La philosophie EAFP (« il est plus facile de demander pardon que la permission ») propre à Python. Montre des exemples et leurs sorties.
Pièges : oublier de fermer un fichier (utiliser with) ; un « except: » nu qui masque toutes les erreurs (attraper un type précis) ; un mauvais encodage ; écraser un fichier (mode w) au lieu d'ajouter (mode a).
Pour aller plus loin : le module csv, logging, les gestionnaires de contexte personnalisés (with), pickle et ses dangers.
Exercices : (1) écrire puis relire un fichier texte avec with ; (2) sauvegarder et recharger des données en JSON ; (3) gérer une saisie invalide avec try/except.`,
  },
  { num: '13', modNum: '04', modName: 'Programmation pratique', level: 'intermediaire', durationMin: 32, title: 'La programmation orientée objet', prereq: 'Leçon 12 recommandée',
    brief: `Sujet : modéliser des données ET des comportements avec des classes.
Sections : (1) POURQUOI : regrouper des données et les fonctions qui les manipulent. « class CompteBancaire: ». (2) Le CONSTRUCTEUR « __init__(self, ...) » et les ATTRIBUTS d'instance (self.solde) ; le paramètre self expliqué (l'instance courante). (3) Les MÉTHODES (def deposer(self, montant)). (4) Attributs de CLASSE vs d'INSTANCE. (5) Les méthodes spéciales « dunder » : __str__ / __repr__ (affichage lisible), __eq__, __len__... (6) L'HÉRITAGE : « class CompteEpargne(CompteBancaire): », super().__init__(...), redéfinition de méthode (polymorphisme). (7) L'ENCAPSULATION par CONVENTION : _protege (un underscore), __prive (name-mangling), et @property pour des accesseurs. Montre l'instanciation et l'usage avec sorties.
Pièges : oublier self (en paramètre de méthode ou pour accéder à un attribut) ; un attribut de CLASSE mutable partagé par toutes les instances (à mettre dans __init__) ; redéfinir sans appeler super() ; croire à une vraie privacité (ce n'est qu'une convention).
Pour aller plus loin : les dataclasses (@dataclass), @classmethod / @staticmethod, les classes abstraites (ABC), composition vs héritage.
Exercices : (1) une classe CompteBancaire (déposer/retirer) ; (2) lui ajouter une méthode __str__ ; (3) créer une sous-classe qui hérite et redéfinit une méthode.`,
  },
  { num: '14', modNum: '05', modName: 'Vers le confirmé', level: 'intermediaire', durationMin: 30, title: 'Itérateurs, générateurs & style fonctionnel', prereq: 'Module 4 recommandé',
    brief: `Sujet : itérer efficacement et adopter quelques outils fonctionnels.
Sections : (1) ITÉRABLES vs ITÉRATEURS : iter() et next(), le protocole d'itération qui se cache derrière « for ». (2) Les GÉNÉRATEURS : une fonction qui utilise yield produit ses valeurs À LA DEMANDE (paresseux, économe en mémoire) ; les expressions génératrices « (x for x in ...) ». (3) lambda : les fonctions anonymes courtes. (4) Les FONCTIONS D'ORDRE SUPÉRIEUR : map(), filter() (paresseux — les convertir en list pour voir le résultat) et sorted(key=...) ; rappel qu'une compréhension est souvent plus lisible. (5) functools (reduce, partial, lru_cache) et itertools (count, chain, combinations) en survol. (6) Le DÉBALLAGE avancé (a, *reste = ...). Montre les sorties en commentaire.
Pièges : un générateur s'ÉPUISE (on ne le reparcourt pas une 2e fois) ; abuser de lambda/map quand une compréhension serait plus claire ; oublier que map/filter sont paresseux ; un reduce illisible.
Pour aller plus loin : yield from, les coroutines et async/await, les décorateurs, le module operator.
Exercices : (1) écrire un générateur qui produit les n premiers carrés ; (2) trier une liste d'objets avec sorted(key=...) ; (3) réécrire un map/filter en compréhension.`,
  },
  { num: '15', modNum: '05', modName: 'Vers le confirmé', level: 'intermediaire', durationMin: 28, title: 'Bonnes pratiques & synthèse', prereq: 'Leçon 14 recommandée',
    brief: `Sujet : écrire du Python propre et idiomatique — et synthèse du cours.
Sections : (1) Le STYLE PEP 8 : nommage (snake_case pour variables/fonctions, PascalCase pour les classes, CONSTANTES en MAJUSCULES), 4 espaces d'indentation, longueur de ligne raisonnable, espaces autour des opérateurs — et les outils qui l'automatisent (black, ruff/flake8). (2) Les ANNOTATIONS DE TYPE (x: int, « -> str », list[int], Optional/None) et leur intérêt (lisibilité, vérification avec mypy) — tout en gardant un typage dynamique à l'exécution. (3) Les DOCSTRINGS et la documentation. (4) Les ENVIRONNEMENTS VIRTUELS (venv) et pip / requirements.txt pour isoler les dépendances d'un projet. (5) TESTER son code : assert, et les modules unittest / pytest (mention). (6) Le « Zen de Python » (import this) et l'idée d'écrire du code « pythonique ». (7) &lt;h2&gt;Et après&lt;/h2&gt; : tu as des bases solides ; pistes — un cours Python avancé (décorateurs, async, typage avancé), la data (NumPy/pandas), le web (Flask/Django), l'automatisation et les scripts. Encourage.
Remplace « Pièges fréquents » par une CHECKLIST DE QUALITÉ (à puces). GARDE « Pour aller plus loin », « Récap et vérification » et « Exercices ».
Exercices : (1) renommer des identifiants pour respecter PEP 8 ; (2) ajouter des annotations de type à une fonction ; (3) écrire 3 assertions pour tester une fonction.`,
  },
];

log('Rédaction de ' + SPECS.length + ' leçons (Python)…');

const results = await pipeline(
  SPECS,
  (s) =>
    agent(
      INSTRUCTIONS +
        '\n\n=== LEÇON À RÉDIGER ===\nNuméro : ' + s.num + ' | Module ' + s.modNum + ' (' + s.modName + ')\nTitre : ' + s.title +
        '\n\nBRIEF DÉTAILLÉ (intègre fidèlement le contenu et les exemples ; montre les sorties en commentaire ; échappe < > & dans le code) :\n' + s.brief,
      { label: 'écrit L' + s.num, phase: 'Rédaction', schema: SCHEMA }
    ),
  (parts, s) =>
    agent(
      INSTRUCTIONS +
        '\n\n=== RELECTURE CRITIQUE (corrige et renvoie la version finale, même schéma) ===\nLeçon ' + s.num + ' « ' + s.title + ' ».\n' +
        '1. EXACTITUDE du Python 3 idiomatique ; chaque exemple doit être correct et sa sortie commentée plausible.\n' +
        '2. PAS d\'invitation à « Tester »/« Aperçu » (Python ne s\'exécute pas dans le navigateur) ; les résultats sont en commentaire ou dans un bloc « Console ».\n' +
        '3. ÉCHAPPEMENT : DANS les blocs de code, « < »→« &lt; », « > »→« &gt; » (dont les comparaisons a &lt; b, x &lt;= 10 et la flèche def f() -&gt; int:), « & »→« &amp; ». Aucune balise réelle dans un &lt;code&gt;.\n' +
        '4. STRUCTURE : intro, 5–8 sections <h2>, Pièges fréquents (sauf L15 : checklist), Pour aller plus loin, Récap et vérification (lesson-check), Exercices (3 avec solutions).\n' +
        '5. Aucun style/script réel dans la page ; ton clair pour débutants.\n\n' +
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
