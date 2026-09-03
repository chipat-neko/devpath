/* MEILLEUR CAS, CAS MOYEN, PIRE CAS — trois nombres, pas un.
   « O(n²) » ne dit pas lequel des trois on est en train de payer. */

function alea(graine) {
  let e = graine >>> 0;
  return function () { e ^= e << 13; e >>>= 0; e ^= e >>> 17; e ^= e << 5; e >>>= 0; return e / 4294967296; };
}

let ops = 0;

function insertion(t) {
  const a = t.slice();
  for (let i = 1; i < a.length; i++) {
    const x = a[i]; let j = i - 1;
    while (j >= 0 && (ops++, a[j] > x)) { a[j + 1] = a[j]; ops++; j--; }
    a[j + 1] = x; ops++;
  }
  return a;
}

/* Tri rapide « scolaire » : pivot = dernier élément. C’est la version qu’on
   trouve dans la moitié des cours, et elle a un pire cas spectaculaire. */
function rapide(t) {
  const a = t.slice();
  (function tri(g, d) {
    if (g >= d) return;
    const pivot = a[d]; let i = g;
    for (let j = g; j < d; j++) { ops++; if (a[j] < pivot) { const s = a[i]; a[i] = a[j]; a[j] = s; i++; ops++; } }
    const s = a[i]; a[i] = a[d]; a[d] = s; ops++;
    tri(g, i - 1); tri(i + 1, d);
  })(0, a.length - 1);
  return a;
}

const N = 1000;
const croissant = []; for (let i = 0; i < N; i++) croissant.push(i);
const decroissant = croissant.slice().reverse();
const r = alea(20260903);
const melange = []; for (let i = 0; i < N; i++) melange.push(Math.floor(r() * 1000000));
const identiques = new Array(N).fill(42);
/* « Presque triée » : la donnée réelle la plus fréquente — un fichier trié dont
   on a déplacé quelques lignes. 1 % des éléments échangés au hasard. */
const r2 = alea(20260918);
const presqueTriee = croissant.slice();
for (let k = 0; k < N / 100; k++) {
  const i = Math.floor(r2() * N), j = Math.floor(r2() * N);
  const s = presqueTriee[i]; presqueTriee[i] = presqueTriee[j]; presqueTriee[j] = s;
}

function m(f, t) { ops = 0; f(t); return ops; }

console.log('n = ' + N + ' — opérations comptées');
console.log('');
console.log('entrée                        tri par insertion   tri rapide (pivot = dernier)');
console.log('---------------------------   -----------------   ----------------------------');
[['déjà triée', croissant], ['presque triée (1 % permuté)', presqueTriee],
 ['triée à l’envers', decroissant],
 ['tirée au sort', melange], ['toutes égales', identiques]].forEach(function (p) {
  const a = m(insertion, p[1]);
  let b;
  try { b = String(m(rapide, p[1])); } catch (e) { b = 'débordement de pile (' + e.name + ')'; }
  console.log(p[0].padEnd(29) + String(a).padStart(17) + '   ' + b.padStart(28));
});

console.log('');
console.log('LE TRI PAR INSERTION');
const meilleur = m(insertion, croissant), pire = m(insertion, decroissant), moyen = m(insertion, melange);
console.log('  meilleur cas (déjà triée) : ' + meilleur + ' — c’est 2(n−1), donc LINÉAIRE : ' + (meilleur === 2 * (N - 1)));
console.log('  pire cas (à l’envers) ... : ' + pire + ' — quadratique');
console.log('  cas tiré au sort ........ : ' + moyen + ', soit ' +
  (100 * moyen / pire).toFixed(1) + ' % du pire cas — la moitié, plus ou moins');
console.log('  rapport pire / meilleur . : ' + Math.round(pire / meilleur) + ' fois');
const pt = m(insertion, presqueTriee), ptr = m(rapide, presqueTriee);
console.log('  entrée PRESQUE triée .... : ' + pt + ', soit ' + (100 * pt / pire).toFixed(1) +
  ' % du pire cas et ' + (pt / moyen).toFixed(3) + ' fois le cas tiré au sort');
console.log('  On écrit O(n²) parce que la notation majore. Sur une entrée presque triée,');
console.log('  ce tri réputé mauvais coûte ' + Math.round(moyen / pt) + ' fois moins que sur du désordre —');
console.log('  et ' + (ptr / pt).toFixed(1) + ' fois moins que le tri rapide sur la même entrée.');

console.log('');
console.log('LE TRI RAPIDE, ET SON PIÈGE');
console.log('  Sur une entrée tirée au sort, ce tri est excellent. Sur une entrée DÉJÀ TRIÉE,');
console.log('  le pivot choisi est toujours le plus grand : les partitions sont de tailles 0 et');
console.log('  n−1, la récursion descend de n étages, et le coût devient quadratique.');
console.log('  C’est un vrai incident de production : la donnée triée est le cas le plus fréquent.');

/* Combien de fois le hasard tombe-t-il sur le pire cas ? Mesuré, pas supposé. */
let total = 300, somme = 0, maxi = 0, mini = Infinity;
const couts = [];
for (let k = 0; k < total; k++) {
  const rr = alea(50000 + k), t = [];
  for (let i = 0; i < 300; i++) t.push(Math.floor(rr() * 1000000));
  const c = m(rapide, t);
  couts.push(c); somme += c; if (c > maxi) maxi = c; if (c < mini) mini = c;
}
const moyenne = somme / total;
const audela = couts.filter((c) => c > 1.25 * moyenne).length;
console.log('');
console.log('300 entrées de 300 éléments tirées au sort, tri rapide :');
console.log('  coût moyen .................. : ' + Math.round(moyenne));
console.log('  le meilleur ................. : ' + mini);
console.log('  le pire observé ............. : ' + maxi + ', soit ' + (maxi / moyenne).toFixed(2) + ' fois la moyenne');
console.log('  au-delà de 1,25 fois la moyenne : ' + audela + ' sur ' + total);
const trie300 = []; for (let i = 0; i < 300; i++) trie300.push(i);
const coutTrie300 = m(rapide, trie300);
console.log('  pire cas théorique : ' + (300 * 299 / 2) + ' comparaisons — jamais approché par le hasard.');
console.log('  la MÊME taille, mais DÉJÀ TRIÉE : ' + coutTrie300 + ' opérations, soit ' +
  (coutTrie300 / moyenne).toFixed(1) + ' fois la moyenne.');
console.log('  Le hasard ne trouve pas le pire cas. Une donnée ordinaire, si.');
console.log('');
console.log('Le cas moyen n’est pas la moyenne du meilleur et du pire : c’est une moyenne');
console.log('sur une LOI de tirage. Changez la loi — des données déjà triées, par exemple —');
console.log('et le cas moyen change avec elle.');
