/* =============================================================================
   structures.js — Visualiseur de structures de données (R3, Lot 3). Pile (LIFO),
   file (FIFO), liste chaînée et arbre binaire de recherche, manipulables et
   rendus en DOM/SVG maison. 100 % file://. Page : pages/structures.html.
   ============================================================================= */
(function () {
  "use strict";

  var tabsEl = document.getElementById("ds-tabs");
  var descEl = document.getElementById("ds-desc");
  var controlsEl = document.getElementById("ds-controls");
  var noteEl = document.getElementById("ds-note");
  var stageEl = document.getElementById("ds-stage");
  if (!tabsEl || !stageEl) return;

  var STRUCTS = [
    { id: "stack", label: "Pile (LIFO)", desc: "Une pile fonctionne en « dernier entré, premier sorti » : on empile et on dépile par le même bout, le sommet." },
    { id: "queue", label: "File (FIFO)", desc: "Une file fonctionne en « premier entré, premier sorti » : on enfile par la queue, on défile par la tête." },
    { id: "list", label: "Liste chaînée", desc: "Chaque maillon contient une valeur et un lien vers le suivant. On insère ou retire en rebranchant les liens." },
    { id: "tree", label: "Arbre binaire de recherche", desc: "Chaque nœud a au plus deux enfants : à gauche les valeurs plus petites, à droite les plus grandes. La lecture infixe donne l'ordre croissant." },
  ];

  var CONTROLS = {
    stack: [["push", "Empiler", "p"], ["pop", "Dépiler", "s"], ["clear", "Vider", "g"]],
    queue: [["enqueue", "Enfiler", "p"], ["dequeue", "Défiler", "s"], ["clear", "Vider", "g"]],
    list: [["prepend", "Ajouter en tête", "p"], ["append", "Ajouter en queue", "p"], ["removeHead", "Retirer la tête", "s"], ["clear", "Vider", "g"]],
    tree: [["insert", "Insérer", "p"], ["insertRand", "Insérer au hasard", "s"], ["clear", "Vider", "g"]],
  };

  var current = "stack";
  var data = { stack: [], queue: [], list: [], tree: null };

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }
  function note(t) {
    noteEl.textContent = t || "";
  }
  function randVal() {
    return Math.floor(Math.random() * 99) + 1;
  }
  function readVal() {
    var inp = document.getElementById("ds-val");
    var v = inp && inp.value !== "" ? parseInt(inp.value, 10) : NaN;
    if (isNaN(v)) v = randVal();
    if (inp) inp.value = "";
    return v;
  }

  function renderTabs() {
    tabsEl.innerHTML = STRUCTS.map(function (s) {
      return (
        '<button type="button" aria-pressed="' + (s.id === current ? "true" : "false") +
        '" class="ds-tab' + (s.id === current ? " is-active" : "") +
        '" data-id="' + s.id + '">' + esc(s.label) + "</button>"
      );
    }).join("");
    tabsEl.querySelectorAll("[data-id]").forEach(function (b) {
      b.addEventListener("click", function () {
        selectStruct(b.getAttribute("data-id"));
      });
    });
  }

  function renderControls() {
    var btns = CONTROLS[current]
      .map(function (c) {
        var variant = c[2] === "g" ? "btn--ghost" : c[2] === "s" ? "btn--secondary" : "btn--primary";
        return '<button type="button" class="btn btn--sm ' + variant + '" data-op="' + c[0] + '">' + esc(c[1]) + "</button>";
      })
      .join("");
    controlsEl.innerHTML =
      '<input class="ds-val" id="ds-val" type="number" placeholder="valeur (vide = au hasard)" aria-label="Valeur" />' +
      '<div class="ds-btns">' + btns + "</div>";
    controlsEl.querySelectorAll("[data-op]").forEach(function (b) {
      b.addEventListener("click", function () {
        op(b.getAttribute("data-op"));
      });
    });
  }

  function insertBST(val) {
    function ins(node) {
      if (!node) return { value: val, left: null, right: null };
      if (val < node.value) node.left = ins(node.left);
      else if (val > node.value) node.right = ins(node.right);
      return node; // doublon ignoré
    }
    data.tree = ins(data.tree);
  }

  function op(name) {
    if (name === "clear") {
      data[current] = current === "tree" ? null : [];
      note("Structure vidée.");
      renderStage();
      return;
    }
    var v;
    if (current === "stack") {
      if (name === "push") {
        v = readVal();
        data.stack.push(v);
        note("Empilé : " + v);
      } else if (name === "pop") {
        if (!data.stack.length) note("La pile est vide.");
        else note("Dépilé : " + data.stack.pop());
      }
    } else if (current === "queue") {
      if (name === "enqueue") {
        v = readVal();
        data.queue.push(v);
        note("Enfilé : " + v);
      } else if (name === "dequeue") {
        if (!data.queue.length) note("La file est vide.");
        else note("Défilé : " + data.queue.shift());
      }
    } else if (current === "list") {
      if (name === "prepend") {
        v = readVal();
        data.list.unshift(v);
        note("Ajouté en tête : " + v);
      } else if (name === "append") {
        v = readVal();
        data.list.push(v);
        note("Ajouté en queue : " + v);
      } else if (name === "removeHead") {
        if (!data.list.length) note("La liste est vide.");
        else note("Tête retirée : " + data.list.shift());
      }
    } else if (current === "tree") {
      if (name === "insert") {
        v = readVal();
        insertBST(v);
        note("Inséré : " + v);
      } else if (name === "insertRand") {
        v = randVal();
        insertBST(v);
        note("Inséré au hasard : " + v);
      }
    }
    renderStage();
  }

  /* ---------------------------------------------------------------- Rendus */
  function renderStack() {
    if (!data.stack.length) return '<p class="ds-empty">Pile vide. Empile une valeur.</p>';
    var cells = data.stack
      .slice()
      .reverse()
      .map(function (v, i) {
        return '<div class="ds-cell">' + esc(v) + (i === 0 ? '<span class="ds-tag">sommet</span>' : "") + "</div>";
      })
      .join("");
    return '<div class="ds-stack">' + cells + "</div>";
  }
  function renderQueue() {
    if (!data.queue.length) return '<p class="ds-empty">File vide. Enfile une valeur.</p>';
    var n = data.queue.length;
    var cells = data.queue
      .map(function (v, i) {
        var tag = i === 0 ? '<span class="ds-tag">tête</span>' : i === n - 1 ? '<span class="ds-tag">queue</span>' : "";
        return '<div class="ds-cell">' + esc(v) + tag + "</div>";
      })
      .join('<span class="ds-arrow">→</span>');
    return '<div class="ds-queue">' + cells + "</div>";
  }
  function renderList() {
    if (!data.list.length) return '<p class="ds-empty">Liste vide. Ajoute un maillon.</p>';
    var nodes = data.list
      .map(function (v) {
        return '<div class="ds-node-box"><span class="ds-node-val">' + esc(v) + '</span><span class="ds-node-next">•</span></div>';
      })
      .join('<span class="ds-arrow">→</span>');
    return '<div class="ds-list">' + nodes + '<span class="ds-arrow">→</span><span class="ds-null">null</span></div>';
  }
  function renderTree() {
    if (!data.tree) return '<p class="ds-empty">Arbre vide. Insère une valeur.</p>';
    var nodes = [];
    var xc = 0;
    var maxD = 0;
    (function visit(n, d) {
      if (!n) return;
      visit(n.left, d + 1);
      n._x = xc++;
      n._y = d;
      if (d > maxD) maxD = d;
      nodes.push(n);
      visit(n.right, d + 1);
    })(data.tree, 0);

    var cw = 56, ch = 70, r = 19;
    var W = Math.max(xc * cw, cw), H = (maxD + 1) * ch;
    function cx(n) { return n._x * cw + cw / 2; }
    function cy(n) { return n._y * ch + ch / 2; }
    var edges = "";
    nodes.forEach(function (n) {
      if (n.left) edges += '<line x1="' + cx(n) + '" y1="' + cy(n) + '" x2="' + cx(n.left) + '" y2="' + cy(n.left) + '" class="ds-edge"/>';
      if (n.right) edges += '<line x1="' + cx(n) + '" y1="' + cy(n) + '" x2="' + cx(n.right) + '" y2="' + cy(n.right) + '" class="ds-edge"/>';
    });
    var circles = nodes
      .map(function (n) {
        return (
          '<circle cx="' + cx(n) + '" cy="' + cy(n) + '" r="' + r + '" class="ds-tnode"/>' +
          '<text x="' + cx(n) + '" y="' + (cy(n) + 4) + '" text-anchor="middle" class="ds-tlabel">' + esc(n.value) + "</text>"
        );
      })
      .join("");
    var inorder = nodes.map(function (n) { return n.value; }).join(", ");
    return (
      '<div class="ds-treewrap"><svg viewBox="0 0 ' + W + " " + H + '" class="ds-tree" role="img" aria-label="Arbre binaire de recherche">' +
      edges + circles + "</svg></div>" +
      '<p class="ds-inorder">Lecture infixe (triée) : <code>' + esc(inorder) + "</code></p>"
    );
  }

  function renderStage() {
    stageEl.innerHTML =
      current === "stack" ? renderStack() :
      current === "queue" ? renderQueue() :
      current === "list" ? renderList() : renderTree();
  }

  function selectStruct(id) {
    current = id;
    note("");
    var s = STRUCTS.filter(function (x) { return x.id === id; })[0];
    descEl.textContent = s ? s.desc : "";
    renderTabs();
    renderControls();
    renderStage();
  }

  selectStruct(current);
})();
