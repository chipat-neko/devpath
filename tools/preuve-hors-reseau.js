'use strict';
/**
 * tools/preuve-hors-reseau.js — Ouvrir une page en file://, RÉSEAU COUPÉ, et lire
 * ce qu'elle a réellement produit.
 *
 * POURQUOI CE SCRIPT EXISTE
 * -------------------------
 * Le chantier V14 embarque des moteurs d'exécution (SQLite, peut-être Python). Une
 * démonstration qui « marche » ne prouve rien tant qu'elle n'a pas été faite dans les
 * conditions de l'apprenant :
 *
 *  1. **En `file://`**, pas sur un serveur local.
 *  2. **SANS `--allow-file-access-from-files`.** `tools/verif-clic.js` emploie ce
 *     drapeau, qui assouplit la politique d'origine de Chrome. Un moteur qui ne
 *     chargerait QUE grâce à lui serait une fausse preuve : personne n'ouvre son
 *     navigateur avec ce drapeau.
 *  3. **Réseau réellement coupé** (`--host-resolver-rules="MAP * ~NOTFOUND"`), pour
 *     qu'un CDN oublié se manifeste par un échec au lieu de passer inaperçu.
 *
 * Le script rapporte aussi TOUTE requête sortante vue par Chrome : c'est le contrôle
 * qui prouve qu'aucun octet n'est allé chercher un CDN.
 *
 * USAGE
 *   node tools/preuve-hors-reseau.js <page.html> [--attendre=<expression JS>] [--ms=20000]
 * Le script attend que l'expression devienne non nulle, puis imprime le texte de la
 * page et le journal réseau. Code de sortie : 1 si l'attente expire ou si une requête
 * distante a été émise.
 */

var cp = require('child_process');
var path = require('path');
var http = require('http');
var fs = require('fs');

var RACINE = path.resolve(__dirname, '..');
var PORT = 9357;

var CHROME = ['C:/Program Files/Google/Chrome/Application/chrome.exe',
              'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
              process.env.LOCALAPPDATA + '/Google/Chrome/Application/chrome.exe'].find(function (p) {
  try { return fs.existsSync(p); } catch (e) { return false; }
});
if (!CHROME) { console.log('Chrome introuvable, rien de mesuré.'); process.exit(0); }

var args = process.argv.slice(2);
var page = args.filter(function (a) { return a.indexOf('--') !== 0; })[0];
if (!page) { console.error('usage : node tools/preuve-hors-reseau.js <page.html> [--attendre=EXPR]'); process.exit(2); }
var attendreExpr = (args.find(function (a) { return a.indexOf('--attendre=') === 0; }) || '--attendre=window.__RESULTAT').slice(11);
var LIMITE = parseInt((args.find(function (a) { return a.indexOf('--ms=') === 0; }) || '--ms=25000').slice(5), 10);
/* `--hash=#quelque-chose` : l'ancre fait partie de l'URL, et certaines pages en
   dépendent dès le chargement — le bac à sable Git ouvre la situation guidée que
   `#scenario-<id>` désigne. Elle ne peut pas être collée au chemin, que
   `path.resolve` normaliserait. */
var ANCRE = (args.find(function (a) { return a.indexOf('--hash=') === 0; }) || '--hash=').slice(7);

function dodo(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }
function get(url) {
  return new Promise(function (res, rej) {
    http.get(url, function (r) {
      var d = ''; r.on('data', function (c) { d += c; }); r.on('end', function () {
        try { res(JSON.parse(d)); } catch (e) { rej(e); }
      });
    }).on('error', rej);
  });
}

(async function () {
  var url = 'file:///' + path.resolve(RACINE, page).replace(/\\/g, '/') + ANCRE;
  console.log('preuve-hors-reseau.js — ' + url);
  console.log('  Chrome headless · file:// · SANS --allow-file-access-from-files · DNS coupé\n');

  var proc = cp.spawn(CHROME, ['--headless=new', '--remote-debugging-port=' + PORT, '--disable-gpu',
    '--no-first-run', '--disable-extensions',
    '--host-resolver-rules=MAP * ~NOTFOUND',
    '--user-data-dir=' + path.join(RACINE, 'scratchpad', '.chrome-preuve'),
    'about:blank'], { stdio: 'ignore' });

  var cible = null;
  for (var t = 0; t < 40 && !cible; t++) {
    await dodo(300);
    try {
      var liste = await get('http://127.0.0.1:' + PORT + '/json/list');
      cible = liste.find(function (x) { return x.type === 'page' && x.webSocketDebuggerUrl; });
    } catch (e) { /* Chrome démarre encore */ }
  }
  if (!cible) { console.error('Chrome n\'a pas répondu.'); proc.kill(); process.exit(1); }

  var ws = new WebSocket(cible.webSocketDebuggerUrl);
  var id = 0, attentes = new Map(), requetes = [], echecs = [];
  ws.onmessage = function (ev) {
    var m = JSON.parse(ev.data);
    if (m.id && attentes.has(m.id)) { attentes.get(m.id)(m); attentes.delete(m.id); }
    if (m.method === 'Network.requestWillBeSent') requetes.push(m.params.request.url);
    if (m.method === 'Network.loadingFailed') echecs.push(m.params.errorText);
  };
  function envoyer(method, params) {
    return new Promise(function (res) {
      var n = ++id;
      attentes.set(n, res);
      ws.send(JSON.stringify({ id: n, method: method, params: params || {} }));
    });
  }
  await new Promise(function (r) { ws.onopen = r; });
  await envoyer('Network.enable');
  await envoyer('Runtime.enable');
  await envoyer('Page.navigate', { url: url });

  var t0 = Date.now(), valeur = null;
  while (Date.now() - t0 < LIMITE) {
    await dodo(400);
    var r = await envoyer('Runtime.evaluate', { expression: 'String(' + attendreExpr + ')', returnByValue: true });
    var v = r.result && r.result.result && r.result.result.value;
    if (v && v !== 'null' && v !== 'undefined') { valeur = v; break; }
  }

  var texte = await envoyer('Runtime.evaluate', { expression: 'document.body.innerText', returnByValue: true });
  console.log((texte.result && texte.result.result && texte.result.result.value) || '(page vide)');

  console.log('\n--- réseau vu par Chrome ---');
  var distantes = requetes.filter(function (u) { return !/^(file|data|about|blob):/.test(u); });
  console.log('  requêtes totales  : ' + requetes.length);
  console.log('  requêtes DISTANTES: ' + distantes.length + (distantes.length ? ' -> ' + distantes.join(', ') : ' (aucune)'));
  if (echecs.length) console.log('  échecs de chargement : ' + echecs.join(', '));
  console.log('  attente « ' + attendreExpr +' » : ' + (valeur === null ? 'EXPIRÉE en ' + LIMITE + ' ms' : valeur + ' en ' + (Date.now() - t0) + ' ms'));

  ws.close(); proc.kill();
  process.exit(valeur === null || distantes.length ? 1 : 0);
})();
