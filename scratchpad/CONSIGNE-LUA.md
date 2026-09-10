# Consigne d'écriture — les QCM du cours `lua` (B4, 36ᵉ cours)

Tu réécris **les distracteurs** des QCM d'un lot de leçons du cours `lua` (le langage Lua :
tables, métatables, coroutines, closures, modules, `pcall`, LuaJIT, embarquement dans un hôte C).
La question, l'index `correct`, l'explication et **le texte de la bonne réponse** sont
**INTOUCHABLES** : `tools/mesure-qcm-intouchable.js` le contrôle et signalera toute atteinte. Tu ne
touches qu'aux **trois options fausses** de chaque question.

## Pourquoi

Un apprenant qui ne comprend rien au cours réussit **88,9 %** des QCM de `lua` en cochant
simplement **l'option la plus longue** — couverture **100 %**, sans un seul ex æquo. C'est le cours
le plus nocif du site parmi les 52 qui restent. Et **onze autres stratégies mécaniques rendent
plus de 97 %**, dont sept à **100 %**.
**Ton lot doit ramener chaque indice à 25 %, l'étalon du hasard.** On ne rend pas les questions plus
difficiles : on rend les **distracteurs crédibles**.

## Ce que tu dois tenir, dans l'ordre d'importance

### (1) LA LONGUEUR — 88,9 %, couverture 100 %

`node tools/plan-rangs-qcm.js lua` donne, question par question, la **fenêtre de caractères** visée
pour chaque distracteur. **63 questions sur 72** sont à retoucher, soit **14 613 caractères** à
écrire — le plus gros volume d'un cours depuis le début de B4. La bonne réponse est **64 fois au
rang 0** ; l'outil vise **18 / 18 / 18 / 18**.

⚠️ **VISE LA FENÊTRE, PAS « PLUS LONG »**. Écraser « la plus longue » ne fait que **déplacer** le
biais d'un rang : sur `sql`, la bonne réponse mise au rang 1 partout rendait **60,9 %** à qui
cochait « la deuxième plus longue ». C'est pour ça que l'outil demande une **répartition**.

⚠️ **SIMULE AVANT D'ÉCRIRE.** Compte les caractères en JS (`[...s].length`, un accent compte 1).
**La moitié des textes proposés sans simulation cassent la fenêtre.**

### (2) LA PONCTUATION FORTE — 63,5 %, rendement **100 %**, 37 questions

⚠️ **STRATÉGIE NEUVE, câblée le 2026-09-08 (40ᵉ), et c'est le plus gros indice de ce cours après la
longueur.** Elle regarde l'**UNION** de trois marques : « `:` », « `;` » et le **tiret cadratin**.
Sur les 6 167 questions du site elle rend **91,7 % sur 1 689 questions** ; sur `lua` elle **tranche
sur 37 questions et ne se trompe jamais**.

**La règle, et elle suffit à fermer aussi les marques prises une par une** : *par marque, ou les
quatre options la portent, ou aucune*. Sur les 20 cours déjà traités, appliquer cette règle a fait
tomber l'union à **46,1 %** sans qu'on l'ait jamais visée ; sur les 56 cours non traités elle vaut
**96,9 %**.

Les marques prises isolément sur ce cours : point-virgule **49,0 %** (rendement 100 %), deux-points
**44,6 %** (100 %), tiret **26,4 %** (100 %), point interne **29,2 %** (100 %), guillemets **26,0 %**
(100 %). Toutes se ferment par la même règle.

### (3) LA PLUS DÉTAILLÉE — 75,7 %, rendement **98,0 %**

La bonne réponse ne doit pas être la seule à donner un exemple, un nom de fonction, un chiffre.
**Fais porter du concret à tes distracteurs** — du concret **faux** : une fonction de la
bibliothèque standard employée pour la mauvaise chose, une métaméthode invoquée au mauvais moment,
un comportement de `pcall` inventé.

### (4) L'INCISE ENTRE PARENTHÈSES — 61,1 %, rendement **97,2 %**

`node tools/plan-rangs-qcm.js lua --incise` donne les **36 questions** concernées. Formulation
exacte de la règle, apprise sur `java` : **autant d'incises que la bonne réponse** — et non « pas
la seule à en porter » (cette formulation molle laissait l'indice à 39,9 %).

⚠️ **« Au moins un distracteur porte la marque » NE SUFFIT PAS** — plafond trouvé sur `data-eng` :
il reste **50 %** à qui **RESTREINT** son tirage aux options marquées.
**Par marque : ou les quatre options la portent, ou aucune.**

### (5) LA BARRE OBLIQUE — 28,8 %, rendement **80,0 %**, 5 questions

⚠️ **STRATÉGIE NEUVE (39ᵉ), câblée le même jour.** Elle rend **79,7 % sur 434 questions du site** et
n'était couverte par aucun outil. Cause : la bonne réponse est celle qui doit nommer une alternative
ou un couple (« clé / valeur », « lecture / écriture »), et le raccourci typographique ne vient sous
la plume que là où il y a deux choses à nommer d'un coup. Même règle : les quatre ou aucune.

### (6) LES MARQUES À NE PAS OUVRIR

- **virgule décimale** (`4,5`) : à **0** aujourd'hui sur ce cours. Elle rend 55,4 % sur le site et
  **100 % sur `crypto`** : **ne l'ouvre pas.** Si la bonne réponse écrit un seuil à décimale, les
  trois distracteurs en écrivent un aussi — et **la série ne doit être ni régulière ni ordonnée
  autour de la bonne réponse** (sur `a11y`, corriger la virgule a fabriqué « prendre le plus grand
  nombre » à 100 % sur la question).
- **flèche** (`→`, `->`) : attention, `->` est du code dans certains langages ; ici, n'en introduis
  pas dans un seul distracteur.
- **approximateur** (`~`, `≈`, « environ », « près de ») : **2 questions à 100 %** aujourd'hui.
  65,0 % de rendement sur le site. Même règle des quatre ou aucune.
- **nom d'outil, de bibliothèque ou d'auteur** (`luarocks`, `LuaJIT`, un nom propre) : sur `dataviz`,
  **0 bonne réponse sur 68** en portait, contre 17 distracteurs — la règle « écarter l'option qui
  nomme un outil » n'avait **jamais tort**. Vérifie-le sur ton lot et applique les quatre ou aucune.

### (7) L'INDICE LEXICAL — **59 questions EXPLOITABLES sur 72**, 62 à mettre en forme

Un apprenant qui cherche au clavier (Ctrl+F) **les mots de chaque option dans la page** réussit.

**RÈGLE DU `k`** : soit `k` le nombre de mots de **6 lettres et plus absents de la page** que porte
la bonne réponse (intouchable). **Les trois distracteurs en portent EXACTEMENT `k`.**
- `k = 0` → `0 / 0 / 0`
- `k > 0` → `k / k / k`

Ne mets **pas** les trois à zéro quand `k > 0` : ça retourne l'indice (variante INVERSE, **100 %**
sur `mobile`). Et `0 / 0 / k` laisse **exactement 50 %** à qui restreint son tirage aux deux options
les plus étrangères. **Seule l'égalité des quatre ferme les deux lectures.**

**RÈGLE DU `w`, et elle NE SE DÉDUIT PAS DU `k`.** Soit `w` le nombre de mots de 6 lettres et plus
de la bonne réponse : **ou les quatre options portent le même `w`, ou au moins un distracteur en
porte strictement plus.** C'est `w`, pas `k`, qui ferme la stratégie PROPORTION.

⚠️ **CONSTITUE LE DICTIONNAIRE DE LA PAGE AVANT DE RÉDIGER, pas après.** C'est la recommandation
explicite d'un écrivain du 35ᵉ cours : son premier jet était propre en longueur, en marques et en
`w`, et **7 questions sur 10 violaient quand même la règle du `k`** — 25 mots de métier absents des
pages. Un tour complet de réécriture pour rien.

Outil : `node tools/mesure-lexique-qcm.js --liste=lua`. Cible : **0 exploitable ET 0 à mettre en
forme**.

### (8) L'ÉCHO DE L'ÉNONCÉ — 51,0 %, rendement 78,1 %

La bonne réponse ne doit pas être la seule à reprendre les mots de la question : fais-les reprendre
par **UN seul** distracteur. ⚠️ **Pas par les trois** : sur `data-eng` l'écho s'est RETOURNÉ
(40,8 % → 11,3 %) et « écarter l'option la plus écho » a rendu **30,4 %**.

### (9) Les indices mineurs à ne pas RECRÉER

- **La négation, et son ÉLISION.** N'écris pas la négation uniquement dans la bonne réponse. Et
  surveille la **forme** : sur `dataviz`, la vague d'écriture a fabriqué un indice où les trois
  distracteurs écrivaient « **ne** » plein pendant que la bonne réponse écrivait « **n'** » élidé —
  **83,3 % de rendement, 6 questions offertes**, et la stratégie « la seule qui nie » y était
  aveugle parce que les quatre options niaient. Aucun outil ne mesure l'élision.
- **Les absolus** : « Toujours… », « Jamais… », « Uniquement… » dans les seuls distracteurs.
- **L'attaque unique** : ne fais pas commencer tous tes distracteurs par le même mot.
- **La casse** : ⚠️ `mesure-lexique-qcm` met en minuscules avant de comparer, **la casse n'est
  mesurée par rien**, c'est à toi de la tenir.
- **Le point final** : ne termine pas tout ton lot par le même signe. Sur `react`, il valait **100 %
  sur le lot** d'un seul écrivain.
- **L'ANCRAGE NARRATIF, surtout dans le QCM bilan** : ne rembourre pas tes distracteurs avec le
  décor de l'exemple filé quand l'énoncé n'en parle pas. Sur le bilan de `dataviz`, écarter toute
  option qui nommait le décor rendait **38,9 %, p = 0,0176, sans un contre-exemple**.

## Méthode

1. **Lis tes leçons en entier** (corps + QCM), et **extrais d'abord le vocabulaire de la page**.
2. Récupère ton plan : `node tools/plan-rangs-qcm.js lua --json` puis filtre sur tes fichiers ;
   idem `--incise`, `--ponctuation`, `--marques`, et `node tools/mesure-lexique-qcm.js --liste=lua`.
3. Réécris les distracteurs question par question. **SIMULE AVANT D'ÉCRIRE.**
4. **Écris avec un script Node** qui relit le bloc `data-quiz`, remplace les seules options fausses
   et réécrit le fichier. **N'écris pas le JSON à la main.** ⚠️ **N'écris pas ce script avec un
   *heredoc*** : le shell de cette machine mange un niveau d'antislash — `[\\s\\S]` devient `[sS]`
   et le script ne trouve rien **sans lever d'erreur**. Utilise l'outil d'écriture de fichier.
   ⚠️ **L'arbre de travail est mixte LF/CRLF** : accepte les deux (`\r?\n`) et réécris avec la même
   fin de ligne que celle lue.
5. ⚠️ **SI TU ÉCRIS UN OUTIL DE MESURE À LA VOLÉE, TESTE-LE SUR UN CAS QU'IL DOIT TROUVER.** Piège
   mesuré le 2026-09-08 : en JavaScript, `\b` devant « à » **ne matche jamais** (`à` n'est pas
   `\w`), donc `/\bà peu près\b/` est toujours faux. Un détecteur muet fait croire qu'une correction
   n'a pas pris.
6. Après écriture, relance `plan-rangs-qcm lua`, `--incise`, `--ponctuation`, `--marques`,
   `mesure-lexique-qcm --liste=lua`, `mesure-biais-qcm --seul=lua` et `node tools/verif-html.js`.
7. Rends un compte rendu : questions traitées, distracteurs réécrits, rangs obtenus, **et la liste
   de ce que tu n'as pas pu tenir avec la raison**. ⚠️ Sur `mobile`, c'est cette dernière section
   qui a révélé le retournement de l'indice lexical : **elle rapporte plus que la consigne**.

## Trois interdits absolus

⚠️ **UN DISTRACTEUR NE DOIT JAMAIS DEVENIR VRAI.** C'est la faute la plus grave possible : elle crée
une question à deux bonnes réponses, et l'apprenant qui comprend est puni. Chaque option doit être
**franchement fausse** — pas « fausse par une nuance ». Méfie-toi de ces énoncés, qui sont **vrais**
en Lua et qu'il ne faut donc **surtout pas** écrire comme distracteurs :

- les indices des tables commencent conventionnellement à **1**, pas à 0 ;
- `nil` et `false` sont les **seules** valeurs fausses : `0` et `""` sont **vrais** ;
- une table est **le seul** type structuré : tableau, dictionnaire et objet sont la même chose ;
- `#t` n'est défini que pour une **séquence** sans trou ;
- les métatables portent `__index`, `__newindex`, `__call`, `__eq`… et `__index` peut être une
  **fonction** aussi bien qu'une table ;
- les coroutines sont **coopératives** : elles ne s'exécutent pas en parallèle ;
- `pcall` capture l'erreur et renvoie `false` plus le message, il n'interrompt pas le programme ;
- les fonctions sont des **valeurs de première classe** et capturent leurs *upvalues* ;
- `local` limite la portée au bloc ; sans lui, la variable est **globale** ;
- la concaténation s'écrit `..`, et les chaînes sont **immuables**.

⚠️ **RAPPEL CHIFFRÉ : une correction de fond coûte 0,68 réécriture de rattrapage** (mesuré sur
`a11y`), parce qu'un distracteur réécrit pour cesser d'être vrai emploie forcément d'autres mots et
rouvre l'indice lexical. **Chaque distracteur juste du premier coup économise 1,68 réécriture.** Et
sur `dataviz`, la même chose s'est produite pour des corrections de **forme** : 14 options
retouchées ont remis 2 questions en exploitable et 4 à mettre en forme.

⚠️ **NE MODIFIE RIEN D'AUTRE** : ni la question, ni `correct`, ni `explain`, ni le texte de la bonne
réponse, ni le corps de la leçon, ni un fichier hors de ton lot. Deux agents qui écrivent dans le
même fichier se détruisent mutuellement. **Ne fais aucun `git`** — ni `add`, ni `commit`, ni
`stash`, ni `checkout`.

⚠️ **Si le corps d'une leçon de ton lot est faux**, ne le corrige pas : **signale-le** dans ton
compte rendu, avec la citation exacte et ce que dit la règle. C'est le coordinateur qui tranche.
Sur `dataviz`, cette section a rendu **dix défauts de corps**, dont un schéma qui démontrait
l'inverse de sa leçon.
