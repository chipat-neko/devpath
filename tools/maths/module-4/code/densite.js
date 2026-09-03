/* « La matrice gaspille de la place » : c'est ce qu'on lit partout. On le MESURE,
   au lieu de le croire — et la réponse dépend entièrement de ce qu'on met dans les cases. */

/* Un générateur à graine, pour que ce relevé soit reproductible ligne par ligne. */
function rng(graine) {
  let x = graine >>> 0;
  return function () { x ^= x << 13; x >>>= 0; x ^= x >> 17; x ^= x << 5; x >>>= 0; return x / 4294967296; };
}

/* Un graphe non orienté de n sommets tiré au sort, avec la densité demandée.
   densite = part des paires de sommets effectivement reliées. */
function grapheAleatoire(n, densite, graine) {
  const al = rng(graine);
  const adj = Array.from({ length: n }, () => []);
  let m = 0;
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      if (al() < densite) { adj[i].push(j); adj[j].push(i); m++; }
    }
  }
  return { adj: adj, m: m };
}

const n = 1000;
const PAIRES = n * (n - 1) / 2;

console.log('n = ' + n + ' sommets, soit ' + PAIRES + ' paires possibles');
console.log('');
console.log('cout en OCTETS de trois representations, pour de vrai :');
console.log('  matrice de bits    : n*n / 8            = ' + (n * n / 8));
console.log('  matrice Uint8Array : n*n                = ' + (n * n));
console.log('  liste d\'adjacence  : 2*m entiers 32 bits = 8*m  (depend du graphe)');
console.log('');
console.log('densite    aretes   liste(o)   Uint8(o)   bits(o)   la plus compacte');

const DENSITES = [0.001, 0.005, 0.01, 0.03, 0.05, 0.1, 0.25, 0.5];
DENSITES.forEach(function (d, k) {
  const g = grapheAleatoire(n, d, 1000 + k * 7919);       // une graine par ligne
  const liste = 8 * g.m;
  const uint8 = n * n;
  const bits = n * n / 8;
  const noms = ['liste', 'Uint8', 'bits'], vals = [liste, uint8, bits];
  const gagnant = noms[vals.indexOf(Math.min.apply(null, vals))];
  console.log(String(d).padEnd(10) + String(g.m).padStart(7) + String(liste).padStart(11) +
    String(uint8).padStart(11) + String(bits).padStart(10) + '   ' + gagnant);
});

/* Le seuil exact, resolu et non devine :
   matrice de bits <= liste  <=>  n*n/8 <= 8*m  <=>  m >= n*n/64
   et m = densite * n*(n-1)/2, donc densite >= n / (32*(n-1)). */
const seuilBits = n / (32 * (n - 1));
const seuilUint8 = n / (4 * (n - 1));
console.log('');
console.log('seuil calcule : la matrice de BITS devient plus compacte des ' +
  (seuilBits * 100).toFixed(3) + ' % de densite');
console.log('                la matrice Uint8 devient plus compacte des ' +
  (seuilUint8 * 100).toFixed(3) + ' % de densite');

/* Et le COÛT D'UNE QUESTION ? La matrice répond à « y a-t-il une arête ? » en une lecture,
   la liste doit parcourir. On compte les CASES LUES, et non des millisecondes : un chronomètre
   ne rendrait pas deux fois le même chiffre, et la question posée ici est structurelle. */
function bancRequetes(densite, graine) {
  const g = grapheAleatoire(n, densite, graine);
  const bits = new Uint8Array(n * n);
  for (let i = 0; i < n; i++) for (const j of g.adj[i]) bits[i * n + j] = 1;

  const paires = [];
  const al = rng(31337);                                  // les mêmes questions dans les deux cas
  for (let k = 0; k < 200000; k++) paires.push([Math.floor(al() * n), Math.floor(al() * n)]);

  let trouvesM = 0;
  for (const [i, j] of paires) if (bits[i * n + j]) trouvesM++;

  let trouvesL = 0, casesLues = 0;
  for (const [i, j] of paires) {
    const v = g.adj[i];
    let k = 0;
    while (k < v.length && v[k] !== j) k++;
    casesLues += k + (k < v.length ? 1 : 0);
    if (k < v.length) trouvesL++;
  }

  return { m: g.m, degre: (2 * g.m / n).toFixed(1), trouvesM: trouvesM, trouvesL: trouvesL,
    casesM: paires.length, casesL: casesLues };
}

console.log('');
console.log('200 000 questions « i et j sont-ils relies ? », memes questions dans les deux cas :');
console.log('');
console.log('densite  degre moyen   cases lues matrice   cases lues liste   rapport   memes reponses');
[[0.01, 424242], [0.05, 515151], [0.25, 606060]].forEach(function (cas) {
  const r = bancRequetes(cas[0], cas[1]);
  console.log(String(cas[0]).padEnd(9) + String(r.degre).padStart(11) +
    String(r.casesM).padStart(21) + String(r.casesL).padStart(19) +
    (' x' + (r.casesL / r.casesM).toFixed(0)).padStart(10) +
    (r.trouvesM === r.trouvesL ? '   oui (' + r.trouvesM + ')' : '   NON').padStart(17));
});

/* Le cas qui tranche pour de bon : un reseau social. */
const N = 1e6, AMIS = 100;
const mSocial = N * AMIS / 2;
console.log('');
console.log('-- 1 million de personnes, 100 amis chacune --');
console.log('matrice de bits  : ' + (N * N / 8 / 1e9).toFixed(0) + ' Go');
console.log("liste d'adjacence : " + (2 * mSocial * 4 / 1e6).toFixed(0) + ' Mo');
console.log('densite reelle   : ' + (mSocial / (N * (N - 1) / 2) * 100).toFixed(5) + ' %');
