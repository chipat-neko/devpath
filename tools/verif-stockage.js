#!/usr/bin/env node
"use strict";

/**
 * tools/verif-stockage.js — Prouve que le site PRÉVIENT quand localStorage refuse.
 *
 * POURQUOI CE SCRIPT
 * ------------------
 * Point V12-B1 : sur 29 points d'écriture `localStorage.setItem`, 21 avalaient
 * l'échec dans un `catch (e) {}` vide. En navigation privée stricte, sur un
 * profil aux cookies bloqués ou avec un quota plein, l'apprenant travaillait
 * une heure sans qu'un mot ne lui dise que rien n'était gardé — y compris les
 * questions qu'il avait rédigées (mes-qcm) et le code qu'il avait écrit
 * (playground). Un helper `window.SyntaxeStore` (défini en tête de js/theme.js)
 * porte désormais toutes ces écritures et affiche un bandeau.
 *
 * Aucun vérificateur statique ne peut prouver ça : il faut un vrai navigateur,
 * un vrai clic, et un localStorage qui refuse pour de bon. C'est ce que fait
 * ce script, en pilotant Chrome par CDP comme verif-rendu.js.
 *
 * CE QU'IL FAIT
 * -------------
 *  1. Lance Chrome headless, réseau coupé, sur une page en file://.
 *  2. AVANT tout script de page, remplace `Storage.prototype.setItem` par une
 *     fonction qui jette — ou rend `window.localStorage` inaccessible.
 *  3. Rejoue un geste réel de l'apprenant (clic « Marquer comme terminée »,
 *     frappe dans l'éditeur du bac à sable, bascule de thème…).
 *  4. Vérifie qu'un bandeau `.toast--err` apparaît AVEC LE BON MESSAGE,
 *     que le quota plein se distingue du refus, et — non-régression — que sur
 *     un stockage sain il n'y a AUCUN bandeau et que la donnée est bien écrite.
 *  5. Sème aussi des données ABÎMÉES (V12-B2) et vérifie qu'elles sont
 *     signalées puis mises de côté sous `syntaxe-secours-…` à l'identique,
 *     alors qu'une donnée simplement ABSENTE ne produit rien.
 *  6. Importe un VRAI fichier dans le vrai <input type=file> (V12-B3) et
 *     vérifie la valeur finale des clés selon le choix — fusionner, remplacer,
 *     annuler. Une fusion se juge sur le résultat, pas sur un message.
 *
 * USAGE
 *   node tools/verif-stockage.js            # les 22 scénarios (B1-B3, C1-C3)
 *   node tools/verif-stockage.js --detail   # + le détail de chaque mesure
 *   CHROME_PATH=... node tools/verif-stockage.js
 *
 * Sort en 1 si un seul scénario n'est pas conforme.
 */

var fs = require("fs");
var path = require("path");
var os = require("os");
var cp = require("child_process");

var args = process.argv.slice(2);
var DETAIL = args.indexOf("--detail") !== -1;
var ROOT = path.resolve(__dirname, "..");

function attendre(ms) {
  return new Promise(function (r) { setTimeout(r, ms); });
}

function trouverChrome() {
  var candidats = [
    process.env.CHROME_PATH,
    "C:/Program Files/Google/Chrome/Application/chrome.exe",
    "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
    path.join(os.homedir(), "AppData/Local/Google/Chrome/Application/chrome.exe"),
    "/usr/bin/google-chrome",
    "/usr/bin/chromium",
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  ].filter(Boolean);
  for (var i = 0; i < candidats.length; i++) {
    try { if (fs.existsSync(candidats[i])) return candidats[i]; } catch (e) {}
  }
  return null;
}

/* Client CDP minimal : Node >= 22 expose WebSocket globalement. */
function Client(url) {
  this.ws = new WebSocket(url);
  this.id = 0;
  this.encours = {};
  var self = this;
  this.pret = new Promise(function (r) { self.ws.onopen = r; });
  this.ws.onmessage = function (ev) {
    var m = JSON.parse(ev.data);
    if (m.id && self.encours[m.id]) {
      var h = self.encours[m.id];
      delete self.encours[m.id];
      if (m.error) h.rej(new Error(m.error.message));
      else h.res(m.result);
    }
  };
}
Client.prototype.envoyer = function (methode, params, sess) {
  var self = this, id = ++this.id;
  return new Promise(function (res, rej) {
    self.encours[id] = { res: res, rej: rej };
    var o = { id: id, method: methode, params: params || {} };
    if (sess) o.sessionId = sess;
    self.ws.send(JSON.stringify(o));
    setTimeout(function () {
      if (self.encours[id]) { delete self.encours[id]; rej(new Error("délai : " + methode)); }
    }, 30000);
  });
};

/* ------------------------------------------- le mouchard et les pannes simulées */
/* Posé par Page.addScriptToEvaluateOnNewDocument : il s'exécute AVANT theme.js,
   donc avant toute écriture du site.

   Il fait DEUX choses :
     1. il simule la panne demandée (refus, quota, ou rien) ;
     2. il RELÈVE L'APPELANT de chaque écriture. Toute écriture passant par le
        helper a `theme.js` en premier cadre de pile, puisque `SyntaxeStore` y
        est défini ; une écriture qui vient directement de lecon.js, main.js…
        est une écriture SANS FILET, et le scénario échoue même si un bandeau
        apparaît par ailleurs. Sans ce relevé, un geste qui déclenche plusieurs
        écritures masquerait celle qui est restée nue. */
var MOUCHARD = function (MODE, CLE_SURVEILLEE) {
  /* Les gestes d'effacement passent par window.confirm : en headless la boite
     modale fige la page et Runtime.evaluate expire. On repond « oui » d'office,
     ce qui est justement le chemin a tester. */
  window.confirm = function () { return true; };
  /* alert() fige aussi la page en headless ; on garde le dernier message pour
     pouvoir l'inspecter. */
  window.__alertes = [];
  window.alert = function (m) { window.__alertes.push(String(m)); };
  var vrai = Storage.prototype.setItem;
  var vraiRetrait = Storage.prototype.removeItem;
  var vraiLire = Storage.prototype.getItem;
  window.__directes = [];
  window.__lectures = [];
  /* Qui appelle ? Le premier cadre de pile qui vient d'un fichier .js. Une
     lecture ou une ecriture passee par le helper a theme.js en tete, puisque
     SyntaxeStore y est defini. */
  function appelant() {
    var pile = (new Error().stack || "").split(String.fromCharCode(10)).slice(1);
    for (var i = 0; i < pile.length; i++) {
      if (/\.js:\d+/.test(pile[i])) return pile[i].replace(/^\s*at\s*/, "").slice(-90);
    }
    return "";
  }
  /* Lecture SANS FILET d'une cle qu'on a volontairement abimee : le lecteur
     rendra {} sans rien dire, exactement le defaut que B2 ferme. Surveiller UNE
     cle precise evite les faux positifs (syntaxe-theme, syntaxe-lang… ne sont
     pas du JSON et sont lus directement, legitimement). */
  Storage.prototype.getItem = function (k) {
    if (CLE_SURVEILLEE && k === CLE_SURVEILLEE) {
      var qui = appelant();
      if (qui && qui.indexOf("theme.js") === -1) window.__lectures.push(qui);
    }
    return vraiLire.call(this, k);
  };
  /* L'effacement souffre du meme mal que l'ecriture : « Entree effacee » ne
     doit pas s'afficher quand rien n'a ete efface. */
  Storage.prototype.removeItem = function (k) {
    if (MODE === "sain") return vraiRetrait.call(this, k);
    var er = new Error("acces refuse");
    er.name = "SecurityError";
    throw er;
  };
  Storage.prototype.setItem = function (k, v) {
    var qui2 = appelant();
    if (qui2 && qui2.indexOf("theme.js") === -1) window.__directes.push(qui2);
    if (MODE === "sain") return vrai.call(this, k, v);
    var e;
    if (MODE === "quota") { e = new Error("quota"); e.name = "QuotaExceededError"; e.code = 22; }
    else { e = new Error("acces refuse"); e.name = "SecurityError"; }
    throw e;
  };
};

/* Cookies bloqués : l'ACCÈS à window.localStorage jette, pas seulement
   l'écriture. Un try posé autour du seul setItem ne suffirait pas. */
var BLOCAGE =
  "(function(){window.__directes=[];window.__lectures=[];window.__alertes=[];" +
  "window.confirm=function(){return true};window.alert=function(m){window.__alertes.push(String(m))};try{Object.defineProperty(window,'localStorage',{configurable:true," +
  "get:function(){var e=new Error('cookies bloques');e.name='SecurityError';throw e}})}catch(e){}})()";

function source(panne, cleSurveillee) {
  if (panne === "bloque") return BLOCAGE;
  return "(" + MOUCHARD.toString() + ")(" + JSON.stringify(panne || "sain") + ", " +
    JSON.stringify(cleSurveillee || null) + ")";
}

/* Le panneau de choix n'existe qu'après un import : verif-rendu.js, qui mesure
   des pages au repos, ne peut pas le voir. On mesure donc ici son contraste
   dans les DEUX thèmes, au seuil WCAG AA du petit texte (4,5:1). */
var CONTRASTE = function () {
  function lum(c) {
    var m = /rgba?\((\d+), ?(\d+), ?(\d+)/.exec(c);
    if (!m) return null;
    var v = [m[1], m[2], m[3]].map(function (x) {
      var n = parseInt(x, 10) / 255;
      return n <= 0.03928 ? n / 12.92 : Math.pow((n + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * v[0] + 0.7152 * v[1] + 0.0722 * v[2];
  }
  function fond(el) {
    var n = el;
    while (n && n.nodeType === 1) {
      var c = getComputedStyle(n).backgroundColor;
      if (c && !/rgba\(0, 0, 0, 0\)|transparent/.test(c)) return c;
      n = n.parentNode;
    }
    return "rgb(255, 255, 255)";
  }
  function ratio(el) {
    var a = lum(getComputedStyle(el).color), b = lum(fond(el));
    if (a === null || b === null) return null;
    var hi = Math.max(a, b), lo = Math.min(a, b);
    return Math.round(((hi + 0.05) / (lo + 0.05)) * 100) / 100;
  }
  var out = {};
  ["light", "dark"].forEach(function (t) {
    document.documentElement.setAttribute("data-theme", t);
    out[t] = [];
    [".import-choix__texte", ".import-choix__aide"].forEach(function (sel) {
      var el = document.querySelector(sel);
      if (el) out[t].push({ sel: sel, ratio: ratio(el) });
    });
  });
  return out;
};

var REFUS = /refuse le stockage local/;
var ABIME = /Sauvegarde illisible/;
var PLEIN = /stockage plein/;

var SCENARIOS = [
  {
    nom: "leçon : clic « Marquer comme terminée », écriture REFUSÉE",
    page: "pages/js/lecon-01.html", panne: "refus",
    geste: "var b=document.querySelector('[data-complete-toggle]');b&&b.click();",
    bandeau: REFUS,
  },
  {
    nom: "leçon : clic « Marquer comme terminée », QUOTA plein",
    page: "pages/js/lecon-01.html", panne: "quota",
    geste: "var b=document.querySelector('[data-complete-toggle]');b&&b.click();",
    bandeau: PLEIN,
  },
  {
    nom: "leçon : clic « Marquer comme terminée », localStorage INACCESSIBLE",
    page: "pages/js/lecon-01.html", panne: "bloque",
    geste: "var b=document.querySelector('[data-complete-toggle]');b&&b.click();",
    bandeau: REFUS,
  },
  {
    nom: "leçon : stockage SAIN — aucun bandeau, progression écrite (non-régression)",
    page: "pages/js/lecon-01.html", panne: null,
    geste: "var b=document.querySelector('[data-complete-toggle]');b&&b.click();",
    bandeau: null, ecrit: /lecon-01/,
  },
  {
    nom: "bac à sable : frappe dans l'éditeur, écriture REFUSÉE",
    page: "pages/playground.html", panne: "refus",
    geste: "var e=document.querySelector('textarea');" +
      "if(e){e.value+='<p>x</p>';e.dispatchEvent(new Event('input',{bubbles:true}))}",
    bandeau: REFUS,
  },
  {
    nom: "mes QCM : enregistrement d'une question, écriture REFUSÉE",
    page: "pages/mes-qcm.html", panne: "refus",
    geste: "if(window.SyntaxeStore)window.SyntaxeStore.setJSON('syntaxe-mes-qcm',[{q:'x'}]);",
    bandeau: REFUS,
  },
  {
    nom: "thème : bascule sombre/clair, écriture REFUSÉE",
    page: "index.html", panne: "refus",
    geste: "window.SyntaxeTheme.set('dark');",
    bandeau: REFUS,
  },
  {
    nom: "progression : objectif quotidien, écriture REFUSÉE",
    page: "pages/progression.html", panne: "refus",
    geste: "if(window.SyntaxeStore)window.SyntaxeStore.setJSON('syntaxe-goal',{daily:3});",
    bandeau: REFUS,
  },
  {
    nom: "leçon : progression ABÎMÉE — prévenue, mise de côté, puis réécrite",
    page: "pages/js/lecon-01.html", panne: null,
    semer: "try{localStorage.clear();localStorage.setItem('syntaxe-progress','{\"javascript\":{')}catch(e){}",
    geste: "var b=document.querySelector('[data-complete-toggle]');b&&b.click();",
    bandeau: ABIME, ecrit: /lecon-01/, cleAbimee: "syntaxe-progress",
    secours: { "syntaxe-secours-progress": "{\"javascript\":{" },
  },
  {
    nom: "progression : scores de QCM ABÎMÉS — prévenue et mise de côté",
    page: "pages/progression.html", panne: null,
    semer: "try{localStorage.clear();localStorage.setItem('syntaxe-quiz','pas du JSON')}catch(e){}",
    geste: "",
    bandeau: ABIME,
    secours: { "syntaxe-secours-quiz": "pas du JSON" }, cleAbimee: "syntaxe-quiz",
  },
  {
    nom: "leçon : données ABSENTES — ni bandeau ni copie de secours (non-régression)",
    page: "pages/js/lecon-01.html", panne: null,
    semer: "try{localStorage.clear()}catch(e){}",
    geste: "",
    bandeau: null, secours: {},
  },
  {
    nom: "import FUSION : union des leçons, meilleur score (5/5 bat 9/10)",
    page: "pages/progression.html", panne: null,
    semer: "try{localStorage.clear();localStorage.setItem('syntaxe-progress',\"{\\\"html\\\":{\\\"lecon-01.html\\\":true,\\\"lecon-02.html\\\":true}}\");localStorage.setItem('syntaxe-quiz',\"{\\\"html\\\":{\\\"lecon-01.html\\\":{\\\"q1\\\":{\\\"best\\\":9,\\\"total\\\":10}}}}\")}catch(e){}",
    geste: "",
    bandeau: null,
    importer: { input: "#dash-import-file", contenu: {"progress":{"html":{"lecon-03.html":true},"css":{"lecon-01.html":true}},"quiz":{"html":{"lecon-01.html":{"q1":{"best":5,"total":5}}}}}, choix: "fusion" },
    attendu: {
      "syntaxe-progress": { html: { "lecon-01.html": true, "lecon-02.html": true, "lecon-03.html": true },
                            css: { "lecon-01.html": true } },
      "syntaxe-quiz": { html: { "lecon-01.html": { q1: { best: 5, total: 5 } } } },
    },
  },
  {
    nom: "import REMPLACER : le fichier prend la place de l'existant",
    page: "pages/progression.html", panne: null,
    semer: "try{localStorage.clear();localStorage.setItem('syntaxe-progress',\"{\\\"html\\\":{\\\"lecon-01.html\\\":true,\\\"lecon-02.html\\\":true}}\");localStorage.setItem('syntaxe-quiz',\"{\\\"html\\\":{\\\"lecon-01.html\\\":{\\\"q1\\\":{\\\"best\\\":9,\\\"total\\\":10}}}}\")}catch(e){}",
    geste: "",
    bandeau: null,
    importer: { input: "#dash-import-file", contenu: {"progress":{"html":{"lecon-03.html":true},"css":{"lecon-01.html":true}},"quiz":{"html":{"lecon-01.html":{"q1":{"best":5,"total":5}}}}}, choix: "remplacer" },
    attendu: {
      "syntaxe-progress": { html: { "lecon-03.html": true }, css: { "lecon-01.html": true } },
      "syntaxe-quiz": { html: { "lecon-01.html": { q1: { best: 5, total: 5 } } } },
    },
  },
  {
    nom: "import ANNULER : rien ne bouge",
    page: "pages/progression.html", panne: null,
    semer: "try{localStorage.clear();localStorage.setItem('syntaxe-progress',\"{\\\"html\\\":{\\\"lecon-01.html\\\":true,\\\"lecon-02.html\\\":true}}\");localStorage.setItem('syntaxe-quiz',\"{\\\"html\\\":{\\\"lecon-01.html\\\":{\\\"q1\\\":{\\\"best\\\":9,\\\"total\\\":10}}}}\")}catch(e){}",
    geste: "",
    bandeau: null,
    importer: { input: "#dash-import-file", contenu: {"progress":{"html":{"lecon-03.html":true},"css":{"lecon-01.html":true}},"quiz":{"html":{"lecon-01.html":{"q1":{"best":5,"total":5}}}}}, choix: "annuler" },
    attendu: {
      "syntaxe-progress": { html: { "lecon-01.html": true, "lecon-02.html": true } },
      "syntaxe-quiz": { html: { "lecon-01.html": { q1: { best: 9, total: 10 } } } },
    },
  },
  {
    nom: "mes données : import FUSION d'un export global (table clé → texte)",
    page: "pages/donnees-perso.html", panne: null,
    semer: "try{localStorage.clear();localStorage.setItem('syntaxe-progress',\"{\\\"html\\\":{\\\"lecon-01.html\\\":true,\\\"lecon-02.html\\\":true}}\")}catch(e){}",
    geste: "",
    bandeau: null,
    importer: { input: "#dp-import", contenu: {"syntaxe-progress": "{\"css\":{\"lecon-01.html\":true}}", "syntaxe-notes": "{\"css\":{\"lecon-01.html\":{\"note\":\"venue du portable\"}}}"}, choix: "fusion" },
    attendu: {"syntaxe-progress": {"html": {"lecon-01.html": true, "lecon-02.html": true}, "css": {"lecon-01.html": true}}, "syntaxe-notes": {"css": {"lecon-01.html": {"note": "venue du portable"}}}},
  },
  {
    nom: "examen : passages empilés, score fidèle, correction qui renvoie à la leçon",
    page: "pages/examen.html", panne: null,
    semer: "try{localStorage.clear()}catch(e){}",
    geste: "function passer(n){var s=document.getElementById('exam-n');if(s)s.value=String(n);var b=document.getElementById('exam-start');if(b)b.click();for(var i=0;i<n;i++){var o=document.querySelectorAll('.exam-opt');if(o.length)o[i%o.length].click();var v=document.getElementById('exam-next');if(v)v.click()}var f=document.getElementById('exam-finish');if(f)f.click()}passer(10);var a=document.getElementById('exam-again');if(a)a.click();passer(10);",
    bandeau: null,
    examen: { passages: 2, total: 10, liens: true },
  },
  {
    nom: "progression : « À retravailler » liste les QCM sous 70 %, du pire au moins pire",
    page: "pages/progression.html", panne: null,
    semer: "try{localStorage.clear();localStorage.setItem('syntaxe-quiz',\"{\\\"html\\\": {\\\"lecon-01.html\\\": {\\\"quiz\\\": {\\\"best\\\": 1, \\\"total\\\": 4, \\\"rates\\\": [0, 2, 3]}}, \\\"lecon-02.html\\\": {\\\"quiz\\\": {\\\"best\\\": 2, \\\"total\\\": 4}}}, \\\"css\\\": {\\\"lecon-03.html\\\": {\\\"quiz\\\": {\\\"best\\\": 3, \\\"total\\\": 10}}, \\\"lecon-40.html\\\": {\\\"bilan\\\": {\\\"best\\\": 9, \\\"total\\\": 10}}}}\")}catch(e){}",
    geste: "",
    bandeau: null,
    retravail: { nb: 3, premier: "1 / 4 · 25%", pire: 0.25, mention: /3 questions à revoir/ },
  },
  {
    nom: "progression : que des scores acquis — la section le dit, sans rien lister",
    page: "pages/progression.html", panne: null,
    semer: "try{localStorage.clear();localStorage.setItem('syntaxe-quiz',\"{\\\"html\\\": {\\\"lecon-01.html\\\": {\\\"quiz\\\": {\\\"best\\\": 4, \\\"total\\\": 4}}}}\")}catch(e){}",
    geste: "",
    bandeau: null,
    retravail: { nb: 0, vide: /Aucun QCM en dessous/ },
  },
  {
    nom: "progression : aucun QCM passé — pas de section du tout (non-régression)",
    page: "pages/progression.html", panne: null,
    semer: "try{localStorage.clear()}catch(e){}",
    geste: "",
    bandeau: null,
    retravail: { nb: 0, vide: null },
  },
  {
    nom: "leçon : un QCM raté note QUELLES questions (rates), pas seulement combien",
    page: "pages/js/lecon-01.html", panne: null,
    semer: "try{localStorage.clear()}catch(e){}",
    geste: "var qs=document.querySelectorAll('.quiz .quiz__q');for(var i=0;i<qs.length;i++){var rater=(i===0||i===2);var b=qs[i].querySelector(rater?'.quiz__opt[data-correct=\"0\"]':'.quiz__opt[data-correct=\"1\"]');if(b)b.click()}",
    bandeau: null,
    rates: { cours: "javascript", fichier: "lecon-01.html", attendus: [0, 2] },
  },
  {
    nom: "mes données : clic « Effacer », suppression REFUSÉE — pas de faux succès",
    page: "pages/donnees-perso.html", panne: "refus",
    semer: "try{localStorage.setItem('syntaxe-progress','{\"html\":{\"lecon-01.html\":true}}')}catch(e){}",
    geste: "var b=document.querySelector('.dp-del');b&&b.click();",
    bandeau: null, message: /[Ee]ffacement impossible/, messageOk: false,
  },
  {
    nom: "cours : « Réinitialiser ma progression » refusée — bandeau lu, pas de rechargement",
    page: "pages/html/cours.html", panne: "refus",
    semer: "try{localStorage.setItem('syntaxe-progress','{\"html\":{\"lecon-01.html\":true}}')}catch(e){}",
    geste: "var b=document.querySelector('.course-reset');b&&b.click();",
    bandeau: REFUS, resteLa: true,
  },
];

/* Sonde exécutée dans la page après le geste. */
var SONDE = function () {
  var t = document.querySelectorAll(".toast--err");
  var textes = [];
  for (var i = 0; i < t.length; i++) textes.push(t[i].textContent);
  var prog = "";
  try { prog = localStorage.getItem("syntaxe-progress") || ""; } catch (e) { prog = "?"; }
  return {
    directes: (window.__directes || []).slice(0, 6),
    nbDirectes: (window.__directes || []).length,
    lectures: (window.__lectures || []).slice(0, 6),
    nbLectures: (window.__lectures || []).length,
    bandeaux: t.length,
    textes: textes,
    echecs: (window.SyntaxeStore || {}).echecs,
    helper: typeof (window.SyntaxeStore || {}).set === "function",
    progression: prog,
    message: (document.querySelector(".dp-msg") || {}).textContent || "",
    messageOk: !!document.querySelector(".dp-msg.is-ok"),
    boutonReset: !!document.querySelector(".course-reset"),
    alertes: (window.__alertes || []).slice(0, 3),
    cles: (function () {
      var out = {};
      try {
        ["syntaxe-progress", "syntaxe-quiz", "syntaxe-notes", "syntaxe-examen"].forEach(function (k) {
          out[k] = localStorage.getItem(k);
        });
      } catch (e) {}
      return out;
    })(),
    retravailler: (function () {
      var items = document.querySelectorAll(".dash-retravail__item");
      if (!items.length) {
        var vide = document.querySelector("#dash-retravailler .dash-empty");
        return { nb: 0, vide: vide ? vide.textContent.trim().slice(0, 60) : null, ordre: [], contraste: null };
      }
      var ordre = [];
      for (var i = 0; i < items.length; i++) {
        ordre.push({
          titre: (items[i].querySelector(".dash-retravail__titre") || {}).textContent || "",
          score: (items[i].querySelector(".dash-retravail__score") || {}).textContent || "",
          cours: (items[i].querySelector(".dash-retravail__cours") || {}).textContent || "",
          href: (items[i].querySelector("a") || {}).getAttribute("href"),
        });
      }
      /* Le score est en rouge : il doit rester lisible dans les deux themes. */
      function lum(c) {
        var q = /rgba?\((\d+), ?(\d+), ?(\d+)/.exec(c);
        if (!q) return null;
        var v = [q[1], q[2], q[3]].map(function (x) {
          var n = parseInt(x, 10) / 255;
          return n <= 0.03928 ? n / 12.92 : Math.pow((n + 0.055) / 1.055, 2.4);
        });
        return 0.2126 * v[0] + 0.7152 * v[1] + 0.0722 * v[2];
      }
      function fond(el) {
        var n = el;
        while (n && n.nodeType === 1) {
          var c = getComputedStyle(n).backgroundColor;
          if (c && !/rgba\(0, 0, 0, 0\)|transparent/.test(c)) return c;
          n = n.parentNode;
        }
        return "rgb(255, 255, 255)";
      }
      var res = {};
      ["light", "dark"].forEach(function (th) {
        document.documentElement.setAttribute("data-theme", th);
        var el = items[0].querySelector(".dash-retravail__score");
        var a1 = lum(getComputedStyle(el).color), b1 = lum(fond(el));
        res[th] = (a1 === null || b1 === null) ? null :
          Math.round(((Math.max(a1, b1) + 0.05) / (Math.min(a1, b1) + 0.05)) * 100) / 100;
      });
      return { nb: items.length, vide: null, ordre: ordre, contraste: res };
    })(),
    scoreAffiche: (document.querySelector(".exam-score__n") || {}).textContent || "",
    liensLecon: (function () {
      var a = document.querySelectorAll(".exam-rev__lien a");
      var faux = 0, ex = "";
      for (var i = 0; i < a.length; i++) {
        var h = a[i].getAttribute("href") || "";
        if (!/^[a-z0-9-]+\/lecon-\d+\.html$/.test(h)) faux++;
        if (!ex) ex = h;
      }
      /* L'URL RESOLUE par le navigateur : Node ira verifier que le fichier
         existe vraiment, ce qu'un test du seul attribut href ne prouve pas. */
      return { nb: a.length, malformes: faux, exemple: ex,
               absolu: a.length ? a[0].href : "" };
    })(),
    historiqueExamen: (function () {
      /* Il peut y avoir DEUX blocs dans le DOM (celui des réglages, masqué, et
         celui du résultat) : on ne juge que sur le bloc VISIBLE — offsetParent,
         jamais display, qui ment quand c'est un parent qui masque. */
      var tous = document.querySelectorAll(".exam-hist");
      var h = null;
      for (var i = 0; i < tous.length; i++) if (tous[i].offsetParent !== null) h = tous[i];
      if (!h) return null;
      return { resume: (h.querySelector(".exam-hist__resume") || {}).textContent || "",
               lignes: h.querySelectorAll(".exam-hist__item").length };
    })(),
    panneau: (function () {
      var b = document.querySelector(".import-choix");
      if (!b) return null;
      var btns = b.querySelectorAll("button");
      var noms = [];
      for (var i = 0; i < btns.length; i++) noms.push(btns[i].textContent);
      return { texte: (b.querySelector(".import-choix__texte") || {}).textContent || "", boutons: noms };
    })(),
    secours: (function () {
      var out = {};
      try {
        for (var i = 0; i < localStorage.length; i++) {
          var k = localStorage.key(i);
          if (k && k.indexOf("syntaxe-secours-") === 0) out[k] = localStorage.getItem(k);
        }
      } catch (e) {}
      return out;
    })(),
  };
};

(async function () {
  var chrome = trouverChrome();
  if (!chrome) {
    console.error("ERREUR : Chrome introuvable. Renseigne CHROME_PATH.");
    process.exit(2);
  }
  if (typeof WebSocket === "undefined") {
    console.error("ERREUR : ce script demande Node >= 22 (WebSocket natif). Version : " + process.version);
    process.exit(2);
  }

  var profil = path.join(os.tmpdir(), "verif-stockage-" + process.pid);
  var port = 9700 + (process.pid % 200);
  var proc = cp.spawn(chrome, [
    "--headless=new",
    "--disable-gpu",
    "--no-first-run",
    "--no-default-browser-check",
    "--allow-file-access-from-files",
    "--host-resolver-rules=MAP * ~NOTFOUND",
    "--remote-debugging-port=" + port,
    "--user-data-dir=" + profil,
    "about:blank",
  ], { stdio: "ignore" });

  var cible = null;
  for (var essai = 0; essai < 40 && !cible; essai++) {
    await attendre(250);
    try {
      var r = await fetch("http://127.0.0.1:" + port + "/json/version");
      if (r.ok) cible = (await r.json()).webSocketDebuggerUrl;
    } catch (e) {}
  }
  if (!cible) {
    proc.kill();
    console.error("ERREUR : Chrome n'a pas répondu sur le port " + port + ".");
    process.exit(2);
  }

  console.log("verif-stockage.js — " + SCENARIOS.length + " scénario(s), Chrome headless, réseau coupé\n");

  var nav = new Client(cible);
  await nav.pret;
  var ko = 0;

  for (var i = 0; i < SCENARIOS.length; i++) {
    var sc = SCENARIOS[i];
    var abs = path.join(ROOT, sc.page);
    if (!fs.existsSync(abs)) {
      console.log("  KO   " + sc.nom + "\n         page introuvable : " + sc.page);
      ko++;
      continue;
    }
    var url = "file:///" + abs.split(path.sep).join("/");

    var cid = (await nav.envoyer("Target.createTarget", { url: "about:blank" })).targetId;
    var sess = (await nav.envoyer("Target.attachToTarget", { targetId: cid, flatten: true })).sessionId;
    await nav.envoyer("Runtime.enable", {}, sess);
    await nav.envoyer("Page.enable", {}, sess);
    if (sc.semer) {
      /* Certains elements n'existent pas sans progression (le bouton
         « Reinitialiser ma progression » d'un cours). Seme AVANT le mouchard,
         sinon l'ecriture du semis echouerait elle aussi. */
      await nav.envoyer("Page.addScriptToEvaluateOnNewDocument", { source: sc.semer }, sess);
    }
    await nav.envoyer("Page.addScriptToEvaluateOnNewDocument",
      { source: source(sc.panne, sc.cleAbimee) }, sess);
    await nav.envoyer("Page.navigate", { url: url }, sess);
    await attendre(1100);
    if (sc.geste) {
      await nav.envoyer("Runtime.evaluate", { expression: "(function(){" + sc.geste + "})()" }, sess);
    }

    /* Import de bout en bout : on pose un vrai fichier dans le vrai <input
       type=file> (c'est la seule route entre deux machines), on attend le
       panneau de choix, puis on clique le bouton demande. */
    var panneauVu = null;
    var contrasteVu = null;
    if (sc.importer) {
      var chemin = path.join(os.tmpdir(), "verif-stockage-import-" + process.pid + ".json");
      fs.writeFileSync(chemin, JSON.stringify(sc.importer.contenu), "utf8");
      await nav.envoyer("DOM.enable", {}, sess);
      var obj = await nav.envoyer("Runtime.evaluate",
        { expression: "document.querySelector(" + JSON.stringify(sc.importer.input) + ")" }, sess);
      var oid = (obj.result || {}).objectId;
      if (!oid) {
        console.log("  KO   " + sc.nom + "\n         input introuvable : " + sc.importer.input);
        ko++;
        await nav.envoyer("Target.closeTarget", { targetId: cid });
        continue;
      }
      await nav.envoyer("DOM.setFileInputFiles", { files: [chemin], objectId: oid }, sess);
      await attendre(600);
      var vuePanneau = await nav.envoyer("Runtime.evaluate",
        { expression: "(function(){var b=document.querySelector('.import-choix');if(!b)return null;" +
          "var t=b.querySelectorAll('button');var n=[];for(var i=0;i<t.length;i++)n.push(t[i].textContent);" +
          "return {texte:(b.querySelector('.import-choix__texte')||{}).textContent||'',boutons:n}})()",
          returnByValue: true }, sess);
      panneauVu = (vuePanneau.result || {}).value || null;
      var mes = await nav.envoyer("Runtime.evaluate",
        { expression: "(" + CONTRASTE.toString() + ")()", returnByValue: true }, sess);
      contrasteVu = (mes.result || {}).value || null;
      var libelle = { fusion: "Fusionner", remplacer: "Remplacer", annuler: "Annuler" }[sc.importer.choix];
      await nav.envoyer("Runtime.evaluate",
        { expression: "(function(){var b=document.querySelectorAll('.import-choix button');" +
          "for(var i=0;i<b.length;i++){if(b[i].textContent===" + JSON.stringify(libelle) + "){b[i].click();return}}})()" }, sess);
      await attendre(500);
      try { fs.unlinkSync(chemin); } catch (e) {}
    }
    await attendre(500);

    var out = await nav.envoyer(
      "Runtime.evaluate",
      { expression: "(" + SONDE.toString() + ")()", returnByValue: true },
      sess
    );
    var v = (out.result || {}).value || {};

    var motifs = (v.textes || []).join(" ");
    var okHelper = v.helper === true;
    var okBandeau = sc.bandeau ? (v.bandeaux > 0 && sc.bandeau.test(motifs))
                               : v.bandeaux === 0;
    var okEcrit = sc.ecrit ? sc.ecrit.test(v.progression || "") : true;
    /* Le mode « bloque » ne peut pas relever les appelants : localStorage y est
       inaccessible, aucun setItem n'est jamais atteint. */
    var okDirectes = sc.panne === "bloque" ? true : v.nbDirectes === 0;
    /* « Entrée effacée » en vert alors que rien ne l'a été : le faux succès. */
    var okMessage = sc.message ? (sc.message.test(v.message || "") && v.messageOk === sc.messageOk) : true;
    /* Le bouton doit encore être là : la page n'a PAS rechargé, donc le bandeau
       a eu le temps d'être lu et la progression est intacte. */
    var okResteLa = sc.resteLa ? v.boutonReset === true : true;
    /* Une donnée illisible doit être mise de côté À L'IDENTIQUE, et une donnée
       simplement absente ne doit RIEN produire. */
    var okSecours = true;
    if (sc.secours) {
      var att = Object.keys(sc.secours).sort();
      var eus = Object.keys(v.secours || {}).sort();
      okSecours = att.join("|") === eus.join("|");
      att.forEach(function (k) {
        if (sc.secours[k] !== (v.secours || {})[k]) okSecours = false;
      });
    }
    /* Une cle abimee ne doit etre lue QUE par le helper : un lecteur reste nu
       rendrait {} en silence, et la premiere ecriture ecraserait la donnee. */
    var okLectures = sc.cleAbimee ? v.nbLectures === 0 : true;
    /* Le panneau doit proposer les TROIS reponses, et annoncer les deux
       inventaires : un choix sans chiffres n'est pas un choix. */
    var okPanneau = true;
    if (sc.importer) {
      okPanneau = !!panneauVu &&
        panneauVu.boutons.join("|") === "Fusionner|Remplacer|Annuler" &&
        /Fichier : .*le\u00e7on/.test(panneauVu.texte) &&
        /appareil : .*le\u00e7on/.test(panneauVu.texte);
      /* Le panneau doit rester lisible dans les deux thèmes. */
      if (contrasteVu) {
        ["light", "dark"].forEach(function (t) {
          (contrasteVu[t] || []).forEach(function (m) {
            if (!(m.ratio >= 4.5)) {
              okPanneau = false;
              v.__ecart = "contraste " + m.sel + " en " + t + " = " + m.ratio + ":1 (seuil 4,5)";
            }
          });
        });
      }
    }
    /* Et le resultat doit etre EXACTEMENT celui attendu : la fusion se juge sur
       la valeur finale, pas sur un message rassurant. */
    var okAttendu = true;
    if (sc.attendu) {
      Object.keys(sc.attendu).forEach(function (k) {
        var eu = (v.cles || {})[k];
        var att = JSON.stringify(sc.attendu[k]);
        var euNorm = eu;
        try { euNorm = JSON.stringify(JSON.parse(eu)); } catch (e) {}
        if (euNorm !== att) { okAttendu = false; v.__ecart = k + " : attendu " + att + ", obtenu " + eu; }
      });
    }
    /* L'examen doit laisser une trace ET la montrer : une donnee enregistree
       mais invisible ne sert a personne. */
    var okExamen = true;
    if (sc.examen && sc.examen.liens) {
      /* Chaque question de la correction doit renvoyer vers SA lecon. */
      okExamen = v.liensLecon && v.liensLecon.nb === sc.examen.total && v.liensLecon.malformes === 0;
      /* Le lien doit mener a un fichier qui EXISTE : on resout l'URL et on
         regarde le disque. */
      if (okExamen) {
        var cible = decodeURIComponent(String(v.liensLecon.absolu || "").replace(/^file:\/\/\//, ""));
        if (!cible || !fs.existsSync(cible)) {
          okExamen = false;
          v.__ecart = "le lien ne mene nulle part : " + cible;
        } else {
          v.__cible = cible.slice(-40);
        }
      }
      if (!okExamen) v.__ecart = v.__ecart || ("liens « Revoir la lecon » : " + JSON.stringify(v.liensLecon));
    }
    if (sc.examen && okExamen) {
      var hist = [];
      try { hist = JSON.parse((v.cles || {})["syntaxe-examen"] || "[]"); } catch (e) { hist = null; }
      var dernier = hist && hist.length ? hist[hist.length - 1] : null;
      okExamen = !!hist && hist.length === sc.examen.passages &&
        !!dernier && dernier.total === sc.examen.total &&
        typeof dernier.score === "number" &&
        /^\d{4}-\d{2}-\d{2}$/.test(dernier.date || "") &&
        /* le chiffre gardé est bien CELUI que l'apprenant a vu */
        (v.scoreAffiche || "").replace(/\s/g, "") === dernier.score + "/" + dernier.total &&
        !!v.historiqueExamen && v.historiqueExamen.lignes === sc.examen.passages;
      if (!okExamen) v.__ecart = "historique d'examen : " + JSON.stringify(hist) +
        " · bloc affiché : " + JSON.stringify(v.historiqueExamen);
    }
    var okRetravail = true;
    if (sc.retravail) {
      var r = v.retravailler || {};
      okRetravail = r.nb === sc.retravail.nb;
      if (okRetravail && sc.retravail.premier) {
        okRetravail = (r.ordre[0] || {}).score.replace(/\s/g, " ").trim() === sc.retravail.premier;
      }
      if (okRetravail && sc.retravail.vide) okRetravail = sc.retravail.vide.test(r.vide || "");
      /* Dire QUELLE notion, pas seulement quelle leçon : le nombre de questions
         manquées doit apparaître sous le titre (réserve du point C3). */
      if (okRetravail && sc.retravail.mention) {
        okRetravail = sc.retravail.mention.test((r.ordre[0] || {}).cours || "");
      }
      if (okRetravail && sc.retravail.vide === null && sc.retravail.nb === 0) okRetravail = r.vide === null;
      /* le score en rouge doit rester lisible dans les deux themes */
      if (okRetravail && r.contraste) {
        ["light", "dark"].forEach(function (t) {
          if (!(r.contraste[t] >= 4.5)) {
            okRetravail = false;
            v.__ecart = "contraste du score en " + t + " = " + r.contraste[t] + ":1";
          }
        });
      }
      if (!okRetravail) v.__ecart = v.__ecart || ("« À retravailler » : " + JSON.stringify(r).slice(0, 220));
    }
    /* Les index manques doivent etre ceux qu'on a volontairement rates. */
    var okRates = true;
    if (sc.rates) {
      var q = null;
      try { q = JSON.parse((v.cles || {})["syntaxe-quiz"] || "null"); } catch (e) { q = null; }
      var e2 = q && q[sc.rates.cours] && q[sc.rates.cours][sc.rates.fichier]
        ? q[sc.rates.cours][sc.rates.fichier].quiz : null;
      okRates = !!e2 && JSON.stringify(e2.rates || []) === JSON.stringify(sc.rates.attendus) &&
        e2.total - e2.best === sc.rates.attendus.length;
      if (!okRates) v.__ecart = "rates : " + JSON.stringify(e2);
      else v.__rates = JSON.stringify(e2);
    }
    var bon = okHelper && okBandeau && okEcrit && okDirectes && okMessage &&
      okResteLa && okSecours && okLectures && okPanneau && okAttendu && okExamen &&
      okRetravail && okRates;
    if (!bon) ko++;

    console.log((bon ? "  OK   " : "  KO   ") + sc.nom);
    if (DETAIL || !bon) {
      console.log("         helper=" + v.helper + " bandeaux=" + v.bandeaux + " échecs=" + v.echecs +
        " écritures sans filet=" + v.nbDirectes +
        (sc.cleAbimee ? " lectures sans filet=" + v.nbLectures : ""));
      (v.directes || []).forEach(function (d) { console.log("         ECRITURE SANS FILET : " + d); });
      (v.lectures || []).forEach(function (d) { console.log("         LECTURE SANS FILET : " + d); });
      if (v.textes && v.textes.length) console.log("         message : " + v.textes[0]);
      if (sc.ecrit) console.log("         écrit : " + String(v.progression).slice(0, 70));
      if (sc.message) console.log("         message de la page : « " + v.message + " » (vert=" + v.messageOk + ")");
      if (sc.resteLa) console.log("         bouton encore présent (pas de rechargement) : " + v.boutonReset);
      if (sc.importer) {
        console.log("         panneau : " + (panneauVu ? panneauVu.boutons.join(" / ") : "ABSENT"));
        if (panneauVu) console.log("         « " + panneauVu.texte + " »");
        if (contrasteVu) {
          console.log("         contraste : " + ["light", "dark"].map(function (t) {
            return t + " " + (contrasteVu[t] || []).map(function (m) { return m.ratio + ":1"; }).join("/");
          }).join(" · "));
        }
        if (v.alertes && v.alertes.length) console.log("         message : " + v.alertes[0]);
      }
      if (sc.examen && v.historiqueExamen) {
        console.log("         enregistré : " + (v.cles || {})["syntaxe-examen"]);
        console.log("         liens vers la leçon : " + v.liensLecon.nb + " (0 malformé : " +
          (v.liensLecon.malformes === 0) + ") ex. " + v.liensLecon.exemple +
          (v.__cible ? "  → fichier trouvé : …" + v.__cible : ""));
        console.log("         affiché : « " + v.historiqueExamen.resume + " » (" +
          v.historiqueExamen.lignes + " ligne(s)) · score à l'écran : " + v.scoreAffiche);
      }
      if (sc.retravail) {
        var rr = v.retravailler || {};
        console.log("         à retravailler : " + rr.nb + " entrée(s)" +
          (rr.vide ? " · message « " + rr.vide + " »" : "") +
          (rr.contraste ? " · contraste clair " + rr.contraste.light + ":1 / sombre " + rr.contraste.dark + ":1" : ""));
        (rr.ordre || []).forEach(function (x) {
          console.log("            " + x.score + "  " + x.titre + "  [" + x.cours + "]  → " + x.href);
        });
      }
      if (v.__rates) console.log("         score enregistré : " + v.__rates);
      if (v.__ecart) console.log("         ECART : " + v.__ecart);
      if (sc.secours) {
        var ks = Object.keys(v.secours || {});
        console.log("         copies de secours : " + (ks.length ? ks.join(", ") : "aucune") +
          (ks.length ? "  →  " + JSON.stringify(v.secours[ks[0]]).slice(0, 50) : ""));
      }
    }
    await nav.envoyer("Target.closeTarget", { targetId: cid });
  }

  proc.kill();
  console.log("\n=== RÉSULTAT ===");
  console.log("  scénarios ........ " + SCENARIOS.length);
  console.log("  conformes ........ " + (SCENARIOS.length - ko));
  console.log("  NON conformes .... " + ko);
  console.log(ko ? "\nUn accès au stockage échoue sans prévenir l'apprenant, ou contourne le helper." :
                   "\nTout accès au stockage passe par le helper : rien n'échoue en silence.");
  process.exit(ko ? 1 : 0);
})();
