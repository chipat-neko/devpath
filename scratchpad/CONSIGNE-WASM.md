# Consigne d'écriture — les QCM du cours `wasm` (case C4 du chantier V18)

Préparée le 2026-11-19 dans la copie de travail `D:\test-claude-c4-wasm` (branche `v18/c4-wasm`,
partie de `8d163bf`). Un seul agent fait tous les rôles (écriture, dosage, relecture par
contradiction, correction, contre-relecture). Mesures de départ archivées dans
`scratchpad/c4-wasm/depart/` (sorties brutes des outils ; `questions.txt` : les 50 questions à plat,
avec leurs explain). Sondes dans `scratchpad/c4-wasm/sonde/` : `aplat.js` (les QCM à plat),
`texte.js` (une leçon en texte lisible), `atelier.js` (banc d'écriture : un lot de patchs appliqué EN
MÉMOIRE ; pour chaque question, les 44 stratégies CHARGÉES depuis `tools/mesure-biais-qcm.js`, le rang
contre `cibles.json`, la bande 70-130 %, `k`/`w` du lexique, l'intrus lexical et les motifs de forme
— copies exactes des outils —, puis le bilan du cours entier : stratégies, rangs, lexique, intrus,
tics de lot, mot fétiche, biais inverse), `pose.js` (l'applicateur sûr) et `controle.js` (le
garde-fou v2 de `vue`, repointé : il compare le disque à une référence git, question par question,
pour toutes les stratégies plus `w`/`k`).

Le cours : « WebAssembly », 11 leçons, **50 questions** (dont 12 de bilan dans `lecon-11`) — ce
qu'est Wasm et sa place à côté de JavaScript (`01`), la chaîne d'outils Emscripten / wasm-pack (`02`),
charger un module (`03`), nombres et mémoire linéaire (`04`), quand l'employer (`05`), le capstone
premiers.c (`06`), le format texte WAT (`07`), wasm-bindgen (`08`), Web Workers (`09`), WASI (`10`),
le projet studio d'image (`11`).

## ✅ CE QUI SE PROUVE SE PROUVE — WEBASSEMBLY S'EXÉCUTE ICI

Node 26.13.1 (V8) exécute Wasm ; `wabt` 1.0.37 (npm, installé dans `D:\outils-c\wasm\`, hors dépôt)
assemble le WAT ; Zig 0.14.1 compile le C de la leçon 06 en wasm32 ; `node:wasi` exécute WASI
preview 1 ; Chrome 157 sans fenêtre joue la page en `file://` et servie sur 127.0.0.1 (port tiré par
le système) ; rustc 1.99.1 dit quelles cibles existent. Preuves : `scratchpad/c4-wasm/preuves/`
(`p1-wat`, `p2-api`, `p3-premiers`, `p4-wasi`, `p5-wasi-wat`, `chrome/`), chaque `.js` avec sa sortie `.out`.

| croyance fausse | ce que l'exécution rend |
|---|---|
| JS voit le nom interne `$add` | `Object.keys(instance.exports)` = `["add"]` ; `exports.$add` = `undefined` ; sans `(export)` : `[]` |
| un mauvais type passe à l'exécution | `i32.add` sur un `f64` : `CompileError … expected type i32, found local.get of type f64` (rejet à la validation) |
| la forme imbriquée diffère de la forme à plat | binaires **identiques** |
| `instantiateStreaming` rend l'instance | il rend `{ module, instance }` ; sans déstructurer : `TypeError: Cannot read properties of undefined (reading 'additionner')` |
| le type MIME n'importe pas | `application/octet-stream` : `TypeError … Incorrect response MIME type. Expected 'application/wasm'` (Chrome) ; le repli `arrayBuffer()` + `instantiate` marche |
| `fetch` marche en `file://` | Chrome 157 : `TypeError: Failed to fetch` ; servi sur 127.0.0.1 : 200 et `compter_premiers(100)` = 25 |
| une chaîne passe telle quelle | `id32("Ana")` = 0, `id32("12")` = 12, `id32({x:1})` = 0 : la valeur est CONVERTIE en nombre |
| un `i64` se passe comme un Number | `id64(5)` : `TypeError: Cannot convert 5 to a BigInt` ; `id64(5n)` = `5n` |
| la vue sur `memory.buffer` survit à une croissance | après `memory.grow` : `length` 0, lecture `undefined`, écriture ignorée sans erreur (mode strict compris) |
| `sommer(0, 4)` sur [1,5 ; 2,5 ; 3 ; 4] | 11 |
| un import manquant est ignoré | `TypeError: … Imports argument must be present and must be an object` |
| `(memory 1)` réserve 1 Mo | 65 536 octets (une page de 64 Kio) |
| un transfert copie | après `postMessage(buf, [buf])` : `byteLength` 0 côté expéditeur (Node et Chrome) ; sans liste de transfert, l'expéditeur garde son tampon |
| un worker voit `document` | `typeof document` / `window` = `undefined` dans un Web Worker (Chrome 157), `WebAssembly` = `object` |
| `SharedArrayBuffer` est toujours là | Chrome 157, page non isolée : `typeof SharedArrayBuffer` = `undefined` |
| un module WASI voit le disque | sans dossier accordé : `path_open` → errno 8 (EBADF, aucun descripteur) ; avec : lecture OK ; sortir par `../` → errno 76 (ENOTCAPABLE) |
| `wasm32-wasi` est une cible Rust | rustc 1.99.1 : `could not find specification for target "wasm32-wasi"` ; `wasm32-wasip1` existe |
| Wasm écrase JS sur le calcul de la leçon 06 | 78 498 premiers sous 10⁶ des deux côtés ; Wasm ≈ 81 ms, JS ≈ 79-92 ms (Node 26 et Chrome 157) |

Non exécuté ici : Emscripten (`emcc`), wasm-pack, wasm-bindgen (pas de cible wasm32 installée
pour Rust ; on ne touche pas à la chaîne d'outils globale), wasmtime, wasmer, WasmEdge. Pour
ceux-là : la documentation ou la source (wasm-bindgen : `FinalizationRegistry` généré pour les
classes exportées depuis 0.2.91, `crates/cli-support/src/js/mod.rs`).

## Pourquoi ce travail — mesure de départ (`node tools/mesure-biais-qcm.js --seul=wasm`)

| indice | réussite | couverture | rendement |
|---|---:|---:|---:|
| **la plus longue** | **96,0 %** | 100,0 % | 96,0 % |
| la plus détaillée | **82,5 %** | 78,0 % | 97,4 % |
| RESTREINDRE à la ponctuation forte / la seule | **55,0 % / 54,5 %** | 42,0 % | 95,2 % |
| le mot technique exclusif | **50,0 %** | 50,0 % | 64,0 % |
| l'incise entre parenthèses / RESTREINDRE | **49,5 %** | 32,0 % | **100,0 %** |
| ECARTER la moins bavarde | 41,5 % | 8,0 % | 75,0 % |
| RESTREINDRE aux deux-points | 40,5 % | 26,0 % | 84,6 % |
| le point-virgule (seule / RESTREINDRE) | 38,5 % | 18,0 % | **100,0 %** |
| ECARTER la plus courte | 34,0 % | — | — |

**34 questions sur 50 (68,0 %)** trahies par 5 indices ou plus. Rangs **48 / 1 / 1 / 0**, cible
**13 / 13 / 12 / 12** (`cibles.json`, tirée de `plan-rangs-qcm wasm`) ; **6 870 caractères** à écrire
sur 49 questions. Biais inverse : **4 alertes** (rangs 2, 3, 4 et « la moins bavarde »).

### Les QUINZE tics de lot (`node tools/mesure-tics-lot.js wasm --exemples`)
point-virgule médian **9 / 0** (38,5 %), deux-points médian **9 / 2** (37,5 %), glose finale **10 / 4**
(37,0 %), quatre segments à virgules **7 / 3** (34,0 %), adverbe de reprise **4 / 0**, « calcul
intensif » **4 / 0**, « le chargement » 4 / 1, verbe conjugué 9 / 13, « du navigateur » 4 / 2,
« ne … que » 4 / 4, « la page », « au dom », « que la », « un format », « le calcul ». Le gabarit des
bonnes réponses est « réponse : explication », « réponse ; conséquence » ou « réponse (glose) » :
**les distracteurs prennent le MÊME gabarit**, avec un contenu qui énonce une erreur.

### Mots fétiches (`node tools/mesure-mot-fetiche.js wasm`) : 3 alertes
`module` (7 bonnes / 1 distracteur, RESTREINDRE 35,0 %), `calcul` (9 / 9, 32,2 %), `passe` (5 / 4,
30,5 %). **Pose ces mots dans les distracteurs des questions où la bonne réponse les porte.** `parce`
est un mot de distracteur (6 / 28) et `uniquement` aussi (0 / 8) : ne commence un distracteur par
« Parce que » que si la bonne réponse commence ainsi, et pas d'« uniquement » si elle n'en a pas.

### Lexique (`node tools/mesure-lexique-qcm.js --liste=wasm`)
**45 exploitables, 37 retournées, 50 à mettre en forme sur 50.** Règle du `k` (en OCCURRENCES) :
les quatre options portent le même nombre de mots de 6 lettres et plus ABSENTS de la page (page
entière hors blocs de quiz, exercices compris). Règle du `w` : si `k > 0`, les quatre portent le
même nombre de mots de 6+ lettres. L'apostrophe et le tiret collent (`l'interface`, `wasm-bindgen`
sont UN jeton). Le plus sûr : écrire avec les mots de la leçon, et des mots de moins de 6 lettres.

## La règle qui prime sur toutes les mesures

> **UN DISTRACTEUR EST UNE PHRASE FRANÇAISE QUI ÉNONCE UNE THÈSE FAUSSE, PRÉCISE ET PLAUSIBLE.**
> Si l'on ne peut pas dire en une phrase *pourquoi c'est faux*, ce n'est pas un distracteur.

1. L'erreur se nomme en une phrase, et le comportement vrai est dans la table ci-dessus ou dans la
   page de la leçon. 2. Chaque proposition a un référent ; aucune parenthèse ni queue de phrase de
   remplissage. 3. Un débutant crédule pourrait la cocher : erreurs réelles (« Wasm remplace JS »,
   « le worker accélère le calcul », « transférer = partager », « une chaîne passe telle quelle »,
   « le nom interne est visible », « le MIME n'importe pas », « WASI donne tout le disque »…).
4. Elle affirme sa thèse POSITIVEMENT : sa fausseté est dans le mécanisme décrit, jamais dans un
   aveu final (« … et l'interface gèle »). 5. Trois erreurs DIFFÉRENTES, jamais le miroir de la bonne.

⚠️ **Le piège propre à ce cours : le vrai « selon le contexte ».** Wasm a des imports (il PEUT appeler
JS), web-sys PEUT toucher le DOM, un worker PEUT charger un .wasm, `SharedArrayBuffer` PERMET le
partage, `i64` passe (en BigInt), WASI a des sockets dans certaines versions, le `.wasm` peut être
servi sans colle. Un distracteur « Wasm ne peut pas X » est souvent VRAI pour une autre forme de X.
Tiens-toi à des erreurs de FAIT nettes, vérifiables contre la page de TA leçon et l'exécution.

## Ce que chaque question tient (`atelier.js` le vérifie)

1. **Rang** visé (`cibles.json`), sans ex æquo avec la bonne ; bande 70-130 % ; rang en MOTS voisin.
2. **Marques — les quatre ou aucune** : `;`, `:`, incise entre parenthèses (même NOMBRE), glose
   finale, tiret, `/`, « », flèche, point interne (lecon-05 q1 : la bonne est en DEUX phrases, les
   trois distracteurs aussi), virgule décimale. ⚠️ Le code porte des marques : `i32/i64`,
   `&mut [u8]`, `postMessage(…)` (parenthèse), `JS ⇄ Wasm`.
3. **Nombre de `, : ;`** égal dans les quatre (la plus détaillée 82,5 %).
4. **Écho** : même nombre de mots de l'énoncé (4+ lettres) dans les quatre ; **fragments
   d'identifiant** de l'énoncé (`postMessage` → « post », « message ») : quatre ou aucun.
5. **Attaque** : jamais trois pareilles et une seule différente ; **casse initiale** idem.
6. **Absolus, prudents, négation** : quatre porteurs ou aucun (négation : « ne », « pas », « n' »…).
7. **MAJUSCULE d'emphase** : même nombre partout — ⚠️ `WASI`, `WAT`, `WABT`, `MIME`, `RGBA`, `SIMD`,
   `TRANSFÉRANT`, `MÊME` ne sont PAS dans la liste des sigles de l'outil (`WASM`, `DOM`, `JS`, `API`,
   `UTF`, `LLVM`, `CSS` y sont).
8. **Mots de 9+ lettres** : chaque option en porte le même nombre d'exclusifs (le plus simple :
   reprendre ceux de la bonne réponse dans les distracteurs).
9. **Intrus lexical** (mots de 5+ lettres) : aucun mot porté par exactement trois options ; chaque
   option a au moins un mot propre.
10. **Tics de forme** : 0, 2 ou 4 porteurs — dont « est / sont / reste / garde / devient » OÙ
    QU'ILS SOIENT, « ce / cette / ces », « car / puisque / parce que », « alors / ensuite / puis »,
    « ne … que », « , et », trois virgules ou plus.
11. **Densité** : allonger avec le vocabulaire de la leçon, pas avec des chevilles ; mesurer « la plus
    dense » et « la moins bavarde » en fin de vague et doser par calcul.

## L'ordre de travail
1. Lire la leçon en entier (le corps fixe le vocabulaire et ce qui est vrai).
2. Écrire les trois erreurs de chaque question en une phrase ; les exécuter si elles portent sur un
   comportement.
3. Rédiger les patchs (`scratchpad/c4-wasm/vague/lNN.json`), `atelier.js` jusqu'à ce que plus rien
   ne désigne la bonne réponse, puis le bilan du cumul.
4. Poser (`pose.js --ecrire`), `verif-html`, 0 CR, commit du lot.
