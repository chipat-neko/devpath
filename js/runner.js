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
