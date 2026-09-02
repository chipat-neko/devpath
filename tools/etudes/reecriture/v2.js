/* VERSION 2 — le même programme, réécrit.

   Contrat : pour toute entrée, la sortie doit être RIGOUREUSEMENT identique à celle de
   la version 1, caractère pour caractère. Une réécriture qui change un centime n'est pas
   une réécriture, c'est un changement de comportement déguisé.

   Trois idees, et rien d'autre :
     1. les règles qui varient par pays sont des DONNÉES, pas des branchements ;
     2. calculer et mettre en forme sont deux métiers séparés ;
     3. chaque fonction rend une valeur et ne modifie rien d'autre. */

/* ------------------------------------------------------------------ les règles
   Un pays = une ligne. Ajouter un pays, c'est ajouter une ligne ici, et rien ailleurs.
   Les taux sont en pour mille pour rester entiers (55 = 5,5 %). */
var PAYS = {
  FR: { tvaReduite: 55, tvaNormale: 200, port: 490,  francoDes: 4900 },
  BE: { tvaReduite: 60, tvaNormale: 210, port: 690,  francoDes: 6900 },
  DE: { tvaReduite: 70, tvaNormale: 190, port: 690,  francoDes: 6900 },
  CH: { tvaReduite: 26, tvaNormale: 81,  port: 1490, francoDes: null }
};

var REMISES_VOLUME = [ { desQte: 25, pourCent: 10 }, { desQte: 10, pourCent: 5 } ];
var REMISE_FIDELITE = 3;          /* pour cent, sur chaque ligne */
var POIDS_INCLUS = 2000;          /* grammes couverts par le port de base */
var SUPPLEMENT_PAR_KILO = 200;    /* centimes, par kilo entamé au-delà */
var TAUX_REDUIT_POUR = "livre";   /* les autres catégories sont au taux normal */
var SANS_POIDS = "numerique";

/* --------------------------------------------------------------- les calculs
   Aucune de ces fonctions n'écrit dans une variable extérieure : on peut donc les
   appeler dans n'importe quel ordre, et les essayer une par une. */

function pourCent(montant, taux) { return Math.round(montant * taux / 100); }
function pourMille(montant, taux) { return Math.round(montant * taux / 1000); }

function remiseVolume(qte, brut) {
  for (var i = 0; i < REMISES_VOLUME.length; i++) {
    if (qte >= REMISES_VOLUME[i].desQte) return pourCent(brut, REMISES_VOLUME[i].pourCent);
  }
  return 0;
}

function netDeLigne(ligne, fidele) {
  var brut = ligne.prix * ligne.qte;
  var net = brut - remiseVolume(ligne.qte, brut);
  if (fidele) net -= pourCent(net, REMISE_FIDELITE);
  return net;
}

function tauxTva(pays, categorie) {
  var regles = PAYS[pays];
  return categorie === TAUX_REDUIT_POUR ? regles.tvaReduite : regles.tvaNormale;
}

function poidsDeLigne(ligne) {
  return ligne.cat === SANS_POIDS ? 0 : ligne.poids * ligne.qte;
}

function fraisDePort(pays, poids, ht) {
  if (poids === 0) return 0;
  var regles = PAYS[pays];
  if (regles.francoDes !== null && ht >= regles.francoDes) return 0;
  var port = regles.port;
  if (poids > POIDS_INCLUS) {
    port += Math.ceil((poids - POIDS_INCLUS) / 1000) * SUPPLEMENT_PAR_KILO;
  }
  return port;
}

/* Rend tout ce qu'on sait d'une commande, sans rien afficher. C'est cette valeur
   qu'un test compare, et c'est elle qu'une autre sortie (CSV, JSON) réutiliserait. */
function calculerCommande(commande) {
  var lignes = commande.lignes.map(function (ligne) {
    var net = netDeLigne(ligne, commande.fidele);
    return {
      titre: ligne.titre,
      qte: ligne.qte,
      net: net,
      poids: poidsDeLigne(ligne),
      tva: pourMille(net, tauxTva(commande.pays, ligne.cat))
    };
  });
  function somme(champ) {
    return lignes.reduce(function (t, l) { return t + l[champ]; }, 0);
  }
  var ht = somme("net");
  var port = fraisDePort(commande.pays, somme("poids"), ht);
  var tva = somme("tva") + (port > 0 ? pourMille(port, PAYS[commande.pays].tvaNormale) : 0);
  return { id: commande.id, pays: commande.pays, fidele: commande.fidele, lignes: lignes,
           ht: ht, port: port, tva: tva, ttc: ht + port + tva };
}

/* ------------------------------------------------------------- la mise en forme
   Elle ne calcule rien : elle ne reçoit que des nombres déjà arrêtés. */

function euros(centimes) { return (centimes / 100).toFixed(2); }

function completer(texte, largeur) {
  while (texte.length < largeur) texte += " ";
  return texte;
}

function ligneImprimee(l) {
  return "    " + completer(l.titre, 26) + " " + completer("x" + l.qte, 4) + " " + euros(l.net);
}

function commandeImprimee(cmd) {
  var lignes = [cmd.id + "  " + cmd.pays + (cmd.fidele ? "  [fidèle]" : "")];
  cmd.lignes.forEach(function (l) { lignes.push(ligneImprimee(l)); });
  lignes.push("    HT " + euros(cmd.ht) + "  port " + euros(cmd.port) +
              "  TVA " + euros(cmd.tva) + "  TTC " + euros(cmd.ttc));
  return lignes.join("\n");
}

function recapParPays(calculees) {
  var parPays = {};
  calculees.forEach(function (c) {
    if (!parPays[c.pays]) parPays[c.pays] = { nb: 0, ttc: 0 };
    parPays[c.pays].nb += 1;
    parPays[c.pays].ttc += c.ttc;
  });
  return Object.keys(parPays).sort().map(function (p) {
    return "  " + p + "  " + parPays[p].nb + " commandes  " + euros(parPays[p].ttc);
  }).join("\n");
}

function total(calculees, champ) {
  return calculees.reduce(function (t, c) { return t + c[champ]; }, 0);
}

function releve(commandes) {
  var calculees = commandes.map(calculerCommande);
  var blocs = ["RELEVÉ DU MOIS", "=============="];
  calculees.forEach(function (c) { blocs.push("", commandeImprimee(c)); });
  blocs.push("", "PAR PAYS", recapParPays(calculees));
  blocs.push("", "TOTAL  HT " + euros(total(calculees, "ht")) +
                 "  port " + euros(total(calculees, "port")) +
                 "  TVA " + euros(total(calculees, "tva")) +
                 "  TTC " + euros(total(calculees, "ttc")));
  return blocs.join("\n") + "\n";
}
