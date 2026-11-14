# Chantier V18 — les « Cas réel » qu'on ne sait pas vrais, et ce que le V16 a laissé

Plan de travail de l'autonomie. **Source de vérité : ce fichier.** Chaque réveil lit ce plan,
prend la **première case non cochée**, la traite entièrement, la coche avec un compte rendu chiffré,
puis passe à la suivante. Le chantier est fini quand il ne reste aucune case `- [ ]`.

**Les chantiers V12 à V17 sont clos** : le V16, dernier de la chaîne, a été coché 22/22 le
2026-11-11 (commit `0a9cfb1`). Ce plan est écrit à partir de son point F4, « ce qui n'a pas été
fait », complété par ce que son F1 a trouvé. Le nom V18 vient de ce que le V17 existe déjà (« les
garde-fous qui mentent », clos 80/80).

---

## Le constat qui fonde ce chantier

En réécrivant les QCM du cours `tests` et du cours `observabilite`, le V16 a trouvé **quatre
encadrés « Cas réel » dont l'histoire était inventée**. Il les a trouvés **en passant** : ce sont
les relecteurs adversariaux de B4, chargés des QCM, qui les ont démasqués (relecture par
contradiction de `tests`, commit `f7e2018` ; contre-relecture d'`observabilite`, commit `cabe9d0`),
et les encadrés ont été renommés « Scénario ». Aucun outil ne les avait signalés, et aucun ne
l'aurait fait : le critère de `tools/verif-contenu.js` est `/Cas r[ée]el/i.test(page)`. Il vérifie
qu'un mot est écrit, pas qu'un fait est vrai.

> **Un contrôle qui compte un mot compte un récit inventé comme un fait.**

C'est le défaut le plus grave connu du site : un apprenant qui lit « Cas réel » croit lire un fait.
Il ouvre le chantier, et tout le reste du plan suit la même exigence — **ce qu'on affiche, on le
prouve**.

**Mesures refaites le 2026-11-11, avant d'écrire ce plan** (rien n'est recopié du F4 sans avoir
été recompté, sauf ce qui est marqué « F4 ») :

| | |
|---|---:|
| Titres d'encadré « Cas réel » sur le site | **1 500**, dans **1 540 leçons sur 1 540** (chacune en porte au moins un) — ⚠️ **corrigé par B1** : les 1 500 encadrés ne sont que dans 1 489 leçons ; avec 51 sections « Cas réel » (`<h2>`/`<h3>`), le site en compte **1 551**, et là chacune des 1 540 leçons en porte au moins un |
| « Cas réel » prouvés inventés à ce jour | **4** (trouvés par hasard, remplacés par des cas sourcés en F1 du V16) |
| QCM du site : réussite de « toujours la plus longue » | **33,5 %** sur **6 167** questions (hasard : 25 %) |
| Les 19 cours écartés de B4 le 2026-09-15 | **947 questions**, dont **831 (87,8 %)** où la plus longue est la bonne |
| `neurones`, `distribue`, `offensive` (jamais traités) | « la plus détaillée » rend **59,4 %**, **56,8 %**, **52,7 %** |
| Part du **code** dans les « mots visibles » qui fixent les durées | **23,6 %** sur le site ; médiane par cours **16,5 %** ; `crypto` **65,7 %** |
| Marques de fraîcheur jamais vérifiées sur une source (F4) | **221 sur 321** |
| Leçons qui écrivent un nom d'erreur (`XxxError:`, `XxxException:`) (F4) | **142** ; le décodeur d'erreurs couvre **4 langages** |
| Exemples d'exception dans le visualiseur de pile (F4) | **0** ; **9 leçons** dans 8 langages ne peuvent donc pas y mener |
| Modes de `verif.js` verts **d'un seul passage** au F1 du V16 | **1 sur 4** (`--rapide`) |

**Décisions de Noah, le 2026-11-11** (questionnaire de fin du V16) :
- les **19 cours écartés** le 2026-09-15 sont **traités**, avec la même méthode que les 30 autres ;
- dans les durées annoncées, **le code est compté à part** (il se survole), et les 90 durées sont
  recalculées ;
- les quatre thèmes du reste sont pris : **les « Cas réel »**, **les outils et la chaîne**, **la
  fraîcheur**, **les liens et le rendu**.

---

## Règles permanentes

- **Un point à la fois**, mené jusqu'à la mesure. Une case = un point clos et prouvé.
- **NE JAMAIS CORRIGER NI ÉCRIRE UN CHIFFRE DE TÊTE, LE FAIRE TOURNER.** Le compte rendu de chaque
  case cite le chiffre obtenu par l'exécution.
- **NE JAMAIS DÉCLARER UN CORRECTIF SANS L'AVOIR EXÉCUTÉ** — le fichier réparé lui-même, jamais une
  copie retapée (règle fondatrice du V17).
- **UN GARDE-FOU SE PROUVE EN LUI DONNANT UNE FAUTE À TROUVER.** Tout contrôle ajouté ou corrigé ici
  est éprouvé par injection : il rougit sur la faute, il reverdit sans elle, et le compte rendu cite
  les deux résultats.
- **NOUVEAU : un fait affiché se prouve par une source.** Tout « Cas réel » écrit ou corrigé dans ce
  chantier nomme son sujet, sa date et sa source, et ne dit **rien** que la source ne dise pas. Un
  PDF que l'outil de lecture du web n'ouvre pas se lit localement (`pypdf` est installé ;
  `PYTHONIOENCODING=utf-8`). Une histoire qu'on ne peut pas sourcer s'appelle « Scénario », pas
  « Cas réel ».
- **NOUVEAU : un témoin a la forme exacte du cas réel**, ou il ment. Au F1 du V16, un témoin d'un
  seul Chrome a fait conclure à un incident passager ; avec 13 Chrome, comme la vraie sonde, le
  défaut est apparu tout de suite.
- **Git : toujours `-c core.autocrlf=false`** pour une commande qui écrit des fichiers (checkout,
  worktree, merge). Le réglage système vaut `true`, et `git status` reste propre sur un fichier
  réécrit en CRLF : le défaut est invisible. Compter les CR avec node, jamais avec `cat -A` (Git Bash
  les cache). Depuis le 2026-11-14, `core.autocrlf=false` est réglé dans `.git/config` de ce dépôt ;
  l'option reste obligatoire dans toute autre copie (worktree d'agent, clone).
- **Ne modifier aucun fichier du dépôt pendant `verif.js --mutations`** : le mode restaure tout
  fichier changé pendant une épreuve. Préparer ses écrits hors du dépôt.
- **`verif.js --seules=`** compare des **noms de fichiers** (`sonde-clic-reseau`), pas les noms
  courts d'étape (`clic-net`) : sinon l'étape ne tourne pas et le verdict est vert sur rien.
- **Un commit par point**, avec la mesure dans le message. `node tools/verif.js --rapide` vert avant
  de cocher ; `--complet` sur les points qui touchent la chaîne.
- **Contrainte fondatrice** : 100 % `file://`, aucun serveur, aucun module ES, aucun build, aucune
  dépendance installée. **INTERDIT** de réintroduire une URL vers `cdnjs.cloudflare.com`,
  `fonts.googleapis.com`, `fonts.gstatic.com`. Un outil installé pour vérifier (compilateur,
  Express…) va **hors du dépôt**, comme `D:\outils-b4\`.
- **NE JAMAIS TOUCHER** au mojibake volontaire de `pages/formats/lecon-06.html`,
  `pages/html/lecon-15.html`, `pages/r/lecon-06.html`, `pages/perl/lecon-13.html`.
- **En cas de doute réel : ne force pas.** Laisse la case décochée en écrivant ce qui bloque.

---

## PHASE A — Les instruments d'abord

Le V17 l'a appris à ses dépens : corriger le contenu avec des instruments qui ne voient pas, c'est
produire du travail qui ne se voit pas. Les deux outils écrits pour le V16 et restés **hors du
dépôt** sont exactement ceux dont les phases B et C auront besoin.

- [x] **A1 · La sonde qui joue les QCM entre dans la chaîne.** Pendant B5 du V16, une sonde a joué
      les 6 167 questions dans Chrome et relu `syntaxe-quiz` — puis elle est restée dans le dossier
      de travail de l'agent : `scratchpad/v16-parallele/b5e2/joue-qcm.js` (hors git ; si elle a
      disparu, la réécrire d'après `en-cours/rapports-v16/b5e2.md`). La ramener dans
      `tools/preuves/`, la brancher dans `--complet`, et lui écrire son épreuve par injection : une
      bonne réponse qui ne compte pas, un score qui ne s'enregistre pas, une option en double —
      chacune doit la faire rougir. Citer sa durée et le nombre de questions jouées.

      **COCHÉ le 2026-11-11** (agent `v18/a1`, fusion `e6be571`). Rapport : `en-cours/rapports-v18/a1.md`.
      La sonde de B5 était intacte ; elle est ramenée en `tools/preuves/joue-qcm.js` et **durcie** :
      `file://` sans `--allow-file-access-from-files` et DNS coupé (comme l'apprenant), rechargement
      attendu sur un **état** et non 300 ms, aucune option affichée en double, options affichées =
      options du bloc, score parfait relu **après rechargement**, aucun échec d'écriture de
      `SyntaxeStore`. Étape `joueqcm` de `--complet` (6 Chrome).

      **Passe complète : 1 540 pages, 1 639 QCM, 6 167 questions (5 056 de leçon, 1 111 de bilan),
      0 défaut, 2 806,8 s, code 0** — jouée avec 4 Chrome sur une machine chargée par cinq autres
      agents. Sans Chrome : code 2.

      Épreuve `tools/preuves/joue-qcm-mutations.js` (dans `--mutations`) : **10 fautes**, dont les
      trois du plan (bonne réponse qui ne compte pas, score non enregistré dans `syntaxe-quiz`, option
      en double) ; chaque faute doit rougir la sonde **en la nommant**. 10 / 10 en LF (114,5 à
      302,3 s), 10 / 10 sur les mêmes fichiers en CRLF. « Deux distracteurs identiques » : la sonde de
      B5 rendait 0, la nouvelle 1.
      **Par le mode, après la fusion** (`verif.js --mutations`, passage complet, machine au repos) :
      `joueqcm` **OK, 10 / 10, 54,6 s**. Dans `--complet` après la fusion : étape `joueqcm` **OK en
      574,3 s** avec ses 6 Chrome, machine au repos (« 1639 QCM joués, 6167 questions, chacune deux
      fois »).

      **Reste** : sous la charge des six agents, `sanschr` a rendu 1 — `verif-interpreteur.js` met
      92,3 s à dire NON MESURÉ et `chrome-absent.js` le tue à 60 s (intermittent de charge, non
      corrigé ; **OK en 8,1 s** au repos dans `--complet`) ; 19 profils Chrome de la sonde étaient
      restés dans le dossier temporaire (effacés à la main).

- [x] **A2 · L'épreuve par mutations de D2 entre dans `--mutations`.** Script de travail
      `scratchpad/v16-parallele/d/mutations-d2.js` (9 fautes sur 9 au V16). Le ramener dans
      `tools/`, l'ajouter à la liste des épreuves de `verif.js --mutations`, et le rejouer par ce mode.

      **COCHÉ le 2026-11-11** (agent `v18/a2`, fusion `28f5307`). Rapport : `en-cours/rapports-v18/a2.md`.
      Ramenée en `tools/preuves/encarts-decodeur-git-mutations.js`, sans dépendance au scratchpad ;
      entrée `encarts` de `--mutations`. Les **9 fautes** du V16 dans `js/lecon.js`. Une faute n'est
      « vue » que si la preuve **imprime son message** (sous charge, `decodeur-lecons` et
      `git-graphe` rougissaient sans faute) ; jusqu'à 5 tentatives ; témoin rouge 5 fois → code 2,
      jamais 0. Fautes posées à sec sur LF **et** CRLF avant tout lancement.

      Lancée directement sous la charge de six agents : **9 / 9, code 0, cinq fois** (698,2 · 615,5 ·
      695,5 · 818,3 · 771,4 s ; la deuxième sur `js/lecon.js` en CRLF), une fois code 2 (témoin
      `git-graphe` rouge 5 fois : l'intermittent de A5, corrigé depuis). Épreuve de l'épreuve
      (`--controle`) : la faute invisible passe inaperçue, le motif absent est « non applicable »,
      un rouge pour une autre raison et un message interdit restent « non vus » — code 1, attendu.
      **Par le mode, après la fusion** (passage complet de `--mutations`, machine au repos) :
      `encarts` **OK, 9 / 9, 207,3 s**.

      **Reste** : `decodeur-lecons.js` n'attend que 5 s l'encart d'une leçon (4 témoins rouges sans
      faute sous charge : `dec-lec` de `--complet` peut rougir de même ; au repos, OK en 21,5 s) ; `mth-prg` est sorti une
      fois NON MESURÉ sous charge, vert seul juste après.

- [x] **A3 · Les domaines interdits ont un contrôle.** Aucun contrôle statique ne cherche
      `cdnjs.cloudflare.com`, `fonts.googleapis.com` et `fonts.gstatic.com` dans les 1 540 leçons,
      et la sonde réseau range les deux derniers dans son bruit Google. Écrire le contrôle (balises
      et attributs **réels** seulement : `html/lecon-25` et `html/lecon-35` les citent à dessein, en
      texte ou en code échappé), le mettre dans `--rapide`, et sortir `fonts.*` du bruit de
      `tools/preuves/sonde-clic-reseau.js`. Épreuve : une `<link>` réelle vers chaque domaine,
      injectée dans une leçon, doit rougir les deux contrôles.

      **COCHÉ le 2026-11-11** (agent `v18/a3`, fusion `cf18731`). Rapport : `en-cours/rapports-v18/a3.md`.
      `tools/verif-domaines-interdits.js`, étape `domaine` dans **tous** les modes : il lit les
      **2 001** fichiers que le site sert comme le navigateur les lit (balises et attributs réels,
      scripts exécutables, CSS, liens des données JSON) ; il **lit puis écarte** les 6 mentions de
      `html/lecon-25` (×5) et `html/lecon-35` (×1). 0,7 s au repos, code 0.

      **La sonde réseau avait deux trous**, mesurés avant d'être fermés : `fonts.*` étaient dans le
      bruit Google, et une connexion **au chargement** de la page était imprimée puis oubliée — une
      `<link>` réelle vers chacun des trois domaines la laissait **verte** (épreuve contre la sonde
      d'origine : 10 / 13, code 1). Corrigée : les trois domaines ne sont jamais du bruit, et toute
      connexion hors bruit au chargement fait échouer (`BRUIT_MACHINE` inchangé). Sonde complète sans
      injection : verte trois fois (140,1 · 144,5 · 169,2 s), 0 connexion au chargement sur 13 pages.

      Épreuve `tools/verif-domaines-interdits-mutations.js` : 3 `<link>` réelles (les **deux**
      contrôles doivent rougir et nommer le domaine), 7 autres formes pour le statique, 4 témoins
      négatifs qui restent verts — **13 / 13, 4 / 4, code 0, 154,2 s**. Dans la forme de la chaîne
      (`--strict --seules=…`) : `clic-net` et `domaine` SIGNALE avec la `<link>`, OK sans.
      **Par le mode, après la fusion** : `domaine` **OK, 13 / 13, 4 témoins verts, 51,5 s**. Dans
      `--complet` : `domaine` OK en 0,5 s, `clic-net` OK en 112,8 s ; dans `--rapide`, `domaine` OK.

      **Reste** : le statique ne voit ni une URL calculée, ni un hôte en `%xx`, ni un mot coupé par
      une entité ; la sonde ne voit pas un `dns-prefetch` (aucune connexion) et ne visite que 13
      pages ; `tools/preuves/git-commandes.js:82` sort en 1 au lieu de 2 quand Chrome ne démarre pas
      (SIGNALE au lieu de NON MESURÉ).

- [x] **A4 · La sonde Python cesse d'être intermittente.** `py-lec` laisse parfois 3 blocs sans
      sortie en 20 s quand la machine est chargée, jamais les mêmes ; 5 passages verts sur 5 au
      repos. Lu dans `tools/preuves/python-lecon.js` : elle passe au bloc suivant dès la **première
      ligne** de sortie, sans attendre la fin du bloc précédent. Établir la cause **sous charge**
      (la sonde lancée pendant un `--complet`), corriger, et prouver : 0 « MOTEUR KO » sur au moins
      5 passages sous charge, et un bloc qui ne démarre vraiment pas rougit toujours.

      **COCHÉ le 2026-11-11** (agent `v18/a4`, fusion `7df2975`). Rapport : `en-cours/rapports-v18/a4.md`.
      **La cause n'était pas celle que le plan supposait.** La sonde attendait **1 500 ms** après la
      navigation puis ouvrait les `<details>` : quand la page arrivait plus tard, les solutions
      restaient repliées, et un bloc replié exécuté (`textContent` = « Console PythonTrue ») a un
      `innerText` vide, lu « MOTEUR KO ». Les blocs signalés au V16 (`lecon-03` 12-14, `lecon-15` 10,
      12, 14) sont **exactement** les blocs placés dans un `<details>`. Pire, quand la page arrivait
      après 1 800 ms, la leçon était **sautée** et la sonde sortait en 0 : sur 36 passages mesurés de
      l'ancienne sonde, **un seul** avait cliqué les 43 blocs.

      Reproduit sous charge (page ralentie ×1,5 par `Emulation.setCPUThrottlingRate`, CPU 52,9 à
      71,2 %) : **3 KO sur 8 passages**, signature identique. Corrigé (attente d'un état, sortie en 2
      si rien n'est mesuré) : **0 KO sur 25 passages mesurés** sous trois charges, 43 blocs, 42 sorties
      et l'exception voulue à chaque fois. Épreuves : Pyodide retiré → 43 KO, code 1 ; moteur muet →
      code 1 ; page sans bloc → code 2.

      **Un vrai défaut du site, trouvé en passant et corrigé** (`js/runner.js`) : deux blocs Python
      lancés à 400 ms d'écart — la console de B affichait la sortie de A, et celle de B était perdue.
      Chaque lancement porte désormais son numéro et n'écoute que ses messages ; le Worker les exécute
      l'un après l'autre. Ancien runner remis → la course rougit ; runner corrigé → OK.

      **Trouvé à la fusion, et corrigé (`65a8ff1`)** : la nouvelle sonde attendait sa page par
      `location.href === url`. Chrome écrit la lettre du lecteur en **majuscule** ; `url` gardait
      celle du dossier courant, et celui de l'éditeur est `d:\test-claude`. Depuis là, la sonde
      rendait **NON MESURÉ à chaque passage, même sans faute** (« la page n'a pas atteint son état
      chargé en 60 s », code 2) — l'agent ne pouvait pas le voir, sa copie s'appelait
      `D:\test-claude-v18-a4`. C'est le passage de `--mutations` qui l'a montré : l'épreuve `chaine`
      sortait en 2 (« py-lec NON MESURÉE, 61,7 s »). Comparaison désormais sans la casse : depuis
      `d:\` sans faute, 43 blocs, course OK, code 0 ; faute « moteur vide » vue en 6,5 s ; depuis
      `D:/`, toujours code 0. Seul outil du dépôt à comparer `location.href` à l'identique (grep).
      Dans `--complet`, lancé depuis `d:\` : `py-lec` **OK en 12,0 s**.

      **Reste** : même course côté SQL, démontrée, non corrigée ; un bloc mis en file voit son
      minuteur de 15 s partir dès l'envoi ; `EXO_PY_WORKER_SRC` de `js/lecon.js` non examiné ; sous
      100 % de CPU, Chrome n'écrit pas son port en 30 s (`tools/lib/port-chrome.js`).

- [x] **A5 · Les deux autres intermittents.** `verif-rendu` sur `bdd/lecon-01`, et le premier
      chargement de `tools/preuves/git-graphe.js`, échouent parfois puis passent seuls. Reproduire,
      isoler la cause, corriger — ou, si la cause est hors du site, l'établir par un témoin qui a la
      forme exacte du cas, et l'écrire.

      **COCHÉ le 2026-11-11** (agent `v18/a5`, fusion `b709926`). Rapport : `en-cours/rapports-v18/a5.md`.
      **`git-graphe`, premier chargement** : 2 échecs sur 10 (« la page n'a ni champ de saisie ni
      formulaire »). Cause : le pilote jouait ~400 ms après la navigation ; un témoin de même forme l'a
      vu jouer sur une page encore en `readyState: "loading"`. Le pilote attend désormais `complete`
      (le pilote voisin de D4 avait déjà cette garde) : **0 échec sur 10**. Épreuves : `git-bac.js`
      retiré ou champ renommé → code 1 ; sans faute → 0.

      **`verif-rendu` sur `bdd/lecon-01`** : 0 erreur sur 10 passages, mais **19 mesures sur 60** prises
      sur une page non stabilisée — la condition du faux +317 px du V16. Sous charge, Chrome retarde
      les sous-ressources de cette page de 1,9 à 5,1 s (25 navigations sur 48) ; bissection hors du
      site : le retard persiste sans aucun script du site, sans icône ni polices. Faux rouge reproduit
      à volonté sur une page témoin lente (ancien outil `+505 px`, code 1 ; nouveau, 0 erreur).
      L'outil attend `complete` (20 s, `--plafond=`), puis une page non chargée devient une erreur
      « chargement » au lieu d'un débordement inventé : **10 passages, 0 erreur, 0 mesure non
      stabilisée**. Un vrai débordement injecté rougit toujours.

      **Troisième intermittent** : `git-graphe`, 1 passage sur 33, deux volets muets (141,5 s) ; la
      cause reste inconnue, mais l'outil imprime désormais la raison et la durée (éprouvé).

      Dans `--complet` après la fusion : `rendu` **OK en 1 617,3 s** (256 pages), les deux `gitgraf`
      OK (20,3 s et 8,7 s).

      **Reste** : le mécanisme interne de Chrome n'est pas isolé ; `preuve-hors-reseau.js` réutilise
      toujours le même profil Chrome (piste non prouvée) ; `verif-rendu.js` prend son port par
      `9222 + pid % 500`, et 9222 est occupé sur cette machine (fifine Genie).

- [x] **A6 · Les épreuves tiennent sur un arbre en CRLF.** Au F1 du V16, deux fautes de
      `execution-ancres-mutations.js` ne se posaient plus parce que `js/execution.js` était en CRLF.
      80 fichiers suivis sont dans ce cas sur le disque, et un clone frais met **tout** le site en
      CRLF. Faire un clone frais hors du dépôt (avec `core.autocrlf=true`), y rejouer les 16 épreuves
      de `--mutations`, et exiger « 0 non applicable » partout. Corriger chaque motif qui ne tient pas.

      **COCHÉ le 2026-11-11** (agent `v18/a6`, fusion `ec5e188`). Rapport : `en-cours/rapports-v18/a6.md`.
      Clone frais en CRLF (`core.autocrlf=true`), les 16 épreuves rejouées : **toutes leurs fautes
      vues, 0 non applicable, 0 non mesurée** ; chaque épreuve corrigée rejouée verte aussi en LF.
      Avant (`13164d9`) : `vexlien` 5 / 8 (3 non applicables), `git-scen` 22 / 30, `mth-inj` code 2
      (0 / 13), et **34 fautes sur 153** dont le motif tient sur plusieurs lignes ne se posaient plus.

      Corrigé : un module commun `tools/lib/motif-souple.js` (au lieu d'une troisième copie de la
      parade) ; un **témoin** dans les quatre épreuves git, qui n'en avaient pas ; **neuf outils** qui
      rougissaient ou se taisaient sur CRLF, lus désormais en LF (`maths/verite/lib.js` : 58 contrôles
      sur 237 divergeaient sur des leçons intactes ; `verif-sql-exos` sortait en 2 et `verif-chaine`
      le comptait comme une faute vue ; `build-index` I18 ; `build-sources-worker` ; `verif-doc` ;
      `verif-normatif` ; `rejoue-cpp` ; `mesure-langages`). Et **`mth-chif` était vide depuis V16/E2**,
      sans rapport avec le CRLF : la durée d'en-tête rendait son vérificateur rouge sur la page intacte.

      **Un chiffre faux publié** : `pages/etude-inconnu.html` affichait 6 566,0 Ko de code — la mesure
      comptait les `\r` (6 563,7 Ko en LF, 6 732,0 Ko en CRLF). Page réassemblée par son outil, index
      de recherche régénéré (une entrée). C'est ce chiffre qui rougissait `etudes` et `etude-6` dans les
      copies LF des cinq autres agents — trouvé par A1, A2, A3, A4 et A5 chacun de son côté.

      `git-cmd` a duré 82,6 min avec son nouveau témoin, sous charge : son plafond propre passe de 75 à
      120 min (`8e8dadd`).
      **Passage complet de `verif.js --mutations` après la fusion des six branches**, machine au
      repos : **18 épreuves sur 19 OK en 7 131,8 s**, dépôt propre en sortie (`git-cmd` 2 436,5 s,
      `vexancr` 1 251,7 s, `vexec` 1 102,4 s, `git-scen` 642,6 s, `git-graf` 443,0 s). La 19ᵉ,
      `chaine`, NON MESURÉE : c'était la sonde Python de A4 (voir A4) ; après la correction,
      `--mutations --seul=verif-chaine-mutations` : **OK, 9 / 9, 95,5 s**. Libellés `vues` remis
      d'après l'exécution : `verdict` 9 / 9 (et non 6 / 6), `mth-chif` 5 / 5.

      **Reste** : `verif-chaine` n'a pas de témoin intégré (fait une fois à la main) ; `--strict` et
      `--complet` jamais joués sur un clone **entièrement** en CRLF ; `vexec` injecte encore en CRLF
      dans un fichier LF (sans effet sur JS). **Fait le 2026-11-14 sur décision de Noah** : les 78
      fichiers en CRLF ou à fins mêlées du disque remis en LF (chacun vérifié octet pour octet égal
      au blob de l'index, 0 refus), et `core.autocrlf=false` réglé pour ce seul dépôt ; pas de
      `.gitattributes`, pour garder le banc d'essai d'un clone frais en CRLF.

**PHASE A CLOSE le 2026-11-11 — six agents en parallèle, une branche `v18/a<N>` chacun, puis fusion et
passe de vérification par l'orchestrateur.** Cinq des six agents ont trouvé, chacun de son côté, le
même rouge hérité (`etudes`, `etude-6` sur toute copie LF) : A6 l'a soldé. Après la fusion, sur
master :

| mode | résultat |
|---|---|
| `--rapide` | **54 / 54, code 0, 172,6 s** |
| `--mutations` | 18 / 19 OK en 7 131,8 s, dépôt propre ; `chaine` NON MESURÉE → cause trouvée (la sonde Python de A4 et la casse du lecteur), corrigée, rejouée **OK en 95,5 s** |
| `--complet` | **83 / 83, toutes mesurées, code 0, 4 347,6 s** — vert d'un seul passage, ce qu'il n'avait pas été au F1 du V16 |

`--strict` n'a pas été rejoué à part : ses 72 étapes sont toutes parmi les 83 de `--complet`
(listes comparées par `--lister`), et toutes y sont OK. Les journaux et scripts de travail des six
agents sont rangés dans `scratchpad/v18-parallele/a<N>/` (ignoré par git) ; leurs rapports citent
encore l'ancien chemin `D:\test-claude-v18-a<N>\scratchpad\…`.

---

## PHASE B — Les « Cas réel »

Le but n'est pas de supprimer des encadrés, c'est que chacun soit **vrai**. Un fait inventé devient
un fait réel sourcé (le meilleur cas) ou un « Scénario » honnête ; un fait réel mais inexact est
corrigé. Le F1 du V16 a montré la méthode sur quatre leçons : un cas réel sourcé, choisi pour la
notion de la leçon, ne disant que ce que dit la source.

- [x] **B1 · Inventaire, et les suspects.** Extraire les 1 500 encadrés (fichier, titre, texte).
      Classer automatiquement : **SUSPECT** s'il ne porte ni année (`19xx`, `20xx`) ni nom propre
      d'organisation, de produit ou de personne, ou s'il a un sujet générique (« une start-up »,
      « une équipe », « une entreprise », « un développeur »…). Lire 30 encadrés tirés au hasard pour
      **mesurer la précision** de ce classement, et l'ajuster. **Écrire dans ce plan** le nombre de
      suspects par cours et **la composition des lots B4 à B12** : dix cours chacun (le dernier en
      compte neuf ou plus selon le total), du plus suspect au moins suspect.

      **COCHÉ le 2026-11-14.** Outil : `tools/cas-reels/inventaire.js` (ne modifie rien ; `--cours=`,
      `--json`, `--lots`).

      **L'inventaire : 1 551 « Cas réel » dans les 1 540 leçons**, et non 1 500 : 1 500 encadrés
      titrés « Cas réel » (dans 1 489 leçons seulement, pas 1 540 comme l'écrivait le constat) **et 51 sections**
      dont l'intertitre `<h2>`/`<h3>` est « Cas réel » (offensive, crypto, neurones, maths…) — l'apprenant
      les lit pareil. 213 autres intertitres « Cas réel » ne font qu'envelopper un encadré : comptés
      une fois. Premier jet de l'extraction : 1 477 encadrés au lieu de 1 500, parce que 23 encadrés
      ferment par `</div>`, saut de ligne, `</div>` et que l'encadré précédent avalait le suivant ;
      corrigé (on part de chaque titre), 0 écart avec un `grep` des titres.

      **La précision du classement, mesurée sur trois tirages lus à la main** (jugement : un cas est
      *identifiable* s'il nomme un sujet réel précis — organisation, produit, personne, événement —
      qu'une source peut confirmer ; *anonyme* sinon : « une équipe », « un service », un usage général).

      | tirage | rôle | règle | accord | précision des SUSPECT | rappel des anonymes |
      |---|---|---|---:|---:|---:|
      | A, graine 20261114, 30 | réglage | celle du plan | 17/30 | 8/9 | **8/20** |
      | A | réglage | après 1er réglage | 29/30 | 20/21 | 20/20 |
      | B, graine 20261115, 30 | contrôle, lu à l'aveugle | après 1er réglage | 26/30 | 19/22 | 19/20 |
      | B | — | après 2e réglage | 28/30 | 20/22 | 20/20 |
      | **C, graine 20261116, 20** | **neuf, lu à l'aveugle** | **finale** | **18/20** | **11/13** | **11/11** |

      La règle du plan voyait trop peu : les sigles (CRM, CSV, API), les identifiants de code et les
      libellés d'interface passaient pour des noms propres. **Règle finale** : le code, les citations,
      les sigles et les noms des langages enseignés ne comptent plus comme noms ; l'année se cherche
      hors du code ; le sujet est générique s'il **ouvre** l'une des deux premières phrases (« Une équipe
      livre… », « Sur un site… »). SUSPECT = ni année ni nom, **ou** sujet générique sans année, **ou**
      sujet générique sans nom. Elle se trompe du côté prudent (deux faux suspects sur 20 au tirage C,
      aucun anonyme manqué sur les trois tirages). Les rangs jugés anonymes, pour refaire la mesure :
      A = 1,2,5,6,8,10,11,12,13,14,15,19,20,21,23,24,26,27,28,30 ; B = 1,3,4,5,6,7,8,9,14,16,17,19,21,22,
      23,24,25,28,29,30 ; C = 1,3,5,7,9,10,12,13,15,16,19 (outil de tirage : mélange de Fisher-Yates,
      générateur mulberry32, sur l'ordre de `--json`).

      **Résultat : 971 SUSPECTS sur 1 551 (62,6 %).** « Anonyme » ne veut pas dire « inventé » :
      beaucoup sont des usages généraux vrais (« sur un site marchand, `loading="lazy"`… »), mais aucun
      ne tient la règle de B3 (sujet, date, source). Vus en lisant, et à traiter dans les lots :
      `offensive/lecon-01` écrit lui-même « une société **fictive** » sous « Cas réel » ; le cours `stats`
      met en scène une entreprise fictive, « Orbit » ; plusieurs sections du cours `maths` s'ouvrent
      sur « Le scénario suivant… » sous un intertitre « Cas réel ».

      Suspects / « Cas réel », par cours (du plus suspect au moins suspect) :
      `javascript` 49/66 · `python` 40/50 · `html` 30/48 · `css` 27/47 · `react` 24/26 · `sql` 22/24
      `java` 21/23 · `csharp` 20/23 · `php` 20/21 · `ruby` 19/22 · `nodejs` 18/27 · `go` 18/18
      `git` 17/24 · `perl` 17/17 · `powershell` 17/17 · `typescript` 16/20 · `zig` 16/19 · `perf-web` 16/17
      `bdd` 15/15 · `mobile` 15/15 · `kotlin` 14/21 · `lua` 14/20 · `cpp` 13/23 · `rust` 13/22
      `r` 13/17 · `docker` 13/16 · `data-eng` 13/14 · `vb` 13/14 · `dart` 12/16 · `distribue` 12/12
      `c` 11/21 · `clojure` 11/17 · `elixir` 11/17 · `bash` 11/16 · `equipe` 11/14 · `neurones` 11/12
      `julia` 10/16 · `a11y` 10/15 · `asm` 10/15 · `stats` 10/15 · `dataviz` 10/14 · `objc` 10/14
      `compilation` 10/13 · `vscode` 10/11 · `ocaml` 9/18 · `pandas` 9/14 · `pascal` 9/14 · `maths` 9/13
      `archi` 9/12 · `iac` 9/11 · `swift` 8/18 · `ada` 8/14 · `vue` 8/14 · `projets-js` 7/24
      `api` 7/14 · `fortran` 7/14 · `nosql` 7/14 · `os` 7/14 · `prolog` 7/14 · `kubernetes` 7/12
      `llm` 7/12 · `ml` 7/12 · `linux` 7/11 · `algo` 6/28 · `scala` 6/17 · `cobol` 6/14
      `groovy` 6/14 · `formats` 6/12 · `cicd` 6/11 · `markdown` 6/11 · `observabilite` 6/11 · `regex` 6/11
      `reseaux` 6/11 · `erlang` 5/14 · `http` 5/12 · `doc` 5/6 · `haskell` 4/18 · `securite` 4/15
      `sass` 4/14 · `tests` 4/14 · `solidity` 3/17 · `offensive` 3/12 · `graphql` 3/11 · `ux` 3/11
      `lisp` 2/15 · `fsharp` 2/14 · `cloud` 1/12 · `patterns` 1/11 · `wasm` 1/11 · `crypto` 0/11

      **Composition des lots** (dix cours chacun, du plus suspect au moins suspect ; 90 cours = 9 × 10) :

      | case | cours | suspects / « Cas réel » |
      |---|---|---:|
      | B4 | `javascript`, `python`, `html`, `css`, `react`, `sql`, `java`, `csharp`, `php`, `ruby` | 272 / 350 |
      | B5 | `nodejs`, `go`, `git`, `perl`, `powershell`, `typescript`, `zig`, `perf-web`, `bdd`, `mobile` | 165 / 189 |
      | B6 | `kotlin`, `lua`, `cpp`, `rust`, `r`, `docker`, `data-eng`, `vb`, `dart`, `distribue` | 130 / 175 |
      | B7 | `c`, `clojure`, `elixir`, `bash`, `equipe`, `neurones`, `julia`, `a11y`, `asm`, `stats` | 106 / 158 |
      | B8 | `dataviz`, `objc`, `compilation`, `vscode`, `ocaml`, `pandas`, `pascal`, `maths`, `archi`, `iac` | 94 / 134 |
      | B9 | `swift`, `ada`, `vue`, `projets-js`, `api`, `fortran`, `nosql`, `os`, `prolog`, `kubernetes` | 73 / 152 |
      | B10 | `llm`, `ml`, `linux`, `algo`, `scala`, `cobol`, `groovy`, `formats`, `cicd`, `markdown` | 63 / 142 |
      | B11 | `observabilite`, `regex`, `reseaux`, `erlang`, `http`, `doc`, `haskell`, `securite`, `sass`, `tests` | 49 / 126 |
      | B12 | `solidity`, `offensive`, `graphql`, `ux`, `lisp`, `fsharp`, `cloud`, `patterns`, `wasm`, `crypto` | 19 / 125 |

- [ ] **B2 · L'échantillon, pour connaître le vrai taux.** Tirer **150 encadrés** au hasard,
      stratifiés par cours, avec une graine écrite dans le compte rendu (le tirage doit pouvoir être
      refait). Vérifier chacun à une source primaire. Verdict : **VRAI**, **INEXACT** (fait réel,
      détail faux — préciser lequel), **INVÉRIFIABLE**, **INVENTÉ**. Donner le taux de chaque
      verdict, **chez les suspects et chez les autres**, avec l'intervalle à 95 %. Ne rien corriger
      ici : c'est une mesure.
- [x] **B3 · La règle d'écriture, et son garde-fou (en avertissement).** Écrire la règle : un « Cas
      réel » nomme son **sujet**, sa **date** et sa **source**. Ajouter à `verif-contenu.js` un
      contrôle qui la vérifie, **non bloquant pour l'instant** (il ferait échouer des centaines de
      leçons avant les lots), et l'éprouver par injection. Il deviendra bloquant en B13.

      **COCHÉ le 2026-11-14.** **La règle**, écrite dans `docs/enrichissements/NOUVEAUX-COURS.md`
      (§ « La règle des « Cas réel » », le document de méthode des rédacteurs) : titre
      `Cas réel — sujet (année)`, et un dernier paragraphe `<p class="cas-reel__source">Source : …</p>`
      qui nomme un document **daté** ou porte un **lien** ; même forme pour une section `<h2>`/`<h3>`.
      Ce qui ne peut pas être sourcé s'appelle « Scénario », mais le standard exige un cas réel par
      leçon : un vrai cas sourcé sur la même notion vaut mieux qu'un renommage. Style
      `.cas-reel__source` dans `css/components.css`.

      **Le jugement** vit dans un module commun, `tools/cas-reels/extraction.js`, que lisent
      l'inventaire de B1 **et** `verif-contenu.js` : un seul code (après bascule, la sortie
      `--json` de l'inventaire est identique à l'octet, et l'échantillon de B2 aussi). Raisons
      possibles : « titre sans sujet », « titre sans date », « pas de source », « source vide »,
      « source sans date ni lien ». `verif-contenu.js` imprime un bilan **en avertissement** dans
      tous les modes (code 0 en défaut comme en `--strict`) ; `--cas-reel` liste les cas hors de la
      règle et sort en 1 s'il y en a — c'est la commande que B13 rendra bloquante.

      **État mesuré** : 1 551 « Cas réel », **4 conformes**, 1 547 hors de la règle (pas de source
      1 547 ; titre sans date 1 520 ; titre sans sujet 953). Les 4 conformes sont les cas sourcés au
      F1 du V16 (`tests/lecon-11`, `-12`, `-14`, `observabilite/lecon-06`), qui reçoivent leur ligne
      de source d'après le commit `27e0334` (Ticketmaster 19/11/2022 ; NASA, rapport de phase I,
      10/11/1999 ; SEC, ordonnance 34-70694, 16/10/2013 ; Facebook Engineering, 05/10/2021).

      **L'épreuve** `tools/verif-cas-reel-mutations.js` (dans `--mutations`, entrée `casreel`) :
      sur le cas Knight Capital, neuf fautes (source retirée, vidée, sans date ni lien, mal nommée,
      sortie de l'encadré ; titre sans date, sans sujet ; section sans source ; page en CRLF)
      doivent chacune faire signaler ce cas **avec la raison attendue** — le cours `tests` a d'autres
      cas hors règle, donc le code seul ne prouve rien — et quatre témoins négatifs (source par lien,
      tiret court, deux-points, section conforme) le laisser conforme : **9/9, 4/4, code 0, 2,0 s ;
      par le mode, OK en 2,1 s**. Épreuve de l'épreuve, règle sabotée : sans l'exigence de source
      **4/9** (code 1), sans celle de la date **8/9** (code 1), tout jugé hors règle → code 2.
      Cliquets QCM (lexique, biais) verts après les quatre sources ; point fixe des pages dérivées au
      tour 3 (`search-index.js`, `etude-recherche.html`) ; `verif.js --rapide` 54/54, 103,7 s.
- [ ] **B4 · Lot 1** (`javascript`, `python`, `html`, `css`, `react`, `sql`, `java`, `csharp`, `php`, `ruby` — 272 suspects / 350) (cours fixés en B1). **Portée de chaque lot** : tous les encadrés **suspects**
      de B1. Et **tous les encadrés** du lot si B2 a trouvé au moins un INVENTÉ ou un INVÉRIFIABLE
      **hors des suspects**. Pour chacun : vérifier ; INVENTÉ → un cas réel sourcé sur la même
      notion, ou « Scénario » ; INEXACT → corrigé à la source. Rejouer ensuite `verif-contenu
      --strict` et les **deux cliquets QCM** : un mot ajouté à un corps de leçon peut rouvrir
      l'indice lexical d'un QCM. Remède mesuré au V16 : choisir des mots de moins de 6 lettres, le
      seuil de l'outil. Compte rendu : encadrés lus, verdicts, sources citées.
- [ ] **B5 · Lot 2.** (`nodejs`, `go`, `git`, `perl`, `powershell`, `typescript`, `zig`, `perf-web`, `bdd`, `mobile` — 165 suspects / 189) Même portée et même méthode que B4.
- [ ] **B6 · Lot 3.** (`kotlin`, `lua`, `cpp`, `rust`, `r`, `docker`, `data-eng`, `vb`, `dart`, `distribue` — 130 suspects / 175) Idem.
- [ ] **B7 · Lot 4.** (`c`, `clojure`, `elixir`, `bash`, `equipe`, `neurones`, `julia`, `a11y`, `asm`, `stats` — 106 suspects / 158) Idem.
- [ ] **B8 · Lot 5.** (`dataviz`, `objc`, `compilation`, `vscode`, `ocaml`, `pandas`, `pascal`, `maths`, `archi`, `iac` — 94 suspects / 134) Idem.
- [ ] **B9 · Lot 6.** (`swift`, `ada`, `vue`, `projets-js`, `api`, `fortran`, `nosql`, `os`, `prolog`, `kubernetes` — 73 suspects / 152) Idem.
- [ ] **B10 · Lot 7.** (`llm`, `ml`, `linux`, `algo`, `scala`, `cobol`, `groovy`, `formats`, `cicd`, `markdown` — 63 suspects / 142) Idem.
- [ ] **B11 · Lot 8.** (`observabilite`, `regex`, `reseaux`, `erlang`, `http`, `doc`, `haskell`, `securite`, `sass`, `tests` — 49 suspects / 126) Idem.
- [ ] **B12 · Lot 9.** (`solidity`, `offensive`, `graphql`, `ux`, `lisp`, `fsharp`, `cloud`, `patterns`, `wasm`, `crypto` — 19 suspects / 125) Idem.
- [ ] **B13 · Le garde-fou devient bloquant.** Le contrôle de B3 passe en mode `--strict` bloquant.
      Le site doit être à **0 encadré** hors de la règle. Rejouer l'échantillon de B2 avec la **même
      graine** : combien d'INVENTÉ, combien d'INEXACT, comparés au départ. Écrire le chiffre, quel
      qu'il soit.

---

## PHASE C — Les QCM des 22 cours restants

**Méthode : celle de B4 du V16, sans rien en retirer.** Elle est écrite dans le plan V16 (case B4,
et surtout § « LES NEUF DERNIERS COURS »), dans les consignes `scratchpad/CONSIGNE-<COURS>.md`, dans
`scratchpad/REGLE-INTRUS-LEXICAL.md` et dans la sonde `scratchpad/vue-sonde/controle.js` (v2 : elle
charge les stratégies depuis l'outil, jamais une liste recopiée). Ses leçons les plus chères :
**relire le texte rendu**, pas seulement les mesures (46 mesures vertes sur des distracteurs qui ne
voulaient plus rien dire) ; **fermer un indice en rouvre un autre** ; **le dosage se calcule** (viser
25 %, pas 0 %) ; **commiter chaque vague** ; la contre-relecture des corrections trouve encore des
fautes (12,8 à 29,0 % au V16). La bonne réponse et son explication sont **intouchables**, sauf
faute prouvée par exécution. **Cible par cours** : « la plus longue » vers 25 %, et aucune
stratégie nettement au-dessus.

- [ ] **C1 · Préparer la phase.** (a) Mesurer **sur le site entier** les trois indices que les
      relecteurs de B4 n'ont vus que sur des lots (F4) : l'intention prêtée au moteur (30,1 % sur
      un lot), les tics rhétoriques (38,8 %), les absolus que notre motif sous-estime (34,7 %). Ceux
      qui restent exploitables à l'échelle du site entrent dans `tools/mesure-biais-qcm.js`, avec
      leur épreuve, **avant** C2 — sinon les 22 cours seraient traités contre une liste incomplète.
      (b) Écrire la consigne commune de la phase, d'après les consignes de B4. (c) Remesurer les 22
      cours et confirmer l'ordre ci-dessous (nocivité = questions × taux de la meilleure stratégie).
- [ ] **C2 · `cloud`** — 53 questions, la plus longue 92,5 %.
- [ ] **C3 · `reseaux`** — 52 questions, 92,9 %.
- [ ] **C4 · `wasm`** — 50 questions, 96,0 %.
- [ ] **C5 · `ml`** — 52 questions, 92,3 %.
- [ ] **C6 · `erlang`** — 54 questions, 88,9 %.
- [ ] **C7 · `ada`** — 49 questions, 96,6 %.
- [ ] **C8 · `llm`** — 48 questions, 97,9 %.
- [ ] **C9 · `fortran`** — 54 questions, 87,0 %.
- [ ] **C10 · `groovy`** — 54 questions, 87,0 %.
- [ ] **C11 · `patterns`** — 45 questions, 97,8 %.
- [ ] **C12 · `http`** — 48 questions, 89,6 %.
- [ ] **C13 · `graphql`** — 45 questions, 93,3 %.
- [ ] **C14 · `kubernetes`** — 48 questions, 87,5 %.
- [ ] **C15 · `cicd`** — 43 questions, 93,0 %.
- [ ] **C16 · `markdown`** — 45 questions, 88,9 %.
- [ ] **C17 · `distribue`** — 69 questions ; biais **inversé** : la plus longue 5,6 %, « la plus
      détaillée » 56,8 %. Ramener **les deux sens** vers 25 % ; fermer un seul sens retourne
      l'indice (leçon de `mobile`).
- [ ] **C18 · `neurones`** — 65 questions ; la plus longue 15,4 %, « la plus détaillée » 59,4 %.
      Même exigence que C17.
- [ ] **C19 · `formats`** — 45 questions, 84,4 %. ⚠️ `formats/lecon-06` porte un mojibake
      **volontaire** : ne toucher qu'au bloc QCM, et vérifier octet par octet que le reste de la page
      est inchangé.
- [ ] **C20 · `regex`** — 44 questions, 85,8 %. Chaque bonne réponse qui affirme un comportement
      de regex est **exécutée** (un moteur JS au moins ; préciser quand la saveur diffère).
- [ ] **C21 · `compilation`** — 72 questions ; la plus longue 52,1 %, mais « la plus détaillée »
      61,3 % : c'est elle la cible.
- [ ] **C22 · `vscode`** — 46 questions, 81,2 %.
- [ ] **C23 · `offensive`** — 69 questions ; la plus longue 37,7 %, « la plus détaillée » 52,7 %.
- [ ] **C24 · Les restes de B4, et `ux`.** Restes listés au F4 du V16, chacun **prouvé** ou écarté
      avec sa raison :
      - l'intrus lexical inverse d'`asm` (30,3 et 29,5 %, seuil 28 %) et de `vb` (28,0 %) ;
      - les cinq imprécisions d'`asm` ;
      - les deux erreurs de code de `pascal` (`lecon-07`, `lecon-13`), compilées avec Free Pascal
        (`D:\outils-b4\`) ;
      - `fsharp/lecon-12` q2, datée par F# 9 ;
      - pour `ux` : l'énoncé de `lecon-08` q2 sans point d'interrogation, et le bilan q6 qui rejoue
        `lecon-04` q4 au lieu de vérifier.
- [ ] **C25 · Les QCM restent justes après la phase.** Comme B5 du V16 :
      - **0 score orphelin** dans `syntaxe-quiz` (comparaison question par question à l'état
        d'avant C2 ; outil de travail `scratchpad/v16-parallele/b5e2/compare-qcm.js`) ;
      - toutes les questions **jouées** par la sonde d'A1 ;
      - `quiz-index.js` régénéré ;
      - les deux cliquets refigés **après lecture** de ce qu'ils signalent.

      Mesure du site : « la plus longue » (départ **33,5 %**) et la meilleure stratégie.

---

## PHASE D — Les durées annoncées

Au V16, E2 a fixé **durée = max(20, mots visibles ÷ 54)**, où « mots visibles » compte le code comme
du texte. Résultat : `crypto` (65,7 % de code) serait annoncé 43,3 h, `compilation` 50,4 h, plus que
`javascript`. Noah a tranché : **le code compte à part**.

- [ ] **D1 · Fixer la règle.** Mesurer, pour un poids du code `p` ∈ {0 ; 0,25 ; 0,5 ; 1}, les 90
      durées et l'écart entre cours. Retenir une valeur, et **l'écrire avec sa justification**. Si
      elle s'appuie sur une étude de vitesse de lecture du code, la citer et la sourcer ; sinon,
      dire qu'il s'agit d'un choix. La règle est écrite ici et dans l'outil, au même mot près.
- [ ] **D2 · Recalculer les 90 cours.** Mettre à jour `lessonDurations` (`js/data.js`), les
      en-têtes « ~N min » des leçons (le contrôle I28 de `verif-donnees.js` exige qu'ils
      concordent) et les `hours` des fiches. Le script de E2 (`scratchpad/v16-parallele/b5e2/
      recalcule-durees.js`, hors git) entre dans `tools/`. Compte rendu : les 90 durées avant et
      après, et l'écart entre cours.
- [ ] **D3 · Un contrôle pour la règle.** Le « rythme » de `verif-contenu.js` applique la même
      règle. Un nouvel invariant de `verif-donnees.js` vérifie que chaque durée annoncée suit la
      règle. Épreuve : une durée faussée rougit, et reverdit une fois remise.
- [ ] **D4 · `os/lecon-04` au standard.** Seule leçon « maigre » restante (`verif-contenu
      --maigres`). Méthode d'E1 du V16 (`sass/lecon-09`) : schémas, encadrés, glossaire, chaque
      exemple exécuté.

---

## PHASE E — La fraîcheur

221 marques sur 321 n'ont jamais été vérifiées sur une source : 149 posées au V15, et 72 des 172
posées en C1 à C4 du V16, datées seulement par git. Or une date git ne dit qu'une chose : la
marque a au moins cet âge.

- [ ] **E1 · Les marques du V15, première moitié.** Lister les 149 marques (outils de
      `tools/fraicheur/`). Vérifier à la source les 75 premières, dans l'ordre de la liste. Corriger
      ce qui est devenu faux, et inscrire la date de vérification. Compte rendu : marques lues,
      corrections, sources.
- [ ] **E2 · Les marques du V15, seconde moitié** (les 74 suivantes).
- [ ] **E3 · Les 72 marques de C1 à C4 du V16** non vérifiées.
- [ ] **E4 · Ce qui a été vu périmé, et pas corrigé** (F4 du V16) :
      - `nodejs/lecon-15` : la coquille « s'épuie » (la corriger rouvre l'indice lexical d'une
        question : mesurer avant et après), et `pg` présenté comme pilote « officiel » ;
      - `ml/lecon-01` : le « 80 % » sans provenance ;
      - `llm` : « ≈ ¾ de mot » dans deux glossaires, sans dire pour quelle langue.

      Chaque correction est sourcée.
- [ ] **E5 · Express 5.** Le code des leçons Express est écrit pour Express 4, alors que
      `npm install express` installe la 5. Lister ces leçons, installer Express 5 **hors du dépôt**,
      exécuter chaque exemple, et corriger ce qui casse ou a changé de comportement (routes,
      `req.query`, promesses rejetées…). Poser une marque de fraîcheur, avec sa source.

---

## PHASE F — Les liens et le rendu

- [ ] **F1 · Le visualiseur montre une exception qui remonte la pile.** Il n'en a aucun exemple :
      9 leçons, dans 8 langages (Ada, C++, C#, Java, Dart, Perl, Rust, JS), ne peuvent donc pas y
      mener (liste dans `en-cours/rapports-v16/d.md`). Écrire au moins un exemple (lancer, remonter,
      attraper, `finally`), le prouver comme les 26 autres (pas cliqués, comparés au moteur), puis
      relier les 9 leçons. Trancher au passage l'écart de `js/lecon-25` : son exemple `async-rejet`
      **arrête le programme**, comme Node, alors que la leçon (dans le navigateur) dit qu'un rejet non
      géré « ne déclenche aucune réaction ».
- [ ] **F2 · Le décodeur d'erreurs au-delà de 4 langages.** Répartir par langage les 142 leçons qui
      écrivent un nom d'erreur. Ajouter des langages, du plus fréquent au moins fréquent, jusqu'à
      couvrir **au moins la moitié** de ces 142 leçons. Chaque fiche cite le message **réellement
      produit** par l'interpréteur ou le compilateur quand on peut le lancer, hors du dépôt. Puis
      relier les leçons.
- [ ] **F3 · Le décodeur, deuxième passe.** Ajouter une seconde cause aux trois fiches qui en
      manquent (`js-stack`, `js-not-defined`, `sh-command-not-found`). Donner à la page une **ancre
      par erreur**, pour qu'un lien depuis une leçon pré-remplisse le message.
- [ ] **F4 · Les trois défauts d'affichage connus**, antérieurs au V16 :
      - `powershell/lecon-08` déborde de 9 px à 320 px de large ;
      - `js/lecon-34` déborde de 11 px (cause à isoler) ;
      - un mot rouge de `julia/lecon-14` est illisible en thème sombre.

      Chacun est corrigé et vérifié par `verif-rendu`, dans les deux thèmes.
- [ ] **F5 · Le hub des études.** La description longue d'une carte (« 2 019 lignes ») n'est relue
      par aucun contrôle ; seule la formule courte l'est. Étendre le contrôle aux deux, avec son
      épreuve.

---

## PHASE G — Contrôle final

- [ ] **G1 · Les quatre modes de `verif.js`, chacun vert D'UN SEUL PASSAGE.** `--rapide`,
      `--strict`, `--complet`, `--mutations`. Le F1 du V16 n'en a obtenu qu'un sur quatre, et a dû
      trier puis rejouer les autres un par un. Ici, si un mode signale, on corrige puis on repasse le
      **mode entier**. Citer la durée de chacun. Ordre de grandeur mesuré au V16 : `--strict` 27 min,
      `--complet` 93 min, `--mutations` 2 h 25 avec les plafonds propres.
- [ ] **G2 · Mesure globale.** Chaque chiffre est remesuré le jour même, avec la définition du
      départ :
      - « Cas réel » : taux d'inventés sur l'échantillon de B2 (départ, puis arrivée en B13) ;
      - QCM, site entier : réussite de « toujours la plus longue » (départ **33,5 %**) et meilleure
        stratégie ;
      - durées : écart entre cours, avec la règle de D1 ;
      - fraîcheur : marques vérifiées sur une source (départ **100 sur 321**) ;
      - décodeur : langages couverts (départ **4**) ;
      - visualiseur : leçons reliées (départ **43**) ;
      - modes verts d'un seul passage (départ **1 sur 4**).
- [ ] **G3 · Ce qui n'a pas été fait.** Lister et expliquer, sans arrondir, comme le F4 du V16.

---

## Ce que ce plan ne fait pas, et pourquoi

Écrit ici pour qu'on ne le croie pas oublié :
- **78 cours sur 94 n'ont jamais été lus** pour la fraîcheur. Ce plan vérifie les marques qui
  existent (E1 à E3), il n'en pose pas sur de nouveaux cours.
- **Le bac à sable Git n'a pas de dépôt distant** : 9 leçons sur `clone` et `push` ne peuvent pas y
  mener. En simuler un est un projet en soi.
- **Les exercices dont la réponse se lit dans l'énoncé visible** : c'est une convention du site
  entier, pas un défaut de quelques pages ; la changer est une décision de Noah.
- **Les 23 énoncés reformulés** au V16 perdent leur historique dans l'examen blanc et la révision
  espacée : assumé au V16, pas repris ici.
- **Les `cours.html` et les blocs JSON** ne peuvent pas porter de marque de fraîcheur.

---

## Fin de chantier

Quand toutes les cases sont cochées, le wrapper déclenche la **passe de sécurité** : vérification
globale, rapport dans `docs/audits/VERIF-FINALE.md` avec un verdict en première ligne, puis extinction
automatique si le verdict est vert.
