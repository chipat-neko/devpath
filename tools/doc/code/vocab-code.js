/* Quatre mots que la doc emploie pour décrire ce que le code fait — et qui
   décrivent en JavaScript autre chose que ce qu'on croit. */

/* « overload » — surcharge. En JavaScript, il n'y en a pas :
   la seconde définition écrase la première, sans un avertissement. */
function aire(cote) { return cote * cote; }
function aire(largeur, hauteur) { return largeur * hauteur; }
console.log('aire(3) =', aire(3));            // et non 9
console.log('aire(3, 4) =', aire(3, 4));

/* « mutable » — const parle du LIEN, jamais du contenu. */
const panier = [];
panier.push('pain');
panier.push('sel');
console.log('panier =', panier);
try {
  eval('panier = []');
} catch (e) {
  console.log('réaffecter panier lève', e.name + ': ' + e.message);
}

/* « shadowing » — masquage. L'intérieur gagne, l'extérieur est intact. */
const echelle = 'externe';
function mesurer() {
  const echelle = 'interne';
  return echelle;
}
console.log('dans la fonction :', mesurer(), '| dehors :', echelle);

/* « hoisting » — remontée. var existe avant sa ligne ; let, non. */
function avecVar() { const vu = typeof compteur; var compteur = 1; return vu; }
function avecLet() {
  try { return typeof jauge; } catch (e) { return e.name; }
  // eslint-disable-next-line no-unreachable
  let jauge = 1;
}
console.log('avant sa ligne, var vaut', avecVar(), '— let lève', avecLet());
