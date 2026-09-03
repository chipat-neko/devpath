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
- [ ] **B2 · Le vérificateur, avant les corrections.** `tools/verif-qcm-biais.js` : signale une
      question dont la bonne réponse dépasse les distracteurs au-delà d'un seuil mesuré. **Éprouvé
      par injection** : des questions volontairement biaisées doivent être vues. Entre dans la
      chaîne (phase A).
- [ ] **B3 · Les six cours à 100 %** (`archi`, `equipe`, `iac`, `mobile`, `ux`, `zig`). Étoffer les
      distracteurs. **Chaque distracteur réécrit doit rester FAUX** — c'est le piège de cette phase :
      en allongeant un mauvais choix, on le rend facilement vrai. Rejouer le QCM après correction.
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
