'use strict';
/**
 * tools/verif-etiquette-illustration.js — UNE ILLUSTRATION N'EST PAS DU CODE.
 *
 * POURQUOI CE CONTRÔLE EXISTE (2026-09-09, point B2b-24)
 * ------------------------------------------------------
 * `js/runner.js` décide du bouton d'après la CLASSE du bloc : `language-javascript` reçoit
 * « Tester », `language-markup` reçoit « Aperçu », `language-python` et `language-sql` leurs
 * moteurs. Un schéma dessiné en ASCII, une arborescence de projet, une trace d'exécution —
 * tout ce que le site range dans un fichier `.txt` — n'est exécutable par personne. Étiqueté
 * par erreur dans un langage exécutable, il reçoit pourtant un bouton, et ce bouton ne peut
 * rien promettre : le point B2b-24 en a trouvé **16 sur le site**, et un vrai Chrome a
 * compté **9 boutons réellement posés** dessus (7 « Aperçu » sur des schémas, 2 « Tester »).
 * Les 7 autres étaient déjà écartés par une garde (`neCompilePas`, le pseudo-schéma SQL,
 * `PAS_DU_PYTHON`) : leur seul défaut était une coloration Prism qui mentait.
 *
 * DEUX CONTRÔLES, ET CHACUN PEUT ÉCHOUER
 * ---------------------------------------
 * (1) Aucun bloc `.txt` ne porte une classe de langage EXÉCUTABLE. La convention du site est
 *     `language-plaintext` (766 blocs) ; les langages sans moteur (`nasm`, `julia`, `ada`…)
 *     sont tolérés, ils ne donnent qu'une coloration et jamais un bouton.
 * (2) Aucun bloc `.txt` SANS classe de langage n'est rattachable à un programme voisin.
 *     `tools/verif-sorties.js:78` ne relève que les blocs `class="language-…"` : un bloc
 *     écrit `<pre><code>` lui est INVISIBLE — ni comparé, ni compté parmi ses « non jugés ».
 *     Mesuré le 2026-09-09 : 148 blocs `.txt` sont dans ce cas et **aucun** n'est la sortie
 *     d'un programme, donc aucune sortie n'échappe aujourd'hui. Ce contrôle garde cet angle
 *     mort sous surveillance : le jour où une sortie sera écrite sans classe, il rougira.
 *     Le critère de rattachement (`estLaSortieDe`) est LU dans le vérificateur, jamais
 *     recopié — deux copies désigneraient deux ensembles différents (défaut soldé en B2b-15).
 *
 *   node tools/verif-etiquette-illustration.js
 *   node tools/verif-etiquette-illustration.js --details
 * Code de sortie : 1 dès qu'un des deux contrôles trouve quelque chose.
 */
var fs = require('fs');
var path = require('path');
var RACINE = path.resolve(__dirname, '..');
var REG = require(path.join(RACINE, 'tools', 'lib', 'regles-bouton.js'));
var DETAILS = process.argv.indexOf('--details') !== -1;

/* Les langages pour lesquels `js/runner.js` pose un bouton. La liste est celle de `init()` :
   javascript (Tester), markup (Aperçu), python et sql (leurs moteurs embarqués). */
var LANGAGES_A_BOUTON = ['javascript', 'markup', 'python', 'sql'];

var SRC = fs.readFileSync(path.join(RACINE, 'tools', 'verif-sorties.js'), 'utf8');
var i0 = SRC.indexOf('function estLaSortieDe(');
var j0 = SRC.indexOf('\n}', i0);
if (i0 < 0 || j0 < 0) { console.log('estLaSortieDe introuvable dans tools/verif-sorties.js'); process.exit(2); }
var estLaSortieDe = eval('(' + SRC.slice(i0, j0 + 2) + ')');

function tousLesBlocs(src) {
  var re = /data-file="([^"]+)"[^>]*>\s*<pre><code(?: class="language-([a-z]+)")?[^>]*>([\s\S]*?)<\/code><\/pre>/g;
  var out = [], m;
  while ((m = re.exec(src))) out.push({ nom: m[1], lang: m[2] || null });
  return out;
}

var pages = REG.lecons(null);
var txt = 0, sansClasse = 0, etiquetes = [], invisibles = [];

pages.forEach(function (f) {
  var rel = path.relative(RACINE, f).replace(/\\/g, '/');
  var bs = tousLesBlocs(fs.readFileSync(f, 'utf8'));
  bs.forEach(function (b, i) {
    if (!/\.txt$/.test(b.nom)) return;
    txt++;
    if (b.lang && LANGAGES_A_BOUTON.indexOf(b.lang) !== -1) {
      etiquetes.push(rel + ' · ' + b.nom + '  (language-' + b.lang + ')');
      return;
    }
    if (b.lang) return;
    sansClasse++;
    /* Le même voisinage que `verif-sorties.js` : le dernier bloc JavaScript avant, à trois
       blocs près, sans traverser un bloc d'un autre langage. */
    var js = null;
    for (var k = i - 1; k >= 0 && k >= i - 3; k--) {
      if (bs[k].lang === 'javascript' && /\.js$/.test(bs[k].nom)) { js = bs[k]; break; }
      if (bs[k].lang !== null && bs[k].lang !== 'plaintext') break;
    }
    if (js && estLaSortieDe(b.nom, js.nom)) invisibles.push(rel + ' · ' + b.nom + ' ← ' + js.nom);
  });
});

console.log('verif-etiquette-illustration — ' + pages.length + ' lecon(s), ' + txt + ' bloc(s) .txt');
console.log('  etiquetes dans un langage A BOUTON .. ' + etiquetes.length + '  (doit rester 0)');
console.log('  sans classe de langage .............. ' + sansClasse + '  (invisibles a verif-sorties.js)');
console.log('  dont RATTACHES a un programme ....... ' + invisibles.length + '  (doit rester 0 : sortie jamais rejouee)');
if (etiquetes.length) {
  console.log('\n=== ILLUSTRATIONS ETIQUETEES COMME DU CODE ===');
  etiquetes.forEach(function (x) { console.log('   ' + x); });
  console.log('  -> les passer a class="language-plaintext" : le bouton disparait, la coloration cesse de mentir.');
}
if (invisibles.length) {
  console.log('\n=== SORTIES QUE verif-sorties.js NE VOIT PAS ===');
  invisibles.forEach(function (x) { console.log('   ' + x); });
  console.log('  -> leur donner class="language-plaintext" : le vérificateur les rejouera.');
}
if (DETAILS && !etiquetes.length && !invisibles.length) {
  console.log('\n  (rien a signaler ; --details n\'a rien de plus a montrer)');
}
if (etiquetes.length || invisibles.length) process.exit(1);
console.log('\nAucune illustration etiquetee comme du code, aucune sortie invisible.');
