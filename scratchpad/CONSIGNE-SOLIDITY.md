# Consigne d'écriture — les QCM du cours `solidity` (B4, 33ᵉ cours)

Tu réécris **les distracteurs** des QCM d'un lot de leçons du cours `solidity` (contrats
intelligents pour la machine virtuelle Ethereum). La question, l'index `correct`, l'explication et
**le texte de la bonne réponse** sont **INTOUCHABLES** : un vérificateur
(`tools/mesure-qcm-intouchable.js`) le contrôle et signalera toute atteinte. Tu ne touches qu'aux
**trois options fausses** de chaque question.

## Pourquoi

Un apprenant qui ne comprend rien au cours réussit **97,1 %** des QCM de `solidity` en cochant
simplement **l'option la plus longue** (rendement **98,5 %**, couverture 97,1 %). C'est le cours le
plus nocif du site après ceux déjà traités. Ce n'est pas le seul indice : **onze** autres stratégies
mécaniques dépassent largement le hasard, dont **huit à 100 % de rendement**.
**Ton lot doit ramener chaque indice à 25 %, l'étalon du hasard.** On ne rend pas les questions plus
difficiles : on rend les **distracteurs crédibles**.

## Ce que tu dois tenir, dans l'ordre d'importance

### (1) LA LONGUEUR — 97,1 %, rendement 98,5 %

`node tools/plan-rangs-qcm.js solidity` te donne, question par question, la **fenêtre de
caractères** visée pour chaque distracteur. Sur ce cours, **66 questions sur 68** sont à retoucher,
soit **12 108 caractères** à écrire. La bonne réponse est aujourd'hui **67 fois au rang 0** (la plus
longue) ; l'outil vise la répartition **17 / 17 / 17 / 17**.

⚠️ **VISE LA FENÊTRE, PAS « PLUS LONG »**. Écraser « la plus longue » ne fait que **déplacer** le
biais d'un rang : sur le cours `sql`, la bonne réponse mise au rang 1 partout rendait **60,9 %** à
qui cochait « la deuxième plus longue ». C'est pour ça que l'outil demande une **répartition**.

⚠️ **SIMULE AVANT D'ÉCRIRE.** Compte les caractères en JS (`[...s].length`, un accent compte 1).
**La moitié des textes proposés sans simulation cassent la fenêtre.** Un script Node jetable qui
vérifie les cinq contraintes coûte moins cher qu'une reprise.

### (2) LA PLUS DÉTAILLÉE — 65,2 %, rendement **100 %**

La bonne réponse ne doit pas être la seule à donner un exemple, un nom de fonction, une valeur, un
type. **Fais porter du concret à tes distracteurs** — du concret qui dit quelque chose de **faux**.
Avec la longueur, c'est l'indice le plus payant du cours : il ne s'est jamais trompé (51,5 % de
couverture, 100 % de rendement).

### (3) LES MARQUES DE PONCTUATION — trois indices à **100 % de rendement**

- `RESTREINDRE à la parenthèse` : **62,9 %**, rendement **100 %** sur la moitié des questions ;
  `l'incise entre parenthèses` : **60,7 %**, rendement **100 %**, et **33 questions** où la bonne
  réponse est SEULE en tête. `node tools/plan-rangs-qcm.js solidity --incise` donne la liste.
  Formulation exacte de la règle, apprise sur `java` : **autant d'incises que la bonne réponse** —
  et non « pas la seule à en porter » (cette formulation molle laissait l'indice à 39,9 %).
- `RESTREINDRE aux deux-points` : **41,5 %**, rendement **100 %**.
- `la seule avec un point-virgule` / `RESTREINDRE au point-virgule` : **39,3 / 39,7 %**, rendement
  **100 %**. Corriger est bon marché — tu **ajoutes** un `;` dans des distracteurs.
- Densité globale : la bonne réponse est **la seule la plus ponctuée 35 fois sur 68 (51,5 %)**.
  `--ponctuation` donne le détail.

⚠️ **« Au moins un distracteur porte la marque » NE SUFFIT PAS** — c'est le plafond trouvé sur
`data-eng` : il reste **50 %** à l'apprenant qui **RESTREINT** son tirage aux options marquées.
**Par marque : ou les quatre options la portent, ou aucune.**

### (4) LE MOT TECHNIQUE EXCLUSIF — 58,8 %, rendement 76,2 %

Le vocabulaire du métier (`gas`, `revert`, `require`, `modifier`, `mapping`, `storage`, `memory`,
`calldata`, `payable`, `msg.sender`, `msg.value`, `event`, `emit`, `fallback`, `receive`,
`delegatecall`, `réentrance`, `proxy`, `ERC-20`, `ERC-721`, `wei`, `immuable`, `déploiement`…) ne
doit pas n'apparaître que dans la bonne réponse : **au moins deux distracteurs emploient du
vocabulaire du même registre**, en disant quelque chose de faux.

⚠️ Cet indice **MONTE** quand on écrit du français naturel avec le vocabulaire du cours (mesuré sur
`mobile` : 25,0 % → 42,5 %). Surveille-le après écriture. ⚠️ Et il a un **INVERSE** mesuré depuis le
cours `c` : ne laisse pas non plus **un distracteur seul** porter un mot long que personne d'autre
n'emploie — la stratégie `ECARTER le mot technique exclusif` est dans l'outil.

### (5) L'INDICE LEXICAL — **61 questions EXPLOITABLES sur 68**, 66 à mettre en forme

Un apprenant qui cherche au clavier (Ctrl+F) **les mots de chaque option dans la page** réussit.
C'est le pire chiffre relevé jusqu'ici sur un cours entrant.

**RÈGLE DU `k`** : soit `k` le nombre de mots de **6 lettres et plus absents de la page** que porte
la bonne réponse (intouchable). **Les trois distracteurs en portent EXACTEMENT `k`.**
- `k = 0` → `0 / 0 / 0`
- `k > 0` → `k / k / k`

Ne mets **pas** les trois à zéro quand `k > 0` : ça retourne l'indice (variante INVERSE, mesurée à
**100 %** sur `mobile`). Et l'ancienne règle `0 / 0 / k` laisse **exactement 50 %** à qui restreint
son tirage aux deux options les plus étrangères. **Seule l'égalité des quatre ferme les deux
lectures.**

**RÈGLE DU `w`** (trouvée sur `ocaml`) : à `k` égal, la part de mots présents `(w - k) / w` **croît
avec `w`**, le nombre de mots longs. Donc si la bonne réponse porte à elle seule le plus de mots
longs, elle reste désignée **avec des `k` parfaitement égaux**. Ou les quatre options portent le
même nombre de mots longs, ou **au moins un distracteur en porte strictement plus** que la bonne
réponse. (Sans objet quand `k = 0`.)

Outil : `node tools/mesure-lexique-qcm.js --liste=solidity` — il liste les questions non conformes,
option par option, avec les mots fautifs.

### (6) LA MOINS BAVARDE, À L'ENVERS — `ECARTER la moins bavarde` : 42,0 %, rendement **100 %**

Il suffit d'**écarter** l'option la plus courte pour gagner. Ne laisse pas un distracteur nettement
plus maigre que les trois autres : la fenêtre de longueur du plan te le règle si tu la respectes
vraiment. Même chose pour `la moins bavarde` à **1,1 %** — un taux **sous** le hasard est un indice
**inverse**, pas un indice fermé.

### (7) L'ÉCHO DE L'ÉNONCÉ — 44,5 %, rendement 74,1 %

La bonne réponse ne doit pas être la seule à reprendre les mots de la question : fais-les reprendre
par **UN seul** distracteur. ⚠️ **Pas par les trois** : sur `data-eng` l'écho s'est RETOURNÉ
(40,8 % → 11,3 %) et « écarter l'option la plus écho » a rendu **30,4 %**. Cette règle inverse est
**dans le cliquet** : un lot qui met l'écho à zéro partout fera échouer la chaîne.

### (8) LES AUTRES MARQUES — `node tools/plan-rangs-qcm.js solidity --marques`

- **MAJUSCULE d'emphase** : **33,8 %**, rendement **100 %**. Pas de mot en capitales exclusif à la
  bonne réponse.
- **guillemets** : rendement **100 %**, dont `lecon-16` q4 où la bonne réponse est seule à porter
  des guillemets français. **Les quatre ou aucune.**
- **point interne** (option écrite en deux phrases) : rendement **100 %**. C'est l'indice le plus
  fort du site (99,0 % sur 308 questions). Si la bonne réponse est en deux phrases, **écris tes
  trois distracteurs en deux phrases** — c'est aussi la façon la plus naturelle d'atteindre la
  fenêtre de longueur.
- **tiret** et **deux phrases** : 26,1 %, rendement **100 %** sur les rares questions couvertes.

Cible : **les quatre ou aucune.**

### (9) Les indices mineurs à ne pas RECRÉER

- **La négation** (37,4 %, rendement 56,0 %) : n'écris pas la négation uniquement dans la bonne
  réponse, ni des distracteurs tous positifs quand la bonne réponse nie.
- **La plus prudente** (30,9 %, rendement 58,3 %) : ne réserve pas la nuance (« souvent », « en
  général », « selon la version du compilateur ») à la bonne réponse, et n'accumule pas les absolus
  (« toujours », « jamais », « aucun ») dans les seuls distracteurs.
- **L'attaque unique** : ne fais pas commencer tous tes distracteurs par le même mot. ⚠️ Ce cours
  en est déjà plein — beaucoup de distracteurs commencent par « Parce que… » ou « Pour… ». Un
  connecteur causal répété est un tic que nos vagues ont déjà fabriqué sur `nodejs` (1/7 → 9/9).
- **La casse** : ne fais pas commencer les distracteurs par une minuscule quand la bonne réponse
  commence par une majuscule, ni l'inverse. ⚠️ `mesure-lexique-qcm` met en minuscules avant de
  comparer, donc **la casse n'est mesurée par rien** de ce côté — c'est à toi de la tenir.
- **Le point final** : ne termine pas tout ton lot par le même signe. Sur `react`, le point final
  valait **100 % sur le lot** d'un seul écrivain.

## Méthode

1. **Lis tes leçons en entier** (corps + QCM) : un distracteur ne peut pas être écrit sans le
   contenu enseigné, et l'indice lexical se calcule sur le texte de la page.
2. Récupère ton plan : `node tools/plan-rangs-qcm.js solidity --json` puis filtre sur tes fichiers ;
   idem `--incise`, `--ponctuation`, `--marques`, et
   `node tools/mesure-lexique-qcm.js --liste=solidity`.
3. Réécris les distracteurs question par question. **SIMULE AVANT D'ÉCRIRE** : compte les
   caractères, les marques, la ponctuation et les mots de 6 lettres et plus absents de la page.
4. **Écris avec un script Node** qui relit le bloc `data-quiz`, remplace les seules options fausses
   et réécrit le fichier. **N'écris pas le JSON à la main.** Après chaque fichier, vérifie que le
   bloc se reparse (`JSON.parse`). ⚠️ **N'écris pas ce script avec un *heredoc*** : le shell de
   cette machine mange un niveau d'antislash, ce qui a déjà corrompu deux outils de mesure
   silencieusement. Utilise l'outil d'écriture de fichier.
5. Après écriture, relance `plan-rangs-qcm solidity` (tes questions au rang cible), `--incise`,
   `--ponctuation`, `--marques`, `mesure-lexique-qcm --liste=solidity` et `node tools/verif-html.js`.
6. Rends un compte rendu : questions traitées, distracteurs réécrits, rangs obtenus, **et la liste
   de ce que tu n'as pas pu tenir avec la raison**. ⚠️ Sur `mobile`, c'est cette dernière section
   qui a révélé le retournement de l'indice lexical : **elle rapporte plus que la consigne**.

## Trois interdits absolus

⚠️ **UN DISTRACTEUR NE DOIT JAMAIS DEVENIR VRAI.** C'est la faute la plus grave possible : elle crée
une question à deux bonnes réponses, et l'apprenant qui comprend est puni. Chaque option que tu
écris doit être **fausse au regard de Solidity et de l'EVM réels**, et fausse **franchement** — pas
« fausse par une nuance ». Le cours `c` vient de montrer le coût de l'inattention : un distracteur y
énonçait, sans le vouloir, **exactement ce que dit la norme du langage**. Méfie-toi ici des pièges
classiques : `require`/`revert`/`assert` et leur remboursement de gas, `storage` contre `memory`
contre `calldata`, l'immuabilité du code déployé **contre** la mutabilité de l'état, `msg.sender`
sous un `delegatecall` (c'est l'appelant d'origine du contexte, pas le contrat intermédiaire), les
`event` qui **ne sont pas lisibles** depuis un contrat, l'absence de nombres à virgule, le
dépassement qui **revert** depuis la version 0.8 (et ne « boucle » plus), `tx.origin` contre
`msg.sender`, et le fait qu'une variable `private` **reste lisible** sur la chaîne.

⚠️ **NE MODIFIE RIEN D'AUTRE** : ni la question, ni `correct`, ni `explain`, ni le texte de la bonne
réponse, ni le corps de la leçon, ni un autre fichier que ceux de ton lot. Deux agents qui écrivent
dans le même fichier se détruisent mutuellement. **Ne fais aucun `git` — aucun `add`, aucun
`commit`, aucun `stash`, aucun `checkout`.**

⚠️ **AUCUN COMPILATEUR SOLIDITY N'EST INSTALLÉ** (`solc` introuvable, et le site est hors ligne). Tu
ne peux donc pas exécuter un extrait pour trancher. **N'invente aucune sortie.** Si tu veux écrire
un distracteur qui cite une valeur produite par du code, raisonne **par le langage**, pas de
mémoire. En cas de doute, choisis un distracteur qui porte sur un **mécanisme** plutôt que sur une
**valeur**.

⚠️ **Si le corps d'une leçon de ton lot est faux** (une sortie annoncée que le langage ne produit
pas, un contresens), **signale-le dans ton compte rendu** — mais **ne le corrige pas** : modifier le
corps change le vocabulaire de la page et donc le calcul de l'indice lexical de tout le lot.
