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

  /* Le repli est écrit en JSON par les appelants (« {} », « null ») : on le
     décode une fois pour le passer au helper, qui distingue « absent » de
     « présent mais illisible ». */
  function read(key, fallback) {
    var defaut = null;
    try { defaut = JSON.parse(fallback); } catch (e) {}
    return window.SyntaxeStore.getJSON(key, defaut);
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

  /* État d'achèvement total : toutes les leçons de tous les cours faites. Il
     prime sur toute reprise — on ne propose pas de « reprendre » un site déjà
     terminé (c'était « Reprends… Zig 18/18 »). On constate l'accompli, en
     chiffres, et on oriente vers le bilan. */
  var totalLessons = 0, doneLessons = 0, nbCoursDone = 0;
  Object.keys(DATA.content).forEach(function (id) {
    var lessons = lessonsOf(DATA.content[id]);
    if (!lessons.length) return;
    var done = countDone(id, lessons);
    totalLessons += lessons.length;
    doneLessons += done;
    if (done >= lessons.length) nbCoursDone++;
  });
  if (totalLessons > 0 && doneLessons === totalLessons) {
    var set = function (sel, txt) {
      var el = host.querySelector(sel);
      if (el) el.textContent = txt;
    };
    set("[data-resume-kicker]", "Parcours terminé");
    set("[data-resume-title]", "Tu as terminé les " + nbCoursDone + " cours du site");
    set("[data-resume-meta]", doneLessons + " leçons");
    set("[data-resume-cta]", "Voir mon bilan");
    var lnk = host.querySelector("[data-resume-link]");
    if (lnk) lnk.setAttribute("href", "pages/bilan.html");
    host.hidden = false;
    return;
  }

  var target = null; // { mode, dir, file, title, sub, done, total }

  /* Étape 1 — reprendre la dernière leçon visitée, mais SEULEMENT si ce cours
     est réellement EN COURS : au moins une leçon validée (done > 0) et pas
     terminé (done < total). Sans cette condition, « Reprends où tu t'es arrêté —
     0 / 47 leçons » s'affiche à quelqu'un qui n'a fait qu'ouvrir une leçon : on
     invite à reprendre ce qui n'a jamais commencé. La leçon doit aussi exister
     encore, sinon le bouton le plus visible du site mène à un 404. */
  if (last && last.course && DATA.content[last.course]) {
    var c = DATA.content[last.course];
    var ls = lessonsOf(c);
    var d = countDone(last.course, ls);
    if (ls.some(function (l) { return l.file === last.file; }) && d > 0 && d < ls.length) {
      target = {
        mode: "reprendre",
        dir: c.dir,
        file: last.file,
        title: last.title || c.title,
        sub: c.title,
        done: d,
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
        mode: "reprendre",
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

  /* Étape 3 — INVITATION : rien n'a été validé nulle part, mais une leçon a été
     ouverte. On propose de reprendre cette LECTURE, sans compteur trompeur. On
     exclut le cas où le cours de « last » est déjà terminé : il n'y aurait rien
     à continuer, et l'état « tout terminé » se dit autrement. */
  if (!target && last && last.course && DATA.content[last.course]) {
    var c3 = DATA.content[last.course];
    var ls3 = lessonsOf(c3);
    var d3 = countDone(last.course, ls3);
    if (ls3.some(function (l) { return l.file === last.file; }) && d3 < ls3.length) {
      target = {
        mode: "commencer",
        dir: c3.dir,
        file: last.file,
        title: last.title || c3.title,
        sub: c3.title,
        done: d3,
        total: ls3.length,
      };
    }
  }

  if (!target) return; // aucune progression, aucune leçon ouverte : bloc masqué

  var kickerEl = host.querySelector("[data-resume-kicker]");
  var titleEl = host.querySelector("[data-resume-title]");
  var metaEl = host.querySelector("[data-resume-meta]");
  var linkEl = host.querySelector("[data-resume-link]");
  var ctaEl = host.querySelector("[data-resume-cta]");

  if (titleEl) titleEl.textContent = target.title;

  if (target.mode === "commencer") {
    /* Leçon ouverte mais rien de validé : on ne parle pas de « reprendre où tu
       t'es arrêté », on invite à poursuivre la lecture — sans « 0 / N » qui
       ferait passer une simple exploration pour un échec. */
    if (kickerEl) kickerEl.textContent = "Reprends ta lecture";
    if (metaEl) {
      metaEl.textContent =
        target.sub && target.sub !== target.title ? target.sub : target.total + " leçons";
    }
    if (ctaEl) ctaEl.textContent = "Continuer";
  } else {
    if (kickerEl) kickerEl.textContent = "Reprends où tu t'es arrêté";
    if (metaEl) {
      var compteur = target.done + " / " + target.total + " leçons";
      metaEl.textContent =
        target.sub && target.sub !== target.title ? target.sub + "  ·  " + compteur : compteur;
    }
    if (ctaEl) ctaEl.textContent = "Reprendre";
  }

  if (linkEl) linkEl.setAttribute("href", "pages/" + target.dir + "/" + target.file);

  host.hidden = false;
})();
