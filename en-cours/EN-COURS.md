# En cours — où en est Syntaxe, et ce qu'il reste à faire

*État mesuré le 2026-11-11. Les chiffres vivants (cases cochées, dernière passe) sont
réécrits chaque heure dans [`ETAT-AUTONOMIE.md`](ETAT-AUTONOMIE.md), juste à côté.*

> **⏸️ L'AUTONOMIE EST À L'ARRÊT depuis le 2026-09-30 à 14 h 12**, à la demande de Noah. Tâche
> désactivée **et** `.autonomie/arret-volontaire.txt` posé. Elle ne reprend que si Noah le dit.
>
> **✅ B4 EST TERMINÉ (2026-11-11).** Les 9 derniers cours du périmètre ont été traités **en
> parallèle**, en session interactive : un agent par cours, chacun sur sa branche `b4/<cours>`,
> puis fusion et passe de vérification par l'orchestrateur. Détail : plan V16, § « LES NEUF
> DERNIERS COURS », et un rapport par cours dans [`rapports-b4/`](rapports-b4/).
>
> **✅ LES 13 AUTRES CASES DU V16 ONT SUIVI LE MÊME CHEMIN (2026-11-11).** Cinq agents sur cinq
> branches `v16/<nom>` (B5 et E2, C1, C2 et E1, C3, D1 et D2), fusion vérifiée, puis F1 à F4 par
> l'orchestrateur. Un rapport par branche dans [`rapports-v16/`](rapports-v16/). **V16 est clos,
> 22 cases sur 22.**
>
> **🆕 LE CHANTIER-V18 EST ÉCRIT (2026-11-11), 61 cases, et ajouté à la fin de `$CHAINE`.** Il
> reprend le F4 du V16 avec les décisions de Noah du même jour : les 19 cours de QCM écartés sont
> traités, le code compte à part dans les durées, et quatre thèmes sont pris (« Cas réel »,
> outils, fraîcheur, liens et rendu). En tête : **vérifier les 1 500 « Cas réel »**, dont quatre se
> sont révélés inventés. Relancée, l'autonomie le prendra d'elle-même.
>
> **✅ PHASE A DU V18 CLOSE (2026-11-11), 6 cases sur 61.** Six agents en parallèle, une branche
> `v18/a<N>` chacun, puis fusion et passe de vérification. Après la fusion : `--rapide` 54/54,
> `--complet` **83/83 vert d'un seul passage** (4 347,6 s), `--mutations` 19/19 (18 dans le passage
> complet, `chaine` rejouée après une correction trouvée par ce passage). Un rapport par agent dans
> [`rapports-v18/`](rapports-v18/). **Prochaine case : B1** (inventaire des « Cas réel »).

---

## 1. Comment le travail avance

| | |
|---|---|
| **Mode** | **Autonomie totale** quand elle tourne (décision de Noah du 2026-09-29) : la tâche planifiée Windows `Syntaxe-Autonomie` lance une passe, et le wrapper replanifie la suivante 5 minutes après la fin. Aucune validation n'est demandée entre les passes. **Actuellement à l'arrêt** (voir ci-dessus). |
| **Rythme mesuré** | Du 29/09 19 h au 30/09 14 h : **10 cours clos en 19 heures**, et le quota hebdomadaire est passé de **18 % à 93 %**, soit environ **7 à 8 points par cours**. Mesure grossière : le quota est commun à tous les projets de Noah. |
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
| CHANTIER-V16 — consolider ce que les quatre chantiers ont laissé derrière | ✅ 22/22 (clos le 2026-11-11) |
| **CHANTIER-V18 — les « Cas réel » qu'on ne sait pas vrais, et ce que le V16 a laissé** | 🟠 **6/61 — plan courant** (écrit le 2026-11-11 ; phase A close le même jour) |

**Le V18 est le plan courant.** Ses phases, dans l'ordre : **A** les instruments d'abord (6 cases :
la sonde des QCM et l'épreuve de D2 entrent dans la chaîne, contrôle des domaines interdits, sondes
intermittentes, épreuves rejouées sur un arbre en CRLF) · **B** les « Cas réel » (13 : inventaire,
échantillon de 150 vérifiés à la source, règle et garde-fou, 9 lots de cours) · **C** les QCM des
22 cours restants (25) · **D** les durées, code compté à part (4) · **E** la fraîcheur (5) · **F**
les liens et le rendu (5) · **G** le contrôle final (3), dont les quatre modes de `verif.js` verts
**d'un seul passage chacun**. Quand sa dernière case sera cochée, le wrapper lancera la **passe de
sécurité** (`docs/audits/VERIF-FINALE.md`) puis s'éteindra si le verdict est VERT.

---

## 3. Le point qui vient de se terminer : B4, les QCM trop faciles à deviner

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

### Résultat, mesuré le 2026-11-11

**30 cours clos sur 30. B4 est coché.**

| Mesure (30 cours, 1 775 questions) | Avant (10/09) | Après |
|---|---:|---:|
| « la plus longue » | 93,3 % | **25,3 %** |
| la plus forte des 44 stratégies | — | **26,0 %** (« écarter les deux extrêmes ») |
| « la plus longue », cours par cours | — | entre **23,7 et 26,3 %** |
| site entier (90 cours, 6 167 questions) | 89,6 % au départ | **33,5 %** |

Le taux du site reste au-dessus de 25 % à dessein : les 19 cours écartés n'ont pas été touchés.

| Cours | « la plus longue » |
|---|---|
| clos avant le 29/09 (11) | `pandas` 26,2 · `haskell` 25,8 · `crypto` 25,0 · `sass` 26,2 · `securite` 25,0 · `clojure` 25,8 · `powershell` 25,0 · `go` 25,8 · `elixir` 25,4 · `nosql` 26,3 · `julia` 25,4 |
| clos les 29 et 30/09 (10) | `vue` 25,8 · `perl` 25,4 · `dart` 25,0 · `perf-web` 26,3 · `lisp` 25,5 · `observabilite` 25,0 · `docker` 26,3 · `r` 25,4 · `bash` 25,0 · `tests` 24,6 |
| clos en parallèle les 10 et 11/11 (9) | `pascal` 23,7 · `fsharp` 24,5 · `prolog` 25,0 · `linux` 25,5 · `vb` 25,4 · `objc` 24,5 · `api` 24,6 · `asm` 24,6 · `cobol` 24,5 |

**Ce que les 9 derniers ont trouvé en plus du biais** : 8 bonnes réponses et 5 explications prouvées
fausses (dont `volatile` en `asm`, d'après le manuel de GCC, et CORS en `api`, exécuté sous
Chrome), du code donné en modèle qui ne compilait pas (`vb`, `cobol`, `pascal`, `fsharp`), et 9
distracteurs qui étaient vrais. Les compilateurs installés pour l'occasion sont **hors du dépôt**,
dans `D:\outils-b4\<cours>\` (Free Pascal, SWI-Prolog, GnuCOBOL, NASM).

**Signalé et laissé** (détail dans le plan) : l'intrus lexical inverse d'`asm` à 30 % (seuil 28 %),
quelques bonnes réponses simplificatrices non prouvées fausses, et des exercices dont la réponse
se lit dans l'énoncé (convention du site entier).

### Les leçons qui coûtent cher si on les oublie

Elles sont détaillées cours par cours dans le plan et dans `scratchpad/CONSIGNE-*.md` /
`scratchpad/REGLE-*.md` (versionnés). Les plus importantes :
- **Relire le texte rendu, pas seulement les mesures** : deux fois, 46 mesures étaient vertes sur
  des distracteurs qui ne voulaient plus rien dire (98 fautes trouvées sur `vue`).
- **Fermer un indice en rouvre souvent un autre** : surveiller les **44 stratégies à la fois**
  (`scratchpad/vue-sonde/controle.js` v2 les charge depuis l'outil), jamais une liste à la main.
- **Le dosage se calcule** : viser 25 %, pas 0 % — fermer un indice « à fond » le retourne.
- **Commiter chaque vague avant d'y toucher** : un lot non commité ne survit à rien.
- **En parallèle, la fusion est une vraie passe de vérification** : sur 9 branches propres, elle a
  encore trouvé un dosage inachevé (`api`), un lexique qu'un `--ecrire` aurait gelé en
  régression (`asm`, `cobol`) et une bonne réponse fausse (`asm`). Ne jamais refiger un cliquet
  sans lire ce qu'il signale ; et passer `-c core.autocrlf=false` à git (le réglage système
  extrait en CRLF et fausse `verif.js`).
- Un distracteur est **une phrase française qui énonce une thèse fausse, précise et plausible**.

---

## 4. Après B4 : les 13 autres cases du V16, faites le 2026-11-11

| Case | Résultat |
|---|---|
| **B5** | **0 score orphelin** : les 6 167 questions comparées une à une à l'état d'avant B4, puis jouées dans Chrome. Un vérificateur qui jugeait à tort 48 bilans sur 99 en échec corrigé (99/99). |
| **C1 à C3** | Fraîcheur : `nodejs` 41 marques, `typescript` 21, `vue` 15, `graphql` 20, `sass` 20, `data-eng` 23, `llm` 15, `ml` 9, `dataviz` 7. **31 passages corrigés** (devenus faux, plus une erreur de fait), dont deux QCM (décorateurs ramenés au stade 2.7 du TC39 en mai 2026 ; l'opérateur `/` de Sass déprécié, pas retiré). |
| **C4** | **6 → 16 cours marqués sur 94, 149 → 321 marques**, dont 100 vérifiées le jour même. Projection : premiers avertissements le 2027-11-12, premières erreurs avant le 2029-01-01. |
| **D1** | Visualiseur de pile : **19 → 43 leçons reliées, 53 → 87 liens.** |
| **D2** | Décodeur d'erreurs : **31 → 44 leçons** ; bac à sable Git : **24 → 26**. |
| **E1** | `sass/lecon-09` au standard : 2 129 → 3 428 mots, 3 schémas, 6 encadrés, 9 termes ; chaque bloc SCSS compilé. |
| **E2** | Durées : **13 cours hors du facteur 2 → 0.** ⚠️ La mesure compte le code comme de la prose : `crypto` passe de 6 h à 43 h, `compilation` de 16 h à 50 h. Si c'est trop, c'est la mesure qu'il faut changer. |
| **F1** | Les quatre modes passés. `--rapide` est vert d'un seul passage (53 étapes, 281,4 s ; 159,5 s à la clôture). `--strict` (71 étapes, 1 624,7 s), `--complet` (81, 5 576,3 s) et `--mutations` (16, 6 512,6 s) **n'ont jamais été verts d'un seul passage** : chaque signalement a été trié, puis corrigé ou rejoué vert. Corrigés en route : **4 « Cas réel » inventés remplacés par des cas sourcés** (une régression venue de B4), une épreuve à moitié aveugle (`vexancr`, à cause des fins de ligne CRLF), la restauration de `--mutations` qui réécrivait en CRLF, deux plafonds trop courts (`git-cmd`, `vexancr`), et une sonde réseau qui prenait un bruit de Chrome pour une faute du site. |
| **F2** | Le garde-fou rougit sur un vérificateur bidon, même dans un sous-dossier, et repasse au vert. |
| **F3** | Vérificateurs hors chaîne sans raison : **24 → 0**. Bonne réponse strictement la plus longue : **88,8 % → 32,9 %**. Fraîcheur : **6 → 16 cours**. |
| **F4** | La liste de ce qui reste, dans le plan. En tête : la sonde qui joue les QCM dans Chrome est restée hors de la chaîne. |

**Ajouté à la clôture** : le contrôle **I28** de `verif-donnees.js`. La durée d'une leçon est
écrite à deux endroits, l'en-tête de la page et `js/data.js`, et rien ne les confrontait. Sans
lui, le réassemblage des pages `doc` aurait remis 45 min là où `data.js` en dit 131 à 185.

⚠️ **Piège mesuré le 2026-11-11 : ne modifier AUCUN fichier du dépôt pendant `verif.js
--mutations`.** Après chaque épreuve, ce mode remet à la version commitée (`git checkout --`) tout
fichier modifié pendant l'épreuve : c'est sa garantie qu'aucune faute injectée ne reste. Une
modification d'`EN-COURS.md` faite à ce moment-là a été effacée, et l'épreuve `qcmbiai` comptée
« SALE » alors qu'elle n'y était pour rien. Préparer ses écrits hors du dépôt, et les poser après.
Depuis F1, cette restauration écrit les octets de l'index, en LF (`-c core.autocrlf=false`).

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

Outils à lancer : `node tools/verif.js --rapide` (≈ 3 min, 54 étapes), `node tools/verif-html.js`,
`node tools/verif-donnees.js`, `node tools/verif-rendu.js` (pilote Chrome), `node tools/build-index.js`
(comparaison par défaut, `--write` pour écrire).

---

## 6. État des vérifications, et points connus

- **`node tools/verif.js --rapide` : 54 étapes sur 54 vertes, code de sortie 0, 172,6 s** (mesuré
  le 2026-11-11, après la fusion de la phase A du V18 ; l'étape neuve `domaine` cherche les trois
  domaines interdits dans les 2 001 fichiers servis). Les cliquets de biais et de lexique sont verts.
- **Les modes longs, après la fusion de la phase A du V18 (2026-11-11)** : `--complet` **83 étapes
  sur 83, vert d'un seul passage, 4 347,6 s** (dont `joueqcm`, les 6 167 questions jouées dans
  Chrome, 574,3 s). `--mutations` (19 épreuves, plafonds propres `git-cmd` 120 min et `vexancr`
  40 min) : 18 OK d'un passage en 7 131,8 s ; la 19ᵉ, `chaine`, a révélé que la sonde Python ne
  mesurait rien depuis `d:\test-claude` (casse de la lettre du lecteur), corrigée puis rejouée OK.
  `--strict` (72 étapes) n'a pas été rejoué à part : toutes ses étapes sont dans `--complet`.
- **Plus d'intermittent connu sur `py-lec`** : la cause était une attente fixe de 1 500 ms (A4 du
  V18), et la course entre deux blocs Python lancés coup sur coup était un vrai défaut du site,
  corrigé dans `js/runner.js`. La même course existe côté SQL, non corrigée.
- **Bruit connu** : Chrome ouvre de lui-même des connexions vers `image-cdn.spotifycdn.com` sur
  cette machine (prouvé sur une page vide hors du site). La sonde réseau range ce nom exact dans son
  bruit, avec la preuve écrite à côté. Depuis A3 du V18, elle compte aussi les connexions **au
  chargement** de la page, et les trois domaines interdits ne sont **jamais** du bruit.
- **Fins de ligne** : 77 fichiers suivis sont en CRLF et 2 à fins mêlées sur le disque de ce dépôt
  (index en LF). Les épreuves et les outils y tiennent désormais (A6 du V18) ; renormaliser le
  disque ou poser un `.gitattributes eol=lf` reste une décision de Noah.
- `.autonomie/epreuve-reset.ps1` : **82 cas conformes, 0 en échec** depuis le 2026-09-29 (les tests
  de dates ont une référence fixe au lieu de dépendre du jour où on les lance).
- Pendant qu'une passe réécrit un cours, `verif-donnees` peut signaler des index périmés
  (`quiz-index.js`, `search-index.js`) : c'est normal, ils sont régénérés à la clôture du cours.

---

## 7. Où sont les choses (rangement du 2026-09-29)

```
test-claude/
├── README.md, index.html, sw.js   (sw.js doit rester à la racine : un service worker ne sert que son dossier)
├── en-cours/          ce fichier + ETAT-AUTONOMIE.md (réécrit chaque heure)
├── docs/
│   ├── chantiers/     CHANTIER-V4 à V18 (le V18 est le plan courant)
│   ├── audits/        audits, inventaire du 2026-08-20, VERIF-FINALE.md, resultat.md
│   ├── enrichissements/  ENRICHISSEMENT 1 à 3, NOUVEAUX-COURS (méthode d'ajout d'un cours), GROS-PROJETS…
│   └── reference/     DESIGN_SYSTEM.md, paramettre.md, rap_peda.md
├── assets/ css/ js/ pages/   le site (le manifeste PWA est dans assets/)
├── starter/           kit de démarrage (le zip se régénère dans tools/sorties/)
├── tools/             vérificateurs, mesures, générateurs (tools/anciens/ : scripts retirés)
├── scratchpad/        brouillons des agents (plusieurs Go, ignorés) ; les CONSIGNE-*.md et REGLE-*.md sont versionnés
└── .autonomie/        wrapper, bibliothèque, épreuve, arrêt, seuil de quota
```
