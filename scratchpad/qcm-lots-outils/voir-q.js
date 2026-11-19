"use strict";
/* Affiche des questions de QCM : node voir-q.js <copie> <page> <bloc> <indice> [<page> <bloc> <indice>]... */
var fs = require("fs"), path = require("path");
var a = process.argv.slice(2), copie = a.shift();
for (var i = 0; i + 2 < a.length + 1; i += 3) {
  var page = a[i], bloc = a[i + 1], k = +a[i + 2];
  var t = fs.readFileSync(path.join(copie, page), "utf8");
  var re = new RegExp('<script type="application/json" ' + bloc + '>([\\s\\S]*?)</script>');
  var m = re.exec(t);
  if (!m) { console.log("bloc introuvable : " + page + " " + bloc); continue; }
  var q = JSON.parse(m[1])[k];
  console.log("== " + page + " " + bloc + " q" + k + " : " + q.q + "  (bonne : " + q.correct + ")");
  q.a.forEach(function (o, j) { console.log("  " + j + (j === q.correct ? "*" : " ") + ": " + o); });
}
