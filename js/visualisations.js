/* =============================================================================
   visualisations.js — Visualiseur d'algos animés (P9 + R4). Tris (bulles,
   sélection, insertion, rapide, fusion) et recherche binaire : on instrumente
   l'algo (liste d'étapes) puis on rejoue l'animation sur des barres. SVG/DOM
   maison, aucune lib. 100 % statique. Page : pages/visualisations.html.
   Étapes : cmp(i,j) · swap(i,j) · set(i,val) · sorted(i) · allSorted ·
            target(val) · range(lo,hi) · mid(i) · found(i)  (R4).
   ============================================================================= */
(function () {
  "use strict";

  var barsEl = document.getElementById("viz-bars");
  var algoSel = document.getElementById("viz-algo");
  var speedEl = document.getElementById("viz-speed");
  var shuffleBtn = document.getElementById("viz-shuffle");
  var runBtn = document.getElementById("viz-run");
  var descEl = document.getElementById("viz-desc");
  var statsEl = document.getElementById("viz-stats");
  if (!barsEl || !runBtn || !algoSel) return;

  var N = 34;
  var display = [];
  var barEls = [];
  var steps = [];
  var stepIdx = 0;
  var timer = null;
  var comparisons = 0;
  var swaps = 0;
  var running = false;
  var sorted = {};
  var dimmed = {};
  var target = null;

  /* ------------------------------------------------------------- Tris O(n²) */
  function genBubble(a) {
    var st = [];
    for (var i = 0; i < a.length; i++) {
      for (var j = 0; j < a.length - 1 - i; j++) {
        st.push({ t: "cmp", i: j, j: j + 1 });
        if (a[j] > a[j + 1]) {
          var x = a[j];
          a[j] = a[j + 1];
          a[j + 1] = x;
          st.push({ t: "swap", i: j, j: j + 1 });
        }
      }
      st.push({ t: "sorted", i: a.length - 1 - i });
    }
    return st;
  }
  function genSelection(a) {
    var st = [];
    for (var i = 0; i < a.length; i++) {
      var min = i;
      for (var j = i + 1; j < a.length; j++) {
        st.push({ t: "cmp", i: min, j: j });
        if (a[j] < a[min]) min = j;
      }
      if (min !== i) {
        var x = a[i];
        a[i] = a[min];
        a[min] = x;
        st.push({ t: "swap", i: i, j: min });
      }
      st.push({ t: "sorted", i: i });
    }
    return st;
  }
  function genInsertion(a) {
    var st = [];
    for (var i = 1; i < a.length; i++) {
      var j = i;
      while (j > 0) {
        st.push({ t: "cmp", i: j - 1, j: j });
        if (a[j - 1] > a[j]) {
          var x = a[j - 1];
          a[j - 1] = a[j];
          a[j] = x;
          st.push({ t: "swap", i: j - 1, j: j });
          j--;
        } else {
          break;
        }
      }
    }
    st.push({ t: "allSorted" });
    return st;
  }

  /* ------------------------------------------------------ Tri rapide (Lomuto) */
  function genQuick(a) {
    var st = [];
    function swap(i, j) {
      var x = a[i];
      a[i] = a[j];
      a[j] = x;
      st.push({ t: "swap", i: i, j: j });
    }
    function part(lo, hi) {
      var pivot = a[hi];
      var i = lo;
      for (var j = lo; j < hi; j++) {
        st.push({ t: "cmp", i: j, j: hi });
        if (a[j] < pivot) {
          if (i !== j) swap(i, j);
          i++;
        }
      }
      if (i !== hi) swap(i, hi);
      st.push({ t: "sorted", i: i });
      return i;
    }
    function sort(lo, hi) {
      if (lo > hi) return;
      if (lo === hi) {
        st.push({ t: "sorted", i: lo });
        return;
      }
      var p = part(lo, hi);
      sort(lo, p - 1);
      sort(p + 1, hi);
    }
    sort(0, a.length - 1);
    st.push({ t: "allSorted" });
    return st;
  }

  /* ----------------------------------------------------- Tri fusion (top-down) */
  function genMerge(a) {
    var st = [];
    var aux = a.slice();
    function merge(lo, mid, hi) {
      for (var k = lo; k <= hi; k++) aux[k] = a[k];
      var i = lo,
        j = mid + 1;
      for (var k2 = lo; k2 <= hi; k2++) {
        if (i > mid) {
          a[k2] = aux[j++];
        } else if (j > hi) {
          a[k2] = aux[i++];
        } else {
          st.push({ t: "cmp", i: i, j: j });
          if (aux[j] < aux[i]) a[k2] = aux[j++];
          else a[k2] = aux[i++];
        }
        st.push({ t: "set", i: k2, val: a[k2] });
      }
    }
    function sort(lo, hi) {
      if (lo >= hi) return;
      var mid = Math.floor((lo + hi) / 2);
      sort(lo, mid);
      sort(mid + 1, hi);
      merge(lo, mid, hi);
    }
    sort(0, a.length - 1);
    st.push({ t: "allSorted" });
    return st;
  }

  /* --------------------------------------------------------- Recherche binaire */
  function genBinary(a) {
    var st = [];
    var cible = a[Math.floor(Math.random() * a.length)];
    st.push({ t: "target", val: cible });
    var lo = 0,
      hi = a.length - 1;
    while (lo <= hi) {
      st.push({ t: "range", lo: lo, hi: hi });
      var mid = Math.floor((lo + hi) / 2);
      st.push({ t: "mid", i: mid });
      if (a[mid] === cible) {
        st.push({ t: "found", i: mid });
        break;
      } else if (a[mid] < cible) {
        lo = mid + 1;
      } else {
        hi = mid - 1;
      }
    }
    return st;
  }

  var ALGOS = {
    bubble: { gen: genBubble, desc: "Tri à bulles — on compare deux voisins et on les échange si l'ordre est mauvais ; les grandes valeurs « remontent » comme des bulles. Simple mais lent (O(n²))." },
    selection: { gen: genSelection, desc: "Tri par sélection — à chaque tour, on cherche le minimum du reste et on le place au début. Peu d'échanges, beaucoup de comparaisons (O(n²))." },
    insertion: { gen: genInsertion, desc: "Tri par insertion — on insère chaque élément à sa place dans la partie déjà triée, comme on range des cartes en main. Efficace sur des données presque triées." },
    quick: { gen: genQuick, desc: "Tri rapide — on choisit un pivot et on range autour de lui les plus petits à gauche, les plus grands à droite, puis on recommence sur chaque moitié. Rapide en moyenne (O(n log n))." },
    merge: { gen: genMerge, desc: "Tri fusion — on coupe en deux récursivement jusqu'à des morceaux d'un élément, puis on fusionne les moitiés triées. Régulier et stable (O(n log n))." },
    binary: { gen: genBinary, presort: true, desc: "Recherche binaire — sur un tableau TRIÉ, on regarde l'élément du milieu et on élimine la moitié où la cible ne peut pas être. On divise par deux à chaque étape (O(log n))." },
  };

  function rand() {
    return Math.floor(Math.random() * 92) + 8;
  }
  function buildBars() {
    barsEl.innerHTML = "";
    barEls = [];
    for (var i = 0; i < N; i++) {
      var d = document.createElement("div");
      d.className = "viz-bar";
      d.style.height = display[i] + "%";
      barsEl.appendChild(d);
      barEls.push(d);
    }
  }
  function paint(hi, hj) {
    for (var k = 0; k < N; k++) {
      var b = barEls[k];
      b.style.height = display[k] + "%";
      var cls = "viz-bar";
      if (sorted[k]) cls += " is-sorted";
      else if (k === hi || k === hj) cls += " is-active";
      else if (dimmed[k]) cls += " is-dim";
      b.className = cls;
    }
  }
  function updateStats() {
    if (target !== null) {
      statsEl.textContent = "Cible : " + target + " · " + comparisons + " comparaisons";
    } else {
      statsEl.textContent = comparisons + " comparaisons · " + swaps + " échanges";
    }
  }

  function stop() {
    running = false;
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
  }
  function newArray() {
    stop();
    display = [];
    for (var i = 0; i < N; i++) display.push(rand());
    sorted = {};
    dimmed = {};
    target = null;
    steps = [];
    stepIdx = 0;
    comparisons = 0;
    swaps = 0;
    buildBars();
    paint();
    updateStats();
    runBtn.textContent = "Lancer";
  }
  function delay() {
    var v = parseInt(speedEl.value, 10) || 50;
    return Math.max(2, 105 - v);
  }

  function tick() {
    if (!running) return;
    if (stepIdx >= steps.length) {
      finish();
      return;
    }
    var s = steps[stepIdx++];
    if (s.t === "cmp") {
      comparisons++;
      paint(s.i, s.j);
    } else if (s.t === "swap") {
      swaps++;
      var x = display[s.i];
      display[s.i] = display[s.j];
      display[s.j] = x;
      paint(s.i, s.j);
    } else if (s.t === "set") {
      swaps++;
      display[s.i] = s.val;
      paint(s.i);
    } else if (s.t === "sorted") {
      sorted[s.i] = true;
      paint();
    } else if (s.t === "allSorted") {
      for (var k = 0; k < N; k++) sorted[k] = true;
      paint();
    } else if (s.t === "target") {
      target = s.val;
    } else if (s.t === "range") {
      dimmed = {};
      for (var k2 = 0; k2 < N; k2++) if (k2 < s.lo || k2 > s.hi) dimmed[k2] = true;
      paint();
    } else if (s.t === "mid") {
      comparisons++;
      paint(s.i);
    } else if (s.t === "found") {
      sorted[s.i] = true;
      paint(s.i);
    }
    updateStats();
    timer = window.setTimeout(tick, delay());
  }
  function finish() {
    stop();
    if (ALGOS[algoSel.value].presort) {
      dimmed = {}; // recherche finie : on ré-affiche tout, la cible reste en vert
    } else {
      for (var k = 0; k < N; k++) sorted[k] = true;
    }
    paint();
    runBtn.textContent = "Recommencer";
  }

  function start() {
    if (running) {
      stop();
      runBtn.textContent = "Reprendre";
      return;
    }
    if (steps.length && stepIdx >= steps.length) {
      newArray(); // animation terminée → on re-mélange
    }
    if (!steps.length || stepIdx >= steps.length) {
      var algo = ALGOS[algoSel.value];
      sorted = {};
      dimmed = {};
      target = null;
      comparisons = 0;
      swaps = 0;
      if (algo.presort) {
        display.sort(function (a, b) {
          return a - b;
        });
        buildBars();
        paint();
      }
      steps = algo.gen(display.slice());
      stepIdx = 0;
    }
    running = true;
    runBtn.textContent = "Pause";
    tick();
  }

  function setDesc() {
    descEl.textContent = ALGOS[algoSel.value].desc;
  }

  algoSel.addEventListener("change", function () {
    setDesc();
    newArray();
  });
  shuffleBtn.addEventListener("click", newArray);
  runBtn.addEventListener("click", start);

  setDesc();
  newArray();
})();
