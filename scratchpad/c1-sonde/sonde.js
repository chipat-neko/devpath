"use strict";
/* C1 (a) du CHANTIER-V18 : les trois indices du F4 du V16, mesurés sur le SITE ENTIER.
   On charge le corpus PAR l'outil (require), jamais une copie. Pour chaque marque :
   ÉCARTER (choisir parmi les options sans la marque), RESTREINDRE (parmi celles qui la
   portent), SEULE (l'unique option qui la porte). Taux = réussite moyenne (1/|choix|),
   couverture = part des questions où la marque tranche (ni absente, ni sur toutes),
   rendement = réussite sur les questions couvertes. Usage : node sonde.js [--detail] */
var path = require("path");
var M = require("D:/test-claude/tools/mesure-biais-qcm.js");
var corpus = M.lireCorpus();
var DETAIL = process.argv.indexOf("--detail") !== -1;
var RESTANTS = ["cloud", "reseaux", "wasm", "ml", "erlang", "ada", "llm", "fortran", "groovy", "patterns", "http",
  "graphql", "kubernetes", "cicd", "markdown", "distribue", "neurones", "formats", "regex", "compilation", "vscode", "offensive"];

var LD = "(?<![\\p{L}\\p{N}])", LF = "(?![\\p{L}\\p{N}])";
function mot(liste) { return new RegExp(LD + "(" + liste.join("|") + ")" + LF, "iu"); }

/* 1. L'INTENTION PRÊTÉE AU MOTEUR. */
var SUJETS = ["le moteur", "du moteur", "le navigateur", "le compilateur", "l'interpréteur", "l’interpréteur", "le runtime",
  "le système", "le noyau", "le serveur", "le processeur", "le JIT", "l'optimiseur", "l’optimiseur", "le ramasse-miettes",
  "le garbage collector", "le GC", "le planificateur", "l'ordonnanceur", "l’ordonnanceur", "le SGBD", "la base", "le framework",
  "la bibliothèque", "le langage", "Python", "JavaScript", "Java", "Rust", "Go", "Git", "Docker", "Kubernetes", "le modèle",
  "l'algorithme", "l’algorithme", "l'outil", "l’outil", "le linter", "TypeScript", "React", "Vue", "le shell", "le terminal",
  "l'éditeur", "l’éditeur", "VS Code", "la machine", "le réseau", "le routeur", "le DNS", "le cache", "le planner", "le CPU",
  "le build", "le gestionnaire", "l'OS", "l’OS", "le pilote", "il", "elle"];
var VERBES_INTENTION = ["décide", "décident", "choisit", "choisissent", "devine", "devinent", "préfère", "préfèrent", "veut", "veulent",
  "sait", "savent", "comprend", "comprennent", "cherche à", "essaie", "essaient", "tente", "tentent", "pense", "pensent",
  "croit", "croient", "juge", "jugent", "se souvient", "oublie", "oublient", "s'adapte", "s’adapte", "anticipe", "anticipent",
  "se rend compte", "s'aperçoit", "s’aperçoit", "se débrouille", "prend l'initiative", "prend l’initiative", "intelligemment",
  "tout seul", "toute seule", "de lui-même", "d'elle-même", "d’elle-même", "refuse de", "accepte de", "fait confiance"];
var INTENTION_VERBE = mot(VERBES_INTENTION);
function intentionStricte(t) {
  var s = String(t), m, re = new RegExp(LD + "(" + VERBES_INTENTION.join("|") + ")" + LF, "giu");
  while ((m = re.exec(s))) {
    var avant = s.slice(Math.max(0, m.index - 60), m.index).toLowerCase();
    for (var i = 0; i < SUJETS.length; i++) {
      var su = SUJETS[i].toLowerCase();
      var j = avant.lastIndexOf(su);
      if (j !== -1 && avant.length - j - su.length < 40) return true;
    }
  }
  return false;
}

/* 2. LES TICS RHÉTORIQUES (F4) : clause méta, glose finale entre parenthèses, « de son côté / , lui, »,
   bourrage « seul / direct ». */
var META = /c['’]est (ce|ceci|cela|ça|là) qui|c['’]est (là|ceci|cela|ça) que|voilà (ce|la|le|pourquoi|tout)|ce qui (sépare|distingue|fait la différence)|toute la différence|la nuance (est|tient)|d['’]où (le|la|l['’]|les)|c['’]est (ceci|cela|ça|là) (qui|que) (sépare|distingue|change)/iu;
var GLOSE = /\([^()]{3,}\)\s*[.!?…]?\s*$/;
var COTE = /de son côté|de leur côté|, (lui|elle|eux|elles)(,|\s)|quant à (lui|elle)/iu;
var BOURRAGE = mot(["seul", "seule", "seuls", "seules", "direct", "directe", "directs", "directes", "directement"]);
function tic(t) { return META.test(t) || GLOSE.test(t) || COTE.test(t) || BOURRAGE.test(t); }
function ticSansGlose(t) { return META.test(t) || COTE.test(t) || BOURRAGE.test(t); }

/* 3. LES ABSOLUS, motif RESTREINT (sans « rien » ni « n'existe pas », que des bonnes réponses portent). */
var ABS_R1 = mot(["toujours", "jamais", "uniquement", "seulement", "aucun", "aucune", "impossible", "obligatoirement",
  "systematiquement", "systématiquement", "tous les cas"]);
var ABS_R2 = mot(["toujours", "jamais", "impossible", "obligatoirement", "systématiquement", "systematiquement", "tous les cas",
  "forcément", "en aucun cas", "n'importe quel", "n'importe quelle", "n’importe quel", "n’importe quelle", "tout le temps",
  "à chaque fois", "absolument", "totalement", "entièrement", "complètement", "garanti", "garantit", "garantie", "sans exception"]);

var MARQUES = [
  ["intention (verbe seul)", function (t) { return INTENTION_VERBE.test(t); }],
  ["intention (sujet + verbe)", intentionStricte],
  ["tics (les quatre)", tic],
  ["tics (sans la glose)", ticSansGlose],
  ["  dont clause méta", function (t) { return META.test(t); }],
  ["  dont « de son côté / , lui, »", function (t) { return COTE.test(t); }],
  ["  dont bourrage seul/direct", function (t) { return BOURRAGE.test(t); }],
  ["absolus R1 (sans rien ni n'existe pas)", function (t) { return ABS_R1.test(t); }],
  ["absolus R2 (motif strict élargi)", function (t) { return ABS_R2.test(t); }],
];

function sans(q, porte) { var m = q.a.map(porte), n = m.filter(Boolean).length; if (n === 0 || n === q.a.length) return null; return q.a.map(function (_, i) { return i; }).filter(function (i) { return !m[i]; }); }
function avec(q, porte) { var m = q.a.map(porte), n = m.filter(Boolean).length; if (n === 0 || n === q.a.length) return null; return q.a.map(function (_, i) { return i; }).filter(function (i) { return m[i]; }); }
function seule(q, porte) { var m = q.a.map(porte); if (m.filter(Boolean).length !== 1) return null; return [m.indexOf(true)]; }
function mesurer(qs, porte, sens) {
  var succes = 0, couv = 0, succesCouv = 0, nbOpt = 0, marquees = 0, marqueesBonnes = 0;
  qs.forEach(function (q) {
    q.a.forEach(function (t, i) { nbOpt++; if (porte(t)) { marquees++; if (i === q.k) marqueesBonnes++; } });
    var c = sens(q, porte);
    var choix = c || M.toutes(q);
    var r = choix.indexOf(q.k) !== -1 ? 1 / choix.length : 0;
    succes += r;
    if (c) { couv++; succesCouv += r; }
  });
  return { taux: succes / qs.length, couv: couv / qs.length, rend: couv ? succesCouv / couv : 0, n: qs.length,
           marquees: marquees, partBonnes: marquees ? marqueesBonnes / marquees : 0 };
}
function pct(x) { return (100 * x).toFixed(1).replace(".", ",") + " %"; }

var parCours = {};
corpus.forEach(function (q) { (parCours[q.cours] = parCours[q.cours] || []).push(q); });
var restants = corpus.filter(function (q) { return RESTANTS.indexOf(q.cours) !== -1; });
var traites = corpus.filter(function (q) { return RESTANTS.indexOf(q.cours) === -1; });
console.log("corpus : " + corpus.length + " questions, " + Object.keys(parCours).length + " cours ; 22 restants : " + restants.length + " questions\n");
console.log("marque".padEnd(40) + "sens".padEnd(12) + "site".padStart(9) + "couv.".padStart(9) + "rend.".padStart(9) + "  restants".padStart(11) + "  traités".padStart(10) + "   options marquées (part bonnes)   pire cours");
MARQUES.forEach(function (mq) {
  [["ÉCARTER", sans], ["RESTREINDRE", avec], ["SEULE", seule]].forEach(function (s) {
    var site = mesurer(corpus, mq[1], s[1]), r = mesurer(restants, mq[1], s[1]), t = mesurer(traites, mq[1], s[1]);
    var pire = Object.keys(parCours).map(function (c) { return { c: c, m: mesurer(parCours[c], mq[1], s[1]) }; })
      .sort(function (a, b) { return b.m.taux - a.m.taux; });
    console.log(mq[0].padEnd(40) + s[0].padEnd(12) + pct(site.taux).padStart(9) + pct(site.couv).padStart(9) + pct(site.rend).padStart(9) +
      pct(r.taux).padStart(11) + pct(t.taux).padStart(10) + "   " + (site.marquees + " (" + pct(site.partBonnes) + ")").padEnd(30) +
      "   " + pire.slice(0, 3).map(function (p) { return p.c + " " + pct(p.m.taux); }).join(", "));
  });
});
if (DETAIL) {
  console.log("\nPar cours restant (ÉCARTER) :");
  RESTANTS.forEach(function (c) {
    if (!parCours[c]) return;
    console.log("  " + c.padEnd(12) + MARQUES.filter(function (m) { return !/^  /.test(m[0]); }).map(function (mq) { return mq[0].slice(0, 14) + " " + pct(mesurer(parCours[c], mq[1], sans).taux); }).join(" | "));
  });
}
