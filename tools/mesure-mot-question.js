/* mesure-mot-question.js — L'INTRUS LEXICAL, mesure a la granularite de LA QUESTION.
 *
 * TROUVE LE 2026-09-10, par la relecture adversariale du cours `typescript` (B4 du
 * CHANTIER-V16), et il est ne d'un ANGLE MORT DE NOTRE PROPRE OUTIL.
 *
 * `tools/mesure-mot-fetiche.js` — ecrit la veille, apres le cours `swift` — agrege par
 * MOT sur le cours entier, et n'alerte qu'au-dela de DEUX seuils : le mot doit trancher
 * sur >= 8 questions ET rendre >= 28 %. Ces seuils sont justes pour ce qu'il mesure : ils
 * evitent de crier sur un mot rare. Mais ils rendent l'outil AVEUGLE au cas ou un mot
 * tranche une SEULE question -- et l'y tranche a 100 %.
 *
 * LA MESURE QUI L'A PROUVE : sur `typescript`, `mesure-mot-fetiche` rendait « 0 alerte »
 * pendant que cinq relecteurs adversariaux trouvaient, chacun de son cote, SEPT questions
 * ou un mot etait porte par les TROIS distracteurs et absent de la bonne reponse :
 * « tuple », « produit », « deux », « patron », « (voir X) », « toute erreur », « typage ».
 * Sur chacune, l'apprenant qui ECARTE les trois options qui partagent le mot trouve la
 * bonne reponse SANS RIEN CONNAITRE. Zero alerte, sept questions ouvertes.
 *
 * C'est la meme famille de faute que « la colonne reussite NOIE les indices rares »
 * (cours `doc`, colonne RENDEMENT ajoutee) : un seuil concu pour reduire le bruit finit
 * par cacher le signal. La parade est la meme -- ne pas relever le seuil, CHANGER DE
 * GRANULARITE.
 *
 * LA STRATEGIE MESUREE, dite de L'INTRUS LEXICAL, en deux lectures :
 *   PAR DEFAUT : trois options partagent un mot, la quatrieme ne l'a pas -> cocher la
 *                quatrieme. C'est la lecture que les relecteurs ont trouvee.
 *   PAR EXCES  : une option porte un mot qu'aucune des trois autres n'a -> la cocher.
 * Et CHACUNE se lit dans les deux sens (cocher l'option designee, ou l'ECARTER et tirer
 * parmi les autres), d'ou les quatre colonnes. Voir l'avertissement sur la cible, plus
 * bas : c'est la COUVERTURE qui doit tomber a zero, pas le taux qui doit valoir 25 %.
 * Quand plusieurs options sont designees, le credit vaut 1/n comme partout dans ce
 * protocole ; la colonne rendue est GLOBALE (hasard a 25 % sur les questions non
 * tranchees), donc directement comparable a l'etalon de 25,0 %.
 *
 * ⚠ CE QUE CET OUTIL NE DIT PAS. Un mot-outil commun a trois options par pur hasard
 * declenche la meme lecture qu'un mot fabrique par la vague d'ecriture : la mesure ne
 * distingue pas l'intention. C'est pourquoi le seuil de longueur des mots est reglable
 * (--min=N) et vaut 5 par defaut : en dessous, les articles et les auxiliaires noient
 * tout. La liste `--liste` sert a JUGER question par question, la mesure a decider.
 *
 * ⚠⚠ CE QUE LA MESURE A REPONDU A LA QUESTION « EST-CE NOUS QUI LE FABRIQUONS ? »
 * L'hypothese naturelle etait que la vague d'ecriture cree l'indice, comme elle cree le
 * mot fetiche. LE CALCUL DIT NON, ET IL DIT MIEUX QUE CA :
 *
 *              cours          questions   en alerte   questions sures
 *   TRAITES par B4    36         3 011           4       200  (6,64 %)
 *   NON traites       54         2 972          30       174  (5,85 %)
 *   ecart 0,79 point · z = 1,258 · p = 0,208 -> NON SIGNIFICATIF au seuil de 5 %
 *
 * Le traitement ferme donc l'indice AU NIVEAU DU COURS -- 4 cours en alerte sur 36
 * traites contre 30 sur 54 -- et ne change RIEN au nombre de questions individuellement
 * ouvertes a 100 %. Nos 44 outils rabotent la MOYENNE du cours et laissent la QUESTION
 * intacte. Ce n'est pas que le chantier fabrique l'indice : c'est qu'il ne l'atteint pas.
 * C'est la raison d'etre de cet outil-ci, et la raison pour laquelle sa colonne « sures »
 * compte plus que sa colonne « taux ».
 *
 * ⚠⚠⚠ LA CIBLE N'EST PAS « TAUX A 25 % », C'EST « COUVERTURE A ZERO ». Et cet outil
 * l'a appris a ses depens, une heure apres avoir ete ecrit.
 *
 * Premiere version : deux colonnes, DEFAUT et EXCES, sens direct seulement. Sur
 * `typescript` elle voyait 5 questions « sures » ; une vague de correction les a
 * fermees, et la colonne est passee de 24,1 % a 8,1 % avec 0 question sure. Tout vert.
 * SAUF QUE 8,1 % EST TRES EN DESSOUS DE L'ETALON, et une strategie qui se trompe
 * presque toujours est une strategie qu'il suffit d'INVERSER : l'apprenant qui ECARTE
 * l'option designee et tire parmi les trois autres montait a 34,6 %, au-dessus du
 * seuil d'alerte. Les correcteurs n'avaient pas ferme l'indice, ils l'avaient RETOURNE.
 *
 * C'est mot pour mot la lecon du cours `mobile` (« fermer un indice A FOND le
 * RETOURNE ») et celle du cours `lua` (« une inegalite laisse toujours une lecture
 * exploitable ; seule l'egalite ferme »). Un cliquet qui ne surveille qu'un SENS est
 * vert pendant que la faille est entiere -- et celui-ci, ecrit par quelqu'un qui
 * connaissait ces deux lecons, les a quand meme repetees. D'ou les QUATRE colonnes.
 *
 * LA CONSEQUENCE POUR L'ECRITURE : viser 25 % sur le taux ne suffit pas, parce que le
 * taux se regle en DEPLACANT quelle option est l'intrus. Il faut qu'il n'y ait PLUS
 * D'INTRUS DU TOUT : chaque mot porte par 0, 2 ou 4 options des quatre -- jamais par
 * 1, jamais par 3. C'est la COUVERTURE qui doit tomber a zero, et c'est la seule
 * cible qui ferme les quatre lectures a la fois.
 *
 * LA REGLE D'ECRITURE QUI FERME L'INDICE est celle des marques, du `k` et du mot
 * fetiche : par mot, les quatre options le portent, ou aucune. ⚠ Quand c'est la BONNE
 * reponse qui porte le mot (elle est intouchable), on l'AJOUTE aux distracteurs.
 *
 * Usage :
 *   node tools/mesure-mot-question.js <cours> [--min=5] [--liste|--plan]
 *   node tools/mesure-mot-question.js --tous [--min=5]      # tous les cours, tri decroissant
 */
"use strict";
var fs = require("fs"), path = require("path");
var RACINE = path.join(__dirname, "..");

var argv = process.argv.slice(2);
var TOUS = argv.indexOf("--tous") !== -1;
var LISTE = argv.indexOf("--liste") !== -1;
var MIN = 5;
argv.forEach(function (a) { var m = /^--min=(\d+)$/.exec(a); if (m) MIN = Number(m[1]); });
var COURS = argv.filter(function (a) { return a.charAt(0) !== "-"; })[0] || null;
var PLAN = argv.indexOf("--plan") !== -1;

var SEUIL = 0.28;   /* au-dela, la lecture est exploitable — meme seuil que mot-fetiche */

function questionsDe(cours) {
  var dossier = path.join(RACINE, "pages", cours), out = [];
  if (!fs.existsSync(dossier)) return out;
  fs.readdirSync(dossier).sort().forEach(function (f) {
    if (!/\.html$/.test(f)) return;
    var src = fs.readFileSync(path.join(dossier, f), "utf8");
    var rx = /<script type="application\/json" data-quiz(?:-bilan)?>([\s\S]*?)<\/script>/g, x;
    while ((x = rx.exec(src))) {
      try {
        JSON.parse(x[1]).forEach(function (q) {
          /* >= 3 options : a deux, « le mot que l'autre n'a pas » designe les deux
             lectures a la fois et la mesure degenere. `mesure-biais-qcm` accepte
             `a.length >= 2` : c'est TOUTE la difference entre ses 6 151 questions et
             les 5 983 d'ici. L'ecart est explique, pas subi. */
          if (q && Array.isArray(q.a) && q.a.length >= 3 && typeof q.correct === "number") {
            out.push({ q: q, f: f });
          }
        });
      } catch (e) { /* un bloc JSON invalide est signale par verif-donnees, pas ici */ }
    }
  });
  return out;
}

/* Les mots d'une option, en minuscules, sans accent perdu : le seuil MIN porte sur le
   nombre de lettres, un accent compte pour une lettre. */
function mots(t, min) {
  var l = String(t).toLowerCase().match(/[a-zà-ÿ][a-zà-ÿ-]*/g) || [];
  var s = new Set();
  l.forEach(function (m) { if (m.length >= min) s.add(m); });
  return s;
}

/* Pour une question, les options designees par chaque lecture.
   DEFAUT : il existe un mot porte par exactement 3 options -> la 4e est designee.
   EXCES  : il existe un mot porte par exactement 1 option  -> celle-la est designee. */
function intrus(opts, min) {
  var n = opts.length;
  var jeux = opts.map(function (o) { return mots(o, min); });
  var compte = new Map();
  jeux.forEach(function (s, i) {
    s.forEach(function (m) {
      if (!compte.has(m)) compte.set(m, []);
      compte.get(m).push(i);
    });
  });
  var parDefaut = new Set(), parExces = new Set(), motsD = [], motsE = [];
  compte.forEach(function (ou, m) {
    if (ou.length === n - 1) {
      for (var i = 0; i < n; i++) if (ou.indexOf(i) === -1) { parDefaut.add(i); motsD.push(m); }
    } else if (ou.length === 1) {
      parExces.add(ou[0]); motsE.push(m);
    }
  });
  return { defaut: [...parDefaut], exces: [...parExces], motsD: motsD, motsE: motsE };
}

function mesurer(cours) {
  var qs = questionsDe(cours);
  var res = {
    cours: cours, questions: qs.length,
    defaut: { credit: 0, creditInv: 0, tranchees: 0, sures: 0, suresInv: 0 },
    exces: { credit: 0, creditInv: 0, tranchees: 0, sures: 0, suresInv: 0 },
    detail: []
  };
  qs.forEach(function (e) {
    var q = e.q, r = intrus(q.a, MIN);
    ["defaut", "exces"].forEach(function (sens) {
      var d = r[sens];
      var h = 1 / q.a.length;
      if (!d.length || d.length === q.a.length) {
        res[sens].credit += h; res[sens].creditInv += h; return;
      }
      res[sens].tranchees++;
      if (d.indexOf(q.correct) !== -1) {
        res[sens].credit += 1 / d.length;
        if (d.length === 1) res[sens].sures++;
      }
      /* LECTURE INVERSE : ECARTER les options designees et tirer parmi le reste.
         Elle s'ouvre EXACTEMENT quand on ferme la directe a fond -- lecon du cours
         `mobile`. Un cliquet qui ne surveille qu'un SENS est vert pendant que la
         faille est entiere. */
      var reste = q.a.length - d.length;
      if (reste > 0 && d.indexOf(q.correct) === -1) res[sens].creditInv += 1 / reste;
      if (reste === 1 && d.indexOf(q.correct) === -1) res[sens].suresInv++;
    });
    if (LISTE) {
      var sur = [];
      if (r.defaut.length === 1 && r.defaut[0] === q.correct) sur.push("DEFAUT");
      if (r.exces.length === 1 && r.exces[0] === q.correct) sur.push("EXCES");
      if (sur.length) {
        res.detail.push({
          f: e.f, q: String(q.q).slice(0, 52), sens: sur.join("+"),
          mots: (sur.indexOf("DEFAUT") !== -1 ? r.motsD : r.motsE).slice(0, 6)
        });
      }
    }
  });
  ["defaut", "exces"].forEach(function (s) {
    res[s].taux = qs.length ? res[s].credit / qs.length : 0;
    res[s].tauxInv = qs.length ? res[s].creditInv / qs.length : 0;
    res[s].couverture = qs.length ? res[s].tranchees / qs.length : 0;
  });
  return res;
}

function pct(x) { return (x * 100).toFixed(1).replace(".", ",") + " %"; }

function tousLesCours() {
  var d = path.join(RACINE, "pages");
  return fs.readdirSync(d).filter(function (n) {
    return fs.statSync(path.join(d, n)).isDirectory() &&
           fs.readdirSync(path.join(d, n)).some(function (f) { return /^lecon-\d+\.html$/.test(f); });
  }).sort();
}

/* MODE --plan : ce qu'il faut ECRIRE pour fermer les quatre lectures. La cible n'est
   pas un taux, c'est l'absence d'intrus : chaque mot porte par 0, 2 ou 4 options des
   quatre, jamais par 1 (EXCES tranche), jamais par 3 (DEFAUT tranche). Comme la bonne
   reponse est INTOUCHABLE, la manoeuvre est toujours sur un distracteur :
     mot sur 3 options -> le RETIRER d'un porteur, ou l'AJOUTER au quatrieme ;
     mot sur 1 option  -> l'AJOUTER a une deuxieme, ou le RETIRER de la seule. */
if (PLAN) {
  var qsP = questionsDe(COURS || "typescript");
  console.log("");
  console.log("PLAN DE FERMETURE DE L'INTRUS LEXICAL — " + (COURS || "typescript"));
  console.log("  cible : plus aucun mot porte par exactement 1 ou 3 options sur 4.");
  console.log("  la BONNE reponse est intouchable : agir toujours sur un distracteur.");
  console.log("");
  var totM = 0, totQ = 0;
  qsP.forEach(function (e, idx) {
    var q = e.q, n = q.a.length;
    var jeux = q.a.map(function (o) { return mots(o, MIN); });
    var compte = new Map();
    jeux.forEach(function (st, i) {
      st.forEach(function (m) {
        if (!compte.has(m)) compte.set(m, []);
        compte.get(m).push(i);
      });
    });
    var trois = [], un = [];
    compte.forEach(function (ou, m) {
      if (ou.length === n - 1) trois.push({ m: m, ou: ou });
      else if (ou.length === 1) un.push({ m: m, ou: ou });
    });
    /* ⚠ NE LISTER QUE CE QUI TRANCHE VRAIMENT. Un mot porte par UNE option ne tranche
       pas si, sur la meme question, d'autres mots isolent chacune des autres options :
       la lecture designe alors les quatre et ne dit plus rien. Un premier jet de ce
       mode listait 1 131 mots sur 65 questions, dont l'immense majorite etaient inertes
       -- c'est-a-dire une consigne d'ecriture impossible a suivre, donc inutile. On ne
       garde donc que les questions ou une lecture designe UNE SEULE option. */
    var r = intrus(q.a, MIN);
    /* ⚠ SECOND AFFINAGE, apprts sur `typescript` : ne garder que les questions ou UNE
       SEULE option est designee etait encore trop etroit. Apres la vague de rattrapage,
       le plan tombait a ZERO alors que la lecture INVERSE rendait encore 30,9 % : il
       restait 18 questions ou DEUX options sont designees, et ou la bonne est DEHORS
       dans 17 cas sur 18 -- l'apprenant ecarte les deux et joue a pile ou face. On
       garde donc toute question ou la lecture TRANCHE, c'est-a-dire ou l'ensemble
       designe n'est ni vide ni complet. C'est la couverture qu'il faut annuler. */
    var trancheD = r.defaut.length > 0 && r.defaut.length < n;
    var trancheE = r.exces.length > 0 && r.exces.length < n;
    if (!trancheD && !trancheE) return;
    trois = trancheD ? trois : [];
    un = trancheE ? un : [];
    if (!trois.length && !un.length) return;
    totQ++;
    console.log("  " + e.f + "  q" + (idx + 1) + "  (bonne reponse = option " + q.correct + ")");
    trois.forEach(function (t) {
      var manque = -1;
      for (var i = 0; i < n; i++) if (t.ou.indexOf(i) === -1) manque = i;
      totM++;
      console.log("      3/4 « " + t.m + " » manque a l'option " + manque +
        (manque === q.correct
          ? "  [LA BONNE] -> RETIRER le mot d'UN des distracteurs " + t.ou.join("/")
          : "  -> AJOUTER le mot a l'option " + manque + ", ou le RETIRER d'un porteur"));
    });
    un.forEach(function (u) {
      totM++;
      console.log("      1/4 « " + u.m + " » n'est que sur l'option " + u.ou[0] +
        (u.ou[0] === q.correct
          ? "  [LA BONNE] -> AJOUTER le mot a un distracteur"
          : "  -> le RETIRER, ou l'AJOUTER a une deuxieme option"));
    });
  });
  console.log("");
  console.log("  " + totM + " mot(s) a traiter sur " + totQ + " question(s) qui TRANCHENT,");
  console.log("  pour " + qsP.length + " questions au total. Les autres configurations 1/4 et 3/4");
  console.log("  sont inertes : d'autres mots y designent deja les autres options.");
  console.log("");
  process.exit(0);
}

console.log("");
console.log("mesure-mot-question — L'INTRUS LEXICAL, question par question");
console.log("  mots de " + MIN + " lettres et plus · etalon du hasard : 25,0 % · alerte a " + pct(SEUIL));
console.log("  DEFAUT = trois options partagent un mot, cocher la quatrieme");
console.log("  EXCES  = une option porte un mot que nul autre n'a, la cocher");
console.log("");

var liste = TOUS ? tousLesCours() : [COURS || "typescript"];
var lignes = liste.map(mesurer).filter(function (r) { return r.questions > 0; });
lignes.sort(function (a, b) { return Math.max(b.defaut.taux, b.exces.taux) - Math.max(a.defaut.taux, a.exces.taux); });

console.log("    cours            quest.   DEFAUT direct/INVERSE/sures    EXCES direct/INVERSE/sures");
var alertes = 0;
lignes.forEach(function (r) {
  var pire = Math.max(r.defaut.taux, r.exces.taux, r.defaut.tauxInv, r.exces.tauxInv);
  if (pire >= SEUIL) alertes++;
  console.log("    " + (r.cours + "                ").slice(0, 16) +
    ("      " + r.questions).slice(-6) + "   " +
    ("       " + pct(r.defaut.taux)).slice(-8) + " /" +
    ("       " + pct(r.defaut.tauxInv)).slice(-8) + " /" + ("    " + r.defaut.sures).slice(-4) + "   " +
    ("       " + pct(r.exces.taux)).slice(-8) + " /" +
    ("       " + pct(r.exces.tauxInv)).slice(-8) + " /" + ("    " + r.exces.sures).slice(-4) +
    (pire >= SEUIL ? "  <-- exploitable" : ""));
});

if (LISTE) {
  console.log("");
  console.log("  LES QUESTIONS OU LA LECTURE DESIGNE LA BONNE REPONSE ET ELLE SEULE :");
  lignes.forEach(function (r) {
    r.detail.forEach(function (d) {
      console.log("    " + d.f + "  [" + d.sens + "]  " + d.q);
      console.log("        mot(s) en cause : " + d.mots.join(", "));
    });
    if (!r.detail.length) console.log("    " + r.cours + " : aucune.");
  });
}

console.log("");
console.log("  " + alertes + " cours au-dessus de " + pct(SEUIL) + " sur au moins une des deux lectures.");
console.log("  Cible d'ecriture : par mot, les quatre options le portent ou aucune.");
console.log("  ⚠ Cet outil voit ce que mesure-mot-fetiche ne peut pas voir : un mot qui");
console.log("  tranche UNE seule question y rend 100 %, mais reste sous ses deux seuils");
console.log("  (>= 8 questions tranchees ET >= 28 %). Les deux outils sont complementaires.");
console.log("");

process.exit(0);
