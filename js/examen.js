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

  /* ------------------------------------ Examen sur ce qu'on a lu (V12-C4)
     Le tirage prenait TOUTE la banque du cours. Sur JavaScript — 217 questions,
     65 leçons — quelqu'un qui en a terminé 10 recevait 86 % de questions sur du
     contenu jamais ouvert : 17 des 20 questions d'un examen. Il obtenait 6/20 et
     le site lui répondait « À retravailler — courage ! ». Les deux ingrédients
     existaient déjà : « syntaxe-progress » et le champ « f » de chaque question.
     Attention : la banque désigne un cours par son DIR, la progression par son
     ID — ce ne sont pas toujours les mêmes (javascript / js). */
  var DIR_TO_ID = {};
  if (DATA && DATA.content) {
    for (var cid in DATA.content) {
      if (DATA.content.hasOwnProperty(cid)) DIR_TO_ID[DATA.content[cid].dir] = cid;
    }
  }
  function progression() {
    return window.SyntaxeStore ? window.SyntaxeStore.getJSON("syntaxe-progress", {}) : {};
  }
  function estTerminee(prog, dir, fichier) {
    var id = DIR_TO_ID[dir];
    return !!(id && prog[id] && prog[id][fichier]);
  }
  /* Questions tirables pour un cours (« all » = tout le site), selon qu'on se
     limite ou non aux leçons terminées. */
  function bassin(dir, seulementFaites) {
    var pool = dir === "all" ? BANK.slice() : BANK.filter(function (q) { return q.c === dir; });
    if (!seulementFaites) return pool;
    var prog = progression();
    return pool.filter(function (q) { return estTerminee(prog, q.c, q.f); });
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

  /* ------------------------------------------------- Historique (V12-C1)
     L'examen était la SEULE activité du site à ne rien laisser derrière elle :
     le score s'affichait, puis disparaissait au premier clic. Impossible de
     savoir si l'on progresse. On empile donc chaque passage — date, cours,
     score, total — et on le montre, sur la page de réglages comme après le
     résultat : une donnée enregistrée mais invisible ne sert à personne. */
  var HKEY = "syntaxe-examen";
  var HISTORIQUE_MAX = 50;

  function lireHistorique() {
    var h = window.SyntaxeStore ? window.SyntaxeStore.getJSON(HKEY, []) : [];
    return Object.prototype.toString.call(h) === "[object Array]" ? h : [];
  }

  function enregistrerPassage(cours, score, total) {
    if (!window.SyntaxeStore || !total) return false;
    var d = new Date();
    var mm = d.getMonth() + 1, jj = d.getDate();
    var h = lireHistorique();
    h.push({
      date: d.getFullYear() + "-" + (mm < 10 ? "0" + mm : mm) + "-" + (jj < 10 ? "0" + jj : jj),
      cours: cours,
      score: score,
      total: total,
    });
    /* On garde les 50 derniers : de quoi voir une évolution sans laisser la
       clé grossir sans fin. */
    if (h.length > HISTORIQUE_MAX) h = h.slice(h.length - HISTORIQUE_MAX);
    return window.SyntaxeStore.setJSON(HKEY, h);
  }

  function moyenne(h) {
    var s = 0, t = 0;
    h.forEach(function (x) { s += x.score || 0; t += x.total || 0; });
    return t ? Math.round((s / t) * 100) : 0;
  }

  /* Les 10 derniers, du plus récent au plus ancien. */
  function historiqueHtml() {
    var h = lireHistorique();
    if (!h.length) return "";
    var lignes = h.slice(-10).reverse().map(function (x) {
      var pct = x.total ? Math.round((x.score / x.total) * 100) : 0;
      return '<li class="exam-hist__item">' +
        '<span class="exam-hist__date">' + esc(x.date) + "</span>" +
        '<span class="exam-hist__cours">' + esc(x.cours === "all" ? "Tous les cours" : courseTitle(x.cours)) + "</span>" +
        '<span class="exam-hist__score">' + x.score + " / " + x.total + " · " + pct + "%</span></li>";
    }).join("");
    return '<section class="exam-hist">' +
      "<h2>Tes examens précédents</h2>" +
      '<p class="exam-hist__resume">' + h.length + " examen" + (h.length > 1 ? "s" : "") +
      " passé" + (h.length > 1 ? "s" : "") + " · moyenne " + moyenne(h) + "%</p>" +
      '<ul class="exam-hist__list">' + lignes + "</ul></section>";
  }

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
      '<label class="exam-field exam-field--check">' +
      '<input type="checkbox" id="exam-faites" />' +
      "<span>Seulement les leçons que j'ai terminées " +
      '<span class="exam-dispo" id="exam-dispo"></span></span></label>' +
      '<p class="exam-hint">Tu as <strong>30 secondes par question</strong> ; le minuteur s\'arrête tout seul. Bonne chance&nbsp;!</p>' +
      '<button type="button" class="btn btn--primary btn--lg" id="exam-start">Commencer l\'examen</button>' +
      "</div>" + historiqueHtml();
    var selCours = document.getElementById("exam-c");
    var caseFaites = document.getElementById("exam-faites");
    var dispo = document.getElementById("exam-dispo");

    /* Le compteur dit COMBIEN de questions restent : cocher une case qui vide le
       tirage sans le dire serait pire que le défaut qu'on corrige. */
    function majDispo() {
      var n = bassin(selCours.value, true).length;
      dispo.textContent = "(" + n + " question" + (n > 1 ? "s" : "") + ")";
      caseFaites.disabled = n === 0;
      if (n === 0) {
        caseFaites.checked = false;
        dispo.textContent = "(aucune leçon terminée dans ce choix)";
      }
    }
    majDispo();
    selCours.addEventListener("change", majDispo);
    document.getElementById("exam-start").addEventListener("click", start);
  }

  function prepare(q) {
    var opts = q.a.map(function (t, i) {
      return { t: t, correct: i === q.k };
    });
    shuffle(opts);
    /* V12-C2 : le fichier d'origine (q.f) etait jete, alors que les 5 627
       questions de la banque le portent — la correction ne pouvait donc pas
       renvoyer vers la lecon qui enseigne la reponse. On le garde. */
    return { q: q.q, e: q.e, c: q.c, f: q.f, opts: opts };
  }

  function start() {
    var n = parseInt(document.getElementById("exam-n").value, 10) || 20;
    var c = document.getElementById("exam-c").value;
    var faites = document.getElementById("exam-faites");
    var pool = bassin(c, !!(faites && faites.checked));
    shuffle(pool);
    var picked = pool.slice(0, Math.min(n, pool.length));
    state = {
      cours: c,
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
    var garde = enregistrerPassage(state.cours, score, n);

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
          /* Depuis pages/examen.html, une lecon est a <cours>/<fichier> :
             les 1 463 couples de la banque ont ete verifies sur le disque. */
          (q.f
            ? '<p class="exam-rev__lien"><a href="' + esc(q.c) + "/" + esc(q.f) + '">' +
              "Revoir la leçon — " + esc(courseTitle(q.c)) + "</a></p>"
            : "") +
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
      (garde ? historiqueHtml() : "") +
      "<h2>Correction</h2>" +
      '<ul class="exam-revs">' + details + "</ul>";
    document.getElementById("exam-again").addEventListener("click", renderSetup);
    window.scrollTo(0, 0);
  }

  renderSetup();
})();
