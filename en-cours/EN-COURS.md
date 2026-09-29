# En cours — où en est Syntaxe, et ce qu'il reste à faire

*État mesuré le 2026-09-29. Les chiffres vivants (cases cochées, dernière passe) sont réécrits
chaque heure dans [`ETAT-AUTONOMIE.md`](ETAT-AUTONOMIE.md), juste à côté.*

---

## 1. Comment le travail avance

| | |
|---|---|
| **Mode** | **Autonomie totale** (décision de Noah du 2026-09-29) : la tâche planifiée Windows `Syntaxe-Autonomie` lance une passe, et le wrapper replanifie la suivante 5 minutes après la fin. Aucune validation n'est demandée entre les passes. |
| **Garde-fou de quota** | Pause automatique à **99 %** du quota hebdomadaire (`.autonomie/seuil-hebdo.txt`), reprise seule après la remise à zéro. Une limite de session (fenêtre de 5 h) décale simplement le réveil suivant. |
| **Surveillance** | Tâche `Syntaxe-Sante`, chaque heure : compare le journal aux plans, réécrit `ETAT-AUTONOMIE.md`, relance une autonomie arrêtée **anormalement**. Un arrêt volontaire n'est jamais « réparé ». |
| **Modèle** | Opus 5.5 (`claude-opus-5-5`, contexte natif d'un million de jetons), effort `high`, mot-clé **ultracode** dans le prompt (orchestration multi-agents autorisée, au plus 6 agents par workflow). |
| **Wrapper** | `.autonomie/autonomie.ps1` : il choisit tout seul le plan courant dans la liste `$CHAINE`. |

**Arrêter** : `powershell -File .autonomie\arret.ps1` (ou créer `.autonomie/arret-volontaire.txt`).
**Reprendre** : supprimer `.autonomie/arret-volontaire.txt`, puis réactiver la tâche
`Syntaxe-Autonomie` avec un déclencheur proche.
**Quota** : `node tools/usage-anthropic.js etat` (hebdomadaire et fenêtre de 5 h).

---

## 2. Où en est la chaîne de chantiers

| Plan (`docs/chantiers/`) | État |
|---|---|
| CHANTIER-V12 — les 42 points de l'inventaire | ✅ 31/31 |
| CHANTIER-V13 — le contenu qui manque | ✅ 32/32 |
| CHANTIER-V14 — faire écrire du code, et le corriger | ✅ 38/38 |
| CHANTIER-V15 — comprendre ce qu'on ne voit pas | ✅ 32/32 |
| CHANTIER-V17 — les garde-fous qui mentent | ✅ 80/80 |
| **CHANTIER-V16 — consolider ce que les quatre chantiers ont laissé derrière** | 🟠 **8/22 — plan courant** |

Quand la dernière case du V16 est cochée, le wrapper lance une **passe de sécurité** (rapport dans
`docs/audits/VERIF-FINALE.md`) puis s'éteint si le verdict est VERT.

---

## 3. Le point en cours : B4, les QCM trop faciles à deviner

**Le problème.** Sur tout le site, la bonne réponse d'un QCM était très souvent **la plus longue** :
en choisissant toujours la plus longue, on réussissait **89,6 %** des questions sans rien savoir.
B4 réécrit les **mauvaises réponses** (les distracteurs) cours par cours, pour que plus aucun
indice de forme ne désigne la bonne. La bonne réponse et son explication sont **intouchables**.

**La cible par cours** : « la plus longue » vers 25 % (le hasard sur quatre options), et **aucune
des 44 stratégies de devinette** mesurées par `tools/mesure-biais-qcm.js` nettement au-dessus.

**Le périmètre**, réduit par Noah le 2026-09-15 : **30 cours**, choisis par nocivité (66 % de la
nocivité restante). 19 cours sont **volontairement laissés de côté** : `cloud`, `reseaux`, `wasm`,
`ml`, `erlang`, `ada`, `llm`, `fortran`, `groovy`, `compilation`, `patterns`, `http`, `graphql`,
`kubernetes`, `cicd`, `markdown`, `formats`, `regex`, `vscode`.

### Avancement mesuré le 2026-09-29 (« la plus longue », depuis `js/quiz-index.js`)

| | Cours | Taux |
|---|---|---:|
| ✅ clos (11) | `pandas` 26,2 · `haskell` 25,8 · `crypto` 25,0 · `sass` 26,2 · `securite` 24,2 · `clojure` 25,8 · `powershell` 25,4 · `go` 25,8 · `elixir` 25,4 · `nosql` 26,3 · `julia` 25,4 | ~25 % |
| 🟠 **en cours** | **`vue`** (12ᵉ des 30, 51ᵉ cours du chantier) | 25,8 % |
| ⬜ à faire (18) | `perl` 91,7 · `dart` 91,7 · `perf-web` 94,7 · `lisp` 98,1 · `observabilite` 96,2 · `docker` 93,0 · `r` 85,7 · `bash` 94,6 · `tests` 93,0 · `pascal` 89,8 · `fsharp` 96,3 · `prolog` 96,3 · `linux` 94,3 · `vb` 88,1 · `objc` 94,4 · `api` 87,5 · `asm` 86,0 · `cobol` 98,0 | 86 à 98 % |

Soit **1 013 questions** dans les 18 cours restants.

### Ce qui reste sur `vue` (chiffré dans le plan, § « ÉTAT DU 51ᵉ COURS »)

« La plus longue » est déjà à 25,8 %, mais le **pire indice est encore à 28,6 %** :
- « la plus dense » 28,6 % — **2 bascules** suffisent (liste : `scratchpad/vue-sonde/densite.js`) ;
- tiret puis longueur 27,4 %, absolus 27,0 %, mot technique exclusif 27,0 %, glose finale 27,0 %,
  majuscule d'emphase 26,6 % ;
- lexique : 3 exploitables, 5 à mettre en forme (`node tools/mesure-lexique-qcm.js --liste=vue`) ;
- mot fétiche : 1 alerte (« chaque ») ;
- ~~une décision d'orchestrateur~~ **réglée le 2026-09-29 à 19:05** (commit `0cf006c`) : la bonne
  réponse de `vue/lecon-09` q2 enseignait la priorité `v-for`/`v-if` de **Vue 2** dans un cours
  Vue 3 ; l'autonomie l'a corrigée elle-même, en tant qu'orchestrateur.
- Les deux cliquets (`verif-qcm-biais`, `verif-qcm-lexique`) ne sont **pas encore refigés** : ils
  le seront à la clôture du cours. C'est pour cela que `verif.js --rapide` signale 5 étapes.

### Les leçons qui coûtent cher si on les oublie

Elles sont détaillées cours par cours dans le plan et dans `scratchpad/CONSIGNE-*.md` /
`scratchpad/REGLE-*.md` (versionnés). Les plus importantes :
- **Relire le texte rendu, pas seulement les mesures** : deux fois, 46 mesures étaient vertes sur
  des distracteurs qui ne voulaient plus rien dire (98 fautes trouvées sur `vue`).
- **Fermer un indice en rouvre souvent un autre** : surveiller les **44 stratégies à la fois**
  (`scratchpad/vue-sonde/controle.js` v2 les charge depuis l'outil), jamais une liste à la main.
- **Le dosage se calcule** : viser 25 %, pas 0 % — fermer un indice « à fond » le retourne.
- **Commiter chaque vague avant d'y toucher** : un lot non commité ne survit à rien.
- Un distracteur est **une phrase française qui énonce une thèse fausse, précise et plausible**.

---

## 4. Après B4 : les 13 autres cases du V16

| Case | Ce qu'il faut faire |
|---|---|
| **B5** | Contrôler que les QCM restent corrects (scores `syntaxe-quiz`, QCM bilan) ; régénérer `quiz-index.js` une fois, à la fin. |
| **C1** | Marques de fraîcheur sur `nodejs`, `typescript`, `vue`. |
| **C2** | Idem sur `graphql`, `sass`, `data-eng`. |
| **C3** | Idem sur les cours d'IA `ml`, `llm`, `dataviz`. |
| **C4** | Bilan de la fraîcheur, avec projection dans le temps (`--date=AAAA-MM-JJ`). |
| **D1** | Relier le visualiseur de pile d'appels aux leçons qui en parlent (table `TITRES_VISUALISEUR` de `js/lecon.js`) — réconcilier d'abord les deux mesures (41 contre 19/42). |
| **D2** | Même travail pour le décodeur d'erreurs et le bac à sable Git. |
| **E1** | Amener `sass/lecon-09.html` au standard (4 critères sous la médiane). |
| **E2** | Recalculer les durées annoncées des 13 cours hors du facteur 2 (clé `lessonDurations` ; piège `javascript` ≠ dossier `js`). |
| **F1** | Tous les modes de `tools/verif.js` verts, avec leur durée. |
| **F2** | Prouver que le garde-fou hors chaîne rougit sur un vérificateur bidon. |
| **F3** | Mesure globale de fin (vérificateurs hors chaîne, biais des QCM, fraîcheur) ; brancher `mesure-explain-orpheline.js` dans la chaîne. |
| **F4** | Lister ce qui n'a pas été fait, sans arrondir. |

---

## 5. Les règles qui ne se discutent pas

- Le site reste **100 % `file://`** : aucun serveur, aucun module ES, aucun build, aucune dépendance
  installée, que des scripts classiques.
- **Jamais** d'URL vers `cdnjs.cloudflare.com`, `fonts.googleapis.com` ou `fonts.gstatic.com`.
- **Ne jamais toucher** au mojibake volontaire de `pages/formats/lecon-06.html`,
  `pages/html/lecon-15.html`, `pages/r/lecon-06.html`, `pages/perl/lecon-13.html`.
- Tout le contenu en **français correct**, avec les accents.
- **Un commit par point**, avec la mesure dans le message ; le dépôt privé
  `github.com/chipat-neko/devpath` est une **sauvegarde**, le site n'est pas publié.
- **Ne jamais écrire un calcul de tête** : le faire tourner, et citer le chiffre obtenu.

Outils à lancer : `node tools/verif.js --rapide` (≈ 4 min, 53 étapes), `node tools/verif-html.js`,
`node tools/verif-donnees.js`, `node tools/verif-rendu.js` (pilote Chrome), `node tools/build-index.js`
(comparaison par défaut, `--write` pour écrire).

---

## 6. Points connus, non bloquants

- `.autonomie/epreuve-reset.ps1` : **2 cas sur 79 en échec**, tous deux des tests de dates figés sur
  « Aug 11 » (écrits le 2026-09-10) qui se résolvent désormais en 2027. Ils ne touchent ni au
  rangement ni à la relance ; à réécrire avec une date de référence fixe.
- `verif.js --rapide` signale **5 étapes** attendues tant que `vue` n'est pas clos (cliquets de biais
  et de lexique non refigés, `doc/lecon-03`, études à réassembler).

---

## 7. Où sont les choses (rangement du 2026-09-29)

```
test-claude/
├── README.md, index.html, sw.js   (sw.js doit rester à la racine : un service worker ne sert que son dossier)
├── en-cours/          ce fichier + ETAT-AUTONOMIE.md (réécrit chaque heure)
├── docs/
│   ├── chantiers/     CHANTIER-V4 à V17 (le V16 est le plan courant)
│   ├── audits/        audits, inventaire du 2026-08-20, VERIF-FINALE.md, resultat.md
│   ├── enrichissements/  ENRICHISSEMENT 1 à 3, NOUVEAUX-COURS (méthode d'ajout d'un cours), GROS-PROJETS…
│   └── reference/     DESIGN_SYSTEM.md, paramettre.md, rap_peda.md
├── assets/ css/ js/ pages/   le site (le manifeste PWA est dans assets/)
├── starter/           kit de démarrage (le zip se régénère dans tools/sorties/)
├── tools/             vérificateurs, mesures, générateurs (tools/anciens/ : scripts retirés)
├── scratchpad/        brouillons des agents (plusieurs Go, ignorés) ; les CONSIGNE-*.md et REGLE-*.md sont versionnés
└── .autonomie/        wrapper, bibliothèque, épreuve, arrêt, seuil de quota
```
