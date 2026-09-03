/* DIVISER POUR RÉGNER : d’où vient le « n log n », et pourquoi couper en trois
   au lieu de quatre change l’EXPOSANT, pas seulement la constante. */

/* --- 1. le tri fusion, étage par étage ---------------------------------- */
const travailParEtage = [];
function fusion(t, etage) {
  if (t.length < 2) return t.slice();
  const m = t.length >> 1;
  const g = fusion(t.slice(0, m), etage + 1), d = fusion(t.slice(m), etage + 1), r = [];
  let i = 0, j = 0;
  while (i < g.length && j < d.length) { r.push(g[i] <= d[j] ? g[i++] : d[j++]); }
  while (i < g.length) r.push(g[i++]);
  while (j < d.length) r.push(d[j++]);
  travailParEtage[etage] = (travailParEtage[etage] || 0) + t.length;   // la fusion parcourt t.length cases
  return r;
}

function alea(graine) {
  let e = graine >>> 0;
  return function () { e ^= e << 13; e >>>= 0; e ^= e >>> 17; e ^= e << 5; e >>>= 0; return e / 4294967296; };
}
const N = 1024;
const r = alea(20260915);
const jeu = []; for (let i = 0; i < N; i++) jeu.push(Math.floor(r() * 100000));

fusion(jeu, 0);
console.log('TRI FUSION SUR n = ' + N + ' — travail par étage de la récursion');
console.log('');
console.log('  étage   morceaux   taille de chaque   cases parcourues');
console.log('  -----   --------   ----------------   ----------------');
let total = 0;
travailParEtage.forEach(function (w, e) {
  if (w === undefined) return;
  total += w;
  console.log('  ' + String(e).padStart(5) + '   ' + String(Math.pow(2, e)).padStart(8) + '   ' +
    String(N / Math.pow(2, e)).padStart(16) + '   ' + String(w).padStart(16));
});
console.log('  -----   --------   ----------------   ----------------');
console.log('  total' + ' '.repeat(33) + String(total).padStart(16));
console.log('');
console.log('Chaque étage parcourt ' + N + ' cases : les morceaux rétrécissent, mais ils sont');
console.log('deux fois plus nombreux. Le produit ne bouge pas.');
console.log('Le nombre d’étages qui travaillent vaut log₂(' + N + ') = ' + Math.log2(N) + '.');
console.log('D’où le total : n × log₂(n) = ' + N + ' × ' + Math.log2(N) + ' = ' + (N * Math.log2(N)) +
  ', et le mesuré vaut ' + total + '.');
console.log('identiques : ' + (total === N * Math.log2(N)));
console.log('');
console.log('« n log n » n’est donc pas une incantation : c’est LARGEUR × PROFONDEUR.');

/* --- 2. couper autrement : la multiplication de Karatsuba ---------------- */
console.log('');
console.log('QUAND COUPER CHANGE L’EXPOSANT : MULTIPLIER DEUX GRANDS NOMBRES');
let produits = 0;      // multiplications de chiffres élémentaires

function scolaire(a, b) {              // la méthode de l’école primaire, sur des tableaux de chiffres
  const r = new Array(a.length + b.length).fill(0);
  for (let i = a.length - 1; i >= 0; i--)
    for (let j = b.length - 1; j >= 0; j--) { produits++; r[i + j + 1] += a[i] * b[j]; }
  for (let k = r.length - 1; k > 0; k--) { r[k - 1] += Math.floor(r[k] / 10); r[k] %= 10; }
  while (r.length > 1 && r[0] === 0) r.shift();
  return r;
}

/* Karatsuba : trois produits de demi-nombres au lieu de quatre. */
function karatsuba(a, b) {
  const n = Math.max(a.length, b.length);
  if (n <= 1) { produits++; return normaliser([a[0] * b[0]]); }
  const m = n >> 1;
  const [ah, al] = couper(a, m), [bh, bl] = couper(b, m);
  const p1 = karatsuba(ah, bh);
  const p2 = karatsuba(al, bl);
  const p3 = karatsuba(ajouter(ah, al), ajouter(bh, bl));
  const milieu = soustraire(soustraire(p3, p1), p2);
  return ajouter(ajouter(decaler(p1, 2 * m), decaler(milieu, m)), p2);
}
function couper(a, m) {                // les m derniers chiffres à droite
  const bas = a.slice(Math.max(0, a.length - m));
  const haut = a.slice(0, Math.max(0, a.length - m));
  return [haut.length ? haut : [0], bas.length ? bas : [0]];
}
function decaler(a, k) { const r = a.slice(); for (let i = 0; i < k; i++) r.push(0); return normaliser(r); }
function ajouter(a, b) {
  const r = []; let ret = 0;
  for (let i = 0; i < Math.max(a.length, b.length); i++) {
    const s = (a[a.length - 1 - i] || 0) + (b[b.length - 1 - i] || 0) + ret;
    r.unshift(s % 10); ret = Math.floor(s / 10);
  }
  if (ret) r.unshift(ret);
  return normaliser(r);
}
function soustraire(a, b) {            // a ≥ b, toujours vrai ici
  const r = []; let emprunt = 0;
  for (let i = 0; i < a.length; i++) {
    let s = (a[a.length - 1 - i] || 0) - (b[b.length - 1 - i] || 0) - emprunt;
    if (s < 0) { s += 10; emprunt = 1; } else emprunt = 0;
    r.unshift(s);
  }
  return normaliser(r);
}
function normaliser(a) {
  const r = [];
  let ret = 0;
  for (let i = a.length - 1; i >= 0; i--) { const s = a[i] + ret; r.unshift(s % 10); ret = Math.floor(s / 10); }
  while (ret) { r.unshift(ret % 10); ret = Math.floor(ret / 10); }
  while (r.length > 1 && r[0] === 0) r.shift();
  return r;
}
function chiffres(n, graine) {
  const t = [], rr = alea(graine);
  t.push(1 + Math.floor(rr() * 9));
  for (let i = 1; i < n; i++) t.push(Math.floor(rr() * 10));
  return t;
}

console.log('');
console.log('  chiffres   produits, méthode scolaire   rapport   produits, Karatsuba   rapport   identiques');
console.log('  --------   --------------------------   -------   -------------------   -------   ----------');
let ps = null, pk = null, os128 = 0, ok128 = 0, os256 = 0, ok256 = 0;
[16, 32, 64, 128, 256].forEach(function (n) {
  const a = chiffres(n, 3000 + n), b = chiffres(n, 4000 + n);
  produits = 0; const rs = scolaire(a, b); const os = produits;
  produits = 0; const rk = karatsuba(a, b); const ok = produits;
  const meme = rs.join('') === rk.join('');
  console.log('  ' + String(n).padStart(8) + '   ' + String(os).padStart(26) + '   ' +
    (ps === null ? '' : (os / ps).toFixed(2)).padStart(7) + '   ' + String(ok).padStart(19) + '   ' +
    (pk === null ? '' : (ok / pk).toFixed(2)).padStart(7) + '   ' + String(meme).padStart(10));
  if (n === 128) { os128 = os; ok128 = ok; }
  if (n === 256) { os256 = os; ok256 = ok; }
  ps = os; pk = ok;
});
console.log('');
console.log('EXPOSANTS DÉDUITS DU DERNIER RAPPORT MESURÉ, sans rien supposer :');
console.log('  méthode scolaire : log₂(' + (os256 / os128).toFixed(2) + ') = ' + Math.log2(os256 / os128).toFixed(3) +
  '   théorie : 2');
console.log('  Karatsuba ...... : log₂(' + (ok256 / ok128).toFixed(2) + ') = ' + Math.log2(ok256 / ok128).toFixed(3) +
  '   théorie : log₂(3) = ' + Math.log2(3).toFixed(3));
console.log('');
console.log('D’où vient le 3 : (a·10^m + b)(c·10^m + d) demande a·c, b·d et (a+b)(c+d),');
console.log('car le terme croisé a·d + b·c s’obtient par soustraction des deux premiers.');
console.log('Trois produits au lieu de quatre, sur des nombres deux fois plus courts.');
console.log('');
console.log('Ce n’est PAS une optimisation de constante : c’est un autre exposant.');
console.log('À 1 000 chiffres, le rapport prévu vaut ' +
  (Math.pow(1000, 2) / Math.pow(1000, Math.log2(3))).toFixed(1) + ' ; à 10^6 chiffres, ' +
  (Math.pow(1e6, 2) / Math.pow(1e6, Math.log2(3))).toFixed(0) + '.');
console.log('C’est pour cela que les bibliothèques de grands entiers l’emploient.');
