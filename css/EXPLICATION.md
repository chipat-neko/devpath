# css/ — tout le style du site

Aucun style n'est écrit dans le HTML : tout est ici. La direction artistique et ses jetons sont
décrits dans `docs/reference/DESIGN_SYSTEM.md` — à lire avant d'y toucher.

| Fichier | Rôle |
|---|---|
| `variables.css` | Les jetons : couleurs, typographie, espacements, rayons, ombres, et le thème sombre. |
| `fonts.css` | Déclaration des polices locales (`assets/fonts/`). |
| `base.css` | Reset, éléments de base, typographie, utilitaires. |
| `layout.css` | La structure : en-tête, pied de page, conteneurs, grilles. |
| `components.css` | Les composants : boutons, cartes, badges, encadrés, blocs de code, sommaire, navigation… |
| `pages.css` | Le spécifique à chaque type de page : accueil, prose des leçons, page de cours, catalogue, outils. |

Après une modification de CSS : `node tools/verif-rendu.js` mesure ce que le navigateur affiche
(débordement horizontal, contraste, focus au clavier) ; il pilote Chrome.
