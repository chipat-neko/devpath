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
  var lignes = {};
  function poser(chemin, x, y) {
    if (!lignes[chemin]) lignes[chemin] = [" ", " "];
    if (x) lignes[chemin][0] = x;
    if (y) lignes[chemin][1] = y;
  }
  var codes = { "nouveau": "A", "modifié": "M", "supprimé": "D" };
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
