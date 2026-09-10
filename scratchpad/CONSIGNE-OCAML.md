# Consigne d'écriture — détordre les QCM du cours `ocaml` (point B4 du CHANTIER-V16)

`ocaml` est le **30ᵉ cours** de la campagne, et le **plus nocif de ceux qui restent** :
75 questions, 225 distracteurs, 91,3 % de réussite pour qui coche la plus longue
(69 devinables — le premier du classement de nocivité derrière `js`, déjà traité).

## Le problème, mesuré le 2026-09-07 sur les 75 questions du cours

| stratégie d'un apprenant qui ne comprend RIEN | réussite | rendement |
|---|---:|---:|
| **la plus longue** | **91,3 %** | **93,2 %** |
| la plus détaillée (nb de `,` + `:` + `;`) | **71,3 %** | 95,7 % |
| l'incise entre parenthèses | **63,7 %** | 95,1 % |
| RESTREINDRE à la parenthèse | 61,3 % | 92,5 % |
| le mot technique exclusif | **57,9 %** | 75,6 % |
| RESTREINDRE aux deux-points | 45,7 % | **100,0 %** |
| la seule avec un point-virgule | 43,7 % | 95,0 % |
| l'écho de la question | 40,3 % | 75,0 % |
| la MAJUSCULE d'emphase | 30,3 % | 75,0 % |
| la seule en deux phrases / guillemets | 28,0 % | **100,0 %** |
| la casse initiale rare | 27,7 % | 50,0 % |
| hasard | 25,0 % | — |

Rangs de longueur aujourd'hui : **69 / 4 / 2 / 0** (0 = la bonne réponse est la plus longue).
Cible : **19 / 19 / 19 / 18**. **71 questions sur 75** à retoucher, **11 268 caractères** à écrire.

Indice **lexical** (chercher au clavier, dans la page, les mots de chaque option) :
**63 questions exploitables sur 75, et 66 à mettre en forme**.
Marques rares (point interne / guillemets / flèche) : **10 questions à mettre en forme**.

## RÈGLES ABSOLUES — une infraction fait rejeter tout le lot

1. **INTOUCHABLE : `q`, `correct`, `explain` et le TEXTE DE LA BONNE RÉPONSE.** Un contrôle
   automatique (`node tools/mesure-qcm-intouchable.js ocaml`) compare octet à octet avec
   `git show HEAD:`. Tu ne réécris QUE les distracteurs (les options dont l'indice ≠ `correct`).
2. **Un distracteur doit rester FAUX.** C'est la faute la plus grave et la plus fréquente : en
   allongeant, on ajoute une précision vraie et le distracteur devient une seconde bonne réponse.
   Chaque distracteur allongé doit rester réfutable **par le corps de la leçon**.
   Le bon matériau, en OCaml, ce sont les confusions réelles : `let` / `let rec` / `let ... in`,
   immuabilité et `ref` / `:=` / `!`, `=` (égalité structurelle) / `==` (physique),
   `+` / `+.` et l'absence de surcharge, `list` (chaînée, immuable) / `array` (mutable, indexée),
   `::` / `@`, `option` (`Some` / `None`) contre `null`, filtrage exhaustif et cas manquant,
   type somme / type produit / enregistrement, `match` / `if`, fonction partielle et
   application partielle (curryfication), `|>` et `@@`, `Map` / `Hashtbl` (immuable contre mutable),
   `Seq` paresseuse / `list` stricte, module / signature / foncteur, `open` / chemin qualifié,
   `exception` / `Result`, `failwith` / `raise` / `assert`, variance et polymorphisme paramétrique,
   sous-typage **structurel** des objets contre héritage nominal, `unit` comme valeur de retour,
   récursion terminale et pile, `List.map` / `List.iter` / `List.fold_left` (et leurs retours),
   inférence de type contre annotation obligatoire, `dune` / `ocamlfind`, `.ml` / `.mli`.
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
sécurité »). Un distracteur affirme sa thèse **positivement** ; sa fausseté est dans le mécanisme
décrit, pas dans un aveu final. Sur `mobile`, 17 distracteurs sur 60 faisaient cette faute et une
question était **offerte à 100 %**.

## LES NEUF INDICES À FERMER, DANS LA MÊME PASSE

- **(1) RANG DE LONGUEUR.** `node tools/plan-rangs-qcm.js ocaml` donne, question par question, le
  `rang cible` et une **fenêtre [min..max] par option**. Respecte-la : c'est elle qui produit la
  répartition plate 19/19/19/18. Le rang se compte en caractères de la chaîne (un accent = 1).
- **(2) FOURCHETTE 70–130 %.** Chaque distracteur mesure entre 70 % et 130 % de la longueur de la
  bonne réponse. (Exemption : options de moins de 20 caractères d'un QCM bilan à réponse d'un mot
  ou d'un opérateur.) Les fenêtres du plan intègrent déjà cette contrainte.
- **(3) LES MARQUES `;`, `(...)`, `:` — RÈGLE « LES QUATRE OU AUCUNE ».**
  La règle molle « au moins un distracteur porte la même marque » ferme l'unicité mais laisse
  **50 %** : il suffit de restreindre son tirage aux options marquées (mesuré sur `data-eng`).
  Donc **pour chacune des trois marques** : ou les **QUATRE** options la portent, ou **AUCUNE**.
  La bonne réponse étant intouchable : si elle porte la marque, les trois distracteurs doivent la
  porter ; sinon, aucun ne doit la porter. Pour l'incise, c'est le **NOMBRE** de parenthèses qui
  doit être égal.
  ⚠️ **PIÈGE PROPRE À CE COURS : en OCaml le `;` est un caractère de SYNTAXE** (séquence, `;;` du
  toplevel, séparateur de listes `[1; 2; 3]`) et le `:` aussi (annotation de type, `val x : int`).
  Beaucoup d'options citent du code. L'outil compte le **caractère**, pas son rôle.
  Si la bonne réponse contient un `;` de code, les trois distracteurs doivent en contenir un —
  c'est gratuit, du code faux se ponctue pareil. Et surtout :
  **n'ajoute jamais un `;` là où la bonne réponse n'en a pas.**
  Plans : `node tools/plan-rangs-qcm.js ocaml --incise` (40 questions en tête).
- **(4) DENSITÉ DE PONCTUATION (« la plus détaillée », 71,3 % ici — le 2ᵉ indice du cours).**
  La bonne réponse ne doit pas être la seule à porter le plus de virgules, deux-points et
  points-virgules. Au moins un distracteur doit l'égaler.
  `node tools/plan-rangs-qcm.js ocaml --ponctuation` (45 questions, 60,0 %).
- **(5) INDICE LEXICAL — LA RÈGLE DU `k`, RÉVISÉE LE 2026-09-07 EN `k / k / k / k`.**
  L'apprenant cherche au clavier, DANS LA PAGE, les mots de chaque option ; celle dont tous les
  mots sont présents est la bonne. `k` = nombre de mots « étrangers » (absents de la page) de la
  bonne réponse, qui est donnée.
  **LES QUATRE OPTIONS DOIVENT PORTER LE MÊME NOMBRE `k` DE MOTS ÉTRANGERS.**
  ⚠️ **L'ancienne règle `0 / 0 / k` est ABANDONNÉE et il faut comprendre pourquoi** : elle laissait
  l'ensemble {bonne réponse, distracteur à `k`} — deux éléments, la bonne dedans, donc **50 %**
  par construction pour qui restreint son tirage. Ce n'est pas un accident, c'est arithmétique :
  les deux seuls cours que le cliquet déclarait « fermés » (`mobile`, `stats`) étaient à 50,0 %
  et 49,4 %. C'est « les quatre ou aucune » de `data-eng`, transposée au lexique.
  ⚠️ **Ne mets PAS tout le monde à zéro** quand `k > 0` : sur `mobile`, « zéro mot étranger
  partout » a laissé le cours devinable **à 100 %** par la règle INVERSE (« choisis l'option qui
  contient un mot ABSENT de la page »). Fermer un indice à fond le RETOURNE.
  Outil : `node tools/mesure-lexique-qcm.js --liste=ocaml` — il calcule `k`, affiche le
  `k / k / k` visé contre l'état du jour, et compte exploitables et à mettre en forme.
- **(6) LES TROIS MARQUES RARES, RÈGLE NEUVE DU 2026-09-07 — ET LA PLUS RENTABLE DU SITE.**
  Trois marques ont un **rendement de 75 à 100 %** ici comme sur le site :
  - le **POINT INTERNE** — l'option écrite en **deux phrases** (99,0 % de rendement sur les
    6 167 questions du site : 305 fois la bonne réponse sur 308). Cause mesurée : la bonne
    réponse explique **puis conclut**, pendant que les distracteurs tiennent en une phrase.
  - les **GUILLEMETS** français « … » (76,1 % sur le site, **100 % ici**) ;
  - la **FLÈCHE** `->` ou `=>` (75,0 %).
  Règle : **les quatre options la portent, ou aucune** — et **DANS LES DEUX SENS**. Ne laisse pas
  non plus trois distracteurs marqués face à une bonne réponse qui ne l'est pas : il suffit alors
  de les **ÉCARTER**. C'est le cas de `lecon-14 q1` (flèche) dans ce cours.
  Outil : `node tools/plan-rangs-qcm.js ocaml --marques` (10 questions).
  Concrètement : si la bonne réponse est en deux phrases, **écris tes trois distracteurs en deux
  phrases** — c'est aussi la façon la plus naturelle d'atteindre la fenêtre de longueur.
- **(7) MOT TECHNIQUE EXCLUSIF (57,9 % ici).**
  Les termes de métier (`inférence`, `filtrage`, `exhaustivité`, `immuable`, `curryfication`,
  `application partielle`, `récursion terminale`, `foncteur`, `signature`, `variant`,
  `polymorphisme`, `paresseux`, `structurel`, `motif`, `toplevel`…) ne doivent pas n'apparaître
  que dans la bonne réponse : au moins un distracteur — de préférence deux — emploie du
  vocabulaire du même registre, en disant quelque chose de **faux**.
  ⚠️ Cet indice **monte** quand on écrit du français naturel avec le vocabulaire du cours (mesuré
  sur `mobile` : 25,0 % → 42,5 %). Surveille-le.
- **(8) ÉCHO DE L'ÉNONCÉ (40,3 % ici).** La bonne réponse ne doit pas être la seule à reprendre les
  mots de la question : fais-les reprendre par **UN seul** distracteur. ⚠️ Pas par les trois : sur
  `data-eng` l'écho s'est RETOURNÉ (40,8 % → 11,3 %) et « écarter l'option la plus écho » a rendu
  30,4 %. **Cette règle inverse est DANS LE CLIQUET** (`verif-qcm-biais`) : un lot qui met l'écho
  à zéro partout fera échouer la chaîne.
- **(9) LA NÉGATION (27,7 % ici, proche du hasard).** N'écris pas la négation uniquement dans la
  bonne réponse, et ne fais pas des distracteurs des affirmations toutes positives quand la bonne
  réponse nie.

**Quatre indices mineurs à ne pas RECRÉER** : pas de tiret cadratin exclusif à la bonne réponse
(il est à **0,0 % ici**, ne l'ouvre pas), pas de MAJUSCULE d'emphase exclusive (75,0 % de
rendement ici), n'accumule pas les absolus (« toujours », « jamais », « aucun ») dans les seuls
distracteurs, et ne réserve pas la nuance à la bonne réponse (« souvent », « en général »).
Ne termine pas non plus tout ton lot par le même signe final, et **ne fais pas commencer tous tes
distracteurs par le même mot** (l'« attaque unique » et le « connecteur causal » sont deux indices
que nos propres vagues d'écriture ont déjà fabriqués sur `ruby` et `nodejs`).
⚠️ **La CASSE compte aussi** (27,7 % ici) : ne fais pas commencer les distracteurs par une
minuscule quand la bonne réponse commence par une majuscule, ni l'inverse.

## Méthode

1. **Lis tes leçons en entier** (corps + QCM) : un distracteur ne peut pas être écrit sans le
   contenu enseigné, et l'indice lexical se calcule sur le texte de la page.
2. Récupère ton plan : `node tools/plan-rangs-qcm.js ocaml --json` puis filtre sur tes fichiers ;
   idem `--incise`, `--ponctuation`, `--marques`, et `node tools/mesure-lexique-qcm.js --liste=ocaml`.
3. Réécris les distracteurs question par question. **SIMULE AVANT D'ÉCRIRE** : compte les
   caractères (`[...].length` en JS, un accent compte 1), les marques, la ponctuation et les mots
   de 6 lettres et plus absents de la page. Un script Node jetable qui vérifie les cinq coûte
   moins cher qu'une reprise. **La moitié des textes proposés sans simulation cassent la forme.**
4. Après écriture, relance `plan-rangs-qcm ocaml` (tes questions au rang cible), `--incise`,
   `--ponctuation`, `--marques`, `mesure-lexique-qcm --liste=ocaml` et `node tools/verif-html.js`.
5. Rends un compte rendu : questions traitées, distracteurs réécrits, rangs obtenus, **et la liste
   de ce que tu n'as pas pu tenir avec la raison**. ⚠️ Sur `mobile`, c'est cette dernière section
   qui a révélé le retournement de l'indice lexical : elle rapporte plus que la consigne elle-même.

⚠️ **OCAML N'EST PAS INSTALLÉ SUR CETTE MACHINE** (`ocaml`, `ocamlfind`, `opam` : command not
found, vérifié le 2026-09-07). Tu ne peux donc pas exécuter un extrait pour trancher.
Conséquence : **n'invente aucune sortie**. Si tu veux écrire un distracteur qui cite une valeur
produite par du code, vérifie d'abord que la valeur juste est celle que la leçon annonce, et
raisonne **par le manuel du langage**, pas de mémoire. En cas de doute, choisis un distracteur qui
porte sur un **mécanisme** plutôt que sur une **valeur**.

⚠️ **Si le corps d'une leçon de ton lot est faux** (une sortie annoncée que le langage ne produit
pas, un contresens), **signale-le dans ton compte rendu** — mais ne le corrige que si tu peux
prouver la faute par le manuel, en citant la règle. Modifier le corps change le vocabulaire de la
page, donc relance `--liste=ocaml` après.
