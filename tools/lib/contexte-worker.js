'use strict';
/**
 * tools/lib/contexte-worker.js — LE CONTEXTE D'EXÉCUTION D'UN BLOC, ÉCRIT UNE SEULE FOIS.
 *
 * (2026-09-09, point B2b-15.) `tools/verif-js.js` et `tools/preuves/sonde-repli-manque.js`
 * portaient chacun leur copie de ce contexte, et les deux copies avaient DIVERGÉ : la sonde
 * en était restée à 11 méthodes de `console` (contre 24 mesurées dans un vrai Worker au
 * point B2b-12) et au `structuredClone` CONTREFAIT que le point B2b-13 avait supprimé de
 * l'autre côté. Deux instruments qui prétendent mesurer le même moteur ne peuvent pas être
 * écrits deux fois : c'est le défaut soldé aux points B2b-2, B2b-12 et B2b-13, ici sur
 * l'objet le plus central de tous.
 */


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
 * ⚠️ CE RAISONNEMENT EST DEVENU FAUX POUR TROIS DE CES CINQ NOMS (2026-09-09, B2b-16).
 * Depuis que `js/runner.js` COUPE le réseau dans son Worker (`apisHorsLigne`), `fetch`,
 * `XMLHttpRequest` et `WebSocket` EXISTENT chez l'apprenant et refusent immédiatement, avec
 * un message. Les laisser absents ici, ce serait mesurer un moteur qui n'existe plus — la
 * cinquième occurrence de « l'outil mesure sa propre pauvreté » (B2b-2, B2b-12, B2b-13,
 * B2b-16). Ils sont donc fournis, mais LUS dans `js/runner.js` et jamais recopiés, pour que
 * les deux côtés ne puissent pas diverger. `indexedDB` et `caches` restent absents : le
 * moteur ne les touche pas, et en fabriquer un ici serait l'INVENTER (refusé en B2b-4).
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
  var horsLigne = apisHorsLigne();
  Object.keys(horsLigne).forEach(function (n) { ctx[n] = horsLigne[n]; });
  ctx.self = ctx; ctx.globalThis = ctx;
  return ctx;
}

/* Une fonction du moteur, LUE dans `js/runner.js` — même mécanique que les règles du bouton
   dans `verif-js.js`. Si elle disparaît du moteur, cette lecture ÉCHOUE bruyamment plutôt
   que de laisser les deux côtés diverger en silence. Le résultat est retenu : la lecture
   coûte un accès disque, et `fmtArgs` est appelée à chaque ligne affichée. */
var _lues = {};
function lireDuRunner(nom) {
  if (_lues[nom]) return _lues[nom];
  var fs = require('fs'), path = require('path');
  var src = fs.readFileSync(path.resolve(__dirname, '..', '..', 'js', 'runner.js'), 'utf8');
  var i = src.indexOf('function ' + nom + '(');
  if (i < 0) throw new Error(nom + ' introuvable dans js/runner.js');
  var j = src.indexOf('\n  }', i);
  if (j < 0) throw new Error('fin de ' + nom + ' introuvable dans js/runner.js');
  return (_lues[nom] = eval('(' + src.slice(i, j + 4) + ')'));
}
function apisHorsLigne() { return lireDuRunner('apisHorsLigne')(); }


/* --- CE QUE CE VÉRIFICATEUR NE PEUT PAS MESURER, ET QUI DOIT LE DIRE (2026-09-09, B2b-16)
 * `indexedDB` et `caches` existent dans un vrai Worker — la sonde du point B2b-2 l'a mesuré —
 * mais Node ne les a pas, et en fabriquer un ici serait les INVENTER : refusé au point B2b-4,
 * parce qu'une API contrefaite fait ABOUTIR des blocs qui échouent chez l'apprenant.
 * Résultat, un bloc qui les emploie était compté EN PANNE alors qu'il marche : mesuré au clic
 * dans Chrome sur `pages/js/lecon-32.html` #6, qui écrit puis relit sa donnée et affiche
 * « Acheter du pain ». IndexedDB est du stockage LOCAL, il n'a besoin d'aucun serveur.
 *
 * ⚠️ UNE CATÉGORIE HORS CLIQUET EST UN ENDROIT OÙ L'ON PEUT CACHER DE VRAIES PANNES — le
 * relevé du point B2b-16 le disait avant qu'elle existe. Elle est donc tenue par un cliquet
 * d'ÉGALITÉ, pas de non-régression : son effectif doit valoir exactement celui de la
 * référence. Y verser un bloc de plus fait rougir, tout comme en retirer un. Et le critère
 * ne peut pas déborder : il exige un `ReferenceError` portant EXACTEMENT l'un de ces deux
 * noms, pas un message qui les contient. */
var HORS_PORTEE = ['indexedDB', 'caches'];
function estHorsPortee(msg) {
  return HORS_PORTEE.some(function (n) {
    return msg === 'ReferenceError: ' + n + ' is not defined';
  });
}
/* Le formatage d'une valeur affichée est LU dans `js/runner.js` (point B2b-16) : cette
   fonction en portait une copie, et la copie a divergé le jour où le moteur a cessé de
   sérialiser les `Error` en `{}`. C'est le défaut du point B2b-15, sur l'objet d'à côté. */
function fmtArgs(a) {
  var f = lireDuRunner('formaterPourLaSortie');
  return Array.prototype.slice.call(a).map(function (v) { return f(v); }).join(' ');
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

module.exports = { GLOBALES_WORKER: GLOBALES_WORKER, contexteWorker: contexteWorker, fmtArgs: fmtArgs, ERREUR_ANNONCEE: ERREUR_ANNONCEE, erreurAnnoncee: erreurAnnoncee,
  HORS_PORTEE: HORS_PORTEE, estHorsPortee: estHorsPortee };
