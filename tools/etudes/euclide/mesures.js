/* Tous les chiffres de l'étude nº 5 sont produits ici, en exécutant l'algorithme.
   Aucun n'est repris d'un livre : chacun est recalculé, et confronté à une référence
   qui, elle, ne sait rien d'Euclide. */

var fs = require("fs");
var path = require("path");
var ICI = __dirname;

var src = fs.readFileSync(path.join(ICI, "algo.js"), "utf8").replace(/\r\n/g, "\n");
var charge = new Function(src + "\nreturn { pgcd: pgcd, pgcdParSoustraction: pgcdParSoustraction," +
                                " euclideEtendu: euclideEtendu, inverseModulaire: inverseModulaire };")();
var pgcd = charge.pgcd;
var pgcdParSoustraction = charge.pgcdParSoustraction;
var euclideEtendu = charge.euclideEtendu;
var inverseModulaire = charge.inverseModulaire;

/* La référence : le plus grand diviseur commun cherché BÊTEMENT, en essayant tous les
   entiers. Elle est lente et manifestement juste — c'est tout ce qu'on lui demande.
   Sans elle, on ne vérifierait Euclide que par Euclide. */
function pgcdParBalayage(a, b) {
  var meilleur = 1;
  var max = Math.min(a, b);
  for (var d = 1; d <= max; d++) {
    if (a % d === 0 && b % d === 0) meilleur = d;
  }
  return meilleur;
}

/* 1 — Euclide dit-il la même chose que la force brute ? -------------------------- */
function confrontation(borne) {
  var paires = 0, ecarts = 0, premierEcart = null;
  for (var a = 1; a <= borne; a++) {
    for (var b = 1; b <= borne; b++) {
      paires++;
      var attendu = pgcdParBalayage(a, b);
      var obtenu = pgcd(a, b);
      if (attendu !== obtenu) {
        ecarts++;
        if (!premierEcart) premierEcart = { a: a, b: b, balayage: attendu, euclide: obtenu };
      }
    }
  }
  return { borne: borne, paires: paires, ecarts: ecarts, premierEcart: premierEcart };
}

/* 2 — L'identité de Bézout tient-elle vraiment, sur chaque paire ? --------------- */
function bezout(borne) {
  var paires = 0, faux = 0, premier = null, maxU = 0;
  for (var a = 1; a <= borne; a++) {
    for (var b = 1; b <= borne; b++) {
      paires++;
      var r = euclideEtendu(a, b);
      if (r.u * a + r.v * b !== r.d || r.d !== pgcdParBalayage(a, b)) {
        faux++;
        if (!premier) premier = { a: a, b: b, u: r.u, v: r.v, d: r.d };
      }
      if (Math.abs(r.u) > maxU) maxU = Math.abs(r.u);
    }
  }
  return { paires: paires, faux: faux, premier: premier, maxU: maxU };
}

/* 3 — Combien de tours, et sur QUELLES paires le maximum est-il atteint ? --------
   On ne suppose rien : on cherche, pour chaque borne, la paire qui coûte le plus de
   tours. Ce que la mesure fait apparaître a un nom — le théorème de Lamé — mais on le
   constate d'abord, et on le nomme ensuite. */
function pireCas(bornes) {
  return bornes.map(function (borne) {
    var record = 0, gagnantes = [], combien = 0;
    for (var a = 1; a <= borne; a++) {
      for (var b = 1; b <= a; b++) {
        var t = euclideEtendu(a, b).tours;
        if (t > record) { record = t; gagnantes = [[a, b]]; combien = 1; }
        else if (t === record) { combien++; if (gagnantes.length < 4) gagnantes.push([a, b]); }
      }
    }
    /* La question n'est pas « ça ressemble à Fibonacci » mais « la plus petite paire
       qui atteint le record est-elle faite de DEUX Fibonacci consécutifs ». On le
       demande au programme, pas à l'œil. */
    var f = fibonacci(borne * 2);
    var premiere = gagnantes[0];
    var estFib = false;
    for (var i = 1; i < f.length; i++) {
      if (f[i] === premiere[0] && f[i - 1] === premiere[1]) estFib = true;
    }
    return { borne: borne, tours: record, paires: gagnantes, combien: combien, premiereEstFibonacci: estFib };
  });
}

/* La suite de Fibonacci, calculée ici — pour pouvoir DIRE si les paires championnes en
   sont, au lieu de le supposer. */
function fibonacci(jusqua) {
  var f = [1, 1];
  while (f[f.length - 1] <= jusqua) f.push(f[f.length - 1] + f[f.length - 2]);
  return f;
}

/* 4 — Le reste contre la soustraction : le même résultat, combien d'opérations ? -- */
function resteContreSoustraction(cas) {
  return cas.map(function (c) {
    var c1 = { tours: 0 }, c2 = { tours: 0 };
    var d1 = pgcd(c[0], c[1], c1);
    var d2 = pgcdParSoustraction(c[0], c[1], c2);
    return { a: c[0], b: c[1], pgcd: d1, memeResultat: d1 === d2,
             toursReste: c1.tours, toursSoustraction: c2.tours };
  });
}

/* 5 — L'inverse modulaire : existe-t-il quand il doit, et est-il juste ? ---------- */
function inverses(n) {
  var attendus = 0, trouves = 0, faux = 0, sansInverse = 0;
  for (var a = 1; a < n; a++) {
    var doitExister = pgcdParBalayage(a, n) === 1;
    if (doitExister) attendus++;
    var x = inverseModulaire(a, n);
    if (x === null) { sansInverse++; if (doitExister) faux++; continue; }
    trouves++;
    if (!doitExister) faux++;
    else if ((a * x) % n !== 1) faux++;
  }
  return { n: n, attendus: attendus, trouves: trouves, sansInverse: sansInverse, faux: faux };
}

function tout() {
  return {
    confrontation: confrontation(300),
    bezout: bezout(300),
    pireCas: pireCas([100, 1000, 10000]),
    fibonacci: fibonacci(20000),
    course: resteContreSoustraction([[1000000, 1], [1000000, 999999], [46368, 28657], [1071, 462]]),
    inversesPremier: inverses(1009),
    inversesCompose: inverses(1000)
  };
}

function point(nom, valeur, largeur) {
  var l = "  " + nom + " ";
  while (l.length < (largeur || 46)) l += ".";
  return l + " " + valeur;
}

if (require.main === module) {
  var r = tout();
  console.log("EUCLIDE, MESURÉ");
  console.log("===============");
  console.log("");
  console.log("1. CONFRONTÉ À LA FORCE BRUTE (toutes les paires jusqu'à " + r.confrontation.borne + ")");
  console.log(point("  paires comparées", r.confrontation.paires));
  console.log(point("  écarts avec le balayage", r.confrontation.ecarts));
  console.log("");
  console.log("2. IDENTITÉ DE BÉZOUT : u × a + v × b = pgcd(a, b)");
  console.log(point("  paires vérifiées", r.bezout.paires));
  console.log(point("  identités fausses", r.bezout.faux));
  console.log(point("  plus grand |u| rencontré", r.bezout.maxU));
  console.log("");
  console.log("3. LE PIRE CAS : quelles paires coûtent le plus de tours ?");
  r.pireCas.forEach(function (p) {
    console.log(point("  jusqu'à " + p.borne, p.tours + " tours  ·  " + p.combien + " paire(s) au record  ·  " +
      p.paires.map(function (x) { return "(" + x[0] + ", " + x[1] + ")"; }).join(" ") +
      (p.premiereEstFibonacci ? "  <- deux Fibonacci consécutifs" : "  <- PAS Fibonacci")));
  });
  console.log(point("  suite de Fibonacci", r.fibonacci.slice(0, 22).join(" ")));
  console.log("");
  console.log("4. LE RESTE CONTRE LA SOUSTRACTION RÉPÉTÉE");
  r.course.forEach(function (c) {
    console.log(point("  pgcd(" + c.a + ", " + c.b + ") = " + c.pgcd,
      c.toursReste + " tour(s) avec le reste, " + c.toursSoustraction + " avec la soustraction"));
  });
  console.log("");
  console.log("5. INVERSE MODULAIRE (la brique de RSA)");
  [r.inversesPremier, r.inversesCompose].forEach(function (i) {
    console.log(point("  modulo " + i.n, i.attendus + " nombres inversibles attendus, " +
      i.trouves + " trouvés, " + i.faux + " faux"));
  });
}

module.exports = { tout: tout, pgcd: pgcd, euclideEtendu: euclideEtendu, inverseModulaire: inverseModulaire,
                   pgcdParBalayage: pgcdParBalayage };
