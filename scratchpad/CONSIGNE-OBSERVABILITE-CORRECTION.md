# Consigne de correction — relecture du cours `observabilite` (B4, 56ᵉ cours)

Préparée le 2026-09-30. La relecture par contradiction (6 agents, lecture seule, **112 vérifications
exécutées ou sourcées, 183 affirmations confirmées justes**) a rendu **69 fautes** dans
`scratchpad/observabilite-relecture/fautes.json` (local, hors git ; copie de secours :
`scratchpad/observabilite-relecture/relecture.jsonl`, le `journal.jsonl` du workflow
`wf_3e6bcc5f-b50`). **18 sont déjà corrigées** (champ `traitee: true`, commits `13a01d4` et suivant) :
les 3 hautes et les fautes du même passage — l'encadré multi-fenêtres de `lecon-10` (fenêtre longue =
assez de budget brûlé, fenêtre courte = l'alerte retombe vite ; promtool rejoué), le `trace_id` qui
ne relie PAS les métriques (`lecon-06`, `lecon-11` : exemplars, schéma redessiné, bonne réponse de
`lecon-06` q3 simulée à 0 écart), les exporteurs du Collector (`otlphttp/loki`,
`tls: { insecure: true }`, receiver sur `0.0.0.0`, `lecon-07` et `lecon-11`), l'`explain` du
distracteur vrai de `lecon-06` q4 (latence MOYENNE) et l'`accept` de l'exercice `trace id`.
**Reste 51 : 14 moyennes, 37 basses** — 17 exercices, 13 corps, 9 schémas, 5 distracteurs,
2 glossaires, 2 bonnes réponses, 1 énoncé, 1 antisèche, 1 `js/data.js`.

Tu corriges les fautes UNIQUEMENT dans TES fichiers (filtre `fichier`, et `traitee` différent de
`true`). Chaque faute a un `extrait_exact` (unique dans son fichier : vérifié pour les 51), une
`preuve` et une `correction_proposee` — la proposition est une piste, pas un ordre : c'est toi qui
prouves.

## Règles
1. **Un seul correcteur par fichier** : tu ne touches qu'à tes fichiers. Aucune commande git (sauf
   celle que lance `controle.js` en interne), aucun commit.
2. **Jamais l'outil Edit/Write sur une page** (il écrit en CRLF). Distracteurs : patchs JSON posés par
   `node scratchpad/observabilite-sonde/pose.js <patchs.json> [--ecrire]`. Corps, exercice, schéma,
   explain, bonne réponse : un fichier de règles écrit avec l'outil Write et posé par
   `node scratchpad/observabilite-corr/remplace.js <règles.js> [--ecrire]` (modèles :
   `r-l10.js`, `r-l06.js`, `r-l11.js` ; il refuse si l'ancien texte n'apparaît pas le nombre de fois
   attendu, reparse chaque bloc JSON et refuse BOM et CRLF). Jamais de heredoc pour un texte qui
   contient un antislash. Dans le HTML, copie l'extrait tel qu'il est dans le fichier
   (`&lt;`, `&nbsp;`…). ⚠️ `remplace.js` ne vise que `pages/observabilite/` : pour `js/data.js`
   (faute n° 42), écris un script Node de remplacement littéral équivalent et lance
   `node --check js/data.js` après.
3. **NE JAMAIS ÉCRIRE UN RÉSULTAT DE TÊTE : L'EXÉCUTER.** PromQL : `promtool` 3.15.0,
   `scratchpad/prometheus/prometheus-3.15.0.windows-amd64/promtool.exe test rules f.yml` (attendu
   absurde 999, lire le `got:` ; modèle `scratchpad/observabilite-prom/t2.yml`). Calculs : Node.
   YAML : `python -c "import yaml,sys; yaml.safe_load(open(sys.argv[1],encoding='utf8'))" f.yaml`
   (PyYAML 6.0.3). Exercices : rejoue `normExo` de `js/lecon.js` (l. 717-725 : NFD sans accents,
   minuscules, espaces réduits, comparaison exacte) sur la réponse que la leçon enseigne ET sur les
   réponses justes voisines. Le reste : cite la source officielle (prometheus.io, grafana.com/docs,
   opentelemetry.io, w3.org/TR/trace-context, sre.google, OWASP, texte du RGPD) et distingue
   « prouvé par exécution », « établi par la source » et « de mémoire ». **Une faute non confirmée
   ne se corrige pas** : laisse-la et dis pourquoi.
4. **Un distracteur corrigé reste une thèse FAUSSE, précise, plausible, en français correct**
   (« LA RÈGLE QUI PRIME » de `scratchpad/CONSIGNE-OBSERVABILITE.md`), même longueur à ±10 %, même
   ponctuation et même nombre de phrases que ses options sœurs. **Simule-le avant de le poser** :
   `node scratchpad/observabilite-sonde/essai2.js essais.json` (44 stratégies + w + k, contre HEAD)
   et `node scratchpad/observabilite-corr/wk.js lecon-NN.html "texte"` (longueur, mots, w, k).
   Pas de mot absolu ajouté pour allonger ; pas de « chaque », « chaîne », « valeur », « parce que ».
   ⚠️ Au 55ᵉ cours, la contre-relecture a trouvé un distracteur rendu VRAI par sa correction :
   relis ta thèse contre la page ET contre la source.
5. **Garde-fou** : après chaque lot, `node scratchpad/observabilite-sonde/controle.js --ref=753bc60`
   ne doit montrer AUCUN déplacement (état de départ : 0). **Une correction de CORPS change le
   vocabulaire de la page et peut rouvrir `k`** (vu à cette passe : retirer « exiger » du corps de
   `lecon-10` a rouvert `k` sur q1 — remis dans la phrase corrigée) : relance-le après toute
   correction de corps. Vérifie aussi `node tools/mesure-lexique-qcm.js --liste=observabilite`
   (0/0/0) et `node tools/mesure-mot-fetiche.js observabilite` (0 alerte).
6. **Bonne réponse, explain, énoncé** : ne les modifie QUE pour une faute listée et confirmée, en
   gardant longueur, ponctuation et nombre de mots au plus près (simulé par `essai2.js` ; un mot de
   6 lettres ou plus ajouté change `w` : en retirer un autre). Modèle : `lecon-06` q3, 9 candidats
   simulés pour un seul à 0 écart.
7. **Cherche la même faute dans TOUTES tes leçons**, pas seulement là où elle est listée (au 55ᵉ
   cours, une faute « traitée » dans une leçon restait dans les cinq voisines).
8. **Priorité** : toutes les moyennes, puis les basses réelles et prouvées.
9. À la fin : `node tools/verif-html.js` (0 attendu) et JSON des blocs valide.

## Groupes (disjoints)
| groupe | fichiers | moyennes | basses | total |
|---|---|---:|---:|---:|
| G1 | lecon-01, lecon-02 | 3 | 9 | 12 |
| G2 | lecon-03, lecon-04 | 2 | 7 | 9 |
| G3 | lecon-05, lecon-06, `js/data.js` | 1 | 5 | 6 |
| G4 | lecon-07, lecon-08 | 3 | 1 | 4 |
| G5 | lecon-09, lecon-10 | 3 | 8 | 11 |
| G6 | lecon-11 | 2 | 7 | 9 |

Points à ne pas oublier :
- **les données personnelles** (`lecon-02` n° 1, 7, 9 ; `lecon-09` n° 17, 18) : la page interdit
  « les données personnelles » dans les logs et journalise `user_id` partout. Décision à appliquer de
  façon COHÉRENTE dans les deux leçons : ce qui est exclu, ce sont les secrets et les données
  personnelles SENSIBLES ; pour le reste, le strict nécessaire (un identifiant interne plutôt que
  le nom ou l'e-mail). Sources : RGPD art. 4(1) et 9(1), OWASP *Logging Cheat Sheet*. La n° 9 est
  une BONNE RÉPONSE (`lecon-02`) : simuler.
- **la bonne réponse du bilan q2 de `lecon-11`** (n° 58 : « Logs (quoi) » contre le corps « journaux =
  le pourquoi ») : simuler plusieurs candidats, comme pour `lecon-06` q3.
- **les deux moyennes fausses** : `lecon-03` n° 33 (« 100 ms » pour un mélange qui donne
  **197,5 ms**) et `lecon-08` n° 28 (« 180 ms » pour **245 ms**) — recalculer, ne pas recopier.
- **le schéma `traceparent`** de `lecon-07` (n° 29) : recompter les colonnes avec un script
  (`scratchpad/observabilite-rD/ascii.js`), pas à l'œil.
- **le signalement n° 2 des écrivains a été INFIRMÉ** par la relecture (le glossaire « monitoring,
  sous-ensemble de l'observabilité » ne contredit pas le corps, qui dit « l'observabilité est plus
  large ») : ne pas y toucher.

## Après la correction : la CONTRE-RELECTURE (54ᵉ cours : 18,2 % de corrections fautives ; 55ᵉ : 25,0 %)
Un second workflow en lecture seule, chargé de DÉMOLIR les corrections (le diff depuis `753bc60`),
avant de clore. Puis clôture : cliquets refigés (`verif-qcm-biais.js --ecrire`, `traite: true` ;
`verif-qcm-lexique.js --ecrire`), `tools/doc/gen.js`, assembleurs des études, index
`build-index.js --write --fresh --only=quiz,flashcards,search,searchlite,antiseches,pieges` jusqu'au
point fixe, `verif.js --rapide`.

## Compte rendu attendu
Par faute : corrigée / laissée (raison), avec la preuve citée (fichier, sortie). Le résultat final de
`controle.js --ref=753bc60` sur tes leçons, et de `verif-html`.
