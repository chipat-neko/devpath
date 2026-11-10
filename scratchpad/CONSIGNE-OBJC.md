# Consigne d'écriture — les QCM du cours `objc` (B4)

Préparée le 2026-11-10 par l'agent du cours `objc`, seul sur sa copie (`D:\test-claude-b4\objc`,
branche `b4/objc`), en parallèle de huit autres cours. Il tient tous les rôles (écriture, dosage,
relecture, contre-relecture) : cette consigne est la sienne, écrite pour être relue et rejouée.
Mesures de départ archivées hors git dans `scratchpad/objc-depart/` (sorties brutes des outils,
`questions.txt` : les 54 questions à plat). Sondes copiées de `tests-sonde` / `tests-corr` et
repointées sur `pages/objc/` dans `scratchpad/objc-sonde/` et `scratchpad/objc-corr/`, plus un
atelier neuf, `scratchpad/objc-sonde/atelier.js`, qui simule un lot de patchs EN MÉMOIRE et juge
chaque question contre les 44 stratégies chargées depuis l'outil, les 16 formes de
`mesure-tics-lot` (extraites du source, pas recopiées), l'intrus lexical, le `k` et le `w`.

Le cours : « Objective-C », 14 leçons, 3 questions chacune, plus 12 de bilan dans `lecon-14`
(54 questions, 162 distracteurs). Messages entre crochets, types et NSString, classes .h/.m,
propriétés et méthodes, protocoles et catégories, mémoire (ARC, cycles), collections et blocks,
écosystème et Swift, NSError / NSException, Foundation (dates, fichiers, tri, NSPredicate),
runtime et introspection, GCD, projet d'inventaire.

## ⚠️ Avant toute écriture : deux bonnes réponses fausses, corrigées

- `lecon-01` q2 disait « à distinguer d'une chaîne C entre guillemets **simples** ». En C, une
  chaîne s'écrit entre guillemets DOUBLES (`"texte"`) ; les simples délimitent une constante
  caractère (`'A'`, que la leçon 2 emploie elle-même). La page le dit trois fois (SVG, glossaire,
  explain). Corrigé en « entre guillemets sans le @ ».
- `lecon-09` q2 prêtait au bridging header les DEUX sens du pont ; il n'expose que l'Objective-C
  au Swift — l'inverse passe par l'en-tête généré `-Swift.h`, et la solution de l'exercice 2 de la
  même page le dit (« à ne pas confondre avec le bridging header, qui va dans l'autre sens »).
  Corrigé en « …, et un en-tête généré expose le Swift à Objective-C ».

## ⚠️ OBJECTIVE-C NE S'EXÉCUTE PAS ICI

Ni `clang`, ni `gcc`, ni GNUstep, et WSL ne fonctionne pas ; Foundation et ARC supposent
l'écosystème Apple. Aucune chaîne lourde n'est installée. **Tout comportement annoncé se vérifie
dans la documentation officielle** (Apple : *Programming with Objective-C*, *Advanced Memory
Management Programming Guide*, *Transitioning to ARC Release Notes*, *Error Handling Programming
Guide*, *Objective-C Runtime Programming Guide*, *Concurrency Programming Guide*, les pages de
référence de Foundation et de Dispatch ; Clang : *Automatic Reference Counting*, *Objective-C
Literals*) et s'écrit « non exécuté » dans le rapport. **N'écris jamais une sortie de tête comme
si elle avait tourné.**

## LA RÈGLE QUI PRIME : un distracteur est une thèse FAUSSE, PRÉCISE et PLAUSIBLE

Test de recevabilité pour chaque distracteur : (1) je nomme l'erreur en une phrase ; (2) chaque
proposition a un référent ; (3) un débutant crédule pourrait le cocher ; (4) aucune parenthèse ni
queue de phrase de remplissage ; (5) aucune conjonction sans logique ; (6) aucun comportement
annoncé sans que le comportement VRAI soit établi par la source.

### ⚠️⚠️ Le piège propre à ce cours : la thèse VRAIE PAR ACCIDENT, selon le CADRE

Beaucoup d'affirmations Objective-C sont vraies dans un cadre et fausses dans l'autre. Un
distracteur doit être faux **dans le cadre de la question** — et quand le cadre n'est pas dit,
faux dans TOUS les cadres. Les cas mesurés sur ce cours :

| affirmation tentante | pourquoi elle peut être VRAIE |
|---|---|
| « il faut appeler retain / release à la main » | vrai SANS ARC (code d'avant 2011, fichiers compilés en `-fno-objc-arc`) |
| « Objective-C a un ramasse-miettes » | vrai sur Mac OS X 10.5 à 10.7 (GC optionnel, abandonné en OS X 10.8, jamais sur iOS) |
| « l'accès à une propriété est thread-safe » | `atomic` est le DÉFAUT du langage ; il garantit un getter/setter non déchiré, pas la cohérence d'un objet |
| « `nonatomic` est le défaut » | FAUX : c'est le choix COURANT, le défaut est `atomic` |
| « `strong` est le défaut » | vrai sous ARC pour une propriété objet ; avant ARC, c'était `assign` |
| « `objet.message` (sans parenthèses) n'est pas de l'Objective-C » | FAUX : la notation pointée appelle un getter sans argument (`tableau.count`) |
| « `super` est l'objet courant » | à moitié vrai : le receveur reste `self`, seule la recherche commence dans la superclasse |
| « envoyer un message à nil renvoie 0 » | vrai pour un objet, un entier, un pointeur ; pour une structure, garanti à zéro seulement par les ABI récentes |
| « `[Classe new]` crée une instance » | VRAI : `new` = `alloc` + `init` (la leçon 4 le dit) |
| « une catégorie peut remplacer une méthode » | possible mais le comportement est INDÉFINI (doc Apple) : ne pas l'écrire comme fausse ni comme vraie |
| « un message inconnu plante » | il lève `NSInvalidArgumentException` (après les étapes de redirection) ; « plante » n'est vrai que si personne ne la rattrape |
| « `dispatch_sync` bloque » | vrai : il attend la fin du bloc ; le deadlock n'est que vers la file courante série |
| « un block retient ce qu'il capture » | vrai pour une variable objet forte, une fois le block copié sur le tas |
| « `id` s'écrit sans étoile » | vrai : `id` est déjà un pointeur — « tout objet porte une étoile » est donc un absolu à éviter |

Tiens-toi à des erreurs de FAIT ou de DÉFINITION que la page de TA leçon établit, et préfère une
erreur classique et nette (confondre `.h` et `.m`, `-` et `+`, `==` et `isEqualToString:`,
`strong` et `weak`, `NSError` et `NSException`, `dispatch_async` et `dispatch_sync`, sélecteur
avec ou sans `:`) à une élégance mesurée.

## Pourquoi ce travail — relevé du 2026-11-10

`node tools/mesure-biais-qcm.js --seul=objc` : **« la plus longue » 95,8 %** (couverture 96,3 %,
rendement 98,1 %) ; la plus détaillée 75,9 % ; l'incise entre parenthèses 66,2 % ; la ponctuation
forte (union) 63,9 % en désignation unique, rendement 100 % ; le mot technique exclusif 63,1 % ;
RESTREINDRE aux deux-points 56,9 % ; la seule avec un point-virgule 40,3 % (rendement 100 %) ;
l'écho de la question 38,4 % ; la plus dense 36,1 %. **45 questions sur 54 (83,3 %)** trahies par
5 indices ou plus. Bonne réponse **80,7 caractères** en moyenne contre **23,1** pour un
distracteur (rapport **3,50**). Rangs **53 / 0 / 0 / 1**, cible **14 / 14 / 13 / 13**, **7 713
caractères** à écrire sur 52 questions (`node tools/plan-rangs-qcm.js objc`).

- `mesure-biais-inverse --toutes objc` : 4 alertes (rangs 2, 3, 4 et la moins bavarde).
- `mesure-tics-lot objc` : **7 tics** — deux-points médian **24 / 3** (rendement 95,7 %, gain
  55,1 %), glose finale entre parenthèses **14 / 3** (42,1 %), point-virgule médian **11 / 0**
  (40,3 %), « par exemple » 5 / 0, parenthèse ouverte par un article 4 / 0, verbe « est / reste /
  devient… » 12 / 22, « c'est un » 3 / 1.
- `mesure-mot-fetiche objc` : 1 alerte, `objet` (8 bonnes / 9 distracteurs, RESTREINDRE 30,4 %).
- `mesure-lexique-qcm --liste=objc` : **45 exploitables, 30 retournées, 48 à mettre en forme** ;
  31 bonnes réponses ont `k > 0`.
- `mesure-mot-question objc` : EXCÈS direct 29,5 % (1 question sûre).

## Ce que tu dois tenir, par ordre d'importance

1. **Longueur et rang** : suis le rang visé et la bande de caractères de `plan-rangs-qcm`. Le rang
   en MOTS de la bonne réponse suit son rang en caractères (« la moins bavarde » et son inverse).
   L'attaque : jamais trois options sur le même mot et la quatrième sur un autre (motif 3 + 1).
2. **Ponctuation, par marque : les quatre ou aucune** (`;`, `:`, parenthèse, tiret cadratin, `/`,
   « », flèche, virgule décimale), et donc l'UNION. ⚠️ **Le code porte de la ponctuation** :
   `[obj setX:1 y:2]`, `@selector(nom:)`, `respondsToSelector:`, `NSError **`, `iOS/macOS`,
   `-Swift.h`, `objet.methode()`. Un sélecteur suivi d'une espace (`isEqualToString: compare`)
   est un « deux-points médian ». Compte-les.
3. **Les formes des tics, par question : 0, 2 ou 4 porteurs, jamais 1 ni 3** — deux-points
   médian, point-virgule, glose finale, parenthèse ouverte par un article, « par exemple »,
   « c'est un », et le verbe `est / sont / reste / devient / garde` (la forme le cherche PARTOUT
   dans l'option, pas seulement à la fin).
4. **Absolus, prudents, négation : les quatre ou aucune.** ⚠️ Plusieurs bonnes réponses en
   portent : « Rien : … sans planter » (`lecon-03` q2 : absolu ET négation), « Non : … ni pauses »
   (`lecon-07` q2), « n'est pas modifié » (`lecon-11` q2), « peut ne pas l'implémenter »
   (`lecon-14` q3 : prudent ET négation), « plutôt que » (`lecon-10` q3), « souvent »
   (`lecon-06` q1), « permet » (`lecon-05` q3), « pas le contenu », « pas un accès direct »,
   « ne se lit qu'ensuite », « plus aucune référence forte ne le retient ».
5. **Lexique** : `k` égal sur les quatre options (mots de 6+ lettres absents du corps de la page,
   comptés en OCCURRENCES) ; si `k > 0`, `w` égal aussi (nombre de mots de 6+ lettres). Un mot de
   moins de 6 lettres ne compte pas : c'est le levier. L'apostrophe colle (`l'objet`, `qu'elles`,
   `d'appeler` sont UN jeton) ; le trait d'union aussi (`ramasse-miettes`, `objective-c`).
   ⚠️ « objet-> » fait un jeton « objet » étranger : évite le code collé à un tiret.
6. **Le mot technique exclusif** (9 lettres et plus, porté par une seule option) et **l'intrus
   lexical** (mots de 5+ lettres portés par 1 ou 3 options) : chaque option porte au moins un mot
   à elle, et aucun mot n'est partagé par exactement trois options.
7. **Le point interne** : `lecon-08` q3 est la seule bonne réponse en deux phrases ; ses trois
   distracteurs concluent aussi, par une seconde phrase FAUSSE. Ailleurs, une seule phrase.
8. **Mot fétiche** : `objet` est porté à parts presque égales (8 / 9) ; vise environ une bonne
   pour trois distracteurs, pas davantage.
9. **Les distributions argmax** (la plus dense, la moins bavarde, la plus détaillée, l'écho, le
   mot technique exclusif) se règlent au COURS : la bonne réponse doit sortir dans environ un
   quart des questions, ni toujours ni jamais. Le dosage se calcule à la fin de la vague.

## Bilan de `lecon-14` (12 questions, bonnes réponses très courtes)

`@property` (9 caractères), `%@` (2), `[objet methode:arg]` (19) : là, les distracteurs sont **les
noms voisins que le cours établit** (`@synthesize`, `@dynamic`, `@interface` ; `%d`, `%s`, `%f` ;
`[objet methode]`, `objet.methode`…), chacun réellement faux pour la question posée — et
attention aux vrais par accident (`%s` affiche bien une chaîne C, pas un objet ; `objet.nom`
appelle bien un getter).

## Les contraintes de non-régression

1. Bonne réponse, `q`, `correct` et `explain` intouchables, sauf faute prouvée — contrôle :
   `node tools/mesure-qcm-intouchable.js objc <sha>`.
2. Aucun distracteur vrai ni discutable dans le cadre de la question.
3. JSON valide, sans BOM, sans CRLF — garanti par `pose.js` et `remplace.js`. ⚠️ La copie de
   travail a été extraite en CRLF (`core.autocrlf=true`) : les pages du cours ont été remises en
   LF, comme dans l'index, avant tout travail (aucune différence de contenu pour git).
4. Aucune URL externe. Jamais de heredoc pour un texte qui porte un antislash ou un `$`.

## L'ordre de travail

```
node tools/plan-rangs-qcm.js objc
node scratchpad/objc-sonde/atelier.js <patchs.json> [--cours]   # simulation en mémoire
node scratchpad/objc-sonde/pose.js <patchs.json> --ecrire       # pose, JSON reparsé
node tools/mesure-biais-qcm.js --seul=objc
node tools/mesure-biais-inverse.js --toutes objc
node tools/mesure-lexique-qcm.js --liste=objc
node tools/mesure-mot-fetiche.js objc
node tools/mesure-tics-lot.js objc --exemples
node tools/mesure-mot-question.js objc --plan
```

Un lot = quelques leçons, commité aussitôt posé (un lot non commité ne survit à rien).
