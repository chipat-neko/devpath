/* =============================================================================
   port-chrome.js — le port de DevTools est choisi par CHROME, jamais par nous.

   POURQUOI CET OUTIL EXISTE (point A6 du chantier V17, 2026-09-09).
   Vingt-six outils du projet lancaient Chrome sur un port ECRIT EN DUR, et six
   paires d'entre eux partageaient le meme numero :

       9341  maths/module-5/verif-bilan.js      · preuves/execution-ancres.js
       9357  doc/verif-lexique-clic.js          · fraicheur/verif-affichage.js
             preuve-hors-reseau.js              · preuves/exos-code.js
       9359  preuves/python-lecon.js            · preuves/exos-texte.js
       9362  preuves/decodeur.js                · preuves/etude-moteur-exos.js
       9366  preuves/erreurs-sql.js             · preuves/etude-inconnu.js
       9367  preuves/decodeur-lecons.js         · preuves/etudes-hub.js

   Ce n'est pas une elegance manquante, c'est un VERDICT FAUX. Quand le port est
   deja pris — un Chrome de l'etape precedente qui n'est pas encore mort, un
   processus fils survivant, un autre outil du projet — le second Chrome demarre
   quand meme mais SANS DevTools : l'outil interroge alors le port, obtient la
   liste de pages de l'AUTRE instance, et mesure une page qui n'est pas la sienne.

   MESURE DU 2026-09-09, l'experience qui a fonde ce fichier. Un Chrome pose sur
   `about:blank` au port 9357, puis `doc/verif-lexique-clic.js` lance : il rend
   « 1 controle OK, 11 en echec » en 2,0 s (il en met 25 a 30 quand il travaille),
   et il imprime « OK aucune erreur JavaScript pendant les clics » — la signature
   EXACTE du signalement que `verif.js --complet` avait rendu le matin meme, et
   qui disparaissait des qu'on relancait l'outil seul. Un rouge intermittent qu'on
   ne peut pas reproduire est un rouge qu'on finit par ignorer.

   LA PARADE, celle que `verif-clic.js` avait deja adoptee au point A3 et qui n'a
   plus jamais varie : `--remote-debugging-port=0`. Chrome prend un port libre et
   l'ECRIT lui-meme dans `<profil>/DevToolsActivePort` (premiere ligne). Deux
   executions simultanees ne peuvent plus se prendre l'une pour l'autre, et il n'y
   a plus de numero a reserver ni de collision a prevoir.

   USAGE — trois lignes a la place d'une constante :

       var portChrome = require('../lib/port-chrome.js');
       var profil = profilChrome.neuf('lexique');
       cp.spawn(CHROME, ['--headless=new', '--remote-debugging-port=0',
                         '--user-data-dir=' + profil, url], ...);
       var PORT = await portChrome.attendre(profil);

   `attendre` REJETTE si Chrome n'a pas ecrit le fichier dans le delai : c'est un
   « rien n'a pu etre mesure » (code 2), jamais une faute du site.
   ============================================================================= */
"use strict";

var fs = require("fs");
var path = require("path");

/* Le port que Chrome a reellement pris, lu dans le profil qu'on lui a donne.
   Renvoie une promesse : le fichier n'apparait qu'une fois le service DevTools
   en ecoute, ce qui prend de 0,2 a 2 s selon la machine et la taille du profil. */
function attendre(profil, msMax) {
  var plafond = msMax || 30000;
  var fichier = path.join(profil, "DevToolsActivePort");
  return new Promise(function (resoudre, rejeter) {
    var t0 = Date.now();
    (function essai() {
      var ligne = null;
      try { ligne = fs.readFileSync(fichier, "utf8").split("\n")[0].trim(); }
      catch (e) { /* Chrome ne l'a pas encore ecrit */ }
      /* Chrome ecrit « 0 » un court instant avant de connaitre son port : on
         attend un nombre franchement positif, sinon on interrogerait le port 0. */
      if (ligne && /^[0-9]+$/.test(ligne) && Number(ligne) > 0) return resoudre(Number(ligne));
      if (Date.now() - t0 > plafond) {
        return rejeter(new Error("Chrome n'a pas ecrit son port dans " +
          (plafond / 1000) + " s (" + fichier + ") : rien n'a pu etre mesure"));
      }
      setTimeout(essai, 100);
    })();
  });
}

/* A appeler JUSTE AVANT le lancement, et c'est indispensable des que le profil
   n'est pas neuf : `preuves/sql-lecon.js` et `preuves/python-lecon.js` reutilisent
   `scratchpad/.chrome-preuve-*`, ou dort le DevToolsActivePort du passage
   precedent. Sans cet effacement, on lirait le port d'un Chrome mort — ou pire,
   celui d'un Chrome encore vivant qui n'est pas le notre. */
function oublier(profil) {
  try { fs.unlinkSync(path.join(profil, "DevToolsActivePort")); }
  catch (e) { /* absent : c'est le cas normal d'un profil neuf */ }
}

module.exports = { attendre: attendre, oublier: oublier };
