/* =============================================================================
   git-coquille.js — les commandes du bac à sable Git QUI NE SONT PAS GIT
   (chantier V14, point D4). Script classique, aucune dépendance, aucun réseau :
   le fichier tourne en `file://` dans le navigateur comme dans Node.

   POURQUOI CE FICHIER EXISTE
   `echo`, `cat`, `ls` et `rm` étaient écrits DANS l'interface (`js/git-bac.js`).
   Tant que seul un humain tapait ces lignes, cela suffisait. Les scénarios
   guidés (D4) changent la donne : leur mise en place est une suite de lignes de
   terminal, jouée dans la page ET rejouée par `tools/verif-git-scenarios.js`
   contre un vrai dépôt git. Si le contrôle réimplémentait `echo`, il
   vérifierait sa propre copie, pas ce que l'apprenant exécute — exactement le
   « deux expressions de la même chose » qui a rogné les titres du graphe en D3.
   Il n'y a donc qu'UNE implémentation, ici, et les deux la chargent.

   CE N'EST PAS UN ÉMULATEUR DE SHELL, et ça ne cherche pas à l'être : quatre
   commandes, juste de quoi fabriquer des fichiers à commiter. Tout le reste est
   refusé, ce qui vaut mieux que d'exécuter une approximation.

   L'API rend des données, pas de l'affichage :
       executer(depot, ligne) → null si ce n'est pas une commande de coquille,
                                sinon { lignes: [{texte, classe}], reinit }
   `classe` vaut "note", "erreur" ou "" (sortie brute), et `reinit` demande à
   l'appelant de repartir d'un dépôt neuf — la coquille ne fabrique pas de dépôt,
   elle n'en connaît pas les réglages.
   ============================================================================= */
(function (racine) {
  "use strict";

  var GC = (typeof module !== "undefined" && module.exports)
    ? require("./git-commandes.js")
    : (racine && racine.GitCommandes);

  var AIDE = [
    "Commandes du bac à sable (elles ne sont pas git, elles servent à fabriquer des fichiers) :",
    "  echo \"texte\" > fichier    écrit un fichier (>> ajoute une ligne)",
    "  cat fichier                 affiche un fichier",
    "  ls                          liste les fichiers du répertoire de travail",
    "  rm fichier                  efface un fichier du répertoire de travail",
    "  reinitialiser               repart d'un dépôt vide",
    "  aide                        affiche ceci",
    "",
    "Les quinze commandes git simulées : add, rm, commit, status, log, branch, tag,",
    "checkout, switch, reset, merge, rebase, revert, cherry-pick, diff."
  ];

  /* Les noms que cette couche prend en charge. Sert à l'interface (pour savoir
     qui traite quoi) et au contrôle (pour trier les lignes d'un scénario). */
  var NOMS = ["aide", "help", "?", "reinitialiser", "ls", "cat", "rm", "echo"];

  function estCoquille(ligne) {
    var mots = GC.decouperLigne(String(ligne).trim());
    if (!mots.length) return false;
    for (var i = 0; i < NOMS.length; i++) if (mots[0] === NOMS[i]) return true;
    return false;
  }

  function note(texte) { return { texte: texte, classe: "note" }; }
  function erreur(texte) { return { texte: texte, classe: "erreur" }; }
  function brut(texte) { return { texte: texte, classe: "" }; }

  function executer(depot, ligne) {
    var propre = String(ligne).trim();
    var mots = GC.decouperLigne(propre);
    if (!mots.length) return null;
    var nom = mots[0], i;

    if (nom === "aide" || nom === "help" || nom === "?") {
      return { lignes: AIDE.map(note), reinit: false };
    }

    if (nom === "reinitialiser") {
      return { lignes: [note("Dépôt remis à neuf : plus aucun commit, plus aucun fichier.")], reinit: true };
    }

    if (nom === "ls") {
      var f = depot.cheminsTravail();
      if (!f.length) return { lignes: [note("(le répertoire de travail est vide)")], reinit: false };
      return { lignes: f.map(brut), reinit: false };
    }

    if (nom === "cat") {
      if (!mots[1]) return { lignes: [erreur("cat : indique un fichier.")], reinit: false };
      var contenu = depot.lireFichier(mots[1]);
      if (contenu === null || contenu === undefined) {
        return { lignes: [erreur("cat: " + mots[1] + ": No such file or directory")], reinit: false };
      }
      return { lignes: contenu.replace(/\n$/, "").split("\n").map(brut), reinit: false };
    }

    if (nom === "rm") {
      /* `rm` tout court efface le fichier du disque ; `git rm` est autre chose,
         et c'est justement la distinction à faire sentir. */
      if (mots.length < 2) return { lignes: [erreur("rm : indique un fichier.")], reinit: false };
      var sortie = [], efface = 0;
      for (i = 1; i < mots.length; i++) {
        if (depot.lireFichier(mots[i]) !== null) { depot.supprimerFichier(mots[i]); efface++; }
        else sortie.push(erreur("rm: cannot remove '" + mots[i] + "': No such file or directory"));
      }
      if (efface) sortie.push(note(efface + " fichier(s) effacé(s) du répertoire de travail — l'index, lui, n'a pas bougé."));
      return { lignes: sortie, reinit: false };
    }

    if (nom === "echo") {
      /* `echo "texte" > fichier` : on relit la ligne BRUTE pour retrouver le
         chevron, que le découpage en mots a déjà avalé.
         ⚠️ La cible ne peut PAS commencer par un chevron. Sans cette garde,
         `echo "a" >> ` (sans cible) faisait capter le premier `>` comme
         redirection et le SECOND comme nom de fichier : le bac à sable créait,
         puis indexait, puis commitait un fichier nommé « > ».
         Elle peut en revanche être CITÉE, donc contenir une espace. */
      var m = /^echo\s+([\s\S]*?)\s*(>>?)\s*("[^"]+"|'[^']+'|[^>\s]\S*)\s*$/.exec(propre);
      if (!m) return { lignes: [brut(mots.slice(1).join(" "))], reinit: false };
      var texte = GC.decouperLigne(m[1]).join(" ");
      var cible = GC.decouperLigne(m[3])[0];
      var avant = m[2] === ">>" ? (depot.lireFichier(cible) || "") : "";
      depot.ecrireFichier(cible, avant + texte + "\n");
      return { lignes: [note((m[2] === ">>" ? "Ligne ajoutée à " : "Fichier écrit : ") + cible)], reinit: false };
    }

    return null;
  }

  var GitCoquille = { executer: executer, estCoquille: estCoquille, NOMS: NOMS, AIDE: AIDE };

  if (typeof module !== "undefined" && module.exports) module.exports = GitCoquille;
  if (racine) racine.GitCoquille = GitCoquille;
})(typeof window !== "undefined" ? window : null);
