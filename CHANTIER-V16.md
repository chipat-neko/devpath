# Chantier V16 — consolider ce que les quatre chantiers ont laissé derrière

Plan de travail de l'autonomie. **Source de vérité : ce fichier.** Chaque réveil lit ce plan,
prend la **première case non cochée**, la traite entièrement, la coche avec un compte rendu chiffré,
puis passe à la suivante. Le chantier est fini quand il ne reste aucune case `- [ ]`.

**Les chantiers V12 à V15 sont clos** (133 cases, verdict de sécurité VERT le 2026-09-03).
Ce plan-ci ne construit rien de neuf : il ferme ce que le bilan F5 du V15 a listé.

---

## Le constat qui fonde ce chantier

Le point F5 du V15 a chiffré onze manques, et il en a tiré une conclusion qui vaut mieux que la
liste elle-même :

> **Le vrai risque n'est plus l'absence d'outil, c'est l'outil hors chaîne.**

Sur les six manques d'outillage relevés, **quatre ont la même forme** : un vérificateur existe, il
fonctionne, il trouve de vraies fautes — et personne ne le lance, parce qu'il n'est dans aucun mode
de `tools/verif.js`. Un outil qu'on doit penser à lancer ne protège rien.

**Mesures refaites le 2026-09-03, avant d'écrire ce plan** (les chiffres du F5 ont été recomptés,
pas recopiés) :

| | |
|---|---:|
| Vérificateurs hors de la chaîne | **24** (12 à la racine de `tools/`, 6 dans `tools/doc/`, 6 dans `tools/fraicheur/`) |
| Questions de QCM analysées | **6 151** |
| dont la bonne réponse est **strictement la plus longue** | **5 462 — 88,8 %** |
| Réussite d'un apprenant qui choisirait toujours la plus longue | **89,6 %** |
| Cours portant au moins une marque de fraîcheur | **6 sur 94** |

⚠️ **Un écart assumé avec le F5** : il annonçait 5 478 questions biaisées sur 6 167, la mesure du
jour donne 5 462 sur 6 151. L'index a été régénéré entre-temps ; l'écart de 16 questions ne change
aucune conclusion, mais il est noté plutôt que lissé.

---

## Règles permanentes

- **Un point à la fois**, mené jusqu'à la mesure.
- **NE JAMAIS CORRIGER NI ÉCRIRE UN CHIFFRE DE TÊTE, LE FAIRE TOURNER.** Le compte rendu de chaque
  case cite le chiffre obtenu par l'exécution. C'est la règle qui a fondé les quatre chantiers
  précédents, après que cinq exemples faux aient traversé quatre vérificateurs verts.
- **Un motif de remplacement trop large casse ce qui était juste** : rejouer le scénario complet
  après correction.
- **Un commit par point**, avec la mesure dans le message.
- **Contrainte fondatrice** : 100 % `file://`, aucun serveur, aucun module ES, aucun build, aucune
  dépendance installée. **INTERDIT** de réintroduire une URL vers `cdnjs.cloudflare.com`,
  `fonts.googleapis.com`, `fonts.gstatic.com`.
- **Ne pas toucher au mojibake volontaire** des leçons sur l'encodage : `pages/formats/lecon-06.html`,
  `pages/html/lecon-15.html`, `pages/r/lecon-06.html`, `pages/perl/lecon-13.html`.
- **En cas de doute réel : ne force pas.** Laisse la case décochée et écris ce qui bloque.

---

## PHASE A — Les outils hors chaîne

C'est le point le plus important du chantier, et le seul que le V15 a explicitement refusé de
trancher. **Attention : « tout mettre dans la chaîne » serait une faute.** Trois familles se
distinguent, et elles ne se traitent pas pareil :

- les **vérificateurs** (`verif-*.js`) : leur place est dans la chaîne ;
- les **épreuves par injection** (`*-mutations.js`, 7 fichiers) : elles **modifient des fichiers**
  puis les restaurent. Les faire tourner à chaque `verif.js` est risqué et lent — leur place est un
  mode dédié ;
- les **générateurs et outils de mesure** (`wf-*.js`, `build-*.js`, `mesure-*.js`, `usage-anthropic.js`,
  `conso-hebdo.js`…) : ils n'ont **rien à faire** dans une chaîne de vérification. Ne pas les y mettre.

- [x] **A1 · Trier les 24, avant de toucher à quoi que ce soit.** Lancer chacun, relever son code de
      sortie, sa durée, ce qu'il mesure, et s'il modifie des fichiers. Produire le tableau et
      classer : *chaîne obligatoire*, *mode dédié*, *hors chaîne assumé*. **Écrire le classement dans
      ce plan** — c'est lui qui décide de A2 à A5, pas l'intuition. Un outil qui échoue aujourd'hui
      est un renseignement, pas un obstacle : le noter.

      **FAIT le 2026-09-03.** `tools/recense-chaine.js` (nouveau) demande à `verif.js` sa liste
      d'étapes mode par mode — via le drapeau `--lister` ajouté à `verif.js` — au lieu d'en recopier
      une copie qui se périmerait. Il compte **293 fichiers `.js` sous `tools/`**, dont **44
      vérificateurs** et **12 épreuves par injection**.

      ⚠️ **Le chiffre de 24 du cadrage est faux : il y en a 35.** Le relevé du jour donne **25
      vérificateurs et 10 épreuves hors chaîne**. Les onze de plus sont les vérificateurs
      `tools/maths/module-3|4|5/*`, que l'inventaire d'origine n'avait pas parcourus. `verif.js`
      lance 16 étapes en `--rapide`, 32 sans option, 34 en `--complet`, 32 en `--strict`.

      **Les 35 ont été lancés un par un, chronométrés, avec `git status` relevé avant et après.**
      Temps machine total du relevé : **≈ 76 minutes**.

      **Les 25 vérificateurs**

      | outil | code | durée | ce qu'il rend |
      |---|---:|---:|---|
      | `verif-liste-alternatives.js` | 0 | 0,1 s | vert |
      | `verif-controles.js` | 0 | 0,5 s | vert |
      | `doc/verif-doc.js` | 0 | 0,7 s | vert |
      | `doc/verif-normatif.js` | 0 | 0,7 s | vert |
      | `fraicheur/verif-contraste.js` | 0 | 0,7 s | vert |
      | `doc/verif-recherche.js` | 0 | 1,9 s | vert |
      | `verif-sql.js` | 0 | 2,8 s | vert |
      | `doc/verif-lexique-clic.js` | 0 | 4,5 s | vert (Chrome) |
      | `verif-interpreteur.js` | 0 | 15,4 s | vert |
      | `doc/verif-vocab.js` | 0 | 15,6 s | vert |
      | `maths/module-5/verif-accept.js` | 0 | 0,3 s | vert |
      | `maths/module-{3,4,5}/verif-expect.js` | 0 | 0,8 s à eux trois | vert |
      | `maths/module-5/verif-renvois.js` | 0 | 2,2 s | vert |
      | `maths/module-5/verif-bilan.js` | 0 | 14,1 s | vert (Chrome) |
      | `maths/module-5/verif-cours-progression.js` | **1 puis 0** | 15,0 s | **rouge à cause de son profil Chrome, vert après effacement** |
      | `fraicheur/verif-affichage.js` | 0 | **201,1 s** | vert (Chrome) |
      | `verif-sorties.js` | **1** | 63,7 s | **2 divergences réelles sur 449 blocs** |
      | `verif-clic.js` | **124** | **> 915 s, tué** | **ne termine pas** |
      | `maths/module-{3,4,5}/verif-chiffres.js` | 1 | 0,1 s | *usage* : exigent des pages en argument |
      | `maths/module-{3,4}/verif-cours-progression.js` | 1 | 8,9 s / 10,6 s | **attentes figées sur un état révolu** |

      **Les 10 épreuves par injection**

      | épreuve | code | durée | dépôt propre | fautes vues |
      |---|---:|---:|:---:|---|
      | `maths/module-5/verif-chiffres-mutations.js` | 0 | 1,8 s | oui | toutes |
      | `fraicheur/verif-fraicheur-mutations.js` | 0 | 2,6 s | oui | 13 / 13 |
      | `fraicheur/verif-affichage-mutations.js` | 0 | 42,1 s | oui | 14 / 14 |
      | `verif-execution-liens-mutations.js` | 0 | 117,2 s | oui | 8 / 8 |
      | `verif-git-modele-mutations.js` | 0 | 287,6 s | oui | 29 / 29 |
      | `verif-git-graphe-mutations.js` | 0 | 414,5 s | oui | 29 / 29 |
      | `verif-git-scenarios-mutations.js` | 0 | 538,1 s | oui | 30 / 30 |
      | `verif-execution-mutations.js` | 124 | > 613 s | oui | **11 / 12 — un angle mort** |
      | `verif-git-commandes-mutations.js` | 124 | > 602 s | oui | 14 vues, non terminée |
      | `preuves/execution-ancres-mutations.js` | 124 | > 614 s | **NON** | 3 / 5 au moment du kill |

      **TROIS DÉFAUTS TRANSVERSAUX, et c'est le vrai résultat de A1** — les ignorer ferait entrer
      dans la chaîne des outils qui rendent des verdicts faux :

      1. **Un profil Chrome réutilisé fausse ou bloque le verdict.** `scratchpad/` porte **3,2 Go**,
         dont **2,0 Go de profils Chrome** répartis en **41 dossiers `.chrome-*`**, tous persistants
         et tous réutilisés d'une exécution à l'autre. Deux mesures le prouvent :
         `maths/module-5/verif-cours-progression.js` annonçait « la barre affiche 0 / 13 au lieu de
         5 / 13 » — un bug du site, en apparence ; **le seul effacement de son profil le fait passer
         au vert** (5 / 13 lu, 13 liens, 0 lien mort). Et le profil de `verif-clic.js` pesait
         **362 Mo** : effacé, l'outil rejoue 2 pages en 28 s au lieu de rester bloqué. Sur les mêmes
         6 pages, profil neuf **123 s** contre **151 s** avec un profil de 88 Mo — **+ 23 %**, et
         l'écart croît avec la taille du profil. **Aucun vérificateur Chrome n'entrera dans la chaîne
         sans partir d'un profil neuf.**
      2. **Une épreuve tuée laisse le site cassé.** `preuves/execution-ancres-mutations.js`, tuée à
         614 s, a laissé sa faute injectée dans `js/execution.js` (le retour sur une ancre invalide
         rechargeait le premier exemple). Restaurée à la main, `node --check` vert. C'est exactement
         l'exigence que A4 pose, et elle vient de se matérialiser dans le relevé lui-même.
      3. **Un outil tué laisse ses Chrome.** Après le kill de `verif-clic.js`, **50 processus
         `chrome.exe`** tournaient encore. Le mode dédié devra les ramasser.

      **LE CLASSEMENT — c'est lui qui commande A2 à A5**

      *Chaîne obligatoire, mode `--rapide`* (12 outils, **11,4 s** ajoutées au total) :
      `verif-controles.js`, `verif-liste-alternatives.js`, `doc/verif-doc.js`,
      `doc/verif-normatif.js`, `doc/verif-recherche.js`, `fraicheur/verif-contraste.js`,
      `verif-sql.js`, `maths/module-5/verif-accept.js`, `maths/module-5/verif-renvois.js`,
      `maths/module-{3,4,5}/verif-expect.js`.

      *Chaîne obligatoire, mode par défaut* (5 outils, **≈ 128 s**) : `doc/verif-lexique-clic.js`,
      `doc/verif-vocab.js`, `verif-interpreteur.js`, `maths/module-5/verif-bilan.js`,
      `maths/module-5/verif-cours-progression.js` — les deux derniers **après le correctif de profil
      neuf**. Plus `verif-sorties.js` (63,7 s) **une fois A2 soldé**.

      *Chaîne, mode `--complet` seulement* : `fraicheur/verif-affichage.js` — 201 s, trop lourd
      partout ailleurs.

      *Mode dédié `--mutations` (point A4)* : les **10 épreuves**. Total mesuré **> 2 600 s, soit
      44 min**, deux non terminées en 10 minutes. Leur place n'est dans aucun mode courant, la mesure
      le confirme sans discussion.

      *Hors chaîne assumé, avec sa raison* :
      - `verif-clic.js` — **ne termine pas** : 89 pages à ≈ 20,5 s la page avec un profil neuf, soit
        30 min au mieux. Il relance Chrome page par page sur un profil qui grossit. Il reste le seul
        outil qui voie certaines fautes : à réparer, puis à verser au mode dédié, pas à la chaîne.
      - `maths/module-3/verif-cours-progression.js` et celui du module 4 — **périmés par
        construction** : ils exigent `liensLecons.length === 9` et `4` mentions « Bientôt », l'état du
        cours `maths` à mi-chantier. Le cours en publie **13 sur 13** aujourd'hui. Leur successeur à
        jour est celui du module 5, paramétrable (`--cours=`, `--attendues=`, `--terminees=`).
      - `maths/module-{3,4,5}/verif-chiffres.js` — **utilitaires paramétrés**, pas des étapes : sans
        argument ils impriment leur usage et sortent en 1. Ils sont appelés par
        `verif-chiffres-mutations.js`, qui, lui, entre au mode dédié.

      **Un angle mort trouvé au passage, et noté ici plutôt que perdu** : `verif-execution.js` ne voit
      pas la douzième faute injectée — « le compteur de pas ment d'une unité ». 11 sur 12.

- [x] **A2 · `verif-sorties.js` : trancher la question que le V15 a laissée ouverte.** Il trouve de
      vraies fautes (une leçon dont les 4 lignes publiées rendent `undefined`, un dépassement de
      délai de 10 s dans le bac à sable `vm`). Le V15 refusait de l'intégrer sans avoir d'abord
      soldé ces deux cas. **Les solder, puis l'intégrer** — ou expliquer par la mesure pourquoi il
      doit rester dehors.

      **FAIT le 2026-09-03. Les deux cas étaient des défauts de l'OUTIL, pas des fautes de
      contenu.** Les deux leçons publient une sortie exacte au caractère près ; c'est le
      vérificateur qui les accusait à tort. Le V15 avait raison de ne pas l'intégrer avant d'avoir
      regardé, et tort de supposer qu'il « trouvait de vraies fautes ».

      **Cas 1 — `pages/doc/lecon-02.html`, bloc `vocab-concurrence.txt`.** Le programme est
      **asynchrone** : ses quatre dernières lignes sortent d'un `Promise.all(...).then(...)`.
      `run()` appelait `vm.runInNewContext` et rendait la main aussitôt : **tout ce qui s'imprime
      depuis une microtâche était perdu**, et l'outil l'annonçait « undefined ». Le programme
      extrait de la page et lancé sous Node rend **exactement les 7 lignes publiées**. Correctif :
      `microtaskMode: 'afterEvaluate'` à la création du contexte — mesure avant / après sur ce
      bloc : **3 lignes récupérées contre 7**.

      **Cas 2 — `pages/offensive/lecon-07.html`, bloc `cout.txt`.** Aucune erreur non plus : le
      programme compte **7 000 064 tours** de calcul. Chronométré : **2 247 ms sous Node lancé
      directement, 11 853 ms dans le bac à sable `vm`** — **un facteur 5,3**, et l'ancien délai de
      10 s tombait juste en dessous. Sa sortie, une fois le programme mené à son terme, est
      **identique au caractère près sur ses 18 lignes**. Correctif : délai porté de 10 s à 60 s,
      avec la mesure écrite en commentaire pour que le prochain qui le lise sache d'où vient le
      chiffre. C'est la troisième fois du projet qu'**attendre une durée au lieu d'un état** produit
      une fausse alerte.

      **Rejoué en entier après correction, pas seulement sur les deux cas** (règle du chantier :
      un motif trop large casse ce qui était juste) : **449 blocs rejoués, 449 identiques au
      caractère près, 0 divergent, 93 blocs `.txt` non jugés** (illustration ou autre langage),
      code de sortie **0**, en **70 s**. Aucune régression sur les 447 qui passaient déjà.

      **Intégré à la chaîne** : modes par défaut, `--complet` et `--strict` — pas `--rapide`.
      `verif.js` passe de **32 à 33 étapes** sans option, de 34 à **35** en `--complet`. Chaîne
      complète relancée : **33 étapes, 658,1 s, tout est vert**, dont **`sorties` OK en 57,7 s**.
      Les vérificateurs hors chaîne passent de **25 à 24**, le total à régler de **35 à 34**.

      **Corrigé au passage** : `verif.js` annonçait « (patience, il pilote Chrome) » pour toute
      étape marquée `lent`. C'était devenu faux — `verif-sorties.js` est lent parce qu'il rejoue
      449 programmes, sans ouvrir un navigateur. Une étape peut désormais dire pourquoi elle est
      lente (`pourquoiLent`), le libellé Chrome restant le défaut.

      ⚠️ **Un renseignement pour A3, mesuré ici** : `verif.js --rapide` prend déjà **241,8 s**,
      soit **quatre fois la minute** que A3 pose comme seuil — et cela **avant** le moindre ajout.
      Le seuil est donc déjà franchi ; A3 doit arbitrer sur ce qu'est vraiment un mode rapide, pas
      sur les 11,4 s qu'il s'apprêtait à y verser.

- [x] **A3 · Faire entrer les vérificateurs classés « chaîne obligatoire ».** Un par un, en
      mesurant la durée ajoutée à `verif.js --rapide` et `--complet` à chaque fois. **Si le mode
      rapide dépasse une minute, il n'est plus rapide** : le dire et arbitrer.

      **FAIT le 2026-09-03. 17 vérificateurs sont entrés dans la chaîne ; les hors-chaîne passent
      de 24 à 7.** `verif.js` lance désormais **24 étapes en `--rapide`** (16 avant), **49 sans
      option** (33), **52 en `--complet`** (35), **49 en `--strict`**. Chaîne complète relancée
      après coup : **49 étapes, 784,7 s, tout est vert** (33 étapes / 658,1 s avant).

      **AUCUN N'EST ENTRÉ SUR SA RÉPUTATION.** Le classement de A1 disait « ils fonctionnent » —
      c'était une lecture, pas une mesure. Chacun des 16 candidats a donc subi une **épreuve par
      injection** (`scratchpad/a3-epreuve.js`) : une faute posée dans le fichier qu'il lit, l'outil
      relancé, son code de sortie exigé différent de 0, puis les octets d'origine réécrits et
      **relus pour comparaison** (16 fois `restaure=oui`). Résultat final : **16 / 16 fautes vues**
      — mais seulement **après trois découvertes que la lecture n'aurait pas données** :

      1. ⚠️ **`verif-sql.js` ne pouvait pas rougir.** Une colonne inexistante posée dans un `SELECT`
         d'une leçon, et il rendait **0**. Sa raison est structurelle : il ne juge qu'une
         **proportion** (seuil 55 %) et le site est à **59,1 %** — il faudrait casser **13 blocs
         d'un coup** pour le faire basculer. Le relevé qu'il imprime le dit sans qu'on l'ait
         écouté : **124 blocs SQL sur 303 rendent une erreur** à l'apprenant qui clique
         « Exécuter ». Un tel outil **mesure, il ne vérifie pas**. Correctif : un **cliquet**
         (`tools/verif-sql-attendu.json`, référence **124**) — le nombre de blocs en erreur ne doit
         jamais augmenter ; ajouter une leçon saine ne le bouge pas, en casser un seul le fait
         rougir ; `--fixer` redescend la référence après réparation, elle ne remonte jamais seule.
         Épreuve rejouée : **VU, code 1**.
      2. ⚠️ **`verif-liste-alternatives.js` est un outil d'aide, pas un vérificateur** : il ne
         contient **qu'un seul `process.exit(0)`** et ne peut donc rendre que 0. A1 l'avait classé
         « chaîne obligatoire » ; l'y mettre aurait ajouté une étape **verte par construction** —
         exactement le contrôle par vacuité que ce chantier combat. **Reclassé hors chaîne assumé.**
      3. ⚠️ **Une faute posée dans `pages/maths/cours.html` ne prouve rien** : la page de cours
         construit ses liens **en JavaScript**, depuis `js/data.js`. Deux injections successives
         (`href` inexistant, puis `href="#"`) ont laissé `mth-prg` vert sans qu'il soit aveugle. Il
         a fallu casser **le moteur qui remplit la page** (`js/cours.js`) pour que le contrôle ait
         une chance de voir — et il a vu. La leçon vaut au-delà de ce cas : *injecter dans le
         fichier qu'on lit n'est pas injecter dans ce que la page affiche.*

      **LE PROFIL CHROME NEUF, condition d'entrée posée par A1, est appliqué** —
      `tools/lib/profil-chrome.js`, un dossier temporaire par exécution, effacé à la sortie, un
      seul écouteur `exit` pour les outils qui rouvrent Chrome page par page. Mesures avant/après,
      sur les quatre outils convertis :

      | outil | avant (profil persistant) | après (profil neuf) | |
      |---|---:|---:|---|
      | `maths/module-5/verif-cours-progression.js` | 15,0 s, **code 1** | **2,8 s, code 0** | −81 % |
      | `doc/verif-lexique-clic.js` | 4,5 s | **2,5 s** | −44 % |
      | `fraicheur/verif-affichage.js` | 201,1 s | **143,5 s** | −29 % |
      | `maths/module-5/verif-bilan.js` | 14,1 s | **12,7 s** | −10 % |

      Les 401 Mo de profils devenus inutiles (`.chrome-bilan`, `.chrome-progression`,
      `.chrome-verif-lexique`, `.chrome-fraicheur`) ont été effacés : `scratchpad/` passe de
      **3,2 Go à 2,8 Go**.

      **UN DÉFAUT DE LA CHAÎNE ELLE-MÊME, trouvé en route** : quatre des outils entrants lisent des
      chemins **relatifs au répertoire courant** (`fs.readFileSync('js/lecon.js')`,
      `process.cwd()`). Lancés d'ailleurs que de la racine, ils tombent. `verif.js` **impose
      désormais `cwd: RACINE`** à chaque étape au lieu d'hériter du répertoire de l'appelant.

      **L'ARBITRAGE DU MODE RAPIDE — la minute n'est pas tenue, et c'est dit plutôt que maquillé.**
      Mesure faite **avant tout ajout** : **266,7 s pour 16 étapes**. Le seuil n'était donc pas
      menacé par les entrants, il était **déjà franchi de quatre fois**. La mesure désigne le
      coupable sans discussion : les **trois bacs à sable Git pèsent 203,6 s**, soit **76 % du mode
      rapide** (`gitcmd` 121,2 s, `gitscen` 49,4 s, `gitgraf` 33,0 s). Ils **sortent du mode
      rapide, et de lui seul** — ils restent joués par le mode par défaut, `--complet` et
      `--strict`. `gitmodl` (8,0 s) reste, pour qu'une régression du modèle de dépôt se voie quand
      même. **Rapide mesuré après, machine au repos : 77,0 s pour 24 étapes** — trois fois moins de
      temps pour huit contrôles de plus. Les onze entrants n'y coûtent que **8,2 s** ; ce qui
      dépasse la minute, ce sont trois contrôles centraux (`contenu` 15,6 s, `maths` 15,5 s,
      `exemples` 11,3 s) et les retirer viderait le mode de son intérêt. **Le seuil d'une minute
      est donc écarté par la mesure, pas atteint.**

      **Où va chacun** — 11 en `--rapide` et dans tous les modes (`caract`, `doc-ref`, `normatf`,
      `doc-rec`, `contras`, `sql-blc`, `mth-acc`, `mth-ren`, `mth-e3`, `mth-e4`, `mth-e5`) ; 5 hors
      du rapide (`lexique` 1,8 s, `vocab` 12,8 s, `interpr` 8,4 s, `mth-bil` 12,9 s, `mth-prg`
      2,7 s) ; 1 en `--complet` seul (`fr-affi`, 143,5 s).

      **Ce qui reste hors chaîne, et pourquoi** (recensé par `tools/recense-chaine.js`, qui compte
      maintenant **44 vérificateurs dont 7 hors chaîne**) : `verif-clic.js` (ne termine pas),
      `verif-liste-alternatives.js` (ne peut pas rougir), `maths/module-{3,4,5}/verif-chiffres.js`
      (utilitaires paramétrés), `maths/module-{3,4}/verif-cours-progression.js` (attentes figées sur
      un état révolu). Les **10 épreuves par injection** restantes sont l'objet de A4, et leur
      déclaration formelle celui de A5 : le recensement affiche encore **17 à régler**.

- [x] **A4 · Un mode `--mutations` pour les 7 épreuves par injection.** Elles prouvent que les
      vérificateurs voient vraiment les fautes — c'est le contrôle le plus précieux du projet et il
      n'est lancé par rien. **Exigence : chaque épreuve doit restaurer l'état initial même en cas
      d'échec**, et le mode doit le vérifier (`git status` propre à la sortie).

      **FAIT le 2026-09-03.** `node tools/verif.js --mutations` — **12 épreuves**, pas 7 : le cadrage
      en comptait sept, A1 en avait recensé dix, et le décompte réel de `--lister` en donne **douze**
      (les deux de plus sont `maths/preuve-injection.js` et `verif-chaine-mutations.js`, qu'aucun
      inventaire n'avait rattachées à cette famille). Options : `--seul=motif[,motif]`,
      `--minutes=N` (plafond par épreuve, 25 par défaut), `--lister`.

      **Ce que le mode garantit, et qu'aucune épreuve ne garantit seule.** Chaque épreuve pose déjà
      ses filets (`exit`, `SIGINT`, `uncaughtException`) et aucun ne se déclenche sur un **arrêt
      brutal** — c'est ainsi qu'A1 a retrouvé une faute injectée dans `js/execution.js`. Le mode
      relève donc l'état du dépôt **juste avant chaque épreuve**, le recompare après, **restaure
      lui-même** tout fichier laissé modifié et **compte l'épreuve en échec** (`SALE`) : une épreuve
      qui salit le dépôt a échoué même quand son verdict était bon. Il ramasse aussi les Chrome de
      test orphelins (filtrés sur la ligne de commande : le Chrome de l'utilisateur n'est jamais
      touché). La référence est relue avant chaque épreuve et non une fois pour toutes, sinon un
      fichier modifié entre-temps par un autre travail serait écrasé.

      **Relevé de ce passage — les 7 épreuves tenant dans le budget, mesurées, pas estimées :**

      | épreuve | verdict | durée | fautes vues |
      |---|:---:|---:|---|
      | `maths/module-5/verif-chiffres-mutations.js` | OK | 0,2 s | 5 / 5 |
      | `fraicheur/verif-fraicheur-mutations.js` | OK | 2,3 s | 13 / 13 |
      | `fraicheur/verif-affichage-mutations.js` | OK | 39,3 s | 14 / 14 |
      | `maths/preuve-injection.js` | OK | 30,7 s | toutes, cours intact |
      | `verif-chaine-mutations.js` | OK | 151,3 s | 9 / 9, arbre identique |
      | `verif-execution-liens-mutations.js` | OK | 100,9 s | 8 / 8 |
      | **total des six** | **6 OK** | **329,4 s** | dépôt « propre, comme au départ » |
      | `preuves/execution-ancres-mutations.js` (plafond 2 min) | **SALE** | 120,0 s | tuée : a laissé `js/execution.js` muté |

      **La septième est la preuve du filet, et c'est pour elle que le mode existe.** Tuée au plafond,
      elle a laissé `js/execution.js` modifié ; le mode l'a vu, l'a restauré, l'a comptée en échec, et
      a rendu « depot a la sortie : propre, comme au depart ». `node --check js/execution.js` vert
      après coup. Sans le mode, cette mutation partait au commit suivant.

      **Un défaut trouvé en le testant, et corrigé :** `--mutations --lister` **lançait** les douze
      épreuves au lieu de les lister. Le run interrompu a laissé une mutation dans
      `pages/js/lecon-02.html` (restaurée, `git status` propre). `--lister` est désormais inoffensif
      dans ce mode aussi. Retenir aussi que **tuer le mode lui-même ne restaure rien** : il ne protège
      que des épreuves, pas de sa propre mort.

      **Non rejouées dans ce passage, sciemment** : les 5 épreuves longues — `verif-git-modele`
      (287,6 s en A1), `verif-git-graphe` (414,5 s), `verif-git-scenarios` (538,1 s),
      `verif-execution-mutations` et `verif-git-commandes-mutations` (> 600 s chacune, non terminées
      en A1). Ensemble **plus de 45 minutes**, hors budget d'une passe qui doit aussi écrire. Leur
      relevé d'A1 tient ; le mode les enchaîne sans changement.

- [x] **A5 · Le garde-fou qui manquait.** Un contrôle qui compare la liste des `tools/**/verif-*.js`
      à ceux que `verif.js` lance réellement, et **échoue** si un vérificateur n'est dans aucun mode
      sans être déclaré « hors chaîne assumé » avec sa raison. Sans ce garde-fou, le problème
      reviendra au chantier suivant.

      **FAIT le 2026-09-03.** Deux fichiers neufs et une correction de recensement.

      1. `tools/verif-chaine-declaree.js` — il demande le recensement à `recense-chaine.js --json`,
         qui demande lui-même à `verif.js --lister` la liste de **chaque mode** : rien n'est recopié.
         **Il échoue sur cinq cas**, et chacun a été provoqué pour le vérifier, code de sortie relevé
         (et non lu au travers d'un `tail`, qui aurait rendu 0 dans tous les cas) :

         | cas provoqué | code |
         |---|:---:|
         | un `tools/verif-bidon-a5.js` créé, dans aucun mode, non déclaré | **1** |
         | raison ramenée à « TODO » (4 caractères, minimum 40) | **1** |
         | déclaration **périmée** : `verif-html.js` déclaré dehors alors que 4 modes le lancent | **1** |
         | déclaration **orpheline** : un `verif-disparu.js` qui n'existe pas | **1** |
         | `hors-chaine.json` volontairement cassé | **1** |
         | état normal du dépôt | **0** |

      2. `tools/hors-chaine.json` — les **7 dettes écrites**, chacune avec sa raison mesurée et ce
         qu'il faudrait pour la lever : `verif-clic.js` (ne termine pas), `verif-liste-alternatives.js`
         (ne peut pas rougir), les trois `maths/module-{3,4,5}/verif-chiffres.js` (utilitaires
         paramétrés, appelés par l'épreuve par injection) et les deux
         `maths/module-{3,4}/verif-cours-progression.js` (attentes figées sur un état révolu).

      3. **Une faute du recensement, trouvée en branchant le garde-fou** : `recense-chaine.js`
         n'interrogeait que quatre modes et ignorait `--mutations`, né en A4. Il comptait donc encore
         **17 outils à régler** alors que les 10 épreuves venaient d'entrer dans un mode. Corrigé :
         **17 → 7**, et les 7 restants sont exactement les 7 déclarés.

      **Mesure après branchement** (`gardech`, dans les quatre modes courants) : `verif.js --rapide`
      passe de 24 à **25 étapes, 75,6 s, tout vert** ; sans option **50** étapes, `--complet` **53**,
      `--strict` **50**, `--mutations` **12**. Le garde-fou lui-même coûte **0,2 s** — et il s'est
      d'abord signalé lui-même comme non déclaré avant d'être branché, ce qui est la meilleure preuve
      qu'il regarde le disque et non une liste écrite d'avance.

      ⚠️ **Ce qu'il ne couvre pas, et c'est assumé** : il exige qu'un vérificateur soit *lancé*, pas
      qu'il soit *capable d'échouer*. `verif-liste-alternatives.js` prouve que les deux questions sont
      distinctes. Le premier garde-fou contre la seconde est le mode `--mutations` (A4) ; l'étendre à
      tous les vérificateurs serait un chantier à part entière.

---

## PHASE B — Le biais de longueur des QCM

**89,6 % de réussite en choisissant toujours la réponse la plus longue.** Un apprenant peut valider
presque tous les QCM du site sans rien comprendre. Six cours sont à 100 % : `archi`, `equipe`,
`iac`, `mobile`, `ux`, `zig`.

La cause est mécanique et sans malice : la bonne réponse porte l'explication, les distracteurs sont
expédiés. La correction ne consiste donc **pas** à raccourcir la bonne réponse — ce serait perdre le
contenu — mais à **étoffer les distracteurs** pour qu'ils soient plausibles.

- [x] **B1 · Mesurer d'abord, et ne pas se fier au seul critère de longueur.** Relever aussi les
      autres indices qui trahissent la bonne réponse : présence d'un tiret d'explication, vocabulaire
      technique absent des autres choix, formulation prudente contre affirmation absolue. **Le
      biais de longueur n'est peut-être pas le seul, ni le pire.** Produire le tableau, choisir la
      cible chiffrée, et l'écrire ici.

      **FAIT le 2026-09-03.** `tools/mesure-biais-qcm.js` (nouveau) lit les blocs `data-quiz` et
      `data-quiz-bilan` des **sources** — **6 167 questions** dont 1 111 en QCM bilan, sur 90 cours —
      et fait jouer huit *apprenants qui ne comprennent rien*, chacun appliquant une règle mécanique
      sur le texte des options. **L'ex æquo ne compte pas pour une réussite** : quand une stratégie
      hésite entre deux options, elle tranche au hasard et l'on compte 1/n, sans quoi tous les taux
      seraient gonflés. L'étalon est l'espérance exacte du hasard, pas une simulation.

      | stratégie | réussite | sans ex æquo |
      |---|---:|---:|
      | hasard (étalon) | 25,0 % | — |
      | **la plus longue** | **89,5 %** | 88,8 % |
      | **COMBINÉ : le tiret puis la longueur** | **89,8 %** | 89,1 % |
      | **la plus détaillée** (virgules et deux-points) | **76,4 %** | 67,0 % |
      | **le mot technique exclusif** | **62,1 %** | 51,5 % |
      | l'écho de la question (mots repris de l'énoncé) | 46,7 % | 30,6 % |
      | la plus prudente (« souvent », « permet », « selon ») | 30,2 % | 8,3 % |
      | la seule à porter un tiret d'explication | 27,3 % | 3,1 % |
      | écarter les affirmations absolues | 26,3 % | 0,8 % |

      **Le plan se trompait sur deux des trois indices qu'il annonçait, et c'est le résultat de ce
      point.** Le tiret d'explication (27,3 %), l'évitement des absolus (26,3 %) et la prudence de
      formulation (30,2 %) sont **au niveau du hasard** : ils ne discriminent presque jamais (96,8 %,
      98,5 % et 87,2 % d'ex æquo). Les corriger serait du travail perdu. En revanche **deux indices
      non prévus sont réellement exploitables** : « la plus détaillée » (**76,4 %**) et « le mot
      technique exclusif » (**62,1 %**). Ils sont corrélés à la longueur — étoffer un distracteur les
      fait baisser ensemble — mais ils ne disparaissent pas avec elle : sur `doc`, dont la longueur ne
      trahit **rien** (0,0 %), « la plus détaillée » tient encore **38,4 %**.

      ⚠️ **Un chiffre spectaculaire, et faux comme faille : la bonne réponse est en première position
      dans 6 096 questions sur 6 167 (98,8 %) dans le source.** Cela ne donne aucun avantage à
      l'apprenant : `js/lecon.js` **mélange** les options (`shuffle`, appelé par `buildQuiz` pour les
      QCM de leçon comme pour les bilans). Vérifié dans le code avant d'écrire la ligne — c'est
      exactement le genre de mesure qui, prise de tête, aurait lancé une correction inutile et
      cassé les scores enregistrés.

      **Cinq cours prouvent que la cible est atteignable**, parce qu'ils ont été écrits après le
      constat : `doc` **0,0 %**, `distribue` 5,6 %, `neurones` 15,4 %, `offensive` 37,7 %,
      `compilation` 52,1 % sur le critère de longueur. Les 85 autres sont entre 81,2 % et 100 %.

      **LA CIBLE, chiffrée et tenable :**
      - **par cours traité — « la plus longue » ≤ 40 %, et aucune stratégie exploitable > 60 %.**
        C'est le niveau de `offensive` (37,7 %), atteint en écrivant, pas en rabotant.
      - **cible globale sous 60 % : hors de portée de ce chantier, et le dire vaut mieux que
        l'arrondir.** Il faudrait traiter **40 cours, soit 3 417 questions et ~10 000 distracteurs à
        étoffer** (ou 32 cours / 2 895 questions si chacun descend à 30 %). Le calcul est dans le
        commit, pas dans l'intuition.
      - **ce que B3 et B4 visent donc** : les 6 cours à **100 %** d'abord (`mobile`, `zig`, `equipe`,
        `ux`, `archi`, `iac` — **361 questions, 1 083 distracteurs**), qui ramèneraient le global de
        89,5 % à **86,0 %** ; puis des lots par ordre de nocivité, un compte rendu chiffré par lot.
      - **les quatre indices à surveiller** sont donc : longueur, détail, mot technique exclusif,
        écho de l'énoncé. Les trois écartés le sont **par la mesure**, et le vérificateur de B2 n'a
        pas à les contrôler.
- [x] **B2 · Le vérificateur, avant les corrections.** `tools/verif-qcm-biais.js` : signale une
      question dont la bonne réponse dépasse les distracteurs au-delà d'un seuil mesuré. **Éprouvé
      par injection** : des questions volontairement biaisées doivent être vues. Entre dans la
      chaîne (phase A).

      **FAIT le 2026-09-03.** Un choix de conception, d'abord, parce qu'il commande tout le reste :
      **un vérificateur qui exigerait la cible tout de suite rougirait pendant des mois** — 89,5 % de
      biais aujourd'hui, 40 cours à réécrire — **et cesserait donc d'être lu.** C'est ainsi qu'un outil
      devient décoratif. `verif-qcm-biais.js` est donc un **CLIQUET** : il ne juge pas le passé, il
      interdit qu'il empire. Il ne mesure rien lui-même, il lit `mesure-biais-qcm.js --json` (B1).

      **Quatre échecs, adossés à `tools/qcm-biais-reference.json`** (90 cours figés au 2026-09-03,
      global 89,5 %) : **régression** d'un cours de plus d'un point ; **cible perdue** par un cours
      marqué `traite` (au-dessus de 40 % sur la longueur, ou de 60 % sur toute stratégie
      exploitable) ; **cours neuf non conforme** — un cours absent de la référence doit naître sous la
      cible, ce que cinq cours récents prouvent faisable ; **référence orpheline**. La référence se
      refige avec `--ecrire`, jamais automatiquement : un cliquet qui se remet à zéro tout seul ne
      cliquette pas.

      **Éprouvé par injection — `tools/verif-qcm-biais-mutations.js`, 6 cas sur 6 vus, 7,4 s**, dépôt
      « propre, comme au départ » :

      | cas injecté | attendu | vu |
      |---|:---:|:---:|
      | 6 questions devinables ajoutées à `doc` (0,0 % au départ) | régression | ✔ |
      | 60 questions devinables, `doc` marqué « traité » | cible perdue | ✔ |
      | `zig` (100 %) retiré de la référence, il redevient un cours neuf | cours neuf non conforme | ✔ |
      | un `cours-fantome` ajouté à la référence | référence orpheline | ✔ |
      | la référence rendue illisible | code 1 | ✔ |
      | **CONTRE-ÉPREUVE : 6 questions ÉQUILIBRÉES au même endroit** | **reste vert** | ✔ |

      **La contre-épreuve est le cas qui compte le plus.** Sans elle, un outil qui rougirait sur
      *toute* modification passerait l'épreuve les cinq premiers cas : c'est exactement le défaut
      inverse de `verif-liste-alternatives.js`, qui ne peut pas rougir. Les questions équilibrées sont
      écrites avec quatre options de longueur comparable **et la bonne réponse en dernière position**,
      pour qu'aucun indice résiduel ne puisse la sauver.

      **Entré dans la chaîne** (`qcmbiai`, 0,4 s) et son épreuve dans le mode dédié : `--rapide`
      passe de 25 à **26 étapes (76,6 s, tout vert)**, sans option **51**, `--complet` **54**,
      `--strict` **51**, `--mutations` **13**.

      ⚠️ **Ce que le cliquet ne fait pas** : il ne signale pas les 5 519 questions déjà devinables.
      C'est délibéré — ce serait 90 lignes rouges à chaque passe. La dette reste mesurée par
      `mesure-biais-qcm.js` et par l'avertissement non bloquant de `verif-contenu.js` ; elle se solde
      en B3 et B4, cours par cours, et chaque gain se verrouille avec `--ecrire`.
- [x] **B3 · Les six cours à 100 %** (`archi`, `equipe`, `iac`, `mobile`, `ux`, `zig`). Étoffer les
      distracteurs. **Chaque distracteur réécrit doit rester FAUX** — c'est le piège de cette phase :
      en allongeant un mauvais choix, on le rend facilement vrai. Rejouer le QCM après correction.

      **FAIT — LES SIX COURS, le 2026-09-04.**

      | cours | avant | après | questions | distracteurs |
      |---|---:|---:|---:|---:|
      | `iac` | 100,0 % | **13,3 %** | 45 | 135 |
      | `archi` | 100,0 % | **7,3 %** | 48 | 144 |
      | `ux` | 100,0 % | **19,6 %** | 56 | 168 |
      | `equipe` | 100,0 % | **30,1 %** | 68 | 204 |
      | `mobile` | 100,0 % | **21,9 %** | 73 | 219 |
      | `zig` | 100,0 % | **23,9 %** | 71 | 213 |
      | **total** | **100,0 %** | — | **361** | **1 083** |

      **Global du site : 89,5 % → 84,8 %.** Aucune atteinte à l'intouchable sur les 361 questions
      (énoncés, index `correct`, explications, bonnes réponses), vérifiée contre `git show HEAD:`
      après chaque cours. **6 cours marqués `traite` dans le cliquet.**

      **Ce qui a été fait sur `iac`** (11 leçons, **45 questions**, 33 en QCM de leçon et 12 en QCM
      bilan) : **135 distracteurs sur 135 réécrits**, chacun tenu entre **70 % et 130 %** de la
      longueur de la bonne réponse (mesuré : 0,78 à 1,18). Six agents en parallèle, un par lot de
      leçons — **fichiers disjoints, aucune écriture concurrente**, aucun commit d'agent.

      | mesure | avant | après |
      |---|---:|---:|
      | « la plus longue » | **100,0 %** | **13,3 %** |
      | « la plus détaillée » | 62,2 % | 33,0 % |
      | « le mot technique exclusif » | 55,6 % | 31,7 % |
      | pire stratégie exploitable | 100,0 % | **33,0 %** (cible ≤ 60 %) |
      | global du site, « la plus longue » | 89,5 % | **88,9 %** |

      **LA CONTRADICTION EST CE QUI A SAUVÉ CE POINT, et le piège annoncé s'est bien produit.** Quatre
      relecteurs adversariaux ont relu les 45 questions et 180 options avec pour seule consigne de
      démolir le travail : **34 problèmes rendus, dont 22 défauts de fond** — **13 distracteurs
      devenus PARTIELLEMENT VRAIS** et **9 AMBIGUS**. Exemples, tous corrigés :
      - « count ne sait créer que des copies strictement identiques : dès qu'une taille diffère, il
        refuse le plan » — la **première moitié est la phrase même de la leçon** (« réserve `count`
        aux cas N copies vraiment identiques ») ; seule la fin est fausse, à l'endroit le moins lu ;
      - « `lifecycle { ignore_changes = all }` : la ressource sort du plan » — la leçon 09 du même
        cours enseigne `ignore_changes` comme parade à une destruction non voulue ;
      - « un `terraform.tfvars` laissé à la racine : ce n'est pas du code exécuté, donc il n'est pas
        versionné » — le lieu est celui que recommande HashiCorp ; seul le raisonnement est faux ;
      - « le verrou servant à signer chaque changement au nom de son auteur » — le `LockInfo` du
        backend **contient réellement** le champ `Who`.
      **Les 22 ont été corrigés par un seul écrivain (moi), après avoir jugé chaque remplacement**, et
      un des textes proposés a été réécrit parce qu'il répétait le motif d'un autre.

      **8 des 12 « indices résiduels » retenus aussi** : la bonne réponse était la seule à porter des
      capitales d'emphase (`LIT`, `CRÉE` — retirées, seule modification d'une bonne réponse du lot),
      la seule à s'ouvrir sur « Seulement… », deux distracteurs décrivaient le **même** objet (le
      QCM tombait à deux choix), et une option annonçait « les trois noms » en n'en citant que deux.

      ⚠️ **Deux contradictions RÉFUTÉES par la mesure, et il fallait les réfuter** : deux relecteurs
      ont conclu qu'« un apprenant qui clique toujours la première option a 45/45, donc le travail est
      cosmétique ». C'est faux : `shuffle` mélange les options dans `buildQuiz` (`js/lecon.js`) **et**
      dans `js/examen.js` ; `js/revision.js` ne montre que la bonne réponse. Vérifié dans le code
      avant d'écarter la remarque.

      ⚠️ **Une vraie prise du même relecteur, elle : le travail n'existait qu'à moitié.**
      `js/quiz-index.js` — la banque que lisent les pages **Examen** et **Révision** — portait encore
      les anciens distracteurs courts. Régénéré (`build-index.js --write --only=quiz`) ; vérifié
      ensuite dans l'index lui-même : **0 ancien distracteur, 13,3 % au même critère**. Sans cette
      régénération, l'apprenant retrouvait le QCM biaisé à l'examen.

      ⚠️ **Un contenu qui mesure le site s'est périmé en étant publié, une fois de plus.**
      `doc/verif-normatif.js` a rougi tout seul : la leçon `doc/lecon-03` publie le taux de
      manquement à sa propre règle `S3`, et mes 45 questions l'avaient déplacé. **5 439 manquements
      sur 6 103 (89,1 %) au lieu de 5 478 (89,8 %)** — **9 mentions** mises à jour dans la page
      (dont une dans l'explication d'un QCM, ce qui a demandé une **seconde** régénération de
      l'index). Contrôles finaux : `verif-normatif` **60/60**, `verif.js --rapide` **26 étapes tout
      vert**, `verif-rendu` sur les pages touchées **0 erreur / 0 avertissement**, cliquet **vert**
      avec `iac` marqué `traite` et son épreuve **6/6**.

      **LE PROTOCOLE, tel qu'il s'est stabilisé — à rejouer tel quel en B4** : (1) un agent par lot de leçons, fichiers
      disjoints ; (2) interdiction absolue de toucher `q`, `correct`, `explain` et la bonne réponse —
      **contrôlé après coup contre `git show HEAD:`**, pas sur parole, par
      `tools/mesure-qcm-intouchable.js` ; (3) fourchette 70–130 % **et les DEUX sens du biais**
      vérifiés par `tools/mesure-qcm-longueurs.js` ; (4) **contradiction adversariale obligatoire** —
      sans elle, 22 questions de `iac` et une vingtaine de `archi` avaient deux réponses défendables ;
      (5) régénérer `quiz-index` **et** relancer `doc/verif-normatif`, puis **régénérer une seconde
      fois** ; (6) marquer le cours `traite` et refiger la référence.

      ---

      **`archi` — FAIT le 2026-09-03 : 100,0 % → 7,3 %.** 12 leçons, **48 questions** (36 en QCM de
      leçon, 12 en bilan), **144 distracteurs sur 144 réécrits**, tous entre **0,72 et 1,30** de la
      longueur de leur bonne réponse. Cinq agents écrivains en parallèle sur des fichiers disjoints,
      puis cinq relecteurs adversariaux, puis **un seul écrivain (moi) pour toutes les corrections**.

      | mesure | avant | après 1ʳᵉ passe | après contradiction |
      |---|---:|---:|---:|
      | « la plus longue » | **100,0 %** | 20,8 % | **7,3 %** |
      | **« la plus COURTE »** | **0,0 %** | **53,1 %** | **8,3 %** |
      | « la plus détaillée » | 85,4 % | 39,1 % | **43,2 %** |
      | « le mot technique exclusif » | 82,5 % | 22,6 % | **25,7 %** |
      | pire stratégie exploitable | 100,0 % | 39,1 % | **43,2 %** (cible ≤ 60 %) |
      | rangs de longueur (0 = la plus longue) | **48/0/0/0** | 10/9/4/**25** | **4/14/27/3** |
      | global du site, « la plus longue » | 88,9 % | 88,3 % | **88,1 %** |

      *Colonnes « la plus longue », « détaillée », « technique » et « global » : `mesure-biais-qcm.js`,
      qui pondère les ex æquo. Colonnes « la plus COURTE » et « rangs » : `mesure-qcm-longueurs.js`,
      qui compte brut — d'où 8,3 % là où la première rend 7,3 % sur le critère symétrique. Les trois
      colonnes « avant » ont été mesurées en restaurant `pages/archi` depuis `HEAD~1`, pas recopiées.*

      ⚠️ **LA LEÇON DE CE POINT, et elle change le protocole pour les quatre cours suivants :
      ÉTOFFER LES DISTRACTEURS N'AVAIT PAS FERMÉ LA FAILLE, IL L'AVAIT RETOURNÉE.** Après la première
      passe, la bonne réponse était la **plus COURTE dans 25 questions sur 48** — « toujours la plus
      courte » rendait **53,1 %** contre 25 % au hasard, soit **au-dessus du seuil de 50 %** que
      `doc/verif-normatif.js` applique déjà au cours `doc` sur ce critère exact. Trois relecteurs sur
      cinq l'ont vu **sans se concerter**, et la mesure a tranché. C'est le même défaut de forme que
      le biais d'origine, dans l'autre sens : un correctif qui déplace une faille au lieu de la
      fermer. **`tools/mesure-qcm-longueurs.js` rend désormais les DEUX sens et la distribution des
      rangs**, pour qu'un cours « traité » soit réellement plat et pas seulement retourné.

      **68 prises rendues par les cinq relecteurs, dont une vingtaine de défauts de FOND** — des
      distracteurs devenus vrais ou défendables, tous corrigés après jugement pièce par pièce :
      - « la file achemine les messages plus vite que le bus, **qui recopie chaque événement sur
        disque avant de le diffuser** » — la seconde moitié est ce que fait réellement Kafka, que la
        leçon 08 cite elle-même dans son encadré ;
      - « le bus n'existe qu'en mode synchrone : l'émetteur **attend l'accusé de réception** » — les
        *publisher confirms* et `acks=all` existent, seul le glissement « de chaque abonné » est faux ;
      - « **l'inversion de la règle de dépendance** : à force d'adaptateurs, le domaine finit par
        importer le pilote de base » — c'est un piège que la leçon 05 enseigne dans sa propre liste ;
      - « une ADR est un **livrable contractuel** imposé par les normes du métier » — vrai dans toute
        organisation régulée ; « son numéro sert de clé primaire, le modifier casserait les liens » —
        vrai aussi, la leçon 11 renvoie elle-même à « ADR-0012 » ;
      - « la base de référence et **son cache mémoire** » pour CQRS — une base de lecture
        dénormalisée *est* fonctionnellement ce cache, et la leçon 09 la décrit ainsi ;
      - « mettre en attente les appels qui n'aboutissent pas, puis les **rejouer au rétablissement** »
        — c'est mot pour mot le « Cas réel » imprimé trois écrans plus haut dans la même leçon.

      **6 doublons** (deux distracteurs décrivant la même chose, le QCM tombant à deux choix) et une
      dizaine d'**indices de forme** corrigés : parenthèses, deux-points et capitales portés par la
      seule bonne réponse ; un motif « l'option qui parle de chiffrement est fausse » repérable d'une
      question à l'autre ; des distracteurs s'auto-disqualifiant par un absolu ou par une queue
      indéfendable. **Aucune bonne réponse n'a été touchée** : les indices de forme ont été neutralisés
      en les **ajoutant aux distracteurs**, jamais en les retirant de la bonne réponse.

      ⚠️ **Deux contradictions RÉFUTÉES par le code, comme sur `iac`** : « la bonne réponse est en
      première position, donc le travail est cosmétique » — `shuffle` mélange dans `buildQuiz`
      (`js/lecon.js`) **et** dans `js/examen.js`. Vérifié avant d'écarter la remarque.

      ⚠️ **Le contenu qui se mesure lui-même s'est périmé une seconde fois.** `doc/verif-normatif.js`
      est passé à **58/60 tout seul** : `doc/lecon-03` publie le taux de manquement à sa propre règle
      `S3`, que mes 48 questions ont déplacé — **5 439 → 5 394 manquements sur 6 103 (89,1 % →
      88,4 %)**, **9 mentions** corrigées, puis 60/60. Et **il a fallu régénérer `quiz-index` DEUX
      fois** : le chiffre figurait aussi dans l'**explication d'un QCM** de cette leçon, invisible à
      une recherche dans le bloc `data-quiz` brut. Exactement le piège de `iac`, au même endroit.

      **Contrôles finaux** : `mesure-qcm-intouchable` **0 atteinte** sur 48 questions (énoncés, index
      `correct`, explications et bonnes réponses identiques à `git show HEAD:`) ; index vérifié
      lui-même (**48 questions d'`archi`, 8,3 % au comptage brut**) ; `verif-html` **0** ;
      `verif-donnees` **0 erreur** ; `verif.js --rapide` **26 étapes tout vert (76,6 s)** ; cliquet
      refigé avec `archi` marqué `traite` (**2 cours traités**) et son épreuve par injection **6/6**.

      ⚠️ **TROUVÉ HORS PÉRIMÈTRE, non corrigé** : `verif-rendu` signale que `archi/lecon-12` déclare
      **3 exercices dans `data-exos` pour 4 blocs `.exercise`** — le bloc en excès reste sans champ de
      réponse. **Préexistant** (identique dans `HEAD`, ce n'est pas une régression) et **répandu :
      39 leçons sur 1 629** ont cet écart. Aucun vérificateur de la chaîne ne le voit ; seul
      `verif-rendu` le rend, en avertissement de console. À traiter en phase E ou en point neuf.
      ---

      **`ux` — FAIT le 2026-09-03 : 100,0 % → 19,6 %.** 11 leçons, **56 questions** (44 en QCM de
      leçon, 12 en bilan), **168 distracteurs sur 168 réécrits**, tous entre **0,72 et 1,29**. Même
      dispositif : cinq écrivains sur fichiers disjoints, cinq relecteurs adversariaux (**96 prises**),
      un seul écrivain pour les corrections.

      | mesure | avant | après 1ʳᵉ passe | après contradiction |
      |---|---:|---:|---:|
      | « la plus longue » | **100,0 %** | 25,0 % | **19,6 %** |
      | « la plus COURTE » | 0,0 % | 25,0 % | **21,4 %** |
      | « la plus détaillée » | 86,6 % | 47,9 % | **42,7 %** |
      | pire stratégie exploitable | 100,0 % | 47,9 % | **42,7 %** (cible ≤ 60 %) |
      | « le mot technique exclusif » | 64,9 % | 30,4 % | **31,4 %** |
      | rangs de longueur | **56/0/0/0** | 14/17/11/14 | **11/20/15/10** |
      | **stratégie « l'option à parenthèse »** | — | **46,1 %** | **34,1 %** (0,0 % en désignation unique) |
      | global du site, « la plus longue » | 88,1 % | — | **87,4 %** |

      ✅ **LA LEÇON D'`archi` S'EST PAYÉE IMMÉDIATEMENT.** Le piège du biais retourné a été mis dans
      la consigne des cinq écrivains (« viser une distribution PLATE des rangs »). Résultat **dès la
      première passe, sans aucun rattrapage : 25,0 % / 25,0 %, rangs 14/17/11/14** — là où `archi`
      avait basculé à 53,1 % sur « la plus courte ». Une leçon écrite dans ce plan puis remise en
      consigne vaut mieux qu'une leçon seulement constatée.

      ⚠️ **MAIS LE BIAIS S'ÉTAIT DÉPLACÉ UNE FOIS DE PLUS — DE LA LONGUEUR VERS LA PONCTUATION.** Un
      relecteur a remarqué que **seuls les distracteurs sont réécrits**, et que les nouveaux
      n'emploient presque jamais de parenthèse ni de point-virgule — restés, eux, sur les bonnes
      réponses d'origine. Mesuré : **14 questions sur 56 où la bonne réponse est la SEULE à en
      porter une**. La stratégie « choisis l'option à parenthèse » rendait **46,1 % sur `ux`** et
      **52,4 % sur `iac`** (traité au réveil précédent), contre **27,5 % sur `doc`**, le cours de
      référence. Après correction — une parenthèse **AJOUTÉE à un distracteur**, jamais retirée
      d'une bonne réponse — `ux` tombe à **34,1 %**, et la désignation unique à **0,0 %**, sous les
      5,0 % de `doc`. **La règle qui s'en dégage vaut pour B4 : corriger un indice de forme sur les
      seuls distracteurs en crée un autre, porté par ce que la bonne réponse a gardé.**

      ⚠️ **DETTE OUVERTE, mesurée et non masquée** : `iac` reste à **52,4 %** sur ce critère, et
      `archi` à **47,6 %**. Les deux cours ont été traités avant que l'indice soit connu. À reprendre
      en B4, ou en un point dédié si le cliquet doit surveiller ce critère aussi.

      **Défauts de FOND retenus sur les 96 prises**, tous corrigés : un distracteur énonçait le
      **fait canonique du « $300 Million Button » de Spool** (le bouton *Register* renommé
      *Continue*) alors que la leçon raconte la suppression d'un champ ; la **loi de Hick ne
      s'applique justement pas** à une liste triée où l'on cherche un terme connu ; une **recherche
      interne performante est une vraie parade** à un menu surchargé, et la leçon 08 le dit ;
      **WCAG 4.1.3** impose bien d'exposer les messages de statut ; l'**accessibilité intégrée est un
      apport documenté** d'un système de design ; la **signification des couleurs est imposée par des
      normes** en secteur réglementé (ISO 3864, IEC 60601-1-8) ; et le cours **affirme lui-même que
      les couleurs vives fatiguent l'œil**. Plus 8 doublons et une quinzaine d'indices de forme —
      dont une **chaîne de flèches comptable** à la place des caractères, et le mot « utilisateur »
      porté par la seule bonne réponse dans un cours d'UX.

      ⚠️ **Une contradiction RÉFUTÉE** : « la bonne réponse reste la plus longue sur telle question,
      donc le biais subsiste ». Non — **25 % par question EST le hasard** ; le grief ne vaut qu'au
      niveau du cours, où la mesure est faite. Deux relecteurs l'ont formulé, il fallait le rejeter.

      ⚠️ **`doc/lecon-03` s'est périmé une troisième fois** (5 394 → **5 349** manquements S3,
      88,4 % → **87,6 %**, 9 mentions), avec la **seconde régénération d'index** que ce piège impose.
      C'est désormais une étape du protocole, pas une surprise.

      **Contrôles** : `mesure-qcm-intouchable` **0 atteinte** sur 56 questions ; index vérifié
      lui-même ; `verif.js --rapide` **26 étapes tout vert (78,3 s)** ; `verif-html` **0** ;
      `verif-donnees` **0 erreur** ; `verif-normatif` **60/60** ; cliquet refigé avec `ux` marqué
      `traite` (**3 cours traités**) et son épreuve par injection **6/6**.

      ⚠️ **Deux défauts relevés dans `ux` sans être corrigés, faute d'entrer dans ce point** :
      l'énoncé de `ux/lecon-08` q2 n'a **pas de point d'interrogation final** (le point B3 interdit
      de toucher `q`), et la bonne réponse du bilan q6 est **identique à celle de `lecon-04` q4** —
      le bilan y rejoue une question au lieu de la vérifier. Les deux relèvent de B5.
      ---

      **`equipe` — FAIT le 2026-09-03 : 100,0 % → 30,1 %.** 14 leçons, **68 questions** (56 en QCM de
      leçon, 12 en bilan), **204 distracteurs sur 204 réécrits**, tous entre **0,70 et 1,26**. Cinq
      écrivains, cinq relecteurs adversariaux, un seul écrivain pour les corrections.

      | mesure | avant | après 1ʳᵉ passe | après contradiction |
      |---|---:|---:|---:|
      | « la plus longue » | **100,0 %** | 25,0 % | **30,1 %** |
      | « la plus COURTE » | 0,0 % | 25,0 % | **16,2 %** |
      | « la plus détaillée » | 93,8 % | 54,2 % | **45,6 %** |
      | « le mot technique exclusif » | 69,0 % | 30,6 % | **28,8 %** |
      | rangs de longueur | **68/0/0/0** | **17/17/17/17** | 21/20/16/11 |
      | stratégie « l'option à parenthèse » | — | 33,8 % (0,0 % unique) | **36,5 %** (0,0 % unique) |
      | **stratégie « l'option qui énumère »** | — | **38,5 %** (**19,1 %** unique) | **27,8 %** (0,0 % unique) |
      | **stratégie « écarter les absolus »** | 27,7 % | **32,0 %** (3 questions sûres) | **28,8 %** (0 sûre) |
      | global du site, « la plus longue » | 87,4 % | — | **86,6 %** |

      ✅ **LES DEUX LEÇONS DES COURS PRÉCÉDENTS, MISES EN CONSIGNE, ONT TENU DU PREMIER COUP.** Rangs
      de longueur **17/17/17/17** — uniforme parfait — et ponctuation à **0,0 % en désignation
      unique**, sans aucun rattrapage. Il aura fallu deux passes pour transformer une leçon
      *constatée* (`archi`) en leçon *appliquée* : c'est le seul mécanisme de ce chantier qui a
      montré un rendement croissant.

      ⚠️ **MAIS LA CONTRADICTION A TROUVÉ DEUX AUTRES BIAIS, ET LES A MESURÉS.**
      - **L'ÉNUMÉRATION** : la bonne réponse est celle qui empile trois éléments. « Choisis l'option
        à ≥ 3 virgules » rendait **38,5 %** sur `equipe`, avec **19,1 % de désignation unique**
        (13 questions sur 68), contre 25,0 % et 2,5 % pour `doc`. Corrigé en ajoutant une énumération
        à un distracteur des 12 questions concernées → **27,8 %, désignation unique 0,0 %**.
      - **LES QUANTIFICATEURS ABSOLUS** : « écarter les options à *toujours* / *jamais* / *aucun* »
        rendait **32,0 %**, avec **3 questions résolues à coup sûr**. ⚠️ Un relecteur annonçait
        35,4 % ; **ma mesure donne 32,0 %** — l'écart de méthode est noté plutôt que recopié.
        Corrigé sur `equipe` **et** sur `ux` → **0 question résolue à coup sûr sur les 4 cours**.

      ⚠️ **ET LE PIÈGE S'EST REFERMÉ PENDANT LA CORRECTION ELLE-MÊME.** En remplaçant des parenthèses
      par des énumérations, j'ai fait **remonter l'indice de ponctuation de 0,0 % à 10,3 %**.
      Rattrapé (0,0 %). **LA RÈGLE EST DÉSORMAIS ÉTABLIE, et elle vaut pour B4 : corriger un indice
      de forme en crée un autre ; il faut REMESURER TOUS LES INDICES APRÈS CHAQUE CORRECTION, pas
      seulement celui qu'on visait.**

      **Défauts de FOND corrigés** : Brooks documente lui-même l'exception des tâches parallélisables ;
      `git blame` et `bisect` ne lisent effectivement **pas** le message ; un commit poussé **peut**
      être réécrit (`rebase` + `--force-with-lease`) ; l'auto-merge après approbation existe (Mergify,
      `bors`) ; ESLint a bien des règles de style et Biome/Ruff sont linter **et** formateur ; geler la
      chaîne de déploiement **est** une mesure d'endiguement réelle ; la leçon 10 prescrit elle-même la
      somme des sous-tâches et la péremption d'une estimation ; « le coupable est celui qui
      connaissait le mieux le sujet » est l'**argument canonique** du post-mortem sans blâme ; et la
      leçon 09 enseigne elle-même qu'un bon nom rend le commentaire superflu.

      🔵 **Corrigé hors périmètre, trouvé par DEUX relecteurs indépendamment** :
      `pages/equipe/lecon-12.html` disait « le support **crênoule** sous les messages » — mot
      inexistant, lire « croule ». Présent dans `HEAD`, **aucun vérificateur ne le voyait**.

      ⚠️ **Dette laissée ouverte** : un relecteur a mesuré que « choisir l'option qui emploie un terme
      du glossaire du cours » rendrait **50,5 %** sur le bilan d'`equipe`. Non corrigé, et c'est
      délibéré : un cours emploie forcément son vocabulaire, et neutraliser cet indice demanderait
      d'injecter le jargon dans des distracteurs faux — au risque de les rendre plausibles pour de
      mauvaises raisons. **À trancher en B4 : est-ce un biais à corriger, ou la définition même d'une
      question qui vérifie qu'on a lu le cours ?**
      ---

      **`mobile` — FAIT le 2026-09-03 : 100,0 % → 21,9 %.** 15 leçons, **73 questions** (61 en QCM de
      leçon, 12 en bilan), **219 distracteurs sur 219 réécrits**, tous entre **0,70 et 1,26**.

      | mesure | avant | après 1ʳᵉ passe | après contradiction |
      |---|---:|---:|---:|
      | « la plus longue » | **100,0 %** | **24,7 %** | **21,9 %** |
      | « la plus COURTE » | 0,0 % | **24,7 %** | 20,5 % |
      | « la plus détaillée » | 85,4 % | 52,5 % | **51,9 %** |
      | « le mot technique exclusif » | 64,2 % | 21,5 % | **20,9 %** |
      | rangs de longueur | **73/0/0/0** | **18/20/17/18** | 17/22/20/14 |
      | ponctuation (désignation unique) | — | **0,0 %** | **0,0 %** |
      | énumération (désignation unique) | — | **0,0 %** | **0,0 %** |
      | absolus (désignation unique) | — | **0,0 %** | **0,0 %** |
      | global du site, « la plus longue » | 86,6 % | — | **85,7 %** |

      ✅ **LES QUATRE LEÇONS DES COURS PRÉCÉDENTS, MISES EN CONSIGNE, ONT TOUTES TENU DU PREMIER
      COUP — c'est le meilleur résultat de la série.** Dès la première passe, sans aucun rattrapage :
      « la plus longue » à **24,7 %**, soit le hasard exact ; rangs **18/20/17/18** ; et les trois
      indices de forme (ponctuation, énumération, absolus) **tous à 0,0 % en désignation unique**.
      Les quatre pièges, découverts un par un sur `archi`, `ux` et `equipe`, s'écrivent désormais en
      quatre lignes de consigne. **C'est la démonstration que ce plan sert à quelque chose : une
      leçon écrite ici et remise en consigne au tour suivant ne se repaie pas.**

      ⚠️ **TROIS INDICES ANNONCÉS PAR LES RELECTEURS, TROIS RÉFUTÉS PAR LA MESURE.** C'est le point
      de méthode du tour, et il vaut pour B4 : **un relecteur qui mesure sur SON lot de 16 questions
      extrapole à tort au cours entier.**

      | indice annoncé | annoncé | mesuré sur les 73 questions | `doc` (référence) |
      |---|---:|---:|---:|
      | « écarter les options qui citent un chiffre » | 36,5 % | **25,1 %** | 26,3 % |
      | « écarter les options à conjonction de but » | 39,6 % | **26,5 %** | 25,2 % |
      | « écarter celles qui font agir le magasin / le système » | 43,2 % | **29,2 %** | 25,0 % |

      Le troisième reste légèrement au-dessus du hasard et **2 questions sur 73 étaient résolues à
      coup sûr** : corrigées quand même. L'écart de mesure n'annule pas la prise, il la redimensionne.

      ⚠️ **UN QUATRIÈME INDICE, RÉEL MAIS GÉNÉRAL AU SITE, LAISSÉ EN DETTE ÉCRITE** : la **densité**
      de ponctuation (« choisis l'option la plus ponctuée ») rend **65,4 % sur `mobile`** — mais
      **45,0 % sur `doc`**, qui a pourtant été écrit après le constat de B1, et 60,8 % sur
      `distribue`. C'est un biais de tout le corpus, pas de ma réécriture : la bonne réponse est plus
      détaillée **par nature**. Le corriger sur un cours laisserait les 89 autres. **À trancher en B4
      avec la même question que le biais lexical : indice à neutraliser, ou propriété inhérente d'une
      bonne réponse ?**

      ⚠️ **Le piège s'est refermé pendant la correction pour la deuxième fois** : mes corrections de
      fond ont fait remonter la ponctuation de 0,0 % à **5,5 %** et l'énumération à 1,4 %. Rattrapés
      (0,0 % et 0,0 %). **La règle établie sur `equipe` tient : remesurer TOUS les indices après
      chaque correction, pas seulement celui qu'on visait.**

      **Défauts de FOND corrigés** — Zig excepté, aucun cours n'avait autant de faits réels à frôler :
      la marge tactile invisible existe vraiment (`minimumInteractiveComponentSize`, `TouchDelegate`) ;
      un `ForEach` SwiftUI sur un type non `Identifiable` **ne compile pas** ; `@FocusState` se déclare
      bien sur l'écran ; les sous-pixels RVB sont un fait matériel ; **Play App Signing régénère
      réellement une clé de téléversement perdue** ; les magasins exigent bel et bien une icône
      matricielle ; `NetworkOnMainThreadException` existe ; l'accès **limité** à la photothèque iOS et
      la localisation **approximative** Android sont deux vrais degrés de permission ; et la
      pagination par clé est enseignée par la leçon 07 elle-même.

      🔵 **Corrigé hors périmètre** : `mobile/lecon-13.html` disait « mais **tapez** dessus vous
      dépose » (impératif au lieu de l'infinitif sujet), présent dans `HEAD`. ⚠️ **Sa correction a
      périmé `js/pieges-data.js`** — et c'est `verif-donnees` (I18) qui l'a vu tout seul, pas moi :
      **toute retouche de PROSE dans un encadré d'erreur périme un index dérivé.** Régénéré avec
      `--fresh`.

      🔵 **Leçon d'organisation du fan-out** : deux agents ont écrit leurs scripts jetables dans le
      **même dossier temporaire** et se sont écrasés mutuellement (sans dommage pour le site, les
      fichiers de `pages/` étant disjoints). **Imposer un dossier scratch par agent** est désormais
      dans la consigne.
      ---

      **`zig` — FAIT le 2026-09-04 : 100,0 % → 23,9 %.** 18 leçons, **71 questions**, **213
      distracteurs sur 213 réécrits**, tous entre **0,70 et 1,29**.

      | mesure | avant | après 1ʳᵉ passe | après contradiction |
      |---|---:|---:|---:|
      | « la plus longue » | **100,0 %** | **25,4 %** | **23,9 %** |
      | « la plus COURTE » | 0,0 % | 25,4 % | 19,7 % |
      | « la plus détaillée » | 81,3 % | 46,0 % | **45,7 %** |
      | « le mot technique exclusif » | 63,7 % | 21,7 % | **21,0 %** |
      | rangs de longueur | **71/0/0/0** | 18/24/11/18 | 17/21/20/13 |
      | ponctuation, énumération, absolus (désignation unique) | — | **0,0 %** | **0,0 %** |

      ✅ **Deuxième cours d'affilée sans aucun rattrapage de forme** : les quatre pièges mis en
      consigne ont tenu du premier coup.

      ⚠️⚠️ **L'OUTIL D'INTÉGRITÉ M'A PRIS EN DÉFAUT — ET C'EST LA MEILLEURE PREUVE QU'IL SERT.** En
      suivant un relecteur qui proposait de retirer des capitales d'emphase, **j'ai modifié DEUX
      BONNES RÉPONSES** (`lecon-16` q4, `lecon-17` q3). `mesure-qcm-intouchable` les a vues
      immédiatement, avant/après à l'appui. Restaurées, et l'indice neutralisé **du bon côté** : en
      AJOUTANT des capitales à un distracteur. **Un outil qui ne sert que quand on se trompe ne
      prouve sa valeur que le jour où l'on se trompe.**

      ⚠️⚠️ **ET MON PROPRE TRAVAIL A CRÉÉ UN ANGLE MORT DANS UNE ÉPREUVE PAR INJECTION.**
      `verif-qcm-biais-mutations.js` employait **`zig` comme cours-témoin « 100 % de biais »** pour
      son cas « cours neuf non conforme ». En ramenant `zig` à 23,9 %, **j'ai fait passer ce cas VERT
      EN SILENCE** : l'épreuve ne prouvait plus rien. Témoin changé pour `stats` (99,3 %), avec un
      commentaire qui dit pourquoi et demande de **revoir ce choix à chaque cours traité**. 6/6 de
      nouveau. **C'est la même famille de faute que « un contenu qui mesure le site se périme en étant
      publié » — ici, c'est une ÉPREUVE qui se périme en étant réussie.** À vérifier en B4 : quelles
      autres épreuves par injection s'appuient sur un état du site qu'un chantier peut changer ?

      ⚠️ **Une prise de relecteur RÉFUTÉE** : « `js/quiz-index.js` contient encore *Pour ralentir le
      code* » — ce distracteur appartient au cours **`rust`**, pas à `zig`. Mais **sa prise de fond
      était juste** : l'index n'avait pas été régénéré depuis `zig`. Fait, et vérifié dans l'index.

      ⚠️ **Indices de forme rattrapés après mes corrections** : la parenthèse était passée à **9
      questions où seule une FAUSSE réponse en porte contre 2 pour la bonne** — l'indice inversé, une
      troisième fois — ramené à 6/8 ; le deux-points de 11/5 à **7/8**, mieux que `doc` (6/5).

      **Défauts de FOND corrigés** — Zig est le cours où un distracteur approximatif devient le plus
      vite exact : `ReleaseSafe` garde **réellement** ses vérifications en release ; un littéral de
      chaîne **est** un pointeur vers un tableau terminé par zéro ; `arr[1..3]` à bornes comptime rend
      un **pointeur**, pas un slice ; `else` fournit vraiment un repli d'optionnel ; une union **non
      étiquetée** permet bien de voir un `f64` comme deux `u32` ; `@ptrCast` corrigeait l'alignement
      avant que Zig ne scinde les conversions ; `std.Thread.Mutex` **panique** sur double
      verrouillage en Debug ; `pthread_join` rend vraiment une valeur ; un dossier `tests/` câblé par
      `b.addTest` est une organisation Zig réelle ; `zig cc -fsyntax-only` signale vraiment les écarts
      à la norme ; et un paramètre de type `type` est **implicitement comptime depuis Zig 0.12**.

      **Contrôles** : `mesure-qcm-intouchable` **0 atteinte** sur 71 questions ; `quiz-index` régénéré
      deux fois (`doc/lecon-03` s'est repérimé une **5ᵉ** fois : 5 243 → **5 189**, 85,9 % →
      **85,0 %**) ; `verif-normatif` **60/60** ; `verif.js --rapide` **26 étapes tout vert (77,9 s)** ;
      `verif-html` **0** ; `verif-donnees` **0 erreur** ; cliquet refigé (**6 cours traités**),
      épreuve **6/6** avec son témoin corrigé.

      ---

      **CE QUE B3 A APPRIS, ET QUI VAUT POUR B4 :**
      1. **Un correctif de forme DÉPLACE le biais, il ne le supprime pas.** Longueur → longueur
         inversée → ponctuation → énumération → absolus → ponctuation inversée. Cinq déplacements
         mesurés en six cours. **Remesurer TOUS les indices après CHAQUE correction.**
      2. **Une leçon écrite dans ce plan ne se repaie que si elle est remise EN CONSIGNE au tour
         suivant.** Les quatre pièges ont coûté trois cours à découvrir, puis ont tenu du premier
         coup sur les deux derniers.
      3. **Un relecteur qui mesure sur son lot extrapole faux.** Trois indices annoncés à 36-43 %
         mesuraient 25-29 % sur le cours entier. **Toujours remesurer sur le corpus complet.**
      4. **La contradiction reste le seul usage d'agents qui paie** : ~20 à 30 défauts de fond par
         cours, dont des distracteurs devenus littéralement vrais.
      5. **Ce que le chantier n'a pas tranché** : la « plus détaillée » reste entre 42 et 52 % sur
         les six cours, et deux indices (densité de ponctuation, vocabulaire du glossaire) sont
         **généraux au site** — `doc`, écrit après le constat de B1, est à 45,0 % sur le premier.
         **La question de B4 est là : est-ce un biais, ou la définition même d'une bonne réponse ?**

      **Contrôles** : `mesure-qcm-intouchable` **0 atteinte** sur 73 questions ; `quiz-index` régénéré
      deux fois (`doc/lecon-03` s'est repérimé une **4ᵉ** fois : 5 301 → **5 243**, 86,9 % →
      **85,9 %**) ; `verif-normatif` **60/60** ; `verif.js --rapide` **26 étapes tout vert (78,3 s)** ;
      `verif-html` **0** ; `verif-donnees` **0 erreur** ; cliquet refigé (**5 cours traités**),
      épreuve **6/6**.

      **Contrôles** : `mesure-qcm-intouchable` **0 atteinte** sur 68 questions ; `quiz-index` régénéré
      deux fois (`doc/lecon-03` s'est repérimé : **5 349 → 5 301**, 87,6 % → **86,9 %**) ;
      `verif-normatif` **60/60** ; `verif.js --rapide` **26 étapes tout vert (78,8 s)** ; `verif-html`
      **0** ; `verif-donnees` **0 erreur** ; cliquet refigé (**4 cours traités**), épreuve **6/6**.
- [ ] **B4 · Les cours suivants, par lots.** Jusqu'à la cible fixée en B1.

      **CADRAGE MESURÉ le 2026-09-04, après la clôture de B3** — le classement est fait par
      **nocivité réelle** (questions devinables = questions × taux), pas par taux seul : traiter un
      petit cours à 99 % rapporte moins qu'un gros à 92 %.

      | | |
      |---|---:|
      | Cours encore au-dessus de 60 % | **79 sur 90** |
      | Questions devinables restantes | **5 081 sur 6 167** |
      | Global « la plus longue » | **84,8 %** |

      **Les dix cours les plus nocifs**, dans l'ordre où B4 doit les prendre :

      | rang | cours | questions | « la plus longue » | devinables | cumul |
      |---:|---|---:|---:|---:|---:|
      | 1 | `js` | 218 | 95,4 % | 208 | 208 |
      | 2 | `python` | 173 | 91,6 % | 159 | 367 |
      | 3 | `css` | 171 | 91,9 % | 157 | 524 |
      | 4 | `html` | 160 | 92,1 % | 147 | 671 |
      | 5 | `maths` | 117 | 82,8 % | 97 | 768 |
      | 6 | `algo` | 92 | 96,2 % | 89 | 856 |
      | 7 | `nodejs` | 89 | 95,5 % | 85 | 941 |
      | 8 | `bdd` | 86 | 97,7 % | 84 | 1 025 |
      | 9 | `projets-js` | 84 | 98,8 % | 83 | 1 108 |
      | 10 | `react` | 86 | 92,2 % | 79 | 1 188 |

      **Ce que ça implique — calculé, pas arrondi** : les 10 premiers cours totalisent **1 276
      questions dont 1 188 devinables (19,3 % du site)**. En les ramenant au taux moyen atteint sur
      les six cours de B3 (**19,4 %**), il resterait 281 questions devinables sur ce lot, soit un
      **gain de 907 questions = 14,7 points** : le site passerait de **84,8 % à 70,1 %**. Toujours
      au-dessus de la cible de 60 % fixée en B1, qui demandait 40 cours. ⚠️ **B4 ne doit donc pas
      promettre la cible : elle doit livrer des lots mesurés.** (Premier jet de ce cadrage : « environ
      65 % », écrit de tête et faux de 5 points — le calcul est dans le commit.)

      ⚠️ **Un cours de B4 pèse jusqu'à 3 fois un cours de B3** : `js` seul fait **218 questions et
      654 distracteurs**, contre 73 et 219 pour `mobile`, le plus gros de B3. Le protocole à 5
      écrivains + 5 relecteurs ne s'y transpose pas tel quel — il faudra soit découper `js` en deux
      passes déclarées, soit accepter 8 à 10 lots d'écriture. **À décider avant de commencer, pas
      en cours de route.**

      ⚠️⚠️ **CONTRAINTE CRÉÉE PAR B3, à ne pas oublier : `stats` (99,3 %) est désormais le
      cours-témoin de `verif-qcm-biais-mutations.js`**, qui a besoin d'un cours réellement biaisé
      pour son cas « cours neuf non conforme ». **Si B4 traite `stats`, l'épreuve repassera verte en
      silence** — exactement la faute que B3 a corrigée sur `zig`. Changer le témoin AVANT de
      traiter le cours, jamais après.

      **LE PROTOCOLE DE B3 s'applique tel quel** (il est écrit au-dessus, avec ses six comptes
      rendus). Les cinq leçons à remettre en consigne dès le premier lot : les quatre pièges de
      forme (longueur dans les deux sens, ponctuation, énumération, absolus), et le fait que
      **corriger un indice en crée un autre**.

      ---

      **LE DÉCOUPAGE DE `js`, DÉCIDÉ AVANT DE COMMENCER comme le cadrage l'exigeait : DEUX PASSES.**
      65 leçons, 218 questions, 654 distracteurs — trois fois `mobile`, le plus gros cours de B3.
      **Passe 1 = leçons 01-36** (108 questions, 324 distracteurs). **Passe 2 = leçons 37-65**
      (110 questions, 330 distracteurs, dont les deux QCM bilan). La coupure est à mi-corpus et non
      à la frontière du bilan de la leçon 42, qui aurait donné 141 / 77.

      **`js` PASSE 1 — FAIT le 2026-09-04. Les 324 distracteurs des leçons 01 à 36 réécrits.**
      Six écrivains sur fichiers disjoints, six relecteurs adversariaux, six correcteurs — un seul
      écrivain par fichier à tout instant, aucun commit d'agent.

      | indice, sur les 108 questions | avant | après |
      |---|---:|---:|
      | la plus longue | **99,5 %** | **19,3 %** |
      | la plus COURTE | 0,0 % | **24,1 %** (le biais ne s'est PAS retourné) |
      | la plus détaillée | 77,2 % | **19,3 %** |
      | le mot technique exclusif | 95,1 % | **16,7 %** |
      | l'écho de l'énoncé | 67,1 % | **21,8 %** |
      | **l'incise entre parenthèses** | 73,8 % | **35,3 %** |
      | **la MAJUSCULE d'emphase** | 44,0 % | **30,3 %** |
      | le point-virgule | 68,1 % | **34,9 %** |
      | rangs de longueur de la bonne réponse | **108 / 0 / 0 / 0** | **23 / 26 / 34 / 25** |
      | distracteurs hors de 70-130 % | **322** | **0** (0,70 à 1,30) |

      **Cours `js` entier : 95,4 % → 55,7 %** (les 29 leçons de la passe 2 pèsent encore).
      **Global du site : 84,8 % → 83,4 %.** `mesure-qcm-intouchable` : **0 atteinte** sur les
      208 questions — énoncés, index `correct`, explications et bonnes réponses identiques à
      `git show HEAD:`. La case reste **décochée** : une passe sur deux, et neuf cours sur dix.

      ⚠️⚠️ **CE POINT A TROUVÉ UN TROU DANS LA MESURE DE B1, ET C'EST SON RÉSULTAT PRINCIPAL.**
      B1 avait fait jouer huit stratégies et conclu que la longueur était le biais. **Les six
      relecteurs adversariaux ont tous signalé, sans se concerter, un indice qu'AUCUNE des huit ne
      voyait : l'incise entre parenthèses, portée par la seule bonne réponse.** Mesuré après coup :
      **59,2 % sur les 6 167 questions du site** — le DEUXIÈME indice, devant le mot technique
      exclusif. Il est maintenant dans `mesure-biais-qcm.js`, avec « la MAJUSCULE d'emphase »
      (31,2 % sur le site, 44,0 % sur ce lot).

      **Et il fallait mesurer avant de les croire : sur trois de leurs quatre affirmations de forme,
      les relecteurs se sont trompés.** Ils annonçaient la parenthèse « inchangée, 12/12 = 100 % » et
      le point-virgule « 5/5 = 100 % » : mesurés sur les 108 questions en pondérant les ex æquo,
      **73,8 % → 61,7 %** et **68,1 % → 40,3 %** après la seule première passe. Ils comptaient les
      questions où l'indice se **déclenche**, pas la réussite — la même erreur de méthode que
      « la bonne réponse est en première position ». Un quatrième a affirmé « l'option la plus courte
      n'est jamais la bonne, 18/18 » : sur 108 questions la stratégie rend **25,9 %** contre 25,0 %
      au hasard. **En revanche ils avaient raison sur la capitale d'emphase — 44,0 % avant,
      44,9 % après la première passe, l'indice n'avait pas bougé d'un pouce** pendant que la longueur
      tombait de 99,5 % à 23,1 %. C'est la leçon 3 de B3 qui se répète : *un relecteur qui mesure sur
      son lot extrapole faux* — mais ce qu'il **voit** reste juste, et lui seul l'a vu.

      **137 prises rendues (71 de FOND, 66 de FORME), 117 retenues après jugement.** Les défauts de
      fond sont les mêmes qu'en B3, en pire, parce qu'en JavaScript un distracteur approximatif
      devient exact plus vite qu'ailleurs :
      - « `sort()` n'est pas spécifiée pour les nombres » — c'est **l'argument même de la leçon**
        pour justifier le comparateur, et la stabilité de `sort` était bien *implementation-defined*
        avant ES2019 ;
      - « l'affectation se comporte comme `Object.assign({}, a)` : chaque variable reçoit sa propre
        référence » — **littéralement vrai**, et dans le vocabulaire de la bonne réponse ;
      - « `innerHTML` … mais un peu plus lent » — **exact**, et la leçon l'écrit trois écrans plus bas ;
      - « `requestAnimationFrame` planifie une microtâche vidée avant chaque rendu » — **tout est vrai
        sauf le mot « microtâche »** : le bon mécanisme sous un mauvais nom ;
      - « la promesse de `fetch` ne rejette que si la connexion se ferme avant l'envoi d'un corps » —
        **la règle exacte de la spécification Fetch** ;
      - « un `import` n'est évalué qu'une fois, sauf si les deux emploient le même chemin relatif » —
        l'exception est déclenchée par l'énoncé lui-même, donc l'option **se replie sur la bonne
        réponse**, et elle est **techniquement plus exacte qu'elle** (le cache ESM est indexé par URL
        résolue) ;
      - « un champ de classe est évalué au chargement » — **vrai des champs `static`** ;
      - « `JSON.stringify` refuse tout objet non sérialisable » — **vrai** des références circulaires
        et des `BigInt`.

      ⚠️ **LES CORRECTEURS ONT REFUSÉ 20 PRISES, ET SURTOUT UNE TRENTAINE DE TEXTES DE REMPLACEMENT
      — le relecteur reproduisait le défaut qu'il dénonçait.** Exemples : « `"click"` se déclenche
      avant `"submit"` » (vrai) ; « `unshift` renvoie la nouvelle taille » (vrai, et la leçon dit
      l'inverse de ce que le relecteur croyait) ; « `sort()` range selon le nombre de chiffres »
      (donnerait `[1, 2, 10]`, or l'énoncé affiche `[1, 10, 2]` : l'option **se réfute contre son
      propre énoncé**) ; un texte contenant `document.write("<li>")`, c'est-à-dire un chevron
      interdit ; un texte proposant `NULL` comme capitale d'emphase, mot qui figure dans la liste des
      **sigles** et n'aurait donc rien neutralisé. **La contradiction doit elle-même être contredite.**

      ⚠️ **LE BIAIS S'EST RETOURNÉ DANS TROIS LOTS SUR SIX, ET LES ÉCRIVAINS L'ONT VU EUX-MÊMES.**
      Après leur première vague de corrections, « la plus longue » tombait à **0,0 %** (lots 07-12 et
      19-24) et à 5,6 % (lot 31-36), « la plus COURTE » montant à **44,4 %** : la bonne réponse
      n'était plus *jamais* la plus longue, ce qui est une règle d'élimination aussi rentable que le
      biais d'origine. Les trois ont fait une seconde vague sans qu'on le leur demande. **C'est la
      preuve de la leçon 2 de B3 : une leçon écrite dans ce plan ne se repaie que si elle est remise
      EN CONSIGNE au tour suivant.** Elle l'était, et elle a payé trois fois.

      **L'OUTILLAGE A ÉTÉ CORRIGÉ EN CONSÉQUENCE, en trois points :**
      1. `mesure-biais-qcm.js` mesure **deux indices de plus** (parenthèse, capitale d'emphase),
         avec une liste de sigles du métier — sans elle, `HTML` ou `JSON` compteraient pour un cri et
         la mesure ne voudrait rien dire.
      2. `verif-qcm-biais.js` : **« l'incise entre parenthèses » entre dans `EXPLOITABLES »**.
         Vérifié AVANT de l'inscrire : les six cours marqués `traite` en B3 sont entre **36,6 % et
         48,9 %** dessus, donc l'ajout ne fait rougir personne — c'est la condition pour qu'un cliquet
         reste lu. « La MAJUSCULE d'emphase » n'y entre **pas** : 31,2 % sur le site, soit le niveau
         exact de « la plus prudente » (30,1 %) que B1 avait écartée ; la même règle doit valoir pour
         les deux.
      3. `verif-qcm-biais-mutations.js` passe de 6 à **7 cas**, et le 7ᵉ existe pour une raison
         précise : **une branche d'`EXPLOITABLES` que rien n'éprouve ne vaut pas mieux qu'un
         vérificateur absent.** Le cas injecte 60 questions de longueur, de ponctuation et de
         vocabulaire équilibrés dont **seule la bonne réponse porte une incise**, et le motif attendu
         **nomme la parenthèse** : si le verdict tombait sur « la plus longue », le cas prouverait
         l'ancienne branche et pas la neuve. **7/7.** Le cours-témoin `stats` (99,3 %) est intact,
         comme le cadrage l'exigeait.

      ⚠️ **UN PIÈGE D'ENVIRONNEMENT, trouvé deux fois indépendamment, et qui ne se voit à AUCUN
      contrôle : le heredoc du shell de cet environnement AVALE un antislash doublé.** `"\\d{5}"`
      arrive dans le fichier comme `\d{5}` en Python (avertissement) mais `"\\b"` y arrive comme un
      **vrai caractère U+0008**. Conséquences vécues : la stratégie « MAJUSCULE d'emphase » a rendu
      **25,0 %, soit exactement le hasard**, pendant deux mesures — un chiffre qui ressemblait à un
      résultat ; et un correcteur a publié `/d{5}/` au lieu de `/\d{5}/` dans un distracteur.
      **Ni `JSON.parse`, ni les mesures, ni `mesure-qcm-intouchable` ne le voient** — c'est exactement
      l'accident qui avait fait afficher « 0 leçon cite une RFC » dans `gen.js`. Écrire les motifs par
      `String.fromCharCode(92)`, ou passer par l'outil d'écriture de fichier. Contrôle ajouté après
      coup sur les 432 options du lot : **0 caractère de contrôle, 3 expressions régulières intactes**.

      ⚠️ **`doc/lecon-03` s'est périmé une SIXIÈME fois**, et cette fois il portait en plus une
      **incohérence interne** : 85,0 % à un endroit, **89,8 %** à un autre pour la même grandeur,
      resté d'une passe antérieure. Recalculé : **5 189 → 5 101 manquements, 85,0 % → 83,6 %**, et
      **29 → 30 leçons parlant de « la spécification »** — ce dernier parce qu'un distracteur neuf
      emploie le mot. **11 mentions** corrigées, `quiz-index` régénéré **deux fois** (le chiffre était
      aussi dans l'explication d'un QCM), `verif-normatif` revenu à **60/60**. Le script de
      remplacement a **refusé d'écrire** au premier essai : j'avais annoncé 4 occurrences là où il y
      en avait 5, parce que `grep -c` compte des lignes et non des occurrences. *Un motif de
      remplacement trop large casse ce qui était juste* — le garde-fou est ce qui l'a empêché.

      ⚠️⚠️ **TROUVÉ EN ROUTE, ET CORRIGÉ : INTERROMPRE `verif.js --mutations` PUBLIE UNE FAUTE.**
      Le mode a été arrêté après 25 minutes (13 épreuves, plafond de 25 min chacune : il n'est pas
      fait pour être attendu dans une passe). Le `git status` qui a suivi a montré **`js/execution.js`
      modifié** : une mutation injectée — la flèche droite du visualiseur amputée de son
      `aller(etat.pas + 1)` — restée dans l'arbre de travail. Les filets du harnais couvrent `exit`,
      `SIGINT` et `uncaughtException`, **pas l'arrêt brutal**, et ses propres commentaires le disent.
      **Le pire n'est pas là : au passage suivant, le mode a compté ce fichier parmi « 3 fichiers
      déjà modifiés, ignorés » — sans les nommer.** Une mutation orpheline se fondait donc dans le
      chantier en cours, et seul un `git status` manuel l'a vue. Sans lui, **un raccourci clavier
      cassé partait dans le commit de ce point.** `verif.js` **nomme désormais** chaque fichier déjà
      modifié et avertit que l'un d'eux peut être la trace d'un passage interrompu. Deux lignes.
      C'est la même famille que « un vérificateur hors chaîne vaut un vérificateur inexistant » :
      **un compteur qui ne nomme pas ce qu'il compte cache ce qu'il compte.**

      ⚠️ **Et la même famille encore, à un autre endroit** : le mode `--mutations` déclarait
      l'épreuve du cliquet à **« 6 / 6 »** alors qu'elle en rend 7 depuis ce point. L'étiquette n'est
      pas une assertion — le verdict vient du code de sortie — mais **un relevé faux dans le pilote
      est un relevé qu'on finira par croire.** Corrigé, et l'épreuve rejouée dans le mode : `qcmbiai`
      **OK en 7,8 s**, « dépôt à la sortie : propre, comme au départ ».

      **Contrôles finaux** : `verif.js --rapide` **26 étapes tout vert (78,6 s)** ; `verif-html`
      **0 / 1 629 fichiers** ; `verif-donnees` **0 erreur** ; `verif-normatif` **60/60** ; cliquet
      **vert**, refigé (`js` **non** marqué `traite` : 55,7 % contre une cible de 40 %), épreuve
      **7/7**.

      **CE QUI RESTE À FAIRE SUR B4, sans arrondir** : la passe 2 de `js` (leçons 37-65, 110 questions,
      330 distracteurs), puis `python`, `css`, `html`, `maths`, `algo`, `nodejs`, `bdd`, `projets-js`,
      `react`. **Et une question neuve, ouverte par ce point** : les 84 cours non traités n'ont jamais
      été mesurés sur la parenthèse. À 59,2 % de moyenne, l'ordre de nocivité du cadrage — établi sur
      la seule longueur — **est peut-être à refaire**.

      ---

      **`js` PASSE 2 — FAIT le 2026-09-04, dans la même passe. LES 330 DISTRACTEURS DES LEÇONS 37 À
      65, LES DEUX QCM BILAN COMPRIS. LE COURS `js` EST CLOS.**

      | indice, sur les 110 questions | avant | après |
      |---|---:|---:|
      | la plus longue | **91,4 %** | **22,3 %** |
      | la plus COURTE | 2,7 % | **23,2 %** |
      | la plus détaillée | 80,3 % | **24,5 %** |
      | le mot technique exclusif | 83,2 % | **22,7 %** |
      | l'écho de l'énoncé | 62,2 % | **23,5 %** |
      | l'incise entre parenthèses | 65,7 % | **26,8 %** |
      | la MAJUSCULE d'emphase | 38,9 % | **25,5 %** |
      | le point-virgule | 50,1 % | **26,4 %** |
      | rangs de longueur | **101 / 3 / 3 / 3** | **26 / 22 / 37 / 25** |
      | hors de 70-130 % | **311** | **9** (décision assumée, voir plus bas) |

      **Les douze stratégies tiennent entre 22,3 % et 26,8 %** — le hasard vaut 25,0 % — et la colonne
      « désigne la SEULE bonne réponse » est à **0,0 % sur les quatre indices de forme**, contre
      54,5 %, 20,0 %, 32,7 % et 8,2 % au départ.

      **LE COURS ENTIER : « la plus longue » 95,4 % → 20,8 %, et aucune stratégie au-dessus de
      31,0 %.** La cible de B1 (≤ 40 % sur la longueur, ≤ 60 % sur toute stratégie exploitable) est
      atteinte : **`js` est marqué `traite`, 7ᵉ cours verrouillé.** Global du site **84,8 % → 82,2 %**.
      `js` était le cours le plus nocif du site : 218 questions, 208 devinables.

      **LA CONSIGNE RÉÉCRITE A PAYÉ IMMÉDIATEMENT.** La passe 1 avait dû être reprise entièrement
      parce que la parenthèse et la capitale n'étaient pas dans la consigne. Elles y étaient pour la
      passe 2, **avec les huit indices dans un seul tableau** : dès la première vague d'écriture, les
      douze stratégies sortaient entre 21,8 % et 26,5 %, colonne solo à 0,0 %. **Aucune reprise de
      forme n'a été nécessaire ; la contradiction a pu porter entièrement sur le FOND.** C'est la
      démonstration la plus nette de la leçon 2 de B3.

      ⚠️⚠️ **LE DÉFAUT QUI FONDE TOUTE CETTE CHAÎNE S'EST PRÉSENTÉ EN PERSONNE : UNE BONNE RÉPONSE
      ÉTAIT FAUSSE, ET LE DISTRACTEUR ÉTAIT VRAI.** `js/lecon-48` q3 demandait ce qui arrive quand on
      lit `response.body` deux fois avec `for await`. La bonne réponse disait « la seconde échoue ».
      Un relecteur l'a contredit **en exécutant le code sous Node et sous Chrome** ; je l'ai reproduit
      moi-même (`scratchpad/b4-preuve-lecon48b.js`) :

      | ce qu'on fait après la première boucle | ce qui se passe RÉELLEMENT |
      |---|---|
      | un second `for await` sur `response.body` | `bodyUsed=true`, `locked=false`, **0 morceau, AUCUNE erreur** |
      | `await response.text()` | **TypeError « Body is unusable: Body has already been read »** |
      | `response.clone()` | **TypeError « Body has already been consumed »** |
      | `for await` pendant qu'un lecteur tient le verrou | **TypeError « ReadableStream is locked »** |

      **Et la leçon se contredisait elle-même** : son corps enseigne, correctement, « une fois `done`,
      le réitérer ne redonne rien » — c'est-à-dire *pas d'erreur*. Seul le QCM prétendait le contraire.
      **Quatre vérificateurs verts, une leçon qui se dément à trois écrans d'intervalle, et aucun outil
      qui exécute.** Correctif minimal, décidé et écrit avant d'être appliqué : l'énoncé déplace la
      seconde lecture vers `response.text()`, qui lève réellement ; **la bonne réponse n'est pas
      touchée d'un caractère** (vérifié contre `git show HEAD:`) ; l'explication publie la mesure
      *et* la nuance ; les trois distracteurs sont reportés sur `text()`. La liste « Vérifie ta
      compréhension » du corps, qui posait encore l'ancienne question, pose maintenant les deux cas.
      `mesure-qcm-intouchable` rend **exactement 2 atteintes — l'énoncé et l'explication de cette
      seule question**, celles que j'ai autorisées nommément à l'écrivain du lot, et rien d'autre.

      ⚠️⚠️ **ET CHANGER CET ÉNONCÉ A PERIMÉ L'INDEX SANS RIEN CASSER D'APPARENT.** `build-index.js`
      **conserve les entrées de l'ancien index** : la question d'origine y a survécu à côté de la
      neuve — 6 151 → **6 152** entrées, et l'examen aurait servi **les deux versions**, dont la
      fausse. Rien ne rougissait : ni `verif-html`, ni la chaîne, ni le cliquet. **Seul l'invariant
      I18 de `verif-donnees` l'a vu**, en nommant la question périmée. Purgé par
      `build-index.js --write --fresh` — 6 151 entrées, I18 vert. **À retenir : régénérer l'index ne
      suffit pas quand on modifie un ÉNONCÉ, il faut le purger.**

      **82 prises de contradiction (46 de FOND, 36 de FORME), toutes retenues sur le fond — mais
      environ 45 textes de remplacement sur 82 ont été RÉÉCRITS par les correcteurs.** Le motif est
      constant et instructif : *le relecteur vérifie son texte isolément et ne remesure jamais le
      lot*. Appliqués tels quels, ses textes cassaient la forme qu'il venait de louer — sur le lot
      43-48, la parenthèse remontait de 25,0 % à **34,7 %** et se remettait à désigner la seule bonne
      réponse, parce que ses dépersonnalisations retiraient la parenthèse du seul distracteur qui en
      portait une ; sur 49-54, **six** des treize indices sortaient de la bande. Deux correcteurs ont
      pris l'habitude de **simuler leurs corrections en mémoire avant d'écrire** ; c'est ce qu'il faut
      généraliser au lot suivant.

      **TROIS INDICES QUE NOS DEUX OUTILS NE VOIENT TOUJOURS PAS, mesurés indépendamment par les
      relecteurs et reproduits par les correcteurs :**
      - **« l'option qui prête une intention au moteur est fausse »** — *le moteur décide*, *le
        navigateur choisit* : **30,1 %**, trouvé sur deux lots séparément et reproduit au chiffre
        près par un correcteur qui a réimplémenté la mesure. Ramené à 25,0-26,9 %.
      - **les tics rhétoriques** (clause méta « c'est ceci qui sépare les deux », glose finale entre
        parenthèses, « de son côté / , lui, », bourrage « seul / direct ») : **38,8 %** sur le lot
        61-65, présents dans 15 distracteurs et **jamais** dans une bonne réponse. Ramenés à 26,4 %.
      - **les absolus, que notre motif SOUS-ESTIME** : il compte « rien » et « n'existe pas », que
        certaines bonnes réponses portent, ce qui masque le déséquilibre. Mesuré à **34,7 %** sur le
        lot 55-60 par un motif restreint. **Ce sont trois candidats pour B5.**

      ⚠️ **UNE DÉCISION ASSUMÉE, ET CHIFFRÉE : la fourchette 70-130 % cède quand la bonne réponse est
      un JETON DE CODE.** Sur les QCM bilan, quatre bonnes réponses sont `null` (4 caractères),
      `const` (5), `object` (6), `undefined` (9) : la fourchette n'autorise alors que 3 à 12
      caractères, et il n'existe pas de troisième mot-clé de déclaration en JavaScript. Le correcteur
      a mesuré que sur le bloc bilan seul, « la plus longue » rend **15,0 %** et « la plus courte »
      **20,0 %**, toutes deux **sous** le hasard : la longueur n'y désigne rien, la fourchette n'a
      plus rien à protéger. **Le critère opérant n'est pas le ratio, c'est l'HOMOGÉNÉITÉ DE GENRE** —
      une phrase rédigée au milieu de trois jetons de code, ça, c'est une vraie fuite. D'où les
      9 options hors bande, revendiquées. Et une correction dans l'autre sens : un écrivain avait
      remplacé `une chaîne vide ""` et `une erreur est levée` par `false` et `NaN`, qui s'éliminent
      par simple cohérence de type — **il avait rendu la question plus facile en croyant l'améliorer**.
      Restauré.

      **Quatre autres défauts trouvés PAR EXÉCUTION, hors périmètre, non corrigés — à trancher :**
      1. l'énoncé de `js/lecon-39` q3 écrit `"élève".sort()` : `String.prototype.sort` **n'existe
         pas** (`TypeError`, vérifié). La leçon, elle, écrit correctement `mots.slice().sort()` ;
      2. l'explication de `js/lecon-53` q1 dit « espace **fine** insécable » ; la sortie mesurée de
         `Intl.NumberFormat` est **U+00A0**, l'espace insécable ordinaire. La bonne réponse, elle, a
         raison ;
      3. « WeakMap n'accepte que des objets » est **daté depuis ES2023** : `new WeakMap().set(Symbol("x"), 1)`
         passe, alors que `Symbol.for("…")` lève. Aucun distracteur n'en devient vrai ;
      4. le corps de `js/lecon-53` dit « trivial en français (**deux** formes) » ;
         `new Intl.PluralRules("fr").resolvedOptions().pluralCategories` rend **`["one","many","other"]`**.
      **Les quatre sont dans l'intouchable ou dans le corps d'une leçon : ils relèvent d'un point à
      part, pas d'une passe sur les distracteurs.**

      ⚠️ **`doc/lecon-03` s'est périmé une 7ᵉ fois** : 5 101 → **5 024** manquements, 83,6 % →
      **82,3 %**, 30 → **34 leçons parlant de « la spécification »**. 11 mentions, index régénéré deux
      fois puis **purgé**, `verif-normatif` **60/60**. Le script à garde-fou a de nouveau exigé le
      compte exact avant d'écrire.

      **Contrôles finaux** : `verif.js --rapide` **26 étapes tout vert (79,0 s)** ; `verif-html`
      **0 / 1 629** ; `verif-donnees` **0 erreur** (I18 revert au vert après la purge) ;
      `verif-normatif` **60/60** ; cliquet **vert**, refigé, **7 cours traités** (`archi`, `equipe`,
      `iac`, **`js`**, `mobile`, `ux`, `zig`) ; épreuve par injection **7/7**, témoin `stats`
      (99,3 %) intact.

      ---

      **OÙ EN EST B4 — LA CASE RESTE DÉCOCHÉE, ET VOICI POURQUOI, CHIFFRÉ.**

      | | |
      |---|---:|
      | Cours traités (B3 + B4) | **7 sur 90** |
      | Questions traitées | **579 sur 6 167** |
      | Global « la plus longue » | **89,5 % → 82,2 %** |
      | Cours encore au-dessus de 60 % | **78 sur 90** |

      `js` était le n° 1 de la liste de nocivité et il est clos. **Restent les neuf autres du
      premier lot** : `python` (173 q, 91,6 %), `css` (171, 91,9 %), `html` (160, 92,1 %), `maths`
      (117, 82,8 %), `algo` (92, 96,2 %), `nodejs` (89, 95,5 %), `bdd` (86, 97,7 %), `projets-js`
      (84, 98,8 %), `react` (86, 92,2 %). ⚠️ **Le classement de nocivité reste établi sur la SEULE
      longueur** : la parenthèse, découverte en passe 1 et mesurée à 58,1 % sur le site, n'y entre
      pas. **À refaire avant d'attaquer le lot suivant** — c'est peu coûteux et l'ordre peut changer.

      ⚠️⚠️ **CONTRAINTE POUR LE PROCHAIN RÉVEIL, à ne pas oublier : `stats` (99,3 %) reste le
      cours-témoin de `verif-qcm-biais-mutations.js`.** Il n'est pas dans le premier lot, mais s'il
      arrive dans un lot, **changer le témoin AVANT de le traiter**, jamais après. C'est la faute que
      B3 a dû réparer sur `zig`.

      **LE PROTOCOLE, tel qu'il se stabilise après huit cours — à rejouer tel quel :**
      1. **une consigne d'écriture qui porte les HUIT indices dans un seul tableau**, dès la première
         vague. La passe 1 de `js` a coûté une reprise complète pour en avoir oublié deux ;
      2. un écrivain par lot de leçons, fichiers disjoints, aucun commit d'agent ;
      3. **contradiction adversariale obligatoire** — 46 défauts de fond sur 110 questions en passe 2,
         dont une bonne réponse fausse qu'aucun vérificateur ne voyait ;
      4. **un correcteur qui JUGE et REMESURE** : la moitié des textes proposés par les relecteurs
         cassent la forme, parce qu'un relecteur vérifie son texte isolément. **Simuler avant
         d'écrire** ;
      5. contrôler l'intouchable contre `git show HEAD:`, **et déclarer d'avance toute exception** ;
      6. `build-index --write`, puis `doc/verif-normatif`, puis `build-index --write` une seconde
         fois — **et `--fresh` si un ÉNONCÉ a changé**, sinon l'ancienne question survit dans l'index ;
      7. marquer le cours `traite` et refiger la référence.
      ---

      **`python` — FAIT le 2026-09-04. LE COURS EST CLOS : 91,6 % → 19,8 %, 2ᵉ cours le plus nocif
      du site. 50 leçons, 173 questions, 519 distracteurs, tous réécrits.**

      ⚠️⚠️ **CE RÉVEIL A COMMENCÉ PAR TROUVER LE TRAVAIL DU PRÉCÉDENT EN RADE, ET C'EST SON PREMIER
      ENSEIGNEMENT.** Le réveil de 03 h 25 s'est arrêté **entre la remise des rapports de
      contradiction et leur application**. Constat par horodatage, pas par intuition : leçons 01-28
      écrites à **03:37-03:44**, quatre rapports rendus à **03:52-04:00**, aucun fichier retouché
      après. Et les lots d'écriture des leçons 29-48 étaient sur le disque (**05:43-05:47**) sans
      avoir jamais été posés : le cours affichait **48,4 %**, à moitié traité, rien de commité.
      **Un travail non commité est un travail perdu.** Le premier commit de ce réveil a donc été
      fait avant d'engager quoi que ce soit de neuf.

      | mesure, cours entier | avant | après |
      |---|---:|---:|
      | la plus longue | **91,6 %** | **19,8 %** |
      | meilleure stratégie exploitable | 91,6 % | **29,0 %** (l'incise) |
      | l'incise « désigne la SEULE bonne réponse » | — | **1,2 %** |
      | global du site | 82,2 % | **80,2 %** |

      **DEUX BONNES RÉPONSES FAUSSES, toutes deux prouvées par exécution, toutes deux reproduites
      par moi avant correction.** C'est le défaut qui fonde la chaîne, et il s'est présenté deux
      fois dans le même cours.

      1. **`python/lecon-38` q2 : la leçon enseignait « patch where it's looked up » sur un exemple
         où la règle NE MORD PAS.** Son module `weather` fait `import httpx` puis `httpx.get(...)` :
         `weather.httpx` **est** le module `httpx`, donc `patch("httpx.get")` et
         `patch("weather.httpx.get")` désignent le même objet. Reproduit avec un faux `httpx` qui
         lève si le vrai code est atteint :

         | ce que fait le test | ce qui se passe RÉELLEMENT |
         |---|---|
         | `import httpx` + `patch("httpx.get")` | **le mock est appelé** (21.5), `weather.httpx is httpx` → True |
         | `from httpx import get` + `patch("httpx.get")` | **sans effet** : le vrai `get` est atteint |
         | `from httpx import get` + `patch("weather.get")` | le mock est appelé (21.5) |

         La bonne réponse, l'explication, la légende du schéma **et le schéma lui-même** affirmaient
         tous qu'un `patch("httpx.get")` serait « sans effet ici ». Correctif : l'exemple passe à
         `from httpx import get`, le seul cas où la règle a un sens ; la cible devient
         `"weather.get"` ; **12 remplacements**, dont l'énoncé, la bonne réponse et l'explication —
         **exception déclarée d'avance**. ⚠️ **Et le changement a périmé un distracteur au passage** :
         « patch rejette les chemins de moins de trois segments » se réfutait désormais contre son
         propre énoncé, la cible neuve n'en ayant que deux. Corrigé dans la foulée.

      2. **`python/lecon-41` q3 : la bonne réponse attribuait le groupe atomique `(?>...)` et le
         quantificateur possessif `a++` au module tiers `regex`.** Ils sont dans `re` **standard
         depuis Python 3.11** — et le corps de la même leçon l'écrit correctement (« Python 3.11+ »).
         Vérifié sous 3.14.5 : `re.match(r"^(?>a+)+$", "a"*30+"b")` rend `False` en 6,1 × 10⁻⁵ s et
         `^a++$` en 2,5 × 10⁻⁵ s, sans erreur. Corrigé en « dans re depuis Python 3.11 ».
         ⚠️ **L'autre mention du module `regex` dans la même leçon a été vérifiée et laissée** : le
         lookbehind de longueur variable est bien refusé par `re` (*look-behind requires fixed-width
         pattern*).

      **LE TROU DE CONTRADICTION, COMBLÉ.** Les leçons **06-17** étaient les seules du cours dont
      aucun rapport de contradiction n'existait — la passe qui les avait écrites s'était arrêtée
      avant. Deux relecteurs y ont été envoyés : **aucune bonne réponse fausse** (les 36 rejouées
      sous 3.14.5), mais **un distracteur VRAI sous un mode documenté** — « le module standard passe
      devant, le fichier local devient inatteignable » est exactement ce que font `python -P`
      (3.11+) et `PYTHONSAFEPATH=1`, prouvé par trois exécutions.

      **51 remplacements appliqués en tout, issus de 6 rapports de contradiction** : 26 des quatre
      rapports en souffrance (leçons 01-05, 18-28), 10 des lots 29-48, 15 des lots 06-17. Trois
      distracteurs étaient devenus littéralement **vrais** : `int(6 / 2)` rend réellement 3 (et
      c'était le **seul** remède qui marchait des quatre options) ; le `.gitignore` que `venv` écrit
      lui-même rend `git add -f` réellement nécessaire ; `groupby().sum()` trie son index par
      défaut, donc « les ventes triées, ville par ville » **décrivait la sortie affichée par la
      leçon**.

      ⚠️ **DIX QUESTIONS TOMBAIENT À DEUX CHOIX, ET C'EST LE VRAI RÉSULTAT DE LA CONTRADICTION SUR
      CE COURS.** Deux distracteurs qui portent la même fausseté s'éliminent ensemble : `for/else`
      « ignorée sur un itérable vide » (deux options), `d.default`/`d.fetch` (deux noms inventés),
      `ProcessPoolExecutor` « car le GIL est tenu pendant un appel réseau » (deux fois la même
      réponse avec la même raison), py-spy qui « transformerait le programme » (deux fois),
      `TaskGroup` qui « n'annule pas les sœurs » (deux fois), `send` qui « traverse yield from »
      (deux fois), le même verdict « O(n) » rendu par deux options, un module qui « se recharge à
      chaque import » (deux fois)… **Aucun de nos onze indicateurs ne voit ce défaut** : il ne se lit
      qu'en comparant les distracteurs **entre eux**, et c'est exactement ce qu'un relecteur fait et
      qu'un vérificateur ne fait pas.

      ⚠️ **UN INDICE NEUF, MESURÉ : « écarter l'option qui NIE la prémisse de son propre énoncé ».**
      Quand l'énoncé demande *quelle est la différence entre A et B*, il présuppose la différence ;
      une option qui répond « il n'y en a pas » se réfute toute seule. **20 options du cours la
      nient, ZÉRO bonne réponse** — et les leçons 06-11, qui pèsent 10,4 % des questions, en
      concentraient **11 sur 20**, dont **4 questions où DEUX options la niaient ensemble**
      (l'apprenant passe de 25 % à 50 % sans rien savoir). Le taux agrégé (31,9 %) reste dans la
      bande de bruit et n'est **pas** revendiqué ; **le décompte 20/0, lui, n'est pas du bruit.**
      Deux autres candidats du même tonneau, mesurés et non traités : « si bien que » (**24
      distracteurs, 0 bonne réponse** sur les 173 questions) et « s'écrit » (3 occurrences, **toutes
      les trois** dans les distracteurs d'une même question, qui devenait devinable à 100 %).

      ⚠️ **LE PIÈGE DU CHANTIER S'EST REFERMÉ UNE SIXIÈME FOIS, ET DANS L'AUTRE SENS.** Mes
      corrections de FOND sur les leçons 29-48 ont fait remonter « l'incise entre parenthèses » de
      27,6 % à **32,2 %**, et la colonne qui compte — *désigne la SEULE bonne réponse* — de 3,3 % à
      **10,0 %** (6 questions) : les textes des relecteurs n'en portaient pas. Rattrapé en
      **ajoutant** une incise à un distracteur dans chacune : **28,1 %, colonne solo 1,7 %**.
      ⚠️ Et **le cas résiduel est un artefact de mesure** : sur `lecon-41` q0, l'outil compte
      `(?:...)` et `(?P<nom>...)` comme des incises — ce sont des motifs de code, qu'aucun apprenant
      ne peut exploiter sans lire.

      ⚠️ **DEUX CHIFFRES DE RELECTEUR PRIS EN DÉFAUT, TOUS DEUX ÉCRITS DE TÊTE**, et c'est la
      cinquième fois du chantier : « `"__del__" in dir(C)` → **True** » (c'est **False** sur une
      classe vide, remesuré — le remplacement tient quand même, `__del__` étant une méthode spéciale
      réelle mais non héritée d'`object`), et un texte annoncé à **122 %** de la bonne réponse mais
      mesuré à **135 %**, raccourci avant d'être posé. ⚠️ **Et un troisième défaut, neuf celui-là :
      les six textes du lot 44-48 sont arrivés SANS ACCENTS** (« a charge », « declaree »,
      « arret ») — réaccentués avant application. *Un relecteur qui écrit du contenu visible en
      ASCII produit du texte impubliable, quelle que soit la qualité de sa prise.*

      ⚠️ **`verif-controles.js`, entré dans la chaîne en phase A, a rattrapé le piège du heredoc sur
      sa propre mise en garde** : `tools/mesure-biais-qcm.js` portait un vrai **U+0008** dans le
      commentaire qui explique justement que « la limite \b de JavaScript est ASCII ». Troisième
      occurrence du piège sur ce chantier, **première fois qu'un outil le voit avant un œil.**

      🔵 **La question ouverte en B3 — « quelles épreuves par injection s'appuient sur un état du
      site qu'un chantier peut changer ? » — est tranchée pour ce cours** : la seule qui cite
      `python` est `verif-chaine-mutations.js`, et elle vise un bloc **`data-exos`** de `lecon-08`,
      qu'une passe sur les distracteurs ne touche pas. Ancrage vérifié intact. Le cours-témoin
      `stats` (99,3 %) n'a pas bougé.

      **DETTES ÉCRITES, non traitées, chacune mesurée :**
      - `lecon-29` q2 : la bonne réponse compte « deux niveaux » pour `@reessayer(3)` là où le corps
        de la leçon écrit « **trois niveaux : fabrique → décorateur → wrapper** » à **sept endroits**.
        Elle n'est pas fausse (elle compte la machinerie autrement), mais **aucune des quatre options
        ne donne le compte que la leçon martèle** — et c'est un distracteur qui porte la formule
        exacte du mémo. À trancher : aligner la leçon, ou l'énoncé.
      - `lecon-46` q1 : la leçon annonce « ~40-50 % » d'économie mémoire avec `__slots__` ;
        `tracemalloc` sur 300 000 instances en 3.14 mesure **31 %** — les dictionnaires à clés
        partagées ont réduit l'écart. Fait daté, pas faux à l'époque.
      - Les quatre défauts hors périmètre relevés en passe 2 de `js` restent ouverts.

      **Contrôles finaux** : `verif.js --rapide` **26 étapes tout vert (69,2 s)** ; `verif-html`
      **0 / 1 629** ; `verif-donnees` **0 erreur** ; `verif-normatif` **60/60** ; `verif-controles`
      **0 accident** ; `mesure-qcm-intouchable` **exactement les 5 atteintes déclarées d'avance**
      (l'énoncé, la bonne réponse et l'explication de `lecon-38` q2 ; la bonne réponse de `lecon-41`
      q3 ; le message d'exception cité dans l'explication de `lecon-31` q4 — il manquait le mot
      *value*), **et rien d'autre** ; index régénéré **avec `--fresh`** puisqu'un énoncé a changé,
      puis deux fois ; cliquet refigé, **8 cours traités** (`archi`, `equipe`, `iac`, `js`,
      `mobile`, **`python`**, `ux`, `zig`) ; épreuve par injection **7/7**.

      ⚠️ **`doc/lecon-03` s'est périmé une 8ᵉ ET une 9ᵉ fois dans la même passe** : 5 024 → 4 903 →
      **4 900** manquements, 82,3 % → **80,3 %**. La deuxième est instructive : elle a été déclenchée
      par mes propres réécritures, entre deux mesures du même réveil. **Et une approximation verbale
      a été corrigée avec** : « ignorée dans près de **neuf** cas sur dix » était juste à 87,6 %,
      elle est fausse à 80,3 % — c'est « **huit** cas sur dix ».

      ⚠️⚠️ **UN PIÈGE D'OUTILLAGE TROUVÉ EN ÉCRIVANT CE COMPTE RENDU LUI-MÊME, DE LA MÊME FAMILLE
      QUE LE HEREDOC : `String.prototype.replace` INTERPRÈTE SA CHAÎNE DE REMPLACEMENT.** Ce texte
      contient le code inline `^a++$` — un dollar suivi d'un accent grave —, et cette paire signifie
      pour `replace` « réinsère ici **tout ce qui précède** le match ». Le plan a gonflé de
      **1 492 lignes dupliquées** en un seul appel, sans la moindre erreur ni le moindre
      avertissement ; `git diff --stat` l'a montré, rien d'autre ne l'aurait vu, un fichier de plan
      n'étant contrôlé par aucun outil. **Écrire `s.split(ancre).join(bloc + ancre)`, jamais
      `s.replace(ancre, bloc + ancre)`, dès que le texte inséré n'est pas sous contrôle.**
      ⚠️ Et la tentative de consigner ce piège l'a doublé d'un second, tout aussi instructif : la
      note a d'abord été écrite **par une commande shell**, dont les accents graves ont été pris pour
      des substitutions de commande — le texte est arrivé amputé de six morceaux, dont le nom même
      de la méthode en cause. **Le contenu français passe par l'outil d'écriture de fichier, pas par
      le shell.** Troisième forme du même défaut sur ce chantier, après le heredoc et le U+0008.

      **CE QUI RESTE À FAIRE SUR B4** : `css` (171 q, 91,9 %), `html` (160, 92,1 %), `maths`
      (117, 82,8 %), `algo` (92, 96,2 %), `nodejs` (89, 95,5 %), `bdd` (86, 97,7 %), `projets-js`
      (84, 98,8 %), `react` (86, 92,2 %), puis la longue traîne. **Classement de nocivité refait
      avec les cinq stratégies exploitables** (`b4p-nocivite.js`) : la parenthèse ne change pas
      l'ordre, la longueur domine partout. **5 183 questions devinables sur 6 167 (84,0 %)**,
      **78 cours sur 90** encore au-dessus de 60 %.
      ---

      **`css` — FAIT le 2026-09-04. LE COURS EST CLOS : 91,9 % → 21,7 %, 3ᵉ cours le plus nocif
      du site. 47 leçons, 171 questions, 513 distracteurs.**

      ⚠️⚠️ **CE RÉVEIL A, LUI AUSSI, COMMENCÉ PAR TROUVER LE TRAVAIL DU PRÉCÉDENT EN RADE — pour
      la deuxième fois du chantier, et la cause est cette fois NOMMÉE, pas devinée.** Le réveil de
      06:30 a lancé un workflow d'écriture des 285 distracteurs des leçons 01-25 et **a été terminé
      par le harnais au bout de 600 s de tâches de fond** (« Background tasks still running after
      600s; terminating »), message présent tel quel dans `.autonomie/journal.log`. Il a rendu la
      main à 06:44 avec **six fichiers modifiés et rien de commité**, et **quatre brouillons
      complets jamais posés**. *Un travail non commité est un travail perdu* — et la parade tenue
      cette fois : **un commit par lot, dès qu'un lot est mesuré**, treize au total.

      | ce qui a été récupéré | où il dormait | questions | distracteurs |
      |---|---|---:|---:|
      | leçons 01-05 et 25 | écrites sur le disque, non commitées | 21 | 78 |
      | leçons 06-10 | `b4c-B/overrides.js` | 15 | 45 |
      | leçons 11-15 | `b4c-C/draft.js` | 15 | 45 |
      | leçons 16-20 | `b4c-D/distracteurs.js` | 15 | 45 |
      | leçons 21-24 | `b4c-E/distracteurs.json` | 20 | 57 |
      | **total récupéré** | | **86** | **270** |

      **LE COURS ENTIER, avant → après. Aucune stratégie ne dépasse 29,5 %, le hasard vaut 25,0 %.**

      | indice, 171 questions | avant | après |
      |---|---:|---:|
      | la plus longue | **91,9 %** | **21,7 %** |
      | la plus détaillée | 68,9 % | **29,5 %** (meilleure stratégie restante) |
      | l'incise entre parenthèses | 62,0 % | **29,5 %** |
      | le mot technique exclusif | 60,2 % | **28,9 %** |
      | l'écho de l'énoncé | 50,1 % | **23,5 %** |
      | la MAJUSCULE d'emphase | 31,6 % | **26,7 %** |

      **Global du site : 80,2 % → 78,2 %. `css` est marqué `traite`, 9ᵉ cours verrouillé**
      (`archi`, `equipe`, `iac`, `js`, `mobile`, `python`, `ux`, `zig`, **`css`**). Cliquet vert,
      épreuve par injection **7/7**, cours-témoin `stats` (99,3 %) intact.

      **Les six lots d'écriture des leçons 26 à 47**, un écrivain par lot, fichiers disjoints,
      aucun commit d'agent :

      | lot | leçons | questions | distracteurs | la plus longue | pire stratégie après |
      |---|---|---:|---:|---:|---:|
      | G1 | 26-29 | 12 | 35 / 36 | 95,8 % → 25,0 % | 29,9 % |
      | G2 | 30-33 | 12 | 36 / 36 | 100,0 % → 25,0 % | 29,9 % |
      | G3 | 34-37 | 12 | 36 / 36 | 100,0 % → 25,0 % | 34,0 % |
      | G4 | 38-41 | 12 | 36 / 36 | 100,0 % → 25,0 % | 37,5 % |
      | G5 | 42-45 | 12 | 34 / 36 | 91,7 % → 25,0 % | 27,1 % |
      | G6 | 46-47 + **bilan** | 16 | 42 / 48 | 83,3 % → 25,0 % | 32,3 % |

      **LA DÉCISION SUR LE QCM BILAN, prise et chiffrée plutôt que subie.** Ses 10 bonnes réponses
      sont des **jetons de code de 9 à 36 signes** : la fourchette 70-130 % n'y protège rien.
      L'écrivain n'en a rallongé aucun et a appliqué le critère d'**homogénéité de genre** —
      les jetons inventés ou hors genre remplacés par des propriétés, règles et fonctions **réelles**
      du CSS, chacune fausse pour une raison différente (`move` → `perspective`, `tween` →
      `will-change`, `::dialog` → `::selection`, `@parent` → `@supports`, `fill` → `caret-color`,
      `min(max)` → `min(min, idéal, max)`). C'est la même décision qu'en passe 2 de `js`, prise
      pour la même raison, et elle se stabilise donc en règle.

      ---

      **LA CONTRADICTION ADVERSARIALE — trois relecteurs sur les leçons 01 à 25, 85 questions,
      340 options, corps des 25 leçons lus en entier. 64 prises. Aucune bonne réponse FAUSSE.**

      ⚠️⚠️ **UN RELECTEUR A MESURÉ DANS UN VRAI CHROME, ET C'EST CE QUI A RENDU LES TROIS PRISES
      LES PLUS GRAVES.** Il a monté une sonde CDP (reprise de `tools/verif-clic.js`) et trois pages
      de test en `file://`. Première fois du chantier qu'un contradicteur **exécute** pour prouver
      — la règle fondatrice appliquée par un agent, pas seulement par moi :

      1. **`lecon-06` q0 opt1 était VRAI.** « la générique complète les accents » : le repli d'une
         pile `font-family` se fait **glyphe par glyphe**, pas police par police. Mesuré :
         `@font-face { src: local("Courier New"); unicode-range: U+0041-005A }` puis
         `font-family: SondeAZ, Arial` → le « A » fait **24 px** (Courier New), le « É » **27 px**
         (Arial). Deux polices dans un seul mot, une seule déclaration. La leçon, elle, n'enseigne
         que le repli global : **le distracteur devenait vrai dès qu'on en savait un peu plus
         qu'elle.**
      2. **`lecon-08` q1 opt2, défendable, mesuré.** Trois parents `static`, un enfant absolu
         chacun : `opacity: .5` ne capture PAS l'enfant (il part en 0,0), `transform: translateZ(0)`
         et `filter: blur(0px)` le capturent exactement. **Deux cas sur trois donnaient raison au
         distracteur**, et la leçon nomme `transform` comme créateur de contexte d'empilement.
      3. **`lecon-07` q0 opt2 se détruisait dans sa propre phrase** : elle citait `rgb()` et `hsl()`
         comme exemples de ce que `background-color` refuserait. Mesuré : les deux sont acceptées
         (`hsl` résolue en `rgb(64, 149, 191)`), seul `linear-gradient` est rejeté.

      **ONZE DOUBLONS DE FAUSSETÉ, qui faisaient tomber onze questions à deux choix.** Deux options
      centrant sur le mauvais **axe** (09 q1) ; deux « bloquées à 200px » (10 q1) ; deux « un
      enfant » (10 q0) ; deux « éviter `opacity` » (12 q1) **alors que la leçon enseigne le
      contraire** ; deux « dans `:hover` il n'y a que de la couleur » (12 q0) ; deux « compilé comme
      en Sass » (13 q0 et q1) ; deux « préfixer bleu » (14 q0) ; deux « aucune des deux règles ne
      gagne » (03 q1) ; deux qui niaient le pouvoir de `counter-reset` (17 q1) ; deux qui
      proposaient de la couleur quand l'énoncé l'excluait (18 q2) ; deux « le barré est
      transitoire » (20 q0). **Aucun de nos onze indicateurs ne voit ce défaut** : il ne se lit
      qu'en comparant les distracteurs **entre eux**.

      **LA PRISE LA PLUS GRAVE DU LOT B** — `lecon-11` q2 opt3 : « une grille dont le nombre de
      colonnes change : l'unité `fr` retire une colonne dès que la place manque, ce qui remplace le
      point de rupture ». **La situation décrite est exactement celle que le corps donne pour
      réponse** (« avec `auto-fill` et `minmax()`, elle calcule seule le nombre de colonnes. Zéro
      media query »), et le récap range `fr` parmi les unités fluides qui évitent les media queries.
      L'apprenant qui avait lu la leçon cochait légitimement ce distracteur.

      ⚠️ **TROIS EXCEPTIONS À L'INTOUCHABLE, déclarées d'avance, et `mesure-qcm-intouchable` rend
      exactement ces trois-là et rien d'autre :**
      - **`lecon-19` q2 : la bonne réponse prescrivait un remède que la leçon n'enseigne NULLE
        PART.** Elle est exacte (`1fr` vaut `minmax(auto, 1fr)`), mais comptage sur le fichier,
        corps contre bloc QCM : **`min-width: 0` = 11 fois dans le corps, 0 fois dans les
        options** ; `minmax(0` = **0 fois dans le corps**, 2 fois dans le QCM. La leçon le martèle
        dans son objectif d'apprentissage, dans son code commenté (« la ligne qui sauve la
        grille »), dans son piège fréquent (« c'est la cause numéro un des grilles qui débordent »),
        dans son antisèche, son glossaire et son récap. **L'apprenant diligent cherchait dans les
        quatre choix ce que sa leçon lui avait appris onze fois, et ne le trouvait pas.** Bonne
        réponse et explication alignées sur `min-width: 0`.
      - **`lecon-24` q1 : l'explication commentait une option qui n'existe pas.** Elle disait
        « `blackwhite()` n'existe pas » — mot absent de **toutes** les options du fichier, trace
        d'une réécriture non répercutée — et ne disait rien de `monochrome(100%)` ni de
        `sepia(100%)`, les deux options réellement présentes.
      - **`lecon-10` q1 : l'explication renvoyait à `auto-fit`**, mot-clé absent du corps de la
        leçon 10 (10 occurrences de `auto-fill`, 0 de `auto-fit` hors JSON), enseigné seulement en
        leçon 19, et **au comportement différent**. Un mot changé.

      **UN DISTRACTEUR QUI LIVRAIT LA CLÉ DE LA BONNE RÉPONSE** — `lecon-20` q1 opt1 écrivait « un
      contour qui ne déplace jamais rien », c'est-à-dire le fait unique sur lequel repose la bonne
      réponse. Et opt3 disait frontalement l'**inverse** d'opt1 : deux options sur quatre portaient
      le même fait, une seule le niait, l'apprenant éliminait par majorité sans rien savoir.

      **UNE CONTREVÉRITÉ DE SPÉCIFICATION PUBLIÉE** : `09` q1 opt2 écrivait « `vertical-align:
      middle` (hérité) » — CSS 2.1 § 10.8.1 dit *Inherited: no*. **Un distracteur doit être faux sur
      sa réponse, pas propager une fausseté que l'apprenant mémorise.**

      **UN DÉFAUT D'ÉNONCÉ CORRIGÉ DU CÔTÉ DES DISTRACTEURS, sans toucher à l'intouchable** :
      `lecon-06` q1 demande une valeur « **sans unité** », et deux distracteurs en portaient une
      (`24px`, `100 %`) : ils s'éliminaient d'office et **la question tombait à deux choix**. Les
      deux sont maintenant des valeurs sans unité, fausses par leur valeur *et* par leur raison.

      **UNE FAUTE DE LANGUE PUBLIÉE** : `lecon-22` q3 opt1 écrivait « garder la barre d'adresse **en
      cache** » pour « masquée ». L'apprenant éliminait l'option sur sa formulation, pas sur son
      contenu.

      **UN MOTIF MESURÉ SUR LE COURS ENTIER, pas sur un seul lot** (85 questions, 340 options) :
      une option qui ouvre par « **Les deux…** », par « **Ni…** », ou qui contient « **quelle que
      soit** » est fausse **17 fois sur 17, zéro bonne réponse**. Onze des dix-sept étaient dans les
      leçons 01-08. ⚠️ **Et deux motifs soupçonnés ont été INNOCENTÉS par la mesure** : les
      majuscules d'insistance (15 distracteurs / 5 bonnes réponses = le hasard) et « l'option qui
      annonce une erreur » (11 / 3). *Un motif qu'on n'a pas compté n'est qu'une impression.*

      **TROIS POINTS NON TRANCHÉS, dits plutôt qu'arrondis** : le motif `!important` (2 occurrences,
      2 distracteurs, 0 bonne réponse — trop peu pour conclure) ; `lecon-22` q4 opt1, où
      `min(90%, 1200px)` produit **réellement** une bascule à 1333,33 px, donc défendable ;
      `lecon-23` q1 opt3 « `zoom(1.2)` », la propriété `zoom` existant bel et bien.

      ---

      **CINQ PIÈGES D'OUTILLAGE, DONT DEUX NEUFS — et c'est le second résultat de ce réveil.**
      Tous relèvent de la même famille : *un outil modifie en silence ce qu'on ne lui a pas
      demandé, et seul un contrôle explicite le voit.*

      1. ⚠️ **NEUF — l'outil d'édition a converti `CHANTIER-V16.md` ENTIER en CRLF** au passage
         d'une modification d'une ligne. `git diff --stat` rendait **1 623 insertions / 1 572
         suppressions** pour un ajout de 51 lignes. Ramené en LF avant le commit : le diff retombe à
         **51 insertions, 0 suppression**. Sans ce contrôle, l'historique du plan devenait illisible.
      2. ⚠️ **NEUF — le shell a EXÉCUTÉ les mots entre accents graves d'un message de commit.** Le
         message annonçait un cours marqué « » et un témoin « » : deux mots avalés, remplacés par
         du vide, et le commit passé sans erreur. Réécrit par fichier (`git commit -F`). *Le texte
         français passe par un FICHIER, jamais par la ligne de commande.*
      3. **Le poseur de distracteurs a REFUSÉ d'écrire** sur `lecon-07` q1 : `"2em"` apparaît
         **deux fois** dans le fichier — une option de QCM est aussi un morceau de code du corps de
         la leçon. Réécrit pour remplacer **la LIGNE de la question**, avec un contrôle de fidélité
         préalable : une question **non modifiée** doit se re-sérialiser exactement en sa ligne
         d'origine, sinon le script refuse. Un écrivain a durci ce garde-fou pour son propre lot
         (fidélité vérifiée sur **chaque** question, pas sur une témoin).
      4. **Un écrivain a trouvé de vrais caractères de contrôle U+0000..U+001F dans le script qu'il
         avait écrit pour CONTRÔLER l'absence de caractères de contrôle** — sa classe de regex les
         portait à la place de la plage écrite en toutes lettres. Invisible à la lecture ; seul
         « grep : Binary file » l'a montré. Aucune leçon touchée avant correction, le `--dry` ayant
         servi de sas.
      5. **Le heredoc a de nouveau avalé des antislashs doublés** (cinquième fois du chantier), chez
         un autre écrivain. Les textes français, eux, n'ont jamais transité par un heredoc.
      6. **`doc/lecon-03` s'est périmé une DIXIÈME fois**, et **le garde-fou a de nouveau refusé
         d'écrire au premier essai** : j'avais déclaré 2 occurrences de « 4 900 », il y en a
         **CINQ, dont deux sur la même ligne**. `grep -c` en comptait 4 (il compte des **lignes**)
         et `grep -o` en montrait 4 (ses fenêtres de contexte se chevauchent). **Seul un
         `split/join` compte juste.** 4 900 → **4 781** manquements, 80,3 % → **78,3 %**,
         10 mentions corrigées, `verif-normatif` revenu à **60/60**.

      **Contrôles finaux** : `verif.js --rapide` **tout vert (76,0 s)** ; `verif-html`
      **0 / 1 629** ; `verif-donnees` **0 erreur** (I18 vert, 6 151 entrées, écart +0) ;
      `verif-normatif` **60/60** ; `mesure-qcm-intouchable` **3 atteintes, exactement les 3
      déclarées d'avance** ; index régénéré **deux fois** (pas de `--fresh` : **aucun énoncé n'a
      changé** de tout le cours) ; cliquet refigé, **9 cours traités** ; épreuve par injection
      **7/7**.

      **CE QUI RESTE À FAIRE SUR B4** : `html` (160 q, 92,1 %), `maths` (117, 82,8 %), `algo`
      (92, 96,2 %), `nodejs` (89, 95,5 %), `bdd` (86, 97,7 %), `projets-js` (84, 98,8 %), `react`
      (86, 92,2 %), puis la longue traîne. **81 cours sur 90 restent au-dessus de 60 %.**

      ---

      **`html` — FAIT le 2026-09-05. LE COURS EST CLOS : 92,1 % → 17,6 %, 4ᵉ cours le plus nocif
      du site. 47 leçons, 160 questions, 480 distracteurs, deux QCM bilan.**

      **LE COURS ENTIER, avant → après. Aucune stratégie ne dépasse 33,6 %, le hasard vaut 25,0 %.**

      | indice, 160 questions | avant | après |
      |---|---:|---:|
      | la plus longue | **92,1 %** | **17,6 %** |
      | l'incise entre parenthèses | 62,4 % | **33,6 %** (meilleure stratégie restante) |
      | la plus détaillée | 71,3 % | **20,7 %** |
      | le mot technique exclusif | 58,1 % | **24,2 %** |
      | l'écho de l'énoncé | 47,5 % | **25,4 %** |
      | la plus COURTE (le biais inverse) | 1,3 % | **24,4 %** — il ne s'est PAS retourné |
      | rangs de la bonne réponse | **148 / 0 / 0 / 2** | **30 / 48 / 45 / 37** |
      | distracteurs hors de 70-130 % | **439** | **17** (tous des jetons de code du bilan) |

      **Global du site : 78,2 % → 76,3 %. `html` est marqué `traite`, 10ᵉ cours verrouillé**
      (`archi`, `css`, `equipe`, `html`, `iac`, `js`, `mobile`, `python`, `ux`, `zig`). Cliquet
      refigé, épreuve par injection **7/7**, cours-témoin `stats` (99,3 %) intact.

      **Les neuf lots d'écriture**, un écrivain par lot, fichiers disjoints, aucun commit d'agent,
      **un commit de l'orchestrateur par vague** — la parade au réveil de `css` qui avait perdu
      quatre brouillons dans une terminaison à 600 s :

      | vague | leçons | questions | la plus longue | hors fourchette |
      |---|---|---:|---:|---:|
      | 1 (5 lots) | 01-27 + bilan intermédiaire | 92 | 96,3 % → 25,1 % | 254 → 17 |
      | 2 (4 lots) | 28-47 + bilan final | 68 | 100,0 % → 27,9 % | 203 → 0 |

      ---

      ⚠️⚠️ **CE POINT A TROUVÉ QUATRE BONNES RÉPONSES FAUSSES, ET C'EST SON RÉSULTAT PRINCIPAL —
      pas le biais.** Les trois relecteurs adversariaux ont rendu **90 prises** sur 160 questions,
      640 options et 47 corps de leçon lus en entier. **Les trois ont mesuré dans un vrai Chrome
      152, chacun de son côté, sans que la consigne le leur impose autrement qu'en le
      recommandant** — et j'ai REJOUÉ MOI-MÊME les quatre mesures décisives avant d'y toucher
      (sondes CDP calquées sur `verif-clic.js`, dont une en HTTP avec contrôle négatif) :

      1. **`lecon-26` q0 : la clé enseignait une panne qui n'existe pas.** « Un `<summary>` qui
         n'est pas le premier enfant : le navigateur génère "Détails" et ton étiquette n'est plus
         le déclencheur. » MESURÉ : `matches("details > summary:first-of-type")` = **true**,
         `display: list-item`, le clic ouvre, le `<p>` qui précède est bien replié. Le libellé
         « Détails » n'apparaît **que** si le `<details>` n'a AUCUN `<summary>`. C'est une
         non-conformité que le validateur signale — **et rien ne casse à l'écran pour avertir**,
         ce qui est exactement ce que la leçon aurait dû enseigner.
      2. **`lecon-28` q1 : « un seul popover auto reste ouvert à la fois ».** MESURÉ : deux `auto`
         **imbriqués** restent ouverts ensemble (`[true, true]`) ; un troisième, frère, les ferme
         tous les deux. **Le CORPS de la leçon disait juste (« qui n'est pas un ancêtre ») et la
         clé faux** : l'exception avait été perdue en passant du cours au QCM.
      3. **`lecon-27` : la leçon affirmait SIX fois qu'Échap ne modifie pas `returnValue`.**
         MESURÉ : `rv="confirmer"` avant, **`rv=""` après Échap**. Le standard a changé. Son
         « Cas réel : la suppression fantôme » décrivait donc un bogue **devenu irreproductible** ;
         il est maintenant daté, et le correctif d'hier présenté pour ce qu'il est devenu — la
         ceinture qui protège les navigateurs anciens.
      4. **`lecon-46` q2 : `setHTML()` donné comme équivalent assaini de `setHTMLUnsafe()`.**
         MESURÉ : `setHTMLUnsafe` attache le shadow root (**true**), `setHTML` ne laisse qu'un
         `<div>` vide et n'attache **rien** — son désinfectant retire les `<template>` et les
         éléments personnalisés.
      5. **`lecon-03` : une justification périmée, mesurée en HTTP avec contrôle négatif.** La
         leçon enseignait « sans `noopener`, la page ouverte peut accéder à la tienne via
         `window.opener` ». MESURÉ : une **ancre** `target="_blank"` SANS `rel` obtient déjà
         `window.opener === null`, alors qu'un `window.open()` sans `noopener` **garde l'accès**
         (le contrôle négatif est ce qui rend la mesure concluante : en `file://`, Chrome coupe
         toute relation opener et le « null » n'aurait rien prouvé). `rel="noopener noreferrer"`
         reste la bonne pratique, pour une **autre** raison : le `Referer` et les fenêtres
         ouvertes par script.

      **`mesure-qcm-intouchable` signale donc 8 ATTEINTES VOLONTAIRES ET DÉCLARÉES** (4 bonnes
      réponses, 4 explications) — le seul cas où le protocole autorise à y toucher, et l'outil a
      bien crié. **Corps de leçon repris : 26, 27 (six passages + le cas réel), 42, 46, 03.**
      Dont, dans `lecon-42`, une phrase franchement fausse que personne n'avait relue depuis sa
      publication : « `cache.put` rejette si le statut n'est pas 2xx (une réponse opaque **de type
      `cors`**) ». MESURÉ : **404 et 500 passent sans broncher**, seul **206** est refusé, et une
      réponse opaque a le `type` `"opaque"`, pas `"cors"`.

      **Vingt distracteurs ont été écartés par les ÉCRIVAINS eux-mêmes** parce qu'ils devenaient
      vrais en étant étoffés — dont trois qui étaient des **secondes bonnes réponses** : `::part()`
      donné par la leçon 31 comme la porte de style ouverte, « `attributeChangedCallback` est
      appelé avant `connectedCallback` » affirmé mot pour mot par la leçon 30, et « `innerHTML`
      n'exécute pas un `<script>` inséré » — **exact**, alors que la leçon l'écrit en raccourci.
      Et **onze paires de distracteurs faux pour la MÊME raison** faisaient tomber la question à
      deux choix (`<label>`/`<legend>`, `<tr>`/`<thead>`, `type=text`/`type=tel`,
      `<article>`/`<section>`, les deux « `cloneNode` ne copie pas », les trois inversions
      canvas/SVG). **Aucun de nos dix indicateurs ne voit ce défaut** — confirmation de ce que
      `css` avait trouvé.

      ⚠️ **LES DEUX INDICES DE FORME QUI RESTAIENT, ET LE GESTE QUI LES TUE SANS RIEN CASSER.**
      Une fois la longueur ramenée à 25,1 %, deux signaux dépassaient encore le hasard : **26
      questions où SEULE la bonne réponse portait une incise entre parenthèses** (42,0 %) et **32
      où elle portait seule le plus de virgules et de deux-points** (37,4 %). Deux écrivains, 53
      questions, **un seul geste : poser l'incise dans un DISTRACTEUR, jamais la retirer de la
      bonne réponse** — 0 atteinte à l'intouchable, et les deux listes tombent à **0**. La règle
      qui évite d'y perdre : **greffer l'incise sur la partie FAUSSE de l'option**
      (« (un appui du pointeur) » sur un `click` prétendument réservé à la souris), jamais sur ce
      qu'elle a de juste — sinon on répare un indice en fabriquant un distracteur vrai.

      ⚠️ **UN CONTENU QUI MESURE LE SITE SE PÉRIME EN ÉTANT PUBLIÉ — et cette fois DEUX pages
      dans le même réveil.** `doc/lecon-03` (5ᵉ péremption) : 4 781 → **4 662** manquements à sa
      propre règle S3, 78,3 % → **76,4 %**, « 34 leçons parlent de la spécification » → **37** ;
      dix mentions reprises, dont une dans un QCM, d'où une **seconde** régénération de l'index.
      Puis `doc/lecon-01`, que la chaîne complète a fait remonter : « 9 575 titres hors ASCII »
      → **9 577**, « 9 006 fragments distincts » → **9 008**. **La leçon à en tirer est neuve :
      la parade « exclure son propre cours du corpus » ne suffit pas, puisque c'est un AUTRE
      cours qui déplace le chiffre. Ce qui protège, c'est le vérificateur qui refuse la
      divergence — il a fonctionné les deux fois.**

      ⚠️ **`build-index` reprend une entrée périmée EN SILENCE sans `--fresh`, et c'est
      `verif-donnees` (I18) qui l'a vu** : les antisèches et l'index des pièges portaient encore
      les trois encadrés « Piège fréquent » que la correction de contenu venait de réécrire.
      Régénérer sans `--fresh` après avoir touché au CORPS d'une leçon ne suffit pas.

      **Contrôles finaux** : `verif.js --rapide` **26 étapes tout vert (74,4 s)** ; `verif-html`
      **0 / 1 629** ; `verif-donnees` **0 erreur** ; `verif-normatif` **60/60** ; `verif-doc`
      **36/36** ; `mesure-qcm-intouchable` **8 atteintes, exactement les 8 déclarées** ; index
      régénérés **trois fois** (dont deux avec `--fresh`) ; cliquet refigé, **10 cours traités** ;
      épreuve par injection **7/7**.

      **CE QUI RESTE À FAIRE SUR B4, mesuré après `html`** : `maths` (117 q, 82,8 %), `algo`
      (92, 96,2 %), `nodejs` (89, 95,5 %), `bdd` (86, 97,7 %), `projets-js` (84, 98,8 %), `react`
      (86, 92,2 %), puis la longue traîne. **75 cours sur 90 restent au-dessus de 60 %**, et
      **4 706 questions sur 6 167 restent devinables à la longueur**. La case reste **décochée** :
      dix cours sur les quarante que la cible de B1 demande.

      **`maths` — FAIT le 2026-09-05. LE COURS EST CLOS : 82,8 % → 22,6 %, 5ᵉ cours le plus nocif
      du site. 13 leçons, 117 questions, 351 distracteurs, deux QCM bilan.**

      **LE COURS ENTIER, avant → après. Aucune stratégie ne dépasse 33,2 %, le hasard vaut 25,0 %.**

      | indice, 117 questions | avant | après |
      |---|---:|---:|
      | la plus longue | **82,8 %** | **22,6 %** |
      | la plus détaillée | 62,3 % | **33,2 %** (meilleure stratégie restante) |
      | COMBINÉ : le tiret puis la longueur | 83,6 % | **20,9 %** |
      | le mot technique exclusif | 27,2 % | **17,1 %** |
      | l'écho de l'énoncé | 25,7 % | **18,7 %** |
      | la plus COURTE (le biais inverse) | 5,1 % | **26,5 %** — il ne s'est PAS retourné |
      | rangs de la bonne réponse | **98 / 11 / 3 / 5** | **27 / 32 / 28 / 30** |
      | distracteurs hors de 70-130 % | **143** | **0** (0,72 à 1,29) |

      **Global du site : 76,3 % → 75,2 %. `maths` est marqué `traite`, 11ᵉ cours verrouillé**
      (`archi`, `css`, `equipe`, `html`, `iac`, `js`, `maths`, `mobile`, `python`, `ux`, `zig`).
      Cliquet refigé, épreuve par injection **7/7**, cours-témoin `stats` (99,3 %) intact.

      **Deux vagues d'écriture**, sept lots, fichiers disjoints, aucun commit d'agent : vague 1 =
      leçons 01-10 (4 écrivains, 192 distracteurs, 83,8 % → 49,6 %) ; vague 2 = leçons 11 à 13
      dont le bilan final (3 écrivains, 135 distracteurs). Puis **trois relecteurs adversariaux**
      et **trois correcteurs**.

      ---

      ⚠️ **UN OUTIL DE LA PHASE B ÉTAIT AVEUGLE À 184 QUESTIONS, ET PERSONNE NE L'AVAIT VU EN
      CINQ COURS.** `mesure-qcm-longueurs.js` — le contrôle de fourchette et de rangs du
      protocole — exigeait `data-quiz-bilan>` et ratait donc **tout bloc portant un attribut
      VALUÉ**, `data-quiz-bilan="Bilan du cours"`. **15 blocs du site sont dans ce cas.** Écart
      relevé cours par cours contre `mesure-biais-qcm.js`, qui les voyait : `maths` **86 vues sur
      117**, `doc` 40/64, `distribue` 48/69, `offensive` 48/69, `compilation` 52/72, `neurones`
      48/65, `crypto` 58/68 — et **DIX questions manquantes dans chacun des quatre cours de B4
      déjà clos** (`js` 208/218, `python` 163/173, `css` 161/171, `html` 150/160). Réparé, puis
      **contre-épreuve** : les quatre cours clos restent conformes bilans compris (22,5 %,
      20,8 %, 24,0 %, 18,8 %) — les écrivains avaient bien traité ces bilans, c'est le contrôle
      secondaire qui ne les regardait pas. **La leçon : deux outils qui lisent le même corpus
      doivent être confrontés l'un à l'autre, sinon le plus faible ment en silence.**

      ⚠️⚠️ **LA CONTRADICTION A TROUVÉ DEUX EXPLICATIONS ET UNE BONNE RÉPONSE FAUSSES — et c'est
      son résultat principal.** Trois relecteurs, 117 questions, 468 options, 43 corps de leçon et
      programmes rejoués, une quarantaine de lots `node -e` : **34 prises de FOND, 19 de FORME**.
      **J'en ai réfuté quatre après les avoir remesurées moi-même.**

      1. **`lecon-13` bilan q7 : LA CLÉ ÉTAIT FAUSSE.** Elle attribuait les 73,5 % de répartitions
         ratées à la non-représentabilité du dixième — **exactement le contresens que la leçon 09
         construit un contre-exemple entier pour tuer** (« il ne démontrait pas ce qu'on lui
         faisait dire »). REPRODUIT par moi sur un autre tirage de 30 000 répartitions :
         flottants **24 321**, les MÊMES répartitions en centimes entiers **24 321**, totaux non
         divisibles par le nombre de parts **24 321**, les trois colonnes coïncidant
         **30 000 / 30 000**. La vraie raison, mesurée et mise à sa place : `0,1` vaut
         `0,10000000000000000555`, et une somme de 200 lignes en euros flottants dérive du centime
         dans **80,8 %** des cas — **0** en arrondissant une seule fois à la fin.
      2. **`lecon-05` q3 : l'explication était fausse EN NOMBRE ET EN SENS.** « La bascule se situe
         vers 10 caractères ; en dessous, enrichir l'alphabet gagne. » MESURÉ :
         `ln(62²)/ln(95/62)` = **19,34**, et en deçà ce sont les **deux caractères de plus** qui
         gagnent — `(95/62)^19` = 3 321 < 3 844 < 5 089 = `(95/62)^20`. Le « 10 » avait été
         transplanté d'une AUTRE comparaison du corps (`26^L` contre `95⁸`, bascule 11,18). Le
         même `explain` annonçait **396** là où `(95/62)^14` vaut **393,23**.
      3. **Quatorze distracteurs étaient VRAIS ou défendables**, tous mesurés : la dichotomie
         conclut bien l'absence en **17** comparaisons (et l'énoncé ne dit pas que le tableau
         n'est pas trié) ; dix couches linéaires sont bien **11,3 fois plus lentes** que leur
         matrice équivalente **à pouvoir égal**, ce que le corps écrit mot pour mot ; retrier
         entre deux recherches coûte bien plus que toutes les recherches réunies ; la table des
         exceptions de Fermat sous 2³² est un résultat publié ; **la version `slice` déborde la
         pile PLUS TARD** que la version à indice (13 760 contre 11 264 étages, mesuré trois
         fois) ; le tri quadratique fait bien **94,2 %** du travail à n = 4 096.
      4. **Sept groupes de distracteurs faux POUR LA MÊME RAISON**, qui faisaient tomber leur
         question à trois choix voire deux — trois « flottants » sur quatre options, deux « 64
         cases c'est trop peu », deux « Oui » contre deux « Non ». **Troisième cours de suite où
         ce défaut apparaît, et aucun de nos dix indicateurs ne le voit.**

      ⚠️ **CE QU'IL FALLAIT RÉFUTER, et qui montre qu'un relecteur adversarial se trompe aussi.**
      (a) « la clé du bilan q2 oublie la soustraction » — MESURÉ : normalisée, la soustraction
      passe au reste **10 000 fois sur 10 000**, mais **brute en JavaScript elle échoue 49,6 % du
      temps** à cause du signe de `%` ; la clé n'est pas fausse. (b) `lecon-02` q5, deux options
      logiquement équivalentes (une réciproque et sa contraposée) : **c'est délibéré**,
      l'explication l'enseigne — corriger aurait détruit le point pédagogique. (c) et (d) deux
      prises où seul le détail était faux, le sens protégeant la question.

      ⚠️ **UN INDICE CHASSE L'AUTRE, et cette fois c'est la DENSITÉ DE CHIFFRES.** Une fois la
      longueur ramenée à 25 %, un relecteur a mesuré que « l'option qui contient le plus de
      chiffres » réussissait encore **58,3 %** sur les leçons 12-13, et que **la majuscule
      d'emphase tombait 3 fois sur 3 sur la bonne réponse**, aucun des 108 distracteurs n'en
      portant. Traité par le même geste que sur `html` — **poser le chiffre ou la majuscule dans
      un DISTRACTEUR, et sur sa partie FAUSSE, jamais les retirer de la bonne réponse** : la
      densité chiffrée retombe à **30,3 %** et la majuscule à 3 clés sur 10 options porteuses.

      ⚠️ **UN CONTENU QUI MESURE LE SITE SE PÉRIME EN ÉTANT PUBLIÉ — 6ᵉ fois pour la même page.**
      `doc/lecon-03` publiait « **4 662** manquements à sa propre règle S3, **76,4 %** » →
      **4 592** et **75,2 %**. **Dix mentions** reprises (5 du nombre, 5 du taux), dont une dans
      l'explication d'un QCM, d'où une **seconde** régénération d'index avec `--fresh`.
      `verif-normatif` est passé de **58/60 à 60/60**, `verif-doc` **36/36**. La parade tient :
      c'est le vérificateur qui refuse la divergence qui a crié, pas moi.

      ⚠️ **LE PIÈGE DES ACCENTS GRAVES DANS UN MESSAGE DE COMMIT s'est représenté** (déjà mesuré
      sur `css`) : le shell a **exécuté** deux mots placés entre accents graves et les a **effacés
      du message**, sans que le commit lui-même signale quoi que ce soit. Parade : passer le
      message par un fichier (`git commit -F`).

      **Contrôles finaux** : `verif.js --rapide` **52 contrôles verts (83,6 s)** ; `verif-html`
      **0 / 1 629** ; `verif-donnees` **25 contrôles, 0 erreur** ; `verif-normatif` **60/60** ;
      `verif-doc` **36/36** ; `mesure-qcm-intouchable` **3 atteintes, exactement les 3 déclarées**
      (2 explications, 1 bonne réponse) ; index régénérés **deux fois avec `--fresh`**, avec
      contrôle dans `quiz-index.js` lui-même (0 ancien distracteur, les trois textes neufs
      présents) ; cliquet refigé, **11 cours traités** ; épreuve par injection **7/7**.

      **CE QUI RESTE À FAIRE SUR B4, mesuré après `maths`** : `algo` (92 q, 96,2 %), `nodejs` (89,
      95,5 %), `bdd` (86, 97,7 %), `projets-js` (84, 98,8 %), `react` (86, 92,2 %), `ruby` (84,
      89,9 %), `sql` (82, 91,9 %), `git` (80, 93,8 %), puis la longue traîne. **74 cours sur 90
      restent au-dessus de 60 %**, et **4 636 questions sur 6 167 restent devinables à la
      longueur**. La case reste **décochée** : onze cours sur les quarante que la cible de B1
      demande.

      **`algo` — FAIT le 2026-09-05. LE COURS EST CLOS : 96,2 % → 20,2 %, 6ᵉ cours le plus nocif du
      site. 28 leçons, 92 questions, 276 distracteurs, un QCM bilan.**

      **LE COURS ENTIER, avant → après. Aucune stratégie ne dépasse 35,1 %, le hasard vaut 25,0 %.**

      | indice, 92 questions | avant | après |
      |---|---:|---:|
      | la plus longue | **96,2 %** | **20,2 %** |
      | COMBINÉ : le tiret puis la longueur | 96,2 % | **19,1 %** |
      | la plus détaillée | 83,2 % | **28,6 %** |
      | le mot technique exclusif | 76,7 % | **24,5 %** |
      | **l'incise entre parenthèses** | 73,9 % | **35,1 %** (meilleure stratégie restante) |
      | l'écho de l'énoncé | 62,2 % | **28,3 %** |
      | la MAJUSCULE d'emphase | 31,3 % | **26,0 %** |
      | la plus COURTE (le biais inverse) | 0,0 % | **29,3 %** — il ne s'est PAS retourné |
      | rangs de longueur de la bonne réponse | **89 / 3 / 0 / 0** | **21 / 22 / 27 / 22** |
      | distracteurs hors de 70-130 % | **266 sur 276** | **0** (0,71 à 1,30) |

      **Global du site : 75,2 % → 74,0 %. `algo` est marqué `traite`, 12ᵉ cours verrouillé**
      (`algo`, `archi`, `css`, `equipe`, `html`, `iac`, `js`, `maths`, `mobile`, `python`, `ux`,
      `zig`). Cliquet refigé, épreuve par injection **7/7**, cours-témoin `stats` (99,3 %) intact.

      **275 distracteurs sur 276 réécrits.** Le 276ᵉ est resté : `lecon-14` q3, dont la bonne réponse
      fait **5 caractères** (`O(n³)`) — la fourchette 70-130 % y vaut 3,5 à 6,5 caractères, et aucune
      autre notation de cette taille n'était plus crédible que `O(n²)`. Les quatre options y font
      désormais 5 caractères exactement : **aucun signal de longueur**.

      **Six écrivains** sur lots de leçons disjoints (01-05, 06-10, 11-15, 16-20, 21-25, 26-28), puis
      **quatre relecteurs adversariaux**, puis correction par un seul écrivain (moi). Aucun commit
      d'agent, un seul écrivain par fichier à tout instant.

      ---

      ⚠️⚠️ **LA CONTRADICTION A TROUVÉ LE DÉFAUT FONDATEUR DE LA CHAÎNE, DANS UN CORPS DE LEÇON, ET
      C'EST SON RÉSULTAT PRINCIPAL.** Le schéma ASCII de `lecon-16` (« Pourquoi Dijkstra échoue avec
      des poids négatifs ») annonçait « **résultat FAUX (2 au lieu de 1)** ». **REPRODUIT par moi en
      extrayant le code Dijkstra de la leçon elle-même et en le faisant tourner sur le graphe exact du
      schéma : il rend `dist(B) = 1`, pas 2.** La raison, mesurée : la variante à *lazy deletion* du
      cours écrit `dist` à chaque relâchement réussi, **même pour un sommet déjà visité** ; seule la
      ré-expansion est bloquée. La distance affichée est donc corrigée — ce qui casse vraiment, c'est
      la **propagation en aval**, et il faut un successeur pour la voir. Schéma corrigé (arête
      `B → D` de poids 1) et **prouvé par exécution** : Dijkstra rend `D = 3`, Bellman-Ford rend
      `D = 2`. **Une sortie annoncée fausse, dans un exemple, que quatre vérificateurs verts ne
      voyaient pas : exactement ce qui a fondé cette chaîne, et le fan-out adversarial reste le seul
      outil qui l'attrape.**

      ⚠️ **UN DISTRACTEUR DÉCRIVAIT UNE IMPLÉMENTATION QUI MARCHE.** `lecon-18` q2 opt2 :
      « décrémenter la longueur du chemin ET recopier `utilise` dans un tableau neuf à chaque appel ».
      Le relecteur l'a **codé** et comparé au code de la leçon : **sorties identiques**, permutations
      comprises (`n = 3` et `n = 4`, 6 et 24 permutations). Sa seconde moitié est vraie aussi : sans
      recopie ni remise à `false`, le tableau partagé bloque bien les branches (0 permutation rendue).
      Les deux propositions étaient exactes ; seul le cadrage la séparait de la bonne réponse.

      ⚠️ **HUIT DISTRACTEURS ÉTAIENT VRAIS À LEUR MOITIÉ LA PLUS LUE**, tous prouvés par exécution :
      « la sélection effectue ses n-1 échanges même sur une entrée déjà ordonnée » — **c'est la
      formulation canonique du tri par sélection**, et elle n'est fausse que parce que le code de
      *cette* leçon porte un `if (indexMin !== i)` (mesuré : **0 échange** sur une entrée triée) ;
      « n = coût du découpage, qui recopie l'ensemble des éléments une fois par niveau » —
      **littéralement vrai** du `triFusion` de la leçon, qui découpe au `slice` (compteur instrumenté :
      **16 éléments recopiés à chacun des 4 niveaux pour n = 16**) ; « l'insertion n'en fait plus que
      n-1 quand tout est déjà en ordre » — **exact**, et le reste de l'option ne s'écartait de la clé
      que par le mot « exactement » (balayage des **720 permutations de 1..6** : le tri fusion fait de
      **7 à 11** comparaisons selon l'entrée) ; « lève une RangeError quand on l'appelle sur 0 ou
      sur 1 » — la trace réelle de `fib` privé de son cas de base ; « le débranchement ne coûte qu'une
      affectation en O(1) » — **la phrase même du corps de la leçon** ; « les compteurs d'ouverture
      doivent tous revenir à zéro » — **condition nécessaire vraie**, l'option n'était fausse que par
      ce qu'elle omettait ; « Prim et Kruskal rendent le même arbre » — **vrai dès que les poids sont
      distincts**, mesuré sur un graphe dense V=8 E=28 (coûts 806 et 806) ; « la NP-complétude ne vise
      que la version décision » — **vrai, et la leçon l'écrit**, seule la clause finale était fausse.

      ⚠️ **DEUX QUESTIONS TOMBAIENT SOUS QUATRE CHOIX, et aucun de nos dix indicateurs ne le voit —
      quatrième cours de suite.** `lecon-24` q3 : deux distracteurs sur trois énuméraient **les
      avantages du Fenwick** (« sommes de préfixes », « un seul tableau de n+1 cases ») — une seule
      intuition les élimine ensemble. `lecon-28` bilan q5 : la question demande **LIFO** et une option
      répondait « **La file (FIFO)** », s'éliminant sur quatre lettres, tout en doublant « la file de
      priorité ». Même défaut sur `lecon-13` q3, où un distracteur **se réfutait par sa propre
      arithmétique** (il proposait `4+3` pour rendre **6**) et rendait le même verdict qu'un autre.

      ⚠️ **J'AI REFUSÉ ONZE PRISES, ET LA MOITIÉ PARCE QU'ELLES VISAIENT L'INTOUCHABLE.** Trois
      demandaient de réécrire une **bonne réponse** portant un chevron (`<=` dans `lecon-03`, `"10" <
      "100"` dans `lecon-04`, `n > 0` dans `lecon-20`) : vérifié dans `js/lecon.js` que `buildQuiz`
      passe tout par `escapeHTML`, et `verif-html` rend **0 sur 1 629 fichiers** — le chevron ne crée
      aucune balise, et la bonne réponse ne se touche pas pour un marqueur présent sur 3 questions
      sur 92. Cinq autres demandaient de retirer un marqueur de forme d'une bonne réponse
      (parenthèses, capitale d'emphase, guillemets) : **traitées par le geste inverse du protocole**,
      poser le marqueur dans un distracteur. Et **quatre prises ont été écartées sur la recommandation
      de leur propre auteur**, qui avait mesuré puis conclu « ne rien changer » — dont la convention
      d'indexation d'un tas (l'option annonce elle-même « racine posée à l'index 1 » quand l'énoncé
      stipule « indices à partir de 0 » : c'est le piège que la leçon enseigne).

      ⚠️ **UN INDICE CHASSE L'AUTRE, TROIS FOIS DE SUITE SUR CE COURS, ET IL A FALLU TROIS PASSES
      MESURÉES.** (1) Une fois les 276 distracteurs étoffés, la longueur tombait à 24,5 % mais
      **l'incise entre parenthèses tenait 51,4 %** : la bonne réponse menait seule le compte
      d'incises dans **26 questions sur 92**. Traité par le geste du protocole — poser l'incise dans
      un distracteur, sur sa partie fausse — sur **14 distracteurs** : **0 tête strictement gagnante**,
      la stratégie tombe à **34,8 %**. (2) Cette passe a **retourné le biais de longueur** : la bonne
      réponse n'était plus la plus longue que **14 fois sur 92** (15,2 %, contre 25 % au hasard) et
      les rangs valaient 14/29/27/22. Sept distracteurs raccourcis de 2 à 22 caractères ont replaté la
      distribution à **21/22/27/22**. (3) L'écho de l'énoncé montait alors à **35,9 %**, le plus haut
      des douze cours traités — la clé d'`algo` reprend systématiquement le vocabulaire technique de
      sa question, et elle est intouchable. **12 distracteurs ont reçu les mots de l'énoncé** : les
      têtes strictement gagnantes passent de **20 à 8**, la stratégie de 35,9 % à **28,3 %**.
      **Chaque passe a été mesurée avant et après ; aucune n'a été décidée de tête.**

      ⚠️ **LE GARDE-FOU « OCCURRENCE NON UNIQUE » A EMPÊCHÉ D'ÉCRASER UNE BONNE RÉPONSE, et c'est la
      règle du plan qui s'est vérifiée en direct.** Remplacer le distracteur « La table de hachage »
      de `lecon-28` bilan q6 par une recherche-remplacement de texte aurait **aussi** réécrit la
      **bonne réponse de la question suivante**, qui est exactement la même chaîne. Le contrôle
      « la cible doit apparaître une seule fois dans le fichier » a refusé l'écriture ; le
      remplacement a été refait à la main, borné au tableau `a` de la seule question visée.
      *Un motif de remplacement trop large casse ce qui était juste — mesuré, pas supposé.*

      ⚠️ **UN CONTENU QUI MESURE LE SITE SE PÉRIME EN ÉTANT PUBLIÉ — 7ᵉ fois pour la même page.**
      `doc/lecon-03` publiait « **4 592** manquements à sa propre règle S3, **75,2 %** » → **4 521**
      et **74,1 %**. **Dix mentions** reprises (5 du nombre, 5 du taux), dont **deux dans des blocs
      QCM**, d'où une **seconde** régénération d'index avec `--fresh`. `verif-normatif` est repassé de
      **58/60 à 60/60**, `verif-doc` **36/36**.

      **Contrôles finaux** : `verif.js --rapide` **52 contrôles verts (78,4 s)** ; `verif-html`
      **0 / 1 629** ; `verif-donnees` **25 contrôles, 0 erreur** ; `verif-normatif` **60/60** ;
      `verif-doc` **36/36** ; `verif-rendu` sur les 3 pages touchées (`algo/lecon-16`, `algo/lecon-28`,
      `doc/lecon-03`) à 320 et 1280 px, clair et sombre, réseau coupé : **0 erreur, 0 avertissement** ;
      `mesure-qcm-intouchable` **1 atteinte, exactement la seule déclarée** (l'explication de
      `lecon-01` q1 écrivait « n'changent », élision fautive antérieure à cette passe) ; 0 BOM, 0 CRLF,
      0 mojibake, 0 chevron dans un distracteur, 0 doublon d'option, JSON valide sur les 29 blocs ;
      index régénérés **deux fois avec `--fresh`**, avec contrôle dans `quiz-index.js` lui-même
      (0 ancien distracteur, les textes neufs présents).

      **CE QUI RESTE À FAIRE SUR B4, mesuré après `algo`** : `nodejs` (89 q, 95,5 %), `bdd` (86,
      97,7 %), `react` (86, 92,2 %), `projets-js` (84, 98,8 %), `ruby` (84, 89,9 %), `sql` (82,
      91,9 %), `git` (80, 93,8 %), puis la longue traîne. ⚠️ **`stats` (72 q, 99,3 %) reste le
      cours-témoin de `verif-qcm-biais-mutations` : changer le témoin AVANT de le traiter.**
      **74 cours sur 90 restent au-dessus de 60 %**, et **4 573 questions sur 6 167 restent devinables
      à la longueur**. La case reste **décochée** : douze cours sur les quarante que la cible de B1
      demande.

      ---

      **`nodejs` — FAIT le 2026-09-05. LE COURS EST CLOS : 95,5 % → 25,0 %, 7ᵉ cours le plus nocif
      du site. 27 leçons, 89 questions, 267 distracteurs, un QCM bilan.**

      **LE COURS ENTIER, avant → après. Aucune stratégie ne dépasse 29,0 %, le hasard vaut 25,0 %.**

      | indice, 89 questions | avant | après |
      |---|---:|---:|
      | la plus longue | **95,5 %** | **25,0 %** |
      | COMBINÉ : le tiret puis la longueur | 95,5 % | **25,6 %** |
      | la plus détaillée | 86,6 % | **26,8 %** |
      | le mot technique exclusif | 74,1 % | **27,4 %** |
      | **l'incise entre parenthèses** | 73,4 % | **29,0 %** (meilleure stratégie restante) |
      | l'écho de l'énoncé | 60,8 % | **21,3 %** |
      | la plus prudente | 32,3 % | 25,3 % |
      | la MAJUSCULE d'emphase | 28,9 % | 23,0 % |
      | la plus COURTE (le biais inverse) | 1,7 % | **19,9 %** — il ne s'est PAS retourné |
      | rangs de longueur de la bonne réponse | **86 / 0 / 2 / 1** | **24 / 23 / 25 / 17** |
      | distracteurs hors de 70-130 % | **254 sur 267** | **0** (0,72 à 1,30) |

      **Global du site : 74,0 % → 73,0 %. `nodejs` est marqué `traite`, 13ᵉ cours verrouillé**
      (`algo`, `archi`, `css`, `equipe`, `html`, `iac`, `js`, `maths`, `mobile`, `nodejs`, `python`,
      `ux`, `zig`). Cliquet refigé, épreuve par injection **7/7**, cours-témoin `stats` (99,3 %)
      intact. **265 distracteurs sur 267 réécrits** — les 2 restants sont `npm`/`npx`/`nvm`/`pip` du
      bilan, où la bonne réponse fait **3 caractères** : les quatre options en font 3, aucun signal
      de longueur n'est possible.

      **Six écrivains** sur lots disjoints (01-05, 06-10, 11-15, 16-20, 21-26, 27), puis **cinq
      relecteurs adversariaux** (41 prises), puis correction par un seul écrivain (moi). Aucun commit
      d'agent, un seul écrivain par fichier à tout instant.

      ---

      ⚠️⚠️ **DEUX BONNES RÉPONSES ÉTAIENT FAUSSES, ET ELLES SE CONTREDISAIENT L'UNE L'AUTRE À
      TRAVERS LE COURS.** Les deux sont **prouvées par exécution avant** d'être touchées, et les deux
      atteintes sont déclarées.
      - `lecon-17` q2 : « envoyer à une connexion fermée ou en cours de fermeture **lève une
        erreur** ». **Mesuré sur un serveur WebSocket écrit à la main** (poignée de main RFC 6455,
        aucune dépendance) : `send()` sur un socket **CLOSING ne lève RIEN**, n'émet **aucun**
        événement `'error'`, et le message est **perdu en silence** — c'est-à-dire le contraire du
        danger annoncé, et un danger pire, puisque rien ne le signale. La faute était **recopiée à
        trois endroits du corps** de la même leçon (piège fréquent, liste des pièges, glossaire), et
        **l'explication du QCM** la répétait : les quatre sont corrigées.
      - `lecon-19` q2 : « un worker thread est un fil dans le même processus, **partageant la
        mémoire** ». **Mesuré** : le worker ne voit pas le `globalThis` du principal, `workerData`
        arrive **par copie**, les deux tas sont distincts (6,5 Mo contre 11,5 Mo). Seul « même
        processus » était vrai (pid identique, `threadId` 0 et 1). **Et la bonne réponse de
        `lecon-24` q2, dans le même cours, dit l'inverse — et elle a raison.** Deux bonnes réponses
        d'un même cours en contradiction frontale : aucun de nos indicateurs ne voit ça.

      ⚠️ **UN DISTRACTEUR ÉTAIT VRAI DANS LE QCM BILAN — le bloc le plus vu du cours.** « Stocker des
      données et exécuter des requêtes SQL (un moteur de base) » était donné comme ce que Node **ne
      permet pas**. Mesuré : `require("node:sqlite")` crée une table, l'écrit sur disque et la relit,
      **sans installation, sans drapeau, sans le moindre `ExperimentalWarning`** en v24.16.0
      (`process.versions.sqlite = 3.53.0`, au même titre que V8). **Et `lecon-15` du même cours
      l'écrit noir sur blanc** : l'apprenant qui a lu la leçon 15 était marqué faux au bilan. Au
      passage, `lecon-15` annonçait le module « expérimental » : il ne l'est plus, corrigé.

      ---

      ⚠️⚠️ **UN INDICE DE FORME NEUF — ET C'EST LA VAGUE 1 QUI L'A CRÉÉ. C'est le résultat de
      méthode de ce cours.** Le relecteur du dernier lot a vu ce qu'aucun de nos dix indicateurs ne
      regarde : **le mot d'attaque**. Sur une question en « Pourquoi… ? », les **trois** distracteurs
      ouvrent par « Parce que » et la bonne réponse — **intouchable, donc jamais réécrite** — ouvre
      par « Pour » ou sans connecteur. L'option isolée est la bonne.

      **Et la mesure avant/après est accablante pour le protocole lui-même :**

      | la discordance de connecteur causal | avant la vague 1 | après la vague 1 | après correction |
      |---|---:|---:|---:|
      | le motif se déclenche | 7 questions | 9 | **0** |
      | l'option isolée est la bonne | **1 / 7 = 14,3 %** | **9 / 9 = 100 %** | — |
      | réussite de la stratégie sur le cours | 24,2 % | **32,6 %** | **25,0 %** |

      **Les écrivains ont fabriqué l'indice en appliquant la consigne** : on leur demandait de
      reprendre les mots de l'énoncé dans les distracteurs, ils ont repris le « Pourquoi » sous forme
      de « Parce que » — que la bonne réponse, qu'ils n'avaient pas le droit de toucher, ne portait
      pas. *Corriger un indice en crée un autre* : cette fois l'indice neuf naît **de la correction
      elle-même**, pas d'un déplacement. Réparé par le geste du protocole — aligner un distracteur
      sur la forme de la bonne réponse, jamais l'inverse — sur **9 distracteurs**, avec compensation
      de longueur pour rester dans la fourchette.

      ⚠️ **ET IL A FALLU REMESURER AVANT DE CROIRE LE RELECTEUR — quatrième fois de suite.** Il
      annonçait « **9/10 = 90,0 %** ». C'est un taux de **déclenchement**, pas une réussite : la
      stratégie ne se déclenche que sur 10 % des questions et rend **32,6 %** sur le cours. Surtout,
      il proposait d'en faire un indicateur permanent : **mesuré sur les 6 167 questions du site, il
      se déclenche sur 334 questions et rend 25,8 %, soit l'étalon du hasard.** Ce n'est donc **pas**
      un indice de site comme l'incise entre parenthèses (59,2 %) — c'est un artefact local, à 100 %
      sur `js`, `algo`, `css`, `mobile` et `stats`, mais **nul sur `python` et `offensive` (0/7 et
      0/3)**. L'inscrire dans `mesure-biais-qcm.js` aurait ajouté une ligne qui ne mesure rien.
      *Ce qu'un relecteur VOIT reste juste ; ce qu'il CHIFFRE ne l'est presque jamais.*

      ---

      ⚠️⚠️ **DIX-NEUF CORRECTIONS DANS DES CORPS DE LEÇON, TOUTES PROUVÉES PAR EXÉCUTION — le défaut
      fondateur de la chaîne, à une densité jamais atteinte.** `nodejs` est le premier cours où les
      agents pouvaient **exécuter le sujet lui-même** : Node est sur la machine. Rien de ce qui suit
      n'aurait été trouvé par une relecture.
      - **`lecon-24` : le bloc de code phare de la leçon ne démarre pas.** `require()` et un `await`
        de haut niveau dans le même fichier → `ERR_AMBIGUOUS_MODULE_SYNTAX`, code 1, avant la
        première ligne. L'apprenant qui recopie l'exemple obtient une erreur.
      - **`lecon-27` : l'arrêt propre COUPE les requêtes qu'il promet de terminer.** `serveur.close()`
        est asynchrone ; le code appelait `process.exit(0)` juste après. Mesuré sur deux processus :
        **`ECONNRESET` côté client**. Avec le rappel de `close()`, la même requête sort en **200**.
        Le glossaire de la page définissait pourtant l'arrêt propre comme « on **termine** celles en
        cours ». Corrigé aussi dans la solution de l'exercice 2, qui portait la même faute.
      - **`lecon-20` : le filet de sécurité ne tire pas.** `setTimeout(…, 10_000).unref()` retire le
        minuteur du compte des handles : dès que `pool.end()` ne répond plus, Node **vide la boucle
        et sort avec le code 0** — mesuré : **0 ms, code 0**, en annonçant un arrêt propre. Le schéma
        promettait « exit 1 si le drain traîne ».
      - **`lecon-20` : l'étape 1 du schéma n'existait pas dans le code.** Le schéma numérote
        « 1 · readiness 503 — le LB se retire », mais `shuttingDown` ne servait qu'à ignorer un second
        signal ; la sonde `readiness` ne le lisait pas et répondait 200 pendant tout le drain.
        `health.js` exporte désormais le drapeau et `marquerArret()`.
      - **`lecon-19` et `lecon-24` : « le système d'exploitation répartit les connexions », 8 fois.**
        Faux partout sauf sous Windows. **Source du cœur de Node à l'appui** (`internal/cluster/primary` :
        `SCHED_NONE` seulement `if (process.platform === 'win32')`, sinon `SCHED_RR`), et mesuré : en
        `SCHED_RR`, 9 requêtes sur 3 workers en tourniquet strict ; en `SCHED_NONE`, **les
        9 connexions au même worker**. Les leçons visent Docker et Kubernetes : elles enseignaient
        l'exception comme la règle. Corps, légendes, glossaires et `aria-label` repris.
      - **`lecon-19` : `monitorEventLoopDelay`, un diagnostic à l'envers.** `mean` inclut la
        résolution : au repos, `resolution: 20` affiche **31,4 ms**, soit « des dizaines de ms »,
        c'est-à-dire selon la leçon un event loop « qui souffre ». Un gel réel de 500 ms ressort en
        `max = 500,17`. La leçon envoyait diagnostiquer une panne sur un serveur sain.
      - **`lecon-13` : la sortie de `node --test` n'existe pas sous cette forme.** Le rapporteur
        n'écrit jamais `describe > test` : il ouvre par `▶`, indente, referme la suite, et compte
        `suites 1`. Recopiée de l'exécution réelle.
      - **`lecon-13` : `util.inspect` rend trois lignes, pas une** (règle `compact: 3`).
      - **`lecon-05` : le terminal n'affiche jamais « UnhandledPromiseRejection ».** Node ne le
        produit que si la raison **n'est pas** une `Error` ; celle de la leçon en est une.
      - **`lecon-06` : « Uncaught Error » est du vocabulaire de navigateur.** Node imprime `Error: …`
        puis `Emitted 'error' event at:` — justement la ligne la plus utile au diagnostic.
      - **`lecon-06` : la cause donnée pour l'oubli de `super()` était fausse** — on n'atteint jamais
        `emit`/`on`, le constructeur lève une `ReferenceError` dès le premier `this`.
      - **`lecon-04` : « ta variable `data` contient en réalité l'erreur »** — dans le cas nominal,
        le seul que le lecteur reproduira, elle contient `null`, et la panne est immédiate, pas
        « plus loin ».
      - **`lecon-04` : « l'ordre typique » était l'ordre minoritaire.** Mesuré sur 40 exécutions du
        fichier de la leçon : `setImmediate` sort avant `setTimeout` **38 fois sur 40**.
      - **`lecon-22` : la leçon recommandait l'outil qui produit le contraire de la valeur envoyée.**
        « Idem pour les booléens (`z.coerce.boolean()`) ». **Mesuré avec Zod 4.4.3** (trouvé dans un
        `node_modules` global, donc mesuré et non supposé) : `?actif=false` → **`true`**, `?actif=0`
        → **`true`** ; seule la chaîne vide donne `false`.
      - **`lecon-10` : un `500` là où les leçons 11 et 12 enseignent `400`.** Un corps JSON malformé
        est une faute du client ; `lecon-11` liste « une erreur client renvoyée en 500 » dans ses
        pièges fréquents. Le seul exemple exécutable du cours sur ce point enseignait l'inverse de sa
        propre suite.
      - **`lecon-16` : le `curl` annonçait un `email` que l'API ne peut pas renvoyer** — absent du
        payload du jeton comme de la route ; la section Exercices de la même page donnait, elle, la
        bonne sortie.
      - **`lecon-18` : le middleware d'erreur ne journalisait RIEN.** `req.log?.error(…)` — `req.log`
        n'est posé par aucun middleware de la leçon : l'optional chaining faisait de la journalisation
        un **no-op silencieux**, et le bug était masqué au client **comme au serveur**. Mesuré : les
        trois routes de démonstration, dont un vrai `TypeError`, ne laissent **aucune trace**.
      - **`lecon-21` : le schéma qui enseigne le paramétrage montrait une concaténation**
        (`WHERE nom LIKE '%Ada%'` en dur) pendant que sa légende annonçait « le paramétrage évite
        l'injection ». Remplacé par `LIKE $1` et la valeur du paramètre à part.
      - **`lecon-02` : « CommonJS reste le format par défaut » est faux depuis Node 22.7.** Un `.js`
        contenant `import`, sans aucun `package.json`, **tourne en ES Module** (mesuré). Note ajoutée.

      ⚠️ **ET LE MÊME FAIT A RENDU TROIS DISTRACTEURS OBSERVABLEMENT VRAIS**, dans `lecon-02` q1 :
      `"module": true`, `"esm": true`, la directive `"use module"` et le champ `"exports"` laissent
      tous `"type"` absent — **donc la détection de syntaxe opère et le fichier tourne**. L'apprenant
      qui teste voit la « mauvaise » réponse fonctionner. Les trois sont remplacés par des actions qui
      **échouent durement**, chacune mesurée : `.es6` → `ERR_UNKNOWN_FILE_EXTENSION`, `nodemodule` →
      commande inconnue, `--esm` → *bad option*, `--input-type=module` sur un fichier →
      `ERR_INPUT_TYPE_NOT_ALLOWED`, `require.esm` → `undefined`.

      ⚠️ **DEUX AUTRES DISTRACTEURS ÉTAIENT VRAIS À LEUR MOITIÉ LA PLUS LUE**, mesurés tous les deux :
      « `exec` s'impose pour une commande longue **car il rend la main avant la fin** » — exact (3 ms
      pour une commande de 400 ms), la clause fausse étant rejetée en fin de phrase sur `spawn` ; et
      « `node --test-coverage` … **échoue dès que la couverture descend sous 80 %** » — seul le **nom**
      du drapeau était faux, `--test-coverage-lines=80` fait exactement cela.

      ⚠️ **HUIT QUESTIONS TOMBAIENT SOUS QUATRE CHOIX, et aucun de nos indicateurs ne le voit —
      cinquième cours de suite.** Trois paires de distracteurs **jumeaux**, qui s'éliminaient ensemble
      sur un seul mot : `lecon-06` q1 (deux fois l'inversion `on`/`once`), `lecon-19` q2 (deux fois
      l'inversion fil/processus), `lecon-20` q2 (deux fois « les requêtes en vol aboutissent »). Trois
      options qui **niaient la prémisse de leur propre énoncé** : `lecon-24` q1 (« pourquoi ça
      bloque ? » → « ça ne bloque pas »), `lecon-26` q3 (« pourquoi l'idempotence ? » → « la livraison
      est exactly-once »), `lecon-12` q2 (« comment Express identifie ce maillon ? » → « Express
      l'écarte »). Plus `lecon-11` q3, dont la prémisse détruisait sa propre conclusion, et `lecon-11`
      q1, seule option à ne pas répondre à la seconde moitié de l'énoncé — donc éliminable **sur la
      forme**, sans rien savoir d'Express.

      ⚠️ **J'AI REFUSÉ UNE PRISE, ET LA MESURE M'A DONNÉ TORT CONTRE UN RELECTEUR SUR UNE AUTRE.**
      *Refusée* : `lecon-25` q3, où la bonne réponse dit « sans vrai réseau ni vraie horloge » pour
      `mock.fn`. Vérifié moi-même : `mock.fn` ne touche pas l'horloge (c'est `mock.timers`), mais
      `mock.method(obj, 'maintenant', …)` **rend bien 1234** — remplacer une dépendance qui lit
      l'horloge est exactement ce que la phrase décrit. **La bonne réponse est défendable, on n'y
      touche pas.** *Partiellement réfutée* : le relecteur affirmait que le `// affiche:` de
      `lecon-08` mentait sur l'ordre de `readdir`. **Il avait mesuré sur `D:`, j'ai mesuré sur `C:` —
      même machine, même Node, même code : `[ 'exports', 'a.txt', 'b.txt' ]` d'un côté,
      `[ 'a.txt', 'b.txt', 'exports' ]` de l'autre.** Le commentaire n'était donc pas faux, il était
      **invérifiable** : la leçon annonçait comme une sortie ce qui dépend du volume. Corrigé en
      publiant **les deux** ordres mesurés et le conseil qui va avec (`entrees.sort()`).

      ⚠️ **UN PIÈGE D'OUTILLAGE NEUF, ET IL A FAILLI PASSER : `git stash` A CONVERTI TOUT L'ARBRE DE
      TRAVAIL EN CRLF.** Le dépôt est en `core.autocrlf=true` ; un aller-retour `stash`/`stash pop`
      — fait pour comparer une mesure de rendu avant/après — a réécrit **31 fichiers** en CRLF, dont
      les 23 leçons du cours et cinq fichiers `js/` que je n'avais jamais ouverts. **Ni `verif-html`,
      ni `verif-donnees`, ni la mesure de biais ne le voient** : seul le contrôle de forme dédié l'a
      pris. Même famille que « l'outil d'édition écrit en CRLF » du cours `css`, mais **par une
      commande qu'on croit en lecture seule**. Reconverti en LF, et les cinq fichiers non modifiés
      restaurés depuis `HEAD` après comparaison octet à octet.

      ⚠️ **UN CONTENU QUI MESURE LE SITE SE PÉRIME EN ÉTANT PUBLIÉ — 8ᵉ fois pour la même page.**
      `doc/lecon-03` publiait **4 521** manquements à sa propre règle S3 et **74,1 %** → **4 458** et
      **73,0 %**. **Dix mentions**, dont dans un bloc QCM, d'où une **seconde** régénération d'index
      avec `--fresh`. `verif-normatif` repassé de **58/60 à 60/60**.

      **Contrôles finaux** : `verif.js --rapide` **52 contrôles verts (84,8 s)** ; `verif-html`
      **0 / 1 629** ; `verif-donnees` **25 contrôles, 0 erreur** ; `verif-normatif` **60/60** ;
      `verif-rendu` sur les **6 pages à structure modifiée** (`lecon-02`, `19`, `20`, `21`, `24`,
      `doc/lecon-03`), 3 largeurs × 2 thèmes, réseau coupé : **0 erreur, 0 avertissement** ;
      `mesure-qcm-intouchable` **3 atteintes, exactement les 3 déclarées** ; 0 BOM, 0 CRLF,
      0 mojibake, 0 chevron dans un distracteur, 0 doublon d'option, JSON valide sur les 28 blocs ;
      index régénérés **deux fois avec `--fresh`** — dont `pieges`, **oublié au premier passage et
      rattrapé par `verif-donnees`** : toute retouche de prose dans un encadré d'erreur le périme.

      ⚠️ **UN DÉFAUT TROUVÉ ET LAISSÉ, DÉLIBÉRÉMENT — hors du périmètre de B4, mais à ne pas
      perdre.** `verif-rendu` avertit que `nodejs/lecon-27` déclare « 3 exercices pour 4 blocs
      `.exercise` ». Le 4ᵉ bloc est le **capstone « Projet »**, qui n'a légitimement pas de champ de
      réponse. Mesuré sur tout le site : **39 leçons sur 1 540** dans ce cas, toutes des fins de
      cours. C'est donc un **faux positif systématique** de l'heuristique, pas un trou de contenu —
      et un avertissement qui crie 39 fois est un avertissement qu'on cesse de lire, exactement le
      défaut que B2 décrivait. **À traiter en phase F** : compter les `.exercise` en excluant le
      capstone.

      **CE QUI RESTE À FAIRE SUR B4, mesuré après `nodejs`** : `bdd` (86 q, 97,7 %), `react` (86,
      92,2 %), `projets-js` (84, 98,8 %), `ruby` (84, 89,9 %), `sql` (82, 91,9 %), `git` (80,
      93,8 %), puis la longue traîne. ⚠️ **`stats` (72 q, 99,3 %) reste le cours-témoin de
      `verif-qcm-biais-mutations` : changer le témoin AVANT de le traiter.**
      **72 cours sur 90 restent au-dessus de 60 %**, et **4 503 questions sur 6 167 restent
      devinables à la longueur**. La case reste **décochée** : treize cours sur les quarante que la
      cible de B1 demande.
      ---

      **`bdd` — FAIT le 2026-09-05. LE COURS EST CLOS : 97,7 % → 25,6 %, 8ᵉ cours le plus nocif du
      site au cadrage. 15 leçons, 86 questions, 258 distracteurs, tous réécrits.**

      | mesure, cours entier | avant | après |
      |---|---:|---:|
      | la plus longue | **97,7 %** | **25,6 %** |
      | meilleure stratégie exploitable | 97,7 % | **33,6 %** (le mot technique exclusif) |
      | la plus détaillée | 86,7 % | 27,3 % |
      | l'incise entre parenthèses | 65,4 % | 29,7 % |
      | la plus COURTE (biais inverse) | 0,0 % | 18,6 % |
      | rangs de longueur de la bonne réponse | **84 / 2 / 0 / 0** | **22 / 27 / 21 / 16** |
      | distracteurs hors de 70-130 % | **251 sur 258** | **0** (0,71 à 1,27) |
      | global du site | 73,0 % | **72,0 %** |

      ⚠️⚠️ **UN SEUL DÉFAUT DE FOND EXPLIQUE LA MOITIÉ DES PRISES, ET IL TRAVERSE CINQ LEÇONS :
      `billet` n'a PAS de `client_id`.** Le schéma canonique, identique dans six leçons, est
      `billet(billet_id, commande_id, representation_id, place_id, prix_paye)` avec
      `UNIQUE(representation_id, place_id)` — un client atteint sa représentation par la chaîne
      `client → commande → billet`. **Cinq endroits du cours disaient l'inverse, dont DEUX BONNES
      RÉPONSES** :
      1. **`lecon-03` q2** annonçait « une ligne par **couple client-représentation** ». Faux, et
         **sa propre explication disait juste** (« une ligne par association réelle ») : trois places
         pour la même séance font **trois** lignes pour un seul couple. Prouvé par exécution :
         `GROUP BY (client, representation)` → `[[42, 7, 3]]`.
      2. **`lecon-15` bilan q4** faisait porter à `billet` « les deux clés étrangères » d'un N-N
         `client × representation`, et rangeait `place_id` parmi les **attributs propres** — alors
         que c'est une clé étrangère, et que `lecon-04` q3 dit le contraire. **Deux bonnes réponses
         du même cours se contredisaient**, comme sur `nodejs`.
      3. le **diagramme** de `lecon-03` (boîte `billet` : `client_id`), à douze lignes d'un
         `CREATE TABLE` qui déclare `commande_id` — le défaut fondateur de la chaîne, encore ;
      4. le bloc d'ouverture de `lecon-01`, qui promet « on justifiera CHAQUE choix » pour un choix
         que `lecon-06` contredit mot pour mot ;
      5. **`place.salle_id` en `lecon-04` et `lecon-09`** : une dépendance transitive
         `place → zone → salle` **dans la leçon même qui enseigne la 3NF**, que le schéma final de
         `lecon-15` avait supprimée sans le dire.

      ⚠️ **UNE TROISIÈME BONNE RÉPONSE FAUSSE, réfutée par exécution** : `lecon-08` q5 disait qu'une
      colonne liste ne se laisse « ni contraindre (`UNIQUE`), ni indexer ». Les deux sont **acceptés
      ET utilisés** (plan `SEARCH … USING COVERING INDEX`) ; ce qu'ils ne savent pas faire, c'est
      regarder **à l'intérieur** de la chaîne — ce que le corps de la leçon écrivait correctement.
      Son explication portait la même absolue et a été corrigée aussi.

      ⚠️⚠️ **LE DÉFAUT LE PLUS GRAVE EST DANS UN CORPS DE LEÇON : la migration de `lecon-14` était
      CIRCULAIRE.** Le calcul du prénom **lisait `nom`**, c'est-à-dire la valeur que la migration
      doit produire, et `nom = /* la partie nom, calculée */ nom` était une affectation à elle-même.
      Rejouée dans les trois états possibles :

      | état de départ | ce qui se passe RÉELLEMENT |
      |---|---|
      | **A** — `nom` = l'ancien fourre-tout (ce que dit la prose) | `prenom` reçoit la **chaîne vide** : `prenom IS NULL` devient faux, le garde-fou est grillé, **le rejeu ne rattrape rien** — corruption silencieuse, sans une erreur |
      | **B** — `nom` colonne neuve et vide (ce que dit le schéma) | strict **no-op**, le `SET NOT NULL` du temps 3 échouerait toujours |
      | **C** — `nom` contient déjà le nom isolé | ça marche : c'est-à-dire quand le travail à faire est **déjà fait** |

      Aggravations : la règle annoncée (« tout avant le dernier espace ») n'était pas celle que le
      code appliquait ; et sous PostgreSQL une longueur négative lève `negative substring length not
      allowed` là où SQLite rend `''` — **la migration était fausse différemment selon le moteur**.
      Remplacée par une migration prouvée **idempotente** et qui **traite une ligne arrivée après
      coup**, les deux propriétés vérifiées sur le bloc **ré-extrait du fichier publié**, pas sur le
      brouillon. Le schéma et le commentaire du code se contredisaient aussi sur l'état de `nom`
      (« nouveau, vide » contre « existe déjà ») — **c'était la variable dont dépendait tout le
      résultat**.

      ⚠️ **UNE MESURE A RENVERSÉ UNE EXPLICATION** : `lecon-11` q4 affirmait que `WHERE place_id = 12`
      « **ne peut pas exploiter** » un index sur `(representation_id, place_id)`. Sur 90 000 billets
      (300 × 300) après `ANALYZE`, le plan est
      `SEARCH billet USING COVERING INDEX (ANY(representation_id) AND place_id=?)` et la requête
      passe de **2,18 ms à 0,27 ms — 8 fois plus vite grâce à l'index déclaré inutilisable**. La
      règle du préfixe gauche interdit d'**entrer** par la gauche, pas de s'en servir (MySQL 8.0.13
      a le *skip scan*, et la documentation PostgreSQL dit qu'un B-tree multicolonne sert
      n'importe quel sous-ensemble de ses colonnes). Énoncé et explication **bornés** plutôt que
      retournés — le témoin le justifie : un index qui *commence* par `place_id` rend 0,093 ms, donc
      le composite reste un pis-aller. **Les six autres occurrences de l'absolue** ont été corrigées
      dans le corps, le SVG, l'`aria-label`, la solution de l'exercice 2, le tableau mémo et le récap.

      ⚠️⚠️ **PUIS LA CORRECTION A CASSÉ TROIS BLOCS SQL, ET C'EST LA LEÇON DE MÉTHODE DE CETTE
      PASSE.** Retirer `place.salle_id` en `lecon-04` et `lecon-09` a rendu **inexécutables** deux
      requêtes de `lecon-10` et une de `lecon-13`, restées sur `p.salle_id` — *le défaut fondateur
      reparu par la bande*, dans des fichiers hors des lots corrigés, à cause d'une correction juste.
      Trouvé parce qu'un correcteur a **signalé au-delà de son mandat** au lieu de s'arrêter à son
      lot ; vérifié par exécution (`no such column: p.salle_id`) ; réparé en passant par la zone.
      Les trois requêtes rendent **15**, exactement le chiffre que la prose de `lecon-10` annonce.
      **Retenir : une correction de schéma se propage à tout le cours, jamais au seul fichier
      corrigé — chercher le nom de la colonne retirée dans les quinze leçons, pas dans les deux.**

      **LE PREMIER MOTEUR SQL DE LA CHAÎNE.** `scratchpad/b4b-sql.js` donne **SQLite 3.49.1** sous
      Node, sans réseau : c'est le `sql.js` embarqué du site (V14), chargé depuis son base64 avec
      `wasmBinary` — le `.wasm` n'existe pas sur le disque. Une centaine d'exécutions sur les trois
      vagues. **Ce que ça a rapporté** : `PRAGMA foreign_keys` OFF par défaut, `UNIQUE` contre index
      ordinaire, les quatre `ON DELETE`, le préfixe gauche, la non-sargabilité de `lower(email)`,
      `ADD COLUMN NOT NULL` sans `DEFAULT`, un compteur dénormalisé qui diverge en silence (97
      contre 98), un `TEXT PRIMARY KEY` qui accepte **deux** lignes de clé `NULL`, et un identifiant
      supprimé **réattribué** sans `AUTOINCREMENT` — les deux derniers contredisant le corps de
      `lecon-05`, qui nomme SQLite trois fois.
      ⚠️ **Et ce qu'il ne prouve PAS** : toute la `lecon-13` (isolation, `SELECT … FOR UPDATE`,
      `READ COMMITTED`) est refusée jusqu'à la syntaxe. Le relecteur l'a dit explicitement au lieu
      de deviner, et c'est la bonne conduite.

      **41 prises rendues par 6 relecteurs, 30 retenues, 5 refusées après mesure, 6 arbitrées.**
      Les refus comptent autant que les prises :
      - **`lecon-09` q2, la portée de la 2NF** (« seulement quand la clé primaire est composite ») :
        techniquement fondé — la 2NF se définit sur *toutes* les clés candidates — mais **refusé**,
        parce que le corps de la leçon dit la même chose à **cinq endroits** dont la charnière d'un
        corrigé d'exercice, que c'est la définition des manuels, et qu'**aucun distracteur ne devient
        vrai**. Corriger le seul QCM aurait fabriqué la contradiction qu'on chasse. ⚠️ Le prix est
        réel et consigné : la table phare `billet` a une clé primaire simple **plus** une clé
        candidate composite, donc `spectacle_titre` y est aussi une dépendance *partielle*.
      - **`lecon-11` q5** (index peu sélectif) : le relecteur a **refait la mesure et réfuté**
        l'inquiétude de l'écrivain — SQLite choisit l'index même à 95 % de sélectivité, mais aucune
        option n'affirme rien sur le choix de l'optimiseur, et la bonne réponse (« l'index n'évite
        presque aucune lecture ») est même **en dessous** de la vérité mesurée (14,0 ms sans index
        contre 15,9 ms avec).
      - **`lecon-14` q2** : le relecteur affirmait « SQLite refuse même sur une table vide ». **Le
        correcteur l'a mesuré et l'a réfuté** : en 3.49.1 c'est accepté sur table vide et refusé dès
        la première ligne. Le seul moteur exécutable *confirmait* donc la bonne réponse. **Une prise
        de relecteur réfutée par le correcteur : la contradiction doit elle-même être contredite.**

      ⚠️ **TROIS CORRECTEURS SUR QUATRE ONT FABRIQUÉ UN INDICE DE FORME EN APPLIQUANT MON PROPRE
      TEXTE, L'ONT MESURÉ, ET L'ONT DÉFAIT.** Les textes que j'avais dictés supprimaient sans y
      penser la seule incise, les seuls guillemets ou la seule parenthèse hors bonne réponse : sur
      trois lots, « désigne la SEULE bonne réponse » remontait de 0,0 % à 3,8-6,7 %. **C'est la
      preuve que le contrôle par la mesure doit être remis en consigne à CHAQUE étage, y compris
      quand c'est le coordinateur qui écrit le texte.** Le jugement n'est pas exempt de la mesure.

      ⚠️ **UN PIÈGE D'OUTILLAGE NEUF, trouvé par deux correcteurs indépendamment** :
      `grep -c $'\r' fichier` sous Git Bash rend **le nombre total de lignes**, pas le nombre de
      lignes contenant un CR. Deux correcteurs ont cru l'arbre en CRLF et ont construit leurs ancres
      en `\r\n` — zéro occurrence trouvée. **Compter les octets 13 avec Node est la seule mesure
      fiable.** (Famille de `git stash` convertit l'arbre en CRLF, trouvé sur `nodejs`.)

      **Contrôles** : `mesure-qcm-intouchable` = **11 atteintes, toutes déclarées d'avance dans le
      jugement et aucune de plus** ; `verif.js --rapide` **26 étapes tout vert (85,2 s)** ;
      `verif-html` **0** ; `verif-donnees` **0 erreur** ; `verif-normatif` **60/60** ;
      `verif-qcm-biais-mutations` **7/7** ; `verif-rendu` **42 mesures (7 pages × 3 largeurs ×
      2 thèmes), 0 erreur, réseau coupé** ; cliquet refigé, `bdd` marqué `traite` (**14 cours**).

      ⚠️ **`doc/lecon-03` s'est repérimée une 5ᵉ fois** (73,0 % → **72,0 %**, 4 458 → **4 396**) —
      et cette fois le repérage a montré mieux : **son QCM chiffrait le taux à DEUX endroits que
      `verif-normatif` ne garde pas**, dont une **bonne réponse** qui disait « huit cas sur dix »
      pour un taux mesuré à 72,0 %, et qui deviendra franchement fausse à mesure que B4 avance. Le
      chiffre en a été retiré ; il ne reste qu'aux trois endroits surveillés. **La leçon D1 se
      complète : injecter un chiffre par marqueur ne suffit pas, il faut que TOUTES ses occurrences
      soient sous le vérificateur — celles qui ne le sont pas pourrissent en silence.**

      **CE QUI RESTE À FAIRE SUR B4, mesuré après `bdd`** : `projets-js` (84 q, 98,8 %), `react`
      (86, 92,3 %), `git` (80, 93,8 %), `ruby` (84, 89,9 %), `sql` (82, 91,9 %), `java` (77,
      94,2 %), puis la longue traîne. ⚠️ **`stats` (72 q, 99,3 %) reste le cours-témoin de
      `verif-qcm-biais-mutations` : changer le témoin AVANT de le traiter.**
      **71 cours sur 90 restent au-dessus de 60 %**, et **4 441 questions sur 6 167 restent
      devinables à la longueur**. La case reste **décochée** : quatorze cours sur les quarante que
      la cible de B1 demande.

      ---

      **`projets-js` — FAIT le 2026-09-05. LE COURS EST CLOS : 98,8 % → 22,6 %, 9ᵉ cours le plus
      nocif du cadrage. 24 leçons, 84 questions, 252 distracteurs, tous réécrits.**

      | mesure, cours entier | avant | après |
      |---|---:|---:|
      | la plus longue | **98,8 %** | **22,6 %** |
      | meilleure stratégie exploitable | 98,8 % | **30,7 %** (le mot technique exclusif) |
      | la plus détaillée | 83,3 % | 25,2 % |
      | le mot technique exclusif | 93,1 % | 22,0 % |
      | l'incise entre parenthèses | 63,4 % | 25,8 % (**seule bonne réponse : 51,2 % → 1,2 %**) |
      | le point-virgule | 51,2 % | 27,3 % |
      | la plus COURTE (biais inverse) | 0,0 % | 26,2 % |
      | rangs de longueur de la bonne réponse | **83 / 1 / 0 / 0** | **19 / 20 / 23 / 22** |
      | distracteurs hors de 70-130 % | **247 sur 252** | **0** (0,71 à 1,30) |
      | global du site | 72,0 % | **71,0 %** |

      Toutes les stratégies mesurées tiennent dans la **bande de bruit du lot (15,5 à 34,5 %)**.

      ⚠️⚠️ **LE RÉSULTAT PRINCIPAL EST UN INDICE QUE LA CORRECTION A FABRIQUÉ, ET QU'AUCUN OUTIL DE
      LA CHAÎNE NE VOYAIT : LE MOT D'ATTAQUE.** Les six écrivains ont calqué « Parce que… » sur les
      trois distracteurs de la même question en laissant la bonne réponse commencer autrement :
      l'apprenant n'a plus qu'à repérer l'intrus. **Trois relecteurs sur six l'ont signalé sans se
      concerter** (comme l'incise entre parenthèses sur `js`), et la mesure faite ensuite le
      confirme :

      | « l'option dont le mot d'attaque diffère des trois autres » | taux | quand la règle s'applique |
      |---|---:|---:|
      | avant la vague d'écriture | 25,9 % | 7/25 = 28,0 % |
      | **après la vague d'écriture** | **29,8 %** | **10/24 = 41,7 %** |
      | après la vague de correction | 22,0 % | 1/14 = 7,1 % |

      Il est maintenant la **11ᵉ stratégie de `tools/mesure-biais-qcm.js`** — et la mesure sur le
      site entier commande la conduite à tenir : **26,6 % sur les 6 167 questions, c'est-à-dire le
      niveau du hasard.** Ce n'est donc **pas** un biais du site, c'est un biais **que la réécriture
      fabrique**. Il n'entre **pas** dans les `EXPLOITABLES` de `verif-qcm-biais.js`, par la même
      règle qui avait écarté « la MAJUSCULE d'emphase » (28,7 %) — mais il est désormais **mesuré à
      chaque passe**, ce qui est tout l'objet. **Retenir : un indice à 26 % sur le site peut valoir
      42 % sur le cours qu'on vient de réécrire. La mesure globale ment sur le travail local.**

      ⚠️ **ET L'OUTIL QUI MESURAIT CET INDICE ÉTAIT LUI-MÊME CASSÉ — par le piège du heredoc, sur
      MOI cette fois.** Le premier jet de `scratchpad/b4pjs/attaque.js` portait un **vrai caractère
      U+0008** à la place de la séquence antislash-b de son expression régulière : la regex ne
      matchait jamais, l'outil retombait en silence sur le seul premier mot, et **sous-estimait**
      l'indice (37,8 % annoncés au lieu de 29,8 %, « parce que » compté séparément de « parce
      qu' »). **C'est un correcteur qui l'a trouvé**, en refusant de croire un chiffre qu'il ne
      reproduisait pas. Le piège consigné pour `python` a donc mordu le coordinateur qui le mettait
      en consigne. Réparé, mesure refaite : les trois chiffres du tableau ci-dessus sont ceux de
      l'outil réparé.

      ⚠️⚠️ **TROIS BONNES RÉPONSES FAUSSES, chacune réfutée par exécution** (6 atteintes à
      l'intouchable, toutes déclarées d'avance) :
      1. **`lecon-01` q2** répondait « une erreur ou un message explicite (ex. « division par
         zéro ») » à la question « que renvoie `calculer(5, "/", 0)` ? ». Le code rend **`null`** —
         la leçon l'écrit cinq fois, dont deux en sortie commentée — et c'est `egal` qui traduit ce
         `null` en `"Erreur"`. La bonne réponse décrivait la couche d'à côté.
      2. **`lecon-09` q2** annonçait que trois cases vides « seraient déclarées gagnantes à tort »
         sans le garde `plateau[a] &&`. Énumération exhaustive des grilles : **0 faux gagnant** (la
         fonction rend `null`, une valeur fausse) et **304 vrais gagnants MANQUÉS** — elle sort au
         premier triplet vide. Le « Piège fréquent » de la même leçon disait juste, et
         **contredisait sa propre légende de code** douze lignes plus haut.
      3. **`lecon-12` q1** annonçait qu'oublier `intervalle = null` « créerait un second intervalle
         sans arrêter le premier, d'où des décomptes en double ». Mesuré : **0 tic en double** — la
         garde `if (intervalle !== null) return;` bloque *tout* redémarrage et la bascule route
         toujours vers `pause()`. La vraie panne est que **le bouton reste bloqué sur « Démarrer »**.

      ⚠️⚠️ **LE DÉFAUT FONDATEUR DE LA CHAÎNE, RETROUVÉ QUATRE FOIS DANS LE MÊME COURS, ET VU
      SEULEMENT PAR LE CLIC DANS UN VRAI CHROME :**
      - **`lecon-24`** : trois blocs portant un bouton « ▶ Tester » annoncent une sortie en
        commentaire et lèvent `ReferenceError: isoDate is not defined` (et `derniersJours`) — parce
        que `js/runner.js` **n'exécute que le bloc cliqué**, sans les précédents. Rendus autonomes,
        **boutons recliqués**, sorties conformes. ⚠️ `verif-exemples.js` est **structurellement
        aveugle** à ces trois blocs : son garde `NON_DETERMINISTE` filtre sur `new Date` et les
        classe « non vérifiés », donc il rendait « aucune divergence » pendant que l'apprenant
        voyait une erreur rouge. **À porter au plan : un bloc non déterministe n'est pas un bloc
        dispensé de s'exécuter.**
      - **même leçon** : `new Date("2026-07-24")` est parsé en **UTC** alors qu'`isoDate` lit la
        date **locale**. Mesuré dans 9 fuseaux : à Paris, UTC, Abidjan et Tokyo les sorties
        annoncées sont exactes ; à **New York, Montréal, São Paulo et Honolulu** la leçon annonce
        `2` et `29` là où le code rend **`1` et `14`**. Ironie : l'encadré « Piège fréquent » de la
        page met en garde contre exactement cela. Corrigé, revérifié dans 5 fuseaux sous Chrome et
        9 sous Node.
      - **`lecon-16`** : le jeu décrit **ne tourne pas**. La leçon affirme que « c'est `avancer(etat)`
        (leçon 15) qui lit `directionDemandee` » — or `avancer` ne lit jamais cette propriété
        (écrite 2 fois, lue 0 fois dans tout `pages/`), et la boucle appelait `avancer` au lieu de
        `jouerTour` : après 60 images, tête à **x = 10 sur une grille large de 10**, score 0,
        longueur 3, statut « en cours ». Le serpent ne pouvait **ni tourner, ni manger, ni perdre**.
        Corrigé, rejoué : virage pris, demi-tour refusé, score 1, statut « perdu » au mur. **Le
        texte du schéma SVG portait la même faute** — le défaut fondateur, encore dans un diagramme.
      - **`lecon-18`** : `audioCtx.resume(); console.log(audioCtx.state); //=> "running"`. Mesuré
        dans Chrome avec activation utilisateur : l'état vaut encore **`suspended`** juste après
        l'appel, et ne passe à `running` qu'après l'attente de la promesse. Bloc réécrit, les deux
        sorties mesurées.

      ⚠️ **UN COURS DE PROJETS DONT LES LEÇONS NE SE RACCORDENT PAS.** Écrivains et relecteurs ont
      trouvé, indépendamment, cinq ruptures d'API entre leçons voisines qui se déclarent pourtant la
      suite l'une de l'autre : `lecon-02` appelle `etatInitial()`, `appuyerChiffre`, `appuyerVirgule`
      quand `lecon-01` livre `saisirChiffre`, `egal`, `effacer` ; `lecon-04` appelle `quiz.courante()`
      et `quiz.total` quand `lecon-03` livre des **getters** et `questions.length` — et écrit
      explicitement « on les appelle comme des propriétés, **pas** `quiz.courante()` » ; `lecon-08`
      indexe un tableau par l'**objet** que rend `force()` ; `lecon-14` appelait `decrireTemps` et
      `iconePour`, **absentes** de `lecon-13` qui ne livre que `codeVersLibelle` (13 références
      fantômes, **toutes converties**, résidus 0) ; `lecon-12` publiait un `tic` annoncé « rapatrié
      de la leçon 11 » avec `restant > 1` au lieu de `> 0`, ce qui **supprime le `00:00`** que la
      leçon 11 présente comme le comportement attendu d'un minuteur. Les deux dernières sont
      corrigées ; **les trois premières restent** — elles demandent de trancher quelle leçon fait
      autorité, ce qui dépasse le mandat d'une passe de QCM. **C'est le point à reprendre sur ce
      cours.**

      ⚠️ **QUATRE CORRECTEURS SUR SIX ONT FABRIQUÉ UN INDICE EN CORRIGEANT, L'ONT MESURÉ, ET L'ONT
      DÉFAIT** — la leçon de `bdd` se répète à l'identique : en retirant l'incise finale des
      distracteurs, l'un a rendu la bonne réponse **seule porteuse d'une parenthèse** (0 → 6,7 %) ;
      un autre a fait monter « le mot technique exclusif » de 25,6 % à **32,2 %** en appauvrissant
      un distracteur ; un troisième a envoyé « la plus COURTE » à **41,7 %** en allongeant quatre
      distracteurs, puis « la plus détaillée » à 32,6 % en corrigeant la première dérive. **Trois
      vagues de rattrapage, toutes déclenchées par une remesure, aucune par une intuition.**

      ⚠️ **DES PRISES DE RELECTEUR RÉFUTÉES PAR LES CORRECTEURS**, comme il se doit : deux textes de
      remplacement proposés ont été **écartés** parce qu'ils reproduisaient le défaut dénoncé (l'un
      dupliquait le mécanisme d'un autre distracteur, l'autre concédait le vrai avec un « aussi ») ;
      un relecteur annonçait « 15 624 plateaux, 216 gagnants manqués » là où le correcteur, sur son
      propre domaine, a mesuré **304 sur 19 683** — même conclusion, chiffres différents, et c'est
      **le chiffre du correcteur qui est publié**. Un troisième annonçait la parenthèse finale à
      48,9 % ; remesurée, 45,0 %.

      **Contrôles** : `mesure-qcm-intouchable` = **6 atteintes, toutes déclarées d'avance** (les
      trois bonnes réponses fausses et leurs explications), **252 distracteurs réécrits** ;
      `verif.js --rapide` **26 étapes tout vert (82,9 s)** ; `verif-html` **0** ; `verif-donnees`
      **0 erreur** ; `verif-doc` **36/36** ; `verif-normatif` **60/60** ; `verif-exemples`
      **0 divergence** ; `verif-qcm-biais-mutations` **7/7** ; index régénérés **avec `--fresh`**
      (sans lui, `quiz-index` et `pieges-data` reprenaient deux entrées périmées **en silence** —
      `verif-donnees` I18 les a vues) ; cliquet refigé, `projets-js` marqué `traite` (**15 cours**).
      ⚠️ **`doc/lecon-03` s'est repérimée une 6ᵉ fois** (72,0 % → **71,0 %**, 4 396 → **4 332**), et
      **`doc/lecon-01` pour la première fois** (9 577 → 9 578 titres hors ASCII, 9 008 → 9 007
      fragments) : corriger un corps de leçon périme les chiffres que le cours `doc` publie sur le
      site lui-même.

      ⚠️ **Un défaut de rendu PRÉEXISTANT, mesuré et laissé** : `lecon-16` déborde de **+11 px à
      320 px** dans les deux thèmes. Vérifié contre un témoin (la version d'avant la passe, copiée
      sous un nom temporaire puis retirée) : elle déborde **exactement pareil**, et les leçons
      voisines non touchées ne débordent pas. Ce n'est donc pas notre fait — mais c'est un vrai
      défaut, à reprendre hors B4.

      **CE QUI RESTE À FAIRE SUR B4, mesuré après `projets-js`** : `react` (86 q, 92,2 %), `ruby`
      (84, 89,9 %), `sql` (82, 91,9 %), `git` (80, 93,8 %), `rust` (76, 96,1 %), `java` (77,
      94,2 %), puis la longue traîne. ⚠️ **`stats` (72 q, 99,3 %) reste le cours-témoin de
      `verif-qcm-biais-mutations` : changer le témoin AVANT de le traiter.**
      **70 cours sur 90 restent au-dessus de 60 %**, et **4 377 questions sur 6 167 restent
      devinables à la longueur**. La case reste **décochée** : quinze cours sur les quarante que la
      cible de B1 demande.

      ---

      **`react` — FAIT le 2026-09-05. LE COURS EST CLOS : 92,2 % → 16,0 %.** 26 leçons,
      **86 questions**, **258 distracteurs**, **255 réécrits**, tous entre **0,71 et 1,27**.
      ⚠️ **La première passe d'écriture avait été TUÉE avant son commit** : l'arbre de travail
      portait 26 leçons modifiées et non validées. Elles ont été mesurées avant d'être reprises
      (93,0 % → 27,9 %, `mesure-qcm-intouchable` 0 atteinte) plutôt que jetées.

      | stratégie, sur les 86 questions | avant | après |
      |---|---:|---:|
      | la plus longue | **92,2 %** | **16,0 %** |
      | la plus détaillée | 89,8 % | **30,5 %** |
      | le mot technique exclusif | 73,7 % | **30,9 %** |
      | l'incise entre parenthèses | 71,9 % | **30,4 %** |
      | l'écho de la question | 62,0 % | **22,5 %** |
      | **MEILLEURE STRATÉGIE** | **92,2 %** | **30,9 %** |
      | rangs de longueur | **80/4/1/1** | 16/28/25/17 |
      | fourchette distracteur / bonne réponse | 0,07–6,33 (244 hors) | **0,71–1,27 (0 hors)** |

      Site « la plus longue » : **71,0 % → 69,9 %**. **16 cours marqués `traite`.**

      ⚠️⚠️ **UN 12ᵉ INDICE, NÉ DE LA VAGUE D'ÉCRITURE, ET VU PAR UN SEUL RELECTEUR SUR SIX.** La
      réécriture a terminé par un **POINT** chacun des 45 distracteurs des leçons 16 à 20, en
      laissant leur bonne réponse sans ponctuation finale : sur ce lot, **choisir l'option à la fin
      unique donnait la bonne 15 fois sur 15**. Aucune des onze stratégies de `mesure-biais-qcm.js`
      ne regardait le **dernier** caractère — ni la longueur, ni la ponctuation interne.
      **C'est le troisième indice de suite que la CORRECTION fabrique** (après le mot d'attaque de
      `projets-js` et la parenthèse inversée de `zig`), et le premier qu'un seul relecteur ait vu.
      **LA RÈGLE GÉNÉRALE, à remettre en consigne au tour suivant : un fan-out d'écriture donne à
      chaque lot le TIC DE STYLE de son agent, et ce tic désigne l'intrus. Toute régularité
      typographique qui sépare les distracteurs d'un lot de leur bonne réponse est un indice.**

      ⚠️⚠️ **ET IL A FALLU CHANGER LA RÈGLE D'ADMISSION DU CLIQUET POUR LE VOIR.** Les cinq
      stratégies `EXPLOITABLES` de `verif-qcm-biais.js` y étaient entrées parce qu'elles dépassaient
      nettement le hasard **sur tout le site**. Celle-ci vaut **25,1 % sur les 6 167 questions —
      le hasard exactement**. Mesuré : **un indice fabriqué par un lot naît à 100 % sur le LOT, se
      dilue à 38,1 % sur le COURS, puis à 25,1 % sur le SITE.** La moyenne du site est donc le
      mauvais endroit pour décider d'une admission. Nouvelle règle écrite dans l'outil : *au-dessus
      du hasard sur le site, **OU** vue à 100 % sur un lot*. Vérifié avant l'ajout : cours le plus
      exposé `erlang` **27,8 %**, les 16 cours traités entre **24,7 % et 25,0 %** — personne ne
      rougit. Épreuve par injection : **8ᵉ cas ajouté, 8/8 vus**, contre-épreuve restée verte.
      ⚠️ **Le premier jet de la preuve par injection NE PROUVAIT RIEN** : il lançait l'outil depuis
      la racine du dépôt, donc `__dirname/..` pointait sur le VRAI dépôt et non sur la copie mutée
      — l'injection de 45 points n'a d'abord rien fait bouger, et c'est ce zéro suspect qui l'a
      trahi. L'outil est désormais copié dans le bac à sable. *Même famille que « une soustraction
      n'est pas une mesure ».*

      ⚠️⚠️ **CE QUE CET AJOUT NE RÈGLE PAS, et c'est le manque le plus net laissé par ce point :
      le cliquet mesure PAR COURS quand l'écriture se fait PAR LOT DE LEÇONS.** Le défaut de `react`
      plafonnait à **38,1 %** au niveau du cours, sous la cible de 60 % : **même inscrite dans
      `EXPLOITABLES`, la stratégie ne l'aurait pas fait rougir.** Seule une mesure par **fenêtre de
      leçons** (5 leçons glissantes) le verrait. À décider en F3 ou hors chantier — c'est une
      modification de la structure de `qcm-biais-reference.json`, qui est indexée par cours.

      **Défauts de FOND corrigés** (6 relecteurs adversariaux, lots disjoints, un seul écrivain par
      fichier, aucun commit d'agent) — ~80 distracteurs repris en 2ᵉ passe. Devenus **littéralement
      vrais** : une ref partagée que l'enfant mute (`l-03`), la perte d'état par réordonnancement
      (`l-04`), un effet sans tableau qui rejoue à chaque rendu (`l-09`), la restauration d'un champ
      contrôlé sans `onChange` (`l-08`), `useSearchParams` qui rend bien un tuple (`l-15`), **Pug**
      qui mêle bien balisage et JS (bilan), **useSignal** qui existe bien en Preact/Qwik (bilan),
      une SPA dont le HTML initial n'offre aucun lien à explorer (`l-20`), « aucun style ne peut
      animer un composant démonté » (`l-25`), « la liaison avec l'étiquette reste à écrire à la
      main » — `useId` ne relie rien (`l-24`).

      ⚠️ **TROIS BONNES RÉPONSES SIGNALÉES, NON PROUVABLES HORS LIGNE, LAISSÉES EN L'ÉTAT** :
      - `lecon-02` q1 — « le JSX se transforme en `React.createElement` », alors que la
        transformation automatique de React 17+ rend `_jsx()`. **Prise RÉFUTÉE comme faute** : le
        corps de la leçon le dit **déjà**, et le dit **sous une marque de fraîcheur** posée en E2.
        *La convention de datation a fait exactement le travail pour lequel elle a été écrite.*
      - `lecon-10` q3 — « (avertissement / bug) » sur un `setState` après démontage : cet
        avertissement a été **retiré de React en 18**. Le fond de l'option reste juste.
      - `lecon-17` q1 — « ne capte pas les erreurs du rendu serveur » : le SSR **en streaming** de
        React 18 fait bien intervenir les frontières d'erreur.

      **Aucun React n'est installable dans ce dépôt 100 % `file://`** : ces trois-là demandent une
      exécution, pas une opinion, et la règle absolue du chantier interdit de trancher de tête.
      **Portées en C1/C3**, où la fraîcheur des cours périssables est le sujet.

      ⚠️ **`doc/lecon-03` s'est repérimée une 7ᵉ fois** en corrigeant `react` — elle **publie** le
      taux de manquement du site : 4 332 → **4 266** manquements, 71,0 % → **69,9 %**.
      **9 occurrences relues une par une** (5 du nombre, 4 du taux) : aucune ne parlait d'autre
      chose, sans quoi le remplacement global aurait cassé ce qui était juste.
      `verif-normatif` **58/60 → 60/60**.

      ✅ **RÉPONSE À LA QUESTION QUE B3 AVAIT LAISSÉE OUVERTE** (« la plus détaillée : un biais, ou
      la définition même d'une bonne réponse ? ») : **c'est un biais, et le protocole de B4 le
      ferme.** Les 6 cours de B3 sont en moyenne à **43,7 %** dessus (33,0 à 51,9), les 10 cours de
      B4 à **28,2 %** (20,7 à 33,2). La différence tient à la fourchette 70–130 % appliquée dès
      l'écriture, pas à la relecture.

      **Contrôles** : `mesure-qcm-intouchable` **0 atteinte** sur 86 questions ; index `quiz` et
      `search` régénérés **et prouvés porteurs des textes neufs** (un distracteur pris au hasard est
      dans le nouvel index et absent de celui de HEAD) ; `verif-normatif` **60/60** ;
      `verif.js --rapide` **26 étapes tout vert (85,1 s)** ; `verif-html` **0** ; `verif-donnees`
      **0 erreur** ; `verif-qcm-biais-mutations` **8/8**, témoin `stats` à 99,3 % toujours valide ;
      **0 URL de CDN interdit** introduite.

      **CE QUI RESTE À FAIRE SUR B4, mesuré après `react`** : `ruby` (84 q, 89,9 %), `sql` (82,
      91,9 %), `git` (80, 93,8 %), `rust` (76, 96,1 %), `java` (77, 94,2 %), `csharp` (77, 93,5 %),
      `cpp` (77, 92,9 %), puis la longue traîne. ⚠️ **`stats` (72 q, 99,3 %) reste le cours-témoin
      de `verif-qcm-biais-mutations` : changer le témoin AVANT de le traiter.**
      **69 cours sur 90 restent au-dessus de 60 %**, et **4 319 questions sur 6 167 restent
      devinables à la longueur**. La case reste **décochée** : seize cours sur les quarante que la
      cible de B1 demande.

      ---

      **`ruby` — FAIT le 2026-09-05. LE COURS EST CLOS : 89,9 % → 25,3 %.** 22 leçons,
      **84 questions**, **252 distracteurs**, **249 réécrits**, tous entre **0,71 et 1,30**.
      **C'est le meilleur résultat des dix-sept cours détordus** : aucune stratégie ne dépasse
      **28,0 %**, et la désignation unique de la bonne réponse tombe à **0,0 % ou 1,2 %** partout.

      | stratégie, sur les 84 questions | avant | après |
      |---|---:|---:|
      | la plus longue | **89,9 %** | **25,3 %** |
      | le mot technique exclusif | 74,5 % | **24,3 %** |
      | la plus détaillée | 66,3 % | **25,9 %** |
      | l'incise entre parenthèses | 63,3 % | **28,0 %** (SEULE bonne réponse 50,0 % → **1,2 %**) |
      | l'écho de la question | 59,2 % | **24,1 %** |
      | le point-virgule | 55,4 % | **26,2 %** (SEULE bonne réponse 40,5 % → **1,2 %**) |
      | **MEILLEURE STRATÉGIE** | **89,9 %** | **28,0 %** |
      | rangs de longueur | **76/4/4/0** | **22/22/20/20** |
      | fourchette distracteur / bonne réponse | 0,04–5,00 (227 hors) | **0,71–1,30 (0 hors)** |

      Site « la plus longue » : **69,9 % → 69,0 %**. **17 cours marqués `traite`.**

      ⚠️⚠️ **DEUX INDICES DE PLUS FABRIQUÉS PAR LA VAGUE D'ÉCRITURE — le 13ᵉ et le 14ᵉ — et
      chacun n'a été vu que par UN relecteur sur six.** Les deux ont été **remesurés par moi avant
      d'être crus** : les taux annoncés par les agents (59,0 % et 58,3 %) n'étaient pas ceux de la
      convention du chantier, et l'écart n'était pas anodin — l'un des deux était en réalité plus
      grave que dit, l'autre moins.

      1. **LA CASSE INITIALE.** La bonne réponse commence par un jeton de code en minuscule
         (`sort renvoie…`, `super nu…`, `rescue => e capture…`) quand les distracteurs, rédigés
         comme des phrases françaises, prennent une majuscule. **LA CAUSE EST DANS L'OUTIL, à la
         ligne** : `motAttaque()` de `mesure-biais-qcm.js` fait un `.toLowerCase()` **avant** toute
         comparaison — « l'attaque unique » compare les *mots* et jamais leur *casse*.
         Lot 01-04 **39,6 %** ; cours **25,9 % → 30,4 %** : *la vague d'écriture l'a aggravé*.
         Après correction : cours **23,8 %**, désignation unique **8,3 % → 0,0 %**.
      2. **LA GLOSE FINALE entre parenthèses**, tic de l'agent des leçons 05-08 : ses distracteurs
         finissent par « (qui poursuit) », « (une paire par élément) », que la bonne réponse ne
         porte pas. Lot 05-08 **56,9 %**, désignant la **SEULE** bonne réponse dans **41,7 %** des
         questions du lot. Cours **20,4 % → 28,6 %** : l'indice était **inversé** avant la passe,
         elle l'a *retourné*. Après correction : **25,6 %**, désignation unique **0,0 %**.

      Les deux sont ajoutées à `tools/mesure-biais-qcm.js`. Sur les 6 167 questions du site elles
      valent **25,1 %** et **21,2 %** — le hasard : elles n'entrent donc **pas** dans `EXPLOITABLES`
      du cliquet, dont la règle d'admission reste celle écrite pour `react`.

      ✅ **`--lots` : LA MESURE PAR FENÊTRE DE LEÇONS, que `react` avait laissée ouverte, est
      faite.** `node tools/mesure-biais-qcm.js --lots[=N] [--cours=X]` balaie chaque cours par
      fenêtres glissantes et signale toute fenêtre au-dessus de 60 %, ou qui désigne la seule bonne
      réponse plus de 40 % du temps. **Épreuve dans un bac à sable** monté sur l'état d'*avant*
      correction, l'outil y étant **copié** pour que `__dirname/..` ne pointe pas sur le vrai dépôt
      (le piège qui avait vidé de sens la première preuve de `react`) :

      | fenêtre | ce que l'outil voit sur `ruby` avant correction |
      |---|---|
      | `--lots=5` | **aucune alerte — AVEUGLE** |
      | `--lots=4` | `ruby 5-8` · glose finale **56,9 %** · seule bonne **41,7 %** |
      | `--lots=3` | `5-7` **62,0 %** · `6-8` **59,3 %** · `4-6` **58,3 %** |

      ⚠️ **LA LEÇON, et elle est mécanique : une fenêtre plus large que le lot d'écriture dilue le
      tic jusqu'à le faire disparaître.** Le défaut est donc ramené à **4**, la taille des lots de
      ce chantier ; en dessous de 3 leçons, c'est le bruit du hasard qui déclenche (une fenêtre de
      moins de 8 questions n'est pas mesurable). Par défaut le mode ne regarde que les cours marqués
      `traite` — un cours non corrigé est au-dessus du seuil dans *toutes* ses fenêtres, et les
      afficher noierait le signal : **4 038 alertes sur 90 cours, contre 375 fenêtres sur les 16
      cours traités.** Sur ces derniers, il sort ce que la mesure par cours cachait : **`mobile`
      8-11 à 71,9 %**, **`react` 01-04 à 66,7 %**, **`zig` 4-7 à 65,3 %**, **`iac` 2-6 à 61,7 %**.
      **`ruby` ne déclenche à aucune fenêtre, ni à 3, ni à 4, ni à 5 leçons.**

      ⚠️⚠️ **LE DÉFAUT FONDATEUR RETROUVÉ DANS UN `<svg>`.** Le diagramme de `gsub` de `lecon-18`
      montre le bloc `{ |n| n*2 }` et annonce la sortie `"prix : 20, 40, 60"`. Le paramètre du bloc
      de `gsub` est une **String** : `"10" * 2` vaut `"1010"`. Le bloc de code de la **même leçon,
      trois lignes plus haut**, écrit `{ |n| (n.to_i * 2).to_s }` — l'auteur du code savait, celui
      du diagramme a perdu le `to_i`. **Aucun outil qui extrait les `<pre><code>` ne peut voir cette
      faute** : elle vit dans un `<text>` de `<svg>`. C'est la troisième fois que le défaut fondateur
      se déplace vers un endroit que la chaîne ne regarde pas (après les `<script>` des QCM et les
      corps de leçon), et c'est le manque le plus net que ce point laisse derrière lui.

      **Les dix autres corrections de fond**, toutes prouvées par contradiction interne :
      un **VERT inatteignable** (le test du cycle 1 TDD de `lecon-14` ne chargeait jamais
      `lib/fizzbuzz.rb`, alors que le premier exemple de la même leçon écrit bien son
      `require_relative`) ; une sortie de `errors.full_messages` (`lecon-17`) qui **oublie l'erreur
      que le modèle de la ligne du dessus produit** ; un exercice de `lecon-05` qui comptait **JUSTE
      `Hash.new`**, que sa propre leçon déclare fautif (« il essaierait de calculer `nil + 1` ») ;
      « `ArgumentError`, ce n'est ni `TypeError` ni `StandardError` » (`lecon-13`), **auto-réfuté par
      le `rescue => e` du bloc qu'il commente** ; « Ruby lèvera une `SyntaxError` » sur `elseif`
      (`lecon-03`), qui n'est pas un mot-clé — Ruby lit la ligne comme un appel de méthode, et le
      comportement réel est **pire** que l'erreur annoncée puisqu'il peut être silencieux ; un
      échappement `\u` **mangé à l'écriture** qui rendait une phrase sur JSON auto-contradictoire
      (`lecon-22` : les trois `<code>` contenaient la même chaîne) ; « le test booléen `in` ne lie
      rien » (`lecon-20`), faux — c'est le motif choisi qui ne nomme aucune variable ; un `each`
      annoté `# =>` comme s'il renvoyait ses éléments (`lecon-06`), la confusion même que teste la
      q1 de `lecon-08` ; et deux doublons qui ramenaient une question à deux choix (`lecon-12` q2,
      `lecon-22` bilan q7 où « guillemets simples » et « apostrophes » sont le même caractère).

      **Deux exceptions déclarées à l'intouchable**, et `mesure-qcm-intouchable` ne voit que
      celles-là : `lecon-12` q2 (la bonne réponse rangeait **`SystemExit` parmi les signaux système**
      alors qu'elle est levée par `exit` — et c'est le **seul endroit du site** où l'élève rencontre
      cette classe) et `lecon-22` bilan q7 (l'explication affirmait que **seuls** les guillemets
      doubles interpolent, quand `lecon-18` montre un heredoc qui interpole).

      ⚠️ **RUBY N'EST PAS INSTALLÉ SUR CETTE MACHINE** (`ruby -v` → *command not found*). Aucune
      exécution n'a été possible : chaque prise est classée **PROUVÉE ICI** (par le corps de la
      leçon, une leçon voisine, ou une contradiction interne montrée) ou **NON PROUVABLE HORS
      LIGNE**. Les six relecteurs ont rendu une trentaine d'affirmations du second type, chacune
      accompagnée de la commande qui trancherait. **Aucune bonne réponse fausse n'a été trouvée
      dans les 84 questions** — c'est le premier cours du chantier dans ce cas, et il faut le lire
      avec la réserve qui précède.

      ⚠️ **`doc/lecon-03` s'est repérimée une 8ᵉ fois** : elle **publie** le taux de manquement du
      site, 4 266 → **4 212** manquements, 69,9 % → **69,0 %**. **9 occurrences relues une par une**
      (5 du nombre, 4 du taux) : toutes parlaient bien du même manquement à S3, dont une dans un
      `explain` de QCM — d'où la seconde passe de `build-index`. `verif-normatif` **58/60 → 60/60**.

      **Contrôles** : `mesure-qcm-intouchable` **2 atteintes, les 2 déclarées** ; index `quiz` et
      `search` régénérés **et prouvés porteurs des textes neufs** (un distracteur neuf est dans le
      nouvel index et absent de celui de HEAD) ; `verif.js --rapide` **26 étapes tout vert (86,4 s)** ;
      `verif-html` **0** ; `verif-donnees` **0 erreur** ; `verif-qcm-biais-mutations` **8/8**, témoin
      `stats` à 99,3 % toujours valide ; **0 URL de CDN introduite** (les 5 du dépôt sont dans deux
      leçons `html`, identiques à HEAD).

      **CE QUI N'A PAS ÉTÉ FAIT, et c'est volontaire** : les six rapports de contradiction
      (`scratchpad/b4rby/ctr1.md` à `ctr6.md`, ~150 Ko) portent une **quarantaine de prises
      mineures** non traitées — distracteurs « défendables à moitié », motifs d'élimination faibles
      (« l'option qui dit que c'est pareil », **28,6 % sur le cours contre 26,3 % sur le site** :
      c'est **structurel au site**, pas propre à `ruby`), incohérences de vocabulaire entre leçons
      (`lecon-05` dit « hachage », `lecon-07` dit « hash » ; deux formats de `Hash#inspect`
      incompatibles entre Ruby 3.4 et ≤ 3.3), 8 étiquettes « Revoir « … » » qui pointent vers des
      sections inexistantes, et `lecon-22` seule des 22 à avoir 5 blocs `.exercise` pour 4 entrées
      `data-exos`. **Ces trois derniers points ne relèvent pas de B4 mais d'un vérificateur qui
      n'existe pas** : rien ne contrôle qu'une étiquette de révision désigne un titre réel, ni que
      les compteurs d'exercices concordent. À porter en phase F.

      **CE QUI RESTE À FAIRE SUR B4, mesuré après `ruby`** : `sql` (82 q, 91,9 %), `git` (80,
      93,8 %), `rust` (76, 96,1 %), `java` (77, 94,2 %), `csharp` (77, 93,5 %), `cpp` (77, 92,9 %),
      `php` (78, 88,9 %), puis la longue traîne. ⚠️ **`stats` (72 q, 99,3 %) reste le cours-témoin
      de `verif-qcm-biais-mutations` : changer le témoin AVANT de le traiter.**
      **69 cours sur 90 restent au-dessus de 60 %**, et **4 257 questions sur 6 167 restent
      devinables à la longueur**. La case reste **décochée** : dix-sept cours sur les quarante que
      la cible de B1 demande.

      ---

      **`sql` — FAIT le 2026-09-06. LE COURS EST CLOS : 91,9 % → 19,5 %.** 24 leçons, **82
      questions**, **246 distracteurs**, **238 réécrits**, tous entre **0,73 et 1,30**. Un réveil
      interrompu avait laissé la vague d'écriture posée mais **non contredite** : ce passage l'a
      relue, mesurée et corrigée.

      | mesure, sur les 82 questions | avant | après |
      |---|---:|---:|
      | la bonne réponse est la plus LONGUE | 91,9 % | **19,5 %** |
      | questions **OFFERTES** par un motif d'élimination | **6** | **0** |
      | motif « les deux / c'est pareil » (distracteurs) | 30 | **9** |
      | motif « annonce une erreur ou un refus » | 22 | **9** |
      | motif « adverbe de prudence » | 9 | **1** |
      | motif « le moteur agit tout seul » | 5 | **1** |
      | l'incise entre parenthèses | 26,6 % | 29,2 % |

      Le compte des **questions offertes** est neuf, et il fonde le travail : une question est
      *offerte* quand les trois distracteurs portent un même motif et la bonne réponse non — on
      raye sans lire une ligne de SQL. `sql` en avait **6**, contre **0 à 1** sur les cinq cours
      déjà clos (`ruby` 1, `react` 0, `bdd` 1, `algo` 0, `python` 1). C'était donc une régression
      **fabriquée par la vague d'écriture**, pas un héritage. Outil : `scratchpad/b4sql/motifs.js`.

      ⚠️⚠️ **LA TROUVAILLE DU TOUR, ET ELLE VAUT POUR TOUS LES COURS DÉJÀ CLOS : ÉCRASER « LA PLUS
      LONGUE » DÉPLACE LE BIAIS D'UN RANG.** Une question à quatre options a **quatre rangs de
      longueur**. En ramenant le rang 0 sous le hasard, on pousse la bonne réponse sur le rang 1 —
      et *aucune* des quatorze stratégies de `mesure-biais-qcm.js` ne regardait ailleurs qu'aux
      extrêmes. Mesuré le 2026-09-06 sur les 22 cours déjà traités :

      | cours | « la plus longue » | le PIRE rang | il vaut |
      |---|---:|---|---:|
      | `doc` | **0,0 %** | la DEUXIÈME plus longue | **60,9 %** |
      | `archi` | 8,3 % | la TROISIÈME plus longue | **56,3 %** |
      | `neurones` | 15,4 % | rang 1 | 44,6 % |
      | `distribue` | 5,6 % | rang 1 | 42,0 % |
      | `offensive` | — | rang 3 | 40,6 % |
      | `iac` | 13,3 % | rang 1 | 40,0 % |
      | `sql` (ce jour) | 19,5 % | rang 1 | 30,5 % |
      | `ruby` | 25,3 % | rang 0 | **26,2 %** |

      **`doc`, le cours écrit APRÈS le constat de B1 — donc le plus soigné — est le PIRE** : il
      n'a jamais la bonne réponse la plus longue, et c'est exactement ce qui la rend devinable une
      fois sur deux au rang suivant. **Trois stratégies ajoutées à l'outil** (« la DEUXIÈME plus
      longue », « la TROISIÈME plus longue », « écarter les deux extrêmes »), avec une fonction
      `parRang()` qui rend **tous les ex æquo candidats** — sans quoi une égalité ferait rendre un
      choix arbitraire et la mesure vaudrait le hasard. **Épreuve que l'outil enrichi passe** : en
      `--cours`, la pire stratégie de `doc` est désormais nommée à **60,2 %** là où l'outil
      affichait **0,0 %** ; en `--lots=4`, la fenêtre `archi 7-10` ressort à **79,2 %**.
      **RÈGLE À REMETTRE EN CONSIGNE D'ÉCRITURE : viser 25 % sur CHAQUE RANG, jamais 0 % sur le
      premier.** C'est le **7ᵉ déplacement** mesuré de la phase B. ⚠️ **`doc` et `archi` sont à
      REPRENDRE** : ils sont comptés « faits » et sont en réalité plus devinables que `ruby`.

      ⚠️ **UN AUTRE OUTIL DU PROTOCOLE ÉTAIT CASSÉ** : `mesure-qcm-longueurs.js --tout` plantait à
      chaque appel (`ReferenceError: window is not defined` — `js/data.js` est un script de
      navigateur). Réparé. C'est la deuxième fois qu'un outil du protocole se révèle aveugle ou
      mort ; le premier l'était depuis cinq cours.

      **CONTRADICTION** : six relecteurs adversariaux, **92 prises**, **≈ 190 requêtes exécutées**
      sous le SQLite 3.49.1 que le site **embarque**. **Trois bonnes réponses fausses ou imprécises
      corrigées** : `lecon-07` q3 disait « NULL supérieur à 10 est **faux** » alors que c'est
      *inconnu* (mesuré : la négation rend NULL elle aussi) — **et `lecon-02` q2 fait justement
      REJETER un distracteur qui énonce cela** ; `lecon-08` q2 exigeait « **deux** alias » pour une
      auto-jointure alors qu'**un seul suffit** (mesuré : 4 lignes justes ; c'est ZÉRO alias qui
      échoue) ; `lecon-04` q3 nie que l'alias s'utilise dans le `WHERE` — vrai de PostgreSQL,
      **faux du moteur du bac à sable**, ce que l'explication dit désormais.

      **TROIS DÉFAUTS FONDATEURS dans des CORPS de leçon**, tous prouvés par exécution :
      `lecon-04` — `CAST(x AS DECIMAL)/3` annonce `1.333…` et **rend `1`** : *l'exemple censé
      guérir la division entière tombait dedans* (l'affinité NUMERIC garde l'entier ; `REAL` rend
      bien `1.3333333333333333`) ; `lecon-13` — le cadre de fenêtre par défaut est **RANGE**, pas
      ROWS : sur deux lignes ex æquo le cumul rend **320 sur les DEUX**, et c'est *la* leçon qui
      fait des ex æquo son sujet ; `lecon-15` — `OLD` dans un trigger `AFTER INSERT`
      (`no such column: OLD.titre`), le `CREATE TRIGGER` passant en silence par résolution
      paresseuse. Plus le **glossaire de `lecon-20`** qui définissait ROLLUP « de droite à gauche »
      quand le corps, l'exercice et `lecon-19` disent l'inverse — **et quand son propre QCM compte
      FAUX un distracteur pour l'avoir écrit** ; et `lecon-14` qui se présentait comme « cette
      **dernière** leçon » d'un cours qui en compte 24, avec cinq « pistes pour continuer » qui
      sont des leçons du même cours.

      ⚠️ **LES DEUX GARDE-FOUS ONT SERVI, ET L'UN A ÉVITÉ UNE FAUTE** : `mesure-qcm-intouchable`
      n'a laissé passer que les **5 atteintes VOLONTAIRES** du coordinateur (2 explications, 1 bonne
      réponse, 1 énoncé) sur 238 distracteurs réécrits par six agents ; et le refus « **cible
      unique** » a **bloqué** un remplacement de « de droite à gauche » qui aurait rendu **VRAI un
      distracteur volontairement faux**. *Le motif trop large a été arrêté par l'outil, pas par
      l'attention.*

      **CE QUE LA CONTRADICTION A RENDU ET QUI N'EST PAS TRAITÉ** — une soixantaine de prises
      mineures, dont deux qui relèvent d'un chantier à part : `sql/lecon-10` a **11 blocs sur 13
      qui échouent au clic** (la table de démonstration de `js/runner.js` déclare `email`, pas
      `points`), et `verif-sql.js` mesure déjà **124 blocs en erreur** à l'échelle du site, sous
      cliquet. **Ce n'est pas B4 : c'est un point de phase F à ouvrir.** Restent aussi `lecon-09`
      (l'exemple `INTERSECT` rend 2 lignes là où la légende en annonce 1, la précédence jouant de
      gauche à droite), `lecon-21` (`date('now')` donné comme l'équivalent SQLite de
      `CURRENT_DATE` : c'est de l'**UTC**, dans *la* leçon sur les fuseaux), `lecon-17` (un `<svg>`
      qui annonce que l'index « ne sert pas » quand SQLite comme PostgreSQL le lisent en COVERING
      INDEX) et `lecon-24` (la colonne `t2` du pivot, morte parce que le socle est borné au premier
      trimestre).

      **Une prise RÉFUTÉE par la mesure** : `lecon-11` q1 (« UNIQUE garantit l'unicité ») était
      donnée pour fausse au motif qu'une colonne `UNIQUE` accepte plusieurs `NULL`. Vérifié : c'est
      le comportement **standard** — `NULL` n'est égal à rien, pas même à lui-même — et cela
      n'infirme pas l'unicité des valeurs renseignées. Non appliquée, et le refus transmis aux
      correcteurs pour qu'ils ne la reprennent pas.

      **Contrôles** : `mesure-qcm-intouchable` **5 atteintes volontaires, 0 involontaire** ;
      `verif.js --rapide` **70,5 s**, les 2 signalements étant les chiffres de `doc` périmés par
      ce travail (**6ᵉ fois**) — `gen.js` relancé, `verif-normatif` **60/60**, `verif-doc`
      **36/36** ; `verif-html` **0** ; `verif-donnees` **0 erreur** (index régénérés `--fresh`, une
      entrée périmée purgée) ; `verif-sql` **au cliquet, 124** ; longueurs **hors bande 0** ; 0 BOM,
      0 caractère de contrôle, 0 doublon, JSON valide sur 82 questions.

      **CE QUI RESTE À FAIRE SUR B4, mesuré après `sql`** : `git` (80 q, **93,8 %**, 75 devinables),
      `rust` (76, 96,1 %), `php` (78, 93,6 %), `java` (77, 94,8 %), `csharp` (77, 93,5 %), `cpp`
      (77, 93,5 %), `ocaml` (75, 92,0 %), puis la longue traîne.
      ⚠️ **`stats` (72 q, 100,0 %) reste le cours-témoin de `verif-qcm-biais-mutations` : changer le
      témoin AVANT de le traiter.** ⚠️ **Et avant tout nouveau cours, REPRENDRE `doc` et `archi` au
      rang de longueur** — deux cours comptés « faits » et plus devinables que `ruby`.
      Global du site : **« la plus longue » à 68,0 %**. **68 cours sur 90 restent au-dessus de
      60 %.** La case reste **décochée** : **dix-huit cours** sur les quarante que la cible de B1
      demande.

      **PASSE DU 2026-09-06 — `archi` REPRIS AU RANG, ET LE CLIQUET RÉPARÉ DE DEUX DÉFAUTS.**
      La consigne laissée par la passe `sql` était : « avant tout nouveau cours, REPRENDRE `doc` et
      `archi` au rang de longueur ». Mesure reproduite d'abord : `doc` **60,2 %** (« la DEUXIÈME
      plus longue »), `archi` **55,2 %** (« la TROISIÈME »), contre `ruby` à 28,0 %. Les deux
      comptés « faits », les deux plus devinables que le dernier cours traité.

      **OUTIL NEUF — `tools/plan-rangs-qcm.js`.** Il n'écrit rien, il dit quoi écrire : pour chaque
      question il assigne un rang cible (répartition la plus plate que le nombre de questions
      permette), choisit **au coût le plus faible en caractères** quel distracteur doit passer de
      l'autre côté de la bonne réponse, et rend une fenêtre de longueur bornée par la consigne
      70-130 % de B3. Le plan de `doc` : 50 questions à retoucher, **2 058 caractères** ; celui de
      `archi` : 18 questions, **224 caractères**. Un mode `--ponctuation` a été ajouté en cours de
      passe, pour la raison dite plus bas.

      **`archi` — LE COURS EST REPRIS**, et c'est le seul résultat de contenu que cette passe garde.

      | | avant | après |
      |---|---:|---:|
      | rangs par longueur (0/1/2/3) | 4 / 14 / 27 / 3 | **12 / 12 / 12 / 12** |
      | « la plus longue » | 7,3 % | **24,0 %** |
      | bonne réponse SEULE la plus ponctuée | 14/48 (29,2 %) | **0/48 (0,0 %)** |
      | « la plus détaillée » | 43,8 % | **24,0 %** |
      | **pire stratégie exploitable** | **55,2 %** | **41,3 %** |

      36 distracteurs réécrits, **hors bande 70-130 % : 0**, `mesure-qcm-intouchable` **0 atteinte**
      (énoncés, `correct`, explications et bonnes réponses intacts contre git HEAD).

      ⚠️⚠️ **LE PIÈGE QUI A COÛTÉ LE TRAVAIL SUR `doc`, ET QUI VAUT POUR TOUTE LA CHAÎNE :
      `pages/doc/*.html` SONT DES FICHIERS ENGENDRÉS.** Quatre agents avaient réécrit **112
      distracteurs sur 192**, amenant `doc` à 16/16/16/16 sur les rangs, 0 hors bande, 0 sur la
      ponctuation et **28,5 % sur sa pire stratégie exploitable — le meilleur chiffre de toute la
      phase B**. Puis `node tools/doc/gen.js` a été lancé pour rafraîchir les chiffres mesurés de la
      leçon 3 : il **régénère les quatre pages depuis `tools/doc/corps/l*.html`**, où les QCM sont
      écrits en dur. Les 112 réécritures ont été effacées en une commande, sans sauvegarde, et le
      dépôt est revenu à `doc` = 0,0 % / 60,2 %. **Rien de tout cela n'était visible depuis la
      page** : ni en-tête « fichier engendré », ni contrôle. La leçon générale : *avant de corriger
      une page à la main, chercher si un générateur la produit* — et pour `doc`, la reprise devra
      se faire dans `tools/doc/corps/`. Le coût est réel (≈ 2 000 caractères de réécriture à
      refaire) et il est écrit ici plutôt qu'arrondi.

      **LE DÉFAUT FONDATEUR QUE CET INCIDENT A RÉVÉLÉ, lui, est réparé — et il était grave.**
      `doc/lecon-03` q6 demande l'écart entre les MUST et le SHOULD S3 du format que la leçon
      publie. Son explication affiche le **taux mesuré** par un marqueur (`@@NORMNB:s3PctEchec@@`,
      **68,1 %** ce jour) ; sa **bonne réponse**, elle, était **écrite à la main** : « la
      recommandation est ignorée dans près de **neuf** cas sur dix ». Les deux ont divergé en
      silence à mesure que B4 assainissait le site — et la question s'est retrouvée **sans aucune
      option vraie** (les trois autres disent « plus de 95 % », « une dizaine », « pas mesurable »).
      C'est le défaut fondateur de la chaîne, dans une bonne réponse de QCM, dans le cours qui
      enseigne la documentation. Corrigé **à la racine** : le texte est désormais engendré
      (`@@NORMNB:s3EnMots@@` → « sept »), et `verif-normatif.js` porte un contrôle qui compare le
      mot publié à la mesure du jour — **éprouvé par injection : remis à « neuf », il échoue
      (code 1) ; restauré, il repasse vert.** Deuxième trou fermé au passage : la liste du contrôle
      strict « respecte la règle S3 qu'il publie » ne contenait que `lecon-01`, `02` et `03` —
      **`lecon-04`, qui porte le QCM BILAN du cours, en était absente**. Les quatre leçons sont à
      zéro manquement, la liste s'étend sans rien faire rougir. `verif-normatif` **60/60 → 62/62**.

      ⚠️ **LE CLIQUET AVAIT DEUX DÉFAUTS, et le premier est le plus grave qu'il ait eu.**
      `mesure-biais-qcm.js` sait depuis le 2026-09-05 que corriger « la plus longue » **déplace** le
      biais d'un rang ; `verif-qcm-biais.js` ne l'avait jamais appris. Ses `EXPLOITABLES`
      ignoraient les trois stratégies de rang, si bien que `doc` — 0,0 % sur la longueur, **le
      meilleur chiffre du site** — se laissait deviner **60,2 %** du temps sans qu'une seule ligne
      rouge le dise. Vérifié avant de les inscrire, comme pour les deux ajouts précédents : les
      cours marqués `traite` sont entre **25,3 %** (`ruby`) et **36,3 %** (`iac`) sur la pire des
      trois, et le plus exposé du site entier est `neurones` à **42,6 %** — les ajouter ne fait
      rougir personne.
      **Second défaut, découvert en étant sa propre victime** : le critère de régression lisait le
      **taux brut**. Ramener `doc` de 0,0 % à 25,0 % — c'est-à-dire *à la cible* — était compté
      pour **+25 points de régression**. Un critère qui punit la correction qu'il réclame ne peut
      pas être suivi longtemps. La régression se juge désormais sur l'**écart au hasard**
      `|taux − 25 %|`, et la cible « ≤ 40 % » se lit comme une **bande [10 %, 40 %]**. Troisième
      correction, plus discrète : la référence figeait la meilleure de **toutes** les stratégies
      mesurées quand le verdict lisait la pire **exploitable** — deux quantités différentes, donc
      une comparaison qui ne voulait rien dire.

      ⚠️ **LE PLANCHER, imposé par la CONTRE-ÉPREUVE et non par le raisonnement.** Une fois `doc`
      à 25,0 % pile, son écart au hasard valait **zéro** — et un cours à zéro d'écart ne peut plus
      que remonter : ajouter six questions **parfaitement équilibrées** le portait à 22,9 %, soit
      2,1 points, au-dessus de la tolérance d'un point. **Le cliquet rougissait sur du travail
      irréprochable.** C'est le défaut inverse de celui qu'on redoute et il est aussi grave. Un
      plancher de **5 points** applique la règle que B1 avait déjà retenue pour *écarter* trois
      stratégies (26,3 % à 30,2 % = « au niveau du hasard »).

      ⚠️⚠️ **DEUX FIXTURES D'INJECTION SUR HUIT NE PROUVAIENT PAS CE QU'ELLES ANNONÇAIENT.** C'est
      la trouvaille méthodologique de la passe. Le cas « 60 questions devinables **à la seule
      parenthèse** » présentait quatre options de **89, 89, 90 et 93** caractères — la bonne étant
      **la plus longue**, parce que l'incise `(avant l ecriture)` qu'on lui ajoutait l'allongeait.
      Le verdict nommait donc « la plus longue » à 61,3 %, branche déjà couverte par un autre cas :
      **la branche « parenthèse » restait sans preuve, exactement le trou que ce cas était censé
      fermer.** Même défaut sur « la seule ponctuation finale » : 78/78/83/81, la bonne étant la
      **deuxième** plus longue, et le verdict tombait sur « écarter les deux extrêmes » à 63,1 %.
      Ce second défaut est resté invisible tant que les stratégies de rang n'étaient pas dans
      `EXPLOITABLES` : **aucun outil ne pouvait dire que la fixture était devinable à sa taille.**
      Les options sont désormais égalisées à 93 et 83 caractères. Et le premier cas, « 6 questions
      devinables ajoutées à `doc` (0,0 % au départ) », **injectait un biais imaginaire** : sur un
      cours à 0,0 %, rendre la bonne réponse la plus longue *rapproche* du hasard, et le cliquet
      répondait « progrès » à juste titre. Il injecte désormais **au rang 1**, biais réel de `doc`
      (39 de ses 64 questions y sont). **8 cas sur 8 vus, contre-épreuve verte** — et le harnais
      recopie maintenant le verdict rendu sur un cas raté, sans quoi il faut rejouer l'injection à
      la main pour comprendre.

      **CONTRADICTION** : trois relecteurs adversariaux, **~30 prises**, exécutions sous Node
      v24.16.0. Les trois plus sérieuses portent sur `doc` et **sont à reprendre dans
      `tools/doc/corps/` en même temps que les distracteurs perdus** : `lecon-02` b1 q8 opt2
      (« une SyntaxError est levée au chargement du fichier, avant tout appel ») est **vraie dans
      un module ES** — mesuré : `SyntaxError: Identifier 'aire' has already been declared` en ESM,
      `NaN` sans erreur en CommonJS ; `lecon-02` bilan q3 opt2 (« peut laisser les données à moitié
      écrites ») est **la moitié de la définition de « atomic » que la leçon publie elle-même** ;
      `lecon-01` bilan q6 opt2 (« `deprecated` n'a aucune conséquence pratique immédiate ») est
      **endossé mot pour mot par son propre `explain`**. Sur `archi`, **aucun distracteur réécrit
      n'est devenu vrai** ; quatre ont gagné une ambiguïté (bilan q10, q6, q5, q3), toutes signalées
      avec une reformulation à longueur et ponctuation conservées. Un relecteur a aussi trouvé un
      **schéma de rédaction risqué** que la vague a produit six fois : *greffer une subordonnée
      VRAIE sur une affirmation fausse* — l'option reste fausse, mais elle gagne un appui factuel
      gratuit. **À mettre en consigne d'écriture.**

      ⚠️ **UN INDICE DE PLUS, MESURÉ ET NON TRAITÉ : le TIRET CADRATIN.** Sur les 32 questions de
      `doc/lecon-03` et `04`, 5 ont exactement une option portant `—` : **c'est la bonne 5 fois sur
      5**, et **0 distracteur sur 96** n'en porte. Sur le cours entier, 7 sur 8 (**87,5 %**). La
      stratégie « la seule avec un tiret » de l'outil ne le voit pas (elle mesure 32,8 % sur `doc`)
      — à instruire : cherche-t-elle le bon caractère ? C'est le même motif que « le point final »
      de `react` et « le mot d'attaque » de `projets-js`. Second indice mesuré : **la négation**
      (une seule option porte `ne`/`n'`/`pas`) désigne la bonne réponse **9 fois sur 13 (69,2 %)**
      sur ce périmètre.

      **Contrôles** : `verif.js --rapide` **50,8 s, 50 étapes, tout vert** ; `verif-html` **0** ;
      `verif-donnees` **0 erreur** (2 avertissements antérieurs : un doublon `zig` et `doc` sans
      encadré d'erreur) ; `verif-normatif` **62/62** ; `verif-doc` **36/36** ;
      `verif-qcm-biais-mutations` **8/8** ; `verif-chaine-declaree` **OK** ; `quiz-index.js`
      régénéré `--fresh` ; JSON valide, 0 BOM.
      **Référence refigée honnêtement** : `archi` verrouillé à 24,0 % / 41,3 %, marqué `traite` ;
      **`doc` remis à ses vrais chiffres (0,0 % / 60,2 %) et `traite: false`** — la référence
      enregistrait, avant cette passe, un `pire` de 40,0 % qui masquait 60,2 % faute des stratégies
      de rang. **17 cours marqués `traite`.** Global du site : **« la plus longue » à 68,2 %**.
      La case reste **décochée**.

      **CE QUI RESTE, dans l'ordre** : (1) **`doc` à refaire dans `tools/doc/corps/l*.html`** — le
      plan chiffré est reproductible par `node tools/plan-rangs-qcm.js doc`, et les trois prises
      adversariales ci-dessus sont à traiter dans le même mouvement ; (2) `git` (80 q, 93,8 %),
      `rust` (76, 96,1 %), `php` (78, 93,6 %), `java` (77, 94,8 %), `csharp`, `cpp`, `ocaml` ;
      (3) le tiret cadratin à instruire. ⚠️ **`stats` (99,3 %) reste le cours-témoin de
      `verif-qcm-biais-mutations` : changer le témoin AVANT de le traiter.**



      ---

      **PASSE DU 2026-09-06 — `doc` CLOS (18ᵉ cours), et la mesure elle-même corrigée.**
      Reprise de `tools/doc/corps/l*.html` (le cours est ENGENDRÉ par `tools/doc/gen.js`,
      jamais écrit à la main dans `pages/`). Résultat mesuré : rangs de longueur
      **0/39/14/11 → 16/16/16/16** ; « la plus longue » **0,0 % → 25,0 %** ; pire indice
      exploitable **60,2 % → 36,1 %** (« la plus détaillée »). **147 distracteurs réécrits**
      (100 par quatre agents d'écriture pour les longueurs, 15 pour la négation, le reste à
      la main), aucune bonne réponse écrasée.

      ⚠️⚠️ **LA TROUVAILLE DE LA PASSE, ET ELLE VAUT POUR TOUT LE CHANTIER B : la colonne
      « réussite » NOIE les indices rares.** `mesure-biais-qcm.js` rendait « la seule avec un
      tiret » à **26,9 %**, tout près de l'étalon du hasard — B1 l'avait donc écartée. Elle ne
      tranche que sur **3,0 %** des questions, mais **elle a raison 84,2 % du temps quand elle
      tranche**. Sur tout le site : **155 questions n'ont qu'une seule option portant un tiret
      cadratin, et c'est la bonne 142 fois — 91,6 %**. L'information était calculable depuis
      toujours (`sans ex aequo ÷ (1 − ex aequo)`) et n'était **jamais affichée**. Une colonne
      **COUVERTURE** et une colonne **RENDEMENT** ont été ajoutées, et elles retournent le
      verdict de B1 sur trois stratégies classées « au niveau du hasard » : « la MAJUSCULE
      d'emphase » **28,4 % de réussite → 64,2 % de rendement**, « la plus prudente » 29,2 % →
      **57,6 %**, « la seule avec un tiret » 26,9 % → **84,2 %**. Et les deux pires du site sont
      « l'incise entre parenthèses » (**89,7 %**) et « la plus détaillée » (**83,4 %**). C'est la
      leçon de `react` — un indice de LOT vaut 100 % sur le lot et 25 % sur le site — transposée
      à la FORME de la mesure : **la moyenne est le mauvais endroit pour juger un indice rare.**

      ⚠️ **UN TROISIÈME OUTIL DU PROTOCOLE CHERCHAIT CE QU'IL NE POUVAIT PAS TROUVER.** La
      fonction `aTiret()` testait le motif « c'est-a-dire » **sans accent**. Mesure : **0 option
      sur 6 167 questions** porte « c'est-a-dire », **24** portent « c'est-à-dire ». Deux
      alternatives sur cinq étaient mortes depuis l'écriture de l'outil. Même famille que
      `motAttaque` sur `ruby` (minuscules avant de comparer la casse) et que
      `mesure-qcm-longueurs` aveugle à 184 questions sur `maths`. **Et le piège s'est reproduit
      dans la même passe** : la stratégie neuve « la seule qui nie », écrite le même jour, a
      d'abord rendu **0,0 % de couverture** parce que les bornes de mot de sa regex avaient été
      mangées par le shell — la sortie disait « 25,0 %, ne tranche jamais », ce qui aurait passé
      pour « pas d'indice ». **Une couverture nulle doit être lue comme une PANNE, pas comme un
      résultat.**

      **DEUX INDICES DE PLUS, MESURÉS ET FERMÉS.** (1) Le **tiret cadratin**, signalé non traité
      par la passe précédente : 8 questions de `doc` n'avaient qu'une option en portant, **c'était
      la bonne 7 fois (87,5 %)**. Le tiret a été DÉPLACÉ (retiré de 5 bonnes réponses, ajouté à
      5 distracteurs, à longueur strictement constante — « — », « : » et « ; » valent un
      caractère) → **25,0 % pile**. (2) La **NÉGATION**, qu'aucune des 17 stratégies ne mesurait :
      rendement **66,7 % sur `doc`** contre 41,6 % sur le site et 9 à 29 % sur les cours déjà
      clos. Une 18ᵉ stratégie a été ajoutée à l'outil, puis 15 distracteurs réécrits →
      **25,0 %**. ⚠️ L'agent a *reculé* de 17 corrections à 15 après avoir mesuré 10,0 % :
      **retourner un indice n'est pas le supprimer**, c'est le rendre exploitable à l'envers.

      ⚠️⚠️ **LE CORRECTIF A CASSÉ CE QU'IL DEVAIT PROTÉGER, ET LA CONTRADICTION L'A VU.**
      Fermer la longueur a fait remonter « la plus détaillée » de **37,1 % à 41,1 %** — hors
      bande — parce que remplacer « : » par « — » dans un distracteur lui retire un signe compté
      par cette stratégie. Six distracteurs ont dû être re-rééquilibrés à rang et fenêtre
      constants → **36,5 %**. C'est le motif de remplacement trop large, en version subtile : la
      correction d'un indice EN NOURRIT UN AUTRE, et seul le rejeu complet du scénario le montre.

      ⚠️⚠️⚠️ **LE CŒUR DE LA PASSE : LE COURS PUBLIAIT UNE NORME QUI FABRIQUAIT LE BIAIS.**
      `doc` publie un faux document normatif (`tools/doc/reference/quiz-format.txt`) dont la
      clause **S3** disait « *The correct option SHOULD NOT be strictly the longest of the four* »,
      et un vérificateur exigeait du cours qu'il la tienne **à zéro manquement**. C'est
      exactement ce qui l'avait rendu devinable : **0,0 % au rang 0 et 60,9 % au rang 1** (39 de
      ses 64 questions). La section 7 a été **révisée, datée, et l'ancienne rédaction citée comme
      retirée** — la forme d'un vrai errata, dans le cours qui enseigne à lire une norme. La
      clause devient la **bande 70-130 %**, plus une clause **S4 de POPULATION** (« sur un cours
      entier, la bonne réponse tombe à chaque rang environ une fois sur quatre »), **la seule du
      document qui ne se vérifie pas sur un bloc isolé, et elle est écrite quand même**.
      Manquements mesurés hors `doc` : ancienne **68,1 %**, nouvelle **60,3 %** — le contraste
      MUST/SHOULD que la leçon enseigne tient. S4 : **18 cours conformes sur 89, 20,2 %**.

      **CE QUE LA CONTRADICTION A RENDU** (3 relecteurs adversariaux, ~35 prises, exécutions sous
      Node v24.16.0). Six défauts graves, tous corrigés :
      1. **`tools/doc/verif-recherche.js` était passé AU ROUGE** (1 échec, il est dans `verif.js`
         étape `doc-rec`) : il testait encore l'ancienne S3. Réécrit — il teste désormais la
         **bande par question** ET le **rang sur le cours entier**. **76 contrôles, 0 échec.**
      2. **Le programme EXÉCUTABLE publié dans la leçon** (`tools/doc/code/normatif-conformite.js`)
         implémentait encore la clause retirée, sous la même étiquette `S3`, **400 lignes après
         que la page publie l'autre**. C'est le défaut fondateur de la chaîne — un corps de leçon
         qui annonce ce que son code ne fait pas — dans le cours qui enseigne à lire une norme.
      3. **La note de révision citait 60,2 %, qui n'est pas la grandeur qu'elle nommait** : 60,2 %
         est le SCORE d'une stratégie (crédit fractionné aux ex æquo), la fréquence est **60,9 %**
         (39/64). Recalculé et corrigé. Idem pour l'attribution causale : la note disait que la
         clause « CRÉAIT » le biais ; mesuré sur les **1 835 questions d'autres cours** qui la
         respectaient déjà, le rang 1 vaut **38,4 %**, pas 60 — la règle explique **13 des 36
         points d'écart**, le reste est une habitude de rédaction. La note dit maintenant cela.
      4. **La bande seule ne remplace pas l'ancienne clause** : **572 questions du site** la
         respectent et ont pourtant la bonne réponse la plus longue **à 100 %**. D'où S4.
      5. **La bande était INSATISFAISABLE sous 20 caractères** : à 3 caractères elle n'admet
         qu'une seule longueur entière, donc quatre options identiques — les quatre types
         TypeScript `any` / `unknown` / `object` / `never` demanderaient d'en inventer trois de
         trois lettres. L'exemption (**415 questions, 6,7 %**) est écrite dans la clause, dans la
         spec **et** dans `plan-rangs-qcm.js`, qui réclamait jusque-là une réécriture impossible.
      6. **`&nbsp;` lu LITTÉRALEMENT par l'apprenant.** Un bloc `<script type="application/json">`
         est du *raw text* : le navigateur n'y décode aucune entité, puis `js/lecon.js` échappe le
         `&`. La fonction `milliers()` de `gen.js` insérait l'entité → **5 champs de QCM**
         affichaient « 6&nbsp;103 ». Remplacée par le caractère U+00A0, qui traverse les deux
         chemins. Les **8 occurrences restantes du site sont VOLONTAIRES** (`html/lecon-21`,
         `securite/lecon-02`, `offensive/lecon-05` enseignent les entités).

      **QUATRE FAITS FAUX, rejoués :** `17 101 − 9 007 = 8 094`, pas 8 095 (un distracteur
      affichait une dérivation fausse) ; un `explain` annonçait « Mesuré : trier trois éléments
      rend “cab” » quand le corps de la leçon dit qu'**il en faut seize** et qu'un tri de trois
      rend « bca » ; un autre disait « quatre comparaisons sur cinq » là où le corps et la sortie
      du programme disent **trois sur quatre** ; un troisième prêtait à la section 6 du document
      l'**inverse de ce qu'elle écrit**. Plus **trois distracteurs devenus vrais** (dont « la
      lettre œ ne figure pas dans la table de `normalize()` », qui est la bonne réponse en plus
      court) et **un énoncé sous-déterminé** : `function f(n = 10)` rend `null`, mais `n || 10`
      et `n ?? 10` rendent 10 — la syntaxe est désormais dans la question.

      ⚠️ **L'ÉPREUVE PAR INJECTION AVAIT CESSÉ DE PROUVER, sans que rien ne change en elle.** Le
      cas « 6 questions au rang 1 ajoutées à `doc` » était calibré sur un cours à 39/64 au rang 1.
      Le cours réparé (16/64), six questions ne le sortent plus de la tolérance : **7/8, angle
      mort silencieux**. Recalibré sur l'état RÉPARÉ — il faut n tel que (16+n)/(64+n) dépasse la
      tolérance, soit n ≈ 14 — le cas en injecte **20** et le harnais revient à **8/8**. *Une
      mutation calibrée sur l'état tordu d'un cours cesse de prouver dès que le cours est réparé.*
      Dans le même mouvement, **`S3` — la seule clause dont l'implémentation venait d'être
      réécrite — n'avait AUCUN témoin** : deux témoins de violation et deux cas légitimes lui ont
      été ajoutés (`n < bonne * 0.07` au lieu de `0.7` serait passé vert), plus deux pour S4.
      `verif-normatif` **62 → 66 contrôles, 0 échec**.

      **Contrôles** : `verif.js --rapide` **52,6 s, 52 étapes tout vert** ; `verif-html` **0** ;
      `verif-donnees` **0 erreur, 0 avertissement** ; `verif-normatif` **66/66** ; `verif-doc`
      **36/36** ; `verif-recherche` **76/76** ; `verif-qcm-biais-mutations` **8/8** ;
      `verif-chaine-declaree` **OK (52 dans un mode, 7 déclarés hors chaîne)** ; index régénérés
      `--fresh` ; 8 blocs JSON valides, 0 BOM, 0 CRLF ; aucune URL CDN (les 3 occurrences du site
      sont du contenu pédagogique intouché).

      **Référence refigée, `doc` marqué `traite` — 18 cours traités.** ⚠️ **Le global du site
      monte de 68,2 % à 68,4 % sur « la plus longue », et c'est NORMAL : ramener `doc` de 0,0 %
      à 25,0 % rapproche ce cours du hasard mais éloigne la moyenne de zéro.** C'est précisément
      ce que B1 avait acté en jugeant l'écart au hasard plutôt que le taux brut ; la moyenne du
      site reste le mauvais chiffre pour juger une correction.

      **CE QUI RESTE, dans l'ordre** : (1) `git` (80 q), `rust` (76), `php` (78), `java` (77),
      `csharp`, `cpp`, `ocaml` ; (2) **instruire les deux pires rendements du site**, mesurés
      aujourd'hui et jamais traités : « l'incise entre parenthèses » **89,7 %** sur 37,3 % de
      couverture, et « la plus détaillée » **83,4 %** sur 58,5 % — ce sont désormais les plus
      nocifs, devant la longueur ; (3) décider si « la seule qui nie » (41,2 % de rendement site)
      entre dans `EXPLOITABLES` — elle ne fait rougir aucun cours traité aujourd'hui, mais
      l'ajouter fige la cible pour la suite. ⚠️ **`stats` (99,3 %) reste le cours-témoin de
      `verif-qcm-biais-mutations` : changer le témoin AVANT de le traiter.**

      **FAIT — LE 19ᵉ COURS, `git`, le 2026-09-06.** 80 questions, 78 retouchées, 6 lots
      d'écriture puis 6 relecteurs adversariaux sur les mêmes lots.

      | indice | avant | après |
      |---|---:|---:|
      | **la plus longue** | **93,8 %** | **25,0 %** — le hasard exact, rangs 20/20/20/20 |
      | la plus détaillée | 82,5 % | 38,3 % |
      | l'incise entre parenthèses | 72,8 % | 34,1 % |
      | l'écho de la question | 66,3 % | 28,6 % |
      | le mot technique exclusif | 65,4 % | **11,6 %** ⚠️ |

      Global du site sur « la plus longue » : **68,4 % → 67,5 %**. Référence refigée, `git`
      marqué `traite` — **19 cours traités**.

      ⚠️⚠️ **LA TROUVAILLE DE CETTE PASSE, ET ELLE VAUT POUR TOUS LES COURS DÉJÀ CLOS :
      la correction FABRIQUE un biais INVERSE, que le cliquet ne voit pas.** « Le mot
      technique exclusif » n'est pas tombé au hasard, il est tombé **13,4 points EN DESSOUS**
      — parce qu'on étoffe les distracteurs avec du vocabulaire technique et que la bonne
      réponse cesse d'en être la seule porteuse. **OUTIL NEUF :
      `tools/mesure-biais-inverse.js`**, qui recopie à dessein la règle de
      `mesure-biais-qcm` (la colonne « directe » doit tomber sur la sienne au dixième près,
      sinon l'une des deux a bougé) puis inverse la décision — l'apprenant ÉCARTE l'option
      désignée et tire parmi les trois autres :

      | cours | stratégie directe | stratégie INVERSE | elle tranche sur |
      |---|---:|---:|---:|
      | `git` (traité aujourd'hui) | 11,6 % | **29,7 %** | 91,3 % des questions |
      | `doc` (traité la veille) | 15,2 % | **31,9 %** | 98,4 % |
      | `ruby` (traité, témoin) | 26,4 % | 23,2 % | 81,0 % |

      **L'avantage réel est de +4,7 points sur `git` et +6,9 sur `doc`, pas de 13,4** : écarter
      une option sur quatre ne rend que 1/3, donc une stratégie à 0 % plafonne son inverse à
      **33,3 %**. C'est pourquoi ce défaut ne se traite PAS comme la longueur, et pourquoi
      l'ajouter à `EXPLOITABLES` (cible 60 %) ne servirait à rien : il ne peut jamais y toucher.
      **Le déséquilibre est réel mais petit ; il est mesuré et écrit ici plutôt que tu.**
      **Et le défaut est LOCALISÉ, ce que seule la mesure des 19 cours traités dit** :
      cinq cours seulement passent au-dessus du hasard en inverse (`doc` +6,9, `git` +4,7,
      `maths` +2,6, `zig` +1,3, `mobile` +0,7) ; **les quatorze autres sont en dessous**,
      jusqu'à −3,1 pour `equipe` et `projets-js`. Ce sont les deux cours les plus récents
      qui sont les plus déséquilibrés — la consigne d'écriture s'est durcie sur ce point
      précis au fil des passes, et elle est allée trop loin. **La consigne des prochains
      lots doit demander l'équilibre, pas l'inversion.**

      **OUTIL NEUF : `plan-rangs-qcm.js --incise`**, symétrique de `--ponctuation`, écrit parce
      que fermer la longueur DÉPLACE le biais une deuxième fois. Il liste les questions où la
      bonne réponse est en tête sur le nombre d'incises `(…)` d'au moins 4 caractères, avec la
      fenêtre de longueur du côté ACTUEL de chaque distracteur — l'ajustement se fait donc à
      longueur quasi constante (« A et B » → « A (et B) », 2 caractères) sans défaire le rang.
      **La cible n'est pas « aucune parenthèse » : c'est que la bonne réponse ne soit pas SEULE
      en tête** — une question dont les quatre options en portent une est neutre. Son chiffre
      (52,1 % avant la vague 2) est tombé sur celui de `mesure-biais-qcm` **au dixième près,
      par deux implémentations indépendantes**, ce qui est la seule raison de lui faire
      confiance. Après la passe : **34,1 %**.

      **CE QUE LA CONTRADICTION A TROUVÉ — et c'est là que le fan-out paie** : **zéro**
      distracteur devenu vrai sur les 216 réécrits (les six relecteurs sont formels, chacun
      preuve d'exécution à l'appui : git 2.54.0 est installé, tout a été rejoué dans des dépôts
      jetables). Mais **quatre défauts de CORPS DE LEÇON**, tous invisibles aux QCM :
      1. `lecon-02` affirmait que « les versions récentes de Git » créent `main` par défaut.
         **Faux** : `git init` sans `init.defaultBranch`, avec `HOME` isolé et
         `GIT_CONFIG_NOSYSTEM=1`, crée toujours `master` en 2.54.0. Ce sont les plateformes
         qui créent en `main`. Corrigé en distinguant les deux.
      2. `lecon-02` publiait **deux transcriptions de terminal que git ne produit pas** :
         `nothing to commit (create/copy files to get started)` au lieu de `… and use "git add"
         to track`, et `(use "git restore --staged <file>…" to unstage)` là où git écrit
         `git rm --cached` **tant qu'aucun commit n'existe**. C'est le défaut fondateur de la
         chaîne, dans le cours qui enseigne l'outil même du chantier.
      3. `lecon-07` donnait 90 jours pour l'expiration du reflog dans le cas décrit — un commit
         **inaccessible**, dont `gc.reflogExpireUnreachable` fixe le délai à **30 jours**.
      4. `lecon-14` q1 : la bonne réponse écrivait « GitHub Flow **(trunk-based)** » quand le
         corps de la même leçon **oppose** les deux (schéma à trois troncs, note « pour une
         grosse équipe qui déploie en continu, trunk-based »). Signalée sans être tranchée par
         le relecteur, vérifiée puis corrigée en « (le plus léger) », qui reprend le texte du
         corps — +2 caractères, rang inchangé (150 car. contre 155 / 162 / 105).

      Plus **un distracteur AMBIGU** (`lecon-20` q3) : « on fait `git commit` directement, ce qui
      clôt tout de même proprement le cherry-pick ». Rejoué : `git commit` **réussit et clôt
      bien la séquence** (`.git/CHERRY_PICK_HEAD` disparaît) — il committe simplement les
      marqueurs de conflit. La moitié de l'affirmation était vraie ; réécrit sans le mot
      « proprement ».

      ⚠️ **La correction a fait ROUGIR `verif-normatif` (64/66), et c'est le mécanisme voulu** :
      `doc/lecon-03` publie le taux de manquement à la clause `S3` mesuré sur le site, et
      détordre `git` l'a périmé — **60,3 % → 59,1 %, 3 680 → 3 605 manquements**, 10 occurrences
      dans la page. Mises à jour, **66/66**. ⚠️ Le remplacement a été fait motif par motif avec
      un compte affiché : `60,3` apparaît aussi dans `distribue/lecon-10` pour un **disjoncteur**,
      sans aucun rapport — un `sed` global aurait cassé une leçon juste.

      ⚠️ **Un sous-agent a écrasé le `~/.gitconfig` de la machine** en lançant
      `git config --global user.email` dans son dépôt jetable ; il l'a repéré et restauré
      lui-même. Vérifié après coup : `chipat-neko <alison.noah23@gmail.com>`, identique aux
      trois derniers commits. **La consigne des prochains lots doit imposer `--local`.**

      **CONSTAT HORS PÉRIMÈTRE, mesuré au passage** : `verif-rendu` rend 6 erreurs sur
      `git/lecon-24` — « 3 exercices déclarés dans `data-exos` pour 4 blocs `.exercise` ».
      **Préexistant** (le compte est identique dans `git show HEAD:`) et **il touche 39 leçons
      sur 1 629 (2,4 %)** : `python/lecon-50`, `html/lecon-33`, `sql/lecon-24`, `react/lecon-26`…
      Un bloc d'exercice y reste sans champ de réponse. À traiter en phase E, pas ici.

      **Contrôles** : `verif.js --rapide` **54,9 s, tout vert** ; `verif-html` **0** ;
      `verif-donnees` **0 erreur** (2 avertissements préexistants) ; `verif-normatif` **66/66** ;
      `verif-qcm-biais-mutations` **8/8** ; `verif-rendu` sur 3 des pages touchées **0 erreur** ;
      49 blocs JSON valides, **0 octet CR, 0 BOM** ; index `quiz` et `search` régénérés
      `--fresh` ; aucune URL CDN introduite.

      **CE QUI RESTE, dans l'ordre** : (1) `rust` (96,1 %, 76 q), `java` (94,2 %, 77),
      `php` (88,9 %, 78), `csharp`, `cpp`, `ocaml` — et **`stats` (99,3 %) qui reste le
      cours-témoin de `verif-qcm-biais-mutations` : changer le témoin AVANT de le traiter** ;
      (2) décider si le biais INVERSE mérite un contrôle propre — il ne peut pas passer par
      `EXPLOITABLES` (plafond 33,3 %), il lui faudrait sa propre borne dans le cliquet ;
      (3) **TRANCHÉ dans la foulée : « la seule qui nie » ENTRE dans `EXPLOITABLES`** (9 → 10
      stratégies). Le plan la laissait en suspens depuis deux passes faute d'avoir mesuré ce
      que son entrée coûte. Mesuré avant de l'écrire : **31,3 % de réussite pour 31,2 % de
      couverture, soit 40,6 % de rendement** là où elle tranche — nettement au-dessus du
      hasard, et c'est le critère retenu depuis le cours `doc`. **Ce qu'elle coûte aujourd'hui :
      rien.** Aucun des 90 cours n'est au-dessus de la cible de 60 % ; le plus haut du site est
      `crypto` à **46,1 %**, puis `cicd` 43,6 % et `data-eng` 41,9 %, et le plus haut des 19
      cours traités est `mobile` à 41,0 % — **13,9 points de marge**. C'est la condition posée
      en B2 pour qu'un cliquet reste lu : il ne rougit sur personne le jour où on l'ajoute, il
      fige la cible pour la suite.

      ⚠️ **L'ajout a produit un ROUGE qui n'était pas une régression, et il faut savoir le
      lire** : `nodejs` a été signalé « pire indice 29,8 % → 33,2 % » alors que **rien n'a bougé
      dans ce cours** — c'est le périmètre de la mesure qui a changé, et `nodejs` est le SEUL
      des 90 cours dont le pire indice devient « la seule qui nie ». Référence refigée pour
      cette raison-là, écrite ici : refiger reste interdit pour faire taire une vraie
      régression. `verif-qcm-biais-mutations` **8/8** après l'élargissement, `verif.js --rapide`
      **54,3 s tout vert**.

      **FAIT — LE 20ᵉ COURS, `rust`, le 2026-09-06.** 76 questions, 22 leçons. La passe a
      commencé par **récupérer le travail d'un réveil tué en cours de route** : 11 leçons
      modifiées et jamais commitées, vérifiées avant reprise (112 distracteurs réécrits,
      `mesure-qcm-intouchable` « aucune atteinte ») puis commitées telles quelles.

      | indice | avant | après |
      |---|---:|---:|
      | **la plus longue** | **96,1 %** | **25,0 %** — le hasard exact, rangs 19/19/19/19 |
      | **la plus COURTE** | — | **25,0 %** |
      | la plus détaillée | 76,3 % | 43,4 % (pire stratégie, cible 60 %) |
      | l'incise entre parenthèses | 70,5 % | **23,0 %** (0 question où la bonne est seule en tête) |
      | biais INVERSE (écart au hasard) | — | **+0,3 point** sur 96,1 % des questions |

      Global du site : **67,5 % → 66,7 %**. Référence refigée, `rust` marqué `traite` —
      **20 cours traités**. Le **biais inverse** (le défaut trouvé sur `git`) est ici le
      mieux tenu des 20 cours : directe 23,8 %, inverse 25,3 % — la consigne « vise
      l'équilibre, pas l'inversion », ajoutée aux écrivains après `git`, a tenu.

      ⚠️⚠️ **LA TROUVAILLE DE CETTE PASSE, ET ELLE MET EN CAUSE UN OUTIL DU PROTOCOLE :
      le 25,0 % était une MOYENNE QUI MENTAIT, et `plan-rangs-qcm.js` la certifiait.**
      Le cours affichait 25,0 % sur « la plus longue » *et* 25,0 % sur « la plus COURTE »,
      donc parfaitement plat, et l'outil rendait « **0 question à retoucher** ». Trois
      relecteurs adversariaux sur quatre ont réclamé la mesure **par leçon** ; faite :

      | | avant | après |
      |---|---:|---:|
      | `lecon-18` | **3/3** (100 %) | 1/3 |
      | `lecon-22`, qui porte le **QCM BILAN** | **10/13** (76,9 %) | 3/13 |
      | — dont le bilan seul | **5/8** | **0/8** |
      | leçons 01-17, « la plus longue » | 2/51 (**3,9 %**) | — |
      | leçons 18-22, « la plus longue » | 17/25 (**68,0 %**) | — |
      | leçons au-dessus de 1/3 | 3 | **aucune** |

      Deux lots de biais **opposés** qui s'annulaient dans la moyenne. Sur les leçons 01-17,
      « n'élis jamais la plus longue » était une règle d'élimination quasi parfaite ; sur
      18-22, « élis toujours la plus longue » gagnait deux fois sur trois — et un apprenant
      ne révise jamais que l'un des deux lots. **Ce n'est pas une impression : p = 7,4e-6
      pour les leçons 18-22 (17 sur 25) et p = 1,3e-4 pour `lecon-22` (10 sur 13)**, contre
      une binomiale (n, 1/4). C'est la leçon du cours `react` — « un indice de LOT vaut
      100 % sur le lot et 25 % sur le site » — montée d'un cran : **la moyenne du COURS est
      à son tour le mauvais endroit où décider.**

      **LA CAUSE EST DANS L'OUTIL, pas dans l'écriture, et c'est ce qui la rend générale.**
      `plan-rangs-qcm.js` triait **tous** les couples (question, rang) du cours par coût
      croissant et servait le moins cher d'abord. Or **le rang 0 coûte ZÉRO à une question
      qui y est déjà** : les 19 places du rang 0 partaient donc systématiquement aux mêmes
      leçons — celles dont les options sont courtes, au premier rang desquelles le QCM
      bilan. **L'outil produisait le défaut qu'il était censé mesurer, puis le certifiait
      conforme.** Réparé : les rangs cibles sont distribués **fichier par fichier**, en
      tourniquet, avec un décalage qui se poursuit d'un fichier à l'autre ; un fichier de
      trois questions reçoit trois rangs **distincts** ; la répartition du cours ne change
      pas ; le glouton par le coût ne joue plus qu'à l'intérieur d'un fichier. L'outil rend
      désormais la capacité **réellement distribuée** au lieu de la théorique. Relancé sur
      `rust` juste après : **36 questions à retoucher (984 caractères)** là où la version
      d'avant en voyait zéro.

      **CE QUE LA CORRECTION DE L'OUTIL RÉVÈLE SUR LES 19 COURS DÉJÀ CLOS — et il faut le
      lire sans l'arrondir dans un sens ni dans l'autre.** Relancé sur les 20 cours
      traités : **567 questions sur 1 941 (29,2 %) et 11 737 caractères** que l'ancienne
      version déclarait conformes ; `rust` est le seul à zéro. **Mais 567 n'est PAS un
      nombre de défauts** : la nouvelle règle est une **norme plus stricte** (chaque leçon
      étale ses rangs), pas une preuve de biais. Le test statistique le dit : sur **435
      fenêtres de 4 leçons** (≥ 8 questions) des 20 cours, **deux seulement** passent le
      seuil p < 1 %, et **les deux sont sur `git`** — leçons 16-19, « la plus COURTE »
      **9 sur 12 (p = 3,9e-4)**, et 15-18, 8 sur 12. À ce seuil on attend ~4 fausses
      alertes sur 435 fenêtres : **`git` est donc à la limite, et les 18 autres cours clos
      ne montrent rien.** ⚠️ Un premier jet de cette mesure comptait « 47 leçons au-dessus
      de 50 % » et paraissait accablant : **faux seuil** — sur une leçon de trois questions,
      2/3 arrive par hasard 15,6 % du temps, donc ~30 % des leçons devraient dépasser 50 %,
      et on en observe 9,5 %. **Un seuil qui n'est pas comparé au hasard n'est pas une
      mesure** ; c'est la même faute que B1 avait corrigée en prenant l'espérance exacte
      comme étalon.

      **CE QUE LA CONTRADICTION A TROUVÉ** (quatre relecteurs adversariaux, Rust **n'est
      pas installé** ici — aucun verdict ne repose sur une compilation, seulement sur un
      recalcul ou sur le comportement documenté de la bibliothèque standard) :
      1. **UNE BONNE RÉPONSE FAUSSE** (`lecon-08` q1). L'énoncé demandait pourquoi
         `fn f<T>(x: T)` ne peut pas faire `x > 0`, et la bonne réponse répondait
         `T: PartialOrd`. **La borne donne `PartialOrd<T>`, donc le littéral `0` devrait
         être un `T` — E0308.** Réparé à la racine en comparant deux valeurs du même type
         (`fn f<T>(x: T, y: T)` … `x > y`), ce qui rend la bonne réponse exacte et remet
         le distracteur « `T: Default` » du côté faux. La question 1 de « Vérifie ta
         compréhension » portait le même défaut.
      2. **UNE BONNE RÉPONSE APPROXIMATIVE, ET LE CORPS AVEC** (`lecon-09` q2) : « la
         fonction doit renvoyer un Result **(ou Option)** ». Un `?` posé sur un `Result`
         dans une fonction qui renvoie `Option` **ne compile pas**. Deuxième défaut dans la
         même phrase : la contrainte porte sur la fonction **englobante**, pas sur « la
         fonction appelante » — et le corps, lui, écrivait correctement « la fonction
         courante ».
      3. **DEUX DISTRACTEURS DEVENUS VRAIS EN ÉTANT ÉTOFFÉS**, le piège annoncé de la
         phase : « Arc est plus lent dès qu'un seul thread est concerné » (**exact** —
         c'est la raison d'être de `Rc`, et la leçon le dit elle-même) et « `Rc<Liste>`
         s'impose pour un type récursif » (**exact aussi** — c'est littéralement le code
         de la leçon 14 du même cours, et rustc suggère « a `Box`, `Rc`, or `&` »).
      4. **QUATRE DÉFAUTS DE CORPS DE LEÇON**, le défaut fondateur de la chaîne :
         `lecon-13` annonçait `    8     16    187` pour un `println!("{lignes:5} …")` —
         **rejoué** : `{:5}` aligne sur **cinq** colonnes et le `Cargo.toml` que la leçon
         publie elle-même en section 6 donne `   10    64   365` (10 lignes, 64 mots,
         365 octets, comptés) ; `lecon-20` montrait un objet **inliné** dans un tableau en
         sortie de `serde_json::to_string_pretty`, c'est-à-dire exactement ce que cette
         fonction est appelée pour ne pas faire ; `lecon-14` publiait le format de panique
         d'**avant Rust 1.73** ; `lecon-15` appelait `42.resume()`, qui **ne compile pas**
         (E0689, type numérique ambigu) alors que la même leçon suffixe `21_i32` deux
         sections plus bas.
      5. Plus : la consigne de l'exercice 2 de `lecon-16` disait « le mot-clé pour un bloc
         où le compilateur **NE VÉRIFIE PAS** la sûreté », soit l'**inverse** de ce que le
         corps enseigne en gras et presque mot pour mot le distracteur déclaré faux dans
         la même page ; et « Slice (taille fixe) », dans le QCM bilan, enseignait une
         confusion (une slice est à taille **dynamique**, c'est `[T; N]` qui est fixe).

      ⚠️ **Une passe précédente avait raboté des mots pour tenir une fenêtre de longueur**,
      et c'est le relecteur qui l'a vu : sur les **3 seuls changements lexicaux** des 48
      options retouchées par la passe « incise », tous trois étaient dans le QCM bilan et
      tous trois retiraient 1 à 3 caractères (`Le comptage` → `Comptage`, `classique` →
      `habituel`, `façon Haskell` → `à la Haskell`) pour repasser **sous** la bonne
      réponse. Aucun n'avait basculé vrai/faux, mais la consigne de la passe suivante l'a
      interdit explicitement et les trois mots ont été **restitués en allongeant**.

      ⚠️ **`verif-normatif` est repassé au rouge (64/66), et c'est le mécanisme voulu** :
      `doc/lecon-03` publie le taux de manquement du site à la clause `S3`, et détordre
      `rust` l'a périmé — **59,1 % → 57,9 %, 3 605 → 3 532 manquements**, 5 + 5
      occurrences. Remplacement motif par motif avec un compte affiché : `distribue/lecon-10`
      porte un `60,3 s` de **disjoncteur** sans aucun rapport, qu'un `sed` global aurait
      cassé. **66/66** après.

      **Contrôles** : `verif.js --rapide` **60,1 s, tout vert** ; `verif-html` **0** ;
      `verif-donnees` **0 erreur** (2 avertissements préexistants) ; `verif-normatif`
      **66/66** ; `verif-qcm-biais-mutations` **8/8** ; `mesure-qcm-intouchable` « aucune
      atteinte », **5 atteintes volontaires et déclarées** (2 énoncés, 2 explications,
      1 bonne réponse, toutes listées ci-dessus) ; 45 blocs JSON valides ; les 22 fichiers
      à **100 % CRLF** ; index `quiz`/`search` régénérés `--fresh` ; aucune URL CDN
      introduite. ⚠️ **Quatre des six écrivains ont rendu compte que les fichiers étaient
      « en LF, pas en CRLF » ; mesuré après coup, les 22 sont à 100 % en CRLF, inchangés.**
      Un compte rendu d'agent n'est pas une mesure.

      **CE QUI RESTE, dans l'ordre** : (1) **reprendre `git`** — c'est le seul des 19 cours
      clos que le test statistique met en cause, sur son lot 15-19 et à l'**envers** (« la
      plus COURTE » 9 sur 12) ; le plan corrigé y voit **38 questions / 882 caractères**.
      (2) les cours neufs, par nocivité : `stats` 99,3 %, `nosql` 99,1 %, `cobol` 98,7 %,
      `data-eng` 98,6 %, `os` 98,5 %, puis `java` / `csharp` / `cpp` / `ocaml` / `php`.
      ⚠️ **`stats` reste le cours-témoin de `verif-qcm-biais-mutations` : changer le témoin
      AVANT de le traiter.** (3) décider si la règle « chaque leçon étale ses rangs » doit
      entrer dans le **cliquet** : elle ne peut pas passer par `EXPLOITABLES` (ce n'est pas
      un taux de réussite), il lui faudrait un contrôle propre, adossé au test binomial
      plutôt qu'à un seuil fixe — le seuil fixe vient d'être pris en flagrant délit de
      surcompte dans cette passe même.

      ---

      **`git` REPRIS le 2026-09-06 — le premier cours détordu DEUX FOIS, et la reprise a
      trouvé bien plus que ce qu'elle venait chercher.** Le point (1) du « ce qui reste »
      ci-dessus est clos : les leçons 15-19, où la bonne réponse était la plus COURTE
      **10 fois sur 15**, ne le sont plus.

      | mesure sur les 80 questions | avant | après |
      |---|---:|---:|
      | fenêtres de 4 leçons sous p < 1 % | **2** (15-18 : 8/12 · 16-19 : 9/12) | **0** |
      | fenêtres sous p < 5 % | 3 | **0** |
      | rangs de longueur du cours | 20/20/20/20 | 20/20/20/20 (inchangé) |
      | leçons dont les 3 rangs sont distincts | 4 sur 24 | **24 sur 24** |
      | distracteurs hors de la fourchette 70-130 % | 6 | **0** |
      | **« la seule option avec un POINT-VIRGULE »** | **26/26 = 100,0 %** | **0 question tranchée** |

      **83 distracteurs réécrits sur 240**, `mesure-qcm-intouchable` : *aucune atteinte*
      (énoncés, index `correct`, explications et bonnes réponses identiques à `git show HEAD:`).
      Cinq écrivains sur fichiers disjoints, quatre contradicteurs, trois écrivains pour la
      seconde vague ; aucun commit d'agent.

      ⚠️⚠️ **LA TROUVAILLE DE CETTE PASSE, ET ELLE VAUT POUR LES 89 AUTRES COURS : LE
      POINT-VIRGULE EST UN INDICE À 93,5 % DE RENDEMENT, ET AUCUNE DES DIX-HUIT STRATÉGIES
      NE LE VOYAIT.** Deux contradicteurs sur quatre l'ont trouvé séparément, sans se
      concerter. Mesuré ensuite sur les **6 167 questions du site** : la stratégie tranche
      sur **1 070 questions (17,4 %)** et y a raison **93,5 %** du temps. Sept cours sont à
      **100 %** dessus (`csharp` 40/40, `swift` 38/38, `c` 33/33, `java` 32/32, `haskell`
      31/31, `git` 26/26, `cpp` 26/26).

      **Et il SURVIT au traitement de la longueur, ce qui est le point qui compte** : `git`
      était à **25,0 % exactement sur les quatre rangs** de longueur — le hasard parfait,
      cours déclaré clos le 2026-09-05 — et gardait **100 % sur le point-virgule**. Un
      apprenant qui ne connaissait rien à Git en tirait **48,4 %** du cours (25 questions
      gagnées d'office, le hasard sur les 55 autres). La cause est la même que pour la
      longueur, et c'est pour cela qu'elle y résiste : la bonne réponse porte l'explication,
      donc elle est la seule à séparer deux propositions. « la plus détaillée » comptait
      déjà les virgules et les deux-points ensemble — et les NOYAIT : la marque isolée est
      bien plus tranchante (le deux-points seul, sur `git`, ne rend que 28,6 %).

      **La stratégie est entrée dans `mesure-biais-qcm.js`** (19ᵉ stratégie). Elle n'entre
      **PAS** dans `EXPLOITABLES` de `verif-qcm-biais.js`, et c'est délibéré : les cours déjà
      marqués `traite` sont au-dessus de 60 % dessus, donc le cliquet rougirait partout et
      cesserait d'être lu — la règle posée en B2. La dette est mesurée, elle se soldera cours
      par cours. Correction faite ici sans jamais toucher la bonne réponse : un point-virgule
      **ajouté dans un distracteur**, à rang de longueur et à fourchette constants.

      **CE QUE LA CONTRADICTION A TROUVÉ — et git 2.54.0 est installé ici, donc RIEN n'est
      jugé de tête : chaque verdict est une exécution dans un dépôt jetable.**
      1. **QUATRE DISTRACTEURS DEVENUS VRAIS OU INDÉFENDABLES**, le piège annoncé de la
         phase : `lecon-01` q3 « il contient une abréviation absente du glossaire Git » —
         **littéralement exact** (aucune liste d'abréviations n'existe, et « maj » est bien
         absent du glossaire livré avec Git) ; `lecon-17` q2 « limiter la taille des fichiers,
         interdire les emojis, exiger une majuscule » — **les trois sont des règles de
         *ruleset* GitHub qui existent**, et c'est la passe précédente qui l'a aggravé en
         retirant la cheville « (par convention) » qui marquait le caractère cosmétique ;
         `lecon-14` q3 prescrivait d'ajouter le fichier au `.gitignore`, **ce que la leçon
         prescrit elle-même** ; `lecon-14` q1 « Git Flow, qui multiplie les étapes de fusion
         avant la mise en production » — **chaque mot est exact**, l'option argumentait contre
         elle-même. ⚠️ Les deux dernières sont les questions JUMELLES de `lecon-17` q1, que la
         passe précédente avait corrigée : **elle a réparé l'une et laissé l'autre.**
      2. **ONZE DÉFAUTS DE CORPS DE LEÇON**, le défaut fondateur de la chaîne, tous rejoués :
         `lecon-15` publiait `6b584e8…` comme sortie de `echo "bonjour" | git hash-object
         --stdin` en écrivant « le même contenu donnera TOUJOURS ce même hash, sur n'importe
         quelle machine » — **exécuté : `1cd909e05d33f0f6bc4ea1caf19b5749b434ceb3`**, et c'est
         le pire cas possible puisque la leçon invite l'apprenant à le reproduire ;
         `lecon-23` annonçait `0003-met-a-jour-l-aide.patch` quand `git format-patch`
         **supprime** le caractère accentué au lieu de le translittérer
         (`0003-met-jour-l-aide.patch`) — et le même nom faux était **dupliqué dans un
         `<svg>`**, invisible à tout outil qui ne lit que les blocs de code ; `lecon-13`
         faisait lister `build/` par `git clean -n`, **qui ne liste jamais un dossier sans
         `-d`** (et le bloc se contredisait trois lignes plus bas) ; `lecon-13` affirmait
         « un stash n'est pas un commit » alors que `git cat-file -t refs/stash` rend
         **`commit`** ; `lecon-22` écrivait le format de `git blame` avec la parenthèse fermée
         AVANT le numéro de ligne (`10:11) 12)`), que Git ne produit jamais, sur trois lignes
         plus une quatrième dans un exercice ; `lecon-22` montrait `git log -S` dans l'ordre
         **chronologique**, contredisant l'exercice 2 de la même page, qui a raison ;
         `lecon-19` annonçait `running 'npm test' --silent` quand `git bisect run` **quote
         chaque argument séparément** (mesuré : `running 'chemin' '--' '--silent'`) ;
         `lecon-19` écrivait « Seuls apps/site-web et packages/ui apparaissent » alors que le
         mode cône **matérialise aussi les fichiers de la racine** (mesuré : `ls` rend
         `README.md` et `package.json`) ; `lecon-20` présentait `(cherry picked from…)` comme
         une **sortie de terminal**, alors que `-x` l'écrit dans le **message du commit** ;
         `lecon-05` publiait des SHA **impossibles** (`0o0o0o0`, `9z8y7x6` : `o`, `z` et `y`
         ne sont pas hexadécimaux) ; `lecon-07` faisait dire à son glossaire que le reflog
         garde un commit décroché « environ 90 jours » quand `gc.reflogExpireUnreachable`
         vaut **30 jours** (doc `git-reflog.adoc`), l'encadré de la même page disant déjà 30.
      3. **TROIS DISTRACTEURS HORS FOURCHETTE créés par la passe précédente**, tous dans le
         QCM bilan et pour la raison qu'elle avait annoncée — sur des options de 8 à 40
         caractères, allonger revient à inventer une commande : `.hgignore ou .npmignore`
         valait **2,30×** la bonne réponse. `mesure-qcm-longueurs` les voyait ; personne ne
         l'avait relancé. Les trois remplaçants sont vérifiés inexistants par exécution.

      ⚠️ **CE QUE J'AI REFUSÉ AUX CONTRADICTEURS**, parce qu'une prise non prouvée coûte plus
      cher qu'une prise manquée. Le format de progression de `git fsck` : la ligne part sur
      **stderr** et ne s'affiche pas dans un terminal non interactif — **non reproductible
      ici**, donc non corrigé. Le SHA abrégé des transcriptions `bisect` : Git imprime bien
      40 caractères, mais tout le cours emploie des SHA fictifs à 7 caractères et uniformiser
      serait cosmétique. Le jour de semaine « Mon May 19 » jugé faux : **le 19 mai 2025 était
      un lundi**, et la leçon ne donne pas d'année — la prise reposait sur une année supposée.

      ⚠️ **UNE PRISE CORRIGÉE SANS PREUVE, ET DITE COMME TELLE** : le YAML en ligne de
      `lecon-18` est invalide en contexte *flow* (un scalaire nu ne peut pas porter une
      accolade), mais **aucun parseur YAML n'est disponible ici** — ni js-yaml, ni PyYAML,
      et le contradicteur qui affirmait en avoir lancé un n'a pas pu être suivi. La correction
      retenue met le scalaire entre apostrophes : forme valide dans les deux lectures, donc
      sans risque même si la prise était fausse.

      ⚠️⚠️ **DEUX PIÈGES D'OUTIL, dont un que je me suis infligé et qui périme une ligne de la
      mémoire du projet.** (a) **Sous Git Bash, `grep -c` avec un motif de retour chariot ne
      mesure pas les CRLF** : il m'a rendu « 382 lignes sur 382 en CRLF » sur un fichier qui
      est en **LF pur** (recompté en octets : zéro occurrence de CR LF). J'ai contredit cinq
      agents qui avaient raison, puis un sixième. Le dépôt est en LF, `HEAD` est en LF, et
      l'avertissement « LF will be replaced by CRLF » vient de `core.autocrlf=true` : il est
      normal et ne signale rien. ⚠️ **La passe `rust` a inscrit « les 22 fichiers à 100 %
      CRLF » sur la foi du même outil : c'est le même faux positif.** (b) Réécrire une option
      en repassant par `JSON.stringify` **reformate le bloc entier** (7 lignes changées → 90) :
      les blocs n'ont pas tous la même forme — une question par ligne dans la plupart des
      leçons, **tout sur une seule ligne dans `lecon-24`**. Le format a été rétabli et
      **prouvé par une épreuve** : reformater le fichier tiré de `HEAD` doit rendre `HEAD` à
      l'octet près, sinon on n'écrit rien.

      **Contrôles** : `verif.js --rapide` **63,4 s, tout vert** ; `verif-html` **0** ;
      `verif-donnees` **0 erreur** (2 avertissements préexistants) ; `verif-normatif` **66/66**
      (le taux publié par `doc/lecon-03` n'a pas été périmé cette fois, contrôle « la bonne
      réponse chiffrée suit la mesure » compris) ; `verif-qcm-biais` OK, référence refigée ;
      `verif-qcm-biais-mutations` **8/8**, contre-épreuve verte et fichiers restaurés ;
      49 blocs JSON valides ; 0 BOM, 0 mojibake, **0 URL CDN** ; index `quiz` et `search`
      régénérés `--fresh`. Global du site : **66,7 %** sur la longueur (inchangé — 80 questions
      sur 6 167 ne déplacent pas la moyenne) ; meilleure stratégie sur `git` : **38,1 %**
      (l'incise entre parenthèses), sous la cible de 60 %.

      **CE QUI RESTE, dans l'ordre** : (1) **le point-virgule sur les 89 autres cours** — la
      dette est de **1 070 questions tranchées à 93,5 %**, et les six autres cours à 100 %
      sont `csharp`, `swift`, `c`, `java`, `haskell` et `cpp`. Le traiter coûte beaucoup moins
      cher que la longueur : on ajoute un point-virgule dans un distracteur, sans toucher au
      fond, au rang ni à la fourchette. (2) les cours neufs par nocivité : `stats` 99,3 %,
      `nosql` 99,1 %, `cobol` 98,7 %, `data-eng` 98,6 %, `os` 98,5 %. ⚠️ **`stats` reste le
      cours-témoin de `verif-qcm-biais-mutations` : changer le témoin AVANT de le traiter.**
      (3) mesurer les autres ponctuations exclusives comme on vient de le faire pour le
      point-virgule — le **deux-points** rend déjà **79,9 % sur 1 652 questions** du site, et
      personne ne l'a encore regardé cours par cours.

      **COMPLÉMENT MESURÉ LE MÊME JOUR — ET IL CORRIGE LA RECOMMANDATION CI-DESSUS.**
      Avant de lancer une campagne « point-virgule » sur les 89 autres cours, deux mesures
      ont été faites, et les deux ont retourné l'intuition.

      **(a) Sur les cours NON traités, ce n'est pas un chantier séparé.** Les sept cours à
      100 % sont des cours de langage, et l'on pouvait croire que le `;` y venait du CODE.
      Vérifié sur `csharp` : non, il vient bien de la ponctuation d'explication. Mais les
      distracteurs y sont **squelettiques** — « C'est l'inverse », « Aucune différence »,
      « void renvoie 0 » face à une bonne réponse de 130 caractères. Y traiter le
      point-virgule seul serait un pansement sur un cours dont « la plus longue » vaut
      encore ~99 %. **La conclusion est donc : le point-virgule entre en CONSIGNE des passes
      de détordage, il ne fait pas l'objet d'une passe à lui.**

      **(b) Sur les 20 cours DÉJÀ CLOS, la dette est bien plus faible qu'annoncé — 56
      questions sur 1 941, pas 1 070.** L'effet de bord des réécritures avait déjà cassé
      l'indice presque partout (`nodejs` et `git` à zéro question tranchée, `react` et
      `maths` à 0 % de rendement). Deux cours restaient : **`rust` 16 sur 21 (76,2 %)** et
      **`archi` 7 sur 7 (100 %)**. Traités le jour même, deux agents sur cours disjoints :

      | les 20 cours clos | avant | après |
      |---|---:|---:|
      | questions OFFERTES par le point-virgule | **56** | **33** |
      | rendement de la stratégie | 47,5 % | **34,7 %** |
      | espérance d'un apprenant qui ne sait rien | 27,2 % | **26,3 %** (hasard : 25,0 %) |
      | `rust` | 16/21 = 76,2 % | **0/5 = 0,0 %** |
      | `archi` | 7/7 = 100,0 % | **0 question tranchée** |

      23 distracteurs retouchés, `mesure-qcm-intouchable` : *aucune atteinte* sur les deux
      cours ; rangs de longueur **strictement inchangés** (`rust` 19/19/19/19, `archi`
      inchangé), `verif.js --rapide` **62,7 s tout vert**, référence refigée.
      ⚠️ **Signalé sans être traité** : `rust` porte **6 distracteurs hors de la fourchette
      70-130 %** (jusqu'à **3,50×**), tous dans le QCM bilan de `lecon-22` et tous
      **antérieurs** à cette passe — le fichier n'a pas été modifié. C'est le même défaut que
      les trois du bilan de `git` corrigés ici : sur des options de quelques mots, la
      fourchette se dépasse sans qu'on le voie. **À vérifier sur les QCM bilan des 18 autres
      cours clos avant de déclarer la phase B tenable.**

      ---

      **PASSE DU 2026-09-06 (soir) — LA VÉRIFICATION CI-DESSUS EST FAITE, ET ELLE NE DEMANDE
      AUCUNE ÉCRITURE ; `java` EST CLOS (21ᵉ cours) ; `sql` N'AVAIT JAMAIS ÉTÉ VERROUILLÉ.**

      **(1) Les QCM bilan des 20 cours clos : la dette annoncée n'existe pas.** Mesuré sur les
      **273 questions de bilan et leurs 819 distracteurs** : **35 sont hors de la bande
      70-130 %**, répartis sur 6 cours (`html` 15, `js` 6, `rust` 6, `python` 4, `doc` 3,
      `css` 1). Mais **les 35 sont couverts par la clause S3 du normatif** — celle qui exempte
      les questions dont la bonne réponse fait moins de 20 caractères, parce que la bande n'y
      admet souvent qu'une seule longueur entière. **Non-conformités réelles : 0.**

      **Et la contre-épreuve, parce qu'une exemption n'est pas une preuve d'innocuité** : sur
      les **72 questions bilan exemptées**, la bonne réponse est la plus longue **20 fois
      (27,8 %)** — mais **13 de ces 20 sont des ex aequo**, donc l'apprenant ne peut pas
      trancher. En désignation unique : **7 sur 72 = 9,7 %, sous le hasard**. Rangs 20/16/28/8.
      **Le point est clos par la mesure, sans une ligne réécrite.**

      **(2) `sql` était conforme depuis sa clôture et n'était pas marqué `traite`.** Trouvé en
      listant les cours verrouillés : 20 drapeaux pour 21 cours annoncés clos. `sql` mesurait
      **16,9 % sur la longueur et 33,2 % sur sa pire stratégie**, donc sous les deux cibles —
      il n'était simplement pas verrouillé, et le cliquet le laissait libre de se dégrader.
      Marqué. **22 cours `traite` désormais** (`java` compris).

      ---

      **`java` — FAIT le 2026-09-06. LE COURS EST CLOS : 94,2 % → 26,0 %.** 23 leçons,
      **77 questions** (69 en QCM de leçon, 8 en bilan), **216 distracteurs réécrits sur 231**.
      Cinq écrivains sur lots disjoints, puis **une SECONDE VAGUE de quatre écrivains**, puis
      quatre contradicteurs ; aucun commit d'agent, un seul écrivain par fichier à tout instant.

      | indice, sur les 77 questions | avant | après |
      |---|---:|---:|
      | la plus longue | **94,8 %** | **26,0 %** |
      | la plus COURTE | 1,3 % | 22,1 % (pas de retournement) |
      | rangs de longueur | **73 / 2 / 2 / 0** | **20 / 20 / 20 / 17** |
      | l'incise entre parenthèses (rendement) | **65,7 %** | **39,9 %** |
      | l'incise, quand elle tranche seule | **21/24 = 87,5 %** | **2/10 = 20,0 %** |
      | le point-virgule (rendement) | **32/32 = 100 %** | **0,0 %** (4 questions tranchées) |
      | pire stratégie du cours | 94,2 % | **42,4 %** (cible ≤ 60 %) |
      | distracteurs hors 70-130 % non exemptés par S3 | 222 | **0** |

      **Global du site : 66,7 % → 65,8 %.** `mesure-qcm-intouchable` : **0 atteinte** sur les
      77 questions.

      ⚠️⚠️ **CE QUE CETTE PASSE APPREND, ET QUI VAUT POUR LES 68 COURS RESTANTS : FERMER LA
      LONGUEUR NE FERME PAS L'INCISE, ET IL FAUT UNE SECONDE VAGUE.** Après la première vague,
      `java` était à 26,0 % sur la longueur — parfait — et **l'incise entre parenthèses valait
      encore 65,7 % de rendement, 87,5 % quand elle tranchait seule**. La cause est la même que
      pour le point-virgule : la bonne réponse porte l'explication, donc elle est la seule à
      glisser une précision entre parenthèses. **Les agents de la première vague avaient
      pourtant reçu la consigne « la bonne réponse ne doit pas être la SEULE à porter une
      incise » — et ils l'ont tenue.** Ce n'était pas la bonne consigne : la stratégie compte
      le **nombre** d'incises, pas leur présence. Une bonne réponse à 2 incises face à des
      distracteurs à 0 ou 1 reste désignée. **La consigne des prochains lots doit dire : « au
      moins un distracteur porte AUTANT d'incises que la bonne réponse ».** Le mode
      `plan-rangs-qcm.js --incise` donne le plan tout fait ; la seconde vague a coûté 2 à 8
      caractères par question, à rang et à fourchette constants.

      **QUATRE DÉFAUTS DE CORPS DE LEÇON, tous prouvés par calcul.** ⚠️ **Java n'est PAS
      installé ici** (`java` et `javac` : command not found) — rien n'a donc été jugé de tête,
      et les prises non reproductibles ont été refusées.
      1. **`lecon-12` : LE DÉFAUT FONDATEUR DE LA CHAÎNE, dans un corps de leçon.**
         `mots.stream().filter(m -> m.length() > 4).findFirst()` sur `["chat", "chien",
         "cheval"]` rend **`chien`** — 5 caractères, donc `5 > 4` — et la leçon annonçait
         **`cheval`** dans **deux commentaires ET deux mentions du diagramme SVG**. Prouvé par
         comptage de caractères, pas par exécution. Corrigé en portant le filtre à `> 5`, ce
         qui rend les quatre mentions justes d'un seul coup.
      2. **`lecon-08` : une unité physique fausse, trois fois.** `G * masse / (rayon * rayon)`
         est une **accélération** : l'unité est **m/s²**, pas m/s. Les valeurs, elles, sont
         exactes — **recalculées** avec les constantes de la leçon : 9,80 et 3,71.
      3. **`lecon-22` : la leçon se contredit d'un paragraphe à l'autre.** « dix appels de
         150 ms bout à bout […] le temps total est tombé à celui du plus lent, environ
         **200 ms** » : si les dix font 150 ms, le plus lent fait 150 ms. Et le QCM de la même
         leçon enseigne « on paie la durée du plus lent (~150 ms) ».
      4. **`lecon-05` : un commentaire qui enseigne l'inverse de la leçon 10.** « var déduit le
         type ; le diamant `<>` reprend celui de gauche » — sous un code qui **ne contient
         aucun diamant** (`new ArrayList<String>()`), et avec `var` il n'y a précisément **pas
         de type à gauche** dont le diamant pourrait hériter (`var l = new ArrayList<>()`
         infère `Object`). `lecon-10` donne, elle, la définition juste.
      Plus une mention ajoutée sur `lecon-10` : **`Map.of` ne garantit pas l'ordre de
      parcours** (il dépend d'un SALT tiré au démarrage de la JVM), et la leçon affichait un
      ordre fixe sans le dire.

      **19 DISTRACTEURS DEVENUS VRAIS OU AMBIGUS**, le piège annoncé de la phase, jugés un par
      un avant remplacement. Les plus nets : « le mot-clé `return` devient facultatif **(on
      peut l'omettre)** » — c'est **exact** dans une méthode `void`, **et la leçon l'écrit** ;
      « `List<String>` **peut lever elle aussi** une `ClassCastException` » — vrai par
      pollution du tas, et c'est justement le mécanisme que la leçon décrit ; « **une `Map`
      dont on laisse les valeurs à `null`** » — c'est l'implémentation même de `HashSet` ;
      « chaque écriture **vide le tampon de sortie** » — `System.out` est en autoflush ;
      « `statusCode()` **relit un en-tête déjà reçu** » — exact, aucune E/S ; « (donc **un
      futur de futur**) » — exact ; « **BigDecimal est plus rapide** construit depuis un
      double » — exact, il n'y a pas d'analyse de chaîne.

      ⚠️ **DEUX INDICES DE LOT, invisibles dans la moyenne du cours** — la leçon de `react`,
      confirmée une fois de plus.
      - **« ex. » : 4 questions où la bonne réponse était la SEULE à porter l'abréviation**
        (`lecon-09`, `lecon-16`, `lecon-17` ×2). Rendement **100 %** sur ces quatre. Le tic
        vient des bonnes réponses, qui sont intouchables : il se corrige donc **par le bas**,
        en donnant un « ex. » à un distracteur.
      - **`lecon-23` : les TROIS questions du QCM de leçon avaient la bonne réponse la plus
        COURTE** (155 vs 167/156/168, 130 vs 146/137/149, 165 vs 193/171/172), plus **les
        guillemets « … », la flèche → et le sigle CLI exclusifs à la bonne réponse**. Quatre
        stratégies à 100 % sur un lot que la moyenne du cours noie complètement. Rangs remis à
        **1 / 3 / 2**, signatures redistribuées.

      ⚠️ **CE QUE J'AI REFUSÉ AUX CONTRADICTEURS, faute de pouvoir le prouver ici.** L'ordre de
      sortie de `groupingBy` sur `lecon-12` : le calcul de casier d'une `HashMap` de capacité 16
      donne bien `'r'` (casier 2) **avant** `'c'` (casier 3), donc `{r=…, c=…}` et non l'inverse
      — **mais aucune JVM n'est disponible pour le vérifier**, et la leçon prévient déjà juste
      en dessous que « l'ordre des clés n'est PAS garanti ». Remplacer une incertitude par une
      autre coûte plus cher que la laisser. Refusés aussi : deux « bonnes réponses fausses »
      signalées (`lecon-06` q3 « surcharger : dans la même classe » et `lecon-16` q2 sur la
      dominance des étiquettes) — les prises sont sérieuses, **mais une bonne réponse est
      intouchable dans ce protocole** ; elles sont notées ici pour une passe de fond.

      **Contrôles** : `mesure-qcm-intouchable` **0 atteinte** sur 77 questions (`q`, `correct`,
      `explain` et bonnes réponses identiques à `git show HEAD:`) ; **24 blocs JSON valides** ;
      `verif-html` **0** ; `verif-donnees` **0 erreur** (2 avertissements préexistants) ;
      `verif.js --rapide` **61,2 s, tout vert** ; `verif-qcm-biais` OK et référence refigée ;
      `verif-qcm-biais-mutations` **8/8**, fichiers restaurés ; `verif-normatif` **66/66**
      après mise à jour du taux que `doc/lecon-03` publie sur lui-même — il s'est **repérimé
      une 5ᵉ fois** : **57,9 % → 56,7 %**, **3 532 → 3 460 manquements**, **10 mentions**
      (dont l'explication d'un QCM, d'où la seconde régénération d'index) ; index `quiz` et
      `search` régénérés `--fresh` **deux fois** ; **0 BOM, 0 CRLF, 0 URL CDN**.
      ⚠️ Le nombre « 3 532 » s'écrivait avec une **espace insécable U+00A0 littérale** : trois
      tentatives de remplacement ont rendu « 0 mention modifiée » **sans erreur**, et c'est le
      vérificateur qui a refusé de passer au vert, pas l'outil d'édition.

      **CE QUI RESTE** : **68 cours non traités**, dont les plus nocifs par questions
      devinables sont `cpp` (77 q, 92,9 %), `csharp` (77 q, 93,5 %), `stats` (72 q, 99,3 %),
      `data-eng` (70 q, 98,6 %) et `php` (78 q, 88,9 %). ⚠️ **`stats` reste le cours-témoin de
      `verif-qcm-biais-mutations` : changer le témoin AVANT de le traiter.** `cpp` et `csharp`
      sont deux des sept cours à **100 % sur le point-virgule** — la consigne de leur lot doit
      porter la leçon de cette passe : **traiter la longueur, l'incise ET le point-virgule dans
      la même vague**, sinon il en faut deux.

      ---

      **`cpp` — FAIT le 2026-09-06. LE COURS EST CLOS : 92,9 % → 25,3 %.** 23 leçons,
      **77 questions** (69 en QCM de leçon, 8 en bilan), **212 distracteurs réécrits sur 231**.
      Six écrivains sur lots disjoints, **UNE SEULE VAGUE**, puis quatre contradicteurs.

      | indice, sur les 77 questions | avant | après |
      |---|---:|---:|
      | la plus longue | **92,9 %** | **25,3 %** |
      | rangs de longueur | **72 / 4 / 0 / 1** | **20 / 19 / 19 / 19** (la cible, à l'unité) |
      | la plus détaillée (rendement) | 81,5 % (95,0 %) | **17,6 % (0,0 %)** |
      | le mot technique exclusif | 73,1 % | **20,6 %** |
      | l'incise entre parenthèses (rendement) | 72,4 % (**98,0 %**) | **29,5 % (0,0 %)** |
      | l'écho de la question | 69,4 % | **21,4 %** |
      | le point-virgule (rendement) | 50,3 % (**100,0 %**, 26 questions) | **25,6 % (50,0 %, 2 questions)** |
      | pire stratégie du cours | **92,9 %** | **31,5 %** (cible ≤ 60 %) |
      | manquements à la clause S3 | 219 hors 70-130 % | **0** (8 questions exemptées, bonne réponse < 20 car.) |

      **Global du site : 65,8 % → 65,0 %.** `mesure-qcm-intouchable` : **3 atteintes, toutes
      déclarées d'avance** (voir ci-dessous), aucune autre sur les 77 questions.

      ⚠️⚠️ **CE QUE CETTE PASSE PROUVE, ET C'EST LA LEÇON DU TOUR PRÉCÉDENT QUI SE PAIE :
      UNE SEULE VAGUE A SUFFI.** `java` avait exigé **deux** vagues d'écriture parce que sa
      consigne disait « pas la SEULE à porter une incise » au lieu de « autant d'incises que la
      bonne réponse ». La consigne de `cpp` (`scratchpad/CONSIGNE-CPP.md`) portait dès le
      premier lot la formulation corrigée **et** le point-virgule, dans le même tableau de sept
      indices. Résultat mesuré : longueur, incise, ponctuation, point-virgule, mot technique et
      écho fermés **en une passe**, sans reprise. C'est la vérification directe de la règle
      n° 2 de B3 — *une leçon écrite dans ce plan ne se repaie que si elle est remise EN
      CONSIGNE au tour suivant*. Trois écrivains sur six sont même allés au-delà de la consigne
      en portant les **quatre** options au même nombre d'incises (le cas neutre), ce qui
      explique le 0,0 % de rendement plutôt qu'un 50 %.

      **LA PRISE QUI VAUT LE DÉPLACEMENT : UNE BONNE RÉPONSE FAUSSE, ET LA MÊME DOCTRINE FAUSSE
      RÉPÉTÉE EN DIX ENDROITS DE LA MÊME LEÇON.** `lecon-23` enseignait — dans son code, son
      callout « Piège fréquent », son antisèche, deux entrées de glossaire, son récapitulatif,
      sa question de compréhension **et la bonne réponse de son QCM** — que passer un
      `std::error_code&` à `recursive_directory_iterator` fait sauter les dossiers illisibles.
      C'est faux, et la preuve est normative, pas expérimentale (⚠️ **aucun compilateur C++
      n'est installé ici** : `g++`, `gcc`, `cl` absents) :

      1. l'`error_code` n'est passé qu'au **constructeur** — il ne couvre que l'ouverture de la
         racine ;
      2. la boucle `range-for` avance par `operator++()`, qui **n'a pas** d'argument
         `error_code` et relève donc de [fs.err.report] : *les fonctions sans argument
         `error_code` signalent les erreurs en levant*. La surcharge non lançante s'appelle
         `increment(error_code&)` et n'est jamais employée ici ;
      3. le vrai remède est `directory_options::skip_permission_denied` — **absent des 23
         leçons du cours** ;
      4. la leçon 21 du même cours énonce pourtant la règle juste (« la version qui prend un
         `std::error_code&` ne lève rien ») pour une **opération** ; la leçon 23 l'étend
         abusivement à un **itérateur**, dont chaque incrément est une opération distincte.

      **Exception déclarée d'avance** : énoncé, bonne réponse et explication de `lecon-23` q3
      réécrits — les 3 seules atteintes à l'intouchable de toute la passe. Rang de la question
      **inchangé (3)**, fourchette tenue (107 % / 113 % / 117 %). Corrigés dans la foulée : le
      code des deux blocs (l'option de parcours ajoutée, `analyser` rend l'`ec` à l'appelant),
      l'`error_code` **qui n'était jamais testé** — le programme aurait affiché « 0 fichiers,
      0 octets » sur une racine illisible, exactement le défaut que la leçon 19 dénonce — et la
      mention des « boucles de liens symboliques », impossibles tant qu'on ne demande pas
      `follow_directory_symlink`.

      **DEUX DISTRACTEURS VRAIS DANS LE QCM BILAN, tous deux antérieurs à cette passe.**
      (a) q7 « Quel outil écrit du code générique sur le type ? » proposait **`auto`** comme
      leurre : c'en est un vrai depuis la lambda générique (C++14) et le template abrégé
      (C++20), et `lecon-16` du même cours l'enseigne (`void f(std::integral auto x)`) sept
      leçons plus tôt — remplacé par `typedef`, rang 0 conservé. (b) q2 « Comment afficher sur
      la sortie standard ? » proposait **« printf seul »** : `std::printf` affiche bel et bien
      sur la sortie standard — remplacé par `std::cerr << x` (sortie d'**erreur**), qui a le
      mérite d'être faux *et* pédagogique.

      **DIX-SEPT DÉFAUTS DE CORPS DE LEÇON, tous prouvés par calcul, par citation normative ou
      par contradiction interne citée des deux côtés.** Les cinq qui comptent :
      - **`lecon-20` : un `long` qui déborde de 2 328 306 fois.** `for (long i = 0; i <
        100'000'000; ++i) s += i` somme **4 999 999 950 000 000**, contre 2 147 483 647 pour un
        `long` 32 bits — c'est-à-dire **tout Windows** (modèle LLP64), la machine même où ce
        site est développé. Débordement signé = comportement indéfini, et le programme
        **affiche** la valeur. Passé en `long long`.
      - **`lecon-11` : le programme des ranges ne compile pas.** `std::ranges::sort` est
        déclaré dans `<algorithm>` ([algorithm.syn]), jamais dans `<ranges>` — et la même leçon
        écrit la règle deux écrans plus bas (« Oublier l'en-tête : `<algorithm>` pour
        `sort`/`find` »), puis la viole. Sortie annoncée pour un programme qui n'atteint pas
        l'édition de liens.
      - **`lecon-10` : le schéma du `vector` illustrait la réallocation avec le seul cas où
        elle n'a PAS lieu.** `size = 3`, `capacity = 4`, un `push_back` → 4 éléments :
        [vector.modifiers] réalloue *si new size > old capacity*, or 4 n'est pas > 4. Le bloc
        ne bouge pas, les itérateurs restent valides. Le SVG montre désormais **cinq** éléments
        et deux `push_back`.
      - **`lecon-17` : ~2 millions de copies au lieu de ~1.** Sous le doublement que le
        commentaire pose lui-même, le cumul vaut 1+2+4+…+524 288 = **2²⁰ − 1 = 1 048 575** :
        avec un facteur de croissance 2, le total est toujours *inférieur* à n, jamais 2n.
      - **`lecon-16` : 8,5 présenté comme une « approximation » de 4**, soit +112,5 % d'erreur.
        `x/2 + 1/2` n'est un pas de Newton correct qu'au voisinage de 1 : la valeur de
        démonstration passe de 16.0 à 2.0 (**1.5** contre **1.41421**, erreur +6 %).

      Les douze autres : `lecon-12` (le `return` annoté « FUITE » est **inatteignable** —
      `new int[n]` avec `n < 0` lève `bad_array_new_length` **avant** le `if`, et rien n'a été
      alloué) ; `lecon-15` (le commentaire « les jthread se joignent ici » désignait la sortie
      du bloc, alors que c'est `threads.clear()` qui joint — sans quoi la sortie annoncée
      `400000` ne serait pas garantie) ; `lecon-14` (« Cette leçon clôt le parcours » : le cours
      compte **23** leçons, neuf la suivent, et son « Pour aller plus loin » renvoie vers des
      sujets traités trois et quatre leçons plus loin) ; `lecon-18` (« Contrairement à Rust ou
      Java » : le JDK n'a **aucun** framework de test, et `pages/java/lecon-14.html` du même
      site montre JUnit en **dépendance Maven**) ; `lecon-03` (le callout enseignait *l'inverse*
      du vrai piège : sans surcharge `bool` il n'y a aucune ambiguïté, `const char*` n'étant
      convertible ni en `int` ni en `double` ; et **avec** une surcharge `bool`, la conversion
      standard bat la conversion définie par l'utilisateur [over.ics.rank] — donc `bool` gagne
      **silencieusement**, ce qui est bien plus dangereux qu'une erreur) ; `lecon-03` encore
      (`~12.566` : `std::cout` affiche 6 chiffres significatifs, donc **12.5664**, comme
      `lecon-06` l'écrit trois fois pour le même calcul) ; `lecon-06` (l'indice
      `std::?????_ptr` donnait **5** points d'interrogation pour les **6** lettres d'`unique` —
      la convention du cours est un `?` par lettre, `lecon-01` donne `std::c???` pour `cout`) ;
      `lecon-08` (avec un retour par référence, `std::move` ne peut pas fabriquer de copie : au
      mieux une erreur de compilation, au pire une référence pendante — le vrai cas est la
      locale déclarée `const`, dont `const T&&` retombe sur le constructeur de copie) ; plus la
      solution de l'exercice 1 de `lecon-23`, qui **cassait le `std::sort` du programme dont
      elle est le correctif** (`ParExt` n'a ni `operator>` ni `operator<=>`, et la solution
      sautait précisément le comparateur).

      ⚠️ **CE QUE J'AI REFUSÉ AUX CONTRADICTEURS.** Cinq prises sérieuses, écartées parce
      qu'une bonne réponse et un énoncé sont **intouchables** dans ce protocole : `lecon-04`
      (« la liste d'initialisation est obligatoire pour les membres `const` » — faux depuis les
      initialiseurs de membre par défaut de C++11, mais c'est une simplification pédagogique
      assumée) ; `lecon-06` q2 (« seul `~Base` est appelé » sous un comportement **indéfini**,
      où rien n'est garanti — la réponse commence toutefois par « Comportement indéfini : ») ;
      `lecon-15` q2 (« acquisition ordonnée » : `std::lock` n'ordonne rien,
      [thread.lock.algorithm] ne spécifie pas l'ordre — imprécision réelle, à reprendre dans
      une passe de fond) ; `lecon-03` q2 et q3 (deux énoncés dont trois options sur quatre
      satisfont le critère écrit). Écartée aussi la prise sur le SVG de `lecon-07`
      (`operator[]` rangé « par référence » alors que sa version `const` rend par valeur) : le
      corps de la même leçon décrit correctement les deux surcharges. **22 soupçons non
      prouvés** ont été rendus et laissés tels quels, faute de compilateur — dont les drapeaux
      de modules de GCC et la dévirtualisation à `-O2`.

      **UN OUTIL NEUF, né d'un angle mort du protocole** : `mesure-biais-qcm.js --seul=<cours>`
      rend les **19 stratégies avec leur colonne RENDEMENT sur UN seul cours**. Sans lui, le
      point-virgule de `cpp` était **invisible** : `--cours` ne rend que la longueur et la
      meilleure stratégie, et `--lots=23 --cours=cpp` n'affiche que ce qui dépasse 60 % de
      réussite — or le point-virgule plafonnait à 50,3 % de réussite pour **100,0 % de
      rendement** sur les 26 questions qu'il tranchait. Le même piège que le cours `doc` avait
      révélé sur la colonne « réussite », mais à l'échelle du cours.

      **Contrôles** : `mesure-qcm-intouchable` **3 atteintes déclarées, 0 autre** ; **24 blocs
      JSON valides**, 462 chaînes sans caractère de contrôle, sans U+00A0, sans `&nbsp;` ;
      `verif-html` **0 problème sur 1 629 fichiers** ; `verif-donnees` **0 erreur** (2
      avertissements préexistants) ; `verif-qcm-biais` OK, référence refigée, **`cpp` marqué
      `traite` — 23 cours traités** ; `verif-qcm-biais-mutations` **8/8**, fichiers restaurés ;
      `verif.js --rapide` **51,9 s, 26 étapes tout vert** ; index `quiz`/`search`/`searchlite`/
      `flashcards`/`antiseches` régénérés `--fresh` **deux fois** ; **0 BOM, 0 CRLF, 0 URL CDN**.
      ⚠️ **`doc/lecon-03` s'est repérimé une 6ᵉ fois** : **56,7 % → 55,6 %**, **3 460 → 3 391**
      manquements à S3, **10 mentions** (dont l'énoncé d'un exercice et l'explication d'un QCM),
      et le nombre s'écrit avec une **espace insécable U+00A0 littérale** — le piège de la passe
      `java` s'est représenté à l'identique, et c'est le vérificateur qui l'a fait voir.

      **CE QUI RESTE** : **67 cours non traités**, dont les plus nocifs par questions devinables
      sont `csharp` (77 q, 93,5 %), `stats` (72 q, 99,3 %), `data-eng` (70 q, 98,6 %), `php`
      (78 q, 88,9 %) et `nosql` (99,1 %). ⚠️ **`stats` reste le cours-témoin de
      `verif-qcm-biais-mutations` : changer le témoin AVANT de le traiter.** `csharp` est le
      dernier des sept cours à **100 % sur le point-virgule** encore intact — sa consigne doit
      porter le tableau des sept indices tel qu'il vient d'être validé sur `cpp`.

      **`csharp` — FAIT le 2026-09-06. LE COURS EST CLOS : 93,5 % → 26,0 %.** 23 leçons,
      **77 questions** (69 en QCM de leçon, 8 en bilan), **217 distracteurs réécrits sur 231**.
      Six écrivains sur lots disjoints, **UNE SEULE VAGUE** (la deuxième d'affilée), puis six
      contradicteurs en lecture seule.

      | indice, sur les 77 questions | avant | après |
      |---|---:|---:|
      | la plus longue | **93,5 %** | **26,0 %** |
      | rangs de longueur | **72 / 1 / 3 / 1** | **20 / 19 / 19 / 19** (la cible, à l'unité) |
      | la plus détaillée (rendement) | 86,9 % (**100,0 %**) | **25,4 % (0,0 %)** |
      | le mot technique exclusif | 74,6 % | **14,6 %** |
      | l'écho de la question | 66,9 % | **13,1 %** |
      | l'incise entre parenthèses (rendement) | 65,7 % (**100,0 %**) | **30,1 % (0,0 %)** |
      | le point-virgule (rendement) | 64,0 % (**100,0 %**, 40 questions) | **25,0 % (0,0 %)** |
      | pire stratégie du cours | **93,5 %** | **30,1 %** (cible ≤ 60 %) |
      | fourchette 70–130 % | 221 distracteurs hors bande | **6**, tous exemptés S3 |

      **Global du site : 65,0 % → 64,1 %.** `mesure-qcm-intouchable` : **0 atteinte** sur les
      77 questions — aucune exception n'a été nécessaire côté écriture. Biais inverse mesuré
      à **27,8 %** (hasard 25,0 %, plafond 33,3 %) : pas de sur-correction.

      **CE QUE CETTE PASSE AJOUTE À LA PRÉCÉDENTE : la consigne réutilisable tient sur un
      deuxième cours d'affilée.** `scratchpad/CONSIGNE-CSHARP.md` est le décalque de celle de
      `cpp`, avec les chiffres du jour et un huitième garde-fou (« ne réserve pas la nuance à
      la bonne réponse » — « la plus prudente » rendait 77,8 % ici). Les six indices se sont
      fermés en une passe, sans reprise, et les six écrivains ont tous appliqué la règle
      inverse du point-virgule (ne pas en ajouter quand la bonne réponse n'en porte pas).

      ⚠️⚠️ **LA PRISE DU TOUR, ET ELLE EST STRUCTURELLE : 35 BLOCS DE CODE SUR 254 NE
      COMPILAIENT PAS, TOUS POUR LA MÊME RAISON.** En C#, un fichier à instructions de premier
      niveau peut contenir des types, mais **ils doivent venir après** ([top-level statements],
      erreur Roslyn CS8803). Trente-cinq blocs étiquetés `Program.cs` ou `solution` faisaient
      l'inverse — et annonçaient une sortie en commentaire. Le cours **énonce lui-même la
      règle** en `lecon-13` (« les instructions de premier niveau doivent toujours précéder les
      déclarations de `class`/`interface` : l'inverse ne compile pas ») puis la viole douze
      leçons durant. **33 blocs remis dans l'ordre**, les 2 restants laissés parce que ce sont
      des extraits de fichier de type (`Utilisateur.cs`, `apres.cs`), pas des programmes.

      ⚠️ **Et la leçon de méthode qui va avec : le premier réordonnanceur, non restreint,
      touchait 43 blocs et en cassait 8.** Il « corrigeait » des extraits illustratifs
      (`Options.cs`, `json.cs`) où la ligne d'usage n'est pas un top-level statement du même
      fichier — c'est-à-dire qu'il cassait ce qui était juste, exactement la règle n° 2 du
      plan. Le périmètre a donc été restreint aux seuls `data-file="Program.cs"` et
      `"solution"`, **et l'écart 43 → 35 a été vu parce que l'outil tournait en mode aperçu
      avant d'écrire**, avec en plus un contrôle « aucune ligne d'origine perdue ».

      **UNE EXPLICATION DE BONNE RÉPONSE FAUSSE**, la seule atteinte à l'intouchable de la
      passe, déclarée : `lecon-23` q1 enseignait « Where filtre (sans modifier la liste source,
      **qui est immuable ici**) ». La source est une `List<Livre>` — le glossaire de la même
      leçon la dit « redimensionnable », et la solution de son exercice 3 fait
      `bibliotheque.Add(...)`. Cinq mots retirés, aucune option touchée, rangs inchangés.

      **VINGT DÉFAUTS DE CORPS DE LEÇON.** Les quatre prouvés par **exécution** :
      - **`lecon-11` ex. 3 : « Au-dessus de la moyenne : 4 » alors que le programme affiche 3.**
        Moyenne de {8, 14, 17, 10, 5, 19, 12} = 85/7 = **12,142857**, et 12 ne la dépasse pas.
      - **`lecon-11` ex. 1 : « 9.6 » est impossible.** `12 * 0.8` vaut **9,600000000000001** en
        binary64, et .NET Core 3.0+ imprime la plus courte chaîne aller-retour — ce que la
        `lecon-02` du même cours enseigne (`0.1 + 0.2` → `0,30000000000000004`). Donnée passée
        à `15.0` (15 × 0,8 = 12 exact), sortie devenue `12, 24, 20`.
      - **`lecon-19` : le récit imputait à l'arrondi banquier ce qui vient du binaire.**
        `0.015` vaut **0,01499999999999999944** en `double` : l'arrondi vers 0,01 n'a rien à
        voir avec `MidpointRounding`. Exemple refait avec **0,125**, exactement représentable,
        où `ToEven` donne bien 0,12 contre 0,13 attendu — le test de non-régression du récit
        passe alors vraiment au rouge.
      - **`lecon-08` : `180.0` avec un point** là où le cours pose partout la culture française
        (`lecon-06` : « les sorties commentées de cette leçon supposent une machine configurée
        en français »). Idem pour les deux `12.14` de `lecon-11`.

      Prouvés par la **norme** : `lecon-04` (le seul exemple de surcharge du cours ne compile
      pas — trois **fonctions locales** de même nom, CS0128, alors que la leçon a établi
      100 lignes plus haut que ces méthodes SONT des fonctions locales ; passées en classe
      statique) ; `lecon-04` encore (un `params int[]` accepte **aussi** un tableau déjà
      construit, ECMA-334 §15.6.2.4 — le callout enseignait le contraire comme un « piège ») ;
      `lecon-08` (`[Flags]` ne conditionne ni `|`, ni `&`, ni `HasFlag`) ; `lecon-15` (un
      `record struct` n'est pas « alloué sur la pile ») ; `lecon-13`
      (`Microsoft.Extensions.DependencyInjection` n'est **pas** dans le framework partagé —
      vérifié dans `Microsoft.NETCore.App 8.0.19` sur cette machine) ; `lecon-16` (le `Split`
      sans allocation existe **depuis .NET 8**, pas 9) ; `lecon-17` (`dotnet run` n'a pas de
      rechargement à chaud, c'est `dotnet watch` ; un objet complexe non lié rend **415/400**,
      jamais `null`) ; `lecon-20` (System.Text.Json **échappe les non-ASCII par défaut** :
      `Café` ; et un fichier absent lève `FileNotFoundException`, pas `JsonException`) ;
      `lecon-21` (une **déclaration** ne peut pas être l'instruction intégrée d'un `if`,
      CS1023 — le « bon » exemple de la leçon ne compilait pas ; et le contexte nullable
      **avertit**, il ne refuse pas).

      Prouvés par **contradiction interne citée des deux côtés** : `lecon-03` (le récap dit
      `_` « obligatoire » quand la leçon décrit l'exception à l'exécution), `lecon-10`
      (`Stack<T>` rangé dans « l'ordre d'arrivée », contre son propre schéma), `lecon-11`
      (« les deux familles » pour trois), `lecon-22` (la captive dependency : seul le cas
      `Scoped` est détecté, et seulement quand la validation des portées est active),
      `lecon-23` (« après 1945 » contre `Annee >= 1945` en trois endroits ; schéma de six
      étapes annoncé « sept » dans l'`aria-label`), `lecon-04` (SVG donnant l'état *après*
      modification sous la forme d'une déclaration), `lecon-13` (flèche de référence à
      l'envers), `lecon-09`, `lecon-12`, `lecon-16`, `lecon-22` (quatre masques d'indice à la
      mauvaise longueur : 8 pour `Exception`, 6 pour `WhenAll`, 8 pour `stackalloc`, 11 pour
      `AddSingleton`).

      **ZÉRO distracteur devenu vrai sur les 217 réécrits** — le premier cours de B4 où les
      contradicteurs n'en trouvent aucun. Ce que je leur ai refusé : rien de substantiel, mais
      leur prise sur `lecon-19` a dû être **corrigée avant d'être appliquée** (voir ci-dessus :
      leur démonstration supposait `0.015` exact, ce que le `double` d'un `[InlineData]` n'est
      pas — `decimal` n'est même pas un type de constante admis dans un attribut).

      **Contrôles** : `mesure-qcm-intouchable` **0 atteinte** ; **24 blocs JSON valides**,
      77 questions, 0 caractère de contrôle, 0 U+00A0, 0 `&nbsp;` ; `verif-html` **0 problème
      sur 1 629 fichiers** ; `verif-donnees` **0 erreur** (2 avertissements préexistants) ;
      `verif.js --rapide` **77,9 s tout vert** ; `verif-qcm-biais` refigé, **`csharp` marqué
      `traite` — 24 cours traités** ; `verif-qcm-biais-mutations` **8/8**, fichiers restaurés ;
      index `quiz`/`flashcards`/`search`/`searchlite`/`antiseches`/`pieges` régénérés `--fresh`.
      ⚠️ **`verif-donnees` I18 est passé au ROUGE en cours de passe** sur 3 entrées périmées de
      l'index des **pièges** : `build-index --write --fresh` **sans `--only`** ne régénère que
      `quiz` et `flashcards`, il faut nommer `pieges` explicitement.
      ⚠️ **`doc/lecon-03` s'est repérimé une 7ᵉ fois** : **55,6 % → 54,4 %**, **3 391 → 3 318**
      manquements à S3, **11 mentions** dont une bonne réponse de QCM — et le piège d'encodage
      s'est dédoublé : le nombre s'écrit avec une **espace insécable U+00A0 littérale**, le
      taux avec l'**entité `&nbsp;`**. Deux formes, deux remplacements. `verif-normatif` 66/66.

      **CE QUI RESTE** : **66 cours non traités**, les plus nocifs par questions devinables
      étant `stats` (72 q, 99,3 %), `data-eng` (70 q, 98,6 %), `php` (78 q, 88,9 %) et `nosql`
      (99,1 %). ⚠️ **`stats` reste le cours-témoin de `verif-qcm-biais-mutations` : changer le
      témoin AVANT de le traiter.** Sur les sept cours à **100 % de rendement** sur le
      point-virgule, quatre sont maintenant traités (`java`, `git`, `cpp`, `csharp`) et **trois
      restent intacts, mesurés ce jour** : `swift` **68,2 %** de réussite, `haskell` **60,2 %**,
      `c` **59,9 %** — toujours pour **100,0 % de rendement**. (Premier jet de cette phrase :
      « les sept sont désormais tous traités », écrit de tête et **faux** — la référence du
      cliquet dit `traite=false` pour ces trois-là. Le contrôle est dans le commit.)
      ⚠️ `mesure-biais-qcm --seul=<cours>` doit rester le premier geste de chaque passe : c'est
      le seul mode qui fait voir un indice à faible couverture.


      ---

      **`data-eng` — FAIT le 2026-09-06. 24ᵉ cours détordu, et le deuxième d'affilée en UNE
      SEULE VAGUE d'écriture** (la consigne portait dès le départ les formulations corrigées de
      l'incise et du point-virgule : `scratchpad/CONSIGNE-DATA-ENG.md`, réutilisable).
      70 questions, 210 distracteurs, **208 réécrits**, 14 leçons + le QCM bilan de 12 questions.

      | indice, sur les 70 questions | avant | après |
      |---|---:|---:|
      | la plus longue | **98,6 %** | **25,7 %** |
      | la plus détaillée | 84,9 % (rendement 98,1 %) | 25,1 % (**5,0 %**) |
      | l'incise entre parenthèses | 66,1 % (**100,0 %**) | 29,0 % (**0,0 %**) |
      | le mot technique exclusif | 61,8 % | 23,3 % |
      | la seule avec un point-virgule | 44,3 % (**100,0 %**) | 25,0 % (**0,0 %**) |
      | la seule qui nie | 41,9 % | 25,1 % |
      | rangs de longueur | **69 / 1 / 0 / 0** | **18 / 18 / 17 / 17** (cible exacte) |
      | distracteurs hors 70-130 % | 210 | **0** (0,72 à 1,25) |

      **Global du site : 64,1 % → 63,3 %.** `mesure-qcm-intouchable` **0 atteinte** sur les
      70 questions. `verif-qcm-biais` refigé, **`data-eng` marqué `traite` — 25 cours traités** ;
      `verif-qcm-biais-mutations` **8/8**, fichiers restaurés.

      ⚠️⚠️ **CE POINT A TROUVÉ LE PLAFOND DE SA PROPRE CONSIGNE, ET C'EST SON RÉSULTAT
      PRINCIPAL — IL VAUT POUR LES 25 COURS DÉJÀ TRAITÉS.** La consigne dit depuis six cours :
      « si la bonne réponse porte un `;`, au moins un distracteur doit en porter un aussi ».
      Elle ferme bien la stratégie « la SEULE avec un `;` » — couverture ramenée à zéro. **Mais
      un apprenant n'a pas besoin de l'unicité : il lui suffit de RESTREINDRE son tirage aux
      options marquées.** Si la marque est portée par la bonne réponse et par UN seul
      distracteur, il tire à pile ou face — **50 %, le double du hasard**, et aucune des
      19 stratégies de l'outil ne le voyait.

      | rendement de la RESTRICTION | avant la vague | après « au moins un » | après « au moins deux » |
      |---|---:|---:|---:|
      | point-virgule | **97,4 %** | **45,6 %** | **0 %** (ne tranche plus) |
      | parenthèse | **98,7 %** | **48,7 %** | **0 %** |
      | deux-points | 83,8 % | 35,7 % | **0 %** |

      Sur les **6 167 questions du site**, restreindre à la parenthèse rend **49,1 %** — le
      deuxième indice du site derrière la longueur — les deux-points **39,2 %**, le
      point-virgule **36,6 %**. Sur les cours déjà traités le plafond tient partout : `git`
      47,8 / 50,9 %, `csharp` 43,4 / 39,4 %, `cpp` 44,2 / 42,0 %, `java` 43,0 / 39,3 %, `react`
      34,0 / 49,0 %. **Trois stratégies « RESTREINDRE au … » sont maintenant dans
      `tools/mesure-biais-qcm.js`**, et la règle est passée en consigne : *par marque, ou les
      quatre options la portent, ou aucune.*
      ⚠️ **Deux relecteurs adversariaux l'ont signalé le même jour sans se concerter — et leur
      chiffre était faux.** Ils annonçaient « 100 % sur 13 questions sur 22 » ; c'était le taux
      de leur LOT. Sur le cours entier : 45,6 %. La leçon de B3 (« un relecteur qui mesure sur
      son lot extrapole faux ») s'est vérifiée une fois de plus, sur une trouvaille par ailleurs
      juste et importante.

      **LA CONTRADICTION : 53 défauts rendus, 44 appliqués, et ZÉRO distracteur devenu vrai sur
      208 réécrits** — deuxième cours d'affilée à ce résultat, sur 112 + 88 + 80 options relues
      une par une par trois contradicteurs. Ce qu'ils ont trouvé est ailleurs, **dans les corps
      de leçon, et quatre défauts font que la leçon se réfute elle-même** :
      `lecon-06` (une ligne au format de date invalide s'évapore du silver ET de la quarantaine
      — le silver teste la nullité sur la valeur CASTÉE, la quarantaine sur la colonne BRUTE —
      alors que la leçon garantit deux fois « aucune ligne ne doit s'évaporer en silence », et
      que sa fonction de « contrôle de conservation » rebaptise la fuite en `doublons_retires`
      et retourne normalement) ; `lecon-08` (la « clé déterministe » trie sur `start`, colonne
      **constante par construction** puisqu'elle est hachée dans la clé de partition : la ligne
      gardée est arbitraire ; et `||` propage le NULL, donc toutes les lignes à `start` nul
      tombent dans une seule partition et une seule survit) ; `lecon-10` (le test de volumétrie
      filtre `WHERE debut >= current_date` alors que le pipeline traite la veille — il compte
      0 ligne et échoue **chaque nuit**, la « fatigue d'alerte » que la leçon dénonce 35 lignes
      plus bas ; le contrat dbt porte sur une colonne `type` qui n'existe pas, la leçon 6 crée
      `type_velo`, et interdit la valeur `inconnu` que le `CASE` du silver produit exprès ; le
      test de fraîcheur passe au VERT sur une table vide) ; `lecon-11` (la sortie annoncée en
      commentaire est impossible : `ATTENDU` porte les colonnes des trajets, l'exemple passe
      celles de la météo, et le message cité nomme `temp_c` qui n'est dans aucun des deux —
      corrigé et **revérifié par exécution Python**).
      Plus : `lecon-03` (le `CAST` d'une date `01/05/2026` échoue ou la fausse silencieusement,
      `WHERE "end" > start` compare du TEXTE non casté, et `QUALIFY` n'existe ni dans PostgreSQL
      ni dans Redshift, deux des quatre moteurs que la note cite ; « anonymisation » corrigé en
      **pseudonymisation** au sens du RGPD art. 4(5), corps + antisèche + glossaire) ;
      `lecon-12` (le seuil de fraîcheur décalé d'un jour : `age_en_jours = 0` déclaré « frais »
      est inatteignable pour un pipeline qui publie la veille — l'alerte partait chaque nuit) ;
      `lecon-13` (le commentaire et le SVG décrivent un `SELECT *` sans filtre là où la requête
      écrite est un `COUNT(*)` filtré ; et « 2,7 Go » donnait au Parquet 25 % de **surpoids** sur
      le CSV brut chiffré par la leçon elle-même) ; `lecon-02` (la passe nocturne ingérait les
      trajets du 1er mai et la météo du 30 avril, puis les croisait) ; `lecon-05` (le curseur
      avançait depuis l'HORLOGE alors que la leçon dit deux fois qu'il doit décrire LA DONNÉE) ;
      deux gabarits à trous d'une lettre de trop ou de moins, et un exercice « Au clavier »
      **insoluble** dont la ligne d'entrée n'existait que dans la solution repliée.

      ⚠️ **Un deuxième biais fabriqué par l'écriture, non corrigé et assumé** : « l'écho de la
      question » est tombé de 40,8 % à **11,3 %** — les distracteurs reprennent désormais les
      mots de l'énoncé PLUS que la bonne réponse. L'apprenant qui écarte l'option la plus écho
      obtient **30,4 %** (plafond de l'inverse : 33,3 %, mesuré par `scratchpad/echo-inverse.js`).
      C'est le même arbitrage que sur `git` : +5,4 points au-dessus du hasard, hors d'atteinte
      de la cible de 60 % des EXPLOITABLES, et une troisième vague coûterait plus qu'elle ne
      rapporte. La consigne dit maintenant de ne pas faire écho avec LES TROIS distracteurs.
      Les six autres cours traités mesurés le même jour sont proches de l'équilibre
      (`cpp` 21,4 / 23,4 %, `react` 22,5 / 25,0 %) ; `csharp` (13,1 / 28,7 %) partage le défaut.

      **Contrôles** : 29 blocs JSON valides, 0 BOM, 0 CR, 0 U+00A0, 0 `&nbsp;` dans un bloc
      quiz ; `verif-html` **0 problème sur 1 629 fichiers** ; `verif-donnees` **0 erreur**
      (2 avertissements préexistants) ; `verif.js --rapide` **56,9 s** ; `verif-exemples`
      **0 divergence** (197 blocs `type:code` confirmés par exécution) ; `verif-sorties`
      **449 sorties identiques au caractère près, 0 divergente** ; `verif-sql-exos` **0 faute**
      (13 exercices, 39 contre-requêtes) ; index `quiz`/`flashcards`/`search`/`searchlite`/
      `antiseches`/`pieges` régénérés `--fresh` **en nommant `pieges` explicitement**.
      ⚠️ **5 fichiers sur 14 sont revenus en CRLF** de l'outil d'édition des agents (le piège
      déjà vu sur `css`) : 2 440 CR retirés avant le commit.
      ⚠️ **`doc/lecon-03` s'est repérimé une 8ᵉ fois** : **54,4 % → 53,2 %**, **3 318 → 3 248**
      manquements à S3, **10 mentions** dans **deux formes d'espace** (U+00A0 littérale pour le
      nombre, entité `&nbsp;` pour le taux). `verif-normatif` **66/66**.

      **CE QUI RESTE** : **65 cours non traités**, les plus nocifs par questions devinables
      étant `stats` (72 q, 99,3 %), `os` (68 q, 98,5 %), `nosql` (57 q, 99,1 %), `cobol`
      (50 q, 98,7 %) et `lisp` (55 q, 98,2 %). ⚠️ **`stats` reste le cours-témoin de
      `verif-qcm-biais-mutations` : changer le témoin AVANT de le traiter.**

      ---

      **26ᵉ COURS — `os`, le 2026-09-06 — et LA DÉCOUVERTE QUI OBLIGE À REVOIR LES 25 PRÉCÉDENTS.**

      **Le cours** : 98,5 % → **25,0 %** sur « la plus longue », en **UNE SEULE VAGUE** (2ᵉ fois
      d'affilée, la consigne `scratchpad/CONSIGNE-OS.md` portait dès le départ la règle « les
      quatre ou aucune »). Rangs **67/0/0/1 → 17/17/17/17**, la cible exacte. **204 distracteurs
      sur 204 réécrits**, `mesure-qcm-intouchable` : « Aucune atteinte ». Fourchette 70–130 % :
      **0 hors fourchette** (0,72 à 1,28). Les trois stratégies de RESTRICTION (`;`, parenthèse,
      deux-points) tombent à **0 % de couverture** — la marque ne tranche plus jamais, donc le
      plafond de 50 % de la consigne molle n'existe pas ici. Pire indice restant : **26,8 %**
      (« écarter les deux extrêmes », conséquence mécanique de la répartition plate).
      **0 distracteur devenu vrai sur 204 réécrits — 3ᵉ cours d'affilée.**

      ⚠️⚠️ **LE 13ᵉ INDICE FABRIQUÉ PAR LA CORRECTION, ET LE PLUS LOURD DE TOUS : L'INDICE
      LEXICAL.** Un contradicteur l'a trouvé, je l'ai remesuré avec un outil neuf
      (`tools/mesure-lexique-qcm.js`). La stratégie : *l'apprenant ouvre la leçon, cherche au
      clavier les mots de chaque option DANS LA PAGE, et prend celle dont tout le vocabulaire
      figure dans le cours.* La bonne réponse est écrite avec les mots enseignés ; un distracteur
      inventé est écrit avec des mots que la page ne contient pas. **Aucune des 23 stratégies de
      `mesure-biais-qcm.js` ne le voit** : il ne porte ni sur la longueur, ni sur la ponctuation,
      ni sur la forme.

      **La vague le FABRIQUE — mesuré sur `os`, même corpus, avant et après (`--racine=`) :**

      | variante | avant la vague | après la vague |
      |---|---:|---:|
      | STRICTE (la seule option sans aucun mot étranger) | tranche 30,9 %, **rendement 38,1 %** | tranche 33,8 %, **rendement 100,0 %** |
      | PROPORTION (la plus forte part de mots du cours) | tranche 57,4 %, rendement 66,7 % | tranche 88,2 %, rendement 83,3 % |

      **Le classement du site le confirme, et il est contre-intuitif : les cours EN TÊTE sont
      exactement les cours DÉJÀ DÉTORDUS** — `bdd` 100 %, `iac` 100 %, `mobile` 100 %, `os`
      100 %, `ux` 95,7 %, `archi` 95,0 %, `git` 91,3 %, `doc` 90,9 %, `js` 89,2 % — tandis que
      `c`, `go` et `haskell`, jamais traités, sont à **0,0 %**. Site entier (6 167 questions) :
      STRICTE tranche sur 29,9 % et rend **54,1 %** ; PROPORTION tranche sur 63,7 % et rend
      **62,1 %** (réussite globale 48,6 %). En allongeant les distracteurs avec du vocabulaire
      inventé, B3 et B4 ont fermé la longueur **en ouvrant le Ctrl+F**.

      **Ce que ça impose, et qui n'est PAS fait** : une 8ᵉ règle de consigne — *au moins un
      distracteur par question doit être écrit avec AUTANT DE MOTS DU COURS que la bonne
      réponse* — et une passe de fermeture sur les 26 cours déjà traités. Sur `os`, l'outil
      compte **50 questions exploitables sur 68** (`--liste=os` donne les mots à remplacer,
      option par option). Ce n'est pas « tout réécrire » : il suffit de nettoyer UN distracteur
      par question. **Laissé décoché : c'est le sujet d'une passe entière, pas d'un reliquat.**

      **La contradiction (5 agents) a rendu 15 défauts prouvés, tous corrigés** — dont **4 corps
      de leçon qui se réfutent eux-mêmes** : `lecon-13` attribuait à un **interblocage** le
      redémarrage de Mars Pathfinder alors que `lecon-11` consacre une section à dire que c'était
      une **inversion de priorité** et que son QCM compte « un interblocage » comme FAUX pour ce
      scénario exact ; `lecon-14` annonçait « treize leçons » et n'en énumérait que douze, la
      manquante (L6) étant justement celle des outils que le projet emploie (`top`, `htop`,
      `strace` : 14 occurrences en L6, 0 ailleurs) ; `lecon-06` renvoyait au « projet final
      (leçon 11) » quand le projet final est la leçon 14 ; un `ls -l` transcrit **sans champ
      date**, que la commande ne peut pas produire. Plus **un distracteur que le cours enseigne
      comme VRAI six leçons plus loin** (l'héritage de priorité, mot pour mot celui de `lecon-11`)
      et **deux régularités de forme fabriquées par la vague** que l'outil ne voit pas : la
      **glose finale nominale** (les trois distracteurs finissaient par « (un/une … ) », la bonne
      réponse jamais — 100 % de rendement sur 3 questions, alors que « écarter la glose finale »
      rendait `couverture 0,0 %` puisque les quatre portaient bien une parenthèse : **la règle
      « les quatre ou aucune » ne protège que la PRÉSENCE du signe, pas ce qu'il y a dedans**),
      et **l'intrus par connecteur de conséquence** (3 distracteurs sur 3 en portaient un, la
      bonne réponse non).

      ⚠️ **Un angle mort d'outil trouvé au passage** : `plan-rangs-qcm --incise` teste
      `/\([^)]{4,}\)/` — une parenthèse de moins de 4 caractères comme `(IPC)` ou `(OS)` lui est
      invisible. Il rendait « 0 question en tête » sur une question où la marque tranchait à 100 %.

      ⚠️ **Deux indices se sont RETOURNÉS**, comme sur `data-eng`, et sont assumés : l'écho de la
      question (14,7 % en direct, **27,2 %** à qui l'écarte, mesuré par `scratchpad/echo-inverse.js`)
      et le mot technique exclusif (18,8 % en direct, **27,3 %** à l'inverse, `mesure-biais-inverse`).
      +2,2 et +2,3 points au-dessus du hasard, contre 30,4 % sur `data-eng` : la consigne « UN seul
      distracteur fait écho, jamais les trois » a bien limité le retournement.

      **Contrôles** : 15 blocs JSON valides, 0 BOM, 0 U+00A0 et 0 `&nbsp;` **introduits** (les 27
      U+00A0 du cours sont dans des champs `q` intouchables et préexistants, vérifiés contre
      `git show HEAD:`) ; `verif-html` **0 problème sur 1 629 fichiers** ; `verif-donnees`
      **0 erreur** (2 avertissements préexistants) ; `verif-qcm-biais` « aucun cours n'a empiré »,
      référence refigée et `os` marqué `traite` (**26 cours**) ; index `quiz`/`flashcards`/`search`/
      `searchlite`/`antiseches`/`pieges` régénérés `--fresh` en nommant `pieges` explicitement.
      ⚠️ `core.autocrlf=true` ici : l'arbre de travail est en CRLF et git normalise en LF au
      commit — le diff fait **8 lignes par leçon**, rien d'autre. Ne pas « réparer » ces CR.

      **CE QUI RESTE** : **64 cours non traités**, les plus nocifs par questions devinables étant
      `stats` (72 q, 99,3 %), `nosql` (57 q, 99,1 %), `cobol` (50 q, 98,7 %) et `lisp` (55 q,
      98,2 %). ⚠️ **`stats` reste le cours-témoin de `verif-qcm-biais-mutations` : changer le
      témoin AVANT de le traiter.** ⚠️ **Et l'indice lexical est désormais le premier du site
      devant la longueur sur les cours traités : le fermer passe avant d'en traiter un 27ᵉ.**

      **LE CLIQUET LEXICAL EST POSÉ, LUI, ET IL EST DANS LA CHAÎNE.** Trouver l'indice sans
      l'outiller aurait reproduit exactement le défaut fondateur du V16 (« un vérificateur hors
      chaîne vaut un vérificateur inexistant »). Livré dans la même passe :
      `tools/mesure-lexique-qcm.js` (mesure, `--seul=`, `--racine=`, `--json`, et surtout
      `--liste=<cours>` qui donne **les mots à remplacer, option par option**, en marquant les
      questions EXPLOITABLES — 50 sur 68 pour `os`), puis `tools/verif-qcm-lexique.js`, cliquet
      bâti sur le modèle de `verif-qcm-biais.js` : latitude 2 points, cible 60 % pour un cours
      marqué `traite`, référence `tools/qcm-lexique-reference.json` figée sur les 90 cours.
      **Câblé dans `tools/verif.js`** (`qcmlexi`) : la chaîne passe de 52 à **53 vérificateurs
      dans un mode**, `verif-chaine-declaree` reste vert (7 hors chaîne, 7 déclarés).
      ⚠️ **Prouvé capable d'ÉCHOUER, et pas seulement de passer** : injection d'un mot inventé
      dans les trois distracteurs de `go/lecon-01` → `ECHEC — go : PROPORTION 44,4 % → 50,0 %`,
      code de sortie 1 ; restauration → code 0. C'est le geste exact que la vague d'écriture fait,
      et il est maintenant vu au moment où il est fait.

      ⚠️ **`doc/lecon-03` s'est repérimé une 9ᵉ fois**, comme à chaque cours détordu :
      **53,2 % → 52,1 %** et **3 248 → 3 181** manquements à S3, **10 mentions** corrigées
      (5 taux + 5 nombres, toutes avec un séparateur U+00A0 littéral cette fois — pas d'entité
      `&nbsp;`, contrairement à la 8ᵉ fois : vérifier la forme AVANT de remplacer).
      `verif-normatif` repassé de **64/66 à 66/66**. `verif.js --rapide` : **58,9 s**, un seul
      signalement, celui-là, désormais éteint.

      ---

      **27ᵉ cours détordu : `mobile` — et LA LEÇON QUI VAUT POUR LES 26 AUTRES : fermer un indice
      à fond le RETOURNE.** Le 2026-09-06, seconde passe de la journée. Le plan disait de fermer
      l'indice lexical avant de traiter un 27ᵉ cours ; c'est ce qui a été fait, sur le cours le
      plus nocif des traités (`mobile`, 73 questions, STRICTE **100,0 %**, PROPORTION 88,4 % sur
      94,5 % des questions).

      **CE QUE LA PREMIÈRE VAGUE A FAIT, ET POURQUOI ELLE A ÉCHOUÉ EN RÉUSSISSANT.** Consigne
      donnée : « ZÉRO mot étranger dans les quatre options ». Six lots, **218 distracteurs sur 219
      réécrits**, consigne tenue à la lettre : STRICTE et PROPORTION tombent toutes deux de leur
      niveau à **0,0 % de couverture** — elles ne tranchent plus du tout. **Et le cours restait
      devinable à 100 %.** La bonne réponse étant INTOUCHABLE, ses mots étrangers à elle sont
      restés pendant que les 219 distracteurs passaient à zéro : il suffisait de **retourner la
      règle** — « choisis l'option qui contient un mot ABSENT de la page » — pour avoir juste
      **37 fois sur 37**. Mesure indépendante (`scratchpad/mes-inverse.js`, écrit exprès pour ne
      pas croire l'outil sur parole) : **tranche sur 50,7 % des questions, rendement 100,0 %**.
      ⚠️ **Et le cliquet `verif-qcm-lexique.js` était VERT**, parce qu'il ne mesurait qu'un sens.
      Un cliquet qui ne surveille qu'une direction d'un indice ne protège de rien : il déplace la
      faille. C'est le défaut fondateur du V16 (« un vérificateur hors chaîne vaut un vérificateur
      inexistant ») dans sa variante la plus sournoise — le vérificateur EST dans la chaîne, il
      passe, et il ne voit pas.

      C'est **le lot A qui l'a signalé de lui-même**, en fin de compte rendu, sous le titre « ce
      que je n'ai pas pu tenir » : il a mesuré l'inverse sur son propre lot (100,0 % sur 8 sur 8)
      et proposé la parade. Une consigne qui exige un compte rendu de ce qui n'a pas pu être tenu
      rapporte plus que la consigne elle-même.

      **LA RÈGLE QUI FERME LES TROIS VARIANTES, et elle est arithmétique.** Soit `k` le nombre de
      mots étrangers de la bonne réponse (donnée, puisque intouchable) :
      *k = 0* → les trois distracteurs à zéro ; *k > 0* → **DEUX distracteurs à zéro et UN à
      exactement k**. Alors STRICTE voit deux zéros (elle en exige un seul), PROPORTION voit deux
      parts à 1,0 ex æquo, INVERSE voit deux maxima ex æquo : **aucune des trois ne tranche**.
      Distribution mesurée sur `mobile` : 36 questions à k=0, 23 à k=1, et 14 au-dessus (jusqu'à
      **k=9** sur le QCM bilan, dont les bonnes réponses emploient le vocabulaire des quinze
      leçons alors que la page de référence est la seule leçon 15).

      **OUTILLÉ LE JOUR MÊME, avant la correction et pas après.**
      `tools/mesure-lexique-qcm.js` reçoit la **troisième variante INVERSE** (colonne dans le
      tableau, ligne d'ensemble, champs `inverseCouverture`/`inverseRendement` en `--json`), et son
      mode `--liste=` ne dit plus « zéro partout » : il calcule `k`, affiche les distracteurs visés
      (`0 / 0 / k`) contre ceux d'aujourd'hui, et compte séparément les questions **exploitables**
      et les questions **à mettre en forme** — 37 sur 73 au départ. `tools/verif-qcm-lexique.js`
      surveille désormais les trois variantes en régression comme en cible, et sa référence porte
      `inverse` (les références antérieures sans ce champ sont ignorées sans planter).
      ⚠️ **Prouvé capable d'ÉCHOUER, pas seulement de passer** : injection du geste exact de la
      première vague — un mot étranger d'un distracteur de `mobile/lecon-01` q1 remplacé par un mot
      présent dans la page, ce qui met les trois distracteurs à zéro face à une bonne réponse à
      k=1 → `ECHEC — mobile : INVERSE 0.0 % -> 100.0 %` **et** `marque traite, INVERSE a 100.0 %`,
      **code de sortie 1** ; restauration → code 0.

      **LA TROISIÈME VAGUE, ET LE DEUXIÈME INDICE QUE LA CORRECTION A FABRIQUÉ.** Quatre relecteurs
      adversariaux lancés sur les 73 questions réécrites ont rendu un verdict sévère, et le lot
      `lecon-15` a conclu « ne pas committer en l'état ». Trouvé :
      **5 distracteurs devenus vrais ou indéfendables** (`lecon-14` q5 décrivait TestFlight, que la
      leçon présente deux paragraphes plus haut ; `lecon-15` bilan Q2 affirmait « un paquet par
      plateforme », ce que le bloc de code de la leçon dit mot pour mot ; bilan Q12 avait reçu la
      « vérification des étiquettes de confidentialité », que le magasin fait réellement ;
      `lecon-08` q1 n'énonçait **aucune** affirmation fausse ; `lecon-06` q3 donnait la persistance
      comme raison de hisser un état, ce que la leçon enseigne).
      Et surtout **DEUX indices de forme fabriqués par la contrainte lexicale** :
      (1) **une quinzaine de distracteurs ne voulaient plus rien dire** (« il écrit des lignes de
      texte dans la commande de la machine », « un envoi idempotent déserte la file », « le
      composant inférieur inscrit dans l'état du HAUT », « sans case de côté ») — **la bonne réponse
      devenait la seule option grammaticalement intelligible**, ce qui est un indice plus fort que
      tous ceux qu'on venait de fermer ; (2) **17 distracteurs sur 60** (leçons 06-10) finissaient
      par une clause qui condamnait l'option elle-même (« ne sert plus à rien », « le processeur
      chauffe », « le spinner tourne indéfiniment ») quand la bonne réponse ne le fait qu'une fois :
      `lecon-08` q2 était **offerte à 100 %**. Ramenés à **0 sur 60**.
      La règle neuve, qui prime désormais sur les contraintes de forme : **un distracteur doit être
      du français naturel et plausible ; si une contrainte oblige à écrire une phrase bancale,
      c'est la contrainte qui cède.** Et un distracteur affirme sa thèse POSITIVEMENT — sa fausseté
      est dans le mécanisme décrit, jamais dans un aveu final.

      **RÉSULTAT MESURÉ, après les trois vagues** (`mesure-biais-qcm --seul=mobile`, 73 questions) :

      | | avant | après |
      |---|---:|---:|
      | indice lexical STRICTE (rendement) | **100,0 %** | ne tranche plus (**0,0 %** de couverture) |
      | indice lexical PROPORTION | 88,4 % sur 94,5 % | ne tranche plus (**0,0 %**) |
      | indice lexical INVERSE | *jamais mesuré* → 100,0 % après vague 1 | ne tranche plus (**0,0 %**) |
      | la seule avec un tiret | 100,0 % | **0,0 %** de couverture |
      | la MAJUSCULE d'emphase | 90,0 % | **0,0 %** de couverture |
      | la plus détaillée | 69,7 % | **0,0 %** |
      | RESTREINDRE au point-virgule | 66,7 % | **0,0 %** |
      | la seule qui nie | 55,2 % | 16,7 % |
      | l'incise entre parenthèses | 54,5 % | **0,0 %** de couverture |
      | la plus longue | 21,1 % | 26,8 % (rangs **19/18/18/18** = cible exacte) |
      | pire indice du cours (réussite) | 51,9 % | **38,9 %** |

      **Onze stratégies sur 23 sont à 0,0 % de COUVERTURE** : elles ne désignent plus jamais rien.
      `verif-qcm-biais` et `verif-qcm-lexique` refigés, `mobile` marqué `traite` dans les deux
      (**27 cours** au biais, **1er** au lexique). Chaîne complète `verif.js --rapide` : **53,3 s,
      les 53 vérificateurs verts**, dont `normatf` — `doc/lecon-03` ne s'est PAS repérimé cette
      fois, les longueurs du cours n'ayant pas bougé. `verif-html` 1 629 fichiers 0 problème,
      `verif-donnees` 25 contrôles 0 erreur, index `quiz`/`search` régénérés `--fresh`.

      **DEUX DETTES ASSUMÉES, écrites plutôt qu'arrondies.**
      1. **« Le mot technique exclusif » a MONTÉ pendant la réparation** : 25,0 % → 34,4 % après la
         vague 1 → **42,5 % de rendement** (54,8 % de couverture) après la vague 3. Écrire du
         français naturel avec le vocabulaire du cours concentre mécaniquement les mots longs dans
         la bonne réponse, qui est intouchable. C'est **sous la cible de 60 %** et le cliquet est
         vert, mais la trajectoire est mauvaise et c'est le troisième indice que nos propres
         corrections fabriquent. Le fermer demande d'injecter dans les distracteurs des mots longs
         **déjà présents dans la page**, sous les contraintes simultanées de longueur, de rang, de
         ponctuation et de `k` : c'est un chantier de cours entier, pas un rattrapage de fin de
         passe. **À traiter comme B4 traite les autres indices : mesurer sur les 90 cours d'abord.**
      2. **Une coquille dans une BONNE réponse**, donc intouchable par la règle de la vague :
         `mobile/lecon-15` bilan q11 écrit « motif de rejet nº 1 » avec **U+00BA** (indicateur
         ordinal masculin) au lieu de U+00B0. Repérée par balayage des points de code. La corriger
         ferait échouer `mesure-qcm-intouchable` ; il faut le faire hors vague, en le déclarant.

      **CE QUI RESTE** : 63 cours non traités. ⚠️ **`stats` reste le cours-témoin de
      `verif-qcm-biais-mutations` : changer le témoin AVANT de le traiter.**

      ---

      **LE 28ᵉ COURS : `stats`, le plus tordu du site (2026-09-07).** 99,3 % → **25,0 %**, le
      hasard exact. Trois lots d'écriture (72 questions, 216 distracteurs), puis **cinq relecteurs
      adversariaux** sur les 15 leçons. Le témoin de l'épreuve par injection étant devenu dynamique
      au réveil précédent, la contrainte notée ci-dessus était levée : rien à changer avant de
      traiter.

      | mesure (`mesure-biais-qcm --seul=stats`, 72 questions) | avant | après |
      |---|---:|---:|
      | la plus longue | **99,3 %** | **25,0 %** |
      | rangs de longueur | 72 / 0 / 0 / 0 | **18 / 18 / 18 / 18** (cible exacte) |
      | pire indice du cours | 99,3 % | **27,1 %** |
      | la plus détaillée | 77,0 % | 16,9 % |
      | RESTREINDRE à la parenthèse / aux deux-points / au point-virgule | 54,2 / 55,8 / 43,1 % | **0,0 %** de couverture |
      | l'incise entre parenthèses | 53,1 % | **0,0 %** de couverture |
      | indice lexical STRICTE / PROPORTION / INVERSE | 40,0 % / — / — | **0,0 %** de rendement |

      **Neuf stratégies sur 23 ne tranchent plus jamais.** Cliquets refigés, `stats` marqué
      `traite` (**27ᵉ** au biais, **2ᵉ** au lexique), épreuve par injection **8/8**.

      **⚠️⚠️ LA TROUVAILLE QUI DOMINE CE COURS, ET QUI VAUT POUR TOUS LES AUTRES : UNE LEÇON QUI SE
      RÉFUTE PAR SA PROPRE MÉTHODE.** `lecon-15` enseigne la vérification anti-Simpson, la fait
      tourner sur ses propres données, et **jette le résultat**. Le mélange d'appareils n'était pas
      le même dans les deux bras (**60/40 côté A contre 70/30 côté B**) : le test stratifié de
      Mantel-Haenszel rend **z = 2,352 et p = 0,0187 — significatif** — là où la leçon conclut
      p = 0,063, *non concluant*, sur toute sa longueur. **Le lecteur qui applique correctement la
      méthode que la page vient de lui enseigner obtient l'INVERSE de sa conclusion.** Second étage :
      la section suivante demande « l'affectation était-elle vraiment aléatoire ? » sans regarder ses
      propres chiffres (**z = 4,69, p = 2,8 × 10⁻⁶** : un tirage aléatoire ne produit cet écart
      qu'une fois sur 75 000). Correctif appliqué et prouvé : mélange égalisé
      (`600/36/600/48` et `400/44/400/56`), **totaux 80 et 104 conservés**, B devant A dans chaque
      segment (le point pédagogique tient), et le test stratifié retombe sur **z = 1,864, p = 0,0623**,
      concordant avec le p global. Trois blocs de code corrigés.
      ⚠️ **Les QCM, eux, restaient justes** : leurs énoncés *donnent* z ≈ 1,86 et p ≈ 0,063 en
      prémisse. Le défaut était **entièrement dans le corps** — exactement le profil du défaut
      fondateur de la chaîne, celui qu'aucun vérificateur ne voit.

      **QUATRE AUTRES DÉFAUTS DE FOND, tous prouvés par exécution.** `lecon-03` annonçait une
      variance de **19** à trois endroits quand `pvariance(stable)` vaut **20 exactement** (22,22 en
      ÷n−1) — aucune convention ne donne 19, et l'un des trois est un **énoncé de QCM**, donc une
      **exception déclarée** à la règle intouchable (`mesure-qcm-intouchable` la signale, ce qui
      prouve qu'il fonctionne). `lecon-06` écrivait « moyenne − 2σ ≈ −268 ms » quand la ligne du
      dessus imprime **−311.0**. `lecon-09` **inversait les deux branches du U** dans son figcaption
      (r local mesuré sur les `<circle>` : gauche **−0,9121**, droite **+0,9279**). `lecon-05`
      envoyait sur la mauvaise page deux fois (l'intervalle de confiance est en 07, pas en 08).

      **QUATRE DISTRACTEURS DEVENUS VRAIS — le prix connu du procédé, et il se paie à chaque fois.**
      `lecon-14` q3 : la « moyenne simple » **est** la standardisation à poids égaux, et la
      population de l'essai est réellement 50/50, donc pour **tout** public de référence commun
      B > A. `lecon-12` q4 : « résidu nul donc sans influence » est un **théorème exact** — la droite
      reste 13,071429 / −5,25 alors que le levier du point vaut **0,9951**. `lecon-13` q4 : la clause
      ajoutée était la **définition verbatim** de la leçon. `lecon-13` q2 : un seuil à 1 % rend bien
      le test plus exigeant. S'y ajoutent deux **auto-réfutants** (`lecon-02` q2 avouait dans sa
      propre parenthèse que 67857 est la moyenne) et `lecon-01` q4, dont la **seconde moitié est
      vraie et démontrable** (bootstrap 200 000 tirages : IC 95 % de la moyenne = **[102 ; 427]**).

      **15 SORTIES PYTHON ANNONCÉES QUE LE SITE N'AFFICHE PAS**, documentées par un réveil précédent
      et **jamais appliquées** : `statistics.mean()` sur des entiers rend un `int` — la leçon annonce
      `239.0`, Chrome affiche `239`. Prouvé **dans un vrai Chrome, en `file://`** : `lecon-05`
      annonçait `[1825, 411, 3902, 77, 2664]` là où Pyodide 3.12.1 affiche
      `[913, 205, 2254, 2007, 1829]` — sur la page qui enseigne la **reproductibilité**, et le
      « ex. » masquait une valeur simplement fausse (un réveil précédent l'avait classée faux
      positif *à cause de ce « ex. »*). ⚠️ **Le piège du motif trop large est démontré dans la même
      leçon** : `median(latence)` affiche bien `107.0` et `sum/len` bien `239.0`. Chaque correction
      vise UNE ligne.

      ⚠️ **LA RÈGLE QUI M'A SERVI CONTRE MOI-MÊME** : mon premier calcul de vérification, fait sur
      des données que j'avais **inventées** au lieu de les extraire du bloc, donnait 169,75 et
      26857,1 au lieu de 105 et 21857,1. Extraire les vraies données a tout remis d'aplomb. Ne
      jamais calculer de tête vaut aussi pour *vérifier* le travail d'un autre.

      **VÉRIFICATIONS** : `verif-html` 1 629 fichiers 0 problème, `verif-donnees` 25 contrôles
      0 erreur, chaîne `verif.js --rapide` **53,0 s, les 53 vérificateurs verts**, index `quiz` et
      `search` régénérés `--fresh`.

      **EFFET DE BORD ASSUMÉ, la 10ᵉ fois** : détordre un cours périme les chiffres qu'une autre
      leçon publie **sur le site**. `doc/lecon-03` citait 52,1 % et 3 181 manquements à sa propre
      clause S3 ; la mesure du jour donne **51,0 % et 3 110**. Reperimé (10 substitutions),
      `verif-normatif` repasse à **66/66**.

      **OU EN EST LA CIBLE DE B1, mesuré et pas estimé** : le global « la plus longue » du site
      est passé à **61,7 %** (6 167 questions, 90 cours) — la cible de B1 était **60,0 %**.
      Elle est donc à **1,7 point**, soit un ou deux cours, alors que le cadrage de B4 annonçait
      qu'il en faudrait 40. ⚠️ Ne pas en conclure que B4 est fini : 62 cours restent au-dessus
      de leur propre seuil, et la moyenne du site est justement le mauvais endroit où décider
      (leçon du cours `react`).

      **CE QUI RESTE, ET CE QUE JE N'AI PAS FAIT** : **62 cours non traités**.
      Trois dettes écrites plutôt qu'arrondies :
      1. **Les réécritures de points de SVG, refusées faute de temps mesuré.** Les relecteurs ont
         livré des jeux de coordonnées corrigés et prouvés pour cinq figures (`lecon-09` : les
         panneaux « +0,9 » et « −0,8 » sont dessinés **parfaitement alignés** donc indiscernables du
         cas |r| = 1 ; `lecon-11` : la droite des moindres carrés passe **au-dessus de 4 des 6
         points**, somme des résidus **−33,5 px** au lieu de 0, dans la figure même qui enseigne
         « aucune autre droite ne fait mieux », et l'étiquette « R² ≈ 0,25 » est **géométriquement
         inatteignable**, le minimum possible dans la boîte étant 0,465). C'est un chantier de
         figures, pas un rattrapage de fin de passe. **Rapports conservés** dans
         `scratchpad/contra-stats-{a,b2,c2,d2,e2}/`.
      2. **Deux `aria-label` encore faux**, signalés et non corrigés : `lecon-12` l. 191 annonce un
         point de test qui n'est pas dessiné, l. 155 promet une zone grisée que le SVG n'a pas.
      3. **« Le mot technique exclusif » reste la trajectoire à surveiller** : 50,6 % → 19,3 %,
         donc fermé ici — mais c'est l'indice qui **monte** quand on écrit du français naturel, et
         `mobile` avait fini à 42,5 %. Le suivre cours par cours, pas en moyenne de site.

      ⚠️ **UN OUTIL À CÂBLER, mesuré et documenté par un réveil précédent dans
      `scratchpad/b4-echo-inverse.md`, toujours pas fait** : les 22 stratégies de
      `mesure-biais-qcm.js` sont **toutes directionnelles sauf quatre**. Sur `stats`, « l'écho de la
      question » tombe à **10,9 %**, très SOUS le hasard — un indice sous le hasard n'est pas fermé,
      il est **retourné**, et « ÉCARTER l'écho » rend jusqu'à 34,2 % sur les cours déjà traités.
      Un relecteur l'a re-mesuré ici, indépendamment : sur les 72 questions de `stats`, quand une
      option porte strictement le plus de `, : ;`, ce n'est **jamais** la bonne — **0 sur 33**.
      Câbler « ÉCARTER » dans l'outil fera remonter `pire` sur une dizaine de cours d'un coup :
      il faut donc **ajouter la stratégie ET refiger la référence dans le même commit**, en écrivant
      que ce n'est pas une régression mais une dimension neuve. À faire dans une passe dédiée, pour
      ne pas mêler ce refigeage à celui d'un cours en cours de traitement.

- [ ] **B5 · Contrôle : le QCM reste-t-il correct ?** Les scores enregistrés (`syntaxe-quiz`) et les
      QCM bilan doivent continuer de fonctionner. Régénérer `quiz-index.js` une seule fois, à la fin.

---

## PHASE C — Étendre la fraîcheur

**6 cours sur 94** portent une marque de fraîcheur. Le V15 a bâti l'outil, la convention et le
vérificateur ; il a passé les cinq cours d'infrastructure et `react`. Les neuf cours d'écosystème
que le F5 nomme sont mesurés à **0 marque** : `nodejs`, `typescript`, `vue`, `sass`, `graphql`,
`ml`, `llm`, `data-eng`, `dataviz`.

⚠️ **La réserve écrite par le V15 tient toujours** : la calibration ne vaut que pour `react`. Ne pas
appliquer un détecteur automatique à l'aveugle — il signalerait deux pages sur trois à tort.

- [ ] **C1 · Les trois cours les plus périssables** (`nodejs`, `typescript`, `vue`).
- [ ] **C2 · Les trois suivants** (`graphql`, `sass`, `data-eng`).
- [ ] **C3 · Les trois cours d'IA** (`ml`, `llm`, `dataviz`) — les plus exposés au vieillissement.
- [ ] **C4 · Bilan de la fraîcheur.** Combien de cours marqués, combien de marques, et
      **projection dans le temps** (`--date=AAAA-MM-JJ`) pour vérifier que les seuils d'âge se
      déclenchent bien. Dire aussi ce qui reste non marqué et pourquoi.

---

## PHASE D — Les liens qui manquent

- [ ] **D1 · Le visualiseur, relié là où il sert.** Le F5 annonce 41 leçons qui expliquent la pile
      d'appels sans y mener ; B6 en avait retenu 19 sur 42 candidates, mesurées **par le titre** et
      non par le corps. **Les deux mesures ne portent pas sur le même ensemble : commencer par les
      réconcilier**, puis relier ce qui le mérite. Le lien est posé par `js/lecon.js`
      (table `TITRES_VISUALISEUR`), pas en dur dans les leçons.
- [ ] **D2 · Le décodeur d'erreurs et le bac à sable Git.** Même question pour eux : combien de
      leçons parlent d'un message d'erreur ou d'une commande Git sans mener à l'outil qui les fait
      manipuler ? Mesurer, puis relier.

---

## PHASE E — Les manques de contenu

- [ ] **E1 · La leçon maigre.** `sass/lecon-09.html` : quatre critères sous la médiane du site
      (schémas, encadrés, glossaire, mots). L'amener au standard.
- [ ] **E2 · Le rythme des durées.** **13 cours sur 90** sont hors du facteur 2 autour de la médiane
      de 54 mots/minute, de `powershell` à 26 jusqu'au plus rapide. Recalculer les durées annoncées
      sur la base du contenu réel. **Attention** : la clé des durées est `lessonDurations`, et un
      cours a un identifiant différent de son dossier (`javascript` vs `js`) — piège déjà rencontré.

---

## PHASE F — Contrôle final

- [ ] **F1 · Les vérificateurs, tous modes.** `--rapide`, `--complet`, `--strict` et le nouveau
      `--mutations`, tous verts. Citer la durée de chacun.
- [ ] **F2 · Le garde-fou de A5 fonctionne.** Ajouter un vérificateur bidon hors chaîne : le
      contrôle doit échouer. Le retirer : il doit repasser au vert.
- [ ] **F3 · Mesure globale.** Vérificateurs dans la chaîne : **24 hors chaîne au départ**, combien
      à l'arrivée ? Biais des QCM : **88,8 % au départ**. Cours marqués en fraîcheur : **6 sur 94**
      au départ.
- [ ] **F4 · Ce qui n'a pas été fait.** Lister et expliquer, sans arrondir — comme l'a fait le F5
      du V15, dont ce chantier entier est issu.

---

## Fin de chantier

Quand toutes les cases sont cochées, le wrapper déclenche la **passe de sécurité** : vérification
globale, rapport dans `VERIF-FINALE.md` avec un verdict en première ligne, puis extinction
automatique si le verdict est vert.
