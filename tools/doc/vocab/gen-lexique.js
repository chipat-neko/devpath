/* tools/doc/vocab/gen-lexique.js — régénère js/lexique-data.js.
 *
 * POURQUOI : la case D2 demande de RELIER au lexique existant plutôt que d'en
 * créer un second. Le lexique du site (64 entrées) couvre le vocabulaire de
 * base — loop, array, function. Les 82 mots de la leçon 02 couvrent celui de la
 * DOCUMENTATION — deprecated, throws, unless. Mesuré : seuls 5 mots sont dans
 * les deux. Ce sont donc deux moitiés du même lexique, pas deux lexiques.
 *
 * Une seule source de vérité pour les 82 : tools/doc/vocab/mots.json. Les
 * marqueurs {{preuve}} de leurs pièges sont RÉSOLUS ici, par exécution — aucune
 * valeur n'est recopiée à la main dans le fichier publié.
 *
 * USAGE :  node tools/doc/vocab/gen-lexique.js [--write]
 *          sans --write, il compare et ne touche à rien.
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { evaluer } = require('./preuves.js');

const RACINE = path.join(__dirname, '..', '..', '..');
const CIBLE = path.join(RACINE, 'js', 'lexique-data.js');
const MOTS = require('./mots.json');

/* Les 64 entrées de base, relues dans le fichier publié : on ne les réécrit
   pas, on les transporte. Les perdre serait une régression silencieuse. */
function baseExistante() {
  const src = fs.readFileSync(CIBLE, 'utf8');
  const sandbox = { window: {} };
  /* eslint-disable no-new-func */
  new Function('window', src)(sandbox.window);
  return (sandbox.window.LEXIQUE || []).filter(function (e) { return !e.fam || e.fam === 'base'; });
}

function resoudre(texte) {
  return texte.replace(/\{\{(\w+)\}\}/g, function (_, cle) { return evaluer(cle).affiche; });
}

function echapper(s) {
  return String(s).replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}

function construire() {
  const base = baseExistante();
  const norm = function (s) { return s.toLowerCase().replace(/^to /, ''); };
  const remplaces = new Set(MOTS.map(function (m) { return norm(m.en); }));
  /* les 5 mots communs disparaissent de la partie « base » : leur fiche de doc
     est plus riche (elle porte un piège), et deux entrées du même mot feraient
     deux réponses justes dans le quiz de traduction. */
  const gardes = base.filter(function (e) { return !remplaces.has(norm(e.en)); });

  const lignes = [];
  lignes.push('/* =============================================================================');
  lignes.push('   lexique-data.js — Lexique anglais de la programmation.');
  lignes.push('   window.LEXIQUE : termes techniques EN → FR. 100 % file://.');
  lignes.push('   { en, fr, ex, fam, naif?, sens?, piege? }.');
  lignes.push('');
  lignes.push('   ⚠ LA SECONDE MOITIÉ DE CE FICHIER EST GÉNÉRÉE.');
  lignes.push('   Les ' + MOTS.length + ' termes de documentation viennent de tools/doc/vocab/mots.json,');
  lignes.push('   et les chiffres de leurs pièges sont produits par EXÉCUTION');
  lignes.push('   (tools/doc/vocab/preuves.js), jamais écrits à la main.');
  lignes.push('   Pour les modifier : éditer mots.json, puis');
  lignes.push('   node tools/doc/vocab/gen-lexique.js --write');
  lignes.push('   ============================================================================= */');
  lignes.push('window.LEXIQUE = [');
  lignes.push('  /* ---- vocabulaire de base ------------------------------------------------ */');
  for (const e of gardes) {
    lignes.push('  { en: "' + echapper(e.en) + '", fr: "' + echapper(e.fr) + '", ex: "' +
      echapper(e.ex || '') + '", fam: "base" },');
  }
  const familles = [];
  for (const m of MOTS) if (familles.indexOf(m.famille) === -1) familles.push(m.famille);
  for (const f of familles) {
    lignes.push('  /* ---- documentation · ' + f + ' ' + '-'.repeat(Math.max(2, 52 - f.length)) + ' */');
    for (const m of MOTS.filter(function (x) { return x.famille === f; })) {
      const champs = ['en: "' + echapper(m.en) + '"', 'fr: "' + echapper(m.fr) + '"',
        'ex: "' + echapper(m.ex) + '"', 'fam: "' + f + '"'];
      if (m.naif) champs.push('naif: "' + echapper(m.naif) + '"');
      champs.push('sens: "' + echapper(m.sens) + '"');
      if (m.piege) champs.push('piege: "' + echapper(resoudre(m.piege)) + '"');
      lignes.push('  { ' + champs.join(', ') + ' },');
    }
  }
  lignes.push('];');
  return lignes.join('\n') + '\n';
}

const attendu = construire();
const actuel = fs.existsSync(CIBLE) ? fs.readFileSync(CIBLE, 'utf8') : '';
const total = (attendu.match(/^ {2}\{ en:/gm) || []).length;

if (process.argv.includes('--write')) {
  fs.writeFileSync(CIBLE, attendu, 'utf8');
  console.log('écrit ' + path.relative(RACINE, CIBLE) + ' — ' + total + ' entrées (' +
    MOTS.length + ' de documentation).');
} else if (attendu === actuel) {
  console.log('à jour — ' + total + ' entrées.');
} else {
  console.log('DIVERGENT — ' + total + ' entrées attendues, ' +
    (actuel.match(/^ {2}\{ en:/gm) || []).length + ' publiées. Relancer avec --write.');
  process.exit(1);
}
