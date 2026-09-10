# Consigne d'écriture — les QCM du cours `a11y` (B4, 34ᵉ cours)

Tu réécris **les distracteurs** des QCM d'un lot de leçons du cours `a11y` (accessibilité web :
HTML sémantique, ARIA, contraste, navigation au clavier, lecteurs d'écran, WCAG/RGAA). La question,
l'index `correct`, l'explication et **le texte de la bonne réponse** sont **INTOUCHABLES** : un
vérificateur (`tools/mesure-qcm-intouchable.js`) le contrôle et signalera toute atteinte. Tu ne
touches qu'aux **trois options fausses** de chaque question.

## Pourquoi

Un apprenant qui ne comprend rien au cours réussit **94,2 %** des QCM de `a11y` en cochant
simplement **l'option la plus longue** (rendement **94,2 %**, couverture **100,0 %** : la stratégie
tranche sur **toutes** les questions, il n'y a pas un seul ex æquo). C'est le cours le plus nocif du
site parmi ceux qui restent. Et ce n'est pas le seul indice : **onze** autres stratégies mécaniques
dépassent largement le hasard, dont **huit à 100 % de rendement**.
**Ton lot doit ramener chaque indice à 25 %, l'étalon du hasard.** On ne rend pas les questions plus
difficiles : on rend les **distracteurs crédibles**.

## Ce que tu dois tenir, dans l'ordre d'importance

### (1) LA LONGUEUR — 94,2 %, rendement 94,2 %, couverture 100 %

`node tools/plan-rangs-qcm.js a11y` te donne, question par question, la **fenêtre de caractères**
visée pour chaque distracteur. Sur ce cours, **66 questions sur 69** sont à retoucher, soit
**9 890 caractères** à écrire. La bonne réponse est aujourd'hui **65 fois au rang 0** (la plus
longue) ; l'outil vise la répartition **18 / 17 / 17 / 17**.

⚠️ **VISE LA FENÊTRE, PAS « PLUS LONG »**. Écraser « la plus longue » ne fait que **déplacer** le
biais d'un rang : sur le cours `sql`, la bonne réponse mise au rang 1 partout rendait **60,9 %** à
qui cochait « la deuxième plus longue ». C'est pour ça que l'outil demande une **répartition**. Ici
« la DEUXIÈME plus longue » est à **1,4 %** et « la TROISIÈME » à **2,9 %** : ce sont des taux
**sous** le hasard, donc des indices inverses déjà présents — la répartition les ferme aussi.

⚠️ **SIMULE AVANT D'ÉCRIRE.** Compte les caractères en JS (`[...s].length`, un accent compte 1).
**La moitié des textes proposés sans simulation cassent la fenêtre.** Un script Node jetable qui
vérifie les cinq contraintes coûte moins cher qu'une reprise.

### (2) LA PLUS DÉTAILLÉE — 69,7 %, rendement **97,4 %**

La bonne réponse ne doit pas être la seule à donner un exemple, un attribut, une valeur, un chiffre.
**Fais porter du concret à tes distracteurs** — du concret qui dit quelque chose de **faux** (un
attribut ARIA réel employé de travers, un ratio de contraste inexact, un élément HTML mal choisi).
Avec la longueur, c'est l'indice le plus payant du cours.

### (3) LES MARQUES DE PONCTUATION — plusieurs indices à **100 % de rendement**

- `RESTREINDRE à la parenthèse` : **55,8 %**, rendement **100 %** ; `l'incise entre parenthèses` :
  **54,7 %**, rendement **100 %**, et **28 questions** où la bonne réponse est SEULE en tête.
  `node tools/plan-rangs-qcm.js a11y --incise` donne la liste. Formulation exacte de la règle,
  apprise sur `java` : **autant d'incises que la bonne réponse** — et non « pas la seule à en
  porter » (cette formulation molle laissait l'indice à 39,9 %).
- `RESTREINDRE aux deux-points` : **35,7 %**, rendement 75,0 %.
- `la seule avec un tiret` : **31,5 %**, rendement **100 %**.
- `la seule avec un point-virgule` / `RESTREINDRE au point-virgule` : **30,4 %**, rendement
  **100 %**. Corriger est bon marché — tu **ajoutes** un `;` dans des distracteurs.
- Densité globale : la bonne réponse est **la seule la plus ponctuée 38 fois sur 69 (55,1 %)**.
  `--ponctuation` donne le détail.

⚠️ **« Au moins un distracteur porte la marque » NE SUFFIT PAS** — c'est le plafond trouvé sur
`data-eng` : il reste **50 %** à l'apprenant qui **RESTREINT** son tirage aux options marquées.
**Par marque : ou les quatre options la portent, ou aucune.**

### (4) LE MOT TECHNIQUE EXCLUSIF — 56,3 %, rendement 70,2 %

Le vocabulaire du métier (`ARIA`, `role`, `aria-label`, `aria-live`, `aria-describedby`,
`aria-hidden`, `tabindex`, `alt`, `landmark`, `lecteur d'écran`, `arbre d'accessibilité`,
`contraste`, `focus`, `sémantique`, `WCAG`, `RGAA`, `skip link`, `<fieldset>`, `<legend>`,
`<caption>`, `scope`, `prefers-reduced-motion`…) ne doit pas n'apparaître que dans la bonne
réponse : **au moins deux distracteurs emploient du vocabulaire du même registre**, en disant
quelque chose de faux.

⚠️ Cet indice **MONTE** quand on écrit du français naturel avec le vocabulaire du cours (mesuré sur
`mobile` : 25,0 % → 42,5 %). Surveille-le après écriture. ⚠️ Et il a un **INVERSE** mesuré depuis le
cours `c` : ne laisse pas non plus **un distracteur seul** porter un mot long que personne d'autre
n'emploie — la stratégie `ECARTER le mot technique exclusif` est dans l'outil.

### (5) L'INDICE LEXICAL — **60 questions EXPLOITABLES sur 69**, 64 à mettre en forme

Un apprenant qui cherche au clavier (Ctrl+F) **les mots de chaque option dans la page** réussit.

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

Outil : `node tools/mesure-lexique-qcm.js --liste=a11y` — il liste les questions non conformes,
option par option, avec les mots fautifs. Objectif : **0 exploitable ET 0 à mettre en forme**.

### (6) LA MOINS BAVARDE, À L'ENVERS — `ECARTER la moins bavarde` : 40,9 %, rendement **100 %**

Il suffit d'**écarter** l'option la plus courte pour gagner. Ne laisse pas un distracteur nettement
plus maigre que les trois autres : la fenêtre de longueur du plan te le règle si tu la respectes
vraiment. Même chose pour `la moins bavarde` à **0,4 %** — un taux **sous** le hasard est un indice
**inverse**, pas un indice fermé.

### (7) L'ÉCHO DE L'ÉNONCÉ — 30,6 %, rendement 33,3 %

La bonne réponse ne doit pas être la seule à reprendre les mots de la question : fais-les reprendre
par **UN seul** distracteur. ⚠️ **Pas par les trois** : sur `data-eng` l'écho s'est RETOURNÉ
(40,8 % → 11,3 %) et « écarter l'option la plus écho » a rendu **30,4 %**. Cette règle inverse est
**dans le cliquet** : un lot qui met l'écho à zéro partout fera échouer la chaîne.

### (8) LES AUTRES MARQUES — `node tools/plan-rangs-qcm.js a11y --marques`

- **guillemets** : rendement **100 %**, deux questions concernées (`lecon-04` q3 et `lecon-12` q1)
  où la bonne réponse est **seule** à porter des guillemets français. **Les quatre ou aucune.**
- **MAJUSCULE d'emphase** : **29,3 %**, rendement **100 %**. Pas de mot en capitales exclusif à la
  bonne réponse. ⚠️ Un sigle comme `ARIA`, `WCAG`, `HTML` compte : s'il n'est que dans la bonne
  réponse, l'indice se rouvre.
- **point interne** (option écrite en deux phrases) : à **0** aujourd'hui sur ce cours. C'est
  l'indice le plus fort du site (99,0 % sur 308 questions ailleurs) : **ne l'ouvre pas**. Si tu
  écris un distracteur en deux phrases, écris-les **tous les quatre** ainsi — sinon aucun.
- **flèche** : à **0** aujourd'hui. N'introduis pas de `→` dans un seul distracteur.

Cible : **les quatre ou aucune.**

### (9) Les indices mineurs à ne pas RECRÉER

- **La négation** (30,9 %) : n'écris pas la négation uniquement dans la bonne réponse, ni des
  distracteurs tous positifs quand la bonne réponse nie.
- **Les absolus** (`ecarter les absolus` : 30,7 %, rendement **100 %**) : ce cours abuse de
  « Uniquement… », « Seulement… », « Jamais… », « Toujours… » **dans les seuls distracteurs**.
  C'est exactement ce que la stratégie exploite. **Sors de ce moule** : un distracteur crédible
  affirme quelque chose de précis et de faux, il n'a pas besoin d'un absolu pour être faux.
- **La plus prudente** (26,8 %) : ne réserve pas la nuance (« souvent », « selon le lecteur
  d'écran », « en pratique ») à la bonne réponse.
- **L'attaque unique** : ne fais pas commencer tous tes distracteurs par le même mot. ⚠️ Ce cours en
  est déjà plein — beaucoup de distracteurs commencent par « Parce que… », « Uniquement… », « À… ».
  Un connecteur causal répété est un tic que nos vagues ont déjà fabriqué sur `nodejs` (1/7 → 9/9).
- **La casse** : ne fais pas commencer les distracteurs par une minuscule quand la bonne réponse
  commence par une majuscule, ni l'inverse. ⚠️ `mesure-lexique-qcm` met en minuscules avant de
  comparer, donc **la casse n'est mesurée par rien** de ce côté — c'est à toi de la tenir.
- **Le point final** : ne termine pas tout ton lot par le même signe. Sur `react`, le point final
  valait **100 % sur le lot** d'un seul écrivain.

## Méthode

1. **Lis tes leçons en entier** (corps + QCM) : un distracteur ne peut pas être écrit sans le
   contenu enseigné, et l'indice lexical se calcule sur le texte de la page.
2. Récupère ton plan : `node tools/plan-rangs-qcm.js a11y --json` puis filtre sur tes fichiers ;
   idem `--incise`, `--ponctuation`, `--marques`, et
   `node tools/mesure-lexique-qcm.js --liste=a11y`.
3. Réécris les distracteurs question par question. **SIMULE AVANT D'ÉCRIRE** : compte les
   caractères, les marques, la ponctuation et les mots de 6 lettres et plus absents de la page.
4. **Écris avec un script Node** qui relit le bloc `data-quiz`, remplace les seules options fausses
   et réécrit le fichier. **N'écris pas le JSON à la main.** Après chaque fichier, vérifie que le
   bloc se reparse (`JSON.parse`). ⚠️ **N'écris pas ce script avec un *heredoc*** : le shell de
   cette machine mange un niveau d'antislash, ce qui a déjà corrompu deux outils de mesure
   silencieusement. Utilise l'outil d'écriture de fichier.
5. Après écriture, relance `plan-rangs-qcm a11y` (tes questions au rang cible), `--incise`,
   `--ponctuation`, `--marques`, `mesure-lexique-qcm --liste=a11y` et `node tools/verif-html.js`.
6. Rends un compte rendu : questions traitées, distracteurs réécrits, rangs obtenus, **et la liste
   de ce que tu n'as pas pu tenir avec la raison**. ⚠️ Sur `mobile`, c'est cette dernière section
   qui a révélé le retournement de l'indice lexical : **elle rapporte plus que la consigne**.

## Trois interdits absolus

⚠️ **UN DISTRACTEUR NE DOIT JAMAIS DEVENIR VRAI.** C'est la faute la plus grave possible : elle crée
une question à deux bonnes réponses, et l'apprenant qui comprend est puni. Chaque option que tu
écris doit être **fausse au regard des normes réelles** (HTML vivant, WAI-ARIA, WCAG 2.2), et fausse
**franchement** — pas « fausse par une nuance ». Méfie-toi ici des pièges classiques, qui sont
**vrais** et qu'il ne faut donc surtout pas écrire comme distracteurs :

- une image décorative prend `alt=""` (attribut **présent et vide**), pas d'attribut omis ;
- `aria-hidden="true"` retire l'élément de l'arbre d'accessibilité **mais ne le retire pas de
  l'ordre de tabulation** ;
- `display:none` et `visibility:hidden` retirent bien l'élément de l'arbre d'accessibilité ;
- le contraste WCAG AA : **4,5:1** pour le texte courant, **3:1** pour le grand texte et pour les
  composants d'interface ;
- l'ordre de tabulation suit l'ordre du **DOM**, pas l'ordre visuel produit par `order` en flex ou
  grid ;
- un `tabindex` **positif** est déconseillé ; `tabindex="-1"` rend focusable par script seulement ;
- la première règle de l'ARIA : préférer l'élément HTML natif quand il existe ;
- un `placeholder` n'est **pas** un label ;
- `aria-live="polite"` attend une pause du lecteur d'écran, `assertive` interrompt ;
- `<th scope="col">` et `<caption>` sont bien la bonne façon de structurer un tableau de données ;
- `role="presentation"` retire la sémantique d'un élément.

⚠️ **NE MODIFIE RIEN D'AUTRE** : ni la question, ni `correct`, ni `explain`, ni le texte de la bonne
réponse, ni le corps de la leçon, ni un autre fichier que ceux de ton lot. Deux agents qui écrivent
dans le même fichier se détruisent mutuellement. **Ne fais aucun `git` — aucun `add`, aucun
`commit`, aucun `stash`, aucun `checkout`.**

⚠️ **RIEN N'EST EXÉCUTABLE ICI** pour trancher un point d'accessibilité : le site est hors ligne, il
n'y a ni lecteur d'écran ni validateur. **N'invente aucune sortie ni aucun comportement mesuré.**
Raisonne **par la norme**. En cas de doute, choisis un distracteur qui porte sur un **mécanisme**
plutôt que sur une **valeur chiffrée**.

⚠️ **Si le corps d'une leçon de ton lot est faux** (une affirmation que la norme contredit, un
exemple de code qui ne fait pas ce qu'il annonce), **signale-le dans ton compte rendu** — mais **ne
le corrige pas** : modifier le corps change le vocabulaire de la page et donc le calcul de l'indice
lexical de tout le lot.
