/* « O(n²) SUR UN MILLION DE LIGNES » : le titre de ce module, chiffré.
   Une seule tâche — trouver les doublons —, trois écritures, et ce que
   chacune coûte quand le fichier grossit. */

function alea(graine) {
  let e = graine >>> 0;
  return function () { e ^= e << 13; e >>>= 0; e ^= e >>> 17; e ^= e << 5; e >>>= 0; return e / 4294967296; };
}
function jeu(n, graine) {
  const t = [], r = alea(graine);
  for (let i = 0; i < n; i++) t.push(Math.floor(r() * n * 3));   // ~15 % de doublons
  return t;
}

let ops = 0;

function doublonsNaif(t) {           // deux boucles imbriquées
  const vus = [];
  for (let i = 0; i < t.length; i++)
    for (let j = i + 1; j < t.length; j++) { ops++; if (t[i] === t[j]) { vus.push(t[i]); break; } }
  return new Set(vus).size;
}
/* Le tri est ÉCRIT ICI, et non délégué à Array.prototype.sort : le nombre de
   comparaisons de la fonction de tri du langage dépend du MOTEUR, et Node et
   Chrome n’en font pas le même nombre. Compter le moteur au lieu de compter
   l’algorithme rendrait cette table non reproductible. */
function triFusion(t) {
  if (t.length < 2) return t.slice();
  const m = t.length >> 1;
  const g = triFusion(t.slice(0, m)), d = triFusion(t.slice(m)), r = [];
  let i = 0, j = 0;
  while (i < g.length && j < d.length) { ops++; r.push(g[i] <= d[j] ? g[i++] : d[j++]); }
  while (i < g.length) { ops++; r.push(g[i++]); }
  while (j < d.length) { ops++; r.push(d[j++]); }
  return r;
}
function doublonsTri(t) {            // trier, puis un seul passage
  const a = triFusion(t);
  const vus = new Set();
  for (let i = 1; i < a.length; i++) { ops++; if (a[i] === a[i - 1]) vus.add(a[i]); }
  return vus.size;
}
function doublonsSet(t) {            // une table de hachage, un seul passage
  const vus = new Set(), doubles = new Set();
  for (let i = 0; i < t.length; i++) { ops++; if (vus.has(t[i])) doubles.add(t[i]); else vus.add(t[i]); }
  return doubles.size;
}

console.log('TROIS FAÇONS DE TROUVER LES DOUBLONS — opérations comptées');
console.log('');
console.log('       n   deux boucles      tri+passage   table de hachage   même réponse');
console.log('  ------  -------------   --------------   ----------------   ------------');
const MESURES = [];
[500, 1000, 2000, 4000, 8000].forEach(function (n) {
  const t = jeu(n, 20260903 + n);
  ops = 0; const r1 = doublonsNaif(t); const o1 = ops;
  ops = 0; const r2 = doublonsTri(t);  const o2 = ops;
  ops = 0; const r3 = doublonsSet(t);  const o3 = ops;
  MESURES.push({ n: n, naif: o1, tri: o2, set: o3 });
  console.log('  ' + String(n).padStart(6) + '  ' + String(o1).padStart(13) + '   ' +
    String(o2).padStart(14) + '   ' + String(o3).padStart(16) + '   ' +
    String(r1 === r2 && r2 === r3).padStart(12));
});

/* Avant d’extrapoler, on vérifie que le modèle décrit bien la mesure. */
console.log('');
console.log('LE MODÈLE, CONFRONTÉ À LA MESURE (rapport mesuré / modèle)');
console.log('       n   n(n−1)/2   mesuré/modèle   n·log₂n + (n−1)   mesuré/modèle');
console.log('  ------  ---------   -------------   ---------------   -------------');
MESURES.forEach(function (m) {
  const borne = m.n * (m.n - 1) / 2;
  const modeleTri = m.n * Math.log2(m.n) + (m.n - 1);
  console.log('  ' + String(m.n).padStart(6) + '  ' + String(borne).padStart(9) + '   ' +
    (m.naif / borne).toFixed(3).padStart(13) + '   ' + Math.round(modeleTri).toString().padStart(15) + '   ' +
    (m.tri / modeleTri).toFixed(4).padStart(13));
});
console.log('');
console.log('Les deux boucles restent SOUS leur borne : le « break » les fait sortir dès');
console.log('qu’un doublon est trouvé, et le jeu en contient. L’extrapolation ci-dessous');
console.log('emploie la borne, qui est le PIRE cas — celui d’un fichier sans aucun doublon.');
console.log('');
console.log('Le modèle du tri, lui, colle à 0,1 % près sur toute la plage — parce qu’il');
console.log('nomme les deux termes : n·log₂n pour les fusions, n−1 pour le passage final.');

/* --- l’extrapolation, faite avec la FORMULE EXACTE, pas avec une règle de trois --- */
console.log('');
console.log('MÊME TÂCHE, MÊME MACHINE : UN MILLION DE LIGNES');
console.log('');
const M = 1000000;
const PAR_SECONDE = 1e9;
function duree(ops) {
  const s = ops / PAR_SECONDE;
  if (s < 1e-3) return (s * 1e6).toFixed(1) + ' µs';
  if (s < 1) return (s * 1e3).toFixed(1) + ' ms';
  if (s < 60) return s.toFixed(1) + ' s';
  if (s < 3600) return (s / 60).toFixed(1) + ' min';
  return (s / 3600).toFixed(1) + ' h';
}
/* La borne haute des deux boucles est exactement n(n−1)/2 : ce n’est pas une
   estimation, c’est le nombre de couples (i, j) avec i < j. */
const opsNaif = M * (M - 1) / 2;
/* Le modèle du tri est n·log₂n + (n−1), et non n·log₂n seul : le passage final
   qui compare les voisins coûte n−1 de plus. Le tableau ci-dessus montre qu’il
   colle à 0,1 % près ; c’est lui qu’on extrapole. */
const opsTri  = M * Math.log2(M) + (M - 1);
const opsSet  = M;
console.log('  deux boucles ..... : ' + opsNaif.toExponential(2) + ' opérations   →   ' + duree(opsNaif));
console.log('  tri + passage .... : ' + opsTri.toExponential(2) + ' opérations   →   ' + duree(opsTri));
console.log('  table de hachage . : ' + opsSet.toExponential(2) + ' opérations   →   ' + duree(opsSet));
console.log('');
console.log('  rapport entre la première et la dernière : ' + (opsNaif / opsSet).toExponential(1) + ' fois');
console.log('  (à un milliard d’opérations par seconde, ce qui est optimiste)');

/* --- et la conclusion inverse, qui compte tout autant -------------------- */
console.log('');
console.log('LA MÊME COMPARAISON, MAIS SUR 200 LIGNES');
const petit = 200;
const oNaifPetit = petit * (petit - 1) / 2, oSetPetit = petit;
console.log('  deux boucles ..... : ' + oNaifPetit + ' opérations   →   ' + duree(oNaifPetit));
console.log('  table de hachage . : ' + oSetPetit + ' opérations   →   ' + duree(oSetPetit));
console.log('  écart absolu ..... : ' + duree(oNaifPetit - oSetPetit) + ' — invisible.');
console.log('');
console.log('La CLASSE est la même dans les deux cas : les deux boucles sont quadratiques');
console.log('à 200 lignes comme à un million. Ce qui change, c’est ce qu’elle coûte —');
console.log('le rapport passe de ' + (oNaifPetit / oSetPetit).toFixed(1) + ' à ' +
  (opsNaif / opsSet).toExponential(1) + ', et l’écart absolu de ' + duree(oNaifPetit - oSetPetit) +
  ' à ' + duree(opsNaif - opsSet) + '.');
console.log('Réécrire les deux boucles quand n vaut 200 est une perte de temps ;');
console.log('ne pas les réécrire quand n vaut un million est une panne.');
console.log('');
console.log('LE SEUIL, RÉSOLU (et non mesuré : c’est n(n−1)/2 > 10^9, résolu par balayage) :');
console.log('au-delà de quelle taille les deux boucles dépassent-elles une seconde,');
console.log('sur une machine hypothétique à un milliard d’opérations par seconde ?');
let seuil = 2;
while (seuil * (seuil - 1) / 2 < PAR_SECONDE) seuil++;
console.log('  n = ' + seuil + ' lignes. En dessous, personne ne s’en aperçoit.');
console.log('  Et pour dépasser une MINUTE : n = ' + (function () {
  let n = 2; while (n * (n - 1) / 2 < 60 * PAR_SECONDE) n++; return n;
})() + ' lignes.');
