/* simule.js — applique un lot de patchs EN MEMOIRE et recalcule les 44 strategies
   sur le cours `vue`. Rien n'est ecrit. C'est l'outil de decision : il dit ce que
   la retouche donnera AVANT qu'elle touche le disque.
   usage : node simule.js [patchs.json]        (sans argument : etat du disque)
   format : [{"fichier":"lecon-07.html","q":4,"opt":1,"texte":"..."}] */
"use strict";
var fs = require("fs"), path = require("path");
var RACINE = path.join(__dirname, "..", "..");
var M = require(path.join(RACINE, "tools", "mesure-biais-qcm.js"));

var patchs = [];
if (process.argv[2]) patchs = JSON.parse(fs.readFileSync(process.argv[2], "utf8"));

/* relire le corpus `vue` en gardant le numero de question DANS LE FICHIER */
var dossier = path.join(RACINE, "pages", "vue");
var corpus = [];
fs.readdirSync(dossier).filter(function (f) { return /^lecon-\d+\.html$/.test(f); }).sort().forEach(function (f) {
  var src = fs.readFileSync(path.join(dossier, f), "utf8");
  var m, re = /<script[^>]*type="application\/json"[^>]*data-(?:quiz|quiz-bilan)[^>]*>([\s\S]*?)<\/script>/g, n = 0;
  while ((m = re.exec(src))) {
    if (/data-exos/.test(m[0])) continue;
    var v = null;
    try { v = JSON.parse(m[1]); } catch (e) { continue; }
    if (Array.isArray(v)) v.forEach(function (q) {
      if (!q || !Array.isArray(q.a)) return;
      n++;
      corpus.push({ fichier: f, no: n, q: String(q.q || ""), a: q.a.map(String), k: Number(q.correct || 0) });
    });
  }
});

var appliques = 0;
patchs.forEach(function (p) {
  var c = corpus.filter(function (x) { return x.fichier === p.fichier && x.no === p.q; })[0];
  if (!c) { console.log("  ! patch sans cible : " + p.fichier + " q" + p.q); return; }
  if (p.opt === c.k) { console.log("  ! REFUS : " + p.fichier + " q" + p.q + " opt" + p.opt + " EST la bonne reponse"); process.exitCode = 1; return; }
  c.a[p.opt] = p.texte;
  appliques++;
});
if (patchs.length) console.log("  " + appliques + "/" + patchs.length + " patch(s) appliques en memoire\n");

var n = corpus.length;
var lignes = [];
M.STRATEGIES.forEach(function (s) {
  var score = 0, couv = 0, juste = 0;
  corpus.forEach(function (q) {
    var sel; try { sel = s.choisir(q); } catch (e) { sel = q.a.map(function (_, i) { return i; }); }
    if (sel.indexOf(q.k) >= 0) score += 1 / sel.length;
    if (sel.length < q.a.length) { couv++; if (sel.indexOf(q.k) >= 0) juste += 1 / sel.length; }
  });
  lignes.push({ nom: s.nom, r: 100 * score / n, c: 100 * couv / n, rend: couv ? 100 * juste / couv : 0 });
});
lignes.sort(function (a, b) { return b.r - a.r; });
console.log("  strategie                              reussite  couverture  rendement");
lignes.slice(0, 12).forEach(function (l) {
  console.log("  " + (l.r > 26 ? "!" : " ") + " " + l.nom.slice(0, 36).padEnd(36) +
    l.r.toFixed(1).padStart(7) + " %" + l.c.toFixed(1).padStart(10) + " %" + l.rend.toFixed(1).padStart(10) + " %");
});
var pires = lignes.filter(function (l) { return l.r > 26; });
console.log("\n  " + n + " questions · pire indice " + lignes[0].r.toFixed(1) + " % · " +
  pires.length + " strategie(s) au-dessus de 26,0 %");
