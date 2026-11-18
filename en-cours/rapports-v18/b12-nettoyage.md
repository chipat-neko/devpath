# Rapport V18 — case B12, lot 9 : le nettoyage (copie `b12-nettoyage`, branche `v18/b12-nettoyage`)

Copie de travail `D:\test-claude-b12-nettoyage`, partie de `3827e4f`. Quatre retouches que les agents d'écriture
du lot 9 n'avaient pas le droit de faire : le « Cas réel » de `python/lecon-28` (sujet dont le foyer est
`cloud/lecon-12`), les passages d'`offensive` qui racontaient encore les anciens cas hors des encadrés, l'encadré
« Ce que ce cas dit de l'étape 1 » d'`offensive/lecon-12`, et deux raisons non sourcées dans le corps de
`fsharp/lecon-09`. Scripts et pièces dans `scratchpad/b12-nettoyage/` (ignoré par git) : `remplacer.js`
(remplacements exacts et uniques, ou d'une ligne entière repérée par un fragment unique ; refuse une ancre absente
ou multiple et tout CR), les spécifications `spec-*.js`, `mots.js` (mots longs et mots étrangers d'une option, à la
définition exacte de `mesure-lexique-qcm.js`), `texte.js`, et les documents ouverts dans `web/`.

**Commits** (branche `v18/b12-nettoyage`) : `f582c99` (tâche 1, python), `417169e` (tâche 2, offensive),
`9823d8b` (tâche 3, fsharp), puis le commit de ce rapport.

## Tâche 1 — `pages/python/lecon-28.html`, « Cas réel » n° 1

- **Notion de la leçon** : automatiser une tâche avec un script (`pathlib`, `subprocess`, `argparse`, planification) ;
  l'encadré relie le cas à la règle « un script vérifie ses arguments avant d'agir » et aux arguments
  obligatoires / options à valeur par défaut d'`argparse`.
- **Ancien cas** : « Cas réel — la commande qui a arrêté Amazon S3 (2017) », intertitre « Cas réel : une commande
  mal saisie », source AWS `aws.amazon.com/message/41926/`. Sujet et source dont le **foyer est `cloud/lecon-12`**.
- **Nouveau cas** : « **Cas réel — UniSuper et le paramètre laissé vide (2024)** », intertitre repris en
  « Cas réel : un paramètre laissé vide ». Ni le QCM, ni les exercices, ni l'antisèche, ni le glossaire, ni le
  récapitulatif ne racontaient S3 (vérifié par recherche) : rien d'autre à mettre d'accord.
- **Unicité** : « UniSuper », « GCVE », « VMware Engine » et l'URL de la source absents de tout `pages/`, de
  `tools/cas-reels/lots/foyers.md` et des réservations des lots (`b5` à `b12`) ; réservé par une ligne ajoutée à la
  fin de `D:\test-claude\scratchpad\v18-parallele\b12-reservations.txt`.
  `node tools/cas-reels/lots/doublons.js` : **3** sources partagées entre cours (Debian 12, react.dev, WebKit 15.4),
  contre 4 à la base — le post-mortem S3, partagé avec `cloud/lecon-12`, ne l'est plus.
- **Source ouverte** (primaire, texte complet lu, téléchargé dans `web/gcve.html`) : Google Cloud Customer Support,
  « Sharing details on a recent incident impacting one of our customers », 24 mai 2024,
  https://cloud.google.com/blog/products/infrastructure/details-of-google-cloud-gcve-incident .
  Écartée : la déclaration commune d'UniSuper et de Google (unisuper.com.au : défi anti-robot ; copie de l'Internet
  Archive refusée à l'outil web comme à curl) — d'où l'absence de toute précision qu'elle seule donnerait (date du
  2 mai, nature du client).

| Affirmation du cas | Où la source la dit |
|---|---|
| En mai 2024, Google Cloud publie le compte rendu d'un incident qui a touché son client UniSuper, en Australie | date du billet (May 24, 2024) ; « A Google Cloud incident earlier this month impacted our customer, UniSuper, in Australia » |
| Début 2023, des opérateurs de Google avaient déployé l'un des clouds privés de ce client (VMware Engine) avec un outil interne | « In early 2023, Google operators used an internal tool to deploy one of the customer's GCVE Private Clouds » |
| Un paramètre d'entrée laissé vide ; une valeur par défaut, inconnue à l'époque, lui est attribuée : une durée fixe d'un an | « one input parameter was left blank » ; « the system assigned a then unknown default fixed 1 year term value for this parameter » |
| Au bout de l'an, le cloud privé est supprimé automatiquement | « After the end of the system-assigned 1 year period, the customer's GCVE Private Cloud was deleted » ; TL;DR « with automatic deletion at the end of that period » |
| Sans que le client soit prévenu, puisque la suppression ne venait pas d'une demande de sa part | « No customer notification was sent because the deletion was triggered as a result of a parameter being left blank … and not due a customer deletion request » |
| Les équipes du client et de Google travaillent jour et nuit pendant plusieurs jours pour le restaurer, avec ses applications et ses données | « The customer and Google teams worked 24x7 over several days to recover the customer's GCVE Private Cloud, … restore its applications, and recover data » |
| Aidées notamment par des sauvegardes stockées dans Google Cloud Storage, dans la même région, épargnées par la suppression | « Data backups that were stored in Google Cloud Storage in the same region were not impacted by the deletion, and, along with third party backup software, were instrumental » |
| Google abandonne l'outil interne et corrige le comportement qui programmait la suppression | « We deprecated the internal tool that triggered this sequence of events » ; « We corrected the system behavior that sets GCVE Private Clouds for deletion for such deployment workflows » |
| Phrase de liaison (argparse : ce qui est indispensable se déclare obligatoire ; vérifier ses arguments avant d'agir) | conseil de la leçon (argument positionnel obligatoire, `required=True` pour une option), pas une affirmation sur le cas |

Mot évité pour le cliquet : « système » (« le système lui avait attribué » → « une valeur par défaut lui avait été
attribuée ») — le mot entrait dans la page et touche le distracteur « platform (le système hôte) » ; l'ancien texte
ne le portait que dans « sous-système », un seul jeton.

## Tâche 2 — `pages/offensive/`, les passages hors encadré

Chaque passage repris résume le NOUVEAU cas de sa leçon sans rien dire que l'encadré et sa source ne disent ;
sources rouvertes pour les faits repris : DEVCORE et l'avis GHSA (API GitHub), la fiche NVD de CVE-2024-4577
(9,8), le billet de Twitter (copie de l'Internet Archive téléchargée au lot 9, l'Archive refusant curl aujourd'hui),
ian.sh et Paradox.ai, le 8-K/A de 23andMe (EDGAR) et l'ICO, Wiz et le MSRC, le billet de PyTorch, le message
d'Andres Freund (openwall) et son message Mastodon (API), le Legal Update de l'Iowa (PDF lu avec `pypdf`).

| Page | Nature | Avant → après (en une ligne) |
|---|---|---|
| `offensive/lecon-04` | méta | « TalkTalk, 156 959 clients, 400 000 £ d'amende » → « PHP-CGI (2024), une parade de 2012 en liste noire contournée sous Windows par une conversion de caractères » |
| `offensive/lecon-04` | objectif | « la brèche TalkTalk de 2015, ses 156 959 clients et son amende » → « PHP-CGI en 2024, où une parade de 2012 en liste noire n'a pas tenu sous Windows » |
| `offensive/lecon-04` | antisèche | TalkTalk (injection SQL, 156 959 clients, 400 000 £) → PHP-CGI (2024) : la parade de 2012 ne lisait plus d'options quand la requête commençait par un tiret ; sous Windows (pages de codes 932, 936, 950), « Best-Fit » change 0xAD en tiret après le contrôle ; exécution de code à distance, 9,8 |
| `offensive/lecon-05` | méta | « le ver Samy, plus d'un million de profils en 20 heures » → « Twitter (2010), un XSS stocké « onMouseOver » qui s'exécutait au survol d'un lien, réapparu après une mise à jour du site » |
| `offensive/lecon-05` | objectif | ver Samy → « la faille « onMouseOver » de Twitter en 2010, un XSS stocké déjà corrigé, rouvert par une mise à jour » |
| `offensive/lecon-05` | antisèche | Ver Samy (XSS auto-propageant, > 1 million de profils) → Twitter (2010) : XSS stocké exécuté au simple survol d'un lien, sans clic ; corrigé le mois précédent, rouvert par une mise à jour |
| `offensive/lecon-05` | glossaire « Ver » | « Un XSS stocké auto-propageant, comme le ver Samy, en est un » → « Un XSS stocké auto-propageant en est un » (le billet de Twitter ne parle pas de ver : pas d'exemple plutôt qu'un exemple non sourcé) |
| `offensive/lecon-06` | méta | « First American Financial, 885 millions de documents… » → « McHire (2025), où retirer un au numéro d'une conversation livrait les coordonnées d'une autre personne » |
| `offensive/lecon-06` | objectif | « First American Financial et ses 885 millions de documents » → « McHire en 2025, un identifiant qu'il suffisait de décrémenter et aucune vérification d'accès » |
| `offensive/lecon-06` | antisèche | First American (identifiants séquentiels, ~885 millions) → McHire (2025) : `lead_id` qui se suit, aucune vérification d'accès ; plus de 64 millions de candidats selon les chercheurs, la plupart des conversations sans candidat selon Paradox.ai |
| `offensive/lecon-08` | méta | « Firesheep (2010), sessions captées en clair sur Wi-Fi ouvert » → « 23andMe (2023), des comptes ouverts par bourrage d'identifiants, et par eux des fichiers sur d'autres clients » |
| `offensive/lecon-08` | objectif | « Firesheep et les sessions captées en clair » → « 23andMe, le bourrage d'identifiants de 2023 et l'amende infligée en 2025 » |
| `offensive/lecon-08` | antisèche | Firesheep (2010) → 23andMe (2023) : mots de passe fuités ailleurs, ~0,1 % des comptes, et par eux des fichiers sur d'autres clients ; aucun mot de passe cassé ; amende de l'ICO en 2025, 2,31 M£ |
| `offensive/lecon-09` | méta | « Uber 2016, clé AWS…, 57 millions d'usagers…, condamnation en 2023 » → « le jeton SAS de Microsoft (2023), publié sur GitHub en 2020, valable jusqu'en 2051, repéré par un outil de Microsoft mais classé à tort comme faux positif, révoqué en juin 2023 » |
| `offensive/lecon-09` | objectif | « Uber 2016, une clé lue dans un dépôt, et le coût d'une fuite étouffée » → « le jeton SAS publié sur GitHub en 2020 par un chercheur de Microsoft, révoqué en 2023, et l'alerte classée à tort en faux positif » |
| `offensive/lecon-09` | antisèche | Uber (2016) → Jeton SAS de Microsoft (2023) : dépôt public, tout le compte, contrôle total, expiration repoussée à 2051, 38 To ; repéré par un outil de Microsoft, classé faux positif ; révoqué le 24 juin 2023 |
| `offensive/lecon-09` | glossaire « Dissimulation de fuite » | « … : le cas Uber en a fait la démonstration » retiré (le nouveau cas n'a rien d'une dissimulation) ; la définition précise « au lieu de la déclarer aux autorités et aux usagers touchés » (voir le cliquet) |
| `offensive/lecon-09` | **QCM 4** | « Dans le cas Uber (2016), comment les attaquants ont-ils atteint… ? » → « Dans le cas du jeton SAS de Microsoft (2023), comment 38 To de données internes se sont-ils retrouvés accessibles ? » ; même notion (un secret qui fuit se lit, il ne se casse pas) ; quatre options, une juste, `correct` gardé à 2 : « Par une adresse publiée dans un dépôt GitHub public, dont le jeton SAS donnait le contrôle total de tout le compte de stockage Azure » ; distracteurs : clé privée laissée dans l'historique et essayée par des robots de scan, mot de passe de service écrit en dur jamais signalé, variable d'environnement imprimée dans un journal public ; longueurs 136 / 126 / **132** / 121 ; `explain` réécrite pour réfuter ces trois distracteurs |
| `offensive/lecon-09` | exercice à trou | « la faute de GESTION du cas Uber… (un mot) », accept « dissimulation »… → « la faute de SURVEILLANCE du cas Microsoft, au-delà du jeton trop large : une alerte classée à tort en … (deux mots) », accept « faux positif », « un faux positif », « faux-positif », « fausse alerte »… ; indices refaits |
| `offensive/lecon-09` | **exercice 3** | « Le cas Uber cumule deux fautes… (technique / de gestion) » → « Le cas du jeton SAS de Microsoft cumule deux fautes… (technique / de surveillance) » ; même compétence (séparer la faille technique et la faute humaine, chacune avec sa parade) ; solution : jeton trop large publié (parade : pas de secret dans une adresse publiée, jeton au moindre privilège, en lecture seule, de courte vie — bonnes pratiques du MSRC —, révocation) ; alerte classée faux positif, révocation seulement en juin 2023 après l'alerte de Wiz (parade : vérifier chaque alerte avant de l'écarter, révoquer d'abord) |
| `offensive/lecon-10` | méta | « event-stream (2018), … Copay » → « PyTorch-nightly (2022), une dépendance torchtriton détournée par un homonyme déposé sur PyPI, l'index public, que pip installait en priorité » |
| `offensive/lecon-10` | objectif | « event-stream et le vol ciblé via une dépendance transitive » → « PyTorch-nightly et le paquet torchtriton, une confusion de dépendances sur l'index public » |
| `offensive/lecon-10` | antisèche | event-stream (2018) → PyTorch-nightly (2022) : dépendance torchtriton de l'index de PyTorch → homonyme piégé sur PyPI, prioritaire → installé par pip du 25 au 30 décembre ; aucune faille dans PyTorch lui-même |
| `offensive/lecon-10` | exercice à trou | « où était réellement la charge du cas event-stream (deux mots) » → « … du cas PyTorch-nightly (deux mots) » ; accept « une dépendance », « torchtriton »… ; indices refaits |
| `offensive/lecon-10` | **exercice 3** | « Le cas event-stream… (social, technique, invisibilité) » → « Le cas PyTorch-nightly… (mécanisme de l'attaque, endroit de la charge, réglage qui l'a laissée passer) » ; même compétence (rattacher trois failles de la leçon à un cas, une mesure chacune) ; solution : confusion de dépendances (réserver ses noms — PyTorch a enregistré un paquet factice —, résoudre les noms internes depuis l'index de l'éditeur) ; charge dans une dépendance (surveiller l'arbre entier) ; priorité de PyPI et choix par défaut de pip (épingler la source, verrouiller par empreinte) |
| `offensive/lecon-11` | antisèche | « N'a touché que des branches de dev » → « Encore peu intégrée par les distributions, et surtout dans des versions préliminaires » (Freund : « not yet widely been integrated by linux distributions, and where they have, mostly in pre-release versions ») ; « un binaire de test opaque » → « des fichiers de test opaques » (Freund en nomme deux) |
| `offensive/lecon-11` | **explication du QCM 4** | « en mesurant les performances d'une base de données, remarqua un surcoût de ~500 ms » → « en faisant des mesures de performance fines, vit les processus sshd consommer étonnamment de processeur — les connexions SSH prenaient 0,8 s au lieu de 0,3 s, ~500 ms de trop » (Mastodon : « micro-benchmarking », « sshd processes were using a surprising amount of CPU » ; openwall : 0m0.299s / 0m0.807s) ; options inchangées |
| `offensive/lecon-12` | encadré `callout--warn` | « Les deux auditeurs avaient un mandat écrit, précis sur les actions autorisées. » → « Les deux auditeurs avaient un mandat écrit et une lettre d'autorisation. » ; la suite de l'encadré (« celui qui signe a-t-il autorité sur la cible ? ») reste juste (Legal Update : « courthouses are not under the control of the judicial branch ») ; l'exercice qui accepte « un mandat écrit » (exos n° 1) porte sur le cadrage de « Rideau », reste juste : non touché |

Décompte : **28 passages repris** (le titre du commit `417169e` dit « 30 » par erreur de compte ; son détail, leçon par leçon, fait bien 28) — 04 : 3 ; 05 : 4 ; 06 : 3 ; 08 : 3 ; 09 : 7 ; 10 : 5 ; 11 : 2 (l'antisèche,
l'explication du QCM 4) ; 12 : 1 (la phrase de l'encadré). Plus aucune mention de TalkTalk, Samy, First American,
Firesheep, Uber ou event-stream dans `pages/offensive/`.

**Cliquets en cours de route.** Premier jet du QCM 4 d'`offensive/lecon-09` : `verif-qcm-lexique.js` → **1**
(`offensive`, PROPORTION 64,6 % → 66,7 %, au-delà de la latitude de 2 points) ; la bonne réponse portait 1 mot
étranger sur 8 mots longs, les distracteurs 5 à 7. Les trois distracteurs ont été réécrits avec le vocabulaire de
la leçon jusqu'à **8 mots longs et 1 étranger chacun** (règle du `w` et du `k`, mesurés avec `mots.js`) : la question
est fermée (l'ancienne était « RETOURNÉE PI ») et le cours passe de 69 à 68 questions « à mettre en forme ». La
PROPORTION du cours se lit à 66,0 % contre 64,6 % à la base : c'est l'effet arithmétique d'une question retournée
(rendement 0) qui cesse de trancher, pas une question rouverte — `diff` des listes `--liste=offensive` avant/après :
seule la question 4 de la leçon 09 change. `lexique-diff.js` a signalé, au premier jet, « usagers » PERDU (mot des
options d'Uber, qui sortait de la page avec la méta et l'antisèche) et « courte », « examiner » GAGNÉS (mots de
distracteurs des QCM 1 et 2, entrés par la solution de l'exercice 3) : « de courte durée » → « à durée de vie
brève », « examiner » → « vérifier », et la définition de « Dissimulation de fuite » nomme les « usagers touchés »
(phrase exacte, dans un passage déjà repris).

## Tâche 3 — `pages/fsharp/lecon-09.html`, corps de la leçon

| Passage | Avant → après |
|---|---|
| « Où F# s'emploie », l. 166 | « la finance (modélisation de produits, calcul de risque — sa sûreté et ses unités de mesure y excellent) » → « la finance (modélisation de produits, calcul de risque — F# y offre sa sûreté de typage et ses unités de mesure) » |
| légende de la figure, l. 179 | « finance (où unités de mesure et typage fort évitent les erreurs coûteuses) » → « finance (où F# offre ses unités de mesure et son typage fort) » |

Les deux passages disent ce que F# offre, et non plus pourquoi la finance l'aurait adopté ; l'encadré (Don Syme, HOPL IV,
2020) n'est pas touché.

## Contrôles

Sur l'état commité `9823d8b` (avant le commit de ce rapport) :

- `node tools/verif-contenu.js --cas-reel --cours=python` → **0** (50 conformes sur 50) ;
  `--cours=offensive` → **0** (12 sur 12) ; `--cours=fsharp` → **0** (14 sur 14) ;
- `node tools/verif-contenu.js --strict` → **0** ;
- `node tools/verif-html.js` → **0** ;
- `node tools/verif-domaines-interdits.js` → **0** ;
- `node tools/cas-reels/lots/lexique-diff.js D:/test-claude-b12-nettoyage 3827e4f` → **0 écart** (10 pages
  comparées) ;
- `node tools/verif-qcm-lexique.js` → **0** ; `node tools/verif-qcm-biais.js` → **0** ;
- `node tools/verif-explain-orpheline.js` → **0** (16 cours sans vague repérable, non mesurés, comme à la base) ;
- 0 CR dans chacun des 10 fichiers modifiés (compté avec node) ;
- `node tools/cas-reels/lots/doublons.js` → 3 sources partagées entre cours (4 à la base : S3 réglé) ;
- `node tools/cas-reels/lots/controle-branche.js D:/test-claude-b12-nettoyage 3827e4f` → **code 1, attendu** :
  3 commits, 10 pages, zones « Cas réel » 10 avant / 10 après ; 8 signalements, tous « HORS « Cas réel » » sur les
  pages et passages de la consigne — `fsharp/lecon-09` (l. 166), `offensive/lecon-04`, `05`, `06`, `08`, `09`, `10`
  (premier octet différent : la méta-description) et `offensive/lecon-11` (l'antisèche ; l'explication du QCM 4 suit
  plus loin dans le même fichier). Rien d'autre :
  aucun CR, aucun domaine interdit, aucun type d'encadré changé, chaque commit porte la ligne Co-Authored-By.
  `python/lecon-28` et `offensive/lecon-12` ne sont pas signalés : leurs retouches sont dans la zone du « Cas réel »
  (l'encadré et son intertitre ; la section `<h2>Cas réel — Coalfire…</h2>` qui contient le `callout--warn`).
- `node tools/verif.js --rapide` → **code 1**, 54 étapes en 435,0 s, **6 signalées** :
  - `donnees` : l'invariant **I18** seul (8 erreurs : 4 index publiés divergents, 9 entrées périmées, dont le QCM
    « Dans le cas Uber (2016)… » et les antisèches d'`offensive`) — toléré, index régénérés après la fusion ;
  - `doc-ref` (« fragments distincts = 9 022 », « 128 leçons qui renvoient à un document ») et `doc-rec`
    (« 1 508 citent la source » introuvable) — tolérés, chiffres du cours `doc` mesurés sur tout le site ;
  - `normatf` (5 échecs) — **causé par le nouveau QCM 4 d'`offensive/lecon-09`, et dans le bon sens** : l'ancien
    violait la recommandation `S3` du cours `doc` (bonne réponse de 98 caractères, distracteurs de 136 à 144, hors de
    la bande 70-130 %), le nouveau la respecte (vérifié avec `tools/doc/mesures/conformite-quiz.js` : la question 4
    passe de « faux » à « vrai ») ; la mesure du jour donne 5 253 conformes et 850 manquements, et `offensive`
    devient conforme à `S4` (68 / 89 cours), là où `pages/doc/lecon-03.html` publie 5 252 / 6 103 et 67 / 89. Même
    nature que `doc-ref` : un chiffre du cours `doc` mesuré sur tout le site, page hors de ma portée ;
  - `etudes` et `etude-6` — une seule ligne : `pages/etude-inconnu.html` publie « 6560.3 Ko » de leçons, la mesure
    du jour donne « 6560.6 Ko » (le texte ajouté par les trois tâches) ; page d'étude assemblée, index dérivé hors
    de ma portée, à réassembler avec les autres après la fusion.
  Toutes les autres étapes sont vertes, dont `contenu`, `qcmbiai`, `qcmlexi`, `fraich`, `caract`, `exemple`.

## Ce qui reste ouvert

1. **Après la fusion** : régénérer les index dérivés (`build-index.js --write --fresh` : `js/search-index.js`,
   `js/quiz-index.js`, `js/antiseches-data.js` gardent le QCM Uber et les anciennes antisèches) ; réassembler
   `pages/etude-inconnu.html` ; mettre à jour les chiffres publiés du cours `doc` (`doc-ref`, `doc-rec`, et
   `normatf` : S3 = 5 253 / 6 103, S4 = 68 / 89).
2. **Registre `foyers.md`** (je n'y ai pas touché) : inscrire « Google Cloud supprime le cloud privé VMware Engine
   d'UniSuper — un paramètre laissé vide, une durée d'un an par défaut (mai 2024) » → `python/lecon-28#1`.
3. **`python/lecon-28`** : une seule source, celle de Google ; la déclaration commune d'UniSuper et de Google n'a pas
   pu être lue (anti-robot, Internet Archive refusée) — le cas ne dit donc ni la date exacte de la panne ni ce
   qu'est UniSuper. La phrase finale (argparse) est un conseil de la leçon, pas un fait du cas.
4. **`offensive/lecon-11`, hors de ma part** : la méta-description dit la porte dérobée « arrêtée avant les versions
   stables », plus fort que Freund (« not yet widely been integrated … and where they have, mostly in pre-release
   versions ») ; la bonne réponse du QCM 2 parle d'« un fichier de test binaire opaque » quand Freund en nomme deux.
   À reprendre au même titre que l'antisèche, si l'orchestrateur le juge utile.
5. **`offensive/lecon-12`, hors de ma part** : la solution de l'exercice 1 dit « le batiment appartenait au comte » ;
   le Legal Update dit que le palais de justice abrite des services du comté, que sa sécurité relève du shérif du
   comté et que les palais de justice « are not under the control of the judicial branch » — « relevait du comté »
   serait exact, « appartenait » n'est pas dit. Le même document note que le contrat de 2019 autorisait le
   crochetage des serrures (*lockpicking*) : la nouvelle phrase de l'encadré (« un mandat écrit et une lettre
   d'autorisation ») ne contredit rien.
6. **`offensive/lecon-05`, glossaire « Ver »** : l'exemple Samy est retiré sans remplaçant ; Twitter ne qualifie pas
   la faille « onMouseOver » de ver (les retweets à l'insu en ont l'allure, mais la source ne le dit pas).
7. **`offensive/lecon-09`** : le récapitulatif garde « et de ne jamais dissimuler » (règle générale, toujours juste) ;
   le nouveau cas ne comporte aucune dissimulation, la notion ne reste portée que par le glossaire. Le distracteur
   n° 2 du QCM 4 (« … que le scanner de secrets de Microsoft n'avait jamais signalé ») frôle volontairement l'histoire
   du faux positif ; il est faux deux fois (pas de mot de passe en dur, et l'outil avait bien signalé l'adresse).
8. **`lexique-diff.js` et les QCM réécrits** : l'outil compare la page aux mots des options de la BASE ; quand un QCM
   change d'options, un mot de l'ancienne option qui sort de la page compte encore (« usagers » ici). Le zéro a été
   obtenu par une phrase exacte, mais l'outil gagnerait à lire les options d'aujourd'hui pour les questions changées.
9. Une contre-relecture du nouveau cas de `python/lecon-28` et des 28 passages repris reste à faire (consigne).
