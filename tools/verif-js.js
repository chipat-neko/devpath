'use strict';
/**
 * tools/verif-js.js — Exécuter POUR DE VRAI les blocs JavaScript du site.
 *
 * POURQUOI CE SCRIPT EXISTE
 * -------------------------
 * `js/runner.js` pose un bouton « Tester » sur les blocs `language-javascript` qui ne
 * touchent ni au navigateur ni à Node (règle `BROWSER_ONLY`). Un bouton qui rend une
 * erreur est pire qu'une absence de bouton : le panneau PROMET un résultat avant le clic.
 * Le pendant SQL de ce contrôle existe depuis le 2026-08-26 (`verif-sql.js`) et a fait
 * tomber 124 blocs morts à 4 ; côté JavaScript, personne n'avait jamais exécuté quoi que
 * ce soit. L'audit du chantier V17 (point B2) annonçait 451 blocs en erreur sur 2 011 —
 * un chiffre obtenu une fois, à la main, par un outil qui n'a pas été conservé.
 *
 * CE QU'IL REPRODUIT, ET COMMENT IL ÉVITE DE DIVERGER
 * ---------------------------------------------------
 * Le navigateur exécute `(0, eval)(code)` dans un Worker, avec `console.log` détourné.
 * On fait la même chose dans un contexte `vm` de Node, et surtout : la règle qui décide
 * QUELS blocs reçoivent un bouton (`BROWSER_ONLY`) est **lue dans `js/runner.js`**, jamais
 * recopiée — même discipline que `verif-sql.js` pour `AUTRE_SGBD`. Deux exemplaires d'une
 * même règle finissent toujours par diverger, et ce vérificateur mesurerait alors autre
 * chose que ce que voit l'apprenant.
 *
 * ⚠️ CE QU'IL NE PEUT PAS REPRODUIRE. Un Worker de navigateur n'est pas Node : `setTimeout`
 * y existe, mais pas `require`, et les globales diffèrent. Les écarts connus sont neutralisés
 * (voir CONTEXTE ci-dessous). Un bloc qui n'échoue QUE dans Node serait un faux positif : le
 * mode `--erreurs` affiche donc toujours le message, pour qu'il soit jugeable à l'œil.
 *
 * LE REPLI (2026-09-09, point B2b-7). Depuis ce jour, `runner.js` ne se contente plus
 * d'exécuter le bloc seul : s'il échoue sur « X is not defined », il le REJOUE derrière les
 * blocs à bouton qui le précèdent dans la leçon. Ce vérificateur fait exactement pareil —
 * même préambule, même tri (`preambuleQuiCompile`), même enveloppe, même marqueur de fin de
 * préambule — sans quoi il compterait en panne des blocs que l'apprenant voit marcher.
 * ⚠️ La fidélité tient ici à un détail qui a failli passer : préambule et bloc partent dans
 * UN SEUL script. Un premier jet exécutait le préambule bloc par bloc, ce que `vm` permet ;
 * mais le Worker évalue par `(0, eval)`, où les déclarations LEXICALES d'un appel ne
 * survivent pas à cet appel. L'outil annonçait 40 blocs réparés ; dans Chrome, ils
 * affichaient toujours « X is not defined ».
 *
 *   node tools/verif-js.js                  # tous les blocs JS du site
 *   node tools/verif-js.js pages/nodejs     # un dossier ou un fichier
 *   node tools/verif-js.js --erreurs        # ne lister que les blocs en échec
 *   node tools/verif-js.js --causes         # le détail des messages, groupés
 *   node tools/verif-js.js --fixer          # redescendre la référence du cliquet
 * Code de sortie : 1 si le nombre de blocs en erreur DÉPASSE la référence du cliquet.
 */
var fs = require('fs');
var path = require('path');
var vm = require('vm');

var RACINE = path.resolve(__dirname, '..');
var args = process.argv.slice(2);
var SEULEMENT_ERREURS = args.indexOf('--erreurs') !== -1;
var CAUSES = args.indexOf('--causes') !== -1;
var FIXER = args.indexOf('--fixer') !== -1;
var cibles = args.filter(function (a) { return a.indexOf('--') !== 0; });

/* Le cliquet, même principe que pour SQL : le NOMBRE de blocs en erreur ne doit jamais
   augmenter. Il ne s'applique pas quand des cibles sont passées en argument — un
   sous-ensemble n'est pas comparable à la référence du site entier. */
var ATTENDU = path.join(__dirname, 'verif-js-attendu.json');

/* La règle du bouton est LUE dans runner.js, jamais recopiée. */
function lireMotif(nom) {
  var src = fs.readFileSync(path.join(RACINE, 'js', 'runner.js'), 'utf8');
  var m = src.match(new RegExp('var ' + nom + ' = (/[\\s\\S]*?/);'));
  if (!m) throw new Error(nom + ' introuvable dans js/runner.js');
  return eval(m[1]);
}
var BROWSER_ONLY = lireMotif('BROWSER_ONLY');

/* Les autres règles du bouton sont des FONCTIONS, pas des motifs : un bloc qui parse
   entièrement en JSON est un fichier de données, et un bloc qui appelle `test("…")` est
   une suite de tests que seul un lanceur sait exécuter. Elles sont lues dans runner.js
   pour la même raison que BROWSER_ONLY — ce vérificateur doit décider exactement comme le
   navigateur, sinon il mesure autre chose. */
function lireFonction(nom) {
  var src = fs.readFileSync(path.join(RACINE, 'js', 'runner.js'), 'utf8');
  var i = src.indexOf('function ' + nom + '(');
  if (i < 0) throw new Error(nom + ' introuvable dans js/runner.js');
  var j = src.indexOf('\n  }', i);
  if (j < 0) throw new Error('fin de ' + nom + ' introuvable');
  return eval('(' + src.slice(i, j + 4) + ')');
}
var estUnFichierJson = lireFonction('estUnFichierJson');
var estUneSuiteDeTests = lireFonction('estUneSuiteDeTests');
var estUnFragmentServeur = lireFonction('estUnFragmentServeur');
var estDuDomDePage = lireFonction('estDuDomDePage');
var estUnServiceWorker = lireFonction('estUnServiceWorker');
var neCompilePas = lireFonction('neCompilePas');
/* ⚠️ LA SEULE RÈGLE QUI PREND UN SECOND ARGUMENT (2026-09-09, point B2b-8) : les blocs de
   navigateur qui PRÉCÈDENT celui qu'on examine dans la leçon. Toutes les autres jugent un
   bloc seul ; celle-ci répond à une panne qui n'existe QUE dans un contexte — un `bouton`
   ou un `ctx` né d'un `document.querySelector` dans un bloc écarté, donc absent du
   préambule du repli. Lue, jamais recopiée, comme les autres. */
var heriteDuNavigateur = lireFonction('heriteDuNavigateur');
/* LE FRAGMENT ORPHELIN (2026-09-09, point B2b-10) : la seule regle qui demande la page
   ENTIERE — un nom declare plus bas est fourni par la lecon, meme si le repli ne peut pas
   le donner. Lue, jamais recopiee, comme les autres. */
var estUnFragmentOrphelin = lireFonction('estUnFragmentOrphelin');
/* Le REPLI (2026-09-09, point B2b-7) : quand rejouer, et comment envelopper le bloc rejoué.
   Ces deux règles sont LUES elles aussi — si ce vérificateur devinait l'enveloppe au lieu de
   la lire, il mesurerait un moteur qui n'existe pas. */
var meriteUnRepli = lireFonction('meriteUnRepli');
var envelopperPourRepli = lireFonction('envelopperPourRepli');
var preambuleQuiCompile = lireFonction('preambuleQuiCompile');
/* Le RÉ-ANCRAGE (2026-09-09, point B2b-9) : quand le repli échoue à son tour sur un nom
   manquant, quel préfixe RETRANCHÉ retenter. Lue elle aussi — c'est une règle qui décide
   ce que l'apprenant voit, et deux exemplaires finiraient par diverger. */
var preambuleReAncre = lireFonction('preambuleReAncre');
/* L'ÉLAGAGE PAR LE HAUT (2026-09-09, point B2b-14) : le pendant du ré-ancrage, quand le
   repli échoue sur une zone morte temporelle et non sur un nom manquant. Lue elle aussi. */
var preambuleElague = lireFonction('preambuleElague');

function dec(s) {
  return s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"')
          .replace(/&#39;/g, "'").replace(/&amp;/g, '&');
}

/* On récupère le bloc ET son `data-file` : `pages/nodejs/lecon-03.html` porte cinq
   `package.json` annoncés `language-javascript`, et le nom du fichier est la seule chose
   qui les distingue d'un programme. */
function blocsJs(fichier) {
  var src = fs.readFileSync(fichier, 'utf8'), out = [];
  var re = /<figure class="code-block"([^>]*)>[\s\S]*?<code class="language-javascript">([\s\S]*?)<\/code>/g, m;
  while ((m = re.exec(src))) {
    var attrs = m[1] || '';
    var df = attrs.match(/data-file="([^"]*)"/);
    out.push({ code: dec(m[2]).trim(), fichier: df ? df[1] : '' });
  }
  return out;
}

function lecons(cible) {
  var out = [];
  var base = cible ? path.resolve(RACINE, cible) : path.join(RACINE, 'pages');
  (function marche(d) {
    var st; try { st = fs.statSync(d); } catch (e) { return; }
    if (st.isFile()) { if (/\.html$/.test(d)) out.push(d); return; }
    for (var f of fs.readdirSync(d)) marche(path.join(d, f));
  })(base);
  return out.filter(function (f) { return /lecon-\d+\.html$/.test(f); });
}

/* --- LES ERREURS ANNONCÉES, ET POURQUOI ELLES NE COMPTENT PAS COMME DES PANNES -------
 * Certains blocs LÈVENT une erreur à dessein : c'est la leçon (`try/catch`, `throw`,
 * validation qui refuse). L'audit en avait dénombré 67. On ne les devine pas à partir du
 * message — un motif pareil couvrirait aussi les vraies pannes : on les reconnaît à ce
 * que la page ÉCRIT à côté du code, en commentaire, avant l'exécution. */
var ERREUR_ANNONCEE = /\/\/[^\n]*\b(erreur|Erreur|ERREUR|throw|lève|leve|refuse|rejett?e|échoue|echoue|plante|invalide)\b/;

/* --- L'ERREUR ANNONCÉE PAR SON NOM TECHNIQUE (2026-09-09, point B2b-13) ---------------
 * Le motif ci-dessus ne connaît que des mots français. Or une leçon annonce le plus
 * souvent l'erreur telle que l'apprenant la LIRA : `//=> TypeError: Assignment to
 * constant variable.` Des blocs étaient donc comptés en panne alors que la page écrit,
 * juste à côté de la ligne fautive, le message exact que le clic produit.
 *
 * ⚠️ LA RÈGLE EXIGE LE NOM **ET** LE DÉBUT DU MESSAGE, et ce n'est pas un excès de
 * prudence : la mesure a montré ce que le nom seul aurait masqué. `js/lecon-64.html` #7
 * porte `// TypeError (circular)` et échouait sur « TypeError: Converting circular
 * structure to JSON » — le nom concordait, l'annonce avait l'air juste, et c'était en
 * réalité un DÉFAUT DE CE VÉRIFICATEUR (son `structuredClone` contrefait, corrigé plus
 * bas). Le nom seul l'aurait enterré ; l'exigence du message l'a laissé en panne, donc
 * visible, donc corrigé.
 *
 * Le nom est cherché dans les COMMENTAIRES SEULS : un `throw new TypeError("…")` du corps
 * n'est pas une annonce faite au lecteur, et une chaîne qui cite un nom d'erreur non plus. */
function commentairesDe(code) {
  var out = [];
  code.replace(/\/\*[\s\S]*?\*\//g, function (c) { out.push(c); return c; });
  code.replace(/(^|[^:"'`\\])\/\/[^\n]*/gm, function (c) { out.push(c); return c; });
  return out.join('\n');
}
function erreurAnnoncee(code, msg) {
  if (ERREUR_ANNONCEE.test(code)) return true;
  if (!msg) return false;
  var m = /^([A-Za-z]*Error)\b:?\s*([\s\S]*)$/.exec(msg);
  if (!m) return false;
  var com = commentairesDe(code);
  if (!new RegExp('\\b' + m[1] + '\\b').test(com)) return false;
  /* Les trois premiers mots du message : assez pour séparer deux `TypeError` qui n'ont
     rien à voir, assez peu pour tolérer une fin de message qui varie — le nom de la
     propriété lue, par exemple. */
  var debut = m[2].split(/\s+/).slice(0, 3).join(' ');
  return !!debut && com.toLowerCase().indexOf(debut.toLowerCase()) !== -1;
}

/* --- LES GLOBALES D'UN VRAI WORKER, ET POURQUOI CETTE LISTE EXISTE (2026-09-09, B2b-2)
 * Ce contexte a été écrit « au minimum » : console, minuteries, `self`. Résultat, il
 * déclarait EN PANNE des blocs qui marchent parfaitement chez l'apprenant, simplement
 * parce qu'un contexte `vm` nu ne possède pas `TextEncoder`. **16 blocs échouaient sur un
 * `X is not defined` où X est une globale standard d'un Worker** : TextEncoder (4),
 * performance (3), EventTarget (3), PerformanceObserver (2), FormData, ReadableStream,
 * URL, WebSocket (1 chacun). L'outil ne mesurait donc pas le site : il mesurait sa propre
 * pauvreté, et un bouton retiré sur cette foi aurait été un bouton VIVANT retiré.
 *
 * LA LISTE N'EST PAS DEVINÉE, ELLE EST MESURÉE DANS UN VRAI CHROME. Une page ouverte en
 * `file://`, DNS coupé, crée un Worker par la même mécanique que `runner.js` (Blob → Worker)
 * et lui demande, pour chaque nom, s'il existe ET s'il FONCTIONNE. Les 13 essais exécutés
 * rendent tous « MARCHE » — y compris `crypto.subtle`, car Chrome tient `file://` pour un
 * contexte sécurisé. 0 requête distante pendant la mesure.
 *
 * ⚠️ CE QUI EST DÉLIBÉRÉMENT ABSENT, ET C'EST LE POINT DÉLICAT. `fetch`, `WebSocket`,
 * `XMLHttpRequest`, `indexedDB` et `caches` EXISTENT aussi dans ce Worker — la mesure le
 * dit — mais ils exigent un serveur ou le réseau, que le site n'a pas. Les fournir ferait
 * ABOUTIR ici des blocs qui échouent chez l'apprenant : exactement l'inverse du but. Ils
 * restent donc hors du contexte, et un bloc qui les appelle reste compté en panne.
 *
 * SECONDE PASSE DE LA MÊME SONDE (2026-09-09, point B2b-4), sur 30 noms du DOM cette
 * fois. Elle a d'abord confirmé ce qu'on venait chercher — `HTMLElement`, `customElements`,
 * `document`, `window`, `Element`, `Node`, `DOMParser`, `MutationObserver`,
 * `IntersectionObserver`, `getComputedStyle`, `matchMedia` sont TOUS ABSENTS d'un vrai
 * Worker — mais elle a surtout trouvé quatre noms PRÉSENTS que ce contexte n'avait pas :
 * `CustomEvent` (essai : `new CustomEvent('t',{detail:1}).detail` → 1),
 * `requestAnimationFrame`, `cancelAnimationFrame` et `trustedTypes`.
 * SEUL `CustomEvent` EST AJOUTÉ, et c'est un choix mesuré, pas une prudence de principe :
 * Node le fournit nativement, donc c'est le VRAI objet. Les trois autres devraient être
 * FABRIQUÉS ici, c'est-à-dire inventés — et la mesure dit qu'aucun des 3 blocs concernés
 * n'en deviendrait vivant : `pages/html/lecon-44.html` #5 et #9 échouent ensuite sur `ctx`
 * et `canvas`, `pages/js/lecon-59.html` #4 sur `DOMPurify`. Inventer une API pour ne rien
 * gagner, c'est le risque de B2b-2 pris à l'envers. */
var GLOBALES_WORKER = ['TextEncoder', 'TextDecoder', 'performance', 'EventTarget', 'Event',
  'CustomEvent',
  'URL', 'URLSearchParams', 'Blob', 'AbortController', 'AbortSignal', 'ReadableStream',
  'WritableStream', 'TransformStream', 'FormData', 'Headers', 'Request', 'Response',
  'atob', 'btoa', 'PerformanceObserver', 'crypto', 'DOMException', 'MessageChannel',
  'BroadcastChannel', 'CompressionStream', 'DecompressionStream', 'structuredClone'];

/* Le contexte d'exécution : celui du Worker, pas celui de Node.
   `console` est détourné comme dans WORKER_SRC ; les globales que le Worker possède et
   que Node nomme autrement sont fournies. Rien d'autre n'est ajouté : ajouter `require`
   ferait aboutir des blocs qui, dans le navigateur, échouent — le contraire du but. */
function contexteWorker(sorties) {
  var faux = function () {};
  var ctx = {
    console: {
      log: function () { sorties.push(fmtArgs(arguments)); },
      info: function () { sorties.push(fmtArgs(arguments)); },
      debug: function () { sorties.push(fmtArgs(arguments)); },
      warn: function () { sorties.push(fmtArgs(arguments)); },
      error: function () { sorties.push(fmtArgs(arguments)); },
      table: faux, group: faux, groupEnd: faux, time: faux, timeEnd: faux, dir: faux,
      /* ⚠️ LES TREIZE SUIVANTES SONT MESURÉES, PAS DEVINÉES (point B2b-12, 2026-09-09).
         Ce `console` était écrit à la main ; le Worker, lui, part du console NATIF et
         n'en remplace que log/info/debug/warn/error — il garde donc tout le reste.
         `tools/preuves/sonde-console-worker.js` a demandé la liste à un VRAI Worker de
         Chrome (page `file://`, Blob → Worker par la mécanique de runner.js) : **24
         membres**, contre 11 ici. `console.assert` en fait partie, elle S'APPELLE sans
         jeter, et les leçons l'emploient 7 fois — deux blocs étaient donc déclarés EN
         PANNE alors qu'ils marchent chez l'apprenant. C'est le défaut du point B2b-2,
         « l'outil ne mesure pas le site, il mesure sa propre pauvreté », sur un autre
         objet. Les douze autres ne sont employées par aucune leçon aujourd'hui, mais
         elles EXISTENT chez l'apprenant : les omettre, c'est armer le même faux positif
         pour la prochaine leçon qui s'en servira.
         Toutes sont muettes, et c'est FIDÈLE : le Worker ne détourne pas ces
         méthodes-là, leur sortie part dans la console de DevTools et n'atteint jamais
         le panneau que l'apprenant lit. Aucune ne touche au réseau — la réserve de
         B2b-2 sur `fetch` et `WebSocket` ne s'applique pas ici. */
      assert: faux, clear: faux, context: faux, count: faux, countReset: faux,
      createTask: faux, dirxml: faux, groupCollapsed: faux, profile: faux,
      profileEnd: faux, timeLog: faux, timeStamp: faux, trace: faux
    },
    setTimeout: function (f) { try { if (typeof f === 'function') f(); } catch (e) {} return 0; },
    setInterval: function () { return 0; },
    clearTimeout: faux, clearInterval: faux,
    queueMicrotask: function (f) { try { f(); } catch (e) {} },
    /* ⚠️ `structuredClone` A LONGTEMPS ÉTÉ UNE CONTREFAÇON ICI (corrigé le 2026-09-09,
       point B2b-13) : `JSON.parse(JSON.stringify(v))`, c'est-à-dire l'exact CONTRAIRE de
       ce que la fonction fait. Le vrai clonage structuré traverse les cycles, préserve
       `Date`, `Set` et `Map` — c'est même la LEÇON de `pages/js/lecon-64.html`, dont un
       bloc était donc déclaré en panne (« Converting circular structure to JSON ») alors
       que l'apprenant y voit cinq lignes justes, mesuré au clic dans Chrome. Troisième
       occurrence du défaut des points B2b-2 et B2b-12 : l'outil mesurait sa propre
       pauvreté. Node fournit le VRAI `structuredClone` depuis la v17 ; il est donc
       injecté comme les autres globales, par la liste ci-dessus. */
    self: null, globalThis: null
  };
  GLOBALES_WORKER.forEach(function (n) {
    if (typeof globalThis[n] !== 'undefined') ctx[n] = globalThis[n];
  });
  ctx.self = ctx; ctx.globalThis = ctx;
  return ctx;
}
function fmtArgs(a) {
  return Array.prototype.slice.call(a).map(function (v) {
    if (typeof v === 'string') return v;
    if (v === undefined) return 'undefined';
    if (v === null) return 'null';
    if (typeof v === 'function') return String(v);
    try { return JSON.stringify(v); } catch (e) { return String(v); }
  }).join(' ');
}

var fichiers = [];
if (cibles.length) cibles.forEach(function (c) { fichiers = fichiers.concat(lecons(c)); });
else fichiers = lecons(null);

/* Assez long pour qu'un bloc lent aboutisse, assez court pour ne pas figer la mesure. */
var DELAI = 5000;
var total = 0, ok = 0, ko = 0, ecartes = 0, annoncees = 0, indecis = 0;
var nonCompilables = 0, listeNonCompilables = [];
var orphelins = 0, listeOrphelins = [];
var causes = {};
var parCours = {};

var replies = 0, listeReplies = [];

fichiers.forEach(function (f) {
  var rel = path.relative(RACINE, f).replace(/\\/g, '/');
  var cours = rel.split('/')[1];
  var blocsDuFichier = blocsJs(f);
  /* LE PRÉAMBULE DU REPLI. Le moteur (`preambuleDe` dans runner.js) rejoue un bloc tombé
     sur un nom manquant derrière les blocs À BOUTON qui le précèdent dans la leçon — donc
     ceux, et seulement ceux, que ce vérificateur retient lui aussi. On les collecte au
     premier passage : un bloc n'est jamais son propre préambule. */
  /* CE QUI PRÉCÈDE CHAQUE BLOC (point B2b-8), relevé dans une passe séparée exactement
     comme `init()` le fait dans runner.js : les blocs de NAVIGATEUR situés avant celui
     qu'on examine. C'est le seul contexte dont une règle du bouton ait besoin. */
  /* La meme passe releve AUSSI tous les textes JS de la page : `estUnFragmentOrphelin`
     (point B2b-10) demande la page ENTIERE, pas ce qui precede — un nom declare plus bas
     est fourni par la lecon, meme si le repli ne peut pas le donner. */
  var navAvant = [], vusNav = [], tousJs = [];
  blocsDuFichier.forEach(function (bloc) {
    navAvant.push(vusNav.slice());
    if (!bloc.code) return;
    tousJs.push(bloc.code);
    if (BROWSER_ONLY.test(bloc.code) || estDuDomDePage(bloc.code)) vusNav.push(bloc.code);
  });
  var aBouton = [];
  function aUnBouton(code, ctxNav) {
    return !(BROWSER_ONLY.test(code) || estUnFichierJson(code) || estUneSuiteDeTests(code) ||
      estUnFragmentServeur(code) || estDuDomDePage(code) || estUnServiceWorker(code) ||
      neCompilePas(code) || heriteDuNavigateur(code, ctxNav) ||
      estUnFragmentOrphelin(code, tousJs));
  }
  blocsDuFichier.forEach(function (bloc, i) {
    if (bloc.code && aUnBouton(bloc.code, navAvant[i])) aBouton.push(bloc.code);
  });
  var vus = 0;
  blocsDuFichier.forEach(function (bloc, i) {
    var code = bloc.code;
    if (!code) return;
    /* Même règle que runner.js : un bloc qui touche au navigateur ou à Node n'a pas
       de bouton, il ne compte donc ni dans les réussites ni dans les échecs. */
    if (BROWSER_ONLY.test(code) || estUnFichierJson(code) || estUneSuiteDeTests(code) ||
        estUnFragmentServeur(code) || estDuDomDePage(code) ||
        estUnServiceWorker(code)) { ecartes++; return; }
    /* LES BLOCS QUI NE COMPILENT PAS SONT COMPTES A PART, ET C'EST INDISPENSABLE.
       La regle `neCompilePas` (2026-09-09, point B2b-5) retire le bouton d'un bloc que
       JavaScript refuse de compiler. Elle a un effet de bord qu'il serait grave de laisser
       sans surveillance : une faute de syntaxe INTRODUITE PAR ERREUR dans une lecon fait
       desormais disparaitre le bouton EN SILENCE, au lieu d'etre comptee en panne. Le
       cliquet des pannes deviendrait aveugle a la faute la plus banale — exactement le
       defaut que ce chantier ferme (« un controle qui ne peut pas echouer occupe la
       place »). Ces blocs ont donc LEUR PROPRE CLIQUET, qui ne doit pas monter non plus. */
    if (neCompilePas(code)) {
      ecartes++; nonCompilables++;
      listeNonCompilables.push(rel + ' #' + (i + 1) + (bloc.fichier ? '  [' + bloc.fichier + ']' : ''));
      return;
    }
    /* L'HÉRITAGE DU NAVIGATEUR est testé APRÈS `neCompilePas`, dans le même ordre que
       `init()` : un bloc qui relève des deux doit être compté du même côté par les deux
       outils, sinon les chiffres divergent sans qu'aucune règle n'ait changé. */
    if (heriteDuNavigateur(code, navAvant[i])) { ecartes++; return; }
    /* LE FRAGMENT ORPHELIN, teste en DERNIER, dans le meme ordre que `init()`.
       ⚠️ IL LUI FAUT SON PROPRE CLIQUET, POUR LA MEME RAISON QU'A `neCompilePas` — et la
       mesure l'a prouve AVANT que ce compteur n'existe : `zzzNomInexistant();` injecte en
       tete d'un bloc vivant d'`algo/lecon-01` laissait le cliquet des pannes a 70, VERT,
       parce que la regle neuve ecartait aussitot le bloc casse. Un appel de fonction
       inexistante — la faute la plus banale du site — devenait invisible. Ces blocs sont
       donc comptes a part, avec un cliquet qui ne doit pas monter non plus. */
    if (estUnFragmentOrphelin(code, tousJs)) {
      ecartes++; orphelins++;
      listeOrphelins.push(rel + ' #' + (i + 1) + (bloc.fichier ? '  [' + bloc.fichier + ']' : ''));
      return;
    }
    total++;
    var prefixe = aBouton.slice(0, vus);
    vus++;
    parCours[cours] = parCours[cours] || { total: 0, ok: 0, annoncees: 0 };
    parCours[cours].total++;

    var sorties = [];
    var ctx = vm.createContext(contexteWorker(sorties));
    var msg = null;
    try {
      vm.runInContext(code, ctx, { timeout: DELAI, displayErrors: false });
    } catch (e) {
      msg = (e && e.name ? e.name + ': ' : '') + (e && e.message ? e.message : String(e));
    }
    /* ⚠️ UN DÉPASSEMENT DE DÉLAI N'EST PAS UNE PANNE, C'EST UNE MESURE NON CONCLUANTE, et
       ce vérificateur a failli naître avec le défaut qu'il venait de corriger ailleurs :
       compté parmi les erreurs, le nombre bougeait d'un passage à l'autre selon la charge
       de la machine (470 puis 469 sur deux relevés du même dépôt), et un cliquet posé
       dessus aurait rougi au hasard. Ces blocs — des démonstrations lentes à dessein,
       hachage répété, boucle de blocage — sont donc comptés à part et n'entrent pas dans
       le cliquet. C'est la même règle qu'au point B1e : l'outil doit dire quand il n'a
       pas conclu, jamais transformer son propre abandon en verdict sur le site. */
    if (msg && /timed out/i.test(msg)) {
      indecis++;
      if (!SEULEMENT_ERREURS && !CAUSES) console.log('  ??? ' + rel + ' #' + (i + 1) + ' — non concluant : plus de ' + (DELAI / 1000) + ' s');
      return;
    }
    /* --- LE REPLI, REPRODUIT À L'IDENTIQUE DU MOTEUR (2026-09-09, point B2b-7) ---------
     * `runner.js` rejoue un bloc tombé sur « X is not defined » derrière les blocs à bouton
     * qui le précèdent, dans un Worker NEUF et entre accolades. Ce vérificateur doit faire
     * exactement pareil, sinon il compte en panne des blocs que l'apprenant voit marcher.
     * Les deux règles (`meriteUnRepli`, `envelopperPourRepli`) sont LUES dans runner.js. */
    var parRepli = false;
    if (msg && prefixe.length && meriteUnRepli(msg)) {
      /* ⚠️ UN SEUL script, préambule et bloc ensemble — pas un appel par bloc. Le Worker
         évalue par `(0, eval)`, où les déclarations LEXICALES d'un appel ne survivent pas :
         un préambule passé bloc par bloc n'y laisserait rien d'une `class`. Un premier jet
         de ce vérificateur faisait exactement cela et annonçait 40 blocs réparés ; dans
         Chrome, ils affichaient toujours « X is not defined ». Le tri du préambule
         (`preambuleQuiCompile`) est celui du moteur, LU dans runner.js. */
      /* Le MÊME marqueur que le Worker (`__finDuPrelude`), pour deux raisons : le script
         concaténé est alors identique au caractère près, et surtout on sait à partir d'où
         les lignes affichées appartiennent au bloc de l'apprenant — celles du préambule,
         le moteur les masque, les compter ici ferait annoncer des sorties qui n'existent
         pas pour lui. */
      var jouerDerriere = function (gardes) {
        if (!gardes.length) return { err: 'préambule vide' };
        var s2 = [], brut = contexteWorker(s2), avantLeBloc = 0;
        brut.__finDuPrelude = function () { avantLeBloc = s2.length; };
        try {
          vm.runInContext(gardes.join('\n') + '\n;__finDuPrelude();\n' + envelopperPourRepli(code),
            vm.createContext(brut), { timeout: DELAI, displayErrors: false });
        } catch (e2) {
          return { err: (e2 && e2.name ? e2.name + ': ' : '') + (e2 && e2.message ? e2.message : String(e2)) };
        }
        return { err: null, lignes: s2.length - avantLeBloc };
      };
      var prf = prefixe;
      var essai = jouerDerriere(preambuleQuiCompile(prf, code));
      /* LE RÉ-ANCRAGE (point B2b-9), exactement la boucle de `lancerJs` : tant que le repli
         échoue sur un nom manquant qu'un bloc PLUS ANCIEN du préfixe déclare, on tronque le
         préfixe juste après lui et on rejoue. La terminaison vient de `preambuleReAncre`,
         qui ne rend qu'un préfixe STRICTEMENT plus court — pas d'un compteur de tours. */
      /* L'ÉLAGAGE PAR LE HAUT (point B2b-14) prend le relais quand le repli échoue non pas
         sur un nom manquant mais sur une ZONE MORTE TEMPORELLE : un bloc du préambule lit
         un nom qu'un bloc plus bas redéclare. Même ordre que `lancerJs` — ré-ancrage
         d'abord, élagage ensuite — sinon ce vérificateur mesurerait un autre moteur. */
      var faconne = '';
      while (essai.err) {
        var prf2 = meriteUnRepli(essai.err) ? preambuleReAncre(prf, essai.err) : null;
        var quoi = prf2 ? 're-ancre' : 'elague';
        if (!prf2) prf2 = preambuleElague(prf, essai.err);
        if (!prf2) break;
        prf = prf2; faconne = quoi;
        essai = jouerDerriere(preambuleQuiCompile(prf, code));
      }
      if (!essai.err) {
        parRepli = true; replies++;
        listeReplies.push(rel + ' #' + (i + 1) + '  (' + essai.lignes + ' ligne(s))' +
          (prf !== prefixe ? (faconne === 'elague' ? '  [élagué]' : '  [ré-ancré]') : '') +
          (erreurAnnoncee(code, msg) ? '  ⚠ ERREUR ANNONCÉE ÉTEINTE' : ''));
        msg = null;
      }
    }
    if (!msg) {
      ok++; parCours[cours].ok++;
      if (!SEULEMENT_ERREURS && !CAUSES) console.log('  ' + (parRepli ? 'REP' : 'OK ') + ' ' + rel + ' #' + (i + 1) +
        (parRepli ? ' — aboutit derrière les blocs précédents' : ''));
      return;
    }
    /* Une erreur que la page ANNONCE en commentaire n'est pas une panne : c'est la leçon. */
    if (erreurAnnoncee(code, msg)) {
      annoncees++; parCours[cours].annoncees++;
      if (!SEULEMENT_ERREURS && !CAUSES) console.log('  ANN ' + rel + ' #' + (i + 1) + ' — ' + msg.slice(0, 70) + '  (annoncée)');
      return;
    }
    ko++;
    var cle = msg.replace(/^(\w+Error): /, '$1: ').replace(/'[^']*'/g, "'…'").slice(0, 60);
    (causes[cle] = causes[cle] || []).push(rel + ' #' + (i + 1) + (bloc.fichier ? '  [' + bloc.fichier + ']' : ''));
    if (!CAUSES) console.log('  KO  ' + rel + ' #' + (i + 1) +
      (bloc.fichier ? '  [' + bloc.fichier + ']' : '') + ' — ' + msg.slice(0, 90));
  });
});

if (CAUSES) {
  console.log('=== BLOCS QUI N\'ABOUTISSENT QUE PAR LE REPLI : ' + replies + ' ===');
  listeReplies.forEach(function (o) { console.log('   ' + o); });
  console.log('');
  console.log('=== BLOCS QUI NE COMPILENT PAS (ecartes, cliquet a part) : ' + nonCompilables + ' ===');
  listeNonCompilables.forEach(function (o) { console.log('   ' + o); });
  console.log('');
  console.log('=== FRAGMENTS ORPHELINS (ecartes, cliquet a part) : ' + orphelins + ' ===');
  listeOrphelins.forEach(function (o) { console.log('   ' + o); });
  console.log('');
  console.log('=== CAUSES, de la plus fréquente à la plus rare ===');
  Object.keys(causes).sort(function (a, b) { return causes[b].length - causes[a].length; })
    .forEach(function (c) {
      console.log('\n' + String(causes[c].length).padStart(4) + '  ' + c);
      causes[c].slice(0, 8).forEach(function (o) { console.log('        ' + o); });
      if (causes[c].length > 8) console.log('        … et ' + (causes[c].length - 8) + ' autre(s)');
    });
}

console.log('\n=== RÉSUMÉ ===');
console.log('  blocs JS avec bouton .... ' + total);
console.log('  écartés (BROWSER_ONLY) .. ' + ecartes);
console.log('  aboutissent ............. ' + ok + (total ? '  (' + (100 * ok / total).toFixed(1) + ' %)' : ''));
console.log('  dont PAR REPLI .......... ' + replies + '  (derrière les blocs précédents de la leçon)');
console.log('  erreurs ANNONCÉES ....... ' + annoncees + '  (la page les écrit en commentaire)');
console.log('  non concluants .......... ' + indecis + '  (plus de ' + (DELAI / 1000) + ' s : hors cliquet)');
console.log('  EN PANNE ................ ' + ko);
console.log('  NE COMPILENT PAS ....... ' + nonCompilables + '  (ecartes : pas de bouton, cliquet a part)');
console.log('  FRAGMENTS ORPHELINS .... ' + orphelins + '  (ecartes : un nom que rien ne fournit, cliquet a part)');
console.log('\n--- par cours (les 12 plus fournis) ---');
Object.keys(parCours).sort(function (a, b) {
  return (parCours[b].total - parCours[b].ok - parCours[b].annoncees) -
         (parCours[a].total - parCours[a].ok - parCours[a].annoncees);
}).slice(0, 12).forEach(function (c) {
  var p = parCours[c], panne = p.total - p.ok - p.annoncees;
  console.log('  ' + c.padEnd(14) + String(p.ok).padStart(4) + ' / ' + String(p.total).padStart(4) +
    '   en panne : ' + String(panne).padStart(3));
});
if (!CAUSES) {
  console.log('\n--- causes (les 10 plus fréquentes) ---');
  Object.keys(causes).sort(function (a, b) { return causes[b].length - causes[a].length; })
    .slice(0, 10).forEach(function (c) { console.log('  ' + String(causes[c].length).padStart(4) + '  ' + c); });
}

/* --- le cliquet ---------------------------------------------------------- */
if (cibles.length) { console.log('\n  (cliquet inactif : des cibles ont ete passees en argument)'); process.exit(0); }
if (FIXER) {
  fs.writeFileSync(ATTENDU, JSON.stringify({ ko: ko, total: total, nonCompilables: nonCompilables,
    orphelins: orphelins,
    note: 'Nombre de blocs JS en panne au dernier releve. Il ne doit jamais augmenter. ' +
          'Le descendre apres une reparation : node tools/verif-js.js --fixer',
    note2: 'nonCompilables : blocs que `new Function` refuse de compiler, donc prives de ' +
           'bouton par runner.js. Ce ne sont pas des pannes, mais leur nombre ne doit pas ' +
           'monter : une faute de syntaxe introduite par erreur se cacherait dedans.',
    note3: 'orphelins : blocs qui ouvrent une ligne sur un nom que rien dans la page ne ' +
           'fournit, donc prives de bouton par runner.js. Meme raison que ci-dessus, et ' +
           'elle a ete MESUREE : un appel de fonction inexistante ajoute par erreur ferait ' +
           'simplement disparaitre le bouton, sans faire monter les pannes.' }, null, 2) + '\n', 'utf8');
  console.log('\n  cliquet fixe a ' + ko + ' bloc(s) en panne sur ' + total +
              ', ' + nonCompilables + ' bloc(s) qui ne compilent pas, et ' + orphelins +
              ' fragment(s) orphelin(s).');
  process.exit(0);
}
var ref = null;
try { ref = JSON.parse(fs.readFileSync(ATTENDU, 'utf8')); } catch (e) { ref = null; }
if (!ref) { console.log('\n  (aucune reference de cliquet : node tools/verif-js.js --fixer)'); process.exit(0); }
if (ko > ref.ko) {
  console.log('\nCLIQUET : ' + ko + ' bloc(s) en panne contre ' + ref.ko + ' a la reference, soit ' +
    (ko - ref.ko) + ' de plus. Un bloc JS qui aboutissait est tombe.');
  process.exit(1);
}
/* Le SECOND cliquet : sans lui, une faute de syntaxe ne ferait plus rougir personne,
   puisque le bloc casse perd simplement son bouton. */
if (typeof ref.nonCompilables === 'number' && nonCompilables > ref.nonCompilables) {
  console.log('\nCLIQUET : ' + nonCompilables + ' bloc(s) ne compilent pas, contre ' + ref.nonCompilables +
    ' a la reference, soit ' + (nonCompilables - ref.nonCompilables) + ' de plus.');
  console.log('  Un bloc JS a ete casse : il perd son bouton en silence.' +
              ' Les voir : node tools/verif-js.js --causes');
  process.exit(1);
}
/* Le TROISIEME cliquet, ne du meme constat que le second, et MESURE : voir le commentaire
   pose plus haut sur `estUnFragmentOrphelin`. */
if (typeof ref.orphelins === 'number' && orphelins > ref.orphelins) {
  console.log('\nCLIQUET : ' + orphelins + ' fragment(s) orphelin(s), contre ' + ref.orphelins +
    ' a la reference, soit ' + (orphelins - ref.orphelins) + ' de plus.');
  console.log('  Un bloc JS cite un nom que plus rien ne fournit : il perd son bouton en' +
              ' silence. Les voir : node tools/verif-js.js --causes');
  process.exit(1);
}
if (typeof ref.orphelins === 'number' && orphelins < ref.orphelins) {
  console.log('\n  ' + orphelins + ' fragment(s) orphelin(s), contre ' + ref.orphelins +
    ' attendus. Descendre la reference : node tools/verif-js.js --fixer');
}
if (typeof ref.nonCompilables === 'number' && nonCompilables < ref.nonCompilables) {
  console.log('\n  ' + nonCompilables + ' bloc(s) ne compilent pas, contre ' + ref.nonCompilables +
    ' attendus. Descendre la reference : node tools/verif-js.js --fixer');
}
if (ko < ref.ko) {
  console.log('\n  cliquet : ' + ko + ' en panne contre ' + ref.ko + ' attendus, soit ' + (ref.ko - ko) +
    ' de moins. Descendre la reference : node tools/verif-js.js --fixer');
  process.exit(0);
}
console.log('\n  cliquet : ' + ko + ' bloc(s) en panne, comme a la reference.');
process.exit(0);
