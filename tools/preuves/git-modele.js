/* =============================================================================
   preuves/git-modele.js — le modele de depot joue DANS CHROME, en file://,
   reseau coupe, et compare a ce que Node produit (chantier V14, point D1).

   `tools/verif-git-modele.js` prouve que le modele rend les empreintes du vrai
   git — dans Node. Cette preuve-ci repond a l'autre question : le meme fichier,
   charge comme un script classique par une page ouverte au double-clic, rend-il
   les MEMES empreintes, sans serveur et sans reseau ? C'est la condition de
   l'apprenant, et c'est la seule qui compte pour le site.

   Usage : node tools/preuves/git-modele.js
   Code de sortie : 0 si le navigateur et Node concordent et qu'aucune requete
   distante n'est partie, 1 sinon.
   ============================================================================= */
"use strict";

var cp = require("child_process");
var path = require("path");

var RACINE = path.join(__dirname, "..", "..");
var GitModele = require(path.join(RACINE, "js", "git-modele.js"));

/* Le MEME scenario que la page, rejoue ici. Ecrit deux fois volontairement :
   si la page et Node partageaient le code du scenario, on ne comparerait plus
   deux executions mais une seule. */
function scenarioNode() {
  var res = {};
  var d = new GitModele.Depot();

  d.ecrireFichier("notes.txt", "premiere note\n");
  d.indexer("notes.txt");
  res.blob1 = d.index["notes.txt"].oid;
  var c1 = d.creerCommit({ arbre: d.ecrireArbre(), parents: [], message: "Ajoute les notes", instant: 1704067200, fuseau: "+0000" });
  d.avancerHEAD(c1);
  res.arbre1 = d.lireCommit(c1).arbre;
  res.commit1 = c1;

  d.ecrireFichier("docs/résumé.md", "# Résumé\n\nÉcrit en français.\n");
  d.indexer("docs/résumé.md");
  res.blobAccents = d.index["docs/résumé.md"].oid;
  var c2 = d.creerCommit({ arbre: d.ecrireArbre(), parents: [c1], message: "Corrige l'accès à la clé", instant: 1704067260, fuseau: "+0000" });
  d.avancerHEAD(c2);
  res.arbre2 = d.lireCommit(c2).arbre;
  res.commit2 = c2;

  d.majRef("refs/heads/sujet", c1);
  d.pointerHEAD("refs/heads/sujet");
  d.materialiser(d.lireCommit(c1).arbre);
  d.ecrireFichier("sujet.txt", "sur la branche\n");
  d.indexer("sujet.txt");
  var c3 = d.creerCommit({ arbre: d.ecrireArbre(), parents: [c1], message: "Travail sur la branche", instant: 1704067320, fuseau: "+0000" });
  d.avancerHEAD(c3);
  res.commit3 = c3;
  res.baseDeFusion = d.baseDeFusion("main", "sujet");
  res.resoudre = d.resoudre("main~1");
  res.journalSujet = d.journal("sujet").map(function (c) { return c.oid; }).join(",");
  res.diff = d.diffArbres(d.lireCommit(c1).arbre, d.lireCommit(c2).arbre)
    .map(function (e) { return e.chemin + ":" + e.etat; }).join(",");

  d.ecrireFichier("sujet.txt", "modifié après indexation\n");
  d.ecrireFichier("neuf.txt", "jamais indexé\n");
  var s = d.statut();
  res.statut = "branche=" + s.branche + " indexes=" + s.indexes.length +
    " modifies=" + s.modifies.join("|") + " nonSuivis=" + s.nonSuivis.join("|") +
    " propre=" + s.propre;

  var copie = GitModele.Depot.importer(JSON.parse(JSON.stringify(d.exporter())));
  res.apresExport = copie.oidHEAD() + " objets=" + Object.keys(copie.objets).length;
  return res;
}

var sortie = cp.execFileSync(process.execPath, [
  path.join(RACINE, "tools", "preuve-hors-reseau.js"),
  "tools/preuves/git-modele.html",
  "--attendre=window.__RESULTAT",
  "--ms=20000"
], { encoding: "utf8", cwd: RACINE });

console.log(sortie.trim());
console.log("");

/* Le pilote imprime le texte de la page au milieu de son propre rapport : on
   decoupe par lignes (la premiere « { » seule jusqu'a la « } » seule) plutot que
   par expression reguliere, qui se casse des que le JSON gagne un champ. */
var lignes = sortie.split(/\r?\n/);
var debut = -1, fin = -1;
for (var i = 0; i < lignes.length; i++) {
  if (debut === -1 && lignes[i].trim() === "{") debut = i;
  else if (debut !== -1 && lignes[i].trim() === "}") { fin = i; break; }
}
if (debut === -1 || fin === -1) {
  console.log("ECHEC : la page n'a rien rendu d'exploitable.");
  process.exit(1);
}
var duNavigateur;
try {
  duNavigateur = JSON.parse(lignes.slice(debut, fin + 1).join("\n"));
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
cles.forEach(function (cle) {
  if (String(deNode[cle]) !== String(duNavigateur.empreintes[cle])) {
    ecarts.push(cle + " : node=" + deNode[cle] + " · navigateur=" + duNavigateur.empreintes[cle]);
  }
});

console.log("Comparaison Chrome (file://, DNS coupe) contre Node :");
cles.forEach(function (cle) {
  console.log("  " + (cle + "                ").slice(0, 16) + " " + duNavigateur.empreintes[cle]);
});
console.log("  " + cles.length + " valeurs comparees, " + ecarts.length + " ecart(s).");
ecarts.forEach(function (e) { console.log("  ECART · " + e); });

/* Le pilote signale les requetes sortantes ; on echoue aussi la-dessus. */
var reseau = /requ[eê]tes? distantes?\s*:?\s*(\d+)/i.exec(sortie);
if (reseau && parseInt(reseau[1], 10) > 0) {
  console.log("ECHEC : " + reseau[1] + " requete(s) distante(s).");
  process.exit(1);
}
process.exit(ecarts.length ? 1 : 0);
