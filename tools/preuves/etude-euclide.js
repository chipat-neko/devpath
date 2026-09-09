'use strict';
/**
 * tools/preuves/etude-euclide.js — L'étude de cas nº 5 tient-elle ses promesses ?
 *
 * POURQUOI CE SCRIPT. Cette étude publie un algorithme et affirme quatre choses :
 *   1. « ce programme calcule le pgcd » — le code PUBLIÉ DANS LA PAGE, exécuté dans le
 *      navigateur, doit rendre le même résultat qu'une force brute écrite ici même,
 *      sur toutes les paires jusqu'à 120 ;
 *   2. « l'identité de Bézout tient » — u × a + v × b = pgcd, sur les mêmes paires ;
 *   3. « ce banc marche » — le bouton « Tester » doit l'exécuter et rendre EXACTEMENT
 *      la sortie publiée ;
 *   4. « la clé privée vaut N » — le chiffre cité dans la PROSE doit être celui que le
 *      banc affiche vraiment.
 * Rien n'est relu sur le disque : tout est pris dans le HTML, comme l'apprenant. La
 * force brute, elle, est écrite ici — sinon on ne vérifierait Euclide que par Euclide.
 * Conditions de l'apprenant : `file://`, DNS coupé.
 *
 *   node tools/preuves/etude-euclide.js
 * Code de sortie 1 au moindre écart.
 */
var cp = require('child_process');
var path = require('path');
var http = require('http');
var fs = require('fs');
var portChrome = require('../lib/port-chrome.js');

var RACINE = path.resolve(__dirname, '..', '..');
var PAGE = 'pages/etude-euclide.html';
/* Le port n'est plus ecrit en dur : Chrome le choisit et l'annonce dans son
   profil (point A6 du chantier V17). Six paires d'outils partageaient un meme
   numero, et un port deja pris fait mesurer LA PAGE D'UN AUTRE sans rien dire.
   Voir tools/lib/port-chrome.js. */
var PORT = 0;
var CHROME = ['C:/Program Files/Google/Chrome/Application/chrome.exe',
              'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
              process.env.LOCALAPPDATA + '/Google/Chrome/Application/chrome.exe'].find(function (p) {
  try { return fs.existsSync(p); } catch (e) { return false; }
});
if (!CHROME) { console.log('etude-euclide.js — NON MESURÉ : Chrome introuvable, aucune page n’a été ouverte.'); process.exit(2); }

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
  console.log('etude-euclide.js — ' + PAGE + ' · file:// · DNS coupé\n');

  var profilCh = path.join(RACINE, 'scratchpad', '.chrome-preuve-etude5');
  portChrome.oublier(profilCh);
  var proc = cp.spawn(CHROME, ['--headless=new', '--remote-debugging-port=0', '--disable-gpu',
    '--no-first-run', '--disable-extensions', '--host-resolver-rules=MAP * ~NOTFOUND',
    '--user-data-dir=' + profilCh, 'about:blank'], { stdio: 'ignore' });
  try { PORT = await portChrome.attendre(profilCh); }
  catch (ePort) { console.log(ePort.message); try { proc.kill(); } catch (e2) {} process.exit(2); }

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
  /* Le domaine de validité vit dans un <details> replié : innerText d'un élément masqué
     rend une chaîne VIDE. L'apprenant, lui, clique. */
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

  /* --- 2. L'algorithme PUBLIÉ, confronté à une force brute écrite ICI --------- */
  /* Le juge ne doit rien connaître d'Euclide : il essaie tous les diviseurs. Si le
     code publié dans la page était altéré, ou n'était plus celui du fichier, l'écart
     se verrait ici — et nulle part ailleurs. */
  var verdict = await ev(
    '(function(){' +
    'var b=Array.from(document.querySelectorAll(".code-block")).find(function(x){' +
    'return x.getAttribute("data-file")==="algo.js"});' +
    'if(!b) return {erreur:"le bloc algo.js est introuvable"};' +
    'var src=b.querySelector("code").innerText;' +
    'var f; try { f=new Function(src+"\\nreturn {pgcd:pgcd, ext:euclideEtendu, inv:inverseModulaire};")(); }' +
    ' catch(e){ return {erreur:"le code publié ne se charge pas : "+e.message}; }' +
    'function brute(a,b){var m=1,x=Math.min(a,b);for(var d=1;d<=x;d++){if(a%d===0&&b%d===0)m=d;}return m;}' +
    'var paires=0, ecartsPgcd=0, ecartsBezout=0, premier=null;' +
    'for(var a=1;a<=120;a++){for(var c=1;c<=120;c++){paires++;' +
    ' var attendu=brute(a,c); var r=f.ext(a,c);' +
    ' if(r.d!==attendu){ecartsPgcd++; if(!premier)premier="pgcd("+a+","+c+") : force brute "+attendu+", publié "+r.d;}' +
    ' if(r.u*a+r.v*c!==r.d){ecartsBezout++; if(!premier)premier="Bézout faux sur ("+a+","+c+")";}' +
    '}}' +
    /* L'inverse modulaire : pour chaque a inversible modulo 97, a x inv ≡ 1. */
    'var inv=0, invFaux=0;' +
    'for(var a2=1;a2<97;a2++){var x=f.inv(a2,97); if(x===null){invFaux++;continue;} inv++; if((a2*x)%97!==1) invFaux++;}' +
    'return {paires:paires, ecartsPgcd:ecartsPgcd, ecartsBezout:ecartsBezout, premier:premier,' +
    ' inversibles:inv, inversesFaux:invFaux};})()');

  if (!verdict || verdict.erreur) {
    fautes.push('impossible de juger le code publié : ' + (verdict && verdict.erreur));
  } else {
    console.log('\npaires jugées par une force brute écrite dans la preuve : ' + verdict.paires);
    console.log('  écarts de pgcd ........ ' + verdict.ecartsPgcd);
    console.log('  identités fausses ..... ' + verdict.ecartsBezout);
    console.log('  inverses modulo 97 .... ' + verdict.inversibles + ' trouvés, ' + verdict.inversesFaux + ' faux');
    if (verdict.ecartsPgcd) fautes.push(verdict.ecartsPgcd + ' écart(s) de pgcd — ' + verdict.premier);
    if (verdict.ecartsBezout) fautes.push(verdict.ecartsBezout + ' identité(s) de Bézout fausse(s) — ' + verdict.premier);
    if (verdict.inversesFaux) fautes.push(verdict.inversesFaux + ' inverse(s) modulaire(s) faux modulo 97');
    if (verdict.inversibles !== 96) fautes.push('modulo 97 (premier), 96 inversibles attendus, ' + verdict.inversibles + ' trouvés');
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

  /* --- 4. La prose cite des chiffres : sont-ils ceux du banc ? -------------- */
  var coherence = await ev(
    '(function(){' +
    'var texte=document.body.innerText.replace(/\\s+/g," ");' +
    'var d=/clé privée d : ([0-9]+)/.exec(texte) || /vaut ([0-9]+)\\. Elle n/.exec(texte);' +
    'var b=Array.from(document.querySelectorAll(".code-block")).find(function(x){' +
    'return x.getAttribute("data-file")==="ce qu\'il affiche"});' +
    'var s=b?b.querySelector("code").innerText:"";' +
    'var mD=/clé privée d = inverse de e mod [0-9]+ \\.+ ([0-9]+)/.exec(s);' +
    'var mC=/message ([0-9]+) chiffré \\.+ ([0-9]+)/.exec(s);' +
    'var mR=/puis déchiffré \\.+ ([0-9]+)/.exec(s);' +
    'var proseD=/Regarde la ligne clé privée d : ([0-9]+)/.exec(texte);' +
    'var proseC=/Le message ([0-9]+) devient ([0-9]+), puis redevient ([0-9]+)/.exec(texte);' +
    'return {bancD:mD?mD[1]:null, bancMsg:mC?mC[1]:null, bancChiffre:mC?mC[2]:null,' +
    ' bancRetrouve:mR?mR[1]:null, proseD:proseD?proseD[1]:null,' +
    ' proseMsg:proseC?proseC[1]:null, proseChiffre:proseC?proseC[2]:null, proseRetour:proseC?proseC[3]:null};})()');

  console.log('\nbanc : d=' + (coherence && coherence.bancD) + ', ' + (coherence && coherence.bancMsg) +
              ' -> ' + (coherence && coherence.bancChiffre) + ' -> ' + (coherence && coherence.bancRetrouve));
  console.log('prose : d=' + (coherence && coherence.proseD) + ', ' + (coherence && coherence.proseMsg) +
              ' -> ' + (coherence && coherence.proseChiffre) + ' -> ' + (coherence && coherence.proseRetour));
  if (!coherence || !coherence.bancD) {
    fautes.push('la clé privée est introuvable dans la sortie du banc');
  } else {
    if (coherence.bancRetrouve !== coherence.bancMsg) {
      fautes.push('le banc ne retrouve pas le message : ' + coherence.bancMsg + ' -> ' + coherence.bancRetrouve);
    }
    if (coherence.proseD && coherence.proseD !== coherence.bancD) {
      fautes.push('la prose annonce une clé privée de ' + coherence.proseD + ', le banc affiche ' + coherence.bancD);
    }
    if (!coherence.proseD) fautes.push("la prose ne cite pas la clé privée : le contrôle de cohérence ne mesure rien");
    if (coherence.proseChiffre && coherence.proseChiffre !== coherence.bancChiffre) {
      fautes.push('la prose annonce ' + coherence.proseChiffre + ' comme message chiffré, le banc affiche ' + coherence.bancChiffre);
    }
  }

  /* --- Bilan ---------------------------------------------------------------- */
  console.log('\n--- bilan ---');
  console.log('  requêtes DISTANTES : ' + distantes.length + (distantes.length ? ' -> ' + distantes.join(', ') : ' (aucune)'));
  console.log('  exceptions de page : ' + erreursConsole.length);
  console.log('  fautes : ' + fautes.length);
  fautes.forEach(function (f) { console.log('   ✗ ' + f); });
  if (!fautes.length && !distantes.length) {
    console.log("  ✓ l'algorithme publié est jugé juste par une force brute indépendante, et le banc rend EXACTEMENT sa sortie publiée.");
  }

  ws.close(); proc.kill();
  process.exit(fautes.length || distantes.length ? 1 : 0);
})();
