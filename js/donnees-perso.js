/* =============================================================================
   donnees-perso.js — Gestionnaire de mes données (T10, Lot 5). Liste les clés
   localStorage du site (préfixe « syntaxe- ») avec leur taille, permet l'export
   global JSON, l'import et l'effacement sélectif/total. 100 % file://.
   Page : pages/donnees-perso.html.
   ============================================================================= */
(function () {
  "use strict";

  var PREFIX = "syntaxe-";
  var LABELS = {
    "syntaxe-progress": "Progression (leçons terminées)",
    "syntaxe-quiz": "Scores de QCM",
    "syntaxe-activity": "Journal d'activité",
    "syntaxe-done-log": "Leçons terminées par jour",
    "syntaxe-last": "Dernière leçon visitée",
    "syntaxe-theme": "Thème clair / sombre",
    "syntaxe-theme-color": "Couleur d'accent",
    "syntaxe-lang": "Langue d'affichage",
    "syntaxe-notes": "Notes & surlignages",
    "syntaxe-revision": "Révision (flashcards)",
    "syntaxe-defis": "Défis de code résolus",
    "syntaxe-mes-qcm": "Mes QCM personnels",
    "syntaxe-goal": "Objectif d'étude",
    "syntaxe-pomodoro": "Sessions Pomodoro",
    "syntaxe-playground": "Bac à sable web",
    "syntaxe-console-python": "Console Python",
    "syntaxe-projets": "Projets — critères validés",
    "syntaxe-antiseches": "Antisèches — dernier cours consulté",
  };

  /* Les fils rouges progressifs mémorisent leur avancement sous
     « syntaxe-fil-rouge-<id> » (clé forgée dans js/fil-rouge.js). Table id → titre
     pour un libellé lisible ; tout id inconnu retombe sur « Fil rouge — <id> »,
     donc plus jamais de nom technique brut, même pour un futur fil rouge. */
  var FR_PREFIX = "syntaxe-fil-rouge-";
  var FIL_ROUGE_TITRES = {
    portfolio: "Mon portfolio + tableau de bord",
    systeme: "Construis ton propre langage de programmation",
    fonctionnel: "Un calculateur symbolique",
    jvm: "Une médiathèque sur la JVM",
    donnees: "Une analyse de données de bout en bout",
    backend: "Une API REST, dans plusieurs langages",
    outils: "Outiller et fiabiliser un projet web",
    mobile: "Une app de notes mobile",
    arcade: "Un casse-briques, du prototype au moteur",
    morpion: "Une IA imbattable au morpion",
    devops: "De l'image au cluster",
    frontpro: "Un front-end de pro",
    echelle: "Concevoir & déployer à l'échelle",
    ia: "Construire une app d'IA",
    fiabilite: "Systèmes fiables & concurrents",
    scripting: "Automatiser le système",
    securite: "Sécuriser une application",
    patrimoine: "Explorer le patrimoine logiciel",
  };

  /* Copie de secours posée par SyntaxeStore.getJSON (theme.js) quand une
     sauvegarde s'est révélée illisible : la version brute est gardée ici pour
     que la première écriture suivante ne l'efface pas. (cf. V12-B2) */
  var SECOURS_PREFIX = "syntaxe-secours-";

  function labelFor(k) {
    if (LABELS[k]) return LABELS[k];
    if (k.indexOf(SECOURS_PREFIX) === 0) {
      var origine = "syntaxe-" + k.slice(SECOURS_PREFIX.length);
      return "⚠ Copie de secours — " + (LABELS[origine] || origine) + " (donnée illisible mise de côté)";
    }
    if (k.indexOf(FR_PREFIX) === 0) {
      var id = k.slice(FR_PREFIX.length);
      return "Fil rouge — " + (FIL_ROUGE_TITRES[id] || id);
    }
    return k;
  }

  var listEl = document.getElementById("dp-list");
  var totalEl = document.getElementById("dp-total");
  var msgEl = document.getElementById("dp-msg");
  var exportBtn = document.getElementById("dp-export");
  var importInput = document.getElementById("dp-import");
  var clearBtn = document.getElementById("dp-clear");
  if (!listEl) return;

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }
  function bytes(val) {
    try {
      return new Blob([val == null ? "" : val]).size;
    } catch (e) {
      return (val == null ? "" : String(val)).length;
    }
  }
  function fmtSize(n) {
    if (n < 1024) return n + " o";
    return Math.round((n / 1024) * 10) / 10 + " Ko";
  }
  function keys() {
    var out = [];
    try {
      for (var i = 0; i < localStorage.length; i++) {
        var k = localStorage.key(i);
        if (k && k.indexOf(PREFIX) === 0) out.push(k);
      }
    } catch (e) {}
    return out.sort();
  }
  function msg(t, ok) {
    if (!msgEl) return;
    msgEl.textContent = t || "";
    msgEl.className = "dp-msg" + (t ? (ok ? " is-ok" : " is-err") : "");
  }

  function render() {
    var ks = keys();
    var total = 0;
    if (!ks.length) {
      listEl.innerHTML = '<p class="dp-empty">Aucune donnée enregistrée pour l\'instant.</p>';
      totalEl.textContent = "";
      return;
    }
    listEl.innerHTML = ks
      .map(function (k) {
        var v = localStorage.getItem(k);
        var sz = bytes(v);
        total += sz;
        return (
          '<div class="dp-row">' +
          '<div class="dp-info"><span class="dp-name">' + esc(labelFor(k)) + "</span>" +
          '<span class="dp-key">' + esc(k) + "</span></div>" +
          '<span class="dp-size">' + fmtSize(sz) + "</span>" +
          '<button type="button" class="dp-del" data-k="' + esc(k) + '" aria-label="Effacer ' + esc(k) + '">Effacer</button>' +
          "</div>"
        );
      })
      .join("");
    totalEl.textContent = ks.length + " entrée" + (ks.length > 1 ? "s" : "") + " · " + fmtSize(total) + " au total";
    listEl.querySelectorAll(".dp-del").forEach(function (b) {
      b.addEventListener("click", function () {
        var k = b.getAttribute("data-k");
        if (window.confirm("Effacer « " + labelFor(k) + " » ? Cette action est définitive.")) {
          var efface = window.SyntaxeStore.remove(k);
          render();
          msg(efface ? "Entrée effacée." : "Effacement impossible : ce navigateur refuse le stockage local.", efface);
        }
      });
    });
  }

  if (exportBtn) {
    exportBtn.addEventListener("click", function () {
      var ks = keys();
      if (!ks.length) return msg("Rien à exporter.", false);
      var data = {};
      ks.forEach(function (k) {
        data[k] = localStorage.getItem(k);
      });
      var blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      var url = URL.createObjectURL(blob);
      var a = document.createElement("a");
      a.href = url;
      a.download = "syntaxe-mes-donnees.json";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.setTimeout(function () {
        URL.revokeObjectURL(url);
      }, 1000);
      msg("Données exportées ✓", true);
    });
  }

  if (importInput) {
    importInput.addEventListener("change", function () {
      var file = importInput.files && importInput.files[0];
      if (!file) return;
      var reader = new FileReader();
      reader.onload = function () {
        try {
          var data = JSON.parse(reader.result);
          if (!data || typeof data !== "object") return msg("Fichier invalide.", false);
          var n = 0;
          Object.keys(data).forEach(function (k) {
            if (k.indexOf(PREFIX) === 0 && typeof data[k] === "string") {
              localStorage.setItem(k, data[k]);
              n++;
            }
          });
          render();
          msg(n + " entrée(s) importée(s) ✓", true);
        } catch (e) {
          msg("JSON invalide.", false);
        }
      };
      reader.readAsText(file);
      importInput.value = "";
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener("click", function () {
      var ks = keys();
      if (!ks.length) return msg("Rien à effacer.", false);
      if (window.confirm("Effacer TOUTES les données du site (" + ks.length + " entrées) ? Cette action est définitive.")) {
        var rates = 0;
        ks.forEach(function (k) {
          if (!window.SyntaxeStore.remove(k)) rates++;
        });
        render();
        if (rates) msg("Effacement impossible : " + rates + " entrée(s) sur " + ks.length + " n'ont pas pu être supprimées.", false);
        else msg("Toutes les données ont été effacées.", true);
      }
    });
  }

  render();
})();
