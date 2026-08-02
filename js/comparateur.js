/* =============================================================================
   comparateur.js — Comparateur de syntaxe (P7). Affiche, pour la tâche choisie,
   le code équivalent dans chaque langage (window.SYNTAXES). 100 % statique.
   Page : pages/comparateur.html.
   ============================================================================= */
(function () {
  "use strict";

  var S = window.SYNTAXES;
  var tasksEl = document.getElementById("cmp-tasks");
  var gridEl = document.getElementById("cmp-grid");
  if (!S || !tasksEl || !gridEl || !S.tasks || !S.tasks.length) return;

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }

  var current = S.tasks[0].id;

  function renderTasks() {
    tasksEl.innerHTML = S.tasks
      .map(function (t) {
        return (
          '<button type="button" aria-pressed="' + (t.id === current ? "true" : "false") +
          '" class="cmp-task' + (t.id === current ? " is-active" : "") +
          '" data-id="' + esc(t.id) + '">' + esc(t.label) + "</button>"
        );
      })
      .join("");
    tasksEl.querySelectorAll("[data-id]").forEach(function (b) {
      b.addEventListener("click", function () {
        current = b.getAttribute("data-id");
        renderTasks();
        renderGrid();
      });
    });
  }

  function renderGrid() {
    var code = S.code[current] || {};
    gridEl.innerHTML = S.langs
      .map(function (l) {
        var snippet = code[l.id] || "—";
        return (
          '<figure class="cmp-card">' +
          '<figcaption class="cmp-card__lang">' + esc(l.label) + "</figcaption>" +
          '<pre class="cmp-card__code"><code>' + esc(snippet) + "</code></pre>" +
          "</figure>"
        );
      })
      .join("");
  }

  renderTasks();
  renderGrid();
})();
