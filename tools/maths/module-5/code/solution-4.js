/* Exercice 4 — trouver un seuil par dichotomie, et compter les tours. */

/* La question : quel est le plus petit n tel que n·log₂(n) dépasse un milliard ? */
const CIBLE = 1e9;

/* On compte les APPELS à la fonction, pas les tours de boucle : un test qui
   échoue est une évaluation lui aussi, et c’est lui qui arrête la boucle.
   Les confondre fait annoncer une évaluation de moins par boucle. */
let evaluations = 0;
const cout = (n) => { evaluations++; return n * Math.log2(n); };

/* Méthode 1 : la dichotomie. On encadre d’abord, puis on resserre. */
let borne = 2, toursEncadrement = 0;
while (cout(borne) <= CIBLE) { borne *= 2; toursEncadrement++; }
const evalEncadrement = evaluations;
let g = borne / 2, d = borne, tours = 0;
while (d - g > 1) { tours++; const m = Math.floor((g + d) / 2); if (cout(m) <= CIBLE) g = m; else d = m; }
const evalTotal = evaluations;
const reponse = d;

console.log('cible : n·log₂(n) > ' + CIBLE.toExponential(0));
console.log('');
console.log('encadrement par doublements : ' + toursEncadrement + ' doublements, ' + evalEncadrement +
  ' évaluations, intervalle [' + (borne / 2) + ', ' + borne + ']');
console.log('resserrement par dichotomie : ' + tours + ' tours, ' + (evalTotal - evalEncadrement) + ' évaluations');
console.log('total .......................: ' + evalTotal + ' évaluations de la fonction');
console.log('  (l’encadrement en fait une de plus que ses doublements : le test qui ÉCHOUE');
console.log('   est une évaluation lui aussi, et c’est celui-là qui arrête la boucle)');
console.log('');
console.log('réponse : n = ' + reponse);
console.log('  ' + (reponse - 1) + ' · log₂(' + (reponse - 1) + ') = ' + ((reponse - 1) * Math.log2(reponse - 1)).toFixed(0) + '  ≤ 10^9');
console.log('  ' + reponse + ' · log₂(' + reponse + ') = ' + (reponse * Math.log2(reponse)).toFixed(0) + '  > 10^9');

/* Méthode 2 : le témoin. Une boucle qui monte de 1 en 1, pour vérifier. */
/* Math.log2 est repris dans une variable locale : dans un bac à sable, chaque
   lecture de « Math » traverse le proxy du contexte, et la boucle en fait
   quarante millions. Sans cette ligne, ce programme passe de 0,3 s à plus de
   4 s — et frôle le plafond d'exécution de la page. */
const log2 = Math.log2;
let n = 1, evalBoucle = 0;
while ((evalBoucle++, n * log2(n)) <= CIBLE) n++;
console.log('');
console.log('TÉMOIN : la même réponse, cherchée de 1 en 1');
console.log('  réponse : ' + n + '   identique : ' + (n === reponse));
console.log('  évaluations de la fonction : ' + evalBoucle);
console.log('  rapport avec la dichotomie : ' + Math.round(evalBoucle / evalTotal) + ' fois plus');
console.log('');
console.log('La dichotomie a coûté ' + evalTotal + ' évaluations, la boucle ' + evalBoucle + '.');
console.log('Ces ' + evalTotal + ' évaluations valent à peu près 2·log₂(n) = ' + (2 * Math.log2(reponse)).toFixed(1) +
  ' : un encadrement');
console.log('par doublements, puis une dichotomie de même longueur. Le rapport vaut donc');
console.log('n / (2·log₂ n) ≈ ' + (reponse / (2 * Math.log2(reponse))).toExponential(2) + ', et il grandit avec n.');
console.log('C’est le même écart qu’entre une recherche linéaire et une recherche dichotomique,');
console.log('appliqué non pas à un tableau, mais à une PLAGE DE VALEURS. On n’a pas besoin');
console.log('d’un tableau pour faire une dichotomie : il suffit d’une fonction croissante.');
console.log('');
console.log(String(reponse));
