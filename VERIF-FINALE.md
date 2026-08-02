VERDICT: VERT

# Passe de sécurité de fin de chantier — Syntaxe

**Date** : 2026-08-02 (tâche planifiée, non-interactive)
**Racine** : `D:\test-claude`
**Réalité mesurée** : **76 cours · 1362 leçons · 73 langages · 11 parcours guidés**
**Corrections appliquées** : 2 (compteurs d'accueil) — voir §i.
**Problèmes bloquants restants** : **0**.

Tous les contrôles a→i sont bons après corrections. Aucune modification lourde ou
douteuse n'a été faite ; les rares points non bloquants sont listés en fin de rapport.
Scripts jetables de cette passe : `scratchpad/vf8-*.js` (+ outils du dépôt
`tools/verif-donnees.js`, `tools/verif-html.js`).

> Écart avec la passe du 2026-08-01 (« aucune correction nécessaire ») : celle-ci
> n'avait vérifié que les compteurs **globaux** (76/1362/73). Cette passe a aussi
> inspecté les **sous-compteurs des cartes de parcours** de l'accueil et en a trouvé
> deux périmés — corrigés (§i).

---

## a) SYNTAXE — `node --check` sur tout le JS ✅
- **81 / 81** fichiers `js/*.js` passent `node --check` sans erreur.
- Les scripts racine (`*.js`) et `tools/*.js` passent aussi (0 échec).

## b) DONNÉES — JSON des blocs `data-*` ✅
- `tools/verif-donnees.js` **I15** : chaque `data-quiz`, `data-exos` et
  `data-quiz-bilan` de toutes les leçons est du JSON parsable → **OK**.
- Rappel global `verif-donnees` : **17 contrôles, 0 ERREUR, 1 avertissement**
  (I17 zig, non bloquant — voir plus bas).

## c) ENCODAGE — BOM & mojibake ✅
- **BOM** : parcours de tous les `.html/.js/.css/.webmanifest/.json/.md` →
  **0 fichier** avec BOM UTF-8.
- **Mojibake** : dans les fichiers **réellement servis**, les seules séquences
  (`Ã©`, `Ã¨`…) sont **volontaires et pédagogiques** :
  - `pages/formats/lecon-06.html` (leçon sur l'encodage : « Café → CafÃ© », « GenÃ¨ve »),
  - `pages/r/lecon-06.html`, `pages/html/lecon-15.html`, `pages/perl/lecon-13.html`
    (tous dans des `<code>` expliquant le charabia d'accents),
  - `js/quiz-index.js` (reprend ces QCM dans l'index de recherche).
  Aucune faute d'encodage introduite. Les `.md` (rapports de chantier, **non servis**)
  contiennent du mojibake résiduel — hors périmètre du site.

## d) LIENS ✅
- `verif-donnees` **I6** : chaque fichier cité dans `js/data.js` existe sous
  `pages/<dir>/`, et `cours.html` idem → **OK**.
- `verif-donnees` **I16** : aucune leçon `lecon-*.html` orpheline (non déclarée &
  non redirection) → **OK**.
- **Liens relatifs** (`scratchpad/vf8-d-liens2.js`, périmètre `index.html` + `pages/`) :
  **26 966** liens locaux vérifiés, **0 vrai lien cassé**. Les 3 « cassés » bruts
  sont des **exemples de code** dans les leçons qui enseignent précisément le sujet
  (`html/lecon-03` = liens `<a href>` ; `vue/lecon-02` = directive `:src`), confirmés
  par grep comme non présents en attribut réel.

## e) INDEX — `js/search-index.js` ✅
- **1362 docs** indexés = **1362** leçons réelles sur disque = **1362** déclarées.
- **0** doc référençant un dossier `-avance` ; **0** doc pointant un fichier absent ;
  **0** doc dont le `file` n'est pas `lecon-NN.html`.
- Chaque cours a **exactement** autant de docs que de leçons (0 mismatch). Le piège
  id≠dir est respecté : le cours `javascript` est indexé sous son **dir** `js`
  (65 docs = 65 leçons).

## f) DURÉES — `durations` de `data.js` ✅
- `verif-donnees` **I2** : bijection `content ⇄ durations`, chaque leçon a une durée > 0.
- Contre-vérification par cours (`scratchpad`) : **0 / 76** cours en écart entre le
  nombre d'entrées `durations` et le nombre de leçons. Piège id≠dir confirmé : la clé
  du cours JS est bien `javascript` (65 entrées = 65 leçons).

## g) NIVEAUX — 4 cours fusionnés & absence de `-avance` ✅
- Modules porteurs d'un `level` réparti en `debutant / intermediaire / expert`,
  **0 module sans level** :
  - `html` : 16 modules (3 / 5 / 8)
  - `css` : 15 modules (3 / 5 / 7)
  - `javascript` : 20 modules (5 / 8 / 7)
  - `python` : 17 modules (3 / 6 / 8)
- **Aucun identifiant `-avance`** dans `data.js`, `catalogue.js`, `cours.js`,
  `projets-data.js`, `flashcards-data.js`, `quiz-index.js`, `logos.js`, ni les
  `fil-rouge-*-data.js` (grep élargi = 0 occurrence).

## h) REDIRECTIONS ✅
- 4 dossiers de compatibilité présents : `js-avance` (24), `html-avance` (23),
  `css-avance` (23), `python-avance` (23) = **93 redirections**.
- **0 cible cassée** : chaque page de redirection pointe vers une leçon
  `../<dir>/lecon-NN.html` qui existe réellement.

## i) COMPTEURS AFFICHÉS ✅ (2 corrections)
- **Totaux corrects** partout : accueil (`index.html`) et catalogue affichent
  **76 cours / 1362 leçons / 73 langages** ; l'i18n **EN** (`js/main.js`) affiche
  « 76 complete courses / 1362 written lessons / 73 languages ». Le catalogue calcule
  aussi un compteur dynamique (`result-count`).
- **Corrigé (sûr)** — deux sous-compteurs de la section « parcours » de l'accueil
  étaient périmés :
  1. carte « Développeur Web Front-end » : **« 8 cours » → « 5 cours »** (le track réel
     = `html, css, javascript, react, typescript` = 5).
  2. bouton bas de section : **« Voir les 8 parcours guidés » → « … 11 … »**
     (`SITE_DATA.tracks` = 11, tous rendus par `parcours.js`).
- Seul `index.html` a été modifié (`git status` = `M index.html`).

## Contrôle bonus — HTML « type navigateur »
- `tools/verif-html.js` : **1451 fichiers analysés, 0 problème grave, 0 remarque**.

---

## Problèmes restants (tous NON bloquants — n'affectent pas le verdict)
1. **I17 zig** (avertissement, non ERREUR) : `zig/lecon-06#2 ↔ lecon-14#1`
   (Jaccard énoncé/réponse 0.33). Déjà tracé comme « deux faces d'une même notion, ou
   vrai doublon ? » — à trancher dans le cadre du **chantier V6 phase E**, hors du
   périmètre de cette passe de contrôle (aucune production ce réveil).
2. **Mojibake dans les `.md` de rapport** (`ENRICHISSEMENT*.md`, `PROGRESSION.md`,
   `NOUVEAUX-COURS.md`, etc.) : fichiers de documentation **non servis** sur le site.
   Sans impact utilisateur ; laissés tels quels.
3. **`js/main.js:322`** : le nombre `1336` apparaît dans un **commentaire historique**
   décrivant un ancien bug d'affichage (« 0 / 1336 leçons »). Ce n'est pas un compteur
   rendu à l'écran ; laissé tel quel pour ne pas dénaturer l'explication.
