# Consigne de correction — relecture du cours `tests` (B4, 60ᵉ cours)

Préparée le 2026-09-30. La relecture par contradiction (6 agents, lecture seule, **239 tests Jest
exécutés, environ 1 260 essais `normExo`, environ 340 affirmations confirmées justes**) a rendu
**162 fautes** dans `scratchpad/tests-relecture/fautes.json` (local, hors git ; rassemblées par
`scratchpad/tests-relecture/agrege.js`, lisibles par
`node scratchpad/tests-relecture/voir.js "<condition sur f>"`, par exemple
`"f.fichier==='lecon-04.html' && !f.traitee"`). **9 sont déjà corrigées** (champ `traitee: true`,
commit `5c5d64a`, preuves rejouées dans `scratchpad/tests-env/moi/`) :
- **l'`await` oublié devant `expect(...).rejects`** (`lecon-08` : encadré, phrase d'introduction,
  bonne réponse et explain de q1) — sous Node 24 + Jest 29.7, le test n'est vert que si la promesse
  rejette comme prévu ou ne se règle jamais ; si elle résout, le processus Jest tombe (code 1, aucun
  rapport) ;
- **la propriété d'aller-retour de `lecon-10`** (`fc.object()` + `toEqual` échouait 20 fois sur 20 ;
  remplacée par `fc.json()` + comparaison du texte, 5 000 cas verts) ;
- **le p95 est un SEUIL** (`lecon-11` : corps, bonne réponse et distracteur 2 de q1 ; `lecon-14` :
  bonne réponse et explain de la question de bilan sur le p95) — formule retenue : « le mieux que
  vivent les 5 % les moins bien servis ».

**Reste 153 à corriger : 61 moyennes, 92 basses.** Chaque faute a un `passage` (citation exacte),
une `preuve` et une `correction` proposée — la proposition est une piste, pas un ordre : c'est toi
qui prouves. ⚠️ Quatre passages ne se retrouvent pas tels quels dans leur page (`l07-09#24` et
`l07-09#26` : 2 occurrences ; `l10-11#16` et `l14#2` : 0, la page a bougé depuis) : retrouve-les par
le sens.

Tu corriges les fautes UNIQUEMENT dans TES fichiers (filtre `fichier`, `traitee` différent de
`true`).

## Règles
1. **Un seul correcteur par fichier** : tu ne touches qu'à tes fichiers. Aucune commande git (sauf
   celles que `controle.js`, `kdiff.js` et `mesure-qcm-intouchable.js` lancent en interne, en
   lecture), aucun commit.
2. **Jamais l'outil Edit/Write sur une page** (il écrit en CRLF). Distracteurs : patchs JSON posés
   par `node scratchpad/tests-sonde/pose.js <patchs.json> [--ecrire]`
   (`[{"fichier","q":<1-based, bilan compris>,"opt":<0-based>,"texte"}]`). Corps, code, exercice,
   schéma, explain, énoncé, bonne réponse : un fichier de règles écrit avec l'outil Write
   (`module.exports = [{f:"lecon-NN.html", de:"…", vers:"…", n:1}]`) et posé par
   `node scratchpad/tests-corr/remplace.js <règles.js> [--ecrire]` (il refuse si l'ancien texte
   n'apparaît pas le nombre de fois attendu, reparse chaque bloc JSON et refuse BOM et CRLF).
   ⚠️ **Jamais de heredoc** pour un texte qui contient un antislash ou un `$` : écris TOUT fichier
   avec l'outil Write ; dans un fichier de règles, écris les antislashs avec `String.raw`. Dans le
   HTML, copie l'extrait tel qu'il est dans le fichier (`&lt;`, `&gt;`, `&amp;`, `&nbsp;`…).
   ⚠️ Certaines options de QCM portent une **espace insécable** (U+00A0) devant `%` : copie-la
   depuis le fichier, ou écris ` ` dans la règle.
   Tes fichiers de travail vont dans `scratchpad/tests-corr/<ton groupe>/`, tes essais Jest dans
   `scratchpad/tests-env/corr-<ton groupe>/`.
3. **NE JAMAIS ÉCRIRE UNE SORTIE DE TÊTE : L'EXÉCUTER.** Jest 29.7 et fast-check sont installés
   dans `scratchpad/tests-env/` (`cd scratchpad/tests-env && npx jest corr-<groupe>/x.test.js
   --verbose`) ; mode d'emploi et limites dans `scratchpad/CONSIGNE-TESTS.md`, section « CE QUI SE
   PROUVE SE PROUVE ». Tout bloc de code que tu corriges ou écris est **exécuté dans sa forme
   finale** ; toute sortie affichée se **recopie de l'exécution**. Exercices : rejoue `normExo` de
   `js/lecon.js` sur la réponse que la leçon enseigne ET sur les réponses justes voisines, puis
   vérifie qu'**aucun placeholder, indice ni libellé de lien** ne devient une réponse acceptée
   (`node scratchpad/tests-relecture/moi/exos-tous.js` : 12 fuites au départ, dont les dernières
   indications délibérées « … en anglais » — corrige celles que la relecture a jugées être des
   fuites, et n'en crée aucune). ⚠️ `normExo` passe en minuscules. Ce qui ne s'exécute pas ici
   (k6, Pact, Stryker, Playwright, GitHub Actions) : cite la source et distingue « prouvé par
   exécution », « établi par la source » et « de mémoire ».
   **Une faute non confirmée ne se corrige pas** : laisse-la et dis pourquoi. Les fautes dont la
   preuve est « mémoire » (chiffres de Google, Ariane 5, Knight Capital, citation de Beck, livre de
   Feathers, billet de Bloch…) ne se corrigent que par une formulation **prudente et sûre** (retirer
   le chiffre douteux, dire « environ », « d'après »), jamais par un autre chiffre de mémoire.
4. **Garde-fou** : après chaque lot de poses, `node scratchpad/tests-sonde/controle.js
   --ref=5c5d64a lecon-NN.html …` ne doit montrer AUCUN déplacement sur tes leçons (état actuel : 0).
   **Une correction de CORPS change le vocabulaire de la page et peut rouvrir `k`** (vu à cette
   passe : « l'échec » entré dans le corps de `lecon-08` a fait tomber le `k` d'une bonne réponse) —
   `node scratchpad/tests-sonde/kdiff.js 5c5d64a lecon-NN.html` nomme le mot entré ou sorti :
   relance-le après toute correction de corps, et redis la chose avec un mot déjà présent (ou sans
   le mot de 6 lettres et plus qui gêne ; l'apostrophe et le tiret collent : `l'échec` est UN jeton).
5. **Bonne réponse, explain, énoncé, distracteur** : ne les modifie QUE pour une faute listée et
   confirmée, et **simule avant de poser** : `node scratchpad/tests-sonde/sim.js <patchs.json>`
   (même format que `pose.js`, il accepte aussi l'index de la bonne réponse et un champ `variante`
   pour comparer plusieurs candidats ; il doit rendre « AUCUN écart ») et
   `node scratchpad/tests-corr/wk.js lecon-NN.html "texte"` (longueur, `w`, `k`, mots étrangers).
   Un texte de remplacement doit tenir : le même rang de longueur, le même nombre de mots (ou le
   même rang), le même `w`, le même `k`, aucun mot de 9 lettres et plus que les autres options n'ont
   pas, la même ponctuation forte, le même nombre d'absolus et de mots prudents. Si aucun candidat
   ne tient à 0 écart après 6 essais, **laisse la faute et rends tes candidats** : l'orchestrateur
   tranchera. Une bonne réponse ne se modifie que si elle est FAUSSE ou trompeuse, pas pour un
   simple mieux-dire.
6. **Recalcule TOUT ce qui dérive de ce que tu corriges**, relis le schéma, la légende,
   l'`aria-label`, le récapitulatif, l'antisèche et le glossaire voisins, et **cherche la même faute
   dans TOUTES tes leçons**, pas seulement là où elle est listée (un absolu corrigé à UN endroit
   quand la page le dit à cinq est la faute la plus fréquente des passes précédentes). ⚠️ **Un
   absolu déplacé n'est pas un absolu retiré** : « sauf X » où X est lui-même trop large reste faux.
7. **Priorité** : toutes les moyennes, puis les basses réelles et prouvées. Un lien externe
   `<a href="https://…">` vers une documentation se laisse (ce n'est pas un chargement).
8. À la fin : `node tools/verif-html.js` (0 attendu), JSON des blocs valide, 0 CRLF, 0 BOM, et
   aucune URL vers cdnjs.cloudflare.com, fonts.googleapis.com ni fonts.gstatic.com.

## Groupes (disjoints)
| groupe | fichiers | moyennes | basses | total |
|---|---|---:|---:|---:|
| G1 | lecon-01, lecon-02, lecon-03 | 8 | 17 | 25 |
| G2 | lecon-04, lecon-05, lecon-06 | 11 | 14 | 25 |
| G3 | lecon-07, lecon-08, lecon-09 | 8 | 19 | 27 |
| G4 | lecon-10, lecon-11, cours.html | 12 | 13 | 25 |
| G5 | lecon-12, lecon-13 | 9 | 15 | 24 |
| G6 | lecon-14 | 13 | 14 | 27 |

Points à ne pas oublier :
- **`lecon-01`** : « une documentation qui ne ment jamais » (un test au corps vide reste vert) —
  l'absolu est aussi dans l'antisèche, le glossaire et le récap.
- **`lecon-02`** : « un test sur soixante est flaky » (la source dit autre chose) ; l'exercice 3
  accepte « une assertion » et refuse le libellé de son propre lien ; l'exercice 2 refuse `setUp`.
- **`lecon-04`** : `moyenne([])` « plante » (elle rend `NaN`) ; l'exercice 2 refuse la forme que son
  propre indice dessine ; trois tests de l'exemple sont verts d'emblée, contre l'antisèche.
- **`lecon-05`** : ce que la page appelle « mock » est l'espion de Fowler — la leçon 8 dit « espion ».
- **`lecon-06`** : « la branche principale reste toujours verte » (six endroits) ; « cette dernière
  leçon » et l'encadré « Pour aller plus loin » sont périmés (le cours a 14 leçons).
- **`lecon-08`** : « une entrée qu'aucun test ne peut fixer » (faux : `jest.setSystemTime`,
  `jest.spyOn(Date, "now")`) ; le bloc `rappel.test.js` est écrit pour Vitest sans le dire.
- **`lecon-10`** : le schéma des mutants (`age > 18` et `age >= 19` sont la même fonction sur des
  entiers ; avec le seul test de la page le score est 1 / 3) ; le schéma du shrinking (deux étapes
  marquées « échoue » qui passent) ; « tableaux géants » (`fc.array` ne dépasse pas 10 éléments par
  défaut) ; « 300 cas » contre 100 mesurés.
- **`lecon-12`** : le bloc Pact n'écrit aucun contrat sans `provider.executeTest(...)` (prouvé sous
  `@pact-foundation/pact` 17.1.4 par le relecteur, dans un projet jetable hors dépôt — refais de
  même si tu réécris le bloc) ; un contrat sans matcher exige les valeurs exactes.
- **`lecon-13`** : la sortie `npm audit` affichée n'est pas celle de npm 11.13 ; la solution de
  l'exercice 3 (`toThrow()` nu) reste verte quand la fonction plante ; trois exercices se valident
  par leur propre énoncé ou leur premier indice.
- **`lecon-14`** : « le filet rougit au moindre changement » (6 changements sur 8 restent verts) —
  corps, commentaire, schéma, bonne réponse de q2, solution de l'exercice 1 ; `ouverture.js`
  déclare deux fois `estOuvert` ; la solution du mini-projet importe `./panier`, absent de la
  page ; « impossible à contrôler en test » est contredit par la leçon 8. ⚠️ **G6 seulement** : le
  bilan garde des défauts de MESURE connus que la vague n'a pas fermés — lexique
  (`node tools/mesure-lexique-qcm.js --liste=tests` : q6, q7, q8, q12 du fichier) et intrus
  (`node tools/mesure-mot-question.js tests --plan`). Quand tu réécris un distracteur de ces
  questions-là pour une faute listée, profites-en pour les fermer : là, et là seulement, un écart
  de `k` ou de `w` dans le BON sens (vers l'égalité des quatre) est admis ; dis-le.
- **Les 48 fautes d'exercice** sont presque toutes des listes `accept` qui refusent une forme que
  la page enseigne, qui acceptent un mot de l'énoncé, ou des indices qui donnent la réponse avant
  le masque (place la traduction APRÈS le masque, ou retire-la).

## Compte rendu attendu
Par faute (identifiant `lot#n`) : corrigée / laissée (raison), avec la preuve citée (fichier,
sortie) et sa nature (exécution / source / mémoire). Écris-le aussi dans
`scratchpad/tests-corr/<ton groupe>/rendu.json` :
`[{"id":"l04-06#3","etat":"corrigee|laissee","preuve":"…","note":"…"}]`. Puis le résultat final de
`controle.js --ref=5c5d64a` sur tes leçons, de `kdiff.js`, et de `verif-html`.
