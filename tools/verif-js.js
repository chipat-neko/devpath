'use strict';
/**
 * tools/verif-js.js — Exécuter POUR DE VRAI les blocs JavaScript du site.
 *
 * POURQUOI CE SCRIPT EXISTE
 * -------------------------
 * `js/runner.js` pose un bouton « Tester » sur les blocs `language-javascript` qui ne
 * touchent ni au navigateur ni à Node (règle `BROWSER_ONLY`). Un bouton qui rend une
 * erreur est pire qu'une absence de bouton : le panneau PROMET un résultat avant le clic.
 * Le pendant SQL de ce contrôle existe depuis le 2026-08-26 (`verif-sql.js`) et a fait
 * tomber 124 blocs morts à 4 ; côté JavaScript, personne n'avait jamais exécuté quoi que
 * ce soit. L'audit du chantier V17 (point B2) annonçait 451 blocs en erreur sur 2 011 —
 * un chiffre obtenu une fois, à la main, par un outil qui n'a pas été conservé.
 *
 * CE QU'IL REPRODUIT, ET COMMENT IL ÉVITE DE DIVERGER
 * ---------------------------------------------------
 * Le navigateur exécute `(0, eval)(code)` dans un Worker, avec `console.log` détourné.
 * On fait la même chose dans un contexte `vm` de Node, et surtout : la règle qui décide
 * QUELS blocs reçoivent un bouton (`BROWSER_ONLY`) est **lue dans `js/runner.js`**, jamais
 * recopiée — même discipline que `verif-sql.js` pour `AUTRE_SGBD`. Deux exemplaires d'une
 * même règle finissent toujours par diverger, et ce vérificateur mesurerait alors autre
 * chose que ce que voit l'apprenant.
 *
 * ⚠️ CE QU'IL NE PEUT PAS REPRODUIRE. Un Worker de navigateur n'est pas Node : `setTimeout`
 * y existe, mais pas `require`, et les globales diffèrent. Les écarts connus sont neutralisés
 * (voir CONTEXTE ci-dessous). Un bloc qui n'échoue QUE dans Node serait un faux positif : le
 * mode `--erreurs` affiche donc toujours le message, pour qu'il soit jugeable à l'œil.
 *
 *   node tools/verif-js.js                  # tous les blocs JS du site
 *   node tools/verif-js.js pages/nodejs     # un dossier ou un fichier
 *   node tools/verif-js.js --erreurs        # ne lister que les blocs en échec
 *   node tools/verif-js.js --causes         # le détail des messages, groupés
 *   node tools/verif-js.js --fixer          # redescendre la référence du cliquet
 * Code de sortie : 1 si le nombre de blocs en erreur DÉPASSE la référence du cliquet.
 */
var fs = require('fs');
var path = require('path');
var vm = require('vm');

var RACINE = path.resolve(__dirname, '..');
var args = process.argv.slice(2);
var SEULEMENT_ERREURS = args.indexOf('--erreurs') !== -1;
var CAUSES = args.indexOf('--causes') !== -1;
var FIXER = args.indexOf('--fixer') !== -1;
var cibles = args.filter(function (a) { return a.indexOf('--') !== 0; });

/* Le cliquet, même principe que pour SQL : le NOMBRE de blocs en erreur ne doit jamais
   augmenter. Il ne s'applique pas quand des cibles sont passées en argument — un
   sous-ensemble n'est pas comparable à la référence du site entier. */
var ATTENDU = path.join(__dirname, 'verif-js-attendu.json');

/* La règle du bouton est LUE dans runner.js, jamais recopiée. */
function lireMotif(nom) {
  var src = fs.readFileSync(path.join(RACINE, 'js', 'runner.js'), 'utf8');
  var m = src.match(new RegExp('var ' + nom + ' = (/[\\s\\S]*?/);'));
  if (!m) throw new Error(nom + ' introuvable dans js/runner.js');
  return eval(m[1]);
}
var BROWSER_ONLY = lireMotif('BROWSER_ONLY');

/* La seconde règle du bouton est une FONCTION, pas un motif : un bloc qui parse
   entièrement en JSON est un fichier de données, pas un programme. Elle est lue dans
   runner.js pour la même raison que BROWSER_ONLY — ce vérificateur doit décider
   exactement comme le navigateur, sinon il mesure autre chose. */
var estUnFichierJson = (function () {
  var src = fs.readFileSync(path.join(RACINE, 'js', 'runner.js'), 'utf8');
  var i = src.indexOf('function estUnFichierJson(texte) {');
  if (i < 0) throw new Error('estUnFichierJson introuvable dans js/runner.js');
  var j = src.indexOf('\n  }', i);
  if (j < 0) throw new Error('fin de estUnFichierJson introuvable');
  return eval('(' + src.slice(i, j + 4) + ')');
})();

function dec(s) {
  return s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"')
          .replace(/&#39;/g, "'").replace(/&amp;/g, '&');
}

/* On récupère le bloc ET son `data-file` : `pages/nodejs/lecon-03.html` porte cinq
   `package.json` annoncés `language-javascript`, et le nom du fichier est la seule chose
   qui les distingue d'un programme. */
function blocsJs(fichier) {
  var src = fs.readFileSync(fichier, 'utf8'), out = [];
  var re = /<figure class="code-block"([^>]*)>[\s\S]*?<code class="language-javascript">([\s\S]*?)<\/code>/g, m;
  while ((m = re.exec(src))) {
    var attrs = m[1] || '';
    var df = attrs.match(/data-file="([^"]*)"/);
    out.push({ code: dec(m[2]).trim(), fichier: df ? df[1] : '' });
  }
  return out;
}

function lecons(cible) {
  var out = [];
  var base = cible ? path.resolve(RACINE, cible) : path.join(RACINE, 'pages');
  (function marche(d) {
    var st; try { st = fs.statSync(d); } catch (e) { return; }
    if (st.isFile()) { if (/\.html$/.test(d)) out.push(d); return; }
    for (var f of fs.readdirSync(d)) marche(path.join(d, f));
  })(base);
  return out.filter(function (f) { return /lecon-\d+\.html$/.test(f); });
}

/* --- LES ERREURS ANNONCÉES, ET POURQUOI ELLES NE COMPTENT PAS COMME DES PANNES -------
 * Certains blocs LÈVENT une erreur à dessein : c'est la leçon (`try/catch`, `throw`,
 * validation qui refuse). L'audit en avait dénombré 67. On ne les devine pas à partir du
 * message — un motif pareil couvrirait aussi les vraies pannes : on les reconnaît à ce
 * que la page ÉCRIT à côté du code, en commentaire, avant l'exécution. */
var ERREUR_ANNONCEE = /\/\/[^\n]*\b(erreur|Erreur|ERREUR|throw|lève|leve|refuse|rejett?e|échoue|echoue|plante|invalide)\b/;

/* Le contexte d'exécution : celui du Worker, pas celui de Node.
   `console` est détourné comme dans WORKER_SRC ; les globales que le Worker possède et
   que Node nomme autrement sont fournies. Rien d'autre n'est ajouté : ajouter `require`
   ferait aboutir des blocs qui, dans le navigateur, échouent — le contraire du but. */
function contexteWorker(sorties) {
  var faux = function () {};
  var ctx = {
    console: {
      log: function () { sorties.push(fmtArgs(arguments)); },
      info: function () { sorties.push(fmtArgs(arguments)); },
      debug: function () { sorties.push(fmtArgs(arguments)); },
      warn: function () { sorties.push(fmtArgs(arguments)); },
      error: function () { sorties.push(fmtArgs(arguments)); },
      table: faux, group: faux, groupEnd: faux, time: faux, timeEnd: faux, dir: faux
    },
    setTimeout: function (f) { try { if (typeof f === 'function') f(); } catch (e) {} return 0; },
    setInterval: function () { return 0; },
    clearTimeout: faux, clearInterval: faux,
    queueMicrotask: function (f) { try { f(); } catch (e) {} },
    structuredClone: function (v) { return JSON.parse(JSON.stringify(v)); },
    self: null, globalThis: null
  };
  ctx.self = ctx; ctx.globalThis = ctx;
  return ctx;
}
function fmtArgs(a) {
  return Array.prototype.slice.call(a).map(function (v) {
    if (typeof v === 'string') return v;
    if (v === undefined) return 'undefined';
    if (v === null) return 'null';
    if (typeof v === 'function') return String(v);
    try { return JSON.stringify(v); } catch (e) { return String(v); }
  }).join(' ');
}

var fichiers = [];
if (cibles.length) cibles.forEach(function (c) { fichiers = fichiers.concat(lecons(c)); });
else fichiers = lecons(null);

/* Assez long pour qu'un bloc lent aboutisse, assez court pour ne pas figer la mesure. */
var DELAI = 5000;
var total = 0, ok = 0, ko = 0, ecartes = 0, annoncees = 0, indecis = 0;
var causes = {};
var parCours = {};

fichiers.forEach(function (f) {
  var rel = path.relative(RACINE, f).replace(/\\/g, '/');
  var cours = rel.split('/')[1];
  blocsJs(f).forEach(function (bloc, i) {
    var code = bloc.code;
    if (!code) return;
    /* Même règle que runner.js : un bloc qui touche au navigateur ou à Node n'a pas
       de bouton, il ne compte donc ni dans les réussites ni dans les échecs. */
    if (BROWSER_ONLY.test(code) || estUnFichierJson(code)) { ecartes++; return; }
    total++;
    parCours[cours] = parCours[cours] || { total: 0, ok: 0, annoncees: 0 };
    parCours[cours].total++;

    var sorties = [];
    var ctx = vm.createContext(contexteWorker(sorties));
    var msg = null;
    try {
      vm.runInContext(code, ctx, { timeout: DELAI, displayErrors: false });
    } catch (e) {
      msg = (e && e.name ? e.name + ': ' : '') + (e && e.message ? e.message : String(e));
    }
    /* ⚠️ UN DÉPASSEMENT DE DÉLAI N'EST PAS UNE PANNE, C'EST UNE MESURE NON CONCLUANTE, et
       ce vérificateur a failli naître avec le défaut qu'il venait de corriger ailleurs :
       compté parmi les erreurs, le nombre bougeait d'un passage à l'autre selon la charge
       de la machine (470 puis 469 sur deux relevés du même dépôt), et un cliquet posé
       dessus aurait rougi au hasard. Ces blocs — des démonstrations lentes à dessein,
       hachage répété, boucle de blocage — sont donc comptés à part et n'entrent pas dans
       le cliquet. C'est la même règle qu'au point B1e : l'outil doit dire quand il n'a
       pas conclu, jamais transformer son propre abandon en verdict sur le site. */
    if (msg && /timed out/i.test(msg)) {
      indecis++;
      if (!SEULEMENT_ERREURS && !CAUSES) console.log('  ??? ' + rel + ' #' + (i + 1) + ' — non concluant : plus de ' + (DELAI / 1000) + ' s');
      return;
    }
    if (!msg) {
      ok++; parCours[cours].ok++;
      if (!SEULEMENT_ERREURS && !CAUSES) console.log('  OK  ' + rel + ' #' + (i + 1));
      return;
    }
    /* Une erreur que la page ANNONCE en commentaire n'est pas une panne : c'est la leçon. */
    if (ERREUR_ANNONCEE.test(code)) {
      annoncees++; parCours[cours].annoncees++;
      if (!SEULEMENT_ERREURS && !CAUSES) console.log('  ANN ' + rel + ' #' + (i + 1) + ' — ' + msg.slice(0, 70) + '  (annoncée)');
      return;
    }
    ko++;
    var cle = msg.replace(/^(\w+Error): /, '$1: ').replace(/'[^']*'/g, "'…'").slice(0, 60);
    (causes[cle] = causes[cle] || []).push(rel + ' #' + (i + 1) + (bloc.fichier ? '  [' + bloc.fichier + ']' : ''));
    if (!CAUSES) console.log('  KO  ' + rel + ' #' + (i + 1) +
      (bloc.fichier ? '  [' + bloc.fichier + ']' : '') + ' — ' + msg.slice(0, 90));
  });
});

if (CAUSES) {
  console.log('=== CAUSES, de la plus fréquente à la plus rare ===');
  Object.keys(causes).sort(function (a, b) { return causes[b].length - causes[a].length; })
    .forEach(function (c) {
      console.log('\n' + String(causes[c].length).padStart(4) + '  ' + c);
      causes[c].slice(0, 8).forEach(function (o) { console.log('        ' + o); });
      if (causes[c].length > 8) console.log('        … et ' + (causes[c].length - 8) + ' autre(s)');
    });
}

console.log('\n=== RÉSUMÉ ===');
console.log('  blocs JS avec bouton .... ' + total);
console.log('  écartés (BROWSER_ONLY) .. ' + ecartes);
console.log('  aboutissent ............. ' + ok + (total ? '  (' + (100 * ok / total).toFixed(1) + ' %)' : ''));
console.log('  erreurs ANNONCÉES ....... ' + annoncees + '  (la page les écrit en commentaire)');
console.log('  non concluants .......... ' + indecis + '  (plus de ' + (DELAI / 1000) + ' s : hors cliquet)');
console.log('  EN PANNE ................ ' + ko);
console.log('\n--- par cours (les 12 plus fournis) ---');
Object.keys(parCours).sort(function (a, b) {
  return (parCours[b].total - parCours[b].ok - parCours[b].annoncees) -
         (parCours[a].total - parCours[a].ok - parCours[a].annoncees);
}).slice(0, 12).forEach(function (c) {
  var p = parCours[c], panne = p.total - p.ok - p.annoncees;
  console.log('  ' + c.padEnd(14) + String(p.ok).padStart(4) + ' / ' + String(p.total).padStart(4) +
    '   en panne : ' + String(panne).padStart(3));
});
if (!CAUSES) {
  console.log('\n--- causes (les 10 plus fréquentes) ---');
  Object.keys(causes).sort(function (a, b) { return causes[b].length - causes[a].length; })
    .slice(0, 10).forEach(function (c) { console.log('  ' + String(causes[c].length).padStart(4) + '  ' + c); });
}

/* --- le cliquet ---------------------------------------------------------- */
if (cibles.length) { console.log('\n  (cliquet inactif : des cibles ont ete passees en argument)'); process.exit(0); }
if (FIXER) {
  fs.writeFileSync(ATTENDU, JSON.stringify({ ko: ko, total: total,
    note: 'Nombre de blocs JS en panne au dernier releve. Il ne doit jamais augmenter. ' +
          'Le descendre apres une reparation : node tools/verif-js.js --fixer' }, null, 2) + '\n', 'utf8');
  console.log('\n  cliquet fixe a ' + ko + ' bloc(s) en panne sur ' + total + '.');
  process.exit(0);
}
var ref = null;
try { ref = JSON.parse(fs.readFileSync(ATTENDU, 'utf8')); } catch (e) { ref = null; }
if (!ref) { console.log('\n  (aucune reference de cliquet : node tools/verif-js.js --fixer)'); process.exit(0); }
if (ko > ref.ko) {
  console.log('\nCLIQUET : ' + ko + ' bloc(s) en panne contre ' + ref.ko + ' a la reference, soit ' +
    (ko - ref.ko) + ' de plus. Un bloc JS qui aboutissait est tombe.');
  process.exit(1);
}
if (ko < ref.ko) {
  console.log('\n  cliquet : ' + ko + ' en panne contre ' + ref.ko + ' attendus, soit ' + (ref.ko - ko) +
    ' de moins. Descendre la reference : node tools/verif-js.js --fixer');
  process.exit(0);
}
console.log('\n  cliquet : ' + ko + ' bloc(s) en panne, comme a la reference.');
process.exit(0);
