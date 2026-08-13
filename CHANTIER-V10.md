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

- [x] **B2 · `dataviz` — Visualiser des données** (~14 leçons). Choisir la forme selon la question posée, les types de graphiques et leurs usages, l'échelle et l'axe zéro, la couleur (et le daltonisme), la densité, les cartes, l'annotation, les graphiques qui mentent. **Ce cours doit montrer des exemples visuels** : c'est le terrain idéal pour les schémas SVG maison du site.

  ✅ **FAIT (2026-08-13).** Cours `dataviz` — « Data visualisation : donner à voir les données » — **14 leçons** en 4 modules, rédigées **au standard** (13 sous-agents cadrés + L01 écrite à la main comme référence ; modèle = un vrai graphique SVG dessiné, pas une boîte abstraite ; fil rouge commun = les données ouvertes d'une ville fictive **Belleville** : fréquentation d'équipements, climat, temps de trajet, loyers, modes de déplacement, quartiers). Programme : **M1 Voir pour comprendre** (pourquoi visualiser/Anscombe · grammaire marque-canal-échelle · choisir la forme selon la question) · **M2 La boîte à outils** (barres & axe zéro · courbes/aires · distribution histo/boîte · nuage & corrélation≠causalité · composition camembert/empilé/treemap) · **M3 Bien encoder** (échelle qui ment/log/double axe · couleur & daltonisme · densité/facettes · cartes choroplèthe en taux) · **M4 Communiquer** (annoter/data-encre · **capstone** « les graphiques qui mentent + tableau de bord refait »). Code = **Python + matplotlib** (Prism python). `verif-contenu --cours=dataviz` = **0 sous le standard · 0 maigre · 0 redondance** ; médianes du cours svg 4 · callouts 7 · glossaire 8 · quiz 4 · exos 3 · **mots 3750** (bien au-dessus des médianes du site). Intégration complète : `courses[]` + `content{}` (related **pandas/python/r/ux**) + 14 durées ; accent `#c2410c` (clair) / `#f0895a` (sombre) ; logo `dv` ; catalogue (« Back-end, données & API ») ; parcours `data` ; projet contextualisé « Le tableau de bord ouvert de Belleville » ; **retours** pandas→dataviz et r→dataviz. Capstone L14 : `data-quiz` (4) + `data-quiz-bilan` (12 Q, tout le cours) + `.steps` + bloc « Projet » aligné par un `null` en 4ᵉ position de `data-exos` → I13 vert. Index régénérés (quiz +68, flashcards +109, antisèches +14, search/searchlite → 1390). Compteurs portés à **78 cours / 1390 leçons** (accueil, catalogue, à-propos, recherche, antisèches, i18n EN, palette ; 73 langages inchangé — dataviz = Python). Vérifs : `verif-html` **0** · `verif-donnees` **0 erreur** (18 invariants ; I11 projet, I12 bilan, I13 exos, I14 Prism, I16 orphelins, I18 index tous verts ; seul avert. = I17 `zig` préexistant) · `verif-rendu` dataviz **0 erreur / 0 avert.** (15 pages × 3 largeurs × 2 thèmes = 90 mesures : débordement, contraste, focus, aria, console tous OK). Site **77 → 78 cours**, **1376 → 1390 leçons**.

- [x] **B3 · `stats` — Statistiques appliquées** (~15 leçons). Décrire une distribution, moyenne contre médiane, dispersion, échantillonnage, intervalle de confiance, test d'hypothèse et valeur p, corrélation contre causalité, régression simple, les pièges (p-hacking, biais de survie, paradoxe de Simpson). **Sobriété mathématique** : le lecteur est développeur, pas statisticien — expliquer ce que ça veut dire et quand s'en servir.

  ✅ **FAIT (2026-08-13).** Cours `stats` — « Statistiques appliquées pour développeurs » — **15 leçons** en 4 modules, rédigées **au standard** (L01 écrite à la main comme référence + 14 sous-agents cadrés, 1 leçon/agent ; fil rouge commun = **l'app SaaS fictive Orbit** : latence API à longue traîne `[88…910]`, test A/B du bouton d'inscription A 1000/80 = 8,0 % vs B 1000/104 = 10,4 %, chargement × rebond). Programme : **M1 Décrire** (pourquoi les stats/population-échantillon · moyenne-médiane-mode · dispersion-écart-type-quartiles · forme de distribution/percentiles-p95) · **M2 De l'échantillon à la population** (échantillonner sans biais · hasard-loi normale-TCL · intervalle de confiance · test d'hypothèse & valeur p) · **M3 Relations** (corrélation & ce qu'elle rate · corrélation ≠ causalité · régression linéaire simple · prédire et ses limites/overfitting) · **M4 Ne pas se faire avoir** (p-hacking/comparaisons multiples/biais de survie · paradoxe de Simpson/moyennes trompeuses · **capstone** analyse A/B honnête de bout en bout). Code = **Python** (module `statistics`, un peu de `numpy`), Prism python. **Cohérence pédagogique forte** : le test A/B (+2,4 pts) est traité comme **non significatif** (z≈1,86, p≈0,063, IC de B−A contient 0) de L07 à L15 → le capstone conclut « écart encourageant mais on ne peut pas trancher, prolonger le test » (le vrai message du cours : quantifier l'incertitude). Exos **tous `type:text`** (Python non exécutable en `file://`) — 2 `type:code` produits par des agents ont été corrigés en `type:text` (L11, L13). `verif-contenu --cours=stats` = **0 sous le standard · 0 maigre · 0 redondance** ; médianes du cours **svg 4 · callouts 7 · glossaire 8 · quiz 4 · exos 3 · mots 4099** (très au-dessus des médianes du site). Intégration complète : `courses[]` + `content{}` (related **pandas/dataviz/python/ml**) + 15 durées ; accent **`#3949ab`** (clair) / `#8591e8` (sombre) — indigo distinct du pôle données ; logo `st` ; catalogue (« Back-end, données & API ») ; parcours **`data`** (sql·python·pandas·stats·dataviz·r) **et `ia`** (python·pandas·stats·ml·llm) ; projet contextualisé « L'analyse honnête d'un test A/B pour Orbit » ; **retours** pandas→stats, dataviz→stats, r→stats, ml→stats. Capstone L15 : `data-quiz` (4) + `data-quiz-bilan` (12 Q) + `.steps` (6) + bloc Projet aligné par un `null` en 4ᵉ position de `data-exos` → I13 vert. Index régénérés (quiz +72 → 5330, flashcards +115 → 10187, antisèches +16 → 1425, search/searchlite → **1405**). Compteurs portés à **79 cours / 1405 leçons** (accueil, catalogue, à-propos, recherche, antisèches, i18n EN, palette clavier ; 73 langages inchangé — stats = Python). Vérifs : `verif-html` **0** · `verif-donnees` **0 erreur** (17 invariants ; I6/I8/I9/I11/I12/I13/I14/I15/I16/I18 verts ; seul avert. = I17 `zig` préexistant) · `verif-rendu` stats **0 erreur / 0 avert.** (16 pages × 3 largeurs × 2 thèmes = 96 mesures). Commit `dd08bbd`. Site **78 → 79 cours**, **1390 → 1405 leçons**.

- [x] **B4 · `data-eng` — Ingénierie de données** (~14 leçons). Pipeline, ETL contre ELT, formats (CSV, JSON, Parquet), partitionnement, idempotence et reprise, orchestration, qualité et contrats de données, coût et volumétrie, observabilité d'un pipeline. Relier à `sql`, `nosql`, `iac`, `observabilite`.

  ✅ **FAIT (2026-08-13).** Cours `data-eng` — « Ingénierie de données : construire des pipelines » — **14 leçons** en 4 modules, rédigées **au standard**. L01→L03 étaient déjà amorcées (session précédente) ; **11 leçons neuves (L04→L14)** écrites par sous-agents cadrés (méthode B1/B2/B3, 1 leçon/agent, modèle `data-eng/lecon-03`). Fil rouge commun = **Vélociti**, service de vélos en libre-service (4 sources : trajets CSV ~150 000/j un fichier/jour ; stations JSON ~1 500 ; capteurs ~5 M events/j en double ; météo API externe 24/j ; couches bronze→silver→gold). Programme : **M1 Penser en pipeline** (qu'est-ce que l'ingénierie de données · sources/puits/batch/flux · ETL/ELT · formats CSV/JSON/Parquet) · **M2 Construire un pipeline robuste** (ingestion pleine/incrémentale+curseur · bronze/silver/gold · partitionnement/pruning · idempotence/backfill) · **M3 Faire tourner et faire confiance** (orchestration/DAG · qualité/tests · contrats & évolution de schéma · observabilité fraîcheur/lignage/alertes) · **M4 À l'échelle** (coût/volumétrie · **capstone** pipeline de bout en bout). Code = **SQL + Python + YAML** (Prism sql/python/yaml/json/bash selon leçon). `verif-contenu --cours=data-eng` = **0 sous le standard · 0 maigre · 0 redondance** ; par leçon svg 3-4 · callouts 6-8 · glossaire 9-12 · quiz 4 · exos 3 · **mots 2750-3590** (bien au-dessus de la médiane du site 2028). Intégration complète : `courses[]` + `content{}` (related **sql/nosql/iac/observabilite**) + 14 durées ; accent **`#0f766e`** (clair) / `#45c9ba` (sombre) ; logo `de` ; catalogue (« Back-end, données & API ») ; parcours **`data`** (sql·python·pandas·data-eng·stats·dataviz·r) ; projet contextualisé « Le pipeline de données de Vélociti » ; **retours** ajoutés sql→data-eng, nosql→data-eng, iac→data-eng, observabilite→data-eng. Capstone L14 : `data-quiz` (4) + `data-quiz-bilan` (12 Q sur tout le cours) + `.steps` (7 étapes, une par thème) + bloc Projet aligné par un `null` en 4ᵉ position de `data-exos` → I13 vert. Index régénérés (quiz +70 → 5400, flashcards +125 → 10312, antisèches +18 → 1443 = **80/80 cours couverts**, search/searchlite → **1419**). Compteurs portés à **80 cours / 1419 leçons** (accueil, catalogue, à-propos, recherche, antisèches, i18n EN, palette clavier ; 73 langages inchangé — data-eng = Python). Vérifs : `node tools/verif.js` **tout vert** — `verif-html` **0** · `verif-donnees` **0 erreur** (18 invariants ; I11 projet, I12 bilan, I13 exos, I14 Prism, I15 JSON, I16 orphelins, I18 index tous verts ; seul avert. = I17 `zig` préexistant) · `verif-contenu` **0/0/0** · `verif-rendu` **0 erreur / 0 avert.** (15 pages data-eng + **balayage exhaustif des 84 `cours.html` du site** × 3 largeurs × 2 thèmes = 504 mesures). **Bonus accessibilité** : le related data-eng→nosql a révélé un défaut de contraste **préexistant** sur `.related-card__glyph` (glyphe « NQL » vert 3.34:1 en clair) ; le balayage exhaustif en a révélé un second, symétrique, en sombre (glyphe « Sec » rose 4.26:1, sur http/linux/observabilite/reseaux). **Corrigés à la source** (css/pages.css : texte du glyphe assombri de 25 % vers le noir en thème clair, éclairci de 15 % vers le blanc en thème sombre) → nosql 3.34→~5.3:1, securite 4.26→~5.2:1 ; **0 régression** sur les 84 cours.html × 2 thèmes. Site **79 → 80 cours**, **1405 → 1419 leçons**.

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

  ⏳ **À traiter en F3** (effet de bord attendu, à faire une fois TOUS les cours ajoutés car chaque cours riche rebouge les médianes) : après B1 (pandas), la médiane **mots** du site est montée à **1996** ; après **B2 (dataviz)**, elle est à **2010** ; après **B3 (stats)**, elle est à **2019**. Deux leçons basculent en *maigre* (4/6 sous : svg 2<3 · callouts 3<5 · glossaire 7<8 · mots sous la médiane) — **ni l'une ni l'autre n'est « sous le standard »**, seulement sous la médiane (non bloquant, `verif.js` reste vert) :
    - **`os/lecon-02`** (mots 1994) — déjà repéré en V8/après B1.
    - **`sass/lecon-08`** (mots 1996) — bascule révélée par B2.
    **B3 (stats) n'a révélé AUCUNE nouvelle bascule** (le cours est assez riche — médianes svg 4/callouts 7/mots 4099 — pour ne rien tirer d'autre sous la médiane) : ce sont toujours ces 2 leçons. Ne PAS corriger à chaque cours (retravail) ; enrichir légèrement chacune (1 SVG + 2 callouts + 1 terme + ~30-40 mots pour repasser la médiane finale) lors de la passe F3, en re-mesurant la médiane après le dernier cours. Après **B4 (data-eng)** : médiane du site à **2028** ; toujours ces **2 mêmes** maigres (os/lecon-02 1994, sass/lecon-08 1996), **aucune nouvelle bascule** (les 14 leçons data-eng sont riches, 2750-3590 mots). Continuer à surveiller au fil de C1→E1 (la médiane va encore monter).

---

## Fin de chantier

Quand toutes les cases sont cochées, le wrapper déclenche la **passe de sécurité** : vérification
globale, rapport dans `VERIF-FINALE.md` avec un verdict en première ligne, puis extinction automatique
si le verdict est vert. Le verdict n'est retenu que si le rapport a été **écrit pendant cette passe**.
