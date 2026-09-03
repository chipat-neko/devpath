/*
   mesure-qcm-longueurs.js — la longueur des options d'un QCM, cours par cours.

   Ecrit pour le point B3 du CHANTIER-V16. Corriger le biais « la bonne reponse
   est la plus LONGUE » a un piege mesure sur `archi` : en etoffant les
   distracteurs, on INVERSE le biais au lieu de le fermer — la bonne reponse
   devient la plus COURTE (53,1 % apres la premiere passe, contre 25 % au
   hasard). Cet outil rend donc les deux strategies ET la distribution des
   rangs, pour qu'un cours traite soit reellement plat.

   Il rend aussi la fourchette longueur(distracteur) / longueur(bonne reponse) :
   la consigne de reecriture est 70-130 %, et un distracteur hors fourchette
   redonne un indice a l'apprenant.

   Usage :
     node tools/mesure-qcm-longueurs.js <cours>       # un cours
     node tools/mesure-qcm-longueurs.js --tout        # tous les cours, resume
*/
"use strict";
var fs = require("fs"), path = require("path");
var RACINE = path.join(__dirname, "..");
var BAS = 0.7, HAUT = 1.3;

function questionsDe(cours) {
  var dir = path.join(RACINE, "pages", cours), out = [];
  if (!fs.existsSync(dir)) return null;
  fs.readdirSync(dir).filter(function (f) { return /^lecon-\d+\.html$/.test(f); }).sort()
    .forEach(function (f) {
      var s = fs.readFileSync(path.join(dir, f), "utf8");
      var re = /<script type="application\/json" data-quiz(?:-bilan)?>([\s\S]*?)<\/script>/g, m;
      while ((m = re.exec(s))) {
        var lot;
        try { lot = JSON.parse(m[1]); } catch (e) { continue; }
        lot.forEach(function (q, i) { out.push({ fichier: f, num: i + 1, q: q }); });
      }
    });
  return out;
}

function mesurer(cours) {
  var lot = questionsDe(cours);
  if (!lot) return null;
  var r = { cours: cours, questions: lot.length, distracteurs: 0, mini: Infinity, maxi: 0,
    hors: [], rangs: [0, 0, 0, 0], longue: 0, courte: 0 };
  lot.forEach(function (e) {
    var L = e.q.a.map(function (o) { return o.length; });
    var bon = L[e.q.correct || 0];
    var max = Math.max.apply(null, L), min = Math.min.apply(null, L);
    if (bon === max) r.longue++;
    if (bon === min) r.courte++;
    r.rangs[L.filter(function (x) { return x > bon; }).length]++;
    L.forEach(function (n, k) {
      if (k === (e.q.correct || 0)) return;
      r.distracteurs++;
      var ratio = n / bon;
      if (ratio < r.mini) r.mini = ratio;
      if (ratio > r.maxi) r.maxi = ratio;
      if (ratio < BAS || ratio > HAUT) {
        r.hors.push(e.fichier + " q" + e.num + " opt" + k + " = " + ratio.toFixed(2)
          + " : " + e.q.a[k].slice(0, 60));
      }
    });
  });
  return r;
}

function pc(n, tot) { return (n / tot * 100).toFixed(1) + " %"; }

var args = process.argv.slice(2);
if (args.indexOf("--tout") !== -1) {
  var data = require(path.join(RACINE, "js", "data.js"));
  var cours = fs.readdirSync(path.join(RACINE, "pages")).filter(function (d) {
    return fs.statSync(path.join(RACINE, "pages", d)).isDirectory();
  });
  console.log("cours                questions  + longue  + courte  hors fourchette");
  cours.forEach(function (c) {
    var r = mesurer(c);
    if (!r || !r.questions) return;
    console.log("  " + (c + "                    ").slice(0, 20)
      + String(r.questions).padStart(6)
      + pc(r.longue, r.questions).padStart(10)
      + pc(r.courte, r.questions).padStart(9)
      + String(r.hors.length).padStart(10));
  });
  process.exit(0);
}

var nom = args[0];
if (!nom) { console.error("usage : node tools/mesure-qcm-longueurs.js <cours> | --tout"); process.exit(2); }
var r = mesurer(nom);
if (!r) { console.error("cours inconnu : " + nom); process.exit(2); }
console.log(r.cours + " : " + r.questions + " questions, " + r.distracteurs + " distracteurs");
console.log("  la bonne reponse est la plus LONGUE : " + pc(r.longue, r.questions)
  + "   la plus COURTE : " + pc(r.courte, r.questions) + "   (hasard : 25,0 %)");
console.log("  rangs par longueur (0 = la plus longue .. 3 = la plus courte) : " + r.rangs.join(" / "));
console.log("  fourchette distracteur/bonne reponse : " + r.mini.toFixed(2) + " a " + r.maxi.toFixed(2)
  + "  ·  hors 70-130 % : " + r.hors.length);
r.hors.forEach(function (h) { console.log("    " + h); });
process.exit(r.hors.length ? 1 : 0);
