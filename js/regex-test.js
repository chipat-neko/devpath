/* =============================================================================
   regex-test.js — Testeur d'expressions régulières (R2, Lot 3). Motif +
   drapeaux + texte → correspondances surlignées en direct + groupes capturés,
   avec gestion des motifs invalides. `new RegExp` côté client. 100 % file://.
   Page : pages/regex-test.html.
   ============================================================================= */
(function () {
  "use strict";

  var pat = document.getElementById("rx-pattern");
  var txt = document.getElementById("rx-text");
  var out = document.getElementById("rx-output");
  var matchesEl = document.getElementById("rx-matches");
  var errEl = document.getElementById("rx-err");
  var countEl = document.getElementById("rx-count");
  if (!pat || !txt || !out) return;

  var flagEls = {
    g: document.getElementById("rx-g"),
    i: document.getElementById("rx-i"),
    m: document.getElementById("rx-m"),
    s: document.getElementById("rx-s"),
  };

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }
  function flags() {
    var f = "";
    for (var k in flagEls) {
      if (flagEls.hasOwnProperty(k) && flagEls[k] && flagEls[k].checked) f += k;
    }
    return f;
  }

  function run() {
    var pattern = pat.value;
    if (!pattern) {
      out.innerHTML = esc(txt.value);
      matchesEl.innerHTML = "";
      errEl.textContent = "";
      countEl.textContent = "";
      return;
    }
    var fl = flags();
    var re;
    try {
      re = new RegExp(pattern, fl);
      errEl.textContent = "";
    } catch (e) {
      errEl.textContent = "Motif invalide : " + (e && e.message ? e.message : e);
      return;
    }

    var text = txt.value;
    var global = fl.indexOf("g") >= 0;
    var reAll = new RegExp(re.source, global ? re.flags : re.flags + "g");
    var matches = [];
    var m;
    var guard = 0;
    while ((m = reAll.exec(text)) !== null) {
      matches.push(m);
      if (m[0].length === 0) reAll.lastIndex++;
      if (++guard > 5000) break;
      if (!global) break;
    }

    /* Surlignage (en travaillant sur le texte original puis en échappant). */
    var html = "";
    var pos = 0;
    matches.forEach(function (mt) {
      var s = mt.index;
      var e = mt.index + mt[0].length;
      html += esc(text.slice(pos, s));
      if (e > s) html += "<mark>" + esc(text.slice(s, e)) + "</mark>";
      pos = Math.max(pos, e);
    });
    html += esc(text.slice(pos));
    out.innerHTML = html || "<span class='rx-none'>(texte vide)</span>";

    /* Liste des correspondances + groupes. */
    var rows = matches.map(function (mt, idx) {
      var groups = "";
      for (var i = 1; i < mt.length; i++) {
        groups +=
          "<li>Groupe " + i + " : " +
          (mt[i] === undefined
            ? '<span class="rx-undef">(non capturé)</span>'
            : "<code>" + esc(mt[i]) + "</code>") +
          "</li>";
      }
      return (
        '<div class="rx-match">' +
        '<span class="rx-num">#' + (idx + 1) + "</span> " +
        "<code>" + esc(mt[0] === "" ? "(vide)" : mt[0]) + "</code> " +
        '<span class="rx-at">index ' + mt.index + "</span>" +
        (groups ? '<ul class="rx-groups">' + groups + "</ul>" : "") +
        "</div>"
      );
    });
    matchesEl.innerHTML = rows.length
      ? rows.join("")
      : '<p class="rx-none">Aucune correspondance.</p>';
    countEl.textContent =
      "— " + matches.length + " correspondance" + (matches.length > 1 ? "s" : "");
  }

  pat.addEventListener("input", run);
  txt.addEventListener("input", run);
  for (var k in flagEls) {
    if (flagEls.hasOwnProperty(k) && flagEls[k]) flagEls[k].addEventListener("change", run);
  }
  run();
})();
