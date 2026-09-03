/* Les mots qui décrivent les BORDS d'une donnée. Ce sont ceux qui décident si
   ton programme rend le bon nombre d'éléments — ou un de moins. */

/* « exclusive » — la borne de fin ne fait pas partie du résultat. */
const jours = ['lun', 'mar', 'mer', 'jeu', 'ven'];
console.log('slice(1, 3) =', jours.slice(1, 3), '→', jours.slice(1, 3).length, 'éléments');

/* « zero-based » — le premier indice vaut 0, donc « si l'indice est vrai »
   rate toujours le premier élément. C'est le bug classique. */
console.log('indexOf("lun") =', jours.indexOf('lun'));
console.log('indexOf("dim") =', jours.indexOf('dim'));
const trouve = jours.indexOf('lun');
console.log('« if (trouve) » se déclenche ?', trouve ? 'oui' : 'non — et pourtant lun est là');

/* « length » — un nombre d'unités de code, pas de caractères. */
console.log('"👍".length =', '👍'.length, '| [..."👍"].length =', [...'👍'].length);

/* « whitespace » — vide et blanc ne sont pas la même chose. */
const blanc = '   ';
console.log('blanc.length =', blanc.length,
  '| blanc.trim() vide ?', blanc.trim() === '',
  '| blanc dans un si :', blanc ? 'vrai' : 'faux');

/* « to round » / « to truncate » — arrondir n'est pas tronquer, et les moitiés
   ne tombent pas du même côté selon les langages. */
console.log('toFixed(0) sur 0.5, 1.5, 2.5 :', (0.5).toFixed(0), (1.5).toFixed(0), (2.5).toFixed(0));
console.log('Math.trunc(-1.5) =', Math.trunc(-1.5), '| Math.floor(-1.5) =', Math.floor(-1.5));
/* et un piège que l'affichage cache : Math.round(-0.5) ne rend pas 0, il rend
   -0, un zéro NÉGATIF que console.log montre comme un zéro ordinaire. */
console.log('Math.round(-0.5) affiche', Math.round(-0.5),
  '— mais est-ce -0 ?', Object.is(Math.round(-0.5), -0));

/* « shallow » — la copie de surface partage tout ce qui est en dessous. */
const original = { nom: 'Ada', adresse: { ville: 'Londres' } };
const copie = Object.assign({}, original);
copie.adresse.ville = 'Turin';
console.log('après modification de la COPIE, original.adresse.ville =', original.adresse.ville);
