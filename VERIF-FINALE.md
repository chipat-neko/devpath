VERDICT: VERT

# Passe de sécurité de fin de chantier — site Syntaxe (`d:\test-claude`)

**Date :** 2026-08-01 (après-midi) · **Type :** contrôle non-interactif de fin de chantier (aucun contenu ajouté, aucune question posée).
**Contexte :** chantier détecté comme terminé (plus aucun cours `-avance` actif, leçons enrichies, plan coché) ; travaux **CHANTIER-V6** (dédup QCM) en cours par ailleurs (phases A→D faites, phase E restante — hors périmètre de cette passe).
**Outils dédiés réutilisés :** `tools/verif-donnees.js` (I1→I17), `tools/build-index.js` (mode comparaison).
**Scripts jetables de cette passe :** `scratchpad/vf-passe.js` (contrôles e/g/h), `scratchpad/vf-liens.js` (liens relatifs).

Les **9 contrôles (a → i) sont tous bons**, et **aucune correction n'a été nécessaire** : l'état est déjà cohérent
de bout en bout. Site **fonctionnellement sain** : **76 cours · 1362 leçons réelles · 73 langages**, syntaxe JS
propre, JSON des blocs valides, index non périmés (identiques à une reconstruction fraîche), durées justes,
niveaux répartis, redirections intactes, compteurs affichés exacts (FR + EN), zéro BOM, mojibake uniquement
volontaire (leçons d'encodage).

---

## Détail contrôle par contrôle

### a) SYNTAXE — **OK**
`node --check` sur les **81** fichiers de `js/` : **0 échec**. Tous les scripts sont syntaxiquement valides.

### b) DONNÉES (blocs JSON) — **OK**
`verif-donnees.js` **I15** : chaque bloc `data-quiz`, `data-exos` et `data-quiz-bilan` de toutes les leçons est du
JSON parsable. **0 bloc invalide**. (I13 confirme aussi l'alignement `data-exos` ↔ blocs `.exercise`.)

### c) ENCODAGE — **OK**
- **BOM :** balayage de tous les `*.html/js/css/json/webmanifest` du site → **aucun BOM** (`EF BB BF`).
- **Mojibake :** recherche des signatures de double-encodage (`Ã©`, `Ã¨`, `â€™`, `Â«`, `Å"`, entités `&Atilde;`…).
  **13 occurrences dans 4 leçons** + propagations dans l'index QCM, **toutes volontaires** et pédagogiques :
  - `html/lecon-15` (« L'encodage UTF-8 et les caractères spéciaux »), `html/lecon-21` (« Des octets aux caractères »),
  - `formats/lecon-06` (« L'encodage : UTF-8 partout » — schéma SVG, glossaire, exercice) et `formats/lecon-01`
    (mojibake affiché proprement via l'entité `&Atilde;&copy;`),
  - `r/lecon-06` (« Encodage et séparateurs »), `perl/lecon-13` (note « le fameux `Ã©` »).
  - `js/quiz-index.js` reprend ces textes (index **généré**, fidèle au contenu). **Aucun mojibake accidentel.**

### d) LIENS — **OK**
- **Fichiers déclarés ⇄ disque** (`verif-donnees` I6) : chaque `file` de `data.js` existe sous `pages/<dir>/`, chaque `cours.html` présent. **0 manquant.**
- **Orphelins** (I16) : aucune `lecon-NN.html` présente sur le disque mais non déclarée (hors redirections). **0 orphelin.**
- **Liens relatifs internes** (`vf-liens.js`) : **1594 pages** analysées, **21 852 liens** `href`/`src` réels testés (hors exemples de code) → **0 vrai lien cassé**. Les 5 résidus bruts sont des attributs cités dans des `<code>`/tableaux/SVG d'exemples (`href="../index.html"` montré comme exemple, `<iframe src="…">` dans un schéma), pas des liens de navigation.

### e) INDEX — **OK**
`build-index.js` (mode comparaison) : **`search-index.js` = 1362 leçons**, **identique au fichier cible** (reconstruction fraîche). Confirmation croisée (`vf-passe.js`) : **bijection parfaite** index ⇄ leçons réelles (1362 = 1362), **0 doublon**, **0 entrée pour un dossier `-avance`**. Les index dérivés sont aussi synchronisés : `quiz-index.js` 5259, `flashcards-data.js` 9731, `antiseches-data.js` 1383, `search-lite.js` 1362 — tous **identiques au fichier cible**, **0 avertissement**.

### f) DURÉES — **OK**
`verif-donnees` **I2 + I3** : pour chaque cours, `durations` a une entrée > 0 par leçon et réciproquement ; `course.lessons` = nombre réel de leçons. **0 écart.** Piège `javascript`/`js` (id ≠ dir) correctement géré.

### g) NIVEAUX — **OK**
Les 4 cours fusionnés ont **tous leurs modules porteurs d'un `level`** valide, couvrant débutant/intermédiaire/expert :
- `html` : 16 modules → `{débutant 3, intermédiaire 5, expert 8}`
- `css` : 15 modules → `{débutant 3, intermédiaire 5, expert 7}`
- `javascript` : 20 modules → `{débutant 5, intermédiaire 8, expert 7}`
- `python` : 17 modules → `{débutant 3, intermédiaire 6, expert 8}`

**Aucun identifiant `-avance`** ne subsiste dans `data.js`, `catalogue.js`, `cours.js`, `projets-data.js`, `flashcards-data.js`, `quiz-index.js`, `logos.js` ni les `fil-rouge-*.js` (recherche `[a-z]+-avance` → 0 partout).

### h) REDIRECTIONS — **OK**
Les 4 dossiers `pages/*-avance/` (`js-avance` 24, `html-avance`/`css-avance`/`python-avance` 23 chacun) totalisent **93 pages**, **toutes des redirections `meta refresh` valides** pointant vers une leçon **existante** (ex. `html-avance/lecon-01 → ../html/lecon-26.html`). **0 cible morte.**

### i) COMPTEURS AFFICHÉS — **OK**
`76 cours` / `1362 leçons` / `73 langages` (= valeurs distinctes du champ `language`, JavaScript couvrant 3 cours) —
cohérents sur `index.html` (meta + hero + chip), `pages/catalogue.html`, `pages/a-propos.html`, la palette de
recherche (« parmi 1362 leçons ») et **l'i18n anglais** (`home.meta.*` = 76/1362/73). **0 compteur périmé affiché.**

---

## Avertissements non bloquants (ne changent pas le verdict)

1. **`verif-donnees` I17** — 1 avertissement (seuil « à examiner », **non bloquant**) : `zig` `lecon-06#2 ↔ lecon-14#1` (Jaccard énoncé 0.33 / réponse 0.33). Déjà répertorié comme candidat de la **phase E du CHANTIER-V6** (juger : vrai doublon ou deux faces d'une même notion) — relève d'une décision éditoriale, pas de cette passe de sécurité.
2. **`js/main.js:286`** — la valeur `1336` y figure dans un **commentaire** décrivant un ancien bug (« un écran affichant 0 / 1336 leçons »), pas dans un compteur affiché. C'est une valeur **historique fidèle** au symptôme de l'époque ; la remplacer par 1362 rendrait le commentaire faux. **Laissée telle quelle** (vérifiée, non-problème).

## Corrections appliquées
**Aucune.** Tous les invariants sont déjà respectés ; il n'y avait rien de simple et sûr à corriger.
