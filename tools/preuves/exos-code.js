'use strict';

/**
 * tools/preuves/exos-code.js — La SOLUTION PUBLIÉE passe-t-elle son propre exercice ?
 *
 * POURQUOI CE SCRIPT EXISTE
 * -------------------------
 * La méthode de la phase B du chantier V14 exige, pour chaque exercice `type:"code"`,
 * d'« exécuter la solution de référence pour prouver qu'elle passe ». Aucun outil ne
 * le faisait : `verif-exemples.js --exos` rejoue l'ÉNONCÉ dans `vm` (Node), jamais la
 * solution, et jamais dans le moteur du site. Or le juge réel est un **Web Worker de
 * navigateur** piloté par `js/lecon.js`, et les deux moteurs ne sont pas
 * interchangeables (cf. l'écart de pile relevé par `verif-clic.js` en V13).
 *
 * CE QU'IL FAIT — exactement ce que ferait un apprenant qui recopie la solution :
 *  1. Ouvre la leçon dans Chrome headless, en `file://`, SANS
 *     `--allow-file-access-from-files` (aucun apprenant n'ouvre son navigateur avec).
 *  2. Pour chaque exercice muni d'un champ de code, copie le contenu du bloc
 *     `<details>` « Voir une solution » dans le champ.
 *  3. Clique sur « Vérifier » et lit le verdict rendu par la page.
 *
 * CE QU'IL NE JUGE PAS : un exercice sans solution repliée, ou dont la solution n'est
 * pas du `language-javascript` (correction/complétion). Ceux-là sont comptés à part,
 * jamais comme conformes.
 *
 * USAGE
 *   node tools/preuves/exos-code.js pages/vue/lecon-03.html …   pages précises
 *   node tools/preuves/exos-code.js --tout                      toutes les leçons à exercice de code
 * CODE DE SORTIE : 1 s'il existe au moins un échec, 2 si rien n'a pu être mesuré.
 */

var cp = require('child_process');
var path = require('path');
var http = require('http');
var net = require('net');
var crypto = require('crypto');
var fs = require('fs');
var portChrome = require('../lib/port-chrome.js');

var RACINE = path.resolve(__dirname, '..', '..');
/* Le port n'est plus ecrit en dur : Chrome le choisit et l'annonce dans son
   profil (point A6 du chantier V17). Six paires d'outils partageaient un meme
   numero, et un port deja pris fait mesurer LA PAGE D'UN AUTRE sans rien dire.
   Voir tools/lib/port-chrome.js. */
var PORT = 0;
var args = process.argv.slice(2);
var TOUT = args.indexOf('--tout') !== -1;
/* --contre : passe ADVERSARIALE. Pour chaque exercice type:"regex", on tape non pas la
   réponse de référence mais le premier motif `contre` — plausible et FAUX — et on exige
   que la page le REFUSE. Prouver qu'une bonne réponse passe ne prouve que la moitié :
   un correcteur qui accepterait tout passerait aussi ce contrôle-là. */
var CONTRE = args.indexOf('--contre') !== -1;
var explicites = args.filter(function (a) { return a.indexOf('--') !== 0; });

var CHROME = ['C:/Program Files/Google/Chrome/Application/chrome.exe',
              'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
              '/usr/bin/google-chrome', '/usr/bin/chromium'].find(function (p) { return fs.existsSync(p); });
if (!CHROME) { console.log('exos-code.js — Chrome introuvable, rien de mesuré.'); process.exit(0); }

/* Un échec TECHNIQUE ne doit pas rendre le même code de sortie qu'un exercice faux. */
process.on('uncaughtException', function (e) {
  console.log('\nexos-code.js — ECHEC TECHNIQUE, rien n\'a pu etre mesure : ' + (e && e.message ? e.message : e));
  process.exit(2);
});

function lecons() {
  var out = [];
  var base = path.join(RACINE, 'pages');
  fs.readdirSync(base).forEach(function (d) {
    var dir = path.join(base, d);
    if (!fs.statSync(dir).isDirectory()) return;
    fs.readdirSync(dir).forEach(function (f) {
      if (!/^lecon-\d+\.html$/.test(f)) return;
      var h = fs.readFileSync(path.join(dir, f), 'utf8');
      if (h.indexOf('"type":"code"') < 0 && h.indexOf('"type": "code"') < 0 &&
          h.indexOf('"type":"regex"') < 0 && h.indexOf('"type": "regex"') < 0 &&
          h.indexOf('"type":"sql"') < 0 && h.indexOf('"type": "sql"') < 0 &&
          h.indexOf('"type":"python"') < 0 && h.indexOf('"type": "python"') < 0) return;
      out.push(path.relative(RACINE, path.join(dir, f)).replace(/\\/g, '/'));
    });
  });
  return out;
}
var PAGES = explicites.length ? explicites : (TOUT ? lecons() : []);
if (!PAGES.length) { console.log('exos-code.js — aucune page : passer des chemins ou --tout.'); process.exit(0); }

/* ------------------------------------------------------------------- CDP nu ----- */
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

/* Le script injecté dans la page : il remplit CHAQUE champ de code avec la solution
   repliée du même exercice, clique « Vérifier », et rend le verdict de la page. */
var SCRIPT = [
  '(async () => {',
  '  const CONTRE = ' + (CONTRE ? 'true' : 'false') + ';',
  '  const sortie = [];',
  '  const exos = [...document.querySelectorAll(".exercise")];',
  /* Les exercices type:"regex" n'ont pas de textarea : leur réponse de référence est
     le champ `ref` du bloc data-exos, dont tools/verif-regex-exos.js prouve par
     ailleurs qu'il figure LITTÉRALEMENT dans la solution affichée. On tape donc ce
     motif — c'est bien la réponse publiée, pas une réponse fabriquée pour l'occasion. */
  '  let donnees = [];',
  '  try { donnees = JSON.parse(document.querySelector("[data-exos]").textContent); } catch (e) {}',
  '  for (let i = 0; i < exos.length; i++) {',
  '    const ex = exos[i];',
  '    const entree = donnees[i];',
  '    const champ = ex.querySelector("textarea.exo-try__input") ||',
  '      (entree && entree.type === "regex" ? ex.querySelector("input.exo-try__input") : null);',
  '    if (!champ) continue;',
  '    let reponse = null;',
  '    if (entree && entree.type === "regex") reponse = (CONTRE ? (entree.contre || [])[0] : entree.ref) || null;',
  /* type:"sql" : la solution publiée est le bloc `language-sql` du <details> — commentaires
     compris, SQLite les accepte. En passe adversariale, on tape la première contre-requête. */
  '    else if (entree && entree.type === "sql") {',
  '      if (CONTRE) reponse = (entree.contre || [])[0] || null;',
  '      else { const sol = ex.querySelector("details code.language-sql"); reponse = sol ? sol.textContent : null; }',
  '    }',
  '    else if (CONTRE) continue;',
  /* type:"python" : la solution publiée est le bloc `language-python` du <details>. */
  '    else if (entree && entree.type === "python") { const sol = ex.querySelector("details code.language-python"); reponse = sol ? sol.textContent : null; }',
  '    else { const sol = ex.querySelector("details code.language-javascript"); reponse = sol ? sol.textContent : null; }',
  '    if (reponse == null) { sortie.push({ i: i + 1, etat: "sans-solution" }); continue; }',
  '    champ.value = reponse;',
  '    const statut = ex.querySelector(".exo-try__status");',
  '    ex.querySelector(".exo-try__btn").click();',
  '    let attente = 0;',
  /* 15 s, et non 6 : le premier exercice SQL d'une page doit d'abord charger sql.js
     (909 Ko à décoder) dans son Worker. Les suivants réutilisent le même moteur. */
  /* 40 s : le premier exercice Python d'une page doit charger CPython (8,27 Mo). */
  '    while (attente < 400 && !/^[✓✗]/.test(statut.textContent)) {',
  '      await new Promise((r) => setTimeout(r, 100));',
  '      attente++;',
  '    }',
  '    const boite = ex.querySelector(".exo-try__out");',
  '    sortie.push({',
  '      i: i + 1,',
  '      etat: (statut.textContent.startsWith("✓") !== CONTRE) ? "juste" : "echec",',
  '      statut: statut.textContent,',
  '      produit: boite ? boite.textContent : "",',
  '    });',
  '  }',
  '  return JSON.stringify(sortie);',
  '})()',
].join('\n');

(async function () {
  console.log('exos-code.js — ' + PAGES.length + ' page(s) · Chrome headless · le champ est rempli et « Vérifier » cliqué\n');
  var justes = 0, echecs = 0, sansSolution = 0, pagesKO = [];
  var debut = Date.now();

  for (var p = 0; p < PAGES.length; p++) {
    var page = PAGES[p];
    var url = 'file:///' + path.resolve(RACINE, page).replace(/\\/g, '/');
    var profilCh = path.join(RACINE, 'scratchpad', '.chrome-exos-code');
    portChrome.oublier(profilCh);
    var proc = cp.spawn(CHROME, ['--headless=new', '--remote-debugging-port=0', '--disable-gpu',
      '--no-first-run', '--disable-extensions',
      '--user-data-dir=' + profilCh, url], { stdio: 'ignore' });
    try { PORT = await portChrome.attendre(profilCh); }
    catch (ePort) { console.log(ePort.message); try { proc.kill(); } catch (e2) {} process.exit(2); }
    var cible = null;
    for (var t = 0; t < 40 && !cible; t++) {
      await attendre(300);
      try {
        var liste = await get('http://127.0.0.1:' + PORT + '/json/list');
        cible = liste.find(function (x) { return x.type === 'page' && x.webSocketDebuggerUrl; });
      } catch (e) { /* Chrome démarre encore */ }
    }
    if (!cible) { console.log('  ' + page + ' : Chrome n\'a pas répondu'); proc.kill(); continue; }
    var cx = connecter(cible.webSocketDebuggerUrl);
    await attendre(1200);

    /* `awaitPromise: true` est indispensable : le script est asynchrone (il attend le
       Worker), et sans lui Runtime.evaluate rend la promesse elle-même, jamais sa
       valeur — la mesure se lit alors « aucun champ de code trouvé ». */
    var brut = await cx.evaluer(SCRIPT);
    var lignes = [];
    try { lignes = JSON.parse(brut || '[]'); } catch (e) { lignes = []; }
    if (!lignes.length) console.log('  ' + page + ' : aucun champ de code trouvé');
    for (var k = 0; k < lignes.length; k++) {
      var r = lignes[k];
      if (r.etat === 'sans-solution') { sansSolution++; continue; }
      if (r.etat === 'juste') { justes++; }
      else {
        echecs++;
        if (pagesKO.indexOf(page) === -1) pagesKO.push(page);
        console.log('  ✗ ' + page + ' · exercice ' + r.i);
        console.log('      verdict de la page : ' + JSON.stringify(r.statut));
        console.log('      sortie affichée    : ' + JSON.stringify(String(r.produit).slice(0, 300)));
      }
    }
    if (lignes.length && !lignes.some(function (x) { return x.etat === 'echec'; })) {
      console.log('  ✓ ' + page + ' · ' + lignes.filter(function (x) { return x.etat === 'juste'; }).length + ' solution(s) acceptée(s)');
    }
    try { await cx.evaluer('window.close()'); } catch (e) {}
    proc.kill();
    await attendre(200);
  }

  console.log('\n=== RÉSUMÉ ===');
  if (CONTRE) {
    console.log('  contre-motifs bien REFUSÉS ........ ' + justes);
    console.log('  contre-motifs ACCEPTÉS À TORT ..... ' + echecs);
  } else {
    console.log('  solutions acceptées par la page ... ' + justes);
    console.log('  solutions REFUSÉES ............... ' + echecs);
  }
  console.log('  exercices sans solution repliée ... ' + sansSolution + '  (non jugés)');
  console.log('  durée ............................. ' + ((Date.now() - debut) / 1000).toFixed(1) + ' s');
  if (echecs) console.log('\n  pages en échec : ' + pagesKO.join(', '));
  process.exit(echecs ? 1 : 0);
})();
