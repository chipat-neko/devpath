/* LE BANC : l'algorithme étendu, mis à l'épreuve dans ton navigateur.

   La fonction ci-dessous n'est pas recopiée : elle est extraite d'algo.js au moment où
   cette page est assemblée. @@ORIGINE@@ */

@@EUCLIDE@@

function point(nom, valeur) {
  var l = "  " + nom + " ";
  while (l.length < 44) l += ".";
  return l + " " + valeur;
}

/* 1 — L'identité tient-elle ? On la vérifie au lieu de la croire ------------------ */
console.log("u x a + v x b = pgcd(a, b) ?");
var essais = [[1071, 462], [240, 46], [17, 3120], [99991, 12345]];
essais.forEach(function (p) {
  var r = euclideEtendu(p[0], p[1]);
  var gauche = r.u * p[0] + r.v * p[1];
  console.log(point("  " + p[0] + " et " + p[1],
    "pgcd " + r.d + "  u " + r.u + "  v " + r.v + "  ->  " + gauche + (gauche === r.d ? "  vrai" : "  FAUX")));
});
console.log("");

/* 2 — Quelle paire coûte le plus de tours ? ------------------------------------- */
var record = 0, championne = null, combien = 0;
for (var a = 1; a <= 1000; a++) {
  for (var b = 1; b <= a; b++) {
    var t = euclideEtendu(a, b).tours;
    if (t > record) { record = t; championne = [a, b]; combien = 1; }
    else if (t === record) combien++;
  }
}
var fib = [1, 1];
while (fib[fib.length - 1] < 2000) fib.push(fib[fib.length - 1] + fib[fib.length - 2]);
var estFib = false;
for (var i = 1; i < fib.length; i++) {
  if (fib[i] === championne[0] && fib[i - 1] === championne[1]) estFib = true;
}
console.log("La paire la plus coûteuse jusqu'à 1000 :");
console.log(point("  paire", "(" + championne[0] + ", " + championne[1] + ")"));
console.log(point("  tours", record));
console.log(point("  paires qui atteignent ce record", combien));
console.log(point("  deux Fibonacci consécutifs ?", estFib ? "oui" : "non"));
console.log(point("  la suite", fib.join(" ")));
console.log("");

/* 3 — À quoi cela sert : chiffrer et déchiffrer ---------------------------------- */
/* Le plus petit RSA qui marche. p et q sont deux nombres premiers ; n est leur
   produit ; e est l'exposant public. La clé PRIVÉE, c'est l'inverse de e modulo
   (p-1)(q-1) — et cet inverse, seul l'algorithme étendu le donne. */
var p = 61, q = 53, n = p * q, phi = (p - 1) * (q - 1), e = 17;
var r = euclideEtendu(e, phi);
var d = ((r.u % phi) + phi) % phi;
console.log("Un RSA minuscule : p = " + p + ", q = " + q + ", n = " + n + ", e = " + e);
console.log(point("  pgcd(e, phi)", r.d + (r.d === 1 ? "  (e est bien inversible)" : "  (raté)")));
console.log(point("  clé privée d = inverse de e mod " + phi, d));
console.log(point("  vérification e x d mod phi", (e * d) % phi));

function puissanceMod(base, exposant, module) {
  var res = 1;
  base = base % module;
  while (exposant > 0) {
    if (exposant % 2 === 1) res = (res * base) % module;
    exposant = Math.floor(exposant / 2);
    base = (base * base) % module;
  }
  return res;
}

var message = 65;
var chiffre = puissanceMod(message, e, n);
var dechiffre = puissanceMod(chiffre, d, n);
console.log(point("  message " + message + " chiffré", chiffre));
console.log(point("  puis déchiffré", dechiffre + (dechiffre === message ? "  retrouvé" : "  PERDU")));
console.log("");
console.log("Sans l'algorithme d'Euclide étendu, la ligne « clé privée » serait vide.");
