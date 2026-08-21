/* =============================================================================
   imprimer.js — LIVRET DE RÉVISION imprimable d'un cours (→ PDF via print()).
   Page : pages/imprimer.html?cours=<dir>.

   Pourquoi un livret et pas le cours entier (V12-E2) : assembler le texte
   intégral demande de lire chaque leçon, donc un `fetch` — refusé en file://.
   La seule alternative hors serveur serait de PRÉ-GÉNÉRER une copie du contenu
   (mesuré : 35,7 Mo, réécrits à chaque passe de l'autonomie). Le livret, lui,
   ne duplique RIEN : il ré-assemble trois index déjà présents dans le dépôt —
   antisèches, glossaire, pièges — soit ~62 Ko de matière par cours en moyenne.

   Les index sont chargés À LA DEMANDE par injection d'un <script> (5,3 Mo au
   total : on ne les pose pas dans le <head> de la page).
   En HTTP, le texte intégral des leçons reste proposé en section supplémentaire.
   ============================================================================= */
(function () {
  "use strict";

  var DATA = window.SITE_DATA;
  var statusEl = document.getElementById("print-status");
  var contentEl = document.getElementById("print-content");
  var titleEl = document.getElementById("print-title");
  var printBtn = document.getElementById("print-btn");
  var choixEl = document.getElementById("print-sections");
  if (!DATA || !contentEl || !statusEl) return;

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }

  var HTTP = location.protocol === "http:" || location.protocol === "https:";

  var dir = "";
  try {
    dir = new URLSearchParams(location.search).get("cours") || "";
  } catch (e) {}

  /* Retrouver le cours par son dossier (dir). */
  var course = null;
  var courseId = "";
  for (var k in DATA.content) {
    if (DATA.content.hasOwnProperty(k) && DATA.content[k].dir === dir) {
      course = DATA.content[k];
      courseId = k;
      break;
    }
  }
  if (!course) {
    statusEl.innerHTML =
      'Cours introuvable. <a href="catalogue.html">Retour au catalogue</a>.';
    return;
  }

  if (titleEl) titleEl.textContent = course.title;
  document.title = "Livret de révision — " + course.title + " — Syntaxe";

  /* Fiche du catalogue (résumé) : DATA.courses est une liste. */
  var meta = null;
  (DATA.courses || []).forEach(function (c) {
    if (c.id === courseId) meta = c;
  });

  /* Liste à plat des leçons publiées. */
  var lessons = [];
  course.modules.forEach(function (m) {
    m.lessons.forEach(function (l) {
      if (l.file && l.file !== "#" && l.status !== "bientot") lessons.push(l);
    });
  });

  /* ------------------------------------------------- sections du livret --
     `src` est injecté au premier besoin ; `glob` est le nom de la globale que
     ce fichier pose sur window. */
  var SECTIONS = [
    { id: "plan", label: "Plan du cours", note: "modules et leçons" },
    {
      id: "antiseches",
      label: "Antisèches",
      note: "les tableaux de synthèse des leçons",
      src: "../js/antiseches-data.js",
      glob: "ANTISECHES",
    },
    {
      id: "glossaire",
      label: "Glossaire",
      note: "les termes définis dans le cours",
      src: "../js/flashcards-data.js",
      glob: "FLASHCARDS",
    },
    {
      id: "pieges",
      label: "Pièges fréquents",
      note: "les encadrés « Piège » des leçons",
      src: "../js/pieges-data.js",
      glob: "PIEGES",
    },
    {
      id: "lecons",
      label: "Texte intégral des leçons",
      note: "le texte entier, lu depuis le serveur",
      http: true,
    },
  ];

  var etat = {};     /* id → "cours" | "charge" | "echec" */
  var attentes = {}; /* id → rappels en attente pendant un chargement */
  var compte = {};   /* id → nombre d'éléments retenus pour CE cours */
  var lecons = "";   /* HTML assemblé des leçons (HTTP seulement) */

  function coche(id) {
    var el = document.getElementById("sec-" + id);
    return !!(el && el.checked);
  }

  /* ------------------------------------------------------- chargement ---- */
  function charger(src, cb) {
    var s = document.createElement("script");
    s.src = src;
    s.onload = function () { cb(true); };
    s.onerror = function () { cb(false); };
    document.head.appendChild(s);
  }

  /* Trois états, jamais confondus : « en cours », « chargé », « en échec ».
     Sans le premier, décocher puis recocher pendant que l'index est en vol
     injectait un SECOND <script> (jusqu'à 3 Mo relus), et un rendu déclenché
     entre-temps affirmait par écrit que le cours n'avait aucune fiche. */
  function assurer(sec, cb) {
    if (sec.id === "lecons") {
      if (!HTTP || lecons || etat.lecons === "echec") return cb();
      if (etat.lecons === "cours") { attentes.lecons.push(cb); return; }
      etat.lecons = "cours";
      attentes.lecons = [cb];
      return chargerLecons(function () { liberer("lecons"); });
    }
    if (!sec.src) return cb();
    if (etat[sec.id] === "charge" || etat[sec.id] === "echec") return cb();
    if (window[sec.glob]) { etat[sec.id] = "charge"; return cb(); }
    if (etat[sec.id] === "cours") { attentes[sec.id].push(cb); return; }
    etat[sec.id] = "cours";
    attentes[sec.id] = [cb];
    statusEl.textContent = "Chargement — " + sec.label.toLowerCase() + "…";
    charger(sec.src, function (ok) {
      etat[sec.id] = ok && window[sec.glob] ? "charge" : "echec";
      liberer(sec.id);
    });
  }

  function liberer(id) {
    var f = attentes[id] || [];
    attentes[id] = [];
    f.forEach(function (fn) { fn(); });
  }

  /* Texte intégral : uniquement en HTTP, et uniquement si on le demande. */
  function chargerLecons(cb) {
    statusEl.textContent = "Lecture des " + lessons.length + " leçons…";
    Promise.all(
      lessons.map(function (l) {
        return fetch(dir + "/" + l.file)
          .then(function (r) { return r.ok ? r.text() : ""; })
          .then(function (html) { return { l: l, html: html }; })
          .catch(function () { return { l: l, html: "" }; });
      })
    ).then(function (parts) {
      var out = "";
      var ok = 0;
      parts.forEach(function (p) {
        if (!p.html) return;
        var doc = new DOMParser().parseFromString(p.html, "text/html");
        var prose = doc.querySelector(".prose");
        if (!prose) return;
        var h1 = doc.querySelector(".lesson-header__title");
        var scripts = prose.querySelectorAll("script");
        for (var i = 0; i < scripts.length; i++) {
          scripts[i].parentNode.removeChild(scripts[i]);
        }
        out +=
          '<section class="print-lesson">' +
          '<h3 class="print-lesson__title">' + esc(h1 ? h1.textContent : p.l.title) + "</h3>" +
          prose.innerHTML +
          "</section>";
        ok++;
      });
      lecons = out;
      compte.lecons = ok;
      etat.lecons = ok ? "charge" : "echec";
      cb();
    });
  }

  /* Numéro réel de la leçon (data.js le porte : « 04 »), et non la position
     dans son module : le plan doit dire la même chose que les antisèches et
     les pièges du même livret, et que la page du cours. */
  function numLecon(l) {
    if (l.num) return String(l.num);
    var m = String(l.file || "").match(/(\d+)/);
    return m ? m[1] : "";
  }

  /* ------------------------------------------------------------ rendus --- */
  function duCours(liste) {
    return (liste || []).filter(function (x) { return x.c === dir; });
  }

  function couverture() {
    var nbMod = course.modules.length;
    var desc = meta && meta.tagline ? meta.tagline : "";
    return (
      '<header class="livret-cover">' +
      '<p class="livret-cover__kicker">Livret de révision</p>' +
      '<h2 class="livret-cover__title">' + esc(course.title) + "</h2>" +
      (desc ? '<p class="livret-cover__desc">' + esc(desc) + "</p>" : "") +
      '<p class="livret-cover__meta">' +
      nbMod + " module" + (nbMod > 1 ? "s" : "") + " · " +
      lessons.length + " leçon" + (lessons.length > 1 ? "s" : "") +
      " · Syntaxe</p>" +
      "</header>"
    );
  }

  function partiePlan() {
    var html = "";
    course.modules.forEach(function (m, i) {
      html += '<div class="livret-plan__mod">';
      html += "<h3>" + (i + 1) + ". " + esc(m.title) + "</h3>";
      /* Liste NON numérotée : un <ol> repartirait de 1 à chaque module et le
         numéro imprimé contredirait celui du site. Le vrai numéro est écrit. */
      html += '<ul class="livret-plan__list">';
      m.lessons.forEach(function (l) {
        var pub = l.file && l.file !== "#" && l.status !== "bientot";
        var n = numLecon(l);
        html +=
          "<li>" +
          (n ? '<span class="livret-plan__num">' + esc(n) + "</span> " : "") +
          (pub
            ? '<a href="' + esc(dir) + "/" + esc(l.file) + '">' + esc(l.title) + "</a>"
            : esc(l.title) + " <em>(à venir)</em>") +
          "</li>";
      });
      html += "</ul></div>";
    });
    return html;
  }

  /* Même rendu que pages/antiseches.html : les cellules contiennent déjà du
     HTML (code, strong…) écrit dans les leçons — on ne l'échappe pas. */
  function tableau(s) {
    var cols = s.h && s.h.length ? s.h.length : 0;
    var html = '<figure class="cheat-table"><table>';
    html += "<caption>" + (s.t || "") + "</caption>";
    if (cols) {
      html += "<thead><tr>";
      s.h.forEach(function (th) { html += '<th scope="col">' + th + "</th>"; });
      html += "</tr></thead>";
    }
    html += "<tbody>";
    (s.r || []).forEach(function (row) {
      html += "<tr>";
      row.forEach(function (cell, i) {
        var span = cols && i === row.length - 1 && row.length < cols ? cols - row.length + 1 : 1;
        html += (span > 1 ? '<td colspan="' + span + '">' : "<td>") + cell + "</td>";
      });
      html += "</tr>";
    });
    return html + "</tbody></table></figure>";
  }

  function partieAntiseches(items) {
    var html = "";
    items.forEach(function (s) {
      var label = (s.n ? "Leçon " + esc(s.n) : "Leçon") + (s.lt ? " · " + esc(s.lt) : "");
      html += '<section class="cheat-card">';
      html += '<h3><a href="' + esc(s.c) + "/" + esc(s.f) + '">' + label + "</a></h3>";
      html += tableau(s);
      html += "</section>";
    });
    return html;
  }

  /* Tri alphabétique, comme la page Glossaire. Les définitions contiennent du
     HTML (em, code…), on ne les échappe pas.
     Le filtre `vus` est un garde-fou, pas une correction : mesuré sur les
     10 678 cartes, l'index ne contient AUCUN doublon par cours — build-index.js
     dédoublonne déjà, et plus fortement (il replie aussi les accents). Il ne
     retire donc rien aujourd'hui ; il protège si le générateur change. */
  function partieGlossaire(items) {
    var vus = {};
    var uniques = [];
    items.forEach(function (it) {
      var cle = String(it.t || "").toLowerCase();
      if (vus[cle]) return;
      vus[cle] = 1;
      uniques.push(it);
    });
    uniques.sort(function (a, b) {
      return String(a.t).localeCompare(String(b.t), "fr", { sensitivity: "base" });
    });
    compte.glossaire = uniques.length;
    var html = '<dl class="glossary livret-glossaire">';
    uniques.forEach(function (it) {
      html += "<dt>" + esc(it.t) + "</dt>";
      html += "<dd>" + it.d + "</dd>";
    });
    return html + "</dl>";
  }

  function partiePieges(items) {
    var html = '<ul class="piege-list">';
    items.forEach(function (p) {
      html +=
        '<li class="piege">' +
        '<p class="piege__texte">' + p.x + "</p>" +
        '<p class="piege__source"><a href="' + esc(p.c) + "/" + esc(p.f) + '">' +
        (p.n ? "Leçon " + esc(p.n) + " — " : "") + esc(p.lt) + "</a></p>" +
        "</li>";
    });
    return html + "</ul>";
  }

  function partie(titre, sous, corps) {
    return (
      '<section class="livret-part">' +
      '<h2 class="livret-part__title">' + esc(titre) + "</h2>" +
      (sous ? '<p class="livret-part__lead">' + esc(sous) + "</p>" : "") +
      corps +
      "</section>"
    );
  }

  function indisponible(sec) {
    return partie(
      sec.label,
      "",
      '<p class="livret-vide">Données indisponibles : <code>' +
        esc(sec.src || "") +
        "</code> n'a pas pu être chargé.</p>"
    );
  }

  function enChargement(sec) {
    return partie(sec.label, "", '<p class="livret-vide">Chargement…</p>');
  }

  /* ------------------------------------------------------------- rendu --- */
  function rendre() {
    var html = "";
    var parties = 0;
    var a, g, p;

    if (coche("plan")) {
      html += partie(
        "Plan du cours",
        course.modules.length + " modules, " + lessons.length + " leçons.",
        partiePlan()
      );
      parties++;
    }

    if (coche("antiseches")) {
      if (etat.antiseches === "echec") {
        html += indisponible(SECTIONS[1]);
      } else if (etat.antiseches !== "charge") {
        html += enChargement(SECTIONS[1]);
      } else {
        a = duCours(window.ANTISECHES);
        compte.antiseches = a.length;
        html += partie(
          "Antisèches",
          a.length + " fiche" + (a.length > 1 ? "s" : "") + " de synthèse.",
          a.length ? partieAntiseches(a) : '<p class="livret-vide">Aucune fiche pour ce cours.</p>'
        );
      }
      parties++;
    }

    if (coche("glossaire")) {
      if (etat.glossaire === "echec") {
        html += indisponible(SECTIONS[2]);
      } else if (etat.glossaire !== "charge") {
        html += enChargement(SECTIONS[2]);
      } else {
        g = duCours(window.FLASHCARDS);
        var corpsG = g.length
          ? partieGlossaire(g)
          : '<p class="livret-vide">Aucun terme pour ce cours.</p>';
        var nbG = compte.glossaire || 0;
        html += partie(
          "Glossaire",
          nbG + " terme" + (nbG > 1 ? "s" : "") + ", par ordre alphabétique.",
          corpsG
        );
      }
      parties++;
    }

    if (coche("pieges")) {
      if (etat.pieges === "echec") {
        html += indisponible(SECTIONS[3]);
      } else if (etat.pieges !== "charge") {
        html += enChargement(SECTIONS[3]);
      } else {
        p = duCours(window.PIEGES);
        compte.pieges = p.length;
        html += partie(
          "Pièges fréquents",
          p.length + " piège" + (p.length > 1 ? "s" : "") + " relevé" + (p.length > 1 ? "s" : "") +
            " dans les leçons.",
          p.length ? partiePieges(p) : '<p class="livret-vide">Aucun piège relevé pour ce cours.</p>'
        );
      }
      parties++;
    }

    if (coche("lecons")) {
      if (etat.lecons === "echec") {
        html += partie(
          "Texte intégral des leçons",
          "",
          "<p class=\"livret-vide\">Les leçons n'ont pas pu être lues. Le reste du " +
            "livret, lui, est complet.</p>"
        );
        parties++;
      } else if (lecons) {
        html += partie(
          "Texte intégral des leçons",
          compte.lecons + " leçons assemblées.",
          lecons
        );
        parties++;
      }
    }

    /* La couverture n'a de sens qu'avec au moins une partie : sinon Ctrl+P
       imprimait un titre suivi de rien. */
    contentEl.innerHTML = parties ? couverture() + html : "";
    majCompteurs();

    /* « 1 pièges » se lisait sur 2 cours (llm, archi) : le bilan accorde. */
    function pluriel(n, mot) { return n + " " + mot + (n > 1 ? "s" : ""); }
    var bilan = [];
    if (coche("antiseches") && compte.antiseches != null) bilan.push(pluriel(compte.antiseches, "fiche"));
    if (coche("glossaire") && compte.glossaire != null) bilan.push(pluriel(compte.glossaire, "terme"));
    if (coche("pieges") && compte.pieges != null) bilan.push(pluriel(compte.pieges, "piège"));
    if (coche("lecons") && compte.lecons) bilan.push(pluriel(compte.lecons, "leçon"));

    /* Une section cochée mais pas encore chargée : le dire, plutôt que d'inviter
       à imprimer un livret incomplet. */
    var enVol = SECTIONS.some(function (sec) {
      return sec.src && coche(sec.id) && etat[sec.id] !== "charge" && etat[sec.id] !== "echec";
    });
    statusEl.textContent = !parties
      ? "Coche au moins une section pour construire le livret."
      : enVol
        ? "Chargement du livret…"
        : course.title + " — " + (bilan.length ? bilan.join(" · ") + ". " : "") +
          "Clique sur « Imprimer » pour enregistrer en PDF.";
    if (printBtn) printBtn.hidden = !parties || enVol;
  }

  /* Reporte le décompte réel sur l'étiquette de chaque case. */
  function majCompteurs() {
    SECTIONS.forEach(function (sec) {
      var el = document.getElementById("cnt-" + sec.id);
      if (!el) return;
      if (sec.id === "plan") { el.textContent = String(lessons.length); return; }
      /* Tant que l'index n'est pas là, on n'écrit pas « 0 » : ce serait faux. */
      if (sec.src && etat[sec.id] !== "charge") { el.textContent = "…"; return; }
      var n = compte[sec.id];
      el.textContent = n == null ? "" : String(n);
    });
  }

  /* --------------------------------------------------- cases à cocher ---- */
  function construireChoix() {
    if (!choixEl) return;
    var html =
      '<legend class="print-sections__title">Contenu du livret</legend>' +
      '<div class="print-sections__list">';
    SECTIONS.forEach(function (sec) {
      if (sec.http && !HTTP) return;
      var actif = sec.id !== "lecons";
      html +=
        '<label class="print-sections__item">' +
        '<input type="checkbox" id="sec-' + sec.id + '"' + (actif ? " checked" : "") + " />" +
        "<span><strong>" + esc(sec.label) + "</strong> " +
        '<span class="print-sections__count" id="cnt-' + sec.id + '"></span>' +
        '<br><span class="print-sections__note">' + esc(sec.note) + "</span></span>" +
        "</label>";
    });
    html += "</div>";
    choixEl.innerHTML = html;
    choixEl.hidden = false;

    SECTIONS.forEach(function (sec) {
      var el = document.getElementById("sec-" + sec.id);
      if (!el) return;
      el.addEventListener("change", function () {
        if (el.checked) assurer(sec, rendre);
        else rendre();
      });
    });
  }

  /* ---------------------------------------------------------- démarrage -- */
  construireChoix();

  var aCharger = SECTIONS.filter(function (s) {
    return s.src && coche(s.id);
  });
  (function suivant(i) {
    if (i >= aCharger.length) return rendre();
    assurer(aCharger[i], function () { suivant(i + 1); });
  })(0);

  if (printBtn) {
    printBtn.addEventListener("click", function () { window.print(); });
  }
})();
