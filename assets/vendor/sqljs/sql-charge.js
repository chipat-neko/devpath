/* =============================================================================
   sql-charge.js — Charger SQLite (sql.js) SANS AUCUNE REQUÊTE.

   LE PROBLÈME. `sql-wasm.js` est un module Emscripten : par défaut il va chercher
   `sql-wasm.wasm` à côté de lui, avec `fetch()` puis `XMLHttpRequest` en secours.
   En `file://` — le mode fondateur de ce site — les deux échouent : Chrome traite
   chaque fichier local comme une origine opaque et refuse la lecture. C'est
   exactement pour cette raison que `js/runner.js` désactivait le bouton SQL.

   LA SORTIE. Emscripten honore une option `wasmBinary` : si on lui donne le binaire
   déjà en mémoire, il n'émet plus une seule requête. On porte donc le `.wasm` DANS
   un script classique, encodé en base64 (`sql-wasm-base64.js`), on le décode ici,
   et on le passe à `initSqlJs`. Coût du base64 : +33 % (658 Ko -> 858 Ko).

   ORDRE DE CHARGEMENT, dans cet ordre exact :
     <script src="…/sqljs/sql-wasm-base64.js"></script>
     <script src="…/sqljs/sql-wasm.js"></script>
     <script src="…/sqljs/sql-charge.js"></script>

   API : window.SQLLocal.pret() renvoie une promesse sur l'objet SQL de sql.js.
   Le chargement n'a lieu qu'au PREMIER appel — une page qui ne fait pas de SQL ne
   décode jamais les 858 Ko.
   ============================================================================= */
(function () {
  "use strict";

  var promesse = null;

  /* base64 -> Uint8Array. atob() est présent partout où ce site tourne ; on évite
     fetch("data:…") qui, lui, repasserait par la couche réseau. */
  function decoder(b64) {
    var brut = atob(b64);
    var n = brut.length;
    var bytes = new Uint8Array(n);
    for (var i = 0; i < n; i++) bytes[i] = brut.charCodeAt(i);
    return bytes;
  }

  function charger() {
    if (typeof window.initSqlJs !== "function") {
      return Promise.reject(new Error("sql-wasm.js n'est pas chargé (voir l'ordre des <script>)."));
    }
    if (typeof window.SQL_WASM_BASE64 !== "string") {
      return Promise.reject(new Error("sql-wasm-base64.js n'est pas chargé."));
    }
    var binaire;
    try {
      binaire = decoder(window.SQL_WASM_BASE64);
    } catch (e) {
      return Promise.reject(new Error("binaire WebAssembly illisible : " + e.message));
    }
    /* Contrôle du nombre magique « \0asm » : un base64 tronqué donnerait sinon une
       erreur Emscripten incompréhensible. */
    if (!(binaire[0] === 0x00 && binaire[1] === 0x61 && binaire[2] === 0x73 && binaire[3] === 0x6d)) {
      return Promise.reject(new Error("le binaire décodé n'est pas du WebAssembly."));
    }
    /* ⚠️ `locateFile` EST appelé (avec « sql-wasm.wasm ») même quand `wasmBinary`
       est fourni — Emscripten calcule le chemin avant de constater qu'il n'en a pas
       besoin, et n'émet aucune requête ensuite. Mesuré le 2026-08-26 : un premier
       jet y levait une exception « pour détecter une régression », Emscripten
       l'avalait, et la promesse ne se résolvait JAMAIS, sans le moindre message.
       On se contente donc de rendre le nom. La preuve qu'aucun octet ne part sur le
       réseau ne se fait pas ici mais dans `tools/preuve-hors-reseau.js`, qui lit le
       journal réseau de Chrome. */
    return window.initSqlJs({
      wasmBinary: binaire,
      locateFile: function (f) { return f; },
    });
  }

  window.SQLLocal = {
    /* Promesse sur l'objet SQL, mémorisée : le décodage n'a lieu qu'une fois. */
    pret: function () {
      if (!promesse) promesse = charger();
      return promesse;
    },
    /* Vrai si les deux scripts nécessaires sont présents dans la page. */
    disponible: function () {
      return typeof window.initSqlJs === "function" && typeof window.SQL_WASM_BASE64 === "string";
    },
    poidsBase64: function () {
      return typeof window.SQL_WASM_BASE64 === "string" ? window.SQL_WASM_BASE64.length : 0;
    },
  };
})();
