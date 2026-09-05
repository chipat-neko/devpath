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
