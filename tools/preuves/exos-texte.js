'use strict';

/**
 * tools/preuves/exos-texte.js — Les exercices `type:"text"` jugés PAR LA PAGE.
 *
 * POURQUOI CE SCRIPT EXISTE
 * -------------------------
 * 4 136 exercices du site sont corrigés en comparant la réponse à une liste `accept`.
 * Personne ne les avait jamais tapés dans un navigateur. Or la phase B a montré deux
 * fois la même panne — 8 exercices du cours `regex` et 5 du cours `offensive` — où le
 * champ `accept` appartenait à un AUTRE exercice que l'énoncé affiché : la réponse
 * publiée y était refusée par son propre champ. Un contrôle de source ne voit rien de
 * tel ; il faut taper la réponse et lire le verdict.
 *
 * CE QU'IL FAIT
 *  1. Ouvre la leçon dans Chrome headless, en `file://`, SANS
 *     `--allow-file-access-from-files` (aucun apprenant n'ouvre son navigateur avec).
 *  2. Pour chaque exercice `type:"text"`, tape la PREMIÈRE graphie de son `accept`.
 *  3. Clique « Vérifier » et lit le verdict rendu par la page.
 *
 * ET DANS L'AUTRE SENS — `--contre`. Prouver qu'une bonne réponse passe ne prouve que
 * la moitié : un correcteur qui accepterait tout passerait ce contrôle-là. En passe
 * adversariale, on tape une réponse PLAUSIBLE ET FAUSSE (« ␡ » suffixé à la bonne, ce
 * qu'aucune normalisation du site ne ramène à la bonne) et l'on exige un REFUS.
 *
 * USAGE
 *   node tools/preuves/exos-texte.js pages/ruby/lecon-04.html …   pages précises
 *   node tools/preuves/exos-texte.js --contre pages/ruby/…        passe adversariale
 * CODE DE SORTIE : 1 s'il existe au moins un échec, 2 si rien n'a pu être mesuré.
 */

var cp = require('child_process');
var path = require('path');
var http = require('http');
var net = require('net');
var crypto = require('crypto');
var fs = require('fs');

var RACINE = path.resolve(__dirname, '..', '..');
var PORT = 9359;
var args = process.argv.slice(2);
var CONTRE = args.indexOf('--contre') !== -1;
var PAGES = args.filter(function (a) { return a.indexOf('--') !== 0; });
if (!PAGES.length) { console.log('exos-texte.js — aucune page : passer des chemins.'); process.exit(0); }

var CHROME = ['C:/Program Files/Google/Chrome/Application/chrome.exe',
              'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
              '/usr/bin/google-chrome', '/usr/bin/chromium'].find(function (p) { return fs.existsSync(p); });
if (!CHROME) { console.log('exos-texte.js — Chrome introuvable, rien de mesuré.'); process.exit(0); }

process.on('uncaughtException', function (e) {
  console.log('\nexos-texte.js — ECHEC TECHNIQUE, rien n a pu etre mesure : ' + (e && e.message ? e.message : e));
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
  return {
    sock: sock,
    evaluer: function (expression) {
      return new Promise(function (r) {
        var msg = Buffer.from(JSON.stringify({ id: ++id, method: 'Runtime.evaluate', params: { expression: expression, returnByValue: true, awaitPromise: true } }));
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

/* Le script injecté. Il tape dans le champ de CHAQUE exercice type:"text" — appariés
   aux blocs `.exercise` PAR INDEX, exactement comme le fait initExos — puis clique
   « Vérifier ». Un `type:"text"` n'exécute rien : le verdict est immédiat. */
var SCRIPT = [
  '(async () => {',
  '  const CONTRE = ' + (CONTRE ? 'true' : 'false') + ';',
  '  const sortie = [];',
  '  const exos = [...document.querySelectorAll(".exercise")];',
  '  let donnees = [];',
  '  try { donnees = JSON.parse(document.querySelector("[data-exos]").textContent); } catch (e) {}',
  '  for (let i = 0; i < exos.length; i++) {',
  '    const ex = exos[i];',
  '    const entree = donnees[i];',
  '    if (!entree || entree.type !== "text") continue;',
  '    const champ = ex.querySelector("input.exo-try__input") || ex.querySelector("textarea.exo-try__input");',
  '    if (!champ) { sortie.push({ i: i + 1, etat: "sans-champ" }); continue; }',
  '    const bonne = (entree.accept || [])[0];',
  '    if (bonne == null) { sortie.push({ i: i + 1, etat: "sans-accept" }); continue; }',
  /* La contre-réponse : la bonne, suffixée d'un caractère qu'aucune normalisation du
     site ne retire (normExo ne touche qu'aux espaces, aux accents, à la casse et au
     point-virgule final). Elle reste plausible — c'est presque la bonne — et doit
     pourtant être refusée. */
  '    champ.value = CONTRE ? (bonne + " zzz") : bonne;',
  '    const statut = ex.querySelector(".exo-try__status");',
  '    ex.querySelector(".exo-try__btn").click();',
  '    let attente = 0;',
  '    while (attente < 60 && !/^[✓✗]/.test(statut.textContent)) {',
  '      await new Promise((r) => setTimeout(r, 50));',
  '      attente++;',
  '    }',
  '    sortie.push({',
  '      i: i + 1,',
  '      tape: champ.value,',
  '      etat: (statut.textContent.startsWith("✓") !== CONTRE) ? "juste" : "echec",',
  '      statut: statut.textContent,',
  '    });',
  '  }',
  '  return JSON.stringify(sortie);',
  '})()',
].join('\n');

(async function () {
  console.log('exos-texte.js — ' + PAGES.length + ' page(s) · Chrome headless · ' +
    (CONTRE ? 'passe ADVERSARIALE : une réponse fausse doit être REFUSÉE' : 'la réponse publiée est tapée et « Vérifier » cliqué') + '\n');
  var justes = 0, echecs = 0, sansChamp = 0, pagesKO = [];
  var debut = Date.now();

  for (var p = 0; p < PAGES.length; p++) {
    var page = PAGES[p];
    var url = 'file:///' + path.resolve(RACINE, page).replace(/\\/g, '/');
    var proc = cp.spawn(CHROME, ['--headless=new', '--remote-debugging-port=' + PORT, '--disable-gpu',
      '--no-first-run', '--disable-extensions',
      '--user-data-dir=' + path.join(RACINE, 'scratchpad', '.chrome-exos-texte'), url], { stdio: 'ignore' });
    var cible = null;
    for (var t = 0; t < 40 && !cible; t++) {
      await attendre(300);
      try {
        var liste = await get('http://127.0.0.1:' + PORT + '/json/list');
        cible = liste.find(function (x) { return x.type === 'page' && x.webSocketDebuggerUrl; });
      } catch (e) { /* Chrome démarre encore */ }
    }
    if (!cible) { console.log('  ' + page + ' : Chrome n a pas répondu'); proc.kill(); continue; }
    var cx = connecter(cible.webSocketDebuggerUrl);
    /* On n'attend pas un délai fixe : on attend que `initExos` ait POSÉ les champs.
       Un délai de 1,2 s suffisait pour une page et pas pour la suivante — et une page
       lue trop tôt rend zéro exercice, ce qui se serait lu comme « rien à juger ». */
    for (var w = 0; w < 40; w++) {
      await attendre(200);
      var pret = await cx.evaluer('(()=>{const e=document.querySelectorAll(".exercise").length;' +
        'const c=document.querySelectorAll(".exo-try__input").length;return e&&c?1:0})()');
      if (pret) break;
    }

    var brut = await cx.evaluer(SCRIPT);
    var res = [];
    try { res = JSON.parse(brut || '[]'); } catch (e) { res = []; }
    res.forEach(function (r) {
      if (r.etat === 'juste') { justes++; return; }
      if (r.etat === 'sans-champ' || r.etat === 'sans-accept') { sansChamp++; return; }
      echecs++;
      if (pagesKO.indexOf(page) < 0) pagesKO.push(page);
      console.log('  ECHEC  ' + page + ' :: exercice ' + r.i);
      console.log('      tapé               : ' + JSON.stringify(r.tape));
      console.log('      verdict de la page : ' + JSON.stringify(r.statut));
    });
    cx.sock.destroy();
    proc.kill();
    await attendre(400);
  }

  console.log('\n=== RÉSUMÉ ===');
  console.log('  pages ouvertes ..................... ' + PAGES.length);
  console.log('  réponses tapées .................... ' + (justes + echecs));
  console.log((CONTRE ? '  REFUSÉES comme il se doit .......... ' : '  ACCEPTÉES par la page .............. ') + justes);
  console.log((CONTRE ? '  acceptées à tort ................... ' : '  refusées ........................... ') + echecs);
  console.log('  sans champ ni accept ............... ' + sansChamp + '  (non jugés)');
  console.log('  durée .............................. ' + ((Date.now() - debut) / 1000).toFixed(1) + ' s');
  if (echecs) console.log('\n  pages à corriger : ' + pagesKO.join(', '));
  process.exit(echecs ? 1 : 0);
})();
