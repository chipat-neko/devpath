/* Une erreur d'arrondi seule est invisible. Répétée, elle devient un montant.
   On additionne, on compte, on corrige. */

// 1) Additionner 0.1 dix mille fois.
let somme = 0;
for (let i = 0; i < 10000; i++) somme += 0.1;
console.log('0.1 additionne 10 000 fois : ' + somme);
console.log('attendu                    : 1000');
console.log('ecart                      : ' + (somme - 1000));

// Où l'erreur apparaît-elle ? On repère le premier pas où la somme décroche.
let s = 0, premierEcart = null;
for (let i = 1; i <= 200; i++) {
  s += 0.1;
  if (premierEcart === null && s !== i / 10) premierEcart = { i: i, obtenu: s, attendu: i / 10 };
}
console.log('');
console.log('premier decrochage a la ' + premierEcart.i + 'e addition :');
console.log('  cumul obtenu : ' + premierEcart.obtenu);
console.log('  valeur juste : ' + premierEcart.attendu);

// 2) Est-ce que l'erreur grandit ? On mesure au lieu de supposer.
console.log('');
console.log('additions      somme obtenue          ecart absolu             ecart relatif');
for (const n of [10, 1000, 100000, 10000000]) {
  let t = 0;
  for (let i = 0; i < n; i++) t += 0.1;
  const juste = n / 10;
  console.log(String(n).padEnd(15) + String(t).padEnd(23) +
    String(t - juste).padEnd(25) + ((t - juste) / juste).toExponential(3));
}

// 3) L'ORDRE change le résultat : l'addition flottante n'est PAS associative.
const a = 1e16, b = 1, c = 1;
console.log('');
console.log('a = 1e16, b = 1, c = 1');
console.log('  (a + b) + c : ' + ((a + b) + c));
console.log('  a + (b + c) : ' + (a + (b + c)));
console.log('  somme exacte : 10000000000000002');
console.log("=> le meme calcul, deux parenthesages, deux resultats. Le premier perd le b, puis le c ;");
console.log("   le second additionne d'abord les deux petits, qui pesent alors assez pour compter.");

// Conséquence pratique : trier avant de sommer change le total.
const melange = [1e8];
for (let i = 0; i < 1000000; i++) melange.push(1e-8);
const dansLOrdre = melange.slice().sort((x, y) => x - y).reduce((s, x) => s + x, 0);
const telQuel = melange.reduce((s, x) => s + x, 0);
console.log('');
console.log('1e8 suivi d\'un million de 1e-8 :');
console.log('  somme dans l\'ordre du tableau : ' + telQuel);
console.log('  somme du plus petit au plus grand : ' + dansLOrdre);
console.log('  valeur mathematique : 100000000.01');
console.log('=> sommer les petits en premier les empeche d\'etre ecrases par le grand.');

// 4) LA PARADE : la sommation compensée de Kahan. Elle garde l'erreur de côté.
function kahan(liste) {
  let somme = 0, compensation = 0;
  for (const x of liste) {
    const y = x - compensation;                 // on retranche l'erreur laissée au tour d'avant
    const t = somme + y;
    compensation = (t - somme) - y;             // ce que l'addition vient de perdre
    somme = t;
  }
  return somme;
}
const dixMille = new Array(10000).fill(0.1);
console.log('');
console.log('somme naive de 10 000 x 0.1  : ' + dixMille.reduce((a, b) => a + b, 0));
console.log('somme de Kahan               : ' + kahan(dixMille));
console.log('exacte ? ' + (kahan(dixMille) === 1000));

console.log('');
console.log('n            naive - exact           Kahan - exact');
for (const n of [1000, 100000, 10000000]) {
  const liste = new Array(n).fill(0.1);
  const juste = n / 10;
  console.log(String(n).padEnd(13) + String(liste.reduce((a, b) => a + b, 0) - juste).padEnd(25) + (kahan(liste) - juste));
}
console.log('=> Kahan ne « corrige » pas les nombres : il conserve, a chaque pas, ce que');
console.log('   l\'addition a jete. Le cout est de trois operations au lieu d\'une.');

// POURQUOI KAHAN RÉCUPÈRE EXACTEMENT LE RÉSIDU : parce que, sous certaines conditions,
// la soustraction de deux flottants est exacte. On vérifie les deux lemmes en jeu.
function estExacte(a, b) {                      // a - b est-il calculé sans le moindre arrondi ?
  const bits = (x) => { const d = new DataView(new ArrayBuffer(8)); d.setFloat64(0, x); return d.getBigUint64(0); };
  const decompose = (x) => {
    const n = bits(x), signe = (n >> 63n) === 1n, eb = Number((n >> 52n) & 0x7ffn), f = n & 0xfffffffffffffn;
    let m = eb === 0 ? f : (1n << 52n) | f;
    if (signe) m = -m;
    return { m: m, e: eb === 0 ? -1074 : eb - 1075 };
  };
  const A = decompose(a), B = decompose(b), C = decompose(a - b);
  const e = Math.min(A.e, B.e, C.e);
  return (A.m << BigInt(A.e - e)) - (B.m << BigInt(B.e - e)) === (C.m << BigInt(C.e - e));
}
let gr = 20260903;
const tire = () => ((gr = (Math.imul(gr, 1664525) + 1013904223) >>> 0)) / 4294967296;
let dansOk = 0, dansTotal = 0, horsInexactes = 0, horsTotal = 0;
for (let i = 0; i < 20000; i++) {
  const x = tire() * 1000 + 0.001, y = tire() * 1000 + 0.001;
  if (y / 2 <= x && x <= 2 * y) { dansTotal++; if (estExacte(x, y)) dansOk++; }
  else { horsTotal++; if (!estExacte(x, y)) horsInexactes++; }
}
console.log('');
console.log('lemme de Sterbenz — la soustraction est exacte si y/2 <= x <= 2y :');
console.log('  couples dans cet intervalle : ' + dansTotal + ', soustractions exactes : ' + dansOk);
console.log('  couples hors intervalle     : ' + horsTotal + ', dont inexactes : ' + horsInexactes);

// Le lemme qui fait vraiment marcher Kahan est AUTRE : il exige |somme| >= |y|.
function compensation(somme, y) { const t = somme + y; return (t - somme) - y; }
console.log('');
console.log('lemme de Fast2Sum — la compensation de Kahan exige |somme| >= |y| :');
console.log('  somme = 1e16, y = 1  -> compensation ' + compensation(1e16, 1) + '   (le 1 perdu est retrouve)');
console.log('  somme = 1,    y = 1e16 -> compensation ' + compensation(1, 1e16) + '   (le 1 perdu est OUBLIE)');
console.log('=> c est exactement ce cas que le troisieme exercice met en defaut.');
