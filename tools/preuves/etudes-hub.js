'use strict';
/**
 * tools/preuves/etudes-hub.js — les six études sont-elles ATTEIGNABLES ?
 *
 * POURQUOI CE SCRIPT. Pendant six passes, les études de cas n'ont été reliées qu'entre
 * elles : aucune page du site n'y menait, on ne les trouvait que par la recherche. Le
 * point A7 pose les chemins manquants — un hub, une entrée de menu, un encart sur les
 * cours concernés. Or ces chemins sont construits PAR DU JAVASCRIPT au chargement
 * (`initMainNav` pour le menu, `renderEtudeLink` pour les encarts) : ils n'existent dans
 * aucun fichier HTML, et aucun contrôle de source ne peut les voir. Il faut donc ouvrir
 * les pages pour de bon.
 *
 * CE QUI EST VÉRIFIÉ :
 *   1. le hub affiche autant de cartes qu'il y a d'études, et chacune mène à un fichier
 *      qui existe vraiment ;
 *   2. l'entrée « Études de cas » est dans le menu d'une page d'accueil, d'un cours,
 *      d'une leçon et d'une étude — c'est-à-dire aux quatre profondeurs de chemin ;
 *   3. les encarts apparaissent sur les cours concernés, avec le bon nombre, ET
 *      N'APPARAISSENT PAS sur un cours qui ne l'est pas — un encart qui se poserait
 *      partout ne prouverait rien ;
 *   4. le fil d'Ariane de chaque étude ramène au hub.
 *
 * Conditions de l'apprenant : `file://`, DNS coupé.
 *
 *   node tools/preuves/etudes-hub.js
 * Code de sortie 1 au moindre écart.
 */
var cp = require('child_process');
var path = require('path');
var http = require('http');
var fs = require('fs');

var RACINE = path.resolve(__dirname, '..', '..');
var PORT = 9367;
var CHROME = ['C:/Program Files/Google/Chrome/Application/chrome.exe',
              'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
              process.env.LOCALAPPDATA + '/Google/Chrome/Application/chrome.exe'].find(function (p) {
  try { return fs.existsSync(p); } catch (e) { return false; }
});
if (!CHROME) { console.log('Chrome introuvable, rien de mesuré.'); process.exit(0); }

/* Ce que la table de cours.js promet. Recopié ici EXPRÈS : si les deux listes
   divergent, c'est que quelqu'un a changé l'une sans l'autre, et la preuve doit le
   dire. Une preuve qui lirait la même source que le code contrôlé ne contrôle rien. */
var ATTENDU_PAR_COURS = {
  'pages/js/cours.html': 2,        // journal + moteur d'exercices
  'pages/algo/cours.html': 2,      // recherche + Euclide
  'pages/crypto/cours.html': 1,    // Euclide
  'pages/go/cours.html': 1,        // langage inconnu
  'pages/tests/cours.html': 1,     // réécriture
  'pages/patterns/cours.html': 2,  // moteur d'exercices + réécriture
  'pages/bdd/cours.html': 1,       // recherche
  'pages/compilation/cours.html': 1,
  'pages/cobol/cours.html': 0,     // TÉMOIN : aucun encart ne doit s'y poser
  'pages/ux/cours.html': 0,        // TÉMOIN
};

function dodo(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }
function get(url) {
  return new Promise(function (res, rej) {
    http.get(url, function (r) {
      var d = ''; r.on('data', function (c) { d += c; });
      r.on('end', function () { try { res(JSON.parse(d)); } catch (e) { rej(e); } });
    }).on('error', rej);
  });
}
function fileUrl(rel) { return 'file:///' + path.resolve(RACINE, rel).replace(/\\/g, '/'); }

(async function () {
  console.log('etudes-hub.js — les six études sont-elles atteignables ? · file:// · DNS coupé\n');

  var proc = cp.spawn(CHROME, ['--headless=new', '--remote-debugging-port=' + PORT, '--disable-gpu',
    '--no-first-run', '--disable-extensions', '--host-resolver-rules=MAP * ~NOTFOUND',
    '--user-data-dir=' + path.join(RACINE, 'scratchpad', '.chrome-preuve-hub'), 'about:blank'], { stdio: 'ignore' });

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
  var id = 0, attentes = new Map(), distantes = [], erreursConsole = [];
  ws.onmessage = function (e) {
    var m = JSON.parse(e.data);
    if (m.id && attentes.has(m.id)) { attentes.get(m.id)(m); attentes.delete(m.id); }
    if (m.method === 'Network.requestWillBeSent' && !/^(file|data|about|blob):/.test(m.params.request.url)) {
      distantes.push(m.params.request.url);
    }
    if (m.method === 'Runtime.exceptionThrown') erreursConsole.push('exception');
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

  async function ouvrir(rel, attendre) {
    await envoyer('Page.navigate', { url: fileUrl(rel) });
    for (var i = 0; i < 40; i++) {
      await dodo(200);
      var ok = await ev('document.readyState === "complete"' + (attendre ? ' && (' + attendre + ')' : ''));
      if (ok) return true;
    }
    return false;
  }

  var fautes = [];

  /* --- 1. Le hub ------------------------------------------------------------ */
  if (!(await ouvrir('pages/etudes.html', 'document.querySelectorAll(".frhub-card").length > 0'))) {
    fautes.push('pages/etudes.html ne se charge pas');
  }
  var cartes = await ev(
    '(function(){var out=[];document.querySelectorAll(".frhub-card").forEach(function(c){' +
    'var a=c.querySelector("a[href]");var h=c.querySelector(".frhub-card__title");' +
    'out.push({href:a?a.getAttribute("href"):null, titre:h?h.textContent.trim():null});});return out;})()') || [];
  var surDisque = fs.readdirSync(path.join(RACINE, 'pages'))
    .filter(function (f) { return /^etude-.*\.html$/.test(f); });
  console.log('hub — cartes : ' + cartes.length + '  ·  études sur le disque : ' + surDisque.length);
  if (cartes.length !== surDisque.length) {
    fautes.push('le hub montre ' + cartes.length + ' cartes pour ' + surDisque.length + ' études présentes');
  }
  var morts = cartes.filter(function (c) {
    return !c.href || !fs.existsSync(path.join(RACINE, 'pages', c.href));
  });
  console.log('hub — liens morts : ' + morts.length);
  if (morts.length) fautes.push(morts.length + ' carte(s) du hub mènent à un fichier inexistant');

  /* --- 2. Le menu, aux quatre profondeurs de chemin ------------------------ */
  /* Le menu est reconstruit par js/main.js à partir du href du lien « Accueil » : il
     faut donc l'éprouver à la racine, dans pages/, et dans pages/<cours>/. */
  var PROFONDEURS = ['index.html', 'pages/etudes.html', 'pages/go/cours.html', 'pages/go/lecon-01.html'];
  for (var p = 0; p < PROFONDEURS.length; p++) {
    await ouvrir(PROFONDEURS[p], 'document.querySelectorAll(".primary-nav a").length > 3');
    var lien = await ev(
      '(function(){var a=Array.from(document.querySelectorAll(".primary-nav a")).find(function(x){' +
      'return x.textContent.trim()==="Études de cas"});' +
      'if(!a) return null;' +
      'var href=a.getAttribute("href");' +
      'return {href:href, resolu:new URL(href, location.href).pathname};})()');
    if (!lien) {
      fautes.push('« Études de cas » absent du menu de ' + PROFONDEURS[p]);
      console.log('menu ' + PROFONDEURS[p] + ' : ABSENT');
      continue;
    }
    var disque = path.join(RACINE, decodeURIComponent(lien.resolu).replace(/^\/[A-Za-z]:\//, '').replace(/^\//, ''));
    var existe = /etudes\.html$/.test(lien.resolu);
    console.log('menu ' + PROFONDEURS[p] + ' : ' + lien.href + (existe ? '' : '  ← ne pointe pas vers etudes.html'));
    if (!existe) fautes.push('le lien du menu de ' + PROFONDEURS[p] + ' ne mène pas à etudes.html : ' + lien.href);
  }

  /* --- 3. Les encarts sur les cours, TÉMOINS COMPRIS ----------------------- */
  console.log('\nencarts « étude de cas » sur les pages de cours :');
  var noms = Object.keys(ATTENDU_PAR_COURS);
  for (var k = 0; k < noms.length; k++) {
    var page = noms[k], attendu = ATTENDU_PAR_COURS[page];
    if (!fs.existsSync(path.join(RACINE, page))) { fautes.push(page + ' n’existe pas'); continue; }
    await ouvrir(page, 'document.querySelector(".start-card") !== null');
    await dodo(150);
    var n = await ev('document.querySelectorAll(".start-card__etude").length');
    var vivants = await ev(
      '(function(){var m=0;document.querySelectorAll(".start-card__etude").forEach(function(a){' +
      'if(!/etude-.*\\.html$/.test(a.getAttribute("href")||""))m++});return m;})()');
    var etat = (n === attendu ? 'ok' : 'ATTENDU ' + attendu);
    console.log('  ' + page.padEnd(32) + n + ' encart(s)  ' + etat);
    if (n !== attendu) fautes.push(page + ' : ' + n + ' encart(s) d’étude, ' + attendu + ' attendu(s)');
    if (vivants) fautes.push(page + ' : ' + vivants + ' encart(s) au href invalide');
  }

  /* --- 4. Le retour depuis chaque étude ------------------------------------ */
  console.log('\nretour au hub depuis chaque étude :');
  for (var e2 = 0; e2 < surDisque.length; e2++) {
    var rel = 'pages/' + surDisque[e2];
    await ouvrir(rel, 'document.querySelector(".breadcrumb") !== null');
    var retour = await ev(
      '(function(){var a=Array.from(document.querySelectorAll(".breadcrumb a")).find(function(x){' +
      'return (x.getAttribute("href")||"")==="etudes.html"});return !!a;})()');
    console.log('  ' + surDisque[e2].padEnd(28) + (retour ? 'ok' : 'AUCUN lien vers le hub'));
    if (!retour) fautes.push(surDisque[e2] + ' : le fil d’Ariane ne ramène pas au hub');
  }

  /* --- Bilan --------------------------------------------------------------- */
  console.log('\n--- bilan ---');
  console.log('  requêtes DISTANTES : ' + distantes.length + (distantes.length ? ' -> ' + distantes.join(', ') : ' (aucune)'));
  console.log('  exceptions de page : ' + erreursConsole.length);
  console.log('  fautes : ' + fautes.length);
  fautes.forEach(function (f) { console.log('   ✗ ' + f); });
  if (!fautes.length && !distantes.length) {
    console.log('  ✓ les ' + surDisque.length + ' études sont atteignables depuis le menu, le hub et les cours concernés,');
    console.log('    et les deux cours témoins ne portent aucun encart.');
  }

  ws.close(); proc.kill();
  process.exit(fautes.length || distantes.length ? 1 : 0);
})();
