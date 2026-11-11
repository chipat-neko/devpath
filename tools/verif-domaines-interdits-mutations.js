/* =============================================================================
   verif-domaines-interdits-mutations.js — ON POSE UNE VRAIE RÉFÉRENCE À UN DOMAINE
   INTERDIT, ET ON REGARDE SI LES DEUX CONTRÔLES LA VOIENT (point A3 du chantier V18).

   LES DEUX CONTRÔLES ÉPROUVÉS
     - `tools/verif-domaines-interdits.js` (statique, toutes les pages servies) ;
     - `tools/preuves/sonde-clic-reseau.js` (dynamique : un vrai Chrome dont toute
       résolution de nom est détournée vers un piège local).
   Avant ce point, la sonde rangeait `fonts.googleapis.com` et `fonts.gstatic.com` dans
   son bruit Google, et ne comptait PAS les connexions ouvertes au chargement de la
   page (avant tout clic) : elle les imprimait, puis sortait en 0. Une `<link>` vers
   l'un des trois domaines, posée dans une leçon qu'elle visite, la laissait verte.

   LES FAUTES
     M1 à M3 : une `<link rel="stylesheet">` réelle vers CHAQUE domaine, dans le `<head>`
               d'une leçon que la sonde visite. Les DEUX contrôles doivent rougir, et
               leur sortie doit NOMMER le domaine (un rouge venu d'ailleurs ne compte pas).
     S1 à S7 : d'autres formes de référence réelle, pour le seul contrôle statique
               (la sonde ne visite qu'une quinzaine de pages) : `<script src>`, `@import`
               dans une feuille CSS, `url(//…)` dans un attribut `style`, chaîne JS aux
               `\/` échappés, balise NON échappée dans un bloc de code (l'accident type),
               attribut encodé en entités, lien `href` d'une donnée JSON.
     N1 à N4 : TÉMOINS NÉGATIFS, qui doivent rester VERTS : le code échappé et la prose
               qui citent ces domaines (ce que font `html/lecon-25` et `-35`), une
               mention dans les indices JSON d'un exercice, une balise en commentaire.
               Un contrôle qui rougirait sur eux signalerait les leçons qui en parlent
               à dessein, et on finirait par le débrancher.

   GARANTIES
     - Témoin vert d'abord : sans mutation, les deux contrôles doivent sortir en 0,
       sinon la mesure n'a pas de sens (code 2).
     - La page cible est lue DANS la liste de la sonde (pas recopiée) : si elle en sort,
       l'épreuve le dit (code 2) au lieu d'éprouver une page que la sonde ne visite pas.
     - Restauration des octets d'origine (fins de ligne comprises) après chaque faute,
       et sur `exit`, `SIGINT`, `SIGTERM` et toute exception ; chaque restauration est
       RELUE et comparée.
     - Les ancres (`</head>`, `<body …>`, début ou fin de fichier) tiennent sur une seule
       ligne : elles ne dépendent pas des fins de ligne. Le texte injecté reprend celles
       du fichier (CRLF si le fichier est en CRLF), comme `motifSouple` de
       `verif-execution-mutations.js`.

     node tools/verif-domaines-interdits-mutations.js

   CODE DE SORTIE : 0 toutes les fautes vues et tous les témoins verts · 1 un angle mort
   ou un faux rouge · 2 la mesure n'a pas pu avoir lieu.
   ============================================================================= */
"use strict";

var fs = require("fs");
var path = require("path");
var cp = require("child_process");

var RACINE = path.resolve(__dirname, "..");
var VERIF = path.join(RACINE, "tools", "verif-domaines-interdits.js");
var SONDE = path.join(RACINE, "tools", "preuves", "sonde-clic-reseau.js");
var PAGE = "pages/js/lecon-12.html";

/* La page doit être visitée par la sonde dans la chaîne : on lit sa liste par défaut. */
var srcSonde = fs.readFileSync(SONDE, "utf8");
var debutListe = srcSonde.indexOf("var LISTE = [");
var finListe = srcSonde.indexOf("];", debutListe);
var liste = debutListe < 0 || finListe < 0 ? "" : srcSonde.slice(debutListe, finListe);
var rangs = [], mr, reRang = new RegExp("'" + PAGE.replace(/[.]/g, "\\.") + "#(\\d+)'", "g");
while ((mr = reRang.exec(liste))) rangs.push(mr[1]);
if (!rangs.length) {
  console.log("NON MESURÉ : " + PAGE + " n'est plus dans la LISTE de " + path.relative(RACINE, SONDE) +
    " ; choisir une autre leçon que la sonde visite.");
  process.exit(2);
}
var CIBLES_SONDE = rangs.map(function (r) { return PAGE + "#" + r; });

/* ------------------------------------------------------------ restauration */
var originaux = {};               /* chemin relatif -> Buffer d'origine */
function garder(rel) {
  if (!originaux[rel]) originaux[rel] = fs.readFileSync(path.join(RACINE, rel));
  return originaux[rel];
}
function restaurer() {
  var ko = [];
  Object.keys(originaux).forEach(function (rel) {
    var abs = path.join(RACINE, rel);
    try {
      fs.writeFileSync(abs, originaux[rel]);
      if (!fs.readFileSync(abs).equals(originaux[rel])) ko.push(rel);
    } catch (e) { ko.push(rel); }
  });
  return ko;
}
process.on("exit", function () { restaurer(); });
process.on("SIGINT", function () { restaurer(); process.exit(2); });
process.on("SIGTERM", function () { restaurer(); process.exit(2); });
process.on("uncaughtException", function (e) {
  restaurer();
  console.log("ÉCHEC TECHNIQUE : " + (e && e.stack ? e.stack : e));
  process.exit(2);
});

/* ------------------------------------------------------------ injections */
function finDeLigne(texte) { return texte.indexOf("\r\n") !== -1 ? "\r\n" : "\n"; }
/* Avant le PREMIER `</head>` : c'est le vrai (le `<head>` vient d'abord ; un `</head>`
   écrit dans une donnée JSON plus bas ne compte pas). */
function avantHead(bloc) {
  return function (t) {
    var i = t.search(/<\/head>/i), b = t.search(/<body[\s>]/i);
    if (i < 0 || (b >= 0 && b < i)) return null;
    return t.slice(0, i) + bloc + finDeLigne(t) + t.slice(i);
  };
}
/* Juste après la balise ouvrante `<body …>`. */
function apresBody(bloc) {
  return function (t) {
    var m = /<body[^>]*>/i.exec(t);
    if (!m) return null;
    var k = m.index + m[0].length, eol = finDeLigne(t);
    return t.slice(0, k) + eol + bloc + eol + t.slice(k);
  };
}
function enTete(bloc) { return function (t) { return bloc + finDeLigne(t) + t; }; }
function enFin(bloc) { return function (t) { var e = finDeLigne(t); return t + e + bloc + e; }; }

var MUTATIONS = [
  { id: "M1", fichier: PAGE, sonde: true, domaine: "cdnjs.cloudflare.com",
    nom: "<link> réelle vers cdnjs.cloudflare.com dans le <head>",
    poser: avantHead('<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism.min.css">') },
  { id: "M2", fichier: PAGE, sonde: true, domaine: "fonts.googleapis.com",
    nom: "<link> réelle vers fonts.googleapis.com dans le <head>",
    poser: avantHead('<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter&amp;display=swap">') },
  { id: "M3", fichier: PAGE, sonde: true, domaine: "fonts.gstatic.com",
    nom: "<link> réelle vers fonts.gstatic.com dans le <head>",
    poser: avantHead('<link rel="stylesheet" href="https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2">') },
  { id: "S1", fichier: PAGE, domaine: "cdnjs.cloudflare.com",
    nom: "<script src> vers cdnjs.cloudflare.com",
    poser: apresBody('<script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/prism.min.js"></script>') },
  { id: "S2", fichier: "css/base.css", domaine: "fonts.googleapis.com",
    nom: "@import vers fonts.googleapis.com en tête de css/base.css",
    poser: enTete('@import url("https://fonts.googleapis.com/css2?family=Inter&display=swap");') },
  { id: "S3", fichier: PAGE, domaine: "fonts.gstatic.com",
    nom: "url(//fonts.gstatic.com/…) sans schéma, dans un attribut style",
    poser: apresBody('<div style="background-image:url(//fonts.gstatic.com/s/x.png)"></div>') },
  { id: "S4", fichier: "js/theme.js", domaine: "fonts.gstatic.com",
    nom: "chaîne JS aux barres échappées (https:\\/\\/fonts.gstatic.com) en fin de js/theme.js",
    poser: enFin('var __policeDistante = "https:\\/\\/fonts.gstatic.com\\/s\\/inter\\/v13\\/x.woff2";') },
  { id: "S5", fichier: PAGE, domaine: "fonts.gstatic.com",
    nom: "balise NON échappée dans un bloc de code (le navigateur la crée pour de vrai)",
    poser: apresBody('<pre><code class="language-markup"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin></code></pre>') },
  { id: "S6", fichier: PAGE, domaine: "fonts.googleapis.com",
    nom: "attribut encodé en entités HTML (fonts&#46;googleapis&#46;com)",
    poser: avantHead('<link rel="stylesheet" href="https://fonts&#46;googleapis&#46;com/css2?family=Inter">') },
  { id: "S7", fichier: PAGE, domaine: "cdnjs.cloudflare.com",
    nom: "lien href d'une donnée JSON (forme \"link\":{\"href\":…} des exercices)",
    poser: apresBody('<script type="application/json" data-temoin-a3>[{"link":{"href":"https:\\/\\/cdnjs.cloudflare.com\\/ajax\\/libs\\/","label":"x"}}]</script>') },
  { id: "N1", fichier: PAGE, negatif: true,
    nom: "TÉMOIN : <link> en code ÉCHAPPÉ (&lt;link …&gt;), comme html/lecon-25",
    poser: apresBody('<pre><code class="language-markup">&lt;link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter"&gt;</code></pre>') },
  { id: "N2", fichier: PAGE, negatif: true,
    nom: "TÉMOIN : prose qui cite les URL en texte",
    poser: apresBody('<p>Ce site n\'appelle jamais <code>https://cdnjs.cloudflare.com</code> ni <code>//fonts.gstatic.com</code>.</p>') },
  { id: "N3", fichier: PAGE, negatif: true,
    nom: "TÉMOIN : indice JSON d'exercice qui cite une URL (échappé au rendu)",
    poser: apresBody('<script type="application/json" data-temoin-a3>[{"hints":["Souvent déclaré vers https://fonts.gstatic.com."]}]</script>') },
  { id: "N4", fichier: PAGE, negatif: true,
    nom: "TÉMOIN : <link> dans un commentaire HTML (aucune balise réelle)",
    poser: apresBody('<!-- <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter"> -->') },
];

/* ------------------------------------------------------------ lancements */
function lancer(fichier, args, plafond) {
  var t0 = Date.now();
  var r = cp.spawnSync(process.execPath, [fichier].concat(args || []),
    { cwd: RACINE, encoding: "utf8", timeout: plafond, maxBuffer: 32 * 1024 * 1024 });
  return { code: r.status, sortie: String(r.stdout || "") + String(r.stderr || ""),
    duree: ((Date.now() - t0) / 1000).toFixed(1), expire: !!(r.error && r.error.code === "ETIMEDOUT") };
}
function statique() { return lancer(VERIF, [], 120000); }
function sonde() { return lancer(SONDE, CIBLES_SONDE, 300000); }
function dernieres(s, n) { return s.split("\n").filter(function (l) { return l.trim(); }).slice(-n).map(function (l) { return "        | " + l; }).join("\n"); }

console.log("verif-domaines-interdits-mutations.js — " + MUTATIONS.length + " cas (" +
  MUTATIONS.filter(function (m) { return !m.negatif; }).length + " fautes, " +
  MUTATIONS.filter(function (m) { return m.negatif; }).length + " témoins négatifs)");
console.log("  page cible : " + PAGE + " (visitée par la sonde : " + CIBLES_SONDE.join(", ") + ")\n");

/* Témoin : les deux contrôles VERTS sans mutation. */
var t1 = statique();
if (t1.code !== 0) {
  console.log("[témoin] le contrôle statique n'est PAS vert sans mutation (code " + t1.code + ") :\n" + dernieres(t1.sortie, 12));
  process.exit(2);
}
var t2 = sonde();
if (t2.code !== 0) {
  console.log("[témoin] la sonde n'est PAS verte sans mutation (code " + t2.code + (t2.expire ? ", délai dépassé" : "") + ") :\n" + dernieres(t2.sortie, 14));
  process.exit(2);
}
console.log("[témoin] sans mutation : statique code 0 (" + t1.duree + " s), sonde code 0 (" + t2.duree + " s) — la mesure a un sens\n");

var attendus = 0, vues = 0, ratees = [], fauxRouges = [], impossibles = [];
MUTATIONS.forEach(function (m, k) {
  var tag = "[" + (k + 1) + "/" + MUTATIONS.length + "] " + m.id + " " + m.nom;
  var orig = garder(m.fichier).toString("utf8");
  var mute = m.poser(orig);
  if (mute === null || mute === orig) {
    impossibles.push(m.id);
    console.log(tag + " : NON APPLICABLE (ancre introuvable dans " + m.fichier + ")");
    return;
  }
  fs.writeFileSync(path.join(RACINE, m.fichier), mute, "utf8");
  var r = statique(), s = null;
  if (m.sonde) s = sonde();
  var ko = restaurer();
  if (ko.length) { console.log(tag + " : RESTAURATION ÉCHOUÉE pour " + ko.join(", ")); process.exit(2); }

  if (m.negatif) {
    if (r.code === 0) console.log(tag + " : reste VERT (code 0), comme il se doit");
    else { fauxRouges.push(m.id + " (code " + r.code + ")"); console.log(tag + " : FAUX ROUGE (code " + r.code + ")\n" + dernieres(r.sortie, 6)); }
    return;
  }
  /* Une faute est VUE si le code est 1 ET si la sortie nomme le domaine injecté. */
  attendus++;
  var vuS = r.code === 1 && r.sortie.indexOf(m.domaine) !== -1 && r.sortie.indexOf(m.fichier) !== -1;
  if (vuS) vues++; else ratees.push(m.id + "/statique (code " + r.code + ")");
  var msg = tag + "\n      statique : " + (vuS ? "VUE" : "PASSÉE INAPERÇUE") + " (code " + r.code + ", " + r.duree + " s)";
  if (m.sonde) {
    attendus++;
    var vuN = s.code === 1 && s.sortie.indexOf(m.domaine) !== -1;
    if (vuN) vues++; else ratees.push(m.id + "/sonde (code " + s.code + (s.expire ? ", délai dépassé" : "") + ")");
    msg += "\n      sonde    : " + (vuN ? "VUE" : "PASSÉE INAPERÇUE") + " (code " + s.code + ", " + s.duree + " s)";
    var lignesNom = s.sortie.split("\n").filter(function (l) { return l.indexOf(m.domaine) !== -1; });
    msg += lignesNom.length ? "\n" + lignesNom.slice(0, 3).map(function (l) { return "        | " + l.trim(); }).join("\n")
      : "\n        | (la sonde n'a imprimé aucune ligne qui nomme " + m.domaine + ")";
  }
  if (!vuS) msg += "\n" + dernieres(r.sortie, 4);
  console.log(msg);
});

var ko = restaurer();
console.log("");
console.log("=== BILAN ===");
console.log("  fautes vues ................. " + vues + " / " + attendus + "  (M1 à M3 comptent deux fois : statique et sonde)");
console.log("  passées inaperçues .......... " + ratees.length + (ratees.length ? " : " + ratees.join(" | ") : ""));
console.log("  témoins négatifs verts ...... " + (MUTATIONS.filter(function (m) { return m.negatif; }).length - fauxRouges.length) +
  " / " + MUTATIONS.filter(function (m) { return m.negatif; }).length + (fauxRouges.length ? "  FAUX ROUGES : " + fauxRouges.join(" | ") : ""));
console.log("  non applicables ............. " + impossibles.length + (impossibles.length ? " : " + impossibles.join(", ") : ""));
console.log("  fichiers restaurés et relus . " + (ko.length ? "ÉCHEC : " + ko.join(", ") : Object.keys(originaux).join(", ")));
if (ko.length) process.exit(2);
if (ratees.length || fauxRouges.length || impossibles.length) {
  console.log("RESULTAT : LES CONTRÔLES DES DOMAINES INTERDITS ONT DES ANGLES MORTS");
  process.exit(1);
}
console.log("RESULTAT : " + vues + "/" + attendus + " FAUTES VUES, " + MUTATIONS.filter(function (m) { return m.negatif; }).length + " TÉMOINS VERTS");
process.exit(0);
