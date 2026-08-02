/* =============================================================================
   outils.js — Boîte à outils du développeur (R1, Lot 3). Six mini-outils
   autonomes : formateur JSON, Base64, encodage d'URL, convertisseur de bases,
   compteur de texte, générateur de mot de passe. 100 % côté client, file://.
   Page : pages/outils.html.
   ============================================================================= */
(function () {
  "use strict";

  function $(id) {
    return document.getElementById(id);
  }
  function show(el, txt) {
    if (!el) return;
    el.hidden = false;
    el.textContent = txt;
  }
  function msg(el, txt, ok) {
    if (!el) return;
    el.textContent = txt || "";
    el.className = "tool-msg" + (txt ? (ok ? " is-ok" : " is-err") : "");
  }

  /* ----------------------------------------------------------- Formateur JSON */
  (function () {
    var inp = $("json-in"), out = $("json-out"), m = $("json-msg");
    if (!inp) return;
    function run(indent) {
      var raw = inp.value.trim();
      if (!raw) {
        msg(m, "Colle d'abord du JSON.", false);
        out.hidden = true;
        return;
      }
      try {
        var obj = JSON.parse(raw);
        show(out, JSON.stringify(obj, null, indent ? 2 : 0));
        msg(m, "JSON valide ✓", true);
      } catch (e) {
        out.hidden = true;
        msg(m, "JSON invalide : " + e.message, false);
      }
    }
    $("json-format").addEventListener("click", function () {
      run(true);
    });
    $("json-min").addEventListener("click", function () {
      run(false);
    });
  })();

  /* ----------------------------------------------------------------- Base64 */
  (function () {
    var inp = $("b64-in"), out = $("b64-out"), m = $("b64-msg");
    if (!inp) return;
    function enc(s) {
      var bytes = new TextEncoder().encode(s);
      var bin = "";
      for (var i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
      return btoa(bin);
    }
    function dec(s) {
      var bin = atob(s.replace(/\s+/g, ""));
      var bytes = new Uint8Array(bin.length);
      for (var i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
      return new TextDecoder().decode(bytes);
    }
    $("b64-enc").addEventListener("click", function () {
      if (!inp.value) {
        msg(m, "Saisis du texte.", false);
        return;
      }
      try {
        show(out, enc(inp.value));
        msg(m, "Encodé ✓", true);
      } catch (e) {
        out.hidden = true;
        msg(m, "Erreur : " + e.message, false);
      }
    });
    $("b64-dec").addEventListener("click", function () {
      try {
        show(out, dec(inp.value));
        msg(m, "Décodé ✓", true);
      } catch (e) {
        out.hidden = true;
        msg(m, "Ce n'est pas du Base64 valide.", false);
      }
    });
  })();

  /* -------------------------------------------------------------------- URL */
  (function () {
    var inp = $("url-in"), out = $("url-out"), m = $("url-msg");
    if (!inp) return;
    $("url-enc").addEventListener("click", function () {
      show(out, encodeURIComponent(inp.value));
      msg(m, "Encodé ✓", true);
    });
    $("url-dec").addEventListener("click", function () {
      try {
        show(out, decodeURIComponent(inp.value));
        msg(m, "Décodé ✓", true);
      } catch (e) {
        out.hidden = true;
        msg(m, "Séquence d'échappement invalide.", false);
      }
    });
  })();

  /* --------------------------------------------------------- Bases numériques */
  (function () {
    var inp = $("base-in"), from = $("base-from"), out = $("base-out"), m = $("base-msg");
    if (!inp) return;
    function run() {
      var raw = inp.value.trim();
      if (!raw) {
        out.hidden = true;
        msg(m, "");
        return;
      }
      var base = parseInt(from.value, 10);
      var n = parseInt(raw, base);
      var re = { 2: /^[01]+$/, 8: /^[0-7]+$/, 10: /^-?\d+$/, 16: /^[0-9a-fA-F]+$/ }[base];
      if (isNaN(n) || (re && !re.test(raw))) {
        out.hidden = true;
        msg(m, "Nombre invalide pour cette base.", false);
        return;
      }
      msg(m, "");
      out.hidden = false;
      $("base-2").textContent = n.toString(2);
      $("base-8").textContent = n.toString(8);
      $("base-10").textContent = n.toString(10);
      $("base-16").textContent = n.toString(16).toUpperCase();
    }
    inp.addEventListener("input", run);
    from.addEventListener("change", run);
  })();

  /* --------------------------------------------------------- Compteur de texte */
  (function () {
    var inp = $("count-in");
    if (!inp) return;
    function run() {
      var v = inp.value;
      $("count-chars").textContent = v.length;
      var words = v.trim() ? v.trim().split(/\s+/).length : 0;
      $("count-words").textContent = words;
      $("count-lines").textContent = v === "" ? 0 : v.split(/\n/).length;
    }
    inp.addEventListener("input", run);
    run();
  })();

  /* ------------------------------------------------------ Générateur de mot de passe */
  (function () {
    var len = $("pwd-len"), label = $("pwd-len-label"), out = $("pwd-out");
    if (!len) return;
    var LOWER = "abcdefghijkmnopqrstuvwxyz";
    var UPPER = "ABCDEFGHJKLMNPQRSTUVWXYZ";
    var DIGIT = "23456789";
    var SYM = "!@#$%^&*()-_=+?";
    function gen() {
      var pool = LOWER;
      if ($("pwd-maj").checked) pool += UPPER;
      if ($("pwd-num").checked) pool += DIGIT;
      if ($("pwd-sym").checked) pool += SYM;
      var n = parseInt(len.value, 10);
      var pwd = "";
      for (var i = 0; i < n; i++) pool && (pwd += pool.charAt(Math.floor(Math.random() * pool.length)));
      out.textContent = pwd;
    }
    len.addEventListener("input", function () {
      label.textContent = len.value;
    });
    $("pwd-gen").addEventListener("click", gen);
    $("pwd-copy").addEventListener("click", function () {
      if (!out.textContent) return;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(out.textContent).then(
          function () {
            out.setAttribute("data-copied", "Copié !");
          },
          function () {}
        );
      }
    });
    gen();
  })();
})();
