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
    return window.SyntaxeStore.getJSON(KEY, {});
  }
  function save() {
    try {
      /* Relire-avant-écrire : un autre onglet a pu enregistrer sa progression
         entre-temps ; on fusionne par carte pour ne pas l'écraser (cf. C4). */
      var fresh = load();
      for (var k in state) {
        if (Object.prototype.hasOwnProperty.call(state, k)) fresh[k] = state[k];
      }
      state = fresh;
      window.SyntaxeStore.setJSON(KEY, state);
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
  /* ------------------------------- Réviser ce qu'on a lu (V12-D4)
     La révision proposait les 10 678 cartes du site, y compris celles de cours
     jamais ouverts : réviser du vocabulaire qu'on n'a jamais rencontré n'est pas
     de la révision, c'est du bachotage à l'aveugle. Depuis D3, chaque carte
     porte SA leçon : le filtre se fait donc à la leçon, pas au cours.
     Attention : les cartes parlent en DOSSIER (js), la progression en ID de
     cours (javascript). */
  var seulementLues = false;
  var DIR_TO_ID = (function () {
    var m = {};
    var d = window.SITE_DATA;
    if (d && d.content) {
      for (var id in d.content) {
        if (d.content.hasOwnProperty(id)) m[d.content[id].dir] = id;
      }
    }
    return m;
  })();
  function progression() {
    return window.SyntaxeStore ? window.SyntaxeStore.getJSON("syntaxe-progress", {}) : {};
  }
  /* Une carte venant de « cours.html » appartient au cours : elle compte dès
     qu'au moins une leçon du cours est terminée. */
  function estLue(prog, carte) {
    var id = DIR_TO_ID[carte.c];
    if (!id || !prog[id]) return false;
    if (!carte.f || carte.f === "cours.html") return Object.keys(prog[id]).length > 0;
    return !!prog[id][carte.f];
  }
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
      majDispo();
      buildQueue();
      showCard();
    });
  })();

  /* Case « seulement les leçons que j'ai lues » : elle annonce combien de cartes
     restent, et se désactive quand elle en laisserait zéro — cocher une case qui
     vide l'écran sans le dire serait pire que le défaut corrigé. */
  var caseLues = document.getElementById("rev-lues");
  var dispoEl = document.getElementById("rev-dispo");
  function majDispo() {
    if (!caseLues || !dispoEl) return;
    var etait = seulementLues;
    seulementLues = true;
    var n = bassin().length;
    seulementLues = etait;
    dispoEl.textContent = n ? "(" + n + " carte" + (n > 1 ? "s" : "") + ")" : "(aucune leçon lue dans ce choix)";
    caseLues.disabled = n === 0;
    if (n === 0 && caseLues.checked) {
      caseLues.checked = false;
      seulementLues = false;
    }
  }
  if (caseLues) {
    caseLues.addEventListener("change", function () {
      seulementLues = caseLues.checked;
      session = { done: 0, knew: 0 };
      buildQueue();
      showCard();
    });
    majDispo();
  }

  function due(c) {
    var s = state[cardId(c)];
    return !s || !s.due || s.due <= Date.now();
  }

  /* Le bassin de cartes, selon le cours choisi et la case « déjà lues ». */
  function bassin() {
    var prog = seulementLues ? progression() : null;
    return CARDS.filter(function (c) {
      if (filter !== "all" && c.c !== filter) return false;
      if (seulementLues && !estLue(prog, c)) return false;
      return true;
    });
  }

  function buildQueue() {
    var pool = bassin();
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
    var pool = bassin();
    var remaining = pool.filter(due).length;
    statsEl.textContent =
      session.done +
      " révisée" + (session.done > 1 ? "s" : "") +
      " · " + session.knew + " sue" + (session.knew > 1 ? "s" : "") +
      " · " + remaining + " à revoir";
  }

  /* V12-D3 : la carte connaît désormais sa leçon d'origine. Le lien n'apparaît
     QUE sur la face révélée : sur la face question, il donnerait un indice. */
  function sourceHTML(card) {
    if (!card.f || card.f === "cours.html") {
      return '<a class="rev-card__src" href="' + esc(card.c) + '/cours.html">Ouvrir le cours</a>';
    }
    return '<a class="rev-card__src" href="' + esc(card.c) + "/" + esc(card.f) + '">' +
      (card.n ? "Leçon " + esc(card.n) + " — " : "") + esc(card.lt || "revoir la leçon") + "</a>";
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
      sourceHTML(card) +
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
