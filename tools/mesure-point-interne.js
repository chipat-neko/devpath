#!/usr/bin/env node
'use strict';
/**
 * tools/mesure-point-interne.js — LE POINT INTERNE, COURS PAR COURS.
 *
 * POURQUOI CET OUTIL EXISTE (2026-09-10, chantier V17, point E1)
 * -------------------------------------------------------------
 * `tools/mesure-biais-qcm.js` rend le RENDEMENT du site entier pour chacune de ses
 * stratégies. Sur « la seule option écrite en deux phrases » — le POINT INTERNE — il
 * mesure **98,9 % sur 4,6 % des questions** : le plus fort rendement jamais relevé ici.
 *
 * Mais le site entier est le mauvais endroit pour décider, et ce chantier l'a déjà payé
 * deux fois (le cours `react` : « un indice de LOT vaut 100 % sur le lot et 25 % sur le
 * site »). La question du point E1 est autre : **cet indice est-il déjà installé dans les
 * cours qu'on a corrigés ?** Car il est *fabriqué par la correction elle-même* — en
 * étoffant les distracteurs, on écrit parfois la bonne réponse en deux phrases là où les
 * autres n'en ont qu'une.
 *
 * Cet outil répond à cette question-là, et à aucune autre : pour chaque cours, la
 * couverture et le rendement de la stratégie, avec les cours DÉJÀ TRAITÉS séparés des
 * autres (le marquage vient de tools/qcm-biais-reference.json, jamais d'une liste écrite
 * à la main). Il ne corrige rien : il mesure.
 *
 *   node tools/mesure-point-interne.js              le tableau complet
 *   node tools/mesure-point-interne.js --traites    seulement les cours déjà corrigés
 *   node tools/mesure-point-interne.js --exemples   + 5 questions concernées
 *   node tools/mesure-point-interne.js --strategie="la seule avec un point-virgule"
 *
 * Code de sortie : toujours 0 — c'est une mesure, pas un contrôle.
 */

const path = require('path');
const fs = require('fs');

const RACINE = path.resolve(__dirname, '..');
const moteur = require(path.join(RACINE, 'tools', 'mesure-biais-qcm.js'));

const argv = process.argv.slice(2);
const TRAITES_SEULS = argv.indexOf('--traites') !== -1;
const EXEMPLES = argv.indexOf('--exemples') !== -1;
const NOM_STRATEGIE = (argv.find((a) => a.indexOf('--strategie=') === 0) || '--strategie=la seule en deux phrases')
  .slice('--strategie='.length);

const strategie = moteur.STRATEGIES.find((s) => s.nom === NOM_STRATEGIE);
if (!strategie) {
  console.error('stratégie inconnue : ' + NOM_STRATEGIE);
  console.error('disponibles : ' + moteur.STRATEGIES.map((s) => s.nom).join(' | '));
  process.exit(2);
}

let reference = { cours: {} };
try { reference = JSON.parse(fs.readFileSync(path.join(RACINE, 'tools', 'qcm-biais-reference.json'), 'utf8')); } catch (e) {}
const estTraite = (c) => !!(reference.cours && reference.cours[c] && reference.cours[c].traite);

const corpus = moteur.lireCorpus();
const parCours = {};
const exemples = [];
corpus.forEach((q) => {
  const c = q.cours;
  if (!parCours[c]) parCours[c] = { questions: 0, tranche: 0, justes: 0 };
  parCours[c].questions++;
  let choix = strategie.choisir(q);
  if (!choix.length) return;                 /* la stratégie ne dit rien : pas de couverture */
  if (choix.length > 1) return;              /* ex aequo : elle ne tranche pas */
  parCours[c].tranche++;
  const juste = choix.indexOf(q.k) !== -1;
  if (juste) parCours[c].justes++;
  if (EXEMPLES && exemples.length < 5) {
    exemples.push({ cours: c, fichier: q.fichier || '?', juste: juste, q: q.q, option: q.a[choix[0]] });
  }
});

const lignes = Object.keys(parCours).sort().map((c) => {
  const d = parCours[c];
  return {
    cours: c,
    traite: estTraite(c),
    questions: d.questions,
    tranche: d.tranche,
    couverture: d.questions ? d.tranche / d.questions : 0,
    justes: d.justes,
    rendement: d.tranche ? d.justes / d.tranche : 0,
  };
}).filter((l) => (TRAITES_SEULS ? l.traite : true));

function pct(x) { return (x * 100).toFixed(1).padStart(5) + ' %'; }

console.log('mesure-point-interne — strategie : « ' + strategie.nom + ' »');
console.log('  ' + strategie.quoi + '\n');
console.log('  cours                traite  questions  tranche  couverture  justes  RENDEMENT');
lignes.filter((l) => l.tranche > 0)
  .sort((a, b) => b.tranche - a.tranche)
  .forEach((l) => {
    console.log('  ' + l.cours.padEnd(20) + (l.traite ? ' oui   ' : ' non   ') +
      String(l.questions).padStart(9) + String(l.tranche).padStart(9) + pct(l.couverture).padStart(12) +
      String(l.justes).padStart(8) + pct(l.rendement).padStart(11));
  });

function bilan(titre, sousEnsemble) {
  const q = sousEnsemble.reduce((n, l) => n + l.questions, 0);
  const t = sousEnsemble.reduce((n, l) => n + l.tranche, 0);
  const j = sousEnsemble.reduce((n, l) => n + l.justes, 0);
  console.log('  ' + titre.padEnd(34) + String(sousEnsemble.length).padStart(3) + ' cours · ' +
    String(q).padStart(5) + ' questions · tranche ' + String(t).padStart(4) +
    ' (' + pct(q ? t / q : 0) + ') · rendement ' + pct(t ? j / t : 0));
}
console.log('\n=== BILAN ===');
bilan('cours DEJA TRAITES (B4 du V16)', lignes.filter((l) => l.traite));
bilan('cours pas encore traites', lignes.filter((l) => !l.traite));
bilan('tous', lignes);

if (EXEMPLES && exemples.length) {
  console.log('\n=== EXEMPLES (les 5 premiers) ===');
  exemples.forEach((e) => {
    console.log('  [' + (e.juste ? 'JUSTE' : 'faux ') + '] ' + e.cours + '/' + e.fichier);
    console.log('     Q : ' + String(e.q).slice(0, 110));
    console.log('     -> ' + String(e.option).slice(0, 160));
  });
}
