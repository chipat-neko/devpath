/* =============================================================================
   execution.js — le VISUALISEUR d'exécution pas à pas (chantier V15, point B2).
   Page : pages/execution.html. Moteur : js/interpreteur.js.

   CE QUE FAIT CE FICHIER, ET CE QU'IL NE FAIT PAS
   Il n'exécute rien : `js/interpreteur.js` a déjà tout exécuté et rendu une
   TRACE — une liste de pas, chacun avec sa ligne, sa pile d'appels, la chaîne
   de ses portées et le nombre de lignes affichées à cet instant. Ce fichier ne
   fait que MONTRER un pas de cette liste, et permettre d'avancer ou de reculer.
   La séparation est volontaire : le moteur est prouvé par
   `tools/verif-interpreteur.js` (116 programmes exécutés deux fois, 0 écart),
   l'affichage est vérifié par `tools/verif-execution.js` dans un vrai Chrome.

   POURQUOI UNE TRACE PLUTÔT QU'UNE EXÉCUTION QU'ON MET EN PAUSE
   Parce qu'on veut le bouton « pas PRÉCÉDENT ». Un moteur qu'on met en pause ne
   sait pas revenir en arrière ; une liste, si — il suffit de changer d'indice.

   100 % file:// : script classique, aucune dépendance, aucun module ES.
   ============================================================================= */
(function () {
  "use strict";

  var I = window.Interpreteur;
  var EXEMPLES = window.EXECUTION_EXEMPLES || [];

  var selEx = document.getElementById("vex-exemple");
  var zoneCode = document.getElementById("vex-code");
  var btnRelancer = document.getElementById("vex-relancer");
  var elErr = document.getElementById("vex-err");
  var elLignes = document.getElementById("vex-lignes");
  var elPile = document.getElementById("vex-pile");
  var elPortees = document.getElementById("vex-portees");
  var elSortie = document.getElementById("vex-sortie");
  var elPosition = document.getElementById("vex-position");
  var elExplication = document.getElementById("vex-explication");
  var elBilan = document.getElementById("vex-bilan");
  var btnDebut = document.getElementById("vex-debut");
  var btnPrec = document.getElementById("vex-prec");
  var btnSuiv = document.getElementById("vex-suiv");
  var btnFin = document.getElementById("vex-fin");

  if (!elLignes || !I) return;

  var etat = { trace: [], pas: 0, lignes: [], sortie: [], resultat: null };

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }

  /* ---------------------------------------------------------- le sélecteur */

  function remplirSelecteur() {
    if (!selEx) return;
    var groupes = [], parGroupe = {};
    for (var i = 0; i < EXEMPLES.length; i++) {
      var g = EXEMPLES[i].groupe || "Programmes";
      if (!parGroupe[g]) { parGroupe[g] = []; groupes.push(g); }
      parGroupe[g].push(EXEMPLES[i]);
    }
    var html = "";
    for (var k = 0; k < groupes.length; k++) {
      html += '<optgroup label="' + esc(groupes[k]) + '">';
      var lot = parGroupe[groupes[k]];
      for (var j = 0; j < lot.length; j++) {
        html += '<option value="' + esc(lot[j].id) + '">' + esc(lot[j].titre) + "</option>";
      }
      html += "</optgroup>";
    }
    selEx.innerHTML = html;
  }

  function exemplePar(id) {
    for (var i = 0; i < EXEMPLES.length; i++) if (EXEMPLES[i].id === id) return EXEMPLES[i];
    return EXEMPLES[0] || null;
  }

  /* ------------------------------------------------------------ exécution */

  function analyser(source) {
    etat.lignes = String(source).split("\n");
    var r = I.executer(source, { maxTrace: 4000, maxPas: 400000 });
    etat.resultat = r;
    etat.sortie = r.sortie;
    etat.trace = r.trace;
    etat.pas = 0;

    if (r.erreur && !r.trace.length) {
      montrerErreur(r.erreur);
      dessinerLignes(-1);
      elPile.innerHTML = "";
      elPortees.innerHTML = "";
      elSortie.textContent = "";
      elPosition.textContent = "—";
      elExplication.textContent = "";
      elBilan.textContent = "";
      majBoutons();
      return;
    }
    elErr.textContent = "";
    elErr.hidden = true;
    rendre();
  }

  function montrerErreur(err) {
    elErr.hidden = false;
    elErr.textContent = err.nom + (err.ligne ? " — ligne " + err.ligne : "") + " : " + err.message;
  }

  /* ------------------------------------------------------------- affichage */

  function dessinerLignes(ligneCourante) {
    var html = "";
    for (var i = 0; i < etat.lignes.length; i++) {
      var n = i + 1;
      var courante = n === ligneCourante;
      html += '<li class="vex-ligne' + (courante ? " is-courante" : "") + '"' +
        (courante ? ' aria-current="step"' : "") + ' data-n="' + n + '">' +
        '<span class="vex-ligne__num" aria-hidden="true">' + n + "</span>" +
        '<code class="vex-ligne__code">' + (etat.lignes[i] === "" ? "&nbsp;" : esc(etat.lignes[i])) + "</code>" +
        "</li>";
    }
    elLignes.innerHTML = html;
    if (ligneCourante > 0) faireDefiler(ligneCourante);
  }

  /* On fait défiler LA LISTE, jamais la page : `scrollIntoView` remonterait
     l'écran de l'apprenant à chaque pas, ce qui est insupportable.
     Les positions sont mesurées à l'écran (`getBoundingClientRect`) et non par
     `offsetTop` : la boîte qui défile n'est pas positionnée, donc `offsetTop`
     se compte depuis un ancêtre quelconque et le calcul serait faux. */
  function faireDefiler(n) {
    var li = elLignes.querySelector('[data-n="' + n + '"]');
    if (!li) return;
    var rb = elLignes.getBoundingClientRect();
    var rl = li.getBoundingClientRect();
    if (rl.top < rb.top) elLignes.scrollTop -= (rb.top - rl.top) + 8;
    else if (rl.bottom > rb.bottom) elLignes.scrollTop += (rl.bottom - rb.bottom) + 8;
  }

  function dessinerPile(pas) {
    var html = "";
    /* Du dernier appelé au premier : c'est ainsi qu'on dessine une pile. */
    for (var i = pas.pile.length - 1; i >= 0; i--) {
      var c = pas.pile[i];
      html += '<li class="vex-cadre' + (i === pas.pile.length - 1 ? " is-sommet" : "") + '">' +
        '<span class="vex-cadre__nom">' + esc(c.nom) + "</span>" +
        '<span class="vex-cadre__ligne">ligne ' + c.ligne + "</span></li>";
    }
    elPile.innerHTML = html || '<li class="vex-vide">la pile est vide</li>';
  }

  var LIBELLE_PORTEE = {
    "global": "portée globale",
    "fonction": "portée de fonction",
    "bloc": "portée de bloc"
  };

  function dessinerPortees(pas) {
    var html = "";
    for (var i = 0; i < pas.portees.length; i++) {
      var p = pas.portees[i];
      html += '<div class="vex-portee vex-portee--' + esc(p.genre) + '">' +
        '<p class="vex-portee__titre">' + esc(p.titre) +
        ' <span class="vex-portee__genre">' + esc(LIBELLE_PORTEE[p.genre] || p.genre) + "</span></p>";
      if (!p.vars.length) {
        html += '<p class="vex-vide">aucune variable</p>';
      } else {
        html += '<ul class="vex-vars">';
        for (var j = 0; j < p.vars.length; j++) {
          var v = p.vars[j];
          if (v.nom === "__classe__") continue;
          html += '<li class="vex-var' + (v.valeur === "(non initialisée)" ? " is-morte" : "") + '">' +
            '<span class="vex-var__sorte">' + esc(v.sorte) + "</span>" +
            '<span class="vex-var__nom">' + esc(v.nom) + "</span>" +
            '<span class="vex-var__valeur">' + esc(v.valeur) + "</span></li>";
        }
        html += "</ul>";
      }
      html += "</div>";
    }
    elPortees.innerHTML = html;
  }

  function dessinerSortie(pas) {
    var lignes = etat.sortie.slice(0, pas.sortie);
    var html = "";
    for (var i = 0; i < lignes.length; i++) {
      var derniere = (i === lignes.length - 1 && pas.genre === "sortie");
      html += '<span class="vex-sortie__ligne' + (derniere ? " is-neuve" : "") + '">' + esc(lignes[i]) + "</span>\n";
    }
    elSortie.innerHTML = html || '<span class="vex-vide">rien n\'a encore été affiché</span>';
  }

  var LIBELLE_GENRE = {
    instruction: "instruction",
    condition: "condition",
    appel: "appel",
    retour: "retour",
    sortie: "affichage",
    tache: "boucle d'événements",
    attente: "mise en pause",
    attrape: "erreur interceptée",
    erreur: "erreur",
    fin: "fin"
  };
  var DEFAUT_GENRE = {
    instruction: "cette ligne est exécutée",
    condition: "la condition est évaluée pour décider de la suite",
    fin: "le programme est terminé"
  };

  function dessinerExplication(pas) {
    var g = LIBELLE_GENRE[pas.genre] || pas.genre;
    var texte = pas.detail || DEFAUT_GENRE[pas.genre] || "";
    elExplication.innerHTML =
      '<span class="vex-chip vex-chip--' + esc(pas.genre) + '">' + esc(g) + "</span> " +
      (pas.ligne ? '<span class="vex-explication__ligne">ligne ' + pas.ligne + "</span> " : "") +
      esc(texte);
  }

  function rendre() {
    var pas = etat.trace[etat.pas];
    if (!pas) return;
    dessinerLignes(pas.ligne);
    dessinerPile(pas);
    dessinerPortees(pas);
    dessinerSortie(pas);
    dessinerExplication(pas);
    elPosition.textContent = "pas " + (etat.pas + 1) + " sur " + etat.trace.length;
    majBoutons();
    dessinerBilan();
    if (etat.resultat && etat.resultat.erreur) montrerErreur(etat.resultat.erreur);
  }

  function dessinerBilan() {
    var r = etat.resultat;
    if (!r) { elBilan.textContent = ""; return; }
    var t = r.pas + " pas d'exécution, " + etat.trace.length + " montrés, " +
      etat.sortie.length + " ligne" + (etat.sortie.length > 1 ? "s" : "") + " affichée" +
      (etat.sortie.length > 1 ? "s" : "") + ".";
    if (r.tronquee) t += " La trace a été arrêtée à " + etat.trace.length + " pas : le programme en fait davantage.";
    elBilan.textContent = t;
  }

  function majBoutons() {
    var n = etat.trace.length;
    var debut = etat.pas <= 0, fin = etat.pas >= n - 1;
    btnDebut.disabled = !n || debut;
    btnPrec.disabled = !n || debut;
    btnSuiv.disabled = !n || fin;
    btnFin.disabled = !n || fin;
  }

  function aller(i) {
    if (!etat.trace.length) return;
    etat.pas = Math.max(0, Math.min(etat.trace.length - 1, i));
    rendre();
  }

  /* ------------------------------------------------------------ événements */

  btnDebut.addEventListener("click", function () { aller(0); });
  btnPrec.addEventListener("click", function () { aller(etat.pas - 1); });
  btnSuiv.addEventListener("click", function () { aller(etat.pas + 1); });
  btnFin.addEventListener("click", function () { aller(etat.trace.length - 1); });

  if (btnRelancer) {
    btnRelancer.addEventListener("click", function () { analyser(zoneCode.value); });
  }
  if (selEx) {
    selEx.addEventListener("change", function () {
      var ex = exemplePar(selEx.value);
      if (!ex) return;
      zoneCode.value = ex.src;
      analyser(ex.src);
    });
  }

  document.addEventListener("keydown", function (e) {
    var a = document.activeElement;
    if (a && (a.tagName === "TEXTAREA" || a.tagName === "INPUT" || a.tagName === "SELECT")) return;
    if (e.key === "ArrowRight") { aller(etat.pas + 1); e.preventDefault(); }
    else if (e.key === "ArrowLeft") { aller(etat.pas - 1); e.preventDefault(); }
  });

  /* ----------------------------------------------------------- démarrage */

  remplirSelecteur();
  var premier = EXEMPLES[0];
  if (premier) {
    if (selEx) selEx.value = premier.id;
    zoneCode.value = premier.src;
    analyser(premier.src);
  }

  /* Une leçon peut ouvrir la page sur un exemple précis : execution.html#appels */
  var ancre = (window.location.hash || "").replace(/^#/, "");
  if (ancre) {
    var vise = exemplePar(ancre);
    if (vise && vise.id === ancre) {
      if (selEx) selEx.value = vise.id;
      zoneCode.value = vise.src;
      analyser(vise.src);
    }
  }
})();
