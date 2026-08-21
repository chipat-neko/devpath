/* =============================================================================
   glossaire.js — Glossaire général interactif (R5, Lot 3). Réunit tous les
   termes des 65 glossaires (réutilise js/flashcards-data.js → window.FLASHCARDS)
   avec recherche instantanée (insensible aux accents) et filtre par cours.
   100 % file://. Page : pages/glossaire.html.
   ============================================================================= */
(function () {
  "use strict";

  var CARDS = window.FLASHCARDS || [];
  var searchEl = document.getElementById("gl-search");
  var courseEl = document.getElementById("gl-course");
  var listEl = document.getElementById("gl-list");
  var countEl = document.getElementById("gl-count");
  if (!listEl || !CARDS.length) {
    if (listEl) listEl.innerHTML = '<p class="gl-empty">Glossaire indisponible.</p>';
    return;
  }

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }
  function norm(s) {
    return String(s || "")
      .toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }
  function stripTags(s) {
    return String(s || "").replace(/<[^>]*>/g, "");
  }

  /* Index de recherche pré-calculé (terme + définition normalisés). */
  var ITEMS = CARDS.map(function (c) {
    return {
      c: c.c,
      ct: c.ct,
      t: c.t,
      d: c.d,
      /* V12-D3 : la leçon d'origine, désormais portée par l'index. */
      f: c.f,
      n: c.n,
      lt: c.lt,
      key: norm(c.t) + " " + norm(stripTags(c.d)),
    };
  });
  ITEMS.sort(function (a, b) {
    return a.t.localeCompare(b.t, "fr", { sensitivity: "base" });
  });

  /* Liste des cours présents. */
  (function buildCourseOptions() {
    var seen = {};
    var list = [];
    ITEMS.forEach(function (it) {
      if (!seen[it.c]) {
        seen[it.c] = 1;
        list.push({ id: it.c, title: it.ct });
      }
    });
    list.sort(function (a, b) {
      return a.title.localeCompare(b.title, "fr");
    });
    list.forEach(function (o) {
      var opt = document.createElement("option");
      opt.value = o.id;
      opt.textContent = o.title;
      courseEl.appendChild(opt);
    });
  })();

  function entryHTML(it) {
    return (
      '<div class="gl-entry">' +
      '<dt class="gl-term">' + esc(it.t) + "</dt>" +
      '<dd class="gl-def">' + it.d +
      /* Le terme vient d'une leçon précise : on y renvoie, en gardant le titre
         du cours comme contexte. Repli sur la page du cours si la source n'est
         pas connue (vieille entrée reprise d'un ancien index). */
      ' <a class="gl-src" href="' + esc(it.c) + "/" + esc(it.f || "cours.html") + '">' +
      esc(it.ct) + (it.f && it.f !== "cours.html" && it.n ? " · leçon " + esc(it.n) : "") +
      "</a></dd>" +
      "</div>"
    );
  }

  /* Rendu PROGRESSIF : rendre les 9 700+ entrées d'un bloc coûtait ~50 000 nœuds
     et ~800 ms. On n'affiche qu'un lot, puis on complète au défilement via une
     sentinelle observée. La recherche et le filtre recalculent la liste et
     repartent du premier lot — la recherche interne reste entière. (cf. C10) */
  var PAGE = 200;
  var filtered = [];
  var shown = 0;
  var sentinel = document.createElement("div");
  sentinel.className = "gl-sentinel";
  sentinel.setAttribute("aria-hidden", "true");

  function appendRows() {
    if (shown >= filtered.length) return;
    var frag = filtered.slice(shown, shown + PAGE).map(entryHTML).join("");
    sentinel.insertAdjacentHTML("beforebegin", frag);
    shown = Math.min(shown + PAGE, filtered.length);
    sentinel.hidden = shown >= filtered.length;
  }

  var io = window.IntersectionObserver
    ? new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting) appendRows();
      }, { rootMargin: "600px" })
    : null;

  function render() {
    var q = norm(searchEl.value.trim());
    var cf = courseEl.value;
    filtered = [];
    for (var i = 0; i < ITEMS.length; i++) {
      var it = ITEMS[i];
      if (cf !== "all" && it.c !== cf) continue;
      if (q && it.key.indexOf(q) === -1) continue;
      filtered.push(it);
    }
    if (io) io.unobserve(sentinel);
    listEl.textContent = "";
    shown = 0;
    if (!filtered.length) {
      listEl.innerHTML = '<p class="gl-empty">Aucun terme ne correspond.</p>';
    } else if (io) {
      listEl.appendChild(sentinel);
      appendRows();          // premier lot immédiat
      io.observe(sentinel);  // les suivants au défilement
    } else {
      listEl.innerHTML = filtered.map(entryHTML).join(""); // repli sans IntersectionObserver
      shown = filtered.length;
    }
    countEl.textContent =
      filtered.length + " terme" + (filtered.length > 1 ? "s" : "") + " sur " + ITEMS.length;
  }

  searchEl.addEventListener("input", render);
  courseEl.addEventListener("change", render);
  render();
})();
