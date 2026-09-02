/* LE BANC : ou arrondit-on ?

   La version 2 de cette étude arrondit la TVA à chaque ligne, puis additionne — parce
   que la version 1 le faisait. Une réécriture « propre » aurait pu additionner d'abord
   et arrondir une seule fois à la fin. Cela paraît équivalent. Ça ne l'est pas.

   Ce banc ne juge pas : il compte. */

var TAUX_POUR_MILLE = 55;   /* 5,5 % */

function arrondiParLigne(nets, taux) {
  var total = 0;
  for (var i = 0; i < nets.length; i++) total += Math.round(nets[i] * taux / 1000);
  return total;
}

function arrondiALaFin(nets, taux) {
  var somme = 0;
  for (var i = 0; i < nets.length; i++) somme += nets[i] * taux / 1000;
  return Math.round(somme);
}

/* Un exemple qu'on peut refaire à la main --------------------------------------- */
var exemple = [1000, 1000, 1000];
console.log("Trois lignes à 10,00 EUR, TVA à 5,5 %");
console.log("  1000 x 55 / 1000 = 55 pile : il n'y a rien à arrondir.");
console.log("  par ligne ..... " + arrondiParLigne(exemple, TAUX_POUR_MILLE) + " centimes");
console.log("  à la fin ...... " + arrondiALaFin(exemple, TAUX_POUR_MILLE) + " centimes");
console.log("");

var exemple2 = [1009, 1009, 1009];
console.log("Trois lignes à 10,09 EUR, TVA à 5,5 %  (1009 x 55 / 1000 = 55,495)");
console.log("  par ligne ..... " + arrondiParLigne(exemple2, TAUX_POUR_MILLE) + " centimes");
console.log("  à la fin ...... " + arrondiALaFin(exemple2, TAUX_POUR_MILLE) + " centimes");
console.log("");

/* Combien de fois cela arrive-t-il vraiment ? ------------------------------------ */
var etat = 12345;
function suivant() { etat = (etat * 1103515245 + 12345) >>> 0; return etat / 4294967296; }
function entre(a, b) { return a + Math.floor(suivant() * (b - a + 1)); }

var COMMANDES = 10000;
var differentes = 0, ecartMax = 0, cumul = 0, pire = null;
for (var c = 0; c < COMMANDES; c++) {
  var nets = [];
  var combien = entre(1, 5);
  for (var j = 0; j < combien; j++) nets.push(entre(1, 12000));
  var a = arrondiParLigne(nets, TAUX_POUR_MILLE);
  var b = arrondiALaFin(nets, TAUX_POUR_MILLE);
  if (a !== b) {
    differentes++;
    cumul += Math.abs(a - b);
    if (Math.abs(a - b) > ecartMax) { ecartMax = Math.abs(a - b); pire = nets.slice(); }
  }
}

function point(nom, valeur) {
  var l = "  " + nom + " ";
  while (l.length < 40) l += ".";
  return l + " " + valeur;
}

console.log("Sur " + COMMANDES + " commandes tirées au hasard (graine fixe) :");
console.log(point("totaux différents", differentes));
console.log(point("soit", (differentes * 100 / COMMANDES).toFixed(1) + " % des commandes"));
console.log(point("écart maximal", ecartMax + " centime(s)"));
console.log(point("écart cumulé", cumul + " centimes"));
console.log(point("la pire commande", "[" + pire.join(", ") + "]"));
console.log("");
console.log("Aucune des deux façons n'est fausse en soi. Ce qui serait faux, c'est de");
console.log("changer de façon en croyant ne rien changer.");
