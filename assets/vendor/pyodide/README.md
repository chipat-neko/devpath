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

**Total : 8,27 Mo**, soit **+10,6 %** sur un dépôt de 77,9 Mo.

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
vraies leçons : 44 blocs cliqués, 40 sorties, 0 échec du moteur, 0 requête distante.

**Régénérer** : `node tools/build-pyodide.js <dossier-pyodide>`.
Sans argument, le script contrôle l'intégrité de ce qui est stocké.
