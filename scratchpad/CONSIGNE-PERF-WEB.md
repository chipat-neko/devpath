# Consigne d'écriture — les QCM du cours `perf-web` (B4, 54ᵉ cours)

Préparée le 2026-09-30, à la clôture du 53ᵉ cours (`dart`). Mesures de départ archivées dans
`scratchpad/perf-web-depart/` (sorties brutes des outils). Sondes prêtes dans
`scratchpad/perf-web-sonde/` (`controle.js` v2, `simule.js`, `essai.js`, `pose.js`, `rempl.js`,
`k.js`, `dosage.js`, `chaque.js`), copiées de `dart-sonde` et pointées sur `pages/perf-web/`.

Tu écris les **distracteurs** d'un lot de questions du cours `perf-web` du site Syntaxe
(`D:\test-claude`, 100 % `file://`, aucun serveur, aucun build, aucune dépendance installée).
Le cours s'intitule « Performance web » : Web Vitals (LCP, CLS, INP), chargement, chemin critique
du rendu, images et polices, cache et réseau, mesure labo/terrain, fluidité (60 fps, tâches
longues), Web Workers, outils (DevTools, Lighthouse, WebPageTest), stratégies de rendu
(CSR, SSR, SSG, hydratation), SEO technique et données structurées, puis un projet.

**Un seul agent écrit dans un fichier donné.** Tu ne touches qu'aux leçons de TON lot, tu ne fais
**aucun commit** et **aucune commande git** (pas même en lecture). Pour annuler, ré-écris un patch.

Les QCM sont dans `pages/perf-web/lecon-NN.html`, dans un bloc
`<script type="application/json" data-quiz>` (et `data-quiz-bilan` pour `lecon-15`, qui porte
**12 questions de bilan** en plus de ses 3). Schéma :
`{"q": "...", "a": ["...", "...", "...", "..."], "correct": 0, "explain": "..."}`.

## ⚠️ ÉCRIRE PAR FICHIER DE PATCHS, JAMAIS AVEC L'OUTIL D'ÉDITION

Leçon des 52ᵉ et 53ᵉ cours : c'est ce qui supprime les pièges du CRLF et du JSON cassé. Écris tes
patchs dans `scratchpad/perf-web-<ton lot>/patchs.json` (outil Write) :
`[{"fichier":"lecon-NN.html","q":<n° dans le fichier, 1-based, bilan compris>,"opt":<index 0-based>,"texte":"..."}]`
Aperçu : `node scratchpad/perf-web-sonde/pose.js <patchs>` ; écriture : `--ecrire`. `pose.js` refuse
de toucher la bonne réponse et reparse chaque bloc JSON. **Jamais de heredoc Bash** pour un fichier
qui contient un antislash : l'outil Bash en mange un niveau.

---

## ⚠️⚠️⚠️ LA RÈGLE QUI PRIME SUR TOUTES LES MESURES

> **UN DISTRACTEUR EST UNE PHRASE FRANÇAISE QUI ÉNONCE UNE THÈSE FAUSSE, PRÉCISE ET PLAUSIBLE.**
> Si tu ne peux pas dire en une phrase *pourquoi c'est faux*, ce n'est pas un distracteur.

Au 53ᵉ cours (`dart`), après une vague où toutes les mesures étaient vertes, la relecture a encore
trouvé **20 distracteurs inintelligibles, 4 fautes de français et 3 distracteurs VRAIS** — des queues de phrase ajoutées
pour tenir un compte de caractères, des parenthèses qui n'énoncent rien (« Optional<String> (null) »).

Test de recevabilité, pour **CHAQUE** distracteur :
1. **Je peux nommer l'erreur en une phrase.**
2. **Chaque proposition a un référent** (pas de « y », de « eux », de « cette technique » orphelins).
3. **Un débutant crédule pourrait le cocher.**
4. **Aucune parenthèse ni queue de phrase de remplissage.**
5. **Aucune conjonction sans logique** (« exige ainsi », « plutôt » sans comparaison).

**PRÉFÈRE UNE ERREUR CLASSIQUE ET NETTE À UNE ÉLÉGANCE MESURÉE.**

## CE QUI SE PROUVE DANS CE COURS

Le cours parle surtout du **navigateur** : il ne s'exécute pas tout entier, mais une partie se prouve.
- **Le JavaScript pur** (fonctions, boucles, `setTimeout`, `Promise`, `postMessage` simulé,
  calculs de budgets, de moyennes, de percentiles) : `node <fichier.js>`. Tes scripts vont dans
  `scratchpad/perf-web-<ton lot>/`. **Tout chiffre que tu écris dans un distracteur ou que tu
  contestes dans une bonne réponse se CALCULE, il ne s'écrit pas de tête.**
- **Les seuils et les règles des normes** (seuils des Web Vitals, sémantique de `Cache-Control`,
  `async`/`defer`, `preload`/`prefetch`, `loading="lazy"`, `font-display`) : **ta page est la
  référence**. Ne fonde une fausseté sur un seuil, une date ou un nom de métrique QUE si TA page
  l'établit. Si ta page et ta mémoire divergent, **tu ne corriges rien : tu le remontes**, avec la
  ligne de la page.
- Si une bonne réponse te semble fausse, tu ne la touches pas : tu la remontes avec la preuve.

**Erreurs classiques de débutant en performance web** (n'utilise que celles que TA leçon établit ;
⚠️ cette table est écrite de mémoire — vérifie chaque ligne contre ta page avant de t'en servir) :

| croyance fausse | ce qui est vrai |
|---|---|
| `async` et `defer` sont équivalents | `defer` garde l'ordre et s'exécute après l'analyse du HTML ; `async` s'exécute dès la fin du téléchargement, sans ordre garanti |
| `loading="lazy"` sur l'image principale accélère le LCP | il la retarde : le chargement différé est pour les images sous la ligne de flottaison |
| `preload` et `prefetch` sont synonymes | `preload` : ressource de la page courante, priorité haute ; `prefetch` : navigation future, priorité basse |
| le score Lighthouse est l'expérience des utilisateurs | c'est une mesure de LABO (conditions simulées) ; le TERRAIN (CrUX, RUM) mesure les vrais visiteurs |
| le CLS se mesure en secondes | c'est un score sans unité (décalages cumulés) |
| `Cache-Control: no-cache` interdit la mise en cache | `no-cache` impose de revalider avant usage ; c'est `no-store` qui interdit de stocker |
| un Web Worker peut modifier le DOM | il n'a pas accès au DOM ; il communique par messages (`postMessage`) |
| le SSR supprime le coût du JavaScript côté client | l'hydratation exécute le JavaScript côté client ; la page peut s'afficher vite et répondre tard |
| `font-display: swap` cache le texte pendant le chargement de la police | il affiche tout de suite une police de secours, puis bascule |
| compresser en gzip ou Brotli une image JPEG divise son poids | un JPEG est déjà compressé : le gain est négligeable |

---

## Pourquoi ce travail

Un apprenant qui ne comprend rien réussit **95,6 %** des QCM de `perf-web` en cochant l'option la
plus longue. Relevé du 2026-09-30, `node tools/mesure-biais-qcm.js --seul=perf-web` (57 questions) :

| indice | réussite | couverture | rendement |
|---|---:|---:|---:|
| **la plus longue** | **95,6 %** | 98,2 % | 96,4 % |
| la plus détaillée | **79,4 %** | 70,2 % | **100,0 %** |
| le mot technique exclusif | **75,9 %** | 64,9 % | 94,6 % |
| RESTREINDRE à la ponctuation forte | **57,9 %** | 45,6 % | 96,2 % |
| RESTREINDRE à la parenthèse | **55,7 %** | 40,4 % | **100,0 %** |
| l'incise entre parenthèses | **54,8 %** | 42,1 % | 95,8 % |
| ECARTER la moins bavarde | 45,9 % | 12,3 % | 85,7 % |
| RESTREINDRE aux deux-points | 43,4 % | 26,3 % | 93,3 % |
| la seule qui nie | 37,0 % | 31,6 % | 61,1 % |
| la seule avec un point-virgule | 36,8 % | 15,8 % | **100,0 %** |
| l'écho de la question | 36,1 % | 29,8 % | 52,9 % |
| la seule avec un tiret | 28,9 % | 5,3 % | **100,0 %** |

## Le travail est de l'ALLONGEMENT

| | |
|---:|---:|
| longueur moyenne d'une bonne réponse | **102,4 caractères** |
| longueur moyenne d'un distracteur | **30,5 caractères** |
| **rapport** | **3,36** (`dart` : 4,77 ; `perl` : 4,01 ; `vue` : 3,68) |

`node tools/plan-rangs-qcm.js perf-web` demande **10 126 caractères** sur **55 questions sur 57**.
Rangs actuels **55 / 1 / 1 / 0**, cible **15 / 14 / 14 / 14**. **Suis EXACTEMENT** le rang visé et
la bande de caractères de chacune de tes options. Donne au distracteur la MÊME STRUCTURE que la bonne
réponse : la réponse fausse, PUIS sa justification fausse mais cohérente.

---

## Ce que tu dois tenir, dans l'ordre d'importance

### (1) LA LONGUEUR ET LES RANGS
`node tools/mesure-biais-inverse.js --toutes perf-web` rend **4 alertes** au départ (la QUATRIÈME
plus longue 32,7 %, la DEUXIÈME 31,7 %, la TROISIÈME 31,3 %, la moins bavarde 29,2 %). **Le rang en
MOTS de la bonne réponse doit valoir son rang en CARACTÈRES.** Quand la bonne réponse est la plus
courte, qu'**un** de ses distracteurs ait autant de mots qu'elle (égalité) plutôt que tous davantage.

### (2) LA PONCTUATION — et L'UNION
Par marque (`;`, `:`, parenthèse, tiret, barre oblique, guillemets, virgule décimale), **les quatre
options la portent, ou aucune** ; vérifie aussi l'UNION (« PONCTUATION FORTE » = `:` ou `;` ou tiret,
**57,9 %**, rendement 96,2 %). ⚠️ Dans ce cours, `2,5 s`, `0,1`, `200 ms` portent une virgule
décimale : c'est une marque comme une autre.

### (3) LES DIX TICS DE LOT — connus AVANT d'écrire
`node tools/mesure-tics-lot.js perf-web --exemples` :

| tic | bonnes / distracteurs | tranchées | rendement | gain au cours |
|---|---|---:|---:|---:|
| **deux-points médian** | **15 / 2** | 15 | 93,3 % | **43,0 %** |
| **glose finale entre parenthèses** | **12 / 1** | 13 | 92,3 % | 40,4 % |
| **point-virgule médian** | **9 / 0** | 9 | **100,0 %** | 36,8 % |
| « le navigateur » | 5 / 1 | 6 | 83,3 % | 31,1 % |
| « le contenu » | 6 / 2 | 6 | 83,3 % | 31,1 % |
| « une fois » | 4 / 0 | 4 | 100,0 % | 30,3 % |
| adverbe de reprise (alors / ensuite / puis) | 3 / 1 | 4 | 75,0 % | 28,5 % |
| « le lcp » | 3 / 1 | 4 | 75,0 % | 28,5 % |
| « les moteurs » | 3 / 1 | 4 | 75,0 % | 28,5 % |
| « et le » | 4 / 2 | 4 | 75,0 % | 28,5 % |

Le gabarit des bonnes réponses est « réponse : explication » ou « réponse (glose) » : donne-le à tes
distracteurs, avec un contenu qui dit quelque chose.

### (4) ⚠️ LES MOTS FÉTICHES — 3 ALERTES DÈS LE DÉPART
`contenu` (8 bonnes / 2 distracteurs, RESTREINDRE **33,8 %**), `navigateur` (5 / 3, **30,3 %**),
`image` (5 / 7, **28,9 %**). **Pose `contenu` et `navigateur` dans des distracteurs**, là où ils ont un
sens. **N'emploie pas « chaque », « chaîne » ni « valeur »** pour allonger : aux 50ᵉ à 52ᵉ cours, la
correction a fabriqué son propre mot fétiche avec eux.

### (5) LE MOT TECHNIQUE EXCLUSIF (75,9 %) ET L'INTRUS LEXICAL
Par mot de 9 lettres et plus : les quatre options le portent, ou aucune. `node tools/mesure-mot-question.js
perf-web --plan` donne la liste exacte, question par question. Intrus EXCÈS **27,2 %** (3 questions
sûres), DÉFAUT **27,9 %** (2) au départ.

### (6) L'ÉCHO DE L'ÉNONCÉ (36,1 %)
Les quatre options portent le **même nombre** de mots repris de l'énoncé. Les sigles courts passent
sous le radar : `LCP`, `CLS`, `INP`, `TTFB`, `CDN`, `SSR`, `CSR`, `SSG`, `DOM`, `CSS` — compte-les.

### (7) L'INDICE LEXICAL — 54 exploitables, 32 retournées, 55 à mettre en forme sur 57
`node tools/mesure-lexique-qcm.js --liste=perf-web`. **Règle du `k`** : les QUATRE options portent le
même nombre de mots de 6+ lettres absents du corps de la page — ⚠️ **compté en OCCURRENCES** : un mot
étranger répété compte deux fois. **Règle du `w`** : quand `k > 0`, les quatre portent aussi le même
nombre de mots de 6+ lettres. Un substitut doit être **présent dans la page** (jeton entier).
Cible : 0 / 0 / 0.

### (8) LES ABSOLUS — 0, 2 ou 3 porteurs par question, jamais 1
### (9) TROIS ERREURS DIFFÉRENTES, jamais le miroir de la bonne réponse
### (10) PAS DE MODE D'EMPLOI DANGEREUX (« désactiver le cache en production pour toujours servir frais »)

---

## Les contraintes de non-régression
1. **La bonne réponse, `q`, `correct` et `explain` sont INTOUCHABLES.** Contrôle :
   `node tools/mesure-qcm-intouchable.js perf-web <sha>`.
2. **Aucun distracteur ne doit devenir vrai.**
3. **JSON valide, sans BOM, sans CRLF** — garanti si tu passes par `pose.js`.
4. **Aucune URL externe.**

## L'ORDRE DE TRAVAIL
1. Lis **TES** leçons en entier — le corps établit ce que tu as le droit d'écrire.
2. `node tools/plan-rangs-qcm.js perf-web` : rang visé et bande de chaque option.
3. Pour chaque question, écris les **trois erreurs** en une phrase chacune, **avant** de rédiger.
4. Rédige à la longueur imposée ; étoffe l'erreur (son mécanisme faux, sa conséquence fausse),
   jamais par du remplissage.
5. Relis les quatre options **à voix haute**.
6. Pose, puis relance les contrôles sur TON lot et cite les chiffres.

```
node tools/plan-rangs-qcm.js perf-web
node tools/mesure-mot-question.js perf-web --plan
node tools/mesure-biais-qcm.js --seul=perf-web
node tools/mesure-biais-inverse.js --toutes perf-web
node tools/mesure-lexique-qcm.js --liste=perf-web
node tools/mesure-mot-fetiche.js perf-web
node tools/mesure-tics-lot.js perf-web --exemples
node scratchpad/perf-web-sonde/essai.js "<fragment unique de l'énoncé>"
```

---

## CE QUE LES 52ᵉ ET 53ᵉ COURS ONT APPRIS À L'ORCHESTRATEUR

- **La relecture par contradiction doit lire les CORPS** : au 53ᵉ cours elle a trouvé **51 fautes
  de corps sur 92** (dont 13 messages d'erreur recopiés de mémoire et un exemple qui enseignait le
  contraire du compilateur). Aucun des 46 outils ne lit un corps. Pour `perf-web`, faire CALCULER
  chaque chiffre des corps (budgets, pourcentages, conversions ko/Mo, durées de trame).
- **Relancer `mesure-mot-fetiche` APRÈS la relecture** : ses réécritures fabriquent un mot fétiche
  que `controle.js` (stratégies par question) ne voit pas.
- **Une correction de CORPS change le vocabulaire de la page** et peut rouvrir `k` : relancer
  `controle.js --ref=<sha de la vague>` après toute correction de corps.
- **`build-index.js --write --fresh --only=quiz,flashcards,search,searchlite,antiseches,pieges`**.
- **Dosage calculé** (`dosage.js`) : combien de points retirer, puis quelles questions rapportent le
  plus. Raccourcir un distracteur en ôtant des mots courts le rend PLUS DENSE : remplacer, pas ôter.
- Clôture : cliquets refigés (`verif-qcm-biais.js --ecrire`, `traite: true` à la main ;
  `verif-qcm-lexique.js --ecrire`), `tools/doc/gen.js`, `tools/etudes/inconnu/assembler.js` et
  `tools/etudes/recherche/assembler.js`, puis index, jusqu'au point fixe (vérifié par empreinte).
