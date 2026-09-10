/* Assemble pages/etude-inconnu.html — l'étude de cas nº 6.

   Même discipline que les cinq études précédentes : aucun code recopié à la main, aucun
   chiffre écrit de tête. Deux exigences propres à celle-ci :

   · La page publie des CHIFFRES DE MESURE (combien de langages possèdent tel marqueur).
     Ils sont pris à la mesure au moment de l'assemblage, jamais tapés — et l'assembleur
     REFUSE d'écrire si une affirmation nommée dans une phrase ne colle plus à la mesure :
     que l'assembleur soit le langage qui manque le plus de marqueurs, que Prolog n'ait ni
     mot pour « fonction » ni boucle, que le marqueur « si » soit tombé après correction.

   · La page publie du GO QU'AUCUN COMPILATEUR N'A VU. La sortie affichée n'est donc pas
     celle du Go : c'est celle de la transcription JavaScript, exécutée ici. L'assembleur
     vérifie que la page le DIT, en cherchant la phrase d'avertissement — parce qu'une
     sortie non prouvée publiée sans avertissement serait précisément la faute qui a fondé
     tous ces chantiers.

     node tools/etudes/inconnu/assembler.js
*/

var fs = require('fs');
var cp = require('child_process');
var os = require('os');
var path = require('path');

var ICI = __dirname;
var RACINE = path.resolve(ICI, '..', '..', '..');

function echapper(txt) { return txt.replace(/&/g, '&amp;').replace(/</g, '&lt;'); }
function lireIci(f) { return fs.readFileSync(path.join(ICI, f), 'utf8').replace(/\r\n/g, '\n'); }
function stop(quoi) { console.log('✗ ' + quoi); process.exit(1); }

/* ------------------------------------------------------------------ 1. la mesure */
var mesureLangages = require('./mesure-langages.js');
var mesure = mesureLangages.mesurer();
/* ⚠️ POINT C3 : la sortie brute publiée provenait d'une SECONDE mesure lancée en
   sous-processus — deux mesures du même site au même instant, donc deux occasions de
   diverger, et rien pour le dire. Elle est maintenant le rendu de LA mesure ci-dessus. */
var sortieMesure = mesureLangages.rendre(mesure);

var N_LANGAGES = mesure.programmes.length;
var N_MARQUEURS = mesure.marqueurs.length;
if (N_LANGAGES < 30) stop('seulement ' + N_LANGAGES + ' langages retenus : la mesure a changé de nature.');

var universels = mesure.marqueurs.filter(function (m) { return m.possede === N_LANGAGES; });
var presque = mesure.marqueurs.filter(function (m) { return m.possede === N_LANGAGES - 1; });
if (universels.length === 0) stop('plus aucun marqueur présent dans tous les langages : la page l’affirme.');
if (presque.length === 0) stop('plus aucun marqueur à ' + (N_LANGAGES - 1) + '/' + N_LANGAGES + ' : la page en nomme trois.');
console.log('✓ mesure : ' + N_LANGAGES + ' langages, ' + mesure.formats.length + ' formats, ' +
            mesure.blocsSubstantiels + ' blocs substantiels sur ' + mesure.blocs);
console.log('✓ ' + universels.length + ' marqueur(s) présent(s) dans les ' + N_LANGAGES + ' langages, ' +
            presque.length + ' à ' + (N_LANGAGES - 1) + '/' + N_LANGAGES);

/* La page NOMME trois marqueurs comme étant ceux qui sont « juste derrière » : on
   vérifie que ce sont bien ceux-là, et pas d’autres. */
var ATTENDUS_PRESQUE = ['parenth', 'appel', 'egal'];
var idsPresque = presque.map(function (m) { return m.id; }).sort();
if (idsPresque.join(',') !== ATTENDUS_PRESQUE.slice().sort().join(',')) {
  stop('la page nomme ' + ATTENDUS_PRESQUE.join(', ') + ' comme marqueurs à ' + (N_LANGAGES - 1) +
       '/' + N_LANGAGES + ' ; la mesure donne ' + idsPresque.join(', ') + '.');
}
console.log('✓ les ' + ATTENDUS_PRESQUE.length + ' marqueurs nommés dans le texte sont bien ceux mesurés à ' +
            (N_LANGAGES - 1) + '/' + N_LANGAGES);

/* La page affirme que ces trois-là manquent TOUS au même langage. */
presque.forEach(function (m) {
  if (m.absentDe.length !== 1 || m.absentDe[0] !== 'nasm') {
    stop('la page dit que les 3 marqueurs à ' + (N_LANGAGES - 1) + '/' + N_LANGAGES +
         ' manquent au même langage (l’assembleur) ; « ' + m.id + ' » manque à ' + m.absentDe.join(', ') + '.');
  }
});

/* La page affirme que l’ASSEMBLEUR est le langage qui manque le plus de marqueurs, et
   que Prolog n’a ni mot pour « fonction », ni « si », ni boucle. Vérifions les deux. */
var manques = {};
mesure.programmes.forEach(function (L) { manques[L.langue] = 0; });
mesure.marqueurs.forEach(function (m) {
  m.absentDe.forEach(function (l) { manques[l] = (manques[l] || 0) + 1; });
});
var classement = Object.keys(manques).sort(function (a, b) { return manques[b] - manques[a]; });
if (classement[0] !== 'nasm') {
  stop('la page dit que l’assembleur manque le plus de marqueurs ; la mesure désigne ' +
       classement[0] + ' (' + manques[classement[0]] + ' contre ' + manques.nasm + ' pour nasm).');
}
if (manques.nasm === manques[classement[1]]) {
  stop('l’assembleur est ex æquo avec ' + classement[1] + ' (' + manques.nasm + ') : la page dit « un seul langage ».');
}
['fonction', 'if', 'boucle'].forEach(function (id) {
  var m = mesure.marqueurs.filter(function (x) { return x.id === id; })[0];
  if (m.absentDe.indexOf('prolog') === -1) stop('la page dit que Prolog n’a pas « ' + id + ' » ; la mesure le trouve.');
});
['appel', 'egal', 'if', 'boucle'].forEach(function (id) {
  var m = mesure.marqueurs.filter(function (x) { return x.id === id; })[0];
  if (m.absentDe.indexOf('nasm') === -1) stop('la page dit que l’assembleur n’a pas « ' + id + ' » ; la mesure le trouve.');
});
console.log('✓ assembleur : ' + manques.nasm + ' marqueurs absents (2ᵉ : ' + classement[1] + ', ' +
            manques[classement[1]] + ') · Prolog sans fonction/si/boucle : confirmé');

/* La page raconte que le marqueur « si » ressortait présent dans TOUS les langages
   avant la correction des marques de commentaire, et qu’il est tombé après. On vérifie
   au moins qu’il n’est plus universel : sinon le récit de la page serait faux. */
var mSi = mesure.marqueurs.filter(function (m) { return m.id === 'if'; })[0];
if (mSi.possede === N_LANGAGES) {
  stop('le marqueur « si » est de nouveau à ' + N_LANGAGES + '/' + N_LANGAGES + ' : le récit de la page est faux.');
}

/* ------------------------------------------------------- 2. le programme et le banc */
var programme = lireIci('inventaire.go').replace(/\n+$/, '');
var lignesGo = programme.split('\n');
var solution = lireIci('solution.go').replace(/\n+$/, '');

var transcription = lireIci('transcription.js');
var d = transcription.indexOf('/* @@DEBUT_BANC@@ */');
var f = transcription.indexOf('/* @@FIN_BANC@@ */');
if (d === -1 || f === -1 || f < d) stop('les marqueurs de tranche ont disparu de transcription.js.');
var tranche = transcription.slice(d + '/* @@DEBUT_BANC@@ */'.length, f).replace(/^\n+/, '').replace(/\n+$/, '');

var banc = lireIci('banc.js')
  .split('@@ORIGINE@@').join('Extrait de tools/etudes/inconnu/transcription.js le jour de l\'assemblage.')
  .split('@@TRANSCRIPTION@@').join(tranche)
  .replace(/\n+$/, '');
if (banc.indexOf('@@') !== -1) stop('jeton non remplacé dans le banc.');

/* ⚠️ PIÈGE MESURÉ (étude nº 3) : runner.js refuse de poser un bouton « Tester » sur un
   bloc contenant certains mots — dont « document » au singulier dans un commentaire
   français. On recopie son test et on refuse de publier un banc muet. */
var BROWSER_ONLY = /(?:^|[^\w$À-ɏ])(document|window|localStorage|sessionStorage|alert|prompt|confirm|location|navigator|process|Buffer|__dirname|__filename)(?![\w$À-ɏ])|require\s*\(|module\.exports|\bexports\.|\bglobalThis\b|node:|new Worker|postMessage|SharedArrayBuffer|Atomics|importScripts/;
var interdit = BROWSER_ONLY.exec(banc);
if (interdit) stop('le banc contient « ' + interdit[0].trim() + ' » : runner.js n’y mettrait pas de bouton « Tester ».');

function executer(source, etiquette) {
  var tmp = path.join(os.tmpdir(), 'syntaxe-inconnu-' + etiquette + '-' + process.pid + '.js');
  fs.writeFileSync(tmp, source);
  try {
    return cp.execSync('node "' + tmp + '"', { encoding: 'utf8' }).replace(/\r\n/g, '\n').replace(/\n+$/, '');
  } finally { fs.unlinkSync(tmp); }
}
var sortieBanc = executer(banc, 'banc');
var lignesSortie = sortieBanc.split('\n');

/* La sortie du banc doit être celle du module : sinon la tranche extraite ne représente
   plus la transcription, et la page publierait deux programmes différents. */
var sortieModule = require('./transcription.js').inventaire(require('./transcription.js').JOURNAL).replace(/\n$/, '');
if (sortieBanc !== sortieModule) stop('la tranche publiée ne rend pas la même sortie que transcription.js.');
console.log('✓ banc exécuté : ' + lignesSortie.length + ' lignes, identiques à celles du module');

/* Ce que le texte AFFIRME de cette sortie, vérifié ligne à ligne. */
if (lignesSortie[lignesSortie.length - 1] !== '-- fin du rapport --') {
  stop('la page affirme que « -- fin du rapport -- » est la dernière ligne ; elle ne l’est pas.');
}
var rejets = lignesSortie.filter(function (l) { return l.indexOf('rejeté :') === 0; });
if (rejets.length !== 2) stop('la page parle de deux lignes rejetées ; le banc en rend ' + rejets.length + '.');
if (rejets[0].indexOf('mal formée') === -1 || rejets[1].indexOf('illisible') === -1) {
  stop('la page dit que les deux rejets ont deux raisons différentes (mal formée / illisible) : ce n’est plus le cas.');
}
var ligneClou = lignesSortie.filter(function (l) { return l.indexOf('clou') === 0; })[0];
if (!ligneClou || ligneClou.indexOf('IMPOSSIBLE') === -1 || ligneClou.indexOf('-') === -1) {
  stop('la page affirme que le solde de « clou » est négatif et signalé IMPOSSIBLE : ' + ligneClou);
}
console.log('✓ sortie conforme au texte : defer en dernier, 2 rejets de 2 natures, clou négatif');

/* La modification proposée, exécutée elle aussi. */
var sortieModif = cp.execSync('node "' + path.join(ICI, 'modif.js') + '"', { encoding: 'utf8' })
  .replace(/\r\n/g, '\n').replace(/\n+$/, '');
if (sortieModif.indexOf('MVTS') === -1) stop('la sortie attendue de la modification ne contient pas la colonne MVTS.');
if (sortieModif.split('\n').length !== lignesSortie.length) {
  stop('la modification change le nombre de lignes : la page dit qu’elle n’ajoute qu’une colonne.');
}
console.log('✓ modification exécutée : ' + sortieModif.split('\n').length + ' lignes, colonne MVTS présente');

/* ----------------------------------------------------------------- 3. les fragments */
function ligneTableau(m) {
  return '              <tr><th scope="row">' + echapper(m.nom) + '</th>' +
    '<td data-libelle="Possèdent">' + m.possede + '&nbsp;/&nbsp;' + N_LANGAGES + '</td>' +
    '<td data-libelle="Courant dans">' + m.courant + '&nbsp;/&nbsp;' + N_LANGAGES + '</td></tr>';
}
var tableau = mesure.marqueurs.map(ligneTableau).join('\n');

function enumerer(liste) {
  if (liste.length === 1) return liste[0];
  return liste.slice(0, -1).join(', ') + ' et ' + liste[liste.length - 1];
}
var listeUniv = enumerer(universels.map(function (m) { return m.nom; }));
var listeFormats = enumerer(mesure.formats.map(function (L) { return L.langue; }));

/* La page raconte que « clike » agrège cinq langages : on vérifie qu'elle a bien été
   écartée et qu'elle représente encore une masse de blocs digne d'être mentionnée. */
var clike = mesure.floues.filter(function (L) { return L.langue === 'clike'; })[0];
if (!clike) stop('l’étiquette « clike » n’est plus écartée : la page en parle.');
if (mesure.programmes.some(function (L) { return L.langue === 'clike'; })) {
  stop('« clike » est revenue parmi les langages mesurés.');
}
console.log('✓ étiquette floue « clike » écartée : ' + clike.blocs + ' blocs, ' + clike.substantiels + ' substantiels');

/* La page publie 1523 leçons et affirme implicitement le compte du site : on vérifie
   que ce nombre est bien celui de la page d'accueil, sans quoi le site se
   contredirait lui-même. */
var accueil = fs.readFileSync(path.join(RACINE, 'index.html'), 'utf8');
var annonce = /<strong>(\d+)<\/strong>\s*leçons/.exec(accueil);
if (!annonce) stop('impossible de relire le nombre de leçons annoncé par la page d’accueil.');
if (Number(annonce[1]) !== mesure.fichiers) {
  stop('la mesure compte ' + mesure.fichiers + ' leçons, la page d’accueil en annonce ' + annonce[1] + '.');
}
console.log('✓ ' + mesure.fichiers + ' leçons comptées = le nombre annoncé par la page d’accueil (' +
            mesure.redirections + ' redirections écartées)');

/* ---------------------------------------------------------------------- 4. la page */
var CHIFFRES = {
  '@@N_LANGAGES@@': String(N_LANGAGES),
  '@@N_MARQUEURS@@': String(N_MARQUEURS),
  '@@N_FORMATS@@': String(mesure.formats.length),
  '@@N_BLOCS@@': String(mesure.blocsSubstantiels),
  '@@N_TOTALBLOCS@@': String(mesure.blocs),
  '@@N_LECONS@@': String(mesure.fichiers),
  '@@SEUIL_LIGNES@@': String(mesure.seuilLignes),
  '@@SEUIL_BLOCS@@': String(mesure.seuilBlocs),
  '@@N_UNIV@@': String(universels.length),
  '@@N_PRESQUE@@': String(N_LANGAGES - 1),
  '@@NASM_MANQUE@@': String(manques.nasm),
  '@@IF_POSSEDE@@': String(mSi.possede),
  '@@N_LIGNES_GO@@': String(lignesGo.length),
  '@@N_LIGNES_SORTIE@@': String(lignesSortie.length),
  '@@LISTE_UNIV@@': listeUniv,
  '@@LISTE_FORMATS@@': listeFormats,
  '@@CLIKE_BLOCS@@': String(clike ? clike.blocs : 0)
};

var page = lireIci('gabarit.html')
  .replace('@@TABLEAU_MARQUEURS@@', tableau)
  .replace('@@PROGRAMME_GO@@', echapper(programme))
  .replace('@@SOLUTION_GO@@', echapper(solution))
  .replace('@@BANC@@', echapper(banc))
  .replace('@@SORTIE_BANC@@', echapper(sortieBanc))
  .replace('@@SORTIE_MODIF@@', echapper(sortieModif))
  .replace('@@SORTIE_MESURE@@', echapper(sortieMesure));

Object.keys(CHIFFRES).forEach(function (jeton) { page = page.split(jeton).join(CHIFFRES[jeton]); });

if (page.indexOf('@@') !== -1) {
  stop('il reste un jeton non remplacé : ' + page.slice(page.indexOf('@@'), page.indexOf('@@') + 30));
}

/* L'avertissement est OBLIGATOIRE : sans lui, la page publierait une sortie non prouvée
   comme si elle l'était. C'est le seul contrôle de cet assembleur qui porte sur une
   PHRASE et non sur un chiffre, et c'est le plus important. */
if (page.indexOf('n’a pas de compilateur Go') === -1 && page.indexOf("n'a pas de compilateur Go") === -1) {
  stop('l’avertissement « ce site n’a pas de compilateur Go » a disparu de la page.');
}
if (page.indexOf(echapper(sortieBanc)) === -1) stop('la sortie publiée n’est pas celle qui vient d’être exécutée.');
if (page.indexOf(echapper(programme)) === -1) stop('le programme publié n’est pas celui du fichier .go.');
if (page.indexOf(echapper(banc)) === -1) stop('le banc publié n’est pas celui qui vient d’être exécuté.');

var cible = path.join(RACINE, 'pages', 'etude-inconnu.html');
fs.writeFileSync(cible, page);
console.log('✓ écrit : ' + path.relative(RACINE, cible) + ' (' + page.length + ' octets)');
