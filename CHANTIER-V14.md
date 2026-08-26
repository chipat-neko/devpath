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

- [ ] **B1 · Les cours SQL et données** (`sql`, `bdd`, `nosql`, `data-eng`) — dépend de A2/A3.
- [ ] **B2 · Les cours Python** (`python`, `python-avance`, `pandas`, `stats`, `dataviz`, `ml`) — dépend de A4.
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
- [ ] **B6 · `algo` et `patterns`** — déjà bien dotés, compléter.
- [ ] **B7 · Les cours de prédiction** (langages non exécutables) — appliquer le format « que produit ce code ? » décidé en A5, sur les cours les plus consultés d'abord.

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
