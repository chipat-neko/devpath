# LE NNᵉ COURS — `asm` (« Assembleur »), 86,0 % → 24,6 %

Passe parallèle du 2026-11-10, un agent seul, copie de travail `D:\test-claude-b4\asm`, branche
`b4/asm`. 57 questions dont 12 de bilan, 15 leçons. Consigne versionnée :
`scratchpad/CONSIGNE-ASM.md` (écriture ; la relecture et la contre-relecture ont été faites par
le même agent, dans l'ordre, sans consigne séparée). Aucune modification hors de
`pages/asm/**`, `scratchpad/CONSIGNE-ASM.md` et de ce rapport.

**Aucune bonne réponse n'a été prouvée fausse : aucune n'a été touchée.**
`node tools/mesure-qcm-intouchable.js asm a6a45f2` : « 57 questions, 171 distracteurs, 155
réécrits. Aucune atteinte : q / correct / explain / bonne réponse intacts. »

⚠️ **Pour l'orchestrateur, avant la fusion** : la copie de travail a été extraite en **CRLF**
(`core.autocrlf=true` dans la configuration commune du dépôt), alors que l'index est en LF ;
`pose.js` écrit des LF et `remplace.js` refuse le CRLF. J'ai ramené les 16 pages de
`pages/asm/` en LF dans ma copie (aucune différence de contenu pour git) ; les commits sont en
LF (vérifié : `git show HEAD:pages/asm/lecon-01.html` → 0 CR). Les huit autres copies ont
probablement le même état de départ.

## Commits (branche `b4/asm`, depuis `a6a45f2`)

| commit | contenu |
|---|---|
| `622f5ca` | consigne + lot 1 (leçons 01-03, 27 distracteurs) |
| `cb91928` | lot 2 (leçons 04-06, 27) |
| `030f8ef` | lot 3 (leçons 07-09, 27) |
| `7996289` | lot 4 (leçons 10-12, 24 ; `lecon-12` q1 gardée) |
| `5d9539b` | lot 5 (leçons 13-15 et bilan, 50) |
| `a8a20b7` | dosage calculé (16 retouches) |
| `ee732f6` | indice lexical et tics de lot (24 retouches) — ⚠️ son message dit « 0 stratégie déplacée » : faux à la question près (`controle.js` en montrait 8, rangs et nombre de mots) ; les totaux du cours, eux, sont restés entre 24,6 et 26,9 %. Rectifié dans le message de `ed88bd1`. |
| `ed88bd1` | relecture par contradiction : 10 fautes de corps, 10 d'exercices |
| `a4f1c97` | contre-relecture des corrections : 3 prises sur 20 |
| (dernier) | ce rapport |

## Le cours, et comment il a été exécuté

Le cours enseigne **x86-64 en syntaxe Intel, assembleur NASM** (`nasm -f elf64`, `ld`),
**appels système Linux** (`syscall`, `rdi rsi rdx r10 r8 r9`) et **ABI System V** pour les
fonctions, puis `gcc -S`, `objdump`, GDB, l'inline asm de GCC et l'optimiseur.

Aucun assembleur n'était installé. Installés **hors dépôt** dans `D:\outils-b4\asm\` :
- **NASM 3.02** portable officiel (`nasm.us/pub/nasm/releasebuilds/3.02/win64/`) : il assemble,
  donne le listing (encodage octet par octet) et refuse ce qui est invalide ;
- **`asmrun`**, un petit programme .NET 10 (`runner\Program.cs`) qui charge un binaire plat
  produit par NASM dans une page exécutable et **l'exécute sur le processeur de la machine**
  (AMD64, Zen 5). La macro `VIDAGE` de `harnais.inc` copie les 16 registres, `RFLAGS` et
  `xmm0–xmm3` sans les modifier. Lanceur : `bash D:/outils-b4/asm/lance.sh fichier.asm`.

C'est la première fois dans B4 qu'un langage absent s'exécute **nativement** : pas de
simulation en Node, le vrai processeur. Toutes les valeurs de registres, de drapeaux, de pile
et de SSE citées par les distracteurs et les corrections viennent de là (fichiers
`D:\outils-b4\asm\essai\l02.asm`, `preuves1.asm`, `preuves2.asm`, `preuves3.asm`,
`facto.asm`). Table de 20 erreurs classiques exécutée **avant** d'écrire (dans la consigne).

**Exécuté** : `mov al, 0` après `mov rax, -1` → `0xFFFFFFFFFFFFFF00` (et `mov eax, 0` → 0) ;
`cdq` + `idiv` (17 / 5 → 3 reste 2 ; −7 / 2 → −3 reste −1) et `mov edx, eax` à la place de
`cdq` (1 / 0x7FFFFFFF → quotient **2**, reste 3 au lieu de 0 et 1) ; `cmp 7, 7` → ZF = 1,
CF = 0 ; `0xFFFFFFFF` contre 1 : `setg` 0, `seta` 1 ; deux `push` → `rsp` − 16 ; sommet de pile
après `call` = adresse suivante ; `movsx`/`movzx` de `0x80` ; `cmp`/`sub`/`test`/`mov` ;
`xor rax, rax` (ZF = 1) ; `cmov` ; `0.1 + 0.2` (`0x3FD3333333333334`) ; `cvttsd2si 3.9` → 3,
`cvtsd2si` → 4 ; `addss` contre `addps` ; `movq` de l'entier 5 → 2,5E-323 ; `cvtsi2sd` laisse
la moitié haute ; alignement de `rsp` au `call` récursif de `facto` ; `mov`, `lea`, `not`, `cdq`
laissent les drapeaux ; `add qword [rbx], 2` → 42 ; alignement après 1 et 2 `push` à l'entrée
d'une fonction. **Listing NASM** : encodages (`mov rax, 1` → `B8 01 00 00 00`, `mov rax, -1` →
`48 C7 C0 FF FF FF FF`, `mov rax, rbx` → `48 89 D8`, `xor eax, eax` → `31 C0`…), refus
(`mov rax, ebx`, `mov [rsi], [rdi]`, `push eax`, `pop xmm0`, `add xmm0, xmm1`,
`[rbx + rcx*32]`, `cvttsd2si xmm0, rax`, `clear rax`, `jump`, `goto`, `invoke`, `mov rax, null`),
relocation de `mov rdi, fmt` en elf64 (`R_X86_64_64`).

**NON exécuté** (Windows, pas de WSL) : tout appel système Linux (`write`, `read`, `exit`),
l'édition de liens (`ld`, `gcc`), un ELF, GDB, `objdump`, `readelf`, `nm`, `size`, `ldd`,
`strace`, les sorties de `gcc -S` et de l'optimiseur `-O2`, la sémantique de l'inline asm de
GCC. Pour eux : la source (manuels Intel/AMD, ABI System V, manuels NASM, GCC, GDB), ou rien.

## Avant / après

Commandes : `node tools/mesure-biais-qcm.js --seul=asm`, `node tools/plan-rangs-qcm.js asm`,
`node tools/mesure-biais-inverse.js --toutes asm`, `node tools/mesure-lexique-qcm.js
--liste=asm` et `--seul=asm`, `node tools/mesure-mot-fetiche.js asm`, `node
tools/mesure-tics-lot.js asm --exemples`, `node tools/mesure-mot-question.js asm`. Sorties
brutes : `scratchpad/asm-depart/`, `asm-vague/`, `asm-dosage/`, `asm-final/` (locales).

| | départ | après la vague | **arrivée** |
|---|---:|---:|---:|
| « la plus longue » (réussite / sans ex aequo) | 87,7 % / **86,0 %** | 21,1 % / 19,3 % | **24,6 % / 22,8 %** |
| rangs de la bonne (crédits, en points sur 14,25) | 53 / 4 / 0 / 0 (questions) | 12,0 / 13,3 / 16,3 / 15,3 | **14,0 / 14,3 / 14,3 / 14,3** |
| pire des 44 stratégies | 87,7 % (la plus longue) | 29,8 % (écarter les deux extrêmes) | **26,9 %** (la moins bavarde) |
| la plus détaillée / l'incise / ponctuation forte / mot technique / écho | 76,3 / 72,4 / 64,9 / 65,2 / 54,8 % | ≤ 25,1 % | **25,0 / 25,0 / 25,0 / 25,1 / 25,0 %** |
| questions trahies par 5 indices ou plus | **47** (82,5 %) | 0 | **0** (49 à 0–2, 8 à 3–4) |
| biais inverse (alertes) | 5 | 0 | **0** (pire : la plus dense, 25,6 %) |
| mots fétiches (alertes) | 2 (`mémoire` 30,0 %, `valeur` 29,4 %) | 0 | **0** |
| tics de lot | 10 (deux-points médian 51,8 %, glose finale 50,0 %…) | 2 (28,5 %) | **0** |
| lexique : exploitables / retournées / à mettre en forme | 44 / 21 / 47 | 26 / 28 / 43 | **18 / 25 / 36** |
| lexique, lectures directes STRICTE / PROPORTION / INVERSE | — | — | 21,5 / 21,9 / **16,7 %** |
| intrus lexical DEFAUT direct / inverse / sûres | 21,9 / 26,3 / 2 | 12,9 / 30,7 / 0 | **12,7 / 30,6 / 0** |
| intrus lexical EXCES direct / inverse / sûres | 36,4 / 15,1 / 6 | 22,8 / 29,5 / 1 | **21,5 / 30,0 / 0** |

`plan-rangs-qcm` affiche « 17 / 14 / 13 / 13 » : il compte au rang 0 les quatre questions où
les quatre options ont la même longueur (`lecon-12` q1, `lecon-15` q1, q2 et bilan q8) ; les
crédits ci-dessus les répartissent à 1/4 sur chaque rang.

**Volume** : **155 distracteurs réécrits sur 171, 16 gardés** (`lecon-12` q1 : quatre
permutations de 59 caractères ; `lecon-15` q1 et q2 : quatre registres de 3 lettres ; q3 :
`cmp`/`sub`/`test`/`mov` ; bilan q8 `.data` et `.main` ; bilan q6 `mov rax, null` et bilan q7
`int system`, déjà faux et à la bonne longueur). **12 994 caractères écrits** (distracteur moyen
24,8 → 100,8 caractères ; bonne réponse moyenne 98,5) pour 10 529 demandés par le plan de rangs.

**Contrôles finaux** : `verif-html` **0 problème** (1 629 fichiers ; 0 sur chacune des 16 pages
du cours) ; `verif-rendu --pages=` sur les **16 pages du cours : 0 erreur, 0 avertissement**
(96 mesures) ; JSON des blocs valide (reparsé par `pose.js` / `remplace.js` à chaque écriture) ;
0 CR, 0 BOM ; aucune URL ajoutée. `verif-donnees` : seules erreurs **I18** (index dérivés
périmés, attendu : je ne régénère pas `js/`) ; avertissements I17 (`zig`), I19, I25 (`doc`),
étrangers à `asm`. `verif.js --rapide` : voir la dernière section.

## Fautes de fond trouvées et corrigées (commits `ed88bd1`, `a4f1c97`)

**Corps de leçon (10)** :
1. **`lecon-04`, note d'alignement de la factorielle — FAUSSE, gravité haute** : « le `push rdi`
   … ramène `rsp` à “multiple de 16 moins 8” — exactement l'état attendu par l'ABI à un
   `call`. L'alignement tombe juste tout seul ici ». La page enseigne trois paragraphes plus
   haut que l'ABI exige un multiple de 16 **au `call`**. Exécuté (`facto.asm`, appelant
   conforme, `facto(4)`) : `rsp mod 16` au `call` récursif vaut **8, puis 0, puis 8** — un niveau
   sur deux appelle avec une pile désalignée. Note réécrite (sans conséquence ici, `facto`
   n'appelle qu'elle-même ; un `sub rsp, 8` de plus avant la libc). Le distracteur 3 de q3
   (« `push rdi` ajoute les 8 octets qui manquent ») est devenu clairement faux avec elle.
2. **`lecon-10`, « ce que nasm produit : `48 c7 c0 01 00 00 00` » pour `mov rax, 1` — FAUX pour
   NASM** : NASM 3.02 l'écrit `B8 01 00 00 00` (`mov eax, 1`, même effet) ; avec `-O0`,
   `48 B8` + 8 octets ; jamais `48 C7 C0`. L'**exercice 2** demandait de retrouver ce `48` dans
   un binaire NASM : introuvable. L'exemple passe à `mov rax, -1` (`48 C7 C0 FF FF FF FF`,
   listing) dans le code, le schéma SVG, son `aria-label`, la solution de l'exercice 2 (avec
   l'avertissement sur `mov rax, 1`) et l'indice de l'exercice 2 (`mov rax, rbx` / `mov eax,
   ebx` : `48 89 D8` / `89 D8`, listing). ⚠️ La sortie `objdump` affichée (`mov rax,
   0xffffffffffffffff`) n'est **pas exécutée**.
3. **`lecon-14`, exercice 3 : « il faut donc un `push` pair »** pour réaligner après l'entrée —
   exécuté : 8 à l'entrée, **0 après un `push`**, 8 après deux. C'est un nombre **impair**.
4. **`lecon-14`, cas réel** : la fusion de deux lectures attribuée à un `asm("rdtsc")` sans
   sortie — le manuel de GCC dit qu'un asm sans sortie est implicitement `volatile` ; l'exemple
   porte maintenant ses sorties (`"=a"(lo), "=d"(hi)`). Source, non exécuté.
5. **`lecon-06`** : `rax` présenté comme un registre « que le syscall préserve » — il y reçoit la
   valeur de retour (la page le dit elle-même plus haut). Note réécrite.
6. **`lecon-02`** : « `lea` est l'exception » aux drapeaux — exécuté : `mov`, `not` et `cdq` les
   laissent aussi intacts. ⚠️ **Ma première correction était un absolu déplacé** (« l'exception
   parmi les instructions de calcul » : `not` est une instruction logique de la même page),
   prise par la contre-relecture ; et elle avait fait sortir « touche » du corps (k de q1 :
   6 → 7). Les deux sont réparés.
7. **`lecon-01`** : « le CPU ne calcule pas directement dans la mémoire » / « ne calcule que dans
   ses registres » — exécuté : `add qword [rbx], 2` modifie la mémoire (42), et la leçon 3 fait
   `add rax, [rsi + rcx*8]`. Adouci (« coûte cher », « surtout »).
8. **`lecon-11`** : « un simple `x` réaffiche 8 mots » — le manuel de GDB donne une seule unité
   par défaut ; c'est l'Entrée vide qui répète `x/8xw`. Source, **non exécuté**.
9. **`lecon-09`** : le rapport de 1992 sur le Patriot attribué au « Government Accountability
   Office » (nom de 2004 ; c'était le General Accounting Office) ; « près de 600 mètres » rendu
   prudent (« plusieurs centaines de mètres ») plutôt que remplacé par un chiffre de mémoire.
10. **`lecon-10`** : « depuis la leçon 2 » pour `section .text` / `.data` (leçons 1 et 3).

**Exercices (10)** : 9 indices ou placeholders qui contenaient une réponse acceptée
(`exos-tous.js` : 3 → **0** ; `fuites-larges.js` : 14 → **1**, l'énoncé de `lecon-03` exo 2
cite la liste dont il faut le maximum) — `lecon-02` exo 2, `lecon-03` exo 3, `lecon-05` exos
1, 2 (placeholder et indice) et 3, `lecon-08` exo 1, `lecon-11` exos 1 et 2 ; et
**`registers` seul accepté comme commande GDB** (`lecon-11` exo 2), retiré.

**Contre-relecture** : 20 corrections relues une à une, **3 prises (15 %)** — l'absolu déplacé de
`lea`/`not`, le mot « touche » sorti du corps, et la phrase de `lecon-04` qui disait « `rsp` vaut
alors multiple de 16 plus 8 » sans la condition « si l'appelant respectait l'ABI » (plus un
distracteur sans complément, `lecon-04` q3). 17 confirmées justes.

## Signalé, non touché (intouchable ou non prouvé)

- **`lecon-15`, explain du bilan q10** : « Il précède un `mov rax,…` mais pas un `mov eax,…` » —
  vrai pour `mov rax, rbx` ou `mov rax, -1`, faux pour `mov rax, 1` assemblé par NASM (pas de
  `48`, listing). Pas faux en général : laissé.
- **`lecon-06` q2, bonne réponse** : « les octets suivants (aléatoires) » quand `lecon-01` dit
  « souvent des zéros ». Imprécision, gravité basse.
- **`lecon-03` q3, bonne réponse** : « `ja` … se base sur CF » — `ja` lit CF **et** ZF. Incomplet.
- **`lecon-08`** : la boucle de somme réduite à `n*(n-1)/2` est présentée comme la sortie de
  « gcc -O2 » ; c'est plutôt la signature de clang. **Non exécuté** (gcc absent) : à vérifier.
- **`lecon-13` exercice 3** : « s < a est toujours faux » — l'optimiseur réécrit plutôt
  `a + b < a` en `b < 0`. Non exécuté.
- **`lecon-12`** : un « hello » statique pèse « ≈ 800 Ko » dans le schéma et « 900 Ko » dans le
  texte et l'exercice 3 : à harmoniser, chiffres non mesurables ici.
- **`lecon-05`** : `mov rdi, fmt` dans un `main` lié par `gcc` (PIE par défaut) — NASM émet
  `R_X86_64_64` (vérifié), que `ld` accepte avec un avertissement de relocation de texte.
  Non exécuté (pas de `ld`) ; laissé.

## Les leçons de ce cours

1. **Un langage machine absent s'exécute quand même, nativement.** Un chargeur de 60 lignes en
   .NET suffit à exécuter un binaire plat NASM sur le processeur réel ; c'est plus sûr qu'une
   simulation BigInt (drapeaux, extension de signe, SSE, alignement : rien à recoder).
2. **Une affirmation sur la sortie d'un outil se vérifie en lançant l'outil** : « ce que nasm
   produit » était faux, et l'exercice construit dessus aussi. Le listing (`-l`) l'a montré en
   une commande.
3. **La faute la plus grave du cours vivait dans une note « Petit détail »**, contredite par la
   règle que la même page pose plus haut : l'exécution de `rsp mod 16` l'a tranchée.
4. **La vague a écrit avec un vocabulaire étranger aux pages** : le lexique est passé de 44 à 26
   exploitables seulement, et le fermer après coup coûte 3 à 6 essais par question (k, w, mot
   technique exclusif, écho, rang tenus ensemble). Il faut vérifier `k` **pendant** la vague
   (`scratchpad/asm-sonde/vocab.js lecon-NN.html "^préfixe"` liste les mots de la page).
5. **`la plus dense` et `la moins bavarde` se dosent comme la longueur** : la vague les avait
   poussés à 19,3 % et 28,4 % ; trois densités abaissées et trois égalités de mots les ont
   ramenés près de 25 %.
6. **Mes propres messages et corrections ont été pris** : un message de commit qui annonçait « 0
   stratégie déplacée » sans avoir lancé `controle.js`, et une correction qui déplaçait un absolu.
   Lancer le garde-fou **avant** d'écrire le message.

Outils ajoutés dans `scratchpad/asm-sonde/` (locaux) : `qcheck.js` (44 stratégies question par
question, avec `w`, `k`, mots exclusifs de 9 lettres, écho, détail), `credits.js` (crédit d'une
stratégie question par question, pour le dosage), `densite.js`, `vocab.js`, `maj.js`, `dump.js`,
`texte.js`. **Défaut d'outil signalé, non corrigé dans `tools/`** : la sonde `tests-corr/wk.js`
du dépôt principal comptait `k` en mots **distincts** alors que `mesure-lexique-qcm` compte les
**occurrences** ; ma copie (`asm-corr/wk.js`) est corrigée.

## Ce qui reste, sans arrondir

- **Indice lexical** : 18 questions exploitables (contre 44 au départ), 25 « retournées », 36 à
  mettre en forme. Les lectures directes sont sous le hasard (STRICTE 21,5 %, PROPORTION 21,9 %),
  mais **INVERSE est à 16,7 %** : dans une vingtaine de questions, un distracteur porte encore
  seul le plus de mots absents de la page, et l'écarter rapporte. Corrigé sur 7 questions
  (`lecon-04` q1 et q3, `lecon-05` q1 et q3, `lecon-06` q3, `lecon-08` q2 et q3) ; le reste
  demande la même réécriture mot à mot.
- **Intrus lexical** (`mesure-mot-question`) : 0 question sûre (8 au départ), mais les deux
  lectures inverses restent à **30,6 %** (DEFAUT) et **30,0 %** (EXCES), au-dessus du seuil de
  28 % : une trentaine de mots portés par 3 options sur 4 (`--plan` les liste).
- **La moins bavarde** à 26,9 % : dans la bande des derniers cours, non retouchée.
- Le non-exécuté listé plus haut, et les cinq signalements intouchables.
- À la clôture (orchestrateur) : régénérer les index (`build-index --write --fresh`), refiger
  les cliquets `qcmbiai` / `qcmlexi`, marquer `asm` traité.

## `node tools/verif.js --rapide` dans la copie (395,3 s, sortie conservée dans `scratchpad/asm-final/verif-rapide.txt`)

43 étapes vertes sur 53 jouées ; 10 signalent, 1 n'a rien pu mesurer :
- **attendues** (consigne commune) : `qcmbiai` (« asm a progressé, longueur 87,7 % → 24,6 %, pire
  indice 87,7 % → 26,3 %, sans que le gain soit figé »), `qcmlexi` (même motif), `donnees`
  (I18 : `quiz-index.js` +13 006 octets, `search-index.js` +89, `search-lite.js` −1) ;
- **dérivées des mesures du site**, à réassembler par l'orchestrateur : `doc-ref`, `normatf`
  (pages `doc` qui publient des chiffres), `etudes` (première divergence ligne 171) ;
- **dues à l'extraction CRLF de la copie, pas à mes changements** (je n'ai touché que
  `pages/asm/`) : `moteurs` (`build-sources-worker` : « SQLJS_SRC 46 535 caractères, attendu
  46 721 » — `assets/vendor/sqljs/sql-wasm-src.js` porte 11 CR dans ma copie, 0 dans le dépôt
  principal), `rj-cpp` (12 blocs « introuvables » dans `pages/cpp`, 415 CR dans ma copie de
  `cpp/lecon-01.html`), `maths` (58 divergents, `pages/maths` en CRLF), `requete` NON MESURÉ
  (« fin de JUGE_SQL introuvable » : motif de fin de ligne). À rejouer sur la branche fusionnée,
  en LF, pour le confirmer — je ne l'ai pas prouvé étape par étape.

## Reprise du lexique (après fusion)

Reprise du 2026-11-10 au 2026-11-11, même branche `b4/asm`, partie de `d6cd961` (master après les neuf
fusions). Seul l'indice lexical restait loin des autres cours clos ; tout le reste devait
rester en place. Quatre commits : `a2e3e42` (leçons 02 à 05), `6110ccd` (06, 07, 09, 10),
`cfd42af` (11, 12, 13), `01b6ab7` (14, 15, fenêtres de longueur, relecture), puis ce
rapport. Aucune modification hors de `pages/asm/**`, de `scratchpad/CONSIGNE-ASM.md` (une
section « Reprise du lexique » ajoutée) et de ce rapport.

### Avant / après

Commandes : `node tools/mesure-lexique-qcm.js --liste=asm` et `--seul=asm`,
`node tools/verif-qcm-lexique.js`, `node tools/mesure-biais-qcm.js --seul=asm`,
`node tools/plan-rangs-qcm.js asm`, `node tools/mesure-mot-fetiche.js asm`,
`node tools/mesure-tics-lot.js asm`, `node tools/mesure-biais-inverse.js asm`,
`node tools/mesure-mot-question.js asm`, `node tools/mesure-explain-orpheline.js
--depuis=d6cd961 --seul=asm --travail`, `node tools/mesure-qcm-intouchable.js asm d6cd961`,
`node tools/verif-html.js`. Sorties brutes : `scratchpad/asm-lex/depart/` et
`scratchpad/asm-lex/final/` (locales).

| | départ (`d6cd961`) | **arrivée** |
|---|---:|---:|
| lexique : exploitables / retournées / à mettre en forme | 18 / 25 / 36 | **0 / 0 / 0** |
| STRICTE / PROPORTION / INVERSE, désignation unique (couverture) | 14,0 / 40,4 / 33,3 % | **0,0 / 0,0 / 0,0 %** |
| idem, lecture RESTREINDRE (couverture ; rendement) | 28,1 % ; 19,8 / 24,3 / 4,4 % | **0,0 %** ; — / — / — |
| `verif-qcm-lexique` pour `asm` | régression : STRICTE/restr. 12,9 → 19,8 % (et PROPORTION/restr. 18,9 → 24,3 %, masquée : l'outil ne cite que la première) | **plus de régression** (seul reste « progressé sans que le gain soit figé », attendu) |
| la plus longue (réussite / sans ex aequo) | 24,6 / 22,8 % | **24,6 / 22,8 %** |
| pire des 44 stratégies | 26,9 % (la moins bavarde) | **26,3 %** (écarter les deux extrêmes) |
| la moins bavarde | 26,9 % | **26,0 %** |
| questions trahies par 0–2 / 3–4 / 5+ indices | 49 / 8 / 0 | **50 / 7 / 0** |
| plan de rangs : questions à retoucher / caractères | 12 / 67 | **11 / 63** |
| tics de lot / mots fétiches / biais inverse (alertes) | 0 / 0 / 0 | **0 / 0 / 0** |
| explications orphelines / atteintes à l'intouchable | 0 / 0 | **0 / 0** (62 distracteurs réécrits depuis `d6cd961`, 155 depuis `a6a45f2`) |
| intrus lexical DEFAUT direct / inverse | 12,7 / 30,6 % | 12,7 / **30,3 %** |
| intrus lexical EXCES direct / inverse | 21,5 / 30,0 % | 21,6 / **29,5 %** |
| `verif-html` | 0 | **0** (1 629 fichiers) |

**Garde-fou crédit par crédit.** `controle.js` signale toute désignation qui bouge, même
entre deux distracteurs ; une nouvelle sonde, `scratchpad/asm-lex/essai.js`, applique les
retouches en mémoire (options **et** phrases de corps) et compare le **crédit** de chacune
des 44 stratégies, question par question, plus le lexique et l'intrus lexical. Bilan sur
toute la reprise (`essai.js --ref=d6cd961`) : **un seul crédit a changé**, la moins bavarde
sur `lecon-04` q2 (1 → 0,5), ce qui baisse la pire stratégie de 26,9 à 26,0 %. Les
désignations déplacées que montre `controle.js --ref=d6cd961` (28, sur les 36 questions
traitées) se font toutes entre distracteurs, sauf celle-là, et laissent chaque crédit à
l'identique.

### Méthode

Trois façons de fermer, choisies question par question (36 questions) :
- **k / k / k / k, w égal** (sans toucher au corps) quand les distracteurs n'étaient qu'à
  un ou deux mots de la règle : 14 questions (`lecon-02` q2, `lecon-03` q1, `lecon-04` q2,
  `lecon-05` q2, `lecon-06` q2, `lecon-07` q2, `lecon-09` q2, `lecon-11` q1, `lecon-12` q2,
  `lecon-15` q4, q12, q13, q14, q15) ;
- **faire entrer les mots dans le corps** (k = 0 ; un mot de moins de 6 lettres redevient
  alors libre) quand la bonne réponse portait des mots que la page enseigne sous une autre
  forme, ou quand une phrase vraie corrigeait directement le contresens d'un distracteur :
  17 questions ;
- **remplacer le seul mot étranger d'un distracteur** quand la bonne réponse était déjà à
  k = 0 : 5 questions (`lecon-09` q1, `lecon-11` q2, `lecon-13` q3, `lecon-14` q1,
  `lecon-15` q5).

Quatre contraintes sont tombées à chaque essai et ont été tenues explicitement : le
**mot technique exclusif** se compte (chaque distracteur doit garder autant de mots de 9
lettres exclusifs qu'avant : `lecon-04` q2, `lecon-06` q2, `lecon-07` q2, `lecon-09` q2,
`lecon-13` q1, `lecon-14` q2, `lecon-15` q4) ; l'**écho** de l'énoncé (« passe »,
« valeurs », « sqrt », « niveau » ont été refusés) ; la **négation** (« un seul pas » et
« non signé » ont ouvert « la seule qui nie », la perte de « ne conserve plus » aussi) ; les
**égalités de longueur** qui portent un crédit (`lecon-10` q3 : trois distracteurs à 149
caractères, gardés à 149).

### Phrases ajoutées au corps

Quatorze phrases et, dans `lecon-15`, une liste de quatre puces de récapitulation,
toutes vraies et utiles à l'apprenant ; celles qui décrivent un registre, un drapeau ou un encodage sont
**exécutées** (NASM 3.02 + `asmrun`, `D:\outils-b4\asm\essai\lex02.asm`, `lex03.asm`,
`lex07.asm`, `lex10.asm`).

| page | phrase (résumée) | preuve |
|---|---|---|
| `lecon-02` | après `mov rax, -1`, `mov eax, 5` donne `rax = 5` et non `0xFFFFFFFF00000005` ; `mov al, 5` ne change que l'octet bas, les autres bits restent à 1 | **exécuté** : `rax = 0x5`, puis `0xFFFFFFFFFFFFFF05` |
| `lecon-03` | `sub rax, rbx` avec 3 et 5 emprunte : CF passe à 1 | **exécuté** : CF = 1 |
| `lecon-03` | `jg` interprète les valeurs comme signées, regarde SF, OF et ZF et ignore CF ; `ja` et `jb` regardent CF (et ZF pour `ja`) | **exécuté** : RFLAGS imposé par `popfq` (CF = 1, CF = 0, ZF = 1, SF = 1), `setg` / `seta` / `setb` lus : 1/0/1, 1/1/0, 0/0/0, 0/1/0 |
| `lecon-06` | la convention confie le 4e argument à `r10` parce que `syscall` écrase immédiatement `rcx` (adresse de retour) et `r11` (RFLAGS) | manuel Intel, SYSCALL ; **non exécuté** (un `syscall` sous Windows appelle le noyau NT) |
| `lecon-07` | avec l'octet `0x9C`, `movsx` donne `0xFFFFFF9C` (−100), `movzx` donnerait 156 | **exécuté** : `ecx = 0xFFFFFF9C`, `eax = 0x9C` |
| `lecon-10` | l'encodage dépend de l'instruction et de ses opérandes ; REX (`0x40` à `0x4F`) signale l'usage des registres 64 bits ou étendus (`r8` à `r15`) | **listing NASM** : `48 89 D8`, `89 D8`, `41 89 C0`, `49 83 C7 01` |
| `lecon-10` | l'adresse de retour stockée sur la pile, écrasée, fait que `ret` détourne l'exécution vers une adresse choisie | **exécuté** : une fonction écrase `[rsp]`, `ret` arrive à la cible (`r12 = 0xBAD`) |
| `lecon-10` | `.data` et `.bss` finissent d'ordinaire dans un même segment LOAD | disposition standard de `ld` ; **non exécuté** (ni `ld` ni `readelf`) |
| `lecon-11` | l'adresse de `x` peut être un registre : `x/s $rdi` affiche la chaîne pointée par `rdi` | manuel de GDB ; **non exécuté** |
| `lecon-12` | pour `sqrt`, il manque le plus souvent `-lm` : le prototype de `<math.h>` ne fournit pas la définition | prolonge la phrase précédente de la page ; **non exécuté** |
| `lecon-13` | un saut conditionnel introduit une branche à prédire, le `cmov` n'en introduit aucune | reformule la phrase qui précède |
| `lecon-13` | ce n'est pas de la mémoïsation : rien n'est gardé d'un appel à l'autre, 25 est calculé à la compilation | la page montre `mov eax, 25 ; ret` |
| `lecon-14` | sans `volatile`, gcc compile le bloc ; l'optimiseur peut le supprimer ou le fusionner, `volatile` sert à l'en empêcher | manuel GCC (Extended Asm, Volatile) et le cas réel de la page ; **non exécuté** |
| `lecon-14` | `volatile` ne peut pas interdire le réordonnancement matériel à l'exécution | même cas réel (`rdtsc` restait bruité) ; **non exécuté** |
| `lecon-15` | récapitulatif avant le quiz bilan : `call`/`ret` et `syscall`/`sysret` ; `stepi`, `nexti`, `continue`, `finish` ; `objdump -d` et l'hexadécimal ; `.text`, `.rodata`, `.data`, `.bss` | manuels Intel, GDB, binutils ; leçons 6, 10, 11, 12 ; **non exécuté** |

### Distracteurs

62 distracteurs retouchés mot à mot (13 + 16 + 15 + 18 par lot), aucune bonne réponse,
aucun `explain`, aucun énoncé touché. Deux retouches demandées en plus :
- `lecon-15` q14 (bilan q11) : la redite « Mémoïsation + mémorisation des résultats +
  lecture du cache mémoire » devient « Mémoïsation + table des résultats en mémoire vive +
  accès instantané » ; même redite corrigée dans `lecon-13` q1 (« Mémoïsation sur carre,
  puis évaluation des résultats (9 et 16), puis recopie »).
- Les distracteurs que la reprise avait poussés hors de la fenêtre de longueur sont
  resserrés (`lecon-06` q2, `lecon-11` q1 — déjà hors fenêtre au départ —, `lecon-12` q3,
  `lecon-14` q2, `lecon-15` q5 et q12).

**Relecture en contradicteur, deux prises sur mes propres retouches** : `lecon-13` q2
« Il ne fait aucune comparaison » était vrai au pied de la lettre (`cmov` ne compare pas,
il lit les drapeaux), remplacé par « Il ne suppose aucune comparaison » ; `lecon-14` q2
« alors que l'optimiseur ne déplace pas non plus » était mal construit, devenu « ne
déplace pas de son côté ».

### Signalé, non touché

- **`lecon-14` q2, bonne réponse** : « empêcher l'optimiseur de supprimer, dupliquer ou
  déplacer le bloc ». Le manuel de GCC (Extended Asm, § Volatile) dit que le compilateur
  peut encore déplacer un asm `volatile` par rapport au code voisin, et (§ sur `%=`) qu'il
  peut dupliquer un bloc asm en optimisant. Le tableau de la page (« ne pas supprimer ni
  déplacer le bloc ») et le schéma (« ne me déplace pas ») disent la même chose. Non
  exécuté (pas de gcc) : à trancher par l'orchestrateur. Ma phrase ajoutée ne promet que
  « supprimer ou fusionner ».

### Ce qui reste

- **Intrus lexical** (`mesure-mot-question`), hors du périmètre de cette reprise : les
  deux lectures inverses restent au-dessus du seuil de 28 % (DEFAUT 30,3 %, EXCES 29,5 %),
  0 question sûre. Elles ont un peu baissé (30,6 et 30,0 % au départ).
- **Fenêtre de longueur** : 11 questions à retoucher selon `plan-rangs-qcm` (63
  caractères), toutes présentes au départ sauf `lecon-14` q2, dont le distracteur 3 était
  déjà hors fenêtre (152 caractères, 150 aujourd'hui, borne 145).
- Le non-exécuté listé dans le tableau des phrases.
- À la clôture (orchestrateur) : régénérer les index, refiger les cliquets `qcmbiai` et
  `qcmlexi` (la référence de `asm` peut passer `traite` et `traiteRestreint`).

### `node tools/verif.js --rapide` après la reprise (217,2 s, sortie dans `scratchpad/asm-lex/final/verif-rapide.txt`)

48 étapes vertes sur 53 jouées (dont `qcmbiai`, `lexique`, `exemple`, `maths`, `moteurs`,
`requete` : les signalements CRLF de la passe précédente ont disparu avec la copie en LF).
Cinq signalent, toutes attendues ou dérivées :
- `qcmlexi` : « 9 cours ont progressé sans que le gain soit figé » (attendu) ; `asm`
  n'y figure plus comme régression ;
- `donnees` (I18) : index périmés, à régénérer par l'orchestrateur (`build-index --write
  --fresh`) : `quiz-index.js` (+101 o), `search-index.js` (+372 o) et `pieges-data.js`
  (+2 461 o), parce que trois des phrases ajoutées prolongent un encadré « Piège
  fréquent » indexé (`lecon-02` eax, `lecon-03` sauts signés, `lecon-10` sections et
  segments) ;
- `etudes`, `etude-6` et `normatf` : pages dérivées qui publient des mesures du site
  (première divergence de `etudes` ligne 226, sortie de `mesure-langages.js`) ; à
  réassembler à la clôture.
