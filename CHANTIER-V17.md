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

- [x] **A8 · Une mutation SURVIVANTE : `verif-exemples.js` reste vert sur une sortie de commentaire
      faussée.** `node tools/verif-chaine-mutations.js` le 2026-09-09 : **9 mutations injectées, 8
      vues, 1 survivante** — « une sortie annoncée en commentaire qui ne correspond plus à ce que le
      code produit » (98,8 s). Reproduit à l'identique en chaîne et hors chaîne. C'est **le défaut
      fondateur du chantier V17 lui-même** — l'exemple faux qu'aucun outil ne rattrape — et il est
      aujourd'hui **mesuré**, plus seulement raconté. Trouver ce que la mutation change exactement,
      pourquoi `verif-exemples.js` ne le voit pas, corriger l'outil, et exiger **9 / 9**.

      **FAIT le 2026-09-09.** *Reproduit d'abord* : `node tools/verif-chaine-mutations.js` →
      **9 injectées, 8 vues, 1 survivante** (`exemple`, 90,1 s), à l'identique.

      **La cause, et elle est plus grosse que la mutation.** En JavaScript, `.` ne matche **pas**
      `\r`. Le motif `/^\s*(?:=>|➡️?|⇒)\s*(.*)$/` d'`attenduDeCommentaire` échouait donc sur **toute
      ligne terminée par CRLF** : ni `(.*)` ni `$` ne peuvent franchir un retour chariot. Mesuré sur le
      bloc muté, en appelant `instrumente` sur les quatre combinaisons :
      **ancienne version · LF → 4 annonces sur 4 ; ancienne · CRLF → 1 sur 4** (seule la dernière ligne
      du bloc, celle qui n'a pas de fin de ligne) ; **corrigée · LF → 4 ; corrigée · CRLF → 4**.
      Avec une seule annonce pour quatre sorties, les comptes tombaient inégaux, l'appariement par
      ligne prenait le relais, jugeait la seule ligne qu'il pouvait — et concluait « conforme ancré ».
      L'annonce faussée n'était pas *mal jugée* : elle n'était **pas lue**.

      **Portée réelle.** `core.autocrlf` vaut `true` ici : **114 leçons sur 1 629** sont en CRLF sur ce
      disque aujourd'hui, mais un **clone frais les met toutes en CRLF**. Mesure faite sur une copie du
      site entier converti en CRLF (les 1 629 leçons, les deux versions de l'outil lancées sur les
      mêmes fichiers) : **1 109 annonces repérées avant, 2 063 après** — **954 annonces sur 2 063,
      soit 46,2 %, étaient invisibles** ; 882 → 1 058 blocs jugés ; et les « conformes ancrés », c'est-à-dire
      les blocs sauvés par le recours, retombent de **257 à 77**. Dans les deux cas **0 divergence** :
      le contenu du site est sain, c'est bien l'instrument qui était borgne.

      **Correction** : le `\r` est retiré une fois, à l'entrée (`blocsDe`), plutôt que de rendre chaque
      motif tolérant au CR ; même normalisation dans `exosCodeDe`, par cohérence — sans effet mesuré
      aujourd'hui (197 exos conformes avant et après), c'est une précaution, pas un correctif.

      **Éprouvé.** `verif-chaine-mutations.js` : **9 injectées, 9 VUES, 0 survivante**, arbre de travail
      identique à avant la mesure. Et la mutation `exemple` a été **rendue indépendante du disque** :
      elle force désormais la page en CRLF (`crlf: true`), sinon l'épreuve mesurerait selon qu'un
      `git checkout` a retouché ce fichier ou non. `verif.js --rapide` **tout vert, 40 étapes, 136,4 s** ;
      site entier rejoué : **3 411 blocs, 1 058 porteurs d'annonce, 0 divergence**.

- [x] **A9 · `verif-clic.js` ne juge jamais tous les blocs, et l'écart varie.** Deux mesures du
      2026-09-09 : **498 / 513** blocs cliqués dans la chaîne (1 584,7 s), **512 / 513** relancé seul
      (1 081 s), **504 / 513** au rejeu de la chaîne (1 361,3 s) — trois passages, trois valeurs. L'outil a raison de sortir en 2 plutôt que d'annoncer « tout concorde » (c'est l'acquis
      du V17/A3), mais il **ne peut pas être vert**, donc `--complet` ne peut jamais l'être non plus :
      un mode qui ne peut pas être vert cesse d'être lu. Identifier le ou les blocs perdus — la mesure
      dit qu'ils ne sont pas toujours les mêmes — et rendre la couverture soit complète, soit
      **explicitement bornée** (un bloc qu'on décide de ne pas juger doit être nommé et compté à part,
      comme le sont déjà les 51 « sans bloc de sortie à comparer »).

      **FAIT le 2026-09-09.** *Quatrième mesure d'abord* : **512 / 513** (1 090 s) — quatre passages,
      **quatre valeurs** (498, 512, 504, 512). Le résumé ne disait que le total : impossible de savoir
      **où** la couverture se perdait. Premier correctif, donc : le relevé passe **par page**, et tout
      bloc JavaScript resté sans bouton est **nommé** (fichier + `data-file`). Le passage suivant a
      livré le coupable en une ligne : **`pages/maths/lecon-07.html : 9 / 10 — sans bouton : modulo.js`**.

      **Deux causes, et une seule était celle qu'on cherchait.**
      1. *Structurelle.* `modulo.js` porte `data-runner="skip"` **écrit dans le source** — l'auteur a
         désactivé le bouton lui-même (c'est un `const mod = (a, n) => …`, sans affichage), et
         `runner.js` sort aussitôt (`if (!bar || block.hasAttribute("data-runner")) return`).
         `blocsAttendusDe` ne regardait pas cet attribut : il attendait donc **un bouton qui ne
         viendrait jamais**. Il y a **48 blocs `data-runner="skip"` dans 8 fichiers**, dont 2 leçons ;
         un seul tombe dans le corpus des 75 pages. **Un bloc qu'on renonce à juger doit sortir du
         DÉNOMINATEUR, pas être retranché d'un total** : l'attendu passe à **512**.
      2. *Temporelle.* L'attente s'arrêtait sur « nombre de boutons **stable** sur deux relevés » —
         or deux relevés identiques peuvent tomber dans une **pause** de l'initialisation, et la page
         est alors lue à moitié équipée. On attend désormais le **nombre attendu pour cette page-là**
         (le compte est connu avant d'ouvrir Chrome), avec 5 s de rallonge **réservées aux pages en
         retard** : une page complète ne paie plus l'attente d'une page lente.

      **Éprouvé par injection, dans les deux sens.** Un script inline posté en fin de page **retire le
      bouton** du premier bloc après que `runner.js` l'a posé (DOMContentLoaded + `setTimeout` 0) : le
      source de la figure ne porte rien, donc le dénominateur ne bouge pas — c'est exactement « un bloc
      attendu que la mesure ne juge pas ». Faute injectée → **code 2**, `pages/maths/lecon-09.html :
      8 / 9 — sans bouton : valeur-exacte.js`. Faute retirée → **code 0**, **9 / 9**, page **restaurée à
      l'octet près** (comparaison binaire `true`).

      **Résultat** : **512 blocs cliqués sur 512 attendus, couverture complète, 0 divergent, code 0**
      en 1 013 s (13,5 s/page) — **le premier passage vert de cet outil**, et `--complet` peut donc
      l'être aussi. La détection de `data-runner` a été durcie au passage (casse indifférente, attribut
      sans valeur accepté), sinon la même faute serait revenue par une simple majuscule.

---

## PHASE B — Ce que l'apprenant voit casser

Un bouton « Tester » qui rend une erreur est pire qu'une absence de bouton : le panneau **promet** un
résultat avant le clic.

- [x] **B1 · Les blocs SQL : 124 en erreur sur 303 au départ → 4 sur 260, et ces 4 sont ceux qui
      DOIVENT échouer.** Le site n'a plus aucune vraie panne SQL. Clos par les six sous-points B1a à
      B1e ; ce qui suit est le bilan, chaque chiffre étant justifié dans sa case.

      | cours | au départ | à l'arrivée |
      |---|---|---|
      | `sql` | 128 aboutis sur 215 | **187 / 187 (100 %)** |
      | `bdd` | 50 / 70 | **58 / 62 (94 %)**, les 4 restants sont des démonstrations d'erreur voulues |
      | `data-eng` | 1 / 17 | **11 / 11 (100 %)** |
      | `securite` | 0 / 1 | bloc MySQL écarté, la page n'a plus de bouton mort |

      **Ce que le chantier a réellement corrigé n'était pas 124 fautes d'écriture.** Sur les 120 blocs
      traités, la très grande majorité relevait de trois causes structurelles, et non de leçons
      fautives : des **règles du moteur qui se trompaient de question** (la règle du seed lisait les
      commentaires comme du code ; elle jugeait « autonome » un bloc qui LIT une table qu'il ne crée
      pas), un **décor incomplet** (les leçons interrogeaient des schémas qu'elles déclarent ailleurs
      dans leur page, or chaque bloc part d'une base neuve), et des **dialectes comparés** — c'est le
      sujet même de plusieurs leçons — que rien ne distinguait de SQLite.

      **Quatre règles ont été ajoutées au moteur, toutes de la même famille** : *ce que la leçon écrit
      l'emporte sur le décor*. Un bloc qui crée une table ne reçoit pas celle du décor (B1a) ; les
      commentaires ne comptent dans aucune décision (B1c-1) ; une vue du décor n'existe que pour le
      bloc qui écrit son nom sans la définir (B1b-2) ; une leçon qui ajoute une colonne l'emporte sur
      le décor qui la porte déjà (B1c-2). Chacune est déclarée UNE FOIS dans `js/runner.js` et **lue**
      par `tools/verif-sql.js` — jamais recopiée, pour que le vérificateur ne puisse pas mesurer autre
      chose que ce que voit l'apprenant.

      **Deux contrôles ont été ajoutés, et ils regardent dans la direction que le cliquet ne couvre
      pas.** Le cliquet ne rougit qu'à la HAUSSE du nombre d'erreurs : une leçon qui cesse de démontrer
      ce qu'elle annonce fait BAISSER ce nombre et passait donc pour une bonne nouvelle.
      `verif-sql-demonstrations.json` corrige cet angle mort en CONTRAIGNANT les 4 blocs qui doivent
      échouer à échouer avec leur message exact (B1c-2). Et `sql-lecon.js` ne rend plus de verdict vert
      quand il n'a rien lu : « rien lu » n'est plus confondu avec « le moteur a dit qu'il ne pouvait
      pas » (B1e).

      **Ce que ce point apprend sur la méthode**, et qui vaut au-delà du SQL :
      · **mesurer l'impact d'un motif AVANT de l'écrire** a évité de retirer un seul bouton vivant sur
        les 27 marqueurs de dialecte ajoutés — et a montré que `reverse()` existe dans SQLite alors que
        la leçon affirmait le contraire ;
      · **rejouer le scénario complet après chaque correction** a rattrapé trois régressions qu'aucune
        relecture n'aurait vues (`clients.pays`, `commandes_clients` deux fois) ;
      · **éprouver un contrôle par injection** a trouvé deux défauts dans les contrôles eux-mêmes,
        écrits le jour même — un compteur incrémenté trop tôt, une détection testée sur le mauvais
        texte — plus un faux positif d'un garde-fou dès son premier emploi réel ;
      · **un outil peut mentir en silence** : `verif-controles.js` a attrapé un `\b` devenu un vrai
        U+0008 dans mon script de mesure, qui annonçait « 0 bloc concerné » là où la réponse est 1.

- [x] **B1a · `data-eng` : 16 blocs en erreur sur 17 → 0 sur 11.** Mesure reproduite avant de toucher
      à quoi que ce soit : `node tools/verif-sql.js` rendait exactement les chiffres du plan (303 blocs,
      124 en erreur, `data-eng` 1 abouti sur 17). Les 16 échecs se sont partagés en **deux causes, pas
      une** — et aucune des deux n'était une faute d'écriture des leçons :

      **1) Une règle du moteur qui se trompait de question (10 blocs).** `js/runner.js` décidait de
      précharger la base de démonstration ainsi : « le bloc contient `CREATE TABLE`, donc il est
      autonome, pas de base ». Or `CREATE TABLE trajets_valides AS SELECT … FROM trajets_nettoyes`
      contient bien `CREATE TABLE` et n'est PAS autonome : il LIT une table qu'il ne crée pas, et
      repartait donc d'une base vide — l'erreur était garantie. La règle est devenue : on précharge
      **sauf si le bloc crée une table dont la base porte déjà le nom** (sinon « table already exists »).
      Effet mesuré **seul, avant tout autre changement** : 124 → 123 en erreur, 179 → 180 aboutis,
      **aucun bloc qui marchait n'est tombé**. Le motif `TABLE_CREEE` est déclaré une seule fois dans
      `runner.js` et **lu** par `tools/verif-sql.js` (comme `AUTRE_SGBD` l'était déjà) : la copie qui
      dormait dans le vérificateur — `!/CREATE\s+TABLE/i` — a disparu, elle aurait divergé au premier
      ajustement.

      **2) Un cours écrit pour un autre moteur (6 blocs) et un fil rouge absent de la base (10 blocs).**
      `data-eng` enseigne l'entrepôt moderne : `TRY_CAST`, `DATE_DIFF`, `DATE_TRUNC`, `MD5`,
      `CREATE OR REPLACE TABLE`, `INTERVAL 1 DAY` — DuckDB, Snowflake, BigQuery. Rien de tout cela
      n'existe dans SQLite : ces blocs ne devaient pas porter de bouton, ils sont désormais écartés par
      `AUTRE_SGBD` comme 57 autres l'étaient déjà. **Vérifié avant d'écrire le motif** (`tmp/impact.js`,
      puis relance ciblée) : les 19 blocs du site que ces sept marqueurs désignent étaient **tous en
      erreur**, donc **zéro bouton qui marchait n'a été retiré**. Les 10 blocs restants interrogeaient le
      fil rouge « Vélociti » (`bronze_trajets`, `bronze_capteurs`, `trajets_nettoyes`, `trajets`,
      `stations`, `fichier_du_jour`) que la base de démonstration ne contenait pas ; il y est ajouté,
      minuscule mais fidèle aux colonnes citées, et **peuplé pour que les contrôles de la leçon 10
      démontrent ce qu'ils annoncent** : 0 ligne pour le test d'énumération, exactement 2 pour le test
      des anomalies (une `station_end` orpheline, une durée de 300 min).

      **Mesure finale, site entier** : **124 → 104 blocs en erreur**, aboutis **179 → 190**, `data-eng`
      **1/17 → 11/11 (100 %)**. Les 20 disparus se décomposent en 11 réparés et 9 écartés à juste titre.

      **Preuve par le navigateur, pas par le vérificateur** (le Worker de `runner.js` a sa propre copie
      de la règle du seed, que `verif-sql.js` n'exécute pas) : `node tools/preuves/sql-lecon.js` sur les
      leçons touchées, dans un vrai Chrome, `file://`, DNS coupé — **16 blocs cliqués, 16 résultats, 0
      erreur, 0 requête distante**. `pages/data-eng/lecon-10.html` bloc 3 rend bien les deux lignes
      annoncées ; `lecon-07` bloc 2 rendait `0` (aucune station 42 dans le jeu de données), une ligne a
      été ajoutée pour qu'il rende `1` — un compteur à zéro n'illustre rien.

      **Cliquet éprouvé par injection, dans les deux sens.** Avec la référence encore à 124, une table
      renommée en `trajets_inexistante` dans `lecon-07` faisait 105 erreurs et l'outil restait **VERT
      (code 0)** — la démonstration du chantier : le cliquet était descendu de 124 à 104 non pour faire
      joli, mais parce qu'au-dessus il ne pouvait plus rien attraper. Référence descendue à 104, même
      faute réinjectée : **code 1**, « 105 contre 104 à la référence ». Faute retirée : **code 0**. La
      page est revenue à l'octet près (`git status` vide sous `pages/`).
      ⚠️ Le premier essai d'injection n'avait **rien remplacé** : après un `git checkout`, le fichier
      revient en CRLF et un motif écrit avec `\n` ne matche plus — et le script se taisait. Le script
      d'injection dit maintenant « AUCUN REMPLACEMENT » et sort en 9. Deuxième piège du même essai :
      `node … | tail` rend le code de sortie de `tail`, pas du vérificateur ; un `EXIT=0` y était donc
      un mensonge de mesure.

- [x] **B1b-1 · `sql`, le gisement des COLONNES : 84 blocs en erreur → 33.** Aboutis **128 → 171**,
      site entier **104 → 53**. Trois quarts des échecs du cours n'étaient pas des fautes d'écriture :
      les leçons interrogent le fil rouge avec des colonnes que la base de démonstration n'a jamais
      eues. Ajoutées, en suivant la règle déjà écrite pour le doublon `nom`/`libelle` — deux graphies
      de la même donnée valent mieux que vingt boutons qui rendent une erreur :
      `clients` + `points` (10 blocs), + `age` ; `produits` + `quantite`, `remise`, `depot` (6) ;
      `commandes` + `client`, `produit_id`, `categorie`, `mois`, `date`, `date_cmd` (20) ;
      `ventes` + `region`, `produit`, `categorie`, `mois`, `annee`, `trimestre`, `vendu_le` (14).
      Chaque convention suit SA leçon : `mois` vaut `'janvier'` sur `ventes` (la leçon 20 compare à ce
      littéral) et `'2026-05'` sur `commandes` (la leçon 5 y groupe des mois ISO).
      **ROLLUP, CUBE et PIVOT** rejoignent `AUTRE_SGBD`, après mesure sur le moteur du dépôt
      (`tmp/essai.js` : « no such function: ROLLUP », « no such function: CUBE », « near "(" ») : les
      **11 blocs** du site qui les emploient n'aboutissaient **aucun**, donc aucun bouton vivant retiré.
      **Aucune régression** : à chaque étape, le nombre d'aboutis n'a fait que monter (128 → 137 → 171).
      **Preuve par le navigateur** : `sql-lecon.js` sur les leçons 02, 04, 05, 13 et 20 — **48 blocs
      cliqués, 48 résultats, 0 requête distante**, et les résultats sont ceux qu'annonce le texte (la
      leçon 2 rend bien les 3 produits du dépôt de Lyon, la leçon 5 ses trois catégories, la leçon 20 sa
      colonne « février » remplie, donc l'accent traverse intact le Blob du Worker).
      Cliquet descendu à **53** et éprouvé : faute injectée → **code 1** ; faute retirée → **code 0**.
      ⚠️ **Défaut d'instrument relevé au passage**, à traiter ailleurs : `tools/preuves/sql-lecon.js`
      rend **trois « MOTEUR KO » fantômes** quand on lui passe **trois** leçons d'un coup (les trois
      derniers blocs de la dernière page) ; les mêmes pages passées par deux, ou seules, donnent **0**.
      Ce n'est pas le site qui échoue, c'est l'outil qui rend un verdict dépendant de la taille du lot —
      exactement le défaut que le point A3 a corrigé sur `verif-clic.js`.

- [x] **B1b-2 · `sql`, le gisement des TABLES : 32 blocs en erreur → 0. Le cours est à 187/187, soit
      100 %.** Site entier **47 → 14**. Mesure reproduite avant de toucher à quoi que ce soit : 47 blocs
      en erreur, dont 32 dans `sql` (le plan en annonçait 33 ; l'écart d'un vient du bloc que B1c-1 avait
      rendu cliquable). Trois vagues, chacune mesurée séparément.

      **1) Dix marqueurs de dialecte — 14 blocs, dont ZÉRO aboutissait (47 → 33).** Les leçons 4, 10, 12,
      16, 17 et 24 COMPARENT les dialectes : c'est leur sujet. Chaque forme a été essayée sur le moteur
      du dépôt avant d'être écrite (`tmp/essai2.js`) : `EXTRACT(… FROM …)` et `SUBSTRING(… FROM … FOR)`
      → « near "FROM" » ; `GRANT`/`REVOKE` → « near "GRANT" » ; `ON DUPLICATE KEY` → « near
      "DUPLICATE" » ; `USING GIN` → « near "USING" » ; `@>`/`@@` → « unrecognized token » ;
      `to_tsvector`/`to_tsquery`/`ts_rank` → « no such function » ; `FULLTEXT`/`AGAINST(` ; `= ANY(` →
      « no such function: ANY » ; `INCLUDE (` → « near "INCLUDE" ». **Impact mesuré AVANT écriture**
      (`tmp/impact3.js`, qui exécute chaque bloc désigné) : **14 blocs visés, 14 déjà en erreur, 0
      vivant** — aucun bouton qui marchait n'a été retiré, et le nombre d'aboutis n'a pas bougé (234).
      ⚠️ `@[>@]` et non `@\w` : la variante large attrapait les adresses e-mail des données d'exemple.

      **2) Le décor élargi — 15 blocs réparés (33 → 18), aboutis 234 → 249.** Onze schémas d'une seule
      leçon manquaient à la base de démonstration : `tailles`/`couleurs` (le CROSS JOIN de la leçon 8,
      qui rend bien les 6 paires S·M·L × Rouge·Bleu annoncées), `clients_lyon`, `ventes_produits`,
      `employe`, `produit`, `factures`, `paiements`, `lignes_panier`, `articles`, `contacts`, plus les
      colonnes `client_id` sur `clients` et `creee_le`/`statut` sur `commandes`. **Rien n'est inventé** :
      le contenu vient de ce que LA LEÇON annonce. `employe` porte Alice/Brahim/Chloé/Diego/Elena, et
      le bouton de la leçon 16 rend désormais **exactement le tableau publié en dessous** (niveau 1
      Alice, 2 Brahim, 2 Chloé, 3 Diego, 3 Elena). `ventes_produits` est **copié du bloc `data-exos` de
      la même leçon** : le bouton « Exécuter » et l'exercice auto-corrigé travaillent maintenant sur les
      mêmes lignes, et le bloc 10 rend les trois lignes que l'exercice déclare attendues.
      `clients.client_id` DOUBLE `id` à dessein : la leçon 8 enseigne `JOIN … USING (client_id)` et écrit
      sous le bloc « marche seulement si la colonne porte le même nom des deux côtés » — l'exemple qui
      ILLUSTRE la règle était le seul à ne pas la respecter.
      ⚠️ **Une régression attrapée au vol, et c'est le cœur du point.** Ajouter `pays` à `clients` (pour
      la leçon 17) a cassé `sql/lecon-11 #11`, qui ENSEIGNE `ALTER TABLE clients ADD COLUMN pays` :
      « duplicate column name: pays ». Un bouton vivant perdu pour en gagner un autre — échange nul.
      `pays` est donc resté hors du décor et c'est la leçon 17 qui a été recalée sur `ville`, colonne du
      fil rouge (2 requêtes + 2 lignes de plan). Les deux boutons vivent.

      **3) Les vues du décor, et pourquoi elles sont CONDITIONNELLES (18 → 15).** La leçon 12 crée
      `commandes_clients` dans un bloc et la LIT dans le suivant ; la leçon 24 lit un socle `ca_mensuel`
      que ses propres blocs définissent en `MATERIALIZED VIEW` (écarté). Poser ces vues
      inconditionnellement a produit **deux régressions successives, toutes deux mesurées** : d'abord
      `lecon-12 #1` (« table commandes_clients already exists »), puis — une fois corrigé —
      `lecon-23 #2`, qui fait `ALTER TABLE clients DROP COLUMN nom` et que SQLite refuse dès qu'une vue
      dépend de la colonne (« error in view commandes_clients after drop column »). Ce bloc ne parle
      pas de vues ; il n'avait aucune raison d'en subir une. D'où la règle finale, écrite dans
      `SEED_VUES` : **une vue du décor n'existe que pour le bloc qui écrit son nom sans la définir
      lui-même.** Le motif `VUE_CREEE` et la liste `SEED_VUES` sont LUS par `verif-sql.js`, jamais
      recopiés — comme `AUTRE_SGBD` et `TABLE_CREEE`. Dernier bloc traité : la CTE au corps vide
      `WITH ca_mensuel AS ( /* le socle ci-dessus */ )` de la leçon 24, devenue un commentaire, ce qui
      l'aligne sur les trois blocs voisins qui lisent le socle directement.

      **4) Quatre boutons retirés parce qu'ils MENTAIENT — le seul retrait de blocs aboutissant.**
      La leçon 17 recalée, son bloc `EXPLAIN` s'est mis à aboutir. Cliqué dans un vrai Chrome, il rend
      le bytecode de la machine virtuelle SQLite — colonnes `addr opcode p1 p2 p3 p4 p5 comment`,
      « 0 Init 0 10 0 NULL… » — alors que la page annonce juste en dessous
      « Seq Scan on clients (cost=0.00..2310.00 rows=12000) ». Vérifié : les **trois autres** blocs
      `EXPLAIN` du site (`sql/lecon-14 #3`, `bdd/lecon-12 #1` et `#2`) sont dans le même cas, leurs
      pages publiant elles aussi des plans PostgreSQL. Un bouton qui affiche autre chose que ce que la
      page promet est pire qu'un bouton absent : `EXPLAIN` rejoint `AUTRE_SGBD`, **avec un lookahead
      qui préserve `EXPLAIN QUERY PLAN`**, la forme SQLite, qui rendrait un plan lisible.
      C'est ce retrait qui explique la seule baisse d'aboutis du point (252 → 248) : elle est voulue.

      **Preuve par le navigateur, pas par le vérificateur** (le Worker de `runner.js` a sa propre copie
      des règles, que `verif-sql.js` n'exécute pas) : `tools/preuves/sql-lecon.js` sur les leçons 04,
      08, 10, 12, 13, 16, 17, 22, 23, 24 du cours sql et sur `bdd/lecon-12`, dans un vrai Chrome,
      `file://`, DNS coupé — **65 blocs cliqués, 65 résultats, 0 erreur, 0 requête distante**. Les
      accents traversent le Blob du Worker (« Chloé » rendu intact). `bdd/lecon-12` est bien passée de
      5 blocs avec bouton à 2 : les trois `EXPLAIN` n'en ont plus.
      ⚠️ **Un tableau publié recalé dans la foulée** : rendre `lecon-12 #2` cliquable a mis son résultat
      en contradiction avec le tableau imprimé en dessous, qui annonçait Dupont/Martin/Nkono — trois
      noms absents du fil rouge. Il annonce maintenant la ligne mesurée (Camille Roy, Lyon, 120).

      **Cliquet descendu à 14 et éprouvé par injection, dans les deux sens** (`tmp/injecte-sql.js`, qui
      sort en 9 s'il ne remplace rien — le piège CRLF de B1a) : table renommée en
      `ventes_produits_absente` dans `lecon-13` → **code 1**, « 15 contre 14 à la référence » ; faute
      retirée → **code 0**, page revenue à l'octet près (`git diff` vide).
      `verif-html.js` 0/0 sur 1 629 fichiers ; `verif-donnees.js` 25 contrôles, 0 erreur après
      régénération de `search-index.js` (le contenu de trois leçons a changé) ; `verif.js --rapide`
      **40 étapes, tout vert**.
      ⚠️ **B1e reproduit une troisième fois au passage** : `sql-lecon.js` lancé sur `lecon-08` +
      `lecon-13` a annoncé « pages/sql/lecon-08.html — **0** bloc(s) SQL avec bouton », là où la même
      page seule en donne **11**, tous OK. Le verdict de cet outil dépend toujours de la taille du lot.

- [x] **B1c-1 · « les commentaires ne sont pas du code » : `bdd` 19 → 14, site 53 → 47.** Deux
      décisions du moteur lisaient le texte BRUT du bloc, commentaires compris, et se trompaient :

      **1) La règle du seed.** `pages/bdd/lecon-11.html` rappelle en commentaire
      `-- CREATE TABLE client (…, email TEXT NOT NULL UNIQUE, …);`. La règle y voyait la création d'une
      table qu'elle connaît, en concluait « bloc autonome », ne préchargeait rien — et le
      `CREATE INDEX … ON representation` juste au-dessus rendait « no such table: main.representation ».
      Ce n'était pas neuf : l'ancienne règle `!/CREATE\s+TABLE/i` tombait dans le même piège.
      **2) Le filtre de dialecte.** Symétriquement, `pages/sql/lecon-18.html #4` **aboutit** alors qu'il
      cite un `ALTER TABLE … ADD CONSTRAINT` PostgreSQL derrière `--` : juger le texte brut lui aurait
      retiré son bouton pour une phrase de commentaire. Mesuré avant d'écrire quoi que ce soit
      (`tmp/impact2.js`) : appliquer le filtre au code nu ne fait basculer **qu'un seul bloc** sur tout
      le site, `sql/lecon-17 #12`, écarté jusqu'ici pour un `EXPLAIN ANALYZE` en commentaire — il
      redevient cliquable et rejoint la liste des blocs à traiter (`no such table: factures`).

      Dans la foulée, **`ADD CONSTRAINT`, `DROP CONSTRAINT`, `ALTER COLUMN` et `MODIFY`** rejoignent
      `AUTRE_SGBD` : SQLite ne sait modifier ni une contrainte ni une colonne, et la leçon 14 du cours
      bdd **l'écrit elle-même** (« SQLite, lui, ne sait pas ALTER une colonne »). 6 des 7 blocs
      concernés étaient déjà en erreur ; le 7ᵉ ne l'est pas et garde son bouton, précisément parce que
      sa clause est en commentaire.

      **Preuve par le navigateur** : `bdd/lecon-11` bloc 1 rend maintenant ses 4 représentations, et
      `sql/lecon-18` **6 blocs sur 6**. Cliquet descendu à **47**, éprouvé : injection → **code 1**,
      retrait → **code 0**. `verif.js --rapide` : 40 étapes, tout est vert.

- [x] **B1c-2 · `bdd` : 13 blocs en erreur → 4, et les 4 restants sont ceux qui DOIVENT échouer.**
      Le cours passe de 50/63 à 58/62 (94 %) ; site entier **14 → 5**, dont 4 démonstrations voulues.
      Il n'y avait donc plus qu'**une seule vraie panne sur tout le site** à la fin du point : l'unique
      bloc du cours `securite` (B1d). Mesure reproduite d'abord : 13 et non 14, parce que
      `bdd/lecon-12 #4` a été écarté par le marqueur `EXPLAIN` du point précédent.

      **1) Un bloc PostgreSQL que la leçon signale elle-même.** `lecon-14 #8` emploie `strpos` et
      `reverse`, et la leçon écrit « strpos et reverse sont deux fonctions PostgreSQL ». Elle se trompe
      à moitié, et c'est la MESURE qui l'a montré : sur le moteur du dépôt, `reverse('abc')` est
      **ACCEPTÉ** ; seul `strpos` rend « no such function ». Le marqueur ne retient donc que `strpos` —
      écarter `reverse` aurait retiré des boutons sans raison. 1 bloc désigné, déjà en erreur, 0 vivant.

      **2) Le décor du fil rouge « Rideau » complété — 8 blocs réparés.** Les leçons 10 et 11 écrivent
      `JOIN salle s ON s.salle_id = r.salle_id` et `JOIN zone z ON z.zone_id = p.zone_id`, chaîne que la
      leçon 4 DÉCLARE (« une place atteint sa salle en passant par sa zone ») mais que le décor ne
      portait pas. Ajoutés : `salle`, `zone`, `place.zone_id`, `representation.salle_id`, `tarif`,
      `paiement`, `billet_multivalue`, `reservations`, plus la **représentation 42** sur laquelle
      filtrent une demi-douzaine de blocs — sans elle, ils auraient abouti en rendant zéro ligne, et
      un compteur à zéro n'illustre rien. Comme au point précédent, rien n'est inventé :
      `billet_multivalue` reprend le schéma et les deux lignes du bloc qui les déclare dans la page, et
      `reservations` est **copié du bloc `data-exos` de la même leçon, faute de frappe « Lile »
      comprise** — c'est elle qui fait apparaître deux villes pour une salle. Résultat mesuré dans le
      navigateur : le bloc rend « Théâtre du Nord | 2 », exactement ce que l'exercice auto-corrigé
      déclare attendu.

      **3) UNE LEÇON QUI AJOUTE UNE COLONNE L'EMPORTE SUR LE DÉCOR (règle `COLONNE_AJOUTEE`).** La
      leçon 10 AJOUTE `representation.places_restantes` et `commande.total` dans un bloc, puis les LIT
      dans deux autres. Sans règle, l'arbitrage était perdant des deux côtés : porter les colonnes au
      décor cassait le bloc qui les ajoute (« duplicate column name »), ne pas les porter laissait deux
      blocs morts. **C'est exactement l'arbitrage devant lequel `clients.pays` avait fait RENONCER au
      point B1b-2** — la règle le résout pour de bon. La colonne est retirée du décor juste avant le
      bloc qui l'ajoute ; le retrait est tenté sans garantie (SQLite refuse de retirer une colonne dont
      un index dépend), l'échec est silencieux et le bloc se comporte alors comme avant : **aucune
      régression possible**. La forme reconnue est `ADD COLUMN <nom>` et non `ADD <nom>`, sinon
      `ADD CONSTRAINT` serait lu comme une colonne nommée « CONSTRAINT » ; les 9 `ADD COLUMN` du site
      sont tous dans cette forme. Les valeurs stockées sont choisies pour DÉMONTRER : `commande 3`
      porte un total faux (25,00 contre 18,00 de billets) et `commande 4` n'a aucun billet — le bloc de
      contrôle rend donc les **deux** cas que la leçon souligne, la divergence et le `COALESCE` sur la
      somme vide (mesuré : « 3 | 25 | 18 » et « 4 | 12 | 0 »).

      **4) LE CŒUR DU POINT — comment compter les 4 démonstrations d'erreur, sans rien affaiblir.**
      Le plan posait la bonne objection : un motif « ERREUR » cherché dans les commentaires aurait aussi
      couvert les vraies pannes des pages qui parlent d'erreurs. La réponse retenue est
      `tools/verif-sql-demonstrations.json`, **qui n'est pas une exemption mais une CONTRAINTE** :
      chaque bloc déclaré doit échouer, et échouer **avec le message déclaré**. Trois verdicts :
      conforme ; **ABOUTIT** → sortie en 1 (« démonstration muette ») ; **échoue autrement** → sortie
      en 1 (« démonstration déviée »). Un quatrième contrôle vérifie que les 4 blocs déclarés sont bien
      tous rencontrés — sinon la déclaration ne correspond plus au site.
      **Pourquoi cela ajoute un contrôle au lieu d'en retirer un** : le cliquet ne rougit qu'à la
      HAUSSE du nombre d'erreurs. Une démonstration qui cesse de démontrer FAIT BAISSER ce nombre et
      passait donc pour une bonne nouvelle — la leçon 5 aurait affiché « OK » sous un texte qui écrit
      « -> ERREUR : violation de contrainte UNIQUE », sans que rien ne rougisse. Conformément au plan,
      ces blocs **restent comptés** dans « en erreur » et dans le cliquet ; le résumé les distingue.
      **Éprouvé par injection dans les trois modes de rupture**, et retour à vert après chacun :
      second e-mail modifié dans `lecon-05 #1` pour que le bloc n'échoue plus → **code 1**, « ABOUTIT
      alors que la page annonce “UNIQUE constraint failed: client.email” » ; message attendu dévié dans
      la déclaration → **code 1**, « échoue “table billet already exists” au lieu de “no such table” » ;
      numéro de bloc déplacé → **code 1**, « 3 rencontrés sur 4 déclarés ».
      ⚠️ **Le premier jet de ce contrôle était faux, et seule l'injection l'a montré** : le compteur
      était incrémenté AVANT le test de conformité, si bien qu'un bloc dévié comptait deux fois et
      faisait rougir l'outil sur le mauvais message (« 5 rencontrés sur 4 déclarés » au lieu de « non
      conforme »). Relire le code ne l'aurait pas trouvé.

      **Preuve par le navigateur** : `sql-lecon.js` sur `bdd` 05, 08, 09, 10, 11, 13 — **32 blocs
      cliqués, 30 résultats et 2 erreurs, qui sont exactement les deux démonstrations de la leçon 5,
      au message près**. 0 requête distante. Les accents du décor ont été corrigés dans la foulée
      (« Théâtre du Nord », « Salle Molière », « Général de Gaulle ») : ces valeurs s'affichent dans le
      résultat, ce sont donc du contenu visible.
      Cliquet descendu à **5** et éprouvé : injection → **code 1**, retrait → **code 0**, page revenue
      à l'octet près. `verif-html` 0/0 ; `verif-donnees` 25 contrôles, 0 erreur ; `verif.js --rapide`
      **40 étapes, tout vert**.

      ⚠️ **UN OUTIL DE LA CHAÎNE M'A ATTRAPÉ, ET C'EST LE FAIT MARQUANT DE CE POINT.** Mon script de
      mesure d'impact, écrit via un heredoc, contenait `\b` — que le shell a transformé en un vrai
      **caractère backspace U+0008**. Le motif cherchait donc un caractère de contrôle et ne matchait
      RIEN : il annonçait « 0 bloc concerné » alors que la réponse est 1. Un « 0 vivant » de ce genre
      est le pire des mensonges de mesure, puisqu'il autorise à écrire n'importe quel marqueur. C'est
      `verif-controles.js` (étape `caract` de la chaîne) qui l'a signalé, sur trois fichiers d'un coup
      — **exactement le défaut pour lequel il avait été écrit**. Deux suites : les brouillons corrompus
      sont supprimés, et le script de mesure porte maintenant un garde-fou qui refuse de tourner si un
      motif candidat contient un caractère de contrôle (écrit en échappements, sinon le garde-fou
      serait lui-même l'accident). À retenir : **écrire ces scripts avec l'outil d'édition, jamais par
      heredoc** — c'est la troisième fois que ce piège se paie sur ce dépôt.

- [x] **B1e · `sql-lecon.js` : les « MOTEUR KO » fantômes venaient d'une COURSE — l'outil et l'observé
      avaient EXACTEMENT le même délai.** `js/runner.js` interrompt une requête SQL après
      **10 000 ms** ; ce script attendait **40 × 250 ms = 10 000 ms**. Quand le moteur prenait tout son
      budget, l'outil abandonnait au même instant et lisait une sortie vide, qu'il rangeait en
      « MOTEUR KO ». Pire : il enchaînait aussitôt sur le bloc suivant pendant que le Worker était
      encore occupé — d'où les fantômes par grappes CONSÉCUTIVES.

      **La cause écrite dans le plan était fausse, et c'est la mesure qui l'a montré.** Le plan parlait
      des « 3 derniers blocs de la dernière page » et cherchait du côté de la mémoire ou d'un Worker
      tué. Rejoué quatre fois sur le même lot de trois leçons : une fois **4 fantômes sur la PREMIÈRE
      page** (blocs 7 à 10 de `lecon-13`), trois fois **zéro**. Ce n'est donc ni la position dans le
      lot, ni la taille du lot : c'est une course, et son verdict était **aléatoire** — un outil de
      `--complet` qui rougit au hasard, ce qui est pire qu'un outil qui se trompe toujours.

      **Correctifs.** (1) Le délai est désormais **LU dans `js/runner.js`**, jamais recopié — même
      discipline que `AUTRE_SGBD` et `TABLE_CREEE` pour `verif-sql.js` —, et l'attente vaut ce délai
      **plus 5 s de marge** : c'est au moteur de trancher, pas à l'outil. (2) Après un « sans réponse »,
      on laisse le moteur finir son propre délai avant le bloc suivant, ce qui coupe la cascade.
      (3) `Page.navigate` était suivi d'un `dodo(1500)` FIXE : remplacé par l'attente d'un ÉTAT
      (`readyState === "complete"`, puis les boutons posés par `runner.js`). C'est ce délai-là qui
      produisait l'autre symptôme, rencontré au point B1b-2 : « `pages/sql/lecon-08.html` — **0** bloc
      SQL avec bouton » là où la page seule en donne **11**, tous OK. (4) **La quatrième issue
      demandée par le plan est écrite** : « rien lu » n'est plus confondu avec « le moteur a dit qu'il
      ne pouvait pas ». Une sortie vide s'affiche « SANS RÉPONSE (défaut de mesure) », est comptée à
      part, et le bilan dit explicitement « ce verdict ne porte pas sur le site ». Même traitement pour
      une page dont les boutons n'ont pas été lus alors que sa SOURCE porte des blocs `language-sql` :
      « MESURE MANQUÉE », et non « page sans blocs ». Les deux font sortir en 1.

      ⚠️ **Un second défaut, trouvé en éprouvant le correctif et pas en le relisant.** La détection du
      « rien lu » testait le texte BRUT du panneau. Or `runner.js` pose l'en-tête « Résultat SQL » dès
      le lancement, avant toute réponse : le texte brut n'est donc **jamais** vide une fois le bloc
      lancé. La détection ne se déclenchait pas, et un bloc non lu était rangé dans « erreur SQL du
      contenu » — **imputé au SITE**, sans rien faire rougir. Elle porte maintenant sur le résumé, dont
      le nettoyage de l'en-tête a lui aussi été corrigé (`^RÉSULTAT SQL\s*` et non un espace
      obligatoire, qui ne matchait pas quand il n'y a rien derrière).

      **Éprouvé par injection, chaque garde-fou séparément, et retour à vert après chacun.** Attente de
      l'outil ramenée à zéro → **code 1**, « 10 bloc(s) SANS RÉPONSE », « MESURE INCOMPLÈTE : ce verdict
      ne porte pas sur le site » ; lecture des boutons désactivée → **code 1**, « 0 bouton POSÉ alors
      que la source porte des blocs SQL : MESURE MANQUÉE » ; délai du moteur porté à 20 s dans
      `runner.js` → l'outil annonce de lui-même « attente par bloc : **25 s**, contre 20 s au moteur »,
      preuve qu'il LIT la valeur (`runner.js` restauré à l'octet près, `git diff` vide).
      Lot de trois leçons rejoué **quatre fois** : 31 blocs, 31 résultats, 0 sans réponse à chaque fois.
      Échantillon par défaut de la chaîne : 40 blocs, 38 résultats, 2 erreurs de contenu (les deux
      démonstrations voulues de `bdd/lecon-05`), 0 requête distante, code 0.
      ⚠️ **Honnêteté sur la preuve** : le défaut étant intermittent, une série de passages verts ne
      démontre pas son absence. Ce qui la démontre, c'est la CAUSE identifiée (deux délais égaux) et le
      fait que l'outil refuse désormais de rendre un verdict vert quand il n'a rien lu.
      ⚠️ **Le piège du `| tail` s'est représenté** pendant ce point : `node … | tail` a annoncé
      « EXIT=0 » sur une injection qui sortait bel et bien en 1. C'est le code de `tail`. Il est déjà
      consigné en B1a ; il se paie une fois de plus.

- [x] **B1d · `securite` : l'unique bloc SQL du cours est du MySQL, il n'a rien à faire sous un
      bouton. Le site n'a plus AUCUNE vraie panne SQL : 4 blocs en erreur sur 260, et les 4 sont les
      démonstrations voulues de `bdd`, conformes à leur déclaration.** Le bloc écrit
      `PREPARE recherche FROM '…'` puis `EXECUTE recherche USING @nom` — la forme MySQL des requêtes
      préparées CÔTÉ SERVEUR, que SQLite n'expose que par son API C et jamais en SQL. Mesuré sur le
      moteur du dépôt avant d'écrire le marqueur : « near "PREPARE" », « near "EXECUTE" ». Le bloc
      n'illustre d'ailleurs pas une requête à exécuter mais le PRINCIPE de la séparation code/valeurs,
      juste après le même exemple en JavaScript. Impact mesuré : 1 bloc désigné, déjà en erreur,
      0 vivant. Cliquet descendu à **4**.

      ⚠️ **Le garde-fou écrit au point B1e a rendu un FAUX POSITIF dès son premier emploi réel, et
      c'est ce point qui l'a révélé.** Il criait « 0 bouton posé alors que la source porte des blocs
      SQL : MESURE MANQUÉE » — or zéro était ici la bonne réponse, le seul bloc de la page étant
      légitimement écarté. Un garde-fou qui se trompe est pire que pas de garde-fou : il apprend à
      ignorer ses propres alertes. Corrigé sans rien dupliquer : `sql-lecon.js` ne compte plus les
      blocs BRUTS mais rejoue la règle du moteur — verbe SQL présent, dialecte étranger absent — avec
      `AUTRE_SGBD` et `COMMENTAIRE_SQL` **lus dans `js/runner.js`**, comme le fait déjà `verif-sql.js`.
      Éprouvé après correction : la page `securite` rend « 0 bloc » et sort en **0** ; la lecture des
      boutons désactivée sur `sql/lecon-04` rend « 0 bouton POSÉ alors que **10** bloc(s) devraient en
      porter » et sort en **1** ; remise en état, code **0**.
      `verif.js --rapide` : 40 étapes, tout vert.

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

- [x] **B2a · L'outil manquait, et le voici : `tools/verif-js.js`. Puis les deux élargissements du
      plan — 470 blocs en panne → 339, sans qu'un seul bouton vivant soit retiré.**

      **Le point commençait par un trou d'outillage.** Le chiffre de 451 venait d'une mesure faite une
      fois, à la main, par un outil qui n'a pas été conservé : il était donc invérifiable et se
      périmait à chaque passe. `verif-js.js` est le pendant JavaScript de `verif-sql.js` — il exécute
      chaque bloc dans un contexte `vm` qui reproduit celui du Worker (`console` détourné, pas de
      `require`), et il **lit dans `js/runner.js`** les règles qui décident du bouton, jamais ne les
      recopie. Première mesure : **1 987 blocs avec bouton, 1 474 aboutis, 43 erreurs annoncées en
      commentaire, 470 EN PANNE** — les causes tombent sur celles de l'audit (85 `Cannot use import
      statement`, 34 `test is not defined`, 25 `await is only valid in async`).

      **(a-1) `import` / `export` en tête de ligne : 124 blocs, ZÉRO vivant (470 → 356).** Un module
      ES ne s'évalue pas dans le Worker. Le motif exige le début d'une ligne, pour qu'un `import`
      cité au milieu d'une phrase de commentaire ne retire aucun bouton. Aboutis inchangés à 1 474.

      **(a-2) Un fichier de données n'est pas un programme : 8 blocs, ZÉRO vivant (356 → 347).**
      ⚠️ **Le critère écrit dans le plan était trop large, et la mesure l'a montré avant qu'il ne casse
      quoi que ce soit.** « `data-file` en `.json` » désigne 8 blocs — dont **3 VIVANTS** :
      `pages/formats/lecon-02.html` et `pages/nosql/lecon-12.html` sont de vrais programmes qui
      MANIPULENT du JSON (`JSON.parse`, puis `console.log` — mesuré, ils affichent 2, 1 et 1 lignes),
      et dont le `data-file` porte un nom en `.json` par simple convenance d'affichage. Le critère
      retenu ne peut pas se tromper : **le bloc parse entièrement en JSON**. Il attrape en prime les
      quatre `package.json` de `nodejs/lecon-03` que `data-file` ratait, puisqu'ils sont annoncés
      « Terminal ». Le test du premier caractère écarte les scalaires (`JSON.parse("42")` réussit, et
      un bloc réduit à un nombre reste un programme).

      ⚠️ **L'OUTIL EST NÉ AVEC LE DÉFAUT QU'IL VENAIT DE CORRIGER AILLEURS.** Deux relevés du même
      dépôt ont rendu 470 puis 469 : un dépassement de délai était compté comme une panne, et le
      `timeout` de `vm` dépend de la charge de la machine. Un cliquet posé là-dessus aurait rougi au
      hasard — exactement le défaut de `sql-lecon.js` traité au point B1e, réintroduit le même jour
      dans un outil neuf. Corrigé : délai porté à 5 s, et les dépassements comptés **à part**, hors
      cliquet, sous l'étiquette « non concluants ». Deux relevés consécutifs rendent maintenant des
      chiffres identiques. Ce sont 2 blocs, des démonstrations lentes à dessein (hachage répété,
      boucle de blocage).

      **Mesure finale : 1 855 blocs avec bouton, 1 481 aboutis (79,5 %), 33 erreurs annoncées,
      2 non concluants, 339 EN PANNE.** Le nombre d'aboutis n'a jamais baissé à aucune étape.

      **Preuve par le navigateur** (le vérificateur n'exécute pas `runner.js` : seul un vrai Chrome
      dit ce que l'apprenant voit), `file://`, DNS coupé : `nodejs/lecon-03` — **5 blocs écartés, 1
      bouton restant**, ce qui est exactement le « 5 sur 6 sont des `package.json` » du plan ;
      `js/lecon-26` — 16 modules ES écartés, 1 bouton ; et surtout **`formats/lecon-02` garde ses 2
      boutons**, ce qui prouve sur pièce que le critère resserré était le bon. 0 bloc fautif encore
      cliquable, 0 requête distante.

      **Cliquet posé à 339 et éprouvé** : `const x = ;` injecté dans `algo/lecon-01` → **code 1**,
      « 340 contre 339 à la référence » ; faute retirée → **code 0**, page revenue à l'octet près.
      L'outil est déclaré dans `verif.js` — le contrôle `gardech` l'a d'ailleurs signalé « hors chaîne »
      avant que ce soit fait, ce qui est son travail.
      ⚠️ **Le drapeau `lent` n'exclut de RIEN** : il n'affiche qu'un mot de patience, seule la liste
      `HORS_RAPIDE` écarte du mode rapide. Un premier jet portait donc un commentaire « mode complet
      seulement » parfaitement faux, et le mode rapide passait de 130 s à **205 s (+58 %)**. Mesure
      faite, `verif-js.js` (71,9 s) rejoint `HORS_RAPIDE` avec les bacs à sable Git, pour la même
      raison chiffrée ; il reste joué par le mode par défaut, `--complet` et `--strict`. Rapide
      remesuré : **134,4 s, 40 étapes, tout vert**.

- [ ] **B2b · Les 339 blocs JavaScript encore en panne.** C'est la partie (b) du plan : rendre
      autonomes, ou débrancher, les fragments qui dépendent d'un bloc précédent. Le gisement est
      désormais MESURABLE à tout moment (`node tools/verif-js.js --causes`) et le cliquet interdit
      qu'il grossisse. Par cours : `js` 103, `tests` 46, `projets-js` 34, `html` 29, `algo` 28,
      `nodejs` 26, `securite` 17, `patterns` 13, `vue` 11, `nosql` 10. Causes principales :
      **34 `test is not defined`** (des suites de tests écrites pour `node --test` — probablement à
      écarter en bloc, comme les modules ES, mais à mesurer), **24 `await is only valid in async`**
      (fragments à envelopper dans une fonction, ou à débrancher), **16 `app is not defined`** et
      **12 `db is not defined`** (fragments Express/base qui dépendent d'un bloc précédent),
      **9 `HTMLElement is not defined`** (du DOM que `BROWSER_ONLY` ne nomme pas encore).
      Une case par lot de cours ; commencer par `test is not defined`, le plus homogène.

- [x] **B2b-1 · Les suites de tests : 36 blocs écartés, ZÉRO vivant retiré — 339 blocs en panne → 303.**

      **Mesure reproduite avant de toucher à quoi que ce soit** (`node tools/verif-js.js --causes`) :
      1 855 blocs avec bouton, 534 écartés, **1 481 aboutis, 33 erreurs annoncées, 2 non concluants,
      339 EN PANNE** — identique au chiffre laissé par B2a, donc le gisement n'avait pas bougé. Première
      cause : **34 `ReferenceError: test is not defined`**. Ce sont des suites écrites pour un LANCEUR
      (`node --test`, Jest, Vitest, Mocha) : `test`, `describe`, `it`, `beforeEach` ne sont pas des noms
      de JavaScript, c'est le lanceur qui les injecte. Dans le Worker il n'y a pas de lanceur, donc le
      bouton « Tester » ne pouvait rien promettre d'autre qu'une erreur.

      **Le critère a été MESURÉ avant d'être écrit, en EXÉCUTANT chaque bloc qu'il désigne** — c'est la
      leçon de B2a, où le critère du plan (« `data-file` en `.json` ») aurait retiré trois boutons qui
      marchaient. Critère retenu : un DÉBUT D'INSTRUCTION (début de ligne, indentation permise) suivi de
      `test|describe|it|beforeEach|afterEach|beforeAll|afterAll` puis d'un LIBELLÉ entre guillemets. Il ne
      peut donc pas attraper `test` cité dans une phrase de commentaire, ni une méthode `obj.test(x)`, ni
      un appel `test(valeur)` sans libellé. **Impact : 36 blocs visés, 36 déjà en panne, ZÉRO VIVANT** —
      2 de plus que les 34 du plan, les deux autres échouant sur `describe`/`it` plutôt que sur `test`.
      Une **garde** interdit d'écarter un bloc qui définit lui-même son harnais (`function test(…)`,
      `const it = …`) : mesurée, elle ne change rien aujourd'hui (36 visés dans les deux cas), elle
      protège l'avenir contre un programme autonome qui nommerait sa fonction `test`.

      ⚠️ **UN CRITÈRE VOISIN A ÉTÉ MESURÉ PUIS REFUSÉ DANS LA MÊME PASSE.** Le plan annonce aussi
      « 9 `HTMLElement is not defined` — du DOM que `BROWSER_ONLY` ne nomme pas encore ». Le critère
      naturel (`HTMLElement|customElements|CustomEvent|Element|Node|DOMParser|FormData|Intersection…`)
      vise **37 blocs dont 11 VIVANTS** : il aurait retiré onze boutons qui marchent, dont
      `pages/neurones/lecon-12` (59 lignes de sortie), `pages/maths/lecon-12` (51 lignes) et
      `pages/crypto/lecon-01` (14 lignes) — les mots `Element` et `Node` sont des noms de variables
      ordinaires. Resserré aux seuls identifiants qui n'existent que dans une page, il vise encore
      22 blocs **dont 4 vivants**. Il reste donc à faire, avec un critère plus fin : c'est une case à
      part, pas un ajout à celle-ci.

      **Écriture.** `estUneSuiteDeTests(texte)` dans `js/runner.js`, à côté de `estUnFichierJson`, et
      branchée dans la même condition que `BROWSER_ONLY`. Côté outil, `tools/verif-js.js` la **LIT dans
      `runner.js`** au lieu de la recopier — le lecteur ad hoc d'`estUnFichierJson` est devenu une
      fonction `lireFonction(nom)`, pour que la prochaine règle n'ait pas à dupliquer ce code.

      **Mesure finale : 1 819 blocs avec bouton, 570 écartés (+36), 1 481 aboutis (81,4 %), 33 annoncées,
      2 non concluants, 303 EN PANNE.** Le nombre d'aboutis est **inchangé à l'unité près** : 1 481 avant,
      1 481 après. Cliquet descendu à 303 (`--fixer`), `verif-js.js` sort en **0**.

      **Preuve par le navigateur** (le vérificateur n'exécute pas `runner.js` : seul un vrai Chrome dit ce
      que l'apprenant voit), `file://`, comptage de `data-runner` dans le DOM rendu, sur 7 pages — les 4
      touchées et **3 témoins**. Règle neutralisée puis remise, le fichier restauré à l'octet près
      (md5 vérifié) :

      | page | avant | après |
      |---|---|---|
      | `tests/lecon-02` | 6 boutons | **2** |
      | `tests/lecon-04` | 5 boutons | **2** |
      | `tests/lecon-07` | 7 boutons | **5** |
      | `api/lecon-13` | 2 boutons | **0** |
      | `formats/lecon-02` (témoin B2a) | 2 boutons | **2** |
      | `js/lecon-01` (témoin) | 9 boutons | **9** |
      | `algo/lecon-01` (témoin) | 9 boutons | **9** |

      **40 boutons → 29 : 11 boutons morts retirés, et pas un seul témoin entamé.** 0 URL distante dans
      le DOM rendu.

      **Non-régression** : `verif-html.js` 1 629 fichiers, **0 grave / 0 attention** ; `verif-donnees.js`
      25 contrôles, **0 erreur** ; `verif.js --rapide` **40 étapes, tout vert, 136,8 s** ;
      `node --check` sur `js/runner.js` et `tools/verif-js.js`. Aucune URL vers un CDN dans les deux
      fichiers touchés (grep = 0).

      **Reste au gisement : 303.** Les causes de tête sont maintenant 24 `await is only valid in async`,
      16 `app is not defined`, 15 `Unexpected token`, 12 `db is not defined`, 9 `HTMLElement is not
      defined`. Par cours : `js` 102, `projets-js` 34, `html` 29, `algo` 28, `nodejs` 26, `securite` 17,
      `patterns` 13, `tests` 12, `vue` 11, `nosql` 10.

- [x] **B2b-2 · Le vérificateur mesurait un Worker APPAUVRI : 16 blocs déclarés en panne à tort, 9 sont
      vivants pour de bon. 303 → 294, et les aboutis MONTENT de 1 481 à 1 490.**

      **Ce point n'a pas retiré un bouton : il a réparé l'instrument.** En attaquant le lot suivant
      (`await is only valid in async`), les causes se sont mises à ressembler à une liste de globales de
      navigateur : `TextEncoder is not defined`, `performance is not defined`,
      `EventTarget is not defined`. Or ce sont des noms qu'un vrai Web Worker POSSÈDE. Le contexte `vm`
      de `verif-js.js` avait été écrit au minimum — console, minuteries, `self` — donc il déclarait en
      panne des blocs qui marchent chez l'apprenant. **L'outil ne mesurait pas le site, il mesurait sa
      propre pauvreté**, et le lot suivant aurait consisté à retirer des boutons VIVANTS sur cette foi.
      Comptage : **16 blocs** échouaient sur un `X is not defined` où X est une globale standard d'un
      Worker (TextEncoder 4, performance 3, EventTarget 3, PerformanceObserver 2, FormData,
      ReadableStream, URL, WebSocket 1 chacun).

      **LA LISTE A ÉTÉ MESURÉE DANS UN VRAI CHROME, PAS DEVINÉE.** Une page ouverte en `file://`, DNS
      coupé, crée un Worker par la mécanique exacte de `runner.js` (Blob → `new Worker`) et lui demande,
      pour 30 noms, s'il les possède, puis exécute 13 essais qui vérifient qu'ils FONCTIONNENT (et pas
      seulement que le nom existe). **30 présents sur 30, 13 essais « MARCHE » sur 13** — y compris
      `crypto.subtle`, Chrome tenant `file://` pour un contexte sécurisé. 0 requête distante pendant la
      mesure. C'était la seule façon de trancher : supposer que « `crypto.subtle` exige HTTPS » aurait
      fait écarter à tort tout le cours de cryptographie.

      ⚠️ **CE QUI EST DÉLIBÉRÉMENT RESTÉ DEHORS, et c'est là que le point se joue.** `fetch`,
      `WebSocket`, `XMLHttpRequest`, `indexedDB` et `caches` sont **présents eux aussi** dans ce Worker
      — la mesure le dit. Les ajouter aurait fait ABOUTIR ici des blocs qui échouent chez l'apprenant,
      puisque le site n'a ni serveur ni réseau : l'inverse exact du but. Un vérificateur trop généreux
      est plus dangereux qu'un vérificateur absent, parce qu'il rend un vert. Ils restent donc hors du
      contexte, et un bloc qui les appelle continue d'être compté en panne (il en reste 1, sur
      `WebSocket`).

      **Mesure : 1 819 blocs avec bouton, 1 490 aboutis (81,9 %, contre 1 481), 33 annoncées,
      2 non concluants, 294 EN PANNE** (contre 303). Comparaison ligne à ligne des deux relevés :
      **9 blocs gagnés, 0 PERDU** — aucun bloc n'est passé d'abouti à panne. Cliquet descendu à 294.

      **Preuve par le navigateur, sur les 9 blocs concernés, un par un.** Chrome, `file://`, DNS coupé :
      la page est ouverte, les `<details>` dépliés, le bouton « Tester » CLIQUÉ, et le panneau console
      relu. **9 cliqués, 9 sans la moindre ligne d'erreur, 0 requête distante** :

      | bloc | ce que l'apprenant voit |
      |---|---|
      | `js/lecon-34` #6 | `true` |
      | `js/lecon-55` #5 et #6 | `99,97,102,195,169` (3 lignes) |
      | `js/lecon-55` #11 | `3` (3 lignes) |
      | `js/lecon-57` #7 | `2, 1, 0` |
      | `js/lecon-58` #6 | `parse-json: 0.00 ms` |
      | `js/lecon-58` #9 | `for: 0.522 ms/appel (sink=0)` (2 lignes) |
      | `js/lecon-62` #4, `js/lecon-64` #6 | s'exécutent sans erreur, sans `console.log` |

      **Une piste MESURÉE puis écartée, pour que la passe suivante n'ait pas à la refaire.** Le lot
      `await` peut se traiter côté MOTEUR : détecter par compilation (`new Function`) qu'un bloc ne
      refuse que pour cause d'`await` hors fonction async, et l'enrober dans une IIFE `async` — une
      détection sans faux positif possible, puisque c'est JavaScript lui-même qui tranche. Mesuré sur
      le site : **33 blocs touchés, 0 aujourd'hui vivant (donc aucun risque), mais 3 seulement
      deviennent vivants.** Les 30 autres échouent ensuite sur `fetch`, `ReadableStream`,
      `prisma`, `req`, `db` — le `await` n'était pas leur maladie, seulement leur premier symptôme.
      Trois blocs ne valent pas de rendre le vérificateur asynchrone : la piste est notée, pas prise.

      **Non-régression** : `node --check tools/verif-js.js` ; `verif.js --rapide` **40 étapes, tout
      vert, 137,7 s**. Aucun fichier de contenu touché — ce point ne modifie que l'outil.

- [x] **B2b-3 · Les fragments de serveur : 38 blocs écartés, ZÉRO vivant retiré — 294 → 257. Et la
      dette d'outillage que ce point a dû solder d'abord : `verif-clic.js` réclamait encore 82 boutons
      qui ne viendraient jamais.**

      **Mesure reproduite avant de toucher à quoi que ce soit** (`node tools/verif-js.js --causes`) :
      1 819 blocs avec bouton, 570 écartés, **1 490 aboutis, 33 annoncées, 2 non concluants,
      294 EN PANNE** — identique au chiffre laissé par B2b-2, le gisement n'avait pas bougé. Causes de
      tête, exactement celles annoncées par le plan : **17 `app is not defined`, 13 `db is not
      defined`**. Ce sont des fragments d'Express (`app.get(…)`), de MongoDB (`db.produits.find(…)`),
      du module `http` de Node (`res.setHeader(…)`) et de Vue Router (`router.beforeEach(…)`) : leur
      objet est fabriqué par un bloc PRÉCÉDENT de la leçon, et surtout il suppose un serveur et une
      base que le site n'a pas. Le bouton ne pouvait promettre qu'une erreur.

      ⚠️ **LA CONTRAINTE DE COLONNE ZÉRO N'EST PAS UN GOÛT D'ÉCRITURE, C'EST LA MESURE QUI L'A
      IMPOSÉE — et sans elle ce point retirait des boutons vivants.** Trois variantes du critère ont
      été essayées en EXÉCUTANT chaque bloc désigné :

      | critère | visés | dont VIVANTS |
      |---|---|---|
      | indentation permise (`[ \t]*`) | 40 | **2** |
      | colonne zéro, avec `req` | 38 | 0 |
      | **colonne zéro, sans `req`** (retenu) | **38** | **0** |

      Les deux vivants de la première variante sont `pages/nodejs/lecon-18.html` #11 et #14 : ils
      DÉFINISSENT une fonction dont `req` et `res` sont les PARAMÈTRES — le bloc ne les appelle pas, il
      s'exécute très bien. Une utilisation en colonne zéro est forcément au niveau racine du bloc, donc
      jamais un paramètre. Ajouter `req` à la liste rend exactement les mêmes 38 blocs : on garde donc
      la liste la plus courte, `app|db|res|router|prisma|mongoose`. Une **garde** épargne le bloc qui
      déclare lui-même son objet (`const app = …`, `function db(…)`, ou la simple affectation
      `app = express()`).

      **Les 38 visés étaient TOUS déjà en panne : 37 comptés KO, plus un 38ᵉ que l'outil rangeait à
      tort parmi les erreurs « annoncées ».** `pages/nodejs/lecon-12.html` #5 échoue bel et bien sur
      `app is not defined`, mais son commentaire `// saute au middleware d'erreur` contient le mot
      *erreur* : le motif `ERREUR_ANNONCEE` y voyait une erreur voulue par la leçon. D'où le
      déplacement des annoncées de 33 à 32.

      **Écriture.** `estUnFragmentServeur(texte)` dans `js/runner.js`, à côté de `estUneSuiteDeTests`,
      branchée dans la même condition ; `tools/verif-js.js` la **LIT** par `lireFonction`, jamais ne la
      recopie.

      ⚠️ **UNE DETTE D'OUTILLAGE A DÛ ÊTRE SOLDÉE AVANT, SINON CE POINT FAISAIT ROUGIR UN AUTRE
      VÉRIFICATEUR À TORT.** `tools/verif-clic.js` calcule sur le disque combien de boutons il ATTEND,
      et il ne lisait que `BROWSER_ONLY` — la seule règle qui existait quand il a été écrit. Depuis
      B2a et B2b-1, `runner.js` en applique trois autres, qui sont des FONCTIONS : `estUnFichierJson`
      (8 blocs), `estUneSuiteDeTests` (36), et maintenant `estUnFragmentServeur` (38). **82 blocs au
      total** que `verif-clic` aurait réclamés sans jamais les obtenir, c'est-à-dire un « MESURE
      INCOMPLÈTE » perpétuel — le genre d'alerte qui apprend à ignorer les alertes, exactement le
      défaut fermé au point B1e. Il lit désormais les quatre règles.

      **Mesure finale : 1 781 blocs avec bouton, 608 écartés (+38), 1 490 aboutis (83,7 %, contre
      81,9 %), 32 annoncées, 2 non concluants, 257 EN PANNE.** Le nombre d'aboutis est **inchangé à
      l'unité près** : 1 490 avant, 1 490 après. Cliquet descendu à 257 (`--fixer`).

      **Preuve par le navigateur** (le vérificateur n'exécute pas `runner.js` : seul un vrai Chrome dit
      ce que l'apprenant voit), par `verif-clic.js` — l'outil du projet qui CLIQUE — sur 7 pages, les 4
      touchées et **3 témoins**, règle active puis neutralisée, le fichier restauré ensuite à l'octet
      près (md5 `123bf037…` identique avant et après) :

      | | boutons posés dans le DOM rendu |
      |---|---|
      | règle neutralisée | **32** cliqués sur 32 attendus |
      | règle active | **23** cliqués sur 23 attendus |

      **9 boutons de moins**, et ce sont exactement les 9 blocs que la règle désigne sur ces pages
      (`nodejs/lecon-11` #2 #3, `nosql/lecon-07` #1 #2, `securite/lecon-06` #1 #2 #4, `vue/lecon-10`
      #7 #10) : l'écart tombe à l'unité près sur la prévision, donc **aucun témoin n'est entamé**.
      Couverture complète dans les deux relevés, 0 divergence entre ce que la page imprime et ce que le
      clic rend.

      **Non-régression** : `verif-html.js` 1 629 fichiers, **0 grave / 0 attention** ;
      `verif-donnees.js` 25 contrôles, **0 erreur** ; `verif.js --rapide` **40 étapes, tout vert,
      137,0 s** ; `node --check` sur `js/runner.js`, `tools/verif-js.js` et `tools/verif-clic.js` ;
      0 URL vers un CDN dans les trois fichiers touchés. Aucun fichier de contenu modifié : ce point ne
      touche qu'une règle du moteur et deux vérificateurs.

      **Reste au gisement : 257.** Les causes de tête sont maintenant 24 `await is only valid in
      async`, 15 `Unexpected token`, 10 `HTMLElement is not defined`, 8 `etatInitial is not defined`,
      8 `bouton is not defined`. Par cours : `js` 92, `projets-js` 34, `html` 29, `algo` 28,
      `patterns` 13, `nodejs` 12, `tests` 12, `securite` 9, `vue` 9. Le reste est très majoritairement
      du FRAGMENT INTERNE (un bloc qui poursuit le précédent de la même leçon : `Tache`, `UnionFind`,
      `etatInitial`) — celui-là ne se débranche pas par une règle, il se répare leçon par leçon, ou
      alors il faut décider que le moteur exécute un bloc dans le contexte cumulé de la leçon, ce qui
      est un vrai chantier à part.

- [x] **B2b-4 · Le lot DOM, refusé faute de critère sûr en B2b-1, rouvert par une SONDE : 13 blocs
      écartés, 0 vivant. Et la même sonde a repris l'instrument en défaut — 2 blocs déclarés en panne
      à tort. 257 → 242, aboutis 1 490 → 1 492.**

      **Ce point ne s'est pas décidé par une meilleure idée, mais par une mesure.** B2b-1 avait
      MESURÉ puis REFUSÉ ce lot : le critère naturel de l'époque (`HTMLElement|Element|Node|FormData…`)
      visait 37 blocs **dont 11 VIVANTS**, parce qu'`Element` et `Node` sont des noms de variables
      ordinaires. Ce qui manquait pour trancher, c'était de savoir ce qu'un vrai Worker POSSÈDE. Une
      sonde a donc été refaite sur le modèle de B2b-2 : page `file://`, DNS coupé, Worker créé par la
      mécanique exacte de `runner.js` (Blob → `new Worker`), interrogé sur **30 noms du DOM** puis
      soumis à **7 essais d'exécution**.

      **Résultat : `HTMLElement`, `customElements`, `document`, `window`, `Element`, `Node`,
      `DOMParser`, `MutationObserver`, `IntersectionObserver`, `ResizeObserver`, `getComputedStyle`,
      `matchMedia`, `ShadowRoot`, `Image`, `Audio`, `Range`, `Selection` — TOUS ABSENTS**
      (`class X extends HTMLElement {}` → « HTMLElement is not defined » ; `new DOMParser()` →
      « DOMParser is not defined »). Un bloc qui les emploie ne pourra jamais rien rendre à
      l'apprenant. La règle `estDuDomDePage` ne retient donc que des noms sans autre sens en
      JavaScript — ni `Element` ni `Node`, justement — plus le motif `extends HTML*Element`.
      Impact mesuré en EXÉCUTANT chaque bloc désigné : **13 visés, 13 déjà en panne, ZÉRO vivant**
      (`html/lecon-24` ×4, `lecon-30` ×4, `lecon-31`, `lecon-40` ×2, `lecon-46`, `lecon-47`).

      ⚠️ **LA MÊME SONDE A TROUVÉ L'INSTRUMENT ENCORE EN DÉFAUT — B2b-2 n'avait pas tout vu.** Quatre
      noms sont **PRÉSENTS** dans le Worker et manquaient au contexte `vm` : `CustomEvent`,
      `requestAnimationFrame`, `cancelAnimationFrame`, `trustedTypes`. **Seul `CustomEvent` a été
      ajouté**, et c'est encore la mesure qui l'a décidé, pas la prudence : Node le fournit
      nativement, donc c'est le VRAI objet, tandis que les trois autres devraient être FABRIQUÉS,
      c'est-à-dire inventés — et aucun des 3 blocs concernés n'en deviendrait vivant
      (`html/lecon-44` #5 et #9 échouent ensuite sur `ctx` et `canvas`, `js/lecon-59` #4 sur
      `DOMPurify`). Inventer une API pour ne rien gagner, c'est prendre le risque de B2b-2 à l'envers.

      **Preuve directe que les 2 blocs gagnés sont VRAIMENT vivants**, en les exécutant dans un vrai
      Worker de Chrome (`file://`, DNS coupé, console détournée comme `runner.js`) :

      | bloc | ce que l'apprenant voit |
      |---|---|
      | `js/lecon-49` #6 | `42` |
      | `js/lecon-64` #1 | `Ajouté : {"id":7,"nom":"Clavier"}` |

      **Mesure finale : 1 768 blocs avec bouton, 621 écartés (+13), 1 492 aboutis (84,4 %, contre
      1 490), 32 annoncées, 2 non concluants, 242 EN PANNE.** Le nombre d'aboutis **MONTE** de 2 et
      n'a baissé à aucune étape. Cliquet descendu à 242.

      **Preuve par le navigateur** (`verif-clic.js`, 6 pages : 3 touchées et **3 témoins**, dont
      `js/lecon-49` qui doit GARDER son bouton), règle active puis neutralisée, `js/runner.js`
      restauré à l'octet près (md5 `f723968c…` identique) :

      | | boutons posés dans le DOM rendu |
      |---|---|
      | règle neutralisée | **30** cliqués sur 30 attendus |
      | règle active | **20** cliqués sur 20 attendus |

      **10 boutons de moins**, exactement les 10 blocs que la règle désigne sur ces pages
      (`html/lecon-24` ×4, `html/lecon-30` ×4, `html/lecon-40` ×2) : les 3 témoins sont intacts, et
      couverture complète des deux côtés, 0 divergence.

      **Non-régression** : `verif-html.js` 1 629 fichiers, **0 grave / 0 attention** ;
      `verif-donnees.js` 25 contrôles, **0 erreur** ; `verif.js --rapide` **40 étapes, tout vert, 137,4 s** ;
      `node --check` sur les trois fichiers touchés ; 0 URL vers un CDN. `verif-clic.js` lit désormais
      les cinq règles du bouton (dette ouverte en B2b-3 : une règle ajoutée au moteur doit être
      ajoutée aux DEUX vérificateurs qui la lisent).

      **Reste au gisement : 242**, et le lot suivant n'est plus un lot : c'est du FRAGMENT INTERNE
      (`Tache` 5, `etatInitial` 8, `bouton` 8, `UnionFind` 4 — un bloc qui poursuit le précédent de sa
      leçon), plus 24 `await` de tête et 15 erreurs de syntaxe. Aucune règle générale ne les couvre :
      soit réparation leçon par leçon, soit décider que le moteur exécute un bloc dans le contexte
      cumulé de sa leçon — un vrai chantier, à ouvrir comme tel.

- [x] **B2b-5 · Le critère qui ne peut pas se tromper, parce que c'est JavaScript qui tranche :
      81 blocs écartés, ZÉRO vivant — 242 blocs en panne → 171, et les aboutis ne bougent pas d'une
      unité. Avec le second cliquet sans lequel ce point aurait rendu la faute la plus banale
      INVISIBLE.**

      **Mesure reproduite avant de toucher à quoi que ce soit** (`node tools/verif-js.js --causes`) :
      1 768 blocs avec bouton, 621 écartés, **1 492 aboutis, 32 annoncées, 2 non concluants,
      242 EN PANNE** — identique au chiffre laissé par B2b-4, le gisement n'avait pas bougé.

      **Le plan disait que le lot suivant n'était plus un lot.** B2b-4 concluait : « du fragment
      interne, plus 24 `await` de tête et 15 erreurs de syntaxe ; aucune règle générale ne les
      couvre ». C'était vrai des règles écrites jusque-là, qui décrivent toutes **ce que le Worker
      n'a pas** — un document, un serveur, un lanceur de tests — et qui doivent donc énumérer des
      noms, avec le risque de faux positif que B2b-1 a payé comptant (`Element` et `Node` sont des
      noms de variables ordinaires). La règle de ce point ne décrit rien : **elle demande à
      JavaScript.** `new Function(texte)` compile le bloc sans en exécuter une ligne ; s'il lève une
      `SyntaxError`, aucun contexte d'exécution au monde ne fera parler ce bloc.

      Ce sont des corps d'objet détachés (`{ path: '/produit/:id', component: Produit }`), des `case`
      sans `switch`, des schémas ASCII étiquetés `language-javascript` (l'arbre de `algo/lecon-02`,
      le déroulé de la factorielle), des lignes de terminal (`npm create vue@latest`), et surtout
      **du `await` au niveau racine** — légal dans un module, jamais dans le script classique que
      reçoit le Worker.

      ⚠️ **LE POINT SE JOUE SUR UNE DIVERGENCE POSSIBLE ENTRE DEUX JUGES, ET ELLE A ÉTÉ MESURÉE, PAS
      RAISONNÉE.** Le Worker exécute `(0, eval)(code)`, pas `new Function(code)` : un bloc que
      `new Function` refuserait alors qu'`eval` l'accepte serait un **bouton vivant retiré**. On ne
      peut pas demander à `eval` de compiler sans exécuter ; on lui a donc donné le texte précédé
      d'un `throw` — la `SyntaxError`, s'il y en a une, est levée à la compilation du script entier,
      donc AVANT le `throw`, tandis qu'un texte valide part sur le `throw` sans rien exécuter du
      bloc (le préfixe reprend la directive `"use strict"` quand le bloc en porte une, pour ne pas
      la déclasser). **Les 1 768 blocs à bouton du site** ont été soumis aux deux juges **dans un
      vrai Worker de Chrome** (`file://`, DNS coupé, Blob → Worker par la mécanique exacte de
      `runner.js`) :

      | | blocs |
      |---|---|
      | les deux refusent | **81** |
      | les deux acceptent | **1 684** |
      | **`new Function` refuse, `eval` accepte** (le seul cas dangereux) | **0** |
      | `eval` refuse, `new Function` accepte (`return` racine) | 3 |

      Les 3 derniers sont un gain non pris, jamais un risque : `nodejs/lecon-22` #6,
      `securite/lecon-01` #3, `cicd/lecon-10` #2, tous trois `Illegal return statement`. Aucun écart
      entre le verdict de Node et celui de Chrome sur `new Function`.

      **Impact mesuré AVANT écriture, en EXÉCUTANT chaque bloc désigné : 81 visés, ZERO VIVANT**,
      71 déjà comptés en panne, et **10 que le vérificateur classait « erreur annoncée » à tort** —
      leur commentaire contient le mot « erreur », mais aucune de ces leçons n'enseigne une faute de
      syntaxe : `pages/js/lecon-48.html` #8 finit sur
      `console.log(await collecter()); // ["a","b","c","d","e"]`, une sortie **promise** que le
      bouton ne rendra jamais. Leur bouton mentait deux fois.

      **Écriture.** `neCompilePas(texte)` dans `js/runner.js`, dans la même condition que les quatre
      autres règles ; `tools/verif-js.js` et `tools/verif-clic.js` la **LISENT** par leur lecteur de
      fonctions, jamais ne la recopient (les deux vérificateurs mis à jour dans la même passe,
      dette ouverte en B2b-3).

      ⚠️ **CE POINT CRÉAIT UN ANGLE MORT, ET C'EST LÀ QUE SE JOUE SA VALEUR.** À partir du moment où
      un bloc qui ne compile pas perd son bouton, **une faute de syntaxe introduite par erreur dans
      une leçon disparaît en silence** au lieu d'être comptée en panne : le cliquet des pannes
      devenait aveugle à la faute la plus banale du site — exactement le défaut que ce chantier
      ferme (« un contrôle qui ne peut pas échouer occupe la place »). Les blocs non compilables ont
      donc **leur propre cliquet** dans `verif-js.js`, qui ne doit pas monter non plus, et le mode
      `--causes` les nomme un par un.

      **Les deux cliquets éprouvés par injection**, `const x = ;` en tête du premier bloc de
      `pages/algo/lecon-01.html` :

      | | avec la faute | sans |
      |---|---|---|
      | EN PANNE (premier cliquet) | **171** — inchangé, donc **vert** | 171 |
      | NE COMPILENT PAS (second) | **82 contre 81** → **code 1** | 81 → code **0** |

      C'est la démonstration chiffrée que le second cliquet n'est pas un ornement : sans lui, la
      faute passait sans un mot. Page restaurée, md5 `269ad551…` identique avant et après.

      **Mesure finale : 1 687 blocs avec bouton, 702 écartés (+81), 1 492 aboutis (88,4 %, contre
      84,4 %), 22 annoncées (−10), 2 non concluants, 171 EN PANNE.** Le nombre d'aboutis est
      **rigoureusement inchangé** : 1 492 avant, 1 492 après. Cliquets fixés à 171 et 81.

      **Preuve par le navigateur** (le vérificateur n'exécute pas `runner.js` : seul un vrai Chrome
      dit ce que l'apprenant voit), par `verif-clic.js` — l'outil du projet qui CLIQUE — sur
      7 pages, 4 touchées et **3 témoins**, règle active puis neutralisée, `js/runner.js` restauré
      ensuite à l'octet près (md5 `16a65243…` identique avant et après) :

      | | boutons posés dans le DOM rendu |
      |---|---|
      | règle neutralisée | **47** cliqués sur 47 attendus |
      | règle active | **30** cliqués sur 30 attendus |

      **17 boutons morts retirés**, et le compte tombe à l'unité près sur la prévision faite depuis
      le disque page par page (`js/lecon-48` 1, `algo/lecon-12` 4, `js/lecon-54` 4, `vue/lecon-10` 1,
      plus les témoins `js/lecon-01` 9, `algo/lecon-01` 9, `formats/lecon-02` 2 = 30). **Les
      3 témoins gardent leurs 20 boutons**, couverture complète des deux côtés, 0 divergence entre
      ce que la page imprime et ce que le clic rend. Cette mesure prouve en prime que `new Function`
      s'exécute bien dans la page en `file://` — aucune CSP ne le bride.

      **Non-régression** : `verif-html.js` 1 629 fichiers, **0 grave / 0 attention** ;
      `verif-donnees.js` 25 contrôles, **0 erreur** ; `verif.js --rapide` **40 étapes, tout vert,
      145,0 s** ; `node --check` sur les trois fichiers touchés ; 0 URL vers un CDN. Aucun fichier de
      contenu modifié : ce point ne touche qu'une règle du moteur et deux vérificateurs.

      **Reste au gisement : 171.** Par cours : `js` 55, `projets-js` 33, `algo` 18, `html` 14,
      `tests` 12, `patterns` 10, `securite` 7, `nodejs` 5, `vue` 4. Causes de tête : 7 `bouton`,
      7 `etatInitial`, 6 `self.addEventListener is not a function` (les service workers de
      `html/lecon-42`, un lot homogène à prendre), **6 `test is not defined`** (des suites que
      `estUneSuiteDeTests` ne voit pas, faute de libellé entre guillemets — son critère est à
      élargir avec la même prudence qu'en B2b-1), 5 `Tache`, 5 `user`, 4 `ctx`, 4 `UnionFind`.

      **Une piste MESURÉE puis laissée à une case à part, pour que la passe suivante n'ait pas à la
      refaire.** L'inspection de départ a trouvé un second défaut, distinct de celui-ci :
      **des blocs dont le `data-file` annonce un langage que le bloc n'est pas.** Deux familles,
      toutes deux visibles par l'apprenant. Les blocs qui ne sont pas du JavaScript portent
      `class="language-javascript"`, donc Prism les colorise à tort (`algo/lecon-02` #2 #3 #7,
      `algo/lecon-10` #2, `js/lecon-30` #3, `react/lecon-14` #1 #2, `vue/lecon-06` #3,
      `vue/lecon-13` #1 — à passer en `plaintext` ou `bash`, avec le composant Prism correspondant,
      que `verif-donnees.js` I14 vérifie déjà). Et symétriquement, **du vrai JavaScript est annoncé
      sous un nom de fichier mensonger** : `cicd/lecon-10` #1 affiche
      « .github/workflows/deploy.yml » au-dessus de JavaScript, `perf-web/lecon-11` #3 dit
      « anim.css », `typescript/lecon-19` #1 dit « tsconfig.json », `wasm/lecon-05` #1 dit
      « decision.txt », `algo/lecon-17` #4 dit « schema.txt ». Cette seconde famille ne touche pas au
      gisement (ces blocs gardent leur bouton à juste titre) et **elle est probablement bien plus
      large que ces cinq cas**, puisqu'on ne l'a vue que par la fenêtre des blocs en panne : la
      recenser demande un balayage des 2 418 blocs `language-javascript`, c'est-à-dire une case à
      elle seule.

- [x] **B2b-6 · Les deux derniers lots homogènes : suites de tests PARAMÉTRÉES et SERVICE WORKERS —
      12 blocs écartés, ZÉRO vivant, 171 → 159. Et le vérificateur pris en défaut DANS L'AUTRE SENS
      pour la première fois : il criait au `TypeError` là où l'apprenant ne voyait RIEN DU TOUT.**

      **Mesure reproduite avant de toucher à quoi que ce soit** : 1 687 blocs avec bouton,
      **1 492 aboutis, 171 EN PANNE, 81 non compilables** — identique au chiffre laissé par B2b-5.
      Deux causes de tête restaient homogènes, à 6 blocs chacune.

      **(a) Les suites de tests PARAMÉTRÉES : 6 blocs, ZÉRO vivant.** `estUneSuiteDeTests`, écrite en
      B2b-1, exige un libellé entre guillemets juste après `test(`. Or la forme paramétrée s'écrit
      `test.each([…])("somme(%i, %i) vaut %i", …)` : le libellé n'est plus le premier argument, il
      vient **après le tableau de cas**, et le motif ne le voyait pas. Six blocs du cours `tests`
      restaient donc en `ReferenceError: test is not defined` — la même maladie que les 36 déjà
      traitées, sous une autre orthographe. Les suffixes retenus (`.each`, `.only`, `.skip`, `.todo`,
      `.concurrent`, `.failing`) n'appartiennent qu'aux lanceurs : aucun programme autonome ne les
      porte, et la garde de B2b-1 (le bloc qui définit lui-même son harnais) reste en place. Impact
      mesuré en EXÉCUTANT chaque bloc désigné : **6 visés, 6 déjà en panne, ZÉRO vivant**
      (`tests/lecon-07` ×4, `tests/lecon-08` #6, `tests/lecon-13` #2).

      **(b) Les service workers : 6 blocs, ZÉRO vivant — et une leçon d'instrument.**
      ⚠️ **C'EST LE PREMIER LOT OÙ LE VÉRIFICATEUR SE TROMPAIT DANS L'AUTRE SENS.** `verif-js.js` les
      comptait en panne sur « self.addEventListener is not a function » — un `TypeError` que son
      contexte `vm` **fabrique**, puisque son `self` est un objet nu. Un VRAI Worker, lui, possède
      `addEventListener`. Une sonde a donc exécuté les 7 blocs de `pages/html/lecon-42.html` dans un
      vrai Worker de Chrome (`file://`, DNS coupé, Blob → Worker par la mécanique exacte de
      `runner.js`, console détournée comme dans `WORKER_SRC`) :

      | bloc | erreur | sortie |
      |---|---|---|
      | `html/lecon-42` #2 #3 #5 #6 #7 #8 #9 | **aucune** (7 sur 7) | **RIEN** (7 sur 7) |

      Le bouton était donc pire qu'on ne le croyait : il ne rendait pas un message d'erreur, **il
      rendait le vide** — sous un commentaire qui promet « à l'install, les 4 ressources sont en
      cache et dispo hors ligne ». C'est logique : un `sw.js` s'installe dans un cycle de vie que le
      navigateur pilote, et dans le Worker du bouton il enregistre des écouteurs pour des événements
      qui ne viendront **jamais**. Sans cette sonde, on aurait « réparé » l'instrument en ajoutant
      `addEventListener` au contexte `vm` — et ces 6 blocs seraient devenus **verts**, muets et verts,
      ce qui est exactement le faux vert que B2b-2 s'était interdit. Les événements retenus
      (`install`, `activate`, `fetch`, `push`, `sync`, `periodicsync`, `notificationclick`) n'existent
      que dans un service worker ; **`message` est délibérément absent de la liste**, car il est
      légitime dans un Web Worker ordinaire. Impact mesuré : **6 visés, ZÉRO vivant.**

      **Écriture.** `estUneSuiteDeTests` élargie et `estUnServiceWorker(texte)` ajoutée dans
      `js/runner.js` ; `tools/verif-js.js` et `tools/verif-clic.js` les **LISENT**, jamais ne les
      recopient.

      **Mesure finale : 1 675 blocs avec bouton, 714 écartés (+12), 1 492 aboutis (89,1 %, contre
      88,4 %), 22 annoncées, 2 non concluants, 159 EN PANNE, 81 non compilables.** Le nombre
      d'aboutis est **rigoureusement inchangé** : 1 492 avant, 1 492 après — et il n'a pas baissé
      d'une unité depuis B2b-2. Cliquets fixés à 159 et 81.

      **Preuve par le navigateur** (`verif-clic.js`, 7 pages : 4 touchées et **3 témoins**), règles
      actives puis neutralisées, `js/runner.js` restauré à l'octet près (md5 `6ea0df45…` identique
      avant et après) :

      | | boutons posés dans le DOM rendu |
      |---|---|
      | règles neutralisées | **34** cliqués sur 34 attendus |
      | règles actives | **22** cliqués sur 22 attendus |

      **12 boutons morts retirés**, exactement les 12 blocs désignés, et le compte tombe à l'unité
      près sur la prévision faite depuis le disque (`tests/lecon-07` 1 bouton restant,
      `tests/lecon-08` 0, `tests/lecon-13` 0, `html/lecon-42` 1, plus les témoins `js/lecon-01` 9,
      `algo/lecon-01` 9, `formats/lecon-02` 2 = 22). **Les 3 témoins gardent leurs 20 boutons**,
      couverture complète des deux côtés, 0 divergence.

      **Non-régression** : `verif-html.js` 1 629 fichiers, **0 grave / 0 attention** ;
      `verif-donnees.js` 25 contrôles, **0 erreur** ; `verif.js --rapide` **40 étapes, tout vert,
      144,7 s** ; `node --check` sur les trois fichiers touchés ; 0 URL vers un CDN. Aucun fichier de
      contenu modifié.

      **Reste au gisement : 159**, et il n'y a plus de lot. Par cours : `js` 55, `projets-js` 33,
      `algo` 18, `patterns` 10, `html` 8, `securite` 7, `tests` 6, `nodejs` 5, `vue` 4. Causes de
      tête : 7 `bouton`, 7 `etatInitial`, 5 `Tache`, 5 `user`, 4 `ctx`, 4 `UnionFind` — c'est-à-dire
      du **fragment interne** presque pur, un bloc qui poursuit le précédent de sa leçon. Aucune
      règle générale ne le couvre. Les deux voies restantes sont écrites depuis B2b-3 et n'ont pas
      bougé : réparation leçon par leçon, ou **décider que le moteur exécute un bloc dans le contexte
      cumulé de sa leçon** — un vrai chantier, à ouvrir comme tel plutôt qu'à commencer ici.

- [x] **B2b-7 · Le fragment interne, traité par le MOTEUR et non par une règle : le bloc en panne
      est REJOUÉ derrière les blocs qui le précèdent. 159 blocs en panne → 131, et les aboutis
      montent de 1 492 à 1 522 — pour la première fois de tout ce point, on ne retire pas des
      boutons, on en fait MARCHER. Avec la mécanique évidente mesurée puis REJETÉE (28 gagnés
      contre 380 perdus), et l'instrument pris en défaut par le navigateur EN PLEIN MILIEU.**

      **Mesure reproduite avant de toucher à quoi que ce soit** (`node tools/verif-js.js --causes`) :
      1 675 blocs avec bouton, 714 écartés, **1 492 aboutis, 22 annoncées, 2 non concluants,
      159 EN PANNE, 81 non compilables** — identique au chiffre laissé par B2b-6.

      **Le plan proposait deux voies, et il fallait chiffrer la seconde avant de la prendre.**
      B2b-6 concluait : « réparation leçon par leçon, ou décider que le moteur exécute un bloc
      dans le contexte cumulé de sa leçon ». `tools/preuves/sonde-contexte-cumule.js` a mesuré
      le CUMUL sur les 1 675 blocs : **28 gagnés, 380 PERDUS** — et 380 pertes sur 380 portent
      le même message, « Identifier '…' has already been declared ». Deux blocs d'une même leçon
      qui déclarent chacun `const jeu` ne cohabitent pas dans une portée globale. La voie
      annoncée par le plan était donc une catastrophe chiffrée : rejetée.

      **Ce qui la remplace ne peut RIEN perdre, par construction.** Le bloc s'exécute SEUL,
      exactement comme avant ; s'il échoue sur « X is not defined », et seulement dans ce cas,
      il est rejoué dans un Worker NEUF derrière les blocs à bouton qui le précèdent. Un bloc
      qui aboutit seul n'est jamais rejoué. Trois pièces, toutes dans `js/runner.js` et toutes
      LUES par les vérificateurs, jamais recopiées : `meriteUnRepli` (quand), `envelopperPourRepli`
      (le bloc rejoué est entouré d'accolades, pour que ses `const` MASQUENT ceux du préambule au
      lieu d'entrer en conflit ; une fonction si le bloc porte `"use strict"`, sinon la directive
      serait déclassée) et `preambuleQuiCompile` (ce qu'on garde du préambule).

      ⚠️ **LE VÉRIFICATEUR A ANNONCÉ 40 BLOCS RÉPARÉS, LE NAVIGATEUR EN A RENDU ZÉRO — et c'est
      la partie la plus importante de ce point.** Écrit d'abord avec `vm.runInContext` appliqué
      à chaque bloc du préambule, l'outil mesurait 40 gains. Une sonde Chrome
      (`tools/preuves/repli-navigateur.js`, `file://`, aucune requête) a cliqué les blocs pour
      de vrai : `algo/lecon-17` #3 et #4 affichaient toujours « ReferenceError: UnionFind is not
      defined ». Cause : le Worker évalue par `(0, eval)(code)`, et **dans un eval, seuls `var` et
      `function` deviennent globaux — les déclarations LEXICALES (`const`, `let`, `class`)
      disparaissent avec l'appel**, alors qu'un script `vm` les conserve dans son contexte. Un
      préambule passé bloc par bloc ne laisse donc rien d'une `class`. Préambule et bloc partent
      maintenant dans UN SEUL script, avec un marqueur `__finDuPrelude` qui rouvre l'affichage
      pile là où le code de l'apprenant commence. Sans cette sonde, ce point livrait 40 réparations
      imaginaires sous un vérificateur vert : exactement le défaut fondateur du chantier.

      **Les six variantes, mesurées et non raisonnées** (`sonde-contexte-cumule.js`) :

      | variante | gagne | fidèle au Worker ? |
      |---|---|---|
      | séparé, bloc nu | 28 | **non** |
      | séparé, bloc enveloppé | 40 | **non** |
      | concaténé, bloc nu | 17 | oui |
      | concaténé, enveloppé | 21 | oui |
      | concaténé, enveloppé, préambule = TOUS les blocs | 19 | oui |
      | **concaténé, enveloppé, préambule TRIÉ** (retenue) | **28** | oui |

      Le tri est ce qui rattrape les 7 derniers : préambule et bloc formant un seul script, une
      seule collision entre deux blocs de la leçon fait échouer la compilation de l'ensemble. On
      ne garde donc du préambule que ce qui COMPILE avec le bloc, en partant du plus PROCHE —
      c'est encore JavaScript qui tranche, jamais un jugement sur le texte (règle de B2b-5).

      **Mesure finale : 1 675 blocs avec bouton, 1 522 aboutis (90,9 %, contre 89,1 %), dont
      30 PAR REPLI, 20 annoncées, 2 non concluants, 131 EN PANNE, 81 non compilables.** Le
      nombre d'aboutis n'a pas baissé d'une unité et MONTE de 30 ; `algo` passe de 18 blocs en
      panne à **4**. Cliquet descendu à 131. Les 2 « annoncées » de moins sont deux blocs dont le
      commentaire contient le mot *erreur* sans qu'aucune leçon n'enseigne de faute
      (`projets-js/lecon-20` #9, `algo/lecon-28` #2) : ils rendent maintenant leur sortie.

      **Preuve par le navigateur, les 30 blocs cliqués UN PAR UN** (`repli-navigateur.js`,
      Chrome, `file://`, 26 pages + 3 témoins) : **33 blocs cliqués, 30 rejoués, 33 sans la
      moindre ligne d'erreur, 0 requête distante**. Et la sortie rendue est celle que la page
      ANNONCE, vérifiée commentaire par commentaire sur un échantillon de six :

      | bloc | ce que la page annonce | ce que l'apprenant obtient |
      |---|---|---|
      | `js/lecon-06` #2 | `Bonjour` ×3 | `Bonjour` ×3 |
      | `js/lecon-20` #8 | `true`, `true`, `false`, `true` | idem, 4 lignes |
      | `algo/lecon-05` #5 | `[1, 2, 3, 4, 5, 6]` | `[1,2,3,4,5,6]` |
      | `algo/lecon-06` #2 | `[1, 2, 3, 5, 8]` | `[1,2,3,5,8]` |
      | `algo/lecon-12` #5 | 3 listes de voisins | les 3, à l'identique |
      | `projets-js/lecon-20` #9 | `false`, `true`, `"gagne"` | `false`, `true`, `gagne` |

      Les 3 témoins (`js/lecon-01`, `algo/lecon-01`, `formats/lecon-02`) rendent exactement ce
      qu'ils rendaient. Une note discrète prévient l'apprenant (« le bloc JavaScript qui précède
      dans la leçon a été exécuté avant celui-ci — son affichage est masqué ») ; elle porte une
      classe `--note` que `verif-clic.js` EXCLUT de sa comparaison, sans quoi tout bloc replié
      apparié à un bloc `.txt` aurait divergé à la ligne 1.

      **Le vérificateur et le navigateur, confrontés bloc à bloc, disent la même chose** :
      `algo/lecon-17` #3 et #4 réparés, #7 et #8 toujours en panne — l'outil et Chrome tombent
      d'accord dans les deux sens. `verif-clic.js` sur 6 pages (3 touchées, 3 témoins) :
      **40 blocs cliqués sur 40 attendus, couverture complète, 0 divergence**.

      ⚠️ **UN TROISIÈME ANGLE MORT TROUVÉ EN CHEMIN, ET FERMÉ : le code du Worker n'était compilé
      par personne.** `WORKER_SRC` n'est pas un fichier mais un TABLEAU DE CHAÎNES assemblé dans
      `runner.js` — le repli vient d'y ajouter une trentaine de lignes, et `node --check
      js/runner.js` n'en voit rien. Éprouvé : une faute injectée dans ce tableau
      (`"var recu = ;"`) laisse **`node --check` PASSER**, tandis que la nouvelle étape
      `preuves/worker-src-compile.js` sort en **1** ; faute retirée, code **0**, fichier restauré
      à l'octet près (md5 `8dfc2e88…` identique avant et après). Elle est versée dans
      `verif.js` (étape `wrksrc`, 0,0 s), et `repli-navigateur.js` est déclaré dans
      `hors-chaine.json` avec sa raison et ce qu'il faudrait pour l'y verser — le garde-fou
      `gardech` avait d'ailleurs signalé les deux, ce qui est son travail.

      ⚠️ **ET UN QUATRIÈME, DANS MES PROPRES OUTILS DE MESURE.** Le garde-fou d'exceptions de la
      sonde, installé dès le chargement, avalait aussi les erreurs de DÉMARRAGE : une règle mal
      lue dans `runner.js` a fait sortir la sonde en **code 0 avec un fichier de résultats VIDE**.
      Un outil qui ne peut plus échouer, dans la passe même où l'on en ferme deux autres. Corrigé :
      le garde-fou n'est armé qu'au moment d'exécuter du contenu, et il COMPTE ce qu'il avale.

      **Non-régression** : `verif-html.js` 1 629 fichiers, **0 grave / 0 attention** ;
      `verif-donnees.js` **0 erreur** ; `verif.js --rapide` **41 étapes, tout vert, 145,1 s** ;
      `node --check` sur les quatre fichiers touchés ; 0 URL vers un CDN. Aucun fichier de contenu
      modifié : ce point ne touche que le moteur et ses vérificateurs.

      **Reste au gisement : 131.** Par cours : `js` 48, `projets-js` 29, `html` 8, `patterns` 8,
      `securite` 7, `tests` 6, `nodejs` 5, `algo` 4, `vue` 4. Causes de tête : 7 `bouton`,
      6 `etatInitial`, 4 `user`, 4 `ctx`, 3 `taches`, 3 `Tache`, 3 `form`, 3 `element` — le
      fragment interne SUBSISTE là où son préambule dépend du DOM (`bouton`, `form`, `ctx`,
      `element` viennent tous d'un `document.querySelector` dans un bloc que `BROWSER_ONLY`
      écarte, donc le repli ne peut rien pour eux). C'est un lot homogène, et c'est la prochaine
      case : un bloc dont le nom manquant est défini par un bloc précédent ÉCARTÉ comme code de
      navigateur est lui-même du code de navigateur — règle à mesurer avec la prudence habituelle.
      S'y ajoutent 3 `Illegal return statement`, ces blocs qu'`eval` refuse alors que
      `new Function` les accepte, déjà repérés en B2b-5.

- [x] **B2b-8 · Le fragment qui HÉRITE du navigateur : 27 blocs écartés, ZÉRO vivant retiré —
      131 blocs en panne → 107, et les aboutis ne bougent pas d'une unité (1 522 avant, 1 522
      après). Avec le critère évident mesuré puis REFUSÉ parce qu'il emportait 31 boutons qui
      marchent.**

      **Mesure reproduite avant de toucher à quoi que ce soit** (`node tools/verif-js.js --causes`) :
      1 675 blocs avec bouton, 714 écartés, **1 522 aboutis, 20 annoncées, 2 non concluants,
      131 EN PANNE, 81 non compilables** — identique au chiffre laissé par B2b-7, le gisement
      n'avait pas bougé. Causes de tête, exactement celles annoncées : 7 `bouton`, 4 `ctx`,
      3 `form`, 3 `element`, 2 `canvas`. Toutes le même récit : le nom naît d'un
      `const bouton = document.querySelector(…)` dans un bloc PRÉCÉDENT que `BROWSER_ONLY`
      écarte — donc absent du préambule, donc hors de portée du repli de B2b-7.

      **C'est la PREMIÈRE règle du bouton qui regarde ce qui PRÉCÈDE.** Les sept autres jugent un
      bloc seul. Celle-ci répond à une panne qui n'existe que dans un contexte, et elle reçoit
      donc un second argument : les blocs de navigateur situés avant celui qu'on examine. Dans
      `runner.js` comme dans les deux vérificateurs, ce relevé se fait dans une **passe séparée**,
      avant toute décision — un bloc sans barre d'outils n'est jamais candidat au bouton mais
      reste une source de noms pour ceux qui le suivent, et une passe à part rend l'ordre
      explicite au lieu de le faire dépendre d'un effet de bord de la boucle.

      ⚠️ **LE CRITÈRE ÉVIDENT AURAIT RETIRÉ 31 BOUTONS QUI MARCHENT, et seule l'exécution le
      disait.** `tools/preuves/sonde-heritage-navigateur.js` EXÉCUTE chaque bloc désigné, repli
      compris, avant qu'une ligne ne soit écrite dans le moteur :

      | critère | visés | dont VIVANTS |
      |---|---|---|
      | décl. colonne 0, usage n'importe où | 75 | **31** |
      | décl. n'importe où, usage n'importe où | 100 | **50** |
      | **décl. colonne 0, USAGE en colonne 0** (retenu) | **27** | **0** |

      Ce qui sépare les deux lignes tient en une phrase : **un nom cité dans le CORPS d'une
      fonction que le bloc n'appelle jamais ne fait rien échouer.** `projets-js/lecon-16` #2
      déclare des fonctions de dessin qui mentionnent `ctx` sans jamais les appeler : il aboutit,
      silencieux mais vivant. Le nom qui OUVRE une ligne, lui, est évalué au niveau racine et
      l'erreur est certaine dès le clic. C'est la contrainte de colonne zéro du point B2b-3,
      appliquée cette fois à l'USAGE et non à la déclaration.
      **Deux variantes voisines mesurées puis écartées** : chercher la déclaration n'importe où
      gagne UN bloc (28 au lieu de 27, `js/lecon-65` #5) au prix de noms locaux banals promus en
      sources ; et la CASCADE — l'écarté transmet à son tour — ne change **RIEN**, 27 dans les
      deux cas. On garde la règle la plus étroite, et on n'écrit pas une complication qui ne
      rapporte rien.

      **Impact : 27 blocs visés, 24 déjà comptés en panne, 3 que le vérificateur classait
      « erreur annoncée » à tort, ZÉRO VIVANT.** Les trois : `js/lecon-33` #4 et #6,
      `projets-js/lecon-19` #3 — leur commentaire porte les mots « invalide » ou « erreur », mais
      ils n'enseignent aucune faute ; ce sont des écouteurs `submit` et `dragstart` posés sur un
      `form` et un `board` du document, l'un d'eux s'ouvrant même sur « effet navigateur ». D'où
      les annoncées qui passent de 20 à 17.

      ⚠️ **LA SONDE MESURE MAINTENANT LA RÈGLE RÉELLEMENT POSÉE DANS LE MOTEUR, pas sa maquette.**
      Les quatre variantes ci-dessus sont des reconstitutions écrites dans la sonde ; une
      cinquième **LIT `heriteDuNavigateur` dans `js/runner.js`** et rejoue la mesure. Sans elle,
      rien n'interdisait qu'une transcription approximative vise 27 blocs pendant que le moteur en
      visait d'autres — le défaut fondateur du chantier, celui du commit « trois cas, testés » du
      2026-09-02. Verdict : **27 visés, 24 en panne, 0 vivant, identique à la maquette.**

      **Écriture.** `heriteDuNavigateur(texte, blocsNavigateur)` dans `js/runner.js`, huitième règle
      du bouton ; `tools/verif-js.js` et `tools/verif-clic.js` la **LISENT**, jamais ne la
      recopient. Les deux la testent **après** `neCompilePas`, dans le même ordre que `init()` :
      un bloc qui relève des deux doit être compté du même côté par les deux outils, sinon les
      chiffres divergent sans qu'aucune règle n'ait changé. `verif-clic.js` a demandé un peu plus
      qu'une ligne — son `ecarteParRunner` jugeait un bloc isolé et sa table de règles était un
      tableau anonyme : elle devient une table nom → fonction, seule façon d'y désigner
      `estDuDomDePage` (qui décide ce qui est « du navigateur ») et de passer un contexte à la
      règle qui en réclame un. Sans cela il aurait réclamé **27 boutons que le navigateur ne pose
      plus** : la dette de B2b-3, un cran plus loin.

      **Mesure finale : 1 648 blocs avec bouton, 741 écartés (+27), 1 522 aboutis (92,4 %, contre
      90,9 %), dont 30 par repli, 17 annoncées, 2 non concluants, 107 EN PANNE, 81 non
      compilables.** Le nombre d'aboutis est **inchangé à l'unité près**, et les 30 blocs qui ne
      vivent que par le repli sont toujours 30 — c'était le risque propre à ce point, puisqu'un
      bloc privé de bouton disparaît aussi du préambule des suivants. Cliquet descendu à 107.

      **Preuve par le navigateur** (le vérificateur n'exécute pas `runner.js` : seul un vrai Chrome
      dit ce que l'apprenant voit), par `verif-clic.js` — l'outil du projet qui CLIQUE — sur
      **13 pages, les 10 touchées et 3 témoins**, règle active puis neutralisée, le fichier
      restauré ensuite à l'octet près (md5 `b8b999eb…` identique avant et après) :

      | sur `js/lecon-11`, `html/lecon-44`, `projets-js/lecon-10` + 3 témoins | boutons posés dans le DOM rendu |
      |---|---|
      | règle neutralisée | **35** cliqués sur 35 attendus |
      | règle active | **24** cliqués sur 24 attendus |

      **11 boutons de moins**, et ce sont exactement les 11 blocs que la règle désigne sur ces
      pages (`js/lecon-11` #2 #3 #4 #6, `html/lecon-44` #2 #3 #6 #8, `projets-js/lecon-10` #3 #4
      #5) : l'écart tombe à l'unité près sur la prévision, donc **aucun témoin n'est entamé**. Les
      7 autres pages touchées (`js/lecon-33`, `projets-js/lecon-02` `-06` `-12` `-17` `-19`,
      `nodejs/lecon-06`) rendent **18 blocs cliqués sur 18 attendus**. Au total **42 sur 42,
      couverture complète, 0 divergence** entre ce que la page imprime et ce que le clic rend.

      **Le garde-fou éprouvé par injection, dans les deux sens et deux fois.** (a) Règle
      neutralisée dans `runner.js` : `verif-js.js` sort en **1**, « 131 blocs en panne contre 107
      à la référence » ; restaurée, code **0**, md5 identique. (b) `zzzNomInexistant();` injecté en
      tête d'un bloc vivant d'`algo/lecon-01` : code **1**, « 108 contre 107 » ; faute retirée,
      code **0**, page revenue à l'octet près (md5 `269ad551…`). Le contrôle rougit donc aussi
      bien quand la règle disparaît que quand le contenu casse.

      **Non-régression** : `verif-html.js` 1 629 fichiers, **0 grave / 0 attention** ;
      `verif-donnees.js` 25 contrôles, **0 erreur** ; `verif-chaine-declaree.js` 89 outils,
      **code 0** ; `preuves/worker-src-compile.js` **code 0** ; `verif.js --rapide` **41 étapes,
      tout vert, 145,8 s** ; `node --check` sur les quatre fichiers touchés ; 0 URL vers un CDN
      (grep = 0 sur les quatre). Aucun fichier de contenu modifié : ce point ne touche que le
      moteur et ses vérificateurs.

      **Reste au gisement : 107.** Par cours : `js` 44, `projets-js` 14, `patterns` 8, `securite` 7,
      `tests` 6, `html` 4, `algo` 4, `nodejs` 4, `vue` 4. Causes de tête : 6 `etatInitial`,
      4 `bouton`, 4 `user`, 3 `taches`, 3 `Tache`, 3 `element`, 3 `Illegal return statement`.
      **Ce reste a été DISSÉQUÉ dans la même passe** (`tools/preuves/sonde-repli-manque.js`), et la
      mesure a immédiatement démenti l'explication qui venait à l'esprit — « la leçon expose la
      solution avant l'énoncé, donc le bloc source est plus bas » : **0 cas sur 107.** Ce que la
      sonde trouve à la place, sur les 92 blocs qui échouent encore sur un nom manquant :

      | pourquoi le repli ne les sauve pas | blocs |
      |---|---|
      | **INTROUVABLE** : le nom n'est déclaré NULLE PART dans la page | **60** |
      | **TRI** : la source existe mais est dans un bloc sans bouton (10), ou écartée par `preambuleQuiCompile` faute de compiler avec le bloc (6) | **16** |
      | **AUTRE-ERR** : le préambule passe, le repli échoue sur autre chose | **16** |
      | **APRÈS** : le bloc source est plus bas dans la leçon | **0** |

      Trois lots, trois natures, donc trois cases : les 60 « introuvables » sont de vrais
      fragments orphelins (`taches`, `input`, `produits`, `bouton` sans son `querySelector`) —
      là il faudra décider de débrancher, pas de réparer. Les 16 « TRI » sont le seul lot où le
      repli pourrait être ÉLARGI. Et dans les 16 « AUTRE-ERR » se cache un sous-lot homogène de
      **7 blocs en `Cannot access '…' before initialization`** (`js/lecon-09` ×5, `algo/lecon-17`
      ×2) qui est un effet de l'enveloppe du repli elle-même : le bloc entouré d'accolades
      redéclare le nom, et sa zone morte temporelle masque alors le préambule qui l'aurait
      fourni. Ces blocs échouaient déjà seuls, donc rien n'a régressé — mais c'est une limite
      MESURÉE de la mécanique de B2b-7, à connaître avant d'y toucher.
      S'y ajoutent, hors « nom manquant », les 3 `return` racine qu'`eval` refuse alors que
      `new Function` les accepte (B2b-5). **Aucune règle unique ne fermera ce reste.**

- [x] **B2b-9 · Le préambule RÉ-ANCRÉ : le tri gardait le bloc le plus proche et jetait celui
      qui portait le nom manquant — 107 blocs en panne → 102, aboutis 1 522 → 1 527, ZÉRO
      perte. Avec l'élargissement « évident » de l'autre moitié du lot mesuré puis REFUSÉ :
      0 gain et 2 blocs vivants cassés.**

      **Mesure reproduite avant de toucher à quoi que ce soit.** `node tools/verif-js.js --causes` :
      1 648 blocs avec bouton, 741 écartés, **1 522 aboutis, 17 annoncées, 2 non concluants,
      107 EN PANNE, 81 non compilables** — le chiffre laissé par B2b-8, à l'unité près.
      `sonde-repli-manque.js` rejouée rend elle aussi **60 INTROUVABLE, 16 AUTRE-ERR, 16 TRI,
      0 APRÈS**, identiques. Le gisement n'avait pas bougé.

      **Le lot TRI n'était pas un lot mais DEUX, et une seule moitié était réparable.**
      Sur les 16 : **6** ont un bloc source qui A un bouton mais que `preambuleQuiCompile` a
      écarté, **10** ont un bloc source SANS bouton. `pages/js/lecon-21` est le cas d'école du
      premier groupe : le bloc #1 déclare `class Tache` ET `class TachePrioritaire`, le #2
      redéclare `TachePrioritaire`. Le tri du repli part du PLUS PROCHE et remonte : pour le
      bloc #3 il garde donc le #2, puis refuse le #1 qui entre en collision avec lui — et le #1
      était précisément celui qui portait `Tache`. **C'est l'ancien qui saute, jamais le récent,
      alors que c'est l'ancien qui porte le remède.**

      ⚠️ **L'ÉLARGISSEMENT ÉVIDENT DE L'AUTRE MOITIÉ EST REFUSÉ PAR LA MESURE.** Donner au
      préambule les blocs SANS bouton — ce que le plan désignait comme « le seul lot où le repli
      pourrait être élargi » — a été exécuté sur tout le site avant qu'une ligne ne soit écrite
      (`tools/preuves/sonde-preambule-elargi.js`) :

      | variante | gains | pertes |
      |---|---|---|
      | RÉ-ANCRAGE, 1 tour | 4 | 0 |
      | **RÉ-ANCRAGE, 2 tours** (retenu) | **5** | **0** |
      | RÉ-ANCRAGE, 3 tours · 4 · 5 · sans plafond | 5 | 0 |
      | **PRÉFIXE ÉTENDU aux blocs sans bouton** | **0** | **2** |

      Le préfixe étendu ne gagne **rien** et casse **deux blocs vivants** — `js/lecon-12` #8 et
      `projets-js/lecon-21` #3, tombés sur `localStorage is not defined` et `document is not
      defined`. La raison est celle qui leur a retiré leur bouton : un bloc de navigateur ne
      s'exécute pas dans un Worker, et le mettre en préambule fait échouer le préambule ENTIER,
      donc le bloc qui le suivait. Les 10 blocs de ce sous-lot sont hors d'atteinte de toute
      mécanique de préambule ; c'est un fait mesuré, pas une hypothèse.

      **La règle retenue ne juge toujours pas le texte.** Quand le repli échoue À SON TOUR sur
      un « Y is not defined », on cherche le bloc le plus proche du préfixe qui déclare Y en
      colonne zéro et on TRONQUE le préfixe juste après lui : il devient le plus proche, donc le
      premier que le tri garde. Le reste — compilation, enveloppe, marqueur de fin de préambule —
      est inchangé.
      ⚠️ **LA TRONCATURE DOIT ÊTRE STRICTE, sans quoi la boucle ne s'arrête jamais** : un
      préfixe inchangé rend un préambule inchangé, donc mot pour mot la même erreur, donc le même
      ancrage. C'est cette décroissance — et non un compteur de tours — qui garantit la
      terminaison. Le plafond a d'ailleurs été mesuré avant d'être écarté : **le ré-ancrage sature
      à DEUX tours**, et 3, 4, 5 tours ou l'absence totale de plafond ne rendent pas un bloc de
      plus. On n'écrit donc pas une constante magique qui n'aurait servi à rien.

      **Impact : 5 blocs, ZÉRO perte, et pour cause — le ré-ancrage ne se déclenche que sur un
      bloc DÉJÀ en panne**, comme le repli dont il prolonge la mécanique. Il ne peut rien
      retirer, ni un bouton ni une sortie. Les 5 : `js/lecon-21` #3 #4 #5, `algo/lecon-25` #8,
      `projets-js/lecon-15` #4.

      **ET LA SORTIE DIT CE QUE LA LEÇON ANNONCE — vérifié une par une, pas supposé.** C'est le
      seul contrôle qui compte ici : un bloc qui « aboutit » en affichant autre chose que sa
      promesse serait le défaut fondateur du chantier sous un autre nom.

      | bloc | ce que la page annonce en commentaire | ce que Chrome affiche au clic |
      |---|---|---|
      | `js/lecon-21` #3 | `// "Envoyer le devis (P2)"` | `Envoyer le devis (P2)` |
      | `js/lecon-21` #4 | `// 1  -> on lit "toutes" sans ()` | `1` |
      | `js/lecon-21` #5 | *(aucun `console.log`)* | `(aucune sortie — ajoute un console.log…)` |
      | `algo/lecon-25` #8 | `// => 4`, `// => 3`, `// => 2 6` | `4`, `3`, `2 6` |
      | `projets-js/lecon-15` #4 | `// affiche: false`, `// affiche: true` | `false`, `true` |

      **Preuve par le navigateur** (le vérificateur n'exécute pas `runner.js` : seul un vrai
      Chrome dit ce que l'apprenant voit), `tools/preuves/repli-navigateur.js`, `file://`,
      **règle neutralisée puis active** :

      | | ce que l'apprenant obtient au clic |
      |---|---|
      | règle neutralisée | `js/lecon-21` #3 → **ReferenceError: Tache is not defined** ; `algo/lecon-25` #8 → **inserer is not defined** ; `projets-js/lecon-15` #4 → **etatInitial is not defined** |
      | règle active | **5 blocs cliqués, 5 rejoués, 5 sans la moindre erreur, 0 requête distante** |

      `verif-clic.js` sur les 3 pages touchées : **27 blocs cliqués sur 27 attendus, couverture
      complète, 0 divergent**, et le compte est le MÊME règle active ou neutralisée — ce qui est
      le bon résultat : le ré-ancrage ne touche à aucun bouton, il ne change que ce que le clic
      rend.

      **Écriture.** `preambuleReAncre(prefixe, erreur)` dans `js/runner.js`, à côté de
      `preambuleQuiCompile` ; `lancerJs` reçoit un septième argument, le préfixe COMPLET dont le
      préambule a été tiré — il ne se retrouverait pas depuis le préambule, qui est déjà le
      résultat du tri. `tools/verif-js.js` la **LIT**, jamais ne la recopie, et rejoue la même
      boucle. Les deux sondes (`sonde-repli-manque.js`, `sonde-preambule-elargi.js`) la lisent
      aussi : sans cela la première aurait continué de classer « TRI » cinq blocs désormais
      sauvés, et se serait périmée dès la passe suivante.

      ⚠️ **UNE SONDE QUI MEURT APRÈS AVOIR PARLÉ.** Le premier jet de `sonde-preambule-elargi.js`
      a affiché ses chiffres puis s'est arrêté en défaut : `pages/js/lecon-19` rejoue un
      `EventTarget` dont l'écouteur lève dans un microtask, `vm.runInContext` a déjà rendu la
      main, le `try/catch` ne voit rien, et Node relance l'erreur par `process.nextTick`. Une
      mesure dont on ne sait pas si elle est allée au bout ne vaut rien. Le navigateur, lui, se
      contente d'écrire la ligne dans la console du Worker : la sonde l'ignore comme lui.

      **Mesure finale : 1 648 blocs avec bouton, 741 écartés, 1 527 aboutis (92,7 %, contre
      92,4 %), dont 35 par repli (contre 30), 17 annoncées, 2 non concluants, 102 EN PANNE,
      81 non compilables.** Cliquet descendu à 102. Aucun écarté de plus : ce point ne retire
      pas un bouton, il en répare cinq.

      **Le garde-fou éprouvé par injection, dans les deux sens.** (a) `preambuleReAncre`
      neutralisée dans `runner.js` : `verif-js.js` sort en **1**, « 107 blocs en panne contre 102
      à la référence » ; restaurée, code **0**, md5 identique (`3372079e…`). (b)
      `zzzNomInexistant();` injecté dans `js/lecon-21` #3 — un bloc que ce point vient de sauver,
      donc le chemin neuf lui-même : code **1**, « 103 contre 102 » ; faute retirée, code **0**,
      page revenue à l'octet près (md5 `0d44112c…`).

      **Non-régression** : `verif-html.js` **1 629 fichiers, 0 grave / 0 attention** ;
      `verif-donnees.js` **0 erreur** ; `verif-chaine-declaree.js` **89 outils, code 0** ;
      `preuves/worker-src-compile.js` **code 0** ; `verif.js --rapide` **41 étapes, tout vert,
      145,6 s** ; `node --check` sur les quatre fichiers touchés ; **0 URL vers un CDN**. Aucun
      fichier de contenu modifié : ce point ne touche que le moteur, ses vérificateurs et ses
      sondes.

      **Reste au gisement : 102.** Par cours : `js` 41, `projets-js` 13, `patterns` 8,
      `securite` 7, `tests` 6, `html` 4, `nodejs` 4, `vue` 4, `algo` 3, `react` 2,
      `typescript` 2, `cicd` 2. La dissection rejouée, ré-ancrage compris, donne : **INTROUVABLE
      60, AUTRE-ERR 17, TRI 10, APRÈS 0.** Le TRI restant est désormais d'une SEULE nature — le
      bloc source n'a pas de bouton — et le tableau ci-dessus prouve qu'aucune mécanique de
      préambule ne l'ouvrira. **Le repli a donc atteint sa limite : ce qui reste ne se répare
      plus en donnant du contexte, mais en décidant, bloc par bloc, de débrancher un fragment
      orphelin ou de le rendre autonome.** C'est un travail de CONTENU, pas de moteur, et c'est
      la nature des 60 « introuvables ».

- [x] **B2b-10 · Le FRAGMENT ORPHELIN, neuvième règle du bouton : 35 blocs écartés, ZÉRO vivant
      retiré — 102 blocs en panne → 70, aboutis inchangés à 1 527. Et le troisième cliquet, né
      d'une injection qui a traversé le contrôle EN VERT.**

      **Mesure reproduite avant de toucher à quoi que ce soit** : `verif-js.js --causes` rend
      **102 EN PANNE**, et `sonde-repli-manque.js` rejouée **60 INTROUVABLE, 17 AUTRE-ERR,
      10 TRI, 0 APRÈS** — les chiffres laissés par B2b-9. Le lot des 60 « introuvables » est
      celui que le point précédent a déclaré hors d'atteinte de tout préambule : le nom manquant
      n'est déclaré NULLE PART dans la page. Il ne reste qu'à leur retirer le bouton.

      **La difficulté est que cette règle-là ne peut pas exécuter.** Les huit précédentes
      jugent un texte ; celle-ci doit dire, SANS rien lancer, « ce bloc ouvre une ligne sur un
      nom que rien ne fournit ». Or un mot peut ouvrir une ligne sans être un identifiant : le
      texte d'un gabarit `` ` `` sur plusieurs lignes, ou le corps d'un commentaire `/* … */`.
      **Chaque précaution a donc été mesurée, pas supposée**
      (`tools/preuves/sonde-fragment-orphelin.js`, qui EXÉCUTE chaque bloc visé, repli et
      ré-ancrage compris) :

      | critère | visés | dont VIVANTS |
      |---|---|---|
      | tel quel | 38 | **3** |
      | commentaires neutralisés | 38 | **3** |
      | + chaînes et gabarits neutralisés | 36 | **1** |
      | **+ étiquettes exclues** (retenu) | **35** | **0** |
      | **la règle RÉELLEMENT POSÉE dans `runner.js`** | **35** | **0** |

      Les trois vivants que le critère naïf emportait disent chacun pourquoi une précaution
      existe : `js/lecon-13` #12 (« Total » dans un gabarit), `crypto/lecon-10` #1 (« tar » dans
      un gabarit — **40 lignes de sortie**, un bloc bien vivant), et `graphql/lecon-09` #4, un
      fragment d'objet qui s'ouvre sur `context: () => ({` — **`nom:` en tête de ligne est une
      clé ou un label, jamais la lecture d'une variable.**
      ⚠️ Le nettoyage des chaînes se fait **caractère par caractère**, pas par expression
      régulière : aucune regex ne suit l'imbrication d'un `${…}`, et le code qui s'y trouve est
      du VRAI code qu'il faut continuer de lire.

      ⚠️ **LA CINQUIÈME LIGNE DU TABLEAU EST LA SEULE QUI COMPTE**, et c'est la leçon de B2b-8
      appliquée d'emblée : les quatre premières sont des reconstitutions écrites dans la sonde.
      Une cinquième **LIT `estUnFragmentOrphelin` dans `js/runner.js`** et rejoue la mesure.
      Verdict identique — 35 visés, 35 morts, 0 vivant.

      **Impact : 35 blocs, dont 32 comptés en panne et 3 que le vérificateur classait « erreur
      annoncée » à tort** (d'où les annoncées qui passent de 17 à 14). Les trois — `js/lecon-47`
      #11, `js/lecon-23` #4, `tests/lecon-02` #2 — sont d'authentiques fragments : ils appellent
      `debounce`, `chargerProfil()`, `affirmer(…)`, déclarés nulle part. Leur commentaire porte
      les mots « erreur » ou « échec » **dans une explication**, pas dans une promesse
      d'exception ; c'est le même faux positif du détecteur de commentaire qu'au point B2b-8.

      ⚠️⚠️ **LE DÉFAUT LE PLUS GRAVE DE CE POINT N'EST PAS DANS LA RÈGLE, IL EST DANS CE QUE LA
      RÈGLE REND AVEUGLE — et il a traversé le contrôle EN VERT.** L'épreuve par injection
      habituelle, `zzzNomInexistant();` en tête d'un bloc vivant d'`algo/lecon-01`, a rendu
      **code 0, « 70 blocs en panne, comme à la référence »**. Cause : la règle neuve écartait
      aussitôt le bloc cassé, qui sortait donc du décompte des pannes. **Un appel de fonction
      inexistante — la faute la plus banale du site — était devenu invisible au cliquet.**
      C'est exactement le défaut de bord que `neCompilePas` avait reçu au point B2b-5, et qui
      lui avait déjà valu un cliquet séparé ; il vient de se reproduire à l'identique sur une
      règle neuve, un mois plus tard. **Les fragments orphelins ont donc leur propre cliquet**,
      `orphelins: 35` dans `verif-js-attendu.json`. Les trois cliquets sont désormais éprouvés
      chacun sur SA faute :

      | injection dans `algo/lecon-01` | cliquet qui rougit | code |
      |---|---|---|
      | `null.zz;` (faute d'exécution) | pannes, **71 contre 70** | 1 |
      | `const x = ;` (faute de syntaxe) | non compilables, **82 contre 81** | 1 |
      | `zzzNomInexistant();` (nom absent) | **orphelins, 36 contre 35** | 1 |

      À chaque fois, faute retirée → code **0** et page revenue à l'octet près (md5
      `269ad551…`). Et dans l'autre sens : `estUnFragmentOrphelin` neutralisée dans `runner.js`
      → **code 1, « 102 blocs en panne contre 70 à la référence »** ; restaurée, code **0**, md5
      identique (`b299969c…`).

      **Preuve par le navigateur** (le vérificateur n'exécute pas `runner.js` : seul un vrai
      Chrome dit ce que l'apprenant voit), par `verif-clic.js` — l'outil du projet qui CLIQUE —
      sur **8 pages : 5 touchées à forte densité et 3 témoins** (les pages du point B2b-9, ce qui
      contrôle aussi sa non-régression) :

      | sur `js/lecon-61`, `securite/lecon-04`, `tests/lecon-05`, `perf-web/lecon-11`, `html/lecon-44` + 3 témoins | boutons posés dans le DOM rendu |
      |---|---|
      | règle neutralisée | **43** cliqués sur 43 attendus |
      | règle active | **31** cliqués sur 31 attendus |

      **12 boutons de moins**, et ce sont exactement les 12 blocs que la règle désigne sur ces
      pages : l'écart tombe à l'unité près sur la prévision, **aucun témoin n'est entamé**, et
      les trois pages de B2b-9 gardent leurs boutons.

      ⚠️ **`verif-clic.js` A RÉCLAMÉ 12 BOUTONS QUE LE NAVIGATEUR NE POSE PLUS — la dette de
      B2b-3 puis de B2b-8, une troisième fois.** Première mesure : **43 attendus, 31 cliqués,
      « ÉCART DE 12 BLOC(S) », code 2.** Sa table de règles ne connaissait pas la neuve, et son
      compte « attendu » est relevé sur le disque. Soldé dans la même passe : la règle y est
      LUE, et `blocsAttendusDe` fait désormais **deux passes** — une pour relever tous les
      textes JavaScript de la page, une pour décider. Car c'est **la seconde règle à contexte,
      et elle n'a pas le même que la première** : `heriteDuNavigateur` demande ce qui PRÉCÈDE,
      `estUnFragmentOrphelin` demande la page ENTIÈRE — un nom déclaré plus bas est fourni par
      la leçon, même si le repli ne peut pas le donner, et écarter le bloc pour cela serait un
      abus. Après solde : **31 attendus, 31 cliqués, couverture complète, 0 divergent.**

      **Écriture.** `estUnFragmentOrphelin(texte, tousLesBlocs)` dans `js/runner.js`, neuvième
      règle du bouton, testée en dernier ; `init()` relève tous les textes JS dans la passe
      séparée qui existait déjà. `tools/verif-js.js` et `tools/verif-clic.js` la **LISENT**,
      jamais ne la recopient, et la testent dans le même ordre qu'`init()`. Les trois sondes
      (`sonde-fragment-orphelin.js`, `sonde-repli-manque.js`, `sonde-preambule-elargi.js`) la
      lisent aussi : une sonde qui calcule les blocs à bouton autrement que le moteur mesure un
      site qui n'existe pas.
      La fonction est **AUTONOME**, listes de mots-clés et de globales comprises — les
      vérificateurs l'évaluent hors de tout contexte, une référence à une autre fonction du
      module la rendrait illisible.

      **Mesure finale : 1 613 blocs avec bouton (contre 1 648), 776 écartés (+35), 1 527
      aboutis (94,7 %, contre 92,7 %), dont 35 par repli, 14 annoncées, 2 non concluants,
      70 EN PANNE, 81 non compilables, 35 fragments orphelins.** **Le nombre d'aboutis est
      inchangé à l'unité près** — c'était le risque propre à ce point, puisqu'un bloc privé de
      bouton disparaît aussi du préambule des suivants. Cliquet descendu à 70.

      **Non-régression** : `verif-html.js` **1 629 fichiers, 0 grave / 0 attention** ;
      `verif-donnees.js` **0 erreur** ; `verif-chaine-declaree.js` **code 0** ;
      `preuves/worker-src-compile.js` **code 0** ; `verif.js --rapide` **41 étapes, tout vert,
      149,9 s** ; `node --check` sur les six fichiers touchés ; **0 URL vers un CDN**. Aucun
      fichier de contenu modifié : ce point ne touche que le moteur, ses vérificateurs et ses
      sondes.

      **Reste au gisement : 70.** Par cours : `js` 34, `projets-js` 11, `patterns` 8,
      `nodejs` 4, `algo` 3, `vue` 3, `typescript` 2, `cicd` 2. La dissection rejouée, la
      nouvelle règle comprise : **INTROUVABLE 31, AUTRE-ERR 15, TRI 10, APRÈS 0.** Les 31
      « introuvables » qui subsistent sont ceux que le critère STATIQUE ne sait pas nommer — le
      nom manquant n'ouvre aucune ligne, il est lu dans le corps d'une fonction que le bloc
      appelle. Les élargir demanderait de savoir quelles fonctions un bloc appelle vraiment,
      c'est-à-dire de l'exécuter : **une règle de bouton ne le peut pas.** Ce qui reste se
      traite donc bloc par bloc, dans le CONTENU.

- [x] **B2b-11 · Le premier lot traité DANS LE CONTENU : les 8 esquisses de patron du cours
      `patterns` rendues exécutables — 70 blocs en panne → 62, aboutis 1 527 → 1 535, `patterns`
      tombe à ZÉRO. Et le vérificateur qui CLIQUE rendait le même « tout concorde » avant et
      après.**

      **Mesure reproduite avant de toucher à quoi que ce soit** : `verif-js.js --causes` rend
      **1 613 blocs avec bouton, 776 écartés, 1 527 aboutis (94,7 %), 35 par repli, 14 annoncées,
      2 non concluants, 70 EN PANNE, 81 non compilables, 35 orphelins** — les chiffres laissés
      par B2b-10, le gisement n'avait pas bougé.

      **Le point précédent avait conclu qu'aucune règle générale ne fermerait le reste.** Le
      premier lot homogène est donc `patterns` : **8 blocs, un cours entier, 100 % du cours.**
      Ce sont des ESQUISSES de patron de conception — elles nomment des collaborateurs
      (`Camion`, `Bateau`, `PizzaBuilder`, `BibliothequeTierce`, `LecteurFichier`, `Codec`,
      `Encodeur`, `Conteneur`, `FabriqueCalculatrice`, `StrategieAddition`, `PaiementStripe`,
      `EmailSMTP`, `ConsoleLog`, `produits`) **déclarés nulle part dans la page**, et le bouton
      « Tester » posé dessus ne pouvait rendre qu'une `ReferenceError`.

      **Rendus autonomes plutôt que débranchés**, parce que c'est le seul des deux choix qui
      GAGNE quelque chose : un patron de conception qu'on peut exécuter et dont on lit le
      résultat vaut mieux qu'un patron dont on a retiré le bouton. Chaque collaborateur manquant
      est écrit en 1 à 4 lignes, et chaque bloc se termine par un `console.log` qui MONTRE ce que
      le patron produit. Sortie **mesurée par exécution**, jamais annoncée de tête :

      | bloc | ce que le clic donnait | ce que le clic donne |
      |---|---|---|
      | `patterns/lecon-03` #1 (fabrique) | `ReferenceError: type is not defined` | `livraison par la mer` / `livraison par la route` |
      | `patterns/lecon-03` #3 (monteur) | `ReferenceError: PizzaBuilder is not defined` | `{"taille":"grande","pate":"fine","garnitures":["fromage","champignons"]}` |
      | `patterns/lecon-04` #1 (adaptateur) | `ReferenceError: BibliothequeTierce is not defined` | `débité : 1999 centimes` |
      | `patterns/lecon-04` #3 (façade) | `ReferenceError: LecteurFichier is not defined` | `sortie.mp4 (clip.mov vers mp4)` |
      | `patterns/lecon-05` #1 (stratégie) | `ReferenceError: produits is not defined` | `souris, clavier, écran` / `clavier, écran, souris` |
      | `patterns/lecon-06` #1 (sur-abstraction) | `ReferenceError: FabriqueCalculatrice is not defined` | `5` / `5` |
      | `patterns/lecon-09` #2 (injection) | `ReferenceError: PaiementStripe is not defined` | 3 lignes, dont `capturé par la doublure : …` |
      | `patterns/lecon-09` #3 (doublure) | `ReferenceError: ConsoleLog is not defined` | `action effectuée` / `true` |

      ⚠️ **Le jeu de données de la stratégie a été CHOISI PAR LA MESURE, pas par l'intention.**
      Un premier jeu (`clavier` 45, `écran` 190, `adaptateur` 12) rendait le MÊME ordre par prix
      et par nom : la démonstration « on change d'algorithme » n'aurait rien démontré du tout.
      Exécuté, remplacé par `souris` 25 / `clavier` 45 / `écran` 190, qui donne deux ordres
      distincts. `localeCompare` sur `écran` n'a pas été supposé non plus : il a été lancé.

      ⚠️ **Précaution de repli** : `lecon-09` #2 et #3 déclaraient tous deux `const messages`.
      Le repli concatène les blocs précédents ; la collision `Identifier 'messages' has already
      been declared` était en germe. #2 nomme donc sa liste `recus`.

      ⚠️⚠️ **LE CONSTAT LE PLUS UTILE DE CE POINT NE PORTE PAS SUR LE CONTENU, MAIS SUR
      L'INSTRUMENT — et c'est le fil même de ce chantier.** `verif-clic.js`, l'outil qui ouvre
      un vrai Chrome et CLIQUE, a rendu **exactement le même verdict avant et après** :

      > `29 blocs attendus, 29 cliqués, couverture complète, 0 DIVERGENT, « Ce que la page
      > imprime et ce que l'apprenant obtient au clic concordent partout ».`

      Alors qu'AVANT, 8 de ces 29 blocs affichaient une `ReferenceError` au visage de
      l'apprenant. La cause est dans `verif-clic.js:494` : `if (!attendu) { sansSortie++;
      continue; }` — aucune de ces cinq pages ne porte de bloc `.txt` apparié, donc les 29 blocs
      tombent dans « sans bloc de sortie à comparer » et le texte réellement obtenu, relevé dans
      la variable `vu`, est **jeté sans être lu**. Le compteur « fragments (rien produit /
      erreur) », qui aurait nommé le problème, est placé APRÈS et n'est jamais atteint.
      **Un contrôle qui ne peut pas échouer occupe la place.**

      **Soldé dans la même passe : `verif-clic.js --sorties`**, qui imprime pour chaque bloc
      cliqué le nombre de lignes et le texte que la console de la page affiche. Il ne juge rien
      et ne change aucun code de sortie — il donne à LIRE ce que l'apprenant voit, ce qui était
      précisément l'angle mort. C'est lui qui a produit les deux colonnes du tableau ci-dessus,
      dans Chrome `file://`. Éprouvé dans les deux sens : sur le dépôt d'origine restauré
      (`git checkout --`), il imprime les 8 `ReferenceError` ; sur le dépôt corrigé, les 8
      résultats. Sans le drapeau, comportement inchangé (`lecon-06` : 4 cliqués, 0 divergent,
      code 0).

      **Les sorties du vrai Chrome sont identiques, à la ligne près, à celles mesurées dans
      Node** — ce qui n'allait pas de soi : c'est l'écart entre les deux moteurs qui avait laissé
      passer `compilation/lecon-08`, la raison d'être de `verif-clic.js`.

      **Cliquet éprouvé sur SA faute**, injection dans un bloc que ce point vient de réparer
      (`patterns/lecon-03` #1, `null.zz;` derrière `class Camion`) → **code 1, « 63 blocs en
      panne contre 62 à la référence »** ; faute retirée → **code 0**, page revenue à l'octet
      près (md5 `0e407483…`). Référence descendue à **62** par `--fixer`.

      **Mesure finale : 1 613 blocs avec bouton, 776 écartés, 1 535 aboutis (95,2 %), 35 par
      repli, 14 annoncées, 2 non concluants, 62 EN PANNE, 81 non compilables, 35 orphelins.**
      Aboutis **+8**, pannes **−8**, et **tous les autres compteurs inchangés à l'unité près** —
      aucun bloc vivant n'a été touché, aucun bouton n'a été retiré.

      **Non-régression** : `verif-html.js` **1 629 fichiers, 0 grave / 0 attention** ;
      `verif-donnees.js` **0 erreur sur 25 contrôles** (2 avertissements préexistants, I17 et
      I25) ; `verif-chaine-declaree.js` **code 0** ; `verif.js --rapide` **41 étapes, tout vert,
      132,7 s** ; `node --check` sur `verif-clic.js` ; 0 BOM, 0 CRLF, 0 URL vers un CDN.
      ⚠️ **`verif-donnees` I18 a rougi** dès la première passe — `search-index.js` périmé de
      141 octets, le contenu de cinq leçons ayant changé. C'est ce contrôle-là qui était vert à
      tort en septembre : cette fois il a parlé. Régénéré par
      `build-index.js --write --only=search,searchlite --fresh` (`search-lite.js` inchangé, non
      réécrit), I18 revenu vert.

      **Reste au gisement : 62.** Par cours : `js` 34, `projets-js` 11, `nodejs` 4, `algo` 3,
      `vue` 3, `typescript` 2, `cicd` 2, puis 1 pour `react`, `securite`, `graphql`, `wasm`,
      `offensive`. Le lot suivant est `js` 34, qui n'est PAS homogène : il mêle des fragments
      d'exercice, des démonstrations d'erreur volontaires que le détecteur de commentaire ne
      reconnaît pas (`js/lecon-02` #4 « Assignment to constant variable », `js/lecon-06` #13
      « Cannot access before initialization », les trois `throw` de `js/lecon-38`,
      `typescript/lecon-01` #1) et de vraies dépendances entre blocs. **À traiter en deux
      cases : d'abord les erreurs VOLONTAIRES mal classées, ensuite les fragments.**

      ⓘ **Observation portée par le nouveau drapeau, hors périmètre de cette case** : sur les 29
      blocs de ces cinq pages, **9 affichent « (aucune sortie — ajoute un console.log pour
      afficher un résultat) »**. Ils aboutissent, donc aucun cliquet ne les voit ; mais le clic
      est MUET. Le gisement complet n'a pas été mesuré à l'échelle du site.

- [x] **B2b-12 · Le vérificateur mesurait un `console` APPAUVRI : 11 méthodes contre 24 chez
      l'apprenant — 60 blocs en panne au lieu de 62, aboutis 1 535 → 1 537. Aucun fichier de
      contenu touché : ce point ne répare que l'instrument.**

      **Mesure reproduite avant de toucher à quoi que ce soit** : `verif-js.js --causes` rend
      **62 EN PANNE**, le chiffre laissé par B2b-11. Dans les causes, une ligne détonnait :
      `TypeError: console.assert is not a function`, sur `js/lecon-30` #7 et `js/lecon-43` #8.
      **`console.assert` n'est pas une fonction de Node absente du navigateur — c'est
      l'inverse.** Le Worker part du `console` NATIF et n'en remplace que cinq méthodes
      (`js/runner.js:482`) : il garde donc tout le reste. Le contexte `vm` de `verif-js.js`,
      lui, fournit un `console` écrit à la main, onze méthodes. **C'est exactement le défaut du
      point B2b-2 — « l'outil ne mesure pas le site, il mesure sa propre pauvreté » — sur un
      autre objet, et rien ne le surveillait.**

      **Relevé statique d'abord, parce qu'un grep coûte mille fois moins qu'une sonde** : les
      leçons appellent `console.log` 8 520 fois, `error` 94, **`assert` 16 (dont 7 en appel, le
      reste en prose)**, `warn` 12, `table` 5, `dir` 4, `time`/`timeEnd` 3, `group` 3,
      `groupEnd` 2. `assert` est la seule employée qui manquait.

      **LA LISTE A ÉTÉ MESURÉE DANS UN VRAI CHROME, PAS DEVINÉE** —
      `tools/preuves/sonde-console-worker.js`, qui **LIT `WORKER_SRC` et
      `envelopperPourRepli` dans `js/runner.js`**, écrit une page jetable créant le Worker par
      la mécanique exacte du moteur (Blob → `new Worker`), en `file://`, et lui demande
      l'inventaire. Verdict : **24 membres, tous des fonctions**, contre 11 dans le contexte —
      `assert, clear, context, count, countReset, createTask, dirxml, groupCollapsed, profile,
      profileEnd, timeLog, timeStamp, trace` manquaient. Les treize sont ajoutées, muettes, et
      **c'est FIDÈLE** : le Worker ne détourne pas ces méthodes-là, leur sortie part dans la
      console de DevTools et n'atteint jamais le panneau que l'apprenant lit. Douze ne sont
      employées par aucune leçon aujourd'hui, mais elles EXISTENT chez lui : les omettre, c'est
      armer le même faux positif pour la prochaine leçon qui s'en servira. **Aucune ne touche au
      réseau — la réserve de B2b-2 sur `fetch` et `WebSocket` ne s'applique pas ici.**

      ⚠️ **TROIS PIÈGES DE LA SONDE, tous mesurés, aucun supposé — et chacun aurait rendu un
      chiffre faux avec un air de mesure réussie :**

      | ce qui a été fait | ce que ça a rendu | pourquoi |
      |---|---|---|
      | `for (var k in console)` | **2 membres** au lieu de 24 | les méthodes natives sont des propriétés propres NON ÉNUMÉRABLES ; il faut `getOwnPropertyNames` |
      | chercher le marqueur dans tout le DOM | il lisait **sa propre source** | `--dump-dom` rend aussi le `<script>`, où le code envoyé au Worker figure en toutes lettres |
      | coller `WORKER_SRC` seul dans la page | « (en attente) » sans fin | il s'ouvre sur `envelopperPourRepli.toString()`, définie ailleurs dans `runner.js` |

      ⚠️⚠️ **ET LE PIÈGE LE PLUS COÛTEUX : LE BUDGET DE TEMPS VIRTUEL DÉPEND DE LA CHARGE DE LA
      MACHINE.** La sonde a rendu ses 24 membres, puis « NON MESURÉ : le Worker n'a rien
      renvoyé » à chaque relance, **sans qu'une ligne de la page ait changé** : 75 processus
      Chrome résiduels traînaient, et le Worker ne démarrait plus dans les 6 000 ms de
      `--virtual-time-budget`. Le MÊME fichier, relancé à 25 000, a rendu les 24 membres du
      premier coup. **Une sonde dont le verdict dépend de la charge est une sonde qui ment** —
      c'est le défaut du `timeout` de `vm` corrigé au point B2a, réapparu sur un autre
      instrument. Parade : deux essais (30 s puis 90 s), et le rapport **imprime le budget qui a
      suffi** (90 000 ms sur cette machine).

      ⚠️ **CE QUE LA SONDE NE PEUT PAS MESURER, et il fallait le savoir avant de l'écrire.** Un
      premier jet APPELAIT chaque méthode pour vérifier qu'elle ne jette pas. Bisection dans sa
      propre page, trois essais : `console.log("@@@simple")` revient ; `console.assert(true,"s")`
      puis un log ne revient pas ; `console.table([1])` puis un log non plus. Le point commun
      n'est pas la méthode, c'est qu'elle soit **NATIVE** : elle parle à l'agent d'inspection, ce
      qui suspend le temps virtuel sous `--dump-dom`. **Artefact de la technique, pas du site.**
      La sonde mesure donc la PRÉSENCE ; le FONCTIONNEMENT se prouve au clic.

      **Preuve par le navigateur, sur les deux blocs concernés**, `verif-clic.js --sorties`
      (l'outil écrit au point précédent), Chrome `file://` :

      | bloc | verdict de `verif-js.js` avant | ce que l'apprenant voit au clic |
      |---|---|---|
      | `js/lecon-43` #8 | `TypeError: console.assert is not a function` | `false` / `Symbol(couleur)` / `couleur` — les trois `console.log` de la leçon |
      | `js/lecon-30` #7 | idem | s'exécute sans erreur, sans sortie (l'`assert` passe, il est silencieux **par définition**) |

      **La sonde est une ÉTAPE DE LA CHAÎNE, et elle PEUT ROUGIR.** `verif-chaine-declaree.js`
      l'a d'ailleurs signalée « hors chaîne » avant qu'elle y soit, ce qui est son travail. Elle
      échoue quand une méthode présente chez l'apprenant manque au contexte **ET** qu'une leçon
      l'appelle — le seuil est l'EMPLOI, pas la simple absence, sinon elle rougirait sur douze
      méthodes que personne n'utilise. Éprouvée par injection : `assert` retirée du contexte →
      **« 1 absente, appelée par les leçons : 7 », code 1** ; remise → **« 0 absente », code 0**,
      md5 du fichier identique (`3b5433bc…`). Déclarée dans `verif.js --complet` sous le nom
      `console`, avec les preuves navigateur (elle ouvre Chrome, elle ne peut pas tenir ailleurs).

      **Mesure finale : 1 613 blocs avec bouton, 776 écartés, 1 537 aboutis (95,3 %), 35 par
      repli, 14 annoncées, 2 non concluants, 60 EN PANNE, 81 non compilables, 35 orphelins.**
      Pannes **−2**, aboutis **+2**, **tous les autres compteurs inchangés**. Cliquet descendu à
      **60**.

      **Non-régression** : `verif-donnees.js` **0 erreur sur 25 contrôles** ;
      `verif-chaine-declaree.js` **code 0, 80 outils dans un mode** ; `verif.js --rapide`
      **41 étapes, tout vert, 124,7 s** ; `node --check` sur les trois fichiers touchés ;
      **0 URL vers un CDN**. Aucun fichier de contenu modifié, donc `search-index.js` inchangé.

      **Reste au gisement : 60.** Le lot suivant reste celui de `js` (32), et le tri annoncé en
      B2b-11 tient : d'abord les erreurs VOLONTAIRES que le détecteur de commentaire ne
      reconnaît pas (`js/lecon-02` #4 et #16 « Assignment to constant variable », `js/lecon-06`
      #13 « Cannot access before initialization », les trois `throw` de `js/lecon-38`,
      `typescript/lecon-01` #1), ensuite les fragments.

- [x] **B2b-13 · L'erreur ANNONCÉE PAR SON NOM, et une troisième contrefaçon dans le contexte
      du vérificateur : 60 blocs en panne → 50, aboutis 1 537 → 1 538.**

      **Mesure reproduite avant de toucher à quoi que ce soit** (`node tools/verif-js.js --causes`) :
      1 613 blocs avec bouton, 776 écartés, **1 537 aboutis, 35 par repli, 14 annoncées, 2 non
      concluants, 60 EN PANNE, 81 non compilables, 35 orphelins** — les chiffres laissés par B2b-12,
      au bloc près. Le lot annoncé était celui des **erreurs VOLONTAIRES que le détecteur ne
      reconnaît pas** : il ne connaît que des mots français (`erreur`, `throw`, `échoue`…), or une
      leçon annonce l'erreur telle que l'apprenant la LIRA — `//=> TypeError: Assignment to constant
      variable.`

      ⚠️ **LA RÈGLE A ÉTÉ MESURÉE AVANT D'ÊTRE ÉCRITE, ET LA MESURE A CHANGÉ LA RÈGLE.**
      `tools/preuves/sonde-erreur-nommee.js` a passé les 60 blocs en panne au crible des deux
      formulations possibles, sans rien modifier : **7 blocs portent le nom de l'erreur ET le début
      de son message** dans un commentaire, **3 le nom seul**, 50 rien du tout. Le nom seul aurait
      donc paru suffisant — et c'est exactement là que se trouvait le piège.

      **`pages/js/lecon-64.html` #7 portait `// TypeError (circular)` et échouait sur « TypeError:
      Converting circular structure to JSON ».** Le nom concordait, l'annonce avait l'air juste, et
      c'était **un défaut de ce vérificateur, pas de la leçon** : son contexte fournissait
      `structuredClone: function (v) { return JSON.parse(JSON.stringify(v)); }` — l'exact CONTRAIRE
      de ce que la fonction fait, alors que le sujet de la leçon est précisément que le clonage
      structuré traverse les cycles et préserve `Date`, `Set` et `Map`. **Troisième occurrence du
      défaut des points B2b-2 et B2b-12** : l'outil ne mesurait pas le site, il mesurait sa propre
      pauvreté — cette fois sur une globale FABRIQUÉE, ce que le point B2b-4 mettait en garde de
      faire. La règle du nom seul l'aurait enterré ; l'exigence du message l'a laissé en panne, donc
      visible, donc corrigé.

      **Preuve par le navigateur, avant toute correction** (`verif-clic.js --sorties`, Chrome
      `file://`) : le bloc rend chez l'apprenant **5 lignes justes** — `JSON : TypeError`, puis
      `true`, `true`, `true`, `true`. Node fournit le vrai `structuredClone` depuis la v17 : il
      rejoint la liste des globales injectées, la contrefaçon disparaît. **Effet mesuré, isolé :
      exactement 1 bloc, 60 → 59 pannes, 1 537 → 1 538 aboutis, tous les autres compteurs
      inchangés** (diff des listes de pannes : une seule ligne).
      ⚠️ **Écart connu et assumé** : `structuredClone` de Node rend des objets de SON royaume, donc
      `copie.debut instanceof Date` vaut `false` dans le contexte `vm` là où le navigateur dit
      `true` (mesuré). Ce vérificateur juge la présence d'une ERREUR, pas la sortie ; et un
      polyfill maison serait, lui, une invention.

      **(b) La règle du nom, exigeante : 59 → 52 pannes, annoncées 14 → 21, aboutis INCHANGÉS.**
      Le nom de l'erreur levée doit figurer dans un COMMENTAIRE — un `throw new TypeError("…")` du
      corps n'est pas une annonce faite au lecteur — **et** ce commentaire doit contenir les trois
      premiers mots du message. Éprouvée par deux injections dans `js/lecon-02` #4, dont l'annonce
      dit `TypeError: Assignment to constant variable.` :
      `pi = variableFantome` → **KO, « ReferenceError: variableFantome is not defined »** (autre
      type) ; `null.x = 1` → **KO, « TypeError: Cannot set properties of null »** (même type, autre
      message). Remise en état : `ANN` de nouveau, md5 identique (`6f5f14c6…`).

      **(c) Les deux annonces INCOMPLÈTES, corrigées dans le contenu : 52 → 50.** Restaient
      `js/lecon-06` #10 (`//=> ReferenceError : message n'existe plus`) et `js/lecon-38` #8
      (`// TypeError` tout court). Ce ne sont pas des cas à contourner : la page annonçait bien
      l'erreur, mais pas telle que l'apprenant la lit. Le message exact a été **relevé au clic dans
      Chrome** puis recopié — `ReferenceError: message is not defined (le const ne vit que dans le
      bloc)` et `TypeError: total doit être un nombre >= 0`. Vérifié après coup sur les deux pages :
      **26 blocs sur 26 cliqués, 0 divergent**, et les deux sorties sont mot pour mot le commentaire.

      **Mesure finale : 1 613 blocs avec bouton, 776 écartés, 1 538 aboutis (95,4 %), 35 par repli,
      23 annoncées, 2 non concluants, 50 EN PANNE, 81 non compilables, 35 orphelins.** Écartés,
      non compilables et orphelins **inchangés** : aucun bouton n'a bougé. Cliquet descendu à **50**
      et éprouvé : `const zzz = fantomeAbsent();` injecté dans `algo/lecon-01` → **code 1**, « 51
      contre 50 à la référence » ; faute retirée → **code 0**, page revenue à l'octet près
      (`269ad551…`).

      **DEUX DETTES D'OUTILLAGE SOLDÉES EN CHEMIN, toutes deux trouvées en vérifiant, pas en
      cherchant.** (1) La contrefaçon de `structuredClone` était RECOPIÉE dans quatre sondes de
      `tools/preuves/` (`sonde-contexte-cumule`, `sonde-fragment-orphelin`,
      `sonde-heritage-navigateur`, `sonde-preambule-elargi`) : corrigée dans les quatre, sans quoi
      la prochaine mesure serait repartie du faux. (2) **`sonde-heritage-navigateur.js` MOURAIT
      avant sa dernière ligne**, et sa version du dépôt le fait aussi — donc ce n'est pas une
      régression du jour : un bloc qui `await fetch(…)` rejette une promesse que personne n'attend,
      Node tue le processus, et le `try/catch` autour de `runInContext` n'y peut rien puisque le
      rejet survient après le tour de boucle. Un instrument qui meurt en route rend une mesure
      PARTIELLE sous les traits d'une panne d'outil. `process.on('unhandledRejection', …)` ignoré,
      ce qui est aussi le comportement FIDÈLE (un Worker ne meurt pas sur un rejet non géré) :
      la sonde va maintenant jusqu'au bout, **code 0, 97 lignes**.
      ⚠️ **Question laissée ouverte, à ne pas oublier** : `verif-js.js` n'a pas ce garde-fou. Il
      survit aujourd'hui parce qu'aucun bloc à bouton ne déclenche de rejet non géré, mais le jour
      où l'un le fera, le vérificateur mourra au milieu de sa mesure au lieu de compter une panne.

      **Non-régression** : `verif-html.js` **1 629 fichiers, 0 problème** ; `verif-donnees.js`
      **0 erreur sur 25 contrôles** — il a d'abord rougi (`[I18]`, `search-index.js` publié
      4 262 188 o contre 4 262 196 o regénérés, **+8 o**, exactement les deux commentaires
      complétés), index régénéré par `build-index.js --write --only=search,searchlite`
      (`search-lite.js` inchangé) ; `verif-chaine-declaree.js` **code 0, 80 outils dans un mode** ;
      `verif.js --rapide` **41 étapes, tout vert, 125,5 s** ; `node --check` sur les 7 fichiers JS
      touchés ; **0 URL vers un CDN**.

      **Reste au gisement : 50.** Ce sont désormais presque tous des FRAGMENTS, et le lot le plus
      homogène est celui de `js/lecon-09` (**4 blocs sur le même `user`**), suivi de `taches` (3),
      `etatInitial` (3), `UnionFind` (2), `audioCtx` (2) : des noms qu'un bloc précédent DÉCLARE
      mais que ni le repli ni le ré-ancrage ne rendent visibles — c'est cette mécanique-là qu'il
      faut mesurer avant d'écrire quoi que ce soit, et non le contenu.

- [x] **B2b-14 · L'ÉLAGAGE PAR LE HAUT, dixième règle du repli : 8 blocs rendus vivants, ZÉRO
      perdu — 50 blocs en panne → 43, aboutis 1 538 → 1 546.**

      **Mesure reproduite d'abord** : 1 613 blocs avec bouton, 776 écartés, 1 538 aboutis, 35 par
      repli, 23 annoncées, 2 non concluants, **50 EN PANNE**, 81 non compilables, 35 orphelins —
      les chiffres laissés par B2b-13. `tools/preuves/sonde-repli-manque.js`, relancée sans rien
      modifier, range les 48 qui sont des « X is not defined » en trois familles : **APRÈS 0, TRI 10,
      AUTRE-ERR 15, INTROUVABLE 23**. Et dans
      les AUTRE-ERR, une même phrase revenait huit fois : **« Cannot access 'X' before
      initialization »**.

      **CE N'ÉTAIT PAS UN DÉFAUT DU CONTENU, C'ÉTAIT LE SYMÉTRIQUE DU POINT B2b-9.** Le
      ré-ancrage coupe la FIN du préfixe ; il manquait la coupe du DÉBUT. Cas d'école,
      `pages/js/lecon-09` : le bloc #3 LIT `user` sans le déclarer (son fournisseur est le #2), le
      #4 le REDÉCLARE. Pour le bloc #5, le tri garde le #4 — le plus proche — puis le #3, qui
      compile avec lui, mais écarte le #2, en collision avec le #4. Le préambule est donc
      **[#3, #4]** : à l'exécution, le #3 lit `user` AVANT la déclaration du #4, dans la même
      portée. `const` et `class` étant en zone morte temporelle, cela ne rend pas « user is not
      defined » — que `meriteUnRepli` reconnaît — mais « Cannot access 'user' before
      initialization », qu'il ne reconnaît pas. **Le repli s'arrêtait là, et l'apprenant lisait
      l'erreur d'origine.**

      `preambuleElague(prefixe, erreur)` retranche le DÉBUT du préfixe jusqu'au bloc qui déclare le
      nom en colonne zéro : aucun lecteur de ce nom ne le précède plus. Elle ne juge pas le texte,
      pas plus que les neuf autres règles, et sa terminaison vient de la décroissance STRICTE du
      préfixe — pas d'un compteur de tours. Écrite dans `js/runner.js`, elle est **LUE** par
      `verif-js.js`, jamais recopiée, et appelée dans le MÊME ORDRE que `lancerJs` (ré-ancrage
      d'abord, élagage ensuite) : deux exemplaires divergeraient, et le vérificateur mesurerait
      alors un moteur qui n'existe pas.

      **Effet mesuré : 50 → 43 pannes, 1 538 → 1 546 aboutis, replis 35 → 43.** Écartés (776), non
      compilables (81) et orphelins (35) **inchangés** — aucun bouton n'a bougé. Les 35 replis
      d'avant gardent tous exactement leur nombre de lignes : **aucun bloc qui aboutissait n'a
      changé de sortie**, ce qui était acquis d'avance puisque l'élagage ne se déclenche que
      lorsque le repli a DÉJÀ échoué.

      **PREUVE PAR LE NAVIGATEUR, ET ELLE NE S'ARRÊTE PAS À « ÇA NE PLANTE PLUS ».** Remplacer une
      erreur par une sortie FAUSSE serait pire que l'erreur. Les huit blocs ont donc été cliqués
      dans Chrome (`verif-clic.js --sorties`, `file://`) et comparés à ce que la leçon annonce en
      commentaire :

      | bloc | ce que la page annonce | ce que l'apprenant obtient maintenant |
      |---|---|---|
      | `js/lecon-09` #5 | `{ nom: "Sam", email: "a@b.fr" }` | `{"nom":"Sam","email":"a@b.fr"}` |
      | `js/lecon-09` #11 | `"?"` | `?` |
      | `js/lecon-09` #13 | `{ nom:"Sam", age:27 }` puis l'original intact | `{"nom":"Sam","age":27}` / `{"nom":"Sam","age":25}` |
      | `js/lecon-09` #15 | `nom : Sam` / `age : 25` | idem |
      | `js/lecon-09` #21 | `true` / `false` | idem |
      | `algo/lecon-17` #7 | `affiche: 3` | `3` |
      | `algo/lecon-17` #8 | `affiche: 19` | `19` |
      | `js/lecon-20` #12 | `"Réviser"` / `true` | `Réviser` / `true` |

      **Huit sur huit conformes.** Non-régression au clic sur les 23 pages qui contiennent un
      repli : **196 blocs attendus, 196 cliqués (couverture complète), 0 DIVERGENT**.

      ⚠️ **UN BLOC EST PASSÉ DE « ERREUR ANNONCÉE » À « ABOUTI », ET C'EST UNE CORRECTION, PAS UNE
      PERTE** — le compteur des annoncées descend de 23 à 22, ce qui a demandé vérification.
      `js/lecon-20` #12 était classé « annoncée » par le motif français, qui voyait « lève une
      Error » dans **une ligne mise en commentaire, donc jamais exécutée** ; l'erreur réelle était
      `prochainId is not defined`. Le bloc affiche maintenant sa vraie sortie. Le marqueur
      « ⚠ ERREUR ANNONCÉE ÉTEINTE » de `--causes` reste donc à lire comme un signal à examiner, pas
      comme un verdict : les 3 qu'il pointe aujourd'hui sont tous des annonces en ligne commentée.

      **Cliquet descendu à 43 et éprouvé** : `const zzz = fantomeAbsent();` injecté dans
      `algo/lecon-01` → **code 1**, « 44 contre 43 à la référence » ; faute retirée → **code 0**,
      page revenue à l'octet près (`269ad551…`). L'étiquette de `--causes` distingue désormais
      `[ré-ancré]` et `[élagué]`, sans quoi deux mécaniques différentes se lisaient pareil.

      **Non-régression** : `verif.js --rapide` **41 étapes, tout vert, 124,7 s** ; `node --check`
      sur `js/runner.js` et `tools/verif-js.js` ; **0 URL vers un CDN**. Aucun fichier de contenu
      modifié — seuls le moteur et son vérificateur ont bougé — donc `search-index.js` inchangé.

      **Reste au gisement : 43**, dont 23 INTROUVABLES (le nom manquant n'ouvre aucune ligne : il
      est lu dans le corps d'une fonction appelée par le bloc) et une douzaine d'AUTRE-ERR en
      cascade.

      ⚠️ **UNE TROISIÈME DETTE D'INSTRUMENT, TROUVÉE ET SOLDÉE EN CHEMIN.**
      `sonde-repli-manque.js` MOURAIT elle aussi avant sa dernière ligne, par une autre porte que
      celle du point B2b-13 : l'`EventTarget` de Node remet à `process.nextTick` l'exception d'un
      écouteur (`js/lecon-64` #1 appelle `miseAJourBadge`, qui n'existe pas), donc un
      `uncaughtException` et non un `unhandledRejection`, qu'aucun `try/catch` autour de
      `runInContext` ne peut intercepter. Les deux sont désormais ignorés — ce qu'un navigateur
      fait aussi — et la sonde va au bout : **code 0**.
      ⚠️ **ET ELLE EST À METTRE À JOUR** : elle recopie la boucle du repli au lieu de la lire, elle
      ne connaît donc pas l'élagage écrit ici. Ses chiffres se lisent maintenant comme l'état
      d'AVANT ce point — c'est exactement le défaut que `verif-js.js` évite en LISANT `runner.js`.

- [x] **B2b-15 · Le vérificateur nommait le MAUVAIS FICHIER dans 629 cas sur 1 987, et son
      instrument de préparation décrivait un autre moteur que le sien. Quatre écritures en
      double supprimées — 43 blocs en panne, inchangés, et c'est le résultat attendu.**

      **Mesure reproduite d'abord** : 1 613 blocs avec bouton, 776 écartés, 1 546 aboutis,
      43 par repli, 22 annoncées, 2 non concluants, **43 EN PANNE**, 81 non compilables,
      35 orphelins — les chiffres laissés par B2b-14, à l'unité près. Le gisement n'avait
      pas bougé, et ce point ne l'a pas fait bouger non plus : **il ne corrige aucun bloc,
      il corrige ce que les outils DISENT des blocs.** C'était le préalable, parce que le
      premier lot qu'on croyait tenir n'existait pas.

      ⚠️ **LE LOT QUE J'ALLAIS TRAITER ÉTAIT UNE ILLUSION D'ÉTIQUETTE.** Les causes
      annonçaient `pages/cicd/lecon-10.html #1 [.github/workflows/deploy.yml]` et `#2
      [solution.yml]`, `pages/typescript/lecon-19.html #1 [tsconfig.json]`,
      `pages/react/lecon-02.html #1 [App.jsx]` : un lot homogène et net — du YAML, du JSON
      et du JSX portant un bouton « Tester ». Vérification faite dans les pages, **aucun de
      ces fichiers n'a jamais porté de bouton** : ils sont en `language-yaml`,
      `language-json`, `language-jsx`. Le motif d'extraction de `verif-js.js` n'était pas
      BORNÉ par `</figure>` —
      `<figure class="code-block"([^>]*)>[\s\S]*?<code class="language-javascript">` — donc
      le `[\s\S]*?` traversait les figures : quand une figure non JavaScript en précédait
      une JavaScript, il prenait l'attribut de la PREMIÈRE et le code de la SECONDE. Les
      vrais blocs sont `un feature flag dans le code`, `solution.js`, `panier.js`,
      `compiled.js`. **Sans cette vérification, la passe entière partait corriger des
      fichiers qui n'ont pas de bouton.**

      **AMPLEUR MESURÉE AVANT DE TOUCHER À QUOI QUE CE SOIT, et c'est la mesure qui a permis
      de corriger sans rien risquer** : une sonde a comparé les deux motifs bloc à bloc sur
      les 1 629 leçons — **0 fichier au nombre de blocs différent, 0 bloc au CODE différent,
      629 blocs à l'ÉTIQUETTE différente** (`index.html`, `Terminal`, `structure.txt`,
      `styles.css`…). Aucun verdict n'a donc jamais été faussé : c'est le diagnostic, et lui
      seul, qui envoyait au mauvais endroit. La correction isole la figure d'abord et ne
      cherche le `<code>` qu'à l'intérieur ; relevé complet identique au caractère près sur
      les 308 lignes de `--causes`, sauf les étiquettes.

      **LE CONTRÔLE QUI EMPÊCHE QUE ÇA REVIENNE, et qui n'est pas une tautologie.**
      `tools/verif-etiquette-blocs.js` LIT `blocsJs` dans `verif-js.js` — jamais ne la
      recopie, même discipline que `verif-js.js` avec `runner.js` — puis refait
      l'appariement PAR UNE AUTRE VOIE : le fichier est découpé en figures, chacune jugée
      sur son seul contenu, si bien qu'aucune expression ne peut courir d'une figure à
      l'autre. Il ne teste pas une expression régulière, il teste une correspondance : tout
      motif redevenu glissant, quelle qu'en soit l'écriture, le fait rougir. **Éprouvé par
      injection** : l'ancien motif remis en place → **code 1, « 629 bloc(s) mal apparié(s) »** ;
      motif retiré → **code 0, 2 389 blocs sur 1 629 leçons**. Coût **0,64 s mesurés**, il
      entre donc dans le mode rapide (`js-etiq`), qui passe de 41 à 42 étapes.

      **TROIS AUTRES ÉCRITURES EN DOUBLE, TROUVÉES EN VOULANT SE SERVIR DE LA SONDE.**
      `sonde-repli-manque.js` est l'instrument qui range les blocs restants par cause ;
      B2b-14 laissait écrit qu'elle « recopie la boucle du repli au lieu de la lire ». En
      la rouvrant, ce n'était pas une copie mais **quatre** :

      | ce qui était écrit deux fois | l'état de la copie de la sonde |
      |---|---|
      | l'ordre ré-ancrage → élagage | **l'élagage manquait** (B2b-14 ignoré) |
      | le `console` du contexte | **11 méthodes** contre 24 mesurées (B2b-12) |
      | `structuredClone` | **la contrefaçon** `JSON.parse(JSON.stringify(v))` (B2b-13) |
      | l'erreur ANNONCÉE | **le motif français seul**, sans l'annonce par son NOM (B2b-13) |

      Autrement dit : chaque défaut soldé d'un côté depuis B2b-12 était resté entier de
      l'autre. Les trois derniers sont partis dans `tools/lib/contexte-worker.js`, requis
      par les deux outils ; l'ordre des deux réécritures est devenu `prochainPrefixe` dans
      `js/runner.js`, **lue** par les deux, comme les onze règles du bouton.

      ⚠️ **ET L'ORDRE ÉTAIT DÉJÀ ÉCRIT TROIS FOIS, PAS DEUX** : `lancerJs` le portait aussi,
      dans deux `if` successifs, et il divergeait déjà de `verif-js.js` sur un cas — quand le
      ré-ancrage rend un préfixe dont plus rien ne compile, le moteur ABANDONNE tandis que le
      vérificateur poursuivait sa boucle avec l'élagage. Mesuré : aucun bloc du site n'est
      dans ce cas aujourd'hui (43 pannes et **liste de replis identique ligne à ligne** avant
      et après). La divergence était donc dormante, pas active — elle est fermée.

      **Effet mesuré sur les chiffres : AUCUN, et c'est ce qu'on venait vérifier.**
      1 613 / 776 / 1 546 / 43 replis / 22 annoncées / 2 / **43 en panne** / 81 / 35 : tous
      identiques aux trois étapes (étiquette, boucle unifiée, contexte partagé), sortie de
      `--causes` **strictement identique** à la dernière étape. Un point d'instrument qui
      ferait bouger un compteur serait un point d'instrument qui casse quelque chose.

      **LES DEUX INSTRUMENTS CONCORDENT MAINTENANT BLOC POUR BLOC**, ce qui n'était pas le
      cas avant. Relevé neuf de la sonde : **APRÈS 0, TRI 10, AUTRE-ERR 8, INTROUVABLE 21**,
      soit 39 — et `verif-js.js` compte 43 pannes = 39 `ReferenceError` + 2 `SyntaxError:
      Illegal return statement` + 2 `TypeError`, que la sonde n'a pas à expliquer puisqu'elle
      ne traite que les noms manquants. L'ancien relevé (AUTRE-ERR 15, INTROUVABLE 23)
      décrivait l'état d'AVANT l'élagage, et comptait en panne `js/lecon-06` #9 et #10, deux
      blocs dont la page annonce l'erreur par son nom.

      **PREUVE PAR LE NAVIGATEUR — obligatoire ici, puisque `lancerJs` a été réécrit.** Les
      23 pages qui contiennent un repli, cliquées pour de vrai dans Chrome (`verif-clic.js`,
      `file://`) : **196 blocs attendus, 196 cliqués (couverture complète), 0 DIVERGENT,
      0 fragment en erreur**, en 418 s. Chiffres identiques à ceux de B2b-14 : la refonte
      des deux `if` en un seul appel ne change rien à ce que l'apprenant voit.

      **Non-régression** : `verif-html.js` **1 629 fichiers, 0 problème** ;
      `verif-donnees.js` **0 erreur sur 25 contrôles** (aucun fichier de contenu touché,
      donc `search-index.js` inchangé) ; `verif-chaine-declaree.js` **code 0, 81 outils dans
      un mode, 10 hors chaîne tous déclarés** ; `verif.js --rapide` **42 étapes, tout vert,
      152,5 s** ; `node --check` sur les 6 fichiers JS touchés ; **0 BOM** ; **0 URL vers un
      CDN** (les 6 occurrences textuelles de `fonts.gstatic.com` et `cdnjs` sont du contenu
      de leçon et un README, aucune n'est chargée — et aucun fichier de `pages/` ni de
      `starter/` n'a été modifié).

      **Reste au gisement : 43**, et la carte est maintenant fiable. **TRI 10** — le bloc
      source existe mais n'a pas de bouton (`bouton`, `form`, `q`, `grille`, `modeGomme`,
      `audioCtx` ×2, `quiz`, `DataLoader`, `memoire`) ; lui donner le préambule a déjà été
      mesuré puis refusé en B2b-9 (0 gain, 2 pertes). **AUTRE-ERR 8** — le repli passe puis
      bute sur un second nom, en cascade. **INTROUVABLE 21** — le nom n'ouvre aucune ligne
      de la page, il est lu dans le corps d'une fonction appelée par le bloc ; deux d'entre
      eux (`indexedDB`, `WebSocket`) sont des globales que le Worker POSSÈDE et que le
      contexte de mesure exclut délibérément depuis B2b-2, à rejuger au clic avant tout.


- [x] **B2b-16 · LA RÈGLE FONDATRICE DU SITE N'ÉTAIT PAS TENUE : quatre boutons « Tester »
      lançaient une VRAIE connexion sortante au clic. Mesuré à 8 connexions, ramené à 0, sans
      retirer un seul bouton — et le message d'erreur que l'apprenant lisait était `{}`.**

      **LE RELEVÉ DE LA PASSE PRÉCÉDENTE — conservé tel quel, car c'est lui qui a trouvé le
      gisement : 26 boutons « Tester » appellent `fetch`, et `verif-js.js` les compte tous
      ABOUTIS.** Il posait trois questions et laissait la case ouverte, au motif que le point
      n'était pas une correction mais un arbitrage, et qu'il débordait du gisement des 43. Les
      trois questions sont tranchées à la fin de ce compte rendu.

      **CE QUI EST MESURÉ, ET QUI EST SÛR.** Le point B2b-2 a délibérément laissé `fetch`,
      `WebSocket`, `XMLHttpRequest`, `indexedDB` et `caches` hors du contexte de mesure, au
      motif écrit qu'ils « exigent un serveur ou le réseau » et que les fournir ferait
      aboutir ici des blocs qui échouent chez l'apprenant. **Deux blocs cliqués pour de vrai
      dans Chrome** (`repli-navigateur.js`, `file://`, 0 requête distante) disent que ce
      motif est juste pour l'un et FAUX pour l'autre :

      | bloc | ce que `verif-js.js` en dit | ce que l'apprenant obtient au clic |
      |---|---|---|
      | `js/lecon-32` #6 (`indexedDB`) | EN PANNE | **« Acheter du pain »** — il marche |
      | `nodejs/lecon-17` #9 (`WebSocket`) | EN PANNE | **rien du tout, aucune erreur** |

      IndexedDB est du stockage LOCAL : il n'a besoin d'aucun serveur, il fonctionne en
      `file://`, et ce bloc écrit puis relit sa donnée. Le verdict « en panne » est donc
      faux — quatrième occurrence du défaut « l'outil mesure sa propre pauvreté » (B2b-2,
      B2b-12, B2b-13). Le WebSocket, lui, ne plante pas mais **ne tient pas sa promesse** :
      la page annonce « Connecté au chat », l'apprenant n'obtient pas une ligne.

      **ET LA SONDE A TROUVÉ AUTRE CHOSE, DE BIEN PLUS LARGE.**
      `tools/preuves/sonde-reseau-sans-serveur.js` compte, pour chaque nom, les blocs À
      BOUTON qui l'appellent et ceux qui ABOUTISSENT aujourd'hui :

      | nom | blocs à bouton | déjà en panne | **comptés vivants** |
      |---|---|---|---|
      | `fetch` | 26 | 0 | **26** |
      | `WebSocket` | 2 | 1 | **1** |
      | `indexedDB` | 1 | 1 | 0 |
      | `caches` | 1 | 0 | **1** |
      | `EventSource`, `XMLHttpRequest` | 0 | — | — |

      **Les 26 `fetch` ne sont pas comptés en panne parce que leur rejet est ASYNCHRONE** :
      le bloc définit une fonction `async`, l'appelle, et la promesse rejetée n'atteint
      jamais le `try/catch` du vérificateur. Ils sont donc verts sans avoir rien prouvé —
      et chez l'apprenant, ce sont **26 boutons qui tentent une requête distante** (`js`
      lecons 12/24/36/47/49/57/63, `projets-js` 13/14, `html/lecon-42`, `nodejs/lecon-20`,
      `wasm/lecon-03`). Sur un site dont la règle fondatrice est qu'aucune page ne parle au
      réseau, c'est la question la plus lourde du lot, et elle n'a jamais été posée.

      **CE QU'IL FAUT DÉCIDER AVANT D'ÉCRIRE UNE LIGNE**, et pourquoi je ne l'ai pas tranché
      seul dans cette passe :
      1. `indexedDB` : le bloc marche, le vérificateur ne sait pas l'exécuter (Node n'a pas
         d'IndexedDB, et en fabriquer un serait l'INVENTER — refusé au point B2b-4). Faut-il
         une catégorie « hors de portée de la mesure », hors cliquet et listée, ou faut-il
         accepter qu'un bloc juste reste compté faux ? Une catégorie qui sort du cliquet est
         aussi un endroit où l'on peut cacher de vraies pannes.
      2. `fetch` / `WebSocket` : un bouton qui lance une requête vers un serveur absent ne
         peut rien promettre. Le lui retirer est cohérent avec `estUnFragmentServeur` — mais
         **cela toucherait 27 blocs aujourd'hui comptés vivants**, dont des leçons entières
         (`js/lecon-24` en donne 10 à elle seule : c'est LA leçon sur `fetch`). Retirer le
         bouton de la leçon qui enseigne `fetch` est une décision de CONTENU, pas d'outil.
      3. Et d'abord, une mesure qui manque : ces 26 blocs **partent-ils vraiment sur le
         réseau au clic** ? `verif-clic.js` et `verif-rendu.js` comptent 0 requête distante
         sur leurs échantillons, mais aucun n'a visé ces 26 pages exprès. À faire AVANT tout
         arbitrage — si la requête ne part pas, la question change de nature.

      **L'INSTRUMENT EST PRÊT ET IL EST HONNÊTE.** ⚠️ **Il s'est arrêté en silence à son
      premier jet, et c'est la TROISIÈME sonde à qui cela arrive** (B2b-13, B2b-14). Cause
      double, l'une cachant l'autre : `prochainPrefixe` avait été lue **sans les trois
      fonctions qu'elle appelle** — une règle lue n'est pas forcément autonome, leçon
      nouvelle et à retenir du point B2b-15 — et un `uncaughtException` MUET avalait la
      `ReferenceError` qui en découlait. La boucle mourait au milieu de `nodejs/lecon-17`,
      sans message, **en code 0**. Corrigé, et deux garde-fous restent en place : toute
      exception non rattrapée est IMPRIMÉE, et la sonde sort en **3** tant que sa dernière
      ligne n'est pas atteinte. Elle est déclarée dans `tools/hors-chaine.json` avec ce
      qu'il faudrait pour l'y verser : un cliquet sur le nombre de blocs à bouton qui
      tentent une connexion — un chiffre qui, lui, pourra rougir.


      **LA MESURE QUI MANQUAIT, ET QUI CHANGE TOUT.** La question 3 ci-dessus — « ces blocs
      partent-ils vraiment sur le réseau au clic ? » — devait précéder tout arbitrage. Elle a
      demandé un instrument neuf, `tools/preuves/sonde-clic-reseau.js`, parce qu'aucun outil du
      dépôt ne savait y répondre : `verif-clic.js` et `verif-rendu.js` lisent
      `performance.getEntriesByType("resource")`, qui **n'enregistre pas une requête ÉCHOUÉE** et
      ne voit **rien de ce qui sort d'un Worker** — or c'est dans un Worker que le code de
      l'apprenant s'exécute. Leur « 0 requête distante » ne mesurait rien ici.

      La sonde ne dépend d'aucune API de la page. Chrome est lancé avec
      `--host-resolver-rules="MAP * 127.0.0.1:<port>,EXCLUDE localhost"`, si bien que **toute
      résolution de nom du processus atterrit sur un serveur TCP que la sonde ouvre elle-même** :
      chaque tentative est comptée, d'où qu'elle vienne, et rien ne sort de la machine. Les 27
      blocs sont cliqués un par un, le bruit de fond du navigateur est relevé avant le premier
      clic et retiré, et le nom visé est lu — `Host:` d'une requête en clair, ou l'extension
      `server_name` d'un ClientHello TLS.

      **RÉSULTAT, AVANT CORRECTION : 27 blocs cliqués, 4 APPELLENT LE RÉSEAU, 8 connexions
      sortantes tentées** — `exemple.api` ×6 (`js/lecon-24` #8, #9, #10) et `api.exemple.fr` ×2
      (`js/lecon-49` #12). Des noms qui n'existent pas : chez l'apprenant, ce sont autant de
      requêtes envoyées à un serveur DNS étranger depuis une page qui promet de n'en envoyer
      aucune. La réponse à la question 3 est donc **oui, pour 4 blocs sur 27**.

      **ET NON, POUR LES 23 AUTRES — POUR UNE RAISON QUI EN DIT LONG.** Ils ne partent nulle
      part parce qu'ils **DÉFINISSENT une fonction `async` sans jamais l'appeler**. Leur bouton
      est donc muet : la sonde imprime « RIEN À L'ÉCRAN » pour chacun, et `verif-js.js` les
      compte pourtant ABOUTIS. Ce n'est pas le sujet de ce point — c'est un gisement distinct,
      **23 boutons qui ne prouvent rien**, mesuré ici et à traiter ailleurs.

      **CE QUI A ÉTÉ DÉCIDÉ (question 2), ET POURQUOI.** Retirer le bouton des blocs `fetch`
      aurait touché 27 blocs vivants, dont `js/lecon-24` qui EST la leçon sur `fetch` : une
      décision de contenu, refusée. La correction est dans le MOTEUR et ne retire aucun bouton :
      `js/runner.js` expose désormais `apisHorsLigne()` — `fetch`, `XMLHttpRequest`, `WebSocket`
      et `EventSource` refusent **immédiatement, localement, avec une phrase** (« ce site
      fonctionne entièrement hors ligne, aucune requête n'est envoyée… »). Le `catch` que ces
      leçons écrivent justement pour la panne réseau s'exécute, et l'apprenant lit un message au
      lieu d'attendre un délai d'expiration.

      **MESURE APRÈS CORRECTION, MÊME SONDE, MÊMES 27 BLOCS : 0 bloc appelle le réseau,
      0 connexion sortante.** 8 → 0.

      **LE VÉRIFICATEUR MIS EN PHASE, SANS RECOPIE.** Le motif écrit en B2b-2 pour tenir `fetch`
      hors du contexte de mesure (« les fournir ferait aboutir ici des blocs qui échouent chez
      l'apprenant ») est devenu FAUX le jour où le moteur les a coupés : `fetch` existe
      maintenant chez l'apprenant. `tools/lib/contexte-worker.js` les fournit donc, mais en
      **lisant `apisHorsLigne` dans `js/runner.js`** — jamais en la recopiant, leçon du point
      B2b-15. `indexedDB` et `caches` restent absents : le moteur n'y touche pas, et en
      fabriquer un ici serait l'INVENTER (refusé en B2b-4). Effet mesuré sur le comptage :
      **aucun. 1 613 blocs à bouton, 1 546 aboutis (95,8 %), 43 en panne, avant comme après.**

      ⚠️ **ET LE MESSAGE SOIGNÉ ÉTAIT INVISIBLE : la sonde a montré `Erreur réseau : {}`.** Le
      formateur du Worker terminait par `JSON.stringify(v)` ; une `Error` n'ayant aucune
      propriété énumérable, **toute erreur affichée par une leçon se réduisait à `{}`** — sur la
      ligne la plus utile du panneau, celle qui explique une panne. Quatrième contrefaçon du
      moteur trouvée dans ce chantier, après `structuredClone` (B2b-13), le `console` appauvri
      (B2b-12) et le contexte nu (B2b-2). Corrigé par `formaterPourLaSortie`, isolée dans
      `runner.js`, injectée dans le Worker **et lue** par `contexte-worker.js`, qui en tenait une
      copie destinée à diverger. Vérifié au clic : `js/lecon-24` #8 affiche désormais
      « Erreur réseau : Error: fetch : ce site fonctionne entièrement hors ligne… ».

      ⚠️ **DEUX DÉFAUTS DE LA SONDE, TROUVÉS PAR LA SONDE.** Son premier jet lisait le SNI par
      expression régulière et rendait des noms FAUX (`accounts.google.comzz`,
      `www.google.comD`) : un nom faux traverse le filtre du bruit et se compte alors comme une
      requête de leçon — le ClientHello est maintenant décodé champ par champ. Et `wpad`, la
      découverte de proxy de Windows, était comptée comme une sortie de la page : c'est la pile
      réseau du système, elle est classée en bruit nommément. Sans ces deux corrections, la
      sonde annonçait **10 blocs « qui appellent le réseau » au lieu de 4**.

      **NON-RÉGRESSION, tout exécuté après la correction** : `verif-js` 1 613 / 1 546 / 43
      (cliquet vert), `verif-exemples --lang all` 0 divergent (693 conformes, 197 exercices
      exécutés), `verif-sorties` 449 blocs rejoués / 0 divergent, `verif-html` 0, `verif-donnees`
      0 erreur, 0 URL de CDN introduite.

      **LA QUESTION 1 TRANCHÉE : une catégorie « HORS DE PORTÉE DE LA MESURE », mais tenue par
      un cliquet d'ÉGALITÉ.** `js/lecon-32` #6 (`indexedDB`) marche chez l'apprenant — il écrit
      puis relit sa donnée et affiche « Acheter du pain », mesuré au clic — et restait compté en
      panne : Node n'a pas d'IndexedDB, et en fabriquer un serait l'INVENTER (refusé en B2b-4).
      Le relevé initial redoutait, à juste titre, qu'une catégorie hors cliquet devienne un
      endroit où cacher de vraies pannes. La réponse est le **quatrième cliquet de `verif-js.js`,
      et le seul qui interdise aussi la BAISSE** : son effectif doit valoir exactement celui de
      la référence. Les trois autres ne surveillent qu'un sens — c'est la leçon du cours mobile,
      « fermer un indice dans un seul sens laisse la faille entière ». Le critère ne peut pas
      déborder : il exige un `ReferenceError` portant EXACTEMENT `indexedDB` ou `caches`
      (vérifié : `ReferenceError: db is not defined` et `TypeError: indexedDB is not defined`
      ne passent pas), et les blocs sont NOMMÉS par `--causes`.

      **Effet mesuré : 1 bloc, celui-là même que le relevé désignait. Blocs en panne 43 → 42**,
      référence descendue. **Cliquet éprouvé dans les deux sens** : référence à 0 pour une mesure
      de 1 → code **1** ; référence à 2 pour une mesure de 1 → code **1** ; référence remise à 1
      → code **0**, « 42 blocs en panne, comme à la référence ».

      Le `WebSocket` de `nodejs/lecon-17` #3 est réglé du même coup : il n'ouvrait déjà aucune
      connexion sortante, et il affiche maintenant le message du refus au lieu de rien.

      **`verif-clic.js`, le seul outil qui clique vraiment, passé après tout cela** :
      **512 blocs cliqués sur 512 attendus, couverture complète, 0 divergent**, 995 s sur
      75 pages. Le renommage du formateur dans `WORKER_SRC` n'a rien cassé de ce que les pages
      annoncent.

      ⚠️ **ET LA CHAÎNE A TROUVÉ UN GARDE-FOU QUI NE POUVAIT PAS ROUGIR — dans l'heure qui a
      suivi.** `preuves/worker-src-compile.js` est le seul contrôle capable de dire que le code
      du Worker compile, puisque `node --check` n'y voit qu'une chaîne. Il montait ce code en ne
      fournissant que `envelopperPourRepli` — **la seule fonction que le tableau injectait le
      jour où il a été écrit** — et il est mort sur un `ReferenceError` dès la première nouveauté.
      Les noms sont désormais LUS dans le tableau lui-même, donc la liste ne peut plus se périmer.
      **L'épreuve par injection a trouvé pire** : en retirant `apisHorsLigne.toString()`, donc en
      privant le Worker de la coupure du réseau qu'on venait d'écrire, **le contrôle restait
      VERT** — il cherchait un NOM, et le nom figure toujours à la ligne qui l'APPELLE. La règle
      est maintenant DÉRIVÉE : toute fonction de `runner.js` que le Worker CITE doit y être
      DÉFINIE. Un premier jet n'exigeait qu'un appel `nom(` et restait vert en retirant
      `formaterPourLaSortie`, qui est prise comme VALEUR (`var fmt = …`), sans parenthèses.
      Éprouvé : **les trois injections sortent en 1, la référence en 0**, `runner.js` restauré à
      l'octet près.

      ⚠️ **UNE MESURE DE MA PART ÉTAIT FAUSSE, ET C'EST LE PIPE QUI MENTAIT.** `node
      tools/verif.js --rapide | tail -12` rend le code de sortie de `tail`, pas celui de la
      chaîne : j'ai lu « EXIT=0 » sur une passe qui portait une étape en échec. `verif.js` fait
      bien `process.exit(enEchec.length ? 1 : nonMesures.length ? 2 : 0)` — le défaut était dans
      ma façon de mesurer, pas dans le site. **Ne jamais lire `$?` derrière un pipe.**
      Chaîne rapide finale : **42 étapes, 144,4 s, tout vert, toutes mesurées.**

- [x] **B2b-17 · LA CARTE DES BLOCS QUI RESTENT, ET LE PREMIER DÉFAUT DE MOTEUR QU'ELLE A
      MONTRÉ : le préambule du repli gardait le bloc qui ENSEIGNE l'erreur et jetait celui
      qui FOURNIT le nom. 42 blocs en panne → 41, et un bloc de plus rendu vivant sans que
      le compteur ne bouge.**

      **Mesure reproduite avant de toucher à quoi que ce soit** : `node tools/verif-js.js
      --causes` rend **1 613 blocs à bouton, 42 en panne, 81 qui ne compilent pas, 35
      fragments orphelins** — le relevé du point précédent, à l'identique.

      **LA LISTE PAR CAUSE NE DIT PLUS RIEN, ET C'ÉTAIT LE VRAI BLOCAGE.** Les seize points
      précédents ont vidé les lots homogènes ; ce qui reste, ce sont **36 messages différents
      pour 42 blocs**, presque tous « X is not defined » avec un X chaque fois nouveau. Une
      case par lot n'a plus de lot où mordre. La bonne question n'est donc plus « quelle
      erreur ? » mais **« d'où viendrait le nom ? »** — et personne ne la posait.
      `tools/preuves/sonde-origine-du-nom.js` y répond en classant chaque bloc en panne selon
      l'endroit de la leçon où le nom manquant est écrit :

      | classe | ce que cela veut dire | effectif |
      |---|---|---|
      | **BOUTON-AVANT** | le nom EST déclaré dans un bloc à bouton antérieur — le repli aurait dû le fournir : **c'est le MOTEUR qui est en cause, pas le contenu** | 9 |
      | **MUET-AVANT** | déclaré dans un bloc antérieur SANS bouton : le préambule ne peut pas le donner, par construction | 10 |
      | **PLUS-BAS** | déclaré seulement APRÈS le bloc ; le repli ne remonte pas le temps | 1 |
      | **NULLE-PART** | aucune déclaration dans la page entière — un fragment orphelin que la règle de B2b-10 ne voit pas, parce qu'elle n'examine que les identifiants en TÊTE DE LIGNE | 17 |
      | **AUTRE** | l'erreur n'est pas un nom manquant (return illégal, `TypeError`…) | 5 |

      **PREMIER DÉFAUT TROUVÉ, ET IL ÉTAIT DANS L'ÉLAGAGE (B2b-14).** `pages/js/lecon-16` est
      le cas d'école : son bloc #2 **enseigne la zone morte temporelle** — il écrit
      `console.log(age);` PUIS `const age = 30;`. Mis en préambule, il rejoue cette erreur et
      fait tomber tout ce qui suit. L'élagage cherche le bloc qui DÉCLARE le nom et retranche
      ce qui est au-dessus ; ici le déclarant est le fautif lui-même, donc l'élagage le
      gardait, rejouait la même erreur, puis rendait `null` : **le repli abandonnait, et le
      bloc #4 restait en panne sur `creerCompteur`, un nom que le bloc #3 fournit pourtant.**
      Quand le déclarant est déjà en tête, il est maintenant retiré à son tour — un préambule
      est là pour FOURNIR des noms, jamais pour rejouer une démonstration d'erreur. La
      décroissance du préfixe reste stricte, donc la terminaison est acquise comme avant.
      **Mesure : 42 blocs en panne → 41.**

      **SECOND DÉFAUT : LE TRI JETAIT LE FOURNISSEUR.** `preambuleQuiCompile` part du bloc le
      plus PROCHE ; quand deux blocs entrent en collision, c'est le plus ANCIEN qui saute —
      or c'est parfois lui qui porte le nom manquant. Le ré-ancrage (B2b-9) répondait déjà à
      ce cas, mais **en TRONQUANT**, ce qui fait perdre tous les blocs situés après le
      fournisseur : sur `pages/projets-js/lecon-15`, il gardait le #1 et perdait les #2 et #4,
      pour échouer aussitôt sur le nom suivant. L'**ANCRAGE** (11ᵉ règle du repli) ne tronque
      rien : le nom sur lequel le repli vient d'échouer est mémorisé, et le bloc qui le déclare
      est désormais essayé EN PREMIER par le tri, donc gardé d'office ; c'est ce qui suit qui
      est écarté en cas de collision. Un nom n'est ancré qu'une fois — c'est cette mémoire, et
      non un compteur de tours, qui garantit la terminaison, puisque l'ancrage seul ne fait pas
      décroître le préfixe.

      ⚠️ **UN PREMIER JET RÉORDONNAIT LE PRÉAMBULE, ET C'ÉTAIT FAUX.** Pour que le tri voie le
      fournisseur en premier, il suffisait de le DÉPLACER en fin de préfixe — sauf qu'il
      s'exécutait alors APRÈS les blocs qui l'utilisent. Cela ne marche que pour les `function`,
      qui sont hissées, et casse tout `const` ou `class`. **Seule la priorité de CONSERVATION
      change ; l'ordre d'EXÉCUTION reste celui de la leçon.**

      **CE QUE L'ANCRAGE A RAPPORTÉ, SANS ARRONDIR : UN BLOC.** Le compteur des pannes n'a pas
      bougé (41 avant, 41 après) et il aurait été facile de présenter la règle comme un gain
      nul ou comme un grand gain ; ni l'un ni l'autre n'est vrai. Les blocs aboutis passent de
      **1 546 à 1 547**, et le bloc gagné est `projets-js/lecon-15` #6 — il était rangé parmi
      les « erreurs annoncées » **par un faux positif** (`ERREUR_ANNONCEE` reconnaît le mot
      « refuse », que ce bloc emploie pour dire qu'un demi-tour est interdit au serpent), donc
      soustrait au compteur des pannes tout en affichant `etatInitial is not defined` à
      l'apprenant. **Piste ouverte pour une case suivante : combien des 21 « erreurs annoncées »
      sont des faux positifs du même genre, c'est-à-dire de vraies pannes cachées ?**

      **PREUVE PAR LE NAVIGATEUR** — le vérificateur n'exécute pas `runner.js`, seul un vrai
      Chrome dit ce que l'apprenant voit. `repli-navigateur.js`, `file://`, trois blocs cliqués :
      `js/lecon-16` #4 affiche **1, 2, 1**, `projets-js/lecon-15` #6 affiche **{"x":1,"y":0}
      puis {"x":0,"y":-1}** — dans les deux cas exactement les sorties que la page annonce en
      commentaire — et `js/lecon-21` #3, qui passe par le nouveau chemin, rend toujours
      « Envoyer le devis (P2) ». **3 blocs rejoués, 0 erreur, 0 requête distante.**

      **CE QUI RESTE, ET POURQUOI JE NE LE FORCE PAS.** Les 8 BOUTON-AVANT restants ne sont
      **pas** un défaut de moteur : ils sont bloqués par une **redéclaration en cascade**.
      Mesuré sur `projets-js/lecon-15` : les blocs #1, #3 et #4 déclarent CHACUN `const jeu`,
      donc au plus un des trois peut entrer dans un préambule qui compile — `1+4` et `3+4`
      rendent tous deux `SyntaxError: Identifier 'jeu' has already been declared`. Or le bloc #5
      a besoin de `etatInitial` (#1) **et** de `estPerdu` (#4). **Aucune stratégie de tri ne
      peut satisfaire les deux** ; seule une réécriture du CONTENU le pourrait, et renommer la
      variable de démonstration de trois blocs pour gagner deux boutons est une décision de
      contenu, pas d'outil. Elle est laissée ouverte, chiffrée.

      **DETTE D'OUTILLAGE SOLDÉE AU PASSAGE.** Les règles du bouton étaient lues dans
      `js/runner.js` par `verif-js.js` **et par lui seul** : toute sonde voulant raisonner sur
      les mêmes blocs devait refaire la lecture chez elle — le défaut exact mesuré au point
      B2b-15, où deux copies du contexte du Worker rendaient deux verdicts sur les mêmes blocs.
      Elles sont désormais dans `tools/lib/regles-bouton.js`, lues une fois, partagées par le
      vérificateur et la sonde. Contrôle de neutralité : **1 613 / 776 / 43 / 22 / 42 / 81 / 35,
      chiffre pour chiffre identiques avant et après le déplacement.**

      ⚠️ **ET CE DÉPLACEMENT A CASSÉ UN AUTRE OUTIL, QUE LA CHAÎNE A ATTRAPÉ AU PREMIER
      PASSAGE.** `verif-etiquette-blocs.js` lisait `dec` et `blocsJs` **par découpage de texte
      dans `tools/verif-js.js`** ; les fonctions ayant changé de fichier, il est mort sur
      « dec introuvable dans tools/verif-js.js », en pleine chaîne rapide (étape `js-etiq`,
      SIGNALE). **Lire une fonction par son texte suppose qu'elle ne bouge jamais de fichier ;
      un `require` ne suppose rien.** Corrigé, et éprouvé par injection pour vérifier qu'il peut
      encore rougir après avoir changé de source : la borne `</figure>` retirée du motif partagé,
      il rend **321 fichiers en écart et sort en 1** ; motif restauré, **code 0** et fichier
      identique à l'octet près.

      **CLIQUET DESCENDU À 41 ET ÉPROUVÉ DEUX FOIS**, une injection par catégorie surveillée :
      `zzzNomQuiNExistePas(1);` (nom en tête de ligne) → **code 1**, « 36 fragments orphelins
      contre 35 » ; `console.log(zzzNomQuiNExistePas);` (nom au milieu d'une ligne, que la règle
      des orphelins ne voit pas) → **code 1**, « 42 blocs en panne contre 41 ». Fautes retirées,
      `pages/algo/lecon-01.html` revenu à l'octet près, cliquet vert à 41. La sonde est déclarée
      dans `tools/hors-chaine.json` avec ce qu'il faudrait pour l'y verser — un cliquet
      d'ÉGALITÉ sur l'effectif BOUTON-AVANT, le seul chiffre qui accuse le moteur — et
      `verif-chaine-declaree.js` l'avait signalée « non déclarée » avant que ce soit fait, ce
      qui est son travail.

      `verif-html.js` : **0**. `verif-donnees.js` : **aucune erreur d'invariant**. Chaîne
      rapide finale : **42 étapes, 134,4 s, tout vert, toutes mesurées.**

- [x] **B2b-18 · LA CATÉGORIE QUI ABSOLVAIT SANS REGARDER : « erreur annoncée » pardonnait
      N'IMPORTE QUELLE erreur dès qu'un commentaire, N'IMPORTE lequel, contenait le mot
      « erreur » ou « refuse ». Cinq blocs y dormaient, et un vrai Chrome les montre tous
      affichant une ligne rouge à l'apprenant. Le cliquet monte de 41 à 46 — ce n'est pas
      une régression, c'est la fin d'une dissimulation.**

      **La piste vient du point précédent**, qui avait trouvé le premier cas par hasard :
      `projets-js/lecon-15` #6 écrit « demi-tour interdit … refuse » pour décrire une règle
      du jeu de serpent, et se voyait pardonner un `etatInitial is not defined` sans aucun
      rapport. La question posée était : **combien des 21 « erreurs annoncées » sont du même
      genre, c'est-à-dire de vraies pannes cachées ?**

      **L'INSTRUMENT, ET CE QU'IL MESURE.** `tools/preuves/sonde-annonce-liee.js` demande, pour
      chaque bloc absous, si l'annonce parle bien de l'erreur OBTENUE. Le lien exigé est le
      plus simple qui soit vérifiable : quand l'erreur nomme un identifiant, un commentaire du
      bloc doit citer **ce nom**. Relevé sur les 21 :

      | | | |
      |---|---|---|
      | **LIÉE** | le commentaire cite le nom en cause | **5** — `interne`, `message`, `carre`, `age`, `ligne` |
      | **NON-LIÉE** | aucun commentaire ne cite le nom | **5** |
      | **SANS-NOM** | l'erreur ne nomme aucun identifiant (`throw` de la leçon, `Assignment to constant variable`) | **11** |

      **LES CINQ NON-LIÉES, ET CE QUE LEUR ANNONCE DISAIT VRAIMENT** — le décalage se voit à
      l'œil nu : `js/lecon-33` #5 échoue sur `form` et son commentaire parle d'un « message
      d'erreur personnalisé sur la confirmation » ; `js/lecon-63` #7 échoue sur `saisie` et
      annonce « le pattern Result : l'échec fait partie du retour » ; #11 échoue sur `champ`
      et annonce « échec attendu, traité localement » ; `js/lecon-65` #5 échoue sur
      `creerStore` et affiche une trace d'abonnés ; `nodejs/lecon-22` #2 échoue sur
      `UserSchema` et annonce « lève une ZodError si invalide ». **Aucune de ces cinq phrases
      ne parle de l'erreur que le bloc produit.**

      **PREUVE PAR LE NAVIGATEUR, ET ELLE EST SANS APPEL** (`repli-navigateur.js`, `file://`) :
      les 5 blocs cliqués dans un vrai Chrome rendent **5 lignes rouges — `form is not
      defined`, `saisie is not defined`, `champ is not defined`, `creerStore is not defined`,
      `UserSchema is not defined` — 0 rejoué, 0 sans erreur, 0 requête distante.** Le
      vérificateur les comptait verts ; l'apprenant lisait la panne.

      **LA RÈGLE DURCIE, ET CE QU'ELLE NE TOUCHE PAS.** `erreurAnnoncee` exige désormais, POUR
      LES SEULES ERREURS QUI NOMMENT UN IDENTIFIANT, que le nom figure dans un commentaire. Les
      erreurs qui ne nomment personne restent jugées comme avant : le critère n'a pas de prise
      sur elles, et prétendre le contraire aurait fait basculer 11 blocs sans preuve. Mesure
      après durcissement : **annoncées 21 → 16, EN PANNE 41 → 46, aboutis 1 547 → 1 548.**

      ⚠️ **LE CLIQUET MONTE, ET IL FALLAIT L'ÉCRIRE PLUTÔT QUE DE L'ÉVITER.** La règle du
      chantier est qu'un cliquet ne monte pas ; ici, les 5 blocs n'étaient pas verts, ils
      étaient CACHÉS — la hausse de 41 à 46 est exactement l'effectif prouvé par Chrome, ni un
      de plus ni un de moins, et les 41 précédents sont tous encore là. Choisir de rester à 41
      en gardant la catégorie fourre-tout aurait été le seul vrai mensonge.

      **ET LE TROU EST FERMÉ POUR DE BON : cinquième cliquet, second à exiger l'ÉGALITÉ.**
      « Erreur annoncée » est, avec « hors de portée » (B2b-16), l'autre catégorie qui RETIRE un
      bloc du verdict ; elle reçoit donc la même garde, pour la raison mesurée ici même. Son
      effectif (16) ne peut plus bouger sans décision. **Éprouvé dans les DEUX sens** — c'est la
      leçon du cours mobile, un cliquet qui ne surveille qu'un sens laisse la faille entière :
      durcissement retiré → **21 contre 16, code 1** ; commentaire « erreur volontaire : phrase »
      ajouté à `js/lecon-27` → **17 contre 16, code 1** ; les deux fichiers restaurés, référence
      revenue à 16/46. Stabilité vérifiée avant de poser la garde (piège B1e, le cliquet qui
      rougit au hasard) : **deux relevés consécutifs rendent 16 et 46, à l'identique.**

      La sonde est déclarée dans `tools/hors-chaine.json` : son compte NON-LIÉE vaut désormais 0
      **par construction**, donc la brancher ajouterait une étape incapable de rien trouver. Ce
      qu'elle garde à juger, et qui reste ouvert : **les 11 SANS-NOM, dont l'annonce n'est reliée
      à l'erreur par aucun critère à ce jour.**

      `verif-chaine-declaree.js` : **OK, 13 hors chaîne, 13 déclarés**. Chaîne rapide finale :
      **42 étapes, 122,7 s, tout vert, toutes mesurées.**


- [x] **B2b-19 · LE MÊME CODE, DEUX VERDICTS OPPOSÉS DANS LA MÊME LEÇON : les deux blocs
      WebSocket de `nodejs/lecon-17` affichent à l'apprenant exactement la même phrase, l'un
      était ABSOUS et l'autre compté EN PANNE. Les 11 « SANS-NOM » jugées une à une, une
      troisième catégorie créée pour ce que le moteur DÉCIDE, et l'autre moitié du blanc-seing
      fermée. 46 blocs en panne → 45, erreurs annoncées 16 → 15, refus hors ligne = 2.**

      **Mesure reproduite avant de toucher à quoi que ce soit** : `node tools/verif-js.js
      --causes` rend **1 613 blocs à bouton, 1 548 aboutis, 46 en panne, 16 annoncées, 1 hors
      de portée, 81 qui ne compilent pas, 35 fragments orphelins** — le relevé du point
      précédent, à l'identique.

      **LA PISTE VENAIT DU POINT B2b-18, QUI L'AVAIT LAISSÉE ÉCRITE.** Le durcissement de
      « erreur annoncée » n'avait porté que sur les erreurs qui NOMMENT un identifiant ; pour
      les onze autres — `TypeError`, `RangeError`, `throw` d'une chaîne — le critère rendait
      `true`, c'est-à-dire **absolvait sans regarder**. C'était la moitié du blanc-seing, et
      elle était restée ouverte faute de critère. Les onze ont été jugées une par une :

      | classe | le lien exigé | effectif |
      |---|---|---|
      | **CITÉE** | un commentaire écrit le nom de l'erreur ET le début de son message (règle B2b-13) | **9** |
      | **JETÉE** | le message est un littéral que le bloc lève lui-même (`throw`) | **1** |
      | **REFUS HORS LIGNE** | le message est celui que `js/runner.js` oppose au réseau | **1** |
      | **NON LIÉE** | rien de tout cela | **0** |

      Neuf annonces sur onze étaient donc parfaitement liées, et le dixième l'est aussi :
      `js/lecon-63` #1 écrit `throw 'utilisateur introuvable'` et l'apprenant lit
      « utilisateur introuvable » — la démonstration EST le `throw`, il n'y a rien à réparer.
      **Contrairement au point précédent, ce n'était donc pas un gisement de pannes cachées,
      et le dire est le résultat.** Le onzième, lui, n'a rien à voir avec une annonce.

      **LE ONZIÈME, ET C'EST LUI LE DÉFAUT : LE MÊME CODE JUGÉ DEUX FOIS EN SENS CONTRAIRE.**
      `pages/nodejs/lecon-17.html` #3 et #9 ouvrent tous deux `new WebSocket('ws://localhost:3000')`
      et posent les mêmes gestionnaires. Le #3 était **absous** — son commentaire dit « onerror :
      une erreur est survenue sur la connexion », et le mot « erreur » suffisait au motif
      français — pendant que le #9, qui n'emploie pas le mot, était compté **EN PANNE**. Aucun
      des deux verdicts n'est juste : le contenu n'a aucun défaut, et rien n'est annoncé. Depuis
      le point B2b-16, `js/runner.js` REFUSE le réseau immédiatement et l'explique ; ce refus est
      un **comportement décidé du site**, ni une panne du contenu, ni la leçon.

      **PREUVE PAR LE NAVIGATEUR, ET ELLE TRANCHE** (`repli-navigateur.js`, `file://`, un vrai
      Chrome — le vérificateur n'exécute pas `runner.js`) : les deux blocs cliqués affichent
      **le même message, mot pour mot** — « WebSocket : ce site fonctionne entièrement hors
      ligne, aucune requête n'est envoyée… ». Le troisième bloc cliqué, `js/lecon-63` #1, rend
      **« utilisateur introuvable »**, exactement le message que son propre `throw` lève.
      **3 blocs cliqués, 0 requête distante.**

      **CE QUI A ÉTÉ FAIT, EN DEUX PARTIES.**
      **(a) Une troisième catégorie, et un sixième cliquet.** `estRefusHorsLigne` reconnaît le
      refus du moteur — et la phrase est **LUE dans `js/runner.js`** en appelant l'API refusante,
      jamais recopiée : si le moteur change son texte, le critère le suit ; s'il cesse de
      refuser, il ne reconnaît plus rien. Le vérificateur la teste **avant** « erreur annoncée »,
      c'est-à-dire exactement là où le blanc-seing tranchait. C'est la troisième catégorie qui
      RETIRE un bloc du verdict, après « hors de portée » (B2b-16) et « erreur annoncée »
      (B2b-18) : elle reçoit donc la même garde, **un cliquet d'ÉGALITÉ**, pour la raison
      mesurée ici même — une catégorie hors verdict est un endroit où cacher une panne.
      **(b) L'autre moitié du blanc-seing fermée.** Pour une erreur qui ne nomme personne,
      l'absolution exige désormais un lien : le message cité en commentaire, ou **jeté par le
      bloc lui-même** (`throw` présent et message littéral d'au moins 8 caractères, pour écarter
      les coïncidences courtes). Plus aucun mot de vocabulaire ne pardonne à lui seul.

      **MESURE FINALE : annoncées 16 → 15, EN PANNE 46 → 45, refus hors ligne 2, aboutis 1 548
      inchangés.** Stabilité vérifiée avant de poser les gardes (piège B1e, le cliquet qui rougit
      au hasard) : **deux relevés consécutifs rendent 45 / 15 / 2 / 81 / 35, chiffre pour
      chiffre.**

      ⚠️ **CE QUE LE DURCISSEMENT (b) A RAPPORTÉ SUR LE CORPUS D'AUJOURD'HUI : RIEN, ET IL FAUT
      L'ÉCRIRE.** Son seul candidat était le bloc WebSocket, que la catégorie (a) capte en amont.
      Sa valeur est donc entièrement préventive — mais elle est **mesurée, pas supposée** :
      un commentaire « erreur volontaire pour la demonstration » ajouté en tête de
      `typescript/lecon-19` #1, dont l'erreur est `TypeError: articles.reduce is not a function`,
      **laisse le bloc EN PANNE (45, code 0)** ; la même injection avec l'ancienne règle rétablie
      le fait basculer en « annoncée » — **16 annoncées et 44 pannes, code 1**. Une vraie panne
      s'achetait donc au prix d'un commentaire, dans toute la famille des erreurs qui ne nomment
      personne. Fichiers restaurés à l'octet près.

      **LE SIXIÈME CLIQUET ÉPROUVÉ DANS LES DEUX SENS** — c'est la leçon du cours mobile, un
      cliquet qui ne surveille qu'un sens laisse la faille entière : `new WebSocket(…)` injecté
      en tête d'`algo/lecon-01` → **3 refus contre 2 à la référence, code 1** ; le WebSocket de
      `nodejs/lecon-17` #3 remplacé par un objet muet → **1 contre 2, code 1**. Les deux pages
      restaurées, `git status` vide, référence revenue à **45 / 15 / 2**.

      **DETTE D'OUTILLAGE.** `sonde-annonce-liee.js` juge maintenant les quatre classes et
      son entrée de `tools/hors-chaine.json` est refaite : ses comptes NON-LIÉE **et**
      NON-LIÉE-SANS-NOM valent 0 par construction, la brancher ajouterait une étape incapable de
      rien trouver. Ce qui reste à juger, et qui reste ouvert : **la QUALITÉ de l'annonce** —
      neuf blocs citent le bon message, mais aucun outil ne dit si la phrase écrite au lecteur
      décrit vraiment ce qu'il va lire.

      `verif-chaine-declaree.js` : **OK, 13 hors chaîne, 13 déclarés**. `verif-html.js` : **0**.
      `verif-donnees.js` : **25 contrôles, 0 erreur d'invariant**. Chaîne rapide finale :
      **42 étapes, 119,3 s, tout vert, toutes mesurées.**

- [x] **B2b-20 · Les 45 blocs qui restent, et pourquoi le lot le plus gros NE PEUT PAS être
      fermé par une règle du bouton. Mesure de réfutation faite, chiffrée, avant d'écrire
      quoi que ce soit.** — COCHÉ le 2026-09-10 (point B2b-25) : le point était laissé
      ouvert parce que ses 19 blocs NULLE-PART dépassaient une passe. Ils ont été repris
      leçon par leçon en B2b-21 (11 blocs), B2b-22 (6 sur 8, les 2 derniers refusés pour une
      raison écrite) et la carte de `sonde-origine-du-nom.js` rend aujourd'hui
      **NULLE-PART : 2**, exactement ces deux refus. La conclusion du point — aucune règle
      du bouton ne peut reconnaître une variable LIBRE sans analyse syntaxique — n'a pas
      bougé d'un chiffre.

      **La carte, refaite après B2b-19** (`node tools/preuves/sonde-origine-du-nom.js`, qui
      examine bien **45** blocs — le même chiffre que le vérificateur, la divergence à 47
      ayant été soldée en même temps que la sonde apprenait la catégorie « refus hors ligne ») :
      **BOUTON-AVANT 8 · MUET-AVANT 13 · PLUS-BAS 1 · NULLE-PART 19 · AUTRE 4.**

      **LE LOT VISÉ ÉTAIT « NULLE-PART » (19), ET L'IDÉE ÉTAIT NATURELLE.** Ces blocs échouent
      sur un nom que **rien dans la page** ne fournit (`taches`, `phrase`, `produits`, `saisie`,
      `React`, `req`, `flags`, `defineStore`…). La règle du fragment orphelin (B2b-10) ne les
      voit pas parce qu'elle n'examine que les identifiants **en tête de ligne** ; il « suffisait »
      donc de l'élargir aux noms lus ailleurs — `console.log(pourcentageFait(taches))`,
      `if (/chat/.test(phrase))`, `new URL(req.url, …)`.

      ⚠️ **LA MESURE RÉFUTE L'IDÉE, ET SANS APPEL.** Trois variantes du critère élargi ont été
      appliquées aux 1 613 blocs à bouton, le statut de chaque bloc étant **demandé au
      vérificateur** plutôt que recalculé (aucune logique dupliquée) :

      | critère | blocs visés | dont **VIVANTS** |
      |---|---|---|
      | tous les identifiants lus du bloc | 1 156 | **1 110** |
      | idem, restreint à la profondeur 0 d'accolades | 965 | **928** |
      | idem, listes de paramètres et `catch` neutralisés | 311 | **284** |

      Le meilleur des trois emporterait encore **284 blocs vivants** pour en gagner 21. La
      raison est structurelle : reconnaître une variable LIBRE demande de connaître les
      LIAISONS (paramètres de fonctions fléchées imbriquées, méthodes abrégées,
      déstructurations, `for…of`, `catch`), c'est-à-dire une analyse syntaxique — et une règle
      du bouton est jouée par `runner.js` **sans rien exécuter**. La prudence de la règle
      B2b-10, qui se limite à la tête de ligne, n'était donc pas de la timidité : c'est la
      seule position où une regex ne se trompe pas. **Aucune règle n'a été écrite ; c'est le
      résultat du point.**

      **CE QU'IL FAUDRAIT DÉCIDER, ET QUI N'EST PAS UNE DÉCISION D'OUTIL.** Il reste deux
      issues pour ces 19 blocs, toutes deux dans le CONTENU :
      (1) **compléter le fragment** — trois lignes qui fournissent la donnée d'exemple
      (`const taches = [ … ]`), après quoi le clic rend un vrai résultat au lieu d'une erreur.
      C'est la voie de B2b-11, la plus utile à l'apprenant, mais chaque bloc demande de lire la
      leçon, d'écrire la donnée et de **vérifier la sortie par exécution**, commentaire annoncé
      compris ;
      (2) pour ceux dont le nom manquant est du DOM (`champ`, `surlignerChamp` dans
      `js/lecon-63`), il n'y a rien à fournir dans un Worker : c'est `BROWSER_ONLY` ou une
      réécriture sans DOM.
      Le lot est laissé **décoché** parce qu'il dépasse une passe : 19 blocs à traiter un par
      un dans le contenu, chacun avec sa preuve d'exécution. Le découper par leçon
      (`js/lecon-27` 2, `js/lecon-28` 2, `js/lecon-63` 3, `js/lecon-65` 1, `vue` 3…) est la
      façon dont il faut le reprendre.

- [x] **B2b-21 · Le lot NULLE-PART traité DANS LE CONTENU, cours par cours : les 11 blocs du
      cours `js` — 45 blocs en panne → 34, aboutis 1 548 → 1 559, et ZÉRO bouton perdu.**

      **Reprise de B2b-20 par sa propre conclusion.** Ce point n'écrit aucune règle : il applique
      la voie (1) que la mesure de réfutation avait laissée seule ouverte — compléter le fragment
      dans le contenu, leçon par leçon. Découpage retenu : **le cours `js`**, soit 11 des 19 blocs
      NULLE-PART. Mesure d'entrée reproduite avant de toucher quoi que ce soit
      (`node tools/verif-js.js --causes`) : **1 613 blocs à bouton, 1 548 aboutis, 45 EN PANNE**,
      et la carte de `sonde-origine-du-nom.js` rend bien **NULLE-PART 19**, comme écrit au point
      précédent.

      **Les 11 blocs, et ce que le nom manquant demandait.** `js/lecon-14` #12 (`taches`),
      `lecon-27` #2 (`phrase`) et #7 (`chat`), `lecon-28` #8 et #9 (`taches`), `lecon-36` #5
      (`rendreListe`), `lecon-39` #5 (`produits`, `afficher`), `lecon-63` #7 (`saisie`), #8
      (`surlignerChamp`) et #11 (`champ`), `lecon-65` #4 (`etatInitial`, `bus`). Deux cas sortent
      du lot commun : **`lecon-27` #7 n'était pas du code** — `/chat/i` ⏎ `/chat/g` ⏎ `/chat/gi`
      se reparse en DIVISIONS par insertion automatique de point-virgule, d'où le
      `chat is not defined` ; il fallait nommer les trois motifs. Et **`lecon-28` #9 n'a rien
      demandé du tout** : la donnée déclarée dans le #8 lui suffit **par le REPLI** (45 → 46
      blocs qui n'aboutissent que derrière leurs prédécesseurs). Un bloc complété en a donc
      réparé deux.

      **Preuve par le navigateur, jamais par le calcul de tête.** `verif-clic.js --sorties`,
      Chrome `file://`, réseau non sollicité : **63 blocs cliqués sur 63 attendus**, couverture
      complète, **0 divergent** ; puis 29 reclics après la seconde vague de corrections, même
      verdict. Sorties relevées : `33 %` puis `0 %` (la garde de division par zéro, que la légende
      de `lecon-14` déclare « essentielle » et que le bloc ne montrait jamais) ;
      `["courses","maison","urgent"]` ; `Erreur affichée : Âge invalide` **puis**
      `Enregistré : 37` ; `notifié : {"cle":"nom","valeur":"Ada"}`, puis `Refus : nom = undefined
      ignoré`, puis `etat.nom = Ada`. **Chaque commentaire annoncé a été réécrit sur la sortie
      mesurée, pas l'inverse.**

      ⚠️ **LA RÉGRESSION QUE J'AI MOI-MÊME INTRODUITE, ET QUE SEULE LA MESURE A VUE.** Pour dire
      qu'un objet simulé remplace un élément de page, j'avais écrit en commentaire
      `// dans une vraie page, saisie = document.querySelector('#age')`. `BROWSER_ONLY`
      (`js/runner.js:356`) cherche `document` **n'importe où dans le texte du bloc, commentaires
      compris** : les deux blocs ont perdu leur bouton. Le chiffre qui l'a trahi : le cours `js`
      passait de **549 à 547 blocs à bouton et de 526 à 524 aboutis, pannes inchangées à 10** —
      un compteur d'aboutis qui BAISSE sans qu'aucune panne apparaisse. Commentaire reformulé
      (`serait le champ &lt;input id="age"&gt;`, chevrons échappés, `verif-html.js` le vérifie) :
      1 613 / 1 559 / 34, et **81 non compilables + 35 orphelins strictement inchangés**.
      La leçon vaut au-delà de ce point : **un mot écrit dans un commentaire retire un bouton.**

      **CONTRADICTION ADVERSARIALE (4 agents, 371 082 jetons, 157 appels d'outil), et ce
      qu'elle a rendu.** Chaque agent devait DÉMOLIR un lot de leçons en exécutant, pas en
      jugeant. **15 fautes retenues et corrigées**, dont : `lecon-27` #7 avait perdu les `//=>`
      qui sont la convention de la page (28 occurrences ailleurs dans le même fichier) ; le nom
      `casse` désignait l'inverse du drapeau `i` → `sansCasse` ; `const partout = /chat/g` était
      le premier motif `g` **nommé** de la leçon, donc une invitation au piège du `lastIndex`
      que la leçon ne couvre nulle part (mesuré : quatre `.test()` de suite rendent
      `true, true, true, false`) → ligne d'avertissement ajoutée ; `lecon-28` déclarait la fuite
      `faite: true` alors qu'une autre tâche disait d'appeler le plombier ; `lecon-36` ne
      rappelait jamais son `stop()`, si bien que la « fonction de désabonnement » que le
      paragraphe suivant dit **indispensable** n'était pas démontrée ; `lecon-63` #11 n'exécutait
      qu'UNE branche là où son propre énoncé exige « les deux branches d'utilisation ».

      **Une faute HORS LOT, trouvée par la même passe, et corrigée :** l'antisèche de
      `js/lecon-39` annonçait `NumberFormat {style:"percent"}` → `24,6 %`. Exécuté :
      `new Intl.NumberFormat('fr-FR', { style: 'percent' }).format(0.246)` rend **`"25 %"`**,
      car `maximumFractionDigits` vaut **0** par défaut pour le style `percent`. Le corps de la
      leçon, lui, était juste (il passe `minimumFractionDigits: 1`) : c'est la cellule
      « constructeur » de l'antisèche qui, tronquée, rendait fausse la cellule « résultat ».
      L'apprenant qui recopiait l'antisèche obtenait `25 %`.

      ⚠️ **UN ANGLE MORT DU REPLI, MESURÉ ICI ET LAISSÉ OUVERT.** `js/lecon-65` #5 et #6 restent
      en `ReferenceError: creerStore is not defined` (catégorie MUET-AVANT, hors de ce lot) pour
      une raison qui n'est PAS l'absence du nom : `creerStore` est déclaré deux fois dans la page,
      mais les deux fois par `export function creerStore(…)`. Or `preambuleQuiCompile`
      (`js/runner.js:427`) valide le préambule par `new Function(…)`, et `new Function("export …")`
      lève une `SyntaxError` : les deux blocs déclarants sont écartés, le préambule ressort vide.
      **Tout nom fourni uniquement par un bloc `export` est hors d'atteinte du repli** — c'est
      une famille, pas un cas. Deux issues, non chiffrées ici : rendre les blocs autonomes leçon
      par leçon, ou faire tomber le `export` de tête dans `preambuleQuiCompile`. La seconde touche
      une règle du bouton : elle exige la mesure « combien de vivants » avant d'être écrite.

      **Chaîne rejouée après coup** : `verif-html.js` 1 629 fichiers, 0 grave 0 remarque ;
      `verif-donnees.js` 25 contrôles, 0 erreur (index régénérés avec `--write --fresh`, sans
      quoi l'antisèche corrigée laissait une entrée périmée) ; `verif-sorties.js` 449 blocs
      identiques au caractère près, 0 divergent ; `verif-exemples.js --lang all` 0 divergent ;
      `verif.js --rapide` **42 étapes, tout vert, 117,9 s**. Cliquet descendu à **34**.

      **Reste du lot NULLE-PART : 8 blocs, tous hors du cours `js`** — `react/lecon-02` #1
      (`React`), `nodejs/lecon-10` #3 (`req`), `nodejs/lecon-22` #5 (`z`), `securite/lecon-01` #2
      (`requete`), `cicd/lecon-10` #1 (`flags`), `vue/lecon-06` #1 et #2 et `vue/lecon-10` #8
      (`Accueil`, `defineStore`). Même méthode, un cours par passe.

- [x] **B2b-22 · Le reste du lot NULLE-PART, dans cinq autres cours : 6 blocs sur 8 fermés,
      les 2 derniers refusés POUR UNE RAISON — 34 blocs en panne → 27, aboutis 1 559 → 1 566.**

      **Le lot NULLE-PART est un lot de NATURES DIFFÉRENTES, et c'est ce que la passe a appris.**
      Dans le cours `js` (B2b-21), les 11 blocs manquaient d'une DONNÉE. Ici, les 8 restants
      manquent d'une BIBLIOTHÈQUE : `React`, `req`, `requete`, `flags`, `Accueil`, `defineStore`,
      `z`. La question n'est donc plus « quelle donnée fournir » mais « **a-t-on le droit de
      simuler cette bibliothèque ?** » — et la réponse n'est pas la même partout.

      **Les 6 blocs fermés, et pourquoi la simulation y est légitime.**
      · `react/lecon-02` #1 : la leçon écrit noir sur blanc, deux lignes plus bas, que « le JSX
      produit des objets JavaScript ordinaires ». Une `React.createElement` de trois lignes ne
      trahit rien — elle DÉMONTRE la phrase. Cliqué : `{"type":"h1","props":{"className":"titre",
      "children":["Bonjour"]}}`.
      · `nodejs/lecon-10` #3 : `const req = { url: "/produits?tri=prix" };` — la valeur EXACTE
      que le bloc précédent de la même leçon annonce en commentaire. Cliqué : `/produits`
      puis `prix`, mot pour mot les deux commentaires du bloc, qui n'avaient jamais été vérifiés.
      · `securite/lecon-01` #2 : le sujet même de l'exercice est qu'une entrée d'URL est du
      TEXTE. `{ query: { age: "42" } }` puis `console.log(age, typeof age)` → **`42 number`**.
      · `cicd/lecon-10` #1 et #2 : un service de feature flags réduit à une table locale, et les
      deux branches jouées. Cliqué : `nouveau panier` ; puis `v2 : clavier` **et** `v1 : clavier`.
      Le #2 était en prime dans la catégorie AUTRE (`SyntaxError: Illegal return statement` : deux
      `return` au niveau racine) — enveloppé dans la fonction que son énoncé demandait, il tombe
      des deux catégories à la fois. **Deux accents manquants corrigés au passage** dans son
      commentaire : « deployee, active » → « déployée, activée ».
      · `vue/lecon-06` #1 et `vue/lecon-10` #8 : une table de routes n'est qu'un tableau
      d'objets. Les composants réduits à `{ nom: 'Accueil' }` ne mentent pas — la table n'en voit
      pas plus. Cliqué : `["/","/produits","/produits/:id"]` et `["/","/contact"]`.

      ⚠️ **LES 2 REFUSÉS, ET LE CRITÈRE QUI LES REFUSE.** `vue/lecon-06` #2 (`defineStore`,
      Pinia) et `nodejs/lecon-22` #5 (`z`, zod) resteraient EN PANNE. Ils pourraient être fermés
      de la même façon — une fausse `defineStore`, un faux `z` — et **c'est précisément ce qu'il
      ne faut pas faire** : une `ref` simulée n'est pas réactive, un `z.string().min(1)` simulé
      ne valide pas comme zod. L'apprenant cliquerait, verrait un résultat plausible, et
      apprendrait un comportement qui n'est pas celui de la bibliothèque. **Le critère qui sépare
      les six des deux** : on simule ce que la leçon présente DÉJÀ comme un mécanisme (un objet
      décrit par `createElement`, un tableau de routes, une table de flags) ; on ne simule pas ce
      dont la leçon vend le COMPORTEMENT (la réactivité, la validation). Deux blocs en panne
      valent mieux que deux blocs qui enseignent faux.

      **Mesures.** `verif-js.js` : **1 613 blocs à bouton (inchangé), 1 566 aboutis (+7),
      27 EN PANNE (−7)**, 81 non compilables et 35 orphelins **strictement inchangés** — aucun
      bouton perdu ni gagné par accident. Carte refaite : **NULLE-PART 19 → 2**, AUTRE 4 → 3,
      les autres catégories intactes (BOUTON-AVANT 8, MUET-AVANT 13, PLUS-BAS 1).
      Preuve Chrome (`verif-clic.js --sorties`, `file://`) : 10 blocs cliqués sur 10 attendus,
      couverture complète, **0 divergent**. Chaîne : `verif-html.js` 0/0 ; `verif-donnees.js`
      25 contrôles 0 erreur ; `verif-sorties.js` 0 divergent ; `verif.js --rapide` **42 étapes,
      tout vert, 119,2 s**. Cliquet descendu à **27**.

      ⚠️ **Un piège d'outillage rencontré ici** : `pages/securite/lecon-01.html` est en **CRLF**
      quand les autres leçons sont en LF. Un motif de remplacement écrit en LF n'y trouve **zéro**
      occurrence — silencieusement. Vérifier les fins de ligne du fichier AVANT d'écrire le motif.
      Second piège, d'affichage celui-là : `tools/preuves/montre-bloc.js` fait traverser un
      `[\s\S]*?` entre `<figure>` et `<code>`, si bien qu'il attribue parfois au bloc le
      `data-file` d'une figure ANTÉRIEURE — d'où le bloc JavaScript de `cicd/lecon-10` annoncé
      « `.github/workflows/deploy.yml` » dans la carte. C'est l'étiquette qui est fausse, pas le
      contenu ; l'outil n'a pas été corrigé dans cette passe.



- [x] **B2b-23 · LA SUITE DU MÊME FICHIER, onzième règle du bouton : 4 blocs écartés, ZÉRO
      vivant retiré — 27 blocs en panne → 23. Et l'élargissement « naturel » du critère,
      RÉFUTÉ par la mesure avant d'être écrit.**

      **Mesure reproduite d'abord** (`node tools/verif-js.js --causes`, puis
      `tools/preuves/sonde-origine-du-nom.js`) : **1 613 blocs à bouton, 1 566 aboutis,
      27 EN PANNE**, carte inchangée depuis B2b-22 — BOUTON-AVANT 8 · MUET-AVANT 13 ·
      PLUS-BAS 1 · NULLE-PART 2 · AUTRE 3. Le gisement n'avait pas bougé.

      **LE DÉFAUT VISÉ.** `heriteDuNavigateur` (B2b-8) n'écarte un bloc que si le nom hérité
      **ouvre une ligne**. `pages/js/lecon-33.html` #3 lit le sien au MILIEU d'une ligne
      racine — `const fd = new FormData(form);` — où `form` vient du `document.querySelector`
      d'un bloc précédent : l'expression est évaluée aussitôt, le bouton ne pouvait promettre
      qu'un « form is not defined ». Le critère « colonne zéro » rate ce cas par construction.

      ⚠️ **ÉLARGIR L'USAGE, À LUI SEUL, TUE DES BLOCS VIVANTS — et c'est la mesure qui l'a
      dit, pas un raisonnement** (`tools/preuves/sonde-heritage-profondeur.js`, qui DEMANDE
      le statut de chaque bloc à `verif-js.js` au lieu de le recalculer, comme en B2b-20) :

      | critère | blocs visés | dont **VIVANTS** |
      |---|---|---|
      | colonne 0 (règle actuelle) | 1 | **0** |
      | profondeur 0 d'accolades | 18 | **10** |
      | profondeur 0, flèches courtes coupées | 16 | **8** |
      | n'importe où (déjà rejeté en B2b-8) | 39 | **27** |
      | MÊME `data-file` + usage n'importe où | 17 | **10** |
      | MÊME `data-file` + profondeur 0 | 7 | **2** |
      | + listes de paramètres neutralisées | 5 | **1** |
      | **+ nom absent des blocs précédents non-navigateur** | **4** | **0** |

      **CE QUI FAIT LA DIFFÉRENCE N'EST PAS UNE REGEX PLUS FINE, C'EST UNE INFORMATION DE LA
      PAGE.** Le `data-file` : quand le bloc porte le même nom de fichier qu'un bloc de
      navigateur qui le précède, la leçon dit elle-même qu'il en est la SUITE — un extrait
      d'`app.js` après un autre extrait d'`app.js`, pas un programme à part. L'usage n'a alors
      plus besoin d'ouvrir la ligne. Les trois précautions qui restent sont chacune un faux
      positif MESURÉ : la profondeur d'accolades (un nom cité dans le corps d'une fonction
      jamais appelée ne fait rien échouer) ; les listes de paramètres (`function rendre(etat)`
      DÉCLARE `etat` à la profondeur zéro, il ne le lit pas — c'est ce qui visait à tort
      `projets-js/lecon-02` #3, bien vivant) ; la garde du préambule (si un bloc précédent
      non-navigateur déclare le nom, le repli de B2b-7 peut le fournir — `js/lecon-12` #8
      vit de cela). ⚠️ La garde est écrite sur « les blocs non-navigateur » et non sur « les
      blocs à bouton », qui seraient pourtant le préambule exact : la liste des blocs à bouton
      dépend des règles du bouton, donc de celle-ci — **la définition serait circulaire**.
      La garde retenue est plus large, donc plus prudente ; mesurée, elle donne le même 4/0.

      **LES 5 BLOCS VISÉS, ET LE CINQUIÈME QUI EXPLIQUE UN CLIQUET QUI BAISSE** :
      `js/lecon-33` #3 et #5 (`form`), `projets-js/lecon-18` #4 et #5 (`audioCtx`), plus
      `js/lecon-59` #4 — celui-là était **déjà** écarté comme fragment orphelin, il change
      seulement de motif. D'où les orphelins qui passent de 35 à 34 : aucun bouton n'est
      revenu, un bloc a changé de cliquet.

      **Mesures.** `verif-js.js` : **1 609 blocs à bouton (−4), 1 566 aboutis (INCHANGÉ,
      donc zéro bouton vivant perdu), 23 EN PANNE (−4)**, 81 non compilables strictement
      inchangés, 34 orphelins (−1, le bloc ci-dessus). Preuve par Chrome (`verif-clic.js`,
      `file://`) sur les trois pages touchées : **9 blocs attendus, 9 cliqués, couverture
      complète, 0 divergent** — le navigateur pose exactement les boutons que l'outil prévoit.
      Cliquet descendu à 23 et **éprouvé par injection** : `zzzNomInexistant();` en tête d'un
      bloc vivant d'`algo/lecon-01` → **code 1**, « 35 fragments orphelins contre 34 à la
      référence » ; faute retirée → **code 0**, page revenue à l'octet près (`git status`).
      Chaîne : `verif-html.js` 0/0 ; `verif-donnees.js` 0 erreur ; `verif-sorties.js`
      **0 divergent** sur 449 blocs comparés ; `verif.js --rapide` **42 étapes, tout vert,
      119,1 s**.

      ⚠️ **UNE DETTE D'OUTILLAGE QUE CETTE RÈGLE A RENDUE INTENABLE, ET LE PIÈGE QU'ELLE
      CACHAIT.** Le contexte d'une leçon — ce qui précède côté navigateur, la page entière,
      les blocs à bouton — était reconstruit **six fois** : dans `init()`, dans `verif-js.js`
      et dans quatre sondes. Cette règle en demandait un septième (le `data-file`), donc six
      endroits à modifier et la certitude d'un oubli. Un seul exemplaire désormais,
      `REG.contexteLecon`, dont la signature devient `aUnBouton(code, RANG)` — le rang, et non
      un contexte, parce que les règles n'ont pas toutes besoin du même. Et le piège, mesuré
      en le corrigeant : **trois sondes avaient leur propre `blocsJs`, qui ne relevait pas le
      `data-file`** ; la règle neuve y recevait donc un contexte VIDE et **ne s'appliquait
      jamais** — `sonde-repli-manque.js` a continué d'annoncer 12 blocs en TRI, dont les 4 que
      le navigateur venait d'écarter, sans le moindre signal. Une copie ne diverge pas
      bruyamment : elle décrit un site qui n'existe plus. Découpage et parcours lus dans
      `regles-bouton.js` : la sonde retombe à 9.

      Les deux sondes neuves (`sonde-heritage-profondeur.js`, la mesure ci-dessus ;
      `sonde-tours-du-repli.js`, qui DÉROULE tour par tour la chaîne des replis d'un bloc et
      montre où elle s'arrête) sont déclarées dans `hors-chaine.json` avec leur raison et ce
      qu'il faudrait pour les lever — `verif-chaine-declaree.js` les avait signalées, ce qui
      est son travail : **82 outils dans un mode, 15 hors chaîne, tous déclarés.**

      **CE QUE CE POINT NE FERME PAS, ET POURQUOI.** Les 23 blocs restants ne relèvent plus
      d'aucune règle du bouton sûre : leur nom vient d'un bloc muet (`grille`, `quiz`,
      `UserSchema`, `DataLoader`, `memoire`) sans partager son `data-file`, ou le repli échoue
      sur un SECOND nom que le tri du préambule écarte pour collision (`projets-js/lecon-15`
      #5 : `etatInitial` ancré, puis `estPerdu` que le préambule ne peut pas garder en même
      temps — `sonde-tours-du-repli.js` le montre en trois tours). Ce sont deux chantiers
      distincts, l'un de CONTENU (compléter les fragments, comme B2b-21), l'autre de MOTEUR
      (un préambule qui tolère deux blocs en collision), et aucun ne se traite par une règle.

- [x] **B2b-24 · UNE ILLUSTRATION N'EST PAS DU CODE : 16 blocs `.txt` étiquetés dans un
      langage à bouton, 9 boutons COMPTÉS DANS CHROME qui disparaissent — et l'angle mort
      de `verif-sorties.js` mesuré au passage.**

      **Le défaut trouvé en tirant le fil du point précédent.** `algo/lecon-02` #2 restait en
      panne sur `factorielle is not defined` ; en le regardant, ce n'était pas du JavaScript
      mais un **déroulé de récursion** (`factorielle(4) = 4 * factorielle(3) // en attente`),
      rangé dans `deroule.txt` et étiqueté `class="language-javascript"`. `runner.js` décide du
      bouton d'après la CLASSE, jamais d'après le nom du fichier : le site posait donc un
      « Tester » sur une trace dessinée à la main. Le recensement a rendu **16 blocs `.txt`
      dans ce cas : 7 en `javascript`, 7 en `markup`, 1 en `python`, 1 en `sql`.**

      **CE QUE LE NAVIGATEUR EN FAISAIT VRAIMENT — mesuré, pas déduit.** La règle du chantier
      interdit de conclure d'après le code des règles : `tools/preuves/repli-navigateur.js`
      imprime désormais **le nombre de boutons posés par la page** (`.code-block__try`, que
      « Tester » et « Aperçu » partagent), et les 13 pages ont été ouvertes dans un vrai
      Chrome **avant** puis **après** correction, `file://` :

      | page | avant | après |
      |---|---|---|
      | `algo/lecon-16` · `algo/lecon-17` | 11 · 9 | 10 · 8 |
      | `algo/lecon-18` · `algo/lecon-19` · `algo/lecon-20` | 11 · 12 · 10 | 10 · 11 · 9 |
      | `js/lecon-31` (deux blocs) | 3 | **1** |
      | `algo/lecon-02` · `projets-js/lecon-14` | 11 · 5 | 10 · 4 |
      | `python/lecon-23` · `sql/lecon-06` · `js/lecon-30` · `react/lecon-14` · `algo/lecon-10` | 5 · 7 · 8 · 1 · 8 | **inchangés** |

      **9 boutons disparaissent : 7 « Aperçu »** posés sur des schémas ASCII — dont
      `algo/lecon-16`, où l'aperçu HTML interprétait `B&lt;----C` comme une balise — **et
      2 « Tester »** (le déroulé de `algo/lecon-02`, qui était EN PANNE ; les URLs commentées
      de `projets-js/lecon-14`, qui n'affichaient aucune ligne). **Les 5 pages inchangées sont
      la moitié honnête du compte** : une garde écartait déjà ces blocs (`neCompilePas` pour
      les traces JavaScript, le filtre « pseudo-schéma » de SQL, `PAS_DU_PYTHON`) — leur seul
      défaut était une coloration Prism qui mentait. Corriger l'étiquette reste juste ; le
      dire évite de compter deux fois le même gain.

      ⚠️ **LA CONVENTION DU SITE EST `language-plaintext`, ET UN PREMIER JET L'AVAIT MANQUÉE.**
      Les sept premiers blocs avaient d'abord été passés à `<pre><code>` **sans classe** — la
      forme que portent 148 blocs `.txt` du site. La mesure a montré aussitôt le prix :
      `verif-sorties.js` en compte 93 « non jugés », le chiffre est tombé à **86**. Son motif
      (`verif-sorties.js:78`) exige `class="language-…"` : un bloc sans classe lui est
      **totalement invisible**, ni comparé ni compté. Repassés en `language-plaintext`
      (766 blocs du site l'emploient), les sept redeviennent visibles et le compte revient à 93.

      **L'ANGLE MORT, MESURÉ PUIS MIS SOUS SURVEILLANCE.** Question suivante : parmi les 141
      blocs `.txt` sans classe, combien sont la SORTIE d'un programme voisin, donc rejouée par
      personne ? Le critère de rattachement du vérificateur (`estLaSortieDe`) leur a été
      appliqué — LU dans `verif-sorties.js`, jamais recopié : **141 invisibles, ZÉRO
      rattaché.** Aucune sortie n'échappe aujourd'hui. Un contrôle neuf,
      **`tools/verif-etiquette-illustration.js`**, tient les deux constats : (1) aucun bloc
      `.txt` ne porte une classe de langage à bouton, (2) aucun bloc `.txt` sans classe n'est
      rattachable à un programme. **Éprouvé par injection sur ses DEUX contrôles** : un
      `deroule.txt` remis en `language-javascript` → **code 1**, bloc nommé ; une
      `factorielle.txt` sans classe ajoutée après `factorielle.js` → **code 1**, rattachement
      nommé ; page restaurée → **code 0**. Il est déclaré dans `verif.js` (étape `txt-etiq`,
      1,2 s, tous les modes) — **83 outils dans un mode, 15 hors chaîne, tous déclarés.**

      **Mesures.** `verif-js.js` : **1 607 blocs à bouton (−2), 1 565 aboutis (−1),
      22 EN PANNE (−1), 77 non compilables (−4), 33 orphelins (−1)**. ⚠️ **Le bloc « vivant »
      perdu est `projets-js/lecon-14` · `urls.txt`, qui ne contient QUE des commentaires** :
      au clic il affichait « (aucune sortie — ajoute un console.log…) ». Le compter parmi les
      aboutis était exact et vide de sens ; le dire vaut mieux que l'arrondir. Chaîne :
      `verif-html.js` 0/0 ; `verif-donnees.js` 0 erreur ; `verif-sorties.js` **449 rejoués,
      0 divergent, 93 non jugés (inchangé)** ; `verif-sql.js` sur `sql/lecon-06` 7/7 ;
      cliquets descendus à **22 / 77 / 33**.

- [x] **B2b-25 · La règle B2b-23 était AVEUGLE aux conditions, et sa quatrième précaution
      était de trop : 22 blocs en panne → 16, aboutis 1 565 → 1 567, et ZÉRO bouton perdu.**

      **Le point s'est ouvert sur le lot `projets-js`, il s'est fermé sur deux défauts de
      règle.** Mesure d'entrée reproduite avant de toucher à quoi que ce soit
      (`node tools/verif-js.js --causes`) : **1 607 blocs à bouton, 1 565 aboutis, 22 EN
      PANNE**, dont 9 dans `projets-js` — le plus gros lot restant. La carte de
      `sonde-origine-du-nom.js` confirme au passage que le lot NULLE-PART du point B2b-20
      est **vidé, il n'en reste que les 2 blocs refusés pour une raison en B2b-22**.

      **(1) DEUX BLOCS RENDUS VIVANTS PAR UN RENOMMAGE, DANS LE CONTENU.**
      `projets-js/lecon-15` #5 et #7 (le moteur du serpent) échouaient sur `etatInitial`,
      un nom pourtant déclaré par le bloc #1 de la même leçon. La cause n'était pas
      l'absence du nom mais une **collision de déclarations** : quatre blocs de démonstration
      déclaraient chacun `const jeu` ou `let jeu`, et le préambule ne garde que ce qui
      COMPILE avec le bloc (B2b-5) — garder le #4 faisait donc sauter le #1, qui portait
      justement `etatInitial`. Deux variables de démonstration renommées (`jeu` → `depart`
      dans #1, `jeu` → `partie` dans #5) suffisent : la leçon passe de **8 blocs aboutis sur
      10 à 10 sur 10**, sans qu'une ligne de code enseigné ne change. ⚠️ Aucune règle ne
      pouvait faire ce travail : c'est le CONTENU qui réutilisait le même nom pour quatre
      choses différentes.

      **(2) UNE CONDITION N'EST PAS UNE LISTE DE PARAMÈTRES.** En cherchant pourquoi
      `projets-js/lecon-17` #5 (`if (modeGomme) { … }`, un fragment de `pointermove`)
      gardait un bouton, le motif de neutralisation des paramètres de la règle B2b-23 s'est
      révélé accepter **n'importe quel identifiant collé à `(…) {`** — donc `if (x) {`,
      `while (x) {`, `for (…) {`, `switch (x) {`. La règle était aveugle à **toute lecture
      faite dans une condition racine**. Les mots-clés de contrôle sont maintenant exclus du
      blanchiment ; `catch` reste une liaison, donc blanchi.
      ⚠️ **Les deux sondes du dépôt DIVERGEAIENT sur ce point, et c'est ce qui l'a révélé** :
      `sonde-heritage-navigateur.js` (qui ne blanchit qu'après `function`/`catch`/`=>`)
      visait `modeGomme`, `sonde-heritage-profondeur.js` (qui recopiait le motif de la règle)
      ne le visait pas. Deux instruments qui ne disent pas la même chose du même bloc : le
      désaccord était l'information.

      **(3) LA QUATRIÈME PRÉCAUTION ÉTAIT DE TROP, ET C'EST LA MESURE QUI LE DIT.** B2b-23
      exigeait en plus que le bloc source porte le **même `data-file`**. Elle compensait
      l'absence des deux autres précautions, écrites dans la même passe. Une fois les
      paramètres neutralisés et la garde du préambule en place, la lever ne coûte rien —
      variantes ajoutées à `sonde-heritage-profondeur.js`, **statut de chaque bloc DEMANDÉ à
      `verif-js.js`** au lieu d'être recalculé :

      | critère | blocs visés | dont **VIVANTS** |
      |---|---|---|
      | colonne 0 (règle de B2b-8, inchangée) | 0 | 0 |
      | profondeur 0 d'accolades, seule | 14 | **10** |
      | usage n'importe où (rejeté en B2b-8) | 35 | **27** |
      | MÊME `data-file` + profondeur 0 + paramètres + garde | 0 | 0 |
      | **TOUT bloc navigateur + profondeur 0 + paramètres** | 4 | **1** |
      | **… + garde du préambule (retenu)** | **3** | **0** |

      Les 3 blocs gagnés sont `nodejs/lecon-22` #2 (`UserSchema`), `graphql/lecon-09` #5
      (`DataLoader`) et `wasm/lecon-04` #4 (`memoire`) — un `new WebAssembly.Memory` déclaré
      dans un bloc de navigateur est hors d'atteinte du Worker, que l'étiquette de fichier
      soit la même ou non. La règle est renommée en conséquence :
      `estLaSuiteDunFichierDeNavigateur` → **`heriteDuNavigateurAuNiveauRacine`**, et la
      liste `navFichierAvant` disparaît de `runner.js`, de `regles-bouton.js` et de
      `verif-clic.js` — trois endroits, parce que les vérificateurs LISENT la règle dans
      `js/runner.js` et qu'un nom oublié y lève une erreur bruyante, jamais un silence.
      ⚠️ La sonde `sonde-heritage-navigateur.js` a d'abord mesuré la variante SANS ses deux
      précautions : **46 blocs visés dont 10 VIVANTS**, puis 37/1 avec les paramètres
      neutralisés, puis **36/0** avec la garde du préambule. La règle n'a été écrite qu'après
      la troisième ligne.

      **ÉPREUVE DE LA RÈGLE, cas par cas** (`heriteDuNavigateurAuNiveauRacine` chargée depuis
      `regles-bouton.js`, source `runner.js`) : condition racine → écarté ; boucle `while`
      racine → écarté ; appel racine `rendre(modeGomme)` → écarté ; **paramètre**
      `function f(modeGomme)` → gardé ; **corps de fonction** → gardé ; **commentaire seul**
      → gardé ; **chaîne seule** → gardé ; **nom déclaré par le bloc lui-même** → gardé ;
      **nom déclaré par un bloc précédent non-navigateur** (le repli peut le fournir) →
      gardé. **9 cas sur 9.**

      **PREUVE PAR LE NAVIGATEUR, jamais par le calcul de tête.** `verif-clic.js --sorties`,
      Chrome `file://`, réseau non sollicité, sur les 5 pages touchées : **16 blocs cliqués
      sur 16 attendus, couverture complète, 0 divergent**. `projets-js/lecon-15` rend ses 10
      blocs, dont les deux réparés : #5 → `1` puis `4`, #7 → `{"x":5,"y":5} 0`,
      `{"x":6,"y":5} 1`, `4`, `en cours` — exactement les quatre sorties que la page annonce
      en commentaire. Les 4 blocs visés par la règle n'ont plus de bouton dans Chrome.
      **Injection dans une page réelle** : `if (ctx) { console.log("x"); }` ajouté au bloc #2
      de `projets-js/lecon-16` (le cas d'école des 31 vivants de B2b-8, qui cite `ctx` dans
      des fonctions qu'il n'appelle pas) → la page passe de **2 boutons à 1 DANS CHROME**, et
      `verif-js.js` dit la même chose ; page restaurée → 2 boutons.

      **Cliquet éprouvé** : `const zzz = ;` injecté en tête d'`algo/lecon-01` → **code 1**,
      « 78 blocs ne compilent pas contre 77 à la référence » ; page restaurée → code 0.

      **Mesures.** `verif-js.js` : **1 603 blocs à bouton (−4), 1 567 aboutis (+2),
      16 EN PANNE (−6), 77 non compilables et 33 orphelins INCHANGÉS**. Le nombre d'aboutis
      n'a baissé à aucune étape. Chaîne rejouée : `verif-html.js` 1 629 fichiers, 0 grave
      0 remarque ; `verif-donnees.js` 25 contrôles, 0 erreur (`search-index.js` régénéré :
      le renommage de deux variables décale l'index de 2 octets, et l'invariant I18 l'a vu) ;
      `verif-sorties.js` **449 rejoués, 0 divergent** ; `verif.js --rapide` **52 étapes,
      tout vert, 130,2 s**. Cliquets descendus à **16 / 77 / 33**.

      **Ce qui reste : 16 blocs, dont 2 que l'apprenant voit échouer À COUP SÛR** —
      `nodejs/lecon-22` #5 rend `ReferenceError: z is not defined` et #6
      `SyntaxError: Illegal return statement`, relevés au clic pendant ce point. Les 14
      autres : `js` 6, `projets-js` 6, `typescript` 1, `vue` 1.

- [x] **B2b-26 · LE JUGE DE COMPILATION N'ÉTAIT PAS CELUI DU WORKER : `new Function` accepte
      un `return` racine que `(0, eval)` refuse — 15 blocs en panne, et un bouton qui
      affichait `SyntaxError` à l'apprenant a disparu.**

      **Le défaut était ÉCRIT dans le dépôt depuis B2b-5, en toutes lettres, et personne
      n'était allé le chercher.** Le commentaire de `neCompilePas` disait : « Trois blocs
      vont dans l'autre sens (`eval` refuse un `return` racine que `new Function` autorise) :
      gain non pris, jamais un risque. » Le « gain non pris » était un bloc qui GARDE son
      bouton et ne peut rendre qu'une faute de syntaxe au clic — précisément ce que ce
      chantier fait disparaître. Il a été retrouvé au clic pendant le point B2b-25 :
      `nodejs/lecon-22` #6 affichait `SyntaxError: Illegal return statement` **dans Chrome**.

      **MESURE AVANT ÉCRITURE** (`tools/preuves/sonde-eval-contre-function.js`, sonde neuve,
      statut de chaque bloc DEMANDÉ à `verif-js.js` au lieu d'être recalculé) : sur les
      **1 603 blocs à bouton**, `new Function` accepte et `eval` refuse **1 bloc — en panne,
      ZÉRO vivant** ; l'inverse, le seul cas qui retirerait un bouton qui marche, vise
      **0 bloc**. Les deux juges sont donc interrogés et il suffit qu'un seul refuse. Le
      second est `(0, eval)("throw 0;\n" + texte)` : le `throw` placé en tête garantit que
      la compilation a lieu et que **rien** ne s'exécute — pas une ligne du bloc, pas même
      une déclaration.

      **ÉPREUVE DE LA RÈGLE, cas par cas** : `return` racine → refusé ; `await` racine →
      refusé ; `case` sans `switch` → refusé ; corps d'objet détaché → refusé ; programme
      ordinaire → accepté ; **`function f() { return 1; }` puis son appel → accepté** (un
      `return` DANS une fonction n'a jamais rien d'illégal, et c'est le seul faux positif
      qui aurait coûté des centaines de boutons). **6 cas sur 6.**

      **Mesures.** `verif-js.js` : **1 602 blocs à bouton (−1), 1 567 aboutis (INCHANGÉ),
      15 EN PANNE (−1), 79 non compilables (+2), 32 orphelins (−1)**. ⚠️ **Le +2 du cliquet
      des non-compilables demande une explication, sans quoi il ressemble à une régression**
      : deux blocs seulement sont concernés, et un seul perd un bouton. `nodejs/lecon-22` #6
      passe de « en panne » à « ne compile pas » (le bouton tombe) ; `securite/lecon-01` #3
      passe de « fragment orphelin » à « ne compile pas » — **le même bloc, déjà sans
      bouton, simplement rangé sous la bonne cause** : un `return` racine ne compile pas,
      que le nom `requete` manque ou non. Le total des blocs écartés ne bouge donc que d'un.

      **PREUVE PAR LE NAVIGATEUR.** `verif-clic.js --sorties`, Chrome `file://` : sur
      `nodejs/lecon-22` et `securite/lecon-01`, **2 blocs cliqués sur 2 attendus, 0
      divergent** — et la ligne `SyntaxError: Illegal return statement` a disparu de la
      page. **Cliquet éprouvé sur la règle neuve** : `if (true) { return 1; }` injecté en
      tête d'`algo/lecon-01` → **code 1**, « 80 blocs ne compilent pas contre 79 à la
      référence » ; page restaurée → code 0, 15 en panne comme à la référence.

      **Chaîne rejouée** : `verif-html.js` 1 629 fichiers, 0 grave 0 remarque ;
      `verif-donnees.js` 25 contrôles, 0 erreur ; `verif.js --rapide` **52 étapes, tout
      vert, 133,6 s**, `gardech` compris (la sonde neuve est un outil de preuve, pas un
      vérificateur : elle n'entre pas dans la chaîne). Cliquets à **15 / 79 / 32**.

      ⚠️ **PREUVE DE NON-RÉGRESSION DU POINT PRÉCÉDENT, sur un large échantillon** :
      `verif-clic.js` sans argument (les leçons à risque) a rendu, après B2b-25,
      **75 pages, 512 blocs attendus, 512 cliqués — couverture complète, 0 divergent**, en
      990 s. C'est la mesure qui prouve que le renommage de la règle et la disparition de
      la liste `navFichierAvant` n'ont désynchronisé ni le moteur ni les vérificateurs.

- [x] **B2b-27 · LA FONCTION QUE LE BLOC DÉCLARE ET QU'IL APPELLE, douzième règle du
      bouton : 3 blocs écartés, ZÉRO vivant retiré — 15 blocs en panne → 12, aboutis
      1 567 INCHANGÉS.**

      **Le lot qui restait dans `projets-js` avait une forme, et elle était homogène.**
      Après B2b-25 et B2b-26, les 15 blocs en panne se répartissaient `js` 6,
      `projets-js` 6, `typescript` 1, `vue` 1, `nodejs` 1. Six blocs de `projets-js`
      s'écrivaient tous ainsi : `function rendre() { … grille.querySelectorAll(".case") … }`
      suivi de `rendre();`. Le nom hérité est lu à la **profondeur 1**, donc les deux règles
      d'héritage l'épargnent — c'est la précaution mesurée en B2b-8 : « un nom cité dans le
      corps d'une fonction que le bloc n'appelle jamais ne fait rien échouer ». Mais ici
      **le bloc l'appelle**, et l'erreur est alors aussi certaine qu'à la racine.

      **MESURE AVANT ÉCRITURE** (`tools/preuves/sonde-fonction-appelee.js`, sonde neuve,
      statut de chaque bloc DEMANDÉ à `verif-js.js`) :

      | critère | blocs visés | dont **VIVANTS** |
      |---|---|---|
      | nom hérité cité dans un corps de fonction du bloc | 18 | **15** |
      | **… et la fonction est APPELÉE au niveau racine** (retenu) | **3** | **0** |
      | … et la citation n'est sous aucune condition | 1 | **0** |

      ⚠️ **LE PREMIER RELEVÉ VISAIT DEUX VIVANTS, ET LA CAUSE EST LA MÊME QU'EN B2b-23 ET
      B2b-25, UN NIVEAU PLUS LOIN : LES PARAMÈTRES.** `nodejs/lecon-09` #12 est
      `function lireOptions(args) { … for (const arg of args) … }` — `args` y est le
      paramètre de la fonction, pas la globale née d'un bloc de navigateur, et le bloc
      marche très bien (`{"port":"8080","verbeux":true}` au clic). Un paramètre MASQUE le
      nom du dehors. Une fois la liste des paramètres retirée, la variante retenue passe de
      **5 visés / 2 vivants à 3 visés / 0 vivant**. Sans cette mesure, la règle aurait
      retiré deux boutons qui marchent.

      **La variante la plus prudente ne gagne qu'un bloc sur trois**, et « appelée » n'en
      vise aucun de vivant : c'est donc « appelée » qui est retenue, avec **sa limite écrite
      dans le moteur** — une lecture placée dans une branche jamais atteinte survivrait à
      l'appel ; aucun bloc du site n'est dans ce cas, et c'est mesuré, pas supposé.

      **ÉPREUVE DE LA RÈGLE, cas par cas** : fonction appelée → écarté ; **fonction NON
      appelée → gardé** ; **paramètre masquant** → gardé ; **nom fourni par un bloc
      précédent non-navigateur** (le repli peut le donner) → gardé ; nom déclaré par le bloc
      lui-même → gardé ; **nom cité dans un commentaire seul** → gardé ; **appel fait depuis
      une AUTRE fonction jamais appelée** → gardé ; bloc sans aucune fonction → gardé.
      **8 cas sur 8.**

      **PREUVE PAR LE NAVIGATEUR.** `verif-clic.js --sorties`, Chrome `file://` :
      `projets-js/lecon-10`, `lecon-19` et `lecon-04` — **8 blocs cliqués sur 8 attendus,
      couverture complète, 0 divergent**, et les 3 blocs visés n'ont plus de bouton.
      **Injection dans une page réelle** : `function zzzTest() { ctx.fillRect(0,0,1,1); }`
      suivi de `zzzTest();` ajouté au bloc #2 de `projets-js/lecon-16` → la page passe de
      **2 boutons à 1 DANS CHROME**, et `verif-js.js` dit la même chose ; page restaurée →
      2 boutons. **Cliquet des pannes éprouvé** : `const zzz = null; zzz.x;` injecté en tête
      d'`algo/lecon-01` → **code 1**, « 13 en panne contre 12 à la référence, un bloc JS qui
      aboutissait est tombé » ; page restaurée → code 0.

      **Mesures.** `verif-js.js` : **1 599 blocs à bouton (−3), 1 567 aboutis (INCHANGÉ),
      12 EN PANNE (−3), 79 non compilables et 32 orphelins INCHANGÉS**. Chaîne :
      `verif-html.js` 1 629 fichiers, 0 grave 0 remarque ; `verif-donnees.js` 25 contrôles,
      0 erreur ; `verif.js --rapide` **52 étapes, tout vert, 130,6 s**. ⚠️ `gardech` a
      SIGNALÉ la sonde neuve avant que ce point ne soit clos — « un vérificateur hors chaîne
      vaut un vérificateur inexistant » — et les deux sondes de la journée sont maintenant
      déclarées dans `tools/hors-chaine.json` avec ce qu'il faudrait pour les faire entrer.

      **Ce qui reste : 12 blocs.** `js` 6 (`lecon-17` #9/#11/#16, `lecon-59` #2, `lecon-65`
      #5/#6 — dont les deux de l'angle mort du repli sur `export`, décrit en B2b-21),
      `projets-js` 3 (`lecon-02` #5, `lecon-10` #6, `lecon-18` #6), `typescript` 1, `vue` 1,
      `nodejs` 1 (`lecon-22` #5, `z is not defined`, l'un des deux refus de B2b-22).

- [x] **B3 · Neuf langages, 184 leçons dont aucune sortie n'est rejouée par la chaîne.**
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

      **FAIT le 2026-09-09. Mesure reproduite d'abord**, `recense-chaine.js --json` :
      les neuf `preuves/rejoue-*.js` sont bien `dansChaine:false` **et non déclarés**
      (famille « autre », donc même le garde-fou `verif-chaine-declaree.js` ne les réclamait
      pas). Lancés un par un : **178 programmes conformes, 0 divergent, 0 non trouvé**
      — cpp 12, rust 14, go 17, java 28, php 15, c 26, csharp 22, elixir 40, bash 4 — pour
      **2,2 s cumulées**, dont 1,5 s pour java à lui seul.

      **LE TEST DÉCISIF DE L'AUDIT, REJOUÉ AVANT DE DÉCIDER.** `pages/cpp/lecon-01.html`,
      `// n = 7` remplacé par `// n = 8` : `rejoue-cpp.js` sort en **1** (« 11 conformes,
      **1 divergent** »), `verif-exemples.js --lang all` sur la même page sort en **0**
      (« Aucune divergence »), `verif-sorties.js` aussi. Page restaurée, `rejoue-cpp.js`
      revient à 12/0. La cécité annoncée par l'audit est donc exacte, aujourd'hui encore.

      **Décision : les neuf sont versés dans TOUS les modes** (2,2 s ne justifient pas un
      mode à part). Étapes `rj-cpp`, `rj-rust`, `rj-go`, `rj-java`, `rj-php`, `rj-c`,
      `rj-c#`, `rj-elixr`, `rj-bash`. La chaîne passe de **43 à 52 étapes en `--rapide`**,
      de 59 à 68 en mode par défaut, de 69 à 78 en `--complet` ; **92 outils dans un mode**
      (contre 83), 15 hors chaîne tous déclarés.

      ⚠️ **LA NUANCE QUE LE PLAN DEMANDAIT D'ÉCRIRE, ET SON CHIFFRE.** Ce ne sont pas des
      compilateurs : aucun `g++`, `gcc`, `rustc`, `go`, `javac`, `php` ni `elixir` n'existe
      sur cette machine — ce sont des **transpositions JavaScript écrites à la main**. Elles
      attrapent une sortie **éditée**, jamais un bloc **neuf** non transposé. La couverture a
      été mesurée (`tools/preuves/sonde-couverture-rejoue.js`), en prenant pour dénominateur
      les blocs qui ANNONCENT une sortie — un bloc qui n'annonce rien n'a rien à comparer :

      | cours | blocs | annoncent une sortie | rejoués | couverture |
      |---|---|---|---|---|
      | elixir | 168 | 43 | 40 | **93,0 %** |
      | c | 220 | 49 | 26 | 53,1 % |
      | java | 235 | 57 | 28 | 49,1 % |
      | go | 198 | 42 | 17 | 40,5 % |
      | csharp | 254 | 63 | 22 | 34,9 % |
      | php | 206 | 52 | 15 | 28,8 % |
      | rust | 224 | 82 | 14 | 17,1 % |
      | cpp | 242 | 86 | 12 | 14,0 % |
      | bash | 214 | 32 | 4 | 12,5 % |
      | **total** | **1 961** | **506** | **178** | **35,2 %** |

      Brancher ces outils protège **35,2 % des sorties annoncées de ces neuf cours**, et rien
      de ce qui s'écrira demain. La dette est nommée dans `hors-chaine.json` avec ce qu'il
      faudrait pour la lever : **un cliquet de couverture** — exiger que le nombre de
      programmes rejoués par cours ne baisse jamais, et signaler tout bloc neuf qui annonce
      une sortie sans transposition.

- [ ] **B4 · Les deux preuves du seul fonctionnement qui compte sont hors chaîne.** L'audit a retenu que
      les preuves « page ouverte en `file://` » ne sont lancées par aucun mode. Les identifier, les
      verser, et mesurer ce qu'elles trouvent.

- [x] **B5 · `verif-rendu.js` attendait une DURÉE, pas un ÉTAT — et il a rendu un
      débordement FANTÔME de +444 px que la même page ne reproduit sur aucune de ses six
      mesures. 235 mesures sur 1 536 avaient besoin de plus que le délai fixe.**

      **Trouvé en vérifiant autre chose**, ce qui est la seule façon dont ces défauts se
      montrent. Après le point B2b-24, une passe de contrôle du rendu a signalé **1 ERREUR** :
      `pages/etude-inconnu.html [375px/light]`, « +444 px — `code.language-plaintext`
      (droite 3044) · `code.language-go` (776) · `code.language-javascript` (804) ». La page
      n'avait pas été touchée de la passe (dernier commit : `e61edec`). Relancée SEULE
      (`--pages=…`, 3 largeurs × 2 thèmes, 6 mesures) : **0 erreur.** Un verdict rouge non
      reproductible est pire qu'un vert — il apprend à ignorer l'outil.

      **LA CAUSE, ET C'EST LA TROISIÈME FOIS DANS CE CHANTIER.** `verif-rendu.js:643`
      attendait **700 ms fixes** après `Page.navigate`, puis mesurait. Une durée fixe ment
      sous charge : dans une passe de 256 pages, la mise en page d'une page lourde n'est pas
      finie au bout de 700 ms, et l'on mesure un document à moitié composé. C'est exactement
      le défaut soldé au point **B1e** (`sql-lecon.js` : une COURSE prise pour une panne) et
      au point **B2a** (`verif-js.js` : un dépassement de délai compté comme une erreur), et
      le principe est déjà écrit dans `repli-navigateur.js` : *on attend un ÉTAT, pas une
      durée*.

      **Ce qui a été écrit.** La mise en page est tenue pour faite quand la largeur de
      défilement (`documentElement.scrollWidth`) est **identique sur deux relevés
      consécutifs**, que `document.readyState` vaut `complete` et que `document.fonts.status`
      vaut `loaded` — relevés tous les 150 ms, plafond 3 s. Au-delà, on mesure quand même
      **mais la page est NOMMÉE** dans le rapport (« non stabilisées ») : un instrument doit
      dire quand il n'a pas conclu.

      ⚠️ **LE PREMIER COMPTEUR ÉCRIT NE MESURAIT RIEN, ET C'EST LA MESURE QUI L'A DIT.**
      Posé sur `tours > 0`, il s'incrémentait à chaque mesure — `largeurVue` part de −1, donc
      le premier tour ne fait qu'établir la référence et une page déjà stable sort au tour 1.
      Il annonçait « 6 mesures sur 6 » pour une page qui n'avait besoin d'aucune attente.
      Corrigé en `tours > 1`, il devient discriminant : sur un lot de 12 mesures, 2.

      **Mesures, la même passe avant et après.** Avant : 256 pages, 1 536 mesures,
      **1 ERREUR** (le fantôme). Après : 256 pages, 1 536 mesures, **0 ERREUR, 0
      avertissement, 0 page non stabilisée**, et **235 mesures sur 1 536 (15,3 %) ont demandé
      une attente supplémentaire** — autrement dit, dans **un cas sur sept**, les 700 ms ne
      suffisaient pas et la mesure portait sur une page encore en train de se composer. Durée
      de la passe : environ 25 minutes, inchangée à la minute près.

      ⚠️ **Un aveu de tenue du dépôt** : ce correctif de `tools/verif-rendu.js` est parti dans
      le commit du point B3 (`git add -A` après le travail sur les neuf `rejoue-*`), au lieu
      d'avoir le sien. Le compte rendu est ici ; le commit du point B3 en porte le diff.

      **Chaîne, après les trois points de cette passe** : `verif.js --rapide` — **52 étapes,
      tout est vert, 124,1 s** (43 étapes et 119,2 s avant l'entrée des neuf `rejoue-*` et du
      contrôle `txt-etiq`, qui coûtent 0,4 s à eux dix).

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
