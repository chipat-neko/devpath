<!-- Inventaire produit le 2026-08-20 par 11 agents (5 inventorieurs, 5 filtres sceptiques,
     1 syntheseur). Lecture seule. Regle imposee : verifier l'existant avant de proposer.
     Les quatre verificateurs du site etaient VERTS pendant l'inventaire. -->

# Ce qui manque à Syntaxe — note de synthèse

Cinq angles d'audit, chacun relu par un filtre sceptique. Sur 29 manques proposés, **4 ont été rejetés** (la fonctionnalité existait déjà) et 1 classé indécidable. Il reste **24 constats vérifiés**, dont 11 remontés par le filtre lui-même. Ils sont dédupliqués et classés ci-dessous par rapport valeur/effort, pas par angle.

---

## 0. À faire tout de suite : 5 erreurs vivantes dans les leçons

Ce n'est pas un manque, c'est une dette. Un exécuteur jetable a confronté 269 blocs Python et 332 blocs JavaScript à leurs propres commentaires de sortie. Les cinq écarts ont été **rejoués un par un** par le filtre, à un instant où les quatre vérificateurs étaient verts :

| Fichier | Annoncé | Réel |
|---|---|---|
| `pages/python/lecon-07.html:233` | `[12, 15, 8, 19]` | `[8, 12, 15, 19]` (la prose l. 235 de la **même page** donne, elle, la bonne valeur) |
| `pages/python/lecon-09.html:213` | `2` | `"sam@exemple.fr".count("e")` = **3** |
| `pages/stats/lecon-06.html:392-393` | `253.5`, `[-268.0 ; 746.5]` | `pstdev` = **275.0**, `[-311.0 ; 789.0]` |
| `pages/js/lecon-52.html:142` | `// true` | **false** — `\w` ne contient pas le « è » de « très » : l'exemple censé démontrer les rétro-références nommées échoue sur son propre cas |
| `pages/js/lecon-52.html:216` | `[5, 9]` | `[6, 10]` |

Le cas `js/lecon-52` est le plus grave : `js/runner.js` pose déjà un bouton « ▶ Tester » sur les blocs JavaScript en `file://` — l'apprenant peut cliquer et voir `false` sous une ligne qui écrit `// true`. La leçon prouve le contraire de ce qu'elle enseigne.

**Effort : une demi-heure.** À corriger avant tout le reste.

---

## Rang 1 — Quelques heures à une journée, valeur forte

### 1.1 Les écritures qui échouent en silence (quelques heures)

**Constat.** 24 sites d'écriture `localStorage` hors fichiers `-data`. **3 seulement préviennent** l'utilisateur, tous via `warnStorage()` défini dans `js/lecon.js:52` ; `grep -rln warnStorage js/` ne renvoie qu'un fichier. Les **19 autres sont des `catch (e) {}` strictement vides**, dont `js/mes-qcm.js:43-44` (les questions rédigées à la main par l'apprenant) et `js/playground.js:60-64` (son code). `QuotaExceeded` : 0 occurrence dans tout `js/`.

**Ce que ça apporte.** Un navigateur qui bloque le stockage du site (mode privé, profil durci — fréquent en `file://`) fait échouer *toutes* les écritures dès la première. Aujourd'hui l'apprenant coche des leçons pendant une heure sans qu'un mot ne lui dise que rien n'est gardé.

**Effort.** `window.SyntaxeToast` existe (`js/main.js:20-47`) et `js/main.js` est chargé sur les 62 pages **et** sur les leçons (vérifié 62/62). Extraire un helper `Syntaxe.safeSet(k, v)` renvoyant un booléen, remplacer les 19 `catch` vides. Aucun format de données touché.

**À traiter dans la même passe (le pendant en lecture) :** tous les lecteurs font `try { JSON.parse(...) } catch { return {} }`. Une donnée corrompue est relue comme **vide** — la progression paraît effacée, rien ne le dit, et la première écriture suivante l'écrase définitivement. Détecter « `syntaxe-progress` existe mais ne parse pas » et proposer l'export brut au lieu d'écraser : une demi-journée de plus.

---

### 1.2 Le cahier d'erreurs : rien ne mémorise ce qu'on a raté (une journée)

C'est le constat le plus solidement établi de l'audit — **trois angles indépendants l'ont trouvé** et le filtre a échoué à le démolir.

**Constat, en trois pièces.**
- `js/examen.js` (225 lignes) ne contient **aucun `localStorage`** : `finish()` (l. 176-222) affiche le score et la correction, puis s'arrête. C'est la seule activité du site dont il ne reste rien — les 18 libellés de `js/donnees-perso.js:11-29` inventorient tout le reste (leçons, QCM, défis, flashcards, pomodoro, projets, fils rouges, jusqu'au dernier cours d'antisèche consulté) ; « examen » n'y figure pas.
- `prepare()` (l. 84-91) fabrique `{ q, e, c, opts }` : le champ **`f` est littéralement jeté**, alors que les 5627 questions de `js/quiz-index.js` le portent (`"c":"a11y","f":"lecon-01.html"`). Une correction pointe la bonne réponse et l'explication, jamais la leçon qui l'enseigne.
- `js/lecon.js:139-155` (`saveQuizBest`) n'écrit que `{ best, total }` par leçon. Les quatre consommateurs (`cours.js:134` et `:199`, `progression.js:80` et `:340`) ne lisent **que le haut de la distribution** : « Maîtrisé », « Sans faute », « As des QCM ». Aucune page ne liste les leçons à score bas. `grep « à revoir / point faible »` dans `progression.js` = 0.

**Bonus quasi gratuit du filtre.** `js/examen.js:95` fait `pool = BANK.filter(q => q.c === c)` puis mélange : aucune option « seulement les leçons que j'ai terminées ». Sur JavaScript (65 leçons), qui en a fait 10 reçoit ~85 % de questions sur du contenu jamais ouvert, se prend un 6/20, et `scoreMsg()` lui répond « À retravailler — courage ! ». **Une case à cocher + un filtre** (les deux ingrédients sont posés : `syntaxe-progress` via `isDone()` et le champ `f`). C'est le meilleur rapport effet/effort de tout l'audit.

**Ce que ça apporte.** Le passage de « j'ai eu 12/20 » à « voilà les trois leçons à rouvrir ». Et la possibilité de mesurer l'oubli : refaire un examen un mois plus tard n'a de sens que si le premier score existe encore.

**Effort.** Une journée : empiler `{date, cours, score, total}` dans `syntaxe-examen`, composer `../<c>/<f>` sur chaque question ratée, une section « À retravailler » dans `progression.html` alimentée par `syntaxe-quiz`, la case à cocher dans `renderSetup()`.

**Réserve honnête.** `saveQuizBest()` ne garde pas *quelles* questions ont été ratées. La section saura dire « cette leçon : 1/3 », pas « cette notion-là ». Si vous voulez le grain fin, il faut aussi noter l'index des questions ratées au moment de la correction — quelques lignes de plus dans `lecon.js`, `examen.js` et `cours.js`.

---

### 1.3 Indexer les 1741 « Piège fréquent » (une demi-journée à une journée)

**Constat.** Le site s'est donné une convention éditoriale forte : `grep -roh "Piège fréquent"` = **1777 occurrences** (~1741 en titre), plus 28 « Erreur fréquente », sur 949 leçons et 62 cours. `tools/build-index.js` ne définit que quatre extracteurs — `buildQuiz` (l. 375), `buildFlashcards` (l. 441), `buildCheats` (l. 502), `buildSearch` (l. 631). **Aucun sur les callouts.** Aucune page ne les agrège (`ls pages/ | grep -i 'pieg\|erreur'` = vide). Contournement vérifié et insuffisant : la recherche plein texte indexe le corps des leçons, mais `js/search-index.js` ne stocke qu'un extrait de début de leçon — on obtient une liste de leçons à ouvrir une par une, pas la liste des pièges.

**Ce que ça apporte.** Quand on est bloqué, on ne relit pas un cours : on cherche « qu'est-ce qui coince habituellement ici ». C'est aussi le meilleur matériau de flashcards du site — un piège est une prédiction vérifiable, une définition ne l'est pas.

**Effort.** Un `buildPieges()` calqué sur `buildCheats`, un `js/pieges-data.js`, une page calquée sur `antiseches.html`. Zéro contenu nouveau, le marqueur est fiable.

**Condition à ne pas manquer.** **25 dossiers de cours sur 87 n'ont aucun « Piège fréquent »** : js-avance, html-avance, css-avance, python-avance, docker, api, **securite**, patterns, formats, nosql, markdown, vue, vscode, sass, http, **a11y**, perf-web, cloud, iac, wasm, linux, reseaux, ux, observabilite, os. Ce sont les vagues d'ajout tardives plus les quatre cours `-avance`. Cause identifiée : `tools/verif-contenu.js` **compte** les encadrés (min. 2) mais n'a jamais exigé qu'il y en ait un sur l'erreur. Publier l'index sans combler ces 25 cours produirait une page qui donne à voir un trou. Les deux vont ensemble — et un 18ᵉ invariant en avertissement (même double palier que I17) empêcherait le trou de se rouvrir.

---

### 1.4 Le détecteur de biais de longueur des QCM (quelques dizaines de lignes)

**Constat.** Sur les ~5600 questions du site, **la bonne réponse est strictement la plus longue dans 93,4 %** des cas (mesure indépendante du filtre : 5235/5603 ; l'inventaire disait 93,0 %), contre ~25 % attendus au hasard sur 4 options. Elle n'est la plus courte que 1,9 % du temps. Par cours, **6 cours au moins sont à 100,0 %** (equipe 68 q, mobile 73, ux 56, archi 48, iac 45, zig 71) ; le moins biaisé du site est vscode, à 78 %.

Piège écarté au passage, et qui vaut d'être noté : le biais de **position** est encore plus spectaculaire (bonne réponse à l'indice 0 dans 99,6 % des cas) mais **inoffensif** — les options sont mélangées à l'affichage dans les trois moteurs (`lecon.js:529`, `examen.js:88`, `mes-qcm.js:155`). Le mélange permute les options ; il ne change pas leur longueur. Le biais de longueur, lui, traverse le mélange intact.

**Ce que ça apporte.** Un apprenant qui ne sait rien coche la réponse la plus longue et obtient ~93 %, à la leçon, au bilan et à l'examen. Les scores de `syntaxe-quiz`, le tableau de bord, l'XP et le certificat imprimable reposent donc sur une mesure qui ne mesure pas la connaissance.

**Effort — à ne surtout pas confondre.** Le **détecteur** (un I19 dans `verif-donnees.js`, seuil par cours plutôt que couperet global) : quelques dizaines de lignes, faisable cette semaine. La **correction** : elle touche 5235 questions, c'est un chantier à part, à mener cours par cours en visant d'abord les cours d'entrée (html, css, python, javascript), avec une seule régénération de `quiz-index` à la fin. Ne prenez la décision que sur le détecteur.

---

### 1.5 Rendre son fichier de leçon aux flashcards et au glossaire (quelques lignes + régénération)

**Constat.** `js/flashcards-data.js` exécuté sous node : chaque carte n'a que **quatre champs** — `['c','ct','t','d']`. Aucun fichier de leçon. Or `tools/build-index.js:451-465` **tient la variable `file`** dans sa boucle `sources.forEach(...)` et la jette. Les deux autres index dérivés le portent, eux (`quiz-index.js` et `antiseches-data.js` ont `"f":"lecon-01.html"`). Les flashcards sont le seul index amputé — et c'est celui où l'on est en train de constater qu'on ne sait pas.

Conséquence en aval, à deux endroits : `js/revision.js` n'affiche aucun lien sur une carte ratée ; `js/glossaire.js:69-76` ne peut composer que `<dir>/cours.html` — cherchez « hoisting » dans le glossaire général, vous atterrissez sur l'accueil du cours JavaScript, pas sur la leçon qui l'explique.

**Effort.** Un champ de plus dans l'objet poussé, une régénération, deux lignes d'affichage. Coût : +~5 % sur les 2,3 Mo de `flashcards-data.js`.

**C'est aussi ce qui débloque le point 2.1 ci-dessous** — sans `f`, le filtre « ce que j'ai étudié » ne peut porter que sur les *cours commencés*, jamais sur les *leçons vues* : qui a lu 3 leçons de python recevrait quand même les cartes des 50.

---

### 1.6 Le lot « cohérence » — sept correctifs indépendants, chacun sous l'heure

Rien de spectaculaire, mais le coût est proche de zéro et chacun est un contrôle manuel qui disparaît.

- **`solidity` est le seul des 83 cours absent des 25 parcours.** Trois lignes dans `data.js`.
- **L'échantillon de `verif-rendu.js` est écrit en dur, 20 pages sur 1702.** `verif.js:44` le lance sans argument en mode standard : « les 4 vérificateurs sont verts » signifie 1,2 % du site sur l'axe rendu. Pire, `pagesAMesurer()` (l. 115-127) lit `pages/` **non récursivement** et `--lecons` prend une leçon par cours : **82 des 83 `pages/<dir>/cours.html` ne sont visitées dans aucun mode** (seul `pages/html/cours.html` figure en dur). Ces pages portent la start-card, les modules, le récap, le glossaire et le QCM bilan, et n'ont jamais eu de mesure de débordement à 320 px ni de contraste. Preuve que la liste n'a pas été revisitée : son commentaire l. 90-93 parle de « 1376 leçons » et « 76 accents ». Correctif : ajouter les `cours.html` à `unePageParCours()` et dériver l'échantillon de `data.js`.
- **Les compteurs affichés ne sont reliés à rien.** « 83 cours » 8 fois, « 1463 leçons » 8 fois, « 75 langages » 4 fois, en dur dans `index.html`, `catalogue.html`, `a-propos.html`, plus « N modules · M leçons » dans les 83 `cours.html`. Tout est juste aujourd'hui, mais `grep` sur `tools/` ne rend aucune correspondance. Précédents : l'audit V4 a dû corriger « 79/938 » → « 76/1336 » partout, et `VERIF-FINALE.md` point (i) indique que 6 compteurs ont été vérifiés **à la main**. Un invariant dérivant les 5 chiffres de `SITE_DATA` : quelques dizaines de lignes. (Piège connu : la clé est `content[id].dir`, pas l'id.)
- **4 titres de `data.js` divergent du `<h1>` de la page** : `data-eng/lecon-14` et `bdd/lecon-15` (« Projet — » vs « Projet : »), `mobile/lecon-10` et `-11` (titres tronqués dans `data.js`). L'apprenant voit un intitulé au catalogue, un autre en arrivant. Dix lignes de détecteur.
- **Les durées annoncées impliquent un rythme variant d'un facteur 4,7.** Médiane du site : 52 mots/min ; de 23 (julia) à 109 (bdd, equipe). `pages/bdd/lecon-04.html` = 5028 mots annoncés en 38 min, pendant que `pages/powershell/lecon-11.html` = 989 mots est annoncé en **50 min**. Les 8 cours les plus denses (bdd, equipe, data-eng, mobile, stats, dataviz, pandas, algo) sont exactement les cours récents : le contenu a grossi, les durées n'ont pas suivi. I2 vérifie que la durée *existe*, jamais qu'elle tient debout — et ces durées sont additionnées pour afficher les heures d'un cours et d'un parcours.
- **La palette Ctrl+K ne connaît que les leçons.** `window.SEARCH_INDEX.docs` = exactement 1463 entrées, toutes `[dossier, lecon-NN.html, titre, résumé]` ; `js/main.js:914` et `:963` ne savent construire qu'une URL `pages/<dossier>/<fichier>`. Taper « regex » ne propose jamais `regex-test.html`, « couleur » ne propose pas `couleurs.html`, « flashcards » ne propose pas `revision.html`. 62 pages autonomes sont hors du raccourci clavier. Une trentaine d'entrées « page » à ajouter à l'index : de l'ordre de l'heure.
- **Les 23 défis n'ont ni indice ni solution.** `js/defis-data.js` : clés `{id, titre, niveau, enonce, fn, depart, tests}`, 0 occurrence de « solution » dans `js/defis.js`. Pendant ce temps les 4241 exercices de leçon servent leurs indices à 2, 5 et 8 essais. Sur la seule surface de code libre du site, l'apprenant bloqué n'a **rigoureusement rien**.

---

## Rang 2 — Une journée à quelques jours

### 2.1 Élargir la répétition espacée au-delà du vocabulaire

**Constat.** À porter au crédit du site : `js/revision.js` est un vrai Leitner — 5 boîtes, `INTERVALS = [0, 1, 3, 7, 16]` (l. 22), échéances persistées, fusion relire-avant-écrire multi-onglets. Mais `var CARDS = window.FLASHCARDS` (l. 11) et `buildFlashcards()` ne lit que `readGlossary(html)` : les **10 678 cartes sont exclusivement des couples terme→définition**. Les 5627 questions de `QUIZ_BANK` — tout ce qui demande un raisonnement plutôt qu'un rappel — n'ont aucune planification.

Trois limites secondaires, mesurées : `filter = "all"` par défaut (l. 61) et `buildCourseOptions()` (l. 65-88) itère sur les **cartes**, pas sur la progression — qui a fait 3 leçons de python se voit servir de l'Ada et de l'assembleur x86-64 ; la boîte 5 plafonne à 16 jours, sans état « acquis » ; et le nombre de cartes dues n'est affiché **nulle part hors de `revision.html`** (`index.html:424` et `:541`, `progression.js:457` renvoient sans chiffre ; `bilan.js:97` compte les cartes *commencées*).

**Ce que ça apporte.** Réviser une question de QCM ou un piège, c'est se retester ; réviser une définition, c'est se relire. Le premier fait tenir en mémoire, pas le second. Le moteur ET la matière existent, elles ne se sont jamais rencontrées. Et un « 12 cartes à revoir aujourd'hui » sur l'accueil est ce qui déclenche la session.

**Effort.** Une journée de câblage : un champ `kind` (définition / question / piège), le filtre sur la progression (qui suppose 1.5 fait), le compteur d'échéances sur l'accueil et la progression. Le plafond à 16 jours et l'état « acquis » : quelques lignes, mais à décider avec soin — et notez que la file libre hors échéance est un **choix documenté** dans le code (l. 106, « Tout est à jour : révision libre »), pas un bug.

---

### 2.2 SQL réellement exécutable hors ligne

**Constat.** Sur 4440 exercices auto-corrigés, **105 (2,4 %) vérifient du code réellement écrit**, tous en JavaScript, dans 4 dossiers sur 83 (js 45, algo 38, projets-js 21, formats 1). Les 354 blocs `language-sql` déclenchent un chargement de sql.js depuis `cdn.jsdelivr.net` que `js/runner.js` sait impossible en `file://` (l. 19-22 : un worker à origine opaque ne peut ni `importScripts` ni `fetch` le `.wasm`). `pages/console.html:78` le dit noir sur blanc. Le cours SQL a 24 leçons, il existe un cours `nosql` : **zéro requête exécutable**.

Deux nuances qui renforcent la proposition : le **branchement est déjà écrit** — `runner.js` contient `SEED_SQL` (base de démo clients/commandes, l. 105-131), `activateSql` (l. 361), `runSql` et le rendu du tableau de résultat (l. 581-612). Il ne manque **que le moteur**. Et les exercices SQL ne sont pas tous « devine la sortie » : `pages/sql/lecon-01.html` accepte déjà `accept:["SELECT nom FROM clients"]` — mais par comparaison de chaîne normalisée (`normExo`, `lecon.js:718-726`), donc toute requête équivalente écrite autrement est refusée.

**La route à instruire avant d'engager quoi que ce soit.** L'inventaire proposait d'écrire 800 à 1200 lignes de moteur SQL maison. Le filtre a identifié dix fois moins cher : `WebAssembly.instantiate(ArrayBuffer)` **ne fait aucune requête réseau**. Un `.wasm` encodé en base64 dans un `.js` classique se décode en mémoire et s'instancie, y compris en `file://` — et sql.js expose exactement l'option prévue (`initSqlJs({ wasmBinary })`). Ordres de grandeur : `sql-wasm.wasm` ≈ 1,2 Mo, soit ≈ 1,6 Mo en base64, alors que `js/search-index.js` pèse déjà 3,7 Mo et que `assets/vendor/prism` vendorise déjà une bibliothèque tierce en 60+ scripts classiques. **L'écart de risque est le vrai argument** : un vrai SQLite est juste par construction ; un moteur `SELECT/JOIN/GROUP BY/HAVING` écrit à la main enseignerait ses propres bugs à des apprenants incapables de les détecter — sur un site dont les quatre vérificateurs sont verts, c'est le pire endroit où introduire une sémantique approximative.

**Corollaire.** La même question se repose pour Python, écarté un peu vite (Pyodide = dizaines de Mo, Brython = XHR interdit) sans examiner ni sous-ensemble maison ni petit interpréteur wasm embarqué. Mesure : **432 des 996 blocs python n'emploient ni `import`, ni `class`, ni `with`, ni `async`** — cible plus grande que les blocs SQL. Le plafond « 2 langages exécutables sur 73 » est peut-être moins bas qu'annoncé.

---

### 2.3 Les fils rouges qui ne mènent nulle part

**Constat.** L'union des étapes des 18 `js/fil-rouge-*-data.js` couvre 69 cours : **14 n'apparaissent dans aucun fil rouge** — pandas, dataviz, stats, data-eng, bdd, mobile, equipe, vb, solidity, linux, reseaux, ux, observabilite, os. Deux blocs entiers :

- **Données.** `fil-rouge-donnees-data.js` enchaîne python → sql → r → julia → python, alors que le parcours `data` compte 8 cours (sql → bdd → python → pandas → data-eng → stats → dataviz → r). Les 5 cours de données ajoutés depuis (pandas 14 leçons, stats 15, data-eng 14, bdd, dataviz) n'ont **aucun fil rouge**.
- **Exploitation/SRE.** linux, reseaux, os, observabilite n'apparaissent nulle part, alors que le parcours `exploitation` les enchaîne.
- **IA.** `fil-rouge-ia-data.js` ne compte que **3 étapes** — ml, llm, puis **graphql « Exposer l'IA via une API GraphQL »**, qui n'a aucun rapport avec l'IA et sert visiblement de débouché au cours graphql. C'est le fil rouge le plus court du site avec `fiabilite` (2 étapes). Le parcours `ia` (python → pandas → stats → ml → llm) et le fil rouge du même nom ne se recoupent que sur deux cours.

**Ce que ça apporte.** Le fil rouge est la 3ᵉ forme de projet du site et il existe pour 69 autres cours. Un apprenant qui suit un parcours puis ne trouve aucun projet correspondant voit une incohérence, pas une lacune de contenu.

**Effort.** Le moteur `js/fil-rouge.js` est générique : ajouter des étapes coûte quelques dizaines de lignes de données. Sans commune mesure avec un cours.

---

### 2.4 La reprise après une longue absence (une demi-journée)

**Constat.** `js/lecon.js:947-953` (`recordLast`) écrit `syntaxe-last = { course, file, title }` — **aucune date** ; `js/home.js:86` le relit tel quel. La proposition est identique après une nuit et après six mois. Or les dates existent : `syntaxe-activity` (visites/jour) et surtout `syntaxe-done-log` (`logDailyDone()`, `lecon.js:96-108`, clés `courseId/file` par journée). Ce journal daté n'est lu qu'à deux endroits : `progression.js:187` (`todayCount()`, la journée en cours) et `donnees-perso.js` (export). `grep « jours / absence / inactif / revenir »` dans `home.js` et `progression.js` = 0.

**Ce que ça apporte.** Après une coupure, la bonne première action n'est pas la leçon suivante : c'est cinq minutes sur ce qu'on avait vu. C'est le moment exact où l'on perd les gens, et le seul que le site ne traite pas — alors qu'il traite très bien le rythme quotidien (série, objectif, heatmap 13 semaines, Pomodoro).

**Effort.** Les données sont déjà écrites et déjà exportées. Une variante du bloc de `home.js` : « ça fait 47 jours — voici trois choses à revoir », alimentée par `syntaxe-done-log` (le plus ancien non revu) et `syntaxe-quiz` (les scores les plus bas).

---

### 2.5 Un décodeur de messages d'erreur (une journée)

**Constat.** 390 occurrences de vrais noms d'erreurs dans le corpus (TypeError 119, ValueError 60, NullPointerException 59, KeyError 42, ReferenceError 31, borrow checker 27…), dispersées dans 74 leçons. `js/reference-data.js` expose 8 tables (HTTP, entités, Markdown, regex, Git, Linux, Rust, Docker) : **aucune sur les erreurs**. `js/flashcards-data.js` n'en contient que 11 occurrences. `pages/lexique.html:62` annonce même « les messages d'erreur sont souvent en anglais », mais `js/lexique-data.js` ne traduit que 65 mots isolés, aucun message.

**Nuance apportée par le filtre — c'est pourquoi ce point est en rang 2 et non en rang 1.** L'index inversé indexe déjà ces noms : `typeerror` = 44 leçons, `valueerror` = 21, `nullpointerexception` = 19. Le point d'entrée existe. Ce qui manque n'est pas l'accès à la matière, c'est la **réponse directe** (ce que la machine essaie de dire, 3 causes typiques, la correction, le lien vers la leçon) au lieu de 44 leçons à ouvrir. C'est un raccourci vers de l'existant, pas une brique manquante.

**Effort.** Un fichier de 150 à 250 messages (Python, JavaScript, Java, C/C++, Rust, SQL, shell) plus une page reprenant le gabarit de `pages/reference.html`. Suppose 1.6 fait, sinon la palette Ctrl+K ne le trouvera pas.

---

### 2.6 Un bac à sable Git interactif

**Constat.** Le cours git compte 24 leçons ; les commandes y sont omniprésentes (`git log` 142 fois, `git commit` 137, `git merge` 105, `git rebase` 44, `git reset` 43, `git cherry-pick` 46, `git bisect` 54) et illustrées par **70 `<figure class="diagram">` SVG écrits à la main — tous statiques**. Côté JS, rien : aucun fichier de `js/` ne modélise un graphe de commits ; les seules occurrences de `HEAD` sont trois lignes de table dans `reference-data.js:144-147`.

**Ce que ça apporte.** C'est le cas le plus favorable qui soit à la contrainte fondatrice : on ne simule aucun système de fichiers, on n'exécute aucun binaire — un graphe orienté en mémoire, quelques transitions (commit, branch, checkout, merge, rebase, reset, cherry-pick, revert), un rendu SVG. Le site sait déjà exactement faire ça (`carte.js` dessine le graphe des 83 cours, `structures.js` rend un ABR manipulable, `visualisations.js` rejoue une liste d'étapes). `rebase` et `reset --hard` cessent d'être des incantations.

**Effort.** Comparable à `structures.js` — quelques centaines de lignes, aucun générateur, aucune chaîne de build.

---

### 2.7 Un diagnostic d'entrée (une journée)

**Constat.** `grep « test de niveau / diagnostic / positionnement / que sais-tu »` sur `pages/` + `index.html` : 0 page d'outil. Les 25 `tracks` (`data.js:5599`) sont `{ id, title, glyph, tagline, courses }` — une liste ordonnée, zéro évaluation. 67 des 83 `cours.html` énoncent un prérequis **en prose** dans un `callout--note` ; `data.js` n'a aucun champ prérequis. Et il n'existe aucun pré-test à l'entrée d'un cours : `grep -rl quiz-bilan pages/*/cours.html` = 0, les 87 QCM bilan sont dans des fichiers de **leçon**.

**Pourquoi c'est moyen et non fort.** Le contournement existe et coûte zéro : `cours.html` liste tous les modules avec leur `level`, chaque leçon est cliquable — celui qui connaît la moitié de JavaScript peut ouvrir le module 5. Le diagnostic **automatise** ce choix, il ne le rend pas possible.

**Effort.** Une journée, sans écrire un mot de contenu : tirer 10 questions dans `QUIZ_BANK` filtré par cours, remonter chaque erreur vers son module via `f` → `data.content[id].modules[].lessons[].file`, proposer le premier module non maîtrisé. Le point délicat est le **seuil** : déclarer un module acquis sur une ou deux questions est un faux service.

---

## Rang 3 — Chantiers (plusieurs sessions)

### 3.1 Un cours d'apprentissage profond — le seul trou qui coupe une progression en deux

**Constat, le mieux étayé du volet catalogue.** Sur 1552 leçons : « descente de gradient » **0** fichier, « perceptron » **0**, « rétropropagation/backpropagation » **0**, « MNIST » **0**. « neurone » n'existe que dans 6 fichiers, tous en mention incidente. PyTorch/TensorFlow/Keras : 3 fichiers, tous dans `python`, en simple citation d'écosystème.

Le parcours `ia` enchaîne python → pandas → stats → ml → llm. `ml` s'arrête à M04/10 « Arbres de décision & forêts aléatoires » et M04/11 « Pipelines & hyperparamètres ». `llm` démarre à M01/01 « Comment marche un LLM » — 1864 mots, **aucune mention de neurone**, et aucune de ses 12 leçons ne contient le mot. Mieux : `pages/ml/lecon-01.html` écrit noir sur blanc que « l'apprentissage profond (réseaux de neurones) en est une sous-branche […] des modèles plus simples — ceux de ce cours — sont souvent aussi bons ». **Le site déclare lui-même le sujet hors périmètre, et personne ne l'a repris.**

**Ce que ça apporte.** Un apprenant qui suit le parcours `ia` jusqu'au bout ne saura ni ce qu'est un neurone, un poids, une couche, une fonction de perte, ni pourquoi un LLM « apprend ». Il passe des arbres de décision aux transformers sans le pont. Un cours neurone → couche → descente de gradient → rétropropagation → surapprentissage → CNN/embeddings rend enfin lisible `llm/lecon-01`. Et il donne au fil rouge `ia` la vraie étape intermédiaire qui lui manque entre « entraîner une forêt aléatoire » et « appeler une API de LLM » (voir 2.3) — **il répare deux choses d'un coup**.

**Contrainte respectée.** `ml` n'exécute rien non plus : la pédagogie passe par du Python affiché, plus un perceptron jouable en JS dans le playground existant.

**Effort.** ~11-13 leçons au standard du site (data.js courses/content/durations, cours.html, prose + blocs code + `data-quiz` + `data-exos` + glossaire + récap + capstone par leçon), accent CSS, catalogue, régénération des index, les 4 vérificateurs. Ordre de grandeur du chantier « 4 cours modernes » de `NOUVEAUX-COURS.md`.

---

### 3.2 Un cours de compilation — un fil rouge promet ce cours qui n'existe pas

**Constat.** `js/fil-rouge-systeme-data.js` s'intitule « Construis ton propre langage de programmation » et exige, dès l'étape 1, un lexer + un parser + un AST + un évaluateur récursif ; à l'étape 2, une « table des symboles » et un « parsing par priorité d'opérateurs (descente récursive ou shunting-yard) ». **Aucun des cours qu'il mappe** (python, algo, c, rust, zig, asm) n'enseigne cela. BNF/EBNF : **0** fichier. SSA : 0. « table des symboles » : 1 (lisp). « allocation de registres » : 1 (asm). Sur 1552 leçons, exactement **deux** traitent le sujet, et de biais : `haskell/lecon-16` (combinateurs d'analyseurs, au service d'Applicative/Alternative) et `ocaml/lecon-13` (interpréteur, projet de fin de cours).

**Réserve du filtre, à intégrer au cadrage.** La moitié *arrière* de la chaîne existe déjà côté asm : `pages/asm/lecon-12.html` « De la source à l'exécutable » (préprocesseur → compilation → assemblage → édition de liens, symboles et relocations) et `pages/asm/lecon-13.html` « Ce que fait l'optimiseur » (pliage de constantes, déroulage, vectorisation). Le trou porte sur la partie **avant** : lexer → parseur → AST → typage → génération de code.

**Ce que ça apporte.** C'est le sujet qui relie une dizaine de cours déjà écrits et leur donne rétrospectivement un sens : pourquoi un AST (algo/arbres), pourquoi une pile, pourquoi le bytecode (java, python, lua, wasm), pourquoi les registres (asm), pourquoi l'inférence de types (ocaml, fsharp, typescript). Tout se fait en JavaScript pur, donc exécutable dans le playground existant.

**Effort.** ~12-14 leçons. Aucun outillage à ajouter, mais le contenu est plus long à rédiger (chaque leçon empile du code sur la précédente).

---

### 3.3 Les chantiers de contenu à décider séparément

- **Corriger le biais de longueur** sur ~5235 questions (voir 1.4). Cours par cours, en commençant par html/css/python/javascript.
- **Combler les 25 cours sans « Piège fréquent »** (voir 1.3), à faire *avec* l'index, pas après.
- **Un module « Consensus & horloges » dans `archi`, pas un cours.** Le trou est réel mais l'inventaire l'a surestimé d'un facteur 2 à 3 : Raft 0, Paxos 0, « horloge logique / vector clock / Lamport » 0, « consensus » 1 fichier. En revanche `nosql/lecon-10` enseigne déjà le quorum sans le nommer (« attendre la majorité », read/write concern, cohérence forte vs éventuelle, causale), `nosql/lecon-09` couvre réplication + partitionnement, l'idempotence est dans 20+ fichiers, les pannes byzantines et le chaos engineering sont dans `os/lecon-13`. Sur 7 chapitres proposés, 4 à 5 existent. **Reste : consensus, élection de leader, horloges logiques, linéarisabilité — 3 à 4 leçons.** Symptôme qui justifie quand même de le faire : `archi/lecon-12` s'appelle « Projet : concevoir un système distribué de bout en bout ».
- **Trace d'exécution pas à pas** (type Python Tutor). Absence confirmée (aucun `data-trace` nulle part) et vrai levier sur Python/Java/C/Rust où l'exécution restera hors de portée. Mais deux réserves : générer les traces suppose ces interpréteurs sur la machine de l'auteur, alors que tout `tools/` est en node ; et les 432 blocs python « simples » seraient exécutables en direct si 2.2 aboutit sur Python. **À ne pas engager avant d'avoir tranché la question de l'exécution.**
- **Approches comparées.** 4463 « Voir une solution », 1 seule « Autre approche ». J'ai compté les `<details>` contenant 2 blocs de code ou plus : 59 sur 4463 (1,3 %), et ce sont des solutions découpées en fichiers, pas deux approches. Chantier de contenu sur 4463 exercices = souhait éditorial. **Bornable aux 23 défis** (voir 1.6, qui n'ont même pas d'indice) et aux capstones.
- **Fusion à l'import.** `progression.js:611-651` écrase (« Importer remplacera ta progression actuelle » — c'est honnête, pas un bug). Depuis le retrait délibéré de `js/sync.js`, l'export/import **est** le seul pont entre deux machines : qui avance des deux côtés doit choisir quelle moitié perdre. La fusion serait déterministe sur les formats existants (union des booléens, max au ratio pour les QCM — logique déjà écrite en `progression.js:56-73` et `lecon.js:139-155`, plus récent pour `syntaxe-last`). Un troisième bouton, une demi-journée.

---

## Rang 4 — Réels mais faibles, à ne faire qu'en passant

- **Étiquetage des blocs de code.** ~40 cas indéfendables sur 11 859 blocs (0,3 %), pas « un sur cinq » : `package.json` en `language-javascript` dans `nodejs/lecon-02:171` et `nodejs/lecon-03:122, 163, 199, 229` — **dans la leçon qui apprend justement à lire un package.json**. Correction triviale : `prism-json.min.js`, `prism-toml.min.js` et `prism-yaml.min.js` sont **déjà dans `assets/vendor/prism/`** ; `nodejs/lecon-03` ne charge simplement pas la bonne grammaire (l. 417-420). Un détecteur exigerait une table d'exceptions curatée (`.pl` = Prolog, `nasm`, `.h` = Objective-C, `language-regex` délibéré) sans laquelle il crie 308 fois au lieu de 40 et sera désactivé dans la semaine.
- **SQL : dialecte et mots réservés.** 354 blocs jamais tokenisés, aucun outil ne les couvre — mais **zéro défaut vivant** : les deux fautes historiques sont corrigées (`data-eng/lecon-03:267` écrit `CAST("end" AS TIMESTAMP)` avec l'encadré l. 280 ; `bdd/cours.html:83` annonce PostgreSQL). Un seul cas discutable : `QUALIFY` (`data-eng/lecon-03:276`) n'existe pas dans PostgreSQL et la leçon ne le signale pas — mais `data-eng` ne déclare aucun moteur de référence. Le détecteur naïf sort **36 faux positifs sur 36** ; il faut un vrai tokeniseur. Une journée pour zéro correction à faire.
- **« Imprimer un cours entier » inerte en `file://`.** Le fait est exact (`imprimer.js:81-87`), mais **il n'y a aucun lien mort** : `cours.js:541-559` fait `if (!httpOk) return;` avec un commentaire expliquant pourquoi — c'est une décision prise et datée, même patron que la PWA et Pyodide. Les routes papier existantes couvrent l'essentiel (bouton par leçon, antisèche, bilan, certificat, 2 blocs `@media print` soignés). Et le coût est sous-estimé : sérialiser les `.prose` ajouterait ~30 Mo à un `js/` déjà à 21 Mo, à régénérer à chaque retouche.
- **Aucun `<noscript>`.** 1 seul fichier sur 1890, et c'est du contenu de cours. `catalogue.html` = 7116 octets, 0 carte ; `glossaire.html` = 4622 octets, 0 `<dt>`. Mais aucun navigateur ne désactive JS en `file://` par défaut, `index.html` reste informatif (34 Ko statiques) et les 1552 leçons sont entièrement statiques. Trois lignes de courtoisie.
- **`donnees-perso.html` accessible depuis 1 seul lien** (`index.html:552`, footer). Correction d'un lien — mais l'argument « c'est le seul filet de sécurité » est faux : l'export/import réel est sur `progression.html`, liée depuis 62 fichiers et présente dans la nav. `donnees-perso` n'ajoute que le détail par clé et l'effacement sélectif.
- **La banque de défis (23, tous en JavaScript)** est maigre au regard de 83 cours — mais ce n'est pas « le point le plus maigre du site » : les 1463 leçons ont toutes un bloc `data-exos`, plus `devine.html` (43 extraits), l'examen (5627 questions), 10 678 flashcards, les QCM par leçon et les QCM bilan. Une journée par tranche de ~25 défis, sans outillage nouveau.

---

## Ce qui a été écarté parce que ça existe déjà

Cette section est la plus utile à conserver : elle évite de reposer la question dans six mois.

**Rejeté après vérification — la fonctionnalité existe :**

- **Cryptographie « une seule leçon ».** Faux. Trois leçons plus des renvois : `securite/lecon-05` (hachage, bcrypt/Argon2, sel, sessions, 2FA), `securite/lecon-07` (HTTPS/TLS, certificat, HSTS, CORS), `securite/lecon-08` « Cryptographie appliquée » (2132 mots : hachage / chiffrement / signature). Plus `git/lecon-09, 16, 18` (clés, signature de commits, Ed25519), `algo/lecon-22` (RSA), `js/lecon-60` (Web Crypto), les 17 leçons de solidity. Sur 8 chapitres proposés, 6 sont couverts. Ne restent que l'échange de clés (Diffie : 0) et les courbes elliptiques. Et `lecon-08` pose une position éditoriale explicite — « ne réinvente pas la crypto » — qu'un cours de crypto théorique contredirait.
- **Sécurité offensive.** L'affirmation « aucune méthode d'attaque structurée » est démentie par `securite/lecon-14` : « Avant tout : le cadre » (cadrage légal), « La démarche d'audit en cinq étapes » (Cadrer / Cartographier / Tester par catégorie / Prioriser / Rapporter), « Cartographier la surface d'attaque », checklist, étude de cas, rédaction du rapport, divulgation responsable. **C'est mot pour mot le plan qui était proposé.** Plus STRIDE en `lecon-13`. Ne manque que l'outillage terrain (nmap/Burp/Metasploit : 1 fichier) — précisément la partie que `file://` interdit de rendre pratique.
- **Badge de compatibilité type Baseline.** Ni absent ni décidable : 7 leçons mentionnent déjà Baseline, une leçon CSS **enseigne la notion** (« Baseline Widely available », mise en garde contre l'adoption sans repli, `@supports`), 46 fichiers portent un marqueur de version. Le systématiser est un choix éditorial : sur un site hors ligne, une donnée de compatibilité périme en silence et désinforme.

**Vérifié présent, donc jamais reproposé** (les auditeurs ont failli les écrire ; les chiffres sont là pour couper court) :

Accessibilité avancée (`a11y`, 15 leçons, 7 modules, jusqu'aux widgets ARIA et lecteurs d'écran) · OS en profondeur (14 leçons, IPC, noyau, virtualisation, temps réel) · réseaux (11 leçons + `http` 12 + VPC) · IA générative appliquée (`llm`, 12 leçons : prompt, tool use, RAG, agents, évaluation, injections) · jeux vidéo (fil rouge `arcade` 6 étapes + module LÖVE de `lua` + `morpion` + `projets-js`) · frameworks back (Django 13 fichiers de `python`, Rails 12 de `ruby`, Laravel 8 de `php`, Spring 3 de `java` — le site est organisé par langage, pas par framework) · outillage front (npm 87 fichiers, Vite 30, ESLint 18, Prettier 26) · agile et gestion de projet (`equipe`, 14 leçons : revue, commits, MR, doc, estimation, dette, incident, post-mortem — le reste est du management) · entretien technique (`algo` tagué « Entretiens », module M05 « Patterns d'entretien »).

Export/import (`progression.js:574-655` : versionné, validé, confirmé, filtré au préfixe `syntaxe-`, préférences d'affichage exclues) · feuille d'impression (2 blocs `@media print`, 25 sélecteurs masqués, palette claire forcée) · bouton Imprimer par leçon (`lecon.js:971-983`) · palette Ctrl+K sur les 1463 leçons avec index inversé chargé paresseusement · indices progressifs à 2, 5, 8 essais + lien « Revoir » à 10 (`lecon.js:707-900`) · gradation Échauffement/Application/Défi (1459/1425/1360) · `div.lesson-check` « Vérifie ta compréhension » · Leitner 5 boîtes · examen chronométré filtrable avec correction détaillée · 25 parcours + 18 fils rouges + `carte.html` (graphe SVG des 83 cours, encre calculée sur la luminance de l'accent) · `reference.html` (8 tables) + glossaire 10 678 termes · 1487 antisèches · `projets.html` (brief + critères cochables par cours) + capstone guidé · `visualisations.js` (5 tris + recherche binaire) + `structures.js` + `expression.js` + `arbre-dom.js` · `devine.html` (43 extraits, 12 langages) · `mes-qcm.html` · `bilan.html` + `certificat.html` · XP, niveaux, séries, heatmap 13 semaines, objectif quotidien, 6 badges, Pomodoro · `donnees-perso.js` (taille par clé, 18 libellés, effacement sélectif) · bloc « Reprendre » qui vérifie que la leçon existe toujours (avec le commentaire « le mensonge Reprendre : Zig ») · I17 (doublons de QCM, Jaccard sur la bonne réponse, double palier) · I18 (péremption des index) · redondance de prose intra-cours · `verif-rendu.js` (contraste WCAG, focus, ARIA, console, zéro requête réseau).

**Écarté par la contrainte fondatrice, pas par oubli :** Pyodide et sql.js par CDN (`runner.js` désactive le bouton *avant* le clic) · `js/sync.js` retiré délibérément (aucun backend) · vérification des liens externes (39 URL distinctes seulement, dont ~20 volontairement fictives ; et `verif-rendu.js` **coupe** le réseau par `--host-resolver-rules`) · fraîcheur des versions citées (une table figée dans l'outil périmerait elle-même) · mentorat, solutions de la communauté, forums, vidéos, exécution serveur.

**Faux positifs à ne pas rouvrir :** les 15 `callout--warning` et 7 `callout--attention` **sont** stylés (`css/components.css:1244-1256`, même bordure, même fond) · 29 « liens morts » qui sont tous des exemples pédagogiques de prose (`x.html`, `#section`) · 296 termes de glossaire « redéfinis » qui sont presque tous légitimes (« index » = position puis étiquettes pandas ; « break » = switch puis boucle) · 106 blocs JSON dont **un seul** est invalide, et la leçon l'étiquette elle-même « INVALIDE ».

---

## Si vous ne deviez faire qu'un chantier

**Le cahier d'erreurs (1.2), élargi au filtre « leçons terminées » de l'examen.** Une journée, peut-être une et demie avec le grain fin.

Trois raisons, dans l'ordre :

1. **C'est le seul manque que trois angles indépendants ont trouvé séparément**, et le seul que le filtre sceptique a cherché à démolir sans y parvenir — il n'a produit que des précisions qui le renforcent.

2. **Rien n'est à écrire, tout est à câbler.** Les 5627 questions existent avec leurs explications *et* leur champ `f`. `syntaxe-quiz` collecte déjà. `revision.js` est un Leitner éprouvé. `progression.html` a la place. Les trois briques ne se sont jamais parlé. C'est le seul chantier de la liste dont le coût est presque entièrement du raccordement.

3. **Il fait basculer le site d'« enregistre » à « enseigne ».** Aujourd'hui, l'apprenant a la carte de ses lacunes dans son propre navigateur et aucune page ne la lui montre ; il passe un examen dont il ne reste rien ; et s'il n'a fait que 10 leçons sur 65, il reçoit ~85 % de questions sur du contenu jamais ouvert, un 6/20, et un « À retravailler — courage ! ». Ce n'est pas neutre : c'est décourageant. La case à cocher qui corrige ça tient en une ligne et demie.

**Si vous en prenez un second, prenez 1.1 (`safeSet`)** — quelques heures, et sans lui tout ce que 1.2 enregistre peut disparaître en silence.

**Et si vous cherchez un chantier de contenu**, c'est **3.1, l'apprentissage profond** : c'est le seul trou du catalogue qui *coupe une progression déclarée en deux*, et il répare simultanément le fil rouge `ia` qui se termine aujourd'hui sur GraphQL. Mais c'est plusieurs sessions, et il ne rend rien aux 1463 leçons déjà écrites — contrairement aux six premiers points de cette note.