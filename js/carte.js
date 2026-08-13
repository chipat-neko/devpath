/* =============================================================================
   carte.js — Carte des cours (R8, Lot 3). Graphe SVG des cours (window.SITE_DATA)
   disposés en cercle, reliés par leurs liens `related`. Survol/clic d'un nœud →
   met en avant ses voisins + panneau d'info avec lien vers le cours.
   100 % file://. Page : pages/carte.html.
   ============================================================================= */
(function () {
  "use strict";

  var DATA = window.SITE_DATA;
  var stage = document.getElementById("map-svg");
  var infoEl = document.getElementById("map-info");
  if (!DATA || !stage || !DATA.courses) return;

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }

  /* ---------------------------------------------------------------------------
     Encre du glyphe : choisie au rendu selon la LUMINANCE de l'accent du cours.
     Un glyphe blanc posé sur un accent jaune ou orange est illisible (javascript
     #caa12f et perf-web #e0972a tombaient à 2,43:1, très loin des 4,5:1 exigés).
     On dispose de deux encres, et pour une couleur de fond de luminance L le
     ratio vaut (L_clair + 0,05) / (L + 0,05) avec l'encre claire et
     (L + 0,05) / (L_foncé + 0,05) avec l'encre foncée. Les deux ratios sont
     égaux quand L = √((L_clair + 0,05)(L_foncé + 0,05)) − 0,05 : c'est le seuil
     optimal, calculé ici à partir des deux encres plutôt que codé en dur.
     Avec #ffffff et #0a0908 il vaut 0,1854, et les 83 accents du site montent
     alors tous à 4,52:1 au minimum (36 étaient sous 4,5:1, dont 6 sous 3:1).
     L'encre foncée doit rester très sombre : avec un #16140f, six accents de
     luminance moyenne (sass, python, docker, formats, graphql, archi) plafonnent
     à 4,3:1 et aucune des deux encres ne les sauve.
     --------------------------------------------------------------------------- */
  var INK_LIGHT = "#ffffff";
  var INK_DARK = "#0a0908";

  /* Luminance relative WCAG d'une couleur #rgb ou #rrggbb. */
  function luminance(hex) {
    var h = String(hex || "").replace("#", "");
    if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
    if (!/^[0-9a-fA-F]{6}$/.test(h)) return 0;
    var ch = [0, 2, 4].map(function (k) {
      var v = parseInt(h.slice(k, k + 2), 16) / 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * ch[0] + 0.7152 * ch[1] + 0.0722 * ch[2];
  }

  var SEUIL_LUM =
    Math.sqrt((luminance(INK_LIGHT) + 0.05) * (luminance(INK_DARK) + 0.05)) - 0.05;

  /* Encre la plus lisible sur un fond donné : claire si le fond est sombre. */
  function inkOn(bg) {
    return luminance(bg) > SEUIL_LUM ? INK_DARK : INK_LIGHT;
  }

  var content = DATA.content || {};
  var nodes = DATA.courses.map(function (c) {
    var accent = c.accent || "#8893a7";
    return {
      id: c.id,
      dir: c.dir,
      title: c.title,
      glyph: c.glyph || "?",
      accent: accent,
      ink: inkOn(accent),
      level: c.level || "",
    };
  });
  var idToIdx = {};
  nodes.forEach(function (n, i) {
    idToIdx[n.id] = i;
  });

  var edges = [];
  var seen = {};
  nodes.forEach(function (n, i) {
    var ct = content[n.id];
    if (ct && ct.related) {
      ct.related.forEach(function (r) {
        var j = idToIdx[r.course];
        if (j === undefined || j === i) return;
        var key = Math.min(i, j) + "-" + Math.max(i, j);
        if (seen[key]) return;
        seen[key] = 1;
        edges.push({ a: i, b: j });
      });
    }
  });

  var SIZE = 760;
  var c = SIZE / 2;
  var R = c - 64;
  nodes.forEach(function (nd, i) {
    var ang = (i / nodes.length) * 2 * Math.PI - Math.PI / 2;
    nd.x = c + R * Math.cos(ang);
    nd.y = c + R * Math.sin(ang);
  });

  var edgeSvg = edges
    .map(function (e) {
      var a = nodes[e.a],
        b = nodes[e.b];
      return (
        '<line class="map-edge" data-a="' + e.a + '" data-b="' + e.b + '" x1="' +
        a.x.toFixed(1) + '" y1="' + a.y.toFixed(1) + '" x2="' + b.x.toFixed(1) +
        '" y2="' + b.y.toFixed(1) + '"/>'
      );
    })
    .join("");
  var nodeSvg = nodes
    .map(function (nd, i) {
      return (
        '<g class="map-node" data-i="' + i + '" tabindex="0" role="button" aria-label="' + esc(nd.title) +
        '" transform="translate(' + nd.x.toFixed(1) + "," + nd.y.toFixed(1) + ')">' +
        '<circle class="map-dot" r="15" fill="' + nd.accent + '"/>' +
        /* style inline et non attribut fill= : la règle .map-glyph de pages.css
           impose fill:#fff et l'emporterait sur un simple attribut de présentation. */
        '<text class="map-glyph" text-anchor="middle" dy="4" style="fill:' + nd.ink + '">' +
        esc(nd.glyph) + "</text>" +
        "</g>"
      );
    })
    .join("");

  stage.innerHTML =
    '<svg viewBox="0 0 ' + SIZE + " " + SIZE + '" class="map-svg" role="img" aria-label="Graphe des cours">' +
    '<g class="map-edges">' + edgeSvg + "</g>" +
    '<g class="map-nodes">' + nodeSvg + "</g>" +
    "</svg>";

  var svgEl = stage.querySelector(".map-svg");
  var nodeEls = stage.querySelectorAll(".map-node");
  var edgeEls = stage.querySelectorAll(".map-edge");

  function focusNode(i) {
    svgEl.classList.add("is-focusing");
    var near = {};
    near[i] = true;
    for (var k = 0; k < edgeEls.length; k++) {
      var le = edgeEls[k];
      var a = +le.getAttribute("data-a");
      var b = +le.getAttribute("data-b");
      if (a === i || b === i) {
        le.classList.add("is-on");
        near[a] = true;
        near[b] = true;
      }
    }
    for (var m = 0; m < nodeEls.length; m++) {
      var ni = +nodeEls[m].getAttribute("data-i");
      nodeEls[m].classList.toggle("is-on", !!near[ni]);
      nodeEls[m].classList.toggle("is-focus", ni === i);
    }
  }
  function clearFocus() {
    svgEl.classList.remove("is-focusing");
    var on = stage.querySelectorAll(".is-on, .is-focus");
    for (var k = 0; k < on.length; k++) on[k].classList.remove("is-on", "is-focus");
  }

  function showInfo(i) {
    var nd = nodes[i];
    var ct = content[nd.id];
    var rels = ct && ct.related ? ct.related : [];
    var relHtml = rels
      .map(function (r) {
        var rn = idToIdx[r.course] !== undefined ? nodes[idToIdx[r.course]] : null;
        return (
          "<li><strong>" + esc(rn ? rn.title : r.course) + "</strong>" +
          (r.note ? "<span>" + esc(r.note) + "</span>" : "") + "</li>"
        );
      })
      .join("");
    infoEl.innerHTML =
      '<span class="map-info__lvl">' + esc(nd.level) + "</span>" +
      '<h2 class="map-info__title">' + esc(nd.title) + "</h2>" +
      '<a class="btn btn--primary btn--sm" href="' + esc(nd.dir) + '/cours.html">Ouvrir le cours →</a>' +
      (relHtml
        ? '<p class="map-info__rl">Cours liés :</p><ul class="map-rels">' + relHtml + "</ul>"
        : '<p class="map-info__none">Aucun cours lié déclaré.</p>');
  }

  function defaultInfo() {
    infoEl.innerHTML =
      '<p class="map-info__hint">Survole ou touche un cours pour voir ses liens et l\'ouvrir. ' +
      nodes.length + " cours, " + edges.length + " liens.</p>";
  }

  nodeEls.forEach(function (g) {
    var i = +g.getAttribute("data-i");
    g.addEventListener("mouseenter", function () {
      focusNode(i);
      showInfo(i);
    });
    g.addEventListener("focus", function () {
      focusNode(i);
      showInfo(i);
    });
    g.addEventListener("click", function () {
      focusNode(i);
      showInfo(i);
    });
    g.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        window.location.href = nodes[i].dir + "/cours.html";
      }
    });
  });
  svgEl.addEventListener("mouseleave", clearFocus);

  defaultInfo();
})();
