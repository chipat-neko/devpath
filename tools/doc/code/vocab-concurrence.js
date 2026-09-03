/* « race condition » — le mot le plus mal traduit du métier, et le seul de
   cette leçon dont la démonstration a besoin du temps qui passe.
   Deux tâches lisent la même valeur AVANT que l'autre ait écrit. Une des deux
   mises à jour est perdue, et rien ne le signale. */

let compteur = 0;

async function incrementer(nom) {
  const lu = compteur;              // je lis
  await null;                       // je rends la main : l'autre tâche passe ici
  compteur = lu + 1;                // j'écris ce que j'avais lu — pas ce qui est
  console.log(nom + ' a lu ' + lu + ' et écrit ' + compteur);
}

/* « lazy » — un générateur ne calcule rien tant qu'on ne lui demande rien. */
let tours = 0;
function* compter() {
  for (let i = 1; i <= 1000; i++) { tours++; yield i; }
}
const suite = compter();
console.log('générateur créé, tours effectués :', tours);
console.log('premier next() :', suite.next().value, '— tours effectués :', tours);

/* « pending / fulfilled / rejected » — les trois états d'une promesse.
   « resolved » n'en fait pas partie, bien qu'on le lise partout. */
const enAttente = new Promise(function () { /* jamais tenue */ });
console.log('une promesse sans résolution reste', 'pending', '—', typeof enAttente.then);

Promise.all([incrementer('tâche A'), incrementer('tâche B')]).then(function () {
  console.log('deux incréments, compteur =', compteur, '(attendu : 2)');
  console.log(compteur === 2 ? 'pas de perte' : 'une mise à jour a été PERDUE');
});
