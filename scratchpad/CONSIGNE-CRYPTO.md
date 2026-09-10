# Consigne d'écriture — les QCM du cours `crypto` (B4, 40ᵉ cours)

Tu réécris **les distracteurs** des QCM d'un lot de leçons du cours `crypto` (chiffrement
symétrique et asymétrique, hachage et salage des mots de passe, HMAC et signatures, échange de
clés, TLS et certificats, aléa, gestion des secrets). La question, l'index `correct`, l'explication
et **le texte de la bonne réponse** sont **INTOUCHABLES** :
`tools/mesure-qcm-intouchable.js crypto <ref-git>` le contrôle et signalera toute atteinte.
Tu ne touches qu'aux **trois options fausses**.

## Pourquoi

Un apprenant qui ne comprend rien au cours réussit **89,7 %** des QCM de `crypto` en cochant
l'option la plus longue — couverture **100 %**, rendement **89,7 %**. **Ton lot doit ramener chaque
indice à 25 %, l'étalon du hasard.** On ne rend pas les questions plus difficiles : on rend les
**distracteurs crédibles**.

**68 questions sur 11 leçons** (dont **22 en QCM bilan**, dans `lecon-03` et `lecon-11`).

## ⚠️⚠️ LA CONTRAINTE QUI A COÛTÉ LE PLUS CHER — lis-la avant tout le reste

**ÉCRIS UNE THÈSE FAUSSE, PAS UNE SALADE DE MOTS.** Au 39ᵉ cours (`scala`), la relecture
adversariale a rendu **54 prises, dont 30 de ce seul type**. Pour atteindre la fenêtre de longueur,
les écrivains avaient remélangé le vocabulaire de la bonne réponse jusqu'au bon compte de
caractères, et le résultat ne voulait **rien dire** : « le type réel vient de la plateforme
virtuelle », « using la duplique », « chaque maillon abandonné reste invisible au calcul final de la
suite ». Sur **quatre questions, DEUX options sur quatre** étaient dans ce cas — la bonne réponse
devenait la seule phrase signifiante, et **un apprenant qui n'a jamais lu une ligne de code cochait
juste par élimination du charabia**.

Autrement dit : **le biais de longueur avait été fermé et remplacé par un biais de cohérence
sémantique, qui se mesure exactement au même endroit.** Aucun des 43 outils ne le voit.

**Relis chaque distracteur à voix haute.** S'il ne signifie rien, il ne trompe personne et il abîme
la leçon. Un bon distracteur est **une erreur que quelqu'un pourrait vraiment commettre** — en
cryptographie, elles sont nombreuses et bien connues : confondre chiffrer et hacher, croire qu'un
hachage se « déchiffre », croire que le sel doit rester secret, croire qu'un certificat chiffre,
confondre encodage (base64) et chiffrement, croire que TLS chiffre le nom de domaine.

## Ce que tu dois tenir, dans l'ordre d'importance

### (1) LA LONGUEUR — 89,7 %, couverture 100 %

`node tools/plan-rangs-qcm.js crypto` donne, question par question, la **fenêtre de caractères**
visée pour chaque distracteur. **48 questions sur 68** sont à retoucher, soit **5 255 caractères**.
La bonne réponse est **61 fois au rang 0** (rangs 61/4/0/3) ; l'outil vise **17 / 17 / 17 / 17**.

⚠️ **VISE LA FENÊTRE, PAS « PLUS LONG »**. Écraser « la plus longue » ne fait que **déplacer** le
biais d'un rang : sur `sql`, la bonne réponse mise au rang 1 partout rendait 60,9 % à qui cochait
« la deuxième plus longue ».

⚠️ **SIMULE AVANT D'ÉCRIRE.** Compte les caractères en JS (`[...s].length`, un accent compte 1).
**La moitié des textes proposés sans simulation cassent la fenêtre.**

⚠️⚠️ **UN DISTRACTEUR NE DOIT JAMAIS FAIRE EXACTEMENT LA LONGUEUR DE LA BONNE RÉPONSE** :
`plan-rangs-qcm` teste `plusLong = len > bon`, donc à `len === bon` l'option est classée « plus
courte » et sa fenêtre s'arrête à `bon − 1` — hors bande d'un seul caractère.

⚠️⚠️ **NE « CORRIGE » PAS UN RANG QUI TE PARAÎT FAUX.** La cible est **17/17/17/17 sur le cours** :
la bonne réponse est volontairement la plus courte sur 17 questions. Sur `typescript`, **quatre
relecteurs sur cinq** ont signalé « l'indice de longueur est rouvert ici » — les quatre avaient
tort. **Un lot de 12 questions ne peut pas afficher 25 %.**

### (2) LA PLUS DÉTAILLÉE — 69,7 %, rendement 88,4 %

La bonne réponse ne doit pas être la seule à donner un exemple, un nom d'algorithme, un chiffre.
**Fais porter du concret FAUX à tes distracteurs** : une taille de clé plausible mais fausse, un
algorithme employé pour la mauvaise chose (AES pour signer, SHA-256 pour chiffrer), une propriété
inventée d'un mode opératoire.

### (3) LA SEULE QUI NIE — 45,3 %, couverture 38,2 %

L'option seule à porter une négation (« ne », « pas », « jamais », « aucun ») est la bonne 2 fois
sur 3. Un correcteur qui rédige la bonne réponse comme un **démenti de l'idée reçue** laisse cette
trace. Règle : **par marque, les quatre options la portent, ou aucune.**

### (4) LA SEULE AVEC UN TIRET — 40,8 %, rendement **100 %**

Elle ne se trompe jamais sur ce cours. Le tiret d'explication (cadratin ou demi-cadratin) doit être
porté par les quatre options ou par aucune. ⚠️ Ne l'isole pas du reste : la **PONCTUATION FORTE EN
UNION** (« : » ou « ; » ou tiret) a rendu **91,7 % sur 1 689 questions** au cours `dataviz`.
**Par marque, les quatre ou aucune** — deux-points compris, et le point-virgule (27,9 %,
rendement 75,0 %).

### (5) LE MOT TECHNIQUE EXCLUSIF — 37,3 %, couverture 67,6 %

La bonne réponse ne doit pas être la seule à employer un mot long qu'aucune autre n'emploie.
⚠️⚠️ **NE LE FERME PAS À FOND — mesuré au 39ᵉ cours :** l'écraser l'a fait tomber à **13,3 %** en
direct, ce qui a porté sa lecture INVERSE à **28,9 %**, au-dessus du seuil. Les correcteurs
n'avaient pas fermé l'indice, ils l'avaient **RETOURNÉ**. **Vise l'égalité (25 %), pas zéro.**
⚠️ Et le piège dans le piège : le mot que tu écris **pour remplacer** un mot exclusif peut être
exclusif à son tour. Sur `scala`, « programme » (9 lettres) a rouvert l'indice qu'il devait fermer.
La stratégie compte les mots de **9 lettres et plus** ; vérifie la longueur de ce que tu ajoutes.

### (6) L'ÉCHO DE L'ÉNONCÉ — 29,0 %, couverture 55,9 %

**LES QUATRE OPTIONS PORTENT LE MÊME NOMBRE DE MOTS D'ÉCHO** (mots de 4 lettres et plus repris de
l'énoncé, comptés en ENSEMBLE). C'est une **égalité**, pas une inégalité.

### (7) L'INDICE LEXICAL — **58 questions EXPLOITABLES sur 68**, et **68 sur 68 à mettre en forme**

Un apprenant qui cherche au clavier (Ctrl+F) **les mots de chaque option dans la page** réussit.

**RÈGLE DU `k`** : soit `k` le nombre de mots de **6 lettres et plus absents de la page** que porte
la bonne réponse (intouchable). **Les trois distracteurs en portent EXACTEMENT `k`.**
- `k = 0` → `0 / 0 / 0` · `k > 0` → `k / k / k`
Ne mets **pas** les trois à zéro quand `k > 0` : ça retourne l'indice (100 % sur `mobile`). Et
`0 / 0 / k` laisse **exactement 50 %** à qui restreint son tirage aux deux options les plus
étrangères. **Seule l'égalité des quatre ferme les deux lectures.**

**RÈGLE DU `w`, et elle NE SE DÉDUIT PAS DU `k`.** Soit `w` le nombre de mots de 6 lettres et plus
de la bonne réponse : **ou les quatre options portent le même `w`, ou au moins un distracteur en
porte strictement plus.** C'est `w`, pas `k`, qui ferme la stratégie PROPORTION.

⚠️ **CONSTITUE LE DICTIONNAIRE DE LA PAGE AVANT DE RÉDIGER, pas après.** Un écrivain du 35ᵉ cours a
perdu un tour complet faute de l'avoir fait. ⚠️ Le dictionnaire se prend sur le **corps** de la
page, blocs de QCM exclus — un mot présent ailleurs dans le fichier ne compte pas. Et l'outil compte
les **occurrences**, pas les mots distincts : un mot écrit deux fois compte deux fois.

Outil : `node tools/mesure-lexique-qcm.js --liste=crypto`. Cible : **0 exploitable ET 0 à mettre en
forme**.

### (8) LE MOT FÉTICHE — `crypto` en porte CINQ au-dessus du seuil

`node tools/mesure-mot-fetiche.js crypto` les liste. Les plus rentables :

| mot | bonnes / distracteurs | RESTREINDRE |
|---|---:|---:|
| `chaque` | 9 / 5 | **34,1 %** |
| `compte` | 6 / 0 | **32,8 %** |
| `chiffré` | 8 / 8 | **31,2 %** |
| `jamais` | 5 / 2 | **30,2 %** |
| `secret` | 5 / 6 | 28,4 % |

**La règle est celle des marques : par mot, les quatre options le portent, ou aucune.**
⚠️ **Quand c'est la BONNE réponse qui porte le mot — et elle est intouchable — on l'AJOUTE aux
distracteurs.** Le retirer d'eux laisserait la bonne réponse seule à le porter et **retournerait
l'indice à 100 %**.
⚠️ Attention au **SINGULIER/PLURIEL** : pour l'outil de l'intrus lexical, `clé` et `clés` sont deux
jetons différents. Ajouter « valeur » quand la bonne réponse porte « valeurs » ouvre une
configuration 3/4 tout en laissant les deux outils verts — c'est arrivé au 39ᵉ cours.

### (9) ⚠️ L'INTRUS LEXICAL — le 45ᵉ indice

`node tools/mesure-mot-question.js crypto --liste`. Sur `crypto`, **1 question** est tranchée à coup
sûr par la lecture PAR DÉFAUT.

Pour **une** question, un mot porté par **toutes les options sauf une** désigne cette option.
Règle : **par mot, les quatre options le portent, ou aucune** — appliquée **question par question**.
Détail complet dans `scratchpad/REGLE-INTRUS-LEXICAL.md`.

⚠️ **`mesure-mot-fetiche` NE LE VOIT PAS** : il exige qu'un mot tranche ≥ 8 questions. **Lance les
deux outils, aucun ne remplace l'autre.** Et **lis la colonne « sûres », pas la colonne « taux »** :
le taux peut être sous 25 % pendant que des questions sont ouvertes à 100 %.

⚠️ **LA SEULE MANŒUVRE SÛRE EST L'AJOUT, PAS LE RETRAIT.** Retirer un mot pour fermer un 3/4 le fait
passer à 2/4… ou à 1/4, ce qui rouvre la lecture PAR EXCÈS.

⚠️ **NE CRÉE PAS UN 3/4 DONT L'INTRUS SERAIT LA BONNE RÉPONSE** : elle est intouchable, donc
l'indice devient irrattrapable.

### (10) Les marques à ne pas ouvrir

**MAJUSCULE d'emphase** (32,4 % ici — et la stratégie **COMPTE** les capitales, elle ne teste pas
leur présence : écrire `RSA` deux fois quand les autres l'écrivent une fois suffit à trancher),
**virgule décimale**, **flèche**, **nom d'outil ou de bibliothèque** (`OpenSSL`, `bcrypt`, `Argon2`,
`Let's Encrypt`) : sur `dataviz`, **0 bonne réponse sur 68** en portait contre 17 distracteurs — la
règle « écarter l'option qui nomme un outil » n'avait **jamais** tort.

## Les six contraintes de non-régression

1. **La bonne réponse est intouchable** — `q`, `correct`, `explain` et son texte.
2. **La fenêtre de caractères** de `plan-rangs-qcm`, simulée avant d'écrire.
3. **Par marque : les quatre options, ou aucune** — ponctuation, mots fétiches, ET mots d'une
   seule question (l'intrus lexical).
4. **`k / k / k / k`** sur les mots étrangers à la page, et le `w` fermé séparément.
5. **Le distracteur reste FAUX en cryptographie** — c'est la plus importante après la n° 6. Le coût
   mesuré d'un distracteur devenu vrai est de **1,68 réécriture**. Sur `swift`, **25 distracteurs
   sur 198** l'étaient ; sur `scala`, **sept**, dont un qui répondait exactement à la question posée.
   ⚠️ En cryptographie, une phrase peut être vraie **dans un autre contexte** : « AES-256 est plus
   sûr qu'AES-128 » est défendable, « un hachage est irréversible » est vrai. Demande-toi toujours :
   *existe-t-il une lecture où cette phrase est exacte ?*
6. ⚠️⚠️ **ÉCRIS UNE THÈSE FAUSSE, PAS UNE SALADE DE MOTS** — voir en tête de cette consigne.

## Vrai en cryptographie, donc jamais employable comme distracteur

Le chiffrement est réversible avec la clé, le hachage ne l'est pas ; un sel n'a pas besoin d'être
secret, il doit être unique par utilisateur ; `bcrypt`, `scrypt` et `Argon2` sont lents **par
conception** ; SHA-256 n'est **pas** un algorithme de mot de passe (trop rapide) ; le chiffrement
symétrique emploie la même clé des deux côtés, l'asymétrique une paire ; on chiffre avec la clé
**publique** et on déchiffre avec la **privée**, on signe avec la **privée** et on vérifie avec la
**publique** ; un certificat **lie** une identité à une clé publique, il ne chiffre rien ; base64
est un **encodage**, pas un chiffrement ; TLS protège le contenu mais le **SNI** expose le nom de
domaine ; un IV ne doit jamais être réutilisé avec la même clé en CTR/GCM ; ECB laisse voir les
motifs ; un HMAC prouve l'intégrité **et** l'authenticité, un simple hachage seulement l'intégrité ;
la comparaison de secrets doit être à **temps constant** ; l'aléa doit venir d'un CSPRNG.

## Le contrôle d'après, à citer dans ton compte rendu

```
node tools/mesure-biais-qcm.js --seul=crypto           # les 43 strategies, sens direct
node tools/mesure-biais-inverse.js --toutes crypto     # les 42, sens INVERSE (colonne GLOBAL)
node tools/mesure-lexique-qcm.js --liste=crypto        # 0 exploitable ET 0 a mettre en forme
node tools/mesure-mot-fetiche.js crypto                # 0 alerte
node tools/mesure-mot-question.js crypto --liste       # 0 question « sure », les DEUX lectures
node tools/mesure-qcm-longueurs.js crypto              # rangs, cible 17/17/17/17
node tools/mesure-qcm-intouchable.js crypto <ref>      # 0 atteinte
```

**Cible : 25 % dans les DEUX sens, sur les 43 stratégies — 0 mot fétiche, et 0 question « sûre ».**

## ⚠️ Ce que la passe du 39ᵉ cours a appris sur la MÉTHODE, et qui vaut pour toi

1. **La contradiction adversariale doit elle-même être contredite.** Deux correcteurs de `scala` ont
   réfuté, preuve à l'appui, une prise de leur relecteur — dont une qui aurait remplacé un bon piège
   par une salade de mots. Un remède proposé n'est pas un ordre : évalue-le, et si tu le rejettes,
   écris la preuve.
2. **Fermer un indice en rouvre un autre — mesuré quatre fois en une passe.** Fermer les absolus a
   ouvert la ponctuation, puis la densité ; fermer le mot exclusif a ouvert le `k`, puis le `w`,
   puis lui-même. **Après chaque retouche, rejoue les six mesures**, pas seulement celle que tu
   visais.
3. **Corriger un CORPS de leçon rouvre l'indice lexical** : le dictionnaire de la page change, donc
   la règle du `k` des QCM de cette page peut sauter. Corrige le corps d'abord, le QCM ensuite.
