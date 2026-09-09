/* =============================================================================
   runner.js — Éditeur de code intégré + exécution / aperçu.
   - Blocs JavaScript exécutables (logique pure) : bouton « ▶ Tester » →
     éditeur + exécution dans un Web Worker ISOLÉ (coupe-circuit anti-boucle) →
     panneau console.
   - Blocs HTML (language-markup) : bouton « 👁 Aperçu » → éditeur + rendu du
     HTML dans une <iframe> sandbox → on VOIT le résultat.
   - Blocs Python (language-python) : bouton « ▶ Tester » → éditeur + exécution
     via Pyodide (WebAssembly) dans un Web Worker isolé → panneau console.
   - Blocs SQL (language-sql) : bouton « ▶ Exécuter » → éditeur + requête exécutée
     par SQLite (sql.js) dans un Web Worker isolé → résultat en tableau.
   LES QUATRE MOTEURS FONCTIONNENT EN file://, SANS SERVEUR ET SANS RÉSEAU. Plus aucun
   CDN depuis le 2026-08-26 : SQLite est embarqué dans assets/vendor/sqljs/ et CPython
   3.12.1 dans assets/vendor/pyodide/. Les binaires WebAssembly y sont encodés en
   base64 — en file://, un fetch() vers un .wasm local est refusé (origine opaque).
   ⚠️ COMMENT LES MOTEURS ARRIVENT DANS LE WORKER, ET POURQUOI ÇA A CHANGÉ. De leur
   embarquement (2026-08-26) au 2026-09-02, le Worker les chargeait lui-même par
   importScripts() sur une URL file:// ABSOLUE. Chrome 152 le refuse : 41 blocs SQL et 41
   échecs, 43 blocs Python et 43 échecs — les deux moteurs étaient MORTS chez
   l'apprenant depuis une semaine sans qu'aucun vérificateur ne le voie. Désormais
   LA PAGE charge les scripts (chargerDansLaPage) et transmet des CHAÎNES au Worker,
   qui les évalue. Voir tools/build-sources-worker.js et le point F2 de CHANTIER-V14.
   ⚠️ Python n'a que la BIBLIOTHÈQUE STANDARD : numpy, pandas, matplotlib et
   scikit-learn sont des paquets séparés, téléchargeables depuis un CDN seulement. Les
   blocs qui les importent n'ont donc pas de bouton (PY_MODULES ci-dessous), plutôt
   qu'un bouton qui ne rendrait qu'un ModuleNotFoundError.
   À charger après main.js.
   ============================================================================= */
(function () {
  "use strict";

  function $all(sel, ctx) {
    return Array.prototype.slice.call((ctx || document).querySelectorAll(sel));
  }

  var ICON_PLAY =
    '<svg class="icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>';
  var ICON_RESET =
    '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 12a9 9 0 1 0 2.6-6.4L3 8"/><path d="M3 3v5h5"/></svg>';
  var ICON_EYE =
    '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>';

  // APIs uniquement disponibles dans une page (pas dans un Web Worker),
  // ou propres à Node.js — ces blocs ne tournent pas dans le worker. On vise des
  // marqueurs SPÉCIFIQUES de Node (pas les mots communs « module »/« global ») pour
  // ne pas masquer « Tester » sur du JavaScript pur des autres cours.
  // ⚠ Les frontières \b de JavaScript ignorent les lettres accentuées : « confirmées »
  // dans un commentaire FRANÇAIS satisfaisait \bconfirm\b, et le bloc perdait son
  // bouton « Tester » en silence (3 blocs du site mesurés ainsi le 2026-08-25). On borne
  // donc explicitement sur les lettres accentuées plutôt que sur \b.
  /* UN FICHIER DE DONNEES N'EST PAS UN PROGRAMME (2026-09-09, point B2).
     `pages/nodejs/lecon-03.html` porte cinq `package.json` annonces
     `class="language-javascript"` : un bouton « Tester » sur un fichier de configuration.
     ⚠️ LE CRITERE DU PLAN ETAIT TROP LARGE, et la mesure l'a montre avant qu'il ne casse
     quoi que ce soit : « data-file en .json » designe 8 blocs, dont **3 VIVANTS** —
     `pages/formats/lecon-02.html` et `pages/nosql/lecon-12.html` sont de vrais programmes
     qui MANIPULENT du JSON (`JSON.parse`, puis `console.log`), et dont le `data-file`
     porte un nom en .json par simple convenance d'affichage. Les ecarter aurait retire
     trois boutons qui marchent.
     Le critere retenu ne peut pas se tromper : le bloc PARSE ENTIEREMENT EN JSON. Il
     attrape en prime les quatre `package.json` de la lecon 3 que `data-file` ratait,
     puisqu'ils sont annonces « Terminal ». Mesure : 8 blocs vises, 8 deja en panne,
     ZERO vivant. Le test du premier caractere ecarte les scalaires : `JSON.parse("42")`
     reussit, et un bloc reduit a un nombre reste un programme.
     ⚠️ Fonction LUE par `tools/verif-js.js`, jamais recopiee. */
  function estUnFichierJson(texte) {
    var t = String(texte).trim();
    if (!/^[{[]/.test(t)) return false;
    try { JSON.parse(t); return true; } catch (e) { return false; }
  }

  /* UNE SUITE DE TESTS N'EST PAS UN PROGRAMME (2026-09-09, point B2b-1).
     `test("...", ...)`, `describe`, `it`, `beforeEach` : ces noms ne sont pas fournis par
     JavaScript, c'est un LANCEUR qui les injecte (`node --test`, Jest, Vitest, Mocha). Dans
     le Worker, il n'y a pas de lanceur : le bouton ne rendait qu'un
     « ReferenceError: test is not defined » — 34 blocs, deuxieme cause d'echec du site.
     Le motif exige un DEBUT D'INSTRUCTION (debut de ligne, indentation permise) suivi d'un
     LIBELLE entre guillemets : `test` cite dans une phrase de commentaire, ou une methode
     `obj.test(x)`, ou un appel `test(valeur)` sans libelle, ne retirent aucun bouton.
     GARDE : si le bloc DEFINIT lui-meme son harnais (`function test(...)`, `const it = ...`),
     c'est un programme autonome qui s'execute tres bien — on ne l'ecarte pas. Aucun bloc du
     site n'est dans ce cas aujourd'hui, la garde protege l'avenir.
     Impact mesure AVANT ecriture, en EXECUTANT chaque bloc designe : 36 blocs vises,
     36 deja en panne, ZERO vivant.
     ⚠️ Fonction LUE par `tools/verif-js.js`, jamais recopiee. */
  function estUneSuiteDeTests(texte) {
    var t = String(texte);
    /* Forme simple : `test("…", …)`. Forme PARAMÉTRÉE : `test.each([…])("…", …)` — le
       libellé n'y est plus le premier argument, il vient après le tableau de cas, si bien
       que le premier motif ne le voyait pas (2026-09-09, point B2b-6 : 6 blocs du cours
       `tests`, tous en `ReferenceError: test is not defined`). Les suffixes `.each`,
       `.only`, `.skip`, `.todo`, `.concurrent`, `.failing` n'appartiennent qu'aux lanceurs
       de tests : aucun programme autonome ne les porte. Impact mesuré en EXÉCUTANT chaque
       bloc désigné : 6 visés, 6 déjà en panne, ZÉRO vivant. */
    if (!/(?:^|\n)[ \t]*(?:test|describe|it|beforeEach|afterEach|beforeAll|afterAll)\s*\(\s*['"`]/.test(t) &&
        !/(?:^|\n)[ \t]*(?:test|describe|it)\.(?:each|only|skip|todo|concurrent|failing)\b/.test(t)) return false;
    if (/(?:function|const|let|var)\s+(?:test|describe|it)\s*[=(]/.test(t)) return false;
    return true;
  }

  /* UN SERVICE WORKER N'EST PAS UN WEB WORKER (2026-09-09, point B2b-6). `sw.js` s'installe
     dans un cycle de vie que le navigateur pilote : `self.addEventListener("install", …)`,
     `"activate"`, `"fetch"`, `skipWaiting()`, `clients.claim()`. Chargé dans le Worker du
     bouton, il enregistre des écouteurs pour des événements qui ne viendront JAMAIS.
     ⚠️ C'EST LE PREMIER LOT OÙ LE VÉRIFICATEUR SE TROMPAIT DANS L'AUTRE SENS, et seule une
     sonde dans un vrai Worker de Chrome (`file://`, DNS coupé) pouvait le dire :
     `tools/verif-js.js` les comptait en panne sur « self.addEventListener is not a
     function », un `TypeError` que son contexte `vm` FABRIQUE — car un vrai Worker possède
     `addEventListener`, et les 7 blocs de `pages/html/lecon-42.html` s'y exécutent **sans
     la moindre erreur, en n'affichant RIEN**. Le bouton était donc pire qu'on ne le
     croyait : il ne rendait pas un message d'erreur, il rendait le VIDE, sous un
     commentaire qui promet « à l'install, les 4 ressources sont en cache et dispo hors
     ligne ». Les événements retenus n'existent que dans un service worker ; `message`, qui
     est légitime dans un Web Worker, est délibérément absent de la liste.
     Impact mesuré : 6 blocs visés, ZÉRO vivant.
     ⚠️ Fonction LUE par `tools/verif-js.js` et `tools/verif-clic.js`, jamais recopiée. */
  function estUnServiceWorker(texte) {
    var t = String(texte);
    if (/self\.addEventListener\s*\(\s*['"`](?:install|activate|fetch|push|sync|periodicsync|notificationclick)['"`]/.test(t)) return true;
    return /(?:^|[^\w$.])(?:self\.skipWaiting|clients\.claim)\s*\(/.test(t);
  }

  /* UN FRAGMENT DE SERVEUR N'EST PAS UN PROGRAMME DU NAVIGATEUR (2026-09-09, point B2b-3).
     `app.get(...)` d'Express, `db.produits.find(...)` de MongoDB, `res.setHeader(...)` du
     module http, `router.beforeEach(...)` de Vue Router : ces objets sont fabriqués par un
     bloc PRÉCÉDENT de la leçon, et surtout ils supposent un serveur et une base de données
     que le site n'a pas. Le bouton ne pouvait donc rien promettre d'autre qu'un
     « ReferenceError: app is not defined » — première et deuxième causes d'échec du site
     après le passage de B2b-2 (17 blocs sur `app`, 13 sur `db`).
     LE MOTIF EXIGE LA COLONNE ZÉRO, et c'est la mesure qui l'a imposé, pas le goût : la
     variante « indentation permise » vise 40 blocs dont **2 VIVANTS**
     (`pages/nodejs/lecon-18.html` #11 et #14 DÉFINISSENT une fonction dont `req` et `res`
     sont les PARAMÈTRES — le bloc ne les appelle pas, il s'exécute très bien). Une
     utilisation en colonne zéro est forcément au niveau racine du bloc, donc jamais un
     paramètre. Ajouter `req` à la liste a été mesuré aussi : exactement les mêmes 38 blocs,
     donc on garde la liste la plus courte.
     GARDE : un bloc qui DÉCLARE lui-même l'objet (`const app = …`, `function db(…)`, ou une
     simple affectation `app = express()`) est autonome — on ne l'écarte pas.
     Impact mesuré AVANT écriture, en EXÉCUTANT chaque bloc désigné : 38 blocs visés,
     38 déjà en panne, ZÉRO vivant.
     ⚠️ Fonction LUE par `tools/verif-js.js`, jamais recopiée. */
  function estUnFragmentServeur(texte) {
    var t = String(texte);
    var m = t.match(/(?:^|\n)(?:await )?(app|db|res|router|prisma|mongoose)[.[]/);
    if (!m) return false;
    if (new RegExp('(?:const|let|var|function|class)\\s+' + m[1] + '\\b').test(t)) return false;
    if (new RegExp('(?:^|[^\\w$.])' + m[1] + '\\s*=[^=]').test(t)) return false;
    return true;
  }

  /* LE DOM D'UNE PAGE N'EXISTE PAS DANS UN WORKER (2026-09-09, point B2b-4). Un composant
     web (`class Badge extends HTMLElement`, `customElements.define(…)`) ou un observateur
     de mise en page (`IntersectionObserver`, `MutationObserver`, `getComputedStyle`…)
     s'adresse à un document que le Worker n'a pas. `BROWSER_ONLY` nommait déjà `document`
     et `window`, mais ces blocs-là ne les citent jamais : ils reçoivent leur élément par
     `this`, et le bouton rendait « HTMLElement is not defined ».
     ⚠️ CE LOT AVAIT ÉTÉ MESURÉ PUIS REFUSÉ AU POINT B2b-1, et pour une bonne raison : le
     critère naturel de l'époque (`Element`, `Node`, `FormData`…) visait 37 blocs dont
     **11 VIVANTS**, parce qu'`Element` et `Node` sont des noms de variables ordinaires.
     Ce qui a permis de le rouvrir, ce n'est pas une meilleure idée, c'est une MESURE : une
     sonde a demandé à un vrai Worker de Chrome (page `file://`, DNS coupé, Blob → Worker
     comme ci-dessous) quels noms il possède. `HTMLElement`, `customElements`, `document`,
     `window`, `Element`, `Node`, `DOMParser`, `MutationObserver`, `IntersectionObserver`,
     `getComputedStyle`, `matchMedia` : TOUS ABSENTS. La liste retenue ne garde que des
     noms qui n'ont aucun autre sens en JavaScript — ni `Element` ni `Node`, justement.
     GARDE : un bloc qui déclare lui-même l'un de ces noms est autonome, on l'épargne.
     Impact mesuré AVANT écriture, en EXÉCUTANT chaque bloc désigné : 13 blocs visés,
     13 déjà en panne, ZÉRO vivant.
     ⚠️ Fonction LUE par `tools/verif-js.js` et `tools/verif-clic.js`, jamais recopiée. */
  function estDuDomDePage(texte) {
    var t = String(texte);
    var noms = 'HTMLElement|customElements|DOMParser|MutationObserver|IntersectionObserver|ResizeObserver|getComputedStyle|matchMedia|ShadowRoot|NodeFilter|XPathResult';
    var m = t.match(new RegExp('extends\\s+HTML\\w*Element(?![\\w$])|(?:^|[^\\w$.À-ɏ])(' + noms + ')(?![\\w$À-ɏ])'));
    if (!m) return false;
    if (m[1] && new RegExp('(?:const|let|var|function|class)\\s+' + m[1] + '\\b').test(t)) return false;
    return true;
  }

  /* UN BLOC QUE JAVASCRIPT REFUSE DE COMPILER NE RENDRA JAMAIS RIEN (2026-09-09, B2b-5).
     Les quatre règles ci-dessus décrivent CE QUE LE WORKER N'A PAS — un document, un
     serveur, un lanceur de tests. Celle-ci ne décrit rien : elle DEMANDE À JAVASCRIPT.
     `new Function(texte)` compile le bloc sans en exécuter la moindre ligne ; s'il lève
     une `SyntaxError`, aucun contexte d'exécution au monde ne fera parler ce bloc, et le
     bouton « Tester » ne peut promettre qu'un message d'erreur. Ce sont des corps d'objet
     détachés (`{ path: '/produit/:id', component: Produit }`), des `case` sans `switch`,
     des schémas ASCII étiquetés `language-javascript`, des lignes de terminal, et
     surtout du `await` au niveau racine — légal dans un module, jamais dans le script
     classique que reçoit le Worker.
     ⚠️ AUCUN FAUX POSITIF N'EST POSSIBLE, ET CE N'EST PAS UN RAISONNEMENT : C'EST UNE
     MESURE. Le Worker exécute `(0, eval)(code)`, pas `new Function(code)` — les deux
     juges pouvaient diverger. Une sonde a donc soumis LES 1 768 blocs à bouton du site
     aux deux, DANS UN VRAI WORKER de Chrome (`file://`, DNS coupé, Blob → Worker comme
     ci-dessous), en faisant précéder le texte d'un `throw` pour qu'`eval` compile sans
     rien exécuter : **81 refusés par les deux, 1 684 acceptés par les deux, ZÉRO bloc
     refusé par `new Function` que `eval` accepterait** — le seul cas qui aurait retiré un
     bouton vivant. Trois blocs vont dans l'autre sens (`eval` refuse un `return` racine
     que `new Function` autorise) : gain non pris, jamais un risque.
     Impact mesuré AVANT écriture, en EXÉCUTANT chaque bloc désigné : 81 blocs visés,
     ZÉRO vivant, 71 déjà comptés en panne et 10 que le vérificateur classait « erreur
     annoncée » à tort — leur commentaire contient le mot « erreur », mais la leçon n'y
     enseigne pas une faute de syntaxe : `pages/js/lecon-48.html` #8 finit sur
     `console.log(await collecter()); // ["a","b","c","d","e"]`, une sortie promise que le
     bouton ne rendra jamais.
     ⚠️ Fonction LUE par `tools/verif-js.js` et `tools/verif-clic.js`, jamais recopiée. */
  function neCompilePas(texte) {
    try { new Function(String(texte)); }
    catch (e) { return e instanceof SyntaxError; }
    return false;
  }

  /* LE FRAGMENT QUI HÉRITE DU NAVIGATEUR (2026-09-09, point B2b-8). Les règles ci-dessus
     regardent un bloc SEUL. Celle-ci est la première à regarder ce qui le PRÉCÈDE, parce
     que le repli du point B2b-7 a laissé un reste parfaitement homogène : `bouton`, `ctx`,
     `form`, `canvas`, `grille`, `board` — des noms que le bloc n'a pas déclarés et que le
     repli ne peut PAS lui fournir, puisqu'ils viennent d'un bloc précédent ÉCARTÉ comme
     code de navigateur (`const bouton = document.querySelector(…)`), donc absent du
     préambule. Un bloc qui consomme au niveau racine un nom né d'un `document.querySelector`
     est du code de navigateur lui aussi : le bouton ne pouvait promettre qu'un
     « X is not defined ».

     ⚠️ LES DEUX « COLONNE ZÉRO » NE SONT PAS UN GOÛT D'ÉCRITURE, C'EST LA MESURE QUI LES A
     IMPOSÉES (`tools/preuves/sonde-heritage-navigateur.js`, qui EXÉCUTE chaque bloc désigné) :

       | critère                                        | visés | dont VIVANTS |
       |---|---|---|
       | décl. colonne 0, usage n'importe où            |  75   | **31**       |
       | décl. n'importe où, usage n'importe où         | 100   | **50**       |
       | décl. colonne 0, USAGE en colonne 0 (retenu)   |  27   | **0**        |

     Un nom cité dans le CORPS d'une fonction que le bloc n'appelle jamais ne fait rien
     échouer : le bloc aboutit, silencieux mais vivant. Les 31 vivants de la première
     variante sont exactement ceux-là (`projets-js/lecon-16` #2 déclare des fonctions de
     dessin qui mentionnent `ctx` sans jamais les appeler). Le nom qui OUVRE une ligne, lui,
     est évalué au niveau racine : l'erreur est certaine dès le clic.
     Deux variantes voisines ont été mesurées puis écartées : la déclaration cherchée
     n'importe où gagne UN bloc (28 au lieu de 27, `js/lecon-65` #5) au prix de noms locaux
     banals promus en sources, et la CASCADE (l'écarté transmet à son tour) ne change
     RIEN — 27 dans les deux cas. On garde donc la règle la plus étroite.
     GARDE : un bloc qui déclare ou affecte lui-même le nom est autonome, on l'épargne.
     Impact mesuré AVANT écriture, en EXÉCUTANT chaque bloc désigné : 27 blocs visés,
     ZÉRO vivant, 24 déjà comptés en panne et 3 que le vérificateur classait « erreur
     annoncée » à tort (`js/lecon-33` #4 et #6, `projets-js/lecon-19` #3 : leur commentaire
     porte les mots « invalide » ou « erreur », mais ces blocs n'enseignent aucune faute —
     ce sont des écouteurs `submit` et `dragstart` sur un `form` et un `board` du document).
     ⚠️ Fonction LUE par `tools/verif-js.js` et `tools/verif-clic.js`, jamais recopiée. */
  function heriteDuNavigateur(texte, blocsNavigateur) {
    var t = String(texte);
    var liste = blocsNavigateur || [];
    for (var i = 0; i < liste.length; i++) {
      var re = /^(?:const|let|var|class|async\s+function|function)\s+([A-Za-z_$À-ɏ][\w$À-ɏ]*)/gm;
      var m;
      while ((m = re.exec(liste[i]))) {
        var n = m[1].replace(/[$]/g, '\\$&');
        if (!new RegExp('^' + n + '(?![\\w$À-ɏ])', 'm').test(t)) continue;
        if (new RegExp('(?:const|let|var|function|class)\\s+' + n + '(?![\\w$À-ɏ])').test(t)) continue;
        if (new RegExp('(?:^|[^\\w$.À-ɏ])' + n + '\\s*=(?!=)').test(t)) continue;
        return true;
      }
    }
    return false;
  }

  /* LE FRAGMENT ORPHELIN (2026-09-09, point B2b-10) --------------------------------
     La règle précédente donne à un bloc ce qu'un bloc voisin a déclaré. Celle-ci constate
     l'inverse : le bloc OUVRE une ligne sur un nom que **rien dans la page** ne fournit —
     ni une déclaration, ni une affectation, dans aucun bloc. Un `taches.push(…)` ou un
     `bouton.addEventListener(…)` sans le `querySelector` qui les crée nulle part : le
     clic ne peut rendre qu'une erreur, et aucun préambule n'y changera rien. C'est le
     lot des « INTROUVABLES » que `sonde-repli-manque.js` compte depuis le point B2b-8.

     TROIS PRÉCAUTIONS, ET CHACUNE A ÉTÉ MESURÉE, PAS SUPPOSÉE
     (`tools/preuves/sonde-fragment-orphelin.js`, qui EXÉCUTE chaque bloc visé) :

     | critère | visés | dont VIVANTS |
     |---|---|---|
     | tel quel | 38 | **3** |
     | commentaires neutralisés | 38 | **3** |
     | + chaînes et gabarits neutralisés | 36 | **1** |
     | **+ étiquettes exclues** (retenu) | **35** | **0** |

     (1) Les CHAÎNES : dans `const t = \`…\`` sur plusieurs lignes, un mot du texte ouvre une
         ligne sans être un identifiant. `js/lecon-13` #12 (« Total ») et `crypto/lecon-10`
         #1 (« tar », 40 lignes de sortie) sont bien vivants et seraient tombés.
     (2) Les COMMENTAIRES de bloc, pour la même raison.
     (3) Les ÉTIQUETTES : `nom:` en tête de ligne est une clé d'objet ou un label, jamais la
         lecture d'une variable — `graphql/lecon-09` #4 est un fragment d'objet qui s'ouvre
         sur `context: () => ({`.

     ⚠️ Le nettoyage des chaînes se fait caractère par caractère, pas par expression
     régulière : aucune regex ne suit l'imbrication d'un `${…}` dans un gabarit, et le code
     qui s'y trouve, lui, est du VRAI code qu'il faut continuer de lire.
     La fonction est AUTONOME — listes comprises — parce que les vérificateurs la LISENT
     dans ce fichier et l'évaluent hors de tout contexte. */
  function estUnFragmentOrphelin(texte, tousLesBlocs) {
    var t = String(texte), blocs = tousLesBlocs || [];
    t = t.replace(/\/\*[\s\S]*?\*\//g, function (m) { return m.replace(/[^\n]/g, " "); })
         .replace(/(^|[^:\\])\/\/[^\n]*/g, function (m, p) { return p; });
    var net = "", i = 0, n = t.length;
    while (i < n) {
      var c = t[i];
      if (c === '"' || c === "'" || c === "`") {
        var q = c, prof = 0;
        net += " "; i++;
        while (i < n) {
          var d = t[i];
          if (d === "\\") { net += "  "; i += 2; continue; }
          if (q === "`" && d === "$" && t[i + 1] === "{") { prof++; net += "  "; i += 2; continue; }
          if (q === "`" && prof > 0 && d === "}") { prof--; net += " "; i++; continue; }
          if (prof > 0) { net += d; i++; continue; }
          if (d === q) { net += " "; i++; break; }
          net += (d === "\n" ? "\n" : " "); i++;
        }
        continue;
      }
      net += c; i++;
    }
    var connus = {};
    ("const let var function class async await return if else for while do switch case " +
     "default break continue try catch finally throw new delete typeof void instanceof in " +
     "of this super yield import export null true false undefined debugger with static " +
     "get set console Math JSON Object Array String Number Boolean Date RegExp Error " +
     "TypeError RangeError SyntaxError ReferenceError EvalError URIError AggregateError " +
     "Promise Symbol Map Set WeakMap WeakSet WeakRef Proxy Reflect BigInt Function " +
     "parseInt parseFloat isNaN isFinite encodeURI encodeURIComponent decodeURI " +
     "decodeURIComponent Infinity NaN ArrayBuffer SharedArrayBuffer DataView Int8Array " +
     "Uint8Array Uint8ClampedArray Int16Array Uint16Array Int32Array Uint32Array " +
     "Float32Array Float64Array BigInt64Array BigUint64Array Intl setTimeout setInterval " +
     "clearTimeout clearInterval queueMicrotask structuredClone self globalThis eval " +
     "arguments Atomics TextEncoder TextDecoder performance EventTarget Event CustomEvent " +
     "URL URLSearchParams Blob AbortController AbortSignal ReadableStream WritableStream " +
     "TransformStream FormData Headers Request Response atob btoa PerformanceObserver " +
     "crypto DOMException MessageChannel BroadcastChannel CompressionStream " +
     "DecompressionStream").split(" ").forEach(function (m) { connus[m] = true; });
    var re = /^([A-Za-z_$À-ɏ][\w$À-ɏ]*)(\s*:)?/gm, m;
    while ((m = re.exec(net))) {
      if (connus[m[1]] || m[2]) continue;
      var nom = m[1].replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      var decl = new RegExp("(?:const|let|var|class|function)\\s+" + nom + "(?![\\w$À-ɏ])");
      var affect = new RegExp("(?:^|[^\\w$.À-ɏ])" + nom + "\\s*=(?!=)");
      var fourni = false;
      for (var b = 0; b < blocs.length; b++) {
        if (decl.test(blocs[b]) || affect.test(blocs[b])) { fourni = true; break; }
      }
      if (!fourni) return true;
    }
    return false;
  }

  /* LE NOM DU NAVIGATEUR LU AU NIVEAU RACINE (2026-09-09, points B2b-23 puis B2b-25) ---
     `heriteDuNavigateur` n'écarte un bloc que si le nom hérité OUVRE une ligne. Ce critère
     laisse passer `pages/js/lecon-33.html` #3 (`const fd = new FormData(form);`) : le nom
     est lu au MILIEU d'une ligne racine, l'expression est pourtant évaluée aussitôt, et le
     bouton ne pouvait promettre qu'un « form is not defined ».

     ⚠️ ÉLARGIR LE CRITÈRE D'USAGE, À LUI SEUL, TUE DES BLOCS VIVANTS, et la mesure l'a dit
     avant qu'une ligne ne soit écrite (`tools/preuves/sonde-heritage-profondeur.js`, qui
     DEMANDE le statut de chaque bloc à `verif-js.js` au lieu de le recalculer) :

       | critère                                            | visés | dont VIVANTS |
       |---|---|---|
       | colonne 0 (règle actuelle, inchangée)              |   1   | **0**        |
       | profondeur 0 d'accolades                           |  18   | **10**       |
       | profondeur 0, flèches courtes coupées              |  16   | **8**        |
       | n'importe où (déjà rejeté en B2b-8)                |  39   | **27**       |
       | MÊME `data-file` + usage n'importe où              |  17   | **10**       |
       | MÊME `data-file` + profondeur 0                    |   7   | **2**        |
       | + listes de paramètres neutralisées                |   5   | **1**        |
       | **+ nom absent des blocs précédents non-navigateur** | **4** | **0**      |

     CE QUI FAIT LA DIFFÉRENCE N'EST PAS UNE REGEX PLUS FINE. Trois précautions portent
     tout le poids, et chacune est un faux positif mesuré : la profondeur d'accolades (un
     nom cité dans le corps d'une fonction jamais appelée ne fait rien échouer), les listes
     de paramètres (`function rendre(etat)` DÉCLARE `etat`, il ne le lit pas — c'est ce qui
     visait à tort `projets-js/lecon-02` #3, bien vivant), et la garde du préambule (si un
     bloc précédent NON-navigateur déclare le nom, le repli du point B2b-7 peut le fournir :
     `js/lecon-12` #8 vit de cela).
     ⚠️ La garde est écrite sur les blocs « non-navigateur » et non sur « les blocs à
     bouton », qui seraient pourtant le préambule exact : la liste des blocs à bouton dépend
     des règles du bouton, donc de celle-ci — la définition serait circulaire. La garde
     retenue est plus large, donc plus prudente ; mesurée, elle donne le même résultat.

     ⚠️ CE QUE LE POINT B2b-25 A CORRIGÉ ICI, ET QUI NE SE VOYAIT PAS. Deux défauts, tous
     deux mesurés par la même sonde, statuts DEMANDÉS à `verif-js.js` :

     (1) LA QUATRIÈME PRÉCAUTION ÉTAIT DE TROP. B2b-23 exigeait en plus que le bloc source
         porte le MÊME `data-file`. Elle compensait l'absence des deux autres précautions,
         écrites dans la foulée : une fois les paramètres neutralisés et la garde du
         préambule en place, la lever vise **3 blocs de plus, tous les trois DÉJÀ EN PANNE,
         ZÉRO vivant** (`nodejs/lecon-22` #2 `UserSchema`, `graphql/lecon-09` #5
         `DataLoader`, `wasm/lecon-04` #4 `memoire`). Le `data-file` reste relevé par la
         page, mais la règle ne s'en sert plus : un `const memoire = new WebAssembly.Memory`
         déclaré dans un bloc de navigateur est hors d'atteinte du Worker, que le bloc
         suivant porte ou non la même étiquette de fichier.

     (2) UNE CONDITION N'EST PAS UNE LISTE DE PARAMÈTRES. Le motif qui blanchit les
         paramètres acceptait n'importe quel identifiant collé à `(…) {` — donc `if (x) {`,
         `while (x) {`, `for (…) {`, `switch (x) {`. La règle était AVEUGLE à toute lecture
         faite dans une condition racine, et `projets-js/lecon-17` #5 (`if (modeGomme) {`,
         un fragment de `pointermove` qui ne peut rendre qu'une erreur) passait au travers.
         Les mots-clés de contrôle sont maintenant exclus du blanchiment ; `catch` reste
         une liaison, donc blanchi. **1 bloc de plus visé, en panne, zéro vivant.**
     ⚠️ Fonction LUE par `tools/verif-js.js` et `tools/verif-clic.js`, jamais recopiée. */
  function heriteDuNavigateurAuNiveauRacine(texte, navAvant, autresAvant) {
    var liste = navAvant || [], autres = autresAvant || [];
    if (!liste.length) return false;
    /* Commentaires, chaînes et gabarits neutralisés caractère par caractère — le code
       d'un `${…}` reste du code, et aucune regex ne suit cette imbrication. */
    var t = String(texte), n = t.length, net = "", i = 0;
    while (i < n) {
      var c = t[i];
      if (c === "/" && t[i + 1] === "/") { while (i < n && t[i] !== "\n") { net += " "; i++; } continue; }
      if (c === "/" && t[i + 1] === "*") {
        net += "  "; i += 2;
        while (i < n && !(t[i] === "*" && t[i + 1] === "/")) { net += (t[i] === "\n" ? "\n" : " "); i++; }
        net += "  "; i += 2; continue;
      }
      if (c === '"' || c === "'" || c === "`") {
        var q = c, profC = 0;
        net += " "; i++;
        while (i < n) {
          var d = t[i];
          if (d === "\\") { net += "  "; i += 2; continue; }
          if (q === "`" && d === "$" && t[i + 1] === "{") { profC++; net += "  "; i += 2; continue; }
          if (q === "`" && profC > 0 && d === "}") { profC--; net += " "; i++; continue; }
          if (profC > 0) { net += d; i++; continue; }
          if (d === q) { net += " "; i++; break; }
          net += (d === "\n" ? "\n" : " "); i++;
        }
        continue;
      }
      net += c; i++;
    }
    /* ⚠️ `(?!\b(?:if|while|for|switch)\s*\()` : sans cette garde, `if (modeGomme) {` était
       blanchi comme une liste de paramètres et la lecture disparaissait (point B2b-25). */
    net = net.replace(/(function\s*[\w$À-ɏ]*\s*|catch\s*|[\w$À-ɏ]\s*)\(([^()]*)\)(\s*(?:=>|\{))/g,
        function (mm, av, dedans, ap, pos, tout) {
          /* `av` ne capture qu'UN caractère dans la branche « identifiant collé » : le
             mot-clé se lit donc dans le texte qui précède, pas dans le groupe. */
          if (/(?:^|[^\w$À-ɏ])(?:if|while|for|switch)\s*$/.test(tout.slice(0, pos) + av)) return mm;
          return av + "(" + dedans.replace(/[^\n]/g, " ") + ")" + ap;
        })
      .replace(/\(([^()]*)\)(\s*=>)/g, function (mm, dedans, ap) { return "(" + dedans.replace(/[^\n]/g, " ") + ")" + ap; });
    var prof = [], p = 0, k;
    for (k = 0; k < net.length; k++) {
      if (net[k] === "{") { prof[k] = p; p++; }
      else if (net[k] === "}") { p--; prof[k] = p; }
      else prof[k] = p;
    }
    for (var j = 0; j < liste.length; j++) {
      var re = /^(?:const|let|var|class|async\s+function|function)\s+([A-Za-z_$À-ɏ][\w$À-ɏ]*)/gm, m;
      while ((m = re.exec(liste[j]))) {
        var nom = m[1], e = nom.replace(/[$]/g, "\\$&");
        /* GARDE, la même qu'en B2b-8 : un bloc qui déclare ou affecte le nom est autonome. */
        if (new RegExp("(?:const|let|var|function|class)\\s+" + e + "(?![\\w$À-ɏ])").test(net)) continue;
        if (new RegExp("(?:^|[^\\w$.À-ɏ])" + e + "\\s*=(?!=)").test(net)) continue;
        var decl = new RegExp("^(?:const|let|var|class|async\\s+function|function)\\s+" + e + "(?![\\w$À-ɏ])", "m");
        var fourni = false, a;
        for (a = 0; a < autres.length; a++) { if (decl.test(autres[a])) { fourni = true; break; } }
        if (fourni) continue;
        var lec = new RegExp("(^|[^\\w$.À-ɏ])" + e + "(?![\\w$À-ɏ])", "g"), u;
        while ((u = lec.exec(net))) {
          var pos = u.index + u[1].length;
          if (/^\s*:/.test(net.slice(pos + nom.length))) continue;
          if (!prof[pos]) return true;
        }
      }
    }
    return false;
  }

  /* `import` et `export` en TETE DE LIGNE (2026-09-09, point B2 du chantier V17) : un
     module ES ne s'evalue pas dans le Worker, qui recoit du script classique — le bouton
     rendait « Cannot use import statement outside a module », premiere cause d'echec du
     site avec 85 blocs. Le motif exige le debut d'une ligne : `import` cite au milieu
     d'une phrase de commentaire ou dans une chaine ne retire aucun bouton. Impact mesure
     AVANT ecriture, en EXECUTANT chaque bloc designe : 124 blocs vises, 124 deja en
     panne, ZERO vivant. */
  var BROWSER_ONLY = /(?:^|[^\w$À-ɏ])(document|window|localStorage|sessionStorage|alert|prompt|confirm|location|navigator|process|Buffer|__dirname|__filename)(?![\w$À-ɏ])|require\s*\(|module\.exports|\bexports\.|\bglobalThis\b|node:|new Worker|postMessage|SharedArrayBuffer|Atomics|importScripts|(?:^|\n)\s*(?:import|export)[\s{*]/;

  // Enveloppe de base pour l'aperçu d'un FRAGMENT HTML (style minimal lisible)
  var PREVIEW_PRE =
    '<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">' +
    "<style>body{font-family:system-ui,-apple-system,sans-serif;margin:14px;color:#1a1713;line-height:1.5;background:#fff}" +
    "img{max-width:100%;height:auto}table{border-collapse:collapse}td,th{border:1px solid #cabfa9;padding:4px 8px}" +
    "a{color:#2540f0}*{box-sizing:border-box}</style></head><body>";
  var PREVIEW_SUF = "</body></html>";

  /* --- LE REPLI SUR LES BLOCS PRÉCÉDENTS (2026-09-09, point B2b-7) -------------------
   * Les six règles ci-dessus RETIRENT un bouton qui ne peut rien promettre. Ce qui restait
   * en panne après elles est d'une autre nature : le FRAGMENT INTERNE, un bloc qui poursuit
   * le précédent de sa leçon (`etatInitial`, `UnionFind`, `Tache`) et qui échoue sur un
   * simple « X is not defined ». Lui retirer son bouton serait une perte : le code est bon,
   * il lui manque seulement ce qui a été écrit au-dessus.
   *
   * DEUX MÉCANIQUES ONT ÉTÉ MESURÉES AVANT D'EN ÉCRIRE UNE (tools/preuves/sonde-contexte-cumule.js) :
   *   - le CUMUL, tous les blocs de la leçon dans un contexte partagé : 28 blocs gagnés,
   *     mais **380 PERDUS**, tous sur « Identifier '…' has already been declared ». Deux
   *     blocs qui déclarent chacun `const jeu` ne cohabitent pas dans une portée globale.
   *     Rejeté.
   *   - le REPLI, retenu : le bloc s'exécute SEUL, exactement comme avant ; s'il échoue sur
   *     un nom manquant, ET SEULEMENT DANS CE CAS, il est rejoué dans un Worker NEUF derrière
   *     les blocs qui le précèdent. Un bloc qui aboutit seul n'est jamais rejoué : cette
   *     mécanique ne peut RIEN retirer. Mesure : **40 blocs gagnés sur 159**, dont 32 qui
   *     rendent au moins une ligne à l'apprenant.
   *
   * L'ENVELOPPE est ce qui répond à la collision qui tue le cumul : le bloc rejoué est
   * entouré d'accolades, donc ses `const`/`let`/`class` MASQUENT ceux du préambule au lieu
   * d'entrer en conflit avec eux. Mesuré : sans elle, 28 gains ; avec elle, 40.
   * ⚠️ Sauf si le bloc s'ouvre sur `"use strict"` : entre accolades ce n'est plus une
   * directive mais une expression sans effet, et le bloc serait silencieusement DÉCLASSÉ en
   * mode non strict. Ceux-là reçoivent une fonction, qui garde la directive. */
  function envelopperPourRepli(texte) {
    if (/^\s*["']use strict["']\s*;/.test(texte)) return "(function () {\n" + texte + "\n})();";
    return "{\n" + texte + "\n}";
  }

  /* CE QUE LE PRÉAMBULE GARDE. Préambule et bloc partent dans un SEUL script (voir
     WORKER_SRC), donc une seule collision de déclarations entre deux blocs de la leçon —
     deux `const jeu` — suffit à faire échouer la compilation de l'ensemble, et le repli
     entier est perdu. Mesuré : le préambule brut gagne 21 blocs là où la mécanique
     infidèle en promettait 40. On ne garde donc du préambule que ce qui COMPILE avec le
     bloc, en partant du plus PROCHE — c'est lui qui a le plus de chances de porter ce qui
     manque, et un bloc plus ancien qui le contredit est écarté, pas l'inverse.
     Là encore, aucun jugement sur le texte : c'est JavaScript qui tranche (point B2b-5). */
  /* L'ANCRAGE (2026-09-09, point B2b-17) : `ancres` est la liste des noms sur lesquels le
     repli a DÉJÀ échoué. Les blocs qui les déclarent sont essayés EN PREMIER, donc gardés
     d'office ; c'est ce qui suit qui est écarté en cas de collision, et non plus eux.
     Sans cette liste, le comportement est identique au précédent — l'ordre d'essai est
     alors exactement « du plus proche au plus ancien ».
     ⚠️ SEULE LA PRIORITÉ DE CONSERVATION CHANGE, JAMAIS L'ORDRE D'EXÉCUTION : les blocs
     retenus repartent triés par leur rang dans la leçon. Un premier jet DÉPLAÇAIT le bloc
     déclarant en fin de préambule pour qu'il soit vu le premier par le tri — il s'exécutait
     alors après ceux qui l'utilisent, ce qui ne marche que pour les `function` (hissées) et
     casse tout `const` ou `class`. */
  function preambuleQuiCompile(pre, texte, ancres) {
    var ordre = [], i;
    (ancres || []).forEach(function (nom) {
      var n = nom.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      var decl = new RegExp("^(?:const|let|var|class|async\\s+function|function)\\s+" + n + "(?![\\w$À-ɏ])", "m");
      for (var k = pre.length - 1; k >= 0; k--) {
        if (decl.test(pre[k])) { if (ordre.indexOf(k) < 0) ordre.push(k); break; }
      }
    });
    for (i = pre.length - 1; i >= 0; i--) if (ordre.indexOf(i) < 0) ordre.push(i);
    var retenus = [];
    ordre.forEach(function (k) {
      var idx = retenus.concat([k]).sort(function (a, b) { return a - b; });
      try {
        new Function(idx.map(function (j) { return pre[j]; }).join("\n") + "\n" + envelopperPourRepli(texte));
        retenus = idx;
      } catch (e) {
        /* SEULE une faute de compilation écarte un bloc. Tout autre incident est un
           défaut de ce code, pas du contenu : un `catch` muet le cacherait. */
        if (!(e instanceof SyntaxError)) throw e;
      }
    });
    return retenus.map(function (j) { return pre[j]; });
  }

  /* LE RÉ-ANCRAGE DU PRÉAMBULE (2026-09-09, point B2b-9) ------------------------------
     `preambuleQuiCompile` part du bloc le PLUS PROCHE et remonte : quand un bloc récent
     entre en collision avec un bloc ancien, c'est l'ANCIEN qui saute. Or c'est parfois
     l'ancien qui portait le nom manquant. `pages/js/lecon-21` en est le cas d'école : le
     bloc #1 déclare `class Tache` ET `class TachePrioritaire`, le #2 redéclare
     `TachePrioritaire` — le #3 garde donc le #2 et perd le #1, puis échoue sur `Tache`.

     La réponse ne juge toujours pas le texte : quand le repli échoue À SON TOUR sur un
     « Y is not defined », on cherche le bloc le plus proche du préfixe qui déclare Y en
     colonne zéro, et on TRONQUE le préfixe juste après lui — il devient le plus proche,
     donc le premier que le tri garde. Le reste (compilation, enveloppe) est inchangé.

     ⚠️ LA TRONCATURE DOIT ÊTRE STRICTE, faute de quoi la boucle ne s'arrête jamais : un
     préfixe inchangé rend un préambule inchangé, donc mot pour mot la même erreur. C'est
     cette décroissance — et non un compteur de tours — qui garantit la terminaison. Le
     plafond a d'ailleurs été mesuré avant d'être écarté (`tools/preuves/sonde-preambule-elargi.js`) :
     1 tour rend 4 blocs, 2 tours en rendent 5, et 3, 4, 5 tours ou l'absence de plafond n'en
     rendent pas un de plus. Aucune perte à aucune profondeur, et pour cause : le ré-ancrage
     ne se déclenche que sur un bloc DÉJÀ en panne.
     Mesuré aussi puis REFUSÉ : donner au préambule les blocs SANS bouton (l'autre moitié du
     lot) — **0 gain et 2 PERTES**, ces blocs touchant `document` ou `localStorage`, qui
     n'existent pas dans le Worker. */
  function preambuleReAncre(prefixe, erreur) {
    var m = /^ReferenceError: (.+?) is not defined/.exec(String(erreur));
    if (!m) return null;
    var nom = m[1].replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    var decl = new RegExp("^(?:const|let|var|class|async\\s+function|function)\\s+" + nom + "(?![\\w$À-ɏ])", "m");
    for (var i = prefixe.length - 1; i >= 0; i--) {
      if (decl.test(prefixe[i])) return i + 1 >= prefixe.length ? null : prefixe.slice(0, i + 1);
    }
    return null;
  }

  /* L'ÉLAGAGE DU PRÉAMBULE PAR LE HAUT (2026-09-09, point B2b-14) ---------------------
     Le ré-ancrage ci-dessus coupe la FIN du préfixe ; il reste le défaut symétrique, et
     c'est celui qui produisait le plus gros lot de pannes restantes. `pages/js/lecon-09`
     en est le cas d'école : le bloc #3 LIT `user` sans le déclarer (son fournisseur est
     le #2), le #4 le REDÉCLARE. Pour le bloc #5, le tri garde le #4 — le plus proche —
     puis le #3, qui compile avec lui ; mais il écarte le #2, en collision avec le #4. Le
     préambule est donc [#3, #4] : à l'exécution, le #3 lit `user` AVANT la déclaration du
     #4, dans la même portée. `const` et `class` étant en zone morte temporelle, cela ne
     rend pas « user is not defined » mais **« Cannot access 'user' before initialization »**,
     que `meriteUnRepli` ne reconnaît pas — le repli s'arrêtait là.

     La réponse ne juge toujours pas le texte : on retranche le DÉBUT du préfixe jusqu'au
     bloc qui déclare le nom en colonne zéro, de sorte qu'aucun lecteur de ce nom ne le
     précède plus. La terminaison vient de là encore de la décroissance STRICTE du
     préfixe, pas d'un compteur de tours. */
  function preambuleElague(prefixe, erreur) {
    var m = /^ReferenceError: Cannot access '(.+?)' before initialization/.exec(String(erreur));
    if (!m) return null;
    var nom = m[1].replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    var decl = new RegExp("^(?:const|let|var|class|async\\s+function|function)\\s+" + nom + "(?![\\w$À-ɏ])", "m");
    for (var i = prefixe.length - 1; i >= 0; i--) {
      if (!decl.test(prefixe[i])) continue;
      /* ⚠️ LE BLOC DÉCLARANT PEUT ÊTRE LE FAUTIF LUI-MÊME (2026-09-09, point B2b-17).
         L'élagage ci-dessus suppose que le LECTEUR du nom précède le DÉCLARANT, et il
         retranche donc tout ce qui est au-dessus de ce dernier. Il reste un cas qu'il ne
         traitait pas, et le site en contient une leçon entière : un bloc qui ENSEIGNE la
         zone morte temporelle lit le nom et le déclare LUI-MÊME, dans cet ordre
         (`pages/js/lecon-16` #2 : `console.log(age);` puis `const age = 30;`). Le retenir
         en tête de préambule rejoue l'erreur à l'identique, et l'ancienne écriture rendait
         alors `null` : le repli abandonnait, et TOUS les blocs suivants de la leçon
         restaient en panne sur un nom que le bloc d'avant fournissait pourtant.
         Quand le déclarant est déjà en tête, on le retire à son tour : un préambule est là
         pour FOURNIR des noms, jamais pour rejouer une démonstration d'erreur. La
         décroissance reste STRICTE, donc la terminaison est acquise comme avant. */
      if (i > 0) return prefixe.slice(i);
      return prefixe.length > 1 ? prefixe.slice(1) : null;
    }
    return null;
  }

  /* QUAND rejouer. Les gains mesurés sont TOUS des « X is not defined » : c'est la seule
     panne dont un bloc précédent puisse être le remède. Rejouer sur une autre erreur (un
     `TypeError`, une division qui rate) ne gagnerait rien et ferait tourner du code pour
     rien. Le message reçu du Worker a la forme « Nom: texte ». */
  function meriteUnRepli(texte) {
    return /^ReferenceError: .+ is not defined/.test(String(texte));
  }

  /* L'ORDRE DES DEUX RÉÉCRITURES, ÉCRIT UNE SEULE FOIS (2026-09-09, point B2b-15).
     Le repli qui a échoué peut être retenté de deux façons : le RÉ-ANCRAGE (B2b-9) coupe
     la fin du préfixe, l'ÉLAGAGE (B2b-14) en coupe le début. Leur ordre de priorité était
     écrit TROIS fois — dans `lancerJs`, dans `tools/verif-js.js`, dans
     `tools/preuves/sonde-repli-manque.js` — et trois exemplaires d'une même règle finissent
     toujours par diverger : le vérificateur mesure alors un moteur qui n'existe pas, ce qui
     est le défaut soldé aux points B2b-2, B2b-12 et B2b-13. Une seule écriture, ici, LUE
     par les deux outils. Rend `null` quand aucune des deux réécritures n'a de prise. */
  function prochainPrefixe(prefixe, erreur, ancres) {
    if (!prefixe || !prefixe.length) return null;
    if (meriteUnRepli(erreur)) {
      /* L'ANCRAGE PASSE EN PREMIER (2026-09-09, point B2b-17), parce qu'il ne PERD rien :
         il garde le préfixe entier et se contente de changer QUI est écarté en cas de
         collision. Le ré-ancrage et l'élagage, eux, tronquent. Cas d'école mesuré,
         `pages/projets-js/lecon-15` : le bloc #1 déclare `etatInitial` ET `const jeu`, le
         #3 redéclare `const jeu` ; le tri gardait le #3 — le plus proche — et jetait le #1,
         donc `etatInitial`. Le ré-ancrage tronquait alors juste après le #1, ce qui faisait
         perdre les #2 et #4 dont le bloc a besoin lui aussi : il échouait sur le nom suivant.
         ⚠️ UN NOM N'EST ANCRÉ QU'UNE FOIS, et c'est ce qui garantit la terminaison : l'ancrage
         ne fait pas décroître le préfixe, donc sans cette mémoire la relance serait infinie.
         Les noms épuisés, on retombe sur les deux troncatures, strictement décroissantes. */
      var m = /^ReferenceError: (.+?) is not defined/.exec(String(erreur));
      if (m && ancres && ancres.indexOf(m[1]) < 0) {
        var n = m[1].replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        var decl = new RegExp("^(?:const|let|var|class|async\\s+function|function)\\s+" + n + "(?![\\w$À-ɏ])", "m");
        for (var k = prefixe.length - 1; k >= 0; k--) {
          if (decl.test(prefixe[k])) { ancres.push(m[1]); return { prefixe: prefixe, facon: "ancre" }; }
        }
      }
      var p = preambuleReAncre(prefixe, erreur);
      if (p) return { prefixe: p, facon: "re-ancre" };
    }
    var q = preambuleElague(prefixe, erreur);
    if (q) return { prefixe: q, facon: "elague" };
    return null;
  }

  /* ⚠️ AUCUNE PAGE DU SITE NE PARLE AU RÉSEAU — Y COMPRIS SOUS UN BOUTON « TESTER »
     (2026-09-09, point B2b-16). La règle fondatrice du site était tenue pour acquise, et
     elle ne l'était pas : `tools/preuves/sonde-clic-reseau.js` a cliqué dans un vrai Chrome
     les 27 blocs à bouton qui nomment `fetch`, `WebSocket` ou `caches`, avec toute
     résolution de nom détournée vers un port local, et a compté **4 blocs qui lancent une
     VRAIE connexion sortante** (`exemple.api` ×6, `api.exemple.fr` ×2 — des noms qui
     n'existent pas, donc autant de requêtes vers un serveur DNS étranger).
     `verif-clic.js` et `verif-rendu.js` annonçaient « 0 requête distante » : ils lisent
     `performance.getEntriesByType("resource")`, qui n'enregistre PAS une requête ÉCHOUÉE et
     ne voit rien de ce qui sort d'un Worker. Leur zéro ne mesurait rien ici.

     On ne retire aucun bouton — retirer celui de la leçon qui ENSEIGNE `fetch` serait une
     décision de contenu, pas d'outil. On rend le refus IMMÉDIAT, LOCAL et EXPLIQUÉ : le
     `catch` que ces leçons écrivent justement pour la panne réseau s'exécute, et l'apprenant
     lit une phrase au lieu d'attendre un délai d'expiration. La fonction est ISOLÉE ici pour
     que `tools/lib/contexte-worker.js` la LISE au lieu de la recopier : le vérificateur doit
     offrir exactement les mêmes API que le navigateur, sinon il mesure autre chose. */
  function apisHorsLigne() {
    var refus = function (quoi) {
      return new Error(quoi + " : ce site fonctionne entièrement hors ligne, aucune requête n’est " +
        "envoyée. L’exemple montre la forme de l’appel ; branche-le sur une vraie API pour le voir aboutir.");
    };
    return {
      fetch: function () { return Promise.reject(refus("fetch")); },
      XMLHttpRequest: function () { throw refus("XMLHttpRequest"); },
      WebSocket: function () { throw refus("WebSocket"); },
      EventSource: function () { throw refus("EventSource"); }
    };
  }

  /* ⚠️ UNE ERREUR AFFICHÉE `{}` N'APPREND RIEN, ET C'ÉTAIT LE CAS DE TOUTES (2026-09-09,
     point B2b-16). Ce formateur terminait par `JSON.stringify(v)` : une `Error` n'ayant
     aucune propriété énumérable, `console.error("Erreur réseau :", err)` rendait
     « Erreur réseau : {} » — mesuré dans Chrome sur `pages/js/lecon-24.html` #8, #9 et #10.
     Le Worker CONTREFAISAIT donc le formatage de la console, comme `structuredClone` était
     contrefait au point B2b-13, et c'est la ligne la plus lue du panneau de sortie : celle
     qui explique une panne. La fonction est ISOLÉE ici pour deux raisons — l'injecter dans
     le Worker par `toString()`, et permettre à `tools/lib/contexte-worker.js` de la LIRE
     plutôt que d'en tenir une copie qui divergera (leçon du point B2b-15). */
  function formaterPourLaSortie(v) {
    if (typeof v === "string") return v;
    if (v === undefined) return "undefined";
    if (v === null) return "null";
    if (typeof v === "function") return v.toString();
    if (v instanceof Error) return (v.name || "Error") + ": " + v.message;
    try { return JSON.stringify(v); } catch (e) { return String(v); }
  }

  /* Code exécuté DANS le worker : capture la console puis évalue le code reçu.
     Il accepte soit une chaîne (le bloc seul, cas ordinaire), soit un objet
     { code, prelude } : les textes du préambule sont alors évalués D'ABORD, en silence —
     l'apprenant a demandé le résultat de SON bloc, pas celui des précédents. */
  var WORKER_SRC = [
    envelopperPourRepli.toString(),
    apisHorsLigne.toString(),
    formaterPourLaSortie.toString(),
    "self.onmessage = function (ev) {",
    "  var recu = ev.data;",
    "  var code = typeof recu === 'string' ? recu : recu.code;",
    "  var prelude = (recu && recu.prelude) || [];",
    "  var muet = prelude.length > 0;",
    "  var fmt = formaterPourLaSortie;",
    "  function send(level, args) {",
    "    if (muet) return;",
    '    self.postMessage({ level: level, text: Array.prototype.slice.call(args).map(fmt).join(" ") });',
    "  }",
    '  ["log", "info", "debug"].forEach(function (l) { console[l] = function () { send("log", arguments); }; });',
    '  console.warn = function () { send("warn", arguments); };',
    '  console.error = function () { send("error", arguments); };',
    /* Le réseau, coupé DANS le worker et non dans la page : c'est là que le code de
       l'apprenant s'exécute, et c'est de là que partaient les 4 connexions mesurées. */
    "  var horsLigne = apisHorsLigne();",
    "  for (var nomApi in horsLigne) self[nomApi] = horsLigne[nomApi];",
    /* ⚠️ UN SEUL `eval`, ET C'EST TOUTE LA DIFFÉRENCE. Un premier jet évaluait le préambule
       bloc par bloc : dans un `eval`, seuls `var` et `function` deviennent globaux — les
       déclarations LEXICALES (`const`, `let`, `class`) disparaissent à la fin de l'appel. Un
       `class UnionFind` évalué à part ne laissait donc rien, et les blocs annoncés gagnés
       affichaient toujours « UnionFind is not defined » dans Chrome, alors que le
       vérificateur les disait réparés — son `vm.runInContext`, lui, conserve ces liaisons.
       Préambule et bloc partent donc dans le MÊME script. Le marqueur `__finDuPrelude`
       rouvre l'affichage exactement au moment où le code de l'apprenant commence. */
    "  if (prelude.length) {",
    "    self.__finDuPrelude = function () { muet = false; };",
    "    code = prelude.join('\\n') + '\\n;self.__finDuPrelude();\\n' + envelopperPourRepli(code);",
    "  }",
    "  try { (0, eval)(code); }",
    '  catch (err) { muet = false; send("error", [err && err.message ? err.name + ": " + err.message : String(err)]); }',
    "  self.postMessage({ done: true });",
    "};",
  ].join("\n");

  /* ----------------------------------------------------- Python (Pyodide) */
  /* LISTE MESURÉE, PAS DEVINÉE. Les 185 modules réellement importables dans le
     Pyodide embarqué, obtenus en EXÉCUTANT `sys.builtin_module_names` +
     `pkgutil.iter_modules()` dedans (scratchpad/pyodide-essai/liste-modules.html,
     2026-08-26). Tout le reste — numpy, pandas, matplotlib, scikit-learn, requests…
     — est un paquet séparé qui ne s'obtient que par le réseau : le bloc qui l'importe
     n'a pas de bouton, comme un bloc SQL écrit pour PostgreSQL n'en a pas.
     ⚠️ `sqlite3` n'est PAS de la liste : il n'est pas compilé dans ce build. */
  var PY_MODULES = ("abc aifc antigravity argparse array ast asyncio atexit audioop base64 bdb " +
    "binascii bisect builtins bz2 cProfile calendar cgi cgitb chunk cmath cmd code codecs codeop " +
    "collections colorsys compileall concurrent configparser contextlib contextvars copy copyreg " +
    "crypt csv ctypes dataclasses datetime decimal difflib dis doctest email encodings enum errno " +
    "faulthandler filecmp fileinput fnmatch fractions ftplib functools gc genericpath getopt " +
    "getpass gettext glob graphlib gzip hashlib heapq hmac html http imaplib imghdr importlib " +
    "inspect io ipaddress itertools json keyword linecache locale logging mailbox mailcap marshal " +
    "math mimetypes mmap modulefinder multiprocessing netrc nntplib ntpath nturl2path numbers " +
    "opcode operator optparse os pathlib pdb pickle pickletools pipes pkgutil platform plistlib " +
    "poplib posix posixpath pprint profile pstats pty py_compile pyclbr pydoc pyexpat pyodide " +
    "queue quopri random re reprlib rlcompleter runpy sched secrets select selectors shelve shlex " +
    "shutil signal site smtplib sndhdr socket socketserver sre_compile sre_constants sre_parse " +
    "stat statistics string stringprep struct subprocess sunau symtable sys sysconfig tabnanny " +
    "tarfile telnetlib tempfile textwrap this threading time timeit token tokenize tomllib trace " +
    "traceback tracemalloc tty types typing unicodedata unittest urllib uu uuid warnings wave " +
    "weakref webbrowser wsgiref xdrlib xml xmlrpc zipapp zipfile zipimport zlib zoneinfo").split(" ");

  /* CE QUI PORTE LA CLASSE « python » SANS ÊTRE DU PYTHON. Mesuré le 2026-08-26 en
     COMPILANT les 997 blocs du site : 27 (2,7 %) ne sont pas du Python syntaxiquement
     valide — des commandes de terminal (`$ pytest -q`, `pip install requests`), des
     extraits de `pyproject.toml`, des arborescences de fichiers, un message d'erreur
     collé tel quel. Leur poser un bouton ne rendrait qu'une SyntaxError.
     ⚠ Le motif a été mesuré contre cette vérité : 20 des 27 écartés, et surtout
     ZÉRO bloc valide privé de son bouton. Un premier jet cherchait un « $ » en début
     de ligne : dans une expression régulière VERBOSE, l'ancre « $ » seule sur sa ligne
     le satisfaisait, et python/lecon-41 perdait son bouton. Un prompt de terminal est
     suivi d'une commande SUR LA MÊME LIGNE — c'est ce que le motif exige. */
  var PAS_DU_PYTHON = /^[ \t]*\$[ \t]+[a-z]|^[ \t]*(?:pip|pip3|python|python3|pytest|ruff|mypy|black|flake8|poetry|conda|jupyter|uv|source|venv|deactivate)[ \t]+[-\w.\/]|^[ \t]*\[(?:build-system|project|tool)[\w.]*\][ \t]*$|[├└│]|^[ \t]*\/\/|^[ \t]*\w*(?:Error|Exception):[ \t]/m;

  /* Rend le premier module importé qui n'est PAS embarqué, ou null. On ne regarde que
     le NOM DE TÊTE (« matplotlib.pyplot » -> « matplotlib ») et on ignore les imports
     relatifs (`from . import x`), qui ne visent aucun paquet. */
  function pyModuleAbsent(code) {
    var re = /^[ \t]*(?:import|from)[ \t]+([A-Za-z_][\w.]*)/gm;
    var m;
    while ((m = re.exec(code))) {
      var tete = m[1].split(".")[0];
      if (PY_MODULES.indexOf(tete) === -1) return tete;
    }
    return null;
  }

  /* Worker isolé : charge CPython DEPUIS LE DÉPÔT (aucun réseau) puis exécute le code.
     Mesuré le 2026-08-26 : interpréteur prêt en 799 ms, 0 requête distante, DNS coupé
     et sans --allow-file-access-from-files (tools/preuve-hors-reseau.js).
     ⚠️ Le chargeur de Pyodide emploie `await import()` — un module ES, que Chrome
     refuse en file:// — quand il tourne dans une PAGE, et `importScripts()` quand il
     tourne dans un WORKER. C'est le Worker qui rend Python possible ici, pas seulement
     l'isolement.
     ⚠️ Plus de `loadPackagesFromImports` : il irait chercher un paquet sur le réseau.
     Les blocs qui importent un paquet non embarqué n'ont pas de bouton (PY_MODULES).
     ⚠️ CHROME 152 A FERMÉ `importScripts('file:///…')` DEPUIS UN WORKER ISSU D'UN BLOB.
     Mesuré le 2026-09-02 : 43 blocs Python cliqués, 43 échecs, et le fichier de 0,8 Ko
     échoue comme celui de 4,10 Mo — ce n'est pas une affaire de taille mais la politique
     `file://`. Le Worker ne charge donc plus RIEN lui-même : la PAGE charge les scripts
     (voir `chargerDansLaPage`) et lui transmet des CHAÎNES par postMessage ; le Worker
     évalue le code et affecte les données. Voir tools/build-sources-worker.js. */
  var PY_WORKER_SRC = [
    "var ready = null;",
    "self.onmessage = function (ev) {",
    "  var d = ev.data || {};",
    "  if (d.type === 'load') {",
    "    var D = d.base + '/assets/vendor/pyodide';",
    "    try {",
    "      self.PYODIDE_WASM_GZ_B64 = d.wasm;",
    "      self.PYODIDE_STDLIB_B64 = d.stdlib;",
    "      self.PYODIDE_LOCK_GZ_B64 = d.lock;",
    /* eval INDIRECT : (0, eval) évalue en portée GLOBALE du Worker, si bien que les
       `var` de pyodide.asm.js et pyodide.js deviennent des globales, exactement comme
       si importScripts les avait chargés. Un eval direct les enfermerait ici. */
    "      (0, eval)(d.asm);",
    "      (0, eval)(d.pyjs);",
    "      (0, eval)(d.charge);",
    "    }",
    "    catch (e) { self.postMessage({ type: 'fatal', text: 'chargement : ' + (e && e.message) }); return; }",
    "    if (!self.PythonLocal) { self.postMessage({ type: 'fatal', text: 'pyodide-charge.js absent' }); return; }",
    "    ready = self.PythonLocal.pret(D);",
    "    ready.then(function () { self.postMessage({ type: 'ready' }); },",
    "               function (e) { self.postMessage({ type: 'fatal', text: String(e && e.message || e) }); });",
    "    return;",
    "  }",
    "  if (d.type === 'run') {",
    "    Promise.resolve(ready).then(function (py) {",
    "      py.setStdout({ batched: function (s) { self.postMessage({ type: 'out', level: 'log', text: s }); } });",
    "      py.setStderr({ batched: function (s) { self.postMessage({ type: 'out', level: 'error', text: s }); } });",
    "      return py.runPythonAsync(d.code).then(",
    "        function () { self.postMessage({ type: 'done' }); },",
    "        function (err) { self.postMessage({ type: 'out', level: 'error', text: (err && err.message) ? String(err.message) : String(err) }); self.postMessage({ type: 'done' }); }",
    "      );",
    "    });",
    "  }",
    "};",
  ].join("\n");

  var pyWorker = null; // Worker Pyodide partagé (chargé une fois)
  var pyLoaded = false;

  /* ------------------------------------------------------- SQL (sql.js) */
  /* Marqueurs d'un AUTRE moteur que SQLite. Deux candidats ont été écartés après
     mesure, et ils illustrent la règle « un motif trop large casse ce qui marchait » :
     /@\w/ (variables SQL Server) attrapait toutes les ADRESSES E-MAIL des chaînes
     d'exemple, et NULLS FIRST/LAST comme RETURNING sont en réalité gérés par SQLite. */
  /* Les sept marqueurs ajoutés le 2026-09-09 viennent du cours data-eng, écrit pour
     DuckDB / Snowflake / BigQuery : TRY_CAST, SAFE_CAST, DATE_DIFF, DATE_TRUNC, MD5,
     CREATE OR REPLACE TABLE, INTERVAL 1 DAY. Aucun n'existe dans SQLite — vérifié avant
     l'ajout : sur les 19 blocs du site qu'ils désignent, ZÉRO aboutissait, donc aucun
     bouton qui marchait n'a été retiré. */
  /* ROLLUP, CUBE et PIVOT : mesurés sur le moteur du dépôt le 2026-09-09 —
     « no such function: ROLLUP », « no such function: CUBE », « near "(" » — et sur les
     11 blocs du site qui les emploient, aucun n'aboutissait. */
  /* `ADD CONSTRAINT`, `DROP CONSTRAINT`, `ALTER COLUMN` et `MODIFY` : SQLite ne sait pas
     modifier une contrainte ni une colonne existante — la leçon 14 du cours bdd l'écrit
     elle-même (« SQLite, lui, ne sait pas ALTER une colonne »). 6 blocs sur les 7 du site
     qui les emploient hors commentaire étaient déjà en erreur, le septième les cite dans
     un commentaire et garde donc son bouton. */
  /* Les dix marqueurs ajoutés le 2026-09-09 (soir) viennent des leçons 4, 10, 12, 16, 17
     et 24 du cours sql, qui COMPARENT les dialectes — c'est leur sujet. Chacun a été
     essayé sur le moteur du dépôt avant d'être écrit (tmp/essai2.js) :
       EXTRACT(… FROM …)      → near "FROM": syntax error
       SUBSTRING(… FROM … FOR)→ near "FROM": syntax error   (substr() est l'équivalent SQLite)
       GRANT / REVOKE         → near "GRANT": syntax error   (pas de droits dans SQLite)
       ON DUPLICATE KEY       → near "DUPLICATE": syntax error (MySQL ; ON CONFLICT marche)
       USING GIN|GIST|…       → near "USING": syntax error
       @> et @@               → unrecognized token: "@"
       to_tsvector/to_tsquery/ts_rank → no such function
       FULLTEXT / AGAINST(…)  → near "INDEX" / near "("
       = ANY(…)               → no such function: ANY
       INCLUDE (…) sur index  → near "INCLUDE": syntax error
     Impact mesuré AVANT écriture (tmp/impact3.js) : ces motifs désignent 14 blocs du site,
     dont **0 aboutissait**. Aucun bouton vivant n'a donc été retiré.
     ⚠️ `@[>@]` et non `@\w` : la variante large attrapait les adresses e-mail. */
  /* `EXPLAIN` (mais PAS `EXPLAIN QUERY PLAN`, la forme SQLite) : celui-ci est le seul
     marqueur ajouté qui retire des boutons ABOUTISSANT — quatre, mesurés. Ils
     aboutissent et ils MENTENT : cliqué dans un vrai Chrome, `pages/sql/lecon-17.html`
     bloc 1 rend le bytecode de la machine virtuelle SQLite — colonnes
     `addr opcode p1 p2 p3 p4 p5 comment`, « 0 Init 0 10 0 NULL… » — alors que la leçon
     annonce juste en dessous « Seq Scan on clients (cost=0.00..2310.00 rows=12000) ».
     Les trois autres (`sql/lecon-14 #3`, `bdd/lecon-12 #1` et `#2`) sont dans le même
     cas : leurs pages publient des plans PostgreSQL. Un bouton qui affiche autre chose
     que ce que la page promet est pire qu'un bouton absent — c'est la raison d'être de
     ce chantier. Le lookahead préserve `EXPLAIN QUERY PLAN`, qui, lui, rend sous SQLite
     un plan lisible : une leçon qui l'écrira gardera son bouton. */
  /* `strpos(` : la leçon 14 du cours bdd l'écrit ET le dit — « strpos et reverse sont
     deux fonctions PostgreSQL ». Elle se trompe à moitié, et c'est la mesure qui l'a
     montré : sur le moteur du dépôt, `reverse('abc')` est ACCEPTÉ, seul `strpos` rend
     « no such function ». Le marqueur ne retient donc que `strpos` — ajouter `reverse`
     aurait écarté des blocs qui n'ont aucune raison de l'être. 1 bloc désigné, déjà en
     erreur, 0 vivant. */
  /* `PREPARE … FROM` et `EXECUTE … USING` : la forme MySQL des requetes preparees COTE
     SERVEUR (SQLite ne les expose que par son API C, jamais en SQL — mesure : « near
     "PREPARE" », « near "EXECUTE" »). C'est l'unique bloc SQL du cours `securite`, et il
     n'illustre pas une requete a executer mais le PRINCIPE de la separation code/valeurs.
     1 bloc designe, deja en erreur, 0 vivant. */
  var AUTRE_SGBD = /\$\$|\bLANGUAGE\s+plpgsql\b|\bCREATE\s+OR\s+REPLACE\b|\bADD\s+CONSTRAINT\b|\bDROP\s+CONSTRAINT\b|\bALTER\s+COLUMN\b|\bMODIFY\s+(?:COLUMN\s+)?\w|\bROLLUP\s*\(|\bCUBE\s*\(|\bPIVOT\s*\(|\bTRY_CAST\s*\(|\bSAFE_CAST\s*\(|\bDATE_DIFF\s*\(|\bDATE_TRUNC\s*\(|\bMD5\s*\(|\bINTERVAL\s+\d|\bCREATE\s+(?:OR\s+REPLACE\s+)?(?:FUNCTION|PROCEDURE|TRIGGER)\b|\bMATERIALIZED\s+VIEW\b|\bFOR\s+(?:UPDATE|SHARE)\b|\bGROUPING\s+SETS\b|\bQUALIFY\b|\bMERGE\s+INTO\b|\bGENERATED\s+(?:ALWAYS|BY\s+DEFAULT)\s+AS\s+IDENTITY\b|\bISOLATION\s+LEVEL\b|\bAUTO_INCREMENT\b|\bENGINE\s*=|\bSERIAL\b|\bTRUNCATE\b|\b(?:DATE|TIMESTAMP|INTERVAL)\s+'|::|\bEXPLAIN\s+ANALYZE\b|\bSET\s+search_path\b|\bILIKE\b|\bSHOW\s+(?:TABLES|DATABASES)\b|\bEXTRACT\s*\(|\bSUBSTRING\s*\([^()]*\bFROM\b|\b(?:GRANT|REVOKE)\s+(?:ALL|SELECT|INSERT|UPDATE|DELETE|EXECUTE|USAGE)\b|\bON\s+DUPLICATE\s+KEY\b|\bUSING\s+(?:GIN|GIST|SPGIST|BRIN|BTREE|HASH)\b|@[>@]|\b(?:to_tsvector|to_tsquery|ts_rank)\s*\(|\bFULLTEXT\b|\bAGAINST\s*\(|=\s*ANY\s*\(|\bINCLUDE\s*\(|\bEXPLAIN\b(?!\s+QUERY\s+PLAN)|\bstrpos\s*\(|\bPREPARE\s+\w+\s+FROM\b|\bEXECUTE\s+\w+\s+USING\b/i;

  /* Nom des tables qu'un bloc CRÉE lui-même. Sert à décider si la base de démonstration
     doit être préchargée — voir `besoinDuSeed` dans le Worker.
     ⚠️ Cette littérale est LUE telle quelle par `tools/verif-sql.js`, comme AUTRE_SGBD :
     la règle du bouton et la règle du vérificateur ne peuvent donc pas diverger. */
  var TABLE_CREEE = /\bCREATE\s+(?:TEMP(?:ORARY)?\s+)?TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?["`\[]?([A-Za-z_][A-Za-z0-9_]*)/i;

  /* Nom des VUES qu'un bloc définit lui-même.
     ⚠️ Littérale LUE par `tools/verif-sql.js`, comme AUTRE_SGBD et TABLE_CREEE. */
  var VUE_CREEE = /\bCREATE\s+(?:TEMP(?:ORARY)?\s+)?VIEW\s+(?:IF\s+NOT\s+EXISTS\s+)?["`\[]?([A-Za-z_][A-Za-z0-9_]*)/i;

  /* Table et colonne d'un `ALTER TABLE … ADD COLUMN …`, et le même principe que pour les
     vues : UNE LEÇON QUI AJOUTE UNE COLONNE L'EMPORTE SUR LE DÉCOR QUI LA PORTE DÉJÀ.
     Le besoin est concret et mesuré : la leçon 10 du cours bdd AJOUTE
     `representation.places_restantes` et `commande.total` dans un bloc, puis les LIT
     dans deux autres. Sans cette règle, il fallait choisir — porter les colonnes au
     décor (et casser le bloc qui les ajoute, « duplicate column name ») ou ne pas les
     porter (et laisser deux blocs morts). C'est exactement l'arbitrage perdant qu'on a
     rencontré sur `clients.pays` à la leçon 11 du cours sql, où il a fallu renoncer.
     La colonne est donc retirée du décor juste avant le bloc qui l'ajoute.
     ⚠️ La forme reconnue est `ADD COLUMN <nom>`, pas `ADD <nom>` : sinon `ADD CONSTRAINT`
     serait lu comme une colonne nommée « CONSTRAINT ». Les 9 `ADD COLUMN` du site sont
     tous dans cette forme (vérifié). Le retrait est tenté sans garantie — SQLite refuse
     de retirer une colonne dont un index ou une vue dépend ; l'échec est silencieux et
     le bloc se comporte alors comme avant, donc aucune régression possible. */
  var COLONNE_AJOUTEE = /\bALTER\s+TABLE\s+["`\[]?([A-Za-z_][A-Za-z0-9_]*)["`\]]?\s+ADD\s+COLUMN\s+["`\[]?([A-Za-z_][A-Za-z0-9_]*)/i;

  /* LES VUES DU DÉCOR NE SONT POSÉES QUE POUR LES BLOCS QUI LES NOMMENT, et cette
     restriction n'est pas une précaution théorique — elle a été écrite après DEUX
     régressions mesurées le 2026-09-09 :
       · la leçon 12 du cours sql CRÉE `commandes_clients` dans un bloc et la LIT dans le
         suivant. La mettre inconditionnellement dans le décor réparait le second et
         cassait le premier (« table commandes_clients already exists ») ;
       · une fois le premier point réglé (le bloc qui définit sa vue remplace celle du
         décor), c'est `pages/sql/lecon-23.html #2` qui est tombé : il fait
         `ALTER TABLE clients DROP COLUMN nom`, et SQLite refuse de retirer une colonne
         dont une vue dépend — « error in view commandes_clients after drop column ».
         Ce bloc ne parle pas de vues ; il n'avait aucune raison d'en subir une.
     D'où la règle : une vue du décor n'existe que pour le bloc qui écrit son nom, et
     jamais pour celui qui la définit lui-même. Un objet dérivé ne s'impose pas. */
  var SEED_VUES = [
    /* Leçon 12 du cours sql : la jointure clients ↔ commandes enregistrée sous un nom.
       Reprise à l'identique du bloc qui la définit, pour que le bloc suivant lise la
       même chose que ce que la leçon vient de montrer. */
    { nom: "commandes_clients",
      sql: "CREATE VIEW commandes_clients AS SELECT c.nom, c.ville, o.id AS commande_id, o.montant FROM clients AS c JOIN commandes AS o ON o.client_id = c.id;" },
    /* Leçon 24 (capstone) : le « socle » sur lequel s'empilent les trois lectures. La
       leçon le définit avec `date_trunc` et `MATERIALIZED VIEW`, deux formes que SQLite
       ne connaît pas ; ces blocs-là sont écartés du bouton, mais ceux qui LISENT le
       socle méritent d'aboutir. `mois` est le mois ISO tiré de `vendu_le`, pour que
       `ORDER BY mois` trie chronologiquement — un tri alphabétique sur « janvier,
       février… » aurait rendu la croissance mois à mois fausse à l'affichage. */
    { nom: "ca_mensuel",
      sql: "CREATE VIEW ca_mensuel AS SELECT region, substr(vendu_le,1,7) AS mois, SUM(montant) AS total, COUNT(*) AS nb_ventes FROM ventes GROUP BY region, substr(vendu_le,1,7);" }
  ];

  /* ⚠️ LES COMMENTAIRES NE SONT PAS DU CODE, et l'oublier coûtait des boutons morts.
     Mesuré le 2026-09-09 sur `pages/bdd/lecon-11.html` : le bloc RAPPELLE en commentaire
     `-- CREATE TABLE client (…, email TEXT NOT NULL UNIQUE, …);`. La règle du seed y
     lisait la création d'une table qu'elle connaît, en concluait « bloc autonome » et ne
     préchargeait rien — le `CREATE INDEX … ON representation` juste au-dessus rendait
     alors « no such table ». Les commentaires sont donc retirés AVANT toute décision.
     (Un `--` à l'intérieur d'une chaîne littérale tromperait ce motif ; aucun bloc du
     site n'est dans ce cas, vérifié le 2026-09-09.) */
  var COMMENTAIRE_SQL = /--[^\n]*|\/\*[\s\S]*?\*\//g;
  function sansCommentairesSql(sql) {
    return String(sql).replace(new RegExp(COMMENTAIRE_SQL.source, 'g'), ' ');
  }

  /* La version de sql.js n'est plus une variable de ce fichier : le moteur est
     embarqué, sa provenance et sa version (1.14.2) sont dans assets/vendor/sqljs/README.md. */
  /* Base de démo (le schéma fil rouge des leçons SQL : clients/commandes/
     produits/lignes_commande). Préchargée quand le bloc ne crée pas ses tables. */
  var SEED_SQL = [
    /* `points` suit la même logique que le doublon nom/libelle ci-dessous : la leçon 10
       du cours sql écrit `UPDATE clients SET points = …` et `INSERT INTO clients (nom,
       ville, points)`, ce qui faisait 10 boutons morts à elle seule (2026-09-09). */
    /* `client_id` DOUBLE `id`, et c'est voulu : la leçon 8 enseigne `JOIN commandes
       USING (client_id)` et écrit sous le bloc « marche seulement si la colonne porte le
       même nom des deux côtés ». Sans ce doublon, l'exemple qui ILLUSTRE la règle était
       le seul à ne pas la respecter.
       ⚠️ PAS de colonne `pays` ici, et c'est une décision mesurée : la leçon 11 ENSEIGNE
       `ALTER TABLE clients ADD COLUMN pays`, et son bloc aboutissait. L'ajouter au seed
       le cassait en « duplicate column name: pays » — un bouton vivant perdu pour en
       gagner un autre. La leçon 17, qui lisait `WHERE pays = 'FR'`, a été recalée sur
       `ville`, colonne du fil rouge : les deux boutons vivent maintenant. */
    "CREATE TABLE clients (id INTEGER PRIMARY KEY, client_id INTEGER, nom TEXT NOT NULL, ville TEXT, email TEXT, points INTEGER NOT NULL DEFAULT 0, age INTEGER);",
    "INSERT INTO clients (id,client_id,nom,ville,email,points,age) VALUES",
    " (1,1,'Camille Roy','Lyon','camille.roy@example.fr',120,34),",
    " (2,2,'Hugo Marin','Nantes','hugo.marin@example.fr',50,27),",
    " (3,3,'Ines Lopez','Lille','ines.lopez@example.fr',0,45),",
    " (4,4,'Liam Bernard','Lyon','liam.bernard@example.fr',75,19),",
    " (5,5,'Sofia Da Silva','Paris','sofia.dasilva@example.fr',30,52),",
    " (6,6,'Noe Petit','Nantes',NULL,10,31);",
    /* ⚠️ « nom » ET « libelle » désignent le même produit. Ce doublon n'est pas une
       négligence : mesuré le 2026-08-26, les leçons écrivent « SELECT nom FROM
       produits » alors que ce schéma ne connaissait que « libelle » — 62 blocs
       échouaient en « no such column ». Supprimer « libelle » casserait en retour les
       26 endroits qui l'emploient. On garde donc les deux, tenus égaux. */
    /* `quantite`, `remise` et `depot` viennent des leçons 2 et 4 du cours sql, qui
       écrivent `prix * quantite`, `COALESCE(remise, 0)` et `WHERE depot = 'Lyon'` sur
       cette table : 6 boutons morts avant le 2026-09-09. `remise` est volontairement
       NULL deux fois sur cinq — c'est ce que la leçon 4 démontre avec COALESCE. */
    "CREATE TABLE produits (id INTEGER PRIMARY KEY, nom TEXT NOT NULL, libelle TEXT NOT NULL, prix REAL NOT NULL, categorie TEXT, stock INTEGER NOT NULL DEFAULT 0, quantite INTEGER NOT NULL DEFAULT 1, remise REAL, depot TEXT);",
    "INSERT INTO produits (id,nom,libelle,prix,categorie,stock,quantite,remise,depot) VALUES",
    " (500,'Carnet A5','Carnet A5',4.90,'Papeterie',120,3,0.50,'Lyon'),",
    " (501,'Stylo plume','Stylo plume',24.00,'Papeterie',35,1,NULL,'Lyon'),",
    " (502,'Lampe de bureau','Lampe de bureau',39.00,'Mobilier',12,2,4.00,'Nantes'),",
    " (503,'Casque audio','Casque audio',79.00,'Electronique',8,1,NULL,'Nantes'),",
    " (504,'Souris sans fil','Souris sans fil',19.90,'Electronique',54,4,2.00,'Lyon');",
    /* Mêmes raisons pour `client`, `produit_id`, `categorie`, `mois`, `date` et
       `date_cmd` : les leçons 5, 7, 13 et 14 les écrivent toutes sur `commandes`.
       `client` double `client_id` comme `nom` double `libelle` au-dessus, et `date`
       comme `date_cmd` doublent `date_achat` : trois graphies pour la même donnée,
       tenues égales, plutôt que 20 boutons qui rendent une erreur. */
    /* `creee_le` et `statut` viennent de la leçon 17 : l'index PARTIEL
       (`… ON commandes (creee_le) WHERE statut = 'en_attente'`) et l'index composite
       `(client_id, creee_le DESC)` sont ses deux exemples centraux. `creee_le` double
       `date_achat` comme `date` et `date_cmd` : même donnée, la graphie de sa leçon. */
    "CREATE TABLE commandes (id INTEGER PRIMARY KEY, client_id INTEGER NOT NULL, client TEXT, produit_id INTEGER, categorie TEXT, mois TEXT, date_achat TEXT NOT NULL, date TEXT, date_cmd TEXT, creee_le TEXT, statut TEXT NOT NULL DEFAULT 'payee', montant REAL);",
    "INSERT INTO commandes (id,client_id,client,produit_id,categorie,mois,date_achat,date,date_cmd,creee_le,statut,montant) VALUES",
    " (10,1,'Camille Roy',500,'Papeterie','2026-05','2026-05-02','2026-05-02','2026-05-02','2026-05-02','payee',59.90),",
    " (11,1,'Camille Roy',502,'Mobilier','2026-05','2026-05-18','2026-05-18','2026-05-18','2026-05-18','payee',120.00),",
    " (12,2,'Hugo Marin',504,'Electronique','2026-05','2026-05-20','2026-05-20','2026-05-20','2026-05-20','en_attente',34.50),",
    " (13,3,'Ines Lopez',503,'Electronique','2026-06','2026-06-01','2026-06-01','2026-06-01','2026-06-01','payee',89.00),",
    " (14,4,'Liam Bernard',500,'Papeterie','2026-06','2026-06-03','2026-06-03','2026-06-03','2026-06-03','annulee',43.90),",
    " (15,1,'Camille Roy',501,'Papeterie','2026-06','2026-06-09','2026-06-09','2026-06-09','2026-06-09','payee',24.00),",
    " (16,5,'Sofia Da Silva',503,'Electronique','2026-06','2026-06-10','2026-06-10','2026-06-10','2026-06-10','payee',98.90);",
    "CREATE TABLE lignes_commande (commande_id INTEGER NOT NULL, produit_id INTEGER NOT NULL, quantite INTEGER NOT NULL, PRIMARY KEY (commande_id,produit_id));",
    "INSERT INTO lignes_commande (commande_id,produit_id,quantite) VALUES",
    " (10,500,2),(10,501,1),(11,502,1),(11,503,1),(12,504,1),(13,501,2),(14,500,3),(15,501,1),(16,503,1),(16,500,2);",

    /* --- au-delà du fil rouge : les autres schémas que les leçons interrogent -------
       Ces tables ne sont pas décoratives. Mesuré le 2026-08-26 par tools/verif-sql.js,
       « no such table » était la première cause d'échec (77 blocs sur 345) : les leçons
       s'appuient sur des schémas qu'elles déclarent AILLEURS dans la page, or chaque
       bloc s'exécute sur une base neuve. On fournit donc ici les plus cités. */

    /* Le fil rouge « Rideau » du cours bdd : billetterie.
       ⚠️ La chaîne salle → zone → place et la représentation 42 ont été ajoutées le
       2026-09-09 (point B1c-2). Elles ne sont pas décoratives : les leçons 10 et 11
       écrivent `JOIN salle s ON s.salle_id = r.salle_id`, `JOIN zone z ON z.zone_id =
       p.zone_id` et filtrent sur `representation_id = 42` — schéma que la leçon 4
       DÉCLARE (« une place atteint sa salle en passant par sa zone ») mais que le décor
       ne portait pas. La représentation 42 existe pour que ces requêtes rendent des
       lignes plutôt que rien : un compteur à zéro n'illustre rien. */
    "CREATE TABLE spectacle (spectacle_id INTEGER PRIMARY KEY, titre TEXT NOT NULL, genre TEXT, duree_min INTEGER);",
    "INSERT INTO spectacle VALUES (1,'Nocturne','Danse',95),(2,'Le Malentendu','Theatre',110),(3,'Quatuor No 3','Musique',75);",
    "CREATE TABLE salle (salle_id INTEGER PRIMARY KEY, nom TEXT NOT NULL, ville TEXT NOT NULL, adresse TEXT);",
    "INSERT INTO salle VALUES (1,'Théâtre du Nord','Lille','4 place du Général de Gaulle'),(2,'Salle Molière','Lyon','18 quai de Bondy');",
    "CREATE TABLE zone (zone_id INTEGER PRIMARY KEY, salle_id INTEGER NOT NULL, nom TEXT NOT NULL, categorie TEXT NOT NULL);",
    "INSERT INTO zone VALUES (10,1,'Parterre','Orchestre'),(11,1,'Premier balcon','Balcon'),(20,2,'Parterre','Orchestre');",
    /* `titre` double `spectacle.titre` : la leçon 10 écrit `SELECT titre,
       places_restantes FROM representation`, raccourci qu'elle assume. Même logique que
       le doublon nom/libelle sur `produits`. */
    "CREATE TABLE representation (representation_id INTEGER PRIMARY KEY, spectacle_id INTEGER NOT NULL, salle_id INTEGER, titre TEXT, debut TEXT NOT NULL, places_restantes INTEGER);",
    /* `places_restantes` vaut 5 pour la representation 42 alors que la verite calculee
       est 3 (5 places dans la salle 1, 2 billets vendus) : la copie a DIVERGE, ce que la
       lecon 10 demontre et que son bloc de resynchronisation corrige. */
    "INSERT INTO representation VALUES (1,1,1,'Nocturne','2026-09-12 20:30',2),(2,1,1,'Nocturne','2026-09-13 20:30',5),(3,2,2,'Le Malentendu','2026-09-19 19:00',0),(4,3,2,'Quatuor No 3','2026-10-02 18:30',0),(42,1,1,'Nocturne','2026-11-05 20:00',5);",
    "CREATE TABLE client (client_id INTEGER PRIMARY KEY, email TEXT NOT NULL UNIQUE, nom TEXT NOT NULL, prenom TEXT, ville TEXT);",
    "INSERT INTO client VALUES (1,'camille.roy@example.fr','Roy','Camille','Lyon'),(2,'hugo.marin@example.fr','Marin','Hugo','Nantes'),(3,'ines.lopez@example.fr','Lopez','Ines','Lille');",
    "CREATE TABLE place (place_id INTEGER PRIMARY KEY, zone_id INTEGER, rangee TEXT NOT NULL, numero INTEGER NOT NULL, categorie TEXT);",
    "INSERT INTO place VALUES (1,10,'A',1,'Orchestre'),(2,10,'A',2,'Orchestre'),(3,11,'B',1,'Balcon'),(4,11,'B',2,'Balcon'),(12,10,'A',12,'Orchestre');",
    /* `statut` : la transaction de la lecon 13 fait `UPDATE commande SET statut =
       'payee'`. `total` : l'agregat STOCKE de la lecon 10 — celui de la commande 3 est
       volontairement FAUX (25.00 contre 18.00 de billets) et la commande 4 n'a aucun
       billet, les deux cas que le controle de coherence de la lecon doit lever. */
    "CREATE TABLE commande (commande_id INTEGER PRIMARY KEY, client_id INTEGER NOT NULL, passee_le TEXT NOT NULL, statut TEXT NOT NULL DEFAULT 'payee', total NUMERIC);",
    "INSERT INTO commande VALUES (1,1,'2026-08-20','payee',103.00),(2,2,'2026-08-21','payee',63.50),(3,1,'2026-08-25','payee',25.00),(4,3,'2026-08-26','en_attente',12.00);",
    "CREATE TABLE billet (billet_id INTEGER PRIMARY KEY, commande_id INTEGER NOT NULL, representation_id INTEGER NOT NULL, place_id INTEGER NOT NULL, prix_paye NUMERIC NOT NULL);",
    "INSERT INTO billet VALUES (1,1,1,1,32.00),(2,1,1,2,32.00),(3,2,3,3,24.50),(4,3,4,4,18.00),(5,1,42,1,39.00),(6,2,42,12,39.00);",
    /* Le prix d'une zone pour une séance (leçon 9, 2NF) : la leçon 11 y pose un index
       composite `(zone_id, prix)`. */
    "CREATE TABLE tarif (tarif_id INTEGER PRIMARY KEY, representation_id INTEGER NOT NULL, zone_id INTEGER NOT NULL, prix NUMERIC NOT NULL, UNIQUE (representation_id, zone_id));",
    "INSERT INTO tarif VALUES (1,42,10,39.00),(2,42,11,28.00),(3,1,10,32.00);",
    /* La leçon 13 écrit `INSERT INTO paiement (commande_id, montant, moyen,
       effectue_le)` dans sa transaction ; aucune leçon ne déclare le schéma. */
    "CREATE TABLE paiement (paiement_id INTEGER PRIMARY KEY AUTOINCREMENT, commande_id INTEGER NOT NULL, montant NUMERIC NOT NULL, moyen TEXT, effectue_le TEXT);",
    "INSERT INTO paiement (commande_id,montant,moyen,effectue_le) VALUES (1,64.00,'carte','2026-08-20 10:12'),(2,24.50,'especes','2026-08-21 18:40');",
    /* L'ANTI-PATRON de la leçon 8 (colonne « liste », violation de la 1NF) : schéma et
       lignes repris À L'IDENTIQUE du bloc qui les déclare dans la page. */
    "CREATE TABLE billet_multivalue (billet_id INTEGER PRIMARY KEY, client_id INTEGER NOT NULL, places TEXT);",
    "INSERT INTO billet_multivalue VALUES (1,42,'A1,A2,A3'),(2,42,'B7');",
    /* La table à plat de la leçon 9, AVANT normalisation. Jeu de données copié du bloc
       `data-exos` de la même leçon — y compris la faute de frappe « Lile », qui est
       toute la démonstration : elle fait apparaître deux villes pour une seule salle.
       Le bouton et l'exercice auto-corrigé travaillent donc sur les mêmes lignes. */
    "CREATE TABLE reservations (billet_id INTEGER, client_nom TEXT, spectacle_titre TEXT, salle_nom TEXT, salle_ville TEXT, prix NUMERIC);",
    "INSERT INTO reservations VALUES",
    " (1,'Lou','Le Cid','Théâtre du Nord','Lille',22),",
    " (2,'Aya','Le Cid','Théâtre du Nord','Lille',22),",
    " (3,'Noah','Ruy Blas','Théâtre du Nord','Lile',18),",
    " (4,'Ines','Ruy Blas','Salle Molière','Lyon',30),",
    " (5,'Zoé','Le Cid','Salle Molière','Lyon',30),",
    " (6,'Sam','Phèdre','Le Grenier','Brest',15);",

    /* Schémas ponctuels du cours sql : hiérarchie, transactions, séries datées. */
    "CREATE TABLE employes (id INTEGER PRIMARY KEY, nom TEXT NOT NULL, service TEXT, salaire REAL, manager_id INTEGER);",
    "INSERT INTO employes VALUES (1,'Ada Lambert','Direction',7200,NULL),(2,'Hugo Marin','Ventes',3400,1),(3,'Ines Lopez','Ventes',3150,2),(4,'Liam Bernard','Technique',3800,1);",
    "CREATE TABLE comptes (id INTEGER PRIMARY KEY, titulaire TEXT NOT NULL, solde REAL NOT NULL);",
    "INSERT INTO comptes VALUES (1,'Camille Roy',1500.00),(2,'Hugo Marin',430.50),(3,'Ines Lopez',2780.00);",
    /* Les leçons 19, 20 et 24 lisent `ventes` avec sept colonnes descriptives que la
       table n'avait pas : region, produit, categorie, mois, annee, trimestre, vendu_le
       (14 boutons morts). `mois` y est le mois EN TOUTES LETTRES parce que la leçon 20
       compare `mois = 'janvier'` ; sur `commandes`, la même colonne est au format
       '2026-05' parce que la leçon 5 y groupe des mois ISO. Deux tables, deux
       conventions, chacune celle de sa leçon. */
    "CREATE TABLE ventes (id INTEGER PRIMARY KEY, produit_id INTEGER NOT NULL, jour TEXT NOT NULL, vendu_le TEXT, quantite INTEGER NOT NULL, montant REAL NOT NULL, region TEXT, produit TEXT, categorie TEXT, mois TEXT, annee INTEGER, trimestre TEXT);",
    "INSERT INTO ventes (id,produit_id,jour,vendu_le,quantite,montant,region,produit,categorie,mois,annee,trimestre) VALUES",
    " (1,500,'2026-01-14','2026-01-14',3,14.70,'Nord','Carnet A5','Papeterie','janvier',2026,'T1'),",
    " (2,501,'2026-02-02','2026-02-02',1,24.00,'Nord','Stylo plume','Papeterie','février',2026,'T1'),",
    " (3,503,'2026-03-11','2026-03-11',2,158.00,'Sud','Casque audio','Electronique','mars',2026,'T1'),",
    " (4,502,'2026-05-30','2026-05-30',1,39.00,'Sud','Lampe de bureau','Mobilier','mai',2026,'T2'),",
    " (5,504,'2026-06-08','2026-06-08',4,79.60,'Ouest','Souris sans fil','Electronique','juin',2026,'T2'),",
    " (6,500,'2026-06-21','2026-06-21',6,29.40,'Ouest','Carnet A5','Papeterie','juin',2026,'T2');",

    /* --- le fil rouge « Vélociti » du cours data-eng : bronze → silver → gold -------
       Mesuré le 2026-09-09 : sur 17 blocs SQL du cours, UN SEUL aboutissait, et 12 des
       16 échecs étaient un « no such table » sur ces tables-là. Elles sont volontairement
       MINUSCULES (quelques lignes) mais fidèles aux colonnes que les leçons citent, et
       leur contenu est choisi pour que les requêtes de contrôle de la leçon 10 rendent
       ce qu'elles annoncent : aucun type_velo hors liste, UNE station_end orpheline (999)
       et UNE durée hors plage (300 min). */
    "CREATE TABLE bronze_trajets (trip_id TEXT, start TEXT, \"end\" TEXT, station_start INTEGER, station_end INTEGER, bike INTEGER, type TEXT, ingere_le TEXT);",
    "INSERT INTO bronze_trajets VALUES",
    " ('T001','2026-05-01 08:12','2026-05-01 08:31',12,44,7301,'electrique','2026-05-02 03:00'),",
    " ('T001','2026-05-01 08:12','2026-05-01 08:31',12,44,7301,'Electrique','2026-05-03 03:00'),",
    " ('T002','2026-05-01 09:02','2026-05-01 09:17',44,12,7188,'mecanique','2026-05-02 03:00'),",
    " ('T003','2026-05-01 17:40','2026-05-01 18:05',12,999,7301,'ELEC','2026-05-02 03:00'),",
    " ('T004','01/05/2026 08:15',NULL,44,44,7042,'meca','2026-05-02 03:00');",
    "CREATE TABLE fichier_du_jour (trip_id TEXT, start TEXT, \"end\" TEXT, station_start INTEGER, station_end INTEGER, bike INTEGER, type TEXT);",
    "INSERT INTO fichier_du_jour VALUES",
    " ('T005','2026-05-02 07:55','2026-05-02 08:10',12,44,7188,'electrique'),",
    " ('T006','2026-05-02 12:30','2026-05-02 12:52',44,12,7301,'mecanique');",
    "CREATE TABLE bronze_capteurs (event_id TEXT, station_id INTEGER, ts TEXT, velos_dispo INTEGER, bornes_libres INTEGER, ingere_le TEXT);",
    "INSERT INTO bronze_capteurs VALUES",
    " ('E1',12,'2026-05-01 08:00',9,7,'2026-05-01 08:05'),",
    " ('E1',12,'2026-05-01 08:00',9,7,'2026-05-02 08:05'),",
    " ('E2',44,'2026-05-01 08:00',3,13,'2026-05-01 08:05'),",
    " ('E3',12,'2026-05-01 09:00',5,11,'2026-05-01 09:05');",
    /* Le SILVER : typé, dédoublonné, avec la durée déjà calculée (leçon 6). */
    "CREATE TABLE trajets_nettoyes (trip_id TEXT, debut TEXT, fin TEXT, duree_min INTEGER, station_start INTEGER, station_end INTEGER, bike INTEGER, type_velo TEXT, jour TEXT);",
    "INSERT INTO trajets_nettoyes VALUES",
    " ('T001','2026-05-01 08:12','2026-05-01 08:31',19,12,44,7301,'electrique','2026-05-01'),",
    " ('T002','2026-05-01 09:02','2026-05-01 09:17',15,44,12,7188,'mecanique','2026-05-01'),",
    " ('T003','2026-05-01 17:40','2026-05-01 18:05',25,12,999,7301,'electrique','2026-05-01'),",
    " ('T007','2026-05-02 06:10','2026-05-02 11:10',300,44,12,7042,'inconnu','2026-05-02');",
    /* La table PARTITIONNÉE des leçons 7 et 13 : le contrat de la leçon 11, plus la clé
       de partition `date` sur laquelle porte le pruning. */
    "CREATE TABLE trajets (trip_id TEXT, start TEXT, \"end\" TEXT, station_start INTEGER, station_end INTEGER, bike INTEGER, type TEXT, date TEXT);",
    "INSERT INTO trajets VALUES",
    " ('T001','2026-05-01 08:12','2026-05-01 08:31',12,44,7301,'electrique','2026-05-01'),",
    " ('T002','2026-05-01 09:02','2026-05-01 09:17',44,12,7188,'mecanique','2026-05-01'),",
    " ('T003','2026-05-01 17:40','2026-05-01 18:05',12,44,7301,'electrique','2026-05-01'),",
    " ('T005','2026-05-02 07:55','2026-05-02 08:10',12,44,7188,'electrique','2026-05-02'),",
    " ('T006','2026-05-07 12:30','2026-05-07 12:52',44,12,7301,'mecanique','2026-05-07'),",
    /* la station 42 existe pour que la requête de la leçon 7 (« WHERE date = … AND
       station_start = 42 ») rende 1 et non 0 : un compteur à zéro n'illustre rien. */
    " ('T008','2026-05-01 07:20','2026-05-01 07:35',42,12,7188,'electrique','2026-05-01');",
    "CREATE TABLE stations (station_id INTEGER PRIMARY KEY, nom TEXT NOT NULL, quartier TEXT);",
    "INSERT INTO stations VALUES (12,'Place du Marche','Centre'),(42,'Gare Nord','Gare'),(44,'Parc des Sports','Rive Sud');",

    /* --- les schémas d'une seule leçon du cours sql (ajoutés le 2026-09-09) ----------
       Chacun vient d'un bloc qui rendait « no such table ». Le contenu n'est pas
       inventé : il est repris de ce que LA LEÇON annonce, pour que le bouton rende ce
       que le texte promet. Voir le point B1b-2 du chantier V17. */

    /* Leçon 8, le CROSS JOIN : le texte dit « 3 tailles × 2 couleurs = 6 paires », et
       le schéma juste en dessous nomme S/M/L et Rouge/Bleu. */
    "CREATE TABLE tailles (id INTEGER PRIMARY KEY, libelle TEXT NOT NULL);",
    "INSERT INTO tailles VALUES (1,'S'),(2,'M'),(3,'L');",
    "CREATE TABLE couleurs (id INTEGER PRIMARY KEY, libelle TEXT NOT NULL);",
    "INSERT INTO couleurs VALUES (1,'Rouge'),(2,'Bleu');",

    /* Leçon 10 : cible d'un INSERT … SELECT. Volontairement VIDE — la leçon la remplit. */
    "CREATE TABLE clients_lyon (id INTEGER PRIMARY KEY AUTOINCREMENT, nom TEXT NOT NULL, points INTEGER);",

    /* Leçon 13, le top-N par catégorie. Ce jeu de données n'est pas choisi ici : il est
       COPIÉ du bloc `data-exos` de la même leçon (schéma + INSERT), pour que le bouton
       « ▶ Exécuter » et l'exercice auto-corrigé travaillent sur les mêmes lignes. */
    "CREATE TABLE ventes_produits (categorie TEXT, produit TEXT, ventes INTEGER);",
    "INSERT INTO ventes_produits VALUES",
    " ('Papeterie','Cahier',120),('Papeterie','Stylo',300),('Papeterie','Gomme',90),",
    " ('Mobilier','Chaise',210),('Mobilier','Bureau',205),('Mobilier','Lampe',50),",
    " ('Textile','Nappe',75);",

    /* Leçon 16, la CTE récursive : la table du site s'appelle `employes` (fil rouge),
       mais la leçon interroge `employe` avec SES prénoms — et son tableau de résultat
       annonce Alice au niveau 1, Brahim et Chloé au 2, Diego et Elena au 3. */
    "CREATE TABLE employe (id INTEGER PRIMARY KEY, nom TEXT NOT NULL, manager_id INTEGER);",
    "INSERT INTO employe VALUES (1,'Alice',NULL),(2,'Brahim',1),(3,'Chloé',1),(4,'Diego',2),(5,'Elena',3);",
    /* Leçon 16, le JSON : mêmes deux lignes que le CREATE TABLE de la leçon (écarté du
       bouton par SERIAL). `->>` est bien reconnu par SQLite — mesuré, pas supposé. */
    "CREATE TABLE produit (id INTEGER PRIMARY KEY, nom TEXT, specs TEXT);",
    "INSERT INTO produit (id,nom,specs) VALUES",
    " (1,'Clavier','{\"couleur\": \"noir\", \"sans_fil\": true, \"touches\": 104}'),",
    " (2,'Souris','{\"couleur\": \"blanc\", \"dpi\": 1600}');",

    /* Leçon 17, les index : trois schémas d'illustration. `factures(devise)` porte
       l'ANALYZE + l'index de l'exemple de plan périmé ; `paiements` porte l'index
       composite (compte_id, effectue_le DESC). Le compte 88 existe pour que la requête
       de la leçon rende des lignes plutôt que rien. */
    "CREATE TABLE factures (id INTEGER PRIMARY KEY, devise TEXT NOT NULL, montant REAL NOT NULL);",
    "INSERT INTO factures VALUES (1,'EUR',120.00),(2,'USD',80.00),(3,'EUR',45.50),(4,'CHF',210.00);",
    "CREATE TABLE paiements (id INTEGER PRIMARY KEY, compte_id INTEGER NOT NULL, montant REAL NOT NULL, effectue_le TEXT NOT NULL);",
    "INSERT INTO paiements VALUES (1,88,25.00,'2026-06-01'),(2,88,60.00,'2026-06-04'),(3,12,15.00,'2026-06-05'),(4,88,12.40,'2026-06-09');",

    /* Leçon 22 : l'UPDATE atomique. La ligne 128 existe pour que le bouton rende
       « 1 ligne modifiée » et non zéro. */
    "CREATE TABLE lignes_panier (id INTEGER PRIMARY KEY, panier_id INTEGER, produit_id INTEGER, quantite INTEGER NOT NULL DEFAULT 1);",
    "INSERT INTO lignes_panier VALUES (128,7,500,2),(129,7,504,1),(130,8,501,3);",

    /* Leçon 23, les migrations sans interruption. `articles.slug` est NULL au départ :
       c'est justement ce que le backfill par lots remplit. `contacts` n'a PAS de colonne
       `telephone` — le bloc l'ajoute, puis supprime `tel`. */
    "CREATE TABLE articles (id INTEGER PRIMARY KEY, titre TEXT NOT NULL, slug TEXT);",
    "INSERT INTO articles (id,titre,slug) VALUES (1,'Premiers pas en SQL',NULL),(2,'Index et plans',NULL),(3,'Migrer sans couper','migrer-sans-couper');",
    "CREATE TABLE contacts (id INTEGER PRIMARY KEY, nom TEXT NOT NULL, tel TEXT);",
    "INSERT INTO contacts VALUES (1,'Camille Roy','0601020304'),(2,'Hugo Marin','0611121314'),(3,'Ines Lopez',NULL);",
  ].join("\n");

  /* Racine du site, déduite de l'URL de CE script (js/runner.js) : les leçons vivent
     à des profondeurs différentes (index.html à la racine, pages/<cours>/lecon-NN.html
     deux crans plus bas), et un Worker construit depuis un Blob n'a de toute façon
     aucune base pour résoudre un chemin relatif. Il lui faut une URL ABSOLUE. */
  var MOI = document.currentScript && document.currentScript.src;
  var RACINE_SITE = MOI ? MOI.replace(/\/js\/runner\.js(\?.*)?$/, "") : "";

  /* CHARGER UN SCRIPT DEPUIS LA PAGE, ET LUI SEUL.
     Le 2026-08-26, le Worker chargeait lui-même sql.js et Pyodide par `importScripts()`
     sur une URL `file://` absolue. Chrome 152 le refuse (mesuré le 2026-09-02 : 41 blocs
     SQL cliqués, 41 échecs, message « The script at 'file:///…' failed to load »). Ce qui
     marche encore, et qui est mesuré : une PAGE `file://` charge un `<script src>` local,
     et une chaîne passe intacte au Worker par postMessage.
     Les scripts chargés ici n'exposent que des CHAÎNES (`self.SQL_WASM_BASE64`,
     `self.SQLJS_SRC`, …) : rien n'est exécuté dans la page, tout part au Worker.
     Le chargement est PARESSEUX et mémorisé — une page qui n'exécute ni SQL ni Python ne
     lit jamais ces mégaoctets. */
  /* ⚠️ LE CACHE EST PARTAGÉ AVEC js/lecon.js, ET IL DOIT L'ÊTRE. Les deux fichiers ont
     besoin des mêmes globales (`window.SQL_WASM_BASE64`…), et une leçon peut très bien
     voir l'apprenant cliquer sur « ▶ Exécuter » (runner) puis « Vérifier » un exercice
     SQL (lecon). Avec deux caches séparés, chacun rechargerait le script et REDÉFINIRAIT
     la globale sous les pieds de l'autre. Une seule promesse par URL : le second
     consommateur attend la même, et lit une valeur qui ne bouge plus. */
  var scriptsCharges = (window.__syntaxeMoteurs = window.__syntaxeMoteurs || {});
  function chargerDansLaPage(urls) {
    return urls.reduce(function (chaine, url) {
      return chaine.then(function () {
        if (scriptsCharges[url]) return scriptsCharges[url];
        scriptsCharges[url] = new Promise(function (res, rej) {
          var s = document.createElement("script");
          s.src = url;
          s.onload = function () { res(); };
          s.onerror = function () { rej(new Error("fichier introuvable : " + url.split("/").pop())); };
          document.head.appendChild(s);
        });
        return scriptsCharges[url];
      });
    }, Promise.resolve());
  }
  /* ⚠️ ON NE VIDE PAS LES GLOBALES APRÈS ENVOI, et c'est délibéré. Un premier jet le
     faisait — pour ne pas garder deux fois 8,6 Mo de chaînes en mémoire — puis
     « oubliait » l'URL afin qu'un prochain Worker recharge le fichier. Deux défauts :
     le Worker est recréé après un dépassement de délai (`pyWorker = null`), et surtout
     `lecon.js` lit les MÊMES globales. Un vidage entre le chargement de l'un et la
     lecture de l'autre rendrait un « fichiers incomplets » parfaitement faux. La
     mémoire est le prix de la fiabilité ; le Worker garde sa copie de toute façon. */

  /* Worker isolé : exécute la requête sur sql.js, reçu de la page sous forme de chaînes.
     L'isolement n'est pas décoratif : une requête récursive sans borne figerait la page,
     alors qu'un Worker se termine (voir le minuteur de 15 s). */
  var SQL_WORKER_SRC = [
    "var SQLP = null;",
    "var SEED = " + JSON.stringify(SEED_SQL) + ";",
    "var MOTIF_TABLE_CREEE = " + JSON.stringify(TABLE_CREEE.source) + ";",
    "var MOTIF_VUE_CREEE = " + JSON.stringify(VUE_CREEE.source) + ";",
    "var MOTIF_COLONNE_AJOUTEE = " + JSON.stringify(COLONNE_AJOUTEE.source) + ";",
    "var VUES_DECOR = " + JSON.stringify(SEED_VUES) + ";",
    "var MOTIF_COMMENTAIRE = " + JSON.stringify(COMMENTAIRE_SQL.source) + ";",
    /* ⚠️ LA RÈGLE DU SEED, ET POURQUOI ELLE A CHANGÉ LE 2026-09-09.
       Elle disait : « le bloc contient CREATE TABLE, donc il est autonome, pas de seed ».
       Mesuré sur pages/data-eng : `CREATE TABLE trajets_valides AS SELECT … FROM
       trajets_nettoyes` contient bien CREATE TABLE, mais n'est PAS autonome — il LIT une
       table qu'il ne crée pas, et repartait donc sur une base vide, garantissant l'erreur.
       La règle exacte est : on ne précharge la base de démonstration que si le bloc ne
       crée aucune table PORTANT UN NOM QU'ELLE CONTIENT DÉJÀ (sinon « table already
       exists »). Un bloc qui crée ses propres tables reçoit désormais le seed en plus,
       ce qui ne lui retire rien et rend exécutables les tables dérivées. */
    "function sansCommentaires(sql) { return String(sql).replace(new RegExp(MOTIF_COMMENTAIRE, 'g'), ' '); }",
    "var TABLES_SEED = (function () {",
    "  var re = new RegExp(MOTIF_TABLE_CREEE, 'gi'), m, out = [];",
    "  while ((m = re.exec(sansCommentaires(SEED)))) out.push(m[1].toLowerCase());",
    "  return out;",
    "})();",
    "function besoinDuSeed(code) {",
    "  var re = new RegExp(MOTIF_TABLE_CREEE, 'gi'), m, nu = sansCommentaires(code);",
    "  while ((m = re.exec(nu))) { if (TABLES_SEED.indexOf(m[1].toLowerCase()) !== -1) return false; }",
    "  return true;",
    "}",
    /* Une vue du décor n'est posée que si le bloc écrit son nom SANS la définir —
       voir SEED_VUES et les deux régressions qui ont dicté cette règle. */
    "function colonnesAReprendre(code) {",
    "  var re = new RegExp(MOTIF_COLONNE_AJOUTEE, 'gi'), m, nu = sansCommentaires(code), out = [];",
    "  while ((m = re.exec(nu))) out.push([m[1], m[2]]);",
    "  return out;",
    "}",
    "function vuesAPoser(code) {",
    "  var nu = sansCommentaires(code), defini = [], re = new RegExp(MOTIF_VUE_CREEE, 'gi'), m;",
    "  while ((m = re.exec(nu))) defini.push(m[1].toLowerCase());",
    "  return VUES_DECOR.filter(function (v) {",
    "    if (defini.indexOf(v.nom.toLowerCase()) !== -1) return false;",
    "    return new RegExp('\\\\b' + v.nom + '\\\\b', 'i').test(nu);",
    "  });",
    "}",
    "self.onmessage = function (ev) {",
    "  var d = ev.data || {};",
    "  if (d.type === 'load') {",
    "    try {",
    "      self.SQL_WASM_BASE64 = d.b64;",
    /* eval INDIRECT : portée globale du Worker, donc `var initSqlJs` de sql-wasm.js y
       devient une globale — comme le faisait importScripts. */
    "      (0, eval)(d.src);",
    "    }",
    "    catch (e) { self.postMessage({ type: 'fatal', text: 'chargement : ' + (e && e.message) }); return; }",
    "    if (typeof initSqlJs !== 'function') { self.postMessage({ type: 'fatal', text: 'initSqlJs absent' }); return; }",
    "    if (typeof self.SQL_WASM_BASE64 !== 'string') { self.postMessage({ type: 'fatal', text: 'binaire absent' }); return; }",
    "    var brut = atob(self.SQL_WASM_BASE64), bin = new Uint8Array(brut.length);",
    "    for (var i = 0; i < brut.length; i++) bin[i] = brut.charCodeAt(i);",
    /* locateFile est appelé même avec wasmBinary : il doit rendre le nom sans lever,
       sinon Emscripten avale l'exception et la promesse ne se résout jamais. */
    "    SQLP = initSqlJs({ wasmBinary: bin, locateFile: function (f) { return f; } });",
    "    SQLP.then(function () { self.postMessage({ type: 'ready' }); }, function (e) { self.postMessage({ type: 'fatal', text: String(e && e.message || e) }); });",
    "    return;",
    "  }",
    "  if (d.type === 'run') {",
    "    SQLP.then(function (SQL) {",
    "      var db = new SQL.Database();",
    "      try {",
    /* Chaque bloc part d'une base NEUVE, avec la base de démonstration s'il ne crée pas
       ses propres tables. Rejouer d'abord les blocs SQL précédents de la page a été
       essayé le 2026-08-26 puis abandonné : mesuré sur 41 blocs de 4 leçons, le
       résultat était le MÊME (5 blocs aboutis) pour un mécanisme bien plus fragile.
       Une leçon n'est pas un carnet linéaire — elle enchaîne des schémas concurrents et
       des violations de contraintes démontrées exprès, que rejouer met en collision. */
    "        if (besoinDuSeed(d.code)) { db.exec(SEED); }",
    "        vuesAPoser(d.code).forEach(function (v) { try { db.exec(v.sql); } catch (e) {} });",
    "        colonnesAReprendre(d.code).forEach(function (c) { try { db.exec('ALTER TABLE \"' + c[0] + '\" DROP COLUMN \"' + c[1] + '\"'); } catch (e) {} });",
    "        var res = db.exec(d.code);",
    "        self.postMessage({ type: 'result', res: res });",
    "      } catch (e) {",
    "        self.postMessage({ type: 'error', text: (e && e.message) ? String(e.message) : String(e) });",
    "      }",
    "      try { db.close(); } catch (e) {}",
    "    });",
    "  }",
    "};",
  ].join("\n");

  var sqlWorker = null; // Worker sql.js partagé
  var sqlLoaded = false;

  /* --------------------------------------------------------------- Boutons */
  function addBtn(bar, cls, html, onClick) {
    var b = document.createElement("button");
    b.type = "button";
    b.className = cls;
    b.innerHTML = html;
    var copy = bar.querySelector(".code-block__copy");
    bar.insertBefore(b, copy || null);
    b.addEventListener("click", function () {
      onClick(b);
    });
    return b;
  }

  /* ------------------------------------ Repli file:// (Python / SQL) -------
     En file://, Pyodide et sql.js ne peuvent pas se charger. On remplace le
     bouton d'exécution par un bouton « Serveur requis » explicite (aucune
     requête) ; le clic n'affiche qu'une explication, il ne tente rien. */

  /* --------------------------------------------- Rendre un bloc éditable */
  function makeEditable(block, code) {
    var pre = block.querySelector("pre");
    var original = code.textContent;
    var wrap = document.createElement("div");
    wrap.className = "runner-edit";
    pre.parentNode.insertBefore(wrap, pre);
    wrap.appendChild(pre);

    var ta = document.createElement("textarea");
    ta.className = "runner-edit__ta";
    ta.spellcheck = false;
    ta.setAttribute("aria-label", "Éditeur de code — modifiable");
    ta.value = original;
    wrap.appendChild(ta);

    function sync() {
      code.textContent = ta.value;
      if (window.Prism) window.Prism.highlightElement(code);
    }
    ta.addEventListener("input", sync);
    ta.addEventListener("scroll", function () {
      pre.scrollTop = ta.scrollTop;
    });
    ta.addEventListener("keydown", function (e) {
      if (e.key === "Tab") {
        e.preventDefault();
        var s = ta.selectionStart,
          en = ta.selectionEnd;
        ta.value = ta.value.slice(0, s) + "  " + ta.value.slice(en);
        ta.selectionStart = ta.selectionEnd = s + 2;
        sync();
      }
    });
    return {
      ta: ta,
      reset: function () {
        ta.value = original;
        sync();
      },
    };
  }

  /* --------------------------------------------------- Initialisation */
  function init() {
    var blocs = $all(".code-block");
    /* CE QUI PRÉCÈDE CHAQUE BLOC (point B2b-8). `heriteDuNavigateur` est la seule règle
       qui ait besoin d'un CONTEXTE : les blocs de navigateur situés AVANT celui qu'on
       examine. On les relève dans une passe séparée, faite avant toute décision, pour deux
       raisons — un bloc qui n'a pas de barre d'outils n'est jamais candidat au bouton mais
       reste une source de noms pour ceux qui le suivent, et une passe à part rend l'ordre
       explicite au lieu de le faire dépendre d'un effet de bord de la boucle principale. */
    /* La même passe relève AUSSI tous les textes JavaScript de la page, dans quelque bloc
       que ce soit : `estUnFragmentOrphelin` (point B2b-10) demande, elle, la page ENTIÈRE
       et non ce qui précède — un nom déclaré plus bas est fourni par la leçon, même si le
       repli ne peut pas le donner ; lui retirer son bouton pour cela serait un abus. */
    /* Une liste de plus depuis le point B2b-23, pour la garde de
       `heriteDuNavigateurAuNiveauRacine` : les blocs précédents qui ne sont PAS du
       navigateur, donc ceux dont le repli peut encore fournir un nom.
       ⚠️ La liste des blocs de navigateur PORTANT LE MÊME `data-file` a disparu au point
       B2b-25 : la règle ne s'en sert plus (3 blocs de plus visés, zéro vivant). */
    var navAvant = [], vusNav = [], tousJs = [];
    var autresAvant = [], vusAutres = [];
    blocs.forEach(function (block) {
      navAvant.push(vusNav.slice());
      autresAvant.push(vusAutres.slice());
      var c = block.querySelector("code.language-javascript");
      if (!c) return;
      tousJs.push(c.textContent);
      if (BROWSER_ONLY.test(c.textContent) || estDuDomDePage(c.textContent)) {
        vusNav.push(c.textContent);
      } else {
        vusAutres.push(c.textContent);
      }
    });
    blocs.forEach(function (block, iBloc) {
      var bar = block.querySelector(".code-block__bar");
      if (!bar || block.hasAttribute("data-runner")) return;
      var js = block.querySelector("code.language-javascript");
      var markup = block.querySelector("code.language-markup");
      var py = block.querySelector("code.language-python");
      var sql = block.querySelector("code.language-sql");

      if (js) {
        if (BROWSER_ONLY.test(js.textContent) || estUnFichierJson(js.textContent) ||
            estUneSuiteDeTests(js.textContent) || estUnFragmentServeur(js.textContent) ||
            estDuDomDePage(js.textContent) || estUnServiceWorker(js.textContent) ||
            neCompilePas(js.textContent) ||
            heriteDuNavigateur(js.textContent, navAvant[iBloc]) ||
            heriteDuNavigateurAuNiveauRacine(js.textContent, navAvant[iBloc], autresAvant[iBloc]) ||
            estUnFragmentOrphelin(js.textContent, tousJs)) {
          block.setAttribute("data-runner", "skip");
          return;
        }
        block.setAttribute("data-runner", "js");
        addBtn(bar, "code-block__try", ICON_PLAY + "<span>Tester</span>", function (b) {
          activateJs(block, js, bar, b);
        });
      } else if (markup) {
        block.setAttribute("data-runner", "html");
        addBtn(bar, "code-block__try", ICON_EYE + "<span>Aperçu</span>", function (b) {
          activatePreview(block, markup, bar, b);
        });
      } else if (py) {
        // On ignore les sessions REPL (prompts >>>), non exécutables telles quelles.
        if (py.textContent.indexOf(">>>") !== -1) {
          block.setAttribute("data-runner", "skip");
          return;
        }
        /* Le moteur embarqué n'a que la bibliothèque standard. Un bloc qui importe
           numpy, pandas, matplotlib ou scikit-learn ne rendrait qu'un
           « ModuleNotFoundError: No module named 'numpy' » — plus décourageant qu'un
           bloc sans bouton. Mesuré le 2026-08-26 sur les 997 blocs Python du site :
           227 importent un paquet qui n'est pas embarqué, 770 n'en importent aucun. */
        var absent = pyModuleAbsent(py.textContent);
        if (absent) {
          block.setAttribute("data-runner", "skip");
          block.setAttribute("data-runner-motif", "module-absent:" + absent);
          return;
        }
        if (PAS_DU_PYTHON.test(py.textContent)) {
          block.setAttribute("data-runner", "skip");
          block.setAttribute("data-runner-motif", "pas-du-python");
          return;
        }
        block.setAttribute("data-runner", "py");
        addBtn(bar, "code-block__try", ICON_PLAY + "<span>Tester</span>", function (b) {
          activatePython(block, py, bar, b);
        });
      } else if (sql) {
        // Seulement les vraies requêtes (pas les pseudo-schémas).
        if (!/\b(SELECT|INSERT|UPDATE|DELETE|CREATE|DROP|ALTER|WITH)\b/i.test(sql.textContent)) {
          block.setAttribute("data-runner", "skip");
          return;
        }
        /* Le moteur embarqué est SQLite. Beaucoup de blocs enseignent PostgreSQL,
           MySQL ou SQL Server : leur poser un bouton ne rendrait qu'un « near "FOR":
           syntax error » — plus déroutant qu'un bloc sans bouton. Mesuré le 2026-08-26
           sur les 345 blocs SQL du site : ce filtre en écarte 57, dont 55 échouaient
           bel et bien, et fait passer les blocs restants de 49 % à 58 % de réussite. */
        /* ⚠️ SUR LE CODE SANS COMMENTAIRES. `pages/sql/lecon-18.html` cite en rappel,
           derrière `--`, un `ALTER TABLE … ADD CONSTRAINT` PostgreSQL : le bloc lui-même
           est du SQLite valide et aboutit. Juger le texte brut lui retirait son bouton
           pour une phrase de commentaire (mesuré le 2026-09-09). */
        if (AUTRE_SGBD.test(sansCommentairesSql(sql.textContent))) {
          block.setAttribute("data-runner", "skip");
          return;
        }
        /* Aucune garde de protocole ici : depuis le 2026-08-26, SQLite est embarqué
           dans assets/vendor/sqljs/ et s'exécute en file:// (prouvé réseau coupé par
           tools/preuve-hors-reseau.js). Python l'a rejoint le même jour. */
        block.setAttribute("data-runner", "sql");
        addBtn(bar, "code-block__try", ICON_PLAY + "<span>Exécuter</span>", function (b) {
          activateSql(block, sql, bar, b);
        });
      }
    });
  }

  /* ----------------------------------------------- Mode JS (exécution) */
  function activateJs(block, code, bar, tryBtn) {
    var ed = makeEditable(block, code);
    var out = document.createElement("div");
    out.className = "runner-output";
    out.setAttribute("aria-live", "polite");
    block.appendChild(out);

    tryBtn.remove();
    var runBtn = addBtn(bar, "code-block__run", ICON_PLAY + "<span>Exécuter</span>", function () {
      runCode(ed.ta.value, out, runBtn, block);
    });
    addBtn(bar, "code-block__reset", ICON_RESET + "<span>Init</span>", function () {
      ed.reset();
      ed.ta.focus();
    });
    ed.ta.focus();
    runCode(ed.ta.value, out, runBtn, block);
  }

  /* ----------------------------------------------- Mode Python (Pyodide) */
  function activatePython(block, code, bar, tryBtn) {
    var ed = makeEditable(block, code);
    var out = document.createElement("div");
    out.className = "runner-output";
    out.setAttribute("aria-live", "polite");
    out.innerHTML =
      '<p class="runner-output__head">Console Python</p>' +
      '<div class="runner-output__line runner-output__line--empty">Clique sur « Exécuter » pour lancer le code (Python se charge à la première exécution).</div>';
    block.appendChild(out);

    tryBtn.remove();
    var runBtn = addBtn(bar, "code-block__run", ICON_PLAY + "<span>Exécuter</span>", function () {
      runPython(ed.ta.value, out, runBtn);
    });
    addBtn(bar, "code-block__reset", ICON_RESET + "<span>Init</span>", function () {
      ed.reset();
      ed.ta.focus();
    });
    ed.ta.focus();
  }

  /* ----------------------------------------------- Mode SQL (sql.js) */
  function activateSql(block, code, bar, tryBtn) {
    var ed = makeEditable(block, code);
    var out = document.createElement("div");
    out.className = "runner-output";
    out.setAttribute("aria-live", "polite");
    out.innerHTML =
      '<p class="runner-output__head">Résultat SQL</p>' +
      '<div class="runner-output__line runner-output__line--empty">Base de démo disponible : clients, produits, commandes, lignes_commande. Clique sur « Exécuter ».</div>';
    block.appendChild(out);

    tryBtn.remove();
    var runBtn = addBtn(bar, "code-block__run", ICON_PLAY + "<span>Exécuter</span>", function () {
      runSql(ed.ta.value, out, runBtn);
    });
    addBtn(bar, "code-block__reset", ICON_RESET + "<span>Init</span>", function () {
      ed.reset();
      ed.ta.focus();
    });
    ed.ta.focus();
  }

  /* ----------------------------------------------- Mode HTML (aperçu) */
  function activatePreview(block, code, bar, btn) {
    var ed = makeEditable(block, code);
    var wrap = document.createElement("div");
    wrap.className = "runner-preview";
    var head = document.createElement("div");
    head.className = "runner-preview__head";
    head.textContent = "Aperçu du rendu";
    var frame = document.createElement("iframe");
    frame.className = "runner-preview__frame";
    frame.setAttribute("sandbox", "allow-scripts");
    frame.setAttribute("title", "Aperçu du rendu HTML");
    wrap.appendChild(head);
    wrap.appendChild(frame);
    block.appendChild(wrap);

    btn.remove();
    addBtn(bar, "code-block__run", ICON_EYE + "<span>Actualiser</span>", function () {
      render(ed.ta.value, frame);
    });
    addBtn(bar, "code-block__reset", ICON_RESET + "<span>Init</span>", function () {
      ed.reset();
      render(ed.ta.value, frame);
      ed.ta.focus();
    });
    render(ed.ta.value, frame);
  }

  function render(html, frame) {
    var full = /<html[\s>]/i.test(html) || /<!doctype/i.test(html);
    frame.srcdoc = full ? html : PREVIEW_PRE + html + PREVIEW_SUF;
  }

  /* --------------------------------------------------- Exécution sandboxée */
  /* Les blocs JavaScript À BOUTON qui précèdent celui-ci dans la leçon, dans l'ordre du
     document et dans leur état COURANT : si l'apprenant a modifié un bloc plus haut, c'est
     SA version qui sert de préambule, pas celle du disque. */
  function preambuleDe(block) {
    var pre = [];
    var blocs = $all(".code-block");
    for (var i = 0; i < blocs.length; i++) {
      if (blocs[i] === block) break;
      if (blocs[i].getAttribute("data-runner") !== "js") continue;
      var ta = blocs[i].querySelector("textarea");
      var code = blocs[i].querySelector("code.language-javascript");
      var texte = ta ? ta.value : code ? code.textContent : "";
      if (texte) pre.push(texte);
    }
    return pre;
  }

  function runCode(codeStr, out, runBtn, block) {
    lancerJs(codeStr, [], out, runBtn, block, null, null);
  }

  /* `prelude` vide = l'exécution ordinaire, celle qui existait avant le repli. Non vide =
     le second essai. `secours` porte alors ce que le PREMIER essai avait affiché : si le
     repli échoue à son tour, on le remet, car c'est l'erreur du code que l'apprenant a
     sous les yeux qui doit lui être montrée, pas celle d'un préambule qu'il n'a pas écrit.
     `prefixe` est la liste COMPLÈTE des blocs précédents dont `prelude` a été tiré : le
     ré-ancrage en a besoin pour retrancher, et elle ne se retrouverait pas depuis `prelude`,
     qui est déjà le résultat du tri. */
  /* `ancres` (point B2b-17) : la mémoire des noms déjà ancrés, portée de relance en
     relance. C'est elle qui garantit qu'un nom n'est ancré qu'une fois, donc que la
     chaîne des replis se termine. */
  function lancerJs(codeStr, prelude, out, runBtn, block, secours, prefixe, ancres) {
    ancres = ancres || [];
    out.innerHTML = '<p class="runner-output__head">Console</p>';
    var lines = 0,
      finished = false,
      worker = null,
      url = null;
    var journal = [],
      erreurVue = null;
    runBtn.classList.add("is-running");

    /* ⚠️ Cette ligne est une NOTE du moteur, pas une sortie du programme, et elle porte une
       classe qui le dit : `verif-clic.js` compare au caractère près ce que la page imprime
       à ce que le clic rend, et une phrase de commentaire glissée en tête ferait diverger
       tous les blocs repliés. Le style reste celui d'une ligne discrète (`--empty`) : aucun
       CSS n'est ajouté. */
    if (prelude.length) {
      line("note", prelude.length > 1
        ? "(les " + prelude.length + " blocs JavaScript qui précèdent dans la leçon ont été" +
          " exécutés avant celui-ci — leurs affichages sont masqués)"
        : "(le bloc JavaScript qui précède dans la leçon a été exécuté avant celui-ci —" +
          " son affichage est masqué)");
    }

    function line(level, text) {
      journal.push([level, text]);
      if (level === "error") erreurVue = text;
      var cls = "runner-output__line";
      if (level === "error") cls += " runner-output__line--error";
      else if (level === "warn") cls += " runner-output__line--warn";
      else if (level === "empty") cls += " runner-output__line--empty";
      else if (level === "note") cls += " runner-output__line--empty runner-output__line--note";
      var p = document.createElement("div");
      p.className = cls;
      p.textContent = text;
      out.appendChild(p);
      out.scrollTop = out.scrollHeight;
    }

    function end() {
      if (finished) return;
      finished = true;
      clearTimeout(hard);
      clearTimeout(soft);
      try {
        if (worker) worker.terminate();
      } catch (e) {}
      if (url) URL.revokeObjectURL(url);

      /* LE REPLI : ce bloc a échoué SEUL sur un nom manquant, et la leçon contient des
         blocs avant lui. On le rejoue derrière eux, dans un Worker neuf. */
      if (!prelude.length && erreurVue && meriteUnRepli(erreurVue) && block) {
        var prefixe0 = preambuleDe(block);
        var pre = preambuleQuiCompile(prefixe0, codeStr, ancres);
        if (pre.length) {
          runBtn.classList.remove("is-running");
          lancerJs(codeStr, pre, out, runBtn, block, journal, prefixe0, ancres);
          return;
        }
      }
      /* LA RÉÉCRITURE DU PRÉFIXE : le repli a échoué à son tour. Deux réponses possibles —
         le RÉ-ANCRAGE (point B2b-9) coupe la FIN du préfixe quand un bloc plus ancien
         déclare le nom manquant, l'ÉLAGAGE (point B2b-14) en coupe le DÉBUT quand un bloc
         du préambule lit un nom qu'un bloc plus bas met en zone morte temporelle. Leur
         ORDRE est décidé par `prochainPrefixe`, écrit une seule fois et lu par les outils.
         `secours` est repassé tel quel : ce qu'on remontrera en cas d'échec reste le
         PREMIER essai, celui du bloc seul, pas celui d'un repli intermédiaire. */
      if (prelude.length && erreurVue && prefixe && prefixe.length) {
        var suite = prochainPrefixe(prefixe, erreurVue, ancres);
        if (suite) {
          var preN = preambuleQuiCompile(suite.prefixe, codeStr, ancres);
          if (preN.length) {
            runBtn.classList.remove("is-running");
            lancerJs(codeStr, preN, out, runBtn, block, secours, suite.prefixe, ancres);
            return;
          }
        }
      }
      /* Le repli n'a pas mieux fait : on remet mot pour mot le premier essai. */
      if (prelude.length && erreurVue && secours) {
        out.innerHTML = '<p class="runner-output__head">Console</p>';
        secours.forEach(function (l) {
          var cls = "runner-output__line";
          if (l[0] === "error") cls += " runner-output__line--error";
          else if (l[0] === "warn") cls += " runner-output__line--warn";
          else if (l[0] === "empty") cls += " runner-output__line--empty";
          var p = document.createElement("div");
          p.className = cls;
          p.textContent = l[1];
          out.appendChild(p);
        });
        runBtn.classList.remove("is-running");
        return;
      }
      runBtn.classList.remove("is-running");
      if (lines === 0 && !out.querySelector(".runner-output__line--error")) {
        line("empty", "(aucune sortie — ajoute un console.log pour afficher un résultat)");
      }
    }

    try {
      var blob = new Blob([WORKER_SRC], { type: "application/javascript" });
      url = URL.createObjectURL(blob);
      worker = new Worker(url);
    } catch (e) {
      line("error", "Impossible d'exécuter le code dans ce contexte : " + (e && e.message));
      end();
      return;
    }

    var hard = setTimeout(function () {
      line("error", "⏱ Exécution interrompue après 3 s (boucle infinie ?).");
      end();
    }, 3000);
    var soft = null;

    worker.onmessage = function (e) {
      var d = e.data || {};
      if (d.done) {
        clearTimeout(hard);
        soft = setTimeout(end, 900);
        return;
      }
      lines++;
      line(d.level, d.text);
    };
    worker.onerror = function (e) {
      line("error", (e && e.message) || "Erreur d'exécution");
      end();
    };

    try {
      worker.postMessage(prelude.length ? { code: codeStr, prelude: prelude } : codeStr);
    } catch (e) {
      line("error", "Erreur : " + (e && e.message));
      end();
    }
  }

  /* ------------------------------------------ Exécution Python (Pyodide) */
  function runPython(codeStr, out, runBtn) {
    out.innerHTML = '<p class="runner-output__head">Console Python</p>';
    function line(level, text) {
      var cls = "runner-output__line";
      if (level === "error") cls += " runner-output__line--error";
      else if (level === "warn") cls += " runner-output__line--warn";
      else if (level === "empty") cls += " runner-output__line--empty";
      var p = document.createElement("div");
      p.className = cls;
      p.textContent = text;
      out.appendChild(p);
      out.scrollTop = out.scrollHeight;
    }

    runBtn.classList.add("is-running");
    var finished = false,
      sawOut = false,
      timer = null;

    function finish() {
      if (finished) return;
      finished = true;
      clearTimeout(timer);
      if (pyWorker) pyWorker.removeEventListener("message", onMsg);
      runBtn.classList.remove("is-running");
    }
    function killWorker() {
      try {
        if (pyWorker) pyWorker.terminate();
      } catch (e) {}
      pyWorker = null;
      pyLoaded = false;
    }
    function fatal(detail) {
      out.innerHTML = '<p class="runner-output__head">Console Python</p>';
      line(
        "error",
        "Python n'a pas pu démarrer" + (detail ? " (" + detail + ")" : "") +
          ". L'interpréteur est pourtant dans le dépôt, à assets/vendor/pyodide/ — vérifie que ce dossier est bien présent à côté des pages."
      );
      killWorker();
      finish();
    }
    function startRun() {
      out.innerHTML = '<p class="runner-output__head">Console Python</p>';
      pyWorker.postMessage({ type: "run", code: codeStr });
      timer = setTimeout(function () {
        line("error", "⏱ Exécution interrompue après 15 s (boucle infinie ?).");
        killWorker();
        finish();
      }, 15000);
    }
    function onMsg(ev) {
      var d = ev.data || {};
      if (d.type === "fatal") {
        fatal(d.text);
      } else if (d.type === "ready") {
        pyLoaded = true;
        startRun();
      } else if (d.type === "out") {
        sawOut = true;
        line(d.level, d.text);
      } else if (d.type === "done") {
        if (!sawOut) line("empty", "(aucune sortie — utilise print() pour afficher un résultat)");
        finish();
      }
    }

    if (!pyWorker) {
      try {
        var blob = new Blob([PY_WORKER_SRC], { type: "application/javascript" });
        pyWorker = new Worker(URL.createObjectURL(blob));
      } catch (e) {
        line("error", "Impossible de démarrer l'environnement Python dans ce navigateur.");
        finish();
        return;
      }
      pyWorker.addEventListener("message", onMsg);
      line("empty", "Démarrage de Python… (environ une seconde la première fois)");
      var PY = RACINE_SITE + "/assets/vendor/pyodide";
      chargerDansLaPage([PY + "/pyodide-wasm-gz-b64.js", PY + "/pyodide-stdlib-b64.js",
                         PY + "/pyodide-lock-b64.js", PY + "/pyodide-src.js"]).then(function () {
        if (typeof window.PYODIDE_ASM_SRC !== "string" || typeof window.PYODIDE_WASM_GZ_B64 !== "string") {
          fatal("les fichiers de Python sont incomplets dans assets/vendor/pyodide/.");
          return;
        }
        pyWorker.postMessage({
          type: "load", base: RACINE_SITE,
          wasm: window.PYODIDE_WASM_GZ_B64, stdlib: window.PYODIDE_STDLIB_B64,
          lock: window.PYODIDE_LOCK_GZ_B64, asm: window.PYODIDE_ASM_SRC,
          pyjs: window.PYODIDE_JS_SRC, charge: window.PYODIDE_CHARGE_SRC,
        });
      }, function (e) {
        fatal((e && e.message) || "chargement impossible");
      });
    } else {
      pyWorker.addEventListener("message", onMsg);
      if (pyLoaded) {
        startRun();
      } else {
        line("empty", "Démarrage de Python…");
      }
    }
  }

  /* ---------------------------------------------- Exécution SQL (sql.js) */
  function runSql(codeStr, out, runBtn) {
    out.innerHTML = '<p class="runner-output__head">Résultat SQL</p>';
    function esc(s) {
      return String(s).replace(/[&<>"]/g, function (c) {
        return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
      });
    }
    function line(level, text) {
      var cls = "runner-output__line";
      if (level === "error") cls += " runner-output__line--error";
      else if (level === "empty") cls += " runner-output__line--empty";
      var p = document.createElement("div");
      p.className = cls;
      p.textContent = text;
      out.appendChild(p);
      out.scrollTop = out.scrollHeight;
    }
    function renderResult(res) {
      if (!res || !res.length) {
        line("empty", "Requête exécutée (aucune ligne à afficher).");
        return;
      }
      res.forEach(function (r) {
        var html = '<table class="runner-table"><thead><tr>';
        r.columns.forEach(function (c) {
          html += "<th>" + esc(c) + "</th>";
        });
        html += "</tr></thead><tbody>";
        r.values.forEach(function (row) {
          html += "<tr>";
          row.forEach(function (v) {
            html += "<td>" + (v === null ? '<span class="sql-null">NULL</span>' : esc(v)) + "</td>";
          });
          html += "</tr>";
        });
        html += "</tbody></table>";
        var wrap = document.createElement("div");
        wrap.className = "runner-table-wrap";
        wrap.innerHTML = html;
        out.appendChild(wrap);
        line("empty", r.values.length + (r.values.length > 1 ? " lignes" : " ligne"));
      });
    }

    runBtn.classList.add("is-running");
    var finished = false,
      timer = null;

    function finish() {
      if (finished) return;
      finished = true;
      clearTimeout(timer);
      if (sqlWorker) sqlWorker.removeEventListener("message", onMsg);
      runBtn.classList.remove("is-running");
    }
    function killWorker() {
      try {
        if (sqlWorker) sqlWorker.terminate();
      } catch (e) {}
      sqlWorker = null;
      sqlLoaded = false;
    }
    /* SQLite est dans le dépôt : un échec ici n'est plus un problème de réseau mais un
       fichier manquant ou déplacé. On le dit, avec le détail remonté par le Worker. */
    function fatal(detail) {
      out.innerHTML = '<p class="runner-output__head">Résultat SQL</p>';
      line(
        "error",
        "SQLite n'a pas pu se charger" + (detail ? " (" + detail + ")" : "") +
          ". Le moteur est pourtant embarqué dans le site : vérifie que le dossier " +
          "assets/vendor/sqljs/ est bien présent à côté du dossier js/."
      );
      killWorker();
      finish();
    }
    function startRun() {
      out.innerHTML = '<p class="runner-output__head">Résultat SQL</p>';
      sqlWorker.postMessage({ type: "run", code: codeStr });
      timer = setTimeout(function () {
        line("error", "⏱ Requête interrompue après 10 s.");
        killWorker();
        finish();
      }, 10000);
    }
    function onMsg(ev) {
      var d = ev.data || {};
      if (d.type === "fatal") {
        fatal(d.text);
      } else if (d.type === "ready") {
        sqlLoaded = true;
        startRun();
      } else if (d.type === "result") {
        renderResult(d.res);
        finish();
      } else if (d.type === "error") {
        line("error", d.text);
        finish();
      }
    }

    if (!sqlWorker) {
      try {
        var blob = new Blob([SQL_WORKER_SRC], { type: "application/javascript" });
        sqlWorker = new Worker(URL.createObjectURL(blob));
      } catch (e) {
        line("error", "Impossible de démarrer l'environnement SQL dans ce navigateur.");
        finish();
        return;
      }
      sqlWorker.addEventListener("message", onMsg);
      line("empty", "Chargement de SQLite… (quelques secondes la première fois)");
      var SQ = RACINE_SITE + "/assets/vendor/sqljs";
      chargerDansLaPage([SQ + "/sql-wasm-base64.js", SQ + "/sql-wasm-src.js"]).then(function () {
        if (typeof window.SQLJS_SRC !== "string" || typeof window.SQL_WASM_BASE64 !== "string") {
          fatal("les fichiers de SQLite sont incomplets dans assets/vendor/sqljs/.");
          return;
        }
        sqlWorker.postMessage({ type: "load", b64: window.SQL_WASM_BASE64, src: window.SQLJS_SRC });
      }, function (e) {
        fatal((e && e.message) || "chargement impossible");
      });
    } else {
      sqlWorker.addEventListener("message", onMsg);
      if (sqlLoaded) {
        startRun();
      } else {
        line("empty", "Chargement de SQLite…");
      }
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
