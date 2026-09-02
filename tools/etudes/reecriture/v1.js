/* VERSION 1 — celle qui tourne en production depuis deux ans.

   Le besoin : à partir des commandes d'un mois, produire le relevé qu'on envoie au
   comptable. Ce code est JUSTE : il donne les bons chiffres, il n'a jamais planté, et
   personne ne l'a jamais réécrit parce que « ça marche ».

   Elle a été écrite d'un trait, en suivant l'ordre dans lequel les règles sont arrivées :
   d'abord la France, puis la Belgique, puis l'Allemagne, puis la Suisse ; d'abord les
   livres, puis la papeterie, puis le numérique. Chaque règle a été ajoutée là où on
   travaillait ce jour-là. */

function releve(commandes) {
  var sortie = "";
  var totHT = 0, totTVA = 0, totTTC = 0, totPort = 0;
  var parPays = {};
  sortie += "RELEVÉ DU MOIS\n";
  sortie += "==============\n";
  for (var i = 0; i < commandes.length; i++) {
    var c = commandes[i];
    var ht = 0;
    var poids = 0;
    var tva = 0;
    var det = "";
    for (var j = 0; j < c.lignes.length; j++) {
      var l = c.lignes[j];
      var brut = l.prix * l.qte;
      var rem = 0;
      if (l.qte >= 25) {
        rem = Math.round(brut * 10 / 100);
      } else if (l.qte >= 10) {
        rem = Math.round(brut * 5 / 100);
      }
      var net = brut - rem;
      if (c.fidele) {
        net = net - Math.round(net * 3 / 100);
      }
      ht += net;
      if (l.cat !== "numerique") {
        poids += l.poids * l.qte;
      }
      var t;
      if (c.pays === "FR") {
        if (l.cat === "livre") { t = 55; } else { t = 200; }
      } else if (c.pays === "BE") {
        if (l.cat === "livre") { t = 60; } else { t = 210; }
      } else if (c.pays === "DE") {
        if (l.cat === "livre") { t = 70; } else { t = 190; }
      } else {
        if (l.cat === "livre") { t = 26; } else { t = 81; }
      }
      tva += Math.round(net * t / 1000);
      det += "    " + l.titre;
      for (var k = l.titre.length; k < 26; k++) { det += " "; }
      det += " x" + l.qte;
      if (l.qte < 10) { det += " "; }
      det += "  " + (net / 100).toFixed(2) + "\n";
    }
    var port = 0;
    if (poids > 0) {
      if (c.pays === "FR") {
        if (ht < 4900) { port = 490; }
      } else if (c.pays === "BE") {
        if (ht < 6900) { port = 690; }
      } else if (c.pays === "DE") {
        if (ht < 6900) { port = 690; }
      } else {
        port = 1490;
      }
      if (poids > 2000 && port > 0) {
        port += Math.ceil((poids - 2000) / 1000) * 200;
      }
    }
    if (port > 0) {
      if (c.pays === "FR") {
        tva += Math.round(port * 200 / 1000);
      } else if (c.pays === "BE") {
        tva += Math.round(port * 210 / 1000);
      } else if (c.pays === "DE") {
        tva += Math.round(port * 190 / 1000);
      } else {
        tva += Math.round(port * 81 / 1000);
      }
    }
    var ttc = ht + port + tva;
    sortie += "\n" + c.id + "  " + c.pays;
    if (c.fidele) { sortie += "  [fidèle]"; }
    sortie += "\n" + det;
    sortie += "    HT " + (ht / 100).toFixed(2) + "  port " + (port / 100).toFixed(2) +
              "  TVA " + (tva / 100).toFixed(2) + "  TTC " + (ttc / 100).toFixed(2) + "\n";
    totHT += ht; totTVA += tva; totTTC += ttc; totPort += port;
    if (!parPays[c.pays]) { parPays[c.pays] = [0, 0]; }
    parPays[c.pays][0] += 1;
    parPays[c.pays][1] += ttc;
  }
  sortie += "\nPAR PAYS\n";
  var pays = Object.keys(parPays).sort();
  for (var p = 0; p < pays.length; p++) {
    sortie += "  " + pays[p] + "  " + parPays[pays[p]][0] + " commandes  " +
              (parPays[pays[p]][1] / 100).toFixed(2) + "\n";
  }
  sortie += "\nTOTAL  HT " + (totHT / 100).toFixed(2) + "  port " + (totPort / 100).toFixed(2) +
            "  TVA " + (totTVA / 100).toFixed(2) + "  TTC " + (totTTC / 100).toFixed(2) + "\n";
  return sortie;
}
