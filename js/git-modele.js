/* =============================================================================
   git-modele.js — le MODÈLE d'un dépôt Git, en mémoire, en JavaScript pur
   (chantier V14, point D1). Aucune dépendance, aucun module ES, aucun réseau :
   il tourne en `file://` dans le navigateur comme dans Node (pour l'outil de
   vérification `tools/verif-git-modele.js`).

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

   DÉCOUPAGE : ce fichier est la PLOMBERIE (le modèle et ses opérations de bas
   niveau). Les commandes que l'apprenant tape — add, commit, branch, checkout,
   merge, rebase, reset, revert, cherry-pick — sont le point D2 et s'écrivent
   par-dessus ; le dessin du graphe est le point D3.
   ============================================================================= */
(function (racine) {
  "use strict";

  /* ---------------------------------------------------------------------------
     1. SHA-1 — écrit en entier, sur des octets.
     Le navigateur propose bien `crypto.subtle.digest("SHA-1")`, mais il est
     ASYNCHRONE et absent en `file://` sur certains contextes ; le modèle doit
     rester synchrone pour qu'une commande rende son résultat immédiatement.
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
      if (c < 0x80) out.push(c);
      else if (c < 0x800) out.push(0xc0 | (c >> 6), 0x80 | (c & 63));
      else if (c >= 0xd800 && c <= 0xdbff && i + 1 < s.length) {
        var suivant = s.charCodeAt(i + 1);
        var point = 0x10000 + ((c - 0xd800) << 10) + (suivant - 0xdc00);
        out.push(0xf0 | (point >> 18), 0x80 | ((point >> 12) & 63), 0x80 | ((point >> 6) & 63), 0x80 | (point & 63));
        i++;
      } else out.push(0xe0 | (c >> 12), 0x80 | ((c >> 6) & 63), 0x80 | (c & 63));
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
     3. Modes. Git n'enregistre pas les permissions Unix complètes : quatre
     valeurs seulement. Le bac à sable n'utilise que fichier et répertoire, mais
     le modèle connaît les quatre pour que la lecture d'un arbre reste juste.
     -------------------------------------------------------------------------- */

  var MODE_FICHIER = "100644";
  var MODE_EXECUTABLE = "100755";
  var MODE_LIEN = "120000";
  var MODE_ARBRE = "40000"; // sans zéro initial : c'est ainsi que Git l'écrit

  /* Comparaison d'octets — trier des noms accentués avec `<` sur des chaînes
     JavaScript donnerait un autre ordre que Git, donc un autre arbre, donc une
     autre empreinte. */
  function comparerOctets(a, b) {
    var n = Math.min(a.length, b.length);
    for (var i = 0; i < n; i++) if (a[i] !== b[i]) return a[i] - b[i];
    return a.length - b.length;
  }

  /* ---------------------------------------------------------------------------
     4. Le dépôt.
     -------------------------------------------------------------------------- */

  function Depot(options) {
    options = options || {};
    this.objets = {};                       // oid -> { type, corps (octets) }
    this.refs = {};                         // "refs/heads/main" -> oid
    this.branchePrincipale = options.branche || "main";
    this.HEAD = { symbolique: "refs/heads/" + this.branchePrincipale, oid: null };
    this.index = {};                        // chemin -> { oid, mode }
    this.travail = {};                      // chemin -> contenu (texte)
    this.identite = options.identite || "Apprenant <apprenant@syntaxe.invalid>";
    /* Horloge DÉTERMINISTE : deux exécutions du même scénario doivent produire
       les mêmes empreintes, sinon un exercice corrigé sur l'empreinte serait
       intestable. Départ : 1er janvier 2024, 00:00:00 UTC. */
    this.instant = options.instant || 1704067200;
    this.pasHorloge = options.pasHorloge || 60;
    this.fuseau = options.fuseau || "+0000";
  }

  /* --- magasin d'objets ---------------------------------------------------- */

  Depot.prototype.stocker = function (type, corps) {
    var oid = empreinte(type, corps);
    if (!this.objets[oid]) this.objets[oid] = { type: type, corps: corps };
    return oid;
  };

  Depot.prototype.lire = function (oid) {
    var o = this.objets[oid];
    if (!o) throw new Error("objet inconnu : " + oid);
    return o;
  };

  Depot.prototype.existe = function (oid) { return !!this.objets[oid]; };

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
    function batir(entrees, prefixe) {
      var fichiers = [], dossiers = {};
      for (var i = 0; i < entrees.length; i++) {
        var chemin = entrees[i].chemin;
        var coupe = chemin.indexOf("/");
        if (coupe === -1) {
          fichiers.push({ nom: chemin, mode: entrees[i].mode || MODE_FICHIER, oid: entrees[i].oid });
        } else {
          var tete = chemin.slice(0, coupe), reste = chemin.slice(coupe + 1);
          if (!dossiers[tete]) dossiers[tete] = [];
          dossiers[tete].push({ chemin: reste, mode: entrees[i].mode, oid: entrees[i].oid });
        }
      }
      var toutes = fichiers;
      for (var nom in dossiers) {
        if (!Object.prototype.hasOwnProperty.call(dossiers, nom)) continue;
        toutes.push({ nom: nom, mode: MODE_ARBRE, oid: batir(dossiers[nom], prefixe + nom + "/") });
      }
      return self.ecrireArbreDepuis(toutes);
    }
    var liste = [];
    for (var chemin in plat) {
      if (!Object.prototype.hasOwnProperty.call(plat, chemin)) continue;
      liste.push({ chemin: chemin, mode: plat[chemin].mode || MODE_FICHIER, oid: plat[chemin].oid });
    }
    return batir(liste, "");
  };

  /* `git write-tree` : l'arbre de l'INDEX, pas du répertoire de travail. La
     distinction est le cœur de ce que le cours doit faire comprendre. */
  Depot.prototype.ecrireArbre = function () {
    return this.arbreDepuisPlat(this.index);
  };

  /* Lit un arbre, récursivement, et rend une liste plate chemin -> {oid, mode} :
     l'inverse exact de la fonction précédente. */
  Depot.prototype.lireArbre = function (oid, prefixe) {
    prefixe = prefixe || "";
    var res = {};
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
        for (var c in sous) if (Object.prototype.hasOwnProperty.call(sous, c)) res[c] = sous[c];
      } else {
        res[prefixe + nom] = { oid: cible, mode: mode };
      }
    }
    return res;
  };

  /* --- commits -------------------------------------------------------------- */

  Depot.prototype.creerCommit = function (opts) {
    var quand = opts.instant != null ? opts.instant : this.instant;
    if (opts.instant == null) this.instant += this.pasHorloge;
    var identite = opts.identite || this.identite;
    var fuseau = opts.fuseau || this.fuseau;
    var texte = "tree " + opts.arbre + "\n";
    var parents = opts.parents || [];
    for (var i = 0; i < parents.length; i++) texte += "parent " + parents[i] + "\n";
    texte += "author " + identite + " " + quand + " " + fuseau + "\n";
    texte += "committer " + identite + " " + quand + " " + fuseau + "\n\n";
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
    var res = { oid: oid, arbre: null, parents: [], identite: "", instant: 0, message: texte.slice(coupe + 2) };
    for (var i = 0; i < entete.length; i++) {
      var ligne = entete[i];
      if (ligne.indexOf("tree ") === 0) res.arbre = ligne.slice(5);
      else if (ligne.indexOf("parent ") === 0) res.parents.push(ligne.slice(7));
      else if (ligne.indexOf("author ") === 0) {
        var m = /^author (.*) (\d+) ([+-]\d{4})$/.exec(ligne);
        if (m) { res.identite = m[1]; res.instant = parseInt(m[2], 10); res.fuseau = m[3]; }
      }
    }
    res.titre = res.message.split("\n")[0];
    return res;
  };

  /* --- références et HEAD --------------------------------------------------- */

  Depot.prototype.oidDeRef = function (nom) {
    return Object.prototype.hasOwnProperty.call(this.refs, nom) ? this.refs[nom] : null;
  };

  Depot.prototype.majRef = function (nom, oid) {
    if (oid === null) delete this.refs[nom];
    else this.refs[nom] = oid;
  };

  Depot.prototype.branches = function () {
    var out = [];
    for (var r in this.refs) {
      if (Object.prototype.hasOwnProperty.call(this.refs, r) && r.indexOf("refs/heads/") === 0) {
        out.push(r.slice(11));
      }
    }
    return out.sort();
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

  /* Fait avancer ce sur quoi HEAD pointe : la branche courante, ou HEAD
     lui-même s'il est détaché. C'est la seule écriture qu'un commit fait sur les
     références, et la source de la confusion la plus fréquente du cours. */
  Depot.prototype.avancerHEAD = function (oid) {
    if (this.HEAD.symbolique) this.majRef(this.HEAD.symbolique, oid);
    else this.HEAD.oid = oid;
  };

  Depot.prototype.pointerHEAD = function (cible) {
    if (cible && cible.indexOf("refs/heads/") === 0) this.HEAD = { symbolique: cible, oid: null };
    else this.HEAD = { symbolique: null, oid: cible };
  };

  /* --- résolution de révisions --------------------------------------------- */

  /* Comprend : un oid entier ou abrégé, un nom de branche, HEAD, et les suffixes
     ~n (n-ième ancêtre par le premier parent) et ^n (n-ième parent). */
  Depot.prototype.resoudre = function (revision) {
    if (!revision) return null;
    var texte = String(revision).trim();
    var suffixes = [];
    var m;
    while ((m = /(~|\^)(\d*)$/.exec(texte))) {
      suffixes.unshift({ signe: m[1], nombre: m[2] === "" ? 1 : parseInt(m[2], 10) });
      texte = texte.slice(0, texte.length - m[0].length);
    }
    var oid = this.resoudreNom(texte);
    for (var i = 0; i < suffixes.length && oid; i++) {
      var s = suffixes[i];
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
    return oid;
  };

  Depot.prototype.resoudreNom = function (nom) {
    if (nom === "HEAD" || nom === "@") return this.oidHEAD();
    if (this.oidDeRef("refs/heads/" + nom)) return this.oidDeRef("refs/heads/" + nom);
    if (this.oidDeRef("refs/tags/" + nom)) return this.oidDeRef("refs/tags/" + nom);
    if (this.oidDeRef(nom)) return this.oidDeRef(nom);
    if (/^[0-9a-f]{4,40}$/.test(nom)) {
      var trouves = [];
      for (var oid in this.objets) {
        if (Object.prototype.hasOwnProperty.call(this.objets, oid) && oid.indexOf(nom) === 0) trouves.push(oid);
      }
      if (trouves.length === 1) return trouves[0];
      if (trouves.length > 1) throw new Error("préfixe ambigu : " + nom);
    }
    return null;
  };

  /* --- parcours du graphe --------------------------------------------------- */

  /* Tous les ancêtres d'un commit, lui compris. Un Set en objet simple : le
     modèle doit rester lisible par un apprenant qui ouvre le fichier. */
  Depot.prototype.ancetres = function (oid) {
    var vus = {}, pile = oid ? [oid] : [];
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

  /* Le journal, du plus récent au plus ancien, dans l'ordre des dates puis des
     empreintes (déterministe même quand deux commits partagent une date). */
  Depot.prototype.journal = function (depuis, limite) {
    var debut = depuis ? this.resoudre(depuis) : this.oidHEAD();
    var vus = {}, tas = debut ? [debut] : [], out = [];
    while (tas.length && (!limite || out.length < limite)) {
      tas.sort(function (a, b) {
        var ca = this.lireCommit(a), cb = this.lireCommit(b);
        if (ca.instant !== cb.instant) return ca.instant - cb.instant;
        return ca.oid < cb.oid ? -1 : 1;
      }.bind(this));
      var oid = tas.pop();
      if (vus[oid]) continue;
      vus[oid] = true;
      var c = this.lireCommit(oid);
      out.push(c);
      for (var i = 0; i < c.parents.length; i++) if (!vus[c.parents[i]]) tas.push(c.parents[i]);
    }
    return out;
  };

  /* La base de fusion : le plus récent ancêtre commun. C'est ce que `merge` et
     `rebase` calculent avant toute chose ; sans elle, on ne sait pas quelles
     modifications sont « nouvelles » de chaque côté.
     Méthode : les ancêtres communs, moins ceux qui sont ancêtres d'un autre
     ancêtre commun (sinon on rendrait le plus VIEIL ancêtre, souvent la racine,
     et la fusion rejouerait toute l'histoire). */
  Depot.prototype.basesDeFusion = function (a, b) {
    var oa = this.resoudre(a), ob = this.resoudre(b);
    if (!oa || !ob) return [];
    var ancA = this.ancetres(oa), ancB = this.ancetres(ob);
    var communs = [];
    for (var oid in ancA) if (Object.prototype.hasOwnProperty.call(ancA, oid) && ancB[oid]) communs.push(oid);
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

  Depot.prototype.baseDeFusion = function (a, b) {
    var bases = this.basesDeFusion(a, b);
    return bases.length ? bases[0] : null;
  };

  /* --- index, répertoire de travail, statut --------------------------------- */

  Depot.prototype.ecrireFichier = function (chemin, contenu) {
    this.travail[chemin] = String(contenu);
  };

  Depot.prototype.supprimerFichier = function (chemin) {
    delete this.travail[chemin];
  };

  /* `git add` en une ligne : le contenu du répertoire de travail devient un
     objet, et l'index retient son empreinte. L'apprenant voit ici que « ajouter
     au suivi » copie VRAIMENT le contenu — modifier le fichier ensuite ne change
     pas ce qui est indexé. */
  Depot.prototype.indexer = function (chemin) {
    if (!Object.prototype.hasOwnProperty.call(this.travail, chemin)) {
      delete this.index[chemin];
      return null;
    }
    var oid = this.ecrireBlob(this.travail[chemin]);
    this.index[chemin] = { oid: oid, mode: MODE_FICHIER };
    return oid;
  };

  Depot.prototype.cheminsTravail = function () { return Object.keys(this.travail).sort(); };

  /* Remplit l'index et le répertoire de travail à partir d'un arbre : ce que
     fait un `checkout`. Retourné séparément pour que D2 s'en serve. */
  Depot.prototype.materialiser = function (oidArbre) {
    var plat = this.lireArbre(oidArbre);
    this.index = {};
    this.travail = {};
    for (var chemin in plat) {
      if (!Object.prototype.hasOwnProperty.call(plat, chemin)) continue;
      this.index[chemin] = { oid: plat[chemin].oid, mode: plat[chemin].mode };
      this.travail[chemin] = this.lireBlob(plat[chemin].oid);
    }
  };

  /* Les trois zones comparées deux à deux — c'est littéralement l'affichage de
     `git status`, et la seule façon de comprendre pourquoi un fichier peut être
     à la fois « indexé » et « modifié ». */
  Depot.prototype.statut = function () {
    var tete = this.oidHEAD();
    var arbreTete = tete ? this.lireArbre(this.lireCommit(tete).arbre) : {};
    var indexes = [], modifies = [], suivis = [], supprimes = [];
    var chemin;
    for (chemin in this.index) {
      if (!Object.prototype.hasOwnProperty.call(this.index, chemin)) continue;
      var dansTete = arbreTete[chemin];
      if (!dansTete) indexes.push({ chemin: chemin, etat: "nouveau" });
      else if (dansTete.oid !== this.index[chemin].oid) indexes.push({ chemin: chemin, etat: "modifié" });
    }
    for (chemin in arbreTete) {
      if (!Object.prototype.hasOwnProperty.call(arbreTete, chemin)) continue;
      if (!this.index[chemin]) indexes.push({ chemin: chemin, etat: "supprimé" });
    }
    for (chemin in this.travail) {
      if (!Object.prototype.hasOwnProperty.call(this.travail, chemin)) continue;
      if (!this.index[chemin]) { suivis.push(chemin); continue; }
      if (Depot.empreinteBlob(this.travail[chemin]) !== this.index[chemin].oid) modifies.push(chemin);
    }
    for (chemin in this.index) {
      if (!Object.prototype.hasOwnProperty.call(this.index, chemin)) continue;
      if (!Object.prototype.hasOwnProperty.call(this.travail, chemin)) supprimes.push(chemin);
    }
    function parChemin(a, b) {
      var ca = a.chemin || a, cb = b.chemin || b;
      return ca < cb ? -1 : ca > cb ? 1 : 0;
    }
    return {
      branche: this.brancheCourante(),
      detachee: this.detachee(),
      indexes: indexes.sort(parChemin),
      modifies: modifies.sort(),
      supprimes: supprimes.sort(),
      nonSuivis: suivis.sort(),
      propre: !indexes.length && !modifies.length && !suivis.length && !supprimes.length
    };
  };

  /* --- différences entre deux arbres ---------------------------------------- */

  /* La brique dont merge, rebase, revert et cherry-pick auront besoin (D2) :
     qu'est-ce qui a changé entre ces deux états ? */
  Depot.prototype.diffArbres = function (oidA, oidB) {
    var a = oidA ? this.lireArbre(oidA) : {};
    var b = oidB ? this.lireArbre(oidB) : {};
    var out = [], chemin;
    for (chemin in b) {
      if (!Object.prototype.hasOwnProperty.call(b, chemin)) continue;
      if (!a[chemin]) out.push({ chemin: chemin, etat: "ajouté", avant: null, apres: b[chemin].oid });
      else if (a[chemin].oid !== b[chemin].oid) out.push({ chemin: chemin, etat: "modifié", avant: a[chemin].oid, apres: b[chemin].oid });
    }
    for (chemin in a) {
      if (!Object.prototype.hasOwnProperty.call(a, chemin)) continue;
      if (!b[chemin]) out.push({ chemin: chemin, etat: "supprimé", avant: a[chemin].oid, apres: null });
    }
    return out.sort(function (x, y) { return x.chemin < y.chemin ? -1 : 1; });
  };

  /* --- sérialisation -------------------------------------------------------- */

  /* Un scénario doit pouvoir être repris là où on l'a laissé (D4) et rejoué à
     l'identique par un contrôle. Les objets sont exportés en hexadécimal :
     du texte, donc stockable tel quel dans localStorage. */
  Depot.prototype.exporter = function () {
    var objets = {};
    for (var oid in this.objets) {
      if (!Object.prototype.hasOwnProperty.call(this.objets, oid)) continue;
      objets[oid] = { type: this.objets[oid].type, corps: octetsVersHex(this.objets[oid].corps) };
    }
    return {
      version: 1,
      objets: objets,
      refs: JSON.parse(JSON.stringify(this.refs)),
      HEAD: { symbolique: this.HEAD.symbolique, oid: this.HEAD.oid },
      index: JSON.parse(JSON.stringify(this.index)),
      travail: JSON.parse(JSON.stringify(this.travail)),
      instant: this.instant,
      identite: this.identite
    };
  };

  Depot.importer = function (donnees) {
    var d = new Depot({ identite: donnees.identite });
    for (var oid in donnees.objets) {
      if (!Object.prototype.hasOwnProperty.call(donnees.objets, oid)) continue;
      d.objets[oid] = { type: donnees.objets[oid].type, corps: hexVersOctets(donnees.objets[oid].corps) };
    }
    d.refs = donnees.refs || {};
    d.HEAD = donnees.HEAD || d.HEAD;
    d.index = donnees.index || {};
    d.travail = donnees.travail || {};
    if (donnees.instant) d.instant = donnees.instant;
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
    MODE_FICHIER: MODE_FICHIER,
    MODE_EXECUTABLE: MODE_EXECUTABLE,
    MODE_LIEN: MODE_LIEN,
    MODE_ARBRE: MODE_ARBRE
  };

  if (typeof module !== "undefined" && module.exports) module.exports = GitModele;
  if (racine) racine.GitModele = GitModele;
})(typeof window !== "undefined" ? window : null);
