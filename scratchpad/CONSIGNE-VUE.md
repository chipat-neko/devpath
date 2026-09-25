# Consigne d'écriture — les QCM du cours `vue` (B4, 51ᵉ cours)

Tu écris les **distracteurs** d'un lot de questions du cours `vue` du site Syntaxe
(`D:\test-claude`, 100 % `file://`, aucun serveur, aucun build, aucune dépendance installée).

**Un seul agent écrit dans un fichier donné.** Tu ne touches qu'aux leçons de TON lot, et tu ne
fais **aucun commit** : l'orchestrateur s'en charge.

Les QCM sont dans `pages/vue/lecon-NN.html`, dans un bloc
`<script type="application/json" data-quiz>` (et `data-quiz-bilan` pour `lecon-14`). Le schéma est
`{"q": "...", "a": ["...", "...", "...", "..."], "correct": 0, "explain": "..."}`.

**Écris tes scripts jetables dans TON dossier scratch à toi** (`scratchpad/vue-<ton lot>/`) :
deux agents qui écrivent dans le même dossier temporaire s'écrasent mutuellement.

---

## ⚠️⚠️⚠️ LA RÈGLE QUI PRIME SUR TOUTES LES MESURES — lis-la avant tout le reste

> **UN DISTRACTEUR EST UNE PHRASE FRANÇAISE QUI ÉNONCE UNE THÈSE FAUSSE, PRÉCISE ET PLAUSIBLE.**
> Si tu ne peux pas dire en une phrase *pourquoi c'est faux*, ce n'est pas un distracteur.

Elle est en tête parce qu'elle a coûté une **troisième vague entière** au 50ᵉ cours (`nosql`) : les
46 mesures étaient toutes vertes — « la plus longue » ramenée de 99,1 % à 26,3 %, couverture 0,0 %
sur les 46 stratégies — et **15 distracteurs sur 27 ne voulaient plus rien dire**. Verbatim des
relecteurs : *« la consigne “choisis la seule option qui a un sens” tranche à 100 % sans rien
connaître au NoSQL »*. Même défaut au 39ᵉ (`scala`, 30 prises sur 54) et au 45ᵉ (`securite`, neuf
contrôles verts sur une salade de mots). Le biais de longueur y avait été remplacé par un **biais de
cohérence sémantique, qui se mesure au même endroit et qu'aucun des 47 outils ne voit.**

Exemples réels de ce qu'il ne faut PAS produire, à lire à voix haute :

- « le réglage **y protège le solde à la fin de la nuit** »
- « le moteur peut donc **unir ses listes par leur seul nom exact** »
- « Entre la durabilité (D) et la réponse des serveurs, **car la règle inévitable ne peut plus valoir
  sur un virement** »

Test de recevabilité, à appliquer à **CHAQUE** distracteur que tu écris :

1. **Je peux nommer l'erreur en une phrase.** « Il croit que `v-show` retire l'élément du DOM. »
   « Il croit qu'une `computed` accepte un argument. » Si la réponse est « il ne dit rien de
   précis », réécris.
2. **Chaque proposition a un référent.** Pas de « y » qui ne renvoie à rien, pas de « cette
   notation » sans antécédent, pas de « le compteur » jamais introduit, pas de « le même gain »
   sans comparant.
3. **Un débutant crédule pourrait le cocher.** Un distracteur absurde ne piège personne.
4. **Aucune parenthèse de remplissage.** « (gestion, profils, usages) », « (rigueur, charge) » :
   ces gloses ne veulent rien dire, elles ne servaient qu'à tenir un compte de caractères.
5. **Aucune conjonction sans logique** : la subordonnée doit justifier la principale, même faussement.

**PRÉFÈRE UNE ERREUR CLASSIQUE ET NETTE À UNE ÉLÉGANCE MESURÉE.**

---

## ⚠️ CE COURS NE S'EXÉCUTE PAS — ET C'EST UNE CONTRAINTE, PAS UN CONFORT

**Vue n'est pas installé** dans cet environnement : ni dans `node_modules` (il n'y a pas de
`node_modules`), ni dans `assets/vendor/` (qui ne contient que Prism, Pyodide et sql.js). `runner.js`
ne pose un bouton « Tester » que sur du JavaScript **sans dépendance**. **Aucune de tes affirmations
sur le comportement de Vue ne pourra être prouvée par exécution.**

Conséquence directe, et elle est stricte : **tu n'écris un distracteur que sur un point que TA page
établit**. Si tu dois supposer le texte exact d'un message d'avertissement de Vue, un chiffre de
performance, le nom exact d'une option d'API, le comportement d'une **version** donnée (Vue 2 contre
Vue 3, l'Options API contre la Composition API, telle version de Vue Router, de Pinia, de Vite ou de
Vitest), **tu ne l'écris pas** : tu le remontes dans ton compte rendu.

⚠️ Attention particulière aux **versions** : ne fonde jamais une fausseté sur un point de version
que la page ne date pas. Les 46ᵉ à 50ᵉ cours ont fait refuser quatre à six périmètres chacun pour
cette raison exacte. Ici les pièges probables sont : `Vue.set` et la réactivité des tableaux (Vue 2),
`$listeners` et `.native` (disparus en Vue 3), la signature de `emits`, le nom de `defineModel`, la
disponibilité de `<Suspense>`, l'ordre exact des hooks entre parent et enfant, le nombre de racines
autorisées dans un template, le nom exact des classes de transition. **Ne t'appuie sur ces points que
si TA page les écrit noir sur blanc.**

---

## Pourquoi ce travail

Un apprenant qui ne comprend rien au cours réussit **90,3 %** des QCM de `vue` en cochant l'option la
plus longue — **couverture 100,0 %, rendement 90,3 %**. Relevé du jour,
`node tools/mesure-biais-qcm.js --seul=vue` (62 questions) :

| indice | réussite | couverture | rendement |
|---|---:|---:|---:|
| **la plus longue** | **90,3 %** | **100,0 %** | **90,3 %** |
| la plus détaillée | **76,9 %** | 67,7 % | **100,0 %** |
| l'incise entre parenthèses | **66,9 %** | 56,5 % | **97,1 %** |
| RESTREINDRE à la parenthèse | **66,9 %** | 56,5 % | 97,1 % |
| le mot technique exclusif | **60,1 %** | 54,8 % | 85,3 % |
| la seule avec une PONCTUATION FORTE | **60,1 %** | 46,8 % | **100,0 %** |
| RESTREINDRE aux deux-points | **46,1 %** | 29,0 % | 94,4 % |
| la seule avec un point-virgule | **44,4 %** | 25,8 % | **100,0 %** |
| ECARTER la moins bavarde | **44,4 %** | 17,7 % | 72,7 % |
| l'écho de la question | **41,1 %** | 30,6 % | 73,7 % |
| ECARTER la plus courte | **35,2 %** | 1,6 % | **100,0 %** |
| la seule avec une barre oblique | **29,8 %** | 6,5 % | **100,0 %** |
| la seule avec un tiret | **29,8 %** | 6,5 % | **100,0 %** |

**Ton lot doit ramener chaque indice à 25 %, l'étalon du hasard.** On ne rend pas les questions plus
difficiles : on rend les **distracteurs crédibles**.

---

## (b) Le travail est de l'**ALLONGEMENT**

| | |
|---|---:|
| longueur moyenne d'une bonne réponse | **101,2 caractères** |
| longueur moyenne d'un distracteur | **27,5 caractères** |
| **rapport** | **3,68** |
| rapport du 42ᵉ cours (`haskell`), le record | 5,06 |
| rapport du 50ᵉ cours (`nosql`) | 3,41 |
| médiane du même rapport sur les **50 cours déjà traités** | ~1,0 |

`node tools/plan-rangs-qcm.js vue` demande **11 379 caractères** répartis sur **58 questions sur 62**.
Rangs actuels **56 / 5 / 0 / 1**, cible **16 / 16 / 15 / 15**.

⚠️ **Le distracteur moyen fait 28 caractères** : « Aucune différence », « Jamais .value », « Il
envoie le formulaire ». Presque tout le travail est de la **rédaction neuve**, pas de la retouche.

## (c) LA FORME DU DÉFAUT EST UNIFORME, ET C'EST UNE CHANCE

La bonne réponse est **« la réponse + sa justification »** ; les distracteurs sont des télégrammes.
**LE REMÈDE EST TOUJOURS LE MÊME : donne au distracteur la MÊME STRUCTURE que la bonne réponse —
la réponse fausse, PUIS sa justification fausse mais cohérente.**

---

## LES ERREURS VRAIMENT COMMISES EN VUE — n'utilise que celles que TA leçon établit

Elles se rédigent facilement sur 80 à 200 caractères, et chacune a un nom :

**Template et directives**
- croire que `v-if` masque en CSS et que `v-show` retire du DOM (c'est l'inverse : `v-if` crée et
  détruit, `v-show` ne fait que basculer `display`) ;
- croire que `v-show` est préférable quand la condition change rarement (c'est l'inverse : `v-show`
  paie le rendu une fois pour un basculement bon marché ensuite) ;
- croire que `{{ }}` fonctionne aussi dans un attribut (il faut `v-bind` / `:`) ;
- croire que `:key` sert à trier la liste, à la numéroter, ou que Vue s'en passe sans conséquence
  (elle sert à **identifier** un élément pour réutiliser le bon nœud) ;
- croire qu'un index de tableau est une bonne `:key` dans tous les cas ;
- croire que `v-for` et `v-if` sur le même élément filtrent efficacement ;
- croire qu'un template Vue 3 n'accepte qu'une seule racine.

**Réactivité**
- croire qu'on écrit `.value` partout, ou jamais : dans le **script** oui, dans le **template** Vue
  déballe la ref ;
- croire qu'une `computed` est recalculée à chaque rendu comme une méthode (elle est **mise en
  cache** tant que ses sources ne changent pas) ;
- croire qu'une `computed` peut prendre un argument, ou qu'elle sert à déclencher un effet de bord ;
- croire que `reactive()` marche sur un nombre ou une chaîne, ou qu'une déstructuration d'objet
  `reactive` garde la réactivité ;
- croire que `v-model` valide le champ, le met en lecture seule, ou envoie le formulaire ;
- croire qu'un `watch` remplace une `computed` pour afficher une valeur dérivée.

**Composants**
- croire qu'une prop est modifiable par l'enfant (le flux est **descendant** : l'enfant **émet**) ;
- croire qu'un `emit` modifie directement la donnée du parent ;
- croire qu'un `slot` sert à styler, à passer une prop, ou qu'il est l'équivalent d'une prop nommée ;
- croire que deux composants frères communiquent par leurs props sans passer par le parent ;
- croire que `provide` / `inject` remplace un magasin d'état partagé pour tout ;
- croire qu'un composant sans `name` ne peut pas être récursif, ou qu'un `key` change son identité
  de type.

**Cycle de vie, événements, routeur, formulaires, transitions, tests, production**
- croire que `onMounted` s'exécute avant le premier rendu, ou côté serveur ;
- croire qu'un écouteur posé à la main n'a pas besoin d'être retiré ;
- croire qu'un paramètre de route est une prop automatiquement typée ;
- croire qu'un garde de navigation s'exécute après le rendu de la vue ;
- croire que le mode `history` fonctionne sans configuration du serveur ;
- croire qu'une validation côté client dispense de la validation côté serveur ;
- croire qu'une transition Vue anime un élément qui n'entre ni ne sort ;
- croire qu'un test de composant qui interroge le DOM doit connaître les noms de classes internes ;
- croire qu'un `import()` dynamique réduit le poids **total** du bundle (il le **découpe**) ;
- croire qu'un `key` bien choisi remplace la mémoïsation, ou qu'un `v-once` rend l'élément réactif.

---

## Ce que tu dois tenir, dans l'ordre d'importance

### (1) LA LONGUEUR — **90,3 %, couverture 100,0 %, rendement 90,3 %**

Suis **exactement** ce que rend `node tools/plan-rangs-qcm.js vue` pour tes questions : le rang visé
et la bande de caractères option par option. Ne « corrige » pas le rang par intuition : la cible
**16 / 16 / 15 / 15** est une répartition de FICHIER, et la casser sur ton lot la casse pour tout le
monde.

### (2) ⚠️⚠️ LES RANGS ONT UNE DIRECTE DE 0,0 % — cinq alertes

`node tools/mesure-biais-inverse.js --toutes vue` rend **5 alertes** :

| stratégie | tranche | part | DIRECTE | INVERSE | GLOBAL |
|---|---:|---:|---:|---:|---:|
| la TROISIEME plus longue | 49 | 79,0 % | **0,0 %** | 33,3 % | 31,6 % |
| la QUATRIEME plus longue | 56 | 90,3 % | 1,8 % | 32,7 % | 32,0 % |
| la DEUXIEME plus longue | 54 | 87,1 % | 5,6 % | 31,5 % | 30,6 % |
| la moins bavarde (peu de mots) | 33 | 53,2 % | **0,0 %** | 33,3 % | 29,4 % |
| la casse initiale rare | 10 | 16,1 % | **0,0 %** | 33,3 % | 26,3 % |

**Une DIRECTE à 0,0 % sur une large couverture est le pire défaut possible** : elle offre une
élimination *certaine*. Viser **25 % sur CHAQUE rang**, jamais 0 %.

**LE NOMBRE DE MOTS SUIT LE RANG DE LONGUEUR.** `la moins bavarde` tranche sur 53,2 % des questions
avec une DIRECTE à 0,0 % : allonger avec quelques mots très longs ferme les caractères et laisse le
compte de mots ouvert. **Le rang en MOTS de la bonne réponse doit valoir son rang en CARACTÈRES.**

⚠️ `la casse initiale rare` est à 0,0 % sur 10 questions : la bonne réponse commence souvent par une
capitale quand les distracteurs commencent par un mot technique en minuscule (`v-if`, `computed`,
`.value`), ou l'inverse. **Fais varier la casse initiale de tes distracteurs comme celle de la bonne
réponse de la même question.**

### (3) LA PLUS DÉTAILLÉE — 76,9 %, couverture 67,7 %, **rendement 100,0 %**

La stratégie compte les `, : ;` d'une option. **Égalise ce compte sur les quatre options.** Fais
porter du **concret FAUX** à tes distracteurs : un nom réel d'API ou de directive (`v-if`, `v-show`,
`v-model`, `computed`, `watch`, `onMounted`, `defineProps`, `emit`, `slot`, `provide`) avec un effet
inventé, un mécanisme nommé qui ne fait pas ce qu'on dit.

### (4) LA PONCTUATION — la PARENTHÈSE est à **39 bonnes / 9 distracteurs**

Relevé brut du jour sur les 62 questions (comptage auxiliaire ; les couvertures de référence restent
celles de `mesure-biais-qcm`) :

| marque | bonnes / distracteurs | SEULE à la porter | la bonne l'emporte |
|---|---|---:|---:|
| **parenthèse** | **39 / 9** | **34 questions** | **100,0 %** |
| **deux-points** | **20 / 5** | **18 questions** | **94,4 %** |
| **point-virgule** | **16 / 0** | **16 questions** | **100,0 %** |
| **virgule** | **33 / 23** | **29 questions** | **89,7 %** |
| barre oblique | 6 / 2 | 4 questions | **100,0 %** |
| tiret cadratin | 4 / 0 | 4 questions | **100,0 %** |
| guillemets | 3 / 1 | 2 questions | 100,0 % |
| MAJUSCULE | 13 / 14 | 20 questions | 50,0 % |

**Règle : par marque, les quatre options la portent, ou aucune — ET vérifie aussi l'UNION**
(`la seule avec une PONCTUATION FORTE` = `:` ou `;` ou tiret, à **60,1 % et rendement 100,0 %**).
Fermer chaque marque séparément et laisser l'union ouverte ne sert à rien : leçon du 35ᵉ cours.

⚠️ La MAJUSCULE est **déjà à 50,0 %** : n'y touche pas, tu la retournerais. Et **n'invente pas de
sigle** pour tenir un compte. `DOM`, `API`, `CSS`, `HTML`, `JS`, `SPA`, `SFC`, `URL` sont des
majuscules **de contenu** : compte-les, mais ne les ajoute pas à un distracteur qui n'en parle pas.

### (5) LE MOT TECHNIQUE EXCLUSIF — 60,1 %, couverture 54,8 %, rendement 85,3 %

Les mots du domaine (`réactivité`, `composant`, `directive`, `template`, `bidirectionnelle`,
`liaison`, `rendu`, `propriété`, `événement`, `navigation`, `validation`, `transition`…) ne doivent
pas être le privilège de la bonne réponse. **Par mot technique : les quatre options le portent, ou
aucune.**

⚠️⚠️ **CET INDICE EST EN TENSION STRUCTURELLE AVEC L'INTRUS LEXICAL (point 8) — leçon du 48ᵉ cours.**
`le mot technique exclusif` désigne l'option qui porte le plus de mots de **9 lettres et plus**
qu'aucune autre n'emploie. La bonne réponse étant intouchable, le fermer en ajoutant un mot de
9+ lettres **exclusif à un distracteur** est exactement ce que l'intrus lexical compte en EXCÈS.
**La seule issue qui ferme les deux est de reprendre un mot de 9+ lettres de la bonne réponse et de
le poser dans les TROIS distracteurs** (4/4 = neutre pour l'intrus, et le mot cesse d'être exclusif).
Coût mesuré : ~45 caractères par question — **compte-les dans ta bande de longueur**.

### (6) L'ÉCHO DE L'ÉNONCÉ — 41,1 %, couverture 30,6 %, rendement 73,7 %

**LES QUATRE OPTIONS PORTENT LE MÊME NOMBRE DE MOTS D'ÉCHO** (mots de 4 lettres et plus repris de
l'énoncé). ⚠️ Un identifiant court passe sous le radar de l'outil : au 46ᵉ cours, `job` (3 lettres)
faisait de la bonne réponse la seule à citer une cmdlet et **aucune stratégie ne le voyait**. En Vue,
`ref`, `key`, `DOM`, `API`, `v-if`, `emit`, `slot`, `prop`, `$emit`, `.vue` sont dans ce cas :
**compte-les à la main**.

⚠️ `l'attaque unique` est à **26,6 % (couverture 19,4 %)** : ne commence pas tous tes distracteurs par
la même formule, et ne reprends pas en tête un mot que nulle autre option n'emploie.

### (7) L'INDICE LEXICAL — ouvert dans les trois lectures

`node tools/mesure-lexique-qcm.js --seul=vue` :

| lecture | couverture | rendement |
|---|---:|---:|
| STRICTE | 37,1 % | **56,5 %** |
| PROPORTION | **53,2 %** | **66,7 %** |
| INVERSE | 53,2 % | 21,2 % |
| RESTREINDRE PROPORTION | **95,2 %** | 52,3 % |

**RÈGLE DU `k` : soit `k` le nombre de mots de 6 lettres et plus absents de la page que porte une
option — les QUATRE options doivent porter le MÊME `k`.** Ni 0/0/k (qui laisse 50 % en RESTREINDRE),
ni « aucun étranger partout » (qui retourne l'indice).

**RÈGLE DU `w`** : soit `w` le nombre de mots de 6 lettres et plus d'une option — **les quatre `w`
doivent être ÉGAUX** quand `k > 0`. `w` et `k` se règlent **séparément**.

⚠️⚠️ **CORRECTION D'OUTIL DU 2026-09-23, faite juste avant cette vague, et elle change la cible.**
`mesure-lexique-qcm --liste` acceptait jusqu'ici qu'**un distracteur porte PLUS de mots longs que la
bonne réponse** (`wSup > 0`) et annonçait la question conforme. C'est une fermeture par
**RETOURNEMENT**, pas une fermeture : PROPORTION désigne alors ce distracteur **seul**, et il suffit
de l'**écarter** pour tirer à 33,3 % parmi les trois autres. L'outil compte désormais ces questions
et les étiquette `[RETOURNE S|P|I]`. **Sur `vue` il y en a 35 sur 62 avant ta passe.** Cible :
**0 exploitable ET 0 retournée**.

⚠️⚠️ **DEUX RÈGLES DU 47ᵉ COURS, DEUX ALLERS-RETOURS CHACUNE** :
1. **Un mot de remplacement doit être PRÉSENT dans la page ET faire moins de 9 lettres.** Un
   substitut absent de la page fait exploser la lecture STRICTE ; un substitut de 9 lettres et plus
   reste compté comme « mot long ». Le contrôle est un `grep` de trois secondes : fais-le **avant**
   d'écrire. ⚠️ `grep -ci` sur une **racine** ment : l'outil compare des **jetons entiers**
   (« composant » ≠ « composants ») — cherche le mot entier, pas sa racine (leçon du 44ᵉ cours).
2. **Pose le substitut dans DEUX distracteurs à la fois**, jamais un seul : un mot porté par
   exactement 1 ou 3 options sur 4 rouvre l'**intrus lexical** (point 8).

### (8) L'INTRUS LEXICAL — DÉFAUT 20,2 %, EXCÈS 27,8 % avec **1 question sûre**

`node tools/mesure-mot-question.js vue`. Un mot porté par exactement 3 options sur 4 désigne la
quatrième à coup sûr ; un mot porté par une seule la désigne aussi. **Par mot, les quatre ou aucune.**

**Lance `node tools/mesure-mot-question.js vue --plan` : il te donne, question par question, la liste
exacte des mots à ajouter ou à retirer, et il marque `[LA BONNE]` quand le porteur est intouchable.**
Cible = **couverture zéro**, pas « taux à 25 % ».

⚠️ L'indice est **bas au départ** : c'est la correction qui le fabrique. Mesure-le **après** avoir
écrit, pas seulement avant.

### (9) LES MOTS FÉTICHES — 2 alertes

`node tools/mesure-mot-fetiche.js vue` :

| mot | bonnes / distracteurs | tranche | RESTREINDRE |
|---|---|---:|---:|
| `données` | **5 / 3** | 8 questions | **29,8 %** |
| `composant` | **9 / 13** | 15 questions | **28,9 %** |
| `donnée` | **6 / 0** | 6 questions | 32,3 % |
| `script` | **5 / 1** | 6 questions | 30,6 % |
| `valeur` | 5 / 3 | 7 questions | 29,4 % |
| `computed` | 5 / 3 | 5 questions | 29,2 % |
| `template` | 4 / 2 | 6 questions | 29,0 % |
| `composants` | 5 / 3 | 6 questions | 29,0 % |

Place ces mots dans des distracteurs de tes questions — tu n'as pas le droit de toucher aux bonnes
réponses, donc **la seule action possible est l'ajout côté distracteur**.
⚠️ `parce` est à l'**inverse** (3 bonnes / 9 distracteurs) : n'ouvre pas tes distracteurs par
« Parce que » si la bonne réponse ne le fait pas. Même remarque pour `toujours` (2/5), `champ` (3/5),
`props` (2/5), `v-for` (2/5), `application` (2/4) : ces mots penchent déjà **du côté du
distracteur**, ne les multiplie pas.

### (10) ⚠️⚠️ NEUF TICS DE LOT, CONNUS **AVANT** D'ÉCRIRE — c'est une première

`node tools/mesure-tics-lot.js vue --exemples`. **Les cinquante cours précédents ont découvert leurs
tics APRÈS la vague ; ici on les connaît avant. La consigne doit les fermer dès le premier lot, au
lieu de les fabriquer.**

| tic | bonnes / distracteurs | tranchées | rendement | gain au cours |
|---|---|---:|---:|---:|
| **point-virgule médian** | **16 / 0** | 16 | **100,0 %** | **44,4 %** |
| **glose finale entre parenthèses** | **16 / 4** | 16 | **87,5 %** | **41,1 %** |
| **deux-points médian** | **15 / 3** | 16 | **87,5 %** | **41,1 %** |
| « une donnée » | 5 / 0 | 5 | **100,0 %** | 31,0 % |
| tiret d'incise | 4 / 0 | 4 | **100,0 %** | 29,8 % |
| « à jour » | 4 / 0 | 4 | **100,0 %** | 29,8 % |
| « le DOM » | 4 / 1 | 5 | 80,0 % | 29,4 % |
| « dans le » | 5 / 4 | 9 | 55,6 % | 29,4 % |
| « à un » | 3 / 1 | 4 | 75,0 % | 28,2 % |

**Règle : aucune tournure, aucun signe, aucun gabarit de phrase ne doit être le privilège des
distracteurs — ni celui des bonnes réponses.** Les trois premiers tics sont les plus rentables du
cours : ils viennent tous du **même gabarit de bonne réponse** (« réponse ; justification » ou
« réponse : justification », avec une glose finale entre parenthèses). Puisque la bonne réponse est
intouchable, **la seule action est de donner ce même gabarit à tes distracteurs** — mais avec un
contenu qui dit quelque chose (règle en tête de consigne), pas une parenthèse de remplissage.

⚠️ **Et cherche tes PROPRES tics après écriture** : au 50ᵉ cours, la vague 1 a fabriqué de toutes
pièces le mot `chaque` (6 bonnes / 44 distracteurs) parce que six agents ont allongé avec le même mot
**sans se concerter**. Relance `mesure-tics-lot` sur le cours entier à la fin de ton lot.

### (11) LA PAIRE AUTO-ÉLIMINATRICE, ET LE MIROIR DE LA BONNE RÉPONSE

Deux distracteurs qui portent la **même thèse** s'éliminent l'un l'autre : l'apprenant sait qu'aucun
des deux ne peut être l'unique bonne réponse, et il lui reste 50 %. Au 50ᵉ cours, **4 questions sur 6**
en offraient une paire.

**Règle : les trois distracteurs d'une question portent TROIS erreurs DIFFÉRENTES.** Écris-les côte à
côte et vérifie qu'on ne peut pas les résumer par la même phrase.

Cas particulier, aussi grave : **le miroir exact de la bonne réponse.** « `v-if` crée et détruit »
(bonne) contre « `v-if` ne détruit jamais rien » — le couple désigne la bonne réponse sans aucune
connaissance du sujet.

### (12) ⚠️ LE DISTRACTEUR NE DOIT PAS DEVENIR UN MODE D'EMPLOI

Un distracteur long qui explique correctement la règle **avant** de se tromper enseigne la bonne
réponse. La fausseté doit être dans la **thèse, dès la première proposition** — pas dans une queue de
phrase, pas dans une nuance. Et la fausseté ne doit pas être un **conseil dangereux** qu'un débutant
pourrait appliquer (ici : « la validation côté client suffit », « on peut modifier une prop »,
« pas besoin de retirer un écouteur »).

### (13) LES RÉSULTATS DES PASSES 39 À 50, À APPLIQUER ICI

1. **Retourner « la plus dense » se fait en RETIRANT de petits mots**, pas en ajoutant des mots
   longs. Ici `la plus dense` est à **23,5 % avec une couverture de 95,2 %** : elle est déjà au niveau
   du hasard, **ne la casse pas** en bourrant tes distracteurs de mots longs.
2. **Trois distracteurs de même longueur livrent `ECARTER la plus courte` à 100 %.** Ici l'indice
   tranche déjà 1 question sur 62 à rendement 100 %. **Écarte tes trois distracteurs les uns des
   autres d'au moins 15 caractères**, dans les bandes que `plan-rangs-qcm` te donne.
3. **Un seul distracteur absolutiste (« toujours », « jamais », « aucun ») fait désigner les trois
   autres**, bonne réponse comprise — il faut **0, 2 ou 3** porteurs par question, jamais 1.
   ⚠️ `ecarter les absolus` est à **27,8 % avec un rendement de 100,0 %** sur ce cours : il y a déjà
   une question où l'absolu ne tombe que sur des distracteurs.
4. **LE DOSAGE SE CALCULE, AVANT D'ÉCRIRE** (leçon du 47ᵉ) : avant de fermer les `n` questions où un
   indice désigne la bonne réponse, calcule où tu emmènes son INVERSE. Fermer les 20 questions d'un
   indice qui en tranche 20 porte son inverse à 33 % ; la cible 25 % demandait 5 retouches, pas 20.
   **La cible n'est jamais « fermer », c'est « ramener à 25 % ».**

---

## Les contraintes de non-régression

1. **La bonne réponse, l'énoncé `q`, le champ `correct` et l'`explain` sont INTOUCHABLES.** Si tu es
   convaincu qu'une bonne réponse est fausse, **tu ne la corriges pas** : tu le remontes dans ton
   compte rendu, avec la citation de la page qui la contredit. C'est l'orchestrateur qui tranche.
   Contrôle de l'orchestrateur : `node tools/mesure-qcm-intouchable.js vue <sha>`.
2. **Aucun distracteur ne doit devenir vrai.** C'est la faute la plus fréquente du chantier : sur
   `bdd`, un seul défaut de schéma a produit trois bonnes réponses fausses.
3. **Deux distracteurs ne doivent pas énoncer la même thèse** (ils s'éliminent l'un l'autre).
4. **Le JSON doit rester valide**, sans BOM, et les antislashes des littéraux (`\n`, `\"`) doivent
   rester échappés correctement. Contrôle : `node -e "JSON.parse(...)"` ou
   `node tools/verif-donnees.js`.
5. **Aucune URL externe** : pas de `cdnjs`, pas de `fonts.googleapis`, pas de `fonts.gstatic`.
6. **N'écris pas ton JSON par heredoc** : l'outil Bash mange un niveau d'antislash même dans un
   heredoc quoté, et un `\b` y devient **U+0008**. Édite le fichier avec l'outil d'édition.
7. **Pas de CRLF, pas de BOM.** L'outil d'édition écrit parfois en CRLF : vérifie à la fin
   (`node -e "const s=require('fs').readFileSync(f); console.log(s.includes(13), s[0]===0xEF)"`).

---

## L'ORDRE DE TRAVAIL

1. Lis **TES** leçons en entier — le corps, pas seulement le QCM. C'est lui qui établit ce que tu as
   le droit d'écrire.
2. Lance `node tools/plan-rangs-qcm.js vue` et note, pour chacune de tes questions, le rang visé et
   la bande de chaque option.
3. Pour chaque question : écris les **trois erreurs** que tu veux enseigner, en une phrase chacune,
   **avant** de rédiger. Trois erreurs différentes, aucune n'étant le miroir de la bonne réponse.
4. Rédige à la longueur imposée. Si tu manques de caractères, **étoffe l'erreur** (son mécanisme
   faux, sa conséquence fausse) — jamais par une parenthèse de remplissage.
5. Relis les quatre options **à voix haute**, dans l'ordre. Si une phrase te fait buter, elle est
   mauvaise.
6. Relance les contrôles sur TON lot et cite les chiffres.

## Le contrôle d'après, à citer dans ton compte rendu

```
node tools/plan-rangs-qcm.js vue
node tools/mesure-mot-question.js vue --plan
node tools/mesure-biais-qcm.js --seul=vue
node tools/mesure-biais-inverse.js --toutes vue
node tools/mesure-lexique-qcm.js --liste=vue
node tools/mesure-mot-fetiche.js vue
node tools/mesure-tics-lot.js vue --exemples
node tools/verif-html.js
```

**Cible : 25 % dans les DEUX sens, sur les 47 stratégies — 0 mot fétiche, 0 question « sûre »,
0 question retournée, et une couverture nulle pour les indices de ponctuation.**

---

## ⚠️ Ce que les passes 39 à 50 ont appris sur la MÉTHODE

- **Mesure sur un état GELÉ, pas sur l'arbre vivant.** Les mesures globales (`--seul=vue`) que tu
  lances pendant que cinq autres agents écrivent **ne valent rien** : mesure sur TON lot, et laisse
  la mesure d'ensemble à l'orchestrateur.
- **Un diagnostic qui n'est pas la COPIE EXACTE de l'outil fait travailler à côté.** Au 43ᵉ cours,
  une apostrophe traitée comme séparateur de mots a fait annoncer « 0 tranchée » là où l'outil en
  mesurait 22. N'écris pas ta propre sonde : **lance les outils**. Si tu en écris une, qu'elle
  **charge** l'outil au lieu de le recopier.
- **Fermer un indice à fond le RETOURNE.** Vise l'égalité des quatre, jamais l'extinction.
- **Fermer un indice peut le FAIRE MONTER** : une question tranchée à 0 vaut +0,25, une égalité à
  deux vaut +0,50. Un chiffre qui monte n'est pas forcément une régression — lis la couverture.
- **Relis le texte rendu, pas seulement le tableau.** Neuf contrôles verts sur une salade de mots est
  un résultat déjà obtenu trois fois.
