/* « Six degrés de séparation » : la phrase est connue, la raison ne l'est pas.
   Elle tient à une propriété des graphes qu'on peut mesurer en trente lignes. */

function rng(g) { let x = g >>> 0; return function () { x ^= x << 13; x >>>= 0; x ^= x >> 17; x ^= x << 5; x >>>= 0; return x / 4294967296; }; }

/* Un anneau régulier : n personnes en cercle, chacune connaît ses k plus proches voisines.
   C'est un « village » : tout le monde a des amis, mais uniquement des amis proches. */
function anneau(n, k) {
  const adj = Array.from({ length: n }, () => new Set());
  for (let i = 0; i < n; i++) for (let d = 1; d <= k / 2; d++) {
    const j = (i + d) % n;
    adj[i].add(j); adj[j].add(i);
  }
  return adj;
}

/* Le recâblage : on prend une part p des arêtes, et on en déplace une extrémité au hasard.
   C'est le modèle de Watts et Strogatz, 1998 — celui qui a donné son nom au « petit monde ». */
function recabler(adjSrc, p, graine) {
  const n = adjSrc.length;
  const al = rng(graine);
  const adj = adjSrc.map((s) => new Set(s));
  let deplacees = 0;
  for (let i = 0; i < n; i++) {
    for (const j of Array.from(adj[i])) {
      if (j < i) continue;                          // chaque arête une seule fois
      if (al() >= p) continue;
      let cible = Math.floor(al() * n);
      if (cible === i || adj[i].has(cible)) continue;
      adj[i].delete(j); adj[j].delete(i);
      adj[i].add(cible); adj[cible].add(i);
      deplacees++;
    }
  }
  return { adj: adj, deplacees: deplacees };
}

/* Distances depuis un sommet, par parcours en largeur. */
function distances(adj, depart) {
  const n = adj.length, d = new Int32Array(n).fill(-1);
  d[depart] = 0;
  const file = [depart];
  for (let t = 0; t < file.length; t++) {
    const s = file[t];
    for (const v of adj[s]) if (d[v] === -1) { d[v] = d[s] + 1; file.push(v); }
  }
  return d;
}

/* Le DIAMÈTRE, c'est la plus grande distance entre deux sommets : le pire cas du réseau.
   La distance MOYENNE, c'est le cas courant. On calcule les deux, sur tous les départs. */
function mesurer(adj) {
  const n = adj.length;
  let diametre = 0, somme = 0, paires = 0, isoles = 0;
  for (let i = 0; i < n; i++) {
    const d = distances(adj, i);
    for (let j = 0; j < n; j++) {
      if (j === i) continue;
      if (d[j] === -1) { isoles++; continue; }
      somme += d[j]; paires++;
      if (d[j] > diametre) diametre = d[j];
    }
  }
  let aretes = 0;
  for (const s of adj) aretes += s.size;
  return { diametre: diametre, moyenne: somme / paires, aretes: aretes / 2, isoles: isoles };
}

const n = 1000, k = 6;
const base = anneau(n, k);
const b = mesurer(base);
console.log('un anneau de ' + n + ' personnes, ' + k + ' relations chacune (le « village ») :');
console.log('  aretes ' + b.aretes + ' , distance moyenne ' + b.moyenne.toFixed(2) +
  ' , diametre ' + b.diametre);
console.log('');
console.log('on deplace une part des relations au hasard, SANS EN AJOUTER AUCUNE :');
console.log('');
console.log('part recablee   aretes deplacees   aretes   distance moyenne   diametre   paires injoignables');
[0, 0.001, 0.005, 0.01, 0.02, 0.05, 0.1, 0.5, 1].forEach(function (p, idx) {
  const r = recabler(base, p, 2000 + idx * 7919);
  const m = mesurer(r.adj);
  console.log(String(p).padEnd(15) + String(r.deplacees).padStart(11) + String(m.aretes).padStart(10) +
    m.moyenne.toFixed(2).padStart(19) + String(m.diametre).padStart(11) + String(m.isoles).padStart(21));
});

/* Le point que ce relevé démontre : ce n'est PAS le nombre de relations qui raccourcit
   les distances, c'est leur PORTÉE. On le vérifie en ajoutant des relations proches. */
const dense = anneau(n, 10);
const dm = mesurer(dense);
console.log('');
console.log('a titre de comparaison, un anneau a 10 relations chacune (67 % d aretes en plus) :');
console.log('  aretes ' + dm.aretes + ' , distance moyenne ' + dm.moyenne.toFixed(2) +
  ' , diametre ' + dm.diametre);
const petit = recabler(base, 0.01, 2000 + 3 * 7919);
const pm = mesurer(petit.adj);
console.log('contre le meme anneau a 6 relations dont ' + petit.deplacees + ' recablees :');
console.log('  aretes ' + pm.aretes + ' , distance moyenne ' + pm.moyenne.toFixed(2) +
  ' , diametre ' + pm.diametre);
console.log('');
console.log('resultat : sur un anneau, ' + petit.deplacees + ' aretes DEPLACEES font mieux que ' +
  (dm.aretes - b.aretes) + ' aretes AJOUTEES entre voisins.');

/* ATTENTION a la generalisation. Ce resultat vaut sur un anneau, ou tous les liens sont
   LOCAUX. Sur des graphes deja aleatoires — donc de portee maximale —, le nombre de
   relations compte a nouveau. On le mesure plutot que de laisser croire le contraire. */
function aleatoire(n, degre, graine) {
  const al = rng(graine);
  const adj = Array.from({ length: n }, () => new Set());
  const cible = n * degre / 2;
  let poses = 0, essais = 0;
  while (poses < cible && essais < cible * 100) {
    essais++;
    const i = Math.floor(al() * n), j = Math.floor(al() * n);
    if (i === j || adj[i].has(j)) continue;
    adj[i].add(j); adj[j].add(i); poses++;
  }
  return adj;
}
console.log('');
console.log('-- des graphes deja ALEATOIRES (tous les liens sont lointains) --');
[6, 10].forEach(function (k, i) {
  const g = aleatoire(n, k, 5000 + i * 7919);
  const m = mesurer(g);
  console.log('  degre ' + String(k).padEnd(3) + ' : aretes ' + m.aretes + ' , distance moyenne ' +
    m.moyenne.toFixed(2) + ' , diametre ' + m.diametre);
});
console.log('  -> ici, augmenter le degre raccourcit encore les distances.');
console.log('ce que la mesure etablit exactement : dans un reseau ou tous les liens sont LOCAUX,');
console.log('en ajouter d autres, locaux eux aussi, ne sert presque a rien.');
