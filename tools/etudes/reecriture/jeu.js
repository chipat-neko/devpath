/* Le jeu d'essai. Deux jeux, pour deux usages différents.

   VITRINE : douze commandes écrites à la main, choisies pour traverser toutes les
   règles au moins une fois — les quatre pays, les trois catégories, un client fidèle et
   un qui ne l'est pas, une commande juste sous le seuil de port offert et une juste
   au-dessus, un colis de plus de deux kilos, une commande cent pour cent numérique.
   C'est celle qu'on imprime.

   TIRAGE : des commandes engendrées par un générateur pseudo-aléatoire à graine fixe.
   Le même appel rend toujours la même suite : on peut donc comparer deux versions du
   programme sur dix mille commandes sans stocker dix mille commandes. */

var TITRES = ["Le Comte de Monte-Cristo", "Carnet A5 pointillé", "Guide du Rust", "Stylo plume",
              "Manuel de typographie", "Cours de piano (PDF)", "Agenda 2027", "Atlas historique",
              "Encre bleue 50 ml", "Petit traité du réseau", "Cahier de croquis", "Roman graphique"];
var CATS = ["livre", "papeterie", "numerique"];

function vitrine() {
  return [
    { id: "C-001", pays: "FR", fidele: false, lignes: [
      { titre: "Le Comte de Monte-Cristo", cat: "livre", prix: 1290, qte: 2, poids: 620 },
      { titre: "Carnet A5 pointillé", cat: "papeterie", prix: 750, qte: 1, poids: 240 } ] },
    { id: "C-002", pays: "FR", fidele: true, lignes: [
      { titre: "Guide du Rust", cat: "livre", prix: 3900, qte: 1, poids: 890 },
      { titre: "Stylo plume", cat: "papeterie", prix: 1800, qte: 1, poids: 60 } ] },
    { id: "C-003", pays: "FR", fidele: false, lignes: [
      { titre: "Manuel de typographie", cat: "livre", prix: 2450, qte: 12, poids: 700 } ] },
    { id: "C-004", pays: "BE", fidele: false, lignes: [
      { titre: "Cours de piano (PDF)", cat: "numerique", prix: 1500, qte: 1, poids: 0 } ] },
    { id: "C-005", pays: "BE", fidele: true, lignes: [
      { titre: "Agenda 2027", cat: "papeterie", prix: 1650, qte: 3, poids: 380 },
      { titre: "Atlas historique", cat: "livre", prix: 4900, qte: 1, poids: 1400 } ] },
    { id: "C-006", pays: "DE", fidele: false, lignes: [
      { titre: "Encre bleue 50 ml", cat: "papeterie", prix: 890, qte: 25, poids: 120 } ] },
    { id: "C-007", pays: "DE", fidele: true, lignes: [
      { titre: "Petit traité du réseau", cat: "livre", prix: 2900, qte: 1, poids: 540 } ] },
    { id: "C-008", pays: "CH", fidele: false, lignes: [
      { titre: "Cahier de croquis", cat: "papeterie", prix: 1290, qte: 2, poids: 460 },
      { titre: "Roman graphique", cat: "livre", prix: 2200, qte: 1, poids: 780 } ] },
    { id: "C-009", pays: "CH", fidele: true, lignes: [
      { titre: "Cours de piano (PDF)", cat: "numerique", prix: 1500, qte: 4, poids: 0 } ] },
    { id: "C-010", pays: "FR", fidele: false, lignes: [
      { titre: "Atlas historique", cat: "livre", prix: 4900, qte: 1, poids: 1400 } ] },
    { id: "C-011", pays: "FR", fidele: false, lignes: [
      { titre: "Atlas historique", cat: "livre", prix: 4900, qte: 1, poids: 1400 },
      { titre: "Stylo plume", cat: "papeterie", prix: 1800, qte: 1, poids: 60 } ] },
    { id: "C-013", pays: "FR", fidele: false, lignes: [
      { titre: "Cahier de croquis", cat: "papeterie", prix: 1200, qte: 3, poids: 900 } ] },
    { id: "C-014", pays: "CH", fidele: false, lignes: [
      { titre: "Atlas historique", cat: "livre", prix: 4900, qte: 3, poids: 1400 } ] },
    { id: "C-012", pays: "BE", fidele: false, lignes: [
      { titre: "Guide du Rust", cat: "livre", prix: 3900, qte: 3, poids: 890 },
      { titre: "Encre bleue 50 ml", cat: "papeterie", prix: 890, qte: 10, poids: 120 } ] }
  ];
}

/* Générateur congruentiel linéaire — le meme que celui des bancs precedents du site.
   Graine fixe, donc suite fixe : deux executions comparent les memes commandes. */
function tirage(combien, graine, options) {
  options = options || {};
  var qteMax = options.qteMax || 30;
  var etat = graine >>> 0;
  function suivant() { etat = (etat * 1103515245 + 12345) >>> 0; return etat / 4294967296; }
  function entre(a, b) { return a + Math.floor(suivant() * (b - a + 1)); }
  var pays = options.pays || ["FR", "BE", "DE", "CH"];
  var out = [];
  for (var i = 0; i < combien; i++) {
    var nb = entre(1, 4);
    var lignes = [];
    for (var j = 0; j < nb; j++) {
      var cat = CATS[entre(0, 2)];
      lignes.push({
        titre: TITRES[entre(0, TITRES.length - 1)],
        cat: cat,
        prix: entre(1, 120) * 50,
        qte: entre(1, qteMax),
        poids: cat === "numerique" ? 0 : entre(1, 30) * 60
      });
    }
    out.push({ id: "T-" + (10000 + i), pays: pays[entre(0, pays.length - 1)],
               fidele: entre(0, 1) === 1, lignes: lignes });
  }
  return out;
}

module.exports = { vitrine: vitrine, tirage: tirage };
