/* Exercice 3 (leçon 7) — l'échange de clés de Diffie-Hellman, en une page.
   Tout le mécanisme tient dans l'exponentiation modulaire de la leçon. */

function puissanceMod(base, exposant, m) {
  let r = 1n, b = BigInt(base) % BigInt(m), e = BigInt(exposant), M = BigInt(m);
  while (e > 0n) { if (e & 1n) r = (r * b) % M; b = (b * b) % M; e >>= 1n; }
  return Number(r);
}

// Paramètres publics : tout le monde les connaît, y compris l'espion.
const p = 2147483647;      // un nombre premier (2^31 - 1)
const g = 7;

// Chaque partie tire un secret et n'envoie que g^secret mod p.
const secretA = 123456789, secretB = 987654321;
const publicA = puissanceMod(g, secretA, p);
const publicB = puissanceMod(g, secretB, p);

console.log('publics  : p = ' + p + ', g = ' + g);
console.log('A envoie : ' + publicA);
console.log('B envoie : ' + publicB);

// Chacun élève le message reçu à SON secret. Les deux tombent sur la même valeur.
const partageA = puissanceMod(publicB, secretA, p);
const partageB = puissanceMod(publicA, secretB, p);
console.log('');
console.log('A calcule : ' + partageA);
console.log('B calcule : ' + partageB);
console.log('identiques ? ' + (partageA === partageB));
console.log('pourquoi : (g^b)^a = g^(ab) = (g^a)^b, modulo p.');

const sep = (n) => String(n).replace(/\B(?=(\d{3})+$)/g, ' ');

// L'espion a p, g, publicA et publicB. Il lui manque un logarithme discret.
// On mesure combien d'essais il faut pour retrouver secretA par force brute.
let essais = 0, trouve = -1, courant = 1;
const plafond = 3000000;
for (let x = 0; x < plafond; x++) {
  essais++;
  if (courant === publicA) { trouve = x; break; }
  courant = (courant * g) % p;                  // p < 2^31 : le produit reste exact
}
console.log('');
console.log('force brute sur le secret de A : ' + sep(essais) + ' essais');
console.log('trouve ? ' + (trouve >= 0 ? 'oui, x = ' + trouve : 'non, arrete au plafond'));
console.log('le vrai secret valait ' + sep(secretA) + ' : il aurait fallu ' +
  Math.round(secretA / plafond) + ' fois plus d\'essais.');
console.log('avec un p de 2048 bits, ce nombre depasse ce qu\'on sait compter.');
