/* Six programmes qui n'ont rien à voir les uns avec les autres.
   Un seul et même message. C'est pourquoi coller le message tout seul dans un
   moteur de recherche ramène six mille réponses dont aucune n'est la tienne. */

var CAUSES = [
  ['un objet imbriqué qui n’existe pas',
    function () { var u = {}; return u.profil.nom; }],
  ['une fonction qui oublie son return',
    function () { function chercher() { /* pas de return */ } return chercher().nom; }],
  ['un tableau vide',
    function () { var t = []; return t[0].nom; }],
  ['un find qui ne trouve rien',
    function () { return [{ id: 1 }].find(function (x) { return x.id === 2; }).nom; }],
  ['une déstructuration d’un champ absent',
    function () { var o = {}; var profil = o.profil; return profil.nom; }],
  ['une faute de frappe sur la clé',
    function () { var u = { profil: { nom: 'a' } }; return u.proFil.nom; }],
];

var vus = {};
var distincts = 0;
for (var i = 0; i < CAUSES.length; i++) {
  var msg = '(aucune erreur)';
  try { CAUSES[i][1](); } catch (e) { msg = e.constructor.name + ': ' + e.message; }
  if (!vus[msg]) { vus[msg] = true; distincts++; }
  console.log(CAUSES[i][0]);
  console.log('   → ' + msg);
}
console.log('');
console.log(CAUSES.length + ' causes sans rapport → ' + distincts + ' message(s) distinct(s).');

/* Le symétrique : deux programmes presque identiques, deux messages
   différents — donc deux recherches différentes. */
function messageDe(fn) {
  try { fn(); } catch (e) { return e.message; }
  return '(aucune erreur)';
}
console.log('');
console.log('la valeur vaut null      → ' + messageDe(function () { var o = null; return o.x; }));
console.log('la valeur vaut undefined → ' + messageDe(function () { var o; return o.x; }));
console.log('Un mot change. La réponse que tu cherches n’est pas la même.');
