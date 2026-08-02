/* theme.js — Applique le thème AVANT le rendu pour éviter tout clignotement.
   À charger en tête de page de façon bloquante (sans defer) :
     <script src="../js/theme.js"></script>
   Le bouton de bascule est câblé dans main.js. */
(function () {
  "use strict";
  var KEY = "syntaxe-theme";
  var stored = null;
  try {
    stored = localStorage.getItem(KEY);
  } catch (e) {
    /* localStorage indisponible (navigation privée stricte, file://) */
  }
  // Aperçu via URL (?theme=dark) — pratique pour tester, n'écrase pas le choix stocké
  var override = null;
  try {
    var m = /[?&]theme=(dark|light)/.exec(window.location.search);
    if (m) override = m[1];
  } catch (e) {}

  var prefersDark =
    window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  var theme =
    override ||
    (stored === "light" || stored === "dark" ? stored : prefersDark ? "dark" : "light");
  document.documentElement.setAttribute("data-theme", theme);

  // Exposé pour main.js (bascule + persistance)
  window.SyntaxeTheme = {
    key: KEY,
    get: function () {
      return document.documentElement.getAttribute("data-theme");
    },
    set: function (value) {
      document.documentElement.setAttribute("data-theme", value);
      try {
        localStorage.setItem(KEY, value);
      } catch (e) {}
    },
    toggle: function () {
      this.set(this.get() === "dark" ? "light" : "dark");
      return this.get();
    },
  };

  /* Couleur d'accent (palette) — appliquée tôt pour éviter le clignotement. */
  var AKEY = "syntaxe-theme-color";
  var accent = null;
  try {
    accent = localStorage.getItem(AKEY);
  } catch (e) {}
  if (accent && accent !== "indigo") {
    document.documentElement.setAttribute("data-accent", accent);
  }
  window.SyntaxeAccent = {
    key: AKEY,
    list: ["indigo", "emeraude", "ambre", "framboise", "cyan", "violet"],
    get: function () {
      return document.documentElement.getAttribute("data-accent") || "indigo";
    },
    set: function (value) {
      if (!value || value === "indigo") document.documentElement.removeAttribute("data-accent");
      else document.documentElement.setAttribute("data-accent", value);
      try {
        localStorage.setItem(AKEY, value || "indigo");
      } catch (e) {}
    },
  };
})();
