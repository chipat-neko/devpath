# LE NNᵉ COURS — `objc` (« Objective-C »), 95,8 % → 24,5 %

Clos le 2026-11-10 par un agent seul, dans la copie `D:\test-claude-b4\objc`, branche `b4/objc`,
en parallèle de huit autres cours. 54 questions dont 12 de bilan, 14 leçons. Consigne versionnée :
`scratchpad/CONSIGNE-OBJC.md`. Aucun fichier hors `pages/objc/**`, `scratchpad/CONSIGNE-OBJC.md` et
ce rapport n'a été modifié ; aucun fichier du dépôt principal `D:\test-claude\` n'a été touché.

⚠️ **Deux bonnes réponses étaient fausses** (preuve par la source et par la page elle-même ;
Objective-C ne s'exécute pas sur cette machine) — corrigées AVANT la vague, commit `c96bbb3` :
- `lecon-01` q2 : « à distinguer d'une chaîne C entre guillemets **simples** ». En C, une chaîne
  s'écrit entre guillemets doubles (`"texte"`) ; les simples délimitent une constante caractère
  (`'A'`, que la leçon 2 emploie). Sources : ISO C, 6.4.5 (littéraux de chaîne) et 6.4.4.4
  (constantes caractère) ; la page le dit trois fois (SVG « la chaîne C entre guillemets sans
  arobase », glossaire « la chaîne C "…" », explain « "texte" seul serait une chaîne C »).
  Devient « …entre guillemets sans le @ ».
- `lecon-09` q2 : « Via un bridging header : Swift voit le code Objective-C, et Objective-C accède
  au code Swift exposé » prêtait au bridging header les deux sens du pont. L'inverse passe par
  l'en-tête généré `NomDuModule-Swift.h` (Apple, *Importing Objective-C into Swift* et *Importing
  Swift into Objective-C*) ; la solution de l'exercice 2 de la même page dit « à ne pas confondre
  avec le bridging header, qui va dans l'autre sens », et l'explain le dit aussi. Devient « …, et un
  en-tête généré expose le Swift à Objective-C ».

## Les commits

| commit | contenu |
|---|---|
| `c96bbb3` | préparation : consigne, deux bonnes réponses fausses corrigées |
| `8413505` | vague, lot 1 (leçons 01-03) : 27 distracteurs |
| `4669ef0` | vague, lot 2 (leçons 04-06) : 27 distracteurs |
| `e6f0d29` | vague, lot 3 (leçons 07-09) : 27 distracteurs (le message dit 25 : erreur de compte, `pose.js` en a écrit 27) |
| `72e0f0f` | vague, lot 4 (leçons 10-13) : 35 distracteurs |
| `e6c4e9e` | vague, lot 5 (`lecon-14`, 3 questions et 12 de bilan) : 41 options posées |
| `74ad086` | dosage calculé (64 retouches simulées en dix passes) |
| `c0c7b15` | relecture par contradiction : 27 corrections (15 corps, 10 exercices, 2 QCM) |
| `9eb7676` | contre-relecture des corrections (le message dit « 3 sur 27 » ; le compte juste est plus bas) |
| `c7d2f35` | `verif-rendu` sur les 15 pages : 6 erreurs ANCIENNES de `lecon-10` corrigées |
| `3acc9c7` | explication orpheline (`lecon-11` q1) : `NSNumberFormatter` rétabli |

## Avant / après

| indice (commande) | avant (2026-11-10) | après |
|---|---:|---:|
| « la plus longue » (`mesure-biais-qcm --seul=objc`) | **95,8 %** (94,4 % sans ex aequo), rendement 98,1 % | **24,5 %**, rendement 25,0 % |
| pire des 44 stratégies | 95,8 % | **27,6 %** (le mot technique exclusif et la plus détaillée, à égalité) |
| la plus détaillée | 75,9 % | 27,6 % |
| le mot technique exclusif | 63,1 % | 27,6 % |
| l'incise entre parenthèses | 66,2 % | 25,6 % |
| la seule avec une ponctuation forte | 63,9 % (rendement 100 %) | 25,0 % (ne tranche plus) |
| la seule avec un point-virgule | 40,3 % (rendement 100 %) | 25,0 % (ne tranche plus) |
| la plus dense / la moins bavarde | 36,1 % / 5,6 % | 24,2 % / 26,1 % |
| questions trahies par 5 indices ou plus | **45 sur 54 (83,3 %)** | **0** (45 à 0–2, 9 à 3–4) |
| rangs de la bonne réponse (`plan-rangs-qcm objc`) | 53 / 0 / 0 / 1 | 16 / 14 / 13 / 11 (cible 14 / 14 / 13 / 13 ; les ex aequo comptent au rang 0) |
| biais inverse (`mesure-biais-inverse --toutes objc`) | 4 alertes | **0 alerte** (pire : la moins bavarde, 26,3 %) |
| tics de lot (`mesure-tics-lot objc`) | 7 (deux-points médian 24 / 3, glose finale 14 / 3, point-virgule 11 / 0…) | **0** |
| mot fétiche (`mesure-mot-fetiche objc`) | 1 alerte (`objet`, 30,4 %) | **0 alerte** |
| lexique (`mesure-lexique-qcm --liste=objc`) | 45 exploitables, 30 retournées, 48 à mettre en forme | **0 / 0 / 0** |
| intrus lexical (`mesure-mot-question objc`) | DÉFAUT 22,2 / 25,9 %, EXCÈS 29,5 / 17,7 %, 1 sûre | DÉFAUT 20,8 / 27,6 %, EXCÈS 25,2 / 24,5 %, 0 sûre (plus « exploitable ») |
| explications orphelines (`mesure-explain-orpheline --depuis=c96bbb3 --seul=objc`) | — | **0** |
| `mesure-qcm-intouchable objc c96bbb3` | — | **0 atteinte**, 157 distracteurs réécrits sur 162 |
| `verif-html` | — | 0 |
| `verif-rendu --pages=` les 15 pages | 6 erreurs anciennes (`lecon-10`) | **0** |

**Distracteurs : 157 réécrits sur 162, 5 gardés** (`lecon-13` q3 `dispatch_sync` ; bilan
`@field` ; bilan `%s`, `%o`, `{}` — quatre options de deux caractères, égalité parfaite).
**Caractères des distracteurs : 3 737 → 13 208 (+9 471)** ; bonne réponse 80,7 caractères en
moyenne, distracteur 81,5 (rapport 3,50 → 0,99). Le plan en demandait 7 735.

## Méthode, et ce qui a résisté

- **Un atelier neuf, `scratchpad/objc-sonde/atelier.js`** (local, hors git) : il applique un lot
  de patchs EN MÉMOIRE et juge chaque question contre les 44 stratégies chargées depuis l'outil,
  les 16 formes de `mesure-tics-lot` extraites du source, l'intrus lexical, le `k` et le `w` en
  occurrences, le mot technique exclusif. Chaque lot a été itéré deux à quatre fois avant d'être
  posé. Puis `dose.js` (crédit de chaque stratégie argmax, question par question) pour le dosage.
- **La contrainte la plus serrée fut le lexique** : 31 bonnes réponses sur 54 portaient des mots
  absents de leur page (jusqu'à `k = 5`, `w = 5` au bilan de la gestion mémoire). Il a fallu des
  distracteurs à `k` ET `w` exactement égaux (12 mots longs dont 3 étrangers pour `lecon-05` q1,
  `lecon-06` q1, `lecon-07` q2). Résultat : 0 / 0 / 0, du premier coup sur aucune question.
- **La vague a fabriqué ses propres déséquilibres, comme prévu** : après elle, « la plus longue »
  était tombée à 15,3 % (rangs déplacés hors du plan pour tenir le lexique), la TROISIÈME à 33,5 %,
  « la plus dense » à 38,1 % et « la moins bavarde » à 43,8 % — les bonnes réponses sont concises,
  les distracteurs allongés sont bavards. **64 retouches de dosage**, toutes simulées avant pose.
- **Fermer un indice en a rouvert un autre, plusieurs fois** : rendre `objet` exclusif à la bonne
  réponse (pour l'intrus EXCÈS) a fait monter le mot fétiche `objet` à 28,4 % ; neutraliser des
  désignations du mot technique a fait passer son taux global de 23,3 à 28,5 %, puis le biais
  inverse a exigé de rendre la bonne réponse désignée seule sur deux questions. Arbitrage final :
  27,6 %, sans alerte inverse.
- **Le biais inverse ne se règle pas au taux global** : l'écho, le mot technique et la plus
  détaillée étaient à 26-27 % au global mais à 0 % de désignation juste sur 11 à 15 questions —
  donc 33 % à qui les écarte. Il a fallu des désignations JUSTES (3 sur l'écho, 2 sur le mot
  technique) ou ramener les désignations sous le seuil de 8.

## Fautes de fond trouvées et corrigées (preuves par la source ; aucune exécution)

Objective-C ne s'exécute pas sur cette machine (ni `clang`, ni GNUstep, WSL hors service) et
Foundation / ARC supposent l'écosystème Apple : **rien n'a été exécuté**, toutes les preuves
viennent de la documentation officielle (Apple, ISO C) ou de la page elle-même.

**Distracteurs anciens vrais par accident, remplacés par la vague** :
- `lecon-03` q1 : `[obj set:1:2]` — un sélecteur à étiquettes vides (`set::`) est légal ;
- `lecon-05` q3 : « L'objet courant » pour `super` — le receveur d'un message à `super` EST
  `self`, seule la recherche commence dans la superclasse ;
- `lecon-14` (bilan) : `objet->methode(arg)` — la flèche désignait l'option seule, et
  « objet- » comptait comme mot étranger.

**Relecture par contradiction (commit `c0c7b15`) — 15 fautes du corps** :
- `lecon-05` (moyenne) : `nonatomic` donné comme « le défaut en pratique » ; le défaut du langage
  est `atomic` (Apple, *Programming with Objective-C* : « Properties Are Atomic by Default »).
- `lecon-07` (moyenne) : « Objective-C n'a pas de ramasse-miettes » (corps et glossaire) — il en a
  eu un sur Mac OS X 10.5 à 10.7, déprécié en OS X 10.8 (Apple, *Transitioning to ARC Release
  Notes*), jamais sur iOS.
- `lecon-10` (moyenne) : le schéma disait « error reste à nil » en cas de succès, contre l'encadré
  de la même page (« la variable peut contenir n'importe quoi » ; Apple, *Error Handling
  Programming Guide*) — `aria-label` et texte du SVG.
- `lecon-12` (moyenne) : « il appelle `doesNotRecognizeSelector:` et le programme s'arrête » —
  la méthode lève une `NSInvalidArgumentException`, qui n'arrête le programme que si personne ne
  la rattrape (Apple, NSObject) — corps et glossaire.
- `lecon-09` : « cette dernière leçon » (le cours en a 14) ; « via des fichiers d'en-tête
  générés » (le bridging header est créé par Xcode à la demande puis rempli à la main ; seul
  `-Swift.h` est généré) ; antisèche « Clang : le compilateur qui traduit Objective-C (et Swift) »
  (Swift passe par `swiftc`).
- `lecon-01` et `cours.html` : « pendant près de trente ans… Tout le Mac » — Apple rachète NeXT en
  1997, Swift arrive en 2014 ; le Mac d'avant Mac OS X n'était pas écrit en Objective-C.
- `lecon-02` : `BOOL` « et non true/false » (ils compilent aussi) ; l'étoile « systématique pour
  les objets » (le type `id` s'écrit sans) ; `lecon-03` : renvoi « leçon 7 » pour le patron
  delegate (leçon 6) ; `lecon-04` : le « Cas réel » montrait une sortie que le code de la page ne
  produit pas ; `lecon-06` : la catégorie « propre aux langages dynamiques » (C#, Swift ont des
  extensions) ; `lecon-13` : GCD « intégrée à Foundation » (libdispatch fait partie du système) ;
  `lecon-14` : la « sortie attendue » omettait l'horodatage que NSLog ajoute.

**10 fautes d'exercices** : 7 indices qui étaient une réponse acceptée — un PREMIER ou DEUXIÈME
indice, pas un dernier indice délibéré (`lecon-06` exo 2, `lecon-08` exos 1, 2 et 3, `lecon-10`
exo 2, `lecon-11` exo 2 `defaultManager`, `lecon-12` exo 1 `runtime`) — et 3 réponses acceptées
FAUSSES retirées : « [maChaine length] » pour « les délimiteurs d'un message », « fuite » pour
« le nom du problème » (cycle de rétention), « nil » pour « la valeur de retour ».

**2 distracteurs repris** : `lecon-08` q3 (le remède « déclarer une variable `__block` » était
vrai par accident sous ARC — une variable `__block` forte garde `self` en vie ; devenu « déclarer
sa propriété en `assign` », faux dans les deux cadres) ; `lecon-01` q3 (phrase incohérente
« depuis… dès l'origine »).

**Contre-relecture (commit `9eb7676`) — 4 corrections fautives sur 27 (14,8 %)**, plus 1 faute
ancienne : ma reprise de `lecon-14` (« NSLog ajoute devant chaque ligne ») faisait entrer
« devant » dans le corps et tombait le `k` de la bonne réponse du bilan q6 — prise par
`controle.js` avant commit, redite « en tête de » ; `lecon-12` : la correction omettait encore
l'étape de redirection du message (« ni redirection prévue ») ; `lecon-01` : « Mac OS X… bâti avec
lui » restait trop large (noyau en C/C++, Carbon), et ma première reprise (« Les applications de
Mac OS X ») était encore un absolu (le Finder était en Carbon jusqu'à 10.6) — devenu « Cocoa, le
cadre des applications de Mac OS X ». Faute ancienne : `lecon-03` exo 3 acceptait « nil » comme
résultat de `[nil length]` (un `NSUInteger` : 0).

**`verif-rendu` sur les 15 pages (commit `c7d2f35`) : 6 erreurs ANCIENNES de `lecon-10`**,
présentes à `a6a45f2` (rejouées sur la version d'origine) : contraste 1,19:1 — les explications des
solutions des exercices 1 et 3 étaient placées DANS la figure de code à fond sombre (déplacées
après `</figure>`, comme partout ailleurs) — et débordement +12 px à 1280 px (un `<code>` en ligne
de 99 caractères, découpé en deux). Relancé : 0 erreur.

**Explication orpheline (commit `3acc9c7`)** : l'explain de `lecon-11` q1 réfute
`NSNumberFormatter`, distracteur effacé par la vague. Rétabli (« NSNumberFormatter, via
stringFromNumber: et format: »), après avoir fait entrer `NSNumberFormatter`, `stringFromNumber:`
et `numberFromString:` dans le corps (Pour aller plus loin) — sans quoi son `k` montait.

## Laissé, et dit

- **Bonnes réponses discutables, non touchées** (simplifications usuelles, non fausses) :
  `lecon-05` q3 « super : la classe parente » (c'est `self`, avec une recherche qui commence dans
  la superclasse) ; `lecon-03` q2 « renvoie nil ou 0 » (pour une structure, la mise à zéro n'est
  garantie que par les ABI récentes).
- **Corps** : le SVG de `lecon-09` attribue la cohabitation des deux langages à « la chaîne commune
  LLVM » (elle tient surtout au runtime Objective-C et à l'importeur de Clang) ; « UIKit,
  Foundation, AppKit… en grande partie écrits en Objective-C » (Foundation est en partie réécrit en
  Swift depuis 2023 : affirmation datée) ; le SVG de `lecon-12` garde « (plante) » après
  `doesNotRecognizeSelector:`, cohérent avec « non rattrapée » mais elliptique.
- **Exercices** : 13 « fuites » restantes selon `exos-tous.js`, toutes un DERNIER indice
  délibéré ou un libellé « Revoir « X » » (convention du moteur sur tout le site) ; 15 réponses
  lisibles dans l'énoncé visible (`fuites-enonces.js` : `lecon-05` exo 3, `lecon-06` exos 2 et 3,
  `lecon-11` exos 1 et 3) — même convention, à trancher hors B4, comme pour `bash` et `tests`.
- **Rangs** : 16 / 14 / 13 / 11 au compte de `plan-rangs` (les ex aequo y comptent au rang 0) ;
  les stratégies de rang, elles, rendent 24,5 / 25,2 / 27,0 / 23,3 %.
- ⚠️ La copie de travail avait été extraite en **CRLF** (`core.autocrlf=true` partagé avec le
  dépôt principal, dont l'arbre est en LF) : les 15 pages du cours ont été remises en LF avant tout
  travail, ce qui ne change rien pour git (l'index est en LF). Les autres fichiers de la copie sont
  restés en CRLF ; `git status` y montre des pages « modifiées » sans différence de contenu.

## Vérificateurs de clôture

`verif-donnees` : 8 erreurs, toutes **I18** (index dérivés périmés : `quiz-index`, `flashcards`,
`antiseches`, `search-index`, `search-lite` — attendu, je ne régénère pas les index), et 3
avertissements qui ne concernent pas ce cours (`zig`, `doc`, pages d'étude). `verif-rendu
--pages=` les 15 pages du cours : 0 erreur après correction (puis relancé sur `lecon-01`, `-11`,
`-12`, modifiées en dernier : 0). `verif-html` : 0. JSON des blocs valide (`pose.js` et
`remplace.js` reparsent tout), 0 CR et 0 BOM dans `pages/objc/`, aucune URL externe ajoutée.

`verif.js --rapide` (sortie conservée hors git dans `scratchpad/objc-depart/verif-rapide.txt`,
code 1) : les étapes attendues signalent — `qcmbiai` et `qcmlexi` (« objc a progressé, 95,8 % →
24,5 %, pire indice 95,8 % → 27,6 %, sans que le gain soit figé » : règle de fusion, je ne refige
pas) et `donnees` (I18). ⚠️ **D'autres étapes signalent aussi, et je les attribue à l'extraction
de la copie en CRLF, pas à ce cours** : `moteurs` (« SQLJS_SRC : 46535 caractères, attendu
46721 »), `normatf` (« écart de 1 caractère » avec le fichier de référence), `rj-cpp` (« bloc
introuvable » sur 12 programmes), `maths` (58 divergents), `doc-ref`, `etudes`, et `requete` non
mesuré (« fin de JUGE_SQL introuvable »). Aucune ne lit `pages/objc/` ; toutes comparent des
fichiers que cette copie a reçus en CRLF (seules les pages du cours y ont été remises en LF). **À
rejouer par l'orchestrateur sur l'arbre fusionné en LF** — non vérifié ici au-delà des traces.

## Ce qui reste

- Refiger les cliquets (`verif-qcm-biais.js --ecrire`, marquer `objc` `traite` ;
  `verif-qcm-lexique.js --ecrire`), régénérer les index (`build-index --write --fresh`) et les pages
  dérivées : à la fusion, par l'orchestrateur.
- Aucune exécution d'Objective-C : un `clang` + GNUstep portable aurait permis de rejouer les
  blocs de code du corps (tous relus, aucun exécuté). Les sorties en commentaire (`// 11`,
  `// "OBJECTIVE-C"`, la sortie du projet de `lecon-14`) ont été vérifiées à la main.
