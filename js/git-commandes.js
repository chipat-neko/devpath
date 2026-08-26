/* =============================================================================
   git-commandes.js — LES COMMANDES du bac à sable Git (chantier V14, point D2),
   écrites par-dessus le modèle de `js/git-modele.js`. Aucune dépendance, aucun
   module ES, aucun réseau : le fichier tourne en `file://` dans le navigateur
   comme dans Node (pour `tools/verif-git-commandes.js`).

   CE QUE CE FICHIER AJOUTE AU MODÈLE
   Le modèle (D1) sait ce qu'est un dépôt : des objets, un index, des références,
   un graphe. Il ne sait pas ce qu'est `git rebase`. Ce fichier écrit les neuf
   commandes qui MODIFIENT le graphe — add, commit, branch, checkout, merge,
   rebase, reset, revert, cherry-pick — plus celles qui le donnent à lire
   (status, log, tag, rm). Chacune rend un objet :

       { ok, code, sortie: [lignes], explication: "…" }

   `sortie` reproduit CE QUE GIT ÉCRIT, en anglais, parce que c'est ce que
   l'apprenant lira dans son terminal : traduire « Fast-forward » lui apprendrait
   un git qui n'existe pas. `explication` est la glose française du bac à sable —
   c'est elle que l'interface (D3, D4) affiche à côté.

   LA RÈGLE QUI TIENT TOUT : rien ici n'est écrit de tête. Chaque sortie, chaque
   message d'erreur, chaque empreinte est confrontée au VRAI git par
   `tools/verif-git-commandes.js`, qui rejoue le même scénario dans un dépôt
   temporaire et compare. Un simulateur qu'on relit sans l'exécuter est une
   affirmation, pas un enseignement.

   CE QUI N'EST PAS SIMULÉ, ET QUI EST ASSUMÉ
   Cette liste n'est pas une intuition : elle est ce qui RESTE après trois passes
   adversariales (379 scénarios montés dans un vrai dépôt git, ~33 000
   comparaisons) qui ont rendu 99 fautes distinctes, toutes corrigées sauf
   celles-ci.

   - **Les renommages ne sont pas détectés** (comme `git diff --no-renames`).
     Ce n'est pas qu'un écart d'étiquette : quand un côté renomme et l'autre
     modifie, git fusionne et le bac à sable rend un conflit « modifié/supprimé ».
     Le contenu produit diffère. C'est la dette la plus lourde du fichier.
   - **Pas de fusion « octopus »** (`git merge b1 b2`), pas de `--squash`, pas de
     `rebase -i`, pas d'étiquette annotée, pas de branche orpheline : chacune est
     REFUSÉE avec un message qui le dit, plutôt qu'exécutée de travers.
   - **`git diff` ne rend pas un diff unifié** : il dit ce qui a changé, pas
     ligne par ligne. Le format `diff --git … @@` reste à écrire.
   - **Pas de répertoire courant** : `git add .` porte toujours sur tout le dépôt,
     alors que git le limite au dossier depuis lequel on l'appelle.
   - **Les blocs d'aide de git ne sont pas reproduits** : une option inconnue
     rend la ligne `error: unknown option` et la PREMIÈRE ligne d'usage, pas les
     quarante lignes que git déroule. De même, `git zzz` ne suggère pas de
     commande proche.
   - ⚠️ **Un rebasage dont la branche contient une FUSION n'aplatit rien, et le
     dit mal.** Mesuré des deux côtés le 2026-08-26 : sur `main → (c2, c3)` d'un
     côté, `c4 → c5` de l'autre, une fusion des deux, puis `git rebase hotfix`,
     le vrai git rejoue c2 et c3 par-dessus c5 et la fusion disparaît
     (« Successfully rebased ») ; le bac à sable répond « Current branch z2 is
     up to date. » et ne touche à rien. Ce n'est donc pas, comme il était écrit
     ici, un simple écart d'ORDRE d'aplatissement : c'est une absence
     d'aplatissement, annoncée par un message qui affirme le contraire. Les
     6 976 comparaisons de D2 ne l'avaient pas vue, faute de scénario ; une
     passe adversariale du point D3 l'a trouvée. À corriger dans `C.rebase` :
     la liste des commits à rejouer doit être celle de `rev-list amont..HEAD`
     sans les fusions, et non « rien si l'amont est un ancêtre ».
   - Un fichier dont le saut de ligne final est ajouté d'un seul côté élargit le
     conflit d'une ligne par rapport à git ; `\ No newline at end of file` n'est
     pas écrit.
   - `rebase` ne saute pas explicitement les commits déjà appliqués en amont
     (git compare des `patch-id` et le dit dans un `warning:`).
   - Pas de dépôt distant, donc pas de `fetch`/`push`/`pull` ; pas de reflog,
     donc pas de `HEAD@{1}` ; pas de `stash` ; pas de sous-modules. Ces commandes
     EXISTENT dans git : depuis D4, elles sont refusées par un message qui le dit
     (« git restore existe, mais ce bac à sable ne le simule pas »), et non plus
     par « is not a git command » — qui affirmait une contre-vérité, alors même
     que le `git status` du bac à sable propose `git restore --staged`.

   ⚠️ SEPT DIVERGENCES DE PLUS, mesurées le 2026-08-26 par une passe adversariale
   du point D4 (97 suites voisines rejouées des deux côtés, 9 727 comparaisons).
   Aucune n'est atteinte par les scénarios publiés — elles le seraient par un
   apprenant qui explore. Elles sont écrites ici plutôt que corrigées à la hâte :

   - **`git checkout HEAD` (sans chemin) DÉTACHE HEAD** ici ; le vrai git reste
     sur la branche et ne bouge pas. C'est la plus grave des sept : elle change
     l'état du dépôt, pas seulement un message.
   - **`git cherry-pick -n <commit>`** ouvre à tort une opération en cours : le
     `status` annonce « You are currently cherry-picking », `--continue` COMMITE
     et `--abort` DÉTRUIT le travail indexé, là où git répond « no cherry-pick or
     revert in progress ». Perte de données silencieuse.
   - **`git commit -a -m` pendant un conflit** est refusé ici (« Committing is
     not possible because you have unmerged files ») ; git, lui, termine la
     fusion dès lors que les marqueurs ont été retirés du fichier.
   - **`git checkout --ours|--theirs <fichier>`** : l'option est ignorée, la
     commande se comporte comme un `checkout <chemin>` et échoue.
   - **`git reset --keep <commit>`** laisse sur le disque un fichier que git
     supprime.
   - **`git checkout -B <branche courante> <cible>`** écrit « Switched to and
     reset branch » là où git écrit « Reset branch » : le bac à sable ne
     distingue pas le cas où l'on y est déjà.
   - **`git revert A..B`** rend une ligne d'usage au lieu de « empty commit set
     passed ».

   Et une divergence de STRATÉGIE, elle, corrigée : `-X theirs`, `-s ours` et
   `--strategy-option` étaient LUS puis IGNORÉS — la fusion se faisait à trois
   voies et rendait un conflit là où git résolvait tout seul. Ils sont désormais
   REFUSÉS avec un message, conformément à la politique de ce fichier : une
   option sans effet enseigne un drapeau qui n'a rien fait.
   ============================================================================= */
(function (racine) {
  "use strict";

  var GM = (typeof module !== "undefined" && module.exports)
    ? require("./git-modele.js")
    : (racine && racine.GitModele);
  if (!GM) throw new Error("git-commandes.js : git-modele.js doit être chargé avant.");

  var dico = GM.dico;
  var MODE_FICHIER = GM.MODE_FICHIER;
  var MODE_SOUS_MODULE = GM.MODE_SOUS_MODULE;

  function possede(o, k) { return Object.prototype.hasOwnProperty.call(o, k); }

  /* ===========================================================================
     1. TEXTE : découpage en lignes, plus longue sous-séquence commune, diff3.
     =========================================================================== */

  /* Chaque ligne GARDE son saut de ligne. Deux conséquences voulues : recoller
     un tableau de lignes est une simple concaténation, et un fichier qui ne
     finit pas par un saut de ligne diffère RÉELLEMENT de celui qui y finit —
     c'est ce que git compte comme « 1 insertion + 1 suppression » et signale par
     « \ No newline at end of file ». */
  function decouper(texte) {
    if (texte === "" || texte == null) return [];
    var out = [], debut = 0;
    for (var i = 0; i < texte.length; i++) {
      if (texte.charAt(i) === "\n") { out.push(texte.slice(debut, i + 1)); debut = i + 1; }
    }
    if (debut < texte.length) out.push(texte.slice(debut));
    return out;
  }

  /* Appariement monotone de deux suites de lignes (programmation dynamique).
     Rend `corr` : pour chaque indice de `a`, l'indice apparié dans `b`, ou -1.
     O(n·m) — un bac à sable manipule des fichiers de quelques dizaines de
     lignes, la simplicité vaut mieux que la vitesse ici. */
  function apparier(a, b) {
    var n = a.length, m = b.length, i, j;
    var table = new Array(n + 1);
    for (i = 0; i <= n; i++) {
      table[i] = new Array(m + 1);
      for (j = 0; j <= m; j++) table[i][j] = 0;
    }
    for (i = n - 1; i >= 0; i--) {
      for (j = m - 1; j >= 0; j--) {
        if (a[i] === b[j]) table[i][j] = table[i + 1][j + 1] + 1;
        else table[i][j] = Math.max(table[i + 1][j], table[i][j + 1]);
      }
    }
    var corr = new Array(n);
    for (i = 0; i < n; i++) corr[i] = -1;
    i = 0; j = 0;
    while (i < n && j < m) {
      if (a[i] === b[j]) { corr[i] = j; i++; j++; }
      else if (table[i + 1][j] >= table[i][j + 1]) i++;
      else j++;
    }
    return corr;
  }

  /* Nombre de lignes ajoutées et supprimées entre deux contenus — la statistique
     que `git commit` affiche (« 1 file changed, 2 insertions(+) »). */
  function compterDiff(avant, apres) {
    var a = decouper(avant), b = decouper(apres);
    var corr = apparier(a, b), communs = 0;
    for (var i = 0; i < corr.length; i++) if (corr[i] >= 0) communs++;
    return { ajouts: b.length - communs, retraits: a.length - communs };
  }

  /* Fusion à trois voies sur les lignes.
     Principe : les lignes de la base appariées À LA FOIS dans notre version et
     dans la leur sont des ANCRES — ce sont les points où les deux histoires se
     rejoignent encore. Entre deux ancres, on compare les trois segments :
       · seul un côté a bougé      → on prend ce côté ;
       · les deux ont fait pareil  → on prend l'un des deux ;
       · les deux ont fait autre chose → CONFLIT, et on écrit les marqueurs.
     C'est le diff3 classique. Il ne devine rien : quand il ne sait pas, il le
     DIT, ce qui est exactement le contrat de git. */
  function fusionnerTexte(base, notre, leur, labelNotre, labelLeur) {
    var o = decouper(base), a = decouper(notre), b = decouper(leur);
    var blocs = decouperEnBlocs(o, a, b);
    blocs = recoller(blocs, a, b);

    /* Les marqueurs prennent la fin de ligne DOMINANTE du fichier : dans un
       fichier en CRLF, git n'écrit pas ses marqueurs en LF. */
    var fin = finDeLigneDominante(a.concat(b));
    var sortie = [], conflit = false;
    for (var i = 0; i < blocs.length; i++) {
      var bl = blocs[i];
      if (bl.type !== "conflit") { sortie = sortie.concat(bl.sortie); continue; }
      conflit = true;
      sortie.push("<<<<<<< " + labelNotre + fin);
      sortie = sortie.concat(terminer(a.slice(bl.aDebut, bl.aFin), fin));
      sortie.push("=======" + fin);
      sortie = sortie.concat(terminer(b.slice(bl.bDebut, bl.bFin), fin));
      sortie.push(">>>>>>> " + labelLeur + fin);
    }
    return { texte: recollerLignes(sortie), conflit: conflit };
  }

  /* Un marqueur doit commencer une ligne : si le segment se termine sans saut
     de ligne, on en ajoute un. Git écrit en plus « \ No newline at end of
     file » ; le bac à sable ne le fait pas — dette assumée, cas rare. */
  function terminer(seg, fin) {
    if (!seg.length) return seg;
    var dernier = seg[seg.length - 1];
    if (dernier.charAt(dernier.length - 1) === "\n") return seg;
    return seg.slice(0, -1).concat([dernier + fin]);
  }

  function finDeLigneDominante(lignes) {
    var crlf = 0, lf = 0;
    for (var i = 0; i < lignes.length; i++) {
      if (lignes[i].slice(-2) === "\r\n") crlf++;
      else if (lignes[i].slice(-1) === "\n") lf++;
    }
    return crlf > lf ? "\r\n" : "\n";
  }

  /* Découpe la fusion en BLOCS : des zones résolues (un seul côté a bougé, ou
     les deux pareil) et des zones en conflit. Chaque bloc retient ses bornes
     dans les trois versions, ce qui permet ensuite d'en recoller deux.
     ⚠️ Quand la base est VIDE (fichier ajouté des deux côtés), il n'y a aucune
     ancre à trouver dedans : on apparie alors NOTRE et LEUR entre eux, sans
     quoi le préfixe et le suffixe communs entraient dans le conflit — ce que
     git ne fait pas. */
  function decouperEnBlocs(o, a, b) {
    var blocs = [];
    if (!o.length) {
      var corr = apparier(a, b);
      var ia = 0, ib = 0;
      for (var k = 0; k <= a.length; k++) {
        var apparie = k < a.length && corr[k] >= 0 && corr[k] >= ib;
        if (k === a.length || apparie) {
          if (k > ia || (apparie ? corr[k] : b.length) > ib) {
            blocs.push(bloc(0, 0, ia, k, ib, apparie ? corr[k] : b.length, a, b, []));
          }
          if (k < a.length) {
            blocs.push({ type: "stable", oDebut: 0, oFin: 0, aDebut: k, aFin: k + 1, bDebut: corr[k], bFin: corr[k] + 1, sortie: [a[k]] });
            ia = k + 1; ib = corr[k] + 1;
          }
        }
      }
      return blocs;
    }

    var ca = apparier(o, a), cb = apparier(o, b);
    var ancres = [];
    for (var i = 0; i < o.length; i++) if (ca[i] >= 0 && cb[i] >= 0) ancres.push(i);
    var io_ = 0, ia2 = 0, ib2 = 0;
    for (var n = 0; n < ancres.length; n++) {
      var pos = ancres[n];
      if (pos > io_ || ca[pos] > ia2 || cb[pos] > ib2) {
        blocs.push(bloc(io_, pos, ia2, ca[pos], ib2, cb[pos], a, b, o));
      }
      blocs.push({ type: "stable", oDebut: pos, oFin: pos + 1, aDebut: ca[pos], aFin: ca[pos] + 1,
        bDebut: cb[pos], bFin: cb[pos] + 1, sortie: [o[pos]] });
      io_ = pos + 1; ia2 = ca[pos] + 1; ib2 = cb[pos] + 1;
    }
    if (io_ < o.length || ia2 < a.length || ib2 < b.length) {
      blocs.push(bloc(io_, o.length, ia2, a.length, ib2, b.length, a, b, o));
    }
    return blocs;
  }

  /* Une zone où quelque chose a bougé : résolue si un seul côté l'a touchée (ou
     si les deux l'ont touchée pareil), en conflit sinon. */
  function bloc(oDebut, oFin, aDebut, aFin, bDebut, bFin, a, b, o) {
    var so = o.slice(oDebut, oFin), sa = a.slice(aDebut, aFin), sb = b.slice(bDebut, bFin);
    var to = recollerLignes(so), ta = recollerLignes(sa), tb = recollerLignes(sb);
    var commun = { oDebut: oDebut, oFin: oFin, aDebut: aDebut, aFin: aFin, bDebut: bDebut, bFin: bFin };
    if (ta === to) { commun.type = "resolu"; commun.sortie = sb; return commun; }
    if (tb === to) { commun.type = "resolu"; commun.sortie = sa; return commun; }
    if (ta === tb) { commun.type = "resolu"; commun.sortie = sa; return commun; }
    commun.type = "conflit";
    commun.sortie = [];
    return commun;
  }

  /* ⚠️ MESURÉ CONTRE GIT : deux zones en conflit séparées par TROIS LIGNES OU
     MOINS n'en font qu'UNE seule chez git — c'est le contexte de xdiff. Le bac à
     sable en rendait deux, avec les lignes communes coincées entre elles ; sur un
     fichier de neuf lignes, l'apprenant voyait trois conflits là où git en
     montre un. Seuil vérifié à 0, 1, 2, 3 (recollés) et 4, 5, 6, 8 (séparés). */
  var CONTEXTE_XDIFF = 3;

  function recoller(blocs, a, b) {
    var out = [];
    for (var i = 0; i < blocs.length; i++) {
      var bl = blocs[i];
      if (bl.type !== "conflit" || !out.length) { out.push(bl); continue; }
      var precedent = null, ecart = 0, k;
      for (k = out.length - 1; k >= 0; k--) {
        if (out[k].type === "conflit") { precedent = k; break; }
        ecart += out[k].aFin - out[k].aDebut;
      }
      if (precedent === null || ecart > CONTEXTE_XDIFF) { out.push(bl); continue; }
      var fusionne = {
        type: "conflit", sortie: [],
        oDebut: out[precedent].oDebut, oFin: bl.oFin,
        aDebut: out[precedent].aDebut, aFin: bl.aFin,
        bDebut: out[precedent].bDebut, bFin: bl.bFin
      };
      out = out.slice(0, precedent);
      out.push(fusionne);
    }
    return out;
  }

  function recollerLignes(lignes) { return lignes.join(""); }

  /* ===========================================================================
     2. L'ÉTAT D'UNE OPÉRATION EN COURS
     Une fusion qui échoue laisse le dépôt DANS UN ÉTAT : des chemins non
     résolus, un second parent en attente, un message pré-rempli. Git range cela
     dans des fichiers (`MERGE_HEAD`, `MERGE_MSG`, `rebase-merge/`) ; ici c'est
     une propriété du dépôt, sérialisée à part pour ne pas toucher au modèle.
     =========================================================================== */

  function etat(depot) {
    if (!depot.etatGit) depot.etatGit = { operation: null, conflits: dico(), message: "", tete: null, labelLeur: null, auteur: null, rebase: null, conflitsInitiaux: [] };
    return depot.etatGit;
  }

  function enConflit(depot) {
    var e = etat(depot);
    for (var c in e.conflits) if (possede(e.conflits, c)) return true;
    return false;
  }

  function cheminsEnConflit(depot) {
    var e = etat(depot), out = [];
    for (var c in e.conflits) if (possede(e.conflits, c)) out.push(c);
    return out.sort(GM.comparerChemins);
  }

  function nettoyerOperation(depot) {
    depot.etatGit = { operation: null, conflits: dico(), message: "", tete: null, labelLeur: null, auteur: null, rebase: null, conflitsInitiaux: [] };
  }

  /* ===========================================================================
     3. OUTILS COMMUNS AUX COMMANDES
     =========================================================================== */

  function abrev(oid) { return oid ? oid.slice(0, 7) : ""; }

  /* Git n'ecrit PAS les chemins non-ASCII tels quels : il les entoure de
     guillemets et echappe chaque octet UTF-8 en octal (`core.quotePath`, actif
     par defaut). « éphéméride.txt » s'affiche donc
     "\303\251ph\303\251m\303\251ride.txt". Mesure faite contre le vrai git —
     ce n'est pas un detail : la moitie des noms de fichiers d'un apprenant
     francophone porte un accent. */
  /* Le format LISIBLE (status long, « create mode ») ne cite pas l'espace :
     seul le format porcelaine le fait. Mesuré des deux côtés. */
  function citerCheminLong(chemin) { return citerChemin(chemin, true); }

  function citerChemin(chemin, tolererEspace) {
    var octets = GM.utf8(chemin), i, o, besoin = false;
    var plancher = tolererEspace ? 0x20 : 0x21;
    for (i = 0; i < octets.length; i++) {
      o = octets[i];
      if (o < plancher || o > 0x7e || o === 0x22 || o === 0x5c) { besoin = true; break; }
    }
    if (!besoin) return chemin;
    var out = '"';
    for (i = 0; i < octets.length; i++) {
      o = octets[i];
      if (o === 0x22) out += '\\"';
      else if (o === 0x5c) out += "\\\\";
      else if (o === 0x0a) out += "\\n";
      else if (o === 0x0d) out += "\\r";
      else if (o === 0x09) out += "\\t";
      else if (o < 0x20 || o > 0x7e) {
        var oct = o.toString(8);
        while (oct.length < 3) oct = "0" + oct;
        out += "\\" + oct;
      } else out += String.fromCharCode(o);
    }
    return out + '"';
  }

  var JOURS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  var MOIS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  /* La date telle que git l'ecrit : « Mon Jan 1 00:00:00 2024 +0000 ». Le calcul
     se fait dans le fuseau DU DEPOT : `Date` du navigateur appliquerait celui de
     la machine, et deux apprenants verraient deux dates pour un meme commit. */
  function formatDateGit(instant, fuseau) {
    fuseau = fuseau || "+0000";
    var signe = fuseau.charAt(0) === "-" ? -1 : 1;
    var decalage = signe * (parseInt(fuseau.slice(1, 3), 10) * 3600 + parseInt(fuseau.slice(3, 5), 10) * 60);
    var d = new Date((instant + decalage) * 1000);
    return JOURS[d.getUTCDay()] + " " + MOIS[d.getUTCMonth()] + " " + d.getUTCDate() + " "
      + deuxChiffres(d.getUTCHours()) + ":" + deuxChiffres(d.getUTCMinutes()) + ":" + deuxChiffres(d.getUTCSeconds())
      + " " + d.getUTCFullYear() + " " + fuseau;
  }

  function deuxChiffres(n) { return n < 10 ? "0" + n : String(n); }

  /* Les options qui MANGENT l'argument suivant. Sans cette liste,
     `git commit -m base` prendrait « base » pour un chemin, et
     `git rebase --onto main` pour une branche à rebaser. */
  var OPTIONS_A_VALEUR = ["-m", "--message", "-n", "--onto", "--mainline", "-C", "--reuse-message"];

  /* CE QUE CHAQUE COMMANDE ACCEPTE.
     Sans cette table, toute option inconnue était jetée en silence et la
     commande AGISSAIT quand même : `git add --zzz f.txt` ajoutait le fichier là
     où git refuse. Une option ignorée est pire qu'une option absente — elle
     enseigne qu'un drapeau existe alors qu'il n'a rien fait.
     `usage` est la première ligne que git affiche ; le bloc complet (dix lignes
     par commande) n'est pas reproduit, et c'est une dette assumée. */
  var SPEC = {
    add: { drapeaux: ["-A", "--all", "-u", "--update", "-n", "--dry-run", "-f", "--force", "-v", "--verbose"],
      valeurs: [], usage: "usage: git add [<options>] [--] <pathspec>..." },
    rm: { drapeaux: ["--cached", "-f", "--force", "-r", "-q", "--quiet", "-n", "--dry-run"],
      valeurs: [], usage: "usage: git rm [<options>] [--] <file>..." },
    commit: { drapeaux: ["--amend", "--allow-empty", "--allow-empty-message", "-a", "--all", "--no-edit", "-q", "--quiet", "-v", "--verbose", "-n", "--no-verify", "-s", "--signoff"],
      valeurs: ["-m", "--message", "-C", "--reuse-message", "--author", "--date"], usage: "usage: git commit [-a | --interactive | --patch] [-s] [-v] [-u[<mode>]] [--amend]" },
    status: { drapeaux: ["--porcelain", "-s", "--short", "-b", "--branch", "-v", "--verbose", "--long", "--depuis-commit", "--amend-vide"],
      valeurs: ["-u", "--untracked-files"], usage: "usage: git status [<options>] [--] [<pathspec>...]" },
    log: { drapeaux: ["--oneline", "--decorate", "--all", "--reverse"],
      valeurs: ["-n", "--max-count"], usage: "usage: git log [<options>] [<revision-range>] [[--] <path>...]" },
    branch: { drapeaux: ["-d", "--delete", "-D", "-m", "--move", "-M", "-a", "--all", "-r", "--remotes", "-v", "--verbose", "-l", "--list", "--show-current", "-f", "--force", "-q", "--quiet"],
      valeurs: [], usage: "usage: git branch [<options>] [-r | -a] [--merged] [--no-merged]" },
    tag: { drapeaux: ["-d", "--delete", "-l", "--list", "-a", "--annotate", "-f", "--force", "-n"],
      valeurs: ["-m", "--message"], usage: "usage: git tag [-a | -s | -u <key-id>] [-f] [-m <msg> | -F <file>] [-e]" },
    checkout: { drapeaux: ["-b", "-B", "-f", "--force", "--detach", "--orphan", "-q", "--quiet", "--ours", "--theirs", "-t", "--track", "--merge"],
      valeurs: [], usage: "usage: git checkout [<options>] <branch>" },
    "switch": { drapeaux: ["-c", "-C", "-f", "--force", "--detach", "--orphan", "-q", "--quiet", "--merge"],
      valeurs: [], usage: "usage: git switch [<options>] [<branch>]" },
    reset: { drapeaux: ["--soft", "--mixed", "--hard", "--merge", "--keep", "-q", "--quiet"],
      valeurs: [], usage: "usage: git reset [--mixed | --soft | --hard | --merge | --keep] [-q] [<commit>]" },
    merge: { drapeaux: ["--no-ff", "--ff", "--ff-only", "--squash", "--abort", "--continue", "--quit", "--no-edit", "--edit", "--allow-unrelated-histories", "-q", "--quiet", "-v", "--verbose"],
      valeurs: ["-m", "--message", "-s", "--strategy", "-X", "--strategy-option"], usage: "usage: git merge [<options>] [<commit>...]" },
    rebase: { drapeaux: ["--continue", "--abort", "--skip", "--quit", "-i", "--interactive", "--no-ff", "--rebase-merges", "-q", "--quiet", "-v", "--verbose"],
      valeurs: ["--onto", "-s", "--strategy", "-X", "--strategy-option"], usage: "usage: git rebase [-i] [options] [--exec <cmd>] [--onto <newbase>]" },
    "cherry-pick": { drapeaux: ["--continue", "--abort", "--skip", "--quit", "-n", "--no-commit", "-x", "-e", "--edit", "--no-edit", "--allow-empty", "--ff"],
      valeurs: ["-m", "--mainline", "-s", "--strategy", "-X", "--strategy-option"], usage: "usage: git cherry-pick [--edit] [-n] [-m <parent-number>] [-s] [-x] [--ff]" },
    revert: { drapeaux: ["--continue", "--abort", "--skip", "--quit", "-n", "--no-commit", "-e", "--edit", "--no-edit"],
      valeurs: ["-m", "--mainline", "-s", "--strategy", "-X", "--strategy-option"], usage: "usage: git revert [--[no-]edit] [-n] [-m <parent-number>] [-s] [-S[<keyid>]] <commit>..." },
    diff: { drapeaux: ["--staged", "--cached", "--name-only", "--name-status", "--stat"],
      valeurs: [], usage: "usage: git diff [<options>] [<commit>] [--] [<path>...]" }
  };

  /* Lit une ligne d'arguments SELON la commande : drapeaux, options à valeur
     (y compris `-m"msg"` et `--message=msg`), arguments libres, et chemins
     après `--`. Les formes courtes groupées sont décomposées : `-am` vaut
     `-a -m`, ce qui est LE raccourci du quotidien et que le bac à sable
     refusait. */
  function analyser(nom, args) {
    var spec = SPEC[nom] || { drapeaux: [], valeurs: [], usage: "usage: git " + nom };
    var r = { drapeaux: dico(), valeurs: dico(), libres: [], chemins: [], inconnue: null, court: false, usage: spec.usage };
    var apres = false;
    for (var i = 0; i < args.length; i++) {
      var a = String(args[i]);
      if (apres) { r.chemins.push(a); continue; }
      if (a === "--") { apres = true; continue; }
      if (a === "-" || a.charAt(0) !== "-") { r.libres.push(a); continue; }
      if (a.indexOf("--") === 0) {
        var eg = a.indexOf("=");
        var cle = eg >= 0 ? a.slice(0, eg) : a;
        if (spec.valeurs.indexOf(cle) >= 0) {
          poserValeur(r, cle, eg >= 0 ? a.slice(eg + 1) : (args[++i] != null ? String(args[i]) : ""));
          continue;
        }
        if (spec.drapeaux.indexOf(cle) >= 0) { r.drapeaux[cle] = true; continue; }
        r.inconnue = cle.slice(2);
        return r;
      }
      var reste = a.slice(1);
      while (reste.length) {
        var lettre = "-" + reste.charAt(0);
        if (spec.valeurs.indexOf(lettre) >= 0) {
          var v = reste.slice(1);
          poserValeur(r, lettre, v.length ? v : (args[++i] != null ? String(args[i]) : ""));
          reste = "";
        } else if (spec.drapeaux.indexOf(lettre) >= 0) {
          r.drapeaux[lettre] = true;
          reste = reste.slice(1);
        } else {
          r.inconnue = reste.charAt(0);
          r.court = true;
          return r;
        }
      }
    }
    return r;
  }

  /* Une option à valeur peut revenir : `git commit -m titre -m corps` assemble
     un message en deux paragraphes, et l'empreinte du commit en dépend. */
  function poserValeur(r, cle, valeur) {
    if (!possede(r.valeurs, cle)) r.valeurs[cle] = [];
    r.valeurs[cle].push(valeur);
  }

  function drapeau(r) {
    for (var i = 1; i < arguments.length; i++) if (r.drapeaux[arguments[i]]) return true;
    return false;
  }

  function valeur(r, court, long) {
    var v = valeurs(r, court, long);
    return v.length ? v[0] : null;
  }

  function valeurs(r, court, long) {
    var out = [];
    if (court && possede(r.valeurs, court)) out = out.concat(r.valeurs[court]);
    if (long && possede(r.valeurs, long)) out = out.concat(r.valeurs[long]);
    return out;
  }

  /* La réponse de git à une option qu'il ne connaît pas : il REFUSE d'agir. */
  function optionInconnue(r) {
    return echec(["error: unknown " + (r.court ? "switch" : "option") + " `" + r.inconnue + "'", r.usage],
      "Cette option n'existe pas (ou n'est pas simulée) : git n'exécute rien plutôt que d'en deviner le sens.");
  }

  function arbreDe(depot, oidCommit) {
    return oidCommit ? depot.lireArbre(depot.lireCommit(oidCommit).arbre) : dico();
  }

  function titreDe(depot, oid) { return depot.lireCommit(oid).titre; }

  function res(ok, sortie, explication, extra) {
    var r = { ok: ok, code: ok ? 0 : 1, sortie: sortie || [], explication: explication || "" };
    if (extra) for (var k in extra) if (possede(extra, k)) r[k] = extra[k];
    return r;
  }

  function echec(sortie, explication, extra) { return res(false, sortie, explication, extra); }

  /* Les fichiers du répertoire de travail qui ne sont pas identiques à l'index :
     ce que `checkout` refuse d'écraser. */
  function modifiesLocalement(depot) {
    var s = depot.statut(), marques = dico(), i;
    for (i = 0; i < s.modifies.length; i++) marques[s.modifies[i]] = "M";
    for (i = 0; i < s.supprimes.length; i++) marques[s.supprimes[i]] = "D";
    for (i = 0; i < s.indexes.length; i++) marques[s.indexes[i].chemin] = s.indexes[i].etat === "supprimé" ? "D" : "M";
    return marques;
  }

  /* Bascule le répertoire de travail et l'index d'un arbre vers un autre — le
     cœur de `checkout` et de `reset --hard`.
     ⚠️ Ce n'est PAS « effacer puis réécrire » : git ne touche qu'aux chemins qui
     changent entre les deux arbres, et REFUSE de basculer si cela devait écraser
     un travail non commité. C'est la différence entre changer de branche et
     perdre son après-midi. */
  function basculer(depot, oidCible, options) {
    options = options || {};
    var courant = arbreDe(depot, depot.oidHEAD());
    var cible = oidCible ? depot.lireArbre(depot.lireCommit(oidCible).arbre) : dico();
    var locaux = modifiesLocalement(depot);
    var chemins = dico(), c;
    for (c in courant) if (possede(courant, c)) chemins[c] = true;
    for (c in cible) if (possede(cible, c)) chemins[c] = true;
    /* ⚠️ UNE BASCULE FORCÉE REMET AUSSI L'INDEX, donc elle doit connaître les
       chemins qui n'existent QUE dans l'index — un fichier ajouté par `git add`
       et jamais commité. Sans eux, `git reset --hard` les laissait sur le disque
       alors que git les efface : mesuré sur trois cas (indexé neuf, indexé puis
       modifié, indexé puis effacé du disque), git les supprime les trois fois.
       Un fichier NON SUIVI, lui, survit — il n'est dans aucun des trois
       ensembles, et c'est ce qui distingue `reset --hard` de `git clean`. */
    if (options.force) {
      for (c in depot.index) if (possede(depot.index, c)) chemins[c] = true;
    }

    var ecrases = [], nonSuivis = [], liste = [];
    for (c in chemins) if (possede(chemins, c)) liste.push(c);
    liste = liste.sort(GM.comparerChemins);

    if (!options.force) {
      for (var i = 0; i < liste.length; i++) {
        c = liste[i];
        var a = possede(courant, c) ? courant[c] : null;
        var b = possede(cible, c) ? cible[c] : null;
        var pareil = (a && b && a.oid === b.oid && a.mode === b.mode) || (!a && !b);
        if (pareil) continue;
        if (possede(locaux, c)) { ecrases.push(c); continue; }
        /* Un fichier non suivi qui existe déjà là où la cible veut écrire. */
        if (!a && b && possede(depot.travail, c) && !possede(depot.index, c)) nonSuivis.push(c);
      }
      if (ecrases.length) return { ok: false, ecrases: ecrases };
      if (nonSuivis.length) return { ok: false, nonSuivis: nonSuivis };
    }

    for (var j = 0; j < liste.length; j++) {
      c = liste[j];
      var av = possede(courant, c) ? courant[c] : null;
      var ap = possede(cible, c) ? cible[c] : null;
      if (av && ap && av.oid === ap.oid && av.mode === ap.mode && !options.force) continue;
      if (!ap) {
        delete depot.index[c];
        if (!options.force || !possede(cible, c)) delete depot.travail[c];
      } else {
        depot.index[c] = { oid: ap.oid, mode: ap.mode };
        if (ap.mode !== MODE_SOUS_MODULE) depot.travail[c] = depot.lireBlob(ap.oid);
      }
    }
    return { ok: true };
  }

  /* Remet l'index sur un arbre sans toucher au répertoire de travail : `reset`
     et `reset --mixed`. */
  function remettreIndex(depot, oidCommit) {
    var cible = oidCommit ? depot.lireArbre(depot.lireCommit(oidCommit).arbre) : dico();
    var neuf = dico();
    for (var c in cible) if (possede(cible, c)) neuf[c] = { oid: cible[c].oid, mode: cible[c].mode };
    depot.index = neuf;
  }

  /* ===========================================================================
     4. LA FUSION À TROIS VOIES, utilisée par merge, rebase, revert, cherry-pick
     Les quatre commandes font LA MÊME CHOSE : appliquer à notre état l'écart
     entre une base et un autre état. Elles ne diffèrent que par ce qu'elles
     choisissent comme base, et par ce qu'elles écrivent ensuite dans le graphe.
     C'est le point que le cours doit faire passer, et c'est pour cela que le
     code ne l'écrit qu'une fois.
     =========================================================================== */

  function fusionnerArbres(depot, oidBase, oidNotre, oidLeur, labelNotre, labelLeur) {
    var base = oidBase ? depot.lireArbre(depot.lireCommit(oidBase).arbre) : dico();
    var notre = arbreDe(depot, oidNotre);
    var leur = arbreDe(depot, oidLeur);

    var chemins = [], vus = dico(), c;
    for (c in base) if (possede(base, c) && !vus[c]) { vus[c] = 1; chemins.push(c); }
    for (c in notre) if (possede(notre, c) && !vus[c]) { vus[c] = 1; chemins.push(c); }
    for (c in leur) if (possede(leur, c) && !vus[c]) { vus[c] = 1; chemins.push(c); }
    chemins.sort(GM.comparerChemins);

    var deplaces = [];          // collisions fichier/dossier écartées sous ~label
    var resultat = dico();      // chemin -> {oid, mode} ou absent si supprimé
    var conflits = dico();
    var contenus = dico();      // chemin -> texte à écrire dans le travail
    var fusionnes = [];         // chemins réellement fusionnés (« Auto-merging »)

    for (var i = 0; i < chemins.length; i++) {
      c = chemins[i];
      var eb = possede(base, c) ? base[c] : null;
      var en = possede(notre, c) ? notre[c] : null;
      var el = possede(leur, c) ? leur[c] : null;
      var idn = en ? en.oid + " " + en.mode : null;
      var idl = el ? el.oid + " " + el.mode : null;
      var idb = eb ? eb.oid + " " + eb.mode : null;

      if (idn === idl) { if (en) resultat[c] = en; continue; }        // identiques des deux côtés
      if (idn === idb) { if (el) resultat[c] = el; continue; }        // seul « leur » a bougé
      if (idl === idb) { if (en) resultat[c] = en; continue; }        // seul « notre » a bougé

      /* Ajouté des deux côtés, avec des contenus différents : il n'y a pas de
         base commune à laquelle se raccrocher. */
      if (!eb && en && el) {
        fusionnes.push(c);
        var g = fusionnerTexte("", depot.lireBlob(en.oid), depot.lireBlob(el.oid), labelNotre, labelLeur);
        contenus[c] = g.texte;
        /* ⚠️ Le conflit était déclaré SANS regarder le résultat : deux versions
           qui se fusionnaient proprement (dont l'une vide) étaient quand même
           annoncées en conflit. */
        if (g.conflit) conflits[c] = { genre: "ajout/ajout", base: null, notre: en, leur: el };
        resultat[c] = { oid: depot.ecrireBlob(g.texte), mode: en.mode };
        continue;
      }

      /* Les deux côtés ont bougé, différemment. */
      if (en && el && en.mode !== MODE_SOUS_MODULE && el.mode !== MODE_SOUS_MODULE) {
        fusionnes.push(c);
        var f = fusionnerTexte(
          eb ? depot.lireBlob(eb.oid) : "",
          depot.lireBlob(en.oid),
          depot.lireBlob(el.oid),
          labelNotre, labelLeur
        );
        contenus[c] = f.texte;
        if (f.conflit || en.mode !== el.mode) {
          conflits[c] = { genre: "contenu", base: eb, notre: en, leur: el };
        }
        resultat[c] = { oid: depot.ecrireBlob(f.texte), mode: en.mode };
        continue;
      }

      /* Modifié d'un côté, supprimé de l'autre : git ne tranche jamais seul. */
      if (eb && (!en || !el)) {
        conflits[c] = { genre: en ? "modifié/supprimé" : "supprimé/modifié", base: eb, notre: en, leur: el };
        var garde = en || el;
        resultat[c] = garde;
        contenus[c] = depot.lireBlob(garde.oid);
        continue;
      }

      if (en) resultat[c] = en; else if (el) resultat[c] = el;
    }

    /* ⚠️ Un chemin ne peut pas être à la fois un fichier et un dossier. Quand la
       fusion aboutit aux deux, git DÉPLACE le nouveau venu sous « <nom>~<côté> »
       et le signale ; le bac à sable fabriquait un arbre que le vrai git refuse. */
    var nomsFichiers = [], cc;
    for (cc in resultat) if (possede(resultat, cc)) nomsFichiers.push(cc);
    for (var f1 = 0; f1 < nomsFichiers.length; f1++) {
      var chef = nomsFichiers[f1];
      for (var f2 = 0; f2 < nomsFichiers.length; f2++) {
        var sous = nomsFichiers[f2];
        if (sous.indexOf(chef + "/") !== 0) continue;
        /* `chef` est un fichier ET le préfixe d'un dossier : celui des deux qui
           n'était pas là avant est écarté. */
        var venuDeLeur = !possede(notre, chef);
        var etiquette = venuDeLeur ? labelLeur : labelNotre;
        var neuf = chef + "~" + etiquette;
        resultat[neuf] = resultat[chef];
        if (possede(contenus, chef)) { contenus[neuf] = contenus[chef]; delete contenus[chef]; }
        if (possede(conflits, chef)) { conflits[neuf] = conflits[chef]; delete conflits[chef]; }
        else conflits[neuf] = { genre: venuDeLeur ? "ajout/leur" : "ajout/notre", base: null,
          notre: venuDeLeur ? null : resultat[neuf], leur: venuDeLeur ? resultat[neuf] : null };
        var rangF = fusionnes.indexOf(chef);
        if (rangF >= 0) fusionnes[rangF] = neuf;
        delete resultat[chef];
        deplaces.push({ de: chef, vers: neuf, cote: etiquette });
        break;
      }
    }

    return { arbre: resultat, conflits: conflits, contenus: contenus, deplaces: deplaces,
      fusionnes: fusionnes.sort(GM.comparerChemins) };
  }

  /* Les chemins qu'une fusion CHANGE réellement — ceux où le résultat diffère de
     l'état actuel de HEAD. Tout le reste ne doit pas être touché. */
  function cheminsTouches(depot, fusion) {
    var courant = arbreDe(depot, depot.oidHEAD());
    var touches = [], vus = dico(), c;
    for (c in fusion.arbre) {
      if (!possede(fusion.arbre, c) || vus[c]) continue;
      var a = possede(courant, c) ? courant[c] : null;
      var b = fusion.arbre[c];
      if (!a || a.oid !== b.oid || a.mode !== b.mode) { vus[c] = 1; touches.push(c); }
    }
    for (c in courant) {
      if (!possede(courant, c) || vus[c]) continue;
      if (!possede(fusion.arbre, c)) { vus[c] = 1; touches.push(c); }   // supprimé par la fusion
    }
    return touches.sort(GM.comparerChemins);
  }

  /* Ce qu'une fusion écraserait : un travail non commité sur un chemin qu'elle
     touche, ou un fichier non suivi qui porte le nom d'un fichier qu'elle
     apporte. Git s'arrête AVANT de faire des dégâts ; le bac à sable le faisait
     silencieusement — la faute la plus grave trouvée par la contradiction. */
  function obstacles(depot, fusion) {
    var touches = cheminsTouches(depot, fusion);
    var locaux = modifiesLocalement(depot);
    var courant = arbreDe(depot, depot.oidHEAD());
    var ecrases = [], nonSuivis = [];
    for (var i = 0; i < touches.length; i++) {
      var c = touches[i];
      if (possede(locaux, c)) { ecrases.push(c); continue; }
      if (!possede(courant, c) && possede(depot.travail, c) && !possede(depot.index, c)) nonSuivis.push(c);
    }
    return { ecrases: ecrases, nonSuivis: nonSuivis, touches: touches };
  }

  /* Applique le résultat d'une fusion à l'index et au répertoire de travail —
     UNIQUEMENT sur les chemins qu'elle touche. */
  function poser(depot, fusion) {
    var touches = cheminsTouches(depot, fusion);
    for (var i = 0; i < touches.length; i++) {
      var c = touches[i];
      if (!possede(fusion.arbre, c)) {
        delete depot.index[c];
        delete depot.travail[c];
        continue;
      }
      var e = fusion.arbre[c];
      depot.index[c] = { oid: e.oid, mode: e.mode };
      if (e.mode === MODE_SOUS_MODULE) continue;
      depot.travail[c] = possede(fusion.contenus, c) ? fusion.contenus[c] : depot.lireBlob(e.oid);
    }
    /* Les chemins en conflit sont réécrits même s'ils étaient déjà à cette
       valeur : ce sont les marqueurs que l'apprenant doit voir. */
    for (var c2 in fusion.contenus) {
      if (!possede(fusion.contenus, c2)) continue;
      if (possede(fusion.conflits, c2)) depot.travail[c2] = fusion.contenus[c2];
    }
  }

  /* La statistique de `git commit`/`git merge` : « N files changed, … ». */
  function statistiques(depot, oidArbreAvant, oidArbreApres) {
    var avant = oidArbreAvant ? depot.lireArbre(oidArbreAvant) : dico();
    var apres = oidArbreApres ? depot.lireArbre(oidArbreApres) : dico();
    var chemins = [], vus = dico(), c;
    for (c in avant) if (possede(avant, c) && !vus[c]) { vus[c] = 1; chemins.push(c); }
    for (c in apres) if (possede(apres, c) && !vus[c]) { vus[c] = 1; chemins.push(c); }
    chemins.sort(GM.comparerChemins);
    var fichiers = 0, ajouts = 0, retraits = 0, crees = [], supprimes = [], detail = [];
    for (var i = 0; i < chemins.length; i++) {
      c = chemins[i];
      var a = possede(avant, c) ? avant[c] : null;
      var b = possede(apres, c) ? apres[c] : null;
      if (a && b && a.oid === b.oid && a.mode === b.mode) continue;
      fichiers++;
      var ta = a && a.mode !== MODE_SOUS_MODULE ? depot.lireBlob(a.oid) : "";
      var tb = b && b.mode !== MODE_SOUS_MODULE ? depot.lireBlob(b.oid) : "";
      var d = compterDiff(ta, tb);
      ajouts += d.ajouts; retraits += d.retraits;
      if (!a) crees.push({ chemin: c, mode: b.mode });
      if (!b) supprimes.push({ chemin: c, mode: a.mode });
      detail.push({ chemin: c, ajouts: d.ajouts, retraits: d.retraits });
    }
    return { fichiers: fichiers, ajouts: ajouts, retraits: retraits, crees: crees, supprimes: supprimes, detail: detail };
  }

  /* Le tableau que git dessine sous une fusion :
         commun.txt | 2 +-
         sujet.txt  | 1 +
     Les noms sont alignés à gauche, les nombres à droite, et les signes
     comptent les lignes ajoutées puis retirées. Sans échelle : git rétrécit le
     graphe au-delà de 80 colonnes, le bac à sable ne le fait pas (dette
     assumée, un exercice n'écrit pas des diffs de cette taille). */
  function lignesDetail(stat) {
    if (!stat.detail.length) return [];
    var largeurNom = 0, largeurNombre = 0, i;
    for (i = 0; i < stat.detail.length; i++) {
      var d = stat.detail[i];
      if (d.chemin.length > largeurNom) largeurNom = d.chemin.length;
      var n = String(d.ajouts + d.retraits);
      if (n.length > largeurNombre) largeurNombre = n.length;
    }
    var out = [];
    for (i = 0; i < stat.detail.length; i++) {
      var e = stat.detail[i];
      var nom = e.chemin;
      while (nom.length < largeurNom) nom += " ";
      var total = String(e.ajouts + e.retraits);
      while (total.length < largeurNombre) total = " " + total;
      var signes = "";
      for (var k = 0; k < e.ajouts; k++) signes += "+";
      for (var j = 0; j < e.retraits; j++) signes += "-";
      out.push(" " + nom + " | " + total + (signes ? " " + signes : ""));
    }
    return out;
  }

  /* ⚠️ `git commit` n'affiche PAS le tableau par fichier — seul `git merge` le
     fait. La première version le mettait partout : le vérificateur l'a signalé
     sur 15 commits d'affilée. */
  function lignesStat(stat, avecDetail) {
    if (!stat.fichiers) return [];
    var bouts = [stat.fichiers + " file" + (stat.fichiers > 1 ? "s" : "") + " changed"];
    /* Règle de git : un compteur nul est tu, SAUF quand les deux le sont — un
       fichier vide créé s'annonce « 0 insertions(+), 0 deletions(-) ». */
    var rien = !stat.ajouts && !stat.retraits;
    if (stat.ajouts || rien) bouts.push(stat.ajouts + " insertion" + (stat.ajouts === 1 ? "" : "s") + "(+)");
    if (stat.retraits || rien) bouts.push(stat.retraits + " deletion" + (stat.retraits === 1 ? "" : "s") + "(-)");
    var out = (avecDetail ? lignesDetail(stat) : []).concat([" " + bouts.join(", ")]);
    /* Les créations et les suppressions sont TRIÉES ENSEMBLE, par chemin : git
       ne fait pas deux groupes. */
    var modes = [], i;
    for (i = 0; i < stat.crees.length; i++) modes.push({ chemin: stat.crees[i].chemin, ligne: " create mode " + stat.crees[i].mode + " " + citerCheminLong(stat.crees[i].chemin) });
    for (i = 0; i < stat.supprimes.length; i++) modes.push({ chemin: stat.supprimes[i].chemin, ligne: " delete mode " + stat.supprimes[i].mode + " " + citerCheminLong(stat.supprimes[i].chemin) });
    modes.sort(function (x, y) { return GM.comparerChemins(x.chemin, y.chemin); });
    for (i = 0; i < modes.length; i++) out.push(modes[i].ligne);
    return out;
  }

  /* ===========================================================================
     5. LES COMMANDES
     =========================================================================== */

  var C = {};

  /* --- add ------------------------------------------------------------------
     Copie le contenu du répertoire de travail dans l'index. `git add .` prend
     aussi les SUPPRESSIONS depuis git 2.0 — c'est la source d'étonnement la plus
     fréquente du cours. */
  C.add = function (depot, args) {
    var r = analyser("add", args);
    if (r.inconnue) return optionInconnue(r);
    var cibles = r.libres.concat(r.chemins);
    var tout = drapeau(r, "-A", "--all");
    var suivisSeuls = drapeau(r, "-u", "--update");
    var simulation = drapeau(r, "-n", "--dry-run");
    if (!cibles.length && !tout && !suivisSeuls) {
      return echec(["Nothing specified, nothing added.", "hint: Maybe you wanted to say 'git add .'?"],
        "`git add` ne devine pas : il faut lui dire quoi ajouter (`git add .` pour tout).");
    }
    if ((tout || suivisSeuls) && !cibles.length) cibles = ["."];

    var tete = arbreDe(depot, depot.oidHEAD());
    var liste = [], inconnus = [], i;
    for (i = 0; i < cibles.length; i++) {
      var trouves = etendreChemins(depot, [cibles[i]], tete);
      if (suivisSeuls) {
        trouves = trouves.filter(function (c) { return possede(depot.index, c) || possede(tete, c); });
      }
      if (!trouves.length) {
        if (normaliserMotif(cibles[i]) !== "" && cibles[i].indexOf("*") < 0) inconnus.push(cibles[i]);
        continue;
      }
      for (var k = 0; k < trouves.length; k++) if (liste.indexOf(trouves[k]) < 0) liste.push(trouves[k]);
    }
    /* Git valide TOUS les chemins avant d'en ajouter un seul. */
    if (inconnus.length) {
      return echec(["fatal: pathspec '" + inconnus[0] + "' did not match any files"],
        "Aucun fichier ne porte ce nom : git refuse d'ajouter ce qu'il ne trouve pas.");
    }
    liste = liste.sort(GM.comparerChemins);

    if (simulation) {
      return res(true, liste.map(function (c) { return "add '" + c + "'"; }),
        "Simulation (`-n`) : rien n'a été ajouté à l'index.");
    }
    var e = etat(depot), ajoutes = 0, resolus = [];
    for (i = 0; i < liste.length; i++) {
      var c = liste[i];
      if (possede(e.conflits, c)) { delete e.conflits[c]; resolus.push(c); }
      depot.indexer(c);
      ajoutes++;
    }
    return res(true, [], ajoutes + " chemin(s) copié(s) du répertoire de travail vers l'index."
      + (resolus.length ? " Conflit(s) marqué(s) résolu(s) : " + resolus.join(", ") + "." : ""),
      { chemins: liste, resolus: resolus });
  };

  /* --- rm -------------------------------------------------------------------
     Retire du répertoire de travail ET de l'index d'un seul geste : c'est la
     différence avec un `del` suivi d'un oubli. */
  C.rm = function (depot, args) {
    var r = analyser("rm", args);
    if (r.inconnue) return optionInconnue(r);
    var cache = drapeau(r, "--cached");
    var force = drapeau(r, "-f", "--force");
    var recursif = drapeau(r, "-r");
    var cibles = r.libres.concat(r.chemins);
    if (!cibles.length) return echec(["fatal: No pathspec was given. Which files should I remove?"], "`git rm` attend au moins un chemin.");

    /* ⚠️ Git valide TOUS les chemins avant d'en supprimer un seul. La première
       version supprimait au fil de la boucle : un chemin fautif en fin de ligne
       laissait le dépôt à moitié modifié. */
    var aRetirer = [], i, c;
    for (i = 0; i < cibles.length; i++) {
      var trouves = cheminsDeLIndex(depot, cibles[i]);
      if (!trouves.length) {
        return echec(["fatal: pathspec '" + cibles[i] + "' did not match any files"],
          "Ce chemin n'est pas suivi : `git rm` ne s'applique qu'aux fichiers de l'index.");
      }
      if (!recursif && trouves.indexOf(normaliserMotif(cibles[i])) < 0) {
        return echec(["fatal: not removing '" + cibles[i] + "' recursively without -r"],
          "C'est un dossier : il faut `-r` pour retirer tout ce qu'il contient.");
      }
      for (var k = 0; k < trouves.length; k++) if (aRetirer.indexOf(trouves[k]) < 0) aRetirer.push(trouves[k]);
    }

    /* Git refuse d'effacer un travail non commité, sauf --cached ou -f. */
    var eConf = etat(depot);
    if (!cache && !force) {
      var tete = arbreDe(depot, depot.oidHEAD());
      var modifies = [], indexes = [];
      for (i = 0; i < aRetirer.length; i++) {
        c = aRetirer[i];
        /* Un chemin non fusionné échappe aux contrôles : `git rm` est LA façon
           de résoudre un conflit « modifié d'un côté, supprimé de l'autre ». */
        if (possede(eConf.conflits, c)) continue;
        var dansIndex = possede(depot.index, c) ? depot.index[c] : null;
        var dansTete = possede(tete, c) ? tete[c] : null;
        if (dansIndex && possede(depot.travail, c)
            && GM.Depot.empreinteBlob(depot.travail[c]) !== dansIndex.oid) modifies.push(c);
        else if (dansIndex && dansTete && dansIndex.oid !== dansTete.oid) indexes.push(c);
        else if (dansIndex && !dansTete) indexes.push(c);
      }
      if (modifies.length) {
        return echec(["error: the following file has local modifications:"]
          .concat(modifies.map(function (x) { return "    " + x; }))
          .concat(["(use --cached to keep the file, or -f to force removal)"]),
          "Ce fichier a des modifications non enregistrées : les effacer serait définitif, git demande confirmation.");
      }
      if (indexes.length) {
        return echec(["error: the following file has changes staged in the index:"]
          .concat(indexes.map(function (x) { return "    " + x; }))
          .concat(["(use --cached to keep the file, or -f to force removal)"]),
          "Ce fichier a des changements dans l'index : git refuse de les perdre sans confirmation.");
      }
    }

    for (i = 0; i < aRetirer.length; i++) {
      c = aRetirer[i];
      if (possede(eConf.conflits, c)) delete eConf.conflits[c];
      delete depot.index[c];
      if (!cache) depot.supprimerFichier(c);
    }
    return res(true, aRetirer.map(function (x) { return "rm '" + x + "'"; }),
      cache ? "Retiré de l'index, conservé sur le disque." : "Retiré de l'index ET du répertoire de travail.");
  };

  /* Les chemins de l'index que vise un pathspec : le chemin exact, ou tout ce
     qui est sous ce dossier. */
  function cheminsDeLIndex(depot, motif) {
    var out = [], prefixe = motif.charAt(motif.length - 1) === "/" ? motif : motif + "/";
    for (var c in depot.index) {
      if (!possede(depot.index, c)) continue;
      if (c === motif || c.indexOf(prefixe) === 0 || motif === "." || motif === "") out.push(c);
    }
    return out.sort(GM.comparerChemins);
  }

  /* Les arguments qui suivent le séparateur `--` : ce sont des chemins, même
     s'ils commencent par un tiret. */
  function apresSeparateur(args) {
    var sep = args.indexOf("--");
    return sep >= 0 ? args.slice(sep + 1) : [];
  }

  /* Étend une liste de pathspecs en chemins réels, en s'appuyant sur l'index, le
     répertoire de travail et un arbre de référence. */
  function etendreChemins(depot, motifs, arbre) {
    var out = [], vus = dico(), i, c;
    function ajouter(chemin) { if (!vus[chemin]) { vus[chemin] = 1; out.push(chemin); } }
    for (i = 0; i < motifs.length; i++) {
      var motif = normaliserMotif(motifs[i]);
      var prefixe = motif === "" ? "" : motif + "/";
      var joker = motif.indexOf("*") >= 0 || motif.indexOf("?") >= 0 ? motifVersRegex(motif) : null;
      var sources = [depot.index, depot.travail, arbre || dico()];
      for (var k = 0; k < sources.length; k++) {
        for (c in sources[k]) {
          if (!possede(sources[k], c)) continue;
          if (joker) { if (joker.test(c)) ajouter(c); continue; }
          if (motif === "" || c === motif || c.indexOf(prefixe) === 0) ajouter(c);
        }
      }
    }
    return out.sort(GM.comparerChemins);
  }

  /* Un pathspec à joker : `*` couvre n'importe quoi, y compris les barres —
     c'est le comportement de git, qui n'a pas de shell pour l'étendre. */
  function motifVersRegex(motif) {
    var re = "";
    for (var i = 0; i < motif.length; i++) {
      var ch = motif.charAt(i);
      if (ch === "*") re += ".*";
      else if (ch === "?") re += ".";
      else re += ch.replace(/[.+^${}()|[\]\\]/, "\\$&");
    }
    return new RegExp("^" + re + "$");
  }

  /* `sous/`, `./sous`, `sous/.` et `.` désignent tous quelque chose : git les
     accepte, le bac à sable les refusait. */
  function normaliserMotif(motif) {
    var m = String(motif);
    if (m === "." || m === "./") return "";
    if (m.indexOf("./") === 0) m = m.slice(2);
    if (m.slice(-2) === "/.") m = m.slice(0, -2);
    if (m.charAt(m.length - 1) === "/") m = m.slice(0, -1);
    return m;
  }

  /* --- commit ---------------------------------------------------------------
     Fige l'arbre de l'INDEX — pas du répertoire de travail. La confusion des
     deux est l'erreur numéro un des débutants, et le bac à sable la rend
     visible : ce qui n'a pas été ajouté n'entre pas dans le commit. */
  C.commit = function (depot, args, options) {
    options = options || {};
    var r = analyser("commit", args);
    if (r.inconnue) return optionInconnue(r);
    /* Plusieurs `-m` font plusieurs PARAGRAPHES : `git commit -m titre -m corps`
       écrit « titre\n\ncorps », et l'empreinte du commit en dépend. */
    var morceaux = valeurs(r, "-m", "--message");
    var message = options.message != null ? options.message : (morceaux.length ? morceaux.join("\n\n") : null);
    var amend = drapeau(r, "--amend");
    var permettreVide = drapeau(r, "--allow-empty") || !!options.permettreVide;
    var toutIndexer = drapeau(r, "-a", "--all");
    var cheminsCommit = r.libres.concat(r.chemins);
    var e = etat(depot);

    if (enConflit(depot)) {
      var restants = cheminsEnConflit(depot);
      return echec(
        ["U\t" + restants[0], "error: Committing is not possible because you have unmerged files.",
          "hint: Fix them up in the work tree, and then use 'git add/rm <file>'",
          "hint: as appropriate to mark resolution and make a commit.",
          "fatal: Exiting because of an unresolved conflict."],
        "Il reste " + restants.length + " chemin(s) non résolu(s) : git refuse de figer un état à moitié fusionné.");
    }

    if (toutIndexer) {
      var suivis = depot.cheminsIndex();
      for (var s = 0; s < suivis.length; s++) depot.indexer(suivis[s]);
      var teteA = arbreDe(depot, depot.oidHEAD());
      for (var ct in teteA) if (possede(teteA, ct) && !possede(depot.travail, ct)) delete depot.index[ct];
    }

    var tete = depot.oidHEAD();
    var commitCourant = tete ? depot.lireCommit(tete) : null;
    var parents, auteur = null;

    if (amend) {
      if (!commitCourant) return echec(["fatal: You have nothing to amend."], "Il n'y a pas de commit à corriger.");
      parents = commitCourant.parents;
      auteur = { identite: commitCourant.identite, instant: commitCourant.instant, fuseau: commitCourant.fuseau };
      if (message == null) message = commitCourant.message.replace(/\n+$/, "");
    } else {
      parents = tete ? [tete] : [];
      if (e.operation === "merge" && e.tete) parents = parents.concat([e.tete]);
      if (message == null && e.message) {
        message = e.message;
        /* ⚠️ Git énumère les chemins qui ont été en conflit dans MERGE_MSG.
           `--no-edit` commite ce message TEL QUEL, bloc compris ; sans
           `--no-edit`, l'éditeur le retire. Deux empreintes différentes. */
        if (drapeau(r, "--no-edit") && e.conflitsInitiaux && e.conflitsInitiaux.length) {
          message += "\n\n# Conflicts:\n" + e.conflitsInitiaux.map(function (c) { return "#\t" + c; }).join("\n");
        }
      }
      if (e.auteur) auteur = e.auteur;
    }

    /* ⚠️ `git commit -m ""` est refusé : le test portait sur `null`, or
       `lireOption` rend la chaîne vide — un commit au titre vide passait. */
    if (message == null || (String(message).replace(/\s+/g, "") === "" && !drapeau(r, "--allow-empty-message"))) {
      return echec(["Aborting commit due to empty commit message."], "Un commit sans message n'explique rien : git le refuse.");
    }

    /* `git commit -m "…" <chemin>` fige CE chemin tel qu'il est sur le disque,
       sans passer par l'index et sans le modifier : un commit partiel. */
    var nouvelArbre;
    if (cheminsCommit.length && !amend) {
      var teteP = arbreDe(depot, depot.oidHEAD());
      var plat = dico(), cp;
      for (cp in teteP) if (possede(teteP, cp)) plat[cp] = { oid: teteP[cp].oid, mode: teteP[cp].mode };
      var visesP = etendreChemins(depot, cheminsCommit, teteP);
      if (!visesP.length) {
        return echec(["fatal: pathspec '" + cheminsCommit[0] + "' did not match any files"], "Ce chemin n'existe pas.");
      }
      for (var vp = 0; vp < visesP.length; vp++) {
        var chP = visesP[vp];
        if (possede(depot.travail, chP)) {
          plat[chP] = { oid: depot.ecrireBlob(depot.travail[chP]),
            mode: possede(depot.index, chP) ? depot.index[chP].mode : MODE_FICHIER };
        } else delete plat[chP];
      }
      nouvelArbre = depot.arbreDepuisPlat(plat);
      /* Git enregistre AUSSI ces chemins dans l'index : après le commit partiel,
         ils ne sont plus « modifiés », seuls les autres le restent. */
      for (var vq = 0; vq < visesP.length; vq++) {
        if (possede(plat, visesP[vq])) depot.index[visesP[vq]] = { oid: plat[visesP[vq]].oid, mode: plat[visesP[vq]].mode };
        else delete depot.index[visesP[vq]];
      }
    } else {
      nouvelArbre = depot.ecrireArbre();
    }
    var arbreParent = amend
      ? (parents.length ? depot.lireCommit(parents[0]).arbre : null)
      : (commitCourant ? commitCourant.arbre : null);

    /* Sur un dépôt vierge, `arbreParent` vaut null : sans cette comparaison à
       l'arbre VIDE, `git commit` fabriquait un commit racine sans contenu. */
    var arbreVide = depot.arbreDepuisPlat(dico());
    if (!permettreVide && !amend && e.operation !== "merge"
        && (nouvelArbre === arbreParent || (!arbreParent && nouvelArbre === arbreVide))) {
      var st = C.status(depot, ["--depuis-commit"]);
      return echec(st.sortie, "Rien n'a été ajouté à l'index : il n'y a littéralement rien à figer.");
    }
    /* ⚠️ UN AMENDEMENT QUI VIDERAIT LE COMMIT EST REFUSÉ PAR GIT, et le bac à
       sable l'acceptait : il fabriquait un commit sans aucun changement, ce qui
       enseigne un git qui n'existe pas. Trouvé par `verif-git-scenarios.js` (un
       piège du scénario « annuler un commit partagé » : réécrire le fichier puis
       amender), sur un fichier que 7 030 comparaisons déclaraient vert — faute
       de scénario qui amende un commit jusqu'à le vider.
       ⚠️ La condition porte sur `parents.length` : sur un commit RACINE, `git
       commit --amend` réussit même à contenu identique, puisque l'arbre du
       « parent » n'existe pas. Mesuré des deux côtés, pas déduit. */
    if (!permettreVide && amend && parents.length && nouvelArbre === arbreParent) {
      var stAmend = C.status(depot, ["--amend-vide"]);
      return echec(stAmend.sortie.concat([
        "You asked to amend the most recent commit, but doing so would make",
        "it empty. You can repeat your command with --allow-empty, or you can",
        "remove the commit entirely with \"git reset HEAD^\"."
      ]), "Amender ce commit le rendrait vide : git refuse. Il faudrait « --allow-empty », "
        + "ou retirer le commit avec « git reset HEAD^ ».");
    }

    var instant = depot.instant;
    depot.instant += depot.pasHorloge;
    var oid = depot.creerCommit({
      arbre: nouvelArbre,
      parents: parents,
      message: message,
      identite: auteur ? auteur.identite : depot.identite,
      instant: auteur ? auteur.instant : instant,
      fuseau: auteur ? auteur.fuseau : depot.fuseau,
      committeur: depot.identite,
      instantCommit: instant,
      fuseauCommit: depot.fuseau
    });
    depot.avancerHEAD(oid);

    var etiquette = depot.detachee() ? "detached HEAD" : depot.brancheCourante();
    var marque = (!parents.length && !amend) ? " (root-commit)" : "";
    var titre = String(message).split("\n")[0];
    var sortie = ["[" + etiquette + marque + " " + abrev(oid) + "] " + titre];
    /* La ligne « Date: » n'apparait que quand l'auteur est REPRIS d'un autre
       commit — `--amend`, `cherry-pick`, `revert`. Mesure : un rebase, lui, n'en
       affiche pas, parce qu'il passe la date par l'environnement. */
    if (amend || options.dateInteressante) {
      sortie.push(" Date: " + formatDateGit(auteur ? auteur.instant : instant, auteur ? auteur.fuseau : depot.fuseau));
    }
    var stat = statistiques(depot, arbreParent, nouvelArbre);
    /* Un commit de fusion n'affiche pas de tableau : le « diff » d'une fusion
       n'a pas de sens face a un seul parent. */
    if (parents.length < 2) sortie = sortie.concat(lignesStat(stat));

    var etaitFusion = e.operation === "merge";
    /* ⚠️ Un `git commit` pendant un REBASAGE interrompu ne l'annule pas : git
       garde la liste des commits restants. Seules la fusion, le cherry-pick et
       le revert sont CONCLUS par un commit. */
    if (e.operation === "merge" || e.operation === "cherry-pick" || e.operation === "revert") {
      nettoyerOperation(depot);
    } else {
      if (e.operation === "rebase" && e.rebase) e.rebase.edition = true;
      e.auteur = null;
      e.message = "";
    }
    return res(true, sortie,
      (amend ? "Le commit précédent a été REMPLACÉ : nouvelle empreinte " + abrev(oid) + ", l'ancien n'est plus accessible."
        : etaitFusion ? "Commit de fusion créé : il a DEUX parents."
          : "Commit " + abrev(oid) + " créé ; la branche courante avance dessus."),
      { oid: oid, stat: stat });
  };

  /* --- status ---------------------------------------------------------------
     Trois zones comparées deux à deux. La sortie reproduit celle de git, y
     compris ses conseils entre parenthèses : ce sont eux que l'apprenant lira. */
  C.status = function (depot, args) {
    var rr = analyser("status", args);
    if (rr.inconnue) return optionInconnue(rr);
    var porcelaine = drapeau(rr, "--porcelain", "-s", "--short");
    var s = depot.statut();
    var e = etat(depot);
    var conflits = cheminsEnConflit(depot);
    var conflitVu = dico();
    for (var q = 0; q < conflits.length; q++) conflitVu[conflits[q]] = true;
    var nonSuivis = replierNonSuivis(depot, s.nonSuivis);

    if (porcelaine) return res(true, porcelaineLignes(depot, s, e, nonSuivis), "Format court, celui que lisent les scripts.");

    var tete = depot.oidHEAD();
    var entete = [depot.detachee() ? "HEAD detached " + depuisOuDe(depot, tete) : "On branch " + depot.brancheCourante()];
    /* Une ligne vide separe les sections — mais PAS l'en-tete de la premiere,
       sauf quand un bloc d'information s'intercale (« No commits yet », une
       fusion en cours). Mesure faite contre le vrai git : c'est la seule regle
       qui rend les trois cas identiques. */
    var doitSeparer = false;
    if (!tete) { entete.push("", args.indexOf("--depuis-commit") >= 0 ? "Initial commit" : "No commits yet"); doitSeparer = true; }
    if (e.operation === "merge") {
      doitSeparer = true;
      if (conflits.length) {
        entete.push("You have unmerged paths.");
        entete.push('  (fix conflicts and run "git commit")');
        entete.push('  (use "git merge --abort" to abort the merge)');
      } else {
        entete.push("All conflicts fixed but you are still merging.");
        entete.push('  (use "git commit" to conclude merge)');
      }
    } else if (e.operation === "cherry-pick" || e.operation === "revert") {
      doitSeparer = true;
      var verbe = e.operation === "revert" ? "reverting" : "cherry-picking";
      entete.push("You are currently " + verbe + " commit " + abrev(e.tete) + ".");
      entete.push(conflits.length
        ? '  (fix conflicts and run "git ' + e.operation + ' --continue")'
        : '  (all conflicts fixed: run "git ' + e.operation + ' --continue")');
      entete.push('  (use "git ' + e.operation + ' --skip" to skip this patch)');
      entete.push('  (use "git ' + e.operation + ' --abort" to cancel the ' + e.operation + ' operation)');
    } else if (e.operation === "rebase") {
      /* Le rebasage remplace l'en-tete de branche par l'etat de sa LISTE DE
         COMMANDES : c'est la seule facon de savoir ou l'on en est. */
      entete = enteteRebase(depot, e, conflits.length);
      doitSeparer = true;
    }

    /* Les sections sont separees par UNE ligne vide, et il n'y en a pas apres
       l'en-tete : `git status` est lu tous les jours par l'apprenant, une ligne
       vide en trop se voit. */
    var sections = [], i;
    var indexes = s.indexes.filter(function (x) { return !conflitVu[x.chemin]; });
    /* ⚠️ Pendant un `--amend`, git compare l'index au PARENT du commit, pas à
       HEAD. Dans le seul cas où ce drapeau interne est employé — l'amendement
       qui viderait le commit — l'index est par définition identique à l'arbre du
       parent : il n'y a donc rien « to be committed », et git n'affiche pas la
       section. Mesuré : le bac à sable la posait, git non. */
    if (args.indexOf("--amend-vide") >= 0) indexes = [];
    if (indexes.length) {
      /* Pendant une fusion, git n'affiche PAS le conseil « unstage » : dé-indexer
         au milieu d'une fusion n'aurait pas de sens. */
      var sec = ["Changes to be committed:"];
      if (e.operation !== "merge" && e.operation !== "cherry-pick") {
        sec.push(tete ? '  (use "git restore --staged <file>..." to unstage)' : '  (use "git rm --cached <file>..." to unstage)');
      }
      for (i = 0; i < indexes.length; i++) sec.push("\t" + libelleIndex(indexes[i].etat) + citerCheminLong(indexes[i].chemin));
      sections.push(sec);
    }

    if (conflits.length) {
      var secU = ["Unmerged paths:"];
      /* Mesuré, et impossible à deviner : le conseil « restore --staged »
         apparaît pendant un rebasage et un revert, PAS pendant une fusion ni un
         cherry-pick. */
      if (e.operation !== "merge" && e.operation !== "cherry-pick") {
        secU.push('  (use "git restore --staged <file>..." to unstage)');
      }
      /* Et dès qu'une SUPPRESSION est en jeu, c'est « add/rm … as appropriate ». */
      var avecSup = false;
      for (i = 0; i < conflits.length; i++) {
        var g = e.conflits[conflits[i]].genre;
        if (g === "modifié/supprimé" || g === "supprimé/modifié" || g === "supprimé/supprimé") avecSup = true;
      }
      secU.push(avecSup
        ? '  (use "git add/rm <file>..." as appropriate to mark resolution)'
        : '  (use "git add <file>..." to mark resolution)');
      for (i = 0; i < conflits.length; i++) secU.push("\t" + libelleConflit(e.conflits[conflits[i]].genre) + citerCheminLong(conflits[i]));
      sections.push(secU);
    }

    var pasIndexes = [];
    for (i = 0; i < s.modifies.length; i++) if (!conflitVu[s.modifies[i]]) pasIndexes.push({ chemin: s.modifies[i], etat: "modifié" });
    for (i = 0; i < s.supprimes.length; i++) if (!conflitVu[s.supprimes[i]]) pasIndexes.push({ chemin: s.supprimes[i], etat: "supprimé" });
    pasIndexes.sort(function (a, b) { return GM.comparerChemins(a.chemin, b.chemin); });
    if (pasIndexes.length) {
      /* `add/rm` seulement s'il y a une SUPPRESSION a enregistrer : git adapte
         son conseil, et c'est un detail que seul un aller-retour avec le vrai
         git fait apparaitre. */
      var avecSuppression = false;
      for (i = 0; i < pasIndexes.length; i++) if (pasIndexes[i].etat === "supprimé") avecSuppression = true;
      var secM = ["Changes not staged for commit:",
        '  (use "git add' + (avecSuppression ? "/rm" : "") + ' <file>..." to update what will be committed)',
        '  (use "git restore <file>..." to discard changes in working directory)'];
      for (i = 0; i < pasIndexes.length; i++) secM.push("\t" + libelleIndex(pasIndexes[i].etat) + citerCheminLong(pasIndexes[i].chemin));
      sections.push(secM);
    }

    if (nonSuivis.length) {
      var secN = ["Untracked files:", '  (use "git add <file>..." to include in what will be committed)'];
      for (i = 0; i < nonSuivis.length; i++) secN.push("\t" + citerCheminLong(nonSuivis[i]));
      sections.push(secN);
    }

    var conclusion = null;
    /* ⚠️ `--amend-vide` est un drapeau INTERNE, jamais tapé par personne : c'est
       `git commit --amend` qui s'en sert pour refuser un amendement qui rendrait
       le commit vide. Git y remplace sa conclusion habituelle par « No changes »
       — et garde les sections. Mesuré des deux côtés le 2026-08-26. */
    if (args.indexOf("--amend-vide") >= 0) conclusion = "No changes";
    else if (indexes.length) conclusion = null;   /* quelque chose est prêt : git ne conclut rien */
    else if (conflits.length || pasIndexes.length) conclusion = 'no changes added to commit (use "git add" and/or "git commit -a")';
    else if (nonSuivis.length) conclusion = 'nothing added to commit but untracked files present (use "git add" to track)';
    else if (!tete) conclusion = 'nothing to commit (create/copy files and use "git add" to track)';
    else if (e.operation === "merge") conclusion = null;
    else conclusion = "nothing to commit, working tree clean";

    var out = entete.slice();
    for (i = 0; i < sections.length; i++) {
      if (doitSeparer) out.push("");
      out = out.concat(sections[i]);
      doitSeparer = true;
    }
    if (conclusion) { if (doitSeparer) out.push(""); out.push(conclusion); }

    return res(true, out, "Les trois zones : ce qui est figé, ce qui ne l'est pas, ce qui n'est pas suivi.");
  };

  /* Git dit « detached AT » tant que HEAD est resté sur le commit où on l'a
     détaché, et « detached FROM » dès qu'on a commité depuis — l'empreinte
     citée reste celle du POINT DE DÉTACHEMENT. La nuance dit à l'apprenant s'il
     a fabriqué, ou non, des commits que rien ne retient. */
  function depuisOuDe(depot, tete) {
    var d = depot.detacheDepuis;
    if (!d) return "at " + abrev(tete);
    if (typeof d === "string") return "at " + d;
    return (d.oid === tete ? "at " : "from ") + d.nom;
  }

  /* Ce que `git status` affiche pendant un rebasage — mesure contre le vrai git,
     y compris le « # » qui prefixe le titre dans la liste des commandes. */
  function enteteRebase(depot, e, nbConflits) {
    var r = e.rebase || { restants: [], faits: [], surQuoi: null, branche: null };
    var faits = r.faits || [];
    var out = ["interactive rebase in progress; onto " + abrev(r.surQuoi)];
    if (faits.length) {
      out.push("Last command" + (faits.length > 1 ? "s" : "") + " done (" + faits.length
        + " command" + (faits.length > 1 ? "s" : "") + " done):");
      /* Git n'affiche que les DEUX dernières et renvoie au fichier pour le reste. */
      var montres = faits.slice(-2);
      for (var f = 0; f < montres.length; f++) {
        out.push("   pick " + abrev(montres[f]) + " # " + depot.lireCommit(montres[f]).titre);
      }
      if (faits.length > montres.length) out.push("  (see more in file .git/rebase-merge/done)");
    }
    if (r.restants.length) {
      out.push("Next command" + (r.restants.length > 1 ? "s" : "") + " to do (" + r.restants.length
        + " remaining command" + (r.restants.length > 1 ? "s" : "") + "):");
      for (var i = 0; i < r.restants.length; i++) {
        out.push("   pick " + abrev(r.restants[i]) + " # " + depot.lireCommit(r.restants[i]).titre);
      }
      out.push('  (use "git rebase --edit-todo" to view and edit)');
    } else {
      out.push("No commands remaining.");
    }
    /* En tête détachée il n'y a pas de branche à nommer : git écrit une phrase
       plus courte, là où le bac à sable affichait le mot « null ». */
    if (r.edition) {
      /* Un `git commit` posé à la main au milieu d'un rebasage : git ne parle
         plus de conflits mais d'une édition en cours. */
      out.push("You are currently editing a commit while rebasing branch '" + r.branche + "' on '" + abrev(r.surQuoi) + "'.");
      out.push('  (use "git commit --amend" to amend the current commit)');
      out.push('  (use "git rebase --continue" once you are satisfied with your changes)');
      return out;
    }
    out.push(r.branche
      ? "You are currently rebasing branch '" + r.branche + "' on '" + abrev(r.surQuoi) + "'."
      : "You are currently rebasing.");
    if (nbConflits) {
      out.push('  (fix conflicts and then run "git rebase --continue")');
      out.push('  (use "git rebase --skip" to skip this patch)');
      out.push('  (use "git rebase --abort" to check out the original branch)');
    } else {
      out.push('  (all conflicts fixed: run "git rebase --continue")');
    }
    return out;
  }

  /* Git ne liste pas les fichiers non suivis un par un quand TOUT un dossier est
     inconnu de lui : il ecrit « lib/ ». Le modele, lui, ne connait que des
     chemins de fichiers (dette assumee en D1, « comme -uall ») ; le repli se
     fait donc ici, la ou il se voit. */
  function replierNonSuivis(depot, chemins) {
    var suivis = dico(), c, i;
    for (c in depot.index) if (possede(depot.index, c)) suivis[c] = true;
    var tete = arbreDe(depot, depot.oidHEAD());
    for (c in tete) if (possede(tete, c)) suivis[c] = true;

    /* Un dossier est repliable si aucun chemin suivi ne commence par lui. */
    function repliable(dossier) {
      var prefixe = dossier + "/";
      for (var k in suivis) if (possede(suivis, k) && k.indexOf(prefixe) === 0) return false;
      return true;
    }

    var out = [], vus = dico();
    for (i = 0; i < chemins.length; i++) {
      var morceaux = chemins[i].split("/");
      var garde = chemins[i];
      for (var n = 1; n < morceaux.length; n++) {
        var candidat = morceaux.slice(0, n).join("/");
        if (repliable(candidat)) { garde = candidat + "/"; break; }
      }
      if (!vus[garde]) { vus[garde] = true; out.push(garde); }
    }
    return out;
  }

  function libelleIndex(etatChemin) {
    if (etatChemin === "nouveau") return "new file:   ";
    if (etatChemin === "supprimé") return "deleted:    ";
    if (etatChemin === "type") return "typechange: ";
    return "modified:   ";
  }

  function libelleConflit(genre) {
    if (genre === "ajout/ajout") return "both added:      ";
    if (genre === "ajout/leur") return "added by them:   ";
    if (genre === "ajout/notre") return "added by us:     ";
    if (genre === "modifié/supprimé") return "deleted by them: ";
    if (genre === "supprimé/modifié") return "deleted by us:   ";
    return "both modified:   ";
  }

  function porcelaineLignes(depot, s, e, nonSuivis) {
    var lignes = [], vus = dico(), i, c;
    var conflits = cheminsEnConflit(depot);
    var carteIndex = dico(), carteTravail = dico();
    for (i = 0; i < s.indexes.length; i++) carteIndex[s.indexes[i].chemin] = codeEtat(s.indexes[i].etat);
    for (i = 0; i < s.modifies.length; i++) carteTravail[s.modifies[i]] = "M";
    for (i = 0; i < s.supprimes.length; i++) carteTravail[s.supprimes[i]] = "D";
    var tous = [];
    for (c in carteIndex) if (possede(carteIndex, c) && !vus[c]) { vus[c] = 1; tous.push(c); }
    for (c in carteTravail) if (possede(carteTravail, c) && !vus[c]) { vus[c] = 1; tous.push(c); }
    for (i = 0; i < conflits.length; i++) if (!vus[conflits[i]]) { vus[conflits[i]] = 1; tous.push(conflits[i]); }
    tous.sort(GM.comparerChemins);
    /* ⚠️ Git tient DEUX listes : les changements d'abord, les fichiers non suivis
       ensuite — pas un seul tri global. Sans cela « ?? lib/ » remontait avant
       « M notes.txt ». Vu par la comparaison de la SORTIE, pas par celle du
       statut, que l'outil triait des deux côtés : trier avant de comparer cache
       exactement ce genre de faute. */
    tous = tous.concat(nonSuivis.slice().sort(GM.comparerChemins));
    var dejaSorti = dico();
    for (i = 0; i < tous.length; i++) {
      c = tous[i];
      if (e.conflits && possede(e.conflits, c)) { lignes.push(codeConflit(e.conflits[c].genre) + " " + citerChemin(c)); continue; }
      /* ⚠️ Un chemin retiré de l'index mais resté sur le disque sort DEUX fois :
         « D  » pour l'index, « ?? » pour le fichier devenu inconnu de git. */
      if (possede(carteIndex, c) && !dejaSorti[c]) {
        lignes.push(carteIndex[c] + (possede(carteTravail, c) ? carteTravail[c] : " ") + " " + citerChemin(c));
        dejaSorti[c] = 1;
        if (nonSuivis.indexOf(c) < 0) continue;
        continue;
      }
      if (nonSuivis.indexOf(c) >= 0) { lignes.push("?? " + citerChemin(c)); continue; }
      if (dejaSorti[c]) continue;
      lignes.push(" " + (possede(carteTravail, c) ? carteTravail[c] : " ") + " " + citerChemin(c));
    }
    return lignes;
  }

  function codeEtat(etatChemin) {
    if (etatChemin === "nouveau") return "A";
    if (etatChemin === "supprimé") return "D";
    if (etatChemin === "type") return "T";
    return "M";
  }

  function codeConflit(genre) {
    if (genre === "ajout/ajout") return "AA";
    if (genre === "ajout/leur") return "UA";
    if (genre === "ajout/notre") return "AU";
    if (genre === "modifié/supprimé") return "UD";
    if (genre === "supprimé/modifié") return "DU";
    return "UU";
  }

  /* --- log ------------------------------------------------------------------ */
  C.log = function (depot, args) {
    var r = analyser("log", args);
    /* `git log -3` : un nombre collé au tiret, que l'analyseur voit comme une
       option courte inconnue. */
    if (r.inconnue && /^\d+$/.test(r.inconnue)) {
      var n = /-(\d+)/.exec(args.join(" "));
      r = analyser("log", args.filter(function (a) { return !/^-\d+$/.test(a); }));
      if (n) poserValeur(r, "-n", n[1]);
    }
    if (r.inconnue) {
      return echec(["fatal: unrecognized argument: -" + (r.court ? "" : "-") + r.inconnue],
        "Cette option de `git log` n'est pas simulée.");
    }
    var uneLigne = drapeau(r, "--oneline");
    var brut = valeur(r, "-n", "--max-count");
    var limite = brut ? parseInt(brut, 10) : null;
    var depart = r.libres.length ? r.libres[0] : null;
    var filtres = r.chemins;

    if (depart) {
      var oidDepart = depot.resoudre(depart);
      if (!oidDepart) {
        return echec(["fatal: ambiguous argument '" + depart + "': unknown revision or path not in the working tree.",
          "Use '--' to separate paths from revisions, like this:",
          "'git <command> [<revision>...] -- [<file>...]'"],
          "Ni révision ni chemin connu : git refuse de deviner.");
      }
    } else if (!depot.oidHEAD()) {
      return echec(["fatal: your current branch '" + depot.brancheCourante() + "' does not have any commits yet"],
        "Il n'y a aucun commit à afficher.");
    }

    var commits = depot.journal(depart, filtres.length ? null : limite);
    /* `git log -- <chemin>` ne garde que les commits qui ONT CHANGÉ ce chemin.
       Sans ce filtre, le bac à sable montrait toute l'histoire et l'apprenant
       en concluait que l'option ne servait à rien. */
    if (filtres.length) {
      commits = commits.filter(function (c) {
        var parent = c.parents.length ? depot.lireCommit(c.parents[0]).arbre : null;
        var change = depot.diffArbres(parent, c.arbre);
        for (var k = 0; k < change.length; k++) {
          for (var f = 0; f < filtres.length; f++) {
            var motif = normaliserMotif(filtres[f]);
            if (change[k].chemin === motif || (motif && change[k].chemin.indexOf(motif + "/") === 0)) return true;
          }
        }
        return false;
      });
      if (limite) commits = commits.slice(0, limite);
    }

    var out = [];
    for (var j2 = 0; j2 < commits.length; j2++) {
      var c2 = commits[j2];
      if (uneLigne) { out.push(abrev(c2.oid) + " " + c2.titre); continue; }
      out.push("commit " + c2.oid);
      if (c2.parents.length > 1) out.push("Merge: " + c2.parents.map(abrev).join(" "));
      out.push("Author: " + c2.identite);
      /* La ligne « Date: » manquait entièrement au format long — trois espaces
         après le deux-points, comme git les écrit. */
      out.push("Date:   " + formatDateGit(c2.instant, c2.fuseau));
      out.push("");
      var lignesMsg = c2.message.replace(/\n+$/, "").split("\n");
      for (var k2 = 0; k2 < lignesMsg.length; k2++) out.push("    " + lignesMsg[k2]);
      out.push("");
    }
    return res(true, out, commits.length + " commit(s) parcouru(s), du plus récent au plus ancien.", { commits: commits });
  };

  /* --- branch ---------------------------------------------------------------
     Une branche est un NOM QUI POINTE SUR UN COMMIT. Rien d'autre : la créer ne
     copie aucun fichier, la supprimer n'efface aucun commit. */
  C.branch = function (depot, args) {
    var r = analyser("branch", args);
    if (r.inconnue) return optionInconnue(r);
    var supprimer = drapeau(r, "-d", "--delete");
    var forcer = drapeau(r, "-D");
    var renommer = drapeau(r, "-m", "--move", "-M");
    var bavard = drapeau(r, "-v", "--verbose");
    var noms = r.libres.concat(r.chemins);
    var i;

    if (drapeau(r, "--show-current")) {
      return res(true, depot.detachee() ? [] : [depot.brancheCourante()], "La branche sur laquelle HEAD est attaché.");
    }

    if (supprimer || forcer) {
      var out = [];
      for (i = 0; i < noms.length; i++) {
        var nom = noms[i], ref = "refs/heads/" + nom;
        var oid = depot.oidDeRef(ref);
        if (!depot.detachee() && depot.brancheCourante() === nom) {
          return echec(["error: cannot delete branch '" + nom + "' used by worktree at '.'"],
            "On ne scie pas la branche sur laquelle on est assis : place-toi ailleurs d'abord.");
        }
        if (!oid) return echec(["error: branch '" + nom + "' not found"], "Cette branche n'existe pas.");
        if (!forcer && !depot.estAncetre(oid, depot.oidHEAD())) {
          return echec(["error: the branch '" + nom + "' is not fully merged"],
            "Ces commits ne sont accessibles que par cette branche : les perdre serait définitif, git demande confirmation.");
        }
        delete depot.refs[ref];
        out.push("Deleted branch " + nom + " (was " + abrev(oid) + ").");
      }
      return res(true, out, "Le NOM disparaît ; les commits, eux, restent dans le magasin d'objets.");
    }

    if (renommer) {
      var ancien = noms.length > 1 ? noms[0] : depot.brancheCourante();
      var neuf = noms.length > 1 ? noms[1] : noms[0];
      if (!neuf) return echec(["fatal: branch name required"], "Il manque le nouveau nom.");
      if (!nomDeBrancheValide(neuf)) {
        return echec(["fatal: '" + neuf + "' is not a valid branch name"], "Ce nom de branche n'est pas licite pour git.");
      }
      var oidA = depot.oidDeRef("refs/heads/" + ancien);
      if (!oidA) return echec(["fatal: no branch named '" + ancien + "'"], "Cette branche n'existe pas.");
      /* ⚠️ Sans ce contrôle, renommer ÉCRASAIT la branche d'arrivée : les commits
         qu'elle seule retenait devenaient inaccessibles, en silence. */
      if (depot.oidDeRef("refs/heads/" + neuf) && !drapeau(r, "-M")) {
        return echec(["fatal: a branch named '" + neuf + "' already exists"], "Ce nom est déjà pris : git refuse d'écraser une branche.");
      }
      depot.majRef("refs/heads/" + neuf, oidA);
      delete depot.refs["refs/heads/" + ancien];
      if (!depot.detachee() && depot.brancheCourante() === ancien) depot.HEAD = { symbolique: "refs/heads/" + neuf, oid: null };
      return res(true, [], "La branche « " + ancien + " » s'appelle désormais « " + neuf + " ».");
    }

    if (!noms.length) {
      var branches = depot.branches(), liste = [];
      /* `-v` ALIGNE les noms sur le plus long : sans cela les empreintes ne
         forment plus une colonne. */
      var largeur = 0;
      for (var l = 0; l < branches.length; l++) if (branches[l].length > largeur) largeur = branches[l].length;
      for (var b = 0; b < branches.length; b++) {
        var courante = !depot.detachee() && branches[b] === depot.brancheCourante();
        var oidB = depot.oidDeRef("refs/heads/" + branches[b]);
        var nomB = branches[b];
        if (bavard) while (nomB.length < largeur) nomB += " ";
        liste.push((courante ? "* " : "  ") + nomB
          + (bavard ? " " + abrev(oidB) + " " + titreDe(depot, oidB) : ""));
      }
      if (depot.detachee()) {
        liste.unshift("* (HEAD detached " + depuisOuDe(depot, depot.oidHEAD()) + ")"
          + (bavard ? " " + abrev(depot.oidHEAD()) + " " + titreDe(depot, depot.oidHEAD()) : ""));
      }
      return res(true, liste, branches.length + " branche(s) ; l'étoile marque celle où HEAD est attaché.");
    }

    var nouveau = noms[0];
    var depart = noms[1] || "HEAD";
    if (!nomDeBrancheValide(nouveau)) {
      return echec(["fatal: '" + nouveau + "' is not a valid branch name"], "Ce nom de branche n'est pas licite pour git.");
    }
    if (depot.oidDeRef("refs/heads/" + nouveau) && !drapeau(r, "-f", "--force")) {
      return echec(["fatal: a branch named '" + nouveau + "' already exists"], "Ce nom est déjà pris.");
    }
    var cible = depot.resoudre(depart);
    if (!cible) {
      return echec(["fatal: not a valid object name: '" + (depot.oidHEAD() ? depart : depot.brancheCourante()) + "'"],
        depot.oidHEAD() ? "Point de départ introuvable." : "Aucun commit n'existe encore : il n'y a rien sur quoi faire pointer une branche.");
    }
    depot.majRef("refs/heads/" + nouveau, cible);
    return res(true, [], "Une étiquette mobile de plus sur " + abrev(cible) + " — aucun fichier n'a bougé.");
  };

  /* Les règles de `git check-ref-format`, dans ce qu'elles ont d'atteignable
     depuis un bac à sable : pas de « .. », pas d'espace, pas de caractère de
     contrôle, pas de fin en « . » ou « .lock », pas de « @{ ». */
  function nomDeBrancheValide(nom) {
    if (!nom || nom.charAt(0) === "-" || nom.charAt(0) === "/" || nom.charAt(nom.length - 1) === "/") return false;
    if (nom.indexOf("..") >= 0 || nom.indexOf("@{") >= 0 || nom.indexOf("//") >= 0) return false;
    if (/[\s~^:?*\[\\]/.test(nom)) return false;
    if (nom.charAt(nom.length - 1) === "." || nom.slice(-5) === ".lock") return false;
    if (nom === "@" || nom.charAt(0) === ".") return false;
    return true;
  }

  /* --- tag ------------------------------------------------------------------ */
  C.tag = function (depot, args) {
    var r = analyser("tag", args);
    if (r.inconnue) return optionInconnue(r);
    var noms = r.libres.concat(r.chemins);
    if (drapeau(r, "-a", "--annotate")) {
      return echec(["fatal: le bac à sable ne crée que des étiquettes légères (une étiquette annotée est un objet à part)."],
        "Une étiquette ANNOTÉE est un objet du dépôt, avec un auteur et un message ; le bac à sable n'en fabrique pas.");
    }
    if (drapeau(r, "-d", "--delete")) {
      if (!noms.length) return echec(["usage: git tag -d <tagname>..."], "Il manque le nom de l'étiquette.");
      var oidT = depot.oidDeRef("refs/tags/" + noms[0]);
      if (!oidT) return echec(["error: tag '" + noms[0] + "' not found."], "Cette étiquette n'existe pas.");
      delete depot.refs["refs/tags/" + noms[0]];
      return res(true, ["Deleted tag '" + noms[0] + "' (was " + abrev(oidT) + ")"], "Étiquette retirée.");
    }
    /* ⚠️ `git tag -l v*` LISTE ; sans l'option, le bac à sable CRÉAIT une
       étiquette nommée « v* ». */
    if (drapeau(r, "-l", "--list") || !noms.length) {
      var motif = noms.length ? noms[0] : null;
      var toutes = depot.etiquettes();
      if (motif) {
        var re = new RegExp("^" + motif.split("*").map(function (m) {
          return m.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        }).join(".*") + "$");
        toutes = toutes.filter(function (t) { return re.test(t); });
      }
      return res(true, toutes, "Les étiquettes du dépôt.");
    }
    /* ⚠️ `git tag` valide le nom comme `git branch` : `~mauvais^nom`,
       `mauvais nom` et `fin.lock` sont refusés (mesuré contre git 2.54, exit
       128). Cette garde manquait ici alors qu'elle existait pour `branch`,
       `checkout -b` et `switch -c` : le bac à sable dessinait une pastille
       portant un nom que le vrai git n'accepterait jamais. */
    if (!nomDeBrancheValide(noms[0])) {
      return echec(["fatal: '" + noms[0] + "' is not a valid tag name."],
        "Ce nom d'étiquette est interdit : ni espace, ni ~ ^ : ? * [ \\, ni « .. », ni fin en « / », « . » ou « .lock ».");
    }
    if (depot.oidDeRef("refs/tags/" + noms[0]) && !drapeau(r, "-f", "--force")) {
      return echec(["fatal: tag '" + noms[0] + "' already exists"], "Ce nom d'étiquette est déjà pris.");
    }
    var cibleT = depot.resoudre(noms[1] || "HEAD");
    if (!cibleT) return echec(["fatal: Failed to resolve '" + (noms[1] || "HEAD") + "' as a valid ref."], "Cible introuvable.");
    depot.majRef("refs/tags/" + noms[0], cibleT);
    return res(true, [], "Une étiquette FIXE sur " + abrev(cibleT) + " : contrairement à une branche, elle ne suivra pas les commits suivants.");
  };

  /* --- checkout / switch ----------------------------------------------------
     Déplacer HEAD, et REMETTRE le répertoire de travail dans l'état du commit
     visé — sans écraser ce qui n'est pas commité. */
  C.checkout = function (depot, args) {
    var r = analyser(args.__switch ? "switch" : "checkout", args);
    if (r.inconnue) return optionInconnue(r);
    var creer = drapeau(r, "-b", "-B", "-c", "-C");
    var force = drapeau(r, "-f", "--force");
    var detacher = drapeau(r, "--detach");
    var mots = r.libres;
    var fichiers = r.chemins;
    var e = etat(depot);

    if (drapeau(r, "--orphan")) {
      return echec(["fatal: le bac à sable ne sait pas créer de branche orpheline."],
        "Une branche ORPHELINE repart d'une histoire vide ; le bac à sable ne la simule pas.");
    }

    /* ⚠️ Changer de branche avec des chemins non résolus : git refuse, et ce
       n'est PAS pour la raison qu'il donne d'habitude. Le bac à sable parlait de
       « modifications locales », donc enseignait une cause fausse. */
    if (!fichiers.length && !creer && enConflit(depot)) {
      var enCours = cheminsEnConflit(depot);
      return echec([enCours[0] + ": needs merge", "error: you need to resolve your current index first"],
        "Des chemins sont encore en conflit : il faut finir (ou abandonner) l'opération avant de partir ailleurs.");
    }

    /* `git checkout <fichier>` : restaurer depuis l'index — SANS `--`, comme
       tout le monde le tape. Git ne l'accepte que si le nom ne désigne pas
       aussi une branche. */
    var cheminDevine = false;
    if (!fichiers.length && !creer && !detacher && mots.length) {
      var candidats = etendreChemins(depot, [mots[0]], arbreDe(depot, depot.oidHEAD()));
      var estRef = !!depot.oidDeRef("refs/heads/" + mots[0]) || !!depot.oidDeRef("refs/tags/" + mots[0]);
      if (!estRef && candidats.length && !depot.resoudre(mots[0])) {
        fichiers = [mots[0]];
        mots = mots.slice(1);
        cheminDevine = true;
      }
    }

    if (fichiers.length) {
      var source = mots.length ? depot.resoudre(mots[0]) : null;
      if (mots.length && !source) {
        return echec(["error: pathspec '" + mots[0] + "' did not match any file(s) known to git"], "Révision inconnue.");
      }
      var plat = source ? depot.lireArbre(depot.lireCommit(source).arbre) : null;
      var vises = etendreChemins(depot, fichiers, plat || arbreDe(depot, depot.oidHEAD()));
      if (plat) vises = vises.filter(function (c) { return possede(plat, c); });
      else vises = vises.filter(function (c) { return possede(depot.index, c); });
      if (!vises.length) {
        return echec(["error: pathspec '" + fichiers[0] + "' did not match any file(s) known to git"],
          "Ce chemin n'est pas suivi : il n'y a rien à restaurer.");
      }
      var touches = 0;
      for (var f = 0; f < vises.length; f++) {
        var chemin = vises[f];
        if (plat) depot.index[chemin] = { oid: plat[chemin].oid, mode: plat[chemin].mode };
        var neuf = depot.lireBlob(depot.index[chemin].oid);
        /* Git ne compte que ce qu'il a VRAIMENT réécrit. */
        if (depot.lireFichier(chemin) !== neuf) touches++;
        depot.travail[chemin] = neuf;
        if (possede(e.conflits, chemin)) delete e.conflits[chemin];
      }
      /* ⚠️ Mesuré : git n'annonce « Updated N paths » QUE lorsqu'on lui a donné
         le chemin sans `--` — c'est sa façon de dire qu'il a tranché entre une
         révision et un fichier. Avec `--`, il ne dit rien. */
      return res(true, cheminDevine
        ? ["Updated " + touches + " path" + (touches === 1 ? "" : "s") + " from " + (plat ? abrev(source) : "the index")]
        : [],
        "Fichier(s) restauré(s) : les modifications non indexées sont PERDUES, sans confirmation.");
    }

    if (creer) {
      var nom = mots[0];
      if (!nom) return echec(["fatal: switch requires a value"], "Il manque le nom de la branche à créer.");
      if (!nomDeBrancheValide(nom)) {
        return echec(["fatal: '" + nom + "' is not a valid branch name"], "Ce nom de branche n'est pas licite pour git.");
      }
      var depart = mots[1] || "HEAD";
      var cibleC = depot.resoudre(depart);
      var ecraser = drapeau(r, "-B", "-C");
      if (depot.oidDeRef("refs/heads/" + nom) && !ecraser) {
        return echec(["fatal: a branch named '" + nom + "' already exists"], "Ce nom est déjà pris.");
      }
      if (!cibleC && depot.oidHEAD()) return echec(["fatal: not a valid object name: '" + depart + "'"], "Point de départ introuvable.");
      var avant = modifiesLocalement(depot);
      /* ⚠️ Créer la branche AILLEURS qu'à l'endroit courant demande de basculer
         le répertoire de travail : sans cela le bac à sable affichait le contenu
         d'un AUTRE commit que celui sur lequel il disait être. */
      if (cibleC && cibleC !== depot.oidHEAD()) {
        var bascC = basculer(depot, cibleC, {});
        if (!bascC.ok) return refusDeBascule(bascC);
      }
      var existait = !!depot.oidDeRef("refs/heads/" + nom);
      if (cibleC) depot.majRef("refs/heads/" + nom, cibleC);
      memoriserBranche(depot);
      depot.HEAD = { symbolique: "refs/heads/" + nom, oid: null };
      depot.detacheDepuis = null;
      return res(true, (force ? [] : lignesPortees(avant)).concat([
        existait ? "Switched to and reset branch '" + nom + "'" : "Switched to a new branch '" + nom + "'"
      ]), "Branche créée ET rejointe : HEAD pointe maintenant dessus.");
    }

    /* `git checkout --detach` sans autre argument : détacher sur place. */
    var cible = mots[0] || (detacher ? "HEAD" : null);
    if (!cible) return echec(["fatal: you must specify a branch to switch to"], "Il faut dire où aller.");
    /* `git checkout -` : revenir d'où l'on vient. */
    if (cible === "-") {
      if (!depot.brancheAvant) return echec(["fatal: invalid reference: -"], "Aucune branche précédente à retrouver.");
      cible = depot.brancheAvant;
    }
    var estBranche = !!depot.oidDeRef("refs/heads/" + cible) && !detacher;
    var oid = depot.resoudre(cible);
    if (!oid) {
      return echec(["error: pathspec '" + cible + "' did not match any file(s) known to git"],
        depot.raisonEchec === "ambigu" ? "Ce préfixe désigne plusieurs objets : git refuse de choisir." : "Ni branche, ni étiquette, ni commit connu sous ce nom.");
    }
    var mod = modifiesLocalement(depot);
    var bascule = basculer(depot, oid, { force: force });
    if (!bascule.ok) return refusDeBascule(bascule);

    var portees = force ? [] : lignesPortees(mod);
    /* En quittant une tête détachée, git rappelle OU on etait : sans cela,
       l'empreinte du commit orphelin serait perdue de vue. */
    if (depot.detachee() && depot.oidHEAD() && depot.oidHEAD() !== oid) {
      portees.push("Previous HEAD position was " + abrev(depot.oidHEAD()) + " " + titreDe(depot, depot.oidHEAD()));
    }
    if (estBranche) {
      var dejaLa = !depot.detachee() && depot.brancheCourante() === cible;
      memoriserBranche(depot);
      depot.pointerHEAD("refs/heads/" + cible);
      depot.detacheDepuis = null;
      return res(true, portees.concat([dejaLa ? "Already on '" + cible + "'" : "Switched to branch '" + cible + "'"]),
        dejaLa ? "HEAD était déjà sur cette branche : rien n'a bougé."
          : "HEAD suit désormais la branche « " + cible + " » : les prochains commits la feront avancer.");
    }
    memoriserBranche(depot);
    depot.HEAD = { symbolique: null, oid: oid };
    /* Git retient le NOM qu'on lui a donné — complet quand c'est une branche
       détachée par `--detach`, court pour une étiquette, l'empreinte sinon. */
    var nomRetenu = depot.oidDeRef("refs/heads/" + cible) ? "refs/heads/" + cible
      : (depot.oidDeRef("refs/tags/" + cible) ? cible : abrev(oid));
    depot.detacheDepuis = { nom: nomRetenu, oid: oid };
    return res(true, portees.concat(["HEAD is now at " + abrev(oid) + " " + titreDe(depot, oid)]),
      "HEAD est DÉTACHÉ : il pointe sur un commit, pas sur une branche. Un commit fait ici n'appartiendrait à aucune branche — il faudrait lui poser une étiquette ou une branche pour le retrouver.");
  };

  /* `git checkout -` a besoin de savoir d'où l'on vient. */
  function memoriserBranche(depot) {
    if (!depot.detachee()) depot.brancheAvant = depot.brancheCourante();
  }

  function refusDeBascule(bascule) {
    if (bascule.ecrases) {
      return echec(["error: Your local changes to the following files would be overwritten by checkout:"]
        .concat(bascule.ecrases.map(function (c) { return "\t" + c; }))
        .concat(["Please commit your changes or stash them before you switch branches.", "Aborting"]),
        "Changer de branche écraserait un travail non commité : git s'arrête AVANT de faire des dégâts.");
    }
    return echec(["error: The following untracked working tree files would be overwritten by checkout:"]
      .concat(bascule.nonSuivis.map(function (c) { return "\t" + c; }))
      .concat(["Please move or remove them before you switch branches.", "Aborting"]),
      "Un fichier non suivi porte le nom d'un fichier de la cible : git ne l'écrase pas.");
  }

  C["switch"] = function (depot, args) {
    var conv = args.slice();
    conv.__switch = true;
    return C.checkout(depot, conv);
  };

  function lignesPortees(marques) {
    var out = [];
    for (var c in marques) if (possede(marques, c)) out.push(marques[c] + "\t" + c);
    return out.sort(function (a, b) { return GM.comparerChemins(a.slice(2), b.slice(2)); });
  }

  /* --- reset ----------------------------------------------------------------
     Déplacer la branche courante, et selon le degré choisi, l'index puis le
     répertoire de travail. `--hard` est la seule commande de git qui détruit du
     travail sans filet : le bac à sable est l'endroit où l'apprendre. */
  C.reset = function (depot, args) {
    var r = analyser("reset", args);
    if (r.inconnue) return optionInconnue(r);
    var mode = "mixed";
    if (drapeau(r, "--soft")) mode = "soft";
    if (drapeau(r, "--mixed")) mode = "mixed";
    if (drapeau(r, "--hard")) mode = "hard";
    var mots = r.libres;
    var cheminsVises = r.chemins;

    /* `git reset [<révision>] <chemin>…` : dé-indexer, sans toucher au graphe.
       ⚠️ `git reset HEAD a.txt` ne désindexe QUE `a.txt`. La première version
       voyait une révision en tête et désindexait TOUT — sur la commande la plus
       enseignée du cours. */
    var revisionChemins = null;
    /* ⚠️ La forme « avec chemins » se reconnaît AVANT de regarder le degré : git
       refuse `--hard` et `--soft` accompagnés d'un chemin, il ne les exécute pas
       sur tout le dépôt. Le bac à sable, lui, ne cherchait des chemins qu'en
       mode `--mixed` : `git reset --hard HEAD notes-perso.txt` y devenait un
       `git reset --hard` complet, et DÉTRUISAIT le travail que git avait refusé
       de toucher. Trouvé par une passe adversariale du point D4, sur la ligne
       même qu'un texte de scénario invitait à essayer. */
    if (!cheminsVises.length && mots.length) {
      if (mots.length > 1 && depot.resoudre(mots[0])) {
        revisionChemins = mots[0];
        cheminsVises = mots.slice(1);
      } else if (!depot.resoudre(mots[0])) {
        cheminsVises = mots;
      }
    } else if (cheminsVises.length && mots.length && depot.resoudre(mots[0])) {
      revisionChemins = mots[0];
    }
    if (cheminsVises.length) {
      var oidRef = revisionChemins ? depot.resoudre(revisionChemins) : depot.oidHEAD();
      var tete = arbreDe(depot, oidRef);
      var vises = etendreChemins(depot, cheminsVises, tete);
      if (!vises.length) {
        return echec(["fatal: ambiguous argument '" + cheminsVises[0] + "': unknown revision or path not in the working tree.",
          "Use '--' to separate paths from revisions, like this:",
          "'git <command> [<revision>...] -- [<file>...]'"],
          "Ce chemin n'est ni une révision ni un fichier connu de git.");
      }
      /* Mesuré des deux côtés : le refus vient APRÈS la résolution des chemins —
         un chemin inconnu rend « ambiguous argument », un chemin connu rend
         « Cannot do hard reset with paths. ». Et rien n'est modifié. */
      if (mode !== "mixed") {
        return echec(["fatal: Cannot do " + mode + " reset with paths."],
          "`--" + mode + "` porte sur TOUT le dépôt : git refuse de le limiter à un chemin. "
          + "Pour ne toucher qu'un fichier, c'est `git reset <fichier>` (sans degré), "
          + "ou `git checkout -- <fichier>` pour le disque.");
      }
      for (var i = 0; i < vises.length; i++) {
        var c = vises[i];
        if (possede(tete, c)) depot.index[c] = { oid: tete[c].oid, mode: tete[c].mode };
        else delete depot.index[c];
      }
      return res(true, lignesResetMixed(depot), "Retiré de l'index ; le fichier sur le disque n'a pas bougé.");
    }

    var revision = mots.length ? mots[0] : "HEAD";
    /* Sur un dépôt sans commit, `git reset --hard` réussit en silence : il n'y a
       rien à ramener. Le bac à sable répondait « révision inconnue ». */
    if (!depot.oidHEAD() && (revision === "HEAD" || !mots.length)) {
      depot.index = dico();
      nettoyerOperation(depot);
      return res(true, [], "Rien à ramener : le dépôt n'a encore aucun commit.");
    }
    var oid = depot.resoudre(revision);
    if (!oid) {
      return echec(["fatal: ambiguous argument '" + revision + "': unknown revision or path not in the working tree.",
        "Use '--' to separate paths from revisions, like this:",
        "'git <command> [<revision>...] -- [<file>...]'"], "Révision inconnue.");
    }

    if (mode !== "soft") {
      if (mode === "hard") { basculer(depot, oid, { force: true }); }
      remettreIndex(depot, oid);
    }
    depot.avancerHEAD(oid);
    nettoyerOperation(depot);

    if (mode === "hard") {
      return res(true, ["HEAD is now at " + abrev(oid) + " " + titreDe(depot, oid)],
        "Branche, index ET répertoire de travail ramenés sur " + abrev(oid) + " : tout ce qui n'était pas commité est PERDU.");
    }
    if (mode === "soft") {
      return res(true, [], "Seule la branche a bougé : l'index et les fichiers gardent l'état d'avant — c'est ainsi qu'on refait un commit autrement.");
    }
    return res(true, lignesResetMixed(depot), "La branche et l'index ont bougé ; les fichiers du disque sont intacts.");
  };

  function lignesResetMixed(depot) {
    var s = depot.statut(), out = [], i;
    var lignes = [];
    for (i = 0; i < s.modifies.length; i++) lignes.push({ c: s.modifies[i], m: "M" });
    for (i = 0; i < s.supprimes.length; i++) lignes.push({ c: s.supprimes[i], m: "D" });
    if (!lignes.length) return [];
    lignes.sort(function (a, b) { return GM.comparerChemins(a.c, b.c); });
    out.push("Unstaged changes after reset:");
    for (i = 0; i < lignes.length; i++) out.push(lignes[i].m + "\t" + lignes[i].c);
    return out;
  }

  /* --- merge ----------------------------------------------------------------
     Trois cas, et un seul est une vraie fusion :
       · l'autre est déjà dans notre histoire  → rien à faire ;
       · nous sommes dans la sienne            → avance rapide, AUCUN commit créé ;
       · les histoires ont divergé             → fusion à trois voies. */
  /* ⚠️ UNE OPTION IGNOREE EST PIRE QU'UNE OPTION ABSENTE : elle enseigne un
     drapeau qui n'a rien fait. `-X theirs` et `-s ours` étaient LUS puis jetés,
     et la fusion se faisait à trois voies comme si de rien n'était — le vrai git,
     lui, résout le conflit sans broncher. Mesuré par une passe adversariale du
     point D4. La politique du fichier est de REFUSER en le disant. */
  function strategieRefusee(r, quoi) {
    var st = valeur(r, "-s", "--strategy");
    var opt = valeur(r, "-X", "--strategy-option");
    if (!st && !opt) return null;
    var citee = opt ? "-X " + opt : "-s " + st;
    return echec(["fatal: " + citee + " n'est pas simulé par ce bac à sable."],
      "Ce bac à sable fusionne toujours à trois voies, sans stratégie au choix : « " + citee
      + " » y serait sans effet, et une option sans effet enseigne un git qui n'existe pas. "
      + "Résous le conflit à la main, c'est ce que " + quoi + " demande ici.");
  }

  C.merge = function (depot, args) {
    var rm_ = analyser("merge", args);
    if (rm_.inconnue) return optionInconnue(rm_);
    var refusMerge = strategieRefusee(rm_, "la fusion");
    if (refusMerge) return refusMerge;
    var e = etat(depot);
    if (drapeau(rm_, "--abort")) {
      if (e.operation !== "merge") return echec(["fatal: There is no merge to abort (MERGE_HEAD missing)."], "Aucune fusion n'est en cours.");
      basculer(depot, depot.oidHEAD(), { force: true });
      remettreIndex(depot, depot.oidHEAD());
      nettoyerOperation(depot);
      return res(true, [], "Fusion abandonnée : le dépôt est revenu exactement où il était avant.");
    }
    if (drapeau(rm_, "--continue")) {
      if (e.operation !== "merge") return echec(["fatal: There is no merge in progress (MERGE_HEAD missing)."], "Aucune fusion n'est en cours.");
      if (enConflit(depot)) {
        var restantsM = cheminsEnConflit(depot);
        return echec(["U\t" + restantsM[0],
          "error: Committing is not possible because you have unmerged files.",
          "fatal: Exiting because of an unresolved conflict."],
          "Il reste des conflits à marquer résolus avec `git add`.");
      }
      return C.commit(depot, []);
    }

    var sansAvance = drapeau(rm_, "--no-ff");
    var seulementAvance = drapeau(rm_, "--ff-only");
    var permettreEtranger = drapeau(rm_, "--allow-unrelated-histories");
    var mots = rm_.libres;
    var messageDonne = valeur(rm_, "-m", "--message");
    if (drapeau(rm_, "--squash")) {
      return echec(["fatal: le bac à sable ne simule pas `--squash` (fusionner sans commit de fusion)."],
        "`--squash` applique le résultat sans créer de commit de fusion ; ce n'est pas simulé.");
    }
    if (!mots.length) return echec(["fatal: No commit specified and merge.defaultToUpstream not set."], "Il faut dire quoi fusionner.");
    if (e.operation) {
      /* Deux messages différents chez git : « MERGE_HEAD exists » quand l'index
         est propre, et « Merging is not possible » quand il reste des chemins
         non fusionnés. Le bac à sable donnait toujours le premier. */
      if (enConflit(depot)) {
        return echec(["error: Merging is not possible because you have unmerged files.",
          "fatal: Exiting because of an unresolved conflict."],
          "Des chemins sont encore en conflit : termine d'abord l'opération en cours.");
      }
      return echec(["fatal: You have not concluded your merge (MERGE_HEAD exists)."],
        "Une opération est déjà en cours : la terminer ou l'abandonner d'abord.");
    }

    if (mots.length > 1) {
      return echec(["fatal: le bac à sable ne fusionne qu'une branche à la fois (git ferait ici une fusion « octopus »)."],
        "Fusionner plusieurs branches d'un coup (fusion « octopus ») n'est pas simulé : fais-les une par une.");
    }
    var nom = mots[0];
    var autre = depot.resoudre(nom);
    if (!autre) return echec(["merge: " + nom + " - not something we can merge"], "Rien de connu sous ce nom.");
    var tete = depot.oidHEAD();
    if (!tete) return echec(["fatal: Non-fast-forward commit does not make sense into an empty head"], "La branche courante n'a aucun commit.");

    if (depot.estAncetre(autre, tete)) {
      return res(true, ["Already up to date."], "Tout ce que cette branche contient est DÉJÀ dans l'histoire courante : il n'y a rien à fusionner.");
    }

    if (depot.estAncetre(tete, autre) && !sansAvance) {
      var arbreAvant = depot.lireCommit(tete).arbre;
      var enTete = ["Updating " + abrev(tete) + ".." + abrev(autre)];
      var b = basculer(depot, autre, {});
      if (!b.ok) {
        /* ⚠️ Git annonce « Updating a..b » AVANT de découvrir l'obstacle : la
           ligne fait partie de la sortie même quand la fusion échoue. */
        return echec(enTete.concat(b.ecrases
          ? ["error: Your local changes to the following files would be overwritten by merge:"]
            .concat(b.ecrases.map(function (c) { return "\t" + c; }))
            .concat(["Please commit your changes or stash them before you merge.", "Aborting"])
          : ["error: The following untracked working tree files would be overwritten by merge:"]
            .concat(b.nonSuivis.map(function (c) { return "\t" + c; }))
            .concat(["Please move or remove them before you merge.", "Aborting"])),
          "La fusion écraserait un travail non commité.");
      }
      depot.avancerHEAD(autre);
      var statFF = statistiques(depot, arbreAvant, depot.lireCommit(autre).arbre);
      return res(true, enTete.concat([
        "Fast-forward" + (messageDonne != null ? " (no commit created; -m option ignored)" : "")
      ]).concat(lignesStat(statFF, true)),
        "AVANCE RAPIDE : aucun commit de fusion n'a été créé, la branche a simplement glissé jusqu'à " + abrev(autre) + ".",
        { avanceRapide: true });
    }

    if (seulementAvance) {
      return echec(["fatal: Not possible to fast-forward, aborting."],
        "`--ff-only` interdit de créer un commit de fusion : les histoires ayant divergé, git s'arrête.");
    }
    var base = depot.baseDeFusion(tete, autre);
    /* Git REFUSE de fusionner deux histoires sans ancêtre commun (il faut
       `--allow-unrelated-histories`). Sans ce garde-fou, le bac à sable
       fusionnait en prenant l'arbre vide pour base. */
    if (!base && !permettreEtranger) {
      return echec(["fatal: refusing to merge unrelated histories"],
        "Ces deux branches n'ont AUCUN commit en commun : git refuse, parce qu'une fusion sans base commune n'a rien à comparer.");
    }
    var labelNotre = "HEAD";
    var labelLeur = nom;
    var fusion = fusionnerArbres(depot, base, tete, autre, labelNotre, labelLeur);

    /* Git veut un index PROPRE avant de fusionner : un changement seulement
       indexé (jamais commité) serait noyé dans le commit de fusion. Le message
       aligne les chemins sur deux espaces, pas une tabulation. */
    var statIdx = depot.statut();
    if (statIdx.indexes.length) {
      return echec(["error: Your local changes to the following files would be overwritten by merge:"]
        .concat(statIdx.indexes.map(function (x) { return "  " + x.chemin; }))
        .concat(["Merge with strategy ort failed."]),
        "L'index contient des changements non commités : git veut un point de départ propre pour fusionner.");
    }
    var gene = obstacles(depot, fusion);
    if (gene.ecrases.length) {
      return echec(["error: Your local changes to the following files would be overwritten by merge:"]
        .concat(gene.ecrases.map(function (c) { return "\t" + c; }))
        .concat(["Please commit your changes or stash them before you merge.", "Aborting", "Merge with strategy ort failed."]),
        "La fusion écraserait un travail non commité : git s'arrête AVANT de faire des dégâts.");
    }
    if (gene.nonSuivis.length) {
      return echec(["error: The following untracked working tree files would be overwritten by merge:"]
        .concat(gene.nonSuivis.map(function (c) { return "\t" + c; }))
        .concat(["Please move or remove them before you merge.", "Aborting", "Merge with strategy ort failed."]),
        "Un fichier non suivi porte le nom d'un fichier qu'apporte la fusion : git ne l'écrase pas.");
    }
    poser(depot, fusion);

    var conflits = [];
    for (var c in fusion.conflits) if (possede(fusion.conflits, c)) conflits.push(c);
    conflits.sort(GM.comparerChemins);
    /* ⚠️ Git entrelace : « Auto-merging f » puis « CONFLICT … f », chemin par
       chemin. Le bac à sable groupait les uns puis les autres. */
    var sortie = lignesDeFusion(fusion, conflits, nom);

    var brancheCourante = depot.detachee() ? null : depot.brancheCourante();
    /* Git nomme la CHOSE fusionnée : une branche, une étiquette (« Merge tag »)
       ou un commit nu (« Merge commit »). Et il précise « into <où> » dès qu'on
       n'est pas sur la branche principale — « into HEAD » en tête détachée. */
    var genre = depot.oidDeRef("refs/heads/" + nom) ? "branch"
      : (depot.oidDeRef("refs/tags/" + nom) ? "tag" : "commit");
    var dedans = depot.detachee() ? " into HEAD"
      : (brancheCourante !== depot.branchePrincipale ? " into " + brancheCourante : "");
    var message = messageDonne != null ? messageDonne
      : ("Merge " + genre + " '" + nom + "'" + dedans);

    if (conflits.length) {
      e.operation = "merge";
      e.tete = autre;
      e.labelLeur = nom;
      e.message = message;
      for (var k = 0; k < conflits.length; k++) e.conflits[conflits[k]] = fusion.conflits[conflits[k]];
      e.conflitsInitiaux = conflits.slice();
      sortie.push("Automatic merge failed; fix conflicts and then commit the result.");
      return echec(sortie, conflits.length + " conflit(s) : git a fusionné tout ce qu'il pouvait et laissé les marqueurs <<<<<<< pour le reste. C'est à toi de trancher.",
        { conflits: conflits });
    }

    e.operation = "merge";
    e.tete = autre;
    e.labelLeur = nom;
    e.message = message;
    var r = C.commit(depot, [], { message: message });
    var stat = r.stat;
    var lignes = sortie.concat(["Merge made by the 'ort' strategy."]).concat(lignesStat(stat, true));
    return res(true, lignes, "Commit de fusion " + abrev(r.oid) + " : il a DEUX parents, " + abrev(tete) + " et " + abrev(autre) + ".",
      { oid: r.oid });
  };

  /* « Auto-merging <chemin> » et « CONFLICT … <chemin> » se suivent, chemin par
     chemin, dans l'ordre des chemins. */
  /* Toutes les lignes qu'une fusion écrit, dans l'ordre où git les écrit : par
     CHEMIN, celui d'origine pour une collision de répertoire, le chemin final
     sinon. C'est ce qui met « lib/a.txt » avant « lib~autre » dans un sens et
     « lib » avant « lib~HEAD » dans l'autre. */
  function lignesDeFusion(fusion, conflits, label) {
    var entrees = [], i;
    for (i = 0; i < fusion.fusionnes.length; i++) {
      entrees.push({ chemin: fusion.fusionnes[i], rang: 0, ligne: "Auto-merging " + fusion.fusionnes[i] });
    }
    for (i = 0; i < conflits.length; i++) {
      var c = conflits[i];
      /* Un chemin ÉCARTÉ par une collision de répertoire est bien « non
         fusionné » dans l'index, mais git n'écrit pas de deuxième ligne
         CONFLICT pour lui : celle de la collision suffit. */
      var g = fusion.conflits[c].genre;
      if (g === "ajout/leur" || g === "ajout/notre") continue;
      entrees.push({ chemin: c, rang: 1, ligne: "CONFLICT (" + genreGit(g) + "): "
        + phraseConflit(g, c, label) });
    }
    var deplaces = fusion.deplaces || [];
    for (i = 0; i < deplaces.length; i++) {
      var d = deplaces[i];
      entrees.push({ chemin: d.vers, rang: 0, ligne: "CONFLICT (file/directory): directory in the way of "
        + d.de + " from " + d.cote + "; moving it to " + d.vers + " instead." });
    }
    entrees.sort(function (x, y) {
      var n = GM.comparerChemins(x.chemin, y.chemin);
      return n !== 0 ? n : x.rang - y.rang;
    });
    return entrees.map(function (e) { return e.ligne; });
  }

  function genreGit(genre) {
    if (genre === "ajout/ajout") return "add/add";
    if (genre === "modifié/supprimé" || genre === "supprimé/modifié") return "modify/delete";
    return "content";
  }

  function phraseConflit(genre, chemin, nom) {
    if (genre === "modifié/supprimé") return chemin + " deleted in " + nom + " and modified in HEAD.  Version HEAD of " + chemin + " left in tree.";
    if (genre === "supprimé/modifié") return chemin + " deleted in HEAD and modified in " + nom + ".  Version " + nom + " of " + chemin + " left in tree.";
    return "Merge conflict in " + chemin;
  }

  /* --- appliquer un commit ailleurs -----------------------------------------
     cherry-pick et revert sont la MÊME opération, au sens inverse près :
       · cherry-pick C : base = parent de C,  leur = C
       · revert C      : base = C,            leur = parent de C
     C'est aussi ce que rebase fait, commit après commit. */
  function appliquer(depot, oidCommit, options) {
    options = options || {};
    var c = depot.lireCommit(oidCommit);
    /* ⚠️ `-m <n>` désigne le parent à considérer comme la ligne principale. Il
       était LU pour décider d'un refus, puis jamais utilisé : `revert -m 2`
       annulait le mauvais côté de la fusion, et réussissait. */
    var rang = options.mainline ? parseInt(options.mainline, 10) : 1;
    var parent = c.parents.length ? c.parents[rang - 1] : null;
    if (c.parents.length && !parent) return { parentInconnu: rang, commit: c };
    var base = options.inverse ? oidCommit : parent;
    var leur = options.inverse ? parent : oidCommit;
    var tete = depot.oidHEAD();
    var labelLeur = options.labelLeur || (abrev(oidCommit) + " (" + c.titre + ")");
    var fusion = fusionnerArbres(depot, base, tete, leur, "HEAD", labelLeur);
    poser(depot, fusion);
    var conflits = [];
    for (var k in fusion.conflits) if (possede(fusion.conflits, k)) conflits.push(k);
    return { fusion: fusion, conflits: conflits.sort(GM.comparerChemins), commit: c, labelLeur: labelLeur };
  }

  /* cherry-pick et revert partagent TOUT sauf le sens : ils appliquent une
     suite de commits, un par un, et s'arrêtent au premier conflit. */
  function sequencer(depot, args, inverse) {
    var quoi = inverse ? "revert" : "cherry-pick";
    var r = analyser(quoi, args);
    if (r.inconnue) return optionInconnue(r);
    var e = etat(depot);

    if (drapeau(r, "--abort")) return abandonner(depot, quoi);
    if (drapeau(r, "--continue")) return poursuivre(depot, quoi);
    if (drapeau(r, "--skip")) return sauterSequence(depot, quoi);
    if (drapeau(r, "--quit")) {
      /* ⚠️ `--quit` OUBLIE l'opération mais laisse le disque et l'index tels
         quels — marques de conflit comprises. Le bac à sable les effaçait. */
      var conflitsGardes = e.conflits;
      nettoyerOperation(depot);
      etat(depot).conflits = conflitsGardes;
      return res(true, [], "Opération oubliée ; l'index et les fichiers restent dans l'état où ils sont.");
    }
    if (e.operation) {
      if (enConflit(depot)) {
        return echec(["error: " + (inverse ? "Reverting" : "Cherry-picking") + " is not possible because you have unmerged files.",
          "fatal: " + quoi + " failed"],
          "Des chemins sont encore en conflit : résous-les d'abord.");
      }
      return echec(["error: a cherry-pick or revert is already in progress", "fatal: " + quoi + " failed"],
        "Une opération est déjà en cours.");
    }

    var aFaire = [], k;
    for (k = 0; k < r.libres.length; k++) {
      var lot = resoudrePlage(depot, r.libres[k]);
      if (!lot) return echec(["fatal: bad revision '" + r.libres[k] + "'"], "Révision inconnue.");
      /* ⚠️ `git revert A..B` annule du plus RÉCENT au plus ancien — l'inverse de
         `cherry-pick`, qui rejoue dans l'ordre de l'histoire. Mesuré. */
      aFaire = aFaire.concat(inverse ? lot.slice().reverse() : lot);
    }
    if (!aFaire.length) {
      return echec(["usage: git " + quoi + " [<options>] <commit-ish>..."], "Il faut dire quel commit appliquer.");
    }
    for (k = 0; k < aFaire.length; k++) {
      if (depot.typeDe(aFaire[k]) !== "commit") return echec(["fatal: bad object " + aFaire[k]], "Ce n'est pas un commit.");
    }
    return deroulerSequence(depot, aFaire, {
      inverse: inverse,
      quoi: quoi,
      mainline: valeur(r, "-m", "--mainline"),
      sansCommit: drapeau(r, "-n", "--no-commit"),
      tracer: drapeau(r, "-x"),
      permettreVide: drapeau(r, "--allow-empty")
    });
  }

  function deroulerSequence(depot, restants, options) {
    var sortie = [];
    while (restants.length) {
      var oid = restants.shift();
      var c = depot.lireCommit(oid);
      if (c.parents.length > 1 && !options.mainline) {
        return echec(["error: commit " + oid + " is a merge but no -m option was given.",
          "fatal: " + options.quoi + " failed"],
          "Ce commit est une FUSION : il faut dire quel parent sert de référence (`-m 1`).");
      }
      var a = appliquer(depot, oid, {
        inverse: options.inverse,
        mainline: options.mainline,
        /* ⚠️ Le côté « leur » d'un REVERT est le PARENT du commit annulé, et git
           le nomme ainsi jusque dans la ligne CONFLICT : « deleted in parent of
           3628bc8 (cree f) ». Quand le commit annulé est la RACINE, ce parent
           n'existe pas et git écrit « (empty tree) ». Les deux formes sont
           mesurées contre le vrai git ; le bac à sable écrivait l'empreinte du
           commit lui-même dans les deux cas — donc il désignait à l'apprenant
           un objet qui n'est pas celui dont git parle. */
        labelLeur: !options.inverse ? abrev(oid) + " (" + c.titre + ")"
          : (c.parents.length ? "parent of " + abrev(oid) + " (" + c.titre + ")" : "(empty tree)")
      });
      if (a.parentInconnu) {
        return echec(["error: commit " + oid + " does not have parent " + a.parentInconnu,
          "fatal: " + options.quoi + " failed"],
          "Cette fusion n'a pas de parent numéro " + a.parentInconnu + ".");
      }
      var message = options.inverse ? messageDeRevert(depot, c, oid, options.mainline) : c.message.replace(/\n+$/, "");
      if (options.tracer && !options.inverse) message += "\n\n(cherry picked from commit " + oid + ")";
      var e = etat(depot);
      sortie = sortie.concat(lignesDeFusion(a.fusion, a.conflits, a.labelLeur));

      if (a.conflits.length) {
        e.operation = options.quoi;
        e.tete = oid;
        e.labelLeur = a.labelLeur;
        e.message = message;
        if (!options.inverse) e.auteur = { identite: c.identite, instant: c.instant, fuseau: c.fuseau };
        e.suite = { restants: restants.slice(), options: options };
        for (var i = 0; i < a.conflits.length; i++) e.conflits[a.conflits[i]] = a.fusion.conflits[a.conflits[i]];
        sortie.push("error: could not " + (options.inverse ? "revert" : "apply") + " " + abrev(oid) + "... " + c.titre);
        return echec(sortie, "Le changement ne s'applique pas tout seul ici : résous les conflits, `git add`, puis `git " + options.quoi + " --continue`.",
          { conflits: a.conflits });
      }

      if (options.sansCommit) {
        /* ⚠️ `-n` laisse l'OPÉRATION EN COURS : `git status` le dit, et il faut
           encore la conclure ou l'abandonner. */
        e.operation = options.quoi;
        e.tete = oid;
        e.message = message;
        e.suite = { restants: restants.slice(), options: options };
        return res(true, sortie, "Le changement est appliqué et INDEXÉ, mais aucun commit n'a été créé (`-n`).");
      }
      if (!options.inverse) e.auteur = { identite: c.identite, instant: c.instant, fuseau: c.fuseau };
      var rc = C.commit(depot, [], { message: message, dateInteressante: true, permettreVide: options.permettreVide });
      if (!rc.ok) {
        /* Un changement qui n'apporte plus rien : git s'arrête et laisse
           l'opération EN COURS, avec trois issues possibles. Le bac à sable
           annonçait « c'est fait » sans rien faire. */
        e = etat(depot);
        e.operation = options.quoi;
        e.tete = oid;
        e.message = message;
        e.suite = { restants: restants.slice(), options: options };
        return echec(sortie.concat(C.status(depot, []).sortie).concat(lignesRienAAppliquer(options.quoi)),
          "Ce changement est DÉJÀ présent ici : il ne reste rien à appliquer.");
      }
      sortie = sortie.concat(rc.sortie);
    }
    return res(true, sortie,
      options.inverse
        ? "Un commit NEUF qui défait le précédent : l'histoire n'est pas réécrite, elle est complétée — c'est ce qui rend `revert` sûr sur une branche partagée."
        : "Le MÊME changement, posé sur une autre base : de nouveaux commits, les originaux existent toujours.");
  }

  function lignesRienAAppliquer(quoi) {
    return ["The previous " + quoi + " is now empty, possibly due to conflict resolution.",
      "If you wish to commit it anyway, use:",
      "",
      "    git commit --allow-empty",
      "",
      "Otherwise, please use 'git " + quoi + " --skip'"];
  }

  /* Le message d'un revert. Deux formes mesurées : celle d'un commit ordinaire,
     et celle d'une FUSION, qui précise quel côté a été conservé. Et « Reapply »
     quand on annule une annulation (git ≥ 2.34). */
  function messageDeRevert(depot, c, oid, mainline) {
    var titre = /^Revert "(.*)"$/.test(c.titre)
      ? 'Reapply "' + /^Revert "(.*)"$/.exec(c.titre)[1] + '"'
      : 'Revert "' + c.titre + '"';
    if (c.parents.length > 1 && mainline) {
      var parent = c.parents[parseInt(mainline, 10) - 1];
      return titre + '\n\nThis reverts commit ' + oid + ", reversing\nchanges made to " + parent + ".";
    }
    return titre + '\n\nThis reverts commit ' + oid + ".";
  }

  /* `A..B` : tous les commits accessibles depuis B et pas depuis A, du plus
     ancien au plus récent — comme `git cherry-pick main..sujet`. */
  function resoudrePlage(depot, revision) {
    var coupe = revision.indexOf("..");
    if (coupe < 0) {
      var seul = depot.resoudre(revision);
      return seul ? [seul] : null;
    }
    var bas = depot.resoudre(revision.slice(0, coupe) || "HEAD");
    var haut = depot.resoudre(revision.slice(coupe + (revision.charAt(coupe + 2) === "." ? 3 : 2)) || "HEAD");
    if (!bas || !haut) return null;
    var exclus = depot.ancetres(bas);
    var out = [];
    var journal = depot.journal(haut);
    for (var i = 0; i < journal.length; i++) {
      if (exclus[journal[i].oid]) continue;
      out.push(journal[i].oid);
    }
    return out.reverse();
  }

  function sauterSequence(depot, quoi) {
    var e = etat(depot);
    if (e.operation !== quoi) {
      return echec(["error: no cherry-pick or revert in progress", "fatal: " + quoi + " failed"], "Aucune opération de ce type en cours.");
    }
    var suite = e.suite;
    basculer(depot, depot.oidHEAD(), { force: true });
    remettreIndex(depot, depot.oidHEAD());
    nettoyerOperation(depot);
    if (!suite || !suite.restants.length) return res(true, [], "Changement sauté ; il n'en restait pas d'autre.");
    return deroulerSequence(depot, suite.restants, suite.options);
  }

  C["cherry-pick"] = function (depot, args) { return sequencer(depot, args, false); };
  C.revert = function (depot, args) { return sequencer(depot, args, true); };

  function abandonner(depot, quoi) {
    var e = etat(depot);
    if (e.operation !== quoi) {
      return echec(["error: no cherry-pick or revert in progress", "fatal: " + quoi + " failed"], "Aucune opération de ce type en cours.");
    }
    basculer(depot, depot.oidHEAD(), { force: true });
    remettreIndex(depot, depot.oidHEAD());
    nettoyerOperation(depot);
    return res(true, [], "Opération abandonnée : retour à l'état d'avant.");
  }

  function poursuivre(depot, quoi) {
    var e = etat(depot);
    if (e.operation !== quoi) {
      return echec(["error: no cherry-pick or revert in progress", "fatal: " + quoi + " failed"], "Aucune opération de ce type en cours.");
    }
    if (enConflit(depot)) {
      var restants = cheminsEnConflit(depot);
      return echec([restants[0] + ": needs merge",
        "error: " + (quoi === "revert" ? "Reverting" : "Cherry-picking") + " is not possible because you have unmerged files.",
        "fatal: Exiting because of an unresolved conflict."],
        "Il reste des conflits : marque-les résolus avec `git add`.");
    }
    var suite = e.suite;
    /* Un revert crée un auteur NEUF : pas de ligne « Date: ». Un cherry-pick
       reprend celui du commit d'origine, donc git l'affiche. */
    var r = C.commit(depot, [], { message: e.message, dateInteressante: quoi !== "revert" });
    if (!r.ok) {
      /* Rien à commiter : l'opération reste ouverte et git explique les trois
         issues, exactement comme au moment où le changement s'est vidé. */
      return echec(r.sortie.concat(lignesRienAAppliquer(quoi)),
        "Ce changement est DÉJÀ présent ici : il ne reste rien à appliquer.");
    }
    if (suite && suite.restants.length) {
      var fin = deroulerSequence(depot, suite.restants, suite.options);
      fin.sortie = r.sortie.concat(fin.sortie);
      return fin;
    }
    return res(true, r.sortie, "Opération terminée : commit " + abrev(r.oid) + ".", { oid: r.oid });
  }

  /* --- rebase ---------------------------------------------------------------
     Rejouer, un par un, les commits qui n'appartiennent qu'à nous, sur une autre
     base. Les commits d'origine ne sont pas déplacés : ils sont RECOPIÉS, avec
     de nouvelles empreintes — c'est pourquoi réécrire une branche déjà partagée
     fait des dégâts, et c'est exactement ce que le graphe (D3) montrera. */
  C.rebase = function (depot, args) {
    var rb_ = analyser("rebase", args);
    if (rb_.inconnue) return optionInconnue(rb_);
    var refusRebase = strategieRefusee(rb_, "le rebasage");
    if (refusRebase) return refusRebase;
    if (drapeau(rb_, "-i", "--interactive")) {
      return echec(["fatal: le bac à sable ne simule pas le rebasage interactif."],
        "`rebase -i` ouvre un éditeur pour réordonner, fusionner ou réécrire les commits : ce n'est pas simulé.");
    }
    var e = etat(depot);
    if (drapeau(rb_, "--abort")) {
      if (e.operation !== "rebase") return echec(["fatal: no rebase in progress"], "Aucun rebasage en cours.");
      var r = e.rebase;
      if (r.branche) depot.majRef("refs/heads/" + r.branche, r.origine);
      depot.HEAD = r.branche ? { symbolique: "refs/heads/" + r.branche, oid: null } : { symbolique: null, oid: r.origine };
      basculer(depot, r.origine, { force: true });
      remettreIndex(depot, r.origine);
      nettoyerOperation(depot);
      return res(true, [], "Rebasage abandonné : la branche est revenue sur " + abrev(r.origine) + ".");
    }
    if (drapeau(rb_, "--continue", "--skip")) {
      if (e.operation !== "rebase") return echec(["fatal: no rebase in progress"], "Aucun rebasage en cours.");
      var sauter = drapeau(rb_, "--skip");
      var sortieReprise = [];
      if (!sauter) {
        if (enConflit(depot)) {
          var enCoursR = cheminsEnConflit(depot);
          return echec([enCoursR[0] + ": needs merge",
            "You must edit all merge conflicts and then",
            "mark them as resolved using git add"],
            "Il reste des conflits à résoudre.");
        }
        var c = depot.lireCommit(e.tete);
        e.auteur = { identite: c.identite, instant: c.instant, fuseau: c.fuseau };
        var rc = C.commit(depot, [], { message: e.message });
        if (rc.ok) sortieReprise = rc.sortie;
      } else {
        basculer(depot, depot.oidHEAD(), { force: true });
        remettreIndex(depot, depot.oidHEAD());
        e.conflits = dico();
      }
      var suite = e.rebase;
      suite.faits = (suite.faits || []).slice();
      depot.etatGit = { operation: null, conflits: dico(), message: "", tete: null, labelLeur: null, auteur: null, rebase: null };
      var fini = derouler(depot, suite.restants, suite);
      fini.sortie = sortieReprise.concat(fini.sortie);
      return fini;
    }
    if (e.operation) {
      if (enConflit(depot)) {
        var enCoursF = cheminsEnConflit(depot);
        return echec([enCoursF[0] + ": needs merge",
          "error: cannot rebase: You have unstaged changes.",
          "error: additionally, your index contains uncommitted changes.",
          "error: Please commit or stash them."],
          "Une opération est en cours et laisse des chemins non résolus.");
      }
      return echec(["fatal: It seems that there is already a rebase directory"], "Une opération est déjà en cours.");
    }

    var mots = rb_.libres;
    var surQuoiOpt = valeur(rb_, "--onto", "--onto");
    var amont = mots[0];
    if (!amont) {
      return echec(["There is no tracking information for the current branch.",
        "Please specify which branch you want to rebase against.",
        "See git-rebase(1) for details.",
        "",
        "    git rebase '<branch>'",
        "",
        "If you wish to set tracking information for this branch you can do so with:",
        "",
        "    git branch --set-upstream-to=<remote>/<branch> " + (depot.detachee() ? "HEAD" : depot.brancheCourante())],
        "Il faut dire sur quoi rebaser : le bac à sable n'a pas de dépôt distant, donc aucune branche « de suivi ».");
    }
    var oidAmont = depot.resoudre(amont);
    if (!oidAmont) return echec(["fatal: invalid upstream '" + amont + "'"], "Amont inconnu.");
    var branche = mots[1] || null;
    if (branche) {
      var oidB = depot.resoudre(branche);
      if (!oidB) return echec(["fatal: invalid upstream '" + branche + "'"], "Branche inconnue.");
      var rr = C.checkout(depot, [branche]);
      if (!rr.ok) return rr;
    }
    var surQuoi = surQuoiOpt ? depot.resoudre(surQuoiOpt) : oidAmont;
    if (!surQuoi) return echec(["fatal: invalid upstream '" + surQuoiOpt + "'"], "Cible `--onto` inconnue.");

    var tete = depot.oidHEAD();
    var nomBranche = depot.detachee() ? null : depot.brancheCourante();

    if (tete === oidAmont && !surQuoiOpt) {
      return res(true, ["Current branch " + (nomBranche || "HEAD") + " is up to date."],
        "La branche est déjà exactement là : il n'y a rien à rejouer.");
    }
    if (depot.estAncetre(tete, oidAmont)) {
      basculer(depot, surQuoi, { force: true });
      remettreIndex(depot, surQuoi);
      depot.avancerHEAD(surQuoi);
      return res(true, ["Successfully rebased and updated " + (nomBranche ? "refs/heads/" + nomBranche : "detached HEAD") + "."],
        "La branche n'avait aucun commit propre : elle a simplement glissé sur " + abrev(surQuoi) + ".");
    }
    if (depot.estAncetre(oidAmont, tete) && !surQuoiOpt) {
      return res(true, ["Current branch " + (nomBranche || "HEAD") + " is up to date."],
        "L'amont est déjà dans notre histoire : il n'y a rien à rejouer.");
    }

    /* Les commits à rejouer : les nôtres, sauf ceux déjà contenus en amont, du
       plus ancien au plus récent. */
    var ancetresAmont = depot.ancetres(oidAmont);
    var aRejouer = [];
    var journal = depot.journal(tete);
    for (var i = 0; i < journal.length; i++) {
      if (ancetresAmont[journal[i].oid]) continue;
      if (journal[i].parents.length > 1) continue;   // les fusions sont écartées, comme `git rebase` sans --rebase-merges
      aRejouer.push(journal[i].oid);
    }
    /* ⚠️ Git rejoue dans l'ordre TOPOLOGIQUE, pas dans celui de `git log` :
       quand la branche contient une fusion, les deux diffèrent, et toutes les
       empreintes produites avec. */
    aRejouer = ordreTopologique(depot, aRejouer);

    var contexte = { restants: aRejouer.slice(), surQuoi: surQuoi, branche: nomBranche, origine: tete, total: aRejouer.length };
    /* On se place sur la nouvelle base, en HEAD détaché — c'est ce que fait git. */
    basculer(depot, surQuoi, { force: true });
    remettreIndex(depot, surQuoi);
    depot.HEAD = { symbolique: null, oid: surQuoi };
    return derouler(depot, contexte.restants, contexte);
  };

  /* Réordonne une liste de commits de sorte qu'un parent vienne toujours avant
     ses enfants, en respectant à égalité l'ordre de `git log`. C'est ce que
     `git rev-list --topo-order --reverse` produit. */
  function ordreTopologique(depot, oids) {
    var dans = dico(), i;
    for (i = 0; i < oids.length; i++) dans[oids[i]] = true;
    var sortie = [], emis = dico(), reste = oids.slice();
    var garde = 0;
    while (reste.length && garde++ < 10000) {
      var progres = false;
      for (i = 0; i < reste.length; i++) {
        var oid = reste[i];
        var enfantsRestants = false;
        for (var k = 0; k < reste.length; k++) {
          if (k === i) continue;
          var parents = depot.lireCommit(reste[k]).parents;
          for (var j = 0; j < parents.length; j++) if (parents[j] === oid) enfantsRestants = true;
        }
        if (enfantsRestants) continue;
        sortie.push(oid);
        emis[oid] = true;
        reste.splice(i, 1);
        progres = true;
        break;
      }
      if (!progres) break;
    }
    sortie = sortie.concat(reste);
    return sortie.reverse();
  }

  function derouler(depot, restants, contexte) {
    var sortie = [];
    var faits = (contexte.faits || []).slice();
    while (restants.length) {
      var oid = restants.shift();
      faits.push(oid);
      var c = depot.lireCommit(oid);
      var a = appliquer(depot, oid, { labelLeur: abrev(oid) + " (" + c.titre + ")" });
      /* ⚠️ `etat(depot)` est RELU ici : `C.commit` a pu remplacer l'objet au tour
         précédent. Une seule capture en tête de fonction faisait tomber dans le
         vide tout ce qu'on écrivait à partir du deuxième commit rejoué. */
      var e = etat(depot);
      if (a.conflits.length) {
        e.operation = "rebase";
        e.tete = oid;
        e.message = c.message.replace(/\n+$/, "");
        e.labelLeur = a.labelLeur;
        e.rebase = { restants: restants, faits: faits.slice(), surQuoi: contexte.surQuoi, branche: contexte.branche, origine: contexte.origine, total: contexte.total };
        for (var i = 0; i < a.conflits.length; i++) e.conflits[a.conflits[i]] = a.fusion.conflits[a.conflits[i]];
        sortie = sortie.concat(lignesDeFusion(a.fusion, a.conflits, abrev(oid) + " (" + c.titre + ")"));
        sortie.push("error: could not apply " + abrev(oid) + "... " + c.titre);
        sortie.push("Could not apply " + abrev(oid) + "... # " + c.titre);
        return echec(sortie, "Le commit " + abrev(oid) + " ne se rejoue pas tout seul : résous, `git add`, puis `git rebase --continue`.", { conflits: a.conflits });
      }
      e.auteur = { identite: c.identite, instant: c.instant, fuseau: c.fuseau };
      /* Un commit qui DEVIENT vide est laissé tomber par git ; un commit qui
         ÉTAIT vide à l'origine est conservé. On distingue les deux. */
      var etaitVide = !c.parents.length || depot.lireCommit(c.parents[0]).arbre === c.arbre;
      var rc = C.commit(depot, [], { message: c.message.replace(/\n+$/, ""), permettreVide: etaitVide });
      /* Un commit dont le contenu est déjà en amont disparaît : git n'écrit
         qu'un `warning:`, donc rien de visible. */
      if (rc.ok) sortie = sortie.concat([]);
    }
    var fin = depot.oidHEAD();
    if (contexte.branche) {
      depot.majRef("refs/heads/" + contexte.branche, fin);
      depot.HEAD = { symbolique: "refs/heads/" + contexte.branche, oid: null };
    }
    nettoyerOperation(depot);
    return res(true, sortie.concat(["Successfully rebased and updated " + (contexte.branche ? "refs/heads/" + contexte.branche : "detached HEAD") + "."]),
      contexte.total + " commit(s) REJOUÉ(S) sur " + abrev(contexte.surQuoi) + " : ce sont de NOUVEAUX commits, les anciens ne sont plus accessibles depuis la branche.",
      { oid: fin });
  }

  /* --- diff ----------------------------------------------------------------- */
  C.diff = function (depot, args) {
    var indexe = args.indexOf("--staged") >= 0 || args.indexOf("--cached") >= 0;
    var nomsSeuls = args.indexOf("--name-only") >= 0 || args.indexOf("--name-status") >= 0;
    var avecEtat = args.indexOf("--name-status") >= 0;
    var s = depot.statut();
    var lignes = [];
    if (indexe) {
      for (var i = 0; i < s.indexes.length; i++) {
        lignes.push(nomsSeuls
          ? (avecEtat ? codeEtat(s.indexes[i].etat) + "\t" + s.indexes[i].chemin : s.indexes[i].chemin)
          : s.indexes[i].chemin + " : " + s.indexes[i].etat);
      }
      return res(true, lignes, "Écart entre l'INDEX et le dernier commit : ce qui partira au prochain `git commit`.");
    }
    for (var j = 0; j < s.modifies.length; j++) lignes.push(nomsSeuls ? (avecEtat ? "M\t" : "") + s.modifies[j] : s.modifies[j] + " : modifié");
    for (var k = 0; k < s.supprimes.length; k++) lignes.push(nomsSeuls ? (avecEtat ? "D\t" : "") + s.supprimes[k] : s.supprimes[k] + " : supprimé");
    return res(true, lignes, "Écart entre le RÉPERTOIRE DE TRAVAIL et l'index : ce qui n'a pas encore été ajouté.");
  };

  /* ===========================================================================
     6. LIRE UNE LIGNE DE COMMANDE
     L'apprenant tape `git commit -m "premier essai"`. Le découpage respecte les
     guillemets — sans quoi le message deviendrait deux arguments et le bac à
     sable enseignerait une erreur qui n'existe pas.
     =========================================================================== */

  function decouperLigne(ligne) {
    var out = [], courant = "", dansSimple = false, dansDouble = false, entame = false;
    for (var i = 0; i < ligne.length; i++) {
      var ch = ligne.charAt(i);
      if (ch === "\\" && i + 1 < ligne.length && dansDouble) { courant += ligne.charAt(++i); entame = true; continue; }
      if (ch === '"' && !dansSimple) { dansDouble = !dansDouble; entame = true; continue; }
      if (ch === "'" && !dansDouble) { dansSimple = !dansSimple; entame = true; continue; }
      if (/\s/.test(ch) && !dansSimple && !dansDouble) {
        if (entame) { out.push(courant); courant = ""; entame = false; }
        continue;
      }
      courant += ch; entame = true;
    }
    if (entame) out.push(courant);
    return out;
  }

  function executer(depot, ligne) {
    var mots = typeof ligne === "string" ? decouperLigne(ligne) : ligne.slice();
    if (!mots.length) return echec([], "Ligne vide : il n'y a rien à exécuter.");
    if (mots[0] === "git") mots.shift();
    if (!mots.length) return echec(["usage: git <command> [<args>]"], "Il manque la commande.");
    var nom = mots.shift();
    if (!possede(C, nom)) {
      /* ⚠️ NE PAS MENTIR SUR GIT. `restore`, `switch`, `stash`, `reflog`,
         `clean`, `fsck`, `show`, `push`, `pull`, `fetch` EXISTENT — certaines
         depuis 2019 — et `git status` les propose lui-même deux lignes plus
         haut : le bac à sable affiche « (use "git restore --staged <file>..." to
         unstage) », puis répondait « git: 'restore' is not a git command ». Une
         passe adversariale l'a relevé : l'apprenant en conclut que la commande
         que git vient de lui souffler n'existe pas. On distingue donc ce qui
         n'existe pas de ce qui n'est pas SIMULÉ ICI. */
      if (REELLES_NON_SIMULEES.indexOf(nom) >= 0) {
        return echec(["git " + nom + " existe, mais ce bac à sable ne le simule pas.",
          "Les quinze commandes simulées : " + Object.keys(C).sort().join(", ") + "."],
          "« git " + nom + " » est une vraie commande de git — simplement, ce bac à sable "
          + "ne la reproduit pas. Le cours, lui, l'enseigne.");
      }
      return echec(["git: '" + nom + "' is not a git command. See 'git --help'."],
        "Cette commande n'existe pas dans le bac à sable. Disponibles : " + Object.keys(C).sort().join(", ") + ".");
    }
    try {
      return C[nom](depot, mots);
    } catch (err) {
      /* Une exception ARRÊTERAIT le bac à sable : l'apprenant verrait une page
         morte au lieu d'un message. Toute impasse est donc une réponse. */
      return echec(["fatal: " + err.message], "Le bac à sable n'a pas su traiter cette commande : " + err.message);
    }
  }

  /* ===========================================================================
     7. SÉRIALISATION (pour D4 : reprendre un scénario où on l'a laissé)
     =========================================================================== */

  /* Des commandes de git bien réelles, que ce bac à sable ne simule pas. Les
     confondre avec des fautes de frappe enseignerait un git qui n'existe pas —
     et plusieurs d'entre elles sont proposées par le `git status` du bac à sable
     lui-même, ou enseignées par le cours. */
  var REELLES_NON_SIMULEES = ["restore", "stash", "reflog", "clean", "fsck", "show",
    "push", "pull", "fetch", "clone", "remote", "bisect", "blame", "worktree",
    "submodule", "config", "init", "apply", "format-patch", "bundle", "archive",
    "grep", "shortlog", "describe", "gc", "prune", "notes", "am", "mv"];

  function exporter(depot) {
    var e = etat(depot);
    var conflits = {};
    for (var c in e.conflits) if (possede(e.conflits, c)) conflits[c] = { genre: e.conflits[c].genre };
    return {
      depot: depot.exporter(),
      etat: { operation: e.operation, conflits: conflits, message: e.message, tete: e.tete, labelLeur: e.labelLeur, auteur: e.auteur, rebase: e.rebase }
    };
  }

  function importer(donnees) {
    var depot = GM.Depot.importer(donnees.depot);
    var e = etat(depot);
    var src = donnees.etat || {};
    e.operation = src.operation || null;
    e.message = src.message || "";
    e.tete = src.tete || null;
    e.labelLeur = src.labelLeur || null;
    e.auteur = src.auteur || null;
    e.rebase = src.rebase ? { restants: (src.rebase.restants || []).slice(), surQuoi: src.rebase.surQuoi, branche: src.rebase.branche, origine: src.rebase.origine, total: src.rebase.total } : null;
    for (var c in (src.conflits || {})) {
      if (possede(src.conflits, c)) e.conflits[c] = { genre: src.conflits[c].genre };
    }
    return depot;
  }

  /* ------------------------------------------------------------------------- */

  var GitCommandes = {
    executer: executer,
    commandes: C,
    decouperLigne: decouperLigne,
    fusionnerTexte: fusionnerTexte,
    compterDiff: compterDiff,
    decouper: decouper,
    etat: etat,
    enConflit: enConflit,
    cheminsEnConflit: cheminsEnConflit,
    exporter: exporter,
    importer: importer,
    abrev: abrev
  };

  if (typeof module !== "undefined" && module.exports) module.exports = GitCommandes;
  if (racine) racine.GitCommandes = GitCommandes;
})(typeof window !== "undefined" ? window : null);
