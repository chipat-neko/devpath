/* stockage.js (inclus dans theme.js) — les accès à localStorage qui ne se
   taisent plus. Défini ici parce que theme.js est le PREMIER script de toutes
   les pages, chargé sans `defer` : tous les autres scripts s'exécutent après lui.

   ÉCRITURE (V12-B1). Sur 29 points d'écriture, 21 avalaient l'échec dans un
   `catch (e) {}` vide : en navigation privée stricte, sur un profil durci ou
   avec un quota plein, l'apprenant travaillait une heure sans qu'un mot ne lui
   dise que rien n'était gardé. `set`, `setJSON` et `remove` renvoient un
   booléen et préviennent via le bandeau `window.SyntaxeToast` (main.js).

   LECTURE (V12-B2). Les 36 lecteurs faisaient `try { JSON.parse(…) } catch
   { return {} }` : une donnée ABÎMÉE était donc indistinguable d'une donnée
   ABSENTE. La progression paraissait effacée, rien ne le disait, et la première
   écriture suivante l'écrasait définitivement. `getJSON` sépare les deux cas :
   si la valeur est présente mais illisible, elle est MISE DE CÔTÉ sous
   `syntaxe-secours-…` (donc plus rien n'est perdu, et la page « Mes données »
   l'exporte comme le reste) et l'apprenant est prévenu. */
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

  /* Une donnée illisible est mise à l'abri AVANT que la première écriture ne
     l'écrase. On ne recopie qu'une fois : les lecteurs sont appelés en boucle,
     et la deuxième copie écraserait la bonne avec la même valeur abîmée. */
  function quarantaine(cle, brut) {
    var secours = "syntaxe-secours-" + cle.replace(/^syntaxe-/, "");
    var deja = null;
    try { deja = localStorage.getItem(secours); } catch (e) {}
    var sauve = deja !== null;
    if (!sauve) {
      try {
        localStorage.setItem(secours, brut);
        sauve = true;
      } catch (e) {}
    }
    prevenir(
      sauve
        ? "Sauvegarde illisible : « " + cle + " » était abîmée. La version brute est " +
          "mise de côté, tu peux la récupérer depuis « Mes données ». Le site repart " +
          "de zéro pour cette donnée."
        : "Sauvegarde illisible : « " + cle + " » était abîmée, et il n'y a pas eu " +
          "la place de la mettre de côté. Exporte tes données depuis « Mes données » " +
          "avant de continuer."
    );
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
    echecs: 0,  /* compteurs, utilisés par les vérifications automatisées */
    abimees: 0,
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
    /* Lit une valeur JSON. Trois cas SÉPARÉS :
         - absente (ou stockage inaccessible) : renvoie `defaut`, en silence ;
         - présente et lisible : renvoie la valeur ;
         - présente mais ILLISIBLE : la met de côté, prévient, renvoie `defaut`.
       `null` stocké est traité comme absent : c'est ce que faisaient déjà les
       lecteurs, avec leur `|| "{}"` puis `|| {}`. */
    getJSON: function (cle, defaut) {
      var brut = null;
      try {
        brut = localStorage.getItem(cle);
      } catch (e) {
        this.echecs++;
        return defaut;
      }
      if (brut === null || brut === "") return defaut;
      var v;
      try {
        v = JSON.parse(brut);
      } catch (e) {
        this.abimees++;
        quarantaine(cle, brut);
        return defaut;
      }
      return v === null || v === undefined ? defaut : v;
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
