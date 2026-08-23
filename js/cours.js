/* =============================================================================
   cours.js — Page de présentation d'un cours.
   Rend, depuis data.js : les statistiques, la progression et l'accordéon des
   modules/leçons. L'intro rédactionnelle reste dans le HTML de chaque page.
   La page déclare : <body data-course="javascript">
   ============================================================================= */
(function () {
  "use strict";

  var DATA = window.SITE_DATA;
  if (!DATA) return;

  var courseId = document.body.getAttribute("data-course");
  var course = DATA.content && DATA.content[courseId];
  if (!course) return;

  function esc(s) {
    return (s || "").replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }

  var meta = null;
  for (var i = 0; i < DATA.courses.length; i++) {
    if (DATA.courses[i].id === courseId) {
      meta = DATA.courses[i];
      break;
    }
  }

  // Liste à plat des leçons
  var flat = [];
  course.modules.forEach(function (m) {
    m.lessons.forEach(function (l) {
      flat.push(l);
    });
  });

  var CHEVRON =
    '<svg class="module__chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M6 9l6 6 6-6" /></svg>';

  /* ---- Statistiques ---------------------------------------------------- */
  function renderStats() {
    var host = document.querySelector("[data-course-stats]");
    if (!host || !meta) return;
    /* Niveau : `meta.levels` est déduit des modules dans data.js. Un cours qui
       en couvre plusieurs ne peut pas s'annoncer « Débutant » — ce serait
       trompeur en tête d'un programme qui monte jusqu'à l'expert : on affiche
       le nombre de niveaux et la plage couverte. */
    var lv = meta.levels && meta.levels.length ? meta.levels : [meta.level];
    var levelValue, levelCaption;
    if (lv.length > 1) {
      levelValue = lv.length + " niveaux";
      levelCaption =
        (DATA.LEVELS[lv[0]] || lv[0]) +
        " → " +
        (DATA.LEVELS[lv[lv.length - 1]] || lv[lv.length - 1]);
    } else {
      levelValue = DATA.LEVELS[meta.level] || meta.level;
      levelCaption = "Niveau";
    }
    host.innerHTML =
      stat(course.modules.length, "Modules") +
      stat(flat.length, "Leçons") +
      stat("~" + meta.hours + " h", "Durée") +
      stat(levelValue, levelCaption);
  }
  function stat(n, l) {
    return (
      '<div class="start-card__stat"><span class="n">' +
      n +
      '</span><span class="l">' +
      l +
      "</span></div>"
    );
  }

  /* ---- Progression (localStorage, partagée avec lecon.js) -------------- */
  function renderProgress() {
    var host = document.querySelector("[data-course-progress]");
    if (!host) return;
    var done = 0;
    try {
      var p = window.SyntaxeStore.getJSON("syntaxe-progress", {});
      if (p[courseId]) {
        flat.forEach(function (l) {
          if (p[courseId][l.file]) done++;
        });
      }
    } catch (e) {}
    var pct = flat.length ? Math.round((done / flat.length) * 100) : 0;
    host.innerHTML =
      '<div class="progress__head"><span class="progress__label">Ta progression</span>' +
      '<span class="progress__value">' +
      done +
      " / " +
      flat.length +
      "</span></div>" +
      '<div class="progress__track"><div class="progress__bar"></div></div>';
    var bar = host.querySelector(".progress__bar");
    if (bar) bar.style.width = pct + "%";
  }

  /* ---- Meilleur QCM bilan du cours ------------------------------------
     Un cours peut porter PLUSIEURS QCM bilan : css, html, javascript et python
     ont gardé, à la dernière leçon de leur programme d'origine, un bilan de
     palier en plus du bilan final. Le score n'est donc plus forcément rangé
     sous la dernière leçon, comme le supposait ce fichier : on parcourt toutes
     les leçons DÉCLARÉES du cours et on retient le meilleur résultat (au
     ratio ; à ratio égal, celui qui compte le plus de questions).
     Pour les 72 cours à bilan unique, cela renvoie exactement l'objet que
     renvoyait l'ancienne lecture « dernière leçon ». */
  function bilanRatio(b) {
    return b && b.total ? b.best / b.total : 0;
  }
  function bestBilan(cs, lessons) {
    if (!cs || !lessons) return null;
    var best = null;
    for (var i = 0; i < lessons.length; i++) {
      var entry = cs[lessons[i].file];
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

  /* ---- Récap des scores de QCM (localStorage 'syntaxe-quiz') ----------- */
  function renderQuizSummary() {
    var host = document.querySelector("[data-course-progress]");
    if (!host) return;
    var scores = window.SyntaxeStore.getJSON("syntaxe-quiz", {});
    var cs = scores[courseId];
    if (!cs) return;

    var quizDone = 0;
    flat.forEach(function (l) {
      if (cs[l.file] && cs[l.file].quiz) quizDone++;
    });
    var bilan = bestBilan(cs, flat);
    if (!quizDone && !bilan) return;

    var parts = [];
    if (quizDone) parts.push("QCM de leçon complétés : " + quizDone);
    if (bilan) parts.push("🏆 QCM bilan : " + bilan.best + " / " + bilan.total);

    var p = document.createElement("p");
    p.className = "course-quiz-summary";
    p.textContent = parts.join("  ·  ");
    host.appendChild(p);
  }

  /* ---- Bouton « réinitialiser ma progression » (ce cours) ------------- */
  function renderResetButton() {
    var host = document.querySelector("[data-course-progress]");
    if (!host) return;
    var p = window.SyntaxeStore.getJSON("syntaxe-progress", {});
    var q = window.SyntaxeStore.getJSON("syntaxe-quiz", {});
    var hasProgress = !!(p[courseId] || q[courseId]);
    if (!hasProgress) return; // rien à réinitialiser

    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "course-reset";
    btn.textContent = "Réinitialiser ma progression";
    btn.addEventListener("click", function () {
      if (
        !window.confirm(
          "Effacer ta progression et tes scores de QCM pour ce cours ?"
        )
      )
        return;
      /* Ne recharger QUE si l'effacement a réellement eu lieu : un
         location.reload() immédiat détruirait le bandeau d'alerte avant qu'il
         soit affiché (showToast ne le rend visible qu'au bout de 10 ms), et
         l'apprenant verrait sa progression intacte sans un mot d'explication. */
      var ecrit = false;
      try {
        var prog = window.SyntaxeStore.getJSON("syntaxe-progress", {});
        delete prog[courseId];
        ecrit = window.SyntaxeStore.setJSON("syntaxe-progress", prog);
        var sc = window.SyntaxeStore.getJSON("syntaxe-quiz", {});
        delete sc[courseId];
        window.SyntaxeStore.setJSON("syntaxe-quiz", sc);
      } catch (e) {}
      if (ecrit) location.reload();
    });
    host.appendChild(btn);
  }

  /* ---- Badge de fin de cours (diplôme) -------------------------------- */
  /* « Cours terminé » dès que toutes les leçons sont complétées ; « Cours
     maîtrisé » si, en plus, le QCM bilan est réussi (≥ 70 %). */
  function renderCompletionBadge() {
    var card = document.querySelector(".start-card");
    if (!card || !flat.length) return;

    var done = 0;
    try {
      var p = window.SyntaxeStore.getJSON("syntaxe-progress", {});
      if (p[courseId]) {
        flat.forEach(function (l) {
          if (p[courseId][l.file]) done++;
        });
      }
    } catch (e) {}
    if (done < flat.length) return; // cours pas encore terminé

    var mastered = false;
    var bilanTxt = "";
    try {
      var q = window.SyntaxeStore.getJSON("syntaxe-quiz", {});
      var cs = q[courseId];
      var bilan = bestBilan(cs, flat);
      if (bilan && bilan.total && bilan.best / bilan.total >= 0.7) {
        mastered = true;
        bilanTxt = bilan.best + " / " + bilan.total;
      }
    } catch (e) {}

    var el = document.createElement("div");
    el.className = "course-done" + (mastered ? " course-done--master" : "");
    el.innerHTML =
      '<svg class="course-done__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M22 10 12 5 2 10l10 5 10-5Z" /><path d="M6 12v5c0 1.2 2.7 3 6 3s6-1.8 6-3v-5" /></svg>' +
      '<span class="course-done__text">' +
      (mastered ? "Cours maîtrisé" : "Cours terminé") +
      (mastered
        ? ' <span class="course-done__score">QCM bilan&nbsp;: ' + esc(bilanTxt) + "</span>"
        : "") +
      "</span>";
    card.insertBefore(el, card.firstChild);

    /* Cours terminé : proposer le certificat ici même, au moment où la complétion
       est constatée. Jusqu'ici le seul lien menait au certificat depuis
       progression.html, sans ?course= (il fallait re-sélectionner le cours). */
    var cert = document.createElement("a");
    cert.className = "course-done__cert";
    cert.href = "../certificat.html?course=" + encodeURIComponent(courseId);
    cert.innerHTML =
      '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M22 10 12 5 2 10l10 5 10-5Z" /><path d="M6 12v5c0 1.2 2.7 3 6 3s6-1.8 6-3v-5" /></svg>' +
      "<span>Génère ton certificat de réussite</span>";
    el.insertAdjacentElement("afterend", cert);
  }

  /* ---- Accordéon des modules ------------------------------------------ */
  function renderModules() {
    var host = document.querySelector("[data-course-modules]");
    if (!host) return;

    var durs = (DATA.durations && DATA.durations[courseId]) || {};
    var html = "";
    var lastLevel = null;
    course.modules.forEach(function (m, idx) {
      var open = idx === 0 ? " open" : "";
      // Niveau du module (uniquement les cours fusionnés en portent un) : sinon
      // aucun bandeau ni pastille → rendu identique pour tous les autres cours.
      var lvl = m.level || "";
      var lvlLabel = lvl ? (DATA.LEVELS[lvl] || lvl) : "";
      if (lvl && lvl !== lastLevel) {
        html +=
          '<div class="module-band module-band--' + lvl + '">' +
          '<span class="module-band__label">' +
          lvlLabel +
          "</span>" +
          "</div>";
        lastLevel = lvl;
      }
      html +=
        '<details class="module"' +
        (lvl ? ' data-level="' + lvl + '"' : "") +
        open +
        ">";
      html +=
        "<summary>" +
        '<span class="module__num">' +
        m.num +
        "</span>" +
        '<span class="module__head-text">' +
        '<span class="module__title">' +
        m.title +
        "</span>" +
        '<span class="module__sub">' +
        m.sub +
        "</span>" +
        "</span>" +
        (lvl
          ? '<span class="module__level module__level--' +
            lvl +
            '">' +
            lvlLabel +
            "</span>"
          : "") +
        CHEVRON +
        "</summary>";
      html += '<ul class="module__lessons">';
      m.lessons.forEach(function (l) {
        var soon = l.status === "bientot" || l.file === "#";
        if (soon) {
          html +=
            '<li class="module__lesson module__lesson--soon">' +
            '<span class="n">' +
            l.num +
            "</span>" +
            "<span>" +
            l.title +
            "</span>" +
            '<span class="status">Bientôt</span>' +
            "</li>";
        } else {
          var d = durs[l.file];
          html +=
            '<li class="module__lesson">' +
            '<span class="n">' +
            l.num +
            "</span>" +
            '<a href="' +
            l.file +
            '">' +
            l.title +
            "</a>" +
            (d ? '<span class="lesson-dur">~' + d + " min</span>" : "") +
            '<span class="status">' +
            (l.status === "apercu" ? "Aperçu" : "Lire") +
            "</span>" +
            "</li>";
        }
      });
      html += "</ul></details>";
    });
    host.innerHTML = html;
  }

  /* ---- Cours liés (liens annexes inter-cours) -------------------------- */
  function renderRelated() {
    if (!course.related || !course.related.length) return;
    var main = document.querySelector(".course-layout > div");
    if (!main) return;

    var cards = "";
    course.related.forEach(function (r) {
      var rc = DATA.content[r.course];
      if (!rc) return; // on ne lie que vers des cours ayant une page
      cards +=
        '<a class="related-card" data-accent="' + rc.id + '" href="../' + rc.dir + '/cours.html">' +
        '<span class="related-card__glyph" aria-hidden="true">' + ((window.courseLogo && window.courseLogo(rc.id)) || esc(rc.glyph)) + "</span>" +
        '<span class="related-card__body">' +
        '<span class="related-card__title">' + esc(rc.title) + "</span>" +
        '<span class="related-card__note">' + esc(r.note) + "</span>" +
        "</span>" +
        '<svg class="icon related-card__arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>' +
        "</a>";
    });
    if (!cards) return;

    var section = document.createElement("section");
    section.className = "related-section";
    section.innerHTML =
      '<p class="kicker">Cours liés</p>' +
      '<h2 class="u-mt-0">À combiner avec ce cours</h2>' +
      '<p>Ces cours se complètent : suis-les ensemble pour une vision complète.</p>' +
      '<div class="related-grid">' + cards + "</div>";
    main.appendChild(section);
  }

  /* ---- Lien « reprendre le fil rouge » (cours d'un parcours fil rouge) -- */
  /* Deux fils rouges progressifs : le web (pages/fil-rouge.html, 15 étapes) et
     le système (pages/fil-rouge-systeme.html, 8 étapes). Chaque cours concerné
     correspond à une étape (ancre #n). Aucun cours n'est dans les deux. */
  /* Les fils rouges, dans l'ordre de priorité : un cours présent dans plusieurs
     parcours est rattaché au PREMIER de cette liste. Cas réels de conflit :
     python est dans système ET données → résolu en système ; sql dans web ET
     données → résolu en web. */
  var FILS_ROUGES = [
    {
      page: "../fil-rouge-devops.html", total: 4, label: "ta mise en production",
      map: { docker: 1, kubernetes: 2, cicd: 3, iac: 4 },
    },
    {
      page: "../fil-rouge.html", total: 16, label: "ton portfolio full-stack",
      map: {
        html: 1, css: 2, javascript: 3,
        typescript: 7, react: 8, nodejs: 9, sql: 10,
        git: 11, securite: 12, tests: 13, docker: 14, cicd: 15, equipe: 16,
      },
    },
    {
      page: "../fil-rouge-systeme.html", total: 8, label: "ton propre langage",
      map: { compilation: 1, python: 2, algo: 3, c: 4, cpp: 5, rust: 6, zig: 7, asm: 8 },
    },
    {
      page: "../fil-rouge-fonctionnel.html", total: 7, label: "ton calculateur symbolique",
      map: { haskell: 1, ocaml: 2, fsharp: 3, lisp: 4, clojure: 5, elixir: 6, prolog: 7 },
    },
    {
      page: "../fil-rouge-jvm.html", total: 5, label: "ta médiathèque JVM",
      map: { java: 1, kotlin: 2, scala: 3, groovy: 4, clojure: 5 },
    },
    {
      page: "../fil-rouge-donnees.html", total: 7, label: "ton analyse de données",
      map: { python: 1, bdd: 2, sql: 3, r: 4, julia: 5, "data-eng": 7 },
    },
    {
      page: "../fil-rouge-backend.html", total: 7, label: "ton API multi-langages",
      map: { api: 1, go: 2, csharp: 3, php: 4, ruby: 5, nosql: 6, graphql: 7 },
    },
    {
      page: "../fil-rouge-outils.html", total: 9, label: "ton projet web outillé",
      map: { sass: 1, vue: 2, http: 3, regex: 4, formats: 5, patterns: 6, bash: 7, markdown: 8, vscode: 9 },
    },
    {
      page: "../fil-rouge-mobile.html", total: 5, label: "ton app de notes mobile",
      map: { mobile: 1, swift: 2, objc: 3, kotlin: 4, dart: 5 },
    },
    {
      page: "../fil-rouge-arcade.html", total: 6, label: "ton casse-briques",
      map: { python: 1, algo: 2, javascript: 3, "projets-js": 4, lua: 5, cpp: 6 },
    },
    {
      page: "../fil-rouge-morpion.html", total: 5, label: "ton IA de morpion",
      map: { python: 1, algo: 2, prolog: 3, haskell: 4, javascript: 5 },
    },
    {
      page: "../fil-rouge-securite.html", total: 4, label: "ton application sécurisée",
      map: { securite: 1, api: 2, http: 3, tests: 4 },
    },
    {
      page: "../fil-rouge-scripting.html", total: 3, label: "ton automatisation système",
      map: { bash: 1, powershell: 2, perl: 3 },
    },
    {
      page: "../fil-rouge-patrimoine.html", total: 4, label: "le patrimoine logiciel",
      map: { cobol: 1, fortran: 2, pascal: 3, vb: 4 },
    },
    {
      page: "../fil-rouge-frontpro.html", total: 4, label: "ton front-end de pro",
      map: { ux: 1, "a11y": 2, "perf-web": 3, wasm: 4 },
    },
    {
      page: "../fil-rouge-echelle.html", total: 3, label: "ton déploiement à l'échelle",
      map: { archi: 1, cloud: 2, iac: 3 },
    },
    {
      page: "../fil-rouge-ia.html", total: 5, label: "ton application d'IA",
      map: { pandas: 1, stats: 2, ml: 3, llm: 4, dataviz: 5 },
    },
    {
      page: "../fil-rouge-fiabilite.html", total: 2, label: "tes systèmes fiables",
      map: { ada: 1, erlang: 2 },
    },
    {
      page: "../fil-rouge-exploitation.html", total: 4, label: "ton service en production",
      map: { linux: 1, reseaux: 2, os: 3, observabilite: 4 },
    },
  ];
  function makeFilRougeLink(hit) {
    var a = document.createElement("a");
    a.className = "start-card__filrouge";
    a.href = hit.page + "#" + hit.n;
    a.setAttribute("data-accent", courseId);
    a.innerHTML =
      '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>' +
      '<span><strong>Fil rouge · étape ' + hit.n + " / " + hit.total + "</strong><br>Reprends " + hit.label + " ici.</span>";
    return a;
  }
  function renderFilRouge() {
    var card = document.querySelector(".start-card");
    if (!card) return;
    /* Un cours peut appartenir à PLUSIEURS fils rouges (ex. python : système,
       données, arcade, morpion). On les collecte TOUS, dans l'ordre de priorité
       de la table, pour qu'aucun fil ne devienne inatteignable. */
    var hits = [];
    for (var i = 0; i < FILS_ROUGES.length; i++) {
      var step = FILS_ROUGES[i].map[courseId];
      if (step) {
        hits.push({
          page: FILS_ROUGES[i].page,
          total: FILS_ROUGES[i].total,
          label: FILS_ROUGES[i].label,
          n: step,
        });
      }
    }
    if (!hits.length) return;
    if (hits.length === 1) {
      card.appendChild(makeFilRougeLink(hits[0]));
      return;
    }
    var wrap = document.createElement("div");
    wrap.className = "start-card__filrouges";
    var title = document.createElement("p");
    title.className = "start-card__filrouges-title";
    title.textContent = "Ce cours fait partie de " + hits.length + " fils rouges :";
    wrap.appendChild(title);
    hits.forEach(function (hit) {
      wrap.appendChild(makeFilRougeLink(hit));
    });
    card.appendChild(wrap);
  }

  /* ---- Lien « projet à réaliser » (brief contextualisé du cours) ------ */
  /* Chaque cours a au moins un brief dans js/projets-data.js (couverture 100 %
     vérifiée). On ne charge pas cette donnée ici (196 Ko) : le lien passe le
     cours en ancre, et pages/projets.html sélectionne le premier projet du
     cours via #course=<id>. */
  function renderProjetLink() {
    var card = document.querySelector(".start-card");
    if (!card) return;
    var a = document.createElement("a");
    a.className = "start-card__projet";
    a.href = "../projets.html#course=" + encodeURIComponent(courseId);
    a.setAttribute("data-accent", courseId);
    a.innerHTML =
      '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" /><rect x="8" y="2" width="8" height="4" rx="1" /><path d="M9 14l2 2 4-4" /></svg>' +
      "<span><strong>Projet à réaliser</strong><br>Mets ce cours en pratique sur un cas concret.</span>";
    card.appendChild(a);
  }

  /* ---- Lien « antisèche du cours » (référence rapide) -----------------
     Les 83 cours ont au moins une antisèche (vérifié : 0 cours sans fiche).
     On passe le DOSSIER du cours en ancre : pages/antiseches.html indexe ses
     fiches par dossier (js, pas javascript) et s'ouvre directement dessus.
     N'ajoute aucune donnée sur la page (les 1,2 Mo d'antiseches-data.js ne sont
     chargés que sur la page antisèche elle-même). */
  function renderAntisecheLink() {
    var card = document.querySelector(".start-card");
    if (!card || !course.dir) return;
    var a = document.createElement("a");
    a.className = "start-card__antiseche";
    a.href = "../antiseches.html#" + encodeURIComponent(course.dir);
    a.setAttribute("data-accent", courseId);
    a.innerHTML =
      '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="4" y="3" width="16" height="18" rx="2" /><path d="M8 8h8M8 12h8M8 16h5" /></svg>' +
      "<span><strong>Antisèche du cours</strong><br>Toute la syntaxe essentielle sur une fiche à imprimer.</span>";
    card.appendChild(a);
  }

  /* ---- Lien « livret de révision » (PDF) ------------------------------ */
  function renderPrintLink() {
    /* Le lien était réservé à HTTP : assembler le TEXTE INTÉGRAL des leçons
       demande un fetch, refusé en file://. Depuis V12-E2, la page produit un
       LIVRET (plan + antisèches + glossaire + pièges) construit à partir
       d'index déjà présents dans le dépôt : il fonctionne en file://, donc le
       lien s'affiche partout. En HTTP, la page propose en plus le texte
       intégral, en section à cocher. */
    var card = document.querySelector(".start-card");
    if (!card || !course.dir) return;
    var a = document.createElement("a");
    a.className = "start-card__print";
    a.href = "../imprimer.html?cours=" + encodeURIComponent(course.dir);
    a.innerHTML =
      '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2M6 14h12v8H6z" /></svg>' +
      "Livret de révision à imprimer (PDF)";
    card.appendChild(a);
  }

  renderStats();
  renderProgress();
  renderQuizSummary();
  renderResetButton();
  renderCompletionBadge();
  renderFilRouge();
  renderProjetLink();
  renderAntisecheLink();
  renderPrintLink();
  renderModules();
  renderRelated();
})();
