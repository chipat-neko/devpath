/*
   plan-rangs-qcm.js — le PLAN de reecriture des longueurs d'un QCM, question par question.

   Ecrit pour le point B4 du CHANTIER-V16, apres la decouverte du 2026-09-05 :
   ecraser la strategie « la plus longue » ne ferme pas le biais, elle le DEPLACE
   d'un rang. `doc`, a 0,0 % sur le rang 0, vaut 60,2 % sur le rang 1 — parce que
   ses 64 bonnes reponses sont la DEUXIEME plus longue 39 fois sur 64.

   La cible n'est donc pas « la bonne reponse ne doit pas etre la plus longue »,
   c'est « la bonne reponse doit tomber a chaque rang une fois sur quatre ».
   Cet outil assigne un rang cible a chaque question (repartition la plus plate
   possible), choisit quel distracteur doit passer de l'autre cote de la bonne
   reponse au COUT LE PLUS FAIBLE en caracteres, et rend une fenetre de longueur
   pour chaque option — bornee par la consigne 70-130 % de B3.

   Il n'ecrit RIEN : il dit quoi ecrire. La reecriture reste humaine (ou confiee a
   des agents), parce qu'un distracteur allonge par une machine cesse d'etre faux.

   AJOUT du 2026-09-06, apres la premiere passe : fermer la longueur DEPLACE le
   biais sur la PONCTUATION. Sur `doc`, « la plus detaillee » (le nombre de
   virgules, deux-points et points-virgules) est passee de 40,0 % a 44,1 % pendant
   que le pire indice tombait de 60,2 % a 44,1 %. Le mode `--ponctuation` liste
   les questions ou la bonne reponse est LA SEULE a porter le plus de ponctuation,
   avec la contrainte que la longueur de chaque distracteur reste dans sa fenetre
   -- autrement dit : un ajustement a longueur quasi constante, du type
   « A et B » -> « A, B ».

   Usage :
     node tools/plan-rangs-qcm.js <cours>              # le plan lisible
     node tools/plan-rangs-qcm.js <cours> --json       # le meme, pour un agent
     node tools/plan-rangs-qcm.js <cours> --ponctuation
     node tools/plan-rangs-qcm.js <cours> --incise
*/
"use strict";
var fs = require("fs"), path = require("path");
var RACINE = path.join(__dirname, "..");
var BAS = 0.7, HAUT = 1.3;

function questionsDe(cours) {
  var dir = path.join(RACINE, "pages", cours), out = [];
  if (!fs.existsSync(dir)) return null;
  fs.readdirSync(dir).filter(function (f) { return /^lecon-\d+\.html$/.test(f); }).sort()
    .forEach(function (f) {
      var s = fs.readFileSync(path.join(dir, f), "utf8");
      var re = /<script[^>]*type="application\/json"[^>]*data-quiz(?:-bilan)?[^>]*>([\s\S]*?)<\/script>/g, m, bloc = 0;
      while ((m = re.exec(s))) {
        var lot;
        try { lot = JSON.parse(m[1]); } catch (e) { continue; }
        bloc++;
        var estBilan = /data-quiz-bilan/.test(m[0]);
        lot.forEach(function (q, i) {
          out.push({ fichier: f, bloc: bloc, bilan: estBilan, num: i + 1, q: q });
        });
      }
    });
  return out;
}

/* Fenetre de longueur admissible pour un distracteur, selon qu'il doit etre
   PLUS LONG ou PLUS COURT que la bonne reponse. Les bornes 70-130 % priment :
   un distracteur qui sort de la bande redonne un indice, quel que soit son rang.
   ⚠️ EXEMPTION, ajoutee le 2026-09-06 en meme temps que la section 7 du document
   normatif du cours `doc` : sous 20 caracteres, la bande n'admet souvent qu'UNE
   SEULE longueur entiere (a 3 caracteres : de 2,1 a 3,9), donc quatre options de
   longueur identique. L'outil reclamait alors une reecriture IMPOSSIBLE -- vu sur
   une question dont la bonne reponse est « Aucune » (6 caracteres), ou il exigeait
   trois distracteurs de 7 caracteres exactement. Sous ce seuil, les options sont
   des jetons de code ou des quantites : ce qui les tient ensemble est leur GENRE,
   pas leur taille, et le rang seul continue de compter. */
var SEUIL_JETON = 20;
function fenetre(bon, plusLong) {
  if (bon < SEUIL_JETON) return plusLong ? [bon + 1, Infinity] : [1, bon - 1];
  var basBande = Math.ceil(BAS * bon), hautBande = Math.floor(HAUT * bon);
  if (plusLong) return [Math.max(bon + 1, basBande), hautBande];
  return [basBande, Math.min(bon - 1, hautBande)];
}

/* Cout en caracteres pour amener l'option k du bon cote. 0 si elle y est deja ET
   dans la bande ; sinon la distance a la borne la plus proche de la fenetre. */
function cout(len, f) {
  if (len < f[0]) return f[0] - len;
  if (len > f[1]) return len - f[1];
  return 0;
}

/* Cout total d'une question si on lui assigne le rang r : on choisit les r
   distracteurs les moins chers a rendre plus longs, les autres deviennent plus
   courts. Enumeration exhaustive des C(3,r) partitions — trois distracteurs. */
function coutRang(e, r) {
  var k = e.q.correct || 0;
  var idx = e.q.a.map(function (_, i) { return i; }).filter(function (i) { return i !== k; });
  var bon = e.q.a[k].length;
  var meilleur = null;
  var combos = [];
  (function rec(i, pris) {
    if (pris.length === r) { combos.push(pris.slice()); return; }
    if (i >= idx.length) return;
    rec(i + 1, pris.concat([idx[i]])); rec(i + 1, pris);
  })(0, []);
  combos.forEach(function (longs) {
    var total = 0, detail = {};
    idx.forEach(function (i) {
      var pl = longs.indexOf(i) !== -1;
      var f = fenetre(bon, pl);
      var c = cout(e.q.a[i].length, f);
      total += c; detail[i] = { plusLong: pl, fenetre: f, cout: c };
    });
    if (!meilleur || total < meilleur.total) meilleur = { total: total, detail: detail };
  });
  return meilleur;
}

function planifier(cours) {
  var lot = questionsDe(cours);
  if (!lot) return null;
  var n = lot.length;
  /* Capacite par rang : la repartition la plus plate que n permette. */
  var cap = [0, 0, 0, 0];
  for (var i = 0; i < n; i++) cap[i % 4]++;
  /* CORRECTION du 2026-09-06, apres la relecture adversariale du cours `rust` :
     l'affectation gloutonne GLOBALE (tous les couples question-rang tries par
     cout croissant) est plate au niveau du COURS et biaisee au niveau de la
     LECON. Le cout du rang 0 vaut ZERO pour une question qui y est deja : les
     19 places du rang 0 partaient donc aux 19 questions les moins cheres, qui
     sont systematiquement les memes lecons -- celles dont les options sont
     courtes, au premier rang desquelles le QCM BILAN. Mesure sur `rust` avant
     correction : le cours affichait 25,0 % sur « la plus longue » ET 25,0 % sur
     « la plus COURTE », donc parfaitement plat, pendant que `lecon-18` etait a
     3/3 (100 %), `lecon-22` a 10/13 (76,9 %) et seize lecons a 0/3 -- deux lots
     de biais opposes qui s'annulent dans la moyenne. C'est la lecon du cours
     `react` (« un indice de LOT vaut 100 % sur le lot et 25 % sur le site »)
     transposee d'un cran : la moyenne du COURS est a son tour le mauvais endroit
     ou decider, et un apprenant ne voit jamais que le lot qu'il revise.

     La reparation : les rangs cibles sont distribues FICHIER PAR FICHIER, en
     tourniquet, avec un decalage global qui se poursuit d'un fichier a l'autre.
     Un fichier de trois questions recoit donc trois rangs DISTINCTS, et la
     repartition du cours reste la meme (cap inchange). L'affectation gloutonne
     par le cout ne joue plus qu'a l'interieur d'un fichier. */
  var parFichier = {}, ordre = [];
  lot.forEach(function (e, qi) {
    if (!parFichier[e.fichier]) { parFichier[e.fichier] = []; ordre.push(e.fichier); }
    parFichier[e.fichier].push(qi);
  });
  var affecte = new Array(n).fill(null), decalage = 0;
  ordre.forEach(function (f) {
    var qis = parFichier[f];
    /* Les rangs a distribuer dans CE fichier, en tourniquet depuis le decalage. */
    var reste = [0, 0, 0, 0];
    for (var j = 0; j < qis.length; j++) reste[(decalage + j) % 4]++;
    decalage += qis.length;
    var paires = [];
    qis.forEach(function (qi) {
      for (var r = 0; r < 4; r++) {
        if (reste[r] === 0) continue;
        var m = coutRang(lot[qi], r);
        paires.push({ qi: qi, rang: r, total: m.total, detail: m.detail });
      }
    });
    paires.sort(function (a, b) { return a.total - b.total; });
    paires.forEach(function (p) {
      if (affecte[p.qi] !== null || reste[p.rang] <= 0) return;
      affecte[p.qi] = p; reste[p.rang]--;
    });
    /* Filet : une question sans rang libre au cout minimal prend ce qui reste. */
    qis.forEach(function (qi) {
      if (affecte[qi] !== null) return;
      for (var r = 0; r < 4; r++) if (reste[r] > 0) {
        var m = coutRang(lot[qi], r);
        affecte[qi] = { qi: qi, rang: r, total: m.total, detail: m.detail };
        reste[r]--; return;
      }
    });
  });
  /* La capacite REELLEMENT distribuee, qui peut differer de la plus plate quand
     les fichiers ne font pas un multiple de quatre questions. On rend celle-la,
     pas la theorique : afficher une cible qu'on n'a pas distribuee serait mentir. */
  var capReelle = [0, 0, 0, 0];
  affecte.forEach(function (a) { if (a) capReelle[a.rang]++; });
  return { cours: cours, lot: lot, plan: affecte, cap: capReelle };
}

function rangActuel(e) {
  var k = e.q.correct || 0, bon = e.q.a[k].length;
  return e.q.a.filter(function (o, i) { return i !== k && o.length > bon; }).length;
}

var args = process.argv.slice(2);
var cours = args.filter(function (a) { return a.indexOf("--") !== 0; })[0];
if (!cours) { console.log("usage : node tools/plan-rangs-qcm.js <cours> [--json|--ponctuation|--incise]"); process.exit(1); }
var p = planifier(cours);
if (!p) { console.error("cours introuvable : " + cours); process.exit(1); }

/* ------------------------------------------------- le mode PONCTUATION */
function ponct(t) { return (t.match(/[,:;]/g) || []).length; }
if (args.indexOf("--ponctuation") !== -1) {
  var lignes = [], seuls = 0;
  p.lot.forEach(function (e) {
    var k = e.q.correct || 0, P = e.q.a.map(ponct);
    var mx = Math.max.apply(null, P);
    var combien = P.filter(function (x) { return x === mx; }).length;
    if (P[k] !== mx || combien !== 1) return;
    seuls++;
    var bon = e.q.a[k].length;
    var cand = e.q.a.map(function (t, i) { return { i: i, p: P[i], l: t.length, t: t }; })
      .filter(function (o) { return o.i !== k; })
      .sort(function (x, y) { return y.p - x.p; });
    lignes.push({ fichier: e.fichier, bloc: e.bloc, bilan: e.bilan, question: e.num,
      enonce: e.q.q, bonne: e.q.a[k], ponctBonne: P[k], longueurBonne: bon,
      bandeBonne: [Math.ceil(0.7 * bon), Math.floor(1.3 * bon)],
      distracteurs: cand });
  });
  if (args.indexOf("--json") !== -1) {
    console.log(JSON.stringify({ cours: cours, questions: p.lot.length, seuls: seuls, travaux: lignes }, null, 1));
  } else {
    console.log("\nplan-rangs-qcm --ponctuation — " + cours + " : " + p.lot.length + " questions");
    console.log("  la bonne reponse est LA SEULE la plus ponctuee : " + seuls
      + " fois (" + (seuls / p.lot.length * 100).toFixed(1) + " %, hasard : 25,0 %)\n");
    lignes.forEach(function (t) {
      console.log("  " + t.fichier + (t.bilan ? " [BILAN]" : "") + " q" + t.question
        + "   bonne reponse : " + t.ponctBonne + " signes, " + t.longueurBonne + " car.");
      console.log("      BONNE (ne pas toucher) : " + t.bonne);
      t.distracteurs.forEach(function (d) {
        console.log("      opt" + d.i + " : " + d.p + " signes, " + d.l + " car. (fenetre "
          + t.bandeBonne[0] + ".." + t.bandeBonne[1] + ")");
        console.log("            " + d.t);
      });
      console.log("");
    });
  }
  process.exit(0);
}

/* ------------------------------------------------- le mode INCISE
   Ajoute le 2026-09-06 (B4, cours `git`), pour la meme raison que --ponctuation :
   fermer la longueur DEPLACE le biais. Sur `git`, la longueur est tombee de 93,8 %
   a 25,0 % (le hasard exact) et « l'incise entre parentheses » est restee a 52,1 %,
   devenue le pire indice du cours. C'est aussi le pire RENDEMENT du site (89,7 %).

   Le critere est celui de mesure-biais-qcm : une incise d'AU MOINS 4 caracteres
   entre parentheses -- pas un appel de fonction comme `map()`. La cible n'est pas
   « aucune parenthese » : c'est que la bonne reponse ne soit pas SEULE en tete.
   Une question dont les quatre options portent une incise est parfaitement neutre.

   Comme --ponctuation, l'ajustement se fait a longueur quasi constante : la fenetre
   rendue pour chaque distracteur est celle de son COTE ACTUEL, pour ne pas defaire
   le travail de rang. « A et B » -> « A (et B) » coute 2 caracteres. */
function incises(t) { return (String(t).match(/\([^)]{4,}\)/g) || []).length; }
if (args.indexOf("--incise") !== -1) {
  var lignesI = [], gagne = 0, score = 0;
  p.lot.forEach(function (e) {
    var k = e.q.correct || 0, I = e.q.a.map(incises);
    var mx = Math.max.apply(null, I);
    var exaequo = I.filter(function (x) { return x === mx; }).length;
    if (I[k] === mx) score += 1 / exaequo;
    /* rien a faire si la bonne reponse ne gagne pas, ou si les QUATRE sont a egalite
       (cas neutre : la strategie tire alors au hasard, ce qui est la cible). */
    if (I[k] !== mx || exaequo === 4) return;
    gagne++;
    var bon = e.q.a[k].length;
    var cand = e.q.a.map(function (t, i) {
      var plusLong = t.length > bon;
      return { option: i, incises: I[i], longueur: t.length,
               fenetre: fenetre(bon, plusLong), texte: t };
    }).filter(function (o) { return o.option !== k; })
      .sort(function (x, y) { return y.incises - x.incises; });
    lignesI.push({ fichier: e.fichier, bloc: e.bloc, bilan: e.bilan, question: e.num,
      enonce: e.q.q, correcte: k, bonne: e.q.a[k], inciseBonne: I[k],
      exaequo: exaequo, longueurBonne: bon, distracteurs: cand });
  });
  if (args.indexOf("--json") !== -1) {
    console.log(JSON.stringify({ cours: cours, questions: p.lot.length,
      gagnees: gagne, taux: score / p.lot.length, travaux: lignesI }, null, 1));
  } else {
    console.log("\nplan-rangs-qcm --incise — " + cours + " : " + p.lot.length + " questions");
    console.log("  score de la strategie « l'incise entre parentheses » : "
      + (score / p.lot.length * 100).toFixed(1) + " % (hasard : 25,0 %)");
    console.log("  questions ou la bonne reponse est en tete SANS egalite a quatre : "
      + gagne + "\n");
    lignesI.forEach(function (t) {
      console.log("  " + t.fichier + (t.bilan ? " [BILAN]" : "") + " q" + t.question
        + "   bonne reponse : " + t.inciseBonne + " incise(s), " + t.longueurBonne
        + " car." + (t.exaequo > 1 ? ", a egalite avec " + (t.exaequo - 1) : ", SEULE en tete"));
      console.log("      BONNE (ne pas toucher) : " + t.bonne);
      t.distracteurs.forEach(function (d) {
        console.log("      opt" + d.option + " : " + d.incises + " incise(s), " + d.longueur
          + " car. (fenetre " + d.fenetre[0] + ".."
          + (d.fenetre[1] === Infinity ? "inf" : d.fenetre[1]) + ")");
        console.log("            " + d.texte);
      });
      console.log("");
    });
  }
  process.exit(0);
}

var travaux = [];
p.lot.forEach(function (e, qi) {
  var a = p.plan[qi], k = e.q.correct || 0, bon = e.q.a[k].length;
  var ra = rangActuel(e);
  var opts = [];
  Object.keys(a.detail).forEach(function (i) {
    var d = a.detail[i], len = e.q.a[i].length;
    if (d.cout === 0) return;
    opts.push({ option: Number(i), longueur: len, cible: d.fenetre,
      sens: len < d.fenetre[0] ? "ALLONGER" : "RESSERRER",
      caracteres: d.cout, texte: e.q.a[i] });
  });
  if (!opts.length) return;
  travaux.push({ fichier: e.fichier, bloc: e.bloc, bilan: e.bilan, question: e.num,
    enonce: e.q.q, correcte: k, longueurBonne: bon, texteBon: e.q.a[k],
    rangActuel: ra, rangCible: a.rang, cout: a.total, options: opts });
});

if (args.indexOf("--json") !== -1) {
  console.log(JSON.stringify({ cours: cours, questions: p.lot.length,
    capacite: p.cap, travaux: travaux }, null, 1));
} else {
  var rangs = [0, 0, 0, 0];
  p.lot.forEach(function (e) { rangs[rangActuel(e)]++; });
  console.log("\nplan-rangs-qcm — " + cours + " : " + p.lot.length + " questions");
  console.log("  rangs AUJOURD'HUI (0 = bonne reponse la plus longue) : " + rangs.join(" / "));
  console.log("  rangs VISES                                          : " + p.cap.join(" / "));
  console.log("  questions a retoucher : " + travaux.length + "/" + p.lot.length
    + "   caracteres a ecrire : " + travaux.reduce(function (s, t) { return s + t.cout; }, 0));
  console.log("");
  travaux.forEach(function (t) {
    console.log("  " + t.fichier + (t.bilan ? " [BILAN]" : "") + " q" + t.question
      + "  rang " + t.rangActuel + " -> " + t.rangCible + "   bonne reponse = " + t.longueurBonne + " car.");
    t.options.forEach(function (o) {
      console.log("      opt" + o.option + "  " + o.sens + "  " + o.longueur
        + " car. -> [" + o.cible[0] + ".." + o.cible[1] + "]  (" + o.caracteres + " car.)");
      console.log("            " + o.texte.slice(0, 100));
    });
  });
}
