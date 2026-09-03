/* Exercice 2 — la jointure quadratique, et sa réécriture en une passe. */

function alea(graine) {
  let e = graine >>> 0;
  return function () { e ^= e << 13; e >>>= 0; e ^= e >>> 17; e ^= e << 5; e >>>= 0; return e / 4294967296; };
}

const N = 5000;
const r = alea(20260912);
const clients = [];
for (let i = 0; i < N; i++) clients.push({ id: i, nom: 'client-' + i });
const commandes = [];
for (let i = 0; i < N; i++) commandes.push({ ref: 'C' + i, clientId: Math.floor(r() * N) });

let ops = 0;

/* Version d’origine : pour chaque commande, on parcourt les clients. */
function jointureNaive() {
  return commandes.map(function (c) {
    for (let i = 0; i < clients.length; i++) { ops++; if (clients[i].id === c.clientId) return c.ref + ' → ' + clients[i].nom; }
    return c.ref + ' → inconnu';
  });
}

/* Version réécrite : on indexe une fois, on lit ensuite. */
function jointureIndexee() {
  const index = new Map();
  for (let i = 0; i < clients.length; i++) { ops++; index.set(clients[i].id, clients[i].nom); }
  return commandes.map(function (c) { ops++; return c.ref + ' → ' + (index.get(c.clientId) || 'inconnu'); });
}

ops = 0; const a = jointureNaive();   const opsNaive = ops;
ops = 0; const b = jointureIndexee(); const opsIndex = ops;

console.log('commandes : ' + N + '   clients : ' + N);
console.log('les deux versions rendent exactement la même liste : ' + (a.join('|') === b.join('|')));
console.log('première ligne : ' + a[0]);
console.log('');
console.log('version naïve ..... : ' + opsNaive + ' opérations');
console.log('version indexée ... : ' + opsIndex + ' opérations');
console.log('rapport ........... : ' + Math.round(opsNaive / opsIndex) + ' fois');
console.log('');
console.log('MODÈLE : la naïve parcourt en moyenne la moitié des clients avant de trouver,');
console.log('soit n²/2 = ' + (N * N / 2) + ' opérations attendues. Mesuré : ' + opsNaive +
  ', soit ' + (opsNaive / (N * N / 2)).toFixed(3) + ' fois le modèle.');
console.log('L’indexée en fait 2n = ' + (2 * N) + ' : construire la table, puis la lire.');
console.log('');
console.log('LE TEST DU DOUBLEMENT SUR LES DEUX VERSIONS');
console.log('     n     naïve   rapport    indexée   rapport');
console.log('  ----  --------   -------   --------   -------');
let pn = null, pi = null;
[625, 1250, 2500, 5000].forEach(function (n) {
  const rr = alea(20260912), cl = [], cm = [];
  for (let i = 0; i < n; i++) cl.push({ id: i, nom: 'client-' + i });
  for (let i = 0; i < n; i++) cm.push({ ref: 'C' + i, clientId: Math.floor(rr() * n) });
  let o1 = 0, o2 = 0;
  cm.forEach(function (c) { for (let i = 0; i < cl.length; i++) { o1++; if (cl[i].id === c.clientId) break; } });
  const idx = new Map(); cl.forEach(function (x) { o2++; idx.set(x.id, x.nom); });
  cm.forEach(function (c) { o2++; idx.get(c.clientId); });
  console.log('  ' + String(n).padStart(4) + '  ' + String(o1).padStart(8) + '   ' +
    (pn === null ? '' : (o1 / pn).toFixed(2)).padStart(7) + '   ' + String(o2).padStart(8) + '   ' +
    (pi === null ? '' : (o2 / pi).toFixed(2)).padStart(7));
  pn = o1; pi = o2;
});
console.log('');
console.log('4 quand n double d’un côté, 2 de l’autre : quadratique contre linéaire.');
console.log('');
console.log(Math.round(opsNaive / opsIndex));
