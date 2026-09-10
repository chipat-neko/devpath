#!/usr/bin/env node
'use strict';
/**
 * tools/mesures-prompt.js — LES CHIFFRES QUE LE PROMPT DE L'AUTONOMIE ANNONCE.
 *
 * POURQUOI CET OUTIL EXISTE (2026-09-10, chantier V17, point D6)
 * -------------------------------------------------------------
 * Le prompt envoyé à chaque réveil décrivait le site avec des nombres écrits à la main,
 * et le modèle est censé les reprendre. Ils étaient faux, tous mesurés le 2026-09-10 :
 *
 *     « 83 cours, 1463 lecons »                  ->  90 cours, 1540 leçons
 *     « verif-html analyse les 1425 lecons »     ->  1629 fichiers analysés
 *     « verif-donnees verifie 17 invariants »    ->  26 contrôles
 *     « verif-rendu prend 20 pages, 139 au max » ->  256 pages par défaut
 *
 * Un chiffre écrit dans une consigne ne casse rien quand il se périme : il se contente
 * de faire travailler le modèle sur une image fausse du site — et c'est le premier
 * intrant de chaque passe. On le mesure donc au lancement.
 *
 * Il ne mesure QUE ce qui se mesure en moins d'une seconde : lire data.js, compter des
 * fichiers, lire les vérificateurs sans les lancer. Ce qui demanderait d'exécuter la
 * chaîne (le nombre de pages réellement rendues, la durée d'une passe) n'est pas cité
 * dans le prompt — c'est l'autre branche du point D6 : « ne plus en citer aucun ».
 *
 *   node tools/mesures-prompt.js          les chiffres, en JSON
 *   node tools/mesures-prompt.js --texte  une ligne par mesure, lisible
 *
 * Code de sortie : 0 si toutes les mesures ont abouti, 1 sinon (l'appelant doit alors
 * se passer des chiffres, jamais s'arrêter).
 */

const fs = require('fs');
const path = require('path');

const RACINE = path.resolve(__dirname, '..');
const manques = [];

function litGlobal(fichier, nom) {
  try {
    let code = fs.readFileSync(path.join(RACINE, fichier), 'utf8');
    if (code.charCodeAt(0) === 0xfeff) code = code.slice(1);
    const win = {};
    new Function('window', code)(win);
    return win[nom] || null;
  } catch (e) { return null; }
}

/* --- le site, tel que data.js le déclare ---------------------------------- */
const D = litGlobal('js/data.js', 'SITE_DATA');
let nCours = null, nLecons = null, nParcours = null, nLangages = null;
if (D) {
  nCours = (D.courses || []).length;
  nParcours = (D.tracks || []).length;
  nLangages = new Set((D.courses || []).map((c) => c.language).filter(Boolean)).size;
  nLecons = 0;
  Object.keys(D.content || {}).forEach((id) => {
    (D.content[id].modules || []).forEach((m) => { nLecons += (m.lessons || []).length; });
  });
} else { manques.push('js/data.js illisible'); }

/* --- ce que verif-html analyse VRAIMENT ----------------------------------- */
/* EXACTEMENT son périmètre par défaut, lu dans son `main` : les fichiers
   « lecon-NN.html » sous pages/, et rien d'autre. Deux compteurs plus larges ont été
   essayés d'abord et donnaient 2 014 puis 1 802, là où l'outil en lit 1 629 : un
   chiffre approché dans une consigne est le défaut que ce point corrige, pas celui
   qu'il a le droit d'introduire. L'écart avec les 1 540 leçons DÉCLARÉES, ce sont les
   89 pages de redirection, que l'outil lit et que data.js ne déclare pas. */
let nFichiersHtml = 0;
(function compter(dir) {
  let entrees;
  try { entrees = fs.readdirSync(dir, { withFileTypes: true }); } catch (e) { return; }
  for (const e of entrees) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) compter(p);
    else if (/^lecon-\d+\.html?$/i.test(e.name)) nFichiersHtml++;
  }
})(path.join(RACINE, 'pages'));
if (!nFichiersHtml) manques.push('aucun fichier lecon-NN.html trouvé');

/* --- combien de contrôles verif-donnees porte-t-il ? ---------------------- */
/* Lu dans le fichier, pas lancé : l'outil met plusieurs secondes, et son nombre de
   contrôles est une propriété statique de son code. */
let nInvariants = null;
try {
  const src = fs.readFileSync(path.join(RACINE, 'tools', 'verif-donnees.js'), 'utf8');
  const vus = new Set();
  const re = /check\('(I\d+)'/g;
  let m;
  while ((m = re.exec(src))) vus.add(m[1]);
  nInvariants = vus.size;
  if (!nInvariants) manques.push('aucun contrôle trouvé dans verif-donnees.js');
} catch (e) { manques.push('tools/verif-donnees.js illisible'); }

/* --- combien de vérificateurs le dépôt porte-t-il ? ----------------------- */
/* Les fichiers « verif-*.js » de tools/ et de ses sous-dossiers, comptés sur le
   disque. On ne cite PAS le nombre
   d'étapes par mode : il dépend des drapeaux et ne se lit pas sans lancer la chaîne
   (node tools/verif-chaine-declaree.js le fait, en plusieurs secondes). Citer un
   chiffre qu'on ne peut pas mesurer ici, c'est refaire le défaut du point D6. */
let nVerificateurs = 0;
(function compterVerif(dir) {
  let entrees;
  try { entrees = fs.readdirSync(dir, { withFileTypes: true }); } catch (e) { return; }
  for (const e of entrees) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) compterVerif(p);
    else if (/^verif-.*\.js$/i.test(e.name)) nVerificateurs++;
  }
})(path.join(RACINE, 'tools'));
if (!nVerificateurs) manques.push('aucun verif-*.js trouvé');

const mesures = {
  N_COURS: nCours,
  N_LECONS: nLecons,
  N_PARCOURS: nParcours,
  N_LANGAGES: nLangages,
  N_LECONS_FICHIERS: nFichiersHtml,
  N_INVARIANTS: nInvariants,
  N_VERIFICATEURS: nVerificateurs,
};

if (process.argv.indexOf('--texte') !== -1) {
  Object.keys(mesures).forEach((k) => console.log(k.padEnd(18, '.') + ' ' + mesures[k]));
  manques.forEach((x) => console.log('MANQUE : ' + x));
} else {
  console.log(JSON.stringify(mesures));
}
process.exit(manques.length || Object.keys(mesures).some((k) => mesures[k] == null) ? 1 : 0);
