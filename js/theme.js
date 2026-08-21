/* stockage.js (inclus dans theme.js) — Écriture localStorage qui ne se tait plus.
   Constat V12-B1 : sur 29 points d'écriture, 21 avalaient l'échec dans un
   `catch (e) {}` vide. En navigation privée stricte, sur un profil durci ou
   avec un quota plein, l'apprenant travaillait une heure sans qu'un mot ne
   lui dise que rien n'était gardé.
   `SyntaxeStore.set` renvoie un booléen ET prévient (une fois par cause,
   par session) via le bandeau `window.SyntaxeToast` défini dans main.js.
   Défini ici parce que theme.js est le PREMIER script de toutes les pages,
   chargé sans `defer` : tous les autres scripts s'exécutent après lui. */
(function () {
  "use strict";
  /* Un seul bandeau par cause dans la minute : une rafale d'écritures (un clic
     en déclenche jusqu'à 4) ne matraque pas, mais l'apprenant qui continue à
     travailler est RE-prévenu — sinon il tape ses notes une heure dans le
     silence après un unique message. La portée est la page : ce site multi-pages
     recharge tout à chaque navigation. */
  var dernier = {};
  var RAPPEL = 60000;
  var REFUS =
    "Enregistrement impossible : ce navigateur refuse le stockage local (navigation privée ?). Rien ne sera gardé d'une visite à l'autre.";
  var PLEIN =
    "Espace de stockage plein : cet enregistrement n'a pas été gardé. Exporte tes données depuis « Mes données », puis fais de la place.";

  /* Le bandeau vit dans main.js, chargé en `defer` : au tout premier
     chargement il peut ne pas encore exister. On réessaie ~4 s. */
  function prevenir(texte) {
    var maintenant = new Date().getTime();
    if (dernier[texte] && maintenant - dernier[texte] < RAPPEL) return;
    dernier[texte] = maintenant;
    var essais = 0;
    (function pousser() {
      if (typeof window.SyntaxeToast === "function" && document.body) {
        window.SyntaxeToast(texte, true);
        return;
      }
      if (++essais > 40) return;
      window.setTimeout(pousser, 100);
    })();
  }

  /* Quota dépassé : code 22 (standard), 1014 (Firefox), ou le nom. */
  function estQuota(e) {
    if (!e) return false;
    return (
      e.code === 22 ||
      e.code === 1014 ||
      e.name === "QuotaExceededError" ||
      e.name === "NS_ERROR_DOM_QUOTA_REACHED"
    );
  }

  window.SyntaxeStore = {
    echecs: 0, /* compteur, utilisé par les vérifications automatisées */
    /* Écrit une chaîne. Renvoie true si c'est bien passé. */
    set: function (cle, valeur) {
      try {
        localStorage.setItem(cle, valeur);
        return true;
      } catch (e) {
        this.echecs++;
        prevenir(estQuota(e) ? PLEIN : REFUS);
        return false;
      }
    },
    /* Sérialise puis écrit. Renvoie false si la sérialisation échoue
       (référence circulaire) comme si l'écriture avait échoué. */
    setJSON: function (cle, valeur) {
      var texte;
      try {
        texte = JSON.stringify(valeur);
      } catch (e) {
        this.echecs++;
        return false;
      }
      return this.set(cle, texte);
    },
    /* Efface une clé. Renvoie true si c'est bien passé. */
    remove: function (cle) {
      try {
        localStorage.removeItem(cle);
        return true;
      } catch (e) {
        this.echecs++;
        return false;
      }
    },
  };
})();

/* theme.js — Applique le thème AVANT le rendu pour éviter tout clignotement.
   À charger en tête de page de façon bloquante (sans defer) :
     <script src="../js/theme.js"></script>
   Le bouton de bascule est câblé dans main.js. */
(function () {
  "use strict";
  var KEY = "syntaxe-theme";
  var stored = null;
  try {
    stored = localStorage.getItem(KEY);
  } catch (e) {
    /* localStorage indisponible (navigation privée stricte, file://) */
  }
  // Aperçu via URL (?theme=dark) — pratique pour tester, n'écrase pas le choix stocké
  var override = null;
  try {
    var m = /[?&]theme=(dark|light)/.exec(window.location.search);
    if (m) override = m[1];
  } catch (e) {}

  var prefersDark =
    window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  var theme =
    override ||
    (stored === "light" || stored === "dark" ? stored : prefersDark ? "dark" : "light");
  document.documentElement.setAttribute("data-theme", theme);

  // Exposé pour main.js (bascule + persistance)
  window.SyntaxeTheme = {
    key: KEY,
    get: function () {
      return document.documentElement.getAttribute("data-theme");
    },
    set: function (value) {
      document.documentElement.setAttribute("data-theme", value);
      window.SyntaxeStore.set(KEY, value);
    },
    toggle: function () {
      this.set(this.get() === "dark" ? "light" : "dark");
      return this.get();
    },
  };

  /* Couleur d'accent (palette) — appliquée tôt pour éviter le clignotement. */
  var AKEY = "syntaxe-theme-color";
  var accent = null;
  try {
    accent = localStorage.getItem(AKEY);
  } catch (e) {}
  if (accent && accent !== "indigo") {
    document.documentElement.setAttribute("data-accent", accent);
  }
  window.SyntaxeAccent = {
    key: AKEY,
    list: ["indigo", "emeraude", "ambre", "framboise", "cyan", "violet"],
    get: function () {
      return document.documentElement.getAttribute("data-accent") || "indigo";
    },
    set: function (value) {
      if (!value || value === "indigo") document.documentElement.removeAttribute("data-accent");
      else document.documentElement.setAttribute("data-accent", value);
      window.SyntaxeStore.set(AKEY, value || "indigo");
    },
  };
})();
