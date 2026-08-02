/* =============================================================================
   lorem.js — Générateur de Lorem Ipsum (T6, Lot 5). Génère du faux texte
   (paragraphes / phrases / mots / liste) à partir d'une banque de mots latins.
   100 % file://. Page : pages/lorem.html.
   ============================================================================= */
(function () {
  "use strict";

  var WORDS = ("lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor " +
    "incididunt ut labore et dolore magna aliqua enim ad minim veniam quis nostrud exercitation " +
    "ullamco laboris nisi aliquip ex ea commodo consequat duis aute irure in reprehenderit " +
    "voluptate velit esse cillum eu fugiat nulla pariatur excepteur sint occaecat cupidatat non " +
    "proident sunt culpa qui officia deserunt mollit anim id est laborum at vero eos accusamus " +
    "iusto odio dignissimos ducimus blanditiis praesentium voluptatum deleniti atque corrupti " +
    "quos dolores quas molestias placeat facere possimus omnis assumenda repellendus temporibus").split(" ");

  var typeEl = document.getElementById("lo-type");
  var countEl = document.getElementById("lo-count");
  var classicEl = document.getElementById("lo-classic");
  var genBtn = document.getElementById("lo-gen");
  var copyBtn = document.getElementById("lo-copy");
  var outEl = document.getElementById("lo-output");
  if (!typeEl || !outEl) return;

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }
  function rint(a, b) {
    return a + Math.floor(Math.random() * (b - a + 1));
  }
  function word() {
    return WORDS[Math.floor(Math.random() * WORDS.length)];
  }
  function sentence() {
    var n = rint(6, 14);
    var w = [];
    for (var i = 0; i < n; i++) {
      w.push(word());
      if (i > 0 && i < n - 1 && Math.random() < 0.12) w[w.length - 1] += ",";
    }
    var s = w.join(" ");
    return s.charAt(0).toUpperCase() + s.slice(1) + ".";
  }
  function paragraph() {
    var n = rint(3, 6);
    var s = [];
    for (var i = 0; i < n; i++) s.push(sentence());
    return s.join(" ");
  }

  var lastText = "";

  function generate() {
    var type = typeEl.value;
    var count = Math.max(1, Math.min(100, parseInt(countEl.value, 10) || 1));
    var classic = classicEl.checked;
    var blocks = [];
    var i;
    if (type === "words") {
      var w = [];
      for (i = 0; i < count; i++) w.push(word());
      lastText = w.join(" ");
    } else if (type === "sentences") {
      for (i = 0; i < count; i++) blocks.push(sentence());
      lastText = blocks.join(" ");
    } else if (type === "list") {
      for (i = 0; i < count; i++) {
        var n = rint(2, 5);
        var li = [];
        for (var j = 0; j < n; j++) li.push(word());
        var line = li.join(" ");
        blocks.push("- " + line.charAt(0).toUpperCase() + line.slice(1));
      }
      lastText = blocks.join("\n");
    } else {
      for (i = 0; i < count; i++) blocks.push(paragraph());
      lastText = blocks.join("\n\n");
    }

    if (classic && type !== "list") {
      lastText = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. " + lastText;
    }
    render(type);
  }

  function render(type) {
    if (type === "paragraphs") {
      outEl.innerHTML = lastText
        .split(/\n\n/)
        .map(function (p) {
          return "<p>" + esc(p) + "</p>";
        })
        .join("");
    } else {
      outEl.innerHTML = '<pre class="lo-pre">' + esc(lastText) + "</pre>";
    }
  }

  if (genBtn) genBtn.addEventListener("click", generate);
  if (copyBtn) {
    copyBtn.addEventListener("click", function () {
      if (!lastText) return;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(lastText).then(function () {
          copyBtn.textContent = "Copié !";
          window.setTimeout(function () {
            copyBtn.textContent = "Copier";
          }, 1500);
        }, function () {});
      }
    });
  }

  generate();
})();
