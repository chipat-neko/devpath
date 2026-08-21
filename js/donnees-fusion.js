/* =============================================================================
   donnees-fusion.js — fusionner deux sauvegardes au lieu d'en écraser une.

   POURQUOI (point V12-B3). L'import est la SEULE route entre deux machines, et
   il écrasait : celui qui avait fait 30 leçons sur son portable et 12 au bureau
   perdait l'un des deux paquets, sans retour possible. Le fichier importé
   remplaçait purement et simplement les clés locales.

   Ce module donne un VRAI choix — fusionner ou remplacer — et une fusion qui ne
   détruit rien. Il est chargé par les deux seules pages qui importent
   (progression.html et donnees-perso.html) : inutile de l'imposer aux 1 613
   autres.

   RÈGLES DE FUSION, dans l'ordre où elles s'appliquent :
     1. deux scores de QCM `{best, total}` → celui du MEILLEUR RATIO (et non le
        plus grand `best` : 5/5 vaut mieux que 9/10). Départage : le plus grand
        `total` ;
     2. deux tableaux → union sans doublon (leçons faites dans la journée,
        surlignages…) ;
     3. deux objets → fusion clé à clé, récursivement ;
     4. deux nombres → le plus grand (jamais l'addition : une même journée
        d'activité déjà synchronisée serait comptée deux fois) ;
     5. deux booléens → `local || importé` (une leçon terminée le reste) ;
     6. le reste (chaînes, types différents) → LE LOCAL GAGNE : on ne détruit
        jamais ce qui se trouve sur cette machine ;
     7. si une seule des deux valeurs existe, c'est elle.

   Exposé : window.SyntaxeFusion = { fusionner, fusionnerTexte, resume, demanderChoix }
   ============================================================================= */
(function () {
  "use strict";

  function estObjet(v) {
    return v !== null && typeof v === "object" && !Array.isArray(v);
  }

  /* Un score de QCM tel que l'écrit lecon.js : { best, total } et, depuis
     V12-C3, un `rates` facultatif (index des questions manquées). Le test
     reste STRICT — aucune autre clé — pour ne pas confondre un score avec un
     objet quelconque qui aurait un best et un total. */
  var CLES_SCORE = { best: 1, total: 1, rates: 1 };
  function estScore(v) {
    if (!estObjet(v)) return false;
    if (typeof v.best !== "number" || typeof v.total !== "number") return false;
    return Object.keys(v).every(function (k) {
      return CLES_SCORE[k] === 1;
    });
  }

  function meilleurScore(a, b) {
    var ra = a.total > 0 ? a.best / a.total : -1;
    var rb = b.total > 0 ? b.best / b.total : -1;
    if (rb > ra) return b;
    if (ra > rb) return a;
    return b.total > a.total ? b : a; /* même ratio : le QCM le plus long */
  }

  function union(a, b) {
    var out = a.slice();
    var vus = {};
    out.forEach(function (x) {
      vus[JSON.stringify(x)] = true;
    });
    b.forEach(function (x) {
      var c = JSON.stringify(x);
      if (!vus[c]) {
        vus[c] = true;
        out.push(x);
      }
    });
    return out;
  }

  function fusionner(local, importe) {
    if (importe === undefined || importe === null) return local;
    if (local === undefined || local === null) return importe;
    if (estScore(local) && estScore(importe)) return meilleurScore(local, importe);
    if (Array.isArray(local) && Array.isArray(importe)) return union(local, importe);
    if (estObjet(local) && estObjet(importe)) {
      var out = {};
      Object.keys(local).forEach(function (k) {
        out[k] = local[k];
      });
      Object.keys(importe).forEach(function (k) {
        out[k] = Object.prototype.hasOwnProperty.call(local, k)
          ? fusionner(local[k], importe[k])
          : importe[k];
      });
      return out;
    }
    if (typeof local === "number" && typeof importe === "number") {
      return importe > local ? importe : local;
    }
    if (typeof local === "boolean" && typeof importe === "boolean") {
      return local || importe;
    }
    return local; /* chaînes, types différents : on garde ce qui est ici */
  }

  /* Même chose sur deux valeurs STOCKÉES (donc du texte). Une valeur qui n'est
     pas du JSON (le thème, la langue) ne se fusionne pas : le local gagne. */
  function fusionnerTexte(texteLocal, texteImporte) {
    if (texteLocal === null || texteLocal === undefined) return texteImporte;
    if (texteImporte === null || texteImporte === undefined) return texteLocal;
    var a, b;
    try {
      a = JSON.parse(texteLocal);
      b = JSON.parse(texteImporte);
    } catch (e) {
      return texteLocal;
    }
    try {
      return JSON.stringify(fusionner(a, b));
    } catch (e) {
      return texteLocal;
    }
  }

  /* Compte ce que contient un paquet, pour que le choix soit éclairé et non
     un pari : « 214 leçons terminées, 88 scores de QCM ». */
  function compter(progress, quiz) {
    var lecons = 0, scores = 0;
    if (estObjet(progress)) {
      Object.keys(progress).forEach(function (c) {
        if (!estObjet(progress[c])) return;
        Object.keys(progress[c]).forEach(function (f) {
          if (progress[c][f]) lecons++;
        });
      });
    }
    if (estObjet(quiz)) {
      Object.keys(quiz).forEach(function (c) {
        if (!estObjet(quiz[c])) return;
        Object.keys(quiz[c]).forEach(function (f) {
          if (estObjet(quiz[c][f])) scores += Object.keys(quiz[c][f]).length;
        });
      });
    }
    return { lecons: lecons, scores: scores };
  }

  function resume(progress, quiz) {
    var c = compter(progress, quiz);
    return c.lecons + " leçon" + (c.lecons > 1 ? "s" : "") + " terminée" +
      (c.lecons > 1 ? "s" : "") + " · " + c.scores + " score" + (c.scores > 1 ? "s" : "") +
      " de QCM";
  }

  /* Panneau de choix injecté dans la page — pas une boîte du navigateur : il
     faut TROIS réponses (fusionner, remplacer, annuler) et window.confirm n'en
     offre que deux. Rappelle ce que contient chaque côté avant de trancher. */
  function demanderChoix(hote, texteFichier, texteLocal, surReponse) {
    if (!hote) return surReponse("annuler");
    var ancien = hote.parentNode.querySelector(".import-choix");
    if (ancien) ancien.parentNode.removeChild(ancien);

    var bloc = document.createElement("div");
    bloc.className = "import-choix";
    bloc.setAttribute("role", "group");
    bloc.setAttribute("aria-label", "Que faire du fichier importé ?");

    var p = document.createElement("p");
    p.className = "import-choix__texte";
    p.textContent =
      "Fichier : " + texteFichier + ". Sur cet appareil : " + texteLocal + ".";
    bloc.appendChild(p);

    var actions = document.createElement("div");
    actions.className = "import-choix__actions";

    function bouton(libelle, classe, reponse, description) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "btn btn--sm " + classe;
      b.textContent = libelle;
      if (description) b.title = description;
      b.addEventListener("click", function () {
        if (bloc.parentNode) bloc.parentNode.removeChild(bloc);
        surReponse(reponse);
      });
      actions.appendChild(b);
      return b;
    }

    var premier = bouton(
      "Fusionner",
      "btn--primary",
      "fusion",
      "Garde tout : l'union des leçons terminées et le meilleur score de chaque QCM."
    );
    bouton(
      "Remplacer",
      "btn--secondary",
      "remplacer",
      "Remplace par le contenu du fichier ce que cet appareil a déjà."
    );
    bouton("Annuler", "btn--ghost", "annuler", "Ne rien changer.");

    bloc.appendChild(actions);

    var aide = document.createElement("p");
    aide.className = "import-choix__aide";
    aide.textContent =
      "« Fusionner » garde l'union des leçons terminées et le meilleur score de " +
      "chaque QCM : rien n'est perdu des deux côtés. « Remplacer » écrase ce que cet " +
      "appareil a déjà par le contenu du fichier.";
    bloc.appendChild(aide);

    hote.parentNode.insertBefore(bloc, hote.nextSibling);
    premier.focus();
  }

  window.SyntaxeFusion = {
    fusionner: fusionner,
    fusionnerTexte: fusionnerTexte,
    resume: resume,
    compter: compter,
    demanderChoix: demanderChoix,
  };
})();
