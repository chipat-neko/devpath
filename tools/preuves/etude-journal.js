'use strict';
/**
 * tools/preuves/etude-journal.js — L'étude de cas nº 1 tient-elle ses promesses ?
 *
 * POURQUOI CE SCRIPT. Une étude de cas affirme trois choses à l'apprenant :
 *   1. « voici un programme qui MARCHE » — le bouton « Tester » doit l'exécuter ;
 *   2. « voici CE QU'IL AFFICHE » — la sortie publiée doit être celle du navigateur,
 *      pas celle de Node, et pas une recopie à la main ;
 *   3. « voici la SOLUTION de la modification » — appliquée au programme, elle doit
 *      produire la ligne annoncée.
 * Aucune de ces trois affirmations ne se vérifie en lisant le fichier : il faut ouvrir
 * la page, cliquer, et comparer. C'est ce que fait ce script, dans les conditions de
 * l'apprenant — `file://`, DNS coupé, sans le moindre drapeau de complaisance.
 *
 *   node tools/preuves/etude-journal.js
 * Code de sortie 1 si la sortie diffère, si la solution ne produit pas sa ligne, ou si
 * Chrome a émis la moindre requête distante.
 */
var cp = require('child_process');
var path = require('path');
var http = require('http');
var fs = require('fs');

var RACINE = path.resolve(__dirname, '..', '..');
var PAGE = 'pages/etude-journal.html';
var PORT = 9361;
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
/* Comparaison indulgente sur les blancs de fin de ligne UNIQUEMENT : le navigateur
   rend chaque ligne dans son propre élément, et innerText peut ajouter un espace
   final. Tout le reste — chiffres, ponctuation, ordre — doit coïncider exactement. */
function normaliser(t) {
  return String(t).replace(/\r/g, '').split('\n').map(function (l) { return l.replace(/\s+$/, ''); })
    .join('\n').replace(/\n+$/, '').trim();
}

(async function () {
  var url = 'file:///' + path.resolve(RACINE, PAGE).replace(/\\/g, '/');
  console.log('etude-journal.js — ' + PAGE + ' · file:// · DNS coupé\n');

  var proc = cp.spawn(CHROME, ['--headless=new', '--remote-debugging-port=' + PORT, '--disable-gpu',
    '--no-first-run', '--disable-extensions', '--host-resolver-rules=MAP * ~NOTFOUND',
    '--user-data-dir=' + path.join(RACINE, 'scratchpad', '.chrome-preuve-etude'), 'about:blank'], { stdio: 'ignore' });

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
  /* ⚠️ ON N'INTERROGE PAS LA PAGE AVANT QU'ELLE EXISTE. Un `Runtime.evaluate` envoyé
     trop tôt après `Page.navigate` s'exécute dans le contexte de about:blank et rend 0
     sans la moindre erreur — un « 0 bloc de code » parfaitement faux. On attend donc que
     la page ait un titre ET que js/main.js ait posé les barres des blocs de code. */
  var pret = false;
  for (var tp = 0; tp < 40 && !pret; tp++) {
    await dodo(250);
    pret = !!(await ev('document.readyState === "complete" && document.querySelectorAll(".code-block__bar").length > 0'));
  }
  if (!pret) { console.error("la page n'a pas fini de se construire."); ws.close(); proc.kill(); process.exit(1); }
  /* La solution de la modification vit dans un <details> replié. `innerText` d'un élément
     masqué rend une chaîne VIDE : sans ouvrir, on jugerait « solution introuvable » alors
     qu'elle est là. L'apprenant, lui, clique sur « Voir une solution ». */
  await ev('document.querySelectorAll("details").forEach(function(d){d.open=true});true');
  await dodo(300);

  var fautes = [];

  /* --- 1. La structure de la page ------------------------------------------ */
  var nBlocs = await ev('document.querySelectorAll(".code-block").length');
  var nExec = await ev('document.querySelectorAll(\'[data-runner="js"]\').length');
  var nSkip = await ev('document.querySelectorAll(\'[data-runner="skip"]\').length');
  console.log('blocs de code : ' + nBlocs + '  ·  exécutables : ' + nExec + '  ·  volontairement non exécutables : ' + nSkip);
  /* Un seul bloc doit être exécutable : le programme entier. Si un extrait le devenait,
     l'apprenant cliquerait sur « Tester » et n'obtiendrait rien — ou une erreur. */
  if (nExec !== 1) fautes.push('il devrait y avoir EXACTEMENT 1 bloc exécutable, il y en a ' + nExec);

  var nH2 = await ev('document.querySelectorAll("main h2[id]").length');
  var ancresMortes = await ev(
    '(function(){var m=[];document.querySelectorAll(\'.toc a[href^="#"]\').forEach(function(a){' +
    'if(!document.getElementById(a.getAttribute("href").slice(1)))m.push(a.getAttribute("href"))});return m.join(", ");})()');
  console.log('sections ancrées : ' + nH2 + '  ·  liens de sommaire morts : ' + (ancresMortes || 'aucun'));
  if (ancresMortes) fautes.push('le sommaire pointe vers des ancres inexistantes : ' + ancresMortes);

  /* --- 2. Le programme s'exécute-t-il, et rend-il la sortie publiée ? ------- */
  var attendu = await ev(
    '(function(){var f=Array.from(document.querySelectorAll(".code-block")).find(function(b){' +
    'return b.getAttribute("data-file")==="sortie"});return f?f.querySelector("code").innerText:"";})()');
  if (!attendu) { fautes.push('le bloc « sortie » est introuvable dans la page'); }

  await ev('(function(){var b=document.querySelector(\'[data-runner="js"] .code-block__try\'); if(b){b.click();return true;} return false;})()');
  await dodo(400);
  var lance = await ev('(function(){var b=document.querySelector(\'[data-runner="js"] .code-block__run\'); if(b){b.click();return true;} return false;})()');
  if (!lance) fautes.push('aucun bouton « Exécuter » sur le programme');

  var obtenu = '';
  for (var t2 = 0; t2 < 40 && !obtenu; t2++) {
    await dodo(250);
    obtenu = await ev('(function(){var o=document.querySelector(\'[data-runner="js"]\').querySelector(".runner-output"); return o?o.innerText:"";})()') || '';
    if (/Exécution|Chargement/.test(obtenu)) obtenu = '';
  }
  /* Le cadre de sortie du runner porte un en-tête (« Console ») : on ne compare que les
     lignes qui suivent la première occurrence du début du rapport. */
  var i0 = obtenu.indexOf("=== RAPPORT D'ACCÈS ===");
  var rendu = i0 === -1 ? obtenu : obtenu.slice(i0);
  var a = normaliser(attendu), b = normaliser(rendu);
  var lignesA = a.split('\n'), lignesB = b.split('\n');
  var ecarts = [];
  for (var k = 0; k < Math.max(lignesA.length, lignesB.length); k++) {
    if (lignesA[k] !== lignesB[k]) ecarts.push('  ligne ' + (k + 1) + ' — publié : ' + JSON.stringify(lignesA[k]) + '  ·  navigateur : ' + JSON.stringify(lignesB[k]));
  }
  console.log('\nsortie publiée : ' + lignesA.length + ' ligne(s)  ·  sortie du navigateur : ' + lignesB.length + ' ligne(s)');
  console.log('écarts ligne à ligne : ' + ecarts.length);
  ecarts.slice(0, 8).forEach(function (l) { console.log(l); });
  if (ecarts.length) fautes.push(ecarts.length + ' écart(s) entre la sortie PUBLIÉE et celle du navigateur');

  /* --- 3. La solution de la modification produit-elle sa ligne ? ------------ */
  var attenduModif = await ev(
    '(function(){var f=Array.from(document.querySelectorAll(".code-block")).find(function(b){' +
    'return b.getAttribute("data-file")==="attendu"});return f?f.querySelector("code").innerText.trim():"";})()');
  var codeSolution = await ev(
    '(function(){var f=Array.from(document.querySelectorAll(".code-block")).find(function(b){' +
    'return b.getAttribute("data-file")==="solution"});return f?f.querySelector("code").innerText:"";})()');
  console.log('\nligne annoncée par la modification : ' + JSON.stringify(attenduModif));

  if (!attenduModif || !codeSolution) {
    fautes.push('le bloc « attendu » ou le bloc « solution » est introuvable');
  } else {
    /* On applique LA SOLUTION PUBLIÉE au PROGRAMME PUBLIÉ, tous deux relus dans la page,
       et on exécute le résultat dans le navigateur. Aucune des deux n'est reprise du
       disque : c'est bien ce que l'apprenant a sous les yeux qui est jugé. */
    var obtenuModif = await ev(
      '(function(){' +
      'var prog=document.querySelector(\'[data-runner="js"] code\').innerText;' +
      'var sol=Array.from(document.querySelectorAll(".code-block")).find(function(b){return b.getAttribute("data-file")==="solution"}).querySelector("code").innerText;' +
      'var ancre="  lignes.push(\'volume servi ....... \' + taille(stat.octets));";' +
      'if(prog.indexOf(ancre)===-1) return "ANCRE-INTROUVABLE";' +
      'var modifie=prog.replace(ancre, ancre+"\\n"+sol);' +
      'var vu=[];' +
      'try{ (new Function("console", modifie))({log:function(){vu.push(Array.prototype.join.call(arguments," "))}}); }' +
      'catch(e){ return "ERREUR: "+e.message; }' +
      'var l=vu.join("\\n").split("\\n").filter(function(x){return /taux/.test(x)});' +
      'return l.length?l[0]:"AUCUNE-LIGNE-TAUX";})()');
    console.log('ligne obtenue en appliquant la solution : ' + JSON.stringify(obtenuModif));
    if (normaliser(obtenuModif) !== normaliser(attenduModif)) {
      fautes.push('la solution publiée ne produit pas la ligne annoncée');
    }
  }

  /* --- Bilan --------------------------------------------------------------- */
  console.log('\n--- bilan ---');
  console.log('  requêtes DISTANTES : ' + distantes.length + (distantes.length ? ' -> ' + distantes.join(', ') : ' (aucune)'));
  console.log('  exceptions de page : ' + erreursConsole.length);
  console.log('  fautes : ' + fautes.length);
  fautes.forEach(function (f) { console.log('   ✗ ' + f); });
  if (!fautes.length && !distantes.length) console.log('  ✓ le programme s\'exécute dans le navigateur et rend EXACTEMENT la sortie publiée.');

  ws.close(); proc.kill();
  process.exit(fautes.length || distantes.length ? 1 : 0);
})();
