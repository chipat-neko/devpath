/* =============================================================================
   degrade.js — Générateur de dégradés CSS (T2, Lot 5). Dégradé linéaire ou
   radial, arrêts de couleur ajoutables/supprimables, angle réglable → aperçu
   live + code `background` copiable. 100 % file://. Page : pages/degrade.html.
   ============================================================================= */
(function () {
  "use strict";

  var typesEl = document.getElementById("gr-types");
  var angleField = document.getElementById("gr-angle-field");
  var angleInput = document.getElementById("gr-angle");
  var angleVal = document.getElementById("gr-angle-val");
  var stopsEl = document.getElementById("gr-stops");
  var addBtn = document.getElementById("gr-add");
  var previewEl = document.getElementById("gr-preview");
  var codeEl = document.getElementById("gr-code");
  var copyBtn = document.getElementById("gr-copy");
  if (!stopsEl || !previewEl || !codeEl) return;

  var state = {
    type: "linear",
    angle: 90,
    stops: [
      { color: "#2540f0", pos: 0 },
      { color: "#e8b24a", pos: 100 },
    ],
  };

  function gradientCss() {
    var stops = state.stops
      .slice()
      .sort(function (a, b) {
        return a.pos - b.pos;
      })
      .map(function (s) {
        return s.color + " " + s.pos + "%";
      })
      .join(", ");
    if (state.type === "linear") return "linear-gradient(" + state.angle + "deg, " + stops + ")";
    return "radial-gradient(circle, " + stops + ")";
  }

  function apply() {
    var g = gradientCss();
    previewEl.style.background = g;
    codeEl.textContent = "background: " + g + ";";
  }

  function renderStops() {
    stopsEl.innerHTML = state.stops
      .map(function (s, i) {
        return (
          '<div class="gr-stop">' +
          '<input type="color" data-i="' + i + '" data-k="color" value="' + s.color + '" aria-label="Couleur ' + (i + 1) + '">' +
          '<input type="range" data-i="' + i + '" data-k="pos" min="0" max="100" value="' + s.pos + '" aria-label="Position ' + (i + 1) + '">' +
          '<span class="gr-stop__pos" data-i="' + i + '">' + s.pos + "%</span>" +
          (state.stops.length > 2 ? '<button type="button" class="gr-stop__del" data-i="' + i + '" aria-label="Supprimer">✕</button>' : "") +
          "</div>"
        );
      })
      .join("");

    stopsEl.querySelectorAll("input[data-k]").forEach(function (el) {
      el.addEventListener("input", function () {
        var i = parseInt(el.getAttribute("data-i"), 10);
        var k = el.getAttribute("data-k");
        if (k === "pos") {
          state.stops[i].pos = parseInt(el.value, 10);
          var lab = stopsEl.querySelector('.gr-stop__pos[data-i="' + i + '"]');
          if (lab) lab.textContent = el.value + "%";
        } else {
          state.stops[i].color = el.value;
        }
        apply();
      });
    });
    stopsEl.querySelectorAll(".gr-stop__del").forEach(function (b) {
      b.addEventListener("click", function () {
        state.stops.splice(parseInt(b.getAttribute("data-i"), 10), 1);
        renderStops();
        apply();
      });
    });
  }

  typesEl.addEventListener("click", function (e) {
    var b = e.target && e.target.closest ? e.target.closest("[data-type]") : null;
    if (!b) return;
    state.type = b.getAttribute("data-type");
    var btns = typesEl.querySelectorAll(".gr-type");
    for (var i = 0; i < btns.length; i++) btns[i].classList.toggle("is-active", btns[i] === b);
    angleField.style.display = state.type === "linear" ? "" : "none";
    apply();
  });

  angleInput.addEventListener("input", function () {
    state.angle = parseInt(angleInput.value, 10);
    angleVal.textContent = state.angle + "°";
    apply();
  });

  addBtn.addEventListener("click", function () {
    state.stops.push({ color: "#57c98a", pos: 50 });
    renderStops();
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

  renderStops();
  apply();
})();
