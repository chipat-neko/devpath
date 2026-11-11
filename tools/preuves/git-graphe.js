/* =============================================================================
   preuves/git-graphe.js — LA PAGE DU BAC A SABLE, ouverte dans Chrome en
   file://, reseau coupe, pilotee au clavier, et son graphe compare a ce que
   Node calcule (chantier V14, point D3).

   `tools/verif-git-graphe.js` prouve que le graphe est celui du vrai git — dans
   Node. Cette preuve-ci repond a l'autre question, la seule qui compte pour
   l'apprenant : la PAGE, ouverte au double-clic, sans serveur et sans reseau,
   dessine-t-elle ce meme graphe ?

   Ce qui est verifie :
     · la page se charge et pose ses ecouteurs (on tape VRAIMENT dans le champ) ;
     · apres 15 commandes, le SVG contient les bons commits, dans le bon ordre,
       aux bonnes abscisses, avec les bonnes marques ;
     · les trois zones (travail / index / commit) affichent les bons comptes ;
     · aucune balise <script> n'a ete injectee dans le graphe ;
     · le graphe DEFILE dans son cadre au lieu de pousser la page ;
     · la case « commits abandonnes » les fait reapparaitre apres un
       `reset --hard` qui les a rendus inatteignables ;
     · l'encart des 24 lecons du cours `git` existe, une seule fois, et son lien
       RELATIF mene a un fichier qui existe ; de meme pour les lecons d'autres
       cours que la table BAC_GIT_AILLEURS de js/lecon.js y ajoute (V16, D2) ;
     · ZERO requete distante.

   Usage : node tools/preuves/git-graphe.js
   Code de sortie : 0 si tout concorde, 1 sinon.
   ============================================================================= */
"use strict";

var cp = require("child_process");
var fs = require("fs");
var path = require("path");

var RACINE = path.join(__dirname, "..", "..");
var GM = require(path.join(RACINE, "js", "git-modele.js"));
var GC = require(path.join(RACINE, "js", "git-commandes.js"));
var GG = require(path.join(RACINE, "js", "git-graphe.js"));

/* Les MEMES reglages que js/git-bac.js : sans eux, les empreintes different et
   la comparaison ne veut rien dire. */
var IDENTITE = "Apprenant <apprenant@syntaxe.invalid>";
var INSTANT_ZERO = 1704067200;

/* Le meme scenario que le pilote, reecrit ici : si les deux cotes partageaient
   le code, on ne comparerait plus deux executions mais une seule. */
function scenarioNode() {
  var d = new GM.Depot({ identite: IDENTITE, branche: "main", instant: INSTANT_ZERO, pasHorloge: 60, fuseau: "+0100" });
  function taper(ligne) { return GC.executer(d, ligne); }

  d.ecrireFichier("notes.txt", "un\n");
  taper("git add notes.txt");
  taper('git commit -m "premier commit"');
  taper("git checkout -b sujet");
  d.ecrireFichier("sujet.txt", "deux\n");
  taper("git add .");
  taper('git commit -m "cote sujet"');
  taper("git checkout main");
  d.ecrireFichier("principal.txt", "trois\n");
  taper("git add .");
  taper('git commit -m "cote principal"');
  taper("git merge sujet");
  taper("git tag jalon");
  d.ecrireFichier("brouillon.txt", "brouillon\n");

  var disposition = GG.disposer(d, {});
  var marques = [];
  disposition.noeuds.forEach(function (n) {
    n.marques.forEach(function (m) {
      marques.push(m.sorte === "etiquette" ? "tag: " + m.nom
        : (m.sorte === "tete" && m.branche ? "HEAD → " + m.branche : m.nom));
    });
  });

  var st = d.statut();
  var travail = d.cheminsTravail().length;
  var index = st.indexes.length + d.cheminsIndex().filter(function (c) {
    for (var i = 0; i < st.indexes.length; i++) if (st.indexes[i].chemin === c) return false;
    return true;
  }).length + st.supprimes.length;
  var commit = d.oidHEAD() ? d.listerArbre(d.lireCommit(d.oidHEAD()).arbre).length : 0;

  /* Puis, comme le pilote : on retire l'etiquette et on recule d'un commit. La
     fusion n'est plus atteignable — git l'oublie, le bac a sable doit savoir la
     remontrer sur demande. */
  taper("git tag -d jalon");
  taper("git reset --hard HEAD~1");
  var apresReset = GG.disposer(d, {});
  var avecOrphelins = GG.disposer(d, { orphelins: true });

  return {
    commits: String(disposition.noeuds.length),
    ordre: disposition.noeuds.map(function (n) { return n.abrev; }).join(" "),
    abscisses: disposition.noeuds.map(function (n) { return String(n.x); }).join(" "),
    aretes: String(disposition.aretes.length),
    marques: marques.join(" | "),
    zones: [travail, index, commit].join(" / "),
    etat: "branche " + d.brancheCourante(),
    fusions: String(disposition.noeuds.filter(function (n) { return n.fusion; }).length),
    titres: disposition.noeuds.map(function (n) { return n.titre; }).join(" | "),
    injection: "0",
    depassement: "aucun",
    defilement: "auto",
    debordement: "0",
    apresReset: String(apresReset.noeuds.length),
    avecOrphelins: String(avecOrphelins.noeuds.length),
    marquesPerdus: String(avecOrphelins.noeuds.filter(function (n) { return n.orphelin; }).length),
    depassementDur: "aucun",
    debordementDur: "0"
  };
}

var pilote = fs.readFileSync(path.join(__dirname, "git-graphe-pilote.js"), "utf8");
/* L'expression est evaluee telle quelle par Chrome : on retire l'en-tete de
   commentaire pour ne pas transporter un bloc inutile a chaque tour de boucle. */
pilote = pilote.replace(/^\/\*[\s\S]*?\*\/\s*/, "").trim();

var sortie;
try {
  sortie = cp.execFileSync(process.execPath, [
    path.join(RACINE, "tools", "preuve-hors-reseau.js"),
    "pages/git-bac-a-sable.html",
    "--attendre=" + pilote,
    "--ms=25000"
  ], { encoding: "utf8", cwd: RACINE });
} catch (e) {
  sortie = (e.stdout || "") + (e.stderr || "");
  console.log(sortie.trim());
  console.log("\nECHEC : la page n'a pas abouti (voir ci-dessus).");
  process.exit(1);
}

console.log(sortie.trim());
console.log("");

/* La valeur rendue par l'expression est imprimee par preuve-hors-reseau.js sur
   la ligne « attente ... : <valeur> en <n> ms ». */
var m = /attente[\s\S]*?:\s*(\{[\s\S]*?\})\s+en\s+\d+\s*ms/.exec(sortie);
if (!m) {
  console.log("ECHEC : la page n'a rien rendu d'exploitable.");
  process.exit(1);
}
var duNavigateur;
try {
  duNavigateur = JSON.parse(m[1]);
} catch (e) {
  console.log("ECHEC : sortie de la page illisible — " + e.message);
  process.exit(1);
}
if (!duNavigateur.ok) {
  console.log("ECHEC dans le navigateur : " + duNavigateur.erreur);
  process.exit(1);
}

var deNode = scenarioNode();
var cles = Object.keys(deNode);
var ecarts = [];

console.log("Comparaison Chrome (file://, DNS coupe, page pilotee au clavier) contre Node :");
cles.forEach(function (cle) {
  var attendu = String(deNode[cle]);
  var obtenu = String(duNavigateur.valeurs[cle]);
  var affiche = obtenu.length > 88 ? obtenu.slice(0, 85) + "…" : obtenu;
  console.log("  " + (cle + "              ").slice(0, 14) + " " + affiche);
  if (attendu !== obtenu) {
    ecarts.push(cle + "\n      node       : " + attendu + "\n      navigateur : " + obtenu);
  }
});
console.log("  " + cles.length + " valeurs comparees, " + ecarts.length + " ecart(s).");
ecarts.forEach(function (e) { console.log("  ECART · " + e); });

var reseau = /requ[eê]tes? DISTANTES?\s*:?\s*(\d+)/i.exec(sortie);
if (reseau && parseInt(reseau[1], 10) > 0) {
  console.log("ECHEC : " + reseau[1] + " requete(s) distante(s).");
  process.exit(1);
}

/* ---------------------------------------------------------------------------
   SECOND VOLET : l'encart pose par js/lecon.js dans les 24 lecons du cours git.
   Il est construit A L'EXECUTION : ni verif-html ni verif-donnees ne peuvent le
   voir, et son lien est RELATIF — une profondeur fausse ouvre la page sans la
   moindre erreur et mene nulle part. C'est exactement le piege trouve au point
   C4. On verifie donc dans le navigateur que l'encart existe, qu'il n'y en a
   qu'un, et que sa cible EXISTE SUR LE DISQUE. Et sur un temoin (une lecon d'un
   autre cours) qu'il n'y en a aucun.
   --------------------------------------------------------------------------- */

/* ⚠️ La mesure doit rendre `null` TANT QUE la page n'est pas prete, sinon elle
   lit un DOM que `js/lecon.js` n'a pas encore garni et rend « 0 encart » pour un
   faux negatif silencieux — c'est arrive une fois sur trois pages. `.lesson-note`
   est pose par `initNotes`, qui tourne AVANT `initBacGit` dans la meme passe :
   sa presence prouve que le script de lecon est alle jusqu'au bout. */
var MESURE_ENCART = "(function(){"
  + "if (document.readyState !== 'complete') return null;"
  + "if (!document.querySelector('.lesson-note')) return null;"
  + "var a=document.querySelector('.lesson-bac-git a');"
  + "return JSON.stringify({encarts:document.querySelectorAll('.lesson-bac-git').length,"
  + "href:a?a.getAttribute('href'):'',resolu:a?a.href:''});})()";

/* ⚠️ UN VOLET QUI RENONCE DIT POURQUOI (chantier V18, point A5). Sur 33 passages de
   cet outil ou les volets ont tourne, sous la charge de cinq autres agents, un seul a
   vu deux volets finir en « aucune mesure rendue » (141,5 s au lieu de ~35) ; lancer
   Chrome y coutait de 1,1 a 13,0 s par volet (mediane 5,1 s). Rien ne permettait d'en
   savoir plus : la sortie de preuve-hors-reseau.js etait jetee. Or elle sait la
   raison : attente EXPIREE, Chrome qui n'a pas ecrit son port, Chrome qui n'a pas
   repondu. On garde donc ces lignes-la, et la duree du volet ; le verdict, lui, ne
   change pas (toujours rouge). Seules les lignes que preuve-hors-reseau.js ECRIT
   LUI-MEME sont retenues : la sortie contient aussi le texte de la page, ou « porte »
   et « rapport » feraient du bruit. */
function raisonBrute(brut, ms) {
  var l = String(brut).split(/\r?\n/).filter(function (x) {
    return /^\s*(attente « |échecs de chargement|requêtes DISTANTES: [1-9])|^Chrome n'a pas|NON MESUR/.test(x);
  }).map(function (x) {
    x = x.trim().replace(/^attente « [\s\S]* » : /, "attente : ");
    return x.length > 170 ? x.slice(0, 60) + " [...] " + x.slice(-100) : x;
  });
  return "aucune mesure rendue en " + ms + " ms — " + (l.length ? l.join(" // ") : "preuve-hors-reseau.js n'a rien dit");
}

function volet(page, attendu) {
  var brut, t0 = Date.now();
  try {
    brut = cp.execFileSync(process.execPath, [
      path.join(RACINE, "tools", "preuve-hors-reseau.js"), page,
      "--attendre=" + MESURE_ENCART, "--ms=15000"
    ], { encoding: "utf8", cwd: RACINE });
  } catch (e) {
    brut = (e.stdout || "") + (e.stderr || "");
  }
  var mm = /attente[\s\S]*?:\s*(\{[\s\S]*?\})\s+en\s+\d+\s*ms/.exec(brut);
  if (!mm) return { page: page, erreur: raisonBrute(brut, Date.now() - t0) };
  var v;
  try { v = JSON.parse(mm[1]); } catch (e) { return { page: page, erreur: "mesure illisible" }; }
  var pb = [];
  if (v.encarts !== attendu) pb.push(attendu + " encart(s) attendu(s), " + v.encarts + " trouve(s)");
  if (attendu > 0) {
    if (v.href !== "../git-bac-a-sable.html") pb.push("lien inattendu : " + v.href);
    var cible = decodeURIComponent(String(v.resolu).replace(/^file:\/{2,3}/, ""));
    if (!fs.existsSync(cible)) pb.push("le lien ne mene a AUCUN fichier : " + cible);
  }
  var distantes = /requ[eê]tes? DISTANTES?\s*:?\s*(\d+)/i.exec(brut);
  if (distantes && parseInt(distantes[1], 10) > 0) pb.push(distantes[1] + " requete(s) distante(s)");
  return { page: page, encarts: v.encarts, href: v.href, problemes: pb };
}

/* Depuis le chantier V16 (point D2), l'encart sort du cours `git` pour les lecons de la
   table BAC_GIT_AILLEURS de js/lecon.js. La liste est LUE dans le fichier, pas recopiee
   ici : une lecon ajoutee a la table est ouverte au passage suivant, sans qu'on y pense. */
var AILLEURS = [], soucisTable = [];
(function () {
  var src = fs.readFileSync(path.join(RACINE, "js", "lecon.js"), "utf8");
  var m = /var BAC_GIT_AILLEURS = (\[[^\]]*\]);/.exec(src);
  if (!m) { soucisTable.push("js/lecon.js ne declare pas BAC_GIT_AILLEURS"); return; }
  try { AILLEURS = JSON.parse(m[1]); } catch (e) { soucisTable.push("BAC_GIT_AILLEURS n'est pas du JSON valide"); return; }
  AILLEURS.forEach(function (cle) {
    if (/^git\//.test(cle)) soucisTable.push(cle + " : une lecon du cours git n'a rien a faire dans BAC_GIT_AILLEURS");
    if (!fs.existsSync(path.join(RACINE, "pages", cle + ".html"))) soucisTable.push(cle + " : la lecon n'existe pas sur le disque");
  });
  /* Hors du cours, l'encart AFFIRME ce que le bac a sable execute et ce qu'il n'a pas.
     Deux listes de js/lecon.js forment cette phrase ; on les confronte au vrai
     dictionnaire des commandes, celui que la page charge. Le jour ou `push` y entrera,
     la phrase deviendra fausse — et cet outil rougira. */
  function liste(nom) {
    var r = new RegExp("var " + nom + " = (\\[[^\\]]*\\]);").exec(src);
    if (!r) { soucisTable.push("js/lecon.js ne declare pas " + nom); return []; }
    try { return JSON.parse(r[1]); } catch (e) { soucisTable.push(nom + " n'est pas du JSON valide"); return []; }
  }
  liste("BAC_GIT_EXECUTE").forEach(function (c) {
    if (!Object.prototype.hasOwnProperty.call(GC.commandes, c)) soucisTable.push("l'encart dit que le bac a sable execute « git " + c + " » : il ne la connait pas");
  });
  liste("BAC_GIT_NE_SIMULE_PAS").forEach(function (c) {
    if (Object.prototype.hasOwnProperty.call(GC.commandes, c)) soucisTable.push("l'encart dit que « git " + c + " » n'existe pas dans le bac a sable : elle y existe");
  });
})();

console.log("\nL'encart des lecons du cours git (pose a l'execution par js/lecon.js) :");
var volets = [
  volet("pages/git/lecon-05.html", 1),
  volet("pages/git/lecon-24.html", 1),
  volet("pages/python/lecon-05.html", 0)
].concat(AILLEURS.filter(function (cle) {
  return fs.existsSync(path.join(RACINE, "pages", cle + ".html"));
}).map(function (cle) { return volet("pages/" + cle + ".html", 1); }));
var soucis = soucisTable.length;
soucisTable.forEach(function (s) { console.log("  TABLE BAC_GIT_AILLEURS → " + s); });
volets.forEach(function (r) {
  if (r.erreur) { console.log("  " + r.page + " → ECHEC : " + r.erreur); soucis++; return; }
  console.log("  " + (r.page + "                        ").slice(0, 28)
    + r.encarts + " encart(s)" + (r.href ? ", lien " + r.href : "")
    + (r.problemes.length ? "  ← " + r.problemes.join(" ; ") : "  ok"));
  soucis += r.problemes.length;
});

process.exit(ecarts.length || soucis ? 1 : 0);
