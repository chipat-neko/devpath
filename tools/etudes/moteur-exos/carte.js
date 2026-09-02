/* Dresse la CARTE de js/lecon.js : sa taille, ses fonctions de premier niveau, et le
   poids de chacune. Rien n'est compté à la main — c'est ce fichier qui produit les
   chiffres publiés par l'étude de cas nº 2, à chaque assemblage.

   Méthode volontairement simple, et c'est un choix expliqué dans l'étude : on ne
   construit pas un arbre syntaxique, on repère les `function nom(` déclarées à deux
   espaces d'indentation — celles du premier niveau de la fonction anonyme qui
   enveloppe tout le fichier. Une accolade fermante à la même indentation clôt la
   fonction. Cela suffit ici parce que le fichier respecte un style constant ; cela
   ne suffirait pas sur un fichier quelconque, et l'étude le dit. */
var fs = require("fs");
var path = require("path");

var FICHIER = path.resolve(__dirname, "..", "..", "..", "js", "lecon.js");

function carte(src) {
  /* La dernière ligne d'un fichier texte est vide (il se termine par un saut de
     ligne) : on ne la compte pas, pour que le total corresponde à ce qu'affichent
     un éditeur et `wc -l`. */
  var lignes = src.replace(/\r\n/g, "\n").replace(/\n$/, "").split("\n");
  var fns = [];
  var courante = null;
  for (var i = 0; i < lignes.length; i++) {
    var l = lignes[i];
    var m = /^ {2}function ([A-Za-z_$][\w$]*)\s*\(/.exec(l);
    if (m) {
      if (courante) { courante.fin = i; fns.push(courante); }
      courante = { nom: m[1], debut: i + 1, fin: 0 };
      continue;
    }
    if (courante && /^ {2}\}\s*$/.test(l)) {
      courante.fin = i + 1;
      fns.push(courante);
      courante = null;
    }
  }
  if (courante) { courante.fin = lignes.length; fns.push(courante); }
  fns.forEach(function (f) { f.taille = f.fin - f.debut + 1; });
  return { lignes: lignes.length, fns: fns };
}

var c = carte(fs.readFileSync(FICHIER, "utf8"));
var total = c.fns.reduce(function (s, f) { return s + f.taille; }, 0);
var plusGrosses = c.fns.slice().sort(function (a, b) { return b.taille - a.taille; }).slice(0, 8);

if (require.main === module) {
  console.log("js/lecon.js : " + c.lignes + " lignes, " + c.fns.length + " fonctions de premier niveau");
  console.log("elles occupent " + total + " lignes, soit " + Math.round((total / c.lignes) * 100) + " % du fichier");
  console.log("");
  console.log("les 8 plus grosses :");
  plusGrosses.forEach(function (f) {
    console.log(
      "  " + (f.nom + " ").padEnd(22, ".") + " " + String(f.taille).padStart(4) + " lignes   (" +
      f.debut + "–" + f.fin + ")"
    );
  });
}

module.exports = { carte: carte, FICHIER: FICHIER };
