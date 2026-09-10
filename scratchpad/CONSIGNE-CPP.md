# Consigne d'écriture — détordre les QCM du cours `cpp` (point B4 du CHANTIER-V16)

## Le problème, mesuré le 2026-09-06 sur les 77 questions du cours

| stratégie d'un apprenant qui ne comprend RIEN | réussite | rendement |
|---|---:|---:|
| la plus longue | **92,9 %** | 93,4 % |
| la plus détaillée (nb de virgules/deux-points/points-virgules) | **81,5 %** | 95,0 % |
| le mot technique exclusif | **73,1 %** | 92,2 % |
| l'incise entre parenthèses | **72,4 %** | 98,0 % |
| l'écho de la question | **69,4 %** | 89,8 % |
| la seule avec un point-virgule | 50,3 % | **100,0 %** |
| hasard | 25,0 % | — |

Rangs de longueur aujourd'hui : **72 / 4 / 0 / 1** (0 = la bonne réponse est la plus longue).
Cible : **20 / 19 / 19 / 19**.

## RÈGLES ABSOLUES — une infraction fait rejeter tout le lot

1. **INTOUCHABLE : `q`, `correct`, `explain` et le TEXTE DE LA BONNE RÉPONSE.** Un contrôle
   automatique (`tools/mesure-qcm-intouchable.js`) compare octet à octet avec `git show HEAD:`.
   Tu ne réécris QUE les distracteurs (les options dont l'indice ≠ `correct`).
2. **Un distracteur doit rester FAUX.** C'est la faute la plus grave et la plus fréquente :
   en allongeant, on ajoute une précision vraie et le distracteur devient une seconde bonne
   réponse. Chaque distracteur allongé doit rester réfutable par le corps de la leçon.
   Une erreur *plausible d'un débutant* est le bon matériau : une confusion réelle du C++
   (valeur/référence, `struct`/`class`, pile/tas, `delete`/`delete[]`, copie/déplacement…).
3. **Le JSON doit rester valide** : guillemets doubles échappés `\"`, antislash `\`, pas de
   saut de ligne littéral dans une chaîne. Vérifie avec `node -e` après écriture.
4. **Français correct, accents corrects** (jamais `a` pour `à`). Encodage **UTF-8 sans BOM**,
   fins de ligne **LF**. N'utilise PAS d'espace insécable U+00A0, ni `&nbsp;` dans un bloc
   `data-quiz` (il y serait lu littéralement).
5. **Aucun `git commit`, aucun `git add`.** Tu écris seulement dans les fichiers de ton lot.

## LES SEPT INDICES À FERMER, dans la même passe

Pour CHAQUE question, après réécriture :

- **(1) RANG DE LONGUEUR.** `node tools/plan-rangs-qcm.js cpp` donne, question par question, le
  `rang cible` et une **fenêtre de longueur [min..max] par option**. Respecte-la : c'est elle
  qui produit la répartition plate 20/19/19/19. Le rang se compte en caractères de la chaîne.
- **(2) FOURCHETTE 70–130 %.** Chaque distracteur doit mesurer entre 70 % et 130 % de la
  longueur de la bonne réponse. (Exemption S3 : options de moins de 20 caractères d'un QCM
  bilan à réponse d'un mot.) Les fenêtres du plan intègrent déjà cette contrainte.
- **(3) POINT-VIRGULE.** Si la bonne réponse contient un `;`, **au moins un distracteur doit en
  contenir un aussi**. Rendement mesuré : **100 %** sur ce cours. C'est le correctif le moins
  cher du lot (une ponctuation d'explication, ou du code `int x = 0;`).
- **(4) INCISE ENTRE PARENTHÈSES.** Compte le **NOMBRE** de `(...)`, pas leur présence :
  **au moins un distracteur doit porter AUTANT d'incises que la bonne réponse.** La consigne
  « pas la seule à en porter » a été mesurée insuffisante sur le cours `java`
  (65,7 % de rendement restant). `node tools/plan-rangs-qcm.js cpp --incise` donne le plan.
- **(5) DENSITÉ DE PONCTUATION (« la plus détaillée »).** La bonne réponse ne doit pas être la
  seule à porter le plus de `,` + `:` + `;`. Au moins un distracteur doit l'égaler.
  `node tools/plan-rangs-qcm.js cpp --ponctuation`.
- **(6) MOT TECHNIQUE EXCLUSIF.** Les identifiants et termes de code (`std::vector`, `move`,
  `constexpr`, `RAII`…) ne doivent pas apparaître seulement dans la bonne réponse : un
  distracteur au moins doit employer du vocabulaire technique du même registre.
- **(7) ÉCHO DE LA QUESTION.** La bonne réponse ne doit pas être la seule à reprendre les mots
  de l'énoncé. Fais reprendre les mêmes termes par au moins un distracteur.

Trois indices mineurs à ne pas RECRÉER en écrivant : pas de tiret « — » exclusif à la bonne
réponse, pas de MAJUSCULE d'emphase exclusive, et n'accumule pas les absolus (« toujours »,
« jamais », « aucun ») dans les seuls distracteurs — c'est ce qui les rend éliminables à vue.

## Méthode

1. Lis tes leçons (corps + QCM) : un distracteur ne peut être écrit sans le contenu enseigné.
2. Récupère ton plan : `node tools/plan-rangs-qcm.js cpp --json` puis filtre sur tes fichiers.
3. Réécris les distracteurs question par question. **SIMULE AVANT D'ÉCRIRE** : compte les
   caractères de ta proposition (`[...].length` en JS, attention aux accents comptés 1) et
   vérifie qu'elle tombe dans la fenêtre. La moitié des textes proposés sans simulation
   cassent la forme.
4. Après écriture, relance `node tools/plan-rangs-qcm.js cpp` et vérifie que **tes** questions
   sont au rang cible, puis `node tools/mesure-qcm-longueurs.js cpp` pour la fourchette.
5. Rends un compte rendu : questions traitées, distracteurs réécrits, rangs obtenus, et la
   liste de ce que tu n'as pas pu tenir avec la raison.

⚠️ **Aucun compilateur C++ n'est installé sur cette machine** (`g++`, `gcc`, `cl` absents).
Rien ne doit être affirmé « de tête » sur une sortie de programme : si tu ne peux pas prouver
un comportement, n'écris pas de distracteur qui en dépend.
