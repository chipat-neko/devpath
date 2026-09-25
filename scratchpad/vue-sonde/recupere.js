/* recupere.js — reconstruit le lot d'ecriture des cinq agents a partir des fichiers
   de patchs qu'ils ont laisses dans leurs dossiers de travail, apres qu'un
   `git checkout -- pages/vue/` de l'orchestrateur a ecrase leurs 107 reecritures
   non commitees.
   Les cinq formats different ; ils sont ramenes ici au format canonique
   {fichier, q, opt, texte} de pose.js.
   usage : node recupere.js [sortie.json] */
"use strict";
var fs = require("fs"), path = require("path");
var RACINE = path.join(__dirname, "..", "..");
var SCRATCH = path.join(RACINE, "scratchpad");
var sortie = process.argv[2] || path.join(__dirname, "recupere.json");
var out = [];

function lire(p) { return JSON.parse(fs.readFileSync(p, "utf8")); }
function existe(p) { try { fs.accessSync(p); return true; } catch (e) { return false; } }

/* --- agent A : [{f, old, new}] — repere par l'ANCIEN TEXTE, pas par un index --- */
var pA = path.join(SCRATCH, "vue-ecriture-A", "remplacements.json");
if (existe(pA)) lire(pA).forEach(function (r) { out.push({ fichier: r.f, old: r.old, texte: r.new }); });

/* --- agent B : pN.json = { "<no question>": { "<no option>": texte } } pour lecon-0N --- */
[4, 5, 6].forEach(function (n) {
  var p = path.join(SCRATCH, "vue-ecriture-B", "p" + n + ".json");
  if (!existe(p)) return;
  var o = lire(p);
  Object.keys(o).forEach(function (q) {
    Object.keys(o[q]).forEach(function (i) {
      out.push({ fichier: "lecon-0" + n + ".html", q: Number(q), opt: Number(i), texte: o[q][i] });
    });
  });
});

/* --- agent C : pNN.json = { "<fichier>": { "<no question>": { "<no option>": texte } } } --- */
["07", "08", "09"].forEach(function (n) {
  var p = path.join(SCRATCH, "vue-ecriture-C", "p" + n + ".json");
  if (!existe(p)) return;
  var o = lire(p);
  Object.keys(o).forEach(function (f) {
    Object.keys(o[f]).forEach(function (q) {
      Object.keys(o[f][q]).forEach(function (i) {
        out.push({ fichier: f, q: Number(q), opt: Number(i), texte: o[f][q][i] });
      });
    });
  });
});

/* --- agent D : eNN.json = [{q, i, t}] pour lecon-NN --- */
[10, 11, 12].forEach(function (n) {
  var p = path.join(SCRATCH, "vue-ecriture-D", "e" + n + ".json");
  if (!existe(p)) return;
  lire(p).forEach(function (r) {
    out.push({ fichier: "lecon-" + n + ".html", q: r.q, opt: r.i, texte: r.t });
  });
});

/* --- agent E : rempl-NN.js, un tableau R de paires [ancien, neuf] dans le source --- */
[13, 14].forEach(function (n) {
  var p = path.join(SCRATCH, "vue-ecriture-E", "rempl-" + n + ".js");
  if (!existe(p)) return;
  var src = fs.readFileSync(p, "utf8");
  var deb = src.indexOf("var R = [");
  if (deb < 0) { console.log("  ! rempl-" + n + ".js : tableau R introuvable"); return; }
  var i = src.indexOf("[", deb), prof = 0, fin = -1;
  for (var j = i; j < src.length; j++) {
    if (src[j] === "[") prof++;
    else if (src[j] === "]") { prof--; if (!prof) { fin = j + 1; break; } }
  }
  var R;
  try { R = eval(src.slice(i, fin)); } catch (e) { console.log("  ! rempl-" + n + ".js illisible : " + e.message); return; }
  R.forEach(function (paire) {
    out.push({ fichier: "lecon-" + n + ".html", old: paire[0], texte: paire[1] });
  });
});

fs.writeFileSync(sortie, JSON.stringify(out, null, 1), "utf8");
var parF = {};
out.forEach(function (r) { parF[r.fichier] = (parF[r.fichier] || 0) + 1; });
console.log("  " + out.length + " remplacement(s) reconstruits -> " + sortie);
Object.keys(parF).sort().forEach(function (f) { console.log("    " + f + " : " + parF[f]); });
