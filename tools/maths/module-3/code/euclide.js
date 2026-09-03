/* L'algorithme d'Euclide, environ 300 avant notre ère, tient en trois lignes
   et reste l'algorithme de référence : le PGCD binaire de Stein le bat en vitesse,
   mais aucune méthode ne change la nature LOGARITHMIQUE du coût. On compte ses étapes. */

function pgcdSoustraction(a, b) {               // la version d'origine : que des soustractions
  let etapes = 0;
  while (a !== b) { etapes++; if (a > b) a -= b; else b -= a; }
  return { pgcd: a, etapes: etapes };
}

function pgcd(a, b) {                           // la version moderne : un modulo par étape
  let etapes = 0;
  while (b !== 0) { etapes++; const t = a % b; a = b; b = t; }
  return { pgcd: a, etapes: etapes };
}

// POURQUOI ça marche : tout diviseur commun de a et b divise aussi a - b, donc a % b.
// L'ensemble des diviseurs communs ne change jamais ; seuls les nombres rapetissent.
console.log('paire                    pgcd   etapes (modulo)   etapes (soustraction)');
for (const [a, b] of [[48, 18], [1071, 462], [1000000, 999999], [514229, 317811]]) {
  const m = pgcd(a, b), s = pgcdSoustraction(a, b);
  console.log((a + ' et ' + b).padEnd(25) + String(m.pgcd).padEnd(7) +
    String(m.etapes).padStart(11) + String(s.etapes).padStart(23));
}

// LE PIRE CAS n'est pas une supposition : on le cherche sur toutes les paires jusqu'à 1000.
let pire = { etapes: -1 };
for (let a = 1; a <= 1000; a++) {
  for (let b = 1; b <= a; b++) {
    const r = pgcd(a, b);
    if (r.etapes > pire.etapes) pire = { a: a, b: b, etapes: r.etapes };
  }
}
console.log('');
console.log('pire cas sur toutes les paires jusqu\'a 1000 : ' + pire.a + ' et ' + pire.b + ', ' + pire.etapes + ' etapes');

// Ces deux nombres ne sont pas quelconques : ce sont deux termes consécutifs de Fibonacci.
const fib = [1, 1];
while (fib[fib.length - 1] < 2000) fib.push(fib[fib.length - 1] + fib[fib.length - 2]);
console.log('suite de Fibonacci : ' + fib.join(' '));
console.log(pire.a + ' et ' + pire.b + ' y figurent-ils cote a cote ? ' +
  (fib.indexOf(pire.a) > 0 && fib[fib.indexOf(pire.a) - 1] === pire.b));

// Le nombre d'étapes croît comme le LOGARITHME du plus petit des deux nombres.
console.log('');
console.log('taille des nombres    pire nombre d\'etapes mesure');
let f = [1, 1];
for (let k = 0; k < 40; k++) f.push(f[f.length - 1] + f[f.length - 2]);
for (const chiffres of [3, 6, 9]) {
  let maxE = 0, exemple = '';
  for (let i = 2; i < f.length; i++) {
    if (String(f[i]).length !== chiffres) continue;
    const e = pgcd(f[i], f[i - 1]).etapes;
    if (e > maxE) { maxE = e; exemple = f[i] + ' et ' + f[i - 1]; }
  }
  console.log((chiffres + ' chiffres').padEnd(22) + String(maxE).padStart(4) + '   (' + exemple + ')');
}
console.log('rythme : ' + (14 / 3).toFixed(1) + ', ' + (28 / 6).toFixed(1) + ' et ' + (40 / 9).toFixed(1) + ' etapes par chiffre decimal.');
console.log('=> le travail est proportionnel au NOMBRE DE CHIFFRES, donc au LOGARITHME de la');
console.log('   valeur : multiplier les nombres par mille n ajoute qu une quinzaine d etapes.');

// À QUOI CELA REVIENT SUR DE VRAIS NOMBRES : deux entiers de 2048 bits, la taille
// d'une clé RSA. On les tire à graine fixe pour que ce relevé soit reproductible.
let graine = 20260903n;
const MASQUE = (1n << 64n) - 1n;
function grandNombre() {
  let x = 0n;
  for (let i = 0; i < 32; i++) {
    graine = (graine * 6364136223846793005n + 1442695040888963407n) & MASQUE;
    x = (x << 64n) | graine;
  }
  return x | (1n << 2047n);                     // on force le bit de poids fort : 2048 bits pile
}
function etapesGrand(a, b) { let n = 0; while (b) { n++; const t = a % b; a = b; b = t; } return n; }
let total = 0, pireVu = 0, moindre = Infinity;
for (let i = 0; i < 100; i++) {
  const e = etapesGrand(grandNombre(), grandNombre());
  total += e;
  if (e > pireVu) pireVu = e;
  if (e < moindre) moindre = e;
}
const phi = (1 + Math.sqrt(5)) / 2;
console.log('');
console.log('100 paires de 2048 bits tirees a graine fixe :');
console.log('  etapes en moyenne : ' + Math.round(total / 100) + '   (de ' + moindre + ' a ' + pireVu + ')');
console.log('  borne du pire cas, donnee par Fibonacci : ' + Math.ceil(2048 * Math.log(2) / Math.log(phi)));
console.log('=> environ 1200 divisions pour des nombres de 617 chiffres decimaux.');
