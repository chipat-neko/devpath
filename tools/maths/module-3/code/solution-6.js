/* Exercice 3 (leçon 8) — casser une clé RSA jouet.
   On ne connaît que la clé PUBLIQUE (n, e) et un message chiffré. */

function puissanceMod(base, exp, m) {
  let r = 1n, b = BigInt(base) % BigInt(m), e = BigInt(exp), M = BigInt(m);
  while (e > 0n) { if (e & 1n) r = (r * b) % M; b = (b * b) % M; e >>= 1n; }
  return Number(r);
}
function euclideEtendu(a, b) {
  let r0 = a, r1 = b, u0 = 1, u1 = 0;
  while (r1 !== 0) { const q = Math.floor(r0 / r1); [r0, r1] = [r1, r0 - q * r1]; [u0, u1] = [u1, u0 - q * u1]; }
  return { pgcd: r0, u: u0 };
}
const inverseMod = (a, m) => { const e = euclideEtendu(a, m); return e.pgcd === 1 ? ((e.u % m) + m) % m : null; };

// Ce que l'attaquant voit, et rien d'autre.
const nPublic = 3232483, ePublic = 65537, chiffre = 1792031;
console.log('cle publique : n = ' + nPublic + ', e = ' + ePublic);
console.log('message intercepte : ' + chiffre);

// ÉTAPE 1 : factoriser n. C'est la seule étape difficile — et elle ne l'est pas ici.
let p = 0, divisions = 0;
for (let d = 2; d * d <= nPublic; d++) { divisions++; if (nPublic % d === 0) { p = d; break; } }
const q = nPublic / p;
console.log('');
const estPremier = (x) => { if (x < 2) return false; for (let d = 2; d * d <= x; d++) if (x % d === 0) return false; return true; };
console.log('etape 1 : factoriser n en ' + divisions + ' divisions  ->  ' + p + ' x ' + q + ' = ' + p * q);
console.log('          les deux facteurs sont-ils premiers ? ' + estPremier(p) + ' et ' + estPremier(q));

// ÉTAPE 2 : phi, puis d — qui n'est qu'un inverse modulaire.
const phi = (p - 1) * (q - 1);
const d = inverseMod(ePublic, phi);
console.log('etape 2 : phi = ' + phi + ', puis d = ' + d + '   (e*d mod phi = ' + ((ePublic * d) % phi) + ')');

// ÉTAPE 3 : déchiffrer.
const clair = puissanceMod(chiffre, d, nPublic);
console.log('etape 3 : message en clair = ' + clair);
console.log('controle : on rechiffre ' + clair + ' -> ' + puissanceMod(clair, ePublic, nPublic));

// Le point de la leçon : la sécurité ne tient QU'À la taille de n.
console.log('');
console.log('taille de n   divisions pour le factoriser');
for (const [pp, qq] of [[1009, 991], [31607, 31627], [999983, 999979]]) {
  const nn = pp * qq;
  let c = 0;
  for (let dd = 2; dd * dd <= nn; dd++) { c++; if (nn % dd === 0) break; }
  console.log((String(nn).length + ' chiffres').padEnd(14) + c);
}
console.log('une vraie cle RSA a 617 chiffres. Le nombre de divisions y est de l\'ordre de 10^308.');
console.log('c\'est le meme algorithme : seule la taille change, et elle change tout.');
