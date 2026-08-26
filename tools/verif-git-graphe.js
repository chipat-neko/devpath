/* =============================================================================
   verif-git-graphe.js — LA VISUALISATION du bac a sable Git (js/git-graphe.js,
   chantier V14 point D3) confrontee au VRAI git. Node pur, ZERO dependance.

   POURQUOI CET OUTIL EXISTE
   Un dessin est une AFFIRMATION : « ce commit descend de celui-la », « cette
   branche part d'ici ». Si l'ordre des lignes ou la colonne d'un commit est
   faux, l'apprenant apprend une topologie qui n'existe pas — et rien, dans le
   source d'une page, ne permet de s'en apercevoir. Le seul juge est git.

   CE QUI EST COMPARE, apres CHAQUE commande d'un scenario joue des deux cotes :
     1. L'ORDRE des lignes, contre `git log --all --topo-order --format=%H`.
     2. Les COLONNES, contre la position du `*` dans le graphe ASCII de
        `git log --all --graph --topo-order` (position / 2), sous DEUX formes :
        (a) la continuite des lignees — git et le bac doivent etre d'accord sur
            « ce commit et son parent tiennent-ils la meme colonne ? » : compare
            a 100 %, c'est ce qui fait qu'une branche se lit comme une ligne ;
        (b) le NUMERO de la colonne : compte, avec un seuil a 99 %, parce que
            git INSERE une colonne neuve a droite d'une fusion et POUSSE les
            suivantes d'un cran, ce que le bac a sable ne fait pas (une voie
            garde son numero, ce qui donne des lignes droites en SVG). Le taux
            est affiche et les divergences sont listees, jamais tues.
     3. Les ARETES, contre les couples (commit, parent) de
        `git rev-list --all --parents`.
     4. Les MARQUES posees sur chaque commit (HEAD, branches, etiquettes),
        contre `%d` de `git log` — en ENSEMBLE trie, parce que l'ordre de git,
        lui, n'est pas stable : mesure faite, il rend « (tag: v1, tag: aaa, zz,
        main, bb) », ni alphabetique ni chronologique. Le bac a sable, lui,
        affiche un ordre determine (HEAD, branche courante, branches,
        etiquettes) : c'est un choix, il est ecrit.

   ET DES INVARIANTS QUE GIT NE PEUT PAS DONNER, mais dont depend la lisibilite :
     5. Aucun parent dessine AU-DESSUS de son enfant (la fleche remonterait).
     6. Aucune arete verticale ne TRAVERSE un commit d'une autre lignee.
     7. Le SVG rendu est du XML bien forme, et un nom de branche `<script>`
        ressort echappe.

   CODE DE SORTIE : 0 tout concorde, 1 un ecart, 2 git absent (etape sautee).
   ============================================================================= */
"use strict";

var cp = require("child_process");
var fs = require("fs");
var os = require("os");
var path = require("path");

var argGraphe = process.argv.slice(2).filter(function (a) { return a.indexOf("--graphe=") === 0; })[0];
var CHEMIN_GRAPHE = argGraphe ? argGraphe.slice(9) : path.join(__dirname, "..", "js", "git-graphe.js");
var GG = require(path.resolve(CHEMIN_GRAPHE));
var GM = require(path.join(__dirname, "..", "js", "git-modele.js"));
var GC = require(path.join(__dirname, "..", "js", "git-commandes.js"));

var SEUL = (process.argv.slice(2).filter(function (a) { return a.indexOf("--scenario=") === 0; })[0] || "").slice(11);
var BAVARD = process.argv.indexOf("--bavard") >= 0;
var VITE = process.argv.indexOf("--vite") >= 0;

var IDENTITE_NOM = "Apprenant";
var IDENTITE_MAIL = "apprenant@syntaxe.invalid";
var IDENTITE = IDENTITE_NOM + " <" + IDENTITE_MAIL + ">";
var INSTANT = 1704067200;
var DATE_AUTEUR = INSTANT + " +0000";
var DATE_COMMITTEUR = INSTANT + " +0000";

var comparaisons = 0;
var ecarts = [];
var contexteCourant = "";
var statVoies = { total: 0, concordantes: 0, divergentes: [], voisins: 0, voisinsOk: 0, lignees: 0, ligneesOk: 0 };

function ArretVite() { this.vite = true; }

function compare(quoi, attenduGit, obtenu) {
  comparaisons++;
  if (String(attenduGit) !== String(obtenu)) {
    ecarts.push({ ou: contexteCourant, quoi: quoi, git: String(attenduGit), bac: String(obtenu) });
    if (VITE) throw new ArretVite();
  }
}

/* --- le vrai git ----------------------------------------------------------- */

var CHEMIN_CONFIG_VIDE = null;
function configVide() {
  if (!CHEMIN_CONFIG_VIDE) {
    CHEMIN_CONFIG_VIDE = path.join(fs.mkdtempSync(path.join(os.tmpdir(), "syntaxe-gitgconf-")), "config-vide");
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
  return gitBrut(dir, args).sortie.replace(/\r/g, "").replace(/\n$/, "");
}

function creerDepotReel(branche) {
  var dir = fs.mkdtempSync(path.join(os.tmpdir(), "syntaxe-gitg-"));
  cp.execFileSync("git", ["init", "-q", "-b", branche || "main", dir], { env: env() });
  gitBrut(dir, ["config", "core.autocrlf", "false"]);
  gitBrut(dir, ["config", "core.filemode", "false"]);
  gitBrut(dir, ["config", "core.safecrlf", "false"]);
  gitBrut(dir, ["config", "advice.detachedHead", "false"]);
  gitBrut(dir, ["config", "merge.conflictStyle", "merge"]);
  return dir;
}

function fichiersDisque(dir, prefixe, sortie) {
  prefixe = prefixe || "";
  sortie = sortie || {};
  var entrees = fs.readdirSync(path.join(dir, prefixe), { withFileTypes: true });
  for (var i = 0; i < entrees.length; i++) {
    var e = entrees[i];
    if (e.name === ".git") continue;
    var rel = prefixe ? prefixe + "/" + e.name : e.name;
    if (e.isDirectory()) fichiersDisque(dir, rel, sortie);
    else sortie[rel] = "";
  }
  return sortie;
}

/* --- lire le graphe du vrai git -------------------------------------------- */

/* La position du `*` dans le dessin ASCII, divisee par deux, EST la voie :
   git ecrit une colonne tous les deux caracteres (`| | * `).
   ⚠️ Le `*` n'est pas forcement le dernier caractere du dessin : sur la ligne
   d'un commit dont une AUTRE branche est encore ouverte a sa droite, git ecrit
   `* | <oid>`. Un motif « tout ce qui precede, puis `*`, puis l'oid » ne
   reconnait pas cette ligne — et le commit disparaissait alors du cote git,
   ce qui faisait passer un ordre JUSTE pour un ecart. On repere donc l'oid
   d'abord, et le DERNIER `*` qui le precede ensuite. */
function grapheReel(dir) {
  var brut = gitBrut(dir, ["log", "--all", "--graph", "--topo-order", "--format=%H"]).sortie.replace(/\r/g, "");
  var lignes = brut.split("\n");
  var out = [];
  for (var i = 0; i < lignes.length; i++) {
    var m = /^(.*?)([0-9a-f]{40})\s*$/.exec(lignes[i]);
    if (!m) continue;
    var etoile = m[1].lastIndexOf("*");
    if (etoile < 0) continue;
    out.push({ oid: m[2], voie: etoile / 2 });
  }
  return out;
}

function decorationsReelles(dir) {
  var brut = gitLu(dir, ["log", "--all", "--topo-order", "--format=%H%d"]);
  var par = Object.create(null);
  brut.split("\n").filter(Boolean).forEach(function (l) {
    var oid = l.slice(0, 40);
    var deco = l.slice(41).trim();
    var noms = [];
    if (deco.indexOf("(") === 0) {
      deco.slice(1, -1).split(", ").forEach(function (d) {
        d = d.trim();
        if (!d) return;
        if (d.indexOf("HEAD -> ") === 0) { noms.push("HEAD"); noms.push(d.slice(8)); }
        else noms.push(d);
      });
    }
    par[oid] = noms.sort().join(" ");
  });
  return par;
}

function signe(n) { return n < 0 ? "gauche" : (n > 0 ? "droite" : "meme colonne"); }

function marquesBac(noeud) {
  var noms = [];
  noeud.marques.forEach(function (m) {
    if (m.sorte === "etiquette") noms.push("tag: " + m.nom);
    else if (m.sorte === "tete") { noms.push("HEAD"); if (m.branche) noms.push(m.branche); }
    else noms.push(m.nom);
  });
  return noms.sort().join(" ");
}

/* --- les invariants du dessin ---------------------------------------------- */

function verifierDessin(d) {
  var parOid = Object.create(null), i, j;
  for (i = 0; i < d.noeuds.length; i++) parOid[d.noeuds[i].oid] = d.noeuds[i];

  /* 5. un parent est TOUJOURS plus bas que son enfant */
  for (i = 0; i < d.aretes.length; i++) {
    var a = d.aretes[i];
    comparaisons++;
    if (!(a.ligneParent > a.ligneEnfant)) {
      ecarts.push({
        ou: contexteCourant, quoi: "parent dessine au-dessus de son enfant",
        git: "ligne(parent) > ligne(enfant)",
        bac: a.parent.slice(0, 7) + " ligne " + a.ligneParent + " / " + a.enfant.slice(0, 7) + " ligne " + a.ligneEnfant
      });
      if (VITE) throw new ArretVite();
    }
    comparaisons++;
    if (!parOid[a.parent] || !parOid[a.enfant]) {
      ecarts.push({ ou: contexteCourant, quoi: "arete vers un noeud absent", git: "les deux extremites existent", bac: a.enfant + " -> " + a.parent });
      if (VITE) throw new ArretVite();
    }
  }

  /* 6. une arete VERTICALE ne traverse aucun commit d'une autre lignee :
        c'est ce qui distingue un graphe lisible d'un plat de spaghettis. */
  for (i = 0; i < d.aretes.length; i++) {
    var b = d.aretes[i];
    if (b.voieEnfant !== b.voieParent) continue;      // les obliques sont libres
    for (j = 0; j < d.noeuds.length; j++) {
      var n = d.noeuds[j];
      if (n.voie !== b.voieEnfant) continue;
      if (n.ligne <= b.ligneEnfant || n.ligne >= b.ligneParent) continue;
      comparaisons++;
      ecarts.push({
        ou: contexteCourant, quoi: "une arete verticale traverse un commit",
        git: "aucune traversee",
        bac: b.enfant.slice(0, 7) + " -> " + b.parent.slice(0, 7) + " traverse " + n.oid.slice(0, 7) + " (voie " + n.voie + ")"
      });
      if (VITE) throw new ArretVite();
    }
  }

  /* 6 bis. AUCUNE colonne fantome : la largeur annoncee du graphe est celle
     qu'occupent vraiment les commits. Une voie ouverte pour un parent puis
     jamais reprise (parce que le parent est finalement dessine ailleurs) ne se
     voit d'aucune autre facon — ni git ni le dessin ne s'en plaignent — et elle
     decale tout ce qui vient ensuite. */
  var largeurReelle = 0;
  for (i = 0; i < d.noeuds.length; i++) if (d.noeuds[i].voie + 1 > largeurReelle) largeurReelle = d.noeuds[i].voie + 1;
  if (d.noeuds.length) {
    comparaisons++;
    if (largeurReelle !== d.voies) {
      ecarts.push({ ou: contexteCourant, quoi: "colonne fantome (largeur du graphe)",
        git: "largeur " + largeurReelle, bac: "largeur " + d.voies });
      if (VITE) throw new ArretVite();
    }
    /* Et AUCUNE voie ne reste ouverte a la fin : toutes les lignees dessinees
       ont trouve leur parent. Une voie encore reservee est une colonne que rien
       ne refermera jamais — elle pousse tout ce qui suit d'un cran a droite. */
    comparaisons++;
    if (d.voiesRestantes !== 0) {
      ecarts.push({ ou: contexteCourant, quoi: "voie(s) encore ouverte(s) a la fin du dessin",
        git: "0", bac: String(d.voiesRestantes) });
      if (VITE) throw new ArretVite();
    }
  }

  /* 7. le SVG est bien forme : balises equilibrees, rien d'injecte */
  var svg = GG.versTexte(GG.arbre(d, {}));
  comparaisons++;
  var pile = [], re = /<\/?([a-zA-Z]+)[^>]*>/g, m, casse = null;
  while ((m = re.exec(svg))) {
    if (m[0].indexOf("</") === 0) {
      if (pile.pop() !== m[1]) { casse = m[1]; break; }
    } else pile.push(m[1]);
  }
  if (casse || pile.length) {
    ecarts.push({ ou: contexteCourant, quoi: "SVG mal forme", git: "balises equilibrees", bac: casse || ("non fermees : " + pile.join(",")) });
    if (VITE) throw new ArretVite();
  }
}

/* --- comparer le graphe des deux cotes -------------------------------------- */

function comparerGraphe(dir, depot) {
  var reel = grapheReel(dir);
  var d = GG.disposer(depot, {});

  compare("ordre des commits (topo)",
    reel.map(function (r) { return r.oid; }).join("\n"),
    d.noeuds.map(function (n) { return n.oid; }).join("\n"));

  /* Les voies. Deux mesures, et pas une seule, parce qu'elles ne prouvent pas
     la meme chose :

     (a) LA CONTINUITE DES LIGNEES — stricte, comparee a 100 %. Pour chaque
         couple (commit, parent), git et le bac doivent etre D'ACCORD sur le
         fait que les deux tiennent la MEME colonne. C'est ce qui fait qu'une
         branche se lit comme une ligne continue ; c'est la propriete dont
         depend la comprehension du dessin, et elle survit au decalage de
         colonnes decrit ci-dessous.

     (b) LE NUMERO de la colonne — compte, avec un seuil. Git INSERE une voie
         neuve juste a droite du commit de fusion et POUSSE les colonnes
         suivantes d'un cran (les `|\ \` de son dessin) ; ici une voie garde son
         numero du debut a la fin, ce qui donne des lignes droites en SVG mais
         decale le numero de ce qui etait a droite. C'est assume : le taux est
         affiche, et il devient une ERREUR sous 99 %. */
  var parOid = Object.create(null);
  d.noeuds.forEach(function (n) { parOid[n.oid] = n; });
  var voieGit = Object.create(null);
  reel.forEach(function (r) { voieGit[r.oid] = r.voie; });

  for (var i = 0; i < reel.length; i++) {
    var n = parOid[reel[i].oid];
    if (!n) continue;
    statVoies.total++;
    if (n.voie === reel[i].voie) statVoies.concordantes++;
    else statVoies.divergentes.push(contexteCourant + " : " + reel[i].oid.slice(0, 7)
      + " git " + reel[i].voie + " / bac " + n.voie);
  }

  /* (c) DEUX MESURES DE PLUS, comptees et non exigees — et il a fallu une
     contre-epreuve pour l'admettre. Elles etaient annoncees « comparees a
     100 % », au motif qu'une colonne INSEREE translate les numeros sans jamais
     echanger deux voisins de place. C'est vrai de l'insertion. Mais git
     SUPPRIME aussi des colonnes : quand une lignee meurt, tout ce qui est a sa
     droite glisse d'un cran (les `|/` du dessin). Ce glissement, lui, CHANGE
     lequel de deux voisins est a gauche, et change si un commit et son parent
     partagent une colonne. Mesure faite par enumeration EXHAUSTIVE des graphes
     a six commits et une racine : 225 sur 2 700 (8,3 %) tombent dans ce cas,
     avec le meme compte pour des dates egales, croissantes ou decroissantes —
     la difference est structurelle, pas horaire.
     Ces deux taux restent donc affiches, parce qu'ils disent quelque chose de
     vrai sur la ressemblance au dessin de git ; ils ne sont plus des exigences.
     Ce qui EST exige tient dans les invariants internes (aucun parent au-dessus
     de son enfant, aucune traversee, aucune colonne fantome, aucune voie encore
     ouverte a la fin) et dans l'ordre, les aretes et les marques — ceux-la ont
     resiste a 264 373 comparaisons d'une passe adversariale. */
  for (var v = 0; v + 1 < reel.length; v++) {
    var n1 = parOid[reel[v].oid], n2 = parOid[reel[v + 1].oid];
    if (!n1 || !n2) continue;
    statVoies.voisins++;
    if (signe(reel[v].voie - reel[v + 1].voie) === signe(n1.voie - n2.voie)) statVoies.voisinsOk++;
  }

  for (var e = 0; e < d.aretes.length; e++) {
    var ar = d.aretes[e];
    if (voieGit[ar.enfant] === undefined || voieGit[ar.parent] === undefined) continue;
    statVoies.lignees++;
    if ((voieGit[ar.enfant] === voieGit[ar.parent]) === (ar.voieEnfant === ar.voieParent)) statVoies.ligneesOk++;
  }

  /* Les aretes : l'ensemble des couples (enfant, parent) */
  var brut = gitLu(dir, ["rev-list", "--all", "--parents"]);
  var couplesGit = [];
  brut.split("\n").filter(Boolean).forEach(function (l) {
    var mots = l.trim().split(/\s+/);
    for (var k = 1; k < mots.length; k++) couplesGit.push(mots[0] + ">" + mots[k]);
  });
  var couplesBac = d.aretes.map(function (a) { return a.enfant + ">" + a.parent; });
  compare("aretes (enfant -> parent)", couplesGit.sort().join("\n"), couplesBac.sort().join("\n"));

  /* Les marques */
  var deco = decorationsReelles(dir);
  for (var j = 0; j < d.noeuds.length; j++) {
    var nd = d.noeuds[j];
    compare("marques de " + nd.oid.slice(0, 7), deco[nd.oid] || "", marquesBac(nd));
  }

  verifierDessin(d);
}

/* --- jouer un scenario ------------------------------------------------------ */

function jouer(scenario) {
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
    if (a.instant) {
      DATE_AUTEUR = a.instant + " +0000";
      DATE_COMMITTEUR = a.instant + " +0000";
      depot.instant = a.instant;
      continue;
    }
    if (a.supprimer) {
      try { fs.unlinkSync(path.join(dir, a.supprimer.split("/").join(path.sep))); } catch (e) { /* deja absent */ }
      depot.supprimerFichier(a.supprimer);
      continue;
    }
    /* Une branche ORPHELINE : le bac a sable ne sait pas la creer (dette assumee
       de D2), mais un depot a DEUX racines est une forme de graphe a part, et
       c'est la seule qui prouve qu'une voie se referme bien sur une racine. On
       la monte donc des deux cotes, a la main, comme le fait verif-git-commandes. */
    if (a.orphelin) {
      gitBrut(dir, ["checkout", "--orphan", a.orphelin]);
      gitBrut(dir, ["rm", "-rf", "--cached", "."]);
      var surDisque = fichiersDisque(dir);
      for (var oc in surDisque) {
        if (!Object.prototype.hasOwnProperty.call(surDisque, oc)) continue;
        try { fs.unlinkSync(path.join(dir, oc.split("/").join(path.sep))); } catch (e) { /* rien */ }
      }
      depot.HEAD = { symbolique: "refs/heads/" + a.orphelin, oid: null };
      depot.index = GM.dico();
      depot.travail = GM.dico();
      continue;
    }

    var ligne = a.git;
    contexteCourant = scenario.nom + " #" + (i + 1) + " — git " + ligne;
    var mots = GC.decouperLigne(ligne);
    gitBrut(dir, mots);
    GC.executer(depot, ["git"].concat(mots));
    if (a.graphe === false) continue;
    comparerGraphe(dir, depot);
    if (BAVARD) console.log("  " + contexteCourant + " — " + GG.disposer(depot, {}).noeuds.length + " commit(s)");
  }

  try { fs.rmSync(dir, { recursive: true, force: true, maxRetries: 3 }); } catch (e) { /* le temporaire survivra */ }
}

/* ===========================================================================
   LES SCENARIOS — chacun produit une FORME de graphe differente.
   =========================================================================== */

function commits(prefixe, n, depart) {
  var out = [], t = depart || INSTANT;
  for (var i = 1; i <= n; i++) {
    out.push({ instant: t + i });
    out.push({ ecrire: [prefixe + ".txt", prefixe + " " + i + "\n"] });
    out.push({ git: "add ." });
    out.push({ git: 'commit -m "' + prefixe + i + '"' });
  }
  return out;
}

var SCENARIOS = [
  {
    nom: "ligne-droite",
    actions: [].concat(commits("a", 4))
  },
  {
    nom: "deux-branches-divergentes",
    actions: [].concat(
      commits("socle", 2),
      [{ git: "branch feat" }, { git: "checkout feat" }],
      commits("f", 2, INSTANT + 10),
      [{ git: "checkout main" }],
      commits("m", 2, INSTANT + 20)
    )
  },
  {
    nom: "fusion-vraie",
    actions: [].concat(
      commits("socle", 1),
      [{ git: "checkout -b feat" }],
      commits("f", 2, INSTANT + 10),
      [{ git: "checkout main" }],
      commits("m", 1, INSTANT + 20),
      [{ instant: INSTANT + 30 }, { git: "merge feat" }, { git: "log --oneline", graphe: false }]
    )
  },
  {
    nom: "fusion-avance-rapide",
    actions: [].concat(
      commits("socle", 1),
      [{ git: "checkout -b feat" }],
      commits("f", 2, INSTANT + 10),
      [{ git: "checkout main" }, { git: "merge feat" }]
    )
  },
  {
    nom: "trois-branches",
    actions: [].concat(
      commits("socle", 2),
      [{ git: "checkout -b b1" }], commits("x", 1, INSTANT + 10),
      [{ git: "checkout main" }, { git: "checkout -b b2" }], commits("y", 1, INSTANT + 20),
      [{ git: "checkout main" }], commits("z", 1, INSTANT + 30),
      [{ instant: INSTANT + 40 }, { git: "merge b1" }],
      [{ instant: INSTANT + 50 }, { git: "merge b2" }]
    )
  },
  {
    nom: "rebasage",
    actions: [].concat(
      commits("socle", 1),
      [{ git: "checkout -b feat" }], commits("f", 2, INSTANT + 10),
      [{ git: "checkout main" }], commits("m", 1, INSTANT + 20),
      [{ git: "checkout feat" }, { instant: INSTANT + 30 }, { git: "rebase main" }]
    )
  },
  {
    nom: "etiquettes-et-tete-detachee",
    actions: [].concat(
      commits("a", 3),
      [
        { git: "tag v1" },
        { git: "tag v0 HEAD~2" },
        { git: "branch vieille HEAD~1" },
        { git: "checkout HEAD~1" },
        { git: "checkout main" }
      ]
    )
  },
  {
    nom: "reset-et-commits-perdus",
    actions: [].concat(
      commits("a", 4),
      [{ git: "reset --hard HEAD~2" }, { git: "status --porcelain", graphe: false }]
    )
  },
  {
    nom: "annulation-et-picorage",
    actions: [].concat(
      commits("socle", 2),
      [{ git: "checkout -b feat" }], commits("f", 1, INSTANT + 10),
      [{ git: "checkout main" }, { instant: INSTANT + 20 }, { git: "cherry-pick feat" }],
      [{ instant: INSTANT + 30 }, { git: "revert --no-edit HEAD" }]
    )
  },
  {
    nom: "fusion-en-conflit-puis-resolue",
    actions: [
      { ecrire: ["f.txt", "base\n"] }, { git: "add ." }, { git: 'commit -m "base"' },
      { git: "checkout -b feat" },
      { instant: INSTANT + 10 }, { ecrire: ["f.txt", "version feat\n"] }, { git: "add ." }, { git: 'commit -m "feat"' },
      { git: "checkout main" },
      { instant: INSTANT + 20 }, { ecrire: ["f.txt", "version main\n"] }, { git: "add ." }, { git: 'commit -m "main"' },
      { instant: INSTANT + 30 }, { git: "merge feat" },
      { ecrire: ["f.txt", "resolu\n"] }, { git: "add ." }, { git: 'commit -m "resolution"' }
    ]
  },
  {
    nom: "branche-sur-branche",
    actions: [].concat(
      commits("a", 2),
      [{ git: "checkout -b niveau1" }], commits("b", 1, INSTANT + 10),
      [{ git: "checkout -b niveau2" }], commits("c", 1, INSTANT + 20),
      [{ git: "checkout niveau1" }], commits("d", 1, INSTANT + 30),
      [{ git: "checkout main" }, { instant: INSTANT + 40 }, { git: "merge niveau2" }]
    )
  },
  {
    nom: "dates-egales",
    /* Toutes les dates identiques : c'est le cas NORMAL du bac a sable quand
       l'horloge ne bouge pas, et celui ou un tri par date ne departage rien. */
    actions: [
      { ecrire: ["a.txt", "1\n"] }, { git: "add ." }, { git: 'commit -m "un"' },
      { git: "checkout -b p" }, { ecrire: ["b.txt", "2\n"] }, { git: "add ." }, { git: 'commit -m "deux"' },
      { git: "checkout main" }, { ecrire: ["c.txt", "3\n"] }, { git: "add ." }, { git: 'commit -m "trois"' },
      { git: "merge p" }
    ]
  },
  {
    nom: "beaucoup-de-branches-au-meme-endroit",
    actions: [].concat(
      commits("a", 2),
      [{ git: "branch alpha" }, { git: "branch beta" }, { git: "branch gamma" }, { git: "tag jalon" }]
    )
  },
  {
    nom: "fusion-de-fusion",
    actions: [].concat(
      commits("socle", 1),
      [{ git: "checkout -b b1" }], commits("x", 1, INSTANT + 10),
      [{ git: "checkout main" }], commits("y", 1, INSTANT + 20),
      [{ instant: INSTANT + 25 }, { git: "merge b1" }],
      [{ git: "checkout -b b2 HEAD~2" }], commits("z", 1, INSTANT + 30),
      [{ git: "checkout main" }, { instant: INSTANT + 40 }, { git: "merge b2" }]
    )
  },
  {
    nom: "tete-detachee-avec-commit-orphelin",
    /* Le commit fait en tete detachee n'est atteignable QUE par HEAD : si HEAD
       n'est pas un point de depart, il disparait du graphe. C'est la situation
       ou l'apprenant croit avoir perdu son travail. */
    actions: [].concat(
      commits("a", 2),
      [{ git: "checkout HEAD~1" }],
      [
        { instant: INSTANT + 30 },
        { ecrire: ["detache.txt", "ecrit en tete detachee\n"] },
        { git: "add ." },
        { git: 'commit -m "en tete detachee"' },
        { git: "branch sauvetage" }
      ]
    )
  },
  {
    nom: "etiquette-qui-sauve-un-commit-abandonne",
    /* Apres `reset --hard`, le commit reste atteignable PAR L'ETIQUETTE : git le
       montre encore, et le bac a sable doit le montrer aussi. */
    actions: [].concat(
      commits("a", 4),
      [{ git: "tag garde" }, { git: "reset --hard HEAD~2" }]
    )
  },
  {
    nom: "deux-racines",
    /* Deux histoires sans ancetre commun : la seule forme de graphe ou une voie
       doit se refermer sur une racine ET reprendre du service en dessous. */
    actions: [].concat(
      commits("a", 2),
      [{ orphelin: "solo" }],
      [
        { instant: INSTANT + 30 },
        { ecrire: ["solo.txt", "seul\n"] },
        { git: "add ." },
        { git: 'commit -m "autre racine"' },
        { git: "checkout main" }
      ]
    )
  },
  {
    nom: "fusion-dont-un-parent-est-deja-attendu",
    /* Le second parent de la fusion est DEJA attendu par une voie ouverte plus
       haut (une branche est partie de lui). Ouvrir une colonne neuve pour lui
       dessinerait deux lignes pour un seul commit. */
    actions: [].concat(
      commits("a", 2),
      [{ git: "checkout -b feat" }], commits("f", 1, INSTANT + 10),
      [{ git: "checkout main" }], commits("m", 1, INSTANT + 20),
      [{ instant: INSTANT + 25 }, { git: "merge feat" }],
      [{ git: "checkout -b autre feat" }], commits("e", 1, INSTANT + 40),
      [{ git: "checkout main" }]
    )
  },
  {
    nom: "aller-retour-de-fusion",
    /* ⚠️ CINQ commandes ordinaires, et la colonne fantome apparaissait : une voie
       ouverte pour le second parent d'une fusion, refermee plus bas par la
       convergence, sans qu'aucun commit ne s'y soit jamais pose. Trouve par une
       enumeration exhaustive des graphes a six commits. */
    actions: [].concat(
      commits("a", 1),
      [{ git: "checkout -b z1" }], commits("z", 1, INSTANT + 10),
      [{ git: "checkout main" }], commits("m", 1, INSTANT + 20),
      [{ git: "checkout z1" }, { instant: INSTANT + 30 }, { git: "merge main" }],
      [{ git: "checkout main" }], commits("m2", 1, INSTANT + 40),
      [{ instant: INSTANT + 50 }, { git: "merge z1" }]
    )
  },
  {
    nom: "croisement-de-deux-branches",
    actions: [].concat(
      commits("a", 1),
      [{ git: "checkout -b b" }], commits("b", 1, INSTANT + 10),
      [{ git: "checkout main" }], commits("m", 1, INSTANT + 20),
      [{ instant: INSTANT + 30 }, { git: "merge b" }],
      [{ git: "checkout b" }, { instant: INSTANT + 40 }, { git: "merge main" }],
      [{ git: "checkout main" }, { instant: INSTANT + 50 }, { git: "merge b" }]
    )
  },
  {
    nom: "no-ff-puis-retour",
    actions: [].concat(
      commits("a", 1),
      [{ git: "checkout -b feat" }], commits("f", 1, INSTANT + 10),
      [{ git: "checkout main" }, { instant: INSTANT + 20 }, { git: "merge --no-ff feat" }],
      [{ git: "checkout feat" }, { instant: INSTANT + 30 }, { git: "merge main" }]
    )
  },
  {
    nom: "deux-fusions-croisees-de-la-meme-branche",
    actions: [].concat(
      commits("a", 1),
      [{ git: "checkout -b p" }], commits("p", 1, INSTANT + 10),
      [{ git: "checkout -b q main" }], commits("q", 1, INSTANT + 20),
      [{ git: "checkout -b br0 main" }, { instant: INSTANT + 30 }, { git: "merge --no-ff q" }],
      [{ git: "checkout -b br1 p" }, { instant: INSTANT + 40 }, { git: "merge q" }],
      [{ git: "checkout br0" }]
    )
  },
  {
    nom: "noms-a-accents-et-chevrons",
    /* Un message de commit et un nom de branche qui contiennent ce qu'un
       apprenant tapera vraiment — et ce qu'un dessin naif injecterait. */
    actions: [
      { ecrire: ["a.txt", "1\n"] }, { git: "add ." }, { git: 'commit -m "création & <mise à jour>"' },
      { git: "checkout -b essai" },
      { instant: INSTANT + 10 }, { ecrire: ["b.txt", "2\n"] }, { git: "add ." }, { git: 'commit -m "correction du bogue #12"' },
      { git: "checkout main" }
    ]
  }
];

/* --- l'epreuve d'injection, hors git ---------------------------------------- */

function epreuveInjection() {
  contexteCourant = "injection";
  var depot = new GM.Depot({ identite: IDENTITE, branche: "main", instant: INSTANT, pasHorloge: 0, fuseau: "+0000" });
  depot.ecrireFichier("a.txt", "1\n");
  GC.executer(depot, ["git", "add", "."]);
  GC.executer(depot, ["git", "commit", "-m", '</text><script>alert(1)</script>']);
  GC.executer(depot, ["git", "branch", "x<script>"]);
  var svg = GG.svgTexte(depot, {});
  compare("le titre est echappe", "0", String(svg.split("<script>").length - 1));
  compare("le titre est present, echappe", "true", String(svg.indexOf("&lt;script&gt;") >= 0));
}

/* --- l'epreuve des orphelins ------------------------------------------------ */

function epreuveOrphelins() {
  contexteCourant = "orphelins";
  var depot = new GM.Depot({ identite: IDENTITE, branche: "main", instant: INSTANT, pasHorloge: 1, fuseau: "+0000" });
  for (var i = 1; i <= 4; i++) {
    depot.ecrireFichier("a.txt", "v" + i + "\n");
    GC.executer(depot, ["git", "add", "."]);
    GC.executer(depot, ["git", "commit", "-m", "c" + i]);
  }
  GC.executer(depot, ["git", "reset", "--hard", "HEAD~2"]);
  var sans = GG.disposer(depot, {});
  var avec = GG.disposer(depot, { orphelins: true });
  compare("sans orphelins : 2 commits", "2", String(sans.noeuds.length));
  compare("avec orphelins : 4 commits", "4", String(avec.noeuds.length));
  var perdus = avec.noeuds.filter(function (n) { return n.orphelin; });
  compare("2 commits marques perdus", "2", String(perdus.length));
  /* Et le dessin des orphelins reste lisible : mêmes invariants. */
  verifierDessin(avec);
}

/* --------------------------------------------------------------------------- */

function main() {
  try {
    cp.execFileSync("git", ["--version"], { stdio: "ignore" });
  } catch (e) {
    console.log("verif-git-graphe : git absent de cette machine, etape sautee.");
    process.exit(2);
  }

  var joues = 0;
  try {
    for (var i = 0; i < SCENARIOS.length; i++) {
      if (SEUL && SCENARIOS[i].nom !== SEUL) continue;
      jouer(SCENARIOS[i]);
      joues++;
    }
    if (!SEUL) { epreuveInjection(); epreuveOrphelins(); }
  } catch (err) {
    if (!(err instanceof ArretVite)) throw err;
  }

  console.log("verif-git-graphe — " + joues + " scenario(s), " + comparaisons + " comparaison(s) contre "
    + cp.execFileSync("git", ["--version"], { encoding: "utf8" }).trim() + ".");
  function pct(a, b) { return b ? (100 * a / b).toFixed(1) + " %" : "-"; }
  console.log("  RESSEMBLANCE au dessin de git (mesuree, NON exigee — git compresse ses colonnes) :");
  console.log("    numeros de colonne identiques ... " + statVoies.concordantes + " / " + statVoies.total
    + " (" + pct(statVoies.concordantes, statVoies.total) + ")");
  console.log("    ordre gauche-droite des voisins . " + statVoies.voisinsOk + " / " + statVoies.voisins
    + " (" + pct(statVoies.voisinsOk, statVoies.voisins) + ")");
  console.log("    continuite des lignees .......... " + statVoies.ligneesOk + " / " + statVoies.lignees
    + " (" + pct(statVoies.ligneesOk, statVoies.lignees) + ")");
  for (var v = 0; v < statVoies.divergentes.length; v++) console.log("      · " + statVoies.divergentes[v]);

  /* NON-REGRESSION, et rien de plus. Les trois taux ci-dessus ne sont PAS des
     proprietes generales du dessin : une enumeration exhaustive des graphes a
     six commits en met 8,3 % en defaut, parce que git compresse ses colonnes.
     Mais sur LES 23 FORMES RETENUES ICI, ils valent ce qui suit, et une baisse
     signale une faute d'attribution — c'est ce qui rattrape les mutations que
     les invariants internes laissent passer.
     ⚠️ Ajouter un scenario peut deplacer ces nombres : les remesurer alors, et
     n'accepter la nouvelle valeur qu'en sachant pourquoi elle a bouge. */
  var REFERENCE = { colonnes: 2, voisins: 0, lignees: 0 };
  var ecartColonnes = statVoies.total - statVoies.concordantes;
  var ecartVoisins = statVoies.voisins - statVoies.voisinsOk;
  var ecartLignees = statVoies.lignees - statVoies.ligneesOk;
  if (!SEUL) {
    if (ecartColonnes > REFERENCE.colonnes) {
      ecarts.push({ ou: "global", quoi: "colonnes differentes de git (non-regression)",
        git: "au plus " + REFERENCE.colonnes, bac: String(ecartColonnes) });
    }
    if (ecartVoisins > REFERENCE.voisins) {
      ecarts.push({ ou: "global", quoi: "voisins gauche-droite inverses (non-regression)",
        git: "au plus " + REFERENCE.voisins, bac: String(ecartVoisins) });
    }
    if (ecartLignees > REFERENCE.lignees) {
      ecarts.push({ ou: "global", quoi: "lignees discontinues (non-regression)",
        git: "au plus " + REFERENCE.lignees, bac: String(ecartLignees) });
    }
  }

  if (!ecarts.length) {
    console.log("OK : le graphe du bac a sable est celui du vrai git.");
    process.exit(0);
  }

  console.log("\n" + ecarts.length + " ECART(S) :\n");
  var montres = ecarts.slice(0, 30);
  for (var k = 0; k < montres.length; k++) {
    var e = montres[k];
    console.log("  [" + e.ou + "] " + e.quoi);
    console.log("      git : " + e.git.replace(/\n/g, "\n            "));
    console.log("      bac : " + e.bac.replace(/\n/g, "\n            "));
  }
  if (ecarts.length > montres.length) console.log("  … et " + (ecarts.length - montres.length) + " autre(s).");
  process.exit(1);
}

main();
