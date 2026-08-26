/* =============================================================================
   git-bac.js — L'INTERFACE du bac à sable Git (chantier V14, point D3).
   Colle ensemble le modèle (`git-modele.js`), les quinze commandes
   (`git-commandes.js`) et le graphe (`git-graphe.js`). Script classique, aucune
   dépendance, aucun réseau : la page tourne en `file://`.

   CE QUE LA PAGE MONTRE, ET POURQUOI
   Un terminal seul n'apprend rien : git répond « Fast-forward » et l'apprenant
   ne sait toujours pas ce qui a bougé. Ici, chaque commande met à jour QUATRE
   choses à la fois, côte à côte :
     · le terminal — la sortie EXACTE de git, en anglais, celle qu'il verra
       dans sa vraie console ;
     · l'explication en français, que la couche des commandes fournit ;
     · les trois zones (répertoire de travail, index, dernier commit), parce que
       la moitié des incompréhensions de git tient à leur confusion ;
     · le graphe, où l'on VOIT le commit apparaître, la branche avancer, HEAD
       se déplacer.

   Les commandes qui ne sont pas git (`echo`, `rm`, `cat`, `ls`) sont là parce
   qu'il faut bien produire des fichiers à commiter. Elles sont volontairement
   minces : ce n'est pas un émulateur de shell.
   ============================================================================= */
(function () {
  "use strict";

  var GM = window.GitModele, GC = window.GitCommandes, GG = window.GitGraphe;
  if (!GM || !GC || !GG) return;

  var CLE = "syntaxe-git-bac";
  var IDENTITE = "Apprenant <apprenant@syntaxe.invalid>";
  /* Une horloge déterministe, qui avance d'une minute par commit : deux
     apprenants qui tapent la même chose obtiennent les mêmes empreintes, et
     l'ordre du graphe ne dépend pas de la vitesse de frappe. */
  var INSTANT_ZERO = 1704067200;

  var depot = null;
  var historique = [];
  var rangHistorique = -1;
  var montrerOrphelins = false;
  var selection = null;

  var $ = function (id) { return document.getElementById(id); };
  var terminal, saisie, svgHote, zones, expli, titreEtat;

  /* --- le dépôt --------------------------------------------------------------- */

  function neuf() {
    return new GM.Depot({ identite: IDENTITE, branche: "main", instant: INSTANT_ZERO, pasHorloge: 60, fuseau: "+0100" });
  }

  function sauver() {
    try {
      localStorage.setItem(CLE, JSON.stringify({ depot: GC.exporter(depot), historique: historique.slice(-60) }));
    } catch (e) { /* stockage plein ou refusé : le bac à sable marche quand même */ }
  }

  function charger() {
    var brut = null;
    try { brut = localStorage.getItem(CLE); } catch (e) { brut = null; }
    if (!brut) return false;
    try {
      var d = JSON.parse(brut);
      depot = GC.importer(d.depot);
      historique = Array.isArray(d.historique) ? d.historique : [];
      return true;
    } catch (e) {
      return false;
    }
  }

  /* --- le terminal ------------------------------------------------------------ */

  function ecrire(texte, classe) {
    var ligne = document.createElement("div");
    ligne.className = "bac-ligne" + (classe ? " bac-ligne--" + classe : "");
    ligne.textContent = texte;
    terminal.appendChild(ligne);
    terminal.scrollTop = terminal.scrollHeight;
  }

  function ecrireLignes(lignes, classe) {
    for (var i = 0; i < lignes.length; i++) ecrire(lignes[i], classe);
  }

  /* --- les commandes qui ne sont pas git -------------------------------------- */

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

  function commandeLocale(mots, brut) {
    var nom = mots[0];

    if (nom === "aide" || nom === "help" || nom === "?") {
      ecrireLignes(AIDE, "note");
      return true;
    }

    if (nom === "reinitialiser") {
      depot = neuf();
      ecrire("Dépôt remis à neuf : plus aucun commit, plus aucun fichier.", "note");
      return true;
    }

    if (nom === "ls") {
      var f = depot.cheminsTravail();
      if (!f.length) ecrire("(le répertoire de travail est vide)", "note");
      else ecrireLignes(f);
      return true;
    }

    if (nom === "cat") {
      if (!mots[1]) { ecrire("cat : indique un fichier.", "erreur"); return true; }
      var contenu = depot.lireFichier(mots[1]);
      if (contenu === null || contenu === undefined) { ecrire("cat: " + mots[1] + ": No such file or directory", "erreur"); return true; }
      ecrireLignes(contenu.replace(/\n$/, "").split("\n"));
      return true;
    }

    if (nom === "rm" && mots.length >= 2) {
      /* `rm` tout court efface le fichier du disque ; `git rm` est autre chose,
         et c'est justement la distinction à faire sentir. */
      var efface = 0;
      for (var i = 1; i < mots.length; i++) {
        if (depot.lireFichier(mots[i]) !== null) { depot.supprimerFichier(mots[i]); efface++; }
        else ecrire("rm: cannot remove '" + mots[i] + "': No such file or directory", "erreur");
      }
      if (efface) ecrire(efface + " fichier(s) effacé(s) du répertoire de travail — l'index, lui, n'a pas bougé.", "note");
      return true;
    }

    if (nom === "echo") {
      /* `echo "texte" > fichier` : on relit la ligne BRUTE pour retrouver le
         chevron, que le découpage en mots a déjà avalé. */
      var m = /^echo\s+([\s\S]*?)\s*(>>?)\s*(\S+)\s*$/.exec(brut);
      if (!m) {
        ecrire(mots.slice(1).join(" "));
        return true;
      }
      var texte = GC.decouperLigne(m[1]).join(" ");
      var cible = GC.decouperLigne(m[3])[0];
      var avant = m[2] === ">>" ? (depot.lireFichier(cible) || "") : "";
      depot.ecrireFichier(cible, avant + texte + "\n");
      ecrire((m[2] === ">>" ? "Ligne ajoutée à " : "Fichier écrit : ") + cible, "note");
      return true;
    }

    return false;
  }

  /* --- exécuter une ligne ----------------------------------------------------- */

  function executer(brut) {
    var ligne = brut.trim();
    if (!ligne) return;
    ecrire("$ " + ligne, "invite");
    historique.push(ligne);
    rangHistorique = historique.length;

    var mots = GC.decouperLigne(ligne);
    var explication = "";

    if (commandeLocale(mots, ligne)) {
      explication = "";
    } else if (mots[0] !== "git") {
      ecrire(mots[0] + " : commande inconnue. Tape « aide » pour la liste.", "erreur");
    } else {
      var r;
      try {
        r = GC.executer(depot, mots);
      } catch (err) {
        ecrire("Le bac à sable a buté sur cette commande : " + (err && err.message ? err.message : err), "erreur");
        r = null;
      }
      if (r) {
        ecrireLignes(r.sortie, r.ok ? null : "erreur");
        explication = r.explication || "";
      }
    }

    afficher(explication);
    sauver();
  }

  /* --- l'affichage ------------------------------------------------------------ */

  function pastilleZone(titre, elements, vide) {
    var bloc = document.createElement("div");
    bloc.className = "bac-zone";
    var h = document.createElement("h3");
    h.className = "bac-zone__titre";
    h.textContent = titre;
    bloc.appendChild(h);
    var ul = document.createElement("ul");
    ul.className = "bac-zone__liste";
    if (!elements.length) {
      var li = document.createElement("li");
      li.className = "bac-zone__vide";
      li.textContent = vide;
      ul.appendChild(li);
    }
    for (var i = 0; i < elements.length; i++) {
      var e = document.createElement("li");
      e.className = "bac-fichier" + (elements[i].etat ? " bac-fichier--" + elements[i].etat : "");
      var nom = document.createElement("span");
      nom.className = "bac-fichier__nom";
      nom.textContent = elements[i].chemin;
      e.appendChild(nom);
      if (elements[i].mention) {
        var m = document.createElement("span");
        m.className = "bac-fichier__mention";
        m.textContent = elements[i].mention;
        e.appendChild(m);
      }
      ul.appendChild(e);
    }
    bloc.appendChild(ul);
    return bloc;
  }

  function afficherZones() {
    var st = depot.statut();
    var travail = [], i;
    var chemins = depot.cheminsTravail();
    for (i = 0; i < chemins.length; i++) {
      var c = chemins[i];
      var etat = "", mention = "";
      if (st.nonSuivis.indexOf(c) >= 0) { etat = "nouveau"; mention = "non suivi"; }
      else if (st.modifies.indexOf(c) >= 0) { etat = "modifie"; mention = "modifié"; }
      travail.push({ chemin: c, etat: etat, mention: mention });
    }

    var index = [];
    for (i = 0; i < st.indexes.length; i++) {
      index.push({ chemin: st.indexes[i].chemin, etat: "indexe", mention: st.indexes[i].etat });
    }
    var cheminsIndex = depot.cheminsIndex();
    for (i = 0; i < cheminsIndex.length; i++) {
      var deja = false;
      for (var j = 0; j < index.length; j++) if (index[j].chemin === cheminsIndex[i]) deja = true;
      if (!deja) index.push({ chemin: cheminsIndex[i], etat: "", mention: "identique au commit" });
    }
    for (i = 0; i < st.supprimes.length; i++) {
      index.push({ chemin: st.supprimes[i], etat: "supprime", mention: "effacé du disque" });
    }

    var commit = [], tete = depot.oidHEAD();
    if (tete) {
      var entrees = depot.listerArbre(depot.lireCommit(tete).arbre);
      for (i = 0; i < entrees.length; i++) commit.push({ chemin: entrees[i].chemin, etat: "", mention: "" });
    }

    zones.innerHTML = "";
    zones.appendChild(pastilleZone("Répertoire de travail", travail, "aucun fichier"));
    zones.appendChild(pastilleZone("Index (la zone d'attente)", index, "rien d'indexé"));
    zones.appendChild(pastilleZone("Dernier commit (HEAD)", commit, "aucun commit"));
  }

  function afficherGraphe() {
    svgHote.innerHTML = "";
    var d = GG.disposer(depot, { orphelins: montrerOrphelins });
    if (!d.noeuds.length) {
      var vide = document.createElement("p");
      vide.className = "bac-graphe__vide";
      vide.textContent = "Aucun commit pour l'instant. Essaie : echo \"bonjour\" > notes.txt puis git add notes.txt puis git commit -m \"premier commit\".";
      svgHote.appendChild(vide);
      return;
    }
    var svg = GG.svgDom(depot, document, { orphelins: montrerOrphelins, selection: selection });
    svgHote.appendChild(svg);

    var groupes = svg.querySelectorAll("[data-oid]");
    for (var i = 0; i < groupes.length; i++) {
      groupes[i].addEventListener("click", surCommit);
      groupes[i].addEventListener("keydown", function (ev) {
        if (ev.key === "Enter" || ev.key === " ") { ev.preventDefault(); surCommit.call(this, ev); }
      });
    }
  }

  function surCommit(ev) {
    var oid = this.getAttribute("data-oid");
    selection = selection === oid ? null : oid;
    var c = depot.lireCommit(oid);
    ecrire("$ git show --stat " + GC.abrev(oid) + "   (clic sur le graphe)", "invite");
    ecrire("commit " + oid);
    ecrire("Author: " + c.identite);
    ecrire("    " + c.titre);
    if (c.parents.length > 1) ecrire("Merge: " + c.parents.map(GC.abrev).join(" "), "note");
    afficher("");
    if (ev) ev.preventDefault();
  }

  function afficherEtat() {
    var e = GC.etat(depot);
    var morceaux = [];
    if (depot.detachee()) morceaux.push("HEAD détaché sur " + GC.abrev(depot.oidHEAD()));
    else morceaux.push("branche " + depot.brancheCourante());
    if (e.operation) morceaux.push(e.operation + " en cours");
    if (GC.enConflit(depot)) morceaux.push(GC.cheminsEnConflit(depot).length + " fichier(s) en conflit");
    titreEtat.textContent = morceaux.join(" · ");
    titreEtat.className = "bac-etat" + (GC.enConflit(depot) ? " bac-etat--conflit" : "");
  }

  function afficher(explication) {
    afficherEtat();
    afficherZones();
    afficherGraphe();
    if (explication) {
      expli.textContent = explication;
      expli.hidden = false;
    } else {
      expli.hidden = true;
    }
  }

  /* --- les scénarios de démarrage --------------------------------------------- */

  var DEMARRAGES = {
    vide: [],
    branche: [
      'echo "Un projet qui démarre." > README.md',
      "git add README.md",
      'git commit -m "premier commit"',
      "git checkout -b fonctionnalite",
      'echo "console.log(\'salut\');" > app.js',
      "git add app.js",
      'git commit -m "ajoute app.js"',
      "git checkout main",
      'echo "Une ligne de plus." >> README.md',
      "git add README.md",
      'git commit -m "complète le README"'
    ]
  };

  function jouerDemarrage(nom) {
    depot = neuf();
    historique = [];
    terminal.innerHTML = "";
    var lignes = DEMARRAGES[nom] || [];
    for (var i = 0; i < lignes.length; i++) executer(lignes[i]);
    if (!lignes.length) {
      ecrire("Bac à sable prêt. Tape « aide » pour la liste des commandes.", "note");
      afficher("");
      sauver();
    }
  }

  /* --- démarrage --------------------------------------------------------------- */

  function init() {
    terminal = $("bac-terminal");
    saisie = $("bac-saisie");
    svgHote = $("bac-graphe");
    zones = $("bac-zones");
    expli = $("bac-explication");
    titreEtat = $("bac-etat");
    if (!terminal || !saisie || !svgHote || !zones) return;

    if (!charger()) depot = neuf();

    var formulaire = $("bac-formulaire");
    formulaire.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var valeur = saisie.value;
      saisie.value = "";
      executer(valeur);
    });

    saisie.addEventListener("keydown", function (ev) {
      if (ev.key === "ArrowUp") {
        if (!historique.length) return;
        rangHistorique = Math.max(0, (rangHistorique < 0 ? historique.length : rangHistorique) - 1);
        saisie.value = historique[rangHistorique];
        ev.preventDefault();
      } else if (ev.key === "ArrowDown") {
        if (!historique.length) return;
        rangHistorique = Math.min(historique.length, rangHistorique + 1);
        saisie.value = rangHistorique >= historique.length ? "" : historique[rangHistorique];
        ev.preventDefault();
      }
    });

    var boutons = document.querySelectorAll("[data-bac-commande]");
    for (var i = 0; i < boutons.length; i++) {
      boutons[i].addEventListener("click", function () {
        saisie.value = this.getAttribute("data-bac-commande");
        saisie.focus();
      });
    }

    var raz = $("bac-raz");
    if (raz) raz.addEventListener("click", function () { jouerDemarrage("vide"); });
    var exemple = $("bac-exemple");
    if (exemple) exemple.addEventListener("click", function () { jouerDemarrage("branche"); });

    var perdus = $("bac-orphelins");
    if (perdus) {
      perdus.addEventListener("change", function () {
        montrerOrphelins = this.checked;
        afficher("");
      });
    }

    ecrire("Bac à sable Git — les commandes sont exécutées pour de bon, sur un dépôt qui vit dans ton navigateur.", "note");
    ecrire("Tape « aide » pour la liste des commandes.", "note");
    afficher("");
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
