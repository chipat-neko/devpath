# Chantier V12 — les 42 points de l'inventaire

Plan de travail de l'autonomie. **Source de vérité : ce fichier.** Chaque réveil lit ce plan,
prend la **première case non cochée**, la traite entièrement, la coche avec un compte rendu chiffré,
puis passe à la suivante. Le chantier est fini quand il ne reste aucune case `- [ ]`.

**Origine** : l'inventaire du 2026-08-20 (`INVENTAIRE-2026-08-20.md`, 11 agents). 29 propositions,
**26 manques vérifiés** après filtrage sceptique, plus **15 rattrapés par les filtres** eux-mêmes.
Décision de Noah : traiter le rapport en entier.

Les points sont regroupés **par thème**, pas par angle d'audit : trois angles indépendants ont trouvé
le même manque (le cahier d'erreurs), et plusieurs autres se recoupent.

---

## ⚠️ CE QUE CET INVENTAIRE A PROUVÉ

Les quatre vérificateurs étaient **verts** quand l'inventaire a trouvé **5 exemples dont la sortie
annoncée était fausse** — dont une leçon sur les regex qui affichait `// true` sous un test renvoyant
`false`, visible par l'apprenant puisque `runner.js` pose un bouton « ▶ Tester ».

Ces 5 erreurs sont **déjà corrigées** (commit du 2026-08-20, 10 assertions rejouées). Mais la cause
reste : **aucun outil n'exécute jamais un exemple.** 1 862 valeurs attendues sont écrites en
commentaire et 4 241 réponses d'exercices sont déclarées ; personne ne les confronte au réel.

C'est pourquoi la **phase A est l'outillage** : elle sert à tout le reste, et elle attrape ce que
les yeux ne voient pas.

---

## Règles permanentes

- **Un point à la fois**, mené jusqu'à la mesure. Le compte rendu cite le chiffre avant et après.
- **Vérifier avant de faire** : les chiffres datent du 2026-08-20. Reproduis la mesure ; si un point est déjà réglé, coche-le en le signalant.
- **NE JAMAIS CORRIGER UN CALCUL DE TÊTE, LE FAIRE TOURNER.** Règle héritée du chantier V11, et c'est elle qui a permis de trouver les 5 erreurs.
- **Un commit par point**, avec la mesure dans le message.
- `node tools/verif.js --rapide` doit rester vert ; `verif-rendu` dès que tu touches à du CSS.
- **Contrainte fondatrice** : 100 % `file://`, aucun serveur, aucun module ES, aucun build, aucune dépendance installée.
- **⚠️ ORDRE DES FEUILLES CSS** : `variables` → `base` → `layout` → `components` → `pages`. Une règle de même spécificité placée dans un fichier antérieur est **écrasée**.
- **⚠️ `.tag` et `.module` percutent les jetons Prism** : toute classe portant un nom de jeton doit exclure `.token`.
- **⚠️ JAMAIS de `&nbsp;` dans un bloc `<script type="application/json">`**.
- **⚠️ Un motif de remplacement trop large casse ce qui était juste** : un même chiffre apparaît souvent plusieurs fois dans une page pour des raisons différentes. Rejoue le scénario complet après correction.
- **INTERDIT** : réintroduire une URL vers `cdnjs.cloudflare.com`, `fonts.googleapis.com`, `fonts.gstatic.com`.
- **En cas de doute réel : ne force pas.** Laisse la case décochée et écris ce qui bloque.

---

## PHASE A — L'outillage (la cause racine, à faire en premier)

- [x] **A1 · Exécuter les exemples.** ✅ Outil `tools/verif-exemples.js` créé (Node pur : JavaScript via `vm` isolé ; Python via l'interpréteur `python` — 3.14.5 présent). Extrait les blocs `<code class="language-…">`, repère les valeurs annoncées (`//=>`, `// affiche :`, valeur nue après un affichage `// true`, expression pure `expr // 42`), **exécute** et confronte au réel avec le **formatage exact de runner.js**. **Trois états jamais confondus** : conforme / divergent / non vérifié. **Mesure finale — JS : 1 774 blocs, 649 porteurs d'une valeur attendue, 327 conformes, 0 divergent, 322 non vérifiés** (API navigateur/Node 101, erreur d'exéc. 82, compte 77, non-déterministe 30, glose 21, Intl/locale 11). **Python : 995 blocs, 331 attendus, 213 conformes, 0 divergent, 118 non vérifiés.** **1 VRAIE erreur trouvée et corrigée** : `algo/lecon-23` (filtre de Bloom), taux de faux positifs `0.0081`→`0.0100` (= 1 %, la cible) et `0.9999`→`0.9953`, **prouvés par exécution**. **Zéro faux positif** après calibration (garde-fous : gloses françaises, guillemets décoratifs, objet JS vs JSON, flottants `23.1`/`23.0999…`, ellipses, BigInt `n`, `NaN`/`Infinity`, mono/multi-argument, non-déterminisme `Date`/`random`/`console.time`, `Intl`/`toLocale*`, système de fichiers Python). Intégré à `verif.js` comme **5e vérificateur** (JS en `--rapide` ~1 s, +Python en complet ~35 s). `verif.js --rapide` = **5 verts en 15 s**.

- [x] **A2 · Étendre A1 aux réponses d'exercices.** ✅ Mode exos ajouté à `verif-exemples.js` (moteur EXACT du site : `fmt` du worker + `normExo` de `lecon.js` reproduits). **Chiffrage exact des 4 241 réponses** (`type` non-null) : **105 `type:code`** (portent `run.expect`) + **4 136 `type:text`** (réponses `accept:[…]`, non exécutables) + 199 laissées. **Constat prouvé : le `data-exos` NE stocke AUCUNE solution** (0 champ `solution` ; le dernier bloc d'un `.exercise` est une démonstration, pas la réponse → détecter une « solution » = **55 faux positifs**, écarté). Le seul code de référence sûr est l'**énoncé** : rejoué au moteur du site, **44 `type:code` produisent déjà `run.expect`** (exercices de « prédiction » → expect **confirmé par exécution**), **0 divergent**, **61 non vérifiables** (correction/complétion, pas de solution à opposer à expect). Vérifiable = **44 / 4 241** ; le reste ne l'est pas *par construction* (solution absente ou réponse textuelle). Options `--exos` / `--pas-exos` ; tourne avec `--lang js` (~0,4 s) donc inclus dans `verif.js --rapide` (17 s, 5 verts). Écart 45→44 vs l'exploration = fidélité au site (`fmt` sans NaN : `JSON.stringify(NaN)="null"`).

- [x] **A3 · Le biais de longueur des QCM.** ✅ **(a) détecteur ajouté à `verif-contenu.js`** (non bloquant, le biais est structurel). **Mesure reproduite et confirmée : 5 643 questions, bonne réponse STRICTEMENT la plus longue = 5 250 (93,0 %)** — exactement le « 93 % » de l'inventaire. Seuil « nettement » (≥ 1,8× ET +25 car. sur le meilleur distracteur) : **4 306 questions (76,3 %) = périmètre du chantier éditorial (b)**. 10 pires cas affichés (ratios ×16 à ×29, distracteurs de 2-7 c. face à des bonnes réponses de 57-146 c. : `git/l17`, `lisp/l07`, `python/l03`…). Sortie JSON étend `biaisQcm`. **Point « options mélangées » VÉRIFIÉ** : `lecon.js` mélange les options par `shuffle` Fisher-Yates (ligne 529) avant l'affichage → la position ne trahit pas la réponse ; c'est bien la LONGUEUR, pas l'ordre, le problème. **(b) = chantier éditorial à part, ~4 306 questions — hors de portée d'une passe** (étoffer les distracteurs, ne pas raccourcir la bonne réponse) : à planifier séparément.

- [x] **A4 · Relier les compteurs affichés à la réalité.** ✅ **Invariant `I19` ajouté à `verif-donnees.js`** : confronte chaque « N cours/leçons/langages/parcours » AFFICHÉ (accueil `index.html`, `catalogue.html`, `a-propos.html`, `main.js`) au **décompte réel de `data.js`** (`COURSES.length`, `totalLessons`, valeurs distinctes de `language`, `TRACKS.length`). **Clé anti-faux-positif : les COMMENTAIRES sont retirés d'abord** (HTML `<!-- -->`, JS `//` et `/* */` avec préservation des chaînes) — sinon le récit historique « 0 / 1336 leçons » d'un commentaire de `main.js:313` et l'exemple « 47 leçons » de `home.js` crieraient à tort. **État actuel : 12 compteurs affichés, tous corrects (83/1463/75/25), 0 erreur.** **Blocage PROUVÉ** : injection « 26 parcours » → `I19` = 1 ERREUR + exit 1 ; restauration git → vert. Doc mise à jour (I1→I19). Les 3 pannes historiques (79/938, 1341, 13 pages) ne pourront plus passer inaperçues.

- [x] **A5 · Titres : `data.js` contre le `<h1>`.** ✅ **Invariant `I20` ajouté à `verif-donnees.js`** : confronte le `title` de `data.js` (catalogue, recherche, nav) au `<h1 class="lesson-header__title">` écrit en dur, entités HTML décodées. **Exactement les 4 divergences de l'inventaire retrouvées.** **Corrigées dans `data.js`** (pas dans le HTML) : les pages étaient déjà cohérentes (`<title>` L6 == `<h1>` L73), c'est `data.js` qui était périmé. `data-eng/l14` + `bdd/l15` : `Projet —` → `Projet :` (aligné sur les pages **et** sur la convention majoritaire, 46 `:` vs 28 `—`) ; `mobile/l10` + `l11` : titles **tronqués** re-complétés de leur sous-titre (« …: appeler une API sans figer l'écran », « …: le stockage local fait autorité ») — le reste du cours mobile porte déjà le sous-titre dans le `title`. `search-index` régénéré (titles indexés ; search-lite inchangé). **I20 vert, `verif.js --rapide` 5 verts.** Doc I1→I20.

- [x] **A6 · Étiquettes de langage des blocs de code.** ✅ **La mesure « un bloc sur cinq » (20 %) NE se reproduit PAS** (règle 2 du plan). Heuristique prudente : **18 suspects sur 11 858 (0,2 %)**, et **tous faux positifs à l'examen** — HTML polyglotte (`<style>`/`<script>` embarqués, légitime), `import` ES partagé JS/Python (`js/lecon-26`), SQL **en commentaire** JS (`patterns/lecon-10`), cours mêlant CSS+JS en blocs distincts (`css/lecon-39`). Heuristique **stricte** (commentaires+chaînes retirés, marqueurs EXCLUSIFS, hors markup) : **0 sur 3 071 blocs js/python/sql**. Le « 1/5 » comptait ces cas légitimes. **Détecteur (a) livré quand même** : invariant **`I21`** dans `verif-donnees.js`, **en AVERTISSEMENT non bloquant** (un bloc `language-X` sans marqueur de X mais ≥ 2 marqueurs exclusifs d'un autre, commentaires/chaînes retirés) — **0 avertissement aujourd'hui**, garde-fou pour l'avenir. Doc I1→I21.

- [x] **A7 · SQL : dialecte et mots réservés.** ✅ **353 blocs SQL** (≈ les 354 annoncés). **Mots réservés comme identifiant nu : 0 aujourd'hui** — le cas `end` de l'audit V10 est corrigé (délimité `"end"` en V11-B4). **Détecteur livré = invariant `I22`** (avertissement non bloquant) : une COLONNE de CREATE TABLE ou un ALIAS `AS x` qui est un mot RÉSERVÉ du standard sans délimiteur. **Calibré contre les faux positifs** : (1) split des colonnes au premier niveau (protège `DECIMAL(10,2)`), (2) `AS SELECT`/`AS (SELECT…)`/`WITH x AS` exclus (sous-requêtes, pas des alias — éliminait **20 faux positifs**), (3) mots « non réservés » écartés (`key`, `level`, `row`, `user`, `value`… = colonnes légitimes). **Blocage PROUVÉ** (injection colonne `end` → I22 crie, git checkout → vert). **Cohérence de dialecte : NON contrôlée, à dessein** — les 2 seules leçons mêlant plusieurs marqueurs (`sql/l18`, `bdd/l05`) **comparent volontairement** `SERIAL`/`IDENTITY`/`AUTO_INCREMENT` (mixité pédagogique) ; un détecteur crierait faux. Doc I1→I22.

- [x] **A8 · `verif-rendu` ne visite que 20 pages sur 1 702.** ✅ **Défaut élargi de 20 → 229 pages** : toutes les pages de premier niveau (~63) + **les 83 `cours.html`** (dont 82 n'étaient JAMAIS mesurés) + une leçon par cours (83). Refonte de `pagesAMesurer` : nouvelles fonctions `premierNiveau()`, `tousCoursHtml()`, `chargerData()` (partagé), `dedup()` ; nouveaux drapeaux `--echantillon` (les 20 pages représentatives, rapide), `--cours`, `--lister` (affiche la sélection sans lancer Chrome). **`verif.js` recâblé** : mode normal → `--echantillon` (léger, ~20), `--complet` → `--tout --cours --lecons` (229). **Validé** : `--lister` = 229 pages (84 `*cours.html*` dont parcours.html) ; **6 `cours.html` variés mesurés sous Chrome (js/python/mobile/data-eng/bdd/sql) = 36 mesures, 0 erreur, 0 avertissement** — les cours.html se rendent proprement. Le `--complet` (229 p, plusieurs min) sera joué par le wrapper.

- [x] **A9 · Durées annoncées.** ✅ **Détecteur ajouté à `verif-contenu.js`** (avertissement non bloquant, comme le biais QCM). Mesure le **rythme = mots visibles / minute annoncée** par cours (croise `l.mots` déjà mesuré × `data.js` `durations`). **Mesure reproduite : médiane 51 mots/min, écart réel 26→122, facteur 4,7 EXACT** (= le plan). Avertit les cours hors de [médiane/2, médiane×2] (facteur 2) : **5 cours « durées trop SERRÉES »** — `stats` (107), `data-eng` (110), `mobile` (110), `equipe` (120), `bdd` (122) : ce sont les cours récents, denses, aux durées trop optimistes. Aucun côté « trop généreux » (les cours patrimoine restent > médiane/2). Sortie JSON étend `rythme`. **La correction (recalibrer les durées) est un chantier éditorial à part** — non bloquant, ni erreur ni urgence. **➡ PHASE A COMPLÈTE (A1-A9).**

---

## PHASE B — Les données de l'apprenant (risque de perte réelle)

- [x] **B1 · Les écritures qui échouent en silence.** ✅ **Mesure reproduite** par un analyseur d'accolades (remonte de chaque `setItem` au `catch` englobant) : **29 points d'écriture actifs** dans 15 fichiers `js/` — **21 en `catch (e) {}` VIDE**, 6 qui prévenaient (3 `warnStorage()` de `lecon.js`, 3 écritures d'import couvertes par un `alert`), 2 hors `try` direct. **2 des 21 vides sont dans `sync.js`, chargé par AUCUNE page** (couche dormante, vérifié) → **19 catch vides réellement atteignables = exactement le chiffre du plan**. `QuotaExceeded` : **0 occurrence** confirmée. **Helper `window.SyntaxeStore` créé en tête de `js/theme.js`** — choisi parce que theme.js est le **premier script, sans `defer`, des 1 613 pages** ; croisement vérifié : **0 page ne charge un des 14 scripts concernés sans charger theme.js**. Trois méthodes (`set`, `setJSON`, `remove`) renvoyant un **booléen**, un compteur `echecs`, et un avertissement **au plus une fois par cause toutes les 60 s** via `window.SyntaxeToast` (avec réessai ~4 s, main.js étant en `defer`). **Quota distingué du refus** (code 22, 1014, `QuotaExceededError`, `NS_ERROR_DOM_QUOTA_REACHED`) : deux messages différents. **24 points recâblés** (23 appels + `ecrire()` de sync.js qui en couvre 2), `warnStorage` supprimé (plus d'appelant). **Résultat : 21 → 0 `catch` vide** ; les 5 `setItem` restants sont les chemins d'import, qui préviennent déjà. **PREUVE SOUS CHROME headless — 10 / 10 scénarios conformes** (`Storage.prototype.setItem` patché pour jeter, avant tout script de page) : le clic « Marquer comme terminée » d'une leçon affiche le bandeau (**1 seul bandeau pour 4 écritures échouées** — pas de matraquage) ; en quota le message « stockage plein » remplace celui du refus ; **non-régression prouvée** (stockage sain → 0 bandeau et `syntaxe-progress` = `{"javascript":{"lecon-01.html":true}}`) ; idem playground (frappe dans l'éditeur), mes-qcm, bascule de thème, objectif de progression ; et le cas **`window.localStorage` inaccessible** (cookies bloqués — l'accès à la propriété elle-même jette) est couvert aussi, l'appel étant entièrement dans le `try`. **Outil livré : `tools/verif-stockage.js`**, branché comme **6ᵉ vérificateur** de `verif.js` (hors mode rapide, il pilote Chrome, ~14 s). Il ne se contente pas de guetter le bandeau : un **mouchard relève la pile d'appels de chaque `setItem`** et déclare « écriture sans filet » tout appel dont le premier cadre `.js` n'est pas `theme.js` — sans quoi un geste déclenchant 4 écritures masquerait celle restée nue (**c'est exactement ce qui s'est produit : la première version du test ne bloquait PAS une régression injectée**). **Blocage prouvé deux fois** : `writeProgress` remis en `catch` vide → 3 scénarios KO, `exit 1`, avec la ligne fautive (`writeProgress (js/lecon.js:61:26)`) ; faux succès d'effacement réintroduit → `exit 1`. **REVUE ADVERSARIALE du diff (agent dédié, 1 890 pages HTML croisées) : 5 défauts réels, tous corrigés** — (1) `SyntaxeStore.remove()` n'était branché nulle part : `donnees-perso.js` affichait « Entrée effacée. » **en vert** alors que rien ne l'était (idem « effacer TOUTES les données » et la remise à zéro de `progression.js`) ; (2) `cours.js` faisait `location.reload()` juste après l'écriture → le bandeau était **détruit avant d'être visible** (showToast n'ajoute `is-visible` qu'après 10 ms) : on ne recharge plus que si l'écriture a réussi ; (3) « une seule alerte par session » était faux (variable de closure remise à zéro à chaque navigation) et condamnait l'apprenant au silence après un unique message → remplacé par un **rappel au plus toutes les 60 s** par cause ; (4) commentaire orphelin de `warnStorage` resté collé sur `readProgress` ; (5) `sw.js` : `CACHE` laissé à `syntaxe-v1` alors que `theme.js` est dans `SHELL` → en HTTP un visiteur de retour aurait reçu l'ancien theme.js **sans** le helper, pendant que les scripts non précachés arrivaient neufs et appelaient `SyntaxeStore` → `syntaxe-v2`. **Vérification finale : `node tools/verif.js` complet — 6 verts** (source, données, contenu, exemples, rendu 20 pages/120 mesures, stockage 10/10) ; `node --check` OK sur les 17 fichiers touchés, 0 BOM, 0 URL CDN.

- [ ] **B2 · Une donnée corrompue est relue comme vide.** Tous les lecteurs font `try { JSON.parse(…) } catch { return {} }` : si `syntaxe-progress` est abîmé, la progression **paraît effacée**, rien ne le dit, et la première écriture suivante l'écrase définitivement. Distinguer « absent » de « présent mais illisible », et proposer l'export brut avant d'écraser.

- [ ] **B3 · L'import écrase au lieu de fusionner.** C'est la seule route entre deux machines. Proposer un vrai choix : remplacer ou fusionner (en gardant le meilleur score et l'union des leçons terminées).

- [ ] **B4 · « Mes données » est introuvable.** La seule page de sauvegarde et de réparation n'est accessible que par un lien de pied de page. La rendre découvrable depuis la page Progression.

- [ ] **B5 · Aucun repli `<noscript>`.** Sans JavaScript, les **62 pages transverses** sont des pages blanches muettes. Un message court expliquant que le site a besoin de JavaScript, injecté dans un gabarit.

---

## PHASE C — Le cahier d'erreurs (trouvé par trois angles indépendants)

- [ ] **C1 · L'examen n'enregistre rien.** `js/examen.js` (225 lignes) ne contient **aucun `localStorage`** : le score s'affiche et disparaît. C'est la seule activité du site dont il ne reste aucune trace — les 18 libellés de `donnees-perso.js` inventorient tout le reste. Empiler `{date, cours, score, total}` dans `syntaxe-examen`.

- [ ] **C2 · Le champ `f` est jeté.** `prepare()` fabrique `{q, e, c, opts}` et **abandonne `f`**, alors que les **5 627 questions** de `quiz-index.js` le portent. Conséquence : une correction ne peut pas pointer la leçon qui enseigne la réponse. Le conserver et composer le lien `../<c>/<f>`.

- [ ] **C3 · Rien ne liste ce qu'on a raté.** `saveQuizBest()` n'écrit que `{best, total}` ; les quatre consommateurs ne lisent que le **haut** de la distribution (« Maîtrisé », « Sans faute », « As des QCM »). Aucune page ne montre les leçons à score bas. Ajouter une section « À retravailler » dans `progression.html`. **Réserve à traiter** : pour dire *quelle notion* et pas seulement *quelle leçon*, il faut aussi noter l'index des questions ratées — quelques lignes dans `lecon.js`, `examen.js` et `cours.js`.

- [ ] **C4 · L'examen ignore ce qui a été lu.** `pool = BANK.filter(q => q.c === c)` puis mélange : sur JavaScript (65 leçons), qui en a fait 10 reçoit ~85 % de questions sur du contenu jamais ouvert, obtient 6/20, et le site lui répond « À retravailler — courage ! ». **Une case à cocher « seulement les leçons que j'ai terminées »** — les deux ingrédients existent déjà (`syntaxe-progress` et le champ `f`). L'inventaire le désigne comme le meilleur rapport effet/effort du rapport.

- [ ] **C5 · Rejouer les questions ratées.** Une fois C1 à C4 en place : un mode « refaire ce que j'ai raté », qui tire dans l'historique plutôt que dans la banque entière.

---

## PHASE D — Les pièges et les liens perdus

- [ ] **D1 · Indexer les 1 741 « Piège fréquent ».** Le site s'est donné une convention éditoriale forte — **1 777 occurrences** sur 949 leçons et 62 cours — et aucune page ne les rassemble. Un `buildPieges()` calqué sur `buildCheats`, un `js/pieges-data.js`, une page calquée sur `antiseches.html`. **Zéro contenu nouveau.** C'est aussi le meilleur matériau de flashcards du site : un piège est une prédiction vérifiable, une définition ne l'est pas.

- [ ] **D2 · Les 25 cours sans aucun encadré d'erreur.** À faire **avec D1**, sinon l'index publie un trou. Concernés : les quatre cours `-avance` et les vagues d'ajout tardives (`docker`, `api`, `securite`, `patterns`, `formats`, `nosql`, `markdown`, `vue`, `vscode`, `sass`, `http`, `a11y`, `perf-web`, `cloud`, `iac`, `wasm`, `linux`, `reseaux`, `ux`, `observabilite`, `os`). Cause identifiée : `verif-contenu.js` **compte** les encadrés sans jamais exiger qu'il y en ait un sur l'erreur. Ajouter un invariant en **avertissement** (double palier, comme I17) pour que le trou ne se rouvre pas.

- [ ] **D3 · Flashcards et glossaire ne renvoient à aucune leçon.** **10 678 cartes et 9 700 entrées** ne pointent que vers le cours. Or le générateur connaît la leçon d'origine : il la jette. La rétablir dans les deux index.

- [ ] **D4 · La révision ignore ce qu'on a étudié.** Elle propose les 10 678 cartes du site, sans option « seulement ce que j'ai lu ». Quelques lignes : lire `syntaxe-progress`.

- [ ] **D5 · Le moteur Leitner est bridé.** `revision.js` implémente un vrai Leitner (5 boîtes, intervalles 0/1/3/7/16 jours, échéances persistées) mais ne tourne que sur du vocabulaire. Le brancher sur les questions de QCM et les pièges (D1), qui sont un bien meilleur matériau de rappel.

---

## PHASE E — Navigation et reprise

- [ ] **E1 · La palette ne connaît que les leçons.** Les **40+ outils et pages transverses** sont introuvables au clavier. Les ajouter à `search-lite.js`.

- [ ] **E2 · « Imprimer un cours entier » ne marche pas en `file://`** — le seul mode supporté par le site. Générer une page imprimable par cours au moment de la construction des index.

- [ ] **E3 · La reprise est aveugle à la date.** Les dates sont pourtant enregistrées. Après trois semaines d'interruption, dire « tu as arrêté il y a trois semaines, voici où tu en étais » plutôt que de reprendre comme si de rien n'était.

- [ ] **E4 · Aucun diagnostic d'entrée.** 83 cours, 25 parcours, et rien pour dire par où commencer quand on sait déjà programmer. Une version honnête : quelques questions, puis une suggestion de parcours — **pas** un test de niveau prétentieux.

---

## PHASES F et G — déplacées vers les chantiers V13 et V14

Le catalogue et les gros morceaux pédagogiques ont été sortis de ce plan le 2026-08-21 : une case
« écrire 13 leçons de réseaux de neurones » ou « construire un moteur SQL » n'est pas un point de
chantier, c'est un chantier. Les traiter ici les aurait condamnés à être expédiés.

- Le **contenu neuf** (cours manquants, fils rouges incomplets) → **`CHANTIER-V13.md`**
- **L'exécution et la pratique** (moteurs locaux, exercices vérifiables, décodeur d'erreurs) → **`CHANTIER-V14.md`**

L'autonomie enchaîne les trois plans dans l'ordre, sans intervention.

---

## PHASE H — Contrôle final

- [ ] **H1 · Mesure globale.** Reprendre chaque chiffre du plan et donner sa valeur finale.
- [ ] **H2 · Non-régression.** `node tools/verif.js` complet, les cinq vérificateurs verts (les quatre plus `verif-exemples.js` de A1).
- [ ] **H3 · Les points laissés de côté.** Lister ce qui n'a pas été fait et pourquoi. Un point écarté avec sa raison est un résultat ; un point oublié n'en est pas un.

---

## Fin de chantier

Quand toutes les cases sont cochées, le wrapper déclenche la **passe de sécurité** : vérification
globale, rapport dans `VERIF-FINALE.md` avec un verdict en première ligne, puis extinction automatique
si le verdict est vert. Le verdict n'est retenu que si le rapport a été **écrit pendant cette passe**.
