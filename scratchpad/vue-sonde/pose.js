/* pose.js — ecrit sur le disque un lot de patchs de distracteurs.
   Deux formes acceptees, melangeables :
     {fichier, q, opt, texte}   -> par numero de question (1-based) et index d'option
     {fichier, old, texte}      -> par remplacement LITTERAL, refuse si != 1 occurrence
   Il refuse de toucher a la bonne reponse, et verifie que chaque bloc reste du JSON
   valide avant d'ecrire.
   usage : node pose.js patchs.json [--ecrire]     (sans --ecrire : apercu) */
"use strict";
var fs = require("fs"), path = require("path");
var RACINE = path.join(__dirname, "..", "..");
var patchs = JSON.parse(fs.readFileSync(process.argv[2], "utf8"));
var ecrire = process.argv.indexOf("--ecrire") >= 0;

var parFichier = {};
patchs.forEach(function (p) { (parFichier[p.fichier] = parFichier[p.fichier] || []).push(p); });

var totalPoses = 0, totalRefus = 0;
Object.keys(parFichier).sort().forEach(function (f) {
  var chemin = path.join(RACINE, "pages", "vue", f);
  var src = fs.readFileSync(chemin, "utf8");
  var lot = parFichier[f];
  var poses = 0, refus = 0, n = 0;

  var re = /(<script[^>]*type="application\/json"[^>]*data-(?:quiz|quiz-bilan)[^>]*>)([\s\S]*?)(<\/script>)/g;
  var neuf = src.replace(re, function (tout, ouvre, corps, ferme) {
    if (/data-exos/.test(ouvre)) return tout;
    var v;
    try { v = JSON.parse(corps); } catch (e) { return tout; }
    if (!Array.isArray(v)) return tout;
    var touche = false;
    v.forEach(function (q) {
      if (!q || !Array.isArray(q.a)) return;
      n++;
      lot.forEach(function (x) {
        var i = -1;
        if (x.old !== undefined) {
          var trouves = q.a.reduce(function (acc, t, j) { if (t === x.old) acc.push(j); return acc; }, []);
          if (trouves.length !== 1) return;
          i = trouves[0];
        } else if (x.q === n) {
          i = x.opt;
        } else return;
        if (i === q.correct) { console.log("  REFUS " + f + " q" + n + " opt" + i + " EST la bonne reponse"); refus++; return; }
        if (q.a[i] === x.texte) return;
        q.a[i] = x.texte;
        touche = true; poses++;
      });
    });
    if (!touche) return tout;
    var lignes = v.map(function (o) { return "  " + JSON.stringify(o); });
    /* ⚠️ les CROCHETS du tableau : les oublier casse tous les blocs JSON d'un coup.
       C'est arrive une fois, sur les 14 lecons a la fois. */
    return ouvre + "\n[\n" + lignes.join(",\n") + "\n]\n" + ferme;
  });

  /* relecture de securite : chaque bloc du resultat doit reparser */
  var casse = 0, m2, re2 = /<script[^>]*type="application\/json"[^>]*data-(?:quiz|quiz-bilan)[^>]*>([\s\S]*?)<\/script>/g;
  while ((m2 = re2.exec(neuf))) { try { JSON.parse(m2[1]); } catch (e) { casse++; } }
  if (casse) { console.log("  REFUS " + f + " : le resultat contient " + casse + " bloc(s) JSON invalide(s)"); process.exitCode = 1; return; }

  totalPoses += poses; totalRefus += refus;
  var nonPoses = lot.filter(function (x) { return x.old !== undefined && src.indexOf(x.old) < 0; });
  nonPoses.forEach(function (x) { console.log("  ! " + f + " : ancien texte introuvable — " + x.old.slice(0, 70)); });
  if (!poses) { console.log("  " + f + " : rien a poser"); return; }
  if (ecrire) { fs.writeFileSync(chemin, neuf, "utf8"); console.log("  ecrit  " + f + " : " + poses + " option(s)"); }
  else console.log("  apercu " + f + " : " + poses + " option(s)");
});
console.log("  total " + totalPoses + " pose(s), " + totalRefus + " refus" + (ecrire ? "" : " — relancer avec --ecrire"));
if (totalRefus) process.exitCode = 1;
