/* =============================================================================
   interpreteur-contre-exemples.js — LES PROGRAMMES QUI ONT PRIS L'INTERPRÉTEUR
   EN DÉFAUT (chantier V15, point B1).

   D'OÙ ILS VIENNENT
   Le premier corpus (`interpreteur-programmes.js`, 62 programmes) était vert :
   0 écart contre le vrai Node. Quatre relectures adversariales ont alors été
   lancées avec une seule consigne — PROUVER QUE L'INTERPRÉTEUR EST FAUX. Elles
   ont écrit 145 programmes et en ont trouvé 67 en écart, soit 25 causes
   racines. Un corpus vert ne prouve donc rien de plus que ce qu'il contient :
   il prouve seulement qu'on n'a pas encore cherché au bon endroit.

   POURQUOI CE FICHIER SÉPARÉ
   Ce sont les cas qui ONT cassé. Ils ne doivent plus jamais repasser. Chacun
   porte, en commentaire, la faute qu'il a révélée — pas pour l'anecdote, mais
   parce qu'un test dont on a oublié la raison finit par être « corrigé » dans
   le mauvais sens.

   LE CHAMP `limite`
   Trois familles ne sont PAS corrigées et ne le seront pas dans cet état du
   moteur : elles sont marquées `limite: true`, l'écart est ATTENDU, et l'outil
   les compte à part. Les cacher aurait été le contraire de la démarche.
   ============================================================================= */

var CONTRE_EXEMPLES = [

  /* ======================= portées, déclarations, `this` ================== */

  /* La zone morte temporelle ne protégeait que la LECTURE : une affectation
     pure passait en silence et « déverrouillait » même une `const`. */
  { nom: "ce-tdz-ecriture", src: [
    "function poser() { compteur = 5; }",
    "try { poser(); console.log(\"aucune erreur\"); }",
    "catch (e) { console.log(\"attrape\", e.name); }",
    "let compteur = 1;",
    "console.log(\"apres\", compteur);"
  ].join("\n") },

  { nom: "ce-tdz-const-ecriture", src: [
    "function poser() { C = 7; }",
    "try { poser(); console.log(\"pas d'erreur\"); } catch (e) { console.log(\"A\", e.name); }",
    "console.log(\"C =\", C);",
    "const C = 1;"
  ].join("\n") },

  /* `var x;` sans initialiseur écrasait la valeur — y compris une fonction. */
  { nom: "ce-var-sans-init", src: [
    "var x = 1;",
    "var x;",
    "console.log(\"x =\", x);",
    "function a() { return \"fn\"; }",
    "var a;",
    "console.log(\"typeof a =\", typeof a);",
    "function f() { var y = 5; var y; return y; }",
    "console.log(\"y =\", f());"
  ].join("\n") },

  { nom: "ce-var-dans-bloc", src: [
    "function f() {",
    "  var n = 1;",
    "  if (true) { var n; console.log(\"dans le if :\", n); }",
    "  return n;",
    "}",
    "console.log(\"retour :\", f());",
    "function g() {",
    "  if (false) { var jamais = 1; }",
    "  console.log(\"jamais =\", jamais, typeof jamais);",
    "}",
    "g();"
  ].join("\n") },

  /* Le pire de tous : `for (var … of …)` créait une portée par tour, donc il
     montrait le piège des fermetures À L'ENVERS — 10 20 30 au lieu de 30 30 30. */
  { nom: "ce-forof-var", src: [
    "var liste = [10, 20, 30];",
    "var fns = [];",
    "for (var v of liste) { fns.push(function () { return v; }); }",
    "console.log(\"apres la boucle v =\", v);",
    "console.log(fns[0](), fns[1](), fns[2]());"
  ].join("\n") },

  { nom: "ce-forin-var", src: [
    "var o = { a: 1, b: 2 };",
    "var fns = [];",
    "for (var k in o) { fns.push(function () { return k; }); }",
    "console.log(\"apres :\", k);",
    "console.log(fns[0](), fns[1]());"
  ].join("\n") },

  { nom: "ce-forof-let-contraste", src: [
    "var f1 = [];",
    "for (let v of [1, 2, 3]) f1.push(function () { return v; });",
    "console.log(f1[0](), f1[1](), f1[2]());",
    "var f2 = [];",
    "for (var w of [1, 2, 3]) f2.push(function () { return w; });",
    "console.log(f2[0](), f2[1](), f2[2]());"
  ].join("\n") },

  /* La liste des paramètres est sa propre portée : un défaut ne peut pas
     référencer un paramètre déclaré APRÈS lui. On attrapait la globale. */
  { nom: "ce-defaut-tdz", src: [
    "var b = 99;",
    "function f(a = b, b = 1) { return a + \":\" + b; }",
    "try { console.log(f()); } catch (e) { console.log(\"erreur\", e.name); }",
    "function g(a, b = a * 2, c = b + a) { return [a, b, c].join(\",\"); }",
    "console.log(g(3));"
  ].join("\n") },

  /* Le nom d'une expression de fonction nommée n'était lié nulle part. */
  { nom: "ce-fn-expr-nommee", src: [
    "var f = function moi(n) { if (n <= 0) return \"fini\"; return moi(n - 1); };",
    "console.log(f(3));",
    "console.log(typeof moi);"
  ].join("\n") },

  /* `call` / `apply` / `bind` n'existaient pas — dans le visualiseur de `this`. */
  { nom: "ce-call-apply-bind", src: [
    "function qui() { return this === undefined ? \"undefined\" : this.nom; }",
    "var a = { nom: \"A\" }, b = { nom: \"B\" };",
    "console.log(qui.call(a), qui.apply(b), qui.bind(a)());",
    "var lie = qui.bind(a);",
    "console.log(lie.call(b));",
    "console.log(qui());"
  ].join("\n") },

  { nom: "ce-bind-arguments-partiels", src: [
    "function f(a, b) { return this.p + a + b; }",
    "var o = { p: 10 };",
    "console.log(f.call(o, 1, 2));",
    "console.log(f.apply(o, [1, 2]));",
    "var g = f.bind(o, 1);",
    "console.log(g(2));"
  ].join("\n") },

  { nom: "ce-this-fleche-et-nue", src: [
    "var minuteur = {",
    "  nom: \"minuteur\",",
    "  lancerFleche: function () { var f = () => this.nom; return f(); },",
    "  lancerClassique: function () { var f = function () { return typeof this; }; return f(); }",
    "};",
    "console.log(minuteur.lancerFleche());",
    "console.log(minuteur.lancerClassique());",
    "console.log(typeof this);"
  ].join("\n") },

  /* ============================ opérateurs, conversions ================== */

  /* Aucun objet n'était converti : `[5] * 2` rendait NaN au lieu de 10. */
  { nom: "ce-toprimitive-tableaux", src: [
    "console.log([] * 1, [5] * 2, [3] - 1);",
    "console.log(+[], +[7], -[2]);",
    "console.log([] / 1, [10] % 3, [2] ** 3);",
    "console.log([] < 1, [2] > 1, [] == 0);",
    "console.log(({}) * 1);"
  ].join("\n") },

  { nom: "ce-egalite-lache-objets", src: [
    "console.log([] == false, [1] == 1);",
    "console.log(({}) == \"[object Object]\");",
    "console.log([1, 2] == \"1,2\", [] == \"\", [null] == \"\", [undefined] == \"\");",
    "console.log([[]] == \"\", [0] == false, [\"0\"] == false, [1] == true, [2] == true);",
    "console.log(\"\" == false, \" \\t\\n \" == 0);"
  ].join("\n") },

  { nom: "ce-comparaisons-objets", src: [
    "var d = [4];",
    "console.log(d > 3, d < 3, d >= 4, d <= 4);",
    "console.log([1, 2] < [1, 3]);",
    "console.log([10] < [9]);",
    "console.log([1] + [2] - [3]);",
    "console.log([[1]] * 2, [[]] + 1);"
  ].join("\n") },

  { nom: "ce-affect-composees-objets", src: [
    "var o = { n: 0 };",
    "o.n += [];",
    "console.log(o.n);",
    "var x = 10; var arr = [1];",
    "x -= arr;",
    "console.log(x);",
    "var y = 3;",
    "y **= [2];",
    "console.log(y);",
    "var z = { v: [4] };",
    "console.log(z.v * 2);",
    "var k = {};",
    "k[[1, 2]] = \"ok\";",
    "console.log(k[\"1,2\"]);"
  ].join("\n") },

  /* Une branche `if` entière n'était pas prise, faute d'égalité lâche juste. */
  { nom: "ce-veracite-et-branches", src: [
    "if ([]) console.log(\"[] est vrai\");",
    "if (!\"0\") console.log(\"jamais\"); else console.log(\"\\\"0\\\" est vrai\");",
    "if ([] == false) console.log(\"mais [] == false\");",
    "console.log([] ? 1 : 2, [] == true ? 3 : 4);"
  ].join("\n") },

  /* L'ordre d'évaluation d'une affectation était INVERSÉ. Effets de bord à
     l'appui : la clé doit être évaluée avant la valeur. */
  { nom: "ce-ordre-affectation", src: [
    "var e = [1, 2];",
    "var i = 0;",
    "e[i++] = e[i] + 1;",
    "console.log(e, i);",
    "var t = [10, 20];",
    "var k = 0;",
    "t[k++] = k;",
    "console.log(t, k);",
    "var u = [0, 0];",
    "var m = 0;",
    "u[m] = ++m;",
    "console.log(u, m);",
    "function idx() { console.log(\"cle evaluee\"); return 0; }",
    "function val() { console.log(\"valeur evaluee\"); return 9; }",
    "var w = [1];",
    "w[idx()] = val();",
    "console.log(w);"
  ].join("\n") },

  /* La référence était évaluée DEUX FOIS : `b[i++] += 100` écrivait dans b[1]. */
  { nom: "ce-reference-evaluee-une-fois", src: [
    "var appels = 0;",
    "function cle() { appels++; return 0; }",
    "var a = [10];",
    "a[cle()] += 5;",
    "console.log(a[0], appels);",
    "var b = [1];",
    "var i = 0;",
    "b[i++] += 100;",
    "console.log(b, i);",
    "var c = { n: 1 };",
    "function obj() { console.log(\"obj\"); return c; }",
    "obj().n += 1;",
    "console.log(c.n);"
  ].join("\n") },

  { nom: "ce-reference-incrementation", src: [
    "var n = 0;",
    "function cle() { n++; return 0; }",
    "var a = [7];",
    "a[cle()]++;",
    "console.log(a[0], n);",
    "var b = [7];",
    "var i = 0;",
    "b[i++]++;",
    "console.log(b, i);",
    "var c = { v: 1 };",
    "function g() { console.log(\"g\"); return c; }",
    "g().v++;",
    "console.log(c.v);"
  ].join("\n") },

  /* `parseInt` forçait la base 10 : « 0x1F » rendait 0 au lieu de 31. */
  { nom: "ce-parseint-base-auto", src: [
    "console.log(parseInt(\"08\"), parseInt(\"0x1F\"), parseInt(\"0X10\"));",
    "console.log(parseInt(\"  42abc\"), parseInt(\"abc\"), parseInt(\"1e3\"));",
    "console.log(parseInt(\"-0x10\"), parseInt(\"ff\", 16), parseInt(\"10\", 2));",
    "console.log(Number(\"\"), Number(\" 12 \"), Number(\"0x10\"), Number(\"12px\"));",
    "console.log(parseFloat(\"3.14abc\"), parseFloat(\".5\"));"
  ].join("\n") },

  /* `-2 ** 2` doit être REFUSÉ, pas calculé. */
  { nom: "ce-puissance-unaire-refusee", src: "console.log(-2 ** 2);" },

  { nom: "ce-object-is", src: [
    "console.log(typeof Object.is);",
    "console.log(Object.is(NaN, NaN));",
    "console.log(Object.is(0, -0));"
  ].join("\n") },

  /* ============================ objets, tableaux, chaînes ================ */

  /* Le 2e argument de sept méthodes était purement jeté. */
  { nom: "ce-indexof-depuis", src: [
    "var t = [1, NaN, 2, 1];",
    "console.log(t.indexOf(1), t.indexOf(1, 1), t.indexOf(NaN));",
    "console.log(t.includes(NaN), t.includes(3), t.lastIndexOf(1));"
  ].join("\n") },

  { nom: "ce-chaine-depuis", src: [
    "var s = \"abcabc\";",
    "console.log(s.indexOf(\"a\", 1));",
    "console.log(s.startsWith(\"b\", 1));",
    "console.log(s.endsWith(\"abc\", 3));",
    "console.log(s.includes(\"a\", 4));",
    "console.log(s.lastIndexOf(\"a\", 2));"
  ].join("\n") },

  { nom: "ce-split-limite", src: [
    "console.log(\"abc\".split(\"b\"));",
    "console.log(\"aXbXc\".split(\"X\", 2));",
    "console.log(\"a-b-c\".replace(\"-\", \"+\"), \"a-b-c\".replaceAll(\"-\", \"+\"));",
    "console.log(\"abc\".replace(\"b\", function (m) { return m.toUpperCase(); }));",
    "console.log(\"abc\".replace(\"z\", \"Z\"));"
  ].join("\n") },

  /* Le `thisArg` documenté de map/forEach/filter n'existait pas. */
  { nom: "ce-thisarg", src: [
    "class Compteur {",
    "  constructor() { this.n = 2; }",
    "  incAll(t) { var self = this; return t.map(function (v) { return v + self.n; }); }",
    "  incFleche(t) { return t.map(function (v) { return v + this.n; }, this); }",
    "}",
    "var c = new Compteur();",
    "console.log(c.incAll([1, 2]));",
    "console.log(c.incFleche([1, 2]));"
  ].join("\n") },

  /* Les TROUS d'un tableau étaient visités comme des `undefined`. */
  { nom: "ce-trous-tableau", src: [
    "var a = [1];",
    "a[3] = 4;",
    "console.log(a.length);",
    "var vus = [];",
    "a.forEach(function (v, i) { vus.push(i + \"=\" + v); });",
    "console.log(vus);",
    "console.log(a.map(function (v) { return v === undefined ? \"vide\" : v; }));",
    "console.log(a.filter(function () { return true; }));",
    "console.log(Object.keys(a));"
  ].join("\n") },

  { nom: "ce-trous-forin", src: [
    "var a = [1];",
    "a[3] = 4;",
    "var s = \"\";",
    "for (var k in a) s = s + k + \",\";",
    "console.log(s);",
    "var t = \"abc\";",
    "var u = \"\";",
    "for (var i in t) u = u + i;",
    "console.log(u);"
  ].join("\n") },

  /* `forEach` fige la longueur : un élément ajouté en cours n'est pas visité. */
  { nom: "ce-foreach-longueur-figee", src: [
    "var a = [1, 2, 3];",
    "var vus = [];",
    "a.forEach(function (v, i) { vus.push(v); if (i === 0) a.push(99); });",
    "console.log(vus, a.length);"
  ].join("\n") },

  /* « 01 » n'est pas l'indice 1 : c'est une propriété texte. */
  { nom: "ce-indice-canonique", src: [
    "var a = [1, 2, 3];",
    "console.log(a[\"01\"], a[\"1\"], a[1.0], a[\"-1\"], a[\"length\"], a[\"1.0\"]);",
    "var o = { \"01\": \"z\" };",
    "console.log(o[\"01\"], o[1]);",
    "var t = [];",
    "t[\"x\"] = 1;",
    "console.log(t.length, t.x, t);"
  ].join("\n") },

  /* `sort()` remonte les `undefined` en fin sans les comparer. */
  { nom: "ce-sort-undefined", src: [
    "console.log([10, 9, 1, 100].sort());",
    "console.log([\"banane\", \"Ananas\", \"cerise\"].sort());",
    "console.log([undefined, \"z\", \"a\"].sort());",
    "console.log([3, 1, 2].sort(function (x, y) { return x - y; }));"
  ].join("\n") },

  { nom: "ce-methodes-manquantes", src: [
    "var a = [1, 2, 3];",
    "console.log(a.at(-1));",
    "console.log(a.toString());",
    "console.log(a.findLast(function (v) { return v < 3; }));",
    "console.log([1, [2]].flatMap(function (v) { return v; }));",
    "console.log([1, 2, 3].reduceRight(function (s, v) { return s + v; }));"
  ].join("\n") },

  { nom: "ce-hasownproperty", src: [
    "var o = { a: 1, b: 2 };",
    "console.log(o.hasOwnProperty(\"a\"), o.hasOwnProperty(\"z\"));",
    "console.log(o.toString());",
    "console.log(Object.entries(o).length);"
  ].join("\n") },

  { nom: "ce-object-sur-chaine", src: [
    "console.log(Object.keys([7, 8]), Object.values([7, 8]), Object.entries([7]));",
    "console.log(Object.keys(\"ab\"));",
    "console.log(Object.assign([1, 2], [9]));",
    "console.log(Object.keys(Object.assign({}, \"ab\")));"
  ].join("\n") },

  /* `class MonErreur extends Error` : le motif des erreurs personnalisées. */
  { nom: "ce-extends-error", src: [
    "class MonErreur extends Error {",
    "  constructor(m) { super(m); this.nom2 = \"perso\"; }",
    "}",
    "try { throw new MonErreur(\"boum\"); } catch (e) { console.log(e.message, e.nom2, e.name); }",
    "var e2 = new Error(\"simple\");",
    "console.log(e2.message, e2.name);",
    "console.log(typeof e2);",
    "try { throw \"juste une chaine\"; } catch (e) { console.log(typeof e, e); }",
    "try { throw { code: 7 }; } catch (e) { console.log(e.code); }"
  ].join("\n") },

  { nom: "ce-instance-de-classe-affichee", src: [
    "class Point { constructor(x, y) { this.x = x; this.y = y; } }",
    "var p = new Point(1, 2);",
    "console.log(p);",
    "console.log([p]);",
    "console.log({ q: p });",
    "class Vide {}",
    "console.log(new Vide());"
  ].join("\n") },

  /* ================================ asynchrone =========================== */

  /* Le retard de DEUX tours de microtâche : le piège le plus cité. */
  { nom: "ce-then-retourne-promesse", src: [
    "Promise.resolve().then(function () {",
    "  console.log(\"1 A1\");",
    "  return Promise.resolve(\"x\");",
    "}).then(function () { console.log(\"A2 (tard)\"); });",
    "Promise.resolve().then(function () { console.log(\"2 B1\"); })",
    "  .then(function () { console.log(\"3 B2\"); })",
    "  .then(function () { console.log(\"4 B3\"); })",
    "  .then(function () { console.log(\"5 B4\"); })",
    "  .then(function () { console.log(\"6 B5\"); });"
  ].join("\n") },

  { nom: "ce-async-retourne-promesse", src: [
    "async function interne() { console.log(\"1 interne\"); return Promise.resolve(\"v\"); }",
    "async function externe() { var r = await interne(); console.log(\"R attendu = \" + r); }",
    "externe();",
    "Promise.resolve().then(function () { console.log(\"2 t1\"); })",
    "  .then(function () { console.log(\"3 t2\"); }).then(function () { console.log(\"4 t3\"); })",
    "  .then(function () { console.log(\"5 t4\"); }).then(function () { console.log(\"6 t5\"); });"
  ].join("\n") },

  { nom: "ce-async-en-cascade", src: [
    "async function niveau3() { return \"fond\"; }",
    "async function niveau2() { return niveau3(); }",
    "async function niveau1() { return niveau2(); }",
    "niveau1().then(function (v) { console.log(\"H = \" + v); });",
    "Promise.resolve().then(function () { console.log(\"1 H1\"); })",
    "  .then(function () { console.log(\"2 H2\"); }).then(function () { console.log(\"3 H3\"); })",
    "  .then(function () { console.log(\"4 H4\"); }).then(function () { console.log(\"5 H5\"); })",
    "  .then(function () { console.log(\"6 H6\"); }).then(function () { console.log(\"7 H7\"); })",
    "  .then(function () { console.log(\"8 H8\"); });"
  ].join("\n") },

  { nom: "ce-resolve-avec-promesse", src: [
    "var interne = new Promise(function (resolve) { resolve(\"dedans\"); });",
    "var externe = new Promise(function (resolve) {",
    "  console.log(\"1 executeur externe\");",
    "  resolve(interne);",
    "});",
    "externe.then(function (v) { console.log(\"X externe = \" + v); });",
    "Promise.resolve().then(function () { console.log(\"2 C1\"); })",
    "  .then(function () { console.log(\"3 C2\"); }).then(function () { console.log(\"4 C3\"); })",
    "  .then(function () { console.log(\"5 C4\"); }).then(function () { console.log(\"6 C5\"); });"
  ].join("\n") },

  { nom: "ce-catch-retourne-promesse", src: [
    "Promise.reject(new Error(\"un\"))",
    "  .catch(function () { console.log(\"1 catch, on renvoie une promesse\"); return Promise.resolve(\"repare\"); })",
    "  .then(function (v) { console.log(\"v = \" + v); });",
    "Promise.resolve().then(function () { console.log(\"2 F1\"); })",
    "  .then(function () { console.log(\"3 F2\"); }).then(function () { console.log(\"4 F3\"); })",
    "  .then(function () { console.log(\"5 F4\"); });"
  ].join("\n") },

  /* `.finally(f)` n'appelait jamais f : la ligne manquait à la sortie. */
  { nom: "ce-finally-tenue", src: [
    "Promise.resolve(\"valeur\")",
    "  .finally(function () { console.log(\"2 finally appele\"); })",
    "  .then(function (v) { console.log(\"3 then recoit \" + v); });",
    "console.log(\"1 sync\");"
  ].join("\n") },

  { nom: "ce-finally-rompue", src: [
    "Promise.reject(new Error(\"mauvais\"))",
    "  .finally(function () { console.log(\"2 finally sur rejet\"); })",
    "  .catch(function (e) { console.log(\"3 catch \" + e.message); });",
    "console.log(\"1 sync\");"
  ].join("\n") },

  /* Un « thenable » est traité comme une promesse. */
  { nom: "ce-thenable-dans-then", src: [
    "var thenable = {",
    "  then: function (resolve) { console.log(\"2 then du thenable appele\"); resolve(\"depuis thenable\"); }",
    "};",
    "Promise.resolve().then(function () { return thenable; })",
    "  .then(function (v) { console.log(\"v = \" + v); });",
    "Promise.resolve().then(function () { console.log(\"1 B1\"); })",
    "  .then(function () { console.log(\"3 B2\"); }).then(function () { console.log(\"4 B3\"); })",
    "  .then(function () { console.log(\"5 B4\"); });"
  ].join("\n") },

  { nom: "ce-thenable-await", src: [
    "var thenable = { then: function (res) { console.log(\"2 then du thenable\"); res(\"T\"); } };",
    "async function f() {",
    "  console.log(\"1 f debut\");",
    "  var v = await thenable;",
    "  console.log(\"v = \" + v);",
    "}",
    "f();",
    "Promise.resolve().then(function () { console.log(\"3 K1\"); })",
    "  .then(function () { console.log(\"4 K2\"); }).then(function () { console.log(\"5 K3\"); });"
  ].join("\n") },

  /* Un rejet que personne n'attrape ARRÊTE le programme. */
  { nom: "ce-rejet-non-traite", src: [
    "console.log(\"1 debut\");",
    "Promise.reject(new Error(\"personne ne m'attrape\"));",
    "setTimeout(function () { console.log(\"APRES LE REJET NON TRAITE\"); }, 0);",
    "console.log(\"2 fin du script\");"
  ].join("\n") },

  { nom: "ce-catch-trop-tard", src: [
    "var p = Promise.reject(new Error(\"tardif\"));",
    "setTimeout(function () {",
    "  console.log(\"2 on attache le catch trop tard\");",
    "  p.catch(function (e) { console.log(\"3 catch \" + e.message); });",
    "}, 0);",
    "console.log(\"1 sync\");"
  ].join("\n") },

  /* Tout délai < 1 ms est ramené à 1 ms : l'ordre d'inscription tranche. */
  { nom: "ce-delai-negatif", src: [
    "setTimeout(function (a, b) { console.log(\"2 args \" + a + \" \" + b); }, 0, \"x\", \"y\");",
    "setTimeout(function () { console.log(\"1 delai negatif\"); }, -100);",
    "console.log(\"0 sync\");"
  ].join("\n") },

  { nom: "ce-delais-quasi-nuls", src: [
    "setTimeout(function () { console.log(\"d 1\"); }, 1);",
    "setTimeout(function () { console.log(\"d 0\"); }, 0);",
    "setTimeout(function () { console.log(\"d 0.5\"); }, 0.5);",
    "setTimeout(function () { console.log(\"d rien\"); });",
    "console.log(\"0 sync\");"
  ].join("\n") },

  { nom: "ce-timeout-depuis-microtache", src: [
    "console.log(\"1 debut\");",
    "Promise.resolve()",
    "  .then(function () { console.log(\"2 a\"); setTimeout(function () { console.log(\"6 timeout depuis micro\"); }, 0); })",
    "  .then(function () { console.log(\"3 b\"); queueMicrotask(function () { console.log(\"5 micro depuis micro\"); }); })",
    "  .then(function () { console.log(\"4 c\"); });",
    "setTimeout(function () { console.log(\"7 timeout du script\"); }, 1);"
  ].join("\n") },

  /* ================= LIMITES ASSUMÉES : l'écart est ATTENDU ============== */

  /* (1) Les méthodes de conversion écrites par l'apprenant. La conversion se
     produit au milieu d'un opérateur, hors de la machine à pas : on ne peut
     pas y appeler une fonction interprétée. Le moteur REFUSE bruyamment plutôt
     que de rendre « [object Object] » en silence. */
  { nom: "limite-tostring-utilisateur", limite: "les méthodes de conversion « toString » / « valueOf » écrites par l'apprenant ne sont pas appelées : le moteur refuse la conversion au lieu de mentir", src: [
    "var o = { toString: function () { return \"OBJ\"; } };",
    "console.log(\"x\" + o);"
  ].join("\n") },

  { nom: "limite-valueof-utilisateur", limite: "idem pour « valueOf » : l'arithmétique sur un objet à conversion personnalisée est refusée", src: [
    "var v = { valueOf: function () { return 42; } };",
    "console.log(v + 1);",
    "console.log(v * 2);"
  ].join("\n") },

  /* (2) Le texte source d'une fonction. Le moteur ne conserve pas le source
     exact de chaque fonction ; il affiche une forme abrégée. */
  { nom: "limite-source-de-fonction", limite: "une fonction convertie en chaîne rend une forme abrégée, pas son texte source exact", src: [
    "function f() { return \"F\"; }",
    "console.log(f + 1);"
  ].join("\n") }
];

if (typeof module !== "undefined" && module.exports) module.exports = CONTRE_EXEMPLES;
if (typeof window !== "undefined") window.INTERPRETEUR_CONTRE_EXEMPLES = CONTRE_EXEMPLES;
