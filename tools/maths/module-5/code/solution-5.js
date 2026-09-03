/* Exercice 5 — pourquoi une base de données n’emploie pas d’arbre BINAIRE. */

/* Un arbre de recherche d’ordre m : chaque nœud tient m−1 clés et m enfants.
   Sa hauteur vaut log_m(n) au lieu de log₂(n). On le construit pour de vrai
   sur des tailles où c’est possible, puis on emploie la formule vérifiée. */
function hauteurArbre(n, ordre) {          // nombre de niveaux à traverser
  let niveaux = 0, capacite = 1;
  while (capacite < n) { capacite *= ordre; niveaux++; }
  return niveaux;
}
/* Modèle retenu, et il faut le dire : un nœud a « ordre » ENFANTS, donc un
   arbre de h niveaux atteint ordre^h clés. Le modèle « ordre−1 clés par nœud »
   d’un vrai B-arbre donne ordre^h − 1, et change la réponse aux puissances
   exactes : à un milliard de clés, l’ordre 10 y demande 10 niveaux au lieu de 9,
   et l’ordre 1000 en demande 4 au lieu de 3. Le programme publie les deux. */
function hauteurBArbre(n, ordre) {
  let niveaux = 0, capacite = 1;
  while (capacite - 1 < n) { capacite *= ordre; niveaux++; }
  return niveaux;
}

/* Contrôle : la construction réelle donne-t-elle la même hauteur que la formule ? */
function construire(n, ordre) {
  let niveau = [], suivant = [];
  for (let i = 0; i < n; i++) niveau.push({ feuille: true });
  let niveaux = 0;
  while (niveau.length > 1) {
    suivant = [];
    for (let i = 0; i < niveau.length; i += ordre) suivant.push({ enfants: niveau.slice(i, i + ordre) });
    niveau = suivant; niveaux++;
  }
  return niveaux;
}
console.log('CONTRÔLE : hauteur construite pour de vrai contre hauteur calculée');
console.log('');
console.log('       n   ordre   construite   calculée   identiques');
console.log('  ------   -----   ----------   --------   ----------');
[[1000, 2], [1000, 10], [10000, 100], [50000, 8], [50000, 256],
 [9, 3], [27, 3], [729, 3], [125, 5]].forEach(function (p) {
  const [n, m] = p;
  const a = construire(n, m), b = hauteurArbre(n, m);
  console.log('  ' + String(n).padStart(6) + '   ' + String(m).padStart(5) + '   ' + String(a).padStart(10) +
    '   ' + String(b).padStart(8) + '   ' + String(a === b).padStart(10));
});
console.log('');
console.log('CE QUE CE CONTRÔLE PROUVE, ET CE QU’IL NE PROUVE PAS');
console.log('  Les deux colonnes testent la MÊME condition écrite de deux façons : leur');
console.log('  égalité est une identité, pas un test. Elle vaut ce qu’elle vaut — elle');
console.log('  écarte une faute de frappe, pas une faute de raisonnement.');

/* La méthode qu’on aurait pu employer à la place, et pourquoi on ne l’emploie pas. */
console.log('');
console.log('POURQUOI ON NE CALCULE PAS LA HAUTEUR PAR ⌈log(n)/log(m)⌉');
console.log('  Aux puissances exactes de m, le quotient DEVRAIT tomber sur un entier.');
console.log('  S’il tombe un cheveu au-dessus, l’arrondi supérieur ajoute un niveau entier :');
console.log('    Math.ceil(2) ............ = ' + Math.ceil(2));
console.log('    Math.ceil(2 + 1e-15) .... = ' + Math.ceil(2 + 1e-15));
console.log('  Un écart de 10^-15 sur un quotient, et la réponse change de 2 à 3.');
console.log('');
console.log('  Que ce cheveu existe ou non pour un couple (n, m) donné dépend de la');
console.log('  BIBLIOTHÈQUE MATHÉMATIQUE du moteur, pas de la formule. Ce programme ne');
console.log('  publie donc aucun quotient de logarithmes : il compte par multiplications,');
console.log('  en entiers, ce qui donne le même résultat sur toutes les machines.');
console.log('');
console.log('  La règle générale, et elle dépasse ce seul exercice : quand la réponse est');
console.log('  un ENTIER, on l’obtient par des opérations entières. Le détour par les');
console.log('  réels marche presque toujours, et « presque » n’est pas une garantie.');

console.log('');
console.log('UN MILLIARD DE CLÉS : COMBIEN DE NIVEAUX, DONC COMBIEN DE LECTURES DISQUE');
console.log('');
const N = 1000000000;
console.log('  ordre du nœud   niveaux (m enfants)   niveaux (B-arbre, m−1 clés)');
console.log('  -------------   -------------------   ---------------------------');
[2, 10, 100, 256, 1000].forEach(function (m) {
  console.log('  ' + String(m).padStart(13) + '   ' + String(hauteurArbre(N, m)).padStart(19) + '   ' +
    String(hauteurBArbre(N, m)).padStart(27));
});
console.log('');
console.log('  Les deux colonnes ne diffèrent qu’aux ordres où 10^9 est une puissance');
console.log('  exacte — 10 et 1000 — parce qu’un B-arbre y perd juste une clé. Ailleurs,');
console.log('  le modèle ne change rien : c’est l’ORDRE DE GRANDEUR de la hauteur qui compte.');
const hBin = hauteurArbre(N, 2), hB = hauteurArbre(N, 256);
console.log('');
console.log('  arbre binaire ..... : ' + hBin + ' niveaux');
console.log('  arbre d’ordre 256 . : ' + hB + ' niveaux');
console.log('  rapport ........... : ' + (hBin / hB).toFixed(1) + ' fois moins de niveaux');
console.log('');
console.log('  D’où vient ce rapport : log_256(n) = log₂(n) / log₂(256), et log₂(256) = ' + Math.log2(256) + '.');
console.log('  ' + hBin + ' / ' + Math.log2(256) + ' = ' + (hBin / Math.log2(256)).toFixed(2) +
  ', arrondi au-dessus : ' + Math.ceil(hBin / Math.log2(256)) + ' — c’est bien la hauteur mesurée, ' + hB + '.');
console.log('  Le rapport OBSERVÉ vaut donc ' + (hBin / hB).toFixed(1) + ' et non 8 : les deux hauteurs sont');
console.log('  des entiers, et deux arrondis ne se divisent pas comme les nombres d’origine.');

/* Le vrai gain : ce n’est pas le nombre de comparaisons, c’est le nombre d’accès. */
console.log('');
console.log('CE QUI COÛTE VRAIMENT : L’ACCÈS, PAS LA COMPARAISON');
const NS_MEMOIRE = 100, NS_DISQUE = 10000000;      // 100 ns contre 10 ms
console.log('  une lecture en mémoire : ' + NS_MEMOIRE + ' ns');
console.log('  une lecture sur disque : ' + NS_DISQUE + ' ns (10 ms), soit ' +
  (NS_DISQUE / NS_MEMOIRE).toExponential(1) + ' fois plus');
console.log('');
console.log('  structure            niveaux   temps si tout est en mémoire   temps si chaque niveau est un accès disque');
console.log('  ------------------   -------   ----------------------------   ------------------------------------------');
[[2, 'arbre binaire'], [256, 'arbre d’ordre 256']].forEach(function (p) {
  const [m, nom] = p;
  const h = hauteurArbre(N, m);
  console.log('  ' + nom.padEnd(18) + '   ' + String(h).padStart(7) + '   ' +
    ((h * NS_MEMOIRE / 1000).toFixed(1) + ' µs').padStart(28) + '   ' +
    ((h * NS_DISQUE / 1e9).toFixed(2) + ' s').padStart(42));
});
console.log('');
console.log('  Le facteur ' + (hBin / hB).toFixed(1) + ' sur le nombre de niveaux ne change presque rien en mémoire');
console.log('  (' + (hBin * NS_MEMOIRE / 1000).toFixed(1) + ' µs contre ' + (hB * NS_MEMOIRE / 1000).toFixed(1) +
  ' µs), et tout sur disque (' + (hBin * NS_DISQUE / 1e9).toFixed(2) + ' s contre ' +
  (hB * NS_DISQUE / 1e9).toFixed(2) + ' s).');
console.log('');
console.log('  Voilà pourquoi les index de bases de données sont des B-arbres à grand ordre :');
console.log('  le nœud est dimensionné pour tenir dans un bloc disque, et l’on paie la');
console.log('  hauteur en accès, pas en comparaisons. La classe est la même — O(log n) dans');
console.log('  les deux cas — et la base de la constante fait toute la différence.');
console.log('');
console.log(String(hB));
