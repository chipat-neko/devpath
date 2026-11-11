/* =============================================================================
   verif-domaines-interdits.js — AUCUNE RÉFÉRENCE RÉELLE AUX TROIS DOMAINES
   INTERDITS (point A3 du chantier V18).

   POURQUOI CET OUTIL EXISTE
   La règle fondatrice du site interdit toute URL vers `cdnjs.cloudflare.com`,
   `fonts.googleapis.com` et `fonts.gstatic.com` : le site vit en `file://`, sans
   réseau. Jusqu'ici, AUCUN contrôle statique ne la vérifiait. `verif-rendu` ne voit
   que les ≈ 229 pages qu'il affiche, et la sonde réseau (`preuves/sonde-clic-reseau.js`)
   rangeait les deux domaines de polices dans son bruit Google : une `<link>` vers
   Google Fonts posée dans l'une des 1 540 leçons n'aurait été vue par personne.

   CE QUI EST UNE RÉFÉRENCE RÉELLE, ET CE QUI NE L'EST PAS
   Deux leçons parlent de ces domaines À DESSEIN (`html/lecon-25` et `html/lecon-35` :
   le `preconnect` vers `fonts.gstatic.com`, en texte ou en code échappé `&lt;link …&gt;`).
   Chercher le nom dans le fichier les signalerait à tort. On lit donc le fichier comme
   le navigateur le lit, et l'on ne retient que ce qui peut CHARGER ou LIER :
     - HTML et SVG : les attributs des balises RÉELLES (un `<` suivi d'une lettre, hors
       commentaire) — `href`, `src`, `srcset`, `style`, `content`, `data-*`, n'importe
       lequel ; le contenu des `<script>` exécutables (lu comme du JS, ci-dessous) ; le
       contenu des `<style>` (lu comme du CSS) ; dans les `<script type="application/json">`
       (QCM, exercices), les seules clés qui fabriquent un lien (`href`, `src`, `url`…),
       puisque tout le reste y est échappé au rendu par `escapeHTML` de `js/lecon.js`.
       Le TEXTE de la page (prose, `<pre><code>` échappé), les commentaires HTML et le
       contenu de `<textarea>`, `<title>`, `<iframe>` ne chargent rien : ils sont écartés,
       mais COMPTÉS et nommés plus bas, pour qu'on voie qu'ils ont été lus.
     - CSS : tout le fichier, commentaires CSS retirés (`@import`, `url(…)`).
     - JS, `.webmanifest`, `.json` : tout le fichier, commentaires COMPRIS. Retirer les
       commentaires d'un JS sans analyseur complet est dangereux : un `//` naïf coupe
       aussi le `https://` d'une chaîne, et la référence disparaîtrait. On préfère un
       faux rouge visible à un faux vert muet. Mesure du 2026-11-11 : aucun JS servi ne
       contient l'une de ces URL, commentaire ou non.
   Une référence a la forme d'une URL : `//` (avec ou sans schéma, `https:` ou autre)
   puis l'hôte interdit ou l'un de ses sous-domaines. `fonts.googleapis.com/css` sans
   `//` est un chemin RELATIF (un fichier local en `file://`) : ce n'est pas un appel
   au réseau. Les entités HTML (`&#46;`, `&period;`…) des attributs et les `\/` des
   chaînes JS et JSON sont décodés avant la recherche.

   CE QU'IL NE VOIT PAS (et qui revient à la sonde réseau, sur ses pages) : une URL
   CALCULÉE (`"https://fonts." + "googleapis.com"`), un hôte encodé en `%xx`.

   PÉRIMÈTRE : tout ce que le site sert ou distribue — `pages/**`, `index.html`,
   `sw.js`, `js/**`, `css/**`, `assets/**`, `starter/**` (le kit de démarrage) — en
   `.html`, `.htm`, `.svg`, `.css`, `.js`, `.json`, `.webmanifest`. Les `.md` (dont les
   deux README de Prism, qui citent à dessein l'adresse d'où viennent les fichiers),
   les polices et les licences ne sont jamais chargés comme du code : non lus.

     node tools/verif-domaines-interdits.js

   CODE DE SORTIE : 0 aucune référence réelle · 1 au moins une · 2 rien n'a pu être lu.
   ============================================================================= */
"use strict";

var fs = require("fs");
var path = require("path");

var RACINE = path.resolve(__dirname, "..");
var RACINES = ["pages", "js", "css", "assets", "starter", "index.html", "sw.js"];
var EXT_HTML = /\.(html?|svg)$/i;
var EXT_CSS = /\.css$/i;
var EXT_JS = /\.(js|json|webmanifest)$/i;

var DOMAINES = ["cdnjs.cloudflare.com", "fonts.googleapis.com", "fonts.gstatic.com"];
var ALT = DOMAINES.map(function (d) { return d.replace(/\./g, "\\."); }).join("|");
/* L'hôte interdit, ou l'un de ses sous-domaines, et rien derrière qui prolonge le nom
   (`fonts.gstatic.com.exemple.net` est un autre hôte). */
var HOTE = "(?:[a-z0-9-]+\\.)*(?:" + ALT + ")(?![a-z0-9-]|\\.[a-z0-9])";
/* Forme URL : `//` (schéma facultatif), identifiants facultatifs, puis l'hôte. */
var RE_URL = new RegExp("(?:[a-z][a-z0-9+.-]*:)?//(?:[^\\s/?#@\"'<>]*@)?" + HOTE, "gi");
/* Simple mention du nom, pour compter ce qui est lu puis écarté. */
var RE_NOM = new RegExp(HOTE, "gi");
/* Préfiltre : un fichier qui ne contient aucun de ces mots ne peut rien référencer
   (sauf obfuscation par entités au milieu du mot, hors de portée déclarée). */
var RE_MOTS = /googleapis|gstatic|cloudflare|cdnjs/i;

/* Clés JSON qui fabriquent un lien dans la page (ex. `"link":{"href":…}` des exercices). */
var CLES_LIEN = /^(?:href|src|srcset|url|uri|lien|action|poster|icon|image)$/i;

/* --------------------------------------------------------------- inventaire */
function parcourir(rel, out) {
  var abs = path.join(RACINE, rel);
  var st;
  try { st = fs.statSync(abs); } catch (e) { return out; }
  if (st.isFile()) { out.push(rel); return out; }
  fs.readdirSync(abs, { withFileTypes: true }).forEach(function (e) {
    if (e.name === "node_modules" || e.name[0] === ".") return;
    parcourir(rel + "/" + e.name, out);
  });
  return out;
}

/* --------------------------------------------------------------- décodages */
function decoderEntites(s) {
  return s.replace(/&(#x[0-9a-f]+|#[0-9]+|[a-z]+);?/gi, function (tout, e) {
    var l = e.toLowerCase();
    if (l[0] === "#") {
      var n = l[1] === "x" ? parseInt(l.slice(2), 16) : parseInt(l.slice(1), 10);
      return isFinite(n) && n > 0 && n < 0x110000 ? String.fromCodePoint(n) : tout;
    }
    var nomme = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ", colon: ":",
      sol: "/", period: ".", dot: ".", fullstop: ".", num: "#", quest: "?", commat: "@" };
    return Object.prototype.hasOwnProperty.call(nomme, l) ? nomme[l] : tout;
  });
}
function decoderJS(s) {
  return s.replace(/\\\//g, "/").replace(/\\u002[fF]/g, "/").replace(/\\u002[eE]/g, ".");
}

function ligneDe(texte, index) {
  var n = 1;
  for (var i = texte.indexOf("\n"); i !== -1 && i < index; i = texte.indexOf("\n", i + 1)) n++;
  return n;
}

/* --------------------------------------------------------------- chercheurs */
/* Chaque trouvaille : { fichier, ligne, ou, url }. */
function chercherURL(texte, base, fichier, ou, out, decaler) {
  RE_URL.lastIndex = 0;
  var m;
  while ((m = RE_URL.exec(texte))) {
    out.push({ fichier: fichier, ligne: ligneDe(base, decaler(m.index)), ou: ou, url: m[0] });
  }
}

function scanCSS(css, base, fichier, out, offset, ou) {
  /* Les commentaires sont remplacés par des espaces de même longueur : les positions
     (donc les numéros de ligne) restent justes. */
  var propre = css.replace(/\/\*[\s\S]*?\*\//g, function (c) { return c.replace(/[^\n]/g, " "); });
  chercherURL(propre, base, fichier, ou || "CSS", out, function (i) { return offset + i; });
}

function scanJS(js, base, fichier, out, offset, ou) {
  /* `\/` -> `/` change la longueur : la ligne est prise au début du motif d'origine,
     ce qui suffit à désigner l'endroit. */
  var dec = decoderJS(js);
  RE_URL.lastIndex = 0;
  var m;
  while ((m = RE_URL.exec(dec))) {
    out.push({ fichier: fichier, ligne: ligneDe(base, offset + Math.min(m.index, js.length - 1)), ou: ou || "JS", url: m[0] });
  }
}

function scanJSONDonnees(json, base, fichier, out, offset) {
  var re = /"((?:[^"\\]|\\.)*)"\s*:\s*"((?:[^"\\]|\\.)*)"/g, m;
  while ((m = re.exec(json))) {
    if (!CLES_LIEN.test(m[1])) continue;
    var val = decoderJS(m[2]);
    RE_URL.lastIndex = 0;
    var u = RE_URL.exec(val);
    if (u) out.push({ fichier: fichier, ligne: ligneDe(base, offset + m.index), ou: "JSON de données, clé \"" + m[1] + "\"", url: u[0] });
  }
}

var BRUTS = { script: 1, style: 1, textarea: 1, title: 1, xmp: 1, iframe: 1, noembed: 1, noframes: 1 };
var TYPES_JS = /^(?:|text\/javascript|application\/javascript|text\/ecmascript|application\/ecmascript|module|text\/jsx|text\/babel)$/i;
var TYPES_RESEAU = /^(?:importmap|speculationrules)$/i;
var TYPES_DONNEES = /^(?:application\/(?:ld\+)?json)$/i;

/* Lecture d'une page comme le fait le navigateur, réduite à ce qui compte ici : où sont
   les balises réelles, leurs attributs, et le contenu brut de <script>/<style>. */
function scanHTML(texte, fichier, out, ecartes) {
  var i = 0, n = texte.length;
  while (i < n) {
    var lt = texte.indexOf("<", i);
    if (lt < 0) break;
    if (texte.startsWith("<!--", lt)) {
      var fc = texte.indexOf("-->", lt + 4);
      i = fc < 0 ? n : fc + 3; continue;
    }
    if (texte[lt + 1] === "!" || texte[lt + 1] === "?") {
      var fd = texte.indexOf(">", lt);
      i = fd < 0 ? n : fd + 1; continue;
    }
    var m = /^<(\/?)([a-zA-Z][a-zA-Z0-9:-]*)/.exec(texte.slice(lt, lt + 80));
    if (!m) { i = lt + 1; continue; }
    var fermante = m[1] === "/", nom = m[2].toLowerCase();
    /* Attributs : nom, puis `=` et une valeur entre guillemets, entre apostrophes ou nue. */
    var j = lt + m[0].length, attrs = [];
    while (j < n) {
      while (j < n && /[\s\/]/.test(texte[j])) j++;
      if (j >= n || texte[j] === ">") break;
      var dn = j;
      while (j < n && !/[\s\/>=]/.test(texte[j])) j++;
      var an = texte.slice(dn, j).toLowerCase();
      while (j < n && /\s/.test(texte[j])) j++;
      var val = "", dv = j;
      if (texte[j] === "=") {
        j++;
        while (j < n && /\s/.test(texte[j])) j++;
        var q = texte[j];
        if (q === '"' || q === "'") {
          var fq = texte.indexOf(q, j + 1);
          if (fq < 0) fq = n;
          dv = j + 1; val = texte.slice(j + 1, fq); j = fq + 1;
        } else {
          dv = j;
          while (j < n && !/[\s>]/.test(texte[j])) j++;
          val = texte.slice(dv, j);
        }
      }
      if (an) attrs.push({ nom: an, val: val, pos: dv });
    }
    var finBalise = j < n ? j + 1 : n;
    if (!fermante) {
      attrs.forEach(function (a) {
        var v = decoderEntites(a.val);
        if (a.nom === "style") return scanCSS(v, texte, fichier, out, a.pos, "<" + nom + "> attribut style");
        if (/^on/.test(a.nom)) return scanJS(v, texte, fichier, out, a.pos, "<" + nom + "> attribut " + a.nom);
        chercherURL(v, texte, fichier, "<" + nom + "> attribut " + a.nom, out, function () { return a.pos; });
      });
    }
    i = finBalise;
    if (!fermante && BRUTS[nom]) {
      var re = new RegExp("</" + nom + "(?=[\\s/>])", "ig");
      re.lastIndex = i;
      var f = re.exec(texte);
      var fin = f ? f.index : n;
      var contenu = texte.slice(i, fin);
      if (nom === "style") scanCSS(contenu, texte, fichier, out, i, "<style>");
      else if (nom === "script") {
        var t = attrs.filter(function (a) { return a.nom === "type"; })[0];
        var type = t ? decoderEntites(t.val).trim() : "";
        if (TYPES_JS.test(type) || TYPES_RESEAU.test(type)) scanJS(contenu, texte, fichier, out, i, "<script" + (type ? " type=" + type : "") + ">");
        else if (TYPES_DONNEES.test(type)) scanJSONDonnees(contenu, texte, fichier, out, i);
        else ecartes.push({ fichier: fichier, raison: "<script type=" + type + "> (ni exécuté ni lu comme données)", contenu: contenu });
      }
      i = fin;
    }
  }
}

/* --------------------------------------------------------------- balayage */
var fichiers = [];
RACINES.forEach(function (r) { parcourir(r, fichiers); });
var lus = { html: 0, css: 0, js: 0 }, nonLus = 0, examines = 0;
var trouvailles = [];
var mentions = {};          /* fichier -> nombre de mentions du nom, toutes formes */
var ecartes = [];
var pagesLecon = 0;

fichiers.forEach(function (rel) {
  var genre = EXT_HTML.test(rel) ? "html" : EXT_CSS.test(rel) ? "css" : EXT_JS.test(rel) ? "js" : null;
  if (!genre) { nonLus++; return; }
  var texte;
  try { texte = fs.readFileSync(path.join(RACINE, rel), "utf8"); } catch (e) { return; }
  lus[genre]++;
  if (/^pages\/[^/]+\/lecon-\d+\.html$/.test(rel)) pagesLecon++;
  if (!RE_MOTS.test(texte)) return;
  examines++;
  var avant = trouvailles.length;
  if (genre === "html") scanHTML(texte, rel, trouvailles, ecartes);
  else if (genre === "css") scanCSS(texte, texte, rel, trouvailles, 0);
  else scanJS(texte, texte, rel, trouvailles, 0);
  var nb = (texte.match(RE_NOM) || []).length;
  var reels = trouvailles.length - avant;
  if (nb > reels) mentions[rel] = nb - reels;
});

var total = lus.html + lus.css + lus.js;
console.log("verif-domaines-interdits.js — " + DOMAINES.join(", "));
console.log("  fichiers lus : " + total + " (" + lus.html + " HTML/SVG dont " + pagesLecon + " fichiers pages/<cours>/lecon-NN.html, " +
  lus.css + " CSS, " + lus.js + " JS/JSON) ; " + nonLus + " autres (md, polices, licences) non lus");
console.log("  fichiers qui nomment l'un des mots (googleapis, gstatic, cloudflare, cdnjs) : " + examines);

if (!total || !pagesLecon) {
  console.log("NON MESURÉ : aucun fichier du site n'a pu être lu (racine " + RACINE + ").");
  process.exit(2);
}

var noms = Object.keys(mentions);
if (noms.length) {
  console.log("  mentions lues puis écartées (texte, code échappé, données, commentaire HTML) :");
  noms.forEach(function (f) { console.log("      " + f + "  ×" + mentions[f]); });
}
ecartes.forEach(function (e) {
  RE_URL.lastIndex = 0;
  if (RE_URL.test(decoderJS(e.contenu))) console.log("  ⚠ non jugé : " + e.fichier + " " + e.raison + " contient l'une de ces URL");
});

if (trouvailles.length) {
  console.log("");
  trouvailles.forEach(function (t) {
    console.log("  ✗ " + t.fichier + ":" + t.ligne + "  " + t.ou + "  → " + t.url);
  });
  console.log("\nÉCHEC : " + trouvailles.length + " référence(s) réelle(s) à un domaine interdit. " +
    "Le site vit en file:// : ses polices et ses scripts sont dans assets/.");
  process.exit(1);
}
console.log("OK : aucune référence réelle à ces trois domaines.");
process.exit(0);
