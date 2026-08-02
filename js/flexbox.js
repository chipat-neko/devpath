/* =============================================================================
   flexbox.js — Visualiseur Flexbox & Grid (T1, Lot 5). Règle les propriétés du
   conteneur via menus/curseurs → aperçu live + code CSS généré. 100 % file://.
   Page : pages/flexbox.html.
   ============================================================================= */
(function () {
  "use strict";

  var tabsEl = document.getElementById("fx-tabs");
  var controlsEl = document.getElementById("fx-controls");
  var previewEl = document.getElementById("fx-preview");
  var codeEl = document.getElementById("fx-code");
  var copyBtn = document.getElementById("fx-copy");
  if (!controlsEl || !previewEl || !codeEl) return;

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }

  var mode = "flex";
  var state = {
    flex: {
      "flex-direction": "row",
      "justify-content": "flex-start",
      "align-items": "stretch",
      "flex-wrap": "nowrap",
      gap: 8,
      count: 4,
    },
    grid: {
      cols: 3,
      gap: 8,
      "justify-items": "stretch",
      "align-items": "stretch",
      count: 6,
    },
  };

  var CONTROLS = {
    flex: [
      { prop: "flex-direction", label: "flex-direction", opts: ["row", "row-reverse", "column", "column-reverse"] },
      { prop: "justify-content", label: "justify-content", opts: ["flex-start", "center", "flex-end", "space-between", "space-around", "space-evenly"] },
      { prop: "align-items", label: "align-items", opts: ["stretch", "flex-start", "center", "flex-end", "baseline"] },
      { prop: "flex-wrap", label: "flex-wrap", opts: ["nowrap", "wrap"] },
      { prop: "gap", label: "gap (px)", min: 0, max: 40 },
      { prop: "count", label: "Nombre d'éléments", min: 2, max: 8 },
    ],
    grid: [
      { prop: "cols", label: "Colonnes (1fr)", min: 1, max: 6 },
      { prop: "gap", label: "gap (px)", min: 0, max: 40 },
      { prop: "justify-items", label: "justify-items", opts: ["stretch", "start", "center", "end"] },
      { prop: "align-items", label: "align-items", opts: ["stretch", "start", "center", "end"] },
      { prop: "count", label: "Nombre d'éléments", min: 2, max: 12 },
    ],
  };

  function renderControls() {
    var s = state[mode];
    controlsEl.innerHTML = CONTROLS[mode]
      .map(function (c) {
        if (c.opts) {
          var options = c.opts
            .map(function (o) {
              return '<option value="' + o + '"' + (s[c.prop] === o ? " selected" : "") + ">" + o + "</option>";
            })
            .join("");
          return (
            '<label class="fx-ctrl"><span>' + esc(c.label) + "</span>" +
            '<select class="select" data-prop="' + c.prop + '">' + options + "</select></label>"
          );
        }
        return (
          '<label class="fx-ctrl"><span>' + esc(c.label) + " : <strong>" + s[c.prop] + "</strong></span>" +
          '<input type="range" data-prop="' + c.prop + '" min="' + c.min + '" max="' + c.max + '" value="' + s[c.prop] + '"></label>'
        );
      })
      .join("");
    controlsEl.querySelectorAll("[data-prop]").forEach(function (el) {
      var ev = el.tagName === "SELECT" ? "change" : "input";
      el.addEventListener(ev, function () {
        var prop = el.getAttribute("data-prop");
        var v = el.value;
        s[prop] = el.type === "range" ? parseInt(v, 10) : v;
        if (el.type === "range") renderControls();
        apply();
      });
    });
  }

  function renderItems(n) {
    var html = "";
    for (var i = 1; i <= n; i++) html += '<div class="fx-item">' + i + "</div>";
    previewEl.innerHTML = html;
  }

  function apply() {
    var s = state[mode];
    previewEl.removeAttribute("style");
    if (mode === "flex") {
      previewEl.style.display = "flex";
      previewEl.style.flexDirection = s["flex-direction"];
      previewEl.style.justifyContent = s["justify-content"];
      previewEl.style.alignItems = s["align-items"];
      previewEl.style.flexWrap = s["flex-wrap"];
      previewEl.style.gap = s.gap + "px";
      renderItems(s.count);
      codeEl.textContent =
        ".conteneur {\n" +
        "  display: flex;\n" +
        "  flex-direction: " + s["flex-direction"] + ";\n" +
        "  justify-content: " + s["justify-content"] + ";\n" +
        "  align-items: " + s["align-items"] + ";\n" +
        "  flex-wrap: " + s["flex-wrap"] + ";\n" +
        "  gap: " + s.gap + "px;\n" +
        "}";
    } else {
      previewEl.style.display = "grid";
      previewEl.style.gridTemplateColumns = "repeat(" + s.cols + ", 1fr)";
      previewEl.style.justifyItems = s["justify-items"];
      previewEl.style.alignItems = s["align-items"];
      previewEl.style.gap = s.gap + "px";
      renderItems(s.count);
      codeEl.textContent =
        ".conteneur {\n" +
        "  display: grid;\n" +
        "  grid-template-columns: repeat(" + s.cols + ", 1fr);\n" +
        "  justify-items: " + s["justify-items"] + ";\n" +
        "  align-items: " + s["align-items"] + ";\n" +
        "  gap: " + s.gap + "px;\n" +
        "}";
    }
  }

  tabsEl.addEventListener("click", function (e) {
    var b = e.target && e.target.closest ? e.target.closest("[data-mode]") : null;
    if (!b) return;
    mode = b.getAttribute("data-mode");
    var btns = tabsEl.querySelectorAll(".fx-tab");
    for (var i = 0; i < btns.length; i++) {
      var sel = btns[i] === b;
      btns[i].classList.toggle("is-active", sel);
      btns[i].setAttribute("aria-selected", sel ? "true" : "false");
    }
    renderControls();
    apply();
  });

  if (copyBtn) {
    copyBtn.addEventListener("click", function () {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(codeEl.textContent).then(function () {
          copyBtn.textContent = "Copié !";
          window.setTimeout(function () {
            copyBtn.textContent = "Copier";
          }, 1500);
        }, function () {});
      }
    });
  }

  renderControls();
  apply();
})();
