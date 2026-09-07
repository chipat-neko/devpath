'use strict';

/**
 * tools/verif-qcm-lexique-mutations.js — QUI VÉRIFIE verif-qcm-lexique.js ?
 *
 * Le cliquet de l'indice lexical est vert. Vert parce que rien n'a empiré, ou vert
 * parce qu'il ne regarde rien ? La question n'est pas rhétorique ici : ce cliquet a
 * DÉJÀ été vert à tort, deux fois.
 *   — le 2026-09-06 sur `mobile`, parce qu'il ne mesurait qu'un sens de l'indice ;
 *   — le 2026-09-07 sur `mobile`, `stats` et `php`, parce qu'il n'accordait de crédit
 *     qu'à une stratégie désignant UNE SEULE option, alors qu'un ensemble de deux vaut
 *     déjà 50 % pour l'apprenant qui y tire au sort. Les trois cours affichaient
 *     « 0,0 % sur les trois variantes » et valaient en réalité 50,0 %, 49,4 % et 50,0 %.
 *
 * Deux fois, la faille n'était pas dans le contenu : elle était dans ce que l'outil
 * refusait de compter. D'où cette épreuve, et surtout d'où le CAS 2, qui est sa raison
 * d'être : il injecte une faute que les trois dimensions HISTORIQUES ne peuvent pas
 * voir, et il exige que le verdict nomme une dimension RESTREINTE. Si le verdict
 * tombait sur « STRICTE » ou « INVERSE » tout court, le cas prouverait une branche
 * ancienne et laisserait la branche neuve sans preuve — c'est exactement l'erreur
 * commise en septembre par le cas « parenthèse » de verif-qcm-biais-mutations.js.
 *
 * Deux fichiers sont mutés : `pages/equipe/lecon-01.html` (le cours `equipe` est à
 * 0,0 % sur INVERSE dans les deux lectures, donc toute injection s'y voit) et
 * `tools/qcm-lexique-reference.json`. Les deux sont restaurés par un `finally` ET par
 * des filets sur `exit`, `SIGINT` et `uncaughtException`.
 *
 * USAGE : node tools/verif-qcm-lexique-mutations.js
 * Code de sortie : 1 si une faute passe inaperçue, si le faux positif se produit, ou
 * si un fichier n'a pas pu être restauré ; 2 si le générateur ne peut pas garantir ce
 * qu'il fabrique.
 */

var fs = require('fs');
var path = require('path');
var cp = require('child_process');

var RACINE = path.resolve(__dirname, '..');
var REL = 'pages/equipe/lecon-01.html';
var PAGE = path.join(RACINE, 'pages', 'equipe', 'lecon-01.html');
var REF = path.join(RACINE, 'tools', 'qcm-lexique-reference.json');
var VERIF = path.join(RACINE, 'tools', 'verif-qcm-lexique.js');

if (!fs.existsSync(PAGE)) { console.log('La leçon de test est introuvable : ' + REL); process.exit(2); }
if (!fs.existsSync(REF)) { console.log('Aucune référence : la créer avec `node tools/verif-qcm-lexique.js --ecrire`.'); process.exit(2); }

var pageOrig = fs.readFileSync(PAGE, 'utf8');
var refOrig = fs.readFileSync(REF, 'utf8');
var restaure = false;

function restaurer() {
  if (restaure) return;
  restaure = true;
  try { fs.writeFileSync(PAGE, pageOrig); } catch (e) {}
  try { fs.writeFileSync(REF, refOrig); } catch (e) {}
}
process.on('exit', restaurer);
process.on('SIGINT', function () { restaurer(); process.exit(130); });
process.on('uncaughtException', function (e) { restaurer(); console.error(e); process.exit(1); });

/* ---------------------------------------------------------------- le vocabulaire */
/* Les mêmes règles que la mesure : mots de 6 lettres et plus, blocs de quiz exclus.
   ⚠️ On les EXTRAIT de la page réelle au lieu de les écrire en dur : une leçon
   réécrite ferait sinon mentir l'épreuve en silence. */
function mots(t) {
  var m = String(t).toLowerCase().match(/[a-zà-öø-ÿ][a-zà-öø-ÿ'-]{5,}/g) || [];
  return m.map(function (w) { return w.replace(/^[' -]+|[' -]+$/g, ''); }).filter(Boolean);
}
var texteDeLaPage = pageOrig.replace(/<script[^>]*data-quiz(?:-bilan)?[^>]*>[\s\S]*?<\/script>/g, ' ');
var horsPage = new Set(mots(texteDeLaPage));
var PRESENTS = Array.from(horsPage);
if (PRESENTS.length < 12) {
  console.log('La leçon de test ne contient pas assez de vocabulaire pour fabriquer les cas.');
  process.exit(2);
}
var ETRANGERS = ['zorglubine', 'quimbaltrix', 'vandrolique', 'peskomorne', 'trilbaquet',
                 'flumaxerie', 'grobenchal', 'nurvispade'];
ETRANGERS.forEach(function (w) {
  if (horsPage.has(w)) {
    console.log('Le mot censé être étranger « ' + w + ' » figure dans la leçon : cas invalide.');
    process.exit(2);
  }
});

/* Une option = (4 - k) mots présents + k mots étrangers. Le NOMBRE TOTAL de mots est
   tenu constant à 4, sans quoi la variante PROPORTION trancherait par la longueur et
   non par le lexique — et le cas prouverait autre chose que ce qu'il annonce. */
function option(k, graine) {
  var out = [], i;
  for (i = 0; i < 4 - k; i++) out.push(PRESENTS[(graine * 7 + i * 3) % PRESENTS.length]);
  for (i = 0; i < k; i++) out.push(ETRANGERS[(graine + i) % ETRANGERS.length]);
  out.sort(function (a, b) { return ((a.length * 31 + graine) % 7) - ((b.length * 31 + graine) % 7); });
  return out.join(' ');
}

/* combien de mots étrangers porte réellement une option — mesuré, pas supposé */
function compteEtrangers(txt) {
  return mots(txt).filter(function (w) { return !horsPage.has(w); }).length;
}

/* CONTRÔLE DU GÉNÉRATEUR : chaque famille annonce la répartition qu'elle veut
   produire, et on la vérifie AVANT d'injecter. Un cas qui ne fabrique pas ce qu'il
   croit fabriquer prouve une autre dimension que celle qu'il nomme. */
function fabriquer(n, kBonne, kDistracteurs, libelle) {
  var qs = [], i, j;
  for (i = 0; i < n; i++) {
    var a = [], correct = i % 4, d = 0;
    for (j = 0; j < 4; j++) {
      var k = j === correct ? kBonne : kDistracteurs[d++];
      a.push(option(k, i * 4 + j));
    }
    qs.push({ q: 'Question de contrôle ' + libelle + ' ' + (i + 1) + ' ?', a: a, correct: correct });
  }
  var attendu = kDistracteurs.slice().sort().join('/');
  qs.forEach(function (q) {
    var vus = q.a.map(compteEtrangers);
    if (vus[q.correct] !== kBonne) {
      console.log('Générateur « ' + libelle + ' » : la bonne réponse porte ' + vus[q.correct] +
                  ' mot(s) étranger(s), ' + kBonne + ' attendu(s).');
      process.exit(2);
    }
    var dist = vus.filter(function (v, i2) { return i2 !== q.correct; }).sort().join('/');
    if (dist !== attendu) {
      console.log('Générateur « ' + libelle + ' » : distracteurs à ' + dist + ', ' + attendu + ' attendu.');
      process.exit(2);
    }
  });
  return qs;
}

/* CAS 1 — la faute historique : la bonne réponse est la SEULE écrite avec le seul
   vocabulaire de la page. STRICTE la désigne seule, dans les deux lectures. */
function questionsStricte(n) { return fabriquer(n, 0, [1, 1, 1], 'stricte'); }

/* CAS 2 — la faute INVISIBLE aux trois dimensions historiques : l'ANCIENNE règle
   « 0 / 0 / k » elle-même. Les trois variantes en désignation unique voient deux ex
   aequo et se taisent ; en lecture RESTREINDRE, INVERSE désigne l'ensemble
   {bonne réponse, distracteur à k} et vaut donc 50 % par construction. */
function questionsRegleDuK(n) { return fabriquer(n, 1, [0, 0, 1], 'k'); }

/* CONTRE-ÉPREUVE — la règle révisée k / k / k / k. Aucune des six dimensions ne
   restreint quoi que ce soit : le cliquet doit rester VERT. */
function questionsConformes(n) { return fabriquer(n, 1, [1, 1, 1], 'conforme'); }

/* ------------------------------------------------------------------ le contrôle */
function pageAvec(questions) {
  var bloc = '<script type="application/json" data-quiz>' + JSON.stringify(questions) + '</script>\n  ';
  return pageOrig.replace('</body>', bloc + '</body>');
}
function controler() {
  var r = cp.spawnSync(process.execPath, [VERIF], { cwd: RACINE, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
  return { code: r.status, sortie: (r.stdout || '') + (r.stderr || '') };
}
function refAvec(transforme) {
  var j = JSON.parse(refOrig);
  transforme(j);
  return JSON.stringify(j, null, 2) + '\n';
}

/* Le cours le plus exposé en lecture restreinte, LU dans la référence et non écrit en
   dur : c'est lui qu'on marquera « traité » à tort pour le cas 3. Écrire un nom de
   cours en dur ferait passer le cas AVEUGLE le jour où ce cours serait réparé. */
var refJ = JSON.parse(refOrig);
var pireRestreint = Object.keys(refJ.cours).filter(function (c) {
  return typeof refJ.cours[c].inverseRestreint === 'number';
}).sort(function (a, b) {
  return refJ.cours[b].inverseRestreint - refJ.cours[a].inverseRestreint;
})[0];
if (!pireRestreint || refJ.cours[pireRestreint].inverseRestreint <= 0.40) {
  console.log('Aucun cours au-dessus de la cible restreinte : le cas 3 ne prouverait rien.');
  process.exit(2);
}

/* Chaque mutation : [libellé, ce qu'on écrit, code attendu, motif attendu] */
var MUTATIONS = [
  ['30 questions dont la bonne réponse est la SEULE sans mot étranger (faute historique)',
    function () { fs.writeFileSync(PAGE, pageAvec(questionsStricte(30))); },
    1, /STRICTE/],

  ['30 questions écrites selon l’ANCIENNE règle 0 / 0 / k — invisible aux trois dimensions historiques',
    function () { fs.writeFileSync(PAGE, pageAvec(questionsRegleDuK(30))); },
    1, /INVERSE\/restr\./],

  ['« ' + pireRestreint + ' » marqué traiteRestreint alors qu’il est à ' +
    (100 * refJ.cours[pireRestreint].inverseRestreint).toFixed(1) + ' %',
    function () {
      fs.writeFileSync(REF, refAvec(function (j) { j.cours[pireRestreint].traiteRestreint = true; }));
    },
    1, /cible/i],

  ['un cours de la référence qui n’existe plus sur disque',
    function () {
      fs.writeFileSync(REF, refAvec(function (j) {
        j.cours['cours-fantome-de-controle'] = { questions: 10, stricte: 0, proportion: 0, inverse: 0 };
      }));
    },
    1, /n'existe\(nt\) plus|orphelin/i],

  ['référence illisible (JSON cassé) : le cliquet doit refuser de conclure',
    function () { fs.writeFileSync(REF, '{ ceci n’est pas du JSON'); },
    2, /illisible/i],

  ['CONTRE-ÉPREUVE : 30 questions conformes à la règle révisée k / k / k / k',
    function () { fs.writeFileSync(PAGE, pageAvec(questionsConformes(30))); },
    0, null]
];

console.log('verif-qcm-lexique-mutations.js — ' + MUTATIONS.length + ' cas injectés (' +
            REL + ' et tools/qcm-lexique-reference.json)\n');

var temoin = controler();
if (temoin.code !== 0) {
  console.log('  Le cliquet n’est pas vert AVANT mutation — rien ne peut être conclu :');
  console.log(temoin.sortie.split('\n').slice(-12).join('\n'));
  process.exit(2);
}
console.log('  témoin (sans mutation) : vert — la mesure a un sens.\n');

var vues = 0, aveugles = [];
try {
  MUTATIONS.forEach(function (mu) {
    fs.writeFileSync(PAGE, pageOrig);
    fs.writeFileSync(REF, refOrig);
    mu[1]();
    var r = controler();
    var codeOk = r.code === mu[2];
    var motifOk = !mu[3] || mu[3].test(r.sortie);
    if (codeOk && motifOk) {
      vues++;
      console.log('  vu   · ' + mu[0] + (mu[2] === 0 ? '  (resté vert, comme il faut)' : ''));
    } else {
      aveugles.push(mu[0] + ' [code ' + r.code + ', attendu ' + mu[2] + (motifOk ? '' : ', motif absent') + ']');
      console.log('  RATÉ · ' + mu[0] + ' (code ' + r.code + ', attendu ' + mu[2] +
                  (motifOk ? '' : ' ; motif attendu absent de la sortie') + ')');
      r.sortie.split('\n').filter(function (l) { return /%/.test(l) && /:/.test(l); })
        .slice(0, 8).forEach(function (l) { console.log('         | ' + l.trim()); });
    }
  });
} finally {
  restaurer();
}

var apres = controler();
var pageIntacte = fs.readFileSync(PAGE, 'utf8') === pageOrig;
var refIntacte = fs.readFileSync(REF, 'utf8') === refOrig;
console.log('\n  fichiers restaurés : leçon ' + (pageIntacte ? 'intacte' : 'ABÎMÉE (!)') +
  ', référence ' + (refIntacte ? 'intacte' : 'ABÎMÉE (!)'));
console.log('  contrôle après restauration : ' + (apres.code === 0 ? 'vert' : 'ROUGE (!)'));
console.log('  cas vus : ' + vues + ' / ' + MUTATIONS.length);
if (aveugles.length) {
  console.log('  ANGLES MORTS :');
  aveugles.forEach(function (a) { console.log('    · ' + a); });
}
process.exit(aveugles.length || apres.code !== 0 || !pageIntacte || !refIntacte ? 1 : 0);
