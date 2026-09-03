/* OÙ LE LOGARITHME ET L’EXPONENTIELLE SE CACHENT DANS DU CODE ORDINAIRE.
   Trois endroits où l’on s’en sert sans le savoir. */

/* --- 1. un logarithme mesure une TAILLE ---------------------------------- */
console.log('1. COMBIEN DE CHIFFRES, COMBIEN DE BITS');
console.log('');
console.log('             n   chiffres   ⌊log₁₀n⌋+1   bits   ⌊log₂n⌋+1');
console.log('  ------------   --------   ----------   ----   ---------');
[7, 42, 255, 1000, 65535, 1000000, 2147483647].forEach(function (n) {
  const chiffres = String(n).length;
  const bits = n.toString(2).length;
  console.log('  ' + String(n).padStart(12) + '   ' + String(chiffres).padStart(8) + '   ' +
    String(Math.floor(Math.log10(n)) + 1).padStart(10) + '   ' + String(bits).padStart(4) + '   ' +
    String(Math.floor(Math.log2(n)) + 1).padStart(9));
});
console.log('');
console.log('Écrire un nombre coûte log(n) caractères, pas n. C’est pourquoi additionner');
console.log('deux nombres de n chiffres est en O(n) — linéaire en la TAILLE de l’écriture,');
console.log('donc logarithmique en la VALEUR. Confondre les deux est l’erreur classique :');
console.log('un algorithme « en O(n) » sur un entier n vaut O(2^bits), donc exponentiel.');
console.log('');
console.log('Exemple : tester si n est premier en essayant tous les diviseurs jusqu’à √n.');
[1000003, 1000000007].forEach(function (n) {
  const bits = n.toString(2).length;
  console.log('  n = ' + String(n).padStart(10) + '   ' + bits + ' bits   √n ≈ ' +
    Math.round(Math.sqrt(n)) + ' divisions, soit 2^' + Math.log2(Math.sqrt(n)).toFixed(2) +
    ' — la moitié des bits en exposant.');
});

/* --- 2. l’entropie : un logarithme qui compte des essais ------------------ */
console.log('');
console.log('2. « 60 BITS D’ENTROPIE » : LE LOGARITHME D’UN NOMBRE D’ESSAIS');
console.log('');
console.log('  description                        possibilités    bits   essais moyens');
console.log('  --------------------------------   ------------   -----   -------------');
[['un dé à 6 faces', 6], ['une lettre minuscule', 26], ['un caractère imprimable', 95],
 ['un code PIN à 4 chiffres', 10000], ['4 mots parmi 7776 (méthode dés)', Math.pow(7776, 4)],
 ['une clé de 128 bits', Math.pow(2, 128)]].forEach(function (p) {
  const [nom, n] = p;
  console.log('  ' + nom.padEnd(32) + '   ' + (n < 1e6 ? String(n) : n.toExponential(2)).padStart(12) + '   ' +
    Math.log2(n).toFixed(1).padStart(5) + '   ' + (n / 2 < 1e6 ? String(n / 2) : (n / 2).toExponential(2)).padStart(13));
});
console.log('');
console.log('« Bits d’entropie » = log₂(nombre de possibilités). Un bit de plus DOUBLE');
console.log('le travail de l’attaquant : c’est la même exponentielle, lue à l’envers.');
console.log('Quatre mots tirés dans une liste de 7776 valent ' +
  Math.log2(Math.pow(7776, 4)).toFixed(2) + ' bits, contre ' + (8 * Math.log2(95)).toFixed(2) +
  ' bits pour');
console.log('un mot de passe de 8 caractères imprimables : ' +
  (Math.pow(2, 8 * Math.log2(95)) / Math.pow(7776, 4)).toFixed(2) + ' fois moins de possibilités,');
console.log('soit un écart de ' + (8 * Math.log2(95) - Math.log2(Math.pow(7776, 4))).toFixed(2) +
  ' bit. À peu près à égalité, donc — et infiniment plus facile à retenir.');

/* --- 3. l’attente exponentielle : doubler pour ne pas s’acharner ---------- */
console.log('');
console.log('3. LE RÉESSAI À ATTENTE DOUBLÉE (exponential backoff)');
console.log('');
function planning(base, tentatives, plafond) {
  const attentes = [];
  for (let i = 0; i < tentatives; i++) attentes.push(Math.min(base * Math.pow(2, i), plafond));
  return attentes;
}
console.log('  tentative   sans plafond (ms)   plafonné à 30 s (ms)');
console.log('  ---------   -----------------   --------------------');
const sans = planning(100, 14, Infinity), avec = planning(100, 14, 30000);
for (let i = 0; i < sans.length; i++) {
  console.log('  ' + String(i + 1).padStart(9) + '   ' + String(sans[i]).padStart(17) + '   ' +
    String(avec[i]).padStart(20));
}
const totalSans = sans.reduce((a, b) => a + b, 0), totalAvec = avec.reduce((a, b) => a + b, 0);
console.log('');
console.log('  attente totale sans plafond : ' + totalSans + ' ms, soit ' +
  (totalSans / 60000).toFixed(1) + ' min — dont ' + (sans[13] / 60000).toFixed(1) +
  ' min de simple attente avant la 14ᵉ tentative.');
console.log('  attente totale plafonnée ... : ' + totalAvec + ' ms, soit ' +
  (totalAvec / 60000).toFixed(1) + ' min.');
console.log('');
console.log('  Le doublement sert à une chose : le nombre de tentatives couvrant une durée D');
console.log('  est LOGARITHMIQUE en D. Couvrir une heure demande ' +
  (function () { let i = 0, t = 0; while (t < 3600000) { t += 100 * Math.pow(2, i); i++; } return i; })() +
  ' tentatives, pas 36 000.');
console.log('  Sans plafond, l’attente devient absurde ; sans doublement, on martèle le service.');

/* --- 4. et le bruit ajouté, qui n’est pas une coquetterie ---------------- */
function alea(graine) {
  let e = graine >>> 0;
  return function () { e ^= e << 13; e >>>= 0; e ^= e >>> 17; e ^= e << 5; e >>>= 0; return e / 4294967296; };
}
console.log('');
console.log('  POURQUOI ON Y AJOUTE DU HASARD : 1 000 clients coupés au même instant');
const CLIENTS = 1000;
function repartition(avecBruit) {
  const r = alea(20260916), creneaux = {};
  for (let c = 0; c < CLIENTS; c++) {
    let attente = 100 * Math.pow(2, 3);          // tous à la 4ᵉ tentative
    if (avecBruit) attente = Math.floor(r() * attente);
    const creneau = Math.floor(attente / 100);
    creneaux[creneau] = (creneaux[creneau] || 0) + 1;
  }
  const pics = Object.keys(creneaux).map((k) => creneaux[k]);
  return { creneaux: Object.keys(creneaux).length, pic: Math.max.apply(null, pics) };
}
const sansBruit = repartition(false), avecBruit = repartition(true);
console.log('    sans hasard : ' + sansBruit.creneaux + ' créneau de 100 ms occupé, pic = ' +
  sansBruit.pic + ' requêtes simultanées');
console.log('    avec hasard : ' + avecBruit.creneaux + ' créneaux occupés, pic = ' +
  avecBruit.pic + ' requêtes — soit ' + (sansBruit.pic / avecBruit.pic).toFixed(1) + ' fois moins');
console.log('    Le doublement espace les tentatives ; le hasard les DÉCORRÈLE. Les deux');
console.log('    sont nécessaires : sinon les clients reviennent tous ensemble, indéfiniment.');
