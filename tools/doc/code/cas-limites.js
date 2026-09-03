/* Les entrées que la doc ne montre jamais : celles qui font mal. */
/*@@SLUGIFY@@*/

var cas = [
  "Les tableaux",
  "C++ ou C# ?",
  "Le cœur du problème",
  "Straße",
  "Łódź",
  "Øst",
  "ﬂeur",
  "Ⅻ siècle",
  "a^b",
  "日本語",
  "日本語 v2",
  "   ",
  "???",
  "2 + 2",
  "Ångström",
];

cas.forEach(function (entree) {
  var sortie = slugify(entree);
  console.log(JSON.stringify(entree) + "  ->  " + JSON.stringify(sortie));
});
