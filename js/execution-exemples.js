/* =============================================================================
   execution-exemples.js — les programmes proposés par le visualiseur d'exécution
   (chantier V15, point B2). Page : pages/execution.html.

   Chaque programme est court, tient à l'écran sans défilement, et a été choisi
   pour ce qu'il MONTRE quand on le déroule pas à pas — pas pour ce qu'il calcule.
   Ils sont tous dans le sous-ensemble compris par `js/interpreteur.js`, et
   `tools/verif-execution.js` VÉRIFIE que chacun s'exécute sans erreur et produit
   bien la sortie annoncée : un exemple qui casse serait la première chose que
   l'apprenant verrait.
   ============================================================================= */
(function (racine) {
  "use strict";

  var EXEMPLES = [
    {
      id: "compte",
      titre: "Une boucle et un total",
      groupe: "Pour commencer",
      resume: "Le plus simple : une variable qui change de valeur à chaque tour.",
      src: [
        "var total = 0;",
        "var notes = [12, 15, 9, 18];",
        "",
        "for (var i = 0; i < notes.length; i++) {",
        "  total = total + notes[i];",
        "}",
        "",
        "var moyenne = total / notes.length;",
        "console.log(\"total :\", total);",
        "console.log(\"moyenne :\", moyenne);"
      ].join("\n")
    },
    {
      id: "fonctions",
      titre: "Une fonction qui en appelle une autre",
      groupe: "Pour commencer",
      resume: "Regarde la pile monter de deux crans, puis redescendre.",
      src: [
        "function doubler(x) {",
        "  return x * 2;",
        "}",
        "",
        "function decrire(x) {",
        "  var d = doubler(x);",
        "  return x + \" double vaut \" + d;",
        "}",
        "",
        "console.log(decrire(7));",
        "console.log(decrire(21));"
      ].join("\n")
    },
    {
      id: "conditions",
      titre: "Des conditions imbriquées",
      groupe: "Pour commencer",
      resume: "Une seule branche est prise : les autres lignes ne s'allument jamais.",
      src: [
        "function classer(note) {",
        "  if (note >= 16) {",
        "    return \"tres bien\";",
        "  } else if (note >= 12) {",
        "    return \"bien\";",
        "  } else if (note >= 10) {",
        "    return \"passable\";",
        "  }",
        "  return \"insuffisant\";",
        "}",
        "",
        "var notes = [18, 13, 10, 4];",
        "for (var i = 0; i < notes.length; i++) {",
        "  console.log(notes[i], classer(notes[i]));",
        "}"
      ].join("\n")
    },
    {
      id: "objet",
      titre: "Un objet et ses méthodes",
      groupe: "Pour commencer",
      resume: "Le mot `this` apparaît dans la portée de la méthode : il vaut l'objet.",
      src: [
        "var panier = {",
        "  articles: [],",
        "  ajouter: function (nom, prix) {",
        "    this.articles.push({ nom: nom, prix: prix });",
        "    return this;",
        "  },",
        "  total: function () {",
        "    var s = 0;",
        "    for (var i = 0; i < this.articles.length; i++) {",
        "      s = s + this.articles[i].prix;",
        "    }",
        "    return s;",
        "  }",
        "};",
        "",
        "panier.ajouter(\"pain\", 1.2).ajouter(\"lait\", 0.9);",
        "console.log(panier.articles.length, \"articles\");",
        "console.log(\"total\", panier.total());"
      ].join("\n")
    },
    {
      id: "statistiques",
      titre: "Un programme plus long que l'écran",
      groupe: "Pour commencer",
      resume: "Assez long pour que la fenêtre de code doive défiler : la ligne courante reste visible.",
      src: [
        "var phrases = [",
        "  \"le chat dort\",",
        "  \"le chien court vite\",",
        "  \"un chat et un chien\"",
        "];",
        "",
        "var compte = {};",
        "var totalMots = 0;",
        "var plusLong = \"\";",
        "",
        "function ajouter(mot) {",
        "  if (compte[mot] === undefined) {",
        "    compte[mot] = 1;",
        "  } else {",
        "    compte[mot] = compte[mot] + 1;",
        "  }",
        "  if (mot.length > plusLong.length) {",
        "    plusLong = mot;",
        "  }",
        "}",
        "",
        "function traiter(phrase) {",
        "  var mots = phrase.split(\" \");",
        "  for (var j = 0; j < mots.length; j++) {",
        "    ajouter(mots[j]);",
        "    totalMots = totalMots + 1;",
        "  }",
        "  return mots.length;",
        "}",
        "",
        "for (var i = 0; i < phrases.length; i++) {",
        "  var n = traiter(phrases[i]);",
        "  console.log(\"phrase\", i + 1, \":\", n, \"mots\");",
        "}",
        "",
        "var distincts = Object.keys(compte);",
        "console.log(\"mots au total :\", totalMots);",
        "console.log(\"mots distincts :\", distincts.length);",
        "console.log(\"le plus long :\", plusLong);",
        "console.log(\"repetitions de 'le' :\", compte[\"le\"]);"
      ].join("\n")
    },
    {
      id: "echange",
      titre: "Échanger deux valeurs",
      groupe: "Pour commencer",
      resume: "Trois lignes, une variable temporaire : le pas à pas rend l'astuce évidente.",
      src: [
        "var a = \"gauche\";",
        "var b = \"droite\";",
        "",
        "var tmp = a;",
        "a = b;",
        "b = tmp;",
        "",
        "console.log(a, b);"
      ].join("\n")
    },

    /* ------------------------------------------------------- récursivité (B3)
       Ce que ces six programmes ont en commun : ils ne s'expliquent pas, ils se
       REGARDENT. La pile monte, puis elle redescend — et c'est le seul moment
       où l'on comprend d'où sort la valeur de retour. */
    {
      id: "recursion-somme",
      titre: "La récursivité la plus simple",
      groupe: "La récursivité",
      resume: "Un cas d'arrêt, un appel sur un problème plus petit. Rien d'autre.",
      src: [
        "function somme(t, i) {",
        "  if (i >= t.length) {",
        "    return 0;",
        "  }",
        "  return t[i] + somme(t, i + 1);",
        "}",
        "",
        "console.log(somme([4, 7, 2], 0));"
      ].join("\n")
    },
    {
      id: "factorielle",
      titre: "Factorielle : la pile monte, puis redescend",
      groupe: "La récursivité",
      resume: "Cinq cadres s'empilent avant que le moindre calcul ne se fasse.",
      src: [
        "function fact(n) {",
        "  if (n <= 1) {",
        "    return 1;",
        "  }",
        "  return n * fact(n - 1);",
        "}",
        "",
        "console.log(fact(5));"
      ].join("\n")
    },
    {
      id: "fibonacci",
      titre: "Fibonacci : le même calcul, refait encore et encore",
      groupe: "La récursivité",
      resume: "Deux appels par cadre. Le programme compte lui-même combien de fois il s'appelle.",
      src: [
        "var appels = 0;",
        "",
        "function fib(n) {",
        "  appels = appels + 1;",
        "  if (n < 2) {",
        "    return n;",
        "  }",
        "  return fib(n - 1) + fib(n - 2);",
        "}",
        "",
        "console.log(\"fib(6) =\", fib(6));",
        "console.log(\"appels :\", appels);"
      ].join("\n")
    },
    {
      id: "hanoi",
      titre: "Les tours de Hanoï",
      groupe: "La récursivité",
      resume: "Deux appels autour d'un déplacement : la pile dessine l'ordre des coups.",
      src: [
        "var coups = [];",
        "",
        "function hanoi(n, de, vers, via) {",
        "  if (n === 0) {",
        "    return;",
        "  }",
        "  hanoi(n - 1, de, via, vers);",
        "  coups.push(de + \"->\" + vers);",
        "  hanoi(n - 1, via, vers, de);",
        "}",
        "",
        "hanoi(3, \"A\", \"C\", \"B\");",
        "console.log(coups.length, \"coups\");",
        "console.log(coups.join(\" \"));"
      ].join("\n")
    },
    {
      id: "arbre",
      titre: "Parcourir un arbre",
      groupe: "La récursivité",
      resume: "La profondeur de la pile, c'est la hauteur de l'arbre.",
      src: [
        "var arbre = {",
        "  v: 8,",
        "  g: { v: 3, g: { v: 1, g: null, d: null }, d: { v: 6, g: null, d: null } },",
        "  d: { v: 10, g: null, d: { v: 14, g: null, d: null } }",
        "};",
        "",
        "var ordre = [];",
        "",
        "function infixe(n) {",
        "  if (n === null) {",
        "    return;",
        "  }",
        "  infixe(n.g);",
        "  ordre.push(n.v);",
        "  infixe(n.d);",
        "}",
        "",
        "function hauteur(n) {",
        "  if (n === null) {",
        "    return 0;",
        "  }",
        "  var g = hauteur(n.g);",
        "  var d = hauteur(n.d);",
        "  return 1 + (g > d ? g : d);",
        "}",
        "",
        "infixe(arbre);",
        "console.log(ordre.join(\" \"));",
        "console.log(\"hauteur :\", hauteur(arbre));"
      ].join("\n")
    },
    {
      id: "recursion-sans-fin",
      titre: "Quand la récursivité ne s'arrête pas",
      groupe: "La récursivité",
      resume: "Le cas d'arrêt est faux. Regarde la pile grossir jusqu'à céder.",
      /* Cet exemple DOIT échouer : c'est ce qu'il enseigne. `tools/verif-execution.js`
         exige l'erreur au lieu de la refuser (champ `erreurAttendue`). */
      erreurAttendue: "RangeError",
      src: [
        "function compter(n) {",
        "  if (n === 0) {",
        "    return \"fini\";",
        "  }",
        "  return compter(n - 2);",
        "}",
        "",
        "console.log(compter(7));"
      ].join("\n")
    }
  ];

  if (typeof module !== "undefined" && module.exports) module.exports = EXEMPLES;
  if (racine) racine.EXECUTION_EXEMPLES = EXEMPLES;
})(typeof window !== "undefined" ? window : null);
