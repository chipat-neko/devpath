'use strict';
/**
 * tools/verif-chaine-mutations.js — LE VÉRIFICATEUR DES VÉRIFICATEURS.
 *
 * POURQUOI CE FICHIER EXISTE. `node tools/verif.js` rend « tout est vert ». C'est
 * exactement ce qu'il rendait du 26 août au 2 septembre 2026, pendant que les deux
 * moteurs embarqués ne démarraient plus chez l'apprenant (point F2 du chantier V14).
 * Un contrôle qui ne voit rien est vert pour rien : sa couleur ne dit pas que le site
 * va bien, elle dit qu'il n'a rien regardé. Le seul moyen de savoir ce qu'une chaîne
 * de contrôle voit VRAIMENT, c'est de casser le site exprès et d'exiger qu'elle rougisse.
 *
 * CE QUE FAIT CE SCRIPT, pour chaque mutation du tableau ci-dessous :
 *   1. il lit le fichier cible et garde ses octets EN MÉMOIRE ;
 *   2. il y injecte une faute d'une seule ligne (une valeur fausse, un fichier absent,
 *      une chaîne de moteur vidée…) ;
 *   3. il lance le vérificateur censé la voir, et EXIGE un code de sortie non nul ;
 *   4. il restaure les octets d'origine — quoi qu'il arrive, y compris en cas
 *      d'interruption (SIGINT) ou d'exception.
 * À la fin, il exige que `git status --porcelain` soit VIDE : une mutation mal
 * restaurée serait pire que pas de mutation du tout.
 *
 *   node tools/verif-chaine-mutations.js              → toutes les mutations
 *   node tools/verif-chaine-mutations.js --rapide     → saute celles qui pilotent Chrome
 *   node tools/verif-chaine-mutations.js --seule=<id> → une seule
 *
 * Code de sortie 1 si une mutation passe INAPERÇUE, ou si l'arbre de travail n'est pas
 * rendu propre. Un « survivant » n'est pas un détail : c'est un angle mort mesuré.
 */
var fs = require('fs');
var path = require('path');
var cp = require('child_process');

var RACINE = path.resolve(__dirname, '..');
var RAPIDE = process.argv.indexOf('--rapide') !== -1;
var SEULE = (process.argv.find(function (a) { return a.indexOf('--seule=') === 0; }) || '').slice(8);

/* ---------------------------------------------------------------------------
   LES MUTATIONS. `avant` doit apparaître EXACTEMENT UNE FOIS dans le fichier :
   un motif présent deux fois muterait deux endroits pour des raisons différentes,
   ce que la règle du chantier interdit. Le script le vérifie avant d'écrire.
   --------------------------------------------------------------------------- */
var MUTATIONS = [
  {
    id: 'source',
    quoi: 'un « < » non échappé dans un bloc de code (la famille de bugs qui casse une page)',
    fichier: 'pages/js/lecon-02.html',
    avant: 'typeof 42);',
    apres: 'typeof <b>42);',
    outil: 'verif-html.js', args: [],
  },
  {
    id: 'donnees',
    quoi: "une leçon déclarée dans data.js mais absente du disque",
    fichier: 'js/data.js',
    avant: 'title: "Qu\'est-ce que le Machine Learning ?", file: "lecon-01.html"',
    apres: 'title: "Qu\'est-ce que le Machine Learning ?", file: "lecon-97.html"',
    outil: 'verif-donnees.js', args: [],
  },
  {
    id: 'exemple',
    quoi: "une sortie annoncée en commentaire qui ne correspond plus à ce que le code produit",
    fichier: 'pages/js/lecon-02.html',
    /* ⚠️ l'ancre porte le CODE AUTOUR, et pas seulement l'annonce. Un premier jet visait
       « //=&gt; "number" » : ce texte n'existe QUE dans un <code> en ligne d'un tableau
       récapitulatif — dans le vrai bloc exécutable, le « > » n'a pas besoin d'être
       échappé et s'écrit « //=> ». La mutation tombait donc à côté du seul endroit que
       verif-exemples.js regarde, et le faisait passer pour aveugle. */
    avant: 'typeof 42);         //=> "number"',
    apres: 'typeof 42);         //=> "string"',
    /* `crlf` : la page est aussi convertie en fins de ligne Windows — voir plus bas.
       C'est la SEULE forme sous laquelle cette mutation survivait, et elle survivait
       silencieusement : « . » ne matche pas « \r » en JavaScript, donc l'annonce
       « //=> "string"\r » n'était pas repérée du tout. */
    crlf: true,
    outil: 'verif-exemples.js', args: [], chrome: true,
  },
  {
    id: 'requete',
    quoi: "le tableau attendu d'un exercice SQL, faussé d'une valeur",
    fichier: 'pages/sql/lecon-02.html',
    avant: '[["Trousse",10]',
    apres: '[["Trousse",11]',
    outil: 'verif-sql-exos.js', args: [],
  },
  {
    id: 'python',
    quoi: "le run.expect d'un exercice Python, faussé d'un caractère",
    fichier: 'pages/python/lecon-08.html',
    avant: '"run":{"expect":"a:2 | b:3 | c:2"}',
    apres: '"run":{"expect":"a:2 | b:3 | c:9"}',
    outil: 'verif-python-exos.js', args: [],
  },
  {
    id: 'erreurs',
    quoi: "un message du décodeur qui n'est plus celui que le moteur écrit",
    fichier: 'js/erreurs-data.js',
    avant: 'message: "ReferenceError: totl is not defined"',
    apres: 'message: "ReferenceError: totl is not definedd"',
    outil: 'verif-erreurs.js', args: [],
  },
  {
    id: 'moteurs',
    quoi: "le code d'un moteur qui dérive de sa copie en chaîne pour le Worker",
    fichier: 'assets/vendor/pyodide/pyodide-charge.js',
    avant: '\n', apres: '\n/* mutation */\n', premiere: true,
    outil: 'build-sources-worker.js', args: [],
  },
  /* LES DEUX QUI COMPTENT LE PLUS : elles rejouent la panne de F2 — le moteur ne
     démarre plus chez l'apprenant, et rien d'autre dans le dépôt n'a bougé. */
  {
    id: 'sql-lec',
    quoi: "SQLite ne démarre plus : la page envoie au Worker une chaîne de moteur VIDE",
    fichier: 'js/runner.js',
    avant: 'src: window.SQLJS_SRC });',
    apres: 'src: "" });',
    outil: 'preuves/sql-lecon.js', args: [], chrome: true,
  },
  {
    id: 'py-lec',
    quoi: "CPython ne démarre plus : la page envoie au Worker une chaîne de moteur VIDE",
    fichier: 'js/runner.js',
    avant: 'asm: window.PYODIDE_ASM_SRC,',
    apres: 'asm: "",',
    outil: 'preuves/python-lecon.js', args: [], chrome: true,
  },
];

/* --------------------------------------------------------------------------- */
var enCours = null; /* { chemin, octets } — restauré même sur interruption. */
function restaurer() {
  if (enCours) { fs.writeFileSync(enCours.chemin, enCours.octets); enCours = null; }
}
process.on('SIGINT', function () { restaurer(); process.exit(130); });
process.on('uncaughtException', function (e) { restaurer(); throw e; });

/* `-uno` : on ignore les fichiers NON SUIVIS. Toutes les mutations modifient un fichier
   déjà versionné et aucune n'en crée ; exiger zéro fichier non suivi rendrait l'outil
   inutilisable dès qu'un brouillon traîne à côté, sans rien prouver de plus. */
function propre() {
  /* ⚠️ on ne coupe QUE la fin : une ligne de `--porcelain` commence par deux caractères
     d'état, et le premier est souvent une ESPACE (« M fichier »). Un .trim() la mangeait
     et décalait tous les chemins d'un caractère. */
  return cp.execSync('git status --porcelain -uno', { cwd: RACINE }).toString().replace(/[\r\n]+$/, '');
}

/* On ne demande PAS un arbre vierge : le journal de l'autonomie (ETAT-AUTONOMIE.md)
   est réécrit à chaque réveil, et un plan de chantier en cours d'édition l'est aussi.
   Ce qu'il faut prouver est plus précis, et plus fort : l'état de l'arbre APRÈS doit
   être IDENTIQUE à l'état d'AVANT. Aucune mutation n'a donc laissé de trace, et aucun
   fichier déjà modifié n'a été écrasé — le script refuse d'ailleurs de muter un fichier
   qui figure déjà dans cet état de départ. */
var AVANT = propre();
var DEJA_MODIFIES = AVANT.split('\n').map(function (l) { return l.slice(3).trim().replace(/\\/g, '/'); });
if (AVANT) console.log('(arbre déjà modifié avant la mesure : ' + DEJA_MODIFIES.join(', ') + ' — laissé tel quel)\n');

var choisies = MUTATIONS.filter(function (m) {
  if (SEULE) return m.id === SEULE;
  return !(RAPIDE && m.chrome);
});

console.log('verif-chaine-mutations.js — ' + choisies.length + ' mutation(s)' +
            (RAPIDE ? ' (mode rapide : celles qui pilotent Chrome sont sautées)' : '') + '\n');

var vues = 0, survivantes = [];
choisies.forEach(function (m) {
  if (DEJA_MODIFIES.indexOf(m.fichier) !== -1) {
    survivantes.push(m.id + ' — ' + m.fichier + ' était DÉJÀ modifié : on ne mute pas par-dessus un travail en cours');
    console.log('  ' + pad(m.id) + ' ✗ ' + m.fichier + ' déjà modifié, mutation sautée');
    return;
  }
  var chemin = path.join(RACINE, m.fichier);
  var octets = fs.readFileSync(chemin);
  var txt = octets.toString('utf8');

  var n = txt.split(m.avant).length - 1;
  if (n === 0) {
    survivantes.push(m.id + ' — ANCRE INTROUVABLE dans ' + m.fichier + ' (le site a bougé : mettre la mutation à jour)');
    console.log('  ' + pad(m.id) + ' ✗ ancre introuvable dans ' + m.fichier);
    return;
  }
  if (n > 1 && !m.premiere) {
    survivantes.push(m.id + ' — ancre présente ' + n + ' fois dans ' + m.fichier +
                     " (un motif trop large casse ce qui était juste)");
    console.log('  ' + pad(m.id) + ' ✗ ancre ambiguë (' + n + ' occurrences)');
    return;
  }

  var mute = m.premiere ? txt.replace(m.avant, m.apres) : txt.split(m.avant).join(m.apres);
  /* `crlf` : la page est en plus convertie en fins de ligne Windows. Ce n'est pas un
     détail de forme — c'est ce qui rendait la mutation `exemple` SURVIVANTE (point A8
     du chantier V17). `core.autocrlf` vaut `true` ici : un clone frais met TOUT le
     site en CRLF, mais l'état du disque varie selon les fichiers qu'un `git checkout`
     a retouchés. Sans ce forçage, l'épreuve mesurerait le hasard du disque au lieu de
     la robustesse de l'outil. */
  if (m.crlf) mute = mute.replace(/\r\n/g, '\n').replace(/\n/g, '\r\n');
  enCours = { chemin: chemin, octets: octets };
  fs.writeFileSync(chemin, mute);

  var code, t0 = Date.now();
  try {
    cp.execSync('node "' + path.join(RACINE, 'tools', m.outil) + '" ' + m.args.join(' '),
                { cwd: RACINE, stdio: 'pipe', maxBuffer: 64 * 1024 * 1024 });
    code = 0;
  } catch (e) {
    code = e.status === undefined ? -1 : e.status;
  }
  restaurer();

  var s = ((Date.now() - t0) / 1000).toFixed(1);
  if (code !== 0) {
    vues++;
    console.log('  ' + pad(m.id) + ' VUE   (code ' + code + ', ' + s + ' s) — ' + m.quoi);
  } else {
    survivantes.push(m.id + ' — ' + m.outil + ' est resté VERT sur : ' + m.quoi);
    console.log('  ' + pad(m.id) + ' ⚠ SURVIVANTE (' + s + ' s) — ' + m.outil + " n'a rien vu : " + m.quoi);
  }
});

function pad(s) { while (s.length < 8) s += ' '; return s; }

console.log('\n--- bilan ---');
console.log('  mutations injectées : ' + choisies.length + '  ·  VUES : ' + vues +
            '  ·  survivantes : ' + survivantes.length);
survivantes.forEach(function (l) { console.log('   ⚠ ' + l); });

var APRES = propre();
if (APRES !== AVANT) {
  console.log("\n⚠⚠ L'ARBRE DE TRAVAIL A CHANGÉ — une mutation n'a pas été restaurée." +
              '\n  avant : ' + (AVANT || '(vierge)') + '\n  après : ' + (APRES || '(vierge)'));
  process.exit(1);
}
console.log('  arbre de travail : identique à avant la mesure (aucune mutation laissée)');
process.exit(survivantes.length ? 1 : 0);
