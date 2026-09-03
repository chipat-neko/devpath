/* Deux façons de dire « c'est lent » : le chronomètre, et le compteur.
   Une seule des deux donne un nombre qu'on peut publier. */

/* Générateur pseudo-aléatoire déterministe (xorshift32) : même graine,
   même tableau, sur toutes les machines. */
function alea(graine) {
  let e = graine >>> 0;
  return function () {
    e ^= e << 13; e >>>= 0;
    e ^= e >>> 17;
    e ^= e << 5;  e >>>= 0;
    return e / 4294967296;
  };
}

const N = 16000;
const tirage = alea(20260903);
const donnees = [];
for (let i = 0; i < N; i++) donnees.push(Math.floor(tirage() * 1000000));

/* --- les deux tris, instrumentés : ops compte les comparaisons ET les
       déplacements de valeur, c'est-à-dire le travail réellement fait. --- */
let ops = 0;

function triInsertion(t) {
  const a = t.slice();
  for (let i = 1; i < a.length; i++) {
    const x = a[i];
    let j = i - 1;
    while (j >= 0 && (ops++, a[j] > x)) { a[j + 1] = a[j]; ops++; j--; }
    a[j + 1] = x; ops++;
  }
  return a;
}

function triFusion(t) {
  if (t.length < 2) return t.slice();
  const m = t.length >> 1;
  const g = triFusion(t.slice(0, m));
  const d = triFusion(t.slice(m));
  const r = [];
  let i = 0, j = 0;
  while (i < g.length && j < d.length) { ops += 2; r.push(g[i] <= d[j] ? g[i++] : d[j++]); }
  while (i < g.length) { ops++; r.push(g[i++]); }
  while (j < d.length) { ops++; r.push(d[j++]); }
  return r;
}

/* --- 1. le chronomètre --------------------------------------------------- */
let t0 = Date.now();
const rIns = triInsertion(donnees);
const msIns = Date.now() - t0;

t0 = Date.now();
const rFus = triFusion(donnees);
const msFus = Date.now() - t0;

console.log('n = ' + N + ' entiers tirés au sort avec la graine 20260903');
console.log('les deux tris rendent le MÊME tableau : ' + (rIns.join(',') === rFus.join(',')));
console.log('');
console.log('-- ce que dit le chronomètre --');
console.log('tri par insertion plus lent que tri fusion : ' + (msIns > msFus));
console.log('durée exacte, en millisecondes, publiable ... : false');
console.log('  (elle dépend de la machine, de la charge et du navigateur ;');
console.log('   relance ce programme trois fois, tu liras trois nombres,');
console.log('   et le rapport entre les deux durées bougera aussi)');

/* --- 2. le compteur ------------------------------------------------------ */
ops = 0; triInsertion(donnees); const opsIns = ops;
ops = 0; triFusion(donnees);    const opsFus = ops;

console.log('');
console.log('-- ce que dit le compteur --');
console.log('opérations, tri par insertion : ' + opsIns);
console.log('opérations, tri fusion ....... : ' + opsFus);
console.log('rapport ...................... : ' + (opsIns / opsFus).toFixed(1) + ' fois plus');
console.log('ce rapport est le MÊME sur toute machine : ' + true);
