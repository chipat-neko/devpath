# Consigne d'écriture — refermer les QCM du cours `mobile` (point B4 du CHANTIER-V16)

`mobile` a déjà été détordu en B3 : **la longueur est fermée** (« la plus longue » = 21,9 % de
réussite, rendement 21,1 %). Cette passe-ci vise **l'INDICE LEXICAL**, découvert le 2026-09-06 sur
le cours `os`, et quatre indices de forme restés ouverts parce que la consigne de B3 ne les
connaissait pas encore.

## Le problème, mesuré le 2026-09-06 sur les 73 questions du cours

| stratégie d'un apprenant qui ne comprend RIEN | réussite | rendement |
|---|---:|---:|
| **INDICE LEXICAL, variante STRICTE** (couvre 46,6 % des questions) | — | **100,0 %** |
| **INDICE LEXICAL, variante PROPORTION** (couvre 94,5 %) | — | **88,4 %** |
| la plus détaillée (nb de `,` + `:` + `;`) | 51,9 % | 69,7 % |
| la seule qui nie | 41,0 % | 55,2 % |
| l'incise entre parenthèses | 37,7 % | 54,5 % |
| la seule avec un tiret | 36,0 % | **100,0 %** |
| la MAJUSCULE d'emphase | 33,9 % | **90,0 %** |
| RESTREINDRE au point-virgule | 32,9 % | 66,7 % |
| la plus prudente | 30,5 % | 50,0 % |
| la plus longue | 21,9 % | 21,1 % (**déjà fermée, ne la rouvre pas**) |
| hasard | 25,0 % | — |

## L'INDICE LEXICAL — ce que c'est, et la règle qui le ferme

Un apprenant qui ne comprend rien ouvre la leçon et cherche **au clavier (Ctrl+F)** les mots de
chaque option **dans la page**. La bonne réponse est écrite avec les mots enseignés ; un distracteur
inventé emploie des mots que la page ne contient pas. Il choisit l'option dont tout le vocabulaire
figure dans le cours, et il a **100 % juste sur `mobile`**.

**C'est la vague d'écriture de B3 qui l'a fabriqué** : en allongeant les distracteurs avec du
vocabulaire inventé, on ferme la longueur en ouvrant le Ctrl+F.

### La définition EXACTE, telle que l'outil la mesure

- Un **mot** = une suite de **6 lettres ou plus** (accents compris), en minuscules.
  `écran` (5) ne compte pas ; `écrans` (6) compte. Les apostrophes et traits d'union font partie du
  mot : `d'exploiter` est mesuré tel quel, apostrophe comprise, donc il faut que la chaîne
  `d'exploiter` figure dans la page — pas seulement `exploiter`. ⚠️ **Vérifie la forme fléchie
  exacte** : si la page dit `capteur`, le mot `capteurs` est ÉTRANGER.
- La **page** = tout le HTML de la leçon **sauf les blocs `data-quiz` et `data-quiz-bilan`**.
  Le corps de la leçon, les titres, les blocs de code, les exercices : tout compte.
- Un mot est **étranger** s'il n'apparaît pas dans la page.

### LA RÈGLE, une seule et sans exception

> **ZÉRO mot étranger dans CHACUN des trois distracteurs de chaque question.**

Pas « au moins un distracteur propre » : ce serait la faute de `data-eng` (la marque portée par un
seul distracteur laisse 50 % à qui restreint son tirage). Il faut **les trois**.

Quand les trois distracteurs sont à zéro mot étranger, les deux variantes de l'indice cessent de
trancher, que la bonne réponse soit elle-même à zéro ou non. C'est mécanique, c'est vérifiable, et
c'est le critère de réception de ton lot.

### L'outil qui te donne le travail, mot par mot

    node tools/mesure-lexique-qcm.js --liste=mobile

Il imprime, question par question et option par option, **la liste des mots étrangers**. Ton lot est
fini quand **aucune de tes questions n'apparaît plus** dans cette sortie avec un distracteur non
vide. Relance-le après chaque leçon.

### Comment on remplace un mot étranger

1. **Cherche le synonyme que la leçon emploie déjà.** C'est le cas le plus fréquent et le meilleur :
   la leçon dit `magasin` là où tu as écrit `boutique` ; elle dit `appareil` là où tu as écrit
   `terminal`. Le distracteur reste faux, il est simplement dit avec les mots du cours.
2. **Change la tournure** pour tomber sur une forme fléchie présente : si `installées` est étranger
   mais `installer` présent, écris « que l'on vient d'installer ».
3. **Coupe le mot** s'il n'apporte rien : un adverbe étranger (`entièrement`, `réellement`,
   `volontairement`) se supprime sans perte — mais surveille alors la fenêtre de longueur.
4. **Descends sous 6 lettres** : `taille` (6) est mesuré, `poids` (5) ne l'est pas. C'est un recours
   légitime, pas une triche : l'indice ne porte que sur les mots de contenu.
5. ⚠️ **N'introduis JAMAIS un mot dans le corps de la leçon pour faire passer un distracteur.**
   On ne modifie que les distracteurs. Le corps de la leçon est hors de ce lot.

## RÈGLES ABSOLUES — une infraction fait rejeter tout le lot

1. **INTOUCHABLE : `q`, `correct`, `explain` et le TEXTE DE LA BONNE RÉPONSE.** Un contrôle
   automatique (`node tools/mesure-qcm-intouchable.js mobile`) compare octet à octet avec
   `git show HEAD:`. Tu ne réécris QUE les distracteurs (les options d'indice ≠ `correct`).
2. **Un distracteur doit rester FAUX.** C'est la faute la plus grave et la plus fréquente : en
   réécrivant avec les mots du cours, on récite le cours et le distracteur devient une seconde bonne
   réponse. Chaque distracteur doit rester réfutable par le corps de la leçon. Le bon matériau est
   une confusion réelle du développement mobile : natif/multiplateforme, simulateur/appareil réel,
   pixel physique/point logique, cycle de vie actif/suspendu, permission à l'installation/à
   l'exécution, magasin/site web, notification locale/à distance, stockage local/réseau, cache/base,
   thread principal/tâche de fond, version du système/version de l'app, signature/certificat,
   `debug`/`release`, taille du binaire/taille des données, accessibilité/apparence.
3. **Le JSON doit rester valide** : guillemets doubles échappés, pas de saut de ligne littéral
   dans une chaîne. Vérifie après écriture (`JSON.parse` sur chaque bloc).
4. **Français correct, accents corrects** (jamais `a` pour `à`). **UTF-8 sans BOM**, fins de ligne
   **LF**. Pas d'espace insécable U+00A0 ni d'entité `&nbsp;` dans un bloc `data-quiz` : elle y
   serait lue littéralement.
5. **Aucun `git commit`, aucun `git add`.** Tu n'écris que dans les fichiers de ton lot.

## LES CINQ AUTRES INDICES À FERMER DANS LA MÊME PASSE

- **(A) NE ROUVRE PAS LA LONGUEUR.** `node tools/plan-rangs-qcm.js mobile` donne, question par
  question, le `rang cible` et une **fenêtre [min..max] par option**. Aujourd'hui 12 questions sur 73
  sont hors cible (230 caractères à écrire) ; les 61 autres sont bonnes : **reste dans la fenêtre**.
  Simule la longueur (`[...].length` en JS, accents comptés 1) AVANT d'écrire.
- **(B) LES MARQUES `;`, `(...)`, `:` — RÈGLE « LES QUATRE OU AUCUNE ».** Pour chacune des trois
  marques : si la bonne réponse la porte, **les trois distracteurs doivent la porter** ; si elle ne
  la porte pas, **aucun distracteur ne doit la porter**. Pour l'incise, c'est le **NOMBRE** de
  `(...)` qui doit être égal. Plan : `node tools/plan-rangs-qcm.js mobile --incise` (34 questions).
- **(C) DENSITÉ DE PONCTUATION (« la plus détaillée », 69,7 % de rendement).** La bonne réponse ne
  doit pas être la seule à porter le plus de `,` + `:` + `;` ; au moins un distracteur doit
  l'égaler. Plan : `node tools/plan-rangs-qcm.js mobile --ponctuation` (23 questions).
- **(D) LE TIRET « — » (100 % de rendement) et la MAJUSCULE D'EMPHASE (90 %).** Deux indices rares
  mais parfaits. Même règle des quatre ou aucune : si la bonne réponse porte un tiret cadratin ou un
  mot en capitales, les trois distracteurs en portent un ; sinon, aucun.
- **(E) LA NÉGATION (55,2 %) et LA PRUDENCE (50,0 %).** N'écris pas la négation seulement dans la
  bonne réponse ; ne réserve pas la nuance (`souvent`, `en général`, `dans la plupart des cas`) à la
  bonne réponse, et n'accumule pas les absolus (`toujours`, `jamais`, `aucun`) dans les seuls
  distracteurs. ⚠️ **N'inverse pas** : sur `data-eng`, faire porter l'écho par les trois distracteurs
  a RETOURNÉ l'indice (l'apprenant qui écarte l'option la plus écho a obtenu 30,4 %). Vise
  l'équilibre, pas la symétrie totale.

## Méthode

1. Lis tes leçons **en entier** (corps + QCM) : c'est le vocabulaire du corps qui est ta matière.
2. `node tools/mesure-lexique-qcm.js --liste=mobile` puis filtre sur tes fichiers : c'est ta liste
   de courses, mot par mot.
3. Récupère les fenêtres de longueur : `node tools/plan-rangs-qcm.js mobile`.
4. Réécris question par question. **SIMULE AVANT D'ÉCRIRE** : longueur, marques, mots de 6 lettres
   et plus présents dans la page. Un script Node jetable qui vérifie ces trois points sur ta
   proposition coûte moins cher qu'une reprise.
5. Écris **via un script Node** (`fs.writeFileSync` en `utf8`) plutôt que par remplacement de
   chaîne : l'outil d'édition a déjà renvoyé des fichiers en CRLF sur trois cours.
6. Relance `--liste=mobile` : **tes questions ne doivent plus y apparaître**. Puis
   `node tools/plan-rangs-qcm.js mobile` et `node tools/mesure-qcm-intouchable.js mobile`.
7. Rends un compte rendu : questions traitées, distracteurs réécrits, mots étrangers restants (et
   pourquoi), rangs obtenus, et ce que tu n'as pas pu tenir avec la raison.

⚠️ Ce cours est **conceptuel** : ni Xcode, ni Android Studio, ni Flutter ne sont installés ici.
N'affirme rien « de tête » sur le comportement d'un outil : si tu ne peux pas prouver un fait par le
corps de la leçon, n'écris pas de distracteur qui en dépend.
