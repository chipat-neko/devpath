/* =============================================================================
   texte.js — Convertisseur de casse & texte (T5, Lot 5). Transformations en
   place (casse, tri, dédoublonnage, nettoyage) + compteurs. 100 % file://.
   Page : pages/texte.html.
   ============================================================================= */
(function () {
  "use strict";

  var area = document.getElementById("tx-area");
  var opsEl = document.getElementById("tx-ops");
  var statsEl = document.getElementById("tx-stats");
  var copyBtn = document.getElementById("tx-copy");
  var clearBtn = document.getElementById("tx-clear");
  if (!area || !opsEl) return;

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }
  function words(s) {
    return s
      .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
      .split(/[\s_-]+/)
      .filter(Boolean);
  }
  function perLine(s, fn) {
    return s.split(/\r?\n/).map(fn).join("\n");
  }
  function camel(line) {
    return words(line)
      .map(function (w, i) {
        w = w.toLowerCase();
        return i === 0 ? w : w.charAt(0).toUpperCase() + w.slice(1);
      })
      .join("");
  }
  function snake(line) {
    return words(line)
      .map(function (w) {
        return w.toLowerCase();
      })
      .join("_");
  }
  function kebab(line) {
    return words(line)
      .map(function (w) {
        return w.toLowerCase();
      })
      .join("-");
  }
  function titleLine(line) {
    return line
      .split(" ")
      .map(function (w) {
        return w ? w.charAt(0).toUpperCase() + w.slice(1).toLowerCase() : w;
      })
      .join(" ");
  }

  var OPS = [
    { label: "MAJUSCULES", fn: function (s) { return s.toUpperCase(); } },
    { label: "minuscules", fn: function (s) { return s.toLowerCase(); } },
    { label: "Title Case", fn: function (s) { return perLine(s, titleLine); } },
    { label: "camelCase", fn: function (s) { return perLine(s, camel); } },
    { label: "snake_case", fn: function (s) { return perLine(s, snake); } },
    { label: "kebab-case", fn: function (s) { return perLine(s, kebab); } },
    { label: "Inverser", fn: function (s) { return s.split("").reverse().join(""); } },
    {
      label: "Trier les lignes",
      fn: function (s) {
        return s.split(/\r?\n/).sort(function (a, b) {
          return a.localeCompare(b, "fr");
        }).join("\n");
      },
    },
    {
      label: "Dédoublonner",
      fn: function (s) {
        var seen = {};
        return s.split(/\r?\n/).filter(function (l) {
          if (seen[l]) return false;
          seen[l] = 1;
          return true;
        }).join("\n");
      },
    },
    {
      label: "Nettoyer les espaces",
      fn: function (s) {
        return s
          .split(/\r?\n/)
          .map(function (l) {
            return l.replace(/\s+/g, " ").trim();
          })
          .join("\n")
          .replace(/\n{3,}/g, "\n\n");
      },
    },
  ];

  function updateStats() {
    var v = area.value;
    var words2 = v.trim() ? v.trim().split(/\s+/).length : 0;
    statsEl.textContent =
      v.length + " caractère" + (v.length > 1 ? "s" : "") + " · " +
      words2 + " mot" + (words2 > 1 ? "s" : "") + " · " +
      (v === "" ? 0 : v.split(/\n/).length) + " ligne" + (v.split(/\n/).length > 1 ? "s" : "");
  }

  opsEl.innerHTML = OPS.map(function (o, i) {
    return '<button type="button" class="tx-op" data-i="' + i + '">' + esc(o.label) + "</button>";
  }).join("");
  opsEl.querySelectorAll(".tx-op").forEach(function (b) {
    b.addEventListener("click", function () {
      var i = parseInt(b.getAttribute("data-i"), 10);
      area.value = OPS[i].fn(area.value);
      updateStats();
      area.focus();
    });
  });

  area.addEventListener("input", updateStats);
  if (copyBtn) {
    copyBtn.addEventListener("click", function () {
      if (!area.value) return;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(area.value).then(function () {
          copyBtn.textContent = "Copié !";
          window.setTimeout(function () {
            copyBtn.textContent = "Copier";
          }, 1500);
        }, function () {});
      }
    });
  }
  if (clearBtn) {
    clearBtn.addEventListener("click", function () {
      area.value = "";
      updateStats();
      area.focus();
    });
  }

  updateStats();
})();
