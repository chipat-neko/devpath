/* =============================================================================
   verif-git-commandes.js — les COMMANDES du bac a sable (js/git-commandes.js,
   chantier V14 point D2) confrontees au VRAI git. Node pur, ZERO dependance.

   POURQUOI CET OUTIL EXISTE
   Le modele (D1) a ete valide de cette facon-la : 166 comparaisons contre git,
   0 ecart, et 29 fautes injectees toutes vues. Les commandes meritent le meme
   traitement, en plus severe encore : une commande ne rend pas seulement une
   empreinte, elle rend AUSSI un texte que l'apprenant va lire et croire. Un
   « Fast-forward » affiche la ou git ecrit « Merge made by the 'ort' strategy »
   enseignerait un git qui n'existe pas.

   COMMENT
   Chaque scenario est une suite d'actions — ecrire un fichier, taper une
   commande. La MEME suite est jouee des deux cotes : dans le modele, et dans un
   vrai depot git temporaire. Apres CHAQUE commande on compare six choses :
     1. la sortie, ligne a ligne (stdout + stderr, avec les hint: retires) ;
     2. la reussite (code 0 ou non) ;
     3. `git status --porcelain` ;
     4. HEAD : son oid, et s'il est attache, la branche ;
     5. toutes les references (git show-ref) ;
     6. le contenu de CHAQUE fichier du repertoire de travail, marqueurs de
        conflit compris.

   LES DATES SONT FIXEES DES DEUX COTES (pasHorloge = 0 dans le modele,
   GIT_AUTHOR_DATE / GIT_COMMITTER_DATE dans l'environnement) : sans cela les
   empreintes ne seraient pas comparables et l'outil ne prouverait rien.

   CODE DE SORTIE : 0 tout concorde, 1 un ecart, 2 git absent (etape sautee).
   ============================================================================= */
"use strict";

var cp = require("child_process");
var fs = require("fs");
var os = require("os");
var path = require("path");

var argModele = process.argv.slice(2).filter(function (a) { return a.indexOf("--commandes=") === 0; })[0];
var CHEMIN_CMD = argModele ? argModele.slice(12) : path.join(__dirname, "..", "js", "git-commandes.js");
var GC = require(path.resolve(CHEMIN_CMD));
var GM = require(path.join(__dirname, "..", "js", "git-modele.js"));

var SEUL = (process.argv.slice(2).filter(function (a) { return a.indexOf("--scenario=") === 0; })[0] || "").slice(11);
var BAVARD = process.argv.indexOf("--bavard") >= 0;
/* `--vite` : s'arreter au PREMIER ecart. Sert a la passe de mutation, qui joue
   l'outil des dizaines de fois et n'a besoin que de savoir s'il rougit. */
var VITE = process.argv.indexOf("--vite") >= 0;

var IDENTITE_NOM = "Apprenant";
var IDENTITE_MAIL = "apprenant@syntaxe.invalid";
var IDENTITE = IDENTITE_NOM + " <" + IDENTITE_MAIL + ">";
var INSTANT = 1704067200;                       // 1er janvier 2024, 00:00:00 UTC
/* DEUX dates, reglables separement en cours de scenario : `git commit --amend`
   CONSERVE la date d'auteur et renouvelle celle du committeur. En imposant les
   deux par l'environnement, on empechait git de le montrer. */
var DATE_AUTEUR = INSTANT + " +0000";
var DATE_COMMITTEUR = INSTANT + " +0000";

var comparaisons = 0;
var ecarts = [];
var contexteCourant = "";

function ArretVite() { this.vite = true; }

function compare(quoi, attenduGit, obtenuModele) {
  comparaisons++;
  if (String(attenduGit) !== String(obtenuModele)) {
    ecarts.push({ ou: contexteCourant, quoi: quoi, git: String(attenduGit), modele: String(obtenuModele) });
    if (VITE) throw new ArretVite();
  }
}

/* --- le vrai git ----------------------------------------------------------- */

var CHEMIN_CONFIG_VIDE = null;
function configVide() {
  if (!CHEMIN_CONFIG_VIDE) {
    CHEMIN_CONFIG_VIDE = path.join(fs.mkdtempSync(path.join(os.tmpdir(), "syntaxe-gitconf-")), "config-vide");
    fs.writeFileSync(CHEMIN_CONFIG_VIDE, "", "utf8");
  }
  return CHEMIN_CONFIG_VIDE;
}

function env() {
  return Object.assign({}, process.env, {
    GIT_AUTHOR_NAME: IDENTITE_NOM,
    GIT_AUTHOR_EMAIL: IDENTITE_MAIL,
    GIT_COMMITTER_NAME: IDENTITE_NOM,
    GIT_COMMITTER_EMAIL: IDENTITE_MAIL,
    GIT_AUTHOR_DATE: DATE_AUTEUR,
    GIT_COMMITTER_DATE: DATE_COMMITTEUR,
    GIT_CONFIG_GLOBAL: configVide(),
    GIT_CONFIG_SYSTEM: configVide(),
    GIT_MERGE_AUTOEDIT: "no",
    LC_ALL: "C"
  });
}

function gitBrut(dir, args) {
  var r = cp.spawnSync("git", ["-C", dir].concat(args), { env: env(), encoding: "utf8", maxBuffer: 8 * 1024 * 1024 });
  return { code: r.status, sortie: (r.stdout || "") + (r.stderr || "") };
}

function gitLu(dir, args) {
  var r = gitBrut(dir, args);
  return r.sortie.replace(/\r/g, "").replace(/\n$/, "");
}

function creerDepotReel(branche) {
  var dir = fs.mkdtempSync(path.join(os.tmpdir(), "syntaxe-gitc-"));
  cp.execFileSync("git", ["init", "-q", "-b", branche || "main", dir], { env: env() });
  gitBrut(dir, ["config", "core.autocrlf", "false"]);
  gitBrut(dir, ["config", "core.filemode", "false"]);
  gitBrut(dir, ["config", "core.safecrlf", "false"]);
  gitBrut(dir, ["config", "advice.detachedHead", "false"]);
  gitBrut(dir, ["config", "merge.conflictStyle", "merge"]);
  return dir;
}

/* --- normalisation des sorties ---------------------------------------------
   Les `hint:` et les `warning:` sont des conseils qui varient d'une version de
   git a l'autre, et la barre de progression de rebase ecrit des retours chariot.
   On compare ce qui EST la commande, pas l'aide en ligne. */
function normaliser(texte) {
  return texte
    .replace(/\r/g, "\n")
    .split("\n")
    .filter(function (l) {
      if (/^hint:/.test(l)) return false;
      if (/^warning:/.test(l)) return false;
      if (/^Rebasing \(\d+\/\d+\)$/.test(l)) return false;
      if (/^Auto-packing|^Counting objects|^Compressing/.test(l)) return false;
      return true;
    })
    .join("\n")
    .replace(/\n{2,}$/, "\n")
    .replace(/\n$/, "");
}

/* --- l'etat des deux cotes, compare ---------------------------------------- */

function fichiersDisque(dir, prefixe, sortie) {
  prefixe = prefixe || "";
  sortie = sortie || {};
  var entrees = fs.readdirSync(path.join(dir, prefixe), { withFileTypes: true });
  for (var i = 0; i < entrees.length; i++) {
    var e = entrees[i];
    if (e.name === ".git") continue;
    var rel = prefixe ? prefixe + "/" + e.name : e.name;
    if (e.isDirectory()) fichiersDisque(dir, rel, sortie);
    else sortie[rel] = fs.readFileSync(path.join(dir, rel.split("/").join(path.sep)), "utf8");
  }
  return sortie;
}

function comparerEtat(dir, depot) {
  /* HEAD */
  var teteGit = gitLu(dir, ["rev-parse", "HEAD"]);
  if (/^fatal|unknown revision|ambiguous/.test(teteGit)) teteGit = "";
  compare("HEAD (oid)", teteGit, depot.oidHEAD() || "");

  var symGit = gitLu(dir, ["symbolic-ref", "-q", "HEAD"]);
  if (/^fatal|^$/.test(symGit)) symGit = "";
  compare("HEAD (branche)", symGit, depot.HEAD.symbolique || "");

  /* toutes les references */
  var refsGit = gitLu(dir, ["show-ref"]).split("\n").filter(Boolean).map(function (l) {
    var m = l.split(" ");
    return m[1] + " " + m[0];
  }).sort().join(" | ");
  var refsModele = [];
  for (var r in depot.refs) {
    if (!Object.prototype.hasOwnProperty.call(depot.refs, r)) continue;
    refsModele.push(r + " " + depot.refs[r]);
  }
  compare("references", refsGit, refsModele.sort().join(" | "));

  /* statut court */
  var statutGit = gitLu(dir, ["status", "--porcelain"]).split("\n").filter(Boolean).sort().join(" | ");
  var statutModele = GC.commandes.status(depot, ["--porcelain"]).sortie.slice().sort().join(" | ");
  compare("status --porcelain", statutGit, statutModele);

  /* repertoire de travail, fichier par fichier */
  var surDisque = fichiersDisque(dir);
  var cheminsGit = Object.keys(surDisque).sort();
  var cheminsModele = depot.cheminsTravail().slice().sort();
  compare("fichiers du repertoire de travail", cheminsGit.join(" | "), cheminsModele.join(" | "));
  for (var k = 0; k < cheminsGit.length; k++) {
    var c = cheminsGit[k];
    compare("contenu de " + c, JSON.stringify(surDisque[c].replace(/\r\n/g, "\n")), JSON.stringify(depot.lireFichier(c)));
  }

  /* l'arbre de HEAD : la preuve que le CONTENU commite est le meme */
  if (teteGit) {
    compare("arbre de HEAD", gitLu(dir, ["rev-parse", "HEAD^{tree}"]), depot.lireCommit(depot.oidHEAD()).arbre);
  }
}

/* --- jouer un scenario ------------------------------------------------------ */

function jouer(scenario) {
  /* Chaque scenario repart de la meme horloge : sans cela, un scenario qui
     avance les dates contamine tous les suivants. */
  DATE_AUTEUR = INSTANT + " +0000";
  DATE_COMMITTEUR = INSTANT + " +0000";
  var branche = scenario.branche || "main";
  var dir = creerDepotReel(branche);
  var depot = new GM.Depot({ identite: IDENTITE, branche: branche, instant: INSTANT, pasHorloge: 0, fuseau: "+0000" });
  var actions = scenario.actions;

  for (var i = 0; i < actions.length; i++) {
    var a = actions[i];
    contexteCourant = scenario.nom + " #" + (i + 1);

    if (a.ecrire) {
      var complet = path.join(dir, a.ecrire[0].split("/").join(path.sep));
      fs.mkdirSync(path.dirname(complet), { recursive: true });
      fs.writeFileSync(complet, a.ecrire[1], "utf8");
      depot.ecrireFichier(a.ecrire[0], a.ecrire[1]);
      continue;
    }
    /* ⚠️ Faire AVANCER l'horloge des deux côtés à la fois. Sans cela, toutes les
       dates sont égales et une date d'auteur perdue par un rebasage produirait
       exactement la même empreinte : la faute serait invisible. */
    /* Une branche ORPHELINE : le bac à sable ne sait pas la créer (dette
       assumée), mais la fusion de deux histoires sans ancêtre commun doit être
       vérifiable. On la monte donc des deux côtés, à la main. */
    if (a.orphelin) {
      gitBrut(dir, ["checkout", "--orphan", a.orphelin]);
      gitBrut(dir, ["rm", "-rf", "--cached", "."]);
      var surDisqueO = fichiersDisque(dir);
      for (var oc in surDisqueO) {
        if (!Object.prototype.hasOwnProperty.call(surDisqueO, oc)) continue;
        try { fs.unlinkSync(path.join(dir, oc.split("/").join(path.sep))); } catch (e) { /* rien */ }
      }
      depot.HEAD = { symbolique: "refs/heads/" + a.orphelin, oid: null };
      depot.index = GM.dico();
      depot.travail = GM.dico();
      continue;
    }
    if (a.instant) {
      DATE_AUTEUR = a.instant + " +0000";
      DATE_COMMITTEUR = a.instant + " +0000";
      depot.instant = a.instant;
      continue;
    }
    /* Avancer SEULEMENT l'horloge du committeur : c'est ce que fait la vraie vie
       quand on corrige un commit ecrit la veille. */
    if (a.instantCommit) {
      DATE_COMMITTEUR = a.instantCommit + " +0000";
      depot.instant = a.instantCommit;
      continue;
    }
    if (a.supprimer) {
      try { fs.unlinkSync(path.join(dir, a.supprimer.split("/").join(path.sep))); } catch (e) { /* deja absent */ }
      depot.supprimerFichier(a.supprimer);
      continue;
    }

    var ligne = a.git;
    contexteCourant = scenario.nom + " #" + (i + 1) + " — git " + ligne;
    var mots = GC.decouperLigne(ligne);
    var reelle = gitBrut(dir, mots);
    var modele = GC.executer(depot, ["git"].concat(mots));

    if (BAVARD) {
      console.log("\n--- " + contexteCourant);
      console.log("  git    : " + JSON.stringify(normaliser(reelle.sortie)));
      console.log("  modele : " + JSON.stringify(modele.sortie.join("\n")));
    }

    if (a.sortie !== false) {
      compare("sortie", normaliser(reelle.sortie), normaliser(modele.sortie.join("\n")));
    }
    if (a.code !== false) {
      compare("reussite", reelle.code === 0 ? "ok" : "echec", modele.ok ? "ok" : "echec");
    }
    comparerEtat(dir, depot);
  }

  /* le journal complet, a la fin : l'ordre ET les empreintes */
  contexteCourant = scenario.nom + " — journal";
  if (depot.oidHEAD()) {
    compare("git log --oneline", gitLu(dir, ["log", "--oneline", "--no-abbrev-commit", "--format=%H %s"]),
      depot.journal().map(function (c) { return c.oid + " " + c.titre; }).join("\n"));
  }

  /* menage : sous Windows, git laisse des fichiers en lecture seule */
  try { fs.rmSync(dir, { recursive: true, force: true, maxRetries: 3 }); } catch (e) { /* le temporaire survivra */ }
}

/* ===========================================================================
   LES SCENARIOS
   Chacun vise une chose que le cours `git` enseigne et qu'un simulateur peut
   fausser sans qu'on s'en apercoive a la lecture.
   =========================================================================== */

var SCENARIOS = [
  {
    nom: "cycle-de-base",
    actions: [
      { git: "status" },
      { ecrire: ["notes.txt", "premiere ligne\n"] },
      { git: "status" },
      { git: "add notes.txt" },
      { git: "status" },
      { git: 'commit -m "premier commit"' },
      { git: "status" },
      { ecrire: ["notes.txt", "premiere ligne\ndeuxieme ligne\n"] },
      { ecrire: ["lib/util.txt", "outil\n"] },
      { git: "status" },
      { git: "add ." },
      { git: 'commit -m "deuxieme commit"' },
      { git: "log --oneline" },
      { git: 'commit -m "rien a faire"' },
      { git: "status" }
    ]
  },
  {
    nom: "index-et-travail",
    actions: [
      { ecrire: ["a.txt", "A1\n"] },
      { ecrire: ["b.txt", "B1\n"] },
      { git: "add ." },
      { git: 'commit -m "socle"' },
      { ecrire: ["a.txt", "A2\n"] },
      { git: "add a.txt" },
      { ecrire: ["a.txt", "A3\n"] },
      { git: "status" },
      { git: "status --porcelain" },
      { git: 'commit -m "seul A2 est fige"' },
      { git: "status" },
      { supprimer: "b.txt" },
      { git: "status" },
      { git: "add ." },
      { git: "status" },
      { git: 'commit -m "suppression"' }
    ]
  },
  {
    nom: "branches",
    actions: [
      { ecrire: ["r.txt", "racine\n"] },
      { git: "add ." },
      { git: 'commit -m "racine"' },
      { git: "branch travaux" },
      { git: "branch" },
      { git: "checkout travaux" },
      { ecrire: ["t.txt", "travaux\n"] },
      { git: "add ." },
      { git: 'commit -m "sur travaux"' },
      { git: "checkout main" },
      { git: "status" },
      { git: "branch -d travaux" },
      { git: "branch -D travaux" },
      { git: "branch" }
    ]
  },
  {
    nom: "avance-rapide",
    actions: [
      { ecrire: ["a.txt", "1\n"] },
      { git: "add ." },
      { git: 'commit -m "c1"' },
      { git: "checkout -b suite" },
      { ecrire: ["b.txt", "2\n"] },
      { git: "add ." },
      { git: 'commit -m "c2"' },
      { git: "checkout main" },
      { git: "merge suite" },
      { git: "log --oneline" },
      { git: "merge suite" }
    ]
  },
  {
    nom: "fusion-a-trois-voies",
    actions: [
      { ecrire: ["commun.txt", "ligne 1\nligne 2\nligne 3\n"] },
      { git: "add ." },
      { git: 'commit -m "base"' },
      { git: "checkout -b sujet" },
      { ecrire: ["sujet.txt", "cote sujet\n"] },
      { ecrire: ["commun.txt", "ligne 1\nligne 2\nligne 3 modifiee par sujet\n"] },
      { git: "add ." },
      { git: 'commit -m "travail sur sujet"' },
      { git: "checkout main" },
      { ecrire: ["principal.txt", "cote principal\n"] },
      { ecrire: ["commun.txt", "ligne 1 modifiee par main\nligne 2\nligne 3\n"] },
      { git: "add ." },
      { git: 'commit -m "travail sur main"' },
      { git: "merge sujet" },
      { git: "log --oneline" },
      { git: "status" }
    ]
  },
  {
    nom: "conflit-de-contenu",
    actions: [
      { ecrire: ["f.txt", "un\ndeux\ntrois\n"] },
      { git: "add ." },
      { git: 'commit -m "base"' },
      { git: "checkout -b autre" },
      { ecrire: ["f.txt", "un\nDEUX cote autre\ntrois\n"] },
      { git: "add ." },
      { git: 'commit -m "autre"' },
      { git: "checkout main" },
      { ecrire: ["f.txt", "un\nDEUX cote main\ntrois\n"] },
      { git: "add ." },
      { git: 'commit -m "main"' },
      { git: "merge autre" },
      { git: "status" },
      { git: "status --porcelain" },
      { ecrire: ["f.txt", "un\nDEUX resolu a la main\ntrois\n"] },
      { git: "add f.txt" },
      { git: "status" },
      { git: 'commit -m "Merge branch \'autre\'"' },
      { git: "log --oneline" }
    ]
  },
  {
    nom: "conflit-abandonne",
    actions: [
      { ecrire: ["f.txt", "base\n"] },
      { git: "add ." },
      { git: 'commit -m "base"' },
      { git: "checkout -b b2" },
      { ecrire: ["f.txt", "version b2\n"] },
      { git: "add ." },
      { git: 'commit -m "b2"' },
      { git: "checkout main" },
      { ecrire: ["f.txt", "version main\n"] },
      { git: "add ." },
      { git: 'commit -m "main"' },
      { git: "merge b2" },
      { git: "merge --abort" },
      { git: "status" },
      { git: "log --oneline" }
    ]
  },
  {
    nom: "conflit-modifie-supprime",
    actions: [
      { ecrire: ["f.txt", "contenu\n"] },
      { ecrire: ["g.txt", "autre\n"] },
      { git: "add ." },
      { git: 'commit -m "base"' },
      { git: "checkout -b sup" },
      { supprimer: "f.txt" },
      { git: "add ." },
      { git: 'commit -m "supprime f"' },
      { git: "checkout main" },
      { ecrire: ["f.txt", "contenu modifie\n"] },
      { git: "add ." },
      { git: 'commit -m "modifie f"' },
      { git: "merge sup" },
      { git: "status --porcelain" }
    ]
  },
  {
    nom: "reset",
    actions: [
      { ecrire: ["a.txt", "1\n"] },
      { git: "add ." },
      { git: 'commit -m "c1"' },
      { ecrire: ["a.txt", "2\n"] },
      { git: "add ." },
      { git: 'commit -m "c2"' },
      { ecrire: ["a.txt", "3\n"] },
      { git: "add ." },
      { git: 'commit -m "c3"' },
      { git: "reset --soft HEAD~1" },
      { git: "status --porcelain" },
      { git: 'commit -m "c3 refait"' },
      { git: "reset --mixed HEAD~1" },
      { git: "status --porcelain" },
      { git: "reset --hard HEAD~1" },
      { git: "status" },
      { git: "log --oneline" }
    ]
  },
  {
    nom: "reset-desindexer",
    actions: [
      { ecrire: ["a.txt", "1\n"] },
      { ecrire: ["b.txt", "1\n"] },
      { git: "add ." },
      { git: 'commit -m "socle"' },
      { ecrire: ["a.txt", "2\n"] },
      { ecrire: ["b.txt", "2\n"] },
      { git: "add ." },
      { git: "reset a.txt" },
      { git: "status --porcelain" },
      { git: 'commit -m "seul b"' },
      { git: "status --porcelain" }
    ]
  },
  {
    nom: "revert",
    actions: [
      { ecrire: ["a.txt", "1\n"] },
      { git: "add ." },
      { git: 'commit -m "c1"' },
      { ecrire: ["b.txt", "malencontreux\n"] },
      { git: "add ." },
      { git: 'commit -m "c2 a annuler"' },
      { ecrire: ["c.txt", "suite\n"] },
      { git: "add ." },
      { git: 'commit -m "c3"' },
      { git: "revert --no-edit HEAD~1" },
      { git: "log --oneline" },
      { git: "status" }
    ]
  },
  {
    nom: "cherry-pick",
    actions: [
      { ecrire: ["a.txt", "1\n"] },
      { git: "add ." },
      { git: 'commit -m "racine"' },
      { git: "checkout -b labo" },
      { ecrire: ["utile.txt", "morceau utile\n"] },
      { git: "add ." },
      { git: 'commit -m "le morceau utile"' },
      { ecrire: ["reste.txt", "pas encore pret\n"] },
      { git: "add ." },
      { git: 'commit -m "le reste"' },
      { git: "checkout main" },
      { git: "cherry-pick labo~1" },
      { git: "log --oneline" },
      { git: "status" }
    ]
  },
  {
    nom: "cherry-pick-en-conflit",
    actions: [
      { ecrire: ["f.txt", "un\ndeux\n"] },
      { git: "add ." },
      { git: 'commit -m "base"' },
      { git: "checkout -b s" },
      { ecrire: ["f.txt", "un\nDEUX cote s\n"] },
      { git: "add ." },
      { git: 'commit -m "modif s"' },
      { git: "checkout main" },
      { ecrire: ["f.txt", "un\nDEUX cote main\n"] },
      { git: "add ." },
      { git: 'commit -m "modif main"' },
      { git: "cherry-pick s" },
      { git: "status --porcelain" },
      { git: "cherry-pick --abort" },
      { git: "status" }
    ]
  },
  {
    nom: "rebase-lineaire",
    actions: [
      { ecrire: ["r.txt", "racine\n"] },
      { git: "add ." },
      { git: 'commit -m "racine"' },
      { git: "checkout -b travaux" },
      { ecrire: ["t1.txt", "un\n"] },
      { git: "add ." },
      { git: 'commit -m "t1"' },
      { ecrire: ["t2.txt", "deux\n"] },
      { git: "add ." },
      { git: 'commit -m "t2"' },
      { git: "checkout main" },
      { ecrire: ["m1.txt", "avance\n"] },
      { git: "add ." },
      { git: 'commit -m "m1"' },
      { git: "checkout travaux" },
      { git: "rebase main" },
      { git: "log --oneline" },
      { git: "status" }
    ]
  },
  {
    nom: "rebase-en-conflit",
    actions: [
      { ecrire: ["f.txt", "commun\n"] },
      { git: "add ." },
      { git: 'commit -m "base"' },
      { git: "checkout -b travaux" },
      { ecrire: ["f.txt", "version travaux\n"] },
      { git: "add ." },
      { git: 'commit -m "t1"' },
      { git: "checkout main" },
      { ecrire: ["f.txt", "version main\n"] },
      { git: "add ." },
      { git: 'commit -m "m1"' },
      { git: "checkout travaux" },
      { git: "rebase main" },
      { git: "status --porcelain" },
      { ecrire: ["f.txt", "version reconciliee\n"] },
      { git: "add f.txt" },
      { git: "rebase --continue" },
      { git: "log --oneline" },
      { git: "status" }
    ]
  },
  {
    nom: "checkout-protege-le-travail",
    actions: [
      { ecrire: ["f.txt", "base\n"] },
      { ecrire: ["libre.txt", "jamais suivi\n"] },
      { git: "add f.txt" },
      { git: 'commit -m "base"' },
      { git: "checkout -b autre" },
      { ecrire: ["f.txt", "autre\n"] },
      { git: "add ." },
      { git: 'commit -m "autre"' },
      { git: "checkout main" },
      { ecrire: ["f.txt", "modif non commitee\n"] },
      { git: "checkout autre" },
      { git: "status --porcelain" },
      { ecrire: ["g.txt", "brouillon\n"] },
      { git: "checkout main" },
      { git: "status --porcelain" }
    ]
  },
  {
    nom: "amend-et-tag",
    actions: [
      { ecrire: ["a.txt", "1\n"] },
      { git: "add ." },
      { git: 'commit -m "message a corriger"' },
      { git: 'commit --amend -m "message corrige"' },
      { git: "log --oneline" },
      { git: "tag v1" },
      { ecrire: ["a.txt", "2\n"] },
      { git: "add ." },
      { git: 'commit -m "suite"' },
      { git: "log --oneline v1" },
      { git: "checkout v1" },
      { git: "status" }
    ]
  },
  {
    nom: "tete-detachee",
    actions: [
      { ecrire: ["a.txt", "1\n"] },
      { git: "add ." },
      { git: 'commit -m "c1"' },
      { ecrire: ["a.txt", "2\n"] },
      { git: "add ." },
      { git: 'commit -m "c2"' },
      { git: "checkout HEAD~1" },
      { git: "status" },
      { ecrire: ["b.txt", "commit orphelin\n"] },
      { git: "add ." },
      { git: 'commit -m "sur une tete detachee"' },
      { git: "branch sauvetage" },
      { git: "checkout main" },
      { git: "log --oneline sauvetage" }
    ]
  }  ,
  {
    nom: "fusion-de-lignes-disjointes",
    actions: [
      { ecrire: ["poeme.txt", "ligne A\nligne B\nligne C\nligne D\nligne E\n"] },
      { git: "add ." },
      { git: 'commit -m "base"' },
      { git: "checkout -b haut" },
      { ecrire: ["poeme.txt", "ligne A modifiee en haut\nligne B\nligne C\nligne D\nligne E\n"] },
      { git: "add ." },
      { git: 'commit -m "haut"' },
      { git: "checkout main" },
      { ecrire: ["poeme.txt", "ligne A\nligne B\nligne C\nligne D\nligne E modifiee en bas\n"] },
      { git: "add ." },
      { git: 'commit -m "bas"' },
      { git: "merge haut" },
      { git: "status" }
    ]
  },
  {
    nom: "conflit-ajout-ajout",
    actions: [
      { ecrire: ["socle.txt", "socle\n"] },
      { git: "add ." },
      { git: 'commit -m "socle"' },
      { git: "checkout -b b1" },
      { ecrire: ["neuf.txt", "version b1\n"] },
      { git: "add ." },
      { git: 'commit -m "b1 cree neuf"' },
      { git: "checkout main" },
      { ecrire: ["neuf.txt", "version main\n"] },
      { git: "add ." },
      { git: 'commit -m "main cree neuf"' },
      { git: "merge b1" },
      { git: "status --porcelain" },
      { git: "status" },
      { git: "merge --abort" },
      { git: "status --porcelain" }
    ]
  },
  {
    nom: "merge-sans-avance-rapide",
    actions: [
      { ecrire: ["a.txt", "1\n"] },
      { git: "add ." },
      { git: 'commit -m "c1"' },
      { git: "checkout -b sujet" },
      { ecrire: ["b.txt", "2\n"] },
      { git: "add ." },
      { git: 'commit -m "c2"' },
      { git: "checkout main" },
      { git: 'merge --no-ff sujet -m "Merge branch \'sujet\'"' },
      { git: "log --oneline" },
      { git: "status" }
    ]
  },
  {
    nom: "rebase-abandonne",
    actions: [
      { ecrire: ["f.txt", "commun\n"] },
      { git: "add ." },
      { git: 'commit -m "base"' },
      { git: "checkout -b travaux" },
      { ecrire: ["f.txt", "travaux\n"] },
      { git: "add ." },
      { git: 'commit -m "t1"' },
      { git: "checkout main" },
      { ecrire: ["f.txt", "main\n"] },
      { git: "add ." },
      { git: 'commit -m "m1"' },
      { git: "checkout travaux" },
      { git: "rebase main" },
      { git: "rebase --abort" },
      { git: "status" },
      { git: "log --oneline" }
    ]
  },
  {
    nom: "rm-et-commit-a",
    actions: [
      { ecrire: ["a.txt", "1\n"] },
      { ecrire: ["b.txt", "2\n"] },
      { git: "add ." },
      { git: 'commit -m "socle"' },
      { git: "rm b.txt" },
      { git: "status --porcelain" },
      { git: 'commit -m "b enleve"' },
      { ecrire: ["a.txt", "1 modifie\n"] },
      { ecrire: ["c.txt", "non suivi\n"] },
      { git: 'commit -a -m "tout ce qui est suivi"' },
      { git: "status --porcelain" }
    ]
  },
  {
    nom: "restaurer-un-fichier",
    actions: [
      { ecrire: ["a.txt", "version commitee\n"] },
      { git: "add ." },
      { git: 'commit -m "socle"' },
      { ecrire: ["a.txt", "brouillon a jeter\n"] },
      { git: "status --porcelain" },
      { git: "checkout -- a.txt" },
      { git: "status --porcelain" }
    ]
  },
  {
    nom: "branche-renommee-et-etiquettes",
    actions: [
      { ecrire: ["a.txt", "1\n"] },
      { git: "add ." },
      { git: 'commit -m "c1"' },
      { git: "tag v1" },
      { git: "branch essai" },
      { git: "branch -m essai experiences" },
      { git: "branch" },
      { git: "tag" },
      { git: "tag -d v1" },
      { git: "tag" }
    ]
  },
  {
    nom: "accents-et-noms-pieges",
    actions: [
      { ecrire: ["éphéméride.txt", "des accents : é à ü ç\n"] },
      { ecrire: ["constructor", "un fichier qui porte un nom piege\n"] },
      { ecrire: ["sous/dossier/prototype.txt", "encore un\n"] },
      { git: "add ." },
      { git: 'commit -m "noms pieges"' },
      { git: "status --porcelain" },
      { ecrire: ["éphéméride.txt", "des accents : é à ü ç\net une ligne de plus\n"] },
      { git: "add ." },
      { git: 'commit -m "accents modifies"' },
      { git: "log --oneline" }
    ]
  },
  {
    nom: "sans-saut-de-ligne-final",
    actions: [
      { ecrire: ["court.txt", "sans saut de ligne final"] },
      { git: "add ." },
      { git: 'commit -m "premier"' },
      { ecrire: ["court.txt", "sans saut de ligne final\n"] },
      { git: "add ." },
      { git: "status --porcelain" },
      { git: 'commit -m "un saut ajoute"' },
      { git: "log --oneline" }
    ]
  },
  {
    nom: "revert-annule-puis-refait",
    actions: [
      { ecrire: ["a.txt", "1\n"] },
      { git: "add ." },
      { git: 'commit -m "c1"' },
      { ecrire: ["a.txt", "1\n2\n"] },
      { git: "add ." },
      { git: 'commit -m "c2"' },
      { git: "revert --no-edit HEAD" },
      { git: "log --oneline" },
      { git: "revert --no-edit HEAD" },
      { git: "log --oneline" },
      { git: "status" }
    ]
  },
  {
    nom: "rebase-onto",
    actions: [
      { ecrire: ["r.txt", "racine\n"] },
      { git: "add ." },
      { git: 'commit -m "racine"' },
      { git: "checkout -b socle" },
      { ecrire: ["s.txt", "socle\n"] },
      { git: "add ." },
      { git: 'commit -m "s1"' },
      { git: "checkout -b feuille" },
      { ecrire: ["f.txt", "feuille\n"] },
      { git: "add ." },
      { git: 'commit -m "f1"' },
      { git: "checkout main" },
      { ecrire: ["m.txt", "main\n"] },
      { git: "add ." },
      { git: 'commit -m "m1"' },
      { git: "checkout feuille" },
      { git: "rebase --onto main socle" },
      { git: "log --oneline" },
      { git: "status --porcelain" }
    ]
  },
  {
    nom: "cherry-pick-resolu-et-poursuivi",
    actions: [
      { ecrire: ["f.txt", "un\ndeux\ntrois\n"] },
      { git: "add ." },
      { git: 'commit -m "base"' },
      { git: "checkout -b s" },
      { ecrire: ["f.txt", "un\nDEUX cote s\ntrois\n"] },
      { git: "add ." },
      { git: 'commit -m "modif s"' },
      { git: "checkout main" },
      { ecrire: ["f.txt", "un\nDEUX cote main\ntrois\n"] },
      { git: "add ." },
      { git: 'commit -m "modif main"' },
      { git: "cherry-pick s" },
      { ecrire: ["f.txt", "un\nDEUX les deux ensemble\ntrois\n"] },
      { git: "add f.txt" },
      { git: "status" },
      { git: "cherry-pick --continue" },
      { git: "log --oneline" },
      { git: "status" }
    ]
  },
  {
    nom: "dossier-entier-non-suivi",
    actions: [
      { ecrire: ["suivi.txt", "suivi\n"] },
      { git: "add ." },
      { git: 'commit -m "socle"' },
      { ecrire: ["build/un.txt", "genere\n"] },
      { ecrire: ["build/deux.txt", "genere aussi\n"] },
      { ecrire: ["build/sous/trois.txt", "encore\n"] },
      { git: "status" },
      { git: "status --porcelain" },
      { git: "add build/un.txt" },
      { git: "status" },
      { git: "status --porcelain" }
    ]
  },
  {
    nom: "fusion-de-fusion",
    actions: [
      { ecrire: ["a.txt", "1\n"] },
      { git: "add ." },
      { git: 'commit -m "c1"' },
      { git: "checkout -b b1" },
      { ecrire: ["b1.txt", "b1\n"] },
      { git: "add ." },
      { git: 'commit -m "b1"' },
      { git: "checkout main" },
      { git: "checkout -b b2" },
      { ecrire: ["b2.txt", "b2\n"] },
      { git: "add ." },
      { git: 'commit -m "b2"' },
      { git: "checkout main" },
      { ecrire: ["m.txt", "m\n"] },
      { git: "add ." },
      { git: 'commit -m "m"' },
      { git: "merge b1" },
      { git: "merge b2" },
      { git: "log --oneline" },
      { git: "status" }
    ]
  }

  ,
  {
    nom: "options-refusees",
    actions: [
      { ecrire: ["a.txt", "1\n"] },
      { git: "add --zzz a.txt", sortie: false },
      { git: "status --porcelain" },
      { git: "add a.txt" },
      { git: 'commit --zzz -m "msg"', sortie: false },
      { git: "status --porcelain" },
      { git: 'commit -m ""' },
      { git: 'commit -m "premier"' },
      { git: "log --oneline" }
    ]
  },
  {
    nom: "raccourcis-du-quotidien",
    actions: [
      { ecrire: ["a.txt", "1\n"] },
      { git: "add ." },
      { git: 'commit -m "socle"' },
      { ecrire: ["a.txt", "2\n"] },
      { git: 'commit -am "tout en un"' },
      { git: "status --porcelain" },
      { ecrire: ["b.txt", "b\n"] },
      { git: "add -- b.txt" },
      { git: "status --porcelain" },
      { git: 'commit --message="avec un egal"' },
      { git: "log --oneline" },
      { ecrire: ["a.txt", "3\n"] },
      { git: "add -u" },
      { git: "status --porcelain" },
      { git: 'commit -m "titre" -m "corps du message"' },
      { git: "log" }
    ]
  },
  {
    nom: "pathspecs",
    actions: [
      { ecrire: ["racine.txt", "r\n"] },
      { ecrire: ["sous/un.txt", "1\n"] },
      { ecrire: ["sous/deux.md", "2\n"] },
      { git: "add sous/" },
      { git: "status --porcelain" },
      { git: "add ." },
      { git: 'commit -m "socle"' },
      { ecrire: ["sous/un.txt", "1 bis\n"] },
      { git: "add ./sous/un.txt" },
      { git: "status --porcelain" },
      { git: 'commit -m "sous-dossier"' },
      { git: "rm sous" },
      { git: "rm -r sous" },
      { git: "status --porcelain" },
      { git: 'commit -m "sous enleve"' },
      { git: "log --oneline" }
    ]
  },
  {
    nom: "rm-protege-le-travail",
    actions: [
      { ecrire: ["a.txt", "1\n"] },
      { ecrire: ["b.txt", "1\n"] },
      { git: "add ." },
      { git: 'commit -m "socle"' },
      { ecrire: ["a.txt", "modifie\n"] },
      { git: "rm a.txt" },
      { git: "status --porcelain" },
      { git: "rm -f a.txt" },
      { git: "status --porcelain" },
      { git: "rm --cached b.txt" },
      { git: "status --porcelain" },
      { git: "status" }
    ]
  },
  {
    nom: "reset-un-seul-chemin",
    actions: [
      { ecrire: ["a.txt", "1\n"] },
      { ecrire: ["b.txt", "1\n"] },
      { git: "add ." },
      { git: 'commit -m "socle"' },
      { ecrire: ["a.txt", "2\n"] },
      { ecrire: ["b.txt", "2\n"] },
      { git: "add ." },
      { git: "reset HEAD a.txt" },
      { git: "status --porcelain" },
      { git: 'commit -m "seul b"' },
      { git: "status --porcelain" },
      { git: "reset fantome.txt" }
    ]
  },
  {
    nom: "checkout-branche-ailleurs",
    actions: [
      { ecrire: ["a.txt", "premiere version\n"] },
      { git: "add ." },
      { git: 'commit -m "c1"' },
      { ecrire: ["a.txt", "seconde version\n"] },
      { git: "add ." },
      { git: 'commit -m "c2"' },
      { git: "checkout -b retour HEAD~1" },
      { git: "status --porcelain" },
      { git: "log --oneline" },
      { git: "checkout -" },
      { git: "status --porcelain" },
      { git: "checkout main" }
    ]
  },
  {
    nom: "restaurer-sans-separateur",
    actions: [
      { ecrire: ["a.txt", "version commitee\n"] },
      { ecrire: ["b.txt", "b\n"] },
      { git: "add ." },
      { git: 'commit -m "socle"' },
      { ecrire: ["a.txt", "brouillon\n"] },
      { git: "checkout a.txt" },
      { git: "status --porcelain" },
      { ecrire: ["a.txt", "brouillon\n"] },
      { ecrire: ["b.txt", "brouillon\n"] },
      { git: "checkout ." },
      { git: "status --porcelain" }
    ]
  },
  {
    nom: "branche-renommee-refusee",
    actions: [
      { ecrire: ["a.txt", "1\n"] },
      { git: "add ." },
      { git: 'commit -m "c1"' },
      { git: "branch essai" },
      { git: "branch autre" },
      { git: "branch -m essai autre" },
      { git: "branch" },
      { git: "branch -m essai renommee" },
      { git: "branch" },
      { git: "branch -v" },
      { git: "branch mauvais..nom" },
      { git: "branch --show-current" }
    ]
  },
  {
    nom: "etiquettes-listees",
    actions: [
      { ecrire: ["a.txt", "1\n"] },
      { git: "add ." },
      { git: 'commit -m "c1"' },
      { git: "tag v1" },
      { ecrire: ["a.txt", "2\n"] },
      { git: "add ." },
      { git: 'commit -m "c2"' },
      { git: "tag v2" },
      { git: "tag -l v*" },
      { git: "tag" },
      { git: "log --oneline v1" },
      { git: "checkout v1" },
      { git: "status" },
      { git: "branch" }
    ]
  },
  {
    nom: "journal-detaille",
    actions: [
      { ecrire: ["a.txt", "1\n"] },
      { git: "add ." },
      { git: 'commit -m "premier"' },
      { ecrire: ["b.txt", "2\n"] },
      { git: "add ." },
      { git: 'commit -m "second"' },
      { git: "log" },
      { git: "log --oneline -1" },
      { git: "log --oneline -- a.txt" },
      { git: "log --oneline fantome" }
    ]
  },
  {
    nom: "cherry-pick-plusieurs",
    actions: [
      { ecrire: ["r.txt", "r\n"] },
      { git: "add ." },
      { git: 'commit -m "racine"' },
      { git: "checkout -b labo" },
      { ecrire: ["un.txt", "1\n"] },
      { git: "add ." },
      { git: 'commit -m "un"' },
      { ecrire: ["deux.txt", "2\n"] },
      { git: "add ." },
      { git: 'commit -m "deux"' },
      { git: "checkout main" },
      { git: "cherry-pick labo~1 labo" },
      { git: "log --oneline" },
      { git: "status" }
    ]
  },
  {
    nom: "cherry-pick-plage-et-x",
    actions: [
      { ecrire: ["r.txt", "r\n"] },
      { git: "add ." },
      { git: 'commit -m "racine"' },
      { git: "checkout -b labo" },
      { ecrire: ["un.txt", "1\n"] },
      { git: "add ." },
      { git: 'commit -m "un"' },
      { ecrire: ["deux.txt", "2\n"] },
      { git: "add ." },
      { git: 'commit -m "deux"' },
      { git: "checkout main" },
      { git: "cherry-pick main..labo" },
      { git: "log --oneline" }
    ]
  },
  {
    nom: "revert-de-fusion",
    actions: [
      { ecrire: ["r.txt", "r\n"] },
      { git: "add ." },
      { git: 'commit -m "racine"' },
      { git: "checkout -b annexe" },
      { ecrire: ["x.txt", "x\n"] },
      { git: "add ." },
      { git: 'commit -m "x"' },
      { git: "checkout main" },
      { ecrire: ["m.txt", "m\n"] },
      { git: "add ." },
      { git: 'commit -m "m"' },
      { git: "merge annexe" },
      { git: "revert --no-edit HEAD" },
      { git: "revert --no-edit -m 1 HEAD~1" },
      { git: "log --oneline" },
      { git: "status --porcelain" }
    ]
  },
  {
    nom: "sequence-interrompue",
    actions: [
      { ecrire: ["f.txt", "un\ndeux\n"] },
      { git: "add ." },
      { git: 'commit -m "base"' },
      { git: "checkout -b s" },
      { ecrire: ["f.txt", "un\nDEUX cote s\n"] },
      { git: "add ." },
      { git: 'commit -m "modif s"' },
      { git: "checkout main" },
      { ecrire: ["f.txt", "un\nDEUX cote main\n"] },
      { git: "add ." },
      { git: 'commit -m "modif main"' },
      { git: "cherry-pick s" },
      { git: "status" },
      { git: "cherry-pick --skip" },
      { git: "status --porcelain" },
      { git: "log --oneline" }
    ]
  },
  {
    nom: "fusion-protege-le-travail",
    actions: [
      { ecrire: ["f.txt", "base\n"] },
      { ecrire: ["g.txt", "g\n"] },
      { git: "add ." },
      { git: 'commit -m "socle"' },
      { git: "checkout -b autre" },
      { ecrire: ["f.txt", "cote autre\n"] },
      { git: "add ." },
      { git: 'commit -m "autre"' },
      { git: "checkout main" },
      { ecrire: ["f.txt", "cote main\n"] },
      { git: "add ." },
      { git: 'commit -m "main"' },
      { ecrire: ["f.txt", "brouillon local\n"] },
      { git: "merge autre" },
      { git: "status --porcelain" },
      { ecrire: ["f.txt", "cote main\n"] },
      { ecrire: ["libre.txt", "non suivi\n"] },
      { git: "merge autre" },
      { git: "status --porcelain" }
    ]
  },
  {
    nom: "fusion-refuse-un-index-sale",
    actions: [
      { ecrire: ["f.txt", "base\n"] },
      { ecrire: ["g.txt", "g\n"] },
      { git: "add ." },
      { git: 'commit -m "socle"' },
      { git: "checkout -b autre" },
      { ecrire: ["f.txt", "cote autre\n"] },
      { git: "add ." },
      { git: 'commit -m "autre"' },
      { git: "checkout main" },
      { ecrire: ["m.txt", "m\n"] },
      { git: "add ." },
      { git: 'commit -m "main"' },
      { ecrire: ["g.txt", "modifie et indexe\n"] },
      { git: "add g.txt" },
      { git: "status --porcelain" },
      { git: "merge autre" },
      { git: "status --porcelain" },
      { git: 'commit -m "je range d abord"' },
      { git: "merge autre" },
      { git: "log --oneline" }
    ]
  },
  {
    nom: "fusion-sans-ancetre-commun",
    actions: [
      { ecrire: ["a.txt", "1\n"] },
      { git: "add ." },
      { git: 'commit -m "c1"' },
      { git: "checkout -b sujet" },
      { ecrire: ["b.txt", "2\n"] },
      { git: "add ." },
      { git: 'commit -m "c2"' },
      { git: "checkout main" },
      { git: "merge --ff-only sujet" },
      { git: "log --oneline" }
    ]
  },
  {
    nom: "conflits-multiples-entrelaces",
    actions: [
      { ecrire: ["a.txt", "un\ndeux\n"] },
      { ecrire: ["b.txt", "un\ndeux\n"] },
      { ecrire: ["c.txt", "un\ndeux\n"] },
      { git: "add ." },
      { git: 'commit -m "socle"' },
      { git: "checkout -b autre" },
      { ecrire: ["a.txt", "un\nA cote autre\n"] },
      { ecrire: ["b.txt", "un\nB cote autre\n"] },
      { ecrire: ["c.txt", "un\nC cote autre\n"] },
      { git: "add ." },
      { git: 'commit -m "autre"' },
      { git: "checkout main" },
      { ecrire: ["a.txt", "un\nA cote main\n"] },
      { ecrire: ["b.txt", "un\nB cote main\n"] },
      { ecrire: ["c.txt", "un\nC cote main\n"] },
      { git: "add ." },
      { git: 'commit -m "main"' },
      { git: "merge autre" },
      { git: "status" },
      { git: "status --porcelain" }
    ]
  },
  {
    nom: "conflits-recolles",
    actions: [
      { ecrire: ["p.txt", "L1\nL2\nL3\nL4\nL5\nL6\nL7\nL8\nL9\n"] },
      { git: "add ." },
      { git: 'commit -m "socle"' },
      { git: "checkout -b autre" },
      { ecrire: ["p.txt", "L1\nAUTRE-haut\nL3\nL4\nL5\nAUTRE-bas\nL7\nL8\nL9\n"] },
      { git: "add ." },
      { git: 'commit -m "autre"' },
      { git: "checkout main" },
      { ecrire: ["p.txt", "L1\nMAIN-haut\nL3\nL4\nL5\nMAIN-bas\nL7\nL8\nL9\n"] },
      { git: "add ." },
      { git: 'commit -m "main"' },
      { git: "merge autre" },
      { git: "status --porcelain" }
    ]
  },
  {
    nom: "conflit-ajout-vide",
    actions: [
      { ecrire: ["socle.txt", "s\n"] },
      { git: "add ." },
      { git: 'commit -m "socle"' },
      { git: "checkout -b autre" },
      { ecrire: ["neuf.txt", ""] },
      { git: "add ." },
      { git: 'commit -m "autre ajoute un fichier vide"' },
      { git: "checkout main" },
      { ecrire: ["neuf.txt", "du contenu\n"] },
      { git: "add ." },
      { git: 'commit -m "main ajoute le meme nom"' },
      { git: "merge autre" },
      { git: "status --porcelain" },
      { git: "log --oneline" }
    ]
  },
  {
    nom: "conflit-avec-prefixe-commun",
    actions: [
      { ecrire: ["socle.txt", "s\n"] },
      { git: "add ." },
      { git: 'commit -m "socle"' },
      { git: "checkout -b autre" },
      { ecrire: ["neuf.txt", "commun\ncote autre\n"] },
      { git: "add ." },
      { git: 'commit -m "autre"' },
      { git: "checkout main" },
      { ecrire: ["neuf.txt", "commun\ncote main\n"] },
      { git: "add ." },
      { git: 'commit -m "main"' },
      { git: "merge autre" },
      { git: "status --porcelain" }
    ]
  },
  {
    nom: "noms-a-espace-et-accents",
    actions: [
      { ecrire: ["mon fichier.txt", "avec une espace\n"] },
      { ecrire: ["données/été.txt", "avec des accents\n"] },
      { git: "add ." },
      { git: "status --porcelain" },
      { git: "status" },
      { git: 'commit -m "noms particuliers"' },
      { git: "log --oneline" }
    ]
  },
  {
    nom: "commit-partiel",
    actions: [
      { ecrire: ["a.txt", "1\n"] },
      { ecrire: ["b.txt", "1\n"] },
      { git: "add ." },
      { git: 'commit -m "socle"' },
      { ecrire: ["a.txt", "2\n"] },
      { ecrire: ["b.txt", "2\n"] },
      { git: 'commit -m "seul a" a.txt' },
      { git: "status --porcelain" },
      { git: "log --oneline" }
    ]
  },
  {
    nom: "fichier-vide-et-compteurs",
    actions: [
      { ecrire: ["vide.txt", ""] },
      { git: "add ." },
      { git: 'commit -m "un fichier vide"' },
      { ecrire: ["aa.txt", "a\n"] },
      { ecrire: ["zz.txt", "z\n"] },
      { git: "add ." },
      { git: 'commit -m "deux fichiers"' },
      { supprimer: "aa.txt" },
      { ecrire: ["mm.txt", "m\n"] },
      { git: "add ." },
      { git: 'commit -m "un cree, un supprime"' },
      { git: "log --oneline" }
    ]
  },
  {
    nom: "rebase-multi-commits",
    actions: [
      { ecrire: ["r.txt", "r\n"] },
      { git: "add ." },
      { git: 'commit -m "racine"' },
      { git: "checkout -b travaux" },
      { ecrire: ["t1.txt", "1\n"] },
      { git: "add ." },
      { git: 'commit -m "t1"' },
      { ecrire: ["t2.txt", "2\n"] },
      { git: "add ." },
      { git: 'commit -m "t2"' },
      { ecrire: ["t3.txt", "3\n"] },
      { git: "add ." },
      { git: 'commit -m "t3"' },
      { git: "checkout main" },
      { ecrire: ["m.txt", "m\n"] },
      { git: "add ." },
      { git: 'commit -m "m1"' },
      { git: "checkout travaux" },
      { git: "rebase main" },
      { git: "log --oneline" },
      { git: "log" },
      { git: "rebase main" }
    ]
  },
  {
    nom: "rebase-conflit-au-deuxieme",
    actions: [
      { ecrire: ["f.txt", "commun\n"] },
      { ecrire: ["autre.txt", "a\n"] },
      { git: "add ." },
      { git: 'commit -m "base"' },
      { git: "checkout -b travaux" },
      { ecrire: ["autre.txt", "modifie par t1\n"] },
      { git: "add ." },
      { git: 'commit -m "t1"' },
      { ecrire: ["f.txt", "version travaux\n"] },
      { git: "add ." },
      { git: 'commit -m "t2"' },
      { git: "checkout main" },
      { ecrire: ["f.txt", "version main\n"] },
      { git: "add ." },
      { git: 'commit -m "m1"' },
      { git: "checkout travaux" },
      { git: "rebase main" },
      { git: "status" },
      { git: "status --porcelain" },
      { ecrire: ["f.txt", "version reconciliee\n"] },
      { git: "add f.txt" },
      { git: "rebase --continue" },
      { git: "log --oneline" },
      { git: "status" }
    ]
  }

  ,
  {
    nom: "dates-qui-avancent",
    actions: [
      { ecrire: ["r.txt", "r\n"] },
      { git: "add ." },
      { git: 'commit -m "racine"' },
      { git: "checkout -b travaux" },
      { instant: 1704070800 },
      { ecrire: ["t1.txt", "1\n"] },
      { git: "add ." },
      { git: 'commit -m "t1"' },
      { instant: 1704074400 },
      { ecrire: ["t2.txt", "2\n"] },
      { git: "add ." },
      { git: 'commit -m "t2"' },
      { git: "checkout main" },
      { instant: 1704078000 },
      { ecrire: ["m.txt", "m\n"] },
      { git: "add ." },
      { git: 'commit -m "m1"' },
      { git: "checkout travaux" },
      { instant: 1704153600 },
      { git: "rebase main" },
      { git: "log" },
      { git: "log --oneline" }
    ]
  },
  {
    nom: "amend-garde-l-auteur",
    actions: [
      { ecrire: ["a.txt", "1\n"] },
      { git: "add ." },
      { git: 'commit -m "premier"' },
      { instantCommit: 1704153600 },
      { ecrire: ["a.txt", "2\n"] },
      { git: "add ." },
      { git: 'commit --amend -m "premier corrige"' },
      { git: "log" },
      { git: "status --porcelain" }
    ]
  },
  {
    nom: "commit-refuse-pendant-un-conflit",
    actions: [
      { ecrire: ["f.txt", "un\ndeux\n"] },
      { git: "add ." },
      { git: 'commit -m "base"' },
      { git: "checkout -b autre" },
      { ecrire: ["f.txt", "un\nDEUX autre\n"] },
      { git: "add ." },
      { git: 'commit -m "autre"' },
      { git: "checkout main" },
      { ecrire: ["f.txt", "un\nDEUX main\n"] },
      { git: "add ." },
      { git: 'commit -m "main"' },
      { git: "merge autre" },
      { git: 'commit -m "je force"' },
      { git: "merge --continue" },
      { git: "status --porcelain" },
      { git: "merge --abort" },
      { git: "status --porcelain" }
    ]
  },
  {
    nom: "conflit-supprime-chez-nous",
    actions: [
      { ecrire: ["f.txt", "contenu\n"] },
      { ecrire: ["g.txt", "g\n"] },
      { git: "add ." },
      { git: 'commit -m "base"' },
      { git: "checkout -b autre" },
      { ecrire: ["f.txt", "contenu modifie par autre\n"] },
      { git: "add ." },
      { git: 'commit -m "autre modifie f"' },
      { git: "checkout main" },
      { supprimer: "f.txt" },
      { git: "add ." },
      { git: 'commit -m "main supprime f"' },
      { git: "merge autre" },
      { git: "status" },
      { git: "status --porcelain" },
      { git: "rm f.txt" },
      { git: "status --porcelain" },
      { git: "merge --continue" },
      { git: "log --oneline" }
    ]
  },
  {
    nom: "commit-a-et-suppression",
    actions: [
      { ecrire: ["a.txt", "1\n"] },
      { ecrire: ["b.txt", "1\n"] },
      { git: "add ." },
      { git: 'commit -m "socle"' },
      { supprimer: "b.txt" },
      { ecrire: ["a.txt", "2\n"] },
      { git: "status --porcelain" },
      { git: 'commit -a -m "tout, suppression comprise"' },
      { git: "status --porcelain" },
      { git: "log --oneline" }
    ]
  }

  ,
  {
    nom: "fusion-depuis-une-branche-secondaire",
    actions: [
      { ecrire: ["r.txt", "r\n"] },
      { git: "add ." },
      { git: 'commit -m "racine"' },
      { git: "checkout -b travail" },
      { ecrire: ["t.txt", "t\n"] },
      { git: "add ." },
      { git: 'commit -m "t"' },
      { git: "checkout main" },
      { ecrire: ["m.txt", "m\n"] },
      { git: "add ." },
      { git: 'commit -m "m"' },
      { git: "checkout travail" },
      { git: "merge main" },
      { git: "log --oneline" },
      { git: "log" }
    ]
  },
  {
    nom: "fusion-d-une-etiquette",
    actions: [
      { ecrire: ["r.txt", "r\n"] },
      { git: "add ." },
      { git: 'commit -m "racine"' },
      { git: "checkout -b travail" },
      { ecrire: ["t.txt", "t\n"] },
      { git: "add ." },
      { git: 'commit -m "t"' },
      { git: "tag jalon" },
      { git: "checkout main" },
      { ecrire: ["m.txt", "m\n"] },
      { git: "add ." },
      { git: 'commit -m "m"' },
      { git: "merge jalon" },
      { git: "log --oneline" },
      { git: "log" }
    ]
  },
  {
    nom: "cherry-pick-garde-la-date-d-auteur",
    actions: [
      { ecrire: ["r.txt", "r\n"] },
      { git: "add ." },
      { git: 'commit -m "racine"' },
      { git: "checkout -b labo" },
      { instant: 1704070800 },
      { ecrire: ["utile.txt", "utile\n"] },
      { git: "add ." },
      { git: 'commit -m "le morceau utile"' },
      { git: "checkout main" },
      { instant: 1704153600 },
      { git: "cherry-pick labo" },
      { git: "log" },
      { git: "log --oneline" }
    ]
  },
  {
    nom: "revert-de-fusion-second-parent",
    actions: [
      { ecrire: ["r.txt", "r\n"] },
      { git: "add ." },
      { git: 'commit -m "racine"' },
      { git: "checkout -b annexe" },
      { ecrire: ["x.txt", "x\n"] },
      { git: "add ." },
      { git: 'commit -m "x"' },
      { git: "checkout main" },
      { ecrire: ["m.txt", "m\n"] },
      { git: "add ." },
      { git: 'commit -m "m"' },
      { git: "merge annexe" },
      { git: "revert --no-edit -m 2 HEAD" },
      { git: "status --porcelain" },
      { git: "log --oneline" },
      { git: "log" }
    ]
  },
  {
    nom: "noms-d-etiquettes-refuses",
    /* Trouve par une passe adversariale : `git tag` ne validait PAS son nom,
       alors que `branch`, `checkout -b` et `switch -c` le font tous les trois.
       Le vrai git refuse ces trois-la (exit 128, mesure faite). */
    actions: [
      { ecrire: ["a.txt", "1\n"] }, { git: "add ." }, { git: 'commit -m "socle"' },
      { git: "tag ~mauvais^nom" },
      { git: "tag mauvais.lock" },
      { git: "tag bon-nom" },
      { git: "tag -l" }
    ]
  },
  {
    nom: "fusion-d-histoires-etrangeres",
    actions: [
      { ecrire: ["a.txt", "1\n"] },
      { git: "add ." },
      { git: 'commit -m "histoire A"' },
      { orphelin: "solo" },
      { ecrire: ["solo.txt", "seul\n"] },
      { git: "add ." },
      { git: 'commit -m "histoire B"' },
      { git: "checkout main" },
      { git: "merge solo" },
      { git: "status --porcelain" },
      { git: "log --oneline" }
    ]
  },
  {
    nom: "reset-avec-chemins-et-degre",
    /* Trouve par une passe adversariale du point D4 : `git reset --hard HEAD
       <fichier>` etait execute comme un `--hard` COMPLET par le bac a sable —
       il detruisait ce que git REFUSE de toucher (exit 128). Les cinq formes
       sont mesurees des deux cotes, et le `status` qui suit chaque refus prouve
       que RIEN n'a bouge. */
    actions: [
      { ecrire: ["f.txt", "L1\n"] },
      { git: "add ." },
      { git: "commit -m \"socle\"" },
      { ecrire: ["n.txt", "N\n"] },
      { git: "add n.txt" },
      { ecrire: ["f.txt", "L1 modifie\n"] },
      { git: "reset --hard HEAD f.txt" },
      { git: "status --porcelain" },
      { git: "reset --hard f.txt" },
      { git: "reset --soft HEAD f.txt" },
      { git: "reset --hard -- f.txt" },
      { git: "reset --hard zzz" },
      { git: "status --porcelain" },
      { git: "reset HEAD f.txt" },
      { git: "status --porcelain" },
      { git: "reset --hard" },
      { git: "status --porcelain" }
    ]
  },
  {
    nom: "amend-qui-viderait-le-commit",
    /* Trouve par `verif-git-scenarios.js` : le bac a sable ACCEPTAIT un
       amendement qui rend le commit vide, la ou git refuse — sauf sur un commit
       RACINE, ou il reussit. Les deux cas sont ici, avec et sans fichier non
       suivi (git n'affiche pas les memes sections). */
    actions: [
      { ecrire: ["a.txt", "L1\n"] },
      { git: "add ." },
      { git: "commit -m \"racine\"" },
      { git: "commit --amend -m \"racine renommee\"" },
      { ecrire: ["a.txt", "L1\nL2\n"] },
      { git: "add ." },
      { git: "commit -m \"deuxieme\"" },
      { ecrire: ["a.txt", "L1\n"] },
      { git: "add ." },
      { git: "commit --amend -m \"vide\"" },
      { git: "status --porcelain" },
      { ecrire: ["b.txt", "non suivi\n"] },
      { git: "commit --amend -m \"vide\"" },
      { git: "commit --amend --allow-empty -m \"vide assume\"" },
      { git: "log --oneline" }
    ]
  },
  {
    nom: "revert-nomme-le-parent",
    /* Trouve par une passe adversariale du point D4 : la ligne CONFLICT d'un
       revert nomme « parent of <oid> (titre) ». Le bac a sable ecrivait
       l'empreinte du commit lui-meme : il designait a l'apprenant un autre
       objet que celui dont git parle. */
    actions: [
      { ecrire: ["base.txt", "socle\n"] },
      { git: "add ." },
      { git: "commit -m \"socle\"" },
      { ecrire: ["f.txt", "L1\n"] },
      { git: "add ." },
      { git: "commit -m \"cree f\"" },
      { ecrire: ["f.txt", "L1\nL2\n"] },
      { git: "add ." },
      { git: "commit -m \"modifie f\"" },
      { git: "revert HEAD~1" },
      { git: "status --porcelain" },
      { git: "revert --abort" },
      { git: "log --oneline" }
    ]
  },
  {
    nom: "revert-du-commit-racine",
    /* Et quand le commit annule est la RACINE, git nomme ce cote
       « (empty tree) » : son parent n'existe pas. */
    actions: [
      { ecrire: ["config.txt", "nom\n"] },
      { git: "add ." },
      { git: "commit -m \"racine\"" },
      { ecrire: ["config.txt", "nom\nDEBUG\n"] },
      { git: "add ." },
      { git: "commit -m \"debug\"" },
      { git: "revert HEAD~1" },
      { git: "status --porcelain" },
      { git: "log --oneline" }
    ]
  }

];

/* --------------------------------------------------------------------------- */

function main() {
  try {
    cp.execFileSync("git", ["--version"], { stdio: "ignore" });
  } catch (e) {
    console.log("verif-git-commandes : git absent de cette machine, etape sautee.");
    process.exit(2);
  }

  var joues = 0;
  for (var i = 0; i < SCENARIOS.length; i++) {
    if (SEUL && SCENARIOS[i].nom !== SEUL) continue;
    try {
      jouer(SCENARIOS[i]);
    } catch (err) {
      if (!(err instanceof ArretVite)) throw err;
      joues++;
      break;
    }
    joues++;
  }

  console.log("verif-git-commandes — " + joues + " scenario(s), " + comparaisons + " comparaison(s) contre "
    + cp.execFileSync("git", ["--version"], { encoding: "utf8" }).trim() + ".");

  if (!ecarts.length) {
    console.log("OK : aucun ecart entre le bac a sable et le vrai git.");
    process.exit(0);
  }

  console.log("\n" + ecarts.length + " ECART(S) :\n");
  var montres = ecarts.slice(0, 40);
  for (var k = 0; k < montres.length; k++) {
    var e = montres[k];
    console.log("  [" + e.ou + "] " + e.quoi);
    console.log("      git    : " + e.git.replace(/\n/g, "\n               "));
    console.log("      modele : " + e.modele.replace(/\n/g, "\n               "));
  }
  if (ecarts.length > montres.length) console.log("  … et " + (ecarts.length - montres.length) + " autre(s).");
  process.exit(1);
}

main();
