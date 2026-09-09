/* =============================================================================
   chrome-absent.js — ce que rendent les outils qui pilotent Chrome quand Chrome
   n'est pas la.

   POURQUOI CET OUTIL EXISTE (point A7 du chantier V17, 2026-09-09). Seize outils
   du projet commencaient par :

       if (!CHROME) { console.log('Chrome introuvable, rien de mesure.'); process.exit(0); }

   Code 0, c'est-a-dire OK, c'est-a-dire « tout va bien » — alors qu'aucune page
   n'a ete ouverte. Sur une machine sans Chrome, `node tools/verif.js --complet`
   annoncait donc seize etapes vertes qui n'avaient rien regarde. C'est
   exactement la forme du defaut qui fonde le chantier V17 : un controle vert qui
   occupe la place d'un controle. Depuis le point A5, la chaine sait dire NON
   MESURE (code 2) : ces sorties doivent donc rendre 2.

   COMMENT IL S'Y PREND, sans modifier une seule ligne des outils juges. Il lance
   le VRAI fichier, dans un processus node ou `fs.existsSync` a ete rendu aveugle
   aux seuls chemins qui contiennent « chrome » ou « chromium ». L'outil juge
   n'est donc ni recopie ni retouche : c'est bien lui qui s'execute, avec la
   seule faute injectee que l'on veut eprouver.

   DEUX MOITIES, et les deux comptent :
     - EPREUVE      : Chrome rendu introuvable -> l'outil doit sortir en 2.
     - CONTRE-EPREUVE (--contre) : Chrome present -> l'outil ne doit PAS se
       plaindre de Chrome. Elle demarre chaque outil pour de vrai et le tue au
       bout de quelques secondes : on ne juge pas son verdict (il prendrait des
       minutes), seulement qu'il n'est pas sorti sur « Chrome introuvable ».

   USAGE
     node tools/preuves/chrome-absent.js            # l'epreuve (rapide)
     node tools/preuves/chrome-absent.js --contre   # + la contre-epreuve
     node tools/preuves/chrome-absent.js --detail   # + la sortie de chaque outil

   CODE DE SORTIE : 0 si tous les outils rendent 2 sans Chrome ; 1 si l'un rend
   autre chose (0 = le mensonge d'origine, ou 1 = une faute inventee) ; 2 si
   l'epreuve elle-meme n'a pas pu tourner.
   ============================================================================= */
"use strict";

var fs = require("fs");
var os = require("os");
var path = require("path");
var cp = require("child_process");

var TOOLS = path.join(__dirname, "..");
var DETAIL = process.argv.indexOf("--detail") !== -1;
var CONTRE = process.argv.indexOf("--contre") !== -1;

/* Tout outil du projet qui cherche un binaire Chrome. La liste est EXPLICITE et
   non devinee : une detection ecrite autrement (variable d'environnement, autre
   nom de binaire) ne serait pas vue par un grep, et on prefere une liste qu'on
   relit a un balayage qui rate en silence. `args` sert aux outils dont la partie
   Chrome n'est atteinte que sur demande. */
var CIBLES = [
  { f: "preuve-hors-reseau.js", args: ["index.html"] },
  { f: "verif-clic.js", args: [] },
  { f: "verif-execution.js", args: [] },
  { f: "verif-execution-liens.js", args: [] },
  { f: "verif-rendu.js", args: [] },
  { f: "verif-stockage.js", args: [] },
  { f: "sonde-parcours.js", args: [] },
  { f: "verif-interpreteur.js", args: ["--navigateur"] },
  { f: "doc/verif-lexique-clic.js", args: [] },
  { f: "fraicheur/verif-affichage.js", args: [] },
  { f: "maths/module-3/verif-cours-progression.js", args: [] },
  { f: "maths/module-4/verif-cours-progression.js", args: [] },
  { f: "maths/module-5/verif-bilan.js", args: [] },
  { f: "maths/module-5/verif-cours-progression.js", args: [] },
  { f: "preuves/decodeur.js", args: [] },
  { f: "preuves/decodeur-lecons.js", args: [] },
  { f: "preuves/erreurs-sql.js", args: [] },
  { f: "preuves/etude-euclide.js", args: [] },
  { f: "preuves/etude-inconnu.js", args: [] },
  { f: "preuves/etude-journal.js", args: [] },
  { f: "preuves/etude-moteur-exos.js", args: [] },
  { f: "preuves/etude-recherche.js", args: [] },
  { f: "preuves/etude-reecriture.js", args: [] },
  { f: "preuves/etudes-hub.js", args: [] },
  { f: "preuves/execution-ancres.js", args: [] },
  { f: "preuves/exos-code.js", args: ["pages/python/lecon-01.html"] },
  { f: "preuves/exos-texte.js", args: ["pages/python/lecon-01.html"] },
  { f: "preuves/python-lecon.js", args: ["pages/python/lecon-01.html"] },
  { f: "preuves/sql-lecon.js", args: ["pages/sql/lecon-01.html"] },
  { f: "preuves/sonde-clic-reseau.js", args: ["pages/js/lecon-24.html#8"] }
];

/* -------------------------------------------------- le lanceur qui aveugle fs */
var LANCEUR = [
  '"use strict";',
  'var fs = require("fs");',
  'var vrai = fs.existsSync;',
  'fs.existsSync = function (p) {',
  '  var s = String(p).toLowerCase();',
  '  if (s.indexOf("chrome") !== -1 || s.indexOf("chromium") !== -1) return false;',
  '  return vrai.apply(fs, arguments);',
  '};',
  '/* Le PATH aussi : un outil pourrait chercher le binaire ailleurs. */',
  'process.env.CHROME_PATH = "";',
  'process.argv = [process.argv[0], process.argv[2]].concat(process.argv.slice(3));',
  'require(process.argv[1]);'
].join("\n");

var lanceurFichier = path.join(os.tmpdir(), "chrome-absent-lanceur-" + process.pid + ".js");
try { fs.writeFileSync(lanceurFichier, LANCEUR, "utf8"); }
catch (e) {
  console.error("chrome-absent : impossible d'ecrire le lanceur — " + e.message);
  process.exit(2);
}

function nettoyer() { try { fs.unlinkSync(lanceurFichier); } catch (e) { /* rien */ } }

/* -------------------------------------------------- l'epreuve */
console.log("chrome-absent.js — " + CIBLES.length + " outils qui pilotent Chrome, lances SANS Chrome");
console.log("  attendu pour chacun : code 2 (NON MESURE), jamais 0 (« tout va bien »)\n");

var t0 = Date.now();
var fautifs = [];
var absents = [];
var bons = 0;

CIBLES.forEach(function (c) {
  var abs = path.join(TOOLS, c.f);
  if (!fs.existsSync(abs)) { absents.push(c.f); console.log("[ABSENT ] " + c.f); return; }
  var r = cp.spawnSync(process.execPath, [lanceurFichier, abs].concat(c.args),
    { encoding: "utf8", cwd: path.join(TOOLS, ".."), timeout: 60000, maxBuffer: 32 * 1024 * 1024 });
  var sortie = String(r.stdout || "") + String(r.stderr || "");
  var code = r.status;
  var etat = code === 2 ? "  ok  " : "MENSONGE";
  if (code === 2) bons++;
  else fautifs.push({ f: c.f, code: code, sortie: sortie.trim().split("\n").slice(-3).join(" / ") });
  console.log("[" + etat + "] " + c.f + "  — code " + (code === null ? "(tue au bout de 60 s)" : code));
  if (DETAIL) sortie.trim().split("\n").slice(0, 6).forEach(function (l) { console.log("           " + l); });
});

/* -------------------------------------------------- la contre-epreuve */
var contreFautifs = [];
if (CONTRE) {
  console.log("\n--- contre-epreuve : Chrome present, aucun outil ne doit se plaindre de Chrome ---");
  CIBLES.forEach(function (c) {
    var abs = path.join(TOOLS, c.f);
    if (!fs.existsSync(abs)) return;
    var r = cp.spawnSync(process.execPath, [abs].concat(c.args),
      { encoding: "utf8", cwd: path.join(TOOLS, ".."), timeout: 8000, maxBuffer: 32 * 1024 * 1024 });
    var sortie = String(r.stdout || "") + String(r.stderr || "");
    var plaint = /Chrome introuvable/i.test(sortie);
    if (plaint) contreFautifs.push(c.f);
    console.log("[" + (plaint ? "PLAINTE" : "  ok  ") + "] " + c.f +
      (r.status === null ? "  (encore au travail au bout de 8 s : c'est bon signe)" : "  — code " + r.status));
  });
}

nettoyer();

/* -------------------------------------------------- bilan */
var ms = Date.now() - t0;
console.log("\n=== BILAN ===");
console.log("  outils eprouves ............. " + (CIBLES.length - absents.length));
console.log("  rendent bien 2 sans Chrome .. " + bons);
console.log("  mentent (0 ou 1) ............ " + fautifs.length +
  (fautifs.length ? " : " + fautifs.map(function (x) { return x.f + " (code " + x.code + ")"; }).join(", ") : ""));
if (absents.length) console.log("  fichiers introuvables ....... " + absents.length + " : " + absents.join(", "));
if (CONTRE) console.log("  plaintes Chrome a tort ...... " + contreFautifs.length +
  (contreFautifs.length ? " : " + contreFautifs.join(", ") : ""));
console.log("  duree ....................... " + (ms / 1000).toFixed(1) + " s\n");

if (absents.length) { console.log("RESULTAT : EPREUVE INCOMPLETE (fichier declare introuvable)"); process.exit(2); }
if (fautifs.length || contreFautifs.length) { console.log("RESULTAT : " + (fautifs.length + contreFautifs.length) + " OUTIL(S) EN FAUTE"); process.exit(1); }
console.log("RESULTAT : 0 EN FAUTE — sans Chrome, tous disent NON MESURE");
