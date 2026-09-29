/* =============================================================================
   git-modele.js — le MODÈLE d'un dépôt Git, en mémoire, en JavaScript pur
   (chantier V14, point D1). Aucune dépendance, aucun module ES, aucun réseau :
   il tourne en `file://` dans le navigateur comme dans Node (pour les outils
   `tools/verif-git-modele.js` et `tools/preuves/git-modele.js`).

   POURQUOI CE FICHIER EXISTE
   Le cours `git` compte 24 leçons et aucune pratique : on y lit ce que fait
   `rebase`, on ne le fait pas. Or un dépôt Git n'est pas une boîte noire, c'est
   une structure de données : un magasin d'objets adressés par leur empreinte,
   des références qui pointent dedans, un index, un répertoire de travail. Tout
   cela se simule exactement en JavaScript.

   CE QUI EST SIMULÉ *EXACTEMENT*, ET POURQUOI ÇA COMPTE
   Les identifiants ne sont pas inventés : ce sont les VRAIS identifiants Git.
   Un blob est haché comme « blob <taille>\0<octets> » en SHA-1, un arbre et un
   commit suivent le format binaire réel. Conséquence : l'apprenant qui tape
   `git hash-object` dans un vrai terminal retrouve, au caractère près,
   l'empreinte affichée par le bac à sable. Un modèle qui inventerait des
   numéros de commit (« c1 », « c2 ») enseignerait un Git imaginaire.
   `tools/verif-git-modele.js` confronte chaque empreinte au vrai `git`.

   CE QUI N'EST PAS SIMULÉ, ET QUI EST ASSUMÉ (voir docs/chantiers/CHANTIER-V14.md, point D1)
   - la détection des renommages (`git status` affiche `R`, ici c'est un ajout
     plus une suppression — comme `git status --no-renames`) ;
   - le repli des dossiers non suivis (`?? sous/` chez git, ici un chemin par
     fichier — comme `git status -uall`) ;
   - le reflog, donc `HEAD@{n}` ; les dépôts distants ; un sous-module est gardé
     dans l'index mais n'a pas de contenu de travail ;
   - quand deux commits ont PLUSIEURS bases de fusion, `basesDeFusion` les rend
     toutes (et cet ensemble est celui de `git merge-base --all`), mais le
     représentant que rend `baseDeFusion` n'est pas forcément celui de
     `git merge-base` : git choisit selon son parcours interne.

   DÉCOUPAGE : ce fichier est la PLOMBERIE (le modèle et ses opérations de bas
   niveau). Les commandes que l'apprenant tape — add, commit, branch, checkout,
   merge, rebase, reset, revert, cherry-pick — sont le point D2 et s'écrivent
   par-dessus ; le dessin du graphe est le point D3.
   ============================================================================= */
(function (racine) {
  "use strict";

  /* ---------------------------------------------------------------------------
     0. Dictionnaires SANS PROTOTYPE.
     Un chemin de fichier est une donnée de l'apprenant : il peut s'appeler
     `constructor`, `toString` ou `__proto__`. Avec un objet ordinaire, ces
     noms-là ne se comportent pas comme les autres — `dossiers["constructor"]`
     est déjà vrai sans qu'on ait rien écrit, et affecter `travail["__proto__"]`
     ne fait RIEN. Trois passes adversariales ont mesuré 22 divergences dues à ce
     seul motif, dont deux exceptions qui ARRÊTAIENT le bac à sable. Tout
     dictionnaire indexé par un nom venant de l'apprenant est donc créé sans
     prototype.
     -------------------------------------------------------------------------- */

  function dico(source) {
    var d = Object.create(null);
    if (source) {
      for (var k in source) {
        if (Object.prototype.hasOwnProperty.call(source, k)) d[k] = source[k];
      }
    }
    return d;
  }

  function possede(d, cle) {
    return d != null && Object.prototype.hasOwnProperty.call(d, cle);
  }

  /* ---------------------------------------------------------------------------
     1. SHA-1 — écrit en entier, sur des octets.
     Le navigateur propose bien `crypto.subtle.digest("SHA-1")`, mais il est
     ASYNCHRONE ; le modèle doit rester synchrone pour qu'une commande rende son
     résultat immédiatement.
     -------------------------------------------------------------------------- */

  function rotl(n, d) {
    return ((n << d) | (n >>> (32 - d))) >>> 0;
  }

  /* octets : tableau de nombres 0..255. Rend 40 caractères hexadécimaux. */
  function sha1Hex(octets) {
    var h0 = 0x67452301, h1 = 0xefcdab89, h2 = 0x98badcfe, h3 = 0x10325476, h4 = 0xc3d2e1f0;
    var bits = octets.length * 8;
    var m = octets.slice();
    m.push(0x80);
    while (m.length % 64 !== 56) m.push(0);
    var haut = Math.floor(bits / 4294967296);
    var bas = bits >>> 0;
    m.push((haut >>> 24) & 255, (haut >>> 16) & 255, (haut >>> 8) & 255, haut & 255);
    m.push((bas >>> 24) & 255, (bas >>> 16) & 255, (bas >>> 8) & 255, bas & 255);

    var w = new Array(80);
    for (var i = 0; i < m.length; i += 64) {
      for (var j = 0; j < 16; j++) {
        w[j] = ((m[i + 4 * j] << 24) | (m[i + 4 * j + 1] << 16) | (m[i + 4 * j + 2] << 8) | m[i + 4 * j + 3]) >>> 0;
      }
      for (j = 16; j < 80; j++) w[j] = rotl(w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16], 1);

      var a = h0, b = h1, c = h2, d = h3, e = h4, f, k;
      for (j = 0; j < 80; j++) {
        if (j < 20) { f = (b & c) | (~b & d); k = 0x5a827999; }
        else if (j < 40) { f = b ^ c ^ d; k = 0x6ed9eba1; }
        else if (j < 60) { f = (b & c) | (b & d) | (c & d); k = 0x8f1bbcdc; }
        else { f = b ^ c ^ d; k = 0xca62c1d6; }
        var t = (rotl(a, 5) + (f >>> 0) + e + k + w[j]) >>> 0;
        e = d; d = c; c = rotl(b, 30); b = a; a = t;
      }
      h0 = (h0 + a) >>> 0; h1 = (h1 + b) >>> 0; h2 = (h2 + c) >>> 0;
      h3 = (h3 + d) >>> 0; h4 = (h4 + e) >>> 0;
    }
    return [h0, h1, h2, h3, h4].map(function (n) {
      return ("0000000" + n.toString(16)).slice(-8);
    }).join("");
  }

  /* ---------------------------------------------------------------------------
     2. Octets — Git hache des OCTETS, pas des caractères. Un fichier contenant
     « été » ne fait pas 3 octets mais 5 : encoder en UTF-8 est obligatoire, sans
     quoi toute empreinte contenant un accent serait fausse.
     -------------------------------------------------------------------------- */

  function utf8(texte) {
    var out = [], s = String(texte);
    for (var i = 0; i < s.length; i++) {
      var c = s.charCodeAt(i);
      if (c < 0x80) { out.push(c); continue; }
      if (c < 0x800) { out.push(0xc0 | (c >> 6), 0x80 | (c & 63)); continue; }
      if (c >= 0xd800 && c <= 0xdbff) {
        var suivant = i + 1 < s.length ? s.charCodeAt(i + 1) : 0;
        /* Vérifier « il reste un caractère » ne suffit pas : il faut que ce soit
           un BAS substitut. Sans ce contrôle, "a\ud83db" fabriquait un caractère
           fantôme ET avalait le « b » — mesuré contre le vrai git, qui voit ce
           qu'un fichier contient réellement : U+FFFD. */
        if (suivant >= 0xdc00 && suivant <= 0xdfff) {
          var point = 0x10000 + ((c - 0xd800) << 10) + (suivant - 0xdc00);
          out.push(0xf0 | (point >> 18), 0x80 | ((point >> 12) & 63), 0x80 | ((point >> 6) & 63), 0x80 | (point & 63));
          i++;
          continue;
        }
        out.push(0xef, 0xbf, 0xbd); // substitut isolé : U+FFFD, comme à l'écriture d'un fichier
        continue;
      }
      if (c >= 0xdc00 && c <= 0xdfff) { out.push(0xef, 0xbf, 0xbd); continue; }
      out.push(0xe0 | (c >> 12), 0x80 | ((c >> 6) & 63), 0x80 | (c & 63));
    }
    return out;
  }

  function depuisUtf8(octets) {
    var s = "", i = 0;
    while (i < octets.length) {
      var c = octets[i++];
      if (c < 0x80) s += String.fromCharCode(c);
      else if (c < 0xe0) s += String.fromCharCode(((c & 31) << 6) | (octets[i++] & 63));
      else if (c < 0xf0) s += String.fromCharCode(((c & 15) << 12) | ((octets[i++] & 63) << 6) | (octets[i++] & 63));
      else {
        var p = ((c & 7) << 18) | ((octets[i++] & 63) << 12) | ((octets[i++] & 63) << 6) | (octets[i++] & 63);
        p -= 0x10000;
        s += String.fromCharCode(0xd800 + (p >> 10), 0xdc00 + (p & 1023));
      }
    }
    return s;
  }

  function hexVersOctets(hex) {
    var out = [];
    for (var i = 0; i < hex.length; i += 2) out.push(parseInt(hex.substr(i, 2), 16));
    return out;
  }

  function octetsVersHex(octets) {
    return octets.map(function (o) { return ("0" + o.toString(16)).slice(-2); }).join("");
  }

  /* Empreinte d'un objet Git : l'en-tête « <type> <taille>\0 » fait partie du
     haché. C'est pour cela qu'un blob vide vaut e69de29… et non l'empreinte de
     la chaîne vide. */
  function empreinte(type, corps) {
    var entete = utf8(type + " " + corps.length + "\u0000");
    return sha1Hex(entete.concat(corps));
  }

  /* ---------------------------------------------------------------------------
     3. Modes. Git n'enregistre pas les permissions Unix complètes : cinq valeurs.
     Le bac à sable n'écrit que des fichiers ordinaires, mais un arbre importé
     peut contenir les autres, et un changement de mode EST un changement que
     `git status` signale.
     -------------------------------------------------------------------------- */

  var MODE_FICHIER = "100644";
  var MODE_EXECUTABLE = "100755";
  var MODE_LIEN = "120000";
  var MODE_SOUS_MODULE = "160000";
  var MODE_ARBRE = "40000"; // sans zéro initial : c'est ainsi que Git l'écrit

  /* Deux modes de la même FAMILLE (fichier ordinaire ou exécutable) donnent une
     modification ; changer de famille est un changement de TYPE, que git note
     « T ». */
  function famille(mode) {
    if (mode === MODE_LIEN) return "lien";
    if (mode === MODE_SOUS_MODULE) return "sous-module";
    if (mode === MODE_ARBRE) return "arbre";
    return "fichier";
  }

  /* Comparaison d'octets — trier des noms accentués avec `<` sur des chaînes
     JavaScript donnerait un autre ordre que Git, donc un autre arbre, donc une
     autre empreinte. Et énumérer un objet JavaScript donnerait « 2 » avant
     « 10 », un ordre que git ne produit jamais. */
  function comparerOctets(a, b) {
    var n = Math.min(a.length, b.length);
    for (var i = 0; i < n; i++) if (a[i] !== b[i]) return a[i] - b[i];
    return a.length - b.length;
  }

  function comparerChemins(a, b) {
    return comparerOctets(utf8(a), utf8(b));
  }

  function trierChemins(liste) {
    return liste.slice().sort(comparerChemins);
  }

  /* ---------------------------------------------------------------------------
     4. Le dépôt.
     -------------------------------------------------------------------------- */

  function Depot(options) {
    options = options || {};
    this.objets = dico();                   // oid -> { type, corps (octets) }
    this.refs = dico();                     // "refs/heads/main" -> oid
    this.branchePrincipale = options.branche || "main";
    this.HEAD = { symbolique: "refs/heads/" + this.branchePrincipale, oid: null };
    this.index = dico();                    // chemin -> { oid, mode }
    this.travail = dico();                  // chemin -> contenu (texte)
    this.identite = options.identite || "Apprenant <apprenant@syntaxe.invalid>";
    /* Horloge DÉTERMINISTE : deux exécutions du même scénario doivent produire
       les mêmes empreintes, sinon un exercice corrigé sur l'empreinte serait
       intestable. Départ : 1er janvier 2024, 00:00:00 UTC. */
    this.instant = options.instant != null ? options.instant : 1704067200;
    this.pasHorloge = options.pasHorloge != null ? options.pasHorloge : 60;
    this.fuseau = options.fuseau || "+0000";
    /* Pourquoi la dernière résolution a échoué (préfixe ambigu, nom inconnu…).
       `resoudre` rend null plutôt que de lever : une impasse est une réponse, et
       D2 doit pouvoir l'expliquer sans envelopper chaque appel dans un try. */
    this.raisonEchec = null;
  }

  /* --- magasin d'objets ---------------------------------------------------- */

  Depot.prototype.stocker = function (type, corps) {
    var oid = empreinte(type, corps);
    if (!possede(this.objets, oid)) this.objets[oid] = { type: type, corps: corps };
    return oid;
  };

  Depot.prototype.lire = function (oid) {
    if (!possede(this.objets, oid)) throw new Error("objet inconnu : " + oid);
    return this.objets[oid];
  };

  Depot.prototype.existe = function (oid) { return possede(this.objets, oid); };

  Depot.prototype.typeDe = function (oid) {
    return possede(this.objets, oid) ? this.objets[oid].type : null;
  };

  Depot.prototype.ecrireBlob = function (contenu) {
    return this.stocker("blob", utf8(contenu));
  };

  Depot.prototype.lireBlob = function (oid) {
    var o = this.lire(oid);
    if (o.type !== "blob") throw new Error(oid + " n'est pas un blob");
    return depuisUtf8(o.corps);
  };

  /* Empreinte d'un contenu SANS le stocker — l'équivalent de `git hash-object`
     sans `-w`. Utile pour montrer qu'un contenu identique donne toujours la même
     empreinte, quel que soit son nom de fichier. */
  Depot.empreinteBlob = function (contenu) { return empreinte("blob", utf8(contenu)); };

  /* --- arbres --------------------------------------------------------------- */

  /* entrees : [{ nom, mode, oid }] — sérialise au format binaire réel.
     Le tri est le piège classique : Git compare les noms OCTET PAR OCTET, et un
     répertoire est comparé comme s'il finissait par « / ». Sans cette règle,
     « lib » et « lib.txt » se rangent dans le mauvais ordre et l'arbre obtenu
     n'a pas la même empreinte que celui du vrai Git. */
  Depot.prototype.serialiserArbre = function (entrees) {
    var triees = entrees.slice().sort(function (a, b) {
      var ca = utf8(a.nom + (a.mode === MODE_ARBRE ? "/" : ""));
      var cb = utf8(b.nom + (b.mode === MODE_ARBRE ? "/" : ""));
      return comparerOctets(ca, cb);
    });
    var corps = [];
    for (var i = 0; i < triees.length; i++) {
      var e = triees[i];
      corps = corps.concat(utf8(e.mode + " " + e.nom));
      corps.push(0);
      corps = corps.concat(hexVersOctets(e.oid));
    }
    return corps;
  };

  Depot.prototype.ecrireArbreDepuis = function (entrees) {
    return this.stocker("tree", this.serialiserArbre(entrees));
  };

  /* Construit l'arbre récursif correspondant à une liste plate de chemins —
     c'est ce que fait `git write-tree` avec l'index. */
  Depot.prototype.arbreDepuisPlat = function (plat) {
    var self = this;
    function batir(entrees) {
      var toutes = [], dossiers = dico(), ordre = [];
      for (var i = 0; i < entrees.length; i++) {
        var chemin = entrees[i].chemin;
        var coupe = chemin.indexOf("/");
        if (coupe === -1) {
          toutes.push({ nom: chemin, mode: entrees[i].mode || MODE_FICHIER, oid: entrees[i].oid });
        } else {
          var tete = chemin.slice(0, coupe), reste = chemin.slice(coupe + 1);
          if (!possede(dossiers, tete)) { dossiers[tete] = []; ordre.push(tete); }
          dossiers[tete].push({ chemin: reste, mode: entrees[i].mode, oid: entrees[i].oid });
        }
      }
      for (var k = 0; k < ordre.length; k++) {
        toutes.push({ nom: ordre[k], mode: MODE_ARBRE, oid: batir(dossiers[ordre[k]]) });
      }
      return self.ecrireArbreDepuis(toutes);
    }
    var liste = [];
    for (var chemin in plat) {
      if (!possede(plat, chemin)) continue;
      liste.push({ chemin: chemin, mode: plat[chemin].mode || MODE_FICHIER, oid: plat[chemin].oid });
    }
    return batir(liste);
  };

  /* `git write-tree` : l'arbre de l'INDEX, pas du répertoire de travail. La
     distinction est le cœur de ce que le cours doit faire comprendre. */
  Depot.prototype.ecrireArbre = function () {
    return this.arbreDepuisPlat(this.index);
  };

  /* Lit un arbre, récursivement, et rend une liste plate chemin -> {oid, mode} :
     l'inverse exact de la fonction précédente.
     ⚠️ Le résultat est un DICTIONNAIRE : il n'a pas d'ordre. Pour AFFICHER un
     arbre, passer par `listerArbre`, qui trie par octets comme `git ls-tree`. */
  Depot.prototype.lireArbre = function (oid, prefixe) {
    prefixe = prefixe || "";
    var res = dico();
    if (!oid) return res;
    var o = this.lire(oid);
    if (o.type !== "tree") throw new Error(oid + " n'est pas un arbre");
    var corps = o.corps, i = 0;
    while (i < corps.length) {
      var debut = i;
      while (corps[i] !== 0) i++;
      var entete = depuisUtf8(corps.slice(debut, i));
      var espace = entete.indexOf(" ");
      var mode = entete.slice(0, espace), nom = entete.slice(espace + 1);
      i++;
      var cible = octetsVersHex(corps.slice(i, i + 20));
      i += 20;
      if (mode === MODE_ARBRE) {
        var sous = this.lireArbre(cible, prefixe + nom + "/");
        for (var c in sous) if (possede(sous, c)) res[c] = sous[c];
      } else {
        res[prefixe + nom] = { oid: cible, mode: mode };
      }
    }
    return res;
  };

  /* `git ls-tree -r` : les entrées d'un arbre, TRIÉES COMME GIT LES TRIE.
     Les clés d'un objet JavaScript s'énumèrent en ordre numérique quand elles
     ressemblent à des entiers : sans ce tri, un dépôt contenant « 2 » et « 10 »
     s'afficherait dans un ordre que le vrai git ne produit jamais. */
  Depot.prototype.listerArbre = function (oid) {
    var plat = this.lireArbre(oid);
    var chemins = [];
    for (var c in plat) if (possede(plat, c)) chemins.push(c);
    return trierChemins(chemins).map(function (chemin) {
      return { chemin: chemin, oid: plat[chemin].oid, mode: plat[chemin].mode };
    });
  };

  /* --- commits -------------------------------------------------------------- */

  /* Un commit porte DEUX identités et DEUX dates : l'auteur (qui a écrit le
     changement) et le committeur (qui l'a posé ici). Elles coïncident au premier
     commit et divergent au premier rebase ou cherry-pick — c'est précisément ce
     que le point D2 doit faire voir, et c'est sur la date du COMMITTEUR que
     `git log` trie. */
  Depot.prototype.creerCommit = function (opts) {
    var quand = opts.instant != null ? opts.instant : this.instant;
    if (opts.instant == null) this.instant += this.pasHorloge;
    var identite = opts.identite || this.identite;
    var committeur = opts.committeur || identite;
    var quandCommit = opts.instantCommit != null ? opts.instantCommit : quand;
    var fuseau = opts.fuseau || this.fuseau;
    var fuseauCommit = opts.fuseauCommit || fuseau;
    var texte = "tree " + opts.arbre + "\n";
    var parents = opts.parents || [];
    for (var i = 0; i < parents.length; i++) texte += "parent " + parents[i] + "\n";
    texte += "author " + identite + " " + quand + " " + fuseau + "\n";
    texte += "committer " + committeur + " " + quandCommit + " " + fuseauCommit + "\n\n";
    var message = String(opts.message == null ? "" : opts.message);
    if (message.slice(-1) !== "\n") message += "\n";
    texte += message;
    return this.stocker("commit", utf8(texte));
  };

  Depot.prototype.lireCommit = function (oid) {
    var o = this.lire(oid);
    if (o.type !== "commit") throw new Error(oid + " n'est pas un commit");
    var texte = depuisUtf8(o.corps);
    var coupe = texte.indexOf("\n\n");
    var entete = texte.slice(0, coupe).split("\n");
    var res = {
      oid: oid, arbre: null, parents: [],
      identite: "", instant: 0, fuseau: "+0000",
      committeur: "", instantCommit: 0, fuseauCommit: "+0000",
      message: texte.slice(coupe + 2)
    };
    for (var i = 0; i < entete.length; i++) {
      var ligne = entete[i], m;
      if (ligne.indexOf("tree ") === 0) res.arbre = ligne.slice(5);
      else if (ligne.indexOf("parent ") === 0) res.parents.push(ligne.slice(7));
      else if ((m = /^author (.*) (\d+) ([+-]\d{4})$/.exec(ligne))) {
        res.identite = m[1]; res.instant = parseInt(m[2], 10); res.fuseau = m[3];
      } else if ((m = /^committer (.*) (\d+) ([+-]\d{4})$/.exec(ligne))) {
        res.committeur = m[1]; res.instantCommit = parseInt(m[2], 10); res.fuseauCommit = m[3];
      }
    }
    res.titre = res.message.split("\n")[0];
    return res;
  };

  /* --- références et HEAD --------------------------------------------------- */

  Depot.prototype.oidDeRef = function (nom) {
    return possede(this.refs, nom) ? this.refs[nom] : null;
  };

  Depot.prototype.majRef = function (nom, oid) {
    if (oid === null) delete this.refs[nom];
    else this.refs[nom] = oid;
  };

  Depot.prototype.branches = function () {
    var out = [];
    for (var r in this.refs) {
      if (possede(this.refs, r) && r.indexOf("refs/heads/") === 0) out.push(r.slice(11));
    }
    return trierChemins(out);
  };

  Depot.prototype.etiquettes = function () {
    var out = [];
    for (var r in this.refs) {
      if (possede(this.refs, r) && r.indexOf("refs/tags/") === 0) out.push(r.slice(10));
    }
    return trierChemins(out);
  };

  Depot.prototype.brancheCourante = function () {
    return this.HEAD.symbolique ? this.HEAD.symbolique.slice(11) : null;
  };

  Depot.prototype.detachee = function () { return !this.HEAD.symbolique; };

  /* L'oid sur lequel HEAD pointe, directement ou via une branche. Rend null sur
     un dépôt neuf : une branche sans commit n'existe pas encore comme
     référence — la « branche non née » que Git affiche à l'initialisation. */
  Depot.prototype.oidHEAD = function () {
    return this.HEAD.symbolique ? this.oidDeRef(this.HEAD.symbolique) : this.HEAD.oid;
  };

  /* Fait avancer ce sur quoi HEAD pointe : la branche courante, ou HEAD lui-même
     s'il est détaché. C'est la seule écriture qu'un commit fait sur les
     références, et la source de la confusion la plus fréquente du cours. */
  Depot.prototype.avancerHEAD = function (oid) {
    if (this.HEAD.symbolique) this.majRef(this.HEAD.symbolique, oid);
    else this.HEAD.oid = oid;
  };

  /* Attache HEAD à une branche, ou le DÉTACHE sur un commit.
     ⚠️ La cible est validée. Sans cela, `pointerHEAD("main")` (nom court)
     détachait HEAD sur la chaîne « main », `oidHEAD()` rendait « main », et le
     prochain `lireCommit` mourait sur « objet inconnu : main » — trois pas plus
     loin, sans rapport visible avec la cause. */
  Depot.prototype.pointerHEAD = function (cible) {
    if (!cible) throw new Error("pointerHEAD : aucune cible");
    if (String(cible).indexOf("refs/heads/") === 0) {
      this.HEAD = { symbolique: cible, oid: null };
      return this.HEAD;
    }
    if (this.oidDeRef("refs/heads/" + cible) || cible === this.branchePrincipale) {
      this.HEAD = { symbolique: "refs/heads/" + cible, oid: null };
      return this.HEAD;
    }
    var oid = this.resoudre(cible);
    if (!oid || this.typeDe(oid) !== "commit") {
      throw new Error("pointerHEAD : « " + cible + " » n'est ni une branche ni un commit connu");
    }
    this.HEAD = { symbolique: null, oid: oid };
    return this.HEAD;
  };

  /* --- résolution de révisions --------------------------------------------- */

  /* Comprend : un oid entier ou abrégé, un nom de branche ou d'étiquette, HEAD,
     les suffixes ~n (n-ième ancêtre par le premier parent), ^n (n-ième parent)
     et le « pelage » ^{} / ^{commit}.
     Rend null quand la révision n'existe pas ou qu'elle est ambiguë, et pose la
     raison dans `this.raisonEchec` — une impasse est une réponse, pas un
     incident. NON GÉRÉ : le reflog (`HEAD@{2}`), faute de reflog. */
  Depot.prototype.resoudre = function (revision) {
    this.raisonEchec = null;
    if (!revision) { this.raisonEchec = "aucune révision"; return null; }
    /* Pas de `.trim()` : git ne rogne pas les espaces, « main » et « main  »
       ne désignent pas la même chose chez lui. Le rognage est l'affaire de
       l'analyseur de commandes, pas du modèle. */
    var texte = String(revision);
    if (texte.indexOf("@{") !== -1) {
      this.raisonEchec = "le reflog n'est pas simulé : " + texte;
      return null;
    }

    var suffixes = [], m;
    for (;;) {
      m = /\^\{(commit)?\}$/.exec(texte);
      if (m) { suffixes.unshift({ signe: "peler" }); texte = texte.slice(0, texte.length - m[0].length); continue; }
      m = /(~|\^)(\d*)$/.exec(texte);
      if (m) {
        suffixes.unshift({ signe: m[1], nombre: m[2] === "" ? 1 : parseInt(m[2], 10) });
        texte = texte.slice(0, texte.length - m[0].length);
        continue;
      }
      break;
    }

    /* Un suffixe impose que la cible soit un COMMIT : c'est ce qui permet à git
       de trancher un préfixe abrégé partagé par un blob et un commit. */
    var oid = this.resoudreNom(texte, suffixes.length > 0);
    for (var i = 0; i < suffixes.length && oid; i++) {
      var s = suffixes[i];
      if (s.signe === "peler") continue; // ici, tout ce qu'on résout est déjà un commit
      if (s.signe === "~") {
        for (var k = 0; k < s.nombre && oid; k++) {
          var c = this.lireCommit(oid);
          oid = c.parents.length ? c.parents[0] : null;
        }
      } else {
        if (s.nombre === 0) continue;
        var cc = this.lireCommit(oid);
        oid = cc.parents.length >= s.nombre ? cc.parents[s.nombre - 1] : null;
      }
    }
    if (!oid && !this.raisonEchec) this.raisonEchec = "révision inconnue : " + revision;
    return oid;
  };

  /* L'ordre est celui de gitrevisions, et il n'est pas intuitif :
     HEAD, puis refs/<nom>, puis refs/tags/<nom>, puis refs/heads/<nom>.
     Une ÉTIQUETTE l'emporte donc sur une branche de même nom — le modèle faisait
     l'inverse, ce qu'une mesure contre `git rev-parse` a montré. */
  Depot.prototype.resoudreNom = function (nom, exigerCommit) {
    if (nom === "HEAD" || nom === "@") return this.oidHEAD();
    var pistes = [nom, "refs/" + nom, "refs/tags/" + nom, "refs/heads/" + nom];
    for (var i = 0; i < pistes.length; i++) {
      var trouve = this.oidDeRef(pistes[i]);
      if (trouve) return trouve;
    }
    if (/^[0-9a-f]{4,40}$/.test(nom)) {
      var commits = [], tous = [];
      for (var oid in this.objets) {
        if (!possede(this.objets, oid) || oid.indexOf(nom) !== 0) continue;
        tous.push(oid);
        if (this.objets[oid].type === "commit") commits.push(oid);
      }
      /* Sans contexte, git REFUSE un prefixe partage par plusieurs objets, meme
         si un seul est un commit (mesure : `git rev-parse 1ded` echoue quand un
         blob commence pareil, alors que `1ded^{commit}` rend le commit). */
      var candidats = exigerCommit ? commits : tous;
      if (exigerCommit && tous.length && !commits.length) {
        this.raisonEchec = "ce prefixe ne designe aucun commit : " + nom;
        return null;
      }
      if (candidats.length === 1) return candidats[0];
      if (candidats.length > 1) {
        this.raisonEchec = "préfixe ambigu : " + nom + " (" + candidats.length + " objets)";
        return null;
      }
    }
    return null;
  };

  /* --- parcours du graphe --------------------------------------------------- */

  /* Tous les ancêtres d'un commit, lui compris. Un ensemble en dictionnaire sans
     prototype : le modèle doit rester lisible par un apprenant qui ouvre le
     fichier. */
  Depot.prototype.ancetres = function (oid) {
    var vus = dico(), pile = oid ? [oid] : [];
    while (pile.length) {
      var courant = pile.pop();
      if (!courant || vus[courant]) continue;
      vus[courant] = true;
      var c = this.lireCommit(courant);
      for (var i = 0; i < c.parents.length; i++) pile.push(c.parents[i]);
    }
    return vus;
  };

  Depot.prototype.estAncetre = function (candidat, descendant) {
    if (!candidat || !descendant) return false;
    return !!this.ancetres(descendant)[candidat];
  };

  /* Le journal, comme `git log` : une FILE DE PRIORITÉ, du plus récent au plus
     ancien par DATE DE COMMITTEUR — pas d'auteur : un rebase conserve la date
     d'auteur, et trier dessus donne un ordre que git ne produit jamais.
     À date égale — c'est la norme ici, l'horloge du bac à sable est
     déterministe — on départage par l'ORDRE D'INSERTION, et par rien d'autre.
     Départager par empreinte, comme le faisait la première version, produisait
     un ordre sans rapport avec la topologie : 11 inversions parent-avant-enfant
     mesurées sur 15 graphes, contre 0 chez git.
     Et NON, il n'y a pas de garde topologique à ajouter : sur un graphe dont la
     fusion a la racine pour second parent, `git log` sort la racine AVANT ses
     propres descendants. Le contrôle l'a montré, la garde a été retirée. */
  Depot.prototype.journal = function (depuis, limite) {
    var debut = depuis ? this.resoudre(depuis) : this.oidHEAD();
    var vus = dico(), out = [];
    var file = debut ? [{ oid: debut, rang: 0 }] : [];
    var rang = 1;
    var self = this;
    while (file.length && (!limite || out.length < limite)) {
      file.sort(function (a, b) {
        var ca = self.lireCommit(a.oid), cb = self.lireCommit(b.oid);
        if (ca.instantCommit !== cb.instantCommit) return cb.instantCommit - ca.instantCommit;
        return a.rang - b.rang;
      });
      var choisi = file.shift();
      if (vus[choisi.oid]) continue;
      vus[choisi.oid] = true;
      var c = this.lireCommit(choisi.oid);
      out.push(c);
      for (var i = 0; i < c.parents.length; i++) {
        var parent = c.parents[i];
        if (vus[parent]) continue;
        var dejaEnFile = false;
        for (var j = 0; j < file.length; j++) if (file[j].oid === parent) { dejaEnFile = true; break; }
        if (!dejaEnFile) file.push({ oid: parent, rang: rang++ });
      }
    }
    return out;
  };

  /* Les bases de fusion : les ancêtres communs les plus récents. C'est ce que
     `merge` et `rebase` calculent avant toute chose ; sans elles, on ne sait pas
     quelles modifications sont « nouvelles » de chaque côté.
     Méthode : les ancêtres communs, moins ceux qui sont ancêtres d'un autre
     ancêtre commun (sinon on rendrait le plus VIEIL ancêtre, souvent la racine,
     et la fusion rejouerait toute l'histoire).
     L'ensemble rendu est celui de `git merge-base --all` (mesuré sur des croix à
     deux et trois bases, une fusion octopus et deux racines disjointes). */
  Depot.prototype.basesDeFusion = function (a, b) {
    var oa = this.resoudre(a), ob = this.resoudre(b);
    if (!oa || !ob) return [];
    var ancA = this.ancetres(oa), ancB = this.ancetres(ob);
    var communs = [];
    for (var oid in ancA) if (possede(ancA, oid) && ancB[oid]) communs.push(oid);
    var bases = [];
    for (var i = 0; i < communs.length; i++) {
      var domine = false;
      for (var j = 0; j < communs.length; j++) {
        if (i === j) continue;
        // communs[i] est-il un ancêtre STRICT d'un autre ancêtre commun ?
        if (communs[i] !== communs[j] && this.ancetres(communs[j])[communs[i]]) { domine = true; break; }
      }
      if (!domine) bases.push(communs[i]);
    }
    return bases.sort();
  };

  /* UNE base, pour les cas courants — la plus récente par date de committeur.
     ⚠️ Quand il y en a PLUSIEURS (histoire en croix), git choisit selon son
     parcours interne et peut rendre une autre base que celle-ci : mesuré, 10
     fois sur 20 croix. `plusieursBases` permet donc à l'appelant de le SIGNALER
     au lieu de trancher en silence. */
  Depot.prototype.baseDeFusion = function (a, b) {
    var bases = this.basesDeFusion(a, b);
    if (!bases.length) return null;
    var self = this;
    return bases.slice().sort(function (x, y) {
      var cx = self.lireCommit(x), cy = self.lireCommit(y);
      if (cx.instantCommit !== cy.instantCommit) return cy.instantCommit - cx.instantCommit;
      return x < y ? -1 : 1;
    })[0];
  };

  Depot.prototype.plusieursBases = function (a, b) {
    return this.basesDeFusion(a, b).length > 1;
  };

  /* --- index, répertoire de travail, statut --------------------------------- */

  Depot.prototype.ecrireFichier = function (chemin, contenu) {
    this.travail[chemin] = String(contenu);
  };

  Depot.prototype.supprimerFichier = function (chemin) {
    delete this.travail[chemin];
  };

  Depot.prototype.lireFichier = function (chemin) {
    return possede(this.travail, chemin) ? this.travail[chemin] : null;
  };

  /* `git add` en une ligne : le contenu du répertoire de travail devient un
     objet, et l'index retient son empreinte. L'apprenant voit ici que « ajouter
     au suivi » copie VRAIMENT le contenu — modifier le fichier ensuite ne change
     pas ce qui est indexé.
     Le mode est conservé s'il existait déjà : indexer un fichier exécutable ne le
     rend pas ordinaire. */
  Depot.prototype.indexer = function (chemin, mode) {
    if (!possede(this.travail, chemin)) {
      delete this.index[chemin];
      return null;
    }
    var ancien = possede(this.index, chemin) ? this.index[chemin].mode : null;
    var oid = this.ecrireBlob(this.travail[chemin]);
    this.resoudreCollision(chemin);
    this.index[chemin] = { oid: oid, mode: mode || ancien || MODE_FICHIER };
    return oid;
  };

  /* Un chemin est soit un fichier, soit un dossier — jamais les deux. Quand le
     dossier `lib/` devient le fichier `lib`, git RETIRE `lib/a.txt` de l'index ;
     sans cela on fabrique un index que le vrai git refuse (« duplicateEntries :
     refusing to create malformed object », mesuré). */
  Depot.prototype.resoudreCollision = function (chemin) {
    var prefixe = chemin + "/", retires = [];
    for (var autre in this.index) {
      if (!possede(this.index, autre)) continue;
      if (autre.indexOf(prefixe) === 0) retires.push(autre);
    }
    var morceaux = chemin.split("/");
    for (var i = 1; i < morceaux.length; i++) {
      var parent = morceaux.slice(0, i).join("/");
      if (possede(this.index, parent)) retires.push(parent);
    }
    for (var k = 0; k < retires.length; k++) delete this.index[retires[k]];
    return retires;
  };

  Depot.prototype.cheminsTravail = function () {
    var out = [];
    for (var c in this.travail) if (possede(this.travail, c)) out.push(c);
    return trierChemins(out);
  };

  Depot.prototype.cheminsIndex = function () {
    var out = [];
    for (var c in this.index) if (possede(this.index, c)) out.push(c);
    return trierChemins(out);
  };

  /* Remplit l'index et le répertoire de travail à partir d'un arbre : ce que fait
     un `checkout`.
     ⚠️ Les fichiers NON SUIVIS survivent : un checkout n'efface pas le brouillon
     que l'apprenant vient d'écrire. Et un sous-module (mode 160000) reste dans
     l'index sans contenu de travail — il n'a pas de blob à lire. */
  Depot.prototype.materialiser = function (oidArbre) {
    var plat = this.lireArbre(oidArbre);
    var ancienIndex = this.index;
    var nouvelIndex = dico(), nouveauTravail = dico();
    for (var garde in this.travail) {
      if (!possede(this.travail, garde)) continue;
      if (!possede(ancienIndex, garde) && !possede(plat, garde)) nouveauTravail[garde] = this.travail[garde];
    }
    for (var chemin in plat) {
      if (!possede(plat, chemin)) continue;
      nouvelIndex[chemin] = { oid: plat[chemin].oid, mode: plat[chemin].mode };
      if (plat[chemin].mode !== MODE_SOUS_MODULE) nouveauTravail[chemin] = this.lireBlob(plat[chemin].oid);
    }
    this.index = nouvelIndex;
    this.travail = nouveauTravail;
  };

  /* Les trois zones comparées deux à deux — c'est littéralement l'affichage de
     `git status`, et la seule façon de comprendre pourquoi un fichier peut être
     à la fois « indexé » et « modifié ».
     Les états valent « nouveau », « modifié », « supprimé » et « type » (un
     fichier devenu lien symbolique : le « T » de git). */
  Depot.prototype.statut = function () {
    var tete = this.oidHEAD();
    var arbreTete = tete ? this.lireArbre(this.lireCommit(tete).arbre) : dico();
    var indexes = [], modifies = [], nonSuivis = [], supprimes = [];
    var chemin;
    for (chemin in this.index) {
      if (!possede(this.index, chemin)) continue;
      var dansTete = possede(arbreTete, chemin) ? arbreTete[chemin] : null;
      if (!dansTete) indexes.push({ chemin: chemin, etat: "nouveau" });
      else if (famille(dansTete.mode) !== famille(this.index[chemin].mode)) indexes.push({ chemin: chemin, etat: "type" });
      else if (dansTete.oid !== this.index[chemin].oid || dansTete.mode !== this.index[chemin].mode) {
        indexes.push({ chemin: chemin, etat: "modifié" });
      }
    }
    for (chemin in arbreTete) {
      if (!possede(arbreTete, chemin)) continue;
      if (!possede(this.index, chemin)) indexes.push({ chemin: chemin, etat: "supprimé" });
    }
    for (chemin in this.travail) {
      if (!possede(this.travail, chemin)) continue;
      if (!possede(this.index, chemin)) { nonSuivis.push(chemin); continue; }
      if (Depot.empreinteBlob(this.travail[chemin]) !== this.index[chemin].oid) modifies.push(chemin);
    }
    for (chemin in this.index) {
      if (!possede(this.index, chemin)) continue;
      if (this.index[chemin].mode === MODE_SOUS_MODULE) continue; // pas de contenu de travail
      if (!possede(this.travail, chemin)) supprimes.push(chemin);
    }
    function parChemin(a, b) { return comparerChemins(a.chemin, b.chemin); }
    return {
      branche: this.brancheCourante(),
      detachee: this.detachee(),
      indexes: indexes.sort(parChemin),
      modifies: trierChemins(modifies),
      supprimes: trierChemins(supprimes),
      nonSuivis: trierChemins(nonSuivis),
      propre: !indexes.length && !modifies.length && !nonSuivis.length && !supprimes.length
    };
  };

  /* --- différences entre deux arbres ---------------------------------------- */

  /* La brique dont merge, rebase, revert et cherry-pick auront besoin (D2) :
     qu'est-ce qui a changé entre ces deux états ? Les renommages ne sont pas
     détectés — comme `git diff --no-renames`. */
  Depot.prototype.diffArbres = function (oidA, oidB) {
    var a = oidA ? this.lireArbre(oidA) : dico();
    var b = oidB ? this.lireArbre(oidB) : dico();
    var out = [], chemin;
    for (chemin in b) {
      if (!possede(b, chemin)) continue;
      if (!possede(a, chemin)) { out.push({ chemin: chemin, etat: "ajouté", avant: null, apres: b[chemin].oid }); continue; }
      if (famille(a[chemin].mode) !== famille(b[chemin].mode)) {
        out.push({ chemin: chemin, etat: "type", avant: a[chemin].oid, apres: b[chemin].oid });
      } else if (a[chemin].oid !== b[chemin].oid || a[chemin].mode !== b[chemin].mode) {
        out.push({ chemin: chemin, etat: "modifié", avant: a[chemin].oid, apres: b[chemin].oid });
      }
    }
    for (chemin in a) {
      if (!possede(a, chemin)) continue;
      if (!possede(b, chemin)) out.push({ chemin: chemin, etat: "supprimé", avant: a[chemin].oid, apres: null });
    }
    return out.sort(function (x, y) { return comparerChemins(x.chemin, y.chemin); });
  };

  /* --- sérialisation -------------------------------------------------------- */

  /* Un scénario doit pouvoir être repris là où on l'a laissé (D4) et rejoué à
     l'identique par un contrôle. Les objets sont exportés en hexadécimal : du
     texte, donc stockable tel quel dans localStorage.
     TOUT l'état est exporté, horloge et fuseau compris : sans eux, le dépôt
     rechargé produirait d'AUTRES empreintes que celui qu'on a quitté. */
  Depot.prototype.exporter = function () {
    var objets = {}, refs = {}, index = {}, travail = {}, cle;
    for (cle in this.objets) {
      if (!possede(this.objets, cle)) continue;
      objets[cle] = { type: this.objets[cle].type, corps: octetsVersHex(this.objets[cle].corps) };
    }
    for (cle in this.refs) if (possede(this.refs, cle)) refs[cle] = this.refs[cle];
    for (cle in this.index) if (possede(this.index, cle)) index[cle] = { oid: this.index[cle].oid, mode: this.index[cle].mode };
    for (cle in this.travail) if (possede(this.travail, cle)) travail[cle] = this.travail[cle];
    return {
      version: 1,
      objets: objets,
      refs: refs,
      HEAD: { symbolique: this.HEAD.symbolique, oid: this.HEAD.oid },
      index: index,
      travail: travail,
      instant: this.instant,
      pasHorloge: this.pasHorloge,
      fuseau: this.fuseau,
      identite: this.identite,
      branchePrincipale: this.branchePrincipale
    };
  };

  /* ⚠️ Tout est RECOPIÉ. Importer deux fois le même export doit donner deux
     dépôts indépendants : sans copie, écrire dans l'un modifiait l'autre. */
  Depot.importer = function (donnees) {
    var d = new Depot({
      identite: donnees.identite,
      branche: donnees.branchePrincipale,
      instant: donnees.instant,
      pasHorloge: donnees.pasHorloge,
      fuseau: donnees.fuseau
    });
    var cle;
    for (cle in donnees.objets) {
      if (!possede(donnees.objets, cle)) continue;
      d.objets[cle] = { type: donnees.objets[cle].type, corps: hexVersOctets(donnees.objets[cle].corps) };
    }
    for (cle in donnees.refs) if (possede(donnees.refs, cle)) d.refs[cle] = donnees.refs[cle];
    for (cle in donnees.index) {
      if (!possede(donnees.index, cle)) continue;
      d.index[cle] = { oid: donnees.index[cle].oid, mode: donnees.index[cle].mode };
    }
    for (cle in donnees.travail) if (possede(donnees.travail, cle)) d.travail[cle] = donnees.travail[cle];
    if (donnees.HEAD) d.HEAD = { symbolique: donnees.HEAD.symbolique, oid: donnees.HEAD.oid };
    return d;
  };

  /* ------------------------------------------------------------------------- */

  var GitModele = {
    Depot: Depot,
    sha1Hex: sha1Hex,
    utf8: utf8,
    depuisUtf8: depuisUtf8,
    empreinte: empreinte,
    octetsVersHex: octetsVersHex,
    hexVersOctets: hexVersOctets,
    comparerChemins: comparerChemins,
    dico: dico,
    MODE_FICHIER: MODE_FICHIER,
    MODE_EXECUTABLE: MODE_EXECUTABLE,
    MODE_LIEN: MODE_LIEN,
    MODE_SOUS_MODULE: MODE_SOUS_MODULE,
    MODE_ARBRE: MODE_ARBRE
  };

  if (typeof module !== "undefined" && module.exports) module.exports = GitModele;
  if (racine) racine.GitModele = GitModele;
})(typeof window !== "undefined" ? window : null);
