/* Huit affirmations écrites avec le même aplomb. Quatre sont vraies, quatre
   sont fausses — et rien, dans leur formulation, ne dit lesquelles.

   ⚠ Ces huit-là ne figurent PAS dans le tableau publié plus haut : sa première
   version reprenait huit lignes déjà corrigées quelques écrans avant, ce qui
   tuait l'exercice avant qu'il commence. Celles-ci sont inédites.

   Lis-les. Parie. PUIS clique sur « Tester ». */

var AFFIRMATIONS = [
  ['typeof [] rend "array".',
    function () { return typeof []; }, 'array'],
  ['"abc".split("") rend ["a", "b", "c"].',
    function () { return JSON.stringify('abc'.split('')); }, '["a","b","c"]'],
  ['"5" + 3 rend le nombre 8.',
    function () { return String('5' + 3); }, '8'],
  ['[1, [2, [3]]].flat(Infinity) rend [1, 2, 3].',
    function () { return JSON.stringify([1, [2, [3]]].flat(Infinity)); }, '[1,2,3]'],
  ['Boolean("false") rend false.',
    function () { return String(Boolean('false')); }, 'false'],
  ['Poser arr.length = 1 sur [1, 2, 3] laisse [1].',
    function () { var a = [1, 2, 3]; a.length = 1; return JSON.stringify(a); }, '[1]'],
  ['Math.round(-0.5) rend -1.',
    function () { return String(Math.round(-0.5)); }, '-1'],
  ['new Date(0).getTime() vaut 0.',
    function () { return String(new Date(0).getTime()); }, '0'],
];

var vraies = 0, fausses = 0;
for (var i = 0; i < AFFIRMATIONS.length; i++) {
  var texte = AFFIRMATIONS[i][0];
  var annonce = AFFIRMATIONS[i][2];
  var obtenu;
  /* Si l'expression lève, on ne montre que le NOM de l'erreur : son message
     dépend de la version du moteur, et ce n'est pas ce qu'on démontre ici. */
  try { obtenu = AFFIRMATIONS[i][1](); } catch (e) { obtenu = e.constructor.name; }
  var juste = obtenu === annonce;
  if (juste) { vraies++; } else { fausses++; }
  console.log((juste ? 'VRAIE  ' : 'FAUSSE ') + texte);
  if (!juste) { console.log('        annoncé : ' + annonce + '   ·   obtenu : ' + obtenu); }
}
console.log('');
console.log(vraies + ' vraies, ' + fausses + ' fausses sur ' + AFFIRMATIONS.length + '.');
console.log('Relis-les : aucune ne portait de « je crois », aucune ne citait de source.');
