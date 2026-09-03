/* Le geste le plus court du métier : avant de croire qu'une méthode existe,
   DEMANDE-LE AU MOTEUR. Trois secondes, et aucune réponse de forum, aucun
   assistant et aucun billet de blog ne peut te contredire. */

/* On résout les chemins à la main, à partir d'une table explicite : c'est plus
   sûr que de fouiller l'objet global, et ça marche partout. */
var RACINES = {
  Array: Array, Object: Object, String: String, Number: Number,
  Math: Math, JSON: JSON, Promise: Promise, Date: Date,
};

function resoudre(chemin) {
  var bouts = chemin.split('.');
  var courant = RACINES[bouts[0]];
  if (courant === undefined) { return { existe: false, ou: 'racine inconnue' }; }
  for (var i = 1; i < bouts.length; i++) {
    if (courant === null || courant === undefined) { return { existe: false, ou: bouts[i - 1] }; }
    courant = courant[bouts[i]];
  }
  return { existe: courant !== undefined, type: typeof courant };
}

/* Des noms qu'on croise dans des réponses de forum et sous la plume d'un
   assistant. Certains existent. D'autres n'ont jamais existé. */
var CITES = [
  'Array.prototype.flat',
  'Array.prototype.flatten',
  'Array.prototype.includes',
  'Array.prototype.contains',
  'Object.hasOwn',
  'Object.prototype.hasOwn',
  'String.prototype.replaceAll',
  'String.prototype.trim',
  'String.prototype.substr',
  'Object.groupBy',
  'Array.prototype.findLast',
  'Number.parseInt',
];

var vrais = 0, faux = 0;
for (var i = 0; i < CITES.length; i++) {
  var r = resoudre(CITES[i]);
  if (r.existe) { vrais++; } else { faux++; }
  console.log((r.existe ? '  existe        ' : '  N’EXISTE PAS  ') + CITES[i] +
    (r.existe ? '   (' + r.type + ')' : ''));
}
console.log('');
console.log(vrais + ' existent, ' + faux + ' non, sur ' + CITES.length + ' noms cités.');
console.log('Aucune de ces réponses n’a demandé la permission à qui que ce soit.');
