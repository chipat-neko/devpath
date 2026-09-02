# sql.js embarqué — SQLite en `file://`

`sql.js` 1.14.2 (licence MIT, voir `LICENSE`), soit **SQLite 3.49.1** compilé en
WebAssembly. Les fichiers viennent de `sql.js@1.14.2`, dossier `dist/`.

| fichier | rôle | poids |
|---|---|---:|
| `sql-wasm.js` | le module Emscripten, tel quel | 45 Ko |
| `sql-wasm-base64.js` | le `.wasm` (643 Ko) encodé en base64 | 858 Ko |
| `sql-charge.js` | l'adaptateur maison : décode et initialise sans requête | 3 Ko |
| `sql-wasm-src.js` | le code de `sql-wasm.js` **recopié en chaîne** (généré) | 47 Ko |

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

**⚠️ Pourquoi une COPIE du code en chaîne (`sql-wasm-src.js`), depuis le 2026-09-02.**
Le Worker chargeait `sql-wasm.js` par `importScripts()` sur une URL `file://` absolue.
**Chrome 152 le refuse** : mesuré ce jour-là, 41 blocs SQL cliqués sur de vraies leçons,
41 échecs, et le fichier de 0,8 Ko échouait comme celui de 4,10 Mo — ce n'est pas une
affaire de taille mais la politique `file://`. Ce qui marche encore : une **page** charge
un `<script src>` local, et une chaîne passe intacte au Worker par `postMessage`. Le
Worker n'importe donc plus rien, il **évalue** ce que la page lui transmet. La copie est
contrôlée caractère par caractère à chaque passe de `tools/verif.js` (étape `moteurs`) :
`node tools/build-sources-worker.js`.

**Preuve.** `node tools/preuve-hors-reseau.js tools/preuves/sqljs.html` ouvre la page
dans Chrome en `file://`, **sans `--allow-file-access-from-files`** et **DNS coupé**,
puis lit le journal réseau. ⚠️ Cette page a été **réécrite le 2026-09-02** : elle chargeait
sql.js dans la page, donc elle affichait « ça marche » alors que plus aucun bouton du site
ne fonctionnait. Elle emprunte désormais le chemin exact du produit (page → chaînes →
Worker → `eval`). Mesuré : SQLite prêt en **9 ms dans le Worker**, 294 ms depuis la page,
**0 requête distante**. Et `node tools/preuves/sql-lecon.js`, qui clique sur de vraies
leçons : **41 blocs cliqués, 28 résultats, 0 requête distante**.

**Régénérer** le base64 : `node tools/build-sqljs.js <chemin/sql-wasm.wasm>`.
Sans argument, le script contrôle l'intégrité de ce qui est stocké.
