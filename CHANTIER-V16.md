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
