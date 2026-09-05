'use strict';

/**
 * tools/verif-qcm-biais-mutations.js — QUI VÉRIFIE verif-qcm-biais.js ?
 *
 * Le cliquet du biais des QCM est vert. Vert parce que rien n'a empiré, ou vert
 * parce qu'il ne regarde rien ? Un contrôle incapable de rougir est pire qu'un
 * contrôle absent : il rassure. Le chantier V16 en a trouvé un dans le dépôt
 * (`verif-liste-alternatives.js`, qui rend 0 quoi qu'il arrive).
 *
 * On injecte donc une faute réaliste à la fois — soit dans une leçon, soit dans
 * la référence — on relance le cliquet, et on exige le bon verdict. Le cinquième
 * cas est l'inverse des autres : des questions PARFAITEMENT ÉQUILIBRÉES ajoutées
 * au même endroit, et le cliquet doit rester VERT. Sans ce cas, un outil qui
 * rougirait sur tout passerait l'épreuve.
 *
 * Deux fichiers sont mutés : `pages/doc/lecon-01.html` (le cours `doc` est à
 * 0,0 % de biais, donc toute injection s'y voit) et `tools/qcm-biais-reference.json`.
 * Les deux sont restaurés par un `finally` ET par des filets sur `exit`, `SIGINT`
 * et `uncaughtException` — le mode `--mutations` de verif.js vérifie de son côté
 * que rien ne reste, un arrêt brutal ne déclenchant aucun filet.
 *
 * USAGE : node tools/verif-qcm-biais-mutations.js
 * Code de sortie : 1 si une faute passe inaperçue, ou si le faux positif se
 * produit, ou si un fichier n'a pas pu être restauré.
 */

var fs = require('fs');
var path = require('path');
var cp = require('child_process');

var RACINE = path.resolve(__dirname, '..');
var PAGE = path.join(RACINE, 'pages', 'doc', 'lecon-01.html');
var REL = 'pages/doc/lecon-01.html';
var REF = path.join(RACINE, 'tools', 'qcm-biais-reference.json');
var VERIF = path.join(RACINE, 'tools', 'verif-qcm-biais.js');

if (!fs.existsSync(PAGE)) { console.log('La leçon de test est introuvable : ' + REL); process.exit(2); }
if (!fs.existsSync(REF)) { console.log('Aucune référence : la créer avec `node tools/verif-qcm-biais.js --ecrire`.'); process.exit(2); }

var pageOrig = fs.readFileSync(PAGE, 'utf8');
var refOrig = fs.readFileSync(REF, 'utf8');
var restaure = false;

function restaurer() {
  if (restaure) return;
  restaure = true;
  try { fs.writeFileSync(PAGE, pageOrig); } catch (e) {}
  try { fs.writeFileSync(REF, refOrig); } catch (e) {}
}
/* Les filets. Ils ne couvrent pas l'arrêt brutal — c'est le rôle du mode dédié. */
process.on('exit', restaurer);
process.on('SIGINT', function () { restaurer(); process.exit(130); });
process.on('uncaughtException', function (e) { restaurer(); console.error(e); process.exit(1); });

/* ------------------------------------------------------- fabriquer des questions */
/* Devinables : la bonne réponse est trois fois plus longue que les distracteurs,
   et elle est la seule à être détaillée. C'est exactement le défaut à attraper. */
function questionsBiaisees(n) {
  var out = [];
  for (var i = 0; i < n; i++) {
    out.push({
      q: 'Question injectée n° ' + (i + 1) + ' — que fait cette opération ?',
      a: [
        'Elle applique la règle attendue en tenant compte du contexte, des cas limites et de la ' +
          'compatibilité, ce qui explique le comportement observé dans les deux situations décrites plus haut',
        'Rien',
        'Elle plante',
        'Autre chose',
      ],
      correct: 0,
      explain: 'Question injectée par une épreuve de mutation : elle ne doit jamais rester dans le dépôt.',
    });
  }
  return out;
}
/* Équilibrées : quatre options de longueur comparable, toutes plausibles, une
   seule juste. La bonne réponse est mise en dernière position pour que même la
   position ne puisse pas servir d'indice à l'outil. */
function questionsEquilibrees(n) {
  var out = [];
  for (var i = 0; i < n; i++) {
    out.push({
      q: 'Question équilibrée n° ' + (i + 1) + ' — quel énoncé décrit le comportement ?',
      a: [
        'Le résultat est calculé avant la comparaison, ce qui change la valeur finale renvoyée',
        'Le résultat est mis en cache par le moteur, et la seconde exécution renvoie la première',
        'Le résultat dépend de la locale du système, donc il varie d’une machine à une autre',
        'Le résultat est calculé après la comparaison, et la valeur initiale reste inchangée',
      ],
      correct: 3,
      explain: 'Question injectée par une épreuve de mutation : elle ne doit jamais rester dans le dépôt.',
    });
  }
  return out;
}
/* Devinables PAR LA SEULE PARENTHESE. Ajoutees en B4 (2026-09-04) avec l'indice
   « l'incise entre parentheses » : sans ce cas, la branche neuve d'EXPLOITABLES
   n'etait eprouvee par RIEN, et un verificateur dont une branche n'est jamais
   exercee ne vaut pas mieux qu'un verificateur absent.
   Les quatre options sont de longueur voisine, portent le meme nombre de virgules
   et le meme vocabulaire : SEULE la bonne reponse glisse une incise entre
   parentheses. Le verdict attendu doit donc nommer la PARENTHESE, pas la
   longueur -- c'est ce que le motif de la mutation controle. */
function questionsParenthesees(n) {
  var out = [];
  for (var i = 0; i < n; i++) {
    out.push({
      q: 'Question parenthesee n° ' + (i + 1) + ' — quel enonce decrit le comportement ?',
      a: [
        'Le compteur est remis a zero avant la lecture, si bien que la valeur affichee reste nulle',
        'Le compteur est remis a zero apres la lecture, si bien que la valeur affichee est doublee',
        'Le compteur est recopie avant la lecture, si bien que la valeur affichee vient de la copie',
        'Le compteur est lu avant la remise a zero (avant l ecriture), et la valeur affichee est juste',
      ],
      correct: 3,
      explain: 'Question injectee par une epreuve de mutation : elle ne doit jamais rester dans le depot.',
    });
  }
  return out;
}
/* Devinables PAR LA SEULE PONCTUATION FINALE. Ajoutees en B4 (2026-09-05) avec
   l'indice « la ponctuation finale unique », et la faute qui l'a fait naitre est
   une faute DU CHANTIER lui-meme : la vague de reecriture des distracteurs de
   `react` a termine par un POINT chacun des 45 distracteurs des lecons 16 a 20,
   en laissant leur bonne reponse sans ponctuation finale. Sur ces cinq lecons,
   l'option a la fin unique etait la bonne 15 fois sur 15 -- et aucune des onze
   strategies d'alors ne regardait le DERNIER caractere.
   Les quatre options sont ici de longueur voisine, de meme vocabulaire, de meme
   mot d'attaque et de meme ponctuation interne : SEULE la bonne reponse n'a pas
   de point final. Le verdict attendu doit nommer la PONCTUATION FINALE. */
function questionsPointees(n) {
  var out = [];
  for (var i = 0; i < n; i++) {
    out.push({
      q: 'Question pointee n° ' + (i + 1) + ' — quel enonce decrit le comportement ?',
      a: [
        'Le tampon est vide avant la lecture, si bien que la valeur rendue reste nulle.',
        'Le tampon est vide apres la lecture, si bien que la valeur rendue est doublee.',
        'Le tampon est copie avant la lecture, si bien que la valeur rendue vient du double.',
        'Le tampon est lu avant la remise a zero, si bien que la valeur rendue reste juste',
      ],
      correct: 3,
      explain: 'Question injectee par une epreuve de mutation : elle ne doit jamais rester dans le depot.',
    });
  }
  return out;
}
function pageAvec(questions) {
  var bloc = '<script type="application/json" data-quiz>' + JSON.stringify(questions) + '</script>\n  ';
  return pageOrig.replace('</body>', bloc + '</body>');
}

/* ------------------------------------------------------------------ le contrôle */
function controler() {
  var r = cp.spawnSync(process.execPath, [VERIF], { cwd: RACINE, encoding: 'utf8', maxBuffer: 32 * 1024 * 1024 });
  return { code: r.status, sortie: (r.stdout || '') + (r.stderr || '') };
}
function refAvec(transforme) {
  var j = JSON.parse(refOrig);
  transforme(j);
  return JSON.stringify(j, null, 2) + '\n';
}

/* Chaque mutation : [libellé, ce qu'on écrit, verdict attendu, motif attendu] */
var MUTATIONS = [
  ['6 questions devinables ajoutées à doc (0,0 % au départ)',
    function () { fs.writeFileSync(PAGE, pageAvec(questionsBiaisees(6))); },
    1, /regression/],

  ['60 questions devinables, et doc marqué « traité »',
    function () {
      fs.writeFileSync(PAGE, pageAvec(questionsBiaisees(60)));
      fs.writeFileSync(REF, refAvec(function (j) { j.cours.doc.traite = true; }));
    },
    1, /cible perdue/],

  /* Le cours-temoin doit etre un cours ENCORE biaise : quand ce cas employait 'zig',
     le point B3 l'a ramene a 23,9 % et l'epreuve a cesse de prouver quoi que ce soit --
     elle est passee VERTE en silence. Verifier ce choix a chaque cours traite. */
  ['stats (99,3 % de biais) retiré de la référence : il redevient un « cours neuf »',
    function () { fs.writeFileSync(REF, refAvec(function (j) { delete j.cours.stats; })); },
    1, /cours neuf non conforme/],

  /* B4 : le biais de PARENTHESE sans biais de longueur. Le motif attendu nomme
     l'incise : si le verdict tombait sur « la plus longue », le cas ne
     prouverait pas la branche neuve, il prouverait l'ancienne. */
  ['60 questions devinables A LA SEULE PARENTHESE, et doc marqué « traité »',
    function () {
      fs.writeFileSync(PAGE, pageAvec(questionsParenthesees(60)));
      fs.writeFileSync(REF, refAvec(function (j) { j.cours.doc.traite = true; }));
    },
    1, /incise entre parentheses/],

  /* B4 : le biais de PONCTUATION FINALE, sans biais de longueur ni de parenthese.
     Le motif attendu nomme la ponctuation finale : si le verdict tombait sur une
     autre strategie, le cas ne prouverait pas la branche neuve. */
  ['60 questions devinables A LA SEULE PONCTUATION FINALE, et doc marqué « traité »',
    function () {
      fs.writeFileSync(PAGE, pageAvec(questionsPointees(60)));
      fs.writeFileSync(REF, refAvec(function (j) { j.cours.doc.traite = true; }));
    },
    1, /ponctuation finale unique/],

  ['un cours qui n’existe pas ajouté à la référence',
    function () {
      fs.writeFileSync(REF, refAvec(function (j) {
        j.cours['cours-fantome'] = { questions: 10, longueur: 0.1, pire: 0.1, pireStrategie: 'la plus longue', traite: false };
      }));
    },
    1, /reference orpheline/],

  ['la référence rendue illisible',
    function () { fs.writeFileSync(REF, '{ ceci n’est pas du JSON'); },
    1, /illisible/],

  ['CONTRE-ÉPREUVE : 6 questions ÉQUILIBRÉES ajoutées au même endroit',
    function () { fs.writeFileSync(PAGE, pageAvec(questionsEquilibrees(6))); },
    0, null],
];

console.log('verif-qcm-biais-mutations.js — ' + MUTATIONS.length + ' cas injectés (' + REL + ' et tools/qcm-biais-reference.json)\n');

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
      console.log('  RATÉ · ' + mu[0] + ' (code ' + r.code + ', attendu ' + mu[2] + (motifOk ? '' : ' ; motif attendu absent de la sortie') + ')');
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
