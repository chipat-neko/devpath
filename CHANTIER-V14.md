# Chantier V14 — faire écrire du code, et le corriger

Plan de travail de l'autonomie. **Source de vérité : ce fichier.** Chaque réveil lit ce plan,
prend la **première case non cochée**, la traite entièrement, la coche avec un compte rendu chiffré,
puis passe à la suivante. Le chantier est fini quand il ne reste aucune case `- [ ]`.

**À traiter APRÈS `CHANTIER-V13.md`**, qui doit être entièrement coché.

---

## Le constat qui fonde ce chantier

Le site enseigne remarquablement. Il fait **peu pratiquer**, et le chiffre est net :

| | |
|---|---:|
| Exercices `type:code`, corrigés **en exécutant** ce que l'apprenant écrit | **105** |
| Exercices `type:text`, corrigés en comparant à un mot-clé attendu | **4 136** |
| Part réellement auto-corrigée | **2,5 %** |

Et ces 105 exercices sont concentrés sur **trois cours** : `js` (45), `algo` (38), `projets-js` (21).
Les 80 autres cours n'en ont aucun.

La cause est technique, pas éditoriale. `js/runner.js` le dit lui-même :

> JS et HTML fonctionnent en `file://`. **Pyodide (Python) et sql.js (SQL) se chargent depuis un CDN
> et exigent le protocole HTTP** : en `file://` — le mode fondateur du site — l'exécution échoue
> toujours. On le SIGNALE donc AVANT le clic (bouton « Serveur requis » désactivé).

C'est honnête, et c'est bien fait. Mais cela veut dire que **sur un site qui enseigne 75 langages,
un seul est réellement exécutable**. Ce chantier s'attaque à cette limite, puis en tire les
conséquences pédagogiques.

---

## Règles permanentes

- **Un point à la fois**, mené jusqu'à la mesure.
- **Mesurer avant de promettre** : chaque moteur embarqué doit être **prouvé fonctionnel en `file://`**, hors réseau, avant qu'on écrive un seul exercice qui en dépend. Chrome avec `--host-resolver-rules="MAP * ~NOTFOUND"` est la preuve.
- **Un commit par point**, avec la mesure dans le message.
- `node tools/verif.js --rapide` vert ; `verif-exemples.js` et `verif-rendu.js` selon ce qui est touché.
- **Contrainte fondatrice** : 100 % `file://`, aucun serveur, aucun module ES, aucun build, **aucune dépendance installée**. Un moteur embarqué est un fichier du dépôt, pas un paquet.
- **⚠️ LE POIDS EST UN CRITÈRE, PAS UN DÉTAIL.** Le dépôt fait aujourd'hui ~35 Mo. Un moteur de 10 Mo le change de nature. Mesurer, dire le chiffre, et décider en connaissance de cause.
- **INTERDIT** : réintroduire une URL vers `cdnjs.cloudflare.com`, `fonts.googleapis.com`, `fonts.gstatic.com`. Un moteur embarqué se charge depuis `assets/vendor/`, jamais depuis le réseau.
- **En cas de doute réel : ne force pas.** Laisse la case décochée et écris ce qui bloque.

---

## PHASE A — Rendre l'exécution locale

L'ordre compte : SQL d'abord parce qu'il est petit et que le besoin est massif (354 blocs et
21 cours concernés), Python ensuite parce qu'il est lourd et que la décision mérite d'être posée.

- [x] **A1 · Mesurer avant de choisir.** ✅ **2026-08-26.** Outil neuf `tools/mesure-executable.js` (rejouable, sans dépendance : il applique la règle `BROWSER_ONLY` de `runner.js` et la règle « pas de champ `run` → pas d'exécution » de `lecon.js`). **1 612 fichiers de leçon lus, 12 723 blocs de code, 92 dossiers de cours.**

  **Le cadrage de ce chantier était périmé sur trois chiffres, et faux sur un quatrième.**

  | | annoncé en tête de plan | **mesuré le 2026-08-26** |
  |---|---:|---:|
  | Exercices corrigés en exécutant | 105 | **211** |
  | Part réellement auto-corrigée | 2,5 % | **4,77 %** (211 / 4 422) |
  | Cours ayant au moins un exercice exécuté | 3 | **9** (js 45, algo 38, offensive 26, compilation 24, distribue 22, crypto 22, projets-js 21, neurones 12, formats 1) |
  | Cours concernés par SQL | « 21 cours » | **4** (`sql` 255 blocs, `bdd` 73, `data-eng` 24, `securite` 1) |

  V13 avait déjà doublé la part auto-corrigée sans que personne ne le note. Le « 21 cours » de SQL était une intuition : les 353 blocs `language-sql` tiennent dans 4 cours, pas 21.

  **Blocs exécutables aujourd'hui : 2 458 / 12 723 = 19,3 %** (JavaScript 1 773, aperçu HTML 685). **403 blocs JavaScript sont privés de bouton par le garde-fou `BROWSER_ONLY`** — cohérent avec la borne haute de 98 faux positifs relevée en V13, l'écart étant les blocs légitimement non exécutables (Node, DOM).

  **Ce que chaque moteur rendrait exécutable** (un exercice est rattaché au langage dominant de son cours) :

  | moteur | cours | blocs | exercices encore corrigés par mot-clé |
  |---|---:|---:|---:|
  | **worker JS — déjà en place** | 13 | 2 498 | **629** |
  | **aperçu HTML — déjà en place** | 6 | 1 151 | **444** |
  | Python — à trancher en A4 | 6 | 1 042 | 346 |
  | sql.js — à embarquer | 2 | 381 | 116 |
  | aucun moteur possible → prédiction (A5) | 65 | 7 651 | 2 676 |

  **Le résultat qui décide de l'ordre du reste : 1 073 exercices sont convertibles sans embarquer un seul octet**, avec les deux moteurs déjà présents et prouvés en `file://`. C'est **neuf fois** ce que sql.js apporterait (116) et trois fois ce que Pyodide apporterait (346).

  **Poids** — le dépôt ne fait plus 35 Mo : **77,9 Mo** de contenu réel sur 2 288 fichiers suivis (V12 et V13 l'ont doublé). Dont **13,4 Mo (17 %) pour les seuls six index dérivés** (`search-index` 3,93 Mo, `quiz-index` 3,15, `flashcards-data` 3,11, `antiseches-data` 1,51, `pieges-data` 0,93, `search-lite` 0,75).

  | moteur | fichiers strictement nécessaires | tel quel | **en base64** (imposé par `file://`) | part du dépôt |
  |---|---|---:|---:|---:|
  | **sql.js 1.14.2** | `sql-wasm.js` 45 Ko + `sql-wasm.wasm` 643 Ko | 688 Ko | **~903 Ko** | **+1,2 %** |
  | **Pyodide 0.26.2** | `pyodide.asm.wasm` 9,62 Mo + `python_stdlib.zip` 2,23 + `pyodide.asm.js` 1,17 + lock 0,10 | 13,14 Mo | **~17,5 Mo** | **+22,5 %** |

  sql.js est indolore, Pyodide change le dépôt de nature — A4 tranchera avec ces chiffres.

  **Constat neuf, que rien ne surveillait : 89 leçons n'ont AUCUN exercice.** Les quatre dossiers de niveau avancé sont entièrement dépourvus de bloc `data-exos` : `js-avance` 23, `html-avance` 22, `css-avance` 22, `python-avance` 22. Ce sont les leçons les plus difficiles du site, et ce sont les seules où l'apprenant n'a rien à faire. Aucun invariant de `verif-donnees.js` ne le détecte.

  **Piège de mesure rencontré, et pourquoi l'outil existe** : une contre-mesure au `grep` donnait 209 exercices exécutés contre 211 pour l'outil. L'outil avait raison — deux entrées de `pages/compilation/lecon-13.html` sont écrites en JSON indenté (`"type": "code"` avec espaces), invisibles pour un motif collé. **Compter du JSON au `grep` sous-estime en silence.**

  **Recommandation d'ordre pour la suite** : A2 reste en tête parce que c'est une mesure de faisabilité peu coûteuse (sql.js se charge-t-il vraiment en `file://` ?), mais **en phase B, B3 et B4 passent avant B1 et B2** : ils portent 1 073 des 1 535 exercices convertibles, ne dépendent d'aucun préalable, et n'ajoutent aucun octet.

- [x] **A2 · SQL en local.** ✅ **2026-08-26. Ça marche, et c'est prouvé dans les conditions de l'apprenant.**

  **Verdict mesuré : SQLite 3.49.1 s'exécute en `file://`, sans serveur, DNS coupé, en 411 ms — 0 requête distante.**

  L'intuition du plan était la bonne : `fetch()` vers un `.wasm` local est refusé par Chrome (origine opaque), le binaire doit être porté **dans** un script. Emscripten honore une option `wasmBinary` : quand on lui donne le binaire déjà en mémoire, il n'émet plus une seule requête.

  Livré dans `assets/vendor/sqljs/` — **909,4 Ko, soit +1,14 %** sur un dépôt de 77,90 Mo :

  | fichier | rôle | poids |
  |---|---|---:|
  | `sql-wasm.js` | module Emscripten de sql.js 1.14.2 (MIT), tel quel | 45,4 Ko |
  | `sql-wasm-base64.js` | le `.wasm` (658 410 octets) encodé en base64, **+33,4 %** | 858,0 Ko |
  | `sql-charge.js` | adaptateur maison : décode, contrôle le nombre magique, initialise | 3,3 Ko |
  | `LICENSE` + `README.md` | provenance et piège documenté | 2,7 Ko |

  **Outil neuf `tools/preuve-hors-reseau.js`, et c'est lui qui fait la valeur du point.** Une démonstration qui « marche » ne prouve rien si elle triche sur les conditions. Il ouvre la page en `file://`, **sans `--allow-file-access-from-files`** — le drapeau qu'emploie `tools/verif-clic.js`, et qui aurait rendu la preuve fausse puisque aucun apprenant n'ouvre son navigateur avec —, **avec `--host-resolver-rules="MAP * ~NOTFOUND"`**, et il lit le **journal réseau de Chrome** pour compter les requêtes sortantes. Preuve rejouable : `node tools/preuve-hors-reseau.js tools/preuves/sqljs.html`.

  Mesuré par cette page : `CREATE TABLE` + `INSERT`, `SELECT … WHERE … ORDER BY` (3 lignes justes), `COUNT(*)` = 4, `AVG(note)` = 16.25, `sqlite_version()` = 3.49.1, et une erreur SQL qui remonte proprement (`no such table: table_absente` — c'est ce que verra l'apprenant qui se trompe). **4 requêtes au total, toutes en `file:`, 0 distante.**

  **⚠️ Le piège qui a coûté deux essais, et qui vaut d'être retenu : `locateFile` est appelé (avec « sql-wasm.wasm ») MÊME quand `wasmBinary` est fourni.** Emscripten calcule le chemin avant de constater qu'il n'en a pas besoin — puis n'émet aucune requête. Un premier jet y levait une exception « pour détecter une régression vers le réseau » : Emscripten l'avale, **la promesse ne se résout jamais, et pas un message n'apparaît** — ni `onerror`, ni `unhandledrejection`, ni `console.error`. Le garde-fou fabriquait la panne qu'il prétendait surveiller. C'est le diagnostic pas-à-pas, pas la lecture du code, qui l'a montré. La preuve « aucun octet ne part » se fait donc au journal réseau, pas par un piège dans le code.

  Contrôles : `sql-wasm.js` ne contient **aucune** URL de CDN (son unique `https://` est un lien de commentaire vers un ticket GitHub, inerte) et **n'est pas un module ES** (0 `export`/`import`), donc compatible avec la contrainte fondatrice. `node tools/build-sqljs.js` régénère le base64 et, sans argument, contrôle son intégrité (658 410 octets redécodés, `\0asm` présent). `verif-html` 0/0, `verif-donnees` 0 erreur.

- [x] **A3 · Le bouton « Tester » pour SQL.** ✅ **2026-08-26. L'apprenant écrit une requête, la lance, et voit un tableau de résultats — en `file://`, sans réseau.**

  Toute la mécanique SQL existait déjà dans `runner.js` (`activateSql`, `runSql`, rendu en tableau) : elle était simplement branchée sur un CDN et neutralisée par la garde `HTTP_OK`. Trois changements ont suffi — puis la vraie difficulté est apparue ailleurs.

  1. **Le Worker charge le moteur depuis le dépôt.** Mesuré : un Worker issu d'un `Blob` **peut** `importScripts()` une URL `file://` **absolue**, sans drapeau permissif. Absolue est le mot : un Worker-Blob n'a aucune base pour résoudre un chemin relatif, et les leçons vivent à des profondeurs différentes. La racine est déduite de `document.currentScript.src`.
  2. **La garde `HTTP_OK` est levée pour SQL** (Python la garde). Plus de bouton « Serveur requis » sur les blocs SQL.
  3. **Le message d'échec, devenu faux, a été réécrit** : il conseillait de lancer `python -m http.server`, alors que le moteur est désormais dans le dépôt.

  **⚠️ Piège d'encodage qui a coûté un essai : `self`, jamais `window`.** Le fichier base64 assignait à `window.SQL_WASM_BASE64` ; dans un Worker, `window` n'existe pas, la `ReferenceError` est rapportée par `importScripts` comme un banal *« failed to load »* qui n'oriente vers rien. Corrigé dans `tools/build-sqljs.js` et documenté en tête du fichier généré.

  **La vraie difficulté : la base de démonstration ne correspondait pas aux leçons.** Écrite dans `runner.js` sans jamais avoir pu être confrontée à quoi que ce soit — SQL ne s'exécutait nulle part — elle déclarait `produits(id, **libelle**, prix, categorie)` quand les leçons écrivent partout `SELECT **nom** FROM produits`. D'où l'**outil neuf `tools/verif-sql.js`**, qui exécute les blocs SQL du site avec le **même moteur et le même jeu de données que le navigateur** (il lit `SEED_SQL` et le filtre de dialecte directement dans `runner.js`, pour qu'un écart soit impossible).

  | étape | blocs aboutis |
  |---|---:|
  | départ | 133 / 345 — **38,6 %** |
  | après ajout de `produits.nom` (et `stock`) | 153 / 345 — 44,3 % |
  | après ajout de 8 tables réellement interrogées | 170 / 345 — 49,3 % |
  | après le filtre de dialecte | **172 / 288 — 59,7 %** (57 blocs écartés) |

  Les 8 tables ajoutées sont celles que les leçons citent le plus et qu'aucun bloc ne pouvait trouver, « no such table » étant la première cause d'échec (77 blocs) : le fil rouge « Rideau » du cours `bdd` (`spectacle`, `representation`, `client`, `place`, `commande`, `billet`) plus `employes`, `comptes` et `ventes`. **`libelle` a été CONSERVÉ à côté de `nom`** : 26 blocs l'emploient, et le supprimer aurait cassé ce qui marchait.

  **Le filtre de dialecte, et le motif trop large qu'il a fallu écarter.** Le moteur est SQLite ; beaucoup de blocs enseignent PostgreSQL, MySQL ou SQL Server. Leur poser un bouton ne rend qu'un « near "FOR": syntax error » — **pire que pas de bouton du tout**. Un motif (`$$`, `MATERIALIZED VIEW`, `FOR UPDATE`, `GROUPING SETS`, `MERGE INTO`, `ISOLATION LEVEL`, `SERIAL`, `AUTO_INCREMENT`, `::`…) écarte **57 blocs : 55 échouaient bel et bien, 2 seulement marchaient** — et ces 2 sont explicitement intitulés « Version PostgreSQL ». Deux candidats ont été **retirés après mesure** : `/@\w/`, censé viser les variables SQL Server, attrapait **toutes les adresses e-mail** des chaînes d'exemple (4 faux positifs à lui seul) ; et `NULLS FIRST/LAST` comme `RETURNING` sont en réalité gérés par SQLite. La règle « un motif trop large casse ce qui était juste » s'est vérifiée au premier jet.

  **Une piste explorée puis abandonnée, mesure à l'appui.** Rejouer les blocs SQL précédents de la page avant celui qu'on lance — pour qu'un `SELECT` retrouve la table créée plus haut — donnait **exactement le même résultat** (5 blocs aboutis sur 41 dans le navigateur) pour un mécanisme bien plus fragile. Une leçon n'est pas un carnet linéaire : elle enchaîne des schémas concurrents et des violations de contraintes démontrées exprès, que rejouer met en collision (« table client already exists »).

  **Preuve dans le navigateur** — `tools/preuves/sql-lecon.js` clique pour de vrai sur chaque bouton, en `file://`, DNS coupé, sans `--allow-file-access-from-files` : **21 blocs aboutis sur 27** contre **5 sur 41** avant ce point, **0 requête distante**. Le script a lui-même dû être corrigé deux fois — il jugeait « aucune ligne à afficher » comme un échec alors que c'est la réponse normale d'un `CREATE` ou d'un `INSERT`, et il ne dépliait pas les `<details>` où sont rangées les solutions d'exercices, ce qui faisait passer 6 blocs sains pour muets.

  **4 fautes de contenu révélées par l'exécution, dans `pages/sql/lecon-03.html`** — invisibles pour les quatre vérificateurs, puisque aucun n'exécutait : trois blocs interrogeaient `ville` **dans `produits`** (c'est un attribut de `clients`), un quatrième lisait `commandes.client` au lieu de `client_id`. Le tableau de résultats annoncé omettait Nantes. Corrigés, énoncé de l'exercice 3 réaligné, et le second exemple de `DISTINCT` illustre désormais bien mieux son propos — **4 lignes puis 6** : ajouter une colonne fait réapparaître les villes. La leçon passe de 9/14 à **14/14**.

  `verif-html` 0/0 sur 1 612 fichiers, `verif-donnees` 0 erreur sur 25 invariants, 0 URL de CDN dans `runner.js`, 0 BOM.

- [x] **A4 · Python : décider, pas bricoler.** ✅ **2026-08-26. Décision : (a), embarquer — mais à 8,27 Mo et non 17,5, et le poids annoncé au plan était le mauvais chiffre.**

  **Verdict mesuré : CPython 3.12.1 démarre en 799 ms en `file://`, DNS coupé, 0 requête distante.**

  **1. Ce que le site demande vraiment à Python.** Outil neuf `tools/mesure-python.js` (sans dépendance, rejouable) sur les **997 blocs `language-python` de 11 cours** :

  | | blocs | dont avec `print()` |
  |---|---:|---:|
  | n'important **rien** | 492 | 263 |
  | n'important que la **bibliothèque standard** | 276 | 228 |
  | **→ couverts par Pyodide nu** | **768 (77,0 %)** | **491** |
  | exigeant un **paquet tiers** (pandas 70, sklearn 60, matplotlib 57, numpy 45…) | 229 (23,0 %) | 82 |

  **C'est ce tableau qui tue l'option (b).** Un mini-interpréteur arrêté aux classes, compréhensions, exceptions et générateurs couvrirait **241 blocs à sortie observable — la moitié des 491** que Pyodide donne sans écrire une ligne d'interpréteur. Et il les couvrirait *approximativement* : un « Python » écrit à la main enseignerait ses propres bugs comme s'ils étaient le langage. Sur un site qui vient de trouver 4 exemples faux en exécutant du SQL, fabriquer un moteur qui ment est le contraire du but. **(b) est écarté, sur mesure et non par principe.**

  **2. Le poids annoncé au plan était faux dans les deux sens.** « Environ 10 Mo, un tiers du dépôt » : le dépôt fait 77,9 Mo, pas 30 ; et la distribution complète en base64 fait 17,95 Mo, pas 10. Surtout, **le `.wasm` se gzippe à 3,07 Mo** — la contrainte `file://` impose le base64, pas le stockage brut :

  | | tel quel | base64 brut | **retenu** |
  |---|---:|---:|---:|
  | `pyodide.asm.wasm` | 9,62 Mo | 13,45 Mo | **4,10 Mo** (gzip + base64) |
  | `python_stdlib.zip` | 2,23 Mo | 2,98 Mo | **2,98 Mo** (déjà un zip : gzip ne gagne que 1 %) |
  | `pyodide.asm.js` + `pyodide.js` | 1,19 Mo | — | **1,19 Mo** (scripts classiques) |
  | index des paquets | 0,10 Mo | 0,14 Mo | **0,8 Ko** (vidé, voir plus bas) |
  | **total** | | **17,95 Mo (+23,0 %)** | **8,27 Mo (+10,6 %)** |

  La décompression par `DecompressionStream('gzip')` coûte **35 ms**. **8,7 Mo économisés pour 35 ms** : c'est le chiffre qui a rendu (a) acceptable.

  **3. Trois découvertes techniques, toutes trouvées en exécutant, aucune en lisant le code.**

  - **Le chargeur de Pyodide n'aboutit PAS dans une page, mais aboutit dans un Worker.** Il emploie `await import()` — un module ES, que Chrome refuse en `file://` — quand il tourne dans une page, et `importScripts()` quand il tourne dans un Worker. Premier essai en page : « Failed to fetch dynamically imported module ». Même code dans un Worker : prêt en 793 ms. **Le Worker n'est pas qu'un isolement, c'est ce qui rend Python possible.** (Prolonge le constat d'A2 : un Worker issu d'un Blob peut `importScripts()` une URL `file://` absolue.)
  - **Pyodide n'a pas d'option `wasmBinary`**, contrairement à Emscripten : il n'y a pas de porte officielle pour lui donner un binaire déjà en mémoire. On **détourne `fetch`** dans le Worker (`assets/vendor/pyodide/pyodide-charge.js`) et on rend une `Response` construite en mémoire pour les trois ressources ; toute autre URL retombe sur le `fetch` d'origine, donc une requête inattendue resterait visible au journal réseau.
  - **L'index des paquets est VIDÉ, et c'est un garde-fou, pas une économie.** Le vrai `pyodide-lock.json` déclare **310 paquets** téléchargeables depuis un CDN. Avec `packages: {}`, `loadPackage` ne peut littéralement rien demander. `loadPackagesFromImports` a été retiré de `runner.js` pour la même raison : il serait allé chercher numpy sur le réseau.

  **4. Livré.** `assets/vendor/pyodide/` (Pyodide 0.26.4, MPL-2.0, **8,27 Mo**), `tools/build-pyodide.js` (régénère et, sans argument, contrôle l'intégrité : nombres magiques, tailles annoncées, 0 URL http, 0 module ES), `tools/preuves/pyodide.html` et `tools/preuves/python-lecon.js`. `js/runner.js` : plus aucune garde de protocole, plus aucun bouton « Serveur requis » — **`addOfflineBtn` et `showOffline` supprimés, 37 lignes de code mort**. L'URL de CDN de `pyodide.js` est neutralisée à la copie : **le dépôt reste à 0 URL de CDN**.

  **5. Deux gardes, toutes deux mesurées contre une vérité indépendante.**

  - **Modules non embarqués** : liste blanche des **185 modules réellement importables**, obtenue en EXÉCUTANT `sys.builtin_module_names` + `pkgutil.iter_modules()` dans le moteur — pas en recopiant une liste de mémoire. `tools/mesure-python.js` et `tools/mesure-executable.js` la **lisent** dans `runner.js` au lieu de la dupliquer. ⚠️ **`sqlite3` n'en fait pas partie** : il n'est pas compilé dans ce build, alors qu'une liste écrite de tête l'aurait inclus — 4 blocs concernés.
  - **Ce n'est pas du Python.** En **compilant les 997 blocs** (`compile()` de CPython), **27 (2,7 %) ne sont pas du Python valide** : des commandes de terminal (`$ pytest -q`, `pip install requests`, `python -m venv`), des extraits de `pyproject.toml`, des arborescences de fichiers, un message d'erreur collé tel quel. Un motif les écarte, et **il a été mesuré contre cette vérité : 20 des 27 attrapés, et ZÉRO bloc valide privé de son bouton.** ⚠️ **Le premier jet en avait un** : il cherchait un `$` en début de ligne, or dans une expression régulière `re.VERBOSE` l'ancre `$` est seule sur sa ligne — `python/lecon-41` perdait son bouton. Un prompt de terminal est suivi d'une commande *sur la même ligne* ; c'est ce que le motif exige désormais. **Dette assumée : 7 blocs (0,7 %) gardent un bouton sur du Python invalide** (fragments tronqués de `llm`, pseudo-code Cython) — à traiter en phase B, aucun motif ne les distingue sans faux positif.

  **6. Résultat, mesuré sur le site entier.**

  | | avant A4 | **après** |
  |---|---:|---:|
  | blocs Python avec un bouton « Tester » | **0** | **747 / 997 (74,9 %)** |
  | blocs exécutables du site | 2 458 / 12 723 (19,3 %) | **3 493 / 12 723 (27,5 %)** |
  | langages réellement exécutables en `file://` | 3 (JS, HTML, SQL) | **4** |

  `tools/mesure-executable.js` a été corrigé au passage : sa table des moteurs annonçait encore « CDN — inutilisable en `file://` » pour SQL **et** ne comptait ni SQL ni Python dans les blocs exécutables. Le 19,3 % d'A1 sous-estimait donc déjà de 288 blocs SQL.

  **7. Contrôles.** `node tools/preuves/python-lecon.js` sur 3 leçons réelles : **44 blocs cliqués, 40 sorties obtenues, 0 échec du moteur, 0 requête distante**, premier bloc en 1 574 ms (démarrage compris), les suivants immédiats. Non-régression SQL : 40 blocs cliqués, 27 aboutis, 0 requête distante — identique à A3. `verif-html` 0/0 sur 1 612 fichiers, `verif-donnees` 0 erreur sur 25 invariants, `verif-rendu` 0 erreur / 0 avertissement sur 18 mesures, `build-sqljs` intègre, `build-pyodide` sans écart, 0 URL de CDN dans le dépôt.

  ⚠️ **Relevé hors périmètre : `starter/js/runner.js` charge toujours Pyodide ET sql.js depuis `cdn.jsdelivr.net`** (3 URL). Le kit de démarrage livré à l'apprenant n'a donc aucun des deux moteurs hors ligne. L'y embarquer lui coûterait 9,2 Mo — décision à prendre à part, pas dans cette case.

- [x] **A5 · Ce qui restera non exécutable.** ✅ **2026-08-26. La liste est faite — et la mesure a trouvé bien mieux qu'un inventaire : 1 077 sorties affirmées que le site PEUT vérifier dès maintenant, et que personne ne regarde.**

  **1. Il n'y a plus un seul bouton mort.** La consigne « le dire dans l'interface plutôt que de laisser un bouton mort » était déjà satisfaite en arrivant ici : A4 a supprimé `addOfflineBtn` et `showOffline`, et la règle de `runner.js` est désormais uniforme — **un bloc sans moteur n'a pas de bouton**, comme un bloc SQL écrit pour PostgreSQL ou un bloc Python qui importe pandas. Rien à changer. Vérifié : 0 occurrence de `--offline` dans `js/`.

  **2. La liste, mesurée.** Outil neuf `tools/mesure-prediction.js`. **37 langages, 6 978 blocs** ne seront jamais exécutables en `file://` (hors les 4 langages à moteur et hors les formats de données, qui ne « produisent » rien). Les plus gros : `bash` 1 158, `csharp` 247, `ruby` 246, `jsx` 246, `cpp` 232, `java` 230, `kotlin` 230, `c` 229, `swift` 219, `rust` 216.

  **3. Le format retenu, et la règle qui le rend honnête.** L'exercice de prédiction n'a besoin d'aucun mécanisme neuf : `data-exos` en `type:text` suffit. Ce qui compte est la règle de fond, et elle est dictée par la faute qui a fondé ce chantier :

  > **On ne bâtit un exercice de prédiction que sur une sortie DÉJÀ AFFIRMÉE par la leçon.** Jamais on n'invente, dans un exercice, la sortie d'un code qu'on ne peut pas exécuter.

  Sans cette règle, écrire 1 000 exercices de prédiction reviendrait à écrire 1 000 affirmations que rien ne vérifie — précisément ce qui a laissé passer cinq exemples faux sous quatre vérificateurs verts. **Gisement mesuré : 1 056 blocs (15,1 %) affirment déjà leur sortie**, dont `ruby` 186, `kotlin` 151, `cpp` 70, `rust` 65, `elixir` 65, `bash` 65, `c` 62, `php` 50, `java` 40, `csharp` 37.

  **4. LA DÉCOUVERTE DU POINT : ces affirmations sont écrites là où aucun outil ne regarde.** Sur les 1 056, **1 053 sont EN COMMENTAIRE DANS LE CODE** (`// => 42`, `# Sortie :`, `-- affiche`) et **3 seulement** dans un bloc `.txt` attenant. Or `verif-clic.js` — le seul outil qui compare une sortie annoncée à une sortie réelle — **ne compare que des blocs `.txt`, et seulement en JavaScript**. Toute cette classe d'affirmations est hors de portée de l'outillage. C'est exactement la forme sous laquelle était écrit l'exemple de `regex` qui annonçait `true` là où le test rendait `false`.

  **5. Ce qu'il faut faire AVANT B7, et qui n'était pas au plan.** La même mesure, appliquée aux langages qui ONT un moteur, donne le chiffre le plus actionnable de ce point :

  | langage | blocs affirmant leur sortie **en commentaire** | vérifiable ? |
  |---|---:|---|
  | JavaScript | 665 | **oui, depuis toujours** |
  | Python | 342 | **oui, depuis A4** |
  | HTML / markup | 61 | oui (aperçu) |
  | SQL | 9 | **oui, depuis A2** |
  | **total** | **1 077** | **et aucun outil ne les lit** |

  **1 077 affirmations vérifiables par exécution, jamais vérifiées** — c'est plus que le gisement de prédiction lui-même. Étendre `verif-clic.js` aux commentaires de sortie (et à Python) rendrait vraies 1 077 affirmations au lieu d'en ajouter 1 056 sur parole. **Recommandation d'ordre : cet outil passe avant B7.**

  ⚠️ **Deux pièges de motif rencontrés, et c'est la même leçon deux fois.** Le premier appariement cherchait un bloc `.txt` attenant : **3 blocs sur 6 978**, un résultat si improbable qu'il fallait le vérifier — la mesure était fausse, pas le site. Le deuxième acceptait `=>` n'importe où : 1 647 blocs, mais en Ruby `{ 'bonjour' => 'hello' }` est un *hash* et en JSX `() => {}` une fonction. Le resserrer aux seuls mots annonciateurs faisait tomber Ruby de 191 à 4 — faux dans l'autre sens, puisque `# => "Ada"` **est** l'idiome Ruby d'annonce de résultat. Le motif juste exige la flèche **dans un commentaire** : 1 056. **Un chiffre invraisemblable, dans un sens comme dans l'autre, se vérifie sur le contenu avant d'être écrit.**

---

## PHASE B — Convertir les exercices, cours par cours

Une case = un cours. **Ne convertir que ce qui gagne à l'être** : un exercice qui demande de
comprendre une notion reste très bien en `type:text`. La conversion vise ceux qui demandent
d'**écrire** quelque chose.

**Méthode, à suivre pour chaque cours** : relever le nombre d'exercices et leur type, repérer ceux
qui font écrire du code, les convertir en `type:code` avec un `run.expect` vérifiable, **exécuter la
solution de référence pour prouver qu'elle passe**, et mesurer avant/après.

> **Ordre révisé par la mesure A1** : traiter **B3 et B4 en premier** (1 073 exercices, aucun préalable,
> aucun octet ajouté), puis B5, B6, B7, et enfin B1/B2 qui dépendent de A2/A3 et A4.

- [x] **B1 · Les cours SQL et données** (`sql`, `bdd`, `nosql`, `data-eng`). ✅ **2026-08-26. Une requête n'est plus comparée à une graphie : elle est POSÉE SUR UN SCHÉMA, EXÉCUTÉE, et son résultat comparé ligne à ligne.**

  **1. Ce que la case supposait, et ce que la mesure a trouvé.** « Dépend de A2/A3 » laissait croire que le travail de A3 suffisait. Il ne suffisait pas : **l'exécution SQL vit dans `runner.js` (bouton « ▶ Exécuter »), la correction d'exercices dans `lecon.js` (`initExos`), et les deux ne se parlent pas** — exactement la même architecture en deux morceaux que B4 avait rencontrée pour l'aperçu HTML. `initExos` ne connaissait que trois juges : une liste de chaînes (`accept`), un Worker JavaScript (`type:"code"`) et le moteur de motifs (`type:"regex"`). État de départ mesuré sur les 67 leçons des quatre cours : **0 exercice `type:"code"`, 0 `type:"sql"`, 197 `type:"text"`**.

  **2. Le moteur neuf `type:"sql"`, et pourquoi il fallait l'écrire.** Un exercice de requête corrigé par `accept:[…]` refuse `WHERE prix>20` faute d'espaces, et accepte n'importe quelle variante voisine de la réponse notée — juste ou fausse. Désormais la requête part dans un **Worker qui charge le SQLite du dépôt** (`assets/vendor/sqljs/`, URL `file://` absolue, aucun octet réseau), pose le `schema` de l'exercice, exécute la requête, et **`JUGE_SQL` compare le RÉSULTAT** : nombre et noms de colonnes, nombre de lignes, valeurs ligne à ligne. L'ordre n'est comparé que si l'exercice le demande (`ordre: true`) — sans `ORDER BY`, aucune norme SQL ne garantit l'ordre. Le Worker est **partagé par la page** (sql.js met ~0,8 s à s'initialiser) et les demandes sont **numérotées**, deux exercices pouvant être lancés coup sur coup. La saisie n'est jamais concaténée au programme du Worker : elle y entre par `postMessage`, donc comme une donnée.

  **3. Les 21 exercices, et pourquoi tous ne sont pas du SQL.** `nosql` ne parle pas SQL et `data-eng` pas toujours — mais ce que ces leçons enseignent est de la **logique pure**, que le site sait déjà exécuter.

  | cours | leçons | ce que l'apprenant écrit | juge |
  |---|---|---|---|
  | `sql` | 02, 05, 07, 09, 13, 20 | bornes de `BETWEEN`, les trois `COUNT`, l'anti-jointure, une CTE + moyenne des totaux, `ROW_NUMBER` Top-1 par groupe, un pivot `CASE WHEN` | SQLite |
  | `bdd` | 05, 06, 07, 09, 10 | doublons d'une clé candidate (avec le piège des `NULL` regroupés), lignes orphelines, ce qui violerait un `UNIQUE` composite, la **preuve par les données** d'une dépendance transitive, la réconciliation d'un agrégat dénormalisé | SQLite |
  | `nosql` | 03, 05, 08, 12, 13 | un motif d'objet (notation pointée, `$gt`), les amis d'amis à deux sauts, un pipeline `$match→$group→$sort→$limit`, un index inversé complet, la similarité cosinus | Worker JS |
  | `data-eng` | 04, 07, 08, 10, 13 | l'analyse d'une ligne CSV à guillemets, l'élagage de partitions, la **déduplication déterministe** après rejeu, un test de qualité « zéro ligne » à deux familles, la volumétrie annuelle | 2 SQLite, 3 Worker JS |

  Les cinq exercices de `bdd` ont un point commun assumé : ils font **prouver par les données** ce que la leçon énonce en théorie — une clé candidate qui n'en est pas une, une contrainte qui ne passerait pas sur l'existant, une faute de frappe (« Lile ») qui suffit à casser une dépendance fonctionnelle.

  **4. Outil neuf `tools/verif-sql-exos.js` — 6ᵉ étape de `verif.js`.** Il **EXTRAIT `JUGE_SQL` de `js/lecon.js`** (jamais recopié : deux copies divergent, une extraction non), pose chaque schéma dans le sql.js du dépôt, et exige quatre choses : que la référence rende **exactement** l'attendu, que **chaque contre-requête ÉCHOUE**, que l'attendu ne soit pas vide (une requête qui ne trouve rien passerait), et que la référence figure **littéralement dans la solution affichée** — testé = montré. Sans les contre-requêtes, un jeu de données où toutes les lignes se ressemblent laisserait passer une requête fausse : ce serait un compteur câblé, la panne déjà relevée en B5.

  **5. Preuve, en trois endroits.**

  | contrôle | résultat |
  |---|---|
  | avant insertion (`vm` + sql.js, moteurs du site) | **21 / 21 conformes, 39 contre-requêtes refusées** |
  | `tools/verif-sql-exos.js` (depuis les pages écrites) | **13 exercices, 30 lignes comparées, 39 contre-requêtes, 0 faute** |
  | Chrome, `file://`, **sans** `--allow-file-access-from-files` | **21 solutions acceptées** (39,3 s) |
  | idem, passe adversariale `--contre` | **13 contre-requêtes REFUSÉES, 0 acceptée à tort** (23,8 s) |
  | `tools/preuve-hors-reseau.js` (DNS coupé, `MAP * ~NOTFOUND`) | verdict « ✓ Bravo, c'est juste ! » en **820 ms**, **0 requête distante** sur 19 |

  ⚠️ **Deux attendus écrits de tête étaient FAUX, et l'exécution les a corrigés avant insertion** : `nosql/lecon-08` (le top 2 est Mobilier 900 puis **Textile 200**, pas Papeterie 120 — 12 × 10 n'est pas le total le plus proche) et `nosql/lecon-13` (le cosinus de « chien » vaut **0,930**, pas 0,928). C'est exactement la règle du chantier : ne jamais poser un calcul sans le faire tourner.

  ⚠️ **Le contrôle « testé = montré » a d'abord échoué sur 2 exercices sur 11, pour une raison qui n'en est pas une** : la solution repliée écrit `WITH totaux AS (\n  SELECT …` quand `ref` tient sur une ligne. Comparer après simple écrasement des blancs laissait `as ( select` ≠ `as (select`. La normalisation efface désormais aussi les espaces **autour des parenthèses et des virgules**, des deux côtés.

  **6. Mesure avant / après.**

  | | avant | après |
  |---|---:|---:|
  | exercices réellement exécutés | 308 / 4 493 — **6,86 %** | **329 / 4 514 — 7,29 %** |
  | dont `type:"sql"` | 0 | **13** |
  | cours ayant au moins un exercice exécuté | 20 | **24** |

  **0 octet de moteur ajouté** : SQLite était déjà là depuis A2.

  **7. Contrôles.** `verif.js --rapide` **tout vert, 6 vérificateurs** (source, données, contenu, exemples, motifs, **requêtes**). `verif-rendu` **0 erreur / 0 avertissement sur 24 mesures** (4 pages × 3 largeurs × 2 thèmes). `search-index.js` régénéré (1 587 leçons). **0 URL de CDN**, 0 BOM. La grammaire Prism a été ajoutée à **4 pages** (`clike` puis `javascript`, dans cet ordre — `javascript` en dépend) qui n'avaient jamais eu de bloc JavaScript ; sans elle l'invariant I14 casse et la solution s'affiche sans coloration.
- [x] **B2 · Les cours Python** (`python`, `python-avance`, `pandas`, `stats`, `dataviz`, `ml`). ✅ **2026-08-26. CPython 3.12 exécute désormais ce que l'apprenant écrit, dans le navigateur, sans serveur — et les 25 solutions publiées passent leur propre exercice.**

  **1. La case cite six cours ; il n'y en a que cinq.** Les **22 pages de `python-avance` sont des REDIRECTIONS** (`<meta http-equiv="refresh">` vers `python/lecon-29` et suivantes) : le cours a été fusionné dans `python`, il ne contient **aucun exercice**. Périmètre réel mesuré avant de toucher quoi que ce soit : **105 leçons, 310 exercices, tous `type:"text"`, 0 exécutable**.

  **2. Le moteur `type:"python"`, et pourquoi il est plus simple que celui de B1.** SQL exigeait un juge neuf (comparer un tableau de résultats). Python n'en demande aucun : un programme produit une **sortie standard**, et la règle du site pour `type:"code"` — *l'une des lignes de la sortie est exactement `run.expect`* — s'y applique telle quelle. Le travail était donc de brancher l'interpréteur : un Worker qui charge le CPython embarqué (`assets/vendor/pyodide/`, cf. A4), collecte `stdout` **et `stderr`** (une trace Python est le message le plus utile qu'un apprenant puisse lire), et rend le texte. Le Worker est **partagé par la page** — 8,27 Mo à charger — et les demandes sont **sérialisées** : un interpréteur unique ne mène pas deux programmes de front. Garde de 20 s avec **terminaison du Worker**, parce qu'une boucle infinie Python ne s'interrompt pas de l'intérieur ; le Worker suivant est recréé à la demande.

  **3. Les 25 exercices — et le choix que l'absence de paquets impose.** Pyodide n'embarque que la **stdlib** (index des paquets vidé, garde-fou réseau) : ni pandas, ni numpy, ni matplotlib, ni scikit-learn. Imiter ces bibliothèques en Python pur aurait été un mensonge. Ces exercices font donc **écrire la règle que la bibliothèque applique** — la voie déjà retenue en B4 pour les cours web, et la plus instructive : on ne peut pas se tromper sur ce qu'on a écrit soi-même.

  | cours | leçons | ce que l'apprenant écrit |
  |---|---|---|
  | `python` | 08, 10, 12, 14, 27, 29, 33, 37 | regrouper par `setdefault`, une compréhension de dictionnaire filtrante, **deux `except` distincts et un `else`**, un générateur de fenêtres glissantes, `groupby` (qui ne groupe que les CONSÉCUTIFS), un décorateur de mémoïsation **qui compte les calculs réels**, une `dataclass(order=True)` dont un champ est hors comparaison, la composition de fonctions par `reduce` |
  | `pandas` | 04, 06, 09, 11, 12 | le taux de valeurs manquantes et la médiane d'imputation, un **masque booléen** combiné terme à terme, le **split-apply-combine** à la main, une jointure gauche **et le gonflement du nombre de lignes qu'un doublon provoque (12 → 15)**, un `resample` mensuel suivi d'un `pct_change` |
  | `stats` | 03, 07, 09, 11, 14 | étendue / écart-type / IQR sur deux serveurs de **même moyenne**, l'**erreur standard** (≠ écart-type) et l'IC à 95 %, le coefficient de Pearson **retourné par un seul point**, la droite des moindres carrés et son R², le **paradoxe de Simpson** recalculé sur les effectifs |
  | `dataviz` | 06, 09, 11 | un histogramme à dernière classe ouverte (médiane 22 contre moyenne 26), **la hausse perçue d'un axe tronqué**, l'agrégation spatiale en cellules |
  | `ml` | 03, 06, 08, 09 | la standardisation **sans fuite de données** (ajuster sur le train seul, et le prouver), le diagnostic sur/sous-apprentissage par l'écart, **une itération de k-means** plus la lecture du coude, précision / rappel / **F1 harmonique** |

  Sept exercices retombent **exactement** sur les chiffres que leur leçon annonce sans les démontrer : CA par ville 28,80 / 32,80 / 6,00 (`pandas/09`), 182,40 puis 97,10 et −46,8 % (`pandas/12`), IC **[97,1 ; 115,3]** ms (`stats/07`), pente 0,0169 / origine 16,33 / R² 0,9955 / 41,7 % à 1 500 ms (`stats/11`), 16,5 % contre 12 % (`stats/14`), +3 % réel contre **+63 % perçu** (`dataviz/09`), 0,800 / 0,667 / 0,727 (`ml/09`). L'apprenant peut désormais **vérifier le cours** au lieu de le croire.

  **4. Preuve, en trois endroits.**

  | contrôle | résultat |
  |---|---|
  | avant insertion, CPython **3.14** de la machine | **25 / 25 conformes** |
  | `tools/verif-python-exos.js` (solutions relues DANS les pages) | **25 fichiers, 25 exercices, 0 faute, 3,7 s** |
  | Chrome, `file://`, **sans** `--allow-file-access-from-files`, CPython **3.12** | **25 / 25 acceptées** (82,1 s) |
  | `tools/preuve-hors-reseau.js` (DNS coupé, `MAP * ~NOTFOUND`) | « ✓ Bravo, c'est juste ! » en **1 628 ms**, **0 requête distante** sur 19 |

  **Aucune divergence entre CPython 3.14 et 3.12** sur ces 25 programmes — c'est mesuré, pas supposé, et c'est précisément ce que le contrôle local ne peut pas garantir seul.

  **5. Outil neuf `tools/verif-python-exos.js` — 7ᵉ étape de `verif.js`.** La preuve navigateur coûte ~3 s par page : un contrôle de deux minutes ne tourne pas à chaque passe, donc il ne protège de rien au quotidien. Celui-ci rejoue la **solution publiée** avec le CPython de la machine, en appliquant la règle exacte de `js/lecon.js`, et refuse en outre **tout import absent de Pyodide** (`numpy`, `pandas`, `matplotlib`, `scipy`, `sklearn`, `seaborn`, `requests`, `sqlite3`) — un exercice qui en dépendrait serait mort dans le navigateur sans que rien ne le dise. `verif.js` sait désormais **SAUTER** une étape sans la compter en échec : sur une machine sans Python, l'outil sort en code 2 et la chaîne reste verte.

  **6. Mesure avant / après.**

  | | avant | après |
  |---|---:|---:|
  | exercices réellement exécutés | 329 / 4 514 — **7,29 %** | **354 / 4 539 — 7,80 %** |
  | dont `type:"python"` | 0 | **25** |
  | cours ayant au moins un exercice exécuté | 24 | **29** |

  Rappel du point de départ du chantier : **2,5 %** annoncés, **4,77 %** mesurés en A1. **0 octet ajouté** — l'interpréteur était déjà là depuis A4.

  **7. Contrôles.** `verif.js --rapide` **tout vert, 7 vérificateurs**. `verif-html` 0/0, `verif-donnees` 0 erreur, `verif-rendu` **0 erreur / 0 avertissement sur 18 mesures**, `search-index.js` régénéré, **0 URL de CDN**. Aucune grammaire Prism à ajouter : les 25 pages chargeaient déjà `prism-python`.

  🔵 **Relevé hors périmètre, à traiter un jour** : dans `python/lecon-29`, `lecon-33` et `lecon-37`, le champ `link.href` des entrées `data-exos` préexistantes pointe vers **une autre leçon** (`lecon-01`, `lecon-05`, `lecon-09`). Le lien « revoir la notion » d'un exercice y renvoie donc au mauvais endroit. Aucun invariant ne compare `link.href` au fichier qui le porte.
- [x] **B3 · Les cours JavaScript restants** (`typescript`, `nodejs`, `react`, `vue`, `projets-js`). ✅ **2026-08-26. 25 exercices de code neufs, et un outil qui prouve — dans le navigateur — que leur solution passe.**

  **1. La prémisse de la case était fausse, et la mesure le dit.** « Exécutable dès aujourd'hui » supposait qu'il suffisait de convertir les `type:text` existants. Mesuré avant de toucher quoi que ce soit : **0 exercice `type:code` dans `typescript`, `nodejs`, `react` et `vue`** (173 `type:text`), 21 dans `projets-js`. Et surtout, **rien n'y était convertible** : le juge du site est un Worker qui fait un `eval` **synchrone** de JavaScript pur — pas de TypeScript (annotations = `SyntaxError`), pas de JSX, pas de `require`, pas de DOM, pas d'`async`. Les énoncés existants portent tous sur du vocabulaire (« la directive pour… », « le mot-clé qui… ») ou sur des API absentes du Worker (`fs.readFile`).

  **La conversion était donc impossible ; l'ajout, lui, ne l'était pas.** Chaque domaine a une logique PURE, et c'est même la plus instructive : un réducteur, un `computed`, une file de mises à jour, une chaîne de middlewares, un analyseur d'arguments sont du JavaScript ordinaire. **25 exercices écrits sur ce principe, 5 par cours**, chacun avec son bloc `.exercise` (« Au clavier »), sa solution repliée et ses trois indices.

  | cours | leçons touchées | ce que l'apprenant écrit |
  |---|---|---|
  | `typescript` | 04, 06, 07, 15, 18 | l'affinage par `typeof`, un générique une fois compilé, `Pick` à l'exécution, un validateur de frontière, une garde de type |
  | `nodejs` | 06, 07, 09, 12, 23 | un `EventEmitter` maison, le découpage en morceaux d'un stream, la lecture d'options, une chaîne de middlewares, l'analyse d'une commande |
  | `react` | 04, 05, 06, 13, 16 | les clés en double, **le piège de `{0 && …}`**, la file de mises à jour d'état, un réducteur, une mémoïsation |
  | `vue` | 02, 03, 05, 09, 11 | `v-for` + filtre, un `computed` **avec son cache**, un watcher, un magasin d'état, la validation d'un formulaire |
  | `projets-js` | 19, 20, 22, 23, 24 | déplacer une carte de Kanban, masquer le mot du pendu, compter les paires, filtrer une liste, la série en cours |

  **2. Outil neuf `tools/preuves/exos-code.js` — le contrôle que la méthode de la phase B exigeait et que personne n'outillait.** Le plan demande « exécuter la solution de référence pour prouver qu'elle passe ». Aucun outil ne le faisait : `verif-exemples.js --exos` rejoue l'**énoncé** dans `vm` (Node), jamais la solution, et jamais dans le moteur du site. Celui-ci ouvre la leçon dans Chrome en `file://` — **sans `--allow-file-access-from-files`**, comme un apprenant —, **copie la solution repliée dans le champ, clique « Vérifier » et lit le verdict rendu par la page**. C'est le Worker qui juge, pas Node.

  **Résultat sur les 25 leçons neuves : 25 solutions acceptées, 0 refusée, 45,8 s.** Contre-mesure indépendante dans `vm` avant insertion : 25/25 également, avec la règle exacte de `lecon.js` (`normExo` + `uneLigneEgale`).

  ⚠️ **Le piège qui a coûté la première mesure : `Runtime.evaluate` sans `awaitPromise: true` rend la promesse, pas sa valeur.** Le script injecté est asynchrone (il attend le Worker). Sans ce paramètre, l'outil ne lit rien et imprime « aucun champ de code trouvé » — c'est-à-dire **un verdict vert par vacuité**. Exactement la forme de panne qui a fondé ce chantier : un contrôle qui ne mesure rien ressemble à un contrôle qui passe.

  **3. Ce que la même preuve révèle sur l'EXISTANT, et qui n'était au plan d'aucune case.** Passée sur tout le site (`--tout`, 120 pages, 277,8 s) : **200 solutions acceptées, 31 REFUSÉES, 5 exercices sans solution repliée.** Les 31 refus se concentrent sur `js` (8), `algo` (8), `projets-js` (7 préexistants) et `offensive` (5). **Ce ne sont pas 31 fautes** : dans ces leçons, le micro-exercice interactif pose une question AUTONOME (« affiche `totalDepenses([…])` ») tandis que la solution repliée juste au-dessous répond à l'énoncé général du bloc `.exercise` (le modèle de budget entier). Les deux dispositifs cohabitent sous le même titre sans se répondre.

  **Le cas `offensive` est le plus net, et il est lisible par l'apprenant** : sous un « Exercice 3 » dont l'énoncé dit « Décris en trois phrases le raisonnement », le champ affiché demande « **Écris le code** — le nombre de hachages par candidat, sans puis avec sel ». La consigne visible et le champ ne parlent pas de la même chose, sur les 5 leçons `offensive/lecon-07` à `11`. C'est la vraie forme de la dette notée en V13 sous « 5 exercices faux dans `offensive` » : ni l'exercice ni la solution ne sont faux — **c'est leur appariement qui l'est**. Chantier à part, non traité ici.

  **4. Mesure avant / après.** Exercices `type:code` du site : **211 → 236 (+11,8 %)**. Part réellement auto-corrigée : **4,77 % → 5,31 %** (236 / 4 447). Cours ayant au moins un exercice exécuté : **9 → 13** (`typescript`, `nodejs`, `react` et `vue` entrent, `projets-js` y était déjà). `verif-exemples.js --exos` confirme **143 `run.expect` par exécution contre 118 avant, 0 divergent**. **0 octet ajouté au dépôt hors contenu** — aucun moteur, aucune dépendance.

  **5. Contrôles.** `verif.js --rapide` **tout vert** (source, données, contenu, exemples). `verif-html` 0/0 sur 1 612 fichiers. `verif-donnees` 0 erreur sur 25 invariants — **après correction d'une erreur que l'ajout a révélée** : `vue/lecon-02.html` chargeait `prism-markup` mais **pas** `prism-javascript`, donc le premier bloc JavaScript de la page serait resté sans coloration (I14 l'a attrapé ; `prism-clike` et `prism-javascript` ajoutés). `verif-rendu` 0 erreur / 0 avertissement sur 30 mesures (5 pages × 3 largeurs × 2 thèmes). `search-index.js` régénéré (1 587 leçons). 0 URL de CDN introduite — les 6 occurrences de `fonts.gstatic.com` du dépôt sont dans le CONTENU échappé de `html/lecon-25` et `lecon-35`, qui enseignent `preconnect`, et sont antérieures.
- [x] **B4 · Les cours web** (`html`, `css`, `sass`, `a11y`, `perf-web`). ✅ **2026-08-26. 25 exercices neufs, 25 acceptés par le navigateur — mais PAS par la voie que la case annonçait.**

  **1. Le gisement annoncé n'existe pas, et c'est un fait d'architecture.** « L'aperçu HTML existe déjà dans `runner.js` » est vrai — et sans effet ici : **l'aperçu HTML est dans `runner.js`, le correcteur d'exercices est dans `lecon.js`, et les deux ne communiquent pas.** `initExos` n'a qu'un seul moteur, `runExoCode`, qui poste le code de l'apprenant à un Worker JavaScript et compare la sortie console à `run.expect`. Un exercice HTML/CSS n'a donc **rien à comparer** : il faudrait un juge neuf (rendre dans une iframe, puis interroger le DOM ou les styles calculés). C'est un chantier d'infrastructure à part entière, pas une conversion — laissé de côté, et dit ici.

  **2. La voie qui marche, et qui vaut mieux.** Les cours web enseignent des **règles de calcul exactes** que l'apprenant subit au lieu de les connaître : la spécificité à trois colonnes, la répartition de `flex-grow`, le nombre de colonnes d'un `auto-fill`, le rapport de contraste WCAG, le CLS, la fenêtre de congestion. **Ces règles s'écrivent, s'exécutent et se vérifient en JavaScript pur.** 25 exercices sur ce principe, 5 par cours — état de départ mesuré : **0 exercice `type:code` sur les 138 leçons de ces cinq cours** (402 `type:text`).

  | cours | leçons | la règle que l'apprenant écrit |
  |---|---|---|
  | `css` | 03, 09, 10, 13, 22 | la spécificité `(1,2,1)`, la répartition de `flex-grow`, les colonnes d'un `auto-fill`, la cascade des `var()`, `clamp()` |
  | `html` | 02, 05, 10, 14, 16 | les sauts de niveau de titres, la largeur réelle d'une ligne avec `colspan`, la validation native, la longueur d'un `<title>`, le choix d'une source `srcset` |
  | `sass` | 02, 03, 06, 07, 12 | l'addition avec unités, l'aplatissement de `&`, `mix()` canal par canal, une boucle `@for`, `map.get()` en profondeur |
  | `a11y` | 03, 05, 08, 11, 13 | `alt` absent ≠ `alt` vide, **le rapport de contraste WCAG**, l'ordre de tabulation, ce qui manque à un tableau, le clavier attendu d'un jeu d'onglets |
  | `perf-web` | 01, 07, 08, 09, 10 | **le CLS**, les allers-retours de la fenêtre de congestion, le gain de compression, les trois états de `Cache-Control`, un budget |

  **3. Preuve.** `tools/preuves/exos-code.js` (écrit en B3) : **25 solutions acceptées, 0 refusée, 46,3 s**, dans Chrome, en `file://`, sans `--allow-file-access-from-files`. Contre-mesure indépendante dans `vm` avant insertion : **25/25 du premier jet**. Une valeur confirme le calcul de l'extérieur : le contraste de `#767676` sur blanc rend **4,54**, la valeur de référence du WCAG pour la couleur grise limite du seuil AA.

  ⚠️ **Deux pièges d'insertion, tous deux trouvés par la mesure et non par la lecture.** (a) **Trois pages du cours `sass` sont en CRLF** quand tout le reste du site est en LF : un motif d'ancrage écrit `\n\n` n'y trouvait rien — l'inséreur les détecte et reprend le saut de ligne dominant du fichier. (b) **22 des 25 pages ne chargeaient PAS la grammaire JavaScript de Prism**, n'ayant jamais eu de bloc JS : sans elle, l'invariant I14 casse et la solution s'affiche sans coloration. `prism-clike` puis `prism-javascript` ajoutés dans cet ordre — `javascript` en dépend, et `defer` conserve l'ordre du document.

  **4. Mesure avant / après (cumul B3 + B4).** Exercices `type:code` : **211 → 261 (+23,7 %)**. Part réellement auto-corrigée : **4,77 % → 5,84 %** (261 / 4 472). Cours ayant au moins un exercice exécuté : **9 → 18** (doublé). `verif-exemples.js --exos` : **118 → 168 `run.expect` confirmés par exécution, 0 divergent**. **0 octet de moteur ajouté.**

  **5. Contrôles.** `verif.js --rapide` tout vert. `verif-html` 0/0 sur 1 612 fichiers, `verif-donnees` 0 erreur sur 25 invariants, `verif-rendu` 0 erreur / 0 avertissement sur 30 mesures, `search-index` régénéré, 0 URL de CDN.

  🔵 **Effet de bord à ne pas lire comme une régression** : `verif-contenu.js` signale désormais **1 leçon « maigre », `sass/lecon-09`, qui n'a pas été touchée**. Le critère est une comparaison à la MÉDIANE du cours : enrichir 5 des 14 leçons de `sass` a relevé la médiane, et `lecon-09` est passée sous le seuil sur 4 critères (2 129 mots contre 2 139 de médiane — 10 mots d'écart). Un seuil relatif se déplace quand on améliore le reste ; le contrôle reste non bloquant.
- [x] **B5 · `regex`**. ✅ **2026-08-26. Le motif n'est plus comparé à une liste : il est CONSTRUIT et CONFRONTÉ à des cas. Et la mesure a trouvé, chemin faisant, 8 exercices dont le champ posait une autre question que l'énoncé affiché juste au-dessus.**

  **1. Ce que la case supposait, et ce que la mesure a montré.** « Entièrement vérifiable en JavaScript » est vrai — mais rien dans le site ne le vérifiait : **les 33 exercices du cours étaient en `type:"text"`, corrigés par `accept:[…]`**, c'est-à-dire par une comparaison de chaînes. Deux défauts, et le second est bien pire que le premier :

  | | |
  |---|---|
  | Un correcteur par liste **refuse une réponse juste** | `p.{2}t` était refusé là où `p..t` passait |
  | Il **accepte n'importe quoi qui ressemble à la note** | et surtout : il ne voit pas qu'`accept` répond à un AUTRE exercice |

  **2. Les 8 désappariements, énoncé ⇄ champ.** Le libellé du champ vient du `placeholder` (V12-C9) ; l'énoncé, lui, est dans le bloc `.exercise`. Personne ne compare les deux. Relevé exercice par exercice sur les 33 :

  | leçon | l'énoncé affiché demande… | …et le champ demandait |
  |---|---|---|
  | `lecon-07` #3 | pourquoi `"a😀b".length` vaut 4, et comment compter | « la propriété Unicode qui désigne un chiffre » |
  | `lecon-08` #1 | les groupes nommés **heure** et **minute** de `14:30` | « le groupe nommé **mois** » |
  | `lecon-08` #3 | `"Dupont, Marie"` → `"Marie Dupont"` | le remplacement d'une **date** `$<jour>/$<mois>/$<annee>` |
  | `lecon-09` #1 | lequel des deux motifs est à risque | « la version sûre de `^(\d+)+$` » |
  | `lecon-09` #2 | réécrire `".*"` sans débordement | « le nom du mécanisme de retour arrière » |
  | `lecon-10` #1 | le motif d'un **slug** | « le motif ancré d'un **code postal** » |
  | `lecon-10` #2 | le décimal acceptant la **virgule** | « le motif d'une **couleur hex** `#RGB` » |
  | `lecon-10` #3 | renforcer une date pour rejeter le mois 13 | « une regex valide surtout la ____ » |

  Dans ces 8 cas, **la solution publiée juste au-dessous était REFUSÉE par le champ** : elle répond à l'énoncé, pas à l'`accept`. Même forme de panne que les 5 exercices `offensive` relevés en B3 — un appariement, pas un contenu. Les 8 sont corrigés.

  **3. Le moteur neuf : `type:"regex"` (`js/lecon.js`).** La réponse est un motif, saisi dans un champ d'une ligne ; la correction **construit `new RegExp(…)` et la confronte à un jeu de cas** — `ok` (doit matcher), `ko` (ne doit pas), `capte` (résultat exact de `.match()`, groupes compris), `groupes` (contenu de `.groups`, seul endroit où un nom de groupe existe). Trois décisions, chacune pour une raison mesurée :
  - **le test part dans le Worker des exercices de code**, donc un motif à retour arrière explosif est coupé à 3 s au lieu de figer l'onglet ;
  - **le motif de l'apprenant n'est jamais concaténé au programme** : il y entre par `JSON.stringify`, comme une chaîne ;
  - **`.test()` est joué sans les drapeaux `g`/`y`**, qui avancent `lastIndex` et feraient répondre différemment au deuxième clic.
  L'apprenant voit désormais **pourquoi** il se trompe : « `· ne devrait PAS matcher, et matche : "ponnt"` ».

  **4. Outil neuf `tools/verif-regex-exos.js`, ajouté aux vérificateurs de `verif.js` (5ᵉ étape, 1,0 s).** Il extrait `TEST_REGEX` de `js/lecon.js` — extraction, pas copie : deux copies divergent — et exige, pour chaque exercice : la **référence passe**, chaque **contre-motif échoue**, `ref` figure **littéralement dans la solution affichée** (testé = montré), `accept` contient `ref` (repli sans Worker), et au moins un cas de rejet. **Mesure : 11 fichiers, 26 exercices, 144 cas, 78 contre-motifs — 0 faute.** Blocage prouvé : en affaiblissant le seul jeu de cas de `lecon-03` #2, l'outil sort en **code 1** avec 3 fautes, et 0 après retour en arrière.

  ⚠️ **Le piège de ce point, et il est exactement celui du chantier : ma première version de l'outil oubliait le champ `groupes`.** Elle mesurait donc **142 cas là où le site en joue 144**, et trois contre-motifs semblaient « passer » des cas qu'ils n'avaient jamais subis. Un contrôle qui teste moins que la chose contrôlée rend un vert par vacuité. Règle : **le jeu transmis par l'outil doit contenir exactement les champs que `programmeRegex` transmet au Worker** — c'est écrit en commentaire au-dessus de la ligne.

  **5. Preuve dans le navigateur, dans les DEUX sens.** `tools/preuves/exos-code.js` étendu au type `regex` (il tape le `ref` du bloc `data-exos`, dont l'invariant ci-dessus prouve qu'il est bien le motif affiché) et doté d'un **mode `--contre`** :
  - **26 références tapées, 26 acceptées, 0 refusée** (11 pages, 21,8 s) ;
  - **26 contre-motifs faux tapés, 26 REFUSÉS, 0 accepté à tort** (22,7 s).
  Prouver qu'une bonne réponse passe ne prouve que la moitié : un correcteur qui accepte tout passerait le premier contrôle. Les deux passes tournent dans Chrome, en `file://`, **sans** `--allow-file-access-from-files`.

  **6. Mesure avant / après.** Exercices corrigés **par exécution** : **261 → 287** sur 4 472 exercices à champ, soit **5,84 % → 6,42 %**. Cours ayant au moins un exercice exécuté : **18 → 19**. Dans le cours `regex` lui-même : **0 → 26 sur 33 (79 %)** — les 7 restants demandent une explication ou du code d'un autre langage, et gardent `type:"text"` avec un `accept` désormais aligné sur leur énoncé. **0 octet de moteur ajouté** : `js/lecon.js` passe de **50 054 à 55 060 octets** (+5 006, mesurés), rien d'autre.

  **7. Contrôles.** `verif.js --rapide` **tout vert, 5 étapes** (source, données, contenu, exemples, **motifs**). `verif-html` 0/0 sur 1 612 fichiers. `verif-donnees` **0 erreur sur 25 invariants** (le seul avertissement, `zig`, est celui de la phase E du V6). `verif-rendu` **0 erreur / 0 avertissement sur 18 mesures** (3 pages × 3 largeurs × 2 thèmes, réseau coupé). `build-index` : les 5 index dérivés **identiques** — les exercices ne sont pas indexés. 0 URL de CDN.

  🔵 **Relevé hors périmètre, coûteux quand on l'ignore** : `tools/verif-rendu.js` **ignore silencieusement les chemins passés nus** et retombe sur son défaut élargi (~229 pages, plusieurs minutes) ; la syntaxe est `--pages=a,b`. Deux lancements perdus avant de le voir.
- [x] **B6 · `algo` et `patterns`**. ✅ **2026-08-26. 21 exercices de code neufs, 21 acceptés par le navigateur — et « déjà bien dotés » ne tenait que pour un des deux cours.**

  **1. La mesure d'abord, la case ensuite.** « Déjà bien dotés, compléter » est vrai pour `algo` et **faux pour `patterns`** :

  | cours | leçons | exercices `type:code` | leçons sans aucun exercice exécuté |
  |---|---:|---:|---:|
  | `algo` | 28 | 38 | **10** (01, 10, 12, 16, 23, 24, 25, 26, 27, 28) |
  | `patterns` | 11 | **0** | **11** |

  Et les 10 leçons d'`algo` sans exercice exécuté ne sont pas les moins importantes : ce sont **la complexité, les arbres binaires, les graphes, Dijkstra, le hasard, Fenwick, l'AVL, les flots, le cache LRU et le projet de synthèse**. Un exercice par leçon manquante : **11 + 10 = 21**.

  **2. Le principe éditorial : un patron de conception n'est pas une figure de style, c'est une STRUCTURE dont l'effet se compte.** Chaque exercice fait écrire le patron, puis affiche le chiffre qui prouve qu'il fait ce qu'on lui prête — une seule instance construite, un seul calcul réel, un seul objet de style partagé pour mille particules, un état restauré.

  | cours | leçons | ce que l'apprenant écrit |
  |---|---|---|
  | `patterns` | 01 → 11 | la table de stratégies qui remplace un `switch`, **le carré qui viole Liskov** (24 contre 36), le singleton **avec son compteur de constructions**, l'adaptateur, l'observateur **et son désabonnement**, la mémoïsation (5 appels, 2 calculs), le poids-mouche (1 000 particules, 3 styles), la chaîne de responsabilité, l'horloge injectée, le dépôt en mémoire, **la pile de rétablissement qu'une commande neuve doit vider** |
  | `algo` | 01, 10, 12, 16, 23, 24, 25, 26, 27, 28 | le COMPTE des comparaisons (1 024 contre 11), le parcours infixe d'un ABR, le parcours en largeur, Dijkstra (A→B→C coûte 3, A→C direct coûte 4), **Fisher-Yates avec son hasard injecté**, l'arbre de Fenwick (`i & -i`), le facteur d'équilibre AVL et **le nom de la rotation**, Ford-Fulkerson et ses arêtes résiduelles (flot 13), **le cache LRU où la LECTURE rajeunit**, le tas binaire |

  **3. Ce que l'exécution a corrigé, et que la lecture aurait laissé passer.** L'exercice de la leçon 01 d'`algo` annonçait **10** comparaisons par dichotomie sur 1 024 éléments — le log₂ tombe juste, et c'est faux : la boucle en fait **11**, parce que le tour qui CONFIRME la trouvaille s'ajoute aux dix qui divisent. Corrigé par la mesure, pas par le raisonnement. C'est exactement la faute qui fonde ce chantier, prise à temps.

  **4. Le piège d'insertion, trouvé par la preuve navigateur et par rien d'autre.** `initExos` apparie `data-exos` aux blocs `.exercise` **par INDEX**. Or **deux pages — les deux capstones, `patterns/lecon-11` et `algo/lecon-28` — avaient moins d'entrées que de blocs** (le capstone n'a délibérément pas de champ). Ajouter une entrée à la fin du tableau l'a donc collée **en face de l'avant-dernier bloc**, et la solution du capstone s'est retrouvée jugée contre l'attendu d'un autre exercice. `lecon.js` avertit bien de l'écart, mais du bon côté (« les blocs en excès restent sans champ »), donc l'anomalie ne ressemblait pas à une anomalie. Corrigé en complétant le tableau par des `null` jusqu'à l'avant-dernier rang. **Contrôle passé sur tout le site après coup : 0 page où une entrée `data-exos` est perdue.**

  **5. Troisième trou du garde-fou `BROWSER_ONLY` — et cette fois c'est un IDENTIFIANT LÉGITIME.** Les deux premiers étaient un mot français accentué et le mot « document » dans un commentaire. Ici, un exemple **préexistant** de `patterns/lecon-05` écrivait `constructor(document, texte)` : le paramètre s'appelle `document` au sens « le document texte », il MASQUE le vrai global, et le code est donc parfaitement inoffensif — mais le garde-fou est syntaxique et privait le bloc de son bouton « Tester ». Renommé en `doc`, ce qui lève au passage une ambiguïté pédagogique. **Contrôle, avec la regex EXTRAITE de `js/runner.js` (pas recopiée) : 143 blocs `language-javascript` sur les 21 pages, 0 privé de bouton.**

  **6. Preuve.** `tools/preuves/exos-code.js` dans Chrome, en `file://`, sans `--allow-file-access-from-files` : **21 solutions tapées, 21 acceptées, 0 refusée** (40,6 s cumulées). Contre-mesure indépendante dans `vm`, avec le moteur exact de `lecon.js` (`normExo` + `uneLigneEgale`) : **21/21**, dont 1 seule reprise — celle des 11 comparaisons.

  **7. Mesure avant / après.** Exercices corrigés **par exécution** : **287 → 308** sur 4 493 exercices à champ, soit **6,42 % → 6,86 %**. Cours ayant au moins un exercice exécuté : **19 → 20** (`patterns` entre). Dans `patterns` : **0 → 11 sur 11 leçons**. Dans `algo` : **38 → 48**, et **plus une seule de ses 28 leçons sans exercice exécutable**. **0 octet de moteur ajouté.**

  **8. Contrôles.** `verif.js --rapide` tout vert (5 étapes). `verif-html` 0/0 sur 1 612 fichiers. `verif-donnees` 0 erreur sur 25 invariants. `verif-rendu` 0 erreur / 0 avertissement sur 18 mesures, réseau coupé. `search-index.js` régénéré (43 745 mots) ; quiz, flashcards, antisèches et `search-lite` inchangés. 0 URL de CDN.
- [x] **B6bis · Le préalable que A5 réclamait : lire les sorties annoncées en commentaire.** ✅ **2026-08-26. Le chiffre de A5 était faux — et le vrai gisement était ailleurs : 76 blocs de plus confrontés au réel, sans toucher une seule leçon.**

  A5 concluait : « 1 077 affirmations vérifiables par exécution, jamais vérifiées — cet outil passe avant B7 ». **Reproduire la mesure avant de corriger (règle 2) a démenti la phrase.** `tools/verif-exemples.js` lit ces commentaires **depuis toujours, en JavaScript ET en Python** : `node tools/verif-exemples.js --pas-exos` rendait, avant toute intervention, **1 053 blocs porteurs d'une valeur annoncée, 606 confrontés au réel, 0 divergence, 447 non confrontés**. Ce qui manquait n'était pas l'outil : c'était **la moitié de sa portée**. A5 a regardé `verif-clic.js` (qui, lui, ne compare que des blocs `.txt`, en JavaScript) et en a conclu qu'aucun outil ne lisait les commentaires. Faux, et le point aurait consisté à réécrire ce qui existait.

  **1. Le vrai obstacle, mesuré.** Sur les 447 blocs non confrontés, la première cause n'est ni l'asynchrone ni le navigateur : c'est **l'appariement POSITIONNEL**. `verif-exemples` associe la 1ʳᵉ annonce à la 1ʳᵉ sortie ; **il suffit d'un seul `console.log` non commenté pour que tout se décale**, et le bloc entier devient « non vérifié (compte) ». **119 blocs** dans ce cas (83 JS, 36 Python), dont **89 produisant PLUS de sorties qu'ils n'en annoncent**. Ces blocs portent pourtant des affirmations parfaitement confrontables — elles n'étaient simplement jamais confrontées.

  **2. L'ANCRAGE PAR LIGNE.** Chaque annonce connaît sa ligne, chaque sortie connaît la ligne d'où elle a été émise, et on ne compare que ce qui vient de la **même ligne**. Deux mécaniques, une par langage, et **aucune n'insère quoi que ce soit dans le bloc** — insérer, ce serait décaler la numérotation, donc mentir :
  - **JavaScript** : la doublure de `console.log` lit la pile d'appels (`exemple.js:<n>`), `Error.stackTraceLimit` porté à 60 le temps de l'exécution ;
  - **Python** : un **lanceur `runpy`** remplace `print` par une doublure qui note `sys._getframe(1).f_lineno` et renvoie les couples (ligne, texte) sur stderr entre deux `\x1e`. Le fichier de la leçon est exécuté tel quel, donc ses numéros de ligne restent les siens.

  **3. Trois garde-fous, et chacun vient d'un faux positif REL — le premier jet en a crié 4 en JS et 1 en Python, tous faux.**

  | ce que l'outil criait | ce qui se passait vraiment | garde posé |
  |---|---|---|
  | `js/lecon-16`, `js/lecon-49` ×2 : « annoncé "Bonjour Léa", réel undefined » | `direBonjourALea(); // "Bonjour Léa"` annonce ce qui **s'affiche**, pas ce que l'appel **renvoie** — et il renvoie `undefined` | une annonce **enveloppée** (cas 3 de `instrumente`) dont la sortie ancrée vaut `undefined` n'est pas jugée |
  | `js/lecon-43` : « annoncé "21 °C" -> hint "string", réel 21 °C » | `estValeurMachine` acceptait `/^".*"$/` : **une valeur SUIVIE d'une glose** commence et finit par un guillemet. La ligne voisine, glosée avec « : », était déjà écartée | le motif exige **une seule chaîne, refermée à la fin** — les deux lignes sont enfin traitées pareil |
  | `stats/lecon-15` : « annoncé 1.86, réel z = 1.86 » | `print(f"z = {z:.2f}")  # 1.86` documente la **valeur interpolée**, pas la ligne. `afficheMonoArg` ne l'attrape pas : l'appel n'a bien qu'un argument, mais cet argument est une chaîne à texte fixe | si la sortie réelle **contient** l'annonce sans lui être égale, on ne juge pas — une vraie faute reste vue, puisqu'alors la valeur annoncée n'apparaît **pas** dans le réel |

  S'y ajoutent les règles de base de l'ancrage : on ne juge une annonce que si sa ligne a produit **exactement une** sortie (zéro ou plusieurs — une boucle — restent non jugés), et on renonce entièrement si **une seule** sortie n'a pas de ligne connue. Côté Python, on renonce aussi si la concaténation des `print` ne redonne pas **exactement** stdout : quelque chose a écrit hors de `print`, et l'appariement serait faux d'un cran.

  **4. Mesure avant / après**, `node tools/verif-exemples.js --pas-exos`, 1 612 leçons :

  | | avant | après |
  |---|---:|---:|
  | blocs porteurs d'une valeur annoncée | 1 053 | 1 051 |
  | **confrontés au réel** | **606** | **682** |
  | dont ancrés par ligne | 0 | **74** |
  | non confrontés | 447 | **369** |
  | dont « comptes inégaux » | **119** | **45** |
  | divergences | 0 | **0** |

  Les 2 annonces disparues sont les gloses que le motif de chaîne citée retenait à tort. **Part des annonces confrontées : 57,6 % → 64,9 %.** Aucune leçon modifiée, aucun octet ajouté au site : le gain est entièrement dans l'outil.

  **5. Non-régression, mesurée par comparaison des verdicts et pas par confiance.** Les deux versions ont été lancées en `--json` et leurs verdicts appariés bloc à bloc : **0 conforme perdu, 76 gagnés**. C'est le contrôle qui manquait aux motifs trop larges du chantier.

  **6. Contre-épreuve — un outil qui ne trouve rien doit prouver qu'il sait trouver.** 0 divergence sur tout le site est un bon résultat, pas une preuve. En faussant **une annonce d'un bloc ancré** (`algo/lecon-03`, `// -1` → `// -2`, un bloc auparavant « non vérifié (compte) » donc jamais jugé) : l'outil rend **1 divergence et sort en code 1** ; après retour en arrière, **0 et code 0**. La ligne faussée était bien de celles que l'ancrage vient de rendre jugeables.

  **7. Contrôles.** `verif.js --rapide` **tout vert, 7 étapes** (source, données, contenu, exemples, motifs, requêtes, Python) en 27,4 s. `verif-donnees` 0 erreur. 0 URL de CDN dans `tools/`, `js/`, `css/`. Un seul fichier modifié (`tools/verif-exemples.js`, +222/−15) ; **aucune page du site touchée**, donc ni index à régénérer ni rendu à remesurer.

  🔵 **Ce qui reste, et qui ne se règle pas par un motif** : 96 blocs à API navigateur/Node, 64 fragments dépendant d'un bloc précédent (`ReferenceError`), 45 comptes inégaux irréductibles, 42 gloses françaises, 40 dépendants du système, 39 erreurs d'exécution, 32 non déterministes, 11 liés à la locale. Les 64 fragments sont le prochain gisement : les concaténer au bloc précédent de la même page les rendrait exécutables, mais **ce n'est pas ce que fait le site** — `runner.js` exécute chaque bloc seul — et l'outil doit mesurer ce que l'apprenant obtient, pas ce qui serait commode.
**B7 est BORNÉ le 2026-08-26**, comme B5 et B6 l'ont été : « les cours les plus consultés d'abord » ne désigne rien de mesurable — le site n'a aucune statistique de consultation. Le critère de substitution est celui que A5 a mesuré : **le gisement de sorties déjà affirmées**, seul matériau autorisé par la règle. D'où l'ordre `ruby` (186 blocs), `kotlin` (151), puis le reste (`cpp` 70, `rust` 65, `elixir` 65, `bash` 65, `c` 62, `php` 50, `java` 40, `csharp` 37…). **Une case par lot.**

- [x] **B7a · Le lot `ruby`** (le plus gros gisement : 186 blocs sur 246 annoncent leur sortie, 76 %). ✅ **2026-08-26. 14 exercices de prédiction, 56 réponses tapées dans Chrome et 56 acceptées — et 56 fausses refusées. Deux exercices écartés PAR UN CONTRÔLE, pas par jugement.**

  **1. Pourquoi la prédiction, et pas l'exécution.** Vérifié avant d'écrire : `ruby` n'a **aucun** interpréteur disponible ici (`ruby`, `php`, `java`, `go`, `rustc`, `gcc`, `elixir`, `kotlin` : tous absents ; seul `dotnet` répond). Aucune sortie ruby ne peut donc être calculée. La règle A5 est la seule issue honnête : **on ne bâtit un exercice que sur une sortie déjà affirmée par la leçon**.

  **2. L'outil neuf `tools/prediction-exos.js` — et son principe : IL N'ÉCRIT AUCUNE VALEUR.** Le code cité est EXTRAIT du bloc de la leçon ; la réponse attendue est EXTRAITE du commentaire `# =>` de la ligne visée. La table du script ne fait que **désigner une ligne** et rédiger l'énoncé, les trois indices et le lien. Dans le code cité, **toutes** les annonces de sortie sont retirées et la ligne visée porte `# => ?` : l'apprenant ne peut pas lire la réponse des lignes voisines.

  **3. Trois contrôles bloquants avant écriture — et le troisième a écarté deux exercices que j'aurais écrits.**
  - la ligne visée doit porter une annonce de sortie (sinon on ne sait pas ce qu'on demande) ;
  - la réponse attendue doit passer le champ, vérifié avec `normExo` **reproduit depuis `js/lecon.js`** (le juge du site, pas une approximation) ;
  - **la réponse ne doit pas rester lisible dans le code cité.** `lecon-09` (`Compte.devise # => "CHF"`) et `lecon-21` (`compteur # => 1000`) ont été refusés à ce titre : `"CHF"` est écrit dans la sous-classe, `1000` se lit dans le code des fils. Le premier a été remplacé par une cible meilleure (`a == b # => true`, où la classe redéfinit `==` sur le seul IBAN) ; le second est **abandonné**, la leçon n'ayant pas d'autre sortie affirmée.

  **4. Les graphies acceptées, calculées et non devinées.** `normExo` réduit les suites d'espaces mais **ne les supprime pas** : `[18,15]` n'est pas `[18, 15]`. Le script génère donc, pour chaque réponse, la graphie de la leçon, la même sans ses guillemets englobants, et les deux sans espace après les virgules — 1 à 4 graphies selon le cas.

  **5. Les 14 exercices** (leçon → ce qu'on fait prédire → réponse extraite) :

  | | | | | |
  |---|---|---|---|---|
  | 02 `"3a".to_i` → `3` | 03 `puts "b" if 0` → `b` | 04 `langages[99]` → `nil` | 05 `contact.delete(:metier)` → `"informaticienne"` | 06 `addition_proc.call(1)` → `1` |
  | 07 `take_while` → `[18, 15]` | 08 `prix_ttc(100)` → `120.0` | 09 `a == b` → `true` | 10 `clamp(...).to_s` → `"3.4"` | 11 `.inverse_mots` → `"dort chat le"` |
  | 12 `puts e.class` → `ArgumentError` | 18 `gsub(/lapins?/, "chat")` → `"1 chat, 2 chat"` | 19 `.to_json` → `'{"ville":"Lyon","hab":522000}'` | 20 `premier, *reste` → `[2, 3, 4, 5]` | |

  Ce sont des **pièges**, pas des récitations : `to_i` qui ne lève pas, `0` truthy, l'indice hors limites qui rend `nil`, le Proc qui ne compte pas ses arguments, `take_while` qui s'arrête au premier échec et rate le `16` qui suit, le retour flottant, l'égalité redéfinie, `clamp` qui rend la borne.

  **6. Outil neuf `tools/preuves/exos-texte.js` — les `type:"text"` jugés PAR LA PAGE, pour la première fois.** 4 199 exercices du site sont corrigés par un champ `accept` et **aucun n'avait jamais été tapé dans un navigateur**. Or la phase B a montré deux fois la même panne (8 exercices de `regex`, 5 d'`offensive`) : un `accept` appartenant à un AUTRE exercice que l'énoncé affiché, invisible pour un contrôle de source. L'outil ouvre la leçon dans Chrome headless, en `file://`, **sans** `--allow-file-access-from-files`, tape la réponse publiée et lit le verdict. Résultat sur les 14 leçons : **56 réponses tapées, 56 acceptées, 0 refusée** (22,8 s) — les 14 neuves **et les 42 préexistantes** du cours.

  Et dans l'autre sens, `--contre` : **56 réponses plausibles mais fausses tapées, 56 REFUSÉES, 0 acceptée à tort** (22,5 s). Prouver qu'une bonne réponse passe ne prouve que la moitié — un correcteur qui accepterait tout réussirait le premier contrôle.

  ⚠️ **Le piège de l'outil, et il aurait rendu un vert par vacuité.** Le premier jet attendait 1,2 s puis lisait la page : **4 exercices sur 8 revenaient « sans champ »**, non parce qu'ils n'en avaient pas, mais parce que `initExos` n'avait pas fini. Une page lue trop tôt rend **zéro exercice**, ce qui se serait lu comme « rien à juger » — le même vert par vacuité que le champ `groupes` oublié en B5. L'outil attend désormais que les champs SOIENT POSÉS, pas un délai.

  **7. Le piège d'insertion, évité par le contrôle et non par la chance.** `initExos` apparie `data-exos` aux blocs `.exercise` **par index**. Contrôle passé sur les 22 leçons **avant** écriture : toutes à 3 pour 3, sauf le capstone `lecon-22` (5 blocs, 4 entrées — écart délibéré et préexistant), qui n'a **pas** été touché. Contrôle repassé après écriture : **aucun décalage introduit**.

  **8. Mesure.** Exercices à champ : **4 539 → 4 553** (+14). Exercices de prédiction sur le site : **0 → 14**, tous dans `ruby`. Les exercices corrigés **par exécution** ne bougent pas (**354**) : un exercice de prédiction est un `type:"text"`, il ne prétend pas être exécuté. **0 octet de moteur ajouté.**

  **9. Contrôles.** `verif.js --rapide` **tout vert, 7 étapes** (34,1 s). `verif-html` **0/0 sur 1 612 fichiers**. `verif-donnees` **0 erreur sur 25 invariants**. `verif-rendu` **0 erreur / 0 avertissement sur 18 mesures** (3 pages ruby × 3 largeurs × 2 thèmes, réseau coupé). `search-index.js` régénéré (43 774 mots) ; quiz, flashcards, antisèches et `search-lite` **identiques**. 0 URL de CDN. Le générateur est **idempotent** : relancé, il ne réécrit rien.

- [x] **B7b · Le lot `kotlin`** ✅ **2026-08-26. 11 exercices de prédiction, 44 réponses tapées dans Chrome et 44 acceptées ; 44 fausses, 44 refusées. Le lot a été ÉCRIT, DÉMOLI PAR CONTRADICTION, PUIS REFAIT — c'est le vrai résultat de cette case.**

  **1. La mesure du plan se reproduit exactement.** 151 blocs sur 212 annoncent leur sortie dans `pages/kotlin` (71 %), 0 sur 18 dans `mobile` : le « 151 sur 230, 2 cours » du plan est juste, mais le gisement tient dans **un seul** cours. L'idiome kotlin est `// =>` — **368 lignes d'annonce**. ⚠️ **Piège de mesure** : un premier comptage donnait 11 blocs au lieu de 151, parce que `>` s'écrit `&gt;` dans le source. **Compter des annonces sans décoder les entités HTML sous-estime d'un facteur 14.**

  **2. Alignement vérifié avant d'écrire** (l'avertissement du plan) : les 21 leçons sont à **3 blocs `.exercise` pour 3 entrées `data-exos`**, sauf le capstone `lecon-21` (4 pour 3, écart préexistant et délibéré) — **non touché**, comme `ruby/lecon-22` en B7a.

  **3. LE FAN-OUT DE CONTRADICTION A DÉMOLI LE PREMIER JET, ET IL AVAIT RAISON.** 12 exercices écrits, tous mes contrôles verts, `verif.js --rapide` vert, 48 réponses acceptées et 48 fausses refusées dans Chrome — puis trois agents chargés de les détruire ont rendu **21 fautes, dont 2 bloquantes**. Aucune n'était une réponse fausse (les trois ont simulé les 12 codes : **12 valeurs sur 12 exactes**). Toutes portaient sur ce qu'aucun de mes contrôles ne regardait :

  | ce qui a été trouvé | vérifié par moi | traitement |
  |---|---|---|
  | **`lecon-05` : réponse non discriminante.** Les deux `println(taches)` du bloc ne diffèrent que par la CASSE, et `normExo` finit par `toLowerCase()` : `[dormir, manger]` — la sortie de la ligne PRÉCÉDENTE — était acceptée | **reproduit en exécutant `normExo`** : 4 graphies sur 4 acceptées, dont celle de la ligne d'avant | cible abandonnée, **contrôle 7** neuf |
  | **`lecon-01` : le code cité ne compile pas.** Le bloc se termine par `langage = "Java"` sur un `val` : rien ne s'affiche, la sortie annoncée est inatteignable | lu dans le bloc | cible abandonnée, **contrôle 8** neuf |
  | **La réponse est imprimée en clair PLUS HAUT SUR LA MÊME PAGE**, dans le `// =>` du bloc d'origine — et le lien « Revoir » y menait | vérifié sur les 12 | **conception changée** (voir 4) |
  | `lecon-04` : réponse binaire (`true`/`false`) et 3ᵉ indice qui la calcule | oui | cible remplacée |
  | `lecon-07` : indice inexact (« sept ne se divise pas en trois » — si : 3 + 3 + 1) | oui | réécrit |
  | « elle n'a pas été recalculée ici » : **note de chantier publiée à l'apprenant** | oui, sur 26 pages | phrase supprimée, remplacée par le raisonnement |
  | Double point d'interrogation dans l'énoncé (`// => ? ?`) | oui | énoncé reformulé |
  | Contrôle 5 désactivé pour toute réponse de 2 caractères ou moins (`14` n'était contrôlé par rien) | oui | seuil supprimé |
  | `lecon-11` : lien vers « Délégation de classe », alors que l'exercice porte sur une propriété déléguée | oui | libellé corrigé |
  | `lecon-12` : « la virgule et l'espace comprises » (accord) | oui | corrigé |

  **4. Le changement de conception, qui est l'apport de cette case : l'exercice n'est plus posé dans la leçon dont il cite le bloc.** La règle fondatrice — ne bâtir que sur une sortie DÉJÀ AFFIRMÉE — rend le conflit **inévitable** en intra-page : si la leçon annonce la sortie, elle l'imprime. Le champ `page` sépare donc la leçon **source** (d'où vient le bloc) de la leçon **hôte** (où l'on interroge) : bloc de la leçon *n*, exercice dans la leçon *n+1*. L'affirmation reste relue et publiée, mais plus sur la page où l'on répond, et le lien « Revoir » redevient utile au lieu d'être un raccourci vers la solution. **B7a (ruby) n'a pas cette propriété** : dette assumée, chiffrée au point 8.

  **5. Cinq contrôles bloquants neufs dans `tools/prediction-exos.js`, chacun avec sa contre-épreuve.** Un contrôle qui n'a jamais rien refusé ne prouve rien :

  | contrôle | ce qu'il refuse | contre-épreuve jouée |
  |---|---|---|
  | **6** | la ligne visée figure dans la page hôte | `page` remis à `09` → **refusé** : « la ligne visée « println(a === b) » figure déjà dans la page » |
  | **7** | une autre annonce du bloc est indiscernable au sens de `normExo` | cible `[DORMIR, manger]` réintroduite → **refusée**, la ligne coupable citée |
  | **8** | le bloc annonce une erreur de compilation sur une ligne active | cible `lecon-01` réintroduite → **refusée** : « le bloc ne compile pas (« langage = "Java" ») » |
  | **9** | la page hôte est désalignée `.exercise` ⇄ `data-exos` | préventif : `lecon-21` serait refusée |
  | **10** | un mot insécable de plus de 30 caractères dans le placeholder | mesuré par `verif-rendu` avant/après |

  ⚠️ **Le contrôle 8 était FAUX à son premier jet, et c'est sa propre contre-épreuve qui l'a montré** : il prenait la ligne d'annonce pour la ligne visée dès qu'elle commençait par `//`, donc il ne refusait jamais rien. **Un contrôle qui ne peut pas échouer ne contrôle rien** — la contre-épreuve n'est pas une formalité, c'est le seul moyen de le savoir.

  **6. Deux régressions de MA main, trouvées par les outils du dépôt et corrigées.**
  - **Une classe CSS inventée.** Le gabarit posait `<p class="text-muted">` : **`.text-muted` n'existe nulle part dans le CSS du site** (les 11 occurrences étaient les miennes). Remplacée par `<em>`, et le contrôle qui manquait est désormais fait : comparer chaque classe employée au CSS réel.
  - **Un débordement mobile, mesuré et expliqué.** `verif-rendu` a signalé +26 px à 320 px sur `lecon-05` ; la version HEAD ne débordait pas → **régression de mon fait**. Cause exacte : `.exo-try__label` se coupe aux espaces mais pas au milieu d'un mot, et mon placeholder contenait `println(decrire(celsiusVersFahrenheit(20.0),` — **44 caractères insécables**. Ce n'est **pas** la longueur totale qui gêne : le site porte des placeholders de **375 caractères** sans déborder. Placeholders raccourcis, **contrôle 10** ajouté, **0 erreur** au remesurage.

  **7. Les 11 exercices** (bloc de la leçon *n* → exercice dans la leçon *n+1*) :

  | source → hôte | ce qu'on fait prédire | réponse extraite |
  |---|---|---|
  | 02 → 03 | `note.toInt()` sur 16.7 | `16` |
  | 03 → 04 | `for (i in 1..3) print("$i ")` | `1 2 3` |
  | 04 → 05 | `decrire(celsiusVersFahrenheit(20.0), "°F")` | `68.0 °F` |
  | 05 → 06 | `reponses.filterNotNull()` | `[oui, non]` |
  | 06 → 07 | `nombres.drop(7)` sur 1..10 | `[8, 9, 10]` |
  | 07 → 08 | `(1..7).toList().chunked(3)` | `[[1, 2, 3], [4, 5, 6], [7]]` |
  | 08 → 09 | `p.majeur` après `p.age = 18` | `true` |
  | 09 → 10 | `a === b` sur une data class | `false` |
  | 10 → 11 | `Point(1, 2) == Point(1, 2)`, classe ordinaire | `false` |
  | 11 → 12 | `c.valeur = 8` avec `Delegates.observable` | `5 -> 8` |
  | 12 → 13 | `with(accueil) { length }` | `14` |

  Ce sont des pièges : la troncature qui n'arrondit pas, le range inclusif, la valeur par défaut d'un paramètre, `filterNotNull` qui change la taille, `drop(7)` qui enlève les sept **premières** valeurs, sept éléments qui font trois morceaux dont un incomplet, la propriété sans champ, `===` contre `==`, et la classe qui n'est **pas** une data class.

  **8. Réserves assumées, mesurées et non masquées.**
  - **3 réponses sur 11 sont booléennes** (`true`, `false`, `false`) : une chance sur deux au hasard. Gardées parce que ce sont les points centraux de leurs leçons (`===`, l'`equals` d'`Any`, le getter recalculé) ; l'outil l'**affiche** désormais à chaque passe.
  - Sur ces 3 pages, la valeur `true` ou `false` apparaît par ailleurs, sur d'autres lignes sans rapport — inévitable pour un booléen. **Mesuré : 8 exercices sur 11 ont une réponse introuvable ailleurs dans leur page hôte.**
  - **B7a (ruby) garde le défaut de conception corrigé ici** : ses 14 exercices sont posés dans la leçon qui publie la réponse, et portent la phrase de chantier. À reprendre — c'est le commit suivant.

  **9. Contrôles.** `verif.js --rapide` **tout vert, 7 étapes** (34,1 s). `verif-html` **0/0 sur 1 612 fichiers**. `verif-donnees` **0 erreur**. `verif-rendu` sur les **10 pages hôtes** (60 mesures, 3 largeurs × 2 thèmes, réseau coupé) : **0 erreur introduite**. `search-index` régénéré ; quiz, flashcards, antisèches et `search-lite` **identiques**. 0 URL de CDN. Générateur **idempotent** (relancé : « 11 déjà en place »). Les 21 leçons kotlin : JSON valide, 0 BOM, `<div>` équilibrés, alignement conservé.

  🔵 **Relevé hors périmètre, établi par comparaison avec HEAD** : `kotlin/lecon-07` (+201 px) et `kotlin/lecon-09` (+462 px) débordent à 1280 px **avant comme après** mon passage. Cause pour `lecon-09` : un `<code>` inline de **146 caractères** dans la section « Un cas réel », que `white-space: nowrap` empêche de couper.

  **10. Mesure.** Exercices à champ : **4 553 → 4 564** (+11). Exercices de prédiction sur le site : **14 → 25**. Exercices corrigés **par exécution** : **354**, inchangés — un exercice de prédiction est un `type:"text"`, il ne prétend pas être exécuté ; la part exécutée passe donc mécaniquement de 7,77 % à **7,76 %**, et c'est normal. **0 octet de moteur ajouté.**
**B7c est SCINDÉ le 2026-08-26**, comme le plan le prévoyait (« un lot par famille ») : les huit cours n'ont ni le même gisement ni le même idiome, et la première passe a dû ÉCRIRE UN DEUXIÈME ANALYSEUR avant de pouvoir écrire un seul exercice. Une case par lot.

- [x] **B7c-1 · Le lot `cpp`** ✅ **2026-08-26. Premier lot de prédiction dont les sorties ont été RECALCULÉES et non reprises sur parole — et premier où la contradiction a trouvé une faute que MES contrôles ne pouvaient pas trouver : le commentaire français qui énonce la réponse.**

  **1. La mesure du plan était juste sur le compte, fausse sur l'idiome — et c'est ce qui a fait le travail de la case.** Le plan annonçait « cpp 70 » : `mesure-prediction.js` confirme **70 blocs sur 232**. Mais ces 70 blocs n'écrivent PAS leur sortie comme Ruby et Kotlin. Mesuré sur les 8 cours du point :

  | cours | blocs | annonce **en fin de ligne** (`// => x`, l'idiome de B7a/B7b) | **bloc « // Sortie : » en fin de programme** |
  |---|---:|---:|---:|
  | `cpp` | 232 | **2** | **64** |
  | `rust` | 214 | 0 | 50 |
  | `java` | 228 | 0 | 37 |
  | `csharp` | 247 | 0 | 31 |
  | `php` | 204 | 6 | 29 |
  | `c` | 215 | 0 | 28 |
  | `go` | 197 | 1 | 22 |
  | `elixir` | 163 | 10 | 1 |

  **L'outil `tools/prediction-exos.js` ne savait lire aucun de ces 262 blocs.** Il ne connaissait que l'annonce de fin de ligne. Une case « écrire des exercices » était en réalité une case « apprendre à lire un deuxième idiome ».

  **2. La forme `bloc`, et la règle stricte qui écarte toute seule le non déterministe.** Le lot déclare `forme:'bloc'` : on cite le programme entier, on masque UNE ligne de sa sortie par `// ?`, les autres restent visibles. La tête est **stricte** — `// Sortie :` et rien d'autre. Conséquence non prévue et heureuse : `// Sortie typique`, `// Sortie attendue`, `// Sortie probable`, `// Sortie (avec reserve(2))` sont refusées d'office, et **ce sont exactement les cas que le cours déclare non reproductibles** : le banc d'essai à 320 ns, le comportement indéfini de `lecon-06`, la « corruption du tas » de `lecon-12`, et surtout l'état d'une `std::string` après `std::move` — « valide mais NON SPÉCIFIÉ », dit la leçon. Prédire `source : []` aurait été enseigner le faux. **Une règle de forme a fait le tri sémantique.**

  **3. LES SORTIES ONT ÉTÉ RECALCULÉES. C'est l'apport de fond, et B7a/B7b ne l'avaient pas.** Aucun compilateur C++ n'existe ici (`g++`, `clang++`, `cl` absents ; `dotnet` n'a **que le runtime**, pas de SDK — vérifié, donc C# non plus). Mais ces programmes sont de l'algorithmique déterministe : `scratchpad/v14-b7c/rejoue-cpp.js` les transpose et reproduit `std::cout` là où sont les pièges — un `bool` sort `1` sans `boolalpha`, un `double` sort à 6 chiffres significatifs sans zéro final (7.0 → « 7 »), `std::string::size()` compte des **octets**, une `std::map` est triée par clé, l'apostrophe de `1'000'000` sépare les chiffres. Confronté aux sorties **extraites du HTML**, jamais retapées : **12 programmes, 21 lignes de sortie, 0 divergence.**

  **Contre-épreuve** — un rejeu qui ne trouve rien doit prouver qu'il sait trouver : en faussant la seule règle du `bool` (`1` → `true`), **2 divergences** apparaissent et sont nommées ; après retour en arrière, **0**. Ce que ça prouve : la valeur affirmée est celle de l'algorithme, opérateur d'affichage compris. Ce que ça ne prouve pas : que le C++ compile. C'est écrit dans l'en-tête du script.

  **4. LE FAN-OUT DE CONTRADICTION A DÉTRUIT LE PREMIER JET — pour la deuxième fois, et sur un trou que rien d'automatique ne pouvait voir.** 11 exercices écrits, mes 10 contrôles verts, `verif.js --rapide` vert, **44 réponses acceptées et 44 fausses refusées dans Chrome**, `verif-rendu` 66 mesures sans un avertissement. Trois agents chargés de les démolir (calcul / triche / rédaction) ont rendu **26 fautes, dont 5 bloquantes**. Aucune n'était une valeur fausse — le contradicteur « calcul » a retranspilé les 11 programmes et retrouvé **11 sorties sur 11 identiques**. Toutes portaient sur ce qu'aucun contrôle ne regardait :

  | ce qui a été trouvé | vérifié par moi | traitement |
  |---|---|---|
  | **Un commentaire ÉNONCE la réponse, en français.** `// modifie b, pas a (tableaux distincts)` dit que `a` garde 7 et `b` vaut 99 ; `// v == {9, 8, 5, 2, 1}` donne le tri qu'on demandait de faire ; `// COPIE : duplique le million d'éléments` donne les DEUX points de son exercice | oui, lus dans les 3 blocs | champ **`masquer`** neuf (le commentaire est neutralisé dans la citation, la leçon d'origine intacte) + **contrôle 11** |
  | **`lecon-04` : la réponse est déterminée par ÉLIMINATION.** La `std::map` n'a que deux entrées et l'autre ligne de sortie reste visible ; en prime, le commentaire au-dessus énonce la règle testée | oui | **cible abandonnée** — 11 exercices deviennent 10 |
  | **Un `<` non échappé dans le HTML.** Le champ `pourquoi` était concaténé **sans passer par `enc()`** : « l'operator<< maison » a produit deux chevrons bruts. **1 occurrence sur 1 612 fichiers**, invisible à l'œil, et `verif-html.js` ne la voit pas | oui, `grep` | `enc(t.pourquoi)` — **vrai bug du générateur** |
  | **L'énoncé était FAUX sur 4 pages** : il annonce un marqueur `// ?` alors que le code portait `// Sortie : ?` (sortie tenant sur la tête) | oui, mesuré sur les 11 | le « ? » occupe **toujours** sa propre ligne |
  | **L'énoncé promettait une « sortie complète » là où le programme n'affiche qu'UNE ligne** — 5 cibles sur 11 | oui | énoncé choisi selon le nombre réel de lignes |
  | `lecon-08` : `a * 3 = (3,6)` REFUSÉ alors que la réponse est comprise — `graphies()` réservait la tolérance sur la virgule aux valeurs commençant par `[` ou `{` | oui, en exécutant `normExo` | critère élargi à toute **liste entre parenthèses ou crochets** |
  | Deux libellés de lien en apostrophe courbe quand les titres réels ont l'apostrophe droite (`La surcharge d'opérateurs`, `Gestion d'erreurs…`) | oui, `grep` sur les `<h1>` | alignés sur le titre réel |
  | `lecon-09` : l'indice écrit `1’000’000` en apostrophe **typographique** — du C++ invalide, dans l'exercice qui porte précisément sur ce caractère | oui, octet par octet | réécrit avec l'apostrophe droite |
  | `lecon-19` : le 3ᵉ indice énonçait le résultat au lieu d'une règle | oui | réécrit |
  | `lecon-17` : deux lignes d'explication placées **sous** `// Sortie :` se lisent comme de la sortie | oui | retirées de la citation |

  **5. Le contrôle 11, et le vert par vacuité qu'il a failli être.** Premier jet : comparer les MOTS du commentaire à ceux de la réponse. Contre-épreuve — masquage retiré sur `lecon-06` : **l'outil n'a rien dit**. La réponse `a[0]=7  b[0]=99` n'a aucun mot de deux lettres, et « modifie b, pas a » n'en partage évidemment aucun. **La prose française qui révèle un résultat n'est pas détectable par recoupement de tokens** ; prétendre le contraire aurait rendu un contrôle incapable d'échouer — la troisième fois de ce chantier.

  Ce qui est réellement mesurable, c'est le **nombre** de commentaires que la citation laisse à l'apprenant. La cible doit le déclarer (`commentaires: N`) ; l'outil les **affiche tous, un par un**, ce qui oblige à les lire à l'écriture, et si la leçon source change plus tard le compte diverge et l'outil refuse. Il ne juge pas le sens : il garantit qu'aucun commentaire n'entre dans un exercice sans avoir été vu. **Il a refusé son premier compte à moi** (`lecon-06` : 6 commentaires, j'en avais déclaré 5) et fait apparaître le troisième révélateur, `// Constructeur de COPIE : duplique le tableau (copie profonde)`, que la contradiction n'avait pas cité.

  **6. Un piège d'environnement, coûteux et invisible : `core.autocrlf`.** Après un `git checkout` de retour en arrière, **4 cibles sur 11 sont tombées** avec « pas de tête Sortie : stricte » — sans qu'une ligne du site ni de la table ait changé. Cause : `core.autocrlf` vaut `true`, le checkout a réécrit les pages en **CRLF**, et un motif terminé par `$` **sans le drapeau `m`** ne matche plus une ligne suivie d'un `\r` (le `.` ne traverse pas un retour chariot). Les 11 pages ont été remises en LF (le site en compte 1 689 en LF pour 79 en CRLF ; `git diff` reste vide, Git normalisant à l'index) et `dec()` retire désormais les `\r` **avant tout**. ⚠️ **Deuxième piège du même réveil** : un `heredoc` Bash de cet environnement réduit `\\` en `\` — un `[\\s\\S]` écrit dans un script y arrive en `[\s\S]`, c'est-à-dire `[sS]`, et la mesure rend **0 sur toute la ligne**. Écrire ces fichiers avec l'outil d'écriture, pas avec un heredoc.

  **7. Les 10 exercices** (bloc de la leçon *n* → exercice dans une leçon suivante) :

  | source → hôte | ce qu'on fait prédire | réponse recalculée |
  |---|---|---|
  | 01 → 02 | `doubler(3)` et `doubler(3.5)`, deux surcharges | `6 et 7` |
  | 02 → 03 | `texte.size()` sur « Bonjour le C++ » | `[Bonjour le C++] (14 caracteres)` |
  | 05 → 06 | `b = a` puis `b.set(0, 99)`, règle de trois | `a[0]=7  b[0]=99` |
  | 07 → 08 | `a * 3.0` sur le vecteur (1, 2) | `a * 3   = (3, 6)` |
  | 08 → 09 | `a.size()` et `b.size()` après copie de `1'000'000` | `1000000 1000000` |
  | 11 → 12 | `find_if(x > 4)` **après** un tri décroissant | `premier > 4 : 9` |
  | 13 → 14 | `b.value_or(-1)` sur un `optional` vide | `b = -1` |
  | 16 → 17 | un fold sur `<<` dont le dernier argument est un `bool` | `x = 42, ok=1` |
  | 17 → 18 | `filter` des pairs puis `transform` au carré, sur 1..8 | `4 16 36 64` |
  | 17 → 19 | `compteur(4)` avec `co_yield` | `0 1 2 3` |

  Ce sont des pièges : la surcharge choisie par le type et le `7.0` que `cout` écrit « 7 », le `size()` qui compte les espaces et les deux `+`, la copie **profonde** qui rend les tableaux indépendants, le séparateur de chiffres du C++14, l'ordre tri-puis-recherche, l'`optional` vide, et le `bool` qui sort `1` faute de `boolalpha`.

  **8. Réserves assumées, mesurées, non masquées.**
  - **La réponse reste lisible dans la leçon SOURCE, et l'énoncé y renvoie.** Vérifié : `// 6 et 7` est en clair dans `cpp/lecon-01`, `// premier > 4 : 9` dans `cpp/lecon-11`, et ainsi des 10. **C'est inhérent à la règle A5** : on ne bâtit que sur une sortie DÉJÀ AFFIRMÉE, donc elle est écrite quelque part. B7b avait déplacé l'exercice d'une leçon ; cela met la réponse à un clic au lieu de zéro, pas à l'abri. Les 25 exercices `ruby`/`kotlin` ont le même défaut. **Le trancher demande un choix éditorial** (masquer aussi la ligne dans la leçon d'origine, ou assumer que le lien « Revoir » est une aide et non une triche) : laissé au chantier, pas décidé en passant.
  - **Deux exercices sont faibles et je le dis** : `lecon-03` fait surtout **compter des caractères** (91 % de la réponse est recopiable du code), et `lecon-02` laisse le `7` visible deux fois. Gardés parce qu'ils enseignent chacun un point réel, mais ce ne sont pas les meilleurs du lot.
  - **`lecon-12` emploie un TROISIÈME idiome**, le commentaire de bloc `/* Sortie : … */`, que la forme `bloc` ne lit pas. Un seul bloc du cours est dans ce cas : un troisième analyseur ne se justifiait pas.

  **9. Une dette de B7a, découverte par un mode neuf et NON corrigée ici.** L'idempotence de l'outil masque toute régression : un lot écrit ne repasse plus jamais dans le calcul. Le drapeau **`--rejouer`** lève ce court-circuit sans jamais écrire. Résultat : **5 des 14 exercices `ruby` ne passent pas les contrôles 5 et 7**, instaurés APRÈS eux en B7b — `lecon-02` (`3` lisible dans `"3a"`), `lecon-03` (`b` lisible dans `"b"`), `lecon-06` (`1` lisible dans `call(1)`), `lecon-07` (`[18, 15]` écrit deux fois dans le bloc), `lecon-09` (`true` écrit ailleurs). Les deux derniers sont de vrais défauts : la réponse se recopie. **Mesuré, chiffré, laissé à une case propre** — le mélanger à B7c aurait fait deux travaux à moitié.

  **10. Contrôles.** `verif.js --rapide` **tout vert, 7 étapes** (35,4 s). `verif-html` **0 grave / 0 attention sur 1 612 fichiers**. `verif-donnees` **0 erreur**. `verif-rendu` sur les **10 pages hôtes** : **60 mesures** (3 largeurs × 2 thèmes), réseau coupé, **0 erreur, 0 avertissement**. `exos-texte.js` dans Chrome, en `file://` sans `--allow-file-access-from-files` : **40 réponses tapées, 40 acceptées** ; passe adversariale **40 fausses tapées, 40 refusées**. Alignement `.exercise` ⇄ `data-exos` : **22 leçons sur 23 à l'identique**, seul le capstone `lecon-23` garde son écart préexistant (4 pour 3) — **non touché**, comme `ruby/lecon-22` et `kotlin/lecon-21`. 0 BOM, JSON valide, `<div>` équilibrés. **0 URL de CDN.** Générateur **idempotent** (relancé : « 10 déjà en place »). `search-index.js` régénéré ; quiz, flashcards, antisèches et `search-lite` **identiques**.

  **11. Mesure.** Exercices à champ : **4 564 → 4 574** (+10). Exercices de prédiction sur le site : **25 → 35**. Exercices corrigés **par exécution** : **354**, inchangés — un exercice de prédiction est un `type:"text"`. **0 octet de moteur ajouté.**

- [x] **B7c-2 · `rust`** ✅ **2026-08-26. 10 exercices de prédiction — et le premier lot dont la contradiction a fait RETIRER et REMPLACER des cibles, pas seulement corriger des textes.**

  **1. La mesure du plan ne se reproduit pas, et il faut le dire : 43 blocs, pas 50.** `scratchpad/v14-b7c2/inventaire-rust.js` applique la règle exacte de la forme `bloc` (tête STRICTE `// Sortie :`) aux **214 blocs `language-rust`** du cours : **43 la portent**, plus **1** tête « Sortie » non stricte. L'écart avec les « 50 blocs » annoncés en B7c-1 vient de la règle de comptage, pas du site. Et le gisement est CONCENTRÉ : ces 43 blocs tiennent dans **7 leçons** (01, 02, 05, 07, 12, 14, 16) sur 22. Les 15 autres leçons n'en portent aucun — ce qui borne mécaniquement le lot, une page hôte ne pouvant recevoir qu'un exercice de prédiction.

  **2. LES SORTIES ONT ÉTÉ RECALCULÉES.** Ni `rustc` ni `cargo` sur cette machine (vérifié). `tools/preuves/rejoue-rust.js` transpose les programmes et reproduit ce que font `Display` et `Debug` : un f64 4.0 s'affiche **« 4 »** (c'est `{:?}` qui écrirait « 4.0 »), un Vec s'affiche **« [1, 2, 3] »** avec l'espace après la virgule, `str::len()` compte des **octets**, `strlen` s'arrête **au NUL**, `1..=5` inclut 5. Confronté aux sorties **extraites du HTML**, jamais retapées : **14 programmes, 20 lignes de sortie, 0 divergence.**

  **Contre-épreuves CIBLÉES, parce qu'un rejeu qui ne trouve rien doit prouver qu'il sait trouver.** `--fausse=float` (le Display d'un f64 écrit « 4.0 ») fait tomber **exactement 1 programme**, celui qui en dépend ; `--fausse=debug` (la virgule du Debug perd son espace) en fait tomber **exactement 2**. Ni plus — donc la mesure discrimine — ni moins.

  ⚠️ **Deux motifs de bloc trop larges ont d'abord fait diverger le rejeu** : `for recu in rx` et `Cons(i32, Box<List>)` désignaient un AUTRE bloc de la même leçon, qui porte une autre sortie. Le rejeu a rendu 2 divergences ; c'était l'outil qui visait mal, pas le site.

  **3. LE FAN-OUT DE CONTRADICTION A REMPLACÉ DEUX CIBLES SUR ONZE ET EN A SUPPRIMÉ UNE.** Trois agents (calcul / triche / rédaction) sur 11 exercices écrits, tous mes contrôles verts, `verif.js --rapide` vert, 44 réponses acceptées et 44 fausses refusées dans Chrome, `verif-rendu` 66 mesures sans un avertissement.

  Le contradicteur **calcul** a retransposé les 11 programmes indépendamment : **11 sorties sur 11 identiques**, code cité fidèle au bloc d'origine ligne à ligne, et les deux programmes à threads (mpsc, `Arc<Mutex>`) confirmés **déterministes** (le `join()` précède l'affichage, la somme est commutative). Les deux autres ont rendu ce que ni lui ni mes contrôles ne pouvaient voir :

  | ce qui a été trouvé | vérifié par moi | traitement |
  |---|---|---|
  | **`lecon-01` : la réponse est la TRANSCRIPTION du code.** `Scores : [10, 7, 15]` est le littéral `let scores = [10, 7, 15];` au format près, et la ligne se devinait EN PLUS par élimination (3 `println!`, 2 lignes visibles) | oui, lu dans le bloc | **cible supprimée** — 11 exercices deviennent 10, et la leçon 01 n'offrait rien d'autre |
  | **`Some(10)` : trois voies de recopie pour une seule réponse.** `Some(val)` est écrit dans le corps de la fonction, le `10` vient de l'appel juste au-dessus, et la ligne restée visible (« None ») montre déjà comment Debug écrit une Option | oui | **cible remplacée** par le bloc FFI `strlen` : le littéral compte 5 octets, la réponse en annonce 4, et aucune ligne visible ne le dit |
  | **Un CARACTÈRE NUL publié dans un indice.** L'échappement Rust du terminateur, écrit avec une séquence JSON à quatre chiffres, devenait un vrai caractère de contrôle une fois le JSON relu par la page : l'apprenant lisait « le littéral écrit «  » ». **1 sur 1 612 fichiers**, invisible à l'œil, invisible à `verif-html` | oui, compté octet par octet | indice reformulé — il **nomme** l'octet au lieu de le citer. ⚠️ Et le piège s'est REPRODUIT en écrivant le commentaire qui le documente : l'outil d'écriture rend cette séquence en octet réel |
  | **« à la fin du code » était FAUX une fois sur deux.** Le bloc `// Sortie :` est souvent écrit À L'INTÉRIEUR de `main()`, avant l'accolade fermante : la consigne de recherche envoyait chercher au mauvais endroit | oui, mesuré : **2 des 11 pages rust, et 5 des 10 pages cpp DÉJÀ PUBLIÉES** | formule corrigée dans le générateur **et sur les 10 pages cpp** (dette de B7c-1 soldée) |
  | **Cinq réponses justes étaient REFUSÉES** pour une habitude de frappe : `Somme=15`, `Total=5000`, `sqrt(16.0)=4`, et `Extrait: …` sans l'espace française | oui, en exécutant `normExo` | `graphies()` élargi à l'espacement autour de `=` et **avant** `:` `;`. Le juge ignore déjà la CASSE et les ACCENTS : refuser une espace de frappe pendant qu'on accepte « SOMME = 15 » n'était pas une exigence, c'était une incohérence |
  | **Six indices sur onze énonçaient le RÉSULTAT, pas une règle** : « la somme des cinq premiers entiers, ni plus ni moins », « 5 threads, chacun incrémentant 1000 fois », « la racine carrée de 16 est exacte » | oui, relus un par un | réécrits : un indice donne une règle ou désigne où regarder |
  | **Un indice promettait une exigence que le juge n'applique pas** (« l'alignement du libellé, espaces comprises ») alors que `normExo` replie toute suite d'espaces | oui, en exécutant `normExo` | indice réécrit |
  | **`extern "C"` transcrit en `extern « C »`** — un débutant qui recopie écrit du Rust invalide | oui | guillemets droits rétablis |
  | **L'apostrophe COURBE des textes rompt avec le cours qui les héberge** | oui : la prose du cours rust compte **1 706 apostrophes droites pour 11 courbes**, et les 11 courbes étaient les miennes | les textes du lot passent à l'apostrophe droite |
  | **Les `<details>` ignoraient l'espace insécable** que leurs voisins respectent (4 `&nbsp;` contre 0 espace simple sur les mêmes pages) | oui | fonction `typo()` dans le générateur, appliquée APRÈS `enc()` et jamais sur du code : **12 `&nbsp;`** posés |

  **4. Une cible écartée par un garde-fou qu'il aurait été facile — et faux — d'assouplir.** La somme des pairs de 1 à 10 (« 30 ») a été refusée par le contrôle 6 : « 30 » figure dans la page hôte… dans des **coordonnées SVG** (`x1="230"`, `y="130"`). Le contrôle cherche une sous-chaîne brute dans tout le HTML et ne peut pas distinguer une divulgation d'un attribut de schéma. **On change de cible plutôt que le garde-fou** — et une réponse d'un nombre nu était de toute façon la plus faible du lot.

  **5. Les 10 exercices** (bloc de la leçon *n* → exercice dans une leçon suivante) :

  | source → hôte | ce qu'on fait prédire | réponse recalculée |
  |---|---|---|
  | 02 → 03 | la valeur de `y` après `y = y + 1` | `y vaut 11` |
  | 05 → 06 | `repeter(mot.clone(), 3)`, séparateur compris | `résultat      : écho écho écho` |
  | 07 → 08 | `split('.').next()` sur une phrase | `Extrait : Appelez-moi Ismaël` |
  | 12 → 13 | un canal `mpsc` qui reçoit `1..=5` | `Somme = 15` |
  | 14 → 15 | une liste cons en `Box`, sommée récursivement | `somme = 6` |
  | 16 → 17 | `couper(&mut data, 2)`, deux tranches | `[1, 2] \| [3, 4]` |
  | 16 → 18 | `sqrt(16.0)` en FFI, affiché par Display | `sqrt(16.0) = 4` |
  | 16 → 19 | `strlen` sur `b"rust\0"` | `strlen = 4` |
  | 12 → 20 | 5 threads × 1000 incréments sous `Mutex` | `Total = 5000` |
  | 14 → 21 | deux `push` via deux `Rc` du même `RefCell` | `[1, 2, 3, 4, 5]` |

  Ce sont des pièges : la borne INCLUSE de `..=`, le point qui n'appartient à aucun segment de `split`, l'espace ajoutée seulement à partir du deuxième tour, le f64 qui s'affiche sans zéro final, le NUL que `strlen` ne compte pas, et le `Rc` qui partage au lieu de copier.

  **6. Réserves assumées, mesurées, non masquées.**
  - **La réponse reste en clair dans la leçon SOURCE, pour 10 sur 10**, et le lien « Revoir » y mène (après 10 essais ratés, `EXO_LINK_STEP`). C'est inhérent à la règle A5 — on ne bâtit que sur une sortie DÉJÀ affirmée — et c'est la même réserve que sur les 35 exercices ruby/kotlin/cpp. **Le trancher reste la case B7c-6.**
  - **`lecon-06` : la réponse publiée ne s'affiche pas au caractère près.** Les 6 espaces d'alignement sont repliées par le navigateur dans un `<code>` hors `<pre>`. Sans effet sur la correction — `normExo` les replie aussi — mais l'apprenant lit un espacement qui n'est pas celui du programme.
  - **Les textes rédigés ne balisent aucun identifiant en `<code>`** (`println!`, `Rc`, `RefCell`…), là où le reste de ces pages en compte 1 193. C'est un choix du générateur, pas un oubli ponctuel ; le corriger vaut pour tous les lots à la fois.
  - **La leçon 11 reste sans exercice** : aucune leçon antérieure n'offrait de cible non triviale, et prendre un bloc de la leçon 12 aurait divulgué la leçon suivante.

  **7. Contrôles.** `verif.js --rapide` **tout vert, 7 étapes** (37,0 s). `verif-html` **0 grave / 0 attention sur 1 612 fichiers**. `verif-donnees` **0 erreur**. `verif-rendu` sur les 10 pages hôtes : **60 mesures** (3 largeurs × 2 thèmes), **0 erreur, 0 avertissement**. `exos-texte.js` dans Chrome, en `file://` sans `--allow-file-access-from-files` : **40 réponses tapées, 40 acceptées** ; passe adversariale **40 fausses tapées, 40 refusées**. 🆕 **`--graphie=N`** ajouté à `exos-texte.js` — une tolérance ajoutée sans être tapée serait une affirmation sans preuve : **30 secondes graphies tapées, 30 acceptées**. Alignement `.exercise` ⇄ `data-exos` : **4 pour 4** sur les 10 pages. 0 BOM, 0 caractère NUL, 0 mojibake, JSON valide, **tout en LF** (les pages repassent en CRLF à chaque `git checkout` : `core.autocrlf` vaut `true`). **0 URL de CDN.** Générateur **idempotent**. `search-index.js` régénéré ; quiz, flashcards, antisèches et `search-lite` **identiques**.

  **8. Mesure.** Exercices à champ : **4 574 → 4 584** (+10). Exercices de prédiction sur le site : **35 → 45** (+10). Exercices corrigés **par exécution** : **354**, inchangés — un exercice de prédiction est un `type:"text"`. **0 octet de moteur ajouté.** Pages corrigées hors lot : **10 pages `cpp`** (consigne de recherche inexacte).
- [x] **B7c-3 · `java` et `csharp`** ✅ **2026-08-26. 14 exercices de prédiction — et le premier lot où le REJEU A CORRIGÉ LE SITE AVANT D'ÉCRIRE : trois sorties étaient fausses.**

  **1. Ni JDK ni SDK .NET, et la mesure du plan ne se reproduit pas.** `javac` et `java` : absents. `dotnet` est là mais **`--list-sdks` ne rend RIEN** (`--list-runtimes` : Microsoft.NETCore.App 8.0.19) — le runtime seul ne compile pas, la réserve inscrite dans le plan est confirmée par la commande. La transposition reste donc la seule voie, comme pour cpp et rust. Et les « 37 et 31 blocs » annoncés ne se retrouvent pas : avec la règle exacte de la forme `bloc` (tête STRICTE `// Sortie :`), `scratchpad/v14-b7c3/inventaire.js` compte **28 blocs java sur 228** et **22 csharp sur 247** — l'écart vient de la règle de comptage, comme pour rust (43 mesurés contre 50 annoncés). Le gisement est CONCENTRÉ : java dans 4 leçons (01, 03, 04, 06) sur 23, csharp dans 5 (01, 04, 05, 09, 12) sur 23.

  **2. LES 50 PROGRAMMES ONT ÉTÉ REJOUÉS — ET TROIS SORTIES DU SITE ÉTAIENT FAUSSES.** Deux outils neufs sur le modèle de `rejoue-rust.js` : `tools/preuves/rejoue-java.js` (**28 programmes, 56 lignes**) et `tools/preuves/rejoue-csharp.js` (**22 programmes, 33 lignes, 1 glose écartée**). Ils reproduisent ce que chaque langage IMPRIME et confrontent à la sortie **extraite du HTML**, jamais retapée.

  | le bloc | ce que la leçon annonçait | ce que le programme fait |
  |---|---|---|
  | `java/lecon-03`, boucles étiquetées | `0,0` / `0,1` / **`1,0`** | **`0,0` / `0,1`** — `break externe` sort des DEUX boucles, et `1,0` est la sortie d'un `break` SIMPLE |
  | `java/lecon-04`, tableau à deux dimensions | 2 lignes (`1 2 3` / `4 5 6`) | **5 lignes** : trois `println` (6, 2, 3) précèdent la boucle |
  | `csharp/lecon-04`, grille | 2 lignes | **5 lignes** — même faute, même correction |

  La première est la plus grave : **l'exemple contredisait son propre commentaire** (« sort des DEUX boucles d'un coup ») trois lignes plus bas, et la contre-épreuve le prouve — `--fausse=label`, qui remplace le `break` étiqueté par un `break` simple, rend le bloc **conforme**. Quatre vérificateurs verts n'avaient rien vu, parce qu'aucun n'exécute.

  **Contre-épreuves ciblées** (un rejeu qui ne trouve rien doit prouver qu'il sait trouver) : java `--fausse=divent` fait tomber **exactement 1** programme (le seul qui dépende de `17 / 4 = 4`), `--fausse=arrondi` **exactement 2** ; csharp `--fausse=write` **1** (les trois `Console.Write` d'une même ligne), `--fausse=zero` **4** (les `decimal`/`double` sans zéro final), `--fausse=static` **1** (le compteur partagé). Après correction : **28/28 et 22/22, 0 divergence.**

  **3. Une « sortie » qui n'en est pas.** `csharp/lecon-12` intercale « (2 secondes plus tard) » au milieu de la sortie de son programme asynchrone : c'est une GLOSE. Le rejeu la retire au lieu de faire semblant de la produire (champ `glose`), et c'est aussi pourquoi ce bloc ne peut porter aucun exercice.

  **4. LE FAN-OUT DE CONTRADICTION A FAIT RETIRER UNE CIBLE ET CORRIGÉ SEPT LIBELLÉS DE LIEN.** Trois agents (calcul / triche / rédaction) sur les 15 exercices d'abord écrits, tous mes contrôles verts.

  Le contradicteur **calcul** a retransposé les 15 programmes indépendamment : **15 sorties sur 15 identiques**, 25 lignes recalculées, code cité fidèle au bloc d'origine ligne à ligne (ratio 1.000), et les sorties des leçons SOURCES elles-mêmes revérifiées. Les deux autres ont rendu ce que ni lui ni mes contrôles ne pouvaient voir :

  | ce qui a été trouvé | vérifié par moi | traitement |
  |---|---|---|
  | **`java/lecon-13` : la réponse est de la TRANSCRIPTION.** `Livre[titre=Java 1re ed., isbn=978-1]` s'obtient en collant cinq littéraux tous visibles à l'écran ; et les indices achevaient le travail (« c'est le livre a, pas b », puis la règle d'assemblage) | oui, lu dans le bloc | **cible SUPPRIMÉE** — 15 exercices deviennent 14. La seule autre ligne du bloc est « true », binaire |
  | **Les 7 libellés de lien `csharp` sont FAUX.** « Classes et objets » pour une leçon intitulée « Classes, objets et propriétés » — et c'est le titre de `java/lecon-05` : le libellé avait été **emprunté au cours jumeau**. « Découvrir C# » pour « Découvrir C# et .NET » | oui, lu dans les `<h1>` | **contrôle 12 ajouté au générateur** (le libellé doit être le titre `<h1>` de la leçon source, ou le préfixe d'un de ses titres de section) ; 7 libellés corrigés |
  | **La tolérance de frappe était ASYMÉTRIQUE**, mesuré frappe par frappe : `graphies()` n'enlevait que l'espace d'AVANT le séparateur. « Total: 53 » passait, « Total :53 » échouait ; « 5!=120 » passait, « 5! =120 » échouait | oui, en exécutant `normExo` | `graphies()` énumère désormais les **quatre** combinaisons pour `:` `;` `=` `|`. **Et les 45 exercices déjà écrits ont été mis à niveau** (`scratchpad/v14-b7c3/maj-accept.js`, qui EXTRAIT la règle du générateur au lieu de la recopier) : **12 exercices élargis, 29 graphies ajoutées** |
  | **Deux commentaires énonçaient la réponse** : `// termine la ligne ici` (csharp/lecon-01, le point même de l'exercice) et `// Constructeur surcharge qui CHAINE vers le principal` (csharp/lecon-05, la seule inférence à faire) | oui | masqués — et le **masquage a dû être étendu**, il ne courait que sur les lignes situées AVANT la zone de sortie |
  | **Six indices donnaient le RÉSULTAT au lieu d'une règle** (« Recolle les trois morceaux dans l'ordre », « compare pi × 2² et 9 », « la dernière valeur affichée est celle d'AVANT », « Decrire() met les points de vie entre parenthèses… ») | oui, relus un par un | réécrits |
  | **La virgule décimale française est refusée** (« 21,57 ») sans que rien ne prévienne | oui | **tolérance REFUSÉE, avertissement AJOUTÉ** : « 21,57 » n'est pas ce que `Locale.US` imprime, l'accepter validerait une sortie que le programme ne produit pas. Les trois indices concernés nomment désormais `Locale.US` |
  | **Toute la prose neuve était SANS ACCENTS** (« libelle », « resultat », « incremente », « Heritage »), par mimétisme des commentaires du code — que ces deux cours écrivent volontairement en ASCII. 79 occurrences | oui, comptées | prose entièrement réaccentuée : **0 mot non accentué** contre 47 (java) et 48 (csharp) accentués. Le code, lui, n'est pas touché |

  **5. DEUX TROUS DU GÉNÉRATEUR, ouverts par C# et refermés.** L'idiome de C# écrit le programme, PUIS sa sortie, PUIS la classe qui le fait marcher (10 blocs sur 10 dans `lecon-05`). Or (a) le contrôle 11 ne comptait les commentaires **qu'avant** la zone de sortie : tout le corps de la classe échappait au compte, et un commentaire y énonçant la réponse serait passé inaperçu ; (b) la règle « une ligne commentée après la sortie se lit comme sa suite » courait **jusqu'au bout du bloc** et effaçait « Constructeur principal » à quinze lignes de là. Le compte couvre désormais tout le code cité, et la coupe exige la **contiguïté**.

  **6. Réserves assumées, mesurées, non masquées.**
  - **La réponse reste en clair dans la leçon SOURCE**, pour 14 sur 14, et le `<details>` « Voir la réponse » la donne aussi — c'est la convention de tous les exercices du site. Inhérent à la règle A5 ; **le trancher reste la case B7c-6.**
  - **`java/lecon-07` (do…while) se déduit par parallélisme** : « do...while : 5 » reste visible, l'énoncé dit qu'UNE seule ligne manque, donc « 4 » s'obtient sans comprendre que la boucle teste après. Gardé faute de meilleure cible dans la leçon 03, mais c'est le plus faible du lot ; les indices ont été réécrits pour ne plus donner le calcul.
  - **6 libellés de lien PRÉEXISTANTS ne correspondent à aucun titre** de leur leçon source (ruby 5 : « Modifier un hash », « Rouvrir une classe », « Inspecter l'exception », « Écrire du JSON », « La déstructuration » ; kotlin 1 : « les propriétés déléguées »). Révélés par le contrôle 12, **non corrigés ici** : c'est la même dette que les 5 exercices `ruby` de B7c-6, et la mélanger à ce point aurait fait deux travaux à moitié.
  - **`java/lecon-11` et `csharp/lecon-08` débordent horizontalement à 320 px** — et **le débordement PRÉEXISTE** : mesuré sur la version HEAD des mêmes pages (`git show HEAD:… > …-avant.html`), il est identique. ⚠️ Au passage : **`verif-rendu.js` n'est pas déterministe** sur ces pages — deux passes sur un fichier INCHANGÉ rendent 4 puis 3 erreurs, avec des valeurs qui varient (+50 puis +86 px). Cause probable : les schémas SVG de 640 px de large du cours.
  - **`csharp/lecon-04` (grille) : l'espace de FIN de rangée n'est pas transcrite.** `Write($"{v} ")` en produit une, invisible dans un commentaire. Les deux blocs corrigés gagnent leurs trois lignes manquantes, pas cette espace.

  **7. ⚠️ LE PIÈGE DU HEREDOC S'EST REPRODUIT, et il a coûté deux libellés.** Un `heredoc` Bash de cet environnement réduit `\\` en `\` : un `'Revoir \\u00ab …'` écrit dans un script Python y arrive en `'Revoir « …'`, que Python **interprète** comme le guillemet « — la ligne de sécurité censée ne rien faire a donc vidé le champ `label` de deux pages. Réparé (`scratchpad/v14-b7c3/repare-label.js`), et vérifié : **0 `"label":""` sur tout le site**. Le plan le disait déjà pour B7c-1 ; il faut l'écrire une deuxième fois.

  **8. Les 14 exercices** (bloc de la leçon *n* → exercice dans une leçon suivante) :

  | source → hôte | ce qu'on fait prédire | réponse recalculée |
  |---|---|---|
  | java 03 → 04 | la somme d'un tableau de quatre notes, au for-each | `Total : 53` |
  | java 03 → 05 | une factorielle dont la boucle part de 2 et va jusqu'à n INCLUS | `5! = 120` |
  | java 03 → 07 | la dernière ligne d'un `do...while` qui teste après | `do...while : 4` |
  | java 03 → 08 | la valeur d'un `j` déclaré AVANT la boucle qui l'incrémente | `j vaut 3` |
  | java 06 → 10 | un cercle et un carré sommés par polymorphisme, `%.2f` | `Aire totale : 21.57` |
  | java 06 → 11 | une classe abstraite dont la sous-classe redéfinit `aire()` | `rouge, aire = 3.14` |
  | java 06 → 12 | `comparer()` rend l'OBJET le plus étendu, pas sa valeur | `Plus grande aire : 12.57` |
  | csharp 01 → 02 | trois `Console.Write` qui ne font qu'une ligne | `Bonjour C#!` |
  | csharp 01 → 03 | une accolade d'interpolation qui contient une EXPRESSION | `L'an prochain, tu en auras 18.` |
  | csharp 05 → 06 | un champ `int` non initialisé, incrémenté deux fois | `Valeur : 2` |
  | csharp 05 → 07 | un constructeur qui CHAÎNE vers le principal | `Noah (100 PV) \| Lina (100 PV)` |
  | csharp 05 → 08 | une propriété `static` partagée face à un `Id` d'instance | `1, 2, total = 2` |
  | csharp 05 → 09 | un `decimal` modifié par deux méthodes, sans zéro final | `Noah : 120 EUR` |
  | csharp 05 → 10 | une propriété CALCULÉE, et un `double` entier | `Aire = 12` |

  Ce sont des pièges : la borne INCLUSE de `i <= n`, le corps de `do…while` exécuté avant son test, la variable qui survit à la boucle parce qu'elle a été déclarée avant, le `%.2f` qui ARRONDIT au lieu de tronquer, le `Console.Write` qui n'achève pas sa ligne, le constructeur qui délègue la valeur qu'on cherche, le compteur statique que les instances se partagent, et le `decimal` qui s'imprime sans zéro final.

  **9. Contrôles.** `verif.js --rapide` **tout vert, 7 étapes** (37,2 s). `verif-html` **0 grave / 0 attention sur 1 612 fichiers**. `verif-donnees` **0 erreur**. `verif-rendu` sur les 12 pages hôtes sans dette préexistante : **72 mesures** (3 largeurs × 2 thèmes), **0 erreur, 0 avertissement**. `exos-texte.js` dans Chrome, en `file://` sans `--allow-file-access-from-files` : **56 réponses tapées, 56 acceptées** ; passe adversariale **56 fausses tapées, 56 refusées** ; **95 graphies élargies tapées, 95 acceptées** (`--graphie=2,3,4`, sur les lots java, csharp, cpp et rust). Alignement `.exercise` ⇄ `data-exos` : **4 pour 4** sur les 15 pages touchées. 0 BOM, 0 caractère NUL, 0 mojibake, JSON valide, **tout en LF**. **0 URL de CDN active** (les 2 fichiers qui citent `fonts.gstatic.com` sont des leçons HTML qui l'écrivent **échappé**, pour l'enseigner ; elles datent du premier commit). Générateur **idempotent** ; `--rejouer` ne rend que les **11 dettes préexistantes** (5 exercices `ruby` de B7c-6, 6 libellés). `search-index.js` régénéré ; quiz, flashcards, antisèches et `search-lite` **identiques**.

  **10. Mesure.** Exercices à champ : **4 584 → 4 598** (+14). Exercices de prédiction sur le site : **45 → 59** (+14). Exercices corrigés **par exécution** : **354**, inchangés — un exercice de prédiction est un `type:"text"`. **0 octet de moteur ajouté.** Sorties du site corrigées : **3 blocs** (java 2, csharp 1), **+9 lignes de sortie manquantes**. Tolérance de frappe élargie sur **12 exercices antérieurs** (+29 graphies). Libellés de lien corrigés : **7**.
- [x] **B7c-4 · `c` et `php`** ✅ **2026-08-26. 7 exercices de prédiction — et le premier lot où la CONTRADICTION A RETIRÉ PLUS DE CIBLES QU'ELLE N'EN A CORRIGÉ : 12 écrites, 5 démolies, 1 déplacée.**

  **1. Ni compilateur C ni interpréteur PHP, et l'inventaire du plan ne se reproduit pas.** `gcc`, `cc`, `clang`, `tcc`, `php`, `php8` : tous absents (vérifié). Avec la règle exacte de la forme `bloc` (tête STRICTE `// Sortie :`), **`c` = 26 blocs sur 215** (leçons 03 : 10, 07 : 6, 08 : 9, 16 : 1) et **`php` = 15 sur 204** (02 : 5, 09 : 9, 12 : 1) — et non « 28 et 29 ». C'est le quatrième lot d'affilée où le chiffre du plan s'écarte de la mesure.

  **2. LES 41 PROGRAMMES ONT ÉTÉ REJOUÉS, ET DEUX BLOCS DU SITE ÉTAIENT FAUTIFS.** Deux outils neufs sur le modèle de `rejoue-java.js` : `tools/preuves/rejoue-c.js` (**26 programmes, 50 lignes**) et `tools/preuves/rejoue-php.js` (**15 programmes, 17 lignes, 1 écarté**). Le rejeu C a demandé un vrai modèle de FLUX : `printf` n'écrit pas des lignes mais dans un tampon, et dix `printf("%d ", …)` suivis d'un `printf("\n")` ne font QU'UNE ligne — un rejeu ligne à ligne aurait rendu six lignes là où le programme en produit une.

  | le bloc | ce que la leçon en faisait | ce que le rejeu impose |
  |---|---|---|
  | `c/lecon-03`, puissance `2^10` | **TROIS LIGNES D'EXPLICATION sous la ligne de sortie**, en commentaire et rien pour les en séparer : la règle du site — et l'apprenant — les lisent comme de la sortie. La « sortie » du bloc faisait donc 4 lignes | explication REMONTÉE avant la déclaration qu'elle commente ; sortie ramenée à sa seule ligne |
  | `php/lecon-09`, trait `Horodatable` | `date("Y-m-d")` annoncé sous une tête **STRICTE** — donc éligible à un exercice de prédiction, dont la réponse aurait été fausse dès le lendemain | tête passée à `// Sortie typique :`, la forme que la règle stricte écarte d'office |

  **Contre-épreuves ciblées** (un rejeu qui ne trouve rien doit prouver qu'il sait trouver) : C `--fausse=espace` fait tomber **exactement 5** programmes (ceux qui impriment en ligne), `--fausse=arrondi` **2** (les deux `%.Nf`), `--fausse=enum` **1** (le seul dont la valeur vienne d'une constante implicite), `--fausse=fleche` **2** (les deux qui écrivent à travers un pointeur) ; PHP `--fausse=flottant` **2**, `--fausse=arrondi` **1**, `--fausse=json` **1**. Après correction : **26/26 et 15/15, 0 divergence.**

  **3. Trois transcriptions partielles, DÉCLARÉES et non maquillées** (mêmes champs que la glose du rejeu C#) : `glose` — `c/lecon-07` écrit « Somme = 60   (10 + 20 + 30) », la parenthèse n'est pas de la sortie ; `invite` — le même programme écrit « Combien d'entiers ? » avant, que la leçon transcrit en « Entrée : » ; `videEnTete` — `c/lecon-16` commence par `printf("\nBilan…")`, donc une ligne VIDE qu'un commentaire ne peut pas montrer. Ce dernier champ a fini par faire RETIRER sa cible (point 5).

  **4. LE FAN-OUT DE CONTRADICTION A RETIRÉ 5 CIBLES SUR 12, EN A DÉPLACÉ 1, ET A CORRIGÉ TOUTE LA PROSE.** Trois agents (calcul / triche / rédaction) sur les 12 exercices d'abord écrits, mes douze contrôles verts.

  Le contradicteur **calcul** a retransposé les 12 programmes indépendamment : **12 réponses sur 12 identiques**, 15 lignes recalculées sur 172 lignes de code tracées, extraits fidèles au bloc d'origine (ratio 1.000). **Aucun `accept` n'était faux.** Les deux autres ont rendu ce que ni lui ni mes contrôles ne pouvaient voir :

  | ce qui a été trouvé | vérifié par moi | traitement |
  |---|---|---|
  | **`c/lecon-17` : L'ÉNONCÉ ÉTAIT FAUX, et il donnait la réponse.** (a) Le gabarit « ce programme n'affiche qu'une seule ligne » compte les lignes du COMMENTAIRE, pas de la sortie : `printf("\nBilan…")` en émet deux, dont une vide. (b) Pire, la réponse se déduisait de cet énoncé même — la macro imprime une ligne « ÉCHEC … » par test raté, donc « une seule ligne » impose zéro échec, et les trois `VERIFIER` sont sous les yeux | oui : mon propre rejeu portait `videEnTete: 1`, je n'en avais pas tiré la conséquence sur l'énoncé | **cible SUPPRIMÉE** |
  | **`php/lecon-02` coalescence : la sortie réelle n'est PAS une ligne.** Le bloc contient DEUX programmes et DEUX têtes « Sortie : », la seconde restant affichée en clair (« Bonjour, Léa ! ») donne le gabarit exact ; le littéral « Invité » y figure deux fois ; et `echo` n'émet aucun saut de ligne, donc le fichier produit UNE seule ligne physique, « Bonjour, Invité !Bonjour, Léa ! » | oui, lu dans le bloc — et **mon rejeu modélisait deux programmes là où le fichier n'en est qu'un** | **cible SUPPRIMÉE** |
  | **`c/lecon-03` puissance : DOUBLON avec la leçon source.** `pages/c/lecon-03.html` porte déjà un exercice dont le champ `accept` vaut `["1024"]`. L'apprenant aurait retapé, deux leçons plus loin, la réponse qu'il venait de donner | oui, lu dans le `data-exos` de la source | **cible SUPPRIMÉE**. Aucun de mes douze contrôles ne regarde les exercices DÉJÀ POSÉS ailleurs |
  | **`php/lecon-09` parent et interfaces : transcription pure.** « Je suis Rex. Wouf ! » s'obtient en collant trois littéraux visibles, et la ligne `return parent::decrire() . " Wouf !"` donne jusqu'à l'ordre d'assemblage ; « Stylo;1.5 » de même. Et la seconde **contredisait ma propre liste d'écartés**, qui refuse `namespace` parce que « la réponse est l'argument du constructeur » | oui | **2 cibles SUPPRIMÉES**. C'est le motif exact qui avait fait retirer `java/lecon-13` en B7c-3 : le critère existait, il n'avait pas été appliqué |
  | **La page hôte contenait déjà le calcul.** `pages/php/lecon-04.html` porte `echo prixTTC(100, $tva); // 120` avec `$tva = 0.20` — le même calcul et son résultat, 250 lignes au-dessus du champ. Le contrôle 6 ne vérifie que l'absence de la LIGNE VISÉE, jamais celle du raisonnement | oui, ligne 160 | **hôte DÉPLACÉ** en `lecon-05`, mesurée avant : 0 occurrence de « TVA », 0 de « 120 », 0 de « Boutique » |
  | **84 accents graves de Markdown affichés tels quels.** 46 dans les indices, 38 dans les réponses. `js/lecon.js` pose les indices en `textContent` et passe la réponse par `enc()` : il n'y a **aucun rendu Markdown**, et l'apprenant lisait `` `continue` `` dans la même phrase qu'un `<code>` correctement balisé. Les 34 exercices de prédiction déjà publiés n'en portent aucun dans leur réponse | oui, comptés | **tous retirés : 0 restant** dans les 7 exercices. (Relevé hors périmètre : **12 pages préexistantes** en portent encore dans leurs indices) |
  | **Mon explication de `c/lecon-04` était INEXACTE** : « `break` sort dès qu'une valeur dépasse 6 ». 7 dépasse 6, mais le `continue` des impairs passe AVANT le test du `break` : c'est 8 qui arrête la boucle | oui, en déroulant la boucle | réécrite. Les deux contradicteurs l'ont trouvée indépendamment |
  | **`c/lecon-08` : un second commentaire donnait le mécanisme.** `// ptr pointe vers p` énonce l'aliasing, c'est-à-dire le point même de l'exercice ; mon premier jet ne masquait que « on modifie p a travers le pointeur » | oui | ajouté au masquage |
  | **Cinq indices donnaient le RÉSULTAT au lieu d'une règle** — et ils se lisent EN BLOC, le site les délivrant après 2, 5 et 8 tentatives, une saisie quelconque comptant comme tentative. « les trois autres gardent la valeur que `calloc` leur a donnée », « `%.2f` impose DEUX décimales, même quand la seconde est un zéro », « la valeur d'origine de `y` n'existe donc plus au moment de l'affichage », « `echo` n'écrit pas de décimale quand il n'y en a pas », « `round()` arrondit à deux décimales, il ne tronque pas » | oui, relus un par un | les cinq réécrits en règles ou en questions |
  | **Un contradicteur a affirmé que `normExo` ne replie pas les accents**, et donc qu'« Bilan : 3 reussis » serait refusé | **FAUX** — `js/lecon.js:723` fait bien `normalize("NFD")` puis retire les diacritiques | affirmation ÉCARTÉE, aucune modification |

  **5. Le vrai résultat de la mesure : `php` ne donne que DEUX cibles, et il fallait l'écrire.** Sur 15 blocs à tête stricte, 13 affichent une chaîne écrite en clair quelques lignes plus haut. Le lot final compte **5 exercices `c` et 2 `php`**, contre 12 avant contradiction. Mieux vaut deux exercices qu'on ne peut pas résoudre en recopiant que sept qui se collent.

  **6. UNE TOLÉRANCE DE SAISIE AJOUTÉE AU GÉNÉRATEUR : LE TIRET CADRATIN.** La sortie de `php/lecon-02` est « Ma Boutique — total : 120 », avec un U+2014 **qu'aucune touche d'un clavier français ne produit** : l'exercice était, tel quel, infaisable autrement qu'en copiant la leçon, c'est-à-dire en trichant. Chaque graphie gagne sa jumelle au trait d'union. Comme les espaces autour de `:` en B7c-3, c'est une tolérance de FRAPPE et non de contenu — le nombre et les mots restent exacts. Mesuré dans Chrome : les 4 variantes au trait d'union sont acceptées.

  **7. ⚠️ DEUX PIÈGES D'ENVIRONNEMENT, dont un INÉDIT et invisible.**
  - **Le heredoc a produit un caractère de contrôle dans une expression rationnelle.** Le heredoc Bash réduit `\\b` en `\b` ; **Python interprète alors `\b` comme un BACKSPACE (U+0008)**. Le motif écrit était donc `Sortie⌫[^:]*` — que `grep` affiche exactement comme `Sortie[^:]*`, le backspace mangeant le caractère précédent à l'écran. Le contrôle rendait « bloc introuvable » sur un bloc parfaitement présent, et rien dans le source relu ne le montrait ; il a fallu `od -c`. Le plan connaissait la réduction `\\`→`\` depuis B7c-1 ; **la conversion en caractère de contrôle est neuve**. Réparé par `scratchpad/v14-b7c4/repare-regex.js`, et un contrôle « caractères de contrôle » ajouté à la passe d'encodage.
  - **`git checkout -- <fichier>` convertit le fichier en CRLF sur le disque.** Ce dépôt a `core.autocrlf = true` : le dépôt stocke du LF, `git checkout` écrit du CRLF, et **`git status` ne le montre pas** (il compare le contenu normalisé). Après avoir restauré les 12 pages hôtes pour refaire le lot, six d'entre elles se sont retrouvées **MIXTES** — le générateur y ajoutant du LF dans un fichier devenu CRLF. Mesuré par `scratchpad/v14-b7c4/crlf.js`, qui compare le style AVANT (`git show HEAD:`) et APRÈS : **6 fichiers sur 9 changés de style**. Les 12 pages ont été remises en LF (`relf.js`, **6 005 fins de ligne converties**), et le contrôle passe de 6 à **0**. ⚠️ Le « tout en LF » des comptes rendus précédents ne mesurait donc que le cas où les outils Node écrivent ; il ne couvrait pas le checkout.

  **8. Réserves assumées, mesurées, non masquées.**
  - **La réponse reste en clair dans la leçon SOURCE**, pour 7 sur 7, et le `<details>` « Voir la réponse » la donne aussi. Un contradicteur a en outre montré que **l'énoncé DÉSIGNE cette leçon** (« Ce code est repris de la leçon N »). C'est la convention de tous les exercices du site et de tous les lots B7c ; **le trancher reste la case B7c-6**, à laquelle ce point s'ajoute.
  - **`c/lecon-08` (Etudiant) est la cible la plus faible du lot** : les trois valeurs et le format sont visibles, la ligne se recopie — sauf en un point, le passage de `15.5` à `15.50`, qui décide seul du verdict. C'est ce qui la distingue de `java/lecon-13`, retirée en B7c-3, où les cinq littéraux se collaient sans qu'aucun ne soit transformé. Gardée, indice réécrit en question.
  - **La coupe des commentaires contigus sous la sortie retire une ligne légitime** dans `php/lecon-11` (`// new Forme();  // Erreur fatale : …`) : une ligne VIDE ne rompt pas la contiguïté. Non corrigé — la règle a été instaurée pour `cpp/lecon-17` et un motif plus large casserait ce qui est juste.
  - **`Ma Boutique—total : 120` sans espaces autour du tiret reste refusé** : les graphies couvrent l'espacement de `:` `;` `=` `|`, pas celui du tiret.
  - **12 pages préexistantes portent encore des accents graves de Markdown dans leurs indices** (`go`, `haskell`, `js`, `lisp` ×2, `markdown` ×2, `nosql`, `ocaml`, `projets-js`, `rust`, `typescript`). Relevé, non corrigé : c'est un chantier à part, et sur `markdown` le backtick est peut-être volontaire.

  **9. Les 7 exercices** (bloc de la leçon *n* → exercice dans une leçon suivante) :

  | source → hôte | ce qu'on fait prédire | réponse recalculée |
  |---|---|---|
  | c 03 → 04 | une boucle où `continue` filtre les impairs et `break` arrête après 6 | `2 4 6` |
  | c 07 → 09 | ce qu'une zone `malloc` contient quand on y range le carré de chaque indice | `0 1 4 9 16` |
  | c 07 → 10 | ce que `calloc` garantit, et que `malloc` ne garantit pas | `0 0 1 0` |
  | c 08 → 11 | un `%.2f` appliqué à une valeur qui n'a qu'une décimale | `Noah, 20 ans, moyenne 15.50` |
  | c 08 → 12 | un champ écrit à travers un pointeur obtenu par `&p` | `p.y = 100` |
  | php 02 → 05 | un flottant de partie décimale nulle passé à `echo` | `Ma Boutique — total : 120` |
  | php 09 → 11 | une classe abstraite qui délègue le calcul à sa fille, puis arrondit | `Aire = 12.57` |

  Ce sont des pièges : le `continue` qui court-circuite le test du `break`, la zone que `malloc` laisse indéterminée là où `calloc` la met à zéro, le `%.2f` qui COMPLÈTE une décimale manquante, l'écriture à travers un pointeur qui n'a pas fait de copie, et le flottant que `echo` imprime sans son zéro.

  **10. Contrôles.** `verif.js --rapide` **tout vert, 7 étapes** (37,3 s). `verif-html` **0 grave / 0 attention sur 1 612 fichiers**. `verif-donnees` **0 erreur**. `verif-rendu` sur les 7 pages hôtes : **42 mesures** (3 largeurs × 2 thèmes), **0 erreur, 0 avertissement**. `exos-texte.js` dans Chrome, en `file://` sans `--allow-file-access-from-files` : **28 réponses tapées, 28 acceptées** ; passe adversariale **28 fausses tapées, 28 refusées** ; **28 graphies élargies acceptées** (graphies 1 à 7, dont les 4 au trait d'union). Alignement `.exercise` ⇄ `data-exos` : **4 pour 4** sur les 7 pages. **0 accent grave de Markdown** dans les indices du lot. 0 BOM, 0 caractère NUL, 0 CRLF, 0 mojibake, 0 caractère de contrôle, JSON valide. **0 URL de CDN active** (la seule occurrence du dépôt est une phrase d'un `README` de `starter/`, préexistante). Générateur **idempotent** ; `--rejouer` ne rend que les **11 dettes préexistantes** de B7c-6. `search-index.js` régénéré ; quiz, flashcards, antisèches et `search-lite` **identiques**.

  **11. Mesure.** Exercices à champ : **4 598 → 4 605** (+7). Exercices de prédiction sur le site : **59 → 66** (+7). Exercices corrigés **par exécution** : **354**, inchangés — un exercice de prédiction est un `type:"text"`. **0 octet de moteur ajouté.** Blocs du site corrigés : **2** (une sortie de 4 lignes ramenée à 1, une tête stricte passée en « typique »). Cibles écrites puis RETIRÉES par contradiction : **5 sur 12** ; hôte déplacé : **1**. Accents graves retirés : **84**. Fins de ligne remises en LF : **6 005**.
- [x] **B7c-5 · `go` et `elixir`** ✅ **2026-08-26. Six exercices — et le premier lot où la contradiction a retiré CINQ cibles sur onze sans qu'aucune ne soit fausse : elles étaient toutes justes, et toutes résolubles sans lire le code.**

  **1. Ni Go ni Elixir sur cette machine, et l'inventaire du plan se reproduit exactement.** `go`, `gofmt`, `elixir`, `iex`, `erl`, `mix` : tous absents (vérifié). Rejeu par transposition, comme pour cpp, rust, java, csharp, c et php. Les deux chiffres mesurés en fin de B7c-4 tiennent : **`go` = 18 blocs à tête stricte sur 197** (leçons 01 : 5, 02 : 1, 03 : 5, 07 : 7) et **`elixir` = 107 annonces `# =>` dans 56 blocs sur 163**, dont **84 sur une ligne seule** — la forme `apres` du générateur, et **0 tête `// Sortie :`**.

  **2. DEUX REJEUX NEUFS, 104 SORTIES RECALCULÉES, ET DEUX ANNONCES DU SITE ÉTAIENT FAUSSES.**

  `tools/preuves/rejoue-go.js` — **18 blocs, 17 rejoués, 27 lignes comparées, 0 divergence.** Ce cours n'a aucune sortie fausse, contrairement à `c` et `php`. Le rejeu modélise ce que Go IMPRIME : `Println` sépare ses arguments par un espace, `defer` sort en LIFO, `switch` ne traverse pas sauf `fallthrough`, une clé absente d'une map rend la valeur zéro, un channel non bufferisé fait rendez-vous, `select` prend le cas prêt le plus tôt. **Un bloc est écarté et déclaré** : `lecon-07` lance une goroutine et laisse `main` finir — la leçon l'écrit elle-même (« (souvent rien du tout) »), et sa tête est pourtant STRICTE, donc le générateur ne l'aurait pas écarté seul.

  `tools/preuves/rejoue-elixir.js` — **40 blocs, 77 annonces comparées, 5 écartées une par une.** Il reproduit ce qu'`inspect` ÉCRIT, car en Elixir l'annonce n'est pas la valeur mais sa GRAPHIE : atomes, tuples, structs, flottants toujours pourvus d'une décimale, et surtout **les clés d'une map rangées en ORDRE DE TERME**.

  | l'annonce | ce que la leçon affirmait | ce que le rejeu impose |
  |---|---|---|
  | `elixir/lecon-05`, `Enum.find` | `%{nom: "Linus", ville: "Lyon", age: 54}` — l'ordre d'écriture | `%{age: 54, nom: "Linus", ville: "Lyon"}` |
  | `elixir/lecon-05`, `Enum.sort_by` | `[%{nom: "Ada", ...}, …]` — même travers dans l'abrégé | `[%{age: 36, nom: "Ada", ...}, …]` |

  Ce n'est pas une subtilité inventée pour l'occasion : **le cours applique déjà la règle ailleurs** — `lecon-07` annonce `%{email: …, nom: …}` pour une map construite `%{nom: nom, email: email}`, et `lecon-13` annonce `%Utilisateur{admin: …, age: …, nom: …}`. Seule `lecon-05` l'ignorait, sur les deux seules lignes où l'ordre alphabétique et l'ordre d'écriture divergent.

  **Contre-épreuves** (un rejeu qui ne trouve rien doit prouver qu'il sait trouver) : Go `--fausse=espace` fait tomber **exactement 4** programmes (ceux dont un `Println` reçoit deux arguments), `--fausse=lifo` **1**, `--fausse=fallthrough` **1**, `--fausse=carre` **1**, `--fausse=timeout` **2**, `--fausse=zero` **1** ; Elixir `--fausse=tri` **7 annonces** (dont les 2 corrigées et 5 qui étaient déjà justes), `--fausse=flottant` **2**, `--fausse=arrondi` **2**, `--fausse=clause` **2**, `--fausse=paresse` **3**.

  **Le périmètre du rejeu Elixir est DÉCLARÉ, pas silencieux** : sept leçons annoncent des valeurs qu'aucune transposition ne peut honnêtement produire — `08` (des PID), `09` et `10` (sessions IEx en commentaire, superviseurs), `12` et `16` (Ecto), `15` (arbres de syntaxe abrégés par des `_`), `17` (un GenServer monté au fil de la leçon). Et à l'intérieur du périmètre, cinq annonces sont écartées une par une, motif à l'appui.

  **3. LE FAN-OUT DE CONTRADICTION A RETIRÉ 5 CIBLES SUR 11 ET EN A DÉPLACÉ 1 — SANS QU'AUCUNE NE SOIT FAUSSE.** Trois agents (calcul / triche / rédaction) sur les 11 cibles d'abord écrites, mes douze contrôles verts.

  Le contradicteur **calcul** a retransposé les 11 programmes indépendamment, arithmétique flottante exécutée et non jugée : **11 réponses sur 11 identiques**. Aucun `accept` n'était faux. C'est le second lot d'affilée où ce contradicteur-là ne trouve rien — et les deux autres ont rendu, comme en B7c-4, ce que ni lui ni mes contrôles ne pouvaient voir.

  | ce qui a été trouvé | vérifié par moi | traitement |
  |---|---|---|
  | **`go/lecon-07` select : LA SORTIE FAIT DEUX LIGNES, ET C'EST LA LIGNE DIFFICILE QUI RESTE AFFICHÉE.** « timeout : trop lent » — c'est-à-dire le raisonnement entier (le `time.After` à 500 ms bat le channel à 2 s) — était donné ; ne restait à trouver que le nom du canal qui gagne au premier tour, et il s'appelle `rapide` | oui, relu dans le code cité | **cible SUPPRIMÉE**. Masquer l'autre ligne était impossible : elle est un littéral du programme, que le contrôle 5 refuse |
  | **`go/lecon-07` somme : le bloc cité EST LE CORRIGÉ d'un exercice de sa propre leçon source** (`pages/go/lecon-07.html`, « Exercice 2 », sous « Voir une solution »). On aurait demandé de prédire la sortie d'un programme que l'apprenant vient d'écrire. Et 1+2+3+4+5 se calcule sans lire une ligne de Go — une version séquentielle afficherait la même chose | oui, lu dans le `<details>` de la leçon | **cible SUPPRIMÉE** (deux motifs). ⚠️ Aucun de mes douze contrôles ne regarde si le bloc cité est un corrigé |
  | **`elixir/lecon-03` aire : le produit ne fait que DÉPLACER LE POINT DÉCIMAL.** `3.14159 * 10 * 10` rend `314.159` : la suite de chiffres est déjà à l'écran, aucun chiffre neuf n'est produit | oui | **cible SUPPRIMÉE** |
  | **`elixir/lecon-07` `Integer.parse` : rien dans le code ne permet de DÉDUIRE la forme de retour.** C'est du rappel de bibliothèque, pas de la prédiction — et le commentaire qui précède (« Certaines fonctions historiques dérogent à la convention : ») écartait en plus le seul mauvais choix plausible | oui | **cible SUPPRIMÉE** |
  | **`elixir/lecon-07` `creer_compte` : ON AURAIT REFUSÉ L'APPRENANT QUI SUIT LA LEÇON.** La réponse se fabrique par simple substitution, et le seul discriminant restant était l'ordre des clés de la map — or `lecon-05` enseigne mot pour mot qu'« une map Elixir n'est **pas ordonnée** » et que l'ordre d'affichage « n'est pas une garantie sur laquelle s'appuyer ». En prime, la réponse est déjà imprimée sous le corrigé de l'« Exercice 2 » de la leçon source | oui, les trois preuves | **cible SUPPRIMÉE**. ⚠️ Cela ne remet pas en cause la correction du point 2 : une ANNONCE doit dire ce que la machine affiche, un EXERCICE ne peut pas exiger ce que la leçon déclare non garanti |
  | **`elixir/lecon-05` `filter` : la réponse est un SOUS-ENSEMBLE du littéral affiché deux lignes plus haut.** `[5, 8, 9, 8]` se recopie depuis `[5, 3, 8, 1, 9, 2, 8]`, sans qu'aucune valeur ne soit transformée | oui | **cible DÉPLACÉE sur `Enum.map`** : `[10, 6, 16, 2, 18, 4, 16]`, sept valeurs qui ne figurent nulle part, même point pédagogique (l'ordre et les doublons sont conservés) |
  | **Deux commentaires TRADUISAIENT LE CODE EN FRANÇAIS**, dans la forme « annonce » où `masquer` n'existait pas : « Carré des nombres pairs de 1 à 10 » juste au-dessus de la compréhension qu'on demande d'évaluer, et « Stream.iterate : applique une fonction à répétition depuis une graine » au-dessus de la ligne dont le piège EST la graine | oui | **le champ `masquer` ÉTENDU à la forme « annonce »** (il ne valait que pour la forme « bloc ») ; les 2 commentaires neutralisés. Contre-épreuve faite : un motif déclaré et introuvable rend bien une FAUTE |
  | **Trois indices donnaient la réponse ou ne disaient qu'une seule chose en trois fois.** « La graine fait partie du résultat : elle en est le premier élément » énonçait le point même de l'exercice ; « Demande-toi ce qu'Elixir écrit d'un flottant dont la partie décimale est nulle » annonçait que la partie décimale est nulle ; et les trois indices de `map` étaient trois formulations d'une même règle, aucun ne parlant de la graphie | oui, relus en bloc | les trois réécrits en règles, en questions, ou déplacés sur le seul autre motif d'échec |
  | **« une espace » là où le cours écrit « un espace »** : 0 occurrence contre 2 dans `pages/go`, et la phrase du site figure dans la leçon même que le lien fait rouvrir | oui, mesuré | corrigé. ⚠️ Relevé : le lot `php` (B7c-4) porte encore la tournure « une espace », déjà publiée |
  | **Deux placeholders trompeurs** : « la valeur renvoyée par perimetre_arrondi » perdait son argument, dont la valeur dépend entièrement ; « la valeur de cette compréhension » ne désignait rien (le bloc porte TROIS `for`) et employait un mot que le cours n'écrit jamais en ce sens — ses 17 « compréhension » sont tous le kicker « Vérifie ta compréhension », qui figure justement sur la page hôte | oui, mesuré | les deux nomment désormais l'expression visée |
  | **Un contradicteur a affirmé qu'il faudrait « insérer aussi un 4ᵉ bloc `.exercise` sinon l'entrée 4 ne tombe en face de rien »** | **FAUX** — le générateur insère le bloc ET l'entrée, dans la même passe | affirmation ÉCARTÉE, aucune modification |

  **4. UN CRITÈRE NEUF, ET L'OUTIL QUI LE MESURE.** `scratchpad/v14-b7c5/cite-un-corrige.js` répond à une question qu'aucun des douze contrôles ne pose : *le bloc cité est-il le corrigé d'un exercice de sa leçon source ?* Mesure sur les 11 cibles : **3 sur 11**. Deux ont été retirées pour ce motif joint à un autre ; la troisième (`elixir/lecon-03`, `18.85`) est **gardée et la réserve est déclarée** — son calcul, lui, n'est pas copiable, et la réponse est de toute façon en clair dans la leçon source, ce qui est la réserve générale du point 8 de B7c-1, à trancher en B7c-6.

  **5. Le vrai résultat de la mesure : `go` ne donne qu'UNE cible.** Sur 18 blocs à tête stricte, 12 affichent un littéral écrit dans le `fmt.Println` juste au-dessus — le contrôle 5 les refuse tout seul —, un est non déterministe, deux ont été retirés par contradiction, deux se devinent par élimination (le `defer` LIFO, la suite des carrés). Un cours d'introduction montre surtout ce qu'il affiche. C'est moins que `php` et ses deux cibles ; c'est la mesure, pas un renoncement.

  **6. Les 6 exercices** (bloc de la leçon *n* → exercice dans une leçon suivante) :

  | source → hôte | ce qu'on fait prédire | réponse recalculée |
  |---|---|---|
  | go 01 → 04 | une conversion qui réussit, puis un `Println` à deux arguments | `le double vaut 84` |
  | elixir 03 → 04 | une fonction publique qui délègue à une privée, sur des flottants | `120.0` |
  | elixir 03 → 09 | un pipe qui traverse une fonction PRIVÉE, puis arrondit | `18.85` |
  | elixir 05 → 08 | ce que `map` fait de l'ordre et des doublons | `[10, 6, 16, 2, 18, 4, 16]` |
  | elixir 05 → 10 | une compréhension filtrée, sur un intervalle INCLUSIF aux deux bornes | `[4, 16, 36, 64, 100]` |
  | elixir 05 → 11 | un flux paresseux dont la GRAINE compte | `[1, 2, 4, 8, 16]` |

  Ce sont des pièges : le flottant qui garde sa décimale quand elle vaut zéro, l'arrondi qui n'est pas une troncature, `1..10` qui comprend le 10, et la graine de `Stream.iterate` qui est émise avant toute transformation.

  **7. Réserves assumées, mesurées, non masquées.**
  - **La virgule décimale française est refusée** : `120,0`, `18,85` ne passent pas. C'est la règle explicite du générateur depuis B7c-3 — on n'accepte pas une graphie que le programme ne produit pas. Réserve réelle pour un francophone, décision inchangée.
  - **La réponse reste en clair dans la leçon SOURCE**, pour 6 sur 6, et l'énoncé DÉSIGNE cette leçon. Convention de tous les lots B7c ; **le trancher reste la case B7c-6**.
  - **`elixir/lecon-03` (18.85) cite un corrigé d'exercice** de sa leçon source (point 4).
  - **`{:ok, %{age:36, …}}` figurait parmi les graphies élargies** d'une cible retirée : la règle des séparateurs retire l'espace après `:`. En Elixir `age:36` est du code valide, donc la tolérance était licite — la cible est tombée pour un autre motif.
  - **Le lot `php` de B7c-4 porte « une espace »**, déjà publié, là où `c` et `go` écrivent « un espace ». Non corrigé : c'est du texte publié et validé, et le motif touche plusieurs lots.
  - **`pages/go/lecon-08.html` porte un accent grave de Markdown** dans un indice préexistant (`` `json:"nom"` ``), affiché tel quel. Relevé, non corrigé : c'est le chantier séparé des 12 pages déjà signalé en B7c-4.
  - **`pages/html/lecon-25.html` et `lecon-35.html` citent `fonts.gstatic.com`** dans du HTML ÉCHAPPÉ et dans un indice : ce sont des exemples pédagogiques sur `preconnect`, **aucune balise active** (vérifié : 0 `<link>` ou `<script src>` réel). Préexistant au premier commit.

  **8. Contrôles.** `verif.js --rapide` **tout vert, 7 étapes** (35,4 s). `verif-html` **0 grave / 0 attention sur 1 612 fichiers**. `verif-donnees` **0 erreur**. `verif-rendu` sur les 6 pages hôtes : **36 mesures** (3 largeurs × 2 thèmes), **0 erreur, 0 avertissement**. `exos-texte.js` dans Chrome, en `file://` sans `--allow-file-access-from-files` : **24 réponses tapées, 24 acceptées** ; passe adversariale **24 fausses tapées, 24 refusées** ; **7 graphies élargies acceptées**. Alignement `.exercise` ⇄ `data-exos` : **4 pour 4** sur les 6 pages. **0 accent grave de Markdown** dans le lot. 0 BOM, 0 caractère de contrôle, 0 CRLF, 0 mojibake, JSON valide. **0 URL de CDN active**. Générateur **idempotent** (72/72 déjà en place au second passage) ; `--rejouer` ne rend que les **11 dettes préexistantes** de B7c-6. `search-index.js` régénéré ; quiz, flashcards, antisèches et `search-lite` **identiques**.

  **9. Mesure.** Exercices à champ : **4 605 → 4 611** (+6). Exercices de prédiction sur le site : **66 → 72** (+6). Exercices corrigés **par exécution** : **354**, inchangés — un exercice de prédiction est un `type:"text"`. **0 octet de moteur ajouté.** Sorties recalculées : **104** (27 lignes Go + 77 annonces Elixir). Annonces du site corrigées : **2**. Cibles écrites puis RETIRÉES par contradiction : **5 sur 11** ; déplacée : **1**. Fautes de rédaction corrigées : **7**. Commentaires neutralisés : **2**, par un champ qui n'existait pas dans cette forme avant cette passe.
- [x] **B7c-6 · Les 11 dettes du mode `--rejouer`, soldées** ✅ **2026-08-26. `--rejouer` ne signale plus aucune faute — et la réserve traînée depuis B7c-1 est TRANCHÉE, pas contournée.**

  **1. Les 5 exercices `ruby` que `--rejouer` refusait : 4 RETIRÉS de leur page, 1 gardé avec sa fuite déclarée.** Ils avaient été écrits en B7a, c'est-à-dire AVANT les contrôles 5 et 7 qui les refusent. Aucun n'était FAUX ; tous étaient résolubles sans comprendre, ou validables par une autre ligne du même bloc.

  | l'exercice | ce que le contrôle disait | traitement |
  |---|---|---|
  | `lecon-03`, `puts "b" if 0` | la réponse « b » est encore visible | **RETIRÉ.** La réponse est le littéral de la ligne — et l'énoncé, qui demande « quelle sortie remplace le `?` », PROMET qu'il y a une sortie : il donne donc la réponse à la seule vraie question (0 est-il vrai en Ruby ?) |
  | `lecon-06`, `addition_proc.call(1)` | la réponse « 1 » est encore visible | **RETIRÉ.** La réponse est l'argument, recopiable tel quel |
  | `lecon-07`, `take_while` | « [18, 15] » indiscernable d'une autre sortie | **RETIRÉ.** `notes.take(2)`, visible dans le même bloc, rend exactement la même valeur : on validerait un apprenant qui confond les deux |
  | `lecon-09`, `a == b` | « true » indiscernable | **RETIRÉ.** `a.equal?(a)` rend le même `true` — et la réponse est binaire, une chance sur deux au hasard |
  | `lecon-02`, `"3a".to_i` | la réponse « 3 » est encore visible | **GARDÉ, fuite DÉCLARÉE.** Le 3 qu'on lit est celui de `"3a"`, et tout l'exercice consiste à savoir que `to_i` s'arrête là. Même cas que la fuite tolérée du lot `cpp` (« 16 se lit dans 16.7 ») |

  **2. LA RÉSERVE DU POINT 8 EST TRANCHÉE : NON, ON NE MASQUE PAS LA LIGNE DANS LA LEÇON SOURCE.** La question posée depuis B7c-1 était : faut-il retirer l'annonce `# => valeur` du bloc d'origine pour que la réponse ne soit plus lisible ? **Non**, et pour une raison qui tient au fondement du chantier : la règle A5 impose de ne bâtir un exercice que sur une sortie **DÉJÀ AFFIRMÉE** par la leçon. Effacer cette affirmation, c'est détruire la source de vérité pour protéger l'exercice qu'elle rend possible — et priver la leçon de ce qu'elle enseigne.

  Le remède est celui que le chantier applique déjà depuis B7c-1 : **poser l'exercice dans une AUTRE leçon**. Restait à l'appliquer au lot qui était en dette. **Mesuré** (`scratchpad/v14-b7c6/ou-est-la-source.js`) : sur les 72 exercices de prédiction publiés, **10 citaient encore un bloc de LEUR PROPRE page** — tout le lot `ruby` de B7a, où la réponse était imprimée quelques écrans plus haut. Le lot `kotlin` (B7b), lui, était déjà à la règle.

  Les 10 ont été **retirés de leur page et réécrits dans la leçon suivante** (02→03, 04→05, 05→06, 08→09, 10→11, 11→12, 12→13, 18→19, 19→20). **9 sur 10 y passent.** La dixième est **perdue** : `lecon-20` (`premier, *reste` → `[2, 3, 4, 5]`) a pour ligne visée le mot `reste`, seul sur sa ligne, et le contrôle 6 le trouve dans le VERBE français « restent », écrit deux fois dans la page hôte. **C'est un faux positif, mesuré — et on ne modifie pas un contrôle pour faire passer une cible** (même décision qu'en B7c-5 pour `elixir/lecon-07`, refusée sur un `end`). ⚠️ **Deux cibles perdues pour la même cause** : le contrôle 6 compare des SOUS-CHAÎNES là où il devrait comparer des LIGNES de bloc de code. À instruire hors de cette case.

  **Mesure finale : 0 exercice de prédiction sur 67 ne cite plus sa propre page** (10 avant).

  **3. Les 6 libellés de lien que le contrôle 12 refusait — et un SEPTIÈME que les autres fautes cachaient.** Chacun renvoyait à une section qui n'existe pas, corrigé dans la table du générateur ET dans la page déjà publiée :

  | page | libellé publié | vrai titre de la leçon source |
  |---|---|---|
  | `ruby/lecon-05` | « Modifier un hash » | « Ajouter, modifier, supprimer, interroger » |
  | `ruby/lecon-11` | « Rouvrir une classe » | « Les classes sont ouvertes » |
  | `ruby/lecon-12` | « Inspecter l'exception » | « Quand ça casse : la hiérarchie des exceptions » |
  | `ruby/lecon-19` | « Écrire du JSON » | « JSON ↔ structures Ruby » |
  | `ruby/lecon-20` | « La déstructuration » | « Déstructurer tableaux et hachages » |
  | `kotlin/lecon-12` | « les propriétés déléguées » | « Délégation de classe avec by » |
  | `ruby/lecon-02` | « Les conversions » | « Convertir d'un type à l'autre » |

  ⚠️ **Le septième n'est apparu qu'une fois les cinq premières fautes levées** : le contrôle 5 `return`ait avant que le contrôle 12 ne soit atteint. **Un contrôle qui coupe masque tous les suivants** — c'est la deuxième fois de ce chantier qu'un vert cache un rouge, après le contrôle qui ne pouvait pas échouer.
  🔵 Relevé hors périmètre : **une entrée PRÉEXISTANTE de `ruby/lecon-02`** porte encore « Revoir « Les conversions » ». Le contrôle 12 ne regarde que les cibles du lot de prédiction ; les libellés des autres exercices du site ne sont surveillés par rien.

  **4. ⚠️ LE PIÈGE CRLF DE B7c-4 S'EST REPRODUIT, par une autre porte.** `git stash` / `git stash pop` — employé pour comparer l'état d'avant — a réécrit **17 fichiers en CRLF** (`core.autocrlf = true`), sans que `git status` le montre. **9 262 fins de ligne** remises en LF, plus un retour chariot isolé dans `ruby/lecon-04` que la conversion en masse n'avait pas vu (il fallait retirer tous les `\r`, pas seulement les `\r\n`). Contrôle final : **0 fichier modifié ne porte de retour chariot**.

  **5. Contrôles.** `verif.js --rapide` **tout vert, 7 étapes** (37,3 s). `verif-html` **0 grave / 0 attention sur 1 612 fichiers**. `verif-donnees` **0 erreur**. `verif-rendu` sur les 10 pages touchées : **60 mesures**, **0 erreur, 0 avertissement**. `exos-texte.js` dans Chrome : **54 réponses tapées, 54 acceptées** (36 sur les 9 pages hôtes neuves, 18 sur les 6 pages allégées) ; passe adversariale **36 fausses tapées, 36 refusées**. `--rejouer` : **0 faute** (11 avant). Alignement `.exercise` ⇄ `data-exos` vérifié avant ET après chaque retrait ; les 39 pages du site qui portent plus de blocs que d'entrées sont **préexistantes et bénignes** (l'appariement se fait par index, le bloc surnuméraire est le dernier) — mesuré avant et après : 39 et 39. 0 BOM, 0 CRLF, 0 mojibake, JSON valide. `search-index.js` régénéré ; quiz, flashcards, antisèches et `search-lite` **identiques**.

  **6. Mesure.** Exercices à champ : **4 611 → 4 606** (−5). Exercices de prédiction : **72 → 67** (−4 retirés au titre du point 1, −1 perdue au point 2). Exercices citant leur propre page : **10 → 0**. Libellés de lien faux : **7 → 0**. Fautes rendues par `--rejouer` : **11 → 0**. Fins de ligne remises en LF : **9 262**.
- [x] **B7d · `bash`** ✅ **2026-08-26. Le seul lot du chantier dont les sorties ont été RÉELLEMENT EXÉCUTÉES — et le gisement annoncé (« 65 blocs ») ne se reproduit pas : il y en a 4.**

  **1. Ici, on n'a pas transposé : on a lancé.** Les huit rejeux précédents (cpp, rust, java, csharp, c, php, go, elixir) transposent le programme en JavaScript, faute d'avoir le langage sur la machine. `bash`, lui, **est installé** (GNU bash 5.3, vérifié) : `tools/preuves/rejoue-bash.js` écrit chaque bloc dans un fichier temporaire, le **LANCE**, et compare sa sortie ligne à ligne à celle que la leçon annonce. **4 scripts exécutés, 8 lignes comparées, 0 divergence.** C'est le seul rejeu du chantier qui ne puisse pas se tromper de la même façon que le contenu qu'il vérifie.

  **Contre-épreuve** : `--fausse=local` retire la déclaration locale des variables — **exactement 1 script** diverge, et sur la bonne ligne (« Après bon() : global » devient « Après bon() : interne »).

  **2. ⚠️ UN REJEU QUI EXÉCUTE DU CODE DOIT SE GARDER, ET LE PROUVER.** Deux barrières, dans cet ordre : (a) seuls les blocs **désignés** dans une liste blanche sont exécutés ; (b) chacun est **refusé** s'il contient une commande qui touche au système ou au réseau (`rm`, `mv`, `cp`, `curl`, `sudo`, `chmod`, une redirection vers un chemin absolu…). La seconde protège de la première : si une leçon change et qu'un bloc désigné devient dangereux, le rejeu s'arrête au lieu de l'exécuter. **Contre-épreuve du garde-fou : 42 des 212 blocs du cours seraient refusés (20 %)** — il sait donc refuser. Le script tourne dans un répertoire temporaire jetable, sans argument, sans entrée standard, avec un délai maximal.

  **3. Le chiffre du plan ne se reproduit pas, et la raison est de fond.** `pages/bash` compte **212 blocs**. À la règle stricte du générateur (« # Sortie : » en tête de la sortie), **4 seulement** annoncent ce qu'ils produisent — tous dans `lecon-08`, les fonctions — et **0 bloc** emploie la forme « # => ». Le plan annonçait « 65 blocs ». Ce n'est pas un défaut du cours : **un cours de shell montre surtout des commandes dont la sortie dépend de la machine** (`ls`, `df`, `date`, `ps`, un chemin, un nom d'utilisateur), et l'on ne peut rien en affirmer de fixe — c'est précisément ce que le plan pressentait en écrivant « ses sorties dépendent du système, et la règle A5 n'y suffit pas ». La règle A5 suffit, mais elle ne trouve que 4 blocs. Les 4 retenus ne touchent ni au disque, ni au réseau, ni à l'horloge : `echo`, arithmétique entière, portée des variables.

  **4. Deux exercices écrits sur trois.**

  | source → hôte | ce qu'on fait prédire | réponse exécutée |
  |---|---|---|
  | bash 08 → 10 | ce que devient une variable globale après une fonction qui déclare la sienne en local | `Après bon() : global` |
  | bash 08 → 11 | une somme rendue par `echo` et récupérée par substitution de commande | `Total : 42` |

  **La troisième cible est ÉCARTÉE** (« Code de sortie : 7 ») : la sortie de ce bloc fait deux lignes, et celle qui reste affichée est « Somme : 7 » — le chiffre demandé est donc écrit une ligne plus bas. **Même motif que `go/lecon-07` en B7c-5** : on donnait la valeur et on demandait l'étiquette. Le bloc reste vérifié par le rejeu (il tourne vraiment, et `$?` vaut bien 7) ; il ne porte simplement pas d'exercice.

  **5. Trois commentaires masqués, et un piège de comptage propre à Bash.** Dans le bloc de portée, « vit seulement dans la fonction », « global : intact, ouf » et « global : écrasé » énonçaient à eux trois toute la réponse : neutralisés par le champ `masquer`. ⚠️ **Le SHEBANG est un commentaire comme un autre pour le contrôle 11** (le marqueur de Bash est `#`) : il entre dans le compte déclaré, ce qui n'était le cas d'aucun autre lot.

  **6. Contrôles.** `verif.js --rapide` **tout vert, 7 étapes** (37,5 s). `verif-html` **0 grave / 0 attention sur 1 612 fichiers**. `verif-donnees` **0 erreur**. `verif-rendu` sur les 2 pages hôtes : **12 mesures**, **0 erreur, 0 avertissement**. `exos-texte.js` dans Chrome, en `file://` : **8 réponses tapées, 8 acceptées** ; adversarial **8 fausses, 8 refusées** ; **5 graphies élargies acceptées**. `--rejouer` : **0 faute**. 0 CRLF, 0 BOM, JSON valide. `search-index.js` régénéré ; les quatre autres index **identiques**.

  **7. Mesure.** Exercices à champ : **4 606 → 4 608** (+2). Exercices de prédiction : **67 → 69** (+2). Lignes de sortie **réellement exécutées et comparées** : **8**. Blocs du cours qui seraient refusés par le garde-fou : **42 sur 212**. Blocs à tête stricte : **4 sur 212** (et non 65).

---

## PHASE C — Le décodeur de messages d'erreur

C'est ce qu'un débutant cherche en premier, et le site n'en dit rien. Un fichier de données, une page
de recherche, et des renvois depuis les leçons.

- [x] **C1 · Le format et les 30 premières erreurs.** ✅ **2026-08-26. 31 entrées — et pas une seule n'a été écrite de mémoire : les 31 messages sortent d'une exécution, et 62 extraits sont rejoués à chaque passe de `verif.js`.**

  **1. Trois outils, et l'ordre compte.** `tools/preuves/capture-erreurs.js` porte 31 extraits fautifs — quelques lignes chacun, du code qu'un débutant écrit vraiment — les exécute (`node` pour JavaScript, `python` pour Python) et **relève le message que le moteur produit**. Il ne compare pas : il constate. Résultat de la passe : **31 extraits exécutés, 31 du type attendu, 0 qui ne casse pas.**

  **2. ⚠️ MAIS LE SITE N'EXÉCUTE PAS LE MÊME PYTHON QUE LA MACHINE, et c'était la vraie question.** Les messages de CPython ont changé plusieurs fois (les suggestions « did you mean » en 3.10, `UnboundLocalError` réécrit en 3.11, les erreurs de syntaxe précisées en 3.12). La machine porte **CPython 3.14.5** ; le site, lui, exécute **Pyodide 3.12.1** depuis la case A4. Publier les messages de l'un en laissant l'apprenant lire ceux de l'autre aurait vidé le décodeur de son intérêt.

  D'où `tools/preuves/erreurs-pyodide.html` et son pilote : les 16 extraits Python sont **rejoués dans le moteur du site**, en `file://`, DNS coupé. **16 messages sur 16 IDENTIQUES**, **0 requête distante**. L'apprenant retrouvera donc son message qu'il ait exécuté sur le site ou chez lui — et c'est mesuré, pas supposé.

  **3. Le format.** Chaque entrée porte : `message` (le texte EXACT), `gabarit` (le même, parties variables remplacées par des points de suspension), `motif` (l'expression rationnelle qui le reconnaît malgré les noms de variables qui changent — c'est elle dont vivra la recherche de C2), `cles`, `cause`, `remede`, `exemple.fautif`, `exemple.corrige`, `lecon` et `moteur`. Les deux exemples sont des programmes complets, **tous deux exécutés**.

  **4. `tools/verif-erreurs.js` — la 8ᵉ étape de `verif.js`.** Elle **réexécute les 62 extraits** (31 fautifs + 31 corrigés) et exige que :
  · le fautif produise **exactement** le message publié — pas « le même type d'erreur », le même texte au caractère près, puisque c'est ce texte que l'apprenant colle dans une recherche ;
  · la correction soit **muette** — sinon le remède est faux ;
  · le motif reconnaisse son propre message ; la leçon citée existe et son `<h1>` corresponde au libellé ; les champs soient présents et les identifiants uniques.
  ⚠️ Le contrôle EXÉCUTE du code : un garde-fou refuse tout extrait qui touche au disque, au réseau ou aux processus, avec **une dérogation nommée** — le `fetch(` de l'exemple `await` hors `async`, écrit dans un fichier qui ne compile pas et ne s'exécute donc jamais. On déroge en le disant plutôt que d'affaiblir le garde-fou.

  **5. UN CONTRÔLE VERT DU PREMIER COUP DOIT PROUVER QU'IL SAIT ROUGIR.** `scratchpad/v14-c1/contre-epreuve.js` sabote le fichier de données de quatre façons, une à la fois : un message faux **d'un seul caractère**, une correction qui ne corrige rien, une leçon inexistante, un motif qui ne reconnaît pas son message. **4 détectés sur 4**, et le fichier est restauré à l'**empreinte identique** (`efb84c1f4744…`). C'est le contrôle du contrôle que ce chantier a appris à exiger : trois fois déjà, un vert s'était révélé vide.

  **6. Ce que couvrent les 31 entrées.** JavaScript (15) : `ReferenceError` sur un nom, zone morte temporelle, `Cannot read properties of undefined`, `is not a function`, affectation à une constante, `is not iterable`, pile saturée, les deux `SyntaxError` de `JSON.parse`, écriture dans un élément `null`, `map` sur un objet, identifiant déjà déclaré, parenthèse non fermée, `toFixed` hors bornes, `await` hors `async`. Python (16) : `NameError` avec suggestion, concaténation `str` + `int`, indentation attendue, indice hors liste, `KeyError`, méthode inexistante (`push` au lieu d'`append`), `int()` sur un mot, division par zéro, chaîne immuable, deux-points manquants, parenthèse jamais fermée, module introuvable, argument manquant, `UnboundLocalError`, récursion infinie, entier non itérable.

  **7. 🔵 RELEVÉ HORS PÉRIMÈTRE, trouvé en fixant la convention des liens.** `js/projets-data.js` écrit ses liens sous la forme `../pandas/cours.html` alors que sa page hôte, `pages/projets.html`, est à la racine de `pages/` : **38 liens, 29 distincts, qui ne résolvent NI depuis `pages/` NI depuis la racine**. Ils sont tous dans le champ `pistes`, replié dans un `<details>`, ce qui explique qu'ils n'aient jamais été vus. **Aucun invariant ne surveille les liens des fichiers de données.** Le décodeur, lui, écrit `js/lecon-02.html` (base `pages/`), et `verif-erreurs.js` vérifie que chaque cible existe. Correction de `projets-data.js` : chantier à part.

  **8. Contrôles.** `verif.js --rapide` **tout vert, 8 étapes** (45,4 s — la nouvelle en pèse 8,2). `verif-html` **0 grave / 0 attention sur 1 612 fichiers**. `verif-donnees` **0 erreur**. `node --check` sur les trois fichiers JavaScript neufs. 0 CRLF, 0 BOM, **0 URL de CDN**. Rien n'est encore affiché à l'apprenant : le rendu est la case **C2**.

  **9. Mesure.** Entrées : **31** (15 JavaScript, 16 Python). Messages capturés par exécution : **31**. Messages Python revérifiés dans le moteur du site : **16 sur 16 identiques**. Extraits réexécutés à chaque passe de `verif.js` : **62**. Sabotages détectés : **4 sur 4**. Requêtes distantes : **0**. Liens cassés relevés ailleurs : **38**.
- [x] **C2 · La page de recherche.** ✅ **2026-08-26. On colle la trace entière, on obtient la fiche — et c'est mesuré dans Chrome : 31 messages sur 31 rendent la bonne fiche EN PREMIER, y compris avec d'autres noms de variables.**

  **1. Ce que la page fait.** `pages/decodeur.html` + `js/decodeur.js`. On y colle **la trace entière** — chemins Windows, numéros de ligne, `at Object.<anonymous>`, `Traceback (most recent call last)` — sans rien nettoyer : la page isole la ligne qui porte le message, puis cherche. Trois passes, de la plus sûre à la plus tolérante : **le motif** (l'expression rationnelle qui ignore les noms propres), **les clés** (morceaux de phrase stables), puis **les mots restants**. Le score affiche laquelle a répondu — « correspondance exacte », « probable », « piste » — pour que l'apprenant sache ce qu'on lui propose. Filtre par langage, liste complète des 31 erreurs quand le champ est vide, fiches dépliables.

  **2. L'ÉPREUVE, ET C'EST ELLE QUI COMPTE.** `tools/preuves/decodeur.js`, dans Chrome, en `file://`, DNS coupé. Les épreuves sont construites **à partir du fichier de données lui-même** : aucun message n'est retapé dans le script.

  | épreuve | ce qu'on colle | résultat |
  |---|---|---|
  | message exact | les 31 messages publiés, tels quels | **31 / 31** en première position |
  | trace entière | le même message noyé dans une vraie trace Node ou Python | **31 / 31** |
  | **autres noms** | le message avec les variables d'un AUTRE programme (`monComtpeur`, `panier.ajouterProduit`, `'code_postal'`, `calculer_moyenne()`…) | **18 / 18** |
  | contre-épreuve | trois messages inventés de toutes pièces | **3 / 3 REFUSÉS** |

  La troisième ligne est la seule qui compte vraiment : c'est le cas réel, et c'est celui qu'une recherche par mots rate. La quatrième aussi — sans elle, un décodeur qui répondrait « oui » à tout passerait les trois premières. **0 erreur de console, 0 requête distante.**

  **3. DEUX DÉFAUTS TROUVÉS PAR L'ÉPREUVE, que la relecture n'aurait pas vus.**
  · **Deux motifs peuvent reconnaître le même message, et le plus GÉNÉRAL gagnait par simple ordre d'écriture.** « TypeError: scores.map is not a function » était rendu par la fiche générique « … is not a function » au lieu de la fiche sur `map` appliqué à un objet ; pire, « TypeError: 'int' object is not iterable » — **du Python** — était rendu par la fiche **JavaScript** « … is not iterable ». À score égal, on départage désormais par la **spécificité du motif** : plus il porte de caractères littéraux, moins il est un attrape-tout.
  · **La troisième passe rattrapait n'importe quoi.** « GraveError: everything is on fire in the datacenter », inventé pour la contre-épreuve, remontait une fiche — parce qu'il partage le mot « the » avec « the top level bodies of modules ». Mots vides ignorés, et **au moins deux mots communs** exigés.

  **4. ⚠️ ET UNE FAUSSE ALERTE, ÉCRITE NOIR SUR BLANC DANS LE CSS.** `verif-rendu.js` mesure la page telle qu'elle se CHARGE, fiches repliées : il ne voit ni les blocs de code, ni la grille à deux colonnes. J'ai donc écrit une sonde qui ouvre les 31 fiches — elle a annoncé **277 px de débordement à 320 px de large**. J'ai corrigé le CSS… puis remesuré : **c'était la sonde qui était fausse**. Elle comptait le bord droit de TOUS les éléments, y compris ceux d'un `pre { overflow-x: auto }`, dont le contenu est évidemment plus large que son conteneur — c'est le principe même d'une zone qui défile. Contre-épreuve faite en retirant le correctif : **le débordement réel du document vaut 0 px avec ou sans lui**. La règle `min-width: 0` est conservée parce qu'elle est juste, **pas parce qu'elle a corrigé quelque chose**, et le commentaire du CSS le dit. C'est le pendant exact de la leçon connue de ce chantier — un contrôle qui ne peut pas échouer rend un vert vide — appliqué dans l'autre sens : **un contrôle mal écrit rend un rouge tout aussi vide, et fait « corriger » ce qui n'était pas cassé.**

  **5. Atteignable, sinon elle n'existe pour personne.** Lien ajouté au pied de l'accueil (colonne « Réviser & référence ») **et au pied de page des 1 523 leçons** (`js/main.js`, `LESSON_FOOTER_COLS`) — c'est là qu'on bloque, donc là qu'on cherche. Aucun fichier de leçon n'a été modifié pour cela.

  **6. Contrôles.** `verif.js --rapide` **tout vert, 8 étapes** (43,3 s). `verif-html` **0 grave / 0 attention sur 1 612 fichiers**. `verif-donnees` **0 erreur**. `verif-rendu` sur la page : **6 mesures** (3 largeurs × 2 thèmes), **0 erreur, 0 avertissement**. Débordement fiches OUVERTES, sonde corrigée : **0 px** aux trois largeurs, dans les deux thèmes. Aucune couleur en dur dans le CSS neuf : **23 variables employées, 0 non définie**. Accolades équilibrées (1 392 / 1 392). 0 CRLF, 0 BOM, **0 URL de CDN**. `search-index.js` et `search-lite.js` régénérés (**1 587 → 1 588** pages) ; quiz, flashcards et antisèches **identiques**.

  **7. Ce qui reste à faire, et qui est une autre case.** Le décodeur ne renvoie pas encore vers les leçons DEPUIS les leçons : une leçon qui enseigne une notion dont l'erreur est fréquente devrait pointer vers sa fiche, et inversement. C'est **C4**. Et il ne couvre que JavaScript et Python : les autres familles sont **C3**.

  **8. Mesure.** Entrées interrogeables : **31**. Épreuves jouées dans Chrome : **80** (31 exactes + 31 traces + 18 renommées) — **80 réussites**. Messages inventés refusés : **3 sur 3**. Défauts de la recherche trouvés par l'épreuve : **2**, corrigés. Fausse alerte de rendu : **1**, documentée. Requêtes distantes : **0**.
- [x] **C3 · Étendre aux autres langages.** ✅ **2026-08-26. 31 → 55 erreurs : +14 SQL, +10 Bash — et le choix des deux familles n'est pas un choix éditorial, c'est ce que la machine permet de PROUVER.**

  **1. La règle de C1 décide de ce qui est faisable.** « Chaque message doit être copié d'une exécution réelle. » Inventaire des moteurs disponibles : `go`, `gofmt`, `elixir`, `iex`, `erl`, `java`, `javac`, `gcc`, `php`, `ruby`, `sqlite3` — **tous absents** ; `dotnet` présent mais **sans SDK utilisable** (« the command could not be loaded ») ; `perl` présent. Restent, pour de vrai : **Node**, **Python**, **bash**, **Perl**, et surtout — le point qu'on aurait pu manquer — **le SQLite EMBARQUÉ DU SITE**. Les deux familles retenues sont donc SQL et Bash : quatre cours du site reposent sur SQL (`sql`, `bdd`, `nosql`, `data-eng`), et c'est **le moteur du site lui-même** qui rend les messages. Perl est laissé de côté : un cours de niche contre deux familles centrales.

  **2. SQL : capturé LÀ OÙ L'APPRENANT LE VERRA.** `tools/preuves/erreurs-sql.html` monte un petit schéma (client, commande, une contrainte d'unicité, une NOT NULL, une clé étrangère) dans **sql.js**, y joue les requêtes fautives et relève ce que **SQLite 3.49.1** écrit. 14 messages : table inconnue, colonne inconnue, `near "FORM": syntax error`, contrainte UNIQUE, contrainte NOT NULL, colonne ambiguë en jointure, nombre de valeurs, fonction inexistante (le piège `NOW()`, qui est du MySQL), agrégat dans un WHERE, sous-requête à deux colonnes, entrée incomplète, `ORDER BY` hors bornes, table déjà existante, clé étrangère.

  **3. Bash : DEUX PROPRIÉTÉS MESURÉES, que rien n'annonçait.**
  · **Les messages du shell sont LOCALISÉS.** On force `LC_ALL=C` et l'on publie la forme anglaise — celle que l'on retrouve sur la plupart des machines et dans tous les forums.
  · **Ils sont PRÉFIXÉS par le fichier et la ligne** (« `/tmp/xyz.sh: line 1: …` »). Ce préfixe change à chaque exécution : il est retiré à la capture, et le vérificateur applique la même normalisation avant de comparer. Ce qui est publié est la partie stable, donc cherchable.
  ⚠️ Et un piège d'écriture d'extrait : `if [ $x -eq ]; then … fi` **ne casse pas le script** — le `if` absorbe l'échec du test, le script sort avec 0 et rien n'est capturé. L'extrait a été ramené au test nu.

  **4. Le vérificateur dit ce qu'il ne fait pas.** `tools/verif-erreurs.js` exécute désormais aussi **Bash**. Pour SQL, il ne peut rien : aucun `sqlite3`, et sql.js est un moteur de NAVIGATEUR. Plutôt que de laisser 14 entrées passer en silence, il les compte comme **déléguées** et nomme l'outil qui les rejoue. Celui-ci — `tools/preuves/erreurs-sql.js`, **9ᵉ étape de `verif.js`** — les rejoue dans Chrome, en `file://`, DNS coupé : **14/14 conformes, 0 faute, 0 requête distante**, chaque entrée sur une **base neuve** (sans quoi un INSERT réussi changerait le résultat du suivant, et l'ordre des entrées deviendrait significatif).

  **5. Une règle assouplie, et pourquoi ce n'est pas une complaisance.** Le contrôle exigeait que le champ `type` OUVRE le message. C'est juste en JavaScript et en Python — ce sont des noms d'exception. En SQL et en Bash, il n'existe pas de type formel : le moteur préfixe par autre chose (« near "FORM": syntax error », « monoutil: command not found »). On exige donc, pour ces deux langues seulement, que le type **figure** dans le message. La règle forte est conservée là où elle a un sens.

  **6. Les contre-épreuves, parce que tout était vert du premier coup.** `scratchpad/v14-c3/contre-sql.js` sabote une entrée SQL de deux façons — un message faux **d'un seul caractère**, une correction qui échoue encore — : **2 détectées sur 2**, fichier restauré à l'**empreinte identique**. (Les 4 sabotages de C1 restent joués par `scratchpad/v14-c1/contre-epreuve.js`.)

  **7. La page suit.** Filtres **SQL** et **Bash** ajoutés. L'épreuve de C2 est rejouée sur les 55 entrées : **55/55 messages exacts en première position, 55/55 traces entières, 29/29 avec d'autres noms de variables, 3/3 messages inventés refusés**, 0 erreur de console, 0 requête distante. Débordement fiches ouvertes : **0 px** aux trois largeurs, dans les deux thèmes.

  **8. Un défaut de forme corrigé chemin faisant.** Les 24 entrées neuves avaient été écrites en **JSON compact** (`exemple: {"fautif":…,"corrige":…}`) là où les 31 premières développent leurs champs : deux styles dans un fichier destiné à être relu et complété à la main. Tout le fichier a été réécrit dans un seul format, **données identiques avant/après**, vérifié par relecture du tableau.

  **9. Ce qui reste bloqué, et il faut le dire.** Les autres familles du site — C, C++, Java, C#, Go, Rust, PHP, Ruby, Elixir, Kotlin… — **ne peuvent pas être traitées ici** : sans compilateur ni interpréteur, tout message serait reconstitué de mémoire, ce que C1 interdit explicitement et pour une bonne raison (un message approximatif ne sera jamais retrouvé par recherche). Deux voies existent pour plus tard, et aucune n'est un petit travail : embarquer un moteur de plus (comme Pyodide et sql.js l'ont été en A2/A4), ou relever les messages sur une machine outillée et les importer avec leur provenance. **Ce n'est pas un renoncement mais une limite mesurée** : le décodeur couvre les quatre langages que le site sait exécuter, et il le dit dans son en-tête.

  **10. Contrôles.** `verif.js --rapide` **tout vert, 8 étapes** (46,1 s) ; la 9ᵉ (`err-sql`) tourne hors du mode rapide, comme tout ce qui pilote Chrome. `verif-html` **0 grave / 0 attention sur 1 612 fichiers**. `verif-donnees` **0 erreur**. `verif-rendu` sur la page : **6 mesures**, **0 erreur, 0 avertissement**. `node --check` sur les fichiers touchés. 0 CRLF, 0 BOM, **0 URL de CDN**. `search-index.js` et `search-lite.js` régénérés.

  **11. Mesure.** Entrées : **31 → 55** (15 JavaScript, 16 Python, **14 SQL**, **10 Bash**). Extraits réexécutés par `verif-erreurs` : **62 → 78**. Entrées rejouées dans le moteur du site : **14**. Épreuves jouées dans Chrome : **139** (55 + 55 + 29) — **139 réussites**. Sabotages détectés : **2 sur 2** (SQL), **4 sur 4** (C1). Moteurs employés : **4**. Moteurs indisponibles, donc familles écartées : **11 langages nommés**.
- [x] **C4 · Relier aux leçons.** ✅ **2026-08-26. Le lien existe désormais dans les DEUX sens — et l'épreuve qui le prouve a dû être refaite, parce que la première ne prouvait pas ce qu'elle annonçait.**

  **1. Un sens existait déjà, l'autre non.** Chaque entrée du décodeur cite sa leçon, et `verif-erreurs.js` vérifie depuis C1 que la leçon existe et que son titre correspond au libellé. Ce qui manquait, c'est le retour : une leçon qui enseigne une notion dont l'erreur est fréquente doit le DIRE. Les **31 leçons citées** (5 `bash`, 11 `js`, 10 `python`, 5 `sql`) affichent désormais un encart « quand ça casse, ici, c'est souvent&nbsp;: », qui liste les erreurs les concernant et mène au décodeur.

  **2. Comment, sans alourdir 1 523 pages.** Trois pièces :
  · `tools/build-erreurs-index.js` **dérive** `js/erreurs-index.js` (**7 Ko** : href → id, gabarit, langue) du fichier de données (**54 Ko**). Mode comparaison par défaut, `--write` pour écrire — la convention de `build-index.js`.
  · `js/lecon.js` : `initDecodeur()` construit l'encart **si** l'index est chargé **et** si la leçon y figure. La clé est reconstruite depuis l'URL, jamais inscrite dans les pages.
  · la balise `<script src="…/erreurs-index.js">` n'est posée que sur les **31 leçons concernées** : les 1 492 autres ne chargent rien de plus. L'outil de pose est idempotent et refuse toute page dont la balise de `lecon.js` manque.

  **3. L'épreuve : `tools/preuves/decodeur-lecons.js`, 11ᵉ étape de `verif.js`.** Rien dans le source des leçons ne montre l'encart — il est construit à l'exécution : ni `verif-html` ni `verif-donnees` ne peuvent le voir. Le contrôle ouvre donc les pages, en `file://`, DNS coupé : **31/31 leçons portent l'encart, avec le BON NOMBRE d'erreurs**, et un lien dont **la cible existe vraiment sur le disque** — le chemin est relatif, et une profondeur fausse ne se voit pas autrement. **3/3 témoins** n'ont ni encart ni index. **0 requête distante.**

  **4. ⚠️ LA CONTRE-ÉPREUVE A DÉMOLI MA PREMIÈRE ÉPREUVE, et c'est le vrai enseignement de cette case.** J'ai saboté `js/lecon.js` de deux façons pour vérifier que le contrôle savait rougir. Le premier sabotage (profondeur du lien fausse) a bien été détecté. **Le second — poser l'encart même sans données — est passé inaperçu.** Raison : une leçon non citée **ne charge pas l'index**, donc `initDecodeur` sort à sa première ligne. Mes témoins mesuraient la **sélection des balises**, pas la logique — deux choses différentes, dont une seule était annoncée.

  L'épreuve a donc été rendue décisive : on ouvre une leçon **citée** après avoir rendu `window.ERREURS_INDEX` **non inscriptible**, de sorte que le script de la page ne puisse pas le remplir ; l'index reste vide, et l'encart ne doit PAS apparaître. **⚠️ Piège de CDP au passage** : sans `Page.enable`, `Page.addScriptToEvaluateOnNewDocument` est **accepté mais sans aucun effet** — l'index se remplissait normalement et l'épreuve rendait un faux négatif silencieux. Après correction : **2 sabotages sur 2 détectés**, `js/lecon.js` restauré à l'empreinte identique.

  **5. Contrôles.** `verif.js --rapide` **tout vert, 8 étapes** (46,8 s) ; les étapes 9 à 11 (`err-sql`, `dec-lec`, `stockag`) tournent hors du mode rapide, comme tout ce qui pilote Chrome. `verif-html` **0 grave / 0 attention sur 1 612 fichiers**. `verif-donnees` **0 erreur**. `verif-rendu` sur 4 leçons à encart (une par langage) : **24 mesures** (3 largeurs × 2 thèmes), **0 erreur, 0 avertissement**. CSS neuf : **0 couleur en dur**, accolades équilibrées. **1 208 retours chariot** retirés de 3 pages SQL, que le dépôt stocke en LF. `search-index.js` et `search-lite.js` : **identiques** (l'encart ne change pas le texte indexé). 0 BOM, **0 URL de CDN**.

  **6. Mesure.** Leçons reliées au décodeur : **31** (0 avant). Renvois posés : **55**. Poids ajouté aux leçons concernées : **7 Ko** (l'index dérivé) ; aux 1 492 autres : **0**. Épreuves jouées dans le navigateur : **31 leçons + 3 témoins + 1 épreuve de logique**. Sabotages détectés après correction du contrôle : **2 sur 2** — **1 sur 2** avant.

---

## PHASE D — Un bac à sable Git

Le cours `git` fait 24 leçons sans **aucune** pratique interactive, alors que c'est la référence la
plus utilisée du domaine et que tout est simulable en JavaScript : un dépôt Git est un graphe de
commits, et les commandes courantes sont des opérations sur ce graphe.

- [x] **D1 · Le modèle.** ✅ **2026-08-26. Les empreintes ne sont pas inventées : ce sont celles du vrai Git — et le modèle a été DÉMOLI par trois passes adversariales avant d'être refait.**

  **`js/git-modele.js`** (941 lignes) : SHA-1 écrit en entier, encodage UTF-8, objets `blob`/`tree`/`commit` au **format binaire réel**, index, répertoire de travail, références, HEAD (symbolique ou détaché), résolution de révisions (`~`, `^`, `^{commit}`, oid abrégé, étiquettes), ancêtres, bases de fusion, statut à trois zones, diff d'arbres, export/import pour `localStorage`. Script classique, aucun module ES, aucune dépendance : il tourne en `file://` **et** dans Node.

  **La preuve, en trois étages.**

  1. **`tools/verif-git-modele.js` — 166 comparaisons contre `git 2.54.0.windows.1`, 0 écart, 8,3 s.** Le même scénario est monté dans un vrai dépôt temporaire, et on compare : 12 blobs (`git hash-object`), 6 jeux d'arbres en écriture **et** relecture (`write-tree` / `ls-tree`), 5 commits (`commit-tree`), 6 contrôles de bout en bout (`git add` + `git commit -m`), 20 questions de graphe (`rev-parse HEAD~n/^n`, `merge-base`, `--is-ancestor`, `log`), 6 diffs (`diff --name-status`), 5 contrôles de sérialisation, 10 états face à `git status --porcelain`, **28 contrôles sur les noms pièges**, **12 sur l'ordre du journal**, **31 sur les références, les modes, le checkout et l'import**. Branché comme **9ᵉ étape « gitmodl » de `tools/verif.js`** (sautable si git est absent) : `--rapide` vert en **54,6 s**.
  2. **`tools/verif-git-modele-mutations.js` — 29 fautes injectées, 29 détectées.** Un vert qui ne sait pas devenir rouge ne prouve rien : chaque règle du modèle est abîmée dans une copie, et le vérificateur doit s'en apercevoir. Il l'a fait 29 fois sur 29 (18/18 à la première version, puis 11 mutations neuves tirées des fautes ci-dessous).
  3. **`tools/preuves/git-modele.{html,js}` — Chrome, `file://`, DNS coupé, SANS `--allow-file-access-from-files` : 13 valeurs, 0 écart avec Node, 0 requête distante, 403 ms.** C'est la condition de l'apprenant, et c'est la seule qui compte.

  **⚠️ CE QUE LA CONTRADICTION A TROUVÉ — et que quatre contrôles verts n'avaient pas vu.** Trois agents ont attaqué le modèle sur trois axes disjoints (objets et arbres, graphe et révisions, index et statut), chacun montant ses cas dans un vrai dépôt git : **417 questions posées, ~76 divergences PROUVÉES.** Les causes racines :

  - **Les dictionnaires étaient des objets ORDINAIRES.** Un fichier ou un dossier nommé `constructor`, `toString`, `valueOf`, `hasOwnProperty` ou `__proto__` disparaissait en silence, ou **arrêtait le bac à sable sur une exception** — 22 divergences à lui seul. Un chemin est une donnée de l'apprenant : tout dictionnaire indexé par un nom vient désormais d'`Object.create(null)`. **Et le traducteur du VÉRIFICATEUR avait exactement le même trou**, donc il masquait la faute du modèle : *un contrôle qui reproduit le défaut de ce qu'il contrôle rend un vert par vacuité.*
  - **`git log` trie sur la date du COMMITTEUR**, pas d'auteur — le modèle ne lisait même pas la ligne `committer`. Il écrit et lit maintenant les deux dates, ce qui est précisément ce que D2 devra montrer d'un `rebase`.
  - **À dates égales — la norme, l'horloge du bac à sable est déterministe — le départage se faisait par empreinte** : 11 inversions parent-avant-enfant sur 15 graphes, contre 0 chez git. C'est l'**ordre d'insertion** qui fait foi.
  - **Et la « garde topologique » que j'avais ajoutée était FAUSSE.** Le contrôle neuf l'a démontré : sur un graphe dont la fusion a la **racine** pour second parent, `git log` sort la racine **avant** ses propres descendants. Git n'a pas de garde topologique, c'est une file de priorité. La garde a été retirée — *c'est le contrôle qui a corrigé le correctif.*
  - **Une ÉTIQUETTE l'emporte sur une branche de même nom** (le modèle faisait l'inverse) ; `refs/<nom>` manquait ; un **préfixe ambigu** doit échouer sans contexte et se trancher par le type avec `^{commit}` ; `resoudre` **levait une exception** là où toutes les autres impasses rendent `null` ; un `.trim()` rognait des espaces que git ne rogne pas.
  - **`pointerHEAD("main")` (nom court) détachait HEAD sur la CHAÎNE « main »** : `oidHEAD()` rendait « main » et le `lireCommit` suivant mourait trois pas plus loin, sans rapport visible avec la cause. La cible est validée.
  - **Un dossier remplacé par un fichier de même nom fabriquait un index que le vrai git REFUSE** (`duplicateEntries: refusing to create malformed object`, mesuré) ; **les modes n'étaient jamais comparés** (`chmod +x`, lien symbolique = le « T » de git) ; **`materialiser` effaçait les fichiers NON SUIVIS** — un checkout ne fait pas ça — et mourait sur un sous-module ; **`importer` PARTAGEAIT ses structures** (écrire dans une copie modifiait l'autre) et perdait une horloge à 0, le fuseau et le pas.
  - **`utf8` encodait un substitut isolé en CESU-8 et AVALAIT le caractère suivant** (`"a\ud83db"` perdait le « b ») : un cas atteignable dès qu'une leçon découpe une chaîne au milieu d'un emoji.
  - **`lireArbre` rend un dictionnaire**, donc « 2 » sortait avant « 10 » : l'affichage passe maintenant par `listerArbre`, trié par octets comme `git ls-tree`.

  **Après correction, les scripts adversariaux rejoués : objets 24 → 2 divergences, graphe 27 → 7, statut 31 → 12.** Tout le reste est **assumé et écrit en tête du modèle** : renommages non détectés (comme `--no-renames`), dossiers non suivis non repliés (comme `-uall`), reflog absent (`HEAD@{0}`), représentant arbitraire quand il y a **plusieurs** bases de fusion (l'ensemble, lui, est celui de `merge-base --all`) — plus la casse de NTFS (git lui-même refuse `MAIN` une fois les refs empaquetées) et deux artefacts des scripts adversariaux eux-mêmes.

  **Deux pièges de fabrication, notés pour la suite.** `git commit-tree` ne complète PAS le message par un saut de ligne alors que `git commit -m` le fait : 4 « écarts » venaient du canal de comparaison et non du modèle — l'étape « porcelaine » prouve désormais la règle au lieu de la contourner. Et l'outil d'écriture transforme la séquence `\0` d'un source en **octet NUL brut** : le fichier passait pour binaire aux yeux de `grep` et de `git diff`.
- [x] **D2 · Les commandes.** ✅ **2026-08-26. Quinze commandes écrites par-dessus le modèle, 6 976 comparaisons contre le vrai git sans un écart — après que trois passes adversariales eurent rendu 99 fautes distinctes sur la première version.**

  **`js/git-commandes.js`** (2 717 lignes) : `add`, `rm`, `commit`, `status`, `log`, `branch`, `tag`, `checkout`, `switch`, `reset`, `merge`, `rebase`, `revert`, `cherry-pick`, `diff`. Chaque commande rend `{ ok, code, sortie, explication }` : `sortie` reproduit CE QUE GIT ÉCRIT, en anglais (traduire « Fast-forward » enseignerait un git qui n'existe pas), `explication` est la glose française que l'interface affichera à côté. Script classique, aucune dépendance : le fichier tourne dans Node **et** en `file://`.

  **Ce que la couche ajoute au modèle :** un analyseur d'arguments par commande (drapeaux, options à valeur, formes groupées `-am`, `-m"msg"`, `--message=msg`, séparateur `--`, pathspecs à joker), un diff3 sur les lignes, la fusion à trois voies **écrite une seule fois** — parce que `merge`, `rebase`, `revert` et `cherry-pick` font littéralement la même chose et ne diffèrent que par la base qu'ils choisissent —, et l'état d'une opération interrompue (chemins non résolus, second parent en attente, liste des commits restants), sérialisable pour D4.

  **La preuve, en quatre étages.**

  1. **`tools/verif-git-commandes.js` — 68 scénarios, 6 976 comparaisons contre `git 2.54.0.windows.1`, 0 écart, 71,5 s.** Chaque scénario est joué des DEUX côtés, et après CHAQUE commande on compare six choses : la sortie ligne à ligne (stdout + stderr), la réussite, `git status --porcelain`, HEAD, toutes les références (`git show-ref`), le contenu de chaque fichier du répertoire de travail — marqueurs de conflit compris — et l'arbre de HEAD. Branché comme **11ᵉ étape « gitcmd » de `tools/verif.js`** : `--rapide` vert en **110 s**.
  2. **`tools/verif-git-commandes-mutations.js` — 57 fautes injectées, 57 détectées.** Un vert qui ne sait pas devenir rouge ne prouve rien.
  3. **`tools/preuves/git-commandes.{html,js}` — Chrome, `file://`, DNS coupé : 13 valeurs, 0 écart avec Node, 0 requête distante, 414 ms.** Une session complète (créer, brancher, fusionner en conflit, résoudre, rebaser, exporter, réimporter) jouée dans la condition de l'apprenant.
  4. **La contradiction : 3 agents, 379 scénarios, ~33 000 comparaisons, 99 fautes distinctes prouvées.**

  **⚠️ CE QUE LA CONTRADICTION A TROUVÉ — sur un code que 3 263 comparaisons déclaraient déjà vert.** Trois agents ont attaqué sur des axes disjoints (fusion et conflits ; rejouer des commits ; les trois zones et la ligne de commande), chacun montant ses cas dans un vrai dépôt git. Les fautes les plus graves :

  - **`git merge` ÉCRASAIT LE TRAVAIL NON COMMITÉ**, sous quatre formes, sans un mot. La cause : `poser()` reconstruisait le répertoire de travail ENTIER à partir de l'arbre fusionné, au lieu de ne toucher qu'aux chemins que la fusion change. Un brouillon sur un fichier même pas concerné par la fusion disparaissait. C'est la faute la plus grave du lot : le bac à sable est justement l'endroit où l'on apprend que git protège le travail.
  - **`git checkout -b <branche> <départ>` ne basculait NI l'index NI le répertoire de travail** : le bac à sable affichait le contenu d'un AUTRE commit que celui sur lequel il disait être, et le commit suivant ressuscitait des fichiers.
  - **Le rebasage perdait son état dès le DEUXIÈME commit rejoué.** `derouler()` capturait `etat(depot)` une seule fois, et `C.commit` remplaçait l'objet : à partir du deuxième tour, tout ce qu'on écrivait dedans tombait dans le vide. Conséquences mesurées : dates d'auteur perdues (donc empreintes fausses), et surtout **un conflit au deuxième commit laissait l'apprenant sur une tête détachée d'où AUCUNE commande ne le sortait** — `--continue` et `--abort` répondaient « no rebase in progress », et `git commit` figeait les marqueurs `<<<<<<<` dans un vrai commit.
  - **`git rm` supprimait un fichier modifié** (git refuse), et mutait le dépôt AVANT de valider tous les chemins.
  - **`git reset HEAD <fichier>` désindexait TOUT** — sur la commande la plus enseignée du cours.
  - **Toute option inconnue était ignorée en silence, et la commande AGISSAIT** : `git add --zzz f.txt` ajoutait le fichier. Une option ignorée est pire qu'une option absente : elle enseigne un drapeau qui n'a rien fait.
  - **`git commit -am "msg"` était refusé** (les formes groupées n'étaient pas décomposées), **`git checkout <fichier>` sans `--` aussi**, `git add sous/` aussi : le bac à sable refusait ce que tout le monde tape.
  - **`git commit -m ""` créait un commit au message vide** ; **`git branch -m` écrasait une branche existante** ; **`git tag -l v*` CRÉAIT une étiquette nommée « v* »** ; **`git cherry-pick A B` n'appliquait que A** en annonçant que tout allait bien.
  - Et une trentaine de fautes d'affichage, chacune un mensonge en puissance : `Reapply "x"` au lieu de `Revert "Revert "x""` (git ≥ 2.34), les chemins non-ASCII **échappés en octal par git mais pas ici** — sauf que le format porcelaine cite aussi l'espace et le format long non —, le tableau par fichier que `git commit` n'affiche PAS et que `git merge` affiche, l'ordre entrelacé de `Auto-merging` et `CONFLICT`, « detached **at** » qui devient « detached **from** » dès qu'on a commité…
  - **Deux règles de fusion que seule la mesure pouvait donner** : deux zones en conflit séparées par **trois lignes ou moins n'en font qu'UNE** chez git (contexte de xdiff ; seuil vérifié à 0-1-2-3 recollés, 4-5-6-8 séparés), et quand la base est vide (fichier ajouté des deux côtés) **git apparie les deux versions entre elles**, ce qui sort le préfixe commun du conflit.

  **Après correction, les trois scripts adversariaux rejoués : fusion 53 → 7 cas en écart, séquences 61 → 2, zones 121 → 14 commandes.** Ce qui reste est **écrit en tête du fichier** : renommages non détectés (la dette la plus lourde — elle change le RÉSULTAT d'une fusion, pas seulement son étiquette), fusion « octopus », `--squash`, `rebase -i`, étiquettes annotées et branches orphelines **refusées avec un message qui le dit** plutôt qu'exécutées de travers, `git diff` sans diff unifié, pas de répertoire courant, et les blocs d'aide de quarante lignes que git déroule sur une option inconnue.

  **⚠️ TROIS ENSEIGNEMENTS DE MÉTHODE, tous payés comptant.**
  - **Un contrôle vert ne mesure que ce qu'on lui a donné à mesurer.** Les 3 263 premières comparaisons étaient vertes ; elles portaient sur les scénarios que j'avais écrits moi-même. Les 68 scénarios d'aujourd'hui incluent, pour chaque faute trouvée, le cas qui l'avait révélée — sans quoi rien ne protégerait la correction.
  - **Une mutation qui n'abîme rien rend un faux trou.** Trois des « trous » de la contre-épreuve étaient des mutations ÉQUIVALENTES : `el || en` là où l'un des deux est toujours nul, une variable déclarée mais non utilisée, une ligne dont `indexer()` faisait déjà le travail. Il a fallu les remplacer par des fautes réelles pour que le contrôle prouve quelque chose.
  - **Deux horloges valent mieux qu'une.** Avec une date unique des deux côtés, une date d'auteur perdue par un rebasage produit **exactement la même empreinte** : la faute est invisible. Le vérificateur règle désormais séparément `GIT_AUTHOR_DATE` et `GIT_COMMITTER_DATE`, ce qui est aussi la seule façon de voir que `commit --amend` CONSERVE l'auteur et renouvelle le committeur.

  **Mesure.** Commandes : **15**. Lignes : `js/git-commandes.js` **2 717**, `tools/verif-git-commandes.js` **1 652**, la contre-épreuve **244**, la preuve navigateur **137**. Comparaisons contre le vrai git : **6 976** dans le dépôt, **~33 000** de plus par les trois scripts adversariaux (dans `scratchpad/`, rejouables). Fautes injectées détectées : **57/57**. Poids ajouté au site : **256 Ko** (aucune page ne le charge encore — c'est D3 qui l'affichera). `verif.js --rapide` : **11 étapes, 110 s, tout vert**. 0 requête distante, 0 URL de CDN, 0 BOM, 0 retour chariot.
- [x] **D3 · La visualisation.** ✅ **2026-08-26. Le graphe est celui de `git log --graph` : l'ORDRE des lignes est exact — 0 écart sur 2 651 comparaisons dans le dépôt, et 0 sur 264 373 comparaisons d'une passe adversariale qui a énuméré exhaustivement les graphes jusqu'à six commits. La PAGE qui l'affiche est pilotée au clavier dans Chrome, en `file://`, DNS coupé : 18 valeurs, 0 écart.**

  **`js/git-graphe.js`** (646 lignes) : l'ordre des lignes, l'attribution des voies, les marques (HEAD, branches, étiquettes), la géométrie, et un dessin SVG rendu de **deux** façons depuis **un seul** arbre abstrait — en DOM pour la page (`textContent`, donc un nom de branche `<script>` reste un nom), en texte pour les contrôles. **`js/git-bac.js`** (495 lignes) : le terminal, les trois zones, l'explication française, la persistance dans `localStorage`, et quatre commandes de coquille (`echo`, `cat`, `ls`, `rm`) parce qu'il faut bien fabriquer des fichiers à commiter. **`pages/git-bac-a-sable.html`** : la page, reliée depuis l'accueil, le pied de page de toutes les leçons, le cours `git`, et un encart posé dans les 24 leçons de ce cours.

  **⚠️ L'ORDRE DE `git log --graph` N'EST PAS CELUI QU'ON CROIT, et c'est le cœur du point.** `--graph` implique `--topo-order`, pas l'ordre de date que `Depot.journal` produit (D1). Or en ordre de date, git sort parfois un parent **avant** ses descendants — mesuré en D1 sur une fusion dont le second parent est la racine : dessiné, cela donnerait une flèche qui remonte. Il fallait donc écrire le tri topologique de git. Ma première hypothèse — une file de priorité par date — donnait `D` avant `C` là où git donne `C` avant `D` : **c'est une PILE** (`revision.c`, `sort_in_topological_order`, `queue.compare = NULL`), et surtout les pointes de départ y sont empilées **puis la pile est renversée**, avec ce commentaire dans le source de git : « the initial tips need to be shown in the order given from the revision traversal machinery ».

  **La preuve, en quatre étages.**

  1. **`tools/verif-git-graphe.js` — 23 scénarios, 2 651 comparaisons contre `git 2.54.0.windows.1`, 0 écart, 20,8 s.** Après **chaque** commande on compare l'ordre exact des lignes (`git log --all --topo-order`), les arêtes (`git rev-list --all --parents`), les marques (`%d`), plus cinq invariants que git ne peut pas donner : aucun parent au-dessus de son enfant, aucune arête verticale traversant un commit d'une autre lignée, aucune colonne fantôme, **aucune voie encore ouverte à la fin du dessin**, SVG bien formé. Branché comme **12ᵉ étape « gitgraf » de `tools/verif.js`** : `--rapide` vert en **140,3 s**.
  2. **`tools/verif-git-graphe-mutations.js` — 29 fautes injectées, 29 détectées.**
  3. **`tools/preuves/git-graphe.js` + `git-graphe-pilote.js` — Chrome, `file://`, DNS coupé, SANS `--allow-file-access-from-files` : la VRAIE page est pilotée au clavier** (20 commandes tapées dans le champ, formulaire soumis pour de bon), **18 valeurs comparées à Node, 0 écart, 0 requête distante**. Un identifiant mal orthographié, un script oublié, un écouteur jamais posé passeraient tous les contrôles Node ; pas celui-ci.
  4. **Deux sabotages, deux détections** (lien de l'encart privé de son `../`, encart posé dans tous les cours), code de sortie 1 les deux fois.

  **⚠️ CE QUE LA CONTRADICTION A DÉMOLI — deux agents, 6 979 cas exécutés, et une de mes affirmations réfutée.**

  - **« Les colonnes sont comparées à 100 % » ÉTAIT FAUX, et c'est la faute la plus instructive du point.** J'avais remplacé un seuil en pourcentage par deux critères que je déclarais stricts — la continuité des lignées et l'ordre gauche-droite de deux voisins — au motif qu'une colonne *insérée* translate les numéros sans jamais échanger deux voisins de place. C'est vrai de l'insertion. **Mais git SUPPRIME aussi des colonnes** : quand une lignée meurt, tout ce qui est à sa droite glisse d'un cran (les `|/` du dessin). Une **énumération exhaustive des graphes à six commits et une racine** met **225 cas sur 2 700 (8,3 %)** en défaut — même compte pour des dates égales, croissantes ou décroissantes : la divergence est structurelle, pas horaire. Les trois taux sont donc désormais **mesurés et affichés** (colonnes 600/602, voisins 372/372, lignées 408/408) et **non plus exigés comme propriétés générales** ; ce qui est exigé, ce sont l'ordre, les arêtes, les marques, les invariants de lisibilité, et une **non-régression** sur ces trois taux — assez mordante pour rattraper les trois mutations que les invariants seuls laissaient passer.
  - **Une colonne fantôme atteignable en CINQ commandes ordinaires** (fusionner, revenir, refusionner) : `attribuerVoies` comptait les colonnes **réservées** au lieu de celles qu'un commit **occupe**, si bien qu'une voie ouverte pour un second parent puis refermée par la convergence laissait une colonne vide à droite. Mon propre invariant l'aurait vue — aucun de mes 19 scénarios ne l'atteignait. **Quatre scénarios de plus** (aller-retour de fusion, croisement, `--no-ff` puis retour, deux fusions croisées) sont entrés dans le vérificateur.
  - **En thème sombre, tous les messages d'erreur du terminal étaient INVISIBLES** : `.bac-ligne--erreur` employait `var(--danger-bg)` — un jeton de **fond** comme couleur de **texte** — soit **1,15:1** de contraste. Un jeton `--danger-on-dark` a été ajouté (5,28:1 en clair, 6,73:1 en sombre, mesurés sur les deux valeurs de `--surface-inset`).
  - **Le titre du commit était ROGNÉ dès le premier commit**, et le manque croissait avec le nom de la branche : la largeur du SVG était estimée sur `m.nom` (« HEAD », 4 caractères) alors que le dessin pose « HEAD → main » (11). Il y avait **deux expressions de la même chose** ; il n'y en a plus qu'une (`texteMarque`), qui sert aussi à l'`aria-label` — lequel, du coup, ne nommait jamais la branche courante.
  - **`svg { max-width: 100% }` de `css/base.css` ÉCRASAIT le graphe** au lieu de le laisser défiler : au-delà de la largeur de la colonne, le SVG était mis à l'échelle et le texte devenait illisible. Trouvé par un détour : `getComputedTextLength` rendait 648 unités pour un texte de 572 px, parce que 12 px CSS valent davantage d'unités utilisateur dans un SVG réduit. Le pilote mesure désormais, dans le navigateur, qu'**aucun texte ne sort du cadre** — y compris sur un cas dur (branche `correctif/connexion-base-de-donnees-lente` + titre de 78 caractères), qui dépassait de **59 px** avant correction.
  - **Le focus se perdait après la première activation au clavier** (le SVG est reconstruit entièrement, le `<g>` focalisé détruit) : on pouvait activer un commit une fois, après quoi Espace faisait défiler la page. Le focus est reposé. Et le repère de focus était **invisible sur la voie 0** — celle de tous les commits d'un débutant — parce que `--focus` et la couleur de la voie 0 sont la même : contraste 1:1.
  - **La zone « Index » mentait deux fois.** Un fichier effacé du disque y apparaissait — alors que `git status --porcelain` met son « D » en seconde colonne et que `git ls-files --stage` le montre toujours indexé — et **en double, avec deux mentions contradictoires**, pendant que le terminal écrivait une ligne plus haut « l'index, lui, n'a pas bougé ». Et **pendant un conflit de fusion**, le fichier s'affichait en vert, comme prêt à commiter : c'est précisément la situation où l'apprenant a besoin qu'on ne lui mente pas.
  - **`echo "a" >> ` (sans cible) créait un fichier nommé `>`**, puis l'indexait et le commitait.
  - **Un `localStorage` valide mais incohérent** (une référence vers une empreinte absente, un magasin d'objets vidé) laissait la page à moitié morte et sans un mot : `charger()` ne jugeait que « l'import a-t-il levé ? ». Le dépôt relu est maintenant **exercé** (statut + graphe complet) avant d'être accepté, et un échec d'écriture du stockage **se dit** au lieu de laisser croire que la session est sauvegardée.
  - **Le clic sur un commit imprimait `$ git show --stat`**, une commande que le bac à sable refuse : une invite qu'on ne peut pas retaper enseigne une commande imaginaire.
  - **Une passe adversariale a montré que ma mesure elle-même pouvait mentir** : le contrôle de l'encart lisait le DOM **avant** que `js/lecon.js` ne l'ait garni, et rendait « 0 encart » — un faux négatif silencieux, une fois sur trois pages. Il attend désormais `readyState === "complete"` et un marqueur posé par le script de leçon.

  **Deux dettes de D2 mesurées au passage, écrites dans `js/git-commandes.js`.** ⚠️ **Un rebasage dont la branche contient une FUSION n'aplatit rien et l'annonce mal** : sur le scénario minimal reproduit des deux côtés, le vrai git rejoue les commits et supprime la fusion (« Successfully rebased »), le bac à sable répond « Current branch z2 is up to date. » et ne touche à rien — les 6 976 comparaisons de D2 ne l'avaient pas vue, faute de scénario. Et **`git tag` ne validait pas son nom** alors que `branch`, `checkout -b` et `switch -c` le font tous les trois : `git tag ~mauvais^nom` était accepté et sa pastille dessinée (git refuse, exit 128). Celle-là est **corrigée**, avec un scénario neuf : `verif-git-commandes` passe à **69 scénarios, 7 030 comparaisons, 0 écart**.

  **Deux limites du dessin, assumées et écrites en tête du fichier** : une référence pointant sur une étiquette **annotée** est ignorée (le modèle n'en fabrique pas, `git tag -a` est refusé — mais le jour où D2 les ajoutera, il faudra peler la référence, sinon un commit tenu par une seule étiquette annotée disparaîtra du graphe) ; et une fusion dont le second parent est un **ancêtre** du premier ferait descendre une arête à travers les commits intermédiaires — forme qu'aucune des quinze commandes ne peut produire (git répond « Already up to date. », le bac à sable aussi).

  **Contrôles.** `verif.js --rapide` **12 étapes, 140,3 s, tout vert**. `verif-html` **0 grave / 0 attention sur 1 612 fichiers**. `verif-donnees` **0 erreur / 1 avertissement** (le doublon `zig` de la phase E de V6, antérieur). `verif-rendu` : les 3 pages touchées (18 mesures) **et** l'échantillon de 20 pages (120 mesures) — **0 erreur, 0 avertissement** ; **1 débordement trouvé et corrigé** en cours de route (le bouton « Charger un exemple avec deux branches » sortait de **34 px** à 320 px). CSS neuf : **0 couleur en dur**, accolades équilibrées, 0 variable inexistante. 0 BOM, **0 URL de CDN**.

  **Mesure.** Lignes : `js/git-graphe.js` **646**, `js/git-bac.js` **495**, `tools/verif-git-graphe.js` **810**, la contre-épreuve **158**, la preuve navigateur **239 + 148**. Comparaisons contre le vrai git : **2 651** dans le dépôt, **264 373** de plus par la passe adversariale (dont une énumération **exhaustive** des graphes à 4, 5 et 6 commits). Fautes injectées détectées : **29/29**. Valeurs comparées entre Chrome et Node : **18**, 0 écart. Sabotages détectés : **2/2**. Cas exécutés par les deux agents de contradiction : **6 979**, dont 591 dans Chrome hors réseau. Poids ajouté au site : **47,6 Ko** (les deux scripts neufs), chargés par la seule page du bac à sable ; **0** pour les 1 523 leçons, qui n'y gagnent qu'un lien.
- [x] **D4 · Les scénarios guidés.** ✅ **2026-08-26. Neuf situations réelles, jugées sur L'ÉTAT du dépôt et jamais sur la commande tapée : 56 parcours rejoués contre `git 2.54.0.windows.1`, 3 027 comparaisons, 0 écart ; 30 fautes injectées, 30 vues ; la vraie page pilotée dans Chrome en `file://`, DNS coupé, 26 valeurs, 0 écart, 0 requête distante.**

  **`js/git-scenarios.js`** (952 lignes) : **9 situations**, **31 objectifs**, **27 indices** (donnés un par un), **11 variantes** de résolution déclarées valables, **24 pièges** et **12 triches**. **`js/git-coquille.js`** (128 lignes) : `echo`/`cat`/`ls`/`rm` extraits de l'interface, pour que la page et le contrôle montent la situation avec le MÊME code — une seconde implémentation dans l'outil aurait vérifié sa propre copie. La page porte le panneau de mission, la liste des cartes et l'ancre `#scenario-<id>` ; les **24 leçons du cours `git`** mènent aux situations qui les concernent (**12 liens**, table de `js/lecon.js` dont le contrôle exige qu'elle coïncide avec celle du module, titres compris).

  **⚠️ LA THÈSE DU POINT, ET CE QU'ELLE COÛTE : un objectif est un PRÉDICAT SUR L'ÉTAT, jamais une commande attendue.** Comparer la ligne tapée à une ligne modèle n'apprendrait qu'à recopier ; et ce serait faux, parce qu'il y a toujours plusieurs chemins. Le prix à payer est qu'un prédicat faible **félicite pour une bêtise** — et c'est exactement ce que la contradiction a trouvé.

  **Trois divergences réelles avec git, trouvées en écrivant le contrôle** (sur un `git-commandes.js` que 7 030 comparaisons déclaraient vert) :

  - **`git reset --hard` laissait sur le disque un fichier indexé absent de la cible** ; git l'efface. Mesuré sur trois cas (indexé neuf, indexé puis modifié, indexé puis effacé) : git le supprime les trois fois, et n'épargne que les fichiers JAMAIS indexés — ce qui distingue `reset --hard` de `git clean`.
  - **`git commit --amend` acceptait un amendement qui viderait le commit** ; git le refuse (« You asked to amend the most recent commit… ») — **sauf sur un commit RACINE, où il réussit**, l'arbre du « parent » n'existant pas. Mesuré des deux côtés, pas déduit.
  - **La ligne CONFLICT d'un `revert` nommait le commit lui-même au lieu de son PARENT** : git écrit « deleted in **parent of** 3628bc8 (cree f) », et « **(empty tree)** » quand le commit annulé est la racine. Le bac à sable désignait donc à l'apprenant un autre objet que celui dont git parle.

  **Et une quatrième, rendue par la contradiction, la plus grave : `git reset --hard HEAD <fichier>` était exécuté comme un `--hard` COMPLET** — le bac à sable détruisait ce que git REFUSE de toucher (« fatal: Cannot do hard reset with paths. », exit 128). La forme « avec chemins » n'était reconnue qu'en mode `--mixed`. Les quatre fautes ont leur scénario de non-régression : **`verif-git-commandes` passe à 73 scénarios, 7 429 comparaisons, 0 écart**.

  **⚠️ CE QUE LA CONTRADICTION A DÉMOLI — trois agents, ~11 650 comparaisons contre le vrai git, ~210 chargements de page dans Chrome.**

  - **HUIT FAÇONS DE TRICHER étaient déclarées « réussies »**, toutes montées dans un vrai dépôt git : committer un fichier ne contenant que `=======` et `>>>>>>>` (l'objectif ne cherchait que `<<<<<<<`) ; fabriquer **deux commits VIDES** portant les bons titres au lieu de rebaser (`contientTitre` compare des TITRES : `git merge-base --is-ancestor` répondait 1) ; **effacer** le fichier de configuration au lieu d'annuler le commit (`contenuCommite` rend `null`, et la négation était vraie) ; laisser **`DEBUG  = true`** avec deux espaces ; **committer le mot de passe** puis le sortir de l'index. Les prédicats portent désormais sur le **contenu EXACT** et sur l'**ANCESTRALITÉ**, et les huit tricheries sont enregistrées dans le fichier comme cas de non-régression.
  - **⚠️ Un contrôle qui n'observe que TROIS points — le départ, la solution, les pièges — ne voit pas qu'un prédicat a été AFFAIBLI.** Prouvé : une mutation remplaçant la condition d'ancestralité par un simple titre restait verte. C'est pour cela que les triches existent ; elles ne sont pas montrées à l'apprenant.
  - **Le texte enseignait un git faux, huit fois.** Le plus instructif : les indices affirmaient que « git status souffle la commande » — c'est vrai, mais git souffle **`git restore --staged`**, que ce bac à sable ne simule pas et à laquelle il répondait **« git: 'restore' is not a git command »**. Une contre-vérité, sur une commande que la page propose elle-même deux lignes plus haut, et que la leçon 07 enseigne. Les commandes réelles non simulées reçoivent désormais un message qui le dit. De même : « le fichier non suivi reste » après un `reset --hard` (il est effacé) ; « on lui ajoute une copie de son propre commit » (git s'arrête sur « The previous cherry-pick is now empty ») ; « les deux coexisteront jusqu'à la fusion » (ils coexistent **après**, pour toujours) ; « plus aucune commande ordinaire n'y mène » (`git reflog` y mène — et le scénario voisin le disait, dans le même fichier).
  - **Trois défauts d'interface majeurs, mesurés dans Chrome** : la ligne « **Objectif atteint** » était à **2,15:1** en thème clair — le jeton `--ok` est CLAIR, le fond du terminal reste sombre dans les deux thèmes ; **exactement le piège de D3 avec `--danger-bg`**, retendu sur la phrase la plus importante que la fonctionnalité produise (jeton `--ok-on-dark` ajouté : 7,25:1 et 9,23:1, désormais mesurés par la preuve). Arriver depuis une leçon ouvrait la situation **1 706 px sous l'écran** : l'ancre `#scenario-<id>` désignait aussi la carte, et le saut de fragment s'exécutait APRÈS notre défilement. Et **un F5 remontait la situation par-dessus le travail en cours**, sans un mot : le fragment est maintenant retiré dès qu'il a servi.
  - Cinq défauts modérés : « **1 commande de mise en place n'a pas abouti** » s'affichait en rouge sur la seule situation consacrée aux conflits — le `git merge` qui échoue EST la situation ; **`reinitialiser`** laissait le panneau d'une situation au-dessus d'un dépôt vide, où deux objectifs se cochaient tout seuls ; le **focus** retombait sur `<body>` à chaque bouton ; les **indices demandés** n'étaient pas enregistrés ; la **progression** n'était annoncée à aucun lecteur d'écran.
  - **Ce que la contradiction n'a PAS trouvé, et qui compte** : 0 faille d'injection sur 13 relevés (tout est construit en DOM), 27 valeurs de `localStorage` tordues sur 27 laissent la page vivante, 0 débordement horizontal sur 4 largeurs, 0 requête distante, 0 exception. Et **aucune divergence modèle/git sur les mises en place, les solutions et les variantes publiées** (132 parcours) : les 165 écarts relevés portaient tous sur des suites voisines fabriquées pour l'occasion — **sept sont écrites en tête de `js/git-commandes.js`** plutôt que corrigées à la hâte (dont `git checkout HEAD` qui détache HEAD à tort, et `git cherry-pick -n` dont le `--abort` détruit le travail indexé).

  **Une dette de D3 corrigée au passage** : la page du bac à sable **n'était pas dans l'index de recherche** du site — elle existait depuis le 2026-08-26 et n'était trouvable par personne.

  **Mesure.** Situations **9**, objectifs **31**, indices **27**, variantes **11**, pièges **24**, triches **12**, lignes de mise en place **84**, leçons reliées **8** (12 liens). Comparaisons contre le vrai git : **3 027** (56 parcours) pour les scénarios, **7 429** (73 scénarios) pour les commandes, **~11 650** de plus par la passe adversariale. Fautes injectées détectées : **30/30**. Valeurs comparées entre Chrome et Node : **26**, 0 écart. Sabotages détectés : **2/2**. `verif.js --rapide` : **13 étapes** (`gitscen` neuve), **177,5 s**, tout vert. `verif-html` **0/0 sur 1 612 fichiers** ; `verif-donnees` 0 erreur ; `verif-rendu` **0/0 sur les 3 pages touchées** (18 mesures). Poids ajouté au site : **60,0 Ko**, chargés par la seule page du bac à sable ; **0** pour les 1 523 leçons, qui n'y gagnent que des liens.

---

## PHASE E — « Plusieurs façons de le faire »

Le site donne une solution par exercice. Les bons cours montrent les **alternatives** et disent
pourquoi on choisit l'une plutôt que l'autre — c'est ce qui distingue un apprenant qui applique d'un
apprenant qui décide.

- [x] **E1 · Choisir les leçons.** ✅ **2026-08-26. 1 612 leçons lues, 12 909 blocs de code passés au crible de 18 motifs : 96 leçons candidates, dont 30 retenues.** Outil neuf et rejouable : `tools/mesure-alternatives.js` (`--detail`, `--cours=`, `--deja`).

  **⚠️ DEUX FOIS, LA PREMIÈRE MESURE ÉTAIT FAUSSE — et les deux fois elle rassurait.**

  1. Le filtre « cette leçon en parle déjà » capturait « plutôt que », « au lieu de », « variante », « alternative » : **2 496 occurrences dans 203 leçons**, dont l'immense majorité sont des conseils ordinaires (« choisis `prix` plutôt que `p` », « anime `transform` plutôt que des propriétés qui déclenchent un reflow »). Un échantillon de douze phrases, lu en entier, l'a montré. Resserré aux tournures qui annoncent une SECONDE FAÇON D'ÉCRIRE LA MÊME CHOSE, il ne reste que **4 leçons**. Le constat qui fonde la phase E se confirme donc par la mesure : **le site montre presque toujours une seule façon de faire.**
  2. Le classement par nombre d'occurrences remontait `crypto` et `offensive` en tête — des leçons longues, dont le code manipule des octets dans des boucles indexées, et où une compréhension de liste n'apprendrait rien à personne. **Le poids mesurait la LONGUEUR, pas le choix.** Une alternative ne compte désormais que dans un cours qui **enseigne** cette notion : 221 candidates → **96**.

  **Trois cours n'ont RIEN à corriger, et c'est une bonne nouvelle mesurée** : `go` (30 blocs en `for … range`, **0** boucle indexée), `php` (24 `foreach`, 0), `rust` (15 `iter()`, 0). `java` et `csharp` en ont respectivement **2** et **3**.

  **LES 30 LEÇONS RETENUES**, chacune avec le choix à montrer :

  | leçon | ce qu'elle montre | l'autre façon |
  |---|---|---|
  | `js/lecon-23` Les promesses avancées | `.then` chaîné (7 fois) | `async`/`await`, et `Promise.all` contre le séquentiel |
  | `js/lecon-46` Boucle d'événements et concurrence | `.then` (5) | `await`, et ce que chacun rend lisible |
  | `js/lecon-44` Itérateurs et générateurs avancés | tableau accumulé | générateur paresseux |
  | `js/lecon-57` La Streams API | accumulation en mémoire (5) | traitement par flux |
  | `js/lecon-21` Héritage et encapsulation | héritage de classe | composition |
  | `algo/lecon-02` La récursion en profondeur | récursion (5) | itératif avec pile explicite |
  | `algo/lecon-03` Rechercher : linéaire et binaire | binaire récursive | binaire itérative |
  | `algo/lecon-05` Le tri fusion | descendant récursif | ascendant itératif |
  | `algo/lecon-08` Piles et files | tableau | liste chaînée, et le coût de chaque opération |
  | `algo/lecon-18` Le backtracking | récursion | pile explicite |
  | `algo/lecon-25` Arbres auto-équilibrés (AVL) | rotations récursives | itératives ; et AVL contre rouge-noir |
  | `algo/lecon-12` Les graphes : représentation et parcours | listes d'adjacence | matrice, et quand elle gagne |
  | `algo/lecon-19` Deux pointeurs et fenêtre glissante | boucle indexée | deux pointeurs contre table de hachage |
  | `python/lecon-06` Les fonctions | boucle d'accumulation (3) | compréhension de liste |
  | `python/lecon-27` collections, itertools, functools | boucles | `itertools`, et ce qu'on y perd en lisibilité |
  | `python/lecon-29` Les décorateurs | décorateur | fonction d'ordre supérieur explicite |
  | `python/lecon-37` Programmation fonctionnelle | récursion (4) | `reduce` / `accumulate` |
  | `sql/lecon-09` Sous-requêtes, ensembles et CTE | sous-requête dans le SELECT (10) | jointure, `EXISTS`, CTE — et le plan d'exécution |
  | `bdd/lecon-10` Dénormaliser à bon escient | jointure | colonne dénormalisée, et son coût d'écriture |
  | `bdd/lecon-13` Transactions et isolation | verrou pessimiste | verrou optimiste |
  | `data-eng/lecon-08` Idempotence et reprise | suppression puis insertion | `MERGE` / upsert |
  | `css/lecon-08` Le flux, display et position | `position: absolute` | grid, qui garde le flux |
  | `css/lecon-38` Le positionnement par ancre | `absolute` (7) | ancrage CSS, et le repli à prévoir |
  | `css/lecon-45` Formes, découpe et tracé | `float` + `shape-outside` | grid |
  | `nodejs/lecon-05` Promesses et async/await | `.then` | `await`, séquentiel contre `Promise.all` |
  | `nodejs/lecon-07` Les streams et les buffers | tout charger en mémoire | flux, et le seuil où il devient nécessaire |
  | `patterns/lecon-04` Patterns structurels | composite récursif | parcours itératif |
  | `java/lecon-04` Méthodes et tableaux | boucle indexée | for-each, puis l'API Stream |
  | `csharp/lecon-04` Méthodes et tableaux | boucle indexée | `foreach`, puis LINQ |
  | `bash/lecon-12` Déboguer ses scripts Bash | boucle sur la sortie de `ls` | `find -exec` / `xargs -0`, et les noms à espaces |

  **Ce qui est écarté, et pourquoi** : les 66 autres candidates sont soit des projets de synthèse (le code y illustre l'assemblage, pas le choix), soit des leçons où l'approche montrée est la seule raisonnable au niveau visé. La liste reste **bornée à 30** — le plan demandait « quelques dizaines, pas 1 463 ».
- [x] **E2 · Le format.** ✅ **2026-08-27. Le format existe, il est contrôlé par un outil (15/15 fautes injectées vues) — et la contradiction a démoli DIX affirmations sur les deux seuls blocs écrits, dont trois bloquantes et une qui était MA PROPRE correction.**

  **Le format** — `<aside class="variante">` : un titre fixe, une phrase d'annonce, le code de la variante,
  puis **trois faits obligatoires dans cet ordre** (`Ce qu'elle coûte` / `Ce qu'elle apporte` / `Quand la
  préférer`). Documenté dans `DESIGN_SYSTEM.md`, stylé dans `css/components.css` (14 variables CSS, toutes
  vérifiées comme existantes), inclus dans le `break-inside: avoid` de l'impression.

  **L'outil** : `tools/verif-alternatives.js`, 8ᵉ étape de `verif.js`. Il exige les trois libellés dans
  l'ordre, 80 caractères minimum par réponse, un bloc de code avec `data-file`, aucun titre `<h…>` (il
  polluerait le sommaire), l'icône `aria-hidden` — et surtout **que chaque classe employée existe vraiment
  dans `css/components.css`**, parce qu'une classe mal orthographiée rend le bloc en texte nu sans qu'aucun
  autre contrôle bronche. Mode `--mutations` : **15 fautes injectées, 15 vues**. 1 612 leçons lues.

  **⚠️ CE QUE LA CONTRADICTION A RENDU : 10 fautes prouvées par exécution, sur 2 blocs déjà écrits et déjà
  relus.** Deux agents (lecture et mesure seules, aucune écriture) ont réexécuté le code publié.

  1. **[bloquante, `css/lecon-08`] LE CODE PUBLIÉ FAISAIT L'INVERSE DE CE QUE LE TEXTE PROMETTAIT.** Le bloc
     annonçait un badge « posé *par-dessus* le contenu ». Dans une grille, la superposition suit **l'ordre
     du DOM**, et le badge était écrit *avant* le contenu : il était donc peint **dessous**.
     `elementsFromPoint` au centre du badge rendait `DIV` puis `SPAN.badge` (vérifié par moi-même, et dans le
     vrai aperçu du site par l'agent). Invisible dans la démo **uniquement** parce que le contenu n'a pas de
     fond : dès qu'on lui en donne un, l'agent compte **0 pixel rouge sur 3 978** dans le rectangle du badge
     — contre 3 285/3 978 pour la version `absolute`. Sur une carte produit avec image : **0/1 794 en grid,
     1 417/1 794 en absolute**. Corrigé : le badge est passé **dernier enfant**, et le texte dit désormais
     que c'est l'ordre du HTML qui décide. Après correction, la pile est `SPAN.badge` en tête dans les trois
     cas testés, fond blanc compris.
  2. **[bloquante, `css/lecon-08`] Le « quand la préférer » recommandait la grille pour « un composant
     réutilisé un peu partout »** — c'est-à-dire la seule des deux façons qui casse dès que le contenu a une
     image. Réécrit avec les trois cas où `absolute` reste le bon choix.
  3. **[bloquante, `algo/lecon-02`] MA PROPRE CORRECTION ÉTAIT FAUSSE.** J'avais remplacé un seuil de
     débordement inventé (« 5 750 ») par trois valeurs mesurées, en attribuant l'écart à « ce qui est déjà
     empilé ». L'agent l'a réfuté : à état d'optimisation identique, **deux cadres d'appel déplacent le seuil
     de 7 niveaux**. Le vrai paramètre est **la chauffe JIT**, que je n'avais pas nommée. Revérifié par
     moi-même avec un protocole propre (**un seul appel mesuré par processus**, sinon la dichotomie chauffe
     elle-même la fonction et l'effet devient invisible — c'est ce qui m'avait trompé) : **7 062 à froid,
     10 437 après 200 000 appels**, chaque valeur reproduite deux fois. Chrome 151 : **8 500**.
  4. **[sérieuse, `algo/lecon-02`] Le remède proposé sur l'ordre de visite ne marchait pas.** « Empiler les
     sous-tableaux à l'envers » rend `[1, 7, 2, 3, 4, 5, 6]` — toujours pas l'ordre récursif. Il faut empiler
     **tous** les éléments à l'envers, feuilles comprises : c'est la seule des trois variantes exécutées qui
     redonne `[1, 2, 3, 4, 5, 6, 7]`.
  5. **[sérieuse, `css/lecon-08`] La morsure de « 4 px » ne vaut que sur une page nue.** Dans l'aperçu du
     site — celui que l'astuce publiée juste dessous invite à ouvrir — la feuille `PREVIEW_PRE` de
     `js/runner.js` impose `line-height: 1.5` et la morsure vaut **7,3 px**. Les deux chiffres sont
     désormais donnés avec leur contexte.
  6. **[sérieuse, `css/lecon-08`] Mes chiffres `x = 262 / 685 / 1205` ne se reproduisaient pas** dans
     l'aperçu, qui applique `margin: 14px` et `box-sizing: border-box` (la carte s'y arrête à **234**, pas
     262). Reformulé en écart relatif, qui lui tient partout.
  7. **[mineure ×4]** « Trois lignes de plus » → **cinq** (comptage exécuté sur les blocs publiés) ; « il se
     colle au bord » → il le **dépasse de 10 px** et crée un `scrollWidth` de 1 274 pour 1 264 ; « hors
     écran » → **56 % du badge reste visible** ; et « DOM d'une page inconnue » comme exemple de profondeur
     non bornée → **le lecteur HTML de Chrome plafonne à 511 niveaux** (mesuré : 400 `<div>` → 401 ;
     1 200 → 511 ; 5 000 → 511), soit 5 % du seuil de débordement. Remplacé par l'arbre syntaxique.

  **⚠️ LA LEÇON DE MÉTHODE, et elle vaut pour tout le chantier : UN PROTOCOLE DE MESURE PEUT MASQUER
  L'EFFET QU'IL MESURE.** Ma dichotomie appelait la fonction des dizaines de fois avant son premier point :
  elle chauffait ce qu'elle prétendait mesurer à froid, et rendait donc un seuil stable — donc rassurant,
  donc faux. Le seul protocole valide était **un processus neuf par point de mesure**. Deuxième piège du
  même genre : `PREVIEW_PRE` est une **concaténation JavaScript**, et l'extraire par une simple expression
  régulière laisse les `" + "` dans le CSS, ce qui invalide silencieusement toutes les règles suivantes —
  dont `*{box-sizing:border-box}`. Le garde-fou a été ajouté à l'outil de mesure (il refuse de tourner si
  `box-sizing` a disparu de la feuille extraite).

  **Ce qui a TENU** à la contradiction et n'a pas été touché : les sorties `10` et `20001` du code publié,
  l'ordre `[1, 7, 4, 5, 6, 2, 3]` de la pile, la taille maximale de pile (**1** sur une donnée profonde de
  20 000, **10 000** sur une donnée large de 10 000), les 100 000 niveaux encaissés par l'itérative,
  `JSON.parse` qui avale **2 000 000** de niveaux, les **17 px** aux bords en grid et les **9 px** de
  dépassement en absolute (identiques dans les deux contextes), et le remède par marge à droite.

  **Contrôles finaux** : `verif-html` 0/0 sur 1 612 fichiers · `verif-donnees` 0 erreur sur 25 invariants ·
  `verif-rendu` 12 mesures (2 pages × 3 largeurs × 2 thèmes), 0 erreur · `verif-clic` **13 blocs cliqués,
  0 divergent** sur `algo/lecon-02` (les 13 blocs JS ont bien leur bouton, celui de la variante compris, et
  il rend `10` puis `20001` en 4 ms — très loin des 3 s du runner) · une passe large de `verif-clic` sur
  **72 pages, 463 blocs, 0 divergent** · `verif-sorties` 324/325 (l'unique divergence, `offensive/lecon-07`,
  est un dépassement de délai à 10 s, préexistant et hors périmètre) · 0 URL de CDN · `search-index`
  régénéré (43 789 mots).
- [x] **E3a · Le lot `algo` (4 blocs sur les 7).** ✅ **2026-08-27. Quatre blocs écrits, exécutés, puis DÉMOLIS par contradiction : 34 fautes annoncées, 20 confirmées par un second agent, et la moitié des faits publiés a dû être RÉÉCRITE — dont trois affirmations que mes propres mesures soutenaient.**

  **Les quatre blocs** : `algo/lecon-05` (tri fusion bottom-up), `algo/lecon-08` (file en liste
  chaînée), `algo/lecon-18` (backtracking à pile explicite), `algo/lecon-25` (insertion AVL itérative).
  Chaque bloc est **autonome et exécutable** : `verif-clic` ouvre les 4 pages dans Chrome et clique
  **32 blocs sur 32** (0 privé de bouton par `BROWSER_ONLY`, 0 divergent, 0 fragment en erreur).

  **⚠️ LA CONTRADICTION (4 agents démolisseurs + 24 contre-experts, lecture et exécution seules)** a rendu
  **34 fautes ; 24 ont été soumises à un second agent, 20 confirmées, 4 réfutées** ; les 10 restantes
  (celles de `lecon-25`) ont été vérifiées par moi-même, mesure par mesure. Ce qu'elles ont coûté :
  **9 corrections sur `lecon-05`, et les TROIS faits réécrits en entier sur chacune des trois autres.**

  1. **[bloquante, `lecon-08`] MA MESURE MESURAIT L'HORLOGE, PAS LA FILE.** J'avais publié « 36 à 41 ms
     contre 38 à 39 » comme preuve que les deux files ont le même débit. Or poser `hrtime` autour de
     **chaque** défilement coûte plus cher que le défilement : mesuré, deux lectures d'horloge par tour
     font **80,5 ms** au million. Sans chronomètre par opération, le vrai total est **4,8 à 5,7 ms pour
     le tableau contre 2,4 à 2,5 ms pour la chaînée** : non seulement le chiffre était faux d'un facteur
     sept, mais **il inversait la conclusion** — la chaînée est deux fois plus rapide au défilement.
  2. **[bloquante, `lecon-18`] LE REMÈDE DÉDUIT, PAS TESTÉ — le piège n°3 du cadrage, exactement.**
     J'annonçais « remplacer `pop()` par `shift()`, une ligne, et le parcours passe en largeur :
     `[[],[1],[2],[3],…]` ». Exécuté : **une ligne rend `[[],[3],[2],[1],[2,3],[1,3],[1,2],[1,2,3]]`**.
     Le parcours devient bien en largeur, mais l'ordre à l'intérieur de chaque taille est renversé ; la
     liste que j'avais publiée demande **deux** changements. J'avais mesuré la bonne liste sur une
     fonction que j'avais écrite à côté, pas sur la modification que le texte décrit.
  3. **[bloquante, `lecon-25`] « AUCUN GAIN DE TEMPS » ÉTAIT VRAI POUR LA SEULE DISTRIBUTION QUE
     J'AVAIS MESURÉE.** Sur des clés tirées au hasard, les deux versions sont à égalité (54-58 ms contre
     53) parce que la **descente**, commune aux deux, coûte à elle seule 33,9 ms. Sur des clés **déjà
     triées** — le cas que la leçon passe cinq paragraphes à décrire — la descente tombe à 8,5 ms et
     l'itérative passe devant : **19 ms contre 31, soit 1,6×**. Une mesure sur une seule forme d'entrée
     avait produit une prescription inverse de la mesure.
  4. **[bloquante, `lecon-08`] « Retirer au milieu, c'est `O(1)` en liste chaînée »** — faux avec un
     chaînage **simple** : sans le prédécesseur, on ne décroche rien, et le retrouver coûte **499 999
     sauts** pour le nœud du milieu d'une file d'un million. Même faute sur le deque : le tableau
     retire par la queue d'un `pop()`, la chaînée simple doit reparcourir toute la liste.
  5. **[sérieuse, `lecon-05`] « Elle n'alloue plus rien »** : elle alloue **2n cases** (une copie de
     l'entrée plus un tampon), donc l'espace auxiliaire reste le `O(n)` que la section juste au-dessus
     reproche au tri fusion. Ce qui disparaît, c'est le **nombre** d'allocations (2 contre 599 997), pas
     l'ordre de grandeur. Le commentaire du **code publié** disait la même chose en pire (« le SEUL
     tableau supplémentaire », trois lignes sous `arr.slice()`).
  6. **[sérieuse, `lecon-18`] MON EXPLICATION DU COÛT ÉTAIT FAUSSE, et une variante l'a prouvé.**
     J'attribuais les 2,3× à l'objet enveloppe `{debut, chemin}`. Réécrite avec deux piles parallèles
     et **plus aucun objet**, la variante met **164 à 178 ms** — un peu *plus*. Le vrai coût est la
     **copie du chemin à chaque poussée** : une troisième variante à marqueurs de retour, qui mute un
     seul chemin, rend la même liste en **77-78 ms**, à égalité avec la récursion.
  7. **[sérieuse, `lecon-05`] Le tri externe ne disqualifie pas la récursion.** Un agent a écrit et
     exécuté un tri fusion externe *récursif* sur un fichier **220 fois plus gros que son budget
     mémoire** : trié, avec le **même nombre d'entrées-sorties** que la bottom-up (11 534 336
     enregistrements, rapport 1,000). L'avantage réel est ailleurs : la bottom-up n'a besoin que d'un
     compteur là où la récursive a besoin d'une pile de sous-problèmes.
  8. **[mineures, 8 au total]** « c'est eux » → « ce sont eux » ; « aller-retours » → « allers-retours »
     (2 occurrences fautives dans tout `pages/`, contre 355 correctes) ; « elle tient en trois lignes »
     → **sept** (comptées sur le bloc publié) ; « une bonne vingtaine de lignes de plus » → **douze**
     (19 contre 31) ; `log₂(n)` → `⌈log₂ n⌉ + 1` pour 19 niveaux ; « 24 sur 50 » → **21 à 31 selon le
     tirage** (seul « 50 sur 50 perdent des clés » ne dépend pas du hasard) ; « 15,46 nœuds retouchés »
     → **revisités** (les nœuds distincts écrits sont 15,68 contre 3,40, soit 4,6× et non 5,6) ;
     « une ligne qu'on oublie une fois sur deux » → taux jamais mesuré, retiré.

  **⚠️ DEUX MESURES QUE LA CONTRADICTION A CRUES FAUSSES ET QUI ÉTAIENT JUSTES — parce que les agents
  mesuraient pendant que vingt autres agents tournaient.** Un contre-expert donnait 182-194 ms là où je
  publiais 162-164 pour le tri fusion récursif. Machine au repos, je reproduis **162 à 165 ms** (trois
  séries). L'explication est mesurée : relancée pendant que **dix processus** travaillent, la version
  récursive passe à **347 ms** quand la bottom-up ne monte qu'à **110** — celle qui alloue est celle qui
  souffre quand la mémoire est disputée, et l'écart passe de 1,9× à **3,2×**. Leçon inscrite dans la
  page : **un chrono sans son contexte ne veut rien dire** ; les deux chiffres y figurent désormais.

  **⚠️ LA QUATRIÈME FAUSSE MESURE DE LA PHASE E, trouvée avant la contradiction et par hasard.** Un
  résultat aberrant (0,39 remontée par insertion, alors que le minimum possible est 1) a fait ouvrir mon
  générateur pseudo-aléatoire : le LCG `x*1103515245+12345` dépasse 2^53 en JavaScript, perd sa précision
  et **ne rend que 14 041 valeurs distinctes sur 100 000** (99 489 avec un xorshift correct). Toutes les
  mesures de la case ont été rejouées. C'est la troisième fois de ce chantier qu'une mesure fausse
  *rassure* : ici, elle faisait paraître l'itératif 32× meilleur qu'il n'est.

  **Ce que les blocs disent, une fois corrigés** (tout est mesuré, protocole cité) : bottom-up
  → 2 tableaux contre 599 997, 162-165 ms contre 85-87, 1 140 tableaux faux sur 1 280 si l'on oublie un
  `Math.min` ; file chaînée → 38,2 Mo contre 10,0 (3,8×), défilement 2× plus rapide, cycle complet
  à égalité (12,2 contre 13,1 ms) mais pire cas 3× pire (17,8 contre 51,0 ms, c'est le ramasse-miettes) ;
  backtracking à pile → interruptible et reprenable, mais 2× plus lent tant qu'on copie le chemin ;
  AVL itératif → 4,6× moins de nœuds écrits, 1,6× plus rapide sur clés triées, à égalité sinon.

  **Contrôles finaux** : `verif-alternatives` **6 blocs, 0 faute de format** · `verif-html` **0/0 sur
  1 612 fichiers** · `verif-donnees` **0 erreur sur 25 invariants** · `verif-exemples` **19 conformes,
  0 divergent** · `verif-clic` **32 blocs cliqués, 0 divergent** · `verif-rendu` **24 mesures (4 pages
  × 3 largeurs × 2 thèmes), 0 erreur, 0 avertissement, réseau coupé** · 0 URL de CDN · `search-index`
  régénéré (43 815 mots).

- [x] **E3b · Les 3 blocs restants.** ✅ **2026-09-02. Les trois blocs existaient déjà, écrits par une passe coupée avant son contrôle : les REJOUER a rendu 7 chiffres qui ne se reproduisaient pas, et la contradiction 17 fautes de plus — dont une qui a fait RÉÉCRIRE LE CODE PUBLIÉ, parce qu'il payait quatre fois et demie le prix de ce qu'il protégeait.**

  **Ce que le rejeu seul a trouvé, avant tout agent** (les 3 blocs étaient déjà en place, `verif-alternatives` vert, `verif-html` 0/0 — donc invisibles à tous les outils) :

  | affirmation publiée | mesuré le 2026-09-02 |
  |---|---|
  | `Map` de 2 M d'entiers = **56,1 Mo** | **40,8 Mio** (`--expose-gc`, deux fois le même chiffre) |
  | trier+converger **517 ms** contre table **131 ms**, « quatre fois moins » | **556-583** contre **157-184 ms**, trois à quatre fois |
  | trié : 3 ms contre **136 ms**, « **45 fois** » | 3 ms contre **161-199 ms** |
  | Composite : `poids()` **29-31 ms**, parcours **240-275 ms**, « **huit fois** » | **10-12** contre **187-605 ms** |
  | arbre de **488 280** dossiers / **1 953 124** fichiers, **8 niveaux** | **488 281** / **1 953 125**, **9 niveaux** |
  | 5 000 arbres, **50 697** fichiers | **55 486** (le nombre dépend d'un générateur non publié) |
  | plan de la jointure : `SCAN` puis `SEARCH … AUTOMATIC COVERING INDEX` | il y a AUSSI un **`BLOOM FILTER ON commandes`** entre les deux |

  Ont tenu au rejeu : les trois sorties du code JS (`[4,5]` / `[2,3]` / `null` / `[4,4]`, et `15 15` / `RangeError` / `15`), le seuil de récursion **2 600 passe, 2 700 échoue** (un seul appel par processus), le million de niveaux de l'itératif, les **trois cadres par niveau** (lus dans la trace : `Dossier.poids`, `Array.reduce`, la fonction fléchée), les **14 contre 7** du partage, les 6 lignes identiques en SQL, le `COUNT(*)` qui met **1** au client sans commande et le `JOIN` interne qui rend **5 lignes au lieu de 6**.

  **Contradiction : 6 agents (3 démolisseurs, 3 juges chargés de RÉFUTER les démolisseurs), 25 fautes annoncées, 17 confirmées, 7 réfutées, 1 indécidable.** Le juge a servi : il a réfuté 7 accusations, dont une qui aurait fait publier une règle FAUSSE (« la corrélée garde l'ordre de la table » — mesuré : la même corrélée rend deux ordres différents selon que la table a un `rowid` ou non).

  **⚠️ LA FAUTE QUI A FAIT RÉÉCRIRE DU CODE PUBLIÉ (`patterns/lecon-04`).** Le bloc affirmait « ce n'est pas la pile qui coûte, c'est la protection contre les cycles ». C'est une **attribution de cause fausse**, et le code publié en était la preuve : il rangeait **tous** les nœuds dans le `Set`, feuilles comprises. Or **un cycle passe nécessairement par un nœud qui a des enfants**. Mesuré par moi-même, trois séries, un processus par variante : ensemble sur tous les nœuds **301-322 ms et 80,0 Mio** (2 441 406 entrées) ; ensemble restreint aux dossiers **66-67 ms et 10,0 Mio** (488 281 entrées) ; aucune protection **32-39 ms** ; récursif **10-12 ms**. Le code du bloc a donc été refait (deux lignes déplacées), équivalence prouvée : cycle → 15 des deux côtés, 1 000 000 de niveaux → OK, **5 000 arbres tirés au hasard, 0 écart entre les trois variantes**. Bénéfice second : la phrase « un **dossier** rangé à deux endroits est compté deux fois par le récursif et une seule ici » devient exacte, alors que l'ancien code dédoublonnait aussi les **fichiers** partagés.

  **⚠️ LES DEUX FAUTES BLOQUANTES DE `algo/lecon-19` : UN POURCENTAGE QUI MESURAIT LE GÉNÉRATEUR, PAS LES ALGORITHMES.** Le bloc disait « les deux méthodes rendent des indices identiques dans 18 203 cas sur 20 000 (91 %) ». Énumération **exhaustive** refaite par moi-même (tous les tableaux triés de 2 à 6 valeurs prises dans 0…6 × toutes les cibles 0…12 = **22 204 cas**) : quand **plusieurs** paires conviennent (**5 303 cas**), l'accord vaut **0** — jamais, la convergente rendant la paire la plus extérieure et la table celle qui se referme le plus tôt ; quand il y en a au plus une (16 901 cas), l'accord est **total**. Et le décompte le prouve sur les tirages mêmes du bloc : **18 203 = 15 049 (aucune paire) + 3 154 (une seule)**, les 1 797 désaccords étant exactement les tirages à plusieurs paires. Le « 91 % » ne disait donc rien des algorithmes : il disait que 75 % des tirages n'avaient rien à trouver. Corollaire corrigé : « un test qui compare la sortie exacte échouera une fois sur onze » → **il échoue à tous les coups** dès qu'il existe plusieurs paires ; le remède, absent, a été ajouté (comparer l'invariant `tab[i] + tab[j] === cible`, pas les indices).

  **⚠️ ET UN CHIFFRE JUSTE OBTENU PAR UN PROTOCOLE QUI ANNULAIT LA MOITIÉ DU TRAVAIL.** Les « 3 ms » des deux pointeurs venaient d'une cible **hors de l'intervalle des sommes** : un seul des deux pointeurs bouge alors. À **nombre de tours rigoureusement identique (1 999 999)**, cible au milieu : **10,1 ms** (deux séries, 3,5 ms pour une cible haute, 3,7 pour une cible basse). Le rapport annoncé (« 45 fois », puis « une cinquantaine ») tombe à **une vingtaine** — 175-189 ms pour la table.

  **`sql/lecon-09` : un article défini qui promettait une exhaustivité fausse.** « LES DEUX FAUTES QUI GUETTENT CETTE RÉÉCRITURE » — j'en ai mesuré **trois de plus**, toutes silencieuses sur la base du site : filtre dans le `WHERE` au lieu du `ON` → **3 lignes au lieu de 6** (le `WHERE` s'applique après la jointure et annule le `LEFT`) ; `GROUP BY` **oublié** → **une seule ligne**, « Camille Roy | 7 », sans erreur ; `GROUP BY clients.nom` au lieu de `clients.id` → deux homonymes **fusionnés** (6 lignes au lieu de 7). La troisième faute est désormais dans le bloc de code. Autre correction : le bloc énonçait « toute colonne du `SELECT` doit se retrouver dans le `GROUP BY` » — **SQLite ne l'applique pas** et pioche une valeur *arbitraire* du groupe (mesuré : `commandes.montant` rend 24 pour un client qui en a trois, 59,90 / 120 / 24). C'est une règle de portabilité, elle est publiée comme telle.

  **Contrôles** : `verif-alternatives` **9 blocs, 0 faute de format** · `verif-html` **0/0 sur 1 612 fichiers** · `verif-donnees` **0 erreur sur 25 invariants** · `verif-sql` sur la leçon **19 blocs, 19 aboutissent (100 %)** · `verif-clic` **11 blocs cliqués, 0 divergent** · les **19 blocs `language-javascript`** des deux leçons JS reçoivent bien leurs **19 boutons** (règle `BROWSER_ONLY` extraite de `runner.js`, aucun faux positif) · `verif-rendu` **18 mesures** (3 pages × 3 largeurs × 2 thèmes) · `search-index` régénéré (43 830 mots) · 0 URL de CDN, 0 BOM.

  🔵 **Relevé hors périmètre, prouvé préexistant** : `pages/algo/lecon-19.html` déborde de **7 px à 320 px** (`label.exo-try__label`, les deux thèmes). Vérifié en remettant la version d'avant le bloc : le débordement y est déjà. La cause est un libellé d'exercice insécable (`longueurSansRepetition("abcabcbb")`) ; le remède est une règle CSS globale sur `.exo-try__label`, donc une passe `verif-rendu --tout` — un chantier à part, pas une case E3.

  **Le diagnostic de départ, conservé pour mémoire** : `algo/lecon-19` (la table de hachage face aux deux pointeurs),
  `sql/lecon-09` (la réécriture en `JOIN` d'une sous-requête scalaire) et `patterns/lecon-04` (un
  parcours itératif là où le pattern est récursif).
  ⚠️ **À REVÉRIFIER AVANT D'ÉCRIRE** : le diagnostic de E1 disait « `EXPLAIN` n'apparaît pas une seule
  fois » dans `sql/lecon-09` — or `grep -ic EXPLAIN` en compte **3** au 2026-08-27. De même,
  `patterns/lecon-04` compte **8** occurrences de « itérat|pile » que E1 déclarait être des faux amis
  (Decorator) : à relire avant de conclure. Le lot `algo` a montré le coût réel d'un bloc : **compter
  une passe de contradiction par lot, et prévoir que la moitié des faits sera réécrite.**

  **⚠️ CE QUE E2 IMPOSE À E3, chiffré : 2 blocs écrits ont rendu 10 fautes, dont 3 bloquantes — soit
  5 fautes par bloc.** Ce n'est pas de la négligence : ces blocs *affirment* des coûts et des
  comportements, et une affirmation non exécutée est fausse une fois sur deux. À ce taux, écrire les
  28 blocs restants sans passe de contradiction produirait une centaine de fautes publiées.
  **Donc : pas plus de 3 à 4 blocs par case, et une contradiction par lot, sinon la case ne vaut rien.**
  Les trois pièges à vérifier d'office sur chaque bloc neuf, parce qu'ils ont tous les trois été
  rencontrés sur deux blocs seulement :
  1. **le code publié fait-il vraiment ce que le texte dit ?** (le badge était peint *sous* le contenu
     alors que le texte promettait l'inverse) — l'exécuter ne suffit pas, il faut *observer la propriété
     annoncée* ;
  2. **chaque chiffre se reproduit-il, et sous quel protocole ?** (un seuil de pile dépend de la chauffe
     JIT, une géométrie dépend de `box-sizing`, une largeur dépend du libellé choisi) — citer le
     contexte, ou ne pas citer le chiffre ;
  3. **le remède proposé marche-t-il ?** (« empiler les sous-tableaux à l'envers » ne rétablissait pas
     l'ordre) — appliquer le correctif et remesurer, jamais le déduire.

  **⚠️ LA LISTE DE E1 EST RAMENÉE DE 30 À 7 LEÇONS — mesuré le 2026-08-27, avant d'écrire quoi que ce
  soit.** Première leçon abordée, `js/lecon-23` : elle montrait **déjà** `.then` *et* sa version
  `async/await`, et le séquentiel *et* `Promise.all` (~900 ms contre ~300 ms). Le bloc y aurait été un
  doublon. Vérification systématique lancée aussitôt.

  **La cause, et c'est la TROISIÈME fausse mesure de la phase E — toutes les trois rassuraient.** Pour
  écarter les leçons qui montrent déjà leur alternative, E1 s'appuyait sur le motif `DEJA_DIT` de
  `mesure-alternatives.js`, qui cherche des **tournures d'annonce** (« une autre façon de », « on aurait
  pu écrire », « version équivalente »). Une leçon qui met les deux façons côte à côte en disant
  simplement « en version async/await » ou « compare ces deux fonctions » n'en déclenche aucune. **Le
  filtre mesurait la présence d'une PHRASE, pas la présence de l'ALTERNATIVE** — d'où son verdict
  rassurant de « 4 leçons seulement en parlent déjà ».

  **Outil neuf : `tools/verif-liste-alternatives.js`** — pour chacune des 30 leçons, il cherche le motif
  du **code** de l'alternative prescrite, **dans les blocs de code uniquement** (une alternative citée en
  prose n'est pas une alternative montrée). Verdict : **17 sur 30 déjà pourvues**. L'outil dit lui-même
  que c'est un indice et non un verdict, et il avait raison de le dire : sur `java/lecon-04` il criait au
  loup sur le seul `for-each`, alors que `.stream()` y apparaît **0 fois**.

  **Contre-mesure par LECTURE** (5 agents, lecture seule, 28 leçons, justification exigée avec numéros de
  ligne) : **18 DÉJÀ MONTRÉES · 5 mentionnées sans code · 5 absentes — et 7 seulement valent encore un
  bloc.** Trois écarts que l'outil mécanique ne pouvait pas voir, tous vérifiés par moi-même :
  - **`css/lecon-45` : la prescription de E1 était FAUSSE.** `float` n'y est pas un choix de mise en page,
    c'est le **prérequis technique** de `shape-outside` (« n'a d'effet que sur un élément flotté »).
    Vérifié : **0 occurrence de « grid », 21 de « shape-outside »**. Aucune grille ne fait couler du texte
    autour d'un cercle — le bloc prescrit aurait **enseigné une chose fausse**.
  - **`bash/lecon-12` : faux positif de prémisse.** La leçon s'intitule « Déboguer ses scripts Bash », pas
    « parcourir des fichiers » ; la boucle sur `ls` n'y est pas enseignée, elle apparaît **dans la sortie
    de ShellCheck qui la dénonce** (`SC2045`). Vérifié : **0 occurrence de `xargs`/`print0`/`find`** dans
    cette leçon, **19 dans `bash/lecon-10`**, qui l'enseigne déjà avec l'argument des noms à espaces.
  - **`java/lecon-04` et `csharp/lecon-04`** : le `for-each` est montré **dans le même bloc, juste sous**
    la boucle indexée, avec le critère de choix en commentaire (« plus lisible si l'index est inutile ») —
    vérifié lignes 248-258. `Stream`/LINQ sont absents, mais enseignés plus loin dans le même cours, et
    prématurés ici (ni lambdas ni génériques encore vus).

  **LES 7 LEÇONS QUI RESTENT** (et deux sont déjà faites en E2, donc **7 à écrire**) :

  | leçon | état | ce qu'il manque |
  |---|---|---|
  | `algo/lecon-05` Le tri fusion | mentionnée sans code | le bottom-up est décrit en prose (l. 280) et au glossaire, **jamais en code** ; les 5 blocs sont tous récursifs |
  | `algo/lecon-08` Piles et files | mentionnée sans code | la leçon annonce elle-même qu'elle ne la montre pas (« Voyons la version tableau + index de tête ») ; la liste chaînée **ne figure dans aucune ligne** du tableau de coûts |
  | `algo/lecon-18` Le backtracking | absente | **0 occurrence du mot « pile »** dans les 6 blocs, tous récursifs (vérifié) |
  | `algo/lecon-25` Arbres AVL | mentionnée sans code | rouge-noir est comparé en profondeur mais **sans une ligne de code** ; `inserer` n'a pas de pendant itératif |
  | `algo/lecon-19` Deux pointeurs | mentionnée sans code | ⚠️ le diagnostic de E1 était faux (la leçon enseigne déjà les deux pointeurs) ; ce qui manque est la **table de hachage**, citée une seule fois en prose |
  | `sql/lecon-09` Sous-requêtes et CTE | mentionnée sans code | `EXISTS` et les CTE y sont déjà ; ce qui manque est la **réécriture en `JOIN`** de la sous-requête scalaire, affirmée en prose seule — et **`EXPLAIN` n'apparaît pas une seule fois** |
  | `patterns/lecon-04` Patterns structurels | absente | aucun parcours itératif ; les occurrences d'« empiler » concernent le Decorator (faux amis) |

  **Ce que ça change pour E3** : 7 blocs, soit **deux lots de 3 à 4**. Et la leçon vaut au-delà de cette
  phase — **une liste produite par un filtre de vocabulaire doit être vérifiée par lecture avant d'être
  exécutée**, sans quoi on écrit consciencieusement 23 doublons, dont un qui aurait enseigné une erreur.

---

## PHASE F — Contrôle final

- [x] **F1 · Mesure globale.** ✅ **2026-09-02. La part auto-corrigée a été multipliée par 1,6 — et non par 3, parce que le chiffre de départ inscrit en tête de plan était faux d'un facteur deux.**

  `node tools/mesure-executable.js`, 1 612 leçons lues, 12 919 blocs de code, 92 dossiers de cours :

  | | annoncé en tête de plan | **vrai départ** (mesuré en A1) | **aujourd'hui** |
  |---|---:|---:|---:|
  | exercices corrigés en **exécutant** | 105 | **211** | **354** |
  | exercices comparés à un mot-clé | 4 136 | 4 211 | 4 254 |
  | part réellement auto-corrigée | 2,5 % | **4,77 %** | **7,68 %** (354 / 4 608) |
  | cours ayant au moins un exercice exécuté | 3 | **9** | **29** sur 92 |
  | blocs exécutables en `file://` | — | **19,3 %** | **28,0 %** (3 621 / 12 919) |
  | langages réellement exécutables | 1 | 3 | **4** (JS, HTML, SQL, Python) |

  **Le vrai résultat du chantier n'est pas le pourcentage, c'est la RÉPARTITION** : de 9 cours à **29**. Les trois cours qui monopolisaient l'exécution (`js`, `algo`, `projets-js`) pèsent aujourd'hui 119 exercices sur 354, soit un tiers au lieu de la totalité. Les 20 cours au plus fort potentiel restant (`git` 67 exercices, `ruby` 75, `csharp` 76, `cpp` 79, `java` 76…) n'ont toujours **aucun** exercice exécuté : ce sont des langages qu'aucun moteur ne peut faire tourner en `file://`, et la phase B7 les a traités par la **prédiction de sortie**, qui n'entre pas dans ce compteur.

  ⚠️ **Trois cases du plan restent à zéro exercice** : `js-avance` (23 leçons), `html-avance` (22), `css-avance` (22), `python-avance` (22) — **89 leçons sur 1 612 n'ont aucun `data-exos`**, constat déjà relevé en A2 et jamais traité.
- [x] **F2 · Preuve hors réseau.** ✅ **2026-09-02 (seconde passe du jour). LES DEUX MOTEURS REDÉMARRENT — et la panne a été réparée sans toucher une seule leçon, en changeant la ROUTE par laquelle le code arrive au Worker.**

  **1. La panne a d'abord été REPRODUITE, pas reprise sur parole.** `node tools/preuves/sql-lecon.js` avant toute modification : **41 blocs cliqués, 0 résultat, 41 échecs**, tous portant le même message — « Failed to execute 'importScripts' on 'WorkerGlobalScope' ». C'est bien la mesure inscrite plus haut, et elle se reproduit.

  **2. Le remède, et il tient en une phrase : le Worker ne charge plus rien.** Ce que Chrome 152 refuse, c'est `importScripts()` sur une URL `file://` depuis un Worker issu d'un `Blob`. Ce qu'il permet encore — mesuré — c'est qu'une **page** `file://` charge un `<script src>` local et qu'une **chaîne** passe intacte par `postMessage`. Les DONNÉES des deux moteurs étaient déjà des chaînes (les base64) ; il ne manquait qu'à faire voyager le CODE de la même façon. D'où `tools/build-sources-worker.js`, qui recopie `sql-wasm.js`, `pyodide.asm.js`, `pyodide.js` et `pyodide-charge.js` en chaînes ASCII (`self.SQLJS_SRC`, `self.PYODIDE_ASM_SRC`…). Le Worker les **évalue en portée globale** — `(0, eval)(…)`, l'eval INDIRECT, sans quoi les `var` du module Emscripten resteraient enfermées dans la fonction au lieu de devenir des globales, exactement ce que faisait `importScripts`.

  **3. Ce qui a changé, et rien d'autre** : `js/runner.js` (boutons « ▶ Exécuter » des 1 075 blocs SQL et Python), `js/lecon.js` (les exercices auto-corrigés `type:"sql"` et `type:"python"`), et les trois pages de preuve. ⚠️ **Le chiffre de « 46 exercices » inscrit plus haut ne se reproduit pas** : recomptés dans les blocs `data-exos` du site, il y en a **38 — 13 SQL et 25 Python, un par leçon**. C'est le nombre que la preuve ci-dessous couvre, donc **100 %** d'entre eux et non 83 %. **Aucune leçon modifiée.** Les deux fichiers dupliquent la fonction de chargement à dessein — **89 leçons chargent `lecon.js` sans `runner.js`** — mais **partagent le CACHE** (`window.__syntaxeMoteurs`). ⚠️ **Cette dernière décision corrige une course que la première version introduisait** : avec deux caches séparés, un apprenant qui clique sur « ▶ Exécuter » puis sur « Vérifier » faisait recharger le script par le second fichier pendant que le premier vidait la globale — d'où un « fichiers incomplets » parfaitement faux. Les globales ne sont donc plus vidées après envoi : la mémoire est le prix de la fiabilité, et le Worker garde sa copie de toute façon. ⚠️ Vérifié plutôt que supposé : **aucune des 89 leçons sans `runner.js` ne porte aujourd'hui d'exercice SQL ou Python** — la duplication de la fonction est une précaution pour la suite, pas la réponse à un cas existant.

  **4. Mesures, toutes en `file://`, DNS coupé (`MAP * ~NOTFOUND`), SANS `--allow-file-access-from-files` — les conditions de quelqu'un qui double-clique sur une page.**

  | preuve | 2026-08-26 | 2026-09-02 **avant** | 2026-09-02 **après** |
  |---|---:|---:|---:|
  | `sql-lecon.js` (4 leçons réelles, boutons cliqués) | 27 aboutis | **0 / 41** | **28 aboutis / 41, 0 échec du moteur** |
  | `python-lecon.js` (3 leçons réelles) | 44 cliqués, 40 sorties | **0 / 43** | **43 cliqués, 42 sorties, 0 échec du moteur**, 1er bloc en **1 592 ms** |
  | `exos-code.js` sur **les 38 leçons** à exercice SQL ou Python | — | (mort) | **38 solutions acceptées, 0 refusée**, 91,0 s |
  | `preuve-hors-reseau.js tools/preuves/sqljs.html` | (preuve fausse) | (preuve fausse) | SQLite prêt en **9 ms dans le Worker**, 402 ms bout en bout |
  | `preuve-hors-reseau.js tools/preuves/pyodide.html` | 799 ms | (morte) | **1 222 ms**, 5 sorties attendues exactes |
  | `preuve-hors-reseau.js tools/preuves/erreurs-pyodide.html` | 16/16 | (morte) | **16 messages sur 16**, CPython 3.12.1 |
  | requêtes distantes, sur toutes les mesures ci-dessus | 0 | 0 | **0** |

  Les 13 blocs SQL qui n'aboutissent pas ne sont **pas** des pannes de moteur : ce sont des erreurs SQL du contenu (`no such column: points`, une contrainte `UNIQUE` violée exprès pour la démonstration). Le moteur les rapporte, c'est son travail.

  **5. LES TROIS PREUVES QUI MENTAIENT ONT ÉTÉ RÉÉCRITES — c'est la moitié de la valeur de ce point.** `tools/preuves/sqljs.html` chargeait sql.js par trois `<script src>` **dans la page** : elle affichait « SQL EXECUTE EN FILE:// SANS SERVEUR » **pendant toute la panne**, sans broncher. Elle emprunte désormais le trajet exact du produit (page → chaînes → Worker → `eval`). `pyodide.html` et `erreurs-pyodide.html`, elles, empruntaient l'ancien chemin : elles étaient donc **mortes depuis une semaine sans que rien ne le signale**, car aucune étape de `verif.js` ne les pilotait. Une preuve qui n'emprunte pas le chemin du produit ne prouve rien — et une preuve que personne ne lance ne protège de rien.

  **6. UN CONTRÔLE NEUF, PARCE QUE LA RÉPARATION CRÉE ELLE-MÊME UN RISQUE.** Le code des moteurs existe désormais **deux fois** : le fichier d'origine (lisible, comparable à l'amont par `build-sqljs`/`build-pyodide`) et sa copie en chaîne. Une copie qui dérive de son original, c'est un moteur qui démarre avec une version qui n'est plus celle du dépôt — la panne muette type. `tools/build-sources-worker.js` sans argument relit chaque chaîne et la compare **caractère par caractère** ; il est la **17ᵉ étape de `verif.js`** (`moteurs`, 0,0 s). **Épreuve par injection** : deux caractères ajoutés à `sql-wasm.js` → « SQLJS_SRC : 46 535 caractères, attendu 46 555 — ÉCART », code de sortie 1. Deuxième épreuve, la panne côté apprenant : `sql-wasm-src.js` renommé → le bouton affiche **« SQLite n'a pas pu se charger (fichier introuvable : sql-wasm-src.js) »**, le fichier manquant est nommé.

  **7. Coût.** `pyodide-src.js` 1,23 Mo + `sql-wasm-src.js` 47 Ko = **+1,27 Mo**, soit **88,90 → 90,17 Mo (+1,43 %)**. C'est le prix d'une redondance assumée : garder l'original permet de continuer à le comparer à l'amont, ce qui vaut mieux que d'avoir un seul exemplaire illisible. **À relire avec F3** : les 9,26 Mo des deux moteurs achètent de nouveau quelque chose — 38 exercices auto-corrigés et 1 075 boutons qui fonctionnent.

  ⚠️ **CE QUE ÇA APPREND, et qui dépasse ce point : le site dépend d'un navigateur qui change sans prévenir.** Rien dans le dépôt n'a bougé entre le 26 août et le 2 septembre ; c'est Chrome qui a fermé une porte, et **quatre vérificateurs verts n'ont rien vu** parce qu'aucun ne cliquait sur un bouton de moteur. Les deux preuves qui ont vu la panne sont celles qui pilotent une **vraie leçon**. La leçon pour la suite : `sql-lecon.js` et `python-lecon.js` devraient entrer dans `verif.js` — ils coûtent ~90 s chacun, ce qui est cher pour une passe rapide mais dérisoire au regard d'une semaine de moteurs morts. **Non fait dans cette passe, à trancher : le seuil de lenteur acceptable pour `verif.js`.**

- [x] **F3 · Poids.** ✅ **2026-09-02. +14,2 % de dépôt, dont 84 % pour deux moteurs — et le chiffre de référence inscrit en tête de plan (« ~35 Mo ») était faux de plus du double.**

  Taille des fichiers **suivis par git** (`git ls-tree -r -l`, donc ce qui est réellement livré, à l'exclusion du `scratchpad`) :

  | jalon | fichiers | poids | écart |
  |---|---:|---:|---:|
  | avant V14 (`ce96922^`) | 2 288 | **77,87 Mo** | — |
  | après sql.js (A2) | 2 297 | 78,78 Mo | **+0,90 Mo** (+1,2 %) |
  | après Pyodide (A4) | 2 311 | 87,14 Mo | **+8,36 Mo** (+10,7 %) |
  | aujourd'hui (fin de phase E) | 2 370 | **88,89 Mo** | **+11,02 Mo** (+14,2 %) |

  **Le jugement, et il est mitigé.** Les deux moteurs pèsent **9,26 Mo des 11,02** ajoutés (84 %) ; tout le contenu de six phases — 46 exercices exécutés, le bac à sable Git, le cahier de 55 erreurs, 9 blocs « une autre façon », les lots de prédiction — tient dans les **1,76 Mo** restants. Le rapport coût/bénéfice est très inégal : **sql.js coûte 0,90 Mo et rend 21 exercices exécutables** (24 Mo par exercice), **Pyodide coûte 8,36 Mo et en rend 25** (334 Mo par exercice, quatorze fois plus cher). Et ce que le worker JavaScript déjà présent a rendu possible — 1 073 exercices convertibles selon A1 — n'a coûté **aucun octet**.

  ✅ **Relu après la réparation de F2 (2026-09-02, seconde passe)** : les 9,26 Mo achètent de nouveau 38 exercices auto-corrigés et 1 075 boutons qui fonctionnent. La réparation a ajouté **+1,27 Mo** de copies en chaîne (`pyodide-src.js`, `sql-wasm-src.js`), portant le dépôt à **90,17 Mo (+1,43 %)** et les deux moteurs à **10,53 Mo**. Le rapport de Pyodide se dégrade d'autant : **380 Mo par exercice** au lieu de 334.

  🔵 Pour mémoire : le dépôt ne faisait **pas** 35 Mo au début de V14, mais 77,87 (A4 l'avait déjà relevé). La règle du plan « le poids est un critère » reste juste ; c'est la valeur de référence qui traînait depuis un chantier antérieur.
- [x] **F4 · Non-régression.** ✅ **2026-09-02. Les 21 étapes sont vertes en 2 005 s — mais le vrai résultat de ce point n'est pas cette couleur : c'est d'avoir mesuré CE QUE LA CHAÎNE VOIT, et d'avoir trouvé qu'elle était aveugle au défaut même qui fonde le chantier V14.**

  **A · LA CHAÎNE, TELLE QU'ELLE EST.** `node tools/verif.js --complet` — 21 étapes, **2 005,4 s**, code de sortie 0. Le mot « cinq vérificateurs » de l'énoncé date d'un chantier antérieur : il y en a vingt-et-un.

  | étape | durée | ce qu'elle a rendu |
  |---|---:|---|
  | source · donnees · contenu | 1,5 + 4,6 + 13,8 s | 0 problème · 0 erreur d'invariant · 1 leçon maigre (`sass/lecon-09`, connue depuis F5) |
  | exemple | 65,7 s | 1 058 valeurs annoncées confrontées au réel, **0 divergente** ; 197 solutions `type:code` rejouées, 0 divergente |
  | motifs · requete · python | 0,2 + 0,3 + 5,5 s | les exercices regex, SQL et Python : la référence passe, les contre-exemples échouent |
  | erreurs | 7,0 s | 55 entrées du décodeur, **78 extraits réexécutés** (39 fautifs + 39 corrigés) |
  | gitmodl · gitcmd · gitgraf · gitscen | 7,8 + 123,9 + 32,9 + 55,4 s | le bac à sable Git face au vrai `git` |
  | altern · moteurs | 0,3 + 0,0 s | format « une autre façon » · les copies en chaîne identiques à l'original |
  | **rendu** (`--tout --cours --lecons`) | **1 358,0 s** | débordement, contraste, focus, aria, console, réseau : **0 erreur** |
  | err-sql · dec-lec · stockag | 2,2 + 18,9 + 48,2 s | Chrome, `file://`, DNS coupé |
  | **sql-lec · py-lec** | 71,5 + 32,2 s | **41 blocs SQL cliqués, 28 résultats, 13 erreurs SQL du contenu, 0 moteur en échec, 0 requête distante** |
  | **mutants** (neuf) | 155,6 s | voir ci-dessous |

  Contrôles indépendants, hors chaîne, refaits le jour même : `build-index.js` sur les **5 index dérivés** (quiz 5 970, flashcards 11 364, antisèches 1 560, search 1 589, search-lite 1 589) → **identiques au fichier cible, 0 écart** ; **1 967 fichiers HTML** → **0 BOM** ; **3 153 blocs JSON** (`data-quiz` 1 536, `data-exos` 1 524, `data-quiz-bilan` 93) → **0 invalide** ; **189 fichiers `.js`** de `js/` et `tools/` → `node --check` **0 échec** ; **1 775 pages du site, 1 479 671 balises** → **0 déséquilibre** ; grep CDN sur tout le site hors `scratchpad/` → **0 URL** vers `cdnjs`, `fonts.googleapis`, `fonts.gstatic` (les seules occurrences sont du texte pédagogique et un `&lt;link&gt;` échappé dans `html/lecon-25`, qui enseigne précisément `preconnect`).

  **B · CE QUE CE POINT A RÉELLEMENT APPORTÉ : `tools/verif-chaine-mutations.js`, le vérificateur des vérificateurs.** « Vert » ne veut rien dire tant qu'on n'a pas mesuré ce que le contrôle regarde — c'est la leçon de F2, où la chaîne est restée verte une semaine pendant que les deux moteurs étaient morts. L'outil neuf injecte **neuf fautes** dans des fichiers réels, lance le vérificateur censé voir chacune, et **exige un code de sortie non nul**. Il restaure les octets d'origine après chaque mutation — y compris sur exception et sur Ctrl-C — et refuse de conclure si `git status` a bougé.

  | mutation | ce qu'elle casse | verdict |
  |---|---|---:|
  | `source` | un `<` non échappé dans un bloc `<pre><code>` | VUE (2,2 s) |
  | `donnees` | une leçon déclarée dans `data.js`, absente du disque | VUE (4,6 s) |
  | `exemple` | une sortie annoncée en commentaire qui ment | VUE (74,0 s) |
  | `requete` | le tableau attendu d'un exercice SQL, faussé d'une valeur | VUE (0,4 s) |
  | `python` | le `run.expect` d'un exercice Python, faussé d'un caractère | VUE (6,0 s) |
  | `erreurs` | un message du décodeur qui n'est plus celui du moteur | VUE (8,7 s) |
  | `moteurs` | le code d'un moteur qui dérive de sa copie en chaîne | VUE (0,1 s) |
  | **`sql-lec`** | **SQLite ne démarre plus** (chaîne de moteur vidée) | **VUE (29,8 s)** |
  | **`py-lec`** | **CPython ne démarre plus** (chaîne de moteur vidée) | **VUE (29,4 s)** |

  **9 injectées, 9 vues, 0 survivante**, arbre de travail identique à avant. Les deux dernières rejouent exactement la panne de F2 : elles prouvent que les étapes ajoutées en F5 ne sont pas décoratives.

  **C · L'ANGLE MORT TROUVÉ, ET IL PORTAIT SUR LE DÉFAUT FONDATEUR DU CHANTIER.** Au premier passage, **la mutation `source` a SURVÉCU**. `verif-html.js` voyait pourtant la faute et l'imprimait — `[element-dans-code] <b> créé dans le bloc <pre> et JAMAIS refermé : le texte disparaît de l'exemple` — puis **rendait 0**, parce que son code de sortie ne comptait que les problèmes classés GRAVES (« la page est cassée »), jamais les ATTENTION (« seul l'exemple est altéré »). Or « seul l'exemple est altéré » est **exactement** ce que V14 existe pour empêcher : un apprenant qui lit un code qui n'est pas celui qu'on croit lui montrer. Un `<b>` glissé dans un bloc aurait traversé `verif.js` en vert.

  Correctif : `verif-html.js` rend désormais 1 **dès qu'un problème est détecté, GRAVE ou ATTENTION** ; `--tolere-mineurs` rétablit l'ancien comportement pour un diagnostic ponctuel. **Le site est à 0 GRAVE et 0 ATTENTION sur 1 612 fichiers** le jour où la ligne est écrite : fermer le trou ne coûte rien. Mesure après correctif : mutation `source` → **VUE (code 1)**, site sain → **code 0**.

  🔵 **Une fausse alerte, notée parce qu'elle est instructive.** La mutation `exemple` a d'abord survécu elle aussi — mais le vérificateur n'y était pour rien : mon ancre visait `//=&gt; "number"`, texte qui n'existe que dans un `<code>` en ligne d'un tableau récapitulatif. Dans le vrai bloc exécutable, le `>` n'a pas besoin d'être échappé et s'écrit `//=>`. La mutation tombait à côté du seul endroit que `verif-exemples.js` regarde. **C'est la règle « un motif de remplacement trop large casse ce qui était juste » vue par l'autre bout : un motif trop ÉTROIT fait passer un outil sain pour aveugle.** Ancre corrigée (le code autour, pas seulement l'annonce) → VUE en 74,0 s.

  **D · CE QUI ENTRE DANS LA CHAÎNE, ET À QUEL PRIX.** `mutants` devient la **21ᵉ étape**, jouée **uniquement en `--complet`** parce qu'elle modifie des fichiers du dépôt. Coût : **+155,6 s** (1 883 → 2 005 s). Réserve honnête, écrite dans les deux fichiers : un arrêt **brutal** de la machine pendant une mutation laisserait un fichier modifié — `git checkout -- <fichier>` le répare. C'est le prix d'une mesure qu'aucun contrôle de source ne peut rendre.
- [x] **F5 · Ce qui n'a pas été fait.** ✅ **2026-09-02. Sept manques, tous mesurés le jour où ils sont écrits — et trois d'entre eux ne sont pas des oublis mais des LIMITES, ce qui ne se dit qu'en le prouvant. Un huitième a été comblé en chemin : les deux seules preuves qui cliquent sur un bouton de moteur entrent dans `verif.js`.**

  **A · CE QUI RESTE À FAIRE, ET QUI EST FAISABLE**

  | ce qui manque | mesure du jour | pourquoi ce n'est pas fait |
  |---|---|---|
  | **89 leçons sur 1 612 n'ont AUCUN exercice** | `js-avance` 23, `html-avance` 22, `css-avance` 22, `python-avance` 22 (`mesure-executable.js`) | La phase B **convertissait** des exercices existants ; elle n'en **créait** pas là où il n'y en avait aucun. C'est un chantier de contenu, relevé dès A2 et jamais ouvert — quatre cours entiers, soit environ 89 exercices à écrire de zéro. |
  | **21 des 30 blocs « une autre façon » retenus en E1** | 9 posés, format vert (`verif-alternatives.js` : 9 blocs, 0 faute) ; 87 leçons encore candidates (`mesure-alternatives.js`) | E3a et E3b ont mesuré le vrai prix d'un bloc : **34 fautes annoncées / 20 confirmées** sur 4 blocs, puis **7 chiffres qui ne se reproduisaient pas + 17 fautes** sur 3 blocs. À ce coût, une passe en produit 3 à 4. Sept passes restantes, pas une. |
  | **1 doublon de QCM jamais examiné** | `[I17]` : `zig/lecon-06#2` ↔ `zig/lecon-14#1` (même énoncé 0.33, même réponse 0.33) | Un avertissement, pas une erreur : c'est un **choix éditorial** (vrai doublon, ou deux faces d'une même notion ?), et V14 ne portait pas sur le contenu de `zig`. |
  | **1 leçon sous le standard éditorial** | `sass/lecon-09` : 4 critères sur 6 sous la médiane (svg 2<3, encadrés 3<5, glossaire 7<8, mots 2 129<2 143) | Hors sujet pour V14, qui portait sur l'exécution et non sur l'étoffe des leçons. Écart faible et constant depuis plusieurs passes. |

  ✅ **Un manque de cette liste a été comblé en écrivant F5, et il fallait le faire ici** : `sql-lecon.js` et `python-lecon.js` **sont désormais les 18ᵉ et 19ᵉ étapes de `verif.js`** (hors mode rapide, comme tout ce qui pilote Chrome). Ce sont **les deux seules étapes qui cliquent sur un vrai bouton de moteur** — leur absence est la raison pour laquelle la panne de F2 a vécu une semaine sous une chaîne verte. `sql-lecon.js` a dû être corrigé pour cela : il comptait « no such column » comme un échec, alors que c'est SQLite faisant son travail sur un exemple volontairement fautif. Il distingue maintenant **trois** issues (résultat / erreur SQL du contenu / **moteur en échec**) et ne rougit que sur la dernière, sur un résultat NUL, ou sur une requête distante. Coût : la chaîne complète passe de **475 s à ~655 s** ; le mode `--rapide` est inchangé.

  **B · CE QUI NE SERA PAS FAIT, ET POURQUOI — la partie qui compte, parce qu'un manque expliqué vaut mieux qu'une case qu'on rouvrira dix fois**

  1. **Les 20 cours au plus fort potentiel n'auront pas d'exercice exécuté.** Mesuré : `cpp` 79 exercices corrigés par mot-clé, `csharp` 76, `java` 76, `rust` 76, `ruby` 75, `git` 67… **aucun moteur ne tourne en `file://` pour ces langages**, et en embarquer un coûterait ce que Pyodide coûte (8,27 Mo pour un seul). C'est la raison d'être de la phase B7 : la **prédiction de sortie**, qui fait écrire à l'apprenant ce que le programme AFFICHE plutôt que le programme lui-même. 72 exercices de prédiction ont été écrits ainsi — et ils n'entrent dans **aucun** compteur d'exécution, ce qui fait paraître ces cours vides alors qu'ils ne le sont pas.

  2. **Les exercices HTML et CSS ne sont pas auto-corrigés, et ce n'est pas une conversion mais une infrastructure.** Relevé en B4 : l'aperçu HTML vit dans `runner.js`, le correcteur d'exercices dans `lecon.js`, **et les deux ne communiquent pas**. `initExos` n'a qu'un moteur — poster du JavaScript à un Worker et comparer la sortie console. Un exercice CSS n'a rien à comparer : il faudrait un juge neuf (rendre dans une `iframe`, interroger le DOM ou les styles calculés). Chantier à part entière.

  3. **Le cahier d'erreurs restera à quatre langages sur 88 cours.** 55 entrées : 15 JavaScript, 16 Python, 14 SQL, 10 Bash. La règle de C1 — *chaque message est copié d'une exécution réelle, jamais écrit de mémoire* — décide seule de ce qui est possible : inventaire refait, `go`, `elixir`, `java`, `javac`, `gcc`, `php`, `ruby`, `sqlite3` sont **absents de la machine**, `dotnet` est là mais sans SDK utilisable. Écrire les messages de Java sans Java, ce serait précisément la faute que ce chantier existe pour empêcher.

  **C · CE QUE V14 A CHANGÉ, EN UN CHIFFRE ET UNE RÉSERVE.** Exercices corrigés en **exécutant** : **211 → 354** ; part auto-corrigée **4,77 % → 7,68 %** ; cours concernés **9 → 29 sur 92**. La réserve tient en une phrase : **ces chiffres n'ont voulu dire quelque chose qu'après F2**, car du 26 août au 2 septembre les deux moteurs qui portent 38 de ces exercices — et 1 075 boutons « ▶ Exécuter » — ne démarraient plus chez l'apprenant. Un chantier peut être vert de bout en bout et livrer zéro — c'est la leçon la plus chère de V14.

---

## Fin de chantier

Quand toutes les cases sont cochées, le wrapper déclenche la **passe de sécurité** : vérification
globale, rapport dans `VERIF-FINALE.md` avec un verdict en première ligne, puis extinction automatique
si le verdict est vert.
