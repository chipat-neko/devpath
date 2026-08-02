/* =============================================================================
   fils-rouges.js — Page « hub » des fils rouges (pages/fils-rouges.html).
   Pour chaque carte de fil rouge, lit sa progression dans localStorage
   (clé `data-fr-key`, total d'étapes `data-fr-total`) et affiche combien
   d'étapes ont été abordées. 100 % file://. Aucune dépendance aux données
   détaillées des fils rouges.
   ============================================================================= */
(function () {
  "use strict";

  var cards = document.querySelectorAll(".frhub-card");
  Array.prototype.forEach.call(cards, function (card) {
    var key = card.getAttribute("data-fr-key");
    var total = parseInt(card.getAttribute("data-fr-total"), 10) || 0;
    var el = card.querySelector("[data-fr-progress]");
    if (!el || !key) return;

    var store = {};
    try {
      store = JSON.parse(localStorage.getItem(key) || "{}") || {};
    } catch (e) {
      store = {};
    }

    var started = 0;
    Object.keys(store).forEach(function (n) {
      var st = store[n];
      if (st && Object.keys(st).length > 0) started++;
    });

    if (started === 0) {
      el.innerHTML = '<span class="frhub-card__pgtext">Pas encore commencé</span>';
      return;
    }
    var pct = total ? Math.round((started / total) * 100) : 0;
    el.innerHTML =
      '<span class="frhub-card__pgtext">' + started + " / " + total + " étapes abordées</span>" +
      '<span class="frhub-bar"><span class="frhub-bar__fill" style="width:' + pct + '%"></span></span>';
  });
})();
