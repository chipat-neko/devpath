/* La rubrique « Exceptions » : ce que la fonction lève, et sur quoi. */
/*@@SLUGIFY@@*/

var entrees = [null, undefined, 42, true, ["Les tableaux"], { titre: "Les tableaux" }];

entrees.forEach(function (v) {
  var etiquette = Array.isArray(v) ? "un tableau"
    : v === null ? "null"
    : v === undefined ? "undefined"
    : typeof v === "object" ? "un objet"
    : typeof v + " " + JSON.stringify(v);
  try {
    console.log(etiquette + "  ->  " + JSON.stringify(slugify(v)));
  } catch (e) {
    console.log(etiquette + "  ->  " + e.name + " levée");
  }
});
