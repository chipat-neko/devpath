# Consigne d'écriture — détordre les QCM du cours `php` (point B4 du CHANTIER-V16)

`php` est le **29ᵉ cours** de la campagne, et le **plus nocif de ceux qui restent** :
78 questions, 234 distracteurs, 88,9 % de réussite pour qui coche la plus longue.

## Le problème, mesuré le 2026-09-07 sur les 78 questions du cours

| stratégie d'un apprenant qui ne comprend RIEN | réussite | rendement |
|---|---:|---:|
| **la plus longue** | **88,9 %** | **93,1 %** |
| la plus détaillée (nb de `,` + `:` + `;`) | **72,0 %** | 90,7 % |
| le mot technique exclusif | **69,6 %** | 90,4 % |
| RESTREINDRE à la parenthèse | 60,9 % | **97,4 %** |
| l'incise entre parenthèses | 60,0 % | 94,9 % |
| l'écho de la question | 52,2 % | 84,4 % |
| RESTREINDRE au point-virgule | 50,7 % | 96,4 % |
| la seule avec un point-virgule | 50,6 % | 96,4 % |
| RESTREINDRE aux deux-points | 44,9 % | 91,3 % |
| la seule qui nie | 36,8 % | 54,2 % |
| la MAJUSCULE d'emphase | 29,6 % | 83,3 % |
| la casse initiale rare | 29,2 % | 54,5 % |
| hasard | 25,0 % | — |

Rangs de longueur aujourd'hui : **73 / 3 / 1 / 1** (0 = la bonne réponse est la plus longue).
Cible : **20 / 20 / 19 / 19**. **73 questions sur 78** à retoucher, **16 036 caractères** à écrire.

Indice **lexical** (chercher au clavier, dans la page, les mots de chaque option) :
**32 questions exploitables sur 78, et 60 à mettre en forme**.

## RÈGLES ABSOLUES — une infraction fait rejeter tout le lot

1. **INTOUCHABLE : `q`, `correct`, `explain` et le TEXTE DE LA BONNE RÉPONSE.** Un contrôle
   automatique (`node tools/mesure-qcm-intouchable.js php`) compare octet à octet avec
   `git show HEAD:`. Tu ne réécris QUE les distracteurs (les options dont l'indice ≠ `correct`).
2. **Un distracteur doit rester FAUX.** C'est la faute la plus grave et la plus fréquente : en
   allongeant, on ajoute une précision vraie et le distracteur devient une seconde bonne réponse.
   Chaque distracteur allongé doit rester réfutable **par le corps de la leçon**.
   Le bon matériau, en PHP, ce sont les confusions réelles : `==` / `===`, guillemets simples /
   doubles (interpolation), `echo` / `print` / `print_r` / `var_dump`, `include` / `require`,
   `array_map` / `array_filter` / `array_walk`, `isset` / `empty` / `array_key_exists`,
   `null` / `false` / `0` / `""`, portée des variables et `global` / `static`,
   `$this` / `self::` / `static::`, `public` / `protected` / `private`,
   classe abstraite / interface / trait, `Exception` / `Error` / `Throwable`,
   PDO en requête préparée / concaténation, `session` / `cookie`, `GET` / `POST`,
   `htmlspecialchars` / `strip_tags` / `addslashes`, `json_encode` / `serialize`,
   passage par valeur / par référence (`&`), `foreach` par valeur / par référence,
   `spl_autoload_register` / Composer, `declare(strict_types=1)` et le typage,
   `??` / `?:` / `?->`, `sort` / `usort` / `asort` / `ksort` (et leur retour booléen),
   `array_merge` / `+`, `str_replace` / `preg_replace`, `namespace` / `use`.
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

## LES HUIT INDICES À FERMER, DANS LA MÊME PASSE

- **(1) RANG DE LONGUEUR.** `node tools/plan-rangs-qcm.js php` donne, question par question, le
  `rang cible` et une **fenêtre [min..max] par option**. Respecte-la : c'est elle qui produit la
  répartition plate 20/20/19/19. Le rang se compte en caractères de la chaîne (un accent = 1).
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
  ⚠️ **PIÈGE PROPRE À CE COURS : en PHP le `;` est un caractère de SYNTAXE.** Beaucoup d'options
  citent du code (`$x = 1;`). Ne compte pas sur « c'est du code, ça ne compte pas » : l'outil
  compte le caractère. Si la bonne réponse contient un `;` de code, les trois distracteurs doivent
  en contenir un — c'est facile et gratuit, du code faux se termine aussi par `;`. Et surtout :
  **n'ajoute jamais un `;` là où la bonne réponse n'en a pas.**
  Plans : `node tools/plan-rangs-qcm.js php --incise` (39 questions en tête).
- **(4) DENSITÉ DE PONCTUATION (« la plus détaillée », 72,0 % ici — le 2ᵉ indice du cours).**
  La bonne réponse ne doit pas être la seule à porter le plus de virgules, deux-points et
  points-virgules. Au moins un distracteur doit l'égaler.
  `node tools/plan-rangs-qcm.js php --ponctuation` (49 questions, 62,8 %).
- **(5) INDICE LEXICAL — LA RÈGLE DU `k`.** L'apprenant cherche au clavier, DANS LA PAGE, les mots
  de chaque option ; celle dont tous les mots sont présents est la bonne. `k` = nombre de mots
  « étrangers » (absents de la page) de la bonne réponse, qui est donnée.
  **`k = 0` → les trois distracteurs à zéro mot étranger. `k > 0` → DEUX distracteurs à zéro et UN
  à exactement `k`.** Alors aucune des trois variantes (STRICTE, PROPORTION, INVERSE) ne tranche.
  ⚠️ **Ne mets PAS tout le monde à zéro** : sur `mobile`, « zéro mot étranger partout » a mis les
  deux premières variantes à 0 % et laissé le cours devinable **à 100 %** par la règle INVERSE
  (« choisis l'option qui contient un mot ABSENT de la page »). Fermer un indice à fond le RETOURNE.
  Outil : `node tools/mesure-lexique-qcm.js --liste=php` — il calcule `k`, affiche le `0 / 0 / k`
  visé contre l'état du jour, et compte les questions exploitables et à mettre en forme.
- **(6) MOT TECHNIQUE EXCLUSIF (69,6 % ici, le 3ᵉ indice du cours — inhabituellement haut).**
  Les termes de métier (`interpréteur`, `interpolation`, `requête préparée`, `injection SQL`,
  `autoload`, `espace de noms`, `trait`, `interface`, `closure`, `itérable`, `sérialisation`,
  `sanitisation`, `en-tête HTTP`, `session`, `PDO`, `Composer`, `PSR-4`, `typage strict`…) ne
  doivent pas n'apparaître que dans la bonne réponse : au moins un distracteur — de préférence
  deux — emploie du vocabulaire du même registre, en disant quelque chose de **faux**.
  ⚠️ Cet indice **monte** quand on écrit du français naturel avec le vocabulaire du cours (mesuré
  sur `mobile` : 25,0 % → 42,5 %). Surveille-le : ici il part déjà de 69,6 %.
- **(7) ÉCHO DE L'ÉNONCÉ (52,2 % ici).** La bonne réponse ne doit pas être la seule à reprendre les
  mots de la question : fais-les reprendre par **UN seul** distracteur. ⚠️ Pas par les trois : sur
  `data-eng` l'écho s'est RETOURNÉ (40,8 % → 11,3 %) et « écarter l'option la plus écho » a rendu
  30,4 %. **Cette règle inverse est désormais DANS LE CLIQUET** (`verif-qcm-biais`) : un lot qui met
  l'écho à zéro partout fera échouer la chaîne.
- **(8) LA NÉGATION (36,8 % ici).** N'écris pas la négation uniquement dans la bonne réponse, et ne
  fais pas des distracteurs des affirmations toutes positives quand la bonne réponse nie.

**Quatre indices mineurs à ne pas RECRÉER** : pas de tiret cadratin exclusif à la bonne réponse,
pas de MAJUSCULE d'emphase exclusive (83,3 % de rendement ici), n'accumule pas les absolus
(« toujours », « jamais », « aucun ») dans les seuls distracteurs, et ne réserve pas la nuance à la
bonne réponse (« souvent », « en général », « dans la plupart des cas »).
Ne termine pas non plus tout ton lot par le même signe final, et **ne fais pas commencer tous tes
distracteurs par le même mot** (l'« attaque unique » et le « connecteur causal » sont deux indices
que nos propres vagues d'écriture ont déjà fabriqués sur `ruby` et `nodejs`).
⚠️ **La CASSE compte aussi** (29,2 % ici) : ne fais pas commencer les distracteurs par une
minuscule quand la bonne réponse commence par une majuscule, ni l'inverse.

## Méthode

1. **Lis tes leçons en entier** (corps + QCM) : un distracteur ne peut pas être écrit sans le
   contenu enseigné, et l'indice lexical se calcule sur le texte de la page.
2. Récupère ton plan : `node tools/plan-rangs-qcm.js php --json` puis filtre sur tes fichiers ;
   idem `--incise`, `--ponctuation`, et `node tools/mesure-lexique-qcm.js --liste=php`.
3. Réécris les distracteurs question par question. **SIMULE AVANT D'ÉCRIRE** : compte les
   caractères (`[...].length` en JS, un accent compte 1), les marques, la ponctuation et les mots
   de 6 lettres et plus absents de la page. Un script Node jetable qui vérifie les quatre coûte
   moins cher qu'une reprise. **La moitié des textes proposés sans simulation cassent la forme.**
4. Après écriture, relance `plan-rangs-qcm php` (tes questions au rang cible), `--incise`,
   `--ponctuation`, `mesure-lexique-qcm --liste=php` et `node tools/verif-html.js`.
5. Rends un compte rendu : questions traitées, distracteurs réécrits, rangs obtenus, **et la liste
   de ce que tu n'as pas pu tenir avec la raison**. ⚠️ Sur `mobile`, c'est cette dernière section
   qui a révélé le retournement de l'indice lexical : elle rapporte plus que la consigne elle-même.

⚠️ **PHP N'EST PAS INSTALLÉ SUR CETTE MACHINE** (`php: command not found`, vérifié le 2026-09-07).
Tu ne peux donc pas exécuter un extrait pour trancher. Conséquence : **n'invente aucune sortie**.
Si tu veux écrire un distracteur qui cite une valeur produite par du code, vérifie d'abord que la
valeur juste est celle que la leçon annonce, et raisonne **par la documentation et la
spécification du langage**, pas de mémoire. En cas de doute, choisis un distracteur qui porte sur
un **mécanisme** plutôt que sur une **valeur**.

⚠️ **Si le corps d'une leçon de ton lot est faux** (une sortie annoncée que le langage ne produit
pas, un contresens), **signale-le dans ton compte rendu** — mais ne le corrige que si tu peux
prouver la faute par la spécification, en citant la règle. Modifier le corps change le vocabulaire
de la page, donc relance `--liste=php` après.
