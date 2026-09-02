/* Le cinquieme changement : celui qui n'est PAS applique dans la page.

   C'est l'exercice. L'enonce est donne a l'apprenant, la solution est repliee, et
   l'assembleur applique quand meme les deux patchs pour verifier trois choses avant de
   publier : qu'ils s'appliquent, qu'ils changent bien le resultat, et que les deux
   versions modifiees rendent EXACTEMENT la meme sortie. Le chiffre annonce dans la
   page est donc celui d'une execution, pas une prevision. */

var CHANGEMENT_5 = {
  nom: "La TVA des frais de port suit le taux réduit quand la commande ne contient que des livres",
  court: "un taux qui dépend du contenu",
  v1: [
    { avant: "    var ht = 0;\n    var poids = 0;\n    var tva = 0;",
      apres: "    var ht = 0;\n    var poids = 0;\n    var tva = 0;\n    var queDesLivres = 1;" },
    { avant: "      var l = c.lignes[j];\n",
      apres: "      var l = c.lignes[j];\n      if (l.cat !== \"livre\") { queDesLivres = 0; }\n" },
    { avant: "      if (c.pays === \"FR\") {\n        tva += Math.round(port * 200 / 1000);\n" +
             "      } else if (c.pays === \"BE\") {\n        tva += Math.round(port * 210 / 1000);\n" +
             "      } else if (c.pays === \"DE\") {\n        tva += Math.round(port * 190 / 1000);\n" +
             "      } else {\n        tva += Math.round(port * 81 / 1000);\n      }",
      apres: "      if (c.pays === \"FR\") {\n        tva += Math.round(port * (queDesLivres ? 55 : 200) / 1000);\n" +
             "      } else if (c.pays === \"BE\") {\n        tva += Math.round(port * (queDesLivres ? 60 : 210) / 1000);\n" +
             "      } else if (c.pays === \"DE\") {\n        tva += Math.round(port * (queDesLivres ? 70 : 190) / 1000);\n" +
             "      } else {\n        tva += Math.round(port * (queDesLivres ? 26 : 81) / 1000);\n      }" }
  ],
  v2: [
    { avant: "  var ht = somme(\"net\");",
      apres: "  var queDesLivres = commande.lignes.every(function (l) { return l.cat === TAUX_REDUIT_POUR; });\n" +
             "  var ht = somme(\"net\");" },
    { avant: "  var tva = somme(\"tva\") + (port > 0 ? pourMille(port, PAYS[commande.pays].tvaNormale) : 0);",
      apres: "  var tva = somme(\"tva\") + (port > 0 ? pourMille(port, queDesLivres\n" +
             "      ? PAYS[commande.pays].tvaReduite : PAYS[commande.pays].tvaNormale) : 0);" }
  ]
};

module.exports = { CHANGEMENT_5: CHANGEMENT_5 };
