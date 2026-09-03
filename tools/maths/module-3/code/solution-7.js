/* Exercice 1 (leçon 9) — la boucle qui ne s'arrête pas. */

// La version fautive : on avance de 0.1 et on teste l'égalité.
let x = 0, tours = 0;
while (x !== 1 && tours < 100) { x += 0.1; tours++; }
console.log('boucle « tant que x !== 1 », en avancant de 0.1 :');
console.log('  tours effectues avant le garde-fou : ' + tours);
console.log('  x vaut ' + x + ' — il a DEPASSE 1 sans jamais l\'egaler.');
let cumul = 0;
for (let i = 0; i < 10; i++) cumul += 0.1;
console.log("  apres exactement 10 tours, le cumul vaut " + cumul + " et non 1.");
console.log("  a noter : 0.1 * 10 vaut " + (0.1 * 10) + " — la MULTIPLICATION tombe juste, pas l'accumulation.");

// Version 1 : compter en entiers, diviser à l'usage. Le compteur reste exact.
const pas = [];
for (let i = 0; i <= 10; i++) pas.push(i / 10);
console.log('');
console.log('en comptant des entiers : ' + pas.join(' '));
console.log('la valeur 1 est-elle atteinte exactement ? ' + pas.includes(1));

// Version 2 : comparer avec une tolérance adaptée à l'échelle.
const presqueEgal = (a, b, tol) => Math.abs(a - b) <= (tol === undefined ? 1e-9 : tol) * Math.max(1, Math.abs(a), Math.abs(b));
let y = 0, t2 = 0;
while (!presqueEgal(y, 1) && t2 < 100) { y += 0.1; t2++; }
console.log('');
console.log('avec une tolerance : ' + t2 + ' tours, y = ' + y);

// Le contrôle : les deux versions donnent-elles les mêmes 11 valeurs ?
let ecarts = 0;
for (let i = 0; i <= 10; i++) {
  let z = 0;
  for (let k = 0; k < i; k++) z += 0.1;
  if (!presqueEgal(z, i / 10)) ecarts++;
}
console.log('');
console.log('11 etapes comparees entre accumulation et division : ' + ecarts + ' ecart au-dela de la tolerance');
console.log('mais en egalite STRICTE : ' + (function () {
  let n = 0;
  for (let i = 0; i <= 10; i++) { let z = 0; for (let k = 0; k < i; k++) z += 0.1; if (z !== i / 10) n++; }
  return n;
})() + ' etapes sur 11 different.');
console.log('=> compter en entiers n\'est pas une precaution : c\'est la seule facon de');
console.log('   savoir OU on en est. Une boucle sur des flottants ne sait pas compter ses tours.');

// La réponse demandée, seule sur la dernière ligne.
console.log(t2);
