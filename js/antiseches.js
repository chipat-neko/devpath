/* =============================================================================
   antiseches.js — Antisèches PAR COURS. La page ne montre qu'un cours à la fois,
   choisi dans un <select> : c'est la seule fiche affichée, donc la seule
   imprimée (la barre d'outils est masquée par le @media print de pages.css).

   Source : window.ANTISECHES (js/antiseches-data.js), généré par
   tools/build-index.js à partir des 1358 blocs <figure class="cheat-table">
   déjà écrits dans les leçons. Enregistrement :
     c  dossier du cours (js, pas javascript)   ct titre du cours
     f  fichier de la leçon                     n  numéro de la leçon
     lt titre de la leçon                       t  légende du tableau
     h  en-têtes de colonnes                    r  lignes (tableaux de cellules)
   t, h et r contiennent du balisage en ligne (code, strong, em, kbd, sup, sub)
   assaini à la génération : on l'injecte donc en HTML, comme revision.js le fait
   pour les définitions. Tout ce qui vient d'ailleurs (titres de cours et de
   leçons, noms de fichiers) est échappé.

   Page : pages/antiseches.html. 100 % statique, aucun fetch.
   ============================================================================= */
(function () {
  "use strict";

  var SHEETS = window.ANTISECHES || [];
  var sel = document.getElementById("cheat-course");
  var out = document.getElementById("cheat-sheet");
  var countEl = document.getElementById("cheat-count");
  var printBtn = document.getElementById("cheat-print");
  var searchEl = document.getElementById("cheat-search");
  if (!out) return;

  var KEY = "syntaxe-antiseches"; // dernier cours consulté

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }

  /* Normalisation pour la recherche : minuscule, sans accents. */
  function norm(s) {
    return String(s == null ? "" : s)
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  }
  /* Retire le balisage en ligne (code, strong…) pour ne chercher que le texte. */
  function stripTags(s) {
    return String(s == null ? "" : s).replace(/<[^>]+>/g, " ");
  }
  /* Index de texte par fiche, construit paresseusement à la 1re recherche :
     titre du cours + titre de leçon + légende + en-têtes + toutes les cellules. */
  var indexed = false;
  function ensureIndex() {
    if (indexed) return;
    SHEETS.forEach(function (s) {
      var parts = [s.ct, s.lt, s.t];
      if (s.h) parts = parts.concat(s.h);
      if (s.r) s.r.forEach(function (row) { parts = parts.concat(row); });
      s._txt = norm(stripTags(parts.join(" ")));
    });
    indexed = true;
  }

  if (!SHEETS.length) {
    out.innerHTML = '<p class="cheat-empty">Aucune antisèche disponible.</p>';
    if (sel) sel.innerHTML = "";
    return;
  }

  /* ------------------------------------------------- regroupement par cours */
  var byCourse = {};
  var order = [];
  SHEETS.forEach(function (s) {
    if (!byCourse[s.c]) {
      byCourse[s.c] = { dir: s.c, title: s.ct || s.c, items: [] };
      order.push(byCourse[s.c]);
    }
    byCourse[s.c].items.push(s);
  });
  order.sort(function (a, b) {
    return a.title.localeCompare(b.title, "fr");
  });

  /* --------------------------------------------------------------- rendu -- */
  function renderTable(s) {
    var cols = s.h && s.h.length ? s.h.length : 0;
    var html = '<figure class="cheat-table"><table>';
    html += "<caption>" + (s.t || "") + "</caption>";
    if (cols) {
      html += "<thead><tr>";
      s.h.forEach(function (th) {
        html += '<th scope="col">' + th + "</th>";
      });
      html += "</tr></thead>";
    }
    html += "<tbody>";
    (s.r || []).forEach(function (row) {
      html += "<tr>";
      row.forEach(function (cell, i) {
        /* Une ligne plus courte que l'en-tête vient d'un colspan de la leçon
           d'origine : on rend l'espace manquant à sa dernière cellule. */
        var span = cols && i === row.length - 1 && row.length < cols ? cols - row.length + 1 : 1;
        html += span > 1 ? '<td colspan="' + span + '">' : "<td>";
        html += cell + "</td>";
      });
      html += "</tr>";
    });
    html += "</tbody></table></figure>";
    return html;
  }

  function render(dir) {
    var course = byCourse[dir];
    if (!course) {
      out.innerHTML = '<p class="cheat-empty">Aucune antisèche pour ce cours.</p>';
      if (countEl) countEl.textContent = "";
      return;
    }
    var lecons = {};
    course.items.forEach(function (s) { lecons[s.f] = 1; });
    var nbLecons = Object.keys(lecons).length;

    var html = '<h2 class="cheat__title">' + esc(course.title) + "</h2>";
    html += '<p class="cheat-lead">' + course.items.length + " fiche" + (course.items.length > 1 ? "s" : "") +
      ", tirées de " + nbLecons + " leçon" + (nbLecons > 1 ? "s" : "") +
      ' du cours. <a href="' + esc(course.dir) + '/cours.html">Ouvrir le cours</a></p>';

    course.items.forEach(function (s) {
      var lien = esc(s.c) + "/" + esc(s.f);
      var label = (s.n ? "Leçon " + esc(s.n) : "Leçon") + (s.lt ? " · " + esc(s.lt) : "");
      html += '<section class="cheat-card">';
      html += '<h3><a href="' + lien + '">' + label + "</a></h3>";
      html += renderTable(s);
      html += "</section>";
    });
    out.innerHTML = html;

    if (countEl) {
      countEl.textContent = course.items.length + " fiche" + (course.items.length > 1 ? "s" : "") +
        " · " + SHEETS.length + " au total";
    }
    document.title = "Antisèches — " + course.title + " — Syntaxe";
  }

  /* ---------------------------------------- recherche transversale -------
     Le champ filtre TOUTES les antisèches (tous cours confondus) sur le texte
     normalisé de chaque fiche, et affiche les fiches trouvées groupées par
     cours. Le champ vidé rend la main au cours sélectionné — seul mode
     « une fiche » imprimable. Plafonné pour rester fluide sur un terme fréquent. */
  var CAP = 50;
  function renderSearch(q) {
    ensureIndex();
    var terms = norm(q).split(/\s+/).filter(Boolean);
    var hits = SHEETS.filter(function (s) {
      return terms.every(function (t) {
        return s._txt.indexOf(t) !== -1;
      });
    });

    if (!hits.length) {
      out.innerHTML =
        '<p class="cheat-empty">Aucune antisèche ne correspond à «&nbsp;' +
        esc(q) + '&nbsp;».</p>';
      if (countEl) countEl.textContent = "0 résultat";
      document.title = "Antisèches — recherche — Syntaxe";
      return;
    }

    var shown = hits.slice(0, CAP);
    var groups = {};
    shown.forEach(function (s) {
      (groups[s.c] = groups[s.c] || []).push(s);
    });

    var html = "";
    order.forEach(function (c) {
      var items = groups[c.dir];
      if (!items) return;
      html +=
        '<h2 class="cheat-group__title"><a href="#' + esc(c.dir) + '">' +
        esc(c.title) + "</a> " +
        '<span class="cheat-group__count">' + items.length + " fiche" +
        (items.length > 1 ? "s" : "") + "</span></h2>";
      items.forEach(function (s) {
        var lien = esc(s.c) + "/" + esc(s.f);
        var label =
          (s.n ? "Leçon " + esc(s.n) : "Leçon") + (s.lt ? " · " + esc(s.lt) : "");
        html += '<section class="cheat-card">';
        html += '<h3><a href="' + lien + '">' + label + "</a></h3>";
        html += renderTable(s);
        html += "</section>";
      });
    });
    out.innerHTML = html;

    var nbCourses = Object.keys(groups).length;
    if (countEl) {
      var txt =
        hits.length + " résultat" + (hits.length > 1 ? "s" : "") +
        " dans " + nbCourses + " cours";
      if (hits.length > CAP) txt += " · " + CAP + " affichées";
      countEl.textContent = txt;
    }
    document.title = "Antisèches — recherche — Syntaxe";
  }

  /* ------------------------------------------------- choix du cours ------- */
  function stored() {
    try {
      return localStorage.getItem(KEY) || "";
    } catch (e) {
      return "";
    }
  }
  function remember(dir) {
    try {
      localStorage.setItem(KEY, dir);
    } catch (e) {}
  }

  /* Priorité : ancre (antiseches.html#js, pour un lien depuis un cours),
     puis dernier cours consulté, sinon le premier de la liste. */
  var wanted = decodeURIComponent((location.hash || "").replace(/^#/, ""));
  var start = byCourse[wanted] ? wanted : byCourse[stored()] ? stored() : order[0].dir;

  if (sel) {
    sel.innerHTML = "";
    order.forEach(function (c) {
      var opt = document.createElement("option");
      opt.value = c.dir;
      opt.textContent = c.title + " (" + c.items.length + ")";
      sel.appendChild(opt);
    });
    sel.value = start;
    sel.addEventListener("change", function () {
      if (searchEl) searchEl.value = ""; // changer de cours quitte la recherche
      remember(sel.value);
      render(sel.value);
    });
  }

  window.addEventListener("hashchange", function () {
    var d = decodeURIComponent((location.hash || "").replace(/^#/, ""));
    if (!byCourse[d]) return;
    if (searchEl) searchEl.value = ""; // suivre une ancre quitte la recherche
    if (sel) sel.value = d;
    remember(d);
    render(d);
  });

  /* Recherche : petit debounce pour ne pas reconstruire les tableaux à chaque
     frappe. Sous 2 caractères, on rend la main au cours sélectionné. */
  if (searchEl) {
    var searchTimer = null;
    searchEl.addEventListener("input", function () {
      if (searchTimer) clearTimeout(searchTimer);
      searchTimer = setTimeout(function () {
        var q = searchEl.value.trim();
        if (q.length < 2) {
          render(sel ? sel.value : start);
          return;
        }
        renderSearch(q);
      }, 140);
    });
  }

  if (printBtn) {
    printBtn.addEventListener("click", function () {
      window.print();
    });
  }

  render(start);
})();
