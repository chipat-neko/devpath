/* Où le tri fusion commence-t-il vraiment à gagner, et que faire en dessous.
   C’est la question que se posent les VRAIES bibliothèques de tri : toutes
   basculent sur un tri quadratique pour les petits morceaux. On mesure le
   seuil au lieu de le recopier. */

function alea(graine) {
  let e = graine >>> 0;
  return function () { e ^= e << 13; e >>>= 0; e ^= e >>> 17; e ^= e << 5; e >>>= 0; return e / 4294967296; };
}
function jeu(n, graine) {
  const t = [], r = alea(graine);
  for (let i = 0; i < n; i++) t.push(Math.floor(r() * 1000000));
  return t;
}

/* Unité de coût commune aux deux tris : une comparaison ou un déplacement. */
let ops = 0;
let appels = 0;   // nombre d’appels récursifs : ce que le comptage d’opérations IGNORE

function insertionSur(a, deb, fin) {          // trie a[deb..fin] sur place
  for (let i = deb + 1; i <= fin; i++) {
    const x = a[i]; let j = i - 1;
    while (j >= deb && (ops++, a[j] > x)) { a[j + 1] = a[j]; ops++; j--; }
    a[j + 1] = x; ops++;
  }
}
function insertion(t) { const a = t.slice(); insertionSur(a, 0, a.length - 1); return a; }

function fusionSeuil(t, seuil) {
  appels++;
  if (t.length <= seuil) { const a = t.slice(); insertionSur(a, 0, a.length - 1); return a; }
  const m = t.length >> 1;
  const g = fusionSeuil(t.slice(0, m), seuil), d = fusionSeuil(t.slice(m), seuil), r = [];
  let i = 0, j = 0;
  while (i < g.length && j < d.length) { ops += 2; r.push(g[i] <= d[j] ? g[i++] : d[j++]); }
  while (i < g.length) { ops++; r.push(g[i++]); }
  while (j < d.length) { ops++; r.push(d[j++]); }
  return r;
}
const fusion = (t) => fusionSeuil(t, 1);

function mesurer(f, t) { ops = 0; const r = f(t); return { ops: ops, r: r }; }

/* --- 1. le croisement ---------------------------------------------------- */
console.log('MOYENNE SUR 40 TIRAGES, opérations comptées (comparaisons + déplacements)');
console.log('');
console.log('    n   insertion   fusion   gagnant');
console.log('  ----  ---------  -------   -------');
let premierGain = null, tirages = 0, identiques = 0;
[2, 4, 8, 9, 10, 11, 12, 16, 24, 32, 64, 128, 512].forEach(function (n) {
  let si = 0, sf = 0;
  for (let k = 0; k < 40; k++) {
    const t = jeu(n, 1000 + k);
    const a = mesurer(insertion, t), b = mesurer(fusion, t);
    tirages++; if (a.r.join(',') === b.r.join(',')) identiques++;
    si += a.ops; sf += b.ops;
  }
  const mi = si / 40, mf = sf / 40;
  if (premierGain === null && mf < mi) premierGain = n;
  console.log('  ' + String(n).padStart(4) + '  ' + mi.toFixed(1).padStart(9) + '  ' +
    mf.toFixed(1).padStart(7) + '   ' + (mf < mi ? 'fusion' : 'insertion'));
});
console.log('');
console.log('Les deux tris rendent le même tableau sur les ' + tirages + ' tirages : ' + (identiques === tirages));
console.log('Le tri fusion ne gagne qu’à partir de n = ' + premierGain + ', et de peu. En dessous, la « bonne »');
console.log('classe perd : ses appels, ses tableaux intermédiaires et ses copies coûtent plus');
console.log('cher que les quelques déplacements du tri quadratique.');

/* --- 2. le seuil optimal, et ce que le comptage d’opérations ne voit pas --- */
console.log('');
console.log('TRI HYBRIDE : fusion, mais insertion dès qu’un morceau tient en S cases, n = 4096');
console.log('');
const N = 4096, SEUILS = [1, 2, 4, 8, 16, 32, 64, 128, 256];
const bancs = [];
for (let k = 0; k < 10; k++) bancs.push(jeu(N, 7000 + k));
const brut = SEUILS.map(function (S) {
  let so = 0, sa = 0;
  bancs.forEach(function (t) { ops = 0; appels = 0; fusionSeuil(t, S); so += ops; sa += appels; });
  return { S: S, ops: Math.round(so / bancs.length), appels: Math.round(sa / bancs.length) };
});

console.log('    S   opérations   appels récursifs');
console.log('  ----  -----------  ----------------');
brut.forEach(function (x) {
  console.log('  ' + String(x.S).padStart(4) + '  ' + String(x.ops).padStart(11) + '  ' + String(x.appels).padStart(16));
});

/* Un appel coûte plus qu’une comparaison : il alloue trois tableaux. On refait
   le classement en facturant K unités par appel, pour quatre valeurs de K. */
console.log('');
console.log('SEUIL OPTIMAL selon ce qu’on facture à un appel récursif (K unités par appel)');
console.log('');
console.log('    K   seuil optimal   coût au seuil optimal   coût à S = 1');
console.log('  ----  -------------   ---------------------   ------------');
[0, 5, 20, 60].forEach(function (K) {
  const cout = (x) => x.ops + K * x.appels;
  const best = brut.reduce((a, b) => (cout(b) < cout(a) ? b : a));
  console.log('  ' + String(K).padStart(4) + '  ' + String(best.S).padStart(13) + '   ' +
    String(cout(best)).padStart(21) + '   ' + String(cout(brut[0])).padStart(12));
});
console.log('');
console.log('Le seuil optimal DÉPEND du modèle de coût. À K = 0 — quand on ne compte que');
console.log('les comparaisons — il vaut ' + brut.reduce((a, b) => (b.ops < a.ops ? b : a)).S +
  ' ; dès qu’on facture les appels, il monte.');
console.log('Un seuil réglé sur les seules comparaisons est donc trop bas : dans une vraie');
console.log('machine, un appel coûte bien plus qu’une comparaison — allocation, copie,');
console.log('défaut de cache. C’est pourquoi les tris hybrides réels basculent plus haut.');
console.log('');
console.log('Et la classe, elle, ne bouge pas : le tri hybride reste O(n log n) pour TOUT S.');
console.log('S est une constante, la notation la jette — et pourtant, entre S = 1 et S = 256,');
console.log('le travail compté passe de ' + brut[0].ops + ' à ' + brut[brut.length - 1].ops + ' opérations,');
console.log('soit ' + (brut[brut.length - 1].ops / brut[0].ops).toFixed(1) + ' fois plus. Voilà ce que la notation ne dit pas.');
