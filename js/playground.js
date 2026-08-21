/* =============================================================================
   playground.js — Bac à sable HTML/CSS/JS avec aperçu en direct.
   Construit un document complet et l'injecte dans une <iframe sandbox> via
   srcdoc. Sauvegarde l'essai en localStorage. Aucun fetch, 100 % statique.
   Page : pages/playground.html.
   ============================================================================= */
(function () {
  "use strict";

  var html = document.getElementById("pg-html");
  var css = document.getElementById("pg-css");
  var js = document.getElementById("pg-js");
  var frame = document.getElementById("pg-frame");
  var resetBtn = document.getElementById("pg-reset");
  if (!html || !css || !js || !frame) return;

  var KEY = "syntaxe-playground";

  var DEFAULT = {
    html:
      "<h1>Bonjour, monde !</h1>\n" +
      "<p>Modifie le code à gauche : l'aperçu se met à jour tout seul.</p>\n" +
      '<button id="btn">Clique-moi</button>\n' +
      '<p id="out"></p>',
    css:
      "body {\n" +
      "  font-family: system-ui, sans-serif;\n" +
      "  text-align: center;\n" +
      "  padding: 2rem;\n" +
      "  color: #1a1713;\n" +
      "}\n" +
      "button {\n" +
      "  padding: 0.6rem 1.1rem;\n" +
      "  border: 0;\n" +
      "  border-radius: 8px;\n" +
      "  background: #2536d4;\n" +
      "  color: #fff;\n" +
      "  font-size: 1rem;\n" +
      "  cursor: pointer;\n" +
      "}",
    js:
      "let n = 0;\n" +
      "const btn = document.getElementById('btn');\n" +
      "const out = document.getElementById('out');\n" +
      "btn.addEventListener('click', () => {\n" +
      "  n++;\n" +
      "  out.textContent = 'Tu as cliqué ' + n + (n > 1 ? ' fois.' : ' fois.');\n" +
      "});",
  };

  function load() {
    try {
      var s = JSON.parse(localStorage.getItem(KEY) || "null");
      if (s && typeof s === "object" && typeof s.html === "string") return s;
    } catch (e) {}
    return DEFAULT;
  }
  function save() {
    window.SyntaxeStore.setJSON(KEY, {
      html: html.value,
      css: css.value,
      js: js.value,
    });
  }

  /* Deux onglets ouverts : se resynchroniser avec le dernier brouillon écrit
     par un autre onglet, mais JAMAIS écraser ce que l'utilisateur est en train
     de taper ici (on ignore l'événement si un éditeur a le focus) (cf. C4). */
  window.addEventListener("storage", function (e) {
    if (e.key !== KEY || e.newValue == null) return;
    var a = document.activeElement;
    if (a === html || a === css || a === js) return;
    var s = load();
    html.value = s.html;
    css.value = s.css;
    js.value = s.js;
    render();
  });

  function srcDoc() {
    return (
      '<!DOCTYPE html><html lang="fr"><head><meta charset="utf-8">' +
      "<style>" + css.value + "</style></head><body>" +
      html.value +
      "<scr" + "ipt>" + js.value + "</scr" + "ipt>" +
      "</body></html>"
    );
  }
  function render() {
    frame.srcdoc = srcDoc();
  }

  var deb;
  function onInput() {
    clearTimeout(deb);
    deb = setTimeout(function () {
      render();
      save();
    }, 300);
  }

  var st = load();
  html.value = st.html || "";
  css.value = st.css || "";
  js.value = st.js || "";
  render();

  [html, css, js].forEach(function (t) {
    t.addEventListener("input", onInput);
  });

  if (resetBtn) {
    resetBtn.addEventListener("click", function () {
      if (!window.confirm("Remettre l'exemple de départ ? Ton code actuel sera remplacé.")) return;
      html.value = DEFAULT.html;
      css.value = DEFAULT.css;
      js.value = DEFAULT.js;
      render();
      save();
    });
  }
})();
