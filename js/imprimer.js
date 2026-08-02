/* =============================================================================
   imprimer.js — Assemble toutes les leçons d'un cours en un seul document
   imprimable (→ PDF via window.print()). Page : pages/imprimer.html?cours=<dir>.
   Lit la liste des leçons dans window.SITE_DATA, puis récupère le contenu
   rédactionnel (.prose) de chaque leçon par fetch.
   ⚠️ fetch est bloqué en file:// → repli : liste des leçons à imprimer une à une.
   ============================================================================= */
(function () {
  "use strict";

  var DATA = window.SITE_DATA;
  var statusEl = document.getElementById("print-status");
  var contentEl = document.getElementById("print-content");
  var titleEl = document.getElementById("print-title");
  var printBtn = document.getElementById("print-btn");
  if (!DATA || !contentEl || !statusEl) return;

  function esc(s) {
    return (s || "").replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }

  var dir = "";
  try {
    dir = new URLSearchParams(location.search).get("cours") || "";
  } catch (e) {}

  /* Retrouver le cours par son dossier (dir). */
  var course = null;
  for (var k in DATA.content) {
    if (DATA.content.hasOwnProperty(k) && DATA.content[k].dir === dir) {
      course = DATA.content[k];
      break;
    }
  }
  if (!course) {
    statusEl.innerHTML =
      'Cours introuvable. <a href="catalogue.html">Retour au catalogue</a>.';
    return;
  }

  if (titleEl) titleEl.textContent = course.title;
  document.title = course.title + " — version imprimable — Syntaxe";

  /* Liste à plat des leçons (lisibles). */
  var lessons = [];
  course.modules.forEach(function (m) {
    m.lessons.forEach(function (l) {
      if (l.file && l.file !== "#" && l.status !== "bientot") lessons.push(l);
    });
  });

  function lessonLinks() {
    return (
      '<ul class="print-fallback__list">' +
      lessons
        .map(function (l) {
          return '<li><a href="' + esc(dir) + "/" + esc(l.file) + '">' + esc(l.title) + "</a></li>";
        })
        .join("") +
      "</ul>"
    );
  }

  function fallbackMessage() {
    return (
      '<div class="callout callout--note"><div class="callout__body">' +
      '<p class="callout__title">Assemblage indisponible en local</p>' +
      "<p>Réunir toutes les leçons en un seul document demande que le site soit servi en " +
      "<strong>HTTP</strong> (le navigateur empêche de lire les fichiers entre eux en " +
      "<code>file://</code>). Lance un petit serveur dans le dossier du site, par exemple " +
      "<code>python -m http.server</code>, puis rouvre cette page.</p>" +
      "<p>En attendant, tu peux ouvrir et imprimer chaque leçon individuellement " +
      "(chaque page de leçon a son bouton « Imprimer ») :</p>" +
      "</div></div>" +
      lessonLinks()
    );
  }

  /* En file:// : on n'essaie même pas le fetch, on propose le repli direct. */
  if (location.protocol === "file:") {
    statusEl.textContent =
      course.title + " — " + lessons.length + " leçons.";
    contentEl.innerHTML = fallbackMessage();
    return;
  }

  statusEl.textContent =
    "Assemblage du cours « " + course.title + " » — " + lessons.length + " leçons…";

  Promise.all(
    lessons.map(function (l) {
      return fetch(dir + "/" + l.file)
        .then(function (r) {
          return r.ok ? r.text() : "";
        })
        .then(function (html) {
          return { l: l, html: html };
        })
        .catch(function () {
          return { l: l, html: "" };
        });
    })
  ).then(function (parts) {
    var assembled = "";
    var ok = 0;
    parts.forEach(function (p) {
      if (!p.html) return;
      var doc = new DOMParser().parseFromString(p.html, "text/html");
      var prose = doc.querySelector(".prose");
      if (!prose) return;
      var h1 = doc.querySelector(".lesson-header__title");
      var title = h1 ? h1.textContent : p.l.title;
      var scripts = prose.querySelectorAll("script");
      for (var i = 0; i < scripts.length; i++) scripts[i].parentNode.removeChild(scripts[i]);
      assembled +=
        '<section class="print-lesson">' +
        '<h2 class="print-lesson__title">' + esc(title) + "</h2>" +
        prose.innerHTML +
        "</section>";
      ok++;
    });

    if (!ok) {
      statusEl.textContent = "Impossible de charger les leçons.";
      contentEl.innerHTML = fallbackMessage();
      return;
    }

    contentEl.innerHTML = assembled;
    statusEl.textContent =
      course.title + " — " + ok + " leçons prêtes. Clique sur « Imprimer » pour enregistrer en PDF.";
    if (printBtn) printBtn.hidden = false;
  });

  if (printBtn) {
    printBtn.addEventListener("click", function () {
      window.print();
    });
  }
})();
