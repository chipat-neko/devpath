# Rapport V18 — case B8, lot 5 : les cours `ocaml` et `vscode` (copie `b8-ocaml-vscode`, branche `v18/b8-ocaml-vscode`)

Copie de travail `D:\test-claude-b8-ocaml-vscode`, partie de `d86be7b`. Part traitée : les **29 « Cas réel »**
des cours `ocaml` (18, un par leçon) et `vscode` (11, un par leçon). Scripts et pièces dans
`scratchpad/b8-ocaml-vscode/` (ignoré par git) : `cas-ocaml.js` et `cas-vscode.js` (les 29 titres, corps
et intertitres), `appliquer.js` (remplace du titre de l'encadré au `</div></div>` final, plus l'intertitre
`<h2>` collé quand il est donné ; refuse un titre absent ou multiple, refuse tout CR, prouve que les octets
hors des deux zones sont identiques), `dump.js`, `options.js` (options de QCM qui portent un mot),
`godbolt.py` (compile et exécute sur Compiler Explorer), les essais `t-*.ml`, `pdfgrep.py`, les PDF
ouverts (`wasm-pldi17.pdf`, `okasaki.pdf`, `maranget-warn.pdf`, `ocamlgraph-tfp.pdf`, `jsoo3.pdf`,
`mct-paper.pdf`), le journal `Changes-ocaml.txt` et les notes de version de VS Code en Markdown (`rn/`).

**En une phrase** : `node tools/verif-contenu.js --cas-reel` passe de **18 hors de la règle à 0** pour
`ocaml` et de **11 à 0** pour `vscode` ; sur les 29 cas trouvés, **0 était VRAI tel quel** : 4 INEXACTS,
2 INVENTÉS (des « Imagine… »), 1 sujet réel dont le foyer est ailleurs (MapReduce), 22 INVÉRIFIABLES ;
**27 remplacés** par un cas réel daté et sourcé sur la même notion, **2 corrigés sur leur sujet**
(`ocaml/01`, `ocaml/10`), **0 gardé tel quel**, **0 renommé « Scénario »**.

**Commits** (branche `v18/b8-ocaml-vscode`) : `5dd52bc` (ocaml, 18 cas), `880244c` (vscode, 11 cas), puis
le commit de ce rapport.

## Méthode

- Seul l'intérieur de l'encadré change, du `<p class="callout__title">` au `</div></div>` (type `note`,
  icône, structure gardés), plus six intertitres `<h2>Cas réel&nbsp;: …</h2>` collés au-dessus d'un
  encadré d'`ocaml` qui annonçaient l'ancien récit (`lecon-02`, `03`, `05`, `06`, `07`, `08`). Ceux de
  `lecon-01` (« OCaml dans l'industrie ») et `lecon-04` (« le compilateur qui protège des oublis »)
  disent encore le nouveau cas : gardés. Aucun intertitre collé dans `vscode`.
- Forme : titre `Cas réel — sujet (année)`, dernier paragraphe `<p class="cas-reel__source">` daté et lié ;
  aucun lien dans le corps ; `&nbsp;` devant « : ; ? ! » et dans « » ; dans le `<code>`, `<` écrit `&lt;`.
- Longueur du corps (hors titre et source) : environ 110 à 190 mots.
- **Un sujet = un seul cours** : chaque sujet cherché dans `foyers.md`, dans tout `pages/` (texte et URL),
  puis inscrit au fichier commun `b8-reservations.txt` (29 lignes, plus une ligne qui précise l'URL
  archivée d'`ocaml/05`). Sujets **écartés** : Tony Hoare (foyer `csharp/lecon-08`, que l'encadré
  d'`ocaml/06` racontait), MapReduce (raconté et sourcé par `data-eng`, et cité dans `haskell`, `java`,
  `lisp` ; c'était le cas d'`ocaml/07`), l'enquête Stack Overflow 2025 (foyer `stats/lecon-01`), ripgrep
  dans VS Code (`rust/lecon-13`), les secrets laissés dans Git (étude NDSS 2019, `git/lecon-07`), Prettier
  (`equipe/lecon-06`). `doublons.js` : toujours **2** sources partagées entre cours (les deux légitimes).
- **Comportements rejoués** (Compiler Explorer, compilateurs `ocamlopt` 5.0.0, 5.1.0 et 5.5.2, exécution
  comprise) :
  - un `match` non exhaustif (`let nilp = function [] -> true`) : « Warning 8 [partial-match] … _::_ »,
    code de compilation 0, le programme s'exécute (5.5.2) — l'ancien encadré d'`ocaml/04` disait que le
    compilateur « refuse de compiler » ;
  - le pipeline `String.trim |> String.lowercase_ascii |> String.split_on_char ' '` d'`ocaml/02` donne
    `bonjour;le;monde` (5.5.2) ;
  - `1 :: liste` partage physiquement sa queue (`List.tl nouvelle == liste` vaut `true`) ;
  - l'exemple du manuel (pile limitée à 20 000 mots, liste d'un million d'éléments) : le `map` naïf
    déborde partout ; `List.map` **déborde en 5.0.0 et passe en 5.1.0** et 5.5.2 ;
  - `s.[0] <- 'x'` sur une `string` : refusé (« strings are immutable … Did you mean to use Bytes.set? ») ;
  - le `Compact_array` GADT de Minsky (réécrit avec `Bytes`) compile et s'exécute ; la version à variant
    ordinaire refuse un tableau d'entiers (« The constant 1 has type int but … char ») ;
  - `let*` sur les options (exemple du manuel) : après un premier `None`, la seconde recherche n'est pas
    lancée (compteur d'appels à 1) ;
  - `Set.Make (Int)` : `S.of_list [1;2;3]` et `S.of_list [2;1;3]` sont `S.equal` mais pas `=` (même
    résultat que l'exemple de Minsky avec Core).
- Mots d'options de QCM : `lexique-diff.js` a signalé 22 écarts (ocaml) puis 7 (vscode) au premier jet.
  Ramenés à **0 pour ocaml** en remettant le mot dans une phrase exacte de l'encadré (« imbriquées »,
  « mémoire », « successives », « ajoute », « devient », « représente », « disparaît », « comparaison »,
  « système », « thread », « connexion », « boucle », « d'événements », « partout », « complet »,
  « effort », « exemple », « relire ») ou en retirant le mot entré (« écrite », « option »,
  « définition », « l'exception »). Pour vscode, **2 écarts restent, sur `lecon-10`** : « source » entre
  par la classe `cas-reel__source` (inévitable ; le distracteur « Il chiffre le code source » le porte) ;
  pour égaliser, « l'auto-complétion » (mot d'un autre distracteur) est entré dans une phrase exacte de
  la source (« Workspace Extensions … provide IntelliSense (completions) »). Cliquets QCM verts.

## Cas par cas — `ocaml`

| Cas | État trouvé | Action | Nouveau titre | Sources ouvertes |
|---|---|---|---|---|
| `pages/ocaml/lecon-01.html#1` | INVÉRIFIABLE en partie — produit nommé : VPNKit en OCaml et le premier compilateur de Rust en OCaml sont exacts, mais la raison prêtée à Jane Street (« si ça compile, ça marche ») et « la quasi-totalité de son infrastructure » ne sont dans aucune source | corrigé : recentré sur VPNKit (Jane Street et Rust retirés, gardés pour `05` et `10`) | Cas réel — VPNKit, le réseau de Docker for Mac et Windows (2016) | https://www.docker.com/blog/docker-unikernels-open-source/ |
| `pages/ocaml/lecon-02.html#1` | INVÉRIFIABLE — récit d'usage (« Tu reçois… ») ; la filiation « repris tel quel par F# » n'est pas sourcée (OCaml n'a mis `|>` dans sa bibliothèque standard qu'en 4.01, 2013) | remplacé par : OCaml 4.01 ajoute `|>` et `@@` à `Pervasives` (le bloc de code, rejoué, est gardé) | Cas réel — OCaml 4.01 adopte l'opérateur \|> (2013) | https://raw.githubusercontent.com/ocaml/ocaml/trunk/Changes (4.01.0) ; https://raw.githubusercontent.com/ocaml/ocaml/4.01.0/stdlib/pervasives.mli ; https://raw.githubusercontent.com/ocaml/ocaml/trunk/stdlib/stdlib.mli ; Compiler Explorer |
| `pages/ocaml/lecon-03.html#1` | INVENTÉ — « Imagine l'historique d'un éditeur… » ; Redux et Clojure cités sans source | remplacé par : la thèse d'Okasaki, structures persistantes et éphémères | Cas réel — Chris Okasaki et les structures persistantes (1996) | https://www.cs.cmu.edu/~rwh/students/okasaki.pdf (chap. 1, p. 2 du texte) ; Compiler Explorer |
| `pages/ocaml/lecon-04.html#1` | INEXACT (B2, confirmé) — « le compilateur refuse de compiler » : c'est l'avertissement 8, et `-warn-error -a` par défaut ; « c'est ce filet qui a poussé Rust » introuvable. Le **corps** de la leçon dit bien « il t'avertit » : rien à signaler | remplacé par : Luc Maranget, « Warnings for pattern matching », l'algorithme d'exhaustivité du compilateur OCaml, dont rustc s'inspire | Cas réel — Luc Maranget et l'avertissement d'exhaustivité (2007) | http://moscova.inria.fr/~maranget/papers/warn/warn.pdf (prépublication ; JFP 17(3), 2007, d'après https://api.openalex.org) ; https://ocaml.org/manual/latest/comp.html ; https://raw.githubusercontent.com/rust-lang/rust/main/compiler/rustc_pattern_analysis/src/usefulness.rs ; Compiler Explorer |
| `pages/ocaml/lecon-05.html#1` | INEXACT — « OCaml … propulse Flow » : Flow est désormais écrit en Rust (README) ; le reste (arbre de syntaxe) est un usage général | remplacé par : l'état de connexion de Jane Street réécrit en variants (« rendre l'invalide impossible ») | Cas réel — Jane Street et l'état d'une connexion (2011) | https://web.archive.org/web/20221222101532/https://queue.acm.org/detail.cfm?id=2038036 (l'original renvoie 403 / un défi Cloudflare) ; https://blog.janestreet.com/effective-ml-revisited/ (lu, non cité : code seul) |
| `pages/ocaml/lecon-06.html#1` | INEXACT — Tony Hoare, sujet du foyer `csharp/lecon-08` ; « le compilateur refuse le code qui oublie le cas None » (c'est un avertissement) ; « Jane Street a bâti… » non sourcé | remplacé par : les fonctions `_opt` (pull request 885, OCaml 4.05) | Cas réel — OCaml 4.05 et les fonctions _opt (2017) | https://github.com/ocaml/ocaml/pull/885 ; https://api.github.com/repos/ocaml/ocaml/pulls/885/files ; https://raw.githubusercontent.com/ocaml/ocaml/4.05.0/stdlib/list.mli ; https://raw.githubusercontent.com/ocaml/ocaml/4.05.0/stdlib/hashtbl.mli ; Changes (4.05.0) |
| `pages/ocaml/lecon-07.html#1` | sujet réel, foyer ailleurs — MapReduce (raconté et sourcé par `data-eng`) ; non revérifié | remplacé par : `List.map` devient récursive terminale (TMC, 4.14 puis 5.1) | Cas réel — OCaml 5.1 rend List.map récursive terminale (2023) | https://ocaml.org/manual/latest/tail_mod_cons.html ; Changes (4.14.0, 5.1.0) ; Compiler Explorer (5.0.0, 5.1.0, 5.5.2) |
| `pages/ocaml/lecon-08.html#1` | INVÉRIFIABLE — usage général de `Map.Make` ; « a inspiré le système de modules de Scala » et l'usage chez Jane Street non sourcés | remplacé par : OCamlgraph, 19 structures de graphe en 1 000 lignes grâce aux foncteurs | Cas réel — OCamlgraph, une bibliothèque bâtie sur les foncteurs (2007) | https://usr.lmf.cnrs.fr/~jcf/ftp/publis/ocamlgraph-tfp-8.pdf (copie de l'auteur ; TFP 2007, p. 124-140, d'après OpenAlex) |
| `pages/ocaml/lecon-09.html#1` | INVÉRIFIABLE — usage général ; « chez Jane Street, c'est exactement l'approche » non sourcé | remplacé par : séparation `string` / `bytes` (4.02, `-safe-string`) puis mode par défaut (4.06) | Cas réel — OCaml sépare string et bytes (2014) | Changes (4.02.0, 4.06.0 n° 1252) ; Compiler Explorer |
| `pages/ocaml/lecon-10.html#1` | INEXACT (B2, confirmé) — « Aujourd'hui encore, Flow … repose sur OCaml » (Flow est écrit en Rust) ; « Coq » s'appelle The Rocq Prover ; le premier compilateur de Rust en OCaml est exact | corrigé : sujet gardé (Rust), daté et sourcé ; Flow et Coq retirés | Cas réel — Rust est né en OCaml (2011) | https://pcwalton.blogspot.com/2011/04/road-ahead-for-rust.html ; https://rustc-dev-guide.rust-lang.org/building/bootstrapping/intro.html ; https://raw.githubusercontent.com/facebook/flow/main/README.md (vérification de l'inexactitude) |
| `pages/ocaml/lecon-11.html#1` | INVÉRIFIABLE — usage général (Caqti, « DSL maison ») | remplacé par : « Why GADTs matter for performance » (tableau compact, `Bytes : bytes -> char t`) | Cas réel — Jane Street et les GADT au service des performances (2015) | https://blog.janestreet.com/why-gadts-matter-for-performance/ ; Compiler Explorer |
| `pages/ocaml/lecon-12.html#1` | INVÉRIFIABLE — récit anonyme (« un serveur web OCaml ») ; MirageOS cité sans source | remplacé par : OCaml 5.0, parallélisme à mémoire partagée et gestionnaires d'effets | Cas réel — OCaml 5.0 passe au multicœur (2022) | https://ocaml.org/releases/5.0.0 ; https://ocaml.org/manual/latest/parallelism.html ; Changes (5.0.0, n° 10831) |
| `pages/ocaml/lecon-13.html#1` | INVÉRIFIABLE — usage général (calculatrice, tableur…) ; Rust répété | remplacé par : l'interpréteur de référence de WebAssembly, écrit en OCaml | Cas réel — l'interpréteur de référence de WebAssembly (2017) | https://people.mpi-sws.org/~rossberg/papers/Haas,%20Rossberg,%20Schuff,%20Titzer,%20Gohman,%20Wagner,%20Zakai,%20Bastien,%20Holman%20-%20Bringing%20the%20Web%20up%20to%20Speed%20with%20WebAssembly.pdf (copie d'un auteur, PLDI '17, p. 12) ; https://github.com/WebAssembly/spec/blob/main/interpreter/README.md |
| `pages/ocaml/lecon-14.html#1` | INVÉRIFIABLE — js_of_ocaml « chez Ahrefs », LablGTK, Jane Street : aucune source | remplacé par : l'article de js_of_ocaml, les objets JavaScript codés par des types objets OCaml | Cas réel — js_of_ocaml décrit le JavaScript par des types objets (2014) | https://web.archive.org/web/20220119104513/https://www.irif.fr/~vouillon//publi/js_of_ocaml.pdf (copie des auteurs ; l'original IRIF renvoie désormais une page wiki) ; métadonnées SPE 44(8), 2014 : https://api.openalex.org/works/doi:10.1002/spe.2187 |
| `pages/ocaml/lecon-15.html#1` | INVENTÉ — « Imagine analyser un journal de serveur de 10 Go » | remplacé par : le module `Seq` (pull request 1002, OCaml 4.07, plus de 40 fonctions en 4.14) | Cas réel — le module Seq entre dans la bibliothèque standard (2018) | https://github.com/ocaml/ocaml/pull/1002 ; Changes (4.07.0 n° 1002, 4.14.0 n° 10583) |
| `pages/ocaml/lecon-16.html#1` | INVÉRIFIABLE — usage général (comptage de fréquences) ; « beaucoup à Jane Street » non sourcé | remplacé par : « The perils of polymorphic compare », deux ensembles égaux mais pas pour `=` | Cas réel — deux ensembles égaux, mais pas pour = (2008) | https://blog.janestreet.com/the-perils-of-polymorphic-compare/ ; Compiler Explorer |
| `pages/ocaml/lecon-17.html#1` | INVÉRIFIABLE — usage général (« railway oriented programming » sans auteur ni date ; `ppx_let` chez Jane Street non sourcé) | remplacé par : OCaml 4.08 introduit les opérateurs de liaison et les modules `Result`, `Option` | Cas réel — OCaml 4.08 introduit let* (2019) | Changes (4.08.0 n° 1947, 1940, 1956) ; https://ocaml.org/manual/latest/bindingops.html ; Compiler Explorer |
| `pages/ocaml/lecon-18.html#1` | INVÉRIFIABLE — usage général du test par propriété | remplacé par : multicoretests (Lin, STM sur QCheck) et les problèmes trouvés avant OCaml 5.0 | Cas réel — QCheck à l'épreuve d'OCaml 5 (2022) | https://raw.githubusercontent.com/ocaml-multicore/multicoretests/main/doc/paper.pdf ; https://ocaml.org/p/qcheck-lin/0.9/README.html ; https://raw.githubusercontent.com/ocaml-multicore/multicoretests/main/README.md |

## Cas par cas — `vscode`

Toutes les notes de version citées ont été ouvertes sur `code.visualstudio.com/updates/v1_NN` (mot-clé du
cas retrouvé dans chaque page) et lues dans leur source Markdown (`microsoft/vscode-docs`, `release-notes/`).

| Cas | État trouvé | Action | Nouveau titre | Sources ouvertes |
|---|---|---|---|---|
| `pages/vscode/lecon-01.html#1` | INVÉRIFIABLE tel quel — « l'enquête annuelle de Stack Overflow » sans année, « près de trois sur quatre » non daté ; l'édition 2025 est le foyer de `stats/lecon-01` | remplacé par : l'annonce de VS Code 1.0 | Cas réel — Visual Studio Code 1.0 (2016) | https://code.visualstudio.com/blogs/2016/04/14/vscode-1.0 |
| `pages/vscode/lecon-02.html#1` | INVÉRIFIABLE — récit anonyme (« 200 identifiants » d'un tableur) | remplacé par : le Language Server Protocol, derrière les diagnostics et « Aller à la définition » | Cas réel — le Language Server Protocol (2016) | https://code.visualstudio.com/blogs/2016/06/27/common-language-protocol |
| `pages/vscode/lecon-03.html#1` | INVÉRIFIABLE — récit anonyme (« une équipe », 60 fichiers) | remplacé par : Preserve Case (1.37), puis dans la recherche globale (1.38) | Cas réel — VS Code préserve la casse en remplaçant (2019) | https://code.visualstudio.com/updates/v1_37 ; https://code.visualstudio.com/updates/v1_38 |
| `pages/vscode/lecon-04.html#1` | INVÉRIFIABLE — récit anonyme (« un développeur », clé d'API) | remplacé par : l'éditeur de fusion à trois volets (1.68 expérimental, 1.69 sur réglage, 1.70 par défaut) | Cas réel — l'éditeur de fusion à trois volets de VS Code (2022) | https://code.visualstudio.com/updates/v1_68 ; https://code.visualstudio.com/updates/v1_69 ; https://code.visualstudio.com/updates/v1_70 |
| `pages/vscode/lecon-05.html#1` | INVÉRIFIABLE — récit anonyme (« une équipe ») | remplacé par : les extensions recommandées de l'espace de travail, `.vscode/extensions.json` | Cas réel — VS Code 1.6 et les extensions recommandées (2016) | https://code.visualstudio.com/updates/v1_6 |
| `pages/vscode/lecon-06.html#1` | INVÉRIFIABLE — récit anonyme (« un développeur », bug une fois sur mille) | remplacé par : les Logpoints | Cas réel — VS Code 1.22 et les Logpoints (2018) | https://code.visualstudio.com/updates/v1_22 |
| `pages/vscode/lecon-07.html#1` | INVÉRIFIABLE — récit anonyme (« une développeuse », 40 villes) | remplacé par : le mode de sélection en colonne | Cas réel — VS Code 1.43 et le mode de sélection en colonne (2020) | https://code.visualstudio.com/updates/v1_43 ; https://raw.githubusercontent.com/microsoft/vscode-docs/main/docs/editing/codebasics.md (lu, non cité) |
| `pages/vscode/lecon-08.html#1` | INVÉRIFIABLE (B2, confirmé) — récit anonyme (« une équipe front-end ») ; détails techniques exacts | remplacé par : les snippets de projet `*.code-snippets` et les préfixes multiples (1.28) ; variables de date (1.20) | Cas réel — VS Code 1.28 et les snippets de projet (2018) | https://code.visualstudio.com/updates/v1_28 ; https://code.visualstudio.com/updates/v1_20 |
| `pages/vscode/lecon-09.html#1` | INVÉRIFIABLE — récit anonyme (« un projet d'équipe ») | remplacé par : `"dependsOrder": "sequence"` (et `autoDetect`) | Cas réel — VS Code 1.36 enchaîne les tâches dans l'ordre (2019) | https://code.visualstudio.com/updates/v1_36 |
| `pages/vscode/lecon-10.html#1` | INVÉRIFIABLE — récit anonyme (« une équipe accueille une développeuse ») | remplacé par : l'annonce de Remote Development (WSL, SSH, conteneurs, `devcontainer.json`) | Cas réel — VS Code Remote Development (2019) | https://code.visualstudio.com/blogs/2019/05/02/remote-development ; https://code.visualstudio.com/updates/v1_35 |
| `pages/vscode/lecon-11.html#1` | INVÉRIFIABLE — récit anonyme (« une développeuse rejoint une équipe ») | remplacé par : Workspace Trust et le mode restreint | Cas réel — VS Code 1.57 et la confiance dans l'espace de travail (2021) | https://code.visualstudio.com/updates/v1_57 |

## Décomptes

| | ocaml | vscode | total |
|---|---:|---:|---:|
| « Cas réel » lus | 18 | 11 | **29** |
| VRAI tel quel | 0 | 0 | 0 |
| INEXACT | 4 (`04`, `05`, `06`, `10`) | 0 | 4 |
| INVENTÉ | 2 (`03`, `15`) | 0 | 2 |
| foyer ailleurs | 1 (`07`, MapReduce) | 0 | 1 |
| INVÉRIFIABLE | 11 | 11 | 22 |
| remplacés | 16 | 11 | **27** |
| corrigés sur leur sujet | 2 (`01`, `10`) | 0 | **2** |
| renommés « Scénario » | 0 | 0 | 0 |
| hors de la règle, avant → après | 18 → 0 | 11 → 0 | 29 → 0 |

## Contrôles (sur l'état commité, avant le commit de ce rapport)

| Contrôle | Code |
|---|---|
| `node tools/verif-contenu.js --cas-reel --cours=ocaml` | **0** (18 conformes) |
| `node tools/verif-contenu.js --cas-reel --cours=vscode` | **0** (11 conformes) |
| `node tools/verif-contenu.js --strict` | **0** |
| `node tools/verif-html.js` | **0** |
| `node tools/verif-domaines-interdits.js` | **0** |
| `node tools/verif-qcm-lexique.js` | **0** |
| `node tools/verif-qcm-biais.js` | **0** |
| `node tools/cas-reels/lots/lexique-diff.js … d86be7b` | 2 écarts, tous deux sur `vscode/lecon-10` (expliqués plus haut) ; 0 sur les 28 autres pages |
| `node tools/cas-reels/lots/controle-branche.js … d86be7b` | OK : 0 CR, 0 domaine interdit, octets identiques hors « Cas réel », types gardés, signatures |
| `node tools/cas-reels/lots/doublons.js` | 2 sources partagées (les deux légitimes, inchangées) |
| `node tools/verif.js --rapide` | voir ci-dessous |

`node tools/verif.js --rapide` (lancé **une fois**, à la fin, sur la machine partagée) : code **1**,
5 étapes rouges sur 54, toutes expliquées :

- `donnees` — **I18** seul (2 lignes d'erreur du même invariant) : `search-index.js` publié diverge du
  contenu régénéré (+3 369 octets). Toléré : l'orchestrateur régénère après la fusion.
- `doc-ref` — « nombre de leçons qui renvoient à un document = 116 » et « nombre de cours concernés = 42 » :
  les compteurs du cours `doc`, mesurés sur tout le site, bougent avec les nouvelles lignes de source.
  Toléré (consigne).
- `doc-rec` — « 898 citent la source de leur « Cas réel » » (le nombre monte avec les 29 sources) et
  « mentions de Stack Overflow … 8 leçons » (l'ancien encadré de `vscode/01` citait l'enquête de Stack
  Overflow). Toléré (consigne).
- `normatf` — « leçons parlant de la spécification = 40 » : `ocaml/13` dit « spécification exécutable » et
  « spécification formelle », mots de sa source (PLDI 2017). Toléré par la consigne (« doc-ref, doc-rec,
  normatf » bougent avec ces mots) ; rien n'a été déformé pour le garder vert.
- `caract` — **faux rouge** : le processus fils `verif-controles.js` a écrit son bilan complet
  (« 0 accident(s), 2 emploi(s) voulu(s) », dans `scratchpad/.verif-journal/2026-11-17T07-10-36/`)
  puis **n'a jamais rendu la main** (0,4 s de processeur en 20 minutes ; trois autres copies `b8-*`
  avaient leur propre `verif-controles.js` bloqué au même moment). Arrêté à la main après 1 250 s ;
  relancé seul, `node tools/verif-controles.js` sort en **0** en quelques secondes.

Les 49 autres étapes sont OK, dont `source`, `contenu`, `exemple`, `qcmbiai`, `qcmlexi` et les `rj-*`.

## Ce qui reste ouvert

- **Hors encadré, non corrigé** : le corps d'`ocaml/lecon-10` (section « Où OCaml s'emploie ») dit encore
  « Flow et Hack de Meta sont en OCaml » et cite « la vérification formelle (Coq) » ; or Flow est
  désormais écrit en Rust (son README) et Coq s'appelle The Rocq Prover. Le corps d'`ocaml/lecon-04`, lui,
  dit bien « il t'avertit » : la faute de B2 n'était que dans l'encadré.
- Trois encadrés d'`ocaml` s'appuient sur des textes de Yaron Minsky (Jane Street) : `05` (ACM Queue, 2011),
  `11` (blog, 2015), `16` (blog, 2008). Trois documents et trois sujets distincts ; à relire si
  l'orchestrateur préfère moins de Jane Street dans le cours.
- Phrases de liaison à la leçon, qui ne viennent pas des sources mais du cours : `ocaml/12` (« Lwt
  entrelace dans sa boucle d'événements les attentes de chaque connexion ») ; `ocaml/09` et `ocaml/10`
  (dernière phrase) ; `vscode/09` et `vscode/11` (première et dernière phrases). Les affirmations
  techniques rejouées sont dites « rejoué … sur Compiler Explorer » dans le texte et dans la source.
- Dates à surveiller à la contre-relecture : `ocaml/12` (journal : 15 décembre 2022 ; page ocaml.org :
  publiée le 16 décembre 2022 — le corps dit « décembre 2022 ») ; `ocaml/14` (article en ligne le
  26 février 2013, numéro 44(8) de 2014 — titre daté 2014) ; `ocaml/04` (JFP 17(3), en ligne en
  février 2007, d'après OpenAlex ; PDF lu : la prépublication de l'auteur). Pour `vscode`, le mois est
  celui que porte chaque page de notes de version (« July 2019 release »…).
- Registre `foyers.md` : à compléter par l'orchestrateur avec les 29 sujets du fichier de réservations
  (`foyers-ajouter.js`).
