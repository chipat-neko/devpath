/* =============================================================================
   git-graphe.js — LA VISUALISATION du bac à sable Git (chantier V14, point D3).
   Écrit par-dessus le modèle (`js/git-modele.js`) ; ne dépend PAS des commandes.
   Aucun module ES, aucune dépendance, aucun réseau : le fichier tourne en
   `file://` dans le navigateur comme dans Node (pour `tools/verif-git-graphe.js`).

   POURQUOI CE FICHIER EXISTE
   Un dépôt Git est un graphe, et c'est en le VOYANT qu'on comprend ce que fait
   un `rebase` : les mêmes modifications, mais accrochées ailleurs, donc d'autres
   empreintes. Un texte peut l'affirmer ; un dessin le montre.

   CE QUI EST MESURÉ CONTRE LE VRAI GIT (tools/verif-git-graphe.js)
   1. L'ORDRE des lignes, exactement celui de `git log --all --topo-order`.
      Éprouvé au-delà de cet outil : une passe adversariale a énuméré
      exhaustivement les graphes à quatre, cinq et six commits et joué 4 731
      formes pour 264 373 comparaisons — **zéro écart d'ordre**.
      Ce n'est pas un détail d'affichage : en ordre de DATE (`--date-order`,
      celui de `Depot.journal`), git sort parfois un parent AVANT ses propres
      descendants — mesuré en D1 sur une fusion dont le second parent est la
      racine. Dessiné, cela donnerait une flèche qui remonte. L'ordre
      topologique interdit ce cas par construction.
   2. La VOIE (la colonne) de chaque commit, comparée à la position du `*` dans
      le graphe ASCII de `git log --graph`.
   3. Les ARÊTES, comparées aux couples (commit, parent) de `git rev-list
      --all --parents`.
   4. Les MARQUES (HEAD, branches, étiquettes), comparées à `%d` de `git log`.

   L'ORDRE TOPOLOGIQUE, TEL QUE GIT LE CALCULE (revision.c,
   `sort_in_topological_order`) — et non tel qu'on l'imagine :
     a. on part de la liste en ordre de DATE de committeur ;
     b. on compte, pour chaque commit, ses enfants présents dans l'ensemble ;
     c. les « pointes » (aucun enfant) sont empilées dans l'ordre de cette
        liste, PUIS LA PILE EST RENVERSÉE — git le fait explicitement, avec ce
        commentaire : « the initial tips need to be shown in the order given
        from the revision traversal machinery » ;
     d. on dépile ; à chaque commit sorti on décrémente ses parents, et un
        parent qui n'attend plus personne est empilé.
   C'est une PILE, pas une file de priorité : c'est elle qui fait sortir le
   SECOND parent d'une fusion avant le premier — donc la branche fusionnée avant
   la ligne principale. Une file de priorité par date rendrait l'inverse, et
   c'est l'erreur qu'on ferait naturellement.

   LES VOIES : algorithme des colonnes de gitk, écrit ici en dix lignes. On tient
   un tableau de voies ; chaque voie ATTEND une empreinte. Un commit prend la
   voie la plus à gauche qui l'attend (sinon la première libre), puis cède la
   place à son premier parent ; ses autres parents ouvrent des voies neuves. Les
   voies que plusieurs enfants attendaient sont libérées.

   CE QUI EST ASSUMÉ
   - Git COMPRESSE ses colonnes : il en INSÈRE une à droite d'une fusion (les
     `|\ \` du dessin ASCII) et en SUPPRIME une quand une lignée meurt (les
     `|/`), auquel cas tout ce qui est à droite glisse d'un cran. Ici, une voie
     garde son numéro du début à la fin, ce qui donne des lignes droites en SVG.
     ⚠️ Conséquence, et il a fallu une contre-épreuve pour l'écrire : les
     numéros de colonne ne coïncident PAS toujours avec ceux de git, et l'ordre
     gauche-droite de deux voisins non plus. Une énumération exhaustive des
     graphes à six commits et une racine met **225 cas sur 2 700 (8,3 %)** en
     écart, quelles que soient les dates. Le vérificateur COMPTE donc cette
     ressemblance au lieu de l'exiger ; ce qu'il exige, ce sont l'ordre des
     lignes, les arêtes, les marques et les invariants de lisibilité.
   - Une référence qui pointe sur un objet `tag` (étiquette ANNOTÉE) est
     ignorée : le modèle n'en fabrique pas, et `git tag -a` est refusé par les
     commandes. Le jour où D2 les ajoutera, il faudra PELER la référence ici et
     dans `marquesPar`, sans quoi un commit tenu par une seule étiquette
     annotée disparaîtrait du graphe — mesuré contre le vrai git.
   - Une fusion dont le second parent est un ANCÊTRE du premier ferait descendre
     une arête à travers les commits intermédiaires. Aucune des quinze commandes
     ne peut produire cette forme (git répond « Already up to date. » et le bac
     à sable aussi) ; elle n'est atteignable que par un état importé.
   - Les commits inatteignables (après un `reset --hard`, par exemple) ne sont
     pas montrés par git ; l'option `orphelins` permet de les afficher, parce
     que « où est passé mon commit ? » est une vraie question d'apprenant. Elle
     est FAUSSE par défaut, sinon rien ne serait comparable à git.
   ============================================================================= */
(function (racine) {
  "use strict";

  var GM = (typeof module !== "undefined" && module.exports)
    ? require("./git-modele.js")
    : (racine && racine.GitModele);
  if (!GM) throw new Error("git-graphe.js : git-modele.js doit être chargé avant.");

  var dico = GM.dico;
  function possede(o, k) { return Object.prototype.hasOwnProperty.call(o, k); }

  /* La géométrie. Une seule table : la page ne recalcule rien, elle relit. */
  var GEO = {
    pasVoie: 26,        // écart horizontal entre deux voies
    pasLigne: 44,       // écart vertical entre deux commits
    margeX: 20,
    margeY: 26,
    rayon: 7,
    rayonFusion: 9,
    colonneTexte: 18,   // écart entre la dernière voie et le début du texte
    carMono: 7.3,       // largeur d'un caractère de la police à chasse fixe, 12 px
    hauteurPastille: 19,
    /* 14 px de remplissage dans la pastille + 6 px avant la suivante : une
       SEULE constante, sinon l'estimation et la pose derivent l'une de l'autre. */
    pastilleMarges: 20
  };

  /* ===========================================================================
     1. L'ORDRE
     =========================================================================== */

  /* Les points de départ de `git log --all` : toutes les références, dans
     l'ordre alphabétique de leur nom COMPLET (c'est celui de `for_each_ref`),
     puis HEAD. L'ordre compte : à dates égales — la norme dans un bac à sable
     dont l'horloge est déterministe — c'est lui qui départage. */
  function departs(depot) {
    var noms = [], r;
    for (r in depot.refs) if (possede(depot.refs, r)) noms.push(r);
    noms.sort();
    var out = [], vus = dico(), i, oid;
    for (i = 0; i < noms.length; i++) {
      oid = depot.refs[noms[i]];
      if (!oid || depot.typeDe(oid) !== "commit" || vus[oid]) continue;
      vus[oid] = true;
      out.push(oid);
    }
    oid = depot.oidHEAD();
    if (oid && depot.existe(oid) && depot.typeDe(oid) === "commit" && !vus[oid]) {
      vus[oid] = true;
      out.push(oid);
    }
    return out;
  }

  /* Tous les commits stockés, atteignables ou non. Sert à l'option
     `orphelins` : après un `git reset --hard`, le commit abandonné existe
     toujours dans la base d'objets — c'est exactement ce que l'apprenant a
     besoin de voir pour comprendre qu'il n'a rien perdu. */
  function commitsOrphelins(depot, atteints) {
    var out = [], oid;
    for (oid in depot.objets) {
      if (!possede(depot.objets, oid)) continue;
      if (depot.objets[oid].type !== "commit" || atteints[oid]) continue;
      out.push(oid);
    }
    /* Du plus récent au plus ancien, comme le reste ; à date égale, par
       empreinte, faute de mieux : ces commits n'ont plus d'ordre d'insertion. */
    var self = depot;
    out.sort(function (a, b) {
      var ca = self.lireCommit(a), cb = self.lireCommit(b);
      if (ca.instantCommit !== cb.instantCommit) return cb.instantCommit - ca.instantCommit;
      return a < b ? -1 : (a > b ? 1 : 0);
    });
    return out;
  }

  /* Le parcours par DATE de committeur, plusieurs départs à la fois : la file de
     priorité de `git log`, celle que `Depot.journal` applique à un seul départ.
     À date égale, l'ordre d'insertion fait foi (git insère un parent APRÈS les
     éléments de même date déjà présents). */
  function ordreParDate(depot, racines) {
    var vus = dico(), out = [], file = [], rang = 0, i;
    for (i = 0; i < racines.length; i++) file.push({ oid: racines[i], rang: rang++ });
    while (file.length) {
      file.sort(function (a, b) {
        var ca = depot.lireCommit(a.oid), cb = depot.lireCommit(b.oid);
        if (ca.instantCommit !== cb.instantCommit) return cb.instantCommit - ca.instantCommit;
        return a.rang - b.rang;
      });
      var choisi = file.shift();
      if (vus[choisi.oid]) continue;
      vus[choisi.oid] = true;
      var c = depot.lireCommit(choisi.oid);
      out.push(choisi.oid);
      for (i = 0; i < c.parents.length; i++) {
        var p = c.parents[i];
        if (vus[p] || !depot.existe(p)) continue;
        var deja = false;
        for (var j = 0; j < file.length; j++) if (file[j].oid === p) { deja = true; break; }
        if (!deja) file.push({ oid: p, rang: rang++ });
      }
    }
    return out;
  }

  /* Le tri topologique de git, à la lettre : pile, pointes renversées. */
  function ordreTopologique(depot, parDate) {
    var dans = dico(), attentes = dico(), i, j;
    for (i = 0; i < parDate.length; i++) { dans[parDate[i]] = true; attentes[parDate[i]] = 0; }
    for (i = 0; i < parDate.length; i++) {
      var c = depot.lireCommit(parDate[i]);
      for (j = 0; j < c.parents.length; j++) {
        var p = c.parents[j];
        if (dans[p]) attentes[p]++;
      }
    }
    var pile = [];
    for (i = 0; i < parDate.length; i++) if (attentes[parDate[i]] === 0) pile.push(parDate[i]);
    pile.reverse();
    var out = [], sortis = dico();
    while (pile.length) {
      var oid = pile.pop();
      if (sortis[oid]) continue;
      sortis[oid] = true;
      out.push(oid);
      var cc = depot.lireCommit(oid);
      for (j = 0; j < cc.parents.length; j++) {
        var q = cc.parents[j];
        if (!dans[q]) continue;
        attentes[q]--;
        if (attentes[q] === 0) pile.push(q);
      }
    }
    /* Filet : un cycle rendrait des commits jamais dépilés. Un dépôt Git n'en a
       pas — mais un bac à sable importé d'un `localStorage` bricolé, si. On les
       ajoute à la fin plutôt que de les perdre en silence. */
    if (out.length !== parDate.length) {
      for (i = 0; i < parDate.length; i++) if (!sortis[parDate[i]]) out.push(parDate[i]);
    }
    return out;
  }

  function ordonner(depot, options) {
    options = options || {};
    var racines = departs(depot);
    var parDate = ordreParDate(depot, racines);
    if (options.orphelins) {
      var atteints = dico();
      for (var k = 0; k < parDate.length; k++) atteints[parDate[k]] = true;
      var perdus = commitsOrphelins(depot, atteints);
      if (perdus.length) parDate = ordreParDate(depot, racines.concat(perdus));
    }
    return ordreTopologique(depot, parDate);
  }

  /* ===========================================================================
     2. LES VOIES
     =========================================================================== */

  function attribuerVoies(depot, ordre) {
    var voies = [];                 // voies[i] = empreinte attendue, ou null
    var lignes = [], maxVoies = 0;

    function premiereLibre() {
      for (var i = 0; i < voies.length; i++) if (voies[i] === null) return i;
      voies.push(null);
      return voies.length - 1;
    }

    function voieAttendant(cible) {
      for (var i = 0; i < voies.length; i++) if (voies[i] === cible) return i;
      return -1;
    }

    var dans = dico();
    for (var i = 0; i < ordre.length; i++) dans[ordre[i]] = true;

    for (var n = 0; n < ordre.length; n++) {
      var oid = ordre[n];
      var voie = -1, j;
      for (j = 0; j < voies.length; j++) if (voies[j] === oid) { voie = j; break; }
      if (voie < 0) voie = premiereLibre();
      /* Deux voies n'attendent JAMAIS le même commit : la convergence est
         refermée plus bas, au moment où on choisit la voie du premier parent.
         Une boucle de nettoyage vivait ici ; la contre-épreuve a montré qu'elle
         n'était plus atteignable sur aucun des 19 scénarios (l'y remplacer par
         une exception ne fait rien lever), et un garde-fou qu'aucun cas
         n'atteint n'est pas une sécurité, c'est une affirmation invérifiable. */

      var c = depot.lireCommit(oid);
      var parents = [];
      for (j = 0; j < c.parents.length; j++) if (dans[c.parents[j]]) parents.push(c.parents[j]);

      var voiesParents = [];
      if (parents.length === 0) {
        voies[voie] = null;                       // une racine : la voie s'arrête
      } else {
        /* Si une AUTRE voie attend déjà ce parent, les deux convergent : git
           referme aussitôt la voie de droite (les lignes `|/` du dessin) au
           lieu de garder deux colonnes pour un seul commit. Sans cela, la
           colonne suivante était décalée d'un cran — 4 écarts sur 385 mesurés
           avant correction. */
        var deja = voieAttendant(parents[0]);
        if (deja >= 0 && deja !== voie) {
          var gauche = Math.min(voie, deja), droite = Math.max(voie, deja);
          voies[droite] = null;
          voies[gauche] = parents[0];
          voiesParents.push(gauche);
        } else {
          voies[voie] = parents[0];
          voiesParents.push(voie);
        }
        for (j = 1; j < parents.length; j++) {
          /* Un parent déjà attendu ailleurs garde SA voie : sinon une fusion
             dont le second parent est déjà dessiné ouvrirait une colonne qui ne
             mène nulle part. */
          var existante = -1;
          for (var k = 0; k < voies.length; k++) if (voies[k] === parents[j]) { existante = k; break; }
          if (existante < 0) { existante = premiereLibre(); voies[existante] = parents[j]; }
          voiesParents.push(existante);
        }
      }

      lignes.push({ oid: oid, voie: voie, parents: parents, voiesParents: voiesParents });
      /* ⚠️ La largeur est celle des colonnes qu'un commit OCCUPE, pas celle des
         colonnes RESERVEES. Une voie ouverte pour un second parent peut etre
         refermee plus bas par la convergence sans qu'aucun commit ne s'y soit
         jamais pose : compter les reservations donnait alors une colonne vide a
         droite du graphe — atteignable en CINQ commandes ordinaires (fusionner,
         revenir, refusionner), et 13 fois sur les 2 700 graphes a six commits
         enumeres exhaustivement. */
      if (voie + 1 > maxVoies) maxVoies = voie + 1;
    }
    /* A la fin, plus aucune voie ne doit attendre quoi que ce soit : tous les
       parents du graphe ont ete dessines. Une voie encore reservee signale une
       lignee que le dessin a ouverte et jamais refermee — c'est l'invariant que
       le verificateur exige a zero. */
    var restantes = 0;
    for (j = 0; j < voies.length; j++) if (voies[j] !== null) restantes++;
    return { lignes: lignes, voies: maxVoies || 1, restantes: restantes };
  }

  /* ===========================================================================
     3. LES MARQUES (HEAD, branches, étiquettes)
     =========================================================================== */

  /* ⚠️ UNE SEULE expression du libelle d'une pastille, et une seule de sa
     largeur. Il y en avait DEUX, qui ne disaient pas la meme chose : le dessin
     posait « HEAD → main » (11 caracteres) la ou l'estimation de largeur
     comptait « HEAD » (4). Consequence mesuree : le SVG etait annonce 30 px
     trop court des le PREMIER commit, `overflow: hidden` rognait le titre, et
     le manque croissait avec la longueur du nom de branche — sur
     `correctif/connexion-base-de-donnees-lente`, l'empreinte et le titre
     disparaissaient entierement. L'`aria-label` avait le meme defaut : il
     annoncait « HEAD, sujet » sans jamais nommer la branche courante. */
  function texteMarque(m) {
    if (m.sorte === "etiquette") return "tag: " + m.nom;
    if (m.sorte === "tete" && m.branche) return "HEAD → " + m.branche;
    return m.nom;
  }

  /* Le libelle DIT a un lecteur d'ecran de quoi il s'agit : « HEAD sur la
     branche main » vaut mieux que « HEAD → main », qui se lit « HEAD fleche
     droite main ». */
  function marqueParlee(m) {
    if (m.sorte === "etiquette") return "etiquette " + m.nom;
    if (m.sorte === "tete") return m.branche ? "HEAD, sur la branche " + m.branche : "HEAD, detachee";
    return "branche " + m.nom;
  }

  function largeurMarque(m) {
    return texteMarque(m).length * GEO.carMono + GEO.pastilleMarges;
  }

  function marquesPar(depot) {
    var par = dico(), oid, i;
    function ajouter(o, m) {
      if (!o) return;
      if (!par[o]) par[o] = [];
      par[o].push(m);
    }
    var branches = depot.branches();
    var courante = depot.brancheCourante();
    var tete = depot.oidHEAD();
    /* HEAD est TOUJOURS montré : « où suis-je ? » est la première question du
       débutant, et c'est aussi ce que git écrit — `(HEAD -> main)` quand il est
       attaché, `(HEAD)` quand il est détaché. La branche courante n'a donc pas
       de pastille à elle : elle est DANS celle de HEAD, avec la flèche. */
    if (tete) ajouter(tete, { sorte: "tete", nom: "HEAD", branche: courante, courante: true });
    for (i = 0; i < branches.length; i++) {
      if (branches[i] === courante) continue;
      oid = depot.oidDeRef("refs/heads/" + branches[i]);
      ajouter(oid, { sorte: "branche", nom: branches[i], courante: false });
    }
    var etiquettes = depot.etiquettes();
    for (i = 0; i < etiquettes.length; i++) {
      oid = depot.oidDeRef("refs/tags/" + etiquettes[i]);
      if (oid && depot.existe(oid) && depot.typeDe(oid) !== "commit") continue;
      ajouter(oid, { sorte: "etiquette", nom: etiquettes[i], courante: false });
    }
    /* L'ordre d'affichage de git : HEAD d'abord (et la branche courante juste
       après, puisqu'il pointe dessus), puis les autres branches, puis les
       étiquettes. */
    for (var o in par) {
      if (!possede(par, o)) continue;
      par[o].sort(function (a, b) {
        var rang = { tete: 0, branche: 1, etiquette: 2 };
        if (a.courante !== b.courante) return a.courante ? -1 : 1;
        if (rang[a.sorte] !== rang[b.sorte]) return rang[a.sorte] - rang[b.sorte];
        return a.nom < b.nom ? -1 : (a.nom > b.nom ? 1 : 0);
      });
    }
    return par;
  }

  /* ===========================================================================
     4. LA DISPOSITION
     =========================================================================== */

  function chemin(x1, y1, x2, y2, versLaDroite) {
    if (x1 === x2) return "M" + x1 + " " + y1 + "L" + x2 + " " + y2;
    if (versLaDroite) {
      /* Le parent ouvre une voie à droite (second parent d'une fusion) : on
         s'écarte TOUT DE SUITE, puis on descend droit. */
      var yc = y1 + GEO.pasLigne * 0.55;
      return "M" + x1 + " " + y1 + "C" + x1 + " " + yc + " " + x2 + " " + (y1 + GEO.pasLigne * 0.45)
        + " " + x2 + " " + yc + "L" + x2 + " " + y2;
    }
    /* Le parent est à gauche : on descend dans sa propre voie et on ne rejoint
       le parent qu'au dernier moment — c'est le repli des lignes `|/` de git. */
    var yd = y2 - GEO.pasLigne * 0.55;
    return "M" + x1 + " " + y1 + "L" + x1 + " " + yd
      + "C" + x1 + " " + (y2 - GEO.pasLigne * 0.2) + " " + x2 + " " + (y2 - GEO.pasLigne * 0.35)
      + " " + x2 + " " + y2;
  }

  function abreger(oid) { return oid.slice(0, 7); }

  function disposer(depot, options) {
    options = options || {};
    var ordre = ordonner(depot, options);
    var pose = attribuerVoies(depot, ordre);
    var marques = marquesPar(depot);
    var atteignables = dico();
    if (options.orphelins) {
      var vus = ordreParDate(depot, departs(depot));
      for (var a = 0; a < vus.length; a++) atteignables[vus[a]] = true;
    }

    var xTexte = GEO.margeX + (pose.voies - 1) * GEO.pasVoie + GEO.colonneTexte + GEO.rayonFusion;
    var noeuds = [], parLigne = dico(), i, j;

    for (i = 0; i < pose.lignes.length; i++) {
      var L = pose.lignes[i];
      var c = depot.lireCommit(L.oid);
      var n = {
        oid: L.oid,
        abrev: abreger(L.oid),
        titre: c.titre,
        ligne: i,
        voie: L.voie,
        x: GEO.margeX + L.voie * GEO.pasVoie,
        y: GEO.margeY + i * GEO.pasLigne,
        parents: c.parents.slice(),
        fusion: c.parents.length > 1,
        racine: c.parents.length === 0,
        marques: marques[L.oid] ? marques[L.oid].slice() : [],
        orphelin: !!options.orphelins && !atteignables[L.oid],
        instantCommit: c.instantCommit,
        identite: c.identite
      };
      noeuds.push(n);
      parLigne[L.oid] = n;
    }

    var aretes = [];
    for (i = 0; i < pose.lignes.length; i++) {
      var Li = pose.lignes[i];
      for (j = 0; j < Li.parents.length; j++) {
        var pOid = Li.parents[j];
        var np = parLigne[pOid];
        if (!np) continue;                         // parent hors du graphe affiché
        var ne = noeuds[i];
        aretes.push({
          enfant: ne.oid,
          parent: pOid,
          ligneEnfant: ne.ligne,
          ligneParent: np.ligne,
          voieEnfant: ne.voie,
          voieParent: np.voie,
          rang: j,
          chemin: chemin(ne.x, ne.y, np.x, np.y, np.voie > ne.voie)
        });
      }
    }

    /* La largeur : le graphe, plus la plus longue ligne de texte. Estimée à la
       chasse de la police mono — le SVG n'a pas de moyen de mesurer un texte
       avant de l'avoir posé, et une largeur trop courte tronquerait. */
    var largeurTexte = 0;
    for (i = 0; i < noeuds.length; i++) {
      var l = (noeuds[i].abrev.length + 1 + noeuds[i].titre.length) * GEO.carMono;
      for (j = 0; j < noeuds[i].marques.length; j++) l += largeurMarque(noeuds[i].marques[j]);
      if (l > largeurTexte) largeurTexte = l;
    }

    return {
      noeuds: noeuds,
      aretes: aretes,
      voies: pose.voies,
      voiesRestantes: pose.restantes,
      lignes: noeuds.length,
      xTexte: xTexte,
      largeur: Math.ceil(xTexte + largeurTexte + GEO.margeX),
      hauteur: noeuds.length ? GEO.margeY * 2 + (noeuds.length - 1) * GEO.pasLigne : 60,
      geo: GEO
    };
  }

  /* ===========================================================================
     5. LE DESSIN
     Un arbre abstrait d'abord, deux rendus ensuite : le DOM pour la page, le
     texte pour les contrôles. Une seule construction, donc aucun risque que
     l'un dise ce que l'autre ne montre pas — et le rendu DOM pose les textes
     par `textContent`, donc un nom de branche `<script>` reste un nom.
     =========================================================================== */

  function el(tag, attrs, enfants) {
    return { tag: tag, attrs: attrs || {}, enfants: enfants || [], texte: null };
  }
  function txt(tag, attrs, contenu) {
    var e = el(tag, attrs);
    e.texte = String(contenu);
    return e;
  }

  /* Trois sortes de pastilles, pas quatre : la branche COURANTE n'a pas de
     pastille a elle — elle est dans celle de HEAD, avec la fleche, comme chez
     git. La classe `--courante` qui vivait ici n'etait donc jamais posee :
     mesure faite sur 800 rendus tires de 400 depots, 0 occurrence. */
  function classeMarque(m) {
    if (m.sorte === "tete") return "gg-marque gg-marque--tete";
    if (m.sorte === "etiquette") return "gg-marque gg-marque--etiquette";
    return "gg-marque gg-marque--branche";
  }

  function arbre(d, options) {
    options = options || {};
    var enfants = [], i, j;

    /* Les traits sont DECORATIFS : ce qu'ils disent (« ce commit descend de
       celui-la ») est deja dans le libelle de chaque commit. Sans cela, un
       enfant sans role s'intercale dans le role="list". */
    var aretes = el("g", { "class": "gg-aretes", fill: "none", "aria-hidden": "true" });
    for (i = 0; i < d.aretes.length; i++) {
      var a = d.aretes[i];
      aretes.enfants.push(el("path", {
        "class": "gg-arete gg-voie-" + (a.voieParent % 6),
        d: a.chemin,
        "data-de": a.enfant,
        "data-vers": a.parent
      }));
    }
    enfants.push(aretes);

    for (i = 0; i < d.noeuds.length; i++) {
      var n = d.noeuds[i];
      var classes = "gg-noeud gg-voie-" + (n.voie % 6);
      if (n.fusion) classes += " gg-noeud--fusion";
      if (n.racine) classes += " gg-noeud--racine";
      if (n.orphelin) classes += " gg-noeud--orphelin";
      if (options.selection === n.oid) classes += " gg-noeud--choisi";
      var g = el("g", {
        "class": classes,
        "data-oid": n.oid,
        tabindex: "0",
        role: "listitem",
        "aria-label": "Commit " + n.abrev + " — " + n.titre
          + (n.marques.length ? " — " + n.marques.map(marqueParlee).join(", ") : "")
      });
      g.enfants.push(el("circle", {
        "class": "gg-point",
        cx: n.x, cy: n.y, r: n.fusion ? d.geo.rayonFusion : d.geo.rayon
      }));
      if (n.fusion) g.enfants.push(el("circle", { "class": "gg-point-creux", cx: n.x, cy: n.y, r: 3.4 }));

      var x = d.xTexte;
      for (j = 0; j < n.marques.length; j++) {
        var m = n.marques[j];
        var etiq = texteMarque(m);
        var w = largeurMarque(m) - 6;            // la pastille ; les 6 px sont l'ecart
        g.enfants.push(el("rect", {
          "class": classeMarque(m),
          x: x, y: n.y - d.geo.hauteurPastille / 2,
          width: Math.round(w), height: d.geo.hauteurPastille, rx: 6
        }));
        g.enfants.push(txt("text", {
          "class": "gg-marque-texte", x: x + 7, y: n.y + 4
        }, etiq));
        x += w + 6;
      }
      g.enfants.push(txt("text", { "class": "gg-abrev", x: x, y: n.y + 4 }, n.abrev));
      g.enfants.push(txt("text", {
        "class": "gg-titre", x: x + (n.abrev.length + 1) * d.geo.carMono, y: n.y + 4
      }, n.titre));
      enfants.push(g);
    }

    return el("svg", {
      "class": "gg-svg",
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 " + d.largeur + " " + d.hauteur,
      width: d.largeur, height: d.hauteur,
      role: "list",
      "aria-label": "Graphe des commits, du plus récent au plus ancien"
    }, enfants);
  }

  function echapper(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  function versTexte(noeud) {
    var out = "<" + noeud.tag, k;
    for (k in noeud.attrs) {
      if (!possede(noeud.attrs, k)) continue;
      out += " " + k + "=\"" + echapper(noeud.attrs[k]) + "\"";
    }
    out += ">";
    if (noeud.texte !== null) out += echapper(noeud.texte);
    for (var i = 0; i < noeud.enfants.length; i++) out += versTexte(noeud.enfants[i]);
    return out + "</" + noeud.tag + ">";
  }

  var NS = "http://www.w3.org/2000/svg";
  function versDom(noeud, doc) {
    var e = doc.createElementNS(NS, noeud.tag), k;
    for (k in noeud.attrs) {
      if (!possede(noeud.attrs, k)) continue;
      e.setAttribute(k, String(noeud.attrs[k]));
    }
    if (noeud.texte !== null) e.textContent = noeud.texte;
    for (var i = 0; i < noeud.enfants.length; i++) e.appendChild(versDom(noeud.enfants[i], doc));
    return e;
  }

  function svgTexte(depot, options) { return versTexte(arbre(disposer(depot, options), options)); }
  function svgDom(depot, doc, options) { return versDom(arbre(disposer(depot, options), options), doc); }

  var GitGraphe = {
    GEO: GEO,
    departs: departs,
    ordreParDate: ordreParDate,
    ordreTopologique: ordreTopologique,
    ordonner: ordonner,
    attribuerVoies: attribuerVoies,
    marquesPar: marquesPar,
    texteMarque: texteMarque,
    largeurMarque: largeurMarque,
    disposer: disposer,
    arbre: arbre,
    versTexte: versTexte,
    versDom: versDom,
    svgTexte: svgTexte,
    svgDom: svgDom,
    echapper: echapper
  };

  if (typeof module !== "undefined" && module.exports) module.exports = GitGraphe;
  if (racine) racine.GitGraphe = GitGraphe;
})(typeof window !== "undefined" ? window : null);
