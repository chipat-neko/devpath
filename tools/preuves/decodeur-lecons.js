'use strict';
/**
 * tools/preuves/decodeur-lecons.js — L'ENCART « quand ça casse » VU DANS LE NAVIGATEUR.
 *
 * POURQUOI. La case C4 relie les leçons au décodeur par un encart que `js/lecon.js`
 * construit à l'exécution, à partir de `js/erreurs-index.js`. Rien dans le source des
 * leçons ne le montre : ni `verif-html.js` ni `verif-donnees.js` ne peuvent le voir. Il
 * faut donc ouvrir les pages.
 *
 * TROIS CHOSES SONT MESURÉES, et la troisième est la plus importante :
 *   1. sur chaque leçon citée, l'encart EXISTE, liste le bon nombre d'erreurs, et son
 *      lien MÈNE À UN FICHIER QUI EXISTE (le chemin est relatif : une profondeur fausse
 *      ne se voit pas autrement) ;
 *   2. le lien pointe bien vers la page du décodeur ;
 *   3. sur une leçon NON citée, l'encart n'apparaît PAS — sans quoi on aurait ajouté un
 *      bloc à 1 523 pages sans le vouloir.
 *
 *   node tools/preuves/decodeur-lecons.js
 * Code de sortie 1 si une leçon manque son encart, si un lien est cassé, ou si une
 * leçon non citée en porte un.
 */
var cp = require('child_process'), path = require('path'), http = require('http'), fs = require('fs');
var RACINE = path.resolve(__dirname, '..', '..');
var PORT = 9367;
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
var w = {};
new Function('window', fs.readFileSync(path.join(RACINE, 'js', 'erreurs-index.js'), 'utf8'))(w);
var INDEX = w.ERREURS_INDEX || {};
var CITEES = Object.keys(INDEX).sort();
/* Trois témoins : des leçons que le décodeur ne cite pas. */
var TEMOINS = ['js/lecon-03.html', 'python/lecon-10.html', 'sql/lecon-01.html']
  .filter(function (p) { return !INDEX[p] && fs.existsSync(path.join(RACINE, 'pages', p)); });

(async function () {
  console.log('decodeur-lecons.js — ' + CITEES.length + ' leçon(s) citée(s) + ' + TEMOINS.length + ' témoin(s), file://, DNS coupé\n');
  var proc = cp.spawn(CHROME, ['--headless=new', '--remote-debugging-port=' + PORT, '--disable-gpu',
    '--no-first-run', '--disable-extensions', '--host-resolver-rules=MAP * ~NOTFOUND',
    '--user-data-dir=' + path.join(RACINE, 'scratchpad', '.chrome-c4'), 'about:blank'], { stdio: 'ignore' });
  var cible = null;
  for (var t = 0; t < 40 && !cible; t++) {
    await dodo(300);
    try { var l = await get('http://127.0.0.1:' + PORT + '/json/list'); cible = l.find(function (x) { return x.type === 'page' && x.webSocketDebuggerUrl; }); } catch (e) {}
  }
  if (!cible) { console.error("Chrome n'a pas répondu."); proc.kill(); process.exit(1); }
  var ws = new WebSocket(cible.webSocketDebuggerUrl);
  var id = 0, att = new Map(), distantes = [];
  ws.onmessage = function (ev) {
    var m = JSON.parse(ev.data);
    if (m.id && att.has(m.id)) { att.get(m.id)(m); att.delete(m.id); }
    if (m.method === 'Network.requestWillBeSent' && !/^(file|data|about|blob):/.test(m.params.request.url)) distantes.push(m.params.request.url);
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

  var ok = 0, fautes = [];
  for (var i = 0; i < CITEES.length; i++) {
    var rel = CITEES[i];
    await envoyer('Page.navigate', { url: 'file:///' + path.join(RACINE, 'pages', rel).replace(/\\/g, '/') });
    var n = -1;
    for (var k = 0; k < 20 && n < 0; k++) {
      await dodo(250);
      n = await ev('(function(){var b=document.querySelector(".lesson-erreurs");return b?b.querySelectorAll("li").length:-1;})()');
    }
    var href = await ev('(function(){var a=document.querySelector(".lesson-erreurs__lien a");return a?a.getAttribute("href"):"";})()');
    var url = await ev('(function(){var a=document.querySelector(".lesson-erreurs__lien a");return a?a.href:"";})()');
    var attendu = INDEX[rel].length;
    if (n !== attendu) { fautes.push(rel + ' : ' + (n < 0 ? 'AUCUN encart' : n + ' erreur(s) listée(s) pour ' + attendu + ' attendue(s)')); continue; }
    if (href !== '../decodeur.html') { fautes.push(rel + ' : le lien pointe vers « ' + href + ' »'); continue; }
    /* Le lien est RELATIF : on vérifie que la cible existe VRAIMENT sur le disque. */
    var chemin = decodeURIComponent(String(url).replace(/^file:\/\/\//, '')).replace(/\//g, path.sep);
    if (!fs.existsSync(chemin)) { fautes.push(rel + ' : le lien mène à un fichier INEXISTANT (' + chemin + ')'); continue; }
    ok++;
  }
  var temoinsOk = 0;
  for (var j = 0; j < TEMOINS.length; j++) {
    await envoyer('Page.navigate', { url: 'file:///' + path.join(RACINE, 'pages', TEMOINS[j]).replace(/\\/g, '/') });
    await dodo(900);
    var vu = await ev('!!document.querySelector(".lesson-erreurs")');
    var chargeIndex = await ev('!!window.ERREURS_INDEX');
    if (vu) fautes.push('TEMOIN ' + TEMOINS[j] + ' : un encart apparait alors que la lecon n\'est pas citee');
    else if (chargeIndex) fautes.push('TEMOIN ' + TEMOINS[j] + ' : la lecon charge l\'index alors qu\'elle n\'est pas citee');
    else temoinsOk++;
  }

  /* CE QUE LES TEMOINS NE PROUVENT PAS, et il a fallu une contre-epreuve pour le voir :
     une lecon non citee ne charge PAS `erreurs-index.js`, donc `initDecodeur` sort a sa
     premiere ligne. Le temoin mesure donc la SELECTION DES BALISES, pas la logique. Pour
     eprouver la logique elle-meme, on ouvre une lecon CITEE apres avoir rendu
     `window.ERREURS_INDEX` non inscriptible : le script de la page ne pourra pas le
     remplir, l'index restera vide, et l'encart ne doit PAS apparaitre. */
  /* Page.enable est requis : sans lui, addScriptToEvaluateOnNewDocument est accepte
     mais n'a AUCUN effet -- l'index se remplissait normalement et l'epreuve rendait
     un faux negatif. */
  await envoyer('Page.enable');
  await envoyer('Page.addScriptToEvaluateOnNewDocument', {
    source: 'Object.defineProperty(window, "ERREURS_INDEX", { value: {}, writable: false, configurable: false });'
  });
  await envoyer('Page.navigate', { url: 'file:///' + path.join(RACINE, 'pages', CITEES[0]).replace(/\\/g, '/') });
  await dodo(1500);
  var indexVide = await ev('JSON.stringify(window.ERREURS_INDEX || null)');
  var encartSansIndex = await ev('!!document.querySelector(".lesson-erreurs")');
  var logiqueOk = indexVide === '{}' && !encartSansIndex;
  if (indexVide !== '{}') fautes.push('epreuve de logique impossible : l\'index a pu etre rempli malgre tout (' + indexVide + ')');
  else if (encartSansIndex) fautes.push('LOGIQUE : un encart apparait alors que l\'index est VIDE -- il ne vient donc pas des donnees');

  console.log('--- bilan ---');
  console.log('  leçons citées avec encart juste : ' + ok + ' / ' + CITEES.length);
  console.log('  témoins SANS encart ni index    : ' + temoinsOk + ' / ' + TEMOINS.length);
  console.log('  index vidé de force -> pas d\'encart : ' + (logiqueOk ? 'oui' : 'NON'));
  console.log('  requêtes DISTANTES              : ' + distantes.length);
  if (fautes.length) { console.log('\n  FAUTES :'); fautes.forEach(function (f) { console.log('   · ' + f); }); }
  ws.close(); proc.kill();
  process.exit(fautes.length || distantes.length ? 1 : 0);
})();
