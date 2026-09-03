/* Le MÊME graphe, écrit de trois façons différentes.
   Un petit réseau de transport : 8 stations, 10 liaisons parcourues dans les deux sens. */

const STATIONS = ['Nord', 'Halles', 'Opera', 'Gare', 'Parc', 'Fac', 'Port', 'Sud'];

/* 1. La liste d'ARÊTES : on écrit les liaisons, et rien d'autre. */
const aretes = [
  ['Nord', 'Halles'], ['Nord', 'Opera'], ['Halles', 'Opera'], ['Halles', 'Gare'],
  ['Opera', 'Gare'], ['Gare', 'Parc'], ['Parc', 'Fac'], ['Gare', 'Port'],
  ['Port', 'Sud'], ['Parc', 'Sud'],
];

/* 2. La liste d'ADJACENCE : pour chaque station, la liste de ses voisines. */
const adjacence = new Map(STATIONS.map((s) => [s, []]));
for (const [a, b] of aretes) { adjacence.get(a).push(b); adjacence.get(b).push(a); }

/* 3. La MATRICE d'adjacence : une case par PAIRE de stations, 1 s'il y a une liaison. */
const indice = new Map(STATIONS.map((s, i) => [s, i]));
const n = STATIONS.length;
const M = Array.from({ length: n }, () => new Array(n).fill(0));
for (const [a, b] of aretes) { M[indice.get(a)][indice.get(b)] = 1; M[indice.get(b)][indice.get(a)] = 1; }

console.log('graphe : ' + n + ' sommets, ' + aretes.length + ' aretes');
console.log('');
console.log('-- la matrice, telle quelle --');
console.log('        ' + STATIONS.map((s) => s.slice(0, 3).padStart(4)).join(''));
for (let i = 0; i < n; i++) {
  console.log(STATIONS[i].padEnd(8) + M[i].map((v) => String(v).padStart(4)).join(''));
}

/* La matrice est-elle SYMÉTRIQUE ? Elle doit l'être : le graphe n'est pas orienté. */
let asym = 0;
for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) if (M[i][j] !== M[j][i]) asym++;
console.log('');
console.log('cases ou M[i][j] != M[j][i] : ' + asym + '   (0 = graphe non oriente)');

/* Le DEGRÉ d'un sommet, c'est son nombre de voisins.
   Sur la matrice, c'est la somme de sa ligne ; sur la liste, la longueur du tableau. */
console.log('');
console.log('-- degres, calcules des deux facons --');
let ecarts = 0;
for (let i = 0; i < n; i++) {
  const parLigne = M[i].reduce((s, v) => s + v, 0);
  const parListe = adjacence.get(STATIONS[i]).length;
  if (parLigne !== parListe) ecarts++;
  console.log(STATIONS[i].padEnd(8) + 'ligne=' + parLigne + '  liste=' + parListe);
}
console.log('desaccords entre les deux methodes : ' + ecarts);

/* La somme des degrés vaut DEUX fois le nombre d'arêtes : chaque arête est comptée
   à ses deux extrémités. C'est le « lemme des poignées de main ». */
const sommeDegres = STATIONS.reduce((s, v) => s + adjacence.get(v).length, 0);
console.log('');
console.log('somme des degres = ' + sommeDegres + ' , 2 x aretes = ' + (2 * aretes.length) +
  '  -> ' + (sommeDegres === 2 * aretes.length ? 'egal' : 'DIFFERENT'));

/* Ce que chaque représentation COÛTE, en cases mémoire. */
console.log('');
console.log('-- place occupee, en cases --');
console.log("liste d'aretes    : " + (2 * aretes.length));
console.log("liste d'adjacence : " + sommeDegres);
console.log('matrice           : ' + (n * n));

/* Ce que chaque représentation sait faire VITE. */
function voisinsParListe(s) { return adjacence.get(s); }
function voisinsParMatrice(s) {
  const i = indice.get(s), out = [];
  for (let j = 0; j < n; j++) if (M[i][j]) out.push(STATIONS[j]);
  return out;
}
console.log('');
console.log('voisins de Gare, par la liste   : ' + voisinsParListe('Gare').join(', '));
console.log('voisins de Gare, par la matrice : ' + voisinsParMatrice('Gare').join(', '));
console.log('cases lues pour cette reponse   : liste ' + adjacence.get('Gare').length + ' , matrice ' + n);

/* Et ce que la MATRICE sait faire vite : repondre a « y a-t-il une liaison ? » en UNE lecture. */
const q = ['Nord', 'Sud'];
console.log('');
console.log('liaison directe ' + q[0] + '-' + q[1] + ' ? matrice : une case, M[' +
  indice.get(q[0]) + '][' + indice.get(q[1]) + '] = ' + M[indice.get(q[0])][indice.get(q[1])]);
console.log('                          liste : parcourir les ' + adjacence.get(q[0]).length + ' voisins de ' + q[0]);
