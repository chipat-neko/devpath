/* Le modulo est exact… tant que le produit qu'on réduit l'est aussi.
   Voici le moment précis où (a * b) % m se met à mentir en JavaScript. */

const SUR = Number.MAX_SAFE_INTEGER;            // 2^53 - 1
console.log('Number.MAX_SAFE_INTEGER = ' + SUR + '   (2^53 - 1)');
console.log('MAX + 1 === MAX + 2 ?     ' + (SUR + 1 === SUR + 2) + '   <- deux entiers differents, une seule valeur');

// Où le produit cesse-t-il d'être exact ? On cherche, on ne suppose pas.
// ATTENTION : passé k = 53, « 2^k - 1 » n'est DÉJÀ PLUS représentable — le programme
// comparerait alors un nombre corrompu à lui-même et conclurait « juste ». On s'arrête.
const m = 1000003;
let premierEcart = null, essais = 0, faux = 0, refuses = 0;
for (let k = 20; k <= 60; k++) {
  const a = 2 ** k - 1;
  if (!Number.isSafeInteger(a)) { refuses++; continue; }   // a lui-même est déjà arrondi
  essais++;
  const enNombre = (a * a) % m;
  const enBigInt = Number((BigInt(a) * BigInt(a)) % BigInt(m));
  if (enNombre !== enBigInt) {
    faux++;
    if (premierEcart === null) premierEcart = { k: k, a: a, obtenu: enNombre, exact: enBigInt };
  }
}
console.log('');
console.log('carres de 2^k - 1 reduits modulo ' + m + ' : ' + essais + ' essais jugeables, ' + faux + ' faux');
console.log('valeurs de k ecartees parce que 2^k - 1 n est deja plus exact : ' + refuses);
console.log('premier ecart a k = ' + premierEcart.k + ' :');
console.log('  a          = ' + premierEcart.a);
console.log('  (a*a) % m  = ' + premierEcart.obtenu + '   <- faux');
console.log('  exact      = ' + premierEcart.exact);

// Le produit lui-même, vu de près.
const a = 2 ** 27 - 1;
console.log('');
console.log('a * a en Number : ' + a * a);
console.log('a * a en BigInt : ' + (BigInt(a) * BigInt(a)));
console.log('ecart absolu    : ' + (BigInt(a) * BigInt(a) - BigInt(a * a)));

// LA RÈGLE UTILISABLE : le produit de deux valeurs réduites doit tenir sous 2^53.
// La condition exacte est (m-1)^2 <= 2^53 - 1. On cherche le plus grand m.
let limiteExacte = 0;
for (let m2 = 2; m2 < 200000000; m2++) { if ((m2 - 1) * (m2 - 1) <= SUR) limiteExacte = m2; else break; }
let bits = 0;
for (let b = 10; b <= 32; b++) { const mm = 2 ** b; if ((mm - 1) * (mm - 1) <= SUR) bits = b; }
console.log('');
console.log('plus grand modulo sur lequel (a*b) % m reste exact : ' + limiteExacte);
console.log('regle mnemotechnique, plus prudente : m tient sur ' + bits + ' bits, soit m <= ' + 2 ** bits);
console.log('a m = 2^26 exactement, le calcul est encore juste : ' + (((2 ** 26 - 1) * (2 ** 26 - 1)) % (2 ** 26) === Number((BigInt(2 ** 26 - 1) ** 2n) % BigInt(2 ** 26))));

// L'ÉCART N'EST PAS TOUJOURS D'UNE UNITÉ. Sur des opérandes quelconques, il enfle.
let g = 20260903;
const tir = () => ((g = (Math.imul(g, 1664525) + 1013904223) >>> 0) >>> 0) / 4294967296;
let pire = { ecart: 0n };
for (let i = 0; i < 300000; i++) {
  const a = Math.floor(tir() * 2 ** 45), b = Math.floor(tir() * 2 ** 45);
  const e = BigInt(a) * BigInt(b) - BigInt(a * b);
  const abs = e < 0n ? -e : e;
  if (abs > pire.ecart) pire = { ecart: abs, a: a, b: b };
}
console.log('');
console.log('300 000 produits de deux entiers sous 2^45 :');
console.log('  pire ecart absolu observe : ' + pire.ecart);
console.log('  sur a = ' + pire.a + ', b = ' + pire.b);
console.log('  exact  = ' + BigInt(pire.a) * BigInt(pire.b));
console.log('  Number = ' + BigInt(pire.a * pire.b));
console.log('=> l ecart croit avec le produit : ce n est pas « une ou deux unites ».');

// La parade sans BigInt : multiplier modulo m par doublements successifs.
function multMod(x, y, mod) {
  let r = 0;
  x %= mod;
  while (y > 0) {
    if (y % 2 === 1) r = (r + x) % mod;         // additions seules : jamais de produit géant
    x = (x * 2) % mod;
    y = Math.floor(y / 2);
  }
  return r;
}
let ok = 0, total = 0;
for (let i = 0; i < 200; i++) {
  const x = 4503599627 + i * 7919, y = 987654321 + i * 104729, mm = 4294967291;
  total++;
  if (multMod(x, y, mm) === Number((BigInt(x) * BigInt(y)) % BigInt(mm))) ok++;
}
console.log('multiplication par doublements, modulo 4294967291 : ' + ok + ' / ' + total + ' exactes');
