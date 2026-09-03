/* Exercice 3 (leçon 9) — Kahan a lui aussi une limite, et Neumaier la corrige.
   On construit le cas qui met Kahan en défaut, au lieu de le supposer. */

const naive = (l) => l.reduce((s, x) => s + x, 0);

function kahan(liste) {
  let somme = 0, c = 0;
  for (const x of liste) {
    const y = x - c;
    const t = somme + y;
    c = (t - somme) - y;
    somme = t;
  }
  return somme;
}

function neumaier(liste) {
  let somme = 0, c = 0;
  for (const x of liste) {
    const t = somme + x;
    // la correction dépend de qui est le plus grand des deux : c'est là que Kahan se trompe
    if (Math.abs(somme) >= Math.abs(x)) c += (somme - t) + x;
    else c += (x - t) + somme;
    somme = t;
  }
  return somme + c;
}

// LE CAS : un terme énorme suivi de deux petits. Kahan perd le premier report.
const piege = [1.0, 1e100, 1.0, -1e100];
console.log('liste : 1, 1e100, 1, -1e100      (somme exacte : 2)');
console.log('  naive    : ' + naive(piege));
console.log('  Kahan    : ' + kahan(piege));
console.log('  Neumaier : ' + neumaier(piege));

// Un second cas, moins extrême : dix mille fois 0.1 avec un géant au milieu.
const liste = [];
for (let i = 0; i < 5000; i++) liste.push(0.1);
liste.push(1e17);
for (let i = 0; i < 5000; i++) liste.push(0.1);
liste.push(-1e17);
console.log('');
console.log('10 000 x 0.1 avec 1e17 puis -1e17 inseres    (somme exacte : 1000)');
console.log('  naive    : ' + naive(liste));
console.log('  Kahan    : ' + kahan(liste));
console.log('  Neumaier : ' + neumaier(liste));

// Le banc d'essai : combien de listes chaque methode rate-t-elle ?
let g = 20260903;
const tirage = () => ((g = (Math.imul(g, 1664525) + 1013904223) >>> 0) >>> 8) / 16777216;
// LA RÉFÉRENCE NE DOIT RIEN DEVOIR AUX MÉTHODES QU'ON JUGE. On la calcule donc
// exactement, en rationnels : chaque double est un entier fois une puissance de 2,
// donc leur somme s'obtient sans le moindre arrondi en BigInt.
function sommeExacte(liste) {
  let emin = 0, parts = [];
  for (const x of liste) {
    const d = new DataView(new ArrayBuffer(8));
    d.setFloat64(0, x);
    const n = d.getBigUint64(0);
    const signe = (n >> 63n) === 1n;
    const eb = Number((n >> 52n) & 0x7ffn);
    const f = n & 0xfffffffffffffn;
    let m = eb === 0 ? f : (1n << 52n) | f;
    if (signe) m = -m;
    const e = eb === 0 ? -1074 : eb - 1075;
    parts.push({ m: m, e: e });
    if (e < emin) emin = e;
  }
  let total = 0n;
  for (const p of parts) total += p.m << BigInt(p.e - emin);
  return { m: total, e: emin };
}
const enDouble = (r) => Number(r.m) * Math.pow(2, r.e);

let cas = 0, ratesNaive = 0, ratesKahan = 0, ratesNeumaier = 0, refExacte = 0;
for (let essai = 0; essai < 200; essai++) {
  const petits = [];
  for (let i = 0; i < 50; i++) petits.push(tirage());
  const grand = 10 ** (10 + Math.floor(tirage() * 8));
  const l = petits.slice();
  l.splice(Math.floor(tirage() * 50), 0, grand);
  l.push(-grand);                                // la somme mathématique est inchangée
  const exact = enDouble(sommeExacte(petits));   // référence rationnelle, aucune méthode jugée
  if (neumaier(petits) === exact) refExacte++;   // et on vérifie que la référence tient
  cas++;
  const tol = 1e-9;
  if (Math.abs(naive(l) - exact) > tol) ratesNaive++;
  if (Math.abs(kahan(l) - exact) > tol) ratesKahan++;
  if (Math.abs(neumaier(l) - exact) > tol) ratesNeumaier++;
}
console.log('');
console.log(cas + ' listes a graine fixe : 50 valeurs entre 0 et 1, plus un terme geant et son oppose.');
console.log('  reference calculee en RATIONNELS EXACTS (BigInt), pas par une des trois methodes.');
console.log('  cas ou Neumaier retrouve cette reference sur les 50 petites valeurs : ' + refExacte + ' / ' + cas);
console.log('  somme naive fausse a plus de 1e-9 : ' + ratesNaive);
console.log('  Kahan                             : ' + ratesKahan);
console.log('  Neumaier                          : ' + ratesNeumaier);
console.log('');
console.log('=> Kahan suppose que la somme courante domine le terme ajoute. Quand ce n\'est');
console.log('   pas vrai, sa compensation vaut zero et il redevient la somme naive. Neumaier');
console.log('   teste lequel des deux domine : deux lignes de plus, et le cas disparait.');
