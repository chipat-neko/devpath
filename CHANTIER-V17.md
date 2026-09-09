# Chantier V17 — les garde-fous qui mentent

Plan de travail de l'autonomie. **Source de vérité : ce fichier.** Chaque réveil lit ce plan, prend la
**première case non cochée**, la traite entièrement, la coche avec un compte rendu chiffré, puis passe
à la suivante. Le chantier est fini quand il ne reste aucune case `- [ ]`.

**⚠️ CE PLAN PASSE AVANT `CHANTIER-V16.md`, qui n'est pas terminé (8 cases sur 22).** Ce n'est pas un
caprice d'ordre : le V16 réécrit les QCM cours par cours, et l'audit du 2026-09-08 a montré que
`js/quiz-index.js` — l'index que lit la page d'examen — n'était **pas** régénéré, et que le garde-fou
censé le détecter était **vert**. Chaque cours détordu restait donc devinable là où l'apprenant est
évalué. Continuer le V16 sans réparer ses instruments, c'est produire du travail qui ne se voit pas.

---

## Ce qui fonde ce chantier

Un audit indépendant à six dimensions, mené le 2026-09-08 par 59 agents dont la moitié avaient pour
consigne de **démolir** les constats de l'autre moitié : **52 constats produits, 34 réfutés, 18
retenus après reproduction par exécution.**

Le site publié est sain sur l'essentiel — 0 lien mort sur 26 117, 0 divergence sur 449 blocs de sortie
rejoués, 0 erreur sur 25 invariants de données, les deux moteurs embarqués fonctionnent réseau coupé.
Ce chantier ne traite donc pas le contenu : **il traite les instruments.**

Le fil qui relie presque tous les constats retenus tient en une phrase :

> **Un contrôle qui ne peut pas échouer est pire que pas de contrôle : il occupe la place.**

Quatre exemples mesurés, qui donnent le ton :

| Le contrôle | Ce qu'il affirmait | Ce qui était vrai |
|---|---|---|
| `verif-donnees` I18 | « index dérivés non périmés OK » | `quiz-index.js` périmé de 18 212 octets, 71 entrées fausses |
| cliquet `verif-qcm-biais` sur lua | code 0, donc vert | un retour de 25 % à 88,9 % serait resté vert |
| `$replanifFaite` dans le wrapper | commit annonçant « trois cas, testés » | variable jamais affectée : la panne est retombée 5 jours après |
| `verif-clic.js` | « concordent partout » | avait cliqué 19 blocs sur 73, sans le dire |

---

## Règles permanentes

- **Un point à la fois**, mené jusqu'à la mesure. Une case = un point clos et prouvé.
- **RÈGLE FONDATRICE, elle prime sur tout : NE JAMAIS DÉCLARER UN CORRECTIF SANS L'AVOIR EXÉCUTÉ.**
  Le 2026-09-02, une correction du wrapper a été commitée avec le message « trois cas, TESTÉS » ; les
  trois cas avaient été testés dans une **transcription** du code, pas dans le code. La variable
  n'était affectée nulle part et la panne est revenue à l'identique le 2026-09-07. Quand tu répares un
  fichier, c'est **ce fichier** que tu exécutes ou que tu fais analyser, jamais une copie retapée.
- **UN GARDE-FOU SE PROUVE EN LUI DONNANT UNE FAUTE À TROUVER.** Pour chaque contrôle que tu corriges
  ou ajoutes dans ce chantier, tu **injectes une faute** dans une copie jetable, tu vérifies qu'il
  rougit, tu vérifies qu'il redevient vert une fois la faute retirée, et tu écris les deux résultats
  dans le compte rendu. Un contrôle non éprouvé par injection ne compte pas comme fait.
- **Un commit par point**, avec la mesure dans le message.
- `node tools/verif.js --rapide` vert avant de cocher ; `--complet` sur les points qui touchent la chaîne.
- **Contrainte fondatrice** : 100 % `file://`, aucun serveur, aucun module ES, aucun build, aucune
  dépendance installée. **INTERDIT** de réintroduire une URL vers `cdnjs.cloudflare.com`,
  `fonts.googleapis.com`, `fonts.gstatic.com`.
- **NE JAMAIS TOUCHER** au mojibake volontaire de `pages/formats/lecon-06.html`,
  `pages/html/lecon-15.html`, `pages/r/lecon-06.html`, `pages/perl/lecon-13.html`.
- **En cas de doute réel : ne force pas.** Laisse la case décochée en écrivant ce qui bloque.

---

## PHASE A — Les instruments d'abord

Rien d'autre ne compte tant qu'un contrôle vert peut couvrir une faute réelle.

- [x] **A1 · L'index des QCM, et le garde-fou qui le laissait passer.** `js/quiz-index.js` sert les
      questions de `pages/examen.html` (`examen.html:95` ; `js/examen.js:242` construit les options
      depuis `q.a` sans jamais relire les pages). Mesure de l'audit : index périmé de **18 212 octets**,
      **71 entrées divergentes**, toutes du cours `lua` — biais « la plus longue » à **88,9 % dans
      l'index publié contre 25,0 % dans les leçons corrigées**. Un apprenant de `lua` qui coche la plus
      longue avait encore **64 justes sur 72** à l'examen. Régénérer, puis **réparer le garde-fou** :
      `build-index.js:891-895` ne sort en code 1 que si des entrées sont *reprises*, et la clé de reprise
      (l.505-511) est `fold(q.q)` — **l'énoncé seul**. Réécrire un distracteur conserve la clé : jamais
      repris, donc jamais rouge. `verif-donnees.js:675-688` ne lit que le code de sortie et cherche
      `(\d+) entrée\(s\) REPRISE` ; la ligne « different du fichier cible » que `--strict` imprime
      pourtant n'est lue par personne. **Éprouver par injection** : modifier un distracteur dans une
      leçon, vérifier que I18 rougit.

      **FAIT le 2026-09-08.** *Reprise de la mesure d'abord* : `quiz-index.js` n'est **plus** périmé
      (`build-index.js --only=quiz` → « 6151 entrees (ancien : 6151, ecart +0) | identique au fichier
      cible ») — le commit `532e2b8` l'avait régénéré. La moitié « régénérer » était donc déjà réglée ;
      **la cause, elle, était intacte**, et c'est elle qui a été traitée.
      *Correctif 1 — `build-index.js`* : ajout de l'accumulateur `staleAll` alimenté par `emit()` et
      `emitObject()` (nouvelle fonction `noteDivergence`), et **seconde cause d'échec `--strict`** : en
      mode comparaison, tout index publié qui diffère du contenu regénéré sort désormais en code 1 avec
      l'écart en octets. En `--write` la divergence reste normale (on vient d'écrire) : la règle ne
      s'applique qu'à `!WRITE`.
      *Correctif 2 — `verif-donnees.js` I18* : lit maintenant **les deux causes** (`REPRISE` et
      `index PÉRIMÉ(S)`) au lieu d'une seule, couvre `search,searchlite` en plus de
      `quiz,flashcards,antiseches,pieges` (`maxBuffer` porté à 64 Mo), et **distingue « je n'ai pas pu
      mesurer » de « j'ai trouvé une faute »** : si la sortie ne contient aucune ligne `[--strict]`,
      il dit « contrôle non joué », il ne dit plus « ? entrée(s) reprises ».
      *Ce que le nouveau garde-fou a trouvé immédiatement* : **`search-index.js` périmé de 8 octets** —
      le mot « 425 » avait 2 documents publiés au lieu de 3, le manquant étant `doc/lecon-03.html`, la
      leçon corrigée au commit `532e2b8` qui avait régénéré `quiz-index.js` **mais pas
      `search-index.js`**. Régénéré (`--write --fresh --only=search,searchlite` ; `search-lite.js`
      était déjà aligné, non réécrit).
      *Épreuve par injection* (exigée par les règles permanentes) : un **distracteur** de
      `pages/lua/lecon-05.html` réécrit (énoncé intact, donc clé `fold(q.q)` inchangée).
      — **ancienne règle : « questions reprises de l ancien index : 0 » → serait restée VERTE** ;
      — **nouvelle règle : code 1**, « 1 index PÉRIMÉ(S) … quiz-index.js (publie 4 142 772 o, regenere
      4 142 760 o, ecart −12 o) » ; I18 passe à **2 ERREUR(S)**, `verif-donnees` sort en code 1.
      — injection retirée → **I18 OK, 25 contrôles, 0 erreur**. Les deux sens sont prouvés.
      *Non-régression* : `node tools/verif.js --rapide` → **tout est vert, 95,6 s**.

- [x] **A2 · Les deux cliquets du biais, qui ne peuvent pas rougir.** `verif-qcm-biais.js` et
      `verif-qcm-lexique.js` sortent en code 0 sur `lua` en imprimant « refiger avec `--ecrire` ».
      Calcul de l'audit sur les formules de l'outil (`PLANCHER 0,05`, `TOL 0,01`, `traite:false`) : un
      retour de 25,0 % à **88,9 % serait vert**, une dégradation à 70,0 % serait verte ; seul ≥ 89,9 %
      rougirait. Et `verif.js --rapide` **avale** ces lignes : il n'affiche que `qcmbiai OK` et
      `qcmlexi OK`. Refermer le cliquet sur `lua` (`--ecrire` + `traite:true`), puis corriger la règle
      pour qu'une **dégradation** rougisse toujours, et faire remonter le détail dans `verif.js`.
      **Éprouver par injection** : dégrader volontairement un cours traité, vérifier que ça rougit.

      **FAIT le 2026-09-08.** *Reprise de la mesure d'abord, et elle corrige l'audit sur un point* :
      `lua` a été refigé depuis (référence du 2026-09-08 : `longueur 24,31 %`, `pire 27,08 %`,
      **`traite: true`**, 35 cours traités sur 90). Le premier geste demandé était donc **déjà fait**.
      Et le chiffre « un retour à 88,9 % serait vert » **ne se reproduit plus dans cet état** : mesuré
      par injection réelle sur `dataviz` (68 questions, traité, 25,0 %), la sensibilité du cliquet est
      de **2 questions sur 68** — 1 bonne réponse allongée passe (25,0 % → 26,5 %, sous le `PLANCHER`
      de 5 points), **2 rougissent**. Ce n'est pas 65 points de latitude, c'est 2,9 % du cours.
      *Mais la CAUSE que l'audit décrit était intacte, et c'est elle qui est corrigée* : ce qui rendait
      `lua` invisible n'était pas le plancher, c'était **la référence périmée**. Les deux cliquets
      imprimaient « X cours ont PROGRESSÉ → refiger avec `--ecrire` » **en code 0** : tant que le gain
      n'est pas figé, la référence protège l'**ancien** niveau, donc le retour en arrière reste vert.
      Même famille de bug que l'index périmé du point A1.
      *Correctif 1* — `verif-qcm-biais.js` : **cinquième cas d'échec, « référence périmée »**. Un progrès
      non figé est désormais une faute (code 1) qui dit « refige dans le même commit ». `--ecrire`
      n'en rougit jamais (il refige d'abord). Vérifié avant inscription : la liste est **vide** au
      2026-09-08 — la règle ne fait rougir personne le jour de son entrée.
      *Correctif 2* — `verif-qcm-lexique.js` : **quatrième échec**, même règle (`--ecrire` refige avant
      le calcul, donc `progres` y est vide par construction).
      *Correctif 3* — `verif.js` : le filtre des lignes de bilan ne captait **aucune** ligne des deux
      cliquets, d'où le `qcmbiai OK` nu. Motifs ajoutés (`n'a empire`, `marques traites`, `PROGRESSE`,
      `reference perimee`). `--rapide` affiche maintenant « cible : longueur 40.0 %… **cours marqués
      traités : 35** » et le verdict complet des deux cliquets.
      *Épreuves par injection, trois, toutes exécutées* :
      — **le cas `lua` de l'audit rejoué à l'identique** (ligne de référence remise à `88,89 % /
      traite:false`, telle que `git show 5acd3e3~1` la donne, contenu actuel inchangé à 24,3 %) :
      ancienne règle → 0 problème, **code 0** ; nouvelle règle → **code 1**, « [reference perimee] cours
      lua … un retour en arrière resterait vert ».
      — **dégradation réelle d'un cours traité** : 8 bonnes réponses de `dataviz` allongées d'un suffixe
      → `verif-qcm-biais` **code 1** (« longueur 25,0 % → 33,8 % », écart au hasard 0,0 → 8,8 points ;
      et « pire indice 26,5 % → 36,4 % »), `verif-qcm-lexique` **code 1** (« INVERSE 0,0 % → 100,0 % »).
      — **retour au vert** : `dataviz` et la référence restaurés depuis copie → les deux cliquets OK,
      `git status` propre.
      *Non-régression* : `node tools/verif.js --rapide` → **tout est vert, 95,8 s**.

- [x] **A3 · `verif-clic.js` : le seul outil qui clique vraiment, hors chaîne et instable.** Il n'est
      appelé par **aucun mode** (`grep -n "clic" tools/verif.js` ne rend rien). Pire, sa couverture
      varie : la même commande sur six pages a rendu **67, 19, 73, 73** blocs cliqués sur quatre
      exécutions, en imprimant « concordent partout » et en sortant 0 à chaque fois — le run à 19 n'a
      jugé que 26 % des blocs. Cause mesurée : les Chrome de test survivent (`proc.kill()` l.236 ne tue
      que le lanceur ; 8 processus `*chrome-verif-clic*` encore vivants après les lancements) et l'outil
      réutilise un **port fixe unique** (`PORT = 9351`, l.57) et un seul `--user-data-dir`. Corriger :
      port et répertoire uniques par lancement, attente d'un **état** (nombre de `.code-block__try`
      stable sur deux relevés) et non d'une durée, **impression du nombre de blocs attendus à côté des
      cliqués**, et un écart qui rougit. Puis le verser dans la chaîne.

      **FAIT le 2026-09-08.** *L'instabilité a été REPRODUITE, et par sa cause.* Deux exécutions
      successives sur les six mêmes pages, machine propre (0 processus `*chrome-verif-clic*` vivant),
      donnent **48 et 48** : le phénomène ne se voit pas isolément. Deux exécutions **en parallèle** sur
      les trois mêmes pages donnent **18 blocs contre 11, les deux en code 0**, chacune imprimant
      « concordent partout » — le run à 11 n'a jugé que 61 % des blocs sans le dire. La cause du plan
      est donc confirmée : port fixe et profil partagé, deux instances qui se prennent l'une pour
      l'autre.
      *Quatre corrections* : (1) port **dynamique** par lancement (`--remote-debugging-port=0`, lu dans
      `DevToolsActivePort`) et `--user-data-dir` **unique par page**, effacé ensuite, plus un balayage
      du dossier au démarrage (67 profils s'accumulaient) ; (2) `proc.kill()` → **mort de l'arbre**
      (`taskkill /T /F`) : 0 Chrome de test survivant après un arrêt en cours de route, vérifié ;
      (3) la cible CDP est choisie **sur son URL** et non « la première page trouvée » ; (4) attente
      d'un **ÉTAT** (`readyState complete`, puis nombre de `.code-block__try` stable sur deux relevés)
      au lieu des 1 400 ms en dur.
      *La couverture est désormais dite.* Le nombre de blocs **attendus** est calculé à part, sur le
      SOURCE (figure `code-block` + `<pre>` + `code.language-javascript`, hors `BROWSER_ONLY` — cette
      expression est **lue dans `js/runner.js`**, jamais recopiée). Trois verdicts distincts :
      0 = tout concorde, 1 = divergence, **2 = mesure incomplète**. ⚠️ Un premier jet cherchait
      `code-block__bar` dans le HTML et comptait **0 bloc attendu sur 48** : la barre est posée par
      `js/main.js` à l'affichage, elle n'est pas dans le source.
      *Le filtre des pages était trop large* : « un bloc JS suivi quelque part d'un `.txt` » retenait
      89 pages, et sur les six premières, **48 blocs cliqués et ZÉRO jugé** (voisins absents ou
      illustrations). On applique maintenant la règle d'appariement de la comparaison elle-même :
      **89 pages → 75, sans perdre une seule page appariable** (mesuré : les 14 écartées n'en
      contiennent aucune).
      *Épreuves par injection, trois, toutes exécutées* :
      — **deux instances en parallèle après correction : 18 = 18 des deux côtés**, code 0 (contre 18 et
      11 avant) ;
      — **divergence réelle** : `sortie-recursion.txt` de `compilation/lecon-08` passé de 2000 à 9999 →
      **code 1**, « la page imprime 9999 / le clic donne 2000 » ;
      — **trou de couverture** : une figure JS injectée avec `data-runner="skip"` (runner.js ne pose pas
      de bouton) → **code 2**, « 8 bloc(s) cliqué(s) sur 9 attendu(s) » ;
      — retour au vert après restauration : 8 sur 8, code 0.
      *Versé dans la chaîne* : étape `clic` du mode **`--complet`** (hors `--rapide` : il ouvre 75 pages
      une par une). Son entrée de `tools/hors-chaine.json` est retirée — et le garde-fou l'a exigé
      lui-même : tant qu'elle était là, `verif-chaine-declaree.js` sortait en **code 1**
      (« déclaration périmée »), il repasse à **0** une fois l'entrée retirée.
      *Coût mesuré* : **13,0 s/page sur 12 pages** (156 s, 77 blocs sur 77 attendus), et le balayage
      complet des 75 pages tient en une exécution — chiffre reporté ci-dessous une fois rendu. Option
      `--chrono` ajoutée (une ligne par page) et durée moyenne + page la plus lente imprimées dans le
      résumé : la question « où part le temps » ne se pose plus à l'aveugle.

- [x] **A4 · Le garde-fou anti-orphelins ne police que le préfixe `verif-`.**
      `tools/verif-chaine-declaree.js` a `SOUMIS = ["verificateur","mutation"]` et `recense-chaine.js`
      décide la famille au préfixe. Résultat : **69 fichiers lancés par au moins un mode, 56 soumis,
      13 étapes de la chaîne non policées** — et l'outil sort 0 en imprimant « OK ». L'exposition réelle
      mesurée est de **quatre** fichiers sans aucun appelant : `preuves/exos-texte.js`, `exos-code.js`,
      `decodeur.js`, `capture-erreurs.js`, tous capables de rougir, aucun déclaré dans
      `hors-chaine.json`. `exos-texte.js` est l'outil qui avait trouvé les 13 exercices dont le champ
      `accept` appartenait à un autre énoncé ; **rien ne le relance.** Corriger `famille()` / `SOUMIS` :
      est un vérificateur tout fichier que `verif.js` lance, plus tout fichier capable de rendre un code
      non nul.

      **FAIT le 2026-09-08.** *Mesure reprise d'abord* : **70 fichiers lancés par au moins un mode, 63
      soumis, 13 étapes de la chaîne non policées** — le chiffre du plan (69/56/13) s'est reproduit à
      l'unité près sur les étapes non policées, les deux autres ayant bougé parce que le point A3 venait
      d'ajouter `verif-clic.js`.
      *L'exposition réelle est plus large que les quatre annoncés.* En remplaçant le critère du NOM par
      celui du COMPORTEMENT — un fichier qui sait sortir en code non nul porte un verdict, lu dans son
      source — on trouve **huit** outils capables de rougir que personne ne lançait :
      `preuves/decodeur.js`, `exos-code.js`, `exos-texte.js`, `git-commandes.js`, `git-graphe.js`,
      `git-modele.js`, `git-scenarios.js`, et `preuve-hors-reseau.js`. ⚠️ `preuves/capture-erreurs.js`,
      cité par le plan, ne contient **aucun** `process.exit` non nul : il ne peut pas rougir, il n'est
      donc pas concerné (constat corrigé, pas reporté).
      *Deux corrections.* (1) `recense-chaine.js` : nouvelle famille **`preuve`** — tout fichier de
      `tools/preuves/` ou nommé `preuve-*.js` **et** capable de sortir en code non nul (20 fichiers ; les
      neuf `rejoue-*.js` et les deux pilotes, qui ne font qu'imprimer un relevé, restent hors du
      garde-fou, à raison). (2) `verif-chaine-declaree.js` : `SOUMIS` gagne `preuve`, **et surtout tout
      ce que `verif.js` lance est policé d'office, quelle que soit sa famille** — le filtre par famille
      s'appliquait avant tout, si bien que les 13 étapes ci-dessus n'étaient surveillées par rien.
      *Les huit ont été réglés, pas décrits* : **cinq branchés** dans `--complet`
      (`git-modele`, `git-commandes`, `git-graphe`, `git-scenarios`, `decodeur`), après les avoir
      exécutées : **les cinq en code 0, 32,0 s au total** — 13, 13, 18 et 26 valeurs comparées pour les
      quatre premières, et 55/55 messages retrouvés en premier plus 3 messages inventés correctement
      refusés pour le décodeur. **Trois déclarés** dans `hors-chaine.json` avec leur raison mesurée :
      `exos-code.js` et `exos-texte.js` **sortent en 0 sans rien mesurer quand on les lance nus**
      (« aucune page : passer des chemins », vérifié par exécution) — les brancher tels quels aurait
      ajouté à la chaîne une étape verte qui ne vérifie rien, exactement le défaut que ce chantier
      combat ; `preuve-hors-reseau.js` est le pilote paramétré des quatre preuves git, et sort en 2 sans
      argument.
      *Épreuves par injection, deux, et la comparaison avec l'ancien code a été JOUÉE, pas raisonnée*
      (l'ancien `recense-chaine.js` et l'ancien garde-fou ont été extraits de `HEAD` et exécutés tels
      quels) :
      — **faute 1, un vérificateur orphelin** : un `preuves/zz-injection-a4.js` capable de rougir, lancé
      par personne, non déclaré → **nouveau garde-fou : code 1**, il le nomme ; **ancien garde-fou, même
      faute : code 0 et « OK — tout vérificateur est soit dans un mode, soit déclaré »** ;
      — **faute 2, une déclaration périmée** : `preuves/sql-lecon.js` (qui EST dans la chaîne) ajouté à
      `hors-chaine.json` → **nouveau : code 1, « déclaré hors chaîne, mais verif.js le lance en (defaut)
      --complet --strict »** ; **ancien : code 0 et « OK »** — la règle 3 était donc muette elle aussi
      dès que le fichier n'avait pas le préfixe `verif-` ;
      — **retour au vert** après retrait des deux fautes et règlement des huit : **code 0**, « 84 outils
      soumis (48 vérificateurs, 15 épreuves par injection, 20 preuves, + 1 étape d'une autre famille),
      **75 dans un mode, 9 hors chaîne dont 9 déclarés** » — contre 57 dans un mode sur 63 soumis avant
      le point.

- [x] **A5 · `verif.js` confondait « je n'ai pas pu mesurer » et « j'ai trouvé une faute ».** — FAIT le
      2026-09-08.
      **MESURE D'ABORD, avant toute correction** (script d'inventaire exécuté, la liste des étapes étant
      demandée à `verif.js --lister` mode par mode, jamais recopiée) : la chaîne compte **62 étapes**
      tous modes confondus, dont **30 savent sortir en code 2**, c'est-à-dire « rien n'a pu être
      mesuré ». Sur ces 30 : **5 étaient déclarées `sautable`** (`verif-python-exos`, les quatre bacs à
      sable Git) et leur code 2 était **converti en 0** par `code: e.sautable && r.status === 2 ? 0 :
      r.status` — la chaîne imprimait **« tout est vert »** pour une étape qui n'avait rien regardé ;
      **25 ne l'étaient pas** (`verif-donnees`, `verif-contenu`, `verif-sql-exos`, `verif-qcm-biais`,
      `verif-qcm-lexique`, `verif-rendu`, `verif-clic`, `verif-stockage`, `verif-execution`…) et leur
      panne se lisait **« un vérificateur a signalé quelque chose »**, c'est-à-dire une faute du site
      qui n'existait pas. Les 30 causes ont été relues une par une dans le source : **toutes** sont bien
      des « je n'ai pas pu mesurer » (data.js illisible, moteur `TEST_REGEX`/`JUGE_SQL` introuvable dans
      `js/lecon.js`, SQLite qui ne charge pas, Chrome muet, référence de cliquet absente, page générée
      manquante) — la convention 0/1/2 est **homogène dans tout le dépôt**, elle n'était pas lue.
      **CE QUI EST FAIT.** `tools/verif.js` classe désormais chaque étape en **trois** états : `OK`
      (code 0), `SIGNALE` (code 1, ou tout autre code non nul autre que 2), `NON MESURE` (code 2, ou
      processus tué / non démarré : `status === null`). L'état non mesuré **imprime sa cause** sur la
      ligne du bilan, puis un bloc final `RIEN N'A ETE MESURE par ces etapes` qui nomme chaque étape et
      son motif. **« tout est vert » n'est plus imprimé que si toutes les étapes ont mesuré** (la phrase
      dit maintenant combien : « tout est vert (27 etape(s), toutes mesurees) »). **Codes de retour** :
      **0** tout mesuré et propre · **1** au moins une faute · **2** aucune faute mais au moins une
      étape muette. `sautable` ne repeint plus rien : il ne sert qu'à **nommer** la cause attendue
      (« outil externe absent, cause prevue — … »), pour ne pas confondre une machine sans git avec un
      vérificateur en panne. **Le mode `--mutations` reçoit la même distinction** : une épreuve sortant
      en 2 n'a pas trouvé un vérificateur aveugle, elle n'a pas pu tourner — elle est comptée
      `NON MESURE` et le mode sort en 2 (elle comptait « en défaut », ce qui envoyait chercher un défaut
      inexistant). Ajout au passage de **`--seules=motif1,motif2`**, qui restreint la chaîne à quelques
      étapes (et accepte un outil hors chaîne existant sous `tools/`, jugé par la même mécanique) ; un
      motif qui ne désigne rien sort en **2**, jamais en « vert après n'avoir rien lancé ».
      **ÉPREUVE PAR INJECTION** — nouveau `tools/verif-verdict-mutations.js`, **la seule épreuve du
      dépôt qui juge la CHAÎNE et non un vérificateur**, versée au mode `--mutations` (16 épreuves au
      lieu de 15). Elle écrit un témoin jetable `tools/_canari-verdict.tmp.js` qui sort sur un code
      **connu**, le fait juger par `verif.js --seules=`, puis rejoue la **régression historique** sur
      une vraie étape `sautable`. **6 cas, 6 vus, dépôt propre, 7,8 s** :
      1. témoin en 0 → `OK`, chaîne code 0 · 2. témoin en 1 → `SIGNALE`, code 1, sans « tout est vert »
      · 3. témoin en 2 → `NON MESURE`, **code 2**, sans « tout est vert » · 4. le bloc « RIEN N'A ETE
      MESURE » nomme l'étape et sa cause · 5. témoin en 3 → `SIGNALE` (un code non nul autre que 2
      reste une faute) · 6. `verif-python-exos.js` muté pour sortir en 2 → `NON MESURE` **code 2** là où
      l'ancien code rendait **« OK » et 0**, puis octets restaurés → **retour au vert, code 0**.
      **PREUVE QUE L'ÉPREUVE PEUT ROUGIR** (elle ne compte pas sinon) : la repeinture d'avant le point
      A5 réinjectée dans `verif.js` → **5 / 6 cas vus, « MANQUE : étape `sautable` sortant en 2 »,
      code 1**, `verif.js` restauré **à l'octet près**. Même épreuve pour la branche `--mutations` :
      l'épreuve mutée pour sortir en 2 → le mode imprime **« 1 epreuve(s) N'ONT RIEN PU MESURER »** et
      sort en **2**, dépôt propre, fichier restauré à l'octet près.
      **NON-RÉGRESSION** : `verif.js --rapide` **27 étapes, toutes vertes, 105,5 s** (avant le point :
      27 étapes vertes, 106,8 s — **liste d'étapes identique**, comparée ligne à ligne) · le garde-fou
      d'A4, `verif-chaine-declaree.js`, reste **vert** en intégrant l'épreuve neuve : **85 outils soumis
      (48 vérificateurs, 16 épreuves par injection, 20 preuves), 76 dans un mode, 9 hors chaîne dont 9
      déclarés** · `node --check tools/verif.js` et `tools/verif-verdict-mutations.js` OK · `git status`
      propre hors les deux fichiers du point.

- [x] **A6 · `--rapide` montre 1 signalement, `--complet` en montre 6.** Cinq contrôles ne sont jamais
      joués par le mode que l'on lance le plus souvent — et trois des six signalements de `--complet`
      **ne se reproduisent pas** quand on lance l'outil seul, ce qui est un second problème. Établir
      quels contrôles doivent entrer dans `--rapide` (le mode par défaut de toutes les passes), et
      traiter l'instabilité des trois signalements non reproductibles.
      **FAIT (2026-09-09).**

      **LA MESURE, REFAITE D'ABORD.** `--rapide` : **27 étapes, 108,6 s, tout vert — zéro signalement**
      (le plan en annonçait 1 : il ne se reproduit plus). `--complet` : **62 étapes, 4 955,9 s**
      (82,6 min), **5 SIGNALE + 1 NON MESURE**. L'écart entre les deux modes était donc bien réel, et
      plus grand qu'annoncé : **35 étapes sur 62** ne tournaient jamais dans le mode des passes.

      **LE TRI DES SIX, chacun relancé seul.** C'est ce tri qui a tout décidé :

      | étape | dans la chaîne | relancée seule | ce que c'était |
      |---|---|---|---|
      | `lexique` | SIGNALE en 1,9 s | **verte** | instrument |
      | `py-lec` | SIGNALE en 31,4 s | **verte** | instrument |
      | `sql-lec` | SIGNALE, 40 blocs / 4 résultats | SIGNALE, 41 blocs / 25 résultats / 3 « MOTEUR KO » | instrument |
      | `mth-prg` | SIGNALE en 4,2 s | SIGNALE : « 0 lien au lieu de 13 », titre et badge **vides** | instrument |
      | `mutants` | SIGNALE en 282,6 s | **SIGNALE à l'identique** | **VRAI — voir A8** |
      | `clic` | NON MESURE, 498 / 513 blocs | NON MESURE, **512 / 513** | **VRAI — voir A9** |

      **PREMIÈRE CAUSE, DÉMONTRÉE PAR EXPÉRIENCE (et non déduite) : le port de débogage écrit en dur.**
      Vingt-six outils lançaient Chrome sur un numéro fixe, et **six paires partageaient le même** :
      9341 (`verif-bilan` · `execution-ancres`), 9357 (`verif-lexique-clic` · `verif-affichage` ·
      `preuve-hors-reseau` · `exos-code`), 9359 (`python-lecon` · `exos-texte`), 9362 (`decodeur` ·
      `etude-moteur-exos`), 9366 (`erreurs-sql` · `etude-inconnu`), 9367 (`decodeur-lecons` ·
      `etudes-hub`). Quand le port est déjà pris, le second Chrome démarre **sans DevTools** et l'outil
      mesure **la page d'un autre**. Expérience faite : un Chrome posé sur `about:blank` au port 9357,
      puis `verif-lexique-clic.js` lancé → **« 1 contrôle OK, 11 en échec » en 2,0 s**, avec la ligne
      « OK aucune erreur JavaScript pendant les clics » — **la signature exacte** du signalement de la
      chaîne. Remède : `tools/lib/port-chrome.js`, la mécanique que `verif-clic.js` avait déjà adoptée
      au V16/A3 (`--remote-debugging-port=0`, port lu dans `DevToolsActivePort`) — **plus aucun numéro
      à réserver**. **Épreuve** : le même squatteur en place, l'outil corrigé rend **12 contrôles OK,
      0 échec, code 0**. **22 outils convertis**, tous rejoués un par un : **22 / 22 en code 0**, dont
      trois qui étaient rouges (`sql-lecon` 73 s, `mth-prg` 4 s, `lexique` sous squatteur). Il ne reste
      **aucun** `--remote-debugging-port=` en dur sous `tools/`.

      **SECONDE CAUSE, prise sur le fait pendant ce point même : le délai d'attente EN DUR.** Le mode
      rapide neuf a fait rougir `lexique` une fois de plus — et la **trace** ajoutée le matin a permis
      de la lire : « les 147 entrées du lexique sont rendues — **rendu 0** », page vide. Le port était
      pourtant dynamique : la cause était `await attendre(1200)` après la navigation. Sur une machine
      occupée, la page n'a pas fini de se construire, et l'outil accuse le site d'un défaut qu'il n'a
      pas. Corrigé sur les deux outils où le symptôme a été mesuré (`verif-lexique-clic.js`,
      `maths/module-5/verif-cours-progression.js`) : on attend un **état** (`readyState complete` + le
      conteneur), plafond 15 s, et l'expiration sort en **2 — rien n'a pu être mesuré**, jamais en 1.
      **Épreuve par injection** sur les deux : plafond ramené à zéro → « RIEN N A PU ETRE MESURE »,
      **code 2** ; plafond restauré → **code 0**. Effet secondaire mesuré : `lexique` passe de 4,0 s à
      **0,78 s**, `mth-prg` de 4,2 s à **3,1 s** — on n'attend plus pour rien.

      **QUELS CONTRÔLES ENTRENT DANS `--rapide` : la règle, et elle est chiffrée.** Le critère
      implicite était « tout ce qui ne pilote pas Chrome » — personne ne l'avait choisi, et il laissait
      dehors des contrôles de **trois secondes** pendant qu'il en gardait à seize. Nouvelle règle,
      écrite dans `tools/verif.js` : **une étape entre dans tous les modes si elle coûte ≤ 10 s et ne
      modifie aucun fichier du dépôt**. Le seuil n'est pas rond par hasard : la distribution mesurée se
      coupe d'elle-même — treize étapes entre 1,9 et 8,0 s, la suivante à 12,9 s, puis les balayages
      (rendu 1 748 s, clic 1 585 s). **Les treize entrantes** (48,2 s en tout) : `git-commandes`-preuve
      1,9 · `git-modele` 2,3 · `decodeur` 3,0 · `erreurs-sql` 3,0 · les cinq études 3,0 · `lexique` 4,0
      · `cours-progression` 4,0 · `etude-inconnu` 7,0 · `execution` 8,0. **Trois d'entre elles
      n'étaient jouées que par `--complet`, c'est-à-dire presque jamais.**
      **Mesure du mode rapide : 27 étapes / 108,6 s → 40 étapes / 151,1 s, tout vert.**

      **ET LE MODE DIT MAINTENANT CE QU'IL NE JOUE PAS.** `--rapide` imprimait « tout est vert » sans
      jamais préciser sur quoi. Il imprime désormais : « **CE VERDICT NE PORTE QUE SUR 40 DES 62
      ÉTAPES DE LA CHAÎNE : 22 ne sont pas jouées par ce mode. Elles ne sont ni vertes ni rouges — elles
      n'ont pas tourné** », suivi de leurs noms. La liste n'est pas recopiée : elle est **demandée** à
      `--complet --lister`, et un garde-fou signale toute étape jouée qui n'existerait plus dans
      `--complet`.

      **LA TRACE, sans quoi ce point n'aurait pas pu être traité.** La chaîne jetait la sortie de
      chaque étape (deux lignes retenues sur des motifs) : un signalement non reproductible était donc
      **illisible**. Toute étape non verte écrit désormais sa sortie entière sous
      `scratchpad/.verif-journal/<horodatage>/`, et le verdict en donne le chemin. Le vert n'écrit
      rien. **C'est cette trace qui a livré la seconde cause, deux heures après avoir été écrite.**

      **ÉPREUVE PAR INJECTION** (`verif-verdict-mutations.js`, +3 cas) : **9 / 9 cas vus**, dépôt
      propre. **Preuve que l'épreuve peut rougir** : `tracer()` neutralisé et le bloc de couverture
      désactivé dans `verif.js` → **7 / 9, « 2 verdicts faux »**, les deux cas neufs nommés ; fichier
      restauré à l'octet près → **9 / 9**.
      **NON-RÉGRESSION** : `verif-chaine-declaree.js` **vert** (85 outils soumis, 76 dans un mode, 9
      hors chaîne déclarés ; il lit bien 40 / 53 / 62 / 16) · `node --check` sur les 25 fichiers
      touchés · zéro `cdnjs`/`fonts.googleapis`/`fonts.gstatic` introduit · aucune étape fantôme entre
      `--rapide` et `--complet`.

      **PREUVE FINALE — `--complet` rejoué en entier après les correctifs (4 217,1 s) :
      5 SIGNALE + 1 NON MESURE → 1 SIGNALE + 1 NON MESURE.** Les quatre défauts d'instrument ont
      disparu, et ils sont désormais verts *dans la chaîne*, là où ils rougissaient :
      `sql-lec` **OK 69,3 s** · `py-lec` **OK 25,2 s** · `lexique` **OK 2,3 s** · `mth-prg` **OK
      4,9 s**. Ne restent que les deux vrais, chacun avec sa trace relisible : `mutants` SIGNALE
      (192,1 s, point A8) et `clic` NON MESURE (1 361,3 s, **504 / 513** cette fois — troisième
      valeur différente, point A9). La chaîne a aussi gagné **12,3 minutes** au passage.
      L'en-tête d'usage de `verif.js`, qui annonçait 26 / 51 / 54 étapes là où il y en avait
      27 / 53 / 62, a été refaite sur les mesures du jour.

- [x] **A7 · Dix-sept outils sortent en 0 — « tout va bien » — quand Chrome est introuvable.** Mesuré
      le 2026-09-09 en cherchant la cause d'A6 : `if (!CHROME) { console.log('Chrome introuvable, rien
      de mesuré.'); process.exit(0); }` dans 17 fichiers (`preuve-hors-reseau`, `verif-clic`,
      `verif-lexique-clic`, `verif-bilan`, `verif-cours-progression`, `python-lecon`, `sql-lecon`,
      `exos-code`, `exos-texte`, les six `etude-*`, `etudes-hub`). C'est **exactement le défaut qui
      fonde ce chantier** : un contrôle vert qui n'a rien regardé — et le point A5 vient précisément
      d'installer l'état qui manque (code 2 = NON MESURÉ). Sur une machine sans Chrome, la chaîne
      annonce aujourd'hui « tout est vert » pour **17 étapes qui n'ont pas ouvert une seule page**.
      Passer ces sorties en 2, et **l'éprouver** en rendant le chemin de Chrome introuvable sur une
      copie jetable (la chaîne doit alors dire NON MESURÉ, pas OK).

      **FAIT le 2026-09-09.** *La mesure d'abord, et sans copie jetable* : `tools/preuves/chrome-absent.js`
      lance les **vrais fichiers** dans un `node` où `fs.existsSync` a été rendu aveugle aux seuls
      chemins contenant « chrome » ou « chromium ». Aucun outil n'est recopié ni retouché — c'est bien
      lui qui s'exécute, avec la seule faute injectée qu'on veut éprouver. Premier passage sur les
      **29 outils du dépôt qui cherchent un binaire Chrome** : **12 disaient déjà NON MESURÉ, 17
      mentaient** (code 0). Le chiffre du plan est donc reproduit à l'identique — mais **la liste
      diffère** : les deux `maths/module-3` et `module-4/verif-cours-progression.js` sortaient déjà en
      2, et le 17ᵉ menteur est **`verif-interpreteur.js --navigateur`**, que personne n'avait nommé :
      sa `preuveNavigateur()` rendait `null`, `ecartsNav` restait `null`, et l'outil imprimait
      « RESULTAT : 0 ECART » — vert — alors que la moitié du contrôle qu'on venait de lui demander
      n'avait pas eu lieu. Corrigés : **16 sorties `exit(0)` → `exit(2)`** avec le message refait
      (« NON MESURÉ : Chrome introuvable, aucune page n’a été ouverte »), plus le drapeau
      `navNonMesure` de `verif-interpreteur.js` (bilan « écarts Chrome ⇄ Node : NON MESURÉ » + code 2).
      **Trouvé en chemin, même mensonge** : `exos-texte.js` et `exos-code.js` sortaient aussi en **0**
      sur « aucune page : passer des chemins » — passés en 2 eux aussi (c'est ce qui masquait la
      branche Chrome d'`exos-texte`, seul outil resté rouge au deuxième passage).

      **Éprouvé dans les deux sens, comme la règle l'exige.** Après correction : **29 / 29 rendent 2
      sans Chrome** (14,7 s). *Contre-épreuve* (`--contre`, 195,3 s) : chaque outil relancé **avec**
      Chrome, **0 plainte à tort** — 13 étaient encore au travail au bout de 8 s, les 16 autres ont
      rendu leur verdict sans jamais parler de Chrome. *Épreuve du garde-fou lui-même* : l'ancien
      `exit(0)` remis dans `preuves/etude-journal.js` → `chrome-absent.js` **rougit** (code 1, « 1 outil
      en faute : preuves/etude-journal.js (code 0) ») ; faute retirée, fichier **restauré à l'octet
      près** (comparaison binaire `true`), retour à **0 en faute**. `verif-interpreteur.js --navigateur`
      relancé avec Chrome : **116 programmes rejoués, 0 écart, code 0** — il n'est pas devenu rouge à
      tort.

      **Entré dans la chaîne**, sinon rien ne le lance : étape `sanschr` du mode normal (donc aussi
      `--complet` et `--strict`), 14,6 s, aucun fichier modifié, aucun navigateur démarré.
      `verif-chaine-declaree.js` l'a d'ailleurs réclamé de lui-même (« 1 problème : non déclaré ») puis
      est repassé **OK** : la chaîne passe de **53 → 54 étapes** en mode normal et **62 → 63** en
      `--complet`. `verif.js --rapide` **tout vert, 40 étapes, 150,4 s**.

- [ ] **A8 · Une mutation SURVIVANTE : `verif-exemples.js` reste vert sur une sortie de commentaire
      faussée.** `node tools/verif-chaine-mutations.js` le 2026-09-09 : **9 mutations injectées, 8
      vues, 1 survivante** — « une sortie annoncée en commentaire qui ne correspond plus à ce que le
      code produit » (98,8 s). Reproduit à l'identique en chaîne et hors chaîne. C'est **le défaut
      fondateur du chantier V17 lui-même** — l'exemple faux qu'aucun outil ne rattrape — et il est
      aujourd'hui **mesuré**, plus seulement raconté. Trouver ce que la mutation change exactement,
      pourquoi `verif-exemples.js` ne le voit pas, corriger l'outil, et exiger **9 / 9**.

- [ ] **A9 · `verif-clic.js` ne juge jamais tous les blocs, et l'écart varie.** Deux mesures du
      2026-09-09 : **498 / 513** blocs cliqués dans la chaîne (1 584,7 s), **512 / 513** relancé seul
      (1 081 s), **504 / 513** au rejeu de la chaîne (1 361,3 s) — trois passages, trois valeurs. L'outil a raison de sortir en 2 plutôt que d'annoncer « tout concorde » (c'est l'acquis
      du V17/A3), mais il **ne peut pas être vert**, donc `--complet` ne peut jamais l'être non plus :
      un mode qui ne peut pas être vert cesse d'être lu. Identifier le ou les blocs perdus — la mesure
      dit qu'ils ne sont pas toujours les mêmes — et rendre la couverture soit complète, soit
      **explicitement bornée** (un bloc qu'on décide de ne pas juger doit être nommé et compté à part,
      comme le sont déjà les 51 « sans bloc de sortie à comparer »).

---

## PHASE B — Ce que l'apprenant voit casser

Un bouton « Tester » qui rend une erreur est pire qu'une absence de bouton : le panneau **promet** un
résultat avant le clic.

- [ ] **B1 · Les blocs SQL : 124 sur 303 en erreur (40,9 %).** Par cours : `sql` 128/215, `bdd` 50/70,
      **`data-eng` 1/17**, `securite` 0/1. Causes mesurées : 51 « no such column », 39 « no such table »,
      21 « near … ». Trois tentatives de démolition ont échoué : le vérificateur ne diverge pas du
      navigateur (`js/runner.js:331-341` fait exactement la même chose), les boutons existent bien
      (8 boutons cliqués dans un vrai Chrome sur `data-eng`, 8 erreurs), et ce ne sont pas des erreurs
      pédagogiques (sur `pages/sql/lecon-10.html`, 11 erreurs sur 13 portent sur une colonne `points`
      que `runner.js:201` ne déclare pas ; sur les 124, **2 seulement** démontrent une contrainte).
      Commencer par `data-eng`. Descendre le cliquet de `tools/verif-sql-attendu.json` — calé sur 124
      depuis le 2026-08-26, donc **vert avec 124 boutons morts** — à chaque lot. Une case par cours.

- [ ] **B2 · Les blocs JavaScript : 451 sur 2 011 en erreur (22,4 %).** Mesure indépendante avec la
      règle `BROWSER_ONLY` de `js/runner.js:51` : 518 erreurs, dont **67 volontaires et annoncées en
      commentaire** — le chiffre défendable est donc 451. Causes : 92 `import statement outside a
      module`, 34 `await is only valid in async`, 34 `test is not defined`, 31 `Unexpected token
      'export'`, 13 `Unexpected token ':'` (du TypeScript annoncé `javascript`). Cours : `js` 156,
      `nodejs` 88, `tests` 51, `vue` 40, `projets-js` 37. Cas net : `pages/nodejs/lecon-03.html`, **5
      blocs sur 6 sont des `package.json`** (`data-file="package.json"` + `class="language-javascript"`)
      — un fichier JSON avec un bouton « Tester ». Corriger en deux temps : (a) élargir `BROWSER_ONLY`
      aux lignes commençant par `import` ou `export` et aux blocs `data-file` en `.json` ; (b) rendre
      autonomes, ou débrancher, les fragments qui dépendent d'un bloc précédent. `CHANTIER-V14.md:497`
      en recense déjà 64 : **le gisement réel est sept fois plus gros.** Une case par lot de cours.

- [ ] **B3 · Neuf langages, 184 leçons dont aucune sortie n'est rejouée par la chaîne.**
      `verif-exemples.js:837` : `const LANGS = { javascript, python }` — même `--lang all` ne rend que
      ces deux-là. `verif-sorties.js:61` ne regarde que `language-javascript`. Les neuf
      `tools/preuves/rejoue-*.js` couvrent cpp, rust, go, java, php, c, csharp, elixir, bash — **178
      programmes, 309 lignes comparées, 0 divergence** — et `recense-chaine.js --json` les classe
      `dansChaine:false`. **Test décisif déjà fait par l'audit**, en bac à sable : une sortie falsifiée
      dans `pages/cpp/lecon-01.html` (`// n = 7` → `// n = 8`) est vue par `rejoue-cpp.js`
      (`1 divergent(s)`, EXIT=1) et **invisible** à `verif-exemples.js` (`"blocs":0`) comme à
      `verif-sorties.js` (EXIT=0). Verser les neuf dans `--complet`, ou les déclarer dans
      `hors-chaine.json` avec leur raison. **Nuance à écrire dans le compte rendu** : ce ne sont pas des
      compilateurs (g++, gcc, rustc, go, javac, php, elixir sont absents de la machine) mais des
      transpositions JS écrites à la main — les brancher attrape une sortie **éditée**, pas un bloc neuf
      non transposé.

- [ ] **B4 · Les deux preuves du seul fonctionnement qui compte sont hors chaîne.** L'audit a retenu que
      les preuves « page ouverte en `file://` » ne sont lancées par aucun mode. Les identifier, les
      verser, et mesurer ce qu'elles trouvent.

---

## PHASE C — Les chiffres publiés devenus faux

Le site publie ses propres mesures. Il change. Un chiffre publié qui ne correspond plus est un mensonge
affiché à l'apprenant — et l'audit a montré que la cause est presque toujours **la retouche à la main**.

- [ ] **C1 · `pages/doc/lecon-03.html` : quatre statistiques fausses, dont deux hors de tout contrôle.**
      `verif-normatif.js` sort en 1 avec « 64 contrôles OK, 2 en échec ». Mesure du jour
      (`tools/doc/mesures/conformite-quiz.js`) : S3 = 3 507 / 6 103 conformes (57,5 %), **2 596
      manquements (42,5 %)**. La page publie `2 657 fois — 43,5 %` (l.878), `2 423 / 6 103 — 39,7 %`
      (l.871), et pour S4 `18 / 89 cours — 20,2 %` (l.872) contre **34/89 = 38,2 %** mesuré. Les deux
      derniers ne sont surveillés par **aucun** des 66 contrôles. Aggravation : le tableau est
      arithmétiquement impossible — **2 423 + 2 657 = 5 080 ≠ 6 103**, alors que
      `conformite-quiz.js:153` définit `conformes = valides - echecs`, somme toujours égale au total.
      `git log -S` date le 2 423 de `ff848e4` (page alors cohérente : 2 423 + 3 680 = 6 103) et le
      2 657 de `2637f82`, dont le diff ne touche que **7 lignes, exactement celles que les deux
      contrôles surveillent**. **Correctif : régénérer, pas rustiner.** `tools/doc/corps/l3.html:110,117`
      ne contient aucun chiffre, seulement des marqueurs `@@NORMNB:…@@` remplis par
      `tools/doc/gen.js:365-367`. Lancer `gen.js`, puis **ajouter à `verif-normatif.js` un verdict sur
      `s3.conformes`, sur `s4` en valeur, et un contrôle d'addition** (conformes + échecs = corpus).
      Deux autres phrases de la même page sont écrites à la main et fausses (« le rang 1 s'établit à
      38,4 % » sur 1 835 questions ; « la plus longue 0 fois, la deuxième 39 fois, soit 60,9 % » sur
      64 questions) : les régénérer aussi.

- [ ] **C2 · `pages/doc/cours.html` annonce 74 leçons, la mesure dit 82.** `grep -n "74 leçons"` → l.96,
      dans un callout visible ; `tools/doc/mesures/mentions-doc.js` → **82 leçons, 36 cours, 1 536
      leçons parcourues** ; et `pages/doc/lecon-01.html` porte la phrase identique avec **82**.
      `git show 785940f` montre les deux pages cohérentes à l'écriture : c'est une dérive du corpus, pas
      deux définitions. Cause structurelle : `gen.js` n'écrit que `lecon-<num>.html`, `tools/doc/corps/`
      ne contient que `l1..l4.html` — **`cours.html` n'a aucun gabarit et n'est lu par aucun outil**.
      Le mécanisme protège la leçon et laisse dériver la page lue en premier. Passer `cours.html` sous
      `gen.js`, ou étendre le contrôle de péremption de `verif-doc.js` à ce fichier.

- [ ] **C3 · Les deux études de cas dont le bloc de sortie a dérivé.** `pages/etude-inconnu.html` :
      **cinq** valeurs ont dérivé, pas trois (13174 → 13175 blocs, 6519.3 → 6543.4 Ko, 10610 → 10609,
      « neutralisation 27.8 % » → 27.9 %, `ruby(225)` → `ruby(224)`), et `10610` apparaît **4 fois**
      (l.79, 112, 150, 227). `tools/preuves/etude-inconnu.js` annonce « fautes : 0 » : il ne compare que
      le tableau des marqueurs, **jamais les totaux**. `pages/etude-recherche.html` : 45958 → 46027 mots,
      928606 → 929902 couples, 4.08 → 4.09 Mo — la page était **exacte à son assemblage** (vérifié en
      recomptant l'index au commit `e61edec`), écart réel de +0,15 %. Réassembler les deux
      (`assembler.js`, `mesures.js`) **et étendre les deux preuves aux blocs de mesures**, sans quoi
      elles rederiveront au prochain commit de contenu.

- [ ] **C4 · `pages/examen.html` annonce « plus de 3000 questions » ; la banque en contient 6 151.**
      Corriger, et rattacher l'annonce à une mesure plutôt qu'à un nombre écrit à la main.

- [ ] **C5 · Le contrôle des compteurs affichés (I19) ne regarde que 4 fichiers alors que les compteurs
      vivent dans 8.** Étendre, et éprouver par injection.

---

## PHASE D — La machinerie de l'autonomie

Huit constats retenus sur le wrapper et sa surveillance. Aucun n'a touché un apprenant ; tous ont coûté
des heures de travail perdues ou invisibles.

- [ ] **D1 · `Get-HeureReset` reporte au lendemain au maximum, alors qu'une limite HEBDOMADAIRE peut se
      remettre à zéro six jours plus tard.** L'API donne la date exacte
      (`tools/usage-anthropic.js reset`) : s'en servir toujours, et ne garder le message texte que comme
      repli. Éprouver sur les quatre formes réelles trouvées dans les transcrits.

- [ ] **D2 · Le verrou de pause d'usage peut poser une reprise DÉJÀ PASSÉE**, auquel cas il ne diffère
      plus rien. Vérifier que la date calculée est dans le futur, sinon reporter au prochain créneau
      utile, et le journaliser.

- [ ] **D3 · La réparation horaire de `sante-autonomie.ps1` écrase le report d'usage par un réveil dans
      2 minutes**, et ignore la pause décidée par le wrapper. Les deux mécanismes doivent se parler : la
      surveillance ne doit pas défaire ce que le verrou vient de décider.

- [ ] **D4 · `sante-autonomie.ps1` écrit « réparé : réactivation IMPOSSIBLE » et sort en code 0** quand
      la réparation a échoué. Un rapport qui se contredit dans sa propre phrase. Corriger le texte **et**
      le code de sortie.

- [ ] **D5 · Le `Replace` du plan courant corrompt le prompt envoyé à chaque réveil** : le plan y est
      décrit deux fois, avec des noms différents. Le modèle reçoit donc une consigne contradictoire à
      chaque passe. Réécrire la substitution proprement, et **relire le prompt final** avant envoi.

- [ ] **D6 · Les deux prompts annoncent des chiffres périmés que le modèle est censé reprendre**
      (« 83 cours, 1463 lecons » alors que la mesure du jour donne 90 cours et 1 540 leçons). Soit les
      calculer au lancement, soit ne plus en citer aucun.

- [ ] **D7 · Le drapeau `.autonomie/verif-finale.ok` n'est jamais supprimé.** Trois occurrences dans le
      wrapper, aucune suppression, et les 21 versions du fichier depuis le 2026-08-02 sont identiques
      sur ce point. Reproduit sur copie : drapeau vieux de 180 jours + chaîne re-terminée → extinction
      **sans passe de sécurité**. Nuance mesurée à conserver : la branche n'a **jamais** été prise en
      ~10 créations du drapeau, donc le risque est théorique mais armé. Dater le drapeau et le refuser
      si `$CHAINE` a changé, ou le supprimer dès qu'un plan retrouve une case décochée.

- [ ] **D8 · `autonomie.ps1` ne regarde jamais le marqueur d'arrêt volontaire au démarrage.** Un
      lancement manuel repart donc même quand un arrêt a été demandé — c'est exactement ce qui s'est
      produit le 2026-09-08 à 19:09:08, neuf secondes après un `ARRET MANUEL`. Lire le marqueur au
      démarrage et refuser de partir, sauf drapeau explicite.

- [ ] **D9 · `journal.log` n'a aucune rotation** et reçoit l'intégralité de la sortie du modèle : 640 Ko,
      6 693 lignes, 726 réveils. Poser une rotation, et vérifier qu'elle ne casse pas la lecture de
      `sante-autonomie.ps1`. **Piège connu à respecter** : ne jamais ouvrir ce fichier avec un `tail -f`
      — sous Windows cela le verrouille et `Add-Content` échoue en silence.

- [ ] **D10 · Le verrou anti-chevauchement peut prendre un PID recyclé pour la passe précédente** et
      sauter les réveils jusqu'au plafond de 6 h. Ajouter une vérification de l'heure de démarrage du
      processus, pas seulement de son nom.

---

## PHASE E — Reprendre le V16 en connaissance de cause

- [ ] **E1 · La nouvelle faille des QCM : le POINT INTERNE.** L'audit l'a mesurée à **98,9 % de
      rendement** (282 justes sur 285) sur une couverture de 4,6 % — « la seule option en deux
      phrases ». C'est la plus forte jamais mesurée sur ce site, et elle est **fabriquée par la
      correction elle-même** : en étoffant les distracteurs, on écrit parfois une bonne réponse en deux
      phrases là où les autres n'en ont qu'une. Écrire la consigne qui la ferme, la verser dans le
      cadrage de B4 du V16, et vérifier sur les 38 cours déjà traités qu'elle n'y est pas déjà installée.

- [ ] **E2 · Le verdict sur B4, écrit noir sur blanc dans le V16.** L'audit a établi que **B4 ne peut
      pas être cochée** : la cible du plan est **par cours** (longueur ≤ 40 %, aucune stratégie
      exploitable > 60 %), pas globale, et le V16 déclare lui-même la cible globale « hors de portée de
      ce chantier ». État mesuré : **38 cours à ≤ 40 %** (3 243 questions, moyenne pondérée 22,7 %) et
      **52 cours au-dessus** (2 924 questions, 47,4 % du corpus, moyenne pondérée 91,5 %), dont **0**
      dont la pire stratégie exploitable reste sous 60 %. Le 55,4 % global est bas **seulement** parce
      que les cours traités compensent les autres — le piège « un indice de lot vaut 100 % sur le lot et
      25 % sur le site ». Inscrire ce constat dans `CHANTIER-V16.md` pour que la case ne soit pas cochée
      par erreur, avec la liste des 52 cours restants classés par nocivité (questions × taux).

---

## PHASE F — Contrôle final

- [ ] **F1 · Non-régression.** Les vérificateurs verts en `--rapide`, `--complet` et `--strict`.
- [ ] **F2 · Chaque garde-fou corrigé, éprouvé par injection.** Reprendre un par un les contrôles
      touchés par ce chantier, leur donner une faute, vérifier qu'ils rougissent. Publier le tableau.
- [ ] **F3 · Mesure globale.** Blocs SQL et JS en erreur : **124 et 451 au départ**, combien à
      l'arrivée ? Outils hors chaîne : combien au départ, combien à l'arrivée ? Chiffres publiés faux :
      combien restent ?
- [ ] **F4 · Ce qui n'a pas été fait.** Lister et expliquer, sans arrondir. Reprendre aussi les cinq
      angles morts que l'audit s'est reconnus : aucune exécution réelle sur neuf langages (les
      compilateurs sont absents de la machine), le rendu visuel jamais regardé, 344 blocs `.txt` sur 793
      confrontés à rien, le mode `--mutations` jamais lancé, et `verif-clic.js` passé sur 8 leçons
      seulement.

---

## Fin de chantier

Quand toutes les cases sont cochées, l'autonomie enchaîne sur `CHANTIER-V16.md`, qui reprend là où il
s'était arrêté — avec, cette fois, des instruments qui savent échouer.
