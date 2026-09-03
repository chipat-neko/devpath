/* Une matrice n'est pas un tableau de nombres : c'est une MACHINE qui transforme un vecteur
   en un autre vecteur. Sur un graphe, cette machine porte un nom très concret : « propager ». */

const S = ['A', 'B', 'C', 'D', 'E'];
const ARETES = [['A', 'B'], ['A', 'C'], ['B', 'C'], ['B', 'D'], ['D', 'E'], ['C', 'E']];
const n = S.length;
const idx = new Map(S.map((s, i) => [s, i]));

const A = Array.from({ length: n }, () => new Array(n).fill(0));
for (const [a, b] of ARETES) { A[idx.get(a)][idx.get(b)] = 1; A[idx.get(b)][idx.get(a)] = 1; }

/* LE produit matrice-vecteur, en trois lignes. La case i du résultat est la somme
   des v[j] pour tous les j reliés à i : « ce qui arrive en i vient de ses voisins ». */
function fois(M, v) {
  const out = new Array(M.length).fill(0);
  for (let i = 0; i < M.length; i++) {
    let somme = 0;
    for (let j = 0; j < v.length; j++) somme += M[i][j] * v[j];
    out[i] = somme;
  }
  return out;
}

function montrer(nom, v) {
  console.log(nom.padEnd(22) + v.map((x) => String(x).padStart(5)).join('') +
    '     total ' + v.reduce((a, b) => a + b, 0));
}

console.log('sommets                   ' + S.map((s) => s.padStart(5)).join(''));
console.log('');

/* Un 1 posé sur A, et rien ailleurs. Attention : rien ici n'est « réparti » — le total
   AUGMENTE à chaque pas, parce qu'on compte des chemins et non une masse conservée. */
let v = [1, 0, 0, 0, 0];
montrer('depart (un 1 sur A)', v);

/* Un produit = un pas de propagation. */
for (let pas = 1; pas <= 4; pas++) {
  v = fois(A, v);
  montrer('apres ' + pas + ' produit' + (pas > 1 ? 's' : ''), v);
}

/* Ce que ces nombres SONT : le nombre de chemins de longueur k qui mènent de A au sommet.
   On le vérifie par énumération directe, sans aucune matrice. */
function compterChemins(depart, but, longueur) {
  const voisins = S.map((_, i) => S.map((_, j) => j).filter((j) => A[i][j] === 1));
  let total = 0;
  (function marcher(s, reste) {
    if (reste === 0) { if (s === but) total++; return; }
    for (const v of voisins[s]) marcher(v, reste - 1);
  })(depart, longueur);
  return total;
}

console.log('');
console.log('verification par enumeration, sans matrice :');
console.log('');
console.log('longueur   ' + S.map((s) => ('vers ' + s).padStart(9)).join('') + '     accord');
let desaccords = 0;
for (let k = 1; k <= 4; k++) {
  let w = [1, 0, 0, 0, 0];
  for (let t = 0; t < k; t++) w = fois(A, w);
  const brute = S.map((_, j) => compterChemins(0, j, k));
  const ok = JSON.stringify(w) === JSON.stringify(brute);
  if (!ok) desaccords++;
  console.log(('k = ' + k).padEnd(11) + brute.map((x) => String(x).padStart(9)).join('') +
    (ok ? '     oui' : '     NON'));
}
console.log('');
console.log('desaccords entre le produit de matrices et l enumeration : ' + desaccords);

/* Le vecteur de départ n'est pas obligé d'avoir un seul 1. Mettre 1 partout revient à
   demander « combien de voisins as-tu ? » : le produit rend les DEGRES. */
const uns = new Array(n).fill(1);
const degres = fois(A, uns);
console.log('');
montrer('A x (1,1,1,1,1)', degres);
console.log('degres calcules a la main : ' + S.map((s, i) => s + '=' + A[i].reduce((x, y) => x + y, 0)).join(', '));

/* Et une matrice n'est pas forcement carree. Celle-ci a 3 lignes et 5 colonnes :
   elle transforme un vecteur de 5 nombres en un vecteur de 3. C'est ce que fait
   une couche de reseau de neurones, sujet de la fin de cette lecon. */
const R = [
  [1, 1, 0, 0, 0],      // groupe « ouest »  : A et B
  [0, 0, 1, 0, 0],      // groupe « centre » : C
  [0, 0, 0, 1, 1],      // groupe « est »    : D et E
];
const population = [12, 30, 45, 8, 21];
console.log('');
console.log('une matrice 3x5 qui regroupe 5 sommets en 3 zones :');
console.log('population par sommet : ' + population.join(', '));
console.log('population par zone   : ' + fois(R, population).join(', ') +
  '   (total ' + fois(R, population).reduce((a, b) => a + b, 0) +
  ' , contre ' + population.reduce((a, b) => a + b, 0) + ' au depart)');

/* La regle des dimensions, celle qui provoque 90 % des erreurs : pour multiplier une
   matrice de taille (l x c) par un vecteur, le vecteur doit avoir EXACTEMENT c cases. */
console.log('');
console.log('regle des dimensions : (3 x 5) fois un vecteur de 5 -> un vecteur de 3');
try {
  const faux = fois(R, [1, 2, 3]);
  console.log('avec un vecteur de 3 cases, le calcul rend : ' + JSON.stringify(faux) +
    '  -> aucune erreur levee, et un resultat FAUX');
} catch (e) {
  console.log('erreur levee : ' + e.message);
}
