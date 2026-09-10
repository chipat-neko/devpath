# Consigne d'écriture — les QCM du cours `dataviz` (B4, 35ᵉ cours)

Tu réécris **les distracteurs** des QCM d'un lot de leçons du cours `dataviz` (visualisation de
données : grammaire graphique, choix du type de graphique, échelles, couleur, perception, mensonges
graphiques, tableaux de bord). La question, l'index `correct`, l'explication et **le texte de la
bonne réponse** sont **INTOUCHABLES** : `tools/mesure-qcm-intouchable.js` le contrôle et signalera
toute atteinte. Tu ne touches qu'aux **trois options fausses** de chaque question.

## Pourquoi

Un apprenant qui ne comprend rien au cours réussit **95,6 %** des QCM de `dataviz` en cochant
simplement **l'option la plus longue** — rendement **95,6 %**, couverture **100,0 %** : la stratégie
tranche sur **toutes** les questions, sans un seul ex æquo. C'est le cours le plus nocif du site
parmi les 53 qui restent. Et onze autres stratégies mécaniques dépassent largement le hasard, dont
**cinq à plus de 96 % de rendement**.
**Ton lot doit ramener chaque indice à 25 %, l'étalon du hasard.** On ne rend pas les questions plus
difficiles : on rend les **distracteurs crédibles**.

## Ce que tu dois tenir, dans l'ordre d'importance

### (1) LA LONGUEUR — 95,6 %, rendement 95,6 %, couverture 100 %

`node tools/plan-rangs-qcm.js dataviz` donne, question par question, la **fenêtre de caractères**
visée pour chaque distracteur. **66 questions sur 68** sont à retoucher, soit **8 789 caractères**
à écrire. La bonne réponse est **65 fois au rang 0** ; l'outil vise **17 / 17 / 17 / 17**.

⚠️ **VISE LA FENÊTRE, PAS « PLUS LONG »**. Écraser « la plus longue » ne fait que **déplacer** le
biais d'un rang : sur `sql`, la bonne réponse mise au rang 1 partout rendait **60,9 %** à qui
cochait « la deuxième plus longue ». C'est pour ça que l'outil demande une **répartition**.

⚠️ **SIMULE AVANT D'ÉCRIRE.** Compte les caractères en JS (`[...s].length`, un accent compte 1).
**La moitié des textes proposés sans simulation cassent la fenêtre.**

### (2) LA PLUS DÉTAILLÉE — 71,0 %, rendement **97,6 %**

La bonne réponse ne doit pas être la seule à donner un exemple, un type de graphique, un nom de
canal visuel, un chiffre. **Fais porter du concret à tes distracteurs** — du concret **faux** : un
type de graphique employé pour la mauvaise question, une échelle mal choisie, une palette
inadaptée. Avec la longueur, c'est l'indice le plus payant du cours.

### (3) L'INCISE ENTRE PARENTHÈSES — 59,9 %, rendement **97,0 %**

`RESTREINDRE à la parenthèse` : **60,3 %**, rendement **97,0 %**. `node tools/plan-rangs-qcm.js
dataviz --incise` donne les **32 questions** concernées. Formulation exacte de la règle, apprise sur
`java` : **autant d'incises que la bonne réponse** — et non « pas la seule à en porter » (cette
formulation molle laissait l'indice à 39,9 %).

⚠️ **« Au moins un distracteur porte la marque » NE SUFFIT PAS** — plafond trouvé sur `data-eng` :
il reste **50 %** à qui **RESTREINT** son tirage aux options marquées.
**Par marque : ou les quatre options la portent, ou aucune.**

### (4) LES AUTRES MARQUES DE PONCTUATION

- `RESTREINDRE aux deux-points` : **51,5 %**, rendement **96,0 %**.
- `la seule avec un point-virgule` / `RESTREINDRE au point-virgule` : **30,5 %**, rendement
  **100 %**. Corriger est bon marché — tu **ajoutes** un `;` dans des distracteurs.
- `la seule avec un tiret` : **27,9 %**, rendement 75,0 %.
- **guillemets** : `--marques` signale **4 questions**, dont une où la bonne réponse est la seule à
  **NE PAS** porter la marque — il suffit d'écarter celle qui la porte. Les deux sens comptent.
- **point interne** (option en deux phrases) : à **0** aujourd'hui. C'est l'indice le plus fort du
  site (99,0 % sur 308 questions ailleurs) : **ne l'ouvre pas.** Les quatre ou aucune.
- **flèche** (`→`, `->`) : à **0** aujourd'hui. N'en introduis pas dans un seul distracteur.
- ⚠️ **VIRGULE DÉCIMALE — stratégie neuve (2026-09-08, 38ᵉ), et ce cours est chiffré.** Elle rend
  **55,4 %** sur le site et **100 % sur `crypto` et `observabilite`**. Elle est à **0 %** sur
  `dataviz` aujourd'hui : **ne l'ouvre pas.** Si la bonne réponse écrit un seuil à décimale
  (« 4,5 », « 0,8 »), les trois distracteurs en écrivent un aussi — et **la série ne doit être ni
  régulière ni ordonnée autour de la bonne réponse** : sur `a11y`, corriger la virgule a fabriqué
  « prendre le plus grand nombre » à 100 % sur la question.

### (5) LE MOT TECHNIQUE EXCLUSIF — 51,0 %, rendement 65,1 %

Le vocabulaire du métier (`canal visuel`, `échelle`, `marque`, `encodage`, `séquentielle`,
`divergente`, `catégorielle`, `histogramme`, `nuage de points`, `treemap`, `heatmap`,
`log`, `axe`, `légende`, `agrégation`, `rapport encre/données`…) ne doit pas n'apparaître que dans
la bonne réponse : **au moins deux distracteurs emploient du vocabulaire du même registre**, en
disant quelque chose de faux.

⚠️ Cet indice **MONTE** quand on écrit du français naturel avec le vocabulaire du cours (mesuré sur
`mobile` : 25,0 % → 42,5 %). Surveille-le après écriture. ⚠️ Et il a un **INVERSE** (`ECARTER le mot
technique exclusif`, dans l'outil) : ne laisse pas non plus **un distracteur seul** porter un mot
long que personne d'autre n'emploie.

### (6) L'INDICE LEXICAL — **55 questions EXPLOITABLES sur 68**, 59 à mettre en forme

Un apprenant qui cherche au clavier (Ctrl+F) **les mots de chaque option dans la page** réussit.

**RÈGLE DU `k`** : soit `k` le nombre de mots de **6 lettres et plus absents de la page** que porte
la bonne réponse (intouchable). **Les trois distracteurs en portent EXACTEMENT `k`.**
- `k = 0` → `0 / 0 / 0`
- `k > 0` → `k / k / k`

Ne mets **pas** les trois à zéro quand `k > 0` : ça retourne l'indice (variante INVERSE, **100 %**
sur `mobile`). Et `0 / 0 / k` laisse **exactement 50 %** à qui restreint son tirage aux deux options
les plus étrangères. **Seule l'égalité des quatre ferme les deux lectures.**

**RÈGLE DU `w`, et elle NE SE DÉDUIT PAS DU `k`** (reconfirmée sur `a11y` le 2026-09-08 : trois
questions tenaient un `k` parfaitement égal et restaient exploitables). Soit `w` le nombre de mots
de 6 lettres et plus de la bonne réponse : **ou les quatre options portent le même `w`, ou au moins
un distracteur en porte strictement plus.** C'est `w`, pas `k`, qui ferme la stratégie PROPORTION.

Outil : `node tools/mesure-lexique-qcm.js --liste=dataviz` — il liste les questions non conformes,
option par option, avec les mots fautifs **et** l'objectif du `w`. Cible : **0 exploitable ET 0 à
mettre en forme**.

### (7) LA MOINS BAVARDE, À L'ENVERS — `ECARTER la moins bavarde` : 39,2 %, rendement **100 %**

Il suffit d'**écarter** l'option la plus courte pour gagner. Ne laisse pas un distracteur nettement
plus maigre que les trois autres — le cours en est plein aujourd'hui (« Uniquement une marque et une
couleur », 36 caractères, face à une bonne réponse de 65). La fenêtre de longueur te le règle si tu
la respectes vraiment.

### (8) L'ÉCHO DE L'ÉNONCÉ — 40,0 %, rendement 59,3 %

La bonne réponse ne doit pas être la seule à reprendre les mots de la question : fais-les reprendre
par **UN seul** distracteur. ⚠️ **Pas par les trois** : sur `data-eng` l'écho s'est RETOURNÉ
(40,8 % → 11,3 %) et « écarter l'option la plus écho » a rendu **30,4 %**. Cette règle inverse est
**dans le cliquet** : un lot qui met l'écho à zéro partout fera échouer la chaîne.

### (9) Les indices mineurs à ne pas RECRÉER

- **La négation** (32,7 %) : n'écris pas la négation uniquement dans la bonne réponse, ni des
  distracteurs tous positifs quand la bonne réponse nie.
- **Les absolus** : ce cours abuse de « Uniquement… », « Toujours… », « Ne jamais… », « Il exige… »
  **dans les seuls distracteurs** (`Toujours ajouter de la 3D et des dégradés`, `Ne jamais mettre de
  titre ni d'axe`). C'est exactement ce que la stratégie exploite. **Sors de ce moule** : un
  distracteur crédible affirme quelque chose de **précis et de faux**, il n'a pas besoin d'un absolu.
- **L'attaque unique** (30,5 %) : ne fais pas commencer tous tes distracteurs par le même mot. Un
  connecteur causal répété est un tic que nos vagues ont déjà fabriqué sur `nodejs` (1/7 → 9/9).
- **La casse** : ne fais pas commencer les distracteurs par une minuscule quand la bonne réponse
  commence par une majuscule, ni l'inverse. ⚠️ `mesure-lexique-qcm` met en minuscules avant de
  comparer : **la casse n'est mesurée par rien**, c'est à toi de la tenir.
- **Le point final** : ne termine pas tout ton lot par le même signe. Sur `react`, le point final
  valait **100 % sur le lot** d'un seul écrivain.
- **MAJUSCULE d'emphase** : pas de mot en capitales exclusif à la bonne réponse. Un sigle compte.

## Méthode

1. **Lis tes leçons en entier** (corps + QCM) : un distracteur ne s'écrit pas sans le contenu
   enseigné, et l'indice lexical se calcule sur le texte de la page.
2. Récupère ton plan : `node tools/plan-rangs-qcm.js dataviz --json` puis filtre sur tes fichiers ;
   idem `--incise`, `--ponctuation`, `--marques`, et
   `node tools/mesure-lexique-qcm.js --liste=dataviz`.
3. Réécris les distracteurs question par question. **SIMULE AVANT D'ÉCRIRE** : caractères, marques,
   ponctuation, mots de 6 lettres et plus absents de la page, et le `w`.
4. **Écris avec un script Node** qui relit le bloc `data-quiz`, remplace les seules options fausses
   et réécrit le fichier. **N'écris pas le JSON à la main.** Après chaque fichier, vérifie que le
   bloc se reparse (`JSON.parse`). ⚠️ **N'écris pas ce script avec un *heredoc*** : le shell de
   cette machine mange un niveau d'antislash — `[\\s\\S]` devient `[sS]` et le script ne trouve
   rien **sans lever d'erreur**. Utilise l'outil d'écriture de fichier.
   ⚠️ **L'arbre de travail est mixte LF/CRLF** : accepte les deux (`\r?\n`) et réécris avec la même
   fin de ligne que celle lue.
5. Après écriture, relance `plan-rangs-qcm dataviz`, `--incise`, `--ponctuation`, `--marques`,
   `mesure-lexique-qcm --liste=dataviz` et `node tools/verif-html.js`.
6. Rends un compte rendu : questions traitées, distracteurs réécrits, rangs obtenus, **et la liste
   de ce que tu n'as pas pu tenir avec la raison**. ⚠️ Sur `mobile`, c'est cette dernière section
   qui a révélé le retournement de l'indice lexical : **elle rapporte plus que la consigne**.

## Trois interdits absolus

⚠️ **UN DISTRACTEUR NE DOIT JAMAIS DEVENIR VRAI.** C'est la faute la plus grave possible : elle crée
une question à deux bonnes réponses, et l'apprenant qui comprend est puni. Chaque option doit être
**franchement fausse** — pas « fausse par une nuance ». Méfie-toi de ces énoncés, qui sont **vrais**
en visualisation de données et qu'il ne faut donc **surtout pas** écrire comme distracteurs :

- l'axe des ordonnées d'un **diagramme en barres** doit partir de zéro (c'est la **longueur** qui
  code la valeur) ; cette contrainte ne s'applique pas de la même façon à une **courbe** ;
- une **bulle** code la valeur par son **aire**, pas par son rayon ni son diamètre ;
- un **camembert** devient illisible au-delà de quelques parts : comparer des angles est difficile ;
- un **histogramme** montre la distribution d'une variable continue ; un **diagramme en barres**
  compare des catégories — ce ne sont pas les mêmes objets ;
- dans un **empilement**, seul le segment du bas repose sur une base commune : les autres flottent ;
- une échelle **logarithmique** sert à faire tenir des ordres de grandeur différents ;
- les palettes **séquentielle / divergente / catégorielle** ont des usages distincts, et une palette
  arc-en-ciel n'est pas perceptuellement uniforme ;
- environ **8 % des hommes** ont une forme de daltonisme : ne jamais coder une information par la
  seule couleur — c'est vrai, donc ce n'est pas un distracteur ;
- **agréger peut inverser une tendance** (paradoxe de Simpson) ;
- position et longueur sont des canaux visuels **plus précis** que l'aire, l'angle ou la couleur.

⚠️ **NE MODIFIE RIEN D'AUTRE** : ni la question, ni `correct`, ni `explain`, ni le texte de la bonne
réponse, ni le corps de la leçon, ni un fichier hors de ton lot. Deux agents qui écrivent dans le
même fichier se détruisent mutuellement. **Ne fais aucun `git`** — ni `add`, ni `commit`, ni
`stash`, ni `checkout`.

⚠️ **RIEN N'EST EXÉCUTABLE ICI** pour trancher un point de visualisation : le site est hors ligne.
**N'invente aucune sortie ni aucune mesure.** Raisonne par la règle du domaine. En cas de doute,
choisis un distracteur qui porte sur un **mécanisme** plutôt que sur une **valeur chiffrée**.

⚠️ **Si le corps d'une leçon de ton lot est faux**, ne le corrige pas : **signale-le** dans ton
compte rendu, avec la citation exacte et ce que dit la règle. C'est le coordinateur qui tranche.

## Ce que la passe précédente a coûté, et qu'il faut anticiper

Sur `a11y` (34ᵉ cours, 2026-09-08), la vague d'écriture a été suivie de quatre relectures
adversariales qui ont rendu **45 défauts de fond** ; les corriger a **rouvert l'indice lexical**
(0 → 21 questions exploitables) et coûté **43 réécritures de rattrapage**, soit **0,68 rattrapage
par correction de fond**. **Chaque distracteur que tu écris faux dès le premier coup économise 1,68
réécriture.** C'est la raison pour laquelle l'interdit « un distracteur ne doit jamais devenir
vrai » passe avant tous les indices de forme.
