'use strict';
/**
 * tools/preuves/sql-lecon.js — Cliquer, pour de vrai, sur les boutons « ▶ Exécuter »
 * SQL d'une leçon du site, en `file://` et RÉSEAU COUPÉ.
 *
 * Pourquoi ce script plutôt qu'une page de démonstration : `tools/preuves/sqljs.html`
 * prouve que le moteur tourne, mais pas que `js/runner.js` le branche correctement sur
 * une leçon réelle — profondeur des chemins, résolution de la racine du site, base de
 * démonstration préchargée, rendu du tableau de résultats. C'est ce que celui-ci mesure.
 *
 *   node tools/preuves/sql-lecon.js [pages/sql/lecon-04.html …]
 * Sans argument : un échantillon de leçons SQL. Code de sortie 1 si un bloc échoue ou
 * si Chrome a émis la moindre requête distante.
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
if (!CHROME) { console.log('sql-lecon.js — NON MESURÉ : Chrome introuvable, aucune page n’a été ouverte.'); process.exit(2); }

var pages = process.argv.slice(2).filter(function (a) { return a.indexOf('--') !== 0; });
if (!pages.length) {
  pages = ['pages/sql/lecon-03.html', 'pages/sql/lecon-06.html', 'pages/sql/lecon-10.html',
           'pages/bdd/lecon-05.html'].filter(function (p) { return fs.existsSync(path.join(RACINE, p)); });
}

/* --- LE DÉLAI DE L'OUTIL DOIT ÊTRE PLUS LONG QUE CELUI DE L'OBSERVÉ ---------------
 * Point B1e du chantier V17. Ce script rendait des « MOTEUR KO » que rien ne justifiait,
 * et le plan les croyait liés à la taille du lot (« les 3 derniers blocs de la dernière
 * page »). C'est faux : rejoué quatre fois sur le même lot de trois leçons, le verdict
 * change — une fois 4 fantômes sur la PREMIÈRE page, trois fois zéro. C'était donc une
 * COURSE, et la mesure l'a localisée : `js/runner.js` interrompt une requête SQL après
 * 10 000 ms, et ce script attendait 40 × 250 ms, soit 10 000 ms EXACTEMENT. Les deux
 * délais étaient égaux : quand le moteur prenait tout son budget, l'outil abandonnait au
 * même instant et lisait une sortie vide. Pire, il passait alors au bloc suivant pendant
 * que le Worker était encore occupé — d'où la cascade de blocs consécutifs.
 * Le délai est donc LU dans runner.js, jamais recopié (même discipline que AUTRE_SGBD
 * et TABLE_CREEE pour verif-sql.js), et l'attente vaut ce délai PLUS une marge. */
var DELAI_MOTEUR = (function () {
  var src = fs.readFileSync(path.join(RACINE, 'js', 'runner.js'), 'utf8');
  var m = src.match(/Requête interrompue après[\s\S]{0,200}?\}, (\d+)\);/);
  if (!m) { console.error('sql-lecon.js — délai SQL introuvable dans js/runner.js : le motif a bougé.'); process.exit(2); }
  return parseInt(m[1], 10);
})();
var MARGE = 5000;          // au-delà du moteur : c'est lui qui doit trancher, pas nous
var PAS = 250;
var TOURS = Math.ceil((DELAI_MOTEUR + MARGE) / PAS);

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
  console.log('sql-lecon.js — ' + pages.length + ' leçon(s) · file:// · DNS coupé · SANS --allow-file-access-from-files\n');
  var profilCh = path.join(RACINE, 'scratchpad', '.chrome-preuve-sql');
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
  await new Promise(function (r) { ws.onopen = r; });
  await envoyer('Network.enable'); await envoyer('Runtime.enable');

  var totalBlocs = 0, totalOK = 0, totalKO = 0, totalMoteurKO = 0, totalSansReponse = 0;
  var pagesMalLues = [];

  for (var i = 0; i < pages.length; i++) {
    var url = 'file:///' + path.resolve(RACINE, pages[i]).replace(/\\/g, '/');
    await envoyer('Page.navigate', { url: url });
    /* ⚠️ ON ATTEND UN ÉTAT, PAS UNE DURÉE. Un `dodo(1500)` fixe tenait lieu de chargement,
       et sur une page qui décode plusieurs mégaoctets de scripts embarqués il arrivait
       qu'il ne suffise pas : le script annonçait alors « 0 bloc SQL avec bouton » sur une
       page qui en porte onze, tous cliquables — mesuré le 2026-09-09 sur `sql/lecon-08`,
       vue à 0 bloc dans un lot et à 11 blocs seule. Un zéro pareil ne se lit pas comme
       une anomalie : il se lit comme une page sans blocs, et le lot passe pour vert. */
    for (var w = 0; w < 60; w++) {
      await dodo(PAS);
      var pret = await ev('document.readyState === "complete" && typeof document.querySelectorAll === "function"');
      if (pret) break;
    }
    /* Les solutions d'exercices vivent dans un <details> replié : sans l'ouvrir, leurs
       blocs ne rendent rien et se liraient à tort comme des échecs. L'apprenant, lui,
       clique sur « Voir une solution » avant d'essayer. */
    await ev('document.querySelectorAll("details").forEach(function(d){d.open=true});true');

    /* Puis on attend que runner.js ait POSÉ ses boutons — le vrai état qui nous intéresse.
       On s'arrête dès que le compte se stabilise, sans jamais conclure sur un zéro tant
       que le budget n'est pas épuisé. */
    var n = 0;
    for (var w2 = 0; w2 < 40; w2++) {
      await dodo(PAS);
      n = await ev('document.querySelectorAll(\'[data-runner="sql"] .code-block__try\').length');
      if (n > 0) break;
    }
    /* Un zéro qui reste est peut-être vrai (page sans bloc SQL exécutable) ou faux
       (chargement trop lent). On tranche en regardant la SOURCE : si la page contient des
       blocs `language-sql` et qu'aucun bouton n'est apparu, c'est notre mesure qui a
       échoué, pas la page — et il faut le dire au lieu de compter zéro en silence. */
    if (n === 0) {
      var brut = fs.readFileSync(path.join(RACINE, pages[i]), 'utf8');
      if (/<code class="language-sql">/.test(brut)) {
        pagesMalLues.push(pages[i]);
        console.log(pages[i] + ' — 0 bouton POSÉ alors que la source porte des blocs SQL : ' +
                    'MESURE MANQUÉE (page pas encore prête), et non une page sans blocs.');
        continue;
      }
    }
    console.log(pages[i] + ' — ' + n + ' bloc(s) SQL avec bouton');
    /* Le bouton « Serveur requis » porterait la classe --offline : sa présence
       signifierait que la garde HTTP_OK n'a pas été levée. */
    var offline = await ev('document.querySelectorAll(\'.code-block__try--offline\').length');
    if (offline) { console.log('  ⚠ ' + offline + ' bouton(s) « Serveur requis » — la garde HTTP_OK est encore active'); totalKO += offline; }

    /* On adresse les blocs par leur index dans [data-runner="sql"] : ouvrir un éditeur
       ne change pas cet ordre, alors que compter les boutons, si — le premier clic
       remplace « Exécuter » (.code-block__try) par .code-block__run. */
    for (var b = 0; b < n; b++) {
      totalBlocs++;
      var ouvert = await ev('(function(){var e=document.querySelectorAll(\'[data-runner="sql"]\')[' + b + '].querySelector(".code-block__try"); if(e){e.click();return true;} return false;})()');
      await dodo(250);
      var lance = await ev('(function(){var e=document.querySelectorAll(\'[data-runner="sql"]\')[' + b + '].querySelector(".code-block__run"); if(e){e.click();return true;} return false;})()');
      if (!lance) { totalKO++; console.log('  bloc ' + (b + 1) + ' : KO  aucun bouton « Exécuter » (ouverture : ' + ouvert + ')'); continue; }
      /* SQLite se charge au premier bloc (décodage du base64) : on laisse du temps. */
      var texte = '', fini = false;
      for (var t2 = 0; t2 < TOURS && !fini; t2++) {
        await dodo(PAS);
        texte = await ev('(function(){var o=document.querySelectorAll(\'[data-runner="sql"]\')[' + b + '].querySelector(".runner-output"); return o?o.innerText:"";})()') || '';
        fini = !/Chargement/.test(texte) && /ligne|exécutée|no such|Erreur|erreur|error|failed|n\'a pas pu|⏱/.test(texte);
      }
      /* `\s*` et non un espace obligatoire : quand la sortie se réduit à son en-tête,
         `^RÉSULTAT SQL ` ne matchait pas (il n'y a rien derrière), le résumé valait
         « Résultat SQL » et passait pour un contenu. */
      var resume = texte.replace(/\s+/g, ' ').replace(/^RÉSULTAT SQL\s*/i, '').trim().slice(0, 100);
      /* Un CREATE ou un INSERT ne renvoie aucune ligne : « Requête exécutée » est un
         succès au même titre qu'un tableau de résultats. Seule une erreur SQLite ou un
         moteur qui ne charge pas comptent comme échec. */
      /* ⚠️ QUATRE ISSUES, ET NON TROIS. La distinction est ce qui rend ce script utilisable
         comme étape de `verif.js`. Un bloc qui rend « no such column » n'est PAS une panne :
         c'est SQLite qui fait son travail sur un exemple de leçon volontairement fautif, ou
         sur un schéma déclaré ailleurs dans la page. Le MOTEUR EN ÉCHEC, lui, l'est.
         La quatrième issue est celle qui manquait, et c'est elle qui rendait les faux
         verdicts : une sortie VIDE était rangée avec « moteur en échec » alors qu'elle ne
         dit rien du site — elle dit seulement que L'OUTIL n'a pas attendu assez. Confondre
         « le moteur a dit qu'il ne pouvait pas » et « je n'ai rien lu » revient à faire
         rougir la chaîne pour un défaut de mesure. Les deux sont désormais séparées, et la
         seconde est signalée comme un défaut de CET OUTIL. */
      var moteurKO = /n'a pas pu|⏱/.test(texte);
      /* ⚠️ « SANS RÉPONSE » se juge sur le résumé, PAS sur le texte brut. `runner.js` pose
         l'en-tête « Résultat SQL » dès le lancement, avant toute réponse du Worker : le
         texte brut n'est donc JAMAIS vide une fois le bloc lancé. Testé sur `texte`, la
         détection ne se déclenchait pas, et un bloc non lu était rangé dans « erreur SQL
         du contenu » — c'est-à-dire imputé au SITE, sans faire rougir quoi que ce soit.
         Trouvé en éprouvant le correctif par injection, pas en le relisant. */
      var sansReponse = !moteurKO && !resume && !/Chargement/.test(texte);
      var bon = /\d+ ligne|Requête exécutée/.test(texte) && !moteurKO;
      if (moteurKO) totalMoteurKO++;
      if (sansReponse) totalSansReponse++;
      if (bon) totalOK++; else totalKO++;
      console.log('  bloc ' + (b + 1) + ' : ' +
        (moteurKO ? 'MOTEUR KO ' : sansReponse ? 'SANS RÉPONSE (défaut de mesure : rien lu en ' +
          ((DELAI_MOTEUR + MARGE) / 1000) + ' s, le moteur en prend ' + (DELAI_MOTEUR / 1000) + ')  ' :
         (bon ? 'OK  ' : 'sql ')) + resume);
      /* Une sortie vide laisse le Worker peut-être encore occupé : enchaîner tout de suite
         sur le bloc suivant le ferait échouer à son tour, et c'est ainsi que les fantômes
         arrivaient par grappes consécutives. On laisse le moteur finir son propre délai. */
      if (sansReponse) await dodo(DELAI_MOTEUR);
    }
  }

  console.log('\n--- bilan ---');
  console.log('  blocs SQL cliqués : ' + totalBlocs + '  ·  résultats obtenus : ' + totalOK +
              '  ·  erreurs SQL du contenu : ' + (totalKO - totalMoteurKO - totalSansReponse) +
              '  ·  MOTEUR EN ÉCHEC : ' + totalMoteurKO +
              '  ·  SANS RÉPONSE (défaut de mesure) : ' + totalSansReponse);
  console.log('  attente par bloc : ' + ((DELAI_MOTEUR + MARGE) / 1000) + ' s, contre ' +
              (DELAI_MOTEUR / 1000) + ' s au moteur (délai lu dans js/runner.js).');
  if (pagesMalLues.length) {
    console.log('  ⚠ MESURE MANQUÉE sur ' + pagesMalLues.length + ' page(s) : ' + pagesMalLues.join(', '));
  }
  console.log('  requêtes DISTANTES : ' + distantes.length + (distantes.length ? ' -> ' + distantes.join(', ') : ' (aucune)'));
  /* Un résultat NUL est aussi une panne : si pas un seul bloc n'aboutit alors que la page en
     porte, le moteur est mort d'une façon que le message n'a pas dite — c'est exactement ce qui
     s'est produit le 2026-09-02 (41 blocs cliqués, 0 résultat). */
  var muet = totalBlocs > 0 && totalOK === 0;
  if (muet) console.log("  ⚠ AUCUN bloc n'a abouti : le moteur ne fonctionne pas.");
  /* Un « sans réponse » ou une page manquée font rougir eux aussi, mais pour dire autre
     chose : le site n'est pas en cause, LA MESURE n'a pas été faite. Une preuve qui ne
     prouve rien doit le dire — c'est le sens du point A3 sur verif-clic.js. */
  if (totalSansReponse || pagesMalLues.length) {
    console.log('  ⚠ MESURE INCOMPLÈTE : ' + totalSansReponse + ' bloc(s) sans réponse et ' +
      pagesMalLues.length + ' page(s) manquée(s). Ce verdict ne porte pas sur le site.');
  }
  ws.close(); proc.kill();
  process.exit(totalMoteurKO || muet || totalSansReponse || pagesMalLues.length || distantes.length ? 1 : 0);
})();
