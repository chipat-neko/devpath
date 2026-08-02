/* =============================================================================
   mes-qcm.js — Générateur de QCM personnel (R10, Lot 3). Créer ses questions
   (énoncé, options, bonne réponse), les garder (localStorage `syntaxe-mes-qcm`),
   s'entraîner (quiz auto-corrigé, options mélangées) et importer/exporter le
   jeu en JSON. 100 % file://. Page : pages/mes-qcm.html.
   ============================================================================= */
(function () {
  "use strict";

  var KEY = "syntaxe-mes-qcm";
  var tabsEl = document.getElementById("mq-tabs");
  var editEl = document.getElementById("mq-edit");
  var quizEl = document.getElementById("mq-quiz");
  var form = document.getElementById("mq-form");
  var listEl = document.getElementById("mq-list");
  var msgEl = document.getElementById("mq-msg");
  var bankTitle = document.getElementById("mq-bank-title");
  if (!form || !listEl || !quizEl) return;

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
  function load() {
    try {
      return JSON.parse(localStorage.getItem(KEY) || "[]") || [];
    } catch (e) {
      return [];
    }
  }
  function save() {
    try {
      localStorage.setItem(KEY, JSON.stringify(questions));
    } catch (e) {}
  }
  function msg(t, ok) {
    if (!msgEl) return;
    msgEl.textContent = t || "";
    msgEl.className = "mq-msg" + (t ? (ok ? " is-ok" : " is-err") : "");
  }

  var questions = load();

  /* ------------------------------------------------------------ Onglets */
  tabsEl.addEventListener("click", function (e) {
    var b = e.target && e.target.closest ? e.target.closest("[data-tab]") : null;
    if (!b) return;
    var tab = b.getAttribute("data-tab");
    var btns = tabsEl.querySelectorAll(".mq-tab");
    for (var i = 0; i < btns.length; i++) btns[i].classList.toggle("is-active", btns[i] === b);
    if (tab === "quiz") {
      editEl.hidden = true;
      quizEl.hidden = false;
      startQuiz();
    } else {
      quizEl.hidden = true;
      editEl.hidden = false;
    }
  });

  /* ------------------------------------------------------- Création */
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var q = document.getElementById("mq-q").value.trim();
    var radios = form.querySelectorAll('input[name="mq-correct"]');
    var optIns = form.querySelectorAll(".mq-optin");
    var selectedIdx = -1;
    for (var i = 0; i < radios.length; i++) if (radios[i].checked) selectedIdx = i;

    var opts = [];
    var correct = -1;
    for (var k = 0; k < optIns.length; k++) {
      var v = optIns[k].value.trim();
      if (v) {
        if (k === selectedIdx) correct = opts.length;
        opts.push(v);
      }
    }
    if (!q) return msg("Écris d'abord l'énoncé.", false);
    if (opts.length < 2) return msg("Il faut au moins deux réponses.", false);
    if (correct === -1) return msg("Coche la bonne réponse (et remplis-la).", false);

    questions.push({ q: q, a: opts, correct: correct });
    save();
    form.reset();
    renderList();
    msg("Question ajoutée ✓", true);
  });

  /* ------------------------------------------------------------ Liste */
  function renderList() {
    if (bankTitle) bankTitle.textContent = "Mes questions (" + questions.length + ")";
    if (!questions.length) {
      listEl.innerHTML = '<p class="mq-empty">Aucune question pour l\'instant. Crée la première ci-dessus !</p>';
      return;
    }
    listEl.innerHTML = questions
      .map(function (item, qi) {
        var opts = item.a
          .map(function (o, oi) {
            return '<li class="' + (oi === item.correct ? "is-correct" : "") + '">' + esc(o) + "</li>";
          })
          .join("");
        return (
          '<div class="mq-item">' +
          '<div class="mq-item__head"><strong>' + esc(item.q) + "</strong>" +
          '<button type="button" class="mq-del" data-i="' + qi + '" aria-label="Supprimer cette question">✕</button></div>' +
          '<ol class="mq-item__opts">' + opts + "</ol></div>"
        );
      })
      .join("");
    var dels = listEl.querySelectorAll(".mq-del");
    for (var i = 0; i < dels.length; i++) {
      dels[i].addEventListener("click", function () {
        questions.splice(+this.getAttribute("data-i"), 1);
        save();
        renderList();
      });
    }
  }

  /* ------------------------------------------------------------- Quiz */
  var prepared = [];
  function startQuiz() {
    if (!questions.length) {
      quizEl.innerHTML = '<p class="mq-empty">Crée d\'abord quelques questions dans l\'onglet « Mes questions ».</p>';
      return;
    }
    prepared = shuffle(questions.slice()).map(function (item) {
      var opts = item.a.map(function (t, i) {
        return { t: t, correct: i === item.correct };
      });
      shuffle(opts);
      return { q: item.q, opts: opts };
    });
    var html = prepared
      .map(function (p, qi) {
        var opts = p.opts
          .map(function (o, oi) {
            return (
              '<label class="mq-qopt"><input type="radio" name="mq-q' + qi + '" value="' + oi + '"> ' +
              esc(o.t) + "</label>"
            );
          })
          .join("");
        return (
          '<div class="mq-question" data-qi="' + qi + '">' +
          '<p class="mq-question__q">' + (qi + 1) + ". " + esc(p.q) + "</p>" +
          '<div class="mq-qopts">' + opts + "</div>" +
          '<p class="mq-feedback"></p></div>'
        );
      })
      .join("");
    quizEl.innerHTML =
      '<div class="mq-quiz-body">' + html + "</div>" +
      '<div class="mq-quiz-actions">' +
      '<button type="button" class="btn btn--primary" id="mq-correct">Corriger</button>' +
      '<button type="button" class="btn btn--ghost" id="mq-retry">Recommencer</button>' +
      '<span class="mq-score" id="mq-score"></span></div>';
    document.getElementById("mq-correct").addEventListener("click", correctQuiz);
    document.getElementById("mq-retry").addEventListener("click", startQuiz);
  }
  function correctQuiz() {
    var score = 0;
    prepared.forEach(function (p, qi) {
      var box = quizEl.querySelector('.mq-question[data-qi="' + qi + '"]');
      if (!box) return;
      var sel = box.querySelector('input[name="mq-q' + qi + '"]:checked');
      var fb = box.querySelector(".mq-feedback");
      var correctIdx = -1;
      p.opts.forEach(function (o, oi) {
        if (o.correct) correctIdx = oi;
      });
      var ok = sel && +sel.value === correctIdx;
      if (ok) score++;
      box.classList.remove("is-ok", "is-ko");
      box.classList.add(ok ? "is-ok" : "is-ko");
      fb.textContent = ok ? "✓ Bonne réponse" : "✗ Bonne réponse : " + p.opts[correctIdx].t;
    });
    var sc = document.getElementById("mq-score");
    if (sc) sc.textContent = score + " / " + prepared.length;
  }

  /* ------------------------------------------------------ Import / export */
  var exportBtn = document.getElementById("mq-export");
  if (exportBtn) {
    exportBtn.addEventListener("click", function () {
      if (!questions.length) return msg("Rien à exporter.", false);
      var blob = new Blob([JSON.stringify(questions, null, 2)], { type: "application/json" });
      var url = URL.createObjectURL(blob);
      var a = document.createElement("a");
      a.href = url;
      a.download = "mes-qcm.json";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.setTimeout(function () {
        URL.revokeObjectURL(url);
      }, 1000);
    });
  }
  var importInput = document.getElementById("mq-import");
  if (importInput) {
    importInput.addEventListener("change", function () {
      var file = importInput.files && importInput.files[0];
      if (!file) return;
      var reader = new FileReader();
      reader.onload = function () {
        try {
          var arr = JSON.parse(reader.result);
          if (!Array.isArray(arr)) return msg("Fichier invalide (tableau attendu).", false);
          var valid = arr.filter(function (x) {
            return x && typeof x.q === "string" && Array.isArray(x.a) && typeof x.correct === "number";
          });
          questions = questions.concat(valid);
          save();
          renderList();
          msg(valid.length + " question(s) importée(s) ✓", true);
        } catch (e) {
          msg("JSON invalide.", false);
        }
      };
      reader.readAsText(file);
      importInput.value = "";
    });
  }

  renderList();
})();
