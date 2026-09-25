"use strict";
/* usage : node mots.js cand.json   avec { "lecon-07.html": ["texte", ...] } */
var fs = require("fs");
var L = require("./lib.js");
var cand = JSON.parse(fs.readFileSync(process.argv[2], "utf8"));
Object.keys(cand).forEach(function (f) {
  var v = L.vocabulaire(fs.readFileSync(L.chemin(f), "utf8"));
  console.log("=== " + f);
  cand[f].forEach(function (t, i) {
    var ml = L.motsLongs(t);
    var abs = Array.from(new Set(ml)).filter(function (m) { return !v.has(m); });
    var neuf = (t.toLowerCase().match(/[a-zà-ÿ][a-zà-ÿ-]{8,}/g) || []);
    console.log("[" + i + "] len=" + t.length + " nm=" + L.nmots(t) + " dens=" + L.densite(t).toFixed(3) + " w=" + ml.length + " k=" + abs.length);
    console.log("     6+: " + ml.join(" ")); console.log("     k: " + (abs.join(", ") || "-"));
    console.log("     9+: " + (Array.from(new Set(neuf)).join(", ") || "-"));
    console.log("     " + t);
  });
});
