/* Exercice 1 (leçon 7) — un index circulaire qui accepte les pas négatifs. */
const mod = (a, n) => ((a % n) + n) % n;

const jours = ['lun', 'mar', 'mer', 'jeu', 'ven', 'sam', 'dim'];
const decaler = (depart, pas) => jours[mod(depart + pas, jours.length)];
const decalerNaif = (depart, pas) => jours[(depart + pas) % jours.length];

console.log('depart : ' + jours[2] + ' (indice 2)');
console.log('pas    correct   naif');
for (const pas of [-9, -7, -5, -3, -1, 0, 1, 7, 30]) {
  console.log('  ' + String(pas).padStart(3) + '     ' + decaler(2, pas).padEnd(9) + (decalerNaif(2, pas) || 'undefined'));
}

// Contrôle sur 2001 pas, de -1000 à +1000 : combien de fois chaque version se trompe ?
let horsCorrect = 0, horsNaif = 0, divergences = 0;
for (let p = -1000; p <= 1000; p++) {
  if (decaler(2, p) === undefined) horsCorrect++;
  if (decalerNaif(2, p) === undefined) horsNaif++;
  if (decaler(2, p) !== decalerNaif(2, p)) divergences++;
}
console.log('');
console.log('2001 pas essayes de -1000 a +1000');
console.log('  version corrigee, indices hors tableau : ' + horsCorrect);
console.log('  version naive,    indices hors tableau : ' + horsNaif);
console.log('  pas ou les deux versions divergent     : ' + divergences);
console.log('  soit ' + (100 * divergences / 2001).toFixed(1) + ' % des pas essayes');

// La réponse demandée, seule sur la dernière ligne.
console.log(horsNaif);
