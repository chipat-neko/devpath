/* Euclide étendu : le même algorithme, mais qui rend AUSSI les coefficients
   u et v tels que a*u + b*v = pgcd(a, b). C'est ce qui donne l'inverse modulaire,
   et l'inverse modulaire est la clé privée de RSA. */

function euclideEtendu(a, b) {
  let r0 = a, r1 = b, u0 = 1, u1 = 0, v0 = 0, v1 = 1, etapes = 0;
  while (r1 !== 0) {
    etapes++;
    const q = Math.floor(r0 / r1);
    [r0, r1] = [r1, r0 - q * r1];
    [u0, u1] = [u1, u0 - q * u1];
    [v0, v1] = [v1, v0 - q * v1];
  }
  return { pgcd: r0, u: u0, v: v0, etapes: etapes };
}

console.log('a      b      pgcd   u        v        verification a*u + b*v');
for (const [a, b] of [[240, 46], [1071, 462], [17, 3120], [65537, 999983]]) {
  const e = euclideEtendu(a, b);
  console.log(String(a).padEnd(7) + String(b).padEnd(7) + String(e.pgcd).padEnd(7) +
    String(e.u).padEnd(9) + String(e.v).padEnd(9) + (a * e.u + b * e.v));
}

// L'INVERSE MODULAIRE : le nombre x tel que a*x ≡ 1 (mod m). Il n'existe que si pgcd(a,m) = 1.
function inverseMod(a, m) {
  const e = euclideEtendu(a, m);
  if (e.pgcd !== 1) return null;                // pas inversible
  return ((e.u % m) + m) % m;
}

console.log('');
console.log('a        m         inverse    controle a*inverse mod m');
for (const [a, m] of [[3, 7], [17, 3120], [10, 15], [65537, 999982]]) {
  const inv = inverseMod(a, m);
  console.log(String(a).padEnd(9) + String(m).padEnd(10) +
    String(inv === null ? 'aucun' : inv).padEnd(11) +
    (inv === null ? 'pgcd(' + a + ',' + m + ') = ' + euclideEtendu(a, m).pgcd + ' : impossible' : ((a * inv) % m)));
}

// Combien de nombres sont inversibles modulo m ? On les compte.
console.log('');
console.log('m      inversibles   proportion');
for (const m of [12, 13, 30, 31, 100, 101]) {
  let c = 0;
  for (let a = 1; a < m; a++) if (inverseMod(a, m) !== null) c++;
  console.log(String(m).padEnd(7) + String(c).padEnd(14) + (100 * c / (m - 1)).toFixed(1) + ' %');
}
console.log('=> quand m est premier, TOUT est inversible sauf 0. C\'est la propriete que RSA exploite.');

// RSA en miniature : on chiffre et on déchiffre un nombre.
function puissanceMod(base, exp, m) {
  let r = 1n, b = BigInt(base) % BigInt(m), e = BigInt(exp), M = BigInt(m);
  while (e > 0n) { if (e & 1n) r = (r * b) % M; b = (b * b) % M; e >>= 1n; }
  return Number(r);
}
const p = 1009, q = 991;                        // deux premiers, minuscules pour l'exemple
const n = p * q, phi = (p - 1) * (q - 1);
const e = 65537;
const d = inverseMod(e, phi);                   // la clé privée EST un inverse modulaire
console.log('');
console.log('p = ' + p + ', q = ' + q + '  ->  n = ' + n + ', phi = ' + phi);
console.log('exposant public e  = ' + e);
console.log('exposant prive  d  = ' + d + '   (e*d mod phi = ' + ((e * d) % phi) + ')');

let ok = 0, total = 0;
for (let message = 2; message < 1000; message++) {
  total++;
  const chiffre = puissanceMod(message, e, n);
  if (puissanceMod(chiffre, d, n) === message) ok++;
}
console.log('messages chiffres puis dechiffres : ' + ok + ' / ' + total + ' retrouves a l\'identique');
console.log('exemple : 42 -> ' + puissanceMod(42, e, n) + ' -> ' + puissanceMod(puissanceMod(42, e, n), d, n));
