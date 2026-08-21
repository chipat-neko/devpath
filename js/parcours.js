/* =============================================================================
   parcours.js — Page « Parcours » : enchaînements de cours existants.
   Rend les itinéraires depuis SITE_DATA.tracks, avec la progression cumulée
   (lue dans le même localStorage que cours.js / lecon.js). Aucun fetch.
   ============================================================================= */
(function () {
  "use strict";

  var DATA = window.SITE_DATA;
  if (!DATA || !DATA.tracks) return;

  var host = document.getElementById("parcours-list");
  if (!host) return;

  function esc(s) {
    return (s || "").replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }

  /* ------------------------------------ « Par où commencer ? » (V12-E4)
     Pas un test de niveau : trois questions, un barème lisible, et une phrase
     qui dit POURQUOI ce parcours est proposé. Les 25 parcours restent affichés
     en dessous — la suggestion n'enferme personne. */
  var QUESTIONS = [
    {
      id: "experience",
      texte: "Tu as déjà programmé&nbsp;?",
      choix: [
        { v: "jamais", l: "Jamais", points: { "premier-projet": 6, fondamentaux: 4, "web-frontend": 2 } },
        { v: "un-peu", l: "Un peu, en autodidacte", points: { "premier-projet": 3, fondamentaux: 3 } },
        { v: "autre", l: "Oui, dans un autre langage", points: { fondamentaux: 1, conception: 2, outils: 2 } },
      ],
    },
    {
      id: "domaine",
      texte: "Qu'est-ce qui t'attire le plus&nbsp;?",
      choix: [
        { v: "web", l: "Faire des sites et des interfaces", points: { "web-frontend": 6, "front-avance": 3, "produit-design": 2, "performance-web": 2 } },
        { v: "backend", l: "Le serveur, les API, les bases de données", points: { backend: 6, "api-web": 3, "web-serveur": 3, "bases-donnees": 3 } },
        { v: "data", l: "Les données, les statistiques, l'IA", points: { data: 6, ia: 4, "calcul-scientifique": 2 } },
        { v: "systeme", l: "Comprendre la machine, le bas niveau", points: { systeme: 6, fondamentaux: 3, concurrence: 2 } },
        { v: "mobile", l: "Les applications mobiles", points: { "mobile-dev": 6, "web-frontend": 1 } },
        { v: "outils", l: "Automatiser, outiller, déployer", points: { scripting: 5, outils: 4, devops: 4, exploitation: 3 } },
      ],
    },
    {
      id: "intention",
      texte: "Tu veux plutôt…",
      choix: [
        { v: "bases", l: "Comprendre les bases pour de bon", points: { fondamentaux: 4, "premier-projet": 2 } },
        { v: "construire", l: "Construire vite quelque chose d'utile", points: { "premier-projet": 4, "web-frontend": 2, backend: 2 } },
        { v: "consolider", l: "Consolider ce que je sais déjà", points: { conception: 4, outils: 3, devops: 2, "front-avance": 2 } },
      ],
    },
  ];

  var reponses = {};

  function parcoursParId(id) {
    for (var i = 0; i < DATA.tracks.length; i++) {
      if (DATA.tracks[i].id === id) return DATA.tracks[i];
    }
    return null;
  }

  /* Parcours qui supposent des acquis : les proposer a quelqu'un qui n'a jamais
     programme serait au mieux inutile, au pire decourageant. */
  var EXIGEANTS = {
    "front-avance": 1, conception: 1, concurrence: 1, "performance-web": 1,
    devops: 1, exploitation: 1, "calcul-scientifique": 1, patrimoine: 1,
  };

  /* Bareme : on additionne les points de chaque reponse. Le DOMAINE compte
     double — c'est le signal le plus fort : quelqu'un qui vise le mobile doit
     voir « Developpement mobile » en tete, pas un parcours generaliste. */
  function suggestions() {
    var scores = {};
    QUESTIONS.forEach(function (q) {
      var v = reponses[q.id];
      if (!v) return;
      var poids = q.id === "domaine" ? 2 : 1;
      q.choix.forEach(function (c) {
        if (c.v !== v) return;
        Object.keys(c.points).forEach(function (t) {
          scores[t] = (scores[t] || 0) + c.points[t] * poids;
        });
      });
    });
    var debutant = reponses.experience === "jamais";
    return Object.keys(scores)
      .filter(function (id) {
        if (!parcoursParId(id)) return false;
        return !(debutant && EXIGEANTS[id]);
      })
      .sort(function (a, b) { return scores[b] - scores[a]; })
      .slice(0, 3)
      .map(function (id) { return { track: parcoursParId(id), score: scores[id] }; });
  }

  function orientHTML() {
    var html = "";
    QUESTIONS.forEach(function (q) {
      html += '<fieldset class="orient__q"><legend>' + q.texte + "</legend>";
      q.choix.forEach(function (c) {
        var id = "orient-" + q.id + "-" + c.v;
        html += '<label class="orient__choix" for="' + id + '">' +
          '<input type="radio" name="orient-' + esc(q.id) + '" id="' + id + '" value="' + esc(c.v) + '"' +
          (reponses[q.id] === c.v ? " checked" : "") + " />" +
          "<span>" + esc(c.l) + "</span></label>";
      });
      html += "</fieldset>";
    });

    var repondues = 0;
    QUESTIONS.forEach(function (q) { if (reponses[q.id]) repondues++; });
    if (repondues < QUESTIONS.length) {
      html += '<p class="orient__resultat">Réponds aux ' + QUESTIONS.length +
        " questions pour voir une suggestion (" + repondues + " / " + QUESTIONS.length + ").</p>";
      return html;
    }

    var s = suggestions();
    if (!s.length) {
      html += '<p class="orient__resultat">Aucune suggestion : explore les parcours ci-dessous.</p>';
      return html;
    }
    html += '<div class="orient__resultat"><p><strong>Ce que je te propose</strong> — trois pistes, ' +
      "dans cet ordre. Rien n'oblige à les suivre : les " + DATA.tracks.length +
      " parcours restent ouverts juste en dessous.</p><ol class=\"orient__liste\">";
    s.forEach(function (x, i) {
      var premier = (x.track.courses && x.track.courses[0]) || "";
      var c = premier && DATA.content[premier];
      html += "<li>" +
        '<a class="orient__lien" href="#' + esc(x.track.id) + '">' + esc(x.track.title) + "</a>" +
        (x.track.tagline ? '<span class="orient__tagline">' + esc(x.track.tagline) + "</span>" : "") +
        '<span class="orient__meta">' + (x.track.courses ? x.track.courses.length + " cours" : "") +
        (c ? ' · commencer par <a href="' + esc(c.dir) + '/cours.html">' + esc(c.title) + "</a>" : "") +
        "</span>" +
        (i === 0 ? '<span class="orient__badge">le plus proche de tes réponses</span>' : "") +
        "</li>";
    });
    html += "</ol></div>";
    return html;
  }

  function initOrient() {
    var body = document.getElementById("orient-body");
    if (!body) return;
    function peindre() {
      body.innerHTML = orientHTML();
      body.querySelectorAll('input[type="radio"]').forEach(function (r) {
        r.addEventListener("change", function () {
          reponses[r.name.replace(/^orient-/, "")] = r.value;
          peindre();
          /* Le focus est perdu par le re-rendu : on le remet sur le choix
             qu'on vient de faire, sinon la tabulation repart du haut. */
          var remis = document.getElementById(r.id);
          if (remis) { remis.checked = true; try { remis.focus(); } catch (e) {} }
        });
      });
    }
    peindre();
  }

  /* Progression partagée */
  function progress() {
    return window.SyntaxeStore.getJSON("syntaxe-progress", {});
  }

  /* Nb de leçons (total / faites) d'un cours */
  function courseCount(id, prog) {
    var c = DATA.content[id];
    if (!c) return { total: 0, done: 0 };
    var total = 0;
    var done = 0;
    var p = prog[id] || {};
    c.modules.forEach(function (m) {
      m.lessons.forEach(function (l) {
        total++;
        if (p[l.file]) done++;
      });
    });
    return { total: total, done: done };
  }

  /* Première leçon non terminée d'un cours (pour « continuer ») */
  function firstUndone(id, prog) {
    var c = DATA.content[id];
    if (!c) return null;
    var p = prog[id] || {};
    var first = null;
    for (var mi = 0; mi < c.modules.length; mi++) {
      var ls = c.modules[mi].lessons;
      for (var li = 0; li < ls.length; li++) {
        if (!first) first = ls[li].file;
        if (!p[ls[li].file]) return ls[li].file;
      }
    }
    return first; // tout fait : on renvoie la première
  }

  function glyphOf(id) {
    if (window.courseLogo) {
      var g = window.courseLogo(id);
      if (g) return g;
    }
    var c = DATA.content[id];
    return esc((c && c.glyph) || "?");
  }

  function render() {
    var prog = progress();
    var html = "";

    DATA.tracks.forEach(function (t) {
      var tTotal = 0;
      var tDone = 0;
      var nCourses = 0;
      var steps = "";

      t.courses.forEach(function (id, idx) {
        var c = DATA.content[id];
        if (!c) return;
        nCourses++;
        var cnt = courseCount(id, prog);
        tTotal += cnt.total;
        tDone += cnt.done;
        var complete = cnt.total > 0 && cnt.done === cnt.total;
        var started = cnt.done > 0;
        var target = firstUndone(id, prog);
        var href = c.dir + "/" + (target || "cours.html");
        var state = complete ? " is-done" : started ? " is-started" : "";

        steps +=
          '<li class="track-step' + state + '">' +
          '<a class="track-step__link" href="' + esc(href) + '">' +
          '<span class="track-step__glyph" data-accent="' + esc(id) + '" aria-hidden="true">' + glyphOf(id) + "</span>" +
          '<span class="track-step__body">' +
          '<span class="track-step__title">' + esc(c.title) + "</span>" +
          '<span class="track-step__meta">' + cnt.done + " / " + cnt.total + " leçons" +
          (complete ? " · terminé ✓" : started ? " · en cours" : "") + "</span>" +
          "</span>" +
          '<svg class="icon track-step__arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>' +
          "</a></li>";
      });

      var pct = tTotal ? Math.round((tDone / tTotal) * 100) : 0;

      /* Fin de parcours : tous les cours terminés. On CONSTATE (nombre de cours
         et de leçons) et on propose une SUITE à l'échelle du parcours — un projet
         fil rouge, qui enchaîne justement plusieurs cours. Même esprit qu'A2,
         mais un cran au-dessus (le parcours, pas le cours). */
      var doneBlock = "";
      if (tTotal > 0 && tDone === tTotal) {
        doneBlock =
          '<p class="track-done">' +
          '<svg class="track-done__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5" /></svg>' +
          "<span>Parcours terminé : " + nCourses + " cours, " + tTotal +
          " leçons. Passe à la pratique avec " +
          '<a href="fils-rouges.html">un projet fil rouge</a>.</span>' +
          "</p>";
      }

      html +=
        '<article class="track-card" id="' + esc(t.id) + '">' +
        '<div class="track-card__head">' +
        '<span class="track-card__glyph" aria-hidden="true">' + esc(t.glyph) + "</span>" +
        '<div>' +
        '<h2 class="track-card__title">' + esc(t.title) + "</h2>" +
        '<p class="track-card__tagline">' + esc(t.tagline) + "</p>" +
        "</div>" +
        "</div>" +
        '<div class="progress"><div class="progress__head">' +
        '<span class="progress__label">Progression du parcours</span>' +
        '<span class="progress__value">' + tDone + " / " + tTotal + "</span></div>" +
        '<div class="progress__track"><div class="progress__bar" style="width:' + pct + '%"></div></div></div>' +
        '<ol class="track-steps">' + steps + "</ol>" +
        doneBlock +
        "</article>";
    });

    host.innerHTML = html;
  }

  render();
  initOrient();
})();
