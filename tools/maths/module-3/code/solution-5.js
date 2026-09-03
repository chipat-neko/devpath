/* Exercice 2 (leçon 8) — trois tâches périodiques : quand retombent-elles ensemble ?
   La réponse est un PPCM, et le PPCM se calcule avec le PGCD. */

function pgcd(a, b) { while (b) { const t = a % b; a = b; b = t; } return a; }
function ppcm(a, b) { return a / pgcd(a, b) * b; }   // diviser AVANT de multiplier : voir plus bas

const periodes = [12, 18, 30];                       // minutes
const ensemble = periodes.reduce(ppcm);
console.log('periodes : ' + periodes.join(', ') + ' minutes');
console.log('pgcd des trois : ' + periodes.reduce(pgcd));
console.log('ppcm des trois : ' + ensemble + ' minutes, soit ' + (ensemble / 60) + ' heures');

// Vérification par simulation : on avance minute par minute sur une journée.
let coincidences = 0, premiere = null;
for (let t = 1; t <= 1440; t++) {
  if (periodes.every((p) => t % p === 0)) { coincidences++; if (premiere === null) premiere = t; }
}
console.log('');
console.log('simulation sur 1440 minutes : ' + coincidences + ' coincidences, la premiere a t = ' + premiere);
console.log('le calcul et la simulation s\'accordent ? ' + (premiere === ensemble));

// POURQUOI on divise AVANT de multiplier : le produit déborde bien plus tôt que le résultat.
const a = 123456789, b = 246913578;             // b vaut exactement 2a
console.log('');
console.log('a = ' + a + ', b = ' + b + ', pgcd = ' + pgcd(a, b));
console.log('  a / pgcd * b  : ' + (a / pgcd(a, b) * b) + '   <- juste');
console.log('  a * b / pgcd  : ' + (a * b / pgcd(a, b)) + '   <- a*b vaut deja ' + a * b);
console.log('  exact (BigInt): ' + (BigInt(a) / BigInt(pgcd(a, b)) * BigInt(b)));

// Mais diviser d'abord REPOUSSE la limite, elle ne la supprime pas.
const c = 123456789, d = 987654321;
console.log('');
console.log('c = ' + c + ', d = ' + d + ', pgcd = ' + pgcd(c, d));
console.log('  c / pgcd * d  : ' + (c / pgcd(c, d) * d));
console.log('  exact (BigInt): ' + (BigInt(c) / BigInt(pgcd(c, d)) * BigInt(d)) + '   <- une unite de plus');
console.log('  le ppcm lui-meme depasse 2^53 : ' + (BigInt(c) / BigInt(pgcd(c, d)) * BigInt(d) > BigInt(Number.MAX_SAFE_INTEGER)));
console.log('  au-dela, aucune ruse ne remplace BigInt.');

// Le cas qui pique : deux périodes premières entre elles ne se croisent qu'au produit.
console.log('');
console.log('p1    p2    pgcd   ppcm');
for (const [x, y] of [[12, 18], [7, 11], [60, 90], [3600, 5400]]) {
  console.log(String(x).padEnd(6) + String(y).padEnd(6) + String(pgcd(x, y)).padEnd(7) + ppcm(x, y));
}
console.log('=> deux taches de 7 et 11 minutes ne se percutent qu\'une fois toutes les 77 minutes ;');
console.log('   deux taches de 60 et 90 minutes se percutent toutes les 3 heures. Choisir des');
console.log('   periodes premieres entre elles ETALE la charge au lieu de la concentrer.');
