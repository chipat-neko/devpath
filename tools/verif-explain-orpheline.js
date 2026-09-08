/* =============================================================================
   verif-explain-orpheline.js — le CLIQUET des explications orphelines.

   Il enveloppe `mesure-explain-orpheline.js` pour tourner SANS argument, comme
   l'exige la chaine, et regarde dans les deux directions qui comptent :

     1. LE TRAVAIL EN COURS — HEAD contre l'arbre de travail. C'est le controle qui
        mord pendant une vague d'ecriture : les distracteurs viennent d'etre
        remplaces, les `explain` sont declares intouchables, et personne ne relit.
        Sur un arbre propre il ne dit rien, et c'est normal.
     2. LES VAGUES DEJA COMMITEES — chaque cours marque `traite` dans
        `qcm-biais-reference.json` est compare a l'etat d'AVANT sa vague, retrouve
        dans git (le plus ancien commit touchant le cours dont le message parle de
        distracteurs). Les cours sans vague reperable ne sont pas mesures : mieux
        vaut ne rien mesurer que mesurer contre la mauvaise reference, et le compte
        des cours ignores est IMPRIME.

   Il est prouve capable d'echouer : `verif-explain-orpheline-mutations.js`.

   USAGE
     node tools/verif-explain-orpheline.js            # les deux directions
     node tools/verif-explain-orpheline.js --travail  # seulement le travail en cours
   ============================================================================= */

var path = require("path");
var cp = require("child_process");

var RACINE = path.join(__dirname, "..");
var MESURE = path.join(__dirname, "mesure-explain-orpheline.js");
var SEULEMENT_TRAVAIL = process.argv.indexOf("--travail") !== -1;

function mesurer(args) {
  var r = cp.spawnSync(process.execPath, [MESURE].concat(args), { cwd: RACINE, encoding: "utf8" });
  var sortie = (r.stdout || "") + (r.stderr || "");
  var m = sortie.match(/^\s*(\d+) EXPLICATION/m);
  var risque = sortie.match(/explain est INTOUCHEE\s*:\s*(\d+)/);
  return { n: m ? Number(m[1]) : 0, risque: risque ? Number(risque[1]) : 0, code: r.status, sortie: sortie };
}

function refAvantVague(cours) {
  var log;
  try {
    log = cp.execFileSync("git", ["log", "--format=%H|%s", "--reverse", "--", "pages/" + cours + "/"],
      { cwd: RACINE, encoding: "utf8", maxBuffer: 32 * 1024 * 1024 }).trim().split("\n");
  } catch (e) { return null; }
  var vagues = log.filter(function (l) { return /distracteur/i.test(l); });
  if (!vagues.length) return null;
  try {
    return cp.execFileSync("git", ["rev-parse", vagues[0].split("|")[0] + "~1"],
      { cwd: RACINE, encoding: "utf8" }).trim();
  } catch (e) { return null; }
}

var lignes = [];
var orphelines = [];

/* ------------------------------------------------------ 1. le travail en cours */
var travail = mesurer(["--depuis=HEAD", "--travail"]);
lignes.push("  travail en cours (HEAD <-> disque) : " + travail.risque + " question(s) a risque, "
  + travail.n + " orpheline(s)");
if (travail.n) orphelines.push("arbre de travail : " + travail.n);

/* -------------------------------------------------- 2. les vagues deja commitees */
if (!SEULEMENT_TRAVAIL) {
  var ref = require("./qcm-biais-reference.json");
  var traites = Object.keys(ref.cours).filter(function (c) { return ref.cours[c].traite; });
  var mesures = 0, ignores = [], risque = 0, trouves = 0;
  traites.forEach(function (c) {
    var r = refAvantVague(c);
    if (!r) { ignores.push(c); return; }
    var m = mesurer(["--depuis=" + r, "--seul=" + c]);
    mesures++; risque += m.risque; trouves += m.n;
    if (m.n) orphelines.push(c + " : " + m.n);
  });
  lignes.push("  vagues commitees : " + mesures + " cours mesures, " + risque + " question(s) a risque, "
    + trouves + " orpheline(s)");
  if (ignores.length) {
    lignes.push("  " + ignores.length + " cours sans vague reperable, NON mesures : " + ignores.join(", "));
  }
}

console.log("verif-explain-orpheline — l'explain commente-t-il une option EFFACEE par une vague ?");
console.log("");
lignes.forEach(function (l) { console.log(l); });
console.log("");
if (orphelines.length) {
  console.log("ECHEC — explication(s) orpheline(s) : " + orphelines.join(" | "));
  console.log("  `node tools/mesure-explain-orpheline.js --depuis=<ref> --seul=<cours>` donne le detail.");
  process.exit(1);
}
console.log("OK — aucun explain n'emploie un identifiant qui n'existait que dans une option effacee.");
