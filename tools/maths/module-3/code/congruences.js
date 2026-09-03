/* Une congruence, c'est une égalité qui ne regarde que le reste.
   On vérifie ce qui se conserve, et ce qui ne se conserve PAS. */

const m = 7;
const mod = (a, n) => ((a % n) + n) % n;

// a ≡ b (mod 7) veut dire : a et b ont le même reste modulo 7.
console.log('17 ≡ 3 (mod 7) ? ' + (mod(17, m) === mod(3, m)) + '   restes : ' + mod(17, m) + ' et ' + mod(3, m));

// PROPRIÉTÉS 1 et 2 : addition et multiplication passent au reste.
// On l'essaie sur toutes les paires de 0..99, pas sur un exemple.
let addOk = 0, mulOk = 0, essais = 0;
for (let a = 0; a < 100; a++) {
  for (let b = 0; b < 100; b++) {
    essais++;
    if (mod(a + b, m) === mod(mod(a, m) + mod(b, m), m)) addOk++;
    if (mod(a * b, m) === mod(mod(a, m) * mod(b, m), m)) mulOk++;
  }
}
console.log('');
console.log('paires essayees                         : ' + essais);
console.log('(a+b) mod m = (a mod m + b mod m) mod m : ' + addOk + ' / ' + essais);
console.log('(a*b) mod m = (a mod m * b mod m) mod m : ' + mulOk + ' / ' + essais);

// PROPRIÉTÉ 3 : DIVISER LES RESTES ne marche pas. Contre-exemples cherchés, pas inventés.
const contre = [];
let divisions = 0, divOk = 0;
for (let a = 1; a < 60; a++) {
  for (let b = 1; b < 60; b++) {
    if (a % b !== 0) continue;                 // on ne divise que si ça tombe juste
    if (mod(b, m) === 0) continue;             // ni si le diviseur est nul modulo 7
    divisions++;
    const gauche = mod(a / b, m);
    const droite = mod(mod(a, m) / mod(b, m), m);
    if (gauche === droite) divOk++;
    else if (contre.length < 3) contre.push('a=' + a + ', b=' + b + ' : (a/b) mod 7 = ' + gauche + ', mais (a mod 7)/(b mod 7) mod 7 = ' + droite);
  }
}
console.log('');
console.log('divisions exactes essayees : ' + divisions + ', dont ' + divOk + ' ou diviser les restes marche');
console.log('a noter : 2 / 3 vaut ' + (2 / 3) + ' en JavaScript, mais le modulo ci-dessous en');
console.log('perd un chiffre — un avant-gout de la lecon 9.');
console.log('trois contre-exemples :');
contre.forEach((c) => console.log('  ' + c));

// MAIS la division modulo 7 existe : elle se fait par MULTIPLICATION PAR L'INVERSE.
// L'inverse de b modulo 7 est le x tel que b*x = 1 (mod 7). On le cherche.
function inverse(b, n) { for (let x = 1; x < n; x++) if (mod(b * x, n) === 1) return x; return null; }
let avecInverse = 0, essais2 = 0;
for (let a = 1; a < 60; a++) {
  for (let b = 1; b < 60; b++) {
    if (a % b !== 0 || mod(b, m) === 0) continue;
    essais2++;
    if (mod(a / b, m) === mod(mod(a, m) * inverse(mod(b, m), m), m)) avecInverse++;
  }
}
console.log('');
console.log('les MEMES ' + essais2 + ' cas, en multipliant par l inverse : ' + avecInverse + ' / ' + essais2);
console.log('=> ce n est pas la division qui echoue, c est l idee de DIVISER LES RESTES.');
console.log('   l operation correcte est la multiplication par l inverse — sujet de la lecon 8.');

// À QUOI ÇA SERT : le jour de la semaine, 10^15 jours plus tard, sans calculer 10^15.
const jours = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
const depart = 4;                              // le 3 septembre 2026 est un jeudi
const dans = 10n ** 15n;
console.log('');
console.log('point de depart : ' + jours[depart] + ' (3 septembre 2026)');
console.log('10^15 mod 7 = ' + Number(dans % 7n));
console.log('10^15 jours plus tard : ' + jours[Number((BigInt(depart) + dans) % 7n)]);
