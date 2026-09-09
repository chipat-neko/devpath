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
