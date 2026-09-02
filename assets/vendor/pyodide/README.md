# Pyodide embarqué — CPython en `file://`

Pyodide 0.26.4 (licence MPL-2.0, voir `LICENSE`), soit **CPython 3.12.1** compilé en
WebAssembly. Les fichiers viennent de la distribution `full` de Pyodide 0.26.4.

| fichier | rôle | poids |
|---|---|---:|
| `pyodide.js` | le chargeur, tel quel (URL de CDN neutralisée) | 14 Ko |
| `pyodide.asm.js` | le code de liaison Emscripten, tel quel | 1,17 Mo |
| `pyodide-wasm-gz-b64.js` | l'interpréteur (9,62 Mo) **gzippé** puis encodé en base64 | 4,10 Mo |
| `pyodide-stdlib-b64.js` | la bibliothèque standard (`python_stdlib.zip`, 2,23 Mo) en base64 | 2,98 Mo |
| `pyodide-lock-b64.js` | l'index des paquets, **volontairement vide** | 0,8 Ko |
| `pyodide-charge.js` | l'adaptateur maison : décode, détourne `fetch`, démarre | 6 Ko |
| `pyodide-src.js` | les trois fichiers de code ci-dessus **recopiés en chaînes** (généré) | 1,23 Mo |

**Total : 9,50 Mo** (8,27 Mo + 1,23 Mo de copie en chaîne depuis le 2026-09-02).

**Pourquoi le base64.** En `file://`, Chrome traite chaque fichier local comme une
origine opaque : `fetch()` vers `pyodide.asm.wasm` ou `python_stdlib.zip` est refusé.
Les binaires sont donc portés dans des scripts classiques. Contrairement à Emscripten,
le chargeur de Pyodide n'offre pas d'option « voici le binaire, ne le télécharge pas » :
`pyodide-charge.js` détourne `fetch` et rend une `Response` construite en mémoire.

**Pourquoi le gzip sur le seul `.wasm`.** En base64 brut il pèserait 13,45 Mo ; gzippé
puis encodé, 4,10 Mo — **8,7 Mo économisés** pour 35 ms de `DecompressionStream`.
`python_stdlib.zip` n'est pas gzippé : c'est déjà un zip, gzip ne lui gagne que 1 %.

**Pourquoi il faut un Web Worker.** Le chargeur emploie `await import()` — un module ES,
que Chrome refuse en `file://` — quand il tourne dans une PAGE, et `importScripts()`
quand il tourne dans un WORKER. Mesuré le 2026-08-26 : en page, « Failed to fetch
dynamically imported module » ; en Worker, l'interpréteur est prêt en 799 ms. Le Worker
n'est donc pas seulement un isolement, c'est ce qui rend Python possible.

**⚠️ …mais le Worker ne charge plus rien lui-même, depuis le 2026-09-02.** `importScripts()`
sur une URL `file://` est refusé par **Chrome 152** depuis un Worker issu d'un `Blob` :
mesuré ce jour-là, 43 blocs Python cliqués sur de vraies leçons, **43 échecs du moteur**,
et le fichier de 0,8 Ko échouait comme celui de 4,10 Mo. Ce qui marche encore : une **page**
charge un `<script src>` local, et une chaîne passe intacte par `postMessage`. Les données
étaient déjà des chaînes ; le CODE (`pyodide.asm.js`, `pyodide.js`, `pyodide-charge.js`) a
dû le devenir — c'est `pyodide-src.js`, généré et **contrôlé caractère par caractère** à
chaque passe de `tools/verif.js` (étape `moteurs`) par `tools/build-sources-worker.js`.
Le Worker **évalue** ces chaînes en portée globale, ce qui a exactement l'effet qu'avait
`importScripts`. Coût : **+1,23 Mo** (le code existe deux fois — une fois lisible et
comparable à l'amont, une fois transportable).

**L'index des paquets est vide, et c'est un garde-fou.** Le vrai `pyodide-lock.json`
déclare 310 paquets (numpy, pandas, scikit-learn…), tous téléchargeables depuis un CDN.
Aucun n'est embarqué. Avec `packages: {}`, `loadPackage` ne peut littéralement rien
demander. **Seule la bibliothèque standard est disponible** — 185 modules, liste mesurée
en exécutant `sys.builtin_module_names` + `pkgutil.iter_modules()` dans le moteur, et
recopiée dans `js/runner.js` (`PY_MODULES`). ⚠️ `sqlite3` n'en fait pas partie : il
n'est pas compilé dans ce build.

**Preuve.** `node tools/preuve-hors-reseau.js tools/preuves/pyodide.html` ouvre la page
dans Chrome en `file://`, **sans `--allow-file-access-from-files`** et **DNS coupé**,
puis lit le journal réseau. Mesuré : interpréteur prêt en 799 ms, **0 requête distante**.
`node tools/preuves/python-lecon.js` fait la même chose en cliquant sur les boutons de
vraies leçons. Mesuré le **2026-09-02**, après le passage aux chaînes : **43 blocs cliqués,
42 sorties, 0 échec du moteur, 0 requête distante**, premier bloc en 1 592 ms.

**Régénérer** : `node tools/build-pyodide.js <dossier-pyodide>`.
Sans argument, le script contrôle l'intégrité de ce qui est stocké.
