VERDICT: VERT

# Passe de sécurité de fin de chantier — 2026-08-12

Site **Syntaxe** (`d:\test-claude`). Contrôle de bout en bout, non interactif, sans ajout de
contenu. Un seul défaut trouvé (débordement mobile d'une leçon), corrigé à la cause et
re-vérifié. Tous les contrôles sont verts après correction.

Chiffres de référence : **76 cours · 1362 leçons · 73 langages**.

---

## 1. Outils du projet (les trois en sortie 0)

| Outil | Résultat |
|---|---|
| `node tools/verif-html.js` | 1451 fichiers analysés, **0 grave / 0 attention**, exit 0 |
| `node tools/verif-donnees.js` | 76 cours, 1362 leçons, 17 invariants, **0 erreur / 1 avertissement**, exit 0 |
| `node tools/verif-rendu.js --tout --lecons` | 139 pages × 834 mesures, **0 erreur / 0 avertissement**, exit 0 *(après correction)* |

- **verif-donnees** : l'unique avertissement est `[I17]` déjà connu — `zig` lecon-06#2 ↔ lecon-14#1
  (énoncé 0.33 / réponse 0.33). Non bloquant, sous le seuil d'erreur (0.50), documenté depuis le
  chantier V6 comme « deux faces d'une même notion, à juger ». Rien à corriger.
- **verif-rendu** : au premier passage, **2 erreurs** de débordement horizontal sur
  `pages/reseaux/lecon-06.html` (+42 px à 320 px, thèmes clair et sombre). Isolé, corrigé,
  re-mesuré → 0 erreur. Détail au §3.

## 2. Contrôles complémentaires (scripts jetables dans `scratchpad/`)

| # | Contrôle | Mesure | Verdict |
|---|---|---|---|
| a | Syntaxe JS | 81 fichiers `js/*.js`, `node --check` | **0 erreur** |
| b | JSON des blocs data-* | 2804 blocs (1362 quiz + 1362 exos + 80 bilan) sur 1362 leçons | **0 invalide** |
| c | Encodage — BOM | 1782 HTML + js/css/json/webmanifest | **0 BOM** |
| c | Encodage — mojibake | 11 fichiers touchés, tous **volontaires** (leçons encodage : `formats/06`, `r/06`, `html/15`, `perl/13`) ou **faux positif** « Âge » (Â = U+00C2 légitime, ex. « Âge invalide ») | **0 accidentel** |
| d | Liens relatifs | 26 982 liens hors-code vérifiés | **0 lien réel cassé** (8 faux positifs = exemples pédagogiques dans des `<text>` SVG / titres) |
| e | Index de recherche | `search-index.js` = **1362 docs = 1362 leçons**, 0 entrée `-avance`, cohérent par cours | **OK** |
| f | Durées | 76 cours, `durations` ⇄ nb de leçons | **0 incohérence** |
| g | Niveaux (cours fusionnés) | html 16 / css 15 / javascript 20 / python 17 modules, tous porteurs d'un `level` ∈ {debutant, intermediaire, expert} | **0 module sans level** |
| g | Plus aucun `-avance` | 0 identifiant de cours actif dans les JS de données | **OK** |
| h | Redirections | 93 pages `pages/*-avance/**` | **93/93 cibles existent** |
| i | Compteurs affichés | 76 / 1362 / 73 sur accueil (FR + EN), catalogue, à-propos | **cohérents** |

Notes :
- (e) Le seul écart apparent (65 docs sous la clé `js`) est le piège id/dossier connu : le cours
  d'`id` **javascript** a pour dossier **js**, et l'index utilise le nom de dossier. 65 docs `js`
  = exactement les 65 leçons de javascript. `[I18]` (build-index --strict) confirme l'index non périmé.
- (g) Les occurrences résiduelles de `-avance` (dans `js/main.js` et `js/projets.js`) sont des
  **tables de redirection / compatibilité** (reprise localStorage des cours fusionnés, mapping des
  anciennes ancres) et une classe CSS `pill--avance`. Aucun cours actif. Conforme à la réserve assumée.
- La ligne « 1336 leçons » de `js/main.js:313` est un **commentaire** décrivant un bug historique,
  pas un compteur affiché — laissée telle quelle.

## 3. Correction appliquée (unique)

**Fichier : `css/pages.css`** — ajout après le bloc `.prose p, .prose ul, .prose ol` :

```css
.prose p,
.prose li,
.prose dd {
  overflow-wrap: break-word;
}
```

- **Symptôme** : `pages/reseaux/lecon-06.html` débordait de +42 px à 320 px (les deux thèmes).
- **Cause isolée** (CDP, bisection par masquage puis descente par scrollWidth) : un `<p>` du bloc
  `.steps` contenant la chaîne insécable **« application/transport/Internet/lien »** (mots séparés
  par `/`, sans point de césure). Ni la table `.cheat-table` ni les `<pre>` n'étaient en cause
  (leur défilement est déjà géré) : masquer table/pre/svg ne changeait rien ; masquer `.steps` → 0.
- **Choix de la correction** : le site utilise déjà `overflow-wrap: break-word` pour le même motif
  sur `.course-hero__title` (commentaire pages.css:499). On applique la même règle aux conteneurs de
  texte courant de la prose. `overflow-wrap: break-word` **ne coupe un mot que s'il déborderait
  sinon** → aucun effet sur les textes normaux, aucun risque de régression.
- **Portée** : un scan des 1362 leçons révèle **39 leçons** au motif identique (chaînes de 26–40
  car. type « teinte/saturation/luminosité », « insertions/suppressions/substitutions »). verif-rendu
  ne teste qu'une leçon par cours ; la correction CSS les protège **toutes**, pas seulement l'échantillon.
- **Vérification** : re-mesure ciblée = 0 erreur ; re-passage **complet** `--tout --lecons` = 139
  pages, 834 mesures, **0 erreur / 0 avertissement**. Aucune régression.

## 4. Problèmes restants

Aucun problème bloquant.

- **1 avertissement non bloquant** (verif-donnees `[I17]`) : doublon de QCM faible (R = 0.33) entre
  `zig` lecon-06#2 et lecon-14#1. Sous le seuil d'erreur, déjà tracé (chantier V6, phase E). À juger
  hors passe de sécurité — pas une régression.
- Faux positifs documentés (n'exigent aucune action) : mojibake « Âge » (caractère correct),
  8 « liens » d'exemples pédagogiques dans des diagrammes SVG, clé `js` du cours javascript.

---

*Contrôle mené sans ajout de contenu. Seule modification : `css/pages.css` (une règle CSS).
Scripts de vérification jetables conservés dans `scratchpad/`.*
