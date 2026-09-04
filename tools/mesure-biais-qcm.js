/* =============================================================================
   mesure-biais-qcm.js — de combien de QCM un apprenant vient-il a bout SANS RIEN
   SAVOIR, et par quel indice ?

   POURQUOI (point B1 du chantier V16). `verif-contenu.js` mesure depuis le V15 un
   seul indice : la bonne reponse est la plus LONGUE dans 88,8 % des questions. Le
   plan V16 exige de ne pas s'y fier seul, parce que corriger la longueur sans
   regarder le reste deplacerait le probleme au lieu de le regler : si la bonne
   reponse reste la seule a porter un tiret d'explication, ou la seule a ne pas
   affirmer « toujours », l'apprenant garde une methode qui marche.

   CE QU'IL MESURE. Chaque strategie est un APPRENANT QUI NE COMPREND RIEN et
   applique une regle mecanique sur le texte des options. Le taux rendu est sa
   reussite reelle sur le corpus, question par question.

   TROIS PRECAUTIONS DE MESURE, sans lesquelles les chiffres seraient faux :
     1. Les options sont MELANGEES a l'affichage (`shuffle` dans `js/lecon.js`,
        appele par `buildQuiz` pour les QCM de lecon ET les QCM bilan). La position
        de la bonne reponse dans le source — 98,8 % en premiere place — n'est donc
        PAS un indice exploitable. Elle est relevee a titre d'information, et
        marquee comme telle : c'est le genre de chiffre qui, sorti de son contexte,
        ferait croire a une faille inexistante.
     2. L'EX AEQUO n'est pas une reussite. Si deux options sont a egalite sur le
        critere, la strategie doit trancher, et elle tranche au hasard : on compte
        alors 1/n de succes, pas 1. Prendre « la premiere a egalite » gonflerait
        tous les taux, la bonne reponse etant premiere dans le source.
     3. Le HASARD sert d'etalon : sa reussite est l'esperance exacte (moyenne des
        1/n), pas une simulation. Un indice ne vaut d'etre corrige que s'il fait
        NETTEMENT mieux que le hasard.

   USAGE
     node tools/mesure-biais-qcm.js               # tableau des strategies
     node tools/mesure-biais-qcm.js --cours       # + le detail par cours
     node tools/mesure-biais-qcm.js --json        # meme mesure, en JSON
     node tools/mesure-biais-qcm.js --pire=20     # les N questions les plus devinables

   CODE DE SORTIE : toujours 0 — c'est une mesure, pas un verdict. Le verdict est
   l'affaire de `tools/verif-qcm-biais.js` (point B2).
   ============================================================================= */
"use strict";

var fs = require("fs");
var path = require("path");

var RACINE = path.join(__dirname, "..");
var PAGES = path.join(RACINE, "pages");
var JSON_MODE = process.argv.indexOf("--json") !== -1;
var PAR_COURS = process.argv.indexOf("--cours") !== -1;
var PIRE = (function () {
  var a = process.argv.filter(function (x) { return x.indexOf("--pire=") === 0; })[0];
  return a ? Number(a.slice(7)) || 10 : 0;
})();

/* ------------------------------------------------------------ le corpus, des SOURCES */
/* On lit les blocs `data-quiz` et `data-quiz-bilan` des lecons, et non
   `js/quiz-index.js` : l'index est un derive, et il en compte 16 de moins (6151
   contre 6167). Mesurer sur le derive laisserait 16 questions hors du controle. */
function lireCorpus() {
  var out = [];
  fs.readdirSync(PAGES, { withFileTypes: true }).forEach(function (d) {
    if (!d.isDirectory()) return;
    var dossier = path.join(PAGES, d.name);
    fs.readdirSync(dossier).forEach(function (f) {
      if (!/^lecon-\d+\.html$/.test(f)) return;
      var t = fs.readFileSync(path.join(dossier, f), "utf8");
      var blocs = t.match(/<script[^>]*type="application\/json"[^>]*data-(quiz|quiz-bilan)[^>]*>([\s\S]*?)<\/script>/g) || [];
      blocs.forEach(function (b) {
        if (/data-exos/.test(b)) return;
        var corps = b.replace(/<script[^>]*>/, "").replace(/<\/script>/, "");
        var v = null;
        try { v = JSON.parse(corps); } catch (e) { return; }
        if (!Array.isArray(v)) return;
        v.forEach(function (item) {
          if (!item || !Array.isArray(item.a) || item.a.length < 2) return;
          out.push({
            cours: d.name, fichier: f,
            bilan: /data-quiz-bilan/.test(b),
            q: String(item.q == null ? "" : item.q),
            a: item.a.map(function (x) { return String(x == null ? "" : x); }),
            k: Number(item.correct || 0),
          });
        });
      });
    });
  });
  return out;
}

/* ----------------------------------------------------------------- les strategies */
/* Chacune rend la LISTE des options qu'elle retient. Une liste de plusieurs
   elements est un ex aequo : la reussite comptee vaut alors 1 / taille. */

function longueurs(q) { return q.a.map(function (t) { return t.length; }); }
function argMax(vals) {
  var m = Math.max.apply(null, vals);
  return vals.reduce(function (acc, v, i) { if (v === m) acc.push(i); return acc; }, []);
}
function toutes(q) { return q.a.map(function (_, i) { return i; }); }

/* Le tiret d'explication : « — », « – », ou un « - » entoure d'espaces. C'est la
   marque typographique de la reponse qui s'explique elle-meme. */
function aTiret(t) { return /—|–| - |\(c'est-a-dire|, c'est-a-dire/.test(t); }

/* Les affirmations ABSOLUES sont la signature du distracteur expedie. Un
   apprenant qui les ecarte n'a rien compris mais elimine beaucoup. */
var ABSOLUS = /\b(toujours|jamais|uniquement|seulement|aucun|aucune|impossible|obligatoirement|systematiquement|systématiquement|rien|tous les cas|n'existe pas)\b/i;
/* Les formulations PRUDENTES, symetrie de la precedente. */
var PRUDENTS = /\b(souvent|generalement|généralement|en general|en général|peut|permet|selon|plutot|plutôt|principalement|notamment|le plus souvent)\b/i;

/* Les SIGLES du metier, ecartes de la mesure des capitales d'emphase : « HTML »
   ou « JSON » dans une option n'est pas un cri, c'est le nom de la chose. */
var SIGLES = /^(HTML|CSS|JS|JSON|DOM|API|URL|URI|HTTP|HTTPS|CORS|SQL|CLI|UI|UX|ID|IDE|CPU|GPU|RAM|SSD|DNS|TLS|SSL|CRUD|REST|RPC|GRPC|ORM|JWT|XSS|CSRF|SVG|PNG|JPEG|GIF|PDF|UTF|ASCII|BOM|LF|CRLF|OK|NASA|IEEE|ISO|RFC|MDN|ECMA|ES|NPM|CDN|CI|CD|TDD|BDD|DDD|MVC|MVVM|SPA|PWA|SEO|ARIA|WAI|WCAG|RGPD|GNU|POSIX|BSD|MIT|AWS|GCP|VM|OS|IO|FIFO|LIFO|LRU|TTL|UUID|MD|XML|YAML|TOML|CSV|AJAX|XHR|WEBP|WOFF|EOF|NAN|INF|TCP|UDP|IP|SSH|FTP|SMTP|IMAP|MQTT|GRAPHQL|SDK|JVM|LLVM|ASM|WASM|GC|JIT|AOT|OOP|FP|SOLID|DRY|KISS|YAGNI|A11Y|I18N|L10N|RGB|HSL|DPI|PPI|FPS|MS|KO|MO|GO|TO|BIT|OCTET|SI|IIFE|NEW|THIS|VAR|LET|CONST|NULL|TRUE|FALSE|GET|POST|PUT|PATCH|DELETE|HEAD|OPTIONS|SELECT|INSERT|UPDATE|FROM|WHERE|JOIN|GROUP|ORDER|BY|AND|OR|NOT|IN|IS|AS|ON|IF|ELSE|FOR|WHILE|DO|END|BEGIN|COMMIT|ROLLBACK|CASCADE|UNIQUE|INDEX|KEY|PRIMARY|FOREIGN|TABLE|VIEW|WITH|UNION|ALL|DISTINCT|LIMIT|OFFSET|CASE|WHEN|THEN|USING|SET|VALUES|INTO|CREATE|DROP|ALTER|GRANT|REVOKE|SHA|NET|PHP|REPL|JSX|SLO|SLI|ELT|ETL|LCP|CLS|FID|INP|TTFB|DSL|BEAM|CLR|PID|VPN|CMD|UTC|BFS|DFS|ERC|CVE|ACID|XOR|RSA|AES|HMAC|GIL|README|ARC|LLM|CSP|DAG|AST|ESM|ABC|SSR|SSG|SCSS|RAG|JDK|JRE|RAII|RTT|IQR|RBAC|ABAC|NFT|HCL|ADR|OOM|RPO|RTO|CSSOM|SDL|VBA|COBOL|SPARK|PVC|GFM|SCA|ARGV|LFS|DBI|DBD|GOOS|GOPATH|TIMESTAMPTZ|TIMESTAMP|ANN|PCA|SVM|GAN|RNN|CNN|OTP|MFA|SSO|LDAP|SAML|OIDC|CIDR|NAT|ARP|ICMP|MTU|QPS|RPS|SLA|KPI|ROI|MVP|POC|QA|UAT|SRE|NP|DP|PV|VB|VS|NA|PR|MR|BD|LD|NC|ML|IDENT|REX|TODO|JJ|MM|AAAA|EXPLAIN|ANALYZE|ROLLUP|TRUNCATE|HAVING|PIVOT|ENTRYPOINT|WORKDIR|DISPLAY|PERFORM|INSPECT|COMPUTE|OCCURS|STORAGE|WORKING|IDENTIFICATION|ENVIRONMENT|PROCEDURE|DIVISION|SECTION|DEFAULT|COLUMN|MERGE|INNER|LEFT|RIGHT|OUTER|DESC|ASC|COUNT|SUM|AVG|MIN|MAX|CHECK|ADD|READ|WRITE|CALL|MOVE|TIMES|REFERENCE|ARRAY|DEBUG|ERROR|DATA|RUN|ARG|ENV|PATH|HOME|TERM|EXIT|KILL|MUST|SHOULD|REWRITE|COMP|PIC|AT|NO)$/;

/* Les mots CRIES en capitales. Deux pieges corriges en B4 (cours python), tous
   deux mesures : (1) l'apostrophe etait acceptee comme lettre, si bien que « C'est »
   rendait le jeton « C' » et « L'option » le jeton « L' » — 880 des 2496 occurrences
   relevees sur le site, soit 35 % du signal, etaient des majuscules de DEBUT DE PHRASE
   suivies d'une elision, et non des cris ; (2) la limite \b de JavaScript est ASCII,
   donc « DEJA » accentue etait coupe apres le J. On exige donc deux LETTRES capitales
   consecutives, sans lettre autour. */
var CAPITALES = /(?<![\p{L}\p{N}])[\p{Lu}][\p{Lu}\p{N}]+(?![\p{L}])/gu;

var STRATEGIES = [
  {
    nom: "hasard (etalon)",
    quoi: "clique n'importe ou",
    choisir: toutes,
  },
  {
    nom: "la plus longue",
    quoi: "la reponse qui compte le plus de caracteres",
    choisir: function (q) { return argMax(longueurs(q)); },
  },
  {
    nom: "la seule avec un tiret",
    quoi: "la seule option qui porte un tiret d'explication",
    choisir: function (q) {
      var s = q.a.reduce(function (acc, t, i) { if (aTiret(t)) acc.push(i); return acc; }, []);
      return s.length ? s : toutes(q);
    },
  },
  {
    nom: "ecarter les absolus",
    quoi: "eliminer toute option qui dit « toujours », « jamais », « uniquement »…",
    choisir: function (q) {
      var s = q.a.reduce(function (acc, t, i) { if (!ABSOLUS.test(t)) acc.push(i); return acc; }, []);
      return s.length ? s : toutes(q);
    },
  },
  {
    nom: "la plus prudente",
    quoi: "l'option qui nuance (« souvent », « permet », « selon »)",
    choisir: function (q) {
      var s = q.a.reduce(function (acc, t, i) { if (PRUDENTS.test(t)) acc.push(i); return acc; }, []);
      return s.length ? s : toutes(q);
    },
  },
  {
    nom: "la plus detaillee",
    quoi: "l'option qui compte le plus de virgules et de deux-points",
    choisir: function (q) {
      return argMax(q.a.map(function (t) { return (t.match(/[,:;]/g) || []).length; }));
    },
  },
  {
    nom: "le mot technique exclusif",
    quoi: "l'option seule a porter un mot long qu'aucune autre n'emploie",
    choisir: function (q) {
      var mots = q.a.map(function (t) {
        return new Set((t.toLowerCase().match(/[a-zà-ÿ][a-zà-ÿ-]{8,}/g) || []));
      });
      var score = mots.map(function (s, i) {
        var n = 0;
        s.forEach(function (m) {
          var ailleurs = mots.some(function (o, j) { return j !== i && o.has(m); });
          if (!ailleurs) n++;
        });
        return n;
      });
      return argMax(score);
    },
  },
  {
    /* AJOUTE EN B4 (2026-09-04). B1 avait cru faire le tour des indices et en a
       manque un qui est le DEUXIEME du site : l'incise entre parentheses, portee
       par la seule bonne reponse. Mesuree apres coup sur les 6 167 questions :
       59,2 %. Six relecteurs adversariaux du lot `js` l'ont signalee sans se
       concerter, et aucun des huit indices de B1 ne la voyait. On ne compte pas
       les parentheses d'appel de fonction — `f()`, `map()` — mais les incises
       d'au moins quatre caracteres, celles qui expliquent. */
    nom: "l'incise entre parentheses",
    quoi: "l'option qui glisse le plus d'explications entre parentheses",
    choisir: function (q) {
      return argMax(q.a.map(function (t) { return (t.match(/\([^)]{4,}\)/g) || []).length; }));
    },
  },
  {
    /* AJOUTE EN B4. Meme angle mort : la bonne reponse est souvent la seule a
       CRIER un mot. Les sigles du metier (HTML, JSON, DOM...) ne sont pas des
       emphases : sans cette exclusion la mesure ne voudrait rien dire. */
    nom: "la MAJUSCULE d'emphase",
    quoi: "l'option seule a crier un mot en capitales",
    choisir: function (q) {
      return argMax(q.a.map(function (t) {
        return (t.match(CAPITALES) || []).filter(function (w) {
          return !SIGLES.test(w.replace(/'/g, ""));
        }).length;
      }));
    },
  },
  {
    nom: "l'echo de la question",
    quoi: "l'option qui reprend le plus de mots de l'enonce",
    choisir: function (q) {
      var enonce = new Set((q.q.toLowerCase().match(/[a-zà-ÿ][a-zà-ÿ-]{3,}/g) || []));
      return argMax(q.a.map(function (t) {
        var n = 0;
        (new Set((t.toLowerCase().match(/[a-zà-ÿ][a-zà-ÿ-]{3,}/g) || []))).forEach(function (m) {
          if (enonce.has(m)) n++;
        });
        return n;
      }));
    },
  },
  {
    nom: "COMBINE : tiret puis longueur",
    quoi: "le tiret d'abord, la longueur pour departager — la methode d'un tricheur",
    choisir: function (q) {
      var s = q.a.reduce(function (acc, t, i) { if (aTiret(t)) acc.push(i); return acc; }, []);
      var cand = s.length ? s : toutes(q);
      var lg = cand.map(function (i) { return q.a[i].length; });
      var m = Math.max.apply(null, lg);
      return cand.filter(function (i) { return q.a[i].length === m; });
    },
  },
];

/* ---------------------------------------------------------------------- la mesure */
var corpus = lireCorpus();
if (!corpus.length) { console.error("aucune question trouvee sous pages/ — mesure impossible"); process.exit(2); }

var resultats = STRATEGIES.map(function (s) {
  var succes = 0, exaequo = 0, francs = 0;
  corpus.forEach(function (q) {
    var choix = s.choisir(q);
    if (!choix.length) choix = toutes(q);
    if (choix.length > 1) exaequo++;
    if (choix.indexOf(q.k) !== -1) {
      succes += 1 / choix.length;
      if (choix.length === 1) francs++;
    }
  });
  return { nom: s.nom, quoi: s.quoi, taux: succes / corpus.length,
    francs: francs / corpus.length, exaequo: exaequo / corpus.length };
});

/* Le biais POSITIONNEL, pour information seulement : les options sont melangees
   a l'affichage, donc ce chiffre ne decrit pas ce que l'apprenant peut exploiter. */
var positions = {};
corpus.forEach(function (q) { positions[q.k] = (positions[q.k] || 0) + 1; });

/* Par cours : le taux de la meilleure strategie exploitable (hors etalon). */
var parCours = {};
corpus.forEach(function (q) { (parCours[q.cours] = parCours[q.cours] || []).push(q); });
var coursMesure = Object.keys(parCours).map(function (c) {
  var qs = parCours[c];
  var best = { nom: "", taux: -1 };
  var parStrategie = {};
  STRATEGIES.slice(1).forEach(function (s) {
    var succes = 0;
    qs.forEach(function (q) {
      var choix = s.choisir(q); if (!choix.length) choix = toutes(q);
      if (choix.indexOf(q.k) !== -1) succes += 1 / choix.length;
    });
    var t = succes / qs.length;
    parStrategie[s.nom] = t;
    if (t > best.taux) best = { nom: s.nom, taux: t };
  });
  var lg = 0;
  qs.forEach(function (q) {
    var choix = argMax(longueurs(q));
    if (choix.indexOf(q.k) !== -1) lg += 1 / choix.length;
  });
  return { cours: c, questions: qs.length, longueur: lg / qs.length,
    meilleure: best.nom, taux: best.taux, parStrategie: parStrategie };
}).sort(function (a, b) { return b.taux - a.taux; });

/* Les questions les plus devinables : combien de strategies exploitables tombent
   sur la bonne reponse SANS ex aequo. Une question que 6 indices sur 8 trahissent
   n'a plus rien d'une question. */
var pires = corpus.map(function (q) {
  var n = 0, quels = [];
  STRATEGIES.slice(1).forEach(function (s) {
    var choix = s.choisir(q); if (!choix.length) choix = toutes(q);
    if (choix.length === 1 && choix[0] === q.k) { n++; quels.push(s.nom); }
  });
  return { cours: q.cours, fichier: q.fichier, q: q.q.slice(0, 60), n: n, quels: quels };
}).sort(function (a, b) { return b.n - a.n; });

function pct(x) { return (x * 100).toFixed(1) + " %"; }

if (JSON_MODE) {
  console.log(JSON.stringify({
    questions: corpus.length, strategies: resultats, positions: positions,
    parCours: coursMesure, pires: pires.slice(0, PIRE || 20),
  }, null, 2));
  process.exit(0);
}

console.log("mesure-biais-qcm — " + corpus.length + " questions (" +
  corpus.filter(function (q) { return q.bilan; }).length + " en QCM bilan) sur " +
  Object.keys(parCours).length + " cours\n");
console.log("  Reussite d'un apprenant qui ne comprend RIEN et applique une regle mecanique :\n");
console.log("    strategie                        reussite   sans ex aequo   ex aequo");
resultats.forEach(function (r) {
  console.log("    " + (r.nom + "                                 ").slice(0, 32) +
    " " + ("       " + pct(r.taux)).slice(-8) +
    "   " + ("       " + pct(r.francs)).slice(-8) +
    "      " + ("      " + pct(r.exaequo)).slice(-7));
});
console.log("\n  Lecture : « sans ex aequo » = la strategie a designe UNE option, et c'etait la bonne.");
console.log("  Un indice ne vaut d'etre corrige que s'il depasse nettement l'etalon du hasard (" +
  pct(resultats[0].taux) + ").");

console.log("\n  POUR INFORMATION, et surtout pas comme une faille : la bonne reponse est en position");
console.log("  " + JSON.stringify(positions) + " dans le SOURCE — mais `js/lecon.js` melange les options");
console.log("  a l'affichage (shuffle, dans buildQuiz, pour les QCM de lecon comme pour les bilans),");
console.log("  donc la position n'est pas exploitable par l'apprenant.");

var repartition = { "0-2": 0, "3-4": 0, "5+": 0 };
pires.forEach(function (p) {
  if (p.n >= 5) repartition["5+"]++; else if (p.n >= 3) repartition["3-4"]++; else repartition["0-2"]++;
});
console.log("\n  Nombre d'indices qui trahissent une meme question (sur 8 strategies) :");
console.log("    0 a 2 indices : " + repartition["0-2"] + "   3 ou 4 : " + repartition["3-4"] +
  "   5 et plus : " + repartition["5+"] + " (" + pct(repartition["5+"] / corpus.length) + ")");

if (PAR_COURS) {
  console.log("\n  Par cours, du plus devinable au moins (meilleure strategie exploitable) :\n");
  console.log("    cours                questions   longueur   meilleure strategie");
  coursMesure.forEach(function (c) {
    console.log("    " + (c.cours + "                    ").slice(0, 20) +
      " " + ("      " + c.questions).slice(-9) +
      "   " + ("       " + pct(c.longueur)).slice(-8) +
      "   " + pct(c.taux) + "  " + c.meilleure);
  });
}

if (PIRE) {
  console.log("\n  Les " + PIRE + " questions les plus devinables :\n");
  pires.slice(0, PIRE).forEach(function (p) {
    console.log("    " + p.n + " indices  " + p.cours + "/" + p.fichier + "  « " + p.q + " »");
    console.log("              " + p.quels.join(", "));
  });
}
process.exit(0);
