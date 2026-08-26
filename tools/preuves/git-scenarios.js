/* =============================================================================
   preuves/git-scenarios.js — LES SITUATIONS GUIDEES, dans Chrome, en file://,
   reseau coupe, pilotees au clavier et a la souris (chantier V14, point D4).

   `tools/verif-git-scenarios.js` prouve que les scenarios sont justes — dans
   Node, contre un vrai git. Cette preuve-ci repond a l'autre question, la seule
   qui compte pour l'apprenant : la PAGE, ouverte au double-clic, sans serveur et
   sans reseau, fait-elle vraiment ce que le module promet ?

   Ce qui est verifie :
     · les neuf situations sont listees, avec leurs titres ;
     · un VRAI clic sur « Commencer » monte la situation et affiche les objectifs,
       tous non atteints ;
     · les indices se donnent UN par UN ;
     · la solution, TAPEE dans le champ, coche tous les objectifs, affiche la
       reussite, le lien vers la lecon, et retient la situation dans localStorage ;
     · un piege laisse les objectifs ouverts ;
     · un chemin DIFFERENT de la solution publiee reussit aussi (c'est la these
       du point : on juge l'etat, pas la commande) ;
     · l'ancre `#scenario-<id>`, celle que les lecons du cours `git` emploient,
       ouvre bien la situation qu'elle nomme ;
     · aucun <script> injecte, aucun debordement horizontal, ZERO requete
       distante.

   Usage : node tools/preuves/git-scenarios.js
   Code de sortie : 0 si tout concorde, 1 sinon.
   ============================================================================= */
"use strict";

var cp = require("child_process");
var fs = require("fs");
var path = require("path");

var RACINE = path.join(__dirname, "..", "..");
var GM = require(path.join(RACINE, "js", "git-modele.js"));
var GC = require(path.join(RACINE, "js", "git-commandes.js"));
var GQ = require(path.join(RACINE, "js", "git-coquille.js"));
var GS = require(path.join(RACINE, "js", "git-scenarios.js"));

/* Les MEMES reglages que js/git-bac.js. */
var IDENTITE = "Apprenant <apprenant@syntaxe.invalid>";
var INSTANT_ZERO = 1704067200;

function depotNeuf() {
  return new GM.Depot({ identite: IDENTITE, branche: "main", instant: INSTANT_ZERO, pasHorloge: 60, fuseau: "+0100" });
}

function jouer(depot, lignes) {
  for (var i = 0; i < lignes.length; i++) {
    if (GQ.estCoquille(lignes[i])) { GQ.executer(depot, lignes[i]); continue; }
    GC.executer(depot, GC.decouperLigne(lignes[i]));
  }
}

function compte(depot, sc) {
  var b = GS.evaluer(depot, sc);
  var faits = b.objectifs.filter(function (o) { return o.atteint; }).length;
  return faits + "/" + b.objectifs.length;
}

/* Ce que Node calcule, sans navigateur : le meme parcours, joue par le meme
   module. Les deux cotes doivent tomber sur les memes comptes — sinon la page
   n'execute pas ce que le module dit. */
function attenduNode() {
  var desindexer = GS.parId("desindexer");
  var conflit = GS.parId("conflit");

  var d1 = depotNeuf();
  jouer(d1, desindexer.mise);
  var avant = compte(d1, desindexer);
  var st = d1.statut();
  var zonesAvant = [
    d1.cheminsTravail().length + st.supprimes.length,
    (function () {
      var vus = {}, n = 0, i;
      for (i = 0; i < st.indexes.length; i++) { vus[st.indexes[i].chemin] = true; n++; }
      var ci = d1.cheminsIndex();
      for (i = 0; i < ci.length; i++) if (!vus[ci[i]]) n++;
      return n;
    })(),
    d1.oidHEAD() ? d1.listerArbre(d1.lireCommit(d1.oidHEAD()).arbre).length : 0
  ].join(" / ");
  jouer(d1, desindexer.solution);
  var apres = compte(d1, desindexer);

  var d2 = depotNeuf();
  jouer(d2, desindexer.mise);
  var remontee = compte(d2, desindexer);
  jouer(d2, desindexer.pieges[0].lignes);
  var piege = compte(d2, desindexer);

  var d3 = depotNeuf();
  jouer(d3, conflit.mise);
  var conflitAvant = compte(d3, conflit);
  jouer(d3, conflit.variantes[0].lignes);
  var conflitApres = compte(d3, conflit);

  return {
    cartes: String(GS.SCENARIOS.length),
    titres: GS.SCENARIOS.map(function (s) { return s.titre; }).join(" | "),
    missionCachee: "oui",
    missionVisible: "oui",
    titreMission: desindexer.titre,
    objectifsTextes: desindexer.objectifs.map(function (o) { return o.texte; }).join(" | "),
    avant: avant,
    zonesAvant: zonesAvant,
    indices1: "1",
    indices2: "2",
    apres: apres,
    reussite: "C'est fait.",
    lienLecon: "git/" + desindexer.lecons[0] + ".html → Leçon "
      + String(parseInt(desindexer.lecons[0].slice(6), 10)) + " — " + GS.TITRES_LECONS[desindexer.lecons[0]],
    faits: JSON.stringify([desindexer.id]),
    cartesFaites: "1",
    remontee: remontee,
    piege: piege,
    conflitAvant: conflitAvant,
    etatConflit: "branche main · merge en cours · 1 fichier(s) en conflit",
    conflitApres: conflitApres,
    progres: "4 objectifs sur 4 atteints",
    apresReinit: "panneau cache",
    /* Le seuil WCAG AA pour du texte ordinaire. Les valeurs exactes sont
       affichees par la preuve ; ici on exige seulement le verdict. */
    contrasteClair: "conforme (7.25:1)",
    contrasteSombre: "conforme (9.23:1)",
    injection: "0",
    debordement: "0"
  };
}

function mesurerDansChrome(pilote, ancre) {
  var args = [
    path.join(RACINE, "tools", "preuve-hors-reseau.js"),
    "pages/git-bac-a-sable.html",
    "--attendre=" + pilote,
    "--ms=25000"
  ];
  if (ancre) args.push("--hash=" + ancre);
  var sortie;
  try {
    sortie = cp.execFileSync(process.execPath, args, { encoding: "utf8", cwd: RACINE });
  } catch (e) {
    sortie = (e.stdout || "") + (e.stderr || "");
  }
  return sortie;
}

var pilote = fs.readFileSync(path.join(__dirname, "git-scenarios-pilote.js"), "utf8")
  .replace(/^\/\*[\s\S]*?\*\/\s*/, "").trim();

var sortie = mesurerDansChrome(pilote, "");
console.log(sortie.trim());
console.log("");

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

var deNode = attenduNode();
var cles = Object.keys(deNode);
var ecarts = [];

console.log("Comparaison Chrome (file://, DNS coupe, page pilotee) contre Node :");
cles.forEach(function (cle) {
  var attendu = String(deNode[cle]);
  var obtenu = String(duNavigateur.valeurs[cle]);
  var affiche = obtenu.length > 84 ? obtenu.slice(0, 81) + "…" : obtenu;
  console.log("  " + (cle + "                 ").slice(0, 17) + " " + affiche);
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
   SECOND VOLET : L'ANCRE DES LECONS.
   Les 24 lecons du cours `git` posent des liens `#scenario-<id>`. Un lien qui
   ouvre la page sans ouvrir la situation ne se voit PAS : la page s'affiche
   normalement, simplement elle ne fait pas ce qu'on a promis. On charge donc la
   page AVEC l'ancre et on regarde ce qui s'affiche.
   --------------------------------------------------------------------------- */
var MESURE_ANCRE = "(function(){"
  + "if (document.readyState !== 'complete') return null;"
  + "var m=document.getElementById('bac-mission');"
  + "if (!m || m.hidden) return null;"
  + "var t=m.querySelector('.bac-panneau__titre');"
  + "var r=m.getBoundingClientRect();"
  /* ⚠️ Le panneau doit etre A L'ECRAN. Tant que la carte portait le meme id que
     le fragment, le navigateur y sautait APRES notre defilement, et le panneau
     se retrouvait 1 706 px plus haut : la page s'ouvrait « normalement » sur
     autre chose que ce qu'on avait promis. Et le fragment doit avoir ETE
     RETIRE, sans quoi un F5 remonterait la situation par-dessus le travail. */
  + "return JSON.stringify({titre:t?t.textContent:'',objectifs:m.querySelectorAll('.bac-objectif').length,"
  + "lignes:document.querySelectorAll('#bac-terminal .bac-ligne').length,"
  + "hash:location.hash,"
  + "panneauVisible:(r.top>=-4 && r.top<window.innerHeight)?'oui':'non ('+Math.round(r.top)+' px)'});})()";

var ID_ANCRE = "rebaser";
var sortie2 = mesurerDansChrome(MESURE_ANCRE, "#scenario-" + ID_ANCRE);
var m2 = /attente[\s\S]*?:\s*(\{[\s\S]*?\})\s+en\s+\d+\s*ms/.exec(sortie2);
var pbAncre = [];
if (!m2) {
  pbAncre.push("l'ancre #scenario-" + ID_ANCRE + " n'a ouvert AUCUNE situation");
} else {
  var v2 = JSON.parse(m2[1]);
  var attenduSc = GS.parId(ID_ANCRE);
  if (v2.titre !== attenduSc.titre) pbAncre.push("titre affiche : « " + v2.titre + " » au lieu de « " + attenduSc.titre + " »");
  if (v2.objectifs !== attenduSc.objectifs.length) pbAncre.push(v2.objectifs + " objectifs affiches au lieu de " + attenduSc.objectifs.length);
  if (!v2.lignes) pbAncre.push("le terminal est reste vide");
  /* ⚠️ Ouvrir la bonne situation ne suffit pas : elle doit etre A L'ECRAN (la
     carte portait le meme id que le fragment, et le navigateur sautait dessus
     APRES notre defilement — panneau 1 706 px trop haut), et le fragment doit
     avoir ete RETIRE (sinon un F5 remonte la situation par-dessus le travail). */
  if (v2.panneauVisible !== "oui") pbAncre.push("le panneau n'est pas a l'ecran : " + v2.panneauVisible);
  if (v2.hash !== "") pbAncre.push("le fragment n'a pas ete retire (" + v2.hash + ") : un F5 remonterait la situation");
  console.log("\nAncre #scenario-" + ID_ANCRE + " : « " + v2.titre + " », " + v2.objectifs
    + " objectifs, " + v2.lignes + " lignes de terminal, panneau a l'ecran : " + v2.panneauVisible
    + ", fragment restant : " + (v2.hash || "(aucun)"));
}
var reseau2 = /requ[eê]tes? DISTANTES?\s*:?\s*(\d+)/i.exec(sortie2);
if (reseau2 && parseInt(reseau2[1], 10) > 0) pbAncre.push(reseau2[1] + " requete(s) distante(s)");

/* ---------------------------------------------------------------------------
   TROISIEME VOLET : les liens poses par js/lecon.js dans une lecon du cours.
   Ils sont construits A L'EXECUTION : aucun controle de source ne les voit.
   --------------------------------------------------------------------------- */
var MESURE_LECON = "(function(){"
  + "if (document.readyState !== 'complete') return null;"
  + "if (!document.querySelector('.lesson-note')) return null;"
  + "var l=document.querySelectorAll('.lesson-bac-git__situations a');"
  + "var out=[];for(var i=0;i<l.length;i++) out.push(l[i].getAttribute('href')+' :: '+l[i].textContent);"
  + "return JSON.stringify({liens:out});})()";

/* La mesure porte ici sur la LECON, pas sur le bac a sable. */
function mesurerLecon(page) {
  var brut;
  try {
    brut = cp.execFileSync(process.execPath, [
      path.join(RACINE, "tools", "preuve-hors-reseau.js"), page,
      "--attendre=" + MESURE_LECON, "--ms=15000"
    ], { encoding: "utf8", cwd: RACINE });
  } catch (e) {
    brut = (e.stdout || "") + (e.stderr || "");
  }
  var mm = /attente[\s\S]*?:\s*(\{[\s\S]*?\})\s+en\s+\d+\s*ms/.exec(brut);
  return mm ? JSON.parse(mm[1]) : null;
}

var pbLecon = [];
var vL = mesurerLecon("pages/git/lecon-07.html");
if (!vL) {
  pbLecon.push("aucune mesure rendue par la lecon 07");
} else {
  var attendus = GS.LECONS["lecon-07"].map(function (id) {
    return "../git-bac-a-sable.html#scenario-" + id + " :: " + GS.parId(id).titre;
  });
  console.log("\nLecon 07 : " + vL.liens.length + " lien(s) vers une situation.");
  if (vL.liens.join(" | ") !== attendus.join(" | ")) {
    pbLecon.push("liens attendus :\n      " + attendus.join("\n      ") + "\n    liens trouves :\n      " + vL.liens.join("\n      "));
  }
}
/* Et un temoin : une lecon d'un AUTRE cours ne doit porter aucun de ces liens. */
var vT = mesurerLecon("pages/python/lecon-03.html");
if (vT && vT.liens.length) pbLecon.push("une lecon de `python` porte " + vT.liens.length + " lien(s) de situation");

var total = ecarts.length + pbAncre.length + pbLecon.length;
pbAncre.forEach(function (x) { console.log("  ECART · ancre : " + x); });
pbLecon.forEach(function (x) { console.log("  ECART · lecon : " + x); });

if (!total) {
  console.log("\nOK : la page monte les situations, juge l'etat, accepte plusieurs chemins, "
    + "et les lecons y menent — en file://, DNS coupe, 0 requete distante.");
  process.exit(0);
}
console.log("\nECHEC : " + total + " ecart(s).");
process.exit(1);
