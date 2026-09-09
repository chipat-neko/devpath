'use strict';
/**
 * tools/preuves/repli-navigateur.js — CE QUE L'APPRENANT VOIT quand il clique sur un bloc
 * que le moteur rejoue derrière les blocs précédents (le REPLI, point B2b-7).
 *
 * `tools/verif-js.js` exécute les blocs dans un contexte `vm` de Node : il dit « aboutit »,
 * pas « affiche ceci ». Or tout ce chantier est né de cinq exemples dont la sortie annoncée
 * était fausse sous quatre vérificateurs verts. Un bloc qui « aboutit » sans rien rendre, ou
 * en rendant autre chose que ce que la page promet, serait le même défaut sous un autre nom.
 * Cette sonde ouvre les VRAIES pages dans un VRAI Chrome (`file://`, aucune requête), clique
 * les boutons pour de bon, et IMPRIME les lignes de la console de la page.
 *
 *   node tools/preuves/repli-navigateur.js pages/algo/lecon-17.html#3 pages/js/lecon-09.html#5
 *
 * La mécanique de pilotage (profil neuf, port dynamique, CDP nu) est celle de
 * `tools/verif-clic.js`, éprouvée au point A3 : port fixe et profil partagé faisaient varier
 * la couverture d'une exécution à l'autre sans que l'outil le dise.
 * Le RANG est celui de `verif-js.js` : le n-ième bloc `language-javascript` de la page,
 * écartés compris.
 */
var cp = require('child_process');
var path = require('path');
var http = require('http');
var net = require('net');
var crypto = require('crypto');
var fs = require('fs');
var os = require('os');

var RACINE = path.resolve(__dirname, '..', '..');
var CIBLES = process.argv.slice(2).filter(function (a) { return a.indexOf('--') !== 0; });
if (!CIBLES.length) {
  console.log('usage : node tools/preuves/repli-navigateur.js pages/<cours>/lecon-NN.html#RANG …');
  process.exit(2);
}
var CHROME = ['C:/Program Files/Google/Chrome/Application/chrome.exe',
              'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
              '/usr/bin/google-chrome', '/usr/bin/chromium'].find(function (p) { return fs.existsSync(p); });
if (!CHROME) { console.log('NON MESURÉ : Chrome introuvable.'); process.exit(2); }

var RACINE_PROFILS = path.join(os.tmpdir(), 'repli-navigateur');
var attendre = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
var get = function (u) {
  return new Promise(function (res, rej) {
    http.get(u, function (r) { var d = ''; r.on('data', function (c) { d += c; }); r.on('end', function () { res(JSON.parse(d)); }); }).on('error', rej);
  });
};
function profilNeuf(n) {
  var d = path.join(RACINE_PROFILS, String(process.pid) + '-' + n);
  fs.rmSync(d, { recursive: true, force: true });
  fs.mkdirSync(d, { recursive: true });
  return d;
}
function tuerArbre(proc) {
  try {
    if (process.platform === 'win32') cp.execFileSync('taskkill', ['/PID', String(proc.pid), '/T', '/F'], { stdio: 'ignore' });
    else proc.kill('SIGKILL');
  } catch (e) { /* déjà mort */ }
}
async function attendrePort(profil) {
  for (var t = 0; t < 60; t++) {
    await attendre(200);
    var f = path.join(profil, 'DevToolsActivePort');
    if (!fs.existsSync(f)) continue;
    var p = parseInt(String(fs.readFileSync(f, 'utf8')).split('\n')[0], 10);
    if (p > 0) return p;
  }
  return 0;
}
function connecter(wsUrl) {
  var u = new URL(wsUrl);
  var sock = net.connect(Number(u.port), u.hostname, function () {
    var key = crypto.randomBytes(16).toString('base64');
    sock.write('GET ' + u.pathname + ' HTTP/1.1\r\nHost: ' + u.host + '\r\nUpgrade: websocket\r\n' +
      'Connection: Upgrade\r\nSec-WebSocket-Key: ' + key + '\r\nSec-WebSocket-Version: 13\r\n\r\n');
  });
  var buf = Buffer.alloc(0), hs = false, id = 0, attentes = {};
  sock.on('error', function () { /* fermeture brutale de Chrome */ });
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
    evaluer: function (expression) {
      return new Promise(function (r) {
        var msg = Buffer.from(JSON.stringify({ id: ++id, method: 'Runtime.evaluate', params: { expression: expression, returnByValue: true } }));
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

/* Les cibles, groupées par page : un seul Chrome par page. */
var parPage = {};
CIBLES.forEach(function (c) {
  var m = /^(.*?)#(\d+)$/.exec(c);
  if (!m) { console.log('cible ignorée (il faut page#rang) : ' + c); return; }
  (parPage[m[1]] = parPage[m[1]] || []).push(Number(m[2]));
});

(async function () {
  console.log('repli-navigateur.js — ' + Object.keys(parPage).length + ' page(s), Chrome headless, file://\n');
  var n = 0, requetes = 0, sansErreur = 0, avecNote = 0, blocs = 0;
  for (var page of Object.keys(parPage)) {
    var profil = profilNeuf(++n);
    var proc = cp.spawn(CHROME, ['--headless=new', '--disable-gpu', '--no-first-run',
      '--remote-debugging-port=0', '--user-data-dir=' + profil,
      'file:///' + path.join(RACINE, page).replace(/\\/g, '/')], { stdio: 'ignore' });
    var port = await attendrePort(profil);
    if (!port) { console.log('NON MESURÉ : Chrome ne s\'est pas ouvert pour ' + page); tuerArbre(proc); continue; }
    var cibles = await get('http://127.0.0.1:' + port + '/json');
    var t = cibles.find(function (c) { return c.type === 'page' && /lecon-/.test(c.url || ''); });
    if (!t) { console.log('NON MESURÉ : page introuvable dans Chrome (' + page + ')'); tuerArbre(proc); continue; }
    var cx = connecter(t.webSocketDebuggerUrl);
    await attendre(1200);
    /* On attend un ÉTAT (les boutons posés, stables sur deux relevés), pas une durée. */
    var avant = -1;
    for (var w = 0; w < 30; w++) {
      var c1 = await cx.evaluer('document.querySelectorAll(".code-block__try").length');
      if (c1 > 0 && c1 === avant) break;
      avant = c1; await attendre(300);
    }
    /* Aucune requête distante ne doit partir d'une page du site. */
    var reseau = await cx.evaluer('performance.getEntriesByType("resource").filter(e=>!/^file:/.test(e.name)).length');
    requetes += Number(reseau) || 0;

    console.log('=== ' + page + ' ===');
    for (var rang of parPage[page]) {
      blocs++;
      var ok = await cx.evaluer('(()=>{const f=[...document.querySelectorAll("figure.code-block")]' +
        '.filter(x=>x.querySelector("code.language-javascript"))[' + (rang - 1) + '];' +
        'if(!f)return "absent";window.__f=f;const b=f.querySelector(".code-block__try");' +
        'if(!b)return "sans bouton";b.click();return "ok"})()');
      if (ok !== 'ok') { console.log('  #' + rang + ' — ' + ok); continue; }
      var vu = '';
      for (var s = 0; s < 25; s++) {
        await attendre(400);
        var enCours = await cx.evaluer('window.__f.querySelector("button.is-running")?1:0');
        vu = await cx.evaluer('(()=>{const o=window.__f.querySelector(".runner-output");if(!o)return "";' +
          'return [...o.querySelectorAll(".runner-output__line")].map(x=>' +
          '(x.classList.contains("runner-output__line--note")?"[note] ":' +
          '(x.classList.contains("runner-output__line--error")?"[ERREUR] ":"")) + x.textContent).join("\\n")})()') || '';
        if (!enCours && vu) break;
      }
      var lignes = vu ? vu.split('\n') : [];
      var note = lignes.some(function (l) { return l.indexOf('[note] ') === 0; });
      var erreur = lignes.some(function (l) { return l.indexOf('[ERREUR] ') === 0; });
      if (note) avecNote++;
      if (!erreur) sansErreur++;
      console.log('  #' + rang + (note ? '  (REPLI)' : '') + (erreur ? '  ⚠ ERREUR' : ''));
      lignes.forEach(function (l) { console.log('      ' + l); });
    }
    cx.sock.destroy();
    tuerArbre(proc);
    await attendre(300);
    try { fs.rmSync(profil, { recursive: true, force: true }); } catch (e) {}
  }
  console.log('\n=== RÉSUMÉ ===');
  console.log('  blocs cliqués ............ ' + blocs);
  console.log('  rejoués (note affichée) .. ' + avecNote);
  console.log('  sans la moindre erreur ... ' + sansErreur);
  console.log('  requêtes distantes ....... ' + requetes);
  process.exit(0);
})();
