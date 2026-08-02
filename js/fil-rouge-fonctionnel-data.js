/* =============================================================================
   fil-rouge-fonctionnel-data.js — FIL ROUGE « Un calculateur symbolique ».
   Le même projet (manipuler des expressions algébriques : évaluer, simplifier,
   dériver) ré-interprété à travers les langages fonctionnels et logique :
   Haskell → OCaml → F# → Lisp → Clojure → Elixir → Prolog.
   Définit window.FIL_ROUGE → moteur générique js/fil-rouge.js.
   Page : pages/fil-rouge-fonctionnel.html. 100 % file://.
   ============================================================================= */
window.FIL_ROUGE = {
  id: "fonctionnel",
  titre: "Un calculateur symbolique",
  sousTitre: "Évaluer, simplifier et dériver des expressions — le même projet à travers le fonctionnel et la logique.",
  intro:
    "<p>Le terrain de jeu naturel du <strong>paradigme fonctionnel</strong> : manipuler des <strong>expressions " +
    "algébriques</strong> comme des données. Tu construis un calculateur qui <strong>évalue</strong>, <strong>simplifie</strong> " +
    "(<code>x + 0 → x</code>) et <strong>dérive</strong> des expressions, puis tu le ré-implémentes dans chaque langage, " +
    "chacun apportant sa force : types algébriques, pattern matching, code-comme-donnée, concurrence, règles logiques.</p>" +
    "<p>L'expression reste une simple structure récursive (nombre, variable, addition, produit…) : c'est ta façon de la " +
    "<strong>transformer</strong> qui change à chaque étape.</p>",
  etapes: [
    {
      n: 1,
      course: "haskell",
      courseTitle: "Haskell",
      dir: "haskell",
      accent: "haskell",
      phase: "Typer & évaluer",
      titre: "Modéliser et évaluer les expressions",
      depart: "Une idée d'expressions arithmétiques (nombres, variables, opérations).",
      objectif:
        "<p>Poser les fondations en <strong>Haskell pur</strong> : un type algébrique pour les expressions et une " +
        "évaluation récursive par <em>pattern matching</em>.</p>",
      ajoute: [
        "Un <strong>type algébrique</strong> <code>Expr</code> (nombre, variable, <code>Add</code>, <code>Mul</code>…).",
        "Une fonction d'<strong>évaluation récursive</strong> (avec un environnement de variables).",
        "La gestion des <strong>erreurs</strong> avec <code>Maybe</code>/<code>Either</code> (variable inconnue, division par zéro).",
        "Des <strong>fonctions pures</strong> et des signatures de type déclarées.",
      ],
      criteres: [
        "Un type <code>data Expr = …</code> modélise les expressions.",
        "L'évaluation se fait par <strong>pattern matching récursif</strong>.",
        "Les erreurs sont gérées avec <code>Maybe</code>/<code>Either</code> (pas de crash).",
        "Les <strong>signatures de type</strong> sont présentes.",
        "Le programme <strong>compile</strong> (<code>ghc</code>) et évalue quelques expressions.",
      ],
      livrable: "Un évaluateur d'expressions typé, en Haskell.",
    },
    {
      n: 2,
      course: "ocaml",
      courseTitle: "OCaml",
      dir: "ocaml",
      accent: "ocaml",
      phase: "Typer & évaluer",
      titre: "Simplifier par réécriture",
      depart: "L'évaluateur Haskell de l'étape 1 (mêmes expressions).",
      objectif:
        "<p>Ajouter la <strong>simplification</strong> : réécrire une expression en une forme plus simple grâce au " +
        "<em>pattern matching</em> d'OCaml sur les <em>variants</em>.</p>",
      ajoute: [
        "Le type <strong>variant</strong> des expressions porté en OCaml.",
        "Une fonction <code>simplifier</code> par <strong>règles de réécriture</strong> (<code>x + 0 → x</code>, <code>x * 1 → x</code>, <code>x * 0 → 0</code>).",
        "La simplification <strong>récursive</strong> (simplifier les sous-expressions d'abord).",
        "Des cas de test couvrant les règles.",
      ],
      criteres: [
        "Un type variant (<code>type expr = …</code>) modélise les expressions.",
        "<code>simplifier</code> applique des règles par <strong>pattern matching exhaustif</strong>.",
        "La simplification est <strong>récursive</strong> (sous-expressions traitées).",
        "Les règles clés sont correctes (<code>x + 0</code> donne <code>x</code>).",
        "Le programme <strong>compile</strong> (<code>ocaml</code>) et simplifie des exemples.",
      ],
      livrable: "Un simplificateur d'expressions en OCaml.",
    },
    {
      n: 3,
      course: "fsharp",
      courseTitle: "F#",
      dir: "fsharp",
      accent: "fsharp",
      phase: "Typer & évaluer",
      titre: "Composer les transformations",
      depart: "L'évaluateur et le simplificateur (étapes 1-2).",
      objectif:
        "<p>Enchaîner les <strong>passes</strong> (analyser → simplifier → évaluer) avec l'opérateur <strong>pipe</strong> de " +
        "F#, dans un style clair et composable.</p>",
      ajoute: [
        "Les expressions modélisées par une <strong>union</strong> (et un <em>record</em> pour l'environnement).",
        "Un <strong>pipeline</strong> <code>|&gt;</code> qui enchaîne parsing, simplification et évaluation.",
        "Des <strong>fonctions composables</strong> (chaque passe est une fonction).",
        "Du <strong>pattern matching</strong> sur l'union.",
      ],
      criteres: [
        "Une <strong>union</strong> (et/ou un record) modélise les données.",
        "Un <strong>pipeline</strong> <code>|&gt;</code> enchaîne au moins deux passes.",
        "Le <strong>pattern matching</strong> est utilisé (<code>match</code>).",
        "Aucune <strong>mutation</strong> (<code>let</code>, immutabilité).",
        "Le programme <strong>s'exécute</strong> (<code>dotnet fsi</code>).",
      ],
      livrable: "Un pipeline de transformations composable, en F#.",
    },
    {
      n: 4,
      course: "lisp",
      courseTitle: "Lisp",
      dir: "lisp",
      accent: "lisp",
      phase: "Manipuler le symbolique",
      titre: "La dérivation formelle (le code est donnée)",
      depart: "Le calculateur typé des étapes 1-3.",
      objectif:
        "<p>Exploiter la force de Lisp : le <strong>code est une donnée</strong>. Représenter les expressions comme des " +
        "<strong>listes</strong> et calculer la <strong>dérivée</strong> formelle d'une expression.</p>",
      ajoute: [
        "Les expressions représentées par des <strong>listes</strong> (ex. <code>(+ x (* 2 x))</code>).",
        "Une fonction <code>deriver</code> <strong>récursive</strong> (règles de dérivation).",
        "La manipulation par <code>car</code>/<code>cdr</code> et les fonctions de première classe.",
        "(Bonus) une <strong>macro</strong> ou une simplification du résultat.",
      ],
      criteres: [
        "Les expressions sont des <strong>listes</strong> manipulées avec <code>car</code>/<code>cdr</code>.",
        "<code>deriver</code> est <strong>récursive</strong> et applique les règles (somme, produit…).",
        "Au moins une <strong>fonction de première classe</strong> est utilisée.",
        "La dérivée d'un exemple connu est <strong>correcte</strong>.",
        "Le programme <strong>s'exécute</strong> (Lisp / Scheme).",
      ],
      livrable: "Un dérivateur formel d'expressions, en Lisp.",
    },
    {
      n: 5,
      course: "clojure",
      courseTitle: "Clojure",
      dir: "clojure",
      accent: "clojure",
      phase: "Manipuler le symbolique",
      titre: "Transformer des structures immuables",
      depart: "Le calculateur symbolique des étapes 1-4.",
      objectif:
        "<p>Réécrire le cœur en <strong>Clojure</strong> : des expressions en <strong>données immuables</strong>, transformées " +
        "par les fonctions de séquence et les <em>threading macros</em>, testées au REPL.</p>",
      ajoute: [
        "Les expressions en <strong>structures immuables</strong> (vecteurs / maps).",
        "Des transformations avec <code>map</code>/<code>reduce</code>/<code>postwalk</code>.",
        "L'usage des <strong>threading macros</strong> (<code>-&gt;</code>/<code>-&gt;&gt;</code>).",
        "Une mise au point <strong>au REPL</strong>.",
      ],
      criteres: [
        "Les données sont <strong>immuables</strong> (maps/vecteurs).",
        "Les transformations utilisent <code>map</code>/<code>reduce</code> (ou <code>postwalk</code>).",
        "Au moins une <strong>threading macro</strong> est utilisée.",
        "Aucune <strong>mutation</strong> d'état (tout est pur).",
        "Le programme <strong>s'exécute</strong> (<code>clojure</code>).",
      ],
      livrable: "Le calculateur réécrit en Clojure (données immuables).",
    },
    {
      n: 6,
      course: "elixir",
      courseTitle: "Elixir",
      dir: "elixir",
      accent: "elixir",
      phase: "Paralléliser & raisonner",
      titre: "Évaluer en parallèle",
      depart: "Le calculateur immuable des étapes 1-5.",
      objectif:
        "<p>Mettre à profit la <strong>concurrence</strong> d'Elixir : évaluer un <strong>lot d'expressions</strong> en " +
        "parallèle via des processus légers, sans état partagé.</p>",
      ajoute: [
        "L'évaluation d'<strong>une expression</strong> portée en Elixir (pattern matching, pipe).",
        "L'évaluation d'un <strong>lot</strong> d'expressions en <strong>parallèle</strong> (processus / <code>Task</code>).",
        "La <strong>collecte</strong> des résultats sans état mutable.",
        "Des <strong>fonctions pures</strong> et l'immuabilité.",
      ],
      criteres: [
        "L'évaluation d'une expression utilise le <strong>pattern matching</strong>.",
        "Un lot d'expressions est évalué <strong>en parallèle</strong> (processus / <code>Task.async</code>).",
        "Les <strong>résultats</strong> sont collectés correctement.",
        "Les données restent <strong>immuables</strong> (aucune mutation).",
        "Le programme <strong>s'exécute</strong> (<code>elixir</code> / <code>iex</code>).",
      ],
      livrable: "Un évaluateur concurrent d'expressions, en Elixir.",
    },
    {
      n: 7,
      course: "prolog",
      courseTitle: "Prolog",
      dir: "prolog",
      accent: "prolog",
      phase: "Paralléliser & raisonner",
      titre: "Les règles de simplification comme logique",
      depart: "Le calculateur des étapes 1-6.",
      objectif:
        "<p>Changer de point de vue : en <strong>Prolog</strong>, les règles de simplification deviennent des " +
        "<strong>règles logiques déclaratives</strong>. Tu décris <em>quoi</em> simplifier, le moteur s'occupe du <em>comment</em>.</p>",
      ajoute: [
        "Les expressions représentées par des <strong>termes</strong> (<code>plus(x, 0)</code>, <code>fois(x, 1)</code>).",
        "Des <strong>règles de simplification</strong> (<code>simplifier(plus(X, 0), X)</code>…).",
        "Une simplification <strong>récursive</strong> des sous-termes.",
        "Des <strong>requêtes</strong> qui exploitent l'unification et le backtracking.",
      ],
      criteres: [
        "Les expressions sont des <strong>termes Prolog</strong>.",
        "Des <strong>règles</strong> décrivent les simplifications (unification).",
        "La simplification descend <strong>récursivement</strong> dans les sous-termes.",
        "Les <strong>requêtes</strong> renvoient les bonnes formes simplifiées.",
        "Le programme se <strong>charge et répond</strong> (<code>swipl</code>).",
      ],
      livrable: "🏁 Un calculateur symbolique vu de sept angles fonctionnels et logiques — du type algébrique à la règle déclarative !",
    },
  ],
};
