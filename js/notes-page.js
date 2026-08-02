/* =============================================================================
   notes-page.js — Page « Mes notes » : récapitule les notes et surlignages
   enregistrés par lecon.js (localStorage `syntaxe-notes`), groupés par cours.
   Lit les titres dans window.SITE_DATA. Aucun fetch.
   ============================================================================= */
(function () {
  "use strict";

  var host = document.getElementById("notes-list");
  if (!host) return;
  var DATA = window.SITE_DATA;

  function esc(s) {
    return (s || "").replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }

  var store = {};
  try {
    store = JSON.parse(localStorage.getItem("syntaxe-notes") || "{}") || {};
  } catch (e) {}

  function courseInfo(id) {
    var c = DATA && DATA.content && DATA.content[id];
    return c ? { title: c.title, dir: c.dir } : { title: id, dir: id };
  }
  function lessonTitle(id, file) {
    var c = DATA && DATA.content && DATA.content[id];
    var title = file;
    if (c && c.modules) {
      c.modules.forEach(function (m) {
        m.lessons.forEach(function (l) {
          if (l.file === file) title = l.title;
        });
      });
    }
    return title;
  }

  var ids = Object.keys(store);
  if (!ids.length) {
    host.innerHTML =
      '<p class="notes-empty">Tu n\'as pas encore de note ni de surlignage. ' +
      "Ouvre une leçon, sélectionne un passage pour le <strong>surligner</strong>, ou déplie " +
      "« Ma note » en bas de la leçon : tout apparaîtra ici.</p>";
    return;
  }

  ids.sort(function (a, b) {
    return courseInfo(a).title.localeCompare(courseInfo(b).title, "fr");
  });

  var html = "";
  ids.forEach(function (id) {
    var ci = courseInfo(id);
    var lessons = store[id];
    var rows = "";
    Object.keys(lessons).forEach(function (file) {
      var d = lessons[file] || {};
      var inner = "";
      if (d.hl && d.hl.length) {
        inner +=
          '<ul class="notes-hls">' +
          d.hl
            .map(function (t) {
              return "<li><mark>" + esc(t) + "</mark></li>";
            })
            .join("") +
          "</ul>";
      }
      if (d.note && d.note.trim()) {
        inner += '<p class="notes-note">' + esc(d.note) + "</p>";
      }
      if (!inner) return;
      rows +=
        '<li class="notes-lesson">' +
        '<a class="notes-lesson__link" href="' + esc(ci.dir) + "/" + esc(file) + '">' +
        esc(lessonTitle(id, file)) + "</a>" +
        inner +
        "</li>";
    });
    if (!rows) return;
    html +=
      '<section class="notes-course">' +
      "<h2>" + esc(ci.title) + "</h2>" +
      '<ul class="notes-lessons">' + rows + "</ul>" +
      "</section>";
  });

  host.innerHTML = html || '<p class="notes-empty">Aucune note pour le moment.</p>';
})();
