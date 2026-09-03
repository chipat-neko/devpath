/* =============================================================================
   profil-chrome.js — un profil Chrome NEUF par execution, jamais reutilise.

   POURQUOI : le point A1 du chantier V16 a mesure que les profils persistants de
   `scratchpad/.chrome-*` pesaient 2,0 Go repartis en 41 dossiers, et surtout qu'ils
   FAUSSENT les verdicts. Deux mesures :
     - `maths/module-5/verif-cours-progression.js` annoncait « la barre affiche 0 / 13
       au lieu de 5 / 13 » — un bug du site en apparence ; le seul effacement de son
       profil le fait passer au vert ;
     - sur 6 pages identiques, un profil neuf met 123 s la ou un profil de 88 Mo met
       151 s — + 23 %, et l'ecart croit avec la taille du profil.

   Aucun verificateur pilotant Chrome n'entre dans la chaine sans partir d'un profil
   neuf. Le dossier est cree sous le repertoire temporaire du systeme (jamais dans le
   depot) et efface a la sortie du processus. Si Chrome tient encore un fichier ouvert
   sous Windows, l'effacement echoue en silence : ce n'est pas grave, le dossier ne
   sera de toute facon JAMAIS relu — c'est la reutilisation qui nuit, pas la trace.
   ============================================================================= */
"use strict";

var fs = require("fs");
var os = require("os");
var path = require("path");

/* Un outil qui rouvre Chrome page par page appelle `neuf()` des dizaines de fois.
   Un `process.on("exit")` par appel ferait deborder la limite d'ecouteurs de Node
   (`MaxListenersExceededWarning` des le onzieme) : on en pose donc UN SEUL, et on
   accumule les dossiers a effacer. */
var aEffacer = [];
var listenerPose = false;

function neuf(nom) {
  var dossier = fs.mkdtempSync(path.join(os.tmpdir(), "syntaxe-" + (nom || "chrome") + "-"));
  aEffacer.push(dossier);
  if (!listenerPose) {
    listenerPose = true;
    process.on("exit", function () {
      aEffacer.forEach(function (d) {
        try { fs.rmSync(d, { recursive: true, force: true }); } catch (e) { /* Chrome le tient encore */ }
      });
    });
  }
  return dossier;
}

module.exports = { neuf: neuf };
