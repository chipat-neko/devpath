/* Une carte n'est pas un réseau social : ses arêtes ont un POIDS — des minutes, des kilomètres,
   un prix. Et « le moins d'étapes » n'est alors plus « le plus court ». On mesure l'écart. */

const VILLES = ['Lyon', 'Macon', 'Dijon', 'Besancon', 'Geneve', 'Chambery', 'Grenoble', 'Valence'];

/* Des liaisons avec une durée en minutes, dans les deux sens. */
const routes = [
  ['Lyon', 'Macon', 60], ['Macon', 'Dijon', 75], ['Dijon', 'Besancon', 65],
  ['Lyon', 'Geneve', 110], ['Geneve', 'Besancon', 145], ['Lyon', 'Chambery', 75],
  ['Chambery', 'Geneve', 65], ['Chambery', 'Grenoble', 45], ['Lyon', 'Valence', 65],
  ['Valence', 'Grenoble', 70], ['Lyon', 'Grenoble', 80],
];
const adj = new Map(VILLES.map((v) => [v, []]));
for (const [a, b, t] of routes) { adj.get(a).push([b, t]); adj.get(b).push([a, t]); }

/* Le parcours en largeur, qui ne connaît que le NOMBRE d'arêtes. */
function largeur(depart) {
  const dist = new Map([[depart, 0]]), parent = new Map([[depart, null]]), file = [depart];
  while (file.length) {
    const s = file.shift();
    for (const [v] of adj.get(s)) if (!dist.has(v)) { dist.set(v, dist.get(s) + 1); parent.set(v, s); file.push(v); }
  }
  return { dist: dist, parent: parent };
}

/* DIJKSTRA : à chaque tour, on ferme la ville non encore fermée dont le total est le plus petit.
   Version simple, sans tas : on cherche le minimum en parcourant. C'est suffisant ici et
   c'est l'idée qui compte — la structure de données ne change pas le résultat, seulement le coût. */
function dijkstra(depart) {
  const total = new Map(VILLES.map((v) => [v, Infinity]));
  const parent = new Map(VILLES.map((v) => [v, null]));
  const ferme = new Set();
  total.set(depart, 0);
  const ordreFermeture = [];
  while (ferme.size < VILLES.length) {
    let u = null;
    for (const v of VILLES) if (!ferme.has(v) && (u === null || total.get(v) < total.get(u))) u = v;
    if (total.get(u) === Infinity) break;          // le reste est inatteignable
    ferme.add(u);
    ordreFermeture.push(u + '(' + total.get(u) + ')');
    for (const [v, poids] of adj.get(u)) {                     // un sommet FERMÉ ne se rouvre pas :
      if (ferme.has(v)) continue;                                // c'est là que tient toute la méthode
      if (total.get(u) + poids < total.get(v)) { total.set(v, total.get(u) + poids); parent.set(v, u); }
    }
  }
  return { total: total, parent: parent, ordre: ordreFermeture };
}

function chemin(parent, but) {
  const out = [];
  for (let s = but; s !== null && s !== undefined; s = parent.get(s)) out.unshift(s);
  return out;
}

/* La référence : on énumère TOUS les chemins sans répétition et on garde le meilleur.
   Impraticable en vrai, parfaitement praticable sur 8 villes — et c'est ce qui permet de juger. */
function meilleurParForceBrute(depart, but) {
  let best = Infinity, bestChemin = null;
  (function marcher(s, t, vus, route) {
    if (t >= best) return;
    if (s === but) { best = t; bestChemin = route.slice(); return; }
    for (const [v, poids] of adj.get(s)) if (!vus.has(v)) {
      vus.add(v); route.push(v); marcher(v, t + poids, vus, route); route.pop(); vus.delete(v);
    }
  })(depart, 0, new Set([depart]), [depart]);
  return { minutes: best, chemin: bestChemin };
}

const L = largeur('Lyon'), D = dijkstra('Lyon');

console.log('ordre de fermeture de Dijkstra depuis Lyon :');
console.log('  ' + D.ordre.join(' > '));
console.log('');
console.log('ville        etapes(largeur)   minutes(largeur)   minutes(Dijkstra)   force brute   accord');

/* Le total en minutes du chemin trouvé par la largeur : on le recalcule sur SON chemin. */
function minutesDe(route) {
  let t = 0;
  for (let i = 0; i + 1 < route.length; i++) {
    const arc = adj.get(route[i]).find((x) => x[0] === route[i + 1]);
    t += arc[1];
  }
  return t;
}
let differents = 0, sommeL = 0, sommeD = 0, desaccords = 0;
for (const v of VILLES) {
  if (v === 'Lyon') continue;
  const routeL = chemin(L.parent, v), routeD = chemin(D.parent, v);
  const mL = minutesDe(routeL), mD = minutesDe(routeD);
  const fb = meilleurParForceBrute('Lyon', v);
  if (mD !== fb.minutes) desaccords++;
  if (mL !== mD) differents++;
  sommeL += mL; sommeD += mD;
  console.log(v.padEnd(13) + String(L.dist.get(v)).padStart(11) + String(mL).padStart(19) +
    String(mD).padStart(20) + String(fb.minutes).padStart(14) +
    (mD === fb.minutes ? '   oui' : '   NON').padStart(9));
}
console.log('');
console.log('Dijkstra en desaccord avec la force brute : ' + desaccords + ' sur ' + (VILLES.length - 1));
console.log('trajets ou la largeur donne un temps different : ' + differents + ' sur ' + (VILLES.length - 1));
console.log('total des durees : largeur ' + sommeL + ' min , Dijkstra ' + sommeD + ' min , soit ' +
  (sommeL - sommeD) + ' min perdues a compter les etapes au lieu des minutes');

const ex = 'Besancon';
console.log('');
console.log('exemple, Lyon -> ' + ex);
console.log('  moins d etapes : ' + chemin(L.parent, ex).join(' > ') + '  = ' +
  minutesDe(chemin(L.parent, ex)) + ' min en ' + L.dist.get(ex) + ' etapes');
console.log('  moins de temps : ' + chemin(D.parent, ex).join(' > ') + '  = ' +
  minutesDe(chemin(D.parent, ex)) + ' min en ' + (chemin(D.parent, ex).length - 1) + ' etapes');

/* Un seul exemple ne prouve pas grand-chose. On refait la comparaison sur 300 cartes
   tirees au sort, avec des durees entre 5 et 120 minutes. */
function rng(g) { let x = g >>> 0; return function () { x ^= x << 13; x >>>= 0; x ^= x >> 17; x ^= x << 5; x >>>= 0; return x / 4294967296; }; }

let paires = 0, pires = 0, sommeEcart = 0, pireEcart = 0;
for (let t = 0; t < 300; t++) {
  const al = rng(70000 + t * 15485863);
  const n = 10;
  const A = Array.from({ length: n }, () => []);
  for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) if (al() < 0.35) {
    const w = 5 + Math.floor(al() * 116);
    A[i].push([j, w]); A[j].push([i, w]);
  }
  /* largeur : le chemin en moins d'aretes, dont on RECALCULE la duree */
  const par = new Array(n).fill(-2); par[0] = -1;
  const file = [0];
  while (file.length) { const s = file.shift(); for (const [v] of A[s]) if (par[v] === -2) { par[v] = s; file.push(v); } }
  function dureeLargeur(cible) {
    let d = 0;
    for (let s = cible; par[s] >= 0; s = par[s]) d += A[s].find((x) => x[0] === par[s])[1];
    return d;
  }
  /* Dijkstra : le chemin le plus court en duree */
  const tot = new Array(n).fill(Infinity); tot[0] = 0;
  const ferme = new Array(n).fill(false);
  for (;;) {
    let u = -1;
    for (let v = 0; v < n; v++) if (!ferme[v] && tot[v] < Infinity && (u === -1 || tot[v] < tot[u])) u = v;
    if (u === -1) break;
    ferme[u] = true;
    for (const [v, w] of A[u]) if (!ferme[v] && tot[u] + w < tot[v]) tot[v] = tot[u] + w;
  }
  for (let i = 1; i < n; i++) {
    if (par[i] === -2) continue;
    paires++;
    const ecart = dureeLargeur(i) - tot[i];
    if (ecart > 0) { pires++; sommeEcart += ecart; if (ecart > pireEcart) pireEcart = ecart; }
  }
}
console.log('');
console.log('sur 300 cartes tirees au sort, ' + paires + ' trajets :');
console.log('  le chemin en MOINS D ETAPES est plus long en minutes : ' + pires +
  ' fois (' + (pires / paires * 100).toFixed(1) + ' %)');
console.log('  retard moyen quand cela arrive : ' + (sommeEcart / pires).toFixed(1) +
  ' min , pire cas : ' + pireEcart + ' min');

/* Ce que Dijkstra EXIGE : des poids positifs. Avec une arete negative il se trompe,
   et il ne previent pas. Le contre-exemple le plus court tient en trois aretes. */
function dijkstraOriente(A, n, depart) {
  const tot = new Array(n).fill(Infinity); tot[depart] = 0;
  const ferme = new Array(n).fill(false);
  for (;;) {
    let u = -1;
    for (let v = 0; v < n; v++) if (!ferme[v] && tot[v] < Infinity && (u === -1 || tot[v] < tot[u])) u = v;
    if (u === -1) break;
    ferme[u] = true;
    for (const [v, w] of A[u]) if (!ferme[v] && tot[u] + w < tot[v]) tot[v] = tot[u] + w;
  }
  return tot;
}
/* 0 -> 1 coute 1 ; 0 -> 2 coute 5 ; 2 -> 1 coute -10 (une remise, un gain, un credit). */
const G = [[[1, 1], [2, 5]], [], [[1, -10]]];
const tot = dijkstraOriente(G, 3, 0);
/* La verite, par enumeration de tous les chemins simples. */
function meilleurSimple(A, n, depart, but) {
  let best = Infinity;
  (function marcher(s, c, vus) {
    if (s === but) { if (c < best) best = c; return; }
    for (const [v, w] of A[s]) if (!vus.has(v)) { vus.add(v); marcher(v, c + w, vus); vus.delete(v); }
  })(depart, 0, new Set([depart]));
  return best;
}
console.log('');
console.log('-- un graphe oriente a trois sommets, avec une arete de poids -10 --');
console.log('Dijkstra annonce  0 -> 1 : ' + tot[1]);
console.log('la verite (tous les chemins) : ' + meilleurSimple(G, 3, 0, 1) + '  par 0 > 2 > 1, qui coute 5 - 10');
console.log('ecart : ' + (tot[1] - meilleurSimple(G, 3, 0, 1)) +
  '  -> Dijkstra ' + (tot[1] === meilleurSimple(G, 3, 0, 1) ? 'tombe juste' : 'SE TROMPE, sans le signaler'));
console.log('la cause : il FERME le sommet 1 des le premier tour, et ne le rouvre jamais.');
