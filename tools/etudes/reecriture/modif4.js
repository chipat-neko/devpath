/* Le quatrieme changement, celui qui sert d'epreuve honnete.

   Les trois premiers changements ont ete choisis par quelqu'un qui savait deja quelle
   version il voulait faire gagner : ils suivent tous la ligne de decoupe de la
   version 2 (un pays, un taux, un palier — trois choses que la version 2 a mises en
   table). Un tel choix ne prouve rien.

   Celui-ci coupe EN TRAVERS : la remise de fidelite disparait, et les clients fideles
   ont le port offert a la place. La fidelite cesse donc d'etre une affaire de ligne de
   commande pour devenir une affaire de frais de port — c'est-a-dire qu'elle traverse
   la separation meme sur laquelle la version 2 est batie.

   On applique, on execute, et on publie le chiffre obtenu, qu'il arrange ou non. */

var CHANGEMENT_4 = {
  nom: "La fidélité n'ouvre plus droit à 3 % de remise mais au port offert",
  court: "déplacer un avantage client",
  v1: [
    { avant: "      if (c.fidele) {\n        net = net - Math.round(net * 3 / 100);\n      }\n",
      apres: "" },
    { avant: "      if (poids > 2000 && port > 0) {\n        port += Math.ceil((poids - 2000) / 1000) * 200;\n      }\n    }\n",
      apres: "      if (poids > 2000 && port > 0) {\n        port += Math.ceil((poids - 2000) / 1000) * 200;\n      }\n    }\n    if (c.fidele) { port = 0; }\n" }
  ],
  v2: [
    { avant: "  if (fidele) net -= pourCent(net, REMISE_FIDELITE);\n", apres: "" },
    { avant: "function fraisDePort(pays, poids, ht) {\n  if (poids === 0) return 0;",
      apres: "function fraisDePort(pays, poids, ht, fidele) {\n  if (poids === 0 || fidele) return 0;" },
    { avant: '  var port = fraisDePort(commande.pays, somme("poids"), ht);',
      apres: '  var port = fraisDePort(commande.pays, somme("poids"), ht, commande.fidele);' }
  ]
};

module.exports = { CHANGEMENT_4: CHANGEMENT_4 };
