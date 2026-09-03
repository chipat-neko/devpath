/* La fonction à classer. Tu n'as pas le droit de la modifier : le test du
   doublement doit fonctionner sur du code qu'on ne touche pas. */
function mystere(t) {
  let total = 0;
  for (let i = 0; i < t.length; i++) {
    for (let j = i; j < t.length; j += 1) total += t[i] * t[j];
    for (let k = 1; k < t.length; k *= 2) total += t[k];
  }
  return total;
}
