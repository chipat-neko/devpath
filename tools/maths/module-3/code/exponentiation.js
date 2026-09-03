/* Calculer 7^1000 mod 13 sans jamais écrire 7^1000.
   On compte les multiplications : c'est une propriété de l'algorithme,
   pas de la machine, donc le même chiffre chez tout le monde. */

// La méthode naïve : multiplier n fois, en réduisant à chaque pas.
function puissanceNaive(base, exposant, m) {
  let r = 1n, mults = 0;
  for (let i = 0; i < exposant; i++) { r = (r * BigInt(base)) % BigInt(m); mults++; }
  return { valeur: r, mults: mults };
}

// L'exponentiation rapide : on regarde l'exposant en BINAIRE.
function puissanceRapide(base, exposant, m) {
  let r = 1n, b = BigInt(base) % BigInt(m), e = BigInt(exposant), M = BigInt(m), mults = 0;
  while (e > 0n) {
    if (e & 1n) { r = (r * b) % M; mults++; }   // le bit est à 1 : on prend ce facteur
    b = (b * b) % M; mults++;                   // on met le facteur au carré
    e >>= 1n;
  }
  return { valeur: r, mults: mults };
}

const cas = [[7, 1000, 13], [7, 100000, 13], [3, 65537, 1000003]];
console.log('base^exposant mod m        resultat   mults naif   mults rapide   rapport');
for (const [b, e, m] of cas) {
  const n = puissanceNaive(b, e, m), r = puissanceRapide(b, e, m);
  if (n.valeur !== r.valeur) throw new Error('les deux methodes divergent !');
  console.log(
    (b + '^' + e + ' mod ' + m).padEnd(26) +
    String(r.valeur).padStart(7) + String(n.mults).padStart(13) + String(r.mults).padStart(15) +
    ('    x' + Math.round(n.mults / r.mults)).padStart(11));
}

// Le cas qui décide de tout : la taille d'une clé RSA.
const bits = 2048;
const pire = 2n ** BigInt(bits) - 1n;           // pire cas : tous les bits à 1
let mults = 0, e = pire;
while (e > 0n) { if (e & 1n) mults++; mults++; e >>= 1n; }

const log10Naif = Math.log10(2) * bits;         // il faudrait environ 2^2048 multiplications
const parSeconde = 1e9;                         // un milliard par seconde, généreux
const ageUnivers = 4.35e17;                     // secondes : 13,8 milliards d'années
const enAges = Math.round(log10Naif - Math.log10(parSeconde) - Math.log10(ageUnivers));
console.log('');
console.log('un exposant de ' + bits + ' bits, tous a 1 (le pire cas)');
console.log('  methode naive  : environ 10^' + Math.round(log10Naif) + ' multiplications');
console.log('  methode rapide : ' + mults + ' multiplications, soit au plus 2 par bit');
console.log('  a un milliard de multiplications par seconde, la naive demanderait environ');
console.log("  10^" + enAges + " fois l'age de l'Univers. La rapide tient dans un battement de cil.");

// Vérification indépendante : la méthode rapide contre le calcul exact en BigInt.
let ecarts = 0, verifs = 0;
for (let b = 2; b <= 12; b++) {
  for (let ex = 0; ex <= 40; ex++) {
    for (const m of [13, 97, 1000003]) {
      verifs++;
      if (puissanceRapide(b, ex, m).valeur !== (BigInt(b) ** BigInt(ex)) % BigInt(m)) ecarts++;
    }
  }
}
console.log('');
console.log('controle : ' + verifs + ' cas compares au calcul exact, ' + ecarts + ' ecart(s).');
