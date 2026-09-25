/* Applique les remplacements de distracteurs, litteralement, avec controle strict :
   la chaine cherchee doit apparaitre EXACTEMENT UNE FOIS dans le fichier. */
var fs = require("fs");
var path = require("path");
var RACINE = path.join(__dirname, "..", "..");

var LOTS = [
  {
    f: "pages/vue/lecon-14.html",
    de: "Pour un rendu plus vif : le composant lit les données d'un espace central, plus tôt que dans des copies désynchronisées d'une vue à une autre",
    a: "Pour un rendu bien plus vif : ce composant relit sans cesse ces données, plutôt que leurs copies déjà désynchronisées dans chaque vue en cours",
  },
  {
    f: "pages/vue/lecon-09.html",
    de: "v-for garde une key stable sur le même élément, et ce duo est déjà rentable ; v-if écarte ensuite les entrées masquées une à une, et le filtre reste facultatif, voire nuisible pour la mise à jour",
    a: "v-for garde cette key stable sur ce même élément, et ce duo est alors rentable ; v-if écarte ensuite ces entrées masquées tour à tour, donc leur filtre reste facultatif, voire nuisible pour cette mise à jour",
  },
  {
    f: "pages/vue/lecon-03.html",
    de: "La méthode garde son résultat en cache : Vue ne la rappelle pas tant que ses sources restent les mêmes, alors qu'une computed se recalcule à chaque rendu — le cache va donc aux méthodes et la computed au calcul",
    a: "Cette méthode garde son résultat en cache : Vue ne la rappelle plus tant que ses sources restent les mêmes, alors qu'une computed se recalcule pour chaque rendu — le cache sert donc aux méthodes et cette computed au calcul",
  },
];

LOTS.forEach(function (l) {
  var p = path.join(RACINE, l.f);
  var t = fs.readFileSync(p, "utf8");
  var n = t.split(l.de).length - 1;
  if (n !== 1) { console.log("REFUS " + l.f + " : " + n + " occurrence(s)"); process.exitCode = 1; return; }
  fs.writeFileSync(p, t.split(l.de).join(l.a), "utf8");
  console.log("OK    " + l.f + " (" + l.de.length + " -> " + l.a.length + " car.)");
});
