# Chantier V8 — remonter le contenu à la médiane du site

Plan de travail de l'autonomie. **Source de vérité : ce fichier.** Chaque réveil lit ce plan,
prend la **première case non cochée**, la traite entièrement, la coche avec un compte rendu chiffré,
puis passe à la suivante. Le chantier est fini quand il ne reste aucune case `- [ ]`.

**Origine** : `tools/verif-contenu.js`, écrit le 2026-08-08, mesure pour la première fois ce qui est
**écrit** dans les 1 362 leçons — les trois autres vérificateurs ne regardent que le code, les données
et l'affichage. Il révèle **56 leçons sous le standard** et **151 leçons maigres** réparties sur
45 cours. Décision de Noah : les traiter toutes.

**Médianes réelles du site**, mesurées et non décrétées :
**3 schémas · 5 encadrés · 8 termes de glossaire · 3 questions · 3 exercices · 1 957 mots.**

---

## ⚠️ LA RÈGLE QUI PRIME SUR TOUTES LES AUTRES

**Une leçon courte mais juste vaut mieux qu'une leçon gonflée.**

Le risque de ce chantier est le **remplissage** : ajouter un encadré pour faire nombre, un schéma qui
répète le paragraphe d'à côté, un terme de glossaire déjà évident. Cela dégraderait le site tout en
faisant monter les chiffres — le pire résultat possible.

Donc, pour chaque ajout, la question est : **est-ce que ça apprend quelque chose de plus ?**
- un **encadré** ne vaut que s'il porte un cas réel, un piège, une nuance ou un raccourci ;
- un **schéma** ne vaut que s'il montre ce que le texte explique mal (un flux, une hiérarchie, un avant/après) ;
- un **exercice** ne vaut que s'il fait *produire* quelque chose, pas seulement reconnaître ;
- un **terme de glossaire** ne vaut que s'il est employé dans la leçon et pas trivial.

**TU AS LE DROIT DE NE PAS ATTEINDRE LA MÉDIANE.** Certaines leçons sont courtes parce que leur sujet
l'est. Dans ce cas : amène ce qui est légitime, puis **écris dans le plan pourquoi tu t'arrêtes là**,
avec la mesure. Une case cochée « remontée à 4 encadrés au lieu de 5, le sujet ne justifie pas
davantage » est un **bon résultat**. Une case cochée avec 5 encadrés dont 2 creux est un échec.

---

## Règles permanentes

- **Un cours à la fois**, mené jusqu'à la mesure. Relance `node tools/verif-contenu.js --cours=<id>` avant et après : le compte rendu doit citer les deux chiffres.
- **Vérifier avant de corriger** : les chiffres de ce plan datent du 2026-08-08. Reproduis la mesure ; si un point est déjà réglé, coche-le en le signalant.
- **Outils** : `node tools/verif.js --rapide` (les 3 vérificateurs statiques en 11 s) doit rester vert. `node tools/verif-rendu.js` dès que tu touches à du CSS.
- **Un commit par cours**, avec la mesure avant/après dans le message.
- **Contrainte fondatrice** : 100 % `file://`, aucun serveur, aucun module ES, aucun build.
- **⚠️ ORDRE DES FEUILLES CSS** : `variables` → `base` → `layout` → `components` → `pages`. Une règle de même spécificité placée dans un fichier antérieur est **écrasée** (piège rencontré deux fois).
- **⚠️ JAMAIS de `&nbsp;` dans un bloc `<script type="application/json">`** : il s'affiche en toutes lettres. Exception : `pages/html/lecon-21.html`, la leçon sur les entités.
- **⚠️ `.tag` et `.module` percutent les jetons Prism** : toute nouvelle classe portant un nom de jeton doit exclure `.token`. Contrôle : `scratchpad/collisions-prism.js`.
- **INTERDIT** : réintroduire une URL vers `cdnjs.cloudflare.com`, `fonts.googleapis.com` ou `fonts.gstatic.com`.
- **Ne jamais toucher** au mojibake volontaire de `pages/formats/lecon-06.html`, `pages/html/lecon-15.html`, `pages/r/lecon-06.html`, `pages/perl/lecon-13.html`.
- Contenu et commentaires **en français, accents corrects**.

---

## PHASE A — Ce qui MANQUE vraiment (56 leçons)

Ces leçons n'atteignent pas le standard écrit : il leur manque un élément, ce n'est pas une question
de densité. C'est le plus rentable, et le plus simple à juger.

- [x] **A1 · Les 36 leçons à un seul exercice.** ✅ 2026-08-08. **Mesure : 36 leçons « exercice (1/2) » → 0** ; global 56 → **21** sous le standard (le reste = A2/A3). **Découverte clé** : ces leçons avaient déjà **3 blocs `.exercise`** (énoncé + solution repliée) mais un seul « actif » — le critère `exos` compte les entrées `data-exos` **non-`null`**, pas les blocs. Donc pas de gonflage : on a **activé un bloc passif** (remplacé un `null`) avec un exercice qui fait produire (écrire une instruction/ligne exacte) ou prédire (valeur/sortie). Quand le bloc passif choisi n'était qu'un rappel/discussion, son énoncé + `<details>` ont été reformulés en consigne déterministe. Répartition : `cobol` 7, `markdown` 6, `javascript` 5, `projets-js` 4, `solidity` 3, puis 11 cours à 1 leçon (`algo` `python` `securite` `tests` `formats` `nosql` `zig` `ada` `objc` `erlang` `groovy`). ⚠️ Chiffres du plan datés : `javascript` 5 (non 6) et `nosql` 1 (non 4) — `nosql` 01/02/14 sont désormais « encadrés du même type », pas « exercice ». **Vérifs** : `type:code` validés (le Worker rejoue `run.expect` depuis la solution de repli) ; alignement `data-exos` ↔ `.exercise` OK partout ; `verif-html` 0, `verif-donnees` 0 err, `search-index.js` régénéré (énoncés reformulés), `verif.js --rapide` vert. **7 commits** (un par cours multi-leçons + un groupé pour les 11 mono-leçons + search-index). **Réserve** : `securite/01` garde « encadre (1/2) » (hors A1, à traiter en A2/A3).

- [ ] **A2 · Les 10 leçons sans aucun cas réel.** Le « Cas réel » est ce qui ancre la notion dans le métier. Ajouter un encadré tiré d'une situation vraie et vérifiable — un incident connu, une contrainte de production, un choix d'architecture documenté. **Pas d'anecdote inventée.** Concernés : `a11y` 12-13, `cloud` 12, `csharp` 23, `css` 30-31, `docker` 13, et 4 autres à relever par la mesure.

- [ ] **A3 · Les 10 leçons aux encadrés tous du même type.** Cinq encadrés « note » à la suite, c'est un texte gris. Varier selon ce que dit le contenu : astuce, attention, note, pour aller plus loin. Ne pas changer le type sans changer le propos. Concernés : `cicd` 01, `sass` 08 et 8 autres.

- [ ] **A4 · Contrôle de la phase A.** `node tools/verif-contenu.js` doit descendre de **56 à 0** leçon sous le standard. Si une leçon résiste pour une bonne raison, l'écrire ici.

---

## PHASE B — Remonter les 151 leçons maigres, cours par cours

Ordre : du cours le plus concerné au moins concerné. **Une case = un cours = un commit.**
Le compte rendu doit citer : nombre de leçons traitées, mesure avant/après, et ce qui a été
délibérément laissé court.

- [ ] **B1 · `ocaml` (12 leçons maigres)**
- [ ] **B2 · `solidity` (12)**
- [ ] **B3 · `perl` (10)**
- [ ] **B4 · `markdown` (10)**
- [ ] **B5 · `nosql` (8)**
- [ ] **B6 · `sass` (8)**
- [ ] **B7 · `prolog` (7)**
- [ ] **B8 · `zig` (6)**
- [ ] **B9 · `securite` (5)**
- [ ] **B10 · `perf-web` (5)**
- [ ] **B11 · `regex` (5)**
- [ ] **B12 · `wasm` (5)**
- [ ] **B13 · `lisp` (4)**
- [ ] **B14 · `lua`, `vscode`, `objc` (3 chacun)**
- [ ] **B15 · `erlang`, `patterns`, `groovy` (3 chacun)**
- [ ] **B16 · `os`, `graphql` (3 chacun)**
- [ ] **B17 · `ux`, `formats`, `pascal`, `tests` (2 chacun)**
- [ ] **B18 · `powershell`, `iac` (2 chacun)**
- [ ] **B19 · Les 18 cours à une seule leçon maigre.** `html`, `observabilite`, `asm`, `api`, `swift`, `kotlin`, `scala`, `fsharp`, `vue`, `cloud`, `llm`, `archi`, `vb`, `cobol`, `docker`, `ml`, `julia`, `csharp`. Un seul commit pour l'ensemble.

---

## PHASE C — Contrôle final

- [ ] **C1 · Mesure globale.** `node tools/verif-contenu.js` : consigner le nombre final de leçons sous le standard et de leçons maigres, et **expliquer chaque cas restant**. L'objectif n'est pas zéro à tout prix : c'est zéro cas **injustifié**.

- [ ] **C2 · Non-régression.** `node tools/verif.js` complet (les 4 vérificateurs, rendu inclus) : tout doit être vert. Vérifier en particulier qu'aucun `&nbsp;` littéral n'a été introduit dans un bloc JSON et que les index dérivés sont à jour (`node tools/build-index.js` sans écart).

- [ ] **C3 · Redondance.** Le chantier ajoute beaucoup de texte à des cours proches les uns des autres : `node tools/verif-contenu.js --redondance` doit rester à **0**. Si un bloc a été recopié d'une leçon à l'autre, le réécrire.

---

## Fin de chantier

Quand toutes les cases sont cochées, le wrapper déclenche la **passe de sécurité** : vérification
globale, rapport dans `VERIF-FINALE.md` avec un verdict en première ligne, puis extinction automatique
de la tâche si le verdict est vert.
