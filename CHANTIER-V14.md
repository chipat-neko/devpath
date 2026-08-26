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

- [ ] **B7c-2 · `rust`** (50 blocs à « // Sortie : », 214 blocs au total). L'outil sait désormais lire cette forme : la case est un travail de **choix de cibles et de contradiction**, pas d'outillage. Même méthode obligatoire : rejouer les sorties avant d'écrire, déclarer `commentaires: N`, faire démolir.
- [ ] **B7c-3 · `java` et `csharp`** (37 et 31 blocs). ⚠️ `dotnet` n'a ici **que le runtime, aucun SDK** : C# n'est pas plus compilable que le reste, le rejeu par transposition reste la seule voie.
- [ ] **B7c-4 · `c` et `php`** (28 et 29 blocs).
- [ ] **B7c-5 · `go` et `elixir`** (22 et 1 blocs). ⚠️ `elixir` est le seul des huit à employer surtout l'annonce de fin de ligne (10 blocs) : c'est la forme de B7a/B7b qu'il faut y appliquer, pas la forme `bloc`.
- [ ] **B7c-6 · Reprendre les 5 exercices `ruby` que `--rejouer` refuse** (point 9 de B7c-1), et trancher la réserve du point 8 : faut-il masquer la ligne dans la leçon source ?
- [ ] **B7d · `bash`** (65 blocs) — à traiter à part : ses sorties dépendent du système, et la règle A5 n'y suffit pas.

---

## PHASE C — Le décodeur de messages d'erreur

C'est ce qu'un débutant cherche en premier, et le site n'en dit rien. Un fichier de données, une page
de recherche, et des renvois depuis les leçons.

- [ ] **C1 · Le format et les 30 premières erreurs.** `js/erreurs-data.js` : message, langage, cause réelle, remède, leçon qui l'explique. Commencer par JavaScript et Python, les deux langages où le site a le plus de contenu. **Chaque message doit être copié d'une exécution réelle**, pas reconstitué de mémoire — un message approximatif ne sera jamais retrouvé par recherche.
- [ ] **C2 · La page de recherche.** On colle un message d'erreur, on obtient la cause et le remède. Recherche tolérante : les messages contiennent des noms de variables qui changent d'un cas à l'autre.
- [ ] **C3 · Étendre aux autres langages** — un lot par famille, en s'appuyant sur les cours existants.
- [ ] **C4 · Relier aux leçons.** Une leçon qui enseigne une notion dont l'erreur est fréquente renvoie au décodeur, et inversement.

---

## PHASE D — Un bac à sable Git

Le cours `git` fait 24 leçons sans **aucune** pratique interactive, alors que c'est la référence la
plus utilisée du domaine et que tout est simulable en JavaScript : un dépôt Git est un graphe de
commits, et les commandes courantes sont des opérations sur ce graphe.

- [ ] **D1 · Le modèle.** Un graphe de commits en mémoire, les branches, l'index, le répertoire de travail. Purement JavaScript, donc exécutable en `file://`.
- [ ] **D2 · Les commandes.** `add`, `commit`, `branch`, `checkout`, `merge`, `rebase`, `reset`, `revert`, `cherry-pick`. Chacune modifie le graphe.
- [ ] **D3 · La visualisation.** Le graphe dessiné en SVG, qui se met à jour à chaque commande. C'est ce qui rend Git compréhensible : on **voit** ce que `rebase` fait.
- [ ] **D4 · Les scénarios guidés.** Des situations réelles à résoudre : « tu as commité sur la mauvaise branche », « il faut annuler un commit déjà poussé », « résoudre un conflit ». Relier aux leçons du cours `git`.

---

## PHASE E — « Plusieurs façons de le faire »

Le site donne une solution par exercice. Les bons cours montrent les **alternatives** et disent
pourquoi on choisit l'une plutôt que l'autre — c'est ce qui distingue un apprenant qui applique d'un
apprenant qui décide.

- [ ] **E1 · Choisir les leçons.** Repérer les leçons où plusieurs approches se défendent réellement (boucle contre méthode fonctionnelle, récursif contre itératif, jointure contre sous-requête…). **Borner : quelques dizaines, pas 1 463.** Écrire la liste ici avant de commencer.
- [ ] **E2 · Le format.** Un bloc « une autre façon de le faire » : la variante, ce qu'elle coûte, ce qu'elle apporte, quand la préférer. Style du site, pas de catalogue exhaustif.
- [ ] **E3 · Écrire, par lots de cours.** Un lot par case.

---

## PHASE F — Contrôle final

- [ ] **F1 · Mesure globale.** Part d'exercices auto-corrigés : **2,5 % au départ**, combien à l'arrivée ? Nombre de cours ayant au moins un exercice exécutable : **3 au départ**.
- [ ] **F2 · Preuve hors réseau.** Tous les moteurs embarqués fonctionnent avec le réseau coupé, mesuré dans Chrome. Aucune requête distante.
- [ ] **F3 · Poids.** Taille du dépôt avant et après, et jugement : le compromis valait-il le coup ?
- [ ] **F4 · Non-régression.** Les cinq vérificateurs verts.
- [ ] **F5 · Ce qui n'a pas été fait.** Lister et expliquer.

---

## Fin de chantier

Quand toutes les cases sont cochées, le wrapper déclenche la **passe de sécurité** : vérification
globale, rapport dans `VERIF-FINALE.md` avec un verdict en première ligne, puis extinction automatique
si le verdict est vert.
