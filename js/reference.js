/* =============================================================================
   reference.js — Fiches de référence (T9, Lot 5). Tables cherchables : ASCII
   (générée ici), codes HTTP, entités HTML, syntaxe Markdown (window.REFERENCE).
   100 % file://. Page : pages/reference.html.
   ============================================================================= */
(function () {
  "use strict";

  var REF = window.REFERENCE || {};
  var tabsEl = document.getElementById("ref-tabs");
  var searchEl = document.getElementById("ref-search");
  var countEl = document.getElementById("ref-count");
  var tableEl = document.getElementById("ref-table");
  if (!tabsEl || !tableEl) return;

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }
  function norm(s) {
    return String(s || "")
      .toLowerCase()
      .replace(/[àâä]/g, "a")
      .replace(/[éèêë]/g, "e")
      .replace(/[îï]/g, "i")
      .replace(/[ôö]/g, "o")
      .replace(/[ûüù]/g, "u")
      .replace(/ç/g, "c");
  }

  /* Table ASCII imprimable (32–126), générée. */
  function asciiRows() {
    var names = { 32: "espace" };
    var rows = [];
    for (var i = 32; i <= 126; i++) {
      rows.push({
        dec: String(i),
        hex: i.toString(16).toUpperCase(),
        chr: String.fromCharCode(i),
        name: names[i] || "",
      });
    }
    return rows;
  }

  var TABS = [
    { id: "ascii", label: "ASCII", cols: ["Déc", "Hex", "Caractère", "Nom"], keys: ["dec", "hex", "chr", "name"], rows: asciiRows() },
    { id: "http", label: "Codes HTTP", cols: ["Code", "Nom", "Description"], keys: ["code", "name", "desc"], rows: REF.http || [] },
    { id: "entities", label: "Entités HTML", cols: ["Entité", "Caractère", "Description"], keys: ["ent", "chr", "desc"], rows: REF.entities || [] },
    { id: "markdown", label: "Markdown", cols: ["Syntaxe", "Description"], keys: ["syntax", "desc"], rows: REF.markdown || [] },
    { id: "regex", label: "Regex", cols: ["Motif", "Description"], keys: ["pat", "desc"], rows: REF.regex || [] },
    { id: "git", label: "Git", cols: ["Commande", "Description"], keys: ["cmd", "desc"], rows: REF.git || [] },
    { id: "linux", label: "Linux", cols: ["Commande", "Description"], keys: ["cmd", "desc"], rows: REF.linux || [] },
    { id: "rust", label: "Types Rust", cols: ["Type", "Description"], keys: ["type", "desc"], rows: REF.rust || [] },
    { id: "docker", label: "Docker", cols: ["Commande", "Description"], keys: ["cmd", "desc"], rows: REF.docker || [] },
  ];

  var current = "ascii";

  function tabById(id) {
    for (var i = 0; i < TABS.length; i++) if (TABS[i].id === id) return TABS[i];
    return TABS[0];
  }

  function renderTabs() {
    tabsEl.innerHTML = TABS.map(function (t) {
      return '<button type="button" aria-pressed="' + (t.id === current ? "true" : "false") +
        '" class="ref-tab' + (t.id === current ? " is-active" : "") +
        '" data-id="' + t.id + '">' + esc(t.label) + "</button>";
    }).join("");
    tabsEl.querySelectorAll("[data-id]").forEach(function (b) {
      b.addEventListener("click", function () {
        current = b.getAttribute("data-id");
        renderTabs();
        render();
      });
    });
  }

  function render() {
    var tab = tabById(current);
    var q = norm(searchEl ? searchEl.value.trim() : "");
    var rows = tab.rows.filter(function (r) {
      if (!q) return true;
      for (var i = 0; i < tab.keys.length; i++) {
        if (norm(String(r[tab.keys[i]] == null ? "" : r[tab.keys[i]])).indexOf(q) !== -1) return true;
      }
      return false;
    });
    var head = "<tr>" + tab.cols.map(function (c) { return "<th>" + esc(c) + "</th>"; }).join("") + "</tr>";
    var body = rows
      .map(function (r) {
        return "<tr>" + tab.keys.map(function (k) {
          return "<td>" + esc(String(r[k] == null ? "" : r[k])) + "</td>";
        }).join("") + "</tr>";
      })
      .join("");
    tableEl.innerHTML = rows.length
      ? '<table class="ref-table"><thead>' + head + "</thead><tbody>" + body + "</tbody></table>"
      : '<p class="ref-empty">Rien ne correspond.</p>';
    if (countEl) countEl.textContent = rows.length + " ligne" + (rows.length > 1 ? "s" : "") + " sur " + tab.rows.length;
  }

  if (searchEl) searchEl.addEventListener("input", render);
  renderTabs();
  render();
})();
