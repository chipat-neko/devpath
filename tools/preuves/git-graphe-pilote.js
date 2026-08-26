/* =============================================================================
   preuves/git-graphe-pilote.js — LE SCRIPT QUI PILOTE LA VRAIE PAGE.

   Ce fichier n'est pas un module : c'est UNE EXPRESSION JavaScript, lue telle
   quelle par tools/preuves/git-graphe.js et evaluee dans l'onglet Chrome par
   `--attendre=`. Elle est appelee en boucle : au premier appel elle joue la
   session, aux suivants elle rend le resume (ou null tant qu'il n'est pas pret).

   POURQUOI PILOTER LA PAGE PLUTOT QU'UNE PAGE D'ESSAI : une page d'essai
   prouverait que le CODE marche en file://. Elle ne prouverait pas que la PAGE
   de l'apprenant l'utilise correctement — un identifiant mal orthographié, un
   script oublie, un ecouteur jamais pose passeraient. Ici on tape vraiment dans
   le champ, on soumet vraiment le formulaire, et on lit le SVG obtenu.
   ============================================================================= */
(function () {
  if (window.__preuveD3) return window.__preuveD3 === "en cours" ? null : window.__preuveD3;
  window.__preuveD3 = "en cours";
  try {
    var saisie = document.getElementById("bac-saisie");
    var formulaire = document.getElementById("bac-formulaire");
    if (!saisie || !formulaire) throw new Error("la page n'a ni champ de saisie ni formulaire");

    var LIGNES = [
      "reinitialiser",
      'echo "un" > notes.txt',
      "git add notes.txt",
      'git commit -m "premier commit"',
      "git checkout -b sujet",
      'echo "deux" > sujet.txt',
      "git add .",
      'git commit -m "cote sujet"',
      "git checkout main",
      'echo "trois" > principal.txt',
      "git add .",
      'git commit -m "cote principal"',
      "git merge sujet",
      "git tag jalon",
      'echo "brouillon" > brouillon.txt'
    ];
    for (var i = 0; i < LIGNES.length; i++) {
      saisie.value = LIGNES[i];
      formulaire.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
    }

    var svg = document.querySelector("#bac-graphe svg");
    if (!svg) throw new Error("aucun SVG dans le graphe");
    var groupes = svg.querySelectorAll("[data-oid]");
    var oids = [], voies = [], j;
    for (j = 0; j < groupes.length; j++) {
      oids.push(groupes[j].getAttribute("data-oid").slice(0, 7));
      var cercle = groupes[j].querySelector("circle");
      voies.push(cercle ? cercle.getAttribute("cx") : "?");
    }
    var marques = [];
    var textes = svg.querySelectorAll(".gg-marque-texte");
    for (j = 0; j < textes.length; j++) marques.push(textes[j].textContent);

    var zones = document.querySelectorAll("#bac-zones .bac-zone");
    var comptes = [];
    for (j = 0; j < zones.length; j++) comptes.push(zones[j].querySelectorAll(".bac-fichier").length);

    var valeurs = {
      commits: String(groupes.length),
      ordre: oids.join(" "),
      abscisses: voies.join(" "),
      aretes: String(svg.querySelectorAll(".gg-arete").length),
      marques: marques.join(" | "),
      zones: comptes.join(" / "),
      etat: (document.getElementById("bac-etat") || {}).textContent || "",
      fusions: String(svg.querySelectorAll(".gg-noeud--fusion").length),
      titres: (function () {
        var t = svg.querySelectorAll(".gg-titre"), out = [];
        for (var k = 0; k < t.length; k++) out.push(t[k].textContent);
        return out.join(" | ");
      })(),
      injection: String(document.querySelectorAll("#bac-graphe script").length),
      /* ⚠️ AUCUN TEXTE NE DOIT SORTIR DU CADRE. Le SVG a `overflow: hidden` : un
         cadre trop court ne provoque pas d'erreur, il ROGNE le titre du commit,
         et rien dans le source ne le montre. La largeur est ESTIMEE a la chasse
         de la police (`GEO.carMono`) ; seule cette mesure, faite par le
         navigateur avec `getComputedTextLength`, dit si l'estimation tient. */
      depassement: (function () {
        var t = svg.querySelectorAll("text"), pire = 0;
        var cadre = parseFloat(svg.getAttribute("viewBox").split(" ")[2]);
        for (var k = 0; k < t.length; k++) {
          var fin = parseFloat(t[k].getAttribute("x")) + t[k].getComputedTextLength();
          if (fin - cadre > pire) pire = fin - cadre;
        }
        return pire > 0 ? "DEPASSE de " + Math.ceil(pire) + " px" : "aucun";
      })(),
      /* Le graphe est plus large que la colonne des que l'histoire branche : il
         doit DEFILER dans son cadre, et non pousser la page. */
      defilement: getComputedStyle(document.getElementById("bac-graphe")).overflowX,
      debordement: String(document.documentElement.scrollWidth - document.documentElement.clientWidth)
    };
    /* Dernier volet : les commits ABANDONNES. On efface l'etiquette qui retenait
       la fusion, on recule d'un commit, et la fusion devient inatteignable — git
       ne la montre plus. La case a cocher doit la faire reapparaitre, sans quoi
       la promesse « Git ne jette rien tout de suite » n'est pas tenue. */
    var apres = ["git tag -d jalon", "git reset --hard HEAD~1"];
    for (var p = 0; p < apres.length; p++) {
      saisie.value = apres[p];
      formulaire.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
    }
    valeurs.apresReset = String(document.querySelectorAll("#bac-graphe [data-oid]").length);
    var caseOrphelins = document.getElementById("bac-orphelins");
    caseOrphelins.checked = true;
    caseOrphelins.dispatchEvent(new Event("change", { bubbles: true }));
    valeurs.avecOrphelins = String(document.querySelectorAll("#bac-graphe [data-oid]").length);
    valeurs.marquesPerdus = String(document.querySelectorAll("#bac-graphe .gg-noeud--orphelin").length);

    /* Le CAS DUR de la largeur : un nom de branche long et un titre long, comme
       en vraie vie. C'est ce cas qui avait rendu, avant correction, un cadre
       440 px trop court — l'empreinte et le titre disparaissaient entierement. */
    var dur = [
      "git checkout -b correctif/connexion-base-de-donnees-lente",
      'echo "correctif" > correctif.txt',
      "git add .",
      'git commit -m "corrige la connexion a la base de donnees, qui retombait apres trente secondes"',
      "git tag correctif-verifie-en-recette"
    ];
    for (var q = 0; q < dur.length; q++) {
      saisie.value = dur[q];
      formulaire.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
    }
    valeurs.depassementDur = (function () {
      var s2 = document.querySelector("#bac-graphe svg");
      if (!s2) return "aucun SVG";
      var t = s2.querySelectorAll("text"), pire = 0;
      var cadre = parseFloat(s2.getAttribute("viewBox").split(" ")[2]);
      for (var k = 0; k < t.length; k++) {
        var fin = parseFloat(t[k].getAttribute("x")) + t[k].getComputedTextLength();
        if (fin - cadre > pire) pire = fin - cadre;
      }
      return pire > 0 ? "DEPASSE de " + Math.ceil(pire) + " px" : "aucun";
    })();
    /* Et la page ne doit toujours pas etre poussee : le graphe large DEFILE
       dans son cadre. C'est ce que la regle "svg { max-width: 100% }" de
       css/base.css empechait, en mettant le graphe a l'echelle au lieu de le
       laisser defiler. */
    valeurs.debordementDur = String(document.documentElement.scrollWidth - document.documentElement.clientWidth);

    window.__preuveD3 = JSON.stringify({ ok: true, valeurs: valeurs });
  } catch (e) {
    window.__preuveD3 = JSON.stringify({ ok: false, erreur: (e && e.message) || String(e) });
  }
  return window.__preuveD3;
})()
