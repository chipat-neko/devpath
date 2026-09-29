#!/usr/bin/env node
'use strict';

/**
 * verif-lecon.js — OBSOLÈTE, NE PLUS UTILISER (neutralisé le 2026-07-31).
 *
 * Cet ancien vérificateur SUPPRIMAIT les blocs <pre> AVANT de compter les balises
 * (voir l'ancienne ligne « html.replace(/<pre[\s\S]*?<\/pre>/g, "") »). Il était
 * donc STRUCTURELLEMENT AVEUGLE à la seule famille de bugs qui a réellement cassé
 * des pages de ce site : un « < » non échappé DANS un exemple de code. Le laisser
 * exécutable, c'est risquer un faux « OK : aucun problème détecté » qui masque une
 * page cassée. On le remplace donc par ce garde-fou, qui refuse de tourner et
 * renvoie vers les deux outils qui le remplacent :
 *
 *   • node tools/verif-html.js      — structure HTML « type navigateur » (la
 *                                     convention d'échappement des « < »).
 *   • node tools/verif-donnees.js   — cohérence des DONNÉES (16 invariants).
 *
 * Ces deux outils vivent dans tools/. Ce fichier ne fait plus aucune analyse.
 */

console.error(
  '\n  verif-lecon.js est OBSOLÈTE et a été neutralisé.\n' +
  '  Il était aveugle aux « < » non échappés dans les blocs de code (il retirait\n' +
  '  les <pre> avant de compter les balises), d\'où un risque de faux « OK ».\n\n' +
  '  Utilise à la place :\n' +
  '    node tools/verif-html.js      (structure/balises, doit rester à 0)\n' +
  '    node tools/verif-donnees.js   (données : 16 invariants, doit rester à 0 erreur)\n'
);
process.exit(2);
