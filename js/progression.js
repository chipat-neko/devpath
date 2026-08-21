/* =============================================================================
   progression.js — Page « Ma progression » : tableau de bord transversal.
   Agrège le localStorage `syntaxe-progress` écrit par lecon.js : avancement
   par cours, reprise (« syntaxe-last »), totaux. Aucun fetch.
   ============================================================================= */
(function () {
  "use strict";

  var DATA = window.SITE_DATA;
  if (!DATA) return;

  function esc(s) {
    return (s || "").replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }

  function progress() {
    return window.SyntaxeStore.getJSON("syntaxe-progress", {});
  }
  function lastVisited() {
    return window.SyntaxeStore.getJSON("syntaxe-last", null);
  }

  /* ------------------------------------ Depuis quand ? (V12-E3)
     La date vient de « syntaxe-last » depuis E3 ; pour une progression plus
     ancienne, on la déduit du DERNIER jour du journal d'activité, qui est écrit
     au même instant par lecon.js. */
  function dateDerniereVisite() {
    var l = lastVisited();
    if (l && l.at) return l.at;
    var act = window.SyntaxeStore.getJSON("syntaxe-activity", {});
    var jours = Object.keys(act).filter(function (j) { return /^\d{4}-\d{2}-\d{2}$/.test(j); });
    if (!jours.length) return "";
    jours.sort();
    return jours[jours.length - 1];
  }

  /* Ne se dit qu'au-delà d'un jour : rappeler « aujourd'hui » à quelqu'un qui
     vient de fermer l'onglet n'apporte rien. */
  function phraseReprise() {
    var iso = dateDerniereVisite();
    if (!iso || !window.SyntaxeDate) return "";
    var n = window.SyntaxeDate.jours(iso);
    if (n < 1) return "";
    var quand = window.SyntaxeDate.relatif(iso);
    if (!quand) return "";
    return n >= 21
      ? '<p class="dash-reprise-quand">Tu t\'es arrêté ' + esc(quand) +
        ". Voici où tu en étais&nbsp;:</p>"
      : '<p class="dash-reprise-quand">Dernière leçon ouverte ' + esc(quand) + ".</p>";
  }
  function quizScores() {
    return window.SyntaxeStore.getJSON("syntaxe-quiz", {});
  }

  function glyphOf(id) {
    if (window.courseLogo) {
      var g = window.courseLogo(id);
      if (g) return g;
    }
    var c = DATA.content[id];
    return esc((c && c.glyph) || "?");
  }

  /* Meilleur QCM bilan d'un cours.
     Quatre cours (css, html, javascript, python) portent un bilan de PALIER, à
     la dernière leçon de leur programme d'origine, en plus du bilan final : le
     score n'est donc plus forcément rangé sous la dernière leçon. On balaie
     toutes les leçons déclarées et on garde le meilleur (au ratio ; à ratio
     égal, celui qui compte le plus de questions). Un cours à bilan unique —
     les 72 autres — renvoie exactement le même objet qu'avant. */
  function bilanRatio(b) {
    return b && b.total ? b.best / b.total : 0;
  }
  function bestBilan(cs, files) {
    if (!cs) return null;
    var best = null;
    for (var i = 0; i < files.length; i++) {
      var entry = cs[files[i]];
      var b = entry ? entry.bilan : null;
      if (!b) continue;
      if (
        !best ||
        bilanRatio(b) > bilanRatio(best) ||
        (bilanRatio(b) === bilanRatio(best) && (b.total || 0) > (best.total || 0))
      ) {
        best = b;
      }
    }
    return best;
  }

  /* ------------------------------------------- « À retravailler » (V12-C3)
     Les quatre lecteurs de « syntaxe-quiz » ne regardaient que le HAUT de la
     distribution — « Maîtrisé », « Sans faute », « As des QCM ». Un score bas
     était enregistré et jamais montré : aucune page ne disait où ça coince.
     On liste donc l'inverse : les leçons dont le MEILLEUR score reste sous le
     seuil de maîtrise déjà utilisé ailleurs sur le site (70 %). */
  var SEUIL_MAITRISE = 0.7;
  var RETRAVAILLER_MAX = 12;

  /* Titre d'une leçon à partir de son fichier, sans reparcourir data.js à
     chaque appel. */
  var titresLecon = null;
  function titreLecon(coursId, fichier) {
    if (!titresLecon) {
      titresLecon = {};
      Object.keys(DATA.content).forEach(function (id) {
        DATA.content[id].modules.forEach(function (m) {
          m.lessons.forEach(function (l) {
            titresLecon[id + "/" + l.file] = l.title;
          });
        });
      });
    }
    return titresLecon[coursId + "/" + fichier] || fichier;
  }

  function aRetravailler() {
    var scores = quizScores();
    var out = [];
    Object.keys(scores).forEach(function (coursId) {
      var c = DATA.content[coursId];
      if (!c) return; /* cours disparu : on n'invente pas de lien */
      var parFichier = scores[coursId];
      if (!parFichier || typeof parFichier !== "object") return;
      Object.keys(parFichier).forEach(function (fichier) {
        var entrees = parFichier[fichier];
        if (!entrees || typeof entrees !== "object") return;
        Object.keys(entrees).forEach(function (cle) {
          var s = entrees[cle];
          if (!s || typeof s.total !== "number" || !s.total) return;
          var ratio = (s.best || 0) / s.total;
          if (ratio >= SEUIL_MAITRISE) return;
          out.push({
            coursId: coursId,
            dir: c.dir,
            coursTitre: c.title,
            fichier: fichier,
            titre: cle === "bilan"
              ? "QCM bilan du cours"
              : titreLecon(coursId, fichier),
            bilan: cle === "bilan",
            best: s.best || 0,
            total: s.total,
            /* Écrit par lecon.js depuis C3 : les scores enregistrés avant ne
               l'ont pas, et on n'invente pas un chiffre qu'on n'a pas. */
            rates: (s.rates && s.rates.length) || 0,
            ratio: ratio,
          });
        });
      });
    });
    /* Du plus faible au moins faible : ce qu'il faut reprendre d'abord. */
    out.sort(function (a, b) {
      return a.ratio - b.ratio || b.total - a.total;
    });
    return out;
  }

  function renderARetravailler() {
    var host = document.getElementById("dash-retravailler");
    if (!host) return;
    var scores = quizScores();
    var aucunScore = !Object.keys(scores).length;
    var liste = aRetravailler();

    if (aucunScore) {
      host.innerHTML = ""; /* pas encore de QCM passé : rien à dire */
      return;
    }
    if (!liste.length) {
      host.innerHTML =
        "<h2>À retravailler</h2>" +
        '<p class="dash-empty">Aucun QCM en dessous de 70&nbsp;%. Tout ce que tu as passé est acquis.</p>';
      return;
    }
    var restants = liste.length - RETRAVAILLER_MAX;
    host.innerHTML =
      "<h2>À retravailler</h2>" +
      '<p class="dash-retravail__intro">' + liste.length + " QCM" + (liste.length > 1 ? " sont" : " est") +
      " sous 70&nbsp;%, du plus faible au moins faible. Le score gardé est le meilleur : " +
      "refaire le QCM ne peut que l'améliorer.</p>" +
      '<ul class="dash-retravail">' +
      liste.slice(0, RETRAVAILLER_MAX).map(function (x) {
        var pct = Math.round(x.ratio * 100);
        return '<li class="dash-retravail__item">' +
          '<a class="dash-retravail__lien" href="' + esc(x.dir) + "/" + esc(x.fichier) + '">' +
          '<span class="dash-retravail__titre">' + esc(x.titre) + "</span>" +
          '<span class="dash-retravail__cours">' + esc(x.coursTitre) +
          (x.rates ? " · " + x.rates + " question" + (x.rates > 1 ? "s" : "") + " à revoir" : "") +
          "</span></a>" +
          '<span class="dash-retravail__score">' + x.best + " / " + x.total + " · " + pct + "%</span></li>";
      }).join("") +
      "</ul>" +
      (restants > 0
        ? '<p class="dash-retravail__reste">et ' + restants + " autre" + (restants > 1 ? "s" : "") + ".</p>"
        : "");
  }

  /* Calcule l'état de chaque cours */
  function computeCourses() {
    var prog = progress();
    var scores = quizScores();
    var list = [];
    Object.keys(DATA.content).forEach(function (id) {
      var c = DATA.content[id];
      var p = prog[id] || {};
      var total = 0;
      var done = 0;
      var firstUndone = null;
      var files = [];
      c.modules.forEach(function (m) {
        m.lessons.forEach(function (l) {
          total++;
          files.push(l.file);
          if (p[l.file]) done++;
          else if (!firstUndone) firstUndone = l.file;
        });
      });
      var mastered = false;
      var cs = scores[id];
      var bilan = bestBilan(cs, files);
      if (done >= total && total > 0 && bilan && bilan.total && bilan.best / bilan.total >= 0.7) {
        mastered = true;
      }
      list.push({
        id: id,
        title: c.title,
        dir: c.dir,
        total: total,
        done: done,
        mastered: mastered,
        firstUndone: firstUndone || (c.modules[0] && c.modules[0].lessons[0] && c.modules[0].lessons[0].file) || "cours.html",
      });
    });
    return list;
  }

  function bar(done, total) {
    var pct = total ? Math.round((done / total) * 100) : 0;
    return (
      '<div class="progress"><div class="progress__head">' +
      '<span class="progress__label">' + done + " / " + total + " leçons</span>" +
      '<span class="progress__value">' + pct + "%</span></div>" +
      '<div class="progress__track"><div class="progress__bar" style="width:' + pct + '%"></div></div></div>'
    );
  }

  function courseRow(c) {
    var doneAll = c.done >= c.total && c.total > 0;
    var badge = doneAll
      ? '<span class="dash-badge' + (c.mastered ? " dash-badge--master" : "") + '">' +
        (c.mastered ? "🏆 Maîtrisé" : "✓ Terminé") + "</span>"
      : "";
    return (
      '<a class="dash-course' + (doneAll ? " dash-course--done" : "") + '" href="' + esc(c.dir) + "/" + esc(c.firstUndone) + '">' +
      '<span class="dash-course__glyph" data-accent="' + esc(c.id) + '" aria-hidden="true">' + glyphOf(c.id) + "</span>" +
      '<span class="dash-course__body">' +
      '<span class="dash-course__title">' + esc(c.title) + badge + "</span>" +
      bar(c.done, c.total) +
      "</span>" +
      "</a>"
    );
  }

  /* ------------------------------------------- Activité : heatmap & séries (P3) */
  function ymd(d) {
    var m = d.getMonth() + 1,
      j = d.getDate();
    return d.getFullYear() + "-" + (m < 10 ? "0" + m : m) + "-" + (j < 10 ? "0" + j : j);
  }
  function activityLevel(n) {
    if (!n) return 0;
    if (n <= 1) return 1;
    if (n <= 3) return 2;
    if (n <= 5) return 3;
    return 4;
  }
  function currentStreak(act) {
    var s = 0,
      d = new Date();
    d.setHours(0, 0, 0, 0);
    if (!act[ymd(d)]) d.setDate(d.getDate() - 1); // tolère « aujourd'hui pas encore actif »
    while (act[ymd(d)]) {
      s++;
      d.setDate(d.getDate() - 1);
    }
    return s;
  }

  /* ------------------------------------------------ Objectif quotidien (R7) */
  function getGoal() {
    var g = window.SyntaxeStore.getJSON("syntaxe-goal", {});
    return g.daily || 0;
  }
  function setGoal(n) {
    window.SyntaxeStore.setJSON("syntaxe-goal", { daily: n });
  }
  function todayCount() {
    /* Compte les leçons DISTINCTES terminées aujourd'hui (journal « syntaxe-done-log »
       écrit par lecon.js), et non les chargements de page : recharger la même leçon
       ne fait plus avancer l'objectif. */
    var log = window.SyntaxeStore.getJSON("syntaxe-done-log", {});
    var arr = log[ymd(new Date())];
    return arr && arr.length ? arr.length : 0;
  }
  function renderGoal() {
    var host = document.getElementById("dash-goal");
    if (!host) return;
    var goal = getGoal();
    var done = todayCount();
    var opts = [1, 2, 3, 5]
      .map(function (n) {
        return (
          '<button type="button" class="goal-opt' + (n === goal ? " is-active" : "") +
          '" data-goal="' + n + '">' + n + "</button>"
        );
      })
      .join("");
    var body;
    if (!goal) {
      body =
        '<p class="goal-intro">Fixe-toi un objectif quotidien pour garder le rythme :</p>' +
        '<div class="goal-opts">' + opts + '<span class="goal-unit">leçon(s) par jour</span></div>';
    } else {
      var pct = Math.min(100, Math.round((done / goal) * 100));
      var reached = done >= goal;
      var msg = reached
        ? "🎉 Objectif atteint, bravo !"
        : done === 0
        ? "C'est parti — ouvre une leçon pour démarrer la journée."
        : "Encore " + (goal - done) + " pour atteindre ton objectif du jour.";
      body =
        '<div class="goal-head">' +
        '<span class="goal-status">' + done + " / " + goal + " aujourd'hui</span>" +
        '<div class="goal-opts goal-opts--mini">' + opts + "</div></div>" +
        '<div class="goal-bar"><div class="goal-bar__fill' + (reached ? " is-done" : "") +
        '" style="width:' + pct + '%"></div></div>' +
        '<p class="goal-msg">' + msg + "</p>";
    }
    host.innerHTML = '<h2 class="u-mt-0">Mon objectif du jour</h2>' + body;
    var btns = host.querySelectorAll("[data-goal]");
    for (var i = 0; i < btns.length; i++) {
      btns[i].addEventListener("click", function () {
        setGoal(parseInt(this.getAttribute("data-goal"), 10));
        renderGoal();
      });
    }
  }

  function renderStatsCharts() {
    var host = document.getElementById("dash-charts");
    if (!host) return;
    var act = window.SyntaxeStore.getJSON("syntaxe-activity", {});
    var activeDays = Object.keys(act).length;
    if (activeDays === 0) {
      host.innerHTML = "";
      return; // pas encore d'historique : rien à montrer
    }

    var weeks = 13;
    var today = new Date();
    today.setHours(0, 0, 0, 0);
    var dow = (today.getDay() + 6) % 7; // 0 = lundi
    var start = new Date(today);
    start.setDate(today.getDate() - dow - (weeks - 1) * 7);

    var cell = 13,
      gap = 3;
    var w = weeks * (cell + gap) - gap,
      h = 7 * (cell + gap) - gap;
    var rects = "";
    for (var wk = 0; wk < weeks; wk++) {
      for (var dy = 0; dy < 7; dy++) {
        var d = new Date(start);
        d.setDate(start.getDate() + wk * 7 + dy);
        if (d > today) continue;
        var key = ymd(d);
        var n = act[key] || 0;
        rects +=
          '<rect x="' + wk * (cell + gap) + '" y="' + dy * (cell + gap) + '" width="' + cell +
          '" height="' + cell + '" rx="2" class="hm-l' + activityLevel(n) + '">' +
          "<title>" + key + " : " + n + "</title></rect>";
      }
    }

    host.innerHTML =
      '<h2 class="u-mt-0">Mon activité</h2>' +
      '<div class="dash-stats">' +
      stat(currentStreak(act) + " j", "Série en cours") +
      stat(activeDays, "Jours actifs") +
      "</div>" +
      '<div class="heatmap"><svg viewBox="0 0 ' + w + " " + h + '" width="' + w + '" height="' + h +
      '" role="img" aria-label="Carte d\'activité des 13 dernières semaines">' + rects + "</svg>" +
      '<p class="heatmap__legend">Moins ' +
      '<span class="hm-l0"></span><span class="hm-l1"></span><span class="hm-l2"></span>' +
      '<span class="hm-l3"></span><span class="hm-l4"></span> Plus</p></div>';
  }

  /* Niveau, XP et succès (s'appuie sur window.SyntaxeXP défini dans main.js) */
  /* Badges thématiques : débloqués quand TOUS les cours d'une famille sont terminés.
     (Distinct des succès génériques ci-dessus, qui portent sur des totaux.) */
  var THEME_BADGES = [
    { label: "DevOps", icon: "🚀", desc: "Docker, Kubernetes, CI/CD, Cloud & IaC", ids: ["docker", "kubernetes", "cicd", "cloud", "iac"] },
    { label: "Front-end", icon: "🎨", desc: "HTML, CSS, JavaScript & accessibilité", ids: ["html", "css", "javascript", "a11y"] },
    { label: "Données & IA", icon: "📊", desc: "SQL, Python & machine learning", ids: ["sql", "python", "ml"] },
    { label: "Sécurité & qualité", icon: "🛡️", desc: "Sécurité, tests & HTTP", ids: ["securite", "tests", "http"] },
    { label: "Bas niveau", icon: "⚙️", desc: "C, C++ & Rust", ids: ["c", "cpp", "rust"] },
    { label: "Fonctionnel", icon: "λ", desc: "Haskell, OCaml & Clojure", ids: ["haskell", "ocaml", "clojure"] },
  ];

  function renderThemeBadges(finishedIds) {
    var done = {};
    (finishedIds || []).forEach(function (c) { done[c.id || c] = true; });
    var unlocked = 0;
    var items = THEME_BADGES.map(function (b) {
      var have = 0;
      b.ids.forEach(function (id) { if (done[id]) have++; });
      var on = have >= b.ids.length;
      if (on) unlocked++;
      return (
        '<li class="theme-badge' + (on ? " theme-badge--on" : "") + '">' +
        '<span class="theme-badge__icon" aria-hidden="true">' + b.icon + "</span>" +
        '<span class="theme-badge__body">' +
        '<span class="theme-badge__label">' + esc(b.label) + (on ? " ✓" : "") + "</span>" +
        '<span class="theme-badge__desc">' + esc(b.desc) + "</span>" +
        '<span class="theme-badge__count">' + have + " / " + b.ids.length + " cours</span>" +
        "</span></li>"
      );
    }).join("");
    return (
      '<h3 class="xp-panel__ach-title">Badges thématiques <span>' + unlocked + " / " + THEME_BADGES.length + "</span></h3>" +
      '<ul class="theme-badges">' + items + "</ul>"
    );
  }

  function renderGamification(coursesFinished, finishedList) {
    var host = document.getElementById("dash-gamification");
    if (!host || !window.SyntaxeXP) return;
    var s = window.SyntaxeXP.compute();
    var lv = window.SyntaxeXP.levelInfo(s.xp);

    var ach = [
      { label: "Premiers pas", desc: "Terminer 1 leçon", ok: s.lessons >= 1 },
      { label: "Studieux", desc: "10 leçons terminées", ok: s.lessons >= 10 },
      { label: "Marathonien", desc: "100 leçons terminées", ok: s.lessons >= 100 },
      { label: "Encyclopédiste", desc: "500 leçons terminées", ok: s.lessons >= 500 },
      { label: "Premier cours", desc: "Terminer un cours entier", ok: coursesFinished >= 1 },
      { label: "Polyglotte", desc: "5 cours terminés", ok: coursesFinished >= 5 },
      { label: "Sans faute", desc: "Réussir un QCM sans erreur", ok: s.quizPerfect >= 1 },
      { label: "As des QCM", desc: "20 QCM réussis", ok: s.quizPassed >= 20 },
      { label: "Niveau 5", desc: "Atteindre le niveau 5", ok: lv.level >= 5 },
      { label: "Niveau 10", desc: "Atteindre le niveau 10", ok: lv.level >= 10 },
    ];
    var unlocked = 0;
    ach.forEach(function (a) {
      if (a.ok) unlocked++;
    });

    var items = ach
      .map(function (a) {
        return (
          '<li class="achievement' + (a.ok ? " achievement--on" : "") + '">' +
          '<span class="achievement__icon" aria-hidden="true">' + (a.ok ? "★" : "☆") + "</span>" +
          '<span class="achievement__body"><span class="achievement__label">' + esc(a.label) + "</span>" +
          '<span class="achievement__desc">' + esc(a.desc) + "</span></span></li>"
        );
      })
      .join("");

    host.innerHTML =
      '<section class="xp-panel">' +
      /* h2 masqué (sr-only) : le panneau enchaînait h1 → h3 (Succès/Badges) sans
         niveau intermédiaire. (cf. D2) */
      '<h2 class="sr-only">Ta progression</h2>' +
      '<div class="xp-panel__head">' +
      '<span class="xp-panel__level">Niveau ' + lv.level + "</span>" +
      '<span class="xp-panel__title">' + esc(lv.title) + "</span>" +
      '<span class="xp-panel__xp">' + s.xp + " XP</span>" +
      "</div>" +
      '<div class="xp-panel__track"><div class="xp-panel__bar" style="width:' + lv.pct + '%"></div></div>' +
      '<p class="xp-panel__next">' + lv.intoLevel + " / " + lv.span + " XP vers le niveau " + (lv.level + 1) + "</p>" +
      '<h3 class="xp-panel__ach-title">Succès <span>' + unlocked + " / " + ach.length + "</span></h3>" +
      '<ul class="achievements">' + items + "</ul>" +
      renderThemeBadges(finishedList) +
      "</section>";
  }

  function render() {
    renderGoal();
    renderStatsCharts();
    var courses = computeCourses();
    var totalLessons = 0;
    var doneLessons = 0;
    var started = [];
    var finished = [];
    courses.forEach(function (c) {
      totalLessons += c.total;
      doneLessons += c.done;
      if (c.done >= c.total && c.total > 0) finished.push(c);
      else if (c.done > 0) started.push(c);
    });
    started.sort(function (a, b) {
      return b.done / b.total - a.done / a.total;
    });

    /* Tout le site terminé : la donnée directe (toutes les leçons faites) plutôt
       qu'un comptage par cours, pour rester exactement aligné sur « X / X »
       affiché juste au-dessus. Le titre et l'accroche de la page invitent à
       « reprendre » — faux quand il ne reste rien : on les réécrit. */
    var allDone = totalLessons > 0 && doneLessons === totalLessons;
    var heroTitle = document.querySelector("[data-dash-hero-title]");
    var heroLead = document.querySelector("[data-dash-hero-lead]");
    if (allDone) {
      if (heroTitle) heroTitle.textContent = "Tu as tout parcouru";
      if (heroLead) {
        heroLead.textContent =
          "Ton avancement est enregistré sur cet appareil (aucun compte, aucun " +
          "serveur). Voici tout ce que tu as accompli.";
      }
    } else if (doneLessons === 0) {
      /* Rien commencé : « Reprends là où tu t'es arrêté » et « le bouton pour
         repartir aussitôt » sont faux (le corps dit « Tu n'as pas encore
         commencé »). On invite à démarrer. */
      if (heroTitle) heroTitle.textContent = "Commence ton apprentissage";
      if (heroLead) {
        heroLead.textContent =
          "Ta progression s'enregistrera sur cet appareil (aucun compte, aucun " +
          "serveur). Ouvre un cours : tes leçons terminées et tes acquis " +
          "s'afficheront ici.";
      }
    }
    /* En cours : le titre et l'accroche du HTML (« Reprends là où tu t'es
       arrêté ») décrivent déjà la situation, on n'y touche pas. */

    /* Bandeau de stats */
    var statsHost = document.getElementById("dash-stats");
    if (statsHost) {
      statsHost.innerHTML =
        stat(doneLessons + " / " + totalLessons, "Leçons terminées") +
        stat(started.length + finished.length, "Cours commencés") +
        stat(finished.length, "Cours terminés");
    }

    /* Niveau & succès (gamification, P1) */
    renderGamification(finished.length, finished);

    /* Ce qui n'est PAS acquis (C3) */
    renderARetravailler();

    /* Reprendre */
    var resumeHost = document.getElementById("dash-resume");
    if (resumeHost) {
      var last = lastVisited();
      /* Ne proposer « Reprendre » que si la leçon sauvegardée existe encore
         (une renumérotation ou une vieille sauvegarde produirait sinon un 404) ;
         sinon on retombe sur « Continuer » le cours commencé. */
      var lastValid =
        last && last.course && DATA.content[last.course] &&
        DATA.content[last.course].modules.some(function (m) {
          return m.lessons.some(function (l) { return l.file === last.file; });
        });
      if (allDone) {
        /* Tout est terminé : ne pas proposer de « reprendre » un cours fini
           (le mensonge « Reprendre : Zig »). On constate l'accompli et on
           propose d'entretenir ses acquis ou de construire. */
        resumeHost.innerHTML =
          '<p class="dash-empty">Tu as terminé l\'intégralité du site — ' +
          finished.length + " cours, " + totalLessons + " leçons. " +
          'Entretiens tes acquis avec <a href="revision.html">la révision</a>, ' +
          'ou construis avec <a href="fils-rouges.html">un projet fil rouge</a>.</p>';
      } else if (lastValid) {
        var c = DATA.content[last.course];
        resumeHost.innerHTML =
          phraseReprise() +
          '<a class="btn btn--primary btn--lg" href="' + esc(c.dir) + "/" + esc(last.file) + '">' +
          "Reprendre : " + esc(last.title || c.title) +
          '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg></a>';
      } else if (started.length) {
        var s = started[0];
        resumeHost.innerHTML =
          phraseReprise() +
          '<a class="btn btn--primary btn--lg" href="' + esc(s.dir) + "/" + esc(s.firstUndone) + '">' +
          "Continuer : " + esc(s.title) +
          '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg></a>';
      } else if (finished.length) {
        /* Aucun cours en cours ET pas de « dernière leçon » valide (ex. après une
           renumérotation, ou une progression importée), mais des cours terminés :
           ne pas prétendre « pas encore commencé » — c'est contradictoire. (cf. C7) */
        resumeHost.innerHTML =
          '<p class="dash-empty">Tu as terminé tous les cours que tu avais commencés — bravo&nbsp;! <a href="catalogue.html">Explore le catalogue</a> pour en découvrir d\'autres.</p>';
      } else {
        resumeHost.innerHTML =
          '<p class="dash-empty">Tu n\'as pas encore commencé de cours. <a href="catalogue.html">Explore le catalogue</a> pour démarrer.</p>';
      }
    }

    /* Listes */
    fill(
      "dash-started",
      started,
      allDone
        ? "Tous les cours sont terminés — il n'y en a plus en cours."
        : "Aucun cours en cours pour l'instant."
    );
    fill("dash-finished", finished, "Aucun cours terminé pour l'instant.");
  }

  function fill(id, list, emptyMsg) {
    var host = document.getElementById(id);
    if (!host) return;
    if (!list.length) {
      host.innerHTML = '<p class="dash-empty">' + emptyMsg + "</p>";
      return;
    }
    host.innerHTML = list.map(courseRow).join("");
  }

  function stat(n, l) {
    return (
      '<div class="dash-stat"><span class="dash-stat__n">' + n + "</span>" +
      '<span class="dash-stat__l">' + l + "</span></div>"
    );
  }

  /* ------------------------------------- Balayage des clés de progression
     Le site écrit une quinzaine de clés « syntaxe- » (objectif quotidien,
     journal d'activité, notes, projets, un fil rouge par parcours…). Les
     énumérer à la main condamnait le bouton « effacer » à en oublier la
     plupart : on balaie donc le préfixe, comme js/donnees-perso.js, en
     préservant les seules préférences d'AFFICHAGE (thème, couleur, langue)
     qui ne relèvent pas de la progression. */
  var PREFIX = "syntaxe-";
  /* Préférences d'affichage : ne relèvent pas de la progression. */
  var PREFS_A_GARDER = ["syntaxe-theme", "syntaxe-theme-color", "syntaxe-lang"];
  /* CONTENU ÉCRIT PAR L'UTILISATEUR — à ne JAMAIS effacer avec la progression.
     Ce ne sont pas des résultats mais des créations : les questions qu'il a
     rédigées lui-même, et le code qu'il a tapé dans le bac à sable et la
     console. Les balayer avec le préfixe revenait à détruire son travail sans
     le nommer dans la confirmation. */
  var CREATIONS_A_GARDER = ["syntaxe-mes-qcm", "syntaxe-playground", "syntaxe-console-python"];
  function clesProgression() {
    var out = [];
    try {
      for (var i = 0; i < localStorage.length; i++) {
        var k = localStorage.key(i);
        if (!k || k.indexOf(PREFIX) !== 0) continue;
        if (PREFS_A_GARDER.indexOf(k) !== -1) continue;
        if (CREATIONS_A_GARDER.indexOf(k) !== -1) continue;
        out.push(k);
      }
    } catch (e) {}
    return out.sort();
  }

  /* Réinitialiser la progression */
  function initReset() {
    var btn = document.getElementById("dash-reset");
    if (!btn) return;
    btn.addEventListener("click", function () {
      if (
        !window.confirm(
          "Effacer toute ta progression ? Cela concerne " +
            clesProgression().length +
            " élément(s) : leçons terminées, scores de QCM, notes, projets, fils rouges, " +
            "objectifs, journal d'activité, antisèches et révisions.\n\n" +
            "Sont CONSERVÉS : tes questions de « Mes QCM », ton code du bac à sable et de la " +
            "console, ainsi que le thème et la langue.\n\nCette action est irréversible."
        )
      )
        return;
      /* Collecte AVANT suppression : retirer une clé pendant le parcours de
         localStorage décalerait les index et en sauterait une sur deux. */
      var ks = clesProgression();
      var rates = 0;
      ks.forEach(function (k) {
        if (!window.SyntaxeStore.remove(k)) rates++;
      });
      render();
      if (rates && window.SyntaxeToast) {
        window.SyntaxeToast(
          "Effacement impossible : " + rates + " élément(s) sur " + ks.length +
            " n'ont pas pu être supprimés — ce navigateur refuse le stockage local.",
          true
        );
      }
    });
  }

  /* ------------------------------- Export / import (synchro sans serveur) */
  function pad2(n) {
    return n < 10 ? "0" + n : "" + n;
  }

  function exportProgress() {
    var payload = {
      app: "syntaxe",
      version: 1,
      exported: new Date().toISOString(),
      progress: progress(),
      quiz: quizScores(),
      last: lastVisited(),
      /* `keys` = toutes les autres clés de progression (notes, objectif,
         activité, projets, fils rouges…), en texte brut. Les trois champs
         ci-dessus sont conservés tels quels pour que les anciens fichiers
         d'export restent importables. */
      keys: (function () {
        var o = {};
        clesProgression().forEach(function (k) {
          try {
            o[k] = localStorage.getItem(k);
          } catch (e) {}
        });
        return o;
      })(),
    };
    var blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    var d = new Date();
    var stamp = d.getFullYear() + "-" + pad2(d.getMonth() + 1) + "-" + pad2(d.getDate());
    a.href = url;
    a.download = "syntaxe-progression-" + stamp + ".json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(function () {
      URL.revokeObjectURL(url);
    }, 1000);
  }

  function importProgress(file) {
    var reader = new FileReader();
    reader.onload = function () {
      var data;
      try {
        data = JSON.parse(reader.result);
      } catch (e) {
        window.alert("Fichier illisible : ce n'est pas un JSON valide.");
        return;
      }
      if (!data || typeof data !== "object" || !data.progress) {
        window.alert("Ce fichier ne ressemble pas à un export Syntaxe.");
        return;
      }
      /* B3 : l'import est la SEULE route entre deux machines, et il écrasait.
         On demande maintenant, avec les deux inventaires sous les yeux :
         fusionner (union des leçons, meilleur score), remplacer, ou annuler. */
      var F = window.SyntaxeFusion;
      var hote = document.querySelector(".dash-actions");
      if (!F || !hote) {
        if (!window.confirm("Importer remplacera ta progression actuelle par celle du fichier. Continuer ?")) return;
        appliquerImport(data, false);
        return;
      }
      F.demanderChoix(
        hote,
        F.resume(data.progress, data.quiz),
        F.resume(progress(), quizScores()),
        function (reponse) {
          if (reponse === "annuler") return;
          appliquerImport(data, reponse === "fusion");
        }
      );
    };
    reader.readAsText(file);
  }

  /* `fusion` à true : rien n'est perdu des deux côtés. À false : le fichier
     remplace, comme avant. */
  function appliquerImport(data, fusion) {
    var F = window.SyntaxeFusion;
    var ok = true;
    function poser(cle, valeurImportee, valeurLocale) {
      var v = fusion && F ? F.fusionner(valeurLocale, valeurImportee) : valeurImportee;
      if (!window.SyntaxeStore.setJSON(cle, v)) ok = false;
    }
    poser("syntaxe-progress", data.progress || {}, progress());
    if (data.quiz) poser("syntaxe-quiz", data.quiz, quizScores());
    /* La dernière leçon visitée n'est pas cumulable : en fusion, celle de cet
       appareil fait foi ; elle n'est reprise du fichier que si elle manque. */
    if (data.last && (!fusion || !lastVisited())) {
      if (!window.SyntaxeStore.setJSON("syntaxe-last", data.last)) ok = false;
    }
    /* Champ ajouté par les exports récents : le reste de la progression (notes,
       objectif, activité, projets, fils rouges…), en texte brut. Filtré au
       préfixe et aux préférences d'affichage pour qu'un fichier bricolé ne
       puisse pas écrire n'importe quelle clé. */
    if (data.keys && typeof data.keys === "object") {
      Object.keys(data.keys).forEach(function (k) {
        if (k.indexOf(PREFIX) !== 0) return;
        if (PREFS_A_GARDER.indexOf(k) !== -1) return;
        var v = data.keys[k];
        if (typeof v !== "string") return;
        if (fusion && F) {
          var local = null;
          try { local = localStorage.getItem(k); } catch (e) {}
          v = F.fusionnerTexte(local, v);
        }
        if (!window.SyntaxeStore.set(k, v)) ok = false;
      });
    }
    render();
    if (!ok) {
      window.alert("Une partie de la progression importée n'a pas pu être enregistrée.");
      return;
    }
    window.alert(
      fusion
        ? "Progression fusionnée : rien n'a été perdu des deux côtés."
        : "Progression importée : elle a remplacé celle de cet appareil."
    );
  }

  function initExportImport() {
    var expBtn = document.getElementById("dash-export");
    var impBtn = document.getElementById("dash-import");
    var fileInput = document.getElementById("dash-import-file");
    if (expBtn) expBtn.addEventListener("click", exportProgress);
    if (impBtn && fileInput) {
      impBtn.addEventListener("click", function () {
        fileInput.click();
      });
      fileInput.addEventListener("change", function () {
        if (fileInput.files && fileInput.files[0]) importProgress(fileInput.files[0]);
        fileInput.value = ""; // permet de réimporter le même fichier ensuite
      });
    }
  }

  render();
  initReset();
  initExportImport();
})();
