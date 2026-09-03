/* Le second corpus de la leçon 04 : des affirmations SANS SOURCE, du genre
   qu'on obtient d'un assistant, d'un billet de blog ou d'un collègue pressé.

   ⚠ HONNÊTETÉ DU CORPUS. Ces phrases n'ont été copiées de nulle part : elles
   sont écrites ici, dans le registre assuré qui les caractérise — pas de
   « je crois », pas de « d'après la doc », pas de lien. La PROPORTION de
   fausses ne mesure donc rien du tout : c'est celle qu'on a choisie, et la
   leçon le dit. Ce qui est mesuré, et qui vaut, c'est ceci :
     1. quelles affirmations tombent, une fois exécutées ;
     2. et surtout : la FORME d'une affirmation vraie et celle d'une
        affirmation fausse sont-elles distinguables ? (longueur, vocabulaire,
        marqueurs de certitude). C'est la seule chose que le lecteur a sous les
        yeux avant d'exécuter.

   Chaque entrée porte l'expression TELLE QUE l'affirmation la présente. Si
   elle lève, c'est l'évaluateur qui l'attrape — l'expression n'a pas le droit
   de contenir un try/catch, sans quoi elle trahirait qu'une erreur est
   attendue. Le verdict est la comparaison de la chaîne obtenue avec la chaîne
   annoncée. Rien n'est écrit à la main. */
'use strict';
const vm = require('vm');

/* `dit` : ce que l'affirmation prétend voir s'afficher, mot pour mot.
   `expr` : l'expression, telle que l'affirmation la donne. */
const AFFIRMATIONS = [
  { id: 'max-vide', dit: '-Infinity',
    texte: '<code>Math.max()</code>, appelée sans argument, rend <code>0</code>&nbsp;: c’est l’élément neutre du maximum, comme <code>0</code> l’est pour l’addition.',
    expr: 'String(Math.max())', annonce: '0' },

  { id: 'flatten', dit: 'TypeError',
    texte: 'Pour aplatir un tableau imbriqué, <code>[1, [2, 3]].flatten()</code> rend <code>[1, 2, 3]</code>&nbsp;: la méthode descend d’un niveau et recopie les éléments dans un nouveau tableau.',
    expr: 'JSON.stringify([1, [2, 3]].flatten())', annonce: '[1,2,3]' },

  { id: 'replaceall-regex', dit: 'TypeError',
    texte: '<code>"a-b-c".replaceAll(/-/, "+")</code> rend <code>"a+b+c"</code> : <code>replaceAll</code> remplace toutes les occurrences, quelle que soit la forme du motif.',
    expr: '"a-b-c".replaceAll(/-/, "+")', annonce: 'a+b+c' },

  { id: 'number-vide', dit: '0',
    texte: '<code>Number("")</code> rend <code>NaN</code>&nbsp;: la chaîne vide ne représente aucun nombre, et une conversion qui échoue donne toujours <code>NaN</code>.',
    expr: 'String(Number(""))', annonce: 'NaN' },

  { id: 'typeof-nan', dit: 'number',
    texte: '<code>typeof NaN</code> rend <code>"number"</code>&nbsp;: <code>NaN</code> est une valeur du type nombre, celle qui représente un résultat numérique indéfini.',
    expr: 'typeof NaN', annonce: 'number' },

  { id: 'sort-defaut', dit: '[1,10,9]',
    texte: '<code>[10, 9, 1].sort()</code> rend <code>[1, 9, 10]</code>&nbsp;: le tri par défaut range les nombres dans l’ordre croissant.',
    expr: 'JSON.stringify([10, 9, 1].sort())', annonce: '[1,9,10]' },

  { id: 'set-nan', dit: '1',
    texte: '<code>new Set([NaN, NaN]).size</code> vaut <code>1</code> : un <code>Set</code> considère les deux <code>NaN</code> comme une seule valeur.',
    expr: 'String(new Set([NaN, NaN]).size)', annonce: '1' },

  { id: 'hasown-prototype', dit: 'TypeError',
    texte: 'La forme moderne du test de propriété propre est <code>Object.prototype.hasOwn(o, "a")</code>&nbsp;: elle évite d’appeler la méthode sur l’objet lui-même, qui peut ne pas en hériter.',
    expr: 'String(Object.prototype.hasOwn({ a: 1 }, "a"))', annonce: 'true' },

  { id: 'at-negatif', dit: 'c',
    texte: '<code>"abc".at(-1)</code> rend <code>"c"</code>&nbsp;: <code>at</code> accepte un index négatif, qui compte à partir de la fin de la chaîne.',
    expr: '"abc".at(-1)', annonce: 'c' },

  { id: 'parseint-exposant', dit: '1',
    texte: '<code>parseInt("1e3")</code> rend <code>1000</code>, comme <code>Number("1e3")</code>&nbsp;: les deux fonctions reconnaissent la notation scientifique.',
    expr: 'String(parseInt("1e3"))', annonce: '1000' },

  { id: 'tableau-objet', dit: '[object Object]',
    texte: '<code>[] + {}</code> rend la chaîne <code>"[object Object]"</code>&nbsp;: les deux opérandes sont convertis en texte, et le tableau vide donne la chaîne vide.',
    expr: '[] + {}', annonce: '[object Object]' },

  { id: 'stringify-undefined', dit: '{}',
    texte: '<code>JSON.stringify({ a: undefined })</code> rend <code>{"a":null}</code> : les valeurs absentes sont sérialisées en <code>null</code>.',
    expr: 'JSON.stringify({ a: undefined })', annonce: '{"a":null}' },

  { id: 'flottants', dit: 'false',
    texte: '<code>0.1 + 0.2 === 0.3</code> vaut <code>false</code>&nbsp;: aucun des deux opérandes n’a de représentation exacte en binaire, et la somme non plus.',
    expr: 'String(0.1 + 0.2 === 0.3)', annonce: 'false' },

  { id: 'array-from', dit: '[0,1,2]',
    texte: '<code>Array.from({ length: 3 }, (_, i) =&gt; i)</code> rend <code>[0, 1, 2]</code>&nbsp;: la fonction reçoit l’index de la case en second argument.',
    expr: 'JSON.stringify(Array.from({ length: 3 }, (_, i) => i))', annonce: '[0,1,2]' },

  { id: 'moins-chaine', dit: '9',
    texte: '<code>"10" - 1</code> rend le nombre <code>9</code> : le moins force la conversion numérique.',
    expr: 'String("10" - 1)', annonce: '9' },

  { id: 'includes-chaine', dit: 'false',
    texte: '<code>[1, 2, 3].includes("2")</code> rend <code>true</code>&nbsp;: <code>includes</code> convertit ses opérandes avant de les comparer.',
    expr: 'String([1, 2, 3].includes("2"))', annonce: 'true' },

  { id: 'emoji-length', dit: '2',
    texte: '<code>"👍".length</code> vaut <code>1</code>&nbsp;: c’est un seul caractère, et <code>length</code> compte les caractères d’une chaîne.',
    expr: 'String("👍".length)', annonce: '1' },

  { id: 'emoji-spread', dit: '1',
    texte: '<code>[..."👍"].length</code> vaut <code>1</code> : l’étalement découpe par point de code.',
    expr: 'String([..."👍"].length)', annonce: '1' },

  { id: 'sort-copie', dit: '1,3|true',
    texte: '<code>arr.sort()</code> rend un <strong>nouveau</strong> tableau trié et laisse l’original intact, exactement comme <code>map</code> et <code>filter</code> le font.',
    expr: '(function () { var a = [3, 1]; var b = a.sort(); return a.join(",") + "|" + (a === b); })()',
    annonce: '3,1|false' },

  { id: 'delete-length', dit: '3',
    texte: 'Sur <code>[1, 2, 3]</code>, <code>delete t[1]</code> ramène <code>t.length</code> à <code>2</code>&nbsp;: l’opérateur retire la case, et le tableau se referme sur le trou.',
    expr: '(function () { var t = [1, 2, 3]; delete t[1]; return String(t.length); })()', annonce: '2' },

  { id: 'keys-chaine', dit: '["0","1","2"]',
    texte: '<code>Object.keys("abc")</code> rend <code>["a", "b", "c"]</code>&nbsp;: une chaîne se comporte comme un tableau de caractères.',
    expr: 'JSON.stringify(Object.keys("abc"))', annonce: '["a","b","c"]' },

  { id: 'banana', dit: 'baNaNa',
    texte: '<code>"b" + "a" + +"a" + "a"</code> rend <code>"baNaNa"</code>&nbsp;: le plus unaire devant <code>"a"</code> produit <code>NaN</code>, que la concaténation retransforme en texte.',
    expr: '"b" + "a" + +"a" + "a"', annonce: 'baNaNa' },

  { id: 'null-superieur', dit: 'true|false|false',
    texte: '<code>null &gt;= 0</code> vaut <code>true</code>, alors que <code>null &gt; 0</code> et <code>null == 0</code> valent tous deux <code>false</code>.',
    expr: '[null >= 0, null > 0, null == 0].join("|")', annonce: 'true|false|false' },

  { id: 'min-max', dit: 'true',
    texte: '<code>Math.min() &gt; Math.max()</code> vaut <code>true</code>&nbsp;: sans argument, la première rend <code>Infinity</code> et la seconde <code>-Infinity</code>.',
    expr: 'String(Math.min() > Math.max())', annonce: 'true' },

  { id: 'tableau-faux', dit: 'true',
    texte: '<code>[] == false</code> vaut <code>true</code>, bien qu’un tableau vide soit <em>truthy</em> dans un <code>if</code>.',
    expr: 'String([] == false)', annonce: 'true' },

  { id: 'multiplie-chaine', dit: '12',
    texte: '<code>"3" * "4"</code> rend le nombre <code>12</code>&nbsp;: l’étoile n’a aucun sens textuel, les deux opérandes sont donc convertis avant l’opération.',
    expr: 'String("3" * "4")', annonce: '12' },
];

/* ---------------------------------------------------------------- exécution */
/* L'expression est évaluée telle quelle, dans le langage nu. Si elle lève,
   c'est ICI qu'on l'attrape : l'expression publiée reste naïve, exactement
   celle que l'affirmation présente. */
function evaluer(expr) {
  try {
    const r = vm.runInNewContext('(' + expr + ')', vm.createContext({}), { timeout: 3000 });
    if (typeof r !== 'string') return { erreur: null, valeur: '(pas une chaîne : ' + typeof r + ')' };
    return { erreur: null, valeur: r };
  } catch (e) {
    return { erreur: e.name, valeur: e.name };
  }
}

/* Les marqueurs qu'une phrase prudente porterait, et qu'aucune de ces
   affirmations ne porte. On les cherche pour le PROUVER, pas pour le dire. */
const MARQUEURS_PRUDENCE = /\b(je crois|il me semble|peut-être|sauf erreur|d’après la doc|selon la spécification|à vérifier|de mémoire|en général|normalement)\b/i;
/* Un lien ou une référence vérifiable. */
const MARQUEURS_SOURCE = /https?:\/\/|\bMDN\b|\bRFC\s?\d|\bECMA-?262\b|§/;

function texteNu(html) {
  return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();
}

function mesurer() {
  const lignes = AFFIRMATIONS.map(function (a) {
    const r = evaluer(a.expr);
    const obtenu = r.erreur ? r.erreur : r.valeur;
    /* `dit` est la valeur qu'on ATTEND de l'exécution : elle sert de garde-fou
       contre une entrée mal rédigée, pas de verdict. Le verdict, lui, compare
       l'obtenu à ce que l'affirmation ANNONCE. */
    if (obtenu !== a.dit) {
      throw new Error('affirmation « ' + a.id + ' » : l’exécution rend « ' + obtenu +
        ' », le corpus attendait « ' + a.dit + ' ». Corriger le corpus, pas le moteur.');
    }
    const nu = texteNu(a.texte);
    return {
      id: a.id, texte: a.texte, nu, expr: a.expr,
      annonce: a.annonce, obtenu,
      vraie: obtenu === a.annonce,
      leve: !!r.erreur,
      caracteres: nu.length,
      mots: nu.split(/\s+/).length,
      prudence: MARQUEURS_PRUDENCE.test(nu),
      source: MARQUEURS_SOURCE.test(nu),
    };
  });
  const vraies = lignes.filter(function (l) { return l.vraie; });
  const fausses = lignes.filter(function (l) { return !l.vraie; });
  const moy = function (t, cle) {
    return t.length ? Math.round((t.reduce(function (a, l) { return a + l[cle]; }, 0) / t.length) * 10) / 10 : 0;
  };
  return {
    affirmations: lignes,
    total: lignes.length,
    vraies: vraies.length,
    fausses: fausses.length,
    /* combien des fausses ne rendent pas une valeur du tout, mais LÈVENT */
    fausesQuiLevent: fausses.filter(function (l) { return l.leve; }).length,
    /* la mesure qui compte : la forme sépare-t-elle les deux ? */
    motsVraies: moy(vraies, 'mots'),
    motsFausses: moy(fausses, 'mots'),
    carVraies: moy(vraies, 'caracteres'),
    carFausses: moy(fausses, 'caracteres'),
    ecartMots: Math.abs(moy(vraies, 'mots') - moy(fausses, 'mots')),
    /* Le residu que l'ecart en MOTS masque, et que la lecon publie plutot que
       de le taire : changer d'unite pour declarer une victoire serait
       exactement le genre de tour que cette lecon apprend a reperer. */
    ecartCar: Math.abs(moy(vraies, 'caracteres') - moy(fausses, 'caracteres')),
    ecartPct: Math.round((Math.abs(moy(vraies, 'caracteres') - moy(fausses, 'caracteres'))
      / moy(vraies, 'caracteres')) * 1000) / 10,
    avecPrudence: lignes.filter(function (l) { return l.prudence; }).length,
    avecSource: lignes.filter(function (l) { return l.source; }).length,
  };
}

module.exports = { AFFIRMATIONS, mesurer };

if (require.main === module) {
  const m = mesurer();
  console.log(m.total + ' affirmations : ' + m.vraies + ' vraies, ' + m.fausses + ' fausses (' +
    m.fausesQuiLevent + ' des fausses lèvent une erreur)');
  console.log('longueur moyenne — vraies : ' + m.motsVraies + ' mots / ' + m.carVraies + ' car.  ' +
    'fausses : ' + m.motsFausses + ' mots / ' + m.carFausses + ' car.  écart : ' + m.ecartMots + ' mot(s)');
  console.log('marqueur de prudence : ' + m.avecPrudence + ' / ' + m.total +
    '   ·   source vérifiable : ' + m.avecSource + ' / ' + m.total);
  console.log('');
  for (const a of m.affirmations) {
    console.log('  ' + (a.vraie ? 'VRAIE ' : 'FAUSSE') + '  ' + a.id.padEnd(20) +
      ' annonce ' + JSON.stringify(a.annonce).padEnd(18) + ' obtient ' + JSON.stringify(a.obtenu));
  }
}
