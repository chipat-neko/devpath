'use strict';
/**
 * tools/doc/verif-lexique-clic.js — le lexique, cliqué pour de vrai.
 *
 * POURQUOI CE SCRIPT EXISTE
 * -------------------------
 * Les 82 mots de la leçon doc/02 ont rejoint pages/lexique.html. Or cette page
 * ne contient AUCUNE de ses entrées dans son HTML : la liste, les filtres par
 * famille et les pièges sont construits par js/lexique.js à l'ouverture. Aucun
 * vérificateur de source ne peut donc voir qu'ils s'affichent — pas plus que
 * verif-html, qui lit un fichier où il n'y a rien à lire.
 *
 * Ce script ouvre la page dans un vrai Chrome, en file://, réseau non sollicité,
 * et CLIQUE : chaque filtre de famille, puis le champ de recherche, puis le
 * quiz. Il compare ce qui s'affiche aux données de tools/doc/vocab/mots.json.
 *
 * Codes de sortie : 0 tout va bien · 1 divergence · 2 l'outil n'a pas pu mesurer.
 */
const fs = require('fs');
const path = require('path');
const http = require('http');
const net = require('net');
const crypto = require('crypto');
const cp = require('child_process');
const profilChrome = require('../lib/profil-chrome.js');
const portChrome = require('../lib/port-chrome.js');

const RACINE = path.join(__dirname, '..', '..');
/* Le port n'est plus ecrit en dur : Chrome le choisit et l'annonce (point A6 du
   chantier V17). Avec 9357 en dur, un autre Chrome deja pose sur ce port faisait
   rendre a cet outil « 1 controle OK, 11 en echec » en 2,0 s -- sur la page d'un
   autre. Voir tools/lib/port-chrome.js. */
let PORT = 0;
const MOTS = require('./vocab/mots.json');
const compte = require('./vocab/gen-lexique-compte.js');

const CHROME = ['C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  '/usr/bin/google-chrome', '/usr/bin/chromium'].find((p) => fs.existsSync(p));
if (!CHROME) { console.log('verif-lexique-clic.js — Chrome introuvable, rien de mesuré.'); process.exit(0); }

process.on('uncaughtException', function (e) {
  console.log('\nverif-lexique-clic.js — ÉCHEC TECHNIQUE : ' + (e && e.message ? e.message : e));
  process.exit(2);
});

const attendre = (ms) => new Promise((r) => setTimeout(r, ms));
const get = (u) => new Promise((res, rej) => {
  http.get(u, (r) => { let d = ''; r.on('data', (c) => { d += c; }); r.on('end', () => res(JSON.parse(d))); }).on('error', rej);
});

function connecter(wsUrl) {
  const u = new URL(wsUrl);
  const sock = net.connect(Number(u.port), u.hostname, function () {
    const key = crypto.randomBytes(16).toString('base64');
    sock.write('GET ' + u.pathname + ' HTTP/1.1\r\nHost: ' + u.host + '\r\nUpgrade: websocket\r\n' +
      'Connection: Upgrade\r\nSec-WebSocket-Key: ' + key + '\r\nSec-WebSocket-Version: 13\r\n\r\n');
  });
  let buf = Buffer.alloc(0), hs = false, id = 0;
  const attentes = {};
  sock.on('error', function () { /* Chrome coupe la socket en fermant : sans effet */ });
  sock.on('data', function (chunk) {
    buf = Buffer.concat([buf, chunk]);
    if (!hs) { const i = buf.indexOf('\r\n\r\n'); if (i < 0) return; hs = true; buf = buf.slice(i + 4); }
    while (buf.length >= 2) {
      let len = buf[1] & 127, off = 2;
      if (len === 126) { len = buf.readUInt16BE(2); off = 4; }
      else if (len === 127) { len = Number(buf.readBigUInt64BE(2)); off = 10; }
      if (buf.length < off + len) return;
      let m;
      try { m = JSON.parse(buf.slice(off, off + len).toString()); } catch (e) { m = {}; }
      buf = buf.slice(off + len);
      if (m.id && attentes[m.id]) { attentes[m.id](m.result); delete attentes[m.id]; }
    }
  });
  return {
    sock,
    evaluer(expression) {
      return new Promise((r) => {
        const msg = Buffer.from(JSON.stringify({ id: ++id, method: 'Runtime.evaluate', params: { expression, returnByValue: true, awaitPromise: true } }));
        attentes[id] = (res) => r(res && res.result ? res.result.value : undefined);
        const mk = crypto.randomBytes(4);
        let e;
        if (msg.length < 126) e = Buffer.from([0x81, 0x80 | msg.length]);
        else if (msg.length < 65536) { e = Buffer.alloc(4); e[0] = 0x81; e[1] = 0xfe; e.writeUInt16BE(msg.length, 2); }
        else { e = Buffer.alloc(10); e[0] = 0x81; e[1] = 0xff; e.writeBigUInt64BE(BigInt(msg.length), 2); }
        const c = Buffer.from(msg);
        for (let k = 0; k < c.length; k++) c[k] ^= mk[k % 4];
        sock.write(Buffer.concat([e, mk, c]));
      });
    },
  };
}

let ok = 0, ko = 0;
function verdict(cond, libelle, detail) {
  if (cond) { ok++; console.log('  OK   ' + libelle); }
  else { ko++; console.log('  ÉCHEC ' + libelle + (detail ? '  — ' + detail : '')); }
}

(async function () {
  const url = 'file:///' + path.join(RACINE, 'pages', 'lexique.html').replace(/\\/g, '/');
  console.log('verif-lexique-clic.js — pages/lexique.html ouverte dans Chrome, filtres cliqués\n');
  const profil = profilChrome.neuf('lexique');
  const proc = cp.spawn(CHROME, ['--headless=new', '--remote-debugging-port=0', '--disable-gpu',
    '--allow-file-access-from-files', '--no-first-run', '--disable-extensions',
    '--user-data-dir=' + profil, url], { stdio: 'ignore' });
  try { PORT = await portChrome.attendre(profil); }
  catch (e) { console.log(e.message); proc.kill(); process.exit(2); }
  let cible = null;
  for (let t = 0; t < 40 && !cible; t++) {
    await attendre(300);
    try {
      const liste = await get('http://127.0.0.1:' + PORT + '/json/list');
      cible = liste.find((x) => x.type === 'page' && x.webSocketDebuggerUrl);
    } catch (e) { /* Chrome démarre encore */ }
  }
  if (!cible) { console.log('Chrome n a pas répondu.'); proc.kill(); process.exit(2); }
  const cx = connecter(cible.webSocketDebuggerUrl);
  /* ON ATTEND UN ÉTAT, PAS UNE DURÉE (point A6 du chantier V17, 2026-09-09).
     Ici dormait `await attendre(1200)`. Sur une machine occupée — la chaîne entière
     en train de tourner — la page n'avait pas fini de se construire au bout de ces
     1,2 s, et l'outil rendait « 1 contrôle OK, 11 en échec » : douze faux rouges,
     dont un « les 147 entrées du lexique sont rendues — rendu 0 » qui désignait un
     bug du site qui n'existait pas. Mesuré deux fois le 2026-09-09, dans deux
     passages de `verif.js` — et vert dès qu'on relançait l'outil seul.
     On attend donc que la page soit CHARGÉE et que son conteneur existe. S'il
     n'apparaît pas, rien n'a pu être mesuré : c'est un code 2, jamais un code 1.
     Le conteneur VIDE, lui, reste une faute — c'est bien ce qu'on vient mesurer. */
  let prete = false;
  for (let t = 0; t < 150 && !prete; t++) {
    await attendre(100);
    try {
      prete = await cx.evaluer('document.readyState === "complete" && !!document.getElementById("lx-entries")');
    } catch (e) { prete = false; }
  }
  if (!prete) {
    console.log('verif-lexique-clic.js — pages/lexique.html n a pas fini de se charger en 15 s :');
    console.log('  RIEN N A PU ETRE MESURE (ce n est pas une faute du site).');
    proc.kill();
    process.exit(2);
  }

  const total = compte.total();

  /* 1. la liste complète s'affiche */
  const affichees = await cx.evaluer('document.querySelectorAll("#lx-entries .lx-entry").length');
  verdict(affichees === total, 'les ' + total + ' entrées du lexique sont rendues', 'rendu ' + affichees);

  const piegesRendus = await cx.evaluer('document.querySelectorAll("#lx-entries .lx-piege").length');
  verdict(piegesRendus === MOTS.filter((m) => m.piege).length,
    piegesRendus + ' pièges affichés', 'attendu ' + MOTS.filter((m) => m.piege).length);

  /* 2. les filtres de famille existent, et chacun affiche son compte */
  const familles = [...new Set(MOTS.map((m) => m.famille))];
  const boutons = await cx.evaluer('document.querySelectorAll("#lx-familles .lx-fam").length');
  verdict(boutons === familles.length + 2,
    'un bouton par famille, plus « Tout » et « base »', boutons + ' boutons');

  for (const f of familles) {
    const attendu = MOTS.filter((m) => m.famille === f).length;
    const rendu = await cx.evaluer(
      '(function(){var b=document.querySelector(\'#lx-familles [data-fam="' + f + '"]\');' +
      'if(!b) return -1; b.click(); return document.querySelectorAll("#lx-entries .lx-entry").length;})()');
    verdict(rendu === attendu, 'filtre « ' + f + ' » : ' + attendu + ' mots', 'rendu ' + rendu);
  }

  /* 3. la recherche porte AUSSI sur le sens et le piège — c'est nouveau */
  const recherche = await cx.evaluer(
    '(function(){document.querySelector(\'#lx-familles [data-fam=""]\').click();' +
    'var s=document.getElementById("lx-search"); s.value="perdue"; ' +
    's.dispatchEvent(new Event("input"));' +
    'return document.querySelectorAll("#lx-entries .lx-entry").length;})()');
  verdict(recherche >= 1, 'la recherche trouve un mot par le TEXTE de son piège', 'rendu ' + recherche);

  /* 4. le quiz démarre et pose une question tirée de l'ensemble */
  const quiz = await cx.evaluer(
    '(function(){document.querySelector(\'#lx-tabs [data-mode="quiz"]\').click();' +
    'var w=document.querySelector("#lx-quiz .lx-qword");' +
    'return w ? {q:w.textContent.trim(), opts:document.querySelectorAll("#lx-quiz .lx-opt").length} : null;})()');
  verdict(quiz && quiz.opts === 4, 'le quiz pose une question à 4 options',
    quiz ? quiz.opts + ' options' : 'aucune question');

  /* 5. aucune erreur de console pendant tout ça */
  const erreurs = await cx.evaluer('(window.__erreurs||[]).length');
  verdict(erreurs === undefined || erreurs === 0, 'aucune erreur JavaScript pendant les clics');

  cx.sock.destroy();
  proc.kill();
  console.log('\n' + ok + ' contrôle(s) OK, ' + ko + ' en échec.');
  process.exit(ko === 0 ? 0 : 1);
})();
