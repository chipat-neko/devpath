"use strict";
/* Après `--ecrire` des deux cliquets : ne garder la référence NEUVE que pour les cours du lot (et les
   champs globaux) ; tout autre cours reprend son entrée de HEAD — une dérive dans la tolérance ne doit
   pas devenir la nouvelle référence sans décision. Pour les cours du lot : traite = true (biais) ; au
   lexique, traite / traiteRestreint = true quand toutes les mesures sont à 0. */
var fs = require("fs"), cp = require("child_process");
var LOT = ["cloud", "reseaux", "wasm", "ml", "erlang", "ada", "llm", "fortran", "groovy"];
function ecrire(f, obj, modele) {
  var nl = /\r\n/.test(modele) ? "\r\n" : "\n";
  var ind = /\n( +)"/.exec(modele);
  fs.writeFileSync(f, JSON.stringify(obj, null, ind ? ind[1].length : 2).replace(/\n/g, nl) + (/\n$/.test(modele) ? nl : ""));
}
["tools/qcm-biais-reference.json", "tools/qcm-lexique-reference.json"].forEach(function (f) {
  var avant = JSON.parse(cp.execSync("git -c core.autocrlf=false show HEAD:" + f, { cwd: "D:/test-claude" }).toString());
  var t = fs.readFileSync("D:/test-claude/" + f, "utf8"), neuf = JSON.parse(t);
  var rendus = [];
  Object.keys(neuf.cours).forEach(function (c) {
    if (LOT.indexOf(c) !== -1) return;
    if (JSON.stringify(neuf.cours[c]) !== JSON.stringify(avant.cours[c])) { neuf.cours[c] = avant.cours[c]; rendus.push(c); }
  });
  LOT.forEach(function (c) {
    var e = neuf.cours[c];
    if (/biais/.test(f)) e.traite = true;
    else {
      var zero = Object.keys(e).filter(function (k) { return typeof e[k] === "number" && k !== "questions"; }).every(function (k) { return e[k] === 0; });
      if (zero) { e.traite = true; e.traiteRestreint = true; }
      else console.log("  lexique NON NUL pour " + c + " : " + JSON.stringify(e));
    }
  });
  ecrire("D:/test-claude/" + f, neuf, t);
  console.log(f + " : " + rendus.length + " cours hors lot rendus à HEAD (" + rendus.join(", ") + ") ; lot marqué traité");
});
