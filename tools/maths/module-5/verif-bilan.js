/* Le QCM bilan est-il RENDU, et son juge dit-il juste ?
   -----------------------------------------------------
   Un bloc `data-quiz-bilan` valide en JSON ne prouve rien : c'est `initQuizBilan`
   de js/lecon.js qui le transforme en questions cliquables, et lui seul décide
   si les options sont mélangées, si la bonne réponse est reconnue et si
   l'explication s'affiche. Un bloc bien formé mais jamais lu passerait tous les
   contrôles de fichier.

   Ce script ouvre la page dans un vrai Chrome, compte les questions rendues,
   COCHE la bonne réponse de chacune, et vérifie que le score annoncé est parfait.
   Il coche ensuite une mauvaise réponse pour s'assurer que le juge sait dire non.

   Usage : node tools/maths/module-5/verif-bilan.js [page.html …] */
'use strict';
var cp = require('child_process');
var path = require('path');
var http = require('http');
var net = require('net');
var crypto = require('crypto');
var fs = require('fs');
var profilChrome = require('../../lib/profil-chrome.js');

var RACINE = path.join(__dirname, '..', '..', '..');
var PORT = 9341;
var PAGES = process.argv.slice(2).filter(function (a) { return a.indexOf('--') !== 0; });
if (!PAGES.length) PAGES = ['pages/maths/lecon-13.html', 'pages/maths/lecon-06.html'];

var CHROME = ['C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  '/usr/bin/google-chrome', '/usr/bin/chromium'].find(function (p) { return fs.existsSync(p); });
if (!CHROME) { console.log('Chrome introuvable, rien de mesuré.'); process.exit(0); }

process.on('uncaughtException', function (e) {
  console.log('ÉCHEC TECHNIQUE, rien n a pu être mesuré : ' + (e && e.message ? e.message : e));
  process.exit(2);
});

var attendre = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
var get = function (u) {
  return new Promise(function (res, rej) {
    http.get(u, function (r) { var d = ''; r.on('data', function (c) { d += c; }); r.on('end', function () { res(JSON.parse(d)); }); }).on('error', rej);
  });
};
function connecter(wsUrl) {
  var u = new URL(wsUrl);
  var sock = net.connect(Number(u.port), u.hostname, function () {
    var key = crypto.randomBytes(16).toString('base64');
    sock.write('GET ' + u.pathname + ' HTTP/1.1\r\nHost: ' + u.host + '\r\nUpgrade: websocket\r\n' +
      'Connection: Upgrade\r\nSec-WebSocket-Key: ' + key + '\r\nSec-WebSocket-Version: 13\r\n\r\n');
  });
  var buf = Buffer.alloc(0), hs = false, id = 0, attentes = {};
  sock.on('error', function () { /* Chrome coupe la socket en sortant */ });
  sock.on('data', function (chunk) {
    buf = Buffer.concat([buf, chunk]);
    if (!hs) { var i = buf.indexOf('\r\n\r\n'); if (i < 0) return; hs = true; buf = buf.slice(i + 4); }
    while (buf.length >= 2) {
      var len = buf[1] & 127, off = 2;
      if (len === 126) { len = buf.readUInt16BE(2); off = 4; }
      else if (len === 127) { len = Number(buf.readBigUInt64BE(2)); off = 10; }
      if (buf.length < off + len) return;
      var m;
      try { m = JSON.parse(buf.slice(off, off + len).toString()); } catch (e) { m = {}; }
      buf = buf.slice(off + len);
      if (m.id && attentes[m.id]) { attentes[m.id](m.result); delete attentes[m.id]; }
    }
  });
  return {
    sock: sock,
    evaluer: function (expr) {
      return new Promise(function (r) {
        var msg = Buffer.from(JSON.stringify({ id: ++id, method: 'Runtime.evaluate', params: { expression: expr, returnByValue: true, awaitPromise: true } }));
        attentes[id] = function (res) { r(res && res.result ? res.result.value : undefined); };
        var mk = crypto.randomBytes(4), e;
        if (msg.length < 126) e = Buffer.from([0x81, 0x80 | msg.length]);
        else if (msg.length < 65536) { e = Buffer.alloc(4); e[0] = 0x81; e[1] = 0xfe; e.writeUInt16BE(msg.length, 2); }
        else { e = Buffer.alloc(10); e[0] = 0x81; e[1] = 0xff; e.writeBigUInt64BE(BigInt(msg.length), 2); }
        var c = Buffer.from(msg);
        for (var k = 0; k < c.length; k++) c[k] ^= mk[k % 4];
        sock.write(Buffer.concat([e, mk, c]));
      });
    },
  };
}

/* Cocher la bonne option de chaque question, en la retrouvant par son TEXTE :
   lecon.js mélange les options à l'affichage, donc l'ordre du JSON ne vaut plus.
   On lit le JSON de la page, on en tire le libellé attendu, et on clique dessus. */
function sonde(justes) {
  return "(function () {" +
    " var bloc = document.querySelector('script[data-quiz-bilan]');" +
    " if (!bloc) return { erreur: 'aucun bloc data-quiz-bilan' };" +
    " var data = JSON.parse(bloc.textContent);" +
    /* justes = true  -> le libellé de la bonne réponse
       justes = false -> celui d'un distracteur, le premier qui n'est pas la bonne */
    " var vise = data.map(function (q) { return " + (justes ? "q.a[q.correct]" : "q.a[(q.correct + 1) % q.a.length]") + "; });" +
    " var cartes = Array.from(document.querySelectorAll('.quiz-bilan .quiz__q'));" +
    " var res = { questions: cartes.length, attendues: vise.length, cliques: 0, introuvables: [] };" +
    " cartes.forEach(function (c, i) {" +
    "   var opts = Array.from(c.querySelectorAll('button, label, li'));" +
    "   var cible = opts.filter(function (o) { return o.textContent.replace(/\\s+/g, ' ').trim().indexOf(vise[i].replace(/\\s+/g, ' ').trim()) >= 0; })[0];" +
    "   if (!cible) { res.introuvables.push(i + 1); return; }" +
    "   cible.click(); res.cliques++;" +
    " });" +
    " res.texte = document.body.textContent.replace(/\\s+/g, ' ');" +
    " return res;" +
    "})()";
}

/* Le score affiché, lu dans le texte de la page, pour un dénominateur donné. */
function scoreLu(texte, sur) {
  var trouves = (texte.match(/(\d+)\s*\/\s*(\d+)/g) || []).filter(function (x) {
    return x.replace(/\s/g, '').split('/')[1] === String(sur);
  });
  return trouves.map(function (x) { return x.replace(/\s/g, ''); });
}

(async function () {
  console.log('verif-bilan.js — le QCM bilan, rendu et corrigé dans un vrai Chrome\n');
  var pbs = 0;
  for (var p = 0; p < PAGES.length; p++) {
    var page = PAGES[p];
    var url = 'file:///' + path.resolve(RACINE, page).replace(/\\/g, '/');
    var proc = cp.spawn(CHROME, ['--headless=new', '--remote-debugging-port=' + PORT, '--disable-gpu',
      '--allow-file-access-from-files', '--no-first-run', '--disable-extensions',
      '--user-data-dir=' + profilChrome.neuf('bilan'), url], { stdio: 'ignore' });
    var cible = null;
    for (var i = 0; i < 60 && !cible; i++) {
      await attendre(250);
      try {
        var liste = await get('http://127.0.0.1:' + PORT + '/json/list');
        cible = liste.filter(function (t) { return t.type === 'page' && t.url.indexOf('lecon') >= 0; })[0];
      } catch (e) { /* pas encore prêt */ }
    }
    if (!cible) { proc.kill(); console.log('  ' + page + ' : Chrome n a pas ouvert la page'); pbs++; continue; }
    var cdp = connecter(cible.webSocketDebuggerUrl);
    await attendre(2600);
    var vu = await cdp.evaluer(sonde(true));

    /* Passe inverse : on recharge, et on coche un distracteur partout. */
    await cdp.evaluer('localStorage.clear(); location.reload(); "rechargé"');
    await attendre(2600);
    var faux = await cdp.evaluer(sonde(false));

    proc.kill();
    try { cdp.sock.destroy(); } catch (e) { /* déjà fermée */ }
    await attendre(600);            /* le port doit être libéré avant la page suivante */

    if (!vu || vu.erreur) { console.log('  ' + page + ' : ' + ((vu && vu.erreur) || 'rien rendu')); pbs++; continue; }
    var score = scoreLu(vu.texte, vu.attendues);
    var parfait = score.indexOf(vu.attendues + '/' + vu.attendues) >= 0;
    var scoreFaux = faux && faux.texte ? scoreLu(faux.texte, faux.attendues) : [];
    var nul = scoreFaux.indexOf('0/' + vu.attendues) >= 0;
    console.log('  ' + page.split('/').pop());
    console.log('    questions déclarées ... : ' + vu.attendues);
    console.log('    questions rendues ..... : ' + vu.questions);
    console.log('    bonnes options cliquées : ' + vu.cliques + (vu.introuvables.length ? '  (introuvables : ' + vu.introuvables.join(', ') + ')' : ''));
    console.log('    score parfait affiché . : ' + parfait + (score.length ? '   [' + score.join(' ') + ']' : ''));
    console.log('    témoin négatif (0 juste) : ' + nul + (scoreFaux.length ? '   [' + scoreFaux.join(' ') + ']' : ''));
    if (vu.questions !== vu.attendues) { console.log('    ✗ toutes les questions ne sont pas rendues'); pbs++; }
    else if (vu.cliques !== vu.attendues) { console.log('    ✗ une bonne option n a pas été retrouvée dans le rendu'); pbs++; }
    else if (!parfait) { console.log('    ✗ le juge n annonce pas un score parfait alors que tout est juste'); pbs++; }
    else if (!nul) { console.log('    ✗ le juge ne sait pas dire NON : un distracteur coché partout ne donne pas 0'); pbs++; }
    console.log('');
  }
  if (pbs) { console.log(pbs + ' page(s) en défaut.'); process.exit(1); }
  console.log('Chaque QCM bilan est rendu en entier ; son juge reconnaît toutes les bonnes réponses,');
  console.log('et il refuse un distracteur coché partout.');
})();
