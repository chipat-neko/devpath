/* =============================================================================
   git-scenarios.js — LES SCÉNARIOS GUIDÉS du bac à sable Git (chantier V14,
   point D4). Script classique, aucune dépendance, aucun réseau : le fichier
   tourne en `file://` dans le navigateur comme dans Node
   (`tools/verif-git-scenarios.js`).

   CE QUE C'EST, ET CE QUE ÇA N'EST PAS
   Un bac à sable libre (D3) laisse taper des commandes. Il n'apprend rien à qui
   ne sait pas quoi taper — et surtout, il n'apprend pas ce dont on a réellement
   besoin de git : SE SORTIR D'UNE SITUATION. « J'ai committé sur la mauvaise
   branche », « il faut annuler un commit que les autres ont déjà », « je suis
   au milieu d'un conflit ». Chaque scénario monte une de ces situations pour de
   bon, puis énonce un BUT vérifiable.

   ⚠️ LA RÈGLE QUI TIENT TOUT : UN OBJECTIF EST UN PRÉDICAT SUR L'ÉTAT, JAMAIS
   UNE COMMANDE ATTENDUE. Comparer la ligne tapée à une ligne modèle
   n'enseignerait qu'à recopier ; et ce serait faux, parce qu'il y a toujours
   plusieurs chemins. On regarde donc ce que le dépôt EST devenu : quelle
   branche contient quel commit, quel fichier est dans quelle zone, avec quel
   contenu. Les `variantes` de chaque scénario sont là pour le prouver : ce sont
   d'autres suites de commandes, légitimes, que le contrôle exige de voir
   RÉUSSIR elles aussi.

   ⚠️ ET UN OBJECTIF QUI EST DÉJÀ VRAI AU DÉPART NE MESURE RIEN. C'est la faute
   par vacuité, déjà payée deux fois dans ce chantier. `tools/verif-git-scenarios.js`
   exige donc que chaque objectif soit FAUX à la fin de la mise en place — sauf
   ceux marqués `deja: true`, qui sont des objectifs de CONSERVATION (« ne perds
   pas ton brouillon ») et dont le contrôle prouve la valeur autrement : par un
   piège qui les fait tomber.

   ⚠️ TOUT CE QUI EST EXÉCUTÉ EST EN ASCII. Les textes français (situation, but,
   objectifs, indices) portent leurs accents ; les LIGNES DE COMMANDE, les
   contenus de fichiers et les messages de commit n'en portent aucun. Raison
   mesurée : le contrôle rejoue ces lignes dans un vrai dépôt git via
   `spawnSync`, et sous Windows la page de code de la console mange les accents
   des arguments — la comparaison deviendrait fausse pour une raison qui n'a
   rien à voir avec git. L'invariant est vérifié par l'outil, pas espéré.

   L'API :
       SCENARIOS            le tableau, dans l'ordre pédagogique
       parId(id)            un scénario
       evaluer(depot, sc)   → { objectifs: [{texte, atteint}], reussi, faits }
       LECONS               la table leçon du cours `git` → id de scénario,
                            celle-là même que `js/lecon.js` emploie pour poser
                            son encart (le contrôle exige qu'elles coïncident).
   ============================================================================= */
(function (racine) {
  "use strict";

  var GC = (typeof module !== "undefined" && module.exports)
    ? require("./git-commandes.js")
    : (racine && racine.GitCommandes);

  /* --- les aides de lecture d'un dépôt ---------------------------------------
     Toutes rendent des valeurs simples et ne modifient rien : un objectif ne
     doit JAMAIS avoir d'effet de bord, sinon le seul fait de l'évaluer changerait
     ce qu'il mesure. */

  function oidDe(depot, nom) {
    try { return depot.resoudre(nom); } catch (e) { return null; }
  }

  /* Les commits atteignables depuis une référence, du plus récent au plus ancien. */
  function commits(depot, ref) {
    var tete = oidDe(depot, ref);
    if (!tete) return [];
    var vus = depot.ancetres(tete), out = [];
    for (var oid in vus) {
      if (!Object.prototype.hasOwnProperty.call(vus, oid)) continue;
      out.push(oid);
    }
    return out;
  }

  function titres(depot, ref) {
    return commits(depot, ref).map(function (oid) { return depot.lireCommit(oid).titre; });
  }

  function contientTitre(depot, ref, titre) {
    return titres(depot, ref).indexOf(titre) >= 0;
  }

  function nbCommits(depot, ref) {
    return commits(depot, ref).length;
  }

  function existeBranche(depot, nom) {
    return depot.oidDeRef("refs/heads/" + nom) !== null;
  }

  /* Le contenu d'un fichier TEL QU'IL EST COMMITÉ dans une référence. */
  function contenuCommite(depot, ref, chemin) {
    var tete = oidDe(depot, ref);
    if (!tete) return null;
    var plat = depot.lireArbre(depot.lireCommit(tete).arbre);
    if (!Object.prototype.hasOwnProperty.call(plat, chemin)) return null;
    return depot.lireBlob(plat[chemin].oid);
  }

  /* Le contenu du fichier sur le disque (répertoire de travail). */
  function contenuTravail(depot, chemin) {
    var v = depot.lireFichier(chemin);
    return v === undefined ? null : v;
  }

  /* Le contenu tel qu'il est DANS L'INDEX — différent des deux autres, et c'est
     tout l'intérêt : un fichier peut être indexé dans un état et modifié dans un
     autre. */
  function contenuIndexe(depot, chemin) {
    if (!Object.prototype.hasOwnProperty.call(depot.index, chemin)) return null;
    return depot.lireBlob(depot.index[chemin].oid);
  }

  function estIndexe(depot, chemin) {
    return Object.prototype.hasOwnProperty.call(depot.index, chemin);
  }

  function nbParents(depot, ref) {
    var tete = oidDe(depot, ref);
    return tete ? depot.lireCommit(tete).parents.length : 0;
  }

  /* Un historique LINÉAIRE : aucun commit de fusion depuis la référence. */
  function lineaire(depot, ref) {
    var liste = commits(depot, ref);
    for (var i = 0; i < liste.length; i++) {
      if (depot.lireCommit(liste[i]).parents.length > 1) return false;
    }
    return true;
  }

  function contient(texte, morceau) {
    return typeof texte === "string" && texte.indexOf(morceau) >= 0;
  }

  /* ⚠️ Chercher « <<<<<<< » seul ne suffit PAS : une passe adversariale a
     committé un fichier ne contenant que « ======= » et « >>>>>>> », et le
     scénario du conflit l'a déclaré réussi. Git écrit les trois marqueurs ; on
     les refuse tous les trois, dans le travail comme dans le commit. */
  function marqueurs(texte) {
    if (typeof texte !== "string") return false;
    return texte.indexOf("<<<<<<<") >= 0 || texte.indexOf("=======") >= 0 || texte.indexOf(">>>>>>>") >= 0;
  }

  var A = {
    oidDe: oidDe, commits: commits, titres: titres, contientTitre: contientTitre,
    nbCommits: nbCommits, existeBranche: existeBranche, contenuCommite: contenuCommite,
    contenuTravail: contenuTravail, contenuIndexe: contenuIndexe, estIndexe: estIndexe,
    nbParents: nbParents, lineaire: lineaire, contient: contient, marqueurs: marqueurs,
    estAncetre: function (depot, a, b) {
      var oa = oidDe(depot, a), ob = oidDe(depot, b);
      return !!(oa && ob && depot.estAncetre(oa, ob));
    },
    parentDe: function (depot, ref) {
      var t = oidDe(depot, ref);
      if (!t) return null;
      var pa = depot.lireCommit(t).parents;
      return pa.length ? pa[0] : null;
    },
    titreDe: function (depot, oid) {
      return oid && depot.existe(oid) ? depot.lireCommit(oid).titre : null;
    },
    enConflit: function (depot) { return GC.enConflit(depot); },
    operation: function (depot) { return GC.etat(depot).operation; }
  };

  /* ===========================================================================
     LES SCÉNARIOS
     Chacun est une situation qu'on rencontre pour de vrai, dans l'ordre où on la
     rencontre : d'abord les zones, puis les branches, puis l'histoire.
     =========================================================================== */

  var SCENARIOS = [
    {
      id: "desindexer",
      titre: "Tu viens d'indexer un fichier qui ne doit pas partir",
      resume: "Retirer un fichier de l'index sans le perdre du disque.",
      apres: "L'index est une zone à part entière : un fichier peut être sur le disque sans y être, et l'inverse. « git reset HEAD <fichier> » ne touche qu'à l'index — c'est ce qui la rend sûre. « git reset --hard », lui, refuse même qu'on lui donne un chemin : il porte sur tout le dépôt à la fois, index et disque compris.",
      niveau: "Débutant",
      situation: "Tu as tapé « git add . » sans regarder ce que tu ajoutais. Dans le lot, "
        + "« notes-perso.txt » contient un mot de passe : il ne doit surtout pas entrer dans "
        + "un commit. Les modifications de « index.html », elles, sont prêtes à partir.",
      but: "Sortir « notes-perso.txt » de l'index — sans effacer le fichier, et sans désindexer le reste.",
      mise: [
        'echo "Site de la mediatheque" > index.html',
        "git add index.html",
        'git commit -m "premiere page"',
        'echo "Horaires : 9h-18h" >> index.html',
        'echo "mot de passe admin : hunter2" > notes-perso.txt',
        "git add ."
      ],
      objectifs: [
        {
          texte: "« notes-perso.txt » n'est plus dans l'index",
          verifier: function (d) { return !A.estIndexe(d, "notes-perso.txt"); }
        },
        {
          texte: "le fichier « notes-perso.txt » est toujours sur le disque, avec son contenu",
          deja: true,
          verifier: function (d) { return A.contient(A.contenuTravail(d, "notes-perso.txt"), "hunter2"); }
        },
        {
          texte: "« index.html » reste indexé, avec sa ligne d'horaires",
          deja: true,
          verifier: function (d) { return A.contient(A.contenuIndexe(d, "index.html"), "Horaires"); }
        },
        {
          /* ⚠️ Sans cet objectif, « git commit -m "tout" » puis « git rm --cached
             notes-perso.txt » était déclaré RÉUSSI : le mot de passe était dans
             l'historique, ce que la situation interdit en toutes lettres. */
          texte: "rien n'a été committé : l'historique compte toujours un commit",
          deja: true,
          verifier: function (d) { return A.nbCommits(d, "main") === 1; }
        }
      ],
      indices: [
        "Commence par « git status » : sous « Changes to be committed », git souffle lui-même la commande — « git restore --staged <fichier> », sa forme moderne. Ce bac à sable ne simule pas encore « restore » ; nous prendrons l'ancienne forme, celle que tu croiseras dans la plupart des tutoriels.",
        "C'est « git reset ». Elle prend le point de repère — HEAD, c'est-à-dire le dernier commit — puis le chemin du fichier.",
        "« git reset HEAD notes-perso.txt » remet dans l'index la version du dernier commit : comme le fichier n'y était pas, il en sort. Le disque, lui, n'est jamais touché : c'est « --hard » qui ferait ça, et il effacerait aussi les horaires."
      ],
      solution: ["git reset HEAD notes-perso.txt"],
      variantes: [
        { nom: "sans nommer HEAD (git le sous-entend)", lignes: ["git reset notes-perso.txt"] },
        { nom: "en désindexant tout, puis en réindexant ce qu'on garde", lignes: ["git reset", "git add index.html"] }
      ],
      pieges: [
        { nom: "effacer le fichier du disque", lignes: ["rm notes-perso.txt"], rate: [1, 2],
          pourquoi: "« rm » efface le fichier du répertoire de travail mais l'index, lui, garde sa copie : le mot de passe partirait quand même au commit suivant." },
        { nom: "committer d'abord, trier ensuite", lignes: ['git commit -m "tout"', "git rm --cached notes-perso.txt"], rate: 4,
          pourquoi: "Le mot de passe est entré dans un commit. Le retirer de l'index maintenant ne le retire pas de l'HISTOIRE : « git log -p » l'affichera toujours, et il faudra réécrire tous les commits qui suivent pour l'en sortir." },
        { nom: "tout désindexer", lignes: ["git reset"], rate: 3,
          pourquoi: "« git reset » sans chemin désindexe TOUT : les horaires de index.html sortent aussi de l'index." },
        { nom: "reset --hard", lignes: ["git reset --hard"], rate: [2, 3],
          pourquoi: "« --hard » ne se contente pas de l'index : il réécrit aussi le répertoire de travail. Les horaires d'index.html sont perdus, et « notes-perso.txt », que le « git add . » venait d'indexer, est effacé du disque. C'est l'inverse de ce qu'on voulait : « --hard » n'épargne que les fichiers JAMAIS indexés." }
      ],
      /* Des chemins qui NE résolvent rien, et que le contrôle exige de voir
         refusés : ils réussissaient tous avant que les prédicats ne soient
         renforcés. Ils ne sont pas montrés à l'apprenant. */
      triches: [
        { nom: "tout committer puis retirer le fichier de l'index",
          lignes: ["git commit -m \"tout\"", "git rm --cached notes-perso.txt"],
          pourquoi: "le mot de passe est dans l'historique" }
      ],
      lecons: ["lecon-02", "lecon-07"]
    },

    {
      id: "restaurer-fichier",
      titre: "Tu as écrasé un fichier, et rien n'est committé",
      resume: "Récupérer la version d'avant, sans perdre le reste.",
      apres: "« git checkout -- <fichier> » écrase le fichier sans prévenir : c'est l'une des rares commandes de git dont l'effet ne s'annule pas, parce que ce qu'elle jette n'a jamais été committé. Committer tôt, c'est se donner un point de retour.",
      niveau: "Débutant",
      situation: "Une redirection malheureuse a remplacé tout le contenu de « recette.txt » par une seule ligne. "
        + "Le fichier n'est pas perdu : sa version d'avant est dans le dernier commit. Attention "
        + "toutefois, « courses.txt » porte, lui, une modification en cours qu'il ne faut pas perdre.",
      but: "Rendre à « recette.txt » le contenu qu'il avait avant d'être écrasé — celui de l'index, ici identique au dernier commit — en gardant la ligne ajoutée à « courses.txt ».",
      mise: [
        'echo "Tarte aux pommes" > recette.txt',
        'echo "200 g de farine" >> recette.txt',
        'echo "3 pommes" >> recette.txt',
        'echo "farine" > courses.txt',
        "git add .",
        'git commit -m "recette et liste de courses"',
        'echo "pommes" >> courses.txt',
        'echo "oups" > recette.txt'
      ],
      objectifs: [
        {
          texte: "« recette.txt » a retrouvé ses trois lignes",
          verifier: function (d) {
            var t = A.contenuTravail(d, "recette.txt");
            return A.contient(t, "Tarte aux pommes") && A.contient(t, "3 pommes") && !A.contient(t, "oups");
          }
        },
        {
          texte: "la ligne « pommes » ajoutée à « courses.txt » est intacte",
          deja: true,
          verifier: function (d) { return A.contient(A.contenuTravail(d, "courses.txt"), "pommes"); }
        },
        {
          texte: "aucun commit n'a été ajouté : l'historique en compte toujours un",
          deja: true,
          verifier: function (d) { return A.nbCommits(d, "main") === 1; }
        }
      ],
      indices: [
        "« git status » range ce fichier dans « Changes not staged for commit » et souffle « git restore <fichier> », la forme moderne (c'est celle que la leçon 07 enseigne). Ce bac à sable ne la simule pas encore : nous emploierons l'ancienne, qui fait la même chose.",
        "C'est « git checkout ». Les deux tirets qui suivent disent à git que ce qui vient après est un CHEMIN, pas une branche.",
        "« git checkout -- recette.txt » recopie par-dessus le disque la version qui est dans l'INDEX (ici, celle du dernier commit : rien n'a été indexé depuis). Elle ne porte que sur le fichier nommé — c'est pour cela qu'on ne prend pas « git reset --hard », qui emporterait aussi la ligne de courses.txt."
      ],
      solution: ["git checkout -- recette.txt"],
      variantes: [
        { nom: "en nommant la source : le dernier commit plutôt que l'index", lignes: ["git checkout HEAD -- recette.txt"] }
      ],
      pieges: [
        { nom: "reset --hard", lignes: ["git reset --hard"], rate: 2,
          pourquoi: "« --hard » remet TOUT le répertoire de travail au dernier commit : recette.txt est bien réparé, mais la ligne de courses.txt disparaît sans un mot." },
        { nom: "committer d'abord, réfléchir ensuite", lignes: ["git add recette.txt", 'git commit -m "mise a jour de la recette"'], rate: [1, 3],
          pourquoi: "Committer par réflexe ne répare rien : la version amputée entre dans l'historique, et il faut maintenant l'annuler en plus de la restaurer." },
        { nom: "réécrire le fichier à la main", lignes: ['echo "Tarte aux pommes" > recette.txt'], rate: 1,
          pourquoi: "Retaper de mémoire, c'est justement ce que git existe pour éviter : ici, deux des trois lignes manquent." }
      ],
      /* Des chemins qui NE résolvent rien, et que le contrôle exige de voir
         refusés : ils réussissaient tous avant que les prédicats ne soient
         renforcés. Ils ne sont pas montrés à l'apprenant. */
      triches: [
        { nom: "effacer le fichier au lieu de le restaurer",
          lignes: ["rm recette.txt"],
          pourquoi: "il n'y a plus de recette du tout" }
      ],
      lecons: ["lecon-02", "lecon-07"]
    },

    {
      id: "message-faux",
      titre: "Le message de ton dernier commit est faux",
      resume: "Corriger le dernier commit sans en fabriquer un second.",
      apres: "« --amend » ne modifie pas un commit : il en fabrique un autre à sa place, avec une autre empreinte. Tant que le commit n'est parti nulle part, c'est sans conséquence ; dès qu'il est parti, c'est interdit.",
      niveau: "Intermédiaire",
      situation: "Le dernier commit s'appelle « wip ». Il n'est parti nulle part : personne d'autre "
        + "que toi ne l'a. Un message pareil ne dira rien à personne dans six mois — "
        + "toi compris.",
      but: "Que le dernier commit s'appelle « corrige le calcul de la TVA », sans qu'un commit de plus apparaisse.",
      mise: [
        'echo "prix HT : 100" > facture.txt',
        "git add .",
        'git commit -m "premiere facture"',
        'echo "TVA : 20 pourcent" >> facture.txt',
        "git add .",
        'git commit -m "wip"'
      ],
      objectifs: [
        {
          texte: "plus aucun commit ne s'appelle « wip »",
          verifier: function (d) { return !A.contientTitre(d, "main", "wip"); }
        },
        {
          texte: "le dernier commit s'appelle « corrige le calcul de la TVA »",
          verifier: function (d) {
            var t = A.oidDe(d, "main");
            return !!t && d.lireCommit(t).titre === "corrige le calcul de la TVA";
          }
        },
        {
          texte: "l'historique compte toujours deux commits",
          deja: true,
          verifier: function (d) { return A.nbCommits(d, "main") === 2; }
        },
        {
          texte: "le contenu committé est intact : le prix hors taxes ET la TVA",
          deja: true,
          verifier: function (d) {
            return A.contenuCommite(d, "main", "facture.txt") === "prix HT : 100\nTVA : 20 pourcent\n";
          }
        }
      ],
      indices: [
        "Il ne s'agit pas d'ajouter un commit, mais de REFAIRE le dernier.",
        "« git commit --amend » remplace le commit du dessus par un nouveau, bâti sur l'index tel qu'il est à cet instant : si tu n'as rien indexé depuis, le contenu est repris à l'identique et seul le message change.",
        "« git commit --amend -m \"corrige le calcul de la TVA\" ». Attention : l'empreinte change, donc le commit n'est plus le même objet. C'est sans danger tant que personne d'autre ne l'a — c'est la seule condition, et elle est absolue."
      ],
      solution: ['git commit --amend -m "corrige le calcul de la TVA"'],
      variantes: [
        { nom: "en défaisant le commit puis en le refaisant", lignes: ["git reset --soft HEAD~1", 'git commit -m "corrige le calcul de la TVA"'] }
      ],
      pieges: [
        { nom: "ajouter un commit qui rectifie", lignes: ['git commit --allow-empty -m "corrige le calcul de la TVA"'], rate: [1, 3],
          pourquoi: "Le « wip » reste dans l'historique, pour toujours, et il y a maintenant deux commits là où un suffisait." },
        { nom: "effacer le commit", lignes: ["git reset --hard HEAD~1"], rate: [2, 3, 4],
          pourquoi: "Le mauvais message disparaît, mais la ligne de TVA avec lui : on voulait corriger une étiquette, pas jeter le travail." }
      ],
      /* Des chemins qui NE résolvent rien, et que le contrôle exige de voir
         refusés : ils réussissaient tous avant que les prédicats ne soient
         renforcés. Ils ne sont pas montrés à l'apprenant. */
      triches: [
        { nom: "amender en écrasant le contenu du commit",
          lignes: ["echo \"TVA : 20 pourcent\" > facture.txt", "git add .", "git commit --amend -m \"corrige le calcul de la TVA\""],
          pourquoi: "le prix hors taxes a disparu du commit" }
      ],
      lecons: ["lecon-07"]
    },

    {
      id: "mauvaise-branche",
      titre: "Tu as committé sur « main », ça devait aller sur une branche à part",
      resume: "Déplacer un commit vers une branche, et remettre main où elle était.",
      apres: "Une branche est une étiquette, pas un contenant : déplacer du travail d'une branche à l'autre revient à déplacer des étiquettes. Tant qu'une étiquette retient un commit, rien ne se perd.",
      niveau: "Intermédiaire",
      situation: "Le commit « ajoute le paiement en trois fois » est sur « main ». Il devait aller "
        + "sur une branche à part : la fonctionnalité n'est pas décidée, et « main » doit rester "
        + "livrable à tout moment. Rien n'est parti ailleurs, tu peux encore réparer proprement.",
      but: "Le commit doit être sur une branche « paiement », et « main » doit revenir à l'état d'avant — sans que le travail soit perdu.",
      mise: [
        'echo "boutique en ligne" > index.html',
        "git add .",
        'git commit -m "page d\'accueil"',
        'echo "paiement en 3 fois : actif" > paiement.txt',
        "git add .",
        'git commit -m "ajoute le paiement en trois fois"'
      ],
      objectifs: [
        {
          texte: "une branche « paiement » existe",
          verifier: function (d) { return A.existeBranche(d, "paiement"); }
        },
        {
          texte: "elle contient le commit « ajoute le paiement en trois fois »",
          verifier: function (d) { return A.contientTitre(d, "paiement", "ajoute le paiement en trois fois"); }
        },
        {
          texte: "« main » ne le contient plus, et n'a plus qu'un commit",
          verifier: function (d) {
            return !A.contientTitre(d, "main", "ajoute le paiement en trois fois") && A.nbCommits(d, "main") === 1;
          }
        },
        {
          texte: "le commit de la branche porte « paiement.txt » — et le reste du site avec",
          verifier: function (d) {
            return A.contient(A.contenuCommite(d, "paiement", "paiement.txt"), "actif")
              && A.contenuCommite(d, "paiement", "index.html") === "boutique en ligne\n";
          }
        }
      ],
      indices: [
        "Un commit n'appartient à aucune branche : une branche n'est qu'une étiquette qui pointe sur un commit. Le travail est donc déjà là où il faut — il n'y a qu'à poser une étiquette dessus, puis reculer l'autre.",
        "« git branch paiement » pose l'étiquette sur le commit courant, sans changer de branche. Reste à faire reculer « main » d'un cran.",
        "« git branch paiement » puis « git reset --hard HEAD~1 ». Le « --hard » est sans danger ICI, et uniquement ici : le commit est retenu par l'étiquette « paiement », donc rien ne se perd. Sans elle, le commit deviendrait orphelin."
      ],
      solution: ["git branch paiement", "git reset --hard HEAD~1"],
      variantes: [
        { nom: "en basculant sur la branche d'abord", lignes: ["git checkout -b paiement", "git checkout main", "git reset --hard HEAD~1", "git checkout paiement"] },
        { nom: "en nommant explicitement le commit sur lequel poser l'étiquette", lignes: ["git branch paiement HEAD", "git reset --hard HEAD~1"] }
      ],
      pieges: [
        { nom: "reculer main sans avoir posé l'étiquette", lignes: ["git reset --hard HEAD~1"], rate: [1, 2, 4],
          pourquoi: "Le commit n'est plus retenu par rien : il devient orphelin, et git le jettera au bout de trente jours. Dans un vrai dépôt, « git reflog » le retrouverait ; ce bac à sable ne simule pas le reflog — ici, seule la case « Montrer aussi les commits abandonnés » y mène. Poser l'étiquette d'abord évite de dépendre d'un filet." },
        { nom: "annuler le commit avec revert", lignes: ["git revert HEAD", "git branch paiement"], rate: [3, 4],
          pourquoi: "« revert » n'efface rien : il ajoute un commit qui défait le précédent. « main » contient donc toujours le paiement, plus son annulation." }
      ],
      /* Des chemins qui NE résolvent rien, et que le contrôle exige de voir
         refusés : ils réussissaient tous avant que les prédicats ne soient
         renforcés. Ils ne sont pas montrés à l'apprenant. */
      triches: [
        { nom: "poser l'étiquette sur un commit refait sans le site",
          lignes: ["git reset --hard HEAD~1", "rm index.html", "echo \"paiement en 3 fois : actif\" > paiement.txt", "git add -A", "git commit -m \"ajoute le paiement en trois fois\"", "git branch paiement", "git reset --hard HEAD~1"],
          pourquoi: "le commit de la branche ne contient plus la page d'accueil" }
      ],
      lecons: ["lecon-04", "lecon-07"]
    },

    {
      id: "conflit",
      titre: "Tu es au milieu d'un conflit de fusion",
      resume: "Trancher entre deux versions, puis terminer la fusion.",
      apres: "Git ne comprend pas ton code : il constate que les deux côtés ont touché aux mêmes lignes, et te laisse trancher. Ici « git add » fait deux choses : il met dans l'index le contenu que tu as choisi, et il efface les trois versions que git y gardait — c'est ce second effet qui déclare le conflit résolu.",
      niveau: "Intermédiaire",
      situation: "La fusion de la branche « promo » s'est arrêtée : les deux côtés ont modifié la "
        + "même ligne de « tarifs.txt ». Git a écrit les deux versions dans le fichier, entre des "
        + "marqueurs, et il attend que tu tranches. La décision a été prise en réunion : c'est le "
        + "tarif de la promo, 7 euros, qui s'applique.",
      but: "Terminer la fusion avec le tarif de la promo, et un fichier propre.",
      mise: [
        'echo "Abonnement : 9 euros" > tarifs.txt',
        "git add .",
        'git commit -m "grille tarifaire"',
        "git checkout -b promo",
        'echo "Abonnement : 7 euros" > tarifs.txt',
        "git add .",
        'git commit -m "tarif de lancement"',
        "git checkout main",
        'echo "Abonnement : 12 euros" > tarifs.txt',
        "git add .",
        'git commit -m "hausse annuelle"',
        "git merge promo"
      ],
      objectifs: [
        {
          texte: "plus aucun fichier n'est en conflit, et aucune fusion n'est en cours",
          verifier: function (d) { return !A.enConflit(d) && !A.operation(d); }
        },
        {
          texte: "« tarifs.txt » ne contient plus aucun marqueur de conflit, ni sur le disque ni dans le commit",
          verifier: function (d) {
            return !A.marqueurs(A.contenuTravail(d, "tarifs.txt"))
              && !A.marqueurs(A.contenuCommite(d, "main", "tarifs.txt"));
          }
        },
        {
          texte: "le fichier committé contient exactement le tarif de la promo",
          verifier: function (d) { return A.contenuCommite(d, "main", "tarifs.txt") === "Abonnement : 7 euros\n"; }
        },
        {
          texte: "le dernier commit de « main » est bien une fusion : il a deux parents",
          verifier: function (d) { return A.nbParents(d, "main") === 2; }
        }
      ],
      indices: [
        "Ouvre le fichier avec « cat tarifs.txt » : entre « <<<<<<< » et « ======= » se trouve TA version, entre « ======= » et « >>>>>>> » celle qui arrive.",
        "Résoudre un conflit, c'est écrire le fichier tel qu'il doit être — marqueurs compris, ils doivent disparaître. Ici, tape « echo \"Abonnement : 7 euros\" > tarifs.txt ».",
        "Puis « git add tarifs.txt » : c'est l'ajout à l'index qui dit à git « celui-là, j'ai tranché ». Enfin « git commit -m \"fusionne promo\" » referme la fusion. Le commit qui en sort a DEUX parents : c'est ce qui distingue une fusion d'un commit ordinaire."
      ],
      solution: [
        'echo "Abonnement : 7 euros" > tarifs.txt',
        "git add tarifs.txt",
        'git commit -m "fusionne promo"'
      ],
      variantes: [
        { nom: "en indexant tout d'un coup", lignes: ['echo "Abonnement : 7 euros" > tarifs.txt', "git add .", 'git commit -m "fusionne promo"'] }
      ],
      pieges: [
        { nom: "committer sans avoir retiré les marqueurs", lignes: ["git add tarifs.txt", 'git commit -m "fusionne promo"'], rate: [2, 3],
          pourquoi: "Rien n'empêche de committer un fichier plein de « <<<<<<< » : git ne lit pas le contenu, il constate seulement que le chemin a été indexé. La fusion se referme, le dépôt paraît propre — et c'est le programme qui casse." },
        { nom: "abandonner la fusion", lignes: ["git merge --abort"], rate: [3, 4],
          pourquoi: "« --abort » remet le dépôt exactement comme avant la fusion : c'est utile quand on veut réessayer plus tard, mais ici la fusion reste à faire." }
      ],
      /* Des chemins qui NE résolvent rien, et que le contrôle exige de voir
         refusés : ils réussissaient tous avant que les prédicats ne soient
         renforcés. Ils ne sont pas montrés à l'apprenant. */
      triches: [
        { nom: "committer un fichier qui garde deux marqueurs sur trois",
          lignes: ["echo \"=======\" > tarifs.txt", "echo \"Abonnement : 7 euros\" >> tarifs.txt", "echo \">>>>>>> promo\" >> tarifs.txt", "git add tarifs.txt", "git commit -m \"fusionne promo\""],
          pourquoi: "les marqueurs sont dans le commit" },
        { nom: "committer proprement puis resalir le fichier",
          lignes: ["echo \"Abonnement : 7 euros\" > tarifs.txt", "git add tarifs.txt", "git commit -m \"fusionne promo\"", "echo \"<<<<<<< HEAD\" > tarifs.txt"],
          pourquoi: "le commit est juste, mais le fichier sur le disque porte de nouveau un marqueur" },
        { nom: "garder les deux tarifs dans le fichier",
          lignes: ["echo \"Abonnement : 7 euros\" > tarifs.txt", "echo \"Abonnement : 12 euros\" >> tarifs.txt", "git add tarifs.txt", "git commit -m \"fusionne promo\""],
          pourquoi: "le fichier annonce deux prix" }
      ],
      lecons: ["lecon-05", "lecon-06"]
    },

    {
      id: "annuler-partage",
      titre: "Il faut annuler un commit que les autres ont déjà",
      resume: "Défaire un changement sans réécrire une histoire partagée.",
      apres: "Deux façons de défaire : réécrire (reset, amend, rebase) ou ajouter (revert). La première n'est permise que sur ce que personne n'a encore récupéré. La règle tient en une phrase : on ne réécrit jamais une histoire publiée.",
      niveau: "Intermédiaire",
      situation: "Le commit « active le mode debug » est parti en production, et il a été récupéré "
        + "par toute l'équipe. Il faut défaire son effet. Mais réécrire l'histoire d'un commit que "
        + "d'autres ont déjà, c'est leur fabriquer un dépôt qui ne correspond plus au tien : "
        + "interdit.",
      but: "Que le mode debug ne soit plus actif, sans qu'aucun commit existant ne disparaisse.",
      mise: [
        'echo "nom du site : mediatheque" > config.txt',
        "git add .",
        'git commit -m "configuration de base"',
        'echo "DEBUG = true" >> config.txt',
        "git add .",
        'git commit -m "active le mode debug"'
      ],
      objectifs: [
        {
          /* ⚠️ « ne contient plus DEBUG = true » laissait passer « DEBUG  = true »
             (deux espaces), et même l'effacement pur et simple du fichier —
             « contenuCommite » rendant null, la négation était vraie. On exige donc
             le contenu EXACT d'avant le commit fautif. */
          texte: "« config.txt » est revenu exactement à ce qu'il était avant le mode debug",
          verifier: function (d) { return A.contenuCommite(d, "main", "config.txt") === "nom du site : mediatheque\n"; }
        },
        {
          texte: "le commit « active le mode debug » est TOUJOURS dans l'historique",
          deja: true,
          verifier: function (d) { return A.contientTitre(d, "main", "active le mode debug"); }
        },
        {
          /* On regarde la FORME de l'histoire, pas le message : un titre
             « Revert "… » se fabrique à la main, et à l'inverse « git revert -n »
             suivi d'un message à soi est une réponse parfaitement juste. */
          texte: "un commit a été ajouté PAR-DESSUS celui du mode debug, qui reste en place",
          verifier: function (d) {
            return A.nbCommits(d, "main") === 3
              && A.titreDe(d, A.parentDe(d, "main")) === "active le mode debug";
          }
        }
      ],
      indices: [
        "Deux commandes défont un commit, et elles ne font pas du tout la même chose : l'une le retire de l'histoire, l'autre ajoute un commit qui l'annule. Ici, seule la seconde est permise.",
        "« git revert » calcule le changement inverse et en fait un commit de plus. L'histoire s'allonge au lieu de se réécrire : personne n'a besoin de rien réparer de son côté.",
        "« git revert HEAD ». Le commit qui en sort s'appelle « Revert \"active le mode debug\" » — git le nomme lui-même, et cela reste lisible dans six mois."
      ],
      solution: ["git revert HEAD"],
      variantes: [
        { nom: "en désignant le commit par la branche qui le porte", lignes: ["git revert main"] }
      ],
      pieges: [
        { nom: "reculer la branche", lignes: ["git reset --hard HEAD~1"], rate: [2, 3],
          pourquoi: "Chez toi, le résultat a l'air parfait. Chez les autres, le commit existe toujours : à leur prochain échange, il reviendra — ou bien c'est leur travail qui sautera." },
        { nom: "se tromper de commit à annuler", lignes: ["git revert HEAD~1"], rate: [1, 3],
          pourquoi: "« HEAD~1 » désigne le commit d'AVANT le dernier. Git tente d'annuler la création du fichier de configuration, se heurte à un conflit « modify/delete » — et le mode debug, lui, reste actif." },
        { nom: "refaire le commit sans la ligne", lignes: ['echo "nom du site : mediatheque" > config.txt', 'echo "DEBUG = false" >> config.txt', "git add .", 'git commit --amend -m "configuration sans debug"'], rate: [1, 2, 3],
          pourquoi: "« --amend » remplace le commit du dessus par un autre, d'empreinte différente : c'est exactement la réécriture qu'on s'interdit ici. Le commit que les autres ont n'existe plus chez toi." }
      ],
      /* Des chemins qui NE résolvent rien, et que le contrôle exige de voir
         refusés : ils réussissaient tous avant que les prédicats ne soient
         renforcés. Ils ne sont pas montrés à l'apprenant. */
      triches: [
        { nom: "effacer le fichier de configuration",
          lignes: ["git rm config.txt", "git commit -m \"Revert le mode debug\""],
          pourquoi: "le dépôt n'a plus de configuration du tout" },
        { nom: "laisser le mode debug avec une espace de plus",
          lignes: ["echo \"nom du site : mediatheque\" > config.txt", "echo \"DEBUG  = true\" >> config.txt", "git add .", "git commit -m \"Revert le mode debug\""],
          pourquoi: "le mode debug est toujours actif" }
      ],
      lecons: ["lecon-07"]
    },

    {
      id: "rebaser",
      titre: "Ta branche est partie d'une base périmée",
      resume: "Rejouer ses commits par-dessus la version à jour de main.",
      apres: "Fusionner garde l'histoire telle qu'elle s'est passée ; rebaser la réécrit pour qu'elle se lise mieux. Aucune des deux n'est meilleure : c'est un choix d'équipe, et il se décide avant, pas pendant.",
      niveau: "Avancé",
      situation: "Tu travailles sur « menu » depuis deux jours. Pendant ce temps, « main » a avancé "
        + "de deux commits. Ta branche part donc d'un point que « main » a dépassé depuis. L'équipe demande "
        + "un historique linéaire : pas de commit de fusion sur les petites branches.",
      but: "Que les commits de « menu » repartent du sommet de « main », en une seule ligne d'histoire.",
      mise: [
        'echo "site" > index.html',
        "git add .",
        'git commit -m "socle du site"',
        "git checkout -b menu",
        'echo "accueil" > menu.html',
        "git add .",
        'git commit -m "premier menu"',
        'echo "accueil, contact" > menu.html',
        "git add .",
        'git commit -m "ajoute contact au menu"',
        "git checkout main",
        'echo "footer" > pied.html',
        "git add .",
        'git commit -m "ajoute le pied de page"',
        'echo "logo" > logo.svg',
        "git add .",
        'git commit -m "ajoute le logo"',
        "git checkout menu"
      ],
      objectifs: [
        {
          /* ⚠️ Comparer des TITRES ne suffit pas : deux « git commit --allow-empty »
             portant les bons titres suffisaient à réussir, sur une branche qui ne
             contenait ni le pied de page ni le logo. On exige que « main » soit
             ANCÊTRE de « menu » — c'est cela, repartir du sommet — et que les
             fichiers y soient pour de bon. */
          texte: "« menu » repart bien du sommet de « main » : elle en descend, avec le pied de page et le logo",
          verifier: function (d) {
            return A.estAncetre(d, "main", "menu")
              && A.contenuCommite(d, "menu", "pied.html") === "footer\n"
              && A.contenuCommite(d, "menu", "logo.svg") === "logo\n";
          }
        },
        {
          texte: "elle contient toujours ses deux commits à elle, et son menu complet",
          deja: true,
          verifier: function (d) {
            return A.contientTitre(d, "menu", "premier menu")
              && A.contientTitre(d, "menu", "ajoute contact au menu")
              && A.contenuCommite(d, "menu", "menu.html") === "accueil, contact\n";
          }
        },
        {
          texte: "l'histoire est linéaire : aucun commit de fusion",
          deja: true,
          verifier: function (d) { return A.lineaire(d, "menu"); }
        },
        {
          texte: "« main » n'a pas bougé : elle a toujours ses trois commits",
          deja: true,
          verifier: function (d) {
            return A.nbCommits(d, "main") === 3 && !A.contientTitre(d, "main", "premier menu");
          }
        }
      ],
      indices: [
        "Deux façons d'incorporer main : la fusionner dans ta branche, ou rejouer tes commits par-dessus. L'équipe a demandé une histoire linéaire — la seconde, donc.",
        "« git rebase » prend tes commits, les met de côté, avance ta branche sur le sommet indiqué, puis les rejoue un par un.",
        "« git rebase main », depuis la branche « menu ». Tes commits sont RECOPIÉS : leurs empreintes changent. C'est pour cela qu'on ne rebase jamais une branche que d'autres ont déjà récupérée."
      ],
      solution: ["git rebase main"],
      variantes: [
        { nom: "en nommant la branche à rebaser (git s'y place tout seul)", lignes: ["git rebase main menu"] }
      ],
      pieges: [
        { nom: "fusionner main dans la branche", lignes: ["git merge main"], rate: 3,
          pourquoi: "Le résultat contient bien tout, mais par un commit de fusion : l'histoire n'est plus linéaire, ce que l'équipe refusait." },
        { nom: "remettre sa branche sur main", lignes: ["git reset --hard main"], rate: 2,
          pourquoi: "« reset --hard main » ne rapproche pas les deux branches : il jette les commits de « menu » et la pose exactement sur « main ». Deux jours de travail, sans un avertissement." },
        { nom: "rebaser dans le mauvais sens", lignes: ["git checkout main", "git rebase menu"], rate: [1, 4],
          pourquoi: "C'est « main » qui est rejouée sur « menu » : la branche partagée bouge, exactement ce qu'il ne faut pas faire." }
      ],
      /* Des chemins qui NE résolvent rien, et que le contrôle exige de voir
         refusés : ils réussissaient tous avant que les prédicats ne soient
         renforcés. Ils ne sont pas montrés à l'apprenant. */
      triches: [
        { nom: "fabriquer deux commits VIDES portant les bons titres",
          lignes: ["git commit --allow-empty -m \"ajoute le pied de page\"", "git commit --allow-empty -m \"ajoute le logo\""],
          pourquoi: "ni le pied de page ni le logo ne sont sur la branche, qui ne descend toujours pas de main" }
      ],
      lecons: ["lecon-12"]
    },

    {
      id: "un-seul-commit",
      titre: "Tu ne veux qu'UN commit d'une autre branche",
      resume: "Transplanter un commit précis sans fusionner toute la branche.",
      apres: "Un cherry-pick COPIE un changement : le commit d'arrivée est un autre objet, avec une autre empreinte. Le même changement existe alors à deux endroits, et c'est normal.",
      niveau: "Avancé",
      situation: "La branche « refonte » n'est pas prête et ne le sera pas avant longtemps. Mais "
        + "elle contient la mise à jour du millésime du pied de page, et celle-là doit partir tout "
        + "de suite sur « main ». Fusionner toute la branche est hors de question.",
      but: "Avoir la correction du pied de page sur « main », et rien d'autre de la refonte.",
      mise: [
        'echo "Bienvenue" > index.html',
        'echo "Tous droits reserves" > pied.html',
        "git add .",
        'git commit -m "site initial"',
        "git checkout -b refonte",
        'echo "Bienvenue sur le nouveau site" > index.html',
        "git add .",
        'git commit -m "refond la page d\'accueil"',
        'echo "Tous droits reserves 2026" > pied.html',
        "git add .",
        'git commit -m "corrige la faute du pied de page"',
        'echo "menu : accueil, contact" > menu.html',
        "git add .",
        'git commit -m "ajoute le menu"',
        "git checkout main"
      ],
      objectifs: [
        {
          texte: "« main » contient un commit « corrige la faute du pied de page »",
          verifier: function (d) { return A.contientTitre(d, "main", "corrige la faute du pied de page"); }
        },
        {
          texte: "sur « main », le pied de page porte le millésime ET la page d'accueil n'a pas bougé",
          verifier: function (d) {
            return A.contient(A.contenuCommite(d, "main", "pied.html"), "2026")
              && A.contenuCommite(d, "main", "index.html") === "Bienvenue\n";
          }
        },
        {
          texte: "« main » ne contient NI la refonte de l'accueil NI le menu",
          deja: true,
          verifier: function (d) {
            return !A.contientTitre(d, "main", "refond la page d'accueil")
              && !A.contientTitre(d, "main", "ajoute le menu")
              && A.contenuCommite(d, "main", "menu.html") === null;
          }
        }
      ],
      indices: [
        "Fusionner apporterait toute la branche. Ce qu'il faut, c'est copier UN commit : reprendre son changement et le rejouer ici.",
        "« git cherry-pick » fait exactement cela. Il lui faut le commit à transplanter : « git log refonte --oneline » te donne les empreintes, et « refonte~1 » désigne « le commit d'avant le sommet de refonte ».",
        "« git cherry-pick refonte~1 ». Le commit obtenu porte le même titre et le même changement, mais une AUTRE empreinte : c'est une copie, pas le commit d'origine. Les deux resteront dans l'histoire, même après la fusion de « refonte » — « git log » affichera deux fois le même titre. C'est le prix du cherry-pick."
      ],
      solution: ["git cherry-pick refonte~1"],
      variantes: [
        { nom: "en désignant le commit autrement", lignes: ["git cherry-pick refonte^"] }
      ],
      pieges: [
        { nom: "fusionner la branche", lignes: ["git merge refonte"], rate: [2, 3],
          pourquoi: "La fusion apporte les quatre commits : la refonte inachevée arrive sur main avec la correction." },
        { nom: "transplanter sans changer de branche", lignes: ["git checkout refonte", "git cherry-pick refonte~1"], rate: [1, 2],
          pourquoi: "Le cherry-pick s'applique sur la branche COURANTE. Resté sur « refonte », tu lui rejoues un changement qu'elle a déjà : git s'arrête sur « The previous cherry-pick is now empty » et te laisse un cherry-pick EN COURS à dénouer (« git cherry-pick --abort »). « main », elle, n'a toujours rien." },
        { nom: "se tromper de commit", lignes: ["git cherry-pick refonte"], rate: [1, 2, 3],
          pourquoi: "« refonte » tout court désigne le SOMMET de la branche, c'est-à-dire le menu — pas la correction du pied de page." }
      ],
      /* Des chemins qui NE résolvent rien, et que le contrôle exige de voir
         refusés : ils réussissaient tous avant que les prédicats ne soient
         renforcés. Ils ne sont pas montrés à l'apprenant. */
      triches: [
        { nom: "refaire le pied de page en effaçant la page d'accueil",
          lignes: ["echo \"Tous droits reserves 2026\" > pied.html", "rm index.html", "git add -A", "git commit -m \"corrige la faute du pied de page\""],
          pourquoi: "la page d'accueil a disparu de main" }
      ],
      lecons: ["lecon-12", "lecon-20"]
    },

    {
      id: "commit-perdu",
      titre: "Un « reset --hard » a emporté un commit",
      resume: "Retrouver un commit qu'aucune branche ne retient plus.",
      apres: "Git ne détruit presque jamais : il oublie des chemins. Tant que le commit existe, une étiquette suffit à le ramener. Dans un vrai dépôt, « git reflog » garde la trace des positions récentes de HEAD — c'est le filet de sécurité que ce bac à sable ne simule pas.",
      niveau: "Avancé",
      situation: "Tu voulais revenir en arrière d'un cran. Tu as tapé « git reset --hard "
        + "HEAD~1 », qui recule la branche d'un cran : le commit « ajoute le formulaire de contact » "
        + "n'est plus dans « git log ». Il n'est pas détruit pour autant — git ne jette un objet "
        + "devenu inatteignable qu'au bout de trente jours. Il n'est simplement retenu par aucune "
        + "étiquette.",
      but: "Faire revenir le commit du formulaire dans l'historique de « main ».",
      mise: [
        'echo "accueil" > index.html',
        "git add .",
        'git commit -m "page d\'accueil"',
        'echo "email : contact@exemple.invalid" > contact.html',
        "git add .",
        'git commit -m "ajoute le formulaire de contact"',
        "git reset --hard HEAD~1"
      ],
      objectifs: [
        {
          texte: "le commit « ajoute le formulaire de contact » est de nouveau atteignable depuis « main »",
          verifier: function (d) { return A.contientTitre(d, "main", "ajoute le formulaire de contact"); }
        },
        {
          /* Le commit committé ET le fichier sur le disque : « git branch -f main
             <empreinte> » ramène l'un sans l'autre, et le travail reste
             introuvable là où l'apprenant le cherche. */
          texte: "« contact.html » est revenu, dans le commit comme sur le disque",
          verifier: function (d) {
            return A.contient(A.contenuCommite(d, "main", "contact.html"), "contact@exemple.invalid")
              && A.contient(A.contenuTravail(d, "contact.html"), "contact@exemple.invalid");
          }
        }
      ],
      indices: [
        "Le commit existe encore : il n'est plus qu'orphelin, c'est-à-dire qu'aucune branche ne mène à lui. Coche « Montrer aussi les commits abandonnés » sous le graphe : il réapparaît, avec son empreinte.",
        "Une empreinte suffit à désigner un commit — les sept premiers caractères font l'affaire. Dans un vrai dépôt, « git reflog » liste les positions récentes de HEAD ; le bac à sable, lui, te les montre dans le graphe.",
        "« git reset --hard <empreinte> » ramène main dessus. « git branch sauvetage <empreinte> » serait plus prudent encore : elle pose une étiquette sans rien déplacer, et laisse le temps de vérifier."
      ],
      /* ⚠️ Le seul scénario dont la solution ne peut pas être une constante :
         l'empreinte du commit perdu dépend du dépôt. Elle est donc CALCULÉE, et
         le texte affiché montre l'espace réservé. C'est aussi ce que l'apprenant
         vit : il doit lire l'empreinte dans le graphe avant de pouvoir taper la
         commande. */
      solutionTexte: ["git reset --hard <empreinte du commit perdu>"],
      solution: function (depot) {
        var perdu = orphelinIntitule(depot, "ajoute le formulaire de contact");
        return perdu ? ["git reset --hard " + perdu] : [];
      },
      variantes: [
        {
          nom: "en posant d'abord une étiquette de sauvetage",
          lignes: function (depot) {
            var perdu = orphelinIntitule(depot, "ajoute le formulaire de contact");
            return perdu ? ["git branch sauvetage " + perdu, "git merge sauvetage"] : [];
          }
        }
      ],
      pieges: [
        {
          nom: "aller voir le commit sans rien y attacher",
          lignes: function (depot) {
            var perdu = orphelinIntitule(depot, "ajoute le formulaire de contact");
            return perdu ? ["git checkout " + perdu] : [];
          },
          rate: [1, 2],
          pourquoi: "Se poser SUR le commit (HEAD détaché) le rend visible, mais aucune branche ne le retient : dès qu'on repart sur « main », il redevient orphelin. Voir ne suffit pas, il faut accrocher."
        },
        { nom: "chercher dans le journal", lignes: ["git log --oneline"], rate: [1, 2],
          pourquoi: "« git log » ne montre que ce qui est atteignable depuis HEAD : le commit orphelin n'y est pas, et il n'y reparaîtra que le jour où une référence pointera de nouveau sur lui. Chercher là ne le ramène pas." }
      ],
      /* Des chemins qui NE résolvent rien, et que le contrôle exige de voir
         refusés : ils réussissaient tous avant que les prédicats ne soient
         renforcés. Ils ne sont pas montrés à l'apprenant. */
      triches: [
        { nom: "refaire un commit du même titre sans le contenu",
          lignes: ["echo \"a completer\" > contact.html", "git add .", "git commit -m \"ajoute le formulaire de contact\""],
          pourquoi: "l'adresse de contact n'est pas revenue" }
      ],
      lecons: ["lecon-19"]
    }
  ];

  /* Un commit qu'aucune référence n'atteint, repéré par son titre. Sert à la
     solution calculée du dernier scénario : dans la page, l'apprenant fait la
     même chose à l'œil en cochant « montrer les commits abandonnés ». */
  function orphelinIntitule(depot, titre) {
    var atteignables = {}, r, i;
    for (r in depot.refs) {
      if (!Object.prototype.hasOwnProperty.call(depot.refs, r)) continue;
      var vus = depot.ancetres(depot.refs[r]);
      for (var o in vus) if (Object.prototype.hasOwnProperty.call(vus, o)) atteignables[o] = true;
    }
    var tete = depot.oidHEAD();
    if (tete) {
      var vusH = depot.ancetres(tete);
      for (var o2 in vusH) if (Object.prototype.hasOwnProperty.call(vusH, o2)) atteignables[o2] = true;
    }
    var tous = Object.keys(depot.objets);
    for (i = 0; i < tous.length; i++) {
      if (depot.typeDe(tous[i]) !== "commit" || atteignables[tous[i]]) continue;
      if (depot.lireCommit(tous[i]).titre === titre) return tous[i];
    }
    return null;
  }

  /* Le titre EXACT de chaque leçon citée, pour que le lien affiché ne soit pas
     un simple numéro. `tools/verif-git-scenarios.js` le compare au <h1> du
     fichier : un cours qui renomme une leçon rend l'outil rouge, ce qui vaut
     mieux qu'un libellé périmé que personne ne relit. */
  var TITRES_LECONS = {
    "lecon-02": "Premier dépôt et commits",
    "lecon-04": "Travailler avec des branches",
    "lecon-05": "Fusionner des branches",
    "lecon-06": "Résoudre les conflits",
    "lecon-07": "Annuler et corriger",
    "lecon-12": "Rebase et historique propre",
    "lecon-19": "Gros dépôts et récupération avancée",
    "lecon-20": "Cherry-pick : transplanter un commit"
  };

  /* --- l'évaluation ----------------------------------------------------------
     Un objectif qui LÈVE est un objectif NON ATTEINT, jamais une page cassée :
     l'apprenant peut mettre le dépôt dans un état que le prédicat n'attendait
     pas (une branche effacée, un HEAD détaché), et ce n'est pas une raison pour
     que le bac à sable s'arrête de fonctionner. */
  function evaluer(depot, scenario) {
    var out = [], reussi = true;
    for (var i = 0; i < scenario.objectifs.length; i++) {
      var atteint = false;
      try { atteint = !!scenario.objectifs[i].verifier(depot); } catch (e) { atteint = false; }
      out.push({ texte: scenario.objectifs[i].texte, atteint: atteint });
      if (!atteint) reussi = false;
    }
    return { objectifs: out, reussi: reussi };
  }

  function parId(id) {
    for (var i = 0; i < SCENARIOS.length; i++) if (SCENARIOS[i].id === id) return SCENARIOS[i];
    return null;
  }

  /* La table INVERSE : quelle leçon du cours `git` mène à quel scénario. C'est
     elle que `js/lecon.js` recopie pour poser son encart — et
     `tools/verif-git-scenarios.js` exige que les deux coïncident, sinon une
     leçon renverrait vers un scénario qui ne la concerne pas. */
  var LECONS = (function () {
    var t = {};
    for (var i = 0; i < SCENARIOS.length; i++) {
      for (var j = 0; j < SCENARIOS[i].lecons.length; j++) {
        var l = SCENARIOS[i].lecons[j];
        if (!t[l]) t[l] = [];
        t[l].push(SCENARIOS[i].id);
      }
    }
    return t;
  })();

  var GitScenarios = {
    SCENARIOS: SCENARIOS,
    LECONS: LECONS,
    TITRES_LECONS: TITRES_LECONS,
    parId: parId,
    evaluer: evaluer,
    aides: A,
    orphelinIntitule: orphelinIntitule
  };

  if (typeof module !== "undefined" && module.exports) module.exports = GitScenarios;
  if (racine) racine.GitScenarios = GitScenarios;
})(typeof window !== "undefined" ? window : null);
