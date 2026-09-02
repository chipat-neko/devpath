'use strict';
/**
 * tools/preuves/etude-inconnu.js — L'étude de cas nº 6 tient-elle ses promesses ?
 *
 * POURQUOI CE SCRIPT, ET EN QUOI IL DIFFÈRE DES CINQ AUTRES. Cette étude est la seule du
 * site à publier du code dans un langage QUE CETTE MACHINE NE SAIT PAS EXÉCUTER : ni `go`
 * ni `rustc` n'y sont installés. Elle ne peut donc pas prouver « voici ce que ce programme
 * Go affiche ». Ce qu'elle doit prouver, en revanche, est plus exigeant qu'il n'y paraît :
 *
 *   1. « voici le programme » — le Go publié dans la page est, à l'octet près, celui du
 *      fichier `tools/etudes/inconnu/inventaire.go` ;
 *   2. « ce banc marche » — le bouton « Tester » l'exécute DANS LE NAVIGATEUR et rend
 *      EXACTEMENT la sortie publiée juste en dessous, ligne à ligne ;
 *   3. « voici ce que la mesure donne » — chaque ligne du tableau des marqueurs est
 *      recalculée ici par l'outil de mesure, et comparée à ce que la page affiche ;
 *   4. « et ceci n'est pas du Go » — L'AVERTISSEMENT doit être là. C'est le contrôle le
 *      plus important de tout ce fichier : une sortie non prouvée publiée sans dire
 *      qu'elle ne l'est pas serait exactement la faute qui a fondé toute cette chaîne de
 *      chantiers. Une preuve qui ne vérifierait que des chiffres passerait à côté.
 *
 * Conditions de l'apprenant : `file://`, DNS coupé.
 *
 *   node tools/preuves/etude-inconnu.js
 * Code de sortie 1 au moindre écart.
 */
var cp = require('child_process');
var path = require('path');
var http = require('http');
var fs = require('fs');

var RACINE = path.resolve(__dirname, '..', '..');
var PAGE = 'pages/etude-inconnu.html';
var PORT = 9366;
var CHROME = ['C:/Program Files/Google/Chrome/Application/chrome.exe',
              'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
              process.env.LOCALAPPDATA + '/Google/Chrome/Application/chrome.exe'].find(function (p) {
  try { return fs.existsSync(p); } catch (e) { return false; }
});
if (!CHROME) { console.log('Chrome introuvable, rien de mesuré.'); process.exit(0); }

function dodo(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }
function get(url) {
  return new Promise(function (res, rej) {
    http.get(url, function (r) {
      var d = ''; r.on('data', function (c) { d += c; });
      r.on('end', function () { try { res(JSON.parse(d)); } catch (e) { rej(e); } });
    }).on('error', rej);
  });
}
function normaliser(t) {
  return String(t).replace(/\r/g, '').split('\n').map(function (l) { return l.replace(/\s+$/, ''); })
    .join('\n').replace(/\n+$/, '').trim();
}

(async function () {
  var url = 'file:///' + path.resolve(RACINE, PAGE).replace(/\\/g, '/');
  console.log('etude-inconnu.js — ' + PAGE + ' · file:// · DNS coupé\n');

  var proc = cp.spawn(CHROME, ['--headless=new', '--remote-debugging-port=' + PORT, '--disable-gpu',
    '--no-first-run', '--disable-extensions', '--host-resolver-rules=MAP * ~NOTFOUND',
    '--user-data-dir=' + path.join(RACINE, 'scratchpad', '.chrome-preuve-etude6'), 'about:blank'], { stdio: 'ignore' });

  var cible = null;
  for (var t = 0; t < 40 && !cible; t++) {
    await dodo(300);
    try {
      var l = await get('http://127.0.0.1:' + PORT + '/json/list');
      cible = l.find(function (x) { return x.type === 'page' && x.webSocketDebuggerUrl; });
    } catch (e) {}
  }
  if (!cible) { console.error("Chrome n'a pas répondu."); proc.kill(); process.exit(1); }

  var ws = new WebSocket(cible.webSocketDebuggerUrl);
  var id = 0, attentes = new Map(), distantes = [], erreursConsole = [];
  ws.onmessage = function (e) {
    var m = JSON.parse(e.data);
    if (m.id && attentes.has(m.id)) { attentes.get(m.id)(m); attentes.delete(m.id); }
    if (m.method === 'Network.requestWillBeSent' && !/^(file|data|about|blob):/.test(m.params.request.url)) {
      distantes.push(m.params.request.url);
    }
    if (m.method === 'Runtime.exceptionThrown') erreursConsole.push('exception');
  };
  function envoyer(method, params) {
    return new Promise(function (res) {
      var n = ++id; attentes.set(n, res);
      ws.send(JSON.stringify({ id: n, method: method, params: params || {} }));
    });
  }
  async function ev(expr) {
    var r = await envoyer('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: false });
    return r.result && r.result.result ? r.result.result.value : undefined;
  }
  await new Promise(function (r) { ws.onopen = r; });
  await envoyer('Network.enable'); await envoyer('Runtime.enable');
  await envoyer('Page.navigate', { url: url });
  var pret = false;
  for (var tp = 0; tp < 40 && !pret; tp++) {
    await dodo(250);
    pret = !!(await ev('document.readyState === "complete" && document.querySelectorAll(".code-block__bar").length > 0'));
  }
  if (!pret) { console.error("la page n'a pas fini de se construire."); ws.close(); proc.kill(); process.exit(1); }
  /* La solution et la sortie brute vivent dans des <details> repliés : innerText d'un
     élément masqué rend une chaîne VIDE. L'apprenant, lui, clique. */
  await ev('document.querySelectorAll("details").forEach(function(d){d.open=true});true');
  await dodo(300);

  var fautes = [];

  /* --- 1. Structure ---------------------------------------------------------- */
  var nBlocs = await ev('document.querySelectorAll(".code-block").length');
  var nExec = await ev('document.querySelectorAll(\'[data-runner="js"]\').length');
  console.log('blocs de code : ' + nBlocs + '  ·  exécutables : ' + nExec);
  if (nExec !== 1) fautes.push('il devrait y avoir EXACTEMENT 1 bloc exécutable (le banc), il y en a ' + nExec);

  var ancresMortes = await ev(
    '(function(){var m=[];document.querySelectorAll(\'.toc a[href^="#"]\').forEach(function(a){' +
    'if(!document.getElementById(a.getAttribute("href").slice(1)))m.push(a.getAttribute("href"))});return m.join(", ");})()');
  console.log('liens de sommaire morts : ' + (ancresMortes || 'aucun'));
  if (ancresMortes) fautes.push('le sommaire pointe vers des ancres inexistantes : ' + ancresMortes);

  /* --- 2. L'AVERTISSEMENT, contrôle central --------------------------------- */
  /* Cette page publie une sortie que Go n'a pas produite. Si la phrase qui le dit
     disparaissait — d'une réécriture, d'un remplacement trop large — la page mentirait
     par omission, et aucun contrôle de chiffre ne s'en apercevrait. */
  var avertissement = await ev(
    '(function(){var t=document.body.innerText.replace(/\\s+/g," ");' +
    'return {compilateur:/pas de compilateur Go/.test(t), pasGo:/n.est PAS du Go|Ce n.est pas une preuve que le Go compile/.test(t),' +
    ' transcription:/transcription/i.test(t)};})()');
  console.log('avertissement « pas de compilateur Go » : ' + (avertissement && avertissement.compilateur));
  console.log('mention « ce n\'est pas du Go / pas une preuve »  : ' + (avertissement && avertissement.pasGo));
  if (!avertissement || !avertissement.compilateur) {
    fautes.push('la page publie une sortie non produite par Go SANS dire qu’il n’y a pas de compilateur Go');
  }
  if (!avertissement || !avertissement.pasGo) {
    fautes.push('la page ne dit nulle part que ce qui est exécuté n’est pas du Go');
  }

  /* --- 3. Le programme publié est-il celui du fichier ? --------------------- */
  var goDisque = normaliser(fs.readFileSync(path.join(RACINE, 'tools', 'etudes', 'inconnu', 'inventaire.go'), 'utf8'));
  var goPage = await ev(
    '(function(){var b=Array.from(document.querySelectorAll(".code-block")).find(function(x){' +
    'return x.getAttribute("data-file")==="inventaire.go"});return b?b.querySelector("code").innerText:"";})()');
  var goPageN = normaliser(goPage);
  console.log('\nprogramme Go — disque : ' + goDisque.split('\n').length + ' lignes  ·  page : ' +
              (goPageN ? goPageN.split('\n').length : 0) + ' lignes');
  if (!goPageN) {
    fautes.push('le bloc « inventaire.go » est introuvable dans la page');
  } else if (goPageN !== goDisque) {
    var la = goDisque.split('\n'), lb = goPageN.split('\n'), premiere = null;
    for (var q = 0; q < Math.max(la.length, lb.length) && !premiere; q++) {
      if (la[q] !== lb[q]) premiere = 'ligne ' + (q + 1) + ' — fichier : ' + JSON.stringify(la[q]) + ' · page : ' + JSON.stringify(lb[q]);
    }
    fautes.push('le Go publié diffère du fichier — ' + premiere);
  }

  /* --- 4. Le tableau des marqueurs = la mesure, recalculée ici -------------- */
  /* On ne relit pas un chiffre : on refait la mesure et on la confronte à ce que la
     page affiche, marqueur par marqueur. Un tableau périmé se verrait ici. */
  var mesure = require(path.join(RACINE, 'tools', 'etudes', 'inconnu', 'mesure-langages.js')).mesurer();
  var lignesTableau = await ev(
    '(function(){var out=[];document.querySelectorAll("table.etude-choix").forEach(function(t){' +
    't.querySelectorAll("tbody tr").forEach(function(tr){var c=tr.querySelectorAll("th,td");' +
    'if(c.length===3) out.push([c[0].textContent.trim(), c[1].textContent.trim(), c[2].textContent.trim()]);})});' +
    'return out;})()') || [];
  var attenduParNom = {};
  mesure.marqueurs.forEach(function (m) {
    attenduParNom[m.nom] = (m.possede + ' / ' + mesure.programmes.length) + '|' + (m.courant + ' / ' + mesure.programmes.length);
  });
  var vus = 0, discordants = [];
  lignesTableau.forEach(function (l) {
    var attendu = attenduParNom[l[0]];
    if (!attendu) return;                       // ligne d'un autre tableau (les pièges)
    vus++;
    var obtenu = l[1].replace(/\u00a0/g, ' ') + '|' + l[2].replace(/\u00a0/g, ' ');
    if (obtenu !== attendu) discordants.push(l[0] + ' — page : ' + obtenu + ' · mesure : ' + attendu);
  });
  console.log('\ntableau des marqueurs — lignes retrouvées : ' + vus + ' / ' + mesure.marqueurs.length +
              '  ·  discordances : ' + discordants.length);
  discordants.slice(0, 5).forEach(function (d) { console.log('  ✗ ' + d); });
  if (vus !== mesure.marqueurs.length) {
    fautes.push('le tableau publié montre ' + vus + ' marqueurs, la mesure en produit ' + mesure.marqueurs.length);
  }
  if (discordants.length) fautes.push(discordants.length + ' ligne(s) du tableau ne correspondent plus à la mesure');

  /* --- 5. Le banc s'exécute-t-il, et rend-il la sortie publiée ? ------------ */
  var attendu = await ev(
    '(function(){var f=Array.from(document.querySelectorAll(".code-block")).find(function(b){' +
    'return b.getAttribute("data-file")==="sortie"});return f?f.querySelector("code").innerText:"";})()');
  if (!attendu) fautes.push('le bloc « sortie » est introuvable dans la page');

  await ev('(function(){var b=document.querySelector(\'[data-runner="js"] .code-block__try\'); if(b){b.click();return true;} return false;})()');
  await dodo(400);
  var lance = await ev('(function(){var b=document.querySelector(\'[data-runner="js"] .code-block__run\'); if(b){b.click();return true;} return false;})()');
  if (!lance) fautes.push('aucun bouton « Exécuter » sur le banc');

  /* ⚠️ Relever les lignes UNE PAR UNE par textContent : l'innerText du cadre entier
     saute les lignes vides, et ferait croire à un écart qui n'existe pas. */
  var obtenu = null;
  for (var t2 = 0; t2 < 60 && !obtenu; t2++) {
    await dodo(250);
    obtenu = await ev(
      '(function(){var o=document.querySelector(\'[data-runner="js"]\').querySelector(".runner-output");' +
      'if(!o) return null; var l=[]; o.querySelectorAll(".runner-output__line").forEach(function(d){l.push(d.textContent)});' +
      'return l.length?l:null;})()');
    if (obtenu && obtenu.some(function (l) { return /Exécution|Chargement/.test(l); })) obtenu = null;
  }
  var rendu = (obtenu || []).join('\n');
  var lignesA = normaliser(attendu).split('\n'), lignesB = normaliser(rendu).split('\n');
  var ecarts = [];
  for (var k = 0; k < Math.max(lignesA.length, lignesB.length); k++) {
    if (lignesA[k] !== lignesB[k]) {
      ecarts.push('  ligne ' + (k + 1) + ' — publié : ' + JSON.stringify(lignesA[k]) + '  ·  navigateur : ' + JSON.stringify(lignesB[k]));
    }
  }
  console.log('\nbanc — sortie publiée : ' + lignesA.length + ' ligne(s)  ·  sortie du navigateur : ' + lignesB.length + ' ligne(s)');
  console.log('écarts ligne à ligne : ' + ecarts.length);
  ecarts.slice(0, 8).forEach(function (l) { console.log(l); });
  if (ecarts.length) fautes.push(ecarts.length + ' écart(s) entre la sortie PUBLIÉE du banc et celle du navigateur');

  /* --- 6. Ce que la prose affirme de cette sortie --------------------------- */
  var dits = await ev(
    '(function(){var t=document.body.innerText.replace(/\\s+/g," ");' +
    'var n=/([0-9]+) lignes\\. Reprends tes quatre réponses/.exec(t);' +
    'return {nLignes:n?n[1]:null, defer:/est la dernière ligne/.test(t)||/-- fin du rapport -- est la/.test(t)};})()');
  console.log('\nla prose annonce ' + (dits && dits.nLignes) + ' lignes de sortie · le banc en rend ' + lignesB.length);
  if (!dits || !dits.nLignes) {
    fautes.push('la prose ne cite plus le nombre de lignes : le contrôle de cohérence ne mesure rien');
  } else if (Number(dits.nLignes) !== lignesB.length) {
    fautes.push('la prose annonce ' + dits.nLignes + ' lignes, le navigateur en rend ' + lignesB.length);
  }
  if (lignesB[lignesB.length - 1] !== '-- fin du rapport --') {
    fautes.push('la page affirme que « -- fin du rapport -- » sort en dernier ; le navigateur rend : ' +
                JSON.stringify(lignesB[lignesB.length - 1]));
  }

  /* --- 7. La sortie attendue de la modification ----------------------------- */
  /* La page promet que la modification n'AJOUTE qu'une colonne : mêmes articles, mêmes
     soldes, une valeur de plus par ligne. On le vérifie plutôt que de le croire. */
  var modif = await ev(
    '(function(){var b=Array.from(document.querySelectorAll(".code-block")).find(function(x){' +
    'return x.getAttribute("data-file")==="sortie attendue"});return b?b.querySelector("code").innerText:"";})()');
  var lignesM = normaliser(modif || '').split('\n');
  var memesArticles = lignesM.length === lignesB.length &&
    lignesM.every(function (l, i) { return l.split(/\s+/)[0] === lignesB[i].split(/\s+/)[0]; });
  console.log('\nmodification — ' + lignesM.length + ' lignes, colonne MVTS : ' + /MVTS/.test(modif || '') +
              ', mêmes premières colonnes : ' + memesArticles);
  if (!modif) fautes.push('le bloc « sortie attendue » de la modification est introuvable');
  else {
    if (!/MVTS/.test(modif)) fautes.push('la sortie attendue de la modification n’a pas de colonne MVTS');
    if (!memesArticles) fautes.push('la modification change autre chose qu’une colonne : les lignes ne se correspondent plus');
  }

  /* --- Bilan ---------------------------------------------------------------- */
  console.log('\n--- bilan ---');
  console.log('  requêtes DISTANTES : ' + distantes.length + (distantes.length ? ' -> ' + distantes.join(', ') : ' (aucune)'));
  console.log('  exceptions de page : ' + erreursConsole.length);
  console.log('  fautes : ' + fautes.length);
  fautes.forEach(function (f) { console.log('   ✗ ' + f); });
  if (!fautes.length && !distantes.length) {
    console.log('  ✓ le Go publié est celui du fichier, le tableau est celui de la mesure, le banc rend');
    console.log('    EXACTEMENT sa sortie publiée — et la page dit qu’aucun compilateur Go n’a tourné.');
  }

  ws.close(); proc.kill();
  process.exit(fautes.length || distantes.length ? 1 : 0);
})();
