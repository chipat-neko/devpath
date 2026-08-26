/* =============================================================================
   pyodide-charge.js — Démarrer CPython SANS AUCUNE REQUÊTE, en `file://`.

   LE PROBLÈME. Le chargeur de Pyodide va chercher trois ressources avec `fetch()` :
   `pyodide.asm.wasm` (9,6 Mo), `python_stdlib.zip` (2,2 Mo) et `pyodide-lock.json`.
   En `file://` — le mode fondateur de ce site — Chrome traite chaque fichier local
   comme une origine opaque et refuse les trois. C'est pour cette raison que
   `js/runner.js` affichait « Serveur requis » sur tous les blocs Python.

   LA SORTIE. Contrairement à Emscripten, le chargeur de Pyodide n'offre pas
   d'option « donne-moi le binaire, je ne le télécharge pas ». On détourne donc
   `fetch` : les trois ressources sont portées dans des scripts classiques (base64),
   décodées ici, et rendues sous forme de `Response` construite en mémoire. Toute
   URL non reconnue retombe sur le `fetch` d'origine — le détournement ne masque
   rien d'autre, et une requête inattendue reste visible dans le journal réseau.

   POURQUOI UN WEB WORKER. Le chargeur emploie `await import()` — un module ES —
   quand il tourne dans une page, et Chrome refuse un module ES en `file://`. Dans
   un Worker il emploie `importScripts()`, qui accepte une URL `file://` ABSOLUE.
   Mesuré le 2026-08-26 : en page, « Failed to fetch dynamically imported module » ;
   en Worker, l'interpréteur est prêt en 793 ms. Ce fichier est donc fait pour être
   chargé par `importScripts`, jamais par une balise `<script>`.

   ORDRE DE CHARGEMENT, dans cet ordre exact, avec une base ABSOLUE :
     importScripts(base + '/assets/vendor/pyodide/pyodide-wasm-gz-b64.js');
     importScripts(base + '/assets/vendor/pyodide/pyodide-stdlib-b64.js');
     importScripts(base + '/assets/vendor/pyodide/pyodide-lock-b64.js');
     importScripts(base + '/assets/vendor/pyodide/pyodide-charge.js');
     self.PythonLocal.pret(base + '/assets/vendor/pyodide')  ->  promesse

   ⚠ On écrit `self`, jamais `window` : dans un Worker, `window` n'existe pas et
   l'affectation y lève une ReferenceError qu'`importScripts` rapporte comme un
   banal « failed to load ».
   ============================================================================= */
(function () {
  "use strict";

  var promesse = null;

  /* base64 -> Uint8Array. On évite fetch("data:…"), qui repasserait par la couche
     réseau que ce fichier existe précisément pour supprimer. */
  function decoder(b64) {
    var brut = atob(b64);
    var n = brut.length;
    var bytes = new Uint8Array(n);
    for (var i = 0; i < n; i++) bytes[i] = brut.charCodeAt(i);
    return bytes;
  }

  /* Le .wasm est stocké gzippé : 4,10 Mo au lieu de 13,45 Mo en base64 brut.
     DecompressionStream est disponible dans un Worker et en file:// ; coût mesuré
     le 2026-08-26 : 35 ms pour 9,6 Mo. */
  function degzip(bytes) {
    if (typeof DecompressionStream !== "function") {
      return Promise.reject(new Error(
        "ce navigateur n'a pas DecompressionStream : Python ne peut pas être décompressé."));
    }
    var flux = new Blob([bytes]).stream().pipeThrough(new DecompressionStream("gzip"));
    return new Response(flux).arrayBuffer().then(function (a) { return new Uint8Array(a); });
  }

  function commenceParr(bytes, magique) {
    for (var i = 0; i < magique.length; i++) if (bytes[i] !== magique[i]) return false;
    return true;
  }

  function charger(dossier) {
    if (typeof self.PYODIDE_WASM_GZ_B64 !== "string" ||
        typeof self.PYODIDE_STDLIB_B64 !== "string" ||
        typeof self.PYODIDE_LOCK_GZ_B64 !== "string") {
      return Promise.reject(new Error(
        "les scripts base64 de Pyodide ne sont pas chargés (voir l'ordre des importScripts)."));
    }
    return Promise.all([
      degzip(decoder(self.PYODIDE_WASM_GZ_B64)),
      degzip(decoder(self.PYODIDE_LOCK_GZ_B64)),
    ]).then(function (r) {
      var wasm = r[0];
      /* Contrôle du nombre magique « \0asm » : un base64 tronqué donnerait sinon une
         erreur de compilation WebAssembly incompréhensible. */
      if (!commenceParr(wasm, [0x00, 0x61, 0x73, 0x6d])) {
        throw new Error("le binaire décodé n'est pas du WebAssembly.");
      }
      var ressources = {
        "pyodide.asm.wasm": [wasm, "application/wasm"],
        "pyodide-lock.json": [r[1], "application/json"],
        "python_stdlib.zip": [decoder(self.PYODIDE_STDLIB_B64), "application/zip"],
      };

      var fetchOrigine = self.fetch;
      self.fetch = function (url) {
        var s = String(url && url.url ? url.url : url);
        var nom = s.split("/").pop().split("?")[0];
        if (Object.prototype.hasOwnProperty.call(ressources, nom)) {
          var res = ressources[nom];
          return Promise.resolve(new Response(res[0], {
            status: 200, headers: { "Content-Type": res[1] },
          }));
        }
        return fetchOrigine.apply(self, arguments);
      };

      if (typeof self.loadPyodide !== "function") {
        importScripts(dossier + "/pyodide.js");
      }
      if (typeof self.loadPyodide !== "function") {
        throw new Error("pyodide.js n'a pas défini loadPyodide.");
      }
      /* indexURL sert à composer les URL des trois ressources — celles-là mêmes que
         le fetch détourné intercepte. Il doit être absolu : un Worker issu d'un Blob
         n'a aucune base pour résoudre un chemin relatif. */
      return self.loadPyodide({
        indexURL: dossier + "/",
        stdLibURL: dossier + "/python_stdlib.zip",
        lockFileURL: dossier + "/pyodide-lock.json",
      });
    });
  }

  self.PythonLocal = {
    /* Promesse sur l'interpréteur, mémorisée : le décodage n'a lieu qu'une fois.
       `dossier` est l'URL ABSOLUE de assets/vendor/pyodide, sans barre finale. */
    pret: function (dossier) {
      if (!promesse) promesse = charger(dossier);
      return promesse;
    },
    disponible: function () {
      return typeof self.PYODIDE_WASM_GZ_B64 === "string" &&
             typeof self.PYODIDE_STDLIB_B64 === "string";
    },
  };
})();
