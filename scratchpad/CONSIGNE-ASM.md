# Consigne d'écriture — les QCM du cours `asm` (B4, passe parallèle du 2026-11-10)

Préparée le 2026-11-10 dans la copie de travail `D:\test-claude-b4\asm` (branche `b4/asm`).
Un seul agent tient tous les rôles (écriture, dosage, relecture, contre-relecture), l'un après
l'autre. Mesures de départ archivées dans `scratchpad/asm-depart/` (local, hors git) :
`biais.txt`, `rangs.txt`, `inverse.txt`, `lexique.txt`, `fetiche.txt`, `tics.txt`, `motq.txt`,
`questions.txt` (les 57 questions à plat). Sondes dans `scratchpad/asm-sonde/` et
`scratchpad/asm-corr/`, copiées de `tests-sonde` / `tests-corr` et pointées sur `pages/asm/`
(`controle.js` à vide : **0 indicateur déplacé sur 57 questions**), plus deux sondes neuves :
`qcheck.js` (applique des patchs en mémoire et montre, question par question, ce que chacune
des 44 stratégies désigne) et `dump.js` / `texte.js` (questions et corps à plat).

## Ce que le cours enseigne — établi en lisant les 15 leçons

- **Architecture x86-64**, 16 registres généraux, sous-registres `eax/ax/al`, `RFLAGS`
  (ZF, SF, CF, OF), registres `xmm` (SSE) en survol.
- **Syntaxe Intel, assembleur NASM** (`nasm -f elf64`, `ld`), destination à gauche ; la
  syntaxe AT&T n'apparaît que comme repoussoir (sortie par défaut de `gcc -S` et `objdump`).
- **Appels système Linux** (`syscall`, numéro dans `rax`, arguments `rdi rsi rdx r10 r8 r9`,
  `rcx` et `r11` détruits) et **ABI System V** pour les fonctions (`rdi rsi rdx rcx r8 r9`,
  retour `rax`/`xmm0`, callee-saved `rbx rbp r12–r15`, pile alignée sur 16 au `call`, red
  zone de 128 octets).
- Outils : `gcc -S/-c/-E`, `objdump -d -M intel`, `readelf`, `nm`, `size`, `ldd`, GDB
  (`stepi`, `x/nfu`), inline asm étendu de GCC, optimisations `-O0…-O3`.
- 15 leçons, **57 questions** : 3 par leçon et, sur `lecon-15`, 3 + **12 de bilan**
  (réponses très courtes : `rax`, `.text`, `syscall`, « 48 (en hexadécimal) »…).

## ✅ CE QUI SE PROUVE SE PROUVE — ET ICI, LE CODE S'EXÉCUTE SUR LE PROCESSEUR

Aucun assembleur n'était installé. Installé hors dépôt, dans `D:\outils-b4\asm\` :
- **NASM 3.02** portable officiel (`nasm.us/pub/nasm/releasebuilds/3.02/win64/`) ;
- **`asmrun`** (projet .NET 10, `D:\outils-b4\asm\runner\`) : il charge un binaire plat
  assemblé par NASM (`-f bin`) dans une page exécutable et l'**exécute sur le processeur de
  cette machine** (AMD64, Zen 5) ; la macro `VIDAGE n, repère` de `harnais.inc` copie les
  16 registres, `RFLAGS` et `xmm0–xmm3` sans les modifier. Lanceur :
  `bash D:/outils-b4/asm/lance.sh fichier.asm` (assemble, listing `.lst`, exécute).

**Ce qui s'exécute** : toute instruction de calcul, de pile (`push`, `pop`, `call`, `ret`),
d'adressage, de drapeaux, de saut, SSE ; l'encodage exact produit par NASM (listing).
**Ce qui ne s'exécute PAS** (Windows, pas de WSL) : les appels système Linux (`syscall`
read/write/exit), l'édition de liens (`ld`, `gcc`), un ELF, GDB, `objdump`, `readelf`,
`strace`, et **tout ce que fait `gcc`** (sortie de `-S`, optimisations `-O2`). Pour ceux-là :
la source (manuels Intel/AMD, ABI System V, manuels de NASM, GCC, GDB), et le mot
**« non exécuté »**.

**Erreurs classiques de débutant, toutes EXÉCUTÉES avant d'être écrites**
(`D:\outils-b4\asm\essai\l02.asm`, `preuves1.asm`, `preuves2.asm`, `facto.asm`) :

| croyance fausse | ce que le processeur (ou NASM 3.02) rend |
|---|---|
| `mov al, 0` remet tout `rax` à zéro | après `mov rax, -1` : `rax = 0xFFFFFFFFFFFFFF00` ; `mov ax, 0` → `0xFFFFFFFFFFFF0000` ; seul `mov eax, 0` donne `0` |
| `idiv` n'a besoin que de `eax` | `-7 / 2` avec `cdq` : quotient `eax = -3`, reste `edx = -1` ; `17 / 5` : `eax = 3`, `edx = 2` |
| `lea rax, [rbx]` lit la mémoire | `lea` rend l'adresse (`rcx = rbx`), `mov rax, [rbx]` rend le contenu (`0x1122334455667788`) |
| `cmp` range le résultat | après `cmp rcx, rsi` (3, 6) `rcx` vaut toujours 3 ; `sub` le change en `-3` ; `test rcx, rsi` fait `3 & 6 = 2` (ZF = 0) ; `mov` le remplace par 6 |
| `cmp rax, rbx` avec 7 et 7 met CF | `ZF = 1`, `CF = 0` ; `sete` → 1, `setne` → 0 |
| `jg` convient aux non-signés | `cmp eax, ebx` avec `0xFFFFFFFF` et 1 : `setg` → **0**, `seta` → **1**, `setl` → 1, `setb` → 0 |
| `push` fait monter `rsp` | deux `push` : `rsp` **diminue de 16** |
| le sommet de pile après `call` contient les arguments | il contient l'adresse de l'instruction qui suit le `call` (écart mesuré : 0) |
| `movsx` et `movzx` donnent la même chose | octet `0x80` : `movsx` → `0xFFFFFF80` (−128), `movzx` → `0x80` (128) |
| `xor rax, rax` ne touche pas les drapeaux | `rax = 0` et `ZF = 1` |
| `0.1 + 0.2` vaut `0.3` avec `addsd` | `0x3FD3333333333334` = 0.30000000000000004 ; `0.3` stocké = `…333` ; `ucomisd` + `sete` → 0 |
| `cvttsd2si` arrondit | 3.9 → **3** (troncature) ; `cvtsd2si` → **4** |
| `addss` traite quatre valeurs | `addss` : (11, 2, 3, 4) ; `addps` : (11, 22, 33, 44) |
| un `movq xmm0, rax` de l'entier 5 donne 5.0 | bits bruts : 2,5E-323 (un dénormal), pas 5.0 ; `cvtsi2sd` → 5.0 |
| `cvtsi2sd` écrit tout le registre `xmm` | la moitié haute reste intacte (33 et 44 toujours visibles) |
| `mov rax, 1` s'encode toujours avec `48` | **NASM 3.02 l'optimise en `mov eax, 1` : `B8 01 00 00 00`** ; avec `-O0` : `48 B8` + 8 octets ; `mov rax, rbx` → `48 89 D8` ; `mov rax, -1` → `48 C7 C0 FF FF FF FF` |
| `xor rax, rax` est l'encodage le plus court | `48 31 C0` (3 octets) ; `xor eax, eax` `31 C0` (2) ; `mov rax, 0` → `B8 00 00 00 00` (5) |
| `mov rax, ebx`, `mov [rsi], [rdi]`, `push eax`, `add xmm0, xmm1`, `mov xmm0, rax` passent | NASM : « invalid combination of opcode and operands » (et « instruction not valid with 32-bit operand size » pour `push eax`) |
| `clear rax`, `reset rax`, `jump x`, `goto x`, `invoke x` sont des instructions | NASM : « instruction expected » ; `mov rax, null`, `call os`, `int system` : « symbol not defined » |
| la factorielle reste alignée « toute seule » | appelant conforme : `rsp mod 16` au `call` récursif vaut **8, 0, 8** selon le niveau — un niveau sur deux est désaligné (`facto.asm`) |

## Pourquoi ce travail

Un apprenant qui ne comprend rien réussit **86,0 %** des QCM de `asm` en cochant l'option la
plus longue (87,7 % ex aequo compris). Relevé du 2026-11-10,
`node tools/mesure-biais-qcm.js --seul=asm` (57 questions, 12 de bilan) :

| indice | réussite | couverture | rendement |
|---|---:|---:|---:|
| **la plus longue** | **87,7 %** | 93,0 % | 92,5 % |
| la plus détaillée | 76,3 % | 71,9 % | 95,1 % |
| RESTREINDRE à la parenthèse | 75,0 % | 66,7 % | **100,0 %** |
| l'incise entre parenthèses | 72,4 % | 63,2 % | **100,0 %** |
| la seule avec une PONCTUATION FORTE (et RESTREINDRE) | 64,9 % / 65,2 % | 57,9 % | 93,9 % |
| le mot technique exclusif | 65,2 % | 54,4 % | 93,5 % |
| l'écho de la question | 54,8 % | 47,4 % | 85,2 % |
| RESTREINDRE aux deux-points | 53,1 % | 42,1 % | 91,7 % |
| ÉCARTER la moins bavarde | 42,8 % | 12,3 % | **100,0 %** |
| la seule avec un point-virgule (et RESTREINDRE) | 40,8 % / 41,1 % | 21,1 % | **100,0 %** |

**82,5 %** des questions (47 sur 57) sont trahies par **5 indices ou plus** sur 44.
Rangs **53 / 4 / 0 / 0**, cible **15 / 14 / 14 / 14** ; `plan-rangs-qcm` demande **10 529
caractères** sur **55 questions**. Bonne réponse **~110 caractères** en moyenne dans les
leçons 01-14, distracteur **~30** : le travail est de l'**ALLONGEMENT**.

## LA RÈGLE QUI PRIME SUR TOUTES LES MESURES

> **UN DISTRACTEUR EST UNE PHRASE FRANÇAISE QUI ÉNONCE UNE THÈSE FAUSSE, PRÉCISE ET
> PLAUSIBLE.** Si l'on ne peut pas dire en une phrase *pourquoi c'est faux*, ce n'est pas un
> distracteur.

L'assembleur a cet avantage sur les cours de méthode : presque tout s'y **prouve**. Un
distracteur qui annonce une valeur de registre, un drapeau, un encodage, un ordre d'arguments
ou un refus de NASM s'appuie sur la table exécutée ci-dessus ou sur un essai ajouté. Les
contresens réels du cours sont dans les encadrés « Piège fréquent » : confondre numéro de
syscall et argument, `r10` et `rcx`, écriture 32 bits et 8 bits, `shr` et `sar`, `jg` et
`ja`, `lea` et `mov`, caller-saved et callee-saved, section et segment, `stepi` et `step`,
`addss` et `addps`, `movaps` et `movups`, `cvttsd2si` et `cvtsd2si`. Donne à chaque
distracteur la MÊME STRUCTURE que la bonne réponse : la réponse fausse, PUIS sa justification
fausse mais cohérente. **Trois erreurs différentes, jamais le miroir de la bonne réponse.**

⚠️ **Pièges propres à ce cours** :
- une instruction qui « n'existe pas » doit être refusée par NASM (essayé) ; un registre
  « détruit » doit l'être par la documentation (`syscall` : `rcx`, `r11`, et `rax` qui reçoit
  le retour) ;
- un distracteur ne doit pas être vrai sur une AUTRE plateforme que le cours vise sans le
  dire (Windows x64 passe ses arguments dans `rcx rdx r8 r9` : « dans `rcx` » est faux pour
  Linux, vrai sous Windows — l'énoncé doit fixer le cadre, ou l'option le contredire) ;
- `ja` lit CF **et** ZF, `jg` lit ZF, SF **et** OF : ne fais pas reposer un distracteur sur
  une simplification de la page.

## Ce que tu dois tenir, dans l'ordre d'importance

1. **Longueur et rangs** : suis le rang visé par `plan-rangs-qcm` et sa bande de caractères ;
   le rang en MOTS de la bonne réponse vaut son rang en caractères (sinon « la moins
   bavarde » / « la plus dense » tranchent). **Attaque** : les quatre options commencent par
   le même type de mot, ou par quatre différents ; « Parce que » en tête d'un distracteur
   seulement si la bonne commence ainsi (22 distracteurs / 9 bonnes au départ).
2. **Ponctuation, et l'UNION** : par marque (`;`, `:`, incise entre parenthèses, tiret,
   barre oblique, guillemets « », flèche `→`, virgule décimale), les quatre options la
   portent, ou aucune. ⚠️ Le code porte de la ponctuation : `[rbx + rcx*4]` n'en porte
   pas, mais `edx:eax` porte un DEUX-POINTS, `(caller-saved)` une parenthèse, `cmp/je` une
   barre oblique. Compte-les. « La plus détaillée » compte `, : ;` : vise le même nombre.
3. **Les dix tics de lot** (`node tools/mesure-tics-lot.js asm --exemples`) : deux-points
   médian (23 bonnes / 8 distracteurs), **glose finale entre parenthèses (19 / 0)**,
   point-virgule médian (15 / 7), adverbe de reprise `alors/ensuite/puis` (6 / 0),
   connecteur causal (12 / 21), « de retour » (4 / 0), quatre segments séparés par virgule
   (4 / 1), « parce que » (9 / 19), « à la » (3 / 3), « la pile » (3 / 2). Le gabarit des
   bonnes réponses est « réponse : explication », « réponse ; conséquence » ou
   « réponse (glose) » : donne-le aux distracteurs, avec une glose qui PRÉCISE l'erreur.
4. **Mots fétiches** (`node tools/mesure-mot-fetiche.js asm`) : `mémoire` (6 / 5) et
   `valeur` (5 / 4) en alerte RESTREINDRE ; `adresse` 5 / 1, `registres` 5 / 2, `octets`,
   `retour`, `taille`, `argument` : ce sont les mots du sujet, pose-les AUSSI dans des
   distracteurs. `parce` (9 / 22) est déjà un mot de distracteur. Vise 1 bonne pour 3
   distracteurs environ.
5. **Mot technique exclusif** (65,2 %) : par mot de 9 lettres et plus, les quatre options le
   portent, ou deux, jamais une seule (`registres`, `processeur`, `instruction`, `adresse`
   n'en est pas : 7 lettres). Et **l'intrus lexical** (`mesure-mot-question --plan`) : chaque
   mot de 5 lettres et plus sur 0, 2 ou 4 options ; jamais trois distracteurs qui partagent
   un mot absent de la bonne réponse.
6. **Écho de l'énoncé** (54,8 %) : les quatre options reprennent le MÊME nombre de mots de
   4 lettres et plus de l'énoncé (`rax`, `rsp`, `call` font 3 ou 4 lettres : compte-les).
7. **Indice lexical** (`mesure-lexique-qcm --liste=asm` : 44 exploitables) : règle `k / k /
   k / k` (mots de 6+ lettres ABSENTS du corps de la page, comptés en OCCURRENCES) et, si
   `k > 0`, règle du `w` (même nombre de mots de 6+ lettres). Vérifie avec
   `node scratchpad/asm-corr/wk.js lecon-NN.html "texte"` ; un mot de moins de 6 lettres ne
   compte ni dans `w` ni dans `k`.
8. **Absolus** (`toujours`, `jamais`, `uniquement`, `seulement`, `aucun`, `rien`…) : 0, 2 ou
   3 porteurs par question, jamais 1. **Négation** : idem (`ne`, `pas`, `n'`, `aucun`).
9. **Point interne** : aucune option en deux phrases (aucune bonne réponse n'en a).
10. **Capitales** (deux capitales de suite, chiffres compris) : la liste `SIGLES` de l'outil
    reconnaît `CPU`, `RAM`, `ASCII`, `REX`, `XOR`, `ASM`, `LIFO`, `GNU`, `IEEE`, `CVE`,
    `NULL`, `AT` (de AT&T) — mais **PAS** `ABI`, `SIMD`, `SSE`, `AVX`, `ELF`, `GDB`, `NASM`,
    `GCC`, `ZF`, `CF`, `SF`, `OF`, `NX`, `ASLR`, `UB`, `PIE`, `RIP`, `LEA`, `RDTSC`, `TUI`,
    ni `O2` / `O0` (dans `-O2`) : ceux-là comptent comme MAJUSCULE d'emphase (vérifié en
    chargeant la liste de l'outil). Pose-les sur autant d'options que la bonne réponse.

## Contraintes de non-régression
1. **La bonne réponse, `q`, `correct` et `explain` sont INTOUCHABLES**, sauf bonne réponse
   prouvée fausse (par exécution) — alors corrigée, prouvée, et écrite en tête du rapport.
2. **JSON valide, sans BOM, en LF** (la copie de travail avait été extraite en CRLF par
   `core.autocrlf` : ramenée en LF, comme le dépôt, avant toute écriture) — garanti par
   `pose.js`. Jamais de heredoc pour un texte qui contient un antislash ou un `$`.
3. **Aucune URL externe** ajoutée.
4. Après chaque lot : `node scratchpad/asm-sonde/qcheck.js <patchs> --fichier=…`, puis
   `pose.js --ecrire`, `controle.js`, et **commit** sur `b4/asm`.

## Reprise du lexique (2026-11-10/11) : ce qui a marché

Résultat : 18 / 25 / 36 → **0 / 0 / 0**, un seul crédit déplacé sur 44 stratégies × 57
questions. Sonde : `scratchpad/asm-lex/essai.js` (locale) essaie en mémoire les retouches
**et** les phrases de corps (`{"fichier", "corps": "…"}`), et compare le **crédit** de
chaque stratégie, pas seulement sa désignation.

- Si la bonne réponse porte des mots que la page dit autrement, **une phrase vraie au
  corps** ramène k à 0 ; alors tout mot de moins de 6 lettres redevient libre dans les
  distracteurs, et la règle du w ne s'applique plus.
- Sinon, **k / k / k / k et w égal** au mot près.
- À chaque essai, vérifier quatre choses que le lexique ignore : le **compte** de mots
  exclusifs de 9 lettres et plus de chaque option ; l'**écho** de l'énoncé (« passe »,
  « valeurs », « sqrt », « niveau » sont dans des énoncés) ; la **négation** (« pas » est
  aussi un nom, « non signé » en porte une) ; les **égalités de longueur** qui portent un
  crédit (trois distracteurs à 149 caractères dans `lecon-10` q3).
