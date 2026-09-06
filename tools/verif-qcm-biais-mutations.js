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
   et elle est la seule à être détaillée. C'est exactement le défaut à attraper.

   ⚠️ CE CAS EST INJECTÉ DANS `doc`, ET SA PREMISSE A ÉTÉ RETOURNÉE le 2026-09-06.
   Il s'intitulait « 6 questions devinables ajoutées à doc (0,0 % au départ) » :
   0,0 % passait alors pour le meilleur chiffre du site. On sait maintenant que
   0,0 % est aussi exploitable que 100 % — il suffit d'inverser la règle — et le
   cliquet juge donc l'ÉCART AU HASARD. Conséquence mesurée : ajouter à `doc` six
   questions dont la bonne réponse est la plus longue le fait passer de 0,0 % à
   8,6 %, c'est-à-dire le RAPPROCHE du hasard. Le cliquet répondait « progrès »,
   et il avait raison ; c'était la mutation qui se trompait de défaut.
   Le cas injecte donc désormais des questions AU RANG 1 (bonne réponse deuxième
   plus longue), qui est le biais réel de `doc` : 39 de ses 64 questions y sont,
   et c'est ce qui le rend devinable 60,2 % du temps. Une mutation doit renforcer
   le biais du cours qu'elle vise, pas un biais imaginaire. */
function questionsRang1(n) {
  var out = [];
  for (var i = 0; i < n; i++) {
    out.push({
      q: 'Question de rang 1 n° ' + (i + 1) + ' — que fait cette opération ?',
      a: [
        'Elle applique la règle attendue en tenant compte du contexte et des cas limites décrits',
        'Elle échoue toujours, quel que soit le contexte, et sans jamais rien signaler à personne au passage',
        'Rien',
        'Autre chose',
      ],
      correct: 0,
      explain: 'Question injectée par une épreuve de mutation : elle ne doit jamais rester dans le dépôt.',
    });
  }
  return out;
}
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
   Les quatre options sont de longueur EXACTEMENT egale, portent le meme nombre de
   virgules et le meme vocabulaire : SEULE la bonne reponse glisse une incise entre
   parentheses. Le verdict attendu doit donc nommer la PARENTHESE, pas la
   longueur -- c'est ce que le motif de la mutation controle.

   ⚠️ CORRIGE le 2026-09-06, et le defaut valait la peine d'etre trouve : les
   quatre options faisaient 89, 89, 90 et 93 caracteres, la BONNE etant la plus
   longue des quatre -- parce que l'incise « (avant l ecriture) » qu'on lui ajoutait
   l'allongeait. Ce cas ne prouvait donc PAS la branche « parenthese » : il
   prouvait la branche « longueur », deja couverte par le premier cas, et le
   verdict nommait « la plus longue » a 61,3 %. Une epreuve par injection qui
   croit prouver une branche et en prouve une autre laisse cette branche sans
   preuve -- exactement le trou qu'elle etait censee fermer. Les quatre options
   font desormais 93 caracteres chacune, et l'incise est le seul ecart. */
function questionsParenthesees(n) {
  var out = [];
  for (var i = 0; i < n; i++) {
    out.push({
      q: 'Question parenthesee n° ' + (i + 1) + ' — quel enonce decrit le comportement ?',
      a: [
        'Le compteur est remis a zero juste avant la lecture, si bien que la valeur affichee est nulle',
        'Le compteur est remis a zero peu apres la lecture, si bien que la valeur affichee est doublee',
        'Le compteur est recopie avant la lecture, si bien que la valeur affichee provient de la copie',
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
   Les quatre options sont ici de longueur EXACTEMENT egale, de meme vocabulaire,
   de meme mot d'attaque et de meme ponctuation interne : SEULE la bonne reponse
   n'a pas de point final. Le verdict attendu doit nommer la PONCTUATION FINALE.

   ⚠️ CORRIGE le 2026-09-06, meme defaut que ci-dessus et plus sournois : les
   quatre options faisaient 78, 78, 83 et 81 caracteres, la bonne etant la
   DEUXIEME plus longue des quatre -- dans les 60 questions injectees. Le verdict
   tombait donc sur « ecarter les deux extremes » a 63,1 %, pas sur la ponctuation
   finale. Le defaut est reste invisible tant que les strategies de RANG n'ont pas
   ete inscrites dans EXPLOITABLES : jusque-la, aucun outil ne pouvait dire que la
   fixture etait devinable a sa taille. Les quatre options font desormais 83
   caracteres chacune. */
function questionsPointees(n) {
  var out = [];
  for (var i = 0; i < n; i++) {
    out.push({
      q: 'Question pointee n° ' + (i + 1) + ' — quel enonce decrit le comportement ?',
      a: [
        'Le tampon est vide bien avant la lecture, si bien que la valeur rendue reste nulle.',
        'Le tampon est vide apres la lecture, si bien que la valeur rendue est bien doublee.',
        'Le tampon est copie un peu avant la lecture, si bien que la valeur rendue est vide.',
        'Le tampon est lu avant la remise a zero, si bien que la valeur rendue demeure juste',
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
  /* ⚠️ RECALIBRÉ le 2026-09-06, et c'est une leçon sur les épreuves par injection :
     ce cas injectait SIX questions au rang 1 parce que `doc` en comptait alors 39 sur
     64 (60,9 %) et qu'il suffisait d'un souffle pour l'aggraver. B4 a ramené le cours
     à 16/16/16/16 — et six questions ne le sortent plus de la tolérance : le cas est
     passé AVEUGLE sans que rien ne change dans le cliquet. Une mutation calibrée sur
     l'état tordu d'un cours cesse de prouver dès que le cours est réparé. Calculé
     sur l'état réparé : il faut n tel que (16+n)/(64+n) dépasse la tolérance, soit
     n ≈ 14 ; on en injecte 20 pour que le cas prouve au lieu de frôler. */
  ['20 questions AU RANG 1 ajoutées à doc, le biais que ce cours avait',
    function () { fs.writeFileSync(PAGE, pageAvec(questionsRang1(20))); },
    1, /regression/],

  ['60 questions devinables, et doc marqué « traité »',
    function () {
      fs.writeFileSync(PAGE, pageAvec(questionsBiaisees(60)));
      fs.writeFileSync(REF, refAvec(function (j) { j.cours.doc.traite = true; }));
    },
    1, /cible perdue/],

  /* ⚠️ LE TÉMOIN N'EST PLUS ÉCRIT EN DUR, ET C'EST LA LEÇON DE CE CAS.
     Ce cas a employé `zig`, puis `stats` : à chaque fois, le cours-témoin a fini par
     être détordu par le chantier B4, et l'épreuve est passée VERTE EN SILENCE — elle
     ne prouvait plus rien alors qu'elle disait « vu ». Une épreuve calibrée sur l'état
     tordu d'un cours se périme EN ÉTANT RÉUSSIE. Le témoin est donc choisi À CHAQUE
     EXÉCUTION : le cours non traité dont le pire indice est le plus élevé. S'il n'en
     reste aucun au-dessus de la cible, le cas ne se tait pas — il s'ARRÊTE en code 2,
     parce que c'est alors l'épreuve qu'il faut repenser, pas le site. */
  (function () {
    var j = JSON.parse(refOrig);
    var cible = (j.cible && j.cible.exploitable) || 0.60;
    var noms = Object.keys(j.cours).filter(function (c) {
      return !j.cours[c].traite && j.cours[c].pire > cible;
    }).sort(function (a, b) { return j.cours[b].pire - j.cours[a].pire; });
    if (!noms.length) {
      console.log('AUCUN cours-témoin disponible : plus un seul cours non traité au-dessus de');
      console.log('la cible de ' + Math.round(cible * 100) + ' %. Le cas « cours neuf non conforme » ne peut plus être');
      console.log('prouvé par un cours réel — fabriquer un cours-témoin synthétique dans la référence.');
      process.exit(2);
    }
    var temoin = noms[0];
    return [
      temoin + ' (' + (j.cours[temoin].pire * 100).toFixed(1).replace('.', ',') +
        ' % de biais, le plus tordu des non traités) retiré de la référence : il redevient un « cours neuf »',
      function () { fs.writeFileSync(REF, refAvec(function (r) { delete r.cours[temoin]; })); },
      1, /cours neuf non conforme/];
  }()),

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
      /* Un cas raté qui ne dit pas CE QUE le cliquet a repondu oblige a rejouer
         l'injection a la main pour comprendre. On recopie donc le verdict rendu :
         c'est la seule information qui permette d'agir (ajoute le 2026-09-06,
         apres avoir passe une demi-heure a deviner pourquoi trois cas rataient). */
      r.sortie.split('\n').filter(function (l) { return /^\s{2,}\d+\.\s\[|^\s{4,}\S/.test(l) && !/^\s+->/.test(l); })
        .slice(0, 10).forEach(function (l) { console.log('         | ' + l.trim()); });
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
