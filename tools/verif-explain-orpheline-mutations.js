/* =============================================================================
   verif-explain-orpheline-mutations.js — l'EPREUVE de mesure-explain-orpheline.

   POURQUOI. Un controle qui n'a jamais echoue ne prouve rien : il peut etre vert
   parce que le site est sain, ou vert parce qu'il est aveugle. La chaine du projet
   double donc chaque cliquet d'une epreuve par MUTATION : on injecte le defaut dans
   un bac a sable, et le controle DOIT le voir. Le premier jet de l'outil surveille
   ici a d'ailleurs ete jete parce qu'une epreuve — rejouer les deux cas historiques
   de `kotlin` restaures depuis git — a montre qu'il n'en voyait aucun.

   COMMENT. Le bac a sable est un dossier temporaire qui MIME la racine du depot
   (`<bac>/tools` + `<bac>/pages/<cours>`), pour que le `__dirname/..` de l'outil y
   pointe. Il reste A L'INTERIEUR du depot, si bien que `git show` continue de
   resoudre les references : c'est ce qui permet de comparer le disque mute a HEAD.

   LES QUATRE EPREUVES
     1. TEMOIN NEGATIF — pages intactes : l'outil doit rendre 0 orpheline (code 0).
     2. MUTATION — on efface d'une option le nom de code que l'explain cite, sans
        toucher l'explain : l'outil DOIT le signaler (code 1).
     3. CAS HISTORIQUE — les deux orphelines reelles de `kotlin` (etat 5b37b6b,
        contre l'etat d'avant sa vague 5ccb51e) : l'outil doit en rendre EXACTEMENT
        deux.
     4. GARDE-FOU cmd.exe — `--depuis=<sha>^` sous Windows perd l'accent
        circonflexe ; l'outil doit REFUSER de tourner (code 2) plutot que d'annoncer
        « 0 option a change ».

   USAGE
     node tools/verif-explain-orpheline-mutations.js
   ============================================================================= */

var fs = require("fs");
var path = require("path");
var cp = require("child_process");
var os = require("os");

var RACINE = path.join(__dirname, "..");
var OUTIL = path.join(__dirname, "mesure-explain-orpheline.js");
var COURS_HISTORIQUE = "kotlin";
var AVANT_VAGUE = "5ccb51e";   /* etat d'avant la vague d'ecriture de kotlin */
var APRES_VAGUE = "5b37b6b";   /* etat d'apres la vague, AVANT la demolition */

var echecs = [];
var faits = [];

function lancer(bac, args) {
  var r = cp.spawnSync(process.execPath, [path.join(bac, "tools", "mesure-explain-orpheline.js")].concat(args),
    { cwd: bac, encoding: "utf8" });
  return { code: r.status, sortie: (r.stdout || "") + (r.stderr || "") };
}

function bacNeuf() {
  var bac = fs.mkdtempSync(path.join(RACINE, "scratchpad", "epreuve-orph-"));
  fs.mkdirSync(path.join(bac, "tools"), { recursive: true });
  fs.mkdirSync(path.join(bac, "pages"), { recursive: true });
  fs.copyFileSync(OUTIL, path.join(bac, "tools", "mesure-explain-orpheline.js"));
  return bac;
}

function copierCoursDepuisGit(bac, cours, ref) {
  var dst = path.join(bac, "pages", cours);
  fs.mkdirSync(dst, { recursive: true });
  var liste = cp.execFileSync("git", ["ls-tree", "--name-only", ref + ":pages/" + cours],
    { cwd: RACINE, encoding: "utf8" }).trim().split("\n");
  liste.filter(function (f) { return /^lecon-\d+\.html$/.test(f); }).forEach(function (f) {
    var t = cp.execFileSync("git", ["show", ref + ":pages/" + cours + "/" + f],
      { cwd: RACINE, encoding: "utf8", maxBuffer: 32 * 1024 * 1024 });
    fs.writeFileSync(path.join(dst, f), t);
  });
}

function nettoyer(bac) { fs.rmSync(bac, { recursive: true, force: true }); }

function verdict(nom, ok, detail) {
  faits.push((ok ? "  OK    " : "  ECHEC ") + nom + (detail ? "   — " + detail : ""));
  if (!ok) echecs.push(nom + (detail ? " : " + detail : ""));
}

/* ------------------------------------------------- 3. le cas historique d'abord */
(function epreuveHistorique() {
  var bac = bacNeuf();
  try {
    copierCoursDepuisGit(bac, COURS_HISTORIQUE, APRES_VAGUE);
    var r = lancer(bac, ["--depuis=" + AVANT_VAGUE, "--seul=" + COURS_HISTORIQUE]);
    var m = r.sortie.match(/^\s*(\d+) EXPLICATION/m);
    var n = m ? Number(m[1]) : 0;
    verdict("les DEUX orphelines historiques de kotlin sont retrouvees", n === 2 && r.code === 1,
      "rendu : " + n + " orpheline(s), code " + r.code);
  } finally { nettoyer(bac); }
})();

/* ---------------------------------------- 1 et 2. temoin negatif, puis mutation */
(function epreuveMutation() {
  var bac = bacNeuf();
  try {
    /* on repart de l'etat d'APRES la demolition : plus aucune orpheline connue */
    copierCoursDepuisGit(bac, COURS_HISTORIQUE, "HEAD");
    var temoin = lancer(bac, ["--depuis=HEAD", "--travail", "--seul=" + COURS_HISTORIQUE]);
    verdict("temoin negatif : pages intactes, aucune orpheline", temoin.code === 0,
      "code " + temoin.code);

    /* MUTATION : on cherche une question dont l'explain cite un nom de code present
       dans UNE seule option, et on efface ce nom de l'option — l'explain, lui, reste
       intouche. C'est exactement le geste d'une vague de reecriture.

       ⚠️ Le nom doit etre ABSENT du corps de la page : l'outil ecarte deliberement le
       vocabulaire que la lecon enseigne, une explication ayant le droit de le nommer.
       Le premier jet de cette epreuve mutait `ensureActive`, enseigne par sa propre
       page, et en concluait a tort que l'outil etait aveugle.

       ⚠️ Et le cours temoin ne suffit pas : apres sa demolition, `kotlin` n'offre
       plus une seule question mutable. On balaie donc plusieurs cours jusqu'au
       premier cas — l'epreuve doit prouver la DETECTION, peu importe ou. */
    var mute = null;
    ["kotlin", "rust", "js", "nodejs", "python", "go", "java"].some(function (co) {
      var dossier = path.join(bac, "pages", co);
      if (!fs.existsSync(dossier)) copierCoursDepuisGit(bac, co, "HEAD");
      return fs.readdirSync(dossier).some(function (f) {
        var html = fs.readFileSync(path.join(dossier, f), "utf8");
        var corpsPage = html.replace(/<script[^>]*type="application\/json"[^>]*>[\s\S]*?<\/script>/g, " ").toLowerCase();
        var blocs = html.match(/<script[^>]*type="application\/json"[^>]*>[\s\S]*?<\/script>/g) || [];
        return blocs.some(function (b) {
          if (/data-exos/.test(b)) return false;
          var corps = b.replace(/<script[^>]*>/, "").replace(/<\/script>/, "");
          var v; try { v = JSON.parse(corps); } catch (e) { return false; }
          if (!Array.isArray(v)) return false;
          var change = false;
          v.forEach(function (it) {
            if (change || !it || !Array.isArray(it.a) || !it.explain) return;
            var t = String(it.explain);
            var noms = []
              .concat(t.match(/[A-Za-z_][A-Za-z0-9_]{4,}\(/g) || [])
              .map(function (x) { return x.replace(/\($/, ""); })
              .concat(t.match(/[A-Za-z_][A-Za-z0-9_]*(?:\.[A-Za-z_][A-Za-z0-9_]+)+/g) || [])
              .concat(t.match(/\b[a-z]+[A-Z][A-Za-z0-9]{3,}\b/g) || []);
            noms.some(function (nom) {
              if (nom.length < 5) return false;
              if (corpsPage.indexOf(nom.toLowerCase()) !== -1) return false;
              var porteuses = it.a.filter(function (o) { return String(o).indexOf(nom) !== -1; });
              if (porteuses.length !== 1) return false;
              var i = it.a.indexOf(porteuses[0]);
              it.a[i] = String(it.a[i]).split(nom).join("cetteChose");
              mute = { cours: co, fichier: f, nom: nom };
              change = true;
              return true;
            });
          });
          if (!change) return false;
          var neuf = b.replace(corps, "\n" + JSON.stringify(v, null, 2) + "\n");
          fs.writeFileSync(path.join(dossier, f), html.split(b).join(neuf));
          return true;
        });
      });
    });

    if (!mute) {
      verdict("mutation : une orpheline injectee est DETECTEE", false,
        "aucune question mutable trouvee dans les cours temoins");
    } else {
      var r = lancer(bac, ["--depuis=HEAD", "--travail", "--seul=" + mute.cours]);
      var m = r.sortie.match(/^\s*(\d+) EXPLICATION/m);
      var n = m ? Number(m[1]) : 0;
      verdict("mutation : une orpheline injectee est DETECTEE", n >= 1 && r.code === 1,
        mute.nom + " efface de " + mute.cours + "/" + mute.fichier + " -> " + n + " signalement(s), code " + r.code);
    }
  } finally { nettoyer(bac); }
})();

/* --------------------------------------------------- 4. le garde-fou de cmd.exe */
(function epreuveGardeFou() {
  var r = cp.spawnSync(process.execPath, [OUTIL, "--depuis=HEAD", "--seul=" + COURS_HISTORIQUE],
    { cwd: RACINE, encoding: "utf8" });
  verdict("garde-fou : une reference qui resout sur HEAD est REFUSEE", r.status === 2,
    "code " + r.status);
})();

console.log("verif-explain-orpheline-mutations — l'epreuve de mesure-explain-orpheline");
console.log("");
faits.forEach(function (l) { console.log(l); });
console.log("");
if (echecs.length) {
  console.log(echecs.length + " EPREUVE(S) EN ECHEC : le controle ne prouve plus ce qu'il annonce.");
  process.exit(1);
}
console.log(faits.length + " epreuves tenues — le controle est capable d'echouer.");
