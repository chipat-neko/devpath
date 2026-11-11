# Rapport V16 — agent `d` : cases D1 et D2 (« les liens qui manquent »)

Copie de travail `D:\test-claude-v16\d`, branche `v16/d`, partie de `a67de86`.

## ⚠️ Fichiers partagés touchés hors du fichier nommé par la case

La case nomme `js/lecon.js`. Deux **preuves déjà dans la chaîne** ont dû être étendues, parce
qu'une table recopiée qu'aucun outil ne relit est exactement « l'outil hors chaîne » que ce
chantier traque :

- `tools/preuves/decodeur-lecons.js` (étape `dec-lec` de `verif.js`, hors `--rapide`) : lit la
  nouvelle table `DECODEUR_AUSSI` et ses gabarits recopiés, les confronte à `js/erreurs-data.js`,
  refuse une leçon déjà dans l'index, puis ouvre chaque leçon dans Chrome.
- `tools/preuves/git-graphe.js` (étape `gitgraf`, hors `--rapide`) : lit la nouvelle table
  `BAC_GIT_AILLEURS`, ouvre chaque leçon dans Chrome, et confronte au vrai dictionnaire des
  commandes (`js/git-commandes.js`) la phrase que l'encart affiche hors du cours `git`.

**Non touché, à signaler à l'orchestrateur** : `tools/verif.js`, ligne de l'étape `vexlien`, dit
encore « les 19 lecons liees, leurs 53 liens et 6 temoins negatifs ». Le chiffre est désormais
43 leçons et 87 liens. C'est un libellé, pas un contrôle : je ne l'ai pas modifié (fichier partagé,
non indispensable).

Aucune page HTML n'est modifiée : tous les liens sont posés à l'exécution par `js/lecon.js`.

---

## D1 · Le visualiseur, relié là où il sert

### Ce que dit la case
« Le F5 annonce 41 leçons qui expliquent la pile d'appels sans y mener ; B6 en avait retenu 19
sur 42 candidates, mesurées par le titre et non par le corps. Les deux mesures ne portent pas sur
le même ensemble : commencer par les réconcilier, puis relier ce qui le mérite. »

### La réconciliation, mesurée (pas soustraite)

**D'où vient chaque chiffre** (retrouvé dans `docs/chantiers/CHANTIER-V15.md` et rejoué sur l'historique) :

- **F5 (et F4)** : `grep -rl "pile d'appels"` sur les pages. Rejoué au commit du F5 (`3032492`) :
  **48 fichiers `lecon-*.html`** (50 pages en comptant `execution.html` et `etude-reecriture.html`).
  Intersection avec la table `VISUALISEUR` : **7**. Les « 41 » = 48 − 7. Ensemble **F** : par le corps.
- **B6** : « 42 leçons portent “pile d'appels”, “récursion”, “fermeture”, “portée”, “this” ou
  “asynchrone” dans leur titre ». Le script de B6 n'a pas été gardé (ni dans le dépôt ni dans
  `D:\test-claude\scratchpad`). Je l'ai **reconstruit** : sur le `<h1>` des leçons, l'expression
  `pile d'appels|récursi|fermeture|closure|portée|\bthis\b|async|boucle d'événements|promesse|minuteur`
  rend **42** au commit de B6 (`39b537d`), **42** au commit du F5 et **42** aujourd'hui, et
  contient **les 19 leçons liées et les 3 témoins négatifs** de B6. La liste littérale du
  commentaire de B6 (six mots) n'en rend que 27 et laisse dehors 10 des 19 liées : B6 cherchait
  en réalité aussi « boucle d'événements », « promesse », « minuteur », « closure » et « async ».
  Ensemble **T** : par le titre.

| Mesure (au commit du F5, `3032492`) | Valeur |
|---|---:|
| F — corps contient « pile d'appels » | **48** |
| T — titre (B6) | **42** |
| V — table `VISUALISEUR` (B6) | **19**, toutes dans T |
| F ∩ T | **9** |
| F ∩ V | **7** |
| F − T (jamais vues par B6) | **39** |
| T − F (titre sans « pile d'appels » dans le corps) | **33** |
| F ∪ T | **81** |
| **F − V, le « 41 » du F5** | **41 = 39 jamais vues par B6 + 2 déjà écartées par B6** (`elixir/lecon-05`, `lisp/lecon-11`) |

Les deux mesures ne se recouvrent donc presque pas : B6 a jugé des **titres** (dont 12 de ses 19
liées ne prononcent jamais « pile d'appels »), le F5 a compté un **mot** dans le corps.

**Ce qui a bougé depuis le F5.** Aujourd'hui (`a67de86`) F vaut **56**. Mais en ne regardant que
la **prose** (hors `<script>`, donc hors QCM et exercices), F vaut **43 au F5 et 43 aujourd'hui —
exactement les mêmes 43 leçons**. Les 8 de plus (`algo/lecon-05`, `archi/lecon-10`,
`nodejs/lecon-14`, `nodejs/lecon-18`, `nodejs/lecon-19`, `observabilite/lecon-11`,
`python/lecon-45`, `python/lecon-46`) ne portent l'expression que dans un **QCM** — le plus souvent
dans un distracteur écrit pendant B4. Au F5 déjà, 5 des 48 étaient dans ce cas. Le « 41 » du F5
mêlait donc 36 leçons dont la prose parle de la pile et 5 où seul un QCM la nomme.

**Candidates à lire aujourd'hui** : (F ∪ T) − V = **69** = 36 (prose) + 12 (QCM seul) + 21 (titre seul).

**Mesure complémentaire par le corps.** Les deux mesures d'origine ne voient que « pile d'appels »
(corps) et une poignée de mots (titre). Le visualiseur montre aussi les fermetures, la portée, la
boucle d'événements, `this`. J'ai donc compté, dans la prose hors code de toutes les autres leçons,
les notions du visualiseur au-delà d'un seuil (fermeture/closure ≥ 6, boucle d'événements /
microtâche ≥ 3, récursi ≥ 8, `this` ≥ 15, portée/hoisting/zone morte ≥ 8, pile/cadre d'appel ≥ 6) :
**84 leçons** de plus. Les seuils sont arbitraires ; une leçon sous les seuils n'a pas été examinée.

### La règle de décision
Une leçon est reliée si (1) son **corps** traite, dans une section et non au passage, ce que
l'exemple montre ; (2) un exemple du visualiseur correspond à **ce que dit la leçon** ; (3) le
langage a **le même mécanisme** pour ce que l'exemple montre. Motifs d'écartement récurrents :

- **exception qui remonte la pile** (Ada, C++, C#, Java, Dart, Perl, Rust, JS) : aucun des 26
  exemples ne montre une propagation d'exception — y renvoyer montrerait des appels qui se
  terminent normalement ;
- **trace affichée par un outil** (backtrace de GDB, FUNCNAME, valgrind, ASan, flame chart) ;
- **récursion terminale optimisée** (Scheme, Erlang, Elixir, OCaml `fold_left`, Lisp) :
  JavaScript n'a pas cette optimisation, l'exemple ferait grandir la pile là où la leçon enseigne
  qu'elle reste plate ;
- **asynchrone à threads ou à coroutines** (C#, F#, Kotlin, Python asyncio, Swift, Rust, Clojure) ;
- **mention au passage**, ou **QCM seul**.

### Décisions — les 69 candidates : 12 reliées, 57 écartées

| Leçon | Origine | Décision | Exemples reliés | Raison |
|---|---|---|---|---|
| `ada/lecon-07` | corps | ne pas relier | — | exception qui remonte la pile : aucun exemple du visualiseur ne montre une propagation d'exception (Ada) |
| `algo/lecon-05` | corps (QCM seul) | ne pas relier | — | « pile d'appels » n'est que dans un QCM (souvent un distracteur), le corps n'en traite pas |
| `algo/lecon-08` | corps | **relier** | `factorielle` | la pile LIFO illustrée par la pile d'appels : « le dernier appel démarré est le premier à finir ». Pas recursion-sans-fin : la leçon parle d'une récursion trop PROFONDE, l'exemple d'une récursion SANS FIN (même raison que pour la fiche js-stack du décodeur) |
| `algo/lecon-10` | corps | **relier** | `arbre` | parcours en profondeur récursif d'un arbre, la pile monte jusqu'à la hauteur : l'exemple parcourt le même arbre (8, 3, 10, 1, 6, 14) |
| `algo/lecon-12` | corps | **relier** | `arbre` | DFS récursif : « la pile d'appels joue le rôle de la pile explicite » |
| `algo/lecon-14` | corps | **relier** | `fibonacci` | « Fil conducteur : Fibonacci, du naïf à l'optimal » : fibNaif et son arbre d'appels en O(2ⁿ), exactement l'exemple fibonacci |
| `algo/lecon-25` | corps | ne pas relier | — | une phrase au passage : la pile n'est pas le sujet de la leçon |
| `archi/lecon-08` | titre | ne pas relier | — | communication synchrone/asynchrone entre services (files de messages) : rien de la boucle d'événements d'un programme |
| `archi/lecon-10` | corps (QCM seul) | ne pas relier | — | « pile d'appels » n'est que dans un QCM (souvent un distracteur), le corps n'en traite pas |
| `asm/lecon-11` | corps | ne pas relier | — | « pile d'appels » désigne une trace affichée par un outil (débogueur, profileur, rapport d'erreur), pas le mécanisme en marche (backtrace de GDB) |
| `bash/lecon-12` | corps | ne pas relier | — | « pile d'appels » désigne une trace affichée par un outil (débogueur, profileur, rapport d'erreur), pas le mécanisme en marche (FUNCNAME) ; et Bash a une portée dynamique, que le visualiseur ne montre pas |
| `c/lecon-04` | corps | **relier** | `fonctions`, `factorielle`, `recursion-sans-fin` | section « Les paramètres et la pile d'appels » (un cadre par appel, factorielle(5)) et piège de la récursion sans cas de base |
| `c/lecon-14` | corps | ne pas relier | — | « pile d'appels » désigne une trace affichée par un outil (débogueur, profileur, rapport d'erreur), pas le mécanisme en marche (valgrind) |
| `c/lecon-16` | corps | ne pas relier | — | « pile d'appels » désigne une trace affichée par un outil (débogueur, profileur, rapport d'erreur), pas le mécanisme en marche (AddressSanitizer) |
| `clojure/lecon-11` | titre | ne pas relier | — | modèle asynchrone différent de la boucle d'événements de JavaScript (core.async) |
| `compilation/lecon-04` | corps | ne pas relier | — | une phrase au passage : la pile n'est pas le sujet de la leçon |
| `compilation/lecon-05` | corps | ne pas relier | — | « pile d'appels » désigne une trace affichée par un outil (débogueur, profileur, rapport d'erreur), pas le mécanisme en marche (enregistrement de profilage) |
| `compilation/lecon-09` | corps | ne pas relier | — | la pile y est un argument sur la descente récursive, et aucun exemple ne montre un analyseur ; la leçon 8, qui la mesure, est déjà reliée |
| `compilation/lecon-10` | corps | **relier** | `arbre` | « Descendre, puis calculer en remontant » : l'évaluateur récursif épouse l'arbre, un cadre par nœud ; l'exemple calcule la hauteur en post-ordre |
| `compilation/lecon-11` | corps | ne pas relier | — | le sujet est la pile de VALEURS d'une machine à pile ; la pile d'appels n'y est que le contrepoint |
| `compilation/lecon-12` | corps | ne pas relier | — | une phrase au passage : la pile n'est pas le sujet de la leçon (mesure comparative, renvoie à la leçon 8) |
| `compilation/lecon-13` | corps | ne pas relier | — | exception qui remonte la pile : aucun exemple du visualiseur ne montre une propagation d'exception |
| `cpp/lecon-13` | corps | ne pas relier | — | exception qui remonte la pile : aucun exemple du visualiseur ne montre une propagation d'exception (déroulement de pile et RAII) |
| `csharp/lecon-09` | corps | ne pas relier | — | exception qui remonte la pile : aucun exemple du visualiseur ne montre une propagation d'exception |
| `csharp/lecon-12` | titre | ne pas relier | — | modèle asynchrone différent de la boucle d'événements de JavaScript (Task, pool de threads, contexte de synchronisation) |
| `csharp/lecon-14` | titre | ne pas relier | — | modèle asynchrone différent de la boucle d'événements de JavaScript (Task, canaux) |
| `dart/lecon-07` | titre | **relier** | `async-ordre`, `async-microtaches-dabord`, `async-await` | section « L'event loop : microtasks vs events » : tout le synchrone, puis TOUTES les microtâches, puis un seul événement — le modèle de JavaScript |
| `dart/lecon-09` | corps | ne pas relier | — | exception qui remonte la pile : aucun exemple du visualiseur ne montre une propagation d'exception |
| `elixir/lecon-05` | corps + titre | ne pas relier | — | la leçon fait de la récursion terminale, optimisée par le langage, son point central : le visualiseur (JavaScript, sans cette optimisation) ferait grandir la pile là où la leçon enseigne qu'elle reste plate |
| `erlang/lecon-03` | titre | ne pas relier | — | la leçon fait de la récursion terminale, optimisée par le langage, son point central : le visualiseur (JavaScript, sans cette optimisation) ferait grandir la pile là où la leçon enseigne qu'elle reste plate |
| `fsharp/lecon-07` | titre | ne pas relier | — | modèle asynchrone différent de la boucle d'événements de JavaScript (async .NET) |
| `go/lecon-18` | corps (QCM seul) | ne pas relier | — | « pile d'appels » n'est que dans un QCM (souvent un distracteur), le corps n'en traite pas |
| `haskell/lecon-03` | titre | ne pas relier | — | évaluation paresseuse et récursion terminale : écartée par B6, raison maintenue |
| `java/lecon-09` | corps | ne pas relier | — | exception qui remonte la pile : aucun exemple du visualiseur ne montre une propagation d'exception |
| `js/lecon-25` | corps | ne pas relier | — | exception qui remonte la pile : aucun exemple du visualiseur ne montre une propagation d'exception ; et son seul exemple de rejet (async-rejet) ARRÊTE le programme comme Node, alors que la leçon (navigateur) dit qu'un rejet non géré « ne déclenche aucune réaction » |
| `js/lecon-30` | corps | **relier** | `fonctions`, `statistiques` | section « Les points d'arrêt et debugger » : en pause, la pile d'appels et le panneau Scope, puis le pas à pas — ce que le visualiseur affiche à chaque pas |
| `js/lecon-37` | corps | ne pas relier | — | une phrase au passage : la pile n'est pas le sujet de la leçon (une phrase sur les DevTools ; js/lecon-30 est la leçon qui le traite) |
| `js/lecon-58` | corps | ne pas relier | — | « pile d'appels » désigne une trace affichée par un outil (débogueur, profileur, rapport d'erreur), pas le mécanisme en marche (flame chart) |
| `js/lecon-63` | corps | **relier** | `async-rejet` | section « Synchrone vs asynchrone : le piège du try/catch » : le rejet arrive après la fin du bloc try, et « depuis Node 15, un rejet non géré termine le process » — ce que montre async-rejet |
| `kotlin/lecon-13` | titre | ne pas relier | — | modèle asynchrone différent de la boucle d'événements de JavaScript (coroutines) — témoin négatif de B6 |
| `kotlin/lecon-17` | titre | ne pas relier | — | modèle asynchrone différent de la boucle d'événements de JavaScript (Flows) |
| `lisp/lecon-05` | titre | ne pas relier | — | la leçon fait de la récursion terminale, optimisée par le langage, son point central : le visualiseur (JavaScript, sans cette optimisation) ferait grandir la pile là où la leçon enseigne qu'elle reste plate (Scheme garantit l'optimisation) |
| `lisp/lecon-11` | corps + titre | ne pas relier | — | la leçon fait de la récursion terminale, optimisée par le langage, son point central : le visualiseur (JavaScript, sans cette optimisation) ferait grandir la pile là où la leçon enseigne qu'elle reste plate |
| `lisp/lecon-12` | titre | **relier** | `fermeture-compteur` | make-compteur : let + lambda + set!, deux compteurs indépendants — le même programme que fermeture-compteur |
| `lua/lecon-10` | corps (QCM seul) | ne pas relier | — | « pile d'appels » n'est que dans un QCM (souvent un distracteur), le corps n'en traite pas |
| `maths/lecon-13` | corps (QCM seul) | ne pas relier | — | « pile d'appels » n'est que dans un QCM (souvent un distracteur), le corps n'en traite pas |
| `nodejs/lecon-13` | corps | ne pas relier | — | une phrase au passage : la pile n'est pas le sujet de la leçon (une parenthèse : « pas-à-pas, pile d'appels, inspection des variables ») |
| `nodejs/lecon-14` | corps (QCM seul) | ne pas relier | — | « pile d'appels » n'est que dans un QCM (souvent un distracteur), le corps n'en traite pas |
| `nodejs/lecon-18` | corps (QCM seul) | ne pas relier | — | « pile d'appels » n'est que dans un QCM (souvent un distracteur), le corps n'en traite pas |
| `nodejs/lecon-19` | corps (QCM seul) | ne pas relier | — | « pile d'appels » n'est que dans un QCM (souvent un distracteur), le corps n'en traite pas |
| `observabilite/lecon-11` | corps (QCM seul) | ne pas relier | — | « pile d'appels » n'est que dans un QCM (souvent un distracteur), le corps n'en traite pas |
| `ocaml/lecon-03` | titre | **relier** | `recursion-somme`, `recursion-sans-fin` | « La récursion : let rec » : somme d'une liste, descendre jusqu'au cas de base puis additionner en remontant ; sans cas de base, sans fin — aucune récursion terminale dans la leçon |
| `ocaml/lecon-07` | corps | ne pas relier | — | la leçon fait de la récursion terminale, optimisée par le langage, son point central : le visualiseur (JavaScript, sans cette optimisation) ferait grandir la pile là où la leçon enseigne qu'elle reste plate (fold_left terminal contre fold_right) |
| `perf-web/lecon-13` | corps | ne pas relier | — | « pile d'appels » désigne une trace affichée par un outil (débogueur, profileur, rapport d'erreur), pas le mécanisme en marche (flame chart) |
| `perl/lecon-15` | corps | ne pas relier | — | exception qui remonte la pile : aucun exemple du visualiseur ne montre une propagation d'exception (Carp) |
| `perl/lecon-16` | corps (QCM seul) | ne pas relier | — | « pile d'appels » n'est que dans un QCM (souvent un distracteur), le corps n'en traite pas |
| `prolog/lecon-06` | titre | ne pas relier | — | récursion de Prolog (retour arrière) : témoin négatif de B6 |
| `python/lecon-26` | titre | ne pas relier | — | modèle asynchrone différent de la boucle d'événements de JavaScript (asyncio) — témoin négatif de B6 |
| `python/lecon-35` | titre | ne pas relier | — | modèle asynchrone différent de la boucle d'événements de JavaScript (asyncio) |
| `python/lecon-45` | corps (QCM seul) | ne pas relier | — | « pile d'appels » n'est que dans un QCM (souvent un distracteur), le corps n'en traite pas |
| `python/lecon-46` | corps (QCM seul) | ne pas relier | — | « pile d'appels » n'est que dans un QCM (souvent un distracteur), le corps n'en traite pas |
| `react/lecon-10` | corps | ne pas relier | — | une phrase au passage : la pile n'est pas le sujet de la leçon (le nom de la fonction apparaît dans la pile) |
| `rust/lecon-09` | corps | ne pas relier | — | exception qui remonte la pile : aucun exemple du visualiseur ne montre une propagation d'exception (panique) |
| `rust/lecon-10` | titre | ne pas relier | — | les fermetures de Rust capturent par possession et emprunt (move, Fn/FnMut/FnOnce) : écartée par B6, raison maintenue |
| `rust/lecon-16` | titre | ne pas relier | — | modèle asynchrone différent de la boucle d'événements de JavaScript (futures paresseuses, exécuteur) |
| `sql/lecon-16` | titre | ne pas relier | — | une CTE récursive est une itération jusqu'au point fixe, pas une pile d'appels |
| `swift/lecon-11` | titre | ne pas relier | — | modèle asynchrone différent de la boucle d'événements de JavaScript (acteurs) |
| `tests/lecon-08` | titre | ne pas relier | — | enseigne des techniques de test (await dans le test, faux minuteurs de Jest), pas l'ordre d'exécution ; les faux minuteurs remplacent justement l'horloge que le visualiseur fait tourner |
| `vscode/lecon-06` | corps | **relier** | `fonctions` | section « Lancer et piloter le débogueur » : pas à pas (F11 entre dans moyenne), Variables, Pile d'appels — sur un exemple en JavaScript |

### Décisions — la mesure par densité : 12 reliées sur 84

| Leçon | Densité mesurée | Exemples reliés | Raison |
|---|---|---|---|
| `js/lecon-06` | portée:9 | `fonctions`, `portee-bloc` | section « Portée des variables » : locale, globale, et la portée de bloc de let/const |
| `js/lecon-34` | boucle d'événements:26 | `async-ordre`, `async-microtaches-dabord`, `async-minuteurs` | section « queueMicrotask contre setTimeout(…, 0) » : vider TOUTES les microtâches avant la macrotâche suivante ; section sur les minuteurs |
| `js/lecon-49` | fermeture:14 | `fermeture-compteur` | section « Module : encapsuler état et API » : un compteur dont l'état est prisonnier de la closure |
| `js/lecon-51` | fermeture:9 | `fermeture-compteur` | une closure garde son environnement vivant : c'est la cause de fuite que la leçon décrit, et ce que montre l'exemple |
| `lisp/lecon-06` | fermeture:15 | `fermeture-compteur` | section « Les fermetures (closures) » : une fonction qui capture son environnement, chaque appel en crée une distincte |
| `lisp/lecon-07` | portée:10 | `portee-chainee` | section « La portée lexicale » : un nom est cherché là où il est écrit |
| `lisp/lecon-09` | fermeture:6 | `fermeture-compteur` | section « État encapsulé dans une fermeture » : fabrique-compteur |
| `go/lecon-02` | fermeture:11 | `fermeture-compteur` | nouveauCompteur : la closure garde total vivant entre les appels |
| `lua/lecon-08` | fermeture:8 | `fermeture-compteur` | section « l'encapsulation par closures » : le solde privé capturé par les méthodes |
| `lua/lecon-14` | fermeture:23 | `fermeture-compteur` | « Écrire un itérateur à closure » : la variable i capturée survit d'un appel à l'autre |
| `lua/lecon-16` | fermeture:11 | `fermeture-compteur` | « Closures : fabriquer des fonctions », et l'astuce du compteur privé |
| `asm/lecon-04` | récursion:12, pile:60 | `fonctions`, `factorielle` | « call et ret : l'aller-retour d'un appel » et « La récursion : factorielle en assembleur » : les cadres que le visualiseur montre |

Les 72 autres, classées par l'intitulé, la notion comptée et, pour les cas douteux, la lecture
(`js/lecon-21`, `java/lecon-17`, `ocaml/lecon-05`, `ocaml/lecon-13`, `lisp/lecon-15`,
`nodejs/lecon-24`, `maths/lecon-12` ont été lues) :

- **homonymes** — « fermeture » d'une fenêtre ou d'une modale (`a11y/lecon-08`, `a11y/lecon-13`,
  `css/lecon-41`, `html/lecon-27`, `html/lecon-28`, `mobile/lecon-03`), « portée » d'une attaque ou
  d'une onde (`offensive/lecon-03`, `offensive/lecon-05`, `reseaux/lecon-09`, `mobile/lecon-06`),
  « pile » d'outils, de polices ou de navigation (`docker/lecon-13`, `css/lecon-06`,
  `mobile/lecon-05`, `dart/lecon-14`, `swift/lecon-14`) ;
- **la pile comme structure de données ou comme zone mémoire** (pile générique, pile contre tas,
  pile d'opérandes, ABI) : `ada/lecon-10`, `c/lecon-07`, `c/lecon-12`, `c/lecon-18`,
  `cpp/lecon-09`, `csharp/lecon-16`, `go/lecon-12`, `java/lecon-17`, `rust/lecon-05`,
  `typescript/lecon-06`, `swift/lecon-09`, `zig/lecon-08`, `zig/lecon-17`, `patterns/lecon-11`,
  `lua/lecon-05`, `lua/lecon-11`, `lua/lecon-19`, `asm/lecon-05`, `asm/lecon-08`, `asm/lecon-10`,
  `asm/lecon-14`, `wasm/lecon-07`, `compilation/lecon-01`, `ocaml/lecon-08`, `ocaml/lecon-10`,
  `haskell/lecon-15`, `erlang/lecon-05`, `os/lecon-12` ;
- **récursion sans exemple qui lui corresponde** (recherche binaire, tri rapide, retour arrière,
  parcours de dossiers, types récursifs, grammaires, CTE, évaluateurs) : `algo/lecon-03`,
  `algo/lecon-06`, `algo/lecon-18`, `cpp/lecon-21`, `cpp/lecon-23`, `maths/lecon-12`,
  `sql/lecon-09`, `rust/lecon-13`, `rust/lecon-14`, `typescript/lecon-11`, `compilation/lecon-03`,
  `ocaml/lecon-05`, `ocaml/lecon-13`, `lisp/lecon-15`, `prolog/lecon-05` ;
- **`this` ou fermetures d'un autre modèle** : `dart/lecon-05` (le `this` de Dart est toujours
  l'instance), `kotlin/lecon-12`, `kotlin/lecon-18` (receveurs), `js/lecon-21` (emploie `this`
  dans des classes, ne l'explique pas), `groovy/lecon-07`, `groovy/lecon-08`, `groovy/lecon-13`,
  `groovy/lecon-14` (délégation des builders), `php/lecon-13` (`use` capture par valeur),
  `rust/lecon-12`, `swift/lecon-10`, `swift/lecon-13`, `dart/lecon-11` ;
- **`nodejs/lecon-24`** : un calcul qui bloque la boucle — le visualiseur ne mesure pas le temps.

### Un défaut de l'encart existant, corrigé
`FAMILLE_JS` décidait de la mise en garde « la syntaxe diffère de ce cours » par cours. Or
`algo` (222 blocs JavaScript sur 234) et `compilation` (87 JavaScript, 83 texte, 2 Python)
écrivent leur code en JavaScript : l'encart de `algo/lecon-02` et de `compilation/lecon-08`
leur affirmait quelque chose de faux depuis B6. `FAMILLE_JS` liste désormais les cours dont le
**code** est du JavaScript (+ `algo`, `compilation`, `vscode`). La mise en garde elle-même disait
« la pile d'appels et les portées se comportent de la même façon » — faux pour l'assembleur (des
cadres, aucune portée) et hors sujet pour la boucle d'événements de Dart ; elle dit maintenant
« la syntaxe diffère de ce cours, mais le mécanisme que montrent ces exemples est le même ».

### Après
| | avant | après |
|---|---:|---:|
| leçons reliées au visualiseur | **19** | **43** |
| liens | **53** | **87** |
| mises en garde « ce n'est pas ton langage » | **8** (dont 2 fausses) | **18** |
| exemples du visualiseur cités par au moins une leçon | **19** sur 26 | **22** sur 26 (+ `fonctions`, `statistiques`, `fibonacci`) |
| leçons dont la prose explique la pile d'appels, et qui y mènent | **7** sur 43 | **16** sur 43 |
| des « 41 » du F5, reliées | 0 | **9** |

Les 32 autres des « 41 » restent sans lien, chacune avec sa raison dans le tableau.

### Preuves (D1)
- `node tools/verif-execution-liens.js` sur la table finale : **43 leçons ouvertes dans Chrome,
  87 liens, 18 mises en garde exigées, 6 témoins négatifs tenus, 3 ancres, 0 problème** (1 min 05 s).
- `node tools/verif-execution-liens-mutations.js` : **8/8 fautes vues**, 0 non applicable
  (15 min 59 s ; table à 88 liens, avant le retrait de `recursion-sans-fin` sur `algo/lecon-08`,
  qui ne touche pas la logique contrôlée).
- `node tools/preuves/execution-ancres.js` : **26/26 exemples ouverts par leur ancre**, dont
  `fonctions`, `statistiques` et `fibonacci`, liés pour la première fois ; 960 pas, 0 requête hors
  `file://`, 0 erreur de console, 0 problème (41,8 s).
- `node --check js/lecon.js`.

---

## D2 · Le décodeur d'erreurs et le bac à sable Git

### Ce que dit la case
« Combien de leçons parlent d'un message d'erreur ou d'une commande Git sans mener à l'outil qui
les fait manipuler ? Mesurer, puis relier. »

### Le mécanisme existant, et ce qu'il a fallu créer
- **Décodeur** : `initDecodeur` (point C4 du V14) pose l'encart « Quand ça casse, ici, c'est
  souvent : » à partir de `js/erreurs-index.js`, index dérivé de `js/erreurs-data.js` qui ne
  connaît qu'**une leçon par erreur** (`lecon.href`), et que seules ces **31 leçons** chargent par
  une balise `<script>`. Relier une autre leçon aurait demandé de toucher son HTML. **Créé, sur le
  modèle du visualiseur** : la table `DECODEUR_AUSSI` (leçon → identifiants d'erreurs) et
  `GABARITS_DECODEUR` (gabarits recopiés) dans `js/lecon.js`. Elle ne joue que si l'index ne
  connaît pas la leçon : les 31 pages citées ne changent pas de comportement.
- **Bac à sable Git** : `initBacGit` (point D3 du V14) pose l'encart sur les 24 leçons du cours
  `git`, et `SCENARIOS_GIT` y ajoute des situations guidées. Rien hors du cours. **Créé** : la
  table `BAC_GIT_AILLEURS`, et une phrase propre à ces leçons, formée de deux listes
  (`BAC_GIT_EXECUTE`, `BAC_GIT_NE_SIMULE_PAS`) : « Il exécute les commandes locales (add, commit,
  status, log, diff, branch, switch, merge, rebase, reset, revert…). En revanche, il n'a pas de
  dépôt distant, et push, pull, clone, blame et bisect n'y sont pas simulés. » Ces leçons
  enseignent aussi `git push` : l'encart ne doit pas laisser croire qu'il s'y essaie.

### La mesure (par le corps : prose et blocs de code, hors `<script>`)
- **Décodeur** : 55 messages connus (15 JavaScript, 16 Python, 14 SQL, 10 Bash). En appliquant à
  chaque leçon **le motif même du décodeur** (sans ses ancres), **43 leçons** écrivent au moins un
  message qu'il reconnaît ; **8** sont parmi les 31 citées, **35 ne mènent pas au décodeur**.
  (À l'inverse, 23 des 31 leçons citées n'écrivent aucun message reconnu : elles enseignent la
  notion, c'est le choix de C4.) Mesure large pour situer : **142 leçons** portent une forme
  « XxxError: » ou « XxxException: », dont une grande part dans des langages que le décodeur ne
  couvre pas (Ruby 12, C# 10, Java 8, PHP 6, Kotlin 5…).
- **Bac à sable** : hors du cours `git`, **15 leçons** écrivent une commande qu'il exécute (les 15
  de `js/git-commandes.js`), et **9** autres n'en écrivent que de non simulées (`clone`, `push`).

### Décisions — décodeur : 13 reliées (25 messages listés), 22 écartées

Règle : relier si le message est **celui de la fiche** (même langage, même moteur) et si la leçon
le montre pour **la cause que la fiche donne**. Un lien vers le mauvais remède vaut moins que pas
de lien. Ce critère a écarté plusieurs leçons où le texte du message est identique :
« No such file or directory » de C, Perl, Lua, Ruby ou tar (fiche Bash), `KeyError` de Ruby
(fiche Python), et des causes que la fiche ne connaît pas (récursion finie mais trop profonde,
espaces autour du `=`, CRLF dans le shebang, `document` dans Node, `require` en ESM, `__slots__`).

| Leçon | Messages reconnus dans le corps | Décision | Raison |
|---|---|---|---|
| `algo/lecon-02` | `js-stack` | ne pas relier | js-stack : récursion finie mais trop profonde (limite du moteur) ; la fiche du décodeur donne une autre cause et un autre remède que la leçon (elle ne connaît que la récursion sans fin) |
| `algo/lecon-08` | `js-undefined-prop`, `js-stack` | **relier** : `js-undefined-prop` | « Le piège de la file naïve » : defiler() lève Cannot read properties of null — ce qui précède le point vaut null, comme le dit la fiche (le js-stack de la même leçon est écarté : récursion trop profonde) |
| `algo/lecon-10` | `js-stack` | ne pas relier | js-stack : arbre dégénéré trop profond ; la fiche du décodeur donne une autre cause et un autre remède que la leçon |
| `algo/lecon-22` | `js-stack` | ne pas relier | js-stack en une parenthèse, et pour une profondeur finie ; la fiche du décodeur donne une autre cause et un autre remède que la leçon |
| `bash/lecon-05` | `sh-command-not-found` | ne pas relier | « commande introuvable » à cause des espaces autour du = ; la fiche du décodeur donne une autre cause et un autre remède que la leçon (PATH, installation) |
| `bash/lecon-06` | `sh-no-such-file`, `sh-unbound` | **relier** : `sh-unbound` | piège : sans test de $#, le script ne s'arrête sur « unbound variable » que sous set -u — la cause et le remède de la fiche (le No such file de la même leçon vient d'un CRLF : écarté) |
| `bash/lecon-10` | `sh-no-such-file` | ne pas relier | No such file : nom coupé à l'espace par xargs ; la fiche du décodeur donne une autre cause et un autre remède que la leçon |
| `bash/lecon-11` | `sh-no-such-file` | ne pas relier | sortie d'un exercice |
| `bash/lecon-12` | `sh-no-such-file`, `sh-fin-de-fichier` | **relier** : `sh-fin-de-fichier` | « Lire avant d'exécuter : bash -n » : unexpected end of file from `for' — bloc resté ouvert, ligne d'ouverture citée, exactement la fiche (le No such file de set -x vient d'une variable non citée : écarté) |
| `c/lecon-02` | `sh-readonly` | ne pas relier | faux positif : « variable en lecture seule » est ici de la prose sur const en C |
| `c/lecon-15` | `sh-no-such-file` | ne pas relier | message d'un autre langage que celui de la fiche (même texte, autre moteur) (perror de C ; fiche Bash) |
| `c/lecon-21` | `sh-no-such-file` | ne pas relier | message d'un autre langage que celui de la fiche (même texte, autre moteur) (perror de C ; fiche Bash) |
| `compilation/lecon-01` | `js-undefined-prop`, `js-parenthese` | **relier** : `js-parenthese`, `js-undefined-prop` | « Ce que ça change quand tu programmes » : les deux messages réellement obtenus avec Node, leur cause dite — erreur d'analyse contre erreur d'exécution |
| `compilation/lecon-02` | `js-not-defined`, `js-undefined-prop`, `js-const`, `js-deja-declaree` | **relier** : `js-not-defined`, `js-undefined-prop`, `js-const`, `js-deja-declaree` | « À quelle étape ton erreur a-t-elle été détectée ? » : un tableau de messages avec leur cause, toutes conformes aux fiches |
| `compilation/lecon-08` | `js-stack` | **relier** : `js-stack` | « La récursion à gauche » : sans garde-fou, la récursion ne s'arrête jamais — la cause de la fiche |
| `compilation/lecon-09` | `js-stack` | ne pas relier | js-stack en une phrase, renvoi à la leçon 8 |
| `compilation/lecon-13` | `py-zero` | ne pas relier | ZeroDivisionError de Python cité pour comparer les langages, dans un cours qui n'écrit pas de Python |
| `csharp/lecon-18` | `sql-colonne` | ne pas relier | no such column de SQLite via EF Core, dans un cas réel : la cause est la migration oubliée, la fiche du décodeur donne une autre cause et un autre remède que la leçon |
| `doc/lecon-02` | `js-not-defined`, `js-undefined-prop`, `js-not-a-function`, `js-const`, `js-not-iterable`, `js-stack`, `js-json-simple`, `js-tofixed` | **relier** : `js-not-defined`, `js-undefined-prop`, `js-not-a-function`, `js-const`, `js-not-iterable`, `js-stack`, `js-json-simple`, `js-tofixed` | section « Quand ça casse : le seul anglais que tu liras sans l'avoir cherché » : 26 erreurs provoquées et leurs messages relevés — lire ces messages est le sujet |
| `doc/lecon-04` | `js-undefined-prop`, `js-not-a-function` | **relier** : `js-undefined-prop`, `js-not-a-function` | « Un message, 6 causes » sur Cannot read properties of undefined, et un exercice : chercher « panierClient.calculerTotal is not a function » |
| `js/lecon-06` | `js-not-defined`, `js-tdz` | **relier** : `js-tdz` | « carre(3) » avant « const carre = … » : Cannot access 'carre' before initialization, la zone morte de la fiche (le ReferenceError … is not defined de la même leçon vient d'une variable locale lue hors de sa fonction : la fiche dit « faute de frappe », écarté) |
| `js/lecon-30` | `js-undefined-prop`, `sh-division` | **relier** : `js-undefined-prop` | section « Lire une erreur » : Cannot read properties of undefined (reading 'texte') — « quelque chose a fourni un undefined », la fiche |
| `linux/lecon-10` | `sh-no-such-file` | ne pas relier | message de tar cité dans un cas réel |
| `lua/lecon-10` | `sh-no-such-file` | ne pas relier | message d'un autre langage que celui de la fiche (même texte, autre moteur) (io.open de Lua ; fiche Bash) |
| `maths/lecon-03` | `js-undefined-prop` | **relier** : `js-undefined-prop` | « Qui colle le plus fort ? » : mesuré, user.bannis.length lève Cannot read properties of undefined, remède user.bannis?.length — la fiche |
| `nodejs/lecon-01` | `js-not-defined` | ne pas relier | document is not defined : la cause est l'environnement (pas de document dans Node), la fiche du décodeur donne une autre cause et un autre remède que la leçon (faute de frappe) |
| `nodejs/lecon-02` | `js-not-defined` | ne pas relier | require is not defined : la cause est le format de module (ESM), la fiche du décodeur donne une autre cause et un autre remède que la leçon |
| `patterns/lecon-04` | `js-stack` | **relier** : `js-stack` | « Composite » : un dossier qui se contient lui-même fait tourner poids() sans fin — la cause de la fiche |
| `perl/lecon-15` | `sh-no-such-file` | ne pas relier | message d'un autre langage que celui de la fiche (même texte, autre moteur) ($! de Perl ; fiche Bash) |
| `python/lecon-30` | `py-attribute` | ne pas relier | AttributeError levé par __slots__ ; la fiche du décodeur donne une autre cause et un autre remède que la leçon (méthode d'un autre langage, append/push) |
| `ruby/lecon-01` | `sh-no-such-file` | ne pas relier | message d'un autre langage que celui de la fiche (même texte, autre moteur) (LoadError de Ruby ; le décodeur ne connaît pas Ruby) |
| `ruby/lecon-05` | `py-key` | ne pas relier | message d'un autre langage que celui de la fiche (même texte, autre moteur) (KeyError de Ruby, « key not found » ; fiche Python) |
| `ruby/lecon-12` | `py-key`, `sh-no-such-file` | ne pas relier | message d'un autre langage que celui de la fiche (même texte, autre moteur) (KeyError et Errno::ENOENT de Ruby) |
| `typescript/lecon-19` | `js-not-a-function`, `js-map-objet` | **relier** : `js-map-objet` | total("bonjour") : articles.reduce is not a function — reduce appelé sur ce qui n'est pas un tableau, la fiche |
| `vscode/lecon-04` | `sh-command-not-found` | ne pas relier | « command not found » après une installation : la cause est le PATH figé à l'ouverture du terminal, la fiche du décodeur donne une autre cause et un autre remède que la leçon |

### Décisions — bac à sable Git : 2 reliées, 13 écartées

| Leçon | Commandes simulées dans le corps | Décision | Raison |
|---|---|---|---|
| `vscode/lecon-04` | status ×1, add ×6, commit ×4, switch ×3 (et non simulées : push) | **relier** | section « La vue Contrôle de source (Git) » : indexer (+) = git add, Valider = git commit, git status, et « Changer de branche » = git switch — quatre commandes que le bac à sable exécute |
| `equipe/lecon-07` | log ×9, commit ×1 (et non simulées : blame, bisect, show) | **relier** | un commit = un changement cohérent, et l'historique se relit avec git log --oneline : faire des commits et lire leur journal, c'est ce que le bac à sable fait manipuler |
| `equipe/lecon-02` | log ×6 (et non simulées : blame, show) | ne pas relier | la leçon interroge l'historique avec git blame et git log -S, que le bac à sable ne simule pas |
| `algo/lecon-21` | diff ×3 | ne pas relier | « git diff » y est une application de l'algorithme de Myers, pas une commande à pratiquer |
| `algo/lecon-14` | diff ×2 | ne pas relier | « git diff » y est une application de la programmation dynamique |
| `equipe/lecon-08` | switch ×1, commit ×1 (et non simulées : push) | ne pas relier | le cycle décrit vit autour du dépôt distant (push, demande de fusion), absent du bac à sable ; les deux commandes locales renvoient à la leçon 7 |
| `go/lecon-18` | commit ×2 | ne pas relier | « git commit » y illustre ce qu'est une sous-commande |
| `markdown/lecon-04` | add ×1, commit ×1 | ne pas relier | contenu d'un bloc de code Markdown d'exemple |
| `markdown/lecon-05` | status ×1, log ×1 | ne pas relier | contenu d'un tableau Markdown d'exercice |
| `markdown/lecon-11` | switch ×2 (et non simulées : clone) | ne pas relier | extrait d'un guide de contribution à rédiger |
| `python/lecon-19` | add ×1, commit ×1 | ne pas relier | « git add, git commit » y illustrent les sous-commandes d'argparse |
| `js/lecon-37` | commit ×1 (et non simulées : push, init) | ne pas relier | « avant chaque git commit » : un crochet de pré-commit, pas la commande |
| `maths/lecon-04` | log ×1 | ne pas relier | git log A..B cité en une phrase comme exemple de différence d'ensembles |
| `rust/lecon-21` | commit ×1 (et non simulées : push) | ne pas relier | « git commit / git push » y illustrent les sous-commandes de clap |
| `rust/lecon-22` | commit ×1 (et non simulées : push) | ne pas relier | idem, sous-commandes de clap |

Ne portent QUE des commandes non simulées, donc non candidates : `api/lecon-12` (push), `cicd/lecon-11` (push), `docker/lecon-05` (clone), `docker/lecon-08` (clone), `docker/lecon-15` (clone), `equipe/lecon-03` (clone), `php/lecon-14` (push), `python/lecon-18` (clone), `vscode/lecon-11` (clone).

Aucune situation guidée n'est reliée à ces deux leçons : aucune ne reprend ce qu'elles expliquent
(`annuler-partage`, le `revert` d'un commit partagé, a été envisagée pour `equipe/lecon-07` et
écartée : la leçon parle de découper ses commits, pas d'en annuler un).

### Après (D2)
| | avant | après |
|---|---:|---:|
| leçons menant au décodeur | **31** | **44** |
| leçons hors index menant au décodeur | 0 | **13** (25 messages listés) |
| leçons menant au bac à sable Git | **24** (cours `git`) | **26** |
| leçons hors du cours `git` menant au bac à sable | 0 | **2** |

### Preuves (D2)
- `node tools/preuves/decodeur-lecons.js` (étendue) : **31/31** leçons citées avec encart juste,
  **13/13** leçons hors index avec les mêmes libellés que la table et un lien qui mène au
  décodeur, **3/3** témoins sans encart ni index, index vidé de force → pas d'encart, **0 requête
  distante** (65 s).
- `node tools/preuves/git-graphe.js` (étendue) : 18 valeurs Chrome ⇄ Node, **0 écart** ; encart
  juste sur `git/lecon-05`, `git/lecon-24`, **`vscode/lecon-04`**, **`equipe/lecon-07`**, et absent
  du témoin `python/lecon-05` ; les deux listes de la phrase confrontées à `js/git-commandes.js`
  (15 commandes : `push`, `pull`, `clone`, `blame`, `bisect` n'y sont pas — vérifié aussi en
  exécutant `git push` et `git blame` dans le modèle : « git push existe, mais ce bac à sable ne
  le simule pas »). ⚠️ **Un premier passage a échoué** en 413 ms sur la page du bac à sable, avant
  la partie que j'ai modifiée : le pilote (`tools/preuves/git-graphe-pilote.js`) lit `#bac-saisie`
  sans attendre que la page l'ait construit. Relancé seul : **code 0** (23 s). Course de chargement
  préexistante, non corrigée ici (hors case).
- `node tools/verif-git-scenarios.js` : 9 situations, 56 parcours, 3 027 comparaisons au vrai git,
  **VERT** — `SCENARIOS_GIT` est toujours lu et toujours égal à `js/git-scenarios.js` (370 s).
- `node tools/preuves/git-scenarios.js` : OK, 26 valeurs, 0 écart ; leçon 07 : 5 liens de
  situation ; témoin `python/lecon-03` sans lien.
- **Épreuve par mutations des contrôles ajoutés** (script de travail
  `scratchpad/d/mutations-d2.js`, hors dépôt, sur le modèle de
  `verif-execution-liens-mutations.js`) : **9/9 fautes vues**, `js/lecon.js` restauré à l'octet
  (7 min 35 s). Fautes : gabarit recopié faux ; identifiant d'erreur inconnu ; leçon déjà dans
  l'index ajoutée à la table ; table jamais consultée ; un seul gabarit affiché ; la phrase dit
  « non simulée » une commande exécutée (`commit`) ; la phrase dit « exécutée » une commande absente
  (`push`) ; table hors cours ignorée ; leçon inexistante dans la table.
- Lecture dans Chrome (réseau coupé) du texte réel des encarts sur `vscode/lecon-04`,
  `js/lecon-30` (décodeur puis visualiseur) et `doc/lecon-02` (8 messages) : conformes.
- `node tools/build-erreurs-index.js` : index identique (31 leçons, 55 renvois) — le fichier de
  données n'est pas touché.

---

## Fichiers touchés
- `js/lecon.js` (fichier nommé par les cases) — D1 : `FAMILLE_JS`, `VISUALISEUR`,
  `TITRES_VISUALISEUR`, texte de la mise en garde ; D2 : `DECODEUR_AUSSI`, `GABARITS_DECODEUR`,
  `initDecodeur`, `BAC_GIT_AILLEURS`, `BAC_GIT_EXECUTE`, `BAC_GIT_NE_SIMULE_PAS`, `initBacGit`.
- `tools/preuves/decodeur-lecons.js` — **partagé**, voir en tête.
- `tools/preuves/git-graphe.js` — **partagé**, voir en tête.
- `en-cours/rapports-v16/d.md` — ce rapport.

## Contrôles finaux
- `node --check js/lecon.js` : OK. Fins de ligne LF, sans BOM, vérifiées octet par octet sur les
  trois fichiers modifiés (0 CR).
- `node tools/verif-html.js` : **1 629 fichiers, 0 grave, 0 attention**.
- `node tools/verif-donnees.js` : **26 contrôles, 0 erreur**, 3 avertissements préexistants et
  étrangers à la case (I17 doublon de QCM en `zig`, I19 pages d'étude écartées, I25 `doc` sans
  encadré d'erreur). Pas d'I18 : aucun texte de leçon n'a changé.
- `node tools/verif-rendu.js` sur les **37 leçons dont le DOM change** (222 mesures : 3 largeurs ×
  2 thèmes) : **2 erreurs, toutes deux sur `js/lecon-34` à 320 px** (+11 px, « cause non
  isolée »), **préexistantes** : en retirant temporairement l'entrée `js/lecon-34` de la table
  (fichier restauré à l'octet), le même débordement de +11 px demeure. 0 avertissement ailleurs ;
  44 mesures « non stabilisées après 3 s », mesurées quand même (prudence de l'outil).
- `node tools/verif.js --rapide` (464 s) : 53 vérificateurs, **2 signalements**, expliqués :
  - **`etudes`** : (a) `pages/etude-inconnu.html` périmée — la mesure du jour donne 6 562,2 Ko de
    blocs de code là où la page publie 6 570,9 Ko. La mesure ne lit que `pages/`, que ma branche
    ne modifie pas : **héritée de `a67de86`** (vraisemblablement des corrections de corps de B4).
    (b) **`moteur-exos` : causé par ma case** — `tools/etudes/moteur-exos/assembler.js` (ligne 60)
    exige que `js/lecon.js` fasse **2 051** lignes ; il en fait **2 192** avec D1 et D2. Les
    extraits que l'étude relit par numéro de ligne (706-715, 717-725, 1441-1455) n'ont pas bougé :
    mes ajouts commencent après la ligne 1 800. À l'orchestrateur de mettre à jour le chiffre
    (constante de l'assembleur et texte de `pages/etude-moteur-exos.html`) **après la fusion de
    toutes les branches** qui touchent `js/lecon.js`.
  - **`etude-6`** : la même ligne de mesure (6 570,9 contre 6 562,2 Ko) de `etude-inconnu` — même
    cause, héritée.

## Ce qui reste, sans arrondir
- **D1** : 32 des « 41 » du F5 restent sans lien, à dessein (raison par leçon ci-dessus). Les
  **exceptions qui remontent la pile** forment un lot cohérent (9 leçons, dans 8 langages) :
  le visualiseur n'a **aucun exemple d'exception**. En écrire un (avec `throw` et `try`, que
  l'interpréteur de `js/interpreteur.js` accepte) toucherait `js/execution-exemples.js` et ses vérificateurs : hors de
  cette case. Les leçons sous les seuils de la mesure par densité n'ont pas été examinées.
- **D1** : la mesure de B6 est **reconstruite**, pas retrouvée ; elle reproduit 42 et contient les
  19 liées et les 3 témoins, ce qui ne prouve pas qu'elle soit identique mot pour mot.
- **D2, décodeur** : trois fiches gagneraient une seconde cause, et rendraient reliables des leçons
  écartées ici : `js-stack` (récursion finie mais trop profonde : `algo/lecon-02`, `algo/lecon-10`,
  `algo/lecon-22` ; la leçon `compilation/lecon-09` dit elle-même « un RangeError a deux causes
  possibles »), `js-not-defined` (la variable existe ailleurs, ou l'environnement ne la fournit
  pas : `js/lecon-06`, `nodejs/lecon-01`, `nodejs/lecon-02`), `sh-command-not-found` (espaces
  autour du `=`, PATH figé du terminal). Cela touche `js/erreurs-data.js` et `tools/verif-erreurs.js` :
  hors de cette case.
- **D2, décodeur** : il ne couvre que 4 langages ; la mesure large compte 142 leçons qui écrivent
  un nom d'erreur, dont beaucoup en Ruby, C#, Java, PHP, Kotlin — aucune ne peut mener à une fiche
  qui n'existe pas.
- **D2, décodeur** : le lien mène à `decodeur.html` sans pré-remplir le message (la page n'a pas
  d'ancre par erreur) ; c'était déjà le cas des 31 leçons citées.
- **D2, Git** : le bac à sable n'a pas de dépôt distant ; les 9 leçons qui n'emploient que `clone`
  ou `push`, et `equipe/lecon-08` (boucle de revue autour d'une demande de fusion), ne peuvent pas
  y mener tant qu'il n'en a pas.
- **Étude n° 2 (`moteur-exos`) à remettre à jour après fusion** : son titre est « Entrer dans un
  fichier de 2051 lignes », et `tools/etudes/moteur-exos/assembler.js` (ligne 60) exige 2 051
  lignes. `js/lecon.js` en fait 2 192 sur ma branche ; le chiffre final dépend des autres
  branches qui touchent ce fichier. Les extraits relus par l'étude n'ont pas bougé.
- Libellé périmé dans `tools/verif.js` (étape `vexlien` : « 19 lecons liees, 53 liens »), voir en
  tête.
- **L'épreuve par mutations de D2** (9/9) est un script de travail hors dépôt : la mettre en
  `tools/` et dans le mode `--mutations` relève de la phase A/F, pas de cette case. Ses neuf fautes
  sont décrites plus haut pour pouvoir la refaire.
- **Deux défauts préexistants rencontrés, non corrigés (hors case)** : le débordement de 11 px de
  `js/lecon-34` à 320 px (`verif-rendu`, « cause non isolée », présent sans mon encart), et la
  course de chargement du pilote de `tools/preuves/git-graphe.js` (échec en 413 ms au premier
  passage, vert au second).
