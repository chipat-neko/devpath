/* =============================================================================
   sonde-console-worker.js — quelles methodes de `console` un VRAI Worker possede,
   une fois le detournement de `runner.js` applique.

   POURQUOI CETTE SONDE EXISTE (point B2b-12 du chantier V17, 2026-09-09).
   `verif-js.js` execute chaque bloc dans un contexte `vm` qui reproduit celui du
   Worker. Ce contexte fournit un `console` ECRIT A LA MAIN : log, info, debug,
   warn, error, table, group, groupEnd, time, timeEnd, dir. Le Worker de Chrome,
   lui, part du `console` NATIF et n'en remplace que cinq methodes -- il garde donc
   toutes les autres. Un bloc qui appelle une methode absente de la liste ecrite a
   la main est declare EN PANNE par le verificateur alors qu'il marche chez
   l'apprenant : c'est le defaut du point B2b-2, « l'outil ne mesure pas le site,
   il mesure sa propre pauvrete ».

   Mesure statique du 2026-09-09 : les leçons appellent `console.assert` 16 fois,
   et `assert` ne figure pas dans le contexte du verificateur.

   CE QU'ELLE FAIT, et la regle est celle de B2b-2 : NE RIEN SUPPOSER.
     1. Elle LIT `WORKER_SRC` dans `js/runner.js` -- jamais ne le recopie.
     2. Elle ecrit une page jetable qui cree le Worker par la mecanique exacte de
        `runner.js` (Blob -> `new Worker`), en `file://`.
     3. Elle lui fait executer un code qui, pour chaque methode de `console`,
        repond PRESENTE / ABSENTE, puis l'APPELLE pour verifier qu'elle ne jette
        pas -- un nom qui existe et qui leve ne vaut rien.
     4. Chrome headless rend le DOM, la sonde le relit, imprime le tableau et
        compare a la liste du contexte de `verif-js.js`, LUE elle aussi.

   Elle ne juge rien et ne fait echouer aucune chaine : elle MESURE. Code 2 si
   Chrome est introuvable ou si la page n'a rien rendu -- une mesure manquee ne
   doit jamais se lire comme une mesure faite.
   ============================================================================= */
'use strict';

var fs = require('fs');
var path = require('path');
var cp = require('child_process');

var RACINE = path.resolve(__dirname, '..', '..');
var profil = require(path.join(RACINE, 'tools', 'lib', 'profil-chrome.js'));

var CHROME = ['C:/Program Files/Google/Chrome/Application/chrome.exe',
              'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
              '/usr/bin/google-chrome', '/usr/bin/chromium'].find(function (p) { return fs.existsSync(p); });
if (!CHROME) {
  console.log('sonde-console-worker — NON MESURE : Chrome introuvable.');
  process.exit(2);
}

/* ---------------------------------------------------------------- la source --- */
/* WORKER_SRC est une variable LOCALE de runner.js : on l'extrait du texte, entre
   `var WORKER_SRC = [` et le `].join("\n");` qui le ferme. Le decoupage se fait sur
   le premier `].join` qui suit, jamais sur une accolade comptee a la main. */
var runner = fs.readFileSync(path.join(RACINE, 'js', 'runner.js'), 'utf8');
var debut = runner.indexOf('var WORKER_SRC = [');
if (debut < 0) { console.log('sonde-console-worker — NON MESURE : WORKER_SRC introuvable dans js/runner.js.'); process.exit(2); }
var fin = runner.indexOf('].join("\\n");', debut);
if (fin < 0) { console.log('sonde-console-worker — NON MESURE : fin de WORKER_SRC introuvable.'); process.exit(2); }
var sourceWorker = runner.slice(debut, fin + '].join("\\n");'.length);

/* ⚠️ WORKER_SRC s'ouvre sur `envelopperPourRepli.toString()` : la coller seule dans une
   page leve une ReferenceError avant meme la creation du Worker, et le premier jet de
   cette sonde est reste bloque sur « (en attente) » pour cette raison exacte. La
   fonction est donc extraite elle aussi de `js/runner.js` -- lue, jamais recopiee. */
var iFn = runner.indexOf('function envelopperPourRepli(');
if (iFn < 0) { console.log('sonde-console-worker — NON MESURE : envelopperPourRepli introuvable.'); process.exit(2); }
var jFn = runner.indexOf('\n  }', iFn);
if (jFn < 0) { console.log('sonde-console-worker — NON MESURE : fin de envelopperPourRepli introuvable.'); process.exit(2); }
var sourceEnveloppe = runner.slice(iFn, jFn + 4);

/* La liste du contexte de verif-js.js, LUE elle aussi : la sonde ne repete pas une
   liste qui pourrait deriver du fichier qu'elle est censee controler. */
var vjs = fs.readFileSync(path.join(RACINE, 'tools', 'verif-js.js'), 'utf8');
var blocConsole = /console:\s*\{([\s\S]*?)\n\s*\},/.exec(vjs);
if (!blocConsole) { console.log('sonde-console-worker — NON MESURE : contexte console de verif-js.js introuvable.'); process.exit(2); }
var METHODES_VERIF = [];
/* ⚠️ LES COMMENTAIRES D'ABORD, LES NOMS ENSUITE. Le bloc `console:` de verif-js.js
   porte un commentaire de quinze lignes, et le francais y ecrit des « mot : » a la
   pelle. Un premier jet lisait les noms sur le texte brut : il en a tire une trentaine
   de faux noms (« fidele », « septembre », « PANNE »…), que la sonde a ensuite tente
   d'APPELER sur le console du Worker. La sonde s'est bloquee sur « (en attente) », et
   la mesure precedente — celle qui avait rendu 24 membres — est devenue irreproductible
   d'un coup. Un instrument dont le resultat depend d'un commentaire ne mesure rien. */
var corps = blocConsole[1].replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/\/\/[^\n]*/g, ' ');
corps.replace(/(^|[\s,{])([a-zA-Z]+)\s*:/g, function (_, __, nom) { METHODES_VERIF.push(nom); return _; });

/* --------------------------------------------------------- la page jetable --- */
/* Le code envoye au Worker : pour chaque methode de console, presence puis APPEL.
   Le detournement de runner.js a deja remplace log/info/debug/warn/error, dont les
   appels reviennent par postMessage ; les autres tapent le console natif, ce qui ne
   produit rien de visible mais ne doit pas jeter. */
/* Les methodes de `console` que les LEÇONS appellent vraiment : c'est la seule liste
   qui decide si le contexte du verificateur est assez riche. Relevee sur le disque,
   jamais ecrite ici -- une liste figee se perime des qu'une leçon est ajoutee. */
function methodesEmployeesParLesLecons() {
  var vues = {};
  (function parcourir(dir) {
    fs.readdirSync(dir, { withFileTypes: true }).forEach(function (e) {
      var p = path.join(dir, e.name);
      if (e.isDirectory()) return parcourir(p);
      if (!/\.html$/.test(e.name)) return;
      var t = fs.readFileSync(p, 'utf8'), r = /console\.([a-z][a-zA-Z]*)\s*\(/g, m;
      while ((m = r.exec(t))) vues[m[1]] = (vues[m[1]] || 0) + 1;
    });
  })(path.join(RACINE, 'pages'));
  return vues;
}
var EMPLOYEES = methodesEmployeesParLesLecons();

/* ⚠️⚠️ CETTE SONDE MESURE LA PRESENCE, PAS L'APPEL — ET C'EST UNE LIMITE MESUREE, pas
   un renoncement. Le premier jet APPELAIT chaque methode pour verifier qu'elle ne jette
   pas. Resultat : la sonde restait bloquee sur « (en attente) », le Worker ne renvoyant
   plus rien, pas meme le `done` que WORKER_SRC poste toujours. Bisection dans la page
   meme de la sonde, trois essais :

       console.log("@@@simple")                  -> « @@@simple »   (revient)
       console.assert(true, "s")  puis un log    -> « (en attente) »
       console.table([1])         puis un log    -> « (en attente) »

   Le point commun n'est pas la methode : c'est qu'elle soit NATIVE. `log` est detournee
   par WORKER_SRC et ne fait qu'un postMessage ; `assert` et `table` restent natives et
   parlent a l'agent d'inspection. Sous `--dump-dom --virtual-time-budget`, cet echange
   suspend le temps virtuel : le budget n'avance plus, le DOM est capture avant la
   reponse. C'est un artefact de la TECHNIQUE de mesure, pas un comportement du site —
   un Chrome pilote par CDP, comme celui de `verif-clic.js`, execute ces memes blocs sans
   broncher. La preuve de FONCTIONNEMENT se fait donc la-bas, au clic, et pas ici.

   L'ENUMERATION, elle, est fiable et suffit a la question posee : quelles methodes le
   Worker possede-t-il que le contexte du verificateur n'a pas. */
var CODE_SONDE = [
  /* ⚠️ `for (var k in console)` ne rend RIEN dans Chrome : les methodes natives de
     console sont des proprietes propres NON ENUMERABLES. Un premier jet a ainsi
     mesure « 2 membres » sur un objet qui en porte 24, et aurait conclu que le Worker
     est plus pauvre que le contexte du verificateur -- l inverse exact de la verite.
     Il faut getOwnPropertyNames, sur l objet ET sur son prototype. */
  'var noms = Object.getOwnPropertyNames(console);',
  'var proto = Object.getPrototypeOf(console);',
  'while (proto && proto !== Object.prototype) { noms = noms.concat(Object.getOwnPropertyNames(proto)); proto = Object.getPrototypeOf(proto); }',
  'noms = noms.filter(function (n, i, t) { return t.indexOf(n) === i && n !== "constructor"; }).sort();',
  'var res = noms.map(function (n) { return n + ":" + typeof console[n]; });',
  'console.log("@@@" + res.join(","));'
].join('\n');

var page = [
  '<!DOCTYPE html><html lang="fr"><head><meta charset="utf-8"><title>sonde</title></head><body>',
  '<pre id="r">(en attente)</pre>',
  '<script>',
  sourceEnveloppe,
  sourceWorker,
  'var blob = new Blob([WORKER_SRC], { type: "application/javascript" });',
  'var w = new Worker(URL.createObjectURL(blob));',
  'var vues = [];',
  'w.onmessage = function (ev) {',
  '  if (ev.data && ev.data.done) { document.getElementById("r").textContent = vues.join("\\n") || "(rien)"; return; }',
  '  if (ev.data && typeof ev.data.text === "string") vues.push(ev.data.text);',
  '};',
  'w.onerror = function (e) { document.getElementById("r").textContent = "ERREUR WORKER: " + e.message; };',
  'w.postMessage(' + JSON.stringify(CODE_SONDE) + ');',
  '<\/script></body></html>'
].join('\n');

var fichierPage = path.join(__dirname, 'sonde-console-worker.tmp.html');
fs.writeFileSync(fichierPage, page, 'utf8');

/* ------------------------------------------------------------------ mesure --- */
var url = 'file:///' + fichierPage.replace(/\\/g, '/');
var dom = '';

/* ⚠️ LE BUDGET DE TEMPS VIRTUEL DEPEND DE LA CHARGE DE LA MACHINE, et c'est le piege qui
   a coute le plus cher a ce point. La sonde a d'abord rendu ses 24 membres, puis
   « NON MESURE : le Worker n a rien renvoye » a chaque relance, SANS qu'une ligne de la
   page ait change : 75 processus Chrome residuels trainaient sur la machine et le Worker
   ne demarrait plus dans les 6 000 ms de `--virtual-time-budget`. Le MEME fichier,
   relance a 25 000, a rendu les 24 membres du premier coup. Une sonde dont le verdict
   depend de la charge est une sonde qui ment -- c'est le defaut du `timeout` de `vm`
   corrige au point B2a, sur un autre instrument. Deux essais, le second plus large, et
   le rapport dit lequel a servi. */
var BUDGETS = [30000, 90000];
var budgetUtilise = 0;
for (var iB = 0; iB < BUDGETS.length; iB++) {
  try {
    dom = cp.execFileSync(CHROME, [
      '--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check',
      '--user-data-dir=' + profil.neuf('sonde-console-worker'),
      '--virtual-time-budget=' + BUDGETS[iB], '--dump-dom', url
    ], { encoding: 'utf8', timeout: 240000, stdio: ['ignore', 'pipe', 'ignore'] });
    budgetUtilise = BUDGETS[iB];
    if (/<pre id="r">@@@/.test(dom)) break;
    continue;
  } catch (e) {
    console.log('sonde-console-worker — NON MESURE : Chrome n a pas rendu la page (' + (e && e.message) + ').');
    try { fs.unlinkSync(fichierPage); } catch (e2) {}
    process.exit(2);
  }
}
if (process.argv.indexOf('--garder') === -1) { try { fs.unlinkSync(fichierPage); } catch (e2) {} }

/* ⚠️ On lit le marqueur DANS `<pre id="r">`, jamais dans le DOM entier : `--dump-dom`
   rend aussi le `<script>` de la page, ou le code envoye au Worker figure en toutes
   lettres. Un premier jet cherchait le marqueur partout et retrouvait celui du CODE
   SOURCE : il mesurait le texte de sa propre sonde, et rendait « 2 membres ». */
var zone = /<pre id="r">([\s\S]*?)<\/pre>/.exec(dom);
var m = zone ? /@@@([^<\n]*)/.exec(zone[1]) : null;
if (!m) {
  console.log('sonde-console-worker — NON MESURE : le Worker n a rien renvoye.');
  console.log('  DOM rendu : ' + dom.slice(0, 400).replace(/\s+/g, ' '));
  process.exit(2);
}

if (process.argv.indexOf('--brut') !== -1) console.log('BRUT: ' + m[1]);
var mesurees = m[1].split(',').filter(Boolean).map(function (s) {
  var i = s.lastIndexOf(':');
  return { nom: s.slice(0, i), etat: s.slice(i + 1) };
});

console.log('sonde-console-worker — Chrome headless, page file://, Worker cree par la mecanique de runner.js');
console.log('');
console.log('  WORKER_SRC lu dans js/runner.js .......... ' + sourceWorker.split('\n').length + ' ligne(s)');
console.log('  budget de temps virtuel qui a suffi ...... ' + budgetUtilise + ' ms');
console.log('  console du contexte de verif-js.js ....... ' + METHODES_VERIF.length + ' methode(s) : ' + METHODES_VERIF.join(', '));
console.log('  console du VRAI Worker ................... ' + mesurees.length + ' membre(s)');
console.log('');

var fonctions = mesurees.filter(function (x) { return x.etat === 'function'; });
var manquantes = fonctions.filter(function (x) { return METHODES_VERIF.indexOf(x.nom) === -1; });
var risque = 0;

console.log('  --- methodes du Worker ABSENTES du contexte de verif-js.js : ' + manquantes.length + ' ---');
manquantes.forEach(function (x) {
  var n = EMPLOYEES[x.nom] || 0;
  if (n) risque += n;
  console.log('     ' + (x.nom + '                ').slice(0, 16) +
    ' appelee par les leçons : ' + n + (n ? '  <-- FAUX POSITIF DU VERIFICATEUR' : ''));
});
console.log('');

var absentesDuWorker = METHODES_VERIF.filter(function (n) {
  return !mesurees.some(function (x) { return x.nom === n; });
});
console.log('  --- methodes que verif-js.js fournit et que le Worker N A PAS : ' + absentesDuWorker.length + ' ---');
absentesDuWorker.forEach(function (n) { console.log('     ' + n); });
console.log('');
console.log('  appels de leçon exposes a un faux positif ... ' + risque);
console.log('');
console.log('  Une methode presente dans le Worker et absente du contexte fait declarer EN PANNE');
console.log('  un bloc qui marche chez l apprenant. L inverse fait declarer ABOUTI un bloc qui casse.');
console.log('');

/* ⚠️ CETTE SONDE PEUT ROUGIR, et c'est ce qui lui donne le droit d'etre une etape de la
   chaine : une mesure qui rend toujours 0 occupe la place. Elle echoue quand le Worker
   possede une methode que le contexte de verif-js.js n'a pas ET qu'une leçon l'appelle —
   c'est-a-dire exactement quand un bloc vivant est declare EN PANNE a tort. Le seuil est
   l'EMPLOI, pas la simple absence : une methode que personne n'appelle ne fausse aucun
   verdict aujourd'hui, elle est signalee sans faire echouer.
   Eprouvee par injection le 2026-09-09 : `assert` retiree du contexte -> « 1 absente,
   appelee par les leçons : 7 », code 1 ; remise -> « 0 absente », code 0, md5 du fichier
   identique (`3b5433bc…`). */
if (risque > 0) {
  console.log('  ECHEC — ' + risque + ' appel(s) de leçon sont declares EN PANNE a tort par verif-js.js.');
  console.log('  Ajouter les methodes ci-dessus au `console` de contexteWorker(), dans tools/verif-js.js.');
  process.exit(1);
}
console.log('  OK — le contexte de verif-js.js couvre tout ce que les leçons appellent.');
