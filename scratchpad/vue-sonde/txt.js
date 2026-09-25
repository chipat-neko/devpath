/* Mesure d'un texte candidat : caracteres, mots, densite, mots de 9+ lettres. */
process.argv.slice(2).forEach(function (t) {
  var w = t.match(/[A-Za-zÀ-ÿ0-9_]+/g) || [];
  var longs = t.toLowerCase().match(/[a-zà-ÿ][a-zà-ÿ-]{8,}/g) || [];
  console.log("car=" + t.length + "  mots=" + w.length +
    "  dens=" + (w.length ? (w.join("").length / w.length).toFixed(3) : "0") +
    "  9+=" + JSON.stringify(Array.from(new Set(longs))));
});
