# assets/ — les ressources statiques du site

Tout ce que le site charge et qui n'est ni du HTML, ni du CSS, ni du JavaScript écrit ici.
**Le site est entièrement hors ligne** : aucune ressource n'est prise sur Internet, tout est
dans ce dossier.

| Élément | Contenu |
|---|---|
| `fonts/` | Les polices en `.woff2` (Inter, JetBrains Mono, Space Grotesk), déclarées par `css/fonts.css`. Voir son `README.md`. |
| `img/` | `logo.svg` et `favicon.svg`. |
| `icons/` | Rien d'autre qu'un `README.md` : les icônes sont en SVG intégré dans les pages. |
| `vendor/prism/` | La coloration syntaxique Prism (cœur + un fichier par langage). |
| `vendor/pyodide/`, `vendor/sqljs/` | Les moteurs Python et SQL de l'éditeur intégré (`js/runner.js`). Ils **fonctionnent en `file://`**, sans serveur ni réseau (le WebAssembly est embarqué en base64, parce qu'un `fetch` vers un `.wasm` local est refusé en `file://`). |
| `manifest.webmanifest` | Le manifeste d'application installable (PWA). Ses chemins sont relatifs à **ce dossier** (`../index.html`, `img/favicon.svg`). Il est injecté dans les pages par `js/main.js` et pré-chargé par `sw.js`. Rangé ici le 2026-09-29. |

Ne jamais remplacer une ressource locale par un lien vers un CDN : c'est une règle absolue du projet.
