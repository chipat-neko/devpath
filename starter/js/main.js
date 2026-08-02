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

    function close() {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    }
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    // Ferme au clic sur un lien ou à l'agrandissement de l'écran
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) close();
    });
    window.addEventListener("resize", function () {
      if (window.innerWidth > 860) close();
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
    "Ma progression": "My progress",
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
      "Programming courses designed as a real journey: we start from what you know, explain the <em>why</em>, show the pitfalls, and every module ends with practice. <strong>65 fully written courses</strong>, from web to systems — start with the <strong>JavaScript</strong> course or pick your own.",
    "home.cta.start": "Start JavaScript",
    "home.cta.catalog": "Browse the catalog",
    "home.meta.courses": "<strong>65</strong> complete courses",
    "home.meta.lessons": "<strong>832</strong> written lessons",
    "home.meta.langs": "<strong>59</strong> languages",
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

  function initI18n() {
    var lang = getLang();
    var actions = $(".header-actions");
    if (actions) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "lang-toggle";
      btn.setAttribute("aria-label", "Changer de langue / Switch language");
      btn.textContent = lang.toUpperCase();
      btn.addEventListener("click", function () {
        lang = lang === "fr" ? "en" : "fr";
        try {
          localStorage.setItem(LANG_KEY, lang);
        } catch (e) {}
        btn.textContent = lang.toUpperCase();
        applyI18n(lang);
      });
      actions.insertBefore(btn, actions.firstChild);
    }
    applyI18n(lang);
  }

  /* --------------------------------------------------- Gamification (XP, P1)
     XP calculée à partir de la progression existante (leçons terminées + scores
     de QCM) — aucune nouvelle donnée obligatoire. Niveaux progressifs, succès
     dérivés de l'état. Exposé via window.SyntaxeXP ; badge dans l'en-tête. */
  function readStore(k) {
    try {
      return JSON.parse(localStorage.getItem(k) || "{}") || {};
    } catch (e) {
      return {};
    }
  }

  function computeXP() {
    var prog = readStore("syntaxe-progress");
    var quiz = readStore("syntaxe-quiz");
    var lessons = 0;
    Object.keys(prog).forEach(function (c) {
      Object.keys(prog[c]).forEach(function (l) {
        if (prog[c][l]) lessons++;
      });
    });
    var quizXP = 0,
      quizPassed = 0,
      quizPerfect = 0;
    Object.keys(quiz).forEach(function (c) {
      Object.keys(quiz[c]).forEach(function (l) {
        var slots = quiz[c][l] || {};
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

  function initXP() {
    var actions = $(".header-actions");
    if (!actions) return;
    var s = computeXP();
    if (s.xp <= 0) return; // rien à afficher pour un nouveau visiteur
    var lv = levelInfo(s.xp);
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

  /* --------------------------------------------------------------- Init */
  function init() {
    initThemeToggle();
    initNavToggle();
    initYear();
    initI18n();
    initXP();
    initPWA();
    initAccent();
    enhanceCodeBlocks();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
