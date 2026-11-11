'use strict';
/* =============================================================================
   tools/preuves/encarts-decodeur-git-mutations.js — ON CASSE LES ENCARTS EXPRÈS,
   ET ON REGARDE SI LES DEUX PREUVES S'EN APERÇOIVENT (chantier V18, point A2).

   QUOI. Le point D2 du chantier V16 a étendu deux encarts que `js/lecon.js` pose à
   l'exécution : celui qui mène au DÉCODEUR d'erreurs (table `DECODEUR_AUSSI` et
   gabarits recopiés `GABARITS_DECODEUR`), et celui qui mène au BAC À SABLE Git hors
   du cours `git` (tables `BAC_GIT_AILLEURS`, `BAC_GIT_EXECUTE`,
   `BAC_GIT_NE_SIMULE_PAS`). Deux preuves les surveillent :
   `tools/preuves/decodeur-lecons.js` et `tools/preuves/git-graphe.js`. Un vert ne
   vaut que ce que vaut l'œil qui regarde : on injecte donc neuf fautes connues dans
   `js/lecon.js`, on relance la preuve concernée, et elle doit rendre le code 1.

   D'OÙ IL VIENT. Script de travail du V16 (`scratchpad/v16-parallele/d/`, hors du
   dépôt) : 9 fautes sur 9 vues, en 7 min 35 s. Il n'était lancé par rien. Il entre
   ici dans `verif.js --mutations`, avec trois durcissements :

   1. UNE FAUTE N'EST « VUE » QUE SI LA PREUVE LA NOMME. Le code 1 ne suffit pas :
      `git-graphe.js` commence par piloter la page du bac à sable, et son premier
      chargement échoue parfois tout seul (intermittent connu, point A5 du V18). Ce
      jour-là il sort en 1 AVANT d'avoir lu les tables — et l'ancien script comptait
      la faute comme vue. Chaque faute porte donc le message que la preuve doit
      imprimer (`attendu`). Code 1 sans ce message = « rouge pour une autre
      raison » : on relance (5 tentatives au plus, chacune imprimée), puis la faute
      compte comme NON vue. Les témoins ont la même relance. Et chaque message
      attendu doit être ABSENT de la sortie du témoin : sinon il ne prouverait rien.
      Une faute peut aussi porter un message `interdit`, qui annule le verdict s'il
      est imprimé : c'est le cas de la faute 4, parce que `decodeur-lecons.js` écrit
      « AUCUN encart du décodeur — page jamais prête en 15 s » pour une page LENTE,
      sans aucune faute (vu sous charge, le 2026-11-11, sur un témoin).
      Pourquoi 5 : mesuré le 2026-11-11, machine chargée par cinq autres agents,
      l'intermittent a frappé 1 premier lancement sur 2 au premier passage, et 2 de
      suite au deuxième (vert au 3e) ; un essai raté coûte 2 à 10 s. Relancer ne
      peut pas faire passer une faute pour vue : seul son message le peut.
   2. LES MOTIFS TIENNENT AUX FINS DE LIGNE. Au F1 du V16, deux fautes de
      `execution-ancres-mutations.js` ne se posaient plus parce que le fichier visé
      était passé en CRLF, et un clone frais avec `core.autocrlf=true` met tout le
      site en CRLF. Le motif est donc cherché quelles que soient les fins de ligne
      (parade `motifSouple`, celle de `verif-execution-mutations.js`), le
      remplacement prend les fins de ligne du fichier, et AVANT tout lancement
      chaque faute est posée à sec sur une version LF ET sur une version CRLF du
      fichier : elle doit s'y poser exactement une fois, sans mélanger les fins de
      ligne. Une faute qui ne se pose pas partout est NON APPLICABLE.
   3. LA RESTAURATION SE FAIT À L'OCTET : on garde les octets lus, pas une chaîne
      réencodée, sur exit, SIGINT, SIGTERM, SIGHUP, SIGBREAK et exception ; et on
      vérifie l'égalité des octets après chaque faute et à la fin.

   USAGE
     node tools/preuves/encarts-decodeur-git-mutations.js            # l'épreuve
     node tools/preuves/encarts-decodeur-git-mutations.js --a-sec    # pose à sec
                     (LF et CRLF), sans Chrome, sans rien écrire ; quelques ms
     node tools/preuves/encarts-decodeur-git-mutations.js --seules=6,9
                     # ne jouer que ces fautes (les témoins tournent toujours)
     node tools/preuves/encarts-decodeur-git-mutations.js --controle --seules=10,11,12,13
                     # l'épreuve de l'épreuve : quatre fautes sentinelles — invisible
                     # par construction (un mot de commentaire), au motif absent,
                     # rouge pour une autre raison que la faute posée, et bien nommée
                     # mais accompagnée d'un message interdit. Elle DOIT rendre le
                     # code 1.

   CODES DE SORTIE : 0 toutes les fautes vues ; 1 une faute passée inaperçue, rouge
   pour une autre raison, non applicable, ou un fichier mal restauré ; 2 rien n'a pu
   être mesuré (un témoin n'est pas vert sans mutation, ou erreur technique).
   ============================================================================= */
var fs = require('fs'), path = require('path'), cp = require('child_process');

var R = path.resolve(__dirname, '..', '..');
var CIBLE = path.join(R, 'js', 'lecon.js');
var REL_CIBLE = 'js/lecon.js';
var DEC = 'tools/preuves/decodeur-lecons.js', GIT = 'tools/preuves/git-graphe.js';
var TENTATIVES = 5;

var MUTATIONS = [
  { outil: DEC, nom: 'un gabarit recopié ne correspond plus au fichier de données',
    de: '"js-tdz": "ReferenceError: Cannot access \'…\' before initialization",',
    vers: '"js-tdz": "ReferenceError: Cannot access \'…\' before init",',
    attendu: /gabarit recopié faux pour « js-tdz »/ },
  { outil: DEC, nom: 'la table cite une erreur que le décodeur ne connaît pas',
    de: '"js/lecon-30": ["js-undefined-prop"],',
    vers: '"js/lecon-30": ["js-inexistante"],',
    attendu: /js\/lecon-30 : « js-inexistante » n'est pas une erreur du décodeur/ },
  { outil: DEC, nom: 'une leçon déjà dans l\'index est ajoutée à la table',
    de: '"algo/lecon-08": ["js-undefined-prop"],',
    vers: '"algo/lecon-08": ["js-undefined-prop"],\n    "bash/lecon-01": ["sh-command-not-found"],',
    attendu: /bash\/lecon-01 : déjà dans l'index du décodeur/ },
  /* « AUCUN encart du décodeur » ne suffit pas : sous charge, la preuve l'écrit aussi pour une
     page qui n'a pas fini de charger (« — page jamais prête en 15 s »), sans aucune faute. La
     signature de cette faute-ci est que TOUTES les leçons de la table perdent leur encart. */
  { outil: DEC, nom: 'la table n\'est plus jamais consultée',
    de: 'var ids = DECODEUR_AUSSI[cle.replace(/\\.html$/, "")];',
    vers: 'var ids = null;',
    attendu: /leçons hors index \(table D2\)\s*: 0 \/ [1-9]/,
    interdit: /page jamais prête/ },
  { outil: DEC, nom: 'un seul gabarit affiché, quel que soit le nombre annoncé',
    de: 'liste = ids ? ids.map(',
    vers: 'liste = ids ? ids.slice(0, 1).map(',
    attendu: /doc\/lecon-02 \(hors index\) : l'encart liste/ },
  { outil: GIT, nom: 'l\'encart dit que le bac à sable ne simule pas une commande qu\'il exécute (commit)',
    de: 'var BAC_GIT_NE_SIMULE_PAS = ["push", "pull", "clone", "blame", "bisect"];',
    vers: 'var BAC_GIT_NE_SIMULE_PAS = ["push", "pull", "clone", "blame", "bisect", "commit"];',
    attendu: /« git commit » n'existe pas dans le bac a sable : elle y existe/ },
  { outil: GIT, nom: 'l\'encart dit que le bac à sable exécute une commande qu\'il ne connaît pas (push)',
    de: 'var BAC_GIT_EXECUTE = ["add",',
    vers: 'var BAC_GIT_EXECUTE = ["push", "add",',
    attendu: /execute « git push » : il ne la connait pas/ },
  { outil: GIT, nom: 'la table hors du cours n\'est plus consultée',
    de: 'var ailleurs = cours !== "git" && BAC_GIT_AILLEURS.indexOf(cours + "/" + lecon) !== -1;',
    vers: 'var ailleurs = false;',
    attendu: /vscode\/lecon-04\.html\s+0 encart\(s\)\s+← 1 encart\(s\) attendu\(s\), 0 trouve\(s\)/ },
  { outil: GIT, nom: 'la table cite une leçon qui n\'existe pas',
    de: 'var BAC_GIT_AILLEURS = ["vscode/lecon-04", "equipe/lecon-07"];',
    vers: 'var BAC_GIT_AILLEURS = ["vscode/lecon-04", "equipe/lecon-07", "equipe/lecon-99"];',
    attendu: /equipe\/lecon-99 : la lecon n'existe pas sur le disque/ }
];

/* L'épreuve de l'épreuve (`--controle`). Quatre fautes que l'épreuve DOIT compter
   contre elle : un mot changé dans un commentaire, qu'aucune des deux preuves ne
   lit (elle doit la voir « passée inaperçue ») ; un motif qui n'existe pas (elle
   doit la dire « non applicable ») ; une preuve qui rougit pour une autre faute que
   celle qu'on attend, et une preuve qui nomme la bonne faute mais imprime aussi un
   message `interdit` (dans les deux cas : relancer, puis la dire « non vue »). Si
   l'épreuve rendait 0 avec elles, son vert ne prouverait rien. */
var SENTINELLES = [
  { outil: DEC, nom: 'SENTINELLE : un mot de commentaire changé, invisible par construction',
    de: '⚠️ JSON strict dans les deux tables',
    vers: '⚠️ JSON strict dans ces deux tables',
    attendu: /SENTINELLE INVISIBLE/ },
  { outil: DEC, nom: 'SENTINELLE : un motif absent du fichier',
    de: 'var CE_MOTIF_N_EXISTE_PAS_DANS_LECON_JS = [];',
    vers: 'var CE_MOTIF_N_EXISTE_PAS_DANS_LECON_JS = [1];',
    attendu: /SENTINELLE ABSENTE/ },
  /* La preuve rougit (code 1) pour une VRAIE faute — l'identifiant inconnu de la faute 2 —
     mais le message attendu en nomme une autre : c'est la forme exacte d'un rouge venu de
     l'intermittent de `git-graphe.js`. Elle doit être relancée, puis comptée NON vue. */
  { outil: DEC, nom: 'SENTINELLE : la preuve rougit, mais pas pour la faute posée',
    de: '"js/lecon-30": ["js-undefined-prop"],',
    vers: '"js/lecon-30": ["js-inexistante"],',
    attendu: /gabarit recopié faux pour « js-tdz »/ },
  /* La preuve rougit pour la BONNE faute et la nomme, mais sa sortie porte aussi un message
     `interdit` (ici une ligne qu'elle imprime toujours) : le champ doit l'emporter. */
  { outil: DEC, nom: 'SENTINELLE : la bonne faute est nommée, mais un message interdit l\'accompagne',
    de: '"js/lecon-30": ["js-undefined-prop"],',
    vers: '"js/lecon-30": ["js-inexistante"],',
    attendu: /js\/lecon-30 : « js-inexistante » n'est pas une erreur du décodeur/,
    interdit: /--- bilan ---/ }
];

var args = process.argv.slice(2);
function drapeau(nom) { return args.indexOf('--' + nom) !== -1; }
function valeur(nom) {
  var a = args.filter(function (x) { return x.indexOf('--' + nom + '=') === 0; })[0];
  return a ? a.slice(nom.length + 3) : '';
}
if (drapeau('controle')) MUTATIONS = MUTATIONS.concat(SENTINELLES);
MUTATIONS.forEach(function (m, i) { m.num = i + 1; });
var N = MUTATIONS.length;
var choix = valeur('seules');
if (choix) {
  var nums = choix.split(',').map(function (x) { return Number(x.trim()); });
  var inconnus = nums.filter(function (n) { return !(n >= 1 && n <= N); });
  if (inconnus.length) {
    console.log('--seules : numéro(s) inconnu(s) ' + inconnus.join(', ') + ' (fautes numérotées de 1 à ' + N + ')');
    process.exit(2);
  }
  MUTATIONS = MUTATIONS.filter(function (m) { return nums.indexOf(m.num) !== -1; });
}

/* ------------------------------------------------ lecture, et restauration à l'octet */
var OCTETS = fs.readFileSync(CIBLE);
var original = OCTETS.toString('utf8');
function intact() { try { return Buffer.compare(fs.readFileSync(CIBLE), OCTETS) === 0; } catch (e) { return false; } }
function restaurer() {
  try { if (!intact()) fs.writeFileSync(CIBLE, OCTETS); } catch (e) { /* rien de plus à tenter */ }
}
process.on('exit', restaurer);
['SIGINT', 'SIGTERM', 'SIGHUP', 'SIGBREAK'].forEach(function (s) {
  try { process.on(s, function () { restaurer(); process.exit(2); }); } catch (e) { /* signal inconnu ici */ }
});
process.on('uncaughtException', function (e) {
  restaurer();
  console.log('ÉCHEC TECHNIQUE : ' + (e && e.stack ? e.stack : e));
  process.exit(2);
});

/* ------------------------------------------------ les motifs, quelles que soient les fins de ligne */
function echapper(t) { return t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }
function motifSouple(texte, global) {
  return new RegExp(echapper(texte).replace(/\r?\n/g, '\\r?\\n'), global ? 'g' : '');
}
function finDeLigne(texte) { return /\r\n/.test(texte) ? '\r\n' : '\n'; }
/* La remplaçante prend les fins de ligne du texte visé, et passe par une FONCTION :
   une chaîne de remplacement interpréterait `$&` ou `$1` s'il s'en trouvait. */
function appliquer(texte, m) {
  var vers = m.vers.replace(/\r?\n/g, finDeLigne(texte));
  return texte.replace(motifSouple(m.de), function () { return vers; });
}
/* Pose à sec sur un texte : exactement une occurrence, un texte changé qui contient
   la remplaçante, et des fins de ligne non mélangées. Rend '' si tout va, sinon la
   raison. */
function poseASec(texte, m) {
  var n = (texte.match(motifSouple(m.de, true)) || []).length;
  if (n !== 1) return n === 0 ? 'motif absent' : n + ' occurrences du motif (il en faut une)';
  var mute = appliquer(texte, m);
  if (mute === texte) return 'la faute ne change rien';
  var nl = finDeLigne(texte);
  if (mute.indexOf(m.vers.replace(/\r?\n/g, nl)) === -1) return 'la remplaçante n\'est pas dans le texte muté';
  if (nl === '\r\n' ? /[^\r]\n/.test(mute) : /\r/.test(mute)) return 'fins de ligne mélangées après la faute';
  return '';
}
var LF = original.replace(/\r\n/g, '\n');
var CRLF = LF.replace(/\n/g, '\r\n');
function controleASec(m) {
  var raisons = [];
  [['disque', original], ['LF', LF], ['CRLF', CRLF]].forEach(function (v) {
    var r = poseASec(v[1], m);
    if (r) raisons.push(v[0] + ' : ' + r);
  });
  return raisons;
}

function etiquette(m) { return '[' + m.num + '/' + N + '] ' + m.nom; }

var nbCR = 0;
for (var o = 0; o < OCTETS.length; o++) if (OCTETS[o] === 13) nbCR++;
console.log('encarts-decodeur-git-mutations.js — ' + MUTATIONS.length + ' faute(s) dans ' + REL_CIBLE
  + ' (' + OCTETS.length + ' octets, ' + nbCR + ' CR sur le disque)\n');

/* Pose à sec : toujours faite, et seule avec --a-sec. */
var nonApplicables = [];
MUTATIONS.forEach(function (m) {
  m.raisons = controleASec(m);
  if (m.raisons.length) nonApplicables.push(m);
});
console.log('Pose à sec (disque, LF, CRLF) :');
MUTATIONS.forEach(function (m) {
  console.log('  ' + etiquette(m) + ' : ' + (m.raisons.length ? 'NON APPLICABLE — ' + m.raisons.join(' ; ') : 'se pose une fois sur les trois versions'));
});
console.log('');
if (drapeau('a-sec')) {
  console.log('RÉSULTAT À SEC : ' + (MUTATIONS.length - nonApplicables.length) + '/' + MUTATIONS.length + ' fautes posables sur LF et CRLF');
  process.exit(nonApplicables.length ? 1 : 0);
}

/* ------------------------------------------------ lancer une preuve */
function lancer(outil) {
  var t0 = Date.now();
  var r = cp.spawnSync(process.execPath, [path.join(R, outil)], {
    cwd: R, encoding: 'utf8', timeout: 600000, maxBuffer: 16 * 1024 * 1024
  });
  return {
    code: r.status, duree: (Date.now() - t0) / 1000,
    expire: !!(r.error && r.error.code === 'ETIMEDOUT'),
    sortie: String(r.stdout || '') + String(r.stderr || '')
  };
}
function queue(sortie, n) { return sortie.trim().split('\n').slice(-n).map(function (l) { return '      | ' + l; }).join('\n'); }
function s(x) { return x.toFixed(1).replace('.', ','); }

var t0Total = Date.now();

/* ------------------------------------------------ témoins : chaque preuve est verte sans mutation */
var outils = [];
MUTATIONS.forEach(function (m) { if (outils.indexOf(m.outil) === -1) outils.push(m.outil); });
var sortieTemoin = {};
for (var t = 0; t < outils.length; t++) {
  var ot = outils[t], b = null;
  for (var essai = 1; essai <= TENTATIVES; essai++) {
    b = lancer(ot);
    console.log('[témoin] ' + ot + ' sans mutation : code ' + b.code + (b.expire ? ' (EXPIRÉ)' : '') + ' en ' + s(b.duree) + ' s'
      + (TENTATIVES > 1 ? ' (tentative ' + essai + '/' + TENTATIVES + ')' : ''));
    if (b.code === 0) break;
    console.log(queue(b.sortie, 12));
  }
  if (b.code !== 0) {
    console.log('\nRÉSULTAT : RIEN DE MESURÉ — ' + ot + ' n\'est pas vert sans mutation après ' + TENTATIVES + ' tentatives.');
    restaurer();
    process.exit(2);
  }
  sortieTemoin[ot] = b.sortie;
}
/* Un message attendu qui figurerait déjà dans la sortie du témoin ne prouverait rien. */
MUTATIONS.forEach(function (m) {
  if (!m.raisons.length && m.attendu.test(sortieTemoin[m.outil])) {
    m.raisons.push('le message attendu figure déjà dans la sortie du témoin');
    nonApplicables.push(m);
  }
});
if (!intact()) { restaurer(); console.log('\nRÉSULTAT : ' + REL_CIBLE + ' a changé pendant les témoins — arrêt.'); process.exit(2); }
console.log('');

/* ------------------------------------------------ les fautes, une à une */
var vues = 0, ratees = [], malRestaure = false;
MUTATIONS.forEach(function (m) {
  if (m.raisons.length) {
    console.log(etiquette(m) + ' : NON APPLICABLE — ' + m.raisons.join(' ; '));
    return;
  }
  var verdict = null, r = null, causes = {};
  for (var essai = 1; essai <= TENTATIVES && !verdict; essai++) {
    fs.writeFileSync(CIBLE, Buffer.from(appliquer(original, m), 'utf8'));
    r = lancer(m.outil);
    restaurer();
    if (!intact()) { malRestaure = true; console.log('  ⚠ ' + REL_CIBLE + ' N\'EST PAS restauré à l\'octet après la faute ' + m.num); }
    /* `interdit` : un message qui, présent, prouve que la preuve a rougi (aussi) pour une raison
       étrangère à la faute — une page jamais prête, par exemple. Le verdict ne vaut alors rien. */
    var nomme = m.attendu.test(r.sortie) && !(m.interdit && m.interdit.test(r.sortie));
    if (r.code === 1 && nomme) { verdict = 'VUE'; break; }
    if (r.code === 0) { verdict = 'PASSÉE INAPERÇUE (code 0)'; break; }
    var cause = r.expire ? 'EXPIRÉE'
      : r.code !== 1 ? 'code ' + r.code
      : m.attendu.test(r.sortie) ? 'rouge, mais avec un message interdit (' + m.interdit.source + ')'
      : 'rouge pour une autre raison (le message attendu manque)';
    console.log('  ' + etiquette(m) + ' : ' + cause + ' en ' + s(r.duree) + ' s, tentative ' + essai + '/' + TENTATIVES);
    console.log(queue(r.sortie, 8));
    causes[cause] = (causes[cause] || 0) + 1;
    /* Le verdict dit ce qui est ARRIVÉ à chaque tentative, et non la cause de la dernière
       étendue aux autres : un passage du 2026-11-11 a eu quatre rouges pour une autre raison
       et un code 2 (Chrome sans port en 30 s), et l'ancienne phrase disait « à chacune ». */
    if (essai === TENTATIVES) {
      verdict = 'NON VUE après ' + TENTATIVES + ' tentatives — ' + Object.keys(causes).map(function (c) {
        return causes[c] + ' × ' + c;
      }).join(', ');
    }
  }
  if (verdict === 'VUE') { vues++; console.log(etiquette(m) + ' : VUE (' + m.outil.replace('tools/preuves/', '') + ', ' + s(r.duree) + ' s)'); }
  else { ratees.push(m.num + ' (' + verdict + ')'); console.log(etiquette(m) + ' : ' + verdict); }
});

restaurer();
var restaureOk = intact() && !malRestaure;
console.log('');
console.log('=== BILAN ===');
console.log('  fautes injectées ............ ' + MUTATIONS.length);
console.log('  fautes vues ................. ' + vues);
console.log('  non vues .................... ' + ratees.length + (ratees.length ? ' : ' + ratees.join(' | ') : ''));
console.log('  non applicables ............. ' + nonApplicables.length + (nonApplicables.length ? ' : ' + nonApplicables.map(function (m) { return m.num; }).join(', ') : ''));
console.log('  ' + REL_CIBLE + ' restauré à l\'octet : ' + (restaureOk ? 'oui' : 'NON'));
console.log('  durée totale ................ ' + s((Date.now() - t0Total) / 1000) + ' s');
console.log('');
if (ratees.length || nonApplicables.length || !restaureOk) {
  console.log('RÉSULTAT : LES PREUVES ONT DES ANGLES MORTS, OU L\'ÉPREUVE N\'A PAS PU TOUT POSER — ' + vues + '/' + MUTATIONS.length + ' fautes vues');
  process.exit(1);
}
console.log('RÉSULTAT : ' + vues + '/' + MUTATIONS.length + ' FAUTES VUES');
process.exit(0);
