/* =============================================================================
   verif-git-graphe-mutations.js — la contre-epreuve de tools/verif-git-graphe.js
   (chantier V14, point D3).

   1 636 comparaisons vertes ne prouvent rien tant qu'on n'a pas montre que le
   ROUGE est atteignable. On abime donc une regle du graphe, une a la fois, dans
   une COPIE de js/git-graphe.js, et on exige que le verificateur s'en apercoive.

   Une mutation NON detectee est l'information la plus utile de cet outil : soit
   le controle a un trou, soit — et D2 l'a paye trois fois — la mutation
   n'abimait rien du tout, et c'est alors la MUTATION qu'il faut remplacer par
   une faute reelle.

   Usage : node tools/verif-git-graphe-mutations.js
   Code de sortie : 0 si TOUTES les fautes injectees sont vues, 1 sinon.
   ============================================================================= */
"use strict";

var cp = require("child_process");
var fs = require("fs");
var os = require("os");
var path = require("path");

var RACINE = path.join(__dirname, "..");
var SOURCE = path.join(RACINE, "js", "git-graphe.js");
var OUTIL = path.join(RACINE, "tools", "verif-git-graphe.js");
var original = fs.readFileSync(SOURCE, "utf8");

var MUTATIONS = [
  /* --- l'ordre des lignes -------------------------------------------------- */
  { nom: "topo : depiler par le mauvais bout (file au lieu de pile)",
    de: "      var oid = pile.pop();",
    a: "      var oid = pile.shift();" },
  { nom: "topo : ne pas renverser les pointes de depart",
    de: "    pile.reverse();",
    a: "" },
  { nom: "topo : empiler les parents dans l'ordre inverse",
    de: "      for (j = 0; j < cc.parents.length; j++) {\n        var q = cc.parents[j];",
    a: "      for (j = cc.parents.length - 1; j >= 0; j--) {\n        var q = cc.parents[j];" },
  { nom: "topo : ne compter que le premier enfant d'un commit",
    de: "      for (j = 0; j < c.parents.length; j++) {\n        var p = c.parents[j];\n        if (dans[p]) attentes[p]++;",
    a: "      for (j = 0; j < 1 && j < c.parents.length; j++) {\n        var p = c.parents[j];\n        if (dans[p]) attentes[p]++;" },
  { nom: "date : trier sur la date d'AUTEUR, pas de committeur",
    de: "        if (ca.instantCommit !== cb.instantCommit) return cb.instantCommit - ca.instantCommit;\n        return a.rang - b.rang;",
    a: "        if (ca.instant !== cb.instant) return cb.instant - ca.instant;\n        return a.rang - b.rang;" },
  { nom: "date : departager par empreinte au lieu de l'ordre d'insertion",
    de: "        return a.rang - b.rang;",
    a: "        return a.oid < b.oid ? -1 : (a.oid > b.oid ? 1 : 0);" },
  { nom: "date : du plus ancien au plus recent",
    de: "        if (ca.instantCommit !== cb.instantCommit) return cb.instantCommit - ca.instantCommit;\n        return a.rang - b.rang;",
    a: "        if (ca.instantCommit !== cb.instantCommit) return ca.instantCommit - cb.instantCommit;\n        return a.rang - b.rang;" },
  { nom: "departs : les references dans l'ordre de la table, non trie",
    de: "    noms.sort();",
    a: "    noms.reverse();" },
  { nom: "departs : oublier HEAD comme point de depart",
    de: "    oid = depot.oidHEAD();\n    if (oid && depot.existe(oid)",
    a: "    oid = null;\n    if (oid && depot.existe(oid)" },
  { nom: "departs : ignorer les etiquettes",
    de: "      oid = depot.refs[noms[i]];\n      if (!oid || depot.typeDe(oid) !== \"commit\" || vus[oid]) continue;",
    a: "      oid = depot.refs[noms[i]];\n      if (!oid || noms[i].indexOf(\"refs/tags/\") === 0 || depot.typeDe(oid) !== \"commit\" || vus[oid]) continue;" },

  /* --- les colonnes -------------------------------------------------------- */
  { nom: "voies : ne jamais reprendre la voie qui attend le commit",
    de: "      for (j = 0; j < voies.length; j++) if (voies[j] === oid) { voie = j; break; }",
    a: "" },
  { nom: "voies : ne pas refermer la voie de droite quand deux lignees convergent",
    de: "          voies[droite] = null;\n          voies[gauche] = parents[0];\n          voiesParents.push(gauche);",
    a: "          voies[voie] = parents[0];\n          voiesParents.push(voie);" },
  { nom: "voies : a la convergence, garder la colonne de DROITE",
    de: "          var gauche = Math.min(voie, deja), droite = Math.max(voie, deja);",
    a: "          var gauche = Math.max(voie, deja), droite = Math.min(voie, deja);" },
  { nom: "voies : ne pas fermer la voie d'une racine",
    de: "        voies[voie] = null;                       // une racine : la voie s'arrête",
    a: "        voies[voie] = oid;" },
  { nom: "voies : prendre toujours une colonne neuve a droite",
    de: "      for (var i = 0; i < voies.length; i++) if (voies[i] === null) return i;\n      voies.push(null);",
    a: "      voies.push(null);" },
  { nom: "voies : ouvrir une colonne neuve pour un second parent deja attendu",
    de: "          if (existante < 0) { existante = premiereLibre(); voies[existante] = parents[j]; }",
    a: "          existante = premiereLibre(); voies[existante] = parents[j];" },

  /* --- les aretes ---------------------------------------------------------- */
  { nom: "aretes : oublier le second parent d'une fusion",
    de: "      for (j = 0; j < Li.parents.length; j++) {",
    a: "      for (j = 0; j < 1 && j < Li.parents.length; j++) {" },
  { nom: "aretes : accrocher l'arete au commit suivant plutot qu'au parent",
    de: "        var np = parLigne[pOid];\n        if (!np) continue;",
    a: "        var np = noeuds[i + 1] || parLigne[pOid];\n        if (!np) continue;" },
  { nom: "aretes : inverser enfant et parent",
    de: "          enfant: ne.oid,\n          parent: pOid,",
    a: "          enfant: pOid,\n          parent: ne.oid," },

  /* --- les marques --------------------------------------------------------- */
  { nom: "marques : ne jamais montrer HEAD",
    de: "    if (tete) ajouter(tete, { sorte: \"tete\", nom: \"HEAD\", branche: courante, courante: true });",
    a: "" },
  { nom: "marques : oublier la branche dans la pastille HEAD",
    de: "branche: courante, courante: true });",
    a: "branche: null, courante: true });" },
  { nom: "marques : afficher deux fois la branche courante",
    de: "      if (branches[i] === courante) continue;",
    a: "" },
  { nom: "marques : ignorer les etiquettes",
    de: "      ajouter(oid, { sorte: \"etiquette\", nom: etiquettes[i], courante: false });",
    a: "" },
  { nom: "marques : poser une etiquette sur le mauvais commit",
    de: "      oid = depot.oidDeRef(\"refs/tags/\" + etiquettes[i]);",
    a: "      oid = depot.oidHEAD();" },
  { nom: "marques : confondre branche et etiquette",
    de: "      ajouter(oid, { sorte: \"branche\", nom: branches[i], courante: false });",
    a: "      ajouter(oid, { sorte: \"etiquette\", nom: branches[i], courante: false });" },

  /* --- le dessin lui-meme --------------------------------------------------- */
  { nom: "SVG : ne pas echapper les chevrons d'un message",
    de: "    return String(s).replace(/&/g, \"&amp;\").replace(/</g, \"&lt;\").replace(/>/g, \"&gt;\")",
    a: "    return String(s).replace(/&/g, \"&amp;\")" },
  { nom: "SVG : oublier de fermer les balises",
    de: "    return out + \"</\" + noeud.tag + \">\";",
    a: "    return out;" },
  { nom: "orphelins : les afficher meme quand on ne les demande pas",
    de: "    if (options.orphelins) {\n      var atteints = dico();",
    a: "    if (true) {\n      var atteints = dico();" },
  { nom: "orphelins : ne jamais les marquer comme perdus",
    de: "        orphelin: !!options.orphelins && !atteignables[L.oid],",
    a: "        orphelin: false," }
];

var dossier = fs.mkdtempSync(path.join(os.tmpdir(), "syntaxe-mutg-"));
fs.copyFileSync(path.join(RACINE, "js", "git-modele.js"), path.join(dossier, "git-modele.js"));
var detectees = 0, ratees = [];

console.log("Contre-epreuve de verif-git-graphe.js : " + MUTATIONS.length + " fautes injectees.\n");

MUTATIONS.forEach(function (m, i) {
  if (original.indexOf(m.de) === -1) {
    ratees.push({ nom: m.nom, pourquoi: "motif introuvable (mutation caduque : le code a change)" });
    console.log("  " + (i + 1) + ". " + m.nom + " → MOTIF INTROUVABLE");
    return;
  }
  var mute = original.replace(m.de, m.a);
  var chemin = path.join(dossier, "git-graphe-" + (i + 1) + ".js");
  fs.writeFileSync(chemin, mute, "utf8");
  var res = cp.spawnSync(process.execPath, [OUTIL, "--graphe=" + chemin, "--vite"], { encoding: "utf8" });
  var sortie = (res.stdout || "") + (res.stderr || "");
  var vu = res.status !== 0;
  if (vu) detectees++;
  else ratees.push({ nom: m.nom, pourquoi: "le verificateur reste vert" });
  var nb = /(\d+) ECART/.exec(sortie);
  console.log("  " + (i + 1) + ". " + m.nom + " → " + (vu ? "DETECTEE" : "*** NON DETECTEE ***")
    + (nb ? " (" + nb[1] + " ecart(s))" : vu ? " (le graphe leve une erreur)" : ""));
});

console.log("\n  " + detectees + "/" + MUTATIONS.length + " mutations detectees.");
if (ratees.length) {
  ratees.forEach(function (r) { console.log("  TROU · " + r.nom + " : " + r.pourquoi); });
}
try { fs.rmSync(dossier, { recursive: true, force: true, maxRetries: 3 }); } catch (e) { /* rien */ }
process.exit(ratees.length ? 1 : 0);
