/* =============================================================================
   arbre-dom.js — Visualiseur d'arbre DOM (T3, Lot 5). Parse le HTML collé avec
   DOMParser (sans exécuter de script) et affiche sa structure en arbre pliable
   (balises, attributs, nœuds texte). 100 % file://. Page : pages/arbre-dom.html.
   ============================================================================= */
(function () {
  "use strict";

  var input = document.getElementById("dom-input");
  var tree = document.getElementById("dom-tree");
  var hint = document.getElementById("dom-hint");
  if (!input || !tree) return;

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }

  var elCount, textCount;

  function renderNode(node) {
    if (node.nodeType === 3) {
      var t = node.textContent.replace(/\s+/g, " ").trim();
      if (!t) return "";
      textCount++;
      return '<li class="dom-text">"' + esc(t.length > 70 ? t.slice(0, 70) + "…" : t) + '"</li>';
    }
    if (node.nodeType === 8) {
      return '<li class="dom-comment">&lt;!-- ' + esc(node.textContent.trim()) + " --&gt;</li>";
    }
    if (node.nodeType !== 1) return "";
    elCount++;
    var tag = node.tagName.toLowerCase();
    var attrs = "";
    for (var i = 0; i < node.attributes.length; i++) {
      var a = node.attributes[i];
      attrs +=
        ' <span class="dom-attr">' + esc(a.name) + "</span>" +
        '=<span class="dom-val">"' + esc(a.value) + '"</span>';
    }
    var childHtml = "";
    var ch = node.childNodes;
    for (var j = 0; j < ch.length; j++) childHtml += renderNode(ch[j]);
    var label =
      '<span class="dom-punct">&lt;</span><span class="dom-tag">' + esc(tag) + "</span>" +
      attrs + '<span class="dom-punct">&gt;</span>';
    if (childHtml) {
      return (
        '<li class="dom-el"><details open><summary>' + label + "</summary>" +
        '<ul class="dom-children">' + childHtml + "</ul></details></li>"
      );
    }
    return '<li class="dom-el dom-el--leaf">' + label + "</li>";
  }

  function render() {
    elCount = 0;
    textCount = 0;
    var doc;
    try {
      doc = new DOMParser().parseFromString(input.value, "text/html");
    } catch (e) {
      tree.innerHTML = '<p class="dom-empty">HTML illisible.</p>';
      hint.textContent = "";
      return;
    }
    var body = doc.body;
    var html = "";
    for (var i = 0; i < body.childNodes.length; i++) html += renderNode(body.childNodes[i]);
    tree.innerHTML = html
      ? '<ul class="dom-root">' + html + "</ul>"
      : '<p class="dom-empty">Colle du HTML pour voir son arbre.</p>';
    hint.textContent =
      elCount + " élément" + (elCount > 1 ? "s" : "") + " · " +
      textCount + " nœud" + (textCount > 1 ? "s" : "") + " texte";
  }

  input.addEventListener("input", render);
  render();
})();
