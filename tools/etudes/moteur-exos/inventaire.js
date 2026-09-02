/* Compte ce que le moteur d'exercices traite RÉELLEMENT sur ce site : combien de
   leçons portent un bloc `data-exos`, combien d'exercices y sont déclarés, et
   comment ils se répartissent entre les cinq types. Les chiffres publiés par
   l'étude de cas nº 2 viennent d'ici, et sont refaits à chaque assemblage. */
var fs = require("fs");
var path = require("path");

var PAGES = path.resolve(__dirname, "..", "..", "..", "pages");

function lecons(dir, acc) {
  fs.readdirSync(dir, { withFileTypes: true }).forEach(function (e) {
    var f = path.join(dir, e.name);
    if (e.isDirectory()) lecons(f, acc);
    else if (/^lecon-\d+\.html$/.test(e.name)) acc.push(f);
  });
  return acc;
}

function inventaire() {
  var fichiers = lecons(PAGES, []);
  var r = { fichiers: fichiers.length, avecExos: 0, entrees: 0, nulles: 0, types: {}, jsonKO: [] };
  fichiers.forEach(function (f) {
    var src = fs.readFileSync(f, "utf8");
    var m = /<script[^>]*data-exos[^>]*>([\s\S]*?)<\/script>/.exec(src);
    if (!m) return;
    var data;
    /* Le moteur, lui, avale l'exception et n'affiche rien du tout (`catch (e) { return; }`).
       Ici on veut au contraire que le JSON invalide se voie : c'est le rôle d'un outil. */
    try { data = JSON.parse(m[1]); } catch (e) { r.jsonKO.push(path.relative(PAGES, f)); return; }
    if (!data || !data.length) return;
    r.avecExos++;
    data.forEach(function (x) {
      if (!x) { r.nulles++; return; }
      r.entrees++;
      var t = x.type || "(sans type)";
      r.types[t] = (r.types[t] || 0) + 1;
    });
  });
  return r;
}

if (require.main === module) {
  var r = inventaire();
  console.log("fichiers lecon-NN.html sous pages/ : " + r.fichiers);
  console.log("  dont porteurs d'un bloc data-exos : " + r.avecExos);
  console.log("exercices déclarés : " + r.entrees + "   (+ " + r.nulles + " entrées null, volontairement sans champ)");
  console.log("");
  console.log("répartition par type :");
  Object.keys(r.types)
    .sort(function (a, b) { return r.types[b] - r.types[a]; })
    .forEach(function (t) {
      console.log("  " + (t + " ").padEnd(16, ".") + " " + String(r.types[t]).padStart(5));
    });
  if (r.jsonKO.length) {
    console.log("");
    console.log("⚠ JSON invalide (le moteur les ignorerait en silence) : " + r.jsonKO.join(", "));
  }
}

module.exports = { inventaire: inventaire };
