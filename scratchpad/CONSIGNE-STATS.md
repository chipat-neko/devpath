# Consigne d'écriture — détordre les QCM du cours `stats` (point B4 du CHANTIER-V16)

`stats` est le **28ᵉ cours** de la campagne, et le **plus tordu du site** : c'est lui qui servait
de cours-témoin à l'épreuve par injection du cliquet (témoin rendu dynamique avant cette passe).

## Le problème, mesuré le 2026-09-06 sur les 72 questions du cours

| stratégie d'un apprenant qui ne comprend RIEN | réussite | rendement |
|---|---:|---:|
| **la plus longue** | **99,3 %** | **100,0 %** |
| la plus détaillée (nb de `,` + `:` + `;`) | **77,0 %** | 94,0 % |
| RESTREINDRE aux deux-points | 55,8 % | 90,6 % |
| RESTREINDRE à la parenthèse | 54,2 % | **100,0 %** |
| l'incise entre parenthèses | 53,1 % | **100,0 %** |
| le mot technique exclusif | 50,6 % | 60,9 % |
| RESTREINDRE au point-virgule | 43,1 % | **100,0 %** |
| la seule avec un point-virgule | 42,7 % | **100,0 %** |
| la seule qui nie | 41,9 % | 60,9 % |
| la MAJUSCULE d'emphase | 36,8 % | 85,7 % |
| l'attaque unique | 29,2 % | 37,5 % |
| la seule avec un tiret | 28,1 % | **100,0 %** |
| hasard | 25,0 % | — |

Indice **lexical** (chercher au clavier, dans la page, les mots de chaque option) : **25 questions
exploitables sur 72, et 62 à mettre en forme**.

Rangs de longueur aujourd'hui : **72 / 0 / 0 / 0** (0 = la bonne réponse est la plus longue).
Cible : **18 / 18 / 18 / 18**. **72 questions sur 72** à retoucher, **11 259 caractères** à écrire.

## RÈGLES ABSOLUES — une infraction fait rejeter tout le lot

1. **INTOUCHABLE : `q`, `correct`, `explain` et le TEXTE DE LA BONNE RÉPONSE.** Un contrôle
   automatique (`tools/mesure-qcm-intouchable.js stats`) compare octet à octet avec `git show HEAD:`.
   Tu ne réécris QUE les distracteurs (les options dont l'indice ≠ `correct`).
2. **Un distracteur doit rester FAUX.** C'est la faute la plus grave et la plus fréquente : en
   allongeant, on ajoute une précision vraie et le distracteur devient une seconde bonne réponse.
   Chaque distracteur allongé doit rester réfutable **par le corps de la leçon**.
   Le bon matériau, en statistiques, ce sont les confusions réelles : moyenne/médiane/mode,
   population/échantillon, descriptive/inférentielle, écart-type/variance, corrélation/causalité,
   variance de population (÷n) / d'échantillon (÷n−1), valeur p / probabilité que H0 soit vraie,
   intervalle de confiance / intervalle de prédiction, erreur de type I / type II,
   puissance/niveau, biais d'échantillonnage / erreur aléatoire, loi normale / loi de Student,
   quartile/percentile, effectif/fréquence, variable qualitative/quantitative, discrète/continue,
   significativité statistique / importance pratique, R² / pente, paradoxe de Simpson,
   régression vers la moyenne / effet réel, test unilatéral/bilatéral, appariement/indépendance.
3. **Le JSON doit rester valide** : guillemets doubles échappés, pas de saut de ligne littéral
   dans une chaîne. Vérifie avec `node -e` après écriture.
4. **Français correct, accents corrects** (jamais `a` pour `à`). Encodage **UTF-8 sans BOM**.
   N'utilise **PAS** d'espace insécable U+00A0 ni l'entité `&nbsp;` dans un bloc `data-quiz` : elle
   y serait lue littéralement (piège rencontré sur `doc` et sur `java`).
   ⚠️ `core.autocrlf=true` : l'arbre de travail est en **CRLF**. Écris par **substitution de chaîne
   exacte** dans le source brut, jamais en régénérant le fichier entier.
5. **Aucun `git commit`, `git add` ni `git checkout`.** Tu écris seulement dans les fichiers de ton
   lot, et personne d'autre n'y touche en même temps.

## LA RÈGLE QUI PRIME SUR TOUTES LES CONTRAINTES DE FORME

> **Un distracteur doit être du français naturel, lisible et plausible pour qui n'a pas lu la
> leçon — et FAUX pour qui l'a lue.**

C'est la leçon la plus chère du cours `mobile` : à force de forcer la forme, une quinzaine de
distracteurs ne voulaient plus rien dire, et **la bonne réponse devenait la seule option
grammaticalement intelligible** — un indice plus fort que tous ceux qu'on venait de fermer.
Si une contrainte de forme t'oblige à écrire une phrase bancale, **c'est la contrainte qui cède**,
et tu rattrapes ailleurs dans la même option.

Corollaire : **un distracteur ne se dénonce jamais lui-même.** Pas de clause finale qui condamne
l'option (« ce qui n'a aucun sens », « le résultat est alors inutilisable », « on perd toute
rigueur »). Un distracteur affirme sa thèse **positivement** ; sa fausseté est dans le mécanisme
décrit, pas dans un aveu final. Sur `mobile`, 17 distracteurs sur 60 faisaient cette faute et une
question était **offerte à 100 %**.

## LES HUIT INDICES À FERMER, DANS LA MÊME PASSE

- **(1) RANG DE LONGUEUR.** `node tools/plan-rangs-qcm.js stats` donne, question par question, le
  `rang cible` et une **fenêtre [min..max] par option**. Respecte-la : c'est elle qui produit la
  répartition plate 18/18/18/18. Le rang se compte en caractères de la chaîne.
- **(2) FOURCHETTE 70–130 %.** Chaque distracteur mesure entre 70 % et 130 % de la longueur de la
  bonne réponse. (Exemption : options de moins de 20 caractères d'un QCM bilan à réponse d'un mot.)
  Les fenêtres du plan intègrent déjà cette contrainte.
- **(3) LES MARQUES `;`, `(...)`, `:` — RÈGLE « LES QUATRE OU AUCUNE ».**
  La règle molle « au moins un distracteur porte la même marque » ferme l'unicité mais laisse
  **50 %** : il suffit de restreindre son tirage aux options marquées (mesuré sur `data-eng`).
  Donc **pour chacune des trois marques** : ou les **QUATRE** options la portent, ou **AUCUNE**.
  La bonne réponse étant intouchable : si elle porte la marque, les trois distracteurs doivent la
  porter ; sinon, aucun ne doit la porter. Pour l'incise, c'est le **NOMBRE** de parenthèses qui
  doit être égal. Plan : `node tools/plan-rangs-qcm.js stats --incise` (29 questions en tête).
- **(4) DENSITÉ DE PONCTUATION (« la plus détaillée », 77,0 % ici — le 2ᵉ indice du cours).**
  La bonne réponse ne doit pas être la seule à porter le plus de virgules, deux-points et
  points-virgules. Au moins un distracteur doit l'égaler.
  `node tools/plan-rangs-qcm.js stats --ponctuation` (47 questions, 65,3 %).
- **(5) INDICE LEXICAL — LA RÈGLE DU `k`.** L'apprenant cherche au clavier, DANS LA PAGE, les mots
  de chaque option ; celle dont tous les mots sont présents est la bonne. `k` = nombre de mots
  « étrangers » (absents de la page) de la bonne réponse, qui est donnée.
  **`k = 0` → les trois distracteurs à zéro mot étranger. `k > 0` → DEUX distracteurs à zéro et UN
  à exactement `k`.** Alors aucune des trois variantes (STRICTE, PROPORTION, INVERSE) ne tranche.
  ⚠️ **Ne mets PAS tout le monde à zéro** : sur `mobile`, « zéro mot étranger partout » a mis les
  deux premières variantes à 0 % et laissé le cours devinable **à 100 %** par la règle INVERSE
  (« choisis l'option qui contient un mot ABSENT de la page »). Fermer un indice à fond le RETOURNE.
  Outil : `node tools/mesure-lexique-qcm.js --liste=stats` — il calcule `k`, affiche le `0 / 0 / k`
  visé contre l'état du jour, et compte les questions exploitables et à mettre en forme.
- **(6) MOT TECHNIQUE EXCLUSIF (50,6 % ici).** Les termes de métier (`écart-type`, `variance`,
  `médiane`, `quartile`, `corrélation`, `valeur p`, `intervalle de confiance`, `échantillon`,
  `biais`, `loi normale`, `régression`, `R²`, `hypothèse nulle`, `significatif`…) ne doivent pas
  n'apparaître que dans la bonne réponse : au moins un distracteur — de préférence deux — emploie
  du vocabulaire du même registre, en disant quelque chose de **faux**. ⚠️ Cet indice **monte**
  quand on écrit du français naturel avec le vocabulaire du cours (mesuré sur `mobile` : 25,0 % →
  42,5 %). Surveille-le.
- **(7) ÉCHO DE L'ÉNONCÉ.** La bonne réponse ne doit pas être la seule à reprendre les mots de la
  question : fais-les reprendre par **UN seul** distracteur. ⚠️ Pas par les trois : sur `data-eng`
  l'écho s'est RETOURNÉ (40,8 % → 11,3 %) et « écarter l'option la plus écho » a rendu 30,4 %.
- **(8) LA NÉGATION (41,9 % ici).** N'écris pas la négation uniquement dans la bonne réponse, et ne
  fais pas des distracteurs des affirmations toutes positives quand la bonne réponse nie.

**Quatre indices mineurs à ne pas RECRÉER** : pas de tiret cadratin exclusif à la bonne réponse
(rendement 100 % ici), pas de MAJUSCULE d'emphase exclusive (85,7 % ici), n'accumule pas les
absolus (« toujours », « jamais », « aucun ») dans les seuls distracteurs, et ne réserve pas la
nuance à la bonne réponse (« souvent », « en général », « dans la plupart des cas »).
Ne termine pas non plus tout ton lot par le même signe final, et **ne fais pas commencer tous tes
distracteurs par le même mot** (l'« attaque unique » et le « connecteur causal » sont deux indices
que nos propres vagues d'écriture ont déjà fabriqués sur `ruby` et `nodejs`).

## Méthode

1. **Lis tes leçons en entier** (corps + QCM) : un distracteur ne peut pas être écrit sans le
   contenu enseigné, et l'indice lexical se calcule sur le texte de la page.
2. Récupère ton plan : `node tools/plan-rangs-qcm.js stats --json` puis filtre sur tes fichiers ;
   idem `--incise`, `--ponctuation`, et `node tools/mesure-lexique-qcm.js --liste=stats`.
3. Réécris les distracteurs question par question. **SIMULE AVANT D'ÉCRIRE** : compte les
   caractères (`[...].length` en JS, un accent compte 1), les marques, la ponctuation et les mots
   de 6 lettres et plus absents de la page. Un script Node jetable qui vérifie les quatre coûte
   moins cher qu'une reprise. **La moitié des textes proposés sans simulation cassent la forme.**
4. Après écriture, relance `plan-rangs-qcm stats` (tes questions au rang cible), `--incise`,
   `--ponctuation`, `mesure-lexique-qcm --liste=stats` et `node tools/verif-html.js`.
5. Rends un compte rendu : questions traitées, distracteurs réécrits, rangs obtenus, **et la liste
   de ce que tu n'as pas pu tenir avec la raison**. ⚠️ Sur `mobile`, c'est cette dernière section
   qui a révélé le retournement de l'indice lexical : elle rapporte plus que la consigne elle-même.

⚠️ **Ce cours est conceptuel et CHIFFRÉ.** Beaucoup de questions citent des nombres (moyennes,
médianes, valeurs p, effectifs). **NE JAMAIS ÉCRIRE UN CALCUL DE TÊTE : LE FAIRE TOURNER**
(`node -e`). C'est la règle qui fonde toute cette chaîne de chantiers. Si un distracteur doit
citer un nombre faux, vérifie d'abord par calcul que le nombre juste est bien celui de la leçon.

⚠️ **Si le corps d'une leçon de ton lot est faux** (une valeur annoncée que le calcul ne donne
pas, un contresens), **signale-le dans ton compte rendu** — mais ne le corrige que si tu peux
prouver la faute par le calcul. Modifier le corps change le vocabulaire de la page, donc relance
`--liste=stats` après.
