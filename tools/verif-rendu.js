/* =============================================================================
   verif-rendu.js — controle ce que le NAVIGATEUR AFFICHE reellement.
   Node pur, ZERO dependance (WebSocket natif de Node >= 22).

   POURQUOI ce fichier : les deux verificateurs existants ne lisent que du
   statique. verif-html.js analyse le source, verif-donnees.js analyse les
   donnees. Aucun des deux ne peut voir qu'une regle CSS rend illisible le code
   de 181 lecons, qu'une page deborde sur mobile, ou qu'un anneau de focus est
   rogne. Ces defauts-la n'ont ete trouves qu'en payant des audits.

   Ce que cet outil mesure, page par page, dans un vrai moteur de rendu :
     1. DEBORDEMENT horizontal, a plusieurs largeurs (le site doit tenir a 320 px)
     2. CONTRASTE du texte sur son fond effectif (WCAG AA : 4.5:1, 3:1 si >= 24px)
     3. FOCUS clavier visible sur chaque element focusable
     4. ARIA : noms accessibles, roles coherents, aria-* qui pointent dans le vide
     5. ERREURS de console et EXCEPTIONS JavaScript
     6. REQUETES RESEAU : il doit y en avoir ZERO (le site est 100 % hors ligne)

   PIEGES CONNUS, deja integres :
     - on seme une PROGRESSION dans localStorage avant de mesurer : plusieurs
       elements (pastille XP...) n'existent pas sans elle, et un test sur un
       stockage vide ment ;
     - la visibilite se juge par offsetParent + [hidden] chez les ancetres, JAMAIS
       par getComputedStyle(el).display, qui ment quand c'est un PARENT qui masque ;
     - le fond effectif d'un texte se resout en REMONTANT les ancetres tant que le
       fond est transparent ;
     - le reseau est coupe (--host-resolver-rules) : une page qui charge encore
       une ressource distante est detectee, pas silencieusement servie par le cache.

   USAGE
     node tools/verif-rendu.js                  # DEFAUT ELARGI : premier niveau + tous
                                                #   les cours.html + une lecon/cours (~229)
     node tools/verif-rendu.js --echantillon    # ~20 pages representatives (rapide)
     node tools/verif-rendu.js --lister         # liste les pages sans lancer Chrome
     node tools/verif-rendu.js --cours          # tous les cours.html
     node tools/verif-rendu.js --tout           # toutes les pages de premier niveau
     node tools/verif-rendu.js --pages=a,b      # pages precises (chemins relatifs)
     node tools/verif-rendu.js --attente=2500    # delai avant mesure (page qui charge a la demande)
     node tools/verif-rendu.js --largeurs=320,1280
     node tools/verif-rendu.js --themes=light,dark
     node tools/verif-rendu.js --strict         # sort en code 1 des le premier AVERTISSEMENT
   ============================================================================= */
"use strict";

var fs = require("fs");
var path = require("path");
var os = require("os");
var cp = require("child_process");

/* ------------------------------------------------------------------ options */
var args = process.argv.slice(2);
function flag(n) { return args.indexOf("--" + n) !== -1; }
function opt(n, d) {
  for (var i = 0; i < args.length; i++) {
    if (args[i].indexOf("--" + n + "=") === 0) return args[i].slice(n.length + 3);
  }
  return d;
}
var ROOT = path.resolve(opt("root", path.join(__dirname, "..")));
/* Delai avant la sonde. 700 ms suffisent aux pages qui se rendent au chargement ;
   celles qui INJECTENT un index a la demande (livret de revision : 5,3 Mo de
   donnees) ont besoin de plus, sinon on mesure une page encore vide et le vert
   ne prouve rien. */
var ATTENTE = Math.max(200, parseInt(opt("attente", "700"), 10) || 700);
var STRICT = flag("strict");
var TOUT = flag("tout");
var LARGEURS = opt("largeurs", "320,375,1280").split(",").map(Number).filter(Boolean);
var THEMES = opt("themes", "light,dark").split(",").map(function (s) { return s.trim(); });
var SEUIL_CONTRASTE = 4.5;
var SEUIL_GROS = 3.0; /* >= 24px, ou >= 18.66px en gras */

/* ------------------------------------------------------- choix des pages ---- */
/* Echantillon representatif : une page de chaque FORME du site. Inutile d'en
   mesurer 1400 — les lecons partagent toutes le meme gabarit. On prend en
   revanche des lecons de cours differents, car leur CONTENU varie (tableaux
   larges, blocs de code, schemas SVG). */
var ECHANTILLON = [
  "index.html",
  "pages/catalogue.html",
  "pages/recherche.html",
  "pages/progression.html",
  "pages/parcours.html",
  "pages/projets.html",
  "pages/fils-rouges.html",
  "pages/antiseches.html",
  "pages/glossaire.html",
  "pages/examen.html",
  "pages/revision.html",
  "pages/outils.html",
  "pages/a-propos.html",
  "pages/certificat.html",
  "pages/html/cours.html",
  "pages/html/lecon-01.html",
  "pages/sql/lecon-05.html",   /* tableaux larges */
  "pages/c/lecon-01.html",     /* longues lignes de code */
  "pages/js/lecon-12.html",    /* QCM dense */
  "pages/reseaux/lecon-11.html",
];

/* Toutes les pages transverses de premier niveau (accueil + pages/*.html). */
function premierNiveau() {
  var out = ["index.html"];
  try {
    fs.readdirSync(path.join(ROOT, "pages")).forEach(function (f) {
      if (f.endsWith(".html")) out.push("pages/" + f);
    });
  } catch (e) { console.error("(pages/ illisible : " + e.message + ")"); }
  /* Certaines pages ne montrent rien sans parametre : mesurees nues, elles
     affichent un ecran « introuvable » et le vert ne prouve RIEN. On les
     remesure donc dans leur etat utile. Le livret d'un GROS cours est le pire
     cas : 66 antiseches, 456 termes, 117 pieges. */
  out.push("pages/imprimer.html?cours=js");
  return out;
}

/* Charge SITE_DATA une seule fois (partage entre tousCoursHtml et unePageParCours). */
function chargerData() {
  try {
    var code = fs.readFileSync(path.join(ROOT, "js/data.js"), "utf8");
    var faux = { window: {} };
    new Function("window", code)(faux.window);
    return faux.window.SITE_DATA;
  } catch (e) { console.error("(data.js illisible : " + e.message + ")"); return null; }
}

/* Les 83 cours.html (la sommaire d'un cours) : c'est la page la PLUS visitee apres
   l'accueil, et 82 des 83 n'etaient JAMAIS mesurees (seul html/cours.html l'etait).
   Leur mise en page (grille de modules, badges de niveau, progression) est generee
   par cours.js et peut deborder ou manquer de contraste comme n'importe quelle page. */
function tousCoursHtml() {
  var out = [];
  var d = chargerData();
  if (!d) return out;
  Object.keys(d.content).forEach(function (id) {
    var rel = "pages/" + (d.content[id].dir || id) + "/cours.html";
    if (fs.existsSync(path.join(ROOT, rel))) out.push(rel);
  });
  return out;
}

/* Une lecon par cours : les 1463 lecons partagent le gabarit, mais leur CONTENU
   varie (tableaux larges, blocs de code interminables, schemas SVG, QCM denses).
   On prend la lecon du MILIEU du cours : la premiere est souvent une introduction
   courte, peu representative. */
function unePageParCours() {
  var out = [];
  var d = chargerData();
  if (!d) return out;
  Object.keys(d.content).forEach(function (id) {
    var c = d.content[id];
    var fichiers = [];
    (c.modules || []).forEach(function (m) {
      (m.lessons || []).forEach(function (l) { if (l && l.file) fichiers.push(l.file); });
    });
    if (fichiers.length) out.push("pages/" + (c.dir || id) + "/" + fichiers[Math.floor(fichiers.length / 2)]);
  });
  return out;
}

function dedup(arr) {
  var vu = {};
  return arr.filter(function (x) { return x && !vu[x] && (vu[x] = true); });
}

/* Selection des pages a mesurer.
     --pages=a,b       : liste explicite
     --echantillon     : les ~20 pages representatives (rapide)
     --tout            : toutes les pages de premier niveau
     --cours           : tous les cours.html
     --lecons          : une lecon par cours
   DEFAUT (aucun de ces drapeaux) = ELARGI (A8) : premier niveau + TOUS les
   cours.html + une lecon par cours. verif-rendu ne voyait que 20 pages sur 1702
   et ratait 82 des 83 cours.html ; le defaut couvre desormais toutes les FORMES. */
function pagesAMesurer() {
  var p = opt("pages", "");
  if (p) return dedup(p.split(",").map(function (s) { return s.trim(); }).filter(Boolean));
  if (flag("echantillon")) return ECHANTILLON;
  var out = [];
  if (TOUT) out = out.concat(premierNiveau());
  if (flag("cours")) out = out.concat(tousCoursHtml());
  if (flag("lecons")) out = out.concat(unePageParCours());
  if (out.length) return dedup(out);
  return dedup(premierNiveau().concat(tousCoursHtml()).concat(unePageParCours()));
}

/* --------------------------------------------------------------- Chrome ---- */
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

function attendre(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }

/* Client CDP minimal : Node >= 22 expose WebSocket globalement. */
function Client(url) {
  this.ws = new WebSocket(url);
  this.id = 0;
  this.encours = {};
  this.ecoutes = {};
  var self = this;
  this.pret = new Promise(function (res, rej) {
    self.ws.addEventListener("open", function () { res(); });
    self.ws.addEventListener("error", function (e) { rej(new Error("WebSocket : " + (e.message || "echec"))); });
  });
  this.ws.addEventListener("message", function (ev) {
    var m;
    try { m = JSON.parse(ev.data); } catch (e) { return; }
    if (m.id && self.encours[m.id]) {
      var f = self.encours[m.id];
      delete self.encours[m.id];
      if (m.error) f.rej(new Error(m.error.message));
      else f.res(m.result);
    } else if (m.method && self.ecoutes[m.method]) {
      self.ecoutes[m.method].forEach(function (cb) { cb(m.params); });
    }
  });
}
Client.prototype.envoyer = function (method, params) {
  var self = this;
  var id = ++this.id;
  return new Promise(function (res, rej) {
    self.encours[id] = { res: res, rej: rej };
    self.ws.send(JSON.stringify({ id: id, method: method, params: params || {} }));
    setTimeout(function () {
      if (self.encours[id]) { delete self.encours[id]; rej(new Error("delai depasse : " + method)); }
    }, 30000);
  });
};
Client.prototype.sur = function (method, cb) {
  (this.ecoutes[method] = this.ecoutes[method] || []).push(cb);
};
Client.prototype.fermer = function () { try { this.ws.close(); } catch (e) {} };

/* ------------------------------------------------ script injecte dans la page
   Tout ce qui suit s'execute DANS le navigateur, sur la page mesuree. Il ne
   renvoie que des donnees serialisables. */
var SONDE = function () {
  /* Analyse d'une couleur calculee. DEUX notations coexistent dans le site :
       rgb(26, 23, 19) / rgba(...)        -> canaux 0-255
       color(srgb 0.95 0.94 0.91 / 0.82)  -> canaux 0-1, produite par color-mix()
     Confondre les deux fait calculer des luminances ~0 et inventer des defauts
     de contraste sur des textes parfaitement lisibles. */
  function analyser(c) {
    var s = String(c).trim(), m;
    if (s === "transparent") return { r: 0, g: 0, b: 0, a: 0 };
    if ((m = s.match(/^color\(\s*srgb\s+([\d.eE+-]+)\s+([\d.eE+-]+)\s+([\d.eE+-]+)(?:\s*\/\s*([\d.eE+-]+%?))?/))) {
      return {
        r: parseFloat(m[1]) * 255, g: parseFloat(m[2]) * 255, b: parseFloat(m[3]) * 255,
        a: m[4] === undefined ? 1 : (/%$/.test(m[4]) ? parseFloat(m[4]) / 100 : parseFloat(m[4])),
      };
    }
    if ((m = s.match(/^rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)(?:[,\s/]+([\d.]+%?))?/))) {
      return {
        r: parseFloat(m[1]), g: parseFloat(m[2]), b: parseFloat(m[3]),
        a: m[4] === undefined ? 1 : (/%$/.test(m[4]) ? parseFloat(m[4]) / 100 : parseFloat(m[4])),
      };
    }
    return null;
  }
  /* Composition alpha : une couleur semi-transparente doit etre MELANGEE a ce
     qu'il y a derriere, pas traitee comme opaque. */
  function poser(dessus, dessous) {
    var a = dessus.a;
    return {
      r: dessus.r * a + dessous.r * (1 - a),
      g: dessus.g * a + dessous.g * (1 - a),
      b: dessus.b * a + dessous.b * (1 - a),
      a: 1,
    };
  }
  function lumDe(c) {
    var v = [c.r, c.g, c.b].map(function (x) {
      var n = Math.min(255, Math.max(0, x)) / 255;
      return n <= 0.03928 ? n / 12.92 : Math.pow((n + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * v[0] + 0.7152 * v[1] + 0.0722 * v[2];
  }
  function ratioDe(cTexte, cFond) {
    var l1 = lumDe(cTexte), l2 = lumDe(cFond);
    return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
  }
  /* Fond EFFECTIF, opaque : on remonte la chaine des ancetres en composant les
     fonds semi-transparents les uns sur les autres, jusqu'a l'opacite pleine. */
  function fondDe(el) {
    var pile = [];
    var p = el;
    while (p) {
      var c = analyser(getComputedStyle(p).backgroundColor);
      if (c && c.a > 0) {
        pile.push(c);
        if (c.a >= 0.999) break;
      }
      p = p.parentElement;
    }
    var base = { r: 255, g: 255, b: 255, a: 1 };
    for (var i = pile.length - 1; i >= 0; i--) base = poser(pile[i], base);
    return base;
  }
  function enTexte(c) {
    return "rgb(" + Math.round(c.r) + ", " + Math.round(c.g) + ", " + Math.round(c.b) + ")";
  }
  /* Visibilite FIABLE : getComputedStyle(el).display ment quand c'est un
     ANCETRE qui porte hidden ou display:none. */
  function visible(el) {
    if (!el || el.offsetParent === null) return false;
    if (el.closest("[hidden]")) return false;
    var r = el.getBoundingClientRect();
    if (r.width < 1 || r.height < 1) return false;
    var st = getComputedStyle(el);
    return st.visibility !== "hidden" && parseFloat(st.opacity) > 0.05;
  }
  function chemin(el) {
    var s = el.tagName.toLowerCase();
    if (el.id) return s + "#" + el.id;
    var c = (el.className && typeof el.className === "string") ? el.className.trim().split(/\s+/).slice(0, 2).join(".") : "";
    return c ? s + "." + c : s;
  }

  var res = { debordement: null, contraste: [], focus: [], aria: [], compte: {} };

  /* --- 1. debordement horizontal ------------------------------------------ */
  var de = document.documentElement;
  var deb = de.scrollWidth - de.clientWidth;
  if (deb > 0) {
    var coupables = [];
    document.querySelectorAll("*").forEach(function (el) {
      var r = el.getBoundingClientRect();
      if (r.right <= de.clientWidth + 0.5 || r.width < 1) return;
      /* on ignore ce qui vit dans un ancetre qui defile deja : c'est voulu */
      var p = el.parentElement, dedans = false;
      while (p) {
        var ov = getComputedStyle(p).overflowX;
        if (ov === "auto" || ov === "scroll" || ov === "hidden") { dedans = true; break; }
        p = p.parentElement;
      }
      if (!dedans && coupables.length < 3) coupables.push(chemin(el) + " (droite " + Math.round(r.right) + ")");
    });
    res.debordement = { de: deb, coupables: coupables };
  }

  /* --- 2. contraste du texte ---------------------------------------------- */
  var vus = {};
  var textes = document.querySelectorAll("p,li,a,span,td,th,h1,h2,h3,h4,button,label,dt,dd,summary,figcaption,strong,em,code");
  for (var i = 0; i < textes.length && res.contraste.length < 40; i++) {
    var el = textes[i];
    if (!visible(el)) continue;
    /* uniquement les elements qui portent DIRECTEMENT du texte */
    var propre = "";
    for (var k = 0; k < el.childNodes.length; k++) {
      if (el.childNodes[k].nodeType === 3) propre += el.childNodes[k].nodeValue;
    }
    if (propre.trim().length < 2) continue;
    var st = getComputedStyle(el);
    var taille = parseFloat(st.fontSize);
    var gras = parseInt(st.fontWeight, 10) >= 700;
    var seuil = (taille >= 24 || (taille >= 18.66 && gras)) ? 3.0 : 4.5;
    var fond = fondDe(el);
    var cT = analyser(st.color);
    if (!cT) continue;
    if (cT.a < 0.999) cT = poser(cT, fond); /* texte semi-transparent : on le compose */
    var r = ratioDe(cT, fond);
    if (r >= seuil) continue;
    var cle = chemin(el) + "|" + st.color;
    if (vus[cle]) continue;
    vus[cle] = 1;
    res.contraste.push({
      ou: chemin(el),
      ratio: Math.round(r * 100) / 100,
      seuil: seuil,
      taille: Math.round(taille * 10) / 10,
      couleur: enTexte(cT),
      fond: enTexte(fond),
      extrait: propre.trim().slice(0, 40),
    });
  }
  res.compte.textes = textes.length;

  /* --- 3. focus : mesure faite depuis Node, par de VRAIES tabulations ------
     On ne teste PAS le focus ici : `el.focus()` en JavaScript ne declenche pas
     `:focus-visible`, dont l'heuristique navigateur exige une interaction
     clavier. Le mesurer d'ici produirait des dizaines de faux positifs. Voir
     mesurerFocus() cote Node, qui envoie de vrais evenements Tab via CDP. */
  res.compte.focusables = document.querySelectorAll(
    'a[href],button,input,select,textarea,[tabindex]:not([tabindex="-1"])'
  ).length;

  /* --- 4. aria ------------------------------------------------------------ */
  document.querySelectorAll("[aria-controls],[aria-labelledby],[aria-describedby]").forEach(function (el) {
    ["aria-controls", "aria-labelledby", "aria-describedby"].forEach(function (a) {
      var v = el.getAttribute(a);
      if (!v) return;
      v.split(/\s+/).forEach(function (id) {
        if (id && !document.getElementById(id) && res.aria.length < 10) {
          res.aria.push({ ou: chemin(el), quoi: a + '="' + id + '" ne pointe vers aucun element' });
        }
      });
    });
  });
  /* champs sans nom accessible */
  document.querySelectorAll("input,select,textarea").forEach(function (el) {
    if (!visible(el) || el.type === "hidden") return;
    var nom =
      el.getAttribute("aria-label") ||
      (el.getAttribute("aria-labelledby") && document.getElementById(el.getAttribute("aria-labelledby"))) ||
      (el.id && document.querySelector('label[for="' + CSS.escape(el.id) + '"]')) ||
      el.closest("label");
    if (!nom && res.aria.length < 10) {
      res.aria.push({ ou: chemin(el), quoi: "champ sans nom accessible (le placeholder n'en est pas un)" });
    }
  });
  /* role="tab" sans le motif complet */
  var tabs = document.querySelectorAll('[role="tab"]');
  if (tabs.length && !document.querySelector('[role="tabpanel"]') && res.aria.length < 10) {
    res.aria.push({ ou: "[role=tab] x" + tabs.length, quoi: "des onglets ARIA sans aucun tabpanel" });
  }
  /* sauts de niveau de titre */
  var niv = 0;
  document.querySelectorAll("h1,h2,h3,h4,h5,h6").forEach(function (h) {
    var n = parseInt(h.tagName[1], 10);
    if (niv && n > niv + 1 && res.aria.length < 10) {
      res.aria.push({ ou: chemin(h), quoi: "saut de titre h" + niv + " vers h" + n });
    }
    niv = n;
  });

  return res;
};

/* ----------------------------------------------- focus : vraies tabulations
   `:focus-visible` ne s'active qu'apres une interaction clavier reelle : on
   envoie donc de vrais evenements Tab par CDP, et on interroge l'element actif
   apres chacun. Un element focalise au clavier DOIT porter un repere visible —
   sur lui-meme (outline, ombre, bordure changee) ou sur un ancetre (:focus-within). */
var LIRE_ACTIF = function () {
  var el = document.activeElement;
  if (!el || el === document.body || el === document.documentElement) return null;
  function chemin(e) {
    var s = e.tagName.toLowerCase();
    if (e.id) return s + "#" + e.id;
    var c = (e.className && typeof e.className === "string") ? e.className.trim().split(/\s+/).slice(0, 2).join(".") : "";
    return c ? s + "." + c : s;
  }
  var st = getComputedStyle(el);
  var repere =
    (st.outlineStyle !== "none" && parseFloat(st.outlineWidth) > 0) ||
    (st.boxShadow && st.boxShadow !== "none");
  if (!repere) {
    /* un ancetre proche peut porter le repere via :focus-within */
    var p = el.parentElement, n = 0;
    while (p && n < 3 && !repere) {
      var ps = getComputedStyle(p);
      var ap = getComputedStyle(p, "::after");
      if ((ps.boxShadow && ps.boxShadow !== "none") ||
          (ps.outlineStyle !== "none" && parseFloat(ps.outlineWidth) > 0) ||
          (ap && ap.boxShadow && ap.boxShadow !== "none")) repere = true;
      p = p.parentElement; n++;
    }
  }
  return {
    ou: chemin(el),
    texte: (el.textContent || el.value || el.getAttribute("aria-label") || "").trim().slice(0, 32),
    repere: repere,
    visible: el.offsetParent !== null && !el.closest("[hidden]"),
  };
};

async function mesurerFocus(envoyer, maxTab) {
  var manquants = [];
  var vus = {};
  var testes = 0;
  await envoyer("Runtime.evaluate", {
    expression: "try{document.activeElement&&document.activeElement.blur&&document.activeElement.blur()}catch(e){}",
  });
  for (var i = 0; i < maxTab; i++) {
    await envoyer("Input.dispatchKeyEvent", { type: "rawKeyDown", key: "Tab", code: "Tab", windowsVirtualKeyCode: 9, nativeVirtualKeyCode: 9 });
    await envoyer("Input.dispatchKeyEvent", { type: "keyUp", key: "Tab", code: "Tab", windowsVirtualKeyCode: 9, nativeVirtualKeyCode: 9 });
    var out = await envoyer("Runtime.evaluate", { expression: "(" + LIRE_ACTIF.toString() + ")()", returnByValue: true });
    var v = (out.result || {}).value;
    if (!v || !v.visible) continue;
    /* Les <iframe> sont exclus : mesuré dans Chrome, un iframe focalise est bien
       document.activeElement mais ne matche NI :focus NI :focus-visible — le
       focus est delegue au document embarque. Aucune regle CSS posee sur le
       cadre ne peut donc s'appliquer, et le signaler serait demander une
       correction impossible. Le repere doit venir d'un ancetre en :focus-within,
       ce que la remontee d'ancetres de LIRE_ACTIF detecte deja. */
    if (v.ou.indexOf("iframe") === 0 && !v.repere) continue;
    var cle = v.ou + "|" + v.texte;
    if (vus[cle]) continue;
    vus[cle] = 1;
    testes++;
    if (!v.repere && manquants.length < 8) manquants.push(v);
  }
  return { manquants: manquants, testes: testes };
}

/* ------------------------------------------------------------------ rapport */
var RAPPORT = { pages: 0, erreurs: [], avertissements: [], mesures: 0 };
function erreur(page, categorie, texte) {
  RAPPORT.erreurs.push({ page: page, cat: categorie, texte: texte });
}
function avertir(page, categorie, texte) {
  RAPPORT.avertissements.push({ page: page, cat: categorie, texte: texte });
}

/* ------------------------------------------------------------------- main */
(async function main() {
  if (flag("lister")) {   // debug : quelles pages seraient mesurees, sans lancer Chrome
    var liste = pagesAMesurer();
    console.log(liste.length + " page(s) :");
    liste.forEach(function (x) { console.log("  " + x); });
    return;
  }
  var chrome = trouverChrome();
  if (!chrome) {
    console.error("ERREUR : Chrome introuvable. Renseigne CHROME_PATH.");
    process.exit(2);
  }
  if (typeof WebSocket === "undefined") {
    console.error("ERREUR : ce script demande Node >= 22 (WebSocket natif). Version : " + process.version);
    process.exit(2);
  }

  var pages = pagesAMesurer();
  var profil = path.join(os.tmpdir(), "verif-rendu-" + process.pid);
  var port = 9222 + (process.pid % 500);
  var proc = cp.spawn(chrome, [
    "--headless=new",
    "--disable-gpu",
    "--no-first-run",
    "--no-default-browser-check",
    "--allow-file-access-from-files",
    "--host-resolver-rules=MAP * ~NOTFOUND", /* le site doit vivre SANS reseau */
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
    console.error("ERREUR : Chrome n'a pas repondu sur le port " + port + ".");
    process.exit(2);
  }

  console.log("verif-rendu.js — " + pages.length + " page(s) x " + LARGEURS.length +
    " largeur(s) x " + THEMES.length + " theme(s), reseau COUPE\n");

  var nav = new Client(cible);
  await nav.pret;

  for (var ip = 0; ip < pages.length; ip++) {
    var rel = pages[ip];
    /* Une page peut etre demandee AVEC ses parametres : « pages/imprimer.html
       ?cours=regex », « pages/projets.html#course=js ». Plusieurs pages du site
       ne montrent leur vrai contenu qu'ainsi ; sans cela on ne mesurait qu'un
       ecran « introuvable ». Le suffixe est retire pour trouver le fichier sur
       le disque, puis remis dans l'URL. */
    var suffixe = "";
    var coupe = rel.search(/[?#]/);
    if (coupe !== -1) { suffixe = rel.slice(coupe); rel = rel.slice(0, coupe); }
    var abs = path.join(ROOT, rel);
    if (!fs.existsSync(abs)) { avertir(rel, "page", "fichier introuvable"); continue; }
    var url = "file:///" + abs.replace(/\\/g, "/");
    url += suffixe;
    rel = rel + suffixe;
    RAPPORT.pages++;

    var cid = (await nav.envoyer("Target.createTarget", { url: "about:blank" })).targetId;
    var sess = (await nav.envoyer("Target.attachToTarget", { targetId: cid, flatten: true })).sessionId;

    /* petit client par session : on prefixe chaque envoi du sessionId */
    var envoyer = function (m, p) {
      var id = ++nav.id;
      return new Promise(function (res, rej) {
        nav.encours[id] = { res: res, rej: rej };
        nav.ws.send(JSON.stringify({ id: id, method: m, params: p || {}, sessionId: sess }));
        setTimeout(function () {
          if (nav.encours[id]) { delete nav.encours[id]; rej(new Error("delai : " + m)); }
        }, 30000);
      });
    };

    var journal = [];
    var reseau = [];
    nav.sur("Runtime.consoleAPICalled", function (p) {
      if (p.type === "error" || p.type === "warning") {
        journal.push({ type: p.type, texte: (p.args || []).map(function (a) { return a.value || a.description || ""; }).join(" ").slice(0, 160) });
      }
    });
    nav.sur("Runtime.exceptionThrown", function (p) {
      journal.push({ type: "exception", texte: ((p.exceptionDetails || {}).text || "") + " " + (((p.exceptionDetails || {}).exception || {}).description || "").slice(0, 160) });
    });
    nav.sur("Network.requestWillBeSent", function (p) {
      var u = (p.request || {}).url || "";
      if (/^https?:/i.test(u)) reseau.push(u.slice(0, 100));
    });

    await envoyer("Runtime.enable");
    await envoyer("Network.enable");
    await envoyer("Page.enable");

    for (var it = 0; it < THEMES.length; it++) {
      for (var iw = 0; iw < LARGEURS.length; iw++) {
        var theme = THEMES[it], larg = LARGEURS[iw];
        await envoyer("Emulation.setDeviceMetricsOverride", {
          width: larg, height: 900, deviceScaleFactor: 1, mobile: false,
        });
        /* progression semee AVANT le chargement : sans elle, plusieurs elements
           n'existent pas et la mesure ment. */
        await envoyer("Page.addScriptToEvaluateOnNewDocument", {
          source:
            "try{var p={};['html','css','javascript','python','sql'].forEach(function(c){p[c]={};for(var i=1;i<=12;i++){p[c]['lecon-'+(i<10?'0':'')+i+'.html']=true}});" +
            "localStorage.setItem('syntaxe-progress',JSON.stringify(p));" +
            "localStorage.setItem('syntaxe-last',JSON.stringify({course:'html',file:'lecon-05.html'}));" +
            "document.documentElement.setAttribute('data-theme','" + theme + "')}catch(e){}",
        });
        await envoyer("Page.navigate", { url: url });
        /* Une page listee AVEC parametre construit son contenu apres coup (le
           livret injecte 5,3 Mo d'index) : lui laisser le temps, sinon on
           mesurerait une page vide. */
        await attendre(suffixe ? Math.max(ATTENTE, 3000) : ATTENTE);
        await envoyer("Runtime.evaluate", {
          expression: "document.documentElement.setAttribute('data-theme','" + theme + "')",
        });
        await attendre(120);

        var out = await envoyer("Runtime.evaluate", {
          expression: "(" + SONDE.toString() + ")()",
          returnByValue: true,
          awaitPromise: false,
        });
        RAPPORT.mesures++;
        var v = (out.result || {}).value;
        if (!v) { avertir(rel, "sonde", "aucune mesure a " + larg + "px/" + theme); continue; }

        var ctx = rel + " [" + larg + "px/" + theme + "]";
        if (v.debordement) {
          erreur(ctx, "debordement", "+" + v.debordement.de + " px — " + (v.debordement.coupables.join(" · ") || "cause non isolee"));
        }
        v.contraste.forEach(function (c) {
          erreur(ctx, "contraste", c.ratio + ":1 (seuil " + c.seuil + ") sur " + c.ou +
            " — « " + c.extrait + " » " + c.couleur + " sur " + c.fond);
        });
        /* Le focus ne se mesure qu'une fois par page (au theme et a la largeur
           courants) : il depend du CSS, pas de la largeur, et 25 tabulations
           par combinaison couteraient cher pour rien. */
        if (it === 0 && iw === 0) {
          var fr = await mesurerFocus(envoyer, 25);
          fr.manquants.forEach(function (f) {
            erreur(rel, "focus", "aucun repere visible au clavier sur " + f.ou + (f.texte ? " « " + f.texte + " »" : ""));
          });
        }
        v.aria.forEach(function (a) {
          avertir(ctx, "aria", a.quoi + " — " + a.ou);
        });
      }
    }

    journal.forEach(function (l) { erreur(rel, "console", l.type + " : " + l.texte); });
    reseau.forEach(function (u) { erreur(rel, "reseau", "requete distante : " + u); });

    await nav.envoyer("Target.closeTarget", { targetId: cid });
    process.stdout.write("  " + String(ip + 1).padStart(3) + "/" + pages.length + "  " + rel + "\n");
  }

  nav.fermer();
  proc.kill();
  try { fs.rmSync(profil, { recursive: true, force: true }); } catch (e) {}

  /* ---------------------------------------------------------------- sortie */
  function grouper(liste) {
    var m = {};
    liste.forEach(function (x) { (m[x.cat] = m[x.cat] || []).push(x); });
    return m;
  }
  console.log("\n=== RESULTAT ===");
  console.log("  pages mesurees ..... " + RAPPORT.pages);
  console.log("  mesures ............ " + RAPPORT.mesures + " (page x largeur x theme)");
  console.log("  ERREURS ............ " + RAPPORT.erreurs.length);
  console.log("  avertissements ..... " + RAPPORT.avertissements.length);

  var ge = grouper(RAPPORT.erreurs);
  Object.keys(ge).forEach(function (cat) {
    console.log("\n[" + cat.toUpperCase() + "] " + ge[cat].length);
    ge[cat].slice(0, 12).forEach(function (x) { console.log("  · " + x.page + "\n      " + x.texte); });
    if (ge[cat].length > 12) console.log("  … et " + (ge[cat].length - 12) + " autre(s)");
  });
  var ga = grouper(RAPPORT.avertissements);
  Object.keys(ga).forEach(function (cat) {
    console.log("\n(avertissement) [" + cat + "] " + ga[cat].length);
    ga[cat].slice(0, 8).forEach(function (x) { console.log("  · " + x.page + "\n      " + x.texte); });
    if (ga[cat].length > 8) console.log("  … et " + (ga[cat].length - 8) + " autre(s)");
  });

  if (!RAPPORT.erreurs.length && !RAPPORT.avertissements.length) console.log("\nAucun probleme de rendu detecte.");
  var code = RAPPORT.erreurs.length ? 1 : (STRICT && RAPPORT.avertissements.length ? 1 : 0);
  process.exit(code);
})().catch(function (e) {
  console.error("ERREUR : " + (e && e.message ? e.message : e));
  process.exit(2);
});
