/* Deux façons de visiter un graphe, et une différence qui n'est PAS un détail de style :
   l'une donne le plus court chemin, l'autre non. On le vérifie au lieu de l'affirmer. */

const STATIONS = ['Nord', 'Halles', 'Opera', 'Gare', 'Parc', 'Fac', 'Port', 'Sud'];
const aretes = [
  ['Nord', 'Halles'], ['Nord', 'Opera'], ['Halles', 'Opera'], ['Halles', 'Gare'],
  ['Opera', 'Gare'], ['Gare', 'Parc'], ['Parc', 'Fac'], ['Gare', 'Port'],
  ['Port', 'Sud'], ['Parc', 'Sud'],
];
const adj = new Map(STATIONS.map((s) => [s, []]));
for (const [a, b] of aretes) { adj.get(a).push(b); adj.get(b).push(a); }

/* PARCOURS EN LARGEUR : une FILE. On épuise la distance 1 avant de voir la distance 2. */
function largeur(depart) {
  const vus = new Set([depart]);
  const dist = new Map([[depart, 0]]);
  const parent = new Map([[depart, null]]);
  const file = [depart];
  const ordre = [];
  while (file.length) {
    const s = file.shift();                       // on prend au DÉBUT : premier arrivé, premier servi
    ordre.push(s);
    for (const v of adj.get(s)) {
      if (!vus.has(v)) { vus.add(v); dist.set(v, dist.get(s) + 1); parent.set(v, s); file.push(v); }
    }
  }
  return { ordre: ordre, dist: dist, parent: parent };
}

/* PARCOURS EN PROFONDEUR : une PILE. On s'enfonce aussi loin que possible avant de revenir.
   La « distance » qu'il connaît est la profondeur dans l'arbre qu'il construit : le nombre
   d'arêtes du chemin PAR LEQUEL IL EST ARRIVÉ. C'est ce chiffre-là qu'on va confronter. */
function profondeur(depart) {
  const vus = new Set();
  const dist = new Map();
  const pile = [[depart, 0]];
  const ordre = [];
  while (pile.length) {
    const [s, d] = pile.pop();                    // on prend à la FIN : dernier arrivé, premier servi
    if (vus.has(s)) continue;
    vus.add(s);
    dist.set(s, d);
    ordre.push(s);
    for (const v of adj.get(s)) if (!vus.has(v)) pile.push([v, d + 1]);
  }
  return { ordre: ordre, dist: dist };
}

const L = largeur('Nord');
const P = profondeur('Nord');

console.log('depart : Nord');
console.log('largeur    : ' + L.ordre.join(' > '));
console.log('profondeur : ' + P.ordre.join(' > '));

/* La distance annoncée par chacun, et la VRAIE, obtenue par force brute :
   on énumère tous les chemins sans répétition et on garde le plus court. */
function plusCourtParForceBrute(depart, but) {
  let best = Infinity;
  (function marcher(s, longueur, vus) {
    if (longueur >= best) return;                 // inutile de continuer
    if (s === but) { best = longueur; return; }
    for (const v of adj.get(s)) if (!vus.has(v)) { vus.add(v); marcher(v, longueur + 1, vus); vus.delete(v); }
  })(depart, 0, new Set([depart]));
  return best;
}

console.log('');
console.log('station    largeur   profondeur   force brute   largeur juste ?   profondeur juste ?');
let fauxL = 0, fauxP = 0;
for (const s of STATIONS) {
  const vrai = plusCourtParForceBrute('Nord', s);
  const dl = L.dist.get(s), dp = P.dist.get(s);
  if (dl !== vrai) fauxL++;
  if (dp !== vrai) fauxP++;
  console.log(s.padEnd(11) + String(dl).padStart(7) + String(dp).padStart(13) +
    String(vrai).padStart(14) + (dl === vrai ? '   oui' : '   NON').padStart(18) +
    (dp === vrai ? '   oui' : '   NON').padStart(20));
}
console.log('');
console.log('distances fausses : largeur ' + fauxL + ' , profondeur ' + fauxP + '  (sur ' + STATIONS.length + ')');

/* Le chemin lui-même se relit à l'envers, par les parents laissés par le parcours en largeur. */
function chemin(parent, but) {
  const out = [];
  for (let s = but; s !== null && s !== undefined; s = parent.get(s)) out.unshift(s);
  return out;
}
console.log('chemin Nord -> Fac : ' + chemin(L.parent, 'Fac').join(' > ') +
  '  (' + L.dist.get('Fac') + ' aretes)');

/* Le petit graphe pourrait être un cas heureux. On refait le contrôle sur 200 graphes tirés
   au sort — et surtout, avec une RÉFÉRENCE INDÉPENDANTE : Floyd-Warshall, qui ne partage
   aucune ligne avec le parcours en largeur. Juger la largeur avec la largeur ne prouverait rien. */
function rng(g) { let x = g >>> 0; return function () { x ^= x << 13; x >>>= 0; x ^= x >> 17; x ^= x << 5; x >>>= 0; return x / 4294967296; }; }

function floyd(A, n) {                            // toutes les distances, par un tout autre chemin
  const D = Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => (i === j ? 0 : Infinity)));
  for (let i = 0; i < n; i++) for (const j of A[i]) D[i][j] = 1;
  for (let k = 0; k < n; k++) for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
    if (D[i][k] + D[k][j] < D[i][j]) D[i][j] = D[i][k] + D[k][j];
  }
  return D;
}

let essais = 0, sommetsTestes = 0, mauvaisL = 0, mauvaisP = 0, ecartMax = 0;
for (let t = 0; t < 200; t++) {
  const al = rng(9000 + t * 104729);
  const n = 12;
  const A = Array.from({ length: n }, () => []);
  for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) if (al() < 0.25) { A[i].push(j); A[j].push(i); }

  const D = floyd(A, n);                          // la référence

  const d = new Array(n).fill(-1); d[0] = 0;      // le parcours en largeur, jugé
  const file = [0];
  while (file.length) { const s = file.shift(); for (const v of A[s]) if (d[v] === -1) { d[v] = d[s] + 1; file.push(v); } }

  const dp = new Array(n).fill(-1);               // le parcours en profondeur, jugé
  const vus = new Array(n).fill(false), pile = [[0, 0]];
  while (pile.length) {
    const [s, prof] = pile.pop();
    if (vus[s]) continue;
    vus[s] = true;
    dp[s] = prof;
    for (const v of A[s]) if (!vus[v]) pile.push([v, prof + 1]);
  }

  essais++;
  for (let i = 1; i < n; i++) {
    if (D[0][i] === Infinity) continue;            // sommet inatteignable, hors sujet ici
    sommetsTestes++;
    if (d[i] !== D[0][i]) mauvaisL++;
    if (dp[i] !== D[0][i]) { mauvaisP++; if (dp[i] - D[0][i] > ecartMax) ecartMax = dp[i] - D[0][i]; }
  }
}
console.log('');
console.log('sur ' + essais + ' graphes tires au sort, ' + sommetsTestes + ' sommets atteignables,');
console.log('juges par Floyd-Warshall, qui ne partage aucune ligne avec les deux parcours :');
console.log('  distances de la largeur differentes de la plus courte    : ' + mauvaisL);
console.log('  distances de la profondeur differentes de la plus courte : ' + mauvaisP +
  '  (' + (mauvaisP / sommetsTestes * 100).toFixed(1) + ' %)');
console.log('  ecart maximal constate pour la profondeur : ' + ecartMax + ' aretes de trop');
