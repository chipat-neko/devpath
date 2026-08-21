/* =============================================================================
   verif-contenu.js — mesure la QUALITE EDITORIALE des lecons.
   Node pur, ZERO dependance.

   POURQUOI ce fichier : le site a trois verificateurs — verif-html.js lit le
   source, verif-donnees.js lit les donnees, verif-rendu.js lit l'affichage.
   Aucun ne regarde CE QUI EST ECRIT. Le standard editorial est pourtant fixe
   noir sur blanc depuis le premier chantier :

     1 a 3 schemas SVG · au moins un cas reel · des encadres varies ·
     une antiseche · un glossaire de 4 a 8 termes · un QCM · des exercices

   Faute d'outil, 15 lecons livrees le 2026-08-01 sont passees avec 2 encadres
   au lieu de 5 : il a fallu un audit a 11 agents pour s'en apercevoir.

   Ce fichier repond a deux questions :
     1. quelles lecons sont SOUS LE STANDARD (manque un element obligatoire) ;
     2. quelles lecons sont MAIGRES par rapport au site (sous la mediane).
   Il detecte aussi la REDONDANCE : un bloc de prose recopie d'une lecon a une
   autre du meme cours — le defaut qui avait donne ux/lecon-11, recopie de
   ux/lecon-06 sur 2014 caracteres.

   USAGE
     node tools/verif-contenu.js                 # rapport complet
     node tools/verif-contenu.js --cours=python  # un seul cours
     node tools/verif-contenu.js --maigres       # seulement le classement des plus maigres
     node tools/verif-contenu.js --redondance    # seulement la redondance de prose
     node tools/verif-contenu.js --json          # sortie machine, pour un plan de travail
     node tools/verif-contenu.js --strict        # sort en code 1 des la premiere lecon sous le standard
   ============================================================================= */
"use strict";

var fs = require("fs");
var path = require("path");

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
var COURS_FILTRE = opt("cours", "");
var STRICT = flag("strict");
var JSON_OUT = flag("json");
var SEUIL_REDONDANCE = parseInt(opt("seuil-redondance", "400"), 10);

/* ------------------------------------------------------ le standard editorial */
/* Chaque critere : un minimum EXIGE (sous lequel la lecon est incomplete) et,
   pour certains, un maximum au-dela duquel c'est du remplissage. */
var STANDARD = {
  svg: { min: 1, max: 4, libelle: "schema SVG" },
  casReel: { min: 1, libelle: "cas reel" },
  callouts: { min: 2, libelle: "encadre" },
  cheat: { min: 1, libelle: "antiseche" },
  glossaire: { min: 4, max: 10, libelle: "terme de glossaire" },
  quiz: { min: 3, libelle: "question de QCM" },
  exos: { min: 2, libelle: "exercice" },
};

/* ------------------------------------------------- A3 : biais de longueur QCM */
/* Mesure de l'inventaire : dans les QCM, la bonne reponse est la plus longue ~93 %
   du temps. Un apprenant qui repond "la plus longue" a donc ~93 % sans rien savoir.
   Ce detecteur mesure l'ampleur et signale les cas les plus flagrants — cible du
   chantier editorial (etoffer les distracteurs, PAS raccourcir la bonne reponse).
   Non bloquant : le biais est structurel et preexiste massivement. */
var BIAIS_RATIO = 1.8;   // bonne reponse >= 1,8x le plus long distracteur
var BIAIS_DIFF = 25;     // ET au moins 25 caracteres de plus : "nettement" plus longue
var BIAIS = { total: 0, plusLongue: 0, net: 0, pires: [] };

function biaisQuestion(item) {
  if (!item || !Array.isArray(item.a) || item.a.length < 2) return null;
  var ci = item.correct || 0;
  var lc = String(item.a[ci] == null ? "" : item.a[ci]).length;
  var autres = item.a.filter(function (_, i) { return i !== ci; })
    .map(function (s) { return String(s == null ? "" : s).length; });
  var maxA = Math.max.apply(null, autres);
  return { lc: lc, maxA: maxA, plusLongue: lc > maxA, ratio: lc / Math.max(1, maxA), diff: lc - maxA };
}

/* ------------------------------------------------------------ chargement data */
function loadGlobal(file, nom) {
  var abs = path.join(ROOT, file);
  var code = fs.readFileSync(abs, "utf8");
  if (code.charCodeAt(0) === 0xfeff) code = code.slice(1);
  var bac = { window: {} };
  new Function("window", code)(bac.window);
  return bac.window[nom];
}
var DATA = loadGlobal("js/data.js", "SITE_DATA");
if (!DATA || !DATA.content) {
  console.error("ERREUR : js/data.js illisible.");
  process.exit(2);
}

/* --------------------------------------------------------------- mesures ---- */
function compter(t, re) {
  var m = t.match(re);
  return m ? m.length : 0;
}
/* Texte visible : on retire scripts, styles et balises, on decode le minimum. */
function texteVisible(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]*>/g, " ")
    .replace(/&[a-z]+;|&#\d+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}
/* Prose seule : on enleve AUSSI les blocs de code et les schemas, car un exemple
   partage entre deux lecons est legitime — c'est la PROSE recopiee qui pose
   probleme. */
function prose(html) {
  return texteVisible(
    html
      .replace(/<pre[\s\S]*?<\/pre>/gi, " ")
      .replace(/<svg[\s\S]*?<\/svg>/gi, " ")
      .replace(/<figure class="cheat-table"[\s\S]*?<\/figure>/gi, " ")
  );
}

function mesurerLecon(abs) {
  var t = fs.readFileSync(abs, "utf8");
  var jsonBlocs = t.match(/<script[^>]*type="application\/json"[^>]*data-(quiz|exos|quiz-bilan)[^>]*>([\s\S]*?)<\/script>/g) || [];
  var quiz = 0, exos = 0, bilan = 0;
  jsonBlocs.forEach(function (b) {
    var type = /data-quiz-bilan/.test(b) ? "bilan" : /data-exos/.test(b) ? "exos" : "quiz";
    var corps = b.replace(/<script[^>]*>/, "").replace(/<\/script>/, "");
    var v = null;
    try { v = JSON.parse(corps); } catch (e) {}
    var n = Array.isArray(v) ? v.filter(Boolean).length : 0;
    if (type === "quiz") quiz += n;
    else if (type === "exos") exos += n;
    else bilan += n;
    // A3 — biais de longueur : la bonne reponse est-elle devinable a sa taille ?
    if ((type === "quiz" || type === "bilan") && Array.isArray(v)) {
      v.forEach(function (item) {
        var r = biaisQuestion(item);
        if (!r) return;
        BIAIS.total++;
        if (r.plusLongue) BIAIS.plusLongue++;
        if (r.plusLongue && r.ratio >= BIAIS_RATIO && r.diff >= BIAIS_DIFF) {
          BIAIS.net++;
          BIAIS.pires.push({ abs: abs, q: String(item.q == null ? "" : item.q).slice(0, 66), lc: r.lc, maxA: r.maxA, ratio: r.ratio });
        }
      });
    }
  });
  var dts = (t.match(/<dl class="glossary"[\s\S]*?<\/dl>/i) || [""])[0];
  var callouts = t.match(/class="callout callout--([a-z]+)"/g) || [];
  var types = {};
  callouts.forEach(function (c) {
    var m = c.match(/callout--([a-z]+)/);
    if (m) types[m[1]] = (types[m[1]] || 0) + 1;
  });
  var vis = texteVisible(t);
  return {
    svg: compter(t, /<figure class="diagram"/g),
    casReel: /Cas r[ée]el/i.test(t) ? 1 : 0,
    callouts: callouts.length,
    typesCallout: Object.keys(types).length,
    cheat: compter(t, /<figure class="cheat-table"/g),
    glossaire: compter(dts, /<dt>/g),
    quiz: quiz,
    exos: exos,
    bilan: bilan,
    blocsCode: compter(t, /<figure class="code-block"/g),
    mots: vis ? vis.split(/\s+/).length : 0,
    prose: prose(t),
  };
}

/* --------------------------------------------------------------- parcours --- */
var lecons = [];
var parCours = {};
Object.keys(DATA.content).forEach(function (id) {
  if (COURS_FILTRE && id !== COURS_FILTRE) return;
  var c = DATA.content[id];
  var dir = c.dir || id;
  var liste = [];
  (c.modules || []).forEach(function (m) {
    (m.lessons || []).forEach(function (l) {
      if (!l || !l.file) return;
      var abs = path.join(ROOT, "pages", dir, l.file);
      if (!fs.existsSync(abs)) return;
      var mes = mesurerLecon(abs);
      mes.cours = id;
      mes.dir = dir;
      mes.file = l.file;
      mes.titre = l.title || "";
      lecons.push(mes);
      liste.push(mes);
    });
  });
  parCours[id] = liste;
});

if (!lecons.length) {
  console.error("Aucune lecon mesuree" + (COURS_FILTRE ? " pour le cours " + COURS_FILTRE : "") + ".");
  process.exit(2);
}

/* --------------------------------------------------------------- medianes --- */
function mediane(tab) {
  var t = tab.slice().sort(function (a, b) { return a - b; });
  var m = Math.floor(t.length / 2);
  return t.length % 2 ? t[m] : Math.round((t[m - 1] + t[m]) / 2);
}
var MED = {};
["svg", "callouts", "glossaire", "quiz", "exos", "mots", "blocsCode"].forEach(function (k) {
  MED[k] = mediane(lecons.map(function (l) { return l[k]; }));
});

/* ------------------------------------------------------- sous le standard --- */
var incompletes = [];
lecons.forEach(function (l) {
  var manques = [];
  Object.keys(STANDARD).forEach(function (k) {
    var s = STANDARD[k];
    if (l[k] < s.min) manques.push(s.libelle + " (" + l[k] + "/" + s.min + ")");
  });
  /* un seul type d'encadre repete n'est pas « des encadres varies » */
  if (l.callouts >= 2 && l.typesCallout < 2) manques.push("encadres tous du meme type");
  if (manques.length) incompletes.push({ l: l, manques: manques });
});

/* -------------------------------------------------------------- maigreur ---- */
/* Score de maigreur : combien de criteres sont sous la mediane du site. */
var maigres = lecons.map(function (l) {
  var sous = 0, detail = [];
  ["svg", "callouts", "glossaire", "quiz", "exos", "mots"].forEach(function (k) {
    if (l[k] < MED[k]) { sous++; detail.push(k + " " + l[k] + "<" + MED[k]); }
  });
  return { l: l, sous: sous, detail: detail };
}).filter(function (x) { return x.sous >= 4; })
  .sort(function (a, b) { return b.sous - a.sous || a.l.mots - b.l.mots; });

/* ------------------------------------------------------------ redondance ---- */
/* On compare les lecons DEUX A DEUX a l'interieur d'un meme cours. Comparer tout
   le site serait quadratique et sans objet : deux cours differents peuvent
   legitimement expliquer la meme notion. */
function plusLongCommun(a, b, seuil) {
  if (a.length < seuil || b.length < seuil) return 0;
  /* recherche par ancrage : on echantillonne des fenetres de `seuil` caracteres
     de A et on teste leur presence dans B. Suffisant pour du texte recopie. */
  var pas = Math.max(50, Math.floor(seuil / 4));
  for (var i = 0; i + seuil <= a.length; i += pas) {
    var f = a.substr(i, seuil);
    var j = b.indexOf(f);
    if (j !== -1) {
      /* on etend a gauche et a droite pour mesurer le vrai bloc */
      var g = 0;
      while (i - g > 0 && j - g > 0 && a[i - g - 1] === b[j - g - 1]) g++;
      var d = 0;
      while (i + seuil + d < a.length && j + seuil + d < b.length && a[i + seuil + d] === b[j + seuil + d]) d++;
      return seuil + g + d;
    }
  }
  return 0;
}
var redondances = [];
Object.keys(parCours).forEach(function (id) {
  var liste = parCours[id];
  for (var i = 0; i < liste.length; i++) {
    for (var j = i + 1; j < liste.length; j++) {
      var n = plusLongCommun(liste[i].prose, liste[j].prose, SEUIL_REDONDANCE);
      if (n >= SEUIL_REDONDANCE) {
        redondances.push({ cours: id, a: liste[i].file, b: liste[j].file, n: n });
      }
    }
  }
});
redondances.sort(function (a, b) { return b.n - a.n; });

/* ---------------------------------------------------------------- sortie ---- */
if (JSON_OUT) {
  console.log(JSON.stringify({
    medianes: MED,
    incompletes: incompletes.map(function (x) { return { cours: x.l.cours, file: x.l.file, titre: x.l.titre, manques: x.manques }; }),
    maigres: maigres.map(function (x) { return { cours: x.l.cours, file: x.l.file, titre: x.l.titre, sous: x.sous, detail: x.detail }; }),
    redondances: redondances,
    biaisQcm: { total: BIAIS.total, plusLongue: BIAIS.plusLongue, net: BIAIS.net, seuil: { ratio: BIAIS_RATIO, diff: BIAIS_DIFF } },
  }, null, 1));
  process.exit(incompletes.length && STRICT ? 1 : 0);
}

console.log("verif-contenu.js — " + lecons.length + " lecons" + (COURS_FILTRE ? " (cours " + COURS_FILTRE + ")" : "") + "\n");
console.log("MEDIANES DU SITE : " +
  ["svg", "callouts", "glossaire", "quiz", "exos", "mots"].map(function (k) { return k + " " + MED[k]; }).join(" · "));

if (!flag("maigres") && !flag("redondance")) {
  console.log("\n=== SOUS LE STANDARD EDITORIAL : " + incompletes.length + " lecon(s) ===");
  if (!incompletes.length) console.log("  aucune — toutes les lecons ont les elements obligatoires.");
  var parC = {};
  incompletes.forEach(function (x) { (parC[x.l.cours] = parC[x.l.cours] || []).push(x); });
  Object.keys(parC).sort().forEach(function (c) {
    console.log("\n  " + c + " (" + parC[c].length + ")");
    parC[c].slice(0, 6).forEach(function (x) {
      console.log("    " + x.l.file + "  " + x.manques.join(", "));
    });
    if (parC[c].length > 6) console.log("    … et " + (parC[c].length - 6) + " autre(s)");
  });
}

if (!flag("redondance")) {
  console.log("\n=== LES PLUS MAIGRES (au moins 4 criteres sous la mediane) : " + maigres.length + " ===");
  maigres.slice(0, 20).forEach(function (x) {
    console.log("  " + (x.l.cours + "/" + x.l.file).padEnd(30) + " " + x.sous + "/6 sous la mediane  " + x.detail.join(" · "));
  });
  if (maigres.length > 20) console.log("  … et " + (maigres.length - 20) + " autre(s)");
}

if (!flag("maigres")) {
  console.log("\n=== PROSE RECOPIEE entre deux lecons d'un meme cours (>= " + SEUIL_REDONDANCE + " car.) : " + redondances.length + " ===");
  if (!redondances.length) console.log("  aucune.");
  redondances.slice(0, 15).forEach(function (r) {
    console.log("  " + r.cours.padEnd(14) + " " + r.a + " <-> " + r.b + "   " + r.n + " caracteres");
  });
  if (redondances.length > 15) console.log("  … et " + (redondances.length - 15) + " autre(s)");
}

if (!flag("maigres") && !flag("redondance") && BIAIS.total) {
  var pct = (100 * BIAIS.plusLongue / BIAIS.total).toFixed(1);
  var pctNet = (100 * BIAIS.net / BIAIS.total).toFixed(1);
  console.log("\n=== BIAIS DE LONGUEUR DES QCM (avertissement, non bloquant) ===");
  console.log("  " + BIAIS.total + " questions · bonne reponse STRICTEMENT la plus longue : " + BIAIS.plusLongue + " (" + pct + " %)");
  console.log("  \"nettement\" la plus longue (>= " + BIAIS_RATIO + "x ET +" + BIAIS_DIFF + " car. sur le meilleur distracteur) : " + BIAIS.net + " (" + pctNet + " %)");
  console.log("  -> chantier editorial (b) = etoffer les distracteurs de ces " + BIAIS.net + " questions (ne PAS raccourcir la bonne reponse).");
  BIAIS.pires.sort(function (a, b) { return b.ratio - a.ratio; });
  console.log("  Les 10 plus flagrantes :");
  BIAIS.pires.slice(0, 10).forEach(function (p) {
    console.log("    " + path.relative(ROOT, p.abs).replace(/\\/g, "/").replace("pages/", "").padEnd(26) +
      " bonne " + p.lc + "c / distracteur max " + p.maxA + "c (x" + p.ratio.toFixed(1) + ")");
  });
  console.log("  Rappel : les options SONT melangees a l'affichage (shuffle Fisher-Yates, lecon.js) — la position ne trahit pas la reponse.");
}

console.log("\n" + (incompletes.length ? incompletes.length + " lecon(s) sous le standard" : "Toutes les lecons tiennent le standard") +
  " · " + maigres.length + " maigre(s) · " + redondances.length + " redondance(s)");
process.exit(STRICT && (incompletes.length || redondances.length) ? 1 : 0);
