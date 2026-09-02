/* Les trois changements, appliques pour de vrai aux deux versions.

   On ne demande a personne de croire qu'une version « se modifie plus facilement ».
   On applique le meme changement metier aux deux sources, on execute les deux, on
   verifie qu'elles rendent le MEME nouveau resultat — sinon l'un des deux patchs est
   faux — et on compte les lignes que le changement a touchees dans chacune. */

var fs = require("fs");
var path = require("path");
var ICI = __dirname;

function lire(f) { return fs.readFileSync(path.join(ICI, f), "utf8").replace(/\r\n/g, "\n"); }

/* Applique une liste de remplacements ; refuse de continuer si l'un ne trouve pas sa
   cible (un patch qui ne s'applique pas doit se voir, pas se taire). */
function appliquer(src, remplacements, etiquette) {
  remplacements.forEach(function (r) {
    if (src.indexOf(r.avant) === -1) {
      throw new Error(etiquette + " : motif introuvable —\n" + r.avant.slice(0, 90));
    }
    if (src.split(r.avant).length - 1 !== (r.combien || 1)) {
      throw new Error(etiquette + " : motif trouve " + (src.split(r.avant).length - 1) +
                      " fois, " + (r.combien || 1) + " attendu(es)");
    }
    src = src.split(r.avant).join(r.apres);
  });
  return src;
}

/* -------------------------------------------------------------------- diff simple
   Plus longue sous-sequence commune, puis comptage des lignes ajoutees/supprimees et
   du nombre d'ENDROITS distincts (des lignes changees qui se suivent = un endroit). */
function diff(a, b) {
  var A = a.split("\n"), B = b.split("\n");
  var n = A.length, m = B.length;
  var T = [];
  for (var i = 0; i <= n; i++) { T.push(new Array(m + 1).fill(0)); }
  for (i = n - 1; i >= 0; i--) {
    for (var j = m - 1; j >= 0; j--) {
      T[i][j] = A[i] === B[j] ? T[i + 1][j + 1] + 1 : Math.max(T[i + 1][j], T[i][j + 1]);
    }
  }
  var suppr = 0, ajout = 0, endroits = 0, dansUnEndroit = false;
  i = 0; j = 0;
  while (i < n && j < m) {
    if (A[i] === B[j]) { i++; j++; dansUnEndroit = false; continue; }
    if (!dansUnEndroit) { endroits++; dansUnEndroit = true; }
    if (T[i + 1][j] >= T[i][j + 1]) { suppr++; i++; } else { ajout++; j++; }
  }
  if (i < n || j < m) { if (!dansUnEndroit) endroits++; suppr += n - i; ajout += m - j; }
  return { suppr: suppr, ajout: ajout, touchees: suppr + ajout, endroits: endroits };
}

/* ------------------------------------------------------------ les trois changements */
var CHANGEMENTS = [
  {
    nom: "Ajouter un pays : l'Espagne (TVA 21 % / 4 %, port 8,90 €, franco dès 79 €)",
    court: "ajouter un pays",
    v1: [
      { avant: '      } else if (c.pays === "DE") {\n        if (l.cat === "livre") { t = 70; } else { t = 190; }\n      } else {',
        apres: '      } else if (c.pays === "DE") {\n        if (l.cat === "livre") { t = 70; } else { t = 190; }\n      } else if (c.pays === "ES") {\n        if (l.cat === "livre") { t = 40; } else { t = 210; }\n      } else {' },
      { avant: '      } else if (c.pays === "DE") {\n        if (ht < 6900) { port = 690; }\n      } else {',
        apres: '      } else if (c.pays === "DE") {\n        if (ht < 6900) { port = 690; }\n      } else if (c.pays === "ES") {\n        if (ht < 7900) { port = 890; }\n      } else {' },
      { avant: '      } else if (c.pays === "DE") {\n        tva += Math.round(port * 190 / 1000);\n      } else {',
        apres: '      } else if (c.pays === "DE") {\n        tva += Math.round(port * 190 / 1000);\n      } else if (c.pays === "ES") {\n        tva += Math.round(port * 210 / 1000);\n      } else {' }
    ],
    v2: [
      { avant: '  CH: { tvaReduite: 26, tvaNormale: 81,  port: 1490, francoDes: null }',
        apres: '  CH: { tvaReduite: 26, tvaNormale: 81,  port: 1490, francoDes: null },\n  ES: { tvaReduite: 40, tvaNormale: 210, port: 890,  francoDes: 7900 }' }
    ]
  },
  {
    nom: "Le taux normal allemand passe de 19 % à 20 %",
    court: "changer un taux",
    v1: [
      { avant: 'if (l.cat === "livre") { t = 70; } else { t = 190; }', apres: 'if (l.cat === "livre") { t = 70; } else { t = 200; }' },
      { avant: 'tva += Math.round(port * 190 / 1000);', apres: 'tva += Math.round(port * 200 / 1000);' }
    ],
    v2: [
      { avant: 'DE: { tvaReduite: 70, tvaNormale: 190,', apres: 'DE: { tvaReduite: 70, tvaNormale: 200,' }
    ]
  },
  {
    nom: "Une remise de 15 % dès 50 exemplaires d'un même titre",
    court: "ajouter un palier de remise",
    v1: [
      { avant: '      if (l.qte >= 25) {\n        rem = Math.round(brut * 10 / 100);\n      } else if (l.qte >= 10) {',
        apres: '      if (l.qte >= 50) {\n        rem = Math.round(brut * 15 / 100);\n      } else if (l.qte >= 25) {\n        rem = Math.round(brut * 10 / 100);\n      } else if (l.qte >= 10) {' }
    ],
    v2: [
      { avant: 'var REMISES_VOLUME = [ { desQte: 25, pourCent: 10 }, { desQte: 10, pourCent: 5 } ];',
        apres: 'var REMISES_VOLUME = [ { desQte: 50, pourCent: 15 }, { desQte: 25, pourCent: 10 },\n                       { desQte: 10, pourCent: 5 } ];' }
    ]
  }
];

CHANGEMENTS.push(require("./modif4.js").CHANGEMENT_4);

module.exports = { lire: lire, appliquer: appliquer, diff: diff, CHANGEMENTS: CHANGEMENTS };
