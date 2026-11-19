# C8 — llm, 97,9 % → 25,0 %

Phase C du chantier V18, case C8 : les QCM du cours `llm` (« Développer avec l'IA & les LLM »,
12 leçons, **48 questions** dont 12 de bilan, **144 distracteurs**). Copie de travail
`D:\test-claude-c8-llm`, branche `v18/c8-llm`, partie de `8d163bf`. Un seul agent, tous les rôles.

**Rien n'a été écrit sous `D:\test-claude\`** (lu seulement : consignes, sondes, mémoire).

**Atteintes à l'intouchable : aucune.** `node tools/mesure-qcm-intouchable.js llm 8d163bf` :
« 48 questions, 144 distracteurs, 144 réécrits. Aucune atteinte : q / correct / explain / bonne
réponse intacts. » Aucune bonne réponse ni explication n'a été prouvée fausse (voir § 4, ce qui
est signalé sans y toucher).

## 1. Avant / après

| indice | avant (`8d163bf`) | après (`HEAD`) | commande |
|---|---:|---:|---|
| la plus longue | **97,9 %** | **25,0 %** | `node tools/mesure-biais-qcm.js --seul=llm` |
| pire des 44 stratégies | 97,9 % (la plus longue) | **27,1 %** (la plus dense) | id. |
| la plus détaillée | 71,5 % | 25,0 % (ne tranche plus) | id. |
| le mot technique exclusif | 66,0 % | 25,2 % (direct) · INVERSE rendement 26,7 % | id. ; `mesure-biais-inverse.js --toutes llm` |
| l'incise entre parenthèses | 60,9 % | 25,0 % (ne tranche plus) | id. |
| ponctuation forte (seule / RESTREINDRE) | 54,7 % / 54,7 % | 25,0 % / 25,0 % | id. |
| la moins bavarde / ECARTER | 0,0 % / 40,3 % | 24,3 % / 25,3 % | id. |
| la plus dense / ECARTER | 22,9 % / 26,0 % | 27,1 % / 24,3 % | id. |
| ecarter les deux extrêmes | 1,0 % | 25,0 % | id. |
| questions trahies par 5 indices ou plus | 35 sur 48 | 0 | id. (pied du tableau) |
| rangs de la bonne réponse (0 = la plus longue) | 47 / 1 / 0 / 0 | **12 / 12 / 12 / 12** | `node tools/plan-rangs-qcm.js llm` |
| lexique : exploitables / retournées / à mettre en forme | 42 / 30 / 46 | **0 / 0 / 0** | `node tools/mesure-lexique-qcm.js --liste=llm` |
| intrus lexical DÉFAUT / EXCÈS (questions sûres) | 1 / 1 | 0 / 0 (25,0 % partout) | `node tools/mesure-mot-question.js llm` |
| mots fétiches en alerte | 5 (`données`, `tokens`, `système`, `prompt`, `modèle`) | **0** (le plus haut à couverture ≥ 8 : `chaque`, `réponse`, `modèle` 27,8 %) | `node tools/mesure-mot-fetiche.js llm` |
| tics de lot | 11 | **0** | `node tools/mesure-tics-lot.js llm --exemples` |
| biais inverse (`--toutes`) | 4 alertes | **0** (pire : mot technique exclusif 26,7 %) | `node tools/mesure-biais-inverse.js --toutes llm` |
| point interne | 0 question tranchée | 0 | `node tools/mesure-point-interne.js` |
| explication orpheline | — | 0 (6 cas indicatifs relus, tous cohérents) | `node tools/mesure-explain-orpheline.js --depuis=8d163bf --seul=llm` |
| `--lots` (fenêtres de 4 et de 3 leçons) | — | aucune fenêtre signalée | `node tools/mesure-biais-qcm.js --lots`, `--lots=3` |

**Écrit** : 144 distracteurs sur 144 réécrits (aucun gardé), de **4 580 à 14 450 caractères
(+9 870)** pour 8 269 demandés par `plan-rangs-qcm` ; distracteur moyen 31,8 → 100,3 caractères,
bonne réponse moyenne 101,7. Dosage : 46 retouches d'options déjà réécrites (deux lots), relecture
par contradiction : 3, ex æquo de longueur cassés : 2.

## 2. Ce qui a été fait, dans l'ordre (8 commits)

| commit | contenu |
|---|---|
| `8d635863` | vague, lot 1 (leçons 01-03), 27 distracteurs. ⚠️ Le message annonce « 93,8 % » : faux, mesuré avant la pose et avant l'échange de rangs de `lecon-03` ; le chiffre réel après pose était **85,4 %** (corrigé dans le message du lot 2). |
| `1189733b` | lot 2 (04-06), 27 distracteurs ; la plus longue → 70,8 % |
| `b94397d7` | lot 3 (07-09), 27 distracteurs ; → 56,3 % |
| `de41aab9` | lot 4 (10-12, bilan compris) ; → 25,0 %, rangs 12/12/12/12. Le message dit « 64 distracteurs » : 63 distincts (une option de `lecon-11` q3 réécrite deux fois pour son rang). |
| `0785706f` | dosage calculé (la plus dense, la moins bavarde, mot technique exclusif, mots fétiches, tic « message système ») |
| `abe8ee63` | corps : 7 fautes corrigées en 11 endroits (§ 4). Le message dit « 9 fautes » : le bon compte est 7 fautes, 11 emplacements. |
| `72cffd64` | relecture par contradiction : 3 distracteurs ambigus réécrits |
| (dernier) | deux ex æquo de longueur entre distracteurs cassés (`lecon-01` q1, `lecon-11` q3 : la bonne réponse y restait seule au milieu pour « écarter les deux extrêmes ») |
| (dernier, même commit) | consigne `scratchpad/CONSIGNE-LLM.md` et ce rapport |

**Outils de travail** (hors git, `scratchpad/c8-llm/sonde/`) : `controle.js` (copie de la sonde v2
de `vue`, repointée : à vide, 0 indicateur déplacé sur 48 questions) ; `atelier.js` (banc
d'écriture : un lot de patchs appliqué EN MÉMOIRE, puis pour chaque question les 44 stratégies
chargées depuis l'outil, `w`/`k` à la découpe exacte du lexique, l'intrus à la découpe exacte de
`mesure-mot-question`, les 16 motifs de forme de `mesure-tics-lot`, le rang visé ; puis tout le
cours, dans les deux sens) ; `diff.js` (ce qu'un lot change, question par question, contre le
disque) ; `dose.js`, `fet.js` (dosage de la densité, du nombre de mots, du mot technique, des
fétiches et n-grammes) ; `pose2.js` (pose sûre : refuse la bonne réponse, vérifie que la
re-sérialisation d'un bloc intact redonne l'original, reparse chaque bloc, refuse CR et BOM) ;
`rempl.js`, `corps.js`, `vocab.js`, `aplat.js`, `texte.js`. Mesures brutes : `scratchpad/c8-llm/depart/`
et `scratchpad/c8-llm/apres/`.

**Rangs visés** : le plan figé au départ (`plan-rangs-qcm --json`) mettait les trois questions du
bloc quiz de `lecon-12` au même rang 3 (le plan répartit par FICHIER, et ce fichier a deux blocs) :
réparti par bloc (quiz : rangs 3 / 2 / 1 ; bilan : 3 / 3 / 3 / 3). Échanges q1 ↔ q3 dans
`lecon-03`, `lecon-05`, `lecon-06`, `lecon-07`, là où la règle du `w` rendait le rang du plan
intenable (bonne réponse longue, dense, à `k` > 0). Total inchangé : 12 / 12 / 12 / 12, et chaque
bloc de trois questions a trois rangs distincts.

**Six phrases de corps retouchées pour la règle du `k`** (même sens, faire entrer dans la page les
mots étrangers d'une bonne réponse intouchable) :
- `lecon-05` « Citer les sources » : « Le but : rendre la réponse vérifiable et réduire la
  confiance aveugle — donc les hallucinations non détectées. » (q3 : k 4 → 0) ;
- `lecon-07` encadré : « La compétence durable, au-delà d'un fournisseur ou d'un framework
  précis — ils changent vite —, c'est le modèle mental » (q3 : k 1 → 0) ;
- `lecon-08` biais du juge : « ou la première option présentée (biais de position) » (q3) ;
- `lecon-08` récap : « le jugement (humain ou LLM-as-judge) est réservé à la tâche ouverte » (q2) ;
- `lecon-12` garde-fous : « (donc potentiellement empoisonnés par des injections indirectes
  cachées, L9) » (q2 : k 5 → 2) ;
- `lecon-12` récap : « cite ses sources pour les rendre vérifiables, et dit « je ne sais pas »
  sinon, pour éviter d'inventer » (q1 : k 2 → 0).

## 3. Le dosage, calculé

Après la vague, la longueur, les marques, le lexique, l'intrus et les tics étaient fermés, mais
trois indices « inhérents » étaient ouverts : **la plus dense 46,9 %** (bonne réponse seule la
plus dense dans 22 questions sur 48), **la moins bavarde 34,7 %**, **le mot technique exclusif
34,7 %**, plus trois mots fétiches (`modèle` 30,7 %, `données` 30,2 %, `chaque` 29,3 %) et le tic
« message système » 28,6 %.

- **Densité** : 22 → 13 questions (un quart de 48 = 12). 9 bascules : un distracteur rendu plus
  dense que la bonne réponse en ôtant de petits mots ou en en allongeant un, à longueur, rang, `w`
  et `k` constants (ex. `lecon-11` q2 « dans le modèle » → « au modèle » : 5,00 → 5,07 contre
  5,06), plus une égalité cassée (`lecon-10` q3, « réseau » → « serveur »).
- **Nombre de mots** : les mêmes retouches ont posé 5 ex æquo ; 3 autres retouches d'un mot
  (`lecon-04` q3, `lecon-07` q2, `lecon-11` q1). 34,7 % → 24,3 %.
- **Mot technique exclusif** : il faut ≈ une désignation de la bonne réponse pour trois de
  distracteurs, sinon l'un des deux sens monte. Premier réglage : 3 contre 16 → INVERSE 28,1 %
  (alerte de `mesure-biais-inverse`) ; trois désignations de distracteurs ramenées à l'égalité :
  3 contre 12, plus 4 égalités → 25,2 % direct, INVERSE 26,7 %.
- **Fétiches** : `modèle` retiré de distracteurs où la bonne réponse ne le porte pas (remplacé
  par `LLM`, `système`, `moteur`, `serveur`… de même compte de lettres longues), `chaque` remplacé
  par `plusieurs` ou `toute`, `données` posé là où seule la bonne réponse le portait, `tokens`
  rendu à un distracteur de `lecon-01` q2, « message système » donné à un distracteur de
  `lecon-03` q1.

Chaque retouche a été simulée (`diff.js`) avant pose : seuls les indicateurs visés bougent ; à
la pose, `controle.js` contre `HEAD`.

## 4. Fautes de fond

### Corrigées dans le corps (7 fautes, 11 emplacements), chacune avec sa preuve

Calculs rejoués en Python 3.14 : `scratchpad/c8-llm/preuves/preuves.py`, sortie `preuves.out`.

1. **`lecon-04`, renvoi faux** : le tool use est « la brique des agents, à la leçon suivante » et
   le glossaire dit « (leçon 5) » ; la leçon 5 est le RAG, les agents sont la leçon 6 (`cours.html`
   et les titres des pages). Corrigé aux deux endroits.
2. **`lecon-08`, exemple impossible** : « une hausse de 1 % sur 20 cas n'en est pas une » — sur
   20 cas, un cas pèse 5 points, une hausse de 1 % ne peut pas exister. Rejoué (test exact de
   Fisher, unilatéral) : 15/20 → 16/20, p = 0,500 ; 15/20 → 19/20, p = 0,091. Devenu : « sur 20
   cas, chacun pèse 5 points : un cas de plus n'est pas une hausse significative ».
3. **`lecon-10`, commentaire de code faux (corps et solution de l'exercice 3)** :
   `appel_robuste(essais=3)` commenté « backoff : 1 s, 2 s, 4 s ». Rejoué : les attentes
   effectives sont `[1, 2]`, le troisième échec bascule sur le repli sans attendre 4 s. Commentaire
   corrigé aux deux endroits.
4. **`lecon-10`, exercice 3** : la solution appelle le modèle de repli **sans timeout**, juste
   sous l'encadré « fixe toujours un timeout » : `timeout=20` ajouté.
5. **`lecon-01` et `lecon-10`, « un token ≈ ¾ de mot » sans langue** (reste signalé par le V16,
   case C3) : c'est la règle anglaise d'OpenAI ; la leçon 10 elle-même mesure 1,8 token par mot
   sur le français. « en anglais » ajouté dans les deux glossaires, l'antisèche de `lecon-01` et
   un indice d'exercice de `lecon-10`.
6. **`lecon-06`, exercice 2** : la solution refusait une action sensible par un simple
   `continue`, sans rien renvoyer au modèle — qui redemanderait la même action à chaque tour
   jusqu'à la limite d'étapes. Le refus est maintenant renvoyé comme observation
   (`messages.append(message_outil("action refusée par l'humain"))`), comme le fait la boucle de
   la leçon pour tout résultat d'outil.
7. **`lecon-12`, exercice 2** : « rétractation » était accepté comme « réponse de repli quand le
   contexte ne contient pas l'information : « je ne … » » ; retiré (« refuser » gardé).

### Distracteurs qui auraient pu être vrais, réécrits à la relecture par contradiction

- `lecon-04` q2 « L'API distante : elle appelle seulement ton script » : vrai avec un connecteur
  MCP distant (le fournisseur appelle alors le serveur du développeur) → « elle calcule seulement
  la réponse ».
- `lecon-12` q7 « Avec un cache : elle garde le contexte une heure » : frôle le cache de prompt
  (durée de vie d'une heure chez certains fournisseurs) → « Avec un état : elle garde le contexte
  du client ». ⚠️ L'ANCIEN distracteur (« Capable de se souvenir une heure ») avait le même défaut.
- Pendant la vague : `lecon-02` q2 « deux exemples rendent le prompt et son coût plus bas qu'une
  longue explication » (souvent vrai) écarté avant pose ; `lecon-11` q2 « montrer des exemples de
  données au modèle » (des exemples porteurs de l'information la lui donnent) écarté au dosage.

### Signalé, non touché (discutable, pas prouvé faux)

- **« basse température = déterministe »** : `lecon-01` q3 (explain « sorties déterministes »),
  `lecon-12` q5 (bonne réponse « basse = déterministe »), le schéma de `lecon-01` (« → sûr,
  répétable, déterministe ») et un indice d'exercice. Sur l'exemple de la leçon (0,42 / 0,30 /
  0,12), T = 0,2 choisit encore le second token 16 % du temps (rejoué) ; seule T = 0 est gloutonne,
  et la documentation d'Anthropic avertit que même T = 0 n'est pas entièrement déterministe
  (**non revérifié en ligne aujourd'hui** : la page de référence de l'API n'a pas pu être lue en
  entier). La documentation d'OpenAI parle elle-même de valeurs basses « plus déterministes » :
  formule du cours jugée simplificatrice, pas fausse ; à trancher hors C8.
- `lecon-01` : l'exemple « Bonjour le monde » → `["Bon", "jour", " le", " monde"] (≈ 4 tokens)`
  donne **3 tokens** avec le tokenizer de Qwen2.5 (`['Bonjour', 'Ġle', 'Ġmonde']`, exécuté) ; le
  découpage dépend du tokenizer et l'exemple est marqué « ≈ » : laissé.
- `lecon-07` est présentée comme « dernière étape » du cours alors que cinq leçons suivent
  (structure, pas faute de fait).

### Vérifié juste (exécuté ou sourcé)

`cout(2000, 400)` = 0,0016 € ; exercice : 0,00225 € et 225 €/jour ; prix de sortie = 3 × entrée ;
`1893 × 4127 = 7812411` ; `usage` 12 + 3 = 15 ; « anticonstitutionnel » plusieurs tokens (4) et
« chat » un seul (Qwen2.5) ; menace n°1 du Top 10 OWASP LLM = injection de prompt (LLM01:2025,
genai.owasp.org, lu le 2026-11-19). Les encadrés « Cas réel » n'ont pas été touchés
(`verif-contenu` : 1 551 conformes sur 1 551) ; chaque QCM voisin d'un encadré dit la même chose
que lui.

### Exécuté / non exécuté

- **Exécuté** : tous les calculs ci-dessus (Python 3.14), le tokenizer Qwen2.5 (bibliothèque
  `tokenizers` locale), les boucles de backoff.
- **Non exécuté** (pas de modèle à appeler) : tout comportement d'API (température, cache de
  prompt, connecteurs MCP, état côté serveur), lu dans la connaissance des documentations
  officielles et non revérifié aujourd'hui, sauf l'OWASP. Aucun de ces points ne fonde une
  correction : ils ont seulement fait écarter des distracteurs ambigus.

## 5. Leçons de ce cours

- **La règle du `w` gouverne tout quand 35 bonnes réponses sur 48 ont `k` > 0** : chaque mot de
  six lettres compte, et un synonyme plus court change `w`. Le levier le plus sûr a été de
  REPRENDRE les mots étrangers de la bonne réponse dans les distracteurs (« L'ensemble… »,
  « En renvoyant… », « seulement », « parade », « appliquer »). Quand la bonne réponse était
  longue, dense et à `k` élevé (lecon-05 q3 : `k` = 4, `w` = 8), il a fallu faire entrer ses mots
  dans le corps : six phrases, à sens égal.
- **Fermer la longueur ouvre la densité, à coup sûr** : les distracteurs allongés à la main
  portent des petits mots ; la bonne réponse, dense, l'est restée seule dans 22 questions sur 48
  (46,9 %). Le dosage se fait en ôtant de petits mots à UN distracteur par question, jamais
  partout.
- **Le mot technique exclusif se dose dans les deux sens** : le premier réglage l'a retourné
  (INVERSE 28,1 %) ; viser une désignation de la bonne pour trois de distracteurs.
- **Changer un mot pour un fétiche change la longueur** : « modèle » → « LLM » ôte 3 caractères et
  a fait passer la bonne réponse de rang (`lecon-09` q2, retouche abandonnée) ; « modèle » →
  « service » (+1) a créé une égalité avec la bonne réponse (`lecon-10` q1, remplacé par
  « réseau »). Et « de sa réponse » → « de la réponse » ne casse pas une égalité : même longueur.
- **Le plan des rangs répartit par fichier, pas par bloc** : `lecon-12` (quiz de 3 + bilan de 12)
  aurait mis la bonne réponse la plus courte dans les trois questions du quiz.
- **Un ex æquo entre deux distracteurs suffit à rendre « écarter les deux extrêmes » sûr** (la
  bonne réponse seule au milieu) : cassés en fin de passe ; la stratégie revient à 25,0 %.

## 6. Ce qui reste

- **Pire stratégie 27,1 %** (la plus dense, 13 questions sur 48 où la bonne réponse est seule la
  plus dense) ; ensuite ECARTER la moins bavarde 25,3 % et le mot technique exclusif 25,2 % ;
  mots fétiches `chaque`,
  `réponse`, `modèle` à 27,8 % (sous le seuil de 28 %) ; tics « message système » et « les
  réponses » à 27,1 % (sous le seuil).
- Le mot technique exclusif garde 3 questions où la bonne réponse est seule à porter le plus de
  mots de 9 lettres (`lecon-05` q3, `lecon-12` q1, q3) : bonnes réponses intouchables à 3 mots
  longs exclusifs ; compensé par 12 désignations de distracteurs, pas fermé question par question.
- Quelques distracteurs restent d'un français un peu raide sous la contrainte du `w` (« la glisser
  ainsi au prompt », `lecon-05` q2 ; « Ouvrir le manuel le plus probable », `lecon-12` q4) : sens
  clair et faux, mais à relire par la contre-relecture indépendante.
- La consigne `CONSIGNE-LLM.md` a été mise au propre APRÈS la vague (notes de travail avant) :
  l'ordre de la case n'a pas été tenu à la lettre.
- Index dérivés à régénérer par l'orchestrateur (`verif-donnees` I18 : `quiz-index.js`,
  `antiseches-data.js` — l'antisèche de `lecon-01` a changé —, `search-index.js`) ; cliquets
  `qcmbiai` (llm : longueur 97,9 → 25,0 %, pire 97,9 → 27,1 %) et `qcmlexi` (llm : STRICTE
  35,3 → 0,0 %) à refiger après lecture.
- Pages dérivées à regénérer à la fusion (interdites à cette case) : `pages/etude-inconnu.html`
  (taille des blocs de code du corpus, 6560,6 → 6560,7 Ko) et les chiffres S3 / S4 de la page de
  documentation que `normatf` recalcule (§ 8).

## 7. Vérifications finales

- `node tools/verif-html.js` : aucun problème.
- `node tools/verif-contenu.js` : code 0, 1 551 « Cas réel » conformes.
- `node tools/verif-donnees.js` : 6 erreurs, toutes I18 (index périmés, attendus) ; 3
  avertissements anciens (I17 `zig`, I19, I25 `doc`).
- `node tools/verif-qcm-biais.js` / `verif-qcm-lexique.js` : code 1, « progressé sans que le gain
  soit figé » pour `llm` seulement (attendu).
- 0 CR, 0 BOM sur les 12 pages modifiées ; seules les pages `pages/llm/lecon-*.html` sont touchées
  (plus cette consigne et ce rapport) ; aucune URL interdite ; blocs JSON valides.
- `node tools/verif.js` : voir § 8.

## 8. La chaîne rapide (`node tools/verif.js --rapide`, sur l'arbre final)

54 vérificateurs joués (29 étapes de `--complet` non jouées par ce mode ; `--mutations` jamais
lancé). **48 OK, 6 signalés, aucun inattendu** — sortie brute :
`scratchpad/c8-llm/apres/verif-rapide.txt`.

| étape | verdict | cause |
|---|---|---|
| `donnees` | SIGNALE | 6 erreurs I18 : `quiz-index.js`, `antiseches-data.js`, `search-index.js` à regénérer (§ 6). |
| `qcmbiai` | SIGNALE | « référence périmée » : `llm` a progressé (longueur 97,9 → 25,0 %, pire 97,9 → 27,1 %) sans que le gain soit figé. |
| `qcmlexi` | SIGNALE | id. pour l'indice lexical (`llm` seulement). |
| `normatf` | SIGNALE | 8 contrôles sur 75 : les chiffres de la règle S3 publiés par la page de documentation (13,2 % de manquements, 803, 5 300, 86,8 %, S4 69 / 89 cours…) ne sont plus ceux du corpus, puisque les 144 distracteurs de `llm` ont changé. Page `pages/doc/` interdite à cette case. |
| `etudes` | SIGNALE | `pages/etude-inconnu.html` PÉRIMÉE (première divergence ligne 226, le bloc de mesure du corpus). |
| `etude-6` | SIGNALE | même cause, vue par le vérificateur de l'étude : « 6560,6 Ko » publié, **6560,7 Ko** mesurés. Ce chiffre est la somme des octets des blocs de CODE des leçons (`tools/etudes/inconnu/mesure-langages.js`, ligne 388) : il a bougé avec mes corrections de code (`lecon-06` exo 2 : une ligne `messages.append(...)` ; `lecon-10` : commentaires du backoff et `timeout=20` au repli). Rejoué seul : `node tools/preuves/etude-inconnu.js` → 1 faute, cette ligne-là. Page dérivée interdite à cette case : à regénérer à la fusion. |

`doc-ref`, `doc-rec`, `contenu`, `exemple`, `python`, `caract`, les études 1 à 5 et toutes les
étapes de rejeu (`rj-*`) sont vertes.

## 9. Reprise après la contre-relecture (le dosage qui restait)

La contre-relecture indépendante (commit `075ddbdb`, 28 corrections) a rendu faux six distracteurs
vrais par accident, corrigé la bonne réponse du bilan q1 (« basse ≈ déterministe »), précisé deux
énoncés du bilan (q3, q5) et la solution de l'exercice 2 de `lecon-06`. Ses retouches des leçons
07 à 12 avaient rouvert le lexique et la densité ; la reprise les referme **sans défaire leur sens**
(chaque distracteur qu'elle a rendu faux le reste, avec sa thèse ; les énoncés précisés et la bonne
réponse corrigée restent tels quels). Seuls des distracteurs ont été touchés.

### Avant / après

Avant = `075ddbdb` (après la contre-relecture) ; après = `dac5d6ed`. Mesures brutes :
`scratchpad/c8-llm/reprise/avant/`, `r1/`, `r2/`. Numérotation : « `lecon-NN` qK » est celle de
`mesure-lexique-qcm` (1 à 3 par leçon) ; « bilan qK » est celle de la contre-relecture (0 à 11).

| indice | avant | après | commande |
|---|---:|---:|---|
| la plus longue | 25,0 % | 25,0 % | `node tools/mesure-biais-qcm.js --seul=llm` |
| pire des 44 stratégies | **29,2 %** (la plus dense, 14 questions) | **27,1 %** (la plus dense, 13 questions) | id. |
| ECARTER la plus dense | 23,6 % | 24,3 % | id. |
| le mot technique exclusif / ECARTER | 26,9 % / 20,3 % (tranche 27 questions) | 25,7 % / 21,5 % (tranche 24) | id. |
| l'attaque unique | 26,6 % (1 question, rendement 100 % : bilan q1, « L'aléatoire » seule sans « La ») | 25,0 % (ne tranche plus) | id. |
| l'écho de la question / ECARTER | 24,7 % / 24,7 % (bilan q5 : « exécute » dans l'option 1 seule ; bilan q11 : « faits » absent de l'option 2) | **25,0 % / 25,0 %** (ne tranche plus) | id. |
| la moins bavarde / ECARTER | 25,3 % / 24,3 % | 24,3 % / 24,3 % | id. |
| la plus détaillée, la seule qui nie, la barre oblique | 25,2 %, 25,2 %, 24,5 % (une question chacune) | 25,0 % (ne tranchent plus) | id. |
| lexique : exploitables / retournées / à mettre en forme | **9 / 7 / 9** | **0 / 0 / 0** | `node tools/mesure-lexique-qcm.js --liste=llm` |
| intrus lexical DÉFAUT direct / INVERSE | 23,4 % / 25,5 % (3 questions) | 25,0 % / 25,0 % | `node tools/mesure-mot-question.js llm` |
| tics de forme à un seul porteur (atelier) | 3 questions (`lecon-03` q1, `lecon-06` q1, bilan q11) | 0 | `scratchpad/c8-llm/sonde/atelier.js` |
| biais inverse (`--toutes`) | 0 alerte (pire 26,7 %) | 0 alerte (pire : mot technique exclusif 27,1 %, voir « ce qui reste ») | `node tools/mesure-biais-inverse.js --toutes llm` |
| mots fétiches | 0 alerte (`réponse` 28,0 % ECARTER, juste sous le seuil) | 0 alerte (`réponse`, `modèle` 27,8 % ; `chaque` 27,6 %) | `node tools/mesure-mot-fetiche.js llm` |
| tics de lot | 0 | 0 | `node tools/mesure-tics-lot.js llm` |
| `--lots`, `--lots=3` | aucune fenêtre `llm` | aucune fenêtre `llm` | `node tools/mesure-biais-qcm.js --lots` |
| rangs de la bonne réponse | 12 / 12 / 12 / 12 | 12 / 12 / 12 / 12 | `node tools/plan-rangs-qcm.js llm` |
| explications orphelines | 0 | 0 (6 cas indicatifs, les mêmes) | `node tools/mesure-explain-orpheline.js --depuis=8d163bf --seul=llm` |
| intouchable | 3 atteintes, toutes de la contre-relecture | **les mêmes 3**, aucune de la reprise | `node tools/mesure-qcm-intouchable.js llm 8d163bf` |

Les trois atteintes déclarées (contre-relecture) : bonne réponse du bilan q1 (« basse = » →
« basse ≈ déterministe », prouvée par le rejeu de la température) et énoncés du bilan q3 et q5.

### Les retouches (15 écritures, 14 options, 14 questions, 2 commits)

**`cc0b866b` — lexique et densité (10 options).** À chaque fois, la thèse fausse posée par la
contre-relecture est gardée ; seuls des mots changent :

| question | avant (contre-relecture) | après | ce qui est refermé |
|---|---|---|---|
| `lecon-07` q1 opt 3 | une clé par **utilisateur** … le contrat du serveur | une clé par **client** … le contrat **d'usage** du serveur | k 3 → 2 (« utilisateur » absent de la page), mot long exclusif |
| `lecon-07` q2 opt 1 | réponses plus **variées** et osées | réponses plus **variables** et osées | k 1 → 0 ; un mot long exclusif rendu à l'option, comme avant |
| `lecon-07` q3 opt 3 | (copier, coller, sauter les tests, livrer) | (copier, coller, sauter les tests, **laisser les erreurs**, livrer) — version finale du 2ᵉ commit | la bonne n'y est plus seule la plus dense (4,91 > 4,84) ; cinq virgules comme les trois autres (« la plus détaillée ») |
| `lecon-10` q3 opt 3 | (performance **supérieure**) … doubler max_tokens au premier échec **serveur** | (performance **énorme**) … doubler max_tokens au premier échec **fournisseur** | k 2 → 1 ; densité 6,07 > 6,00 (la bonne ne devient pas la plus dense) ; deux mots longs exclusifs comme les trois autres |
| bilan q0 opt 1 | **Retrouver** le fait le plus probable | **Renvoyer** le fait **stocké** le plus probable | w 2 → 3 ; plus de mot long exclusif (« retrouver ») |
| bilan q1 opt 3 | **La tarification du token** (basse = réductions) | **Le système de tarification** (basse = réductions) | w 2 → 3 ; l'attaque unique (« L'aléatoire » seule face à trois « La ») |
| bilan q3 opt 1 | tout message **ré-entraîne** ses poids | **l'historique forme** ses poids (« former » = entraîner) | k 1 → 0 ; « historique » de nouveau partagé avec la bonne (mot exclusif) |
| bilan q5 opt 1 | (il **exécute lui-même** l'outil) | (il **lance seulement** l'outil **fourni**) | k 3 → 2 ; écho de l'énoncé (« exécute »), « seulement » dans trois options sur quatre (intrus, absolus) |
| bilan q7 opt 3 | lever **toute** limite **d'étapes** | lever **la** limite **des actions de chaque boucle** | w 5 → 7 ; « étapes » dans trois options (intrus DÉFAUT) |
| bilan q11 opt 2 | (**un ton plus ferme**) | (**réclamer les faits**) | k 1 → 2, w 3 → 4 ; « faits » de nouveau dans les quatre options (intrus, écho) ; plus de parenthèse ouverte par un article dans une seule option |

**`dac5d6ed` — cinq signaux d'une seule question, rouverts eux aussi par la contre-relecture**
(sous les seuils des outils, mais chacun désignait une option sur sa question) :

| question | avant | après | ce qui est refermé |
|---|---|---|---|
| `lecon-03` q1 opt 3 | (réponses passées du LLM **devenues** inutiles) | (**les** réponses passées du LLM **restent** inutiles) | parenthèse à article et verbe conjugué portés par la seule option 1 |
| `lecon-06` q1 opt 3 | (accès total), **et** il suit | (accès total), **mais** il suit | virgule avant « et » dans une seule option |
| `lecon-07` q3 opt 3 | … sauter les tests, **brancher**, livrer (mon 1ᵉʳ commit) | … sauter les tests, **laisser les erreurs**, livrer | « brancher » sans complément refaisait le défaut que la contre-relecture avait relevé (« couper, sauter » : verbes nus pour imiter la liste de la bonne) |
| `lecon-08` q2 opt 3 | aux tests **A/B** de la production | aux tests **en ligne** de la production | barre oblique seule ; la thèse de la contre-relecture (le juge réservé à l'évaluation en ligne, alors qu'il note le jeu figé hors ligne) est gardée |
| bilan q9 opt 1 | **vérifier** chaque citation **de la réponse** | **refuser** chaque citation **non vérifiable** | « la seule qui nie » (négation dans trois options) ; le mot exclusif désigne de nouveau ce distracteur (bilan q9 : 0,5 → 0 pour la stratégie directe). Pas de contradiction : on ne « vérifie » plus l'invérifiable (objection de la contre-relecture) |

**Retouches de sens : aucune.** Points qu'une relecture experte doit regarder : « il lance
seulement l'outil fourni » (lancer = exécuter, c'est la thèse fausse ; la bonne dit « demande
seulement l'appel ») ; « réclamer les faits » (l'autorité du prompt ne crée pas de savoir, thèse
de la contre-relecture ; ce n'est pas fournir les faits) ; « une clé par client » (lu « client =
navigateur » ou « client = utilisateur final », la thèse reste fausse) ; « performance énorme » et
« échec fournisseur » sont d'un registre un peu familier. **Rien n'a été exécuté** : aucune
retouche ne touche un calcul, un code ou un fait vérifiable par exécution.

Méthode : chaque lot simulé en mémoire (`scratchpad/c8-llm/sonde/atelier.js`, `LLM_DIR` ajouté
pour mesurer l'état d'avant la contre-relecture, exporté de `d3a48ace` dans
`scratchpad/c8-llm/reprise/avant-cr/`), posé par `pose2.js` (refuse la bonne réponse, reparse
chaque bloc), vérifié par `controle.js` contre `HEAD`, puis par les outils officiels. Le
vocabulaire de chaque page a été lu mot à mot (`vocab.js`, `k.js`) : « exiger », « appelé »,
« ré-entraîne », « modifie », « montant », « doubler », « utilisateur » ont été écartés parce
qu'ils changeaient `k`.

### Ce qui reste

- **La plus dense à 27,1 % (13 questions sur 48)**, comme avant la contre-relecture : sous les
  27,5 % de la cible, mais à UNE question près ; toute retouche future qui rend une bonne réponse
  seule la plus dense la fait passer à 29,2 %. Les plus petites marges : `lecon-12` q3 du quiz
  (bonne 4,87 contre 4,70), `lecon-09` q2 (4,63 contre 4,43), `lecon-12` q2 du quiz (5,50 contre
  5,19), `lecon-07` q2 (5,22 contre 4,90).
- **Mot technique exclusif** : 25,7 % en directe, et 27,1 % dans le sens INVERSE de
  `mesure-biais-inverse --toutes` (3 désignations uniques de la bonne contre 13 de distracteurs ;
  26,7 % avec 3 contre 12 avant la contre-relecture). La 13ᵉ est `lecon-04` q2 (« Le
  fournisseur », seul mot de 9 lettres, posé par la contre-relecture). Restent aussi, de la
  contre-relecture, quatre désignations multiples qui contiennent la bonne (`lecon-01` q3,
  `lecon-02` q1 et q3, `lecon-08` q3) : non touchées, la mission était bornée et tout est sous
  les seuils ; les fermer ferait monter l'inverse.
- Mots fétiches `réponse` et `modèle` à 27,8 %, `chaque` à 27,6 % (seuil 28 %) ; tic « message
  système » à 27,1 % (d'avant).
- Index dérivés et pages dérivées : comme au § 6 (à régénérer à la fusion).

### Vérifications de la reprise (sur `dac5d6ed`)

- `node tools/verif-html.js` : aucun problème ; `node tools/verif-contenu.js --cas-reel
  --cours=llm` : 12 « Cas réel » sur 12 conformes (aucun encadré touché) ; blocs JSON des 12
  leçons valides, 0 CR, 0 BOM (`scratchpad/c8-llm/reprise/cr.js`).
- `node tools/verif.js --rapide` (54 vérificateurs, 692 s, `--mutations` jamais lancé ; sortie :
  `scratchpad/c8-llm/reprise/verif-rapide.txt`) : **les six mêmes étapes signalées qu'au § 8**,
  aucune autre. `donnees` compte maintenant 8 erreurs I18 au lieu de 6 : les deux en plus sont
  les deux énoncés du bilan précisés par la contre-relecture (« Une API de LLM, entre deux
  appels… », « qui exécute la fonction ? »), encore sous leur ancienne forme dans
  `quiz-index.js` — index à régénérer à la fusion. `etude-6` : même ligne qu'au § 8 (taille des
  blocs de code, que la solution de l'exercice 2 de `lecon-06` corrigée par la contre-relecture
  a encore changée) ; la reprise n'a touché aucun bloc de code.
