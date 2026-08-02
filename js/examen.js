/* =============================================================================
   examen.js — Examen blanc chronométré (P6). Tire N questions au hasard de la
   banque window.QUIZ_BANK (js/quiz-index.js, ~3000 questions extraites des
   blocs data-quiz des leçons), minuteur, score et correction détaillée.
   100 % statique. Page : pages/examen.html.
   ============================================================================= */
(function () {
  "use strict";

  var BANK = window.QUIZ_BANK || [];
  var DATA = window.SITE_DATA;
  var setupEl = document.getElementById("exam-setup");
  var quizEl = document.getElementById("exam-quiz");
  var resultEl = document.getElementById("exam-result");
  if (!setupEl || !quizEl || !resultEl || !BANK.length) return;

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }
  function shuffle(a) {
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i];
      a[i] = a[j];
      a[j] = t;
    }
    return a;
  }
  function fmtTime(s) {
    var m = Math.floor(s / 60),
      ss = s % 60;
    return m + ":" + (ss < 10 ? "0" + ss : ss);
  }

  var COURSE_TITLE = {};
  if (DATA && DATA.content) {
    for (var id in DATA.content) {
      if (DATA.content.hasOwnProperty(id)) COURSE_TITLE[DATA.content[id].dir] = DATA.content[id].title;
    }
  }
  function courseTitle(dir) {
    return COURSE_TITLE[dir] || dir;
  }

  var courses = (function () {
    var seen = {},
      list = [];
    BANK.forEach(function (q) {
      if (!seen[q.c]) {
        seen[q.c] = 1;
        list.push(q.c);
      }
    });
    list.sort(function (a, b) {
      return courseTitle(a).localeCompare(courseTitle(b), "fr");
    });
    return list;
  })();

  var state = null;

  function renderSetup() {
    quizEl.hidden = true;
    resultEl.hidden = true;
    setupEl.hidden = false;
    var opts = '<option value="all">Tous les cours (' + BANK.length + " questions)</option>";
    courses.forEach(function (c) {
      opts += '<option value="' + esc(c) + '">' + esc(courseTitle(c)) + "</option>";
    });
    setupEl.innerHTML =
      '<div class="exam-setup">' +
      '<h2 class="u-mt-0">Réglages</h2>' +
      '<label class="exam-field"><span>Nombre de questions</span>' +
      '<select class="select" id="exam-n"><option>10</option><option selected>20</option><option>30</option></select></label>' +
      '<label class="exam-field"><span>Cours</span><select class="select" id="exam-c">' + opts + "</select></label>" +
      '<p class="exam-hint">Tu as <strong>30 secondes par question</strong> ; le minuteur s\'arrête tout seul. Bonne chance&nbsp;!</p>' +
      '<button type="button" class="btn btn--primary btn--lg" id="exam-start">Commencer l\'examen</button>' +
      "</div>";
    document.getElementById("exam-start").addEventListener("click", start);
  }

  function prepare(q) {
    var opts = q.a.map(function (t, i) {
      return { t: t, correct: i === q.k };
    });
    shuffle(opts);
    return { q: q.q, e: q.e, c: q.c, opts: opts };
  }

  function start() {
    var n = parseInt(document.getElementById("exam-n").value, 10) || 20;
    var c = document.getElementById("exam-c").value;
    var pool = c === "all" ? BANK.slice() : BANK.filter(function (q) {
      return q.c === c;
    });
    shuffle(pool);
    var picked = pool.slice(0, Math.min(n, pool.length));
    state = {
      questions: picked.map(prepare),
      idx: 0,
      answers: picked.map(function () {
        return -1;
      }),
      timeLeft: picked.length * 30,
      timer: null,
    };
    setupEl.hidden = true;
    resultEl.hidden = true;
    quizEl.hidden = false;
    state.timer = window.setInterval(tick, 1000);
    renderQuestion();
  }

  function tick() {
    state.timeLeft--;
    var t = document.getElementById("exam-timer");
    if (t) t.textContent = fmtTime(Math.max(0, state.timeLeft));
    if (state.timeLeft <= 0) finish();
  }

  function renderQuestion() {
    var i = state.idx,
      q = state.questions[i];
    var optsHtml = q.opts
      .map(function (o, j) {
        return (
          '<button type="button" class="exam-opt' + (state.answers[i] === j ? " is-selected" : "") +
          '" data-j="' + j + '">' + esc(o.t) + "</button>"
        );
      })
      .join("");
    quizEl.innerHTML =
      '<div class="exam-top">' +
      '<span class="exam-timer" id="exam-timer">' + fmtTime(Math.max(0, state.timeLeft)) + "</span>" +
      '<span class="exam-count">Question ' + (i + 1) + " / " + state.questions.length + "</span></div>" +
      '<div class="exam-progress"><div class="exam-progress__bar" style="width:' +
      (i / state.questions.length) * 100 + '%"></div></div>' +
      '<p class="exam-course">' + esc(courseTitle(q.c)) + "</p>" +
      '<h2 class="exam-q">' + esc(q.q) + "</h2>" +
      '<div class="exam-opts">' + optsHtml + "</div>" +
      '<div class="exam-nav">' +
      (i > 0 ? '<button type="button" class="btn btn--ghost" id="exam-prev">← Précédent</button>' : "<span></span>") +
      (i < state.questions.length - 1
        ? '<button type="button" class="btn btn--secondary" id="exam-next">Suivant →</button>'
        : '<button type="button" class="btn btn--primary" id="exam-finish">Terminer</button>') +
      "</div>";

    quizEl.querySelectorAll(".exam-opt").forEach(function (b) {
      b.addEventListener("click", function () {
        state.answers[i] = parseInt(b.getAttribute("data-j"), 10);
        renderQuestion();
      });
    });
    var prev = document.getElementById("exam-prev");
    if (prev) prev.addEventListener("click", function () {
      state.idx--;
      renderQuestion();
    });
    var next = document.getElementById("exam-next");
    if (next) next.addEventListener("click", function () {
      state.idx++;
      renderQuestion();
    });
    var fin = document.getElementById("exam-finish");
    if (fin) fin.addEventListener("click", finish);
  }

  function scoreMsg(pct) {
    if (pct >= 90) return "Excellent !";
    if (pct >= 70) return "Très bien.";
    if (pct >= 50) return "Pas mal, continue.";
    return "À retravailler — courage !";
  }

  function finish() {
    if (state.timer) {
      window.clearInterval(state.timer);
      state.timer = null;
    }
    var score = 0;
    state.questions.forEach(function (q, i) {
      var a = state.answers[i];
      if (a >= 0 && q.opts[a] && q.opts[a].correct) score++;
    });
    var n = state.questions.length;
    var pct = n ? Math.round((score / n) * 100) : 0;

    var details = state.questions
      .map(function (q, i) {
        var a = state.answers[i];
        var ok = a >= 0 && q.opts[a] && q.opts[a].correct;
        var good = q.opts.filter(function (o) {
          return o.correct;
        })[0];
        return (
          '<li class="exam-rev ' + (ok ? "ok" : "ko") + '">' +
          '<span class="exam-rev__icon" aria-hidden="true">' + (ok ? "✓" : "✗") + "</span>" +
          '<div class="exam-rev__body">' +
          '<p class="exam-rev__q">' + esc(q.q) + "</p>" +
          (ok ? "" : '<p class="exam-rev__given">Ta réponse : ' + esc(a >= 0 ? q.opts[a].t : "(aucune)") + "</p>") +
          '<p class="exam-rev__good">Bonne réponse : ' + esc(good ? good.t : "?") + "</p>" +
          (q.e ? '<p class="exam-rev__exp">' + esc(q.e) + "</p>" : "") +
          "</div></li>"
        );
      })
      .join("");

    quizEl.hidden = true;
    resultEl.hidden = false;
    resultEl.innerHTML =
      '<div class="exam-score">' +
      '<span class="exam-score__n">' + score + " / " + n + "</span>" +
      '<span class="exam-score__pct">' + pct + "%</span>" +
      '<span class="exam-score__msg">' + scoreMsg(pct) + "</span></div>" +
      '<button type="button" class="btn btn--primary" id="exam-again">Refaire un examen</button>' +
      "<h2>Correction</h2>" +
      '<ul class="exam-revs">' + details + "</ul>";
    document.getElementById("exam-again").addEventListener("click", renderSetup);
    window.scrollTo(0, 0);
  }

  renderSetup();
})();
