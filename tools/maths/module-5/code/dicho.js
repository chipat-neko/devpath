/* LA RECHERCHE DICHOTOMIQUE : le logarithme au travail.
   Toutes les valeurs ci-dessous sont comptées sur des recherches réellement
   effectuées, pour CHAQUE position possible — pas sur un exemple choisi. */

function tableauTrie(n) { const t = new Array(n); for (let i = 0; i < n; i++) t[i] = i * 2; return t; }

function rechercheLineaire(t, cible) {
  let c = 0;
  for (let i = 0; i < t.length; i++) { c++; if (t[i] === cible) return { trouve: i, comparaisons: c }; }
  return { trouve: -1, comparaisons: c };
}
function rechercheDicho(t, cible) {
  let g = 0, d = t.length - 1, c = 0;
  while (g <= d) {
    c++;
    const m = (g + d) >> 1;
    if (t[m] === cible) return { trouve: m, comparaisons: c };
    if (t[m] < cible) g = m + 1; else d = m - 1;
  }
  return { trouve: -1, comparaisons: c };
}

/* --- 1. toutes les positions, pas une --------------------------------- */
console.log('CHAQUE ÉLÉMENT CHERCHÉ UNE FOIS — les deux recherches, exhaustivement');
console.log('');
console.log('       n   linéaire (moy.)   (n+1)/2   dicho (moy.)   dicho (pire)   ⌈log₂(n+1)⌉');
console.log('  ------   ---------------   -------   ------------   ------------   -----------');
[10, 100, 1000, 5000].forEach(function (n) {
  const t = tableauTrie(n);
  let sl = 0, sd = 0, pire = 0, justes = 0;
  for (let i = 0; i < n; i++) {
    const a = rechercheLineaire(t, t[i]), b = rechercheDicho(t, t[i]);
    if (a.trouve === b.trouve) justes++;
    sl += a.comparaisons; sd += b.comparaisons;
    if (b.comparaisons > pire) pire = b.comparaisons;
  }
  const absent = rechercheDicho(t, -1);
  if (absent.comparaisons > pire) pire = absent.comparaisons;
  if (justes !== n) throw new Error('les deux recherches divergent à n=' + n);
  console.log('  ' + String(n).padStart(6) + '   ' + (sl / n).toFixed(1).padStart(15) + '   ' +
    ((n + 1) / 2).toFixed(1).padStart(7) + '   ' + (sd / n).toFixed(2).padStart(12) + '   ' +
    String(pire).padStart(12) + '   ' + String(Math.ceil(Math.log2(n + 1))).padStart(11));
});
console.log('');
console.log('Deux formules se vérifient sur ces quatre tailles, colonne contre colonne :');
console.log('  · la recherche linéaire réussie coûte en moyenne EXACTEMENT (n+1)/2 ;');
console.log('  · le pire cas de la dichotomie vaut EXACTEMENT ⌈log₂(n+1)⌉.');
console.log('Ce sont elles qu’on emploie plus bas, là où tout parcourir serait trop long :');
console.log('à n = 10^6, la seule colonne « linéaire » demanderait 5·10^11 comparaisons.');

/* --- les grandes tailles : la dichotomie seule, la linéaire par sa formule --- */
console.log('');
console.log('LA DICHOTOMIE SEULE, SUR DE VRAIS TABLEAUX PLUS GRANDS');
console.log('        n   dicho (moy.)   dicho (pire)   ⌈log₂(n+1)⌉   linéaire (moy., formule)');
console.log('  -------   ------------   ------------   -----------   ------------------------');
[50000, 200000].forEach(function (n) {
  const t = tableauTrie(n);
  let sd = 0, pire = 0;
  for (let i = 0; i < n; i++) {
    const b = rechercheDicho(t, t[i]);
    sd += b.comparaisons;
    if (b.comparaisons > pire) pire = b.comparaisons;
  }
  console.log('  ' + String(n).padStart(7) + '   ' + (sd / n).toFixed(2).padStart(12) + '   ' +
    String(pire).padStart(12) + '   ' + String(Math.ceil(Math.log2(n + 1))).padStart(11) + '   ' +
    ((n + 1) / 2).toFixed(1).padStart(24));
});

/* --- 2. ce que coûte une taille cent fois plus grande ------------------- */
console.log('');
console.log('DE MILLE À UN MILLIARD D’ÉLÉMENTS');
console.log('');
console.log('              n   linéaire, pire cas   dicho, pire cas');
console.log('  -------------   ------------------   ---------------');
[1e3, 1e6, 1e9, 1e12].forEach(function (n) {
  console.log('  ' + n.toExponential(0).padStart(13) + '   ' + n.toExponential(0).padStart(18) + '   ' +
    String(Math.ceil(Math.log2(n + 1))).padStart(15));
});
console.log('');
console.log('Un milliard d’éléments : ' + Math.ceil(Math.log2(1e9 + 1)) + ' comparaisons. Mille milliards : ' +
  Math.ceil(Math.log2(1e12 + 1)) + '.');
console.log('Multiplier la taille par mille coûte ' + (Math.ceil(Math.log2(1e12 + 1)) - Math.ceil(Math.log2(1e9 + 1))) +
  ' comparaisons de plus. Dix, pas mille.');

/* --- 3. le prix d’entrée : il faut que ce soit trié --------------------- */
console.log('');
console.log('LE PRIX D’ENTRÉE : IL FAUT TRIER D’ABORD');
const n = 100000;

/* Le tri est EXÉCUTÉ, pas modélisé : c'est un tri fusion instrumenté, et le
   chiffre ci-dessous est le nombre de comparaisons qu'il a réellement faites.
   Une première version de ce programme employait n·log₂n — un modèle — tout en
   annonçant une mesure ; l'écart valait 8 %, et le seuil trois recherches. */
let comparaisonsTri = 0;
function triFusion(t) {
  if (t.length < 2) return t.slice();
  const m = t.length >> 1;
  const g = triFusion(t.slice(0, m)), d = triFusion(t.slice(m)), r = [];
  let i = 0, j = 0;
  while (i < g.length && j < d.length) { comparaisonsTri++; r.push(g[i] <= d[j] ? g[i++] : d[j++]); }
  while (i < g.length) r.push(g[i++]);
  while (j < d.length) r.push(d[j++]);
  return r;
}
function alea(graine) {
  let e = graine >>> 0;
  return function () { e ^= e << 13; e >>>= 0; e ^= e >>> 17; e ^= e << 5; e >>>= 0; return e / 4294967296; };
}
const rr = alea(20260919), desordre = [];
for (let i = 0; i < n; i++) desordre.push(Math.floor(rr() * 1000000));
const trie = triFusion(desordre);
let ordonne = true;
for (let i = 1; i < trie.length; i++) if (trie[i] < trie[i - 1]) ordonne = false;

/* Les deux recherches sont exécutées elles aussi, sur toutes les positions. */
let sommeLin = 0, sommeDic = 0;
const pas = 200;                                   // un échantillon régulier de 500 positions
let echantillon = 0;
for (let i = 0; i < n; i += pas) {
  sommeLin += rechercheLineaire(trie, trie[i]).comparaisons;
  sommeDic += rechercheDicho(trie, trie[i]).comparaisons;
  echantillon++;
}
const coutTri = comparaisonsTri;
const coutLin = sommeLin / echantillon;
const coutDic = sommeDic / echantillon;
let k = 1;
while (coutTri + k * coutDic > k * coutLin) k++;
console.log('  n = ' + n + ', tableau réellement trié : ' + ordonne);
console.log('  trier une fois, MESURÉ ....... : ' + coutTri + ' comparaisons');
console.log('  (le modèle n·log₂n en annoncerait ' + Math.round(n * Math.log2(n)) + ', soit ' +
  ((n * Math.log2(n)) / coutTri).toFixed(3) + ' fois la mesure)');
console.log('  une recherche linéaire ....... : ' + coutLin.toFixed(1) + ' comparaisons, moyennées sur ' +
  echantillon + ' positions');
console.log('  une recherche dichotomique ... : ' + coutDic.toFixed(2) + ' comparaisons, mêmes positions');
console.log('  gain par recherche ........... : ' + Math.round(coutLin - coutDic) + ' comparaisons');
console.log('  seuil de rentabilité ......... : ' + k + ' recherches');
console.log('');
console.log('  En dessous de ' + k + ' recherches sur le même tableau, trier coûte plus cher que');
console.log('  de parcourir bêtement. C’est la question à se poser avant d’écrire un index :');
console.log('  combien de fois vais-je interroger cette donnée ?');
console.log('');
console.log('  Et si la donnée change entre deux recherches, il faut retrier — ou tenir');
console.log('  le tableau trié à chaque insertion, ce qui déplace le coût, sans le supprimer.');
