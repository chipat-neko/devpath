/* Comment tester la primalité d'un nombre de 2048 bits sans jamais le diviser.
   Le petit théorème de Fermat, ses menteurs, et la parade. */

function puissanceMod(base, exp, m) {
  let r = 1n, b = BigInt(base) % BigInt(m), e = BigInt(exp), M = BigInt(m);
  while (e > 0n) { if (e & 1n) r = (r * b) % M; b = (b * b) % M; e >>= 1n; }
  return r;
}
function estPremierNaif(n) {
  if (n < 2) return false;
  for (let d = 2; d * d <= n; d++) if (n % d === 0) return false;
  return true;
}

// LE THÉORÈME : si p est premier et a n'est pas multiple de p, alors a^(p-1) ≡ 1 (mod p).
// On l'essaie sur tous les premiers jusqu'à 500 et toutes les bases de 2 à 20.
let essais = 0, tient = 0;
for (let p = 3; p < 500; p++) {
  if (!estPremierNaif(p)) continue;
  for (let a = 2; a <= 20; a++) {
    if (a % p === 0) continue;
    essais++;
    if (puissanceMod(a, p - 1, p) === 1n) tient++;
  }
}
console.log('petit theoreme de Fermat verifie sur ' + essais + ' couples (premier, base) : ' + tient + ' fois vrai');

// LA RÉCIPROQUE, ELLE, EST FAUSSE. On cherche les imposteurs, on ne les cite pas de mémoire.
const menteurs2 = [];
for (let n = 3; n < 5000; n += 2) {
  if (estPremierNaif(n)) continue;
  if (puissanceMod(2, n - 1, n) === 1n) menteurs2.push(n);
}
console.log('');
console.log('composes qui passent le test en base 2 sous 5000 : ' + menteurs2.length);
console.log('  ' + menteurs2.join(' '));
console.log('  (' + menteurs2[0] + ' = ' + (function (n) { for (let d = 2; d * d <= n; d++) if (n % d === 0) return d + ' x ' + n / d; })(menteurs2[0]) + ')');

// PLUSIEURS BASES : combien d'imposteurs survivent ? Et surtout : POUR QUELLE RAISON
// disparaissent-ils ? Un composé peut être écarté parce qu'une base le DIVISE — ce qui
// est une division d'essai déguisée, pas un succès du test de Fermat. On distingue.
console.log('');
console.log('bases essayees    composes qui passent toutes les bases, sous 5000');
for (const bases of [[2], [2, 3], [2, 3, 5], [2, 3, 5, 7]]) {
  const restants = [];
  for (let n = 3; n < 5000; n += 2) {
    if (estPremierNaif(n)) continue;
    if (bases.every((a) => n % a !== 0 && puissanceMod(a, n - 1, n) === 1n)) restants.push(n);
  }
  console.log(bases.join(',').padEnd(18) + (restants.length ? restants.length + ' : ' + restants.join(' ') : '0'));
}

console.log('');
console.log('POURQUOI chacun des 16 imposteurs de base 2 finit-il par tomber ?');
let parDivision = 0, parFermat = 0;
for (const n of menteurs2) {
  let raison = 'aucune des bases 2,3,5,7 ne l ecarte';
  for (const a of [2, 3, 5, 7]) {
    if (n % a === 0) { raison = 'la base ' + a + ' le DIVISE (division d essai deguisee)'; parDivision++; break; }
    if (puissanceMod(a, n - 1, n) !== 1n) { raison = 'la base ' + a + ' est un vrai temoin de Fermat'; parFermat++; break; }
  }
  console.log('  ' + String(n).padEnd(6) + raison);
}
console.log('');
console.log('ecartes par DIVISION : ' + parDivision + '   ecartes par un vrai temoin : ' + parFermat);
console.log('=> le « 0 » de la derniere ligne du tableau n est donc PAS un succes de Fermat.');

// LES NOMBRES DE CARMICHAEL : ils mentent pour TOUTES les bases premières avec eux.
const carmichael = [];
for (let n = 3; n < 20000; n += 2) {
  if (estPremierNaif(n)) continue;
  let toutes = true;
  for (let a = 2; a < n && toutes; a++) {
    let g = a, h = n;                            // pgcd(a, n)
    while (h) { const t = g % h; g = h; h = t; }
    if (g !== 1) continue;
    if (puissanceMod(a, n - 1, n) !== 1n) toutes = false;
  }
  if (toutes) carmichael.push(n);
}
console.log('');
console.log('nombres de Carmichael sous 20000 : ' + carmichael.join(' '));
console.log('=> aucune base ne les demasque. Fermat seul ne suffit donc pas.');

// LA PARADE : Miller-Rabin. Il regarde AUSSI les racines carrées de 1.
function millerRabin(n, bases) {
  if (n < 2) return false;
  for (const p of [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37]) { if (n === p) return true; if (n % p === 0) return false; }
  const N = BigInt(n);
  let d = N - 1n, r = 0n;
  while (d % 2n === 0n) { d /= 2n; r++; }
  for (const a of bases) {
    let x = puissanceMod(a, Number(d), n);
    if (x === 1n || x === N - 1n) continue;
    let compose = true;
    for (let i = 1n; i < r; i++) { x = (x * x) % N; if (x === N - 1n) { compose = false; break; } }
    if (compose) return false;
  }
  return true;
}
let faux = 0, verifs = 0;
for (let n = 2; n < 50000; n++) { verifs++; if (millerRabin(n, [2, 3]) !== estPremierNaif(n)) faux++; }
console.log('');
console.log('Miller-Rabin en bases 2 et 3, compare au test exact sur ' + verifs + ' nombres : ' + faux + ' erreur(s)');
console.log('les ' + carmichael.length + ' Carmichael ci-dessus, vus par Miller-Rabin : ' +
  carmichael.map((n) => millerRabin(n, [2, 3]) ? 'rate' : 'demasque').join(', '));
