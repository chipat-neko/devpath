'use strict';
/**
 * tools/preuves/python-lecon.js — Cliquer, pour de vrai, sur les boutons « ▶ Tester »
 * Python d'une leçon du site, en `file://` et RÉSEAU COUPÉ.
 *
 * Pourquoi ce script plutôt qu'une page de démonstration : `tools/preuves/pyodide.html`
 * prouve que CPython démarre, mais pas que `js/runner.js` le branche correctement sur
 * une leçon réelle — profondeur des chemins, résolution de la racine du site, garde des
 * modules non embarqués, rendu de la console. C'est ce que celui-ci mesure.
 *
 *   node tools/preuves/python-lecon.js [pages/python/lecon-04.html …]
 * Sans argument : un échantillon de leçons Python. Code de sortie 1 si un bloc échoue
 * à démarrer l'interpréteur ou si Chrome a émis la moindre requête distante ; code 2
 * si RIEN N'A PU ÊTRE MESURÉ (Chrome absent, page qui ne finit pas de charger, aucun
 * bloc cliqué).
 *
 * CE QU'IL COMPTE COMME ÉCHEC : uniquement ce qui relève du MOTEUR (interpréteur qui ne
 * démarre pas, délai dépassé, requête distante). Une exception Python — une NameError
 * sur un fragment qui dépend d'un bloc précédent, par exemple — n'en est pas un : c'est
 * une propriété du contenu, que la phase B corrigera exercice par exercice.
 *
 * ⚠️ ATTENDRE UN ÉTAT, JAMAIS UNE DURÉE (point A4 du chantier V18, 2026-11-11).
 * Jusque-là la sonde attendait 1 500 ms après `Page.navigate`, ouvrait les <details>,
 * attendait 300 ms, comptait les boutons, puis passait au bloc suivant dès la PREMIÈRE
 * ligne de sortie. Mesuré sur cette machine chargée (CPU 25 à 100 %), une leçon met de
 * 1,5 à 4,6 s à se charger, et l'état à 1 500 ms est tout ou rien. D'où deux mensonges :
 *   - page pas encore là à 1 800 ms : « 0 bloc(s) Python : 0 avec bouton », la leçon est
 *     SAUTÉE et la sonde sort en 0 — 4 passages sur 5 sautaient une ou deux leçons sur
 *     trois, l'un n'a cliqué que 14 blocs sur 43, tous verts ;
 *   - page arrivée ENTRE 1 500 et 1 800 ms : les <details> n'existaient pas quand on les
 *     a ouverts, les solutions d'exercices restent repliées, et un bloc replié s'exécute
 *     très bien (textContent « Console PythonTrue ») mais rend innerText "" — lu
 *     « MOTEUR KO ». C'est exactement le signalement intermittent du V16 : lecon-03 blocs
 *     12 à 14 et lecon-15 blocs 10, 12, 14 sont LES blocs placés dans un <details>.
 * La sonde attend donc maintenant un ÉTAT : l'URL visée, `readyState === "complete"`,
 * autant de blocs Python que le FICHIER en contient, et le runner passé sur chacun. Elle
 * ouvre les <details> d'un bloc juste avant de le cliquer, lit la console par sa
 * structure (lignes `.runner-output__line`, indépendantes du rendu), et attend la FIN du
 * bloc — le bouton « Exécuter » perd `is-running` — avant de passer au suivant.
 * Elle rejoue enfin LA COURSE ENTRE DEUX BLOCS, un défaut du site trouvé au même point :
 * un bloc lancé pendant qu'un autre tournait affichait la fin de la sortie de l'autre et
 * perdait la sienne (corrigé dans js/runner.js). Une course fausse fait sortir en 1.
 */
var cp = require('child_process');
var path = require('path');
var http = require('http');
var fs = require('fs');
var portChrome = require('../lib/port-chrome.js');

var RACINE = path.resolve(__dirname, '..', '..');
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
if (!CHROME) { console.log('python-lecon.js — NON MESURÉ : Chrome introuvable, aucune page n’a été ouverte.'); process.exit(2); }

var pages = process.argv.slice(2).filter(function (a) { return a.indexOf('--') !== 0; });
if (!pages.length) {
  pages = ['pages/python/lecon-03.html', 'pages/python/lecon-08.html',
           'pages/python/lecon-15.html'].filter(function (p) { return fs.existsSync(path.join(RACINE, p)); });
}

/* Plafonds : ce sont des LIMITES, jamais des attentes — on part dès que l'état est là.
   Chargement d'une page : 60 s (4,6 s mesurées sous charge). Un bloc : 60 s entre le
   clic et sa fin ; le runner coupe lui-même un programme à 15 s, et le premier bloc
   paie en plus le démarrage de l'interpréteur. Un bloc encore « en cours » au plafond
   est un MOTEUR KO. */
var MS_PAGE = 60000, MS_BLOC = 60000;

/* Les blocs Python ÉCRITS dans le fichier : la page chargée doit les montrer tous. */
function blocsDuFichier(p) {
  var h = fs.readFileSync(path.join(RACINE, p), 'utf8');
  return (h.match(/<code\b[^>]*\bclass="[^"]*\blanguage-python\b/g) || []).length;
}

function dodo(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }
function get(url) {
  return new Promise(function (res, rej) {
    http.get(url, function (r) {
      var d = ''; r.on('data', function (c) { d += c; });
      r.on('end', function () { try { res(JSON.parse(d)); } catch (e) { rej(e); } });
    }).on('error', rej);
  });
}

(async function () {
  console.log('python-lecon.js — ' + pages.length + ' leçon(s) · file:// · DNS coupé · SANS --allow-file-access-from-files\n');
  var profilCh = path.join(RACINE, 'scratchpad', '.chrome-preuve-py');
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
  var id = 0, attentes = new Map(), distantes = [];
  ws.onmessage = function (ev) {
    var m = JSON.parse(ev.data);
    if (m.id && attentes.has(m.id)) { attentes.get(m.id)(m); attentes.delete(m.id); }
    if (m.method === 'Network.requestWillBeSent' && !/^(file|data|about|blob):/.test(m.params.request.url)) {
      distantes.push(m.params.request.url);
    }
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
  /* Attendre qu'une expression vaille true, au plus `ms` ; rend la durée, ou -1. */
  async function attendreEtat(expr, ms) {
    var t0 = Date.now();
    while (Date.now() - t0 < ms) {
      if (await ev(expr) === true) return Date.now() - t0;
      await dodo(100);
    }
    return -1;
  }
  function arreter(code) { try { ws.close(); } catch (e) {} try { proc.kill(); } catch (e) {} process.exit(code); }
  await new Promise(function (r) { ws.onopen = r; });
  await envoyer('Network.enable'); await envoyer('Runtime.enable');

  var totalBlocs = 0, totalSortie = 0, totalExcept = 0, totalKO = 0;
  var msPremier = null, arretMoteur = false;
  var BLOCS = 'document.querySelectorAll(\'[data-runner="py"]\')';

  for (var i = 0; i < pages.length; i++) {
    var url = 'file:///' + path.resolve(RACINE, pages[i]).replace(/\\/g, '/');
    var attendus = blocsDuFichier(pages[i]);
    await envoyer('Page.navigate', { url: url });
    /* L'ÉTAT ATTENDU : la bonne page, chargée, avec tous les blocs Python du fichier, et
       le runner passé sur chacun de ceux qui ont une barre d'outils (il pose
       `data-runner` sur tout bloc qu'il examine, bouton ou non).
       ⚠️ L'ADRESSE SE COMPARE SANS LA CASSE (2026-11-11, fusion de la phase A du V18).
       Chrome écrit la lettre du lecteur en MAJUSCULE dans `location.href`, alors que `url`
       garde celle du dossier courant. Lancée depuis `d:\test-claude` (le dossier de l'éditeur),
       la sonde ne voyait donc JAMAIS sa page prête : NON MESURÉ, code 2, en 60 s, sur l'arbre
       intact comme avec la faute « moteur vide » de verif-chaine-mutations.js. Mesuré : depuis
       `D:/test-claude`, code 1 en 6,4 s sur cette faute ; depuis `d:\test-claude`, code 2 en
       60,7 s. Un chemin Windows ne distingue pas la casse : la comparaison non plus. */
    var msCharge = await attendreEtat('location.href.toLowerCase() === ' + JSON.stringify(url.toLowerCase()) +
      ' && document.readyState === "complete"' +
      ' && document.querySelectorAll("code.language-python").length >= ' + attendus +
      ' && Array.prototype.every.call(document.querySelectorAll(".code-block"), function (b) {' +
      '   return !b.querySelector("code.language-python") || !b.querySelector(".code-block__bar") || b.hasAttribute("data-runner"); })', MS_PAGE);
    if (msCharge < 0) {
      console.log(pages[i] + ' — NON MESURÉ : la page n’a pas atteint son état chargé en ' + (MS_PAGE / 1000) +
                  ' s (' + attendus + ' bloc(s) Python attendus d’après le fichier).');
      arreter(2);
    }
    /* Les solutions d'exercices vivent dans un <details> replié : sans l'ouvrir, leurs
       blocs ne rendent rien et se liraient à tort comme des échecs. */
    await ev('document.querySelectorAll("details").forEach(function(d){d.open=true});true');

    var n = await ev(BLOCS + '.length');
    var ecartes = await ev('document.querySelectorAll(\'[data-runner-motif^="module-absent"]\').length');
    var totalPy = await ev('document.querySelectorAll("code.language-python").length');
    console.log(pages[i] + ' — ' + totalPy + ' bloc(s) Python : ' + n + ' avec bouton, ' +
                ecartes + ' écarté(s) pour module non embarqué · page prête en ' + msCharge + ' ms');

    for (var b = 0; b < n; b++) {
      totalBlocs++;
      var t0 = Date.now();
      var BLOC = BLOCS + '[' + b + ']';
      /* Un <details> ajouté ou refermé par un script de la page depuis l'ouverture
         générale : on rouvre ceux qui contiennent CE bloc, juste avant de le cliquer. */
      await ev('(function(){for(var d=' + BLOC + '.closest("details");d;d=d.parentElement&&d.parentElement.closest("details"))d.open=true;return true;})()');
      await ev('(function(){var e=' + BLOC + '.querySelector(".code-block__try"); if(e){e.click();return true;} return false;})()');
      var msBouton = await attendreEtat('!!' + BLOC + '.querySelector(".code-block__run")', 10000);
      var lance = msBouton >= 0 && await ev('(function(){var e=' + BLOC + '.querySelector(".code-block__run"); if(e){e.click();return true;} return false;})()');
      if (!lance) { totalKO++; console.log('  bloc ' + (b + 1) + ' : KO  aucun bouton « Exécuter »'); continue; }
      /* LA FIN DU BLOC, pas sa première ligne : le runner retire `is-running` quand le
         programme a fini, échoué, dépassé ses 15 s, ou quand l'interpréteur n'a pas pu
         démarrer. Passer au bloc suivant avant, c'était lancer deux programmes à la fois. */
      var msFin = await attendreEtat('!' + BLOC + '.querySelector(".code-block__run").classList.contains("is-running")', MS_BLOC);
      if (msPremier === null) msPremier = Date.now() - t0;
      /* La console lue par sa STRUCTURE : une ligne = un `.runner-output__line`. innerText
         dépend du rendu (il vaut "" dans un <details> replié) ; textContent, non. */
      var texte = await ev('Array.prototype.map.call(' + BLOC + '.querySelectorAll(".runner-output__line"), function(l){return l.textContent;}).join("\\n")') || '';
      var resume = texte.replace(/\s+/g, ' ').trim().slice(0, 90);
      var pasDemarre = msFin < 0 || /n'a pas pu démarrer|Impossible de démarrer|Démarrage de Python/.test(texte) || !texte.trim();
      /* ⚠ Chercher « Error » dans le texte affiché est trop large : la leçon 15 imprime
         le Zen de Python, dont une ligne est « Errors should never pass silently. » —
         un programme parfaitement réussi se lisait comme une exception. On s'ancre donc
         sur la trace d'appels ou sur un nom d'erreur EN DÉBUT DE LIGNE. */
      var exception = /Traceback \(most recent call last\)|^[A-Za-z_]*(?:Error|Exception|Interrupt):/m.test(texte) || /⏱/.test(texte);
      if (pasDemarre) { totalKO++; }
      else if (exception) { totalExcept++; }
      else { totalSortie++; }
      console.log('  bloc ' + (b + 1) + ' : ' + (pasDemarre ? 'MOTEUR KO ' : exception ? 'exception ' : 'sortie    ') +
                  (msFin < 0 ? '(toujours en cours après ' + (MS_BLOC / 1000) + ' s) ' : '') + resume);
      /* Un bloc encore « en cours » au plafond : le moteur ne répond plus, et le runner
         réutilise ce même Worker pour le bloc suivant. Attendre 60 s de plus pour chacun
         des blocs restants ne changerait pas le verdict (déjà 1) et coûterait jusqu'à
         42 min sur l'échantillon. On s'arrête là. */
      if (msFin < 0) { arretMoteur = true; break; }
    }
    if (arretMoteur) {
      console.log('  ARRÊT : un bloc est resté « en cours » ' + (MS_BLOC / 1000) + ' s — le moteur ne répond plus, les blocs suivants ne sont pas joués.');
      break;
    }
  }

  /* LA COURSE ENTRE DEUX BLOCS (point A4 du chantier V18). Les blocs ci-dessus sont joués
     l'un après l'autre ; un apprenant, lui, peut lancer un bloc pendant qu'un autre tourne.
     Jusqu'au 2026-11-11 le runner mêlait alors les deux : la console du second affichait la
     fin du premier et perdait la sienne. On rejoue ce cas sur les deux premiers blocs de la
     dernière page (déjà ouverts, donc éditables) : A imprime, calcule 3 s, imprime ; B est
     lancé pendant le calcul de A. Chaque console doit montrer sa seule sortie. */
  var CODE_A = 'import time\nprint("A début")\nt = time.time()\nwhile time.time() - t < 3:\n    pass\nprint("A fin")';
  var CODE_B = 'print("B seul")';
  var course = totalKO ? 'non jouée (le moteur a déjà échoué, verdict 1)'
                       : 'non jouée (moins de deux blocs Python sur la dernière page)';
  var courseFaute = false, courseNonMesuree = false;
  if (!totalKO && n >= 2) {
    var A = BLOCS + '[0]', B = BLOCS + '[1]';
    var poser = function (x, code) {
      return ev('(function(){var ta=' + x + '.querySelector("textarea"); if(!ta) return false; ta.value=' + JSON.stringify(code) + '; return true;})()');
    };
    var lignesDe = function (x) {
      return ev('JSON.stringify(Array.prototype.map.call(' + x + '.querySelectorAll(".runner-output__line"), function(l){return l.textContent;}))');
    };
    if (await poser(A, CODE_A) && await poser(B, CODE_B)) {
      await ev(A + '.querySelector(".code-block__run").click()');
      var msDebutA = await attendreEtat('/A début/.test(' + A + '.querySelector(".runner-output").textContent)', MS_BLOC);
      var aTourne = await ev(A + '.querySelector(".code-block__run").classList.contains("is-running")');
      await ev(B + '.querySelector(".code-block__run").click()');
      var msCourse = await attendreEtat('!' + A + '.querySelector(".code-block__run").classList.contains("is-running")' +
                                        ' && !' + B + '.querySelector(".code-block__run").classList.contains("is-running")', MS_BLOC);
      var la = await lignesDe(A), lb = await lignesDe(B);
      if (msDebutA < 0 || aTourne !== true) {
        courseNonMesuree = true;
        course = 'NON ÉPROUVÉE : A ' + (msDebutA < 0 ? 'n’a rien imprimé' : 'avait déjà fini') + ' quand B a été lancé (A : ' + la + ' · B : ' + lb + ')';
      } else if (msCourse < 0 || la !== JSON.stringify(['A début', 'A fin']) || lb !== JSON.stringify(['B seul'])) {
        courseFaute = true;
        course = 'FAUTE — attendu A : ["A début","A fin"] · B : ["B seul"] ; obtenu A : ' + la + ' · B : ' + lb +
                 (msCourse < 0 ? ' (toujours en cours après ' + (MS_BLOC / 1000) + ' s)' : '');
      } else {
        course = 'OK — A : ' + la + ' · B : ' + lb;
      }
    } else {
      courseNonMesuree = true;
      course = 'NON ÉPROUVÉE : pas d’éditeur dans les deux premiers blocs';
    }
  }

  console.log('\n--- bilan ---');
  console.log('  blocs Python cliqués : ' + totalBlocs +
              '  ·  sortie obtenue : ' + totalSortie +
              '  ·  exception Python : ' + totalExcept +
              '  ·  moteur en échec : ' + totalKO);
  if (msPremier !== null) console.log('  premier bloc (démarrage compris) : ' + msPremier + ' ms');
  console.log('  course entre deux blocs : ' + course);
  console.log('  requêtes DISTANTES : ' + distantes.length + (distantes.length ? ' -> ' + distantes.join(', ') : ' (aucune)'));
  if (totalKO || courseFaute || distantes.length) arreter(1);
  if (!totalBlocs) { console.log('  NON MESURÉ : aucun bloc Python cliqué.'); arreter(2); }
  if (courseNonMesuree) { console.log('  NON MESURÉ : la course entre deux blocs n’a pas pu être jouée.'); arreter(2); }
  arreter(0);
})();
