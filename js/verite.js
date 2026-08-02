/* =============================================================================
   verite.js — Table de vérité booléenne (T7, Lot 5). Tokenise une expression
   logique (variables + && || ! parenthèses), la convertit en RPN (shunting-yard,
   comme S3) et l'évalue pour toutes les combinaisons → table de vérité.
   AUCUN `eval`. 100 % file://. Page : pages/verite.html.
   ============================================================================= */
(function () {
  "use strict";

  var input = document.getElementById("tv-input");
  var errEl = document.getElementById("tv-err");
  var wrap = document.getElementById("tv-wrap");
  if (!input || !wrap) return;

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }

  var OPS = ["&&", "||", "!", "(", ")"];
  var PREC = { "!": 3, "&&": 2, "||": 1 };
  var RIGHT = { "!": true };

  function tokenize(s) {
    var tokens = [];
    var i = 0;
    while (i < s.length) {
      var ch = s.charAt(i);
      if (/\s/.test(ch)) {
        i++;
        continue;
      }
      if (/[A-Za-z]/.test(ch)) {
        var w = "";
        while (i < s.length && /[A-Za-z]/.test(s.charAt(i))) {
          w += s.charAt(i);
          i++;
        }
        if (w === "true") tokens.push({ t: "lit", v: true });
        else if (w === "false") tokens.push({ t: "lit", v: false });
        else if (w.length === 1) tokens.push({ t: "var", v: w.toUpperCase() });
        else throw new Error("Variable inconnue : « " + w + " » (une seule lettre attendue).");
        continue;
      }
      var m = null;
      for (var o = 0; o < OPS.length; o++) {
        if (s.substr(i, OPS[o].length) === OPS[o]) {
          m = OPS[o];
          break;
        }
      }
      if (m) {
        tokens.push({ t: "op", v: m });
        i += m.length;
        continue;
      }
      throw new Error("Caractère inattendu : « " + ch + " ».");
    }
    if (!tokens.length) throw new Error("Expression vide.");
    return tokens;
  }

  function toRPN(tokens) {
    var out = [];
    var stack = [];
    tokens.forEach(function (t) {
      if (t.t === "var" || t.t === "lit") {
        out.push(t);
        return;
      }
      var op = t.v;
      if (op === "(") {
        stack.push(op);
        return;
      }
      if (op === ")") {
        while (stack.length && stack[stack.length - 1] !== "(") out.push({ t: "op", v: stack.pop() });
        if (!stack.length) throw new Error("Parenthèse fermante en trop.");
        stack.pop();
        return;
      }
      while (stack.length && stack[stack.length - 1] !== "(") {
        var o2 = stack[stack.length - 1];
        if ((!RIGHT[op] && PREC[op] <= PREC[o2]) || (RIGHT[op] && PREC[op] < PREC[o2])) {
          out.push({ t: "op", v: stack.pop() });
        } else break;
      }
      stack.push(op);
    });
    while (stack.length) {
      var o = stack.pop();
      if (o === "(") throw new Error("Parenthèse ouvrante en trop.");
      out.push({ t: "op", v: o });
    }
    return out;
  }

  function evalRPN(rpn, env) {
    var st = [];
    rpn.forEach(function (t) {
      if (t.t === "lit") {
        st.push(t.v);
        return;
      }
      if (t.t === "var") {
        st.push(!!env[t.v]);
        return;
      }
      var op = t.v;
      if (op === "!") {
        if (!st.length) throw new Error("Opérande manquant pour « ! ».");
        st.push(!st.pop());
        return;
      }
      if (st.length < 2) throw new Error("Opérande manquant pour « " + op + " ».");
      var b = st.pop();
      var a = st.pop();
      st.push(op === "&&" ? a && b : a || b);
    });
    if (st.length !== 1) throw new Error("Expression mal formée.");
    return !!st[0];
  }

  function cell(v) {
    return v ? '<td class="tv-v">V</td>' : '<td class="tv-f">F</td>';
  }

  function run() {
    var expr = input.value;
    if (!expr.trim()) {
      wrap.innerHTML = "";
      errEl.textContent = "";
      return;
    }
    try {
      var tokens = tokenize(expr);
      var vars = [];
      tokens.forEach(function (t) {
        if (t.t === "var" && vars.indexOf(t.v) === -1) vars.push(t.v);
      });
      vars.sort();
      if (vars.length > 6) throw new Error("Trop de variables (" + vars.length + ") — 6 au maximum.");
      var rpn = toRPN(tokens);
      // Test à blanc pour détecter les erreurs de structure tôt.
      var probe = {};
      vars.forEach(function (v) {
        probe[v] = false;
      });
      evalRPN(rpn, probe);
      errEl.textContent = "";

      var n = vars.length;
      var combos = Math.pow(2, n);
      var head = "<tr>" + vars.map(function (v) { return "<th>" + esc(v) + "</th>"; }).join("") +
        '<th class="tv-res">' + esc(expr.trim()) + "</th></tr>";
      var body = "";
      var trueCount = 0;
      for (var k = 0; k < combos; k++) {
        var env = {};
        var cells = "";
        for (var j = 0; j < n; j++) {
          var val = !!(k & (1 << (n - 1 - j)));
          env[vars[j]] = val;
          cells += cell(val);
        }
        var res = evalRPN(rpn, env);
        if (res) trueCount++;
        body += '<tr>' + cells + (res ? '<td class="tv-v tv-rescell">V</td>' : '<td class="tv-f tv-rescell">F</td>') + "</tr>";
      }
      wrap.innerHTML =
        '<div class="tv-tablewrap"><table class="tv-table"><thead>' + head + "</thead><tbody>" + body + "</tbody></table></div>" +
        '<p class="tv-summary">' + combos + " combinaison" + (combos > 1 ? "s" : "") + " · vrai " +
        trueCount + " fois, faux " + (combos - trueCount) + " fois.</p>";
    } catch (e) {
      wrap.innerHTML = "";
      errEl.textContent = e && e.message ? e.message : String(e);
    }
  }

  input.addEventListener("input", run);
  run();
})();
