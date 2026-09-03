/* Les huit familles de croissance, et ce qu'elles coûtent vraiment.
   Aucun chiffre n'est récité : les petits sont calculés en entiers EXACTS
   (BigInt), les autres par leur logarithme décimal. */

const TAILLES = [10, 100, 1000, 1000000];
const PAR_SECONDE = 1e9;   // une machine qui ferait un milliard d'opérations par seconde

function log2Plafond(n) { let k = 0, v = 1; while (v < n) { v *= 2; k++; } return k; }   // nombre de divisions par 2
function factorielle(n) { let r = 1n; for (let i = 2n; i <= BigInt(n); i++) r *= i; return r; }
function log10Factorielle(n) { let s = 0; for (let i = 2; i <= n; i++) s += Math.log10(i); return s; }

/* exact : un BigInt, ou null quand le nombre est trop grand pour être écrit.
   lg    : le logarithme décimal, toujours disponible. */
const FAMILLES = [
  { nom: 'O(1)  constant',    exact: () => 1n,
    lg: () => 0 },
  { nom: 'O(log n)',          exact: (n) => BigInt(log2Plafond(n)),
    lg: (n) => Math.log10(log2Plafond(n)) },
  { nom: 'O(n)  linéaire',    exact: (n) => BigInt(n),
    lg: (n) => Math.log10(n) },
  { nom: 'O(n log n)',        exact: (n) => BigInt(n) * BigInt(log2Plafond(n)),
    lg: (n) => Math.log10(n) + Math.log10(log2Plafond(n)) },
  { nom: 'O(n²) quadratique', exact: (n) => BigInt(n) ** 2n,
    lg: (n) => 2 * Math.log10(n) },
  { nom: 'O(n³) cubique',     exact: (n) => BigInt(n) ** 3n,
    lg: (n) => 3 * Math.log10(n) },
  { nom: 'O(2^n)',            exact: (n) => (n <= 1000 ? 2n ** BigInt(n) : null),
    lg: (n) => n * Math.log10(2) },
  { nom: 'O(n!) factoriel',   exact: (n) => (n <= 1000 ? factorielle(n) : null),
    lg: (n) => log10Factorielle(n) },
];

/* 1234567 -> « 1 234 567 ». Écrit à la main : toLocaleString ne rend pas la
   même espace selon le moteur, et cette page doit s afficher pareil partout. */
function grouper(s) {
  let r = '';
  for (let i = 0; i < s.length; i++) { if (i > 0 && (s.length - i) % 3 === 0) r += ' '; r += s[i]; }
  return r;
}
function ecrireOps(f, n) {
  const e = f.exact(n);
  if (e !== null) { const s = e.toString(); if (s.length <= 13) return grouper(s); }
  const lg = f.lg(n);
  return '~10^' + Math.round(lg);
}

const AGE_UNIVERS_S = 4.35e17;   // 13,8 milliards d'années, en secondes
function ecrireDuree(lgS) {
  const s = Math.pow(10, lgS);
  if (lgS < -9)   return '< 1 ns';
  if (s < 1e-6)   return (s * 1e9).toPrecision(3) + ' ns';
  if (s < 1e-3)   return (s * 1e6).toPrecision(3) + ' µs';
  if (s < 1)      return (s * 1e3).toPrecision(3) + ' ms';
  if (s < 60)     return s.toPrecision(3) + ' s';
  if (s < 3600)   return (s / 60).toPrecision(3) + ' min';
  if (s < 86400)  return (s / 3600).toPrecision(3) + ' h';
  if (s < 86400 * 365.25) return (s / 86400).toPrecision(3) + ' j';
  const annees = s / (86400 * 365.25);
  if (annees < 1e9) return annees.toPrecision(3) + ' ans';
  const univers = lgS - Math.log10(AGE_UNIVERS_S);
  if (univers < 4) return grouper(String(Math.round(Math.pow(10, univers)))) + ' univers';
  return '10^' + Math.round(univers) + ' univers';
}

function table(titre, cellule) {
  const lignes = FAMILLES.map((f) => [f.nom].concat(TAILLES.map((n) => cellule(f, n))));
  const entete = ['famille'].concat(TAILLES.map((n) => 'n = ' + (n === 1000000 ? '10^6' : n)));
  const largeurs = entete.map((h, c) => Math.max(h.length, ...lignes.map((l) => l[c].length)));
  console.log(titre);
  console.log(entete.map((h, c) => (c === 0 ? h.padEnd(largeurs[c]) : h.padStart(largeurs[c]))).join('  '));
  console.log(largeurs.map((w) => '-'.repeat(w)).join('  '));
  lignes.forEach((l) => console.log(l.map((v, c) => (c === 0 ? v.padEnd(largeurs[c]) : v.padStart(largeurs[c]))).join('  ')));
}

table('OPÉRATIONS À EFFECTUER', ecrireOps);
console.log('');
table('DURÉE, sur une machine à un milliard d’opérations par seconde', (f, n) => ecrireDuree(f.lg(n) - 9));
console.log('');
console.log('« ~10^k » : le nombre a k+1 chiffres, il ne peut pas être écrit ici.');
console.log('Âge de l’univers retenu : 13,8 milliards d’années, soit ' + AGE_UNIVERS_S.toExponential(2) + ' s.');
