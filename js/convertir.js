/* =============================================================================
   convertir.js — Convertisseur tout-en-un (S7, Lot 4). Quatre convertisseurs
   indépendants : unités CSS (px/rem/em), tailles d'octets (base 1024),
   timestamps (epoch ↔ date) et couleurs (hex/rgb/hsl). 100 % file://.
   Page : pages/convertir.html.
   ============================================================================= */
(function () {
  "use strict";

  function $(id) {
    return document.getElementById(id);
  }
  function round(v) {
    return Math.round(v * 10000) / 10000;
  }

  /* --------------------------------------------------------- Unités CSS */
  (function () {
    var base = $("cv-base"),
      px = $("cv-px"),
      rem = $("cv-rem"),
      em = $("cv-em");
    if (!base || !px) return;
    function b() {
      return parseFloat(base.value) || 16;
    }
    function recalc(src) {
      var v;
      if (src === "px") {
        v = parseFloat(px.value);
        if (isNaN(v)) return;
        rem.value = round(v / b());
        em.value = round(v / b());
      } else if (src === "rem") {
        v = parseFloat(rem.value);
        if (isNaN(v)) return;
        px.value = round(v * b());
        em.value = round(v);
      } else if (src === "em") {
        v = parseFloat(em.value);
        if (isNaN(v)) return;
        px.value = round(v * b());
        rem.value = round(v);
      }
    }
    px.addEventListener("input", function () { recalc("px"); });
    rem.addEventListener("input", function () { recalc("rem"); });
    em.addEventListener("input", function () { recalc("em"); });
    base.addEventListener("input", function () { recalc("px"); });
    px.value = 16;
    recalc("px");
  })();

  /* ----------------------------------------------------- Tailles d'octets */
  (function () {
    var fields = Array.prototype.slice.call(document.querySelectorAll(".cv-bytes"));
    if (!fields.length) return;
    var FACT = [1, 1024, 1024 * 1024, 1024 * 1024 * 1024, 1024 * 1024 * 1024 * 1024];
    function recalc(srcIdx) {
      var v = parseFloat(fields[srcIdx].value);
      if (isNaN(v)) return;
      var bytes = v * FACT[srcIdx];
      fields.forEach(function (f, i) {
        if (i !== srcIdx) f.value = round(bytes / FACT[i]);
      });
    }
    fields.forEach(function (f, i) {
      f.addEventListener("input", function () { recalc(i); });
    });
    fields[2].value = 1; // 1 Mo
    recalc(2);
  })();

  /* --------------------------------------------------------- Timestamps */
  (function () {
    var ms = $("ts-ms"),
      s = $("ts-s"),
      iso = $("ts-iso"),
      loc = $("ts-loc"),
      nowBtn = $("ts-now");
    if (!ms || !iso) return;
    function paint(d) {
      ms.value = d.getTime();
      s.value = Math.floor(d.getTime() / 1000);
      iso.value = d.toISOString();
      loc.value = d.toLocaleString("fr-FR");
    }
    ms.addEventListener("input", function () {
      var v = parseInt(ms.value, 10);
      if (isNaN(v)) return;
      var d = new Date(v);
      if (!isNaN(d.getTime())) {
        s.value = Math.floor(v / 1000);
        iso.value = d.toISOString();
        loc.value = d.toLocaleString("fr-FR");
      }
    });
    s.addEventListener("input", function () {
      var v = parseInt(s.value, 10);
      if (isNaN(v)) return;
      paint(new Date(v * 1000));
    });
    iso.addEventListener("input", function () {
      var d = new Date(iso.value);
      if (!isNaN(d.getTime())) {
        ms.value = d.getTime();
        s.value = Math.floor(d.getTime() / 1000);
        loc.value = d.toLocaleString("fr-FR");
      }
    });
    if (nowBtn) nowBtn.addEventListener("click", function () { paint(new Date()); });
    paint(new Date());
  })();

  /* ------------------------------------------------------------ Couleur */
  (function () {
    var hex = $("cc-hex"),
      pick = $("cc-pick"),
      rgbOut = $("cc-rgb"),
      hslOut = $("cc-hsl");
    if (!hex || !pick) return;
    function hexToRgb(h) {
      h = String(h).replace(/[^0-9a-fA-F]/g, "");
      if (h.length === 3) h = h.charAt(0) + h.charAt(0) + h.charAt(1) + h.charAt(1) + h.charAt(2) + h.charAt(2);
      if (h.length !== 6) return null;
      var n = parseInt(h, 16);
      return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
    }
    function rgbToHsl(r, g, b) {
      r /= 255;
      g /= 255;
      b /= 255;
      var max = Math.max(r, g, b),
        min = Math.min(r, g, b),
        h = 0,
        s = 0,
        l = (max + min) / 2;
      if (max !== min) {
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        if (max === r) h = (g - b) / d + (g < b ? 6 : 0);
        else if (max === g) h = (b - r) / d + 2;
        else h = (r - g) / d + 4;
        h /= 6;
      }
      return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
    }
    function update(h) {
      var rgb = hexToRgb(h);
      if (!rgb) return;
      var hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
      rgbOut.value = "rgb(" + rgb.r + ", " + rgb.g + ", " + rgb.b + ")";
      hslOut.value = "hsl(" + hsl.h + ", " + hsl.s + "%, " + hsl.l + "%)";
      var norm = "#" + [rgb.r, rgb.g, rgb.b].map(function (x) {
        var s = x.toString(16);
        return s.length < 2 ? "0" + s : s;
      }).join("");
      pick.value = norm;
    }
    hex.addEventListener("input", function () { update(hex.value); });
    pick.addEventListener("input", function () {
      hex.value = pick.value;
      update(pick.value);
    });
    update(hex.value);
  })();
})();
