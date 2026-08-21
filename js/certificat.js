/* =============================================================================
   certificat.js — Génère le certificat de réussite d'un cours TERMINÉ.
   Lit la progression locale (syntaxe-progress) et les scores QCM (syntaxe-quiz),
   exactement comme js/progression.js. Un certificat n'est délivré que si TOUTES
   les leçons du cours sont cochées. Paramètre d'URL ?course=<id> ou sélecteur.
   100 % file://. Aucune donnée envoyée : tout est local.
   ============================================================================= */
(function () {
  "use strict";

  var DATA = window.SITE_DATA;
  if (!DATA) return;

  var MONTHS = [
    "janvier", "février", "mars", "avril", "mai", "juin",
    "juillet", "août", "septembre", "octobre", "novembre", "décembre",
  ];

  function esc(s) {
    return (s || "").replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }
  function progress() {
    return window.SyntaxeStore.getJSON("syntaxe-progress", {});
  }
  function quizScores() {
    return window.SyntaxeStore.getJSON("syntaxe-quiz", {});
  }
  function glyphOf(id) {
    if (window.courseLogo) {
      var g = window.courseLogo(id);
      if (g) return g;
    }
    var c = DATA.content[id];
    return c && c.title ? c.title.charAt(0) : "?";
  }
  function frDate(d) {
    return d.getDate() + " " + MONTHS[d.getMonth()] + " " + d.getFullYear();
  }

  /* Meilleur QCM bilan d'un cours.
     Quatre cours (css, html, javascript, python) portent un bilan de PALIER, à
     la dernière leçon de leur programme d'origine, en plus du bilan final : le
     score n'est donc plus forcément rangé sous la dernière leçon. On balaie
     toutes les leçons déclarées et on garde le meilleur (au ratio ; à ratio
     égal, celui qui compte le plus de questions). Un cours à bilan unique —
     les 72 autres — renvoie exactement le même objet qu'avant. */
  function bilanRatio(b) {
    return b && b.total ? b.best / b.total : 0;
  }
  function bestBilan(scores, files) {
    var best = null;
    for (var i = 0; i < files.length; i++) {
      var entry = scores[files[i]];
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

  /* Calcule l'état d'un cours : total/done leçons, % et meilleur score au QCM bilan. */
  function computeCourse(id) {
    var c = DATA.content[id];
    if (!c) return null;
    var p = progress()[id] || {};
    var scores = quizScores()[id] || {};
    var total = 0, done = 0, files = [];
    c.modules.forEach(function (m) {
      m.lessons.forEach(function (l) {
        total++;
        files.push(l.file);
        if (p[l.file]) done++;
      });
    });
    var bilan = bestBilan(scores, files);
    var scorePct = bilan && bilan.total ? Math.round((bilan.best / bilan.total) * 100) : null;
    return {
      id: id,
      dir: c.dir || id, // dossier réel (≠ id pour javascript, dont le dir est « js »)
      title: c.title,
      total: total,
      done: done,
      complete: total > 0 && done >= total,
      pct: total ? Math.round((done / total) * 100) : 0,
      scorePct: scorePct,
      mastered: total > 0 && done >= total && scorePct !== null && scorePct >= 70,
    };
  }

  /* Liste des cours terminés (toutes leçons cochées), triés par titre. */
  function finishedCourses() {
    var out = [];
    Object.keys(DATA.content).forEach(function (id) {
      var c = computeCourse(id);
      if (c && c.complete) out.push(c);
    });
    out.sort(function (a, b) { return a.title.localeCompare(b.title, "fr"); });
    return out;
  }

  function courseMeta(id) {
    for (var i = 0; i < DATA.courses.length; i++) {
      if (DATA.courses[i].id === id) return DATA.courses[i];
    }
    return null;
  }

  /* Énumération française : « A », « A et B », « A, B et C ». */
  function joinFr(noms) {
    if (noms.length === 1) return noms[0];
    return noms.slice(0, -1).join(", ") + " et " + noms[noms.length - 1];
  }

  /* Texte d'introduction, conditionnel à la progression réelle : rien de
     débloqué, quelques-uns, ou tous. Sans ça, « Termine un cours pour débloquer
     son certificat » s'affiche même avec 76 certificats déjà disponibles.
     Ne touche qu'au TEXTE — le sélecteur et le rendu restent inchangés. */
  function updateLead(finished) {
    var lead = document.querySelector("[data-cert-lead]");
    if (!lead) return;
    var certifiables = [];
    Object.keys(DATA.content).forEach(function (id) {
      var c = computeCourse(id);
      if (c && c.total > 0) certifiables.push(c);
    });
    var total = certifiables.length;
    var k = finished.length;
    if (k === 0) {
      lead.textContent =
        "Termine un cours (toutes ses leçons) pour débloquer son certificat.";
    } else if (k >= total) {
      lead.textContent =
        "Tes " + total + " certificats sont débloqués, un par cours terminé. " +
        "Choisis-en un ci-dessous, puis imprime-le ou enregistre-le en PDF.";
    } else {
      var reste = certifiables.filter(function (c) { return !c.complete; });
      var manque = "";
      /* Nommer les manquants seulement quand il en reste peu : sinon la liste
         serait interminable et illisible. */
      if (reste.length <= 3) {
        manque = " Il te reste " + joinFr(reste.map(function (c) { return c.title; })) + ".";
      }
      lead.textContent =
        k + (k > 1 ? " certificats débloqués" : " certificat débloqué") +
        " sur " + total + "." + manque +
        " Choisis un cours ci-dessous, puis imprime-le ou enregistre-le en PDF.";
    }
  }

  /* Rendu du certificat lui-même. */
  function renderCertificate(c) {
    var meta = courseMeta(c.id);
    var language = meta && meta.language ? meta.language : "";
    var mention = c.mastered ? "avec la mention « Maîtrisé »" : "";
    var scoreLine = c.scorePct !== null
      ? c.scorePct + "% au QCM bilan"
      : "QCM bilan non passé";

    return (
      '<article class="certificate' + (c.mastered ? " certificate--master" : "") + '" id="certificate">' +
      '<div class="certificate__frame">' +
      '<div class="certificate__head">' +
      '<span class="certificate__brand">Syntaxe<span aria-hidden="true">.</span></span>' +
      '<span class="certificate__seal" aria-hidden="true">' + (c.mastered ? "🏆" : "🎓") + "</span>" +
      "</div>" +
      '<p class="certificate__kicker">Certificat de réussite</p>' +
      '<p class="certificate__intro">Ce certificat atteste de l\'achèvement du cours</p>' +
      '<h2 class="certificate__course">' +
      '<span class="certificate__glyph" data-accent="' + esc(c.id) + '" aria-hidden="true">' + glyphOf(c.id) + "</span>" +
      esc(c.title) +
      "</h2>" +
      (language ? '<p class="certificate__lang">' + esc(language) + "</p>" : "") +
      '<div class="certificate__stats">' +
      '<div class="certificate__stat"><span class="certificate__stat-n">' + c.done + " / " + c.total + "</span><span class=\"certificate__stat-l\">leçons terminées</span></div>" +
      '<div class="certificate__stat"><span class="certificate__stat-n">' + c.pct + "%</span><span class=\"certificate__stat-l\">du cours complété</span></div>" +
      '<div class="certificate__stat"><span class="certificate__stat-n">' + (c.scorePct !== null ? c.scorePct + "%" : "—") + "</span><span class=\"certificate__stat-l\">score au QCM bilan</span></div>" +
      "</div>" +
      (mention ? '<p class="certificate__mention">' + mention + "</p>" : "") +
      '<div class="certificate__foot">' +
      '<span class="certificate__date">Délivré le ' + frDate(new Date()) + "</span>" +
      '<span class="certificate__note">Parcours auto-évalué · ' + esc(scoreLine) + "</span>" +
      "</div>" +
      "</div>" +
      "</article>" +
      '<p class="certificate__disclaimer" data-print-hide>Certificat personnel de suivi, fondé sur ta progression enregistrée localement. ' +
      "Syntaxe est un projet de démonstration : ce document n'a pas de valeur officielle.</p>"
    );
  }

  function show(id) {
    var host = document.getElementById("cert-host");
    var status = document.getElementById("cert-status");
    var printBtn = document.getElementById("cert-print");
    if (!host) return;
    var c = id ? computeCourse(id) : null;

    if (!c) {
      host.innerHTML = "";
      if (printBtn) printBtn.hidden = true;
      if (status) status.textContent = "Choisis un cours terminé pour générer son certificat.";
      return;
    }
    if (!c.complete) {
      host.innerHTML =
        '<p class="cert-incomplete">Tu n\'as pas encore terminé « ' + esc(c.title) + " » (" +
        c.done + " / " + c.total + " leçons, " + c.pct + "%). " +
        'Termine toutes les leçons pour débloquer ce certificat. <a href="' +
        esc(c.dir) + '/cours.html">Reprendre le cours →</a></p>';
      if (printBtn) printBtn.hidden = true;
      if (status) status.textContent = "Cours non terminé.";
      return;
    }
    host.innerHTML = renderCertificate(c);
    if (printBtn) printBtn.hidden = false;
    if (status) status.textContent = "";
  }

  function getParam(name) {
    var m = new RegExp("[?&]" + name + "=([^&]+)").exec(window.location.search);
    return m ? decodeURIComponent(m[1]) : null;
  }

  function init() {
    var select = document.getElementById("cert-select");
    var status = document.getElementById("cert-status");
    var printBtn = document.getElementById("cert-print");
    var finished = finishedCourses();
    var requested = getParam("course");

    updateLead(finished);

    if (select) {
      if (!finished.length) {
        select.innerHTML = '<option value="">Aucun cours terminé pour l\'instant</option>';
        select.disabled = true;
      } else {
        var opts = ['<option value="">— Choisir un cours —</option>'];
        finished.forEach(function (c) {
          var sel = c.id === requested ? " selected" : "";
          opts.push('<option value="' + esc(c.id) + '"' + sel + ">" + esc(c.title) + "</option>");
        });
        select.innerHTML = opts.join("");
      }
      select.addEventListener("change", function () {
        show(select.value || null);
      });
    }

    if (printBtn) {
      printBtn.addEventListener("click", function () { window.print(); });
    }

    /* Cas particulier : ?course=<id> demandé mais cours non terminé → message dédié. */
    if (requested && computeCourse(requested) && !computeCourse(requested).complete) {
      show(requested);
      return;
    }
    var initial = (requested && finished.some(function (c) { return c.id === requested; })) ? requested : null;
    if (initial) {
      show(initial);
    } else if (!finished.length) {
      if (status) {
        status.innerHTML =
          'Tu n\'as encore terminé aucun cours. <a href="catalogue.html">Explore le catalogue</a> et reviens ici une fois un cours complété&nbsp;!';
      }
    } else {
      show(null);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
