/* Le corpus de la leçon 04 du cours « doc » : des réponses de forum DATÉES,
   et leur verdict d'aujourd'hui — CALCULÉ par exécution, jamais déclaré.

   ⚠ LICENCE. Aucune de ces réponses n'est recopiée. Elles sont écrites pour
   l'occasion, dans la forme et l'anglais d'une réponse de forum de l'époque
   indiquée, et la leçon le dit. Ce qui est réel, c'est le CODE qu'elles
   conseillent — celui-là circule depuis quinze ans — et surtout le verdict,
   qui sort d'une exécution dans le moteur d'aujourd'hui.

   COMMENT LE VERDICT EST CALCULÉ. Chaque conseil porte jusqu'à cinq sondes,
   chacune une expression JavaScript qui doit rendre `true` :
     marche      — le code de l'époque produit-il ENCORE ce que la réponse promet ?
     jamais      — le code produit-il, dès l'origine, autre chose que ce que la
                   réponse promet ? Une sonde vraie ici accuse la réponse.
     contre      — existe-t-il une entrée sur laquelle le conseil donne le
                   MAUVAIS résultat ?
     remplacant  — le langage offre-t-il aujourd'hui une forme standard qui fait
                   la même chose en mieux ?
     raisonMorte — la RAISON invoquée par la réponse a-t-elle disparu, alors que
                   le conseil, lui, tient toujours ?
   Le verdict est déduit de ces booléens dans cet ordre, par verdictDe().
   Aucune entrée ne porte son verdict en dur : le tableau publié par la leçon
   est le résultat de l'exécution, et il change si le moteur change. */
'use strict';
const vm = require('vm');

const CONSEILS = [
  {
    id: 'arguments-slice',
    annee: 2010,
    question: 'How do I turn `arguments` into a real array?',
    reponse: 'Just use Array.prototype.slice.call(arguments). `arguments` is array-like but has no array methods, so borrow them from Array.prototype.',
    code: 'var args = Array.prototype.slice.call(arguments);',
    marche: '(function () { return Array.prototype.slice.call(arguments).join("-"); })(1, 2, 3) === "1-2-3"',
    remplacant: { nom: '(...args) => args', sonde: '((...a) => a.join("-"))(1, 2, 3) === "1-2-3"' },
    contre: {
      /* ⚠ Ce contre-exemple a été écrit deux fois. Le premier annonçait qu’une
         fonction fléchée lève une ReferenceError sur `arguments` : la sonde a
         rendu false, et le garde-fou a refusé la mesure. La vérité est pire —
         la fléchée HÉRITE du `arguments` de la fonction englobante, donc le
         conseil rend silencieusement les mauvais arguments. */
      quoi: 'une fonction fléchée n’a pas son propre <code>arguments</code> : elle prend celui de la fonction englobante, et le conseil rend <strong>silencieusement</strong> les mauvais arguments',
      sonde: '(function () { var f = () => Array.prototype.slice.call(arguments); return f(9).join("-") === "1-2"; })(1, 2)',
    },
  },
  {
    id: 'parseint-radix',
    annee: 2009,
    question: 'Why does parseInt("08") return 0?',
    reponse: 'Always pass the radix: parseInt(s, 10). Without it, a leading zero makes the string be parsed as octal, so "08" is invalid and you get 0.',
    code: 'parseInt(s, 10)',
    marche: 'parseInt("08", 10) === 8',
    raisonMorte: {
      texte: 'plus aucun moteur ne lit «&nbsp;08&nbsp;» en octal — la raison invoquée par la réponse a disparu avec ES5',
      sonde: 'parseInt("08") === 8',
    },
    autreRaison: {
      texte: 'le conseil reste bon, mais pour une AUTRE raison : le préfixe <code>0x</code>, lui, est toujours lu en hexadécimal',
      sonde: 'parseInt("0x10") === 16 && parseInt("0x10", 10) === 0',
    },
  },
  {
    id: 'typeof-undefined',
    annee: 2009,
    question: 'How do I check whether a variable is defined?',
    reponse: 'Use typeof x === "undefined". Comparing x === undefined throws if the variable was never declared at all.',
    code: 'if (typeof x === "undefined") { /* … */ }',
    marche: '(function () { return typeof pasDeclareeDuTout === "undefined"; })()',
  },
  {
    id: 'substr',
    annee: 2011,
    question: 'How do I take the first three characters of a string?',
    reponse: 'Use s.substr(0, 3). The second argument is the LENGTH you want, which is usually what you mean.',
    code: 's.substr(0, 3)',
    marche: '"documentation".substr(0, 3) === "doc"',
    remplacant: { nom: 's.slice(0, 3)', sonde: '"documentation".slice(0, 3) === "doc"' },
    contre: {
      quoi: 'traduire mécaniquement <code>substr(a, b)</code> en <code>slice(a, b)</code> change le résultat : le second argument n’est pas la même chose',
      sonde: '"documentation".substr(4, 5) !== "documentation".slice(4, 5)',
    },
  },
  {
    id: 'escape-url',
    annee: 2010,
    question: 'How do I escape a string before putting it in a URL?',
    reponse: 'Call escape(s). It replaces every character that is unsafe in a URL with a percent sequence.',
    code: 'escape(s)',
    marche: 'escape("a b") === "a%20b"',
    contre: {
      quoi: '<code>escape()</code> n’encode pas l’UTF-8 : un «&nbsp;é&nbsp;» sort en <code>%E9</code>, séquence qu’aucun serveur moderne ne sait relire',
      sonde: 'escape("é") === "%E9" && encodeURIComponent("é") === "%C3%A9"',
    },
    remplacant: { nom: 'encodeURIComponent(s)', sonde: 'encodeURIComponent("a b") === "a%20b"' },
  },
  {
    id: 'indexof-contains',
    annee: 2010,
    question: 'How do I check if an array contains a value?',
    reponse: 'Use arr.indexOf(x) !== -1. It returns the position of the value, or -1 when the value is not there.',
    code: 'if (arr.indexOf(x) !== -1) { /* … */ }',
    marche: '[1, 2, 3].indexOf(2) !== -1',
    contre: {
      quoi: '<code>indexOf</code> compare avec <code>===</code>, et <code>NaN !== NaN</code> : un tableau qui contient <code>NaN</code> est déclaré ne pas le contenir',
      sonde: '[NaN].indexOf(NaN) === -1 && [NaN].includes(NaN) === true',
    },
    remplacant: { nom: 'arr.includes(x)', sonde: '[1, 2, 3].includes(2) === true' },
  },
  {
    id: 'isnan',
    annee: 2011,
    question: 'How do I test whether a value is not a number?',
    reponse: 'Use the global isNaN(x). It returns true exactly when the value is not a number.',
    code: 'if (isNaN(x)) { /* … */ }',
    marche: 'isNaN(NaN) === true',
    jamais: {
      quoi: '<code>isNaN()</code> convertit son argument avant de comparer : elle répond «&nbsp;true&nbsp;» pour une chaîne qui n’est pas <code>NaN</code> du tout',
      sonde: 'isNaN("bonjour") === true && Number.isNaN("bonjour") === false',
    },
    remplacant: { nom: 'Number.isNaN(x)', sonde: 'Number.isNaN(NaN) === true' },
  },
  {
    id: 'iife-boucle',
    annee: 2010,
    question: 'Why do all my setTimeout callbacks print the same number?',
    reponse: 'Wrap the body in an immediately-invoked function so each iteration gets its own copy of i: (function (i) { … })(i).',
    code: 'for (var i = 0; i &lt; 3; i++) (function (i) { … })(i);',
    marche: '(function () { var r = []; for (var i = 0; i < 3; i++) { (function (i) { r.push(function () { return i; }); })(i); } return r.map(function (f) { return f(); }).join("") === "012"; })()',
    remplacant: { nom: 'for (let i = 0; …)', sonde: '(function () { var r = []; for (let i = 0; i < 3; i++) { r.push(function () { return i; }); } return r.map(function (f) { return f(); }).join("") === "012"; })()' },
  },
  {
    id: 'clone-json',
    annee: 2012,
    question: 'What is the shortest way to deep-copy an object?',
    reponse: 'One line: JSON.parse(JSON.stringify(obj)). It walks the whole object and gives you a copy that shares nothing with the original.',
    code: 'var copie = JSON.parse(JSON.stringify(obj));',
    marche: '(function () { var o = { a: { b: 1 } }; var c = JSON.parse(JSON.stringify(o)); c.a.b = 2; return o.a.b === 1; })()',
    contre: {
      quoi: 'la copie n’est pas fidèle : une clé valant <code>undefined</code> disparaît, une date devient une chaîne, <code>NaN</code> devient <code>null</code>, et un cycle lève une erreur',
      sonde: '(function () { var o = { d: new Date(0), u: undefined, n: NaN }; var c = JSON.parse(JSON.stringify(o)); return typeof c.d === "string" && !("u" in c) && c.n === null; })()',
    },
  },
  {
    id: 'new-array',
    annee: 2009,
    question: 'How do I create an array of n elements?',
    reponse: 'Write new Array(n). You get an array of length n that you can then fill with map.',
    code: 'new Array(3).map(function () { return 0; })',
    marche: 'new Array(3).length === 3',
    jamais: {
      quoi: 'les cases sont des TROUS, pas des <code>undefined</code> : <code>map</code>, <code>forEach</code> et <code>filter</code> les sautent, et le tableau ressort inchangé',
      sonde: '(function () { var v = 0; new Array(3).map(function () { v++; return 0; }); return v === 0 && Array.from({ length: 3 }, function () { return 0; }).join(",") === "0,0,0"; })()',
    },
    remplacant: { nom: 'Array.from({ length: n }, …)', sonde: 'Array.from({ length: 3 }, function (_, i) { return i; }).join("") === "012"' },
  },
  {
    id: 'sort-stable',
    annee: 2012,
    question: 'How do I make Array.prototype.sort stable?',
    reponse: 'You cannot — the spec does not require stability. Decorate each item with its index and compare on it as a tie-breaker.',
    code: 'arr.map(function (v, i) { return [v, i]; }).sort(cmp)',
    marche: '(function () { var a = [[3, 0], [1, 1], [3, 2]]; a.sort(function (x, y) { return x[0] - y[0] || x[1] - y[1]; }); return a[1][1] === 0 && a[2][1] === 2; })()',
    raisonMorte: {
      texte: 'depuis ES2019, la spécification EXIGE un tri stable : la décoration ne sert plus à rien <em>pour cette raison-là</em>',
      sonde: '(function () { var n = 16, a = []; for (var i = 0; i < n; i++) a.push({ c: i % 2, i: i }); a.sort(function (x, y) { return x.c - y.c; }); for (var j = 1; j < a.length; j++) if (a[j].c === a[j - 1].c && a[j].i < a[j - 1].i) return false; return true; })()',
    },
  },
  {
    id: 'egal-null',
    annee: 2013,
    question: 'Should I ever use == in JavaScript?',
    reponse: 'Almost never — but x == null is the one exception worth knowing: it is true for null and for undefined, and false for everything else.',
    code: 'if (x == null) { /* null ou undefined */ }',
    marche: '(null == undefined) === true && (0 == null) === false && ("" == null) === false && (false == null) === false',
  },
  {
    id: 'hasownproperty',
    annee: 2011,
    question: 'How do I check if an object has its own property?',
    reponse: 'Do not call obj.hasOwnProperty(k) directly — the object may not inherit from Object.prototype. Use Object.prototype.hasOwnProperty.call(obj, k).',
    code: 'Object.prototype.hasOwnProperty.call(obj, k)',
    marche: '(function () { var o = Object.create(null); o.a = 1; return Object.prototype.hasOwnProperty.call(o, "a") === true && typeof o.hasOwnProperty === "undefined"; })()',
    remplacant: { nom: 'Object.hasOwn(obj, k)', sonde: '(function () { var o = Object.create(null); o.a = 1; return Object.hasOwn(o, "a") === true; })()' },
  },
  {
    id: 'trim-polyfill',
    annee: 2010,
    question: 'Is there a trim() in JavaScript?',
    reponse: 'Not everywhere. Add it yourself: if (!String.prototype.trim) { String.prototype.trim = function () { return this.replace(/^\\s+|\\s+$/g, ""); }; }',
    code: 'if (!String.prototype.trim) { String.prototype.trim = /* … */; }',
    marche: '"  a  ".replace(/^\\s+|\\s+$/g, "") === "a"',
    raisonMorte: {
      texte: '<code>trim()</code> fait partie du langage depuis ES5 : la garde est toujours écrite, elle n’est simplement jamais vraie',
      sonde: 'typeof String.prototype.trim === "function" && "  a  ".trim() === "a"',
    },
    remplacant: { nom: 's.trim()', sonde: '"  a  ".trim() === "a"' },
  },
  {
    id: 'delete-tableau',
    annee: 2010,
    question: 'How do I remove an element from an array?',
    reponse: 'Use delete arr[i]. It removes the element at that position.',
    code: 'delete arr[i];',
    marche: '(function () { var a = [1, 2, 3]; delete a[1]; return a[1] === undefined; })()',
    jamais: {
      quoi: '<code>delete</code> laisse un trou : la longueur ne bouge pas et les éléments suivants ne se décalent pas',
      sonde: '(function () { var a = [1, 2, 3]; delete a[1]; var b = [1, 2, 3]; b.splice(1, 1); return a.length === 3 && b.length === 2 && b.join(",") === "1,3"; })()',
    },
    remplacant: { nom: 'arr.splice(i, 1)', sonde: '(function () { var a = [1, 2, 3]; a.splice(1, 1); return a.join(",") === "1,3"; })()' },
  },
  {
    id: 'for-in-tableau',
    annee: 2009,
    question: 'How do I loop over an array?',
    reponse: 'A for (var i in arr) loop is the shortest way to walk every element of an array.',
    code: 'for (var i in arr) { /* … */ }',
    marche: '(function () { var v = []; var a = [10, 20]; for (var i in a) v.push(a[i]); return v.join(",") === "10,20"; })()',
    jamais: {
      quoi: '<code>for…in</code> énumère les CLÉS, qui sont des chaînes, et remonte la chaîne de prototypes : une propriété ajoutée par une bibliothèque entre dans la boucle',
      sonde: '(function () { function F() {} F.prototype = Object.create(Array.prototype); F.prototype.zz = 1; var a = new F(); a.push(10); var k = []; for (var i in a) k.push(i); return k.indexOf("zz") !== -1 && typeof k[0] === "string"; })()',
    },
    remplacant: { nom: 'for (const v of arr)', sonde: '(function () { var v = []; for (const x of [10, 20]) v.push(x); return v.join(",") === "10,20"; })()' },
  },
  {
    id: 'assign-copie',
    annee: 2015,
    question: 'How do I copy an object without mutating the original?',
    reponse: 'Use Object.assign({}, obj). You get a fresh object, so changing the copy leaves the original alone.',
    code: 'var copie = Object.assign({}, obj);',
    marche: '(function () { var o = { a: 1 }; var c = Object.assign({}, o); c.a = 2; return o.a === 1; })()',
    contre: {
      quoi: 'la copie est <strong>superficielle</strong> : un objet imbriqué reste PARTAGÉ, et le modifier dans la copie le modifie dans l’original',
      sonde: '(function () { var o = { n: { a: 1 } }; var c = Object.assign({}, o); c.n.a = 2; return o.n.a === 2; })()',
    },
    remplacant: { nom: '{ ...obj }', sonde: '(function () { var o = { a: 1 }; var c = { ...o }; c.a = 2; return o.a === 1; })()' },
  },
  {
    id: 'number-parseint',
    annee: 2013,
    question: 'Number(s) or parseInt(s) to convert a string?',
    reponse: 'They are interchangeable for numeric strings, so pick whichever reads better.',
    code: 'Number(s) /* ou */ parseInt(s, 10)',
    marche: 'Number("42") === 42 && parseInt("42", 10) === 42',
    jamais: {
      quoi: 'elles divergent sur trois entrées courantes : la chaîne vide, une chaîne à suffixe, et un nombre décimal',
      sonde: 'Number("") === 0 && Number.isNaN(parseInt("", 10)) && Number.isNaN(Number("12px")) && parseInt("12px", 10) === 12 && parseInt("3.9", 10) === 3 && Number("3.9") === 3.9',
    },
  },
  {
    id: 'length-zero',
    annee: 2011,
    question: 'How do I empty an array?',
    reponse: 'Set arr.length = 0. Every reference to that array sees it emptied, which is usually what you want.',
    code: 'arr.length = 0;',
    marche: '(function () { var a = [1, 2, 3]; var b = a; a.length = 0; return a.length === 0 && b.length === 0; })()',
  },
  {
    id: 'concat-chaines',
    annee: 2008,
    question: 'Why is string concatenation so slow in a loop?',
    reponse: 'Strings are immutable, so s += x rebuilds the whole string every time. Push into an array and call join("") at the end instead.',
    code: 'var parts = []; /* … */ var s = parts.join("");',
    marche: '(function () { var p = []; for (var i = 0; i < 5; i++) p.push(i); return p.join("") === "01234"; })()',
    raisonMorte: {
      texte: 'les moteurs ne reconstruisent plus la chaîne : ils gardent un arbre de morceaux et ne l’aplatissent qu’à la lecture — les deux formes donnent le même résultat, et l’écart de vitesse invoqué n’est plus celui que la réponse décrit',
      sonde: '(function () { var s = "", p = []; for (var i = 0; i < 2000; i++) { s += i; p.push(i); } return s === p.join("") && s.length > 5000; })()',
    },
  },
];

/* ---------------------------------------------------------------- exécution */
/* Le même bac que gen.js et que le Worker de js/runner.js : le langage, rien
   de plus. Pas de console, pas de setTimeout, aucune API de l'hôte — une sonde
   qui aurait besoin de structuredClone ou de fetch DOIT échouer ici, et c'est
   voulu : ce sont des API du navigateur, pas du langage. */
function sonder(expr, ou) {
  let r;
  try {
    r = vm.runInNewContext('(' + expr + ')', vm.createContext({}), { timeout: 3000 });
  } catch (e) {
    throw new Error(ou + ' : la sonde a levé « ' + e.name + ': ' + e.message + ' ».');
  }
  if (typeof r !== 'boolean') {
    throw new Error(ou + ' : la sonde ne rend pas un booléen mais ' + typeof r + '.');
  }
  return r;
}

/* L'ORDRE compte, et il est l'argument de la leçon :
   - « jamais »  passe avant tout : si le conseil n'a jamais fait ce qu'il
     promet, son âge n'y est pour rien ;
   - « casse »   ensuite : le code ne s'exécute plus ;
   - « piège »   puis : il marche, mais il a un trou ;
   - « raison »  puis : il tient, mais son motif a disparu ;
   - « dépassé » enfin : il est juste, mais il existe mieux ;
   - « bon »     par défaut. */
function verdictDe(s) {
  if (!s.marche) return 'casse';
  if (s.jamais) return 'jamais';
  if (s.contre) return 'piege';
  if (s.raisonMorte) return 'raison';
  if (s.remplacant) return 'depasse';
  return 'bon';
}

const LIBELLE = {
  casse: 'ne s’exécute plus',
  jamais: 'n’a jamais fait ce qu’il promet',
  piege: 'marche, mais il a un trou',
  raison: 'tient encore — mais plus pour la raison invoquée',
  depasse: 'juste, mais il existe plus court',
  bon: 'toujours bon',
};

const ORDRE_VERDICTS = ['casse', 'jamais', 'piege', 'raison', 'depasse', 'bon'];

function mesurer() {
  const lignes = CONSEILS.map(function (c) {
    const s = {
      marche: sonder(c.marche, 'conseil « ' + c.id +' » (marche)'),
      jamais: c.jamais ? sonder(c.jamais.sonde, 'conseil « ' + c.id + ' » (jamais)') : false,
      contre: c.contre ? sonder(c.contre.sonde, 'conseil « ' + c.id + ' » (contre)') : false,
      remplacant: c.remplacant ? sonder(c.remplacant.sonde, 'conseil « ' + c.id + ' » (remplacant)') : false,
      raisonMorte: c.raisonMorte ? sonder(c.raisonMorte.sonde, 'conseil « ' + c.id + ' » (raisonMorte)') : false,
      autreRaison: c.autreRaison ? sonder(c.autreRaison.sonde, 'conseil « ' + c.id + ' » (autreRaison)') : false,
    };
    /* Une sonde déclarée qui rend false est une ERREUR de rédaction, pas un
       résultat : elle voudrait dire que le contre-exemple annoncé n'en est pas
       un. On s'arrête plutôt que de publier une case creuse. */
    for (const cle of ['jamais', 'contre', 'remplacant', 'raisonMorte', 'autreRaison']) {
      if (c[cle] && !s[cle]) {
        throw new Error('conseil « ' + c.id + ' » : la sonde ' + cle +
          ' rend false — elle ne démontre pas ce qu’elle annonce.');
      }
    }
    return Object.assign({}, c, { sondes: s, verdict: verdictDe(s) });
  });
  const parVerdict = {};
  for (const v of ORDRE_VERDICTS) parVerdict[v] = lignes.filter(function (l) { return l.verdict === v; }).length;
  const annees = lignes.map(function (l) { return l.annee; });
  return {
    conseils: lignes,
    total: lignes.length,
    parVerdict,
    libelles: LIBELLE,
    ordre: ORDRE_VERDICTS,
    anneeMin: Math.min.apply(null, annees),
    anneeMax: Math.max.apply(null, annees),
    /* le chiffre qui porte la leçon : combien de ces conseils, tous vieux de
       dix ans ou plus, ne s'exécutent tout simplement plus. */
    casses: parVerdict.casse,
    bons: parVerdict.bon,
    aRevoir: lignes.length - parVerdict.bon - parVerdict.casse,
    avecRemplacant: lignes.filter(function (l) { return !!l.remplacant; }).length,
  };
}

module.exports = { CONSEILS, mesurer, LIBELLE, ORDRE_VERDICTS };

if (require.main === module) {
  const m = mesurer();
  console.log('conseils : ' + m.total + '  (' + m.anneeMin + '–' + m.anneeMax + ')');
  for (const v of m.ordre) {
    console.log('  ' + String(m.parVerdict[v]).padStart(2) + '  ' + v.padEnd(8) + ' — ' + m.libelles[v]);
  }
  console.log('');
  for (const c of m.conseils) console.log('  ' + c.annee + '  ' + c.verdict.padEnd(8) + '  ' + c.id);
}
