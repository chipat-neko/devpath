/* Un modulo qui travaille pour vous : la clé de contrôle.
   On ne se demande pas si elle « marche » : on essaie TOUTES les fautes de frappe,
   sur 500 numéros tirés à graine fixe — pour que ce relevé soit reproductible. */

// --- Luhn : la clé des numéros de carte bancaire (norme ISO/IEC 7812).
function luhnSomme(num) {
  let somme = 0, double = false;
  for (let i = num.length - 1; i >= 0; i--) {
    let c = num.charCodeAt(i) - 48;
    if (double) { c *= 2; if (c > 9) c -= 9; }
    somme += c;
    double = !double;
  }
  return somme;
}
const luhnValide = (num) => luhnSomme(num) % 10 === 0;
function luhnCle(corps) {                        // le chiffre qui fait tomber la somme sur 0
  for (let d = 0; d <= 9; d++) if (luhnValide(corps + d)) return String(d);
  return '?';
}

// --- ISBN-13 : même idée, poids alternés 1 et 3, modulo 10.
function isbnCle(douze) {
  let s = 0;
  for (let i = 0; i < 12; i++) s += (douze.charCodeAt(i) - 48) * (i % 2 === 0 ? 1 : 3);
  return String((10 - (s % 10)) % 10);
}
const isbnValide = (treize) => isbnCle(treize.slice(0, 12)) === treize[12];

// Un exemple complet, pour voir la mécanique.
const exemple = '453201511283003';
console.log('corps de 15 chiffres : ' + exemple);
console.log('somme de Luhn        : ' + luhnSomme(exemple + '0') + '  -> il manque ' + ((10 - luhnSomme(exemple + '0') % 10) % 10) + ' pour tomber sur un multiple de 10');
console.log('numero complet       : ' + exemple + luhnCle(exemple) + '   valide ? ' + luhnValide(exemple + luhnCle(exemple)));

// --- Le banc d'essai : toutes les fautes, sur 500 numéros à graine fixe.
let graine = 20260903;                              // graine fixe : ce relevé est reproductible
const tirage = () => ((graine = (Math.imul(graine, 1664525) + 1013904223) >>> 0) >>> 16) % 10;

// TROIS familles de fautes, chacune essayée EXHAUSTIVEMENT sur chaque numéro :
// substitution d'un chiffre, échange de deux chiffres VOISINS, échange à SAUT (a X b -> b X a).
function banc(nom, taille, cle, valide) {
  let un = 0, unVus = 0, tr = 0, trVus = 0, sa = 0, saVus = 0;
  const paires = {};
  for (let k = 0; k < 500; k++) {
    let corps = '';
    for (let i = 0; i < taille; i++) corps += tirage();
    const num = corps + cle(corps);
    for (let i = 0; i < num.length; i++) {
      for (let d = 0; d <= 9; d++) {             // faute sur un seul chiffre
        if (String(d) === num[i]) continue;
        un++;
        if (!valide(num.slice(0, i) + d + num.slice(i + 1))) unVus++;
      }
    }
    for (let i = 0; i + 1 < num.length; i++) {   // deux chiffres voisins échangés
      if (num[i] === num[i + 1]) continue;
      tr++;
      if (!valide(num.slice(0, i) + num[i + 1] + num[i] + num.slice(i + 2))) trVus++;
      else {
        const p = [num[i], num[i + 1]].sort().join('');
        paires[p] = (paires[p] || 0) + 1;
      }
    }
    for (let i = 0; i + 2 < num.length; i++) {   // deux chiffres échangés PAR-DESSUS un troisième
      if (num[i] === num[i + 2]) continue;
      sa++;
      if (!valide(num.slice(0, i) + num[i + 2] + num[i + 1] + num[i] + num.slice(i + 3))) saVus++;
    }
  }
  console.log('');
  console.log(nom);
  console.log('  fautes d\'un chiffre     : ' + un + ' essayees, ' + unVus + ' detectees  (' + (100 * unVus / un).toFixed(2) + ' %)');
  console.log('  echanges de VOISINS     : ' + tr + ' essayees, ' + trVus + ' detectees  (' + (100 * trVus / tr).toFixed(2) + ' %)');
  console.log('  echanges A SAUT         : ' + sa + ' essayees, ' + saVus + ' detectees  (' + (100 * saVus / sa).toFixed(2) + ' %)');
  const liste = Object.keys(paires).sort();
  console.log('  paires de voisins jamais vues : ' + (liste.length ? liste.join(' ') : 'aucune'));
  // La valeur THEORIQUE, qui ne depend pas de l echantillon : il y a 90 paires de
  // chiffres distincts, et chaque paire manquee en retire une.
  // Il y a 10 x 9 = 90 echanges possibles de deux chiffres DISTINCTS (l ordre compte).
  // Chaque paire non ordonnee manquee en retire donc DEUX.
  console.log('  taux theorique sur les voisins : ' + (100 * (90 - 2 * liste.length) / 90).toFixed(2) + ' % (' + (2 * liste.length) + ' echanges sur 90 passent)');
}

banc('Luhn, 16 chiffres', 15, luhnCle, luhnValide);
banc('ISBN-13', 12, isbnCle, isbnValide);
