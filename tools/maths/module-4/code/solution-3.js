/* Exercice 3 — quelle liaison, si elle tombe, coupe le réseau en deux ?
   Une telle arête s'appelle un PONT. C'est la question qu'on pose à une infrastructure
   avant que la panne la pose à notre place. */

/* MÉTHODE 1, la naïve : on retire chaque arête et on recompte les morceaux.
   Correcte par construction, mais elle refait un parcours complet PAR ARÊTE. */
function pontsParSuppression(n, aretes) {
  function composantes(exclue) {
    const adj = Array.from({ length: n }, () => []);
    aretes.forEach(function (e, k) { if (k === exclue) return; adj[e[0]].push(e[1]); adj[e[1]].push(e[0]); });
    const vus = new Array(n).fill(false);
    let c = 0;
    for (let i = 0; i < n; i++) {
      if (vus[i]) continue;
      c++;
      const file = [i]; vus[i] = true;
      while (file.length) { const s = file.pop(); for (const v of adj[s]) if (!vus[v]) { vus[v] = true; file.push(v); } }
    }
    return c;
  }
  const reference = composantes(-1);
  const ponts = [];
  let parcours = 1;
  aretes.forEach(function (e, k) { parcours++; if (composantes(k) > reference) ponts.push(k); });
  return { ponts: ponts, parcours: parcours };
}

/* MÉTHODE 2, celle de Tarjan : UN SEUL parcours en profondeur.
   On note l'ordre de découverte de chaque sommet, puis le plus petit ordre qu'il peut
   atteindre sans repasser par l'arête qui l'a amené. Si un enfant ne peut pas remonter
   au-dessus de son parent, l'arête qui les relie est un pont. */
function pontsParTarjan(n, aretes) {
  const adj = Array.from({ length: n }, () => []);
  aretes.forEach(function (e, k) { adj[e[0]].push([e[1], k]); adj[e[1]].push([e[0], k]); });
  const ordre = new Array(n).fill(-1), bas = new Array(n).fill(-1);
  const ponts = [];
  let horloge = 0, visites = 0;
  function descendre(s, arriveePar) {
    visites++;
    ordre[s] = bas[s] = horloge++;
    for (const [v, k] of adj[s]) {
      if (k === arriveePar) continue;               // on ne repart pas par où l'on est venu
      if (ordre[v] === -1) {
        descendre(v, k);
        if (bas[v] < bas[s]) bas[s] = bas[v];
        if (bas[v] > ordre[s]) ponts.push(k);       // l'enfant ne peut pas remonter : c'est un pont
      } else if (ordre[v] < bas[s]) bas[s] = ordre[v];
    }
  }
  for (let i = 0; i < n; i++) if (ordre[i] === -1) descendre(i, -1);
  return { ponts: ponts, visites: visites };
}

/* Le réseau à examiner : deux grappes reliées par une seule liaison, plus une antenne. */
const N = 9;
const ARETES = [
  [0, 1], [1, 2], [2, 0],          // grappe de gauche, en triangle
  [2, 3],                          // LA liaison entre les deux grappes
  [3, 4], [4, 5], [5, 3],          // grappe de droite, en triangle
  [5, 6],                          // une antenne
  [6, 7], [7, 8], [8, 6],          // qui se termine par un triangle
];
const NOMS = ARETES.map((e) => e[0] + '-' + e[1]);

const A = pontsParSuppression(N, ARETES);
const B = pontsParTarjan(N, ARETES);

console.log('reseau : ' + N + ' sommets, ' + ARETES.length + ' aretes');
console.log('ponts par suppression : ' + A.ponts.map((k) => NOMS[k]).join(' , '));
console.log('ponts par Tarjan      : ' + B.ponts.slice().sort((a, b) => a - b).map((k) => NOMS[k]).join(' , '));
console.log('memes ponts : ' + (JSON.stringify(A.ponts.slice().sort((a, b) => a - b)) ===
  JSON.stringify(B.ponts.slice().sort((a, b) => a - b)) ? 'oui' : 'NON'));
console.log('parcours complets : suppression ' + A.parcours + ' , Tarjan 1' +
  '  (sommets visites par Tarjan : ' + B.visites + ')');

/* Une seule comparaison ne prouve rien. On rejoue sur 500 réseaux tirés au sort. */
function rng(g) { let x = g >>> 0; return function () { x ^= x << 13; x >>>= 0; x ^= x >> 17; x ^= x << 5; x >>>= 0; return x / 4294967296; }; }
let essais = 0, desaccords = 0, pontsTotal = 0, avecPont = 0, parcoursNaifs = 0;
let connexes = 0, connexesAvecPont = 0;
for (let t = 0; t < 500; t++) {
  const al = rng(11000 + t * 2654435761);
  const n = 10;
  const aretes = [];
  for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) if (al() < 0.22) aretes.push([i, j]);
  if (!aretes.length) continue;
  const a = pontsParSuppression(n, aretes).ponts.slice().sort((x, y) => x - y);
  const b = pontsParTarjan(n, aretes).ponts.slice().sort((x, y) => x - y);
  essais++;
  parcoursNaifs += aretes.length + 1;
  if (JSON.stringify(a) !== JSON.stringify(b)) desaccords++;
  pontsTotal += a.length;
  if (a.length) avecPont++;
  /* Un « reseau » en plusieurs morceaux n est pas une infrastructure : on compte a part. */
  const vus = new Array(n).fill(false);
  const adj = Array.from({ length: n }, () => []);
  aretes.forEach(function (e) { adj[e[0]].push(e[1]); adj[e[1]].push(e[0]); });
  const file = [0]; vus[0] = true;
  let atteints = 1;
  while (file.length) { const s = file.pop(); for (const v of adj[s]) if (!vus[v]) { vus[v] = true; atteints++; file.push(v); } }
  if (atteints === n) { connexes++; if (a.length) connexesAvecPont++; }
}
console.log('');
console.log('sur ' + essais + ' reseaux tires au sort (10 sommets) :');
console.log('  desaccords entre les deux methodes : ' + desaccords);
console.log('  reseaux ayant au moins un pont : ' + avecPont + ' (' + (avecPont / essais * 100).toFixed(1) + ' %)');
console.log('  dont : reseaux CONNEXES (un seul morceau) : ' + connexes +
  ' , parmi eux avec au moins un pont : ' + connexesAvecPont +
  ' (' + (connexesAvecPont / connexes * 100).toFixed(1) + ' %)');
console.log('  -> les ' + (essais - connexes) + ' autres etaient DEJA en morceaux avant toute panne.');
console.log('  ponts trouves au total : ' + pontsTotal);
console.log('  parcours complets : methode naive ' + parcoursNaifs + ' , Tarjan ' + essais);

console.log('');
console.log(connexesAvecPont);
