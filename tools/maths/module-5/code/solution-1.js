/* Exercice 1 — classer « mystere » sans lire son code, par le test du doublement. */

/* La fonction à classer, donnée dans l’énoncé. */
function mystere(t) {
  let total = 0;
  for (let i = 0; i < t.length; i++) {
    for (let j = i; j < t.length; j += 1) total += t[i] * t[j];
    for (let k = 1; k < t.length; k *= 2) total += t[k];
  }
  return total;
}

/* On ne peut pas compter les opérations d’une fonction qu’on n’a pas le droit
   de modifier. On compte donc les accès au TABLEAU, en lui posant un mouchard. */
function tableauMouchard(n, compteur) {
  const brut = [];
  for (let i = 0; i < n; i++) brut.push(i + 1);
  return new Proxy(brut, {
    get: function (cible, cle) {
      if (typeof cle === 'string' && /^\d+$/.test(cle)) compteur.n++;
      return cible[cle];
    },
  });
}

const TAILLES = [125, 250, 500, 1000];
const comptes = TAILLES.map(function (n) {
  const c = { n: 0 };
  mystere(tableauMouchard(n, c));
  return c.n;
});

console.log('   n     accès au tableau   rapport');
console.log('  ----   ----------------   -------');
TAILLES.forEach(function (n, i) {
  const r = i === 0 ? '' : (comptes[i] / comptes[i - 1]).toFixed(3);
  console.log('  ' + String(n).padStart(4) + '   ' + String(comptes[i]).padStart(16) + '   ' + r.padStart(7));
});

const dernierRapport = comptes[comptes.length - 1] / comptes[comptes.length - 2];
const exposant = Math.log2(dernierRapport);
console.log('');
console.log('dernier rapport : ' + dernierRapport.toFixed(3));
console.log('exposant déduit : log₂(' + dernierRapport.toFixed(3) + ') = ' + exposant.toFixed(2));
console.log('');
console.log('La boucle interne en j fait n, n−1, …, 1 tours : n(n+1)/2 au total.');
console.log('La boucle en k fait log₂n tours, n fois : n·log₂n, négligeable devant n².');
console.log('« mystere » est donc en O(n²), et la mesure le confirme sans l’avoir lu.');
console.log('');
console.log(exposant.toFixed(2));
