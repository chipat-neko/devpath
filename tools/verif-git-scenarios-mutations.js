/* =============================================================================
   verif-git-scenarios-mutations.js — la contre-epreuve de
   tools/verif-git-scenarios.js (chantier V14, point D4).

   2 417 comparaisons vertes ne prouvent rien tant qu'on n'a pas montre que le
   ROUGE est atteignable. On abime donc UNE chose a la fois dans une COPIE de
   js/git-scenarios.js — un objectif, une mise en place, une solution, un piege,
   un lien vers une lecon — et on exige que le verificateur s'en apercoive.

   Les mutations sont choisies pour ressembler a de VRAIES fautes d'ecriture :
   une negation oubliee dans un predicat, une commande manquante dans la mise en
   place, une solution qui atteint presque le but, un piege qui reussit. Une
   mutation qui n'abime rien rend un faux trou : c'est alors la mutation qu'il
   faut remplacer, pas le controle qu'il faut elargir (leçon payee trois fois
   en D2).

   ⚠️ CE QUE CETTE CONTRE-EPREUVE NE PEUT PAS PROUVER : qu'aucun cas de test ne
   MANQUE. Retirer une triche du fichier laisse l'outil vert — c'est structurel,
   un controle ne se plaint jamais de ce qu'on ne lui donne pas a mesurer. Les
   triches sont donc, elles aussi, un contenu a relire.

   Usage : node tools/verif-git-scenarios-mutations.js
   Code de sortie : 0 si TOUTES les fautes injectees sont vues, 1 sinon.
   ============================================================================= */
"use strict";

var cp = require("child_process");
var fs = require("fs");
var os = require("os");
var path = require("path");

var RACINE = path.join(__dirname, "..");
var SOURCE = path.join(RACINE, "js", "git-scenarios.js");
var OUTIL = path.join(RACINE, "tools", "verif-git-scenarios.js");
var original = fs.readFileSync(SOURCE, "utf8");

var MUTATIONS = [
  /* --- les objectifs : le cœur du dispositif ------------------------------- */
  { nom: "objectif inverse : « n'est plus indexe » devient « est indexe »",
    de: 'verifier: function (d) { return !A.estIndexe(d, "notes-perso.txt"); }',
    a: 'verifier: function (d) { return A.estIndexe(d, "notes-perso.txt"); }' },
  { nom: "objectif sur le mauvais fichier (index.html au lieu de notes-perso.txt)",
    de: 'verifier: function (d) { return A.contient(A.contenuTravail(d, "notes-perso.txt"), "hunter2"); }',
    a: 'verifier: function (d) { return A.contient(A.contenuTravail(d, "index.html"), "hunter2"); }' },
  { nom: "objectif toujours vrai : « au moins un commit » au lieu de « exactement un »",
    de: '          texte: "aucun commit n\'a été ajouté : l\'historique en compte toujours un",\n          deja: true,\n          verifier: function (d) { return A.nbCommits(d, "main") === 1; }',
    a: '          texte: "aucun commit n\'a été ajouté : l\'historique en compte toujours un",\n          deja: true,\n          verifier: function (d) { return A.nbCommits(d, "main") >= 0; }' },
  { nom: "objectif de fusion : un parent suffirait",
    de: 'verifier: function (d) { return A.nbParents(d, "main") === 2; }',
    a: 'verifier: function (d) { return A.nbParents(d, "main") >= 1; }' },
  { nom: "objectif du revert : le contenu attendu devient une sous-chaine",
    de: 'verifier: function (d) { return A.contenuCommite(d, "main", "config.txt") === "nom du site : mediatheque',
    a: 'verifier: function (d) { return A.contient(A.contenuCommite(d, "main", "config.txt"), "mediatheque") || "x" === "nom du site : mediatheque' },
  { nom: "objectif des marqueurs : il devient toujours vrai",
    de: '            return !A.marqueurs(A.contenuTravail(d, "tarifs.txt"))',
    a: '            return true || !A.marqueurs(A.contenuTravail(d, "tarifs.txt"))' },
  { nom: "aide `lineaire` : ne voit plus les fusions a deux parents",
    de: "      if (depot.lireCommit(liste[i]).parents.length > 1) return false;",
    a: "      if (depot.lireCommit(liste[i]).parents.length > 2) return false;" },
  { nom: "aide `contientTitre` : reponse toujours positive",
    de: "  function contientTitre(depot, ref, titre) {\n    return titres(depot, ref).indexOf(titre) >= 0;",
    a: "  function contientTitre(depot, ref, titre) {\n    return titres(depot, ref).indexOf(titre) >= -1;" },

  /* --- la mise en place : la situation promise ----------------------------- */
  { nom: "mise en place : le `git add .` qui cree le probleme disparait",
    de: "        'echo \"mot de passe admin : hunter2\" > notes-perso.txt',\n        \"git add .\"",
    a: "        'echo \"mot de passe admin : hunter2\" > notes-perso.txt'" },
  { nom: "mise en place : la fusion qui declenche le conflit n'est pas jouee",
    de: '        "git merge promo"\n      ],',
    a: '        "git status"\n      ],' },
  { nom: "mise en place : le `reset --hard` qui perd le commit disparait",
    de: '        "git reset --hard HEAD~1"\n      ],\n      objectifs: [\n        {\n          texte: "le commit « ajoute le formulaire de contact » est de nouveau atteignable',
    a: '        "git status"\n      ],\n      objectifs: [\n        {\n          texte: "le commit « ajoute le formulaire de contact » est de nouveau atteignable' },
  { nom: "mise en place : un accent dans une ligne executee",
    de: `        'git commit -m "premiere page"',`,
    a: `        'git commit -m "première page"',` },

  /* --- les solutions publiees ---------------------------------------------- */
  { nom: "solution : desindexer tout au lieu du seul fichier vise",
    de: '      solution: ["git reset HEAD notes-perso.txt"],',
    a: '      solution: ["git reset"],' },
  { nom: "solution : un commit de plus au lieu d'un amendement",
    de: `      solution: ['git commit --amend -m "corrige le calcul de la TVA"'],`,
    a: `      solution: ['git commit --allow-empty -m "corrige le calcul de la TVA"'],` },
  { nom: "solution : reculer la branche avant d'avoir pose l'etiquette",
    de: '      solution: ["git branch paiement", "git reset --hard HEAD~1"],',
    a: '      solution: ["git reset --hard HEAD~1", "git branch paiement"],' },
  { nom: "solution : oublier d'indexer le fichier resolu avant de commiter",
    de: '        "git add tarifs.txt",\n        \'git commit -m "fusionne promo"\'',
    a: '        \'git commit -m "fusionne promo"\'' },
  { nom: "solution : fusionner au lieu de rebaser",
    de: '      solution: ["git rebase main"],',
    a: '      solution: ["git merge main"],' },
  { nom: "solution : transplanter le mauvais commit",
    de: '      solution: ["git cherry-pick refonte~1"],',
    a: '      solution: ["git cherry-pick refonte"],' },
  { nom: "solution calculee : elle vise un commit ATTEIGNABLE, pas l'orphelin",
    de: '      if (depot.typeDe(tous[i]) !== "commit" || atteignables[tous[i]]) continue;',
    a: '      if (depot.typeDe(tous[i]) !== "commit" || !atteignables[tous[i]]) continue;' },

  /* --- les variantes et les pieges ----------------------------------------- */
  { nom: "variante : un chemin annonce comme valable qui ne l'est pas",
    de: '        { nom: "sans nommer HEAD (git le sous-entend)", lignes: ["git reset notes-perso.txt"] },',
    a: '        { nom: "sans nommer HEAD (git le sous-entend)", lignes: ["git status"] },' },
  { nom: "piege : il est en fait la bonne reponse",
    de: '        { nom: "effacer le fichier du disque", lignes: ["rm notes-perso.txt"], rate: [1, 2],',
    a: '        { nom: "effacer le fichier du disque", lignes: ["git reset HEAD notes-perso.txt"], rate: [1, 2],' },
  { nom: "piege : il rate un autre objectif que celui annonce",
    de: '        { nom: "tout désindexer", lignes: ["git reset"], rate: 3,',
    a: '        { nom: "tout désindexer", lignes: ["git reset"], rate: 1,' },

  /* --- les liens vers le cours --------------------------------------------- */
  { nom: "lien : la lecon citee n'est pas celle que js/lecon.js annonce",
    de: '      lecons: ["lecon-12", "lecon-20"]',
    a: '      lecons: ["lecon-12", "lecon-21"]' },
  { nom: "lien : un titre de lecon perime",
    de: '    "lecon-12": "Rebase et historique propre",',
    a: '    "lecon-12": "Rebase et historique propres",' },
  /* --- les quatre trous que la passe adversariale a montres ---------------- */
  { nom: "solution : elle DETRUIT un fichier au passage",
    de: '      solution: ["git cherry-pick refonte~1"],',
    a: '      solution: ["rm index.html", "git add -A", "git commit -m menage", "git cherry-pick refonte~1"],' },
  { nom: "objectif affaibli : une sous-chaine au lieu du contenu exact",
    de: 'return A.contenuCommite(d, "main", "tarifs.txt") === "Abonnement : 7 euros',
    a: 'return A.contient(A.contenuCommite(d, "main", "tarifs.txt"), "7 euros") || "zzz" === "Abonnement : 7 euros' },
  { nom: "objectif affaibli : l'ancestralite remplacee par des titres",
    de: '            return A.estAncetre(d, "main", "menu")\n              && A.contenuCommite(d, "menu", "pied.html") === "footer\\n"\n              && A.contenuCommite(d, "menu", "logo.svg") === "logo\\n";',
    a: '            return A.contientTitre(d, "menu", "ajoute le pied de page") && A.contientTitre(d, "menu", "ajoute le logo");' },
  { nom: "rate incomplet : un piege casse plus que ce qu'il annonce",
    de: '        { nom: "abandonner la fusion", lignes: ["git merge --abort"], rate: [3, 4],',
    a: '        { nom: "abandonner la fusion", lignes: ["git merge --abort"], rate: 3,' },
  { nom: "nom trompeur : une variante annonce une commande qu'elle n'emploie pas",
    de: "        { nom: \"en nommant la source : le dernier commit plutôt que l'index\", lignes: [\"git checkout HEAD -- recette.txt\"] }",
    a: '        { nom: "avec git restore, la forme moderne", lignes: ["git checkout HEAD -- recette.txt"] }' },
  { nom: "forme : un scenario n'a plus que deux indices",
    de: "        \"C'est « git reset ». Elle prend le point de repère — HEAD, c'est-à-dire le dernier commit — puis le chemin du fichier.\",\n",
    a: "" }
];

var dossier = fs.mkdtempSync(path.join(os.tmpdir(), "syntaxe-muts-"));
fs.copyFileSync(path.join(RACINE, "js", "git-modele.js"), path.join(dossier, "git-modele.js"));
fs.copyFileSync(path.join(RACINE, "js", "git-commandes.js"), path.join(dossier, "git-commandes.js"));
var detectees = 0, ratees = [];

console.log("Contre-epreuve de verif-git-scenarios.js : " + MUTATIONS.length + " fautes injectees.\n");

MUTATIONS.forEach(function (m, i) {
  if (original.indexOf(m.de) === -1) {
    ratees.push({ nom: m.nom, pourquoi: "motif introuvable (mutation caduque : le code a change)" });
    console.log("  " + (i + 1) + ". " + m.nom + " → MOTIF INTROUVABLE");
    return;
  }
  /* ⚠️ Un motif present DEUX fois muterait la premiere occurrence venue : la
     mutation ne serait plus celle qu'on croit decrire. */
  if (original.split(m.de).length > 2) {
    ratees.push({ nom: m.nom, pourquoi: "motif present plusieurs fois (mutation ambigue)" });
    console.log("  " + (i + 1) + ". " + m.nom + " → MOTIF AMBIGU");
    return;
  }
  var mute = original.replace(m.de, m.a);
  var chemin = path.join(dossier, "git-scenarios-" + (i + 1) + ".js");
  fs.writeFileSync(chemin, mute, "utf8");
  var res = cp.spawnSync(process.execPath, [OUTIL, "--scenarios=" + chemin, "--vite"], { encoding: "utf8" });
  var sortie = (res.stdout || "") + (res.stderr || "");
  var vu = res.status !== 0;
  if (vu) detectees++;
  else ratees.push({ nom: m.nom, pourquoi: "le verificateur reste vert" });
  var quoi = /ROUGE \(arret au premier ecart\) : (.+)/.exec(sortie);
  console.log("  " + (i + 1) + ". " + m.nom + " → " + (vu ? "DETECTEE" : "*** NON DETECTEE ***")
    + (quoi ? "\n        " + quoi[1].trim() : ""));
});

console.log("\n  " + detectees + "/" + MUTATIONS.length + " mutations detectees.");
if (ratees.length) {
  ratees.forEach(function (r) { console.log("  TROU · " + r.nom + " : " + r.pourquoi); });
}
try { fs.rmSync(dossier, { recursive: true, force: true, maxRetries: 3 }); } catch (e) { /* rien */ }
process.exit(ratees.length ? 1 : 0);
