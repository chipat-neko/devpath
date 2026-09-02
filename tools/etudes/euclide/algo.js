/* L'ALGORITHME D'EUCLIDE, ET SON PROLONGEMENT

   Écrit ici en JavaScript, avec ses invariants. C'est le plus vieil algorithme non
   trivial qui nous soit parvenu — il figure dans les Éléments d'Euclide, livre VII,
   vers 300 avant notre ère, sous forme de soustractions répétées ; le reste et la
   notation qui suivent sont, eux, très postérieurs.

   Quatre fonctions, de la plus ancienne à la plus utile aujourd'hui. */

/* 1. LA VERSION ANTIQUE : retrancher le plus petit du plus grand, jusqu'à l'égalité.
      Invariant : l'ensemble des diviseurs communs de (a, b) ne change JAMAIS, parce
      que tout diviseur de a et de b divise aussi a − b. Comme le couple décroît
      strictement et reste positif, la boucle s'arrête. Ces deux phrases — ce qui ne
      change pas, et ce qui décroît — suffisent à prouver l'algorithme. */
function pgcdParSoustraction(a, b, compteur) {
  while (a !== b) {
    if (a > b) { a = a - b; } else { b = b - a; }
    if (compteur) compteur.tours++;
  }
  return a;
}

/* 2. LA MÊME IDÉE, AVEC LE RESTE : retrancher b de a autant de fois que possible d'un
      seul coup, c'est prendre le reste. Même invariant, mais la décroissance est
      brutale : le reste est toujours strictement plus petit que le diviseur. */
function pgcd(a, b, compteur) {
  while (b !== 0) {
    var reste = a % b;
    a = b;
    b = reste;
    if (compteur) compteur.tours++;
  }
  return a;
}

/* 3. LE PROLONGEMENT : le même calcul, en gardant la trace de CE QU'ON A FAIT.
      À chaque tour on tient deux écritures du couple courant sous la forme
      u × a + v × b. C'est ce qu'on appelle l'identité de Bézout :

          il existe toujours deux entiers u et v tels que  u × a + v × b = pgcd(a, b)

      Invariant, vrai avant et après chaque tour :
          ua × a0 + va × b0 = a        et        ub × a0 + vb × b0 = b
      (a0 et b0 = les valeurs de départ). À la fin, b vaut 0 et a vaut le pgcd :
      l'invariant de gauche EST l'identité cherchée. */
function euclideEtendu(a, b) {
  var a0 = a, b0 = b;
  var ua = 1, va = 0;   /* a = 1 × a0 + 0 × b0 */
  var ub = 0, vb = 1;   /* b = 0 × a0 + 1 × b0 */
  var tours = 0;
  while (b !== 0) {
    var q = Math.floor(a / b);
    var reste = a - q * b;
    /* On applique au couple (u, v) exactement ce qu'on applique au couple (a, b). */
    var nu = ua - q * ub, nv = va - q * vb;
    a = b; b = reste;
    ua = ub; va = vb;
    ub = nu; vb = nv;
    tours++;
  }
  return { d: a, u: ua, v: va, tours: tours, a0: a0, b0: b0 };
}

/* 4. CE À QUOI IL SERT AUJOURD'HUI : l'inverse modulaire.
      Chercher x tel que a × x ≡ 1 (mod n), c'est chercher x et k tels que
      a × x − k × n = 1 — donc exactement une identité de Bézout de valeur 1. Elle
      n'existe que si pgcd(a, n) = 1 : c'est là toute la condition, et l'algorithme la
      rend en même temps que la réponse. Sans cette fonction, pas de RSA. */
function inverseModulaire(a, n) {
  var r = euclideEtendu(a, n);
  if (r.d !== 1) return null;          /* a n'est pas inversible modulo n */
  return ((r.u % n) + n) % n;          /* ramené dans 0 … n−1 */
}
