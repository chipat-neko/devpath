/* =============================================================================
   verif-git-scenarios.js — LES SCENARIOS GUIDES du bac a sable (js/git-scenarios.js,
   chantier V14 point D4) confrontes au VRAI git. Node pur, ZERO dependance.

   POURQUOI CET OUTIL EXISTE
   Un scenario guide affirme trois choses a l'apprenant, et les trois peuvent
   etre fausses sans que personne ne s'en apercoive a la lecture :
     1. « voici la situation » — la mise en place produit-elle vraiment l'etat
        decrit ? Un `git add .` qui n'indexe pas ce qu'on croit, et l'enonce
        ment des la premiere ligne ;
     2. « voici le but » — la solution publiee l'atteint-elle ? C'est la faute
        qui a ete trouvee dans le cours `regex` : une solution refusee par son
        propre champ ;
     3. « ce n'est pas la bonne facon » — les pieges echouent-ils VRAIMENT, et
        sur l'objectif annonce ?
   Cet outil execute les trois. Rien n'est juge de tete.

   COMMENT
   Chaque parcours (mise en place + une suite de commandes) est joue DEUX FOIS :
   dans le modele du bac a sable, et dans un vrai depot git temporaire. Apres
   chaque commande git on compare la sortie, la reussite, `git status
   --porcelain`, HEAD, toutes les references, le contenu de chaque fichier du
   repertoire de travail et l'arbre de HEAD ; a la fin du parcours, on compare
   en plus le JOURNAL DE CHAQUE BRANCHE (empreintes et titres), parce que c'est
   exactement ce que les objectifs interrogent.

   Les commandes qui ne sont pas git (`echo`, `rm`) sont jouees par la coquille
   partagee `js/git-coquille.js` — celle-la meme que la page emploie — puis le
   repertoire de travail du vrai depot est SYNCHRONISE sur celui du modele.
   C'est volontaire : `echo` n'est pas git, il n'y a rien a comparer, et une
   seconde implementation dans cet outil serait exactement le « deux expressions
   de la meme chose » qui a rogne les titres du graphe en D3.

   CE QUE L'OUTIL EXIGE, EN PLUS DE L'EGALITE AVEC GIT
     · la solution publiee ATTEINT le but (et chaque variante aussi) ;
     · chaque piege ECHOUE, et rate l'objectif annonce par son champ `rate` ;
     · aucun objectif n'est deja vrai a la fin de la mise en place, sauf ceux
       marques `deja: true` — un controle vert par vacuite ne prouve rien ;
     · un objectif marque `deja: true` est tombe par au moins un piege, sinon il
       n'est jamais mesure que dans un seul sens ;
     · le champ `rate` d'un piege est EXHAUSTIF : il annonce tous les objectifs
       que le piege manque, et rien d'autre ;
     · une solution ou une variante ne fait DISPARAITRE aucun fichier du depot ;
     · le `nom` d'une variante ou d'un piege ne cite aucune commande git que ses
       lignes n'emploient pas ;
     · toutes les lignes EXECUTEES sont en ASCII (les textes francais, eux,
       portent leurs accents) ;
     · la table lecon -> scenario de `js/lecon.js` coincide avec celle que
       `js/git-scenarios.js` deduit des scenarios, et les lecons citees existent.

   CODE DE SORTIE : 0 tout concorde, 1 un ecart, 2 git absent (etape sautee).
   ============================================================================= */
"use strict";

var cp = require("child_process");
var fs = require("fs");
var os = require("os");
var path = require("path");

var RACINE = path.join(__dirname, "..");
var argScen = process.argv.slice(2).filter(function (a) { return a.indexOf("--scenarios=") === 0; })[0];
var CHEMIN_SCEN = argScen ? argScen.slice(12) : path.join(RACINE, "js", "git-scenarios.js");
var S = require(path.resolve(CHEMIN_SCEN));
var GC = require(path.join(RACINE, "js", "git-commandes.js"));
var GM = require(path.join(RACINE, "js", "git-modele.js"));
var Q = require(path.join(RACINE, "js", "git-coquille.js"));

var SEUL = (process.argv.slice(2).filter(function (a) { return a.indexOf("--scenario=") === 0; })[0] || "").slice(11);
var BAVARD = process.argv.indexOf("--bavard") >= 0;
/* `--vite` : s'arreter au PREMIER ecart. Sert a la passe de mutation, qui joue
   l'outil des dizaines de fois et n'a besoin que de savoir s'il rougit. */
var VITE = process.argv.indexOf("--vite") >= 0;

var IDENTITE_NOM = "Apprenant";
var IDENTITE_MAIL = "apprenant@syntaxe.invalid";
var IDENTITE = IDENTITE_NOM + " <" + IDENTITE_MAIL + ">";
var INSTANT = 1704067200;                       // 1er janvier 2024, 00:00:00 UTC

var comparaisons = 0;
var ecarts = [];
var contexteCourant = "";

function ArretVite() { this.vite = true; }

/* Un piege peut manquer PLUSIEURS objectifs a la fois — « reset --hard HEAD~1 »
   efface le mauvais message ET le travail. Le champ `rate` accepte donc un
   numero ou une liste, et tous doivent etre rates. */
function rates(piege) {
  return Array.isArray(piege.rate) ? piege.rate : [piege.rate];
}

function compare(quoi, attendu, obtenu) {
  comparaisons++;
  if (String(attendu) !== String(obtenu)) {
    ecarts.push({ ou: contexteCourant, quoi: quoi, git: String(attendu), modele: String(obtenu) });
    if (VITE) throw new ArretVite();
  }
}

/* Une exigence qui ne vient pas de git mais du scenario lui-meme. */
function exige(quoi, condition, detail) {
  comparaisons++;
  if (!condition) {
    ecarts.push({ ou: contexteCourant, quoi: quoi, git: "attendu", modele: detail || "non" });
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
    GIT_AUTHOR_DATE: INSTANT + " +0000",
    GIT_COMMITTER_DATE: INSTANT + " +0000",
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
  return gitBrut(dir, args).sortie.replace(/\r/g, "").replace(/\n$/, "");
}

function creerDepotReel() {
  var dir = fs.mkdtempSync(path.join(os.tmpdir(), "syntaxe-gits-"));
  cp.execFileSync("git", ["init", "-q", "-b", "main", dir], { env: env() });
  gitBrut(dir, ["config", "core.autocrlf", "false"]);
  gitBrut(dir, ["config", "core.filemode", "false"]);
  gitBrut(dir, ["config", "core.safecrlf", "false"]);
  gitBrut(dir, ["config", "advice.detachedHead", "false"]);
  gitBrut(dir, ["config", "merge.conflictStyle", "merge"]);
  return dir;
}

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
  var teteGit = gitLu(dir, ["rev-parse", "HEAD"]);
  if (/^fatal|unknown revision|ambiguous/.test(teteGit)) teteGit = "";
  compare("HEAD (oid)", teteGit, depot.oidHEAD() || "");

  var symGit = gitLu(dir, ["symbolic-ref", "-q", "HEAD"]);
  if (/^fatal|^$/.test(symGit)) symGit = "";
  compare("HEAD (branche)", symGit, depot.HEAD.symbolique || "");

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

  var statutGit = gitLu(dir, ["status", "--porcelain"]).split("\n").filter(Boolean).sort().join(" | ");
  var statutModele = GC.commandes.status(depot, ["--porcelain"]).sortie.slice().sort().join(" | ");
  compare("status --porcelain", statutGit, statutModele);

  var surDisque = fichiersDisque(dir);
  var cheminsGit = Object.keys(surDisque).sort();
  var cheminsModele = depot.cheminsTravail().slice().sort();
  compare("fichiers du repertoire de travail", cheminsGit.join(" | "), cheminsModele.join(" | "));
  for (var k = 0; k < cheminsGit.length; k++) {
    var c = cheminsGit[k];
    compare("contenu de " + c, JSON.stringify(surDisque[c].replace(/\r\n/g, "\n")), JSON.stringify(depot.lireFichier(c)));
  }

  if (teteGit) {
    compare("arbre de HEAD", gitLu(dir, ["rev-parse", "HEAD^{tree}"]), depot.lireCommit(depot.oidHEAD()).arbre);
  }
}

/* Le journal de CHAQUE branche : c'est precisement ce que les objectifs
   interrogent (« telle branche contient-elle tel commit ? », « combien de
   commits ? »). Une egalite d'etat qui n'irait pas jusque-la laisserait les
   predicats reposer sur le seul modele. */
function comparerJournaux(dir, depot) {
  var branchesGit = gitLu(dir, ["for-each-ref", "--format=%(refname:short)", "refs/heads"]).split("\n").filter(Boolean).sort();
  var branchesModele = depot.branches().slice().sort();
  compare("liste des branches", branchesGit.join(" | "), branchesModele.join(" | "));
  for (var i = 0; i < branchesGit.length; i++) {
    var b = branchesGit[i];
    var journalGit = gitLu(dir, ["log", "--format=%H %s", b]);
    var journalModele = depot.journal(b).map(function (c) { return c.oid + " " + c.titre; }).join("\n");
    /* L'ORDRE du journal est deja verifie par verif-git-graphe : ici, ce qui
       importe aux objectifs est l'ENSEMBLE des commits atteignables. */
    compare("commits atteignables depuis " + b,
      journalGit.split("\n").filter(Boolean).sort().join(" | "),
      journalModele.split("\n").filter(Boolean).sort().join(" | "));
  }
}

/* --- jouer une suite de lignes ---------------------------------------------- */

function synchroniser(dir, depot) {
  var surDisque = fichiersDisque(dir), c;
  for (c in surDisque) {
    if (!Object.prototype.hasOwnProperty.call(surDisque, c)) continue;
    if (depot.lireFichier(c) === null) {
      try { fs.unlinkSync(path.join(dir, c.split("/").join(path.sep))); } catch (e) { /* deja parti */ }
    }
  }
  var chemins = depot.cheminsTravail();
  for (var i = 0; i < chemins.length; i++) {
    var complet = path.join(dir, chemins[i].split("/").join(path.sep));
    fs.mkdirSync(path.dirname(complet), { recursive: true });
    fs.writeFileSync(complet, depot.lireFichier(chemins[i]), "utf8");
  }
}

/* `comparer` a faux : on joue sans rien mesurer (remontage d'une mise en place
   deja verifiee), ce qui divise par trois le nombre d'appels a git. */
function jouerLignes(dir, depot, lignes, comparer, etiquette) {
  for (var i = 0; i < lignes.length; i++) {
    var ligne = lignes[i];
    contexteCourant = etiquette + " #" + (i + 1) + " — " + ligne;

    if (Q.estCoquille(ligne)) {
      var r = Q.executer(depot, ligne);
      exige("la coquille traite « " + ligne + " »", !!r);
      exige("aucune remise a zero au milieu d'un scenario", !r || !r.reinit);
      synchroniser(dir, depot);
      continue;
    }

    var mots = GC.decouperLigne(ligne);
    exige("la ligne « " + ligne + " » est une commande git ou de coquille", mots[0] === "git");
    var reelle = gitBrut(dir, mots.slice(1));
    var modele = GC.executer(depot, mots);

    if (BAVARD) {
      console.log("\n--- " + contexteCourant);
      console.log("  git    : " + JSON.stringify(normaliser(reelle.sortie)));
      console.log("  modele : " + JSON.stringify(modele.sortie.join("\n")));
    }

    if (comparer) {
      compare("sortie", normaliser(reelle.sortie), normaliser(modele.sortie.join("\n")));
      compare("reussite", reelle.code === 0 ? "ok" : "echec", modele.ok ? "ok" : "echec");
      comparerEtat(dir, depot);
    }
  }
}

function depotNeuf() {
  return new GM.Depot({ identite: IDENTITE, branche: "main", instant: INSTANT, pasHorloge: 0, fuseau: "+0000" });
}

function menage(dir) {
  try { fs.rmSync(dir, { recursive: true, force: true, maxRetries: 3 }); } catch (e) { /* le temporaire survivra */ }
}

/* Monte la situation de depart. `comparerMise` n'est vrai que pour le premier
   parcours d'un scenario : la mise en place est la meme pour tous. */
function monter(scenario, comparerMise) {
  var dir = creerDepotReel();
  var depot = depotNeuf();
  jouerLignes(dir, depot, scenario.mise, comparerMise, scenario.id + "/mise");
  return { dir: dir, depot: depot };
}

/* Tous les chemins ATTEIGNABLES : ceux du repertoire de travail, plus ceux de
   n'importe quel commit tenu par une reference. C'est l'inventaire de ce que
   l'apprenant possede encore.
   ⚠️ Une solution publiee qui EFFACE un fichier n'etait vue par personne : la
   passe adversariale a rendu VERTE une solution qui commencait par « rm
   index.html ». Un scenario doit se resoudre sans rien detruire. */
function cheminsVivants(depot) {
  var vus = {}, r, i, c;
  var chemins = depot.cheminsTravail();
  for (i = 0; i < chemins.length; i++) vus[chemins[i]] = true;
  var commits = {};
  var refs = [];
  for (r in depot.refs) if (Object.prototype.hasOwnProperty.call(depot.refs, r)) refs.push(depot.refs[r]);
  if (depot.oidHEAD()) refs.push(depot.oidHEAD());
  for (i = 0; i < refs.length; i++) {
    var atteints = depot.ancetres(refs[i]);
    for (c in atteints) if (Object.prototype.hasOwnProperty.call(atteints, c)) commits[c] = true;
  }
  for (c in commits) {
    if (!Object.prototype.hasOwnProperty.call(commits, c)) continue;
    var entrees = depot.listerArbre(depot.lireCommit(c).arbre);
    for (i = 0; i < entrees.length; i++) vus[entrees[i].chemin] = true;
  }
  return Object.keys(vus).sort();
}

/* Les lignes d'un parcours peuvent etre CALCULEES a partir du depot : le
   scenario du commit perdu a besoin d'une empreinte que la mise en place vient
   seulement de produire. */
function lignesDe(quoi, depot) {
  return typeof quoi === "function" ? quoi(depot) : quoi;
}

/* --- les invariants qui ne demandent pas git -------------------------------- */

function verifierInvariants() {
  contexteCourant = "invariants";
  var vus = {}, i, j;
  var lecons = {};

  for (i = 0; i < S.SCENARIOS.length; i++) {
    var sc = S.SCENARIOS[i];
    contexteCourant = "invariants — " + sc.id;
    exige("id unique", !vus[sc.id], sc.id);
    vus[sc.id] = true;
    exige("titre, resume, situation, but, apres renseignes",
      !!(sc.titre && sc.resume && sc.situation && sc.but && sc.apres));
    exige("au moins deux objectifs", sc.objectifs.length >= 2, String(sc.objectifs.length));
    exige("trois indices", sc.indices.length === 3, String(sc.indices.length));
    exige("une solution", !!(sc.solution));
    exige("au moins une variante", (sc.variantes || []).length >= 1);
    exige("au moins un piege", (sc.pieges || []).length >= 1);
    exige("au moins une lecon citee", (sc.lecons || []).length >= 1);

    /* ⚠️ L'ASCII n'est pas une coquetterie : ces lignes passent par spawnSync
       vers un vrai git, et un accent y devient illisible sous Windows. */
    var aTester = [].concat(
      sc.mise,
      typeof sc.solution === "function" ? (sc.solutionTexte || []) : sc.solution
    );
    for (j = 0; j < (sc.variantes || []).length; j++) {
      if (typeof sc.variantes[j].lignes !== "function") aTester = aTester.concat(sc.variantes[j].lignes);
    }
    for (j = 0; j < (sc.pieges || []).length; j++) {
      if (typeof sc.pieges[j].lignes !== "function") aTester = aTester.concat(sc.pieges[j].lignes);
    }
    for (j = 0; j < aTester.length; j++) {
      exige("ligne executable en ASCII : " + aTester[j], /^[\x20-\x7E]*$/.test(aTester[j]), aTester[j]);
    }

    /* Les textes francais, eux, DOIVENT etre en francais : un accent manquant
       dans un enonce est une faute de contenu, pas un detail. */
    /* ⚠️ Le NOM d'une variante ou d'un piege est lu par l'apprenant comme une
       description de ses lignes. Une variante s'appelait « avec switch et
       restore, les formes modernes » alors qu'elle faisait « git checkout HEAD
       -- » : c'est la faute exacte du cours `regex` (un libelle recopie qui ne
       decrit pas ce que le champ fait). Tout verbe git cite dans le nom doit
       donc apparaitre dans les lignes. */
    var nommes = (sc.variantes || []).concat(sc.pieges || []);
    for (j = 0; j < nommes.length; j++) {
      if (typeof nommes[j].lignes === "function") continue;
      var texteLignes = nommes[j].lignes.join(" ");
      var cites = nommes[j].nom.match(/\bgit (add|rm|commit|status|log|branch|tag|checkout|switch|reset|merge|rebase|revert|cherry-pick|diff|restore|stash|reflog|push|pull|fetch|clean)\b/g) || [];
      for (var v = 0; v < cites.length; v++) {
        exige("le nom « " + nommes[j].nom + " » cite « " + cites[v] + " », que ses lignes n'emploient pas",
          texteLignes.indexOf(cites[v]) >= 0, texteLignes);
      }
    }

    for (j = 0; j < sc.pieges.length; j++) {
      exige("le piege « " + sc.pieges[j].nom + " » dit pourquoi", !!sc.pieges[j].pourquoi);
      var vises = rates(sc.pieges[j]);
      exige("le piege « " + sc.pieges[j].nom + " » vise au moins un objectif", vises.length > 0);
      for (var w = 0; w < vises.length; w++) {
        exige("le piege « " + sc.pieges[j].nom + " » vise un objectif existant",
          vises[w] >= 1 && vises[w] <= sc.objectifs.length, String(vises[w]));
      }
    }

    for (j = 0; j < sc.lecons.length; j++) {
      var fichier = path.join(RACINE, "pages", "git", sc.lecons[j] + ".html");
      exige("la lecon citee existe : " + sc.lecons[j], fs.existsSync(fichier));
      /* ⚠️ Le titre affiche a cote du lien est une RECOPIE : il se perime des
         qu'on renomme une lecon, et personne ne relit un libelle. On le compare
         donc au <h1> du fichier. */
      if (fs.existsSync(fichier)) {
        var brutLecon = fs.readFileSync(fichier, "utf8");
        var h1 = /<h1[^>]*>([\s\S]*?)<\/h1>/.exec(brutLecon);
        compare("titre de " + sc.lecons[j], h1 ? h1[1].trim() : "(pas de h1)",
          S.TITRES_LECONS[sc.lecons[j]] || "(absent de TITRES_LECONS)");
      }
      if (!lecons[sc.lecons[j]]) lecons[sc.lecons[j]] = [];
      lecons[sc.lecons[j]].push(sc.id);
    }
  }

  /* La table de js/lecon.js doit dire exactement la meme chose : sinon une lecon
     renverrait vers un scenario qui ne la concerne pas, et personne ne le
     verrait — la page s'ouvre tres bien sur un mauvais lien. */
  contexteCourant = "invariants — table de js/lecon.js";
  var source = fs.readFileSync(path.join(RACINE, "js", "lecon.js"), "utf8");
  var m = /var SCENARIOS_GIT = (\{[\s\S]*?\});/.exec(source);
  exige("js/lecon.js declare SCENARIOS_GIT", !!m);
  if (m) {
    var table = null;
    try { table = JSON.parse(m[1]); } catch (e) { table = null; }
    exige("SCENARIOS_GIT est du JSON valide", !!table);
    if (table) {
      compare("table lecon -> scenario", JSON.stringify(lecons, Object.keys(lecons).sort()),
        JSON.stringify(table, Object.keys(table).sort()));
    }
  }

  /* La seconde recopie de js/lecon.js : le TITRE de chaque scenario, affiche
     dans l'encart des lecons. Meme raison, meme controle. */
  contexteCourant = "invariants — titres des scenarios dans js/lecon.js";
  var mt = /var TITRES_SCENARIOS_GIT = (\{[\s\S]*?\});/.exec(source);
  exige("js/lecon.js declare TITRES_SCENARIOS_GIT", !!mt);
  if (mt) {
    var tableT = null;
    try { tableT = JSON.parse(mt[1]); } catch (e) { tableT = null; }
    exige("TITRES_SCENARIOS_GIT est du JSON valide", !!tableT);
    if (tableT) {
      var attendus = {};
      for (var q = 0; q < S.SCENARIOS.length; q++) attendus[S.SCENARIOS[q].id] = S.SCENARIOS[q].titre;
      compare("titres des scenarios", JSON.stringify(attendus, Object.keys(attendus).sort()),
        JSON.stringify(tableT, Object.keys(tableT).sort()));
    }
  }

  /* La page doit charger les deux scripts neufs, et le cours doit mener aux
     scenarios : un module qu'aucune page ne charge n'enseigne rien. */
  contexteCourant = "invariants — la page";
  var page = fs.readFileSync(path.join(RACINE, "pages", "git-bac-a-sable.html"), "utf8");
  exige("la page charge js/git-coquille.js", page.indexOf("../js/git-coquille.js") >= 0);
  exige("la page charge js/git-scenarios.js", page.indexOf("../js/git-scenarios.js") >= 0);
  exige("la page porte l'hote des scenarios", page.indexOf('id="bac-scenarios"') >= 0);
  exige("aucune URL de CDN dans la page", !/cdnjs\.cloudflare\.com|fonts\.googleapis\.com|fonts\.gstatic\.com/.test(page));
  exige("la page porte l'ancre #situations que le cours cite", page.indexOf('id="situations"') >= 0);
  var cours = fs.readFileSync(path.join(RACINE, "pages", "git", "cours.html"), "utf8");
  exige("le cours `git` mene aux situations guidees", cours.indexOf("git-bac-a-sable.html#situations") >= 0);
}

/* --- le programme ----------------------------------------------------------- */

function main() {
  var dispo = cp.spawnSync("git", ["--version"], { encoding: "utf8" });
  if (dispo.error || dispo.status !== 0) {
    console.log("git n'est pas disponible : etape sautee.");
    process.exit(2);
  }
  console.log("git : " + (dispo.stdout || "").trim());

  verifierInvariants();

  var parcours = 0, scenariosJoues = 0;
  var t0 = Date.now();

  for (var i = 0; i < S.SCENARIOS.length; i++) {
    var sc = S.SCENARIOS[i];
    if (SEUL && sc.id !== SEUL) continue;
    scenariosJoues++;
    var tombes = {};   // les objectifs `deja` qu'au moins un piege fait tomber

    /* 1. la mise en place, comparee a git, puis mesuree pour la vacuite.
       C'est la SEULE fois qu'on la compare : les parcours suivants la rejouent
       a l'identique, et la comparer a chaque fois triplerait les appels a git
       sans rien apprendre de neuf. */
    var m = monter(sc, true);
    contexteCourant = sc.id + " — apres la mise en place";
    comparerJournaux(m.dir, m.depot);
    var depart = S.evaluer(m.depot, sc);
    var departVivants = cheminsVivants(m.depot);
    exige("le scenario n'est pas deja reussi au depart", !depart.reussi);
    for (var o = 0; o < sc.objectifs.length; o++) {
      if (sc.objectifs[o].deja) {
        exige("objectif " + (o + 1) + " marque `deja` est bien vrai au depart", depart.objectifs[o].atteint,
          sc.objectifs[o].texte);
      } else {
        exige("objectif " + (o + 1) + " est FAUX au depart (sinon il ne mesure rien)", !depart.objectifs[o].atteint,
          sc.objectifs[o].texte);
      }
    }
    menage(m.dir);

    /* 2. la solution publiee ATTEINT le but */
    var chemins = [{ genre: "solution", nom: "la solution publiee", lignes: sc.solution, attendu: true }];
    for (var v = 0; v < (sc.variantes || []).length; v++) {
      chemins.push({ genre: "variante", nom: sc.variantes[v].nom, lignes: sc.variantes[v].lignes, attendu: true });
    }
    for (var p = 0; p < (sc.pieges || []).length; p++) {
      chemins.push({
        genre: "piege", nom: sc.pieges[p].nom, lignes: sc.pieges[p].lignes,
        attendu: false, rate: rates(sc.pieges[p])
      });
    }
    /* ⚠️ LES TRICHES. Un controle qui n'observe que trois points — l'etat de
       depart, la solution, les pieges — ne voit pas qu'un predicat a ete
       AFFAIBLI : la preuve en a ete faite, une mutation remplacant une condition
       d'ancestralite par un simple titre restait verte. Les triches sont les
       chemins qui REUSSISSAIENT alors qu'ils ne resolvaient rien ; chacune est
       une faute reelle, trouvee par execution, et devenue non-regression. On
       n'exige pas d'elles qu'elles ratent un objectif precis : seulement que le
       scenario ne les declare pas reussies. */
    for (var t = 0; t < (sc.triches || []).length; t++) {
      chemins.push({
        genre: "triche", nom: sc.triches[t].nom, lignes: sc.triches[t].lignes,
        attendu: false, rate: [], triche: true
      });
    }

    for (var k = 0; k < chemins.length; k++) {
      var ch = chemins[k];
      parcours++;
      var etat = monter(sc, false);
      var lignes = lignesDe(ch.lignes, etat.depot);
      contexteCourant = sc.id + " / " + ch.genre + " « " + ch.nom + " »";
      exige("le parcours « " + ch.nom + " » n'est pas vide", lignes.length > 0);
      jouerLignes(etat.dir, etat.depot, lignes, true, sc.id + "/" + ch.nom);
      contexteCourant = sc.id + " / " + ch.genre + " « " + ch.nom + " » — bilan";
      comparerJournaux(etat.dir, etat.depot);

      var bilan = S.evaluer(etat.depot, sc);
      if (ch.attendu) {
        exige("« " + ch.nom + " » atteint le but", bilan.reussi,
          bilan.objectifs.filter(function (x) { return !x.atteint; }).map(function (x) { return x.texte; }).join(" / "));
        /* Rien de ce que la situation avait ne doit avoir disparu. */
        var apresVivants = cheminsVivants(etat.depot);
        var perdus = departVivants.filter(function (c) { return apresVivants.indexOf(c) < 0; });
        exige("« " + ch.nom + " » ne fait disparaitre aucun fichier", perdus.length === 0, perdus.join(" | "));
      } else {
        exige("« " + ch.nom + " » n'atteint PAS le but", !bilan.reussi);
        if (ch.triche) { menage(etat.dir); continue; }
        for (var y = 0; y < ch.rate.length; y++) {
          var num = ch.rate[y];
          exige("« " + ch.nom + " » rate bien l'objectif " + num, !bilan.objectifs[num - 1].atteint,
            bilan.objectifs[num - 1].texte);
          if (sc.objectifs[num - 1].deja) tombes[num] = true;
        }
        /* ⚠️ ET RIEN QUE CEUX-LA. Un `rate` qui n'annonce qu'un objectif sur
           trois n'est pas faux, il est incomplet — et l'incomplet ne se voit
           jamais : 15 pieges sur 23 sous-declaraient ce qu'ils cassaient, si
           bien qu'on pouvait affaiblir un piege sans que l'outil rougisse. Le
           champ dit desormais TOUT ce que le piege manque. */
        var reellementRates = [];
        for (var z = 0; z < bilan.objectifs.length; z++) {
          if (!bilan.objectifs[z].atteint) reellementRates.push(z + 1);
          if (!bilan.objectifs[z].atteint && sc.objectifs[z].deja) tombes[z + 1] = true;
        }
        compare("objectifs rates par « " + ch.nom + " »", reellementRates.join(","), ch.rate.slice().sort(function (a, b) { return a - b; }).join(","));
      }
      menage(etat.dir);
    }

    /* 3. un objectif de CONSERVATION doit tomber au moins une fois : sans cela,
       il est vrai du debut a la fin et ne distingue rien. */
    contexteCourant = sc.id + " — les objectifs de conservation";
    for (var d = 0; d < sc.objectifs.length; d++) {
      if (!sc.objectifs[d].deja) continue;
      exige("l'objectif " + (d + 1) + " (conservation) est mis en defaut par au moins un piege",
        !!tombes[d + 1], sc.objectifs[d].texte);
    }
  }

  var duree = ((Date.now() - t0) / 1000).toFixed(1);
  console.log("\nScenarios joues : " + scenariosJoues + "   parcours : " + parcours
    + "   comparaisons : " + comparaisons + "   duree : " + duree + " s");

  if (!ecarts.length) {
    console.log("VERT — les scenarios guides concordent avec le vrai git, la solution atteint le but, les pieges echouent.");
    process.exit(0);
  }
  console.log("\nROUGE — " + ecarts.length + " ecart(s) :");
  for (var e = 0; e < Math.min(ecarts.length, 40); e++) {
    console.log("\n  [" + ecarts[e].ou + "] " + ecarts[e].quoi);
    console.log("    git    : " + ecarts[e].git.slice(0, 400));
    console.log("    modele : " + ecarts[e].modele.slice(0, 400));
  }
  if (ecarts.length > 40) console.log("\n  … et " + (ecarts.length - 40) + " autre(s).");
  process.exit(1);
}

try {
  main();
} catch (err) {
  if (err instanceof ArretVite) {
    console.log("ROUGE (arret au premier ecart) : [" + ecarts[0].ou + "] " + ecarts[0].quoi);
    process.exit(1);
  }
  throw err;
}
