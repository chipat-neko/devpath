/* =============================================================================
   decodeur.js — La recherche du décodeur de messages d'erreur (page decodeur.html).

   CE QU'IL FAUT COMPRENDRE POUR LIRE CE FICHIER : l'apprenant ne tape pas une requête,
   il COLLE ce que sa console a craché. Ce texte porte donc des chemins de fichiers, des
   numéros de ligne, une trace d'appels, et — surtout — LES NOMS DE SES VARIABLES À LUI.
   Une recherche par mots ne peut pas marcher : « ReferenceError: totl is not defined »
   et « ReferenceError: monComtpeur is not defined » n'ont aucun mot rare en commun.

   D'où trois passes, de la plus sûre à la plus tolérante :
     1. le MOTIF de chaque erreur (expression rationnelle qui ignore les noms propres) ;
     2. les CLÉS, morceaux de phrase stables du message ;
     3. les mots restants, pour rattraper une saisie approximative.
   Le score dit laquelle des trois a répondu : l'apprenant voit pourquoi on lui propose
   telle fiche.

   100 % file:// : script classique, aucune dépendance, aucun réseau.
   Données : js/erreurs-data.js (window.ERREURS), vérifiées par tools/verif-erreurs.js.
   ============================================================================= */
(function () {
  "use strict";

  var DONNEES = (window.ERREURS || []).slice();
  var champ = document.getElementById("dec-input");
  var zone = document.getElementById("dec-resultats");
  var compte = document.getElementById("dec-count");
  var filtres = Array.prototype.slice.call(document.querySelectorAll(".dec-filtre"));
  if (!champ || !zone) return;

  var langue = "";

  /* ---------------------------------------------------------------------------
     NETTOYAGE DU TEXTE COLLÉ. On cherche la LIGNE qui porte le message. Node place
     souvent la trace avant, Python toujours après : dans les deux cas, la ligne utile
     est celle qui commence par un nom d'erreur. Si on n'en trouve pas, on garde tout.
     --------------------------------------------------------------------------- */
  function ligneUtile(texte) {
    var lignes = String(texte).split(/\r?\n/);
    for (var i = 0; i < lignes.length; i++) {
      var l = lignes[i].trim();
      /* Python préfixe parfois le nom du module : « __main__.MonErreur: … ». */
      var m = l.match(/([A-Za-z_][A-Za-z0-9_.]*(?:Error|Exception|Warning|Interrupt)\s*:.*)$/);
      if (m) return m[1].trim();
    }
    for (var j = 0; j < lignes.length; j++) if (lignes[j].trim()) return lignes[j].trim();
    return "";
  }
  /* Pour la comparaison par mots : on retire ce qui est propre à l'exécution — chemins,
     numéros de ligne, guillemets — et on replie la casse et les accents. */
  function normaliser(s) {
    s = String(s || "");
    if (s.normalize) s = s.normalize("NFD").replace(/[̀-ͯ]/g, "");
    return s
      .replace(/[a-zA-Z]:\\[^\s:]+|\/[\w./-]+\.(?:js|py|mjs|cjs)/g, " ")
      .replace(/line \d+|:\d+:\d+|position \d+/g, " ")
      .replace(/[«»""'`]/g, " ")
      .toLowerCase()
      .replace(/\s+/g, " ")
      .trim();
  }
  /* ⚠️ LES MOTS VIDES SONT LE PIÈGE DE LA TROISIÈME PASSE. Mesuré dans Chrome
     (tools/preuves/decodeur.js) : « GraveError: everything is on fire in the datacenter »
     — une phrase inventée de toutes pièces — remontait une fiche, parce qu'elle partage
     « the » avec « the top level bodies of modules ». Un décodeur qui répond à tout ne
     répond à rien. */
  var VIDES = ["the", "and", "for", "not", "was", "you", "are", "his", "her", "que", "les",
               "des", "une", "est", "pas", "dans", "with", "from", "this", "that", "has"];
  function mots(s) {
    return normaliser(s).split(/[^a-z0-9_]+/).filter(function (m) {
      return m.length > 2 && VIDES.indexOf(m) < 0;
    });
  }

  /* ---------------------------------------------------------------------------
     LE SCORE. 100 = le motif reconnaît la ligne (certitude) ; 40..90 = les clés du
     message se retrouvent dans le texte ; 1..39 = simple recoupement de mots.
     --------------------------------------------------------------------------- */
  function score(entree, brut, ligne) {
    if (langue && entree.langue !== langue) return -1;
    var re = null;
    try { re = new RegExp(entree.motif); } catch (e) { re = null; }
    if (re && re.test(ligne)) return 100;
    /* Le motif est ancré : on le réessaie sans ses ancres, pour une trace où le message
       est collé au milieu d'une autre phrase. */
    if (re) {
      try {
        var souple = new RegExp(entree.motif.replace(/^\^/, "").replace(/\$$/, ""));
        if (souple.test(brut)) return 95;
      } catch (e) { /* motif non réutilisable tel quel : on passe à la suite */ }
    }
    var n = normaliser(brut), pris = 0;
    (entree.cles || []).forEach(function (c) { if (n.indexOf(normaliser(c)) >= 0) pris++; });
    if (pris) return 40 + Math.round((pris / entree.cles.length) * 50);
    var m = mots(brut), cible = mots(entree.message + " " + entree.type), communs = 0;
    m.forEach(function (x) { if (cible.indexOf(x) >= 0) communs++; });
    /* UN SEUL mot commun ne fait pas une piste : c'est le coup du hasard. */
    if (communs < 2) return 0;
    return Math.min(39, Math.round((communs / Math.max(1, cible.length)) * 39));
  }

  /* ⚠️ DEUX MOTIFS PEUVENT RECONNAÎTRE LE MÊME MESSAGE, et le plus général gagnait par
     simple ordre d'écriture. Mesuré : « TypeError: scores.map is not a function » était
     rendu par `js-not-a-function` (motif « … is not a function ») au lieu de
     `js-map-objet` (« ….map is not a function »), et « TypeError: 'int' object is not
     iterable » — du Python — par la fiche JavaScript « … is not iterable ». À score égal,
     on départage donc par la SPÉCIFICITÉ du motif : plus il contient de caractères
     littéraux, plus il décrit précisément le message, moins il est un attrape-tout. */
  function specificite(entree) {
    return String(entree.motif || "").replace(/\\.|\(\?:|[()\[\]{}|^$*+?.]/g, "").length;
  }

  var NOM_LANGUE = { javascript: "JavaScript", python: "Python", sql: "SQL", bash: "Bash" };

  /* --------------------------------- rendu --------------------------------- */
  function ech(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
  function certitude(s) {
    if (s >= 95) return { texte: "correspondance exacte", classe: "is-sure" };
    if (s >= 40) return { texte: "correspondance probable", classe: "is-probable" };
    return { texte: "piste", classe: "is-piste" };
  }
  function fiche(e, s, ouvert) {
    var c = certitude(s);
    return (
      '<article class="dec-fiche ' + (ouvert ? "is-ouverte" : "") + '" data-id="' + ech(e.id) + '">' +
        '<header class="dec-fiche__tete">' +
          '<span class="dec-fiche__langue">' + NOM_LANGUE[e.langue] + "</span>" +
          '<h2 class="dec-fiche__titre"><code>' + ech(e.gabarit) + "</code></h2>" +
          (s > 0 ? '<span class="dec-fiche__score ' + c.classe + '">' + c.texte + "</span>" : "") +
        "</header>" +
        '<div class="dec-fiche__corps">' +
          '<p class="dec-fiche__cause"><strong>Ce qui s\'est passé&nbsp;:</strong> ' + ech(e.cause) + "</p>" +
          '<p class="dec-fiche__remede"><strong>Ce qu\'il faut faire&nbsp;:</strong> ' + ech(e.remede) + "</p>" +
          '<div class="dec-fiche__codes">' +
            '<div class="dec-code dec-code--ko"><span class="dec-code__etiq">Ce qui casse</span>' +
              "<pre><code>" + ech(e.exemple.fautif) + "</code></pre></div>" +
            '<div class="dec-code dec-code--ok"><span class="dec-code__etiq">Ce qui marche</span>' +
              "<pre><code>" + ech(e.exemple.corrige) + "</code></pre></div>" +
          "</div>" +
          '<p class="dec-fiche__pied">' +
            '<a class="dec-fiche__lecon" href="' + ech(e.lecon.href) + '">Revoir «&nbsp;' + ech(e.lecon.label) + "&nbsp;»</a>" +
            '<span class="dec-fiche__moteur">message relevé sur&nbsp;: ' + ech(e.moteur) + "</span>" +
          "</p>" +
        "</div>" +
      "</article>"
    );
  }

  function afficher() {
    var brut = champ.value.trim();
    var ligne = ligneUtile(brut);
    var liste = DONNEES
      .map(function (e) { return { e: e, s: brut ? score(e, brut, ligne) : 0 }; })
      .filter(function (x) { return x.s >= 0 && (!brut || x.s > 0); });

    if (!brut) {
      liste = DONNEES.filter(function (e) { return !langue || e.langue === langue; })
        .map(function (e) { return { e: e, s: 0 }; });
      compte.textContent = liste.length + " erreur" + (liste.length > 1 ? "s" : "") + " répertoriée" + (liste.length > 1 ? "s" : "");
    } else {
      liste.sort(function (a, b) { return (b.s - a.s) || (specificite(b.e) - specificite(a.e)); });
      compte.textContent = liste.length
        ? liste.length + " correspondance" + (liste.length > 1 ? "s" : "")
        : "aucune correspondance — le décodeur ne connaît pas encore cette erreur";
    }

    if (!liste.length) {
      zone.innerHTML =
        '<p class="fts-empty">Rien trouvé pour ce message. Vérifie que tu as bien collé la ligne qui ' +
        "commence par le nom de l'erreur, ou <a href=\"recherche.html\">cherche la notion dans les leçons</a>.</p>";
      return;
    }
    zone.innerHTML = liste
      .map(function (x, i) { return fiche(x.e, x.s, brut ? i === 0 : false); })
      .join("");
  }

  /* Les fiches se déplient au clic sur leur titre : la liste complète reste lisible. */
  zone.addEventListener("click", function (ev) {
    var tete = ev.target.closest ? ev.target.closest(".dec-fiche__tete") : null;
    if (!tete) return;
    var f = tete.parentNode;
    f.classList.toggle("is-ouverte");
  });

  var minuteur = null;
  champ.addEventListener("input", function () {
    clearTimeout(minuteur);
    minuteur = setTimeout(afficher, 120);
  });
  filtres.forEach(function (b) {
    b.addEventListener("click", function () {
      filtres.forEach(function (x) { x.classList.remove("is-active"); });
      b.classList.add("is-active");
      langue = b.getAttribute("data-langue") || "";
      afficher();
    });
  });

  /* Point d'entrée mesurable par les outils de preuve (tools/preuves/decodeur.js) :
     il rend le classement sans passer par le DOM. */
  window.__DECODEUR = {
    chercher: function (texte, lang) {
      var avant = langue;
      langue = lang || "";
      var ligne = ligneUtile(texte);
      var r = DONNEES.map(function (e) { return { id: e.id, s: score(e, texte, ligne), spec: specificite(e) }; })
        .filter(function (x) { return x.s > 0; })
        .sort(function (a, b) { return (b.s - a.s) || (b.spec - a.spec); });
      langue = avant;
      return r;
    },
    total: DONNEES.length
  };

  afficher();
})();
