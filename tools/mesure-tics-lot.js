/* mesure-tics-lot — LE TIC DE LOT : une tournure qui n'appartient qu'aux distracteurs.
 *
 * Trouve par la vague de contradiction du cours `nosql` (B4 du CHANTIER-V16), le 2026-09-23 :
 * cinq relecteurs sur cinq ont remonte, chacun de son cote et avec une sonde jetable ecrite
 * a la main, le MEME type d'indice — et aucun des 46 outils du projet ne le voit.
 *
 * CE QUE C'EST. Quand six agents rallongent les distracteurs d'un cours pour fermer le biais
 * de longueur, ils emploient tous le MEME materiau de rallonge : une glose entre parentheses
 * ouverte par un article — « (un plan fige) », « (une option) », « (le journal) » —, un
 * connecteur causal (« car », « puisque »), un adverbe de reprise (« alors », « ensuite »),
 * une virgule avant « et ». La BONNE reponse, elle, n'est pas touchee : elle est intouchable.
 * Le materiau de rallonge devient donc la SIGNATURE DU DISTRACTEUR.
 *
 * MESURE FONDATRICE, cours `nosql`, le 2026-09-23, apres deux vagues d'ecriture qui avaient
 * ramene les 46 strategies a une couverture de 0,0 % :
 *   parenthese ouverte par un article : 3 bonnes / 45 distracteurs, 13 questions tranchees,
 *   rendement 84,6 % — et 100,0 % si l'on ne garde que la parenthese FINALE (7 questions).
 * Toutes les mesures du projet etaient vertes. Le cours restait devinable sans le lire.
 *
 * COMMENT ON COMPTE — la definition est celle de mesure-mot-question.js, transposee des mots
 * aux MOTIFS :
 *   EXCES  : une seule option porte le motif      -> elle est designee.
 *   DEFAUT : trois options sur quatre le portent  -> la quatrieme est designee.
 * Une question est « tranchee » des qu'une des deux lectures designe UNE option. Le RENDEMENT
 * est la part des questions tranchees ou la designation tombe sur la bonne reponse. Un
 * rendement tres BAS est aussi grave qu'un rendement tres haut : il suffit de retourner la
 * regle (lecon du cours `mobile`, 2026-09-06).
 *
 * CE QUE L'OUTIL AJOUTE AUX AUTRES. mesure-mot-fetiche.js ne voit que des MOTS isoles, et il
 * exige >= 8 questions tranchees ET >= 28 % sur le cours ENTIER : un tic qui tranche 4
 * questions a 100 % passe sous ses deux seuils. mesure-mot-question.js voit les mots rares
 * mais pas les LOCUTIONS (« de donnees », « , et ») ni les motifs de FORME (une parenthese
 * ouverte par un article, un gabarit de phrase). Cet outil-ci couvre les deux angles morts.
 *
 * usage : node tools/mesure-tics-lot.js [<cours>] [--tous] [--exemples] [--seuil=N]
 *         node tools/mesure-tics-lot.js nosql --exemples
 */
"use strict";
var fs = require("fs"), path = require("path");

var argv = process.argv.slice(2);
var TOUS = argv.indexOf("--tous") !== -1;
var EXEMPLES = argv.indexOf("--exemples") !== -1;
var SEUIL = (function () {
  var a = argv.filter(function (x) { return x.indexOf("--seuil=") === 0; })[0];
  return a ? parseInt(a.slice(8), 10) : 4;
})();
/* le gain sur le COURS ENTIER a partir duquel on alerte — 3 points au-dessus du hasard,
   le meme seuil que mesure-biais-inverse.js et mesure-mot-fetiche.js */
var SEUIL_GAIN = 0.28;
var COURS = argv.filter(function (x) { return x.indexOf("--") !== 0; })[0] || "";
var PAGES = path.join(__dirname, "..", "pages");

/* ---------------------------------------------------------------- les motifs de FORME
   Ecrits a la main parce qu'ils ne se devinent pas d'un n-gramme : ils portent sur la
   ponctuation et sur la structure de la phrase. Chacun vient d'une prise reelle. */
/* ⚠️ LA FRONTIERE DE MOT DE JAVASCRIPT EST ASCII — piege trouve par un agent de la passe
   `nosql`, le 2026-09-23, et verifie : `/\bcar/i.test("s'ecartent")` rend TRUE, parce que `\b`
   voit une frontiere entre « é » et « c » ; `/\b(?:alors|puis)\b/i.test("épuisé")` rend TRUE
   aussi. Deux faux positifs mesures sur un cours francais. On n'utilise donc JAMAIS `\b` ici :
   AV et AP encadrent le motif par « pas une lettre », accents compris. */
var AV = "(?:^|[^a-zà-öø-ÿ0-9])";
var AP = "(?![a-zà-öø-ÿ0-9])";
function mot(corps) { return new RegExp(AV + "(?:" + corps + ")" + AP, "i"); }

var FORMES = [
  { nom: "parenthese ouverte par un article", re: /\((?:un|une|le|la|les|des|du|deux|trois)\s/i },
  { nom: "parenthese FINALE a article", re: /\((?:un|une|le|la|les|des|du|deux|trois)\s[^)]*\)\s*$/i },
  { nom: "glose finale entre parentheses", re: /\([^)]{4,}\)\s*$/ },
  { nom: "virgule avant « et »", re: /,\s+et\s/i },
  { nom: "connecteur causal (car/puisque/parce que)", re: mot("car|puisqu[e']|parce\\s+qu[e']") },
  { nom: "adverbe de reprise (alors/ensuite/puis)", re: mot("alors|ensuite|puis") },
  { nom: "restrictif « ne … que »", re: mot("ne\\s+\\S+(?:\\s+\\S+)?\\s+qu[e']") },
  { nom: "« y » adverbial", re: mot("[a-zà-öø-ÿ]+\\s+y\\s+[a-zà-öø-ÿ]+") },
  { nom: "demonstratif (ce/cette/ces)", re: mot("cette|ces|cet") },
  { nom: "deux-points mediane", re: /\S\s*:\s+\S/ },
  { nom: "point-virgule median", re: /;/ },
  { nom: "tiret d'incise", re: /\s[—–]\s/ },
  { nom: "guillemets francais", re: /«[^»]*»/ },
  { nom: "verbe conjugue en fin d'option",
    re: mot("est|sont|devient|deviennent|reste|restent|garde|gardent") },
  { nom: "quatre segments separes par virgule", re: /^[^,]*,[^,]*,[^,]*,/ },
  { nom: "exemple introduit par « ex. »", re: /(?:^|\s)ex\.\s/i },
];

/* les jetons d'un texte, minuscules, accents conserves — meme decoupe que mesure-mot-fetiche */
function jetons(t) {
  return (String(t).toLowerCase().match(/[a-zà-öø-ÿ0-9][a-zà-öø-ÿ0-9'-]*/g) || []);
}

function questionsDe(src) {
  var out = [], m, re = /<script[^>]*data-quiz(?:-bilan)?[^>]*>([\s\S]*?)<\/script>/g;
  while ((m = re.exec(src))) {
    var qs; try { qs = JSON.parse(m[1]); } catch (e) { continue; }
    if (Array.isArray(qs)) qs.forEach(function (q) {
      if (q && Array.isArray(q.a) && typeof q.correct === "number") out.push(q);
    });
  }
  return out;
}

function chargeCours(c) {
  var dir = path.join(PAGES, c), out = [];
  if (!fs.existsSync(dir)) return out;
  fs.readdirSync(dir).filter(function (f) { return /^lecon-\d+\.html$/.test(f); }).sort()
    .forEach(function (f) {
      var src = fs.readFileSync(path.join(dir, f), "utf8"), nq = 0;
      questionsDe(src).forEach(function (q) { nq++; out.push({ f: f, nq: nq, q: q }); });
    });
  return out;
}

/* ------------------------------------------------- le coeur : un motif, une mesure */
function mesureMotif(fiches, porteDe) {
  var b = 0, d = 0, tranchees = 0, justes = 0, det = [];
  fiches.forEach(function (x) {
    var n = x.q.a.length, p = x.q.a.map(porteDe), np = 0;
    p.forEach(function (v, i) { if (v) { np++; if (i === x.q.correct) b++; else d++; } });
    var designee = -1, lecture = "";
    if (np === 1) { designee = p.indexOf(true); lecture = "EXCES"; }
    else if (np === n - 1) { designee = p.indexOf(false); lecture = "DEFAUT"; }
    if (designee < 0) return;
    tranchees++;
    var juste = designee === x.q.correct;
    if (juste) justes++;
    det.push({ f: x.f, nq: x.nq, lecture: lecture, juste: juste });
  });
  var n = fiches.length, r = tranchees ? justes / tranchees : 0;
  /* ⚠️ CE QUI SE COMPARE A L'ETALON, C'EST LE GAIN SUR LE COURS ENTIER — pas le
     rendement local. Un motif qui tranche 5 questions sur 57 a un rendement de
     0 % et ne rapporte pourtant que 26,3 % a qui l'exploite : du bruit. La regle
     est celle de mesure-biais-inverse.js, transposee : hasard sur les questions
     non tranchees, et l'INVERSE d'une designation vaut 1/3 (on ecarte, on tire
     parmi les trois autres). */
  var globalDirect = n ? (tranchees * r + (n - tranchees) * 0.25) / n : 0;
  var globalInverse = n ? (tranchees * (1 - r) / 3 + (n - tranchees) * 0.25) / n : 0;
  return { b: b, d: d, tranchees: tranchees, justes: justes, det: det, rendement: r,
           globalDirect: globalDirect, globalInverse: globalInverse,
           pire: Math.max(globalDirect, globalInverse),
           sens: globalDirect >= globalInverse ? "DIRECTE" : "INVERSE" };
}

/* les n-grammes candidats : ceux qui apparaissent dans au moins SEUIL questions */
function candidatsNGrammes(fiches) {
  var compte = Object.create(null);
  fiches.forEach(function (x) {
    var vus = Object.create(null);
    x.q.a.forEach(function (o) {
      var j = jetons(o);
      for (var n = 2; n <= 3; n++) {
        for (var i = 0; i + n <= j.length; i++) {
          var g = j.slice(i, i + n).join(" ");
          if (!vus[g]) { vus[g] = 1; compte[g] = (compte[g] || 0) + 1; }
        }
      }
    });
  });
  return Object.keys(compte).filter(function (g) { return compte[g] >= SEUIL; });
}

function mesureCours(c) {
  var fiches = chargeCours(c);
  if (!fiches.length) return null;
  var alertes = [];

  FORMES.forEach(function (F) {
    var r = mesureMotif(fiches, function (o) { return F.re.test(o); });
    if (r.tranchees >= SEUIL && r.pire >= SEUIL_GAIN) {
      alertes.push({ nom: F.nom, type: "forme", r: r });
    }
  });

  candidatsNGrammes(fiches).forEach(function (g) {
    /* meme encadrement que les FORMES : « pas une lettre » de part et d'autre, accents
       compris — un simple \s laisserait « de la » matcher dans « grande lame ». */
    var re = new RegExp(AV + g.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/ /g, "\\s+") + AP, "i");
    var r = mesureMotif(fiches, function (o) { return re.test(o); });
    if (r.tranchees >= SEUIL && r.pire >= SEUIL_GAIN) {
      alertes.push({ nom: "« " + g + " »", type: "locution", r: r });
    }
  });

  alertes.sort(function (a, z) { return z.r.pire - a.r.pire; });
  return { cours: c, n: fiches.length, alertes: alertes };
}

/* ----------------------------------------------------------------------- sortie */
var listeCours;
if (COURS) listeCours = [COURS];
else if (TOUS) listeCours = fs.readdirSync(PAGES).filter(function (d) {
  return fs.statSync(path.join(PAGES, d)).isDirectory() &&
         fs.existsSync(path.join(PAGES, d, "cours.html"));
}).sort();
else {
  console.log("\nmesure-tics-lot — usage : node tools/mesure-tics-lot.js <cours> [--exemples]");
  console.log("                          node tools/mesure-tics-lot.js --tous\n");
  process.exit(0);
}

console.log("\nmesure-tics-lot — LE TIC DE LOT : une tournure qui n'appartient qu'aux distracteurs");
console.log("  EXCES = un seul porteur, il est designe ; DEFAUT = trois porteurs sur quatre,");
console.log("  le quatrieme est designe. RENDEMENT = part des questions tranchees ou la");
console.log("  designation tombe sur la BONNE reponse. Etalon du hasard : 25,0 %.");
console.log("  Alerte des qu'un motif tranche >= " + SEUIL + " questions ET rapporte >= " +
  (100 * SEUIL_GAIN).toFixed(0) + " % SUR LE COURS ENTIER, dans l'un des deux sens.");
console.log("  GLOBAL = ce que gagne l'apprenant sur tout le cours (hasard sur les questions");
console.log("  non tranchees) : c'est CE chiffre-la qui se compare aux 25,0 %, pas le rendement");
console.log("  local. Un rendement TRES BAS est aussi grave qu'un tres haut : il suffit de");
console.log("  retourner la regle (lecon du cours `mobile`).\n");

var totalAlertes = 0;
listeCours.forEach(function (c) {
  var m = mesureCours(c);
  if (!m) { console.log("  " + c + " : aucune question."); return; }
  if (!m.alertes.length) {
    if (!TOUS) console.log("  " + c + " — " + m.n + " questions : AUCUN tic de lot au-dessus du seuil.");
    return;
  }
  totalAlertes += m.alertes.length;
  console.log("  " + c + " — " + m.n + " questions, " + m.alertes.length + " tic(s) de lot :");
  m.alertes.forEach(function (a) {
    console.log("      " + a.nom.slice(0, 44).padEnd(46) +
      " bonnes " + String(a.r.b).padStart(3) + " / distr " + String(a.r.d).padStart(3) +
      "   tranche " + String(a.r.tranchees).padStart(3) +
      "   rend " + (100 * a.r.rendement).toFixed(1).padStart(5) + " %" +
      "   GLOBAL " + (100 * a.r.pire).toFixed(1).padStart(5) + " % (" + a.r.sens + ")");
    if (EXEMPLES) a.r.det.forEach(function (x) {
      console.log("          " + x.f + " q" + x.nq + "  " + x.lecture +
        (x.juste ? "  -> LA BONNE" : "  -> un distracteur"));
    });
  });
  console.log("");
});

if (TOUS) console.log("  " + totalAlertes + " tic(s) de lot sur " + listeCours.length + " cours.\n");
console.log("  Cible d'ecriture : aucune tournure, aucun signe, aucun gabarit de phrase ne doit");
console.log("  etre le privilege des distracteurs — ni celui des bonnes reponses.\n");
