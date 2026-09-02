/* =============================================================================
   catalogue.js — Rend la grille de cours depuis SITE_DATA, avec recherche
   (texte) et filtres (langage + niveau). Aucun fetch : tout vient de data.js.
   ============================================================================= */
(function () {
  "use strict";

  var DATA = window.SITE_DATA;
  if (!DATA) return;

  var grid = document.getElementById("catalogue-grid");
  var searchInput = document.getElementById("catalogue-search");
  var langSelect = document.getElementById("filter-language");
  var sortSelect = document.getElementById("sort-courses");
  var levelGroup = document.getElementById("filter-level");
  var countEl = document.getElementById("result-count");
  if (!grid) return;

  var STATUS_LABEL = { complet: "Complet", apercu: "Aperçu", bientot: "Bientôt" };

  /* Cours « Web » (le filtre rapide « Web » n'est pas un niveau mais un thème) */
  var WEB_IDS = {
    html: 1, css: 1,
    javascript: 1, typescript: 1, react: 1,
    nodejs: 1, php: 1, "projets-js": 1,
  };
  function isWeb(c) {
    if (WEB_IDS[c.id]) return true;
    return (c.tags || []).some(function (t) {
      return t.toLowerCase() === "web";
    });
  }

  /* Niveaux couverts par un cours. `c.levels` est déduit dans data.js à partir
     des modules ; on retombe sur le niveau unique si le tableau manque. */
  function levelsOf(c) {
    return c.levels && c.levels.length ? c.levels : c.level ? [c.level] : [];
  }

  /* Sections thématiques pour la vue « Grouper par thème ». Tout cours non listé
     retombe dans « Autres » (filet de sécurité : aucun cours ne disparaît). */
  var SECTIONS = [
    { title: "Web & front-end", ids: ["html", "css", "javascript", "typescript", "react", "vue", "sass", "a11y", "ux", "perf-web", "wasm", "projets-js"] },
    { title: "Back-end, données & API", ids: ["python", "nodejs", "php", "sql", "bdd", "pandas", "dataviz", "stats", "data-eng", "nosql", "api", "graphql", "http", "ml", "neurones", "llm"] },
    { title: "Langages de programmation", ids: ["java", "c", "cpp", "csharp", "go", "rust", "ruby", "kotlin", "swift", "r", "dart", "lua", "asm", "haskell", "elixir", "scala", "perl", "cobol", "fortran", "julia", "zig", "lisp", "ocaml", "fsharp", "clojure", "prolog", "ada", "pascal", "vb", "objc", "erlang", "groovy", "solidity"] },
    { title: "Outils, pratiques & transversaux", ids: ["git", "bash", "linux", "reseaux", "os", "distribue", "regex", "docker", "kubernetes", "cloud", "iac", "observabilite", "securite", "offensive", "crypto", "tests", "patterns", "archi", "equipe", "mobile", "formats", "cicd", "markdown", "vscode", "powershell", "algo", "compilation", "maths"] },
  ];
  var SECTION_OF = {};
  SECTIONS.forEach(function (s, i) {
    s.ids.forEach(function (id) { SECTION_OF[id] = i; });
  });
  function sectionIndex(c) {
    return SECTION_OF.hasOwnProperty(c.id) ? SECTION_OF[c.id] : SECTIONS.length;
  }

  var state = { q: "", qRaw: "", lang: "all", level: "all", sort: "default" };

  /* Tri de la liste filtrée (copie : ne mute pas DATA.courses). */
  function sortList(list) {
    var s = state.sort;
    if (s === "az") return list.slice().sort(function (a, b) { return a.title.localeCompare(b.title, "fr"); });
    if (s === "za") return list.slice().sort(function (a, b) { return b.title.localeCompare(a.title, "fr"); });
    if (s === "duration-asc") return list.slice().sort(function (a, b) { return (a.hours || 0) - (b.hours || 0); });
    if (s === "duration-desc") return list.slice().sort(function (a, b) { return (b.hours || 0) - (a.hours || 0); });
    if (s === "lessons-desc") return list.slice().sort(function (a, b) { return (b.lessons || 0) - (a.lessons || 0); });
    return list; // "default" = ordre d'origine de data.js
  }

  /* Index de recherche « profond » : titres de modules et de leçons par cours.
     Permet de retrouver un cours via un mot-clé pointu de son contenu
     (ex. « décorateur », « popover », « BETWEEN ») et de pointer la leçon exacte.
     Construit une fois au démarrage depuis DATA.content (déjà chargé, aucun fetch). */
  var deepIndex = {};
  function buildDeepIndex() {
    var content = DATA.content || {};
    DATA.courses.forEach(function (c) {
      var entry = content[c.id];
      if (!entry || !entry.modules) return;
      var parts = [];
      var lessons = [];
      entry.modules.forEach(function (m) {
        if (m.title) parts.push(m.title);
        if (m.sub) parts.push(m.sub);
        (m.lessons || []).forEach(function (le) {
          if (!le || !le.title) return;
          parts.push(le.title);
          lessons.push({ title: le.title, file: le.file, status: le.status, n: norm(le.title) });
        });
      });
      deepIndex[c.id] = { hay: norm(parts.join(" ")), lessons: lessons };
    });
  }

  /* Première leçon (complète) dont le titre contient la requête, pour y mener
     directement. Ignoré sous 2 caractères, pour éviter le bruit. */
  function matchedLesson(c) {
    if (!state.q || state.q.length < 2) return null;
    var deep = deepIndex[c.id];
    if (!deep) return null;
    for (var i = 0; i < deep.lessons.length; i++) {
      if (deep.lessons[i].n.indexOf(state.q) !== -1) return deep.lessons[i];
    }
    return null;
  }

  /* Normalise pour une recherche insensible à la casse et aux accents */
  function norm(s) {
    return (s || "")
      .toString()
      .toLowerCase()
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, ""); // retire les diacritiques
  }

  function esc(s) {
    return (s || "").replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }

  function escapeRegExp(s) {
    return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  /* Surligne la requête (brute) dans un texte DÉJÀ échappé, insensible à la casse.
     Cosmétique : ne gère pas les accents différents — le filtrage, lui, les ignore. */
  function highlight(escaped, qRaw) {
    if (!qRaw || qRaw.length < 2) return escaped;
    try {
      var re = new RegExp("(" + escapeRegExp(esc(qRaw)) + ")", "gi");
      return escaped.replace(re, "<mark>$1</mark>");
    } catch (e) {
      return escaped;
    }
  }

  /* ---- Construction des filtres ---------------------------------------- */
  function buildLanguageOptions() {
    if (!langSelect) return;
    var langs = [];
    DATA.courses.forEach(function (c) {
      if (langs.indexOf(c.language) === -1) langs.push(c.language);
    });
    langs.sort(function (a, b) {
      return a.localeCompare(b, "fr");
    });
    var html = '<option value="all">Tous les langages</option>';
    langs.forEach(function (l) {
      html += '<option value="' + esc(l) + '">' + esc(l) + "</option>";
    });
    langSelect.innerHTML = html;
  }

  /* ---- Carte de cours -------------------------------------------------- */
  function cardHTML(c) {
    var clickable = c.status !== "bientot" && c.dir;
    // Le catalogue est dans pages/ ; la page de cours est dans pages/<dir>/cours.html
    var href = c.dir + "/cours.html";
    var titleHL = highlight(esc(c.title), state.qRaw);
    var titleInner = clickable
      ? '<a href="' + esc(href) + '">' + titleHL + "</a>"
      : titleHL;

    /* Niveau : une pilule unique pour les cours mono-niveau. Pour les cours qui
       en couvrent plusieurs, la pilule du niveau d'entrée est suivie d'un badge
       « N niveaux » qui annonce jusqu'où le cours monte. */
    var lv = levelsOf(c);
    var levelLabel = DATA.LEVELS[c.level] || c.level;
    var levelHTML =
      '<span class="pill pill--' + esc(c.level) + '">' + esc(levelLabel) + "</span>";
    if (lv.length > 1) {
      var range = lv
        .map(function (k) {
          return DATA.LEVELS[k] || k;
        })
        .join(" → ");
      levelHTML +=
        '<span class="pill pill--niveaux" title="' +
        esc(range) +
        '">' +
        lv.length +
        " niveaux</span>";
    }

    /* Indice « la recherche correspond à cette leçon » + lien direct. */
    var ml = matchedLesson(c);
    var hit = "";
    if (ml && clickable && ml.status === "complet") {
      hit =
        '<a class="course-card__hit" href="' + esc(c.dir + "/" + ml.file) + '">' +
        '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></svg>' +
        "<span>Leçon&nbsp;: " + highlight(esc(ml.title), state.qRaw) + "</span></a>";
    }

    return (
      '<article class="course-card course-card--' +
      c.status +
      '" data-accent="' +
      esc(c.id) +
      '">' +
      '<div class="course-card__top">' +
      '<span class="course-card__glyph" aria-hidden="true">' +
      ((window.courseLogo && window.courseLogo(c.id)) || esc(c.glyph)) +
      "</span>" +
      '<span class="badge badge--' +
      c.status +
      '">' +
      STATUS_LABEL[c.status] +
      "</span>" +
      "</div>" +
      '<h3 class="course-card__title">' +
      titleInner +
      "</h3>" +
      '<p class="course-card__desc">' +
      highlight(esc(c.tagline), state.qRaw) +
      "</p>" +
      '<div class="course-card__foot">' +
      levelHTML +
      '<span class="dot-sep">' +
      c.lessons +
      " leçons</span>" +
      '<span class="dot-sep">~' +
      c.hours +
      " h</span>" +
      "</div>" +
      hit +
      "</article>"
    );
  }

  /* ---- Filtrage + rendu ------------------------------------------------ */
  function matches(c) {
    if (state.lang !== "all" && c.language !== state.lang) return false;
    if (state.level !== "all") {
      if (state.level === "web") {
        if (!isWeb(c)) return false;
      } else if (levelsOf(c).indexOf(state.level) === -1) {
        // Un cours fusionné couvre plusieurs niveaux : il répond à chacun d'eux.
        return false;
      }
    }
    if (state.q) {
      var hay = norm(
        c.title + " " + c.language + " " + c.tagline + " " + (c.tags || []).join(" ")
      );
      var deep = deepIndex[c.id];
      var hit = hay.indexOf(state.q) !== -1 || (deep && deep.hay.indexOf(state.q) !== -1);
      if (!hit) return false;
    }
    return true;
  }

  function render() {
    writeURL();
    var filtered = DATA.courses.filter(matches);

    if (countEl) {
      var n = filtered.length;
      countEl.textContent =
        n === 0 ? "Aucun cours trouvé" : n + " cours" + (n > 1 ? " trouvés" : " trouvé");
    }

    if (filtered.length === 0) {
      grid.className = "grid grid--cards";
      grid.innerHTML =
        '<div class="empty-state">' +
        '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>' +
        "<p>Aucun cours ne correspond à votre recherche.</p>" +
        "<p>Essayez d'élargir les filtres ou un autre mot-clé.</p>" +
        "</div>";
      return;
    }

    if (state.sort === "grouped") {
      renderGrouped(filtered);
    } else {
      grid.className = "grid grid--cards";
      /* h2 masqué (sr-only) pour éviter le saut de titre h1 → h3 des cartes en
         vue « à plat » ; la vue groupée a déjà ses h2 de section. (cf. D2) */
      grid.innerHTML =
        '<h2 class="sr-only">Tous les cours</h2>' +
        sortList(filtered).map(cardHTML).join("");
    }
  }

  /* Vue groupée : une sous-grille par section thématique non vide. */
  function renderGrouped(list) {
    var groups = SECTIONS.map(function (s) { return { title: s.title, items: [] }; });
    groups.push({ title: "Autres", items: [] });
    list.forEach(function (c) { groups[sectionIndex(c)].items.push(c); });
    grid.className = "catalogue-grouped";
    grid.innerHTML = groups
      .filter(function (g) { return g.items.length; })
      .map(function (g) {
        return (
          '<section class="catalogue-section">' +
          '<h2 class="catalogue-section__title">' + esc(g.title) +
          ' <span class="catalogue-section__count">' + g.items.length + "</span></h2>" +
          '<div class="grid grid--cards">' + g.items.map(cardHTML).join("") + "</div>" +
          "</section>"
        );
      })
      .join("");
  }

  /* ---- Écouteurs ------------------------------------------------------- */
  if (searchInput) {
    searchInput.addEventListener("input", function () {
      state.qRaw = searchInput.value.trim();
      state.q = norm(state.qRaw);
      render();
    });
  }

  if (langSelect) {
    langSelect.addEventListener("change", function () {
      state.lang = langSelect.value;
      render();
    });
  }

  if (sortSelect) {
    sortSelect.addEventListener("change", function () {
      state.sort = sortSelect.value;
      render();
    });
  }

  if (levelGroup) {
    levelGroup.addEventListener("click", function (e) {
      var btn = e.target.closest("[data-level]");
      if (!btn) return;
      state.level = btn.getAttribute("data-level");
      $all("[data-level]", levelGroup).forEach(function (b) {
        b.setAttribute("aria-pressed", b === btn ? "true" : "false");
      });
      render();
    });
  }

  function $all(sel, ctx) {
    return Array.prototype.slice.call((ctx || document).querySelectorAll(sel));
  }

  /* ---- Lien partageable : état ⇄ URL (?q=&lang=&level=) ---------------- */
  /* Best effort : en file://, replaceState peut échouer → on l'ignore. */
  function readURL() {
    try {
      var p = new URLSearchParams(location.search);
      state.qRaw = (p.get("q") || "").trim();
      state.q = norm(state.qRaw);
      state.lang = p.get("lang") || "all";
      state.level = p.get("level") || "all";
      state.sort = p.get("sort") || "default";
    } catch (e) {
      return;
    }
    if (searchInput) searchInput.value = state.qRaw;
    if (langSelect) langSelect.value = state.lang;
    if (sortSelect) sortSelect.value = state.sort;
    if (levelGroup) {
      $all("[data-level]", levelGroup).forEach(function (b) {
        b.setAttribute(
          "aria-pressed",
          b.getAttribute("data-level") === state.level ? "true" : "false"
        );
      });
    }
  }

  function writeURL() {
    try {
      var p = new URLSearchParams();
      if (state.qRaw) p.set("q", state.qRaw);
      if (state.lang && state.lang !== "all") p.set("lang", state.lang);
      if (state.level && state.level !== "all") p.set("level", state.level);
      if (state.sort && state.sort !== "default") p.set("sort", state.sort);
      var qs = p.toString();
      var file = location.pathname.split("/").pop() || "catalogue.html";
      history.replaceState(null, "", file + (qs ? "?" + qs : "") + location.hash);
    } catch (e) {
      /* file:// peut refuser replaceState : sans gravité */
    }
  }

  /* ---- « / » cible la recherche du catalogue -------------------------
     La palette globale (js/main.js) réclame aussi « / ». Sur le catalogue,
     c'est le champ visible de la page qui doit gagner : on écoute en phase
     CAPTURE (donc avant le gestionnaire « bubble » de la palette) et on
     arrête la propagation, sinon les deux se déclenchent. La palette reste
     ouvrable via Ctrl+K et le bouton loupe de l'en-tête. */
  document.addEventListener("keydown", function (e) {
    if (!searchInput) return;
    if (e.key !== "/" || e.ctrlKey || e.metaKey || e.altKey) return;
    var t = e.target || {};
    if (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.tagName === "SELECT" || t.isContentEditable) return;
    e.preventDefault();
    e.stopPropagation();
    searchInput.focus();
    searchInput.select();
  }, true);

  /* ---- Échap efface la recherche (phase bubble) ---- */
  document.addEventListener("keydown", function (e) {
    if (searchInput && e.key === "Escape" && (e.target || {}) === searchInput) {
      searchInput.value = "";
      state.qRaw = "";
      state.q = "";
      render();
      searchInput.blur();
    }
  });

  /* ---- Démarrage ------------------------------------------------------- */
  buildLanguageOptions();
  buildDeepIndex();
  readURL();
  render();
})();
