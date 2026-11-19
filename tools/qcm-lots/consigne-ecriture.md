<!-- Consigne commune de la PHASE C du CHANTIER-V18 (les QCM des 22 cours restants), écrite au point C1
     (2026-11-19) d'après la consigne des neuf derniers cours de B4 du V16 et les leçons de la phase B du V18.
     Un agent par cours. Champs à remplir par l'orchestrateur : __COURS__ (ex. « cloud »), __COURSMAJ__
     (ex. « CLOUD », pour scratchpad/CONSIGNE-CLOUD.md), __CASE__ (ex. « C2 »),
     __CASEMIN__ (ex. « c2 »), __DOSSIER__ (ex. « D:\test-claude-c2-cloud »), __DOSSIERBASH__
     (ex. « /d/test-claude-c2-cloud »), __BRANCHE__ (ex. « v18/c2-cloud »), __BASE__ (commit de départ),
     __DEPART__ (la mesure de départ du cours, tirée de C1), __PARTICULIER__ (ce que la case du plan exige
     en plus pour CE cours, ou « rien de plus »). Contre-relecture : consigne-contre-relecture.md. -->
# Phase C du chantier V18 — les QCM du cours `__COURS__` (case __CASE__)

Tu réécris les QCM d'**un seul cours** du site **Syntaxe** (site éducatif francophone, statique, 100 %
`file://`) pour qu'**aucun indice de forme** ne désigne la bonne réponse. D'autres agents traitent
d'autres cours en même temps, chacun dans sa copie ; l'orchestrateur fusionnera les branches après une
contre-relecture indépendante et une passe de vérification. Tu travailles seul, sans pouvoir poser de
question : décide, et écris tes décisions dans ton rapport.

## 0. TON DOSSIER DE TRAVAIL — à respecter à CHAQUE commande

Ta copie de travail est **`__DOSSIER__`** (Git Bash : `__DOSSIERBASH__`), sur la branche
**`__BRANCHE__`**, déjà créée, partie de `__BASE__`. Le dossier `D:\test-claude\` est le **dépôt
principal** : tu n'y écris RIEN, jamais.

- ⚠️ **Ton shell démarre dans `D:\test-claude` et y revient après chaque commande.** Chaque appel Bash
  commence par `cd __DOSSIERBASH__ || exit 1` ; chaque chemin donné aux outils de fichiers est
  **absolu** et commence par `__DOSSIER__\`. Avant chaque commit : `git -C __DOSSIERBASH__ branch
  --show-current` doit répondre `__BRANCHE__`.
- ⚠️ **Téléchargements** : toujours avec un chemin de sortie explicite, jamais en arrière-plan (`&`) —
  au V18, un `curl -O` lancé sans `cd` a déposé trois PDF dans le dépôt principal, et onze fichiers
  lancés avec `&` ont atterri à sa racine. Tes fichiers de travail (sondes, scripts, téléchargements
  légers) vont dans `__DOSSIER__\scratchpad\__CASEMIN__-__COURS__\` (ignoré par git) ; les outils
  installés pour exécuter, dans `D:\outils-c\__COURS__\` (hors de tout dépôt).
- ⚠️ **L'outil Bash mange les backslashs**, même dans un heredoc entre apostrophes, et `node -e` avec
  un `\n` aussi : écris tes scripts avec l'outil d'écriture de fichiers, puis lance-les.
- Si tu as modifié un fichier sous `D:\test-claude\` par erreur, ne le corrige pas : écris-le en tête
  de ton rapport et de ton dernier message.

Langue : tout ce que tu écris (contenu, rapport, commits) en **français correct avec les accents**.

## 1. Ce que tu fais, en une minute

Les QCM des leçons (blocs `<script type="application/json" data-quiz>` et `data-quiz-bilan` de la
dernière leçon ; schéma `{"q", "a":[4 options], "correct", "explain"}`) ont presque toujours la bonne
réponse la plus longue : en la choisissant, on réussit ~90 % sans rien savoir. Tu réécris les
**mauvaises réponses (distracteurs)** pour qu'aucun indice ne désigne la bonne.

- **La bonne réponse et son `explain` sont INTOUCHABLES.** Exception unique : une bonne réponse ou une
  explication **prouvée fausse**, par exécution de préférence. Alors tu la corriges, tu le prouves, et
  tu l'écris en tête de ton rapport. Une bonne réponse « datée » ou discutable : signale-la, n'y touche pas.
- **Cible** (cliquet `tools/verif-qcm-biais.js`) : « la plus longue » vers **25 %** (le hasard sur
  quatre options) ; les **rangs** de longueur de la bonne réponse équilibrés (≈ un quart à chaque rang) ;
  **aucune des 44 stratégies** de `tools/mesure-biais-qcm.js` nettement au-dessus de 25 % — les derniers
  cours ont fini avec un **pire indice entre 25 et 27,5 %** et une couverture proche de zéro pour les
  indices autres que la longueur. **Viser 25 %, pas 0 % : fermer un indice « à fond » le RETOURNE**
  (`mobile`), et `tools/mesure-biais-inverse.js` le voit.
- **Un distracteur est une phrase française qui énonce une thèse fausse, précise et plausible** : si
  l'on ne peut pas dire en une phrase pourquoi c'est faux, ce n'est pas un distracteur. Jamais vrai par
  accident, jamais une salade de mots pour tenir un compteur (au V16, 46 mesures vertes sur des
  distracteurs qui ne voulaient plus rien dire).

**Ton cours au départ** (mesure de C1, sur `__BASE__`) : __DEPART__

**Ce que la case __CASE__ exige en plus** : __PARTICULIER__

## 2. À LIRE AVANT DE COMMENCER (dans ta copie, sauf la mémoire)

1. `docs/chantiers/CHANTIER-V18.md` : l'en-tête de la **phase C** et le compte rendu de **C1** (les
   trois indices du F4 mesurés sur le site entier, l'ordre des cours).
2. `docs/chantiers/CHANTIER-V16.md` : le cadrage de la case **B4** (cherche `**B4 ·`), puis
   **« LES NEUF DERNIERS COURS »** (cherche ce titre) — la méthode à jour, chiffrée, et ses reprises.
3. Les consignes des derniers cours, à reprendre et adapter : `scratchpad/CONSIGNE-FSHARP.md`,
   `scratchpad/CONSIGNE-PROLOG.md`, `scratchpad/CONSIGNE-API.md` (et leurs variantes
   `-RELECTURE`, `-CORRECTION`, `-CONTRE` quand elles existent) ; la règle
   `scratchpad/REGLE-INTRUS-LEXICAL.md` ; la sonde `scratchpad/vue-sonde/controle.js` (v2 : elle
   CHARGE les stratégies depuis l'outil, jamais une liste recopiée).
4. Les leçons apprises (mémoire de l'orchestrateur, **lecture seule**) :
   `C:\Users\chipat\.claude\projects\d--test-claude\memory\` — au minimum `b4-neuf-paralleles-clos.md`,
   `b4-tests-clos.md`, `b4-bash-clos.md`, `b4-vue-clos.md`, `b4-go-clos.md`, `b4-elixir-clos.md`,
   `b4-mobile-clos.md`, `b4-lua-clos.md`, `b4-swift-clos.md`, `b4-dettes-outillage.md`,
   `b4-indice-point-virgule.md`.

## 3. Les outils

- `tools/mesure-biais-qcm.js` (44 stratégies + l'étalon du hasard, couverture et rendement ;
  `--cours` pour le détail par cours, `--json` pour une sonde, `--lots` pour les tics d'un lot
  d'écriture), `tools/plan-rangs-qcm.js` (rangs et
  caractères à écrire), `tools/mesure-lexique-qcm.js --liste=<cours>` (indice lexical : les mots des
  options cherchés dans la page), `tools/mesure-mot-fetiche.js`, `tools/mesure-tics-lot.js`,
  `tools/mesure-biais-inverse.js`, `tools/mesure-qcm-intouchable.js <cours> __BASE__` (aucune bonne
  réponse ni `explain` touchés sans le dire), `tools/mesure-explain-orpheline.js`,
  `tools/verif-qcm-biais.js`, `tools/verif-qcm-lexique.js`, `tools/verif-html.js`,
  `tools/verif-donnees.js`, `tools/verif.js --rapide`. Lis l'aide de chacun avant de t'en servir.
- **Copie** `scratchpad/vue-sonde/` dans `__DOSSIER__\scratchpad\__CASEMIN__-__COURS__\sonde\` et
  adapte-la : c'est le garde-fou qui a permis « 60 réécritures sans déplacer un indice ». **Ne lance
  jamais un script depuis `D:\test-claude\`** : il mesurerait le dépôt principal, pas ta copie.
- Un diagnostic doit être la **copie exacte** de ce que fait l'outil (jetons, apostrophes, tirets),
  sinon tu travailles à côté de la cible.
- **Mesuré en C1, sur les 6 167 questions du site** : prêter une intention au moteur (« le moteur
  décide »), les tics rhétoriques sans la glose finale (« c'est ceci qui sépare », « de son côté »,
  « seul / direct ») et les absolus stricts sont au niveau du HASARD (25,0 %, 26,0 %, 25,5 %) ; ils
  n'entrent pas dans l'outil. Mais ils apparaissent **par lot d'écriture** (30 à 39 % au V16) : n'en
  fais pas ta signature, et `mesure-biais-qcm.js --lots` / `mesure-tics-lot.js` doivent rester muets.

## 4. La marche à suivre (en solo, dans l'ordre)

1. **Mesure de départ** : toutes les stratégies, rangs, lexique, mot fétiche, tics de lot, biais
   inverse ; note-la avec les commandes.
2. **Preuve des bonnes réponses** : exécute ce qui peut l'être AVANT d'écrire autour (§ 7). Au V16,
   les neuf derniers cours ont trouvé huit bonnes réponses fausses et cinq explications fausses.
3. **Consigne du cours** : écris `scratchpad/CONSIGNE-__COURSMAJ__.md` à partir de tes mesures — les
   tics de ton cours et la façon de les fermer.
4. **La vague** : réécris les distracteurs, **leçon par leçon, en commitant après chaque lot**. Un
   applicateur sûr reparse chaque bloc JSON avant d'écrire, refuse si un seul est invalide, et garde
   les fins de ligne du fichier. **Un lot non commité ne survit à rien.**
5. **Dosage calculé** : pour chaque indice au-dessus de la cible, calcule combien de bascules il faut
   (pas « toutes les questions ») ; vérifie avec la sonde que la retouche n'en rouvre pas un autre.
   **Fermer un indice en rouvre un autre** : longueur → incise, incise → lexique, mot exclusif →
   intrus lexical.
6. **Relecture par contradiction** : relis CHAQUE option réécrite comme un apprenant et comme un expert
   qui veut la démolir : fausse, précise, plausible, en bon français ? Pas vraie par accident ? Relis
   aussi le **corps** des leçons autour des QCM (exemples qui ne compilent pas, messages d'erreur
   recopiés de mémoire, chiffres faux : des dizaines par cours au V16). Corrige, commite.
7. **Contre-relecture de tes propres corrections** (13 à 30 % étaient fautives au V16). Commite.
8. **Mesure finale** + `verif-html` (0) + `verif-donnees` + JSON de chaque bloc valide +
   `mesure-qcm-intouchable` (chaque atteinte déclarée et prouvée).

## 5. Les encadrés « Cas réel » — ne pas y toucher

La phase B les a rendus vrais et sourcés (1 551 sur 1 551), et leur règle est **bloquante** :
`node tools/verif-contenu.js` sort en code 1 si un seul s'en écarte. **Ne modifie ni un encadré
« Cas réel », ni son intertitre, ni sa ligne `Source :`.** Un QCM ou un exercice qui parle du cas réel
de sa leçon doit dire la même chose que l'encadré ; s'il le contredit, c'est le QCM qui se corrige (et
si tu crois l'encadré faux, signale-le dans ton rapport sans y toucher). Un mot ajouté au corps peut
aussi rouvrir l'indice lexical d'un QCM : relance les deux cliquets après chaque retouche de prose.

## 6. RÈGLES DE FUSION — elles priment sur tout le reste

**Tu ne modifies QUE** : `pages/__COURS__/**` (les leçons et le `cours.html` de TON cours),
`scratchpad/CONSIGNE-__COURSMAJ__*.md` (versionnées : `git add -f`), et ton rapport
`en-cours/rapports-v18/__CASEMIN__-__COURS__.md`.

**Tu ne modifies JAMAIS** (même si un outil te le propose) : `docs/chantiers/*`, tout `js/*` (index
générés compris : `quiz-index.js`, `search-index.js`, `search-lite.js`, `flashcards-data.js`,
`antiseches-data.js`), tout `tools/*` (références des cliquets comprises), les pages d'un autre cours,
les pages dérivées (`pages/doc/lecon-0*.html`, `pages/etude-*.html`), `README.md`, `en-cours/EN-COURS.md`,
`en-cours/ETAT-AUTONOMIE.md`, `.autonomie/*`, la mémoire de l'orchestrateur. Si tu régénères un index
ou refiges un cliquet **pour mesurer**, remets le fichier dans son état d'origine avant de commiter.
Un outil a un défaut : décris-le, ne le corrige pas. Une faute dans une autre page : note-la.

Dans ta copie, `node tools/verif.js --rapide` signalera des étapes **attendues** : les cliquets
`qcmbiai` et `qcmlexi` (« progressé sans que le gain soit figé »), l'invariant I18 de `donnees`
(index périmés), et les chiffres mesurés sur tout le site (`doc-ref`, `doc-rec`, `normatf`, `etudes`).
**Tout autre signalement doit être expliqué dans ton rapport.** Ne lance JAMAIS
`node tools/verif.js --mutations` (il tue les Chrome des autres agents).

**Git** : toujours `git -c core.autocrlf=false` ; commits sur TA branche seulement, par
`git commit -F <fichier>` (message écrit avec l'outil d'écriture, sans accent grave) ; message
`V18/__CASE__ : __COURS__ -- <ce qui a été fait, avec la mesure>`, terminé par la ligne
`Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`. Ne bascule jamais de branche, ne fusionne
rien, ne pousse rien, ne lance aucune commande git depuis `D:\test-claude\`. Vérifie avec node que
chaque fichier modifié a 0 CR.

## 7. Exécuter pour prouver

Règle du projet : **ne jamais écrire ni corriger un calcul, une sortie ou un message d'erreur de
tête — le faire tourner**, et citer le résultat obtenu.

Sur cette machine : Node 26, Python 3.14, Java 27 (`java`, `javac`), .NET 10 (`dotnet fsi` pour F#),
Git Bash. Outils portables déjà là (lecture seule, copie-les si tu dois les modifier) :
`D:\test-claude\scratchpad\outils-portables\` (Zig 0.14.1 = compilateur C/C++ ; Lua 5.1 à 5.5 ;
archives officielles d'Erlang/OTP 29.1.2 et d'Elixir), `D:\test-claude\scratchpad\outils-wasm\`
(PHP 8.4 et Ruby 3.4 en WebAssembly, `run.mjs`), `D:\outils-b4\` (NASM, GnuCOBOL, Free Pascal,
SWI-Prolog). L'API de Compiler Explorer (godbolt.org) a servi au V18 pour GHC, gfortran, GNAT,
Kotlin, OCaml et Julia. Sinon : une distribution **portable officielle** dans `D:\outils-c\__COURS__\`.
Si ce n'est pas possible proprement, vérifie par la documentation officielle de la version citée et
écris **« non exécuté »** pour chaque point concerné. N'affirme jamais une exécution que tu n'as pas faite.

## 8. Les contraintes absolues du site

- 100 % `file://` : aucun serveur, aucun module ES, aucun build, aucune dépendance installée dans le dépôt.
- **Jamais** d'URL vers `cdnjs.cloudflare.com`, `fonts.googleapis.com`, `fonts.gstatic.com`.
- Aucun BOM ; chaque bloc `data-quiz` / `data-exos` / `data-quiz-bilan` reste du JSON valide ; balises
  équilibrées ; fins de ligne du fichier gardées.
- **Mojibake volontaire** : ne touche jamais aux caractères mal encodés exprès de
  `pages/formats/lecon-06.html`, `pages/html/lecon-15.html`, `pages/r/lecon-06.html`,
  `pages/perl/lecon-13.html` ; si tu modifies l'une de ces pages, prouve avec node que tous les octets
  hors du bloc modifié sont identiques à avant.

## 9. Ton rapport : `en-cours/rapports-v18/__CASEMIN__-__COURS__.md`

- en-tête : `__CASE__ — __COURS__, X % → Y %` ;
- tableau **avant / après** des indices (la plus longue, pire stratégie, rangs, lexique, mot fétiche,
  tics de lot, biais inverse), avec les commandes qui les ont produits ;
- distracteurs réécrits, gardés, caractères écrits ; atteintes à l'intouchable, chacune prouvée ;
- **fautes de fond** trouvées et corrigées (bonnes réponses, explications, corps), chacune avec sa
  preuve ; ce qui a été **exécuté** et ce qui ne l'a **pas** été ;
- les **leçons** de ce cours (ce qui a résisté, ce qui s'est rouvert) ;
- ce qui **reste**, sans arrondir.

## 10. Ton dernier message (ce que l'orchestrateur reçoit)

Court : ta branche, tes commits, la mesure avant/après, les fautes de fond, ce qui n'a pas été exécuté,
ce qui reste. Si tu n'as pas pu finir, dis exactement où tu t'es arrêté — tout ce qui est commité sera
repris.
