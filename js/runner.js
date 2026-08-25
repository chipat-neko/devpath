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
   JS, HTML et SQL fonctionnent en file:// (aucun serveur). ⚠️ Python (Pyodide) se
   charge encore depuis un CDN et EXIGE le protocole HTTP : en file:// — le mode
   fondateur du site — l'exécution échoue toujours. On le SIGNALE donc AVANT le clic
   (bouton « Serveur requis » désactivé, aucune requête émise) au lieu d'afficher une
   erreur après.
   SQL, lui, ne dépend plus du réseau depuis le 2026-08-26 : le binaire WebAssembly de
   SQLite est embarqué dans assets/vendor/sqljs/ (encodé en base64, car en file:// un
   fetch() vers un .wasm local est refusé) et le Worker l'importe par une URL file://
   ABSOLUE — un Worker issu d'un Blob n'a aucune base pour un chemin relatif.
   À charger après main.js.
   ============================================================================= */
(function () {
  "use strict";

  // Pyodide se charge depuis un CDN et n'aboutit qu'en HTTP : inutile d'essayer en
  // file://, on prévient avant le clic. (sql.js, lui, est embarqué depuis le
  // 2026-08-26 et n'a plus besoin de cette garde.)
  var HTTP_OK = location.protocol === "http:" || location.protocol === "https:";

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
  var BROWSER_ONLY = /(?:^|[^\w$À-ɏ])(document|window|localStorage|sessionStorage|alert|prompt|confirm|location|navigator|process|Buffer|__dirname|__filename)(?![\w$À-ɏ])|require\s*\(|module\.exports|\bexports\.|\bglobalThis\b|node:|new Worker|postMessage|SharedArrayBuffer|Atomics|importScripts/;

  // Enveloppe de base pour l'aperçu d'un FRAGMENT HTML (style minimal lisible)
  var PREVIEW_PRE =
    '<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">' +
    "<style>body{font-family:system-ui,-apple-system,sans-serif;margin:14px;color:#1a1713;line-height:1.5;background:#fff}" +
    "img{max-width:100%;height:auto}table{border-collapse:collapse}td,th{border:1px solid #cabfa9;padding:4px 8px}" +
    "a{color:#2540f0}*{box-sizing:border-box}</style></head><body>";
  var PREVIEW_SUF = "</body></html>";

  /* Code exécuté DANS le worker : capture la console puis évalue le code reçu. */
  var WORKER_SRC = [
    "self.onmessage = function (ev) {",
    "  var code = ev.data;",
    "  function fmt(v) {",
    '    if (typeof v === "string") return v;',
    '    if (v === undefined) return "undefined";',
    '    if (v === null) return "null";',
    '    if (typeof v === "function") return v.toString();',
    "    try { return JSON.stringify(v); } catch (e) { return String(v); }",
    "  }",
    "  function send(level, args) {",
    '    self.postMessage({ level: level, text: Array.prototype.slice.call(args).map(fmt).join(" ") });',
    "  }",
    '  ["log", "info", "debug"].forEach(function (l) { console[l] = function () { send("log", arguments); }; });',
    '  console.warn = function () { send("warn", arguments); };',
    '  console.error = function () { send("error", arguments); };',
    "  try { (0, eval)(code); }",
    '  catch (err) { send("error", [err && err.message ? err.name + ": " + err.message : String(err)]); }',
    "  self.postMessage({ done: true });",
    "};",
  ].join("\n");

  /* ----------------------------------------------------- Python (Pyodide) */
  var PY_VER = "0.26.2";
  /* Worker isolé : charge Pyodide depuis le CDN puis exécute le code Python. */
  var PY_WORKER_SRC = [
    "var ready = null;",
    "self.onmessage = function (ev) {",
    "  var d = ev.data || {};",
    "  if (d.type === 'load') {",
    "    try { importScripts('https://cdn.jsdelivr.net/pyodide/v" + PY_VER + "/full/pyodide.js'); }",
    "    catch (e) { self.postMessage({ type: 'fatal' }); return; }",
    "    if (typeof loadPyodide !== 'function') { self.postMessage({ type: 'fatal' }); return; }",
    "    ready = loadPyodide();",
    "    ready.then(function () { self.postMessage({ type: 'ready' }); }, function () { self.postMessage({ type: 'fatal' }); });",
    "    return;",
    "  }",
    "  if (d.type === 'run') {",
    "    Promise.resolve(ready).then(function (py) {",
    "      py.setStdout({ batched: function (s) { self.postMessage({ type: 'out', level: 'log', text: s }); } });",
    "      py.setStderr({ batched: function (s) { self.postMessage({ type: 'out', level: 'error', text: s }); } });",
    "      return py.loadPackagesFromImports(d.code).catch(function () {}).then(function () { return py.runPythonAsync(d.code); }).then(",
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
  var AUTRE_SGBD = /\$\$|\bLANGUAGE\s+plpgsql\b|\bCREATE\s+(?:OR\s+REPLACE\s+)?(?:FUNCTION|PROCEDURE|TRIGGER)\b|\bMATERIALIZED\s+VIEW\b|\bFOR\s+(?:UPDATE|SHARE)\b|\bGROUPING\s+SETS\b|\bQUALIFY\b|\bMERGE\s+INTO\b|\bGENERATED\s+(?:ALWAYS|BY\s+DEFAULT)\s+AS\s+IDENTITY\b|\bISOLATION\s+LEVEL\b|\bAUTO_INCREMENT\b|\bENGINE\s*=|\bSERIAL\b|\bTRUNCATE\b|\b(?:DATE|TIMESTAMP|INTERVAL)\s+'|::|\bEXPLAIN\s+ANALYZE\b|\bSET\s+search_path\b|\bILIKE\b|\bSHOW\s+(?:TABLES|DATABASES)\b/i;

  /* La version de sql.js n'est plus une variable de ce fichier : le moteur est
     embarqué, sa provenance et sa version (1.14.2) sont dans assets/vendor/sqljs/README.md. */
  /* Base de démo (le schéma fil rouge des leçons SQL : clients/commandes/
     produits/lignes_commande). Préchargée quand le bloc ne crée pas ses tables. */
  var SEED_SQL = [
    "CREATE TABLE clients (id INTEGER PRIMARY KEY, nom TEXT NOT NULL, ville TEXT, email TEXT);",
    "INSERT INTO clients (id,nom,ville,email) VALUES",
    " (1,'Camille Roy','Lyon','camille.roy@example.fr'),",
    " (2,'Hugo Marin','Nantes','hugo.marin@example.fr'),",
    " (3,'Ines Lopez','Lille','ines.lopez@example.fr'),",
    " (4,'Liam Bernard','Lyon','liam.bernard@example.fr'),",
    " (5,'Sofia Da Silva','Paris','sofia.dasilva@example.fr'),",
    " (6,'Noe Petit','Nantes',NULL);",
    /* ⚠️ « nom » ET « libelle » désignent le même produit. Ce doublon n'est pas une
       négligence : mesuré le 2026-08-26, les leçons écrivent « SELECT nom FROM
       produits » alors que ce schéma ne connaissait que « libelle » — 62 blocs
       échouaient en « no such column ». Supprimer « libelle » casserait en retour les
       26 endroits qui l'emploient. On garde donc les deux, tenus égaux. */
    "CREATE TABLE produits (id INTEGER PRIMARY KEY, nom TEXT NOT NULL, libelle TEXT NOT NULL, prix REAL NOT NULL, categorie TEXT, stock INTEGER NOT NULL DEFAULT 0);",
    "INSERT INTO produits (id,nom,libelle,prix,categorie,stock) VALUES",
    " (500,'Carnet A5','Carnet A5',4.90,'Papeterie',120),",
    " (501,'Stylo plume','Stylo plume',24.00,'Papeterie',35),",
    " (502,'Lampe de bureau','Lampe de bureau',39.00,'Mobilier',12),",
    " (503,'Casque audio','Casque audio',79.00,'Electronique',8),",
    " (504,'Souris sans fil','Souris sans fil',19.90,'Electronique',54);",
    "CREATE TABLE commandes (id INTEGER PRIMARY KEY, client_id INTEGER NOT NULL, date_achat TEXT NOT NULL, montant REAL NOT NULL);",
    "INSERT INTO commandes (id,client_id,date_achat,montant) VALUES",
    " (10,1,'2026-05-02',59.90),(11,1,'2026-05-18',120.00),(12,2,'2026-05-20',34.50),",
    " (13,3,'2026-06-01',89.00),(14,4,'2026-06-03',43.90),(15,1,'2026-06-09',24.00),(16,5,'2026-06-10',98.90);",
    "CREATE TABLE lignes_commande (commande_id INTEGER NOT NULL, produit_id INTEGER NOT NULL, quantite INTEGER NOT NULL, PRIMARY KEY (commande_id,produit_id));",
    "INSERT INTO lignes_commande (commande_id,produit_id,quantite) VALUES",
    " (10,500,2),(10,501,1),(11,502,1),(11,503,1),(12,504,1),(13,501,2),(14,500,3),(15,501,1),(16,503,1),(16,500,2);",

    /* --- au-delà du fil rouge : les autres schémas que les leçons interrogent -------
       Ces tables ne sont pas décoratives. Mesuré le 2026-08-26 par tools/verif-sql.js,
       « no such table » était la première cause d'échec (77 blocs sur 345) : les leçons
       s'appuient sur des schémas qu'elles déclarent AILLEURS dans la page, or chaque
       bloc s'exécute sur une base neuve. On fournit donc ici les plus cités. */

    /* Le fil rouge « Rideau » du cours bdd : billetterie. */
    "CREATE TABLE spectacle (spectacle_id INTEGER PRIMARY KEY, titre TEXT NOT NULL, genre TEXT, duree_min INTEGER);",
    "INSERT INTO spectacle VALUES (1,'Nocturne','Danse',95),(2,'Le Malentendu','Theatre',110),(3,'Quatuor No 3','Musique',75);",
    "CREATE TABLE representation (representation_id INTEGER PRIMARY KEY, spectacle_id INTEGER NOT NULL, debut TEXT NOT NULL);",
    "INSERT INTO representation VALUES (1,1,'2026-09-12 20:30'),(2,1,'2026-09-13 20:30'),(3,2,'2026-09-19 19:00'),(4,3,'2026-10-02 18:30');",
    "CREATE TABLE client (client_id INTEGER PRIMARY KEY, email TEXT NOT NULL UNIQUE, nom TEXT NOT NULL, prenom TEXT, ville TEXT);",
    "INSERT INTO client VALUES (1,'camille.roy@example.fr','Roy','Camille','Lyon'),(2,'hugo.marin@example.fr','Marin','Hugo','Nantes'),(3,'ines.lopez@example.fr','Lopez','Ines','Lille');",
    "CREATE TABLE place (place_id INTEGER PRIMARY KEY, rangee TEXT NOT NULL, numero INTEGER NOT NULL, categorie TEXT);",
    "INSERT INTO place VALUES (1,'A',1,'Orchestre'),(2,'A',2,'Orchestre'),(3,'B',1,'Balcon'),(4,'B',2,'Balcon');",
    "CREATE TABLE commande (commande_id INTEGER PRIMARY KEY, client_id INTEGER NOT NULL, passee_le TEXT NOT NULL);",
    "INSERT INTO commande VALUES (1,1,'2026-08-20'),(2,2,'2026-08-21'),(3,1,'2026-08-25');",
    "CREATE TABLE billet (billet_id INTEGER PRIMARY KEY, commande_id INTEGER NOT NULL, representation_id INTEGER NOT NULL, place_id INTEGER NOT NULL, prix_paye NUMERIC NOT NULL);",
    "INSERT INTO billet VALUES (1,1,1,1,32.00),(2,1,1,2,32.00),(3,2,3,3,24.50),(4,3,4,4,18.00);",

    /* Schémas ponctuels du cours sql : hiérarchie, transactions, séries datées. */
    "CREATE TABLE employes (id INTEGER PRIMARY KEY, nom TEXT NOT NULL, service TEXT, salaire REAL, manager_id INTEGER);",
    "INSERT INTO employes VALUES (1,'Ada Lambert','Direction',7200,NULL),(2,'Hugo Marin','Ventes',3400,1),(3,'Ines Lopez','Ventes',3150,2),(4,'Liam Bernard','Technique',3800,1);",
    "CREATE TABLE comptes (id INTEGER PRIMARY KEY, titulaire TEXT NOT NULL, solde REAL NOT NULL);",
    "INSERT INTO comptes VALUES (1,'Camille Roy',1500.00),(2,'Hugo Marin',430.50),(3,'Ines Lopez',2780.00);",
    "CREATE TABLE ventes (id INTEGER PRIMARY KEY, produit_id INTEGER NOT NULL, jour TEXT NOT NULL, quantite INTEGER NOT NULL, montant REAL NOT NULL);",
    "INSERT INTO ventes VALUES (1,500,'2026-01-14',3,14.70),(2,501,'2026-02-02',1,24.00),(3,503,'2026-03-11',2,158.00),",
    " (4,502,'2026-05-30',1,39.00),(5,504,'2026-06-08',4,79.60),(6,500,'2026-06-21',6,29.40);",
  ].join("\n");

  /* Racine du site, déduite de l'URL de CE script (js/runner.js) : les leçons vivent
     à des profondeurs différentes (index.html à la racine, pages/<cours>/lecon-NN.html
     deux crans plus bas), et un Worker construit depuis un Blob n'a de toute façon
     aucune base pour résoudre un chemin relatif. Il lui faut une URL ABSOLUE. */
  var MOI = document.currentScript && document.currentScript.src;
  var RACINE_SITE = MOI ? MOI.replace(/\/js\/runner\.js(\?.*)?$/, "") : "";

  /* Worker isolé : charge sql.js DEPUIS LE DÉPÔT (aucun réseau) puis exécute la requête.
     Mesuré le 2026-08-26 : un Worker issu d'un Blob PEUT importScripts() une URL file://
     absolue, même sans le drapeau --allow-file-access-from-files. C'est ce qui rend SQL
     exécutable en file:// alors que le CDN ne l'a jamais permis. */
  var SQL_WORKER_SRC = [
    "var SQLP = null;",
    "var SEED = " + JSON.stringify(SEED_SQL) + ";",
    "self.onmessage = function (ev) {",
    "  var d = ev.data || {};",
    "  if (d.type === 'load') {",
    "    try {",
    "      importScripts(d.base + '/assets/vendor/sqljs/sql-wasm-base64.js');",
    "      importScripts(d.base + '/assets/vendor/sqljs/sql-wasm.js');",
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
    "        if (!/CREATE\\s+TABLE/i.test(d.code)) { db.exec(SEED); }",
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
  function addOfflineBtn(bar, block, lang) {
    var b = addBtn(bar, "code-block__try code-block__try--offline", ICON_PLAY + "<span>Serveur requis</span>", function () {
      showOffline(block, lang);
    });
    b.setAttribute(
      "title",
      lang + " s'exécute via un moteur WebAssembly chargé depuis un CDN — il lui faut un serveur HTTP. Indisponible en local (file://). Clique pour l'explication."
    );
    return b;
  }

  function showOffline(block, lang) {
    var out = block.querySelector(".runner-output");
    if (!out) {
      out = document.createElement("div");
      out.className = "runner-output";
      out.setAttribute("aria-live", "polite");
      block.appendChild(out);
    }
    out.innerHTML = "";
    var head = document.createElement("p");
    head.className = "runner-output__head";
    head.textContent = lang === "SQL" ? "Résultat SQL" : "Console " + lang;
    out.appendChild(head);
    var l1 = document.createElement("div");
    l1.className = "runner-output__line runner-output__line--warn";
    l1.textContent =
      lang + " s'exécute via un moteur WebAssembly chargé depuis un CDN : il faut une connexion Internet ET que le site soit servi en HTTP. En local (file://), c'est indisponible.";
    out.appendChild(l1);
    var l2 = document.createElement("div");
    l2.className = "runner-output__line runner-output__line--empty";
    l2.textContent =
      "Astuce : ouvre un terminal dans le dossier du site, lance « python -m http.server », puis ouvre http://localhost:8000 dans le navigateur.";
    out.appendChild(l2);
  }

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
    $all(".code-block").forEach(function (block) {
      var bar = block.querySelector(".code-block__bar");
      if (!bar || block.hasAttribute("data-runner")) return;
      var js = block.querySelector("code.language-javascript");
      var markup = block.querySelector("code.language-markup");
      var py = block.querySelector("code.language-python");
      var sql = block.querySelector("code.language-sql");

      if (js) {
        if (BROWSER_ONLY.test(js.textContent)) {
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
        block.setAttribute("data-runner", "py");
        if (!HTTP_OK) {
          addOfflineBtn(bar, block, "Python");
          return;
        }
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
        if (AUTRE_SGBD.test(sql.textContent)) {
          block.setAttribute("data-runner", "skip");
          return;
        }
        /* Plus de garde HTTP_OK ici : depuis le 2026-08-26, SQLite est embarqué dans
           assets/vendor/sqljs/ et s'exécute en file:// (prouvé réseau coupé par
           tools/preuve-hors-reseau.js). Seul Python dépend encore d'un CDN. */
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
      runCode(ed.ta.value, out, runBtn);
    });
    addBtn(bar, "code-block__reset", ICON_RESET + "<span>Init</span>", function () {
      ed.reset();
      ed.ta.focus();
    });
    ed.ta.focus();
    runCode(ed.ta.value, out, runBtn);
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
  function runCode(codeStr, out, runBtn) {
    out.innerHTML = '<p class="runner-output__head">Console</p>';
    var lines = 0,
      finished = false,
      worker = null,
      url = null;
    runBtn.classList.add("is-running");

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

    function end() {
      if (finished) return;
      finished = true;
      clearTimeout(hard);
      clearTimeout(soft);
      try {
        if (worker) worker.terminate();
      } catch (e) {}
      if (url) URL.revokeObjectURL(url);
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
      worker.postMessage(codeStr);
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
    function fatal() {
      out.innerHTML = '<p class="runner-output__head">Console Python</p>';
      line(
        "error",
        "Python n'a pas pu se charger. Cette fonctionnalité a besoin d'une connexion Internet et que le site soit servi en HTTP — elle ne marche pas en file://. Astuce : lance « python -m http.server » dans le dossier du site, puis recharge la page."
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
        fatal();
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
      line("empty", "Chargement de Python… (quelques secondes la première fois)");
      pyWorker.postMessage({ type: "load" });
    } else {
      pyWorker.addEventListener("message", onMsg);
      if (pyLoaded) {
        startRun();
      } else {
        line("empty", "Chargement de Python…");
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
      sqlWorker.postMessage({ type: "load", base: RACINE_SITE });
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
