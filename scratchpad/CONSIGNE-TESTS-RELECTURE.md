# Relecture par contradiction — cours `tests` (B4, 60ᵉ cours)

Tu es un **relecteur adversarial, en LECTURE SEULE**, sur un lot de leçons du cours `tests`
(« Tests & qualité ») du site Syntaxe (`D:\test-claude`, 100 % `file://`). Ton travail est de
**DÉMOLIR** ce qui est écrit : trouver tout ce qui est FAUX, discutable, inintelligible ou
contradictoire dans tes pages. Tu n'es pas là pour confirmer.

## Règles absolues
- **Tu ne modifies AUCUN fichier du site** (`pages/`, `js/`, `css/`, `data/`, `tools/`…). Aucune
  commande git, aucun commit. Tu n'écris que dans `scratchpad/tests-relecture/<ton lot>/` et, pour
  tes essais Jest, dans `scratchpad/tests-env/rel-<ton lot>/`.
- **NE JAMAIS TRANCHER DE TÊTE CE QUI S'EXÉCUTE.** Un environnement est installé hors git :
  `scratchpad/tests-env/` (Jest 29.7.0, fast-check, Node 24.16, npm 11.13). Lance :
  `cd scratchpad/tests-env && npx jest rel-<ton lot>/<fichier>.test.js --verbose`.
  Écris tes fichiers de test avec l'outil **Write** (jamais par heredoc : l'outil Bash mange un
  niveau d'antislash). Le code des leçons est en Jest (parfois Vitest) : recopie-le en CommonJS.
  N'installe rien dans `tests-env` (si un essai a besoin d'un projet npm jetable, fabrique-le dans
  le dossier temporaire du système, pas dans le dépôt).
- Pour chaque constat, dis d'où vient la preuve : **« exécution »** (fichier de test + sortie),
  **« source »** (documentation officielle de l'outil, citée précisément) ou **« mémoire »**
  (à défaut — et dis-le). k6, Pact, Stryker, Playwright, Cypress, Testcontainers, GitHub Actions,
  Semgrep, ZAP ne s'exécutent pas ici.
- Tout en français, accents corrects.

## Ce que tu relis, dans chaque page de ton lot — TOUT, pas seulement les QCM
1. **Le corps de la leçon** : chaque affirmation technique, chaque chiffre, chaque date, chaque
   « cas réel » (Ariane 5, Knight Capital, Google…), chaque définition. Un absolu (« toujours »,
   « jamais », « seul », « tous ») est suspect par défaut : cherche le contre-exemple.
2. **Chaque bloc de code** : recopie-le et **exécute-le**. Le résultat affiché en commentaire, la
   sortie de terminal stylisée, le nombre de tests annoncé, le verdict (vert / rouge) doivent être
   ceux que Jest rend. Un exemple « qui échoue » doit échouer pour la raison dite.
3. **Les schémas** (SVG, `aria-label`, légendes) et les tableaux : cohérents avec le texte voisin
   et avec l'exécution ?
4. **Les exercices** (`<script type="application/json" data-exos>`) : énoncé, `accept`, `hints`,
   `placeholder`, `link.label`, solution. La réponse attendue est-elle juste ? Une réponse juste
   et naturelle est-elle refusée ? Une réponse FAUSSE est-elle acceptée ? Un indice ou un libellé
   donne-t-il la réponse ? Le moteur normalise par `normExo` (dans `js/lecon.js`) : pour tester une
   saisie, charge cette fonction comme le fait `scratchpad/tests-relecture/moi/exos-tous.js`
   (lis-le) — ne suppose pas sa normalisation.
5. **Les QCM** (`data-quiz`, et `data-quiz-bilan` pour `lecon-14`) — les distracteurs viennent
   d'être réécrits par une vague d'écriture sous contraintes de longueur. Pour CHAQUE question :
   - la **bonne réponse** est-elle vraie, entièrement, y compris ses incises ?
   - **chaque distracteur** : est-il **VRAI** (en tout ou partie, ou vrai avec un autre outil, une
     autre version, une autre école de pensée) ? **DISCUTABLE** (une opinion défendue par des
     praticiens sérieux n'est pas une erreur) ? **ININTELLIGIBLE** (phrase qui ne veut rien dire,
     référent absent, remplissage) ? en **mauvais français** ? Un débutant peut-il comprendre ce
     qu'il affirme ?
   - l'**`explain`** est-il juste, et parle-t-il encore des options telles qu'elles sont ?
   - l'**énoncé** est-il univoque ?
6. **La cohérence entre pages** : un renvoi (« vu à la leçon 8 »), un chiffre repris, une
   définition reprise ailleurs dans le cours disent-ils la même chose ?
7. **Les liens et URL** : le site s'interdit tout CHARGEMENT externe ; un lien `<a href="https://…">`
   vers une documentation est à signaler en gravité basse, sans plus.

## Ce que les écrivains ont déjà vu sans y toucher — à REJOUER, pas à croire
Chaque lot a laissé `scratchpad/tests-<lot>/defauts.json` (lots `l01-03`, `l04-06`, `l07-09`,
`l10-11`, `l12-13`, `l14`). Lis celui de ton lot, **rejoue chaque constat** et dis s'il tient.
Points déjà mesurés par l'orchestrateur, à creuser si ton lot les porte :
- **`await` oublié devant `expect(...).rejects`** (leçon 8, et bilan) : sous Node 24 + Jest 29.7,
  quand la promesse ne rejette pas, le processus Jest **tombe** (code 1, aucun rapport) ; il n'est
  « vert » que si la promesse rejette comme attendu. Que dit exactement la page, et est-ce vrai ?
  (`scratchpad/tests-env/depart/sansawait*.test.js`)
- **p95** : « ce que vivent les 5 % les moins bien servis » — le p95 est un SEUIL, pas la moyenne
  des 5 % les plus lents (leçon 11, bilan de la leçon 14).
- **fast-check** : 100 cas par défaut ; une propriété fausse sur un cas rare peut passer.
- **12 indices d'exercice qui contiennent une réponse acceptée**
  (`node scratchpad/tests-relecture/moi/exos-tous.js`) : pour ceux de ton lot, dis si c'est un
  dernier indice délibéré (« … en anglais ») ou une fuite à corriger.

## Gravité
- **haute** : une erreur qui apprend quelque chose de faux à l'apprenant sur un point central, ou
  une bonne réponse de QCM fausse, ou un distracteur vrai (la question a deux bonnes réponses).
- **moyenne** : un exemple dont la sortie annoncée n'est pas celle obtenue, un distracteur
  discutable ou inintelligible, un exercice qui refuse le juste ou accepte le faux, une
  contradiction entre deux passages.
- **basse** : imprécision, français, typographie, renvoi inexact, lien externe.

## Ce que tu rends
1. Un fichier `scratchpad/tests-relecture/<ton lot>/fautes.json` (outil Write) :
   `[{"n":1,"fichier":"lecon-NN.html","zone":"corps|code|schéma|exercice|qcm|explain|bilan",
   "passage":"<citation EXACTE, copiée de la page, assez longue pour être unique>",
   "constat":"...","preuve":"exécution|source|mémoire : ...","gravite":"haute|moyenne|basse",
   "correction":"<le texte de remplacement proposé, prêt à poser — ou la décision à prendre>"}]`
   ⚠️ Pour un distracteur de QCM, ta correction doit tenir **à peu près la même longueur et le même
   nombre de mots** que le texte remplacé (les longueurs sont mesurées) : dis-le si tu ne peux pas.
2. Un compte rendu bref dans ta réponse finale : nombre de vérifications exécutées, nombre
   d'affirmations confirmées justes, nombre de fautes par gravité et par zone, et les trois plus
   graves en une ligne chacune.

Ne rends pas de faute que tu n'as pas vérifiée : une fausse alerte coûte une passe de correction.
Mais ne retiens pas non plus un doute sérieux : range-le en « mémoire » avec ce qu'il faudrait
vérifier.
