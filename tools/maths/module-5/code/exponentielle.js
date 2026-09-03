/* LA CROISSANCE EXPONENTIELLE : le seul mur que la vitesse des machines
   ne fait pas reculer. Tout ce qui suit est compté, pas estimé. */

/* --- 1. la propriété qui la définit : un élément de plus, deux fois plus --- */
function sousEnsembles(elements) {
  const res = [[]];
  elements.forEach(function (e) {
    const ajout = [];
    res.forEach(function (s) { ajout.push(s.concat([e])); });
    ajout.forEach(function (s) { res.push(s); });
  });
  return res;
}
console.log('TOUTES LES PARTIES D’UN ENSEMBLE — énumérées, puis comptées');
console.log('');
console.log('   n   parties énumérées      2^n   rapport avec n−1');
console.log('  ---   -----------------   ------   ----------------');
let prec = null;
for (let n = 0; n <= 14; n++) {
  const el = []; for (let i = 0; i < n; i++) el.push(i);
  const parties = sousEnsembles(el);
  console.log('  ' + String(n).padStart(3) + '   ' + String(parties.length).padStart(17) + '   ' +
    String(Math.pow(2, n)).padStart(6) + '   ' +
    (prec === null ? '' : (parties.length / prec).toFixed(0)).padStart(16));
  prec = parties.length;
}
console.log('');
console.log('Chaque élément ajouté DOUBLE le nombre de parties : chaque partie existante');
console.log('donne deux parties nouvelles, celle qui prend l’élément et celle qui le laisse.');
console.log('C’est la définition même de l’exponentielle : un pas de plus, un facteur constant.');

/* --- 2. le mur, chiffré ------------------------------------------------- */
const PAR_SECONDE = 1e9;
const SECONDES = { 'une seconde': 1, 'une minute': 60, 'une heure': 3600, 'un jour': 86400, 'un an': 31557600, 'un siècle': 3155760000 };
/* Recherche dichotomique du plus grand n dont le coût tient dans le budget.
   Sans elle, ce programme mettrait plusieurs secondes : chercher n un par un
   jusqu’au milliard est précisément l’erreur que cette leçon combat. */
const PLAFOND = 1e15;   // au-delà, un entier JavaScript n’est plus exact
function plusGrandN(cout, budgetSecondes) {
  const budget = budgetSecondes * PAR_SECONDE;
  let g = 1, d = PLAFOND;
  if (cout(1) > budget) return 0;
  for (let tour = 0; tour < 200 && g < d; tour++) {
    const m = Math.floor((g + d + 1) / 2);
    if (m === g) break;
    if (cout(m) <= budget) g = m; else d = m - 1;
  }
  return g;
}
function court(n) {
  if (n >= PLAFOND) return '> 1e15';       // au-delà du plafond de comptage exact
  if (n < 1e7) return String(n);
  return n.toExponential(2);
}
console.log('');
console.log('LE PLUS GRAND n TRAITABLE, à un milliard d’opérations par seconde');
console.log('');
const COUTS = [
  { nom: 'n  (linéaire)', f: (n) => n },
  { nom: 'n²  (quadratique)', f: (n) => n * n },
  { nom: 'n³  (cubique)', f: (n) => n * n * n },
  { nom: '2^n (exponentiel)', f: (n) => Math.pow(2, n) },
  { nom: 'n!  (factoriel)', f: (n) => { let r = 1; for (let i = 2; i <= n; i++) { r *= i; if (r > 1e300) return Infinity; } return r; } },
];
let entete = 'coût                 ';
Object.keys(SECONDES).forEach((k) => { entete += k.padStart(13); });
console.log(entete);
console.log('-'.repeat(entete.length));
COUTS.forEach(function (c) {
  let ligne = c.nom.padEnd(21);
  Object.keys(SECONDES).forEach((k) => { ligne += court(plusGrandN(c.f, SECONDES[k])).padStart(13); });
  console.log(ligne);
});

/* --- 3. ce qu’une machine mille fois plus rapide achète ------------------ */
console.log('');
console.log('CE QU’ACHÈTE UNE MACHINE MILLE FOIS PLUS RAPIDE (budget : une heure)');
console.log('');
console.log('coût                 n aujourd’hui   n avec ×1000       gagné   facteur');
console.log('-----------------    -------------   ------------   ---------   -------');
COUTS.forEach(function (c) {
  const a = plusGrandN(c.f, 3600);
  const b = plusGrandN(c.f, 3600 * 1000);
  const plafonne = b >= PLAFOND;
  console.log(c.nom.padEnd(21) + court(a).padStart(13) + '   ' + court(b).padStart(12) + '   ' +
    (plafonne ? '—' : court(b - a)).padStart(9) + '   ' +
    (plafonne ? '—' : (b / a).toFixed(2)).padStart(7));
});
console.log('');
console.log('(« > 1e15 » : au-delà du plus grand entier que JavaScript compte exactement.');
console.log(' La ligne linéaire y bute — le facteur y est 1000, par construction.)');
console.log('');
console.log('C’est LE point : mille fois plus de puissance multiplie par 1000 la taille');
console.log('traitable en linéaire, par ' + Math.pow(1000, 1 / 3).toFixed(1) + ' en cubique… et en ajoute ' +
  Math.round(Math.log2(1000)) + ' en exponentiel.');
console.log('Dix éléments de plus. Pas dix pour cent : dix éléments.');
console.log('Un algorithme exponentiel ne se répare pas en achetant du matériel.');

/* --- 4. le cas concret : forcer un mot de passe -------------------------- */
console.log('');
console.log('COMBINAISONS D’UN MOT DE PASSE, à un milliard d’essais par seconde');
console.log('');
function duree(essais) {
  const s = essais / PAR_SECONDE;
  if (s < 1) return (s * 1e3).toPrecision(3) + ' ms';
  if (s < 60) return s.toPrecision(3) + ' s';
  if (s < 3600) return (s / 60).toPrecision(3) + ' min';
  if (s < 86400) return (s / 3600).toPrecision(3) + ' h';
  if (s < 31557600) return (s / 86400).toPrecision(3) + ' j';
  const a = s / 31557600;
  return a < 1e9 ? a.toPrecision(3) + ' ans' : a.toExponential(2) + ' ans';
}
console.log('  alphabet   longueur      combinaisons   tout essayer   la moitié (cas moyen)');
console.log('  --------   --------   ---------------   ------------   ---------------------');
[[26, 8], [26, 10], [62, 8], [62, 10], [62, 12], [95, 12], [95, 16]].forEach(function (p) {
  const [a, l] = p;
  const n = Math.pow(a, l);
  console.log('  ' + String(a).padStart(8) + '   ' + String(l).padStart(8) + '   ' +
    n.toExponential(3).padStart(15) + '   ' + duree(n).padStart(12) + '   ' + duree(n / 2).padStart(21));
});
console.log('');
console.log('Ajouter UN caractère à un mot de passe de 62 symboles multiplie le travail');
console.log('par 62. Ajouter deux caractères le multiplie par ' + (62 * 62) + '. La longueur');
console.log('compte donc plus que la « complexité » : passer de 26 à 95 symboles sur');
console.log('8 caractères multiplie par ' + (Math.pow(95, 8) / Math.pow(26, 8)).toExponential(2) +
  ', passer de 8 à 12 caractères sur 26 multiplie par ' + (Math.pow(26, 12) / Math.pow(26, 8)).toExponential(2) + '.');
