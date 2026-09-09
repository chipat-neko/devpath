'use strict';
/**
 * tools/preuves/sonde-clic-reseau.js — LA REQUÊTE PART-ELLE VRAIMENT ?
 *
 * Le point B2b-16 du CHANTIER-V17 a établi que 26 blocs « Tester » appellent `fetch` et que
 * `verif-js.js` les compte tous ABOUTIS (leur rejet est asynchrone, il n'atteint jamais le
 * try/catch du vérificateur). Avant d'arbitrer quoi que ce soit, il manquait UNE mesure :
 * au clic, dans un vrai navigateur, une requête part-elle réellement sur le réseau ?
 *
 * `verif-clic.js` et `repli-navigateur.js` répondent « 0 requête distante » — mais ils lisent
 * `performance.getEntriesByType("resource")`, qui n'enregistre PAS une requête qui échoue, et
 * qui ne voit pas ce qui sort d'un Web Worker. Leur zéro ne prouve donc rien ici.
 *
 * MÉTHODE, qui ne dépend d'aucune API de la page : Chrome est lancé avec
 *   --host-resolver-rules="MAP * 127.0.0.1:<port>,EXCLUDE localhost"
 * si bien que TOUTE résolution de nom du processus atterrit sur un serveur TCP que cette sonde
 * ouvre elle-même. Chaque tentative de connexion est donc comptée, d'où qu'elle vienne (page,
 * Worker, service worker), et RIEN ne sort de la machine : le port est mort côté protocole.
 * Le bruit de fond de Chrome est mesuré AVANT le premier clic et retiré.
 *
 *   node tools/preuves/sonde-clic-reseau.js pages/js/lecon-24.html#1 pages/js/lecon-24.html#2 …
 *   node tools/preuves/sonde-clic-reseau.js --liste       (les blocs réseau relevés par
 *                                                          sonde-reseau-sans-serveur.js)
 *
 * Le RANG est celui de `verif-js.js` : le n-ième bloc `language-javascript` de la page,
 * écartés compris. Sortie : par bloc, le nombre de connexions sortantes tentées et les lignes
 * que l'apprenant voit. Code 3 si la sonde s'arrête avant sa dernière ligne (garde-fou des
 * points B2b-13/14/16 : trois sondes se sont déjà tues en code 0).
 */
var cp = require('child_process');
var path = require('path');
var http = require('http');
var net = require('net');
var crypto = require('crypto');
var fs = require('fs');
var os = require('os');

var RACINE = path.resolve(__dirname, '..', '..');
var ARGS = process.argv.slice(2);

/* La liste par défaut : les blocs à bouton qui nomment fetch/WebSocket/caches, relevés par
   tools/preuves/sonde-reseau-sans-serveur.js et recopiés ici pour que la sonde soit rejouable
   telle quelle. Le compte rendu du chantier cite la sonde qui les a trouvés. */
var LISTE = [
  'pages/js/lecon-12.html#4',
  'pages/js/lecon-24.html#1', 'pages/js/lecon-24.html#2', 'pages/js/lecon-24.html#3',
  'pages/js/lecon-24.html#4', 'pages/js/lecon-24.html#5', 'pages/js/lecon-24.html#7',
  'pages/js/lecon-24.html#8', 'pages/js/lecon-24.html#9', 'pages/js/lecon-24.html#10',
  'pages/js/lecon-36.html#9', 'pages/js/lecon-36.html#11',
  'pages/js/lecon-47.html#3', 'pages/js/lecon-47.html#4', 'pages/js/lecon-47.html#9',
  'pages/js/lecon-49.html#12',
  'pages/js/lecon-57.html#6', 'pages/js/lecon-57.html#8', 'pages/js/lecon-57.html#9',
  'pages/js/lecon-63.html#3',
  'pages/html/lecon-42.html#4',
  'pages/projets-js/lecon-13.html#8',
  'pages/projets-js/lecon-14.html#2', 'pages/projets-js/lecon-14.html#7',
  'pages/nodejs/lecon-20.html#6',
  'pages/wasm/lecon-03.html#2',
  'pages/nodejs/lecon-17.html#3',
];
var CIBLES = ARGS.filter(function (a) { return a.indexOf('--') !== 0; });
if (!CIBLES.length) CIBLES = LISTE;

var CHROME = ['C:/Program Files/Google/Chrome/Application/chrome.exe',
              'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
              '/usr/bin/google-chrome', '/usr/bin/chromium'].find(function (p) { return fs.existsSync(p); });
if (!CHROME) { console.log('NON MESURÉ : Chrome introuvable.'); process.exit(2); }

/* Garde-fou : toute exception non rattrapée est IMPRIMÉE, jamais avalée. */
process.on('uncaughtException', function (e) { console.log('EXCEPTION : ' + (e && e.stack || e)); process.exit(3); });
process.on('unhandledRejection', function (e) { console.log('REJET : ' + (e && e.stack || e)); process.exit(3); });

var RACINE_PROFILS = path.join(os.tmpdir(), 'sonde-clic-reseau');
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
        var msg = Buffer.from(JSON.stringify({ id: ++id, method: 'Runtime.evaluate', params: { expression: expression, returnByValue: true, awaitPromise: false } }));
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

/* Le piège à connexions : tout nom résolu par Chrome arrive ici. On lit le premier paquet
   pour reconnaître un Host: HTTP en clair ou un SNI de ClientHello TLS, puis on coupe. */
var connexions = [];
/* Le nom visé, lu SANS deviner : l'en-tête Host d'une requête HTTP en clair, ou l'extension
   server_name d'un ClientHello TLS décodée champ par champ. Un premier jet cherchait le SNI
   par expression régulière et rendait « accounts.google.comzz » — un nom faux traverse le
   filtre du bruit et se compte alors comme une requête de leçon. */
function sniDeClientHello(b) {
  try {
    if (b[0] !== 0x16 || b[5] !== 0x01) return null;
    var p = 43;                                  /* record(5)+handshake(4)+version(2)+random(32) */
    p += 1 + b[p];                               /* session_id */
    p += 2 + b.readUInt16BE(p);                  /* cipher_suites */
    p += 1 + b[p];                               /* compression_methods */
    if (p + 2 > b.length) return null;
    var fin = p + 2 + b.readUInt16BE(p); p += 2; /* extensions */
    while (p + 4 <= Math.min(fin, b.length)) {
      var type = b.readUInt16BE(p), len = b.readUInt16BE(p + 2), d = p + 4;
      if (type === 0x0000 && d + 5 <= b.length) {
        var nl = b.readUInt16BE(d + 3);          /* list_len(2)+name_type(1)+name_len(2) */
        if (d + 5 + nl <= b.length) return b.slice(d + 5, d + 5 + nl).toString('latin1');
      }
      p = d + len;
    }
  } catch (e) { /* paquet tronqué : ce sera « illisible », jamais un nom inventé */ }
  return null;
}
function nomLu(premier) {
  var m = /\r\nHost:\s*([^\r\n]+)/i.exec(premier.toString('latin1'));
  if (m) return m[1].trim();
  if (premier[0] === 0x16) {
    var sni = sniDeClientHello(premier);
    return sni ? sni + ' (SNI)' : 'TLS (nom illisible)';
  }
  return 'inconnu';
}
/* Chrome parle tout seul à ses propres services (accounts.google.com, mises à jour…) même avec
   --disable-background-networking : ce bruit est nommé, donc identifiable, et compté À PART.
   Aucun nom de ce genre n'apparaît dans une leçon du site. */
var BRUIT = /(^|\.)(google\.com|googleapis\.com|gstatic\.com|googleusercontent\.com|gvt1\.com|gvt2\.com|google-analytics\.com|doubleclick\.net|googlezip\.net|chrome\.com)$/i;
/* `wpad` est la découverte de proxy de Windows, déclenchée par la pile réseau et non par la
   page ; les connexions muettes et les paquets illisibles ne portent aucun nom de leçon. */
var BRUIT_SYSTEME = /^(wpad|localhost|\(connexion sans données\)|inconnu|TLS \(nom illisible\))$/i;
function estDuBruit(nom) {
  var n = String(nom).replace(/ \(SNI\)$/, '');
  return BRUIT.test(n) || BRUIT_SYSTEME.test(n);
}

function ouvrirPiege() {
  return new Promise(function (res) {
    var srv = net.createServer(function (sock) {
      var enregistre = false;
      sock.on('error', function () {});
      sock.once('data', function (b) { enregistre = true; connexions.push({ t: Date.now(), nom: nomLu(b) }); sock.destroy(); });
      setTimeout(function () { if (!enregistre) { connexions.push({ t: Date.now(), nom: '(connexion sans données)' }); sock.destroy(); } }, 1500);
    });
    srv.on('error', function () {});
    srv.listen(0, '127.0.0.1', function () { res({ srv: srv, port: srv.address().port }); });
  });
}

var parPage = {};
CIBLES.forEach(function (c) {
  var m = /^(.*?)#(\d+)$/.exec(c);
  if (!m) { console.log('cible ignorée (il faut page#rang) : ' + c); return; }
  (parPage[m[1]] = parPage[m[1]] || []).push(Number(m[2]));
});

(async function () {
  var piege = await ouvrirPiege();
  console.log('sonde-clic-reseau.js — ' + Object.keys(parPage).length + ' page(s), ' + CIBLES.length +
              ' bloc(s), Chrome headless, file://');
  console.log('  toute résolution de nom est renvoyée vers 127.0.0.1:' + piege.port + ' (rien ne sort de la machine)\n');
  var n = 0, blocs = 0, avecReseau = 0, totalConnexions = 0, bruitTotal = 0, noms = {};
  for (var page of Object.keys(parPage)) {
    var profil = profilNeuf(++n);
    var proc = cp.spawn(CHROME, ['--headless=new', '--disable-gpu', '--no-first-run',
      '--no-default-browser-check', '--disable-background-networking', '--disable-sync',
      '--disable-component-update', '--disable-default-apps', '--metrics-recording-only',
      '--host-resolver-rules=MAP * 127.0.0.1:' + piege.port + ',EXCLUDE localhost',
      '--remote-debugging-port=0', '--user-data-dir=' + profil,
      'file:///' + path.join(RACINE, page).replace(/\\/g, '/')], { stdio: 'ignore' });
    var port = await attendrePort(profil);
    if (!port) { console.log('NON MESURÉ : Chrome ne s\'est pas ouvert pour ' + page); tuerArbre(proc); continue; }
    var cibles = await get('http://127.0.0.1:' + port + '/json');
    var t = cibles.find(function (c) { return c.type === 'page' && /lecon-/.test(c.url || ''); });
    if (!t) { console.log('NON MESURÉ : page introuvable dans Chrome (' + page + ')'); tuerArbre(proc); continue; }
    var cx = connecter(t.webSocketDebuggerUrl);
    await attendre(1200);
    /* On attend un ÉTAT (boutons posés, stables sur deux relevés), pas une durée. */
    var avant = -1;
    for (var w = 0; w < 30; w++) {
      var c1 = await cx.evaluer('document.querySelectorAll(".code-block__try").length');
      if (c1 > 0 && c1 === avant) break;
      avant = c1; await attendre(300);
    }
    await attendre(1500);                       /* le bruit de fond éventuel du navigateur */
    var bruit = connexions.length; bruitTotal += bruit;   /* avant tout clic */
    var connexionsAvant = connexions.slice();
    connexions.length = 0;

    var horsBruitAvant = connexionsAvant.filter(function (c) { return !estDuBruit(c.nom); });
    console.log('=== ' + page + ' ===  (avant tout clic : ' + bruit + ' connexion(s), dont ' +
                horsBruitAvant.length + ' hors bruit navigateur)');
    horsBruitAvant.forEach(function (c) { console.log('  ⚠ AU CHARGEMENT DE LA PAGE → ' + c.nom); });
    for (var rang of parPage[page]) {
      blocs++;
      connexions.length = 0;
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
      await attendre(1200);                     /* laisser le temps à une connexion tardive */
      var toutes = connexions.slice();
      var vues = toutes.filter(function (c) { return !estDuBruit(c.nom); });
      var bruitPendant = toutes.length - vues.length;
      bruitTotal += bruitPendant;
      vues.forEach(function (c) { noms[c.nom] = (noms[c.nom] || 0) + 1; });
      totalConnexions += vues.length;
      if (vues.length) avecReseau++;
      var vide = !vu || !vu.trim() || /aucune sortie/.test(vu);
      console.log('  #' + rang + '  connexions sortantes : ' + vues.length +
                  (vues.length ? '  ⚠ LE RÉSEAU EST APPELÉ' : '  (aucune)') +
                  (bruitPendant ? '   [+' + bruitPendant + ' de bruit navigateur]' : '') +
                  (vide ? '   — RIEN À L\'ÉCRAN' : ''));
      vues.forEach(function (c) { console.log('      → ' + c.nom); });
      (vu ? vu.split('\n') : ['(aucune sortie)']).forEach(function (l) { console.log('      ' + l); });
    }
    cx.sock.destroy();
    tuerArbre(proc);
    await attendre(300);
    try { fs.rmSync(profil, { recursive: true, force: true }); } catch (e) {}
  }
  console.log('\n=== RÉSUMÉ ===');
  console.log('  blocs cliqués ................... ' + blocs);
  console.log('  blocs qui appellent le réseau ... ' + avecReseau);
  console.log('  connexions sortantes tentées .... ' + totalConnexions);
  console.log('  bruit de fond du navigateur ..... ' + bruitTotal + ' (hors clic, toutes pages)');
  Object.keys(noms).sort().forEach(function (k) { console.log('      ' + k + '  ×' + noms[k]); });
  piege.srv.close();
  console.log('\n(sonde arrivée à sa dernière ligne)');
  /* ⚠️ CE N'EST PAS UNE SONDE DE PRÉPARATION, C'EST UN CONTRÔLE : le verdict est binaire et
     il peut ROUGIR. Le site promet qu'aucune page ne parle au réseau ; une seule connexion
     sortante au clic dément cette promesse, et c'est exactement ce qui a été mesuré avant la
     coupure du point B2b-16 (8 connexions, 4 blocs). Zéro attendu, sans référence à tenir à
     jour : tout autre chiffre est une régression. */
  if (totalConnexions > 0) {
    console.log('ÉCHEC : ' + totalConnexions + ' connexion(s) sortante(s) depuis ' + avecReseau +
                ' bloc(s). Le site ne doit en tenter AUCUNE.');
    process.exit(1);
  }
  console.log('OK : aucune connexion sortante sur ' + blocs + ' bloc(s) cliqué(s).');
  process.exit(0);
})();
