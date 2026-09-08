'use strict';
/**
 * tools/preuves/sql-lecon.js — Cliquer, pour de vrai, sur les boutons « ▶ Exécuter »
 * SQL d'une leçon du site, en `file://` et RÉSEAU COUPÉ.
 *
 * Pourquoi ce script plutôt qu'une page de démonstration : `tools/preuves/sqljs.html`
 * prouve que le moteur tourne, mais pas que `js/runner.js` le branche correctement sur
 * une leçon réelle — profondeur des chemins, résolution de la racine du site, base de
 * démonstration préchargée, rendu du tableau de résultats. C'est ce que celui-ci mesure.
 *
 *   node tools/preuves/sql-lecon.js [pages/sql/lecon-04.html …]
 * Sans argument : un échantillon de leçons SQL. Code de sortie 1 si un bloc échoue ou
 * si Chrome a émis la moindre requête distante.
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
  pages = ['pages/sql/lecon-03.html', 'pages/sql/lecon-06.html', 'pages/sql/lecon-10.html',
           'pages/bdd/lecon-05.html'].filter(function (p) { return fs.existsSync(path.join(RACINE, p)); });
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
  console.log('sql-lecon.js — ' + pages.length + ' leçon(s) · file:// · DNS coupé · SANS --allow-file-access-from-files\n');
  var profilCh = path.join(RACINE, 'scratchpad', '.chrome-preuve-sql');
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

  var totalBlocs = 0, totalOK = 0, totalKO = 0, totalMoteurKO = 0;

  for (var i = 0; i < pages.length; i++) {
    var url = 'file:///' + path.resolve(RACINE, pages[i]).replace(/\\/g, '/');
    await envoyer('Page.navigate', { url: url });
    await dodo(1500);
    /* Les solutions d'exercices vivent dans un <details> replié : sans l'ouvrir, leurs
       blocs ne rendent rien et se liraient à tort comme des échecs. L'apprenant, lui,
       clique sur « Voir une solution » avant d'essayer. */
    await ev('document.querySelectorAll("details").forEach(function(d){d.open=true});true');
    await dodo(300);

    var n = await ev('document.querySelectorAll(\'[data-runner="sql"] .code-block__try\').length');
    console.log(pages[i] + ' — ' + n + ' bloc(s) SQL avec bouton');
    /* Le bouton « Serveur requis » porterait la classe --offline : sa présence
       signifierait que la garde HTTP_OK n'a pas été levée. */
    var offline = await ev('document.querySelectorAll(\'.code-block__try--offline\').length');
    if (offline) { console.log('  ⚠ ' + offline + ' bouton(s) « Serveur requis » — la garde HTTP_OK est encore active'); totalKO += offline; }

    /* On adresse les blocs par leur index dans [data-runner="sql"] : ouvrir un éditeur
       ne change pas cet ordre, alors que compter les boutons, si — le premier clic
       remplace « Exécuter » (.code-block__try) par .code-block__run. */
    for (var b = 0; b < n; b++) {
      totalBlocs++;
      var ouvert = await ev('(function(){var e=document.querySelectorAll(\'[data-runner="sql"]\')[' + b + '].querySelector(".code-block__try"); if(e){e.click();return true;} return false;})()');
      await dodo(250);
      var lance = await ev('(function(){var e=document.querySelectorAll(\'[data-runner="sql"]\')[' + b + '].querySelector(".code-block__run"); if(e){e.click();return true;} return false;})()');
      if (!lance) { totalKO++; console.log('  bloc ' + (b + 1) + ' : KO  aucun bouton « Exécuter » (ouverture : ' + ouvert + ')'); continue; }
      /* SQLite se charge au premier bloc (décodage du base64) : on laisse du temps. */
      var texte = '', fini = false;
      for (var t2 = 0; t2 < 40 && !fini; t2++) {
        await dodo(250);
        texte = await ev('(function(){var o=document.querySelectorAll(\'[data-runner="sql"]\')[' + b + '].querySelector(".runner-output"); return o?o.innerText:"";})()') || '';
        fini = !/Chargement/.test(texte) && /ligne|exécutée|no such|Erreur|erreur|error|failed|n\'a pas pu|⏱/.test(texte);
      }
      var resume = texte.replace(/\s+/g, ' ').replace(/^RÉSULTAT SQL /i, '').trim().slice(0, 100);
      /* Un CREATE ou un INSERT ne renvoie aucune ligne : « Requête exécutée » est un
         succès au même titre qu'un tableau de résultats. Seule une erreur SQLite ou un
         moteur qui ne charge pas comptent comme échec. */
      /* ⚠️ TROIS ISSUES, ET NON DEUX — la distinction est ce qui rend ce script utilisable
         comme étape de `verif.js`. Un bloc qui rend « no such column » n'est PAS une panne :
         c'est SQLite qui fait son travail sur un exemple de leçon volontairement fautif, ou
         sur un schéma déclaré ailleurs dans la page. La seule vraie panne est le MOTEUR qui
         ne démarre pas (ou le délai dépassé) — c'est elle, et elle seule, qui doit rougir. */
      var moteurKO = /n'a pas pu|⏱/.test(texte) || !texte;
      var bon = /\d+ ligne|Requête exécutée/.test(texte) && !moteurKO;
      if (moteurKO) totalMoteurKO++;
      if (bon) totalOK++; else totalKO++;
      console.log('  bloc ' + (b + 1) + ' : ' + (moteurKO ? 'MOTEUR KO ' : (bon ? 'OK  ' : 'sql ')) + resume);
    }
  }

  console.log('\n--- bilan ---');
  console.log('  blocs SQL cliqués : ' + totalBlocs + '  ·  résultats obtenus : ' + totalOK +
              '  ·  erreurs SQL du contenu : ' + (totalKO - totalMoteurKO) +
              '  ·  MOTEUR EN ÉCHEC : ' + totalMoteurKO);
  console.log('  requêtes DISTANTES : ' + distantes.length + (distantes.length ? ' -> ' + distantes.join(', ') : ' (aucune)'));
  /* Un résultat NUL est aussi une panne : si pas un seul bloc n'aboutit alors que la page en
     porte, le moteur est mort d'une façon que le message n'a pas dite — c'est exactement ce qui
     s'est produit le 2026-09-02 (41 blocs cliqués, 0 résultat). */
  var muet = totalBlocs > 0 && totalOK === 0;
  if (muet) console.log("  ⚠ AUCUN bloc n'a abouti : le moteur ne fonctionne pas.");
  ws.close(); proc.kill();
  process.exit(totalMoteurKO || muet || distantes.length ? 1 : 0);
})();
