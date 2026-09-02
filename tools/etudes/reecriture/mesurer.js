/* Tout ce que la page affiche comme chiffre est produit ici, en executant les deux
   versions. Rien n'est estime, rien n'est recopie d'une execution precedente. */

var fs = require("fs");
var path = require("path");
var ICI = __dirname;
var jeu = require("./jeu.js");
var metriques = require("./metriques.js");
var modifs = require("./modifs.js");

function source(v) { return fs.readFileSync(path.join(ICI, v + ".js"), "utf8").replace(/\r\n/g, "\n"); }
function charger(src) { return new Function(src + "\n; return releve;")(); }

var SRC = { v1: source("v1"), v2: source("v2") };

/* ------------------------------------------------------- 1. la meme sortie, ou non
   Douze commandes ne prouvent rien : on en tire dix mille, par lots, avec des graines
   differentes, et on compare les sorties caractere pour caractere. */
function equivalence(lots, parLot, options) {
  var f1 = charger(SRC.v1), f2 = charger(SRC.v2);
  var differents = 0, premier = null, commandes = 0, octets = 0;
  for (var g = 1; g <= lots; g++) {
    var commandesDuLot = jeu.tirage(parLot, g, options);
    commandes += parLot;
    var a = f1(commandesDuLot), b = f2(commandesDuLot);
    octets += a.length;
    if (a !== b) {
      differents++;
      if (!premier) {
        var A = a.split("\n"), B = b.split("\n");
        for (var i = 0; i < Math.max(A.length, B.length); i++) {
          if (A[i] !== B[i]) { premier = { lot: g, ligne: i + 1, v1: A[i], v2: B[i] }; break; }
        }
      }
    }
  }
  return { lots: lots, commandes: commandes, differents: differents, premier: premier, octets: octets };
}

/* ------------------------------- 2. ce que fait chaque version devant un pays inconnu */
function paysInconnu() {
  var commande = [{ id: "X-001", pays: "ES", fidele: false,
                    lignes: [{ titre: "Atlas historique", cat: "livre", prix: 4900, qte: 1, poids: 1400 }] }];
  var res = {};
  ["v1", "v2"].forEach(function (v) {
    try {
      var sortie = charger(SRC[v])(commande);
      var m = /TTC (\d+\.\d\d)/.exec(sortie);
      res[v] = { plante: false, ttc: m ? m[1] : "?" };
    } catch (e) {
      res[v] = { plante: true, erreur: e.constructor.name + " : " + e.message };
    }
  });
  return res;
}

/* --------------------------- 3. le cout d'un changement, patch applique et rejoue */
function coutDesChangements() {
  return modifs.CHANGEMENTS.map(function (ch) {
    var apres = {
      v1: modifs.appliquer(SRC.v1, ch.v1, "v1/" + ch.court),
      v2: modifs.appliquer(SRC.v2, ch.v2, "v2/" + ch.court)
    };
    /* Le jeu doit REELLEMENT declencher la regle ajoutee, sinon le patch n'est pas teste. */
    var options = ch.court === "ajouter un pays" ? { pays: ["FR", "BE", "DE", "CH", "ES"] }
                : ch.court === "ajouter un palier de remise" ? { qteMax: 60 }
                : {};
    var f1 = charger(apres.v1), f2 = charger(apres.v2);
    var avant = charger(SRC.v1);
    var memeResultat = true, change = false;
    for (var g = 1; g <= 40; g++) {
      var lot = jeu.tirage(25, g, options);
      var a = f1(lot), b = f2(lot);
      if (a !== b) memeResultat = false;
      if (avant(lot) !== a) change = true;
    }
    return {
      nom: ch.nom, court: ch.court,
      v1: modifs.diff(SRC.v1, apres.v1),
      v2: modifs.diff(SRC.v2, apres.v2),
      memeResultat: memeResultat,
      change: change
    };
  });
}

/* ------------------------- 3 bis. et si on oublie l'un des endroits a modifier ?
   Le vrai risque d'un changement disperse n'est pas d'ecrire trois fois la meme
   chose : c'est de n'en ecrire que deux. On retire donc un patch a la fois, on
   execute, et on compte les commandes que le programme facture faux SANS RIEN DIRE. */
function oublis(courtDuChangement, options, lots, parLot) {
  var ch = null;
  modifs.CHANGEMENTS.forEach(function (c) { if (c.court === courtDuChangement) ch = c; });
  var complet = charger(modifs.appliquer(SRC.v1, ch.v1, "complet"));
  var resultats = [];
  for (var k = 0; k < ch.v1.length; k++) {
    var partiel = ch.v1.filter(function (_, i) { return i !== k; });
    var f, plante = false;
    try { f = charger(modifs.appliquer(SRC.v1, partiel, "partiel")); }
    catch (e) { plante = true; }
    var fausses = 0, commandes = 0;
    if (!plante) {
      for (var g = 1; g <= lots; g++) {
        var lot = jeu.tirage(parLot, g, options);
        commandes += parLot;
        var A = complet(lot).split("\n"), B = f(lot).split("\n");
        for (var i = 0; i < A.length; i++) {
          if (A[i] !== B[i] && A[i].indexOf("    HT ") === 0) fausses++;
        }
      }
    }
    resultats.push({ endroitOublie: k + 1, plante: plante, commandes: commandes, fausses: fausses });
  }
  return resultats;
}

/* ------------------------------------- 3 ter. l'exercice, applique pour verification */
function exercice() {
  var ch = require("./modif5.js").CHANGEMENT_5;
  var a = modifs.appliquer(SRC.v1, ch.v1, "exercice/v1");
  var b = modifs.appliquer(SRC.v2, ch.v2, "exercice/v2");
  var f1 = charger(a), f2 = charger(b), origine = charger(SRC.v1);
  var memes = true, change = 0, commandes = 0;
  for (var g = 1; g <= 40; g++) {
    var lot = jeu.tirage(25, g);
    commandes += 25;
    var A = f1(lot), B = f2(lot);
    if (A !== B) memes = false;
    var X = origine(lot).split(String.fromCharCode(10)), Y = A.split(String.fromCharCode(10));
    for (var i = 0; i < X.length; i++) {
      if (X[i] !== Y[i] && X[i].indexOf("    HT ") === 0) change++;
    }
  }
  return { nom: ch.nom, court: ch.court, v1: modifs.diff(SRC.v1, a), v2: modifs.diff(SRC.v2, b),
           memes: memes, commandes: commandes, change: change,
           solutionV1: ch.v1, solutionV2: ch.v2 };
}

/* ------- 3 quater. ce que la version 2 coute : combien de cadres de pile separent
   le calcul d'un centime de la fonction qu'on a appelee. On remplace temporairement
   Math.round par un temoin qui regarde la profondeur de la pile au moment ou un
   arrondi a lieu — donc au moment precis ou un chiffre se decide. Les deux versions
   sont mesurees dans le meme harnais : seule la difference a un sens. */
function pileAuMomentDArrondir() {
  var res = {};
  var limiteInitiale = Error.stackTraceLimit;
  Error.stackTraceLimit = 60;
  ["v1", "v2"].forEach(function (v) {
    var vrai = Math.round, max = 0;
    Math.round = function (x) {
      var cadres = new Error().stack.split(String.fromCharCode(10)).length;
      if (cadres > max) max = cadres;
      return vrai(x);
    };
    try { charger(SRC[v])(jeu.vitrine()); } finally { Math.round = vrai; }
    res[v] = max;
  });
  Error.stackTraceLimit = limiteInitiale;
  return res;
}

/* ---------------- 4. la reecriture « propre » qui change les chiffres sans le dire
   Variante plausible : arrondir la TVA une seule fois par commande, au lieu de
   l'arrondir a chaque ligne. Personne ne verrait la difference en relisant. */
var VARIANTE = [
  { avant: "      tva: pourMille(net, tauxTva(commande.pays, ligne.cat))",
    apres: "      tva: net * tauxTva(commande.pays, ligne.cat) / 1000" },
  { avant: '  var tva = somme("tva") + (port > 0 ? pourMille(port, PAYS[commande.pays].tvaNormale) : 0);',
    apres: '  var tva = Math.round(somme("tva") + (port > 0 ? port * PAYS[commande.pays].tvaNormale / 1000 : 0));' }
];

function arrondiDeplace(lots, parLot) {
  var fRef = charger(SRC.v1);
  var fVar = charger(modifs.appliquer(SRC.v2, VARIANTE, "variante"));
  var commandes = 0, touchees = 0, ecartMax = 0, exemple = null, totalEcart = 0;
  for (var g = 1; g <= lots; g++) {
    var lot = jeu.tirage(parLot, g);
    commandes += parLot;
    var A = fRef(lot).split("\n"), B = fVar(lot).split("\n");
    for (var i = 0; i < A.length; i++) {
      if (A[i] === B[i] || A[i].indexOf("    HT ") !== 0) continue;
      touchees++;
      var a = parseFloat(/TTC (\d+\.\d\d)/.exec(A[i])[1]);
      var b = parseFloat(/TTC (\d+\.\d\d)/.exec(B[i])[1]);
      var ecart = Math.abs(Math.round((a - b) * 100));
      totalEcart += ecart;
      if (ecart > ecartMax) { ecartMax = ecart; exemple = { v1: A[i].trim(), variante: B[i].trim() }; }
    }
  }
  return { commandes: commandes, touchees: touchees, ecartMax: ecartMax,
           totalEcart: totalEcart, exemple: exemple };
}

function tout() {
  return {
    metriques: { v1: metriques.mesurer(SRC.v1), v2: metriques.mesurer(SRC.v2) },
    equivalence: equivalence(200, 50),
    paysInconnu: paysInconnu(),
    changements: coutDesChangements(),
    oublis: oublis("ajouter un pays", { pays: ["FR", "BE", "DE", "CH", "ES"] }, 40, 25),
    exercice: exercice(),
    pile: pileAuMomentDArrondir(),
    arrondi: arrondiDeplace(200, 50),
    vitrine: charger(SRC.v1)(jeu.vitrine())
  };
}

function point(gauche, droite, largeur) {
  var l = gauche + " ";
  while (l.length < (largeur || 46)) l += ".";
  return l + " " + droite;
}

if (require.main === module) {
  var r = tout();
  var m1 = r.metriques.v1, m2 = r.metriques.v2;
  console.log("MESURE DES DEUX VERSIONS");
  console.log("========================");
  console.log("");
  console.log("                                     version 1   version 2");
  function ligne(nom, a, b) {
    var l = "  " + nom;
    while (l.length < 37) l += " ";
    var ga = String(a); while (ga.length < 9) ga = " " + ga;
    var gb = String(b); while (gb.length < 12) gb = " " + gb;
    console.log(l + ga + gb);
  }
  ligne("lignes de code effectives", m1.effectives, m2.effectives);
  ligne("fonctions", m1.fonctions, m2.fonctions);
  ligne("lignes de la plus longue fonction", m1.plusLongue, m2.plusLongue);
  ligne("imbrication maximale", m1.imbricationMax, m2.imbricationMax);
  ligne("points de décision", m1.decisions, m2.decisions);
  ligne("nombres non nommés dans le code", m1.magiques, m2.magiques);
  ligne("endroits qui testent le pays", m1.testsDePays, m2.testsDePays);
  console.log("");
  console.log("MÊME SORTIE ?");
  console.log(point("  commandes comparées", r.equivalence.commandes));
  console.log(point("  lots dont la sortie diffère", r.equivalence.differents));
  console.log("");
  console.log("COÛT DES CHANGEMENTS (lignes touchées / endroits distincts)");
  r.changements.forEach(function (c) {
    console.log(point("  " + c.court,
      "v1 " + c.v1.touchees + " l. / " + c.v1.endroits + " endroit(s)   " +
      "v2 " + c.v2.touchees + " l. / " + c.v2.endroits + " endroit(s)   " +
      (c.memeResultat ? "mêmes chiffres" : "DIVERGENT")));
  });
  console.log("");
  console.log("SI L'ON OUBLIE UN DES TROIS ENDROITS (version 1, ajout d'un pays)");
  r.oublis.forEach(function (o) {
    console.log(point("  endroit " + o.endroitOublie + " oublié",
      o.plante ? "le programme refuse de démarrer"
               : o.fausses + " commandes facturées faux sur " + o.commandes + ", aucune erreur"));
  });
  console.log("");
  console.log("PAYS INCONNU, AVANT TOUT CHANGEMENT");
  console.log("  version 1 : " + (r.paysInconnu.v1.plante ? r.paysInconnu.v1.erreur
                                  : "aucune alerte, facturé " + r.paysInconnu.v1.ttc + " (au taux suisse)"));
  console.log("  version 2 : " + (r.paysInconnu.v2.plante ? r.paysInconnu.v2.erreur
                                  : "aucune alerte, facturé " + r.paysInconnu.v2.ttc));
  console.log("");
  console.log("CE QUE LA VERSION 2 COÛTE");
  console.log(point("  cadres de pile quand un centime s'arrondit",
    "v1 " + r.pile.v1 + "   v2 " + r.pile.v2, 48));
  console.log("");
  console.log("L'EXERCICE, VÉRIFIÉ AVANT PUBLICATION");
  console.log(point("  " + r.exercice.court,
    "v1 " + r.exercice.v1.touchees + " l. / " + r.exercice.v1.endroits + " endroit(s)   " +
    "v2 " + r.exercice.v2.touchees + " l. / " + r.exercice.v2.endroits + " endroit(s)"));
  console.log(point("  commandes dont le relevé change",
    r.exercice.change + " sur " + r.exercice.commandes +
    (r.exercice.memes ? "  (les deux versions d'accord)" : "  DIVERGENT")));
  console.log("");
  console.log("SI LA RÉÉCRITURE DÉPLACE UN ARRONDI");
  console.log(point("  commandes tirées", r.arrondi.commandes));
  console.log(point("  commandes dont le total change", r.arrondi.touchees));
  console.log(point("  écart maximal (centimes)", r.arrondi.ecartMax));
  console.log(point("  écart cumulé (centimes)", r.arrondi.totalEcart));
}

module.exports = { tout: tout, equivalence: equivalence, VARIANTE: VARIANTE };
