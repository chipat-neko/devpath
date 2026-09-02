/* Mesure un fichier JavaScript. Aucune de ces mesures n'est un jugement : ce sont des
   comptages, et chacun est verifiable a la main sur un petit fichier.

   Precaution qui change tout : on retire d'abord les commentaires et le contenu des
   chaines. Sans cela, le mot « if » d'un commentaire compterait comme une decision, et
   le « 26 » d'un texte comme un nombre magique. */

function nettoyer(src, garderChaines) {
  var out = "", i = 0, n = src.length;
  var etat = "code", quote = "";
  while (i < n) {
    var c = src[i], d = src[i + 1];
    if (etat === "code") {
      if (c === "/" && d === "*") { etat = "bloc"; out += "  "; i += 2; continue; }
      if (c === "/" && d === "/") { etat = "ligne"; out += "  "; i += 2; continue; }
      if (c === '"' || c === "'") { etat = "chaine"; quote = c; out += c; i++; continue; }
      out += c; i++; continue;
    }
    if (etat === "bloc") {
      if (c === "*" && d === "/") { etat = "code"; out += "  "; i += 2; continue; }
      out += (c === "\n" ? "\n" : " "); i++; continue;
    }
    if (etat === "ligne") {
      if (c === "\n") { etat = "code"; out += "\n"; i++; continue; }
      out += " "; i++; continue;
    }
    /* chaine */
    if (c === "\\") { out += "  "; i += 2; continue; }
    if (c === quote) { etat = "code"; out += c; i++; continue; }
    out += (garderChaines ? c : " "); i++;
  }
  return out;
}

/* Les fonctions et leur longueur, en suivant l'equilibre des accolades. */
function fonctions(propre) {
  var lignes = propre.split("\n");
  var trouvees = [], pile = [];
  var profondeur = 0;
  for (var i = 0; i < lignes.length; i++) {
    var l = lignes[i];
    for (var k = 0; k < l.length; k++) {
      if (l[k] === "{") {
        profondeur++;
        if (/function[^{]*$/.test(l.slice(0, k))) pile.push({ debut: i + 1, ouverte: profondeur });
      } else if (l[k] === "}") {
        if (pile.length && pile[pile.length - 1].ouverte === profondeur) {
          var f = pile.pop();
          f.fin = i + 1;
          f.lignes = f.fin - f.debut + 1;
          trouvees.push(f);
        }
        profondeur--;
      }
    }
  }
  return trouvees;
}

/* Profondeur maximale d'imbrication A L'INTERIEUR d'une fonction : le niveau 1 est le
   corps de la fonction, le niveau 2 un if dedans, etc. */
function imbricationMax(propre) {
  var prof = 0, max = 0;
  for (var i = 0; i < propre.length; i++) {
    if (propre[i] === "{") { prof++; if (prof > max) max = prof; }
    else if (propre[i] === "}") prof--;
  }
  return max;
}

function compter(propre, motif) {
  var m = propre.match(motif);
  return m ? m.length : 0;
}

/* Nombres litteraux DANS le corps des fonctions, hors 0 et 1 (qui ne veulent
   generalement rien dire de metier) et hors indices evidents. Un nombre ecrit en tete
   de fichier et porte par un nom n'est pas magique : il est nomme. */
function nombresMagiques(propre) {
  var fns = fonctions(propre);
  var dedans = {};
  fns.forEach(function (f) { for (var i = f.debut; i <= f.fin; i++) dedans[i] = 1; });
  var lignes = propre.split("\n"), total = 0, distincts = {};
  for (var i = 0; i < lignes.length; i++) {
    if (!dedans[i + 1]) continue;
    var m = lignes[i].match(/(?:^|[^\w.$])(\d+(?:\.\d+)?)/g) || [];
    m.forEach(function (brut) {
      var v = brut.replace(/^[^\d]*/, "");
      if (v === "0" || v === "1") return;
      total++; distincts[v] = (distincts[v] || 0) + 1;
    });
  }
  return { total: total, distincts: Object.keys(distincts).length, detail: distincts };
}

function mesurer(src) {
  var propre = nettoyer(src);
  var sansCommentaires = nettoyer(src, true);
  var lignesTotales = src.replace(/\n$/, "").split("\n").length;
  var effectives = propre.split("\n").filter(function (l) { return l.trim() !== ""; }).length;
  var fns = fonctions(propre);
  var plusLongue = fns.reduce(function (a, f) { return f.lignes > a.lignes ? f : a; }, { lignes: 0, debut: 0 });
  var magiques = nombresMagiques(propre);
  return {
    lignesTotales: lignesTotales,
    effectives: effectives,
    fonctions: fns.length,
    plusLongue: plusLongue.lignes,
    plusLongueDebut: plusLongue.debut,
    imbricationMax: imbricationMax(propre),
    decisions: compter(propre, /\bif\b|\bfor\b|\bwhile\b|\bcase\b|\?|&&|\|\|/g),
    codesPays: compter(sansCommentaires, /"(?:FR|BE|DE|CH)"/g),
    testsDePays: compter(sansCommentaires, /\bpays\s*===/g),
    magiques: magiques.total,
    magiquesDistincts: magiques.distincts,
    detailMagiques: magiques.detail
  };
}

module.exports = { mesurer: mesurer, nettoyer: nettoyer, fonctions: fonctions };
