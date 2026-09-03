/* Exercice 2 (leçon 9) — répartir 100,00 € entre trois personnes, sans perdre un centime.
   Le piège classique : 100 / 3 = 33,33 et 3 x 33,33 = 99,99. */

// La méthode fautive : arrondir chaque part.
const totalC = 10000;                            // centimes
const naif = [];
for (let i = 0; i < 3; i++) naif.push(Math.round(totalC / 3));
console.log('parts arrondies : ' + naif.map((c) => (c / 100).toFixed(2)).join(' + ') +
  ' = ' + (naif.reduce((a, b) => a + b, 0) / 100).toFixed(2));
console.log('manquant : ' + (totalC - naif.reduce((a, b) => a + b, 0)) + ' centime(s)');

// La méthode juste : distribuer le reste, un centime à la fois.
function repartir(centimes, parts) {
  const base = Math.floor(centimes / parts);
  const reste = centimes - base * parts;
  const r = new Array(parts).fill(base);
  for (let i = 0; i < reste; i++) r[i]++;         // les premiers reçoivent le centime en plus
  return r;
}
const juste = repartir(totalC, 3);
console.log('');
console.log('parts reparties : ' + juste.map((c) => (c / 100).toFixed(2)).join(' + ') +
  ' = ' + (juste.reduce((a, b) => a + b, 0) / 100).toFixed(2));
console.log('somme exacte ? ' + (juste.reduce((a, b) => a + b, 0) === totalC));

// Le contrôle qui compte : toutes les répartitions de 1 à 5000 centimes en 2 à 7 parts.
let cas = 0, faux = 0, ecartMax = 0;
for (let c = 1; c <= 5000; c++) {
  for (let n = 2; n <= 7; n++) {
    cas++;
    const r = repartir(c, n);
    const somme = r.reduce((a, b) => a + b, 0);
    if (somme !== c) faux++;
    ecartMax = Math.max(ecartMax, Math.max.apply(null, r) - Math.min.apply(null, r));
  }
}
console.log('');
console.log('repartitions essayees : ' + cas);
console.log('  dont fausses (somme != total) : ' + faux);
console.log('  ecart maximal entre deux parts : ' + ecartMax + ' centime');

// Et la même chose faite en euros arrondis à deux décimales. ATTENTION à ce que
// cette mesure prouve : l'échec vient-il du FLOTTANT, ou du simple fait qu'arrondir
// chaque part détruit le total ? On sépare les deux, au lieu de conclure trop vite.
let fauxFlottant = 0, fauxDecimalExact = 0, nonDivisible = 0, memesCas = 0;
for (let c = 1; c <= 5000; c++) {
  for (let n = 2; n <= 7; n++) {
    const euros = c / 100;
    const part = Number((euros / n).toFixed(2));
    const echecF = Number((part * n).toFixed(2)) !== Number(euros.toFixed(2));
    const echecD = Math.round(c / n) * n !== c;   // la même méthode, en centimes ENTIERS
    const nd = c % n !== 0;
    if (echecF) fauxFlottant++;
    if (echecD) fauxDecimalExact++;
    if (nd) nonDivisible++;
    if (echecF === echecD && echecF === nd) memesCas++;
  }
}
console.log('');
console.log('les memes ' + cas + ' repartitions, faites en arrondissant CHAQUE part :');
console.log('  en euros flottants, n x part ne redonne pas le total : ' + fauxFlottant +
  '  (' + (100 * fauxFlottant / cas).toFixed(1) + ' %)');
console.log('  la MEME methode en centimes entiers, donc sans flottant : ' + fauxDecimalExact);
console.log('  cas ou le total n est tout simplement pas divisible par n : ' + nonDivisible);
console.log('  cas ou les trois colonnes coincident : ' + memesCas + ' / ' + cas);
console.log('=> l echec n a RIEN d un probleme de flottants : arrondir chaque part detruit le');
console.log('   total des que celui-ci n est pas divisible, en flottants comme en decimal exact.');
console.log('   La parade n est pas de « mieux arrondir » : c est de DISTRIBUER le reste.');
