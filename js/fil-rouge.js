/* =============================================================================
   fil-rouge.js — Moteur de la page « Fil rouge progressif ». Affiche les étapes
   (groupées par phase) d'un projet unique construit cours après cours, et le
   détail d'une étape : d'où l'on part, ce que le cours ajoute, les critères
   cochables (auto-évaluation) et le livrable. Cases mémorisées en localStorage
   `syntaxe-fil-rouge`. 100 % file://. Données : js/fil-rouge-data.js.
   ============================================================================= */
(function () {
  "use strict";

  var FR = window.FIL_ROUGE;
  var listEl = document.getElementById("fil-rouge-list");
  var mainEl = document.getElementById("fil-rouge-main");
  if (!FR || !FR.etapes || !listEl || !mainEl) return;

  /* Clé propre à CHAQUE fil rouge (sinon les étapes 1..n de deux fils rouges
     se chevaucheraient dans le même store). */
  var KEY = "syntaxe-fil-rouge-" + (FR.id || "default");
  var currentN = null;

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }
  /* Le site coupe déjà les défilements animés en CSS (base.css, media
     prefers-reduced-motion: reduce) ; on respecte la même préférence pour ce
     défilement piloté en JS, que la règle CSS n'atteint pas. */
  function prefersReducedMotion() {
    return !!(
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  }
  function readStore() {
    try {
      return JSON.parse(localStorage.getItem(KEY) || "{}") || {};
    } catch (e) {
      return {};
    }
  }
  function writeStore(s) {
    try {
      localStorage.setItem(KEY, JSON.stringify(s));
    } catch (e) {}
  }
  function byN(n) {
    for (var i = 0; i < FR.etapes.length; i++) {
      if (FR.etapes[i].n === n) return FR.etapes[i];
    }
    return null;
  }
  function checkedCount(e) {
    var s = readStore()[e.n] || {};
    var n = 0;
    for (var i = 0; i < e.criteres.length; i++) {
      if (s[i]) n++;
    }
    return n;
  }
  function etapeDone(e) {
    return e.criteres.length > 0 && checkedCount(e) === e.criteres.length;
  }
  function progressText(n, total) {
    if (total && n === total) return "✅ Étape validée !";
    return n + " / " + total + " critères validés";
  }

  /* En-tête (titre, sous-titre, intro, progression globale) */
  function fillHead() {
    var t = document.querySelector("[data-fr-titre]");
    var st = document.querySelector("[data-fr-soustitre]");
    var intro = document.querySelector("[data-fr-intro]");
    if (t) t.textContent = FR.titre;
    if (st) st.textContent = FR.sousTitre || "";
    if (intro) intro.innerHTML = FR.intro || "";
  }
  function renderGlobal() {
    var done = 0;
    FR.etapes.forEach(function (e) {
      if (etapeDone(e)) done++;
    });
    var el = document.querySelector("[data-fr-progress]");
    if (el) el.innerHTML = "<strong>" + done + " / " + FR.etapes.length + "</strong> étapes terminées";
  }

  /* Liste de gauche (étapes groupées par phase) */
  function renderList() {
    listEl.innerHTML = "";
    var lastPhase = null;
    FR.etapes.forEach(function (e) {
      if (e.phase !== lastPhase) {
        lastPhase = e.phase;
        var h = document.createElement("p");
        h.className = "fr-phase";
        h.textContent = e.phase;
        listEl.appendChild(h);
      }
      var total = e.criteres.length;
      var n = checkedCount(e);
      var logo = (window.courseLogo && window.courseLogo(e.accent)) || "";
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "projet-item fr-item" + (e.n === currentN ? " is-active" : "");
      btn.setAttribute("data-accent", e.accent);
      btn.innerHTML =
        '<span class="etape-num' + (etapeDone(e) ? " is-done" : "") + '">' + e.n + "</span>" +
        '<span class="projet-item__glyph" aria-hidden="true">' +
        (logo || esc((e.courseTitle || "?").slice(0, 2))) +
        "</span>" +
        '<span class="projet-item__body">' +
        '<span class="projet-item__title">' + esc(e.titre) + "</span>" +
        '<span class="projet-item__type">' + esc(e.courseTitle) + "</span>" +
        "</span>" +
        '<span class="projet-item__count' + (total && n === total ? " is-done" : "") + '">' + n + "/" + total + "</span>";
      btn.addEventListener("click", function () {
        select(e.n);
      });
      listEl.appendChild(btn);
    });
  }

  /* Détail d'une étape */
  function renderEtape(e) {
    var s = readStore()[e.n] || {};
    var total = e.criteres.length;
    var n = checkedCount(e);
    var pct = total ? Math.round((n / total) * 100) : 0;
    var logo = (window.courseLogo && window.courseLogo(e.accent)) || "";

    var ajoute = e.ajoute
      .map(function (a) {
        return "<li>" + a + "</li>";
      })
      .join("");
    var checks = e.criteres
      .map(function (c, i) {
        var ck = s[i] ? " checked" : "";
        return (
          '<li><label class="project-check__item">' +
          '<input type="checkbox" data-i="' + i + '"' + ck + " />" +
          "<span>" + c + "</span></label></li>"
        );
      })
      .join("");

    var prev = byN(e.n - 1);
    var next = byN(e.n + 1);
    var nav =
      '<div class="fr-nav">' +
      (prev
        ? '<button type="button" class="btn btn--ghost btn--sm" data-go="' + prev.n + '">← Étape ' + prev.n + "</button>"
        : "<span></span>") +
      (next
        ? '<button type="button" class="btn btn--secondary btn--sm" data-go="' + next.n + '">Étape ' + next.n + " : " + esc(next.titre) + " →</button>"
        : "<span></span>") +
      "</div>";

    mainEl.innerHTML =
      '<div class="project__head" data-accent="' + esc(e.accent) + '">' +
      '<span class="project__glyph" aria-hidden="true">' +
      (logo || esc((e.courseTitle || "?").slice(0, 2))) +
      "</span>" +
      "<div>" +
      '<div class="project__meta">' +
      '<span class="badge">' + esc(e.phase) + " · Étape " + e.n + "/" + FR.etapes.length + "</span>" +
      "</div>" +
      '<h2 class="project__title">' + esc(e.titre) + "</h2>" +
      '<p class="project__course">Cours : <strong>' + esc(e.courseTitle) + "</strong></p>" +
      "</div>" +
      "</div>" +

      '<div class="fr-actions">' +
      '<a class="btn btn--primary btn--sm" href="' + esc(e.dir) + '/lecon-01.html">Commencer la 1<sup>re</sup> leçon →</a>' +
      '<a class="btn btn--ghost btn--sm" href="' + esc(e.dir) + '/cours.html">Voir le programme du cours</a>' +
      "</div>" +

      '<p class="etape-depart" data-accent="' + esc(e.accent) + '"><span aria-hidden="true">◀</span> On part de : <strong>' + esc(e.depart) + "</strong></p>" +

      "<h3>Objectif</h3>" + e.objectif +

      "<h3>Ce que ce cours ajoute au projet</h3>" +
      '<ul class="project-feats">' + ajoute + "</ul>" +

      "<h3>Critères de réussite</h3>" +
      '<div class="project-progress" aria-hidden="true"><span class="project-progress__bar" style="width:' + pct + '%"></span></div>' +
      '<p class="project-progress__label" data-progress-label>' + progressText(n, total) + "</p>" +
      '<ul class="project-check">' + checks + "</ul>" +

      '<p class="project__livrable"><strong>Livrable à la fin de l\'étape :</strong> ' + esc(e.livrable) + "</p>" +

      nav;

    Array.prototype.forEach.call(
      mainEl.querySelectorAll('input[type="checkbox"]'),
      function (input) {
        input.addEventListener("change", function () {
          var st = readStore();
          var pc = st[e.n] || (st[e.n] = {});
          var i = input.getAttribute("data-i");
          if (input.checked) pc[i] = true;
          else delete pc[i];
          writeStore(st);
          updateProgress(e);
          renderList();
          renderGlobal();
        });
      }
    );
    Array.prototype.forEach.call(mainEl.querySelectorAll("[data-go]"), function (b) {
      b.addEventListener("click", function () {
        select(parseInt(b.getAttribute("data-go"), 10));
        if (mainEl.scrollIntoView)
          mainEl.scrollIntoView({
            behavior: prefersReducedMotion() ? "auto" : "smooth",
            block: "start",
          });
      });
    });
  }

  function updateProgress(e) {
    var total = e.criteres.length;
    var n = checkedCount(e);
    var pct = total ? Math.round((n / total) * 100) : 0;
    var bar = mainEl.querySelector(".project-progress__bar");
    var label = mainEl.querySelector("[data-progress-label]");
    if (bar) bar.style.width = pct + "%";
    if (label) label.textContent = progressText(n, total);
  }

  function select(n) {
    var e = byN(n);
    if (!e) return;
    currentN = n;
    renderList();
    renderEtape(e);
  }

  fillHead();
  var initial = parseInt((location.hash || "").replace(/[^0-9]/g, ""), 10);
  currentN = byN(initial) ? initial : FR.etapes[0].n;
  renderList();
  renderEtape(byN(currentN));
  renderGlobal();
})();
