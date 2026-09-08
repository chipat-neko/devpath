'use strict';
/**
 * tools/preuves/python-lecon.js — Cliquer, pour de vrai, sur les boutons « ▶ Tester »
 * Python d'une leçon du site, en `file://` et RÉSEAU COUPÉ.
 *
 * Pourquoi ce script plutôt qu'une page de démonstration : `tools/preuves/pyodide.html`
 * prouve que CPython démarre, mais pas que `js/runner.js` le branche correctement sur
 * une leçon réelle — profondeur des chemins, résolution de la racine du site, garde des
 * modules non embarqués, rendu de la console. C'est ce que celui-ci mesure.
 *
 *   node tools/preuves/python-lecon.js [pages/python/lecon-04.html …]
 * Sans argument : un échantillon de leçons Python. Code de sortie 1 si un bloc échoue
 * à démarrer l'interpréteur ou si Chrome a émis la moindre requête distante.
 *
 * CE QU'IL COMPTE COMME ÉCHEC : uniquement ce qui relève du MOTEUR (interpréteur qui ne
 * démarre pas, délai dépassé, requête distante). Une exception Python — une NameError
 * sur un fragment qui dépend d'un bloc précédent, par exemple — n'en est pas un : c'est
 * une propriété du contenu, que la phase B corrigera exercice par exercice.
 */
var cp = require('child_process');
var path = require('path');
var http = require('http');
var fs = require('fs');
var portChrome = require('../lib/port-chrome.js');

var RACINE = path.resolve(__dirname, '..', '..');
/* Le port n'est plus ecrit en dur : Chrome le choisit et l'annonce dans son
   profil (point A6 du chantier V17). Six paires d'outils partageaient un meme
   numero, et un port deja pris fait mesurer LA PAGE D'UN AUTRE sans rien dire.
   Voir tools/lib/port-chrome.js. */
var PORT = 0;
var CHROME = ['C:/Program Files/Google/Chrome/Application/chrome.exe',
              'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
              process.env.LOCALAPPDATA + '/Google/Chrome/Application/chrome.exe'].find(function (p) {
  try { return fs.existsSync(p); } catch (e) { return false; }
});
if (!CHROME) { console.log('Chrome introuvable, rien de mesuré.'); process.exit(0); }

var pages = process.argv.slice(2).filter(function (a) { return a.indexOf('--') !== 0; });
if (!pages.length) {
  pages = ['pages/python/lecon-03.html', 'pages/python/lecon-08.html',
           'pages/python/lecon-15.html'].filter(function (p) { return fs.existsSync(path.join(RACINE, p)); });
}

function dodo(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }
function get(url) {
  return new Promise(function (res, rej) {
    http.get(url, function (r) {
      var d = ''; r.on('data', function (c) { d += c; });
      r.on('end', function () { try { res(JSON.parse(d)); } catch (e) { rej(e); } });
    }).on('error', rej);
  });
}

(async function () {
  console.log('python-lecon.js — ' + pages.length + ' leçon(s) · file:// · DNS coupé · SANS --allow-file-access-from-files\n');
  var profilCh = path.join(RACINE, 'scratchpad', '.chrome-preuve-py');
  portChrome.oublier(profilCh);
  var proc = cp.spawn(CHROME, ['--headless=new', '--remote-debugging-port=0', '--disable-gpu',
    '--no-first-run', '--disable-extensions', '--host-resolver-rules=MAP * ~NOTFOUND',
    '--user-data-dir=' + profilCh, 'about:blank'], { stdio: 'ignore' });
  try { PORT = await portChrome.attendre(profilCh); }
  catch (ePort) { console.log(ePort.message); try { proc.kill(); } catch (e2) {} process.exit(2); }

  var cible = null;
  for (var t = 0; t < 40 && !cible; t++) {
    await dodo(300);
    try {
      var l = await get('http://127.0.0.1:' + PORT + '/json/list');
      cible = l.find(function (x) { return x.type === 'page' && x.webSocketDebuggerUrl; });
    } catch (e) {}
  }
  if (!cible) { console.error("Chrome n'a pas répondu."); proc.kill(); process.exit(1); }

  var ws = new WebSocket(cible.webSocketDebuggerUrl);
  var id = 0, attentes = new Map(), distantes = [];
  ws.onmessage = function (ev) {
    var m = JSON.parse(ev.data);
    if (m.id && attentes.has(m.id)) { attentes.get(m.id)(m); attentes.delete(m.id); }
    if (m.method === 'Network.requestWillBeSent' && !/^(file|data|about|blob):/.test(m.params.request.url)) {
      distantes.push(m.params.request.url);
    }
  };
  function envoyer(method, params) {
    return new Promise(function (res) {
      var n = ++id; attentes.set(n, res);
      ws.send(JSON.stringify({ id: n, method: method, params: params || {} }));
    });
  }
  async function ev(expr) {
    var r = await envoyer('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: false });
    return r.result && r.result.result ? r.result.result.value : undefined;
  }
  await new Promise(function (r) { ws.onopen = r; });
  await envoyer('Network.enable'); await envoyer('Runtime.enable');

  var totalBlocs = 0, totalSortie = 0, totalExcept = 0, totalKO = 0;
  var msPremier = null;

  for (var i = 0; i < pages.length; i++) {
    var url = 'file:///' + path.resolve(RACINE, pages[i]).replace(/\\/g, '/');
    await envoyer('Page.navigate', { url: url });
    await dodo(1500);
    /* Les solutions d'exercices vivent dans un <details> replié : sans l'ouvrir, leurs
       blocs ne rendent rien et se liraient à tort comme des échecs. */
    await ev('document.querySelectorAll("details").forEach(function(d){d.open=true});true');
    await dodo(300);

    var n = await ev('document.querySelectorAll(\'[data-runner="py"] .code-block__try\').length');
    var ecartes = await ev('document.querySelectorAll(\'[data-runner-motif^="module-absent"]\').length');
    var totalPy = await ev('document.querySelectorAll("code.language-python").length');
    console.log(pages[i] + ' — ' + totalPy + ' bloc(s) Python : ' + n + ' avec bouton, ' +
                ecartes + ' écarté(s) pour module non embarqué');

    for (var b = 0; b < n; b++) {
      totalBlocs++;
      var t0 = Date.now();
      await ev('(function(){var e=document.querySelectorAll(\'[data-runner="py"]\')[' + b + '].querySelector(".code-block__try"); if(e){e.click();return true;} return false;})()');
      await dodo(250);
      var lance = await ev('(function(){var e=document.querySelectorAll(\'[data-runner="py"]\')[' + b + '].querySelector(".code-block__run"); if(e){e.click();return true;} return false;})()');
      if (!lance) { totalKO++; console.log('  bloc ' + (b + 1) + ' : KO  aucun bouton « Tester »'); continue; }
      /* Le premier bloc paie le démarrage de l'interpréteur (~1 s), les suivants non. */
      var texte = '', fini = false;
      for (var t2 = 0; t2 < 80 && !fini; t2++) {
        await dodo(250);
        texte = await ev('(function(){var o=document.querySelectorAll(\'[data-runner="py"]\')[' + b + '].querySelector(".runner-output"); return o?o.innerText:"";})()') || '';
        fini = !/Démarrage de Python/.test(texte) && texte.replace(/^Console Python\s*/i, '').trim().length > 0;
      }
      if (msPremier === null) msPremier = Date.now() - t0;
      var resume = texte.replace(/^Console Python\s*/i, '').replace(/\s+/g, ' ').trim().slice(0, 90);
      var pasDemarre = /n'a pas pu démarrer|Démarrage de Python/.test(texte) || !texte.trim();
      /* ⚠ Chercher « Error » dans le texte affiché est trop large : la leçon 15 imprime
         le Zen de Python, dont une ligne est « Errors should never pass silently. » —
         un programme parfaitement réussi se lisait comme une exception. On s'ancre donc
         sur la trace d'appels ou sur un nom d'erreur EN DÉBUT DE LIGNE. */
      var exception = /Traceback \(most recent call last\)|^[A-Za-z_]*(?:Error|Exception|Interrupt):/m.test(texte) || /⏱/.test(texte);
      if (pasDemarre) { totalKO++; }
      else if (exception) { totalExcept++; }
      else { totalSortie++; }
      console.log('  bloc ' + (b + 1) + ' : ' + (pasDemarre ? 'MOTEUR KO ' : exception ? 'exception ' : 'sortie    ') + resume);
    }
  }

  console.log('\n--- bilan ---');
  console.log('  blocs Python cliqués : ' + totalBlocs +
              '  ·  sortie obtenue : ' + totalSortie +
              '  ·  exception Python : ' + totalExcept +
              '  ·  moteur en échec : ' + totalKO);
  if (msPremier !== null) console.log('  premier bloc (démarrage compris) : ' + msPremier + ' ms');
  console.log('  requêtes DISTANTES : ' + distantes.length + (distantes.length ? ' -> ' + distantes.join(', ') : ' (aucune)'));
  ws.close(); proc.kill();
  process.exit(totalKO || distantes.length ? 1 : 0);
})();
