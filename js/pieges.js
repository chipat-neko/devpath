/* =============================================================================
   pieges.js — Les pièges du code, rassemblés PAR COURS.

   POURQUOI (point V12-D1). Le site s'est donné une convention éditoriale forte —
   1 773 encadrés « Piège fréquent » (et « Erreur fréquente ») sur 949 leçons et
   65 cours — et aucune page ne les rassemblait. Or un piège est exactement le
   matériau qu'on veut relire avant un exercice : une prédiction vérifiable, pas
   une définition. Zéro contenu nouveau : tout est déjà écrit dans les leçons.

   Source : window.PIEGES (js/pieges-data.js), généré par tools/build-index.js.
   Enregistrement :
     c  dossier du cours (js, pas javascript)   ct titre du cours
     f  fichier de la leçon                     n  numéro de la leçon
     lt titre de la leçon                       t  intitulé de l'encadré
     x  le texte du piège
   `x` contient du balisage en ligne (code, strong, em…) assaini à la génération :
   on l'injecte donc en HTML, comme antiseches.js le fait pour ses cellules. Tout
   le reste (titres, fichiers) est échappé.

   Page : pages/pieges.html. 100 % statique, aucun fetch.
   ============================================================================= */
(function () {
  "use strict";

  var PIEGES = window.PIEGES || [];
  var sel = document.getElementById("piege-course");
  var out = document.getElementById("piege-list");
  var countEl = document.getElementById("piege-count");
  var searchEl = document.getElementById("piege-search");
  if (!out) return;

  var KEY = "syntaxe-pieges"; /* dernier cours consulté */

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }
  function norm(s) {
    return String(s == null ? "" : s)
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .toLowerCase();
  }
  function stripTags(s) {
    return String(s == null ? "" : s).replace(/<[^>]+>/g, " ");
  }

  /* Index de texte, construit paresseusement : 1 773 entrées, inutile de le
     payer si l'apprenant ne cherche rien. */
  var indexed = false;
  function ensureIndex() {
    if (indexed) return;
    PIEGES.forEach(function (p) {
      p._txt = norm(stripTags([p.ct, p.lt, p.t, p.x].join(" ")));
    });
    indexed = true;
  }

  /* Cours présents, triés par titre. */
  var cours = (function () {
    var vus = {}, liste = [];
    PIEGES.forEach(function (p) {
      if (vus[p.c]) return;
      vus[p.c] = 1;
      liste.push({ dir: p.c, titre: p.ct });
    });
    liste.sort(function (a, b) {
      return a.titre.localeCompare(b.titre, "fr");
    });
    return liste;
  })();

  function compteParCours(dir) {
    var n = 0;
    PIEGES.forEach(function (p) {
      if (p.c === dir) n++;
    });
    return n;
  }

  function remplirSelect() {
    if (!sel) return;
    var html = "";
    cours.forEach(function (c) {
      html += '<option value="' + esc(c.dir) + '">' + esc(c.titre) +
        " (" + compteParCours(c.dir) + ")</option>";
    });
    sel.innerHTML = html;
  }

  /* Un piège = son texte, l'origine (leçon numérotée) et le lien pour y aller.
     Le lien pointe vers la leçon : depuis pages/pieges.html, c'est <cours>/<fichier>. */
  function carte(p, avecCours) {
    return (
      '<li class="piege">' +
      '<p class="piege__texte">' + p.x + "</p>" +
      '<p class="piege__source">' +
      (avecCours ? '<span class="piege__cours">' + esc(p.ct) + "</span> · " : "") +
      '<a href="' + esc(p.c) + "/" + esc(p.f) + '">' +
      (p.n ? "Leçon " + esc(p.n) + " — " : "") + esc(p.lt) + "</a></p>" +
      "</li>"
    );
  }

  function rendreListe(items, avecCours) {
    if (!items.length) {
      out.innerHTML = '<p class="piege-empty">Aucun piège ne correspond.</p>';
      return;
    }
    /* Groupés par leçon : c'est l'ordre dans lequel on les a rencontrés. */
    var html = "";
    var lastKey = null;
    items.forEach(function (p) {
      var key = p.c + "/" + p.f;
      if (key !== lastKey) {
        if (lastKey !== null) html += "</ul>";
        html += '<ul class="piege-list">';
        lastKey = key;
      }
      html += carte(p, avecCours);
    });
    if (lastKey !== null) html += "</ul>";
    out.innerHTML = html;
  }

  function majCompte(n, total) {
    if (!countEl) return;
    countEl.textContent =
      n === total
        ? n + " piège" + (n > 1 ? "s" : "")
        : n + " sur " + total + " piège" + (total > 1 ? "s" : "");
  }

  function rendreCours(dir) {
    var items = PIEGES.filter(function (p) {
      return p.c === dir;
    });
    rendreListe(items, false);
    majCompte(items.length, PIEGES.length);
    if (window.SyntaxeStore) window.SyntaxeStore.setJSON(KEY, dir);
  }

  function rechercher(q) {
    ensureIndex();
    var mots = norm(q).split(/\s+/).filter(Boolean);
    var items = PIEGES.filter(function (p) {
      return mots.every(function (m) {
        return p._txt.indexOf(m) !== -1;
      });
    });
    /* On plafonne l'affichage : 1 773 cartes d'un coup ne servent personne et
       coûtent cher à rendre. */
    var LIMITE = 120;
    rendreListe(items.slice(0, LIMITE), true);
    majCompte(items.length, PIEGES.length);
    if (items.length > LIMITE) {
      out.insertAdjacentHTML(
        "beforeend",
        '<p class="piege-empty">Les ' + LIMITE + " premiers sont affichés — précise ta recherche.</p>"
      );
    }
  }

  remplirSelect();

  /* Priorité : ancre (pieges.html#js, pour un lien depuis un cours), puis
     dernier cours consulté, sinon le premier de la liste. */
  var voulu = decodeURIComponent((location.hash || "").replace(/^#/, ""));
  var memoire = window.SyntaxeStore ? window.SyntaxeStore.getJSON(KEY, null) : null;
  var depart =
    (voulu && compteParCours(voulu) ? voulu : null) ||
    (typeof memoire === "string" && compteParCours(memoire) ? memoire : null) ||
    (cours[0] && cours[0].dir);

  if (depart) {
    if (sel) sel.value = depart;
    rendreCours(depart);
  }

  if (sel) {
    sel.addEventListener("change", function () {
      if (searchEl) searchEl.value = "";
      rendreCours(sel.value);
    });
  }
  if (searchEl) {
    var minuteur = null;
    searchEl.addEventListener("input", function () {
      window.clearTimeout(minuteur);
      minuteur = window.setTimeout(function () {
        var q = searchEl.value.trim();
        if (!q) {
          rendreCours(sel ? sel.value : depart);
          return;
        }
        rechercher(q);
      }, 160);
    });
  }
})();
