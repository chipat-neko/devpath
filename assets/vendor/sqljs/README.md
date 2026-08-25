# sql.js embarqué — SQLite en `file://`

`sql.js` 1.14.2 (licence MIT, voir `LICENSE`), soit **SQLite 3.49.1** compilé en
WebAssembly. Les fichiers viennent de `sql.js@1.14.2`, dossier `dist/`.

| fichier | rôle | poids |
|---|---|---:|
| `sql-wasm.js` | le module Emscripten, tel quel | 45 Ko |
| `sql-wasm-base64.js` | le `.wasm` (643 Ko) encodé en base64 | 858 Ko |
| `sql-charge.js` | l'adaptateur maison : décode et initialise sans requête | 3 Ko |

**Pourquoi le base64.** En `file://`, Chrome traite chaque fichier local comme une
origine opaque : `fetch()` et `XMLHttpRequest` vers `sql-wasm.wasm` sont refusés. Le
binaire ne peut donc pas rester un fichier — il est porté dans un script classique et
passé à `initSqlJs` via l'option `wasmBinary`, ce qui supprime toute requête. Le
surcoût du base64 est de **+33 %**.

**Piège mesuré le 2026-08-26.** `locateFile` est appelé (avec « sql-wasm.wasm ») même
quand `wasmBinary` est fourni : Emscripten calcule le chemin avant de constater qu'il
n'en a pas besoin. Y lever une exception « par sécurité » ne produit aucun message —
Emscripten l'avale et **la promesse ne se résout jamais**. `sql-charge.js` se contente
donc de rendre le nom.

**Preuve.** `node tools/preuve-hors-reseau.js tools/preuves/sqljs.html` ouvre la page
dans Chrome en `file://`, **sans `--allow-file-access-from-files`** et **DNS coupé**,
puis lit le journal réseau. Mesuré : SQLite répond en 411 ms, **0 requête distante**.

**Régénérer** le base64 : `node tools/build-sqljs.js <chemin/sql-wasm.wasm>`.
Sans argument, le script contrôle l'intégrité de ce qui est stocké.
