/* =============================================================================
   couleurs.js — Studio de couleurs (S2, Lot 4). Conversion hex ↔ rgb ↔ hsl,
   génération de teintes, et vérificateur de contraste WCAG (ratio + AA/AAA).
   Calculs maison (luminance relative sRGB). 100 % file://.
   Page : pages/couleurs.html.
   ============================================================================= */
(function () {
  "use strict";

  function $(id) {
    return document.getElementById(id);
  }
  var picker = $("col-picker");
  var hexIn = $("col-hex");
  var outHex = $("out-hex");
  var outRgb = $("out-rgb");
  var outHsl = $("out-hsl");
  var shadesEl = $("col-shades");
  var fg = $("ct-fg");
  var bg = $("ct-bg");
  var preview = $("ct-preview");
  var ratioEl = $("ct-ratio");
  var verdictsEl = $("ct-verdicts");
  if (!picker || !fg) return;

  function clamp(v, a, b) {
    return Math.max(a, Math.min(b, v));
  }
  function hexToRgb(hex) {
    hex = String(hex).replace(/[^0-9a-fA-F]/g, "");
    if (hex.length === 3)
      hex = hex.charAt(0) + hex.charAt(0) + hex.charAt(1) + hex.charAt(1) + hex.charAt(2) + hex.charAt(2);
    if (hex.length !== 6) return null;
    var n = parseInt(hex, 16);
    return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
  }
  function rgbToHex(r, g, b) {
    return (
      "#" +
      [r, g, b]
        .map(function (x) {
          var h = clamp(Math.round(x), 0, 255).toString(16);
          return h.length < 2 ? "0" + h : h;
        })
        .join("")
    );
  }
  function rgbToHsl(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;
    var max = Math.max(r, g, b);
    var min = Math.min(r, g, b);
    var h = 0;
    var s = 0;
    var l = (max + min) / 2;
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
  function hslToRgb(h, s, l) {
    h /= 360;
    s /= 100;
    l /= 100;
    var r, g, b;
    if (s === 0) {
      r = g = b = l;
    } else {
      var hue2rgb = function (p, q, t) {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      };
      var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      var p = 2 * l - q;
      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }
    return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
  }
  function luminance(c) {
    var a = [c.r, c.g, c.b].map(function (v) {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
  }
  function contrast(c1, c2) {
    var l1 = luminance(c1);
    var l2 = luminance(c2);
    var hi = Math.max(l1, l2);
    var lo = Math.min(l1, l2);
    return (hi + 0.05) / (lo + 0.05);
  }

  function updateConvert(hex) {
    var rgb = hexToRgb(hex);
    if (!rgb) return;
    var norm = rgbToHex(rgb.r, rgb.g, rgb.b);
    var hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    outHex.textContent = norm.toUpperCase();
    outRgb.textContent = "rgb(" + rgb.r + ", " + rgb.g + ", " + rgb.b + ")";
    outHsl.textContent = "hsl(" + hsl.h + ", " + hsl.s + "%, " + hsl.l + "%)";
    picker.value = norm;

    var levels = [92, 82, 70, 58, 46, 34, 24, 16];
    shadesEl.innerHTML = levels
      .map(function (L) {
        var c = hslToRgb(hsl.h, hsl.s, L);
        var hx = rgbToHex(c.r, c.g, c.b);
        return (
          '<button type="button" class="col-shade" data-hex="' + hx + '" style="background:' + hx +
          '" title="' + hx.toUpperCase() + '" aria-label="' + hx.toUpperCase() + '"></button>'
        );
      })
      .join("");
    var sh = shadesEl.querySelectorAll(".col-shade");
    for (var i = 0; i < sh.length; i++) {
      sh[i].addEventListener("click", function () {
        setColor(this.getAttribute("data-hex"));
      });
    }
  }
  function setColor(hex) {
    hexIn.value = hex.toUpperCase();
    updateConvert(hex);
  }

  function verdict(label, ok) {
    return '<li class="' + (ok ? "is-pass" : "is-fail") + '">' + (ok ? "✓" : "✗") + " " + label + "</li>";
  }
  function updateContrast() {
    var c1 = hexToRgb(fg.value);
    var c2 = hexToRgb(bg.value);
    if (!c1 || !c2) return;
    preview.style.color = fg.value;
    preview.style.background = bg.value;
    var ratio = contrast(c1, c2);
    var r = Math.round(ratio * 100) / 100;
    ratioEl.textContent = "Ratio de contraste : " + r + " : 1";
    verdictsEl.innerHTML =
      verdict("AA — texte normal (≥ 4.5)", ratio >= 4.5) +
      verdict("AA — grand texte (≥ 3)", ratio >= 3) +
      verdict("AAA — texte normal (≥ 7)", ratio >= 7) +
      verdict("AAA — grand texte (≥ 4.5)", ratio >= 4.5);
  }

  picker.addEventListener("input", function () {
    setColor(picker.value);
  });
  hexIn.addEventListener("input", function () {
    if (hexToRgb(hexIn.value)) updateConvert(hexIn.value);
  });
  fg.addEventListener("input", updateContrast);
  bg.addEventListener("input", updateContrast);

  updateConvert(hexIn.value);
  updateContrast();
})();
