/* =============================================================================
   interpreteur-programmes.js — le CORPUS de preuve de `js/interpreteur.js`
   (chantier V15, point B1).

   Chaque entrée est un VRAI programme JavaScript. `tools/verif-interpreteur.js`
   l'exécute deux fois : une fois dans notre mini-interpréteur, une fois dans le
   VRAI Node (processus séparé), et compare les sorties ligne à ligne. Les deux
   côtés formatent avec la MÊME fonction (`Interpreteur.representer`) : un écart
   est donc toujours un écart de SÉMANTIQUE, jamais de mise en forme.

   Les programmes couvrent, dans l'ordre : les bases, le contrôle de flux, les
   fonctions et la récursivité (B3), la portée / les fermetures / `this` (B4),
   les objets, les tableaux, les classes, les erreurs, et l'asynchrone (B5).
   ============================================================================= */

var PROGRAMMES = [

  /* ---------------------------------------------------------------- bases */
  { nom: "arithmetique", src: [
    "var a = 7, b = 3;",
    "console.log(a + b, a - b, a * b, a / b, a % b, a ** b);",
    "console.log(-a, +\"12\", 1 / 3, 0.1 + 0.2);",
    "console.log((2 + 3) * 4, 2 + 3 * 4, 2 ** 3 ** 2);"
  ].join("\n") },

  { nom: "chaines", src: [
    "var s = \"Bonjour\";",
    "console.log(s.length, s.toUpperCase(), s.slice(0, 3), s.indexOf(\"jour\"));",
    "console.log(s + \" \" + \"le monde\", s.repeat(2), \"  x \".trim());",
    "console.log(s.split(\"o\"), s.charAt(1), s.includes(\"jou\"), s.padStart(9, \".\"));"
  ].join("\n") },

  { nom: "gabarits", src: [
    "var n = \"Ada\", age = 36;",
    "console.log(`Je suis ${n} et j'ai ${age} ans.`);",
    "console.log(`calcul : ${1 + 2 * 3} et ${n.toUpperCase()}`);",
    "console.log(`imbriqué : ${[1, 2].map(function (x) { return x * 2; }).join(\"-\")}`);"
  ].join("\n") },

  { nom: "comparaisons", src: [
    "console.log(1 == \"1\", 1 === \"1\", null == undefined, null === undefined);",
    "console.log(0 == false, \"\" == false, NaN === NaN, [] + 1);",
    "console.log(2 < 10, \"2\" < \"10\", true + true, !0, !!\"a\");",
    "console.log(null ?? \"defaut\", 0 ?? \"defaut\", 0 || \"defaut\", 1 && \"suite\");"
  ].join("\n") },

  { nom: "typeof", src: [
    "console.log(typeof 1, typeof \"a\", typeof true, typeof undefined);",
    "console.log(typeof null, typeof {}, typeof [], typeof function () {});",
    "console.log(typeof pasDefini);"
  ].join("\n") },

  /* -------------------------------------------------------------- contrôle */
  { nom: "conditions", src: [
    "function classer(n) {",
    "  if (n < 0) return \"negatif\";",
    "  else if (n === 0) return \"zero\";",
    "  else return \"positif\";",
    "}",
    "console.log(classer(-4), classer(0), classer(9));",
    "console.log(5 > 3 ? \"oui\" : \"non\");"
  ].join("\n") },

  { nom: "boucle-while", src: [
    "var i = 0, somme = 0;",
    "while (i < 10) { somme += i; i++; }",
    "console.log(somme, i);",
    "var j = 0;",
    "do { j += 2; } while (j < 5);",
    "console.log(j);"
  ].join("\n") },

  { nom: "boucle-for", src: [
    "var t = [];",
    "for (var i = 0; i < 5; i++) t.push(i * i);",
    "console.log(t);",
    "var s = 0;",
    "for (var k = 10; k > 0; k -= 3) s += k;",
    "console.log(s);"
  ].join("\n") },

  { nom: "break-continue", src: [
    "var vus = [];",
    "for (var i = 0; i < 10; i++) {",
    "  if (i % 2 === 0) continue;",
    "  if (i > 7) break;",
    "  vus.push(i);",
    "}",
    "console.log(vus);"
  ].join("\n") },

  { nom: "for-of-in", src: [
    "var t = [\"a\", \"b\", \"c\"];",
    "var r = [];",
    "for (var v of t) r.push(v.toUpperCase());",
    "console.log(r);",
    "var o = { x: 1, y: 2 };",
    "var cles = [];",
    "for (var k in o) cles.push(k + \"=\" + o[k]);",
    "console.log(cles);",
    "var lettres = [];",
    "for (var c of \"abc\") lettres.push(c);",
    "console.log(lettres);"
  ].join("\n") },

  { nom: "boucles-imbriquees", src: [
    "var lignes = [];",
    "for (var i = 1; i <= 3; i++) {",
    "  var ligne = [];",
    "  for (var j = 1; j <= 3; j++) ligne.push(i * j);",
    "  lignes.push(ligne.join(\" \"));",
    "}",
    "console.log(lignes);"
  ].join("\n") },

  /* ------------------------------------------------- fonctions, récursivité */
  { nom: "factorielle", src: [
    "function fact(n) {",
    "  if (n <= 1) return 1;",
    "  return n * fact(n - 1);",
    "}",
    "console.log(fact(0), fact(1), fact(5), fact(10));"
  ].join("\n") },

  { nom: "fibonacci", src: [
    "function fib(n) { return n < 2 ? n : fib(n - 1) + fib(n - 2); }",
    "var r = [];",
    "for (var i = 0; i < 12; i++) r.push(fib(i));",
    "console.log(r);"
  ].join("\n") },

  { nom: "hanoi", src: [
    "var coups = [];",
    "function hanoi(n, de, vers, via) {",
    "  if (n === 0) return;",
    "  hanoi(n - 1, de, via, vers);",
    "  coups.push(de + \"->\" + vers);",
    "  hanoi(n - 1, via, vers, de);",
    "}",
    "hanoi(3, \"A\", \"C\", \"B\");",
    "console.log(coups.length);",
    "console.log(coups.join(\", \"));"
  ].join("\n") },

  { nom: "arbre-recursif", src: [
    "var arbre = { v: 1, g: { v: 2, g: null, d: { v: 4, g: null, d: null } }, d: { v: 3, g: null, d: null } };",
    "var ordre = [];",
    "function infixe(n) {",
    "  if (!n) return;",
    "  infixe(n.g);",
    "  ordre.push(n.v);",
    "  infixe(n.d);",
    "}",
    "infixe(arbre);",
    "console.log(ordre);",
    "function profondeur(n) { return n ? 1 + Math.max(profondeur(n.g), profondeur(n.d)) : 0; }",
    "console.log(profondeur(arbre));"
  ].join("\n") },

  { nom: "parametres-defaut", src: [
    "function saluer(nom, salut) { salut = salut === undefined ? \"Bonjour\" : salut; return salut + \", \" + nom; }",
    "function bis(nom, salut = \"Salut\") { return salut + \" \" + nom; }",
    "console.log(saluer(\"Ada\"), saluer(\"Ada\", \"Coucou\"));",
    "console.log(bis(\"Ada\"), bis(\"Ada\", \"Hello\"));"
  ].join("\n") },

  { nom: "fonctions-valeurs", src: [
    "var doubler = function (x) { return x * 2; };",
    "var tripler = (x) => x * 3;",
    "function appliquer(f, v) { return f(v); }",
    "console.log(appliquer(doubler, 5), appliquer(tripler, 5));",
    "console.log([1, 2, 3].map(doubler), [1, 2, 3].map(x => x + 1));"
  ].join("\n") },

  { nom: "hoisting", src: [
    "console.log(typeof avant, typeof declaree);",
    "console.log(declaree(2));",
    "var avant = 1;",
    "function declaree(x) { return x * 10; }",
    "console.log(avant);"
  ].join("\n") },

  /* ----------------------------------------- portée, fermetures, this (B4) */
  { nom: "fermeture-compteur", src: [
    "function faireCompteur() {",
    "  var n = 0;",
    "  return function () { n++; return n; };",
    "}",
    "var c1 = faireCompteur(), c2 = faireCompteur();",
    "console.log(c1(), c1(), c1(), c2());"
  ].join("\n") },

  { nom: "fermeture-for-let-vs-var", src: [
    "var avecVar = [];",
    "for (var i = 0; i < 3; i++) avecVar.push(function () { return i; });",
    "var avecLet = [];",
    "for (let j = 0; j < 3; j++) avecLet.push(function () { return j; });",
    "console.log(avecVar[0](), avecVar[1](), avecVar[2]());",
    "console.log(avecLet[0](), avecLet[1](), avecLet[2]());"
  ].join("\n") },

  { nom: "portee-bloc", src: [
    "var x = \"global\";",
    "{",
    "  let x = \"bloc\";",
    "  console.log(x);",
    "}",
    "console.log(x);",
    "function f() { var x = \"fonction\"; return x; }",
    "console.log(f(), x);"
  ].join("\n") },

  { nom: "portee-chainee", src: [
    "var niveau = \"global\";",
    "function externe() {",
    "  var niveau2 = \"externe\";",
    "  function interne() {",
    "    var niveau3 = \"interne\";",
    "    return niveau + \"/\" + niveau2 + \"/\" + niveau3;",
    "  }",
    "  return interne();",
    "}",
    "console.log(externe());"
  ].join("\n") },

  { nom: "fermeture-banque", src: [
    "function compte(solde) {",
    "  return {",
    "    deposer: function (m) { solde += m; return solde; },",
    "    retirer: function (m) { if (m > solde) return \"refuse\"; solde -= m; return solde; },",
    "    lire: function () { return solde; }",
    "  };",
    "}",
    "var c = compte(100);",
    "console.log(c.deposer(50), c.retirer(30), c.retirer(1000), c.lire());"
  ].join("\n") },

  { nom: "this-methode", src: [
    "var obj = {",
    "  nom: \"objet\",",
    "  direNom: function () { return this.nom; },",
    "  fleche: () => typeof this",
    "};",
    "console.log(obj.direNom());",
    "var detachee = obj.direNom;",
    "console.log(typeof obj.fleche());"
  ].join("\n") },

  { nom: "this-fleche-lexical", src: [
    "var minuteur = {",
    "  nom: \"minuteur\",",
    "  lancerFleche: function () { var f = () => this.nom; return f(); },",
    "  lancerClassique: function () { var f = function () { return typeof this; }; return f(); }",
    "};",
    "console.log(minuteur.lancerFleche());",
    "console.log(minuteur.lancerClassique());"
  ].join("\n") },

  /* -------------------------------------------------------------- objets */
  { nom: "objets-base", src: [
    "var p = { nom: \"Ada\", age: 36, ville: \"Londres\" };",
    "console.log(p.nom, p[\"age\"], p.inexistant);",
    "p.metier = \"mathematicienne\";",
    "delete p.ville;",
    "console.log(Object.keys(p));",
    "console.log(Object.values(p));",
    "console.log(p);"
  ].join("\n") },

  { nom: "objets-imbriques", src: [
    "var d = { a: { b: { c: [1, 2, { d: \"fond\" }] } } };",
    "console.log(d.a.b.c[2].d);",
    "d.a.b.c.push(\"ajout\");",
    "console.log(d.a.b.c.length, d.a.b.c[3]);",
    "console.log(JSON.stringify(d));"
  ].join("\n") },

  { nom: "objets-methodes", src: [
    "var pile = {",
    "  items: [],",
    "  empiler(v) { this.items.push(v); return this; },",
    "  depiler() { return this.items.pop(); },",
    "  taille() { return this.items.length; }",
    "};",
    "pile.empiler(1).empiler(2).empiler(3);",
    "console.log(pile.taille(), pile.depiler(), pile.taille());"
  ].join("\n") },

  { nom: "object-entries", src: [
    "var notes = { maths: 15, physique: 12, francais: 17 };",
    "var e = Object.entries(notes);",
    "console.log(e);",
    "var somme = 0;",
    "for (var i = 0; i < e.length; i++) somme += e[i][1];",
    "console.log(somme, (somme / e.length).toFixed(2));",
    "console.log(Object.assign({}, notes, { anglais: 14 }));"
  ].join("\n") },

  /* ------------------------------------------------------------- tableaux */
  { nom: "tableaux-base", src: [
    "var t = [5, 3, 9, 1];",
    "console.log(t.length, t[0], t[t.length - 1], t[99]);",
    "t.push(7); t.unshift(0);",
    "console.log(t, t.indexOf(9), t.includes(42));",
    "console.log(t.slice(1, 4), t.join(\"-\"));",
    "console.log(t.reverse());"
  ].join("\n") },

  { nom: "tableaux-fonctionnel", src: [
    "var t = [1, 2, 3, 4, 5, 6];",
    "console.log(t.map(function (x) { return x * x; }));",
    "console.log(t.filter(function (x) { return x % 2 === 0; }));",
    "console.log(t.reduce(function (a, x) { return a + x; }, 0));",
    "console.log(t.reduce(function (a, x) { return a * x; }));",
    "console.log(t.find(x => x > 3), t.findIndex(x => x > 3));",
    "console.log(t.some(x => x > 5), t.every(x => x > 0));"
  ].join("\n") },

  { nom: "tableaux-tri", src: [
    "var t = [10, 9, 100, 1];",
    "console.log(t.slice().sort());",
    "console.log(t.slice().sort(function (a, b) { return a - b; }));",
    "console.log(t.slice().sort(function (a, b) { return b - a; }));",
    "var mots = [\"poire\", \"abricot\", \"cerise\"];",
    "console.log(mots.slice().sort());"
  ].join("\n") },

  { nom: "tableaux-tri-stable", src: [
    "var gens = [",
    "  { n: \"a\", g: 1 }, { n: \"b\", g: 2 }, { n: \"c\", g: 1 },",
    "  { n: \"d\", g: 2 }, { n: \"e\", g: 1 }",
    "];",
    "gens.sort(function (x, y) { return x.g - y.g; });",
    "console.log(gens.map(function (p) { return p.n; }).join(\"\"));"
  ].join("\n") },

  { nom: "matrice", src: [
    "function creer(n) {",
    "  var m = [];",
    "  for (var i = 0; i < n; i++) { var l = []; for (var j = 0; j < n; j++) l.push(i * n + j); m.push(l); }",
    "  return m;",
    "}",
    "var m = creer(3);",
    "console.log(m);",
    "var trace = 0;",
    "for (var i = 0; i < 3; i++) trace += m[i][i];",
    "console.log(trace);"
  ].join("\n") },

  { nom: "algo-tri-bulles", src: [
    "function bulles(t) {",
    "  var a = t.slice(), echanges = 0;",
    "  for (var i = 0; i < a.length; i++) {",
    "    for (var j = 0; j < a.length - 1 - i; j++) {",
    "      if (a[j] > a[j + 1]) { var tmp = a[j]; a[j] = a[j + 1]; a[j + 1] = tmp; echanges++; }",
    "    }",
    "  }",
    "  return { tri: a, echanges: echanges };",
    "}",
    "console.log(bulles([5, 2, 9, 1, 5, 6]));"
  ].join("\n") },

  { nom: "algo-recherche-binaire", src: [
    "function chercher(t, cible) {",
    "  var lo = 0, hi = t.length - 1, tours = 0;",
    "  while (lo <= hi) {",
    "    tours++;",
    "    var mi = Math.floor((lo + hi) / 2);",
    "    if (t[mi] === cible) return [mi, tours];",
    "    if (t[mi] < cible) lo = mi + 1; else hi = mi - 1;",
    "  }",
    "  return [-1, tours];",
    "}",
    "var t = [1, 3, 5, 7, 9, 11, 13, 15];",
    "console.log(chercher(t, 1), chercher(t, 15), chercher(t, 8));"
  ].join("\n") },

  { nom: "algo-euclide", src: [
    "function pgcd(a, b) { while (b !== 0) { var r = a % b; a = b; b = r; } return a; }",
    "function pgcdRec(a, b) { return b === 0 ? a : pgcdRec(b, a % b); }",
    "console.log(pgcd(48, 18), pgcd(17, 5), pgcd(270, 192));",
    "console.log(pgcdRec(48, 18), pgcdRec(270, 192));"
  ].join("\n") },

  { nom: "algo-premiers", src: [
    "function crible(n) {",
    "  var e = [], p = [];",
    "  for (var i = 0; i <= n; i++) e.push(true);",
    "  for (var i = 2; i <= n; i++) {",
    "    if (!e[i]) continue;",
    "    p.push(i);",
    "    for (var j = i * i; j <= n; j += i) e[j] = false;",
    "  }",
    "  return p;",
    "}",
    "console.log(crible(50));",
    "console.log(crible(100).length);"
  ].join("\n") },

  { nom: "algo-mots", src: [
    "var texte = \"le chat mange la souris et le chien mange le chat\";",
    "var mots = texte.split(\" \"), compte = {};",
    "for (var i = 0; i < mots.length; i++) compte[mots[i]] = (compte[mots[i]] || 0) + 1;",
    "console.log(compte);",
    "var paires = Object.entries(compte);",
    "paires.sort(function (a, b) { return b[1] - a[1]; });",
    "console.log(paires[0], paires.length);"
  ].join("\n") },

  /* ------------------------------------------------------------- classes */
  { nom: "classe-simple", src: [
    "class Point {",
    "  constructor(x, y) { this.x = x; this.y = y; }",
    "  norme() { return Math.sqrt(this.x * this.x + this.y * this.y); }",
    "  plus(a) { return new Point(this.x + a.x, this.y + a.y); }",
    "}",
    "var p = new Point(3, 4);",
    "console.log(p.x, p.y, p.norme());",
    "var q = p.plus(new Point(1, 1));",
    "console.log(q.x, q.y);"
  ].join("\n") },

  { nom: "classe-heritage", src: [
    "class Animal {",
    "  constructor(nom) { this.nom = nom; }",
    "  crier() { return this.nom + \" fait un bruit\"; }",
    "}",
    "class Chien extends Animal {",
    "  constructor(nom, race) { super(nom); this.race = race; }",
    "  crier() { return this.nom + \" aboie\"; }",
    "  presenter() { return super.crier() + \" (\" + this.race + \")\"; }",
    "}",
    "var c = new Chien(\"Rex\", \"berger\");",
    "console.log(c.crier());",
    "console.log(c.presenter());",
    "console.log(c.nom, c.race);"
  ].join("\n") },

  { nom: "constructeur-fonction", src: [
    "function Compteur(depart) { this.n = depart; }",
    "Compteur.prototype = undefined;",
    "var c = new Compteur(5);",
    "console.log(c.n);",
    "c.n = c.n + 1;",
    "console.log(c.n, typeof c);"
  ].join("\n") },

  /* -------------------------------------------------------------- erreurs */
  { nom: "try-catch", src: [
    "function risque(x) {",
    "  if (x < 0) throw new Error(\"negatif\");",
    "  return Math.sqrt(x);",
    "}",
    "try { console.log(risque(9)); } catch (e) { console.log(\"attrape\", e.message); }",
    "try { console.log(risque(-1)); } catch (e) { console.log(\"attrape\", e.message); }",
    "console.log(\"suite\");"
  ].join("\n") },

  { nom: "try-finally", src: [
    "var journal = [];",
    "function f(casser) {",
    "  try {",
    "    journal.push(\"debut\");",
    "    if (casser) throw new Error(\"boum\");",
    "    journal.push(\"fin-normale\");",
    "    return \"ok\";",
    "  } catch (e) {",
    "    journal.push(\"catch:\" + e.message);",
    "    return \"rattrape\";",
    "  } finally {",
    "    journal.push(\"finally\");",
    "  }",
    "}",
    "console.log(f(false), f(true));",
    "console.log(journal);"
  ].join("\n") },

  { nom: "erreur-personnalisee", src: [
    "function valider(age) {",
    "  if (typeof age !== \"number\") throw new TypeError(\"pas un nombre\");",
    "  if (age < 0) throw new RangeError(\"age negatif\");",
    "  return true;",
    "}",
    "var cas = [30, -1, \"x\"];",
    "for (var i = 0; i < cas.length; i++) {",
    "  try { console.log(cas[i], valider(cas[i])); }",
    "  catch (e) { console.log(cas[i], e.name, e.message); }",
    "}"
  ].join("\n") },

  /* --------------------------------------------------------- asynchrone B5 */
  { nom: "async-ordre-base", src: [
    "console.log(\"1 synchrone\");",
    "setTimeout(function () { console.log(\"4 minuteur 0 ms\"); }, 0);",
    "Promise.resolve().then(function () { console.log(\"3 microtache\"); });",
    "console.log(\"2 synchrone\");"
  ].join("\n") },

  { nom: "async-ordre-minuteurs", src: [
    "setTimeout(function () { console.log(\"c 20ms\"); }, 20);",
    "setTimeout(function () { console.log(\"a 0ms\"); }, 0);",
    "setTimeout(function () { console.log(\"b 10ms\"); }, 10);",
    "console.log(\"synchrone\");"
  ].join("\n") },

  { nom: "async-minuteurs-egaux", src: [
    "for (var i = 1; i <= 4; i++) {",
    "  (function (n) { setTimeout(function () { console.log(\"minuteur \" + n); }, 5); })(i);",
    "}",
    "console.log(\"inscrits\");"
  ].join("\n") },

  { nom: "async-microtaches-avant-macro", src: [
    "setTimeout(function () { console.log(\"macro 1\"); }, 0);",
    "Promise.resolve().then(function () { console.log(\"micro 1\"); })",
    "  .then(function () { console.log(\"micro 2\"); })",
    "  .then(function () { console.log(\"micro 3\"); });",
    "setTimeout(function () { console.log(\"macro 2\"); }, 0);",
    "console.log(\"synchrone\");"
  ].join("\n") },

  { nom: "async-chaine-promesses", src: [
    "Promise.resolve(2)",
    "  .then(function (v) { console.log(\"a\", v); return v * 3; })",
    "  .then(function (v) { console.log(\"b\", v); return v + 1; })",
    "  .then(function (v) { console.log(\"c\", v); });",
    "console.log(\"depart\");"
  ].join("\n") },

  { nom: "async-rejet", src: [
    "Promise.reject(new Error(\"casse\"))",
    "  .then(function () { console.log(\"jamais\"); })",
    "  .catch(function (e) { console.log(\"rattrape\", e.message); return \"repare\"; })",
    "  .then(function (v) { console.log(\"apres\", v); });",
    "console.log(\"synchrone\");"
  ].join("\n") },

  { nom: "async-await", src: [
    "function attendre(v) { return new Promise(function (res) { setTimeout(function () { res(v); }, 10); }); }",
    "async function principal() {",
    "  console.log(\"debut\");",
    "  var a = await attendre(1);",
    "  console.log(\"recu\", a);",
    "  var b = await attendre(a + 1);",
    "  console.log(\"recu\", b);",
    "  return a + b;",
    "}",
    "principal().then(function (t) { console.log(\"total\", t); });",
    "console.log(\"apres l'appel\");"
  ].join("\n") },

  { nom: "async-await-ordre", src: [
    "async function f() {",
    "  console.log(\"2 dans f, avant await\");",
    "  await null;",
    "  console.log(\"4 dans f, apres await\");",
    "}",
    "console.log(\"1 avant\");",
    "f();",
    "console.log(\"3 apres\");"
  ].join("\n") },

  { nom: "async-await-erreur", src: [
    "async function casse() { throw new Error(\"dedans\"); }",
    "async function principal() {",
    "  try { await casse(); }",
    "  catch (e) { console.log(\"attrape\", e.message); }",
    "  console.log(\"continue\");",
    "}",
    "principal();",
    "console.log(\"synchrone\");"
  ].join("\n") },

  { nom: "async-promise-all", src: [
    "function tard(v, ms) { return new Promise(function (r) { setTimeout(function () { r(v); }, ms); }); }",
    "Promise.all([tard(\"a\", 30), tard(\"b\", 10), tard(\"c\", 20)]).then(function (t) {",
    "  console.log(\"tous\", t);",
    "});",
    "console.log(\"lance\");"
  ].join("\n") },

  { nom: "async-executeur-synchrone", src: [
    "console.log(\"1\");",
    "var p = new Promise(function (res) {",
    "  console.log(\"2 le corps du Promise est SYNCHRONE\");",
    "  res(\"valeur\");",
    "});",
    "p.then(function (v) { console.log(\"4\", v); });",
    "console.log(\"3\");"
  ].join("\n") },

  { nom: "async-imbrique", src: [
    "setTimeout(function () {",
    "  console.log(\"macro A\");",
    "  Promise.resolve().then(function () { console.log(\"micro dans A\"); });",
    "}, 0);",
    "setTimeout(function () { console.log(\"macro B\"); }, 0);",
    "Promise.resolve().then(function () { console.log(\"micro initiale\"); });",
    "console.log(\"synchrone\");"
  ].join("\n") },

  { nom: "async-setTimeout-en-cascade", src: [
    "function etape(n) {",
    "  if (n > 3) { console.log(\"fini\"); return; }",
    "  console.log(\"etape \" + n);",
    "  setTimeout(function () { etape(n + 1); }, 5);",
    "}",
    "etape(1);",
    "console.log(\"lance\");"
  ].join("\n") },

  /* ------------------------------------------------------------- mélanges */
  { nom: "melange-inventaire", src: [
    "var stock = [",
    "  { article: \"vis\", qte: 120, prix: 0.05 },",
    "  { article: \"ecrou\", qte: 80, prix: 0.03 },",
    "  { article: \"marteau\", qte: 4, prix: 12.5 }",
    "];",
    "var total = stock.reduce(function (s, a) { return s + a.qte * a.prix; }, 0);",
    "console.log(total.toFixed(2));",
    "console.log(stock.filter(function (a) { return a.qte < 100; }).map(function (a) { return a.article; }));",
    "stock.sort(function (a, b) { return a.prix - b.prix; });",
    "console.log(stock.map(function (a) { return a.article; }));"
  ].join("\n") },

  { nom: "melange-memo", src: [
    "function memoiser(f) {",
    "  var cache = {};",
    "  var appels = 0;",
    "  var g = function (n) {",
    "    if (cache[n] !== undefined) return cache[n];",
    "    appels++;",
    "    var v = f(n);",
    "    cache[n] = v;",
    "    return v;",
    "  };",
    "  g.appels = function () { return appels; };",
    "  return g;",
    "}",
    "var carre = memoiser(function (n) { return n * n; });",
    "console.log(carre(4), carre(4), carre(5));",
    "console.log(carre.appels());"
  ].join("\n") },

  { nom: "melange-json", src: [
    "var o = { nom: \"Ada\", tags: [\"maths\", \"machine\"], actif: true, note: null };",
    "var s = JSON.stringify(o);",
    "console.log(s);",
    "var r = JSON.parse(s);",
    "console.log(r.nom, r.tags[1], r.actif, r.note);",
    "console.log(JSON.stringify([1, \"a\", null]));"
  ].join("\n") },

  { nom: "melange-etat-machine", src: [
    "var transitions = { repos: { demarrer: \"marche\" }, marche: { pause: \"suspendu\", arreter: \"repos\" }, suspendu: { reprendre: \"marche\" } };",
    "var etat = \"repos\", journal = [];",
    "var evenements = [\"demarrer\", \"pause\", \"demarrer\", \"reprendre\", \"arreter\"];",
    "for (var i = 0; i < evenements.length; i++) {",
    "  var suivant = transitions[etat][evenements[i]];",
    "  if (suivant === undefined) { journal.push(evenements[i] + \" IGNORE (\" + etat + \")\"); continue; }",
    "  journal.push(etat + \" -\" + evenements[i] + \"-> \" + suivant);",
    "  etat = suivant;",
    "}",
    "console.log(journal);",
    "console.log(etat);"
  ].join("\n") }
];

if (typeof module !== "undefined" && module.exports) module.exports = PROGRAMMES;
if (typeof window !== "undefined") window.INTERPRETEUR_PROGRAMMES = PROGRAMMES;
