/* controle.js — LE GARDE-FOU DE LA VAGUE DE REECRITURE DU COURS `vue`.
 *
 * Il compare l'etat SUR LE DISQUE a une reference git, question par question, et
 * signale tout INDICATEUR MESURE qui a change. La consigne est simple :
 *
 *     change les MOTS autant qu'il faut, ne change AUCUN indicateur.
 *
 * ⚠️ VERSION 2, apres une vague d'ecriture qui a REOUVERT quatre indices que la
 * version 1 ne surveillait pas (l'incise entre parentheses remontee a 36,6 % avec
 * un rendement de 100 %, le tiret a 27,2 %, « ECARTER la plus detaillee » a 27,8 %,
 * le COMBINE tiret+longueur a 29,0 %). La version 1 surveillait SEPT indicateurs
 * ecrits a la main ; les agents ont tenu les sept et casse le reste. C'est le
 * defaut du cliquet de `lua`, a l'identique : un garde-fou qui ne regarde qu'une
 * partie des strategies est vert pendant que la faille est entiere.
 *
 * La version 2 ne recopie plus aucune definition : elle CHARGE les 44 strategies
 * depuis tools/mesure-biais-qcm.js et compare, question par question, l'ENSEMBLE
 * des options que chacune designe. Tout indice present ou futur est donc couvert.
 * S'y ajoutent les indicateurs du lexique (w, k) que les strategies ne voient pas.
 *
 * usage : node scratchpad/vue-sonde/controle.js [lecon-NN.html ...]   (defaut : toutes)
 *         node scratchpad/vue-sonde/controle.js --ref=<commit>        (defaut : HEAD)
 */
"use strict";
var fs = require("fs"), path = require("path"), cp = require("child_process");
var RACINE = path.join(__dirname, "..", "..");
var STRATEGIES = require(path.join(RACINE, "tools", "mesure-biais-qcm.js")).STRATEGIES;
var argv = process.argv.slice(2);
var ref = (argv.find(function (a) { return a.indexOf("--ref=") === 0; }) || "--ref=HEAD").slice(6);
var cibles = argv.filter(function (a) { return a.indexOf("--") !== 0; });

function motsLongs(t) {
  var w = String(t).toLowerCase().match(/[a-zà-öø-ÿ][a-zà-öø-ÿ'-]{5,}/g) || [];
  return w.map(function (x) { return x.replace(/^[' -]+|[' -]+$/g, ""); }).filter(Boolean);
}

function questionsDe(src) {
  var out = [], m, re = /<script[^>]*type="application\/json"[^>]*data-(?:quiz|quiz-bilan)[^>]*>([\s\S]*?)<\/script>/g;
  while ((m = re.exec(src))) {
    if (/data-exos/.test(m[0])) continue;
    var v = null;
    try { v = JSON.parse(m[1]); } catch (e) { out.push({ casse: true, err: e.message }); continue; }
    if (Array.isArray(v)) v.forEach(function (q) { if (q && Array.isArray(q.a)) out.push(q); });
  }
  return out;
}
function vocabulaire(src) {
  return new Set(motsLongs(src.replace(/<script[^>]*data-quiz(?:-bilan)?[^>]*>[\s\S]*?<\/script>/g, " ")));
}

/* la signature mesuree d'une question : pour CHAQUE strategie, l'ensemble des
   options qu'elle designe — plus les deux compteurs du lexique. */
function signature(q, vocab) {
  var vu = { correct: q.correct };
  STRATEGIES.forEach(function (s) {
    var sel;
    try { sel = s.choisir(q); } catch (e) { sel = ["!" + e.message]; }
    vu["S:" + s.nom] = sel;
  });
  vu["w"] = q.a.map(function (t) { return motsLongs(t).length; });
  vu["k"] = q.a.map(function (t) {
    return Array.from(new Set(motsLongs(t))).filter(function (m) { return !vocab.has(m); }).length;
  });
  return vu;
}

var dossier = path.join(RACINE, "pages", "vue");
var fichiers = (cibles.length ? cibles : fs.readdirSync(dossier).filter(function (f) { return /^lecon-\d+\.html$/.test(f); })).sort();

var total = 0, ecarts = 0, casses = 0, parStrategie = {};
fichiers.forEach(function (f) {
  var disque, refSrc;
  try { disque = fs.readFileSync(path.join(dossier, f), "utf8"); }
  catch (e) { console.log("  ! " + f + " illisible"); return; }
  try { refSrc = cp.execSync("git show " + ref + ":pages/vue/" + f, { cwd: RACINE, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"], maxBuffer: 64 * 1024 * 1024 }); }
  catch (e) { console.log("  ! " + f + " absent de la reference " + ref); return; }

  var qd = questionsDe(disque), qr = questionsDe(refSrc);
  var vd = vocabulaire(disque), vr = vocabulaire(refSrc);
  var casse = qd.filter(function (q) { return q.casse; });
  if (casse.length) { casses += casse.length; console.log("  ✗ " + f + " : " + casse.length + " bloc(s) JSON INVALIDE(S) — " + casse[0].err); return; }
  if (qd.length !== qr.length) { console.log("  ✗ " + f + " : " + qd.length + " questions contre " + qr.length + " dans la reference"); ecarts++; return; }

  qd.forEach(function (q, i) {
    total++;
    var a = signature(qr[i], vr), b = signature(q, vd);
    var diff = [];
    Object.keys(a).forEach(function (cle) {
      if (JSON.stringify(a[cle]) !== JSON.stringify(b[cle])) {
        diff.push("      " + cle + " : " + JSON.stringify(a[cle]) + " -> " + JSON.stringify(b[cle]));
        parStrategie[cle] = (parStrategie[cle] || 0) + 1;
      }
    });
    if (diff.length) {
      ecarts++;
      console.log("  ✗ " + f + " q" + (i + 1) + " : " + String(qd[i].q).slice(0, 55));
      diff.forEach(function (d) { console.log(d); });
    }
  });
});

console.log("");
console.log("  reference " + ref + " · " + fichiers.length + " fichier(s) · " + total + " question(s)");
console.log("  questions dont un indicateur a bouge : " + ecarts + "   blocs JSON casses : " + casses);
var cles = Object.keys(parStrategie).sort(function (x, y) { return parStrategie[y] - parStrategie[x]; });
if (cles.length) {
  console.log("  indicateurs deplaces, du plus touche au moins touche :");
  cles.forEach(function (c) { console.log("    " + String(parStrategie[c]).padStart(3) + "  " + c); });
}
if (!ecarts && !casses) console.log("  TOUT EST EN PLACE — la mesure est inchangee, seuls les mots ont bouge.");
console.log("");
console.log("  Lecture : « S:<nom> » = la strategie de mesure-biais-qcm.js de ce nom ne designe");
console.log("  plus les memes options ; le tableau est l'ensemble des indices retenus (quatre");
console.log("  elements = ex aequo total = la strategie ne tranche pas). « w » = mots de 6+");
console.log("  lettres par option ; « k » = ceux qui sont ABSENTS du corps de la page.");
process.exitCode = (ecarts || casses) ? 1 : 0;
