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
 * CE QUI A ÉTÉ RÉPARÉ LE 2026-09-08 (chantier V17, point A3), et pourquoi il fallait
 * le réparer avant de verser cet outil dans la chaîne : **sa couverture variait sans
 * qu'il le dise**. L'audit a relevé 67, 19, 73 puis 73 blocs cliqués sur quatre
 * exécutions de la même commande, chacune imprimant « concordent partout » et sortant
 * en 0 — le run à 19 n'avait jugé que 26 % des blocs. Reproduit ici en lançant deux
 * instances en parallèle sur les trois mêmes pages : **18 blocs contre 11, les deux en
 * code 0**. Cause : un PORT FIXE unique (9351) et un seul `--user-data-dir`, plus un
 * `proc.kill()` qui ne tue que le lanceur, donc des Chrome de test qui survivent et
 * qu'une exécution suivante trouve à sa place sur le même port.
 * Quatre corrections :
 *   1. port DYNAMIQUE par lancement (`--remote-debugging-port=0`, lu dans le fichier
 *      `DevToolsActivePort` du profil) et `--user-data-dir` UNIQUE par page, effacé
 *      à la fin : deux exécutions ne peuvent plus se confondre ;
 *   2. la cible CDP est choisie sur son URL, pas sur « la première page trouvée » :
 *      un Chrome étranger sur le même port ne peut plus être pris pour le bon ;
 *   3. on attend un ÉTAT et non une durée : `readyState complete` puis un nombre de
 *      boutons `.code-block__try` STABLE sur deux relevés ;
 *   4. le nombre de blocs ATTENDUS est calculé à part, depuis le SOURCE des pages, et
 *      imprimé à côté du nombre de blocs cliqués. **Un écart rougit** (code 2 : rien
 *      n'a été mesuré sur ces blocs, ce n'est ni un « OK » ni une divergence).
 *
 * USAGE
 *   node tools/verif-clic.js                       # les leçons à risque (bloc JS + bloc .txt)
 *   node tools/verif-clic.js pages/x/lecon-01.html # des pages précises
 *   node tools/verif-clic.js --tout                # toutes les leçons portant un bloc JS
 * Code de sortie : 1 s'il existe au moins une divergence, 2 si la mesure n'a pas pu
 * être faite en entier (page non ouverte, blocs non cliqués), 0 si tout concorde.
 */

var cp = require('child_process');
var path = require('path');
var http = require('http');
var net = require('net');
var crypto = require('crypto');
var fs = require('fs');

var RACINE = path.resolve(__dirname, '..');
var args = process.argv.slice(2);
var TOUT = args.indexOf('--tout') !== -1;
/* --chrono : une ligne par page (durée, blocs). Sert à savoir OÙ part le temps —
   la question a été posée le 2026-09-08, quand un balayage complet s'est révélé
   quatre fois plus lent que l'extrapolation faite sur six pages. */
var CHRONO = args.indexOf('--chrono') !== -1;
var explicites = args.filter(function (a) { return a.indexOf('--') !== 0; });

var CHROME = ['C:/Program Files/Google/Chrome/Application/chrome.exe',
              'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
              '/usr/bin/google-chrome', '/usr/bin/chromium'].find(function (p) { return fs.existsSync(p); });
if (!CHROME) { console.log('verif-clic.js — NON MESURÉ : Chrome introuvable, aucune page n’a été ouverte.'); process.exit(2); }

/* Un echec TECHNIQUE (Chrome qui meurt, socket coupee) ne doit pas rendre le meme
   code de sortie qu une DIVERGENCE reelle : sinon un plantage se lit comme une
   verification faite, ou l inverse. 1 = divergence, 2 = l outil n a pas pu mesurer. */
process.on('uncaughtException', function (e) {
  console.log("");
  console.log("verif-clic.js — ECHEC TECHNIQUE, rien n a pu etre mesure : " + (e && e.message ? e.message : e));
  process.exit(2);
});

/* ------------------------------------------------------------ choix des pages --- */
/* Une page mérite d'être ouverte si elle contient au moins un bloc JS suivi, à trois
   éléments au plus, d'un bloc `.txt` que `estLaSortieDe` reconnaît comme SA sortie.
   C'est exactement le critère de la comparaison : ouvrir une page qui n'en contient
   aucun coûte un démarrage de Chrome pour ne rien juger. */
function aUneSortieAppariable(html) {
  var figs = [], re = /<figure class="code-block"([^>]*)>([\s\S]*?)<\/figure>/g, m;
  while ((m = re.exec(html))) {
    var at = /data-file="([^"]*)"/.exec(m[1]);
    figs.push({ file: at ? at[1] : '', js: /class="[^"]*language-javascript/.test(m[2]) });
  }
  for (var i = 0; i < figs.length; i++) {
    if (!figs[i].js) continue;
    for (var k = i + 1; k <= i + 3 && k < figs.length; k++) {
      if (!/\.txt$/.test(figs[k].file)) continue;
      if (estLaSortieDe(figs[k].file, figs[i].file)) return true;
    }
  }
  return false;
}
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
      /* « à risque » voulait dire : un bloc JS suivi QUELQUE PART d'un bloc .txt. Trop
         large — mesuré le 2026-09-08 : sur les six premières pages ainsi retenues,
         48 blocs cliqués et ZÉRO jugé, les 48 étant soit sans sortie voisine, soit
         voisins d'une illustration. On applique donc ici la règle d'appariement que
         la comparaison appliquera de toute façon (`estLaSortieDe`, à trois éléments
         de distance) : 89 pages retenues -> 75, et AUCUNE page appariable perdue
         (vérifié : la différence est de 14 pages, toutes non appariables). */
      if (TOUT || aUneSortieAppariable(h)) out.push(path.relative(RACINE, path.join(dir, f)).replace(/\\/g, '/'));
    });
  });
  return out;
}
var PAGES = explicites.length ? explicites : lecons();

/* --------------------------------------------- un Chrome ISOLÉ par page ouverte --- */
/* Le port fixe et le profil partagé étaient la cause mesurée de la couverture qui
   variait. On donne à chaque lancement son propre répertoire de profil et on laisse
   Chrome choisir son port (`--remote-debugging-port=0`), qu'il écrit lui-même dans
   `DevToolsActivePort`. Deux exécutions simultanées ne peuvent donc plus se prendre
   l'une pour l'autre. */
var RACINE_PROFILS = path.join(RACINE, 'scratchpad', '.chrome-verif-clic');
/* Sous Windows, Chrome garde encore des poignées de fichiers quelques centaines de
   millisecondes après la mort de son arbre : la suppression du profil échoue alors
   sans conséquence, et les répertoires s'accumulent (67 relevés après un passage de
   75 pages). On balaie donc l'ancien au DÉMARRAGE, où plus rien ne les tient. Le
   dossier est sous `scratchpad/`, ignoré par git. */
try { fs.rmSync(RACINE_PROFILS, { recursive: true, force: true }); } catch (e) { /* verrouillé : sans effet */ }
function profilNeuf(n) {
  var d = path.join(RACINE_PROFILS, String(process.pid) + '-' + n);
  fs.rmSync(d, { recursive: true, force: true });
  fs.mkdirSync(d, { recursive: true });
  return d;
}
/* `proc.kill()` ne tuait que le LANCEUR : Chrome se ré-exécute dans des processus
   fils, qui survivaient (8 encore vivants après les lancements de l'audit) et
   répondaient sur le port fixe à l'exécution suivante. On tue l'arbre entier. */
function tuerArbre(proc) {
  try {
    if (process.platform === 'win32') cp.execFileSync('taskkill', ['/PID', String(proc.pid), '/T', '/F'], { stdio: 'ignore' });
    else proc.kill('SIGKILL');
  } catch (e) { /* déjà mort */ }
}
async function attendrePort(profil, attendre) {
  for (var t = 0; t < 60; t++) {
    await attendre(200);
    var f = path.join(profil, 'DevToolsActivePort');
    if (!fs.existsSync(f)) continue;
    var p = parseInt(String(fs.readFileSync(f, 'utf8')).split('\n')[0], 10);
    if (p > 0) return p;
  }
  return 0;
}

/* ------------------------------------- combien de blocs DEVRAIENT être cliqués ? --- */
/* Le compte attendu est relevé sur le DISQUE, indépendamment du navigateur : c'est la
   seule façon de voir qu'une page ne s'est pas ouverte, ou qu'un bouton n'a pas été
   posé. On applique la règle de `js/runner.js` (init) : une `figure.code-block` qui
   porte une barre d'outils et un `code.language-javascript` reçoit un bouton, SAUF si
   son code déclenche BROWSER_ONLY. Cette expression n'est pas RECOPIÉE ici — elle est
   LUE dans `js/runner.js` à chaque exécution : une copie se périmerait en silence, et
   c'est précisément le défaut que ce chantier ferme.
   ⚠️ La barre d'outils N'EST PAS dans le source : `js/main.js` (enhanceCodeBlocks) la
   pose sur toute `.code-block` qui contient un `<pre>`. Le critère disque est donc
   « une figure code-block, un <pre>, un code.language-javascript, hors BROWSER_ONLY ».
   Un premier jet qui cherchait `code-block__bar` dans le HTML comptait 0 bloc sur 48. */
var BROWSER_ONLY = (function () {
  var src = fs.readFileSync(path.join(RACINE, 'js', 'runner.js'), 'utf8');
  var m = /var BROWSER_ONLY = \/([\s\S]*?)\/;\s*\n/.exec(src);
  if (!m) return null;
  try { return new RegExp(m[1]); } catch (e) { return null; }
})();
function decode(s) {
  return String(s).replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'").replace(/&amp;/g, '&');
}
function blocsAttendusDe(page) {
  var html = fs.readFileSync(path.join(RACINE, page), 'utf8');
  var re = /<figure class="code-block"[\s\S]*?<\/figure>/g, m, n = 0;
  while ((m = re.exec(html))) {
    var f = m[0];
    if (f.indexOf('<pre') < 0) continue;
    var c = /<code[^>]*class="[^"]*language-javascript[^"]*"[^>]*>([\s\S]*?)<\/code>/.exec(f);
    if (!c) continue;
    if (BROWSER_ONLY && BROWSER_ONLY.test(decode(c[1]))) continue;
    n++;
  }
  return n;
}

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
  /* Ce que la mesure DEVAIT couvrir, relevé sur le disque avant d'ouvrir quoi que ce soit. */
  var attendus = 0;
  PAGES.forEach(function (pg) { attendus += blocsAttendusDe(pg); });
  var nonMesurees = [];   // pages qu'on n'a pas pu ouvrir : ni vertes ni rouges, NON MESURÉES

  var chronos = [];
  for (var p = 0; p < PAGES.length; p++) {
    var tPage = Date.now();
    var page = PAGES[p];
    var url = 'file:///' + path.resolve(RACINE, page).split(path.sep).join('/');
    var profil = profilNeuf(p);
    var proc = cp.spawn(CHROME, ['--headless=new', '--remote-debugging-port=0', '--disable-gpu',
      '--allow-file-access-from-files', '--no-first-run', '--disable-extensions',
      '--user-data-dir=' + profil, url], { stdio: 'ignore' });
    var port = await attendrePort(profil, attendre);
    if (!port) {
      console.log('  ' + page + ' : Chrome n\'a pas ouvert de port de débogage — NON MESURÉE');
      nonMesurees.push(page); tuerArbre(proc); fs.rmSync(profil, { recursive: true, force: true }); continue;
    }
    /* La cible est choisie sur son URL : un Chrome étranger ne peut plus être pris
       pour le bon, ce qui était la moitié de l'instabilité mesurée. */
    var cible = null;
    for (var t = 0; t < 40 && !cible; t++) {
      await attendre(250);
      try {
        var liste = await get('http://127.0.0.1:' + port + '/json/list');
        cible = liste.find(function (x) {
          return x.type === 'page' && x.webSocketDebuggerUrl &&
            decodeURI(String(x.url)).toLowerCase() === decodeURI(url).toLowerCase();
        });
      } catch (e) { /* Chrome démarre encore */ }
    }
    if (!cible) {
      console.log('  ' + page + ' : Chrome n\'a pas rendu CETTE page — NON MESURÉE');
      nonMesurees.push(page); tuerArbre(proc); fs.rmSync(profil, { recursive: true, force: true }); continue;
    }
    var cx = connecter(cible.webSocketDebuggerUrl);
    /* On attend un ÉTAT, jamais une durée : document complet, puis un nombre de boutons
       stable sur deux relevés. Une attente en dur de 1 400 ms lisait une page à moitié
       initialisée sans jamais le dire. */
    var stable = 0, precedent = -1;
    for (var ww = 0; ww < 40; ww++) {
      await attendre(250);
      var n = await cx.evaluer('(()=>{try{if(document.readyState!=="complete")return -1;' +
        'return document.querySelectorAll("figure.code-block .code-block__try").length}catch(e){return -1}})()');
      n = typeof n === 'number' ? n : -1;
      if (n >= 0 && n === precedent) { stable++; if (stable >= 2) break; } else stable = 0;
      precedent = n;
    }

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
      /* On attend la FIN de l'exécution, et pas la première sortie visible : runner.js
         retire la classe « is-running » du bouton « Exécuter » dans son end() — le
         bouton « Tester » d'origine, lui, a disparu au premier clic. Sans ce contrôle, un
         programme qui met plus de 400 ms était lu A MOITIE, et son début — pourtant
         juste — se lisait comme une divergence. Constaté sur crypto/lecon-05. */
      var vu = '';
      for (var w = 0; w < 25; w++) {
        await attendre(400);
        var enCours = await cx.evaluer('(()=>{const f=document.querySelectorAll("figure.code-block")[' + b.i + '];' +
          'return f.querySelector("button.is-running")?1:0})()');
        vu = await cx.evaluer('(()=>{const o=window.__f.querySelector(".runner-output");if(!o)return "";' +
          'const l=[...o.querySelectorAll(".runner-output__line")];if(!l.length)return "";' +
          'return l.map(x=>x.textContent).join("\\n")})()') || '';
        if (!enCours && vu && !/Exécution|en cours/i.test(vu)) break;
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
    chronos.push({ page: page, s: (Date.now() - tPage) / 1000, blocs: execs.length });
    if (CHRONO) console.log('  ' + ((Date.now() - tPage) / 1000).toFixed(1) + ' s  ' +
      ('   ' + execs.length).slice(-3) + ' bloc(s)  ' + page);
    cx.sock.destroy();
    tuerArbre(proc);
    await attendre(300);
    try { fs.rmSync(profil, { recursive: true, force: true }); } catch (e) { /* Chrome tient encore un fichier */ }
  }

  console.log('\n=== RÉSUMÉ ===');
  if (chronos.length) {
    var somme = chronos.reduce(function (a, c) { return a + c.s; }, 0);
    var pire = chronos.slice().sort(function (a, b) { return b.s - a.s; })[0];
    console.log('  durée .............................. ' + somme.toFixed(0) + ' s pour ' +
      chronos.length + ' page(s), soit ' + (somme / chronos.length).toFixed(1) + ' s/page' +
      '   (la plus lente : ' + pire.s.toFixed(0) + ' s, ' + pire.blocs + ' blocs, ' + pire.page + ')');
  }
  console.log('  pages demandées .................... ' + PAGES.length +
    (nonMesurees.length ? '   dont ' + nonMesurees.length + ' NON MESURÉE(S)' : ''));
  console.log('  blocs attendus (lus dans le source)  ' + attendus);
  console.log('  blocs cliqués ...................... ' + total +
    (total === attendus ? '   (couverture complète)' : '   ÉCART DE ' + (attendus - total) + ' BLOC(S)'));
  console.log('  DIVERGENTS ......................... ' + divergents);
  console.log('  sans bloc de sortie à comparer ..... ' + sansSortie + '  (solutions, fragments : non jugés)');
  console.log('  bloc .txt voisin = illustration ..... ' + illustrations + '  (schéma, arbre dessiné : non jugé)');
  console.log('  fragments (rien produit / erreur) ... ' + fragments + '  (dépendent d un bloc précédent : non jugés)');
  if (divergents) console.log('\n  pages à corriger : ' + pagesKO.join(', '));

  /* TROIS verdicts distincts, et c'est tout l'objet de la réparation : une couverture
     incomplète n'est PAS un « OK ». L'outil imprimait « concordent partout » après
     avoir jugé 26 % des blocs. */
  if (total !== attendus || nonMesurees.length) {
    console.log('\n  MESURE INCOMPLÈTE — ' + total + ' bloc(s) cliqué(s) sur ' + attendus + ' attendu(s)' +
      (nonMesurees.length ? ', ' + nonMesurees.length + ' page(s) non ouverte(s) : ' + nonMesurees.join(', ') : '') + '.');
    console.log('  Ce n\'est ni un « tout concorde » ni une divergence : ces blocs n\'ont pas été jugés.');
    process.exit(2);
  }
  if (divergents) process.exit(1);
  console.log('\n  Ce que la page imprime et ce que l\'apprenant obtient au clic concordent partout' +
    ' (' + total + ' bloc(s) sur ' + attendus + ' attendu(s)).');
  process.exit(0);
})();
