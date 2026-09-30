# Consigne de correction — relecture du cours `r` (B4, 58ᵉ cours)

Préparée le 2026-09-30. La relecture par contradiction (6 agents, lecture seule, **1 077
vérifications exécutées sous R, 622 affirmations confirmées justes**) a rendu **180 fautes** dans
`scratchpad/r-relecture/fautes.json` (local, hors git ; rassemblées par
`scratchpad/r-relecture/agrege.js`). **Aucun distracteur vrai, aucune bonne réponse fausse.**
**19 sont déjà corrigées** (champ `traitee: true`) : les 8 hautes et les fautes du même passage
(`scratchpad/r-sonde/hautes.js`, preuves dans `scratchpad/r-hautes/`) —
- **toutes les sorties chiffrées de `lecon-09`** (11 fautes) : la page affichait des résultats que
  son code ne rend pas. L'exemple central du `t.test` (`set.seed(7)`) était donné significatif
  (p = 0,018) alors que R rend **p = 0,086** et un intervalle qui contient 0 ; la graine est passée
  à **`set.seed(123)`** (t = −2,317, p = **0,02314**, intervalle −13,43 à −1,02, moyennes 100,68 et
  107,90), prose et bloc `res$p.value` alignés. Rejoués et recopiés : moyenne de la population
  169,9776 et de l'échantillon 170,9793 (« ≈ 171,0 » aux quatre endroits), intervalle
  167,3739–174,2753, `chisq.test` **X² = 9,9556, p = 0,001604**, `cor.test` r = 0,6141 (0,41 à
  0,76), et les trois solutions d'exercice (12,16302 ; p = 0,006054539 et 8,6 points d'écart ;
  X² = 19,334) ;
- **`&&` sur un vecteur** (`lecon-02` astuce et piège, `lecon-03` schéma, `lecon-04` piège) : il ne
  « regarde pas le premier élément », il **s'arrête sur une erreur** depuis R 4.3
  (« 'length = 4' in coercion to 'logical(1)' ») ;
- **le diagnostic d'encodage de `lecon-06`**, qui était inversé : `Ã©` vient d'un fichier **UTF-8 lu
  comme du Latin-1** ; un fichier Latin-1 lu comme de l'UTF-8 donne `F\xe9vrier` (exécuté avec
  `read_csv` et `read.csv`). Le mojibake volontaire est intact ;
- **le schéma de `lecon-13`** : `str_extract("ada@lovelace.uk", "@")` rend `"@"`, pas l'adresse ;
  et **l'explain de q1**, qui commettait l'erreur que la leçon dénonce (`str_replace(x, ".", " ")`
  rend `" 1.42.68.53"` : le point non échappé prend le premier CARACTÈRE) ;
- **le rapport Quarto de `lecon-17`**, qui utilisait `air` sans le créer (« object 'air' not
  found » dans une session neuve).

**Reste 161 : 43 moyennes, 118 basses** — 76 corps, 34 exercices, 21 distracteurs, 8 schémas,
6 énoncés, 5 glossaires, 5 explain, 4 bonnes réponses, 2 antisèches. Les 161 `extrait_exact`
restants sont **uniques** dans leur fichier (vérifié).

Tu corriges les fautes UNIQUEMENT dans TES fichiers (filtre `fichier`, et `traitee` différent de
`true`). Chaque faute a un `extrait_exact`, une `preuve` et une `correction_proposee` — la
proposition est une piste, pas un ordre : c'est toi qui prouves.

## Règles
1. **Un seul correcteur par fichier** : tu ne touches qu'à tes fichiers. Aucune commande git (sauf
   celle que lance `controle.js` en interne), aucun commit.
2. **Jamais l'outil Edit/Write sur une page** (il écrit en CRLF). Distracteurs : patchs JSON posés par
   `node scratchpad/r-sonde/pose.js <patchs.json> [--ecrire]`. Corps, exercice, schéma, explain,
   bonne réponse : un fichier de règles écrit avec l'outil Write
   (`module.exports = [{f:"lecon-NN.html", de:"…", vers:"…", n:1}]`) et posé par
   `node scratchpad/r-corr/remplace.js <règles.js> [--ecrire]` (il refuse si l'ancien texte
   n'apparaît pas le nombre de fois attendu, reparse chaque bloc JSON et refuse BOM et CRLF). Jamais
   de heredoc pour un texte qui contient un antislash ; dans un fichier de règles, écris les
   antislashs avec `String.raw`. Dans le HTML, copie l'extrait tel qu'il est dans le fichier
   (`&lt;`, `&amp;`, `&nbsp;`…).
3. **NE JAMAIS ÉCRIRE UN RÉSULTAT DE TÊTE : L'EXÉCUTER.** `node scratchpad/webr/r.js --echo f.R`
   (webR, R 4.6.0, dplyr 1.2.1, tidyr, stringr, purrr, forcats, lubridate 1.9.5, readr, tibble,
   ggplot2 4.0.3, broom ; mode d'emploi dans `scratchpad/CONSIGNE-R.md`). Une sortie corrigée se
   **recopie de R**, chiffre pour chiffre. Exercices : rejoue `normExo` de `js/lecon.js` sur la
   réponse que la leçon enseigne ET sur les réponses justes voisines, puis vérifie qu'**aucun
   placeholder ni indice** ne devient une réponse acceptée (modèle :
   `scratchpad/docker-contre/exos.js`). Le reste (Quarto, RStudio, CRAN) : cite la source et
   distingue « prouvé par exécution », « établi par la source » et « de mémoire ».
   **Une faute non confirmée ne se corrige pas** : laisse-la et dis pourquoi.
4. **Un distracteur corrigé reste une thèse FAUSSE, précise, plausible, en français correct**
   (« LA RÈGLE QUI PRIME » de `scratchpad/CONSIGNE-R.md`), même longueur à ±10 %, même ponctuation
   et même nombre de phrases que ses options sœurs. **Simule-le avant de le poser** :
   `node scratchpad/r-sonde/essai3.js essais.json` (44 stratégies + w + k, contre l'état DU DISQUE ;
   format `[{fichier, q (1-based, bilan compris), a:[4 options]}]`) et
   `node scratchpad/r-corr/wk.js lecon-NN.html "texte"`. Un mot de moins de 6 lettres ne compte ni
   dans `w` ni dans `k` : c'est le levier pour réécrire sans bouger les mesures. Pas de mot absolu
   ajouté pour allonger.
5. **Garde-fou** : après chaque lot, `node scratchpad/r-sonde/controle.js --ref=ce3bc19` ne doit
   montrer AUCUN déplacement (état actuel : 0). **Une correction de CORPS change le vocabulaire de
   la page et peut rouvrir `k`** (vu à cette passe, deux fois : « depuis » entré dans `lecon-02`,
   « premier » sorti de `lecon-03`) — `node scratchpad/r-sonde/kdiff.js ce3bc19 lecon-NN.html`
   nomme le mot entré ou sorti : relance-le après toute correction de corps. Vérifie aussi
   `node tools/mesure-lexique-qcm.js --liste=r` (0/0/0), `node tools/mesure-mot-fetiche.js r`
   (0 alerte) et `node tools/mesure-tics-lot.js r` (0 tic).
6. **Bonne réponse, explain, énoncé** : ne les modifie QUE pour une faute listée et confirmée, en
   gardant longueur, ponctuation, majuscules d'emphase et nombre de mots au plus près (simulé par
   `essai3.js`). **Un absolu déplacé n'est pas un absolu retiré** : pour tenir une mesure,
   réordonne les MÊMES mots de façon que la phrase devienne vraie.
7. **Recalcule TOUT chiffre dérivé du chiffre que tu corriges**, relis le schéma, la légende,
   l'`aria-label`, l'antisèche et le glossaire voisins, et **cherche la même faute dans TOUTES tes
   leçons**, pas seulement là où elle est listée.
8. **Le cosmétique d'affichage** (signe `×` des en-têtes de tibble, arrondi à 3 chiffres d'un
   tibble, numéros de version) : corrige-le quand la sortie réelle est sous tes yeux, sans y passer
   plus d'une règle par bloc.
9. **`lecon-06` : le mojibake `Ã©` / `FÃ©vrier` est VOLONTAIRE.** N'y touche pas.
10. **Priorité** : toutes les moyennes, puis les basses réelles et prouvées.
11. À la fin : `node tools/verif-html.js` (0 attendu) et JSON des blocs valide.

## Groupes (disjoints)
| groupe | fichiers | moyennes | basses | total |
|---|---|---:|---:|---:|
| G1 | lecon-01, lecon-02, lecon-03 | 6 | 20 | 26 |
| G2 | lecon-04, lecon-05, lecon-06 | 10 | 15 | 25 |
| G3 | lecon-07, lecon-08, lecon-09 | 5 | 20 | 25 |
| G4 | lecon-10, lecon-11, lecon-12 | 7 | 23 | 30 |
| G5 | lecon-13, lecon-14, lecon-15, lecon-16 | 8 | 22 | 30 |
| G6 | lecon-17, cours.html | 7 | 18 | 25 |

Points à ne pas oublier :
- **Quatre bonnes réponses à retoucher avec prudence** (chaque candidate simulée par `essai3.js`) :
  `lecon-03` (n° 67, « avec un avertissement » puis « silencieusement faux » dans la même phrase),
  `lecon-06` q1 (n° 95, « pas de facteurs » : argument périmé, `read.csv` n'en fabrique plus depuis
  R 4.0 — exécuté : `class(read.csv(text = "a,b\nx,1")$a)` rend `"character"`), `lecon-09` q2
  (n° 116, « probablement réel » est une probabilité sur l'hypothèse, que l'encadré de la même page
  interdit), `lecon-17` (n° 17, « à l'identique quand les données changent »).
- **Des distracteurs recopient mot pour mot la première moitié de la bonne réponse** (`lecon-05`
  q1 : les trois ; `lecon-11` q1 : deux sur trois ; `lecon-06` q3, `lecon-04` q2) : la question ne
  se joue plus que sur la seconde moitié. Les 21 fautes de zone `distracteur` sont là.
- **`lecon-17`, bloc `05-modeliser.R`** : les coefficients affichés (−147,6461 ; 2,4391) viennent de
  `na.omit(airquality)` (111 lignes) ; le code de la page ajuste sur `air` (116 lignes) et rend
  **−146,995 et 2,429**. Tout ce qui en dérive (prédiction, R², schéma, exercice 3) est à rejouer.
- **`lecon-14`** : `fct_reorder()` est CROISSANT par défaut (la page et un explain disent
  l'inverse) ; `wday(label = TRUE)` commence au dimanche ; l'explain de q1 range « fort » avant
  « faible ».
- **`lecon-10`** : bornes de `predict(interval = "confidence")`, p-value de l'intercept du modèle
  logistique, solution de l'exercice 2.
- **`lecon-09`, ce qui reste** : `set.seed(1)` à poser en tête du bloc `rnorm(5)` / `runif(5)` (les
  valeurs affichées sont exactes à cette condition — exécuté), l'étiquette `sample(30)` du schéma,
  les premiers indices qui donnent la réponse en clair.

## Après la correction : la CONTRE-RELECTURE (18,2 %, 25,0 %, 29,0 %, 23,8 % de corrections fautives)
Un second workflow en lecture seule, chargé de DÉMOLIR les corrections (le diff depuis `ce3bc19`,
**les 19 de cette passe comprises**), avant de clore. Puis clôture : cliquets refigés
(`verif-qcm-biais.js --ecrire`, `traite: true` ; `verif-qcm-lexique.js --ecrire`),
`tools/doc/gen.js`, assembleurs des études, index
`build-index.js --write --fresh --only=quiz,flashcards,search,searchlite,antiseches,pieges` jusqu'au
point fixe, `verif.js --rapide`, désignation du 59ᵉ cours.

## Compte rendu attendu
Par faute : corrigée / laissée (raison), avec la preuve citée (fichier, sortie). Le résultat final de
`controle.js --ref=ce3bc19` sur tes leçons, et de `verif-html`.
