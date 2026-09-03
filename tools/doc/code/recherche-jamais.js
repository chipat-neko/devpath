/* Trois réponses de forum écrites entre 2009 et 2011. Aucune des trois ne casse.
   Toutes les trois sont fausses — et elles l'étaient DÉJÀ le jour où elles ont
   été écrites. L'âge d'une réponse n'est donc pas le bon critère. */

console.log('— 2011 : « pour savoir si ce n’est pas un nombre, utilise isNaN(x) »');
console.log('  isNaN("bonjour")        = ' + isNaN('bonjour'));
console.log('  Number.isNaN("bonjour") = ' + Number.isNaN('bonjour'));
console.log('  « bonjour » n’est pas NaN. isNaN convertit avant de comparer.');
console.log('');

console.log('— 2009 : « new Array(n) te donne un tableau de n cases à remplir avec map »');
var vues = 0;
var essai = new Array(3).map(function () { vues++; return 0; });
var plein = Array.from({ length: 3 }, function () { return 0; });
console.log('  new Array(3).map(...) a visité ' + vues + ' case(s).');
/* ⚠ Ne PAS afficher ce tableau avec JSON.stringify : il écrit « null » pour un
   trou, exactement comme pour une case qui vaudrait null. L'affichage
   mentirait sur ce qu'on veut montrer. On interroge donc les cases. */
console.log('  la case 0 existe-t-elle ?  new Array(3) → ' + (0 in essai) +
  '   ·   Array.from(...) → ' + (0 in plein));
console.log('  longueurs : ' + essai.length + ' et ' + plein.length + ' — identiques.');
console.log('  Les cases sont des TROUS : map, forEach et filter les sautent.');
console.log('  (Et JSON.stringify écrirait « null » pour ces trous : un affichage n’est pas une valeur.)');
console.log('');

console.log('— 2009 : « for (var i in arr) est le plus court moyen de parcourir un tableau »');
/* ⚠ Ce bloc a été réécrit après relecture. Sa première version fabriquait un
   objet qui HÉRITAIT d'Array.prototype sans être un tableau — et sa sortie
   montrait « length » parmi les clés visitées. C'était un artefact de la
   substitution : sur un VRAI tableau, length n'est pas énumérable et
   n'apparaît jamais. On démontre donc sur un vrai tableau, et la propriété
   parasite est posée là où une bibliothèque la poserait : sur Array.prototype. */
Array.prototype.derniereModif = 0;      /* ce qu’ajoute une bibliothèque */
var t = [10, 20];
console.log('  est-ce un vrai tableau ? ' + Array.isArray(t));
var cles = [];
for (var k in t) { cles.push(k); }
console.log('  clés visitées : ' + JSON.stringify(cles));
console.log('  type de la première : ' + typeof cles[0] + ' — ce sont des chaînes,');
console.log('  et « derniereModif » n’est pas un élément du tableau.');
var vals = [];
for (var v of t) { vals.push(v); }
console.log('  for…of : ' + JSON.stringify(vals) + ' — il ne visite que les éléments.');
delete Array.prototype.derniereModif;   /* on remet le prototype en ordre */
