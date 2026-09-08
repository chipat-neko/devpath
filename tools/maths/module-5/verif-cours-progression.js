/* La page de cours, vue par un apprenant QUI A DÉJÀ TRAVAILLÉ.
   ---------------------------------------------------------------
   Une page de cours mesurée avec un localStorage VIDE ment : la barre de
   progression, le compte « x sur 13 » et les puces de leçon terminée
   n'apparaissent qu'à partir d'une progression semée. On sème donc
   `syntaxe-progress` AVANT de charger la page, puis on lit ce que la page
   affiche vraiment.

   Ce que ce contrôle voit et qu'aucun grep ne verrait : les 13 entrées de la
   liste des leçons, leurs liens et leur état sont écrits par cours.js à
   l'exécution. Le fichier cours.html, lui, ne contient qu'un <div> vide.

   Le client CDP est celui de tools/verif-clic.js, repris tel quel : pas de
   dépendance installée, une socket et une poignée de main WebSocket à la main.

   Usage : node tools/maths/module-5/verif-cours-progression.js */
'use strict';
var cp = require('child_process');
var path = require('path');
var http = require('http');
var net = require('net');
var crypto = require('crypto');
var fs = require('fs');
var profilChrome = require('../../lib/profil-chrome.js');
var portChrome = require('../../lib/port-chrome.js');

var RACINE = path.join(__dirname, '..', '..', '..');
/* Le port n'est plus ecrit en dur : Chrome le choisit et l'annonce dans son
   profil (point A6 du chantier V17). Six paires d'outils partageaient un meme
   numero, et un port deja pris fait mesurer LA PAGE D'UN AUTRE sans rien dire.
   Voir tools/lib/port-chrome.js. */
var PORT = 0;
/* Paramétrable depuis la ligne de commande, pour servir à d'autres cours que
   « maths » sans se recopier :
     node tools/maths/module-5/verif-cours-progression.js --cours=doc --terminees=1 --attendues=1
   Sans argument, les valeurs d'origine du cours de mathématiques sont reprises. */
var ARG = function (nom, defaut) {
  var t = process.argv.slice(2).find(function (a) { return a.indexOf('--' + nom + '=') === 0; });
  return t ? t.split('=').slice(1).join('=') : defaut;
};
var COURS = ARG('cours', 'maths');
var ATTENDUES = Number(ARG('attendues', 13));
var NB_TERMINEES = Number(ARG('terminees', 5));
var PAGE = 'pages/' + COURS + '/cours.html';
var TERMINEES = [];
for (var iT = 1; iT <= NB_TERMINEES; iT++) {
  TERMINEES.push('lecon-' + String(iT).padStart(2, '0') + '.html');
}

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
  sock.on('error', function () { /* Chrome coupe la socket en sortant : sans effet */ });
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
  function envoyer(method, params) {
    return new Promise(function (r) {
      var msg = Buffer.from(JSON.stringify({ id: ++id, method: method, params: params }));
      attentes[id] = function (res) { r(res); };
      var mk = crypto.randomBytes(4), e;
      if (msg.length < 126) e = Buffer.from([0x81, 0x80 | msg.length]);
      else if (msg.length < 65536) { e = Buffer.alloc(4); e[0] = 0x81; e[1] = 0xfe; e.writeUInt16BE(msg.length, 2); }
      else { e = Buffer.alloc(10); e[0] = 0x81; e[1] = 0xff; e.writeBigUInt64BE(BigInt(msg.length), 2); }
      var c = Buffer.from(msg);
      for (var k = 0; k < c.length; k++) c[k] ^= mk[k % 4];
      sock.write(Buffer.concat([e, mk, c]));
    });
  }
  return {
    sock: sock,
    evaluer: function (expr) {
      return envoyer('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true })
        .then(function (res) { return res && res.result ? res.result.value : undefined; });
    },
    naviguer: function (url) { return envoyer('Page.navigate', { url: url }); },
  };
}

(async function () {
  console.log('verif-cours-progression.js — la page de cours avec une progression SEMÉE\n');
  var url = 'file:///' + path.resolve(RACINE, PAGE).replace(/\\/g, '/');
  var profilCh = profilChrome.neuf('progression');
  portChrome.oublier(profilCh);
  var proc = cp.spawn(CHROME, ['--headless=new', '--remote-debugging-port=0', '--disable-gpu',
    '--allow-file-access-from-files', '--no-first-run', '--disable-extensions',
    '--user-data-dir=' + profilCh, url], { stdio: 'ignore' });
  try { PORT = await portChrome.attendre(profilCh); }
  catch (ePort) { console.log(ePort.message); try { proc.kill(); } catch (e2) {} process.exit(2); }

  var cible = null;
  for (var i = 0; i < 60 && !cible; i++) {
    await attendre(250);
    try {
      var liste = await get('http://127.0.0.1:' + PORT + '/json/list');
      cible = liste.filter(function (t) { return t.type === 'page' && /cours\.html/.test(t.url); })[0];
    } catch (e) { /* pas encore prêt */ }
  }
  if (!cible) { proc.kill(); console.log('Chrome n a pas ouvert la page.'); process.exit(2); }

  var cdp = connecter(cible.webSocketDebuggerUrl);
  await attendre(900);

  /* 1. on sème la progression, puis on RECHARGE : cours.js la lit au chargement. */
  /* Le format attendu par js/cours.js : un objet par cours, dont les CLÉS sont
     les fichiers de leçon. Une liste ne marche pas — la première version de ce
     script en semait une, et la page affichait 0 / 13 sans rien signaler. */
  var seme = {};
  TERMINEES.forEach(function (f) { seme[f] = true; });
  var paquet = {};
  paquet[COURS] = seme;
  await cdp.evaluer('localStorage.setItem("syntaxe-progress", JSON.stringify(' +
    JSON.stringify(paquet) + ')); "sémé"');
  await cdp.naviguer(url);
  /* ON ATTEND UN ETAT, PAS UNE DUREE (point A6 du chantier V17, 2026-09-09).
     Ici dormait `await attendre(1400)`. Le 2026-09-09, cet outil a rendu « liens de
     lecon : 0 au lieu de 13 · la barre affiche (rien) · le badge ne mentionne pas
     les 13 lecons : «  » » — titre vide, badge vide, TOUT vide : la page n'avait
     simplement pas fini de se recharger. Un rouge qui accuse le site d'un defaut
     qu'il n'a pas est pire qu'un silence. On attend donc que le rechargement soit
     termine et que le conteneur des modules existe ; s'il n'apparait pas, RIEN n'a
     pu etre mesure (code 2). Un conteneur present mais VIDE reste une faute : c'est
     precisement ce que cet outil vient mesurer. */
  var prete = false;
  for (var tP = 0; tP < 150 && !prete; tP++) {
    await attendre(100);
    try {
      prete = await cdp.evaluer('document.readyState === "complete" && ' +
        '!!document.querySelector("[data-course-modules]")');
    } catch (e) { prete = false; }
  }
  if (!prete) {
    console.log('verif-cours-progression.js — ' + PAGE + ' n a pas fini de se recharger en 15 s :');
    console.log('  RIEN N A PU ETRE MESURE (ce n est pas une faute du site).');
    proc.kill();
    process.exit(2);
  }

  var vu = await cdp.evaluer('(function () {' +
    ' var liens = Array.from(document.querySelectorAll("[data-course-modules] a[href]"));' +
    ' var items = Array.from(document.querySelectorAll("[data-course-modules] li"));' +
    ' return {' +
    '   liens: liens.map(function (a) { return a.getAttribute("href"); }),' +
    '   morts: liens.filter(function (a) { var h = a.getAttribute("href"); return !h || h === "#"; }).length,' +
    '   items: items.length,' +
    '   bientot: items.filter(function (l) { return /bient/i.test(l.textContent); }).length,' +
    '   faits: items.filter(function (l) { return /(termin|fait|✓)/i.test(l.textContent); }).length,' +
    '   stats: (document.querySelector("[data-course-stats]") || {}).textContent || "",' +
    '   progression: (document.querySelector("[data-course-progress]") || {}).textContent || "",' +
    '   badge: (document.querySelector(".badge") || {}).textContent || "",' +
    '   titre: (document.querySelector("h1") || {}).textContent || "",' +
    '   stockage: localStorage.getItem("syntaxe-progress") || ""' +
    ' }; })()');

  proc.kill();
  try { cdp.sock.destroy(); } catch (e) { /* déjà fermée */ }

  if (!vu) { console.log('la page n a rien rendu.'); process.exit(2); }

  var pbs = [];
  if (!vu.liens || vu.liens.length !== ATTENDUES) pbs.push('liens de leçon : ' + (vu.liens ? vu.liens.length : 0) + ' au lieu de ' + ATTENDUES);
  if (vu.morts) pbs.push(vu.morts + ' lien(s) mort(s) « # »');
  if (vu.bientot) pbs.push(vu.bientot + ' leçon(s) encore marquée(s) « bientôt »');
  var barre = (vu.progression.match(/(\d+)\s*\/\s*(\d+)/) || []);
  if (barre[1] !== String(TERMINEES.length) || barre[2] !== String(ATTENDUES)) {
    pbs.push('la barre affiche « ' + (barre[0] || '(rien)') + ' » au lieu de « ' + TERMINEES.length + ' / ' + ATTENDUES + ' »');
  }
  if (vu.badge.indexOf(String(ATTENDUES)) < 0) pbs.push('le badge ne mentionne pas les ' + ATTENDUES + ' leçons : « ' + vu.badge.trim() + ' »');
  if (vu.stockage.indexOf(TERMINEES[TERMINEES.length - 1]) < 0) pbs.push('la progression semée n a pas été relue');

  console.log('  titre .................. : ' + vu.titre.trim());
  console.log('  badge .................. : ' + vu.badge.trim());
  console.log('  liens de leçon rendus .. : ' + vu.liens.length + ' (attendu ' + ATTENDUES + ')');
  console.log('  liens morts « # » ...... : ' + vu.morts);
  console.log('  leçons « bientôt » ..... : ' + vu.bientot);
  console.log('  barre lue .............. : ' + (barre[0] || '(aucune)') + ' (semé : ' + TERMINEES.length + ' / ' + ATTENDUES + ')');
  console.log('  encart de statistiques . : ' + vu.stats.replace(/\s+/g, ' ').trim().slice(0, 90));
  console.log('  barre de progression ... : ' + vu.progression.replace(/\s+/g, ' ').trim().slice(0, 90));
  console.log('');
  if (pbs.length) { console.log('PROBLÈMES : ' + pbs.join(' | ')); process.exit(1); }
  console.log('Aucun problème : la page de cours rend ses ' + ATTENDUES + ' leçons, sans lien mort ni « bientôt »,');
  console.log('et tient compte de la progression semée.');
})();
