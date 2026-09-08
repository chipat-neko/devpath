'use strict';
/**
 * tools/verif-verdict-mutations.js — L'ÉPREUVE DU VERDICT DE LA CHAÎNE.
 *
 * POURQUOI CE FICHIER EXISTE (point A5 du chantier V17, 2026-09-08).
 * `tools/verif.js` lisait le code de sortie de chaque étape sur DEUX valeurs : zéro
 * ou pas zéro. Les vérificateurs du projet, eux, en rendent TROIS depuis toujours :
 *
 *     0  la mesure a eu lieu, rien à signaler
 *     1  la mesure a eu lieu, une faute a été trouvée
 *     2  RIEN N'A PU ÊTRE MESURÉ (données illisibles, moteur introuvable, Chrome
 *        absent, interpréteur manquant, fichier de référence absent)
 *
 * Mesure du 2026-09-08 : **30 des 62 étapes** de la chaîne savent sortir en 2.
 * **25** n'étaient pas déclarées `sautable` — leur panne se lisait « un vérificateur
 * a signalé quelque chose », c'est-à-dire une faute du site qui n'existait pas. Les
 * **5** autres l'étaient, et leur code 2 était **converti en 0** : la chaîne
 * imprimait « tout est vert » pour une étape qui n'avait rien regardé. C'est
 * exactement la forme du défaut qui fonde ce chantier — un contrôle vert qui n'a
 * rien mesuré.
 *
 * CE QUE FAIT CE SCRIPT. Un verdict ne se relit pas, il s'éprouve : on donne à la
 * chaîne des étapes dont on CONNAÎT le code de sortie, et on exige le bon état, le
 * bon message et le bon code de sortie global.
 *   · cas 1 à 4 : un TÉMOIN jetable (`tools/_canari-verdict.tmp.js`), écrit puis
 *     effacé par ce script, sort successivement en 0, 1, 2 et 3. Il est lancé par
 *     `verif.js --seules=` — l'option ajoutée au même point, qui permet de faire
 *     juger une étape précise sans payer les cinquante autres.
 *   · cas 5 et 6 : la RÉGRESSION HISTORIQUE, sur une vraie étape `sautable`. On
 *     injecte un `process.exit(2)` en tête de `verif-python-exos.js`, on exige que
 *     la chaîne la compte NON MESURÉE et sorte en 2 (avant le point A5 : « OK » et
 *     code 0), puis on restaure les octets d'origine et on exige le retour au vert.
 *
 * Les octets du fichier muté sont gardés EN MÉMOIRE et restaurés quoi qu'il arrive :
 * fin normale, exception, SIGINT. Le témoin jetable est effacé de même. Le script
 * refuse de conclure si l'un des deux traîne encore.
 *
 *   node tools/verif-verdict-mutations.js
 *
 * Code de sortie : 0 si les six cas sont vus · 1 si un cas passe inaperçu, ou si un
 * fichier n'a pas été rendu à son état d'origine · 2 si l'épreuve n'a rien pu
 * mesurer (elle applique à elle-même la distinction qu'elle vérifie).
 */
var fs = require('fs');
var path = require('path');
var cp = require('child_process');

var TOOLS = __dirname;
var RACINE = path.resolve(TOOLS, '..');
var CANARI = path.join(TOOLS, '_canari-verdict.tmp.js');
var SAUTABLE = path.join(TOOLS, 'verif-python-exos.js');

var octetsSautable = null;   /* les octets d'origine, gardés en mémoire */

function poser(code) {
  fs.writeFileSync(CANARI,
    '/* Témoin jetable écrit par tools/verif-verdict-mutations.js. Il ne mesure rien :\n' +
    '   sa seule raison d\'être est de sortir sur un code CONNU pour que le verdict de\n' +
    '   la chaîne soit éprouvé sur les trois états. Effacé par le script à la sortie. */\n' +
    'console.log("temoin du verdict : je sors en ' + code + '");\n' +
    'process.exit(Number("' + code + '"));\n', 'utf8');
}
function nettoyer() {
  try { if (fs.existsSync(CANARI)) fs.unlinkSync(CANARI); } catch (e) { /* rien */ }
  try { if (octetsSautable !== null) { fs.writeFileSync(SAUTABLE, octetsSautable); octetsSautable = null; } }
  catch (e) { /* rien */ }
}
process.on('exit', nettoyer);
process.on('SIGINT', function () { nettoyer(); process.exit(2); });
process.on('uncaughtException', function (e) {
  nettoyer();
  console.log('\nverif-verdict-mutations — ECHEC TECHNIQUE, rien n\'a pu etre mesure : ' + (e && e.message ? e.message : e));
  process.exit(2);
});

/* Lance la chaîne sur la seule étape demandée et rend {code, sortie}. */
function chaine(motif) {
  var r = cp.spawnSync(process.execPath, [path.join(TOOLS, 'verif.js'), '--seules=' + motif], {
    encoding: 'utf8', cwd: RACINE, maxBuffer: 32 * 1024 * 1024, timeout: 300000,
  });
  if (r.error) throw new Error('la chaine n\'a pas pu etre lancee : ' + (r.error.code || r.error.message));
  return { code: r.status, sortie: (r.stdout || '') + (r.stderr || '') };
}

var CAS = [];
var echecs = 0;
function juger(nom, attenduCode, attenduEtat, interdit, res) {
  var okCode = res.code === attenduCode;
  var okEtat = res.sortie.indexOf(attenduEtat) !== -1;
  var okInterdit = !interdit || res.sortie.indexOf(interdit) === -1;
  var vu = okCode && okEtat && okInterdit;
  if (!vu) echecs++;
  CAS.push({ nom: nom, vu: vu, code: res.code, attendu: attenduCode, etat: attenduEtat,
    okEtat: okEtat, okInterdit: okInterdit });
  console.log('  ' + (vu ? 'VU     ' : 'MANQUE ') + nom);
  console.log('           code de sortie : ' + res.code + ' (attendu ' + attenduCode + ')' +
    ' · « ' + attenduEtat +' » ' + (okEtat ? 'present' : 'ABSENT') +
    (interdit ? ' · « ' + interdit + ' » ' + (okInterdit ? 'absent, bien' : 'PRESENT, faux') : ''));
}

console.log('verif-verdict-mutations.js — le verdict de la chaine, mis a l\'epreuve\n');

/* ---------------------------------------------------------------- cas 1 a 4 */
poser(0);
juger('temoin sortant en 0 -> OK, chaine verte', 0, 'OK', null, chaine('_canari-verdict.tmp.js'));

poser(1);
juger('temoin sortant en 1 -> SIGNALE, chaine rouge', 1, 'SIGNALE', 'tout est vert',
  chaine('_canari-verdict.tmp.js'));

poser(2);
var r2 = chaine('_canari-verdict.tmp.js');
juger('temoin sortant en 2 -> NON MESURE, code 2', 2, 'NON MESURE', 'tout est vert', r2);
/* Une étape non mesurée doit DIRE pourquoi : sans cause imprimée, la ligne se lit
   comme une étape ordinaire et personne ne va la chercher. */
var okCause = r2.sortie.indexOf('RIEN N\'A ETE MESURE par ces etapes') !== -1;
if (!okCause) echecs++;
console.log('  ' + (okCause ? 'VU     ' : 'MANQUE ') + 'le bloc « RIEN N\'A ETE MESURE » nomme l\'etape et sa cause');

poser(3);
juger('temoin sortant en 3 -> SIGNALE (un code non nul autre que 2 reste une faute)', 1, 'SIGNALE',
  'NON MESURE', chaine('_canari-verdict.tmp.js'));

try { fs.unlinkSync(CANARI); } catch (e) { /* rien */ }

/* ------------------------------------------------------------- cas 5 et 6 */
/* LA RÉGRESSION HISTORIQUE, sur une vraie étape `sautable`. Avant le point A5,
   `code: e.sautable && r.status === 2 ? 0 : r.status` repeignait ce cas en vert. */
octetsSautable = fs.readFileSync(SAUTABLE);
var src = octetsSautable.toString('utf8');
var ancre = '"use strict";';
if (src.indexOf(ancre) === -1) ancre = "'use strict';";
if (src.indexOf(ancre) === -1) {
  console.log('\n  verif-python-exos.js : pas de directive « use strict » ou l\'injecter.');
  console.log('  Cette epreuve n\'a rien pu mesurer sur les cas 5 et 6.');
  process.exit(2);
}
fs.writeFileSync(SAUTABLE, src.replace(ancre,
  ancre + '\nconsole.log("injection de l\'epreuve du verdict : interpreteur absent");\nprocess.exit(2);'));
juger('etape `sautable` sortant en 2 -> NON MESURE, code 2 (et non « OK », vert)', 2, 'NON MESURE',
  'tout est vert', chaine('verif-python-exos.js'));

fs.writeFileSync(SAUTABLE, octetsSautable);
octetsSautable = null;
juger('la faute retiree -> retour au vert', 0, 'tout est vert', 'NON MESURE',
  chaine('verif-python-exos.js'));

/* ------------------------------------------------------------------ bilan */
var restes = [];
if (fs.existsSync(CANARI)) restes.push('tools/_canari-verdict.tmp.js');
var g = cp.spawnSync('git', ['status', '--porcelain', '--', 'tools/verif-python-exos.js'],
  { cwd: RACINE, encoding: 'utf8' });
if (g.status === 0 && (g.stdout || '').trim()) restes.push('tools/verif-python-exos.js (non restaure)');

console.log('\n' + '='.repeat(70));
console.log('  ' + (CAS.length - echecs >= 0 ? '' : '') +
  CAS.filter(function (c) { return c.vu; }).length + ' / ' + CAS.length + ' cas vus' +
  (echecs ? '  — ' + echecs + ' verdict(s) faux' : '') +
  '  ·  depot : ' + (restes.length ? 'SALE — ' + restes.join(', ') : 'propre'));
process.exit(echecs || restes.length ? 1 : 0);
