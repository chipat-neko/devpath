/* =============================================================================
   parcours.js — Page « Parcours » : enchaînements de cours existants.
   Rend les itinéraires depuis SITE_DATA.tracks, avec la progression cumulée
   (lue dans le même localStorage que cours.js / lecon.js). Aucun fetch.
   ============================================================================= */
(function () {
  "use strict";

  var DATA = window.SITE_DATA;
  if (!DATA || !DATA.tracks) return;

  var host = document.getElementById("parcours-list");
  if (!host) return;

  function esc(s) {
    return (s || "").replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }

  /* Progression partagée */
  function progress() {
    return window.SyntaxeStore.getJSON("syntaxe-progress", {});
  }

  /* Nb de leçons (total / faites) d'un cours */
  function courseCount(id, prog) {
    var c = DATA.content[id];
    if (!c) return { total: 0, done: 0 };
    var total = 0;
    var done = 0;
    var p = prog[id] || {};
    c.modules.forEach(function (m) {
      m.lessons.forEach(function (l) {
        total++;
        if (p[l.file]) done++;
      });
    });
    return { total: total, done: done };
  }

  /* Première leçon non terminée d'un cours (pour « continuer ») */
  function firstUndone(id, prog) {
    var c = DATA.content[id];
    if (!c) return null;
    var p = prog[id] || {};
    var first = null;
    for (var mi = 0; mi < c.modules.length; mi++) {
      var ls = c.modules[mi].lessons;
      for (var li = 0; li < ls.length; li++) {
        if (!first) first = ls[li].file;
        if (!p[ls[li].file]) return ls[li].file;
      }
    }
    return first; // tout fait : on renvoie la première
  }

  function glyphOf(id) {
    if (window.courseLogo) {
      var g = window.courseLogo(id);
      if (g) return g;
    }
    var c = DATA.content[id];
    return esc((c && c.glyph) || "?");
  }

  function render() {
    var prog = progress();
    var html = "";

    DATA.tracks.forEach(function (t) {
      var tTotal = 0;
      var tDone = 0;
      var nCourses = 0;
      var steps = "";

      t.courses.forEach(function (id, idx) {
        var c = DATA.content[id];
        if (!c) return;
        nCourses++;
        var cnt = courseCount(id, prog);
        tTotal += cnt.total;
        tDone += cnt.done;
        var complete = cnt.total > 0 && cnt.done === cnt.total;
        var started = cnt.done > 0;
        var target = firstUndone(id, prog);
        var href = c.dir + "/" + (target || "cours.html");
        var state = complete ? " is-done" : started ? " is-started" : "";

        steps +=
          '<li class="track-step' + state + '">' +
          '<a class="track-step__link" href="' + esc(href) + '">' +
          '<span class="track-step__glyph" data-accent="' + esc(id) + '" aria-hidden="true">' + glyphOf(id) + "</span>" +
          '<span class="track-step__body">' +
          '<span class="track-step__title">' + esc(c.title) + "</span>" +
          '<span class="track-step__meta">' + cnt.done + " / " + cnt.total + " leçons" +
          (complete ? " · terminé ✓" : started ? " · en cours" : "") + "</span>" +
          "</span>" +
          '<svg class="icon track-step__arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>' +
          "</a></li>";
      });

      var pct = tTotal ? Math.round((tDone / tTotal) * 100) : 0;

      /* Fin de parcours : tous les cours terminés. On CONSTATE (nombre de cours
         et de leçons) et on propose une SUITE à l'échelle du parcours — un projet
         fil rouge, qui enchaîne justement plusieurs cours. Même esprit qu'A2,
         mais un cran au-dessus (le parcours, pas le cours). */
      var doneBlock = "";
      if (tTotal > 0 && tDone === tTotal) {
        doneBlock =
          '<p class="track-done">' +
          '<svg class="track-done__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5" /></svg>' +
          "<span>Parcours terminé : " + nCourses + " cours, " + tTotal +
          " leçons. Passe à la pratique avec " +
          '<a href="fils-rouges.html">un projet fil rouge</a>.</span>' +
          "</p>";
      }

      html +=
        '<article class="track-card" id="' + esc(t.id) + '">' +
        '<div class="track-card__head">' +
        '<span class="track-card__glyph" aria-hidden="true">' + esc(t.glyph) + "</span>" +
        '<div>' +
        '<h2 class="track-card__title">' + esc(t.title) + "</h2>" +
        '<p class="track-card__tagline">' + esc(t.tagline) + "</p>" +
        "</div>" +
        "</div>" +
        '<div class="progress"><div class="progress__head">' +
        '<span class="progress__label">Progression du parcours</span>' +
        '<span class="progress__value">' + tDone + " / " + tTotal + "</span></div>" +
        '<div class="progress__track"><div class="progress__bar" style="width:' + pct + '%"></div></div></div>' +
        '<ol class="track-steps">' + steps + "</ol>" +
        doneBlock +
        "</article>";
    });

    host.innerHTML = html;
  }

  render();
})();
