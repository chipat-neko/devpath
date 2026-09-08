'use strict';
/**
 * tools/preuves/erreurs-sql.js — Les entrées SQL du décodeur, REJOUÉES DANS LE MOTEUR
 * DU SITE.
 *
 * POURQUOI CE SCRIPT EXISTE À PART. `tools/verif-erreurs.js` réexécute les extraits
 * JavaScript, Python et Bash avec les moteurs de la machine. Il ne peut rien faire des
 * entrées SQL : aucun `sqlite3` n'est installé ici, et sql.js est un moteur de
 * NAVIGATEUR. Plutôt que de laisser 14 entrées non vérifiées — ce que le chantier V14
 * combat précisément — elles sont rejouées ici dans le SQLite embarqué du site, celui-là
 * même qui juge les exercices SQL de l'apprenant.
 *
 * Ce que la page vérifie, entrée par entrée, sur une base NEUVE à chaque fois :
 *   · l'exemple FAUTIF produit EXACTEMENT le message publié ;
 *   · l'exemple CORRIGÉ ne produit plus rien.
 *
 *   node tools/preuves/erreurs-sql.js
 * Code de sortie 1 si une entrée diverge ou si Chrome a émis une requête distante.
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
if (!CHROME) { console.log('erreurs-sql.js — Chrome introuvable, rien de mesuré.'); process.exit(2); }
function dodo(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }
function get(u) {
  return new Promise(function (res, rej) {
    http.get(u, function (r) { var d = ''; r.on('data', function (c) { d += c; }); r.on('end', function () { try { res(JSON.parse(d)); } catch (e) { rej(e); } }); }).on('error', rej);
  });
}
(async function () {
  console.log('erreurs-sql.js — les entrées SQL du décodeur, rejouées dans sql.js (file://, DNS coupé)\n');
  var profilCh = path.join(RACINE, 'scratchpad', '.chrome-sql-err');
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
  await envoyer('Page.navigate', { url: 'file:///' + path.join(RACINE, 'tools', 'preuves', 'erreurs-sql.html').replace(/\\/g, '/') });
  var bilan = null;
  for (var k = 0; k < 60 && !bilan; k++) { await dodo(500); bilan = await ev('window.__BILAN'); }
  if (!bilan) {
    console.log('Aucun bilan récupéré. Sortie de la page :');
    console.log(await ev('document.getElementById("sortie").textContent'));
    ws.close(); proc.kill(); process.exit(1);
  }
  console.log(await ev('document.getElementById("sortie").textContent'));
  console.log('\n--- bilan ---');
  console.log('  moteur              : SQLite ' + bilan.version + ' (sql.js embarqué)');
  console.log('  entrées rejouées    : ' + bilan.joues);
  console.log('  fautes              : ' + bilan.fautes.length);
  bilan.fautes.forEach(function (f) { console.log('   · ' + f); });
  console.log('  requêtes DISTANTES  : ' + distantes.length);
  ws.close(); proc.kill();
  process.exit(bilan.fautes.length || distantes.length ? 1 : 0);
})();
