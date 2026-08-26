/* =============================================================================
   lecon.js — Comportements de la page de leçon :
   - construit la navigation du cours (liste des leçons + complétion) ;
   - construit le sommaire (TOC) + scrollspy ;
   - suit la progression (localStorage) et la barre de lecture ;
   - liens Précédent / Suivant.
   La page déclare : <body data-course="javascript" data-lesson="js-lecon-01.html">
   ============================================================================= */
(function () {
  "use strict";

  var DATA = window.SITE_DATA;
  if (!DATA) return;

  var body = document.body;
  var courseId = body.getAttribute("data-course");
  var lessonFile = body.getAttribute("data-lesson");
  var course = DATA.content && DATA.content[courseId];
  if (!course) return;

  /* Niveau global du cours (fiche dans DATA.courses) : sert de repli pour colorer
     la barre latérale des cours dont les modules ne portent pas de `level`. */
  var courseLevel = "";
  (DATA.courses || []).some(function (c) {
    if (c.id === courseId) {
      courseLevel = c.level || "";
      return true;
    }
    return false;
  });

  /* Liste à plat des leçons du cours (dans l'ordre) */
  var flat = [];
  course.modules.forEach(function (m) {
    m.lessons.forEach(function (l) {
      flat.push({ mod: m, lesson: l });
    });
  });
  var currentIndex = -1;
  for (var i = 0; i < flat.length; i++) {
    if (flat[i].lesson.file === lessonFile) {
      currentIndex = i;
      break;
    }
  }

  /* ----------------------------------------------- Progression (storage) */
  var PKEY = "syntaxe-progress";
  function readProgress() {
    return window.SyntaxeStore.getJSON(PKEY, {});
  }
  function writeProgress(p) {
    window.SyntaxeStore.setJSON(PKEY, p);
  }
  /* La progression est indexée par NOM DE FICHIER : p[courseId]["lecon-NN.html"].
     Lors des étoffements, des leçons ont été insérées avant le capstone de certains
     cours (a11y, docker, nosql, os, perf-web…), donc le capstone a changé de numéro
     (ex. nosql : lecon-11 → lecon-14 ; a11y : → lecon-15). Une progression enregistrée
     AVANT une réaffectation peut donc pointer un contenu différent. C'est ASSUMÉ, et non
     migrable : contrairement à ANCIENS_IDS (js/projets.js), qui redirige un id SUPPRIMÉ
     vers un id vivant, ici « lecon-11.html » n'est pas supprimé — il porte désormais un
     contenu légitime. Rediriger l'ancien numéro casserait la progression des personnes
     ayant vraiment fait la nouvelle leçon. La structure interne, elle, reste cohérente
     (numérotation pleine, capstone en dernière position, 0 lien interne cassé). */
  function isDone(file) {
    var p = readProgress();
    return !!(p[courseId] && p[courseId][file]);
  }
  function setDone(file, done) {
    var p = readProgress();
    if (!p[courseId]) p[courseId] = {};
    if (done) p[courseId][file] = true;
    else delete p[courseId][file];
    writeProgress(p);
    logDailyDone(file, done);
  }
  /* Journal daté des leçons TERMINÉES, pour l'objectif quotidien : il compte les
     leçons DISTINCTES achevées dans la journée (clé « courseId/file »), et non les
     chargements de page. « syntaxe-activity » reste, lui, le journal de visites
     (heatmap & séries) — on ne le touche pas ici. */
  function logDailyDone(file, done) {
    try {
      var log = window.SyntaxeStore.getJSON("syntaxe-done-log", {});
      var d = new Date();
      var mm = d.getMonth() + 1, dd = d.getDate();
      var day = d.getFullYear() + "-" + (mm < 10 ? "0" + mm : mm) + "-" + (dd < 10 ? "0" + dd : dd);
      var key = courseId + "/" + file;
      var arr = log[day] || [];
      var i = arr.indexOf(key);
      if (done && i === -1) arr.push(key);
      else if (!done && i !== -1) arr.splice(i, 1);
      log[day] = arr;
      window.SyntaxeStore.setJSON("syntaxe-done-log", log);
    } catch (e) {}
  }
  function countDone() {
    var p = readProgress();
    var c = 0;
    if (p[courseId]) {
      flat.forEach(function (it) {
        if (p[courseId][it.lesson.file]) c++;
      });
    }
    return c;
  }

  /* ---- Scores de QCM (mémorisés en localStorage, par leçon) ---- */
  var QKEY = "syntaxe-quiz";
  function readQuizScores() {
    return window.SyntaxeStore.getJSON(QKEY, {});
  }
  function getQuizBest(scoreKey) {
    var q = readQuizScores();
    return (
      (q[courseId] &&
        q[courseId][lessonFile] &&
        q[courseId][lessonFile][scoreKey]) ||
      null
    );
  }
  /* `rates` = index (0-based) des questions manquées lors de CET essai. On ne
     les garde que si l'essai devient le meilleur, pour qu'ils décrivent bien le
     score conservé et non un essai plus ancien. C'est ce qui permet de dire
     quelle NOTION est à revoir, et pas seulement quelle leçon (V12-C3). */
  function saveQuizBest(scoreKey, good, total, rates) {
    var q = readQuizScores();
    if (!q[courseId]) q[courseId] = {};
    if (!q[courseId][lessonFile]) q[courseId][lessonFile] = {};
    var prev = q[courseId][lessonFile][scoreKey];
    /* On compare des RATIOS, pas des comptes bruts : un 8/8 (parfait) doit battre
       un ancien 9/10, et le nombre de questions d'un QCM peut changer entre deux
       tentatives. prev.total absent/0 (ancienne donnée) → on écrase sans hésiter. */
    var prevRatio = prev && prev.total ? prev.best / prev.total : -1;
    var newRatio = total > 0 ? good / total : 0;
    if (!prev || newRatio > prevRatio) {
      var entree = { best: good, total: total };
      if (rates && rates.length) entree.rates = rates.slice();
      q[courseId][lessonFile][scoreKey] = entree;
      window.SyntaxeStore.setJSON(QKEY, q);
    }
  }

  var CHECK =
    '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>';

  /* ------------------------------------------------- Échappement HTML (unique)
     Plusieurs blocs de cette page sont fabriqués par concaténation de chaînes,
     puis posés d'un coup via innerHTML. Toute donnée venant du CONTENU (titre de
     cours ou de leçon, texte d'un <h2>, libellé de QCM…) doit donc être échappée
     AVANT d'être concaténée : sinon un simple « <template> » écrit dans un titre
     crée un VRAI élément et détruit le bloc.
     Mesure faite sur tout le corpus avant d'écrire cette fonction : sur les
     71 435 chaînes des blocs data-quiz / data-quiz-bilan / data-exos, 860
     contiennent du balisage — et ce balisage est À CHAQUE FOIS du code montré en
     exemple (« <b> », « <script> », « <li> », « <!DOCTYPE html> »…), jamais de la
     mise en forme voulue. Même constat pour les 76 titres de section concernés.
     L'échappement TOTAL est donc la bonne réponse partout : aucune liste blanche
     n'est nécessaire, et aucune mise en forme volontaire n'est perdue. */
  function escapeHTML(s) {
    return (s == null ? "" : String(s)).replace(/[&<>"']/g, function (c) {
      return {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      }[c];
    });
  }

  /* ----------------------------------------------- Navigation du cours */
  function buildCourseNav() {
    var host = document.querySelector("[data-coursenav]");
    if (!host) return;

    var html = "";
    html +=
      '<a class="coursenav__course" href="' +
      escapeHTML(course.overview) +
      '">' +
      escapeHTML(course.title) +
      "</a>";

    // mini progression
    html +=
      '<div class="progress" data-course-progress>' +
      '<div class="progress__head"><span class="progress__label">Progression</span>' +
      '<span class="progress__value" data-progress-value>0 / ' +
      flat.length +
      "</span></div>" +
      '<div class="progress__track"><div class="progress__bar" data-progress-bar></div></div>' +
      "</div>";

    course.modules.forEach(function (m) {
      html += '<div class="coursenav__module">';
      html +=
        '<div class="coursenav__module-title">' +
        escapeHTML(m.num) +
        " · " +
        escapeHTML(m.title) +
        "</div><ol>";
      // Niveau reporté sur chaque <li> pour colorer le numéro, le marqueur et le
      // filet latéral : celui du MODULE pour les cours fusionnés à 3 niveaux,
      // sinon celui du COURS (repli, pour que toutes les barres soient colorées).
      var lvl = m.level || courseLevel;
      var lvlAttr = lvl ? ' data-level="' + escapeHTML(lvl) + '"' : "";
      // La couleur seule ne transmet pas le niveau (échec WCAG 1.4.1) : on double
      // l'information par un libellé TEXTUEL, lu par les lecteurs d'écran et
      // visible au survol. Le libellé lisible vient de DATA.LEVELS (source unique
      // des noms de niveaux), jamais d'une chaîne écrite en dur ici.
      var lvlName = (lvl && DATA.LEVELS && DATA.LEVELS[lvl]) || "";
      if (lvlName) {
        lvlAttr +=
          ' title="Niveau : ' +
          escapeHTML(lvlName) +
          '" aria-label="Niveau : ' +
          escapeHTML(lvlName) +
          '"';
      }
      m.lessons.forEach(function (l) {
        var here = l.file === lessonFile;
        var soon = l.status === "bientot" || l.file === "#";
        var done = !soon && isDone(l.file);
        var cls =
          "coursenav__link" + (done ? " is-done" : "") + (soon ? " is-soon" : "");
        var attrs = here ? ' aria-current="page"' : "";
        var inner =
          '<span class="coursenav__num">' +
          escapeHTML(l.num) +
          "</span>" +
          "<span>" +
          escapeHTML(l.title) +
          "</span>" +
          '<span class="coursenav__check" aria-hidden="true">' +
          CHECK +
          "</span>";
        if (soon) {
          html +=
            "<li" + lvlAttr + "><span class=\"" + cls + "\">" + inner + "</span></li>";
        } else {
          html +=
            "<li" + lvlAttr + '><a class="' + cls + '" href="' + escapeHTML(l.file) + '"' + attrs + ">" + inner + "</a></li>";
        }
      });
      html += "</ol></div>";
    });

    host.innerHTML = html;
  }

  /* ----------------------------------------------- Mise à jour progression UI */
  function refreshProgressUI() {
    var done = countDone();
    var pct = flat.length ? Math.round((done / flat.length) * 100) : 0;
    document.querySelectorAll("[data-progress-value]").forEach(function (el) {
      el.textContent = done + " / " + flat.length;
    });
    document.querySelectorAll("[data-progress-bar]").forEach(function (el) {
      el.style.width = pct + "%";
    });
  }

  /* ----------------------------------------------- Bouton « terminer » */
  function initCompleteButton() {
    var btn = document.querySelector("[data-complete-toggle]");
    if (!btn || currentIndex === -1) return;

    function paint() {
      var done = isDone(lessonFile);
      btn.setAttribute("aria-pressed", done ? "true" : "false");
      btn.classList.toggle("btn--primary", !done);
      btn.classList.toggle("btn--secondary", done);
      btn.innerHTML = done
        ? CHECK + "<span>Leçon terminée</span>"
        : '<span>Marquer comme terminée</span>';
      // met à jour les pastilles de la nav
      var link = document.querySelector(
        '.coursenav__link[href="' + lessonFile + '"]'
      );
      if (link) link.classList.toggle("is-done", done);
      refreshProgressUI();
      paintCert();
    }

    /* Quand cette leçon complète le cours (100 %), proposer le certificat ici
       même — le bon moment, là où la complétion vient d'être constatée. */
    function paintCert() {
      var complete = flat.length > 0 && countDone() === flat.length;
      var existing = document.querySelector(".lesson-cert");
      if (complete && !existing) {
        var p = document.createElement("p");
        p.className = "lesson-cert";
        p.innerHTML =
          '<span aria-hidden="true">🎓</span> Tu as terminé ce cours&nbsp;! ' +
          '<a href="../certificat.html?course=' + encodeURIComponent(courseId) +
          '">Génère ton certificat de réussite</a>, ou passe à la pratique avec ' +
          '<a href="../projets.html#course=' + encodeURIComponent(courseId) +
          '">le projet du cours</a>.';
        btn.parentNode.insertBefore(p, btn.nextSibling);
      } else if (!complete && existing) {
        existing.remove();
      }
    }

    btn.addEventListener("click", function () {
      setDone(lessonFile, !isDone(lessonFile));
      paint();
    });
    paint();
  }

  /* ----------------------------------------------- Précédent / Suivant */
  function buildPrevNext() {
    var host = document.querySelector("[data-lesson-nav]");
    if (!host || currentIndex === -1) return;

    function linkable(it) {
      return it && it.lesson.file !== "#" && it.lesson.status !== "bientot";
    }
    var prev = flat[currentIndex - 1];
    var next = flat[currentIndex + 1];
    var html = "";

    if (linkable(prev)) {
      html +=
        '<a class="lesson-nav__link lesson-nav__link--prev" href="' +
        escapeHTML(prev.lesson.file) +
        '"><span class="lesson-nav__dir">← Précédent</span>' +
        '<span class="lesson-nav__title">' +
        escapeHTML(prev.lesson.title) +
        "</span></a>";
    } else {
      html +=
        '<span class="lesson-nav__link lesson-nav__link--prev lesson-nav__link--disabled">' +
        '<span class="lesson-nav__dir">← Précédent</span>' +
        '<span class="lesson-nav__title">' +
        // Symétrique de la branche « suivant » : une leçon précédente existe mais
        // n'est pas encore publiée ≠ on est vraiment au début du cours.
        (prev ? "Bientôt disponible" : "Début du cours") +
        "</span></span>";
    }

    if (linkable(next)) {
      html +=
        '<a class="lesson-nav__link lesson-nav__link--next" href="' +
        escapeHTML(next.lesson.file) +
        '"><span class="lesson-nav__dir">Suivant →</span>' +
        '<span class="lesson-nav__title">' +
        escapeHTML(next.lesson.title) +
        "</span></a>";
    } else {
      html +=
        '<span class="lesson-nav__link lesson-nav__link--next lesson-nav__link--disabled">' +
        '<span class="lesson-nav__dir">Suivant →</span>' +
        '<span class="lesson-nav__title">' +
        (next ? "Bientôt disponible" : "Fin du cours") +
        "</span></span>";
    }
    host.innerHTML = html;
  }

  /* ----------------------------------------------- Sommaire (TOC) + scrollspy */
  function slugify(s) {
    return s
      .toLowerCase()
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }

  function buildTOC() {
    var article = document.querySelector(".prose");
    var hosts = document.querySelectorAll("[data-toc]");
    if (!article || !hosts.length) return;

    var heads = Array.prototype.slice.call(article.querySelectorAll("h2"));
    if (!heads.length) {
      hosts.forEach(function (h) {
        h.closest(".toc-inline, .lesson-toc-rail")?.style &&
          (h.closest(".toc-inline, .lesson-toc-rail").style.display = "none");
      });
      return;
    }

    heads.forEach(function (h) {
      if (!h.id) h.id = slugify(h.textContent);
    });

    // Le sommaire est construit en DOM (createElement + textContent), et non par
    // concaténation de HTML : le TEXTE d'un titre contient très souvent des
    // chevrons (mesuré sur le site : 76 titres sur 14 792, répartis dans 48
    // leçons — « La balise <img> : src et alt », « La solution : <template
    // shadowrootmode> », « Les <link> : favicon, CSS, canonical »…). Réinjecté
    // en HTML, ce texte créait de VRAIS éléments dans le sommaire (<template>,
    // <title>, <input>, <dialog>, <slot>…) et tronquait la liste : sur
    // html/lecon-46, 2 entrées s'affichaient au lieu de 8 ; sur html/lecon-14,
    // 2 au lieu de 13. textContent rend exactement le même texte que le titre,
    // sans jamais rien interpréter.
    hosts.forEach(function (host) {
      var ol = document.createElement("ol");
      heads.forEach(function (h) {
        var li = document.createElement("li");
        var a = document.createElement("a");
        a.setAttribute("href", "#" + h.id);
        a.textContent = h.textContent;
        li.appendChild(a);
        ol.appendChild(li);
      });
      host.textContent = "";
      host.appendChild(ol);
    });

    // Scrollspy
    var links = {};
    document.querySelectorAll("[data-toc] a").forEach(function (a) {
      var id = a.getAttribute("href").slice(1);
      (links[id] = links[id] || []).push(a);
    });

    function setActive(id) {
      Object.keys(links).forEach(function (key) {
        links[key].forEach(function (a) {
          a.classList.toggle("is-active", key === id);
        });
      });
    }

    if ("IntersectionObserver" in window) {
      var visible = new Set();
      var io = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (en) {
            if (en.isIntersecting) visible.add(en.target.id);
            else visible.delete(en.target.id);
          });
          // active = premier titre visible dans l'ordre du document
          for (var k = 0; k < heads.length; k++) {
            if (visible.has(heads[k].id)) {
              setActive(heads[k].id);
              return;
            }
          }
        },
        { rootMargin: "-80px 0px -70% 0px", threshold: 0 }
      );
      heads.forEach(function (h) {
        io.observe(h);
      });
    }
  }

  /* ----------------------------------------------- Barre de lecture */
  function initReadingProgress() {
    var bar = document.querySelector("[data-reading-progress]");
    var article = document.querySelector(".lesson-main") || document.querySelector(".prose");
    if (!bar || !article) return;

    function update() {
      var rect = article.getBoundingClientRect();
      var total = article.offsetHeight - window.innerHeight;
      var scrolled = -rect.top;
      var pct = total > 0 ? Math.min(100, Math.max(0, (scrolled / total) * 100)) : 0;
      bar.style.width = pct + "%";
    }
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    update();
  }

  /* ----------------------------------------------- Repli du plan (mobile) */
  function initCourseNavToggle() {
    var toggle = document.querySelector("[data-coursenav-toggle]");
    var wrap = document.querySelector("[data-coursenav-host]");
    if (!toggle || !wrap) return;
    toggle.addEventListener("click", function () {
      var open = wrap.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  /* ----------------------------------------------- Quiz interactif
     Une leçon peut fournir un QCM auto-corrigé via un bloc :
       <script type="application/json" data-quiz>
         [ {"q":"…","a":["bonne","mauvaise",…],"correct":0,"explain":"…"} ]
       </script>
     (placé dans l'article). Si présent, il remplace les questions ouvertes
     du bloc « Vérifie ta compréhension ». Sinon, ces questions restent. */
  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i];
      a[i] = a[j];
      a[j] = t;
    }
    return a;
  }

  function buildQuiz(data, scoreKey) {
    var mount = document.createElement("div");
    mount.className = "quiz";
    mount.setAttribute("role", "group");
    mount.setAttribute("aria-label", "Quiz d'auto-évaluation");

    var total = data.length;
    var answered = 0;
    var good = 0;
    var rates = []; /* index des questions manquées, dans l'ordre du bloc */

    data.forEach(function (item, qi) {
      // mélange les options en gardant trace de la bonne réponse
      var opts = item.a.map(function (text, i) {
        return { text: text, correct: i === (item.correct || 0) };
      });
      opts = shuffle(opts);

      var q = document.createElement("div");
      q.className = "quiz__q";
      var html =
        '<p class="quiz__prompt"><span class="quiz__n">' +
        (qi + 1) +
        ".</span> " +
        escapeHTML(item.q) +
        "</p>" +
        '<div class="quiz__options">';
      opts.forEach(function (o, oi) {
        html +=
          '<button class="quiz__opt" type="button" data-i="' +
          oi +
          '" data-correct="' +
          (o.correct ? "1" : "0") +
          '">' +
          escapeHTML(o.text) +
          "</button>";
      });
      html += "</div>";
      if (item.explain) {
        html += '<p class="quiz__explain" hidden>' + escapeHTML(item.explain) + "</p>";
      }
      q.innerHTML = html;

      var locked = false;
      q.querySelectorAll(".quiz__opt").forEach(function (btn) {
        btn.addEventListener("click", function () {
          if (locked) return;
          locked = true;
          // L'option choisie va être désactivée : si elle a le focus (réponse au
          // clavier), il retomberait sur <body> et un Tab repartirait du haut de
          // la page (audit C1). On mémorise pour replacer le focus ensuite.
          var hadFocus = document.activeElement === btn;
          var ok = btn.getAttribute("data-correct") === "1";
          answered++;
          if (ok) {
            good++;
            btn.classList.add("is-correct");
          } else {
            rates.push(qi);
            btn.classList.add("is-wrong");
            // révèle la bonne
            q.querySelectorAll('.quiz__opt[data-correct="1"]').forEach(function (g) {
              g.classList.add("is-correct");
            });
          }
          q.querySelectorAll(".quiz__opt").forEach(function (b) {
            b.disabled = true;
            /* La couleur et le symbole ✓/✗ ne disent rien à un lecteur d'écran :
               on nomme explicitement l'état de chaque option révélée, pour que
               l'utilisateur sache s'il a répondu juste (WCAG 1.4.1). */
            if (b.classList.contains("is-correct")) {
              b.setAttribute("aria-label", "Bonne réponse : " + b.textContent.trim());
            } else if (b.classList.contains("is-wrong")) {
              b.setAttribute("aria-label", "Mauvaise réponse : " + b.textContent.trim());
            }
          });
          var ex = q.querySelector(".quiz__explain");
          if (ex) ex.hidden = false;
          updateScore();
          // Replace le focus sur le retour immédiat (l'explication, sinon la
          // question) : le lecteur d'écran l'annonce et le Tab suivant mène à la
          // question d'après plutôt que de repartir du haut.
          if (hadFocus) {
            var t = ex || q;
            t.setAttribute("tabindex", "-1");
            try { t.focus(); } catch (e) {}
          }
        });
      });

      mount.appendChild(q);
    });

    var score = document.createElement("p");
    score.className = "quiz__score";
    score.setAttribute("aria-live", "polite");
    mount.appendChild(score);

    var best = document.createElement("p");
    best.className = "quiz__best";
    mount.appendChild(best);

    function paintBest() {
      var b = getQuizBest(scoreKey);
      best.textContent = b
        ? "🏆 Meilleur score : " + b.best + " / " + b.total
        : "";
    }
    paintBest();

    function updateScore() {
      if (answered < total) {
        score.textContent = answered + " / " + total + " répondues";
      } else {
        score.textContent = "Score : " + good + " / " + total +
          (good === total ? " — parfait ! 🎉" : "");
        score.classList.add("is-final");
        saveQuizBest(scoreKey, good, total, rates);
        paintBest();
      }
    }
    updateScore();

    return mount;
  }

  function initQuiz() {
    var holder = document.querySelector("[data-quiz]");
    if (!holder) return;
    var data;
    try {
      data = JSON.parse(holder.textContent);
    } catch (e) {
      return;
    }
    if (!data || !data.length) return;

    var mount = buildQuiz(data, "quiz");
    var check = document.querySelector(".lesson-check");
    if (check) {
      // masque les questions ouvertes, garde le titre « Vérifie ta compréhension »
      var ol = check.querySelector("ol");
      if (ol) ol.style.display = "none";
      check.appendChild(mount);
    } else {
      var article = document.querySelector(".prose");
      if (article) article.appendChild(mount);
    }
  }

  // QCM bilan : un second bloc indépendant
  //   <script type="application/json" data-quiz-bilan>[ … ]</script>
  // rendu dans une section titrée, à l'emplacement du bloc.
  //
  // L'attribut peut porter un LIBELLÉ, et c'est alors un bilan de PALIER et non
  // de fin de cours :
  //   <script type="application/json" data-quiz-bilan="Bilan du niveau intermédiaire">
  // Quatre leçons s'en servent (css/20, html/25, js/37, python/28) : ce sont les
  // dernières leçons des cours d'origine, avant que les niveaux avancés ne soient
  // ajoutés à la suite. Sans ce libellé, elles annonçaient « QCM bilan du cours »
  // au beau milieu du parcours. Attribut vide ou absent = comportement d'origine,
  // celui dont dépendent les 76 bilans de fin de cours.
  var QUIZ_BILAN_TITLE = "QCM bilan du cours";
  var QUIZ_BILAN_INTRO =
    "Quelques questions pour réviser l'ensemble des notions du cours.";
  var QUIZ_PALIER_INTRO =
    "Quelques questions pour faire le point sur les notions vues jusqu'ici.";

  function initQuizBilan() {
    var holder = document.querySelector("[data-quiz-bilan]");
    if (!holder) return;
    var data;
    try {
      data = JSON.parse(holder.textContent);
    } catch (e) {
      return;
    }
    if (!data || !data.length) return;

    var label = holder.getAttribute("data-quiz-bilan");
    label = label ? String(label).trim() : "";

    var section = document.createElement("section");
    section.className = "quiz-bilan";
    var h2 = document.createElement("h2");
    h2.textContent = label || QUIZ_BILAN_TITLE;
    section.appendChild(h2);
    var intro = document.createElement("p");
    intro.textContent = label ? QUIZ_PALIER_INTRO : QUIZ_BILAN_INTRO;
    section.appendChild(intro);
    section.appendChild(buildQuiz(data, "bilan"));

    holder.parentNode.insertBefore(section, holder.nextSibling);
  }

  /* ============================================================ Exercices
     interactifs : champ de saisie (texte ou code), correction, indices
     progressifs (2/5/8 essais) puis lien vers la notion (10 essais).
     La bonne réponse n'est JAMAIS révélée automatiquement.
     Données : <script type="application/json" data-exos>[ ... ]</script>
     dont chaque entrée (alignée sur les .exercise, null = exercice laissé tel
     quel) vaut { type:"text"|"code", accept:[...], run:{expect:"..."},
     placeholder, hints:[...], link:{href,label} }.                          */
  var EXO_HINT_STEPS = [2, 5, 8];
  var EXO_LINK_STEP = 10;

  /* Vrai si l'une des lignes de la sortie est EXACTEMENT la valeur attendue.
     Les énoncés du site disent « le programme doit afficher X » : un programme qui
     affiche X parmi d'autres lignes répond donc à la consigne. La comparaison reste
     stricte — c'est une égalité de ligne entière, pas une inclusion. */
  function uneLigneEgale(sortie, attendu) {
    var lignes = String(sortie == null ? "" : sortie).split(/\r?\n/);
    var cible = normExo(attendu);
    for (var i = 0; i < lignes.length; i++) if (normExo(lignes[i]) === cible) return true;
    return false;
  }

  function normExo(s) {
    s = s == null ? "" : String(s);
    s = s
      .replace(/ /g, " ")
      .replace(/[‘’]/g, "'")
      .replace(/[“”]/g, '"');
    if (s.normalize) s = s.normalize("NFD").replace(/[̀-ͯ]/g, "");
    return s.trim().replace(/\s+/g, " ").replace(/;+\s*$/, "").toLowerCase();
  }

  var EXO_WORKER_SRC = [
    "self.onmessage=function(ev){",
    " var out=[];",
    " function fmt(v){ if(typeof v==='string')return v; if(v===undefined)return 'undefined'; if(v===null)return 'null'; try{return JSON.stringify(v);}catch(e){return String(v);} }",
    " function cap(){ out.push(Array.prototype.slice.call(arguments).map(fmt).join(' ')); }",
    " ['log','info','debug','warn','error'].forEach(function(l){ console[l]=cap; });",
    " try{ (0,eval)(ev.data); }catch(err){ out.push((err&&err.message)?err.name+': '+err.message:String(err)); }",
    " self.postMessage(out.join('\\n'));",
    "};",
  ].join("\n");

  /* ---- Exercices type:"regex" : le motif est CORRIGÉ EN L'EXÉCUTANT ----------
     Un exercice de regex corrigé par `accept:[…]` compare deux chaînes : il refuse
     `p.{2}t` là où il accepte `p..t` — les deux répondent pourtant — et il accepte
     n'importe quelle graphie voisine de la réponse notée, juste ou fausse. On
     confronte donc ici la RegExp de l'apprenant à des CAS : `ok` (doit matcher),
     `ko` (ne doit pas matcher), `capte` (résultat exact de `.match()`, groupes
     compris). Le test part dans le MÊME Worker que les exercices de code, ce qui
     borne à 3 s un motif à retour arrière explosif — que la page principale
     subirait sans recours. Le motif de l'apprenant n'est jamais concaténé au
     programme : il y entre par `JSON.stringify`, donc comme une chaîne.
     ⚠️ Le corps du test est sérialisé par `Function.prototype.toString()` : cela
     suppose que le site n'est JAMAIS minifié — c'est une contrainte fondatrice
     (aucun build), pas un hasard. */
  function TEST_REGEX(saisie, drapeaux, cas) {
    /* JSON.stringify suit l'ordre d'insertion : sans tri, deux objets identiques
       déclarés dans un autre ordre se compareraient différents. */
    function trier(o) {
      if (!o) return null;
      var cles = Object.keys(o).sort(), r = {}, k;
      for (k = 0; k < cles.length; k++) r[cles[k]] = o[cles[k]];
      return r;
    }
    var s = String(saisie).trim(), fl = String(drapeaux || "");
    var forme = /^\/([\s\S]*)\/([a-z]*)$/.exec(s);
    if (forme) { s = forme[1]; fl = forme[2]; }
    var re, reT;
    try {
      re = new RegExp(s, fl);
      /* `.test()` avec le drapeau g avance `lastIndex` : un même motif répondrait
         différemment au 2ᵉ appel. On teste donc l'appartenance sans g ni y. */
      reT = new RegExp(s, fl.replace(/[gy]/g, ""));
    } catch (e) {
      console.log("✗ Motif invalide : " + e.message);
      return;
    }
    var pb = [], n = 0, i;
    for (i = 0; i < (cas.ok || []).length; i++) {
      n++;
      if (!reT.test(cas.ok[i])) pb.push("· devrait matcher, et ne matche pas : " + JSON.stringify(cas.ok[i]));
    }
    for (i = 0; i < (cas.ko || []).length; i++) {
      n++;
      if (reT.test(cas.ko[i])) pb.push("· ne devrait PAS matcher, et matche : " + JSON.stringify(cas.ko[i]));
    }
    for (i = 0; i < (cas.capte || []).length; i++) {
      n++;
      var p = cas.capte[i], r = null;
      try { re.lastIndex = 0; r = String(p[0]).match(re); } catch (e2) { r = null; }
      var eu = r ? Array.prototype.slice.call(r) : null;
      if (JSON.stringify(eu) !== JSON.stringify(p[1])) {
        pb.push("· sur " + JSON.stringify(p[0]) + " : attendu " + JSON.stringify(p[1]) + ", obtenu " + JSON.stringify(eu));
      }
    }
    /* `groupes` : un motif à groupes NOMMÉS ne se distingue pas d'un motif à groupes
       numérotés par le seul tableau de `.match()` — les deux rendent les mêmes
       tranches. On compare donc `.groups`, seul endroit où le nom existe. */
    for (i = 0; i < (cas.groupes || []).length; i++) {
      n++;
      var g = cas.groupes[i], rg = null;
      try { re.lastIndex = 0; rg = String(g[0]).match(re); } catch (e3) { rg = null; }
      var vus = rg && rg.groups ? trier(rg.groups) : null;
      if (JSON.stringify(vus) !== JSON.stringify(trier(g[1]))) {
        pb.push("· groupes nommés sur " + JSON.stringify(g[0]) + " : attendu " + JSON.stringify(trier(g[1])) + ", obtenu " + JSON.stringify(vus));
      }
    }
    if (!pb.length) {
      console.log("REGEX-OK");
      console.log(n + " cas passent.");
      return;
    }
    console.log("✗ " + pb.length + " cas sur " + n + (pb.length > 1 ? " échouent :" : " échoue :"));
    for (i = 0; i < pb.length && i < 4; i++) console.log(pb[i]);
    if (pb.length > 4) console.log("· " + (pb.length - 4) + " autre(s).");
  }

  function programmeRegex(saisie, cas) {
    return "(" + TEST_REGEX.toString() + ")(" +
      JSON.stringify(String(saisie)) + ", " +
      JSON.stringify(String(cas.flags || "")) + ", " +
      JSON.stringify({ ok: cas.ok || [], ko: cas.ko || [], capte: cas.capte || [], groupes: cas.groupes || [] }) + ");";
  }

  /* ---- Exercices type:"sql" : la requête est CORRIGÉE EN L'EXÉCUTANT --------
     Même raisonnement que pour les motifs (cf. TEST_REGEX), poussé d'un cran : une
     requête corrigée par `accept:[…]` compare deux chaînes — elle refuse
     `WHERE prix>20` faute d'espaces là où elle accepte la graphie notée, alors que
     SQLite rend le MÊME tableau. On exécute donc la requête de l'apprenant sur un
     schéma posé par l'exercice, et l'on compare LE RÉSULTAT, ligne à ligne. C'est
     SQLite qui juge, pas une liste de graphies. Le moteur est celui du dépôt
     (assets/vendor/sqljs/, cf. A2) : aucune requête réseau.
     ⚠️ La saisie n'est JAMAIS concaténée au programme du Worker : elle y entre par
     postMessage, donc comme une donnée. */
  function JUGE_SQL(res, att, ordre) {
    function nv(v) {
      if (v === null || v === undefined) return "NULL";
      /* Un AVG rend un flottant : on arrondit au millionième pour absorber la
         représentation binaire sans jamais confondre deux valeurs distinctes. */
      if (typeof v === "number") return String(Math.round(v * 1e6) / 1e6);
      if (typeof v === "boolean") return v ? "1" : "0";
      if (v && v.byteLength !== undefined) return "<binaire>";
      return String(v).trim();
    }
    function lig(l) {
      var o = [], i;
      for (i = 0; i < l.length; i++) o.push(nv(l[i]));
      return o.join(" | ");
    }
    function bas(c) { return String(c).trim().toLowerCase(); }
    if (!res || !res.length) {
      return "✗ La requête n'a rendu aucun tableau de résultats. L'exercice attend une requête qui RENVOIE des lignes (SELECT, ou WITH … SELECT).";
    }
    /* La dernière instruction qui produit des lignes fait foi : un apprenant qui pose
       d'abord un CREATE ou une vue n'est pas pénalisé pour l'avoir fait. */
    var jeu = res[res.length - 1];
    var cols = jeu.columns || [], vals = jeu.values || [];
    var attL = att.lignes || [];
    var pb = [], i;
    if (att.colonnes) {
      var vus = [], veut = [];
      for (i = 0; i < cols.length; i++) vus.push(bas(cols[i]));
      for (i = 0; i < att.colonnes.length; i++) veut.push(bas(att.colonnes[i]));
      if (vus.join(", ") !== veut.join(", ")) {
        pb.push("· colonnes attendues (" + att.colonnes.join(", ") + "), obtenues (" + cols.join(", ") + ")");
      }
    } else if (attL.length && cols.length !== attL[0].length) {
      pb.push("· " + attL[0].length + " colonne(s) attendue(s), " + cols.length + " obtenue(s)");
    }
    var a = [], b = [];
    for (i = 0; i < attL.length; i++) a.push(lig(attL[i]));
    for (i = 0; i < vals.length; i++) b.push(lig(vals[i]));
    /* Sans ORDER BY, l'ordre des lignes n'est garanti par aucune norme : on ne le
       compare que si l'exercice le demande explicitement (`ordre: true`). */
    if (ordre !== true) { a = a.slice().sort(); b = b.slice().sort(); }
    if (a.length !== b.length) pb.push("· " + a.length + " ligne(s) attendue(s), " + b.length + " obtenue(s)");
    var n = a.length > b.length ? a.length : b.length, ecarts = 0;
    for (i = 0; i < n; i++) {
      if (a[i] !== b[i]) {
        ecarts++;
        if (ecarts <= 3) {
          pb.push("· ligne " + (i + 1) + (ordre === true ? "" : " (comparaison triée)") +
            " : attendu « " + (a[i] === undefined ? "(aucune)" : a[i]) +
            " », obtenu « " + (b[i] === undefined ? "(aucune)" : b[i]) + " »");
        }
      }
    }
    if (ecarts > 3) pb.push("· " + (ecarts - 3) + " autre(s) ligne(s) diffèrent.");
    if (!pb.length) return "SQL-OK\n" + b.length + " ligne(s), " + cols.length + " colonne(s) : conforme.";
    return "✗ Le résultat ne correspond pas :\n" + pb.join("\n");
  }

  /* Racine du site, déduite de l'URL de CE script : un Worker issu d'un Blob n'a
     aucune base pour résoudre un chemin relatif, il lui faut une URL ABSOLUE
     (même raisonnement et même mesure que dans js/runner.js). */
  var MOI_LECON = document.currentScript && document.currentScript.src;
  var RACINE_EXO = MOI_LECON ? MOI_LECON.replace(/\/js\/lecon\.js(\?.*)?$/, "") : "";

  var EXO_SQL_WORKER_SRC = [
    "var SQLP = null;",
    "self.onmessage = function (ev) {",
    "  var d = ev.data || {};",
    "  if (d.type === 'load') {",
    "    try {",
    "      importScripts(d.base + '/assets/vendor/sqljs/sql-wasm-base64.js');",
    "      importScripts(d.base + '/assets/vendor/sqljs/sql-wasm.js');",
    "    } catch (e) { self.postMessage({ type: 'fatal', text: 'chargement : ' + (e && e.message) }); return; }",
    "    if (typeof initSqlJs !== 'function') { self.postMessage({ type: 'fatal', text: 'initSqlJs absent' }); return; }",
    "    if (typeof self.SQL_WASM_BASE64 !== 'string') { self.postMessage({ type: 'fatal', text: 'binaire absent' }); return; }",
    "    var brut = atob(self.SQL_WASM_BASE64), bin = new Uint8Array(brut.length), i;",
    "    for (i = 0; i < brut.length; i++) bin[i] = brut.charCodeAt(i);",
    /* locateFile est appelé même avec wasmBinary : il doit rendre le nom sans lever,
       sinon Emscripten avale l'exception et la promesse ne se résout jamais (cf. A2). */
    "    SQLP = initSqlJs({ wasmBinary: bin, locateFile: function (f) { return f; } });",
    "    SQLP.then(function () { self.postMessage({ type: 'ready' }); }, function (e) { self.postMessage({ type: 'fatal', text: String((e && e.message) || e) }); });",
    "    return;",
    "  }",
    "  if (d.type === 'juge') {",
    "    if (!SQLP) { self.postMessage({ type: 'verdict', id: d.id, texte: '\\u2717 Moteur SQL non chargé.' }); return; }",
    "    SQLP.then(function (SQL) {",
    "      var db = new SQL.Database(), res = null;",
    "      try { db.exec(d.schema); }",
    "      catch (e) {",
    "        self.postMessage({ type: 'verdict', id: d.id, texte: \"\\u2717 Le schéma de l'exercice n'a pas pu être créé : \" + ((e && e.message) || e) });",
    "        try { db.close(); } catch (e0) {} return;",
    "      }",
    "      try { res = db.exec(d.requete); }",
    "      catch (e1) {",
    "        self.postMessage({ type: 'verdict', id: d.id, texte: '\\u2717 SQLite refuse cette requête : ' + ((e1 && e1.message) || e1) });",
    "        try { db.close(); } catch (e2) {} return;",
    "      }",
    "      var texte;",
    "      try { texte = (" + JUGE_SQL.toString() + ")(res, d.attendu, d.ordre); }",
    "      catch (e3) { texte = '\\u2717 Comparaison impossible : ' + ((e3 && e3.message) || e3); }",
    "      self.postMessage({ type: 'verdict', id: d.id, texte: texte });",
    "      try { db.close(); } catch (e4) {}",
    "    });",
    "  }",
    "};",
  ].join("\n");

  /* Un seul Worker pour toute la page : sql.js pèse 909 Ko et met ~0,8 s à
     s'initialiser — le charger par exercice serait absurde. Les demandes sont
     numérotées et mises en file tant que le moteur n'est pas prêt, parce que deux
     exercices d'une même page peuvent être lancés coup sur coup. */
  var sqlExoWorker = null, sqlExoPret = false, sqlExoId = 0;
  var sqlExoRappels = {}; // id → rappel de verdict
  var sqlExoFile = [];    // messages en attente du « ready »

  function sqlExoTousEnEchec(texte) {
    var k, f;
    for (k in sqlExoRappels) {
      if (Object.prototype.hasOwnProperty.call(sqlExoRappels, k)) {
        f = sqlExoRappels[k];
        delete sqlExoRappels[k];
        f(texte);
      }
    }
    sqlExoFile = [];
  }

  function runExoSql(requete, entry, cb) {
    if (!window.Worker || !RACINE_EXO) { cb(null); return; }
    var id = ++sqlExoId, fini = false;
    var minuteur = setTimeout(function () {
      if (fini) return;
      fini = true;
      delete sqlExoRappels[id];
      cb("⏱ Exécution interrompue après 15 s.");
    }, 15000);
    sqlExoRappels[id] = function (texte) {
      if (fini) return;
      fini = true;
      clearTimeout(minuteur);
      cb(texte);
    };
    var message = {
      type: "juge",
      id: id,
      schema: String(entry.schema || ""),
      requete: String(requete),
      attendu: entry.attendu || {},
      ordre: entry.ordre === true,
    };
    if (sqlExoWorker && sqlExoPret) { sqlExoWorker.postMessage(message); return; }
    sqlExoFile.push(message);
    if (sqlExoWorker) return;
    try {
      var blob = new Blob([EXO_SQL_WORKER_SRC], { type: "application/javascript" });
      sqlExoWorker = new Worker(URL.createObjectURL(blob));
    } catch (e) {
      sqlExoWorker = null;
      sqlExoTousEnEchec(null);
      return;
    }
    sqlExoWorker.onmessage = function (ev) {
      var d = ev.data || {}, f;
      if (d.type === "ready") {
        sqlExoPret = true;
        while (sqlExoFile.length) sqlExoWorker.postMessage(sqlExoFile.shift());
        return;
      }
      if (d.type === "fatal") {
        sqlExoTousEnEchec("✗ SQLite n'a pas pu se charger" + (d.text ? " (" + d.text + ")" : "") +
          ". Vérifie que le dossier assets/vendor/sqljs/ est bien présent à côté du dossier js/.");
        return;
      }
      if (d.type === "verdict" && sqlExoRappels[d.id]) {
        f = sqlExoRappels[d.id];
        delete sqlExoRappels[d.id];
        f(d.texte);
      }
    };
    sqlExoWorker.onerror = function () { sqlExoTousEnEchec("✗ Erreur du moteur SQL."); };
    sqlExoWorker.postMessage({ type: "load", base: RACINE_EXO });
  }

  /* ---- Exercices type:"python" : le programme est EXÉCUTÉ par CPython ---------
     Même dispositif que pour SQL (cf. JUGE_SQL), mais la comparaison est celle,
     déjà éprouvée, des exercices `type:"code"` : on lit la sortie standard et l'on
     exige que l'une de ses lignes soit exactement `run.expect`. Le juge n'est donc
     pas un moteur de plus — c'est CPython 3.12 (Pyodide embarqué, cf. A4) qui
     exécute vraiment ce que l'apprenant écrit, sans réseau.
     ⚠️ Pyodide ne se charge QUE dans un Worker, et il pèse 8,27 Mo : le Worker est
     partagé par la page et les demandes sont sérialisées — une exécution à la fois,
     parce qu'un interpréteur unique ne peut pas mener deux programmes de front. */
  var EXO_PY_WORKER_SRC = [
    "var pret = null;",
    "self.onmessage = function (ev) {",
    "  var d = ev.data || {};",
    "  if (d.type === 'load') {",
    "    var D = d.base + '/assets/vendor/pyodide';",
    "    try {",
    "      importScripts(D + '/pyodide-wasm-gz-b64.js');",
    "      importScripts(D + '/pyodide-stdlib-b64.js');",
    "      importScripts(D + '/pyodide-lock-b64.js');",
    "      importScripts(D + '/pyodide-charge.js');",
    "    }",
    "    catch (e) { self.postMessage({ type: 'fatal', text: 'chargement : ' + (e && e.message) }); return; }",
    "    if (!self.PythonLocal) { self.postMessage({ type: 'fatal', text: 'pyodide-charge.js absent' }); return; }",
    "    pret = self.PythonLocal.pret(D);",
    "    pret.then(function () { self.postMessage({ type: 'ready' }); },",
    "              function (e) { self.postMessage({ type: 'fatal', text: String((e && e.message) || e) }); });",
    "    return;",
    "  }",
    "  if (d.type === 'run') {",
    "    Promise.resolve(pret).then(function (py) {",
    "      var lignes = [];",
    "      py.setStdout({ batched: function (s) { lignes.push(s); } });",
    /* stderr entre dans la même sortie : une trace d'erreur Python est le message le
       plus utile qu'un apprenant puisse lire, et l'exercice doit la lui montrer. */
    "      py.setStderr({ batched: function (s) { lignes.push(s); } });",
    "      return py.runPythonAsync(d.code).then(",
    "        function () { self.postMessage({ type: 'fin', id: d.id, texte: lignes.join('\\n') }); },",
    "        function (err) {",
    "          lignes.push((err && err.message) ? String(err.message) : String(err));",
    "          self.postMessage({ type: 'fin', id: d.id, texte: lignes.join('\\n') });",
    "        }",
    "      );",
    "    });",
    "  }",
    "};",
  ].join("\n");

  var pyExoWorker = null, pyExoPret = false, pyExoId = 0;
  var pyExoEnCours = null; // { cb, minuteur } — une exécution à la fois
  var pyExoFile = [];      // demandes en attente

  function pyExoAbandonner(texte) {
    if (pyExoEnCours) {
      clearTimeout(pyExoEnCours.minuteur);
      var cb = pyExoEnCours.cb;
      pyExoEnCours = null;
      cb(texte);
    }
    while (pyExoFile.length) pyExoFile.shift().cb(texte);
  }

  function pyExoAvancer() {
    if (pyExoEnCours || !pyExoFile.length) return;
    if (!pyExoWorker) { pyExoCreer(); return; }
    if (!pyExoPret) return;
    var t = pyExoFile.shift();
    var id = ++pyExoId;
    pyExoEnCours = {
      id: id,
      cb: t.cb,
      /* 20 s : le premier programme d'une page attend l'interpréteur (~0,8 s), les
         suivants non. Un programme qui boucle ne peut pas être interrompu de
         l'intérieur — on TERMINE le Worker, puis on en recrée un au besoin. */
      minuteur: setTimeout(function () {
        try { if (pyExoWorker) pyExoWorker.terminate(); } catch (e) {}
        pyExoWorker = null;
        pyExoPret = false;
        var cb = pyExoEnCours ? pyExoEnCours.cb : null;
        pyExoEnCours = null;
        if (cb) cb("⏱ Exécution interrompue après 20 s (boucle infinie ?).");
        pyExoAvancer();
      }, 20000),
    };
    pyExoWorker.postMessage({ type: "run", id: id, code: t.code });
  }

  function pyExoCreer() {
    try {
      var blob = new Blob([EXO_PY_WORKER_SRC], { type: "application/javascript" });
      pyExoWorker = new Worker(URL.createObjectURL(blob));
    } catch (e) {
      pyExoWorker = null;
      pyExoAbandonner(null);
      return;
    }
    pyExoWorker.onmessage = function (ev) {
      var d = ev.data || {};
      if (d.type === "ready") { pyExoPret = true; pyExoAvancer(); return; }
      if (d.type === "fatal") {
        pyExoAbandonner("✗ Python n'a pas pu se charger" + (d.text ? " (" + d.text + ")" : "") +
          ". Vérifie que le dossier assets/vendor/pyodide/ est bien présent à côté du dossier js/.");
        return;
      }
      if (d.type === "fin" && pyExoEnCours && pyExoEnCours.id === d.id) {
        clearTimeout(pyExoEnCours.minuteur);
        var cb = pyExoEnCours.cb;
        pyExoEnCours = null;
        cb(d.texte);
        pyExoAvancer();
      }
    };
    pyExoWorker.onerror = function () { pyExoAbandonner("✗ Erreur de l'interpréteur Python."); };
    pyExoWorker.postMessage({ type: "load", base: RACINE_EXO });
  }

  function runExoPython(code, cb) {
    if (!window.Worker || !RACINE_EXO) { cb(null); return; }
    pyExoFile.push({ code: String(code), cb: cb });
    pyExoAvancer();
  }

  function runExoCode(code, cb) {
    var worker = null, url = null, done = false;
    function finish(res) {
      if (done) return;
      done = true;
      clearTimeout(hard);
      try { if (worker) worker.terminate(); } catch (e) {}
      if (url) URL.revokeObjectURL(url);
      cb(res);
    }
    try {
      var blob = new Blob([EXO_WORKER_SRC], { type: "application/javascript" });
      url = URL.createObjectURL(blob);
      worker = new Worker(url);
    } catch (e) {
      cb(null);
      return;
    }
    var hard = setTimeout(function () {
      finish("⏱ Exécution interrompue après 3 s (boucle infinie ?).");
    }, 3000);
    worker.onmessage = function (e) { finish(e.data); };
    worker.onerror = function (e) { finish((e && e.message) || "Erreur d'exécution"); };
    try { worker.postMessage(code); } catch (e) { finish(null); }
  }

  function initExos() {
    var holder = document.querySelector("[data-exos]");
    if (!holder) return;
    var data;
    try { data = JSON.parse(holder.textContent); } catch (e) { return; }
    if (!data || !data.length) return;
    var exercises = document.querySelectorAll(".exercise");

    // L'appariement se fait par index : toute entrée déclarée au-delà du nombre de
    // blocs .exercise présents dans la page était abandonnée SANS RIEN DIRE. On
    // signale désormais tout écart, pour qu'il cesse d'être invisible — en
    // distinguant la perte réelle (plus d'entrées que de blocs) du simple bloc
    // laissé sans champ de réponse, qui est un choix éditorial courant.
    if (data.length !== exercises.length && window.console && console.warn) {
      console.warn(
        "[Syntaxe] " +
          courseId +
          " / " +
          lessonFile +
          " : " +
          data.length +
          " exercice(s) déclaré(s) dans data-exos pour " +
          exercises.length +
          " bloc(s) .exercise — " +
          (data.length > exercises.length
            ? "les " +
              (data.length - exercises.length) +
              " entrée(s) en excès ne sont PAS affichées (bloc .exercise manquant dans la page)."
            : "les blocs en excès restent sans champ de réponse.")
      );
    }

    data.forEach(function (entry, i) {
      if (!entry || !exercises[i]) return;
      var ex = exercises[i];
      var isCode = entry.type === "code";
      /* type:"regex" — la réponse est un MOTIF, pas un programme : champ d'une ligne
         comme pour type:"text", mais correction par exécution (cf. TEST_REGEX). */
      var isRegex = entry.type === "regex" && entry.cases;
      /* type:"sql" — la réponse est une REQUÊTE : champ multiligne comme pour le code,
         mais correction par exécution dans SQLite (cf. JUGE_SQL). */
      var isSql = entry.type === "sql" && !!entry.attendu;
      /* type:"python" — un PROGRAMME, jugé sur sa sortie standard comme type:"code",
         mais exécuté par CPython (Pyodide embarqué) au lieu du Worker JavaScript. */
      var isPython = entry.type === "python" && !!entry.run;
      var executable = !!entry.run || isRegex || isSql;
      var multiligne = isCode || isSql || isPython;

      var wrap = document.createElement("div");
      wrap.className = "exo-try";

      var inputId = "exo-" + courseId + "-" + i;
      /* La vraie micro-question était dans le placeholder, qui disparaît à la
         première frappe : on la met dans le LIBELLÉ (persistant, lu par les
         lecteurs d'écran). Le placeholder ne garde qu'une invite générique. (cf. C9) */
      var question = entry.placeholder ? String(entry.placeholder).trim() : "";
      var label = document.createElement("label");
      label.className = "exo-try__label";
      label.setAttribute("for", inputId);
      label.textContent = question
        ? (isCode || isPython ? "Écris le code — " : isSql ? "Écris la requête — " : isRegex ? "Ton motif — " : "Ta réponse — ") + question
        : (isCode || isPython ? "Écris ta réponse (code) :" : isSql ? "Écris ta requête SQL :" : isRegex ? "Ton motif :" : "Ta réponse :");

      var input = document.createElement(multiligne ? "textarea" : "input");
      input.className = "exo-try__input";
      input.id = inputId;
      input.spellcheck = false;
      if (multiligne) input.rows = 3;
      else input.type = "text";
      input.setAttribute(
        "placeholder",
        isCode || isPython ? "ton code ici…" : isSql ? "ta requête ici…" : isRegex ? "ton motif ici, avec ou sans les / /…" : "ta réponse ici…"
      );

      var bar = document.createElement("div");
      bar.className = "exo-try__bar";
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "exo-try__btn";
      btn.textContent = "Vérifier";
      var status = document.createElement("span");
      status.className = "exo-try__status";
      status.setAttribute("aria-live", "polite");
      bar.appendChild(btn);
      bar.appendChild(status);

      var out = null;
      if (executable) {
        out = document.createElement("div");
        out.className = "exo-try__out";
        out.hidden = true;
      }
      var hints = document.createElement("div");
      hints.className = "exo-try__hints";
      var linkP = document.createElement("p");
      linkP.className = "exo-try__link";
      linkP.hidden = true;

      wrap.appendChild(label);
      wrap.appendChild(input);
      wrap.appendChild(bar);
      if (out) wrap.appendChild(out);
      wrap.appendChild(hints);
      wrap.appendChild(linkP);

      var details = ex.querySelector("details");
      if (details) ex.insertBefore(wrap, details);
      else ex.appendChild(wrap);

      var attempts = 0, solved = false, shownHints = 0, shownLink = false;

      function refreshHelp() {
        var target = 0, k;
        for (k = 0; k < EXO_HINT_STEPS.length; k++) {
          if (attempts >= EXO_HINT_STEPS[k]) target = k + 1;
        }
        target = Math.min(target, (entry.hints || []).length);
        while (shownHints < target) {
          var p = document.createElement("p");
          p.className = "exo-try__hint";
          p.textContent = "💡 " + entry.hints[shownHints];
          hints.appendChild(p);
          shownHints++;
        }
        if (!shownLink && attempts >= EXO_LINK_STEP && entry.link && entry.link.href) {
          linkP.hidden = false;
          linkP.appendChild(document.createTextNode("Besoin de revoir la notion ? "));
          var a = document.createElement("a");
          a.href = entry.link.href;
          a.textContent = entry.link.label || "Retourne à la leçon concernée";
          linkP.appendChild(a);
          shownLink = true;
        }
      }

      function succeed() {
        solved = true;
        wrap.classList.add("is-correct");
        status.textContent = "✓ Bravo, c'est juste !";
        status.classList.remove("is-ko");
        status.classList.add("is-ok");
        btn.disabled = true;
        input.readOnly = true;
      }
      function fail() {
        attempts++;
        status.textContent = "✗ Pas encore — essai " + attempts + ". Réessaie.";
        status.classList.remove("is-ok");
        status.classList.add("is-ko");
        refreshHelp();
      }

      btn.addEventListener("click", function () {
        if (solved) return;
        var val = input.value;
        if (!val.trim()) {
          status.textContent = "Écris d'abord une réponse.";
          status.classList.remove("is-ok");
          status.classList.add("is-ko");
          return;
        }
        if (executable && window.Worker) {
          btn.disabled = true;
          status.textContent = "… exécution";
          status.classList.remove("is-ok", "is-ko");
          var lancer = isSql
            ? function (fin) { runExoSql(val, entry, fin); }
            : isPython
            ? function (fin) { runExoPython(val, fin); }
            : function (fin) { runExoCode(isRegex ? programmeRegex(val, entry.cases) : val, fin); };
          lancer(function (output) {
            btn.disabled = false;
            if (out) {
              out.hidden = false;
              var affiche = output == null ? "(exécution impossible dans ce contexte)" : output;
              /* Le jeton de réussite est un signal interne : l'apprenant lit le compte
                 de cas passés, pas « REGEX-OK » ni « SQL-OK ». */
              if (isRegex) affiche = String(affiche).replace(/^REGEX-OK\s*\n?/, "✓ ");
              if (isSql) affiche = String(affiche).replace(/^SQL-OK\s*\n?/, "✓ ");
              out.textContent = affiche;
            }
            var expect = isRegex || isSql
              ? isSql ? "SQL-OK" : "REGEX-OK"
              : entry.run.expect != null
              ? entry.run.expect
              : entry.run;
            var pass;
            if (output == null) {
              pass = (entry.accept || []).some(function (a) { return normExo(a) === normExo(val); });
            } else if (isSql) {
              /* Ici la comparaison a déjà eu lieu — dans SQLite, sur le RÉSULTAT.
                 Le verdict est le jeton, pas une égalité de texte. */
              pass = /^SQL-OK\b/.test(String(output));
            } else {
              /* Le programme de l'apprenant affiche presque toujours du contexte autour
                 de sa conclusion — et les solutions officielles du site en affichent
                 aussi. On accepte donc DEUX formes, toutes deux strictes : la sortie
                 entière égale à l'attendu, ou l'UNE DE SES LIGNES égale à l'attendu.
                 Mesuré avant ce correctif : 19 des 35 solutions publiées du site étaient
                 déclarées en échec alors qu'elles répondaient juste. */
              pass = normExo(output) === normExo(expect) || uneLigneEgale(output, expect);
            }
            if (pass) succeed(); else fail();
          });
        } else {
          var pass = (entry.accept || []).some(function (a) { return normExo(a) === normExo(val); });
          if (pass) succeed(); else fail();
        }
      });

      input.addEventListener("keydown", function (e) {
        if (!multiligne && e.key === "Enter") {
          e.preventDefault();
          btn.click();
        }
      });
    });
  }

  /* ----------------------------------------------- Dernière leçon visitée */
  function recordLast() {
    if (currentIndex === -1) return;
    try {
      var maintenant = new Date();
      var mois = maintenant.getMonth() + 1, jour = maintenant.getDate();
      window.SyntaxeStore.setJSON("syntaxe-last", {
        course: courseId,
        file: lessonFile,
        title: flat[currentIndex].lesson.title,
        /* V12-E3 : la reprise était aveugle à la date. On la note ici, à la
           source ; pour les progressions plus anciennes, elle se déduit du
           dernier jour de « syntaxe-activity ». */
        at: maintenant.getFullYear() + "-" + (mois < 10 ? "0" + mois : mois) +
          "-" + (jour < 10 ? "0" + jour : jour),
      });
    } catch (e) {}
    /* Journal d'activité par jour (heatmap & séries — P3) */
    try {
      var act = window.SyntaxeStore.getJSON("syntaxe-activity", {});
      var d = new Date();
      var mm = d.getMonth() + 1;
      var dd = d.getDate();
      var day = d.getFullYear() + "-" + (mm < 10 ? "0" + mm : mm) + "-" + (dd < 10 ? "0" + dd : dd);
      act[day] = (act[day] || 0) + 1;
      window.SyntaxeStore.setJSON("syntaxe-activity", act);
    } catch (e) {}
  }

  /* ----------------------------------------- Bouton « Imprimer » */
  function initPrintButton() {
    var host =
      document.querySelector(".lesson-header .meta-row") ||
      document.querySelector(".lesson-header");
    if (!host) return;
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "lesson-print";
    btn.innerHTML =
      '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2M6 14h12v8H6z" /></svg><span>Imprimer</span>';
    btn.addEventListener("click", function () {
      window.print();
    });
    host.appendChild(btn);
  }

  /* ----------------------------------------- Mode diaporama (R9, Lot 3)
     Transforme la leçon en présentation plein écran : une diapo de titre puis
     une diapo par section <h2> de .prose. Navigation ← / → / Échap. */
  function initSlideshow() {
    var prose = document.querySelector(".prose");
    var host =
      document.querySelector(".lesson-header .meta-row") ||
      document.querySelector(".lesson-header");
    if (!prose || !host) return;
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "lesson-slides";
    btn.innerHTML =
      '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="2" y="4" width="20" height="13" rx="2"/><path d="M9 21h6M12 17v4"/></svg><span>Mode diapo</span>';
    btn.addEventListener("click", openSlideshow);
    host.appendChild(btn);
  }

  function buildSlides(prose) {
    var slides = [];
    var titleEl = document.querySelector(".lesson-header h1") || document.querySelector("h1");
    if (titleEl) {
      slides.push({
        title: true,
        html:
          '<div class="slide-cover"><p class="slide-kicker">Leçon</p><h2>' +
          titleEl.innerHTML + "</h2></div>",
      });
    }
    var cur = { nodes: [] };
    Array.prototype.slice.call(prose.children).forEach(function (el) {
      var tag = el.tagName;
      if (tag === "H2") {
        if (cur.nodes.length) slides.push(cur);
        cur = { nodes: [el] };
      } else {
        cur.nodes.push(el);
      }
    });
    if (cur.nodes.length) slides.push(cur);
    return slides;
  }

  function openSlideshow() {
    var prose = document.querySelector(".prose");
    if (!prose) return;
    var slides = buildSlides(prose);
    if (!slides.length) return;
    var idx = 0;
    // Élément à re-focaliser à la fermeture (le bouton « Mode diapo »).
    var lastFocus = document.activeElement;

    var overlay = document.createElement("div");
    overlay.className = "slideshow";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.setAttribute("aria-label", "Mode diaporama de la leçon");
    overlay.innerHTML =
      '<div class="slideshow__bar">' +
      '<span class="slideshow__count" id="slide-count"></span>' +
      '<button type="button" class="slideshow__close" id="slide-close">✕ Quitter</button>' +
      "</div>" +
      '<div class="slideshow__stage" id="slide-stage"></div>' +
      '<div class="slideshow__nav">' +
      '<button type="button" class="btn btn--ghost" id="slide-prev">← Précédent</button>' +
      '<button type="button" class="btn btn--primary" id="slide-next">Suivant →</button>' +
      "</div>";
    document.body.appendChild(overlay);
    document.body.style.overflow = "hidden";

    var stage = overlay.querySelector("#slide-stage");
    var countEl = overlay.querySelector("#slide-count");
    var prevBtn = overlay.querySelector("#slide-prev");
    var nextBtn = overlay.querySelector("#slide-next");

    function show(i) {
      idx = Math.max(0, Math.min(slides.length - 1, i));
      stage.innerHTML = "";
      stage.scrollTop = 0;
      if (slides[idx].html) {
        stage.innerHTML = slides[idx].html;
      } else {
        slides[idx].nodes.forEach(function (n) {
          stage.appendChild(n.cloneNode(true));
        });
      }
      countEl.textContent = idx + 1 + " / " + slides.length;
      prevBtn.disabled = idx === 0;
      nextBtn.disabled = idx === slides.length - 1;
    }
    function close() {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
      // Rendre le focus au bouton déclencheur : sans cela, il resterait « dans le
      // vide » après la disparition de l'overlay (audit C1, dialog modal).
      if (lastFocus && lastFocus.focus) { try { lastFocus.focus(); } catch (e) {} }
    }
    // Piège de focus : un dialog aria-modal ne doit pas laisser le Tab filer vers
    // le contenu resté derrière l'overlay. On boucle sur les focusables présents
    // (Quitter, Précédent/Suivant hors état disabled, liens éventuels d'une diapo).
    function trapTab(e) {
      var sel = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';
      var f = Array.prototype.filter.call(overlay.querySelectorAll(sel), function (el) {
        return el.getClientRects().length > 0; // ignore les éléments masqués
      });
      if (!f.length) { e.preventDefault(); return; }
      var first = f[0], last = f[f.length - 1], a = document.activeElement;
      if (e.shiftKey) {
        if (a === first || !overlay.contains(a)) { e.preventDefault(); last.focus(); }
      } else {
        if (a === last || !overlay.contains(a)) { e.preventDefault(); first.focus(); }
      }
    }
    function onKey(e) {
      if (e.key === "ArrowRight" || e.key === "PageDown") {
        e.preventDefault();
        show(idx + 1);
      } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
        e.preventDefault();
        show(idx - 1);
      } else if (e.key === "Escape") {
        close();
      } else if (e.key === "Tab") {
        trapTab(e);
      }
    }

    prevBtn.addEventListener("click", function () { show(idx - 1); });
    nextBtn.addEventListener("click", function () { show(idx + 1); });
    overlay.querySelector("#slide-close").addEventListener("click", close);
    document.addEventListener("keydown", onKey);
    show(0);
    // Focus initial dans le dialog : le bouton « Quitter » est un repère stable
    // (jamais désactivé, contrairement à Précédent/Suivant selon la position).
    var closeBtn = overlay.querySelector("#slide-close");
    if (closeBtn) closeBtn.focus();
  }

  /* ========================================== Notes & surlignage (P4)
     Note libre par leçon + surlignage de passages, en localStorage
     (`syntaxe-notes`). Les surlignages sont mémorisés par leur TEXTE (robuste
     aux changements de structure) et restaurés au chargement. */
  function notesStore() {
    return window.SyntaxeStore.getJSON("syntaxe-notes", {});
  }
  function getLessonNotes() {
    var s = notesStore();
    return (s[courseId] && s[courseId][lessonFile]) || {};
  }
  function saveLessonNotes(obj) {
    var s = notesStore();
    var empty = (!obj.note || !obj.note.trim()) && (!obj.hl || !obj.hl.length);
    if (empty) {
      if (s[courseId]) {
        delete s[courseId][lessonFile];
        if (!Object.keys(s[courseId]).length) delete s[courseId];
      }
    } else {
      s[courseId] = s[courseId] || {};
      s[courseId][lessonFile] = obj;
    }
    window.SyntaxeStore.setJSON("syntaxe-notes", s);
  }

  function highlightText(prose, text) {
    if (!text || text.length < 2) return false;
    var walker = document.createTreeWalker(prose, NodeFilter.SHOW_TEXT, null);
    var node;
    while ((node = walker.nextNode())) {
      var parent = node.parentNode;
      if (parent && parent.closest && parent.closest("mark.user-hl")) continue;
      var idx = node.nodeValue.indexOf(text);
      if (idx === -1) continue;
      try {
        var range = document.createRange();
        range.setStart(node, idx);
        range.setEnd(node, idx + text.length);
        var mark = document.createElement("mark");
        mark.className = "user-hl";
        range.surroundContents(mark);
        return true;
      } catch (e) {
        return false;
      }
    }
    return false;
  }

  function initNotes() {
    var prose = document.querySelector(".prose");
    if (!prose) return;
    var data = getLessonNotes();

    /* Restaurer les surlignages enregistrés. */
    (data.hl || []).forEach(function (t) {
      highlightText(prose, t);
    });

    /* Retirer un surlignage au clic. */
    prose.addEventListener("click", function (e) {
      var m = e.target && e.target.closest ? e.target.closest("mark.user-hl") : null;
      if (!m) return;
      if (!window.confirm("Retirer ce surlignage ?")) return;
      var text = m.textContent;
      var n = getLessonNotes();
      n.hl = (n.hl || []).filter(function (t) {
        return t !== text;
      });
      saveLessonNotes(n);
      var p = m.parentNode;
      p.replaceChild(document.createTextNode(text), m);
      p.normalize();
    });

    /* Bouton flottant « Surligner » près de la sélection. */
    var fab = document.createElement("button");
    fab.type = "button";
    fab.className = "hl-fab";
    fab.textContent = "Surligner";
    fab.hidden = true;
    document.body.appendChild(fab);
    var pending = "";
    function hideFab() {
      fab.hidden = true;
      pending = "";
    }
    prose.addEventListener("mouseup", function () {
      window.setTimeout(function () {
        var sel = window.getSelection();
        var text = sel ? sel.toString().trim() : "";
        if (text.length < 2 || text.length > 200 || !sel.rangeCount) {
          hideFab();
          return;
        }
        var r = sel.getRangeAt(0).getBoundingClientRect();
        if (!r.width) {
          hideFab();
          return;
        }
        pending = text;
        fab.style.top = window.scrollY + r.top - 40 + "px";
        fab.style.left = window.scrollX + r.left + r.width / 2 - 42 + "px";
        fab.hidden = false;
      }, 10);
    });
    fab.addEventListener("mousedown", function (e) {
      e.preventDefault(); // ne pas perdre la sélection
    });
    fab.addEventListener("click", function () {
      if (pending && highlightText(prose, pending)) {
        var n = getLessonNotes();
        n.hl = n.hl || [];
        if (n.hl.indexOf(pending) === -1) n.hl.push(pending);
        saveLessonNotes(n);
      }
      if (window.getSelection) window.getSelection().removeAllRanges();
      hideFab();
    });
    document.addEventListener("scroll", hideFab, { passive: true });

    /* Panneau « Ma note » inséré après le contenu. */
    var details = document.createElement("details");
    details.className = "lesson-note";
    details.innerHTML =
      "<summary>Ma note</summary>" +
      '<textarea class="lesson-note__ta" aria-label="Ta note personnelle sur cette leçon" placeholder="Écris une note personnelle sur cette leçon… (gardée sur cet appareil)"></textarea>';
    var ta = details.querySelector("textarea");
    ta.value = data.note || "";
    if (data.note) details.open = true;
    var deb;
    ta.addEventListener("input", function () {
      clearTimeout(deb);
      deb = window.setTimeout(function () {
        var n = getLessonNotes();
        n.note = ta.value;
        saveLessonNotes(n);
      }, 400);
    });
    prose.parentNode.insertBefore(details, prose.nextSibling);
  }

  /* ------------------------------------- Le décodeur d'erreurs (C4)
     Une leçon qui enseigne une notion dont l'erreur est fréquente doit le dire, et
     mener au décodeur. La liste vient de `js/erreurs-index.js`, un index DÉRIVÉ du
     fichier de données et chargé par les seules leçons concernées (31 sur 1 523) : le
     reste du site ne charge rien. Sans cet index, la fonction ne fait rien du tout. */
  function initDecodeur() {
    var index = window.ERREURS_INDEX;
    if (!index) return;
    /* La clé est le chemin de la leçon relatif à `pages/` — « js/lecon-02.html ». On le
       reconstruit depuis l'URL courante plutôt que de l'inscrire dans chaque page. */
    var parts = location.pathname.split("/").filter(Boolean);
    var cle = parts.slice(-2).join("/");
    var liste = index[cle];
    if (!liste || !liste.length) return;
    var prose = document.querySelector(".prose");
    if (!prose) return;
    /* Profondeur : une leçon vit dans pages/<cours>/, le décodeur dans pages/. */
    var href = "../decodeur.html";
    var box = document.createElement("aside");
    box.className = "lesson-erreurs";
    box.setAttribute("aria-label", "Erreurs fréquentes sur cette leçon");
    var items = liste.map(function (e) {
      return '<li><code>' + String(e.gabarit)
        .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;") + "</code></li>";
    }).join("");
    box.innerHTML =
      "<p class=\"lesson-erreurs__titre\">Quand ça casse, ici, c'est souvent&nbsp;:</p>" +
      '<ul class="lesson-erreurs__liste">' + items + "</ul>" +
      "<p class=\"lesson-erreurs__lien\"><a href=\"" + href + "\">Ouvrir le décodeur de messages d'erreur →</a></p>";
    prose.appendChild(box);
  }

  /* ------------------------------------- Le bac à sable Git (D3)
     Le cours `git` est le seul du site dont les commandes se pratiquent SANS rien
     installer : le bac à sable exécute pour de bon `add`, `commit`, `merge` et
     `rebase` sur un dépôt qui vit dans le navigateur, et dessine le graphe. Une
     leçon de ce cours mène donc à l'endroit où l'essayer.
     Le lien est construit à l'exécution, comme celui du décodeur : sa PROFONDEUR
     (`../`, une leçon vit dans `pages/<cours>/`) est vérifiée dans le navigateur
     par `tools/preuves/git-graphe.js` — une profondeur fausse ne se voit pas
     autrement, la page s'ouvrant sans erreur sur un lien mort. */
  /* Quelle leçon du cours `git` mène à quelle situation guidée du bac à sable
     (chantier V14, point D4). ⚠️ C'est la SEULE recopie de `js/git-scenarios.js`
     sur le site — une leçon ne charge pas le module des scénarios pour trois
     liens. `tools/verif-git-scenarios.js` exige donc que les deux tables
     coïncident : sans cet invariant, une leçon renverrait vers une situation
     qui ne la concerne pas, et la page s'ouvrirait très bien quand même. */
  var SCENARIOS_GIT = {
    "lecon-02": ["desindexer", "restaurer-fichier"],
    "lecon-04": ["mauvaise-branche"],
    "lecon-05": ["conflit"],
    "lecon-06": ["conflit"],
    "lecon-07": ["desindexer", "restaurer-fichier", "message-faux", "mauvaise-branche", "annuler-partage"],
    "lecon-12": ["rebaser", "un-seul-commit"],
    "lecon-19": ["commit-perdu"],
    "lecon-20": ["un-seul-commit"]
  };
  var TITRES_SCENARIOS_GIT = {
    "annuler-partage": "Il faut annuler un commit que les autres ont déjà",
    "commit-perdu": "Un « reset --hard » a emporté un commit",
    "conflit": "Tu es au milieu d'un conflit de fusion",
    "desindexer": "Tu viens d'indexer un fichier qui ne doit pas partir",
    "mauvaise-branche": "Tu as committé sur « main », ça devait aller sur une branche à part",
    "message-faux": "Le message de ton dernier commit est faux",
    "rebaser": "Ta branche est partie d'une base périmée",
    "restaurer-fichier": "Tu as écrasé un fichier, et rien n'est committé",
    "un-seul-commit": "Tu ne veux qu'UN commit d'une autre branche"
  };

  function initBacGit() {
    var parts = location.pathname.split("/").filter(Boolean);
    if (parts.length < 2 || parts[parts.length - 2] !== "git") return;
    if (!/^lecon-/.test(parts[parts.length - 1])) return;
    var prose = document.querySelector(".prose");
    if (!prose || prose.querySelector(".lesson-bac-git")) return;
    var box = document.createElement("aside");
    box.className = "lesson-erreurs lesson-bac-git";
    box.setAttribute("aria-label", "Essayer ces commandes");
    box.innerHTML =
      "<p class=\"lesson-erreurs__titre\">Essaie ces commandes pour de vrai&nbsp;:</p>" +
      "<p class=\"lesson-erreurs__lien\"><a href=\"../git-bac-a-sable.html\">"
      + "Ouvrir le bac à sable Git →</a></p>"
      + "<p>Un vrai dépôt, dans cette page&nbsp;: les empreintes sont calculées comme "
      + "Git les calcule, et le graphe se redessine à chaque commande.</p>";

    /* ⚠️ Les liens vers les SITUATIONS sont construits en DOM, pas en innerHTML :
       le titre vient d'une table, et le jour où quelqu'un y écrira un chevron,
       il doit rester un chevron. Le lien porte l'ancre `#scenario-<id>`, que
       `js/git-bac.js` lit au chargement pour ouvrir la situation directement. */
    var lies = SCENARIOS_GIT[parts[parts.length - 1].replace(/\.html$/, "")] || [];
    if (lies.length) {
      var intro = document.createElement("p");
      intro.className = "lesson-erreurs__titre";
      intro.textContent = lies.length > 1
        ? "Des situations guidées reprennent ce que cette leçon vient d'expliquer :"
        : "Une situation guidée reprend ce que cette leçon vient d'expliquer :";
      box.appendChild(intro);
      var ul = document.createElement("ul");
      ul.className = "lesson-bac-git__situations";
      for (var i = 0; i < lies.length; i++) {
        var li = document.createElement("li");
        var a = document.createElement("a");
        a.href = "../git-bac-a-sable.html#scenario-" + lies[i];
        a.textContent = TITRES_SCENARIOS_GIT[lies[i]] || lies[i];
        li.appendChild(a);
        ul.appendChild(li);
      }
      box.appendChild(ul);
    }
    prose.appendChild(box);
  }

  /* ----------------------------------------------- Init */
  recordLast();
  initNotes();
  initPrintButton();
  initSlideshow();
  initQuiz();
  initQuizBilan();
  initExos();
  buildCourseNav();
  initCourseNavToggle();
  refreshProgressUI();
  initCompleteButton();
  buildPrevNext();
  buildTOC();
  initReadingProgress();
  initDecodeur();
  initBacGit();
})();
