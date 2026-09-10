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
 * SA COUVERTURE EST ATTENDUE, PAS CONSTATÉE (point B4b du chantier V17). Le compte
 * d'exercices jugés variait d'une passe à l'autre — 327, 323, 323 — sans que rien ne
 * rougisse : la mesure d'une page ouverte trop tôt trouve zéro champ et se lit comme
 * une page sans exercice. Le nombre d'exercices `type:"code"` / `"regex"` / `"sql"`
 * est donc RELEVÉ SUR LE DISQUE avant d'ouvrir Chrome, et exigé. C'est la réparation
 * faite pour `verif-clic.js` au point A3, appliquée ici.
 *
 * USAGE
 *   node tools/preuves/exos-code.js pages/vue/lecon-03.html …   pages précises
 *   node tools/preuves/exos-code.js --tout                      toutes les leçons à exercice de code
 *   node tools/preuves/exos-code.js --echantillon=12            les 12 plus récemment modifiées
 * CODE DE SORTIE : 1 s'il existe au moins un échec NOUVEAU (ou une entrée périmée du
 * relevé), 2 si la mesure est incomplète — rien mesuré, ou moins d'exercices jugés
 * que la page n'en déclare. Un « je n'ai pas pu mesurer » n'est pas un « tout va bien »
 * (doctrine du point A5) et n'est pas non plus une faute de contenu.
 */

var cp = require('child_process');
var path = require('path');
var http = require('http');
var net = require('net');
var crypto = require('crypto');
var fs = require('fs');
var portChrome = require('../lib/port-chrome.js');
var lot = require('../lib/lot-lecons.js');

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
if (!CHROME) { console.log('exos-code.js — NON MESURÉ : Chrome introuvable, aucune page n’a été ouverte.'); process.exit(2); }

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
/* ------------------------------------------------- LA COUVERTURE ATTENDUE ------
   Relevée sur le DISQUE, indépendamment du navigateur : c'est le seul compte qu'un
   Chrome lent ne peut pas fausser. `js/lecon.js` apparie les entrées du bloc
   `data-exos` aux blocs `.exercise` PAR INDEX et abandonne les entrées en excès
   (`if (!entry || !exercises[i]) return;`) : l'attendu s'arrête donc au nombre de
   blocs `.exercise` présents dans la page, sinon on exigerait des champs que le
   moteur ne crée pas.
   TROIS COMPTES DISTINCTS, parce qu'ils ne se jugent pas pareil :
    · `champs`  — tout ce qui reçoit un champ de saisie, quel que soit le type ;
                  c'est l'état qu'on ATTEND avant de mesurer.
    · `stricts` — les `code` / `regex` / `sql`, dont l'absence FAIT ÉCHOUER.
    · `python`  — comptés à part : leur verdict dépend du chargement de Pyodide
                  (8,27 Mo), un écart y est signalé mais ne rougit pas. */
function exosAttendusDe(page) {
  var vide = { champs: 0, stricts: 0, python: 0, lisible: false };
  var h;
  try { h = fs.readFileSync(path.resolve(RACINE, page), 'utf8'); } catch (e) { return vide; }
  /* La BALISE, pas la chaîne : `pages/etude-moteur-exos.html` PARLE de `data-exos` en
     toutes lettres avant de le porter, et un `indexOf` y découpait du texte de leçon. */
  var m = /<script[^>]*\sdata-exos[^>]*>([\s\S]*?)<\/script>/.exec(h);
  if (!m) return { champs: 0, stricts: 0, python: 0, lisible: true };
  var donnees;
  try { donnees = JSON.parse(m[1]); } catch (e) { return vide; }
  if (!Array.isArray(donnees)) return vide;
  var nBlocs = (h.match(/class="exercise"/g) || []).length;
  var out = { champs: 0, stricts: 0, python: 0, lisible: true };
  donnees.forEach(function (e, idx) {
    if (!e || idx >= nBlocs) return;
    out.champs++;
    /* En passe adversariale, seuls les `regex` et les `sql` sont tapés : le script
       injecté saute les autres sans rien produire, l'attendu s'y restreint. */
    if (e.type === 'regex' || e.type === 'sql') out.stricts++;
    else if (e.type === 'code' && !CONTRE) out.stricts++;
    if (e.type === 'python') out.python++;
  });
  return out;
}

/* --echantillon=N : les N leçons à exercice de code les plus récemment modifiées
   (2026-09-10, point B4). C'est ce qui fait entrer cette preuve dans `verif.js
   --complet` : sa passe `--tout` ouvre 265 Chrome, le lot en ouvre douze. Le tri et
   sa limite connue sont écrits dans tools/lib/lot-lecons.js. */
var ECHANTILLON = lot.tailleDemandee(args);
var PAGES = explicites.length ? explicites
          : (TOUT ? lecons() : (ECHANTILLON ? lot.lot(lecons(), ECHANTILLON) : []));
if (!PAGES.length) { console.log('exos-code.js — NON MESURÉ : aucune page passée, rien n’a été ouvert.'); process.exit(2); }
if (ECHANTILLON && !explicites.length && !TOUT) {
  console.log('exos-code.js — ECHANTILLON : les ' + PAGES.length + ' lecon(s) a exercice de code ' +
              'les plus recemment modifiees, sur ' + lecons().length + '. Couverture complete : --tout.');
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
  /* Le TYPE remonte avec chaque ligne : sans lui, un total d'exercices jugés ne peut
     pas être confronté à l'attendu relevé sur le disque, qui est par type. */
  '    const genre = (entree && entree.type) || null;',
  '    if (reponse == null) { sortie.push({ i: i + 1, etat: "sans-solution", type: genre }); continue; }',
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
  '      type: genre,',
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
  /* LES ÉCHECS CONNUS (2026-09-10, point B4). Le relevé complet en a trouvé 31 : ce sont
     des dettes de CONTENU — la solution que la page publie est refusée par le correcteur de
     cette même page — et les corriger est un chantier à part. Sans cette liste, verser la
     preuve dans la chaîne l'aurait peinte en rouge sans rien apprendre de neuf ; avec elle,
     un échec NOUVEAU rougit dès la passe suivante. */
  var connus = {}, vusConnus = {};
  try {
    connus = (JSON.parse(fs.readFileSync(path.join(__dirname, 'exos-code-connus.json'), 'utf8')) || {}).echecs || {};
  } catch (e) { connus = {}; }
  var nConnus = 0, nNouveaux = 0;
  /* ⚠️ SA COUVERTURE VARIAIT, ET IL NE LE DISAIT PAS (2026-09-10, point B4 ; réparé au
     point B4b). Trois passes `--tout` du même dépôt ont rendu 327, 323 et 323 solutions
     jugées : la différence tenait entière dans les pages où AUCUN champ n'était trouvé
     (5, 9, 9), et la liste changeait d'une fois sur l'autre — `js/lecon-03`, jugée seule,
     marche très bien. C'était le défaut soldé au point A3 pour `verif-clic.js` : un outil
     qui juge la moitié de sa cible et sort en 0 se lit comme un outil vert. Désormais le
     compte attendu est LU DANS LE SOURCE, on attend l'ÉTAT « les champs sont là » au lieu
     d'une durée fixe, et ce qui manque encore est NOMMÉ page par page puis sort en 2. */
  var sansChamp = 0, pagesIncompletes = [], nonMesurees = [];
  var attStricts = 0, vusStricts = 0, attPython = 0, vusPython = 0;
  /* ⚠️ LES PAGES QU'ON N'A PAS SU MESURER, tenues à part du début à la fin. Une entrée
     du relevé qui vient d'une de ces pages n'est PAS périmée : elle n'a pas été
     regardée. Confondre les deux ferait retirer une dette bien réelle au seul motif
     qu'un Chrome a été lent — l'inverse exact de ce que ce point répare. */
  var malCouvertes = {};
  var attenduPar = {};
  PAGES.forEach(function (pg) {
    var a = exosAttendusDe(pg);
    attenduPar[pg] = a;
    attStricts += a.stricts;
    attPython += a.python;
    if (!a.lisible) { nonMesurees.push(pg + ' : bloc data-exos illisible'); malCouvertes[pg] = true; }
  });
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
    if (!cible) {
      console.log('  ' + page + ' : Chrome n\'a pas répondu');
      nonMesurees.push(page + ' : Chrome n\'a pas répondu');
      malCouvertes[page] = true;
      proc.kill(); continue;
    }
    var cx = connecter(cible.webSocketDebuggerUrl);

    /* ON ATTEND UN ÉTAT, PAS UNE DURÉE — la règle déjà écrite dans `repli-navigateur.js`
       et payée trois fois dans ce chantier (B1e, B2a, B5). Les 1 200 ms fixes qui
       tenaient lieu d'attente suffisent quand la machine est libre ; dans une passe qui
       ouvre 265 Chrome à la file, elles ne suffisent plus, `initExos()` n'a pas encore
       posé ses champs, et la page se lit « aucun champ de code trouvé ». On attend donc
       que le nombre de champs atteigne celui que la page DÉCLARE, plafond 12 s. */
    var attPage = attenduPar[page] || exosAttendusDe(page);
    var champsVoulus = attPage.champs, nChamps = -1;
    for (var w = 0; w < 48; w++) {
      await attendre(250);
      nChamps = await cx.evaluer('(()=>{try{if(document.readyState!=="complete")return -1;' +
        'return document.querySelectorAll(".exo-try__input").length}catch(e){return -1}})()');
      nChamps = typeof nChamps === 'number' ? nChamps : -1;
      if (nChamps >= champsVoulus) break;
    }

    /* `awaitPromise: true` est indispensable : le script est asynchrone (il attend le
       Worker), et sans lui Runtime.evaluate rend la promesse elle-même, jamais sa
       valeur — la mesure se lit alors « aucun champ de code trouvé ». */
    var brut = await cx.evaluer(SCRIPT);
    var lignes = [];
    try { lignes = JSON.parse(brut || '[]'); } catch (e) { lignes = []; }
    if (!lignes.length) { sansChamp++; console.log('  ' + page + ' : aucun champ de code trouvé'); }

    /* LA COUVERTURE DE CETTE PAGE, confrontée à ce que son source déclare. Ce qui manque
       est NOMMÉ ici, jamais fondu dans un total : un exercice qu'on renonce à juger doit
       pouvoir être relu. */
    var stricts = ['code', 'regex', 'sql'];
    var vusIci = lignes.filter(function (x) {
      return CONTRE ? (x.type === 'regex' || x.type === 'sql') : stricts.indexOf(x.type) !== -1;
    }).length;
    var pyIci = lignes.filter(function (x) { return x.type === 'python'; }).length;
    vusStricts += vusIci;
    vusPython += pyIci;
    var pageIncomplete = vusIci !== attPage.stricts;
    if (pageIncomplete) {
      malCouvertes[page] = true;
      pagesIncompletes.push(page + ' : ' + vusIci + ' / ' + attPage.stricts +
        ' exercice(s) jugé(s) — ' + nChamps + ' champ(s) dans le DOM pour ' +
        attPage.champs + ' déclaré(s)');
    }
    if (pyIci !== attPage.python) {
      console.log('  · ' + page + ' : ' + pyIci + ' / ' + attPage.python +
                  ' exercice(s) python jugé(s)  (Pyodide : signalé, non rougissant)');
      /* Non rougissant ne veut pas dire « mesuré » : un exercice python non jugé
         doit quand même protéger ses entrées du relevé contre la péremption. */
      malCouvertes[page] = true;
    }
    for (var k = 0; k < lignes.length; k++) {
      var r = lignes[k];
      if (r.etat === 'sans-solution') { sansSolution++; continue; }
      if (r.etat === 'juste') { justes++; }
      else {
        echecs++;
        var cle = page + ' #' + r.i;
        var dejaSu = !CONTRE && Object.prototype.hasOwnProperty.call(connus, cle);
        if (dejaSu) { nConnus++; vusConnus[cle] = true; }
        else { nNouveaux++; if (pagesKO.indexOf(page) === -1) pagesKO.push(page); }
        console.log('  ' + (dejaSu ? '·' : '✗') + ' ' + page + ' · exercice ' + r.i +
                    (dejaSu ? '  (échec CONNU, déjà inscrit au relevé)' : ''));
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
  console.log('  pages SANS AUCUN champ trouvé .... ' + sansChamp + '  (rien n\'y a été mesuré)');
  console.log('  exercices attendus (lus au source) ' + attStricts +
              (CONTRE ? '  (regex + sql)' : '  (code + regex + sql)'));
  console.log('  exercices JUGÉS ................... ' + vusStricts +
    (vusStricts === attStricts ? '   (couverture complète)'
                               : '   ÉCART DE ' + (attStricts - vusStricts) + ' EXERCICE(S)'));
  if (attPython) {
    console.log('  exercices python ................. ' + vusPython + ' / ' + attPython +
                '  (Pyodide 8,27 Mo : compté à part, ne fait pas échouer)');
  }
  if (!CONTRE) {
    console.log('  dont ÉCHECS CONNUS ................ ' + nConnus + '  (inscrits dans exos-code-connus.json)');
    console.log('  ÉCHECS NOUVEAUX ................... ' + nNouveaux + '  (seuls ceux-là font échouer)');
  }
  console.log('  durée ............................. ' + ((Date.now() - debut) / 1000).toFixed(1) + ' s');
  if (nNouveaux) console.log('\n  pages en échec : ' + pagesKO.join(', '));
  /* ⚠️ UNE RÉFÉRENCE PÉRIMÉE ABSOUT AUTANT QU'UNE ABSENCE DE CONTRÔLE, et c'est le défaut
     mesuré au point A5 : un contrôle qui ne peut plus rien trouver se lit comme un contrôle
     vert. La liste n'est donc jugée QU'EN passe complète — seule celle-là voit tout — et une
     entrée qui ne correspond plus à un échec fait rougir, comme les cliquets d'ÉGALITÉ du
     vérificateur JavaScript. */
  var perimees = [];
  if (TOUT && !CONTRE && !explicites.length) {
    Object.keys(connus).forEach(function (c) {
      if (vusConnus[c]) return;
      if (malCouvertes[c.split(' #')[0]]) return;
      perimees.push(c);
    });
    if (perimees.length) {
      console.log('\n  ⚠ ' + perimees.length + ' entrée(s) de exos-code-connus.json ne sont PLUS en échec :');
      perimees.forEach(function (c) { console.log('      ' + c + '  — à retirer du fichier'); });
    }
  }

  /* TROIS VERDICTS DISTINCTS, et c'est tout l'objet du point B4b : une couverture
     incomplète n'est PAS un « tout est accepté ». L'outil imprimait « 323 solutions
     acceptées » après en avoir laissé dix-huit de côté sans le savoir. */
  if (pagesIncompletes.length) {
    console.log('\n  PAGES DONT LA COUVERTURE EST INCOMPLÈTE (' + pagesIncompletes.length + ') :');
    pagesIncompletes.forEach(function (l) { console.log('    ' + l); });
  }
  if (nNouveaux || perimees.length) process.exit(1);
  if (pagesIncompletes.length || nonMesurees.length) {
    console.log('\n  MESURE INCOMPLÈTE — ' + vusStricts + ' exercice(s) jugé(s) sur ' + attStricts +
      ' attendu(s)' + (nonMesurees.length ? ', ' + nonMesurees.length + ' page(s) non ouverte(s) : ' +
      nonMesurees.join(', ') : '') + '.');
    console.log('  Ce n\'est ni un « toutes les solutions passent » ni un échec de contenu :');
    console.log('  ces exercices n\'ont pas été jugés.');
    process.exit(2);
  }
  process.exit(0);
})();
