/* Dix titres <h2> lus dans les leçons de ce site, et le fragment que
   slugify() en fait. Aucun n'a été inventé pour l'occasion. */
/*@@SLUGIFY@@*/

var titres = [
  // pages/a11y/lecon-01.html
  "Pour qui ?",
  // pages/csharp/lecon-02.html
  "Conversion et casting",
  // pages/go/lecon-04.html
  "Définir et créer une structure",
  // pages/kotlin/lecon-08.html
  "Le fil rouge : CompteBancaire",
  // pages/pascal/lecon-07.html
  "Pointeurs vers des records",
  // pages/ruby/lecon-12.html
  "Antisèche",
  // pages/a11y/lecon-11.html
  "Le problème : une grille pour l'œil, pas pour l'oreille",
  // pages/algo/lecon-07.html
  "Le nœud et la tête",
  // pages/algo/lecon-20.html
  "Implémentation : nœuds indexés par caractère",
  // pages/c/lecon-14.html
  "Le nœud : une structure auto-référente",
];

titres.forEach(function (t) {
  console.log(slugify(t) + "   <- " + t);
});
