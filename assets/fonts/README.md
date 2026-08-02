# assets/fonts

Les trois familles du design system sont désormais **servies en local**, depuis ce dossier.
Le site n'appelle plus aucun serveur de polices : il s'affiche à l'identique en `file://`,
hors ligne, DNS coupé.

- **Space Grotesk** — titres et libellés d'affichage (`--font-display`)
- **Inter** — corps de texte et interface (`--font-sans`)
- **JetBrains Mono** — code et libellés monospace (`--font-mono`)

Les déclarations `@font-face` vivent dans [`../../css/fonts.css`](../../css/fonts.css), chargé
**avant** `variables.css` dans le `<head>` de chaque page (chemin relatif adapté à la
profondeur : `css/`, `../css/` ou `../../css/`). Les polices système de
[`../../css/variables.css`](../../css/variables.css) restent en repli, comme avant.

## Fichiers

| Fichier                          | Famille        | Sous-ensemble | Poids      |
| -------------------------------- | -------------- | ------------- | ---------- |
| `inter-latin.woff2`              | Inter          | latin         | 47,1 Ko    |
| `inter-latin-ext.woff2`          | Inter          | latin-ext     | 83,1 Ko    |
| `jetbrains-mono-latin.woff2`     | JetBrains Mono | latin         | 30,7 Ko    |
| `jetbrains-mono-latin-ext.woff2` | JetBrains Mono | latin-ext     | 11,4 Ko    |
| `space-grotesk-latin.woff2`      | Space Grotesk  | latin         | 21,8 Ko    |
| `space-grotesk-latin-ext.woff2`  | Space Grotesk  | latin-ext     | 18,5 Ko    |
| **Total**                        |                |               | **213 Ko** |

Ce sont les fichiers `woff2` officiels de Google Fonts (Inter v20, JetBrains Mono v24,
Space Grotesk v22), récupérés une fois pour toutes avec un `User-Agent` moderne afin
d'obtenir du `woff2` plutôt que du `ttf`. Ce sont des **polices variables** : un même
fichier couvre toutes les graisses d'une famille — d'où un poids très contenu.

## Ce qui a été volontairement écarté

- **Les sous-ensembles cyrillique, grec et vietnamien.** Le site est en français : il lui
  faut `latin` (accents courants, `œ`, `€`, guillemets typographiques) et `latin-ext`
  (diacritiques supplémentaires), rien de plus. Les garder aurait plus que doublé le poids.
- **La graisse 500 de Space Grotesk.** Elle était demandée au CDN, mais une mesure dans le
  navigateur sur 108 pages représentatives n'a relevé **aucune** occurrence : seules 600 et
  700 servent. Elle n'est donc pas embarquée.
- **Les italiques.** Le CDN n'en fournissait déjà pas ici : l'italique reste synthétisée par
  le navigateur, exactement comme avant.

Les graisses conservées sont celles qui étaient réellement déclarées auparavant :
Inter 400/500/600, JetBrains Mono 400/500/700, Space Grotesk 600/700. L'appariement des
graisses est donc identique au comportement précédent (une demande en 700 sur Inter retombe
sur 600, une demande en 600 sur JetBrains Mono retombe sur 700, comme avec le CDN).

## Ajouter ou modifier une police

1. Récupérer la feuille Google Fonts avec un `User-Agent` de navigateur récent (sinon Google
   renvoie du `ttf`), puis y lire les blocs `@font-face` des sous-ensembles `latin` et
   `latin-ext`.
2. Télécharger les `.woff2` correspondants dans ce dossier.
3. Ajouter les règles `@font-face` dans `css/fonts.css`, avec l'`unicode-range` d'origine et
   `font-display: swap`.

Aucune URL absolue ne doit réapparaître dans le site : tout se charge en chemin relatif.
