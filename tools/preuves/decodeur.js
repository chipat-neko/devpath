'use strict';
/**
 * tools/preuves/decodeur.js — LE DÉCODEUR JUGÉ PAR LA PAGE, dans Chrome, en `file://`.
 *
 * POURQUOI. `tools/verif-erreurs.js` prouve que les messages publiés sont ceux que le
 * moteur produit. Il ne prouve PAS que la page les retrouve : c'est un autre travail, et
 * c'est celui qui décide de l'utilité du décodeur. Un apprenant ne colle pas le message
 * du fichier de données — il colle CE QUE SA CONSOLE LUI A ÉCRIT, avec ses noms de
 * variables, ses chemins de fichiers et sa trace d'appels.
 *
 * TROIS ÉPREUVES, de la plus facile à la plus dure :
 *   1. LE MESSAGE EXACT. Les 31 messages publiés, collés tels quels : la bonne fiche
 *      doit sortir EN PREMIER.
 *   2. LA TRACE ENTIÈRE. Le même message noyé dans une vraie trace (chemin Windows,
 *      numéros de ligne, « at Object.<anonymous> », « Traceback (most recent call
 *      last) ») : la bonne fiche doit encore sortir en premier.
 *   3. LES NOMS DE L'APPRENANT. Le message avec d'AUTRES noms de variables que ceux de
 *      l'exemple — c'est le cas réel, et celui qu'une recherche par mots rate.
 *
 * ET LA CONTRE-ÉPREUVE : un message inventé, qui ne correspond à rien, ne doit rien
 * rendre. Sans elle, un décodeur qui répondrait « oui » à tout passerait les trois.
 *
 *   node tools/preuves/decodeur.js
 * Code de sortie 1 si une épreuve échoue ou si Chrome a émis une requête distante.
 */
var cp = require('child_process'), path = require('path'), http = require('http'), fs = require('fs');
var portChrome = require('../lib/port-chrome.js');
var RACINE = path.resolve(__dirname, '..', '..');
/* Le port n'est plus ecrit en dur : Chrome le choisit et l'annonce dans son
   profil (point A6 du chantier V17). Six paires d'outils partageaient un meme
   numero, et un port deja pris fait mesurer LA PAGE D'UN AUTRE sans rien dire.
   Voir tools/lib/port-chrome.js. */
var PORT = 0;
var CHROME = ['C:/Program Files/Google/Chrome/Application/chrome.exe',
              'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
              process.env.LOCALAPPDATA + '/Google/Chrome/Application/chrome.exe']
  .find(function (p) { try { return fs.existsSync(p); } catch (e) { return false; } });
if (!CHROME) { console.log('Chrome introuvable, rien de mesuré.'); process.exit(2); }
function dodo(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }
function get(u) {
  return new Promise(function (res, rej) {
    http.get(u, function (r) { var d = ''; r.on('data', function (c) { d += c; }); r.on('end', function () { try { res(JSON.parse(d)); } catch (e) { rej(e); } }); }).on('error', rej);
  });
}

/* Les données, chargées ici pour construire les épreuves à partir du fichier lui-même :
   aucun message n'est retapé dans ce script. */
var sandbox = { window: {} };
new Function('window', fs.readFileSync(path.join(RACINE, 'js', 'erreurs-data.js'), 'utf8'))(sandbox.window);
var ERREURS = sandbox.window.ERREURS;

/** Une trace vraisemblable autour du message, selon le langage. */
function trace(e) {
  /* SQL : les clients affichent le message avec un prefixe qui leur est propre. */
  if (e.langue === 'sql') {
    return 'Error: ' + e.message + '\n' +
      '  at Database.exec (sql-wasm.js:1:12345)\n' +
      "  requete : SELECT ... FROM ...";
  }
  /* Bash : le prefixe fichier + numero de ligne, exactement comme le shell l'ecrit. */
  if (e.langue === 'bash') {
    return './deploiement.sh: line 42: ' + e.message;
  }
  if (e.langue === 'javascript') {
    return 'D:\\projets\\mon-site\\app.js:12\n' +
      '  console.log(x);\n              ^\n\n' + e.message + '\n' +
      '    at Object.<anonymous> (D:\\projets\\mon-site\\app.js:12:15)\n' +
      '    at Module._compile (node:internal/modules/cjs/loader:1234:14)\n\n' +
      'Node.js v24.16.0';
  }
  return 'Traceback (most recent call last):\n' +
    '  File "C:\\Users\\noah\\devoir.py", line 7, in <module>\n' +
    '    resultat = calculer(donnees)\n' +
    '               ^^^^^^^^^^^^^^^^^\n' + e.message;
}
/** Le même message, mais avec les noms d'un AUTRE programme. */
var RENOMMAGES = {
  'js-not-defined': ['totl', 'monComtpeur'],
  'js-undefined-prop': ["(reading 'ville')", "(reading 'codePostal')"],
  'js-not-a-function': ['nombres.pusk', 'panier.ajouterProduit'],
  'js-tdz': ["'compteur'", "'reglages'"],
  'js-not-iterable': ['options', 'configuration'],
  'js-null-prop': ["(setting 'textContent')", "(setting 'innerHTML')"],
  'js-map-objet': ['scores.map', 'inventaire.map'],
  'js-deja-declaree': ["'total'", "'panierGlobal'"],
  'py-name': ["name 'totl' is not defined. Did you mean: 'total'?", "name 'moyene' is not defined. Did you mean: 'moyenne'?"],
  'py-key': ["'age'", "'code_postal'"],
  'py-attribute': ["'list' object has no attribute 'push'", "'dict' object has no attribute 'append'"],
  'py-int': ["'trente'", "'douze ans'"],
  'py-str-item': ["'str' object", "'tuple' object"],
  'py-module': ["'requetes'", "'pandas_local'"],
  'py-argument': ['additionner() missing 1', 'calculer_moyenne() missing 2'],
  'py-unbound': ["'compteur'", "'sous_total'"],
  'py-int-iterable': ["'int' object", "'float' object"],
  'py-indent': ["'if' statement on line 1", "'for' statement on line 12"],
  'sql-table': ['clients', 'utilisateurs'],
  'sql-colonne': ['nom_complet', 'date_naissance'],
  'sql-syntaxe': ['"FORM"', '"SELCT"'],
  'sql-unique': ['client.email', 'produit.reference'],
  'sql-notnull': ['client.nom', 'facture.total'],
  'sql-ambigu': ['id', 'code'],
  'sql-fonction': ['NOW', 'GETDATE'],
  'sh-command-not-found': ['monoutil', 'docekr'],
  'sh-unbound': ['INEXISTANT', 'CHEMIN_BASE'],
  'sh-readonly': ['TAUX', 'RACINE'],
  'sh-substitution': ['${x!!}', '${chemin//}'],
  'js-parenthese': null, 'js-const': null, 'js-stack': null, 'js-json-vide': null,
  'js-json-simple': null, 'js-tofixed': null, 'js-await-hors-async': null,
  'py-concat': null, 'py-index': null, 'py-zero': null, 'py-deux-points': null,
  'py-parenthese': null, 'py-recursion': null,
  /* Ces messages ne portent aucun nom propre : il n'y a rien a renommer. */
  'sql-nb-valeurs': null, 'sql-agregat': null, 'sql-sous-requete': null,
  'sql-incomplet': null, 'sql-order-range': null, 'sql-table-existe': null, 'sql-fk': null,
  'sh-no-such-file': null, 'sh-eof-guillemet': null, 'sh-token-inattendu': null,
  'sh-fin-de-fichier': null, 'sh-test-unaire': null, 'sh-division': null
};
var FAUX = [
  'MonSuperError: le café est froid',
  'Erreur 42 : la fusée a décollé sans prévenir',
  'GraveError: everything is on fire in the datacenter'
];

(async function () {
  console.log("decodeur.js — la page interrogée dans Chrome, en file://, sans --allow-file-access-from-files\n");
  var profilCh = path.join(RACINE, 'scratchpad', '.chrome-decodeur');
  portChrome.oublier(profilCh);
  var proc = cp.spawn(CHROME, ['--headless=new', '--remote-debugging-port=0', '--disable-gpu',
    '--no-first-run', '--disable-extensions', '--host-resolver-rules=MAP * ~NOTFOUND',
    '--user-data-dir=' + profilCh, 'about:blank'], { stdio: 'ignore' });
  try { PORT = await portChrome.attendre(profilCh); }
  catch (ePort) { console.log(ePort.message); try { proc.kill(); } catch (e2) {} process.exit(2); }
  var cible = null;
  for (var t = 0; t < 40 && !cible; t++) {
    await dodo(300);
    try { var l = await get('http://127.0.0.1:' + PORT + '/json/list'); cible = l.find(function (x) { return x.type === 'page' && x.webSocketDebuggerUrl; }); } catch (e) {}
  }
  if (!cible) { console.error("Chrome n'a pas répondu."); proc.kill(); process.exit(1); }
  var ws = new WebSocket(cible.webSocketDebuggerUrl);
  var id = 0, att = new Map(), distantes = [], erreursConsole = [];
  ws.onmessage = function (ev) {
    var m = JSON.parse(ev.data);
    if (m.id && att.has(m.id)) { att.get(m.id)(m); att.delete(m.id); }
    if (m.method === 'Network.requestWillBeSent' && !/^(file|data|about|blob):/.test(m.params.request.url)) distantes.push(m.params.request.url);
    if (m.method === 'Runtime.exceptionThrown') erreursConsole.push(String(m.params.exceptionDetails.text));
  };
  function envoyer(method, params) {
    return new Promise(function (res) { var n = ++id; att.set(n, res); ws.send(JSON.stringify({ id: n, method: method, params: params || {} })); });
  }
  async function ev(expr) {
    var r = await envoyer('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: false });
    return r.result && r.result.result ? r.result.result.value : undefined;
  }
  await new Promise(function (r) { ws.onopen = r; });
  await envoyer('Network.enable'); await envoyer('Runtime.enable');
  await envoyer('Page.navigate', { url: 'file:///' + path.join(RACINE, 'pages', 'decodeur.html').replace(/\\/g, '/') });
  /* Les scripts sont en `defer` : sur un profil Chrome neuf, 1,2 s ne suffit pas
     toujours. On attend que la page expose son point d'entree, jusqu'a 15 s. */
  var total = 0;
  for (var w = 0; w < 30 && !total; w++) { await dodo(500); total = await ev('window.__DECODEUR && window.__DECODEUR.total'); }
  var inutile = await ev('window.__DECODEUR && window.__DECODEUR.total');
  if (!total) { console.log('La page n\'expose pas le décodeur — script non chargé ?'); ws.close(); proc.kill(); process.exit(1); }
  console.log('  entrées chargées par la page : ' + total + '\n');

  async function premier(texte) {
    var r = await ev('JSON.stringify(window.__DECODEUR.chercher(' + JSON.stringify(texte) + '))');
    var l = JSON.parse(r || '[]');
    return l.length ? l[0] : null;
  }

  var bilan = { exact: [0, 0], trace: [0, 0], renomme: [0, 0] };
  for (var i = 0; i < ERREURS.length; i++) {
    var e = ERREURS[i];

    var a = await premier(e.message);
    bilan.exact[1]++; if (a && a.id === e.id) bilan.exact[0]++;
    else console.log('  ✗ MESSAGE EXACT  ' + e.id + ' → ' + (a ? a.id + ' (' + a.s + ')' : 'rien'));

    var b = await premier(trace(e));
    bilan.trace[1]++; if (b && b.id === e.id) bilan.trace[0]++;
    else console.log('  ✗ TRACE ENTIÈRE  ' + e.id + ' → ' + (b ? b.id + ' (' + b.s + ')' : 'rien'));

    if (!(e.id in RENOMMAGES)) console.log('  ⚠ RENOMMAGE non declare pour ' + e.id + ' -- epreuve 3 non jouee');
    var r = RENOMMAGES[e.id];
    if (r) {
      var autre = e.message.split(r[0]).join(r[1]);
      if (autre === e.message) { console.log('  ⚠ RENOMMAGE sans effet pour ' + e.id + ' (motif « ' + r[0] + ' » absent)'); }
      var c = await premier(trace({ langue: e.langue, message: autre }));
      bilan.renomme[1]++; if (c && c.id === e.id) bilan.renomme[0]++;
      else console.log('  ✗ AUTRES NOMS    ' + e.id + ' → ' + (c ? c.id + ' (' + c.s + ')' : 'rien') + '\n      « ' + autre + ' »');
    }
  }

  var faux = 0;
  for (var f = 0; f < FAUX.length; f++) {
    var x = await premier(FAUX[f]);
    if (x) console.log('  ✗ CONTRE-ÉPREUVE : « ' + FAUX[f] + ' » rend ' + x.id + ' (' + x.s + ')');
    else faux++;
  }

  console.log('\n--- bilan ---');
  console.log('  message exact tapé  : ' + bilan.exact[0] + ' / ' + bilan.exact[1] + ' trouvés en premier');
  console.log('  trace entière collée: ' + bilan.trace[0] + ' / ' + bilan.trace[1]);
  console.log('  AUTRES noms de var. : ' + bilan.renomme[0] + ' / ' + bilan.renomme[1]);
  console.log('  contre-épreuve      : ' + faux + ' / ' + FAUX.length + ' messages inventés correctement REFUSÉS');
  console.log('  erreurs de console  : ' + erreursConsole.length + (erreursConsole.length ? ' -> ' + erreursConsole[0] : ''));
  console.log('  requêtes DISTANTES  : ' + distantes.length);
  ws.close(); proc.kill();
  var ok = bilan.exact[0] === bilan.exact[1] && bilan.trace[0] === bilan.trace[1] &&
           bilan.renomme[0] === bilan.renomme[1] && faux === FAUX.length &&
           !distantes.length && !erreursConsole.length;
  process.exit(ok ? 0 : 1);
})();
