/* =============================================================================
   json.js — Visualiseur de JSON pliable (T4, Lot 5). Parse le JSON collé
   (JSON.parse) et l'affiche en arbre dépliable : objets/tableaux pliables,
   valeurs typées et colorées. Gestion d'erreurs. 100 % file://.
   Page : pages/json.html.
   ============================================================================= */
(function () {
  "use strict";

  var input = document.getElementById("jv-input");
  var tree = document.getElementById("jv-tree");
  var hint = document.getElementById("jv-hint");
  if (!input || !tree) return;

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }

  var count;

  function keyLabel(key) {
    if (key === null) return "";
    if (typeof key === "number") return '<span class="jv-index">' + key + "</span> : ";
    return '<span class="jv-key">"' + esc(key) + '"</span> : ';
  }

  function renderValue(key, val) {
    count++;
    var kl = keyLabel(key);
    if (val === null) return '<li class="jv-leaf">' + kl + '<span class="jv-null">null</span></li>';
    var t = typeof val;
    if (t === "string") return '<li class="jv-leaf">' + kl + '<span class="jv-str">"' + esc(val) + '"</span></li>';
    if (t === "number") return '<li class="jv-leaf">' + kl + '<span class="jv-num">' + val + "</span></li>";
    if (t === "boolean") return '<li class="jv-leaf">' + kl + '<span class="jv-bool">' + val + "</span></li>";

    if (Array.isArray(val)) {
      if (!val.length) return '<li class="jv-leaf">' + kl + '<span class="jv-punct">[ ]</span></li>';
      var items = val
        .map(function (v, i) {
          return renderValue(i, v);
        })
        .join("");
      return (
        '<li class="jv-node"><details open><summary>' + kl +
        '<span class="jv-punct">[</span> <span class="jv-meta">' + val.length + " élément" + (val.length > 1 ? "s" : "") +
        '</span> <span class="jv-punct">]</span></summary><ul class="jv-children">' + items + "</ul></details></li>"
      );
    }
    if (t === "object") {
      var keys = Object.keys(val);
      if (!keys.length) return '<li class="jv-leaf">' + kl + '<span class="jv-punct">{ }</span></li>';
      var rows = keys
        .map(function (k) {
          return renderValue(k, val[k]);
        })
        .join("");
      return (
        '<li class="jv-node"><details open><summary>' + kl +
        '<span class="jv-punct">{</span> <span class="jv-meta">' + keys.length + " clé" + (keys.length > 1 ? "s" : "") +
        '</span> <span class="jv-punct">}</span></summary><ul class="jv-children">' + rows + "</ul></details></li>"
      );
    }
    return "";
  }

  function render() {
    var raw = input.value.trim();
    if (!raw) {
      tree.innerHTML = '<p class="jv-empty">Colle du JSON pour l\'explorer.</p>';
      hint.textContent = "";
      hint.className = "jv-hint";
      return;
    }
    var data;
    try {
      data = JSON.parse(raw);
    } catch (e) {
      tree.innerHTML = "";
      hint.textContent = "JSON invalide : " + (e && e.message ? e.message : e);
      hint.className = "jv-hint is-err";
      return;
    }
    count = 0;
    var html = renderValue(null, data);
    tree.innerHTML = '<ul class="jv-root">' + html + "</ul>";
    hint.textContent = "JSON valide · " + count + " valeur" + (count > 1 ? "s" : "");
    hint.className = "jv-hint is-ok";
  }

  input.addEventListener("input", render);
  render();
})();
