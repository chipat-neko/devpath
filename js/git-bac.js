/* =============================================================================
   git-bac.js — L'INTERFACE du bac à sable Git (chantier V14, points D3 et D4).
   Colle ensemble le modèle (`git-modele.js`), les quinze commandes
   (`git-commandes.js`), la coquille (`git-coquille.js`), le graphe
   (`git-graphe.js`) et les scénarios guidés (`git-scenarios.js`). Script
   classique, aucune dépendance, aucun réseau : la page tourne en `file://`.

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

   Les commandes qui ne sont pas git (`echo`, `rm`, `cat`, `ls`) vivent dans
   `js/git-coquille.js` — pas ici : les scénarios guidés (D4) montent leur
   situation avec les mêmes lignes, et `tools/verif-git-scenarios.js` les rejoue
   contre un vrai dépôt git. Une seconde implémentation quelque part et le
   contrôle vérifierait sa propre copie.

   D4 AJOUTE LES SCÉNARIOS. Un bac à sable libre n'apprend rien à qui ne sait
   pas quoi taper. Un scénario monte une situation réelle (« tu as commité sur
   la mauvaise branche »), énonce un but, et VÉRIFIE l'état du dépôt après
   chaque commande — jamais la commande tapée : il y a toujours plusieurs
   chemins, et comparer la ligne à un modèle n'apprendrait qu'à recopier.
   ============================================================================= */
(function () {
  "use strict";

  var GM = window.GitModele, GC = window.GitCommandes, GG = window.GitGraphe;
  var GQ = window.GitCoquille, GS = window.GitScenarios;
  if (!GM || !GC || !GG || !GQ || !GS) return;

  var CLE = "syntaxe-git-bac";
  var CLE_FAITS = "syntaxe-git-scenarios";
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
  /* Le commit qui a le focus, pour le lui rendre apres reconstruction du SVG,
     et l'explication de la derniere commande, pour ne pas l'effacer au clic. */
  var focusOid = null;
  var derniereExplication = "";

  var $ = function (id) { return document.getElementById(id); };
  var terminal, saisie, svgHote, zones, expli, titreEtat;

  /* --- le dépôt --------------------------------------------------------------- */

  function neuf() {
    return new GM.Depot({ identite: IDENTITE, branche: "main", instant: INSTANT_ZERO, pasHorloge: 60, fuseau: "+0100" });
  }

  /* ⚠️ Un echec d'ecriture doit se DIRE : sans cela, l'ancienne valeur reste en
     place et l'apprenant retrouve, au rechargement, un depot perime sans avoir
     jamais ete prevenu. On ne le dit qu'UNE fois, pour ne pas noyer le terminal. */
  var stockageSignale = false;
  function sauver() {
    try {
      localStorage.setItem(CLE, JSON.stringify({
        depot: GC.exporter(depot),
        historique: historique.slice(-60),
        /* Le scénario en cours fait partie de la session : sans lui, un
           rechargement laisse l'apprenant devant un dépôt bizarre sans énoncé. */
        scenario: scenario ? { id: scenario.id, indices: indicesMontres, annonce: reussiAnnonce } : null
      }));
    } catch (e) {
      if (!stockageSignale && terminal) {
        stockageSignale = true;
        ecrire("Ton navigateur refuse d'enregistrer ce dépôt (stockage plein ou bloqué) : "
          + "le bac à sable continue de marcher, mais tu ne le retrouveras pas au rechargement.", "erreur");
      }
    }
  }

  /* ⚠️ Un dépôt relu peut être VALIDE pour l'importateur et pourtant incohérent :
     une référence vers une empreinte absente, ou un magasin d'objets vidé alors
     que les références subsistent. Mesuré : 2 valeurs sur 15 laissaient la page
     à moitié morte — plus de graphe, plus de zones, et toute commande suivante
     levait une exception, sans un mot. Juger « l'import a-t-il levé ? » ne
     suffit donc pas : on EXERCE le dépôt relu (statut + graphe complet, ce que
     la page fera de toute façon la seconde d'après) avant de l'accepter. */
  /* Vrai quand la session enregistrée existait mais n'a pas pu être relue :
     l'apprenant doit savoir qu'il repart à neuf, sinon il croit avoir perdu son
     travail sans comprendre pourquoi. */
  var sessionIllisible = false;

  function charger() {
    var brut = null;
    try { brut = localStorage.getItem(CLE); } catch (e) { brut = null; }
    if (!brut) return false;
    try {
      var d = JSON.parse(brut);
      var relu = GC.importer(d.depot);
      relu.statut();
      GG.disposer(relu, { orphelins: true });
      depot = relu;
      historique = Array.isArray(d.historique) ? d.historique.filter(function (l) { return typeof l === "string"; }) : [];
      /* Un id inconnu (scénario renommé depuis) ne doit pas casser la reprise :
         on retombe simplement sur le bac à sable libre. */
      var reprise = d.scenario && GS.parId(d.scenario.id);
      scenario = reprise || null;
      indicesMontres = reprise ? (parseInt(d.scenario.indices, 10) || 0) : 0;
      reussiAnnonce = reprise ? !!d.scenario.annonce : false;
      return true;
    } catch (e) {
      depot = null;
      sessionIllisible = true;
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

  /* --- les commandes qui ne sont pas git --------------------------------------
     Elles sont dans `js/git-coquille.js`, partagée avec le contrôle. Ici, on ne
     fait que rendre ses lignes à l'écran. */

  function commandeLocale(brut) {
    var r = GQ.executer(depot, brut);
    if (!r) return false;
    for (var i = 0; i < r.lignes.length; i++) ecrire(r.lignes[i].texte, r.lignes[i].classe);
    if (r.reinit) {
      depot = neuf();
      /* ⚠️ Le dépôt repart à zéro : garder l'énoncé au-dessus annoncerait un but
         devenu inatteignable — et deux objectifs de « conflit » se cochaient
         tout seuls sur le dépôt vide (mesuré). */
      if (scenario) quitterSituation("Dépôt remis à neuf : tu es sorti de la situation guidée.");
    }
    return true;
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
    var traitee;
    try {
      traitee = commandeLocale(ligne);
    } catch (err) {
      ecrire("Le bac à sable a buté sur cette ligne : " + (err && err.message ? err.message : err), "erreur");
      traitee = true;
    }

    if (traitee) {
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

    derniereExplication = explication;
    surveillerScenario();
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
    /* ⚠️ Les chemins EN CONFLIT ne sont ni indexés ni propres : git tient trois
       versions du même fichier tant qu'on n'a pas tranché. Les afficher en vert,
       comme un fichier prêt à commiter, était un mensonge — et c'est justement
       la situation où l'apprenant a besoin qu'on ne lui mente pas. */
    var enConflit = GC.enConflit(depot) ? GC.cheminsEnConflit(depot) : [];
    var travail = [], i;
    var chemins = depot.cheminsTravail();
    for (i = 0; i < chemins.length; i++) {
      var c = chemins[i];
      var etat = "", mention = "";
      if (enConflit.indexOf(c) >= 0) { etat = "conflit"; mention = "en conflit"; }
      else if (st.nonSuivis.indexOf(c) >= 0) { etat = "nouveau"; mention = "non suivi"; }
      else if (st.modifies.indexOf(c) >= 0) { etat = "modifie"; mention = "modifié"; }
      travail.push({ chemin: c, etat: etat, mention: mention });
    }
    /* ⚠️ Un fichier effacé du DISQUE appartient au répertoire de travail, pas à
       l'index : `git status --porcelain` met son « D » en seconde colonne, et
       `git ls-files --stage` le montre toujours indexé, octet pour octet. Il
       était rangé dans l'index, où il apparaissait DEUX FOIS avec deux mentions
       contradictoires — pendant que le terminal, une ligne plus haut, écrivait
       « l'index, lui, n'a pas bougé ». */
    for (i = 0; i < st.supprimes.length; i++) {
      travail.push({ chemin: st.supprimes[i], etat: "supprime", mention: "effacé du disque" });
    }

    var index = [];
    for (i = 0; i < st.indexes.length; i++) {
      index.push({
        chemin: st.indexes[i].chemin,
        etat: enConflit.indexOf(st.indexes[i].chemin) >= 0 ? "conflit" : "indexe",
        mention: enConflit.indexOf(st.indexes[i].chemin) >= 0 ? "en conflit" : st.indexes[i].etat
      });
    }
    var cheminsIndex = depot.cheminsIndex();
    for (i = 0; i < cheminsIndex.length; i++) {
      var deja = false;
      for (var j = 0; j < index.length; j++) if (index[j].chemin === cheminsIndex[i]) deja = true;
      if (deja) continue;
      if (enConflit.indexOf(cheminsIndex[i]) >= 0) index.push({ chemin: cheminsIndex[i], etat: "conflit", mention: "en conflit" });
      else index.push({ chemin: cheminsIndex[i], etat: "", mention: "identique au commit" });
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
    /* ⚠️ Le graphe est reconstruit ENTIÈREMENT à chaque affichage : le groupe qui
       avait le focus vient d'être détruit, et le focus est retombé sur <body>.
       Conséquence mesurée : on pouvait activer un commit au clavier UNE fois,
       après quoi Espace faisait défiler la page. On le repose. */
    if (focusOid) {
      var repris = svg.querySelector('[data-oid="' + focusOid + '"]');
      if (repris && repris.focus) repris.focus();
    }
  }

  function surCommit(ev) {
    var oid = this.getAttribute("data-oid");
    selection = selection === oid ? null : oid;
    focusOid = oid;
    var c = depot.lireCommit(oid);
    /* On n'écrit PAS « git show » : la commande n'existe pas dans le bac à sable,
       et afficher une ligne d'invite que l'apprenant ne peut pas retaper lui
       enseignerait une commande imaginaire. */
    ecrire("— fiche du commit " + GC.abrev(oid) + " (clic sur le graphe)", "note");
    ecrire("commit " + oid);
    ecrire("Author: " + c.identite);
    ecrire("    " + c.titre);
    if (c.parents.length > 1) ecrire("Merge: " + c.parents.map(GC.abrev).join(" "), "note");
    /* L'explication de la DERNIÈRE commande reste affichée : la faire disparaître
       parce qu'on a cliqué un commit punissait la curiosité. */
    afficher(derniereExplication);
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
    afficherMission();
    if (explication) {
      expli.textContent = explication;
      expli.hidden = false;
    } else {
      expli.hidden = true;
    }
  }

  /* =========================================================================
     LES SCÉNARIOS GUIDÉS (D4)
     Un scénario monte sa situation en rejouant des commandes ordinaires — les
     mêmes que l'apprenant pourrait taper — puis surveille l'ÉTAT du dépôt. Rien
     n'est comparé à une commande attendue : `tools/verif-git-scenarios.js`
     prouve d'ailleurs, en les exécutant, que plusieurs chemins mènent au but.
     ========================================================================= */

  var scenario = null;          // le scénario en cours, ou null
  var messageDeSortie = "";     // ce qu'il faudra dire une fois le terminal vidé
  var indicesMontres = 0;
  var reussiAnnonce = false;
  var hoteScenarios, hoteMission;

  /* Les scénarios déjà réussis, gardés à part du dépôt : on efface son bac à
     sable bien plus souvent que sa progression.
     ⚠️ L'écriture passe par `window.SyntaxeStore` (js/theme.js) et NON par un
     `localStorage.setItem` enveloppé d'un `catch` vide : c'est précisément la
     faute que le point V12-B1 a corrigée sur 21 points d'écriture du site — en
     navigation privée stricte, l'apprenant réussissait des situations qui
     n'étaient gardées nulle part, sans un mot. Le magasin affiche un bandeau,
     et distingue le quota plein du refus. */
  function faits() {
    if (window.SyntaxeStore) {
      var v = window.SyntaxeStore.getJSON(CLE_FAITS, []);
      return Array.isArray(v) ? v : [];
    }
    try {
      var brut = JSON.parse(localStorage.getItem(CLE_FAITS) || "[]");
      return Array.isArray(brut) ? brut : [];
    } catch (e) { return []; }
  }

  function marquerFait(id) {
    var l = faits();
    if (l.indexOf(id) >= 0) return;
    l.push(id);
    if (window.SyntaxeStore) { window.SyntaxeStore.setJSON(CLE_FAITS, l); return; }
    try { localStorage.setItem(CLE_FAITS, JSON.stringify(l)); } catch (e) { /* signalé par le magasin */ }
  }

  /* Le repère du bouton qui avait le focus, pour le lui rendre après que la
     liste ou le panneau ont été reconstruits. */
  var focusBouton = null;

  function bouton(libelle, classe, action) {
    var b = document.createElement("button");
    b.type = "button";
    b.className = classe;
    b.textContent = libelle;
    b.addEventListener("click", function (ev) {
      focusBouton = this.getAttribute("data-bac-focus");
      action(ev);
    });
    return b;
  }

  /* Repose le focus sur le bouton de même rôle, s'il existe encore et si rien
     d'autre ne l'a pris entre-temps. */
  function reposerFocus() {
    if (!focusBouton) return;
    if (document.activeElement && document.activeElement !== document.body
        && document.activeElement.tagName !== "HTML") { focusBouton = null; return; }
    var cible = document.querySelector('[data-bac-focus="' + focusBouton + '"]');
    if (cible && cible.focus) cible.focus();
    focusBouton = null;
  }

  function numeroLecon(nom) {
    var m = /lecon-(\d+)/.exec(nom);
    return m ? String(parseInt(m[1], 10)) : nom;
  }

  /* --- la liste des situations ------------------------------------------------ */

  function listerScenarios() {
    if (!hoteScenarios) return;
    var accomplis = faits();
    hoteScenarios.innerHTML = "";
    for (var i = 0; i < GS.SCENARIOS.length; i++) {
      (function (sc) {
        var carte = document.createElement("article");
        carte.className = "bac-carte" + (accomplis.indexOf(sc.id) >= 0 ? " bac-carte--fait" : "");
        carte.id = "carte-" + sc.id;
        carte.setAttribute("data-scenario", sc.id);

        var haut = document.createElement("p");
        haut.className = "bac-carte__niveau";
        haut.textContent = sc.niveau + (accomplis.indexOf(sc.id) >= 0 ? " · réussi" : "");
        carte.appendChild(haut);

        var h = document.createElement("h3");
        h.className = "bac-carte__titre";
        h.textContent = sc.titre;
        carte.appendChild(h);

        var r = document.createElement("p");
        r.className = "bac-carte__resume";
        r.textContent = sc.resume;
        carte.appendChild(r);

        var enCours = scenario && scenario.id === sc.id;
        var b = bouton(enCours ? "Remonter cette situation" : "Commencer",
          "btn btn--sm" + (enCours ? " btn--ghost" : ""),
          function () { demarrerScenario(sc.id); });
        b.setAttribute("data-bac-focus", "carte-" + sc.id);
        carte.appendChild(b);
        hoteScenarios.appendChild(carte);
      })(GS.SCENARIOS[i]);
    }
    reposerFocus();
  }

  /* --- démarrer, quitter ------------------------------------------------------ */

  /* La mise en place est jouée SANS bruit : dérouler seize lignes dans le
     terminal noierait la situation qu'on vient d'énoncer. Elle reste consultable
     — le panneau la déplie — et elle entre dans l'historique de la flèche haute,
     parce qu'elle fait partie de ce qui s'est passé. */
  function executerSilencieux(ligne) {
    historique.push(ligne);
    var traitee = GQ.executer(depot, ligne);
    if (traitee) {
      if (traitee.reinit) depot = neuf();
      return true;
    }
    var mots = GC.decouperLigne(ligne);
    var r = GC.executer(depot, mots);
    if (!r) return false;
    if (r.ok) return true;
    var texte = r.sortie.join(" ");
    return !/is not a git command|unknown option|^usage:|not a git repository/i.test(texte);
  }

  function demarrerScenario(id) {
    var sc = GS.parId(id);
    if (!sc) return;
    /* ⚠️ Commencer une situation REMPLACE le dépôt en cours. Il faut le dire :
       on arrive parfois ici par un lien d'une leçon, sans l'avoir demandé, et
       voir son travail disparaître sans un mot est exactement ce que le bac à
       sable enseigne à ne pas faire. */
    var avaitQuelqueChose = depot && (depot.oidHEAD() || depot.cheminsTravail().length);
    depot = neuf();
    historique = [];
    rangHistorique = -1;
    selection = null;
    focusOid = null;
    terminal.innerHTML = "";
    scenario = sc;
    indicesMontres = 0;
    reussiAnnonce = false;

    var rate = 0;
    for (var i = 0; i < sc.mise.length; i++) if (!executerSilencieux(sc.mise[i])) rate++;
    rangHistorique = historique.length;

    ecrire("Situation « " + sc.titre + " » : le dépôt a été monté pour toi.", "note");
    if (avaitQuelqueChose) ecrire("Ton dépôt précédent a été remplacé par celui de la situation.", "note");
    if (rate) ecrire("Attention : " + rate + " commande(s) de mise en place n'ont pas abouti.", "erreur");
    ecrire("Tape « git status » pour voir où tu en es. L'encadré au-dessus dit ce qu'il faut obtenir.", "note");
    derniereExplication = "";
    afficher("");
    sauver();
    listerScenarios();
    if (hoteMission && hoteMission.scrollIntoView) hoteMission.scrollIntoView({ block: "start" });
  }

  /* Sortir d'une situation, en le DISANT : le panneau disparaît, et sans un mot
     l'apprenant ne sait pas s'il a réussi, abandonné, ou cassé quelque chose.
     Les boutons « Repartir de zéro » et « Charger un exemple » passaient par un
     autre chemin, silencieux. */
  function quitterSituation(message) {
    if (!scenario) return;
    scenario = null;
    indicesMontres = 0;
    reussiAnnonce = false;
    if (message) ecrire(message, "note");
    listerScenarios();
  }

  /* Ouvre la situation que l'ancre désigne, puis EFFACE l'ancre : sans cela,
     un rechargement la rejouerait et remonterait la situation par-dessus le
     travail en cours. Rend true si une situation a été ouverte. */
  function ouvrirDepuisAncre() {
    var vise = /^#scenario-([a-z-]+)$/.exec(location.hash || "");
    if (!vise || !GS.parId(vise[1])) return false;
    if (window.history && history.replaceState) {
      try { history.replaceState(null, "", location.pathname + location.search); } catch (e) { /* rien */ }
    }
    demarrerScenario(vise[1]);
    return true;
  }

  function quitterScenario() {
    quitterSituation("Situation quittée : le dépôt reste tel quel, tu peux continuer librement.");
    afficher("");
    sauver();
  }

  /* --- le panneau de la situation --------------------------------------------- */

  function ligneObjectif(o) {
    var li = document.createElement("li");
    li.className = "bac-objectif" + (o.atteint ? " bac-objectif--fait" : "");
    var marque = document.createElement("span");
    marque.className = "bac-objectif__marque";
    marque.setAttribute("aria-hidden", "true");
    marque.textContent = o.atteint ? "✓" : "○";
    li.appendChild(marque);
    var texte = document.createElement("span");
    texte.textContent = o.texte;
    li.appendChild(texte);
    /* La liste est relue à chaque commande : sans ce préfixe, « atteint » et
       « à faire » se lisent exactement pareil pour un lecteur d'écran. */
    li.setAttribute("aria-label", (o.atteint ? "Atteint : " : "À faire : ") + o.texte);
    return li;
  }

  function marquer(element, repere) {
    element.setAttribute("data-bac-focus", repere);
    return element;
  }

  function detailsRepliable(titre, remplir) {
    var d = document.createElement("details");
    d.className = "bac-repli";
    var sum = document.createElement("summary");
    sum.textContent = titre;
    d.appendChild(sum);
    remplir(d);
    return d;
  }

  function listeCommandes(lignes) {
    var pre = document.createElement("pre");
    pre.className = "bac-commandes";
    var code = document.createElement("code");
    code.textContent = lignes.join("\n");
    pre.appendChild(code);
    return pre;
  }

  function afficherMission() {
    if (!hoteMission) return;
    hoteMission.innerHTML = "";
    if (!scenario) {
      hoteMission.hidden = true;
      return;
    }
    hoteMission.hidden = false;

    var bilan = GS.evaluer(depot, scenario);

    var kicker = document.createElement("p");
    kicker.className = "bac-mission__kicker";
    kicker.textContent = "Situation guidée · " + scenario.niveau;
    hoteMission.appendChild(kicker);

    var h = document.createElement("h2");
    h.className = "bac-panneau__titre";
    h.textContent = scenario.titre;
    hoteMission.appendChild(h);

    var sit = document.createElement("p");
    sit.className = "bac-mission__situation";
    sit.textContent = scenario.situation;
    hoteMission.appendChild(sit);

    var but = document.createElement("p");
    but.className = "bac-mission__but";
    but.textContent = "But : " + scenario.but;
    hoteMission.appendChild(but);

    var faits = 0;
    for (var f = 0; f < bilan.objectifs.length; f++) if (bilan.objectifs[f].atteint) faits++;
    var progres = document.createElement("p");
    progres.className = "bac-mission__progres";
    progres.setAttribute("role", "status");
    progres.textContent = faits + " objectif" + (faits > 1 ? "s" : "") + " sur "
      + bilan.objectifs.length + (faits > 1 ? " atteints" : " atteint");
    hoteMission.appendChild(progres);

    var ul = document.createElement("ul");
    ul.className = "bac-objectifs";
    for (var i = 0; i < bilan.objectifs.length; i++) ul.appendChild(ligneObjectif(bilan.objectifs[i]));
    hoteMission.appendChild(ul);

    if (bilan.reussi) {
      var ok = document.createElement("div");
      ok.className = "bac-reussite";
      var t = document.createElement("p");
      t.className = "bac-reussite__titre";
      t.textContent = "C'est fait.";
      ok.appendChild(t);
      var q = document.createElement("p");
      q.textContent = scenario.apres;
      ok.appendChild(q);
      var liens = document.createElement("p");
      liens.className = "bac-reussite__liens";
      for (var l = 0; l < scenario.lecons.length; l++) {
        var a = document.createElement("a");
        a.href = "git/" + scenario.lecons[l] + ".html";
        a.textContent = "Leçon " + numeroLecon(scenario.lecons[l]) + " — " + GS.TITRES_LECONS[scenario.lecons[l]];
        liens.appendChild(a);
        if (l < scenario.lecons.length - 1) liens.appendChild(document.createTextNode(" · "));
      }
      ok.appendChild(liens);
      hoteMission.appendChild(ok);
    }

    /* Les indices se donnent UN par UN : trois d'un coup, et c'est la solution
       déguisée. */
    if (!bilan.reussi && indicesMontres > 0) {
      var ulI = document.createElement("ul");
      ulI.className = "bac-indices";
      for (var k = 0; k < indicesMontres && k < scenario.indices.length; k++) {
        var liI = document.createElement("li");
        liI.textContent = scenario.indices[k];
        ulI.appendChild(liI);
      }
      hoteMission.appendChild(ulI);
    }

    var actions = document.createElement("p");
    actions.className = "bac-actions";
    if (!bilan.reussi && indicesMontres < scenario.indices.length) {
      actions.appendChild(marquer(bouton(indicesMontres ? "Un autre indice" : "Un indice",
        "btn btn--sm btn--ghost", function () {
          indicesMontres++;
          afficherMission();
          /* Sans ceci, trois indices demandés puis un rechargement — le geste
             naturel quand on est bloqué — les perdait tous les trois. */
          sauver();
        }), "indice"));
    }
    actions.appendChild(marquer(bouton("Remonter la situation", "btn btn--sm btn--ghost",
      function () { demarrerScenario(scenario.id); }), "remonter"));
    actions.appendChild(marquer(bouton("Quitter le scénario", "btn btn--sm btn--ghost", quitterScenario), "quitter"));
    hoteMission.appendChild(actions);

    hoteMission.appendChild(detailsRepliable("Comment on en est arrivé là", function (d) {
      var pm = document.createElement("p");
      pm.className = "bac-aide";
      pm.textContent = "Ces commandes ont été jouées pour toi avant que tu n'arrives :";
      d.appendChild(pm);
      d.appendChild(listeCommandes(scenario.mise));
    }));

    reposerFocus();

    hoteMission.appendChild(detailsRepliable("Voir une solution", function (d) {
      var ps = document.createElement("p");
      ps.className = "bac-aide";
      ps.textContent = "Une solution parmi d'autres — ce qui compte est l'état obtenu, pas la commande employée :";
      d.appendChild(ps);
      d.appendChild(listeCommandes(scenario.solutionTexte
        || (typeof scenario.solution === "function" ? scenario.solution(depot) : scenario.solution)));
      if (scenario.variantes && scenario.variantes.length) {
        var pv = document.createElement("p");
        pv.className = "bac-aide";
        pv.textContent = "Autre chemin, tout aussi valable : " + scenario.variantes[0].nom + ".";
        d.appendChild(pv);
      }
    }));
  }

  /* Appelé après chaque commande : c'est là que la réussite est constatée. */
  function surveillerScenario() {
    if (!scenario) return;
    var bilan = GS.evaluer(depot, scenario);
    if (bilan.reussi && !reussiAnnonce) {
      reussiAnnonce = true;
      marquerFait(scenario.id);
      ecrire("Objectif atteint : " + scenario.but, "reussite");
      ecrire(scenario.apres, "note");
      listerScenarios();
    } else if (!bilan.reussi && reussiAnnonce) {
      /* On peut défaire ce qu'on vient de réussir : le scénario redevient
         ouvert, et il pourra être réannoncé. */
      reussiAnnonce = false;
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
    /* Repartir de zéro sort de la situation : garder l'énoncé au-dessus d'un
       dépôt qui n'est plus le sien annoncerait un but devenu inatteignable. */
    var sortie = scenario ? "Tu es sorti de la situation guidée « " + scenario.titre + " »." : "";
    quitterSituation("");
    if (sortie) messageDeSortie = sortie;
    if (messageDeSortie) { ecrire(messageDeSortie, "note"); messageDeSortie = ""; }
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
    hoteScenarios = $("bac-scenarios");
    hoteMission = $("bac-mission");
    if (!terminal || !saisie || !svgHote || !zones) return;

    var repris = charger();
    if (!depot) depot = neuf();
    listerScenarios();

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

    /* Une leçon du cours `git` renvoie ici avec `#scenario-<id>` : on ouvre
       DIRECTEMENT la situation, sinon l'apprenant atterrit sur une page qui ne
       montre pas ce qu'on lui a promis. Le dépôt en cours est remplacé — c'est
       le sens du clic, et le panneau le dit. */
    window.addEventListener("hashchange", ouvrirDepuisAncre);
    if (ouvrirDepuisAncre()) return;

    ecrire("Bac à sable Git — les commandes sont exécutées pour de bon, sur un dépôt qui vit dans ton navigateur.", "note");
    if (sessionIllisible) ecrire("Ta session précédente était illisible : on repart d'un dépôt neuf.", "erreur");
    if (!repris) ecrire("Tape « aide » pour la liste des commandes.", "note");
    else ecrire("Ton dépôt précédent a été retrouvé. Tape « aide » pour la liste des commandes, "
      + "« reinitialiser » pour repartir de zéro.", "note");
    afficher("");
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
