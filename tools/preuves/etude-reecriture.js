'use strict';
/**
 * tools/preuves/etude-reecriture.js — L'étude de cas nº 4 tient-elle ses promesses ?
 *
 * POURQUOI CE SCRIPT. Cette étude publie DEUX programmes et affirme quatre choses :
 *   1. « voici ce que le programme imprime » — la sortie publiée doit être celle que
 *      produit, DANS LE NAVIGATEUR, le code publié nourri du jeu publié ;
 *   2. « la version 2 rend exactement la même sortie » — les deux textes publiés,
 *      exécutés côte à côte, doivent rendre la même chaîne, caractère pour caractère ;
 *   3. « ce banc marche » — le bouton « Tester » doit l'exécuter et rendre la sortie
 *      publiée ;
 *   4. « déplacer l'arrondi change N commandes » — le chiffre annoncé dans le texte
 *      doit être celui que le banc affiche vraiment.
 * Rien n'est relu sur le disque : tout est pris dans le HTML, comme l'apprenant.
 * Conditions de l'apprenant : `file://`, DNS coupé.
 *
 *   node tools/preuves/etude-reecriture.js
 * Code de sortie 1 au moindre écart.
 */
var cp = require('child_process');
var path = require('path');
var http = require('http');
var fs = require('fs');

var RACINE = path.resolve(__dirname, '..', '..');
var PAGE = 'pages/etude-reecriture.html';
var PORT = 9364;
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
  console.log('etude-reecriture.js — ' + PAGE + ' · file:// · DNS coupé\n');

  var proc = cp.spawn(CHROME, ['--headless=new', '--remote-debugging-port=' + PORT, '--disable-gpu',
    '--no-first-run', '--disable-extensions', '--host-resolver-rules=MAP * ~NOTFOUND',
    '--user-data-dir=' + path.join(RACINE, 'scratchpad', '.chrome-preuve-etude4'), 'about:blank'], { stdio: 'ignore' });

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
  /* La solution vit dans un <details> replié : innerText d'un élément masqué rend une
     chaîne VIDE. L'apprenant, lui, clique sur « La solution ». */
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

  /* --- 2. Les DEUX programmes publiés, exécutés dans le navigateur ----------- */
  /* On prend le texte des trois blocs — jeu, version 1, version 2 — dans le HTML,
     on les exécute, et on compare à la sortie publiée. Si quelqu'un modifie un
     programme sans réassembler la page, cet écart le dit. */
  var rejoue = await ev(
    '(function(){' +
    'function bloc(f){var b=Array.from(document.querySelectorAll(".code-block")).find(function(x){' +
    'return x.getAttribute("data-file")===f});return b?b.querySelector("code").innerText:null;}' +
    'var jeu=bloc("le jeu d\'essai");' +
    'var v1=bloc("version 1 — celle qui est en production");' +
    'var v2=bloc("version 2 — la réécriture");' +
    'if(!jeu||!v1||!v2) return {erreur:"bloc manquant : jeu="+!!jeu+" v1="+!!v1+" v2="+!!v2};' +
    'function jouer(src){ try { return (new Function(src+"\\n"+jeu+"\\nreturn releve(vitrine());"))(); }' +
    ' catch(e){ return "ERREUR: "+e.message; } }' +
    'return {v1:jouer(v1), v2:jouer(v2), tailleJeu:jeu.split("\\n").length};})()');

  if (!rejoue || rejoue.erreur) {
    fautes.push('impossible de rejouer les programmes publiés : ' + (rejoue && rejoue.erreur));
  } else {
    var publiee = await ev(
      '(function(){var b=Array.from(document.querySelectorAll(".code-block")).find(function(x){' +
      'return x.getAttribute("data-file")==="sortie du programme"});return b?b.querySelector("code").innerText:"";})()');
    var A = normaliser(publiee).split('\n');
    var B = normaliser(rejoue.v1).split('\n');
    var C = normaliser(rejoue.v2).split('\n');
    var ecartsV1 = 0, ecartsV2 = 0, premier = null;
    for (var k = 0; k < Math.max(A.length, B.length, C.length); k++) {
      if (A[k] !== B[k]) { ecartsV1++; if (!premier) premier = 'ligne ' + (k + 1) + ' — publié : ' + JSON.stringify(A[k]) + ' · v1 : ' + JSON.stringify(B[k]); }
      if (A[k] !== C[k]) ecartsV2++;
    }
    console.log('\njeu publié : ' + rejoue.tailleJeu + ' lignes  ·  sortie publiée : ' + A.length + ' lignes');
    console.log('version 1 rejouée dans le navigateur : ' + B.length + ' lignes, ' + ecartsV1 + ' écart');
    console.log('version 2 rejouée dans le navigateur : ' + C.length + ' lignes, ' + ecartsV2 + ' écart');
    if (ecartsV1) fautes.push(ecartsV1 + ' écart(s) entre la sortie publiée et la version 1 rejouée — ' + premier);
    if (ecartsV2) fautes.push(ecartsV2 + ' écart(s) entre la sortie publiée et la version 2 rejouée');
    if (normaliser(rejoue.v1) !== normaliser(rejoue.v2)) {
      fautes.push('les DEUX programmes publiés ne rendent pas la même sortie : la promesse centrale de la page est fausse');
    } else {
      console.log('les deux programmes publiés rendent la MÊME sortie : oui');
    }
  }

  /* --- 3. Le banc s'exécute-t-il, et rend-il la sortie publiée ? ------------- */
  var attendu = await ev(
    '(function(){var f=Array.from(document.querySelectorAll(".code-block")).find(function(b){' +
    'return b.getAttribute("data-file")==="ce qu\'il affiche"});return f?f.querySelector("code").innerText:"";})()');
  if (!attendu) fautes.push('le bloc « ce qu\'il affiche » est introuvable dans la page');

  await ev('(function(){var b=document.querySelector(\'[data-runner="js"] .code-block__try\'); if(b){b.click();return true;} return false;})()');
  await dodo(400);
  var lance = await ev('(function(){var b=document.querySelector(\'[data-runner="js"] .code-block__run\'); if(b){b.click();return true;} return false;})()');
  if (!lance) fautes.push('aucun bouton « Exécuter » sur le banc');

  /* ⚠️ Relever les lignes UNE PAR UNE par textContent : l'innerText du cadre entier
     saute les lignes vides, et ferait croire à un écart qui n'existe pas. */
  var obtenu = null;
  for (var t2 = 0; t2 < 40 && !obtenu; t2++) {
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
  for (var k2 = 0; k2 < Math.max(lignesA.length, lignesB.length); k2++) {
    if (lignesA[k2] !== lignesB[k2]) {
      ecarts.push('  ligne ' + (k2 + 1) + ' — publié : ' + JSON.stringify(lignesA[k2]) + '  ·  navigateur : ' + JSON.stringify(lignesB[k2]));
    }
  }
  console.log('\nbanc — sortie publiée : ' + lignesA.length + ' ligne(s)  ·  sortie du navigateur : ' + lignesB.length + ' ligne(s)');
  console.log('écarts ligne à ligne : ' + ecarts.length);
  ecarts.slice(0, 8).forEach(function (l) { console.log(l); });
  if (ecarts.length) fautes.push(ecarts.length + ' écart(s) entre la sortie PUBLIÉE du banc et celle du navigateur');

  /* --- 4. Les chiffres du texte sont-ils ceux des blocs ? ------------------- */
  /* La page annonce dans sa PROSE le nombre de commandes touchées par l'arrondi
     déplacé, et le nombre de commandes comparées. Ces deux chiffres doivent se
     retrouver dans les sorties publiées, sinon la prose et les mesures divergent. */
  var coherence = await ev(
    '(function(){' +
    'var texte=document.body.innerText;' +
    'var m=/change le\\s+total de\\s+(\\d+) commandes sur (\\d+)/.exec(texte.replace(/\\s+/g," "));' +
    'var mes=Array.from(document.querySelectorAll(".code-block")).find(function(b){' +
    'return b.getAttribute("data-file")==="node tools/etudes/reecriture/mesurer.js"});' +
    'var s=mes?mes.querySelector("code").innerText:"";' +
    /* Le bloc de mesures contient DEUX comptes de commandes : celui de l\'exercice et
       celui de l\'arrondi déplacé. On ne cherche donc que dans la section voulue —
       sans quoi on comparerait la prose au mauvais chiffre, ce qui est arrivé. */
    'var s2=s.slice(s.indexOf("DÉPLACE UN ARRONDI"));' +
    'if(s.indexOf("DÉPLACE UN ARRONDI")===-1) return {erreur:"section arrondi absente"};' +
    'var t=/commandes dont le total change \\.+ (\\d+)/.exec(s2);' +
    'var c=/commandes comparées \\.+ (\\d+)/.exec(s);' +
    'return {prose:m?[m[1],m[2]]:null, mesure:t?t[1]:null, comparees:c?c[1]:null};})()');
  console.log('\nprose : ' + JSON.stringify(coherence && coherence.prose) +
              '  ·  bloc de mesures : ' + (coherence && coherence.mesure) +
              ' commandes changées sur ' + (coherence && coherence.comparees));
  if (!coherence || !coherence.prose) {
    fautes.push("la prose n'annonce pas le nombre de commandes touchées par l'arrondi déplacé");
  } else {
    if (coherence.prose[0] !== coherence.mesure) {
      fautes.push('la prose annonce ' + coherence.prose[0] + ' commandes touchées, le bloc de mesures en donne ' + coherence.mesure);
    }
    if (coherence.prose[1] !== coherence.comparees) {
      fautes.push('la prose parle de ' + coherence.prose[1] + ' commandes, le bloc de mesures de ' + coherence.comparees);
    }
  }

  /* --- Bilan ---------------------------------------------------------------- */
  console.log('\n--- bilan ---');
  console.log('  requêtes DISTANTES : ' + distantes.length + (distantes.length ? ' -> ' + distantes.join(', ') : ' (aucune)'));
  console.log('  exceptions de page : ' + erreursConsole.length);
  console.log('  fautes : ' + fautes.length);
  fautes.forEach(function (f) { console.log('   ✗ ' + f); });
  if (!fautes.length && !distantes.length) {
    console.log("  ✓ les deux programmes publiés rendent, dans le navigateur, EXACTEMENT la sortie publiée ; le banc aussi.");
  }

  ws.close(); proc.kill();
  process.exit(fautes.length || distantes.length ? 1 : 0);
})();
