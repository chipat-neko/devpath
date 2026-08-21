/* =============================================================================
   projets.js — Moteur de la page « Projets à réaliser ». Affiche la liste des
   briefs (un par cours) et le détail du projet sélectionné : contexte, cahier
   des charges et CRITÈRES DE RÉUSSITE cochables (auto-évaluation). Les cases
   cochées sont mémorisées en localStorage `syntaxe-projets`. 100 % file://.
   Données : js/projets-data.js · Page : pages/projets.html.
   ============================================================================= */
(function () {
  "use strict";

  var PROJETS = window.PROJETS || [];
  var listEl = document.getElementById("projets-list");
  var mainEl = document.getElementById("projets-main");
  if (!listEl || !mainEl || !PROJETS.length) return;

  var KEY = "syntaxe-projets";
  var currentId = null;

  /* Identifiants renommés le 2026-07-27, après la fusion des cours « -avance » :
     le fragment ne correspondait plus à aucun cours. Cette table conserve la
     compatibilité ascendante — ni la progression déjà enregistrée ni les anciens
     liens (ex. projets.html#python-avance-logs) ne sont perdus. */
  var ANCIENS_IDS = {
    "python-avance-logs": "python-logs",
    "html-avance-composants": "html-composants",
    "css-avance-carte": "css-carte",
    "js-avance-biblio": "js-biblio"
  };
  function idActuel(id) {
    return Object.prototype.hasOwnProperty.call(ANCIENS_IDS, id) ? ANCIENS_IDS[id] : id;
  }

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }
  function readStore() {
    return window.SyntaxeStore.getJSON(KEY, {});
  }
  function writeStore(s) {
    window.SyntaxeStore.setJSON(KEY, s);
  }
  function byId(id) {
    for (var i = 0; i < PROJETS.length; i++) {
      if (PROJETS[i].id === id) return PROJETS[i];
    }
    return null;
  }
  /* Premier projet rattaché à un cours (par son id). Sert aux liens venus des
     pages de cours, qui ignorent l'id du projet et ne connaissent que le cours.
     Quatre cours ont deux projets (html, css, javascript, python) : on prend
     le premier déclaré, qui est le projet de base du cours. */
  function firstIdByCourse(course) {
    for (var i = 0; i < PROJETS.length; i++) {
      if (PROJETS[i].course === course) return PROJETS[i].id;
    }
    return "";
  }
  function checkedCount(p) {
    var s = readStore()[p.id] || {};
    var n = 0;
    for (var i = 0; i < p.criteres.length; i++) {
      if (s[i]) n++;
    }
    return n;
  }
  function niveauClass(n) {
    if (/avanc/i.test(n)) return "pill--avance";
    if (/interm/i.test(n)) return "pill--intermediaire";
    return "pill--debutant";
  }

  /* --- Liste de gauche (un bouton par projet) --- */
  function renderList() {
    listEl.innerHTML = "";
    var head = document.createElement("p");
    head.className = "projets-list__head";
    head.textContent = PROJETS.length + (PROJETS.length > 1 ? " projets" : " projet");
    listEl.appendChild(head);

    PROJETS.forEach(function (p) {
      var total = p.criteres.length;
      var n = checkedCount(p);
      var logo = (window.courseLogo && window.courseLogo(p.accent)) || "";
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "projet-item" + (p.id === currentId ? " is-active" : "");
      btn.setAttribute("data-accent", p.accent);
      btn.innerHTML =
        '<span class="projet-item__glyph" aria-hidden="true">' +
        (logo || esc((p.courseTitle || "?").slice(0, 2))) +
        "</span>" +
        '<span class="projet-item__body">' +
        '<span class="projet-item__title">' + esc(p.titre) + "</span>" +
        '<span class="projet-item__type">' + esc(p.type) + "</span>" +
        "</span>" +
        '<span class="projet-item__count' + (total && n === total ? " is-done" : "") + '">' +
        n + "/" + total +
        "</span>";
      btn.addEventListener("click", function () {
        select(p.id);
      });
      listEl.appendChild(btn);
    });
  }

  /* --- Détail (brief complet) --- */
  function renderBrief(p) {
    var s = readStore()[p.id] || {};
    var total = p.criteres.length;
    var n = checkedCount(p);
    var pct = total ? Math.round((n / total) * 100) : 0;

    var feats = p.fonctionnalites
      .map(function (f) {
        return "<li>" + f + "</li>";
      })
      .join("");

    var checks = p.criteres
      .map(function (c, i) {
        var ck = s[i] ? " checked" : "";
        return (
          '<li><label class="project-check__item">' +
          '<input type="checkbox" data-i="' + i + '"' + ck + " />" +
          "<span>" + c + "</span></label></li>"
        );
      })
      .join("");

    var logo = (window.courseLogo && window.courseLogo(p.accent)) || "";

    mainEl.innerHTML =
      '<div class="project__head" data-accent="' + esc(p.accent) + '">' +
      '<span class="project__glyph" aria-hidden="true">' +
      (logo || esc((p.courseTitle || "?").slice(0, 2))) +
      "</span>" +
      "<div>" +
      '<div class="project__meta">' +
      '<span class="badge">' + esc(p.type) + "</span>" +
      '<span class="pill ' + niveauClass(p.niveau) + '">' + esc(p.niveau) + "</span>" +
      "</div>" +
      '<h2 class="project__title">' + esc(p.titre) + "</h2>" +
      '<p class="project__course">Cours : <a href="' + esc(p.dir) + '/cours.html">' + esc(p.courseTitle) + "</a></p>" +
      "</div>" +
      "</div>" +

      '<div class="callout callout--note">' +
      '<svg class="callout__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M12 8h.01M11 12h1v4h1" /></svg>' +
      '<div class="callout__body"><p class="callout__title">Le contexte</p>' + p.contexte + "</div>" +
      "</div>" +

      "<h3>Objectif</h3>" + p.objectif +
      '<p class="project__livrable"><strong>Ton livrable :</strong> ' + esc(p.livrable) + "</p>" +

      "<h3>Fonctionnalités attendues</h3>" +
      '<ul class="project-feats">' + feats + "</ul>" +

      "<h3>Critères de réussite</h3>" +
      '<div class="project-progress" aria-hidden="true"><span class="project-progress__bar" style="width:' + pct + '%"></span></div>' +
      '<p class="project-progress__label" data-progress-label>' + progressText(n, total) + "</p>" +
      '<ul class="project-check">' + checks + "</ul>" +

      '<details class="project-pistes"><summary>Besoin d’un coup de pouce ? Voir les pistes</summary>' +
      '<div class="project-pistes__body">' + p.pistes + "</div></details>";

    // Écoute des cases à cocher
    Array.prototype.forEach.call(
      mainEl.querySelectorAll('input[type="checkbox"]'),
      function (input) {
        input.addEventListener("change", function () {
          var st = readStore();
          var pc = st[p.id] || (st[p.id] = {});
          var i = input.getAttribute("data-i");
          if (input.checked) pc[i] = true;
          else delete pc[i];
          writeStore(st);
          updateProgress(p);
          renderList();
        });
      }
    );
  }

  function progressText(n, total) {
    if (total && n === total) return "🎉 Bravo : tous les critères sont validés !";
    return n + " / " + total + " critères validés";
  }

  function updateProgress(p) {
    var total = p.criteres.length;
    var n = checkedCount(p);
    var pct = total ? Math.round((n / total) * 100) : 0;
    var bar = mainEl.querySelector(".project-progress__bar");
    var label = mainEl.querySelector("[data-progress-label]");
    if (bar) bar.style.width = pct + "%";
    if (label) label.textContent = progressText(n, total);
  }

  function select(id) {
    var p = byId(id);
    if (!p) return;
    currentId = id;
    renderList();
    renderBrief(p);
  }

  /* Reprise de la progression enregistrée sous les anciens identifiants. Sans
     écrasement : si l'utilisateur a déjà avancé sur le nouvel id, on le garde. */
  (function migrerStore() {
    var s = readStore();
    var change = false;
    for (var vieux in ANCIENS_IDS) {
      if (!Object.prototype.hasOwnProperty.call(s, vieux)) continue;
      var neuf = ANCIENS_IDS[vieux];
      if (!s[neuf]) s[neuf] = s[vieux];
      delete s[vieux];
      change = true;
    }
    if (change) writeStore(s);
  })();

  /* Sélection initiale : ancre #id si valide (les anciennes ancres restent
     acceptées et sont traduites) ; ancre #course=<id> venue d'une page de cours
     (sélectionne le premier projet du cours) ; sinon premier projet. */
  var rawHash = location.hash ? location.hash.slice(1) : "";
  var initial =
    rawHash.indexOf("course=") === 0
      ? firstIdByCourse(rawHash.slice(7))
      : idActuel(rawHash);
  currentId = byId(initial) ? initial : PROJETS[0].id;
  renderList();
  renderBrief(byId(currentId));
})();
