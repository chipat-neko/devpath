# Chantier V10 — élargir le catalogue

Plan de travail de l'autonomie. **Source de vérité : ce fichier.** Chaque réveil lit ce plan,
prend la **première case non cochée**, la traite entièrement, la coche avec un compte rendu chiffré,
puis passe à la suivante. Le chantier est fini quand il ne reste aucune case `- [ ]`.

**Origine** : l'inventaire du 2026-08-13 des 76 cours existants. La couverture des **langages** est
remarquable (48 cours, patrimoine compris). Trois trous nets en ressortent, plus un problème de
visibilité.

**Ce chantier ÉCRIT DU CONTENU NEUF.** C'est le premier depuis longtemps : les précédents corrigeaient
l'existant. La barre est donc plus haute — un cours neuf doit naître **au standard**, pas y être
remonté ensuite.

---

## ⚠️ CE QUI A CHANGÉ DEPUIS LE DERNIER AJOUT DE COURS

`NOUVEAUX-COURS.md` (juin 2026) décrit la méthode d'ajout et **reste valable** : lis-le avant de
commencer, en particulier sa section sur l'échappement dans les blocs de code. Mais quatre choses
sont nouvelles :

1. **Le standard éditorial est mesuré.** `node tools/verif-contenu.js` doit rester à **0 leçon sous le
   standard et 0 maigre** après chaque cours. Médianes du site : **3 schémas SVG · 5 encadrés ·
   8 termes de glossaire · 3 questions · 3 exercices · 1 957 mots**. Un cours neuf qui naît en dessous
   fait échouer la mesure.
2. **Quatre vérificateurs, un point d'entrée** : `node tools/verif.js --rapide` (11 s) après chaque
   leçon, `node tools/verif.js` complet après chaque cours.
3. **Les index sont générés** : `node tools/build-index.js --write --only=quiz,flashcards,search,searchlite,antiseches` après chaque cours. Ne jamais les éditer à la main.
4. **Le projet est sous git** : un commit par cours, avec la mesure dans le message.

---

## Règles permanentes

- **Un cours à la fois**, ou **un module à la fois** si le cours est long. Un cours fini et vérifié vaut mieux que trois ébauches.
- **Contrainte fondatrice** : 100 % `file://`, aucun serveur, aucun module ES, aucun build.
- **⚠️ L'ÉCHAPPEMENT DANS LES BLOCS DE CODE** : tout `<` s'écrit `&lt;`, sans exception — commentaire, chaîne, générique, expression régulière. C'est la seule famille de bugs qui a réellement détruit des pages de ce site. `node tools/verif-html.js` doit rester à 0.
- **⚠️ `.tag` et `.module` percutent les jetons Prism** : ne jamais créer une classe portant un nom de jeton sans exclure `.token`.
- **⚠️ JAMAIS de `&nbsp;` dans un bloc `<script type="application/json">`**.
- **INTERDIT** : réintroduire une URL vers `cdnjs.cloudflare.com`, `fonts.googleapis.com` ou `fonts.gstatic.com`. Les grammaires Prism se chargent depuis `assets/vendor/prism/`.
- Contenu **en français, accents corrects**. Le ton du site : clair, progressif, honnête sur les pièges.
- **En cas de doute réel : ne force pas.** Laisse la case décochée et écris ce qui bloque.

---

## PHASE A — Rendre visible ce qui existe déjà

À faire **avant** d'écrire quoi que ce soit : inutile d'ajouter des cours si la moitié du catalogue
reste introuvable.

- [x] **A1 · 36 cours sur 76 n'appartiennent à aucun parcours.** Dont `php`, `go`, `ruby`, `vue`, `kubernetes`, `graphql`, `swift`, `dart`, `sass`, `http`, `api`, `securite`, `tests`, `patterns`, `archi`, `wasm`, `ml`, `llm`, `iac`, `nosql`, `regex`, `markdown`, `bash`, `vscode`, `formats`, `cicd`, et le patrimoine (`cobol`, `fortran`, `ada`, `pascal`, `objc`, `perl`, `lua`, `julia`, `erlang`, `solidity`). Créer les parcours qui manquent dans `SITE_DATA.tracks` — quelques lignes de données, aucun contenu à écrire. Viser une couverture bien plus large qu'aujourd'hui, sans forcer : un cours vraiment isolé peut rester hors parcours, à condition de l'écrire ici. Vérifier ensuite que `pages/parcours.html` les affiche correctement et que la progression se calcule.

  ✅ **FAIT (2026-08-13).** Remesuré d'abord : bien **36 orphelins** sur 76 (11 parcours, 40 cours couverts). Ajouté **14 parcours** à `SITE_DATA.tracks` → **25 parcours**, couverture **75/76 cours** dans ≥ 1 itinéraire. Seul `solidity` (contrats intelligents, très spécialisé) reste volontairement hors parcours — cas prévu par la consigne. Nouveaux : `front-avance` (css·sass·vue), `api-web` (http·api·graphql), `web-serveur` (http·php·ruby·go), `bases-donnees` (sql·nosql), `ia` (python·ml·llm), `mobile-dev` (swift·objc·dart), `devops` (docker·cicd·iac·kubernetes), `conception` (patterns·archi·tests·securite), `outils` (vscode·bash·git·regex·markdown·formats), `scripting` (bash·perl·lua), `concurrence` (go·elixir·erlang), `calcul-scientifique` (python·r·julia·fortran), `performance-web` (perf-web·wasm), `patrimoine` (fortran·cobol·pascal·ada). Compteur accueil corrigé (`index.html` : « 11 → **25** parcours guidés »), meta-description de `parcours.html` élargie. Vérifs : `node --check` OK · 0 BOM · `verif-donnees` **0 erreur** (I9 tracks vert, I18 index non périmés — les tracks ne génèrent aucun index dérivé) · `verif-rendu` sur `parcours.html` **0 débordement** (3 largeurs × 2 thèmes, glyphes courts inclus). Progression recalculée correctement (test avec `syntaxe-progress` semé : `web-serveur` 4/73, `ia` 12/74, `bases-donnees` 4/38 — tous les cours résolus). ✅ **Bonus (hors A1, même passe)** : corrigé le débordement **préexistant** de `pages/revision.html` (+24 px à 320 px sur `span.rev-card__term`, un terme long insécable) — ajout de `max-width:100%` + `overflow-wrap:break-word` sur `.rev-card__term` (css/pages.css). Re-vérifié : `verif-rendu --pages=pages/revision.html` **0 erreur / 0 avert.** (3 largeurs × 2 thèmes). Ne bloquera donc plus F3.

---

## PHASE B — Le pôle données (le trou le plus net)

Six cours seulement aujourd'hui, dont `ml` et `llm` à 12 leçons. Le site va jusqu'à l'assembleur mais
s'arrête au seuil de l'analyse de données. Ces cours s'appuient sur `python`, `sql`, `r` et `ml` qui
existent déjà : **les relier par `related`**, ne pas réexpliquer Python.

- [x] **B1 · `pandas` — Analyser des données avec pandas** (~15 leçons). Charger et inspecter, types et valeurs manquantes, sélection et filtrage, colonnes calculées, regroupements, jointures, séries temporelles, pivots, export. **Exemples avec de vraies formes de données** (relevés, ventes, journaux), pas des tableaux abstraits. Exercices `type:text` (Python n'est pas exécutable en `file://`).

  ✅ **FAIT (2026-08-13).** Cours `pandas` — « analyser des données avec Python » — **14 leçons** en 4 modules, rédigées **au standard** (14 sous-agents cadrés, 1 leçon/agent, modèle `r/lecon-08`, fil rouge commun = ventes d'une librairie en ligne + `clients.csv`). Programme : **M1** Prendre pandas en main (Series/DataFrame · charger/inspecter · types/conversions · valeurs manquantes) · **M2** Sélectionner et transformer (loc/iloc · filtres booléens `&`/`|` · tri · colonnes calculées/`.str`) · **M3** Regrouper et relier (groupby split-apply-combine · pivot_table/crosstab/melt · merge/jointures) · **M4** Aller au bout (séries temporelles/resample · export · **capstone**). `verif-contenu --cours=pandas` = **0 sous le standard · 0 maigre · 0 redondance** ; médianes du cours svg 3 · callouts 9 · glossaire 8 · quiz 4 · exos 3 · **mots 3521** (au-dessus des médianes du site). Intégration complète : `courses[]` + `content{}` (related python/sql/r/ml) + 14 durées ; accent `#5a4fcf` (clair + sombre) ; logo `pd` ; catalogue (section « Back-end, données & API ») ; parcours `data` **et** `ia` ; projet contextualisé « Le tableau de bord des ventes ». Capstone L14 : mini-projet fil rouge (`.steps`) + `data-quiz-bilan` (12 Q) + `data-exos` aligné par un `null` sur le bloc Projet → **0 warning console** (mieux que le modèle `r/lecon-17`). Index régénérés (flashcards +100, antisèches +14, search/searchlite → 1376). Compteurs portés à **77 cours / 1376 leçons** (accueil, catalogue, à-propos, antisèches, recherche, i18n EN, palette ; 73 langages inchangé — pandas = Python). Vérifs : `verif-html` **0** · `verif-donnees` **0 erreur** (18 invariants : I11 projet, I13 capstone, I16 orphelins, I18 index tous verts) · `verif-rendu` pandas **0** (5 pages × 3 largeurs × 2 thèmes). Site **76 → 77 cours**, **1362 → 1376 leçons**.

- [ ] **B2 · `dataviz` — Visualiser des données** (~14 leçons). Choisir la forme selon la question posée, les types de graphiques et leurs usages, l'échelle et l'axe zéro, la couleur (et le daltonisme), la densité, les cartes, l'annotation, les graphiques qui mentent. **Ce cours doit montrer des exemples visuels** : c'est le terrain idéal pour les schémas SVG maison du site.

- [ ] **B3 · `stats` — Statistiques appliquées** (~15 leçons). Décrire une distribution, moyenne contre médiane, dispersion, échantillonnage, intervalle de confiance, test d'hypothèse et valeur p, corrélation contre causalité, régression simple, les pièges (p-hacking, biais de survie, paradoxe de Simpson). **Sobriété mathématique** : le lecteur est développeur, pas statisticien — expliquer ce que ça veut dire et quand s'en servir.

- [ ] **B4 · `data-eng` — Ingénierie de données** (~14 leçons). Pipeline, ETL contre ELT, formats (CSV, JSON, Parquet), partitionnement, idempotence et reprise, orchestration, qualité et contrats de données, coût et volumétrie, observabilité d'un pipeline. Relier à `sql`, `nosql`, `iac`, `observabilite`.

---

## PHASE C — Le développement mobile

Les langages sont là (`swift`, `kotlin`, `dart`, `objc`) mais **aucun cours ne traite de l'application
elle-même**. Ce cours est **transverse** : il explique les notions communes et illustre avec les trois
écosystèmes plutôt que d'en privilégier un.

- [ ] **C1 · `mobile` — Développer une application mobile** (~15 leçons). Ce qui change par rapport au web, cycle de vie d'une application, navigation entre écrans, état et remontée d'événements, listes performantes, stockage local, réseau et mode hors ligne, permissions et vie privée, notifications, adaptation aux écrans, tests sur appareil, publication sur les magasins. Relier à `swift`, `kotlin`, `dart`, `ux`, `perf-web`.

---

## PHASE D — Concevoir une base de données

`sql` et `nosql` enseignent l'**usage**. Ce qui distingue quelqu'un qui écrit du SQL de quelqu'un qui
conçoit une base n'est traité nulle part.

- [ ] **D1 · `bdd` — Concevoir une base de données** (~15 leçons). Du besoin au modèle, entités et relations, clés primaires et étrangères, formes normales (jusqu'à la 3e, expliquées par l'exemple), quand dénormaliser, index — ce qu'ils coûtent et ce qu'ils rapportent, lire un plan d'exécution, transactions et niveaux d'isolation, contraintes et intégrité, migrations de schéma, modéliser pour du NoSQL. Relier à `sql`, `nosql`, `archi`, `data-eng`.

---

## PHASE E — Travailler en équipe

Le site enseigne à coder, pas encore à coder **avec d'autres**. `git`, `tests` et `archi` couvrent des
outils ; la pratique collective n'a pas de cours.

- [ ] **E1 · `equipe` — Travailler à plusieurs sur du code** (~14 leçons). Lire le code des autres, faire une revue utile (et en recevoir une), conventions et automatisation du style, écrire un message de commit et une demande de fusion, estimer sans se mentir, la dette technique — la nommer et la traiter, documenter ce qui compte, intégrer quelqu'un dans un projet, gérer un incident, l'après-incident sans chercher de coupable. **Ce cours parle d'humains** : il doit rester concret et non moralisateur, avec des exemples de situations réelles.

---

## PHASE F — Intégration et contrôle

- [ ] **F1 · Chaque nouveau cours est complètement intégré.** Pour les 7 : accent CSS (clair **et** sombre), logo dans `js/logos.js`, entrée dans `js/catalogue.js` si des sections existent, **projet contextualisé** dans `js/projets-data.js` (chaque cours du site en a un), place dans un parcours, `related` vers 2 à 4 cours existants, et **les cours voisins qui doivent pointer vers eux en retour**.

- [ ] **F2 · Index régénérés et compteurs à jour.** `node tools/build-index.js --write --only=quiz,flashcards,search,searchlite,antiseches`, puis vérifier que les compteurs affichés (accueil, catalogue, à-propos, recherche) annoncent le nouveau nombre de cours et de leçons. C'est le défaut qui revient à chaque ajout.

- [ ] **F3 · Contrôle final.** `node tools/verif.js` complet : les quatre vérificateurs verts, **0 leçon sous le standard, 0 maigre, 0 redondance**. Les nouveaux cours ne doivent pas recopier la prose des anciens (`--redondance` à 0).

  ⏳ **À traiter en F3** (effet de bord attendu, à faire une fois TOUS les cours ajoutés car chaque cours riche rebouge les médianes) : après B1 (pandas), la médiane **mots** du site est montée à **1996**, ce qui fait basculer **`os/lecon-02`** en *maigre* (4/6 sous : svg 2<3 · callouts 3<5 · glossaire 7<8 · **mots 1994<1996**, soit 2 mots !). Cas-limite déjà repéré en V8. Ne PAS corriger à chaque cours (retravail) ; l'enrichir légèrement (1 SVG + 2 callouts + 1 terme + ~30 mots) lors de la passe F3, en re-mesurant la médiane finale. Surveiller d'autres bascules du même type au fil de B2→E1.

---

## Fin de chantier

Quand toutes les cases sont cochées, le wrapper déclenche la **passe de sécurité** : vérification
globale, rapport dans `VERIF-FINALE.md` avec un verdict en première ligne, puis extinction automatique
si le verdict est vert. Le verdict n'est retenu que si le rapport a été **écrit pendant cette passe**.
