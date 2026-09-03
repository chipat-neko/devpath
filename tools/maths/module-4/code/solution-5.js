/* Exercice 5 — « quel service peut, directement ou non, appeler quel autre ? »
   La question s'appelle la FERMETURE TRANSITIVE, et elle se résout de deux façons
   qui n'ont rien à voir : par puissances de matrice, ou par un parcours depuis chaque sommet. */

const SERVICES = ['passerelle', 'auth', 'commandes', 'paiement', 'stock', 'notif', 'audit'];
const APPELS = [                                   // orienté : A appelle B
  ['passerelle', 'auth'], ['passerelle', 'commandes'], ['commandes', 'paiement'],
  ['commandes', 'stock'], ['paiement', 'notif'], ['stock', 'notif'],
  ['auth', 'audit'], ['paiement', 'audit'],
];
const n = SERVICES.length;
const idx = new Map(SERVICES.map((s, i) => [s, i]));
const A = Array.from({ length: n }, () => new Array(n).fill(0));
for (const [a, b] of APPELS) A[idx.get(a)][idx.get(b)] = 1;

/* MÉTHODE 1 — par la matrice. Le produit BOOLEEN remplace « + » par « ou » :
   il ne compte plus les chemins, il dit seulement s'il en existe au moins un. */
function produitBooleen(X, Y) {
  const Z = Array.from({ length: n }, () => new Array(n).fill(0));
  for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
    let ok = 0;
    for (let k = 0; k < n; k++) if (X[i][k] && Y[k][j]) { ok = 1; break; }
    Z[i][j] = ok;
  }
  return Z;
}
function ou(X, Y) {
  return X.map((ligne, i) => ligne.map((x, j) => (x || Y[i][j] ? 1 : 0)));
}

/* Un chemin dans un graphe de n sommets ne dépasse jamais n−1 arêtes : on cumule
   A, A², …, A^(n−1), et on s'arrête dès que plus rien ne change. */
let atteint = A.map((l) => l.slice());
let puissance = A.map((l) => l.slice());
let exposant = 1, produits = 0, produitsUtiles = 0;
for (let k = 2; k <= n - 1; k++) {
  puissance = produitBooleen(puissance, A);
  produits++;
  const avant = JSON.stringify(atteint);
  atteint = ou(atteint, puissance);
  exposant = k;
  if (JSON.stringify(atteint) === avant) break;    // point fixe : inutile de continuer
  produitsUtiles++;
}

/* MÉTHODE 2 — par un parcours depuis chaque service. Aucune matrice. */
const voisins = SERVICES.map((_, i) => SERVICES.map((_, j) => j).filter((j) => A[i][j] === 1));
function atteignablesDepuis(depart) {
  const vus = new Set(), file = [depart];
  while (file.length) {
    const s = file.shift();
    for (const v of voisins[s]) if (!vus.has(v)) { vus.add(v); file.push(v); }
  }
  return vus;
}

console.log('service        appelle directement          atteint au total');
let desaccords = 0, totalAtteints = 0;
SERVICES.forEach(function (s, i) {
  const direct = voisins[i].map((j) => SERVICES[j]);
  const parParcours = atteignablesDepuis(i);
  const parMatrice = new Set();
  for (let j = 0; j < n; j++) if (atteint[i][j]) parMatrice.add(j);
  const memes = parParcours.size === parMatrice.size &&
    Array.from(parParcours).every((j) => parMatrice.has(j));
  if (!memes) desaccords++;
  totalAtteints += parMatrice.size;
  console.log(s.padEnd(15) + (direct.join(', ') || '—').padEnd(29) +
    (Array.from(parMatrice).map((j) => SERVICES[j]).join(', ') || '—'));
});
console.log('');
console.log('exposant atteint : ' + exposant + '   (borne theorique sur l exposant : ' + (n - 1) +
  ', car un chemin simple ne depasse pas ' + (n - 1) + ' aretes)');
console.log('PRODUITS de matrices reellement effectues : ' + produits +
  '   (dont ' + produitsUtiles + ' qui ont change la cloture ; borne : ' + (n - 2) + ')');
console.log('desaccords entre la matrice et les parcours : ' + desaccords + ' sur ' + n);
console.log('paires (i, j) atteignables au total : ' + totalAtteints + ' sur ' + (n * n));

/* CE QUE CELA SERT À VOIR : qui dépend de quoi sans le savoir. */
const audit = idx.get('audit');
const dependants = SERVICES.filter((_, i) => atteint[i][audit]);
console.log('');
console.log('services qui finissent par appeler « audit » : ' + dependants.join(', '));
console.log('  -> une panne d audit se voit depuis ' + dependants.length + ' services sur ' + n);

/* Le contrôle qui compte : 500 graphes tires au sort, deux methodes independantes. */
function rng(g) { let x = g >>> 0; return function () { x ^= x << 13; x >>>= 0; x ^= x >> 17; x ^= x << 5; x >>>= 0; return x / 4294967296; }; }
let essais = 0, mauvais = 0, paires = 0;
for (let t = 0; t < 500; t++) {
  const al = rng(6000 + t * 40503);
  const m = 8;
  const B = Array.from({ length: m }, () => new Array(m).fill(0));
  for (let i = 0; i < m; i++) for (let j = 0; j < m; j++) if (i !== j && al() < 0.2) B[i][j] = 1;

  /* par la matrice */
  let acc = B.map((l) => l.slice()), pui = B.map((l) => l.slice());
  for (let k = 2; k <= m - 1; k++) {
    const Z = Array.from({ length: m }, () => new Array(m).fill(0));
    for (let i = 0; i < m; i++) for (let j = 0; j < m; j++) {
      for (let q = 0; q < m; q++) if (pui[i][q] && B[q][j]) { Z[i][j] = 1; break; }
    }
    pui = Z;
    acc = acc.map((ligne, i) => ligne.map((x, j) => (x || pui[i][j] ? 1 : 0)));
  }
  /* par parcours */
  const vois = Array.from({ length: m }, (_, i) => Array.from({ length: m }, (_, j) => j).filter((j) => B[i][j] === 1));
  for (let dep = 0; dep < m; dep++) {
    const vus = new Set(), file = [dep];
    while (file.length) { const s = file.shift(); for (const v of vois[s]) if (!vus.has(v)) { vus.add(v); file.push(v); } }
    for (let j = 0; j < m; j++) { paires++; if ((acc[dep][j] === 1) !== vus.has(j)) mauvais++; }
  }
  essais++;
}
console.log('');
console.log('sur ' + essais + ' graphes tires au sort et ' + paires + ' paires verifiees :');
console.log('  desaccords entre les deux methodes : ' + mauvais);

console.log('');
console.log(totalAtteints);
