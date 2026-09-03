/* Exercice 4 — écrire le produit matrice-vecteur, et se donner le garde-fou que
   JavaScript ne donne pas : la vérification des dimensions. */

function fois(M, v) {
  if (!M.length || M[0].length !== v.length) {
    throw new Error('dimensions incompatibles : matrice ' + M.length + 'x' + (M[0] || []).length +
      ' , vecteur de ' + v.length);
  }
  return M.map(function (ligne) {
    let s = 0;
    for (let j = 0; j < v.length; j++) s += ligne[j] * v[j];
    return s;
  });
}

/* La même chose SANS garde-fou, pour voir ce qui se passe. */
function foisSansControle(M, v) {
  return M.map(function (ligne) {
    let s = 0;
    for (let j = 0; j < v.length; j++) s += ligne[j] * v[j];
    return s;
  });
}

/* Un menu de restaurant : trois plats, chacun consommant quatre ingrédients.
   La matrice dit combien de chaque ingrédient part dans chaque plat. */
const INGREDIENTS = ['farine', 'oeufs', 'lait', 'sucre'];
const PLATS = ['crepes', 'gateau', 'flan'];
const RECETTES = [
  [250, 3, 500, 50],       // crepes  : g, unites, ml, g
  [200, 4, 100, 150],      // gateau
  [0, 6, 750, 120],        // flan
];
const COMMANDES = [12, 5, 8];   // douze crepes, cinq gateaux, huit flans

/* Attention au SENS : pour obtenir les ingrédients, il faut la matrice TRANSPOSEE —
   4 lignes (ingredients) par 3 colonnes (plats), multipliee par les 3 commandes. */
function transposee(M) {
  return M[0].map((_, j) => M.map((ligne) => ligne[j]));
}
const parIngredient = transposee(RECETTES);
const besoin = fois(parIngredient, COMMANDES);

console.log('commandes : ' + PLATS.map((p, i) => p + ' x' + COMMANDES[i]).join(' , '));
console.log('');
INGREDIENTS.forEach(function (ing, i) {
  const detail = PLATS.map((p, j) => COMMANDES[j] + ' x ' + parIngredient[i][j]).join(' + ');
  console.log(ing.padEnd(8) + String(besoin[i]).padStart(7) + '   = ' + detail);
});

/* Contrôle indépendant : on refait la somme sans aucune matrice. */
let ecarts = 0;
INGREDIENTS.forEach(function (ing, i) {
  let s = 0;
  PLATS.forEach(function (p, j) { s += RECETTES[j][i] * COMMANDES[j]; });
  if (s !== besoin[i]) ecarts++;
});
console.log('');
console.log('ecarts avec le calcul direct, sans matrice : ' + ecarts + ' sur ' + INGREDIENTS.length);

/* CE QUE LE GARDE-FOU RATTRAPE. On oublie un plat dans les commandes. */
const TRONQUE = [12, 5];
console.log('');
console.log('-- avec un vecteur de commandes tronque a 2 valeurs --');
const sansControle = foisSansControle(parIngredient, TRONQUE);
console.log('sans controle : ' + JSON.stringify(sansControle) + '   (aucune erreur, resultat FAUX)');
console.log('ecart avec le vrai besoin : ' + besoin.map((x, i) => x - sansControle[i]).join(', '));
try {
  fois(parIngredient, TRONQUE);
  console.log('avec controle : aucune erreur — le garde-fou n a pas fonctionne');
} catch (e) {
  console.log('avec controle : ' + e.message);
}

/* Combien de multiplications le calcul a-t-il demande ? Lignes x colonnes. */
const mult = parIngredient.length * parIngredient[0].length;
console.log('');
console.log('multiplications pour ce produit (4 x 3) : ' + mult);

console.log('');
console.log(besoin[2]);
