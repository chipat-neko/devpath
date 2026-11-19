# C4 — wasm, 96,0 % → 26,0 %

Case C4 du chantier V18 (phase C), un seul agent, copie `D:\test-claude-c4-wasm`, branche `v18/c4-wasm`,
partie de `8d163bf`. Aucun fichier du dépôt principal `D:\test-claude\` n'a été modifié.

**Atteintes à l'intouchable : aucune** (`node tools/mesure-qcm-intouchable.js wasm 8d163bf8` :
« 50 questions, 150 distracteurs, 149 réécrits. Aucune atteinte : q / correct / explain / bonne réponse
intacts »). Aucune bonne réponse ni explication n'a été prouvée fausse ; quatre sont **signalées** plus bas
(une datée, prouvée par exécution, laissée telle quelle comme le veut la consigne).

## Avant / après

| indice | avant (`8d163bf`) | après | commande |
|---|---:|---:|---|
| la plus longue | **96,0 %** | **26,0 %** | `node tools/mesure-biais-qcm.js --seul=wasm` |
| pire stratégie des 44 | 96,0 % (la plus longue) | **32,0 % (la plus dense)** | idem |
| la plus détaillée | 82,5 % | 25,0 % (couverture 0) | idem |
| incise / RESTREINDRE à la parenthèse | 49,5 % / 49,5 % | 25,0 % / 25,0 % | idem |
| ponctuation forte (seule / RESTREINDRE) | 54,5 % / 55,0 % | 25,0 % / 25,0 % | idem |
| mot technique exclusif | 50,0 % | 25,0 % (couverture 0) | idem |
| la moins bavarde | 1,2 % | **31,7 %** | idem |
| la plus dense | 21,0 % | **32,0 %** | idem |
| rangs de la bonne réponse | 48 / 1 / 1 / 0 | **13 / 13 / 12 / 12** | `node tools/plan-rangs-qcm.js wasm` |
| lexique (exploitables / retournées / à mettre en forme) | 45 / 37 / 50 | **0 / 0 / 0** | `node tools/mesure-lexique-qcm.js --liste=wasm` |
| intrus lexical DÉFAUT / EXCÈS (direct, inverse, sûres) | 27,2 / 23,8 / 2 — 24,7 / 25,0 / 0 | 25,0 / 25,0 / 0 — 25,0 / 25,0 / 0 | `node tools/mesure-mot-question.js wasm` |
| mot fétiche | 3 alertes (`module` 35,0, `calcul` 32,2, `passe` 30,5 %) | **0 alerte** (pire : `accès` 29,5 % sur 5 questions, sous la fenêtre ; `chaque` 0 bonne / 14 distracteurs, ÉCARTER 27,5 %) | `node tools/mesure-mot-fetiche.js wasm` |
| tics de lot | 15 | **0** | `node tools/mesure-tics-lot.js wasm --exemples` |
| biais inverse | 4 alertes | **0** (pire : la QUATRIÈME plus longue 25,2 %) | `node tools/mesure-biais-inverse.js --toutes wasm` |
| point interne | bonne réponse seule en deux phrases (lecon-05 q1) | les quatre options en deux phrases | `node tools/mesure-biais-qcm.js --seul=wasm` |

Toutes les stratégies sauf six sont à **25,0 % exact** (couverture nulle). Les six autres : la plus longue
26,0 %, la DEUXIÈME 26,0 %, la TROISIÈME et la QUATRIÈME 24,0 %, ECARTER la plus courte 25,7 %, et les
deux de densité ci-dessous.

## Ce qui a été écrit

- **149 distracteurs réécrits sur 150** (le seul gardé : `u8, u16, u32, u64`, lecon-07 q3).
  5 054 → 13 504 caractères, **8 450 caractères écrits en plus**.
- Ordre : consigne `scratchpad/CONSIGNE-WASM.md`, corps corrigé avant d'écrire, puis cinq lots (01-03,
  04-06, 07-08, 09-10, 11), un lot de dosage, un lot de relecture ; un commit par lot.
- Banc d'écriture `scratchpad/c4-wasm/sonde/atelier.js` (hors git) : les 44 stratégies CHARGÉES depuis
  `tools/mesure-biais-qcm.js`, plus les copies exactes du lexique (k, w), de l'intrus lexical, des motifs
  de `mesure-tics-lot`, du mot fétiche et du biais inverse. Il reproduit au dixième près la mesure de
  départ (vérifié avant la vague). `pose.js` et `controle.js` sont ceux de `scratchpad/vue-sonde`
  repointés ; `pose.js` réécrit les blocs à l'octet près (vérifié sur les 11 leçons à vide).
- Cibles de rang : celles de `plan-rangs-qcm`, sauf un échange (lecon-05 q1 → rang 0, lecon-05 q2 →
  rang 2) pour ne pas écrire trois distracteurs de plus de 196 caractères ; répartition gardée 13/13/12/12.
- Contraintes tenues question par question : rang et bande 70-130 %, mêmes marques dans les quatre
  options (`;`, `:`, parenthèse, glose finale, `/`, « », point interne, tiret, majuscule d'emphase),
  même nombre de `, : ;`, même écho de l'énoncé, attaque et casse équilibrées, absolus / prudents /
  négations à quatre ou zéro, mots de 9 lettres et plus à égalité, aucun mot porté par exactement trois
  options, **k et w égaux** (jusqu'à k = 6 sur lecon-11 q13 et q14, k = 5 et w = 10 sur lecon-05 q1).

## Fautes de fond trouvées et corrigées (corps des leçons)

Chaque correction a été posée par `scratchpad/c4-wasm/sonde/corps.js` (remplacement littéral, refus si
le texte touche un encadré « Cas réel » ou casse un bloc JSON) ; `node tools/verif-contenu.js` : code 0.

1. **lecon-10 — `./cible/wasm32-wasip1/release/outil.wasm`** : cargo écrit dans `target/`, pas `cible/`
   (`cargo metadata` sur un projet de test : `target_directory = …\filtre\target`). Corrigé en `./target/…`.
2. **lecon-11 — `cargo build --target wasm32-wasi`** (5 endroits : bloc de code, étape 3, plan de
   référence, tableau, solution de l'exercice 3) : la cible n'existe plus.
   rustc 1.99.1 : `error loading target specification: could not find specification for target
   "wasm32-wasi"` ; `rustc --print target-list` donne `wasm32-wasip1`, `wasip2`, `wasip3`. Passé à
   `wasm32-wasip1`, comme la leçon 10.
3. **lecon-08 — « le ramasse-miettes de JS ignore cette mémoire : sans free(), elle fuit » ;
   « c.free() est le seul moyen de rendre la mémoire » ; « JavaScript ne le fera pas tout seul »**
   (6 endroits : aria-label, texte du schéma, légende, encadré, indice d'exercice, solution de
   l'exercice 2). Depuis **wasm-bindgen 0.2.91** (CHANGELOG : « Deprecate `--weak-refs` … in favor of
   automatic run-time detection »), la colle générée confie chaque classe exportée à un
   `FinalizationRegistry` (`crates/cli-support/src/js/mod.rs` : `new FinalizationRegistry(...)`) : le
   ramasse-miettes peut libérer l'objet, mais à un moment imprévisible, voire jamais. Réécrit :
   `free()` est le seul moyen **sûr** ; sans lui, libération tardive ou absente (et absente avec une
   colle ancienne). **Non exécuté** : pas de cible wasm32 installée pour Rust (on ne touche pas à la
   chaîne d'outils globale) ; vérifié par la source et le journal des changements.
4. **lecon-06 — « Cette dernière leçon relie le tout »** : ce n'est pas la dernière (11 leçons, module 03).
   Devenu « Cette leçon ».
5. **lecon-06 — la figure promettait « Sur un gros calcul, la barre Wasm reste bien plus courte »**
   (et l'aria-label « Wasm gagne largement »). Mesuré sur le code de la leçon à l'identique
   (`premiers.c` compilé par Zig 0.14.1 en wasm32, `-O ReleaseFast`) : 78 498 premiers sous 10⁶ des deux
   côtés, **Wasm ≈ 81 ms, JS 79 à 92 ms** sous Node 26 et sous Chrome 157. La légende dit maintenant que
   sur ce compteur un moteur JS récent fait souvent jeu égal et que seule la mesure tranche.

## Bonnes réponses et explications signalées, NON touchées

- **lecon-11 q4 (bonne réponse) : « En le recompilant pour wasm32-wasi … »** — datée : la cible a
  disparu (rustc 1.99.1, voir ci-dessus). Le corps dit désormais `wasm32-wasip1`. À corriger en C24
  (même mot, `wasm32-wasip1`, +2 caractères) si l'orchestrateur l'accepte.
- **lecon-10 q4 (bonne réponse) : « Envoy, Shopify Functions, Compute@Edge »** — le nom commercial de
  Fastly a changé (« Compute ») ; non vérifié ici sur une source, donc seulement signalé.
- **lecon-04 q1 (explain) : « ils passent sans conversion »** — exécuté : un `i32` reçoit `ToInt32`
  (`id32(3.7)` = 3, `id32(2**32+5)` = 5) et un `i64` exige un BigInt (`id64(5)` : `TypeError: Cannot
  convert 5 to a BigInt`). Simplification discutable, pas une erreur de fond.
- **lecon-07 q3 (explain) : « Wasm ne connaît que ces quatre types »** — la spécification appelle bien
  ces quatre-là les *types numériques*, mais un `v128` (SIMD) s'assemble aussi (wabt). Discutable.
- lecon-06 : la page charge `premiers.wasm` produit par `emcc … -o premiers.js` sans objet d'imports ;
  selon ce qu'Emscripten importe, l'instanciation peut exiger la colle. **Non exécuté** (pas d'emsdk).

Les encadrés « Cas réel » n'ont pas été touchés ; aucun QCM ne les contredit.

## Ce qui a été exécuté (preuves dans `scratchpad/c4-wasm/preuves/`, sorties `.out`)

- `p1-wat.js` (Node 26 + wabt 1.0.37, installé dans `D:\outils-c\wasm\`) : le WAT des leçons 02 et 07
  (`additionner(20,22)` = 42, `add(3,4)` = 7), `Object.keys(exports)` = `["add"]`, export renommé,
  forme imbriquée = forme à plat (binaires identiques), rejet à la validation d'un `i32.add` sur un
  `f64` (`CompileError … expected type i32, found local.get of type f64`), import manquant
  (`TypeError … Imports argument must be present`), `(memory 1)` = 65 536 octets.
- `p2-api.js` : `instantiateStreaming` rend `{module, instance}` ; sans déstructurer, `TypeError` ;
  MIME `application/octet-stream` refusé, repli `arrayBuffer()` + `instantiate` accepté ; conversions
  d'arguments (chaîne → 0, objet → 0, i64 → BigInt) ; `sommer(0,4)` = 11 ; vue détachée après
  `memory.grow` (longueur 0, lecture `undefined`, écriture ignorée sans erreur en mode strict) ;
  transfert d'un tampon de 48 000 000 octets (expéditeur à 0) ; worker sans `document` ni `window`.
- `p3-premiers.js` : le capstone de la leçon 06 (voir faute 5).
- `p5-wasi-wat.js` (`node:wasi`, WASI preview 1) : sans dossier accordé, `path_open` → errno 8
  (EBADF) ; avec, lecture du fichier ; sortie par `../` → errno 76 (ENOTCAPABLE). (`p4-wasi.js`, en C
  via wasi-libc de Zig, bute sur un comportement de `fopen` sous Windows : laissé de côté.)
- `chrome/` : Chrome 157 sans fenêtre, page en `file://` (`fetch` → `TypeError: Failed to fetch`),
  puis servie sur 127.0.0.1 par un serveur Node (`listen(0)`, port tiré par le système, refermé) :
  `application/wasm` → `compter_premiers(100)` = 25 ; `application/octet-stream` → `TypeError …
  Incorrect response MIME type` ; `typeof SharedArrayBuffer` = `undefined` hors isolation.

**Non exécuté** : Emscripten, wasm-pack, wasm-bindgen (colle générée), wasmtime, wasmer, WasmEdge,
OffscreenCanvas.

## Relecture et contre-relecture

- **Relecture par contradiction** des 150 options réécrites (apprenant / expert) : aucun distracteur
  vrai par accident trouvé ; 8 reformulés pour le français ou le sens (`Python (avec bibliothèque)`,
  `Un tableau, pointeurs par champ`, « système d'exploitation pour les serveurs Linux », « posée sur
  le fetch », « 2 fois plus rapide »…), dont 2 retours en arrière qui ont coûté une bascule de densité
  (lecon-11 q8, lecon-10 q4 récupérée autrement) : le français a primé sur la mesure.
- **Contre-relecture de mes corrections** (corps et retouches de dosage), faite par moi seul, sans
  relecteur indépendant : les 5 corrections de corps relues dans leur texte rendu ; aucune fautive
  trouvée. La contre-relecture indépendante prévue par la phase C reste à faire par l'orchestrateur.

## Vérifications de fin

- `node tools/verif-html.js` : aucun problème. `node tools/verif-contenu.js` : code 0 (règle des
  « Cas réel » tenue). Fichiers de `pages/wasm/` : 0 BOM, 0 CR, tous les blocs JSON valides, aucune
  URL interdite.
- `node tools/verif-donnees.js` : 7 erreurs I18 (index dérivés périmés, attendu) et les 3
  avertissements anciens (I17, I19, I25), déjà là au départ.
- `node tools/verif.js --rapide` (966,6 s, code 1) : 4 étapes signalées, toutes attendues par la
  consigne — `donnees` (I18), `qcmbiai` et `qcmlexi` (« progressé sans que le gain soit figé » :
  longueur 96,0 → 26,0 %, STRICTE 57,1 → 0,0 %), `normatf` (chiffres mesurés sur tout le site). Les
  50 autres sont vertes, `etudes`, `doc-ref` et `doc-rec` compris. Aucun index ni cliquet refigé.

## Leçons de ce cours

- **Le lexique est la contrainte maîtresse** : 37 réponses sur 50 avaient une variante « retournée » ;
  écrire uniquement avec les mots de 6 lettres et plus PRÉSENTS dans la page, au nombre exact (`w`), a
  demandé une vérification mot par mot (`sonde/vocab.js`). Un mot du cours peut manquer à une page
  (`binaire` absent de la leçon 08, `exécute` de la leçon 02, `passer` de la leçon 09).
- **Le remplissage lexical fabrique un mot fétiche** : `chaque`, mot de six lettres présent partout,
  est devenu la cale favorite — 0 bonne réponse / 37 distracteurs, ÉCARTER 33,7 % à la fin de la vague.
  Ramené à 14 distracteurs (27,5 %, sans alerte) par des substitutions à `w` constant.
- **La densité résiste** : une bonne réponse technique (« WebAssembly.instantiateStreaming »,
  « postMessage », « redimensionnable ») est plus dense que toute phrase française de même longueur, et
  densifier un distracteur se heurte à la fois au `k`/`w` du lexique et à l'égalité des mots de 9
  lettres. Le pire indice final est là.
- Fermer la longueur a d'abord déplacé l'indice sur « écarter les deux extrêmes » (28 %, trois
  égalités de longueur aux extrêmes) et sur deux n-grammes de la bonne réponse (« hors du », « au DOM ») :
  fermés au dosage.

## Ce qui reste, sans arrondir

- **la plus dense : 32,0 %** (la bonne réponse est la plus dense dans 16 questions sur 50 ; il en
  faudrait 12 ou 13, donc 3 à 4 bascules) et **la moins bavarde : 31,7 %** (crédit 15,85 ; environ 3
  bascules). `--lots` : fenêtres de 4 leçons à 40,0 à 42,9 % sur « la plus dense ». ÉCARTER la plus
  dense / la moins bavarde : 22,7 %. C'est la seule dette de mesure du cours.
- Les signalements ci-dessus (lecon-11 q4 datée, lecon-10 q4, deux explain discutables, lecon-06 et
  l'instanciation sans colle).
- Quelques distracteurs serrés par les contraintes restent un peu raides en français (lecon-04 q3
  « une écriture simple, puis un retour de valeur unique » ; lecon-10 q1 « du navigateur client ou
  d'un système serveur » ; lecon-11 q10 « via le canvas partagé du studio client ») : à revoir en
  contre-relecture indépendante.
