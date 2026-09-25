/* controle.js — LE GARDE-FOU DE LA VAGUE DE REECRITURE DU COURS `vue`.
 *
 * Il compare l'etat SUR LE DISQUE a une reference git, question par question, et
 * signale tout INDICATEUR MESURE qui a change. La consigne est simple :
 *
 *     change les MOTS autant qu'il faut, ne change AUCUN indicateur.
 *
 * Les indicateurs sont exactement ceux que les outils du projet exploitent :
 *   - rang de longueur en caracteres de chaque option (mesure-biais-qcm)
 *   - quelle option est la plus DENSE en mots longs, et laquelle est la moins bavarde
 *   - w : nombre de mots de 6+ lettres par option (mesure-lexique-qcm, variante PROPORTION)
 *   - k : nombre de mots de 6+ lettres ABSENTS de la page (mesure-lexique-qcm)
 *   - x : nombre de mots de 9+ lettres exclusifs a une option (« le mot technique exclusif »)
 *
 * usage : node scratchpad/vue-sonde/controle.js [lecon-NN.html ...]   (defaut : toutes)
 *         node scratchpad/vue-sonde/controle.js --ref=<commit>        (defaut : HEAD)
 */
"use strict";
var fs = require("fs"), path = require("path"), cp = require("child_process");
var RACINE = path.join(__dirname, "..", "..");
var argv = process.argv.slice(2);
var ref = (argv.find(function (a) { return a.indexOf("--ref=") === 0; }) || "--ref=HEAD").slice(6);
var cibles = argv.filter(function (a) { return a.indexOf("--") !== 0; });

function motsLongs(t) {
  var w = String(t).toLowerCase().match(/[a-zà-öø-ÿ][a-zà-öø-ÿ'-]{5,}/g) || [];
  return w.map(function (x) { return x.replace(/^[' -]+|[' -]+$/g, ""); }).filter(Boolean);
}
function nmots(t) { return (t.match(/[A-Za-zÀ-ÿ0-9_]+/g) || []).length; }
function densite(t) { var w = t.match(/[A-Za-zÀ-ÿ0-9_]+/g) || []; return w.length ? w.join("").length / w.length : 0; }
function argMax(v) { var m = Math.max.apply(null, v); return v.reduce(function (a, x, i) { if (x === m) a.push(i); return a; }, []); }
function argMin(v) { var m = Math.min.apply(null, v); return v.reduce(function (a, x, i) { if (x === m) a.push(i); return a; }, []); }

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

/* la signature mesuree d'une question : que des NOMBRES et des ENSEMBLES d'indices */
function signature(q, vocab) {
  var L = q.a.map(function (t) { return t.length; });
  var tri = L.slice().sort(function (a, b) { return b - a; });
  var sets = q.a.map(function (t) { return new Set(t.toLowerCase().match(/[a-zà-ÿ][a-zà-ÿ-]{8,}/g) || []); });
  return {
    correct: q.correct,
    rang: L.map(function (v) { return tri.indexOf(v); }),
    dense: argMax(q.a.map(densite)),
    bavarde: argMin(q.a.map(nmots)),
    w: q.a.map(function (t) { return motsLongs(t).length; }),
    k: q.a.map(function (t) {
      return Array.from(new Set(motsLongs(t))).filter(function (m) { return !vocab.has(m); }).length;
    }),
    x: sets.map(function (s, i) {
      var n = 0;
      s.forEach(function (m) { if (!sets.some(function (o, j) { return j !== i && o.has(m); })) n++; });
      return n;
    }),
  };
}

var dossier = path.join(RACINE, "pages", "vue");
var fichiers = (cibles.length ? cibles : fs.readdirSync(dossier).filter(function (f) { return /^lecon-\d+\.html$/.test(f); })).sort();

var total = 0, ecarts = 0, casses = 0;
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
    ["correct", "rang", "dense", "bavarde", "w", "k", "x"].forEach(function (cle) {
      if (JSON.stringify(a[cle]) !== JSON.stringify(b[cle])) {
        diff.push(cle + " " + JSON.stringify(a[cle]) + " -> " + JSON.stringify(b[cle]));
      }
    });
    if (diff.length) {
      ecarts++;
      console.log("  ✗ " + f + " q" + (i + 1) + " : " + String(qd[i].q).slice(0, 55));
      diff.forEach(function (d) { console.log("      " + d); });
    }
  });
});

console.log("");
console.log("  reference " + ref + " · " + fichiers.length + " fichier(s) · " + total + " question(s)");
console.log("  indicateurs deplaces : " + ecarts + "   blocs JSON casses : " + casses);
if (!ecarts && !casses) console.log("  TOUT EST EN PLACE — la mesure est inchangee, seuls les mots ont bouge.");
console.log("");
console.log("  Lecture des cles : rang = rang de longueur en caracteres (0 = la plus longue) ;");
console.log("  dense = indices de l'option la plus dense en mots longs ; bavarde = indices de");
console.log("  celle qui compte le moins de mots ; w = mots de 6+ lettres ; k = mots de 6+");
console.log("  lettres ABSENTS de la page ; x = mots de 9+ lettres exclusifs a l'option.");
process.exitCode = (ecarts || casses) ? 1 : 0;
