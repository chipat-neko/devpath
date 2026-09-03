/* Une réponse possible à l'exercice : traiter les lettres que NFD ne décompose
   pas AVANT la normalisation, puis vérifier qu'on n'a rien cassé au passage. */
/*@@SLUGIFY@@*/

var TABLE = {
  "œ": "oe", "Œ": "OE", "æ": "ae", "Æ": "AE", "ß": "ss", "ﬁ": "fi", "ﬂ": "fl",
  "ł": "l", "Ł": "L", "ø": "o", "Ø": "O", "đ": "d", "Đ": "D", "ı": "i",
};

function slugifyV2(s) {
  var deplie = String(s).replace(/[œŒæÆßﬁﬂłŁøØđĐı]/g, function (c) { return TABLE[c]; });
  return slugify(deplie);
}

var corpus = [
  "Le nœud et la tête",
  "Le problème : une grille pour l'œil, pas pour l'oreille",
  "Straße",
  "Cæsar",
  "ﬂeur",
  "Łódź",
  "Øst",
  "Les tableaux",
  "Portée et fermetures",
  "ES2015 (ES6) : les nouveautés",
  "C++ ou C# ?",
  "日本語",
];

var change = 0, identique = 0;
corpus.forEach(function (t) {
  var avant = slugify(t), apres = slugifyV2(t);
  if (avant === apres) { identique++; return; }
  change++;
  console.log("« " + t + " »");
  console.log("   avant : " + JSON.stringify(avant));
  console.log("   après : " + JSON.stringify(apres));
});
console.log("---");
console.log("fragments modifiés  : " + change + " / " + corpus.length);
console.log("fragments inchangés : " + identique + " / " + corpus.length);
console.log("slugifyV2(null) lève-t-elle encore ? " + (function () {
  try { slugifyV2(null); return "non — String(null) donne \"null\", et le fragment vaut " + JSON.stringify(slugifyV2(null)); }
  catch (e) { return "oui, " + e.name; }
})());
