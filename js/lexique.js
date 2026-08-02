/* =============================================================================
   lexique.js — Lexique anglais de la programmation (T8, Lot 5). Liste cherchable
   (window.LEXIQUE) + quiz de traduction EN→FR. 100 % file://.
   Page : pages/lexique.html.
   ============================================================================= */
(function () {
  "use strict";

  var DATA = window.LEXIQUE || [];
  var tabsEl = document.getElementById("lx-tabs");
  var listEl = document.getElementById("lx-list");
  var quizEl = document.getElementById("lx-quiz");
  var searchEl = document.getElementById("lx-search");
  var entriesEl = document.getElementById("lx-entries");
  var countEl = document.getElementById("lx-count");
  if (!entriesEl || !DATA.length) return;

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }
  function norm(s) {
    return String(s || "")
      .toLowerCase()
      .replace(/[àâä]/g, "a")
      .replace(/[éèêë]/g, "e")
      .replace(/[îï]/g, "i")
      .replace(/[ôö]/g, "o")
      .replace(/[ûüù]/g, "u")
      .replace(/ç/g, "c");
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

  /* ----------------------------------------------------------- Lexique */
  function renderList() {
    var q = norm(searchEl ? searchEl.value.trim() : "");
    var rows = DATA.filter(function (d) {
      return !q || norm(d.en + " " + d.fr).indexOf(q) !== -1;
    });
    entriesEl.innerHTML = rows
      .map(function (d) {
        return (
          '<div class="lx-entry">' +
          '<dt class="lx-en">' + esc(d.en) + "</dt>" +
          '<dd class="lx-fr">' + esc(d.fr) + (d.ex ? '<span class="lx-ex">' + esc(d.ex) + "</span>" : "") + "</dd>" +
          "</div>"
        );
      })
      .join("");
    if (countEl) countEl.textContent = rows.length + " terme" + (rows.length > 1 ? "s" : "") + " sur " + DATA.length;
  }

  /* -------------------------------------------------------------- Quiz */
  var order, idx, score, answered;
  var QN = 10;

  function startQuiz() {
    order = shuffle(DATA.slice()).slice(0, Math.min(QN, DATA.length));
    idx = 0;
    score = 0;
    renderQuestion();
  }
  function renderQuestion() {
    answered = false;
    var item = order[idx];
    var others = DATA.filter(function (d) {
      return d.fr !== item.fr;
    });
    shuffle(others);
    var opts = [{ t: item.fr, ok: true }];
    for (var i = 0; i < 3 && i < others.length; i++) opts.push({ t: others[i].fr, ok: false });
    shuffle(opts);
    var optsHtml = opts
      .map(function (o, j) {
        return '<button type="button" class="lx-opt" data-j="' + j + '">' + esc(o.t) + "</button>";
      })
      .join("");
    quizEl.innerHTML =
      '<div class="lx-qtop"><span class="lx-qnum">' + (idx + 1) + " / " + order.length + "</span>" +
      '<span class="lx-qscore">' + score + " pt" + (score > 1 ? "s" : "") + "</span></div>" +
      '<p class="lx-qword">Que veut dire <strong>« ' + esc(item.en) + ' »</strong> ?</p>' +
      '<div class="lx-opts">' + optsHtml + "</div>" +
      '<div class="lx-fb" id="lx-fb"></div>';
    quizEl._opts = opts;
    quizEl.querySelectorAll(".lx-opt").forEach(function (b) {
      b.addEventListener("click", function () {
        answer(parseInt(b.getAttribute("data-j"), 10));
      });
    });
  }
  function answer(j) {
    if (answered) return;
    answered = true;
    var opts = quizEl._opts;
    var correctIdx = -1;
    opts.forEach(function (o, i) {
      if (o.ok) correctIdx = i;
    });
    var ok = j === correctIdx;
    if (ok) score++;
    var btns = quizEl.querySelectorAll(".lx-opt");
    for (var i = 0; i < btns.length; i++) {
      btns[i].disabled = true;
      if (i === correctIdx) btns[i].classList.add("is-correct");
      else if (i === j) btns[i].classList.add("is-wrong");
    }
    var fb = document.getElementById("lx-fb");
    fb.innerHTML =
      '<p class="lx-verdict ' + (ok ? "ok" : "ko") + '">' + (ok ? "✓ Exact !" : "✗ Raté") + "</p>" +
      (idx < order.length - 1
        ? '<button type="button" class="btn btn--primary" id="lx-next">Suivant →</button>'
        : '<button type="button" class="btn btn--primary" id="lx-finish">Voir mon score</button>');
    var next = document.getElementById("lx-next");
    if (next) next.addEventListener("click", function () {
      idx++;
      renderQuestion();
    });
    var fin = document.getElementById("lx-finish");
    if (fin) fin.addEventListener("click", showScore);
  }
  function showScore() {
    var pct = Math.round((score / order.length) * 100);
    quizEl.innerHTML =
      '<div class="lx-score"><span class="lx-score__n">' + score + " / " + order.length + "</span>" +
      '<span class="lx-score__pct">' + pct + "%</span></div>" +
      '<button type="button" class="btn btn--primary" id="lx-again">Rejouer</button>';
    document.getElementById("lx-again").addEventListener("click", startQuiz);
  }

  /* ---------------------------------------------------------- Onglets */
  tabsEl.addEventListener("click", function (e) {
    var b = e.target && e.target.closest ? e.target.closest("[data-mode]") : null;
    if (!b) return;
    var mode = b.getAttribute("data-mode");
    var btns = tabsEl.querySelectorAll(".lx-tab");
    for (var i = 0; i < btns.length; i++) {
      var sel = btns[i] === b;
      btns[i].classList.toggle("is-active", sel);
      btns[i].setAttribute("aria-pressed", sel ? "true" : "false");
    }
    if (mode === "quiz") {
      listEl.hidden = true;
      quizEl.hidden = false;
      startQuiz();
    } else {
      quizEl.hidden = true;
      listEl.hidden = false;
    }
  });

  if (searchEl) searchEl.addEventListener("input", renderList);
  renderList();
})();
