/* Quatre mots que la doc emploie pour décrire ce que le code fait — et qui
   décrivent en JavaScript autre chose que ce qu'on croit. */

/* « overload » — surcharge. En JavaScript, il n'y en a pas :
   la seconde définition écrase la première, sans un avertissement. */
function aire(cote) { return cote * cote; }
function aire(largeur, hauteur) { return largeur * hauteur; }
/* ATTENTION à l'affichage : le bac à sable de ce site sérialise ce qu'on lui
   passe en JSON, et JSON ne connaît pas NaN — il l'écrit « null ». D'où le
   String() ci-dessous : sans lui, la ligne dirait « null » là où la valeur est
   NaN. Regarde les deux formes côte à côte dans la sortie. */
console.log('aire(3) =', String(aire(3)), '— et sans String() :', aire(3));
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
