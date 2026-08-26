/* =============================================================================
   verif-git-modele.js — le modele de depot (js/git-modele.js, chantier V14 D1)
   confronte au VRAI git. Node pur, ZERO dependance.

   POURQUOI CET OUTIL EXISTE
   Un simulateur de Git est une affirmation permanente : « voila ce que Git
   ferait ». Rien ne distingue, a la lecture, un modele juste d'un modele qui a
   l'air juste — c'est exactement ce qui a laisse passer cinq exemples faux sous
   quatre verificateurs verts. Donc on ne relit pas le modele : on monte LE MEME
   scenario dans un vrai depot git et on compare les resultats.

   CE QUI EST COMPARE, dans un depot temporaire jete a la fin :
     1. blobs      : empreinte du modele  vs  git hash-object --stdin
     2. arbres     : empreinte du modele  vs  git write-tree   (chemins imbriques,
                     accents, et le piege du tri « lib » / « lib.txt »)
     3. commits    : empreinte du modele  vs  git commit-tree  (dates et identite
                     fixees des deux cotes, sinon rien n'est comparable)
     3bis. porcelaine : `git add` puis `git commit -m` de bout en bout, empreinte
                     comparee a celle du modele (prouve aussi la regle de
                     normalisation du message, que commit-tree n'applique pas)
     4. graphe     : rev-parse HEAD~n / HEAD^2 et merge-base sur un graphe avec
                     fusion, cote a cote
     5. statut     : la sortie du modele traduite au format `git status
                     --porcelain`, comparee ligne a ligne a la vraie

   CODE DE SORTIE : 0 tout concorde, 1 un ecart, 2 git absent (etape sautee).
   ============================================================================= */
"use strict";

var cp = require("child_process");
var fs = require("fs");
var os = require("os");
var path = require("path");

/* --modele=<chemin> : charger une AUTRE copie du modele. Sert a la passe de
   mutation (scratchpad/v14-d1/mutations.js) : on abime volontairement une regle
   du modele et cet outil doit s'en apercevoir. Un controle qui ne detecte pas
   une faute injectee rend un vert par vacuite. */
var argModele = process.argv.slice(2).filter(function (a) { return a.indexOf("--modele=") === 0; })[0];
var CHEMIN_MODELE = argModele ? argModele.slice(9) : path.join(__dirname, "..", "js", "git-modele.js");
var GitModele = require(path.resolve(CHEMIN_MODELE));
var Depot = GitModele.Depot;

var IDENTITE_NOM = "Apprenant";
var IDENTITE_MAIL = "apprenant@syntaxe.invalid";
var IDENTITE = IDENTITE_NOM + " <" + IDENTITE_MAIL + ">";

var comparaisons = 0;
var ecarts = [];

function compare(quoi, attendu, obtenu) {
  comparaisons++;
  if (String(attendu) !== String(obtenu)) {
    ecarts.push({ quoi: quoi, git: String(attendu), modele: String(obtenu) });
  }
}

/* --- le vrai git ---------------------------------------------------------- */

var ENV = Object.assign({}, process.env, {
  GIT_AUTHOR_NAME: IDENTITE_NOM,
  GIT_AUTHOR_EMAIL: IDENTITE_MAIL,
  GIT_COMMITTER_NAME: IDENTITE_NOM,
  GIT_COMMITTER_EMAIL: IDENTITE_MAIL,
  /* La config de la machine ne doit rien changer au resultat. `os.devNull` ne
     convient pas : sous Windows, git refuse « //./nul » comme fichier de config.
     On lui donne donc un vrai fichier vide, ecrit a cote du depot temporaire. */
  GIT_CONFIG_GLOBAL: configVide(),
  GIT_CONFIG_SYSTEM: configVide(),
  LC_ALL: "C"
});

var CHEMIN_CONFIG_VIDE = null;
function configVide() {
  if (!CHEMIN_CONFIG_VIDE) {
    CHEMIN_CONFIG_VIDE = path.join(fs.mkdtempSync(path.join(os.tmpdir(), "syntaxe-gitconf-")), "config-vide");
    fs.writeFileSync(CHEMIN_CONFIG_VIDE, "", "utf8");
  }
  return CHEMIN_CONFIG_VIDE;
}

function git(depot, args, entree) {
  return cp.execFileSync("git", ["-C", depot].concat(args), {
    env: ENV,
    input: entree,
    encoding: "utf8",
    maxBuffer: 8 * 1024 * 1024
  });
}

function gitBrut(depot, args, entree) { return git(depot, args, entree).replace(/\r?\n$/, ""); }

function creerDepotReel() {
  var dir = fs.mkdtempSync(path.join(os.tmpdir(), "syntaxe-git-"));
  cp.execFileSync("git", ["init", "-q", "-b", "main", dir], { env: ENV });
  /* autocrlf casserait la comparaison : sous Windows, git reecrirait les fins de
     ligne a l'indexation et hacherait donc AUTRE CHOSE que ce qu'on lui donne. */
  git(dir, ["config", "core.autocrlf", "false"]);
  git(dir, ["config", "core.filemode", "false"]);
  git(dir, ["config", "core.safecrlf", "false"]);
  return dir;
}

function ecrire(dir, chemin, contenu) {
  var complet = path.join(dir, chemin);
  fs.mkdirSync(path.dirname(complet), { recursive: true });
  fs.writeFileSync(complet, contenu, "utf8");
}

/* --- 1. blobs ------------------------------------------------------------- */

function etapeBlobs(dir) {
  var cas = [
    "",
    "bonjour\n",
    "bonjour",                                   // sans saut de ligne final
    "ligne 1\nligne 2\nligne 3\n",
    "des accents : ete, ou, ca, naif\n",         // ASCII de controle
    "des accents : été, où, ça, naïf\n",         // les memes en UTF-8 reel
    "# Titre\n\nUn paragraphe.\n",
    "\n\n\n",
    "a\tb\tc\n",
    "caractere nul absent, mais \"guillemets\" et 'apostrophes'\n",
    "emoji : \u{1F600}\n",
    new Array(300).join("x") + "\n"              // au-dela d'un bloc SHA-1
  ];
  for (var i = 0; i < cas.length; i++) {
    var reel = gitBrut(dir, ["hash-object", "--stdin"], cas[i]);
    compare("blob #" + (i + 1), reel, Depot.empreinteBlob(cas[i]));
  }
  return cas.length;
}

/* --- 2. arbres ------------------------------------------------------------ */

/* Les jeux de fichiers sont choisis pour leurs pieges de TRI : « lib » (un
   repertoire) contre « lib.txt » (un fichier) — git compare « lib/ » et
   « lib.txt », donc le repertoire passe APRES ; et des noms accentues, ou
   comparer des chaines JavaScript ne donne pas l'ordre des octets. */
var JEUX_ARBRES = [
  { nom: "plat", fichiers: { "a.txt": "A\n", "b.txt": "B\n", "c.txt": "C\n" } },
  { nom: "imbrique", fichiers: { "src/index.js": "console.log(1);\n", "src/lib/util.js": "export {};\n", "README.md": "# titre\n" } },
  { nom: "tri lib / lib.txt", fichiers: { "lib.txt": "fichier\n", "lib/a.txt": "dans le dossier\n", "libre.txt": "autre\n" } },
  { nom: "accents", fichiers: { "été.txt": "chaud\n", "eau.txt": "froid\n", "zèbre.txt": "raye\n", "z.txt": "z\n" } },
  { nom: "profond", fichiers: { "a/b/c/d/e.txt": "profond\n", "a/b/x.txt": "moins\n", "a/z.txt": "peu\n" } },
  { nom: "un seul fichier", fichiers: { "seul.txt": "" } }
];

function etapeArbres(dir) {
  for (var i = 0; i < JEUX_ARBRES.length; i++) {
    var jeu = JEUX_ARBRES[i];
    // cote git : on repart d'un index vide a chaque jeu
    git(dir, ["rm", "-r", "-q", "--cached", "-f", "--ignore-unmatch", "."]);
    var d = new Depot();
    for (var chemin in jeu.fichiers) {
      if (!Object.prototype.hasOwnProperty.call(jeu.fichiers, chemin)) continue;
      ecrire(dir, chemin, jeu.fichiers[chemin]);
      git(dir, ["add", "--", chemin]);
      d.ecrireFichier(chemin, jeu.fichiers[chemin]);
      d.indexer(chemin);
    }
    var reel = gitBrut(dir, ["write-tree"]);
    var mien = d.ecrireArbre();
    compare("arbre « " + jeu.nom + " »", reel, mien);

    /* Et l'inverse : relire l'arbre du modele doit rendre exactement les memes
       chemins et empreintes que `git ls-tree -r`. Un arbre juste mal relu
       donnerait un checkout faux sans qu'aucune empreinte ne bouge. */
    /* core.quotePath=false : sans cela git rend le nom accentue echappe en
       octal, et on comparerait son echappement, pas le modele. */
    var lignes = gitBrut(dir, ["-c", "core.quotePath=false", "ls-tree", "-r", "--full-tree", reel]).split("\n").filter(Boolean);
    var attenduPlat = lignes.map(function (l) {
      var m = /^(\d+) (\w+) ([0-9a-f]{40})\t(.*)$/.exec(l);
      return m[4] + " " + m[1] + " " + m[3];
    }).sort().join(" | ");
    var plat = d.lireArbre(mien);
    var obtenuPlat = Object.keys(plat).map(function (c) {
      return c + " " + plat[c].mode + " " + plat[c].oid;
    }).sort().join(" | ");
    compare("relecture de l'arbre « " + jeu.nom + " »", attenduPlat, obtenuPlat);
  }
  return JEUX_ARBRES.length * 2;
}

/* --- 3. commits ----------------------------------------------------------- */

/* Un commit contient sa date et son auteur : sans les fixer des deux cotes, les
   empreintes different toujours et la comparaison ne prouve rien. */
function normaliser(message) {
  return message.slice(-1) === "\n" ? message : message + "\n";
}

function commitReel(dir, arbre, parents, message, instant) {
  /* `git commit-tree` prend le message BRUT ; la porcelaine `git commit -m` lui
     garantit un saut de ligne final (mesure : etape 3bis ci-dessous). Le modele
     simule la porcelaine, on donne donc ici le message deja normalise — sinon on
     comparerait deux conventions, et non deux implementations. */
  message = normaliser(message);
  var args = ["commit-tree", arbre];
  for (var i = 0; i < parents.length; i++) args.push("-p", parents[i]);
  var env = Object.assign({}, ENV, {
    GIT_AUTHOR_DATE: instant + " +0000",
    GIT_COMMITTER_DATE: instant + " +0000"
  });
  return cp.execFileSync("git", ["-C", dir].concat(args), {
    env: env, input: message, encoding: "utf8"
  }).replace(/\r?\n$/, "");
}

var CAS_COMMITS = [
  { message: "Premier commit\n", instant: 1704067200, parents: 0 },
  { message: "Sans saut de ligne final", instant: 1704067260, parents: 1 },
  { message: "Corrige l'accès à la clé\n", instant: 1704070800, parents: 1 },
  { message: "Titre\n\nUn corps de message,\nsur deux lignes.\n", instant: 1712000000, parents: 1 },
  { message: "Fusion de deux histoires\n", instant: 1712003600, parents: 2 }
];

function etapeCommits(dir) {
  var d = new Depot();
  d.ecrireFichier("a.txt", "contenu initial\n");
  d.indexer("a.txt");
  var arbre = d.ecrireArbre();

  ecrire(dir, "a.txt", "contenu initial\n");
  git(dir, ["rm", "-r", "-q", "--cached", "-f", "--ignore-unmatch", "."]);
  git(dir, ["add", "--", "a.txt"]);
  var arbreReel = gitBrut(dir, ["write-tree"]);
  compare("arbre de base des commits", arbreReel, arbre);

  var chaineReelle = [], chaineMienne = [];
  for (var i = 0; i < CAS_COMMITS.length; i++) {
    var cas = CAS_COMMITS[i];
    var parentsReels = chaineReelle.slice(-cas.parents);
    var parentsMiens = chaineMienne.slice(-cas.parents);
    var reel = commitReel(dir, arbreReel, parentsReels, cas.message, cas.instant);
    var mien = d.creerCommit({
      arbre: arbre, parents: parentsMiens, message: cas.message,
      instant: cas.instant, identite: IDENTITE, fuseau: "+0000"
    });
    compare("commit #" + (i + 1) + " (" + cas.message.split("\n")[0] + ")", reel, mien);
    chaineReelle.push(reel);
    chaineMienne.push(mien);

    /* Relire ce qu'on vient d'ecrire : le modele doit retrouver le meme arbre,
       les memes parents et le meme titre que `git cat-file`. */
    var brut = git(dir, ["cat-file", "commit", reel]);
    var lu = d.lireCommit(mien);
    compare("relecture #" + (i + 1) + " : arbre", /tree ([0-9a-f]{40})/.exec(brut)[1], lu.arbre);
    var parentsCatFile = (brut.match(/parent [0-9a-f]{40}/g) || []).map(function (l) { return l.slice(7); });
    compare("relecture #" + (i + 1) + " : parents", parentsCatFile.join(","), lu.parents.join(","));
  }
  return CAS_COMMITS.length * 3 + 1;
}

/* --- 3bis. la porcelaine : `git add` + `git commit -m` de bout en bout ------ */

/* L'etape precedente compare le modele a la PLOMBERIE. Celle-ci le compare a ce
   que l'apprenant tape vraiment : deux commandes, une empreinte a l'arrivee.
   Elle prouve au passage la regle de normalisation du message — un point qu'on
   ne peut pas trancher a la lecture, seulement en le faisant tourner. */
var CAS_PORCELAINE = [
  { fichier: "notes.txt", contenu: "premiere note\n", message: "Ajoute les notes" },
  { fichier: "notes.txt", contenu: "premiere note\ndeuxieme note\n", message: "Complete les notes\n" },
  { fichier: "docs/résumé.md", contenu: "# Résumé\n\nÉcrit en français.\n", message: "Corrige l'accès à la clé" },
  { fichier: "docs/résumé.md", contenu: "# Résumé\n\nRéécrit.\n", message: "Titre court\n\nUn corps de message,\nsur deux lignes." }
];

function etapePorcelaine() {
  var dir = creerDepotReel();
  try {
    var d = new Depot();
    var instant = 1704067200;
    for (var i = 0; i < CAS_PORCELAINE.length; i++) {
      var cas = CAS_PORCELAINE[i];
      var env = Object.assign({}, ENV, {
        GIT_AUTHOR_DATE: instant + " +0000",
        GIT_COMMITTER_DATE: instant + " +0000"
      });
      ecrire(dir, cas.fichier, cas.contenu);
      cp.execFileSync("git", ["-C", dir, "add", "--", cas.fichier], { env: env });
      cp.execFileSync("git", ["-C", dir, "commit", "-q", "-m", cas.message], { env: env });
      var reel = cp.execFileSync("git", ["-C", dir, "rev-parse", "HEAD"], { env: env, encoding: "utf8" }).trim();

      d.ecrireFichier(cas.fichier, cas.contenu);
      d.indexer(cas.fichier);
      var mien = d.creerCommit({
        arbre: d.ecrireArbre(), parents: d.oidHEAD() ? [d.oidHEAD()] : [],
        message: cas.message, instant: instant, identite: IDENTITE, fuseau: "+0000"
      });
      d.avancerHEAD(mien);
      compare("porcelaine #" + (i + 1) + " : add + commit -m « " + cas.message.split("\n")[0] + " »", reel, mien);
      instant += 60;
    }
    var journalReel = cp.execFileSync("git", ["-C", dir, "log", "--format=%H"], { env: ENV, encoding: "utf8" }).trim().split(/[\r]?[\n]/);
    compare("porcelaine : journal", journalReel.join(","), d.journal("HEAD").map(function (c) { return c.oid; }).join(","));
    var titresReels = cp.execFileSync("git", ["-C", dir, "log", "--format=%s"], { env: ENV, encoding: "utf8" }).trim().split(/[\r]?[\n]/);
    compare("porcelaine : titres", titresReels.join(" | "), d.journal("HEAD").map(function (c) { return c.titre; }).join(" | "));
    return CAS_PORCELAINE.length + 2;
  } finally {
    try { fs.rmSync(dir, { recursive: true, force: true }); } catch (e) { /* Windows tient parfois un fichier */ }
  }
}

/* --- 4. le graphe : ancetres, HEAD~n, merge-base --------------------------- */

/* On rejoue la meme histoire des deux cotes, commit par commit :
       main   C1 --- C2 -------- C4 (fusion)
                \              /
       sujet     C3 ----------
   puis on demande a chacun ce que valent HEAD~1, HEAD^2, et la base de fusion. */
function etapeGraphe(dir) {
  var d = new Depot();
  var t = 1704067200;
  var reels = {}, miens = {};

  function pas(cle, fichier, contenu, message, parentsCles, brancheModele) {
    ecrire(dir, fichier, contenu);
    git(dir, ["add", "--", fichier]);
    var arbreReel = gitBrut(dir, ["write-tree"]);
    var parentsReels = parentsCles.map(function (k) { return reels[k]; });
    reels[cle] = commitReel(dir, arbreReel, parentsReels, message + "\n", t);

    d.ecrireFichier(fichier, contenu);
    d.indexer(fichier);
    var arbreMien = d.ecrireArbre();
    compare("graphe " + cle + " : arbre", arbreReel, arbreMien);
    miens[cle] = d.creerCommit({
      arbre: arbreMien, parents: parentsCles.map(function (k) { return miens[k]; }),
      message: message + "\n", instant: t, identite: IDENTITE, fuseau: "+0000"
    });
    compare("graphe " + cle + " : commit", reels[cle], miens[cle]);
    d.majRef("refs/heads/" + brancheModele, miens[cle]);
    git(dir, ["update-ref", "refs/heads/" + brancheModele, reels[cle]]);
    t += 60;
  }

  function reprendre(cle) {
    /* Revenir a l'etat d'un commit : cote git on remet l'index et le disque,
       cote modele c'est `materialiser`. */
    git(dir, ["read-tree", "-u", "--reset", reels[cle]]);
    d.materialiser(d.lireCommit(miens[cle]).arbre);
    // le repertoire de travail reel garde les fichiers ignores : on aligne
    var plat = d.lireArbre(d.lireCommit(miens[cle]).arbre);
    for (var chemin in plat) if (Object.prototype.hasOwnProperty.call(plat, chemin)) {
      ecrire(dir, chemin, d.lireBlob(plat[chemin].oid));
    }
  }

  pas("C1", "a.txt", "un\n", "C1 racine", [], "main");
  pas("C2", "a.txt", "deux\n", "C2 sur main", ["C1"], "main");
  reprendre("C1");
  pas("C3", "b.txt", "sujet\n", "C3 sur sujet", ["C1"], "sujet");
  reprendre("C2");
  ecrire(dir, "b.txt", "sujet\n");
  git(dir, ["add", "--", "b.txt"]);
  d.ecrireFichier("b.txt", "sujet\n");
  d.indexer("b.txt");
  var arbreFusionReel = gitBrut(dir, ["write-tree"]);
  var arbreFusionMien = d.ecrireArbre();
  compare("graphe C4 : arbre de fusion", arbreFusionReel, arbreFusionMien);
  reels.C4 = commitReel(dir, arbreFusionReel, [reels.C2, reels.C3], "C4 fusion\n", t);
  miens.C4 = d.creerCommit({
    arbre: arbreFusionMien, parents: [miens.C2, miens.C3], message: "C4 fusion\n",
    instant: t, identite: IDENTITE, fuseau: "+0000"
  });
  compare("graphe C4 : commit de fusion", reels.C4, miens.C4);
  git(dir, ["update-ref", "refs/heads/main", reels.C4]);
  d.majRef("refs/heads/main", miens.C4);
  git(dir, ["symbolic-ref", "HEAD", "refs/heads/main"]);
  d.pointerHEAD("refs/heads/main");

  /* Les questions que le bac a sable devra savoir repondre. */
  var revisions = ["HEAD", "HEAD~1", "HEAD~2", "HEAD^", "HEAD^2", "HEAD^2~1", "main~1", "sujet", "sujet~1", "HEAD~3"];
  for (var i = 0; i < revisions.length; i++) {
    var reel;
    try { reel = gitBrut(dir, ["rev-parse", "--verify", "-q", revisions[i] + "^{commit}"]); }
    catch (e) { reel = "(inexistant)"; }
    var mien;
    try { mien = d.resoudre(revisions[i]) || "(inexistant)"; }
    catch (e2) { mien = "(erreur : " + e2.message + ")"; }
    compare("rev-parse " + revisions[i], reel, mien);
  }

  var paires = [["main", "sujet"], ["sujet", "main"], ["HEAD", "HEAD"], ["main", "main~1"], ["sujet", "main~1"]];
  for (i = 0; i < paires.length; i++) {
    var attendu = gitBrut(dir, ["merge-base", paires[i][0], paires[i][1]]);
    compare("merge-base " + paires[i].join(" "), attendu, d.baseDeFusion(paires[i][0], paires[i][1]));
  }

  /* est-ce un ancetre ? — `git merge-base --is-ancestor` rend un code de sortie */
  var questions = [["C1", "C4", true], ["C3", "C2", false], ["C2", "C4", true], ["C4", "C1", false]];
  for (i = 0; i < questions.length; i++) {
    var q = questions[i];
    var codeReel;
    try { cp.execFileSync("git", ["-C", dir, "merge-base", "--is-ancestor", reels[q[0]], reels[q[1]]], { env: ENV }); codeReel = true; }
    catch (e3) { codeReel = false; }
    compare("est-ancetre " + q[0] + " -> " + q[1], codeReel, d.estAncetre(miens[q[0]], miens[q[1]]));
  }

  /* le journal : meme suite de commits, dans le meme ordre */
  var journalReel = gitBrut(dir, ["log", "--format=%H", "HEAD"]).split("\n");
  var journalMien = d.journal("HEAD").map(function (c) { return c.oid; });
  compare("journal complet", journalReel.join(","), journalMien.join(","));

  return { comparaisons: revisions.length + paires.length + questions.length + 1, depot: d, reels: reels, miens: miens };
}

/* --- 5. le statut --------------------------------------------------------- */

/* Traduit la sortie du modele au format `git status --porcelain` v1 :
   deux colonnes, index puis repertoire de travail. */
function porcelaineDuModele(statut) {
  /* Object.create(null) : avec un objet ordinaire, un fichier nomme
     « constructor » ou « __proto__ » se perdait ICI, dans le traducteur, et
     masquait la faute du modele. Un controle qui reproduit le defaut de ce
     qu'il controle rend un vert par vacuite. */
  var lignes = Object.create(null);
  function poser(chemin, x, y) {
    if (!Object.prototype.hasOwnProperty.call(lignes, chemin)) lignes[chemin] = [" ", " "];
    if (x) lignes[chemin][0] = x;
    if (y) lignes[chemin][1] = y;
  }
  var codes = { "nouveau": "A", "modifié": "M", "supprimé": "D", "type": "T" };
  statut.indexes.forEach(function (e) { poser(e.chemin, codes[e.etat], null); });
  statut.modifies.forEach(function (c) { poser(c, null, "M"); });
  statut.supprimes.forEach(function (c) { poser(c, null, "D"); });
  var out = [];
  for (var chemin in lignes) {
    if (!Object.prototype.hasOwnProperty.call(lignes, chemin)) continue;
    out.push(lignes[chemin].join("") + " " + chemin);
  }
  statut.nonSuivis.forEach(function (c) { out.push("?? " + c); });
  return out.sort();
}

function etapeStatut(dir) {
  var d = new Depot();
  var depart = {
    "a.txt": "a initial\n", "b.txt": "b initial\n", "e.txt": "e initial\n",
    "f.txt": "f initial\n", "g.txt": "g initial\n"
  };
  git(dir, ["rm", "-r", "-q", "--cached", "-f", "--ignore-unmatch", "."]);
  for (var chemin in depart) {
    if (!Object.prototype.hasOwnProperty.call(depart, chemin)) continue;
    ecrire(dir, chemin, depart[chemin]);
    git(dir, ["add", "--", chemin]);
    d.ecrireFichier(chemin, depart[chemin]);
    d.indexer(chemin);
  }
  /* nettoyer les restes des etapes precedentes du repertoire de travail reel */
  fs.readdirSync(dir).forEach(function (entree) {
    if (entree === ".git" || Object.prototype.hasOwnProperty.call(depart, entree)) return;
    fs.rmSync(path.join(dir, entree), { recursive: true, force: true });
  });

  var arbre = gitBrut(dir, ["write-tree"]);
  var commit = commitReel(dir, arbre, [], "etat de depart\n", 1704067200);
  git(dir, ["update-ref", "refs/heads/main", commit]);
  git(dir, ["symbolic-ref", "HEAD", "refs/heads/main"]);
  var mien = d.creerCommit({ arbre: d.ecrireArbre(), parents: [], message: "etat de depart\n", instant: 1704067200, identite: IDENTITE, fuseau: "+0000" });
  d.majRef("refs/heads/main", mien);
  compare("statut : commit de depart", commit, mien);

  var etats = [
    { nom: "tout propre", faire: function () {} },
    {
      nom: "modifie et indexe (X=M)",
      faire: function () {
        ecrire(dir, "a.txt", "a modifie\n"); git(dir, ["add", "--", "a.txt"]);
        d.ecrireFichier("a.txt", "a modifie\n"); d.indexer("a.txt");
      }
    },
    {
      nom: "modifie sans indexer (Y=M)",
      faire: function () {
        ecrire(dir, "b.txt", "b modifie\n");
        d.ecrireFichier("b.txt", "b modifie\n");
      }
    },
    {
      nom: "indexe puis remodifie (MM)",
      faire: function () {
        ecrire(dir, "a.txt", "a encore modifie\n");
        d.ecrireFichier("a.txt", "a encore modifie\n");
      }
    },
    {
      nom: "fichier neuf non suivi (??)",
      faire: function () {
        ecrire(dir, "c.txt", "tout neuf\n");
        d.ecrireFichier("c.txt", "tout neuf\n");
      }
    },
    {
      nom: "fichier neuf indexe (A)",
      faire: function () {
        ecrire(dir, "d.txt", "ajoute\n"); git(dir, ["add", "--", "d.txt"]);
        d.ecrireFichier("d.txt", "ajoute\n"); d.indexer("d.txt");
      }
    },
    {
      nom: "efface du disque (Y=D)",
      faire: function () {
        fs.rmSync(path.join(dir, "e.txt"));
        d.supprimerFichier("e.txt");
      }
    },
    {
      nom: "retire de l'index seulement (D + ??)",
      faire: function () {
        git(dir, ["rm", "-q", "--cached", "--", "f.txt"]);
        delete d.index["f.txt"];
      }
    },
    {
      nom: "efface partout (X=D)",
      faire: function () {
        git(dir, ["rm", "-q", "-f", "--", "g.txt"]);
        d.supprimerFichier("g.txt"); d.indexer("g.txt");
      }
    }
  ];

  for (var i = 0; i < etats.length; i++) {
    etats[i].faire();
    var reel = git(dir, ["status", "--porcelain"]).split(/\r?\n/).filter(Boolean).sort().join(" | ");
    var obtenu = porcelaineDuModele(d.statut()).join(" | ");
    compare("statut « " + etats[i].nom + " »", reel, obtenu);
  }
  return etats.length + 1;
}

/* --- 6. les diffs d'arbres ------------------------------------------------ */

function etapeDiff(dir, contexte) {
  var d = contexte.depot, reels = contexte.reels, miens = contexte.miens;
  var paires = [["C1", "C2"], ["C1", "C3"], ["C2", "C4"], ["C3", "C4"], ["C1", "C4"], ["C4", "C1"]];
  var codes = { A: "ajouté", M: "modifié", D: "supprimé" };
  for (var i = 0; i < paires.length; i++) {
    var a = paires[i][0], b = paires[i][1];
    var brut = gitBrut(dir, ["diff", "--name-status", reels[a], reels[b]]);
    var attendu = brut.split(/\r?\n/).filter(Boolean).map(function (l) {
      var m = /^(\w)\s+(.*)$/.exec(l);
      return m[2] + ":" + (codes[m[1]] || m[1]);
    }).sort().join(",");
    var arbreA = d.lireCommit(miens[a]).arbre, arbreB = d.lireCommit(miens[b]).arbre;
    var obtenu = d.diffArbres(arbreA, arbreB).map(function (e) { return e.chemin + ":" + e.etat; }).sort().join(",");
    compare("diff " + a + " -> " + b, attendu, obtenu);
  }
  return paires.length;
}

/* --- 7. export / import --------------------------------------------------- */

function etapeSerialisation(contexte) {
  var d = contexte.depot;
  var copie = Depot.importer(JSON.parse(JSON.stringify(d.exporter())));
  compare("serialisation : HEAD", d.oidHEAD(), copie.oidHEAD());
  compare("serialisation : branches", d.branches().join(","), copie.branches().join(","));
  compare("serialisation : nombre d'objets", Object.keys(d.objets).length, Object.keys(copie.objets).length);
  var journalA = d.journal("HEAD").map(function (c) { return c.oid; }).join(",");
  var journalB = copie.journal("HEAD").map(function (c) { return c.oid; }).join(",");
  compare("serialisation : journal", journalA, journalB);
  /* Un objet re-haché apres un aller-retour doit rendre la MEME empreinte, sinon
     l'export perd des octets en silence (accents, notamment). */
  var faux = 0;
  for (var oid in copie.objets) {
    if (!Object.prototype.hasOwnProperty.call(copie.objets, oid)) continue;
    if (GitModele.empreinte(copie.objets[oid].type, copie.objets[oid].corps) !== oid) faux++;
  }
  compare("serialisation : objets re-hachés faux", 0, faux);
  return 5;
}

/* --- 8. les noms qui sont des proprietes de Object.prototype ---------------- */

/* Un chemin est une donnee de l'apprenant. Trois passes adversariales ont montre
   qu'un fichier ou un dossier nomme `constructor`, `toString`, `valueOf`,
   `hasOwnProperty` ou `__proto__` faisait DISPARAITRE l'entree — ou ARRETAIT le
   bac a sable sur une exception. Ces noms sont donc controles a chaque passe. */
var NOMS_PIEGES = ["constructor", "toString", "valueOf", "hasOwnProperty", "isPrototypeOf", "__proto__", "prototype"];

function etapeNomsPieges() {
  var dir = creerDepotReel();
  try {
    var n = 0;
    NOMS_PIEGES.forEach(function (nom) {
      /* (a) le nom comme FICHIER a la racine, (b) le nom comme DOSSIER. */
      [[nom, nom], [nom + "/dedans.txt", nom + "/"]].forEach(function (paire) {
        var chemin = paire[0];
        git(dir, ["rm", "-r", "-q", "--cached", "-f", "--ignore-unmatch", "."]);
        fs.readdirSync(dir).forEach(function (e) {
          if (e === ".git") return;
          fs.rmSync(path.join(dir, e), { recursive: true, force: true });
        });
        var d = new Depot();
        ecrire(dir, chemin, "piege\n");
        ecrire(dir, "temoin.txt", "temoin\n");
        git(dir, ["add", "--", chemin, "temoin.txt"]);
        d.ecrireFichier(chemin, "piege\n"); d.indexer(chemin);
        d.ecrireFichier("temoin.txt", "temoin\n"); d.indexer("temoin.txt");
        var reel = gitBrut(dir, ["write-tree"]);
        var mien;
        try { mien = d.ecrireArbre(); } catch (e) { mien = "EXCEPTION : " + e.message; }
        compare("nom piege « " + paire[1] + " » : arbre", reel, mien);
        n++;
        /* et le statut : le fichier doit exister aux yeux du modele */
        var reelStatut = git(dir, ["status", "--porcelain", "-uall"]).split(/[\r]?[\n]/).filter(Boolean).sort().join(" | ");
        var mienStatut;
        try { mienStatut = porcelaineDuModele(d.statut()).join(" | "); } catch (e2) { mienStatut = "EXCEPTION : " + e2.message; }
        compare("nom piege « " + paire[1] + " » : statut", reelStatut, mienStatut);
        n++;
      });
    });
    return n;
  } finally {
    try { fs.rmSync(dir, { recursive: true, force: true }); } catch (e) { /* Windows */ }
  }
}

/* --- 9. l'ordre du journal : date de COMMITTEUR, et jamais un ancetre avant --- */

/* Deux regles qu'aucune lecture ne donne : `git log` trie sur la date du
   COMMITTEUR (un rebase garde la date d'auteur), et il ne sort jamais un commit
   avant l'un de ses descendants — ce qui se voit uniquement quand les dates sont
   EGALES, c'est-a-dire tout le temps avec l'horloge deterministe du bac a sable. */
function etapeOrdreDuJournal() {
  var dir = creerDepotReel();
  try {
    var n = 0;
    [
      { nom: "dates de committeur distinctes", auteurs: [0, 60, 120, 180, 12800], commits: [0, 60, 2800, 200, 12800] },
      { nom: "toutes les dates egales", auteurs: [0, 0, 0, 0, 0], commits: [0, 0, 0, 0, 0] },
      { nom: "dates d'auteur qui reculent", auteurs: [500, 400, 300, 200, 100], commits: [0, 60, 120, 180, 240] },
      /* Ici la RACINE est le second parent de la fusion : elle entre en file
         avant ses propres descendants. Sans garde topologique, elle sort avant
         eux — ce que git ne fait jamais. Les trois jeux ci-dessus ne le voyaient
         pas, l'ordre d'insertion suffisait a les rendre justes. */
      { nom: "fusion avec la racine (exige la garde topologique)", auteurs: [0, 0, 0, 0, 0], commits: [0, 0, 0, 0, 0],
        parents: [[], [0], [1], [2], [3, 0]] }
    ].forEach(function (jeu) {
      var base = 1704067200;
      ecrire(dir, "f.txt", "x\n");
      git(dir, ["add", "--", "f.txt"]);
      var arbre = gitBrut(dir, ["write-tree"]);
      var d = new Depot();
      d.ecrireFichier("f.txt", "x\n"); d.indexer("f.txt");
      var arbreMien = d.ecrireArbre();
      compare("journal « " + jeu.nom + " » : arbre", arbre, arbreMien); n++;

      var reels = [], miens = [];
      /* R -> A -> {B, C} -> M : une fusion, donc deux chemins a departager. */
      var parents = jeu.parents || [[], [0], [1], [1], [2, 3]];
      for (var i = 0; i < 5; i++) {
        var env = Object.assign({}, ENV, {
          GIT_AUTHOR_DATE: (base + jeu.auteurs[i]) + " +0000",
          GIT_COMMITTER_DATE: (base + jeu.commits[i]) + " +0000"
        });
        var args = ["commit-tree", arbre];
        parents[i].forEach(function (k) { args.push("-p", reels[k]); });
        reels.push(cp.execFileSync("git", ["-C", dir].concat(args), { env: env, input: "C" + i + "\n", encoding: "utf8" }).replace(/[\r]?[\n]$/, ""));
        miens.push(d.creerCommit({
          arbre: arbreMien, parents: parents[i].map(function (k) { return miens[k]; }),
          message: "C" + i + "\n", instant: base + jeu.auteurs[i], instantCommit: base + jeu.commits[i],
          identite: IDENTITE, fuseau: "+0000"
        }));
      }
      compare("journal « " + jeu.nom + " » : empreintes", reels.join(","), miens.join(",")); n++;
      git(dir, ["update-ref", "refs/heads/main", reels[4]]);
      d.majRef("refs/heads/main", miens[4]);
      var reel = gitBrut(dir, ["log", "--format=%H", "main"]);
      var mien = d.journal("main").map(function (c) { return c.oid; }).join("\n");
      compare("journal « " + jeu.nom + " » : ordre", reel, mien); n++;
    });
    return n;
  } finally {
    try { fs.rmSync(dir, { recursive: true, force: true }); } catch (e) { /* Windows */ }
  }
}

/* --- 10. references, modes, et l'etat apres un retour en arriere ------------- */

function etapeReferencesEtModes() {
  var dir = creerDepotReel();
  try {
    var n = 0;
    var d = new Depot();
    ecrire(dir, "a.txt", "un\n"); git(dir, ["add", "--", "a.txt"]);
    var arbre = gitBrut(dir, ["write-tree"]);
    d.ecrireFichier("a.txt", "un\n"); d.indexer("a.txt");
    var c1 = commitReel(dir, arbre, [], "C1", 1704067200);
    var m1 = d.creerCommit({ arbre: d.ecrireArbre(), parents: [], message: "C1", instant: 1704067200, identite: IDENTITE, fuseau: "+0000" });
    compare("refs : commit de base", c1, m1); n++;

    ecrire(dir, "b.txt", "deux\n"); git(dir, ["add", "--", "b.txt"]);
    var arbre2 = gitBrut(dir, ["write-tree"]);
    d.ecrireFichier("b.txt", "deux\n"); d.indexer("b.txt");
    var c2 = commitReel(dir, arbre2, [c1], "C2", 1704067260);
    var m2 = d.creerCommit({ arbre: d.ecrireArbre(), parents: [m1], message: "C2", instant: 1704067260, identite: IDENTITE, fuseau: "+0000" });
    compare("refs : deuxieme commit", c2, m2); n++;

    /* Une branche et une ETIQUETTE de meme nom : git donne la priorite a
       l'etiquette, ce qui n'est pas l'ordre auquel on pense. */
    git(dir, ["update-ref", "refs/heads/commun", c1]);
    git(dir, ["update-ref", "refs/tags/commun", c2]);
    git(dir, ["update-ref", "refs/heads/sujet", c2]);
    git(dir, ["update-ref", "refs/tags/v1", c1]);
    git(dir, ["symbolic-ref", "HEAD", "refs/heads/sujet"]);
    d.majRef("refs/heads/commun", m1);
    d.majRef("refs/tags/commun", m2);
    d.majRef("refs/heads/sujet", m2);
    d.majRef("refs/tags/v1", m1);
    d.pointerHEAD("refs/heads/sujet");
    ["commun", "commun~1", "heads/commun", "tags/commun", "heads/sujet", "tags/v1",
     "HEAD^{commit}", "sujet^{}", "HEAD", "sujet~1"].forEach(function (rev) {
      var reel;
      try { reel = gitBrut(dir, ["rev-parse", "--verify", "-q", rev + "^{commit}"]); }
      catch (e) { reel = "(inexistant)"; }
      var mien = d.resoudre(rev) || "(inexistant)";
      compare("rev-parse " + rev, reel, mien); n++;
    });

    /* pointerHEAD avec un nom COURT doit ATTACHER, pas detacher sur une chaine. */
    d.pointerHEAD("commun");
    compare("pointerHEAD nom court : HEAD", m1, d.oidHEAD()); n++;
    compare("pointerHEAD nom court : detachee", false, d.detachee()); n++;
    compare("pointerHEAD nom court : branche", "commun", d.brancheCourante()); n++;
    d.pointerHEAD(m2);
    compare("pointerHEAD sur un oid : detachee", true, d.detachee()); n++;
    compare("pointerHEAD sur un oid : HEAD", m2, d.oidHEAD()); n++;
    d.pointerHEAD("refs/heads/sujet");

    /* Le mode : un fichier rendu executable EST une modification pour git. */
    git(dir, ["update-index", "--chmod=+x", "a.txt"]);
    d.indexer("a.txt", GitModele.MODE_EXECUTABLE);
    compare("mode +x : arbre", gitBrut(dir, ["write-tree"]), d.ecrireArbre()); n++;
    var reelStatut = git(dir, ["status", "--porcelain", "-uall"]).split(/[\r]?[\n]/).filter(Boolean).sort().join(" | ");
    compare("mode +x : statut", reelStatut, porcelaineDuModele(d.statut()).join(" | ")); n++;

    /* Un checkout NE DETRUIT PAS les fichiers non suivis. */
    ecrire(dir, "brouillon.txt", "pas encore suivi\n");
    d.ecrireFichier("brouillon.txt", "pas encore suivi\n");
    git(dir, ["read-tree", "-u", "--reset", c1]);
    d.materialiser(d.lireCommit(m1).arbre);
    git(dir, ["update-ref", "refs/heads/sujet", c1]);
    d.majRef("refs/heads/sujet", m1);
    reelStatut = git(dir, ["status", "--porcelain", "-uall"]).split(/[\r]?[\n]/).filter(Boolean).sort().join(" | ");
    compare("checkout : le non-suivi survit", reelStatut, porcelaineDuModele(d.statut()).join(" | ")); n++;

    /* Un dossier remplace par un fichier de meme nom : l'index ne doit pas
       contenir les deux, sinon le vrai git refuse l'arbre. */
    var d2 = new Depot();
    d2.ecrireFichier("lib/a.txt", "dans le dossier\n"); d2.indexer("lib/a.txt");
    d2.supprimerFichier("lib/a.txt");
    d2.ecrireFichier("lib", "devenu un fichier\n"); d2.indexer("lib");
    compare("collision dossier/fichier : entrees de l'index", "lib", d2.cheminsIndex().join(",")); n++;
    var dir2 = creerDepotReel();
    try {
      ecrire(dir2, "lib/a.txt", "dans le dossier\n");
      cp.execFileSync("git", ["-C", dir2, "add", "--", "lib/a.txt"], { env: ENV });
      fs.rmSync(path.join(dir2, "lib"), { recursive: true, force: true });
      ecrire(dir2, "lib", "devenu un fichier\n");
      cp.execFileSync("git", ["-C", dir2, "add", "-A", "--", "lib"], { env: ENV });
      compare("collision dossier/fichier : arbre", gitBrut(dir2, ["write-tree"]), d2.ecrireArbre()); n++;
    } finally {
      try { fs.rmSync(dir2, { recursive: true, force: true }); } catch (e3) { /* Windows */ }
    }

    /* Deux imports du meme export doivent etre INDEPENDANTS. */
    var brut = JSON.parse(JSON.stringify(d.exporter()));
    var copie1 = Depot.importer(brut), copie2 = Depot.importer(brut);
    copie1.ecrireFichier("intrus.txt", "ecrit dans la copie 1\n");
    copie1.majRef("refs/heads/ajoutee", m1);
    compare("import : les copies sont independantes (travail)", "", copie2.cheminsTravail().filter(function (c) { return c === "intrus.txt"; }).join()); n++;
    compare("import : les copies sont independantes (refs)", "", copie2.branches().filter(function (b) { return b === "ajoutee"; }).join()); n++;
    compare("import : l'horloge est restauree", d.instant, copie2.instant); n++;
    compare("import : le fuseau est restaure", d.fuseau, copie2.fuseau); n++;

    /* Une horloge a 0 (1970) doit se restaurer telle quelle. */
    var zero = new Depot({ instant: 0, fuseau: "+0200", pasHorloge: 3600 });
    var copieZero = Depot.importer(JSON.parse(JSON.stringify(zero.exporter())));
    compare("import : instant 0 conserve", 0, copieZero.instant); n++;
    compare("import : fuseau +0200 conserve", "+0200", copieZero.fuseau); n++;
    compare("import : pas d'horloge conserve", 3600, copieZero.pasHorloge); n++;

    /* L'ordre d'un `ls-tree` : par octets, jamais l'ordre numerique de
       JavaScript (« 2 » ne passe pas avant « 10 » chez git). */
    var dir3 = creerDepotReel();
    try {
      var d3 = new Depot();
      ["0", "1", "2", "10", "11", "100", "a.txt"].forEach(function (nom) {
        ecrire(dir3, nom, nom + "\n");
        cp.execFileSync("git", ["-C", dir3, "add", "--", nom], { env: ENV });
        d3.ecrireFichier(nom, nom + "\n"); d3.indexer(nom);
      });
      var arbre3 = gitBrut(dir3, ["write-tree"]);
      compare("ordre numerique : arbre", arbre3, d3.ecrireArbre()); n++;
      var reelOrdre = gitBrut(dir3, ["-c", "core.quotePath=false", "ls-tree", "-r", "--name-only", arbre3]).split(/[\r]?[\n]/).join(",");
      var mienOrdre = d3.listerArbre(d3.ecrireArbre()).map(function (e) { return e.chemin; }).join(",");
      compare("ordre numerique : listerArbre", reelOrdre, mienOrdre); n++;
    } finally {
      try { fs.rmSync(dir3, { recursive: true, force: true }); } catch (e4) { /* Windows */ }
    }

    return n;
  } finally {
    try { fs.rmSync(dir, { recursive: true, force: true }); } catch (e5) { /* Windows */ }
  }
}

/* --- orchestration -------------------------------------------------------- */

function principal() {
  try {
    cp.execFileSync("git", ["--version"], { stdio: "ignore" });
  } catch (e) {
    console.log("verif-git-modele : git introuvable, etape sautee.");
    process.exit(2);
  }

  var dir = creerDepotReel();
  var depart = Date.now();
  try {
    var nBlobs = etapeBlobs(dir);
    var nArbres = etapeArbres(dir);
    var nCommits = etapeCommits(dir);
    var nPorcelaine = etapePorcelaine();
    var contexte = etapeGraphe(dir);
    var nDiff = etapeDiff(dir, contexte);
    var nSer = etapeSerialisation(contexte);
    var nStatut = etapeStatut(dir);
    var nPieges = etapeNomsPieges();
    var nOrdre = etapeOrdreDuJournal();
    var nRefs = etapeReferencesEtModes();

    console.log("verif-git-modele : " + path.relative(path.join(__dirname, ".."), CHEMIN_MODELE).split(String.fromCharCode(92)).join("/") + " confronte au vrai git " +
      cp.execFileSync("git", ["--version"], { encoding: "utf8" }).trim());
    console.log("  blobs           : " + nBlobs + " contenus haches");
    console.log("  arbres          : " + JEUX_ARBRES.length + " jeux (ecriture + relecture)");
    console.log("  commits         : " + CAS_COMMITS.length + " commits (ecriture + relecture)");
    console.log("  porcelaine      : " + nPorcelaine + " controles (git add + git commit -m, de bout en bout)");
    console.log("  graphe          : " + contexte.comparaisons + " questions (rev-parse, merge-base, ancetres, journal)");
    console.log("  diffs d'arbres  : " + nDiff + " paires");
    console.log("  serialisation   : " + nSer + " controles");
    console.log("  statut          : " + nStatut + " etats compares a git status --porcelain");
    console.log("  noms pieges     : " + nPieges + " controles (constructor, __proto__, toString... en fichier ET en dossier)");
    console.log("  ordre du journal: " + nOrdre + " controles (date de committeur, dates egales, topologie)");
    console.log("  refs et modes   : " + nRefs + " controles (etiquette contre branche, mode +x, checkout, import)");
    console.log("  ------------------------------------------------------------");
    console.log("  " + comparaisons + " comparaisons, " + ecarts.length + " ecart(s), " +
      ((Date.now() - depart) / 1000).toFixed(1) + " s");

    if (ecarts.length) {
      console.log("");
      ecarts.forEach(function (e) {
        console.log("  ECART · " + e.quoi);
        console.log("      git    : " + e.git);
        console.log("      modele : " + e.modele);
      });
      process.exit(1);
    }
    process.exit(0);
  } finally {
    try { fs.rmSync(dir, { recursive: true, force: true }); } catch (e4) { /* Windows tient parfois un fichier */ }
  }
}

principal();
