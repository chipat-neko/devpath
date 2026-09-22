# Consigne d'écriture — les QCM du cours `securite` (B4, 45ᵉ cours)

Tu réécris **les distracteurs** des QCM d'un lot de leçons du cours `securite` (sécurité applicative :
pourquoi la sécurité, ne jamais faire confiance à l'entrée, les injections, XSS et CSRF,
authentification et mots de passe, contrôle d'accès et secrets, HTTPS/TLS et en-têtes, cryptographie
appliquée, dépendances et chaîne d'approvisionnement, API/JWT/OAuth 2, SSRF et désérialisation,
journalisation et incidents, STRIDE, audit de synthèse).

La question (`q`), l'index `correct`, l'explication (`explain`) et **le texte de la bonne réponse**
sont **INTOUCHABLES** : `node tools/mesure-qcm-intouchable.js securite <ref-git>` le contrôle et
signalera toute atteinte. **Tu ne touches qu'aux trois options fausses.**

**62 questions sur 14 leçons, 186 distracteurs** — dont **12 questions en QCM bilan** dans
`lecon-14.html`, qui porte donc **16 questions** (4 de leçon + 12 de bilan). Les leçons 07 à 13
portent **4** questions, les leçons 01 à 06 en portent **3**.

---

## ⚠️⚠️ CE COURS-CI ENSEIGNE LA SÉCURITÉ, ET C'EST UNE CONTRAINTE DE PLUS

Un distracteur de ce cours n'est pas seulement une réponse fausse : c'est une phrase qu'un débutant
va lire. **Écris l'erreur qu'on commet, jamais le conseil qu'on suit.**

> « Stocker le mot de passe en clair suffit si la base est derrière un pare-feu » est un bon
> distracteur : c'est **le raisonnement** d'un débutant, et la leçon le réfute explicitement.
> « Chiffrer le mot de passe avec AES-256 et garder la clé dans le code » en est un mauvais : ça
> **ressemble** à une recette, et un lecteur pressé la retiendra comme telle.

Règle pratique : le distracteur doit rester **manifestement réfuté par le corps de la leçon**, et ne
jamais prendre la forme d'une instruction opérationnelle qu'on pourrait recopier. **Aucun cours du
périmètre restant n'a cette propriété — ne la perds pas de vue en cherchant la fenêtre de longueur.**

---

## Pourquoi

Un apprenant qui ne comprend rien au cours réussit **95,2 %** des QCM de `securite` en cochant
l'option la plus longue — **couverture 100 %**. Ce n'est pas le seul indice :

| indice | réussite | couverture | rendement |
|---|---:|---:|---:|
| **la plus longue** | **95,2 %** | **100 %** | 95,2 % |
| la plus détaillée | **73,5 %** | 62,9 % | **100 %** |
| le mot technique exclusif | **70,2 %** | 72,6 % | 82,2 % |
| RESTREINDRE à la ponctuation forte | **53,2 %** | 37,1 % | **100 %** |
| RESTREINDRE à la parenthèse | **50,0 %** | 35,5 % | 95,5 % |
| l'incise entre parenthèses | **47,6 %** | 32,3 % | 95,0 % |
| la seule qui nie | **36,8 %** | 32,3 % | 60,0 % |
| l'écho de la question | **35,5 %** | 24,2 % | 60,0 % |
| la plus prudente | **34,3 %** | 17,7 % | 72,7 % |
| la seule avec un point-virgule | **32,3 %** | 9,7 % | **100 %** |
| l'attaque unique | **31,5 %** | 25,8 % | 50,0 % |

**Ton lot doit ramener chaque indice à 25 %, l'étalon du hasard.** On ne rend pas les questions plus
difficiles : on rend les **distracteurs crédibles**.

---

## ⚠️ CE QUI REND CE COURS-CI PARTICULIER — à lire avant la liste des indices

### (a) **RIEN À EXÉCUTER** — la source de vérité est le corps de la leçon

Le cours parle de HTTP, de TLS, de bases de données, de JWT : **aucun de ces comportements n'est
reproductible ici** (pas de serveur, pas de réseau, pas de dépendance installée). La règle
fondatrice du chantier — « ne jamais affirmer un comportement de tête, le faire tourner » —
**n'est pas applicable par exécution**, comme aux 39ᵉ à 44ᵉ cours.

> **LA SOURCE DE VÉRITÉ EST LE CORPS DE LA LEÇON, PAS TA MÉMOIRE.**
> Avant d'écrire un distracteur, **lis la page** et ancre-le sur ce que la leçon affirme. Si tu veux
> dire qu'une option est fausse, tu dois pouvoir **citer la phrase ou le bloc de code de la page**
> qui l'établit.

**Ne fabrique pas de distracteur qui repose sur un détail que la page ne tranche pas** (le numéro
exact d'une CVE, la valeur par défaut d'un en-tête non cité, le coût précis d'un `bcrypt`). Si tu
trouves dans la page une affirmation que tu crois fausse, **remonte-la à l'orchestrateur avec la
citation** — ne la recopie pas dans un distracteur.

### (b) Le travail est de l'**ALLONGEMENT**

| | |
|---|---:|
| longueur moyenne d'une bonne réponse | **104,4 caractères** (max 180, min 8) |
| longueur moyenne d'un distracteur | **36,5 caractères** (max 103, min **3**) |
| rapport | **2,86** |
| rapport du 44ᵉ cours (`sass`) | 3,33 |
| médiane du même rapport sur les **44 cours déjà traités** | ~1,0 |

`node tools/plan-rangs-qcm.js securite` demande **10 085 caractères** répartis sur **60 questions
sur 62**. Rangs actuels **59 / 2 / 1 / 0**, cible **16 / 16 / 15 / 15**. Options hors bande
70-130 % : **172 sur 186** (fourchette 0,09 à 1,25) — quelques-unes sont à **RACCOURCIR**, lis la
colonne de `plan-rangs-qcm` option par option.

### (c) LA FORME DU DÉFAUT EST UNIFORME, ET C'EST UNE CHANCE

La bonne réponse est **« la réponse + sa justification »** ; les distracteurs sont des télégrammes
(« Parce que c'est plus rapide »). **LE REMÈDE EST TOUJOURS LE MÊME : donne au distracteur la MÊME
STRUCTURE que la bonne réponse — la réponse fausse, PUIS sa justification fausse mais cohérente.**

---

## ⚠️⚠️ LA CONTRAINTE QUI A COÛTÉ LE PLUS CHER

**ÉCRIS UNE THÈSE FAUSSE, PAS UNE SALADE DE MOTS.** Au 39ᵉ cours (`scala`), 30 prises sur 54
venaient de distracteurs remélangés jusqu'au bon compte de caractères et qui ne voulaient plus rien
dire : le biais de longueur avait été remplacé par un **biais de cohérence sémantique, qui se mesure
au même endroit et qu'aucun des 45 outils ne voit**. Relis chaque distracteur à voix haute.

Les erreurs vraiment commises en sécurité sont nombreuses et se rédigent facilement sur 70 à
160 caractères :

- croire que la validation côté client protège le serveur, ou qu'un champ `hidden` n'est pas
  modifiable ;
- croire qu'échapper à l'affichage protège de l'injection SQL (ou l'inverse) ;
- croire qu'une requête préparée est « juste plus rapide », ou qu'elle protège de tout ;
- confondre **authentification** et **autorisation**, ou croire qu'un contrôle d'accès côté interface
  suffit ;
- croire qu'un mot de passe « chiffré » est équivalent à un mot de passe **haché**, ou que MD5/SHA-1
  suffisent avec un sel ;
- croire que HTTPS chiffre aussi le nom de domaine, ou qu'il authentifie le contenu de la page ;
- confondre `SameSite`, `HttpOnly` et `Secure` ; croire qu'un jeton CSRF protège du XSS ;
- croire qu'un JWT est chiffré, qu'il est révocable par nature, ou que `alg: none` est un détail ;
- croire qu'un secret dans le dépôt est protégé si le dépôt est privé, ou qu'un `git rm` efface
  l'historique ;
- croire qu'une dépendance populaire est sûre par popularité, ou qu'un `lockfile` protège du
  typosquatting ;
- croire que journaliser le mot de passe « pour déboguer » est acceptable en interne ;
- croire que SSRF vise le client, ou que la désérialisation d'un format « texte » est inoffensive.

---

## Ce que tu dois tenir, dans l'ordre d'importance

### (1) LA LONGUEUR — **95,2 %, couverture 100 %**

`node tools/plan-rangs-qcm.js securite` donne la **fenêtre de caractères** visée pour chaque
distracteur. ⚠️ **VISE LA FENÊTRE, PAS « PLUS LONG »** : écraser « la plus longue » ne fait que
**déplacer** le biais d'un rang, et le sens INVERSE le dit déjà ici (la DEUXIÈME plus longue rend
**32,4 %** en global inverse sur 59 questions, la TROISIÈME **32,3 %** sur 58).
⚠️ **SIMULE AVANT D'ÉCRIRE** (`[...s].length`, un accent compte 1).
⚠️⚠️ **JAMAIS EXACTEMENT LA LONGUEUR DE LA BONNE RÉPONSE** : `plan-rangs-qcm` teste `len > bon`, donc
à `len === bon` l'option est classée « plus courte » et se retrouve hors bande d'un caractère.
⚠️⚠️ **NE « CORRIGE » PAS UN RANG QUI TE PARAÎT FAUX** : la cible est 16/16/15/15 **sur le cours
entier**, donc la bonne réponse est volontairement la plus courte sur 15 questions. Un lot de 9 à
16 questions ne peut pas afficher 25 % à lui seul.

### (2) ⚠️⚠️ LE NOMBRE DE MOTS SUIT LE RANG DE LONGUEUR

`la moins bavarde` : **DIRECTE 0,0 % sur 48 questions**, soit **31,5 % au global inverse** — une
élimination sûre. **Le rang en MOTS de la bonne réponse = son rang en CARACTÈRES.** Allonger avec
des mots longs ferme la longueur et ouvre celle-ci.
⚠️ Fermer « la moins bavarde » n'est pas « partager le minimum » : l'outil ne cesse de compter la
question que si l'ensemble des options au compte minimal vaut **les quatre** (leçon du 43ᵉ).

### (3) LA PLUS DÉTAILLÉE — 73,5 %, couverture 62,9 %, **rendement 100 %**

La bonne réponse est la seule à porter un nom d'en-tête, un algorithme, un exemple concret. **Fais
porter du concret FAUX à tes distracteurs** — un en-tête réel avec un effet inventé, un algorithme
réel employé pour la mauvaise chose. **La stratégie compte les `, : ;` : égalise ce compte sur les
quatre options.**

### (4) LA PONCTUATION, ET SURTOUT SON UNION

| marque | bonnes réponses | distracteurs | questions où **une seule** option la porte | dont c'est **la bonne** |
|---|---:|---:|---:|---:|
| parenthèse | 21 / 62 | **1** / 186 | 22 | **21 (95,5 %)** |
| virgule | 34 | 11 | 30 | **28 (93,3 %)** |
| deux-points | 18 | **1** | 17 | **17 (100 %)** |
| point-virgule | 7 | 3 | 6 | **6 (100 %)** |
| barre oblique | 3 | **0** | 3 | **3 (100 %)** |
| tiret | 3 | 3 | 2 | 2 (100 %) |
| **UNION ponctuation forte** | 26 | 7 | **23** | **23 (100 %)** |
| guillemets | 0 | 1 | 1 | 0 |

**Règle : par marque, les quatre options la portent, ou aucune — ET vérifie aussi l'union.**
⚠️ **UN SEUL distracteur sur 186 porte une parenthèse, UN SEUL porte un deux-points** : ces deux
marques sont, à elles seules, un indice à 95-100 %.
⚠️ **L'INCISE SE COMPTE, ELLE NE SE TESTE PAS** (leçon du 42ᵉ) : `l'incise entre parenthèses` est un
`argMax` sur le **NOMBRE** d'incises de 4 signes et plus. Un **2/1/1/1** est vert pour qui regarde
« toutes en portent une » et rend **100 %** à qui compte. Cible **n/n/n/n** ; ici **19 questions**
ont la bonne réponse seule en tête (`plan-rangs-qcm securite --incise`).
⚠️ **NE POSE PAS TES INCISES EN FIN DE DISTRACTEUR** — au 42ᵉ cela a ouvert « écarter la glose
finale », et la fermer en *supprimant* une incise rouvrait l'indice précédent : il faut **déplacer**.

### (5) LE MOT TECHNIQUE EXCLUSIF — 70,2 %, couverture **72,6 %**

C'est le deuxième indice du cours, et le plus couvrant après la longueur. La bonne réponse ne doit
pas être la seule à employer un mot de **9 lettres et plus** qu'aucune autre n'emploie.
⚠️⚠️ **VISE L'ÉGALITÉ, PAS ZÉRO** : l'écraser retourne l'indice (mesuré aux 39ᵉ et 41ᵉ). Et au 44ᵉ,
**fermer les questions tranchées a FAIT MONTER la stratégie** de 25,8 % à 27,5 % : une question
tranchée qui vaut 0 rapporte +0,25 quand on la ferme, alors qu'une **égalité à deux** incluant la
bonne réponse vaut 0,50. **Égalise les ex æquo en même temps que les questions tranchées.**
⚠️ Mots de 9 lettres et plus à surveiller ici : `authentification`, `autorisation`, `chiffrement`,
`injection`, `désérialisation`, `dépendance`, `certificat`, `utilisateur`, `navigateur`,
`impersonation`, `journalisation`, `vulnérable`.

### (6) L'ÉCHO DE L'ÉNONCÉ — 35,5 %, couverture 24,2 %

**LES QUATRE OPTIONS PORTENT LE MÊME NOMBRE DE MOTS D'ÉCHO** (mots de 4 lettres et plus repris de
l'énoncé, comptés en ENSEMBLE). C'est une **égalité**, pas une inégalité.

### (7) L'INDICE LEXICAL — **50 questions EXPLOITABLES sur 62**, et **60 sur 62 à mettre en forme**

**RÈGLE DU `k`** : soit `k` le nombre de mots de **6 lettres et plus absents de la page** que porte
la bonne réponse (intouchable). **Les trois distracteurs en portent EXACTEMENT `k`** (`k = 0` →
`0/0/0`, `k > 0` → `k/k/k`). Mettre les trois à zéro quand `k > 0` **retourne** l'indice ; `0/0/k`
laisse 50 % à qui restreint.
**RÈGLE DU `w`** : soit `w` le nombre de mots de 6 lettres et plus de la bonne réponse — **ou les
quatre options portent le même `w`, ou au moins un distracteur en porte strictement plus.**
⚠️ **CONSTITUE LE DICTIONNAIRE DE LA PAGE AVANT DE RÉDIGER** : `node tools/mesure-lexique-qcm.js
--liste=securite` donne, question par question, le `k` visé, le `w` et les mots en cause. Cible :
**0 exploitable ET 0 à mettre en forme**.
⚠️ **LA CONTRAINTE À QUATRE CONDITIONS** : un mot de remplacement doit faire **moins de 9 lettres**,
**au moins 6**, être **présent dans la page** et **absent de l'énoncé**. Trois sur quatre ne suffit
pas.
⚠️⚠️ **PIÈGE MESURÉ AU 44ᵉ, ET IL A COÛTÉ DEUX QUESTIONS** : `grep -ci` n'est **pas** l'outil. La
page peut contenir « recolle » sans contenir « recollé » — l'outil compare des **jetons entiers**,
et l'apostrophe comme le tiret **séparent** les mots. **Lance `mesure-lexique-qcm`, jamais un
substitut.** Même vigilance sur la longueur : remplacer un mot de 6 lettres par un de 5 fait perdre
d'un coup **un mot long et un mot étranger**.

### (8) LE MOT FÉTICHE — **3 alertes**

`node tools/mesure-mot-fetiche.js securite` (colonnes : `vu / bonnes / distracteurs`) :

| mot | vu | bonnes | distracteurs | questions tranchées | lecture |
|---|---:|---:|---:|---:|---|
| `parce` | 26 | **1** | **25** | 10 | **ÉCARTER rend 31,7 %** |
| `serveur` | 13 | 6 | 7 | 12 | RESTREINDRE 29,0 % |
| `données` | 14 | 6 | 8 | 12 | RESTREINDRE 28,2 % |

⚠️ **`parce` est un tic de DISTRACTEUR ici** (1 bonne réponse contre 25 distracteurs) : « écarter
l'option qui commence par *Parce que* » gagne. La règle vaut dans les deux sens : **par question,
les quatre options commencent par « Parce que », ou aucune.** Comme la bonne réponse est
intouchable, c'est à tes distracteurs de renoncer à la formule là où elle ne la porte pas.
⚠️ **SINGULIER/PLURIEL** : `serveur`/`serveurs`, `donnée`/`données`, `requête`/`requêtes` sont des
jetons **différents** pour l'outil.

### (9) L'INTRUS LEXICAL — **8 questions tranchées à coup sûr, le RECORD du chantier**

`node tools/mesure-mot-question.js securite --liste` : lecture **PAR DÉFAUT 31,5 %, 8 questions
sûres** (contre 4 sur `sass`, 3 sur `clojure`). Parmi elles : `lecon-01` (`quelle`), `lecon-02` et
`lecon-06` (`parce`). Règle : **par mot, les quatre options le portent, ou aucune**, appliquée
**question par question**.
⚠️ **`mesure-mot-fetiche` ne le voit pas** (il exige ≥ 8 questions tranchées par le même mot) :
lance les deux, et **lis la colonne « sûres », pas la colonne « taux »**.
⚠️ **NE CRÉE PAS un 3/4 dont l'intrus serait la bonne réponse** : elle est intouchable, donc
l'indice deviendrait irrattrapable.

### (10) LE POINT INTERNE — **1 question aujourd'hui, et c'est la CORRECTION qui le fabrique**

`la seule en deux phrases` rend déjà **100 % de rendement** sur son unique question. Sur les cours
traités, la couverture de cet indice est presque **deux fois** celle des cours non traités : c'est
le réflexe de qui étoffe une bonne réponse. **Ici le risque est ton distracteur allongé.**
> **Dans une question donnée, les quatre options portent le MÊME nombre de phrases.** La signature
> est **un point suivi d'une espace puis d'une majuscule** (`etc.`, la virgule décimale et le point
> d'un `objet.methode()` ne comptent pas).

### (11) LE SENS INVERSE — déjà **3 alertes AVANT ton passage**

| stratégie | tranche | DIRECTE | INVERSE | GLOBAL |
|---|---:|---:|---:|---:|
| la DEUXIÈME plus longue | 59 | 1,7 % | 32,8 % | **32,4 %** |
| la TROISIÈME plus longue | 58 | 1,7 % | 32,8 % | **32,3 %** |
| la moins bavarde | 48 | **0,0 %** | 33,3 % | **31,5 %** |

Elles se refermeront **si et seulement si** tu tiens les fenêtres de `plan-rangs-qcm` **et** la règle
(2). Ne les traite pas séparément : **elles sont la longueur vue de dos.**

### (12) Les marques à ne pas ouvrir

**flèche** (0 partout), **guillemets** (1 distracteur, 0 bonne réponse), **virgule décimale**, et
surtout **« la seule qui nie »**, déjà à **36,8 % sur 32,3 % des questions** : égalise la négation
(« ne… pas », « aucun », « jamais », « sans »). Attention aussi à **« la plus prudente »** (34,3 %,
rendement 72,7 %) : en sécurité, la bonne réponse est souvent la plus nuancée — **tes distracteurs
doivent nuancer autant qu'elle**, sans devenir vrais pour autant.

---

## Les six contraintes de non-régression

1. **La bonne réponse est intouchable** — `q`, `correct`, `explain` et son texte. ⚠️ **SAUF si elle
   est FAUSSE** : au 40ᵉ (`crypto`) une bonne réponse annonçait un chiffre que son propre programme
   contredit, au 42ᵉ trois figures se contredisaient, au 43ᵉ un bloc annonçait 11 assertions pour 9,
   au 44ᵉ une bonne réponse de bilan contredisait un bloc de code de sa propre page. **Remonte, ne
   recopie pas.**
2. **La fenêtre de caractères** de `plan-rangs-qcm`, simulée avant d'écrire — et le **rang en mots**
   aligné sur le rang en caractères.
3. **Par marque : les quatre options, ou aucune** — ponctuation (et leur UNION, et le **compte** des
   incises), mots fétiches, mots d'une seule question, **et le nombre de PHRASES**.
4. **`k / k / k / k`** sur les mots étrangers à la page, et le `w` fermé séparément.
5. **Le distracteur reste FAUX, et il reste INOFFENSIF** (voir l'encadré en tête). Le coût mesuré
   d'un distracteur devenu vrai est de **1,68 réécriture**. Demande-toi toujours : *existe-t-il une
   lecture où cette phrase est exacte ?* — et : *un lecteur pressé pourrait-il la prendre pour un
   conseil ?*
6. ⚠️⚠️ **ÉCRIS UNE THÈSE FAUSSE, PAS UNE SALADE DE MOTS.**

---

## Le contrôle d'après, à citer dans ton compte rendu

```
node tools/mesure-biais-qcm.js --seul=securite           # les 43 strategies, sens direct
node tools/mesure-biais-inverse.js --toutes securite     # les 42, sens INVERSE (colonne GLOBAL)
node tools/mesure-lexique-qcm.js --liste=securite        # 0 exploitable ET 0 a mettre en forme
node tools/mesure-mot-fetiche.js securite                # 0 alerte
node tools/mesure-mot-question.js securite --liste       # 0 question « sure », les DEUX lectures
node tools/mesure-qcm-longueurs.js securite              # rangs, cible 16/16/15/15
node tools/mesure-qcm-intouchable.js securite <ref>      # 0 atteinte
node tools/plan-rangs-qcm.js securite                    # ce qu'il reste a ecrire
```

**Cible : 25 % dans les DEUX sens, sur les 43 stratégies — 0 mot fétiche, et 0 question « sûre ».**

---

## ⚠️ Ce que les passes 39 à 44 ont appris sur la MÉTHODE

1. **La contradiction adversariale doit elle-même être contredite.** Un remède proposé n'est pas un
   ordre : évalue-le, et si tu le rejettes, écris la preuve. Au 44ᵉ, **les deux pistes données par
   l'orchestrateur comme « déjà vérifiées » étaient fausses**, et les deux agents l'ont prouvé.
2. **Fermer un indice en rouvre un autre — trois fois de suite au 42ᵉ.** Après chaque retouche,
   **rejoue TOUTES les mesures**, pas seulement celle que tu visais.
3. **Un relecteur qui mesure sur SON LOT extrapole faux.** Toujours remesurer sur le corpus complet.
4. **Un diagnostic qui n'est pas la copie exacte de l'outil fait travailler à côté** (43ᵉ : une regex
   de mots ; 44ᵉ : un `grep` à la place d'une comparaison de jetons). **Lance l'outil.**
5. **Corriger un CORPS de leçon rouvre l'indice lexical** : le dictionnaire change. Corps d'abord,
   QCM ensuite.
6. **N'écris QUE dans les leçons de ton lot**, et **aucun `git commit` / `git add` / `git stash`** —
   l'orchestrateur seul commite.
7. **Le JSON doit rester valide et le fichier sans BOM** : `JSON.parse` sur chaque bloc touché, puis
   `node tools/verif-html.js`.
8. **Un script lancé via `node -e '…'` en quotes simples se fait manger un niveau de backslash par
   l'outil Bash.** Écris le script dans un fichier avant de le lancer.
