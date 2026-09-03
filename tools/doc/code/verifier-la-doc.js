/* Quatre phrases de la page de référence, transformées en contrôles.
   On ne croit pas la doc : on la met à l'épreuve. */
/*@@SLUGIFY@@*/

var LIMITE = 0x3000;              // les 12 288 premiers points de code Unicode
var alphabet = /^[a-z0-9-]*$/;    // « only the characters a-z, 0-9 and the hyphen »
var fautes = { alphabet: 0, bords: 0, idempotence: 0, imprevu: 0 };
var vides = 0, testes = 0;

for (var c = 0; c < LIMITE; c++) {
  var entree = "x" + String.fromCharCode(c) + "y";   // le caractère, encadré
  var s;
  /* On COMPTE les incidents au lieu de les avaler : un premier jet écrivait
     « continue » ici, si bien qu'une fonction absente aurait affiché quatre
     lignes de zéro — c'est-à-dire trois promesses tenues par du néant. */
  try { s = slugify(entree); } catch (e) { fautes.imprevu++; continue; }
  testes++;
  if (!alphabet.test(s)) fautes.alphabet++;
  if (/^-|-$/.test(s)) fautes.bords++;
  if (slugify(s) !== s) fautes.idempotence++;
  if (slugify(String.fromCharCode(c)) === "") vides++;
}

console.log("points de code éprouvés            : " + testes + " sur " + LIMITE);
console.log("0. incidents imprévus              : " + fautes.imprevu);
console.log("1. « only a-z, 0-9 and hyphen »    : " + fautes.alphabet + " contre-exemple(s)");
console.log("2. jamais de tiret au bord         : " + fautes.bords + " contre-exemple(s)");
console.log("3. slugify(slugify(x)) === slugify(x) : " + fautes.idempotence + " contre-exemple(s)");
console.log("4. seuls, ils donnent la chaîne vide : " + vides + " caractères sur " + testes);
console.log(testes === LIMITE
  ? "-> les " + LIMITE + " entrées ont bien été jugées."
  : "-> ATTENTION : " + (LIMITE - testes) + " entrées n ont PAS été jugées.");
