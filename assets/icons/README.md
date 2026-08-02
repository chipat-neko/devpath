# assets/icons

Les icônes de l'interface (lune/soleil, loupe, copier, flèches, horloge, coche…) sont
**intégrées en SVG inline** directement dans le HTML.

Pourquoi inline plutôt que des fichiers `.svg` séparés ici :

1. **Fiabilité en `file://`** — un sprite externe via `<use href="icons.svg#…">` est bloqué par
   certains navigateurs quand on ouvre le site en double-clic (politique CORS sur `file://`).
   L'inline fonctionne partout, sans serveur.
2. **Thème clair/sombre** — les icônes inline héritent de `currentColor` et suivent donc
   automatiquement la palette du thème, sans dupliquer un fichier par couleur.

Le logo de marque autonome reste disponible dans [`../img/logo.svg`](../img/logo.svg) et le
favicon dans [`../img/favicon.svg`](../img/favicon.svg).
