/* Banc d'essai du correcteur d'exercices de ce site.

   Les deux fonctions ci-dessous ne sont PAS des imitations écrites pour l'occasion :
   elles sont extraites de js/lecon.js à chaque assemblage de la page, telles quelles.
   Si le moteur du site change, ce banc change avec lui — et la sortie publiée aussi.

   @@ORIGINE@@ */

@@UNELIGNE@@

@@NORMEXO@@

/* ------------------------------------------------------------------ le banc */

/* Ce que fait le moteur pour un exercice `type:"text"` : il compare la réponse
   normalisée à chacune des réponses acceptées, elles aussi normalisées. */
function accepte(saisie, acceptees) {
  for (var i = 0; i < acceptees.length; i++) {
    if (normExo(acceptees[i]) === normExo(saisie)) return true;
  }
  return false;
}

/* Ce que fait le moteur pour un exercice `type:"code"` : il compare la SORTIE du
   programme à ce qui est attendu — soit en entier, soit ligne par ligne. */
function accepteSortie(sortie, attendu) {
  return normExo(sortie) === normExo(attendu) || uneLigneEgale(sortie, attendu);
}

function ligne(verdict, texte, note) {
  console.log((verdict ? "  ACCEPTE  " : "  refuse   ") + String(texte).padEnd(38) + note);
}

var acceptes = 0, total = 0;
function essai(verdict, texte, note) {
  total++;
  if (verdict) acceptes++;
  ligne(verdict, texte, note);
}

console.log("A. Une réponse courte — l'énoncé attend : élève");
essai(accepte("élève", ["élève"]),      'saisie "élève"',      "la réponse exacte");
essai(accepte("ÉLÈVE", ["élève"]),      'saisie "ÉLÈVE"',      "majuscules, accents gardés");
essai(accepte("eleve", ["élève"]),      'saisie "eleve"',      "clavier sans accents");
essai(accepte("ELEVE", ["élève"]),      'saisie "ELEVE"',      "majuscules ET accents perdus");
essai(accepte("   élève  ", ["élève"]), 'saisie "   élève  "', "espaces autour");
essai(accepte("élève;", ["élève"]),     'saisie "élève;"',     "point-virgule final");
essai(accepte("él ève", ["élève"]),     'saisie "él ève"',     "une espace au milieu : mot différent");
essai(accepte("eleves", ["élève"]),     'saisie "eleves"',     "pluriel : mot différent");

console.log("");
console.log("B. Deux pièges du copier-coller — l'énoncé attend : \"a b\"");
/* \u00A0 est l'espace insécable. Écrite en clair, elle serait indiscernable
   d'une espace ordinaire — c'est exactement le problème qu'elle pose. */
essai(accepte("a\u00A0b", ["a b"]), "saisie avec une espace INSÉCABLE",   "invisible à l'œil");
essai(accepte("“a b”", ['"a b"']),  "saisie avec des guillemets COURBES", "ceux d'un traitement de texte");

console.log("");
console.log("C. La sortie d'un programme — l'énoncé attend : 42");
essai(accepteSortie("42", "42"),                            'sortie "42"',                     "la sortie entière");
essai(accepteSortie("calcul en cours…\n42\ntermine", "42"), 'sortie sur 3 lignes, dont une "42"', "une ligne suffit");
essai(accepteSortie("4200", "42"),                          'sortie "4200"',                   "PAS une inclusion");
essai(accepteSortie("la réponse est 42", "42"),             'sortie "la réponse est 42"',      "la ligne entière doit valoir 42");

console.log("");
console.log(total + " cas, " + acceptes + " acceptés, " + (total - acceptes) + " refusés");
