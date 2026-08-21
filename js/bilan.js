/* =============================================================================
   bilan.js — Bilan d'apprentissage imprimable (S10, Lot 4). Synthèse de toute
   la progression (leçons/cours via SITE_DATA + syntaxe-progress, XP/niveau via
   window.SyntaxeXP, série via syntaxe-activity, notes/défis/révision) sur une
   page pensée pour l'impression. 100 % file://. Page : pages/bilan.html.
   ============================================================================= */
(function () {
  "use strict";

  var DATA = window.SITE_DATA;
  var host = document.getElementById("bilan-content");
  var printBtn = document.getElementById("bilan-print");
  if (!host || !DATA || !DATA.content) return;

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }
  function ls(key) {
    return window.SyntaxeStore.getJSON(key, {});
  }
  function ymd(d) {
    var m = d.getMonth() + 1,
      j = d.getDate();
    return d.getFullYear() + "-" + (m < 10 ? "0" + m : m) + "-" + (j < 10 ? "0" + j : j);
  }

  var prog = ls("syntaxe-progress");
  var activity = ls("syntaxe-activity");
  var notes = ls("syntaxe-notes");
  var defis = ls("syntaxe-defis");
  var revision = ls("syntaxe-revision");

  /* ----- Cours & leçons ----- */
  var totalLessons = 0,
    doneLessons = 0,
    coursesDone = 0,
    coursesStarted = 0;
  var started = [];
  Object.keys(DATA.content).forEach(function (id) {
    var c = DATA.content[id];
    var p = prog[id] || {};
    var total = 0,
      done = 0;
    c.modules.forEach(function (m) {
      m.lessons.forEach(function (l) {
        total++;
        if (p[l.file]) done++;
      });
    });
    totalLessons += total;
    doneLessons += done;
    if (done > 0) {
      coursesStarted++;
      started.push({ title: c.title, total: total, done: done });
    }
    if (total > 0 && done >= total) coursesDone++;
  });
  started.sort(function (a, b) {
    return b.done / b.total - a.done / a.total;
  });

  /* ----- XP / niveau ----- */
  var xp = window.SyntaxeXP && window.SyntaxeXP.compute ? window.SyntaxeXP.compute() : { xp: 0 };
  var lvl = window.SyntaxeXP && window.SyntaxeXP.levelInfo ? window.SyntaxeXP.levelInfo(xp.xp) : null;

  /* ----- Série & activité ----- */
  function streak() {
    var s = 0,
      d = new Date();
    d.setHours(0, 0, 0, 0);
    if (!activity[ymd(d)]) d.setDate(d.getDate() - 1);
    while (activity[ymd(d)]) {
      s++;
      d.setDate(d.getDate() - 1);
    }
    return s;
  }
  var activeDays = Object.keys(activity).length;

  /* ----- Notes, défis, révision ----- */
  var noteCount = 0,
    hlCount = 0;
  Object.keys(notes).forEach(function (cid) {
    Object.keys(notes[cid]).forEach(function (f) {
      var n = notes[cid][f] || {};
      if (n.note && n.note.trim()) noteCount++;
      if (n.hl) hlCount += n.hl.length;
    });
  });
  var defisCount = Object.keys(defis).length;
  var revCount = Object.keys(revision).length;

  var pct = totalLessons ? Math.round((doneLessons / totalLessons) * 100) : 0;
  var today = new Date().toLocaleDateString("fr-FR", { year: "numeric", month: "long", day: "numeric" });

  function stat(n, l) {
    return '<div class="bilan-stat"><span class="bilan-stat__n">' + n + "</span><span class=\"bilan-stat__l\">" + esc(l) + "</span></div>";
  }

  var coursesHtml = started.length
    ? started
        .map(function (c) {
          var p = Math.round((c.done / c.total) * 100);
          return (
            '<li class="bilan-course"><span class="bilan-course__t">' + esc(c.title) + "</span>" +
            '<span class="bilan-course__bar"><span style="width:' + p + '%"></span></span>' +
            '<span class="bilan-course__n">' + c.done + " / " + c.total + "</span></li>"
          );
        })
        .join("")
    : '<li class="bilan-empty">Aucun cours commencé pour l\'instant — c\'est le moment de te lancer !</li>';

  host.innerHTML =
    '<div class="bilan-head">' +
    "<h2>Bulletin d'apprentissage</h2>" +
    '<p class="bilan-date">Édité le ' + esc(today) + "</p></div>" +
    (lvl
      ? '<p class="bilan-level">Niveau <strong>' + lvl.level + "</strong> — " + esc(lvl.title) +
        " · " + xp.xp + " XP</p>"
      : "") +
    /* Pendant « plein » du message d'état vierge (« Aucun cours commencé… ») :
       quand tout est terminé, le bulletin le constate en tête. */
    (totalLessons > 0 && doneLessons === totalLessons
      ? '<p class="bilan-complete">Parcours complet : les ' + coursesDone +
        " cours du site sont terminés — " + doneLessons + " leçons.</p>"
      : "") +
    '<div class="bilan-stats">' +
    stat(doneLessons + " / " + totalLessons, "leçons terminées") +
    stat(coursesDone, "cours maîtrisés") +
    stat(coursesStarted, "cours commencés") +
    stat(pct + "%", "du catalogue") +
    "</div>" +
    '<div class="bilan-stats">' +
    stat(streak() + " j", "série en cours") +
    stat(activeDays, "jours actifs") +
    stat(defisCount, "défis résolus") +
    stat(noteCount + hlCount, "notes & surlignages") +
    "</div>" +
    "<h3>Progression par cours</h3>" +
    '<ul class="bilan-courses">' + coursesHtml + "</ul>" +
    '<p class="bilan-foot">Révision : ' + revCount + " carte" + (revCount > 1 ? "s" : "") +
    " en cours · Document généré localement, aucune donnée n'a quitté cet appareil.</p>";

  if (printBtn) {
    printBtn.addEventListener("click", function () {
      window.print();
    });
  }
})();
