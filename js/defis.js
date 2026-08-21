/* =============================================================================
   defis.js — Moteur des défis de code (P5). Affiche la liste, l'énoncé et un
   éditeur ; à la validation, exécute le code de l'utilisateur + les cas de test
   dans un Web Worker ISOLÉ (coupe-circuit anti-boucle à 3 s). Progression en
   localStorage `syntaxe-defis`. 100 % file://. Page : pages/defis.html.
   ============================================================================= */
(function () {
  "use strict";

  var DEFIS = window.DEFIS || [];
  var listEl = document.getElementById("defis-list");
  var mainEl = document.getElementById("defis-main");
  if (!listEl || !mainEl || !DEFIS.length) return;

  var KEY = "syntaxe-defis";
  var current = null;

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }
  function solvedMap() {
    return window.SyntaxeStore.getJSON(KEY, {});
  }
  function markSolved(id) {
    var s = solvedMap();
    s[id] = true;
    window.SyntaxeStore.setJSON(KEY, s);
  }
  function valStr(v) {
    try {
      return JSON.stringify(v);
    } catch (e) {
      return String(v);
    }
  }

  /* Code exécuté DANS le worker : évalue le code utilisateur, récupère la
     fonction et la teste. Isolé du document. */
  var TEST_WORKER = [
    "self.onmessage = function (ev) {",
    "  var d = ev.data, results = [];",
    "  try {",
    "    (0, eval)(d.code);",
    "    var f;",
    "    try { f = (0, eval)(d.fn); } catch (e) { f = undefined; }",
    "    if (typeof f !== 'function') { self.postMessage({ error: 'La fonction ' + d.fn + ' est introuvable.' }); return; }",
    "    for (var i = 0; i < d.tests.length; i++) {",
    "      var t = d.tests[i], got, err = null;",
    "      try { got = f.apply(null, t.args); }",
    "      catch (e) { err = e && e.message ? e.message : String(e); }",
    "      var ok = err === null && JSON.stringify(got) === JSON.stringify(t.expect);",
    "      results.push({ args: t.args, expect: t.expect, got: err ? ('Erreur : ' + err) : got, ok: ok });",
    "    }",
    "    self.postMessage({ results: results });",
    "  } catch (e) { self.postMessage({ error: e && e.message ? e.message : String(e) }); }",
    "};",
  ].join("\n");

  function renderList() {
    var s = solvedMap();
    var done = 0;
    DEFIS.forEach(function (d) {
      if (s[d.id]) done++;
    });
    var html =
      '<p class="defis-list__head">' + done + " / " + DEFIS.length + " résolus</p>";
    DEFIS.forEach(function (d) {
      html +=
        '<button type="button" class="defis-item' +
        (s[d.id] ? " is-solved" : "") +
        (current === d.id ? " is-active" : "") +
        '" data-id="' + esc(d.id) + '">' +
        '<span class="defis-item__check" aria-hidden="true">' + (s[d.id] ? "✓" : "") + "</span>" +
        '<span class="defis-item__t">' + esc(d.titre) + "</span>" +
        '<span class="defis-item__lvl">' + esc(d.niveau) + "</span>" +
        "</button>";
    });
    listEl.innerHTML = html;
    listEl.querySelectorAll("[data-id]").forEach(function (b) {
      b.addEventListener("click", function () {
        openDefi(b.getAttribute("data-id"));
      });
    });
  }

  function findDefi(id) {
    for (var i = 0; i < DEFIS.length; i++) if (DEFIS[i].id === id) return DEFIS[i];
    return null;
  }

  function openDefi(id) {
    var d = findDefi(id);
    if (!d) return;
    current = id;
    mainEl.innerHTML =
      '<span class="defis-main__lvl">' + esc(d.niveau) + "</span>" +
      '<h2 class="defis-main__title">' + esc(d.titre) + "</h2>" +
      '<p class="defis-main__enonce">' + d.enonce + "</p>" +
      '<textarea class="defis-editor" id="defis-code" aria-label="Éditeur de code du défi" spellcheck="false" autocomplete="off" autocapitalize="off"></textarea>' +
      '<div class="defis-actions">' +
      '<button type="button" class="btn btn--primary" id="defis-run">Valider</button>' +
      '<button type="button" class="btn btn--ghost" id="defis-reset">Réinitialiser</button>' +
      "</div>" +
      '<div class="defis-results" id="defis-results"></div>';
    var ta = document.getElementById("defis-code");
    ta.value = d.depart;
    document.getElementById("defis-run").addEventListener("click", function () {
      runTests(d, ta.value);
    });
    document.getElementById("defis-reset").addEventListener("click", function () {
      ta.value = d.depart;
      ta.focus();
    });
    renderList();
  }

  function runTests(d, code) {
    var out = document.getElementById("defis-results");
    if (out) out.innerHTML = '<p class="defis-results__head">Exécution…</p>';
    var worker = null,
      url = null,
      done = false;
    function finish(data) {
      if (done) return;
      done = true;
      clearTimeout(timer);
      try {
        if (worker) worker.terminate();
      } catch (e) {}
      if (url) URL.revokeObjectURL(url);
      showResults(d, data);
    }
    try {
      var blob = new Blob([TEST_WORKER], { type: "application/javascript" });
      url = URL.createObjectURL(blob);
      worker = new Worker(url);
    } catch (e) {
      finish({ error: "Impossible d'exécuter le code dans ce navigateur." });
      return;
    }
    var timer = setTimeout(function () {
      finish({ error: "Temps dépassé (3 s) — boucle infinie ?" });
    }, 3000);
    worker.onmessage = function (e) {
      finish(e.data || {});
    };
    worker.onerror = function (e) {
      finish({ error: (e && e.message) || "Erreur d'exécution." });
    };
    try {
      worker.postMessage({ code: code, fn: d.fn, tests: d.tests });
    } catch (e) {
      finish({ error: "Erreur : " + (e && e.message) });
    }
  }

  function showResults(d, data) {
    var out = document.getElementById("defis-results");
    if (!out) return;
    if (data.error) {
      out.innerHTML = '<p class="defis-fail">✗ ' + esc(data.error) + "</p>";
      return;
    }
    var res = data.results || [];
    var allOk = res.length > 0;
    var rows = "";
    res.forEach(function (r) {
      if (!r.ok) allOk = false;
      rows +=
        '<li class="defis-test ' + (r.ok ? "ok" : "ko") + '">' +
        '<span class="defis-test__icon" aria-hidden="true">' + (r.ok ? "✓" : "✗") + "</span>" +
        "<code>" + esc(d.fn) + "(" + esc(r.args.map(valStr).join(", ")) + ")</code> → attendu " +
        "<code>" + esc(valStr(r.expect)) + "</code>, obtenu <code>" + esc(valStr(r.got)) + "</code>" +
        "</li>";
    });
    out.innerHTML =
      (allOk
        ? '<p class="defis-ok">✓ Bravo, tous les tests passent !</p>'
        : '<p class="defis-fail">Certains tests échouent encore :</p>') +
      '<ul class="defis-tests">' + rows + "</ul>";
    if (allOk) {
      markSolved(d.id);
      renderList();
    }
  }

  renderList();
  openDefi(DEFIS[0].id);
})();
