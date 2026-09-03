'use strict';

/**
 * tools/fraicheur/verif-affichage.js — CE QUE L'APPRENANT VOIT D'UNE MARQUE DE FRAÎCHEUR.
 *
 * POURQUOI. Une marque de fraîcheur n'existe pas dans le HTML : le source ne
 * porte qu'un `<span class="fraicheur" data-arrete="…">`. Tout ce que
 * l'apprenant voit — l'année en exposant, l'infobulle, la phrase pour lecteur
 * d'écran, le bilan replié en fin d'article — est construit par
 * `initFraicheur()` dans `js/main.js`, DANS LE NAVIGATEUR. Aucun vérificateur
 * qui lit des fichiers ne peut donc en dire quoi que ce soit. Celui-ci ouvre un
 * vrai Chrome et compare, marque par marque, le source au rendu.
 *
 * CE QU'IL CONTRÔLE, pour chaque page portant au moins une marque :
 *   1. autant de marques rendues que de marques dans le source ;
 *   2. l'exposant suit immédiatement la marque et porte la bonne ANNÉE ;
 *   3. l'exposant est aria-hidden, et une alternative .sr-only le double ;
 *   4. l'infobulle (title) contient la date écrite EN TOUTES LETTRES ;
 *   5. le bilan de fin d'article existe, annonce le bon COMPTE, liste autant
 *      d'entrées que de marques, et chacun de ses liens atteint sa marque ;
 *   6. la page ne déborde pas horizontalement (l'exposant est en `vertical-align:
 *      super`, il pourrait dépasser).
 *
 * La date en toutes lettres est recalculée ICI par une implémentation
 * INDÉPENDANTE (Intl), et non par la table de mois de `js/main.js` : si les deux
 * étaient la même, le contrôle ne prouverait rien.
 *
 * USAGE
 *   node tools/fraicheur/verif-affichage.js              # toutes les pages marquées
 *   node tools/fraicheur/verif-affichage.js pages/x.html # des pages précises
 * Code de sortie : 1 s'il existe au moins un écart, 2 si l'outil n'a pas pu mesurer.
 */

var cp = require('child_process');
var path = require('path');
var http = require('http');
var net = require('net');
var crypto = require('crypto');
var fs = require('fs');
var profilChrome = require('../lib/profil-chrome.js');

var RACINE = path.resolve(__dirname, '..', '..');
var PORT = 9357;
var args = process.argv.slice(2).filter(function (a) { return a.indexOf('--') !== 0; });
/* --progression : sème une progression dans localStorage AVANT de mesurer.
   Un test avec un localStorage vide ment : plusieurs comportements du site (la
   pastille XP, le pied de leçon, la barre de progression du cours) ne
   s'affichent qu'à cette condition, et ils partagent la page avec les marques
   de fraîcheur. */
var AVEC_PROGRESSION = process.argv.indexOf('--progression') !== -1;

var CHROME = ['C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  '/usr/bin/google-chrome', '/usr/bin/chromium'].find(function (p) { return fs.existsSync(p); });
if (!CHROME) { console.log('verif-affichage.js — Chrome introuvable, rien de mesuré.'); process.exit(2); }

process.on('uncaughtException', function (e) {
  console.log('\nverif-affichage.js — ÉCHEC TECHNIQUE, rien n’a pu être mesuré : ' + (e && e.message ? e.message : e));
  process.exit(2);
});

/* ------------------------------------------------------------ les pages ------ */
function pagesMarquees() {
  var out = [];
  (function walk(dir) {
    fs.readdirSync(dir, { withFileTypes: true }).forEach(function (e) {
      var p = path.join(dir, e.name);
      if (e.isDirectory()) return walk(p);
      if (!/\.html$/.test(e.name)) return;
      if (fs.readFileSync(p, 'utf8').indexOf('class="fraicheur"') < 0) return;
      out.push(path.relative(RACINE, p).replace(/\\/g, '/'));
    });
  })(path.join(RACINE, 'pages'));
  return out;
}
var PAGES = args.length ? args : pagesMarquees();

/* ------------------------------------------- la date, recalculée à part ------ */
var MOIS_INTL = new Intl.DateTimeFormat('fr-FR', { month: 'long', timeZone: 'UTC' });
function dateEnToutesLettres(iso) {
  var d = new Date(iso + 'T12:00:00Z');
  var jour = d.getUTCDate();
  return (jour === 1 ? '1er' : String(jour)) + ' ' + MOIS_INTL.format(d) + ' ' + d.getUTCFullYear();
}

/* ------------------------------------------------------------------- CDP ----- */
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
  sock.on('error', function () { /* Chrome fermé brutalement : sans effet */ });
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
  /* Tout appel CDP est borné dans le temps : une commande sans réponse rend
     `undefined` au bout de 15 s au lieu de figer le contrôle pour toujours. */
  function envoyer(method, params) {
    return new Promise(function (r) {
      var mien = ++id;
      var fini = false;
      var minuteur = setTimeout(function () { if (!fini) { fini = true; delete attentes[mien]; r(undefined); } }, 6000);
      attentes[mien] = function (res) { if (fini) return; fini = true; clearTimeout(minuteur); r(res); };
      var msg = Buffer.from(JSON.stringify({ id: mien, method: method, params: params || {} }));
      var mk = crypto.randomBytes(4), e;
      if (msg.length < 126) e = Buffer.from([0x81, 0x80 | msg.length]);
      else if (msg.length < 65536) { e = Buffer.alloc(4); e[0] = 0x81; e[1] = 0xfe; e.writeUInt16BE(msg.length, 2); }
      else { e = Buffer.alloc(10); e[0] = 0x81; e[1] = 0xff; e.writeBigUInt64BE(BigInt(msg.length), 2); }
      var c = Buffer.from(msg);
      for (var k = 0; k < c.length; k++) c[k] ^= mk[k % 4];
      try { sock.write(Buffer.concat([e, mk, c])); } catch (x) { clearTimeout(minuteur); fini = true; r(undefined); }
    });
  }

  return {
    sock: sock,
    envoyer: function (method, params) { return envoyer(method, params); },
    evaluer: function (expression) {
      return envoyer('Runtime.evaluate', { expression: expression, returnByValue: true })
        .then(function (res) { return res && res.result ? res.result.value : undefined; });
    },
  };
}

/* ------------------------------------------------------ ce qu'on lit dans la page */
var SONDE = '(()=>{const m=[...document.querySelectorAll(".fraicheur[data-arrete]")];' +
  'const bilan=document.querySelector(".fraicheur-bilan");' +
  'return JSON.stringify({' +
  ' marques: m.map(el=>{const s=el.nextElementSibling, sr=s&&s.nextElementSibling;' +
  '   return {arrete:el.getAttribute("data-arrete"), id:el.id||"", titre:el.title||"",' +
  '     texte:(el.textContent||"").replace(/\\s+/g," ").trim(),' +
  '     supTag:s?s.tagName:"", supClasse:s?s.className:"", supTexte:s?s.textContent:"",' +
  '     supCache:s?s.getAttribute("aria-hidden"):"",' +
  '     srClasse:sr?sr.className:"", srTexte:sr?sr.textContent:""};}),' +
  ' bilan: bilan?{resume:bilan.querySelector("summary").textContent,' +
  '   ouvert:bilan.open, items:[...bilan.querySelectorAll("li")].map(li=>{' +
  '     const a=li.querySelector("a"); const cible=a?document.querySelector(a.getAttribute("href")):null;' +
  '     return {href:a?a.getAttribute("href"):"", atteint:!!cible, texte:li.textContent};}),' +
  '   note:(bilan.querySelector(".fraicheur-bilan__note")||{}).textContent||""}:null,' +
  ' debord: document.documentElement.scrollWidth - document.documentElement.clientWidth,' +
  ' dansArticle: m.every(el=>!!el.closest("article.prose")),' +
  ' moteur: (typeof window.SyntaxeToast),' +
  /* PREUVE que le mode --progression n'est pas un placebo : la graine est-elle
     dans le stockage, et le site en a-t-il TIRÉ quelque chose de visible ? La
     pastille XP n'apparaît que si la progression est non vide. */
  ' graine: !!(function(){try{return localStorage.getItem("syntaxe-progress")}catch(e){return null}})(),' +
  ' pastilleXP: !!document.querySelector(".xp-badge")' +
  '})})()';

/* ⚠ UN CHROME ORPHELIN QUI ÉCOUTE DÉJÀ SUR CE PORT FAIT MENTIR LA MESURE : on
   se connecterait à SA page, pas à celle qu'on croit ouvrir, et le contrôle
   parlerait d'un autre fichier sans le dire. Vu une fois, après l'arrêt brutal
   d'une passe. On refuse de mesurer plutôt que de mesurer à côté. */
function portOccupe() {
  return new Promise(function (r) {
    var s = net.connect(PORT, '127.0.0.1');
    var fait = false;
    s.on('connect', function () { if (!fait) { fait = true; s.destroy(); r(true); } });
    s.on('error', function () { if (!fait) { fait = true; r(false); } });
    setTimeout(function () { if (!fait) { fait = true; s.destroy(); r(false); } }, 1500);
  });
}

(async function () {
  if (await portOccupe()) {
    console.log('verif-affichage.js — le port ' + PORT + ' est DÉJÀ occupé (Chrome orphelin ?).');
    console.log('  Refus de mesurer : on lirait la page d’un autre processus. Ferme-le et relance.');
    process.exit(2);
  }
  if (!PAGES.length) { console.log('verif-affichage.js — aucune page marquée. Rien à mesurer.'); process.exit(0); }
  console.log('verif-affichage.js — ' + PAGES.length + ' page(s) marquée(s) · Chrome headless · file://\n');
  var ecarts = [], controles = 0, marquesVues = 0;

  for (var p = 0; p < PAGES.length; p++) {
    var page = PAGES[p];
    var src = fs.readFileSync(path.join(RACINE, page), 'utf8');
    var attendus = [];
    var re = /<span class="fraicheur" data-arrete="(\d{4}-\d{2}-\d{2})"/g, mm;
    while ((mm = re.exec(src))) attendus.push(mm[1]);

    var url = 'file:///' + path.resolve(RACINE, page).replace(/\\/g, '/');
    var proc = cp.spawn(CHROME, ['--headless=new', '--remote-debugging-port=' + PORT, '--disable-gpu',
      '--allow-file-access-from-files', '--no-first-run', '--disable-extensions',
      '--window-size=1280,900',
      '--user-data-dir=' + profilChrome.neuf('fraicheur'), url], { stdio: 'ignore' });
    var cible = null;
    for (var t = 0; t < 40 && !cible; t++) {
      await attendre(300);
      try {
        var liste = await get('http://127.0.0.1:' + PORT + '/json/list');
        cible = liste.find(function (x) { return x.type === 'page' && x.webSocketDebuggerUrl; });
      } catch (e) { /* Chrome démarre */ }
    }
    if (!cible) { ecarts.push(page + ' : Chrome n’a pas répondu'); proc.kill(); continue; }
    var cx = connecter(cible.webSocketDebuggerUrl);
    /* ⚠ NE PAS MESURER SUR UN DÉLAI FIXE. La première exécution de cet outil a
       annoncé 6 écarts sur une page qui n'en avait aucun : Chrome créait son
       profil, `js/main.js` (chargé en `defer`) n'avait pas encore tourné, et la
       sonde a lu une page nue. Un vérificateur qui crie au loup une fois sur
       deux ne sert à rien. On attend donc la PREUVE que le moteur a tourné —
       SyntaxeToast est publié par main.js — et on ne mesure qu'après. */
    var pret = 0;
    for (var w = 0; w < 40 && !pret; w++) {
      await attendre(250);
      pret = await cx.evaluer('(typeof window.SyntaxeToast === "function") ? 1 : 0');
    }
    if (!pret) { ecarts.push(page + ' : js/main.js n’a pas tourné après 10 s'); try { cx.sock.destroy(); } catch (e) {} proc.kill(); continue; }
    if (AVEC_PROGRESSION) {
      /* On sème puis on RECHARGE : les scripts du site lisent le stockage au
         chargement, un setItem après coup n'aurait aucun effet visible. */
      var cours = page.split('/')[1];
      var lecon = page.split('/').pop();
      var graine = JSON.stringify({ react: { 'lecon-01.html': 1, 'lecon-02.html': 1, 'lecon-03.html': 1 },
        html: { 'lecon-01.html': 1 } });
      var g = graine.replace(/"react"/, JSON.stringify(cours));
      var essai = await cx.evaluer('(()=>{try{localStorage.setItem("__test","1");return "ok:"+localStorage.getItem("__test")}catch(e){return "ERR:"+e.name+" "+e.message}})()');
      if (String(essai).indexOf('ok:') !== 0) {
        ecarts.push(page + ' : --progression, localStorage inaccessible (' + essai + ')');
      }
      await cx.evaluer('(()=>{try{localStorage.setItem("syntaxe-progress",' + JSON.stringify(g) + ');' +
        'localStorage.setItem("syntaxe-xp",JSON.stringify({xp:340,niveau:3}));' +
        'localStorage.setItem("syntaxe-quiz",JSON.stringify({"' + cours + '/' + lecon + '":{score:4,total:5}}));' +
        '}catch(e){}return 1})()');
      /* ⚠ PAS `location.reload()` PAR Runtime.evaluate : la page est détruite
         avant d'avoir répondu, la promesse n'est jamais résolue et l'outil se
         fige indéfiniment — constaté sur la première passe, bloquée 20 min. On
         passe par la commande CDP, qui, elle, répond. */
      await cx.envoyer('Page.reload', { ignoreCache: true });
      await attendre(1200);
      /* ⚠ LA SOCKET NE SURVIT PAS TOUJOURS AU RECHARGEMENT : les évaluations
         suivantes ne répondaient plus, chacune expirait, et une seule page
         prenait plus de dix minutes. On se reconnecte à la cible. */
      try { cx.sock.destroy(); } catch (e) {}
      var cible2 = null;
      for (var rz = 0; rz < 20 && !cible2; rz++) {
        await attendre(250);
        try {
          var l2 = await get('http://127.0.0.1:' + PORT + '/json/list');
          cible2 = l2.find(function (x) { return x.type === 'page' && x.webSocketDebuggerUrl; });
        } catch (e) { /* Chrome recharge */ }
      }
      if (!cible2) { ecarts.push(page + ' : cible perdue après le rechargement'); proc.kill(); continue; }
      cx = connecter(cible2.webSocketDebuggerUrl);
    }
    /* Après avoir semé et rechargé, on réattend la preuve que main.js a tourné. */
    pret = 0;
    for (var w2 = 0; w2 < 40 && !pret; w2++) {
      await attendre(250);
      pret = await cx.evaluer('(typeof window.SyntaxeToast === "function") ? 1 : 0');
    }
    if (AVEC_PROGRESSION && !pret) { ecarts.push(page + ' : main.js n’a pas tourné après rechargement'); proc.kill(); continue; }
    var brut = await cx.evaluer(SONDE);
    var vu;
    try { vu = JSON.parse(brut || '{}'); } catch (e) { vu = {}; }

    var faute = function (msg) { ecarts.push(page + ' :: ' + msg); };

    controles++;
    /* Diagnostic : si main.js n’a pas tourné, TOUS les contrôles échouent pour
       une seule et même raison. Autant la dire une fois. */
    if (vu.moteur !== 'function') faute('js/main.js n’a pas été exécuté dans cette page (typeof SyntaxeToast = ' + vu.moteur + ')');
    if (!vu.marques) { faute('la sonde n’a rien rendu'); }
    else {
      if (vu.marques.length !== attendus.length) {
        faute('marques : ' + attendus.length + ' dans le source, ' + vu.marques.length + ' rendues');
      }
      vu.marques.forEach(function (m, i) {
        marquesVues++;
        var lettres = dateEnToutesLettres(m.arrete);
        var an = m.arrete.slice(0, 4);
        var ou = 'marque ' + (i + 1) + ' (« ' + m.texte.slice(0, 40) + ' »)';
        if (m.supTag !== 'SUP' || m.supClasse.indexOf('fraicheur__an') < 0) faute(ou + ' : pas d’exposant après elle');
        else if (m.supTexte !== an) faute(ou + ' : exposant « ' + m.supTexte +' », attendu « ' + an + ' »');
        if (m.supCache !== 'true') faute(ou + ' : l’exposant n’est pas aria-hidden');
        if (m.srClasse.indexOf('sr-only') < 0) faute(ou + ' : pas d’alternative pour lecteur d’écran');
        else if (m.srTexte.indexOf(lettres) < 0) faute(ou + ' : alternative « ' + m.srTexte.trim() + ' » sans la date « ' + lettres + ' »');
        if (m.titre.indexOf(lettres) < 0) faute(ou + ' : infobulle « ' + m.titre + ' » sans la date « ' + lettres + ' »');
        if (!m.id) faute(ou + ' : pas d’identifiant, le bilan ne peut pas y renvoyer');
      });
      if (attendus.length && !vu.dansArticle) faute('une marque est hors de <article class="prose">');
      if (!vu.bilan) faute('pas de bilan de fraîcheur en fin d’article');
      else {
        if (vu.bilan.ouvert) faute('le bilan est déplié par défaut (il doit être discret)');
        if (vu.bilan.resume.indexOf(String(attendus.length)) < 0) {
          faute('le bilan annonce « ' + vu.bilan.resume.trim() + ' », or il y a ' + attendus.length + ' marque(s)');
        }
        if (vu.bilan.items.length !== attendus.length) {
          faute('le bilan liste ' + vu.bilan.items.length + ' entrée(s) pour ' + attendus.length + ' marque(s)');
        }
        vu.bilan.items.forEach(function (it, i) {
          if (!it.atteint) faute('le lien nº ' + (i + 1) + ' du bilan (' + it.href + ') n’atteint aucune marque');
          var lettres2 = dateEnToutesLettres(attendus[i] || vu.marques[i] && vu.marques[i].arrete || '');
          if (it.texte.indexOf(lettres2) < 0) faute('l’entrée nº ' + (i + 1) + ' du bilan ne porte pas sa date (« ' + lettres2 + ' »)');
        });
        if (vu.bilan.note.indexOf('ne consulte rien en ligne') < 0) {
          faute('le bilan ne dit pas que le site ne vérifie rien en ligne');
        }
      }
      if (vu.debord > 1) faute('débordement horizontal de ' + vu.debord + ' px');
      if (AVEC_PROGRESSION) {
        if (!vu.graine) faute('--progression : la graine n’est PAS dans localStorage, la mesure ne prouve rien');
        else if (!vu.pastilleXP) faute('--progression : graine posée mais aucune pastille XP — le site ne l’a pas lue');
      }
    }
    try { cx.sock.destroy(); } catch (e) {}
    proc.kill();
    await attendre(200);
  }

  console.log('  pages mesurées : ' + controles + '  ·  marques rendues et comparées : ' + marquesVues);
  if (!ecarts.length) {
    console.log('  ÉCARTS : 0 — ce que le source déclare est exactement ce que Chrome affiche.');
    process.exit(0);
  }
  console.log('  ÉCARTS : ' + ecarts.length);
  ecarts.forEach(function (e) { console.log('    · ' + e); });
  process.exit(1);
})();
