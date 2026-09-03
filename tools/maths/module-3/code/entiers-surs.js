/* Le second visage du problème : les grands ENTIERS.
   Ici il n'y a plus d'histoire de virgule — et pourtant les nombres sont faux. */

console.log('Number.MAX_SAFE_INTEGER = ' + Number.MAX_SAFE_INTEGER + '  (2^53 - 1)');
console.log('9007199254740992 + 1  = ' + (9007199254740992 + 1));
console.log('9007199254740993      = ' + 9007199254740993 + '   <- ecrit tel quel dans le code source');
console.log('les deux sont-ils egaux ? ' + (9007199254740992 + 1 === 9007199254740993));

// Le passage par JSON : l'endroit exact où les identifiants se cassent.
const brut = '{"id": 9007199254740993, "nom": "commande"}';
const objet = JSON.parse(brut);
console.log('');
console.log('JSON recu   : ' + brut);
console.log('apres parse : ' + JSON.stringify(objet));
console.log('identifiant conserve ? ' + (JSON.stringify(objet).indexOf('9007199254740993') >= 0));
console.log('=> l\'identifiant a change AVANT que la moindre ligne de code metier ne s\'execute.');

// Combien d'identifiants d'un service réel sont concernés ? On compte les bits.
console.log('');
console.log('type d\'identifiant                 bits   depasse 2^53 ?');
const ids = [
  ['entier 32 bits (auto-increment)', 32],
  ['identifiant type « snowflake »', 64],
  ['UUID', 128],
];
for (const [nom, bits] of ids) {
  console.log(nom.padEnd(35) + String(bits).padEnd(7) + (bits > 53 ? 'OUI' : 'non'));
}

// La parade : BigInt. Exact, mais il ne se mélange pas aux Number.
const grand = 9007199254740993n;
console.log('');
console.log('BigInt : ' + grand + ' + 1n = ' + (grand + 1n));
console.log('BigInt compare a Number : 9007199254740993n == 9007199254740993 ? ' + (grand == 9007199254740993));
let erreur = '';
try { const x = grand + 1; } catch (e) { erreur = e.name + ' : ' + e.message; }
console.log('BigInt + Number -> ' + erreur);
console.log('JSON.stringify d\'un BigInt -> ' + (function () {
  try { return JSON.stringify({ id: grand }); } catch (e) { return e.name + ' : ' + e.message; }
})());
console.log('=> la seule methode sure : transporter ces identifiants en CHAINE de caracteres.');

// Le contrôle qui vaut la peine d'être écrit une fois pour toutes.
function idSuspect(valeur) {
  return typeof valeur === 'number' && Number.isInteger(valeur) && !Number.isSafeInteger(valeur);
}
console.log('');
console.log('valeur                  suspecte ?');
for (const v of [42, 9007199254740991, 9007199254740993, 1.5, '9007199254740993']) {
  console.log(String(v).padEnd(24) + idSuspect(v));
}
