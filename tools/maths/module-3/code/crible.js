/* Le crible d'Ératosthène : au lieu de tester chaque nombre, on raye les multiples.
   Décrit vers 250 avant notre ère, et toujours la meilleure façon de lister les
   premiers d'un intervalle. On compte les rayures — pas le temps, qui dependrait
   de la machine et de l etat du compilateur a la volee. */

function crible(n) {
  const compose = new Array(n + 1).fill(false);
  let rayures = 0;
  for (let p = 2; p * p <= n; p++) {
    if (compose[p]) continue;                   // déjà rayé : ce n'est pas un premier
    for (let k = p * p; k <= n; k += p) { compose[k] = true; rayures++; }
  }
  const premiers = [];
  for (let i = 2; i <= n; i++) if (!compose[i]) premiers.push(i);
  return { premiers: premiers, rayures: rayures };
}

const r = crible(100);
console.log('premiers jusqu\'a 100 (' + r.premiers.length + ') :');
console.log('  ' + r.premiers.join(' '));
console.log('rayures effectuees : ' + r.rayures);

// Pourquoi commencer à p*p ? Parce que 2p, 3p… ont déjà été rayés par un premier plus petit.
function cribleDepuisDeuxP(n) {
  const compose = new Array(n + 1).fill(false);
  let rayures = 0;
  for (let p = 2; p <= n; p++) {
    if (compose[p]) continue;
    for (let k = 2 * p; k <= n; k += p) { compose[k] = true; rayures++; }
  }
  return rayures;
}
console.log('');
console.log('taille       rayures depuis p*p    rayures depuis 2p     economie');
for (const n of [1000, 100000, 1000000]) {
  const a = crible(n).rayures, b = cribleDepuisDeuxP(n);
  console.log(String(n).padEnd(13) + String(a).padEnd(22) + String(b).padEnd(22) +
    (100 * (b - a) / b).toFixed(1) + ' %');
}

// Le crible contre le test un par un, à travail égal : lister les premiers jusqu'à 100 000.
function parTests(n) {
  let divisions = 0, c = 0;
  for (let x = 2; x <= n; x++) {
    let premier = true;
    for (let d = 2; d * d <= x; d++) { divisions++; if (x % d === 0) { premier = false; break; } }
    if (premier) c++;
  }
  return { divisions: divisions, premiers: c };
}
const n = 100000;
const parCrible = crible(n), parTest = parTests(n);
console.log('');
console.log('lister les premiers jusqu\'a ' + n + ' :');
console.log('  crible : ' + parCrible.rayures + ' rayures, ' + parCrible.premiers.length + ' premiers');
console.log('  tests  : ' + parTest.divisions + ' divisions, ' + parTest.premiers + ' premiers');
console.log('  rapport des operations : x' + (parTest.divisions / parCrible.rayures).toFixed(1));
console.log('  memes premiers ? ' + (parCrible.premiers.length === parTest.premiers));

// Ce que le crible coûte en mémoire, et pourquoi il ne passe pas à l'échelle cryptographique.
const octets256 = Math.round(Math.log10(2) * 256 - Math.log10(8));
console.log('');
console.log("un crible jusqu'a 10^6 tient dans " + (1e6 / 8 / 1024).toFixed(0) + " Ko, a un bit par nombre.");
console.log("jusqu'a 2^256, il en faudrait 10^" + octets256 + " octets, alors que l'Univers");
console.log("observable compte de l'ordre de 10^80 atomes. C'est pourquoi la cryptographie");
console.log("ne cherche pas ses premiers dans une liste : elle les TESTE un par un.");
