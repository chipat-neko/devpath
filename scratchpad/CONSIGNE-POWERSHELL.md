# Consigne d'écriture — les QCM du cours `powershell` (B4, 46ᵉ cours)

Tu réécris **les distracteurs** des QCM d'un lot de leçons du cours `powershell`
(« PowerShell : automatiser Windows » — cmdlets et découverte, variables et opérateurs, pipeline
d'objets, conditions et boucles, scripts, fonctions avancées, tableaux/hashtables/chaînes, gestion
des erreurs, fichiers et registre, modules et .NET, remoting, bonnes pratiques, expressions
régulières, REST et JSON, classes, sécurité des scripts, projet de tableau de bord).

La question (`q`), l'index `correct`, l'explication (`explain`) et **le texte de la bonne réponse**
sont **INTOUCHABLES** : `node tools/mesure-qcm-intouchable.js powershell <ref-git>` le contrôle et
signalera toute atteinte. **Tu ne touches qu'aux trois options fausses.**

**64 questions sur 17 leçons, 192 distracteurs** — les leçons 01 à 15 portent **3** questions,
`lecon-16` en porte **4**, et `lecon-17` en porte **15** (3 de leçon + **12 de QCM bilan**).

---

## ⚠️⚠️ CE COURS-CI S'EXÉCUTE — ET C'EST LA PREMIÈRE FOIS DEPUIS SEPT COURS

Les 39ᵉ à 45ᵉ cours (`scala`, `crypto`, `pandas`, `haskell`, `clojure`, `sass`, `securite`)
n'avaient **rien à exécuter** : la source de vérité y était le corps de la leçon. **Ici, non.**
`powershell.exe` **est disponible dans cet environnement** (version mesurée :
**5.1.26100.8875**), et l'outil PowerShell t'est ouvert.

> **RÈGLE ABSOLUE DU CHANTIER, ENFIN APPLICABLE : NE JAMAIS AFFIRMER UN COMPORTEMENT DE TÊTE,
> LE FAIRE TOURNER.** Avant d'écrire « `-eq` compare les longueurs » ou « `Write-Host` renvoie un
> objet », lance la commande. Ce qui a coûté le plus cher aux 44 cours précédents, c'est le
> distracteur qui se révèle **vrai** ; ici tu peux le vérifier en trois secondes.

⚠️⚠️ **MAIS ATTENTION, ET C'EST UN PIÈGE PROPRE À CE COURS : LE BINAIRE DISPONIBLE EST
WINDOWS POWERSHELL 5.1, ET LE COURS ENSEIGNE LARGEMENT POWERSHELL 7.** `lecon-12` compare
explicitement les deux. Ce qui diffère entre 5.1 et 7, et qu'une exécution locale te ferait donc
juger **à l'envers** :

- l'opérateur **ternaire** `? :`, les chaînages `&&` et `||` — **7 seulement** ;
- `ForEach-Object -Parallel` — **7 seulement** ;
- `ConvertFrom-Json -AsHashtable`, `-Depth` par défaut, `Test-Json` — comportement différent ;
- `Invoke-RestMethod` / `Invoke-WebRequest` : moteur et en-têtes par défaut différents ;
- l'encodage par défaut de `Out-File` / `Set-Content` (**ANSI en 5.1, UTF-8 sans BOM en 7**) ;
- `$PSStyle`, `Get-Error`, `-ErrorAction Break`, `ConciseView` — **7 seulement** ;
- la **portabilité** (`pwsh` sur Linux/macOS) et l'absence de `-ComputerName` sur beaucoup de
  cmdlets en 7.

**Donc : une exécution qui CONFIRME ce que la leçon dit est une preuve ; une exécution qui la
CONTREDIT n'en est pas une — vérifie d'abord si la différence vient de la version, et dans ce cas
remonte-le à l'orchestrateur au lieu d'écrire quoi que ce soit.** La source de vérité reste
**le corps de la leçon** quand la version diverge.

---

## Pourquoi ce travail

Un apprenant qui ne comprend rien au cours réussit **91,8 %** des QCM de `powershell` en cochant
l'option la plus longue — **couverture 96,9 %, rendement 93,5 %**. Ce n'est pas le seul indice :

| indice | réussite | couverture | rendement |
|---|---:|---:|---:|
| **la plus longue** | **91,8 %** | **96,9 %** | **93,5 %** |
| la plus détaillée | **73,4 %** | 65,6 % | **97,6 %** |
| le mot technique exclusif | **72,8 %** | 67,2 % | 93,0 % |
| l'incise entre parenthèses | **67,6 %** | 60,9 % | 94,9 % |
| RESTREINDRE à la parenthèse | **65,8 %** | 57,8 % | 94,6 % |
| la seule avec une PONCTUATION FORTE | **54,3 %** | 39,1 % | **100 %** |
| ECARTER la moins bavarde | **45,3 %** | 15,6 % | 90,0 % |
| la seule avec un point-virgule | **44,9 %** | 26,6 % | **100 %** |
| l'écho de la question | **43,8 %** | 34,4 % | 72,7 % |
| la plus dense (mots longs) | **40,2 %** | 90,6 % | 41,4 % |
| RESTREINDRE aux deux-points | **34,5 %** | 12,5 % | **100 %** |
| l'écho de FRAGMENT d'identifiant | **31,0 %** | 9,4 % | 83,3 % |
| la seule en deux phrases | **30,9 %** | 7,8 % | **100 %** |

**Ton lot doit ramener chaque indice à 25 %, l'étalon du hasard.** On ne rend pas les questions plus
difficiles : on rend les **distracteurs crédibles**.

---

## (b) Le travail est de l'**ALLONGEMENT**, et le déséquilibre est le plus fort du chantier

| | |
|---|---:|
| longueur moyenne d'une bonne réponse | **90,8 caractères** (max 205, min 4) |
| longueur moyenne d'un distracteur | **22,9 caractères** (max 53, min **3**) |
| **rapport** | **3,97** |
| rapport du 45ᵉ cours (`securite`) | 2,86 |
| rapport du 44ᵉ cours (`sass`) | 3,33 |
| médiane du même rapport sur les **45 cours déjà traités** | ~1,0 |

`node tools/plan-rangs-qcm.js powershell` demande **11 132 caractères** répartis sur **56 questions
sur 64**. Rangs actuels **60 / 2 / 1 / 1**, cible **16 / 16 / 16 / 16**.

⚠️ **Le distracteur moyen fait 23 caractères** : « C'est l'inverse », « Un booléen », « Get-Help ».
Presque tout le travail est de la **rédaction neuve**, pas de la retouche.

## (c) LA FORME DU DÉFAUT EST UNIFORME, ET C'EST UNE CHANCE

La bonne réponse est **« la réponse + sa justification »** ; les distracteurs sont des télégrammes
(« C'est l'inverse », « Parce que le point accélère l'exécution »). **LE REMÈDE EST TOUJOURS LE
MÊME : donne au distracteur la MÊME STRUCTURE que la bonne réponse — la réponse fausse, PUIS sa
justification fausse mais cohérente.**

---

## ⚠️⚠️ LA CONTRAINTE QUI A COÛTÉ LE PLUS CHER

**ÉCRIS UNE THÈSE FAUSSE, PAS UNE SALADE DE MOTS.** Au 39ᵉ cours (`scala`), 30 prises sur 54
venaient de distracteurs remélangés jusqu'au bon compte de caractères et qui ne voulaient plus rien
dire ; au 45ᵉ (`securite`), **neuf contrôles verts sur un texte qui ne voulait rien dire** —
« la chaîne reçue (une valeur, une RCE) ». Le biais de longueur y avait été remplacé par un **biais
de cohérence sémantique, qui se mesure au même endroit et qu'aucun des 45 outils ne voit**. Relis
chaque distracteur à voix haute.

Les erreurs vraiment commises en PowerShell sont nombreuses et se rédigent facilement sur 60 à
180 caractères :

- croire que le pipeline transporte du **texte** comme un shell Unix, et non des **objets** ;
- croire que `Write-Host` alimente le pipeline, ou qu'on peut capturer sa sortie dans une variable ;
- croire que `>` et `Out-File` sont identiques à `Write-Output`, ou que `|` sérialise en chaînes ;
- croire que `-eq` est sensible à la casse (c'est `-ceq`), ou que `==` existe ;
- croire que `-match` renvoie la chaîne trouvée (il renvoie un booléen et remplit `$Matches`) ;
- confondre `-contains` (collection) et `-like`/`-match` (chaîne), ou `-in` et `-contains` ;
- croire qu'un tableau PowerShell est redimensionnable (`+=` **recrée** le tableau) ;
- croire que `$null` à gauche d'une comparaison est une coquetterie de style ;
- croire que `ForEach-Object` et le mot-clé `foreach` sont la même chose côté mémoire ;
- croire qu'une fonction ne renvoie que la valeur de son `return` (**toute** sortie non capturée
  part dans le pipeline) ;
- croire que `try/catch` attrape les erreurs **non terminantes** sans `-ErrorAction Stop` ;
- croire que `Set-ExecutionPolicy` est une fonction de sécurité contre un attaquant ;
- croire qu'un `SecureString` chiffre pour toujours, ou qu'il protège d'un administrateur local ;
- croire qu'une signature Authenticode chiffre le script ;
- croire que `Get-Content` renvoie une seule chaîne (il renvoie un **tableau de lignes**) ;
- croire que `ConvertTo-Json` descend indéfiniment (profondeur par défaut **limitée**) ;
- croire que `Invoke-RestMethod` renvoie du texte brut là où il désérialise déjà ;
- croire que le **remoting** transporte des objets vivants (ils sont **sérialisés**, méthodes
  perdues) ;
- croire qu'une classe PowerShell se recharge dans la même session après modification.

---

## Ce que tu dois tenir, dans l'ordre d'importance

### (1) LA LONGUEUR — **91,8 %, couverture 96,9 %, rendement 93,5 %**

`node tools/plan-rangs-qcm.js powershell` donne la **fenêtre de caractères** visée pour chaque
distracteur. ⚠️ **VISE LA FENÊTRE, PAS « PLUS LONG »** : écraser « la plus longue » ne fait que
**déplacer** le biais d'un rang, et le sens INVERSE le dit déjà ici (voir (11)).
⚠️ **SIMULE AVANT D'ÉCRIRE** (`[...s].length`, un accent compte 1).
⚠️⚠️ **JAMAIS EXACTEMENT LA LONGUEUR DE LA BONNE RÉPONSE** : `plan-rangs-qcm` teste `len > bon`, donc
à `len === bon` l'option est classée « plus courte » et se retrouve hors bande d'un caractère.
⚠️⚠️ **NE « CORRIGE » PAS UN RANG QUI TE PARAÎT FAUX** : la cible est 16/16/16/16 **sur le cours
entier**, donc la bonne réponse est volontairement la plus courte sur 16 questions. Un lot de 9 à
15 questions ne peut pas afficher 25 % à lui seul.

### (2) ⚠️⚠️ LE NOMBRE DE MOTS SUIT LE RANG DE LONGUEUR

`la moins bavarde` : **DIRECTE 0,0 % sur 36 questions**, soit **29,7 % au global inverse** — une
élimination sûre. Et `ECARTER la moins bavarde` rend déjà **45,3 % avec un rendement de 90,0 %**.
**Le rang en MOTS de la bonne réponse = son rang en CARACTÈRES.** Allonger avec des mots longs ferme
la longueur et ouvre celle-ci.
⚠️ Fermer « la moins bavarde » n'est pas « partager le minimum » : l'outil ne cesse de compter la
question que si l'ensemble des options au compte minimal vaut **les quatre** (leçon du 43ᵉ).
⚠️ **`la plus dense (mots longs)` tranche sur 90,6 % des questions ici** : surveille aussi le
rapport *lettres / mots*, pas seulement le total. Au 45ᵉ, un candidat a été rejeté parce qu'une
apostrophe (`l'attaquant`) fabriquait un jeton d'une lettre et faisait basculer la densité.

### (3) LA PLUS DÉTAILLÉE — 73,4 %, couverture 65,6 %, **rendement 97,6 %**

La bonne réponse est la seule à porter un nom de cmdlet réel, un paramètre, un exemple concret.
**Fais porter du concret FAUX à tes distracteurs** — une cmdlet réelle avec un effet inventé, un
paramètre réel employé pour la mauvaise chose (⚠️ *mais jamais un conseil recopiable*, voir (13)).
**La stratégie compte les `, : ;` : égalise ce compte sur les quatre options.**

### (4) LA PONCTUATION, ET SURTOUT SON UNION

Mesuré sur les 64 questions et 192 distracteurs :

| marque | bonnes réponses | distracteurs | questions où **une seule** option la porte | dont c'est **la bonne** |
|---|---:|---:|---:|---:|
| parenthèse | **38** / 64 | 12 / 192 | 39 | **35 (89,7 %)** |
| virgule | 33 | 5 | 32 | **30 (93,8 %)** |
| **point-virgule** | **17** | **0** | **17** | **17 (100 %)** |
| deux-points | 10 | 5 | 8 | **8 (100 %)** |
| barre oblique | 3 | 1 | 4 | 3 (75,0 %) |
| guillemets | 2 | 0 | 2 | 2 (100 %) |
| tiret d'incise | 0 | 0 | 0 | — |
| flèche | 0 | 0 | 0 | — |
| **UNION ponctuation forte** | **50** | 17 | **45** | **42 (93,3 %)** |

**Règle : par marque, les quatre options la portent, ou aucune — ET vérifie aussi l'union.**
⚠️⚠️ **AUCUN des 192 distracteurs ne porte un point-virgule, pour 17 bonnes réponses** : à lui seul,
un indice à **100 %** sur 17 questions. Même chose pour les guillemets (2/0).
⚠️ **L'INCISE SE COMPTE, ELLE NE SE TESTE PAS** (leçon du 42ᵉ) : `l'incise entre parenthèses` est un
`argMax` sur le **NOMBRE** d'incises de 4 signes et plus. Un **2/1/1/1** est vert pour qui regarde
« toutes en portent une » et rend **100 %** à qui compte. Cible **n/n/n/n** ; ici **37 questions**
ont la bonne réponse seule en tête du compte (`node tools/plan-rangs-qcm.js powershell --incise`).
⚠️ **NE POSE PAS TES INCISES EN FIN DE DISTRACTEUR** — au 42ᵉ cela a ouvert « écarter la glose
finale », et la fermer en *supprimant* une incise rouvrait l'indice précédent : il faut **déplacer**.
⚠️ **La flèche et le tiret sont à ZÉRO partout : ne les introduis pas.** Une seule option qui
porterait ` — ` ouvrirait une marque aujourd'hui fermée.

### (5) LE MOT TECHNIQUE EXCLUSIF — 72,8 %, couverture **67,2 %**

C'est le deuxième indice du cours par la couverture. La bonne réponse ne doit pas être la seule à
employer un mot de **9 lettres et plus** qu'aucune autre n'emploie.
⚠️⚠️ **VISE L'ÉGALITÉ, PAS ZÉRO** : l'écraser retourne l'indice (mesuré aux 39ᵉ et 41ᵉ). Et au 44ᵉ,
**fermer les questions tranchées a FAIT MONTER la stratégie** de 25,8 % à 27,5 % : une question
tranchée qui vaut 0 rapporte +0,25 quand on la ferme, alors qu'une **égalité à deux** incluant la
bonne réponse vaut 0,50. **Égalise les ex æquo en même temps que les questions tranchées.**
⚠️ Mots de 9 lettres et plus à surveiller ici : `propriétés`, `paramètre`, `pipeline` (8, passe
juste dessous), `répertoire`, `expression`, `exécution`, `sérialisé`, `certificat`, `identifiants`,
`hashtable` (9), `terminante`, `collection`, `désérialise`, `redimensionne`.

### (6) L'ÉCHO DE L'ÉNONCÉ — 43,8 %, couverture 34,4 %, et **l'écho de FRAGMENT à 31,0 %**

**LES QUATRE OPTIONS PORTENT LE MÊME NOMBRE DE MOTS D'ÉCHO** (mots de 4 lettres et plus repris de
l'énoncé, comptés en ENSEMBLE). C'est une **égalité**, pas une inégalité.
⚠️ **Particularité de ce cours : `l'écho de FRAGMENT d'identifiant` rend 31,0 % avec un rendement de
83,3 %.** Les cmdlets sont en `Verbe-Nom` : quand l'énoncé dit `Get-Member` et que la seule bonne
réponse redit `Member`, le fragment suffit. **Compte les fragments, pas seulement les mots entiers.**

### (7) L'INDICE LEXICAL — **54 questions EXPLOITABLES sur 64**, et **56 sur 64 à mettre en forme**

**RÈGLE DU `k`** : soit `k` le nombre de mots de **6 lettres et plus absents de la page** que porte
la bonne réponse (intouchable). **Les trois distracteurs en portent EXACTEMENT `k`** (`k = 0` →
`0/0/0`, `k > 0` → `k/k/k`). Mettre les trois à zéro quand `k > 0` **retourne** l'indice ; `0/0/k`
laisse 50 % à qui restreint.
**RÈGLE DU `w`** : soit `w` le nombre de mots de 6 lettres et plus de la bonne réponse — **ou les
quatre options portent le même `w`, ou au moins un distracteur en porte strictement plus.**
⚠️ **CONSTITUE LE DICTIONNAIRE DE LA PAGE AVANT DE RÉDIGER** : `node tools/mesure-lexique-qcm.js
--liste=powershell` donne, question par question, le `k` visé, le `w` et les mots en cause. Cible :
**0 exploitable ET 0 à mettre en forme**.
⚠️ **LA CONTRAINTE À QUATRE CONDITIONS** : un mot de remplacement doit faire **moins de 9 lettres**,
**au moins 6**, être **présent dans la page** et **absent de l'énoncé**. Trois sur quatre ne suffit
pas.
⚠️⚠️ **PIÈGE MESURÉ AU 44ᵉ, ET IL A COÛTÉ DEUX QUESTIONS** : `grep -ci` n'est **pas** l'outil. La
page peut contenir « recolle » sans contenir « recollé » — l'outil compare des **jetons entiers**,
et l'apostrophe comme le tiret **séparent** les mots. ⚠️ **Sur ce cours-ci, le tiret sépare
`Get-Member` en `get` et `member`** : ne suppose rien, **lance `mesure-lexique-qcm`.**

### (8) LE MOT FÉTICHE — **2 alertes**

`node tools/mesure-mot-fetiche.js powershell` (colonnes : `vu / bonnes / distracteurs`) :

| mot | vu | bonnes | distracteurs | questions tranchées | lecture |
|---|---:|---:|---:|---:|---|
| `objet` | 10 | **8** | **2** | 9 | **RESTREINDRE rend 33,2 %** |
| `powershell` | 10 | 5 | 5 | 10 | RESTREINDRE 28,9 % |

⚠️ `objet` est le mot-thème du cours (« le pipeline d'objets ») : il est **8 fois sur 10 dans la
bonne réponse**. Par question, **les quatre options le portent, ou aucune**. Comme la bonne réponse
est intouchable, c'est à tes distracteurs de l'adopter là où elle le porte.
⚠️ **SINGULIER/PLURIEL** : `objet`/`objets`, `propriété`/`propriétés`, `script`/`scripts` sont des
jetons **différents** pour l'outil. Juste sous le seuil et à ne pas aggraver : `objets` (9 vus, 7
bonnes, RESTREINDRE 31,6 %), `pipeline` (10 vus, 7 bonnes, 30,9 %).

### (9) L'INTRUS LEXICAL — **2 questions sûres en DÉFAUT, 2 en EXCÈS**

`node tools/mesure-mot-question.js powershell --liste` : lecture **EXCÈS 31,6 % (au-dessus du seuil
de 28,0 %)**, lecture DÉFAUT 23,0 %. Les quatre questions tranchées à coup sûr :

| leçon | lecture | mot(s) en cause |
|---|---|---|
| `lecon-02` q « tester si `$x` est strictement supérieur à 10 » | EXCÈS | `opérateur`, `comparaison` |
| `lecon-05` q « pourquoi un script peut-il refuser de s'exécuter » | DÉFAUT | `parce` |
| `lecon-10` q « appeler la méthode statique `Sqrt` » | EXCÈS | `syntaxe`, `méthode` |
| `lecon-16` q « pourquoi `SecureString` n'est pas absolu » | DÉFAUT | `parce` |

Règle : **par mot, les quatre options le portent, ou aucune**, appliquée **question par question**.
⚠️ **`mesure-mot-fetiche` ne le voit pas** (il exige ≥ 8 questions tranchées par le même mot) :
lance les deux, et **lis la colonne « sûres », pas la colonne « taux »**.
⚠️ **NE CRÉE PAS un 3/4 dont l'intrus serait la bonne réponse** : elle est intouchable, donc
l'indice deviendrait irrattrapable.

### (10) LE POINT INTERNE — **5 questions (7,8 %), rendement 100 %**

`la seule en deux phrases` rend **30,9 % avec un rendement de 100 %**. Sur les cours traités, la
couverture de cet indice est presque **deux fois** celle des cours non traités : c'est le réflexe de
qui étoffe une bonne réponse. **Ici le risque est ton distracteur allongé.**
> **Dans une question donnée, les quatre options portent le MÊME nombre de phrases.** La signature
> est **un point suivi d'une espace puis d'une majuscule** (`etc.`, la virgule décimale et le point
> d'un `$objet.Methode()` ne comptent pas — et ce cours en est plein).

### (11) LE SENS INVERSE — déjà **4 alertes AVANT ton passage**

`node tools/mesure-biais-inverse.js --toutes powershell` :

| stratégie | tranche | DIRECTE | INVERSE | GLOBAL |
|---|---:|---:|---:|---:|
| la moins bavarde (peu de mots) | 36 | **0,0 %** | 33,3 % | **29,7 %** |
| la TROISIÈME plus longue | 58 | 1,7 % | 32,8 % | **32,0 %** |
| la DEUXIÈME plus longue | 59 | 3,4 % | 32,2 % | **31,6 %** |
| l'attaque unique | 20 | 15,0 % | 28,3 % | 26,0 % |

Elles se refermeront **si et seulement si** tu tiens les fenêtres de `plan-rangs-qcm` **et** la règle
(2). Ne les traite pas séparément : **elles sont la longueur vue de dos.**

### (12) Les marques à ne pas ouvrir, et « Parce que »

**flèche** (0 partout), **tiret d'incise** (0 partout), **virgule décimale**. Attention à
**« la seule qui nie »** : 17 questions n'ont qu'une seule option qui nie, et **c'est un distracteur
dans 15 cas sur 17** — l'indice joue donc **à l'envers** ici (écarter celle qui nie). Égalise la
négation (« ne… pas », « aucun », « jamais », « sans ») plutôt que de la supprimer.
⚠️ **`Parce que` : 43 options sur 256 commencent par cette formule, dont 11 bonnes réponses.**
`mesure-mot-fetiche` ne l'alerte pas (ÉCARTER 24,2 %, RESTREINDRE 25,0 %) — **mais deux des quatre
questions « sûres » de l'intrus lexical tiennent à ce mot**. Par question : **les quatre options
commencent par « Parce que », ou aucune.**

### (13) ⚠️ LE DISTRACTEUR NE DOIT PAS DEVENIR UN MODE D'EMPLOI

Ce cours est un cours d'**automatisation de machines**, et deux leçons touchent à la sécurité
(`lecon-16` : identifiants, secrets, signature ; `lecon-12` : bonnes pratiques). Comme au 45ᵉ :
**écris l'erreur qu'on commet, jamais le conseil qu'on suit.** « Un `SecureString` protège même d'un
administrateur de la machine » est un bon distracteur — c'est **la croyance** d'un débutant, et la
leçon la réfute. « Stocker le mot de passe dans une variable d'environnement du profil » en est un
mauvais : ça ressemble à une recette, et un lecteur pressé la retiendra comme telle.
⚠️ **Et n'écris jamais un distracteur qui propose une commande destructrice plausible**
(`Remove-Item -Recurse -Force`, `Set-ExecutionPolicy Bypass`) présentée comme une solution.

---

## Les six contraintes de non-régression

1. **La bonne réponse est intouchable** — `q`, `correct`, `explain` et son texte. ⚠️ **SAUF si elle
   est FAUSSE** : au 40ᵉ (`crypto`) une bonne réponse annonçait un chiffre que son propre programme
   contredit, au 42ᵉ trois figures se contredisaient, au 43ᵉ un bloc annonçait 11 assertions pour 9,
   au 44ᵉ une bonne réponse de bilan contredisait un bloc de code de sa propre page, au 45ᵉ une
   matrice de risque était dessinée à l'envers. **Remonte, ne recopie pas.** ⚠️ **Ici tu peux
   EXÉCUTER pour le prouver — fais-le, en tenant compte de l'écart 5.1 / 7 décrit en tête.**
2. **La fenêtre de caractères** de `plan-rangs-qcm`, simulée avant d'écrire — et le **rang en mots**
   aligné sur le rang en caractères.
3. **Par marque : les quatre options, ou aucune** — ponctuation (et leur UNION, et le **compte** des
   incises), mots fétiches, mots d'une seule question, **et le nombre de PHRASES**.
4. **`k / k / k / k`** sur les mots étrangers à la page, et le `w` fermé séparément.
5. **Le distracteur reste FAUX, et il reste INOFFENSIF.** Le coût mesuré d'un distracteur devenu
   vrai est de **1,68 réécriture**. Demande-toi toujours : *existe-t-il une lecture où cette phrase
   est exacte ?* — **et sur ce cours, la question se tranche en l'exécutant.**
6. ⚠️⚠️ **ÉCRIS UNE THÈSE FAUSSE, PAS UNE SALADE DE MOTS.**

---

## Le contrôle d'après, à citer dans ton compte rendu

```
node tools/mesure-biais-qcm.js --seul=powershell           # les 43 strategies, sens direct
node tools/mesure-biais-inverse.js --toutes powershell     # les 42, sens INVERSE (colonne GLOBAL)
node tools/mesure-lexique-qcm.js --liste=powershell        # 0 exploitable ET 0 a mettre en forme
node tools/mesure-mot-fetiche.js powershell                # 0 alerte
node tools/mesure-mot-question.js powershell --liste       # 0 question « sure », les DEUX lectures
node tools/mesure-qcm-longueurs.js powershell              # rangs, cible 16/16/16/16
node tools/mesure-qcm-intouchable.js powershell <ref>      # 0 atteinte
node tools/plan-rangs-qcm.js powershell                    # ce qu'il reste a ecrire
```

**Cible : 25 % dans les DEUX sens, sur les 43 stratégies — 0 mot fétiche, et 0 question « sûre ».**

---

## ⚠️ Ce que les passes 39 à 45 ont appris sur la MÉTHODE

1. **La contradiction adversariale doit elle-même être contredite.** Un remède proposé n'est pas un
   ordre : évalue-le, et si tu le rejettes, écris la preuve. Au 44ᵉ, **les deux pistes données par
   l'orchestrateur comme « déjà vérifiées » étaient fausses**, et les deux agents l'ont prouvé.
2. **Fermer un indice en rouvre un autre — trois fois de suite au 42ᵉ**, et au 45ᵉ fermer
   `la MAJUSCULE` a rouvert `le mot technique exclusif` **au même chiffre exact**. Après chaque
   retouche, **rejoue TOUTES les mesures**, pas seulement celle que tu visais.
3. **Un relecteur qui mesure sur SON LOT extrapole faux.** Toujours remesurer sur le corpus complet.
4. **Un diagnostic qui n'est pas la copie exacte de l'outil fait travailler à côté** (43ᵉ : une regex
   de mots ; 44ᵉ : un `grep` à la place d'une comparaison de jetons). **Lance l'outil.**
5. **Corriger un CORPS de leçon rouvre l'indice lexical** : le dictionnaire change. Corps d'abord,
   QCM ensuite.
6. **N'écris QUE dans les leçons de ton lot**, et **aucun `git commit` / `git add` / `git stash`** —
   l'orchestrateur seul commite.
7. **Le JSON doit rester valide et le fichier sans BOM** : `JSON.parse` sur chaque bloc touché, puis
   `node tools/verif-html.js`. ⚠️ **Les chevrons `<` et `>` sont interdits dans une option** (ils
   créeraient une balise) — et ce cours emploie `-gt`, `-lt`, `-ge`, `-le` précisément pour ça.
8. **Un script lancé via `node -e '…'` en quotes simples se fait manger un niveau de backslash par
   l'outil Bash.** Écris le script dans un fichier avant de le lancer. ⚠️ **Sur ce cours c'est
   critique : les chemins PowerShell (`.\mon-script.ps1`, `C:\Temp`) et les regex (`\d`, `\s`) sont
   pleins d'antislashs, et dans le JSON ils doivent être DOUBLÉS.**
