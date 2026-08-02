/* =============================================================================
   expression.js — Évaluateur d'expressions (S3, Lot 4). Tokenise une expression
   arithmétique/booléenne, la convertit en notation postfixe (algorithme
   shunting-yard de Dijkstra) et l'évalue étape par étape. AUCUN `eval`.
   100 % file://. Page : pages/expression.html.
   ============================================================================= */
(function () {
  "use strict";

  var input = document.getElementById("expr-input");
  var resultEl = document.getElementById("expr-result");
  var errEl = document.getElementById("expr-err");
  var detailEl = document.getElementById("expr-detail");
  if (!input || !resultEl) return;

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }
  function fmt(v) {
    if (typeof v === "boolean") return v ? "true" : "false";
    if (typeof v === "number" && !isFinite(v)) return String(v);
    return String(Math.round(v * 1e10) / 1e10);
  }

  var OPS = ["**", "==", "!=", "<=", ">=", "&&", "||", "+", "-", "*", "/", "%", "(", ")", "<", ">", "!"];
  var PREC = {
    "u-": 8, "!": 8, "**": 7, "*": 6, "/": 6, "%": 6, "+": 5, "-": 5,
    "<": 4, ">": 4, "<=": 4, ">=": 4, "==": 3, "!=": 3, "&&": 2, "||": 1,
  };
  var RIGHT = { "**": true, "u-": true, "!": true };

  function tokenize(s) {
    var tokens = [];
    var i = 0;
    while (i < s.length) {
      var ch = s.charAt(i);
      if (/\s/.test(ch)) {
        i++;
        continue;
      }
      if (/[0-9.]/.test(ch)) {
        var num = "";
        while (i < s.length && /[0-9.]/.test(s.charAt(i))) {
          num += s.charAt(i);
          i++;
        }
        var val = parseFloat(num);
        if (isNaN(val)) throw new Error("Nombre invalide : " + num);
        tokens.push({ type: "num", value: val });
        continue;
      }
      if (/[a-zA-Z]/.test(ch)) {
        var word = "";
        while (i < s.length && /[a-zA-Z]/.test(s.charAt(i))) {
          word += s.charAt(i);
          i++;
        }
        if (word === "true") tokens.push({ type: "num", value: true });
        else if (word === "false") tokens.push({ type: "num", value: false });
        else throw new Error("Mot inconnu : " + word);
        continue;
      }
      var matched = null;
      for (var o = 0; o < OPS.length; o++) {
        if (s.substr(i, OPS[o].length) === OPS[o]) {
          matched = OPS[o];
          break;
        }
      }
      if (matched) {
        tokens.push({ type: "op", value: matched });
        i += matched.length;
        continue;
      }
      throw new Error("Caractère inattendu : " + ch);
    }
    if (!tokens.length) throw new Error("Expression vide");
    return tokens;
  }

  function toRPN(tokens) {
    var output = [];
    var stack = [];
    var prev = null;
    tokens.forEach(function (t) {
      if (t.type === "num") {
        output.push(t);
        prev = t;
        return;
      }
      var op = t.value;
      if (op === "(") {
        stack.push("(");
        prev = { type: "op", value: "(" };
        return;
      }
      if (op === ")") {
        while (stack.length && stack[stack.length - 1] !== "(") output.push({ type: "op", value: stack.pop() });
        if (!stack.length) throw new Error("Parenthèse fermante en trop");
        stack.pop();
        prev = { type: "op", value: ")" };
        return;
      }
      if (op === "-" && (prev === null || (prev.type === "op" && prev.value !== ")"))) op = "u-";
      while (stack.length && stack[stack.length - 1] !== "(") {
        var o2 = stack[stack.length - 1];
        if ((!RIGHT[op] && PREC[op] <= PREC[o2]) || (RIGHT[op] && PREC[op] < PREC[o2])) {
          output.push({ type: "op", value: stack.pop() });
        } else break;
      }
      stack.push(op);
      prev = { type: "op", value: op };
    });
    while (stack.length) {
      var o = stack.pop();
      if (o === "(") throw new Error("Parenthèse ouvrante en trop");
      output.push({ type: "op", value: o });
    }
    return output;
  }

  function apply(op, a, b) {
    switch (op) {
      case "+": return a + b;
      case "-": return a - b;
      case "*": return a * b;
      case "/": return a / b;
      case "%": return a % b;
      case "**": return Math.pow(a, b);
      case "<": return a < b;
      case ">": return a > b;
      case "<=": return a <= b;
      case ">=": return a >= b;
      case "==": return a === b;
      case "!=": return a !== b;
      case "&&": return a && b;
      case "||": return a || b;
      default: throw new Error("Opérateur inconnu : " + op);
    }
  }
  function evalRPN(rpn) {
    var stack = [];
    var steps = [];
    rpn.forEach(function (t) {
      if (t.type === "num") {
        stack.push(t.value);
        return;
      }
      var op = t.value;
      if (op === "u-" || op === "!") {
        if (!stack.length) throw new Error("Opérande manquant pour " + op);
        var x = stack.pop();
        var ru = op === "u-" ? -x : !x;
        stack.push(ru);
        steps.push((op === "u-" ? "-" : "!") + fmt(x) + " = " + fmt(ru));
        return;
      }
      if (stack.length < 2) throw new Error("Opérande manquant pour " + op);
      var b = stack.pop();
      var a = stack.pop();
      var r = apply(op, a, b);
      stack.push(r);
      steps.push(fmt(a) + " " + op + " " + fmt(b) + " = " + fmt(r));
    });
    if (stack.length !== 1) throw new Error("Expression mal formée");
    return { result: stack[0], steps: steps };
  }

  function run() {
    var src = input.value;
    if (!src.trim()) {
      resultEl.textContent = "";
      detailEl.innerHTML = "";
      errEl.textContent = "";
      return;
    }
    try {
      var tokens = tokenize(src);
      var rpn = toRPN(tokens);
      var ev = evalRPN(rpn);
      errEl.textContent = "";
      resultEl.innerHTML = "= <strong>" + esc(fmt(ev.result)) + "</strong>";
      var rpnStr = rpn
        .map(function (t) {
          return t.type === "num" ? fmt(t.value) : t.value;
        })
        .join(" ");
      var stepsHtml = ev.steps.length
        ? '<ol class="expr-steps">' + ev.steps.map(function (s) { return "<li><code>" + esc(s) + "</code></li>"; }).join("") + "</ol>"
        : '<p class="expr-none">Aucune opération (valeur seule).</p>';
      detailEl.innerHTML =
        '<div class="expr-block"><h2>Notation postfixe (RPN)</h2><p class="expr-rpn"><code>' +
        esc(rpnStr) + "</code></p></div>" +
        '<div class="expr-block"><h2>Évaluation étape par étape</h2>' + stepsHtml + "</div>";
    } catch (e) {
      resultEl.textContent = "";
      detailEl.innerHTML = "";
      errEl.textContent = e && e.message ? e.message : String(e);
    }
  }

  input.addEventListener("input", run);
  run();
})();
