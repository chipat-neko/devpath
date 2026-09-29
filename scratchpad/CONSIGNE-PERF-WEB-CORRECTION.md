# Consigne de correction — relecture du cours `perf-web` (B4, 54ᵉ cours)

Préparée le 2026-09-30. La relecture par contradiction (6 agents, lecture seule) a rendu **179 fautes**
dans `scratchpad/perf-web-relecture/fautes.json` (local, hors git ; copie de secours : le
`journal.jsonl` du workflow `wf_e338bc89-587` dans le dossier de session). **19 sont déjà corrigées**
(champ `traitee: true`) : les 9 hautes, les 3 distracteurs vrais, la bonne réponse sur le p75 et les
fautes du même passage. **Reste 160 : 43 moyennes, 117 basses** — 90 dans les CORPS, 24 dans les
exercices, 34 distracteurs, 11 `explain`, 1 bonne réponse.

Tu corriges les fautes UNIQUEMENT dans TES leçons (filtre `fichier`, et `traitee` différent de `true`).
Chaque faute a un `extrait_exact` (unique dans le fichier, vérifié), une `preuve` et une
`correction_proposee` — la proposition est une piste, pas un ordre : c'est toi qui prouves.

## Règles
1. **Un seul correcteur par fichier** : tu ne touches qu'à tes leçons. Aucune commande git (sauf celle
   que lance `controle.js` en interne), aucun commit.
2. **Jamais l'outil Edit/Write sur une page** (il écrit en CRLF). Distracteurs : patchs JSON posés par
   `node scratchpad/perf-web-sonde/pose.js <patchs.json> [--ecrire]` (format `{fichier,q,opt,texte}` ou
   `{fichier,old,texte}`, `old` = texte COMPLET de l'option). Corps, exercice, explain, bonne réponse :
   un script Node de remplacements littéraux, écrit avec l'outil Write, sur le modèle de
   `scratchpad/perf-web-relecture/corps-hautes.js` (refuse si l'ancien texte n'est pas unique, reparse
   le JSON des blocs). Jamais de heredoc. Dans le HTML, copie l'extrait tel qu'il est dans le fichier
   (`&lt;`, `&nbsp;`…).
3. **NE JAMAIS ÉCRIRE UN CHIFFRE DE TÊTE : LE CALCULER.** Tout pourcentage, conversion, budget, durée :
   un script `node` dans `scratchpad/perf-web-corr-<ton groupe>/`, exécuté, sortie citée. Tout code JS
   corrigé qui peut tourner hors navigateur tourne, et le bloc corrigé entier rend ce qu'il annonce.
   Pour une règle de norme (HTTP, HTML, Web Vitals, Google Search), cite la source et distingue
   « prouvé par exécution », « établi par la norme » et « de mémoire ». **Une faute signalée « de
   mémoire, à vérifier » qui ne se confirme pas ne se corrige pas** : laisse-la et dis pourquoi.
4. **Un distracteur corrigé reste une thèse FAUSSE, précise, plausible, en français correct**
   (« LA RÈGLE QUI PRIME » de `scratchpad/CONSIGNE-PERF-WEB.md`), même longueur à ±10 %, même
   ponctuation et même nombre de phrases que ses options sœurs. Pas de mot absolu (« aucun »,
   « rien », « tout ») ajouté pour allonger : il rouvre « écarter les absolus ».
5. **Garde-fou** : après chaque lot, `node scratchpad/perf-web-sonde/controle.js --ref=b476e55
   lecon-NN.html ...` ne doit montrer, sur tes leçons, que les déplacements déjà présents au départ
   (le seul admis : `lecon-04` q3, « la plus dense » passée de l'option 2 à l'option 1, deux
   distracteurs, taux inchangé). **Une correction de CORPS change le vocabulaire de la page et peut
   rouvrir `k`** : c'est arrivé cette passe (« désérialiser » retiré d'une solution de `lecon-12`, un
   distracteur l'employait) — relance après toute correction de corps ; si un mot manque, remets-le
   dans le corps ou change le distracteur avec un substitut PRÉSENT dans la page.
   Vérifie aussi `node tools/mesure-lexique-qcm.js --liste=perf-web` (0/0/0) et
   `node tools/mesure-mot-fetiche.js perf-web` (0 alerte). N'emploie pas « chaque », « chaîne » ni
   « valeur » pour allonger.
6. **Bonne réponse, explain** : ne les modifie QUE pour une faute listée et confirmée, en gardant la
   longueur, la ponctuation, l'attaque (« Parce que le… ») et le nombre de mots au plus près.
7. **Priorité** : toutes les moyennes, puis les basses réelles et prouvées.
8. À la fin : `node tools/verif-html.js` (0 attendu) et JSON des blocs valide.

## Groupes proposés (disjoints)
| groupe | leçons | fautes restantes |
|---|---|---:|
| G1 | 01, 02, 03 | 8 + 12 + 6 = 26 |
| G2 | 04, 05, 06 | 4 + 5 + 12 = 21 |
| G3 | 07, 08, 09 | 10 + 8 + 11 = 29 |
| G4 | 10, 11, 12 | 13 + 13 + 10 = 36 |
| G5 | 13, 14 | 11 + 14 = 25 |
| G6 | 15 | 23 |

## Compte rendu attendu
Par faute : corrigée / laissée (raison), avec la preuve citée (fichier, sortie). Le résultat final de
`controle.js --ref=b476e55` sur tes leçons, et de `verif-html`.
