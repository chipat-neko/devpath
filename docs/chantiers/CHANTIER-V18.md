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
| Titres d'encadré « Cas réel » sur le site | **1 500**, dans **1 540 leçons sur 1 540** (chacune en porte au moins un) |
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
  les cache).
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

- [ ] **A1 · La sonde qui joue les QCM entre dans la chaîne.** Pendant B5 du V16, une sonde a joué
      les 6 167 questions dans Chrome et relu `syntaxe-quiz` — puis elle est restée dans le dossier
      de travail de l'agent : `scratchpad/v16-parallele/b5e2/joue-qcm.js` (hors git ; si elle a
      disparu, la réécrire d'après `en-cours/rapports-v16/b5e2.md`). La ramener dans
      `tools/preuves/`, la brancher dans `--complet`, et lui écrire son épreuve par injection : une
      bonne réponse qui ne compte pas, un score qui ne s'enregistre pas, une option en double —
      chacune doit la faire rougir. Citer sa durée et le nombre de questions jouées.
- [ ] **A2 · L'épreuve par mutations de D2 entre dans `--mutations`.** Script de travail
      `scratchpad/v16-parallele/d/mutations-d2.js` (9 fautes sur 9 au V16). Le ramener dans
      `tools/`, l'ajouter à la liste des épreuves de `verif.js --mutations`, et le rejouer par ce mode.
- [ ] **A3 · Les domaines interdits ont un contrôle.** Aucun contrôle statique ne cherche
      `cdnjs.cloudflare.com`, `fonts.googleapis.com` et `fonts.gstatic.com` dans les 1 540 leçons,
      et la sonde réseau range les deux derniers dans son bruit Google. Écrire le contrôle (balises
      et attributs **réels** seulement : `html/lecon-25` et `html/lecon-35` les citent à dessein, en
      texte ou en code échappé), le mettre dans `--rapide`, et sortir `fonts.*` du bruit de
      `tools/preuves/sonde-clic-reseau.js`. Épreuve : une `<link>` réelle vers chaque domaine,
      injectée dans une leçon, doit rougir les deux contrôles.
- [ ] **A4 · La sonde Python cesse d'être intermittente.** `py-lec` laisse parfois 3 blocs sans
      sortie en 20 s quand la machine est chargée, jamais les mêmes ; 5 passages verts sur 5 au
      repos. Lu dans `tools/preuves/python-lecon.js` : elle passe au bloc suivant dès la **première
      ligne** de sortie, sans attendre la fin du bloc précédent. Établir la cause **sous charge**
      (la sonde lancée pendant un `--complet`), corriger, et prouver : 0 « MOTEUR KO » sur au moins
      5 passages sous charge, et un bloc qui ne démarre vraiment pas rougit toujours.
- [ ] **A5 · Les deux autres intermittents.** `verif-rendu` sur `bdd/lecon-01`, et le premier
      chargement de `tools/preuves/git-graphe.js`, échouent parfois puis passent seuls. Reproduire,
      isoler la cause, corriger — ou, si la cause est hors du site, l'établir par un témoin qui a la
      forme exacte du cas, et l'écrire.
- [ ] **A6 · Les épreuves tiennent sur un arbre en CRLF.** Au F1 du V16, deux fautes de
      `execution-ancres-mutations.js` ne se posaient plus parce que `js/execution.js` était en CRLF.
      80 fichiers suivis sont dans ce cas sur le disque, et un clone frais met **tout** le site en
      CRLF. Faire un clone frais hors du dépôt (avec `core.autocrlf=true`), y rejouer les 16 épreuves
      de `--mutations`, et exiger « 0 non applicable » partout. Corriger chaque motif qui ne tient pas.

---

## PHASE B — Les « Cas réel »

Le but n'est pas de supprimer des encadrés, c'est que chacun soit **vrai**. Un fait inventé devient
un fait réel sourcé (le meilleur cas) ou un « Scénario » honnête ; un fait réel mais inexact est
corrigé. Le F1 du V16 a montré la méthode sur quatre leçons : un cas réel sourcé, choisi pour la
notion de la leçon, ne disant que ce que dit la source.

- [ ] **B1 · Inventaire, et les suspects.** Extraire les 1 500 encadrés (fichier, titre, texte).
      Classer automatiquement : **SUSPECT** s'il ne porte ni année (`19xx`, `20xx`) ni nom propre
      d'organisation, de produit ou de personne, ou s'il a un sujet générique (« une start-up »,
      « une équipe », « une entreprise », « un développeur »…). Lire 30 encadrés tirés au hasard pour
      **mesurer la précision** de ce classement, et l'ajuster. **Écrire dans ce plan** le nombre de
      suspects par cours et **la composition des lots B4 à B12** : dix cours chacun (le dernier en
      compte neuf ou plus selon le total), du plus suspect au moins suspect.
- [ ] **B2 · L'échantillon, pour connaître le vrai taux.** Tirer **150 encadrés** au hasard,
      stratifiés par cours, avec une graine écrite dans le compte rendu (le tirage doit pouvoir être
      refait). Vérifier chacun à une source primaire. Verdict : **VRAI**, **INEXACT** (fait réel,
      détail faux — préciser lequel), **INVÉRIFIABLE**, **INVENTÉ**. Donner le taux de chaque
      verdict, **chez les suspects et chez les autres**, avec l'intervalle à 95 %. Ne rien corriger
      ici : c'est une mesure.
- [ ] **B3 · La règle d'écriture, et son garde-fou (en avertissement).** Écrire la règle : un « Cas
      réel » nomme son **sujet**, sa **date** et sa **source**. Ajouter à `verif-contenu.js` un
      contrôle qui la vérifie, **non bloquant pour l'instant** (il ferait échouer des centaines de
      leçons avant les lots), et l'éprouver par injection. Il deviendra bloquant en B13.
- [ ] **B4 · Lot 1** (cours fixés en B1). **Portée de chaque lot** : tous les encadrés **suspects**
      de B1. Et **tous les encadrés** du lot si B2 a trouvé au moins un INVENTÉ ou un INVÉRIFIABLE
      **hors des suspects**. Pour chacun : vérifier ; INVENTÉ → un cas réel sourcé sur la même
      notion, ou « Scénario » ; INEXACT → corrigé à la source. Rejouer ensuite `verif-contenu
      --strict` et les **deux cliquets QCM** : un mot ajouté à un corps de leçon peut rouvrir
      l'indice lexical d'un QCM. Remède mesuré au V16 : choisir des mots de moins de 6 lettres, le
      seuil de l'outil. Compte rendu : encadrés lus, verdicts, sources citées.
- [ ] **B5 · Lot 2.** Même portée et même méthode que B4.
- [ ] **B6 · Lot 3.** Idem.
- [ ] **B7 · Lot 4.** Idem.
- [ ] **B8 · Lot 5.** Idem.
- [ ] **B9 · Lot 6.** Idem.
- [ ] **B10 · Lot 7.** Idem.
- [ ] **B11 · Lot 8.** Idem.
- [ ] **B12 · Lot 9.** Idem.
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
