'use strict';
/**
 * tools/etudes/inconnu/modif.js — la MODIFICATION demandée à l'apprenant, transcrite.
 *
 * L'exercice de l'étude nº 6 : ajouter au rapport une colonne MVTS donnant le nombre de
 * mouvements RETENUS par article (les lignes rejetées n'y comptent pas).
 *
 * Ce fichier ne réécrit pas le programme : il réutilise les briques de `transcription.js`
 * — donc les mêmes règles d'impression que Go — et ne change que ce que la modification
 * change. La sortie attendue publiée dans la page est celle qu'il produit, exécutée à
 * l'assemblage. Elle n'est donc jamais tapée à la main.
 *
 *   node tools/etudes/inconnu/modif.js
 */

const T = require('./transcription.js');

function soldesEtMouvements(lignes) {
  // `Object.create(null)` pour la même raison que dans transcription.js : un objet
  // ordinaire hérite de Object.prototype, une map de Go n'hérite de rien.
  const stock = Object.create(null);
  const mouvements = Object.create(null);   // le compteur ajouté par la modification
  const rejets = [];
  lignes.forEach(function (ligne) {
    const r = T.analyser(ligne);
    if (r.err !== null) { rejets.push(r.err); return; }
    stock[r.m.Article] = (stock[r.m.Article] || 0) + r.m.Quantite;
    mouvements[r.m.Article] = (mouvements[r.m.Article] || 0) + 1;
  });
  return { stock: stock, mouvements: mouvements, rejets: rejets };
}

function inventaire(journal) {
  let sortie = '';
  const differes = [];
  differes.push(function () { sortie += T.goPrintln(['-- fin du rapport --']); });

  const r = soldesEtMouvements(journal);
  const articles = T.sortStrings(Object.keys(r.stock));

  sortie += T.goPrintf('%-10s %6s %6s %s\\n', ['ARTICLE', 'SOLDE', 'MVTS', 'ÉTAT']);
  articles.forEach(function (article) {
    let etat = 'ok';
    if (r.stock[article] < 0) { etat = 'IMPOSSIBLE'; }
    else if (r.stock[article] <= 5) { etat = 'à recommander'; }
    sortie += T.goPrintf('%-10s %6d %6d %s\\n', [article, r.stock[article], r.mouvements[article], etat]);
  });

  r.rejets.forEach(function (x) { sortie += T.goPrintln(['rejeté :', x]); });

  sortie += T.goPrintf('%d articles, %d lignes rejetées sur %d\\n',
    [articles.length, r.rejets.length, journal.length]);

  while (differes.length) { differes.pop()(); }
  return sortie;
}

if (require.main === module) {
  process.stdout.write(inventaire(T.JOURNAL));
}

module.exports = { inventaire: inventaire, soldesEtMouvements: soldesEtMouvements };
