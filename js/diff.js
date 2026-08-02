/* =============================================================================
   diff.js — Comparateur de textes (S6, Lot 4). Compare deux textes ligne à
   ligne et surligne ajouts / suppressions, via la plus longue sous-séquence
   commune (LCS) calculée maison + backtrack. 100 % file://.
   Page : pages/diff.html.
   ============================================================================= */
(function () {
  "use strict";

  var aEl = document.getElementById("diff-a");
  var bEl = document.getElementById("diff-b");
  var outEl = document.getElementById("diff-output");
  var statsEl = document.getElementById("diff-stats");
  if (!aEl || !bEl || !outEl) return;

  var MAX = 1200; // garde-fou sur le nombre de lignes (table O(n·m))

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }

  function diffLines(a, b) {
    var n = a.length,
      m = b.length;
    var dp = [];
    for (var i = 0; i <= n; i++) {
      dp[i] = [];
      for (var j = 0; j <= m; j++) dp[i][j] = 0;
    }
    for (var i2 = n - 1; i2 >= 0; i2--) {
      for (var j2 = m - 1; j2 >= 0; j2--) {
        if (a[i2] === b[j2]) dp[i2][j2] = dp[i2 + 1][j2 + 1] + 1;
        else dp[i2][j2] = Math.max(dp[i2 + 1][j2], dp[i2][j2 + 1]);
      }
    }
    var res = [];
    var i = 0,
      j = 0;
    while (i < n && j < m) {
      if (a[i] === b[j]) {
        res.push({ t: "same", text: a[i] });
        i++;
        j++;
      } else if (dp[i + 1][j] >= dp[i][j + 1]) {
        res.push({ t: "del", text: a[i] });
        i++;
      } else {
        res.push({ t: "add", text: b[j] });
        j++;
      }
    }
    while (i < n) {
      res.push({ t: "del", text: a[i] });
      i++;
    }
    while (j < m) {
      res.push({ t: "add", text: b[j] });
      j++;
    }
    return res;
  }

  var PREFIX = { same: " ", del: "−", add: "+" };

  function render() {
    var a = aEl.value.split(/\r?\n/);
    var b = bEl.value.split(/\r?\n/);
    if (a.length > MAX || b.length > MAX) {
      outEl.innerHTML = '<p class="diff-empty">Texte trop long pour la comparaison (max ' + MAX + " lignes par côté).</p>";
      statsEl.textContent = "";
      return;
    }
    var d = diffLines(a, b);
    var adds = 0,
      dels = 0;
    var html = d
      .map(function (row) {
        if (row.t === "add") adds++;
        else if (row.t === "del") dels++;
        return (
          '<div class="diff-line diff-line--' + row.t + '">' +
          '<span class="diff-mark">' + PREFIX[row.t] + "</span>" +
          '<code class="diff-text">' + (esc(row.text) || "&nbsp;") + "</code></div>"
        );
      })
      .join("");
    outEl.innerHTML = '<div class="diff-rows">' + html + "</div>";
    statsEl.innerHTML =
      '<span class="diff-stat diff-stat--add">+' + adds + " ajout" + (adds > 1 ? "s" : "") + "</span> " +
      '<span class="diff-stat diff-stat--del">−' + dels + " suppression" + (dels > 1 ? "s" : "") + "</span>" +
      (adds === 0 && dels === 0 ? ' <span class="diff-stat">— textes identiques</span>' : "");
  }

  aEl.addEventListener("input", render);
  bEl.addEventListener("input", render);
  render();
})();
