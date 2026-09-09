'use strict';
/**
 * tools/preuves/etude-recherche.js — L'étude de cas nº 3 tient-elle ses promesses ?
 *
 * POURQUOI CE SCRIPT. Cette étude fait lire le code de la recherche du site, et
 * affirme quatre choses à l'apprenant :
 *   1. « ces extraits sont ceux de js/recherche.js » — chaque extrait publié doit se
 *      retrouver, caractère pour caractère, dans le fichier réel ;
 *   2. « ce banc d'essai marche » — le bouton « Tester » doit l'exécuter ;
 *   3. « voici ce qu'il affiche » — la sortie publiée doit être celle du NAVIGATEUR,
 *      pas celle de Node qui a servi à l'assembler ;
 *   4. « en comptant AUSSI le parcours des listes, le rapport tombe à N » — le chiffre
 *      annoncé doit être celui qu'on obtient en appliquant vraiment la solution.
 * Les points 2 à 4 se mesurent dans les conditions de l'apprenant : `file://`, DNS
 * coupé. Le point 1 se mesure contre le disque.
 *
 *   node tools/preuves/etude-recherche.js
 * Code de sortie 1 au moindre écart.
 */
var cp = require('child_process');
var path = require('path');
var http = require('http');
var fs = require('fs');
var portChrome = require('../lib/port-chrome.js');

var RACINE = path.resolve(__dirname, '..', '..');
var PAGE = 'pages/etude-recherche.html';
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
if (!CHROME) { console.log('etude-recherche.js — NON MESURÉ : Chrome introuvable, aucune page n’a été ouverte.'); process.exit(2); }

function dodo(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }
function get(url) {
  return new Promise(function (res, rej) {
    http.get(url, function (r) {
      var d = ''; r.on('data', function (c) { d += c; });
      r.on('end', function () { try { res(JSON.parse(d)); } catch (e) { rej(e); } });
    }).on('error', rej);
  });
}
/* Indulgence sur les blancs de FIN de ligne uniquement : le navigateur rend chaque
   ligne dans son propre élément et innerText peut ajouter un espace. Le reste —
   caractères, ordre, ponctuation — doit coïncider exactement. */
function normaliser(t) {
  return String(t).replace(/\r/g, '').split('\n').map(function (l) { return l.replace(/\s+$/, ''); })
    .join('\n').replace(/\n+$/, '').trim();
}

(async function () {
  var url = 'file:///' + path.resolve(RACINE, PAGE).replace(/\\/g, '/');
  console.log('etude-recherche.js — ' + PAGE + ' · file:// · DNS coupé\n');

  var profilCh = path.join(RACINE, 'scratchpad', '.chrome-preuve-etude3');
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
  /* ⚠️ Ne pas interroger la page avant qu'elle existe : un Runtime.evaluate envoyé trop
     tôt s'exécute dans about:blank et rend 0 sans erreur. */
  var pret = false;
  for (var tp = 0; tp < 40 && !pret; tp++) {
    await dodo(250);
    pret = !!(await ev('document.readyState === "complete" && document.querySelectorAll(".code-block__bar").length > 0'));
  }
  if (!pret) { console.error("la page n'a pas fini de se construire."); ws.close(); proc.kill(); process.exit(1); }
  /* La solution vit dans un <details> replié : innerText d'un élément masqué rend une
     chaîne VIDE. L'apprenant, lui, clique sur « Voir la solution ». */
  await ev('document.querySelectorAll("details").forEach(function(d){d.open=true});true');
  await dodo(300);

  var fautes = [];

  /* --- 1. Structure ---------------------------------------------------------- */
  var nBlocs = await ev('document.querySelectorAll(".code-block").length');
  var nExec = await ev('document.querySelectorAll(\'[data-runner="js"]\').length');
  var nSkip = await ev('document.querySelectorAll(\'[data-runner="skip"]\').length');
  console.log('blocs de code : ' + nBlocs + '  ·  exécutables : ' + nExec + '  ·  volontairement non exécutables : ' + nSkip);
  if (nExec !== 1) fautes.push('il devrait y avoir EXACTEMENT 1 bloc exécutable (le banc), il y en a ' + nExec);

  var nH2 = await ev('document.querySelectorAll("main h2[id]").length');
  var ancresMortes = await ev(
    '(function(){var m=[];document.querySelectorAll(\'.toc a[href^="#"]\').forEach(function(a){' +
    'if(!document.getElementById(a.getAttribute("href").slice(1)))m.push(a.getAttribute("href"))});return m.join(", ");})()');
  console.log('sections ancrées : ' + nH2 + '  ·  liens de sommaire morts : ' + (ancresMortes || 'aucun'));
  if (ancresMortes) fautes.push('le sommaire pointe vers des ancres inexistantes : ' + ancresMortes);

  /* --- 2. Les extraits sont-ils VRAIMENT ceux de js/recherche.js ? ---------- */
  var extraits = await ev(
    '(function(){var r=[];document.querySelectorAll(\'.code-block[data-file="js/recherche.js"] code\').forEach(function(c){' +
    'r.push(c.innerText)});return r;})()') || [];
  var srcRech = fs.readFileSync(path.join(RACINE, 'js', 'recherche.js'), 'utf8').replace(/\r\n/g, '\n');
  var srcNorm = normaliser(srcRech);
  var absents = 0;
  extraits.forEach(function (ex, i) {
    if (srcNorm.indexOf(normaliser(ex)) === -1) {
      absents++;
      fautes.push('extrait nº ' + (i + 1) + ' introuvable tel quel dans js/recherche.js (1re ligne : ' +
        JSON.stringify(String(ex).split('\n')[0]) + ')');
    }
  });
  console.log('\nextraits publiés de js/recherche.js : ' + extraits.length + '  ·  retrouvés tels quels dans le fichier : ' + (extraits.length - absents));
  if (!extraits.length) fautes.push("aucun extrait de js/recherche.js dans la page — le sélecteur a-t-il changé ?");

  /* Le banc, lui, EMBARQUE la fonction `postings` : elle est désindentée pour devenir
     un programme autonome, donc on compare les deux textes une fois l'indentation
     retirée de chaque ligne. Sans ce contrôle, le banc pourrait faire tourner une
     version périmée du décodage sans que rien ne le signale. */
  var banc = await ev('(function(){var c=document.querySelector(\'[data-runner="js"] code\'); return c?c.innerText:"";})()') || '';
  function aplatir(t) {
    return String(t).replace(/\r/g, '').split('\n').map(function (l) { return l.trim(); }).join('\n');
  }
  var lignesBanc = banc.split('\n');
  var iDeb = lignesBanc.findIndex(function (l) { return /^function postings\(w\) \{$/.test(l); });
  var iFin = iDeb === -1 ? -1 : lignesBanc.findIndex(function (l, k) { return k > iDeb && l === '}'; });
  if (iDeb === -1 || iFin === -1) {
    fautes.push("la fonction `postings` est introuvable dans le banc publié");
  } else {
    var corps = lignesBanc.slice(iDeb, iFin + 1).join('\n');
    var present = aplatir(srcRech).indexOf(aplatir(corps)) !== -1;
    console.log('la fonction `postings` du banc (' + (iFin - iDeb + 1) + ' lignes) est celle de js/recherche.js : ' + present);
    if (!present) fautes.push('la fonction `postings` du banc DIFFÈRE de celle de js/recherche.js');
  }

  /* --- 3. Le banc s'exécute-t-il, et rend-il la sortie publiée ? ------------- */
  var attendu = await ev(
    '(function(){var f=Array.from(document.querySelectorAll(".code-block")).find(function(b){' +
    'return b.getAttribute("data-file")==="sortie"});return f?f.querySelector("code").innerText:"";})()');
  if (!attendu) fautes.push('le bloc « sortie » est introuvable dans la page');

  await ev('(function(){var b=document.querySelector(\'[data-runner="js"] .code-block__try\'); if(b){b.click();return true;} return false;})()');
  await dodo(400);
  var lance = await ev('(function(){var b=document.querySelector(\'[data-runner="js"] .code-block__run\'); if(b){b.click();return true;} return false;})()');
  if (!lance) fautes.push('aucun bouton « Exécuter » sur le banc');

  /* ⚠️ On relève les lignes UNE PAR UNE (chaque ligne de console est un élément), et
     par `textContent`. L'`innerText` du cadre entier, lui, SAUTE les lignes vides :
     un div sans texte ne produit aucun saut de ligne, alors qu'à l'écran la ligne
     existe bel et bien — le CSS lui pose un chevron « › ». Mesurer par innerText
     donnerait 18 lignes là où l'apprenant en voit 21, et ferait croire à un écart. */
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
  for (var k = 0; k < Math.max(lignesA.length, lignesB.length); k++) {
    if (lignesA[k] !== lignesB[k]) {
      ecarts.push('  ligne ' + (k + 1) + ' — publié : ' + JSON.stringify(lignesA[k]) + '  ·  navigateur : ' + JSON.stringify(lignesB[k]));
    }
  }
  console.log('\nsortie publiée : ' + lignesA.length + ' ligne(s)  ·  sortie du navigateur : ' + lignesB.length + ' ligne(s)');
  console.log('écarts ligne à ligne : ' + ecarts.length);
  ecarts.slice(0, 8).forEach(function (l) { console.log(l); });
  if (ecarts.length) fautes.push(ecarts.length + ' écart(s) entre la sortie PUBLIÉE et celle du navigateur');

  /* --- 4. La modification annoncée donne-t-elle bien le rapport publié ? ----- */
  /* La page dit : « le rapport tombe de A× à B× ». On applique la ligne de SOLUTION
     publiée au banc PUBLIÉ, on rejoue dans le navigateur, et on relit le rapport dans
     la sortie du programme modifié. Aucun des deux n'est repris du disque. */
  var annonce = await ev(
    '(function(){var m=/rapport tombe de (\\d+)× à (\\d+)×/.exec(document.body.innerText);' +
    'return m?{avant:Number(m[1]),apres:Number(m[2])}:null;})()');
  var mesure = await ev(
    '(function(){' +
    'var banc=document.querySelector(\'[data-runner="js"] code\').innerText;' +
    'var sol=Array.from(document.querySelectorAll(".code-block")).find(function(b){return b.getAttribute("data-file")==="solution"}).querySelector("code").innerText.trim();' +
    'var lignes=banc.split("\\n");' +
    'var n=0, k=-1;' +
    'for(var i=0;i<lignes.length;i++){ if(lignes[i].indexOf("dedans[liste[p]] = 1;")!==-1){ n++; k=i; } }' +
    'if(n!==1) return "LIGNE-A-MODIFIER-TROUVEE-"+n+"-FOIS";' +
    'function jouer(src){var vu=[];' +
    ' try{ (new Function("console", src))({log:function(){vu.push(Array.prototype.join.call(arguments," "))}}); }' +
    ' catch(e){ return "ERREUR: "+e.message; }' +
    ' return vu.join("\\n");}' +
    'var avant=jouer(banc);' +
    'lignes[k]="    "+sol;' +
    'var apres=jouer(lignes.join("\\n"));' +
    'if(avant.indexOf("ERREUR")===0) return "AVANT "+avant; if(apres.indexOf("ERREUR")===0) return "APRES "+apres;' +
    'function rapport(t){var m=/rapport \\.+ (\\d+) fois moins/.exec(t); return m?Number(m[1]):-1;}' +
    'return {avant:rapport(avant), apres:rapport(apres)};})()');
  console.log('\nrapport annoncé par la page : ' + JSON.stringify(annonce) + '  ·  mesuré dans le navigateur : ' + JSON.stringify(mesure));
  if (!annonce) fautes.push("la page n'annonce pas de rapport avant/après");
  else if (!mesure || typeof mesure !== 'object') fautes.push('la mesure du rapport a échoué : ' + mesure);
  else {
    if (mesure.avant !== annonce.avant) fautes.push('rapport AVANT : la page annonce ' + annonce.avant + ', la mesure donne ' + mesure.avant);
    if (mesure.apres !== annonce.apres) fautes.push('rapport APRÈS : la page annonce ' + annonce.apres + ', la mesure donne ' + mesure.apres);
  }

  /* --- Bilan ---------------------------------------------------------------- */
  console.log('\n--- bilan ---');
  console.log('  requêtes DISTANTES : ' + distantes.length + (distantes.length ? ' -> ' + distantes.join(', ') : ' (aucune)'));
  console.log('  exceptions de page : ' + erreursConsole.length);
  console.log('  fautes : ' + fautes.length);
  fautes.forEach(function (f) { console.log('   ✗ ' + f); });
  if (!fautes.length && !distantes.length) {
    console.log('  ✓ les extraits sont ceux du fichier réel, le banc s\'exécute et rend EXACTEMENT la sortie publiée.');
  }

  ws.close(); proc.kill();
  process.exit(fautes.length || distantes.length ? 1 : 0);
})();
