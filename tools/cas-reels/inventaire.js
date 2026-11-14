/* =============================================================================
   tools/cas-reels/inventaire.js — l'inventaire des encadrés « Cas réel » (V18, B1).
   Node pur, zéro dépendance. Ne modifie rien.

   POURQUOI. Le V16 a trouvé QUATRE « Cas réel » inventés, par hasard ; le seul
   contrôle du site (`verif-contenu.js`) vérifie que le MOT est écrit. Avant de
   vérifier les faits, il faut savoir où ils sont : cet outil extrait chaque
   encadré dont le titre commence par « Cas réel », dans les leçons DÉCLARÉES par
   `js/data.js` (la même liste que `verif-contenu.js`), et le classe :

     SUSPECT  — il ne porte ni année (19xx, 20xx) ni nom propre d'organisation,
                de produit ou de personne ; OU son sujet est générique (« une
                start-up », « une équipe », « une entreprise », « un développeur »…).
     ANCRÉ    — tout le reste.

   Le classement est une HEURISTIQUE : sa précision a été mesurée à la main sur un
   tirage de 30 encadrés (voir le B1 du CHANTIER-V18). « Ancré » ne veut pas dire
   « vrai » : un récit peut citer une vraie entreprise et une vraie année et être
   faux. C'est l'échantillon de B2 qui mesure le vrai taux.

   USAGE
     node tools/cas-reels/inventaire.js                  # bilan par cours
     node tools/cas-reels/inventaire.js --cours=tests    # le détail d'un cours
     node tools/cas-reels/inventaire.js --json           # tout, en JSON (stdout)
     node tools/cas-reels/inventaire.js --lots           # composition des lots B4 à B12
   ============================================================================= */
"use strict";
var fs = require("fs");
var path = require("path");

var args = process.argv.slice(2);
function opt(n, d) {
  for (var i = 0; i < args.length; i++) if (args[i].indexOf("--" + n + "=") === 0) return args[i].slice(n.length + 3);
  return d;
}
function flag(n) { return args.indexOf("--" + n) !== -1; }
var ROOT = path.resolve(opt("root", path.join(__dirname, "..", "..")));

/* ------------------------------------------------------------ les leçons ---- */
function loadGlobal(file, nom) {
  var code = fs.readFileSync(path.join(ROOT, file), "utf8");
  if (code.charCodeAt(0) === 0xfeff) code = code.slice(1);
  var w = {};
  new Function("window", code)(w);
  return w[nom];
}
var DATA = loadGlobal("js/data.js", "SITE_DATA");
if (!DATA || !DATA.content) { console.error("js/data.js illisible"); process.exit(2); }

/* ------------------------------------------------------- texte d'un encadré */
var ENTITES = { nbsp: " ", amp: "&", lt: "<", gt: ">", quot: "\"", apos: "'", rsquo: "’", lsquo: "‘",
  laquo: "«", raquo: "»", hellip: "…", mdash: "—", ndash: "–", eacute: "é", egrave: "è", agrave: "à",
  ccedil: "ç", ecirc: "ê", times: "×", rarr: "→", larr: "←", le: "≤", ge: "≥", ne: "≠", thinsp: " ",
  euro: "€", deg: "°", middot: "·", rdquo: "”", ldquo: "“", minus: "−" };
function decoder(s) {
  return s.replace(/&#x([0-9a-f]+);/gi, function (_, h) { return String.fromCodePoint(parseInt(h, 16)); })
    .replace(/&#(\d+);/g, function (_, d) { return String.fromCodePoint(parseInt(d, 10)); })
    .replace(/&([a-z]+);/gi, function (m, n) { return Object.prototype.hasOwnProperty.call(ENTITES, n) ? ENTITES[n] : m; });
}
function texte(html) {
  return decoder(html.replace(/<[^>]*>/g, " ")).replace(/[   ]/g, " ").replace(/\s+/g, " ").trim();
}

/* Un encadré : <div class="callout callout--X">…<p class="callout__title">TITRE</p>CORPS</div></div>.
   On part de chaque TITRE, pas de chaque <div> : 23 encadrés ferment par « </div> », saut de
   ligne, « </div> », et une recherche ancrée sur le <div> laissait l'encadré PRÉCÉDENT avaler
   le « Cas réel » qui le suit (mesuré : 1 477 trouvés contre 1 500 titres). Le corps s'arrête au
   premier « </div> » suivi d'un « </div> », quels que soient les blancs entre les deux. */
var RE_TITRE_P = /<p class="callout__title">([\s\S]*?)<\/p>/g;
var RE_TITRE_CAS = /^Cas r[ée]el\b/i;
function encadresDe(html) {
  var res = [], m;
  RE_TITRE_P.lastIndex = 0;
  while ((m = RE_TITRE_P.exec(html))) {
    var avant = html.slice(Math.max(0, m.index - 2000), m.index);
    var types = avant.match(/<div class="callout callout--([a-z]+)"/g);
    var type = types ? /callout--([a-z]+)/.exec(types[types.length - 1])[1] : "?";
    var suite = html.slice(RE_TITRE_P.lastIndex);
    var fin = /<\/div>\s*<\/div>/.exec(suite);
    res.push({ pos: m.index, type: type, titreHtml: m[1], corpsHtml: fin ? suite.slice(0, fin.index) : suite.slice(0, 4000) });
  }
  /* L'AUTRE FORME : un intertitre <h2>Cas réel</h2> suivi de sa prose, jusqu'au <h2> suivant.
     51 leçons (offensive, crypto, neurones…) n'écrivent leur cas réel que sous cette forme ;
     l'apprenant le lit pareil, il est donc inventorié pareil (type « section »). */
  /* Le cours de maths l'écrit en <h3> (9 leçons) : un <h3> s'arrête au <h2> ou <h3> suivant. */
  var RE_H2 = /<h([23])[^>]*>([\s\S]*?)<\/h\1>/g;
  RE_H2.lastIndex = 0;
  while ((m = RE_H2.exec(html))) {
    if (!RE_TITRE_CAS.test(texte(m[2]))) continue;
    var reste = html.slice(RE_H2.lastIndex);
    var stop = (m[1] === "2" ? /<h2[\s>]|<\/article>|<\/main>|<nav[\s>]|<footer[\s>]/ :
                               /<h[23][\s>]|<\/article>|<\/main>|<nav[\s>]|<footer[\s>]/).exec(reste);
    var corpsH2 = stop ? reste.slice(0, stop.index) : reste.slice(0, 6000);
    /* Une section qui ENVELOPPE un encadré « Cas réel » est déjà comptée par lui (213 cas
       mesurés sur 255) : on ne garde que les sections dont le cas réel est la prose même. */
    if (/<p class="callout__title">\s*Cas r[ée]el/i.test(corpsH2)) continue;
    res.push({ pos: m.index, type: "section", titreHtml: m[2], corpsHtml: corpsH2 });
  }
  return res.sort(function (a, b) { return a.pos - b.pos; });
}

/* ------------------------------------------------------------- le classement */
/* RÉGLAGE (2026-11-14, B1 du V18) — la première version suivait le plan à la lettre : « suspect
   s'il ne porte ni année ni nom propre, ou si son sujet est générique », le sujet générique étant
   cherché PARTOUT. Lue sur 30 encadrés tirés au hasard (graine 20261114), elle avait une bonne
   précision (8 suspects justes sur 9) mais ne voyait que 8 des 20 récits anonymes : les sigles
   (CRM, CSV, API, FAQ), les identifiants de code (CompletableFuture, Dictionary) et les libellés
   d'interface (« Installation ») passaient pour des noms propres. Deux changements :
     1. le code (<code>, <pre>, <kbd>), les citations entre guillemets, les sigles, les mots à point
        ou à souligné (CHANGELOG.md) et les noms des langages et outils enseignés (titres des cours)
        ne comptent plus comme noms propres ;
     2. le sujet générique n'est retenu que s'il OUVRE l'une des deux premières phrases (« Une
        équipe livre… », « Sur un site… », « Chaque mois, un logiciel… ») : « dans un worker » au
        milieu d'une phrase sur Squoosh n'en fait pas un récit anonyme.
   Règle : SUSPECT = aucun nom propre, OU sujet générique sans année. */
var RE_ANNEE = /\b(19[5-9]\d|20[0-3]\d)\b/;
var RE_OUVRE_GENERIQUE = /^(?:[^,.;:]{0,60},\s*)?(?:(?:sur|dans|chez|pour|avec|depuis|lors d['’])\s+)?(une?)\s+(?!fois\b|jour\b|peu\b|seul\b|seule\b)([a-zà-ÿ][\wà-ÿ'’\-]*)/i;
function ouvreGenerique(corps) {
  var phrases = corps.split(/(?<=[.!?])\s+/).slice(0, 2);
  for (var i = 0; i < phrases.length; i++) {
    var m = RE_OUVRE_GENERIQUE.exec(phrases[i].trim());
    if (m) return m[1] + " " + m[2];
  }
  return null;
}
/* Noms des langages et outils enseignés : ce sont les sujets des leçons, pas ceux d'un cas. */
var NOMS_DE_COURS = new Set();
Object.keys(DATA.content).forEach(function (id) {
  var c = DATA.content[id];
  String((c && c.title) || "").split(/[\s\/,()·:+&-]+/).forEach(function (w) { if (w) NOMS_DE_COURS.add(w); });
});
/* Mots à majuscule qui ne sont PAS des noms propres d'organisation, de produit ou de personne :
   débuts de phrase usuels, langages et notions génériques. Liste ajustée sur le tirage de B1. */
var PAS_UN_NOM = new Set(("Le La Les Un Une Des Du De En Au Aux Ce Cet Cette Ces Il Elle Ils Elles On Pour " +
  "Par Sur Dans Avec Sans Mais Et Ou Donc Or Ni Car Quand Lorsque Si Comme Puis Alors Après Avant Depuis " +
  "Pendant Selon Chez Résultat Bilan Morale Leçon Conclusion Moralité Ici Là Tout Toute Tous Toutes " +
  "Chaque Aucun Aucune Rien Personne Certains Plusieurs Deux Trois Quatre Cinq Dix Cent Mille Premier " +
  "Première Dernier Dernière Cas Réel Scénario Exemple Note Attention Astuce Piège Erreur Problème " +
  "Solution Cause Effet Impact Conséquence Lundi Mardi Mercredi Jeudi Vendredi Samedi Dimanche " +
  "Janvier Février Mars Avril Mai Juin Juillet Août Septembre Octobre Novembre Décembre " +
  "C Ça Cela Ceci Celui Celle Ceux Qui Que Quoi Dont Où Est Sont A Ont Fut Était Sera " +
  "Oui Non Moins Plus Très Trop Peu Bien Mal Vite Enfin Ensuite Aujourd Hier Demain Jamais Toujours " +
  "Même Autre Autres Ainsi Pourtant Toutefois Cependant Néanmoins Sinon Soit Voici Voilà " +
  "France Europe Internet Web").split(/\s+/));
function nomsPropres(s) {
  /* Un mot à majuscule qui n'ouvre pas une phrase et n'est ni un mot usuel, ni un sigle, ni un
     nom de fichier, ni le nom d'un langage ou d'un outil enseigné. */
  var noms = [];
  var re = /(^|[.!?:;»«"“”]\s*|\s|\()([A-ZÀ-ÖØ-Þ][\wÀ-ÖØ-öø-ÿ'’.\-]*[\wÀ-ÖØ-öø-ÿ])/g, m;
  while ((m = re.exec(s))) {
    var mot = m[2].replace(/['’].*$/, "");
    var debutPhrase = /[.!?]\s*$/.test(m[1]) || m.index === 0;
    if (debutPhrase) continue;
    if (PAS_UN_NOM.has(mot) || NOMS_DE_COURS.has(mot)) continue;
    if (/^[A-Z0-9\-]{2,7}$/.test(mot)) continue;          /* sigle : API, CSV, SQL, ARIA, ERC-20 */
    if (/[._]/.test(mot)) continue;                      /* fichier ou identifiant : CHANGELOG.md */
    noms.push(mot);
  }
  return noms;
}
/* Texte de classement : sans le code ni les citations (libellés d'interface, messages). */
function texteDeClassement(html) {
  return texte(html.replace(/<(pre|code|kbd|samp|var)\b[\s\S]*?<\/\1>/gi, " "))
    .replace(/«[^»]{0,200}»/g, " ").replace(/“[^”]{0,200}”/g, " ").replace(/\s+/g, " ").trim();
}
/* SECOND RÉGLAGE, après le tirage de contrôle (graine 20261115 : 26/30, précision 19/22, rappel
   19/20) : l'année se cherche HORS DU CODE (« "2026-07-17" » dans un appel de fonction ancrait un
   récit anonyme), et une année suffit à ancrer un cas dont le sujet n'est pas générique (le cas
   daté de mars 2025 sur `tj-actions/changed-files` n'a aucun mot à majuscule). */
function classer(titre, corpsHtml, corps) {
  var clair = texteDeClassement(corpsHtml);
  var annee = RE_ANNEE.exec(titre + " " + clair);
  var gen = ouvreGenerique(clair);
  /* « · » devant le titre : son premier mot (« Ariane 5, vol 501 ») n'est pas un début de phrase. */
  var noms = nomsPropres("· " + titre.replace(RE_TITRE_CAS, "").replace(/^[\s—–:-]+/, "") + " . " + clair);
  var raisons = [];
  if (!noms.length && !annee) raisons.push("ni année ni nom propre");
  if (gen && !annee) raisons.push("sujet générique sans année « " + gen + " »");
  else if (gen && !noms.length) raisons.push("sujet générique sans nom « " + gen + " »");
  return { annee: annee ? annee[1] : null, generique: gen, noms: noms.slice(0, 8),
           suspect: raisons.length > 0, raisons: raisons };
}

/* --------------------------------------------------------------- parcours --- */
var encadres = [];
var COURS_FILTRE = opt("cours", "");
Object.keys(DATA.content).forEach(function (id) {
  if (COURS_FILTRE && id !== COURS_FILTRE) return;
  var c = DATA.content[id], dir = c.dir || id;
  (c.modules || []).forEach(function (m) {
    (m.lessons || []).forEach(function (l) {
      if (!l || !l.file) return;
      var rel = "pages/" + dir + "/" + l.file;
      var abs = path.join(ROOT, rel);
      if (!fs.existsSync(abs)) return;
      var html = fs.readFileSync(abs, "utf8").replace(/<script[\s\S]*?<\/script>/gi, "");
      var rang = 0;
      encadresDe(html).forEach(function (x) {
        var titre = texte(x.titreHtml);
        if (!RE_TITRE_CAS.test(titre)) return;
        rang++;
        var corps = texte(x.corpsHtml);
        var e = { cours: id, fichier: rel, rang: rang, type: x.type, titre: titre, corps: corps };
        var k = classer(titre, x.corpsHtml, corps);
        Object.keys(k).forEach(function (y) { e[y] = k[y]; });
        encadres.push(e);
      });
    });
  });
});

/* ----------------------------------------------------------------- sortie --- */
if (flag("json")) { process.stdout.write(JSON.stringify(encadres, null, 1) + "\n"); process.exit(0); }

var parCours = {};
encadres.forEach(function (e) {
  var p = parCours[e.cours] = parCours[e.cours] || { total: 0, suspects: 0 };
  p.total++; if (e.suspect) p.suspects++;
});
var ids = Object.keys(parCours).sort(function (a, b) {
  return parCours[b].suspects - parCours[a].suspects || parCours[b].total - parCours[a].total || (a < b ? -1 : 1);
});
var nSusp = encadres.filter(function (e) { return e.suspect; }).length;

if (COURS_FILTRE) {
  encadres.forEach(function (e) {
    console.log((e.suspect ? "SUSPECT " : "ancré   ") + e.fichier + " #" + e.rang + " — " + e.titre +
      (e.suspect ? "  [" + e.raisons.join(" ; ") + "]" : "  [" + (e.annee || "") + (e.noms.length ? " " + e.noms.slice(0, 4).join(", ") : "") + "]"));
  });
  process.exit(0);
}

if (flag("lots")) {
  /* Dix cours par lot, du plus suspect au moins suspect ; le dernier prend le reste. */
  var n = ids.length, lots = [];
  for (var i = 0; i < 9; i++) lots.push(ids.slice(i * 10, i === 8 ? n : (i + 1) * 10));
  lots.forEach(function (l, i) {
    var s = l.reduce(function (a, id) { return a + parCours[id].suspects; }, 0);
    var t = l.reduce(function (a, id) { return a + parCours[id].total; }, 0);
    console.log("B" + (i + 4) + " · lot " + (i + 1) + " (" + l.length + " cours, " + s + " suspects / " + t + " encadrés) : " + l.join(", "));
  });
  process.exit(0);
}

console.log("inventaire des « Cas réel » — " + encadres.length + " encadrés dans " +
  new Set(encadres.map(function (e) { return e.fichier; })).size + " leçons, " + ids.length + " cours");
console.log("  SUSPECTS : " + nSusp + " (" + (100 * nSusp / encadres.length).toFixed(1) + " %)");
var r1 = encadres.filter(function (e) { return e.raisons.indexOf("ni année ni nom propre") !== -1; }).length;
var r2 = encadres.filter(function (e) { return e.generique; }).length;
console.log("    dont ni année ni nom propre : " + r1 + " · dont sujet générique : " + r2);
console.log("\n  cours            suspects / encadrés");
ids.forEach(function (id) {
  var p = parCours[id];
  console.log("  " + id.padEnd(16) + " " + String(p.suspects).padStart(4) + " / " + String(p.total).padEnd(4));
});
