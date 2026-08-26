/* =============================================================================
   verif-git-commandes-mutations.js — la contre-epreuve de
   tools/verif-git-commandes.js (chantier V14, point D2).

   3263 comparaisons vertes ne prouvent rien tant qu'on n'a pas montre que le
   ROUGE est atteignable. On abime donc volontairement une regle des commandes,
   une a la fois, dans une COPIE, et on exige que le verificateur s'en apercoive.
   Une mutation non detectee designe un trou dans le controle, pas un detail :
   c'est exactement ainsi qu'on a decouvert, au point D1, qu'un verificateur
   pouvait reproduire le defaut de ce qu'il controle et rendre un vert par
   vacuite.

   Usage : node tools/verif-git-commandes-mutations.js
   Code de sortie : 0 si TOUTES les fautes injectees sont vues, 1 sinon.
   ============================================================================= */
"use strict";

var cp = require("child_process");
var fs = require("fs");
var os = require("os");
var path = require("path");

var RACINE = path.join(__dirname, "..");
var SOURCE = path.join(RACINE, "js", "git-commandes.js");
var MODELE = path.join(RACINE, "js", "git-modele.js");
var OUTIL = path.join(RACINE, "tools", "verif-git-commandes.js");
var original = fs.readFileSync(SOURCE, "utf8");

var MUTATIONS = [
  /* --- la fusion de contenu ------------------------------------------------ */
  { nom: "diff3 : prendre NOTRE version quand seul « leur » a bouge",
    de: 'if (ta === to) { commun.type = "resolu"; commun.sortie = sb; return commun; }',
    a: 'if (ta === to) { commun.type = "resolu"; commun.sortie = sa; return commun; }' },
  { nom: "diff3 : ne jamais signaler de conflit",
    de: '      conflit = true;\n      sortie.push("<<<<<<< " + labelNotre',
    a: '      conflit = false;\n      sortie.push("<<<<<<< " + labelNotre' },
  { nom: "marqueurs : six chevrons au lieu de sept",
    de: 'sortie.push("<<<<<<< " + labelNotre + fin);',
    a: 'sortie.push("<<<<<< " + labelNotre + fin);' },
  { nom: "marqueurs : oublier la ligne de separation",
    de: 'sortie.push("=======" + fin);',
    a: '' },
  { nom: "diff3 : ne pas recoller deux conflits proches",
    de: 'var CONTEXTE_XDIFF = 3;',
    a: 'var CONTEXTE_XDIFF = 0;' },
  { nom: "diff3 : ancrer sur la base meme quand elle est vide",
    de: '    if (!o.length) {',
    a: '    if (false) {' },
  { nom: "fusion : conflit ajout/ajout traite comme un conflit de contenu",
    de: 'conflits[c] = { genre: "ajout/ajout", base: null, notre: en, leur: el };',
    a: 'conflits[c] = { genre: "contenu", base: null, notre: en, leur: el };' },
  { nom: "fusion : ne rien garder d'un conflit « modifie / supprime »",
    de: '        resultat[c] = garde;\n        contenus[c] = depot.lireBlob(garde.oid);',
    a: '        contenus[c] = depot.lireBlob(garde.oid);' },

  /* --- l'index et le commit ------------------------------------------------ */
  { nom: "add : ne pas marquer le conflit resolu",
    de: 'if (possede(e.conflits, c)) { delete e.conflits[c]; resolus.push(c); }',
    a: 'if (possede(e.conflits, c)) { resolus.push(c); }' },
  { nom: "commit : oublier le second parent d'une fusion",
    de: 'if (e.operation === "merge" && e.tete) parents = parents.concat([e.tete]);',
    a: '' },
  { nom: "commit : accepter un commit qui ne change rien",
    de: '    if (!permettreVide && !amend && e.operation !== "merge"',
    a: '    if (false && !permettreVide && !amend && e.operation !== "merge"' },
  { nom: "commit : commiter malgre un conflit non resolu",
    de: '    if (enConflit(depot)) {\n      var restants = cheminsEnConflit(depot);',
    a: '    if (false) {\n      var restants = cheminsEnConflit(depot);' },
  { nom: "commit --amend : ne pas reprendre l'auteur d'origine",
    de: 'auteur = { identite: commitCourant.identite, instant: commitCourant.instant, fuseau: commitCourant.fuseau };',
    a: 'auteur = null;' },
  { nom: "commit --amend : annoncer un commit racine",
    de: 'var marque = (!parents.length && !amend) ? " (root-commit)" : "";',
    a: 'var marque = !parents.length ? " (root-commit)" : "";' },
  { nom: "commit : afficher le tableau par fichier, comme merge",
    de: 'if (parents.length < 2) sortie = sortie.concat(lignesStat(stat));',
    a: 'if (parents.length < 2) sortie = sortie.concat(lignesStat(stat, true));' },

  /* --- le statut ----------------------------------------------------------- */
  { nom: "status : trier les non-suivis avec les autres",
    de: 'tous = tous.concat(nonSuivis.slice().sort(GM.comparerChemins));',
    a: 'tous = tous.concat(nonSuivis); tous.sort(GM.comparerChemins);' },
  { nom: "status : conseiller add/rm meme sans suppression",
    a: '\'  (use "git add/rm <file>..." to update what will be committed)\',',
    de: '\'  (use "git add\' + (avecSuppression ? "/rm" : "") + \' <file>..." to update what will be committed)\',' },
  { nom: "status : ne pas replier un dossier entierement non suivi",
    de: 'if (repliable(candidat)) { garde = candidat + "/"; break; }',
    a: '' },
  { nom: "status : ne pas citer les chemins accentues",
    de: '    if (!besoin) return chemin;',
    a: '    return chemin;' },
  { nom: "status : oublier le bloc du cherry-pick en cours",
    de: '} else if (e.operation === "cherry-pick" || e.operation === "revert") {',
    a: '} else if (false) {' },
  { nom: "status : la conclusion l'emporte sur les changements indexes",
    de: 'if (indexes.length) conclusion = null;   /* quelque chose est prêt : git ne conclut rien */',
    a: 'if (false) conclusion = null;' },

  /* --- les references et le repertoire de travail --------------------------- */
  { nom: "branch -d : supprimer une branche non fusionnee sans rien dire",
    de: 'if (!forcer && !depot.estAncetre(oid, depot.oidHEAD())) {',
    a: 'if (false) {' },
  { nom: "branch : ne pas connaitre -m (renommer)",
    de: 'var renommer = drapeau(r, "-m", "--move", "-M");',
    a: 'var renommer = false;' },
  { nom: "branch -m : ecraser une branche existante",
    de: 'if (depot.oidDeRef("refs/heads/" + neuf) && !drapeau(r, "-M")) {',
    a: 'if (false) {' },
  { nom: "checkout : ecraser les modifications locales sans prevenir",
    de: 'var bascule = basculer(depot, oid, { force: force });',
    a: 'var bascule = basculer(depot, oid, { force: true });' },
  { nom: "checkout : oublier « Already on »",
    de: 'var dejaLa = !depot.detachee() && depot.brancheCourante() === cible;',
    a: 'var dejaLa = false;' },
  { nom: "checkout : oublier le nom retenu de la tete detachee",
    de: 'depot.detacheDepuis = { nom: nomRetenu, oid: oid };',
    a: 'depot.detacheDepuis = { nom: abrev(oid), oid: oid };' },
  { nom: "checkout -b : ne pas basculer le repertoire de travail",
    de: '      if (cibleC && cibleC !== depot.oidHEAD()) {\n        var bascC = basculer(depot, cibleC, {});',
    a: '      if (false) {\n        var bascC = basculer(depot, cibleC, {});' },
  { nom: "reset <chemin> : desindexer tout au lieu du seul chemin vise",
    de: '      var vises = etendreChemins(depot, cheminsVises, tete);',
    a: '      var vises = depot.cheminsIndex();' },
  { nom: "rm : supprimer un fichier modifie sans prevenir",
    de: '      if (modifies.length) {',
    a: '      if (false) {' },
  { nom: "merge : ecraser un travail non commite",
    de: '    if (gene.ecrases.length) {',
    a: '    if (false) {' },
  { nom: "merge : fusionner deux histoires sans ancetre commun",
    de: '    if (!base && !permettreEtranger) {',
    a: '    if (false) {' },
  { nom: "options : accepter une option inconnue au lieu de refuser",
    de: '        r.inconnue = cle.slice(2);\n        return r;',
    a: '        continue;' },
  { nom: "options : ne pas comprendre --message=valeur",
    de: '          poserValeur(r, cle, eg >= 0 ? a.slice(eg + 1) : (args[++i] != null ? String(args[i]) : ""));',
    a: '          poserValeur(r, cle, (args[++i] != null ? String(args[i]) : ""));' },
  { nom: "options : ne garder qu'un seul -m",
    de: '    if (!possede(r.valeurs, cle)) r.valeurs[cle] = [];\n    r.valeurs[cle].push(valeur);',
    a: '    if (!possede(r.valeurs, cle)) r.valeurs[cle] = [valeur];' },
  { nom: "reset --mixed : remettre aussi le repertoire de travail",
    de: '      if (mode === "hard") { basculer(depot, oid, { force: true }); }',
    a: '      basculer(depot, oid, { force: true });' },
  { nom: "reset : ne pas annoncer les changements desindexes",
    de: '    out.push("Unstaged changes after reset:");',
    a: '    return [];\n    out.push("Unstaged changes after reset:");' },

  /* --- fusionner, rejouer -------------------------------------------------- */
  { nom: "merge : avancer quand meme avec --no-ff",
    de: 'if (depot.estAncetre(tete, autre) && !sansAvance) {',
    a: 'if (depot.estAncetre(tete, autre)) {' },
  { nom: "merge : message sans « into » hors branche principale",
    de: '      : (brancheCourante !== depot.branchePrincipale ? " into " + brancheCourante : "");',
    a: '      : "";' },
  { nom: "merge : appeler « branch » ce qui est une etiquette",
    de: 'var genre = depot.oidDeRef("refs/heads/" + nom) ? "branch"',
    a: 'var genre = true ? "branch"' },
  { nom: "merge : annoncer une strategie qui n'existe pas",
    de: '"Merge made by the \'ort\' strategy."',
    a: '"Merge made by the \'recursive\' strategy."' },
  { nom: "rebase : rejouer du plus recent au plus ancien",
    de: '    aRejouer = ordreTopologique(depot, aRejouer);',
    a: '    aRejouer = ordreTopologique(depot, aRejouer).reverse();' },
  { nom: "merge : accepter un index sale avant de fusionner",
    de: '    if (statIdx.indexes.length) {',
    a: '    if (false) {' },
  { nom: "status : oublier le bloc du rebasage en cours",
    de: '    } else if (e.operation === "rebase") {',
    a: '    } else if (false) {' },
  { nom: "rebase : ecrire dans l'etat fige au lieu de l'etat courant",
    de: '      var e = etat(depot);\n      if (a.conflits.length) {',
    a: '      var e = depot.etatGit;\n      depot.etatGit = { operation: null, conflits: dico(), message: "", tete: null, labelLeur: null, auteur: null, rebase: null, conflitsInitiaux: [] };\n      if (a.conflits.length) {' },
  { nom: "rebase : ne pas replacer la branche a la fin",
    de: '      depot.majRef("refs/heads/" + contexte.branche, fin);',
    a: '' },
  { nom: "cherry-pick : perdre l'auteur d'origine",
    de: '      if (!options.inverse) e.auteur = { identite: c.identite, instant: c.instant, fuseau: c.fuseau };\n      var rc = C.commit',
    a: '      var rc = C.commit' },
  { nom: "cherry-pick : n'appliquer que le premier commit d'une liste",
    de: '    while (restants.length) {\n      var oid = restants.shift();\n      var c = depot.lireCommit(oid);\n      if (c.parents.length > 1 && !options.mainline) {',
    a: '    while (restants.length) {\n      var oid = restants.shift();\n      restants.length = 0;\n      var c = depot.lireCommit(oid);\n      if (c.parents.length > 1 && !options.mainline) {' },
  { nom: "cherry-pick : accepter une fusion sans -m",
    de: '      if (c.parents.length > 1 && !options.mainline) {',
    a: '      if (false) {' },
  { nom: "revert : ne pas inverser la base et la cible",
    de: '    var base = options.inverse ? oidCommit : parent;\n    var leur = options.inverse ? parent : oidCommit;',
    a: '    var base = parent;\n    var leur = oidCommit;' },
  { nom: "revert : ecrire « Revert \"Revert …\" » au lieu de « Reapply »",
    de: "    var titre = /^Revert \"(.*)\"$/.test(c.titre)",
    a: "    var titre = false" },
  { nom: "revert : annuler le mauvais parent d'une fusion",
    de: '    var parent = c.parents.length ? c.parents[rang - 1] : null;',
    a: '    var parent = c.parents.length ? c.parents[0] : null;' },
  { nom: "revert : oublier la ligne « This reverts commit »",
    de: "    return titre + '\\n\\nThis reverts commit ' + oid + \".\";",
    a: "    return titre;" },

  /* --- la ligne de commande ------------------------------------------------ */
  { nom: "decouperLigne : ignorer les guillemets",
    de: '      if (ch === \'"\' && !dansSimple) { dansDouble = !dansDouble; entame = true; continue; }',
    a: '' },
  { nom: "commit -a : ne rien enregistrer du tout",
    de: 'for (var s = 0; s < suivis.length; s++) depot.indexer(suivis[s]);',
    a: '' },
  { nom: "status : oublier de citer un chemin a espace en porcelaine",
    de: '    var plancher = tolererEspace ? 0x20 : 0x21;',
    a: '    var plancher = 0x20;' },
  { nom: "commit : oublier la ligne Date d'un auteur repris",
    de: '    if (amend || options.dateInteressante) {',
    a: '    if (false) {' }
];

var dossier = fs.mkdtempSync(path.join(os.tmpdir(), "syntaxe-mutc-"));
fs.copyFileSync(MODELE, path.join(dossier, "git-modele.js"));
var detectees = 0, ratees = [];

console.log("Contre-epreuve de verif-git-commandes.js : " + MUTATIONS.length + " fautes injectees.\n");

MUTATIONS.forEach(function (m, i) {
  if (original.indexOf(m.de) === -1) {
    ratees.push({ nom: m.nom, pourquoi: "motif introuvable (mutation caduque : le code a change)" });
    console.log("  " + (i + 1) + ". " + m.nom + " → MOTIF INTROUVABLE");
    return;
  }
  var mute = original.replace(m.de, m.a);
  var chemin = path.join(dossier, "git-commandes-" + (i + 1) + ".js");
  fs.writeFileSync(chemin, mute, "utf8");
  var res = cp.spawnSync(process.execPath, [OUTIL, "--commandes=" + chemin, "--vite"], { encoding: "utf8" });
  var sortie = (res.stdout || "") + (res.stderr || "");
  var vu = res.status !== 0;
  if (vu) detectees++;
  else ratees.push({ nom: m.nom, pourquoi: "le verificateur reste vert" });
  var nb = /(\d+) ECART/.exec(sortie);
  console.log("  " + (i + 1) + ". " + m.nom + " → " + (vu ? "DETECTEE" : "*** NON DETECTEE ***")
    + (nb ? " (" + nb[1] + " ecart(s))" : vu ? " (le bac a sable leve une erreur)" : ""));
});

console.log("\n  " + detectees + "/" + MUTATIONS.length + " mutations detectees.");
if (ratees.length) {
  ratees.forEach(function (r) { console.log("  TROU · " + r.nom + " : " + r.pourquoi); });
}
try { fs.rmSync(dossier, { recursive: true, force: true, maxRetries: 3 }); } catch (e) { /* rien */ }
process.exit(ratees.length ? 1 : 0);
