/* =============================================================================
   recense-chaine.js — qui est dans la chaine, qui n'y est pas.

   POURQUOI : le bilan F5 du chantier V15 a montre que quatre des six manques
   d'outillage avaient la meme forme — un verificateur existe, il trouve de
   vraies fautes, et personne ne le lance parce qu'il n'est dans aucun mode de
   `tools/verif.js`. Un outil qu'on doit penser a lancer ne protege rien.

   Cet outil-ci ne juge pas : il RECENSE. Il liste tous les .js sous tools/,
   extrait la liste des fichiers que verif.js lance reellement (dans chacun de
   ses quatre modes), et croise les deux. Le garde-fou qui ECHOUE est le point
   A5 ; celui-ci sert au tri du point A1.

   USAGE
     node tools/recense-chaine.js            # tableau lisible
     node tools/recense-chaine.js --json     # meme chose, en JSON

   CODE DE SORTIE : toujours 0 — c'est un releve, pas un verdict.
   ============================================================================= */
"use strict";

var fs = require("fs");
var path = require("path");
var cp = require("child_process");

var RACINE = path.join(__dirname, "..");
var TOOLS = __dirname;
var SEP = path.sep;
var JSON_MODE = process.argv.indexOf("--json") !== -1;

/* ---------------------------------------------------------------- inventaire */
function walk(dir, out) {
  fs.readdirSync(dir, { withFileTypes: true }).forEach(function (e) {
    var p = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (e.name === "node_modules" || e.name[0] === ".") return;
      walk(p, out);
    } else if (/\.js$/.test(e.name)) out.push(p);
  });
  return out;
}
function rel(p) { return path.relative(TOOLS, p).split(SEP).join("/"); }

var tous = walk(TOOLS, []).map(rel).sort();

/* ------------------------------------------- ce que verif.js lance vraiment */
/* On ne lit pas le source a la grep : on DEMANDE a verif.js sa liste, mode par
   mode. Recopier une liste au lieu de la lire est exactement le defaut qui a
   rendu la surveillance aveugle au chantier V16 lui-meme. */
var MODES = ["--rapide", "", "--complet", "--strict"];
var parMode = {};
MODES.forEach(function (m) {
  var args = [path.join(TOOLS, "verif.js"), "--lister"].concat(m ? [m] : []);
  var r = cp.spawnSync(process.execPath, args, { encoding: "utf8", maxBuffer: 8 * 1024 * 1024 });
  var lignes = (r.stdout || "").split("\n").map(function (l) { return l.trim(); }).filter(Boolean);
  parMode[m || "(defaut)"] = lignes;
});

var lances = {};
Object.keys(parMode).forEach(function (m) {
  parMode[m].forEach(function (f) { (lances[f] = lances[f] || []).push(m); });
});

/* ----------------------------------------------------- declarations « hors chaine » */
var DECLARE = path.join(TOOLS, "hors-chaine.json");
var declare = {};
if (fs.existsSync(DECLARE)) {
  try { declare = JSON.parse(fs.readFileSync(DECLARE, "utf8")); }
  catch (e) { console.error("hors-chaine.json illisible : " + e.message); }
}

/* ------------------------------------------------------------------ familles */
function famille(f) {
  var base = f.split("/").pop();
  if (base === "verif.js" || base === "recense-chaine.js") return "chaine";
  if (/-mutations\.js$/.test(base) || /^preuve-injection\.js$/.test(base)) return "mutation";
  if (/^verif-/.test(base) || /^verif-verite\.js$/.test(base)) return "verificateur";
  if (/^wf-/.test(base)) return "generateur";
  if (/^build-/.test(base)) return "generateur";
  if (/^mesure-/.test(base) || /^releve-/.test(base) || /^sonde-/.test(base) ||
      /^conso-/.test(base) || /^usage-/.test(base) || /^prediction-/.test(base) ||
      /^calibrer\.js$/.test(base)) return "mesure";
  if (/^gen\.js$/.test(base) || /^appliquer\.js$/.test(base)) return "generateur";
  return "autre";
}

var lignes = tous.map(function (f) {
  return {
    fichier: f,
    famille: famille(f),
    modes: lances[f] || [],
    dansChaine: !!lances[f],
    declare: declare[f] || null,
  };
});

if (JSON_MODE) {
  console.log(JSON.stringify({ tools: lignes, parMode: parMode }, null, 2));
  process.exit(0);
}

/* -------------------------------------------------------------------- rapport */
console.log("recense-chaine.js — " + tous.length + " fichiers .js sous tools/\n");
Object.keys(parMode).forEach(function (m) {
  console.log("  verif.js " + (m === "(defaut)" ? "(sans option)" : m) + " lance " + parMode[m].length + " etape(s)");
});

var verifs = lignes.filter(function (l) { return l.famille === "verificateur"; });
var horsVerifs = verifs.filter(function (l) { return !l.dansChaine; });
var mutations = lignes.filter(function (l) { return l.famille === "mutation"; });
var horsMut = mutations.filter(function (l) { return !l.dansChaine; });

console.log("\n  verificateurs           : " + verifs.length + "  (hors chaine : " + horsVerifs.length + ")");
console.log("  epreuves par injection  : " + mutations.length + "  (hors chaine : " + horsMut.length + ")");
console.log("  generateurs / mesures   : " + lignes.filter(function (l) { return l.famille === "generateur" || l.famille === "mesure"; }).length);

function bloc(titre, sel) {
  var l = lignes.filter(sel);
  if (!l.length) return;
  console.log("\n" + titre + " (" + l.length + ")");
  l.forEach(function (x) {
    var etat = x.dansChaine ? "chaine [" + x.modes.join(" ") + "]" : (x.declare ? "hors chaine assume" : "HORS CHAINE, non declare");
    console.log("  " + (x.fichier + "                                        ").slice(0, 44) + " " + etat);
  });
}
bloc("-- verificateurs --", function (l) { return l.famille === "verificateur"; });
bloc("-- epreuves par injection --", function (l) { return l.famille === "mutation"; });

var aRegler = horsVerifs.filter(function (l) { return !l.declare; }).length +
              horsMut.filter(function (l) { return !l.declare; }).length;
console.log("\n  a regler (ni dans un mode, ni declare hors chaine) : " + aRegler);
process.exit(0);
