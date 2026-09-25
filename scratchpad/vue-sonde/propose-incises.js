/* propose-incises.js — pour chaque question ou la bonne reponse porte PLUS d'incises
   entre parentheses que tel distracteur, propose de parentheser une apposition deja
   presente dans ce distracteur (segment entre virgules), et dit si la longueur tient
   dans la fenetre du rang.
   Ne touche a RIEN : il ecrit un fichier de patchs candidats a relire.
   usage : node propose-incises.js [sortie.json] */
"use strict";
var fs = require("fs"), path = require("path");
var RACINE = path.join(__dirname, "..", "..");
var dossier = path.join(RACINE, "pages", "vue");
var sortie = process.argv[2] || path.join(__dirname, "patchs-incises.json");

function incises(t) { return (t.match(/\([^)]{4,}\)/g) || []).length; }

/* la fenetre de longueur : combien de caracteres l'option peut gagner sans changer
   de rang, c'est-a-dire sans rattraper l'option immediatement plus longue. */
function marge(a, i) {
  var L = a.map(function (t) { return t.length; });
  var audessus = L.filter(function (v) { return v > L[i]; });
  return audessus.length ? Math.min.apply(null, audessus) - L[i] - 1 : Infinity;
}

/* les appositions parenthesables : un segment entre deux virgules, ou entre une
   virgule et la fin, qui ne commence pas par une conjonction de coordination. */
function candidats(t) {
  var out = [];
  var re = /, ([^,;()]{8,60}),/g, m;
  while ((m = re.exec(t))) {
    if (/^(et|ou|mais|donc|car|puis|alors|ce qui|ce que)\b/i.test(m[1])) continue;
    out.push({ de: m[0], a: " (" + m[1] + "),", cout: 2 });
  }
  var f = t.match(/, ([^,;()]{8,60})$/);
  if (f && !/^(et|ou|mais|donc|car|puis|alors)\b/i.test(f[1])) out.push({ de: f[0], a: " (" + f[1] + ")", cout: 2 });
  return out;
}

var patchs = [], sansSolution = [];
fs.readdirSync(dossier).filter(function (f) { return /^lecon-\d+\.html$/.test(f); }).sort().forEach(function (f) {
  var src = fs.readFileSync(path.join(dossier, f), "utf8"), m, n = 0;
  var re = /<script[^>]*type="application\/json"[^>]*data-(?:quiz|quiz-bilan)[^>]*>([\s\S]*?)<\/script>/g;
  while ((m = re.exec(src))) {
    if (/data-exos/.test(m[0])) continue;
    var v = null; try { v = JSON.parse(m[1]); } catch (e) { continue; }
    if (!Array.isArray(v)) continue;
    v.forEach(function (q) {
      if (!q || !Array.isArray(q.a)) return;
      n++;
      var c = q.a.map(incises), mx = Math.max.apply(null, c);
      if (c[q.correct] !== mx) return;              /* la bonne n'est pas en tete : rien a faire */
      if (c.every(function (x) { return x === mx; })) return;  /* deja egal partout */
      q.a.forEach(function (t, j) {
        if (j === q.correct || c[j] >= mx) return;
        var mg = marge(q.a, j);
        var cs = candidats(t).filter(function (x) { return x.cout <= mg; });
        if (!cs.length) { sansSolution.push({ fichier: f, q: n, opt: j, marge: mg, texte: t, manque: mx - c[j] }); return; }
        patchs.push({
          fichier: f, q: n, opt: j, marge: mg, manque: mx - c[j],
          texte: t.replace(cs[0].de, cs[0].a),
          avant: t,
        });
      });
    });
  }
});

fs.writeFileSync(sortie, JSON.stringify(patchs, null, 2), "utf8");
console.log("  " + patchs.length + " patch(s) proposes -> " + sortie);
console.log("  " + sansSolution.length + " option(s) sans apposition parenthesable dans la marge :");
sansSolution.forEach(function (s) {
  console.log("    " + s.fichier + " q" + s.q + " opt" + s.opt + " (marge " + s.marge + ", manque " + s.manque + ") : " + s.texte.slice(0, 90));
});
