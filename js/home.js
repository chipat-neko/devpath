/* =============================================================================
   home.js — Bloc « Reprendre où j'en étais » sur la page d'accueil.
   S'affiche seulement si une progression locale existe (localStorage). Aucun fetch.
   Cible : la dernière leçon visitée (`syntaxe-last`) sinon le cours commencé le
   plus avancé (1re leçon non faite). Se charge après data.js (defer, dans l'ordre).
   ============================================================================= */
(function () {
  "use strict";

  var DATA = window.SITE_DATA;
  if (!DATA || !DATA.content) return;

  /* ---- Section « Quelques cours » : cartes générées depuis SITE_DATA ------
     Les chiffres (leçons, heures) et titres proviennent des données, jamais
     recopiés à la main : ils ne peuvent plus dériver. Même markup que le
     catalogue (js/catalogue.js). La sélection vedette est dans l'attribut
     data-home-featured="id1,id2,…" du conteneur. */
  function escHome(s) {
    return String(s == null ? "" : s).replace(/[&<>"]/g, function (ch) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[ch];
    });
  }
  function featuredCard(c) {
    var STATUS_LABEL = { complet: "Complet", apercu: "Aperçu", bientot: "Bientôt" };
    var LEVELS = DATA.LEVELS || {};
    var clickable = c.status !== "bientot" && c.dir;
    var href = "pages/" + c.dir + "/cours.html";
    var titleInner = clickable
      ? '<a href="' + escHome(href) + '">' + escHome(c.title) + "</a>"
      : escHome(c.title);
    var lv = c.levels && c.levels.length ? c.levels : c.level ? [c.level] : [];
    var levelHTML =
      '<span class="pill pill--' + escHome(c.level) + '">' +
      escHome(LEVELS[c.level] || c.level) + "</span>";
    if (lv.length > 1) {
      var range = lv.map(function (k) { return LEVELS[k] || k; }).join(" → ");
      levelHTML +=
        '<span class="pill pill--niveaux" title="' + escHome(range) + '">' +
        lv.length + " niveaux</span>";
    }
    var glyph = (window.courseLogo && window.courseLogo(c.id)) || escHome(c.glyph);
    return (
      '<article class="course-card course-card--' + c.status +
      '" data-accent="' + escHome(c.id) + '">' +
      '<div class="course-card__top">' +
      '<span class="course-card__glyph" aria-hidden="true">' + glyph + "</span>" +
      '<span class="badge badge--' + c.status + '">' +
      (STATUS_LABEL[c.status] || c.status) + "</span>" +
      "</div>" +
      '<h3 class="course-card__title">' + titleInner + "</h3>" +
      '<p class="course-card__desc">' + escHome(c.tagline) + "</p>" +
      '<div class="course-card__foot">' + levelHTML +
      '<span class="dot-sep">' + c.lessons + " leçons</span>" +
      '<span class="dot-sep">~' + c.hours + " h</span>" +
      "</div></article>"
    );
  }
  function renderFeatured() {
    var grids = document.querySelectorAll("[data-home-featured]");
    if (!grids.length || !DATA.courses) return;
    var byId = {};
    DATA.courses.forEach(function (c) { byId[c.id] = c; });
    Array.prototype.forEach.call(grids, function (grid) {
      var ids = (grid.getAttribute("data-home-featured") || "")
        .split(",").map(function (s) { return s.trim(); }).filter(Boolean);
      grid.innerHTML = ids
        .map(function (id) { return byId[id] ? featuredCard(byId[id]) : ""; })
        .join("");
    });
  }
  renderFeatured();

  /* ---- Bloc « Reprendre où j'en étais » -------------------------------- */
  var host = document.querySelector("[data-home-resume]");
  if (!host) return;

  function read(key, fallback) {
    try {
      return JSON.parse(localStorage.getItem(key) || fallback);
    } catch (e) {
      return JSON.parse(fallback);
    }
  }

  var prog = read("syntaxe-progress", "{}") || {};
  var last = read("syntaxe-last", "null");

  function lessonsOf(c) {
    var arr = [];
    c.modules.forEach(function (m) {
      m.lessons.forEach(function (l) {
        arr.push(l);
      });
    });
    return arr;
  }
  function countDone(id, lessons) {
    var p = prog[id] || {};
    var n = 0;
    lessons.forEach(function (l) {
      if (p[l.file]) n++;
    });
    return n;
  }

  var target = null; // { dir, file, title, sub, done, total }

  /* Étape 1 — dernière leçon visitée, SI elle existe encore dans le cours : une
     sauvegarde ancienne ou une leçon renumérotée mènerait sinon à un 404 sur le
     bouton le plus visible du site. Sinon on retombe sur l'étape 2. */
  if (last && last.course && DATA.content[last.course]) {
    var c = DATA.content[last.course];
    var ls = lessonsOf(c);
    if (ls.some(function (l) { return l.file === last.file; })) {
      target = {
        dir: c.dir,
        file: last.file,
        title: last.title || c.title,
        sub: c.title,
        done: countDone(last.course, ls),
        total: ls.length,
      };
    }
  }

  if (!target) {
    /* Étape 2 — cours commencé le plus avancé, mais pas terminé */
    var best = null;
    Object.keys(DATA.content).forEach(function (id) {
      var co = DATA.content[id];
      var lessons = lessonsOf(co);
      var done = countDone(id, lessons);
      if (done <= 0 || done >= lessons.length) return;
      var ratio = done / lessons.length;
      if (best && ratio <= best.ratio) return;
      var firstUndone = null;
      var p = prog[id] || {};
      lessons.forEach(function (l) {
        if (!firstUndone && !p[l.file]) firstUndone = l.file;
      });
      best = {
        ratio: ratio,
        dir: co.dir,
        file: firstUndone || lessons[0].file,
        title: co.title,
        sub: co.title,
        done: done,
        total: lessons.length,
      };
    });
    target = best;
  }

  if (!target) return; // aucune progression : le bloc reste masqué

  var titleEl = host.querySelector("[data-resume-title]");
  var metaEl = host.querySelector("[data-resume-meta]");
  var linkEl = host.querySelector("[data-resume-link]");

  if (titleEl) titleEl.textContent = target.title;
  if (metaEl) {
    var lessons = target.done + " / " + target.total + " leçons";
    metaEl.textContent =
      target.sub && target.sub !== target.title ? target.sub + "  ·  " + lessons : lessons;
  }
  if (linkEl) linkEl.setAttribute("href", "pages/" + target.dir + "/" + target.file);

  host.hidden = false;
})();
