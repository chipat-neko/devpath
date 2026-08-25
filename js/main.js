/* =============================================================================
   main.js — Comportements communs à toutes les pages.
   À charger avec defer sur chaque page : <script src="../js/main.js" defer></script>
   ============================================================================= */
(function () {
  "use strict";

  /* ----------------------------------------------------------------- Utils */
  function $(sel, ctx) {
    return (ctx || document).querySelector(sel);
  }
  function $all(sel, ctx) {
    return Array.prototype.slice.call((ctx || document).querySelectorAll(sel));
  }

  /* ---------------------------------------------------------------- Toast
     Notification brève et accessible : prévient quand une action a échoué
     silencieusement (surtout un localStorage plein). Un seul conteneur
     réutilisé. Exposé en global pour les autres scripts (lecon.js…). (cf. C5) */
  var toastHost = null;
  function showToast(message, isError) {
    try {
      if (!document.body) return;
      if (!toastHost) {
        toastHost = document.createElement("div");
        toastHost.className = "toast-host";
        document.body.appendChild(toastHost);
      }
      /* Ne pas empiler le même message (sauvegardes répétées qui échouent). */
      var shown = toastHost.querySelectorAll(".toast");
      for (var i = 0; i < shown.length; i++) {
        if (shown[i].textContent === message) return;
      }
      var t = document.createElement("div");
      t.className = "toast" + (isError ? " toast--err" : "");
      t.setAttribute("role", isError ? "alert" : "status");
      t.setAttribute("aria-live", isError ? "assertive" : "polite");
      t.textContent = message;
      toastHost.appendChild(t);
      setTimeout(function () { t.classList.add("is-visible"); }, 10);
      setTimeout(function () {
        t.classList.remove("is-visible");
        setTimeout(function () { if (t.parentNode) t.parentNode.removeChild(t); }, 320);
      }, 5000);
    } catch (e) {}
  }
  window.SyntaxeToast = showToast;

  var ICON_COPY =
    '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/></svg>';
  var ICON_CHECK =
    '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>';

  /* --------------------------------------------------- Bascule de thème */
  function initThemeToggle() {
    $all("[data-theme-toggle]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var now = window.SyntaxeTheme ? window.SyntaxeTheme.toggle() : null;
        btn.setAttribute(
          "aria-label",
          now === "dark" ? "Activer le thème clair" : "Activer le thème sombre"
        );
      });
    });
  }

  /* ------------------------------------------------ Menu de navigation */
  function initNavToggle() {
    var toggle = $("[data-nav-toggle]");
    var nav = $("#primary-nav");
    if (!toggle || !nav) return;

    function close(restoreFocus) {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      // Rendre le focus au bouton évite qu'il retombe sur un lien devenu
      // invisible (menu replié) — sinon le focus « disparaît » (audit C1).
      if (restoreFocus && toggle.focus) toggle.focus();
    }
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    // Ferme au clic sur un lien ou à l'agrandissement de l'écran
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) close();
    });
    // Échap referme le menu ouvert et ramène le focus au bouton : au clavier,
    // c'est le seul moyen de ressortir sans parcourir tous les liens (audit C1).
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("is-open")) close(true);
    });
    window.addEventListener("resize", function () {
      // 1179 = seuil du hamburger dans css/layout.css. Les deux doivent rester
      // synchronisés, sinon le menu reste ouvert alors qu'il repasse en barre.
      if (window.innerWidth > 1179) close();
    });
  }

  /* ------------------------------------------------ Lien d'évitement (a11y)
     « Aller au contenu » pointe vers #contenu (#programme sur les pages de
     cours). Sans intervention, activer ce lien ne fait que déplacer le SCROLL :
     la cible (<main>) n'étant pas focusable, le focus clavier retombe sur <body>
     et un Tab repart du haut — le lien d'évitement est alors inopérant pour un
     utilisateur clavier ou lecteur d'écran (audit C1). On focalise donc la cible
     (tabindex=-1 posé à la volée), sans éditer les 1500 pages. */
  function initSkipLink() {
    $all(".skip-link").forEach(function (link) {
      link.addEventListener("click", function () {
        var id = (link.getAttribute("href") || "").replace(/^#/, "");
        var target = id ? document.getElementById(id) : null;
        if (!target) return;
        if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
        // La navigation par fragment gère le défilement ; on ajoute le focus.
        try { target.focus(); } catch (e) {}
      });
    });
  }

  /* ---------------------------------------------------- Année du pied */
  function initYear() {
    $all("[data-year]").forEach(function (el) {
      el.textContent = new Date().getFullYear();
    });
  }

  /* ------------------------------------ Blocs de code : barre + copier
     L'auteur écrit seulement :
       <figure class="code-block" data-file="script.js">
         <pre><code class="language-js"> … </code></pre>
       </figure>
     Cette fonction ajoute la barre (pastilles + nom + bouton copier).      */
  function enhanceCodeBlocks() {
    $all(".code-block").forEach(function (block) {
      if (block.querySelector(".code-block__bar")) return; // déjà enrichi
      var pre = block.querySelector("pre");
      if (!pre) return;

      var name = block.getAttribute("data-file") || "exemple";
      var bar = document.createElement("div");
      bar.className = "code-block__bar";
      bar.innerHTML =
        '<span class="code-block__dots" aria-hidden="true"><span></span><span></span><span></span></span>' +
        '<span class="code-block__name">' +
        name +
        "</span>" +
        '<button type="button" class="code-block__copy">' +
        ICON_COPY +
        "<span>Copier</span></button>";
      block.insertBefore(bar, pre);

      var btn = bar.querySelector(".code-block__copy");
      btn.addEventListener("click", function () {
        var code = pre.innerText;
        copyText(code).then(function (ok) {
          if (!ok) return;
          btn.classList.add("is-copied");
          btn.innerHTML = ICON_CHECK + "<span>Copié&nbsp;!</span>";
          window.setTimeout(function () {
            btn.classList.remove("is-copied");
            btn.innerHTML = ICON_COPY + "<span>Copier</span>";
          }, 1600);
        });
      });
    });
  }

  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text).then(
        function () {
          return true;
        },
        function () {
          return fallbackCopy(text);
        }
      );
    }
    return Promise.resolve(fallbackCopy(text));
  }

  function fallbackCopy(text) {
    try {
      var ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.position = "absolute";
      ta.style.left = "-9999px";
      document.body.appendChild(ta);
      ta.select();
      var ok = document.execCommand("copy");
      document.body.removeChild(ta);
      return ok;
    } catch (e) {
      return false;
    }
  }

  /* ------------------------------------------------ Internationalisation
     Fondation i18n (FR par défaut, EN en option). Traduit l'interface commune
     — navigation, fil d'Ariane, pied de page — sur toutes les pages (sans rien
     éditer dans le HTML), plus les éléments porteurs d'un attribut data-i18n
     (instrumentés au cas par cas, ex. l'accueil). Le CONTENU des leçons reste
     en français : sa traduction est un chantier progressif distinct.
     Aucune dépendance réseau : tout est ici (compatible file://).            */
  var LANG_KEY = "syntaxe-lang";

  /* Libellés d'interface communs : traduits par leur texte français d'origine
     (donc sans toucher au HTML des 70+ pages). */
  var NAV_FR_EN = {
    "Accueil": "Home",
    "Catalogue": "Catalog",
    "Parcours": "Learning paths",
    "Fils rouges": "Guided tracks",
    "Ma progression": "My progress",
    "Projets": "Projects",
    "Notre approche": "Our approach",
    "Recherche": "Search",
    "Cours JavaScript": "JavaScript course",
    "← Retour à l'accueil": "← Back to home",
    "← Tous les cours": "← All courses",
    "Aller au contenu": "Skip to content",
    "Aller au programme": "Skip to syllabus",
  };

  /* Éléments instrumentés via data-i18n="clé" : traduction EN (le FR d'origine
     est conservé automatiquement pour pouvoir revenir en arrière). */
  var I18N = {
    "home.kicker": "The school of code",
    "home.title": "Learn to code <em>in depth</em>, not on the surface.",
    "home.lead":
      "Programming courses designed as a real journey: we start from what you know, explain the <em>why</em>, show the pitfalls, and every module ends with practice. <strong>87 courses</strong>, 86 of them fully written, from web to systems — <strong>pick your language</strong> and learn at your own pace.",
    "home.cta.start": "Browse the catalog",
    "home.cta.catalog": "Choose a path",
    "home.meta.courses": "<strong>87</strong> courses in the catalogue",
    "home.meta.lessons": "<strong>1511</strong> written lessons",
    "home.meta.langs": "<strong>79</strong> languages &amp; tech",
  };

  function getLang() {
    try {
      var l = localStorage.getItem(LANG_KEY);
      if (l === "fr" || l === "en") return l;
    } catch (e) {}
    return "fr";
  }

  function applyI18n(lang) {
    // L'attribut lang du <html> doit refléter la langue du CONTENU principal
    // (WCAG 3.1.1). Seules les pages dont le contenu est réellement instrumenté
    // (au moins un [data-i18n], ex. l'accueil) basculent en "en" ; ailleurs le
    // contenu reste français, donc on garde "fr" même si la navigation commune
    // est traduite — sinon un lecteur d'écran lirait du français en phonétique EN.
    var contentTranslated = document.querySelector("[data-i18n]") !== null;
    document.documentElement.setAttribute("lang", contentTranslated && lang === "en" ? "en" : "fr");

    // Étape 1 — éléments instrumentés data-i18n : on mémorise le FR d'origine une fois.
    $all("[data-i18n]").forEach(function (el) {
      if (!el.hasAttribute("data-i18n-fr")) el.setAttribute("data-i18n-fr", el.innerHTML);
      var key = el.getAttribute("data-i18n");
      var en = I18N[key];
      el.innerHTML = lang === "en" && en ? en : el.getAttribute("data-i18n-fr");
    });

    // Étape 2 — navigation / fil d'Ariane / pied de page : traduction par texte FR.
    $all(".primary-nav a, .breadcrumb a, .site-footer a, .skip-link").forEach(function (a) {
      if (!a.hasAttribute("data-i18n-fr")) a.setAttribute("data-i18n-fr", a.textContent.trim());
      var fr = a.getAttribute("data-i18n-fr");
      if (NAV_FR_EN[fr]) a.textContent = lang === "en" ? NAV_FR_EN[fr] : fr;
    });
  }

  /* Le bouton « EN » a été retiré (V9 / C1). Mesuré : présent sur 1505 pages, il
     ne traduisait que ~13 libellés de navigation sur un contenu resté français —
     une seule page (l'accueil) portait 8 éléments instrumentés, tout le reste de
     son propre contenu compris. Il promettait un bilinguisme inexistant, alors
     que traduire les 1476 leçons n'est pas à l'ordre du jour. On assume donc le
     site comme francophone et on force l'affichage FR, même si une ancienne
     préférence « en » traîne encore dans localStorage. La fondation i18n
     (getLang, applyI18n, tables) est conservée, dormante, pour une éventuelle
     traduction future — mais plus aucun bouton ne l'active. */
  function initI18n() {
    applyI18n("fr");
  }

  /* --------------------------------------------------- Gamification (XP, P1)
     XP calculée à partir de la progression existante (leçons terminées + scores
     de QCM) — aucune nouvelle donnée obligatoire. Niveaux progressifs, succès
     dérivés de l'état. Exposé via window.SyntaxeXP ; badge dans l'en-tête. */
  function readStore(k) {
    var v = window.SyntaxeStore.getJSON(k, {});
    /* Garantir un OBJET : une valeur LISIBLE mais de mauvaise forme (nombre,
       tableau, chaîne…) ferait planter les itérations Object.keys en aval.
       (cf. C6) */
    return v && typeof v === "object" && !Array.isArray(v) ? v : {};
  }

  function writeStore(k, v) {
    window.SyntaxeStore.setJSON(k, v);
  }

  /* ------------------------------ Reprise des cours « -avance » fusionnés
     Les 4 cours experts autonomes (html-avance, css-avance, js-avance,
     python-avance) ont été fusionnés dans leur cours d'accueil, et leurs
     leçons y ont été RENUMÉROTÉES. Sans reprise, la progression acquise avant
     la fusion reste rangée sous l'ancien identifiant : progression.js ne la
     voit plus (il n'itère que sur DATA.content) alors que computeXP la
     comptait encore — d'où un écran affichant « 0 / 1336 leçons » juste
     au-dessus d'un « Niveau 3 ». Les décalages ci-dessous sont ceux des 89
     pages de redirection de pages/*-avance/ (source de vérité) :
     html-avance/lecon-01 → html/lecon-26, css idem, js-avance/lecon-01 →
     js/lecon-43, python-avance/lecon-01 → python/lecon-29.
     Même forme et mêmes garde-fous que migrerStore() de js/projets.js. */
  var COURS_FUSIONNES = {
    "html-avance": { vers: "html", decalage: 25 },
    "css-avance": { vers: "css", decalage: 25 },
    "js-avance": { vers: "javascript", decalage: 42 },
    "python-avance": { vers: "python", decalage: 28 },
  };
  function fichierApresFusion(file, decalage) {
    var m = /^lecon-(\d+)\.html$/.exec(String(file));
    if (!m) return String(file); // clé inattendue : recopiée telle quelle
    var n = parseInt(m[1], 10) + decalage;
    return "lecon-" + (n < 10 ? "0" + n : String(n)) + ".html";
  }
  function migrerStoreFusion(cle) {
    var s = readStore(cle);
    var change = false;
    for (var vieux in COURS_FUSIONNES) {
      if (!Object.prototype.hasOwnProperty.call(s, vieux)) continue;
      var cible = COURS_FUSIONNES[vieux];
      var source = s[vieux];
      if (source && typeof source === "object") {
        if (!s[cible.vers] || typeof s[cible.vers] !== "object") s[cible.vers] = {};
        var dest = s[cible.vers];
        var dec = cible.decalage;
        Object.keys(source).forEach(function (file) {
          var neuf = fichierApresFusion(file, dec);
          /* Jamais d'écrasement : ce qui a déjà été fait sous le nouvel
             identifiant l'emporte toujours sur l'ancienne trace. */
          if (!Object.prototype.hasOwnProperty.call(dest, neuf)) dest[neuf] = source[file];
        });
      }
      delete s[vieux];
      change = true;
    }
    if (change) writeStore(cle, s);
    return change;
  }
  /* Migration unique, au chargement : les trois stockages partagent la même
     forme de clés (store[idDuCours][fichier-de-lecon]). */
  (function migrerFusion() {
    ["syntaxe-progress", "syntaxe-quiz", "syntaxe-notes"].forEach(migrerStoreFusion);
  })();

  /* Index { idDuCours: { fichier: true } } des leçons réellement déclarées,
     pour que l'XP ne compte plus une clé orpheline que le tableau de bord
     ignore. Renvoie null si data.js n'est pas chargé (27 pages d'outils) :
     dans ce cas on ne filtre rien, comme avant. */
  function leconsConnues() {
    var D = window.SITE_DATA;
    if (!D || !D.content) return null;
    var idx = {};
    Object.keys(D.content).forEach(function (id) {
      idx[id] = {};
      (D.content[id].modules || []).forEach(function (m) {
        (m.lessons || []).forEach(function (l) {
          idx[id][l.file] = true;
        });
      });
    });
    return idx;
  }

  function computeXP() {
    var prog = readStore("syntaxe-progress");
    var quiz = readStore("syntaxe-quiz");
    var connues = leconsConnues();
    function estConnue(c, l) {
      if (!connues) return true;
      return !!(connues[c] && connues[c][l]);
    }
    var lessons = 0;
    Object.keys(prog).forEach(function (c) {
      var m = prog[c];
      if (!m || typeof m !== "object") return; // ex. {"html":null} — donnée corrompue
      Object.keys(m).forEach(function (l) {
        if (m[l] && estConnue(c, l)) lessons++;
      });
    });
    var quizXP = 0,
      quizPassed = 0,
      quizPerfect = 0;
    Object.keys(quiz).forEach(function (c) {
      var qc = quiz[c];
      if (!qc || typeof qc !== "object") return; // donnée corrompue
      Object.keys(qc).forEach(function (l) {
        if (!estConnue(c, l)) return;
        var slots = qc[l] || {};
        ["quiz", "bilan"].forEach(function (k) {
          var s = slots[k];
          if (s && s.total) {
            quizXP += (s.best || 0) * (k === "bilan" ? 3 : 2);
            quizPassed++;
            if (s.best === s.total) quizPerfect++;
          }
        });
      });
    });
    return {
      xp: lessons * 10 + quizXP,
      lessons: lessons,
      quizPassed: quizPassed,
      quizPerfect: quizPerfect,
    };
  }

  var XP_TITLES = [
    "Curieux", "Curieux", "Apprenti", "Apprenti", "Initié", "Initié",
    "Confirmé", "Confirmé", "Avancé", "Avancé", "Expert", "Expert",
  ];
  function xpForLevel(L) {
    return 50 * (L - 1) * (L - 1);
  }
  function levelInfo(xp) {
    var level = Math.floor(Math.sqrt(xp / 50)) + 1;
    var cur = xpForLevel(level),
      next = xpForLevel(level + 1);
    return {
      level: level,
      title: XP_TITLES[level - 1] || "Maître",
      pct: next > cur ? Math.round(((xp - cur) / (next - cur)) * 100) : 100,
      intoLevel: xp - cur,
      span: next - cur,
    };
  }

  /* Signal de palier : le badge montre le niveau courant en permanence, mais
     rien ne marque le MOMENT où on en gagne un. On mémorise le dernier niveau
     annoncé et, s'il a augmenté depuis, on l'annonce une seule fois — sobrement,
     via le toast déjà en place. Le badge et ce toast étant rendus au même
     chargement, ils restent cohérents (pas de « Niv. 4 » sous un « Niveau 5
     atteint »). Premier passage : on note le niveau sans rien annoncer, faute
     d'historique. */
  function signalerMonteeNiveau(lv) {
    /* Seulement là où l'XP est fiable : sans data.js (27 pages d'outils),
       computeXP compte des clés orphelines et le niveau peut diverger — on ne
       veut ni faux toast ni écraser le niveau mémorisé avec une valeur fausse. */
    if (!window.SITE_DATA) return;
    var KEY = "syntaxe-xp-level";
    var prev = null;
    try {
      var raw = localStorage.getItem(KEY);
      if (raw != null) prev = parseInt(raw, 10);
    } catch (e) {}
    if (prev == null || isNaN(prev)) {
      window.SyntaxeStore.set(KEY, String(lv.level));
      return;
    }
    if (lv.level > prev) {
      showToast("Niveau " + lv.level + " atteint — " + lv.title + ".");
    }
    if (lv.level !== prev) {
      window.SyntaxeStore.set(KEY, String(lv.level));
    }
  }

  function initXP() {
    var actions = $(".header-actions");
    if (!actions) return;
    var s = computeXP();
    if (s.xp <= 0) return; // rien à afficher pour un nouveau visiteur
    var lv = levelInfo(s.xp);
    signalerMonteeNiveau(lv);
    var progLink = $('.primary-nav a[href$="progression.html"]');
    var href = progLink ? progLink.getAttribute("href") : null;
    var el = document.createElement(href ? "a" : "span");
    el.className = "xp-badge";
    if (href) el.setAttribute("href", href);
    el.setAttribute("title", "Niveau " + lv.level + " · " + lv.title + " · " + s.xp + " XP");
    el.innerHTML =
      '<span class="xp-badge__star" aria-hidden="true">★</span>' +
      '<span class="xp-badge__lvl">Niv. ' + lv.level + "</span>" +
      '<span class="xp-badge__bar"><span class="xp-badge__fill" style="width:' + lv.pct + '%"></span></span>';
    actions.insertBefore(el, actions.firstChild);
  }

  window.SyntaxeXP = { compute: computeXP, levelInfo: levelInfo };

  /* ------------------------------------------------------------- PWA (P10)
     Rend le site installable et consultable hors ligne. Manifest ET service
     worker ne sont mis en place qu'en http(s) — jamais en file://, le seul mode
     fourni : en local une PWA est impossible et Chrome refuse le manifest (il
     écrit une erreur dans la console de chaque page). On n'injecte donc rien. */
  function initPWA() {
    var proto = location.protocol;
    if (proto !== "http:" && proto !== "https:") return;
    // Préfixe vers la racine du site, déduit du href du favicon.
    var icon = $('link[rel="icon"]');
    var prefix = "";
    if (icon) {
      var h = icon.getAttribute("href") || "";
      var m = h.match(/^(.*?)assets\//);
      if (m) prefix = m[1];
    }
    if (!$('link[rel="manifest"]')) {
      var link = document.createElement("link");
      link.rel = "manifest";
      link.href = prefix + "manifest.webmanifest";
      document.head.appendChild(link);
    }
    if ("serviceWorker" in navigator) {
      try {
        navigator.serviceWorker
          .register(prefix + "sw.js", { scope: prefix || "./" })
          .catch(function () {});
      } catch (e) {}
    }
  }

  /* ----------------------------------------------------- Couleur d'accent (R6) */
  var ACCENTS = [
    { id: "indigo", label: "Indigo", color: "#2540f0" },
    { id: "emeraude", label: "Émeraude", color: "#0f9d58" },
    { id: "ambre", label: "Ambre", color: "#b9710c" },
    { id: "framboise", label: "Framboise", color: "#d6336c" },
    { id: "cyan", label: "Cyan", color: "#0c8aa6" },
    { id: "violet", label: "Violet", color: "#7048e8" },
  ];
  function initAccent() {
    if (!window.SyntaxeAccent) return;
    var host = document.querySelector(".header-actions");
    if (!host) return;
    var wrap = document.createElement("div");
    wrap.className = "accent-picker";
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "accent-toggle";
    btn.setAttribute("aria-label", "Changer la couleur d'accent");
    btn.setAttribute("aria-expanded", "false");
    btn.innerHTML =
      '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="13.5" cy="6.5" r="1.4"/><circle cx="17.5" cy="10.5" r="1.4"/><circle cx="8.5" cy="7.5" r="1.4"/><circle cx="6.5" cy="12.5" r="1.4"/><path d="M12 2a10 10 0 1 0 0 20c.9 0 1.4-.7 1.4-1.5 0-1-.9-1.5-.9-2.5s.7-1.5 1.5-1.5H17a5 5 0 0 0 5-5c0-5-4.5-9-10-9Z"/></svg>';
    var menu = document.createElement("div");
    menu.className = "accent-menu";
    menu.hidden = true;
    menu.innerHTML = ACCENTS.map(function (a) {
      return (
        '<button type="button" class="accent-dot" data-accent="' + a.id +
        '" title="' + a.label + '" aria-label="' + a.label +
        '" style="--swatch:' + a.color + '"></button>'
      );
    }).join("");
    wrap.appendChild(btn);
    wrap.appendChild(menu);
    host.insertBefore(wrap, host.firstChild);

    function mark() {
      var cur = window.SyntaxeAccent.get();
      var dots = menu.querySelectorAll(".accent-dot");
      for (var i = 0; i < dots.length; i++) {
        dots[i].classList.toggle("is-active", dots[i].getAttribute("data-accent") === cur);
      }
    }
    function close() {
      menu.hidden = true;
      btn.setAttribute("aria-expanded", "false");
    }
    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      var willOpen = menu.hidden;
      menu.hidden = !willOpen;
      btn.setAttribute("aria-expanded", willOpen ? "true" : "false");
      if (willOpen) mark();
    });
    menu.addEventListener("click", function (e) {
      var d = e.target && e.target.closest ? e.target.closest("[data-accent]") : null;
      if (!d) return;
      window.SyntaxeAccent.set(d.getAttribute("data-accent"));
      mark();
      close();
    });
    document.addEventListener("click", close);
  }

  /* ------------------------------------------------ Menu principal unique */
  /* La navigation est statique et dupliquée sur ~1476 pages : son 3ᵉ élément
     était un lien figé recopié du gabarit (« Cours JavaScript » sur 1154 pages,
     jusque dans les cours COBOL ou Prolog, et changeant d'une leçon à l'autre).
     Ce lien a été retiré du gabarit ; le menu complet est désormais construit
     ici, à l'identique partout, sur le modèle de l'ancien initFilsRougesNav() :
     la profondeur est déduite du href du lien « Accueil » (… /index.html), et
     l'on ne touche à rien si ce repère manque (pages de redirection). */
  var MENU = [
    { fichier: "index.html", label: "Accueil", racine: true },
    { fichier: "catalogue.html", label: "Catalogue" },
    { fichier: "fils-rouges.html", label: "Fils rouges", aussi: /^fil-rouge/ },
    { fichier: "parcours.html", label: "Parcours" },
    { fichier: "projets.html", label: "Projets" },
    { fichier: "progression.html", label: "Ma progression" },
    { fichier: "recherche.html", label: "Recherche" },
  ];

  function initMainNav() {
    var nav = $(".primary-nav");
    if (!nav) return;

    // Repère de profondeur : le lien « Accueil » vers index.html.
    var home = null,
      links = $all("a", nav);
    for (var i = 0; i < links.length; i++) {
      var h = links[i].getAttribute("href") || "";
      if (/(^|\/)index\.html$/.test(h)) {
        home = h;
        break;
      }
    }
    if (home === null) return; // pas de repère fiable : on ne touche à rien
    var depth = (home.match(/\.\.\//g) || []).length;
    // depth 0 → « pages/x.html » ; 1 → « x.html » ; 2 → « ../x.html » ; etc.
    var prefixe = depth === 0 ? "pages/" : new Array(depth).join("../");
    var courant = (location.pathname.split("/").pop() || "index.html").toLowerCase();

    var neufs = MENU.map(function (item) {
      var href = item.racine ? home : prefixe + item.fichier;
      // Réutilise le lien déjà présent au bon endroit (attributs conservés).
      var a = null;
      for (var j = 0; j < links.length; j++) {
        if ((links[j].getAttribute("href") || "").split("#")[0] === href) {
          a = links[j];
          break;
        }
      }
      if (!a) {
        a = document.createElement("a");
        a.setAttribute("href", href);
      }
      a.textContent = item.label;
      a.removeAttribute("aria-current");
      var actif = item.racine
        ? depth === 0 && (courant === "index.html" || courant === "")
        : courant === item.fichier || (item.aussi ? item.aussi.test(courant) : false);
      if (actif) a.setAttribute("aria-current", "page");
      return a;
    });

    // Remplace intégralement le contenu de la nav : même ordre partout, et
    // aucun reliquat du gabarit (un lien figé oublié disparaît de lui-même).
    while (nav.firstChild) nav.removeChild(nav.firstChild);
    for (var k = 0; k < neufs.length; k++) nav.appendChild(neufs[k]);
  }

  /* ------------------------------------------ Depuis quand ? (V12-E3)
     La reprise proposait « Reprendre : Zig » sans dire que la dernière visite
     remontait à trois semaines. Exposé en global : la page Progression et
     l'accueil en ont besoin toutes les deux. */
  window.SyntaxeDate = {
    /* « aujourd'hui », « hier », « il y a 5 jours », « il y a 3 semaines »… */
    relatif: function (iso) {
      if (!iso || !/^\d{4}-\d{2}-\d{2}$/.test(iso)) return "";
      var p = iso.split("-");
      var alors = new Date(+p[0], +p[1] - 1, +p[2]);
      var today = new Date();
      var aujourdhui = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      var jours = Math.round((aujourdhui - alors) / 86400000);
      if (isNaN(jours) || jours < 0) return "";
      if (jours === 0) return "aujourd'hui";
      if (jours === 1) return "hier";
      if (jours < 7) return "il y a " + jours + " jours";
      if (jours < 14) return "il y a une semaine";
      if (jours < 31) return "il y a " + Math.round(jours / 7) + " semaines";
      if (jours < 60) return "il y a un mois";
      if (jours < 365) return "il y a " + Math.round(jours / 30) + " mois";
      return jours < 730 ? "il y a un an" : "il y a " + Math.floor(jours / 365) + " ans";
    },
    /* Nombre de jours écoulés, pour décider s'il faut le dire du tout. */
    jours: function (iso) {
      if (!iso || !/^\d{4}-\d{2}-\d{2}$/.test(iso)) return -1;
      var p = iso.split("-");
      var alors = new Date(+p[0], +p[1] - 1, +p[2]);
      var t = new Date();
      return Math.round((new Date(t.getFullYear(), t.getMonth(), t.getDate()) - alors) / 86400000);
    },
  };

  /* -------------------------------------- Pied de page enrichi des leçons
     Une leçon n'avait qu'un lien de pied (« ← Retour au programme »), et une
     dizaine de hubs transverses (entraînement, outils, références, espace
     perso) n'étaient atteignables que depuis l'accueil. On construit ici, sur
     les seules pages de leçon (repère : body[data-lesson], présent sur les 1476
     leçons et absent des pages de cours/outils), une grille de liens réutilisant
     le gabarit `.site-footer__grid` déjà stylé pour l'accueil (aucune édition des
     1476 fichiers, aucun CSS nouveau). Profondeur déduite du favicon, comme
     initPWA ; les hubs vivent tous dans pages/. */
  var LESSON_FOOTER_COLS = [
    { titre: "S'entraîner", liens: [
      ["defis.html", "Défis de code"],
      ["devine.html", "Devine la sortie"],
      ["examen.html", "Examen blanc"],
      ["revision.html", "Réviser (flashcards)"],
    ] },
    { titre: "Outils de code", liens: [
      ["playground.html", "Bac à sable web"],
      ["console.html", "Console Python & SQL"],
      ["comparateur.html", "Comparateur de syntaxe"],
      ["outils.html", "Boîte à outils"],
    ] },
    { titre: "Référence", liens: [
      ["glossaire.html", "Glossaire général"],
      ["antiseches.html", "Antisèches"],
      ["pieges.html", "Les pièges du code"],
      ["reference.html", "Fiches de référence"],
      ["carte.html", "Carte des cours"],
    ] },
    { titre: "Mon espace", liens: [
      ["progression.html", "Ma progression"],
      ["bilan.html", "Mon bilan"],
      ["notes.html", "Mes notes"],
      ["mes-qcm.html", "Mes QCM"],
      /* B4 : la page de sauvegarde ET de réparation n'était atteignable que par
         le pied de page de l'accueil — or c'est là qu'on récupère une donnée
         mise de côté parce qu'elle était illisible (cf. B2). */
      ["donnees-perso.html", "Mes données"],
    ] },
  ];

  function initLessonFooter() {
    if (!document.body || !document.body.hasAttribute("data-lesson")) return;
    var container = $(".site-footer .container");
    if (!container) return;
    if (container.querySelector(".site-footer__grid")) return; // idempotent

    // Préfixe vers la racine du site (les hubs sont dans pages/), lu sur le favicon.
    var racine = "";
    var icon = $('link[rel="icon"]');
    if (icon) {
      var m = (icon.getAttribute("href") || "").match(/^(.*?)assets\//);
      if (m) racine = m[1];
    }
    var base = racine + "pages/";

    var grid = document.createElement("div");
    grid.className = "site-footer__grid";

    // Colonne d'intro (large) pour épouser le gabarit « 1.4fr + 4×1fr » de l'accueil.
    var intro = document.createElement("div");
    intro.className = "site-footer__col";
    var ih = document.createElement("h3");
    ih.textContent = "Continuer";
    var ip = document.createElement("p");
    ip.className = "site-footer__about";
    ip.textContent = "Révise, entraîne-toi et garde tes outils à portée — sans quitter ta lancée.";
    intro.appendChild(ih);
    intro.appendChild(ip);
    grid.appendChild(intro);

    LESSON_FOOTER_COLS.forEach(function (col) {
      var c = document.createElement("div");
      c.className = "site-footer__col";
      var h = document.createElement("h3");
      h.textContent = col.titre;
      c.appendChild(h);
      var ul = document.createElement("ul");
      col.liens.forEach(function (l) {
        var li = document.createElement("li");
        var a = document.createElement("a");
        a.setAttribute("href", base + l[0]);
        a.textContent = l[1];
        li.appendChild(a);
        ul.appendChild(li);
      });
      c.appendChild(ul);
      grid.appendChild(c);
    });

    var bottom = container.querySelector(".site-footer__bottom");
    if (bottom) container.insertBefore(grid, bottom);
    else container.appendChild(grid);
  }

  /* ------------------------------------ Palette de recherche au clavier (A1)
     Ouverte par « / » ou Ctrl/⌘+K depuis N'IMPORTE QUELLE page. Cherche dans le
     titre et un court extrait de toutes les leçons via l'index léger js/search-lite.js
     (~300 Ko), chargé à la PREMIÈRE ouverture seulement (zéro coût sinon). C'est
     un accès rapide « aller à » ; un lien mène à la recherche plein-texte
     (pages/recherche.html) pour fouiller tout le contenu. Accessible : dialog
     modal, motif combobox/listbox, focus piégé et rendu à la fermeture. Ne se
     déclenche jamais pendant une saisie (input, textarea, éditeur). */
  function racinePrefix() {
    var icon = $('link[rel="icon"]');
    if (icon) {
      var m = (icon.getAttribute("href") || "").match(/^(.*?)assets\//);
      if (m) return m[1];
    }
    var links = $all(".primary-nav a");
    for (var i = 0; i < links.length; i++) {
      var h = links[i].getAttribute("href") || "";
      if (/(^|\/)index\.html$/.test(h)) return h.replace(/index\.html$/, "");
    }
    return "";
  }

  function initPalette() {
    var root = racinePrefix();
    var overlay = null, input = null, list = null, footLink = null;
    var items = [], active = -1, lastFocus = null;
    var built = false, loading = false, NL = null;

    function norm(s) { return (s || "").toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, ""); }
    function esc(s) {
      return (s || "").replace(/[&<>"]/g, function (c) {
        return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
      });
    }
    function escRe(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }
    /* Surligne dans le texte BRUT puis échappe segment par segment : surligner
       du texte déjà échappé ferait matcher « amp » au milieu de « &amp; ». */
    function highlight(raw, toks) {
      raw = raw || "";
      var ts = toks.filter(function (t) { return t && t.length >= 2; });
      if (!ts.length) return esc(raw);
      var re;
      try { re = new RegExp("(" + ts.map(escRe).join("|") + ")", "gi"); }
      catch (e) { return esc(raw); }
      var out = "", last = 0, m;
      while ((m = re.exec(raw)) !== null) {
        out += esc(raw.slice(last, m.index)) + "<mark>" + esc(m[0]) + "</mark>";
        last = m.index + m[0].length;
        if (m.index === re.lastIndex) re.lastIndex++;
      }
      return out + esc(raw.slice(last));
    }
    function isTyping(el) {
      if (!el) return false;
      var tag = el.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return true;
      if (el.isContentEditable) return true;
      return false;
    }
    function toks(q) { return norm(q).split(/[^a-z0-9+#]+/).filter(function (t) { return t.length >= 2; }); }

    function build() {
      if (built) return;
      built = true;
      overlay = document.createElement("div");
      overlay.className = "cmdk";
      overlay.hidden = true;
      overlay.innerHTML =
        '<div class="cmdk__dialog" role="dialog" aria-modal="true" aria-label="Recherche rapide dans les leçons">' +
          '<div class="cmdk__bar">' +
            '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>' +
            '<input type="text" class="cmdk__input" role="combobox" aria-expanded="false" aria-controls="cmdk-list" aria-activedescendant="" aria-autocomplete="list" autocomplete="off" spellcheck="false" placeholder="Chercher une leçon, une notion…" />' +
            '<kbd class="cmdk__kbd">Échap</kbd>' +
          '</div>' +
          '<ul class="cmdk__list" id="cmdk-list" role="listbox" aria-label="Résultats de recherche"></ul>' +
          '<div class="cmdk__foot">' +
            '<span class="cmdk__hint"><kbd>↑</kbd><kbd>↓</kbd>&nbsp;naviguer&nbsp;·&nbsp;<kbd>↵</kbd>&nbsp;ouvrir&nbsp;·&nbsp;<kbd>Échap</kbd>&nbsp;fermer</span>' +
            '<a class="cmdk__full" href="#">Recherche plein-texte&nbsp;→</a>' +
          '</div>' +
        '</div>';
      document.body.appendChild(overlay);
      input = overlay.querySelector(".cmdk__input");
      list = overlay.querySelector(".cmdk__list");
      footLink = overlay.querySelector(".cmdk__full");

      // Clic sur le fond : fermer. Clic dans une zone morte du dialogue
      // (icône, barre, fond de liste) : empêcher le défocus, sinon le focus
      // fuit sur BODY et « Échap » (écouté sur l'input) cesse de fermer.
      overlay.addEventListener("mousedown", function (e) {
        if (e.target === overlay) { close(); return; }
        if (!e.target.closest("a, button, input, textarea, select")) e.preventDefault();
      });
      // Échap et le piège de tabulation, écoutés au niveau du dialogue :
      // actifs quel que soit l'élément focalisé à l'intérieur (input, lien…).
      overlay.addEventListener("keydown", function (e) {
        if (e.key === "Escape") { e.preventDefault(); close(); }
        else if (e.key === "Tab") { e.preventDefault(); trapTab(e.shiftKey); }
      });
      input.addEventListener("input", function () { render(input.value); });
      input.addEventListener("keydown", onKey);
      list.addEventListener("click", function (e) {
        var li = e.target.closest(".cmdk__item");
        if (li && li.dataset.href) go(li.dataset.href);
      });
      list.addEventListener("mousemove", function (e) {
        var li = e.target.closest(".cmdk__item");
        if (li) setActive(+li.dataset.i);
      });
    }

    function ensureData(cb) {
      if (window.SEARCH_LITE) { cb(true); return; }
      if (loading) { setTimeout(function () { ensureData(cb); }, 60); return; }
      loading = true;
      var s = document.createElement("script");
      s.src = root + "js/search-lite.js";
      s.onload = function () { loading = false; cb(!!window.SEARCH_LITE); };
      s.onerror = function () { loading = false; cb(false); };
      document.head.appendChild(s);
    }
    function ensureNL() {
      if (NL || !window.SEARCH_LITE) return;
      var docs = window.SEARCH_LITE.docs;
      NL = new Array(docs.length);
      for (var i = 0; i < docs.length; i++) NL[i] = [norm(docs[i][2]), norm(docs[i][3])];
    }

    function doSearch(list0) {
      var data = window.SEARCH_LITE;
      if (!data || !list0.length) return [];
      ensureNL();
      var docs = data.docs, courses = data.courses || {}, hits = [];
      for (var i = 0; i < docs.length; i++) {
        var nt = NL[i][0], ns = NL[i][1], inTitle = true, inAny = true;
        for (var k = 0; k < list0.length; k++) {
          var t = list0[k];
          var it = nt.indexOf(t) !== -1;
          if (!it) inTitle = false;
          if (!it && ns.indexOf(t) === -1) { inAny = false; break; }
        }
        if (!inAny) continue;
        var score = inTitle ? 100 : 0;
        if (inTitle && nt.indexOf(list0[0]) === 0) score += 20;
        var d = docs[i];
        hits.push({ d: d[0], f: d[1], t: d[2], s: d[3], ct: courses[d[0]] || d[0], score: score });
      }
      hits.sort(function (a, b) { return b.score - a.score || (a.t < b.t ? -1 : a.t > b.t ? 1 : 0); });
      return hits.slice(0, 40);
    }

    function render(q) {
      var tk = toks(q);
      footLink.setAttribute("href", root + "pages/recherche.html" + (q.trim() ? "?q=" + encodeURIComponent(q.trim()) : ""));
      if (!tk.length) {
        items = []; active = -1; input.setAttribute("aria-activedescendant", "");
        input.setAttribute("aria-expanded", "false");
        list.innerHTML = '<li class="cmdk__empty" role="presentation">Tape au moins deux lettres pour chercher parmi 1511 leçons et 63 pages du site.</li>';
        return;
      }
      items = doSearch(tk);
      if (!items.length) {
        active = -1; input.setAttribute("aria-activedescendant", "");
        input.setAttribute("aria-expanded", "false");
        list.innerHTML = '<li class="cmdk__empty" role="presentation">Aucun résultat. Essaie la <a href="' + esc(footLink.getAttribute("href")) + '">recherche plein-texte</a>.</li>';
        return;
      }
      list.innerHTML = items.map(function (it, idx) {
        return '<li class="cmdk__item" role="option" id="cmdk-opt-' + idx + '" data-i="' + idx + '" data-href="' + esc(root + "pages/" + (it.d ? it.d + "/" : "") + it.f) + '">' +
          '<span class="cmdk__item-title">' + highlight(it.t, tk) + '</span>' +
          '<span class="cmdk__item-course">' + esc(it.ct) + '</span>' +
          '<span class="cmdk__item-snippet">' + highlight(it.s, tk) + '</span>' +
          '</li>';
      }).join("");
      input.setAttribute("aria-expanded", "true");
      setActive(0);
    }

    function setActive(idx) {
      var opts = list.querySelectorAll(".cmdk__item");
      if (!opts.length) { active = -1; return; }
      if (idx < 0) idx = 0;
      if (idx >= opts.length) idx = opts.length - 1;
      for (var i = 0; i < opts.length; i++) opts[i].classList.toggle("is-active", i === idx);
      active = idx;
      var el = opts[idx];
      input.setAttribute("aria-activedescendant", el.id);
      var top = el.offsetTop, bot = top + el.offsetHeight;
      if (top < list.scrollTop) list.scrollTop = top;
      else if (bot > list.scrollTop + list.clientHeight) list.scrollTop = bot - list.clientHeight;
    }

    // Éléments réellement focalisables et visibles du dialogue, dans l'ordre du
    // DOM : l'input, le lien de l'état vide s'il est présent, puis le lien de
    // pied. Le piège de tabulation cycle sur cette liste, donc le lien de
    // l'état « aucun résultat » devient atteignable au clavier.
    function focusables() {
      return Array.prototype.filter.call(
        overlay.querySelectorAll("a[href], button:not([disabled]), input:not([disabled])"),
        function (el) { return el.offsetParent !== null; }
      );
    }
    function trapTab(back) {
      var f = focusables();
      if (!f.length) return;
      var i = f.indexOf(document.activeElement);
      var n = back ? (i <= 0 ? f.length - 1 : i - 1) : (i + 1 >= f.length ? 0 : i + 1);
      f[n].focus();
    }

    function onKey(e) {
      if (e.key === "ArrowDown") { e.preventDefault(); setActive(active + 1); }
      else if (e.key === "ArrowUp") { e.preventDefault(); setActive(active - 1); }
      else if (e.key === "Home" && items.length) { e.preventDefault(); setActive(0); }
      else if (e.key === "End" && items.length) { e.preventDefault(); setActive(items.length - 1); }
      else if (e.key === "Enter") {
        e.preventDefault();
        if (active >= 0 && items[active]) go(root + "pages/" + items[active].d + "/" + items[active].f);
        else { var h = footLink.getAttribute("href"); if (h && h !== "#") go(h); }
      }
    }

    function go(href) { close(); location.href = href; }

    function open() {
      build();
      if (!overlay.hidden) return;
      lastFocus = document.activeElement;
      ensureData(function (ok) {
        overlay.hidden = false;
        document.documentElement.classList.add("cmdk-open");
        input.value = "";
        render("");
        input.focus();
        if (!ok) {
          list.innerHTML = '<li class="cmdk__empty" role="presentation">Index de recherche momentanément indisponible.</li>';
          input.setAttribute("aria-expanded", "false");
        }
      });
    }
    function close() {
      if (!overlay || overlay.hidden) return;
      overlay.hidden = true;
      document.documentElement.classList.remove("cmdk-open");
      if (lastFocus && lastFocus.focus) { try { lastFocus.focus(); } catch (e) {} }
    }

    document.addEventListener("keydown", function (e) {
      if ((e.ctrlKey || e.metaKey) && !e.altKey && (e.key === "k" || e.key === "K")) {
        e.preventDefault();
        if (overlay && !overlay.hidden) close(); else open();
        return;
      }
      if (e.key === "/" && !e.ctrlKey && !e.metaKey && !e.altKey) {
        if (overlay && !overlay.hidden) return;
        if (isTyping(e.target)) return;
        e.preventDefault();
        open();
      }
    });

    /* Un raccourci que personne ne peut deviner n'existe pas. On pose donc un
       bouton dans l'en-tête : il rend la palette atteignable à la souris ET
       annonce la touche « / » à ceux qui préfèrent le clavier. Même patron que
       initAccent() : insertion en tête de .header-actions. */
    var actions = document.querySelector(".header-actions");
    if (actions) {
      var dec = document.createElement("button");
      dec.type = "button";
      dec.className = "cmdk-trigger";
      dec.setAttribute("aria-label", "Rechercher une leçon (raccourci : barre oblique)");
      dec.title = "Rechercher une leçon  —  /  ou  Ctrl+K";
      dec.innerHTML =
        '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">' +
        '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>' +
        '<kbd class="cmdk-trigger__kbd" aria-hidden="true">/</kbd>';
      dec.addEventListener("click", function () {
        if (overlay && !overlay.hidden) close();
        else open();
      });
      actions.insertBefore(dec, actions.firstChild);
    }
  }

  /* --------------------------------------------------------------- Init */
  function init() {
    initThemeToggle();
    initNavToggle();
    initSkipLink();
    initMainNav();
    initLessonFooter();
    initYear();
    initI18n();
    initXP();
    initPWA();
    initAccent();
    initPalette();
    enhanceCodeBlocks();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
