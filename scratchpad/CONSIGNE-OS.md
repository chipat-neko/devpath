# Consigne d'écriture — détordre les QCM du cours `os` (point B4 du CHANTIER-V16)

## Le problème, mesuré le 2026-09-06 sur les 68 questions du cours

| stratégie d'un apprenant qui ne comprend RIEN | réussite | rendement |
|---|---:|---:|
| la plus longue | **98,5 %** | 98,5 % |
| la plus détaillée (nb de `,` + `:` + `;`) | **89,1 %** | 95,1 % |
| le mot technique exclusif | **70,6 %** | 82,4 % |
| RESTREINDRE à la parenthèse | **62,1 %** | 100,0 % |
| l'incise entre parenthèses | **61,0 %** | 97,1 % |
| RESTREINDRE aux deux-points | **57,4 %** | 93,8 % |
| la seule avec un point-virgule | 44,9 % | **100,0 %** |
| l'écho de la question | 41,7 % | 62,5 % |
| la seule qui nie | 34,2 % | 44,4 % |
| la plus prudente | 33,5 % | 88,9 % |
| la seule avec un tiret | 30,5 % | **100,0 %** |
| hasard | 25,0 % | — |

Rangs de longueur aujourd'hui : **67 / 0 / 0 / 1** (0 = la bonne réponse est la plus longue).
Cible : **17 / 17 / 17 / 17**. 67 questions sur 68 sont à retoucher, 14 462 caractères à écrire.

## RÈGLES ABSOLUES — une infraction fait rejeter tout le lot

1. **INTOUCHABLE : `q`, `correct`, `explain` et le TEXTE DE LA BONNE RÉPONSE.** Un contrôle
   automatique (`tools/mesure-qcm-intouchable.js`) compare octet à octet avec `git show HEAD:`.
   Tu ne réécris QUE les distracteurs (les options dont l'indice ≠ `correct`).
2. **Un distracteur doit rester FAUX.** C'est la faute la plus grave et la plus fréquente :
   en allongeant, on ajoute une précision vraie et le distracteur devient une seconde bonne
   réponse. Chaque distracteur allongé doit rester réfutable par le corps de la leçon.
   Le bon matériau est une confusion réelle des systèmes d'exploitation : processus/thread,
   mode noyau/mode utilisateur, mémoire virtuelle/physique, pagination/segmentation,
   ordonnancement préemptif/coopératif, appel système/appel de fonction, interruption/scrutation,
   verrou/sémaphore, interblocage/famine, tampon/cache, lien dur/lien symbolique,
   fork/exec, signal/socket, swap/RAM, inode/nom de fichier, montage/partition,
   temps CPU/temps écoulé, démon/service, exécution concurrente/parallèle.
3. **Le JSON doit rester valide** : guillemets doubles échappés `\"`, antislash `\`, pas de
   saut de ligne littéral dans une chaîne. Vérifie avec `node -e` après écriture.
4. **Français correct, accents corrects** (jamais `a` pour `à`). Encodage **UTF-8 sans BOM**,
   fins de ligne **LF**. N'utilise PAS d'espace insécable U+00A0, ni `&nbsp;` dans un bloc
   `data-quiz` (il y serait lu littéralement).
5. **Aucun `git commit`, aucun `git add`.** Tu écris seulement dans les fichiers de ton lot.

## LES SEPT INDICES À FERMER, dans la même passe

Pour CHAQUE question, après réécriture :

- **(1) RANG DE LONGUEUR.** `node tools/plan-rangs-qcm.js os` donne, question par question,
  le `rang cible` et une **fenêtre de longueur [min..max] par option**. Respecte-la : c'est elle
  qui produit la répartition plate 17/17/17/17. Le rang se compte en caractères de la chaîne.
- **(2) FOURCHETTE 70–130 %.** Chaque distracteur doit mesurer entre 70 % et 130 % de la
  longueur de la bonne réponse. (Exemption S3 : options de moins de 20 caractères d'un QCM
  bilan à réponse d'un mot.) Les fenêtres du plan intègrent déjà cette contrainte.
- **(3) LES MARQUES : `;`, `(...)`, `:` — RÈGLE « LES QUATRE OU AUCUNE ».**
  ⚠️ **C'est la leçon la plus chère des 25 cours déjà traités, appliquée ici DÈS LE PREMIER LOT.**
  La règle molle « au moins un distracteur porte la même marque » ferme l'unicité mais laisse
  **50 %** à l'apprenant : il lui suffit de restreindre son tirage aux options marquées.
  Donc, **pour chacune des trois marques** — point-virgule `;`, incise entre parenthèses `(...)`,
  deux-points `:` — **ou les QUATRE options la portent, ou AUCUNE ne la porte.**
  Comme le texte de la bonne réponse est intouchable, cela se lit ainsi :
  si la bonne réponse porte la marque, **les trois distracteurs doivent la porter** ;
  si elle ne la porte pas, **aucun distracteur ne doit la porter**.
  Pour l'incise, compte le **NOMBRE** de `(...)` : les quatre options doivent en porter autant.
  Plans : `node tools/plan-rangs-qcm.js os --incise` (33 questions en tête sans égalité).
- **(4) DENSITÉ DE PONCTUATION (« la plus détaillée »).** La bonne réponse ne doit pas être la
  seule à porter le plus de `,` + `:` + `;`. Au moins un distracteur doit l'égaler.
  `node tools/plan-rangs-qcm.js os --ponctuation` (58 questions concernées, 85,3 %).
- **(5) MOT TECHNIQUE EXCLUSIF (70,6 % ici — le troisième indice du cours).** Les termes de
  métier (`noyau`, `ordonnanceur`, `MMU`, `page`, `inode`, `appel système`, `préemptif`,
  `sémaphore`, `interruption`, `swap`, `descripteur`, `PID`…) ne doivent pas apparaître
  seulement dans la bonne réponse : au moins un distracteur — de préférence deux — doit employer
  du vocabulaire technique du même registre, en disant quelque chose de FAUX.
- **(6) ÉCHO DE LA QUESTION.** La bonne réponse ne doit pas être la seule à reprendre les mots
  de l'énoncé : fais reprendre les mêmes termes par **UN seul** distracteur.
  ⚠️ **Ne le fais pas faire par les trois** : sur `data-eng`, l'écho s'est RETOURNÉ (40,8 % →
  11,3 %) et l'apprenant qui écarte l'option la plus écho a alors obtenu 30,4 %.
- **(7) LA NÉGATION.** N'écris pas la négation uniquement dans la bonne réponse, et ne fais pas
  des distracteurs des affirmations toutes positives quand la bonne réponse nie.

Quatre indices mineurs à ne pas RECRÉER en écrivant : pas de tiret « — » exclusif à la bonne
réponse, pas de MAJUSCULE d'emphase exclusive, n'accumule pas les absolus (« toujours »,
« jamais », « aucun ») dans les seuls distracteurs, et **ne réserve pas la nuance à la bonne
réponse** (« souvent », « en général », « dans la plupart des cas »). Ne termine pas non plus
tout un lot par le même signe final (le point final a valu 100 % sur un lot du cours `react`).

## Méthode

1. Lis tes leçons (corps + QCM) : un distracteur ne peut être écrit sans le contenu enseigné.
2. Récupère ton plan : `node tools/plan-rangs-qcm.js os --json` puis filtre sur tes fichiers.
3. Réécris les distracteurs question par question. **SIMULE AVANT D'ÉCRIRE** : compte les
   caractères de ta proposition (`[...].length` en JS, accents comptés 1) et vérifie qu'elle
   tombe dans la fenêtre. La moitié des textes proposés sans simulation cassent la forme.
4. Après écriture, relance `node tools/plan-rangs-qcm.js os` et vérifie que **tes** questions
   sont au rang cible, puis `node tools/mesure-qcm-longueurs.js os` pour la fourchette.
5. Rends un compte rendu : questions traitées, distracteurs réécrits, rangs obtenus, et la
   liste de ce que tu n'as pas pu tenir avec la raison.

⚠️ Ce cours est **conceptuel** : Linux n'est pas installé ici et aucune commande système ne peut
être exécutée. N'affirme rien « de tête » sur une sortie de commande : si tu ne peux pas prouver
un comportement par le corps de la leçon, n'écris pas de distracteur qui en dépend.
⚠️ **Écris en LF.** L'outil d'édition a déjà renvoyé des fichiers en CRLF sur trois cours ;
si tu peux, écris via un script Node plutôt que par un remplacement de chaîne.
