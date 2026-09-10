/* Mesure l'index de recherche du site : sa taille sur le disque, ce qu'il contient,
   et ce que son encodage fait gagner. Tous les chiffres publiés par l'étude de cas
   nº 3 viennent d'ici, et sont refaits à chaque assemblage de la page.

   RÈGLE : rien n'est estimé. La taille est celle du fichier, le nombre de mots est
   celui des clefs, et l'économie de l'encodage est calculée en réécrivant les mêmes
   données sous la forme naïve puis en comparant les longueurs. */
var fs = require("fs");
var path = require("path");

var RACINE = path.resolve(__dirname, "..", "..", "..");
var MOT_TEMOIN = "hoisting";

function ko(octets) { return (octets / 1024).toFixed(0); }
function mo(octets) { return (octets / (1024 * 1024)).toFixed(2); }

function mesurer() {
  var fIndex = path.join(RACINE, "js", "search-index.js");
  var fLite = path.join(RACINE, "js", "search-lite.js");
  var tIndex = fs.statSync(fIndex).size;
  var tLite = fs.statSync(fLite).size;

  /* On charge l'index comme le fait le navigateur : c'est un script classique qui
     pose window.SEARCH_INDEX. Aucun module, aucune dépendance — la contrainte du
     site vaut aussi pour ses outils. */
  global.window = global.window || {};
  delete require.cache[require.resolve(fIndex)];
  require(fIndex);
  var IDX = global.window.SEARCH_INDEX;

  var mots = Object.keys(IDX.inv);
  var brut = IDX.inv[MOT_TEMOIN];
  if (!brut) throw new Error("le mot témoin « " + MOT_TEMOIN + " » n'est plus dans l'index");

  /* Décodage identique à celui de js/recherche.js : « D0[.tf],D1[.tf],… » où D est
     un ÉCART par rapport au document précédent, écrit en base 36. */
  var ids = [], tfs = [], prev = 0;
  brut.split(",").forEach(function (p) {
    var dot = p.indexOf(".");
    var d = dot === -1 ? parseInt(p, 36) : parseInt(p.slice(0, dot), 36);
    var tf = dot === -1 ? 1 : parseInt(p.slice(dot + 1), 36);
    prev += d;
    ids.push(prev); tfs.push(tf);
  });

  /* La forme naïve : le même contenu, mais en identifiants ABSOLUS écrits en base 10.
     C'est la version qu'on écrirait spontanément. */
  var naif = ids.map(function (id, i) { return id + ":" + tfs[i]; }).join(",");

  /* Combien de postings l'index contient-il en tout ? (une entrée = un couple
     mot × leçon). C'est le vrai volume de l'index, indépendamment de l'encodage. */
  var postings = 0;
  mots.forEach(function (m) { postings += IDX.inv[m].split(",").length; });

  return {
    tIndex: tIndex, tLite: tLite,
    docs: IDX.docs.length, mots: mots.length, postings: postings,
    temoin: MOT_TEMOIN, brut: brut, naif: naif,
    ids: ids, tfs: tfs,
    gain: Math.round((1 - brut.length / naif.length) * 100),
  };
}

/* Le RENDU, séparé de son affichage — même raison qu'au point C3 du chantier V17 pour
   l'étude nº 6 : la page publiait ce bloc figé au jour de son assemblage et personne ne
   le confrontait jamais à la mesure du jour : elle affichait 45958 mots / 928606 couples /
   4.08 Mo là où l'index en comptait 46033 / 930245 / 4.09.
   L'assembleur demande maintenant le rendu de LA mesure qu'il vient de
   faire, et `tools/preuves/etude-recherche.js` le redemande pour le comparer, ligne à
   ligne, à ce que la page affiche. */
function rendre(m) {
  return [
    "js/search-index.js .......... " + mo(m.tIndex) + " Mo   (index complet, chargé à la 1re recherche)",
    "js/search-lite.js ........... " + ko(m.tLite) + " Ko   (index réduit, chargé d'emblée par la palette)",
    "",
    "documents indexés ........... " + m.docs,
    "mots distincts .............. " + m.mots,
    "couples mot × document ...... " + m.postings,
    "",
    "le mot « " + m.temoin + " » apparaît dans " + m.ids.length + " leçons :",
    "  tel qu'il est écrit ....... " + m.brut + "   (" + m.brut.length + " caractères)",
    "  écrit naïvement ........... " + m.naif + "   (" + m.naif.length + " caractères)",
    "  économie .................. " + m.gain + " %",
  ].join("\n");
}

if (require.main === module) {
  console.log(rendre(mesurer()));
}

module.exports = { mesurer: mesurer, rendre: rendre, MOT_TEMOIN: MOT_TEMOIN };
