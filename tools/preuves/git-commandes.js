/* =============================================================================
   preuves/git-commandes.js — les commandes du bac a sable jouees DANS CHROME,
   en file://, reseau coupe, et comparees a ce que Node produit (V14, point D2).

   `tools/verif-git-commandes.js` prouve que les commandes font ce que fait le
   vrai git — dans Node. Cette preuve-ci repond a l'autre question : le meme
   fichier, charge comme un script classique par une page ouverte au double-clic,
   se comporte-t-il pareil, sans serveur et sans reseau ? C'est la condition de
   l'apprenant, et c'est la seule qui compte pour le site.

   Usage : node tools/preuves/git-commandes.js
   Code de sortie : 0 si le navigateur et Node concordent et qu'aucune requete
   distante n'est partie, 1 sinon.
   ============================================================================= */
"use strict";

var cp = require("child_process");
var path = require("path");

var RACINE = path.join(__dirname, "..", "..");
var GM = require(path.join(RACINE, "js", "git-modele.js"));
var GC = require(path.join(RACINE, "js", "git-commandes.js"));

/* Le MEME scenario que la page, reecrit ici. Volontairement : si la page et Node
   partageaient le code du scenario, on ne comparerait plus deux executions mais
   une seule, et la preuve ne prouverait rien. */
function scenarioNode() {
  var v = {};
  var d = new GM.Depot({
    identite: "Apprenant <apprenant@syntaxe.invalid>",
    instant: 1704067200, pasHorloge: 0, fuseau: "+0000"
  });
  function taper(ligne) { return GC.executer(d, ligne); }

  d.ecrireFichier("résumé.txt", "un\ndeux\ntrois\n");
  taper("git add .");
  var c1 = taper('git commit -m "premier état"');
  v.commit1 = c1.sortie.join(" / ");
  v.head1 = d.oidHEAD();

  taper("git checkout -b sujet");
  d.ecrireFichier("résumé.txt", "un\nDEUX côté sujet\ntrois\n");
  taper("git add .");
  taper('git commit -m "côté sujet"');
  taper("git checkout main");
  d.ecrireFichier("résumé.txt", "un\nDEUX côté principal\ntrois\n");
  taper("git add .");
  taper('git commit -m "côté principal"');

  var fusion = taper("git merge sujet");
  v.fusionOk = String(fusion.ok);
  v.fusionSortie = fusion.sortie.join(" / ");
  v.fichierEnConflit = d.lireFichier("résumé.txt");
  v.porcelaine = taper("git status --porcelain").sortie.join(" / ");

  d.ecrireFichier("résumé.txt", "un\nDEUX réconcilié\ntrois\n");
  taper("git add résumé.txt");
  var fin = taper('git commit -m "Merge branch \'sujet\'"');
  v.commitFusion = fin.sortie.join(" / ");
  v.parentsFusion = d.lireCommit(d.oidHEAD()).parents.join(",");

  taper("git checkout -b travaux");
  d.ecrireFichier("t.txt", "travaux\n");
  taper("git add .");
  taper('git commit -m "t1"');
  taper("git checkout main");
  d.ecrireFichier("m.txt", "principal\n");
  taper("git add .");
  taper('git commit -m "m1"');
  taper("git checkout travaux");
  var reb = taper("git rebase main");
  v.rebaseSortie = reb.sortie.join(" / ");
  v.journal = taper("git log --oneline").sortie.join(" / ");
  v.refs = Object.keys(d.refs).sort().map(function (r) { return r + "=" + d.refs[r]; }).join(" ");

  var copie = GC.importer(JSON.parse(JSON.stringify(GC.exporter(d))));
  v.apresExport = copie.oidHEAD() + " objets=" + Object.keys(copie.objets).length;
  v.statutApresExport = GC.commandes.status(copie, ["--porcelain"]).sortie.join(" / ");
  return v;
}

var sortie = cp.execFileSync(process.execPath, [
  path.join(RACINE, "tools", "preuve-hors-reseau.js"),
  "tools/preuves/git-commandes.html",
  "--attendre=window.__RESULTAT",
  "--ms=20000"
], { encoding: "utf8", cwd: RACINE });

console.log(sortie.trim());
console.log("");

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
  if (String(deNode[cle]) !== String(duNavigateur.valeurs[cle])) {
    ecarts.push(cle + "\n      node       : " + deNode[cle] + "\n      navigateur : " + duNavigateur.valeurs[cle]);
  }
});

console.log("Comparaison Chrome (file://, DNS coupe) contre Node :");
cles.forEach(function (cle) {
  var valeur = String(duNavigateur.valeurs[cle]).replace(/\n/g, "\\n");
  if (valeur.length > 96) valeur = valeur.slice(0, 93) + "…";
  console.log("  " + (cle + "                    ").slice(0, 20) + " " + valeur);
});
console.log("  " + cles.length + " valeurs comparees, " + ecarts.length + " ecart(s).");
ecarts.forEach(function (e) { console.log("  ECART · " + e); });

var reseau = /requ[eê]tes? distantes?\s*:?\s*(\d+)/i.exec(sortie);
if (reseau && parseInt(reseau[1], 10) > 0) {
  console.log("ECHEC : " + reseau[1] + " requete(s) distante(s).");
  process.exit(1);
}
process.exit(ecarts.length ? 1 : 0);
