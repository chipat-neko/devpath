/* =============================================================================
   sync.js — Couche d'abstraction de synchronisation de la progression.
   PRÉPARATION du chantier G7 (comptes / synchro multi-appareils).

   ⚠️ NON CHARGÉ PAR DÉFAUT (retiré de progression.html au point C3, 2026-07-31) :
   aucune page ne le charge, car rien n'appelle window.SyntaxeSync tant qu'aucun
   backend n'existe — le livrer sur chaque visite serait du code mort. Pour
   l'activer un jour : (1) ajouter <script src="../js/sync.js" defer></script>
   sur la page voulue, puis (2) brancher un adaptateur (voir ci-dessous).

   ⚠️ Aucun appel réseau par défaut : ce site est STATIQUE, il n'y a PAS de
   serveur fourni. Tout reste local (localStorage). Pour activer une vraie
   synchro, il faut un backend (à la charge de l'hébergeur) et brancher un
   adaptateur :  SyntaxeSync.setAdapter({ pull, push })  puis  SyntaxeSync.sync().

   Réutilise les clés écrites par lecon.js / cours.js / progression.js / main.js.
   Contrat d'un adaptateur :
     pull()         -> Promise<snapshot>   (état du compte côté serveur)
     push(snapshot) -> Promise<void>       (enregistre l'état fusionné)
   Un « snapshot » est l'objet renvoyé par SyntaxeSync.snapshot().
   ============================================================================= */
(function () {
  "use strict";

  var KEYS = ["syntaxe-progress", "syntaxe-quiz", "syntaxe-last", "syntaxe-lang"];

  function readJSON(k) {
    if (window.SyntaxeStore) return window.SyntaxeStore.getJSON(k, null);
    try {
      return JSON.parse(localStorage.getItem(k));
    } catch (e) {
      return null;
    }
  }
  /* Écriture passant par le helper global `SyntaxeStore` (theme.js) quand il
     est là ; sync.js étant une couche dormante, chargée par aucune page, on
     garde un repli local pour qu'il reste utilisable seul. */
  function ecrire(k, v) {
    if (window.SyntaxeStore) return window.SyntaxeStore.set(k, v);
    try {
      localStorage.setItem(k, v);
      return true;
    } catch (e) {
      return false;
    }
  }
  function writeJSON(k, v) {
    if (v === null || v === undefined) return false;
    return ecrire(k, typeof v === "string" ? v : JSON.stringify(v));
  }

  /* Instantané complet de la progression locale. */
  function snapshot() {
    return {
      app: "syntaxe",
      version: 1,
      progress: readJSON("syntaxe-progress") || {},
      quiz: readJSON("syntaxe-quiz") || {},
      last: readJSON("syntaxe-last") || null,
      lang: localStorage.getItem("syntaxe-lang") || null,
    };
  }

  /* Fusion des leçons terminées : union { cours: { leçon: true } }. */
  function mergeProgress(a, b) {
    var out = {};
    [a, b].forEach(function (src) {
      if (!src) return;
      Object.keys(src).forEach(function (course) {
        out[course] = out[course] || {};
        Object.keys(src[course]).forEach(function (lesson) {
          if (src[course][lesson]) out[course][lesson] = true;
        });
      });
    });
    return out;
  }

  /* Fusion des scores de QCM : on garde le MEILLEUR score (best max) par créneau. */
  function mergeQuiz(a, b) {
    var out = {};
    [a, b].forEach(function (src) {
      if (!src) return;
      Object.keys(src).forEach(function (course) {
        out[course] = out[course] || {};
        Object.keys(src[course]).forEach(function (lesson) {
          out[course][lesson] = out[course][lesson] || {};
          Object.keys(src[course][lesson]).forEach(function (slot) {
            var cur = out[course][lesson][slot];
            var inc = src[course][lesson][slot];
            if (!cur || (inc && typeof inc.best === "number" && (!cur.best || inc.best > cur.best))) {
              out[course][lesson][slot] = inc;
            }
          });
        });
      });
    });
    return out;
  }

  /* Fusionne deux instantanés (synchro multi-appareils sans perte). */
  function merge(local, remote) {
    return {
      app: "syntaxe",
      version: 1,
      progress: mergeProgress(local && local.progress, remote && remote.progress),
      quiz: mergeQuiz(local && local.quiz, remote && remote.quiz),
      last: (local && local.last) || (remote && remote.last) || null,
      lang: (local && local.lang) || (remote && remote.lang) || null,
    };
  }

  /* Réécrit un instantané dans le stockage local. */
  function restore(snap) {
    if (!snap) return;
    writeJSON("syntaxe-progress", snap.progress || {});
    writeJSON("syntaxe-quiz", snap.quiz || {});
    if (snap.last) writeJSON("syntaxe-last", snap.last);
    if (snap.lang) {
      ecrire("syntaxe-lang", snap.lang);
    }
  }

  var adapter = null;
  function setAdapter(a) {
    adapter = a;
  }

  /* Synchronisation complète : tire le distant, fusionne, réécrit en local,
     repousse l'état fusionné. Nécessite un adaptateur (donc un backend). */
  function sync() {
    if (!adapter || typeof adapter.pull !== "function" || typeof adapter.push !== "function") {
      return Promise.reject(new Error("Aucun adaptateur de synchronisation branché (backend requis)."));
    }
    return Promise.resolve(adapter.pull()).then(function (remote) {
      var merged = merge(snapshot(), remote);
      restore(merged);
      return Promise.resolve(adapter.push(merged)).then(function () {
        return merged;
      });
    });
  }

  window.SyntaxeSync = {
    keys: KEYS,
    snapshot: snapshot,
    restore: restore,
    merge: merge,
    setAdapter: setAdapter,
    sync: sync,
    hasAdapter: function () {
      return !!adapter;
    },
  };
})();
