/* LE DOMAINE DE VALIDITÉ — ce que l'algorithme ne dit pas de lui-même.

   Le code d'algo.js est juste… sur les entiers positifs représentables. Nulle part il
   n'écrit cette condition. Ce fichier mesure ce qui se passe en dehors, puis applique
   un garde-fou et vérifie qu'il n'abîme rien.

   C'est la matière de l'exercice de l'étude : personne ne « voit » un domaine de
   validité en relisant ; on le trouve en essayant les bords. */

var fs = require("fs");
var path = require("path");
var ICI = __dirname;

function source() { return fs.readFileSync(path.join(ICI, "algo.js"), "utf8").replace(/\r\n/g, "\n"); }
function charger(src) {
  return new Function(src + "\nreturn { euclideEtendu: euclideEtendu, pgcd: pgcd };")();
}

/* Le garde-fou proposé en solution : trois lignes, en tête de la fonction. */
var ANCRE = "  var a0 = a, b0 = b;";
var GARDE = [
  "  if (!Number.isInteger(a) || !Number.isInteger(b)) throw new TypeError(\"euclideEtendu : entiers attendus\");",
  "  if (!Number.isSafeInteger(a) || !Number.isSafeInteger(b)) throw new RangeError(\"euclideEtendu : au-delà de 2^53, les entiers ne sont plus exacts — passer aux BigInt\");",
  "  if (a < 0 || b < 0) throw new RangeError(\"euclideEtendu : entrées positives attendues\");",
  ANCRE
].join("\n");

var CAS = [
  { nom: "deux entiers positifs", a: 1071, b: 462, attendu: "le cas prévu" },
  { nom: "un négatif", a: 12, b: -18, attendu: "un « plus grand diviseur » NÉGATIF" },
  { nom: "deux négatifs", a: -12, b: -18, attendu: "un « plus grand diviseur » NÉGATIF" },
  { nom: "au-delà de 2 puissance 53", a: 9007199254740993, b: 3, attendu: "l'identité de Bézout devient FAUSSE" },
  { nom: "un nombre à virgule", a: 10.5, b: 3, attendu: "un « diviseur » de 1,5" }
];

function essayer(fn, cas) {
  try {
    var r = fn(cas.a, cas.b);
    return {
      nom: cas.nom, a: cas.a, b: cas.b, attendu: cas.attendu,
      d: r.d, u: r.u, v: r.v,
      bezout: r.u * cas.a + r.v * cas.b === r.d,
      pgcdPositif: r.d > 0,
      leve: null
    };
  } catch (e) {
    return { nom: cas.nom, a: cas.a, b: cas.b, attendu: cas.attendu, leve: e.constructor.name };
  }
}

function mesurer() {
  var sansGarde = charger(source()).euclideEtendu;
  var src = source();
  if (src.indexOf(ANCRE) === -1) throw new Error("l'ancre du garde-fou est introuvable dans algo.js");
  var avecGarde = charger(src.replace(ANCRE, GARDE)).euclideEtendu;

  var avant = CAS.map(function (c) { return essayer(sansGarde, c); });
  var apres = CAS.map(function (c) { return essayer(avecGarde, c); });

  /* Le garde-fou ne vaut que s'il ne casse rien : on rejoue TOUTES les paires
     jusqu'à 300 et on exige le même résultat qu'avant, à l'identique. */
  var rejouees = 0, divergences = 0;
  for (var a = 1; a <= 300; a++) {
    for (var b = 1; b <= 300; b++) {
      rejouees++;
      var x = sansGarde(a, b), y = avecGarde(a, b);
      if (x.d !== y.d || x.u !== y.u || x.v !== y.v) divergences++;
    }
  }

  return { cas: CAS, avant: avant, apres: apres, garde: GARDE,
           rejouees: rejouees, divergences: divergences,
           attrapes: apres.filter(function (r) { return r.leve; }).length,
           faux: avant.filter(function (r) { return !r.bezout || !r.pgcdPositif; }).length };
}

function point(nom, valeur) {
  var l = "  " + nom + " ";
  while (l.length < 44) l += ".";
  return l + " " + valeur;
}

if (require.main === module) {
  var m = mesurer();
  console.log("LE DOMAINE DE VALIDITÉ, MESURÉ AUX BORDS");
  console.log("========================================");
  console.log("");
  console.log("Tel que publié :");
  m.avant.forEach(function (r) {
    console.log(point("  " + r.nom, r.leve ? "lève " + r.leve
      : "pgcd " + r.d + "  ·  Bézout " + (r.bezout ? "vrai" : "FAUX") +
        "  ·  résultat " + (r.pgcdPositif ? "positif" : "NÉGATIF")));
  });
  console.log("");
  console.log("Avec le garde-fou de trois lignes :");
  m.apres.forEach(function (r) {
    console.log(point("  " + r.nom, r.leve ? "refusé (" + r.leve + ")"
      : "accepté  ·  pgcd " + r.d + "  ·  Bézout " + (r.bezout ? "vrai" : "FAUX")));
  });
  console.log("");
  console.log(point("  cas hors domaine refusés", m.attrapes + " sur " + (m.cas.length - 1)));
  console.log(point("  paires rejouées après ajout du garde", m.rejouees));
  console.log(point("  résultats qui ont changé", m.divergences));
}

module.exports = { mesurer: mesurer, GARDE: GARDE, ANCRE: ANCRE };
