/* Exercice 2 (leçon 7) — vérifier un IBAN, c'est un modulo 97 sur un nombre de 29 chiffres.
   Or 29 chiffres ne tiennent pas dans un Number : il faut réduire au fil de l'eau. */

function ibanEnChiffres(iban) {
  const propre = iban.replace(/\s/g, '').toUpperCase();
  const permute = propre.slice(4) + propre.slice(0, 4);   // les 4 premiers passent à la fin
  let s = '';
  for (const c of permute) s += /[0-9]/.test(c) ? c : String(c.charCodeAt(0) - 55); // A=10 … Z=35
  return s;
}

// La réduction progressive : on avance chiffre par chiffre, en gardant le reste.
function mod97(chiffres) {
  let reste = 0;
  for (const c of chiffres) reste = (reste * 10 + Number(c)) % 97;
  return reste;
}

const iban = 'FR76 3000 6000 0112 3456 7890 189';
const chiffres = ibanEnChiffres(iban);
console.log('IBAN                : ' + iban);
console.log('en chiffres         : ' + chiffres);
console.log('longueur            : ' + chiffres.length + ' chiffres');
console.log('reste modulo 97     : ' + mod97(chiffres) + '   -> valide ? ' + (mod97(chiffres) === 1));

// La preuve que la réduction progressive donne le même résultat que le calcul exact.
console.log('');
console.log('meme calcul en BigInt : ' + Number(BigInt(chiffres) % 97n));
console.log('en Number, sans reduction : ' + (Number(chiffres) % 97) + '   <- Number(' + chiffres.slice(0, 8) + '…) a deja perdu des chiffres');
console.log('valeur relue par Number   : ' + BigInt(Number(chiffres)) + '   <- ce ne sont plus les memes chiffres');

// Et sur des IBAN abîmés : on essaie toutes les fautes d'un chiffre.
let essais = 0, vues = 0;
for (let i = 4; i < iban.replace(/\s/g, '').length; i++) {
  const propre = iban.replace(/\s/g, '');
  if (!/[0-9]/.test(propre[i])) continue;
  for (let d = 0; d <= 9; d++) {
    if (String(d) === propre[i]) continue;
    essais++;
    if (mod97(ibanEnChiffres(propre.slice(0, i) + d + propre.slice(i + 1))) !== 1) vues++;
  }
}
console.log('');
console.log('fautes d\'un chiffre essayees : ' + essais + ', detectees : ' + vues + '  (' + (100 * vues / essais).toFixed(1) + ' %)');
