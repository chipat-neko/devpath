/* =============================================================================
   defis-data.js — Banque de défis de code (P5). Chaque défi : une fonction à
   écrire en JavaScript, vérifiée par des cas de test (auto-correction dans un
   Web Worker isolé — voir js/defis.js). 100 % file:// (JavaScript).
   Format : { id, titre, niveau, enonce(HTML), fn(nom), depart(code), tests[] }.
   ============================================================================= */
window.DEFIS = [
  {
    id: "inverse",
    titre: "Inverser une chaîne",
    niveau: "Échauffement",
    enonce:
      "Écris une fonction <code>inverse(s)</code> qui renvoie la chaîne <code>s</code> à l'envers.<br>Exemple : <code>inverse(\"abc\")</code> renvoie <code>\"cba\"</code>.",
    fn: "inverse",
    depart: "function inverse(s) {\n  // ton code ici\n  \n}",
    tests: [
      { args: ["abc"], expect: "cba" },
      { args: ["Syntaxe"], expect: "exatnyS" },
      { args: [""], expect: "" },
    ],
  },
  {
    id: "somme",
    titre: "Somme d'un tableau",
    niveau: "Échauffement",
    enonce:
      "Écris une fonction <code>somme(arr)</code> qui renvoie la somme des nombres du tableau <code>arr</code>.<br>Exemple : <code>somme([1, 2, 3])</code> renvoie <code>6</code>. Le tableau vide renvoie <code>0</code>.",
    fn: "somme",
    depart: "function somme(arr) {\n  \n}",
    tests: [
      { args: [[1, 2, 3]], expect: 6 },
      { args: [[10, -4, 2]], expect: 8 },
      { args: [[]], expect: 0 },
    ],
  },
  {
    id: "maxi",
    titre: "Le maximum",
    niveau: "Échauffement",
    enonce:
      "Écris une fonction <code>maxi(arr)</code> qui renvoie le plus grand nombre du tableau.<br>Exemple : <code>maxi([3, 7, 2])</code> renvoie <code>7</code>.",
    fn: "maxi",
    depart: "function maxi(arr) {\n  \n}",
    tests: [
      { args: [[3, 7, 2]], expect: 7 },
      { args: [[-5, -1, -9]], expect: -1 },
      { args: [[42]], expect: 42 },
    ],
  },
  {
    id: "pairs",
    titre: "Garder les nombres pairs",
    niveau: "Application",
    enonce:
      "Écris une fonction <code>pairs(arr)</code> qui renvoie un nouveau tableau avec seulement les nombres pairs.<br>Exemple : <code>pairs([1, 2, 3, 4])</code> renvoie <code>[2, 4]</code>.",
    fn: "pairs",
    depart: "function pairs(arr) {\n  \n}",
    tests: [
      { args: [[1, 2, 3, 4]], expect: [2, 4] },
      { args: [[7, 9, 11]], expect: [] },
      { args: [[0, 6, 8]], expect: [0, 6, 8] },
    ],
  },
  {
    id: "voyelles",
    titre: "Compter les voyelles",
    niveau: "Application",
    enonce:
      "Écris une fonction <code>voyelles(s)</code> qui renvoie le nombre de voyelles (a, e, i, o, u, y) dans la chaîne, sans tenir compte de la casse.<br>Exemple : <code>voyelles(\"Bonjour\")</code> renvoie <code>3</code>.",
    fn: "voyelles",
    depart: "function voyelles(s) {\n  \n}",
    tests: [
      { args: ["Bonjour"], expect: 3 },
      { args: ["XYZ"], expect: 1 },
      { args: ["aeiouy"], expect: 6 },
    ],
  },
  {
    id: "palindrome",
    titre: "Palindrome ?",
    niveau: "Application",
    enonce:
      "Écris une fonction <code>estPalindrome(s)</code> qui renvoie <code>true</code> si la chaîne se lit pareil à l'endroit et à l'envers, sinon <code>false</code>.<br>Exemple : <code>estPalindrome(\"kayak\")</code> renvoie <code>true</code>.",
    fn: "estPalindrome",
    depart: "function estPalindrome(s) {\n  \n}",
    tests: [
      { args: ["kayak"], expect: true },
      { args: ["radar"], expect: true },
      { args: ["syntaxe"], expect: false },
    ],
  },
  {
    id: "capitaliser",
    titre: "Mettre la première lettre en majuscule",
    niveau: "Application",
    enonce:
      "Écris une fonction <code>capitaliser(s)</code> qui renvoie la chaîne avec sa première lettre en majuscule et le reste inchangé.<br>Exemple : <code>capitaliser(\"bonjour\")</code> renvoie <code>\"Bonjour\"</code>.",
    fn: "capitaliser",
    depart: "function capitaliser(s) {\n  \n}",
    tests: [
      { args: ["bonjour"], expect: "Bonjour" },
      { args: ["a"], expect: "A" },
      { args: [""], expect: "" },
    ],
  },
  {
    id: "sansDoublons",
    titre: "Supprimer les doublons",
    niveau: "Défi",
    enonce:
      "Écris une fonction <code>sansDoublons(arr)</code> qui renvoie un tableau sans doublons, en gardant l'ordre d'apparition.<br>Exemple : <code>sansDoublons([1, 2, 2, 3, 1])</code> renvoie <code>[1, 2, 3]</code>.",
    fn: "sansDoublons",
    depart: "function sansDoublons(arr) {\n  \n}",
    tests: [
      { args: [[1, 2, 2, 3, 1]], expect: [1, 2, 3] },
      { args: [["a", "a", "b"]], expect: ["a", "b"] },
      { args: [[]], expect: [] },
    ],
  },
  {
    id: "fizzbuzz",
    titre: "FizzBuzz",
    niveau: "Défi",
    enonce:
      "Écris une fonction <code>fizzbuzz(n)</code> qui renvoie <code>\"Fizz\"</code> si <code>n</code> est multiple de 3, <code>\"Buzz\"</code> s'il est multiple de 5, <code>\"FizzBuzz\"</code> s'il est multiple des deux, sinon le nombre <strong>sous forme de chaîne</strong>.<br>Exemple : <code>fizzbuzz(15)</code> renvoie <code>\"FizzBuzz\"</code>, <code>fizzbuzz(7)</code> renvoie <code>\"7\"</code>.",
    fn: "fizzbuzz",
    depart: "function fizzbuzz(n) {\n  \n}",
    tests: [
      { args: [3], expect: "Fizz" },
      { args: [5], expect: "Buzz" },
      { args: [15], expect: "FizzBuzz" },
      { args: [7], expect: "7" },
    ],
  },
  {
    id: "factorielle",
    titre: "Factorielle",
    niveau: "Défi",
    enonce:
      "Écris une fonction <code>factorielle(n)</code> qui renvoie la factorielle de <code>n</code> (le produit de tous les entiers de 1 à <code>n</code>). Par convention <code>factorielle(0)</code> vaut <code>1</code>.<br>Exemple : <code>factorielle(5)</code> renvoie <code>120</code>.",
    fn: "factorielle",
    depart: "function factorielle(n) {\n  \n}",
    tests: [
      { args: [5], expect: 120 },
      { args: [0], expect: 1 },
      { args: [1], expect: 1 },
      { args: [6], expect: 720 },
    ],
  },
  {
    id: "compterMots",
    titre: "Compter les mots",
    niveau: "Échauffement",
    enonce:
      "Écris une fonction <code>compterMots(s)</code> qui renvoie le nombre de mots de la chaîne, quel que soit le nombre d'espaces qui les séparent.<br>Exemple : <code>compterMots(\"bonjour le monde\")</code> renvoie <code>3</code>. La chaîne vide renvoie <code>0</code>.",
    fn: "compterMots",
    depart: "function compterMots(s) {\n  \n}",
    tests: [
      { args: ["bonjour le monde"], expect: 3 },
      { args: [""], expect: 0 },
      { args: ["  espaces  multiples  "], expect: 2 },
      { args: ["seul"], expect: 1 },
    ],
  },
  {
    id: "moyenne",
    titre: "La moyenne",
    niveau: "Échauffement",
    enonce:
      "Écris une fonction <code>moyenne(arr)</code> qui renvoie la moyenne des nombres du tableau.<br>Exemple : <code>moyenne([2, 4, 6])</code> renvoie <code>4</code>. Le tableau vide renvoie <code>0</code>.",
    fn: "moyenne",
    depart: "function moyenne(arr) {\n  \n}",
    tests: [
      { args: [[2, 4, 6]], expect: 4 },
      { args: [[10]], expect: 10 },
      { args: [[]], expect: 0 },
      { args: [[1, 2]], expect: 1.5 },
    ],
  },
  {
    id: "sommeChiffres",
    titre: "Somme des chiffres",
    niveau: "Échauffement",
    enonce:
      "Écris une fonction <code>sommeChiffres(n)</code> qui renvoie la somme des chiffres de l'entier positif <code>n</code>.<br>Exemple : <code>sommeChiffres(123)</code> renvoie <code>6</code>.",
    fn: "sommeChiffres",
    depart: "function sommeChiffres(n) {\n  \n}",
    tests: [
      { args: [123], expect: 6 },
      { args: [0], expect: 0 },
      { args: [9999], expect: 36 },
      { args: [10], expect: 1 },
    ],
  },
  {
    id: "celsius",
    titre: "Celsius vers Fahrenheit",
    niveau: "Échauffement",
    enonce:
      "Écris une fonction <code>celsius(c)</code> qui convertit une température en degrés Celsius vers des degrés Fahrenheit, avec la formule <code>c × 9 / 5 + 32</code>.<br>Exemple : <code>celsius(100)</code> renvoie <code>212</code>.",
    fn: "celsius",
    depart: "function celsius(c) {\n  \n}",
    tests: [
      { args: [0], expect: 32 },
      { args: [100], expect: 212 },
      { args: [-40], expect: -40 },
      { args: [20], expect: 68 },
      { args: [25], expect: 77 },
    ],
  },
  {
    id: "minMax",
    titre: "Minimum et maximum",
    niveau: "Application",
    enonce:
      "Écris une fonction <code>minMax(arr)</code> qui renvoie un tableau <code>[min, max]</code> contenant le plus petit et le plus grand nombre.<br>Exemple : <code>minMax([3, 1, 2])</code> renvoie <code>[1, 3]</code>.",
    fn: "minMax",
    depart: "function minMax(arr) {\n  \n}",
    tests: [
      { args: [[3, 1, 2]], expect: [1, 3] },
      { args: [[5]], expect: [5, 5] },
      { args: [[-1, -9, 0]], expect: [-9, 0] },
    ],
  },
  {
    id: "titreCasse",
    titre: "Mettre chaque mot en capitale",
    niveau: "Application",
    enonce:
      "Écris une fonction <code>titreCasse(s)</code> qui met la première lettre de chaque mot en majuscule.<br>Exemple : <code>titreCasse(\"bonjour le monde\")</code> renvoie <code>\"Bonjour Le Monde\"</code>.",
    fn: "titreCasse",
    depart: "function titreCasse(s) {\n  \n}",
    tests: [
      { args: ["bonjour le monde"], expect: "Bonjour Le Monde" },
      { args: ["a b"], expect: "A B" },
      { args: [""], expect: "" },
    ],
  },
  {
    id: "inverserMots",
    titre: "Inverser l'ordre des mots",
    niveau: "Application",
    enonce:
      "Écris une fonction <code>inverserMots(s)</code> qui renvoie la phrase avec les mots dans l'ordre inverse.<br>Exemple : <code>inverserMots(\"un deux trois\")</code> renvoie <code>\"trois deux un\"</code>.",
    fn: "inverserMots",
    depart: "function inverserMots(s) {\n  \n}",
    tests: [
      { args: ["un deux trois"], expect: "trois deux un" },
      { args: ["seul"], expect: "seul" },
      { args: ["a b"], expect: "b a" },
    ],
  },
  {
    id: "compterOccurrences",
    titre: "Compter les occurrences",
    niveau: "Application",
    enonce:
      "Écris une fonction <code>compterOccurrences(arr, x)</code> qui renvoie le nombre de fois que <code>x</code> apparaît dans le tableau <code>arr</code>.<br>Exemple : <code>compterOccurrences([1, 2, 2, 3], 2)</code> renvoie <code>2</code>.",
    fn: "compterOccurrences",
    depart: "function compterOccurrences(arr, x) {\n  \n}",
    tests: [
      { args: [[1, 2, 2, 3], 2], expect: 2 },
      { args: [["a", "b"], "c"], expect: 0 },
      { args: [[5, 5, 5], 5], expect: 3 },
    ],
  },
  {
    id: "estPremier",
    titre: "Nombre premier ?",
    niveau: "Défi",
    enonce:
      "Écris une fonction <code>estPremier(n)</code> qui renvoie <code>true</code> si <code>n</code> est un nombre premier, sinon <code>false</code>. Rappel : 1 n'est pas premier.<br>Exemple : <code>estPremier(7)</code> renvoie <code>true</code>.",
    fn: "estPremier",
    depart: "function estPremier(n) {\n  \n}",
    tests: [
      { args: [2], expect: true },
      { args: [3], expect: true },
      { args: [4], expect: false },
      { args: [1], expect: false },
      { args: [13], expect: true },
      { args: [9], expect: false },
    ],
  },
  {
    id: "estAnagramme",
    titre: "Anagramme ?",
    niveau: "Défi",
    enonce:
      "Écris une fonction <code>estAnagramme(a, b)</code> qui renvoie <code>true</code> si les deux mots contiennent exactement les mêmes lettres.<br>Exemple : <code>estAnagramme(\"chien\", \"niche\")</code> renvoie <code>true</code>.",
    fn: "estAnagramme",
    depart: "function estAnagramme(a, b) {\n  \n}",
    tests: [
      { args: ["chien", "niche"], expect: true },
      { args: ["abc", "cab"], expect: true },
      { args: ["abc", "abd"], expect: false },
      { args: ["a", "aa"], expect: false },
    ],
  },
  {
    id: "fibonacci",
    titre: "Suite de Fibonacci",
    niveau: "Défi",
    enonce:
      "Écris une fonction <code>fibonacci(n)</code> qui renvoie le <code>n</code>-ième terme de la suite de Fibonacci, avec <code>fibonacci(0) = 0</code> et <code>fibonacci(1) = 1</code>.<br>Exemple : <code>fibonacci(7)</code> renvoie <code>13</code>.",
    fn: "fibonacci",
    depart: "function fibonacci(n) {\n  \n}",
    tests: [
      { args: [0], expect: 0 },
      { args: [1], expect: 1 },
      { args: [7], expect: 13 },
      { args: [10], expect: 55 },
    ],
  },
  {
    id: "estBissextile",
    titre: "Année bissextile ?",
    niveau: "Défi",
    enonce:
      "Écris une fonction <code>estBissextile(annee)</code> qui renvoie <code>true</code> si l'année est bissextile : divisible par 4, sauf les années divisibles par 100 qui ne le sont que si elles le sont aussi par 400.<br>Exemple : <code>estBissextile(2000)</code> renvoie <code>true</code>, <code>estBissextile(1900)</code> renvoie <code>false</code>.",
    fn: "estBissextile",
    depart: "function estBissextile(annee) {\n  \n}",
    tests: [
      { args: [2000], expect: true },
      { args: [1900], expect: false },
      { args: [2024], expect: true },
      { args: [2023], expect: false },
    ],
  },
  {
    id: "pgcd",
    titre: "Le plus grand commun diviseur",
    niveau: "Défi",
    enonce:
      "Écris une fonction <code>pgcd(a, b)</code> qui renvoie le plus grand commun diviseur de deux entiers positifs (algorithme d'Euclide).<br>Exemple : <code>pgcd(12, 8)</code> renvoie <code>4</code>.",
    fn: "pgcd",
    depart: "function pgcd(a, b) {\n  \n}",
    tests: [
      { args: [12, 8], expect: 4 },
      { args: [17, 5], expect: 1 },
      { args: [100, 10], expect: 10 },
      { args: [7, 7], expect: 7 },
    ],
  },
];
