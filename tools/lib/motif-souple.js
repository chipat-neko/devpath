/* =============================================================================
   motif-souple.js — poser une faute dans un fichier, QUELLES QUE SOIENT SES FINS
   DE LIGNE. (chantier V18, point A6.)

   POURQUOI CE MODULE EXISTE. Une épreuve par injection cherche un texte dans un
   fichier du site et le remplace par une faute. Quand ce texte porte sur deux
   lignes, l'épreuve l'écrit avec un simple "\n". Or un fichier du site peut être
   en CRLF sur le disque : `core.autocrlf` vaut `true` sur cette machine, un clone
   frais met TOUT le site en CRLF, et tout `git checkout` sans
   `-c core.autocrlf=false` réécrit le fichier ainsi. Le motif ne trouve alors plus
   rien, et l'épreuve classe la faute « NON APPLICABLE » ou « MOTIF INTROUVABLE » :
   un contrôle dont on ne sait plus s'il voit, sans qu'aucune faute soit passée.

   C'est arrivé deux fois avant ce module, et deux fois la parade a été recopiée
   à la main : `verif-execution-mutations.js` (2026-09-10) puis
   `preuves/execution-ancres-mutations.js` (2026-11-11, F1 du V16, deux fautes sur
   cinq éteintes). Au point A6 du V18, un clone frais en CRLF a montré que cinq
   autres épreuves avaient le même défaut : 34 fautes sur 153 ne se posaient plus
   (`verif-execution-liens` 3 sur 8, `verif-git-modele` 2 sur 29, `verif-git-graphe`
   11 sur 29, `verif-git-scenarios` 8 sur 30, `verif-git-commandes` 10 sur 57). Une
   parade recopiée finit par manquer au fichier suivant : elle vit donc ici, une fois.

   CE QU'IL GARANTIT
     - le motif est cherché avec "\r?\n" à la place de chaque "\n" : il se trouve
       sur un fichier en LF comme en CRLF ;
     - la faute est injectée avec les fins de ligne DU FICHIER (CRLF s'il en
       contient une, LF sinon) : on ne fabrique pas un fichier mixte ;
     - le remplacement passe par une fonction : un "$&" ou un "$1" dans le texte de
       la faute est écrit tel quel, il n'est pas interprété ;
     - le fichier d'origine n'est jamais touché ici : chaque épreuve garde ses
       octets d'origine et les restaure elle-même, à l'octet près.

   USAGE
     var souple = require("./lib/motif-souple.js");       // depuis tools/
     souple.trouve(texte, de)             -> booléen
     souple.occurrences(texte, de)        -> nombre d'occurrences
     souple.remplace(texte, de, vers)     -> texte, PREMIÈRE occurrence remplacée
     souple.remplaceTout(texte, de, vers) -> texte, TOUTES les occurrences remplacées
   ============================================================================= */
"use strict";

function echapper(texte) {
  return String(texte).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/* "\r?\n" à la place de chaque fin de ligne du motif, qu'elle y soit écrite "\n" ou "\r\n". */
function motif(texte, drapeaux) {
  return new RegExp(echapper(texte).replace(/\r?\n/g, "\\r?\\n"), drapeaux || "");
}

function finDeLigne(texte) {
  return /\r\n/.test(texte) ? "\r\n" : "\n";
}

function trouve(texte, de) {
  return motif(de).test(texte);
}

function occurrences(texte, de) {
  return (texte.match(motif(de, "g")) || []).length;
}

function remplace(texte, de, vers) {
  var v = String(vers).replace(/\r?\n/g, finDeLigne(texte));
  return texte.replace(motif(de), function () { return v; });
}

function remplaceTout(texte, de, vers) {
  var v = String(vers).replace(/\r?\n/g, finDeLigne(texte));
  return texte.replace(motif(de, "g"), function () { return v; });
}

module.exports = {
  motif: motif,
  finDeLigne: finDeLigne,
  trouve: trouve,
  occurrences: occurrences,
  remplace: remplace,
  remplaceTout: remplaceTout,
};
