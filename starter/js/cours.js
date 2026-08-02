/* =============================================================================
   cours.js — Page de présentation d'un cours.
   Rend, depuis data.js : les statistiques, la progression et l'accordéon des
   modules/leçons. L'intro rédactionnelle reste dans le HTML de chaque page.
   La page déclare : <body data-course="javascript">
   ============================================================================= */
(function () {
  "use strict";

  var DATA = window.SITE_DATA;
  if (!DATA) return;

  var courseId = document.body.getAttribute("data-course");
  var course = DATA.content && DATA.content[courseId];
  if (!course) return;

  function esc(s) {
    return (s || "").replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }

  var meta = null;
  for (var i = 0; i < DATA.courses.length; i++) {
    if (DATA.courses[i].id === courseId) {
      meta = DATA.courses[i];
      break;
    }
  }

  // Liste à plat des leçons
  var flat = [];
  course.modules.forEach(function (m) {
    m.lessons.forEach(function (l) {
      flat.push(l);
    });
  });

  var CHEVRON =
    '<svg class="module__chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M6 9l6 6 6-6" /></svg>';

  /* ---- Statistiques ---------------------------------------------------- */
  function renderStats() {
    var host = document.querySelector("[data-course-stats]");
    if (!host || !meta) return;
    var levelLabel = DATA.LEVELS[meta.level] || meta.level;
    host.innerHTML =
      stat(course.modules.length, "Modules") +
      stat(flat.length, "Leçons") +
      stat("~" + meta.hours + " h", "Durée") +
      stat(levelLabel, "Niveau");
  }
  function stat(n, l) {
    return (
      '<div class="start-card__stat"><span class="n">' +
      n +
      '</span><span class="l">' +
      l +
      "</span></div>"
    );
  }

  /* ---- Progression (localStorage, partagée avec lecon.js) -------------- */
  function renderProgress() {
    var host = document.querySelector("[data-course-progress]");
    if (!host) return;
    var done = 0;
    try {
      var p = JSON.parse(localStorage.getItem("syntaxe-progress") || "{}");
      if (p[courseId]) {
        flat.forEach(function (l) {
          if (p[courseId][l.file]) done++;
        });
      }
    } catch (e) {}
    var pct = flat.length ? Math.round((done / flat.length) * 100) : 0;
    host.innerHTML =
      '<div class="progress__head"><span class="progress__label">Ta progression</span>' +
      '<span class="progress__value">' +
      done +
      " / " +
      flat.length +
      "</span></div>" +
      '<div class="progress__track"><div class="progress__bar"></div></div>';
    var bar = host.querySelector(".progress__bar");
    if (bar) bar.style.width = pct + "%";
  }

  /* ---- Récap des scores de QCM (localStorage 'syntaxe-quiz') ----------- */
  function renderQuizSummary() {
    var host = document.querySelector("[data-course-progress]");
    if (!host) return;
    var scores = {};
    try {
      scores = JSON.parse(localStorage.getItem("syntaxe-quiz") || "{}") || {};
    } catch (e) {}
    var cs = scores[courseId];
    if (!cs) return;

    var quizDone = 0;
    flat.forEach(function (l) {
      if (cs[l.file] && cs[l.file].quiz) quizDone++;
    });
    var lastFile = flat.length ? flat[flat.length - 1].file : null;
    var bilan = lastFile && cs[lastFile] ? cs[lastFile].bilan : null;
    if (!quizDone && !bilan) return;

    var parts = [];
    if (quizDone) parts.push("QCM de leçon complétés : " + quizDone);
    if (bilan) parts.push("🏆 QCM bilan : " + bilan.best + " / " + bilan.total);

    var p = document.createElement("p");
    p.className = "course-quiz-summary";
    p.textContent = parts.join("  ·  ");
    host.appendChild(p);
  }

  /* ---- Bouton « réinitialiser ma progression » (ce cours) ------------- */
  function renderResetButton() {
    var host = document.querySelector("[data-course-progress]");
    if (!host) return;
    var hasProgress = false;
    try {
      var p = JSON.parse(localStorage.getItem("syntaxe-progress") || "{}");
      var q = JSON.parse(localStorage.getItem("syntaxe-quiz") || "{}");
      hasProgress = !!(p[courseId] || q[courseId]);
    } catch (e) {}
    if (!hasProgress) return; // rien à réinitialiser

    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "course-reset";
    btn.textContent = "Réinitialiser ma progression";
    btn.addEventListener("click", function () {
      if (
        !window.confirm(
          "Effacer ta progression et tes scores de QCM pour ce cours ?"
        )
      )
        return;
      try {
        var prog = JSON.parse(localStorage.getItem("syntaxe-progress") || "{}");
        delete prog[courseId];
        localStorage.setItem("syntaxe-progress", JSON.stringify(prog));
        var sc = JSON.parse(localStorage.getItem("syntaxe-quiz") || "{}");
        delete sc[courseId];
        localStorage.setItem("syntaxe-quiz", JSON.stringify(sc));
      } catch (e) {}
      location.reload();
    });
    host.appendChild(btn);
  }

  /* ---- Badge de fin de cours (diplôme) -------------------------------- */
  /* « Cours terminé » dès que toutes les leçons sont complétées ; « Cours
     maîtrisé » si, en plus, le QCM bilan est réussi (≥ 70 %). */
  function renderCompletionBadge() {
    var card = document.querySelector(".start-card");
    if (!card || !flat.length) return;

    var done = 0;
    try {
      var p = JSON.parse(localStorage.getItem("syntaxe-progress") || "{}");
      if (p[courseId]) {
        flat.forEach(function (l) {
          if (p[courseId][l.file]) done++;
        });
      }
    } catch (e) {}
    if (done < flat.length) return; // cours pas encore terminé

    var mastered = false;
    var bilanTxt = "";
    try {
      var q = JSON.parse(localStorage.getItem("syntaxe-quiz") || "{}");
      var cs = q[courseId];
      var lastFile = flat[flat.length - 1].file;
      var bilan = cs && cs[lastFile] ? cs[lastFile].bilan : null;
      if (bilan && bilan.total && bilan.best / bilan.total >= 0.7) {
        mastered = true;
        bilanTxt = bilan.best + " / " + bilan.total;
      }
    } catch (e) {}

    var el = document.createElement("div");
    el.className = "course-done" + (mastered ? " course-done--master" : "");
    el.innerHTML =
      '<svg class="course-done__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M22 10 12 5 2 10l10 5 10-5Z" /><path d="M6 12v5c0 1.2 2.7 3 6 3s6-1.8 6-3v-5" /></svg>' +
      '<span class="course-done__text">' +
      (mastered ? "Cours maîtrisé" : "Cours terminé") +
      (mastered
        ? ' <span class="course-done__score">QCM bilan&nbsp;: ' + esc(bilanTxt) + "</span>"
        : "") +
      "</span>";
    card.insertBefore(el, card.firstChild);
  }

  /* ---- Accordéon des modules ------------------------------------------ */
  function renderModules() {
    var host = document.querySelector("[data-course-modules]");
    if (!host) return;

    var durs = (DATA.durations && DATA.durations[courseId]) || {};
    var html = "";
    course.modules.forEach(function (m, idx) {
      var open = idx === 0 ? " open" : "";
      html += '<details class="module"' + open + ">";
      html +=
        "<summary>" +
        '<span class="module__num">' +
        m.num +
        "</span>" +
        '<span class="module__head-text">' +
        '<span class="module__title">' +
        m.title +
        "</span>" +
        '<span class="module__sub">' +
        m.sub +
        "</span>" +
        "</span>" +
        CHEVRON +
        "</summary>";
      html += '<ul class="module__lessons">';
      m.lessons.forEach(function (l) {
        var soon = l.status === "bientot" || l.file === "#";
        if (soon) {
          html +=
            '<li class="module__lesson module__lesson--soon">' +
            '<span class="n">' +
            l.num +
            "</span>" +
            "<span>" +
            l.title +
            "</span>" +
            '<span class="status">Bientôt</span>' +
            "</li>";
        } else {
          var d = durs[l.file];
          html +=
            '<li class="module__lesson">' +
            '<span class="n">' +
            l.num +
            "</span>" +
            '<a href="' +
            l.file +
            '">' +
            l.title +
            "</a>" +
            (d ? '<span class="lesson-dur">~' + d + " min</span>" : "") +
            '<span class="status">' +
            (l.status === "apercu" ? "Aperçu" : "Lire") +
            "</span>" +
            "</li>";
        }
      });
      html += "</ul></details>";
    });
    host.innerHTML = html;
  }

  /* ---- Cours liés (liens annexes inter-cours) -------------------------- */
  function renderRelated() {
    if (!course.related || !course.related.length) return;
    var main = document.querySelector(".course-layout > div");
    if (!main) return;

    var cards = "";
    course.related.forEach(function (r) {
      var rc = DATA.content[r.course];
      if (!rc) return; // on ne lie que vers des cours ayant une page
      cards +=
        '<a class="related-card" data-accent="' + rc.id + '" href="../' + rc.dir + '/cours.html">' +
        '<span class="related-card__glyph" aria-hidden="true">' + ((window.courseLogo && window.courseLogo(rc.id)) || esc(rc.glyph)) + "</span>" +
        '<span class="related-card__body">' +
        '<span class="related-card__title">' + esc(rc.title) + "</span>" +
        '<span class="related-card__note">' + esc(r.note) + "</span>" +
        "</span>" +
        '<svg class="icon related-card__arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>' +
        "</a>";
    });
    if (!cards) return;

    var section = document.createElement("section");
    section.className = "related-section";
    section.innerHTML =
      '<p class="kicker">Cours liés</p>' +
      '<h2 class="u-mt-0">À combiner avec ce cours</h2>' +
      '<p>Ces cours se complètent : suis-les ensemble pour une vision complète.</p>' +
      '<div class="related-grid">' + cards + "</div>";
    main.appendChild(section);
  }

  /* ---- Lien « version imprimable du cours » (PDF) --------------------- */
  function renderPrintLink() {
    var card = document.querySelector(".start-card");
    if (!card || !course.dir) return;
    var a = document.createElement("a");
    a.className = "start-card__print";
    a.href = "../imprimer.html?cours=" + encodeURIComponent(course.dir);
    a.innerHTML =
      '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2M6 14h12v8H6z" /></svg>' +
      "Version imprimable du cours (PDF)";
    card.appendChild(a);
  }

  renderStats();
  renderProgress();
  renderQuizSummary();
  renderResetButton();
  renderCompletionBadge();
  renderPrintLink();
  renderModules();
  renderRelated();
})();
