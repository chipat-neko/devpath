/* =============================================================================
   revision.js — Flashcards avec répétition espacée (P2).
   Cartes tirées de window.FLASHCARDS (js/flashcards-data.js, généré depuis les
   glossaires des cours). Système de Leitner (5 boîtes) ; échéances en
   localStorage (clé `syntaxe-revision`). 100 % statique, aucun fetch.
   Page : pages/revision.html.
   ============================================================================= */
(function () {
  "use strict";

  var CARDS = window.FLASHCARDS || [];
  var selCourse = document.getElementById("rev-course");
  var cardEl = document.getElementById("rev-card");
  var statsEl = document.getElementById("rev-stats");
  if (!cardEl || !CARDS.length) {
    if (cardEl) cardEl.innerHTML = '<p class="rev-empty">Aucune carte disponible.</p>';
    return;
  }

  var KEY = "syntaxe-revision";
  var DAY = 86400000;
  var INTERVALS = [0, 1, 3, 7, 16]; // jours d'attente par boîte (1 → 5)

  function esc(s) {
    return (s || "").replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }
  function load() {
    try {
      return JSON.parse(localStorage.getItem(KEY) || "{}") || {};
    } catch (e) {
      return {};
    }
  }
  function save() {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch (e) {}
  }
  function cardId(c) {
    return c.c + "|" + c.t;
  }
  function shuffle(a) {
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i];
      a[i] = a[j];
      a[j] = t;
    }
    return a;
  }

  var state = load();
  var filter = "all";
  var queue = [];
  var session = { done: 0, knew: 0 };

  /* Sélecteur de cours (depuis les cartes). */
  (function buildCourseOptions() {
    if (!selCourse) return;
    var seen = {};
    var list = [];
    CARDS.forEach(function (c) {
      if (!seen[c.c]) {
        seen[c.c] = 1;
        list.push({ id: c.c, title: c.ct });
      }
    });
    list.sort(function (a, b) {
      return a.title.localeCompare(b.title, "fr");
    });
    list.forEach(function (o) {
      var opt = document.createElement("option");
      opt.value = o.id;
      opt.textContent = o.title;
      selCourse.appendChild(opt);
    });
    selCourse.addEventListener("change", function () {
      filter = selCourse.value;
      session = { done: 0, knew: 0 };
      buildQueue();
      showCard();
    });
  })();

  function due(c) {
    var s = state[cardId(c)];
    return !s || !s.due || s.due <= Date.now();
  }

  function buildQueue() {
    var pool = CARDS.filter(function (c) {
      return filter === "all" || c.c === filter;
    });
    var dues = pool.filter(due);
    if (dues.length) {
      queue = shuffle(dues.slice());
    } else {
      // Tout est à jour : révision libre, des échéances les plus proches d'abord.
      queue = pool.slice().sort(function (a, b) {
        var da = (state[cardId(a)] && state[cardId(a)].due) || 0;
        var db = (state[cardId(b)] && state[cardId(b)].due) || 0;
        return da - db;
      });
    }
  }

  function renderStats() {
    if (!statsEl) return;
    var pool = CARDS.filter(function (c) {
      return filter === "all" || c.c === filter;
    });
    var remaining = pool.filter(due).length;
    statsEl.textContent =
      session.done +
      " révisée" + (session.done > 1 ? "s" : "") +
      " · " + session.knew + " sue" + (session.knew > 1 ? "s" : "") +
      " · " + remaining + " à revoir";
  }

  function showCard() {
    renderStats();
    if (!queue.length) buildQueue();
    if (!queue.length) {
      cardEl.innerHTML = '<p class="rev-empty">Aucune carte pour ce choix.</p>';
      return;
    }
    var card = queue[0];
    cardEl.className = "rev-card";
    cardEl.innerHTML =
      '<span class="rev-card__course">' + esc(card.ct) + "</span>" +
      '<span class="rev-card__term">' + esc(card.t) + "</span>" +
      '<button type="button" class="btn btn--secondary" id="rev-flip">Voir la définition</button>';
    var flip = document.getElementById("rev-flip");
    if (flip) flip.addEventListener("click", function () { reveal(card); });
  }

  function reveal(card) {
    cardEl.className = "rev-card is-flipped";
    cardEl.innerHTML =
      '<span class="rev-card__course">' + esc(card.ct) + "</span>" +
      '<span class="rev-card__term">' + esc(card.t) + "</span>" +
      '<div class="rev-card__def">' + card.d + "</div>" +
      '<div class="rev-card__actions">' +
      '<button type="button" class="btn btn--ghost" id="rev-again">À revoir</button>' +
      '<button type="button" class="btn btn--primary" id="rev-knew">Je savais ✓</button>' +
      "</div>";
    var again = document.getElementById("rev-again");
    var knew = document.getElementById("rev-knew");
    if (again) again.addEventListener("click", function () { answer(card, false); });
    if (knew) knew.addEventListener("click", function () { answer(card, true); });
  }

  function answer(card, knew) {
    var id = cardId(card);
    var s = state[id] || { box: 1 };
    if (knew) {
      s.box = Math.min(5, (s.box || 1) + 1);
      session.knew++;
    } else {
      s.box = 1;
    }
    s.due = Date.now() + INTERVALS[s.box - 1] * DAY;
    state[id] = s;
    save();
    session.done++;
    queue.shift();
    showCard();
  }

  buildQueue();
  showCard();
})();
