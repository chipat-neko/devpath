'use strict';
/**
 * tools/preuves/rejoue-bash.js — EXÉCUTER les scripts que les leçons Bash affirment.
 *
 * POURQUOI CELUI-CI EST DIFFÉRENT DES AUTRES. Les six rejeux précédents (cpp, rust, java,
 * csharp, c, php, go, elixir) TRANSPOSENT le programme en JavaScript, faute d'avoir le
 * langage sur la machine. Ici, `bash` EST installé (GNU bash 5.3, vérifié) : le script
 * extrait de la leçon est écrit dans un fichier temporaire et RÉELLEMENT EXÉCUTÉ, puis sa
 * sortie est comparée, ligne à ligne, à celle que la leçon annonce. C'est le seul rejeu du
 * chantier qui ne repose sur aucune transposition — donc le seul qui ne puisse pas se
 * tromper de la même façon que le contenu qu'il vérifie.
 *
 * CE QUE LE COURS DONNE, ET CE QU'IL NE DONNE PAS. `pages/bash` compte **212 blocs** ; à la
 * règle stricte (« # Sortie : » en tête de la sortie), **4 seulement** annoncent ce qu'ils
 * produisent, tous dans `lecon-08` (les fonctions), et **0 bloc** emploie la forme
 * « # => ». Le plan annonçait « 65 blocs » : ce chiffre ne se reproduit pas sous la règle
 * du générateur. La raison est celle que le plan pressentait — un cours de shell montre
 * surtout des commandes dont la sortie DÉPEND DE LA MACHINE (`ls`, `df`, `date`, `ps`), et
 * l'on ne peut rien affirmer de fixe à leur sujet. Les 4 blocs retenus, eux, ne touchent ni
 * au disque, ni au réseau, ni à l'horloge : `echo`, arithmétique entière, portée des
 * variables.
 *
 * ⚠️ GARDE-FOU : ON N'EXÉCUTE PAS DU CODE AU HASARD. Deux barrières, dans cet ordre :
 *   1. seuls les blocs DÉSIGNÉS ci-dessous sont exécutés (liste blanche explicite) ;
 *   2. et chacun est refusé s'il contient une commande qui touche au système ou au réseau
 *      (`rm`, `mv`, `cp`, `curl`, `wget`, `sudo`, `chmod`, `dd`, `mkfs`, `>` vers un chemin
 *      absolu…). La deuxième barrière protège de la première : si une leçon change et
 *      qu'un bloc désigné devient dangereux, le rejeu s'arrête au lieu de l'exécuter.
 * Le script tourne dans un répertoire temporaire jetable, sans argument et sans stdin.
 *
 *   node tools/preuves/rejoue-bash.js                  exécute et compare
 *   node tools/preuves/rejoue-bash.js --voir           montre la sortie réelle
 *   node tools/preuves/rejoue-bash.js --fausse=local   contre-épreuve : `local` ignoré
 */
var fs = require('fs'), os = require('os'), path = require('path'), cp = require('child_process');
var RACINE = path.resolve(__dirname, '..', '..');
var VOIR = process.argv.indexOf('--voir') !== -1;
var FAUSSE = (process.argv.filter(function (a) { return a.indexOf('--fausse') === 0; })[0] || '').split('=')[1] || '';
function dec(s) {
  return s.replace(/\r\n?/g, '\n')
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'").replace(/&#x27;/gi, "'").replace(/&amp;/g, '&');
}

/* Les blocs désignés : leçon, motif d'identification, et ce que le bloc enseigne. */
var CIBLES = [
  { lecon: '08', bloc: 'saluer() {', quoi: 'définir puis appeler une fonction' },
  { lecon: '08', bloc: 'additionner_faux() {', quoi: 'return rend un CODE, pas une valeur' },
  { lecon: '08', bloc: 'compteur="global"', quoi: 'la portée : local contre global' },
  { lecon: '08', bloc: 'total=$(somme 12 30)', quoi: 'capturer la sortie d\'une fonction' }
];

/* La deuxième barrière : ce qu'un bloc exécuté ne doit JAMAIS contenir. */
var INTERDIT = /(^|[\s;&|(])(rm|mv|cp|dd|mkfs|chmod|chown|sudo|su|curl|wget|ssh|scp|nc|kill|shutdown|reboot|mount|apt|yum|pip|npm|git)\b|>\s*\/(?!tmp\/)/;

var RE = /<code class="language-bash">([\s\S]*?)<\/code>/g;
var RE_TETE = /^\s*#\s*Sortie\s*:(.*)$/;
var RE_TETE_TEST = /^\s*#\s*Sortie\s*:/m;   /* sans le drapeau `m`, `^` vaut DÉBUT DE CHAÎNE */
var RE_COM = /^\s*#\s?/;

/** Le bloc, et la sortie que la leçon lui prête. */
function extraire(lecon, motif) {
  var t = fs.readFileSync(RACINE + '/pages/bash/lecon-' + lecon + '.html', 'utf8'), m;
  RE.lastIndex = 0;
  while ((m = RE.exec(t))) {
    var code = dec(m[1]);
    if (code.indexOf(motif) < 0) continue;
    if (!RE_TETE_TEST.test(code)) continue;
    var lignes = code.split('\n');
    for (var i = 0; i < lignes.length; i++) {
      var mt = lignes[i].match(RE_TETE);
      if (!mt) continue;
      var attendu = [];
      if (mt[1].trim()) attendu.push(mt[1].trim());
      else for (var j = i + 1; j < lignes.length; j++) {
        if (!RE_COM.test(lignes[j])) { if (!lignes[j].trim()) continue; break; }
        attendu.push(lignes[j].replace(RE_COM, '').replace(/\s+$/, ''));
      }
      /* Le script à exécuter = le bloc SANS sa sortie annoncée (la tête et ce qui suit). */
      return { script: lignes.slice(0, i).join('\n'), attendu: attendu };
    }
  }
  return null;
}

var tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'rejoue-bash-'));
var ok = 0, ko = 0, absent = 0, refuses = 0, lignes = 0;
CIBLES.forEach(function (c) {
  var id = 'lecon-' + c.lecon + ' · ' + c.quoi;
  var e = extraire(c.lecon, c.bloc);
  if (!e) { console.log('✗ ' + id + ' : bloc introuvable (' + c.bloc + ')'); absent++; return; }
  if (INTERDIT.test(e.script)) {
    console.log('⛔ ' + id + ' : le bloc contient une commande qui touche au système — NON EXÉCUTÉ');
    refuses++; return;
  }
  var script = e.script;
  /* Contre-épreuve : on casse la portée de `local`, qui n'est testée que par un bloc. */
  if (FAUSSE === 'local') script = script.replace(/\blocal /g, '');
  var f = path.join(tmp, 'b' + (ok + ko + 1) + '.sh');
  fs.writeFileSync(f, script, 'utf8');
  var reel;
  try {
    reel = cp.execFileSync('bash', [f], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], timeout: 10000 });
  } catch (err) {
    reel = (err.stdout || '') + (err.stderr || '');
  }
  reel = reel.replace(/\r\n?/g, '\n').replace(/\n$/, '');
  var vues = reel === '' ? [] : reel.split('\n');
  if (VOIR) console.log('--- ' + id + '\n' + reel);
  var n = Math.min(e.attendu.length, vues.length), diff = [];
  for (var i = 0; i < n; i++) {
    lignes++;
    if (e.attendu[i].trim() !== vues[i].trim()) {
      diff.push('    ligne ' + (i + 1) + ' : annoncé ' + JSON.stringify(e.attendu[i].trim()) +
        '  ≠  EXÉCUTÉ ' + JSON.stringify(vues[i].trim()));
    }
  }
  if (e.attendu.length !== vues.length) diff.push('    comptes de lignes : annoncé ' + e.attendu.length +
    ', exécuté ' + vues.length + '\n      annoncé : ' + JSON.stringify(e.attendu) + '\n      exécuté : ' + JSON.stringify(vues));
  if (diff.length) { console.log('✗ ' + id); diff.forEach(function (d) { console.log(d); }); ko++; }
  else { console.log('✓ ' + id + ' — ' + n + ' ligne(s) : ' + JSON.stringify(e.attendu)); ok++; }
});
try { fs.rmSync(tmp, { recursive: true, force: true }); } catch (e) { /* rien */ }
console.log('\n' + ok + ' script(s) conforme(s), ' + ko + ' divergent(s), ' + absent + ' non trouvé(s), ' +
  refuses + ' refusé(s) par le garde-fou — ' + lignes + ' lignes de sortie comparées, RÉELLEMENT EXÉCUTÉES.' +
  (FAUSSE ? '\n(contre-épreuve « ' + FAUSSE + ' » : une règle a été faussée exprès — des divergences sont ATTENDUES)' : ''));
process.exit(ko || absent ? 1 : 0);
