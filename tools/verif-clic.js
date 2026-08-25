'use strict';

/**
 * tools/verif-clic.js — Ce que l'apprenant voit quand il clique sur « ▶ Tester ».
 *
 * POURQUOI CE SCRIPT EXISTE
 * -------------------------
 * `verif-exemples.js` et le contrôle des blocs de sortie exécutent le code dans
 * **Node (`vm`)**. Le site, lui, l'exécute dans un **Web Worker de navigateur**
 * (`js/runner.js`). Les deux moteurs ne sont pas interchangeables : la pile d'appels
 * d'un Worker Chrome est bien plus courte que celle de Node.
 *
 * Le 2026-08-23, ce seul écart a laissé passer un exemple faux, tous vérificateurs
 * verts : `compilation/lecon-08` imprimait « appels avant le plafond : 10000 /
 * arret : PLAFOND », et l'apprenant qui cliquait voyait « 6970 / Maximum call stack
 * size exceeded ». Node tenait 11 330 appels et atteignait donc le plafond de 10 000 ;
 * le Worker rompait vers 6 500–7 000. Deux lignes sur six divergeaient, sous un bouton
 * que le lecteur peut cliquer.
 *
 * CE QU'IL FAIT
 * -------------
 *  1. Ouvre la page dans Chrome (headless), en `file://`, réseau non sollicité.
 *  2. Clique sur CHAQUE bouton « ▶ Tester » posé par `runner.js`.
 *  3. Attend la réponse du Worker, lit la console affichée dans la page.
 *  4. La compare au bloc `<figure class="code-block" data-file="*.txt">` que la page
 *     imprime juste après (jusqu'à 3 éléments plus loin).
 *
 * CE QU'IL NE FAIT PAS : juger un bloc sans sortie imprimée (solutions d'exercices,
 * fragments) — ceux-là sont comptés à part, jamais comme conformes. Les blocs Python
 * et SQL sont ignorés : ils exigent Pyodide / sql.js, donc HTTP.
 *
 * PRUDENCE CONTRE LES FAUX POSITIFS (règle du chantier : un motif trop large casse ce
 * qui était juste). Tous les blocs `.txt` d'une page ne sont pas des sorties : beaucoup
 * sont des ILLUSTRATIONS — un arbre dessiné, un schéma de graphe, une arborescence de
 * fichiers. Un premier jet, qui prenait « le premier bloc .txt dans les 3 éléments
 * suivants », a crié au loup 6 fois sur 6. On n'apparie donc que si le nom du bloc de
 * sortie le désigne comme tel : il commence par « sortie », ou il partage son radical
 * avec le programme (`controles.js` -> `controles.txt`). Et l'on ne juge jamais un bloc
 * qui, au clic, ne produit rien ou lève une ReferenceError : c'est un fragment qui
 * dépend d'un bloc précédent, pas un programme dont on puisse comparer la sortie.
 *
 * USAGE
 *   node tools/verif-clic.js                       # les leçons à risque (bloc JS + bloc .txt)
 *   node tools/verif-clic.js pages/x/lecon-01.html # des pages précises
 *   node tools/verif-clic.js --tout                # toutes les leçons portant un bloc JS
 * Code de sortie : 1 s'il existe au moins une divergence.
 */

var cp = require('child_process');
var path = require('path');
var http = require('http');
var net = require('net');
var crypto = require('crypto');
var fs = require('fs');

var RACINE = path.resolve(__dirname, '..');
var PORT = 9351;
var args = process.argv.slice(2);
var TOUT = args.indexOf('--tout') !== -1;
var explicites = args.filter(function (a) { return a.indexOf('--') !== 0; });

var CHROME = ['C:/Program Files/Google/Chrome/Application/chrome.exe',
              'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
              '/usr/bin/google-chrome', '/usr/bin/chromium'].find(function (p) { return fs.existsSync(p); });
if (!CHROME) { console.log('verif-clic.js — Chrome introuvable, rien de mesuré.'); process.exit(0); }

/* Un echec TECHNIQUE (Chrome qui meurt, socket coupee) ne doit pas rendre le meme
   code de sortie qu une DIVERGENCE reelle : sinon un plantage se lit comme une
   verification faite, ou l inverse. 1 = divergence, 2 = l outil n a pas pu mesurer. */
process.on('uncaughtException', function (e) {
  console.log("");
  console.log("verif-clic.js — ECHEC TECHNIQUE, rien n a pu etre mesure : " + (e && e.message ? e.message : e));
  process.exit(2);
});

/* ------------------------------------------------------------ choix des pages --- */
function lecons() {
  var out = [];
  var base = path.join(RACINE, 'pages');
  fs.readdirSync(base).forEach(function (d) {
    var dir = path.join(base, d);
    if (!fs.statSync(dir).isDirectory()) return;
    fs.readdirSync(dir).forEach(function (f) {
      if (!/^lecon-\d+\.html$/.test(f)) return;
      var h = fs.readFileSync(path.join(dir, f), 'utf8');
      if (h.indexOf('language-javascript') < 0) return;
      /* à risque : un bloc JS suivi d'un bloc de sortie .txt */
      var aRisque = /language-javascript[\s\S]{0,40000}?<figure class="code-block" data-file="[^"]*\.txt"/.test(h);
      if (TOUT || aRisque) out.push(path.relative(RACINE, path.join(dir, f)).replace(/\\/g, '/'));
    });
  });
  return out;
}
var PAGES = explicites.length ? explicites : lecons();

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
  /* Chrome coupe la socket a la fermeture : sans ce gestionnaire, Node leve une
     exception non capturee (ECONNRESET), le resume n est jamais imprime et le
     processus sort en erreur — exactement comme s il avait trouve une divergence.
     Le controle etait donc muet ET indistinguable d un echec reel (V13-F1). */
  sock.on('error', function () { /* fermeture brutale de Chrome : sans effet */ });
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

/* ----------------------------------------------------------------- mesure ------- */
var norm = function (s) { return String(s || '').replace(/\r/g, '').replace(/[ \t]+$/gm, '').replace(/\n+$/, ''); };

/* Le bloc .txt est-il LA SORTIE de ce programme, ou une illustration voisine ? */
function estLaSortieDe(nomTxt, nomJs) {
  var t = String(nomTxt || '').replace(/\.txt$/, '');
  var j = String(nomJs || '').replace(/\.[a-z]+$/, '');
  if (/^sortie/.test(t)) return true;              // sortie.txt, sortie-trace.txt…
  if (!j) return false;
  if (t === j) return true;                        // controles.js -> controles.txt
  return t.indexOf(j) === 0 || j.indexOf(t) === 0; // même radical, suffixe en plus
}
/* Un fragment qui dépend d'un bloc précédent n'a pas de sortie comparable. */
function estUnFragment(vu) {
  return !vu || /^\(aucune sortie/.test(vu) || /^(Reference|Syntax)Error:/.test(vu);
}

(async function () {
  console.log('verif-clic.js — ' + PAGES.length + ' page(s) · Chrome headless · le bouton « Tester » est cliqué pour de vrai\n');
  var total = 0, divergents = 0, sansSortie = 0, illustrations = 0, fragments = 0, pagesKO = [];

  for (var p = 0; p < PAGES.length; p++) {
    var page = PAGES[p];
    var url = 'file:///' + path.resolve(RACINE, page).replace(/\\/g, '/');
    var proc = cp.spawn(CHROME, ['--headless=new', '--remote-debugging-port=' + PORT, '--disable-gpu',
      '--allow-file-access-from-files', '--no-first-run', '--disable-extensions',
      '--user-data-dir=' + path.join(RACINE, 'scratchpad', '.chrome-verif-clic'), url], { stdio: 'ignore' });
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
    await attendre(1400);

    var brut = await cx.evaluer('JSON.stringify([...document.querySelectorAll("figure.code-block")]' +
      '.map((f,i)=>({i,file:f.dataset.file||"",js:!!f.querySelector("code.language-javascript"),bouton:!!f.querySelector(".code-block__try")})))');
    var blocs = JSON.parse(brut || '[]');
    var execs = blocs.filter(function (b) { return b.bouton && b.js; });
    var lignesPage = [];

    for (var k = 0; k < execs.length; k++) {
      var b = execs[k];
      total++;
      await cx.evaluer('(()=>{const f=document.querySelectorAll("figure.code-block")[' + b.i + '];' +
        'window.__f=f;const o=f.querySelector(".runner-output");if(o)o.remove();' +
        'f.querySelector(".code-block__try").click();return 1})()');
      var vu = '';
      for (var w = 0; w < 25; w++) {
        await attendre(400);
        vu = await cx.evaluer('(()=>{const o=window.__f.querySelector(".runner-output");if(!o)return "";' +
          'const l=[...o.querySelectorAll(".runner-output__line")];if(!l.length)return "";' +
          'return l.map(x=>x.textContent).join("\\n")})()') || '';
        if (vu && !/Exécution|en cours/i.test(vu)) break;
      }
      var attendu = await cx.evaluer('(()=>{const f=document.querySelectorAll("figure.code-block")[' + b.i + '];' +
        'let n=f.nextElementSibling,c=0;while(n&&c++<4){' +
        'if(n.classList&&n.classList.contains("code-block")&&/\\.txt$/.test(n.dataset.file||""))' +
        'return n.dataset.file+"\\u0000"+n.querySelector("code").textContent;n=n.nextElementSibling}return ""})()');
      if (!attendu) { sansSortie++; continue; }
      var part = String(attendu).split('\u0000');
      if (!estLaSortieDe(part[0], b.file)) { illustrations++; continue; }
      if (estUnFragment(vu)) { fragments++; continue; }
      if (norm(vu) === norm(part[1])) continue;
      divergents++;
      if (pagesKO.indexOf(page) < 0) pagesKO.push(page);
      lignesPage.push('  DIVERGENCE  ' + page + ' :: ' + b.file + ' -> ' + part[0]);
      var a = norm(part[1]).split('\n'), v = norm(vu).split('\n');
      for (var i = 0; i < Math.max(a.length, v.length); i++) {
        if (a[i] === v[i]) continue;
        lignesPage.push('     ligne ' + (i + 1));
        lignesPage.push('       la page imprime : ' + JSON.stringify(a[i]));
        lignesPage.push('       le clic donne   : ' + JSON.stringify(v[i]));
      }
    }
    if (lignesPage.length) console.log(lignesPage.join('\n'));
    cx.sock.destroy();
    proc.kill();
    await attendre(500);
  }

  console.log('\n=== RÉSUMÉ ===');
  console.log('  pages ouvertes ..................... ' + PAGES.length);
  console.log('  blocs cliqués ...................... ' + total);
  console.log('  DIVERGENTS ......................... ' + divergents);
  console.log('  sans bloc de sortie à comparer ..... ' + sansSortie + '  (solutions, fragments : non jugés)');
  console.log('  bloc .txt voisin = illustration ..... ' + illustrations + '  (schéma, arbre dessiné : non jugé)');
  console.log('  fragments (rien produit / erreur) ... ' + fragments + '  (dépendent d un bloc précédent : non jugés)');
  if (divergents) console.log('\n  pages à corriger : ' + pagesKO.join(', '));
  else console.log('\n  Ce que la page imprime et ce que l\'apprenant obtient au clic concordent partout.');
  process.exit(divergents ? 1 : 0);   /* 1 = divergence ; un plantage technique sort en 2, cf. plus bas */
})();
