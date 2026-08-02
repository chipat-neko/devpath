/* =============================================================================
   devine.js — Moteur du quiz « Devine la sortie » (S9, Lot 4). Présente les
   extraits de window.DEVINE (js/devine-data.js), QCM auto-corrigé avec
   explication, score final. 100 % file://. Page : pages/devine.html.
   ============================================================================= */
(function () {
  "use strict";

  var DATA = window.DEVINE || [];
  var stage = document.getElementById("devine-stage");
  if (!stage || !DATA.length) return;

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

  var order, idx, score, answered;

  function start() {
    order = shuffle(DATA.slice());
    idx = 0;
    score = 0;
    renderQuestion();
  }

  function renderQuestion() {
    answered = false;
    var q = order[idx];
    var opts = q.options.map(function (t, i) {
      return { t: t, correct: i === q.correct };
    });
    shuffle(opts);
    q._opts = opts;
    var optsHtml = opts
      .map(function (o, j) {
        return '<button type="button" class="devine-opt" data-j="' + j + '"><code>' + esc(o.t) + "</code></button>";
      })
      .join("");
    stage.innerHTML =
      '<div class="devine-top"><span class="devine-lang">' + esc(q.lang) + "</span>" +
      '<span class="devine-num">' + (idx + 1) + " / " + order.length + "</span></div>" +
      '<pre class="devine-code"><code>' + esc(q.code) + "</code></pre>" +
      '<p class="devine-q">Que produit ce code ?</p>' +
      '<div class="devine-opts">' + optsHtml + "</div>" +
      '<div class="devine-feedback" id="devine-fb"></div>';
    var btns = stage.querySelectorAll(".devine-opt");
    for (var i = 0; i < btns.length; i++) {
      btns[i].addEventListener("click", function () {
        answer(parseInt(this.getAttribute("data-j"), 10));
      });
    }
  }

  function answer(j) {
    if (answered) return;
    answered = true;
    var q = order[idx];
    var opts = q._opts;
    var correctIdx = -1;
    opts.forEach(function (o, i) {
      if (o.correct) correctIdx = i;
    });
    var ok = j === correctIdx;
    if (ok) score++;
    var btns = stage.querySelectorAll(".devine-opt");
    for (var i = 0; i < btns.length; i++) {
      btns[i].disabled = true;
      if (i === correctIdx) btns[i].classList.add("is-correct");
      else if (i === j) btns[i].classList.add("is-wrong");
    }
    var fb = document.getElementById("devine-fb");
    fb.innerHTML =
      '<p class="devine-verdict ' + (ok ? "ok" : "ko") + '">' + (ok ? "✓ Bonne réponse !" : "✗ Raté !") + "</p>" +
      '<p class="devine-explain">' + esc(q.explain) + "</p>" +
      (idx < order.length - 1
        ? '<button type="button" class="btn btn--primary" id="devine-next">Question suivante →</button>'
        : '<button type="button" class="btn btn--primary" id="devine-finish">Voir mon score</button>');
    var next = document.getElementById("devine-next");
    if (next) next.addEventListener("click", function () {
      idx++;
      renderQuestion();
    });
    var fin = document.getElementById("devine-finish");
    if (fin) fin.addEventListener("click", showScore);
  }

  function scoreMsg(pct) {
    if (pct >= 90) return "Œil de lynx ! 👏";
    if (pct >= 70) return "Très bonne lecture du code.";
    if (pct >= 50) return "Pas mal — encore quelques pièges à apprivoiser.";
    return "Ces pièges sont coriaces : retente ta chance !";
  }
  function showScore() {
    var pct = Math.round((score / order.length) * 100);
    stage.innerHTML =
      '<div class="devine-score"><span class="devine-score__n">' + score + " / " + order.length + "</span>" +
      '<span class="devine-score__pct">' + pct + "%</span></div>" +
      '<p class="devine-score__msg">' + scoreMsg(pct) + "</p>" +
      '<button type="button" class="btn btn--primary" id="devine-again">Rejouer</button>';
    document.getElementById("devine-again").addEventListener("click", start);
  }

  start();
})();
