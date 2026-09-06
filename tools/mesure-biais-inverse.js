/*
   mesure-biais-inverse.js — le biais que la CORRECTION fabrique.

   Écrit le 2026-09-06, pendant le point B4 du CHANTIER-V16, après la passe sur le
   cours `git`. Détordre un cours ne ramène pas ses indices au hasard : il en pousse
   certains EN DESSOUS. Sur `git`, « le mot technique exclusif » est passé de 65,4 %
   à 11,6 %, soit 13,4 points sous l'étalon de 25,0 % — parce qu'on étoffe les
   distracteurs avec du vocabulaire technique et que la bonne réponse cesse d'en
   être la seule porteuse. Un apprenant qui ÉCARTE l'option désignée en profite.

   Cet outil mesure exactement cet apprenant-là. Il reprend la règle de
   `mesure-biais-qcm.js` (un mot d'au moins 9 lettres qu'aucune autre option
   n'emploie), puis inverse la décision : les options désignées sont écartées, et
   l'on tire au hasard parmi celles qui restent.

   CE QU'IL FAUT SAVOIR AVANT DE LIRE SON CHIFFRE, sans quoi on surestime le
   défaut d'un facteur trois : l'avantage n'est PAS symétrique. Une stratégie à
   100 % rend 100 % ; à 0 %, son inverse plafonne à 33,3 %, parce qu'écarter une
   option sur quatre laisse encore trois candidates. C'est pourquoi ce biais ne se
   traite pas comme celui de la longueur, et pourquoi l'inscrire dans les
   EXPLOITABLES de `verif-qcm-biais.js` (cible 60 %) ne servirait à rien : il ne
   peut jamais atteindre cette cible, même au pire.

   Usage :
     node tools/mesure-biais-inverse.js                 # les cours marqués `traite`
     node tools/mesure-biais-inverse.js git doc ruby    # des cours précis
*/
"use strict";
var fs = require("fs"), path = require("path");
var RACINE = path.join(__dirname, "..");
var HASARD = 0.25;

function argMax(sc) {
  var mx = Math.max.apply(null, sc), out = [];
  sc.forEach(function (v, i) { if (v === mx) out.push(i); });
  return out;
}

/* La règle est recopiée de mesure-biais-qcm.js à dessein : deux implémentations
   indépendantes du même critère se contrôlent l'une l'autre. La colonne
   « directe » doit tomber au dixième près sur celle de l'autre outil ; si elle
   s'en écarte, c'est l'une des deux qui a bougé, et il faut le savoir. */
function designees(options) {
  var mots = options.map(function (t) {
    return new Set((String(t).toLowerCase().match(/[a-zà-ÿ][a-zà-ÿ-]{8,}/g) || []));
  });
  var score = mots.map(function (set, i) {
    var n = 0;
    set.forEach(function (mot) {
      var ailleurs = mots.some(function (o, j) { return j !== i && o.has(mot); });
      if (!ailleurs) n++;
    });
    return n;
  });
  return argMax(score);
}

function mesurer(cours) {
  var dir = path.join(RACINE, "pages", cours);
  if (!fs.existsSync(dir)) return null;
  var tot = 0, direct = 0, inverse = 0, tranche = 0;
  fs.readdirSync(dir).filter(function (f) { return /^lecon-\d+\.html$/.test(f); }).sort()
    .forEach(function (f) {
      var s = fs.readFileSync(path.join(dir, f), "utf8");
      var re = /<script[^>]*type="application\/json"[^>]*data-quiz(?:-bilan)?[^>]*>([\s\S]*?)<\/script>/g, m;
      while ((m = re.exec(s))) {
        var lot;
        try { lot = JSON.parse(m[1]); } catch (e) { continue; }
        lot.forEach(function (q) {
          if (!q || !Array.isArray(q.a) || !q.a.length) return;
          tot++;
          var k = q.correct || 0;
          var gagnants = designees(q.a);
          if (gagnants.indexOf(k) !== -1) direct += 1 / gagnants.length;
          var restant = [];
          q.a.forEach(function (_, i) { if (gagnants.indexOf(i) === -1) restant.push(i); });
          /* toutes les options désignées : la stratégie ne tranche pas, elle tire
             au hasard parmi les quatre — c'est le cas neutre, et le compter comme
             un succès gonflerait le chiffre exactement comme le fait un ex æquo
             non fractionné. */
          if (!restant.length) { inverse += 1 / q.a.length; return; }
          tranche++;
          if (restant.indexOf(k) !== -1) inverse += 1 / restant.length;
        });
      }
    });
  if (!tot) return null;
  return { cours: cours, questions: tot, direct: direct / tot,
           inverse: inverse / tot, couverture: tranche / tot };
}

var args = process.argv.slice(2).filter(function (a) { return a.indexOf("--") !== 0; });
var liste = args;
if (!liste.length) {
  try {
    var ref = JSON.parse(fs.readFileSync(path.join(__dirname, "qcm-biais-reference.json"), "utf8"));
    liste = Object.keys(ref.cours || {}).filter(function (c) { return ref.cours[c].traite; }).sort();
  } catch (e) { liste = []; }
  if (!liste.length) {
    console.error("aucun cours marqué `traite` dans qcm-biais-reference.json ; passe un nom en argument.");
    process.exit(2);
  }
}

function pc(x) { return (x * 100).toFixed(1) + " %"; }

console.log("\nmesure-biais-inverse — « le mot technique exclusif », et l'apprenant qui l'ÉCARTE");
console.log("  étalon du hasard : " + pc(HASARD) + " · plafond théorique de l'inverse : 33,3 %\n");
console.log("    cours            questions   directe   INVERSE   tranche sur   écart au hasard");
var lignes = [];
liste.forEach(function (c) {
  var r = mesurer(c);
  if (!r) { console.log("    " + c + " : introuvable"); return; }
  lignes.push(r);
});
lignes.sort(function (a, b) { return b.inverse - a.inverse; });
lignes.forEach(function (r) {
  var ecart = (r.inverse - HASARD) * 100;
  console.log("    " + (r.cours + "               ").slice(0, 15)
    + ("     " + r.questions).slice(-8)
    + ("        " + pc(r.direct)).slice(-10)
    + ("        " + pc(r.inverse)).slice(-10)
    + ("          " + pc(r.couverture)).slice(-14)
    + ("        " + (ecart >= 0 ? "+" : "") + ecart.toFixed(1)).slice(-12) + " pts");
});
console.log("\n  Lecture : « directe » = choisir l'option qui porte le mot technique exclusif,");
console.log("  et ce chiffre doit tomber sur celui de mesure-biais-qcm.js au dixième près.");
console.log("  « INVERSE » = l'écarter et tirer parmi les autres. Un cours jamais détordu est");
console.log("  au-dessus de 25 % en directe et en dessous en inverse ; un cours détordu trop");
console.log("  loin fait l'aller-retour. Ce que l'on vise est 25 % dans les DEUX colonnes.\n");
