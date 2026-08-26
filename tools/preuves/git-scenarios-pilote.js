/* =============================================================================
   preuves/git-scenarios-pilote.js — LE SCRIPT QUI PILOTE LES SITUATIONS GUIDEES
   dans la VRAIE page (chantier V14, point D4).

   Ce fichier n'est pas un module : c'est UNE EXPRESSION JavaScript, lue telle
   quelle par tools/preuves/git-scenarios.js et evaluee dans l'onglet Chrome par
   `--attendre=`. Elle est appelee en boucle : au premier appel elle joue la
   session, aux suivants elle rend le resume (ou null tant qu'il n'est pas pret).

   POURQUOI PILOTER LA PAGE : `tools/verif-git-scenarios.js` prouve, dans Node,
   que les scenarios sont justes. Il ne prouve rien de la PAGE — un bouton sans
   ecouteur, un identifiant mal orthographie, un script oublie dans le HTML, et
   l'apprenant a devant lui une liste de cartes qui ne font rien. Ici, on CLIQUE
   vraiment sur « Commencer », on TAPE vraiment la solution dans le champ, et on
   lit ce que la page affiche.
   ============================================================================= */
(function () {
  if (window.__preuveD4) return window.__preuveD4 === "en cours" ? null : window.__preuveD4;
  if (document.readyState !== "complete") return null;
  window.__preuveD4 = "en cours";
  try {
    var saisie = document.getElementById("bac-saisie");
    var formulaire = document.getElementById("bac-formulaire");
    var hote = document.getElementById("bac-scenarios");
    var mission = document.getElementById("bac-mission");
    if (!saisie || !formulaire) throw new Error("la page n'a ni champ de saisie ni formulaire");
    if (!hote) throw new Error("la page n'a pas d'hote pour les situations (#bac-scenarios)");
    if (!mission) throw new Error("la page n'a pas de panneau de mission (#bac-mission)");

    try { localStorage.removeItem("syntaxe-git-scenarios"); } catch (e) { /* rien */ }

    function taper(ligne) {
      saisie.value = ligne;
      formulaire.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
    }
    function cartes() { return document.querySelectorAll("#bac-scenarios .bac-carte"); }
    function boutonDe(id) {
      /* ⚠️ La carte porte « carte-<id> », pas « scenario-<id> » : le fragment
         `#scenario-<id>` ne doit designer AUCUN element, sinon le navigateur y
         saute apres notre defilement et le panneau sort de l'ecran. */
      var c = document.getElementById("carte-" + id);
      return c ? c.querySelector("button") : null;
    }
    function etatObjectifs() {
      var tous = mission.querySelectorAll(".bac-objectif");
      var faits = mission.querySelectorAll(".bac-objectif--fait");
      return faits.length + "/" + tous.length;
    }
    function textesObjectifs() {
      var tous = mission.querySelectorAll(".bac-objectif");
      var out = [];
      for (var i = 0; i < tous.length; i++) out.push(tous[i].textContent.replace(/^[✓○]/, "").trim());
      return out.join(" | ");
    }

    /* ⚠️ Le profil Chrome est REUTILISE d'une preuve a l'autre : la session
       precedente peut avoir laisse une situation en cours, et le panneau est
       alors visible a l'ouverture — c'est le comportement voulu, pas un defaut.
       On part donc d'un etat propre en QUITTANT la situation reprise, ce qui
       mesure au passage le bouton « Quitter le scenario ». */
    var valeurs = {};
    if (!mission.hidden) {
      var bQuit = mission.querySelectorAll(".bac-actions button");
      bQuit[bQuit.length - 1].click();
    }
    valeurs.missionCachee = mission.hidden ? "oui" : "non";
    valeurs.cartes = String(cartes().length);
    var titres = [], liste = cartes();
    for (var i = 0; i < liste.length; i++) {
      titres.push(liste[i].querySelector(".bac-carte__titre").textContent);
    }
    valeurs.titres = titres.join(" | ");

    /* --- 1. démarrer une situation par un VRAI clic ------------------------- */
    var b = boutonDe("desindexer");
    if (!b) throw new Error("aucun bouton pour la situation « desindexer »");
    b.click();
    valeurs.missionVisible = mission.hidden ? "non" : "oui";
    valeurs.titreMission = (mission.querySelector(".bac-panneau__titre") || {}).textContent || "";
    valeurs.objectifsTextes = textesObjectifs();
    valeurs.avant = etatObjectifs();
    valeurs.zonesAvant = (function () {
      var z = document.querySelectorAll("#bac-zones .bac-zone"), out = [];
      for (var k = 0; k < z.length; k++) out.push(z[k].querySelectorAll(".bac-fichier").length);
      return out.join(" / ");
    })();

    /* --- 2. un indice à la fois --------------------------------------------- */
    var boutons = mission.querySelectorAll(".bac-actions button");
    boutons[0].click();
    valeurs.indices1 = String(mission.querySelectorAll(".bac-indices li").length);
    mission.querySelectorAll(".bac-actions button")[0].click();
    valeurs.indices2 = String(mission.querySelectorAll(".bac-indices li").length);

    /* --- 3. la solution, tapée dans le champ -------------------------------- */
    taper("git reset HEAD notes-perso.txt");
    valeurs.apres = etatObjectifs();
    valeurs.reussite = (mission.querySelector(".bac-reussite__titre") || {}).textContent || "(aucune)";
    valeurs.lienLecon = (function () {
      var a = mission.querySelector(".bac-reussite__liens a");
      return a ? a.getAttribute("href") + " → " + a.textContent : "(aucun)";
    })();
    valeurs.faits = (function () {
      try { return localStorage.getItem("syntaxe-git-scenarios") || "(rien)"; } catch (e) { return "(illisible)"; }
    })();
    valeurs.cartesFaites = String(document.querySelectorAll("#bac-scenarios .bac-carte--fait").length);

    /* --- 4. le piège doit rester un échec ----------------------------------- */
    boutonDe("desindexer").click();          // remonter la situation
    valeurs.remontee = etatObjectifs();
    taper("rm notes-perso.txt");
    valeurs.piege = etatObjectifs();

    /* --- 5. une autre situation, et un chemin DIFFÉRENT de la solution ------- */
    boutonDe("conflit").click();
    valeurs.conflitAvant = etatObjectifs();
    valeurs.etatConflit = (document.getElementById("bac-etat") || {}).textContent || "";
    taper('echo "Abonnement : 7 euros" > tarifs.txt');
    taper("git add .");                        // la variante, pas la solution publiée
    taper('git commit -m "fusionne promo"');
    valeurs.conflitApres = etatObjectifs();

    /* --- 6. la ligne de progres, celle que le lecteur d'ecran annonce -------- */
    valeurs.progres = (mission.querySelector(".bac-mission__progres") || {}).textContent || "(aucune)";

    /* --- 7. « reinitialiser » doit SORTIR de la situation --------------------
       Un panneau qui reste au-dessus d'un depot vide annonce un but devenu
       inatteignable — et deux objectifs de « conflit » s'y cochaient tout seuls. */
    taper("reinitialiser");
    valeurs.apresReinit = mission.hidden ? "panneau cache" : "panneau encore la";

    /* --- 8. LE CONTRASTE de la ligne de reussite, dans les DEUX themes -------
       C'est la mesure qui manquait : la ligne « Objectif atteint » employait
       --ok, un jeton de theme CLAIR, sur le fond du terminal qui reste sombre
       dans les deux themes — 2,15:1, sur la phrase la plus importante que les
       situations produisent. Meme piege qu'en D3 avec --danger-bg. */
    function canal(c) { c /= 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); }
    function lum(couleur) {
      var m = /rgba?\((\d+),\s*(\d+),\s*(\d+)/.exec(couleur);
      if (!m) return null;
      return 0.2126 * canal(+m[1]) + 0.7152 * canal(+m[2]) + 0.0722 * canal(+m[3]);
    }
    function ratioReussite() {
      var ligne = null, toutes = document.querySelectorAll("#bac-terminal .bac-ligne--reussite");
      if (!toutes.length) return "aucune ligne de reussite";
      ligne = toutes[0];
      var lc = lum(getComputedStyle(ligne).color);
      var lf = lum(getComputedStyle(document.getElementById("bac-terminal")).backgroundColor);
      if (lc === null || lf === null) return "couleurs illisibles";
      var r = (Math.max(lc, lf) + 0.05) / (Math.min(lc, lf) + 0.05);
      return r >= 4.5 ? "conforme (" + r.toFixed(2) + ":1)" : "TROP FAIBLE (" + r.toFixed(2) + ":1)";
    }
    /* On remonte une situation et on la reussit pour avoir la ligne sous la main. */
    boutonDe("desindexer").click();
    taper("git reset HEAD notes-perso.txt");
    valeurs.contrasteClair = ratioReussite();
    var theme = document.documentElement.getAttribute("data-theme");
    document.documentElement.setAttribute("data-theme", "dark");
    valeurs.contrasteSombre = ratioReussite();
    document.documentElement.setAttribute("data-theme", theme || "light");

    /* --- 9. ce que la page ne doit jamais faire ----------------------------- */
    valeurs.injection = String(mission.querySelectorAll("script").length);
    valeurs.debordement = String(document.documentElement.scrollWidth - document.documentElement.clientWidth);

    window.__preuveD4 = JSON.stringify({ ok: true, valeurs: valeurs });
  } catch (e) {
    window.__preuveD4 = JSON.stringify({ ok: false, erreur: (e && e.message) || String(e) });
  }
  return window.__preuveD4;
})()
