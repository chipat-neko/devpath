#!/usr/bin/env node
'use strict';
/**
 * tools/verif-etudes.js — LES PAGES D'ÉTUDE SONT-ELLES CELLES QUE LEURS ASSEMBLEURS
 * PRODUIRAIENT AUJOURD'HUI ?
 *
 * POURQUOI CET OUTIL EXISTE (2026-09-10, chantier V17, point C6)
 * -------------------------------------------------------------
 * Les sept pages d'étude n'ont aucun chiffre écrit à la main : tout y vient d'une mesure
 * refaite à chaque assemblage. Cette propriété ne vaut que si quelqu'un RELANCE
 * l'assembleur — et personne ne le faisait. Pire, le point C5 venait d'écarter ces pages
 * du contrôle des compteurs (I19) précisément parce que leurs nombres sont des mesures :
 * elles n'étaient donc contrôlées par personne, et le rapport d'I19 les nomme pour cette
 * raison.
 *
 * LA MESURE QUI A FONDÉ CET OUTIL. Les sept assembleurs relancés le 2026-09-10 ont
 * reproduit la page publiée à l'octet près — sauf UN. `pages/etude-moteur-exos.html`
 * publiait « 4288 exercices de type text, 307 de type code » quand la mesure du jour en
 * comptait **4293 et 302** : cinq exercices avaient changé de type au fil du chantier
 * B2b. La page l'affirmait faux à TROIS endroits, dont un raisonnement adressé au
 * lecteur (« pourquoi ce serait une très mauvaise idée sur 307 exercices »). Quatre
 * vérificateurs verts, et personne pour le voir : la situation même qui a fondé ce
 * chantier.
 *
 * CE QU'IL FAIT : il lance chaque assembleur avec `--verifier`. Dans ce mode (voir
 * tools/lib/publier-etude.js) l'assembleur fait tout son travail — relire les extraits
 * dans les fichiers réels, exécuter les bancs, recompter — mais n'ÉCRIT rien : il compare
 * la page qu'il vient de fabriquer à celle qui est publiée, et nomme la première ligne
 * divergente. Aucun risque d'écriture pendant une vérification.
 *
 * ⚠️ CE QU'IL NE REMPLACE PAS. Il répond à « la page publiée est-elle celle que
 * l'assembleur produit aujourd'hui ? ». Les preuves `tools/preuves/etude-*.js`, elles,
 * ouvrent la page dans un vrai Chrome et répondent à « ce que l'assembleur a mesuré
 * est-il vrai ? ». Un assembleur qui se tromperait resterait vert ici et rouge là-bas.
 * Les deux sont nécessaires ; celui-ci est celui qui manquait.
 *
 * USAGE
 *   node tools/verif-etudes.js            verdict pour les 7 études (≈ 12 s)
 *   node tools/verif-etudes.js --etude=x  une seule (euclide, inconnu, journal,
 *                                         moteur-exos, recherche, reecriture, hub)
 *   node tools/verif-etudes.js --bavard   toute la sortie de chaque assembleur
 *
 * Code de sortie : 1 si une page est périmée ou si un assembleur échoue, sinon 0.
 */

const fs = require('fs');
const path = require('path');
const cp = require('child_process');

const RACINE = path.resolve(__dirname, '..');
const ETUDES = path.join(RACINE, 'tools', 'etudes');

const argv = process.argv.slice(2);
const BAVARD = argv.indexOf('--bavard') !== -1;
const SEULE = (argv.find((a) => a.indexOf('--etude=') === 0) || '').replace('--etude=', '');
if (argv.indexOf('-h') !== -1 || argv.indexOf('--help') !== -1 || argv.indexOf('--aide') !== -1) {
  console.log(fs.readFileSync(__filename, 'utf8').split('*/')[0].replace(/^[\s\S]*?\/\*\*/, ''));
  process.exit(0);
}

/* La liste n'est pas écrite à la main : tout dossier de tools/etudes/ qui porte un
   assembleur en est une, plus le hub. Une étude ajoutée demain entre d'elle-même. */
function assembleurs() {
  const out = [];
  fs.readdirSync(ETUDES, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .sort((a, b) => (a.name < b.name ? -1 : 1))
    .forEach((e) => {
      const p = path.join(ETUDES, e.name, 'assembler.js');
      if (fs.existsSync(p)) out.push({ nom: e.name, script: p });
    });
  const hub = path.join(ETUDES, 'hub.js');
  if (fs.existsSync(hub)) out.push({ nom: 'hub', script: hub }); /* en dernier : il LIT les pages d'étude */
  return out;
}

const liste = assembleurs().filter((a) => !SEULE || a.nom === SEULE);
if (!liste.length) {
  console.log('verif-etudes.js — aucune étude à vérifier' + (SEULE ? ' (« ' + SEULE + ' » inconnue)' : ''));
  process.exit(1);
}

console.log('verif-etudes.js — ' + liste.length + ' assembleur(s) rejoué(s) en mode COMPARAISON (rien n\'est écrit)\n');

let perimees = 0, casses = 0;
const t0 = Date.now();
liste.forEach((a) => {
  let sortie = '', code = 0;
  try {
    sortie = cp.execSync('node ' + JSON.stringify(a.script) + ' --verifier', { encoding: 'utf8', cwd: RACINE });
  } catch (e) {
    sortie = (e.stdout || '') + (e.stderr || '');
    code = e.status == null ? 1 : e.status;
  }
  const lignes = sortie.split('\n');
  const verdict = lignes.filter((l) => /: à jour |: PÉRIMÉE|: ABSENTE/.test(l));
  if (BAVARD) lignes.forEach((l) => { if (l.trim()) console.log('  ' + l); });
  else verdict.forEach((l) => console.log('  ' + l.trim()));

  if (verdict.some((l) => /PÉRIMÉE|ABSENTE/.test(l))) {
    perimees++;
    if (!BAVARD) {
      lignes.filter((l) => /divergence|publié\s+:|mesure du jour :|remède/.test(l))
        .forEach((l) => console.log('    ' + l.trim()));
    }
  } else if (code !== 0 || !verdict.length) {
    /* L'assembleur s'est arrêté avant de comparer : un repère de ligne qui a bougé,
       un banc qui refuse de tourner. C'est un rouge, pas un silence. */
    casses++;
    console.log('  ✗ ' + a.nom + ' : l\'assembleur n\'est pas allé jusqu\'à la comparaison (code ' + code + ')');
    lignes.filter((l) => l.trim()).slice(-4).forEach((l) => console.log('      ' + l.trim()));
  }
});

const duree = ((Date.now() - t0) / 1000).toFixed(1);
console.log('\n=== RÉSULTAT ===');
console.log('  études vérifiées ... ' + liste.length);
console.log('  pages PÉRIMÉES ..... ' + perimees);
console.log('  assembleurs cassés . ' + casses);
console.log('  durée .............. ' + duree + ' s');
if (!perimees && !casses) console.log('\nChaque page d\'étude est celle que son assembleur produit aujourd\'hui.');
else console.log('\nRelancer le ou les assembleurs concernés SANS --verifier, puis relire le diff.');

process.exit(perimees || casses ? 1 : 0);
