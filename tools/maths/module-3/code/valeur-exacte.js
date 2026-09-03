/* Ce que 0.1 vaut VRAIMENT. Pas « à peu près » : la valeur exacte, tous ses chiffres.
   Un nombre flottant est un entier multiplié par une puissance de 2 ; on retrouve les deux,
   puis on écrit le résultat en décimal sans rien arrondir. */

function bits(x) {                              // les 64 bits du nombre, tels quels
  const buf = new DataView(new ArrayBuffer(8));
  buf.setFloat64(0, x);
  let n = 0n;
  for (let i = 0; i < 8; i++) n = (n << 8n) | BigInt(buf.getUint8(i));
  return n;
}

function decompose(x) {
  const n = bits(x);
  const signe = Number(n >> 63n);
  const exposantBrut = Number((n >> 52n) & 0x7ffn);
  const fraction = n & 0xfffffffffffffn;
  // exposant non nul : la mantisse a un 1 implicite devant.
  const mantisse = exposantBrut === 0 ? fraction : (1n << 52n) | fraction;
  const exposant = (exposantBrut === 0 ? -1074 : exposantBrut - 1075);
  return { signe: signe, mantisse: mantisse, exposant: exposant, exposantBrut: exposantBrut };
}

function exact(x) {                             // l'écriture décimale exacte, sans arrondi
  const d = decompose(x);
  if (d.exposant >= 0) return (d.mantisse << BigInt(d.exposant)).toString();
  const k = -d.exposant;                        // valeur = mantisse / 2^k = mantisse * 5^k / 10^k
  const numerateur = (d.mantisse * 5n ** BigInt(k)).toString().padStart(k + 1, '0');
  const partieEntiere = numerateur.slice(0, numerateur.length - k);
  const decimales = numerateur.slice(numerateur.length - k).replace(/0+$/, '') || '0';
  return partieEntiere + '.' + decimales;
}

for (const x of [0.1, 0.2, 0.3, 0.5, 0.25]) {
  const d = decompose(x);
  console.log('');
  console.log(x + '  =  ' + d.mantisse + ' x 2^' + d.exposant);
  console.log('   valeur exacte : ' + exact(x));
  console.log('   chiffres apres la virgule : ' + exact(x).split('.')[1].length);
}

console.log('');
console.log('0.5 et 0.25 tombent juste : ce sont des puissances de 2 (1/2 et 1/4).');
console.log('0.1 ne tombe pas juste, pour la meme raison qu\'un tiers ne tombe pas juste en base 10.');

// La preuve que 0.1 + 0.2 et 0.3 ne sont PAS le même nombre.
console.log('');
console.log('0.1 + 0.2 exactement : ' + exact(0.1 + 0.2));
console.log('0.3       exactement : ' + exact(0.3));
console.log('egaux ? ' + (0.1 + 0.2 === 0.3));
console.log('ecart   : ' + (0.1 + 0.2 - 0.3));
console.log('ecart en nombre de flottants consecutifs : ' +
  Number(bits(0.1 + 0.2) - bits(0.3)) + '   <- ils sont VOISINS, mais distincts.');

// QUELLES fractions décimales tombent juste ? Celles dont le dénominateur réduit
// est une puissance de 2 — car la base 2 ne sait écrire que des moitiés de moitiés.
function pgcd(a, b) { while (b) { const t = a % b; a = b; b = t; } return a; }
const justes = [];
for (let i = 1; i <= 100; i++) {
  const den = 10 / pgcd(i, 10);                 // dénominateur de i/10 une fois réduit
  if ((den & (den - 1)) === 0) justes.push(i / 10);   // puissance de 2 ?
}
console.log('');
console.log('parmi 0.1, 0.2, … 10.0 : ' + justes.length + ' valeurs sur 100 sont exactes');
console.log('  ' + justes.join(' '));
console.log('ce sont exactement les multiples de 0.5. Toutes les autres sont approchees.');

// Contrôle : la propriété annoncée se vérifie sur les 100 valeurs.
let desaccords = 0;
for (let i = 1; i <= 100; i++) {
  const v = i / 10;
  const tombeJuste = exact(v).replace(/^\d+\./, '').length <= 1;
  const den = 10 / pgcd(i, 10);
  if (tombeJuste !== ((den & (den - 1)) === 0)) desaccords++;
}
console.log('regle confrontee aux 100 ecritures exactes : ' + desaccords + ' desaccord(s)');
