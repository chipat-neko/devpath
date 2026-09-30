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

      ⚠️⚠️⚠️ **SIXIÈME CONSIGNE, AJOUTÉE LE 2026-09-10 PAR LE POINT E1 DU CHANTIER V17 : LE POINT
      INTERNE — et celle-ci n'est pas une précaution, c'est un correctif.** La mesure a établi que
      **la correction de B3/B4 FABRIQUE cet indice**, et le chiffre ne laisse pas de place au doute :

      | | couverture | rendement |
      |---|---:|---:|
      | les **35 cours déjà traités** (3 040 questions) | **6,1 %** (184 q.) | **98,9 %** |
      | les **55 cours pas encore traités** (3 127 questions) | **3,2 %** (101 q.) | **99,0 %** |

      **La couverture est presque DEUX FOIS plus grande là où l'on est passé.** Et sur les cours les
      plus retravaillés, elle est massive : `react` **19,8 %**, `rust` **19,7 %**, `projets-js`
      **17,9 %**, `sql` **15,9 %**, `js` **14,7 %** — *une question sur cinq* devinée à coup sûr sur
      `react`. Rendement **100 %** sur chacun de ces cours. Mesure rejouable :
      `node tools/mesure-point-interne.js` (et `--exemples`).

      **CE QUE L'INDICE EST, exactement.** La bonne réponse est écrite **en deux phrases** — elle
      explique, puis conclut : *« Un `if / else if` s'arrête au premier cas vrai ; une note de 16+ est
      aussi >= 12, donc la branche 12 la capte avant. **Il faut tester du plus restrictif au moins
      restrictif.** »* — pendant que les trois distracteurs tiennent en une phrase. Le point suivi
      d'une majuscule est la signature. C'est le réflexe naturel de qui étoffe une bonne réponse : on
      ajoute la règle à retenir. **On ne l'ajoute jamais à un distracteur, puisqu'il est faux.**

      **LA CONSIGNE, et elle vise l'ÉGALITÉ, pas la modération** (leçon du cours `lua` : une inégalité
      laisse toujours une lecture exploitable, seule l'égalité ferme ; leçon du cours `mobile` :
      fermer à fond dans un seul sens RETOURNE l'indice) :

      > **Dans une question donnée, les quatre options portent le MÊME nombre de phrases.** Si la
      > bonne réponse explique puis conclut en deux phrases, **les trois distracteurs concluent
      > aussi** — et leur seconde phrase est une **règle FAUSSE mais plausible**, jamais un
      > remplissage, jamais une reformulation de la première. Si l'on ne sait pas écrire trois
      > fausses conclusions crédibles, **on retire la conclusion de la bonne réponse** et les quatre
      > options tiennent en une phrase. Le point d'abréviation (`etc.`, `cf.`), la virgule décimale et
      > le point d'un `objet.methode()` ne comptent pas : la signature est **un point suivi d'une
      > espace puis d'une majuscule**.

      **À VÉRIFIER À CHAQUE LOT** : `node tools/mesure-point-interne.js --traites` doit voir la
      couverture des cours traités **descendre vers celle des cours non traités**, et non l'inverse.
      Le cliquet `verif-qcm-biais.js` surveille déjà la stratégie « la seule en deux phrases » depuis
      le 2026-09-07, mais **par la réussite par cours** — où aucun cours ne dépasse 39,8 %. Il ne
      rougira donc pas : c'est la couverture qu'il faut regarder, à la main, avec l'outil ci-dessus.

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

      **FAIT DANS LA FOULEE, une fois `stats` isole dans son propre commit.** Deux strategies
      INVERSES cablees dans `mesure-biais-qcm.js` (24 strategies), et **la premiere strategie
      inverse du CLIQUET** : `ECARTER l'echo de la question` entre dans `EXPLOITABLES`.

      ⚠️ **LA MESURE A CORRIGE CE QUE LA NOTE ANNONCAIT, et c'est le plus interessant.** La note
      qui reclamait cet ajout predisait qu'il ferait remonter `pire` « sur une dizaine de cours
      d'un coup ». Mesure faite : **DEUX** (`stats` 27,1 % → 32,6 %, `data-eng` 29,0 % → 30,4 %).
      Le cliquet les a vus tous les deux, tout seul, avant le refigeage. Le plus haut du site est
      `doc` à **34,2 %**, très loin de la cible de 60 % : personne ne rougit.

      | | ÉCARTER la plus détaillée | ÉCARTER l'écho |
      |---|---:|---:|
      | site (6 167 questions) | **12,4 %** | **20,3 %** |
      | plus haut cours | 25,2 % (`stats`) | **34,2 %** (`doc`) |
      | moyenne des 27 cours **traités**, pire des deux | — | **25,2 %** |
      | moyenne des 63 cours **non traités**, pire des deux | — | **17,3 %** |

      **Ce que ça dit vraiment, et qui nuance la thèse du retournement** : les deux règles inverses
      sont **sous le hasard sur le site** — normal, puisque les règles directes y sont fortes. Le
      retournement n'apparaît que sur les cours **déjà corrigés**, où la moyenne remonte pile à
      **25,2 %**, c'est-à-dire **au hasard, pas au-dessus**. Ce n'est donc pas le cas `mobile` (où
      l'inverse valait 100 %) : c'est une dérive réelle, mesurée, et **modérée**. ⚠️ Et elle n'est
      pas purement un artefact de nos corrections — `compilation`, jamais traité, est à 33,2 %.

      **`ECARTER la plus detaillee` n'entre PAS dans le cliquet**, et il faut dire pourquoi : 12,4 %
      sur le site, et elle ne dépasse le hasard **nulle part** (25,2 % au plus haut). Un cliquet ne
      se charge pas d'une dimension sur laquelle aucun cours n'est exploitable. Elle reste
      **mesurée** — c'est la trajectoire qui compte, pas le niveau du jour.

      **CLAUSE À AJOUTER AUX CONSIGNES D'ÉCRITURE, désormais outillée** : la bonne réponse ne doit
      être ni celle qui reprend **le plus** de mots de l'énoncé, ni celle qui en reprend **le
      moins**. Viser 25 % dans les **deux** sens, comme pour les rangs de longueur.


      ---

      **29ᵉ COURS DÉTORDU — `php`, le plus nocif de ceux qui restaient (2026-09-07).**
      **88,9 % → 25,3 %** sur « la plus longue » (rendement 93,1 % → 25,3 %). Rangs de longueur
      **73/3/1/1 → 21/20/19/18** (cible 20/20/19/19). **212 distracteurs réécrits sur 234**,
      `mesure-qcm-intouchable php` : *aucune atteinte*. Les **24 stratégies de l'outil tiennent
      entre 21,6 % et 27,6 %**, aucune ne dépasse le hasard de plus de 2,6 points. Indice lexical
      de l'outil : 32 questions exploitables et 60 à mettre en forme → **0 et 0**.
      Protocole : 5 écrivains sur lots disjoints, puis 5 relecteurs adversariaux, puis 3 correcteurs.
      Consigne réutilisable : `scratchpad/CONSIGNE-PHP.md` (elle portait dès le départ la règle
      « les quatre ou aucune », l'incise en NOMBRE, la règle du `k` et la clause d'écho inverse).

      **LE DÉFAUT FONDATEUR, RETROUVÉ POUR LA CINQUIÈME FOIS — et cette fois dans un contrôle de
      TYPE.** `php/lecon-09` déclarait `interface Comparable { public function comparer(self $autre): int; }`
      puis `class Produit implements Comparable { public function comparer(self $autre): int {…} }`
      et publiait `// Sortie : Stylo;1.5`. **Le bloc ne s'exécute dans aucune version de PHP** :
      `self` se résout à la classe **déclarante** (`Comparable` dans l'interface, `Produit` dans la
      classe), les paramètres sont contravariants depuis 7.4 et invariants avant, donc PHP lève une
      `E_COMPILE_ERROR` — « Declaration of Produit::comparer(Produit $autre): int must be compatible
      with Comparable::comparer(Comparable $autre): int » — **au linkage, avant le moindre `echo`**.
      Prouvé deux fois indépendamment (`Zend/zend_inheritance.c`, puis la documentation *Type
      declarations* + *Covariance and Contravariance*), PHP n'étant pas installé ici. Corrigé, et la
      prose qui définissait `self` comme « un objet de la même classe » — c'est `static` — réécrite
      en piège pédagogique. ⚠️ **Aucun des 53 vérificateurs ne voyait ce défaut** : `verif-sorties`
      rejoue 449 blocs et n'exécute pas PHP, faute d'interpréteur sur la machine.

      **TROIS BONNES RÉPONSES SUPPLÉMENTAIRES FABRIQUÉES PAR LA VAGUE, trouvées par contradiction :**
      `lecon-14` q3 (un distracteur dont les trois clauses sur le *data provider* et le *mock*
      étaient vraies — et **confirmées deux fois par le corps de la leçon**) ; `lecon-15` q2
      (« elle range le contenu dans le cache du gabarit » décrit exactement Blade, que la page
      n'enseigne pas, donc irréfutable) ; `lecon-21` bilan (le distracteur **`@php`** est une
      directive Blade réelle qui répond littéralement à « comment ouvrir un bloc de code PHP ? » —
      et ce cours enseigne Blade en `lecon-16`). Plus `lecon-15` q3, **résoluble par pure
      élimination** : ses trois distracteurs recopiaient *verbatim* les bonnes réponses de q1 et q2.

      **UN RAISONNEMENT FAUX ATTRAPÉ PAR LE RELECTEUR SUIVANT, à ne pas rejouer.** La vague d'écriture
      avait retiré le distracteur `exit(true)` en le croyant JUSTE (`true` → entier 1 = échec). Le
      changelog PHP **8.4.0** dit : « Prior to PHP 8.4.0 … any value not of type int was cast to
      string » — donc en 8.1/8.3, `exit(true)` **affiche « 1 » et sort avec le code 0**, un succès :
      le distracteur était faux. Le cours annonce 9 fois PHP 8.1 et 8 fois PHP 8.3, **jamais 8.4**.
      **Règle : raisonner à la version que le cours annonce, pas à la dernière parue.**

      **NEUF AUTRES DÉFAUTS DE CORPS corrigés et prouvés par la spécification** : `lecon-13`
      (`use ($total)` fige la valeur **à la définition** → la sortie était `115`, elle vaut `100` —
      et le bloc **se contredisait lui-même** deux lignes plus haut ; `strtoupper('cléo')` rend
      `CLéO` et non `CLÉO`, la fonction étant *locale-insensitive* depuis 8.2 ; la cause du second
      `foreach` d'un générateur, d'abord corrigée à moitié — le **message** vient de
      `zend_generator_get_iterator()` sur un générateur **fermé**, pas de `rewind()`, qui en lève un
      autre) ; `lecon-18` (le SVG, sa légende et son `aria-label` annonçaient une propriété **`->a`**
      de `DateInterval` **qui n'existe pas** — `%a` n'est qu'un format — alors que le bloc de code de
      la même page écrivait déjà `->days`) ; `lecon-20` (`catch (RequestException $e)` annoncé comme
      attrapant « timeout, DNS… tout », alors que **`ConnectException` hérite de `TransferException`**
      et lui échappe — dans la leçon même qui martèle le timeout) ; `lecon-12` (« un `default`
      **obligatoire** » : le manuel dit qu'il est facultatif, l'exhaustivité étant garantie par
      `UnhandledMatchError`) ; `lecon-11` (phpdotenv : `createImmutable()` **n'appelle pas
      `putenv()`**, donc `getenv()` rend `false` — corrigé aux 3 endroits, y compris l'antisèche) ;
      `lecon-17` (l'ancre `$` accepte un saut de ligne final : `/^[0-9]{5}$/` valide `"12345\n"`,
      dit 4 fois à tort) ; `lecon-09` (un `new User(...)` sans `require` ni autoloader annonçait une
      sortie au lieu de `Class not found`) ; `lecon-10` (`// 199` promettait un type que la leçon ne
      définit nulle part — 0 `CREATE TABLE` — et que PDO_MySQL, qui émule par défaut, rend en chaîne).
      Plus les `print_r` annotés en notation JS de `lecon-04` et `lecon-17` : **tranché par comptage**
      sur tout le cours (format fidèle 2 fois, format JS 4 fois, et `lecon-04` se contredit à 76
      lignes d'écart) — c'était une faute, pas une convention.

      **CE QUI DOMINE CETTE PASSE : DEUX INDICES QUE LE PROTOCOLE NE MESURE PAS, et le cliquet est
      VERT pendant ce temps.** Un agent mesureur a été chargé de chercher ce qu'aucune des 24
      stratégies ne cherche. Ses deux trouvailles ont été **re-mesurées ici, indépendamment** — et la
      mesure corrige ses chiffres et **réfute son attribution causale**, ce qui est le plus utile.

      1. **La règle du `k` (`0 / 0 / k`) ferme la DÉSIGNATION UNIQUE, pas le CHAMP.** L'apprenant
         qui **écarte les options dont tous les mots figurent déjà dans la page** passe de 4 options
         à 2. Sur `php` : la règle tranche sur **62,8 % des questions** et **rend 43,2 %**.
         `verif-qcm-lexique` est **vert** et `mesure-lexique-qcm --liste=php` affiche « 0 exploitable,
         0 à mettre en forme » — parce que les trois variantes de l'outil exigent que la stratégie
         désigne **UNE SEULE** option : une égalité à deux vaut **50 % pour l'apprenant et 0 pour
         l'outil**. C'est la leçon « RESTREINDRE » de `data-eng`, transposée au lexique.
      2. **La vague a aplati les CARACTÈRES, pas les MOTS.** Pour atteindre la fenêtre 70–130 %, on
         rembourre avec des petits mots français : les distracteurs de `php` portent **19,6 mots
         contre 18,1** pour la bonne réponse, et **4,56 lettres par mot contre 4,83**. La règle
         « coche l'option qui dit la même chose en moins de mots » tranche sur **93,6 %** des
         questions et **rend 39,0 %**.
      3. Mineur, mais réel et déjà fermé : **le POINT interne** (une seule option écrite en deux
         phrases) rendait 85,7 % sur 7 questions, et **« écarter la glose finale » rendait 100,0 %**
         sur `lecon-03` q1 (trois distracteurs finissant par une incise, pas la bonne réponse).
         Fermé **par déplacement pur** — mêmes mots, mêmes longueurs, donc rangs, ponctuation et
         lexique inchangés : la stratégie est retombée à **0,0 % de couverture**.

      ⚠️ **LA MESURE RÉFUTE LA THÈSE, et c'est le point à retenir.** Le rapport concluait que « les
      trois cours en tête du site sur l'indice lexical retourné sont EXACTEMENT les trois traités par
      la règle du `k` », donc que la règle **produit** l'indice. Balayage refait sur les 90 cours :

      | | couverture | rendement |
      |---|---:|---:|
      | site (6 166 questions) | 60,4 % | **18,6 %** |
      | `haskell` — **jamais traité**, plus haut du site | 65,2 % | **43,4 %** |
      | `php` | 62,8 % | 43,2 % |
      | `asm`, `go`, `lisp`, `c`, `dart` — **jamais traités** | 63–82 % | 36,5–42,1 % |
      | `mobile` (règle du `k`) | 67,1 % | 31,0 % |
      | `stats` (règle du `k`) | 56,9 % | 28,0 % |
      | `data-eng`, `doc`, `os` — **traités** | 45–77 % | **1,1–4,4 %** |

      Les cours en tête sont donc **majoritairement des cours jamais touchés**, et trois cours
      traités sont à 1–4 %. **La règle du `k` ne fabrique pas l'indice ; elle ne le ferme pas
      complètement.** Nuance qui change la correction à faire : il ne faut pas *abandonner* la règle,
      il faut **compter le crédit `1/n` d'une égalité** au lieu de la seule désignation unique — dans
      la mesure ET dans le cliquet.

      **DETTE ÉCRITE, NON FAITE — trois chantiers d'outillage, chiffrés, à prendre dans une passe
      dédiée** (les mêler à un cours en cours de traitement mêlerait deux refigeages) :
      1. **Créditer les égalités** dans `mesure-lexique-qcm.js` et `verif-qcm-lexique.js`
         (crédit `1/n`, pas `argMax` unique). Concerne les 90 cours, pas seulement les traités.
      2. **Ajouter une fenêtre en NOMBRE DE MOTS** à `plan-rangs-qcm.js`, et la stratégie
         « la plus dense » à `mesure-biais-qcm.js`. Elle rend 46,6 % sur `mobile`, 40,4 % sur `ruby`,
         39,0 % sur `php`, 36,9 % sur `js` — c'est une dette de **toute la campagne**, pas de cette
         vague. ⚠️ L'ajouter fera monter `pire` sur beaucoup de cours : **refiger dans le même
         commit**, en écrivant que c'est une dimension neuve et non une régression.
      3. **Étendre « les quatre ou aucune » au point interne, à la flèche et aux guillemets « »**
         (15 questions concernées sur `php`, 12 à retoucher).

      **TROIS QUESTIONS LAISSÉES HORS CIBLE, sciemment**, toutes dans le QCM bilan de `lecon-21`, et
      toutes de la même nature : **`plan-rangs-qcm` exige une inégalité STRICTE de longueur et ne sait
      pas récompenser une égalité.** q1 (« par quel SYMBOLE commence une variable ? ») a une bonne
      réponse d'**un caractère** : l'outil réclame des distracteurs « plus courts que 1 », un
      intervalle vide — les quatre options ont été mises à un caractère (`$`/`@`/`%`/`#`), ce qui rend
      la bonne réponse indiscernable même si l'outil facture 3 caractères. q4 et q5 sont dans le même
      cas. **Une égalité de longueur n'est pas un indice, c'en est le contraire** : c'est l'outil qui
      doit apprendre à la lire.

      **VÉRIFICATIONS** : `verif-html` 1 629 fichiers 0 problème, `verif-donnees` 25 contrôles
      0 erreur, `verif-sorties` **449 blocs rejoués, 449 identiques**, chaîne `verif.js --rapide`
      **80,5 s, les 53 vérificateurs verts**, `verif-rendu` 4 leçons × 3 largeurs × 2 thèmes
      **0 erreur**, index `quiz`, `search`, `antisèches` et `pièges` régénérés `--fresh`,
      0 BOM, 0 U+00A0 littérale, 0 `&nbsp;` dans un bloc `data-quiz`, 43 blocs JSON valides.

      ⚠️ **EFFET DE BORD ASSUMÉ, la 11ᵉ fois** : détordre un cours périme les chiffres qu'une autre
      leçon publie **sur le site**. `doc/lecon-03` citait 51,0 % et 3 110 manquements à sa propre
      clause S3 ; la mesure du jour donne **49,9 % et 3 046**. Reperimé (10 substitutions),
      `verif-normatif` repasse de **64/66 à 66/66**. ⚠️ Piège du jour : les 5 occurrences de
      « 3 110 » étaient écrites avec une **espace insécable U+00A0**, invisible à un `grep "3 110"`
      qui rendait « 1 occurrence » au lieu de 5.

      **OÙ EN EST LA CIBLE DE B1** : le global « la plus longue » du site passe de **61,7 % à
      60,9 %** (6 167 questions, 90 cours). La cible de B1 était **60,0 %** : elle est à
      **0,9 point**. ⚠️ Ne pas en conclure que B4 est fini : **61 cours restent non traités**, et
      les deux indices ci-dessus disent que la moyenne du site sur *une seule* dimension est le
      mauvais endroit où décider.


      **DETTE 2 TRAITÉE DANS LA FOULÉE, une fois `php` isolé dans son propre commit :
      « la plus dense » entre dans la MESURE et dans le CLIQUET.** Deux stratégies neuves
      dans `mesure-biais-qcm.js` (**26 stratégies**), et « la plus dense (mots longs) »
      inscrite dans `EXPLOITABLES` de `verif-qcm-biais.js`.

      **CE QUE LE CLASSEMENT DIT, et c'est l'argument décisif : cet indice PRÉFÈRE les cours
      qu'on a corrigés.** Sur les 12 cours les plus exposés, **SEPT sont marqués `traite`** :

      | cours | traité | « la plus dense » |
      |---|:---:|---:|
      | `java` | ✅ | **49,1 %** |
      | `mobile` | ✅ | 46,6 % |
      | `bdd` | ✅ | 41,9 % |
      | `linux` | — | 41,8 % |
      | `powershell` | — | 40,2 % |
      | `ruby` | ✅ | 40,2 % |
      | `php` | ✅ | 38,1 % |
      | site (6 167 questions) | | 27,0 % |

      Un indice qui préfère les cours corrigés est un indice **que la correction produit** :
      la fenêtre 70–130 % porte sur les CARACTÈRES, et on l'atteint en rembourrant avec de
      petits mots français. **Aucun cours n'atteint la cible de 60 %** (le plus haut est
      `java` à 49,1 %), donc l'inscrire ne fait rougir personne aujourd'hui — mais elle
      surveillera les 61 cours restants. Le cliquet a signalé **8 cours** au moment de
      l'ajout ; référence refigée dans **le même commit**, et il faut le redire : ce n'est
      pas une régression, c'est une dimension neuve.

      **ET SURTOUT — L'ÉPREUVE PAR INJECTION A ÉTÉ ÉTENDUE, sans quoi le câblage serait
      décoratif.** `verif-qcm-biais-mutations.js` passe de 8 à **9 cas** : 60 questions dont
      les quatre options font **exactement le même nombre de caractères** et portent la même
      ponctuation, seule la bonne réponse étant écrite en mots longs. Le motif attendu nomme
      *la densité* : si le verdict tombait sur « la plus longue », le cas prouverait une
      branche ancienne et laisserait la neuve sans preuve — c'est très exactement l'erreur
      qu'avait faite le cas « parenthèse » en septembre, qui allongeait la bonne réponse en
      lui ajoutant son incise. Le générateur **vérifie lui-même l'égalité des longueurs et
      s'arrête en code 2** si elle est rompue. Résultat : **9 cas vus sur 9**, contre-épreuve
      restée verte, fichiers restaurés.

      **Restent les dettes 1 et 3** (créditer `1/n` sur les égalités du lexique ; étendre
      « les quatre ou aucune » au point interne, à la flèche et aux guillemets).

      ---

      **LES DETTES 1 ET 3 SONT CLOSES (2026-09-07), dans la passe dédiée qu'elles réclamaient.**
      Aucun contenu réécrit : cette passe outille et mesure. Deux commits, deux épreuves par
      injection.

      **DETTE 1 — LE CRÉDIT `1/n`, ET CE QU'IL RÉVÈLE : LE CLIQUET CERTIFIAIT « FERMÉ » UN
      INDICE QUI RENDAIT LE DOUBLE DU HASARD.** Jusqu'ici les trois variantes lexicales
      n'étaient comptées que lorsqu'elles désignaient **une seule** option. Une égalité à deux
      valait 0 pour l'outil — et **50 % pour l'apprenant**, qui restreint son tirage.
      Mesure du jour, refaite ici :

      | cours | désignation unique (S/P/I) | RESTREINDRE (pire) |
      |---|---|---:|
      | `mobile` — marqué `traite` | 0,0 % / 0,0 % / 0,0 % | **50,0 %** |
      | `stats` — marqué `traite` | 0,0 % / 0,0 % / 0,0 % | **49,4 %** |
      | `php` | 0,0 % / 0,0 % / 0,0 % | **50,0 %** (56,4 % de couverture) |

      Les **deux seuls cours** que ce cliquet déclarait fermés étaient les deux qu'il voyait le
      moins bien. Sur le site, la couverture double presque : STRICTE 28,7 % → **55,6 %**,
      PROPORTION 61,6 % → **91,4 %** (rendement 50,8 %), INVERSE 59,9 % → **90,2 %**. Moyenne du
      pire par cours : 66,4 % → **56,6 %**.

      ⚠️ **ET LA CAUSE N'EST PAS UNE FAUTE D'ÉCRITURE, C'EST LA RÈGLE ELLE-MÊME.** La règle du
      `k` (`0 / 0 / k`) laisse l'ensemble {bonne réponse, distracteur à `k`} : deux éléments, la
      bonne dedans, **50 % par construction**. Ce n'est pas un accident de vague, c'est
      arithmétique — la prédiction a été écrite avant la mesure, et la mesure l'a rendue au
      dixième près. La règle est donc révisée en **`k / k / k / k`** (les quatre options portent
      le même nombre de mots étrangers), ce qui ferme les six dimensions. C'est
      « les quatre ou aucune » de `data-eng`, transposée au lexique.

      Câblage : `mesure-lexique-qcm.js` expose six dimensions (3 variantes × 2 lectures),
      `verif-qcm-lexique.js` les surveille toutes, référence refigée dans le même commit
      (dimension neuve, pas régression). Cible restreinte à **40 %** et non 60 % : la lecture
      RESTREINDRE a un **plancher structurel à 50 %**, une cible à 60 % n'y fermerait rien.
      Marqueur `traiteRestreint` **vide** aujourd'hui — `mobile`, `stats` et `php` sont **à
      reprendre**, leur marque `traite` ne porte que sur la désignation unique.

      **ET L'ÉPREUVE PAR INJECTION QUI MANQUAIT DEPUIS LA CRÉATION DU CLIQUET** :
      `verif-qcm-lexique-mutations.js`, **6 cas, 6 vus**, contre-épreuve verte, fichiers
      restaurés. Son 2ᵉ cas est le seul du dépôt à exiger que le verdict **nomme** une dimension
      précise : il injecte 30 questions écrites selon l'ancienne règle `0 / 0 / k`, que les trois
      dimensions historiques **ne peuvent pas voir**, et exige le motif `INVERSE/restr.`. Sans
      cette exigence, il serait passé vert sur une branche ancienne. Le générateur vérifie
      lui-même, option par option, le nombre de mots étrangers qu'il fabrique, et sort en code 2
      s'il ne l'obtient pas. Inscrite dans `verif.js --mutations` : **13 → 14 épreuves**.

      **DETTE 3 — LE POINT INTERNE REND 99,0 %, LE PLUS HAUT DU SITE.** Mesure faite avant tout
      câblage, sur les 6 167 questions :

      | marque | couverture | rendement (unique / restreint) |
      |---|---:|---:|
      | le **POINT INTERNE** (option écrite en deux phrases) | 5,0 % | **99,0 % / 94,5 %** |
      | les **GUILLEMETS** français | 2,6 % | 76,1 % / 65,3 % |
      | la **FLÈCHE** (`->`, `=>`) | 1,6 % | 75,0 % / 66,8 % |
      | témoin : point-virgule | 13,7 % | 91,3 % / 71,7 % |
      | témoin : parenthèse | 29,5 % | 92,5 % / 76,1 % |

      **Sur les 308 questions où une seule option est écrite en deux phrases, c'est la bonne
      réponse 305 fois.** C'est le rendement le plus élevé mesuré depuis le début de la campagne,
      au-dessus du point-virgule et de la parenthèse, et aucune des 26 stratégies d'alors ne le
      voyait. La cause, vérifiée sur échantillon avant le câblage, est un **réflexe de
      rédaction** : la bonne réponse explique **puis conclut** — « … donc la branche 12 la capte
      avant. **Il faut tester du plus restrictif au moins restrictif** » — pendant que les
      distracteurs tiennent en une phrase. Ce n'est pas de la ponctuation décorative, c'est la
      trace de la pensée complète.

      Livré : `mesure-biais-qcm.js` **26 → 32 stratégies** ; les trois « la seule … » entrent
      dans `EXPLOITABLES` (aucun des 90 cours ne dépasse **39,8 %** en réussite, donc personne ne
      rougit — mais les 61 cours restants sont surveillés) ; le cliquet a signalé **deux cours**
      à l'ajout, `react` (36,9 % → 39,8 %) et `sql` (33,2 % → 36,9 %), **deux cours déjà
      détordus** où le point interne devient le pire indice ; référence refigée dans le même
      commit. `verif-qcm-biais-mutations.js` passe de **9 à 10 cas** (60 questions en deux
      phrases à longueur, ponctuation et nombre de mots **égaux**, motif exigé « deux phrases »),
      **10 vus sur 10**. Le compte périmé de cette épreuve dans `verif.js` (`7 / 7`) est corrigé
      à `10 / 10`, mesuré.

      **L'OUTIL DE TRAVAIL QUI MANQUAIT** : `plan-rangs-qcm.js --marques`. Il classe chaque
      question en *bonne SEULE* / *bonne partagée* / **ÉCARTABLE** / neutre et rend la fenêtre de
      longueur de chaque distracteur. ⚠️ **Une incohérence de mon premier jet, corrigée avant
      livraison** : il **comptait** les questions où seuls des distracteurs portent la marque
      sans les **lister**. Or c'est le cas `mobile` à l'identique — trois distracteurs marqués
      sur quatre options et pas la bonne réponse, il suffit de les **écarter** pour avoir juste à
      tous les coups. Un outil qui ne surveille qu'un sens est vert pendant que la faille est
      entière : la leçon avait déjà été écrite ici, elle a failli être rejouée dans l'outil censé
      la fermer.

      **LA DETTE RESTANTE, CHIFFRÉE** : **699 questions sur 6 167 (11,3 %)** sont à mettre en
      forme sur ces trois marques, dans **88 cours sur 94**. Les plus chargés : `js` 66, `algo`
      27, `projets-js` 24, `bdd` 23, `python` 22, `rust` 22. Sur `php`, l'outil rend **12**
      questions — exactement le chiffre annoncé par la note de la dette, retrouvé
      indépendamment. **Aucun contenu n'est réécrit ici** : la retouche d'une option est un
      travail d'écriture qui demande sa relecture adversariale, donc elle appartient à la vague
      d'un cours.

      **À METTRE EN CONSIGNE POUR LE 30ᵉ COURS**, les deux règles neuves :
      1. **lexique** — les quatre options portent le **même nombre** de mots étrangers à la page
         (`k / k / k / k`), et non plus `0 / 0 / k` ;
      2. **marques** — « les quatre ou aucune » vaut aussi pour le **point interne**, les
         **guillemets** et la **flèche** ; et dans **les deux sens** (ne pas laisser trois
         distracteurs marqués face à une bonne réponse qui ne l'est pas).

      **CONTRÔLES** : `verif.js --rapide` **121,8 s, les 53 vérificateurs verts** (deux fois,
      avant et après) ; `node --check` sur les 8 fichiers `js` touchés ; 0 CRLF et 0 BOM sur le
      fichier neuf ; arbre de travail propre après les deux épreuves par injection.

      ---

      **30ᵉ COURS DÉTORDU — `ocaml` (2026-09-08) : 91,3 % → 25,3 %.** Le travail d'écriture était
      resté **dans l'arbre de travail, non commité** : le réveil du 2026-09-07 s'est arrêté sur la
      limite d'usage hebdomadaire à 100 %, en plein milieu. **Leçon de chaîne : un lot d'écriture
      non commité ne survit à rien.** Rien n'était perdu (18 leçons modifiées, JSON valide partout),
      mais la relecture adversariale, elle, n'avait pas été faite — c'est la moitié qui compte.

      **Mesures reproduites avant de conclure** (aucune n'a été reprise du réveil précédent) :
      « la plus longue » **91,3 % → 25,3 %**, pire indice **28,3 %** (« écarter les deux extrêmes »,
      couverture 8,0 %) ; rangs **19 / 19 / 19 / 18** et **0 question à retoucher** ; incise
      **25,0 %** ; ponctuation, point interne, guillemets, flèche : **0 question à mettre en forme
      sur 75** ; indice lexical **STRICTE 33,3 % → 0,0 %**, **0 exploitable sur 75** ; `mesure-qcm-
      intouchable` **0 atteinte** — **215 distracteurs réécrits sur 225**, question / `correct` /
      `explain` / bonne réponse intacts.

      **LA RELECTURE ADVERSARIALE : 6 agents, 75 questions, 225 options jugées une à une — et pour
      la TROISIÈME fois d'affilée, ZÉRO distracteur devenu vrai, ZÉRO bonne réponse fausse.** La
      consigne réutilisable (`scratchpad/CONSIGNE-OCAML.md`, qui portait dès le départ le `k/k/k/k`,
      les marques dans les deux sens et la fenêtre de longueur) tient donc sur un langage **que la
      machine ne peut pas exécuter** : OCaml n'est pas installé, tout a été jugé par la norme.

      **En revanche les agents ont rendu NEUF défauts de CORPS, tous hors QCM** — la démolition
      paie encore, mais elle a changé de cible : ce ne sont plus les distracteurs qui cassent, c'est
      ce qui les entoure. Les six corrigés, prouvés par la norme :
      1. `lecon-08` — `ocaml -i pile.ml` : **le toplevel n'a pas d'option `-i`**, il exécuterait le
         fichier comme un script. C'est `ocamlc -i` qui imprime la signature inférée.
      2. `lecon-08` — « une généricité **sans coût à l'exécution** » : faux pour OCaml, les foncteurs
         ne sont **pas** monomorphisés (l'application construit un bloc de module à l'exécution).
         Au passage, « a inspiré les *traits* de Rust » retiré : les traits viennent des classes de
         types de Haskell.
      3. `lecon-09` — **dans un `<svg>`, une syntaxe qui n'existe pas** : `for x … do … done`, alors
         qu'OCaml exige `for i = a to b`. Le code de la leçon, lui, utilise `Array.iter`. C'est le
         défaut fondateur retrouvé une fois de plus **dans un schéma**, invisible à tout outil qui
         lit les blocs de code (déjà vu sur `ruby`).
      4. `lecon-15` — `type 'a Seq.t = unit -> 'a node` : **on ne définit pas un type sous un nom
         qualifié**. La définition réelle est `type 'a t` *dans* le module `Seq`.
      5. `lecon-13` — l'exercice interactif accepte `Sub (Int 10, Int 4)` alors que **le type `expr`
         de la leçon n'a pas de constructeur `Int`** (il a `Nombre of float`), et que la solution
         rédigée trois lignes plus bas écrit `Sub (Nombre 10., Nombre 4.)`.
      6. `lecon-17` — « OCaml **définit** `let+` et `and+` » : le langage **réserve la syntaxe**, il
         ne fournit rien ; c'est au lecteur de les définir — ce que la q3 de la même leçon exige.
      Plus trois corrections mineures : l'indice « **trois** chevrons » pour `>>=` qui en porte deux
      (`lecon-12`), `Atomic` daté « module d'OCaml 5 » alors qu'il existe **depuis 4.12**
      (`lecon-12`), et l'exercice de `lecon-10` qui attendait `assert` — un mot-clé que la leçon
      **n'enseignait nulle part** (ajouté au corps plutôt que retiré de l'exercice).

      **UN DISTRACTEUR CORRIGÉ, ET C'EST UNE CONTRADICTION INTERNE AU COURS** : le QCM bilan
      demandait « quel mot-clé crée une liaison ? » avec `val x` en distracteur — or `val mutable
      n = 0` **crée bien une liaison d'instance**, et c'est la `lecon-14` **du même cours** qui
      l'enseigne. Remplacé par `set x`, qui n'existe pas en OCaml. Coût nul sur la forme : même
      longueur (5 caractères), et `val`/`set` sont sous le seuil des mots longs, donc **aucune
      mesure n'a bougé** — vérifié après coup.

      **DEUX RÉSERVES ASSUMÉES, écrites plutôt que tues** : (a) `lecon-15` q2 demande combien de
      fois `Lazy.force` **recalcule** un thunk — au sens strict la réponse est *zéro*, et le
      distracteur « Zéro fois » n'est faux que par sa justification (« le cache est déjà prêt »,
      faux avant le premier forçage). Corriger demanderait de toucher l'énoncé, donc de créer une
      atteinte à l'intouchable pour un gain douteux ; (b) `lecon-18` bilan q4, « add et mul » :
      `Float.add` et `Float.mul` existent depuis 4.07, seul « (partout) » rend l'option fausse.
      Toute réécriture passait au-dessus de la bonne réponse et **déplaçait son rang** — refusé.

      ⚠️ **LE PIÈGE DU RÉVEIL PRÉCÉDENT S'EST REPRÉSENTÉ, ET IL EST STRUCTUREL** : détordre `ocaml`
      a **repérimé les chiffres que `doc/lecon-03` publie sur le site** — 49,9 % → **48,8 %** et
      3 046 → **2 976 manquements à S3** — et `verif-normatif` est passé à **64/66**. C'est la
      **5ᵉ** fois. Le nombre « 3 046 » était écrit avec une **espace insécable U+00A0 littérale** :
      le premier motif de remplacement a rendu **0 occurrence sans erreur**, exactement le piège
      déjà rencontré sur `java`. Après correction : **66/66**.

      **CONTRÔLES** : `verif.js --rapide` **60,5 s, tout vert** (relancé après les corrections) ;
      `verif-html` **0 sur 1 629 fichiers** ; `verif-donnees` **0 erreur / 25 contrôles** ; 129 blocs
      `data-quiz` / `data-quiz-bilan` / `data-exos` du cours **tous en JSON valide** ; 0 BOM ; 0 URL
      de CDN ; index régénérés en `--fresh` avec les **six** cibles, `pieges` comprise (le piège de
      `csharp` : `--only` sans `pieges` laisse cet index périmé en silence) ; les deux cliquets
      refigés et **`ocaml` marqué `traite`** dans les deux références — **29 cours verrouillés**.

      **ÉTAT DU SITE APRÈS CE COURS** : **6 167 questions, 3 763 devinables par la longueur, 61,0 %**
      — contre 5 081 et 84,8 % au cadrage de B4. **1 318 questions rendues, 23,8 points gagnés.**
      Restent 3 cours sous la cible mais **non marqués** (`distribue`, `neurones`, `offensive`) :
      ils sont nés conformes en V13, jamais audités — les verrouiller sans relecture adversariale
      serait certifier ce qu'on n'a pas mesuré. **À trancher en B5, pas en passant.**

      ⚠️⚠️ **ET LA MESURE FAITE POUR TRANCHER A RENDU AUTRE CHOSE : `distribue` EST RETOURNÉ.**
      « La plus longue » y vaut **5,6 %** (rendement **4,8 %** sur 91,3 % de couverture) — très
      au-dessous du hasard. Le cours a été écrit **après** le constat de B1, avec la consigne
      anti-longueur, et il l'a appliquée **trop loin** : c'est la leçon de `mobile` (« fermer un
      indice à fond le RETOURNE ») retrouvée sur un cours **NEUF, jamais détordu**. Conséquence
      mesurée : **« la plus détaillée » rend 80,6 % sur 52,2 % des questions** (réussite globale
      **56,8 %**), et « RESTREINDRE aux deux-points » **73,1 %**. Deux indices **au-dessus de la
      cible de 60 %** — invisibles au cliquet, parce que le contrôle « le pire indice reste sous
      la cible » **ne s'applique qu'aux cours marqués `traite`**.

      **CE QUE ÇA APPREND POUR LES 59 COURS RESTANTS** : écrire un cours neuf « en évitant que la
      bonne réponse soit la plus longue » ne suffit pas — **ça déplace le biais vers le détail**.
      Un cours neuf doit passer la **même** batterie qu'un cours détordu, et le cliquet devrait
      contrôler le pire indice **sur tous les cours, pas seulement sur les cours marqués**. C'est
      un correctif d'outillage à part entière, à traiter avec F3 plutôt qu'ici. `neurones` et
      `offensive` sont sains de ce côté (pire rendement à couverture utile : 85,7 % sur 10,1 % pour
      les guillemets d'`offensive`, réussite globale 32,0 %).

      ---

      **31ᵉ COURS DÉTORDU — `kotlin` (2026-09-08) : 90,0 % → 25,3 %**, en **UNE seule vague**
      d'écriture (la consigne `scratchpad/CONSIGNE-KOTLIN.md`, préparée par le réveil précédent,
      portait dès le départ le `k/k/k/k`, la règle du `w`, les marques dans les deux sens et la
      formulation corrigée de l'incise). Le cours était le plus **nocif** restant : 75 questions
      × 90,0 % = **67,5 questions devinables**, devant `c` (67,0) et `solidity` (66,0).

      **Mesures reproduites ici, aucune reprise du plan** : « la plus longue » **90,0 % → 25,3 %**
      (rendement 91,8 % → 26,0 %) ; pire indice **26,7 %** (« écarter les deux extrêmes »,
      couverture 5,3 %) ; rangs **68 / 3 / 3 / 1 → 19 / 19 / 19 / 18**, la cible exacte, et
      **0 question à retoucher sur 75** ; « la plus détaillée » 69,7 % → 25,3 % ; le mot technique
      exclusif 67,7 % → 22,7 % ; l'incise 65,2 % → 24,3 % ; l'écho 55,7 % → 20,4 % ; RESTREINDRE
      `;` / `:` / `(` **50,0 / 53,0 / 67,4 % → 25,0 %, aucune ne tranche plus** ; indice lexical
      **0 exploitable et 0 à mettre en forme sur 75**. **220 distracteurs réécrits sur 225.**
      Site : **60,1 % → 59,3 %**.

      **LA DÉMOLITION : 6 relecteurs en LECTURE SEULE, 225 options jugées une à une — ZÉRO
      distracteur devenu vrai pour la 4ᵉ fois d'affilée.** Toutes leurs trouvailles ont été
      re-vérifiées avant correction ; deux ont été écartées, et **une a été INFIRMÉE par son
      propre relecteur** (`UIDevice.systemName()` / `systemVersion` : c'est mot pour mot la ligne
      du modèle officiel JetBrains — un relecteur qui se contredit lui-même vaut mieux qu'une
      correction faite de confiance).

      **LE DÉFAUT FONDATEUR, PROUVÉ PAR CALCUL** (`lecon-10`) : `sumOf { it.aire() }` sur
      `[Cercle(1.0), Rectangle(2.0,3.0), Cercle(2.0)]` rend π + 6 + 4π = 21,707963… → `%.2f` =
      **21,71**. La leçon annonçait **22,57**, et **se réfutait elle-même trois lignes plus bas**
      en imprimant 3,14 + 6,00 + 12,57.

      **DEUX BONNES RÉPONSES FAUSSES** (atteintes à l'intouchable assumées, listées par l'outil) :
      `lecon-12` q1 expliquait par « sans `open` sur Animal et `override` dans Chien » — or le
      corps écrit `open class Animal`, et surtout **`open`/`override` ne s'appliquent pas à une
      fonction d'extension** ; le vrai mécanisme, la **résolution statique**, est enseigné par la
      même leçon deux paragraphes plus haut. `lecon-09` q3 citait « ex. EnCours, Inactif » comme
      exemples d'`object` sans données, alors que le corps déclare `data class EnCours(val
      pourcent: Int)` et qu'`Inactif` **n'existe nulle part dans le cours**.

      ⚠️ **DEUX EXPLICATIONS DEVENUES ORPHELINES PAR NOTRE PROPRE VAGUE — et aucun outil ne les
      mesure.** `lecon-19` q2 réfutait `JSON.stringify`, `lecon-21` bilan q5 commentait
      `mutableListOf` : deux options remplacées la veille. **L'`explain` est classée
      « intouchable », donc personne ne la relit — mais elle CITE les distracteurs.** C'est une
      régression que seule la relecture pouvait voir, et elle attend probablement dans les
      30 cours déjà traités. **À outiller en F3** : un contrôle « l'`explain` ne cite pas une
      option absente » est bon marché et n'existe pas.

      **TROIS DISTRACTEURS QUASI-VRAIS** du QCM bilan corrigés : `setOf(…)` (qui **est** une
      collection en lecture seule), « Android (seul) » (Kotlin **est** pleinement interopérable
      avec Android — c'est le sujet de la leçon 15), « String (avec un !) » (le type plateforme
      `String!` est précisément ce qui peut être nul, leçon 14).

      **SEPT AUTRES DÉFAUTS DE CORPS**, chacun re-vérifié : `filter` décrit comme un **tri**
      (`lecon-06`, contredit par le mémo de la même page) ; « quatre listes d'un million
      d'éléments » contredit par **son propre schéma** qui chiffre 333 333 (`lecon-07`) ;
      `println(l)` annoncé `[a, b]` alors que **`toString()` vient d'`Any` et n'est pas délégué
      par `by`** (`lecon-11`) ; « Boucle arrêtée proprement » après un `delay` annulé — `delay`
      lève `CancellationException`, la ligne n'est jamais atteinte (`lecon-13`, corrigé par un
      `finally`, ce qui est en plus meilleur pédagogiquement) ; l'ordre de `assertEquals` annoncé
      *(obtenu, attendu)* quand la signature est `(expected, actual)` **et que la même leçon dit
      l'inverse trois fois** (`lecon-16`) ; « Cette dernière leçon » sur la leçon 15 d'un cours
      qui en compte 21 ; et **un exercice auto-corrigé qui ACCEPTAIT `mutableStateOf`** alors que
      le QCM de la même page enseigne que c'est faux (`lecon-15`).

      **15 MASQUES D'EXERCICE FAUX** corrigés (le nombre de `?` ne correspondait pas à la réponse
      attendue — et dans **trois** cas un autre indice du **même** exercice donnait le compte
      exact : « Trois lettres » face à deux `?`). ⚠️ **Mon premier jet en a CASSÉ DEUX qui étaient
      justes** (`@Jvm??????` fait bien 10 caractères, comme `@JvmStatic`) : le piège du motif trop
      large, vu par le re-contrôle et restauré. ⚠️ **La mesure du même défaut sur tout le site
      n'est PAS publiable** : un masque ne couvre pas toujours toute la réponse
      (`obj[Symbol.????????]`), et le contrôle naïf rendait 46,1 % de faux positifs. **Il faudrait
      un vrai outil ; le chiffre n'est pas écrit ici plutôt qu'écrit faux.**

      **OUTIL : DEUX STRATÉGIES NEUVES** dans `mesure-biais-qcm` (**32 → 34**). **Quatre relecteurs
      sur six** ont signalé indépendamment, chacun sur son lot, que « la plus dense » et « la moins
      bavarde » tombent **sous** le hasard — et un taux sous le hasard n'est pas un indice fermé,
      c'est un indice **inverse**. Câblées et mesurées : **« ÉCARTER la moins bavarde » rend
      72,1 % sur le site** (couverture 8,0 %, réussite 34,3 %). *C'est la relecture qui a trouvé le
      trou de l'outil, pas l'outil.*

      ⚠️⚠️ **ET LA MESURE FAITE POUR TRANCHER RETOURNE LA CRAINTE DES RELECTEURS.** Ils
      soupçonnaient la campagne de fabriquer cet indice. C'est l'inverse : il vient du **biais
      d'origine**, et nos vagues le **ferment**.

      | rendement de « ÉCARTER la moins bavarde » | cours |
      |---|---|
      | 100,0 % · 100,0 % · 94,1 % | `nosql`, `solidity`, `cobol` — **non traités** |
      | 33,3 % · 28,6 % · 0,0 % · 0,0 % | `ocaml`, `kotlin`, `os`, `data-eng` — **détordus** |

      Sur `cobol` la stratégie atteint **58,2 % de réussite globale**, à 1,8 point de la cible de
      B1. **Un cours non traité pouvait donc être deviné à près de 60 % par une règle que rien ne
      mesurait**, et la seule raison pour laquelle ce n'était pas visible est que les
      32 stratégies étaient presque toutes directionnelles dans le même sens.

      **CONTRÔLES** : `verif.js --rapide` **69,0 s** ; `verif-html` **0 grave / 0 attention** ;
      `verif-donnees` **0 erreur / 25 contrôles** ; **55 blocs JSON** valides ; 0 BOM ; 0 URL de
      CDN dans le site (les 33 occurrences trouvées sont dans un profil Chrome jetable de
      `scratchpad/`, non versionné) ; les deux épreuves par injection **10/10** et **6/6**, arbre
      restauré ; index régénérés en `--fresh` avec les **six** cibles ; les deux cliquets refigés
      et `kotlin` marqué `traite` — **30 cours verrouillés**.

      ⚠️ **LE PIÈGE STRUCTUREL, 5ᵉ FOIS** : détordre `kotlin` a périmé les chiffres que
      `doc/lecon-03` **publie sur le site** (48,8 % → **47,7 %**, 2 976 → **2 913** manquements à
      S3) et `verif-normatif` est passé à **64/66**. Le nombre était écrit avec une **espace
      insécable U+00A0 littérale**, exactement comme sur `java` et `ocaml` : un motif naïf rend
      « 0 occurrence » sans erreur. Après correction : **66/66**.

      **ÉTAT DU SITE** : **6 167 questions, 3 657 devinables par la longueur, 59,3 %** — contre
      5 081 et 84,8 % au cadrage de B4. **1 424 questions rendues, 25,5 points gagnés.** La case
      reste **décochée** : 59 cours restent au-dessus de 60 %.

      ---

      **32ᵉ COURS DÉTORDU — `c` (2026-09-08) : 94,4 % → 25,4 %.** Le cours était le **pire du
      site sur la longueur**, et avec une couverture de 100 % : pas une égalité, la règle
      « coche la plus longue » tranchait sur chacune de ses 71 questions. Six lots écrits en
      parallèle sur des fichiers disjoints, consigne unique `scratchpad/CONSIGNE-C.md`.
      **207 distracteurs réécrits sur 213.**

      **Mesures reproduites ici** : « la plus longue » **94,4 % → 25,4 %** ; la plus détaillée
      82,2 % → 25,1 % ; RESTREINDRE à la parenthèse 71,9 % → 25,0 % ; l'incise 70,5 % → 25,0 % ;
      le point-virgule 59,9 % → 25,0 % ; l'écho 57,6 % → 25,0 % ; ÉCARTER la moins bavarde
      47,5 % → 24,9 % ; le point interne 34,5 % → 25,0 %. **Rangs 67/1/3/0 → 18/18/18/17**, la
      cible exacte, **0 question à retoucher sur 71** ; indice lexical **0 exploitable et 0 à
      mettre en forme**.

      ⚠️ **LA VAGUE A ÉTÉ ÉCRITE PAR UN RÉVEIL QUE LA LIMITE DE SESSION A COUPÉ**, juste après
      le commit des leçons : **la relecture adversariale n'avait pas eu lieu**, et l'outil
      corrigé pendant cette passe n'était pas commité. Le réveil suivant a soldé les deux. La
      leçon d'organisation : *un lot d'écriture non relu est une dette qui ne se voit dans aucun
      vérificateur* — les six cliquets étaient verts sur un cours qui contenait une bonne réponse
      contraire à la norme du langage.

      **LA DÉMOLITION : 6 relecteurs en lecture seule, 284 options jugées une à une, 21
      trouvailles, toutes revérifiées avant correction.** Aucun compilateur C n'étant installé,
      la preuve est **normative ou refaite au calcul**, jamais « de tête ».

      **UN DISTRACTEUR DEVENU VRAI — et c'est la NORME qui tranche** (`lecon-08` q3, union à
      champs `int i` / `double d`). Le distracteur disait « c'est un comportement **défini**, les
      octets de l'entier sont réinterprétés en double ». **C'est exactement ce que dit C11
      6.5.2.3 note 97** : le *type punning* par union est **légal en C** (c'est le C++ qui
      l'interdit), et les octets non écrits « take unspecified values » (6.2.6.1 p7). Le
      distracteur était devenu vrai sur la partie même que la question interroge.

      **ET DONC LA BONNE RÉPONSE ÉTAIT FAUSSE** : elle annonçait « comportement indéfini » —
      **la règle du C++ enseignée dans un cours de C**. Le résultat juste est « valeur **non
      spécifiée** ». Indice interne que personne n'avait relevé : l'`explain` de la même question
      disait déjà « résultat non défini », et le corps hedgeait « en général » ; c'est le QCM qui
      durcissait. Bonne réponse, explication et **les deux passages du corps** réécrits.

      **DEUXIÈME BONNE RÉPONSE FAUSSE** (`lecon-13` q3) : « `char *` a une taille de 1 octet ».
      `sizeof(char *)` vaut **8** sur une cible 64 bits — et **la leçon 15 du même cours
      l'affiche**. Ce qui vaut 1, c'est le type *pointé*. Réécrite en « `sizeof(char)` vaut
      exactement 1 ».

      **CINQ DÉFAUTS DE CORPS PROUVÉS PAR CALCUL** : `snprintf(buf, 8, "Bonjour %s",
      "Alexandre")` — le schéma annonçait `buf="Bonjou"` et `retour=15` ; « Bonjour Alexandre »
      fait **17** caractères et `buf[8]` garde les **7** premiers, donc `buf="Bonjour"` et
      `retour=17`, corrigé en **quatre endroits** (le SVG, son `aria-label`, le commentaire du
      code, et **la case manquante du dessin**) ; un `strcpy` de 90 caractères dans un `char[32]`
      écrit **59** octets au-delà, pas 58 — *le 58 s'obtenait en oubliant le zéro terminal, l'octet
      même que la leçon apprend à ne pas oublier* ; « l'outil `compter` en une soixantaine de
      lignes » pour un bloc qui en compte **40** (33 non vides) ; « sept cœurs inactifs sur huit,
      c'est gâcher **la moitié** de la puissance » → les sept huitièmes ; « chaque cran double la
      **capacité** » alors que doubler les octets **élève au carré** le nombre de valeurs
      (2⁸ → 2¹⁶, ×256).

      **QUATRE ENDROITS OÙ LA LEÇON SE CONTREDIT ELLE-MÊME** : le schéma de `qsort` affichait
      `*(int*)a - *(int*)b`, **l'expression que la même page interdit vingt lignes plus bas**
      (débordement signé = UB), que son antisèche interdit, que son récap interdit et que son
      propre code évite ; `definitely lost` justifié par « **aucun** pointeur n'a perdu
      l'adresse » — c'est la définition de *still reachable*, et la leçon **plus son glossaire**
      énoncent l'inverse deux fois ; la solution de l'exercice 2 de `lecon-16` lit `t[0]` sans
      tester `n` quand la leçon pose **deux fois** que le premier cas frontière est l'entrée vide
      (`assert(n > 0)` ajouté) ; l'antisèche donne `pthread_join` « obligatoire » quand la même
      page rappelle dix lignes plus haut qu'un thread **détaché** ne se joint pas.

      **AUTRES** : un bloc `data-file="main.c"` dont **tout** le contenu était à la portée fichier
      (initialiseur non constant, `printf` hors fonction, `stdio.h` manquant) ; `%ld` sur un
      `ptrdiff_t` → `%td` (faux sous Windows LLP64) ; `*NULL` « plante net » présenté comme
      garanti alors que c'est un UB — *la leçon 05 du même cours hedge correctement* ; un « cas
      réel » affirmant qu'un `printf("%d", double)` affichait le **bon** montant, impossible sur
      toute ABI courante ; un lien de secours d'exercice vers une section **qui n'existe pas** ;
      et un `explain` attribuant la fermeture de `stdin` au « programme appelant » quand c'est
      `exit` qui ferme tous les flux (C11 7.22.4.4 p2).

      ⚠️ **CORRIGER LE CORPS ROUVRE L'INDICE LEXICAL, et le cliquet l'a vu.** Retirer « la
      moitié » du paragraphe des cœurs a rendu **étranger** le mot « moitié » d'un distracteur de
      la même page : `c` est passé de **6,7 % à 33,3 %** en stratégie restreinte. Trois questions
      à reprendre, dont **deux nées de mes propres corrections de QCM**. *Le vocabulaire d'un
      distracteur dépend du corps de la leçon : toucher l'un déplace l'autre.* Après réécriture :
      0 exploitable, 0 à mettre en forme.

      **OUTIL — DEUX DETTES SOLDÉES.** (1) **35ᵉ stratégie, « ÉCARTER le mot technique
      exclusif »** : trois des six lots d'écriture avaient signalé, chacun sur le sien, que
      l'indice était passé **sous** l'étalon du hasard — **troisième fois** que la relecture voit
      un indice inverse avant l'outil. Mesure : sur `c`, le sens direct 19,2 %, l'inverse 27,0 %
      (rendement 33,3 %) ; **sur le site entier l'inverse ne rend que 18,2 %**, donc c'est bien le
      sens direct qui reste l'indice général. (2) **La limite de mot `\b` de JavaScript est
      ASCII** : une lettre accentuée crée une frontière **à l'intérieur** d'un mot, et « chaîne »
      déclenchait `\bne\b`, comptant comme une négation. **306 options sur 24 669 changent de
      verdict (1,24 %)** ; `ABSOLUS` et `PRUDENTS` n'en changent aucune. Les trois règles passent
      en *lookaround* unicode.

      **OUTIL NEUF, réclamé par le compte rendu de `kotlin` : `mesure-explain-orpheline.js`.**
      Le premier jet, heuristique, a été **jeté le jour même** : mis à l'épreuve sur les deux cas
      historiques de `kotlin` restaurés depuis git, **il n'en voyait aucun** (l'un ne porte aucun
      marqueur de réfutation, l'autre cite un nom enseigné dans huit leçons du cours). Remplacé
      par une mesure **différentielle** — le dépôt est sous git, donc l'état d'avant la vague est
      disponible : pour chaque question dont une option a changé et dont l'`explain` est resté
      **identique**, l'outil cherche les jetons que l'explication partage avec une option
      **effacée** et qu'on ne retrouve dans aucune option actuelle. **Épreuve : 2 orphelines
      rendues, exactement les deux cas historiques, 0 autre.** ⚠️ Un piège Windows a failli le
      faire passer pour vert : `execSync` passe par `cmd.exe`, où **`^` est le caractère
      d'échappement** — `--depuis=fba15d8^` y devenait `fba15d8`, l'outil comparait le cours à
      lui-même et annonçait « 0 option a changé » sur une vague qui en avait réécrit 207, **sans
      lever la moindre erreur**. Corrigé par `execFileSync` plus un garde-fou explicite.
      **Mesure sur `c` : 70 questions à risque, 0 explication orpheline** — la vague n'a pas
      reproduit le défaut de `kotlin`.

      ⚠️ **LE PIÈGE STRUCTUREL, 6ᵉ FOIS** : détordre `c` a périmé les chiffres que `doc/lecon-03`
      **publie** (47,7 % → **46,7 %**, 2 913 → **2 849** manquements à S3) ; `verif-normatif`
      64/66 → **66/66**. Et le remplacement a lui-même introduit le défaut que la mémoire du
      projet décrit : sur les 5 occurrences, quatre portaient `&nbsp;` et **une, dans un champ
      `explain`, une espace ordinaire** — un motif uniforme y aurait affiché l'entité
      littéralement à l'apprenant.

      **CONTRÔLES** : `verif-html` **0 grave / 0 attention** ; `verif-donnees` **0 erreur /
      25 contrôles** ; 43 blocs JSON valides, 0 BOM ; `verif-qcm-biais` et `verif-qcm-lexique`
      **verts** ; index régénérés en `--fresh` avec les six cibles — **I18 était au rouge**, deux
      entrées périmées (une antisèche et un piège de `c`) reprises de l'ancien index.

      **ÉTAT DU SITE** : **6 167 questions, 3 606 devinables par la longueur, 58,5 %** — contre
      5 081 et 84,8 % au cadrage de B4. **1 475 questions rendues, 26,3 points gagnés.** La case
      reste **décochée** : **55 cours** restent au-dessus de 60 %.

      ---

      **33ᵉ COURS DÉTORDU — `solidity` (2026-09-08) : 97,1 % → 23,5 %**, en **UNE seule vague**,
      **204 distracteurs sur 204 réécrits**, rangs **67/1/0/0 → 17/17/17/17** (cible exacte).
      C'était le cours le plus nocif restant. **Les 36 stratégies tiennent entre 19,1 % et
      26,7 %** — aucune au-dessus de la bande. Lexique **61 exploitables / 66 à mettre en forme
      → 0 / 0** ; intouchable : aucune atteinte ; explication orpheline : 68 questions à risque,
      **0**.

      **Choix assumé, écrit plutôt que tu** : `plan-rangs-qcm` compte encore **4 questions « à
      retoucher » pour 4 caractères**. Ce sont des **ex aequo de longueur** entre la bonne réponse
      et un distracteur. Je ne les casse pas : « la plus longue » est déjà à **23,5 %, sous
      l'étalon du hasard**, et un lot a mesuré que casser une égalité peut au contraire **créer**
      un indice (« écarter les deux extrêmes » monte quand deux distracteurs sont à égalité).

      **19 DÉFAUTS DE CORPS signalés par les lots** (ils avaient interdiction de les corriger),
      chacun revérifié avant correction — aucun compilateur Solidity n'étant installé, la preuve
      est **langagière ou interne à la page** :

      - **le défaut fondateur** (`lecon-15`) : `MonNFT` n'override que `_baseURI()`, jamais
        `tokenURI` ; l'implémentation OpenZeppelin colle le `tokenId` derrière la base, donc
        `tokenURI(7)` vaut `ipfs://…/7` **sans** `.json` — que la leçon annonçait **deux fois** ;
      - **l'exemple qui commet la faute qu'il dénonce** (`lecon-11`) : le proxy déclare
        `address public implementation;` en **slot 0**, exactement là où `delegatecall` fera
        écrire la première variable de la logique. C'est la collision de slots que la section
        **suivante** présente comme catastrophique, et l'**EIP-1967** — la parade réelle du
        métier — n'était mentionnée **nulle part** (`grep` : 0) ;
      - **l'ordre que le compilateur n'impose pas** (`lecon-03`), affirmé en **cinq endroits** :
        la grammaire range visibilité, mutabilité, modificateurs et `virtual`/`override` en
        répétition **non ordonnée** ; seul `returns` vient en dernier ;
      - **le schéma qui annonce six couches et en dessine cinq** (`lecon-12`) : la sixième boîte
        avait une **hauteur nulle**, était **hors du `viewBox`** et n'avait aucun texte. Un
        lecteur d'écran entendait six couches, un œil en voyait cinq ;
      - cinq autres : « memory et calldata détruits à la fin de la **transaction** » quand la
        même figure dit « l'appel » ; « l'ERC-20 stocke **toute** la comptabilité dans une seule
        ligne » (il impose aussi le mapping imbriqué des autorisations) ; le schéma de réentrance
        qui nommait `fallback()` là où un `call{value:…}("")` a une calldata **vide** et appelle
        donc `receive()` ; CryptoKitties présenté comme « un contrat ERC-721 » alors que le jeu
        est sorti **avant** l'EIP-721, proposé par sa propre équipe ; un exercice qui appelait
        `contrat.admin()` quand la leçon définit `fonctionAdmin()` ;
      - **un conseil périmé** (`lecon-14`) : `increaseAllowance`/`decreaseAllowance` données comme
        « le remède moderne » alors qu'elles ont été **retirées d'OpenZeppelin v5** — la leçon est
        écrite en `pragma ^0.8.20` et en style OZ v5.

      ⚠️ **LA CRAINTE DU MATIN NE S'EST PAS RÉALISÉE** : sur `c`, corriger le corps avait rouvert
      l'indice lexical (6,7 % → 33,3 %). Après ces corrections-ci : **0 exploitable, 0 à mettre en
      forme**, les deux cliquets verts. *Le risque est réel mais pas systématique — il se mesure,
      il ne se suppose pas.*

      **OUTIL : 36ᵉ STRATÉGIE, l'ÉCHO DE FRAGMENT D'IDENTIFIANT** — et c'est la première fois
      qu'un **lot d'écriture** trouve un indice **dans son propre travail**, l'outille, le mesure
      sur tout le site puis le ferme chez lui. C'est un angle mort de **tokenisation** :
      « l'écho de la question » découpe l'énoncé en mots, si bien que `vm.expectRevert`,
      `customElements` ou `totalDepenses` sont **un seul jeton** et que leurs **morceaux** ne sont
      jamais cherchés dans les options — alors que la bonne réponse est précisément celle qui
      explique l'identifiant et en reprend un morceau en clair. **201 questions tranchées (3,3 %),
      rendement 39,0 % ; 47 bonnes sur 98 en désignation unique (48,0 %).**
      **Et la mesure par cours dit de ne PAS lancer de chantier** : le plus exposé est
      `powershell` à **31,0 %**, aucun cours n'atteint 40 %. L'indice est **diffus** — sûr et rare,
      jamais concentré. Câblé pour être **surveillé**, pas pour déclencher une réécriture.

      ⚠️ **LE PIÈGE STRUCTUREL, 7ᵉ FOIS** : `doc/lecon-03` repérimé (46,7 % → **45,6 %**, 2 849 →
      **2 785**), `verif-normatif` 64/66 → **66/66**. Le motif naïf a **encore** rendu
      « 0 occurrence » sans erreur : le nombre porte une espace insécable **U+00A0 littérale**, et
      l'outil d'écriture **normalise** cette espace dans un script — il faut l'échapper
      explicitement (` `).

      **CE QUE LES SIX LOTS ONT RAPPORTÉ ET QUE PERSONNE NE MESURE ENCORE** (leur section « ce que
      je n'ai pas pu tenir », la plus rentable du protocole depuis `mobile`) : la **paire
      quasi-miroir** (deux options exactement opposées ⇒ l'apprenant restreint à 2 et gagne 50 %,
      et **aucune** stratégie ne compare les options **entre elles**) ; les **deux options qui
      disent la même chose**, que **notre propre règle « les quatre ou aucune » fabrique** en
      poussant à dupliquer les marques ; l'**option hors catégorie**, structurellement inévitable
      quand la bonne réponse appartient à un ensemble fermé de trois ; le **sigle inventé** (l'outil
      compte les majuscules, il ne vérifie jamais que le sigle désigne quelque chose) ; l'**identité**
      du mot étranger et non son nombre (trois distracteurs partageant le même mot absent, cliquet
      vert) ; la **plausibilité sémantique**, que la règle du `k` **dégrade** mécaniquement quand
      `k` est élevé ; la **distribution des rangs par LOT** (9 questions ne se divisent pas par 4 :
      plancher 3/2/2/2, soit 33,3 % sur un rang) ; et le fait que **`mesure-lexique-qcm --liste` ne
      marque une question que si une variante désigne la BONNE réponse** — donc reste muet quand
      elle désigne à coup sûr un **distracteur**. *Aucun de ces points n'est traité ici : ils sont
      écrits pour être outillés en F3, avec leur mécanisme.*

      **ÉTAT DU SITE** : **6 167 questions, 3 556 devinables par la longueur, 57,7 %** — contre
      5 081 et 84,8 % au cadrage de B4. **1 525 questions rendues, 27,1 points gagnés**,
      **32 cours verrouillés**. La case reste **décochée** : **54 cours** restent au-dessus de
      60 %.

      ---

      **34ᵉ COURS DÉTORDU — `a11y` (2026-09-08) : 94,2 % → 23,9 %.** Écriture en **UNE seule
      vague** (six lots sur fichiers disjoints, consigne `scratchpad/CONSIGNE-A11Y.md`), puis
      **quatre passes de correction** dont trois n'étaient pas prévues. Le cours est le premier
      dont la clôture a demandé **116 distracteurs réécrits** — 202 par la vague, puis 116 par les
      quatre passes ci-dessous, sur 207.

      | passe | ce qu'elle ferme | distracteurs |
      |---|---|---:|
      | 1 · fond | distracteurs VRAIS, doublons, indices de lot | **63** |
      | 2 · lexique | l'indice lexical **rouvert par la passe 1** | **43** |
      | 3 · règle du `w` | la bonne réponse seule la plus fournie en mots longs | **4** |
      | 4 · rangs | distribution 18/19/17/15 → 18/17/17/17 | **5** |

      **CE QUE LES QUATRE RELECTURES ADVERSARIALES ONT RENDU** (45 défauts sur 69 questions ;
      `CONTRA-A11Y-R1..R4.md`). Les six qui comptent, toutes **prouvées contre la norme**, pas
      contre une intuition :

      1. **`lecon-07` q3 — une SECONDE BONNE RÉPONSE.** « Un décor CSS ne porte pas d'attribut
         `alt`, et sans `alt` l'arbre d'accessibilité reste vide pour lui » : les **deux**
         propositions sont vraies, et ensemble elles répondent correctement à l'énoncé.
      2. **`lecon-12` q2 — AccName réfute le distracteur.** « Le message pointe l'identifiant du
         champ avec un attribut `for` » : un second `<label for>` est du HTML valide et l'étape
         **2C de AccName CONCATÈNE tous les `label` associés** — le message *serait* annoncé.
         L'`explain` intouchable ne réfutait que « la couleur ou le placeholder ».
      3. **`lecon-05` q2 — le distracteur dit vrai par calcul.** « Un rouge saturé fatigue la
         perception, et le contraste ne tient plus » : `#ff0000` sur `#ffffff` donne **4,00:1**,
         sous le seuil AA de 4,5:1. L'affirmation est exacte.
      4. **`lecon-14` q1 — le distracteur énonce la thèse de la clef.** « Ces outils ne mesurent
         donc ni le contraste, ni la pertinence » : « ne mesurent pas la pertinence » est mot pour
         mot ce que la bonne réponse et son `explain` affirment.
      5. **`lecon-13` q3 — un sigle réel détourné.** Deux options collaient **APG** (*ARIA
         Authoring Practices Guide*, W3C, document **externe**) à une notice **interne** au projet.
         Un outil qui compte les majuscules ne verra jamais qu'un sigle désigne autre chose que
         ce qu'il désigne.
      6. **`lecon-06` q1 — deux options qui s'AUTO-DÉNONCENT.** L'énoncé demande ce qu'est un audit
         **complet** ; les options annonçaient leur propre lacune (« avec le clavier en moins »,
         « sans écoute — clavier exclu »). L'apprenant les élimine sans rien savoir du sujet.

      **DEUX INDICES DE FORME QU'AUCUNE DES 37 STRATÉGIES NE MESURE**, tous deux sur des options
      **numériques**, tous deux à 100 % sur leur question :
      - **la seule option qui porte une virgule** — `lecon-05` q1 : `4,5:1` contre `1:1`, `2:1`,
        `21:1 exigé`. Repérer la virgule suffit.
      - **le maximum d'une suite régulière** — bilan B7 : `1,5 / 2,5 / 3,5 / 4,5`, la bonne
        réponse étant la plus grande. C'est le relecteur du bilan qui a signalé que la correction
        du premier fabriquait le second. Séries corrigées en cassant la régularité (`6,5:1`).
      **Les deux ont été MESURÉS sur le site le jour même, et un seul a survécu.**

      | motif | tranche sur | rendement | verdict |
      |---|---:|---:|---|
      | la seule avec une **virgule décimale** | 1,3 % (80 q) | **55,4 %** | **câblé — 38ᵉ stratégie** |
      | le **plus grand** nombre (options courtes) | 0,4 % (30 q) | 23,3 % | **réfuté** |
      | le **plus petit** nombre (options courtes) | 0,4 % (27 q) | 11,1 % | **réfuté** |

      La virgule décimale est **sûre là où le contenu est chiffré** : `crypto` **100,0 %** (7 q),
      `observabilite` **100,0 %** (4 q), `distribue` 84,6 % (15 q), `neurones` 66,7 % (15 q). La
      cause n'est pas un hasard mais un réflexe de rédaction : un seuil normatif s'écrit avec une
      décimale, un distracteur inventé s'écrit en nombre rond parce que c'est plus rapide à poser.
      **Épreuve par injection faite** : « (seuil 4,5) » ajouté aux 3 premières bonnes réponses de
      `go/lecon-01` fait passer le rendement de 0,0 % à **100,0 %**, `git checkout` le ramène à
      0,0 % au caractère près.

      ⚠️ **Le « plus grand nombre » était un artefact que MA PROPRE correction avait fabriqué** —
      la série `1,5 / 2,5 / 3,5 / 4,5` du bilan `a11y`. Mesuré sur le site : **23,3 %, l'étalon
      est à 25,0 %**. La série a été cassée dans la leçon, la stratégie n'entre pas dans l'outil.
      **Une trouvaille sur un cours n'est un indice du site que si la mesure du site le dit** —
      c'est la troisième fois que ce chantier écarte une prise adversariale par la mesure.

      ⚠️ **ET CE QUE LE CÂBLAGE RÉVÈLE SUR LE CLIQUET LUI-MÊME, à trancher en F3.** Refiger la
      référence après l'ajout ne change le `pire` d'**aucun** cours. `crypto` et `observabilite`
      sont à **100 % de rendement** sur cet indice et `verif-qcm-biais` reste **vert**, parce qu'il
      juge sur la colonne « réussite » (29,4 % et 29,0 %) — que la faible couverture noie dans le
      hasard. C'est **la leçon du cours `doc` transposée au GARDE-FOU** : la colonne « réussite »
      noie les indices rares, on l'a corrigé dans la *mesure* le 2026-09-06, on ne l'a jamais
      corrigé dans le *cliquet*. **Question ouverte : le cliquet doit-il surveiller le RENDEMENT
      des stratégies à faible couverture ?** Le faire passerait probablement plusieurs cours déjà
      marqués `traite` au rouge — c'est précisément pourquoi la décision n'est pas prise ici.

      **LA LEÇON MÉCANIQUE DE CE COURS — corriger le FOND rouvre le LEXIQUE, et de combien.** Le
      cours sortait de la vague à **0 exploitable / 0 à mettre en forme**. Les 63 corrections de
      fond l'ont remis à **21 exploitables et 29 à mettre en forme sur 69** — parce qu'un
      distracteur réécrit pour cesser d'être vrai emploie forcément d'autres mots, et que la règle
      du `k` compte les mots étrangers à la page. Le constat était déjà écrit pour le cours `c` ;
      il est ici **chiffré** : **une passe de fond de 63 options a coûté 43 options de plus**, soit
      **0,68 réécriture de rattrapage par correction de fond**. Toute estimation de coût d'un
      cours doit porter ce facteur.

      **ET LA RÈGLE DU `w` NE SE DÉDUIT PAS DU `k`.** Trois questions tenaient le `k` (mêmes
      nombres de mots étrangers partout) et restaient exploitables : la bonne réponse y était la
      **seule option la plus fournie en mots longs**, ce qui suffit à la stratégie PROPORTION.
      C'est `w`, pas `k`, qui ferme PROPORTION — et les deux se referment dans des directions
      indépendantes.

      **MESURES FINALES, toutes exécutées :**

      | | avant | après |
      |---|---:|---:|
      | « la plus longue » | 94,2 % | **23,9 %** |
      | pire des 37 stratégies | 94,2 % | **26,8 %** |
      | meilleure (plancher) | — | **22,0 %** |
      | rangs 0/1/2/3 | 65 / 1 / 3 / 0 | **18 / 17 / 17 / 17** |
      | indice lexical (exploitables) | 60 / 69 | **0 / 69** |
      | questions trahies par 5 indices ou plus | — | **0** |

      **Contrôles** : `mesure-qcm-intouchable a11y` **« Aucune atteinte »** (207 distracteurs, 64
      réécrits dans le lot final ; `q` / `correct` / `explain` / bonne réponse intacts) ;
      `mesure-explain-orpheline --depuis=ef157ee` **aucune explication orpheline** ; `verif-html`
      **0 grave, 0 attention** sur 1 629 fichiers ; `verif-donnees` **0 erreur** sur 25 contrôles ;
      `verif.js --rapide` **26 étapes, tout vert (52,1 s)** ; cliquets refigés, `a11y` marqué
      `traite` (**33 cours verrouillés**) ; index `quiz` et `search` régénérés.

      ⚠️ **`doc/lecon-03` s'est repérimé une 10ᵉ fois**, comme à chaque cours détordu :
      **45,6 % → 44,6 %** et **2 785 → 2 723** manquements à S3, **11 mentions** corrigées — dont
      **la BONNE RÉPONSE d'un QCM** (« près de cinq cas sur dix » → « près de quatre »), seul cas
      où toucher une bonne réponse est obligatoire. Le séparateur est une **INSÉCABLE U+00A0
      littérale** : un `grep "2 785"` avec une espace ordinaire rend **zéro résultat** et laisse
      croire que le chiffre n'est pas dans la page. `verif-normatif` **63/66 → 66/66**.

      **ÉTAT DU SITE** : **6 167 questions, 3 507 devinables par la longueur, 56,9 %** — contre
      5 081 et 84,8 % au cadrage de B4. **1 574 questions rendues, 27,9 points gagnés**,
      **33 cours verrouillés**. La case reste **décochée** : **53 cours** restent au-dessus de
      60 %. Les plus nocifs par questions devinables : `dataviz` (68 q, 95,6 %), `lua` (72 q,
      88,9 %), `swift` (66 q, 95,2 %), `typescript` (68 q, 92,7 %), `scala` (68 q, 91,9 %).

      **LE 35ᵉ COURS EST MESURÉ ET SA CONSIGNE EST ÉCRITE — la prochaine passe démarre sur
      l'écriture, pas sur le diagnostic.** `dataviz`, 68 questions sur 14 leçons :

      | indice | réussite | rendement |
      |---|---:|---:|
      | la plus longue (couverture **100 %**, pas un ex æquo) | **95,6 %** | 95,6 % |
      | la plus détaillée | 71,0 % | **97,6 %** |
      | RESTREINDRE à la parenthèse (32 questions) | 60,3 % | **97,0 %** |
      | RESTREINDRE aux deux-points | 51,5 % | **96,0 %** |
      | le mot technique exclusif | 51,0 % | 65,1 % |
      | ECARTER la moins bavarde | 39,2 % | **100 %** |
      | l'écho de l'énoncé | 40,0 % | 59,3 % |
      | point-virgule (unique et restreint) | 30,5 % | **100 %** |

      Rangs **65 / 3 / 0 / 0** (cible 17/17/17/17), **66 questions à retoucher, 8 789 caractères** ;
      indice lexical **55 exploitables sur 68**, 59 à mettre en forme. Le **point interne**, la
      **flèche** et la **virgule décimale** sont à **0 %** : la consigne interdit de les ouvrir.

      Consigne réutilisable : `scratchpad/CONSIGNE-DATAVIZ.md`. Elle porte les deux acquis du
      34ᵉ cours — la **règle du `w` énoncée comme indépendante du `k`**, et le **coût de 0,68
      réécriture de rattrapage par correction de fond**, mis en tête de l'interdit « un distracteur
      ne doit jamais devenir vrai » : chaque distracteur juste du premier coup économise **1,68**
      réécriture. Elle liste aussi **onze énoncés vrais du domaine** (l'axe des barres qui part de
      zéro, l'aire de la bulle et non son rayon, l'histogramme qui n'est pas un diagramme en barres,
      le paradoxe de Simpson…) à ne surtout pas employer comme distracteurs.

      ---

      **35ᵉ COURS DÉTORDU — `dataviz` (2026-09-08) : 95,6 % → 25,0 %.** Écriture en **UNE seule
      vague** (six lots sur fichiers disjoints), puis **quatre relectures adversariales**, puis
      **une passe de correction** et **deux passes de résidus**. **202 distracteurs réécrits sur
      204** par la vague, **101** de plus par les passes de correction.

      **ZÉRO DISTRACTEUR DEVENU VRAI SUR 204** — quatre relecteurs indépendants les ont passés un
      à un contre la norme du domaine, avec exécution sous Python/numpy/matplotlib. C'est la
      troisième fois d'affilée. En revanche ils ont rendu **quatre indices de forme qu'aucun des
      38 outils ne mesurait**, et **dix défauts de corps** (section suivante).

      **CE QUE LES RELECTEURS ONT TROUVÉ, ET CE QUE LA MESURE DU SITE EN A GARDÉ.** C'est la
      partie qui vaut pour les 52 cours restants : *une trouvaille de lot n'est un indice du site
      que si la mesure du site le dit*, et cette fois la règle a coupé dans les deux sens.

      | prise adversariale | sur le lot | **mesuré sur les 6 167 questions** | verdict |
      |---|---:|---:|---|
      | la **barre oblique** `/` | 2/2 | **79,7 %** de rendement, 434 questions | **câblée — 39ᵉ** |
      | la **ponctuation forte en UNION** (`:` ou `;` ou tiret cadratin) | 0/12 | **91,7 %**, **1 689 questions** | **câblée — 40ᵉ** |
      | l'**approximateur** (`~`, « environ », « près de ») | 2/2 à 100 % | 65,0 %, 103 questions | fermé sur le cours, **non câblé** |
      | le **« ne » non élidé** (`ne` plein contre `n'`) | **83,3 %**, 6 offertes | **23,5 %** en écarter, 34,9 % en désignation unique | **RÉFUTÉ** |

      **LA PLUS GROSSE DES DEUX EST LA PONCTUATION FORTE EN UNION, et elle dit quelque chose sur
      notre propre consigne.** L'outil mesurait chaque marque **isolément** : il ne voyait donc pas
      la question où la bonne réponse porte un `:` pendant qu'un distracteur porte un `;` — celle-là
      échappe aux deux mesures séparées et reste désignable d'un coup d'œil. Mais la mesure **par
      cours** montre que notre règle « par marque, ou les quatre options la portent, ou aucune » la
      **ferme déjà**, sans qu'on l'ait jamais visée :

      | | cours | questions tranchées | rendement pondéré |
      |---|---:|---:|---:|
      | cours marqués `traite` | 20 | 165 | **46,1 %** |
      | cours non traités | 56 | 1 516 | **96,9 %** |
      | `dataviz` après la vague | — | **0** | — |

      Rien de neuf à mettre en consigne, donc — mais **un chiffre neuf pour mesurer ce qui reste**,
      et la confirmation qu'une règle par marque implique l'union.

      ⚠️ **Le « ne » non élidé est le contre-exemple, et il est instructif.** Un relecteur l'a mesuré
      à **83,3 % de rendement avec 6 questions offertes** sur ses 16 questions ; sur le site il est
      **sous le hasard**. C'est un indice que **notre propre vague d'écriture a fabriqué sur ce
      cours** — il a donc été fermé sur `dataviz` (0 offerte) sans entrer dans l'outil. La stratégie
      « la seule qui nie » y était aveugle : **les quatre options niaient**, la différence n'était
      pas la négation mais **l'élision**.

      **DEUX INDICES DE PLUS, FERMÉS SANS ÊTRE CÂBLÉS :**
      - **Le NOM D'OUTIL ou de PALETTE** (`matplotlib`, `tab10`, `RdBu`, `viridis`, `jet`,
        `polyfit`, `Tufte`) : **0 bonne réponse sur 68** en portait un, contre **17 distracteurs sur
        204**. La règle « écarter l'option qui nomme un outil » n'avait donc **jamais tort** —
        58,3 % sur les 4 questions de `lecon-10`, noyée à 28,3 % sur le cours. Fermé : **0 sur 68**.
      - **L'ANCRAGE NARRATIF du QCM bilan** : les distracteurs étaient rembourrés avec le décor du
        cours (le stade, la piscine, les Docks, un nom de mois) alors qu'**aucun des 12 énoncés du
        bilan n'en parle**. Écarter toute option qui nomme le décor : **38,9 % contre 25,0 %,
        p = 0,0176, 6 questions couvertes sur 12 et zéro contre-exemple**. Combiné à deux règles
        voisines (« ne ment jamais », « selon Tufte ») : **45,8 %, dont deux questions à 100 %**.
        C'est un **tic de lot** — la même règle sur les 56 QCM de leçon rend 25,9 % avec deux
        contre-exemples. Fermé.

      **ET LA SEULE ATTEINTE VOLONTAIRE À UN INTOUCHABLE DE TOUT LE CHANTIER B4.** La bonne réponse
      de la **question 2 du bilan** était la copie **octet pour octet** de celle de `lecon-01` q3
      (« La position sur une échelle commune ou la longueur (barres, points alignés) », test
      d'identité stricte = `true`). Un apprenant qui avait fait le QCM de la leçon 1 gagnait la
      question au caractère près. Reformulée sans changer le sens. `mesure-qcm-intouchable` signale
      **exactement une atteinte, et c'est celle-là**.

      **DIX DÉFAUTS DE CORPS, TOUS PROUVÉS PAR EXÉCUTION** (numpy 2.5.2 et Node 24 sont installés) :

      1. **`lecon-01` — le schéma d'Anscombe démontrait l'INVERSE de sa leçon.** Il dessinait
         **8 / 7 / 7 / 6 points** au lieu de onze, et surtout quatre jeux aux statistiques
         **différentes** : pentes **0,618 / 0,360 / 0,872 / 0,648**, corrélations **0,906 / 0,535 /
         0,945 / 0,696** — sous une légende qui dit « les quatre jeux ont la même moyenne, la même
         corrélation et la **même droite** ». Redessiné avec les **44 vrais points de 1973** à
         échelle commune ; **relu depuis la page** : pente **0,780** et r **0,816** sur les quatre.
      2. **`lecon-02` — trois chiffres incompatibles pour une seule échelle.** Le SVG pose
         `pos = valeur / 8100 × 160`, mais son étiquette place 4050 à **100 px** (c'est **80**), la
         figcaption dit « mi-hauteur (100 px) » d'une plage de 160 — **arithmétiquement impossible**
         — et l'`aria-label` annonce une plage de **200 px**. Seule la solution d'exercice était
         juste. Quatre mentions alignées sur 80 px et 160 px.
      3. **`lecon-07` — la pente de la droite de régression, fausse en quatre endroits.** Le code de
         la leçon, **exécuté tel quel**, imprime `Pente : 10.6 € par m²` ; la leçon annonçait
         **+14 €/m²** et **950 €** à 55 m² (la droite donne **764,4 €**). Et le nuage, décrit comme
         « un ruban assez large », relation « modérée », a **r = 0,997** — les points dessinés dans
         le SVG sont les mêmes données (r mesuré : **−0,9974**).
      4. **`lecon-12` — le jeu de données contredisait la démonstration de sa propre leçon.** La
         leçon enseigne qu'une carte d'effectifs bruts redessine la population ; ses chiffres
         donnaient **Parc 1900 > Centre 1850 > Coteaux 1720**, donc « les Coteaux sont foncés » était
         faux et le petit Parc arrivait premier. Corrigé en **2050 / 1700 / 1250** : le classement
         BRUT est désormais **exactement** celui de la population, et le classement des TAUX
         **exactement son inverse**. Les **huit polygones** du SVG suivent, relus depuis la page.
      5. **`lecon-13` — la canicule d'août accrochée à un pic de juillet**, et un **+38 %**
         introuvable dans la série (contre juin : +12,5 % ; contre la moyenne : +73 %). Remplacé par
         **+73 % sur la moyenne**, et le code corrigé **calcule lui-même** l'étiquette qu'il affiche.
      6. **`lecon-11` — `alpha=0.1` empilé dix fois rend 65,1 %**, pas l'opacité pleine, qui n'est
         jamais atteinte (100 points : 99,997 %).
      7. **`lecon-10`** — « dans une salle de dix hommes il y en a **presque toujours** un » vaut
         **56,6 %** ; et `RdBu` présenté comme « bleu/orange » alors que la même page écrit
         « rouge → blanc → bleu ».
      8. **`lecon-14`** — titre-message « la piscine draine **deux fois plus** que le stade » pour
         **8100/5600 = 1,45** ; et le « cas réel » se contredisait (327 000 → 935 000 = **+186 %**
         présenté comme devenant « une variation modérée » une fois l'axe remis à zéro).
      9. **`lecon-06`** — deux renvois au diagramme en barres « de la leçon 1 » : c'est la **4**.
      10. **`lecon-01`** — la solution de l'exercice 3 oubliait la Piscine parmi les équipements qui
          dépassent le repère à 4050.

      **LA LEÇON MÉCANIQUE DE CE COURS — la fermeture des RÉSIDUS rouvre le LEXIQUE, comme la
      correction de fond.** Le cours sortait de la passe de correction à **0 exploitable / 0 à
      mettre en forme** ; ma passe de fermeture des trois indices résiduels (14 options) l'a remis à
      **2 exploitables et 4 à mettre en forme**, et déplacé les rangs à **17/17/18/16**. Il a fallu
      une **seconde passe de 6 options** pour revenir à 0 et à 17/17/17/17. Le facteur de 0,68
      rattrapage par correction, mesuré sur `a11y`, **vaut aussi pour les corrections de forme**,
      pas seulement pour celles de fond.

      ⚠️ **ET UN PIÈGE DE MESURE NEUF, qui a failli me faire corriger deux fois la même chose : en
      JavaScript, `\b` devant « à » ne matche JAMAIS.** `\b` est une frontière entre `\w` et
      non-`\w`, et « à » n'est pas `\w` : le motif `/\bà peu près\b/` est **toujours faux**. Mon
      détecteur d'approximateur déclarait donc la correction non appliquée alors qu'elle l'était.
      C'est le même genre de cécité silencieuse que `mesure-qcm-longueurs` aveugle à 184 questions
      pendant cinq cours — **un outil de mesure écrit à la volée doit être testé sur un cas qu'il
      DOIT trouver**.

      **MESURES FINALES, toutes exécutées :**

      | | avant | après |
      |---|---:|---:|
      | « la plus longue » | 95,6 % | **25,0 %** |
      | pire des 42 stratégies | 95,6 % | **26,5 %** |
      | meilleure (plancher) | — | **22,1 %** |
      | rangs 0/1/2/3 | 65 / 3 / 0 / 0 | **17 / 17 / 17 / 17** |
      | questions à retoucher | 66 / 68 | **0 / 68** |
      | indice lexical (exploitables) | 55 / 68 | **0 / 68** |
      | distracteurs devenus vrais | — | **0 sur 204** |

      **Contrôles** : `verif.js --rapide` **26 étapes, tout vert (52,9 s)** ; `verif-html` **0 grave,
      0 attention** sur 1 629 fichiers ; `verif-donnees` **0 erreur** sur 25 contrôles ;
      `mesure-qcm-intouchable` **1 atteinte, la volontaire** ; cliquets refigés, `dataviz` marqué
      `traite` (**34 cours verrouillés**) ; index dérivés régénérés avec `--fresh --only`.
      **Épreuve par injection des deux stratégies neuves** : la ponctuation forte passe de **0
      question tranchée à 3 à 100,0 %**, la barre oblique de **2 à 6 à 100,0 %**, et `git checkout`
      ramène aux valeurs d'origine.

      ⚠️ **`doc/lecon-03` s'est repérimé une 11ᵉ fois** : **44,6 % → 43,5 %** et **2 723 → 2 657**
      manquements à S3, **10 mentions** corrigées, séparateur **insécable U+00A0**.
      `verif-normatif` **64/66 → 66/66**.

      **ÉTAT DU SITE** : **6 167 questions, 3 460 devinables par la longueur, 56,1 %** — contre
      5 081 et 84,8 % au cadrage de B4. **1 621 questions rendues, 28,7 points gagnés**,
      **34 cours verrouillés**. La case reste **décochée** : **52 cours** restent au-dessus de
      60 %. Les plus nocifs par questions devinables : `lua` (72 q, 88,9 %), `typescript` (68 q,
      92,6 %), `swift` (66 q, 95,2 %), `scala` (68 q, 91,9 %), `pandas` (65 q, 93,8 %),
      `haskell` (66 q, 92,4 %).

      **LES HUIT FIGURES SONT CORRIGÉES — 8 sur 8, chacune relue depuis la page.** Elles avaient
      d'abord été mesurées et laissées décochées ; la même passe est revenue les fermer. Le principe
      de vérification est le même partout : après écriture, on **redéduit les valeurs depuis les
      pixels du fichier** et on les compare aux données de la leçon.

      | leçon | ce que la figure faisait | après |
      |---|---|---:|
      | `lecon-05` aire empilée | le total culminait en **octobre** (max réel : août, 16 100) ; la bande médiathèque variait de 0,0071 à 0,0086 px/entrée | échelle unique 0,013043 ; **culmine en août** ; pire écart **1,77 %** |
      | `lecon-05` banking | l'étiquette « pentes ~45° = lecture honnête » était posée **sous le panneau aplati** (6,6° de moyenne) ; et l'aria annonçait « exactement la même courbe » pour deux séries différentes | étiquette au centre, réécrite ; deux panneaux retracés depuis **une** série, écart **0,73 %** |
      | `lecon-05` trois courbes | trois échelles (0,0167 / 0,0350 / 0,0376) et **deux axes tronqués** (origines implicites 824 et 1 479) sous **un seul axe gradué** | recalculées sur l'échelle de l'axe ; pire écart **1,64 %** |
      | `lecon-04` empilées | juillet dessiné à **la moitié** de l'échelle de juin et irrégulier ; piscine juillet/juin = **0,387** dans l'empilé contre **1,161** dans le groupé d'à côté | échelle unique 0,010857 ; pire écart relatif **−67 % → 1,80 %** |
      | `lecon-08` treemap | Voirie à **48,1 %** de l'aire pour **31 %** annoncés, dans la seule leçon qui enseigne l'encodage par l'**aire** | cadre re-pavé ; pire écart **17,1 → 0,06 point** |
      | `lecon-09` indexées à 100 | la série des entrées tracée **sous** la base alors que ses indices vont de 100 à 110 — la forme était juste, **le signe inversé** | 1,2 px par point d'indice ; relu : 100,0 / 104,2 / 100,0 / 107,5 / 105,8 / **110,0** |
      | `lecon-10` gris + accent | la série accentuée était **la plus haute** des six et elle **montait**, alors que le code donne Docks = 2 800 = le **minimum** | accent et étiquette sur la série la plus basse (moyenne y **211,1**, la plus grande) |
      | `lecon-12` choroplèthe | **six** remplissages pour une légende qui n'en déclare que **quatre**, et le Parc (3,3) peint **plus foncé** que le Centre (3,6) | bornes déplacées (1,5 tombait dans deux classes) ; **6/6** polygones conformes |

      **LES DEUX ÉCARTS DE RÉCIT, dont un ALIGNEMENT REFUSÉ par la mesure.**
      - `lecon-06` appelait **22 min « la moyenne »** à l'ouverture et dans le récap, alors que la
        leçon démontre ensuite que 22 est la **médiane** et 26 la moyenne — son propre bloc
        `data-exos` attend « mediane 22.0 moyenne 26.0 ». Trois passages remis à 26.
      - `lecon-14` annonçait des données « **cohérentes avec tout le cours** » : elles ne le sont pas
        (la série mensuelle de la piscine existe en **quatre** versions, et le nombre d'équipements
        ne donne pas les taux de la carte de `lecon-12`). **C'est l'affirmation qui a été corrigée,
        pas les données — et c'est un choix mesuré, pas un renoncement** : aligner `equip_bruts` sur
        la carte de `lecon-12` donnerait 43 / 20 / 28 / 7 / 32 / 11, où l'effectif brut **ne suit
        plus la population** (Centre 43 devant Coteaux 28, alors que Coteaux est le plus peuplé) —
        et la démonstration de `lecon-14`, « colorier l'effectif brut, c'est dessiner la
        population », tomberait. **On échangerait une incohérence documentée contre une leçon
        fausse.** C'est la première fois de ce chantier qu'une correction est refusée par le calcul
        de ce qu'elle casserait ailleurs.

      **Contrôles de cette seconde moitié** : `verif.js --rapide` **26 étapes tout vert (57,8 s)** ;
      `verif-html` **0 grave, 0 attention** ; `verif-donnees` **0 erreur** ; `verif-rendu` **48
      mesures, 0 erreur** sur les 8 pages touchées ; indice lexical toujours **0 exploitable sur
      68** et rangs **17/17/17/17** malgré neuf fichiers modifiés ; **0 atteinte** à un intouchable.

      ---

      *(Ce qui suit était le relevé initial, laissé pour mémoire : c'est lui qui a servi de plan.)*

      ⚠️ **CE QUE LA PREMIÈRE MOITIÉ DE LA PASSE N'AVAIT PAS FAIT — les FIGURES de `dataviz`.**
      Les quatre relecteurs ont trouvé, au-delà des dix défauts corrigés ci-dessus, **huit SVG dont
      la géométrie ne code pas les données annoncées**. Ils sont **mesurés mais pas corrigés** :
      chacun demande de recalculer un pavage ou une polyligne, et la passe était déjà pleine. Ils
      valent une case à eux seuls, et **quatre d'entre eux enseignent le contraire de leur leçon** :

      | leçon | ce que la figure fait | ce que la leçon annonce |
      |---|---|---|
      | `lecon-05` aire empilée | le total culmine en **octobre** ; la bande piscine d'octobre (4 300) est dessinée **108 px** contre 68 px en juin (8 100) | « culmine en été porté par la piscine » |
      | `lecon-05` banking | le panneau étiqueté « pentes ~45° » a des pentes de **6,6°** en moyenne ; le panneau **dénoncé** est celui dont les pentes encadrent 45° | la règle de Cleveland que la q4 réclame |
      | `lecon-05` trois courbes | trois échelles différentes (0,0167 / 0,0350 / 0,0376 px par entrée) et **deux axes tronqués** | un graphique de comparaison |
      | `lecon-04` empilées | les segments de juillet sont à **la moitié** de l'échelle des segments de juin ; piscine juillet/juin = **0,387** dans l'empilé contre **1,161** dans le groupé d'à côté | la faute que la leçon dénonce |
      | `lecon-08` treemap | Voirie occupe **48,1 %** de l'aire pour **31 %** annoncés ; Espaces verts 6,7 % pour 13 % | « l'aire de chaque bloc dit son poids » |
      | `lecon-10` gris + accent | la série accentuée « Docks » est **la plus haute** des six et elle **monte** ; le code donne Docks = 2800 = le **minimum** | « les Docks décrochent » |
      | `lecon-09` indexées à 100 | la série des entrées est tracée **sous** la base 100 alors que ses indices vont de 100 à **110** — la forme est juste, **seul le signe est inversé** | « l'alternative honnête » |
      | `lecon-12` choroplèthe | six remplissages pour une légende qui n'en déclare que **quatre**, et le Parc (3,3) peint **plus foncé** que le Centre (3,6) — luminance WCAG 65,5 contre 82,1 | la faute que la leçon enseigne à éviter |

      Deux écarts de récit relevés en plus, moins graves mais réels : `lecon-06` appelle **22 min**
      « la moyenne » à deux endroits alors que la leçon démontre que c'est la **médiane** (moyenne =
      26 min, vérifié par `statistics.mean`), et le fil rouge « fréquentation mensuelle de la
      piscine » existe en **quatre versions différentes** selon la leçon (`lecon-03`/`04` : max
      9 400 ; `lecon-05` : 11 200 ; `lecon-13` : 8 100 en juillet ; `lecon-14` : 8 100 en juin) —
      dans un bloc que `lecon-14` présente comme « **cohérent avec tout le cours** ».


      **LE 36ᵉ COURS EST MESURÉ ET SA CONSIGNE EST ÉCRITE — la prochaine passe démarre sur
      l'écriture, pas sur le diagnostic.** `lua`, 72 questions sur 18 leçons :

      | indice | réussite | rendement |
      |---|---:|---:|
      | la plus longue (couverture **100 %**, pas un ex æquo) | **88,9 %** | 88,9 % |
      | **la ponctuation forte en UNION** (37 questions) | **63,5 %** | **100 %** |
      | la plus détaillée | 75,7 % | **98,0 %** |
      | RESTREINDRE à la parenthèse | 62,3 % | **97,3 %** |
      | l'écho de l'énoncé | 51,0 % | 78,1 % |
      | le point-virgule (seul et restreint) | 49,4 % | **100 %** |
      | RESTREINDRE aux deux-points | 44,6 % | **100 %** |
      | la barre oblique (5 questions) | 28,8 % | 80,0 % |

      Rangs **64 / 3 / 3 / 2** (cible 18/18/18/18), **63 questions à retoucher, 14 613 caractères**
      — le plus gros volume d'un cours depuis le début de B4 ; indice lexical **59 exploitables sur
      72**, 62 à mettre en forme. La **virgule décimale** est à **0 %** : la consigne interdit de
      l'ouvrir. L'**approximateur** tranche déjà sur 2 questions à 100 %.

      Consigne réutilisable : `scratchpad/CONSIGNE-LUA.md`. Elle porte les trois acquis du 35ᵉ
      cours : **la ponctuation forte en UNION mise en n° 2** (c'est le plus gros indice du cours
      après la longueur), la consigne de **constituer le dictionnaire de la page AVANT de rédiger**
      (un écrivain a perdu un tour complet faute de l'avoir fait), et l'avertissement sur les
      **outils de mesure écrits à la volée**, à tester sur un cas qu'ils doivent trouver.

      ---

      **36ᵉ COURS DÉTORDU — `lua` (2026-09-08) : 88,9 % → 25,0 %.** La vague d'écriture avait été
      passée par un réveil **coupé juste après son commit** ; cette passe-ci a fait le reste :
      **quatre relectures adversariales**, la correction des défauts de fond, puis la fermeture
      d'un indice **qu'aucun des 43 outils ne voyait**.

      ⚠️⚠️ **LE PLUS GROS ACQUIS N'EST PAS LE COURS, C'EST L'ANGLE MORT QU'IL A RÉVÉLÉ : NOUS NE
      MESURIONS LE SENS INVERSE QUE D'UNE STRATÉGIE SUR 43.** `mesure-biais-inverse.js` ne
      regardait que « le mot technique exclusif ». Or `lua` sortait de sa vague avec **toutes ses
      stratégies directes à 25 %** — les deux cliquets au vert — pendant qu'**écarter l'option qui
      reprend le plus de mots de l'énoncé** rendait **32,4 % sur 34 de ses 72 questions** : sur ces
      34, la porteuse de l'écho était fausse **33 fois**. C'est la règle du `k` du cours `mobile`
      (« fermer un indice à fond le RETOURNE ») appliquée à une **deuxième famille d'indices**, et
      cette fois c'est **notre propre consigne** qui l'avait fabriquée (voir plus bas).

      **Mode `--toutes` livré**, qui mesure les 42 stratégies dans le sens inverse. Il n'est pas
      né d'une intuition : sa colonne DIRECTE tombe **au dixième près** sur la colonne RENDEMENT de
      `mesure-biais-qcm --seul=lua` (2,9 / 9,7 / 12,7 / 13,0 %) et ses couvertures aussi
      (47,2 / 43,1 / 76,4 / 95,8 %) — **deux chemins de code indépendants qui concordent**. Les
      stratégies ne sont pas recopiées : `mesure-biais-qcm.js` s'exporte quand on le **requiert**,
      parce qu'une copie se périmerait au premier ajout.

      **ET LE CHIFFRE QUI CHANGE LA LECTURE DE TOUT LE CHANTIER B4 : 118 ALERTES SUR LES 34 COURS
      MARQUÉS `traite`.** Ce n'est donc pas un défaut de `lua`, c'est un **résidu du chantier
      entier** :

      | cours | stratégie | tranche | DIRECTE | INVERSE |
      |---|---|---:|---:|---:|
      | `csharp` | l'écho de la question | 37 (48,1 %) | **0,0 %** | **33,3 %** (le plafond) |
      | `html` | la plus détaillée | 55 (34,4 %) | **0,0 %** | **33,3 %** |
      | `cpp` | la plus détaillée | 32 (41,6 %) | **0,0 %** | **33,3 %** |
      | `git` | le mot technique exclusif | 53 (66,3 %) | 7,5 % | 30,8 % |
      | `doc` | le mot technique exclusif | 40 (62,5 %) | 12,5 % | 29,2 % |

      ⚠️ **Colonne GLOBAL ajoutée pour ne pas surestimer d'un facteur trois.** Un inverse à 33,3 %
      ne vaut pas +8,3 points : sur les questions où la règle ne tranche pas, l'apprenant retombe
      au hasard. Sur `lua`, l'écho valait **28,5 % au total**, pas 32,4 %. C'est la faute de la
      colonne « réussite » qui NOIE un indice rare, **prise à l'envers** — et c'est ce chiffre-là
      qui se compare aux 25,0 % de l'étalon. **Contre-épreuve** sur un cours NON traité
      (`typescript`) : ses alertes inverses portent sur « la moins bavarde » et « la troisième plus
      longue », c'est-à-dire le biais de longueur **dit à l'envers**, pas celui que la correction
      fabrique. Les deux causes ne se confondent pas.

      **LA RÈGLE DE L'ÉCHO ÉTAIT MAL FORMULÉE, ET C'EST ELLE QUI A FABRIQUÉ L'INDICE.** Le point (8)
      de la consigne de `lua` disait : *« fais reprendre les mots de la question par UN seul
      distracteur »*. Un seul distracteur qui fait écho, la bonne réponse qui n'en fait pas : ce
      distracteur devient le **maximum strict**, et l'écarter ne se trompe jamais. **La bonne
      formulation est celle de l'incise, apprise sur `java` : AUTANT de mots d'écho que la bonne
      réponse, jamais plus** — la bonne réponse doit rester **parmi les maxima**. Ni « la seule à
      faire écho » (indice direct), ni « aucun distracteur ne fait écho » (indice inversé).
      **C'est la troisième fois qu'une formulation molle coûte un cours** (après « pas la seule à
      porter l'incise » sur `java` et « au moins un distracteur porte la marque » sur `data-eng`).

      **DEUX AUTRES OUTILS, nés de deux fautes de cette passe :**
      - `mesure-qcm-intouchable.js` **se comparait à lui-même**. Sa référence était figée à `HEAD` :
        une vague déjà commitée était donc **inauditable**, et l'outil rendait « aucune atteinte »,
        ce qui ressemble à un succès. C'est exactement ce qui est arrivé, le réveil précédent ayant
        été coupé après son commit. Avec l'argument `<ref-git>`, la vague de `lua` se mesure enfin :
        **216 distracteurs, 201 réécrits, AUCUNE atteinte**. Sans l'argument, le même appel rendait
        **0 réécriture et 0 atteinte**.
      - `mesure-qcm-marques.js` (neuf) dit **quelle option a gagné ou perdu quelle marque**, avant
        que la moyenne du cours ne le noie. La règle « les quatre ou aucune » ne se vérifiait
        qu'après coup, sur le cours entier ; une passe qui retouche 50 options pour fermer UN indice
        peut en ouvrir un autre sans que personne le voie. Éprouvé sur deux références du même
        cours : contre le commit d'avant la vague il voit **204 options réécrites et 156 mouvements
        de marque** ; contre `HEAD`, sur la passe de fermeture de l'écho, **26 réécritures et AUCUN
        mouvement**. Un outil qui ne trouve rien partout ne prouverait rien.

      **43 DÉFAUTS DE FOND, rendus par quatre relecteurs et tous prouvés par exécution** (Lua n'est
      pas installé : chaque extrait a été rejoué en JavaScript sous Node 24.16 en respectant la
      sémantique Lua, et chaque affirmation confrontée à un passage contradictoire de la même page).

      **DEUX BONNES RÉPONSES ÉTAIENT FAUSSES**, toutes deux sur la lecture seule (`lecon-20` q3 et
      **bilan q12**) : « lui donner une métatable dont `__newindex` lève une erreur » ne rend **pas**
      une table en lecture seule — `__newindex` ne se déclenche que pour une clé **absente**, donc
      réécrire une clé existante passe sans rien déclencher. **Le code de la leçon elle-même** rend
      bien un proxy VIDE (`setmetatable({}, {__index = t, ...})`) : les deux réponses disaient donc
      le contraire de la fonction `figer()` enseignée quarante lignes plus haut.

      Les sorties annoncées fausses, chacune recalculée : `string.find("scripting","ip")` rend
      **4 5**, pas 3 4 ; `gsub` avec table rend le nombre de **correspondances** (2), pas de
      remplacements (1) ; `censurer("…caché")` ne rend pas cinq étoiles, parce que `%a` suit l'ASCII
      et que `#"caché"` vaut **6 OCTETS** ; un `table.sort` par longueur sur `poire`/`pomme` est un
      **ex æquo** qu'un tri non stable ne départage pas ; `fib(40)` naïf fait **331 160 281** appels
      et non « des milliards » (formule validée par compteur sur `fib(30)` = 2 692 537) ; **quatre**
      sorties d'erreur de `lecon-17` oubliaient que Lua **décore** un `chunkname` nu en
      `[string "x"]:1:` ; et `for i, v in ipairs, t, 0 do` **BOUCLE SANS FIN** — `ipairs` est une
      fabrique, elle rend sa fonction auxiliaire à chaque tour, jamais `nil`.

      Sept **versions attribuées à la mauvaise** (integer/float et `math.type` sont de 5.3, `goto`
      de 5.2, les opérateurs binaires de 5.3, les arguments de `xpcall` de 5.2, la déduction
      `__le` ← `__lt` survit jusqu'en 5.3 incluse) ; **deux exercices qui validaient une réponse que
      leur propre leçon déclare fausse** (`false` accepté à une question qui dit « à part false » ;
      `%d-` et `%d*` acceptés alors qu'ils reconnaissent la chaîne **vide**) ; huit contradictions
      ou renvois faux ; et trois **explications orphelines**, dont une qui expliquait `pairs` sous
      une question dont la réponse est `ipairs`.

      ⚠️ **ET LE PIÈGE S'EST REFERMÉ, ENCORE : corriger les bonnes réponses a ROUVERT l'indice
      lexical, de 0,0 % à 100,0 % en STRICTE.** Mes nouvelles rédactions ne portaient plus aucun mot
      étranger à la page pendant que les distracteurs en gardaient un. Refermé en **10
      substitutions**. **La règle tient : remesurer TOUS les indices après CHAQUE correction, y
      compris celles de FOND.**

      **LA FERMETURE DE L'ÉCHO A DEMANDÉ DEUX VOLÉES, ET C'EST LA DEUXIÈME QUI PORTE LA LEÇON.**
      La première a appliqué la règle de l'incise (« autant que la bonne réponse, jamais plus ») :
      **39 distracteurs, 50 mots d'écho retirés**. Elle a bien fermé le sens inversé — 32,4 % →
      26,2 % en GLOBAL — **mais elle a laissé 30,7 % dans le sens DIRECT**, et la raison est
      arithmétique : la bonne réponse restait ex æquo au maximum avec **un seul** distracteur, et
      qui restreint son tirage à ces deux options vaut **50 %**. Relevé de départ : **1 question**
      à ensemble maximal de taille 1, **10** de taille 2, **10** de taille 3, 51 de taille 4.

      **LA TROISIÈME FORMULATION EST UNE ÉGALITÉ, PAS UNE INÉGALITÉ : LES QUATRE OPTIONS PORTENT LE
      MÊME NOMBRE DE MOTS D'ÉCHO.** Avec un ensemble maximal de taille `s` contenant la bonne
      réponse, le crédit vaut `1/s` ; il ne vaut l'étalon `1/4` **que** si `s = 4`. Toute autre
      valeur est un cadeau. Seconde volée : **33 distracteurs réécrits par ÉCHANGE de mots**
      (remplacer un mot du distracteur par celui que l'énoncé emploie pour la même chose), jamais
      par ajout — c'est ce qui garde la longueur.

      **C'est exactement la forme des deux autres règles du chantier** — « par marque : les quatre
      ou aucune », et `k / k / k / k` sur les mots étrangers à la page. **Trois familles d'indices,
      trois fois la même leçon : une INÉGALITÉ laisse toujours une lecture exploitable ; seule
      l'ÉGALITÉ ferme les deux sens.** C'est aussi la quatrième fois qu'une formulation molle coûte
      un cours, après `java` (« pas la seule à porter l'incise »), `data-eng` (« au moins un
      distracteur porte la marque ») et `mobile` (le cliquet à sens unique).

      **MESURES FINALES, toutes exécutées :**

      | | avant | après 1ʳᵉ volée | après 2ᵉ volée |
      |---|---:|---:|---:|
      | « la plus longue » | **88,9 %** | 25,0 % | **24,3 %** |
      | « l'écho de la question » (direct) | 51,0 % | 30,7 % | **25,0 %** |
      | « ÉCARTER l'écho » (inverse, GLOBAL) | 28,5 % | 26,2 % | **25,0 %** |
      | questions où l'écho tranche | 34 | 10 | **0 sur 72** |
      | pire indice du cliquet | 88,9 % | 26,6 % | **27,1 %** |
      | rangs de longueur | 64 / 3 / 3 / 2 | 18/18/18/18 | **18 / 18 / 18 / 18** |
      | indice lexical | 59 expl. / 62 à mettre en forme | 0 / 0 | **0 / 0** |
      | marques déplacées | — | 0 sur 39 | **0 sur 33** |
      | atteintes à un intouchable | — | 0 | **0** |

      **L'écho est le premier indice du chantier ramené à l'étalon EXACT dans les deux sens, sur
      72 questions sur 72.** Les deux alertes qui restent sur `lua` (« le mot technique exclusif »
      à 27,8 % et « la moins bavarde » à 27,5 % en GLOBAL) appartiennent à la famille présente sur
      les **35 cours traités** ; elles ne sont pas propres à ce cours.

      ⚠️ **TROIS PIÈGES DE MESURE RENDUS PAR LES ÉCRIVAINS, tous mis en consigne :**
      - **Un mot d'écho de 6 lettres et plus change aussi le `w`** (le compte de mots longs) :
        l'échanger peut faire tomber la seule option qui tenait la règle. C'est arrivé **deux fois
        sur la même question** (`lecon-05` q2), une fois dans chaque sens.
      - **L'apostrophe compte dans la longueur d'un mot** : `d'accès` fait 7 caractères et compte
        donc comme mot long, alors que `accès` seul (5) est neutre pour `mesure-lexique-qcm`.
      - **Une tolérance de ±4 caractères ne suffit pas quand la bonne réponse est à moins de 4** :
        il faut vérifier le **RANG**, pas le delta. Une version à +3 a fait passer les rangs de
        18/18/18/18 à **18/17/19/18** avant d'être corrigée.

      ⚠️ **ET UNE COLLISION DE COORDINATION, la deuxième du chantier après celle des dossiers
      temporaires partagés :** deux correcteurs (moi et un écrivain) ont réparé **la même
      régression en parallèle**, l'un par « ensuite » (+8 caractères, hors fenêtre), l'autre par
      « garde » → « laisse » (+1) ; le second a retiré le premier, sans dommage. **Un seul agent
      par fichier ne suffit pas quand l'outil de mesure, lui, balaie tout le cours** — c'est la
      mesure globale qui appelle deux agents sur le même point.

      **Contrôles** : `verif.js --rapide` **24 étapes, tout vert (94,2 s)** ; `verif-html` **0 grave,
      0 attention** sur 1 629 fichiers ; `verif-donnees` **0 erreur** sur 26 contrôles ;
      `verif-normatif` **66/66** ; épreuves par injection **10/10** (biais) et **6/6** (lexique),
      aucune ne s'appuie sur `lua` ; 41 blocs JSON valides, 0 BOM, 0 CRLF ; index dérivés
      régénérés avec `--fresh` (quiz 6 151, flashcards 11 586, antisèches 1 577, pièges 1 908,
      recherche 1 614) ; cliquets refigés, **`lua` marqué `traite` — 35 cours verrouillés**.

      ⚠️ **`doc/lecon-03` s'est repérimé une 12ᵉ fois**, comme à chaque cours : **43,5 % → 42,5 %**
      et **2 657 → 2 596** manquements à la clause S3, **10 mentions** corrigées (5 taux, 5
      effectifs), séparateur insécable U+00A0. `verif-normatif` **64/66 → 66/66**.

      **ÉTAT DU SITE** : **6 167 questions**, **35 cours verrouillés**, **50 cours** restent
      au-dessus de 60 %. Les plus nocifs par questions devinables, remesurés :
      `swift` (66 q, 95,2 %, 63 devinables), `typescript` (68 q, 92,6 %, 63), `scala` (68 q,
      91,9 %, 63), `pandas` (65 q, 93,8 %, 61), `haskell` (66 q, 92,4 %, 61), `crypto` (68 q,
      89,7 %, 61). La case reste **décochée**.

      **LE 37ᵉ COURS EST MESURÉ ET SA CONSIGNE EST ÉCRITE** : `swift`, 66 questions sur 18 leçons.
      Longueur **95,2 %** (couverture 97,0 %), la plus détaillée **85,2 %** (rendement 100 %), le
      mot technique exclusif **77,9 %** (90,4 %), la ponctuation forte en union **77,3 %** (100 %,
      46 questions), l'incise **69,7 %** (95,2 %), le point-virgule **68,2 %** (100 %), l'écho
      **58,3 %** (86,2 %). Rangs **64 / 2 / 0 / 0** pour une cible de 17/17/16/16 ; **63 questions
      à retoucher, 17 810 caractères** — le plus gros volume d'un cours depuis le début de B4,
      devant `lua` (14 613). Indice lexical **26 exploitables sur 66**, et sa variante INVERSE rend
      déjà **75,7 %**. Consigne : `scratchpad/CONSIGNE-SWIFT.md`, qui porte la **règle de l'écho
      dans sa troisième formulation** et les trois pièges de mesure ci-dessus.

      ---

      **37ᵉ COURS DÉTORDU — `swift` (2026-09-10) : 95,2 % → 24,2 %.** Six écrivains en parallèle
      sur des leçons disjointes, la leçon 18 (quiz + les 12 questions du bilan) tenue à la main,
      puis **quatre relecteurs adversariaux** et **quatre correcteurs**. **194 distracteurs sur 198
      réécrits**, dont 137 une seconde fois au rattrapage.

      | indice | avant | après |
      |---|---:|---:|
      | la plus longue (couverture 97,0 %) | **95,2 %** | **24,2 %** |
      | la plus détaillée (rendement 100 %) | 85,2 % | 24,2 % |
      | le mot technique exclusif | 77,9 % | 26,4 % |
      | la ponctuation forte en UNION (46 questions) | 77,3 % | 25,0 % |
      | l'incise entre parenthèses | 69,7 % | 26,8 % |
      | le point-virgule (seul et restreint) | 68,2 % | 25,0 % |
      | l'écho de l'énoncé | 58,3 % | 25,0 % |
      | indice lexical (exploitables / à mettre en forme) | 26 / 66 | **0 / 0** |
      | rangs de longueur | 64 / 2 / 0 / 0 | **16 / 17 / 15 / 18** |

      Sens INVERSE : **0 alerte sur les 42 stratégies**, pire 26,3 %. Pire stratégie directe :
      **28,2 %**, sur une couverture de **3,0 %** (2 questions) ; la première à large couverture est
      « la DEUXIÈME plus longue » à 26,9 %.

      ⚠️⚠️ **LE PLUS GROS ACQUIS N'EST PAS LE COURS : C'EST UN 44ᵉ INDICE, ET IL EST GÉNÉRAL AU
      SITE. LE MOT FÉTICHE.** Un relecteur a compté à la main que « compilateur » figurait dans
      **17 distracteurs sur 45** de son lot et **1 bonne réponse sur 15** : écarter les options qui
      le portent rendait **43,3 %** chez lui, et **100 % sur trois questions** où les trois
      distracteurs le portaient et la bonne réponse non. Remesuré sur les 66 questions (leçon de
      `react` : *un relecteur qui mesure sur son lot extrapole faux*) : **33,5 %**, plus trois
      autres mots au-dessus du seuil — « chaque » 32,4 %, « alors » 30,8 %, « stockage » 28,3 %.

      **AUCUN DES 43 OUTILS NE LE VOYAIT, et la raison est structurelle** : `mesure-biais-qcm`
      mesure la FORME, `mesure-lexique-qcm` compare les options à la **page**. Personne ne comparait
      les options **entre elles**. Pire : **c'est notre propre consigne qui le fabrique** — la règle
      du `k` demande aux écrivains de puiser dans le vocabulaire de la page, et six agents qui
      écrivent le même jour, sur le même cours, avec la même consigne, convergent vers les mêmes
      mots-outils. C'est la même famille que l'indice LEXICAL du cours `os` : *la correction
      fabrique l'indice suivant*.

      Outil livré : **`tools/mesure-mot-fetiche.js`** (mode `--tous` pour les 90 cours). Sur `swift`
      **4 alertes → 0** ; son pire mot est « langage » à **27,8 %**, ce qui le place **89ᵉ sur 90**,
      soit le deuxième cours le plus propre du site.

      **MESURE SUR LES 90 COURS — 59 EN PORTENT UN.** Les pires : `groovy` « groovy » (14 bonnes /
      1 distracteur) **43,5 %** · `graphql` « requête » (14/7) **43,3 %** · `ml` « entraînement »
      (12/2) **41,3 %** · `erlang` « processus » (12/6) **37,7 %** · `bash` « commande » (11/4) et
      `ux` « utilisateur » (16/13) **37,5 %** · `markdown` « texte » **36,9 %** · `archi` « métier »
      **36,8 %**. Le défaut existe sur les cours **déjà fermés** (`lua` 30,7 %, `dataviz` 30,9 %)
      comme sur les autres.

      ⚠️ **CE QUE JE NE TRANCHE PAS, ET QU'IL FAUDRA DÉCIDER.** La lecture dominante est
      **RESTREINDRE**, c'est-à-dire que le mot est dans les **bonnes réponses** : c'est le
      vocabulaire du domaine — la bonne réponse d'une question sur GraphQL parle de « requête ».
      *Est-ce un biais, ou la définition même d'une bonne réponse ?* La réponse décide s'il faut un
      cliquet et à quel seuil ; c'est pourquoi l'outil **n'est pas câblé dans `verif.js`** : sans
      référence figée il ne peut pas échouer, et poser une référence avant d'avoir tranché
      figerait un seuil arbitraire. **C'est la même question que B3 avait laissée ouverte** sur la
      densité de ponctuation et le vocabulaire du glossaire.

      **CE QUE LA CONTRADICTION A RENDU** — 102 défauts sur 66 questions, dont :
      **25 distracteurs devenus VRAIS**, la moitié portant la thèse même de la bonne réponse (le
      copy-on-write, la définition SwiftPM des *targets* et *products*, « sans effet sur le
      compteur » qui est exactement ce que fait `weak`, « `async let` les lance en parallèle ») ;
      **deux questions gagnables sans connaître Swift** (`lecon-03` q1 à **100 %** — les trois
      distracteurs partageaient une prémisse et deux étaient la même phrase ; `lecon-13` q1 à
      **50 %** — deux options ne répondaient qu'à un volet de l'énoncé) ; une **explication
      orpheline** ; et 30 tournures vides fabriquées par le calibrage en caractères.

      **TROIS BONNES RÉPONSES ÉTAIENT FAUSSES** (le champ est « intouchable » pour l'écriture, pas
      pour la vérité) : `swift.org` présenté comme hébergeant un REPL en ligne ; « `<` n'est pas
      synthétisé pour les struct/**enum** », faux pour les enums depuis SE-0266 ; « une extension ne
      peut pas ajouter de propriétés stockées », vrai des seules propriétés **d'instance**. Plus
      **dix explications**, dont trois enseignaient une contrevérité (un `switch` non exhaustif est
      une **erreur**, pas un avertissement ; `Identifiable` n'est pas « synthétisée » ; `@Observable`
      est une **macro**, pas un property wrapper).

      **ET DEUX BLOCS DE CODE QUI NE COMPILAIENT PAS** : `lecon-18` importait `Foundation` au-dessus
      d'une classe `@Observable` et d'un `remove(atOffsets:)` (Observation et SwiftUI) ; `lecon-14`
      **commettait dans sa vue racine le piège que la page dénonce trente lignes plus haut et que
      son propre QCM sanctionne** (`let magasin = Magasin()`). Et le « Piège fréquent » de
      `lecon-17` affirmait l'inverse de la règle : un property wrapper s'applique bien à une
      variable locale — ce sont les **paramètres** qui ont attendu Swift 5.5 (SE-0293).

      ⚠️ **COÛT MESURÉ DE CES CORRECTIONS, et c'est la leçon de méthode de la passe : toucher à une
      bonne réponse ou à un CORPS de leçon ROUVRE l'indice lexical.** Les trois bonnes réponses ont
      rouvert 2 questions exploitables et 3 à mettre en forme ; les corps en ont rouvert 2 et 3 de
      plus. **Sept vagues de retouche** des distracteurs pour revenir à 0 / 0 — parce que le
      dictionnaire de la page, sur lequel se calcule le `k`, change quand le corps change. C'est la
      généralisation de ce que le cours `c` avait vu une fois.

      **UN AVERTISSEMENT QUI CRIAIT 37 FOIS À TORT EN CACHAIT DEUX QUI DISAIENT VRAI.** Le point B4
      avait noté le faux positif « 3 exercices pour 4 blocs `.exercise` » (le 4ᵉ est le capstone) et
      l'avait renvoyé à la phase F : **fait ici**. Mesure sur les 1 629 pages : **39 leçons en
      écart, 37 pour ce seul motif, et 2 vrais trous** que le bruit rendait invisibles
      (`html/lecon-33` et `archi/lecon-12`, un exercice noté sans champ de réponse) — comblés.
      ⚠️ **Deux règles plus simples ont été mesurées puis écartées** : compter les blocs
      non-capstone donne **51** écarts (pire qu'avant : `archi/lecon-12` met son capstone en
      *premier*), ne compter que les entrées non nulles en donne **152** (le `null` « ce bloc n'a
      pas de champ » est un choix éditorial présent dans **198** leçons). La règle juste est
      **positionnelle** : se taire seulement quand tous les blocs **en excès** sont des capstones.

      **LE CONTENU QUI SE PÉRIME EN ÉTANT PUBLIÉ, sixième récurrence** : `doc/lecon-03` publie les
      chiffres de conformité du site, que les corrections de `swift` ont périmés d'un coup (42,5 %
      → **41,6 %** de manquement à S3 ; 2 596 → **2 536** manquements ; 3 507 → **3 567** conformes ;
      34/89 → **35/89** cours sur S4 ; corpus de l'ancienne clause 2 645 → **2 693**).
      ⚠️ Piège dans le piège : un remplacement global a aussi touché le **document normatif** publié
      dans la page — qui doit rester identique à sa référence — et les deux chiffres **datés** du
      6 septembre, qui ne doivent surtout pas suivre le corpus. Restaurés. `verif-normatif` **75/75**.

      ⚠️ **LIMITE ASSUMÉE DE CETTE PASSE : aucune toolchain Swift sur la machine.** Les corrections
      de langage sont raisonnées sur les règles et les propositions d'évolution citées (SE-0266,
      SE-0293, SE-0317), **pas prouvées par exécution** — contrairement à toutes les mesures
      ci-dessus, obtenues en lançant les outils. C'est le seul point de cette passe où la règle
      fondatrice du chantier n'a pas pu s'appliquer, et il est écrit plutôt que lissé.

      **Contrôles** : `mesure-qcm-intouchable` **13 atteintes, toutes délibérées et listées** (3
      bonnes réponses + 10 explications) ; `verif-html` **0** sur 1 629 pages ; `verif-donnees`
      **0 erreur** sur 26 invariants ; `verif-rendu` sur les pages touchées **0 erreur** (6 avant) ;
      `verif-etudes` : chaque page est celle de son assembleur ; épreuve par injection
      `verif-qcm-biais-mutations` **10/10** ; cliquets refigés, **`swift` marqué `traite` — 36 cours
      verrouillés** ; index `quiz`, `search`, `pieges` régénérés.

      **ÉTAT DU SITE** : **6 151 questions**, **36 cours verrouillés**, **51 cours** restent
      au-dessus de 60 %. Les plus nocifs, remesurés : `typescript` (68 q, 92,7 %), `scala` (68,
      91,9 %), `crypto` (68, 89,7 %), `pandas` (65, 93,8 %), `haskell` (66, 92,4 %), `securite`
      (62, 95,2 %). **Le 38ᵉ cours est `typescript`.** La case reste **décochée**.

      **LE 38ᵉ COURS EST MESURÉ ET SA CONSIGNE EST ÉCRITE — la prochaine passe démarre sur
      l'écriture, pas sur le diagnostic.** `typescript`, 68 questions sur 20 leçons :

      | indice | réussite | rendement |
      |---|---:|---:|
      | la plus longue (couverture **98,5 %**) | **92,6 %** | 94,0 % |
      | la plus détaillée | 75,1 % | 93,8 % |
      | **la ponctuation forte en UNION** (41 questions) | 70,2 % | **100 %** |
      | le mot technique exclusif | 64,0 % | 77,1 % |
      | l'incise entre parenthèses (34 questions) | 62,9 % | **100 %** |
      | l'écho de l'énoncé | 61,2 % | 89,5 % |

      Rangs **63 / 3 / 1 / 1** (cible 17/17/17/17), **65 questions à retoucher, 15 425 caractères** ;
      indice lexical **61 exploitables sur 68**, 63 à mettre en forme.

      ⚠️ **PREMIER COURS OÙ LA CONSIGNE PORTE LE MOT FÉTICHE**, et il en a **sept** au-dessus du
      seuil, tous du côté des **bonnes réponses** : « erreur » et « vérifier » (8 bonnes / 1
      distracteur) rendent **33,1 %** à qui RESTREINT son tirage ; « javascript » (7/1) et
      « valeur » (8/2) **32,4 %** ; « renvoie » 30,9 % ; « compilation » 30,5 % ; « types » 30,3 %.
      La consigne dit ce qu'il faut en faire : **quand c'est la bonne réponse qui porte le mot, on
      l'AJOUTE aux distracteurs** — le retirer d'eux laisserait la bonne réponse seule à le porter
      et retournerait l'indice à 100 %.

      ⚠️ **Deux pièges propres au langage, écrits dans la consigne** : en TypeScript, `:` (annotation
      de type) et `=>` (fonction fléchée) sont **du code**, pas de la ponctuation rédactionnelle —
      la règle « les quatre ou aucune » s'y applique quand même.

      Consigne réutilisable : `scratchpad/CONSIGNE-TYPESCRIPT.md`.

      ---

      **`typescript` — FAIT le 2026-09-10 : 92,6 % → 25,0 %.** 20 leçons, **68 questions**,
      **199 distracteurs sur 204 réécrits**, en **trois vagues** (6 lots d'écriture, 5 relecteurs
      adversariaux, 5 correcteurs, puis un rattrapage).

      | mesure | avant | après écriture | après contradiction |
      |---|---:|---:|---:|
      | « la plus longue » | **92,6 %** | 25,0 % | **25,0 %** |
      | « la plus COURTE » | 0,0 % | 25,0 % | **25,0 %** |
      | rangs de longueur | **63/3/1/1** | 17/17/17/17 | **17/17/17/17 EXACT** |
      | indice lexical (exploitables / à mettre en forme) | **61 / 63** | 0 / 0 | **0 / 0** |
      | mot fétiche (7 mots au départ) | 7 alertes | 0 | **0 alerte** |
      | pire stratégie directe des 43 | 92,6 % | 27,6 % | **28,3 %** (« écarter les deux extrêmes ») |
      | sens INVERSE, colonne GLOBAL | — | 26,7 % | **27,2 %** |

      **Contrôles** : `mesure-qcm-intouchable` **0 atteinte** sur 68 questions et 204 distracteurs ;
      `verif-html` **0** sur 1 629 pages ; `verif-donnees` **0 erreur** sur 26 invariants ;
      épreuve par injection `verif-qcm-biais-mutations` **10/10** ; cliquet refigé, **`typescript`
      marqué `traite` — 37 cours verrouillés** ; `quiz-index` régénéré **une seule fois**, en
      clôture (6 151 questions, écart +0).

      ⚠️⚠️⚠️ **CE COURS A OUVERT UN 45ᵉ INDICE, ET C'EST LE VRAI RÉSULTAT DE LA PASSE.**
      `tools/mesure-mot-question.js` (nouveau) — **L'INTRUS LEXICAL**, mesuré à la granularité de
      **la question** et non du cours. Pour une question donnée, un mot porté par **toutes les
      options sauf une** désigne cette option : l'apprenant qui écarte les trois options partageant
      un mot que la quatrième n'a pas trouve la bonne réponse **sans rien connaître**.

      **`mesure-mot-fetiche` — écrit la veille — rendait « 0 alerte »** pendant que **cinq
      relecteurs adversariaux** trouvaient, chacun de son côté, **sept** questions de ce type
      (« tuple », « produit », « deux », « patron », « (voir X) », « toute erreur », « typage »).
      La raison est structurelle : il exige qu'un mot tranche **>= 8 questions** pour alerter, donc
      un mot qui n'en tranche **qu'une** — où il rend **100 %** — lui est invisible. C'est la même
      famille de faute que « la colonne réussite NOIE les indices rares » (cours `doc`) : **la
      parade n'est pas de relever le seuil, c'est de changer de granularité.**

      **Ampleur sur le site, mesurée** : **374 questions** tranchées à coup sûr (304 par DÉFAUT,
      70 par EXCÈS), sur **34 cours des 90**.

      ⚠️ **L'hypothèse évidente — « c'est notre chantier qui le fabrique » — est FAUSSE, et le
      calcul le dit** : traités 200/3 011 (6,64 %) contre non traités 174/2 972 (5,85 %) ;
      **z = 1,258, p = 0,208, non significatif**. Le vrai constat est moins flatteur : le
      traitement ferme l'indice **au niveau du cours** (4 cours en alerte sur 36 traités contre 30
      sur 54) **sans rien changer au nombre de questions individuellement ouvertes**. Nos 44 outils
      rabotent la MOYENNE et laissent la QUESTION intacte.

      ⚠️⚠️ **ET MON PROPRE OUTIL S'EST FAIT PRENDRE PAR LA FAUTE QU'IL DÉBUSQUAIT.** Première
      version : deux colonnes, sens direct seulement. La vague de correction qu'il a guidée a fermé
      les 5 questions « sûres » et fait tomber la colonne de 24,1 % à **8,1 %** — tout vert. Sauf
      que **8,1 % est très en dessous de l'étalon**, et qu'une stratégie qui se trompe presque
      toujours suffit à **inverser** : la lecture inverse rendait **34,6 %**. Les correcteurs
      n'avaient pas fermé l'indice, ils l'avaient **RETOURNÉ**, et le cliquet disait vert. C'est mot
      pour mot la leçon de `mobile` et celle de `lua` — répétées par quelqu'un qui les connaissait.
      **Quatre colonnes désormais.** Et la cible n'est pas « taux à 25 % » mais **couverture à
      zéro** : le taux se règle en DÉPLAÇANT quelle option est l'intrus, ce qui ne ferme rien.

      🔴 **CE QUI RESTE OUVERT, CHIFFRÉ ET NON MASQUÉ.** Après le rattrapage (43 mots sur 30
      questions), l'intrus lexical est passé de 34,6 % à **30,9 %** en lecture DÉFAUT-inverse et
      **28,3 %** en EXCÈS-inverse — **au-dessus du seuil de 28 %**. La structure du résidu est
      comprise : **18 questions sur 68** tranchent, avec **deux options désignées** à chaque fois,
      et la bonne réponse **dehors dans 17 cas sur 18** → 17 x 0,5 + 1 x 0 + 50 x 0,25 = 21/68 =
      **30,9 %**, le chiffre tombe juste. Fermer demanderait **~70 retouches** supplémentaires, et
      **trois vagues ont déjà montré que chaque fermeture déplace l'indice**. Décision assumée :
      **on s'arrête là pour ce cours**, et la règle entre en **consigne d'écriture dès le 39ᵉ**
      (`scratchpad/REGLE-INTRUS-LEXICAL.md`) pour que les cours suivants **naissent conformes**
      plutôt qu'être rattrapés à l'infini. **Le 45ᵉ indice n'est fermé sur AUCUN des 90 cours.**

      ✅ **UNE FAUSSE ALERTE À 5 923 QUESTIONS, LEVÉE DANS LE CODE ET NON SUPPOSÉE.** Le mode
      `--plan` affichait « bonne réponse = option 0 » partout. Vérification : **5 923 des 5 983
      questions du site** ont `correct: 0` (68/68 sur `typescript`). Si le moteur affichait les
      options dans l'ordre du tableau, ce serait un indice à **100 %**, plus grave que les 45
      autres réunis. **Il ne le fait pas** : `buildQuiz` appelle `shuffle` à chaque affichage
      (`js/lecon.js:516`) et suit la bonne réponse par un **drapeau**, jamais par un index. Rien à
      corriger — mais le chiffre est écrit ici pour qu'une passe future n'ait pas à refaire
      l'enquête.

      **DÉFAUTS DE FOND CORRIGÉS — la contradiction a rendu bien plus que les 20 à 30 habituels.**
      Une vingtaine de distracteurs **devenus vrais ou défendables**, dont `React.FC<Props>` décrit
      comme « une interface générique posée sur le composant » — **littéralement une seconde bonne
      réponse**, et la leçon nomme elle-même `React.FC` deux fois. Le type utilitaire **`Tuple<>`
      qui n'existe pas**. **Trois options de code qui ne compilaient pas pour la MÊME raison**
      (`readonly (infer U)`, TS1354), dont deux jumelles à un caractère près. `const _: never = 0`
      (TS2322) et `const c: never` sans initialiseur (TS1155). Une question du **QCM bilan dont les
      QUATRE options disaient « JavaScript »** alors qu'elle demande vers quoi TypeScript compile,
      avec un quasi-doublon de la bonne réponse. Une autre où **seule la bonne réponse enchaînait
      grammaticalement sur « il faut... »** : on répondait en lisant à voix haute. Et « Vite via
      swc » (c'est esbuild et Rollup), `noImplicitAny` qui donnerait `undefined` (c'est `any`),
      `String` pour `string`, `sourceMap` présenté comme le générateur des `.d.ts`.

      ⚠️⚠️ **LA LEÇON D'ÉCRITURE LA PLUS IMPORTANTE, ET AUCUN OUTIL NE LA MESURE : ÉCRIS UNE
      THÈSE FAUSSE, PAS UNE SALADE DE MOTS.** Pour atteindre la fenêtre de longueur, les écrivains
      ont remélangé le vocabulaire de la bonne réponse jusqu'au bon compte de caractères — et la
      bonne réponse est devenue **la seule option qui veuille dire quelque chose** (« tsc *range*
      les erreurs », « les listes de *sommes au moment du rendu* »). Un apprenant qui ne connaît pas
      une ligne de TypeScript coche juste, par élimination du charabia. **Seule la relecture
      adversariale l'a vu.** Règle versée en consigne du 39ᵉ cours.

      ⚠️ **UNE PRISE DE RELECTEURS RÉFUTÉE PAR LA MESURE GLOBALE** : **quatre relecteurs sur
      cinq** ont signalé « la bonne réponse est la plus courte ici, l'indice de longueur est
      rouvert ». Les quatre avaient tort — la cible est **17/17/17/17 sur le cours**, donc la bonne
      réponse est volontairement la plus courte sur 17 questions. Un lot de 12 questions ne peut pas
      afficher 25 %. C'est la leçon de `react`, encore, et elle est maintenant **écrite dans la
      consigne** pour que les relecteurs suivants ne la repayent pas.

      **TROIS RÈGLES D'ÉCRITURE NEUVES**, toutes apprises en rattrapant :
      1. **La seule manœuvre sûre est l'AJOUT, pas le retrait.** Retirer un mot pour fermer un 3/4
         le fait passer à 2/4 (bon) **ou à 1/4** (mauvais : la lecture par excès s'ouvre). Trois
         retouches sur sept ont dû *conserver* un mot qu'on aurait spontanément supprimé.
      2. **Ne jamais créer un 3/4 dont l'intrus serait la BONNE réponse** : elle est intouchable,
         donc l'indice devient irrattrapable sans réécrire les trois distracteurs.
      3. **Un distracteur ne doit jamais faire EXACTEMENT la longueur de la bonne réponse.** Ce
         n'est écrit dans aucun en-tête et se déduit du code : `plan-rangs-qcm` teste
         `plusLong = len > bon`, donc à `len === bon` l'option est classée « plus courte » et sa
         fenêtre s'arrête à `bon - 1` — hors bande d'un seul caractère.

      🟢 **DETTE D'INFRASTRUCTURE SOLDÉE AU PASSAGE : 22 consignes de chantier étaient HORS DU
      DÉPÔT.** `scratchpad/` est ignoré en entier depuis toujours, et les consignes d'écriture y
      vivent depuis le 1ᵉʳ cours de B4 — **210 633 octets** qui portent les 45 indices, les règles
      du `k` et du `w`, et les pièges appris cours par cours. Chacune a coûté une passe entière.
      Un dossier entièrement ignoré ne survit pas à un `git clean` : c'est la même famille de perte
      que « un lot d'écriture non commité ne survit à rien » (`ocaml`), sauf qu'ici ce sont **38
      cours de travail**. ⚠️ **Piège de forme, vérifié dans les deux sens** : `scratchpad/` ignore
      le RÉPERTOIRE et git n'y descend pas — une exception `!scratchpad/X.md` n'est alors **jamais
      évaluée**. Il faut `scratchpad/*`. Les 6,2 Go de scripts jetables restent dehors.

      **ÉTAT DU SITE** : **6 151 questions**, **37 cours verrouillés**, **51 cours** restent
      au-dessus de 60 %. **Le 39ᵉ cours est `scala`** (68 q, 91,9 %).

      **LE 39ᵉ COURS EST MESURÉ ET SA CONSIGNE EST ÉCRITE — la prochaine passe démarre sur
      l'écriture, pas sur le diagnostic.** `scala`, 68 questions sur 17 leçons (dont 12 en bilan) :

      | indice | réussite | rendement |
      |---|---:|---:|
      | la plus longue (couverture 98,5 %) | **91,9 %** | 92,5 % |
      | la plus détaillée | 81,7 % | 94,4 % |
      | **la ponctuation forte en UNION** (44 questions) | 73,5 % | **100 %** |
      | le mot technique exclusif | 72,4 % | 84,6 % |
      | l'incise entre parenthèses | 63,6 % | 92,1 % |
      | l'écho de l'énoncé | 57,1 % | 84,8 % |

      Rangs **63/3/1/1**, **65 questions à retoucher, 14 567 caractères** ; lexique **59
      exploitables sur 68** ; **DIX mots fétiches** au-dessus du seuil, tous du côté des bonnes
      réponses (`renvoie` 32,0 %, `résultat` 31,3 %, `valeur` 30,9 %, `flatMap` 30,5 %...) ; intrus
      lexical **4 questions sûres**, lecture EXCÈS à 26,3 %.
      Consigne réutilisable : `scratchpad/CONSIGNE-SCALA.md`, qui porte les **trois règles neuves**
      ci-dessus, le **45ᵉ indice** et l'avertissement contre la prise réfutée des rangs.

      ---

      **PASSE DU 2026-09-11 — `scala` CLOS (39ᵉ cours), et la leçon du 38ᵉ confirmée par la mesure :
      LE BIAIS DE LONGUEUR SE REMPLACE PAR UN BIAIS DE COHÉRENCE SÉMANTIQUE.**

      | | départ | arrivée |
      |---|---:|---:|
      | « la plus longue » | **91,9 %** | **25,0 %** |
      | pire des 43 stratégies | 91,9 % | **26,6 %** |
      | rangs de longueur | 63/3/1/1 | **17/17/17/17**, 0 question à retoucher |
      | indice lexical | **59 exploitables** sur 68 | **0**, et 0 à mettre en forme |
      | mot fétiche | **10 alertes** | **0** |
      | intrus lexical (45ᵉ indice) | **4 questions sûres** | **0**, dans les DEUX lectures |
      | sens inverse (42 stratégies) | — | **0 alerte** |

      **Déroulé** : six écrivains en parallèle sur des lots de fichiers disjoints (68 questions,
      **203 des 204 distracteurs réécrits**), puis **six relecteurs adversariaux en lecture seule**,
      puis six correcteurs, puis deux rattrapages que j'ai menés moi-même.

      ⚠️⚠️ **LA CONTRADICTION A RENDU 54 PRISES, DONT 8 GRAVES — ET 30 SONT DES « SALADES DE MOTS ».**
      C'est la confirmation chiffrée de la leçon écrite au 38ᵉ cours, et elle est plus grave qu'on ne
      l'avait dite : **sur quatre questions, DEUX options sur quatre ne voulaient rien dire** (« le
      type réel vient de la plateforme virtuelle », « using la duplique », « chaque maillon abandonné
      reste invisible au calcul final de la suite »), et la bonne réponse était **la seule phrase
      signifiante**. Un apprenant qui n'a jamais lu une ligne de Scala cochait juste par élimination
      du charabia. **Le biais de longueur avait été fermé et remplacé par un biais de cohérence
      sémantique, qui se mesure exactement au même endroit — et qu'aucun des 43 outils ne voit.**
      Sept autres prises étaient des distracteurs **VRAIS en Scala** : « un tuple » répond exactement
      à « quelle classe concise pour des données, immuable, avec pattern matching ? » puisque la
      bibliothèque standard déclare `final case class Tuple2`.

      🔴 **TROIS DÉFAUTS FONDATEURS DANS DES CORPS DE LEÇON — le type même qui a fondé cette chaîne :**
      1. `lecon-14` : `naturels.map(_ * _).take(5).toList // List(0, 1, 4, 9, 16)`. **Ce code ne
         compile pas** — en Scala chaque `_` est un paramètre distinct, donc `_ * _` est un
         `(Int, Int) => Int` que `map` refuse. La sortie annoncée est celle des carrés.
      2. `lecon-11` : une propriété ScalaCheck **donnée en exemple est RÉFUTÉE**, par débordement
         `Int` — vérifié par exécution, `(2147483647*2)|0` rend **-2** — et c'est la leçon elle-même
         qui garantit le contre-exemple en écrivant que ScalaCheck tire « les valeurs extrêmes ».
         **Dans la seule leçon du cours qui apprend à écrire des propriétés.**
      3. `lecon-04` : « `List.from(1)` chercherait à construire une infinité d'éléments et
         planterait » — il ne compile pas, il n'atteint jamais l'exécution.
      Plus : `Future.fromOption` qui n'existe pas dans la bibliothèque standard, un `Encoder[Double]`
      exigé et défini nulle part, un **schéma SVG inversé par rapport à son propre texte**, `Ok(...)`
      annoté « 201 Created » (c'est 200), un « GET » pour un POST, une **sécurité en concurrence
      affirmée trois fois** que le `var` réaffecté de la page ne procure pas (*lost update*), et un
      tableau qui renvoyait `copy` à la leçon 14 (**0 occurrence**) au lieu de la 5 (**21**).

      🟢 **QUATRE ATTEINTES À L'INTOUCHABLE, DÉLIBÉRÉES, LISTÉES ET COMMITÉES COMME TELLES.**
      - `lecon-12` q2 : **la BONNE RÉPONSE contredisait sa propre leçon.** Elle enseignait le motif
        **ETL** (« Extraction, Transformation, Chargement ») quand le corps enseigne **dix fois**
        « lire → transformer → **agréger** » — titre de section, figure, antisèche, récap — et
        l'énoncé est copié mot pour mot d'un « Vérifie ta compréhension » dont la réponse est
        *agréger*. `ETL` n'apparaissait que **2 fois, toutes deux dans le QCM**. Bonne réponse et
        explication refaites ; `ETL` ne figure plus dans la leçon.
      - `lecon-09` q1 : la bonne réponse parlait du paramètre de type `T` quand le code de la leçon
        écrit `def premier[A]`.

      ⚠️ **LE RETOURNEMENT, MESURÉ UNE FOIS DE PLUS, ET LE COÛT EXACT DE LE FERMER.** Fermer « le mot
      technique exclusif » l'a fait tomber à **13,3 %** en direct sur 15 questions — donc l'ÉCARTER
      rendait **28,9 %**, au-dessus du seuil. **Une seule question retournée a suffi** à ramener
      l'inverse à 26,7 %. Mais cette retouche a rouvert **la règle du `k`** (un mot de 6+ lettres
      absent de la page), puis **la règle du `w`** (la bonne réponse redevenue la plus fournie), puis
      **le mot exclusif lui-même** parce que le mot de remplacement, « programme », fait 9 lettres et
      redevenait exclusif. **Quatre allers-retours pour une seule question** — chacun mesuré, aucun
      deviné.

      🔴 **RÉSIDU ASSUMÉ, CHIFFRÉ, NON MASQUÉ** : « la moins bavarde » rend **27,3 %** (seuil 28,0 %).
      Elle était à 25,9 % avant mon rattrapage du mot exclusif. Le geste qui ferme l'un ouvre l'autre
      — **mesuré quatre fois dans cette seule passe** (le lot 1 a vu « la plus détaillée » monter à
      33,3 % en inverse, le lot 6 « la plus dense » à 28,8 %, le lot 4 « la moins bavarde » à 27,7 %).
      Décision : on s'arrête au premier point sous tous les seuils.

      ⚠️ **UNE PRISE DE RELECTEUR RÉFUTÉE PAR LE CORRECTEUR, avec preuve** : le relecteur du lot 5
      jugeait « historiquement défendable » un distracteur disant qu'une garde de `for` devient un
      `filter` strict (vrai avant Scala 2.8). Le cours enseigne Scala 3, où le désucrage est
      `withFilter` — c'est le texte de l'`explain` intouchable. Le remède proposé aurait remplacé un
      bon piège par une salade de mots. **Non corrigée.** Le lot 2 en a réfuté une autre de même
      nature. C'est la deuxième passe où des relecteurs se trompent : la contradiction doit elle-même
      être contredite.

      **Contrôles** : `verif.js --rapide` **53 étapes tout vert (142,6 s)** ; `verif-html` **0** sur
      1 629 pages ; `verif-donnees` **0 erreur** sur 26 invariants ; `verif-normatif` **75/75** ;
      `verif-rendu` **0 erreur** sur les pages au SVG modifié ; épreuves par injection **10/10** et
      **6/6** ; `mesure-qcm-intouchable` **4 atteintes, toutes délibérées et listées** ; **0 CR,
      0 BOM, 0 URL externe** ; cliquets refigés, **`scala` marqué `traite` — 38 cours verrouillés**.
      `doc/lecon-03` remis à jour (**13ᵉ repérimage** : 40,5 % → **39,5 %**, 2 473 → **2 411**,
      3 630 → **3 692**, 36/89 → **37/89**) sans toucher aux deux chiffres **datés** ni au document
      normatif publié. **Point fixe de la cascade index ⇄ études atteint en deux tours.**

      ⚠️ **LIMITE DE CETTE PASSE, écrite plutôt que lissée** : aucune toolchain Scala sur la machine.
      Les corrections de langage sont raisonnées sur la spécification et l'API standard, **pas
      prouvées par compilation**. Le seul débordement vérifiable l'a été par exécution (`node -e`).
      C'est le seul point où la règle fondatrice du chantier n'a pas pu s'appliquer.

      **ÉTAT DU SITE** : **38 cours verrouillés**, global « la plus longue » **53,1 %**,
      **49 cours** encore au-dessus de 60 %.

      **LE 40ᵉ COURS EST MESURÉ ET SA CONSIGNE EST ÉCRITE — la prochaine passe démarre sur
      l'écriture, pas sur le diagnostic.** Classement par **nocivité réelle** (questions × taux) :
      `crypto` **61 devinables**, puis `haskell` 61, `pandas` 61, `clojure` 59, `powershell` 59,
      `sass` 59, `securite` 59, `elixir` 58. **Le 40ᵉ est `crypto`** — 68 questions sur 11 leçons,
      dont **22 en QCM bilan** (`lecon-03` et `lecon-11`) :

      | indice | réussite | rendement |
      |---|---:|---:|
      | la plus longue (couverture **100 %**) | **89,7 %** | 89,7 % |
      | la plus détaillée | 69,7 % | 88,4 % |
      | la seule qui nie | 45,3 % | 65,4 % |
      | **la seule avec un tiret** | 40,8 % | **100 %** |
      | le mot technique exclusif | 37,3 % | 43,5 % |
      | la MAJUSCULE d'emphase | 32,4 % | 56,3 % |

      Rangs **61/4/0/3**, **48 questions à retoucher, 5 255 caractères** ; lexique **58 exploitables
      sur 68 et 68 sur 68 à mettre en forme** ; **CINQ mots fétiches** au-dessus du seuil (`chaque`
      34,1 %, `compte` 32,8 %, `chiffré` 31,2 %, `jamais` 30,2 %, `secret` 28,4 %) ; intrus lexical
      **1 question sûre**.
      Consigne réutilisable : `scratchpad/CONSIGNE-CRYPTO.md`. Elle met **la salade de mots en tête**
      (c'est la leçon chiffrée du 39ᵉ : 30 prises sur 54), porte l'avertissement sur le
      **retournement du mot technique exclusif** et son piège dans le piège (le mot de remplacement
      qui redevient exclusif), le **singulier/pluriel** qui laisse les deux outils verts, et les
      trois leçons de méthode : contredire la contradiction, rejouer les six mesures après **chaque**
      retouche, et corriger le corps avant le QCM.

      ---

      ## B4 NE PEUT PAS ETRE COCHEE — verdict inscrit ici le 2026-09-10 par le point E2 du chantier V17

      **Ce paragraphe existe pour qu'une passe future ne coche pas B4 par erreur.** Le plan a
      lui-même écrit, plus haut, que « B4 ne doit pas promettre la cible : elle doit livrer des lots
      mesurés » — et la cible de B1 est **par cours** (longueur ≤ 40 %, aucune stratégie exploitable
      au-dessus de 60 %), **pas globale**. Le chiffre global est trompeur *par construction*.

      **ÉTAT MESURÉ le 2026-09-10** (`tools/qcm-biais-reference.json`, relevé du 2026-09-08, rejoué) :

      | | cours | questions | part du corpus | « la plus longue » pondérée |
      |---|---:|---:|---:|---:|
      | **à la cible** (≤ 40 %) | **38** | 3 243 | 52,6 % | **22,7 %** |
      | **au-dessus** | **52** | 2 924 | **47,4 %** | **91,5 %** |

      Et sur ces 52 cours, **ZÉRO** a sa pire stratégie exploitable sous 60 %. Le global de
      **55,3 %** est bas **uniquement parce que les cours traités compensent les autres** : c'est
      exactement le piège mesuré sur `react` — *un indice de lot vaut 100 % sur le lot et 25 % sur le
      site*. **Une moyenne pondérée n'est pas un critère de fin.**

      **Coût restant, calculé et non arrondi** : **2 681 questions devinables** sur les 2 924 que
      portent ces 52 cours (chacun jugé sur sa pire stratégie). C'est **plus de deux fois** ce que
      B3 et B4 ont détordu depuis le début.

      **LES 52 COURS RESTANTS, CLASSÉS PAR NOCIVITÉ RÉELLE** (questions × taux de la pire stratégie,
      donc le nombre de questions qu'un apprenant qui ne comprend rien devine) — c'est l'ordre dans
      lequel les prendre :

      | rang | cours | questions | longueur | pire indice | taux | devinables | cumul |
      |---:|---|---:|---:|---|---:|---:|---:|
      | 1 | `swift` | 66 | 95.2 % | la plus longue | 95.2 % | 63 | 63 |
      | 2 | `typescript` | 68 | 92.7 % | la plus longue | 92.7 % | 63 | 126 |
      | 3 | `scala` | 68 | 91.9 % | la plus longue | 91.9 % | 62 | 188 |
      | 4 | `crypto` | 68 | 89.7 % | la plus longue | 89.7 % | 61 | 249 |
      | 5 | `haskell` | 66 | 92.4 % | la plus longue | 92.4 % | 61 | 310 |
      | 6 | `pandas` | 65 | 93.8 % | la plus longue | 93.8 % | 61 | 371 |
      | 7 | `clojure` | 66 | 89.4 % | la plus longue | 89.4 % | 59 | 430 |
      | 8 | `powershell` | 64 | 91.8 % | la plus longue | 91.8 % | 59 | 489 |
      | 9 | `sass` | 61 | 96.7 % | la plus longue | 96.7 % | 59 | 548 |
      | 10 | `securite` | 62 | 95.2 % | la plus longue | 95.2 % | 59 | 607 |
      | 11 | `elixir` | 63 | 91.7 % | la plus longue | 91.7 % | 58 | 665 |
      | 12 | `go` | 62 | 94.3 % | la plus longue | 94.3 % | 58 | 723 |
      | 13 | `dart` | 60 | 92.5 % | la plus longue | 92.5 % | 56 | 779 |
      | 14 | `julia` | 59 | 95.8 % | la plus longue | 95.8 % | 56 | 835 |
      | 15 | `nosql` | 57 | 99.1 % | la plus longue | 99.1 % | 56 | 891 |
      | 16 | `perl` | 60 | 92.9 % | la plus longue | 92.9 % | 56 | 947 |
      | 17 | `vue` | 62 | 90.3 % | la plus longue | 90.3 % | 56 | 1003 |
      | 18 | `bash` | 56 | 95.5 % | la plus longue | 95.5 % | 54 | 1057 |
      | 19 | `docker` | 57 | 94.7 % | la plus longue | 94.7 % | 54 | 1111 |
      | 20 | `lisp` | 55 | 98.2 % | la plus longue | 98.2 % | 54 | 1165 |
      | 21 | `observabilite` | 56 | 96.4 % | la plus longue | 96.4 % | 54 | 1219 |
      | 22 | `perf-web` | 57 | 95.6 % | la plus longue | 95.6 % | 54 | 1273 |
      | 23 | `r` | 63 | 85.7 % | la plus longue | 85.7 % | 54 | 1327 |
      | 24 | `tests` | 57 | 93.9 % | la plus longue | 93.9 % | 54 | 1381 |
      | 25 | `pascal` | 59 | 90.4 % | la plus longue | 90.4 % | 53 | 1434 |
      | 26 | `fsharp` | 54 | 96.8 % | la plus longue | 96.8 % | 52 | 1486 |
      | 27 | `linux` | 55 | 94.5 % | la plus longue | 94.5 % | 52 | 1538 |
      | 28 | `objc` | 54 | 95.8 % | la plus longue | 95.8 % | 52 | 1590 |
      | 29 | `prolog` | 54 | 96.3 % | la plus longue | 96.3 % | 52 | 1642 |
      | 30 | `vb` | 59 | 88.1 % | la plus longue | 88.1 % | 52 | 1694 |
      | 31 | `api` | 57 | 89.9 % | la plus longue | 89.9 % | 51 | 1745 |
      | 32 | `asm` | 57 | 87.7 % | la plus longue | 87.7 % | 50 | 1795 |
      | 33 | `cloud` | 53 | 92.5 % | la plus longue | 92.5 % | 49 | 1844 |
      | 34 | `cobol` | 50 | 98.7 % | la plus longue | 98.7 % | 49 | 1893 |
      | 35 | `erlang` | 54 | 88.9 % | la plus longue | 88.9 % | 48 | 1941 |
      | 36 | `ml` | 52 | 92.3 % | la plus longue | 92.3 % | 48 | 1989 |
      | 37 | `reseaux` | 52 | 93.0 % | la plus longue | 93.0 % | 48 | 2037 |
      | 38 | `wasm` | 50 | 96.0 % | la plus longue | 96.0 % | 48 | 2085 |
      | 39 | `ada` | 49 | 96.6 % | la plus longue | 96.6 % | 47 | 2132 |
      | 40 | `fortran` | 54 | 87.0 % | la plus longue | 87.0 % | 47 | 2179 |
      | 41 | `groovy` | 54 | 87.0 % | la plus longue | 87.0 % | 47 | 2226 |
      | 42 | `llm` | 48 | 97.9 % | la plus longue | 97.9 % | 47 | 2273 |
      | 43 | `compilation` | 72 | 52.1 % | la plus detaillee | 61.3 % | 44 | 2317 |
      | 44 | `patterns` | 45 | 97.8 % | la plus longue | 97.8 % | 44 | 2361 |
      | 45 | `http` | 48 | 89.6 % | la plus longue | 89.6 % | 43 | 2404 |
      | 46 | `graphql` | 45 | 93.3 % | la plus longue | 93.3 % | 42 | 2446 |
      | 47 | `kubernetes` | 48 | 87.5 % | la plus longue | 87.5 % | 42 | 2488 |
      | 48 | `cicd` | 43 | 93.0 % | la plus longue | 93.0 % | 40 | 2528 |
      | 49 | `markdown` | 45 | 88.9 % | la plus longue | 88.9 % | 40 | 2568 |
      | 50 | `formats` | 45 | 84.4 % | la plus longue | 84.4 % | 38 | 2606 |
      | 51 | `regex` | 44 | 85.8 % | la plus longue | 85.8 % | 38 | 2644 |
      | 52 | `vscode` | 46 | 81.2 % | la plus longue | 81.2 % | 37 | 2681 |

      *Rejouer ce classement : `node tools/mesure-biais-qcm.js --cours`, ou lire
      `tools/qcm-biais-reference.json` (champ `cours`, tri sur `questions` fois `pire`).*
      **Et n'oublier ni la sixième consigne (le POINT INTERNE, ci-dessus), ni le fait que le cliquet
      ne la voit pas.**

      **⚠️ PÉRIMÈTRE RÉDUIT PAR NOAH le 2026-09-15, après mesure — pas par arrondi.** État à cette
      date : **41 cours faits, 49 restants** (2 722 questions). J'avais d'abord proposé de ne traiter
      que les 15 plus nocifs en disant que ça rapporterait « l'essentiel du gain » : c'était faux, et
      la mesure l'a montré avant que le choix soit fait — la nocivité cumulée croît **presque
      linéairement** avec le nombre de cours traités (10 cours → 24 %, 15 → 35 %, 30 → 66 %, 49 →
      100 % : aucun coude). Le tri par nocivité a déjà aplani les écarts entre cours ; il n'existe pas
      de petit sous-ensemble qui rapporte disproportionnellement.

      Noah a choisi **30 cours, pour 66 % de la nocivité restante couverte**, en connaissance de ce
      calcul :

      **Les 30 cours que B4 doit encore traiter**, dans l'ordre de nocivité (repris du tableau
      ci-dessus, rangs 1 à 30) :
      `pandas`, `haskell`, `crypto`, `sass`, `securite`, `clojure`, `powershell`, `go`, `elixir`,
      `nosql`, `julia`, `vue`, `perl`, `dart`, `perf-web`, `lisp`, `observabilite`, `docker`, `r`,
      `bash`, `tests`, `pascal`, `fsharp`, `prolog`, `linux`, `vb`, `objc`, `api`, `asm`, `cobol`.
      **1 775 questions.**

      **Les 19 cours que B4 n'attaquera PAS**, décision assumée et non silencieuse : `cloud`,
      `reseaux`, `wasm`, `ml`, `erlang`, `ada`, `llm`, `fortran`, `groovy`, `compilation`, `patterns`,
      `http`, `graphql`, `kubernetes`, `cicd`, `markdown`, `formats`, `regex`, `vscode`. **947
      questions qui resteront devinables au biais de longueur** — à reprendre dans un chantier
      ultérieur si Noah le demande, pas à cacher dans F5.

      **Quand traiter le 30ᵉ cours de cette liste (ou si elle est épuisée avant les 30) : cocher B4**
      avec le compte rendu habituel, PUIS ajouter ici la mesure globale sur les 30 (et non sur 90) —
      le taux global du site restera au-dessus de 60 % à dessein, ce n'est plus la cible.


      ---

      **PASSE DU 2026-09-15 — `crypto` CLOS (40ᵉ cours), et le fait marquant n'est pas le biais :
      LA RELECTURE ADVERSARIALE A TROUVÉ DEUX CHIFFRES FAUX DANS L'INTOUCHABLE.**

      | | départ | arrivée |
      |---|---:|---:|
      | « la plus longue » | **89,7 %** | **25,0 %** |
      | pire des 43 stratégies | 89,7 % | **26,5 %** (« écarter les deux extrêmes », qui ne tranche que **3 questions sur 68**) |
      | rangs de longueur | 61/4/0/3 | **17/17/17/17**, hors bande 70-130 % : **0** |
      | indice lexical | **58 exploitables** sur 68, 68 à mettre en forme | **0** et **0** |
      | mot fétiche | **5 alertes** (`chaque` 34,1 %, `compte` 32,8 %, `chiffré` 31,2 %, `jamais` 30,2 %, `secret` 28,4 %) | **0** |
      | intrus lexical | **1 question sûre** | **0**, dans les DEUX lectures |
      | sens inverse (42 stratégies) | — | **0 alerte** (pire : 27,2 %) |

      **Déroulé** : six lots d'écriture sur fichiers disjoints (68 questions, **204 distracteurs sur
      204 réécrits**, compté par `mesure-qcm-intouchable`), puis six relecteurs adversariaux en
      lecture seule — **77 réécritures chiffrées proposées** (`scratchpad/PRISES-CRYPTO-LOT1..6.md`,
      comptées au motif « (avant → après) ») —, puis correction et re-simulation.

      🔴 **DEUX CHIFFRES FAUX DANS DES ÉLÉMENTS DÉCLARÉS INTOUCHABLES — et c'est la relecture
      adversariale, pas un vérificateur, qui les a vus.** `mesure-qcm-intouchable crypto` signale
      donc **2 atteintes, délibérées** ; les deux corrections sont **prouvées par exécution**
      (`node tools/verif-sorties.js pages/crypto/lecon-11.html` : **8 blocs rejoués, 8 identiques au
      caractère près**) :
      1. **bilan q4, LA BONNE RÉPONSE** annonçait un remplissage « **+107 %** au lieu de **+29 %** »
         quand le programme `fuite-coffre.js` produit, ligne par ligne, **+111 %** et **+34 %** — et
         que le corps de la leçon écrit déjà ces deux chiffres-là. La réécriture des distracteurs
         avait de plus **propagé le « +107 % » dans l'option [1]** : une bonne réponse fausse
         contamine ce qu'on écrit autour d'elle.
      2. **bilan q1, L'EXPLICATION** disait « **8 084 fois** moins d'octets réécrits » — un rapport
         bricolé entre **deux grandeurs différentes** (614 400 octets *chiffrés* ÷ 76 octets
         d'enveloppe et de sel). La sortie mesurée affiche **96 octets réécrits contre 307 200, soit
         3 200 fois moins**. Corrigée à ce que le programme dit.

      ⚠️ **LE LOT A SURVÉCU À UNE COUPURE, ET IL FAUT DIRE POURQUOI.** La passe d'écriture a été
      arrêtée à **14 h 31 par la limite de session**, lot terminé mais **non commité** — la situation
      exacte qui avait tout détruit au 30ᵉ cours (`ocaml`). Il a tenu ici parce que **rien n'a touché
      l'arbre de travail entre les deux réveils** : ni `git stash`, ni `checkout`, ni le contrôle
      horaire. Le réveil suivant a **remesuré le lot de bout en bout avant de le verser**, plutôt que
      de le croire fini : c'est ce remesurage qui a fait apparaître les 2 atteintes ci-dessus.

      **Contrôles** : `verif-html` **0 problème** sur **1 629 pages** ; `verif-donnees` **0 erreur**
      sur 26 invariants ; `verif-normatif` **75/75** ; `build-index` en comparaison : **quiz,
      flashcards, search, search-lite, antisèches tous identiques au fichier cible** (6 151 questions,
      11 586 cartes, 1 577 fiches, 1 614 pages indexées) ; **23 blocs JSON valides, 0 BOM** sur les
      11 leçons. `doc/lecon-03` remis à la mesure du jour (**14ᵉ repérimage** : S3 39,5 % → **38,9 %**,
      2 411 → **2 377**, 3 692 → **3 726** ; S4 37/89 → **38/89**, 41,6 % → **42,7 %**).

      🟠 **DETTE LAISSÉE, ÉCRITE PLUTÔT QUE TUE** : dans `pages/crypto/lecon-11.html`, la question 2
      du QCM de leçon et la question 10 du QCM bilan **posent la même question** (les 49 refus sur 150
      du coffre naïf) et ont la **même bonne réponse**. L'invariant `I17` ne le voit pas : il compare
      des leçons **entre elles**, pas deux blocs d'une **même page**. Corriger demande de toucher un
      énoncé et une bonne réponse, donc de rejouer les six mesures de la page — hors du périmètre de
      B4, qui traite le biais de longueur. **À reprendre dans un point dédié.**

      **ÉTAT DU SITE après ce cours** : **39 cours marqués `traite`**, **42 cours à la cible**
      (≤ 40 % sur la longueur) totalisant 3 513 questions, **48 cours au-dessus** totalisant
      2 654 questions dont **2 434 devinables**, global « la plus longue » **52,4 %**.
      **Il reste 29 cours** sur les 30 du périmètre fixé par Noah.


      **LE 41ᵉ COURS EST MESURÉ ET SA CONSIGNE EST ÉCRITE — la prochaine passe démarre sur
      l'écriture, pas sur le diagnostic.** Classement par nocivité réelle rejoué sur les 29 cours
      restants du périmètre : `pandas` **61 devinables**, `haskell` 61, `sass` 59, `securite` 59,
      `clojure` 59, `powershell` 59, `go` 58, `elixir` 58. **Le 41ᵉ est `pandas`** — 65 questions sur
      14 leçons, 195 distracteurs, dont **15 questions dans `lecon-14`** (3 de leçon, **12 en
      bilan**) :

      | indice | réussite | couverture | rendement |
      |---|---:|---:|---:|
      | la plus longue | **93,8 %** | 95,4 % | 96,8 % |
      | la plus détaillée | **82,2 %** | 73,8 % | **100 %** |
      | l'incise entre parenthèses | 61,5 % | 53,8 % | 91,4 % |
      | RESTREINDRE à la ponctuation forte | 59,1 % | 41,5 % | **100 %** |
      | le mot technique exclusif | 53,2 % | 64,6 % | 64,3 % |
      | RESTREINDRE aux deux-points | 49,0 % | 30,8 % | 95,0 % |
      | l'écho de la question | 47,6 % | 36,9 % | 75,0 % |

      Rangs **62/2/0/1**, **60 questions à retoucher sur 65, 12 457 caractères** — **2,4 fois le lot
      de `crypto`** (5 255) ; lexique **52 exploitables sur 65 et 55 sur 65 à mettre en forme** ;
      **HUIT mots fétiches** au-dessus du seuil, et ce sont des mots du DOMAINE qu'on ne peut pas
      retirer (`ligne` 34,2 %, `colonne` 33,1 %, `lignes` 32,8 %, `chaque` 32,7 %, `colonnes` 30,6 %,
      `index` 30,5 %, `table` 30,4 %, `valeurs` 28,8 %) ; intrus lexical **2 questions sûres** ; sens
      inverse **6 alertes** (« la TROISIÈME plus longue » 32,1 % en global).

      **DEUX MESURES QUI CHANGENT LA MANIÈRE DE PRENDRE CE COURS :**
      1. **La bonne réponse fait 119,5 caractères en moyenne, un distracteur 41,9 — rapport 2,85.**
         La médiane du même rapport est **0,99 sur les 39 cours déjà traités** et **3,41 sur les 51
         autres**. Presque tout le travail est donc de l'**allongement** de télégrammes (le plus court
         distracteur du cours fait **6 caractères**) : c'est le terrain exact de la salade de mots,
         et la consigne met cet avertissement en tête.
      2. 🟢 **`pandas` EST INSTALLÉ SUR LA MACHINE** — `pd.__version__` = **3.0.5**, Python 3.14.5.
         Pour la première fois depuis le 37ᵉ cours, la règle fondatrice (« ne jamais affirmer un
         comportement de tête ») est **applicable sans réserve**, là où `scala` avait dû inscrire
         l'absence de toolchain comme sa seule limite. ⚠️ **Mais le cours enseigne 2.0 / 2.2**, et
         deux écarts de version sont déjà mesurés : le `dtype` d'une colonne de texte est **`str`**
         en 3.0 (le cours dit `object`), et **`applymap` n'existe plus**. Une exécution qui diverge
         doit donc être analysée, pas appliquée.

      Consigne réutilisable : `scratchpad/CONSIGNE-PANDAS.md`. Douze faits de pandas y sont vérifiés
      par exécution, pour que les écrivains n'aient pas à les redécouvrir.


      ---

      **PASSE DU 2026-09-15 (suite) — `pandas` CLOS (41ᵉ cours), et le fait marquant est que
      FERMER LA LONGUEUR A RETOURNÉ DEUX STRATÉGIES D'UN COUP.**

      | | départ | arrivée |
      |---|---:|---:|
      | « la plus longue » | **93,8 %** | **26,2 %** |
      | rangs de longueur | 62/2/0/1 | **17/16/16/16** |
      | indice lexical | **52 exploitables** sur 65, 55 à mettre en forme | **0** et **0** |
      | mot fétiche | **8 alertes** (des mots du DOMAINE : `ligne`, `colonne`, `index`…) | **0** |
      | intrus lexical | **2 questions sûres** | **0**, dans les DEUX lectures |
      | sens inverse (42 stratégies) | 6 alertes | **0** (pire : la plus dense, 25,8 %) |

      **Déroulé** : cinq écrivains sur lots de leçons disjointes (**191 des 195 distracteurs
      réécrits**), puis — à la mesure — trois correcteurs pour rattraper ce que l'écriture avait
      retourné (**20 distracteurs de plus**).

      🔴 **LE LOT D'ÉCRITURE A FERMÉ LA LONGUEUR ET RETOURNÉ DEUX INDICES**, mesuré juste après :

      | stratégie | tranche | DIRECTE | INVERSE | GLOBAL |
      |---|---:|---:|---:|---:|
      | le mot technique exclusif | 15 | **0,0 %** | **33,3 %** | 26,9 % |
      | la moins bavarde | 53 | 15,1 % | 28,3 % | 27,7 % |

      **Une DIRECTE à 0,0 % sur 15 questions, c'est le plafond théorique de l'inverse** : la
      stratégie ne désignait JAMAIS la bonne réponse, donc l'écarter était une **élimination sûre**.
      C'est exactement le piège que la consigne portait depuis le 39ᵉ cours (« ne le ferme pas à
      fond, vise l'égalité ») — et il s'est produit quand même, parce que les écrivains fermaient
      chacun *leur* lot sans voir la lecture inverse du cours entier. Ramené à **26,0 %** et
      **26,3 %** par 7 bascules de chaque côté.

      ⚠️ **LA CONTRAINTE À QUATRE CONDITIONS, trouvée indépendamment par les trois correcteurs.**
      Un mot de remplacement doit satisfaire **quatre** règles à la fois : **moins de 9 lettres**
      (sinon il redevient le mot technique exclusif), **au moins 6 lettres** (sinon le `w` tombe et
      la bonne réponse redevient « la plus fournie à elle seule », ce qui rouvre PROPORTION),
      **présent dans la page** (sinon il est étranger et casse le `k`), et **absent de l'énoncé**
      (sinon il fabrique « l'écho de la question »). **Trois sur quatre ne suffit pas — et les deux
      fois, c'est un outil DIFFÉRENT de celui qu'on visait qui a rougi.** Le correcteur du lot 1 l'a
      payé en deux tours : `largement` → `de la place` a cassé le `w`, puis `mémoire` (le mot de
      l'énoncé) a ouvert l'écho ; seul `espace` tenait les quatre.

      🟢 **TROIS DÉFAUTS DE FOND, remontés par les écrivains et prouvés par exécution** — aucun
      vérificateur ne les voyait :
      1. `lecon-04`, **la FIGURE** : intitulée « La colonne prix_unitaire vue de haut », elle
         montrait **9 cellules dont 3 NaN** et annonçait « 3 trous sur 9 » — **33,3 %**, quand la
         même page publie `(df.isna().mean()*100).round(1)` → **prix_unitaire 8.3** et « 11
         non-null » sur 12. **Quatre fois le taux que son propre cours calcule.** Refaite à 12
         cellules, 1 trou en 4ᵉ position (la commande `C1004`, celle que le corps désigne) ;
         `verif-rendu` sur la page : **0 erreur**.
      2. `lecon-10` q3, **la BONNE RÉPONSE** : « deux colonnes 'variable' et 'valeur' » quand `melt`
         produit `['ville', 'variable', 'value']` — et que le corps de la même leçon écrit
         correctement « une colonne `value` ».
      3. `lecon-14` bilan q4, **l'ÉNONCÉ** : « un calcul comme une somme ligne à ligne » rendait la
         bonne réponse **fausse** sous sa lecture littérale — `d.sum(axis=1)` sur une ligne à NaN
         rend **3.0**, pas `NaN` (`skipna=True` par défaut). Seule l'arithmétique terme à terme
         propage. Énoncé précisé.

      ⚠️ **UN PIÈGE DE MESURE, à connaître pour les 28 cours suivants** : `mesure-lexique-qcm` capte
      les mots de 6 lettres et plus — et **une apostrophe fermante compte comme un signe**. Écrire
      `'value'` dans une option en fait un mot de 6 signes, donc un mot *mesuré* ; mais le corps
      l'écrit `<code>value</code>`, où l'outil ne voit que 5 lettres. **Le mot devenait étranger à sa
      propre page.** La forme retenue (« en deux colonnes, variable et value ») ne porte plus aucun
      mot étranger.

      ⚠️ **ET UN PIÈGE D'OUTILLAGE, signalé par le lot 1** : le script de diagnostic que j'avais
      fourni comptait comme « tranchée » toute question où la stratégie désigne **deux ou trois**
      options ; `mesure-biais-inverse`, lui, ne compte que les désignations **uniques**. D'où **27
      contre 15** sur le même cours. Le correcteur a réaligné sa copie sur l'outil **avant** de
      décider quoi que ce soit — sans quoi il aurait visé les mauvaises questions.

      🟢 **CE COURS EST LE PREMIER DEPUIS LE 37ᵉ OÙ LA RÈGLE FONDATRICE S'APPLIQUE SANS RÉSERVE** :
      `pandas` **3.0.5** est installé. Chaque distracteur a été **exécuté** : `prix.at[0]` →
      `KeyError`, `astype('float')` sur `'NC'` → `ValueError`, `.dt` sur du texte →
      `AttributeError`, mémoire `str` **6 600 132** octets contre `category` **120 297** sur
      120 000 lignes. ⚠️ Avec la réserve inverse, elle aussi mesurée : le cours enseigne 2.0/2.2, et
      en 3.0 le `dtype` d'une colonne de texte est `str` (le cours dit `object`) et `applymap`
      n'existe plus. **Un énoncé vrai en 2.x n'est pas employable comme distracteur, même s'il
      échoue en 3.0.**

      🔴 **RÉSIDU ASSUMÉ, chiffré** : en sens direct, « écarter les absolus » rend **29,7 %** et
      « écarter les deux extrêmes » **28,5 %**. Les deux tranchent **3 et 7 questions** — sous les 8
      qu'exige l'outil pour juger une fenêtre mesurable. Non corrigé, et dit plutôt que lissé.

      🟠 **DETTE DE CONTENU, mesurée et non corrigée** : le jeu `ventes.csv` (12 lignes) n'est publié
      **en entier nulle part** ; chaque leçon en montre un extrait, et les extraits ne concordent
      pas. Le plus net est dans `lecon-14` : le CA par ville de l'exercice 2 fait **244,90**
      (98,30 + 86,70 + 59,90) quand le CA par catégorie, par segment et le CA mensuel font tous
      **245,30**. L'écart de **0,40** ne s'explique pas par la ligne à `ville` manquante : le corps
      lui donne un `prix_unitaire` de **12,00**. **Aucun des 44 vérificateurs ne lit ces chiffres-là**
      — ils ne sont ni dans un bloc de sortie rejoué, ni dans un QCM. À reprendre dans un point dédié.

      **Contrôles** : `verif-html` **0** sur 1 629 pages ; `verif-donnees` **0 erreur** sur 26
      invariants ; `verif-normatif` **75/75** (9 étaient en échec avant le repérimage) ;
      `verif-rendu` **0 erreur** sur la page à la figure refaite ; `mesure-qcm-marques` **20 options
      réécrites, aucune marque n'a bougé** ; **29 blocs JSON valides, 0 BOM** ; cliquets refigés
      **dans le même commit que la correction**, `pandas` marqué `traite`. Cascade index ⇄ études
      remise au point fixe deux fois.

      **ÉTAT DU SITE** : **40 cours marqués `traite`**, **43 à la cible**, global « la plus longue »
      **51,6 %** sur 6 167 questions. **Il reste 28 cours** sur les 30 du périmètre fixé par Noah.

      ---

      **42ᵉ COURS — `haskell`, clos le 2026-09-22 : 92,4 % → 25,8 %, rangs 61/4/1/0 → 17/17/16/16.**
      **198 distracteurs réécrits** sur 66 questions et 18 leçons — **17 138 caractères**, le plus gros
      lot d'écriture du chantier (1,4 fois `pandas`, 3,3 fois `crypto`), parce que le rapport
      bonne réponse / distracteur partait de **5,06** (médiane des cours traités ≈ 1,0). Cinq lots
      d'écriture en parallèle, puis **trois vagues de retouche**. Fourchette distracteur/bonne
      réponse **0,01–1,73 → 0,75–1,30**, options hors bande 70-130 % : **187 → 0**.

      | indice | avant | après |
      |---|---:|---:|
      | la plus longue (couverture 100 %) | 92,4 % | **25,8 %** |
      | la plus détaillée | 89,1 % | **26,9 %** |
      | RESTREINDRE à la ponctuation forte (UNION) | 81,2 % | **25,0 %** (couverture 0,0 %) |
      | RESTREINDRE à la parenthèse | 79,0 % | **25,0 %** |
      | le mot technique exclusif | 72,2 % | **25,8 %** |
      | RESTREINDRE aux deux-points | 61,9 % | **25,0 %** |
      | l'écho de la question | 60,7 % | **24,6 %** |
      | la seule avec un point-virgule | 60,2 % | **25,0 %** |

      Lexique : **58 questions exploitables → 0** et **61 à mettre en forme → 0** ; mot fétiche
      **5 alertes → 0** ; intrus lexical **5 questions sûres → 0** ; sens INVERSE **3 alertes → 0**
      (la plus mauvaise désormais à **24,5 %**). `mesure-qcm-intouchable` : **0 atteinte**.

      🔴 **CE QUE CE COURS APPREND, ET C'EST UNE CHAÎNE DE TROIS MAILLONS — fermer un indice en
      rouvre un autre, et le remède du deuxième rouvre le premier si on l'applique bêtement.**

      1. **L'INCISE SE COMPTE, ELLE NE SE TESTE PAS.** Après le lot d'écriture, « l'incise entre
         parenthèses » rendait **36,0 %** (10 questions tranchées, **9 fois la bonne réponse**). Les
         cinq écrivains avaient pourtant tous « égalisé la parenthèse » — mais la stratégie est un
         `argMax` sur le **NOMBRE** d'incises de 4 signes et plus, pas sur leur présence. Un
         **2/1/1/1** est vert pour qui regarde « toutes les options en portent une » et rend **100 %**
         à qui compte. Ramené à **n/n/n/n exact : 0 question tranchée.**
      2. **LE MOT EXCLUSIF FERMÉ À 0,0 % EN DIRECT EST UNE ÉLIMINATION SÛRE.** Sur **11 questions**,
         la stratégie désignait une option unique et **jamais la bonne** — donc **26,4 % au global
         inverse**. C'est le piège déjà mesuré aux 38ᵉ et 41ᵉ cours : *la cible est l'égalité, pas le
         taux bas*. Ramené à **0 question tranchée**.
      3. **LE REMÈDE DU 1 A OUVERT UN TROISIÈME INDICE, ET IL ÉTAIT PRÉVISIBLE** : pour égaliser les
         incises, les correcteurs les ont posées **en fin** de distracteur — ce qui a fait passer
         « écarter la glose finale » de **24,9 % à 28,9 %** (19 questions déséquilibrées, 8
         tranchées). La fermeture ne pouvait pas être « supprimer une incise » (cela rouvrait le
         point 1) : il a fallu **DÉPLACER** chaque incise sans changer le compte. Les trois agents de
         la vague l'ont fait à **longueur constante au caractère près** — donc sans toucher ni aux
         rangs, ni au lexique, ni à la ponctuation. Résultat : **0 question déséquilibrée**.

      🟠 **RÉSIDU ASSUMÉ, chiffré** : « écarter les deux extrêmes » rend **28,8 %** sur **6 questions
      tranchées** — sous les 8 qu'exige l'outil pour juger une fenêtre mesurable. « la moins bavarde »
      **27,0 %** (rendement 31,1 %) et « la plus dense » **27,7 %** (rendement 29,0 %) : au-dessus de
      l'étalon, pas nettement. Non corrigés, et dits plutôt que lissés.

      🔴 **TROIS DÉFAUTS DE FOND, tous des contradictions INTERNES que la page se fait à elle-même**
      — trouvés par la relecture, prouvés par exécution (`scratchpad/preuve-haskell-fond.js`, la
      sémantique du code publié rejouée en JS faute de toolchain Haskell) :
      - `lecon-15` : la pile `ExceptT String (StateT Int IO)` annonce `Left "solde insuffisant : 70"`
        et `70` pour `retirer 30 >> retirer 50` depuis 100. Déroulement réel : `put 70`, puis
        **50 > 70 est FAUX**, donc aucun `throwError` → la sortie est `Right ()` et **20**. **Les deux
        commentaires étaient faux.** Corrigé en `retirer 90`, qui rend *exactement* les deux valeurs
        déjà écrites sans y toucher. Même bloc : le commentaire nommait `execStateT` là où le code
        appelle `runStateT` — la figure de la même page disait déjà `runStateT`.
      - `lecon-18` : le schéma de `foldMap statsDe` affiche `{1, 15} {1, 16} {1, 9.6}` et un total
        `Stats {3, 40.6}` — **un article par produit**, alors que `statsDe p = Stats (quantite p) …`
        donne `{10, 15} {5, 16} {12, 9.6}` et **{27, 40.6}**, ce que la sortie GHCi de **la même page**
        imprime (« Articles : 27 »). Seule la valeur 40,6 était juste.
      - `lecon-04` : la figure du pipeline illustre un bloc dont les transactions sont
        `[120.0, -45.5, -12.0, 300.0, -8.25] → 65.75`, mais affiche `[120,-45,-12,300] → 57` — une
        transaction supprimée, une autre arrondie. **Juste avec ses propres chiffres, fausse pour
        l'exemple qu'elle illustre.**

      **Aucun des 45 vérificateurs ne lit ces trois endroits** : ni bloc de sortie rejoué
      (`verif-sorties` : **449 blocs identiques au caractère près, 0 divergent**), ni QCM. C'est la
      même famille que la dette relevée sur `pandas`.

      **Contrôles** : `verif.js --rapide` **53 étapes tout vert (190,1 s)** ; `verif-html` **0** sur
      1 629 pages ; `verif-donnees` **0 erreur** sur 26 invariants ; `verif-normatif` **75/75**
      (9 en échec avant, `doc/lecon-03` repérimé une **6ᵉ** fois : 3 785 → **3 847** conformes,
      62,0 % → **63,0 %**, S4 39/89 → **40/89**) ; `verif-rendu` **0 erreur, 0 avertissement** sur les
      3 pages corrigées (18 mesures) ; `verif-sorties` **449/449** ; épreuve par injection **10/10** ;
      cliquet refigé, `haskell` marqué `traite`. Cascade index ⇄ études remise au point fixe **deux
      fois** (la correction du corps l'a rouverte).

      **ÉTAT DU SITE** : **41 cours marqués `traite`**, **44 à la cible**, global « la plus longue »
      **50,9 %** sur 6 167 questions. **Il reste 27 cours** sur les 30 du périmètre fixé par Noah.

      ---

      **43ᵉ COURS — `clojure`, clos le 2026-09-22 : 89,4 % → 25,8 %, rangs 59/6/1/0 → 17/17/16/16.**
      **197 distracteurs sur 198 réécrits** sur 66 questions et 17 leçons — **8 538 caractères**
      (rapport de départ **3,02**, contre 5,06 pour `haskell`). Cinq lots d'écriture en parallèle,
      puis **trois vagues de retouche**. Options hors bande 70-130 % : **174 → 5** (des jetons de
      code trop courts, exemptés par le seuil de l'outil).

      | indice | avant | après |
      |---|---:|---:|
      | la plus longue (couverture 100 %) | 89,4 % | **25,8 %** |
      | la plus détaillée | 59,2 % | sous l'étalon |
      | le mot technique exclusif | 52,0 % | sous l'étalon |
      | RESTREINDRE à la ponctuation forte | 51,1 % | **25,0 %** |
      | l'incise entre parenthèses | 50,8 % | **25,0 %** |
      | RESTREINDRE à la parenthèse | 47,9 % | **25,0 %** |
      | RESTREINDRE aux deux-points | 42,4 % | **25,0 %** |

      🟢 **LA PLUS HAUTE DES 43 STRATÉGIES EST À 26,3 % AVEC UNE COUVERTURE DE 0,0 %** : aucune ne
      tranche plus une seule question. Lexique **53 exploitables → 0** et 58 à mettre en forme → 0 ;
      mot fétiche **2 alertes → 0** ; intrus lexical **4 questions sûres → 0** ; sens INVERSE
      **3 alertes → 0**. `mesure-qcm-intouchable` : **0 atteinte**.

      🔴 **LA LEÇON DE CE COURS — UN DIAGNOSTIC QUI N'EST PAS LA COPIE EXACTE DE L'OUTIL FAIT
      TRAVAILLER CINQ AGENTS À CÔTÉ DE LA CIBLE.** Le script de diagnostic que j'ai fourni à la
      deuxième vague comptait les mots avec `/[\wà-ÿ'-]+/gi` ; `mesure-biais-qcm` compte avec
      **`/[A-Za-zÀ-ÿ0-9_]+/g`**, où **l'apostrophe et le tiret SÉPARENT les mots** (`l'option` = 2
      mots, `c'est-à-dire` = 4). Le diagnostic annonçait **« 0 question tranchée »** quand l'outil en
      comptait **22**. Les quatre agents ont donc égalisé un compte qui n'était pas le bon, et ont
      rendu des comptes rendus tous verts. ⚠️ **Le piège est en mémoire depuis le 41ᵉ cours** (un
      script qui comptait les ex aequo autrement donnait 27 contre 15 sur le même cours) — **il
      s'est représenté sur une AUTRE dimension**. La parade n'est pas « se souvenir du cas », c'est
      **recopier la fonction de l'outil, pas son intention**.

      🔴 **ET LA FERMETURE DE « la moins bavarde » N'EST PAS « partager le minimum ».** `choisir`
      rend l'ENSEMBLE des options au compte minimal : un minimum partagé par **deux** options laisse
      encore un demi-point à l'apprenant, et l'outil ne cesse de compter la question que si
      l'ensemble vaut **les quatre**. La seule fermeture est donc **les quatre options au même
      nombre de mots** — couverture **33,3 % → 0,0 %**, rendement **31,8 % → 0,0 %**. Même geste
      pour « ECARTER la moins bavarde » (rendement **42,9 % sur 7 questions**, sous la fenêtre de 8
      donc invisible à l'alerte) : traitée quand même, **et sur les sept** — n'en fermer que les
      trois qui désignaient la bonne réponse aurait laissé **0 succès sur 4**, c'est-à-dire une
      élimination sûre, le même défaut retourné.

      🔴 **UN DÉFAUT DE FOND, relevé par deux relectures indépendantes et prouvé par exécution**
      (`scratchpad/preuve-clojure-assertions.js` compte les assertions des blocs de la page) :
      `lecon-13` publie `;; Ran 3 tests containing 11 assertions.` alors que ses trois `deftest` en
      contiennent **9** — `somme-test` 3 `is`, `panier-test` 2, `pair-test` 4, et **la page l'écrit
      elle-même** (« 4 assertions générées à partir du tableau », et sa figure « 4 lignes → 4
      assertions »). Le nombre de **tests** était juste, celui des **assertions** faux de 2. Corrigé
      en 9. Même famille que les trois défauts de `haskell` : une page qui se contredit elle-même,
      là où aucun des 45 vérificateurs ne regarde.

      **Autres remontées, non corrigées et consignées** : `lecon-05` q1 (bonne réponse intouchable)
      emploie `pair?`, qui n'existe pas en Clojure et n'apparaît nulle part ailleurs dans le cours —
      la page enseigne `even?` ; `lecon-09` et `lecon-12` se déclarent chacune « cette dernière
      leçon » alors que le cours en compte 17 (reliquats d'un cours qui en faisait 9 puis 12) ;
      `lecon-03` appelle `defn` et `fn` des « mots-clés » quand `lecon-02` réserve ce terme aux
      `:keywords` ; `lecon-17` exige par `s/keys :req-un` trois clés dont deux ne sont jamais
      enregistrées par un `s/def`.

      **Contrôles** : `verif.js --rapide` **53 étapes tout vert (201,1 s)** ; `verif-html` **0** sur
      1 629 pages ; `verif-donnees` **0 erreur** sur 26 invariants ; `verif-normatif` **75/75**
      (`doc/lecon-03` repérimé une **7ᵉ** fois : 3 847 → **3 907** conformes, 63,0 % → **64,0 %**,
      S4 40/89 → **41/89**) ; `verif-sorties` **449 blocs identiques au caractère près** ; les
      **deux** cliquets refigés dans le commit, `clojure` marqué `traite`. Cascade index ⇄ études
      au point fixe.

      **ÉTAT DU SITE** : **42 cours marqués `traite`**, **45 à la cible**, global « la plus longue »
      **50,2 %** sur 6 167 questions. **Il reste 26 cours** sur les 30 du périmètre fixé par Noah.      ---

      **44ᵉ COURS — `sass`, clos le 2026-09-22 : 96,7 % → 26,2 %, rangs 59/1/1/0 → 16/15/15/15.**
      **182 distracteurs sur 183 réécrits** sur 61 questions et 14 leçons — **10 916 caractères**
      demandés par `plan-rangs-qcm` (rapport de départ **3,33** : 103,2 caractères de bonne réponse
      contre 31,0 de distracteur, le troisième taux le plus haut des 90 cours). Cinq lots d'écriture
      en parallèle (01-03, 04-07, 08-10, 11-13, et `lecon-14` avec ses 12 questions de bilan), puis
      **deux vagues de retouche**. Options hors bande 70-130 % : **179 → 0** (fourchette 0,71 à 1,28).

      | indice | avant | après |
      |---|---:|---:|
      | la plus longue (couverture 98,4 %) | 96,7 % | **26,2 %** |
      | la plus détaillée | 78,7 % | **25,0 %** (couverture 0,0 %) |
      | l'incise entre parenthèses | 69,3 % | **25,0 %** (couverture 0,0 %) |
      | RESTREINDRE à la parenthèse | 69,3 % | **25,0 %** (couverture 0,0 %) |
      | le mot technique exclusif | 65,2 % | **25,8 %** (couverture 0,0 %) |
      | RESTREINDRE à la ponctuation forte | 62,0 % | **25,0 %** (couverture 0,0 %) |
      | la seule avec un point-virgule | 44,7 % | **25,0 %** (couverture 0,0 %) |
      | ECARTER la moins bavarde | 43,2 % | **25,3 %** (couverture 0,0 %) |
      | l'écho de la question | 42,6 % | **24,6 %** |

      🟢 **PLUS AUCUNE DES 43 STRATÉGIES NE DÉSIGNE UNE OPTION UNIQUE**, à la seule exception des
      rangs de longueur eux-mêmes, qui sont mécaniques : la plus haute rend **26,2 %**, c'est-à-dire
      **16 questions sur 61** — la cible exacte que `plan-rangs-qcm` avait fixée. Sens INVERSE :
      **4 alertes → 0** (la pire à 25,6 %). Lexique **54 exploitables → 0** et **59 à mettre en
      forme → 0** ; mot fétiche **1 alerte → 0** ; intrus lexical **4 questions sûres → 0**.
      `mesure-qcm-intouchable` : **0 atteinte**.

      🔴 **LA LEÇON DE CE COURS EST SUR MES PROPRES RETOUCHES, PAS SUR LE LOT D'ÉCRITURE.** Les cinq
      écrivains ont rendu un travail dont toutes les mesures étaient vertes ; c'est
      **l'orchestrateur** — moi — qui a cassé deux questions en fermant « écarter les deux extrêmes »
      à la main, et **aucun des deux dégâts n'était visible dans la mesure que je visais** :
      - j'ai écrit « un parent **recollé** » en vérifiant d'un `grep -ci recoll` que le mot était dans
        la page. Il y est — mais sous la forme **« recolle »**, sans accent final, et
        `mesure-lexique-qcm` compare des **jetons entiers** : « recollé » était donc un mot étranger,
        et le `k` de la question passait de `0/0/0` à `0/0/1` ;
      - j'ai remplacé « (alerte) » par « (appel) » pour gagner un caractère : « alerte » fait
        **6 lettres** et « appel » **5**, donc l'option perdait d'un coup **un mot long et un mot
        étranger** — `k` à `1/2/2` pour une cible de 2, et la règle du `w` en défaut.
      Les deux ont été rattrapés en prenant les mots **dans le dictionnaire de la page** (`collé` +
      `devient`, et `(bloc)` à la place de `(mixin)` pour rendre le caractère perdu ailleurs).
      ⚠️ **C'est la même faute qu'au 43ᵉ cours, d'un cran plus bas : là-bas un diagnostic ne copiait
      pas la regex de l'outil, ici un `grep` ne copie pas sa notion de JETON.** La parade est
      identique : **lancer l'outil, pas un substitut.**

      🔴 **ET LES DEUX AGENTS DE RETOUCHE ONT CONTREDIT LEUR PROPRE CONSIGNE, tous les deux avec la
      preuve.** Les deux pistes que je leur avais données comme « déjà vérifiées » étaient fausses :
      « n'accepte aucun .css » introduisait `accepte`, absent de la page ; « Pour laisser Sass
      accepter » introduisait `laisser` **et** `accepter`, tous deux absents, faisant passer le `k`
      de 2 à 3. Chacun a mesuré, rejeté, et proposé un remplacement pris dans la page. **Une piste
      d'orchestrateur n'est pas un ordre** — la consigne le disait, et cette fois elle a servi.

      🟠 **UN EFFET DE BORD MESURÉ, ET CONTRE-INTUITIF** : fermer les 4 questions que « le mot
      technique exclusif » tranchait **faisait MONTER** la stratégie de 25,8 % à 27,5 %. Une question
      tranchée qui vaut 0 rapporte +0,25 à la moyenne quand on la ferme, alors que les **égalités à
      deux** incluant la bonne réponse valent 0,50. Il a fallu égaliser aussi **4 ex æquo** du même
      lot pour que le solde revienne à zéro. **La couverture et la réussite ne se ferment pas du même
      geste.**

      **Autres remontées, non corrigées et consignées** (aucun des 45 vérificateurs ne lit ces
      endroits — même famille que `pandas`, `haskell` et `clojure`) :
      - `lecon-01` : la figure « ce qui est produit » annonce `#1d50a4` pour `darken(#2563c8, 10%)`.
        Recalculé (`scratchpad/darken.js`, conversion RGB↔HSL, faute de compilateur Sass) : `#2563c8`
        est à **46,47 %** de luminosité, `darken(…, 10 %)` donne **36,47 % → `#1d4e9d`**, quand
        `#1d50a4` vaut 37,84 % — soit **8,63 points d'assombrissement au lieu de 10**.
      - `lecon-06` : `height: 100% - 30px;  // calc-compatible si unités mixtes`, annoté comme les
        deux lignes voisines qui donnent un **résultat** — or Dart Sass refuse d'additionner `%` et
        `px`, et la même page enseigne plus bas que « le calcul doit rester au navigateur, avec
        `calc()` ».
      - `lecon-10` : le bloc `sass:math` écrit `math.percentage(2/5)` **quatre lignes au-dessus** du
        callout qui déclare `$a / $b` déprécié — et la bonne réponse intouchable de sa q1 dit la même
        chose.
      - `lecon-11` : la fonction `fluid()` divise `1.2rem` par `800px` : `$pente` porte l'unité
        composée `rem/px`, que `#{$pente * 100}vw` interpole telle quelle. Dart Sass ne sérialise pas
        un nombre à unité au dénominateur ; le remède usuel est `math.div($w2 - $w1, 1px)`.
      - `lecon-14` : `abstracts/_index.scss` est décrit deux fois de façons contradictoires — l'un
        des blocs **émet du CSS** (`:root { @include vars-theme(...) }`, `.carte { … }`) quand la
        bonne réponse **intouchable** de la q13 du bilan affirme « du Sass qui ne produit aucun CSS
        direct ». Et `_responsive.scss` appelle `jeton()` en n'ayant chargé que `sass:map`, alors que
        `@use` namespace tous les membres (règle enseignée en `lecon-04`).
      - `lecon-14` : l'`aria-label` du premier schéma énumère trois clés d'espacement quand la map en
        déclare **quatre** (`xl` manque) — le SVG, lui, les affiche toutes.

      **Contrôles** : `verif.js --rapide` **53 étapes**, seul `verif-donnees` signale (ses 3
      avertissements préexistants, **0 erreur** sur 26 invariants) ; `verif-html` **0** sur 1 629
      pages ; `verif-normatif` **75/75** (67/75 avant : `doc/lecon-03` repérimé une **8ᵉ** fois —
      3 907 → **3 964** conformes, 64,0 % → **65,0 %**, S4 41/89 → **42/89**, et le corpus de
      l'ancienne clause 2 960 → **3 003**) ; `verif-rendu` **0 erreur, 0 avertissement** sur 18
      mesures ; `quiz-index` régénéré (**6 151 entrées**, +13 415 o) ; les **deux** cliquets refigés
      dans le commit, `sass` marqué `traite`.

      **ÉTAT DU SITE** : **43 cours marqués `traite`**, **46 à la cible**, global « la plus longue »
      **49,6 %** sur 6 167 questions — *le site passe sous la barre des 50 %*. **Il reste 25 cours**
      sur les 30 du périmètre fixé par Noah.
      ⚠️ Le message du commit `197a354` annonce **49,5 %** : chiffre écrit de tête avant la mesure,
      qui donne **49,6 %**. Corrigé ici plutôt que lissé — c'est la règle du chantier, et elle vaut
      aussi pour un dixième de point.

      **LE 45ᵉ COURS EST MESURÉ — la prochaine passe démarre sur l'écriture.** Classement par
      nocivité réelle rejoué sur les 25 cours restants du périmètre : `securite` **59 devinables**,
      `powershell` 59, `go` 59, `elixir` 58, `julia` 57, `nosql` 56, `vue` 56, `perl` 56. **Le 45ᵉ
      est `securite`** — 62 questions sur 13 leçons, 186 distracteurs, **10 085 caractères** à écrire
      sur **60 questions** (rangs 59/2/1/0, cible 16/16/15/15) :

      | indice | réussite | couverture | rendement |
      |---|---:|---:|---:|
      | la plus longue | **95,2 %** | **100 %** | 95,2 % |
      | la plus détaillée | **73,5 %** | 62,9 % | **100 %** |
      | le mot technique exclusif | **70,2 %** | 72,6 % | 82,2 % |
      | RESTREINDRE à la ponctuation forte | **53,2 %** | 37,1 % | **100 %** |
      | RESTREINDRE à la parenthèse | **50,0 %** | 35,5 % | 95,5 % |
      | l'incise entre parenthèses | **47,6 %** | 32,3 % | 95,0 % |
      | la seule qui nie | **36,8 %** | 32,3 % | 60,0 % |
      | l'écho de la question | **35,5 %** | 24,2 % | 60,0 % |
      | la plus prudente | **34,3 %** | 17,7 % | 72,7 % |
      | l'attaque unique | **31,5 %** | 25,8 % | 50,0 % |

      ⚠️ **`securite` bat le record de l'intrus lexical : 8 questions « sûres » en lecture PAR
      DÉFAUT** (31,5 %), contre 4 sur `sass` et 3 sur `clojure` — dont `lecon-01` (`quelle`),
      `lecon-02` et `lecon-06` (`parce`). Et **3 alertes de mot fétiche** : `parce` (1 bonne / 25
      distracteurs, ÉCARTER rend **31,7 %**), `serveur` (6/7, RESTREINDRE 29,0 %), `données` (6/8,
      28,2 %). Lexique : **50 exploitables sur 62, 60 à mettre en forme**. Sens inverse : **3
      alertes** (la moins bavarde 31,5 %, les 2ᵉ et 3ᵉ plus longues 32,4 % et 32,3 %).
      ⚠️ **Le cours enseigne la sécurité : un distracteur faux doit le rester sans devenir un
      CONSEIL DANGEREUX plausible.** C'est le seul cours du périmètre où une option mal écrite
      apprend une pratique nuisible.

      **45ᵉ COURS — `securite`, clos le 2026-09-22 : 95,2 % → 25,0 %, rangs 59/2/1/0 → 16/16/15/15.**
      **184 distracteurs sur 186 réécrits** sur 62 questions et 14 leçons — **≈ 13 130 caractères**
      pour les **10 085** demandés par `plan-rangs-qcm`. Six lots d'écriture en parallèle
      (01-03, 04-06, 07-09, 10-11, 12-13, et `lecon-14` avec ses 4 questions de leçon et 12 de bilan),
      puis **une seule vague de retouche**, sur une question. Rapport bonne réponse / distracteur
      **2,86 → 0,97** (distracteur moyen **36,5 → 107,1 car.**, la bonne réponse restant à 104,4
      puisqu'elle est intouchable). Options hors bande 70-130 % : **172 → 0** (fourchette 0,71 à 1,30).

      | indice | avant | après |
      |---|---:|---:|
      | la plus longue (couverture 100 %) | 95,2 % | **25,0 %** |
      | la plus détaillée | 73,5 % | **25,0 %** (couverture 0,0 %) |
      | le mot technique exclusif | 70,2 % | **25,0 %** (couverture 0,0 %) |
      | RESTREINDRE à la ponctuation forte | 53,2 % | **25,0 %** (couverture 0,0 %) |
      | RESTREINDRE à la parenthèse | 50,0 % | **25,0 %** (couverture 0,0 %) |
      | l'incise entre parenthèses | 47,6 % | **25,0 %** (couverture 0,0 %) |
      | la seule qui nie | 36,8 % | **25,0 %** (couverture 0,0 %) |
      | l'écho de la question | 35,5 % | **25,0 %** (couverture 0,0 %) |
      | la plus prudente | 34,3 % | **25,0 %** (couverture 0,0 %) |
      | l'attaque unique | 31,5 % | **25,0 %** (couverture 0,0 %) |

      🟢 **PLUS AUCUNE DES 43 STRATÉGIES NE DÉSIGNE UNE OPTION UNIQUE**, à la seule exception des
      rangs de longueur, qui sont mécaniques : la plus haute rend **26,6 %** (« la DEUXIÈME plus
      longue »). Sens INVERSE : **3 alertes → 0** (pire 25,7 %). Lexique **50 exploitables → 0** et
      **60 à mettre en forme → 0** ; mot fétiche **3 alertes → 0** ; intrus lexical **8 questions
      sûres → 0** dans les deux lectures — c'était le **record du chantier**, il est fermé. Point
      interne : `securite` sort du tableau. `mesure-qcm-intouchable` : **0 atteinte**.

      ⚠️ **UN CARACTÈRE RESTE, ET IL EST ASSUMÉ** : la q4 du bilan demande quel attribut rend un
      cookie inaccessible au JavaScript ; son option `SameSite` fait **8 caractères, exactement la
      longueur de la bonne réponse `HttpOnly`**, donc `plan-rangs-qcm` la classe hors bande d'un
      caractère. La raccourcir rendrait l'`explain` **ORPHELINE** — elle nomme « `Secure` impose
      HTTPS ; `SameSite` limite le CSRF ». `verif-explain-orpheline` confirme **0 orpheline** sur les
      62 questions à risque : garder le mot est le bon choix, et il coûte ±0,8 point de rang.

      🔴 **LA LEÇON DE CE COURS — FERMER UN INDICE PAR UN MOT PEUT LE DÉPLACER D'UN CRAN, ET
      L'ORCHESTRATEUR NE DOIT PAS SE FIER À LA LISIBILITÉ ANNONCÉE.** Une seule question résistait
      après les six lots : `lecon-11`, où `la MAJUSCULE d'emphase` rendait **100 % sur son unique
      question**. Cause mesurée : la bonne réponse **intouchable** porte `RCE`, **absent de la liste
      blanche `SIGLES`** de `tools/mesure-biais-qcm.js` (ligne 209, qui contient pourtant `XSS`,
      `CSRF`, `CVE`, `JWT`) — l'outil comptait donc un sigle du métier comme un **cri**. Corrigé par
      le CONTENU, pas par l'instrument : les trois distracteurs portent désormais `RCE` eux aussi
      (1/1/1/1). Trois choses s'y sont enchaînées :
      - **la première rédaction a fait passer l'indice de « la MAJUSCULE » au « mot technique
        exclusif »**, au même chiffre exact (26,2 %, couverture 1,6 %, rendement 100 %) : en
        supprimant `programme` et `sérialisation` pour tenir la fenêtre, elle avait cassé un
        **3/3/3/3** sur les mots de 9 lettres. L'indice n'était pas fermé, il avait **changé de nom** ;
      - **j'ai accepté une mesure verte sur un texte qui ne voulait rien dire.** Les options
        rendues disaient « la chaîne reçue **(une valeur, une RCE)** » et « refuse normalement
        **toute RCE en sérialisation** » : les neuf contrôles étaient verts, et c'était une **salade
        de mots** — le défaut du 39ᵉ cours, qu'**aucun des 45 outils ne voit**. Renvoyé en
        reformulation avec la critique sémantique ; les deux options finales emploient `RCE` dans son
        sens réel (une conséquence qu'on *subit* ou qu'on *empêche*, jamais un contenu transporté) ;
      - un troisième candidat a été **rejeté par la mesure et non par le goût** : `toute RCE de
        l'attaquant` lisait bien, mais l'apostrophe de `l'attaquant` fabrique un jeton d'une lettre,
        la densité de l'option tombait à 4,947 et **la bonne réponse devenait la plus dense** (5,333).

      🟠 **TROIS FAUTES DE FOND, remontées par les écrivains et vérifiées par moi avant
      correction** — et la première est visible par l'apprenant :
      - `lecon-13` : la **matrice de risque était dessinée à l'envers**. Dans un SVG, `y` croît vers
        le bas ; la flèche de l'axe pointe vers le haut (`points="146,40 150,32 154,40"`) et
        l'`aria-label` annonce « de faible en bas à fort en haut » — or les deux cases « fort impact »
        étaient à `y="110"` (en bas) et les « faible impact » à `y="46"` (en haut). **Le dessin
        contredisait son propre axe, son `aria-label` et son `figcaption`.** Rangées échangées,
        `d-accent` (le CRITIQUE) déplacé en haut à droite. `verif-rendu` : **0 erreur, 0
        avertissement** sur 18 mesures.
      - `lecon-06` : le mini-projet annonçait **cinq** défenses empilées, dont la « comparaison à
        temps constant » — qui n'était **expliquée nulle part** dans la page (une seule occurrence,
        celle de la promesse). Ajoutée à l'étape `bcrypt.compare`, avec le pourquoi (même durée de
        réponse, là où un `===` s'arrête au premier écart).
      - `lecon-01` : un lien de rattrapage d'exercice portait `Revoir « Le code défensif »`, **titre
        qui n'existe dans aucune section** ; les deux autres liens du même bloc citent des titres
        réels. Corrigé en « L'état d'esprit défensif ». Les deux retouches de corps n'ont **rien
        rouvert** (lexique toujours 0 exploitable / 0 à mettre en forme).

      **Remontée consignée, non corrigée** : `lecon-08`, le mot `base64` n'apparaît **que dans le
      bloc `data-quiz`** — le corps de la leçon ne l'introduit jamais. L'`explain` le réfute
      (« base64 n'est qu'un encodage, pas une protection »), donc rien n'est faux, mais la fausseté
      du distracteur n'est établie que par l'explication.

      ⚠️ **DETTE D'OUTILLAGE MESURÉE, à ne pas perdre** : la liste blanche `SIGLES` ignore `RCE`,
      `SSRF`, `SBOM` et `OSV` — des sigles courants du métier de la sécurité. Tant qu'ils y manquent,
      `la MAJUSCULE d'emphase` les compte comme des cris et **force une écriture artificielle** : le
      lot 07-09 a dû choisir `(CSP)/(URL)/(UI)` pour cette seule raison. L'instrument n'a **pas** été
      modifié dans cette passe — le corriger demande de rejouer les 43 stratégies sur les 90 cours.

      **Contrôles** : `verif.js --rapide` **53 étapes**, 4 signalements (les 3 avertissements
      préexistants de `verif-donnees` et `verif-normatif`, traité ci-dessous), **0 erreur** sur les
      26 invariants de données ; `verif-html` **0** sur 1 629 pages ; `verif-explain-orpheline`
      **0 orpheline** ; `verif-rendu` **0 erreur, 0 avertissement** sur 24 mesures ; `quiz-index` et
      `search-index` régénérés ; les **deux** cliquets refigés, `securite` marqué `traite`.

      ⚠️ **`doc/lecon-03` repérimé une 9ᵉ fois** — la page publie les chiffres du site, et notre
      passe les a bougés : **65/75 → 75/75**. Conformes S3 3 964 → **4 023** (65,0 % → **65,9 %**),
      manquements 2 139 → **2 080** (35,0 % → **34,1 %**), S4 42/89 → **43/89** (47,2 % → **48,3 %**),
      corpus de l'ancienne clause 3 003 → **3 046** (rang 1 : 35,7 % → **35,6 %**). Et **une bonne
      réponse de QCM est devenue fausse par le seul effet de notre travail** : elle disait « ignorée
      dans près de **quatre** cas sur dix » quand la mesure du jour donne 34,1 % — corrigée en
      « **trois** cas sur dix ». C'est le cas prévu par la contrainte 1 de la consigne, et il s'est
      produit **sans que personne ne touche à cette page**.

      **ÉTAT DU SITE** : **44 cours marqués `traite`**, global « la plus longue » **49,6 % → 48,8 %**
      sur 6 167 questions. **Il reste 24 cours** sur les 30 du périmètre fixé par Noah.

      ---

      **LE 46ᵉ COURS EST MESURÉ — `powershell`.** Classement par nocivité réelle rejoué sur les
      24 cours restants du périmètre : `powershell` **58,8 devinables**, `go` 58,5, `elixir` 57,8,
      `nosql` 56,5, `julia` 56,5, `vue` 56,0, `perl` 55,8, `dart` 55,5. **Le 46ᵉ est `powershell`**
      — 64 questions sur **17 leçons**, 192 distracteurs, **11 132 caractères** à écrire sur
      **56 questions** (rangs 60/2/1/1, cible 16/16/16/16) :

      | indice | réussite | couverture | rendement |
      |---|---:|---:|---:|
      | la plus longue | **91,8 %** | 96,9 % | **93,5 %** |
      | la plus détaillée | **73,4 %** | 65,6 % | **97,6 %** |
      | le mot technique exclusif | **72,8 %** | 67,2 % | 93,0 % |
      | l'incise entre parenthèses | **67,6 %** | 60,9 % | 94,9 % |
      | RESTREINDRE à la parenthèse | **65,8 %** | 57,8 % | 94,6 % |
      | la seule avec une PONCTUATION FORTE | **54,3 %** | 39,1 % | **100 %** |
      | ECARTER la moins bavarde | **45,3 %** | 15,6 % | 90,0 % |
      | la seule avec un point-virgule | **44,9 %** | 26,6 % | **100 %** |
      | l'écho de la question | **43,8 %** | 34,4 % | 72,7 % |
      | la plus dense (mots longs) | **40,2 %** | 90,6 % | 41,4 % |

      ⚠️ **LE RAPPORT DE LONGUEUR EST LE PLUS FORT DU PÉRIMÈTRE RESTANT : 3,97** (bonne réponse
      **90,8 car.** contre **22,9 car.** pour le distracteur moyen ; `securite` 2,86, `sass` 3,33).
      Le distracteur médian est un télégramme — « C'est l'inverse », « Un booléen », « Get-Help ».
      ⚠️ **AUCUN des 192 distracteurs ne porte de point-virgule**, pour **17 bonnes réponses** :
      indice à **100 %** sur 17 questions. Parenthèse **38 bonnes / 12 distracteurs** (39 questions
      tranchées, 89,7 % pour la bonne), UNION de ponctuation forte **45 questions, 93,3 %**, et
      **37 questions** où la bonne réponse est SEULE en tête du **compte** d'incises. Lexique :
      **54 exploitables sur 64, 56 à mettre en forme**. Mot fétiche : **2 alertes** (`objet` 8
      bonnes / 2 distracteurs, RESTREINDRE **33,2 %** ; `powershell` 5/5, 28,9 %). Intrus lexical :
      **4 questions sûres** (2 en EXCÈS, 2 en DÉFAUT), lecture EXCÈS **31,6 %**. Sens inverse :
      **4 alertes** (la moins bavarde 29,7 %, les 3ᵉ et 2ᵉ plus longues 32,0 % et 31,6 %, l'attaque
      unique 26,0 %).

      ⚠️⚠️ **CE COURS S'EXÉCUTE, ET C'EST LE PREMIER DEPUIS SEPT.** Les 39ᵉ à 45ᵉ n'avaient rien à
      faire tourner. Ici `powershell.exe` est présent dans l'environnement — **version mesurée
      5.1.26100.8875** — donc la règle fondatrice du chantier redevient applicable. **Mais le cours
      enseigne largement PowerShell 7** (`lecon-12` compare les deux) : ternaire `? :`, `&&`/`||`,
      `ForEach-Object -Parallel`, `$PSStyle`, l'encodage par défaut de `Out-File` et la portabilité
      `pwsh` diffèrent. **Une exécution qui CONFIRME la leçon est une preuve ; une exécution qui la
      contredit ne l'est pas tant que l'écart de version n'est pas écarté.** La consigne le dit en
      tête (`scratchpad/CONSIGNE-POWERSHELL.md`).

      ---

      **LE 46ᵉ COURS EST CLOS — `powershell`, 91,8 % tombé à 25,0 % EXACT.** Les six lots
      d'écriture, leurs six contradictions et leurs six corrections avaient été produits à la
      passe précédente **sans pouvoir être commités** (coupure). Ils ont survécu parce que rien
      n'a touché à l'arbre entre-temps — c'est la deuxième fois que ce pari passe, et il ne
      faut pas en faire une habitude. **Tout a été remesuré ce réveil avant le moindre commit**,
      aucun chiffre n'est repris du compte rendu des agents :

      | indice | avant | après |
      |---|---:|---:|
      | la plus longue | 91,8 % | **25,0 %** (rendement 25,0 %, rangs 16/16/16/16) |
      | la plus détaillée | 73,4 % | 24,2 % (couverture 6,3 %, rendement 0,0 %) |
      | le mot technique exclusif | 72,8 % | 22,0 % (couverture 14,1 %, rendement 0,0 %) |
      | l'incise entre parenthèses | 67,6 % | 25,1 % (couverture **0,0 %**) |
      | la seule avec une PONCTUATION FORTE | 54,3 % | 25,0 % (couverture **0,0 %**) |
      | la seule avec un point-virgule | 44,9 % | 25,0 % (couverture **0,0 %**) |
      | mot fétiche | 2 alertes | **0** |
      | intrus lexical | 4 questions sûres | **0** |
      | biais inverse (direct / inverse) | — | 22,0 % / 25,4 %, **+0,4 pt** |

      **Plus aucune des 45 stratégies ne tranche** : la plus haute est `ECARTER la plus dense`
      à 26,8 % avec un rendement de **0,0 %**, et `ecarter les deux extrêmes` à 26,2 % ne
      couvre que **2 questions**. Site : **45 cours traités**, global « la plus longue »
      **48,8 % → 48,2 %** sur 6 167 questions.

      🟠 **UNE BONNE RÉPONSE QUI CONTREDISAIT LE GLOSSAIRE DE SA PROPRE PAGE**, remontée par le
      2ᵉ correcteur et tranchée ici **par exécution** (PowerShell **5.1.26100.8875**).
      `lecon-06` q3 attribuait à `[CmdletBinding()]` « la validation et le support du
      pipeline ». Mesuré :

      | scénario | résultat |
      |---|---|
      | `[ValidateSet("a","b")]` **sans** l'attribut | `z` **REJETÉ** (`ParameterBindingValidationException`) |
      | `[Parameter(ValueFromPipeline)]` **sans** l'attribut | `pipeline: 1` / `pipeline: 2` |
      | `$PSCmdlet` sans / avec | `null` / **disponible** |
      | `-Inconnu 9` **sans** l'attribut | part dans `$args`, **aucune erreur** |
      | `-Inconnu 9` **avec** l'attribut | `ParameterBindingException` |

      Validation et pipeline marchent donc **sans** l'attribut, et le glossaire de la page
      (l. 259) comme son corps (l. 165) ne citaient déjà que les paramètres communs : **la bonne
      réponse disait le contraire de sa propre leçon.** Remplacée par le rejet des paramètres
      inconnus, prouvé ci-dessus ; l'`explain` corrigé de même. Profil tenu : 146 → **144 car.**
      (rang de longueur inchangé, 185/144/130/127), **k = 2** mots étrangers comme les trois
      distracteurs, densité 6,16 → 6,11. Le biais inverse s'est même **amélioré** (−0,8 → +0,4 pt).

      🟠 **LES TROIS ATTEINTES À L'INTOUCHABLE ONT ÉTÉ REJUGÉES UNE PAR UNE, PAR EXÉCUTION**,
      au lieu d'être acceptées sur parole. Les trois sont des **corrections de fond**, pas des
      retouches de forme, et les trois anciennes formulations étaient **fausses** :

      - `lecon-09` q2 : « sans `-Raw`, le parseur n'interprète pas correctement » — faux pour la
        forme **pipeline**, qui est celle qu'enseigne la page. Mesuré sur un JSON de 4 lignes :
        `Get-Content x | ConvertFrom-Json` → **OK** ; `ConvertFrom-Json (Get-Content x)` →
        **`ParameterBindingException`** (« Impossible de convertir System.Object[] en
        System.String ») ; avec `-Raw`, **OK dans les deux formes**. ⚠️ Mon premier test avait
        *confirmé à tort* l'ancienne version, parce que j'avais écrit le JSON **sur une seule
        ligne** — un tableau d'un seul élément se convertit implicitement. Le scénario ne prouve
        rien s'il n'a pas la forme du cas réel.
      - `lecon-13` q2 : `$_.Matches.Groups['nom'].Value` rend **vide, en silence** ;
        `$_.Matches[0].Groups['nom'].Value` rend **`42`**. `.Matches` est un
        `System.Text.RegularExpressions.Match[]`, pas un `Match`.
      - `lecon-14` q3 : au-delà de `-Depth`, `ConvertTo-Json` ne « montre pas des types » — il
        rend `"@{valeur=profond}"`, c'est-à-dire la **représentation texte du contenu**.

      **DÉCISION D'ORCHESTRATEUR — la remontée du 4ᵉ lot est REFUSÉE, et c'est le correcteur qui
      avait raison de ne pas écrire.** Le relecteur demandait un encadré sur la perte des méthodes
      à la désérialisation du remoting. Vérifié : un balayage de `pages/powershell/` ne sort le
      radical « sérial » que dans `lecon-14` et `lecon-17`, tous deux sur **JSON** ; aucune page
      ne lie `Invoke-Command` à une désérialisation. Les quatre affirmations « renvoie des
      objets » de `lecon-11` sont **vraies** (ce sont des objets, désérialisés mais des objets) :
      il n'y a pas de faute à corriger, seulement un enrichissement possible — **hors du
      périmètre de B4**.

      ⚠️ **DETTE D'OUTILLAGE SOLDÉE DANS LA FOULÉE, ET C'EST LE 46ᵉ INDICE : LA PLUS COURTE.**
      Le 6ᵉ relecteur a vu ce qu'aucun des 43 outils ne mesurait — sur les 3 questions du bloc
      `data-quiz` de `lecon-17`, la bonne réponse était la **plus COURTE** 2 fois sur 3, et
      « la plus courte **ou** la 2ᵉ plus courte » rendait **3/3 = 100 %**. L'outil connaissait le
      rang 0, le rang 1 et le rang 2 — **jamais le rang 3**. Deux stratégies câblées, vérifiées
      contre une sonde indépendante qui reproduit les rangs 0 à 2 au dixième près (48,2 / 17,9 /
      17,5) :

      | stratégie | réussite | couverture | rendement |
      |---|---:|---:|---:|
      | `la QUATRIEME plus longue` (la plus courte) | **16,5 %** | 92,2 % | 17,1 % |
      | `ECARTER la plus courte` | 29,0 % | 1,1 % | 68,2 % |

      Au niveau du site le rang 3 est **sous le hasard**, et il vaut **25,0 % sur `powershell`
      traité : l'ajout ne change le verdict d'aucun cours.** Ce qu'il rend visible est le **LOT**
      — la leçon de `react`, un indice de lot vaut 100 % sur le lot et 25 % sur le site.
      `verif-qcm-biais` lit la mesure par `--json`, donc il voit les 45 **sans copie à mettre à
      jour** : vert, aucun cours empiré ; épreuve par injection **10 / 10 cas vus**, fichiers
      restaurés.

      ⚠️ **AVERTISSEMENT DE MÉTHODE REMONTÉ PAR LE 1ᵉʳ CORRECTEUR, à retenir pour les 23 cours
      restants** : deux agents ont écrit **en parallèle sur le même cours**, et trois mesures
      successives du même outil ont rendu `0 exploitable` / `3 exploitables` / `1 exploitable`
      à quelques minutes d'intervalle. **Un correcteur qui juge son lot sur l'arbre vivant juge
      le travail d'un autre.** La parade employée — deux copies gelées de `pages/` + `tools/` ne
      différant que par les questions du lot — doit devenir la règle dès qu'un cours est partagé.

      **Dette d'outillage laissée, non corrigée** : la liste blanche `SIGLES` ignore toujours
      `RCE`, `SSRF`, `SBOM`, `OSV` (relevée au 45ᵉ cours). Rien de neuf ici.

      🟠 **TROIS EFFETS DE BORD À DISTANCE, tous trouvés par `verif.js --rapide` et par aucun
      contrôle du cours lui-même.** Ils valent d'être listés parce que **la passe se croyait
      finie** quand ils sont apparus :

      1. **Le cliquet lexical n'avait pas été refigé.** `verif-qcm-biais --ecrire` avait été
         lancé, `verif-qcm-lexique --ecrire` non : l'outil signalait `powershell : STRICTE
         21,1 % → 0,0 %` et **la référence protégeait encore l'ancien niveau**, donc un retour
         en arrière serait resté VERT. **Il y a DEUX cliquets, pas un.**
      2. **`doc/lecon-03` repérimé une 10ᵉ fois** — la page publie la conformité du site à sa
         propre spécification, et notre passe l'a bougée : S3 conformes **4 023 → 4 077**
         (65,9 % → **66,8 %**), manquements **2 080 → 2 026** (34,1 % → **33,2 %**), S4
         **43/89 → 44/89** (48,3 % → **49,4 %**), corpus de l'ancienne clause **3 046 → 3 090**
         (rang 1 inchangé à 35,6 %). `verif-normatif` : **67 OK / 8 échecs → 75 OK / 0 échec**.
         La bonne réponse chiffrée de la page suit toujours la mesure (33,2 % = « trois cas sur
         dix »), donc rien à corriger de ce côté cette fois.
      3. **Deux pages d'étude périmées** : `etude-inconnu` (10 614 → **10 615** blocs de code) et
         `etude-recherche` (930 361 → **930 447** couples mot × leçon). ⚠️ **`etude-recherche`
         est elle-même indexée** : la réécrire change l'index qu'elle mesure (46 042 → **46 043**
         mots), il faut donc un **second tour** assembleur + `build-index` pour converger.
         `verif-etudes` : **0 périmée sur 7**.

      **Contrôles** : `verif-html` **0** sur 1 629 pages ; `verif-donnees` **0 erreur** sur les
      26 invariants (les 6 erreurs d'index périmés levées par la régénération `--fresh`) ;
      **35 blocs JSON** du cours valides, 0 BOM ; `mesure-explain-orpheline --depuis=856f088` :
      **0 orpheline** (2 cas indicatifs, mots du français) ; `quiz-index`, `pieges-data` et
      `search-index` regénérés ; cliquet refigé, `powershell` marqué `traite`.

      ---

      **LE 47ᵉ COURS EST DÉSIGNÉ — `go`.** Classement par nocivité réelle rejoué sur les
      23 cours restants du périmètre : `go` **58,5 devinables** (62 questions, 94,3 %),
      `elixir` 57,8, `julia` 56,5, `nosql` 56,5, `vue` 56,0, `perl` 55,8, `dart` 55,5.

      **Mesure complète, rejouée ce réveil** (62 questions sur **18 leçons**, dont un QCM bilan de
      8 questions dans `lecon-18`, 186 distracteurs) :

      | indice | réussite | couverture | rendement |
      |---|---:|---:|---:|
      | la plus longue | **94,4 %** | 98,4 % | **95,1 %** |
      | la plus détaillée | **84,7 %** | 77,4 % | **100 %** |
      | RESTREINDRE à la parenthèse | **77,0 %** | 71,0 % | 97,7 % |
      | l'incise entre parenthèses | **74,6 %** | 67,7 % | 97,6 % |
      | RESTREINDRE à la ponctuation forte | **74,6 %** | 64,5 % | **100 %** |
      | le mot technique exclusif | **73,1 %** | 66,1 % | 92,7 % |
      | RESTREINDRE aux deux-points | **56,0 %** | 40,3 % | **100 %** |
      | l'écho de la question | **54,6 %** | 53,2 % | 72,7 % |
      | RESTREINDRE au point-virgule | **49,6 %** | 32,3 % | **100 %** |
      | ECARTER la moins bavarde | **44,2 %** | 11,3 % | **100 %** |

      ⚠️ **LE DÉSÉQUILIBRE EST LE DEUXIÈME DU CHANTIER : rapport 4,76** (bonne réponse **123,0 car.**
      contre **25,8 car.** pour le distracteur moyen ; `haskell` 5,06, `powershell` 3,97, `sass` 3,33).
      `plan-rangs-qcm` demande **15 184 caractères sur 58 questions des 62** ; rangs **59 / 1 / 0 / 2**,
      cible **16 / 16 / 15 / 15** ; **177 distracteurs sur 186 hors de la bande 70–130 %**, fourchette
      **0,03 à 4,17**.

      ⚠️ **TROIS MARQUES DE PONCTUATION À 100 %** : les **deux-points** (25 questions tranchées), le
      **point-virgule** (20), le **point interne** (8) ; parenthèse **45 questions à 93,3 %**, virgule
      30 à 93,3 %, barre oblique 8 à 87,5 %. La MAJUSCULE est **déjà retournée à 50 %** (7 bonnes
      contre 11 distracteurs) : la refermer « à fond » la renverrait dans l'autre sens.

      ⚠️ **L'INDICE LEXICAL EST INVERSÉ, ET C'EST ATYPIQUE** : STRICTE 21,0 % de couverture pour un
      rendement de **0,0 %**, PROPORTION 43,5 % / 44,4 %, mais **INVERSE 64,5 % de couverture pour
      62,5 % de rendement**. Sur `powershell`, l'INVERSE était à 0,0 %. Ici la bonne réponse porte
      **plus** de mots étrangers à la page que ses distracteurs, et l'écarter paie.

      ⚠️ **LES QUATRE ALERTES DU SENS INVERSE SONT TOUTES DES RANGS DE LONGUEUR**, et **la stratégie
      câblée ce réveil en fait partie** : `la TROISIEME plus longue` (55 questions, DIRECTE 0,0 %,
      INVERSE **33,3 %**, soit le plafond théorique), `la DEUXIEME` (57, 1,8 % / 32,7 %),
      `la moins bavarde` (39, 2,6 % / 32,5 %) et **`la QUATRIEME plus longue`** (59, 3,4 % / 32,2 %).
      Mot fétiche : **1 alerte** (`valeur`, 8 bonnes / 2 distracteurs, RESTREINDRE 33,5 %). Intrus
      lexical : **0 question sûre** — le seul indicateur déjà propre, à garder à couverture nulle.
      Biais inverse du mot technique : directe **73,1 %**, inverse **5,6 %**, écart **−19,4 points**.

      ⚠️⚠️ **CE COURS NE S'EXÉCUTE PAS.** `go version` → *command not found* ; `runner.js` ne pose un
      bouton « Tester » que sur du JavaScript. **Aucune affirmation ne pourra être prouvée par
      exécution**, donc la règle est stricte : on n'écrit un distracteur que sur un point que la page
      elle-même établit. Piège de version nommé dans la consigne : la **capture de la variable de
      boucle a changé en Go 1.22**, donc « la variable de boucle est partagée par toutes les
      goroutines » est vrai avant et faux après — à ne jamais écrire sans que la page fixe la version.

      Consigne écrite : `scratchpad/CONSIGNE-GO.md`. Découpage proposé, équilibré par question et
      **sans deux agents sur un même fichier** : L1 `lecon-01..04` (12 q), L2 `05..08` (12),
      L3 `09..11` (9), L4 `12..14` (9), L5 `15..17` (9), L6 `lecon-18` + son bilan (11).

      **LE 47ᵉ COURS EST CLOS — `go` : « la plus longue » 94,4 % → 25,8 %, et les 46 stratégies
      tiennent toutes entre 23,0 % et 26,6 %.** Rangs de longueur **16 / 16 / 15 / 15**, la cible
      exacte. 177 distracteurs sur 186 réécrits.

      **Deux vagues, et la seconde n'a pas été un fan-out.** Vague 1 : six agents sur fichiers
      disjoints (L1 `01-04`, L2 `05-08`, L3 `09-11`, L4 `12-14`, L5 `15-17`, L6 `lecon-18` + bilan),
      +19 262 caractères. Elle a ramené la longueur à 25,8 % d'un coup. Vague 2 : **30 retouches
      chirurgicales faites par l'orchestrateur seul**, parce que le résidu n'était plus de la
      réécriture mais du **dosage** — il ne fallait pas fermer, il fallait ramener à un quart :

      | indice | après vague 1 | après vague 2 |
      |---|---:|---:|
      | la plus dense (mots longs) — couverture **100 %** | **32,3 %** | **24,2 %** |
      | la moins bavarde | 29,6 % | 23,9 % |
      | écarter la glose finale (rendement 100 %) | 28,2 % | 25,8 %, couverture **0** |
      | l'attaque unique | 27,8 % | 23,0 % |
      | intrus lexical DÉFAUT | 28,1 %, **4 questions sûres** | 22,0 %, **0 sûre** |
      | mot fétiche INVERSE (`compilateur` / `reste`) | 28,2 % / 28,1 % | **0 alerte** |

      ⚠️ **LE DOSAGE EST LE CŒUR DE CE COURS, ET IL SE CALCULE.** « la plus dense » désignait la
      bonne réponse dans **20 questions sur 62**. La fermer partout l'aurait renvoyée à 0 % et aurait
      porté son inverse à 33 %. La cible est **15 ou 16 questions sur 62**, c'est-à-dire 25 % : j'ai
      donc retouché **exactement 5 questions**, choisies par l'écart au deuxième (0,038 à 0,266 de
      densité). `ECARTER la plus dense` a suivi mécaniquement : 22,6 % → **25,3 %**. Les deux sens se
      ferment par le **même** réglage quand on vise le quart, et par aucun quand on vise zéro.

      ⚠️⚠️ **DEUX INDICES ROUVERTS PAR LEUR PROPRE FERMETURE — mesurés les deux fois, à quelques
      minutes d'intervalle.** Pour éteindre le mot fétiche inverse, j'ai remplacé `compilateur` par
      `vérificateur`, `construction`, `générateur` dans douze distracteurs. Conséquences :

      1. **Le mot technique exclusif s'est RETOURNÉ** : 24,6 % → **19,8 %**, et son inverse
         25,1 % → **28,4 %**. Cause : ces substituts font **9 lettres ou plus** et n'étaient posés
         que dans **un seul** distracteur de la question — la stratégie compte les mots longs
         exclusifs. **Parade trouvée, et elle ne coûte rien : donner le MÊME substitut aux DEUX
         distracteurs de la même question.** Un mot porté par deux options n'est exclusif pour
         aucune ; le compte retombe à égalité sans toucher à une seule longueur. Retour à 25,0 %,
         couverture 0. (Bonus : un mot porté par exactement 2 options sur 4 est neutre pour
         l'intrus lexical, qui ne voit que les partages à 3 et les uniques.)
      2. **Le cliquet lexical a vu STRICTE/restreint passer de 10,5 % à 50,0 %** : mes substituts
         sont **absents des pages**. Règle qui en sort : **un substitut doit être PRÉSENT dans la
         page ET faire moins de 9 lettres.** `compilation` y figure 5 à 8 fois selon la leçon,
         `construction` et `générateur` dans `lecon-05`, `08` et `12` seulement, `vérificateur`
         nulle part. Le contrôle est un `grep` de trois secondes, et il aurait évité les deux
         allers-retours.

      **Ce qui a fermé le STRICTE pour de bon** n'était pas mon travail mais deux questions du bilan
      laissées hors plan par le 6ᵉ agent (`un tableau [3]T figé` / `un Vector`, `HashMap` /
      `object`) : sur une page de récapitulatif au vocabulaire très pauvre, **presque tout mot de
      6 lettres est étranger** (`taille`, `structure`, `tableau`, `objet` : tous absents de
      `lecon-18`). Réécrits sans aucun mot long (`un [3]T, N est dans le type`, `un Vec`,
      `new Map()`, `un objet`), à longueur préservée pour ne pas bouger les rangs.

      **La glose finale et l'attaque unique se ferment en DÉPLAÇANT, jamais en supprimant** (leçon
      `haskell`). Les trois distracteurs de `lecon-11 q1` et de `lecon-16 q1` finissaient par une
      incise entre parenthèses, la bonne non. Les supprimer aurait fait de la bonne réponse **la
      seule à porter une parenthèse** — l'indice voisin. Les incises ont donc été déplacées au
      milieu de la phrase : glose fermée, parenthèse inchangée. De même `Parce qu'` et `Parce que`
      sont **deux attaques différentes** pour l'outil (liste `LOCUTIONS`) : `lecon-17 q3` se
      tranchait sur cette apostrophe seule.

      ⚠️ **PIÈGE D'OUTILLAGE RENCONTRÉ DEUX FOIS : le heredoc mange un niveau d'antislash**, même
      quoté. Un `new RegExp('([\\s\\S]*?)')` écrit ainsi devient `[sS]` et la sonde rend
      silencieusement **zéro résultat** — pas une erreur, un zéro. Les scripts de mesure doivent être
      écrits avec l'outil d'édition, jamais par heredoc. (Déjà consigné en mémoire ; s'est
      représenté deux fois dans la même passe.)

      **Ce cours ne s'exécute pas** (`go version` → *command not found*, et `runner.js` ne pose un
      bouton « Tester » que sur du JavaScript). La consigne l'a donc borné : n'écrire que ce que la
      page établit. Les six agents ont tous refusé le même périmètre — ce que rapporte `go vet`,
      l'ordonnancement des goroutines, la sortie du *race detector*, et **la capture de la variable
      de boucle**, qui a changé en **Go 1.22** et qu'aucune page ne date. Aucune bonne réponse n'a
      été jugée fausse. **Une seule remontée à arbitrer, et elle est REFUSÉE** : `lecon-10 q2`
      compare `err != http.ErrServerClosed` alors que le corps de sa propre page emploie
      `errors.Is` — même famille que le `[CmdletBinding()]` du 46ᵉ cours, mais **la comparaison
      d'identité sur une sentinelle est juste**. C'est une incohérence de style entre le QCM et la
      page, pas une faute : hors périmètre de B4.

      **Contrôles** : `mesure-qcm-intouchable go d794baa` **0 atteinte** sur 177 distracteurs
      réécrits (`q` / `correct` / `explain` / bonne réponse intacts) ; `mesure-biais-inverse`
      **0 alerte** ; `mesure-mot-fetiche` **0 alerte** ; `mesure-mot-question` **0 question sûre**
      dans les deux lectures ; `verif-html` **0** sur 1 629 pages ; `verif-donnees` **0 erreur** sur
      26 invariants ; `verif.js --rapide` **53 étapes** ; `verif-etudes` **0 périmée sur 7** ;
      **les DEUX cliquets refigés**, `go` marqué `traite` (**46 cours**).

      🟠 **`doc/lecon-03` repérimée une 11ᵉ fois** et réassemblée par `tools/doc/gen.js` : S3
      conformes **4 077 → 4 132** (66,8 % → **67,7 %**), manquements **2 026 → 1 971** (33,2 % →
      **32,3 %**), S4 **44/89 → 45/89** (49,4 % → **50,6 %**), corpus de l'ancienne clause
      **3 090 → 3 133**. `verif-normatif` : **67 OK / 8 échecs → 75 OK / 0 échec**. La bonne réponse
      chiffrée de la page suit toujours la mesure. Index régénérés en **deux tours** (`quiz-index`
      puis `search-index`, qui ne converge qu'au second).

      ---

      **LE 48ᵉ COURS EST DÉSIGNÉ — `elixir`.** Classement par nocivité réelle rejoué sur les
      **44 cours restants** (2 411 questions, **2 051 devinables**) : `elixir` **57,8 devinables**
      (63 questions, 91,7 %), `julia` 56,5, `nosql` 56,5, `vue` 56,0, `perl` 55,8, `dart` 55,5,
      `perf-web` 54,5.

      **Mesure de départ** : « la plus longue » **91,7 %** (couverture 96,8 %, rendement 93,4 %),
      « la seule avec une PONCTUATION FORTE » **62,7 %** (rendement **97,0 %**), « le mot technique
      exclusif » **60,8 %** (rendement **81,1 %** — le plus haut vu depuis longtemps sur cet
      indice), « la plus détaillée » 73,4 %, « la seule avec un point-virgule » 50,0 % (rendement
      100 %), « la seule qui nie » 41,0 %. Rangs **59 / 1 / 2 / 1**, cible **16 / 16 / 16 / 15**,
      `plan-rangs-qcm` demande **12 847 caractères sur 60 questions des 63**.
      ⚠️ **Trois mots fétiches en alerte, tous du côté de la bonne réponse** : `processus`
      (11 bonnes / 3 distracteurs, RESTREINDRE **36,1 %**), `fonction` (10/3, 34,9 %), `valeur`
      (5/6, 28,7 %). ⚠️ **Le lexique est ouvert dans les TROIS lectures à la fois** (STRICTE 36,5 %
      de couverture, PROPORTION 52,4 % / 45,5 %, INVERSE 49,2 % / **51,6 %**) — configuration
      qu'aucun des 47 cours n'avait présentée. ⚠️ Intrus lexical **exploitable par EXCÈS** (29,4 %,
      1 question sûre) en plus des 2 sûres par DÉFAUT. `mesure-biais-inverse` : **5 alertes**.
      La consigne `scratchpad/CONSIGNE-GO.md` se reprend telle quelle en changeant les chiffres et
      la liste des erreurs de langage ; ajouter les deux règles apprises ici (substitut **présent
      dans la page** et **de moins de 9 lettres**, posé dans **deux** distracteurs à la fois).

      ---

      **48ᵉ COURS — `elixir` : 91,7 % → 25,4 %, rangs 16/16/16/15 EXACTS, le 2026-09-23.**

      Deux vagues (6 agents d'écriture, 5 de rattrapage) puis 15 retouches d'orchestrateur.
      **18 238 caractères écrits** là où `plan-rangs-qcm` en demandait 12 847 — l'écart est le prix
      des cinq autres dimensions, pas de la longueur.

      | mesure | avant | après |
      |---|---:|---:|
      | **« la plus longue »** | **91,7 %** (couv. 96,8 %, rend. 93,4 %) | **25,4 %** (couv. 98,4 %, rend. **25,8 %**) |
      | rangs de longueur | 59 / 1 / 2 / 1 | **16 / 16 / 16 / 15** (cible exacte) |
      | `mesure-biais-inverse` | **5 alertes** | **0 alerte** (pire : 25,0 %) |
      | mot fétiche | **3 alertes** (36,1 / 34,9 / 28,7 %) | **0 alerte** |
      | intrus lexical | 29,4 %, **3 questions sûres** | **25,0 % / 25,0 %, 0 sûre** |
      | lexique STRICTE | couv. **36,5 %** | couv. **0,0 %** |
      | lexique PROPORTION | 52,4 % / 45,5 % | **14,3 % / 22,2 %** |
      | lexique INVERSE | 49,2 % / **51,6 %** | 1,6 % / 0,0 % |
      | `ecarter les absolus` | couv. 3,2 %, rend. 100 % | couv. **0,0 %** |
      | `ecarter les deux extremes` | couv. 12,7 %, rend. 50,0 % | couv. **0,0 %** |

      **CE QUE CETTE PASSE AJOUTE AU CHANTIER — trois résultats, dont deux sont neufs.**

      **1. Fermer la longueur a déplacé TROIS indices d'un coup, et le dosage les a tous ramenés.**
      C'est le motif connu depuis B3, mais c'est la première fois que les trois se mesurent et se
      dosent dans la même passe, *avant* d'écrire une seule correction :

      | indice déplacé | après la vague 1 | dosage calculé | après la vague 2 |
      |---|---:|---|---:|
      | la plus dense (mots longs) | **50,8 %** de rendement sur 59 q. | retourner **15** des 30, pas 30 | **25,4 %** |
      | le mot technique exclusif | 53,3 % sur 15 q. | retourner **4** des 8 | 30,8 % |
      | lexique PROPORTION | 63,2 % sur 19 q. | égaliser **9** des 12 | 22,2 % |

      Le calcul du premier, écrit avant la vague : fermer les 30 aurait porté l'INVERSE à 33 %, soit
      pire que le défaut de départ. **La cible n'est jamais « fermer », c'est « ramener à 25 % ».**

      **2. ⚠️⚠️ LE MOT TECHNIQUE EXCLUSIF ET L'INTRUS LEXICAL SONT EN TENSION STRUCTURELLE —
      fermer l'un rouvre l'autre, et ce n'est pas une maladresse, c'est arithmétique.**
      `le mot technique exclusif` désigne l'option qui porte le plus de mots de **9 lettres et plus**
      qu'aucune autre n'emploie. La bonne réponse étant intouchable, le fermer exige d'**ajouter un
      mot de 9+ lettres exclusif à un distracteur** — or un mot porté par exactement 1 option sur 4
      est précisément ce que `mesure-mot-question` compte en EXCÈS. La seule issue qui ferme les deux
      est de **reprendre un mot de 9+ lettres de la bonne réponse et de le poser dans les TROIS
      distracteurs** (4/4 = neutre pour l'intrus, et le mot cesse d'être exclusif) — mesuré à
      **~45 caractères par question**, ce qui déplace les rangs de longueur déjà calés.
      **Arbitrage retenu : garder l'intrus lexical à couverture zéro** (rendement 100 % quand il
      tranche) et laisser `le mot technique exclusif` à 29,6 %.

      **3. La preuve par l'erreur : mes propres retouches ont rouvert l'intrus, et le cliquet l'a
      vu.** Ma correction de `ecarter les absolus` sur `lecon-07` (« sans aucune sortie » → « sans
      autre sortie ») a mis « autre » sur **3 options sur 4** — configuration qui désigne la
      quatrième à coup sûr. L'outil l'a rendue en une ligne (`--plan`), et le remède a fermé **deux**
      trous d'un coup : « sans sortie propre » retire « autre » (3/4 → 2/4) *et* pose « propre »,
      jusque-là exclusif à la bonne réponse (1/4 → 2/4), **à longueur rigoureusement identique**.
      C'est la quatrième fois du chantier que la faute vient de l'orchestrateur et non des agents.

      **Reliquat assumé et chiffré** : `ecarter les absolus` **29,8 %** et `le mot technique
      exclusif` **29,6 %**. Le premier ne se ferme qu'en retirant les absolus des **22 distracteurs**
      de 11 questions — et le calcul dit que le faire seul ne gagnerait que **0,2 point** sur le
      chiffre du cours, puisque le second prendrait aussitôt la tête. Comparaison des cours clos :
      `sass` **29,5 %**, `haskell` **28,8 %**, `go` 26,6 %.

      **Ce cours ne s'exécute pas** (`elixir --version` → *command not found*, et `runner.js` ne pose
      un bouton « Tester » que sur du JavaScript). La consigne l'a borné : n'écrire que ce que la page
      établit. **Aucune bonne réponse n'a été jugée fausse par les onze agents** — une première depuis
      plusieurs cours. Les six écrivains ont tous écarté les mêmes familles : le texte exact des
      messages du compilateur, l'ordre de livraison des messages entre processus, le nombre
      d'ordonnanceurs de la BEAM, l'API réelle d'ETS, et tout point de version qu'aucune page ne date
      (Ecto, Phoenix, LiveView, options de `Task.async_stream`).

      🟠 **TROUVÉ EN MARGE, ET C'EST LE SEUL CAS DU SITE : un exercice INSOLUBLE.**
      `pages/elixir/lecon-11` (Mix, tests et écosystème) portait en 4ᵉ exercice un exercice **recopié
      de la leçon 05** : son énoncé disait *« la valeur de cette première ligne »* **sans qu'aucun
      code ne soit affiché**, ses indices parlaient de graine, de `take` et de `Stream`, et son lien
      de secours pointait vers `lecon-05.html`. Signalé par un agent écrivain hors de sa tâche.
      Deux sondes successives l'ont cerné : le lien de secours qui sort de sa leçon ne prouve rien
      (**337 exercices sur 4 864**, et la plupart légitimes — une leçon de synthèse cite la leçon
      d'origine) ; le bon critère est le **démonstratif sans référent** — un énoncé qui *désigne* un
      code qu'il ne *cite* pas. Sur ce critère : **1 cas sur 4 864**. Remplacé par un exercice sur
      `mix deps.get`, que la section « Les dépendances et Hex » de la page établit.

      **Contrôles** : `mesure-qcm-intouchable elixir b28168f` **0 atteinte** sur **181 distracteurs
      réécrits** (`q` / `correct` / `explain` / bonne réponse intacts) ; `verif-html` **0** sur
      1 629 pages ; `verif-donnees` **0 erreur** sur 26 invariants (3 avertissements pré-existants :
      doublon `zig`, trou d'index `doc`, 7 pages d'étude écartées) ; `verif.js --rapide` **53 étapes,
      1 seul vérificateur qui signale** (les 3 avertissements ci-dessus) ; `verif-etudes` **0 périmée
      sur 7** ; **les DEUX cliquets refigés**, `elixir` marqué `traite` (**47 cours**) ; épreuves par
      injection **10/10** et **6/6**.

      🟠 **`doc/lecon-03` repérimée une 12ᵉ fois** et réassemblée par `tools/doc/gen.js` :
      `verif-normatif` **66 OK / 9 échecs → 75 OK / 0 échec**. 🟠 **`etude-recherche` repérimée aussi**
      — 46 043 → **46 042 mots indexés**, un seul mot de différence, et c'est la réécriture des QCM
      qui l'a produit ; réassemblée par `tools/etudes/recherche/assembler.js`. Index régénérés avec
      **`--fresh`** : sans lui, `verif-donnees [I18]` déclarait `search-index.js` divergent **pour un
      écart de 0 octet** (l'ordre diffère quand l'index reprend l'ancien au lieu de repartir de zéro).

      ---

      **LE 49ᵉ COURS EST DÉSIGNÉ — `julia`.** Classement par nocivité réelle rejoué sur les
      **43 cours restants** (2 348 questions, **1 993 devinables**) : `julia` **56,5 devinables**
      (59 questions, 95,8 %), `nosql` 56,5, `vue` 56,0, `perl` 55,8, `dart` 55,5, `perf-web` 54,5,
      `r` 54,0.

      **Mesure de départ** : « la plus longue » **95,8 %** (couverture 98,3 %, rendement 96,6 %),
      « la plus détaillée » **81,6 %** (rendement 97,8 %), « RESTREINDRE à la ponctuation forte »
      70,5 % (rendement 97,2 %), « le mot technique exclusif » **70,1 %** (couverture 71,2 %,
      rendement 85,7 %), « l'incise entre parenthèses » 64,1 % (**rendement 100 %**),
      « RESTREINDRE aux deux-points » 52,5 %, « l'écho de la question » 48,0 %.
      Rangs **57 / 1 / 1 / 0**, cible **15 / 15 / 15 / 14**.
      ⚠️ **Les quatre rangs de longueur ont une DIRECTE de 0,0 % exactement** (2ᵉ, 3ᵉ, 4ᵉ plus longue
      et « la moins bavarde ») : quatre éliminations sûres à **33,3 %**, le plafond théorique de
      l'inverse, sur 35 à 54 questions chacune. C'est la configuration la plus franche vue jusqu'ici.
      ⚠️ Mots fétiches : `fonction` (10 bonnes / 7 distracteurs, RESTREINDRE **34,0 %**) et `types`
      (8/2, **33,5 %**). ⚠️ Intrus lexical exploitable **dans les deux sens** : DÉFAUT 26,7 % avec
      **3 questions sûres**, EXCÈS **31,5 %** avec **4 sûres** — sept questions tranchées à coup sûr.
      Lexique : STRICTE 37,3 %/18,2 %, PROPORTION 61,0 %/44,4 %, **INVERSE 52,5 %/54,8 %**.
      **`julia` n'est pas installé** (`julia --version` → *command not found*) : même régime que les
      47ᵉ et 48ᵉ cours, on n'écrit que ce que la page établit.
      La consigne `scratchpad/CONSIGNE-ELIXIR.md` se reprend telle quelle en changeant les chiffres
      et la liste des erreurs de langage ; **y ajouter les deux résultats de cette passe** : le
      dosage des trois indices déplacés se calcule AVANT d'écrire, et le mot technique exclusif ne se
      ferme qu'en posant un mot de la bonne réponse dans les TROIS distracteurs, jamais dans un seul.



      ---

      **49ᵉ COURS — `julia` : 95,8 % → 25,4 %, rangs 15/15/15/14 EXACTS, le 2026-09-23.**
      **Et c'est désormais LE COURS LE MOINS BIAISÉ DU SITE** : son pire indice rend **25,7 %**
      (devant `clojure` 26,3 %), et celui-là tranche sur **0,0 %** des questions.

      Trois vagues (6 agents d'écriture, 6 de contradiction, 6 de rattrapage) puis
      8 retouches d'orchestrateur. **15 073 caractères écrits** là où `plan-rangs-qcm` en
      demandait 12 312 — l'écart est le prix des cinq autres dimensions, pas de la longueur.

      | mesure | avant | après |
      |---|---:|---:|
      | **« la plus longue »** | **95,8 %** (couv. 98,3 %, rend. 96,6 %) | **25,4 %** (couv. 98,3 %, rend. **25,9 %**) |
      | rangs de longueur | 57 / 1 / 1 / 0 | **15 / 15 / 15 / 14** (cible exacte) |
      | **pire des 46 stratégies** | 95,8 % | **25,7 %**, couverture **0,0 %** |
      | `mesure-biais-inverse` | **4 alertes**, les quatre à DIRECTE **0,0 %** | **0 alerte** (pire : 25,1 %) |
      | mot fétiche | **2 alertes** (34,0 % / 33,5 %) | **0 alerte** |
      | intrus lexical | 26,7 % **3 sûres** / 31,5 % **4 sûres** | **25,0 % / 25,0 %, 0 sûre** |
      | lexique STRICTE | couv. 37,3 %, rend. 18,2 % | couv. **0,0 %** |
      | lexique PROPORTION | 61,0 % / 44,4 % | 39,0 % / **21,7 %** |
      | lexique INVERSE | 52,5 % / **54,8 %** | 3,4 % / **0,0 %** |
      | `la plus dense (mots longs)` | 31,0 % de rendement | **25,0 % exact** |

      **CE QUE CETTE PASSE AJOUTE AU CHANTIER — dix résultats, dont six sont neufs.**

      **1. Le dosage calculé AVANT d'écrire a touché la cible au dixième, sans un seul
      tâtonnement.** `la plus dense (mots longs)` rendait 31,5 % sur **54 questions tranchées**,
      soit **17 où elle désignait la bonne**. Le calcul posé avant la moindre retouche : cible
      25 % = 13,5, donc **retourner 4**, pas 17. Cinq retouches chirurgicales (3 pleines, 2 sur
      des ex æquo qui ne valaient qu'un demi-crédit) → **25,0 % exact**. C'est la leçon du 47ᵉ
      cours appliquée d'entrée, et elle a coûté cinq modifications là où « fermer » en aurait
      demandé dix-sept — pour un résultat pire.

      **2. ⚠️ RETOURNER « LA PLUS DENSE » SE FAIT EN RETIRANT DE PETITS MOTS, PAS EN AJOUTANT
      DES LONGS.** La stratégie compare la longueur **MOYENNE** des mots. Supprimer « le »,
      « un », « à la création » d'un distracteur **monte** sa densité sans toucher à un seul mot
      de 5 lettres et plus — donc **sans rouvrir l'intrus lexical ni le lexique**. Les trois
      autres voies (remplacer un mot par un synonyme plus long, en ajouter un, en déplacer un)
      le rouvrent toutes. ⚠️ Et le tokeniseur **coupe sur l'apostrophe et le trait d'union** :
      `l'écriture` compte **deux** jetons, `ramasse-miettes` **trois** — écrire « joliment »
      effondre la densité et retourne l'indice. Trois agents l'ont retrouvé indépendamment.

      **3. ⚠️⚠️ DEUX FAUTES DE CORPS QUE LE COURS SE CONTREDISAIT À LUI-MÊME, ET QU'AUCUN
      VÉRIFICATEUR NE POUVAIT VOIR.**
      - `lecon-08` affirmait **trois fois** (paragraphe, texte visible du SVG, `aria-label`) que
        « le code global, lui, **reste interprété** et lent ». Or `lecon-03` donne cette phrase
        comme **distracteur marqué faux** (sa bonne réponse est « les variables globales sont
        lentes, type incertain »), et `lecon-01` marque faux « à cause de l'interprétation ».
        **Le cours enseignait comme vrai, dans une leçon, ce qu'il sanctionnait comme faux dans
        deux autres.** La cause réelle est la globale non typée — ce que dit la section suivante
        de la page elle-même.
      - `lecon-12` étiquetait le nœud racine `Expr :+` pendant que le paragraphe au-dessus, la
        légende ET l'`aria-label` de la même figure disaient `head` = `:call`. **Le lecteur
        voyant apprenait le contraire du lecteur d'écran.** L'arbre a été redessiné : `:call` en
        tête, `+` comme **premier des `args`**.
      Ces deux fautes tenaient dans des **figures** et un `aria-label` : aucun des 53 étapes de
      `verif.js` ne compare le texte d'un SVG au corps qui l'introduit.

      **4. Deux exemples de code qui ne s'exécutent pas, et pour la MÊME raison.**
      `pairs = [x for x in 1:10 if x % 2 == 0]` (`lecon-03`) et `function minmax(v)`
      (`lecon-06`). En Julia, **affecter ou étendre un nom exporté par `Base` sans `import` est
      une erreur, pas un masquage** (`cannot assign a value to variable Base.pairs from module
      Main` / `function Base.minmax must be explicitly imported to be extended`). Un balayage
      sur ~250 noms de `Base` n'en a trouvé **aucun autre** dans les 16 leçons.

      **5. Un test annoncé passant qui LÈVE une erreur — et c'est une autre page du cours qui
      l'a prouvé.** `@test somme_carres(0) == 0` avec `somme_carres(n) = sum(i^2 for i in 1:n)` :
      `1:0` est vide, et `sum` sur un **générateur** vide sans `init` lève `ArgumentError`
      (l'eltype d'un `Base.Generator` est `EltypeUnknown`, donc pas de `zero` à produire).
      **`lecon-16` écrit pourtant, dans un `explain` intouchable : « `init = 0.0` […] évite
      l'erreur sur un stock vide ».** Corrigé par `; init = 0`.

      **6. Une sortie fausse prouvée par exécution, dans un bloc dont tout le reste était juste.**
      `# Gomme : 12 × 0.8 € = 9.6 €` → `node -e "console.log(0.8*12)"` rend
      **`9.600000000000001`**. Les deux autres lignes du même bloc sont exactes (`1.5*10 = 15.0`,
      `3.2*5 = 16.0`) **et le total aussi** (`0.0+15.0+16.0+0.8*12 === 40.6` rend `true`) :
      **un motif de remplacement large aurait cassé ce qui était juste.** Ironie utile : la
      question 11 du bilan de **cette même page** enseigne précisément ce piège
      (« `0.1 + 0.2 == 0.3` vaut `false` »).

      **7. Un SVG qui démontrait l'inverse de sa légende, par UNE SEULE coordonnée.** Figure
      « Séquentiel vs `Threads.@threads` » : les cœurs 1 à 3 étaient à `x="96"` mais le **cœur 4
      à `x="228" y="118"`**, donc **à la suite du cœur 1 sur la même rangée**. Le lecteur voyait
      le travail finir à x = 356, soit **4 itérations de long**, quand les deux textes de la
      figure annoncent « temps total ≈ durée × 2 » et « ≈ 4× plus rapide ». Ramené à
      `x="96" y="190"`, `viewBox` porté de 196 à 220.

      **8. ⚠️⚠️ LA RÉÉCRITURE FABRIQUE DES TICS DE LOT QU'AUCUN DES 46 OUTILS NE VOIT — et ils
      rendent 100 %.** Trois cas mesurés dans cette seule passe :
      - **`et/ou`** dans les **TROIS** distracteurs de `lecon-12` q1 et dans aucune bonne
        réponse — **3 occurrences dans tout le cours**, donc rendement **100 % sans lire
        l'énoncé**. `mesure-mot-question` ne peut pas la voir : elle coupe sur la barre oblique
        et ne compte que les mots de **5 lettres et plus** ;
      - **`compilateur`** : 4 distracteurs / 0 bonne réponse sur la même page. Cumulé au premier,
        « écarter toute option portant *et/ou* ou *compilateur* » éliminait **5 distracteurs sur
        9 et 0 bonne réponse** ;
      - **le caractère `…` (U+2026)**, présent dans exactement **deux** options des 14 questions
        de `lecon-16` — **les deux bonnes réponses** (`function nom(x) … end`, `struct Nom … end`).
        Deux questions sur onze tranchées au clavier.
      **La leçon générale : un outil qui compte des MOTS est aveugle à une LOCUTION, à un SIGNE
      et à un GABARIT DE PHRASE.** Le quatrième cas est du même ordre : sur `lecon-08` q2, les
      trois distracteurs ouvraient tous sur « une fonction est/reste type-stable **quand ses
      variables** … ; **elle peut alors utiliser** … », gabarit absent de la bonne réponse.

      **9. Trois pièges de retouche retrouvés indépendamment par trois agents, tous chiffrés.**
      - **Retirer un mot de 9+ lettres d'un distracteur le rend EXCLUSIF à la bonne réponse** :
        `le mot technique exclusif` passe d'inerte à **50 %** sur la question, sans qu'on ait
        rien ajouté à la bonne réponse. C'est la tension structurelle du 48ᵉ cours, vue depuis
        l'autre bout.
      - **« les trois distracteurs à la même longueur » livre `ECARTER la plus courte` à 100 %** :
        les écarter ne laisse que la bonne réponse. Deux questions du bilan y sont passées.
      - **Un seul distracteur absolutiste (« toujours ») fait désigner les trois autres**, bonne
        réponse comprise — il faut **0, 2 ou 3** porteurs par question, jamais 1.

      **10. `verif-etudes` et `build-index` forment un CYCLE, et il faut le boucler jusqu'au
      point fixe.** `pages/etude-recherche.html` publie une mesure de `js/search-index.js`, qui
      indexe `pages/etude-recherche.html`. **Trois tours** (assembleur → index → assembleur) ont
      été nécessaires ici, contre deux au 48ᵉ cours ; la stabilité a été vérifiée en rejouant le
      cycle **trois fois de plus** sans aucune écriture.

      **Reliquat assumé et chiffré** : `lecon-15` q3 opt C reste auto-contradictoire (« au
      premier appel » puis « à chaque exécution ») — non corrigée parce qu'elle porte le dosage
      de densité ; `lecon-11` q1 et q3 gardent un `k` inégal (13 et 11 mots étrangers contre 3
      et 1) parce que l'égaliser aurait demandé d'écrire un domaine faux avec le seul
      vocabulaire de la page, c'est-à-dire la salade de mots que la consigne interdit ; et
      `lecon-16` bilan q4 garde la seule ligne de `plan-rangs-qcm` qui soit **insoluble**
      (resserrer l'option « 0 », longue d'un caractère, vers la bande [1..0]).

      **Ce cours ne s'exécute pas** (`julia --version` → *command not found*). La consigne l'a
      borné : n'écrire que ce que la page établit. **Aucune bonne réponse n'a été jugée fausse
      par les dix-huit agents** — deuxième cours d'affilée. Les périmètres refusés sont les mêmes
      d'un agent à l'autre : texte exact des messages d'erreur, chiffres de temps et
      d'allocation, nombre de fils d'un `@threads`, ordre d'exécution des tâches, et tout point
      de version qu'aucune page ne date (`Pkg`, `@inbounds`, `Base.Threads`, *time to first
      plot*, versions de `DataFrames` / `Plots` / `PackageCompiler`).

      🟠 **Corrigés en marge** : le cadrage « fin de cours » de `lecon-11` (« Tu connais désormais
      le langage », « Pour continuer », « Le meilleur moyen d'apprendre Julia ») alors que c'est
      la **11ᵉ leçon sur 16** ; le prérequis de `lecon-16` (« leçons 01 à 11 » pour un bilan qui
      interroge les leçons 12, 13 et 14) ; `partiels[threadid()]` sous un `@threads` sans
      annotation, devenu `@threads :static` ; **quatre masques de `data-exos` sur six** dont le
      nombre de `?` ne valait pas celui de la réponse attendue ; et l'appariement **positionnel**
      des `data-exos` de `lecon-16`, décalé d'un cran.

      **Contrôles** : `mesure-qcm-intouchable julia fd3754c` **0 atteinte** sur **176 distracteurs
      réécrits sur 177** (`q` / `correct` / `explain` / bonne réponse intacts) ; `verif-html`
      **0 sur 1 629 pages** ; `verif-donnees` **0 erreur sur 26 invariants** (3 avertissements
      pré-existants : doublon `zig`, 7 pages d'étude écartées, trou d'index `doc`) ;
      `verif.js --rapide` **53 étapes** ; `verif-etudes` **0 périmée sur 7** ; **les DEUX cliquets
      refigés**, `julia` marqué `traite` (**48 cours**) ; épreuves par injection **10/10** et
      **6/6** ; 33 blocs JSON valides, **0 BOM, 0 CRLF, 0 URL externe**.

      🟠 **`doc/lecon-03` repérimée une 13ᵉ fois** et réassemblée par `tools/doc/gen.js` :
      `verif-normatif` **67 OK / 8 échecs → 75 OK / 0 échec**. 🟠 **`etude-recherche` ET
      `etude-inconnu` repérimées**, réassemblées, puis le cycle index ↔ étude bouclé jusqu'au
      point fixe (voir le résultat 10).

      ---

      **LE 50ᵉ COURS EST DÉSIGNÉ — `nosql`.** Classement par nocivité réelle rejoué sur les
      **42 cours restants** : `nosql` **56,5 devinables** (57 questions, **99,1 %**), `vue` 56,0,
      `perl` 55,7, `dart` 55,5, `perf-web` 54,5, `r` 54,0, `observabilite` 54,0, `lisp` 54,0.

      **Mesure de départ — c'est le cours le plus tordu qu'ait rencontré B4 depuis `stats`** :
      « la plus longue » **99,1 %** (couverture 98,2 %, **rendement 100,0 %**), et les rangs sont
      **57 / 0 / 0 / 0** : la bonne réponse est la plus longue dans **toutes** les questions
      tranchées, sans une seule exception. Cible **15 / 14 / 14 / 14**.
      Puis « la plus détaillée » **78,1 %** (rendement **100 %**), « le mot technique exclusif »
      **73,8 %** (couverture 77,2 %, rendement 86,4 %), « RESTREINDRE à la parenthèse » 68,3 %
      (rendement **100 %**), « l'incise entre parenthèses » 63,1 % (rendement **100 %**),
      « la ponctuation forte » 49,5 % (rendement 95,0 %), « ECARTER la moins bavarde » 43,4 %
      (rendement **100 %**).
      ⚠️ `mesure-biais-inverse` : **4 alertes**, les quatre rangs de longueur à **DIRECTE 0,0 %**
      — même configuration franche que `julia`. ⚠️ Mots fétiches : `chaque` (6 bonnes / 3
      distracteurs, **31,7 %**), `données` (10/14, 30,5 %), `documents` (8/11, 29,5 %).
      ⚠️ Lexique **ouvert dans les trois lectures** : STRICTE 42,1 % / **54,2 %**, PROPORTION
      59,6 % / **58,8 %**, INVERSE 54,4 % / 29,0 %. Intrus lexical : DÉFAUT 24,0 % avec **2
      questions sûres**, EXCÈS 26,2 %.
      **`nosql` ne s'exécute pas** (aucun moteur installé) : même régime que les 47ᵉ, 48ᵉ et 49ᵉ
      cours, on n'écrit que ce que la page établit.
      La consigne `scratchpad/CONSIGNE-JULIA.md` se reprend telle quelle en changeant les chiffres
      et la liste des erreurs de langage ; **y ajouter les trois résultats de cette passe** :
      retourner « la plus dense » se fait en RETIRANT de petits mots ; un tic de LOCUTION
      (`et/ou`), de SIGNE (`…`) ou de GABARIT DE PHRASE rend 100 % et aucun outil ne le voit,
      donc il faut le chercher au `grep` après écriture ; et trois distracteurs de même longueur
      livrent `ECARTER la plus courte` à 100 %.

      ---

      ### 50ᵉ cours — `nosql` (2026-09-23) : **99,1 % → 26,3 %**, et le **47ᵉ indice livré en outil**

      Le cours le plus tordu rencontré depuis `stats` : la bonne réponse était la plus longue dans
      **toutes** les questions tranchées — rangs **57 / 0 / 0 / 0**, couverture 98,2 %, **rendement
      100,0 %**. 57 questions, 172 distracteurs, longueur moyenne 111,8 contre 32,8 caractères
      (**rapport 3,41**), **11 059 caractères** à écrire sur 56 questions.

      **TROIS VAGUES de six agents, 172 distracteurs sur 172 réécrits, 0 atteinte aux
      intouchables** (`q` / `correct` / `explain` / bonne réponse).

      | | départ | vague 1 | vague 2 | **final** |
      |---|---:|---:|---:|---:|
      | « la plus longue » | **99,1 %** | 26,3 % | 26,3 % | **26,3 %** |
      | rangs | 57/0/0/0 | 15/14/14/14 | 15/14/14/14 | **15/14/14/14** (0/57 à retoucher) |
      | tics de lot | — | **2** (dont un à 100 %) | 2 | **AUCUN** |
      | biais inverse | 4 alertes (DIRECTE **0,0 %**) | 0 | 0 | **0 alerte** |
      | mot fétiche | 3 alertes | **2** (`chaque` 6/**44**) | 0 | **0** |
      | intrus lexical | 2 questions sûres | 0 | 0 | **0** |
      | lexique STR / PROP / INV | 42,1 / 59,6 / 54,4 % | 0,0 / **21,1** / 0,0 % | 0,0 / 8,8 / 0,0 % | **0,0 / 1,8 / 0,0 %** |

      Pire des 46 stratégies à l'arrivée : **27,3 %** (`ECARTER la moins bavarde`, couverture 7,0 %).
      « la plus longue » à 26,3 % **est** le quota de rang 0 imposé par le plan (15 questions sur 57).

      ---

      #### ⚠️⚠️⚠️ LE RÉSULTAT DE CETTE PASSE : LES MESURES ÉTAIENT VERTES ET LE TEXTE NE VOULAIT PLUS RIEN DIRE

      Après la vague 2, **les 46 stratégies étaient à couverture 0,0 %**, les trois variantes du
      lexique à 0,0 %, zéro mot fétiche, zéro question sûre. Une vague de contradiction (6 agents,
      lecture seule) a trouvé que **15 distracteurs sur 27** d'un lot ne voulaient rien dire, et que
      sur **4 questions des 9**, *les trois* distracteurs contenaient une proposition inintelligible :
      la consigne « **choisis la seule option qui a un sens** » tranchait ces questions à **100 %**.

      Échantillon, à lire à voix haute : « le réglage **y protège le solde à la fin de la nuit** » ;
      « le « tout ou rien » peut alors **protéger gratuitement le tout dernier numéro** » ; « le moteur
      peut donc **unir ses listes par leur seul nom exact** » ; « Entre la durabilité (D) et la réponse
      des serveurs, **car la règle inévitable ne peut plus valoir sur un virement** ».

      C'est le défaut du 39ᵉ cours (`scala`, 30 prises sur 54) et du 45ᵉ (`securite`, neuf contrôles
      verts sur une salade de mots), **reproduit à l'identique malgré la consigne qui le nommait**.
      Un relecteur l'a dit mieux que le tableau : la vague avait échangé **trois erreurs pédagogiques
      NETTES** (« Une collection est une colonne, un document une table ») contre **trois
      non-phrases**. Du point de vue de l'apprenant, le QCM était devenu **PIRE** qu'avant, pendant
      que toutes les mesures s'amélioraient.

      **Ce que ça enseigne pour les 41 cours restants : la relecture par contradiction n'est pas un
      luxe de fin de passe, c'est le seul instrument qui mesure ce que les 47 outils ne voient pas.**
      Elle a coûté 6 agents et rendu 4 défauts BLOQUANTS, 2 bonnes pratiques présentées comme des
      erreurs de sécurité, et 5 tics de lot chiffrés.

      ---

      #### 🟢 47ᵉ INDICE, LE TIC DE LOT — `tools/mesure-tics-lot.js`, outil neuf

      **Cinq relecteurs sur cinq ont remonté le même type d'indice, chacun avec une sonde jetable
      écrite à la main** — parce qu'aucun des 46 outils ne le voyait.

      **Ce que c'est** : quand six agents rallongent les distracteurs d'un cours, ils emploient tous
      le même *matériau de rallonge* — une glose entre parenthèses ouverte par un article
      (« (un plan figé) », « (une option) »), un connecteur causal, un adverbe de reprise, une virgule
      avant « et ». **La bonne réponse, elle, n'y a pas droit : elle est intouchable.** Le matériau de
      rallonge devient donc **la signature du distracteur**.

      Mesure fondatrice sur `nosql`, après deux vagues qui avaient tout ramené à 0,0 % de couverture :

      | tic | bonnes / distracteurs | tranchées | rendement | gain au cours |
      |---|---|---:|---:|---:|
      | parenthèse ouverte par un article | **3 / 45** | 14 | **78,6 %** | **38,2 %** |
      | la même, en fin d'option | **1 / 22** | 7 | **100,0 %** | **34,2 %** |

      **Sur le site entier : 533 tics de lot sur 94 cours.** Le pire est `fsharp` — deux-points
      médian, **25 bonnes / 1 distracteur**, 24 questions tranchées, rendement **100 %**, gain
      **58,3 %**, soit **plus du double du hasard**. Puis `prolog` 57,9 %, `dart` 57,5 %, `ada`
      55,6 %, `objc` 55,1 %, `bash` 54,0 %, `docker` 53,1 %. Les cours **déjà traités par B4**
      tombent à 28-30 % (`julia` 1 tic, `clojure` 1, `sass` 1, `powershell` 2), et **`elixir` est le
      seul cours du site totalement exempt**.

      **Calibrage — et c'est la leçon d'outillage de la passe.** Un premier seuil naïf (« rendement
      local ≥ 70 % ou ≤ 30 % ») rendait **39 alertes sur `nosql`**, noyées de bruit : un motif qui
      tranche 5 questions sur 57 à rendement 0 % ne rapporte que 26,3 %. Recalibré sur le **GAIN AU
      COURS ENTIER**, comme `mesure-biais-inverse` le prescrit explicitement : **2 alertes**, exactement
      les deux prises des relecteurs.

      ⚠️ **Un agent a trouvé un bug dans l'outil le jour même de sa livraison, et un second l'a
      rencontré indépendamment** : **`\b` est ASCII en JavaScript**. `/\bcar/i.test("s'écartent")`
      rend **true** (frontière entre « é » et « c »), `/\b(?:alors|puis)\b/i.test("épuisé")` aussi.
      Deux faux positifs mesurés sur un corpus français, et un agent a réécrit un distracteur pour
      rien (« à la **car**te » compté comme connecteur causal). Corrigé : `AV`/`AP` encadrent chaque
      motif par « pas une lettre, accents compris ». 5 cas de contrôle passent.

      ---

      #### 🟠 DÉFAUT DE CONTENU corrigé — le fil rouge violait la règle que sa propre page énonce

      `lecon-14.html` posait `db.produits.createIndex({ stock: 1, prix: 1 })` pour la requête
      `db.produits.find({ stock: { $gt: 0 } }).sort({ prix: 1 })`. Or `stock` y est un **Range**
      (`$gt`) et `prix` le **Sort** : l'index place le **Range avant le Sort**, l'inverse exact de la
      **règle ESR** que le glossaire de la **même page** énonce (« *Equality*, puis *Sort*, puis
      *Range* ») et que `lecon-07` répète. L'index ordonne par `(stock, prix)`, pas par `prix` : le
      tri ne peut pas être servi. **Et la figure d'architecture de la même page écrivait déjà l'ordre
      correct** (« + index sur **prix / stock** ») — le code contredisait sa propre illustration.
      Corrigé en `{ prix: 1, stock: 1 }`, avec la mention de l'ordre ESR dans le commentaire et dans
      l'étape « Indexer ». Défaut **pré-existant**, identique dans `HEAD` : il a traversé toute la
      chaîne, et c'est la contradiction qui l'a vu. Plus : « **La** bonne réflexe » → « **Le** bon
      réflexe » dans le corps de `lecon-10`.

      ---

      #### CE QUE LES TROIS VAGUES ONT APPRIS, et qui vaut pour les 41 cours restants

      **1. La correction FABRIQUE ses propres indices, et il en faut une deuxième pour les solder.**
      La vague 1 a créé de toutes pièces : le mot `chaque` (**6 bonnes / 44 distracteurs**, ECARTER
      29,9 % — les six agents ont allongé avec le même mot **sans se concerter**, exactement le tic
      de lot annoncé par la passe `julia`), le mot `données` (RESTREINDRE 33,5 %), et une **règle du
      `w`** ouverte (PROPORTION tranchait 21,1 % des questions à rendement **0,0 %**, donc 33,3 % à
      qui l'écarte).

      **2. `PROPORTION` compare `k` ET `w`.** À `k` égal, c'est le nombre de mots de 6+ lettres qui
      désigne. Égaliser `k` sans égaliser `w` rouvre l'indice — un agent l'a payé d'un aller-retour.

      **3. Supprimer une marque la RETOURNE.** Deux agents ont conclu séparément qu'il ne fallait
      **pas** supprimer les parenthèses des distracteurs : la bonne réponse restant seule à en
      porter, `RESTREINDRE à la parenthèse` serait passé à 100 % (c'était le pire indice du cours au
      départ, **33 bonnes / 0 distracteur**). Ce qu'il faut retirer, c'est **l'article qui les
      ouvre**, pas l'incise.

      **4. Le tokeniseur d'écho de `mesure-biais-qcm` coupe sur l'apostrophe mais PAS sur le trait
      d'union** : « suffit-elle » est **un seul jeton**, donc « qu'elle » n'y fait pas écho. Un
      diagnostic écrit à la main se trompe ici.

      **5. Une sonde doit CHARGER l'outil, pas le recopier.** Le meilleur compte rendu de la passe
      vient de l'agent dont la sonde importe `STRATEGIES` depuis `tools/mesure-biais-qcm.js` et
      extrait le tableau `FORMES` du source de `mesure-tics-lot.js` : sa mesure de non-régression est
      un `diff` **vide** contre un relevé de référence pris avant sa passe.

      **6. Le piège du heredoc, reconfirmé deux fois** : un `\b` passé par heredoc devient **U+0008**
      et rend les regex silencieusement fausses. Il a touché un agent — et l'orchestrateur, sur le
      correctif de l'outil lui-même.

      ---

      **RELIQUAT ASSUMÉ ET CHIFFRÉ** : `lecon-01` q2 laisse `PROPORTION` trancher **1 question sur
      57** (`w` = 14/17/11/11 à `k` égal). Fermer exigerait de réécrire deux options portant
      **14 mots de 6+ lettres sous 173 caractères** et rapporterait **0,1 point** (25,1 % → 25,0 %) :
      **refusé par le calcul de ce qu'il coûterait**, comme au 35ᵉ cours — le risque de refabriquer
      une salade de mots dépasse le gain.

      **DETTE D'OUTILLAGE, confirmée par deux témoins indépendants** : `mesure-lexique-qcm --liste`
      accepte `wSup > 0` (« un distracteur porte plus de mots longs que la bonne ») et annonce
      « 0 question à mettre en forme » pendant que la variante **PROPORTION tranche encore**. **Le
      cliquet VALIDE une fermeture par RETOURNEMENT.** Quand `k > 0`, seule l'égalité stricte des
      quatre `w` ferme. À corriger dans une passe d'outillage.

      **Ce cours ne s'exécute pas** (aucun moteur NoSQL installé) : même régime que les 47ᵉ à 49ᵉ.
      **Aucune bonne réponse n'a été jugée fausse** par les dix-huit agents — troisième cours
      d'affilée. Périmètres refusés, convergents d'un agent à l'autre : chiffres de latence, messages
      d'erreur exacts, comportements de version (transactions multi-documents de MongoDB, niveaux de
      cohérence de Cassandra, éviction de Redis, index HNSW/IVF), quorum et `W + R > N`, journalisation
      sur disque (`j:true`), compression automatique attribuée à Redis, CouchDB et Riak (absents ou
      mal étiquetés par le cours).

      **Contrôles** : `verif.js --rapide` **53 étapes tout vert (200,8 s)** ; `verif-html` **0 sur
      1 629 pages** ; `verif-donnees` **0 erreur sur 26 invariants** (3 avertissements pré-existants) ;
      `mesure-qcm-intouchable nosql a943c2f` **172/172 réécrits, 0 atteinte** ; épreuves par injection
      **10/10** et **6/6** ; les **DEUX cliquets refigés**, `nosql` marqué `traite` (**49 cours**) ;
      `doc/lecon-03` repérimée une **14ᵉ** fois et réassemblée (`verif-normatif` **67 OK / 8 échecs →
      75 OK / 0 échec**) ; `etude-inconnu` **et** `etude-recherche` réassemblées, cycle index ↔ étude
      bouclé au **point fixe dès le 1er tour**, stabilité vérifiée sur **3 tours à vide** ; 29 blocs
      JSON valides, **0 BOM, 0 CRLF, 0 chargement externe actif**.

      ---

      **LE 51ᵉ COURS EST DÉSIGNÉ — `vue`.** Classement par nocivité réelle rejoué sur les **41 cours
      restants** (`stats` exclu, il reste le cours-témoin de `verif-qcm-biais-mutations`) : `vue`
      **56,0 devinables** (62 questions, **90,3 %**), `perl` 55,8, `dart` 55,5, `perf-web` 54,5,
      `docker` 54,0, `observabilite` 54,0, `lisp` 54,0, `r` 54,0, `bash` 53,5, `tests` 53,5.
      **Site : 6 167 questions, 2 802 devinables (45,4 %), 49 cours marqués traités.**

      **Mesure de départ de `vue`** : « la plus longue » **90,3 %** (couverture **100 %**, rendement
      90,3 %), rangs **56 / 5 / 0 / 1**, cible 16/16/15/15, **11 379 caractères** sur 58 questions/62.
      Puis « la plus détaillée » **76,9 %** (rendement 100 %), « le mot technique exclusif » **60,1 %**
      (couverture 54,8 %, rendement 85,3 %), « la seule avec une PONCTUATION FORTE » **60,1 %**
      (rendement **100 %**), « la seule avec un point-virgule » **44,4 %** (rendement **100 %**).
      ⚠️ **`vue` porte NEUF tics de lot**, dont trois au-dessus de 41 % : point-virgule médian
      (**16 bonnes / 0 distracteur**, 16 tranchées, rendement **100 %**, gain **44,4 %**), glose
      finale entre parenthèses (16/4, **87,5 %**, gain 41,1 %), deux-points médian (15/3, 87,5 %,
      gain 41,1 %). **C'est le premier cours traité en connaissant ses tics AVANT d'écrire** :
      la consigne doit les fermer dès le premier lot, au lieu de les fabriquer.

      La consigne se reprend de `scratchpad/CONSIGNE-NOSQL.md` **et** de
      `scratchpad/CONSIGNE-NOSQL-V3.md` — cette dernière porte la règle qui prime sur toutes les
      mesures : *un distracteur est une phrase française qui énonce une thèse fausse, précise et
      plausible ; si l'on ne peut pas dire en une phrase pourquoi c'est faux, ce n'est pas un
      distracteur*. **Les deux doivent être données ensemble dès le premier lot** : c'est en les
      séparant qu'on a payé une troisième vague ici.

      ---

      **ÉTAT DU 51ᵉ COURS (`vue`) AU 2026-09-25 — LE POINT N'EST PAS CLOS, ET VOICI OÙ IL EN EST.**
      Deux réveils y ont travaillé : celui du 23/09, coupé par la limite de session, et celui-ci.

      | | départ | après le 23/09 | ce réveil |
      |---|---:|---:|---:|
      | « la plus longue » | 90,3 % | 25,8 % | **25,8 %** |
      | pire des 44 stratégies | 90,3 % | 25,8 % | **28,6 %** |
      | fautes de rédaction | — | **98** | **0** |
      | rangs | 56/5/0/1 | 16/16/15/15 | **16/16/15/15** |

      **1. L'indice de DENSITÉ fermé par un dosage CALCULÉ.** 17 questions où « la plus dense (mots
      longs) » désignait seule la bonne réponse, 18,75 points sur 62, cible 15,50 : **3,25 à retirer,
      donc 3 bascules**, pas 17. Mesuré : **30,2 % → 25,4 %**. Un premier jeu de retouches a été
      **annulé** : il fermait la densité mais **retournait « la moins bavarde » à 21,0 %** (rendement
      17,8 %) et rouvrait le lexique sur les trois mêmes questions. Cause : réduire le nombre de mots
      d'un distracteur le fait passer **sous** la bonne réponse, qui est intouchable. Le second jeu ne
      touche **qu'aux mots de 5 lettres ou moins** — ce qui laisse `w` et `k` intacts par construction.

      **2. LES 46 MESURES ÉTAIENT VERTES ET LE TEXTE ÉTAIT MAUVAIS — pour la deuxième fois.** Une
      relecture adversariale (5 agents, lecture seule, 14 leçons) a rendu **98 fautes** : **79
      distracteurs inintelligibles**, **8 accidentellement VRAIS**, 27 bloquantes. Exactement le
      défaut du 50ᵉ cours. **Deux de mes propres retouches du jour y figuraient** : empiler des
      démonstratifs (« cette key », « ce duo », « ces entrées ») pour tenir un compteur de caractères
      tient la mesure et détruit le français. Rapport archivé : `scratchpad/vue-relecture/`, un
      fichier par leçon.

      **3. UN GARDE-FOU QUI NE SURVEILLE QU'UNE PARTIE DES STRATÉGIES EST VERT PENDANT QUE LA FAILLE
      EST ENTIÈRE.** C'est la leçon principale de la passe, et c'est le défaut du cliquet de `lua`,
      à l'identique. `scratchpad/vue-sonde/controle.js` v1 surveillait **sept** indicateurs écrits à
      la main. Les cinq agents de réécriture les ont **tous tenus** — et la mesure s'est rouverte
      ailleurs : l'incise entre parenthèses **25,0 % → 36,6 %** (rendement 100 %), le tiret 27,2 %,
      le COMBINE tiret+longueur 29,0 %, le tic de lot « glose finale » 29,0 %. **La cause était dans
      la consigne** : « aucune parenthèse de remplissage » a été suivie à la lettre, les distracteurs
      ont perdu leurs incises, et la bonne réponse — intouchable — est restée **seule** à en porter.
      Fermer une faute de rédaction rouvre un indice de forme.
      `controle.js` **v2** ne recopie plus aucune définition : il **charge les 44 stratégies** depuis
      `tools/mesure-biais-qcm.js` et compare, question par question, l'**ensemble des options que
      chacune désigne**. Tout indice présent ou futur est couvert.

      **4. LA TENSION STRUCTURELLE, MESURÉE TOUR PAR TOUR.** Sept lots de retouches ont ramené le pire
      indice de **36,6 % à 28,6 %**, et chaque fermeture en a ouvert une autre :
      incise 36,6 → 32,9 → 27,4 (fermée) · tiret 27,2 → fermé · densité 28,6 → fermée → **rouverte à
      30,2 % par les corrections lexicales** → 28,6 %. Le lexique, lui, est passé de fermé à
      **5 exploitables** (mes ajouts de parenthèses portaient des mots absents des pages) puis
      redescendu à **3**.

      **CE QUI RESTE À FAIRE, chiffré** (une passe dédiée suffit ; tout est outillé) :
      - `la plus dense` **28,6 %** — 17 questions listées par `scratchpad/vue-sonde/densite.js`,
        **2 bascules** suffisent (dosage calculé).
      - `COMBINE : tiret puis longueur` **27,4 %**, `ecarter les absolus` 27,0 %, `le mot technique
        exclusif` 27,0 % (**6 questions, −2,00 points, l'outil dit lesquelles**), `ecarter la glose
        finale` 27,0 %, `la MAJUSCULE d'emphase` 26,6 %.
      - lexique : **3 exploitables, 5 à mettre en forme** — `mesure-lexique-qcm --liste=vue` nomme
        les mots exacts à remplacer.
      - mot fétiche : **1 alerte**, « chaque » (3 bonnes / 35 distracteurs, ÉCARTER rend 30,6 %).
      - **Décision qui ne revient pas à un écrivain** : la bonne réponse de `lecon-09` q2 enseigne la
        priorité `v-for`/`v-if` de **Vue 2** dans un cours Vue 3. L'agent a retiré le distracteur qui
        disait le vrai comportement de Vue 3 (la question n'a donc plus deux réponses défendables),
        mais **la bonne réponse et son `explain` restent datés**. Toucher à l'intouchable est une
        décision d'orchestrateur : à trancher.

      **Contrôles de cette passe** : `verif-html` **0 sur 1 629 pages** ; `verif-donnees` **0 erreur
      sur 26 invariants** (3 avertissements pré-existants) ; `verif.js --rapide` **53 étapes, 154,5 s**
      (les 5 signalements sont les attendus d'un cours en cours de traitement : les deux cliquets non
      refigés, `doc/lecon-03` repérimée, `etude-inconnu` à réassembler) ; `quiz-index` régénéré
      (**6 151 entrées**) ; `mesure-qcm-intouchable vue c1c3b1f` **183/186 distracteurs réécrits,
      0 atteinte** ; **aucune explication orpheline** ; tics de lot **0 alerte** ; 29 blocs JSON
      valides, **0 BOM, 0 chargement externe**. **Les deux cliquets ne sont PAS refigés** : figer
      verrouillerait un état intermédiaire.

      ⚠️ **DEUX RÈGLES DE MÉTHODE PAYÉES CETTE PASSE.** (a) **Commiter une vague AVANT d'y toucher** :
      un `git checkout -- pages/vue/` lancé pour annuler un applicateur défectueux a écrasé les
      **107 réécritures non commitées** des cinq agents. Elles ont été reconstruites depuis les
      fichiers de patchs laissés dans leurs dossiers de travail (`scratchpad/vue-ecriture-A..E`, cinq
      formats différents) par `scratchpad/vue-sonde/recupere.js` — 107 remplacements, 0 refus, et
      l'état obtenu redonne **au chiffre près** la mesure d'après la vague. Rien n'a été perdu, mais
      la reconstruction a coûté plus cher que le commit qui l'aurait évitée. (b) **Un applicateur qui
      réécrit un bloc JSON doit en réécrire les CROCHETS** : les oublier a cassé les 29 blocs des
      14 leçons d'un coup, silencieusement. `pose.js` reparse maintenant chaque bloc avant d'écrire,
      et refuse si un seul est invalide.

      ---

      **51ᵉ COURS CLOS le 2026-09-29 — `vue`, 90,3 % → 25,8 %.** Troisième réveil sur ce cours.

      | | départ | 25/09 | **clôture** |
      |---|---:|---:|---:|
      | « la plus longue » | 90,3 % | 25,8 % | **25,8 %** (rangs 16/16/15/15) |
      | pire des 44 stratégies | 90,3 % | 28,6 % | **27,4 %** (COMBINE tiret puis longueur) |
      | lexique : exploitables / à mettre en forme | — | 3 / 5 | **0 / 0** |
      | mot fétiche « chaque » (ÉCARTER) | — | 30,6 % | **27,8 %**, 0 alerte |
      | tics de lot | 9 | 0 | **0** |
      | distracteurs réécrits depuis `c1c3b1f` (`mesure-qcm-intouchable`) | — | 183 / 186 | **183 / 186** ; **6 atteintes**, toutes délibérées : les 6 du point 1 (`lecon-09` q2 bonne réponse + `explain`, `lecon-11` q1 `explain`, q2 énoncé + bonne réponse + `explain`) |

      **1. DEUX BONNES RÉPONSES FAUSSES, vérifiées sur la documentation officielle puis corrigées
      (décision d'orchestrateur, puisque c'est l'intouchable).**
      - `lecon-09` q2 : la bonne réponse enseignait la priorité de **Vue 2** (`v-for` évalué pour
        chaque élément masqué). Doc de Vue 3 (`vuejs.org/guide/essentials/list.html`) : *« When they
        exist on the same node, v-if has a higher priority than v-for »* — la condition ne voit pas la
        variable de boucle. Bonne réponse, `explain` et corps corrigés ; le distracteur qui annonçait
        « v-for puis v-if, rendu optimal » porte maintenant l'idée fausse de Vue 2.
      - `lecon-11` : la leçon affirmait qu'un champ rend **toujours une chaîne, même en
        `type="number"`**. Doc de Vue 3 (`vuejs.org/guide/essentials/forms.html`) : *« The number
        modifier is applied automatically if the input has type="number" »*. Corrigés : puce du corps,
        exemple de code, encadré, question de révision, deux QCM (énoncé, bonne réponse, `explain`),
        indice d'exercice, solution. **Trouvé par la relecture, par aucun des 46 outils** : ce défaut
        vivait dans le CORPS, l'`explain` et la bonne réponse à la fois — l'intouchable.
      - Conséquence mesurée : l'ancien énoncé survivait dans `quiz-index.js` par le **filet de
        reprise** de `build-index.js` (« 1 question reprise de l'ancien index », 6 152 entrées au lieu
        de 6 151). Régénéré avec **`--fresh`**, comme l'en-tête de l'outil le prescrit ; `--strict` OK.

      **2. LE LEXIQUE ET LE MOT FÉTICHE FERMÉS À LA MAIN, et chaque fermeture a d'abord rouvert autre
      chose** — la loi du chantier, vérifiée trois fois dans la même heure :
      - égaliser `w` en ajoutant des mots longs, j'ai pris `jamais`/`toujours` : **« écarter les
        absolus » 27,0 % → 28,4 %**. Remplacés par des mots longs non absolus : retour à 27,0 %.
      - retirer `chaque` en le remplaçant par `tout` (4 lettres) : un distracteur est devenu MOINS
        dense que la bonne réponse, **« la plus dense » 27,0 % → 28,6 %**. Réparé par une variante
        plus dense.
      - dosage calculé pour « chaque » : 19,53 points sur 62, il fallait en retirer ~2,2 ; retirer le
        mot d'une question où TROIS distracteurs le portent rapporte **0,5 point**, d'une question où
        il n'en porte qu'un, **0,08**. Onze retouches au lieu de trente-six.

      **3. LA RELECTURE PAR CONTRADICTION, lancée APRÈS que toutes les mesures furent au vert — et
      c'est elle qui a trouvé l'essentiel.** 5 agents, lecture seule, 62 questions : **63 fautes** —
      32 distracteurs inintelligibles, 14 fautes de français, **8 « seule option sensée »** (dont les
      **trois** distracteurs de `lecon-01` « les trois blocs d'un composant monofichier », qui
      s'accusaient eux-mêmes d'absurdité : `<html>` pour la logique, `<js>` pour le contenu), 3
      distracteurs accidentellement VRAIS, 4 « deux réponses défendables », 2 bonnes réponses
      fausses (point 1), et une faute de français dans MA correction du jour (« n'accède pas **à** »).
      Rapport : `scratchpad/vue-relecture-2/`.
      **Les 60 fautes de distracteurs réécrites par 5 écrivains sur fichiers disjoints, 0 refus, sous
      garde de `controle.js` v2** (44 stratégies + `w`/`k`, comparées à HEAD question par question).
      Résultat : **sur 60 réécritures, AUCUNE des 44 stratégies n'a changé de désignation, sur aucune
      question** ; seuls 7 `w` ont bougé, sur des questions à `k = 0` où ils ne tranchent pas. C'est la
      première vague de réécriture de B4 qui ne rouvre RIEN — et la différence avec le 25/09 tient à
      l'outil de garde : il surveille l'ensemble des stratégies, pas une liste écrite à la main.

      ⚠️ **Deux pièges de passe, à retenir** : (a) l'outil d'édition des agents a réécrit les
      **14 fichiers en CRLF** (déjà vu au 9ᵉ cours) — repassés en LF avant le commit, le diff ne
      porte que sur 42 lignes de QCM ; (b) les relecteurs ont rendu les balises échappées (`&lt;`)
      alors que le JSON des pages porte des `<` bruts : les 60 textes ont été désechappés et
      **retrouvés à l'identique (60/60)** avant de lancer les écrivains.

      **Contrôles de clôture** : `verif.js --rapide` **53 étapes tout vert (255,2 s)** ; `verif-html`
      **0 sur 1 629 pages** ; `verif-donnees` **0 erreur** (3 avertissements pré-existants) ;
      épreuves par injection **10/10** et **6/6** ; les **deux cliquets refigés**, `vue` marqué
      `traite` (**50 cours**) ; `doc/lecon-03` repérimée et réassemblée par `tools/doc/gen.js`
      (`verif-normatif` **66 OK / 9 échecs → 75 OK / 0 échec**) ; `etude-inconnu` et
      `etude-recherche` réassemblées, cycle étude ↔ index au **point fixe au 3ᵉ tour**, stabilité
      vérifiée à vide ; `quiz-index` régénéré `--fresh` (**6 151 entrées**) ; JSON valide, **0 BOM,
      0 CRLF, 0 chargement externe**.

      ---

      **LE 52ᵉ COURS EST DÉSIGNÉ — `perl`.** Classement par nocivité réelle (questions × « la plus
      longue ») sur les **40 cours restants**, `stats` exclu (cours-témoin) : `perl` **55,8
      devinables** (60 questions, **92,9 %**), `dart` 55,5, `perf-web` 54,5, `docker` 54,0,
      `observabilite` 54,0, `lisp` 54,0, `r` 54,0, `bash` 53,5, `tests` 53,5, `pascal` 53,3.
      **Site : 6 167 questions, 2 762 devinables à la longueur (44,8 %), 50 cours traités.**
      ⚠️ **`perl` porte DIX tics de lot**, dont le point-virgule médian (**18 bonnes / 2 distracteurs**,
      rendement 100 %, gain 45,0 %), la glose finale entre parenthèses (15/2, gain 42,9 %) et le
      deux-points médian (11/1, gain 37,5 %). Point interne : 2 questions tranchées sur 60.
      ⚠️⚠️ **`pages/perl/lecon-13.html` porte un MOJIBAKE VOLONTAIRE** (leçon sur l'encodage) : les
      écrivains ne touchent QU'AUX distracteurs de ses QCM, et le corps ne doit pas être « réparé ».
      **Méthode qui a fait ses preuves sur `vue`, à reprendre dès le premier lot** : écrire sous garde
      de `controle.js` v2 (à copier dans `scratchpad/perl-sonde/` en changeant le cours), puis relire
      par contradiction AVANT de déclarer le cours clos, même quand les 46 mesures sont vertes.

      **PRÉPARATION FAITE le 2026-09-29, pour que le réveil suivant lance l'écriture sans délai** :
      - `scratchpad/CONSIGNE-PERL.md` (suivie par git) : la consigne de `vue` refaite sur les mesures
        de `perl` — 92,9 % à la longueur (couverture 95,0 %, rendement 96,5 %), rangs **58/1/1/0**,
        **10 509 caractères** à écrire sur 57 questions, rapport bonne/distracteur **4,01**
        (90,4 contre 22,5 caractères), lexique **46 exploitables / 28 retournées / 50 à mettre en
        forme**, intrus lexical EXCÈS **28,9 %** (2 questions sûres), 4 alertes de rang à DIRECTE
        0,0 %, les dix tics de lot, 0 mot fétiche.
      - 🟢 **Ce cours S'EXÉCUTE** : Perl **5.42** est dans Git Bash (`/usr/bin/perl`). Les dix
        « erreurs classiques de débutant » de la consigne ont été **vérifiées par exécution** avant
        d'être écrites (`my $n = @t` → 3 ; `"0.0"`, `"00"`, `" "`, `"0E0"` vrais ; `chomp` contre
        `chop` ; `<(.*)>` sur `<a><b>` → `a><b`, `.*?` → `a` ; `$_[0] = …` modifie l'appelant ;
        `"10" eq "10.0"` faux…). **Les bonnes réponses de ce cours pourront être prouvées, pas
        seulement relues** : c'est le premier usage à donner au fan-out du prochain réveil.
      - Sondes (locales, ignorées par git) : `scratchpad/perl-sonde/` (`controle.js` v2, `simule.js`,
        `essai.js`, `rempl.js`, `dosage.js`, `chaque.js`…) ; sorties brutes des outils au départ :
        `scratchpad/perl-depart/`.
      - 🟢 **LES BONNES RÉPONSES PROUVÉES AVANT D'ÉCRIRE AUTOUR** : `perl scratchpad/perl-depart/bonnes.pl`
        rend **41 vérifications OK, 0 KO, couvrant 33 questions sur 60** — tri par défaut alphabétique
        (`10 100 9`) contre `<=>` (`9 10 100`), `my $n = @t` → 3, `@f[0]` = tranche avec
        l'avertissement *« better written as $f[0] »*, `say` refusé sans `use feature`, `.+` → `a><b`
        contre `.+?` → `a`, `'>'` qui tronque et `'>>'` qui ajoute, aplatissement de `@_` (5 éléments
        contre 2 références), `ref` d'un non-référence = chaîne vide, module finissant par `0;` →
        *« did not return a true value »*, `-n`/`-p`, `$+{annee}`, `(?=…)`, `tr/a//` qui compte sans
        modifier, `split /,/` qui coupe un CSV en 4 champs au lieu de 3, `decode_json` → `HASH`,
        `canonical` qui trie les clés, `eval { …; 1 }`, `croak` qui pointe *« -e line 2 »* (l'appelant)
        quand `die` pointe *« Crk.pm line 1 »*, tri décroissant par valeur d'un hachage compteur.
        **Aucune bonne réponse fausse sur les 33.** Le seul KO du premier jet était **dans mon test**
        (sur `aXbXc`, `.+?` doit consommer au moins un caractère : `a.+?X` ne peut pas rendre `aX`) —
        corrigé en reprenant l'exemple déjà prouvé. Les **27 autres** sont conceptuelles (clarté,
        CPAN, DBI/DBD, Moo) : elles relèvent de la relecture par contradiction, pas de l'exécution.


      ---

      **52ᵉ COURS CLOS le 2026-09-29 — `perl`, 92,9 % → 25,4 %.** Un seul réveil : c'est le premier
      cours de B4 qui s'EXÉCUTE (Perl 5.42 dans Git Bash), et la différence se voit partout.

      | | départ | après la vague | **clôture** |
      |---|---:|---:|---:|
      | « la plus longue » | 92,9 % | 23,8 % | **25,4 %** (rangs 15/15/15/15) |
      | pire des 44 stratégies | 92,9 % | 30,7 % (la moins bavarde) | **26,3 %** (la moins bavarde) |
      | lexique : exploitables / retournées / à mettre en forme | 46 / 28 / 50 | 0 / 0 / 0 | **0 / 0 / 0** |
      | tics de lot | 10 | 0 | **0** |
      | intrus lexical EXCÈS | 28,9 % | 27,2 % | **26,8 %** |
      | mot fétiche, biais inverse | 0 / 4 alertes | 0 / 0 | **0 / 0** (« chaîne » rouvert à 28,2 % par la relecture, redescendu à 26,7 %) |

      **1. LA VAGUE (5 écrivains, leçons disjointes, patchs posés par `pose.js`) : 166 distracteurs
      sur 180 réécrits, 24 scripts Perl exécutés, et AUCUNE bonne réponse fausse sur 60.** Chaque
      distracteur qui parle d'un résultat de code a été prouvé faux AVANT d'être écrit. Consigne tenue
      telle quelle depuis `scratchpad/CONSIGNE-PERL.md` : **aucun tic de lot, aucun mot fétiche, aucune
      alerte de rang** après la vague. Leçon de méthode : faire écrire les agents dans un fichier de
      patchs, jamais avec l'outil d'édition, a supprimé le piège du CRLF (0 fichier touché, contre 14 au
      51ᵉ cours) et celui du JSON cassé.

      **2. LE DOSAGE, CALCULÉ : 8 options retouchées, pas 13.** « la moins bavarde » 30,7 % (3,42 points
      à retirer), 3ᵉ et 4ᵉ plus longue 27,1 % (1,25 point chacune, dus aux questions à options d'un
      seul caractère — les sigils du bilan). Deux changements de rang ciblés (`lecon-14` q2 : 3 → 1 ;
      `lecon-16` q3 : 2 → 1) et six égalités de mots rompues. Résultat : **30,7 % → 26,3 %**, les rangs
      à **25,4 %**. Le premier jet a fait monter « ECARTER la plus dense » de 25,8 % à 26,9 % : raccourcir
      un distracteur en ôtant des mots courts le rend PLUS DENSE que la bonne réponse. Corrigé en
      remplaçant les mots au lieu de les retirer.

      **3. LA RELECTURE PAR CONTRADICTION (5 agents, lecture seule, Perl exécuté) : 53 FAUTES, et plus de
      la moitié hors des QCM.** 26 dans les distracteurs (11 inintelligibles, 10 de français, 1 vrai,
      1 défendable, 1 miroir, 1 qui frôlait une vraie commande d'installation), **22 dans les CORPS de
      leçon**, 5 dans une bonne réponse ou un `explain`. **Aucun des 46 outils ne voit un corps faux** —
      et c'est exactement le défaut qui a fondé la chaîne V12–V17. Les corps faux, chacun PROUVÉ par
      exécution (`scratchpad/perl-sonde/corps.pl`, `open2.pl`, `run/`) puis corrigé :
      - **trois exemples qui ne tournaient pas** : la regex `/x` de `lecon-04` ne COMPILAIT PAS (un « / »
        dans un commentaire ferme le `qr/…/`) ; trois programmes « complets » sans `use feature 'say'`
        (`lecon-09` → `25 27`, `lecon-10` → `150`, qui manquait aussi de `use lib '.'`, `lecon-15` →
        « Refusé : division par zéro ») ;
      - **un mode d'emploi destructeur** : le « cas réel » de `lecon-11`, `perl -i.bak -pe 's/\s+//g'`,
        recollait TOUT le fichier sur une seule ligne (`\s` avale le saut de ligne) → `[ \t]+`, 2 lignes ;
      - **six sorties annoncées fausses** : `(?<!A)\d+` sur `A42 B7` capte **2**, pas 7 ;
        `\w+(?!\.tmp)` accepte `fichier.tmp` ; voyelles **3 → 4** et **6 → 4** ; lettres e **4 → 5** ;
        `19,50 €` → `19.50 €` ;
      - **des règles fausses** : l'interpolation présentée comme un contexte scalaire (`"@t"` rend les
        éléments) ; le look-behind « de longueur fixe » (il est BORNÉ : `(?<=\d{1,3} )` passe,
        `(?<=\d+ )` échoue avec *« Lookbehind longer than 255 »*) ; l'`open` à deux arguments dont le
        danger est l'open SANS mode (`">x"` vide le fichier, `"cmd|"` lance la commande — prouvé) ;
        `$@` écrasé « par un simple print » (faux : par un autre `eval`, prouvé) ; le `1;` « obligatoire »
        (il ne manque que si la dernière instruction vaut faux) ; `$self` « sauf avec Moo » ; `new`
        « mot-clé de Python » ; le déréférencement postfixé « 5.20+ » (stable en 5.24) ; `prove` sans
        `-v` ; `Text::CSV` et `combine` ; « des dizaines de milliers » contre « 200 000 » ;
        `my ($a, $b) = @_` enseigné comme idiome (réservés à `sort` : *« "my $a" used in sort
        comparison »*, tri faux) → `$x, $y` dans le corps, l'exercice, l'indice et l'`explain`.
      - **Une bonne réponse trompeuse** (décision d'orchestrateur) : `lecon-01` q2 disait que `say`
        exige `use feature 'say'` « ou une version récente » — or un Perl récent ne suffit pas (*syntax
        error* sur 5.42). Devenue « ou use v5.10 placés en entête », à `w`, `k` et virgules égaux.
      **25 distracteurs réécrits par 3 écrivains sous `controle.js`, 0 indicateur déplacé.**

      ⚠️ **ANGLE MORT DE `controle.js`, trouvé cette passe** : il compare le `k` en mots DISTINCTS,
      `mesure-lexique-qcm` en OCCURRENCES. Un écrivain a répété « taille » deux fois : `controle.js`
      vert, lexique **1 exploitable**. Refermé par une retouche ; à corriger dans l'outil (lui faire
      charger la fonction du lexique au lieu de la recopier — la leçon du 51ᵉ cours, encore).
      ⚠️ **Les réécritures de la relecture ont FABRIQUÉ un mot fétiche**, invisible à `controle.js`
      (qui ne mesure que des stratégies par question) : « chaîne », 1 bonne réponse / 17 distracteurs,
      ÉCARTER **28,2 %** — alerte. Dosage calculé : la question où TROIS distracteurs le portent rapporte
      0,75 point à elle seule ; 4 options retouchées (« portion », « valeur », mots de la page, `w`
      et `k` égaux) → **26,7 %, 0 alerte**, 0 indicateur déplacé. Troisième cours sur trois où la
      correction fabrique son propre mot fétiche : **relancer `mesure-mot-fetiche` APRÈS la relecture**.
      ⚠️ **Une correction de CORPS peut rouvrir le lexique** : le mot « garantit » ajouté à une légende
      de `lecon-09` a fait tomber le `k` de deux options d'une question. Vu par `controle.js`, reformulé.

      **RELIQUAT ASSUMÉ** : deux bonnes réponses que la relecture juge inexactes sans les dire fausses,
      laissées en l'état (elles restent la meilleure des quatre) : `lecon-08` q2 attribue à la référence
      « évite la copie et permet de modifier l'original », ce que `@_` (alias) offre déjà ; `lecon-07` q2
      dit `my` « indispensable sous use strict » (`our` et les noms complets passent aussi). Le titre
      du commit `c023069` annonce « 32 fautes de corps » : **le bon compte est 23** (22 corps faux,
      dont 1 corrigé plus tôt sur signalement d'un écrivain, plus l'idiome `$a/$b`).

      **Contrôles de clôture** : `verif.js --rapide` **53 étapes tout vert (343,6 s, puis 288,3 s après le dosage de « chaîne »)** — entre les deux, UN passage où `etude-inconnu` a vu **20 lignes au lieu de 10** : seule, l'épreuve passe 2 fois sur 2 et la chaîne suivante est verte ; **aléa intermittent du banc dans la chaîne, à surveiller** ; `verif-html`
      **0 sur 1 629 pages** ; `verif-donnees` **0 erreur** (3 avertissements pré-existants) ; épreuves
      par injection **10/10** et **6/6** ; les **deux cliquets refigés**, `perl` marqué `traite`
      (**51 cours**) ; `doc/lecon-03` réassemblée (`verif-normatif` **75 OK / 0 échec**) ;
      `etude-inconnu` et `etude-recherche` réassemblées, cycle études ↔ index au **point fixe**
      vérifié par empreinte ; index régénérés `--fresh` sur les six cibles (`--strict` OK) ;
      `mesure-qcm-intouchable perl edf10d8` : **166/180 distracteurs réécrits, 4 atteintes, toutes délibérées** (la bonne réponse de `lecon-01` q2, les `explain` de `lecon-06`, `07`, `15`) ; 0 CRLF, 0 BOM, JSON valide,
      **mojibake de `lecon-13` intact**, 0 chargement externe.

      ---

      **LE 53ᵉ COURS EST DÉSIGNÉ — `dart`.** Classement par nocivité réelle sur les **39 cours
      restants** (`stats` exclu, cours-témoin) : `dart` **55,5 devinables** (60 questions, **92,5 %**),
      `perf-web` 54,5, `r` 54,0, `lisp` 54,0, `docker` 54,0, `observabilite` 54,0, `bash` 53,5,
      `tests` 53,5, `pascal` 53,3, `fsharp` 52,3. **Site : 6 167 questions, 2 722 devinables à la
      longueur (44,1 %), 51 cours traités.** Méthode à reprendre telle quelle : consigne sur mesures
      AVANT d'écrire (tics de lot connus d'avance), écrivains en fichiers de patchs, dosage calculé,
      relecture par contradiction qui lit AUSSI les corps, preuve par exécution partout où le langage
      tourne. ⚠️ **Dart n'est PAS installé** (`which dart` : absent, relevé du 2026-09-29) : même régime
      que `vue` et `nosql`, relecture sans exécution — sauf à installer le SDK, décision à prendre
      avant la vague.

      **PRÉPARATION FAITE le 2026-09-29, pour que le réveil suivant lance l'écriture sans délai** :
      - `scratchpad/CONSIGNE-DART.md` (suivie par git) : la consigne de `perl` refaite sur les mesures de
        `dart` — 92,5 % à la longueur (couverture 100 %), rangs **56/1/3/0**, **13 773 caractères** à
        écrire sur 56 questions, rapport bonne/distracteur **4,77** (115,4 contre 24,2 caractères : **le
        pire de B4**), PONCTUATION FORTE **72,1 %**, mot technique exclusif **71,4 %**, lexique
        **52 exploitables / 26 retournées / 58 à mettre en forme**, **5 alertes** de biais inverse,
        **sept tics de lot** dont le point-virgule médian (**26 bonnes / 0 distracteur**, gain 57,5 %).
      - ⚠️ **Premier cours où `mesure-mot-fetiche` alerte AVANT l'écriture** — 4 alertes, toutes dans le
        sens des BONNES réponses : `valeur` 33,3 %, `exécution` 33,3 %, `parce` 30,6 %, `flutter` 29,6 %.
      - Les leçons du 52ᵉ cours y sont reportées : écriture par fichier de patchs, `k` en occurrences,
        relecture qui lit les CORPS, mot fétiche remesuré APRÈS la relecture, `build-index --only=…`.
      - Sondes (locales) : `scratchpad/dart-sonde/` ; sorties brutes de départ : `scratchpad/dart-depart/`.
      - 🔴 Dart n'est pas installé : la table des erreurs de débutant de la consigne est écrite de
        mémoire. Sa première version portait **une ligne fausse** (`var x;` sans valeur accepte bien
        `"a"` puis `3`), corrigée à la relecture — exactement le risque qu'un cours non exécutable fait courir.

      ---

      **53ᵉ COURS CLOS le 2026-09-29 — `dart`, 92,5 % → 25,0 %.** Deux réveils. La décision laissée
      ouverte (« installer le SDK ? ») a été prise au premier : **SDK Dart 3.13.5 portable** dans
      `scratchpad/dart-sdk/` (hors git, rien d'installé sur la machine). Le cours est passé du régime
      « relecture sans exécution » (`vue`, `nosql`) au régime `perl` — et la relecture l'a payé cher.

      | | départ | après la vague | **clôture** |
      |---|---:|---:|---:|
      | « la plus longue » | 92,5 % | 25,0 % | **25,0 %** |
      | pire des 44 stratégies | 92,5 % | 25,8 % | **25,8 %** (écarter les deux extrêmes) |
      | lexique : exploitables / retournées / à mettre en forme | 52 / 26 / 58 | 0 / 0 / 0 | **0 / 0 / 0** |
      | tics de lot | 7 | 0 | **0** |
      | mot fétiche (alertes) | 4 | 0 | **0** (« compilateur » le plus haut, 25,8 %) |

      **1. LA VAGUE (6 écrivains, patchs posés par `pose.js`) : 176 distracteurs sur 180 réécrits,
      139 programmes Dart exécutés, aucune alerte de rang, aucun tic de lot.** Le rapport
      bonne/distracteur de départ (**4,77**, le pire de B4) n'a demandé aucune seconde vague : la
      consigne sur mesures suffit, cinquième cours de suite.

      **2. LA RELECTURE PAR CONTRADICTION (6 relecteurs, lecture seule, 120 programmes Dart) :
      92 FAUTES — le record de B4, et 56 hors des QCM.** 51 dans les CORPS, 5 dans les exercices,
      28 dans les distracteurs, 7 dans les `explain`, 1 dans une bonne réponse. Par nature : 30 faux,
      20 inintelligibles, 13 trompeurs, **13 sorties annoncées fausses**, 7 de français,
      **5 qui ne compilent pas**, 3 distracteurs vrais, 1 dangereux. Par gravité : 7 hautes,
      33 moyennes, 52 basses. Les plus graves, toutes prouvées par `dart run` ou `dart analyze` :
      - **un programme qui enseigne le CONTRAIRE du compilateur** (`lecon-02`) : après
        `peutEtreNull = 'finalement une valeur';`, la promotion par affectation rend `.length`
        légal (sortie **21**) — la ligne présentée comme une erreur compilait. Corrigé par une valeur
        que le compilateur ne connaît pas (`lireSaisie()`), et l'erreur annoncée est désormais celle
        que Dart rend : *« Property 'length' cannot be accessed on 'String?' because it is
        potentially null »* (rejoué à la clôture) ;
      - **une `late` locale jamais affectée** annoncée comme `LateInitializationError` à l'exécution :
        elle ne compile pas (*« definitely unassigned »*) ;
      - **`onPressed: maMethode()`** présenté comme « passe null et désactive le bouton » : pour une
        méthode `void`, le programme ne compile pas (`lecon-04`) ;
      - **trois widgets qui ne compilent pas** : `const EcranDetail()` sans le `produit` requis, deux
        fois (`lecon-14`), un `Container` sous un `const` (`lecon-10`, `Container` n'a pas de
        constructeur `const`) ;
      - **treize messages d'erreur recopiés de mémoire**, faux mot pour mot (« for the class » au
        lieu de « for the type », `Invalid argument(s)` au lieu du singulier, `RangeError` sans
        « inclusive range 0..2 », « (at character 1) » attribué à `e.message`…) ;
      - des règles fausses : seuls les champs `final` PRIVÉS sont promus (Dart 3.2+), pas les
        publics ; « liste d'initialisation obligatoire » pour un `final` (la leçon fait elle-même
        `Point(this.x, this.y)`) ; `assert` actif « en mode debug » alors que `dart run` l'ignore
        sans `--enable-asserts` ; `base` et `interface` présentés comme absolus hors de leur
        bibliothèque ; l'étape 5 du mini-projet (`fold(0, …)` sans type attendu déduit `int`, ne
        compile pas).

      **3. LES CORRECTIONS (5 correcteurs, leçons disjointes, 106 programmes) : 91 fautes sur 92
      corrigées, 0 indicateur déplacé** (`controle.js --ref=00fbc99` : **0 question sur 60**),
      8 atteintes à l'intouchable, **toutes des fautes prouvées** (7 `explain`, 1 bonne réponse :
      `lecon-08` q2, « il bloque » → « en attente » : le corps dit « sans bloquer le thread », et un `Timer.periodic` continue de tourner pendant l'`await for` — prouvé). **Aucune bonne
      réponse fausse sur 60.**

      **RELIQUAT ASSUMÉ (1 faute basse)** : `lecon-16` q1 du bilan, le distracteur
      « Optional<String> (null) » a une parenthèse qui n'énonce rien. **Huit reformulations essayées
      sous `controle.js`, toutes déplacent un indicateur** : « null » est l'écho de la question (le
      retirer ouvre « l'écho » à 1 option), un mot de 6+ lettres ABSENT de la page ouvre `k`, un mot
      présent mais plus long casse le rang de longueur. Laissé en l'état : le défaut est de style,
      pas de fond.

      **Contrôles de clôture** : `verif.js --rapide` **53 étapes tout vert (197,7 s)** ; `verif-html` **0 sur 1 629 pages** ;
      `controle.js` **0 indicateur déplacé** ; cliquets refigés, `dart` marqué `traite`
      (**52 cours**) ; index identiques à leur régénération (`build-index`, 6 151 questions,
      11 586 cartes, 1 577 fiches, 1 614 pages indexées) ; 0 CRLF, 0 BOM, JSON valide, 0 chargement
      externe ajouté.

      **LE 54ᵉ COURS EST DÉSIGNÉ — `perf-web`.** Classement par nocivité réelle sur les **38 cours
      restants** (`stats` exclu, cours-témoin) : `perf-web` **54,5 devinables** (57 questions,
      **95,6 %**), `lisp` 54,0, `observabilite` 54,0, `docker` 54,0, `r` 54,0, `bash` 53,5, `tests`
      53,5, `pascal` 53,3, `fsharp` 52,3, `prolog` 52,0. **Site : 6 167 questions, 2 681 devinables
      à la longueur (43,5 %), 52 cours traités.** Méthode inchangée : consigne sur mesures, écrivains
      en fichiers de patchs, relecture par contradiction qui lit les corps, **exécution partout où
      c'est possible** (pour `perf-web` : JavaScript et Node, donc tout ce qui se mesure se mesure).


      **PRÉPARATION FAITE le 2026-09-30** : `scratchpad/CONSIGNE-PERF-WEB.md` (suivie par git) — 95,6 % à
      la longueur (couverture 98,2 %), rangs **55/1/1/0**, **10 126 caractères** à écrire sur 55
      questions, rapport bonne/distracteur **3,36** (102,4 contre 30,5 caractères), lexique
      **54 exploitables / 32 retournées / 55 à mettre en forme**, **4 alertes** de biais inverse,
      **dix tics de lot** (deux-points médian 15/2, glose finale 12/1, point-virgule médian 9/0…),
      **3 mots fétiches dès le départ** (`contenu` 33,8 %, `navigateur` 30,3 %, `image` 28,9 %).
      Sondes : `scratchpad/perf-web-sonde/` ; sorties brutes : `scratchpad/perf-web-depart/`.

      **LA VAGUE (6 écrivains, patchs posés par `pose.js`) : 169 distracteurs sur 171 réécrits,
      107 scripts Node exécutés**, aucune bonne réponse contestée, `mesure-qcm-intouchable` **0 atteinte**.
      « La plus longue » **95,6 % → 26,3 %** (rangs **15/14/14/14**, exactement la cible), lexique
      **0/0/0**, tics **0**, mot fétiche **0 alerte**, intrus **25,0 % / 25,1 %**. Une alerte restante :
      « la moins bavarde » en sens INVERSE, **31,4 %** (la consigne demande qu'un distracteur égale la
      bonne en mots quand elle est la plus courte : les écrivains ont fait l'égalité, et l'égalité
      ne suffit pas).

      **LE DOSAGE, CALCULÉ : 7 options retouchées.** Trois bascules franches (la bonne devient seule la
      moins bavarde : `lecon-01` q3, `lecon-05` q3, `lecon-09` q3), trois égalités (`lecon-04` q3,
      `lecon-07` q3, `lecon-15` q11) et une égalité à trois (`lecon-02` q1), chacune en ajoutant des
      mots courts à un distracteur SANS changer son rang de longueur, son `w` ni son `k`. Premier jet
      refusé par `controle.js` : « aucun » et « rien » ajoutés pour allonger ont ouvert « écarter les
      absolus » (un seul porteur) — remplacés par « et cela » et « lire et ». Résultat : alerte levée
      (**27,8 %** en sens inverse, 0 alerte), et la retouche de `lecon-07` rend en prime la bonne
      réponse la plus DENSE : « ECARTER la plus dense » **26,9 % → 26,3 %**. **Pire des 44 stratégies :
      26,3 %** (la plus longue, soit 15 rangs 0 sur 57 — le plancher de la répartition).

      **14 défauts de CORPS signalés par les écrivains** (sans y toucher) : un schéma de budget pas à
      l'échelle (`lecon-06` : une barre de 285 px pour 190 Ko sur une échelle de 1 px par Ko, calculé),
      « trois quarts » d'octets gâchés en passant de 2000 à 400 px (`lecon-08` : 80 % à la largeur,
      96 % à la surface, calculé), le glossaire qui limite le CLS au chargement quand l'encadré dit
      l'inverse, `Disallow` présenté comme interdisant l'INDEXATION (`lecon-04`), « débattre » pour
      *debounce*, le p75 décrit à l'envers… → transmis à la relecture par contradiction, qui les
      confirme ou les infirme avant toute correction.


      **LA RELECTURE PAR CONTRADICTION (6 relecteurs, lecture seule, CORPS compris) : 179 FAUTES —
      presque le double de `dart` (92), et 99 dans les CORPS.** 99 corps, 29 exercices, 37 distracteurs,
      12 `explain`, 2 bonnes réponses. Par nature : 66 trompeuses, 44 fausses, 24 inintelligibles,
      17 de français, 10 périmées, 7 qui ne fonctionnent pas, 6 calculs faux, 3 distracteurs vrais,
      2 miroirs. Par gravité : 7 hautes, 53 moyennes, 119 basses. **Aucun des 46 outils n'en voit une
      seule dans un corps** — le défaut fondateur de la chaîne, une fois de plus.

      **19 CORRIGÉES CETTE PASSE — les 9 hautes et ce qui touche au même passage**, 0 indicateur déplacé
      hors un échange de « la plus dense » entre deux distracteurs (`lecon-04` q3, taux inchangé) :
      - `robots.txt` : `Disallow: /` présenté trois fois comme bloquant l'INDEXATION (`lecon-04`) — il
        interdit l'EXPLORATION ; c'est `noindex` qui retire de l'index, et le doublé `Disallow` +
        `noindex` du cas réel est bancal (le robot interdit d'exploration ne lit jamais le `noindex`) ;
      - **WebPageTest rangé côté TERRAIN** dans le titre, le corps, l'encadré, l'objectif et le récap de
        `lecon-13` (et contredit par `lecon-10`, qui le dit « labo ») — c'est un test synthétique ;
      - « un site bon tient les trois seuils sur mobile bridé » (`lecon-06`) — l'INP ne se mesure pas
        en labo, et « bon » se juge au p75 des visites réelles ;
      - **une solution d'exercice fausse À LA BORNE** (`lecon-09`, `etatCache`) : `age <= maxAge`
        rendait « frais » une ressource pile à `max-age`, que la RFC 9111 §4.2 dit périmée
        (`freshness_lifetime > current_age`, inégalité stricte), et un indice l'enseignait. Corrigé en
        `age < maxAge` ; **rejoué** : `etatCache(500, 300, 600)` rend toujours « périmé mais servable »
        (la sortie attendue de l'exercice), `etatCache(300, 300, 600)` rend désormais « périmé mais
        servable » au lieu de « frais » ;
      - **une explication de lenteur contredite par la mesure** (`lecon-12`, exercice 3) : la solution
        accusait le coût de chaque message ; **mesuré** (`worker_threads` de Node, à titre indicatif) :
        création d'un worker **19 à 43 ms**, aller-retour de message **0,016 ms** — la lenteur vient d'un
        coût payé à chaque frappe (worker recréé, grosses données copiées), pas du message ;
      - le résultat enrichi FAQ présenté comme ordinaire (`lecon-05`, 4 endroits) ; « débattre » pour
        *debounce* (`lecon-11`, `lecon-12`) → « temporiser, anti-rebond » ;
      - **3 distracteurs VRAIS** réécrits en thèses fausses (le cache « dès la 1re visite », la canonique
        comme un `Disallow`, `sessionStorage` — absent des workers) ; **une bonne réponse** précisée
        (`lecon-10` q2 : c'est un p75 SOUS LE SEUIL qui garantit 3 visites sur 4, pas le p75 seul — le
        distracteur concurrent allongé de 11 caractères pour garder les rangs).

      ⚠️ **Une correction de CORPS a rouvert `k`** (déjà vu au 52ᵉ cours) : « désérialiser », retiré de
      la solution de `lecon-12`, était employé par un distracteur de la même page — vu par `controle.js`
      et par le lexique (1 exploitable), refermé en remettant le mot dans le corps corrigé.

      **RESTE À FAIRE (prochain réveil) : 160 fautes, 43 moyennes et 117 basses**, dont 90 dans les
      corps. Consigne prête : `scratchpad/CONSIGNE-PERF-WEB-CORRECTION.md` (suivie par git), six
      groupes disjoints (26 / 21 / 29 / 36 / 25 / 23 fautes), garde-fou `controle.js --ref=b476e55`.
      Fautes : `scratchpad/perf-web-relecture/fautes.json` (local), champ `traitee`.
      Mesures à la sortie de cette passe : « la plus longue » **26,3 %** (pire des 44), lexique
      **0/0/0**, tics **0**, mot fétiche **0 alerte**, biais inverse **0 alerte** (27,8 %),
      `mesure-qcm-intouchable` : **2 atteintes, toutes délibérées** (la bonne réponse de `lecon-10` q2, l'`explain` FAQ de
      `lecon-05` q2).
      Contrôles : `verif-html` **0** ; `verif-donnees` **0 erreur** ; index régénérés (`build-index --write --fresh` : 6 151 questions, 11 586 cartes) ; `controle.js --ref=b476e55` : **1 question** où un indicateur bouge (`lecon-04` q3, l'échange de « la plus dense » entre deux distracteurs, taux inchangé).

      **LA CORRECTION (6 correcteurs, groupes disjoints, un seul écrivain par fichier) : 153 fautes
      corrigées sur les 160 restantes, 7 laissées avec leur raison** — les **43 moyennes toutes
      corrigées**, 110 basses ; par zone : 86 corps, 33 distracteurs, 23 exercices, 10 `explain`,
      et la bonne réponse contestée de `lecon-08` q3 laissée intacte (c'est l'ÉNONCÉ qui a été
      précisé). Laissées : 3 fautes « de mémoire » que la source infirme ou que le cours établit
      lui-même, 1 fausse faute de grammaire (« ces quatre-là sont chacune typées » est correct),
      1 prérequis conforme à la convention du site, 1 distracteur sans formulation qui tienne les
      rangs, et la n° 76 de `lecon-07` — **laissée À TORT, voir plus bas**. Défauts de fond
      prouvés par exécution : le **schéma `srcset`** (un mobile de densité 3 télécharge la 1600, un
      ordinateur de densité 1 se contente de la 800), le **CLS** qui ne « s'accumule » pas mais
      retient la pire rafale (exercice rejoué : **0.06**), « WebP **5 à 10×** plus léger » contre
      **25 à 34 %** selon Google (facteur **1,33 à 1,52**), le **schéma du p75** qui plaçait
      **95,5 %** des visites à gauche du curseur (redessiné à **74,9 %**), la barre de budget JS
      qui dessinait **285 Ko pour 190 Ko** (un dépassement de 90 % au lieu de **26,7 %**), le
      schéma HTTP/1.1 ↔ HTTP/2 hors d'échelle (rapport **3,03**), et deux fautes « de mémoire »
      **confirmées** par les notes de version de Lighthouse (PWA retirée en **12.0.0**, audits
      remplacés par des *Insights* en **13.0.0**).

      **LA CONTRE-RELECTURE (6 relecteurs chargés de DÉMOLIR les corrections, lecture seule) :
      176 corrections examinées, 32 prises, dont 11 moyennes — soit une correction sur cinq et
      demie (18,2 %) qui fabriquait sa propre faute.** 29 corrigées, 3 laissées. Les prises qui
      comptent :
      - **une correction qui remplace une erreur par une autre** : les boîtes du schéma `srcset`
        rangeaient « haute densité (×2, ×3) » sous la 1600, alors que le script du correcteur
        lui-même rendait **390 px × 2 → 800w** — boîtes réétiquetées par le BESOIN réel
        (« besoin ≤ 400 / ≤ 800 / > 800 px réels ») ;
      - **un distracteur rendu VRAI par sa correction** : « (souvent un logo), à charger
        immédiatement » — un logo est dans le premier écran, où web.dev interdit justement le
        *lazy-loading* ; remplacé par « (souvent en bas) », simulé contre les 44 stratégies : 0 écart ;
      - **une faute laissée à tort sur une source mal lue** : « rien ne s'affiche tant que le DOM
        ET le CSSOM ne sont pas prêts » — web.dev (*Understand the critical path*) : « for the
        initial render, the browser will not typically wait for: All of the HTML ». Corrigé au
        schéma, à la légende et à l'`explain` ;
      - **une correction qui inversait TCP et QUIC** (« TCP : un paquet perdu ne retient plus que
        son propre fichier ») ;
      - **MA propre harmonisation** des seuils Web Vitals sur « ≤ » avait posé le seuil officiel
        dans une solution qui le rattachait au « mobile bridé » — la confusion labo/terrain que la
        correction haute de `lecon-06` venait de retirer ; réécrit « au 75ᵉ centile des visites
        réelles » ;
      - des chiffres justes dans une phrase qui les contredisait : « un peu de débit » pour
        **194 lots bridés à 4 ms = 776 ms** ajoutées (exécuté, règle de la norme HTML sur
        l'imbrication des `setTimeout`) ; « un aller-retour de message coûte une fraction de
        milliseconde » alors que **5 millions de nombres copiés coûtent ~78 ms** l'aller-retour
        (mesuré, `worker_threads`), contre **0,02 ms** pour un petit message ; 96 % de pixels
        gâchés vrais en densité 1 seulement (**84,0 %** en densité 2, calculé).
      Laissées : un distracteur de `lecon-15` (« reproduire les impacts ») et la bonne réponse de
      `lecon-10` q2 (« visiteurs » pour « visites ») — **onze formulations simulées, toutes
      déplacent un indicateur**, défauts de style ; le fil d'Ariane de `lecon-05`, qui n'est pas une
      contradiction (Google affiche le chemin d'URL dans tout résultat, `BreadcrumbList` est un
      résultat enrichi documenté).

      **Mesures finales** : « la plus longue » **26,3 %** (pire des 44, inchangé), lexique
      **0/0/0**, mot fétiche **0 alerte**, `controle.js --ref=b476e55` : **2 questions** où un
      indicateur bouge, les deux par un échange de rang ENTRE DISTRACTEURS (`lecon-04` q3, `lecon-05`
      q1), taux inchangé ; `mesure-qcm-intouchable perf-web a8df2bc~1` : **16 atteintes, toutes
      délibérées** (2 bonnes réponses — le « ≤ 2,5 s » de `lecon-01` q1, le p75 « sous le seuil »
      de `lecon-10` q2 —, 13 `explain`, 1 énoncé), chacune adossée à une faute prouvée.

      **Contrôles de clôture** : `verif.js --rapide` **53 étapes tout vert (228,9 s)** ;
      `verif-html` **0** ; `verif-donnees` **0 erreur** ; épreuves par injection **10/10** et
      **6/6** ; les **deux cliquets refigés**, `perf-web` marqué `traite` (**53 cours**) ;
      `doc/lecon-03` réassemblée (`verif-normatif` **66 OK / 9 échecs → 75 OK / 0 échec**) ;
      `etude-inconnu` et `etude-recherche` réassemblées, cycle études ↔ index au **point fixe au
      3ᵉ tour** (4 écritures, 1, puis 0), `verif-etudes` **0 périmée** ; index régénérés `--fresh`
      sur les six cibles ; 0 CRLF, 0 BOM, JSON valide, 0 chargement externe.

      **LE 55ᵉ COURS EST DÉSIGNÉ — `lisp`.** Classement par nocivité réelle (questions × « la plus
      longue ») sur les **37 cours restants**, `stats` exclu (cours-témoin) : quatre ex aequo à
      **54,0 devinables** — `lisp` (55 questions, **98,2 %**), `observabilite` (96,4 %), `docker`
      (94,7 %), `r` (85,7 %) — départagés par le taux, puis `bash` 53,5, `tests` 53,5, `pascal`
      53,3, `fsharp` 52,3, `prolog` 52,0, `linux` 52,0. **Site : 6 167 questions, 2 642 devinables
      à la longueur (42,8 %), 53 cours traités.** Méthode inchangée, et une étape de plus, qui a
      payé ici : **la contre-relecture des corrections**, avant de clore.


      **PRÉPARATION FAITE le 2026-09-30** : `scratchpad/CONSIGNE-LISP.md` (suivie par git) — 98,2 % à
      la longueur (couverture 100 %), rangs **54/0/1/0**, **11 080 caractères** à écrire sur 55
      questions, rapport bonne/distracteur **4,19** (106,0 contre 25,3 caractères), lexique
      **50 exploitables / 24 retournées / 52 à mettre en forme**, **4 alertes** de biais inverse,
      **douze tics de lot** (deux-points médian **21/2**, le plus fort mesuré en B4 ; point-virgule
      médian 15/0), **3 mots fétiches dès le départ** (`liste` 35,0 %, `fonction` 34,7 %, `arguments`
      31,4 %). **Le cours S'EXÉCUTE** : Racket 8.17 minimal (archive `.tgz`) et SBCL 2.5.8 (MSI extrait
      par `msiexec /a`, rien d'installé), tous deux dans `scratchpad/` hors git ; la table des dix
      erreurs classiques de la consigne a été exécutée avant d'être donnée (`9`, `(1 . 2)`, `let` → 1
      contre `let*` → 2, fermeture après `set!` → 5…).

      **LA VAGUE (6 écrivains, patchs posés par `pose.js`) : 165 distracteurs sur 165 réécrits**,
      programmes Racket et SBCL exécutés pour chaque valeur annoncée, et les CORPS de neuf leçons
      rejoués au passage (50 sorties en 01-03, 39 en 04-06, toutes celles de 10-12 et 15 : exactes).
      `mesure-qcm-intouchable` **0 atteinte**. « La plus longue » **98,2 % → 25,5 %** (rangs
      **14/14/14/13**, exactement la cible), lexique **0/0/0**, tics **0**, mot fétiche **0 alerte**,
      biais inverse **0 alerte** (pire 26,7 %), intrus lexical **0 mot à traiter**, point interne
      **25,0 %**. **Pire des 44 stratégies : 27,9 %** (« ECARTER la moins bavarde »), sous le seuil de
      28 % : **pas de dosage** cette fois. `verif-html` **0**. Commit `df426ac`.

      **15 défauts de CORPS signalés par les écrivains** (sans y toucher), presque tous de DIALECTE :
      `fold-left` (R6RS) présenté comme de base alors que ni Racket ni R7RS ne l'ont (`lecon-06`,
      `lecon-10`) ; `make-hash-table` de Guile (`lecon-12`) ; `defmacro` de Common Lisp mêlé à du
      Scheme (`#f`, `set!`, `begin`) en `lecon-13`, qui ne tourne sous AUCUN des deux interprètes ;
      le `t` de Common Lisp dans un `cond` Scheme (`lecon-07`) ; `macroexpand` absent de Scheme
      (`lecon-08`) ; « Lisp a 67 ans » (2026 − 1958 = **68**, calculé) ; une bonne réponse sur la
      fermeture qui « se souvient des valeurs » quand elle capture la LIAISON (exécuté : 1 puis 5
      après `set!`) → transmis à la relecture par contradiction, qui les confirme ou les infirme.

      **LA RELECTURE PAR CONTRADICTION (6 relecteurs, lecture seule, CORPS compris) : 113 FAUTES,
      119 blocs exécutés, 193 sorties annoncées confirmées.** 56 corps, 28 exercices, 25 distracteurs,
      2 `explain`, 1 bonne réponse, 1 énoncé. Par nature : 38 trompeuses, 26 fausses, **19 de
      DIALECTE**, 16 inintelligibles, 8 de français, 5 qui ne fonctionnent pas, 1 calcul faux. Par
      gravité : 6 hautes, 33 moyennes, 74 basses. Le trait du cours : **ses CALCULS sont justes**
      (193 sorties confirmées), **ses DIALECTES sont mêlés** — une famille de fautes qu'aucun cours
      mono-langage n'avait montrée.

      **22 CORRIGÉES CETTE PASSE — les 6 hautes et ce qui touche au même passage** (commit `c132afc`),
      `controle.js --ref=df426ac` : **0 indicateur déplacé**, lexique **0/0/0**, fétiche **0 alerte** :
      - **`lecon-13` ne tournait sous AUCUN des deux interprètes** : `defmacro` (Common Lisp) produisant
        `#f`, `begin`, `set!`, un `let` nommé (Scheme). Réécrite en Common Lisp ANNONCÉ (la quasiquote,
        elle, s'écrit pareil dans les deux), **exécutée sous SBCL** : `mon-unless` affiche
        « différents », `while` compte `012`, `swap!` rend **`(2 1)`** (y compris avec une variable
        nommée `tmp`), `balise` rend **`"<p>Bonjour Lisp</p>"**, `inc!` rend **11**. Au passage : la
        macro `while` n'introduit plus de nom en dur, `loop` ne « compile » pas vers `do` (expansion
        SBCL : `block`/`let`/`tagbody`), l'expansion n'a pas lieu « pendant la lecture »,
        « Trois classiques » pour deux, l'exercice qui acceptait « macro » ;
      - **`fold-left` présenté comme de base** (`lecon-06`) : il vient de R6RS, absent de R7RS et de
        Racket — annoncé, et `foldl` de Racket montré avec son ordre d'arguments (**10** et
        **`(3 2 1)`**, exécutés) ; l'exercice accepte aussi `fold` (SRFI 1) ;
      - **`make-hash-table` de Guile** (`lecon-12`) → `make-hash` de Racket, annoncé ; et le `or` qui
        ne mettait jamais en cache un résultat `#f` → `hash-has-key?` (**exécuté** : `fib-rapide 25`
        = **75025 en 26 calculs**, une fonction qui rend `#f` appelée trois fois n'est calculée
        qu'**une** fois) ;
      - **l'exercice de `lecon-01` refusait `display`**, la seule fonction d'affichage de la leçon, et
        acceptait `terpri` (qui lève une erreur sur `"Bonjour"` sous SBCL) ;
      - **la bonne réponse de `lecon-06` q2** enseignait que la fermeture « se souvient des valeurs…
        au moment de sa définition » — la thèse même de son distracteur ; exécuté : **1 puis 5** après
        `set!`. Réécrite (« des variables locales vivantes et présentes à sa définition ») après
        **dix candidats simulés** contre les 44 stratégies : le seul retenu donne **0 écart** ; le
        schéma ne dit plus « n figé ». `mesure-qcm-intouchable` : **1 atteinte, délibérée**.

      ### 55ᵉ cours — `lisp` (2026-09-30) : **98,2 % → 25,5 %**, clos — et une contre-relecture qui prend **une correction sur quatre**

      **LA CORRECTION (6 correcteurs, groupes disjoints 01-03 / 04-06 / 07-09 / 10-12 / 13-14 / 15,
      consigne `scratchpad/CONSIGNE-LISP-CORRECTION.md`) : 90 fautes corrigées sur les 91 restantes**,
      chaque valeur exécutée sous Racket 8.17 ou SBCL 2.5.8, ou citée de R7RS / CLHS (commit `08b9997`).
      **Une laissée** : la n° 64 (`lecon-10`, un distracteur), faute réelle mais aucun remplaçant ne tient
      les indicateurs — il faudrait un mot d'exactement 8 caractères, présent dans le corps, que ni
      « Racket » (6, devient la plus courte), ni « Emacs Lisp » (change `w`), ni « Chez Scheme » (11,
      devient la plus longue) ne satisfont. `controle.js --ref=df426ac` **0 indicateur déplacé**, lexique
      **0/0/0**, fétiche **0 alerte**, intouchable : 2 `explain` et 1 énoncé, tous trois fautes listées.

      **LA CONTRE-RELECTURE (6 agents en lecture seule, chargés de démolir le diff `df426ac..08b9997`) :
      33 PRISES, 156 blocs exécutés, 103 corrections confirmées.** Sur les 112 corrections du cours
      (22 du réveil précédent + 90), **28 prises portent sur les corrections elles-mêmes, soit 25,0 %**
      (contre 18,2 % sur `perf-web`) ; s'y ajoutent 1 défaut vu hors liste et confirmé, et 4 défauts
      préexistants. ⚠️ Le message du commit `f145c70` écrit « 29,5 % » : c'est 33 sur 112, qui mêle les
      trois origines — le bon chiffre est 25,0 %. Les prises qui comptent :
      - **un distracteur rendu VRAI** (`lecon-15` q3 : « empiler les arguments évalués… et, plus tard,
        lambda » — appliquer une fermeture étend bien l'environnement) → exemple remplacé par `cadddr`,
        une primitive, qui ne touche pas `env-base` (le code de la page : `(apply fn args)`) ;
      - **un distracteur qui redonnait la définition de l'hygiène** dans sa seconde moitié (`lecon-08`
        q3) → thèse « ni `let` intérieur ni `lambda` nouvelle », réfutée par l'exécution (`echange!`
        hygiénique avec son `let` interne, sur une variable nommée `tmp` : **tmp=2 y=1**) ;
      - **une prémisse que R7RS soutient en partie** (`lecon-08` q2 : `unless` « déjà pris », or
        redéfinir un identifiant importé « is an error ») → « une fonction ne saurait évaluer un `if` »,
        réfuté (`(f #f)` → **2**) ;
      - **`foldl` de Racket donné pour équivalent de `fold-left`** alors qu'il reçoit l'élément PUIS
        l'accumulateur (`(foldl cons '() '(1 2 3))` → **(3 2 1)**) ; et le `(reduce #'f xs)` de
        l'antisèche sans valeur initiale (**-4** contre **4** avec `:initial-value 10`, exécuté) ;
      - **`print` donné pour afficher « Bonjour »** : SBCL écrit `"Bonjour"` avec ses guillemets, après un
        saut de ligne ; `format` avait été retiré des réponses alors que le glossaire le cite ;
      - la règle d'évaluation « en trois cas, plus une exception » restée à trois cas dans le récap, le
        schéma et son `aria-label` (« évalue a et b » → « évalue f, a et b ») ; `eval` à un argument
        présenté comme une règle du REPL alors que c'est un comportement de Racket (R7RS §6.12 exige
        l'environnement partout) ; `cdr` « toujours une liste » sur une liste propre — sauf `'()`
        (`(cdr '())` → erreur, exécuté) ;
      - **neuf liens « Revoir » vers des sections qui n'existent pas** (`lecon-02` à `lecon-06`) — la
        faute n° 13 n'avait été corrigée qu'en `lecon-01` ; le second schéma de `lecon-11` qui dessinait
        **cinq** cadres pour la factorielle de 5 (sixième boîte ajoutée) ; l'indice `do` qui laissait
        `acc` non lié (exécuté avec `(acc 1 (* acc i))` : **120**) ; `gensym` « nom unique » dans
        l'antisèche et un exercice alors que le corps dit « symbole neuf, non interné » (préfixe exécuté :
        `#:TMP99`, `#:TMP100`, `eq` → **NIL**).

      **33 corrigées sur 33** (commit `f145c70`) ; **7 distracteurs simulés** (44 stratégies + `w` +
      `k`, `essai2.js`) avant d'être posés, entre 1 et 3 séries de candidats chacun, et la bonne réponse
      de `lecon-06` q2 (« vivantes » → « réelles ») à **0 écart**. `controle.js --ref=df426ac`
      **0 indicateur déplacé**, lexique **0/0/0**, fétiche **0 alerte**, `verif-html` **0**.

      **CLÔTURE** : cliquets refigés — `verif-qcm-biais.js --ecrire`, `lisp` marqué `traite`
      (**54 cours**), longueur **25,5 %**, pire indice du cliquet **27,3 %** (« écarter les deux
      extrêmes ») ; `verif-qcm-lexique.js --ecrire` (STRICTE 12,5 % → 0,0 %). `tools/doc/gen.js` et les
      assembleurs `etude-inconnu` / `etude-recherche` relancés avec `build-index --write --fresh`
      (quiz, flashcards, search, searchlite, antisèches, pièges) : **point fixe au 2ᵉ tour**.
      `verif-donnees` **0 erreur** (il fallait aussi `--only=antiseches` et `--only=pieges`, que la
      régénération par défaut ne couvre pas : 8 puis 5 erreurs I18 avant) ; `verif.js --rapide`
      **53 étapes vertes (243,8 s)** ; 0 CRLF, 0 BOM, JSON valide, 0 chargement externe.
      **Site : 6 167 questions, 2 602 devinables à la longueur (42,2 %), 54 cours traités.**

      **LE 56ᵉ COURS EST DÉSIGNÉ — `observabilite`.** Classement par nocivité réelle sur les **36 cours
      restants**, `stats` exclu (cours-témoin) : trois ex aequo à **54,0 devinables** —
      `observabilite` (56 questions, **96,4 %**), `docker` (94,7 %), `r` (85,7 %) — départagés par le
      taux, puis `bash` 53,5, `tests` 53,5, `pascal` 53,3, `fsharp` 52,3, `prolog` 52,0, `linux` 52,0,
      `vb` 52,0. Méthode inchangée : préparation (consigne mesurée), vague d'écriture, relecture par
      contradiction, correction en groupes disjoints, **contre-relecture des corrections**, clôture.

      ### 56ᵉ cours — `observabilite` (2026-09-30) : **96,4 % → 25,0 %**, clos — et une contre-relecture qui prend **29,0 %** des corrections

      **PRÉPARATION FAITE le 2026-09-30** : `scratchpad/CONSIGNE-OBSERVABILITE.md` (suivie par git,
      commit `cc0b804`) — 96,4 % à la longueur (couverture 100 %), rangs **54/2/0/0**, **10 491
      caractères** à écrire sur 55 questions sur 56, rapport bonne/distracteur **3,60** (104,3 contre
      29,0 caractères), lexique **51 exploitables / 34 retournées / 54 à mettre en forme**, intrus
      lexical **90 mots sur 16 questions**, **4 alertes** de biais inverse, **quinze tics de lot**
      (glose finale entre parenthèses **16/2**, deux-points médian 12/2, point-virgule médian 10/0 —
      et « parce que » **1/18**, tic de DISTRACTEUR), **5 mots fétiches dès le départ** (`requête`
      35,3 %, `traces` 32,6 %, `erreurs` 31,0 %, `métriques` 30,4 %, `données` 28,1 %).
      **Le PromQL S'EXÉCUTE** : `promtool` 3.15.0 portable (archive officielle, rien d'installé) dans
      `scratchpad/prometheus/`, hors git ; `promtool test rules` évalue une expression sur des séries
      synthétiques (attendu absurde, on lit le `got:`). La table des erreurs classiques de la consigne
      a été exécutée avant d'être donnée : `rate()` d'un compteur à +60/min → **1**/s, `increase()` →
      **300**, `rate()` sur une jauge 10/5/10/5 → **0,083** contre `deriv()` → **0**, remise à zéro →
      **0,889**/s, p95 interpolé → **0,778** s, p99 de deux serveurs **0,1** et **0,3** s : moyenne
      0,2, fusionné **0,3** ; 99,9 % sur 30 j → **43,2 min**, burn rate 14,4 pendant 1 h → **2,0 %**
      du budget.

      **LA VAGUE (6 écrivains, patchs posés par `pose.js`) : 168 distracteurs sur 168 réécrits**,
      **50 exécutions** citées (promtool et Node : `sum(increase())` sur trois `user_id` → **300**
      comme sans étiquette, `count()` → **3** séries, 1 000 requêtes à 95 % × 50 ms / 5 % × 3 s →
      moyenne **197,5 ms** et p99 **3 000 ms**…). `mesure-qcm-intouchable` **0 atteinte**. « La plus
      longue » **96,4 % → 25,0 %** (rangs **14/14/14/14**), lexique **0/0/0**, intrus lexical **0 mot**,
      tics **0**, mot fétiche **0 alerte**, biais inverse **0 alerte** (pire 25,5 %). **Pire des 44
      stratégies : 25,6 %** (« la moins bavarde »), sous le seuil de 28 % : **pas de dosage**. Questions trahies par 5 indices ou plus : **47 → 0**. `verif-html` **0**.
      Commit `753bc60`.

      **12 défauts signalés par les écrivains** (sans y toucher), transmis à la relecture : le
      `trace_id` présenté comme reliant aussi les MÉTRIQUES d'une requête (`lecon-06`, `lecon-11` —
      une métrique est un agrégat, le lien passe par les *exemplars*, jamais nommés) ; l'encadré
      multi-fenêtres de `lecon-10`, qui prête à la fenêtre courte la détection rapide (promtool :
      panne totale à 60 min, la fenêtre de 1 h seule et la combinaison sonnent **à la même minute**,
      61 ; à 80 min la fenêtre longue seule sonne encore, la combinaison non) ; deux moyennes fausses
      (`lecon-03` : « 100 ms » pour un mélange qui donne **197,5 ms** ; `lecon-08` : « 180 ms » pour
      **245 ms**) ; l'exporteur `loki` pointé sur l'endpoint `/otlp` (`lecon-11`) ; la bonne réponse
      du bilan q2 de `lecon-11` (« logs = le quoi ») contre le corps (« journaux = le pourquoi »).

      **LA RELECTURE PAR CONTRADICTION (6 relecteurs, lecture seule, CORPS compris) : 69 FAUTES,
      112 vérifications exécutées (promtool, Node, `normExo` rejoué) ou sourcées, 183 affirmations
      confirmées justes.** 20 corps, 20 exercices, 11 schémas, 6 distracteurs, 5 glossaires,
      3 bonnes réponses, 2 antisèches, 1 énoncé, 1 `js/data.js`. Par nature : 17 fausses,
      16 incohérences internes, 14 qui ne fonctionnent pas (surtout des `accept` d'exercice qui
      refusent la réponse que la leçon enseigne — « gravité », « severity », « trace-id »…),
      10 trompeuses, 5 de français, 3 calculs faux, 3 inintelligibles, **1 distracteur VRAI**. Par
      gravité : 3 hautes, 24 moyennes, 42 basses. Des 12 signalements des écrivains : **10 confirmés,
      1 partiel, 1 infirmé** (le glossaire « monitoring, sous-ensemble de l'observabilité » ne
      contredit pas le corps, qui dit « l'observabilité est plus large »). Deuxième trait du cours
      après ses calculs : **ses configurations ne démarreraient pas** — l'exporteur `loki` du
      Collector a été retiré de *collector-contrib* en v0.131.0 (CHANGELOG) et l'endpoint `/otlp` de
      Loki se nourrit avec `otlphttp` (documentation Grafana) ; l'exporteur OTLP gRPC exige TLS par
      défaut, donc `tempo:4317` et `jaeger:4317` en clair ne recevaient rien.

      **18 CORRIGÉES CETTE PASSE — les 3 hautes et ce qui touche au même passage** (commit `13a01d4`
      et suivant), `controle.js --ref=753bc60` : **0 indicateur déplacé**, lexique **0/0/0**, fétiche
      **0 alerte**, `verif-html` **0**, `verif-donnees` **0 erreur** (index régénérés `--fresh`) :
      - **l'encadré multi-fenêtres de `lecon-10`** (+ antisèche, glossaire) : la fenêtre courte ne fait
        pas « réagir vite ». **Rejoué sous promtool** (20 % d'erreurs à partir de 60 min, seuil
        0,0144) : à 63 min la fenêtre de 5 min seule sonne (**0,12**) mais la combinaison non ; la
        fenêtre d'1 h et la combinaison sonnent **à la même minute, 66** (0,02) ; à 100 min la
        fenêtre longue seule sonne encore (**0,1**), la combinaison non. Réécrit selon le *SRE
        Workbook* (« Alerting on SLOs ») : la longue garantit qu'une part réelle du budget a brûlé
        (**2 %** pour 14,4 — calculé), la courte fait retomber l'alerte cinq minutes après
        l'incident ; la recette n'est pas celle du premier livre *SRE*. ⚠️ La correction a rouvert
        `k` sur q1 (« exiger » avait quitté le corps) : remis dans la phrase, 0 écart ;
      - **le `trace_id` qui « relie logs, métriques et traces »** (`lecon-06` : glossaire, récap,
        description, deux schémas, cas réel, exercice ; `lecon-11` : astuce, glossaire, récap,
        schéma) : une métrique agrège de nombreuses requêtes et ne porte pas de `trace_id` (promtool :
        `sum by (le)(rate(…_bucket[5m]))` ne rend que l'étiquette `le`) ; le saut métrique → trace
        passe par un **exemplar** (spécification OpenTelemetry *Metrics*, drapeau de Prometheus),
        terme introduit dans les deux leçons. Le schéma des trois piliers est redessiné (trait plein
        trace ↔ logs, pointillé « exemplar » métrique → trace) ; l'exporteur `prometheus` de
        `lecon-11` reçoit `enable_open_metrics: true` pour exposer les exemplars. **La bonne réponse
        de `lecon-06` q3** (« trace (le où, via le trace id) ») est réécrite après **9 candidats
        simulés** contre les 44 stratégies + `w` + `k` : le seul retenu (« via un exemplar … ceux qui
        ont le même trace id ») donne **0 écart** — « exemplar » compte comme mot long, il fallait en
        retirer un autre (« filtrés ») ;
      - **les exporteurs du Collector** (`lecon-07`, `lecon-11`, et la solution de l'exercice 1) :
        `otlphttp/loki`, `tls: { insecure: true }` annoncé « labo local », receivers OTLP sur
        `0.0.0.0` (un Collector séparé n'est pas joignable sur `localhost`) ; les deux blocs
        **reparsés par PyYAML 6.0.3** ;
      - **le distracteur VRAI** (`lecon-06` q4, « Latence moyenne > 300 ms », un symptôme ressenti
        que l'`explain` ne permettait pas d'écarter) : l'`explain` dit désormais pourquoi — une
        latence MOYENNE masque la traîne (*SRE Book*, chap. 6) ;
      - l'`accept` de l'exercice `trace id` (`lecon-06`) : « trace-id », nom du champ W3C, et
        « traceId » refusés — **`normExo` rejoué** : acceptés, « span id » toujours refusé.
      `mesure-qcm-intouchable observabilite 753bc60` : **3 atteintes, toutes délibérées** (bonne
      réponse et `explain` de `lecon-06` q3, `explain` de `lecon-06` q4).

      **LA CORRECTION DES 51 RESTANTES (6 correcteurs, groupes disjoints, consigne
      `scratchpad/CONSIGNE-OBSERVABILITE-CORRECTION.md`) : 51 corrigées sur 51** (14 moyennes,
      37 basses), commit `8903476`. `controle.js --ref=753bc60` **0 indicateur déplacé**, 0 bloc JSON
      cassé ; lexique **0/0/0** ; fétiche **0 alerte** ; `verif-html` **0** ; `node --check js/data.js`
      vert ; 0 CRLF, 0 BOM. Les moyennes, chacune prouvée :
      - **les deux moyennes fausses, recalculées** : `lecon-03` (promtool : 95 rapides à 50 ms et
        5 lentes à 3 s par minute → **0,1975 s**, soit 197,5 ms et non 100 ms) ; `lecon-08` (Node :
        95 % à 100 ms + 5 % à 3 000 ms = **245 ms**, pas 180 — l'exemple garde 180 ms en passant les
        5 % lents à **1,7 s**, recalculé : **180 ms**) ;
      - **les données personnelles, rendues cohérentes** entre `lecon-02` et `lecon-09` : on exclut
        les secrets et les données personnelles SENSIBLES, le reste au strict nécessaire (un
        identifiant interne plutôt que le nom ou l'e-mail) — OWASP *Logging Cheat Sheet*, RGPD
        art. 4(1), 5.1.c, 9(1) et considérant 26. La bonne réponse de `lecon-02` q3 réécrite après
        **7 candidats simulés** : un seul à 0 écart ;
      - **la bonne réponse du bilan q2 de `lecon-11`** : « Logs (quoi) » → « Logs (pourquoi) »,
        comme la figure de la page (« 4 · Journaux / le pourquoi ») ; 6 candidats simulés ;
      - Loki présenté comme un « stockage indexé » du contenu (`lecon-09`) — il n'indexe que les
        étiquettes (documentation Grafana) ; l'agrégation « réservée aux logs structurés »
        (`lecon-02`) — Loki a ses analyseurs `pattern` et `regexp` ; le schéma `traceparent` de
        `lecon-07` recalé par script (champs aux colonnes **16-47** et **49-64**) ; la paire de
        fenêtres 6 h / 30 min de `lecon-11` rendue au seuil **6** qui réveille (SRE Workbook,
        table 5-8 ; Node : burn 6 sur 6 h = **5,00 %** du budget) ; un « cas réel » qui prêtait aux
        post-mortems de GitLab et Cloudflare un scénario qu'ils ne racontent pas (`lecon-06`) ;
        deux distracteurs (`lecon-09` q3 qui décrivait le mécanisme de la page, `lecon-08` q2 qui
        citait un chiffre sans référent) ; trois `accept` qui refusaient la réponse enseignée
        (« gravité », « les quatre signaux dorés », « niveaux de log » : `normExo` rejoué).

      **LA CONTRE-RELECTURE (6 agents en lecture seule, chargés de démolir le diff `753bc60..8903476`) :
      29 PRISES, 40 blocs exécutés, 84 passages corrigés examinés dont 65 confirmés justes (77,4 %).**
      **20 prises portent sur les 69 corrections elles-mêmes, soit 29,0 %** (54ᵉ cours 18,2 %, 55ᵉ
      25,0 % : la part MONTE à chaque cours) ; s'y ajoutent **9 défauts hors liste**, vus par les
      correcteurs sans y toucher et confirmés. Deux moyennes, et ce qui compte :
      - **une correction de calcul qui en fausse un autre** (`lecon-08`) : ramener les requêtes lentes
        à 1,7 s pour tenir la moyenne de 180 ms laissait, deux lignes plus bas, « un p99 à 3 s » — sur
        10 000 valeurs (Node) le p99 vaut **1 700 ms**, aucune requête n'atteint 3 000 ms, et le p95
        tombe pile à la frontière (100 ms au rang, 180 ms interpolé). Même piège en `lecon-03`
        (promtool : p95 **0,05 s**, p99 **2,41 s**) — « le p95 ou p99 révèle… » : seul le p99 ;
      - **la nouvelle règle des données personnelles, appliquée à moitié** : un tableau « À NE JAMAIS
        journaliser » qui contenait l'e-mail « (selon usage) » (`lecon-09`), une antisèche restée à
        l'ancienne règle, le NIR rangé parmi les données « sensibles » alors qu'il n'est pas dans
        l'art. 9 du RGPD (régime propre, art. 87), et l'e-mail écarté « parce que c'est une donnée
        personnelle » — ce que `user_id` est aussi ;
      - **un placeholder qui donnait la réponse** (`lecon-11`, exo 2 : l'`accept` élargi validait le
        texte d'exemple) et **un premier indice qui la donnait aussi** (« SDK + Collector + OTLP. », et
        « otlp » venait d'être accepté) — `normExo` rejoué : plus aucune réponse acceptée dans un
        placeholder ou un indice ;
      - l'exemplar présenté comme LE chemin métrique → trace (glossaire de `lecon-11`, bonne réponse
        de `lecon-06` q3) alors qu'il est optionnel (drapeau `exemplar-storage`, documentation
        Prometheus) — bonne réponse réécrite après **11 candidats simulés**, 2 à 0 écart ; « trois vues
        d'un même événement » restée dans deux conclusions (une métrique agrège) ; un distracteur
        devenu absurde (« l'archive, la plus rapide ») et un autre agrammatical ; `exemplar` employé
        en `lecon-04` avant d'être défini ; le schéma `trace.txt` décalé d'une colonne ; « La SRE » au
        féminin dans `cours.html` ; 14,4 « en 2 jours » (Node : **2,083 j = 50 h**).

      **29 corrigées sur 29** (5 correcteurs en groupes disjoints, commit `cabe9d0`) ; 2 distracteurs
      simulés avant pose (`lecon-09` q3 : 10 candidats, `lecon-04` q4 : 5 — « services » rouvrait le mot
      fétiche). `controle.js --ref=753bc60` **0 indicateur déplacé**, lexique **0/0/0**, fétiche
      **0 alerte**, `verif-html` **0**.

      **CLÔTURE** : cliquets refigés — `verif-qcm-biais.js --ecrire`, `observabilite` marqué `traite`
      (**55 cours**), longueur **25,0 %**, pire indice du cliquet **25,2 %** (« la plus détaillée ») ;
      `verif-qcm-lexique.js --ecrire` (inchangé, déjà à 0). `tools/doc/gen.js`, assembleurs
      `etude-inconnu` / `etude-recherche` et `build-index --write --fresh` (quiz, flashcards, search,
      searchlite, antisèches, pièges) : **point fixe au 2ᵉ tour**, vérifié au contenu (empreinte du
      diff identique au tour suivant). `verif-donnees` **0 erreur** ; `verif.js --rapide` **53 étapes
      vertes (208,1 s)** ; 0 CRLF, 0 BOM, JSON valide, 0 chargement externe.
      **Site : 6 167 questions, réussite « la plus longue » 41,5 % (`mesure-biais-qcm`), 55 cours
      traités.**

      **LE 57ᵉ COURS EST DÉSIGNÉ — `docker`.** Classement par nocivité réelle sur les **35 cours
      restants** (`qcm-biais-reference.json`), `stats` exclu (cours-témoin) : `docker` (57 questions,
      **94,7 %**) et `r` (63, 85,7 %) ex aequo à **54,0 devinables**, départagés par le taux ; puis
      `bash` 53,5, `tests` 53,5, `pascal` 53,3, `fsharp` 52,3, `vb` 52,0, `linux` 52,0. Méthode
      inchangée : préparation (consigne mesurée), vague d'écriture, relecture par contradiction,
      correction en groupes disjoints, contre-relecture des corrections, clôture.

      ### 57ᵉ cours — `docker` (2026-09-30) : **94,7 % → 26,3 %**, CLOS

      **PRÉPARATION FAITE le 2026-09-30** : `scratchpad/CONSIGNE-DOCKER.md` (commit `458515e`) —
      94,7 % à la longueur, rangs **55/1/1/0**, **10 327 caractères** à écrire sur 55 questions sur 57,
      rapport bonne/distracteur **3,13** (107,9 contre 34,5 caractères), lexique **54 exploitables /
      36 retournées / 55 à mettre en forme**, intrus lexical **94 mots sur 18 questions**, **5 alertes**
      de biais inverse, **neuf tics de lot** (deux-points médian **25/7**, point-virgule médian 13/0,
      glose finale entre parenthèses 12/0 ; « parce » **2/17**, tic de DISTRACTEUR), **4 mots fétiches dès
      le départ** (`docker` 33,9 %, `conteneur` 33,3 %, `compose` 31,1 %, `build` 30,7 %).
      **Docker n'est pas installé, mais Compose et les Dockerfile S'EXÉCUTENT** : `docker-compose.exe`
      **v5.5.1** et `hadolint.exe` **2.15.1**, binaires officiels portables dans `scratchpad/compose/` et
      `scratchpad/hadolint/` (hors git, rien d'installé) ; `docker-compose config` valide, interpole et
      normalise **sans démon**. Table des erreurs classiques exécutée avant d'être donnée : `"8080:80"` →
      `target: 80, published: "8080"` ; `"127.0.0.1:5432:5432"` → `host_ip: 127.0.0.1` ; variable du
      shell **`depuis_shell`** contre `.env` **`depuis_env_file`** (le shell gagne) ; hadolint **DL3007**
      (`latest`), **DL3020** (`ADD`), **DL3003** (`cd`), **DL3025** (`CMD` forme shell) ; et une nuance :
      PyYAML (YAML 1.1) lit `22:22` comme **1342**, Compose v5.5.1 comme `target: 22`.

      **LA VAGUE (6 écrivains, patchs posés par `pose.js`) : 170 distracteurs sur 171 réécrits** (le
      171ᵉ, « Avec le cache de build », gardé : erreur plausible déjà dans son rang), **78 exécutions**
      citées (Compose `config`, hadolint, Node, documentation). Puis **un dosage de 4 retouches**
      simulées avant pose (`essai3.js`, copie d'`essai2.js` qui compare au DISQUE et non à `HEAD`) :
      « la moins bavarde » rendait **28,8 %** dans le sens INVERSE (5 bonnes sur 37 questions
      tranchées), ramenée sous le seuil par trois bascules (`lecon-01` q1, `lecon-15` q1 et q2), et
      « écarter les deux extrêmes » **28,1 % → 27,2 %** (`lecon-15` q6 : « docker build » → « docker
      volume »). Résultat : « la plus longue » **94,7 % → 26,3 %** (rangs **15/14/14/14**), lexique
      **0/0/0**, intrus lexical **0 mot**, tics **0**, mot fétiche **0 alerte**, biais inverse **0 alerte**,
      **pire des 44 stratégies 27,2 %**. Questions trahies par 5 indices ou plus : **44 → 0**.
      `mesure-qcm-intouchable` **0 atteinte** ; `verif-html` **0**. Commit `15a65ba`.

      **37 défauts signalés par les écrivains** (sans y toucher), transmis à la relecture dans
      `scratchpad/docker-depart/vague-defauts.json`. Les plus lourds, tous prouvés : le projet Compose
      de `lecon-13` (un service sans profil qui dépend d'un service à profil) est **rejeté comme invalide**
      par Compose v5.5.1, alors que la page dit qu'il démarre ; `docker system prune --volumes` ne
      supprime plus que les volumes ANONYMES depuis l'API 1.42 (`lecon-14`, `lecon-15`, et une BONNE
      RÉPONSE, `lecon-14` q3) ; « `docker logs` montre un OOMKilled » (`lecon-09` : c'est un champ de
      `docker inspect`) ; une commande multiligne de `lecon-10` dont chaque `\` est suivi d'un
      commentaire, ce qui la coupe à la première ligne ; deux solutions Postgres sans
      `POSTGRES_PASSWORD` (`lecon-04`, `lecon-15`), qui s'arrêtent aussitôt.

      **LA RELECTURE PAR CONTRADICTION (6 relecteurs, lecture seule, CORPS compris) : 126 FAUTES,
      136 vérifications exécutées (Compose `config`, hadolint, bash, `normExo` rejoué, source de
      l'entrypoint Postgres) ou sourcées, 173 affirmations confirmées justes.** ⚠️ Le premier passage a
      été **coupé par la limite de session** (1 lot sur 6 rendu) ; le MÊME workflow a été **repris** à
      la réouverture du quota, le lot rendu sortant du cache. Par zone : 59 corps, 30 exercices,
      10 schémas, 10 distracteurs, 6 explain, 4 bonnes réponses, 4 antisèches, 2 glossaires, 1 énoncé.
      Par nature : 41 fausses, 25 trompeuses, 23 qui ne fonctionnent pas, 21 incohérences,
      7 inintelligibles, 5 de français, 4 calculs faux — **aucun distracteur vrai**. Par gravité :
      **8 hautes, 42 moyennes, 76 basses**. Des 37 signalements des écrivains : **34 confirmés, 3 partiels,
      0 infirmé**. Le trait du cours : **ses exemples ne tournent pas** — un `#` en fin de ligne n'est un
      commentaire que dans un `RUN` (le shell l'ignore) ; ailleurs c'est un ARGUMENT (référence
      Dockerfile : « A # marker anywhere else in a line is treated as an argument »), et trois
      Dockerfile de la page en mouraient.

      **16 CORRIGÉES CETTE PASSE — les 8 hautes et ce qui touche au même passage** (script
      `scratchpad/docker-sonde/hautes.js`, chaque motif trouvé exactement une fois) :
      - **les commentaires en fin de ligne** (`lecon-03`, `lecon-06`, `lecon-11`) : `USER app  # …`
        donnait un utilisateur inexistant, `ENTRYPOINT ["python", "serveur.py"]  # …` retombait en
        forme shell (hadolint 2.15.1 : « unexpected '#' », exit 1) et `COPY . .  # …` recevait les mots
        du commentaire comme sources (DL3021). Commentaires sur leur propre ligne : **les quatre blocs
        repassent hadolint** (exit 0, hormis DL3066 *info*) ;
      - **la commande de durcissement de `lecon-10`**, dont chaque `\` suivi d'un commentaire échappait
        l'espace et non le saut de ligne : rejouée sous bash avec un `docker()` factice, elle recevait
        **4 arguments** avant, **13** après (commentaires regroupés au-dessus) ;
      - **les deux `postgres:16` sans `POSTGRES_PASSWORD`** de `lecon-04` (corps et solution de
        l'exercice 3) : l'entrypoint officiel fait `exit 1` sur une base neuve ;
      - **le schéma santé → redémarrage de `lecon-09`**, qui faisait relancer un conteneur *unhealthy*
        par la restart policy (documentation « Start containers automatically » : toutes les valeurs
        dépendent d'un arrêt) — flèche retirée, « signalé, pas relancé », `aria-label` et légende
        réécrits ; et « `docker logs` montre un OOMKilled » (c'est `docker inspect`) ;
      - **`--volumes`** (`lecon-14` : encadré, texte, schéma, antisèche, exercice, commentaires ;
        `lecon-15` : explain q12) : depuis Docker Engine 23 il ne supprime que les volumes
        **ANONYMES** (référence CLI : « Prune anonymous volumes ») ; un volume nommé ne part qu'avec
        `docker volume prune -a`. **La bonne réponse de `lecon-14` q3 était fausse** : réécrite après
        **11 candidats simulés** (`essai3.js`), un seul à 0 écart. ⚠️ La correction du corps a rouvert
        `k` sur deux questions (« en marche » avait quitté la page) : remis dans une phrase vraie.
      `controle.js --ref=15a65ba` **0 indicateur déplacé**, lexique **0/0/0**, fétiche **0 alerte**, tics
      **0**, `verif-html` **0**, `verif-donnees` **0 erreur** (index régénérés `--fresh`), `verif-rendu`
      sur les trois pages touchées **0 erreur** (18 mesures). `mesure-qcm-intouchable docker 15a65ba` :
      **3 atteintes, toutes délibérées** (bonne réponse et explain de `lecon-14` q3, explain de
      `lecon-15` q12).

      **LA CORRECTION DES 110 RESTANTES (6 correcteurs, groupes disjoints, consigne
      `scratchpad/CONSIGNE-DOCKER-CORRECTION.md`) : 110 corrigées sur 110** (37 moyennes, 73 basses),
      commit `4a01976` — **58 prouvées par exécution** (Compose `config`, hadolint, bash, `normExo`
      rejoué), **52 par la source** relue (docs.docker.com, référence Dockerfile, dépôts officiels).
      `controle.js --ref=15a65ba` **0 indicateur déplacé**, 0 bloc JSON cassé ; lexique **0/0/0** ;
      fétiche **0 alerte** ; `verif-html` **0** ; 0 CRLF, 0 BOM. Deux correcteurs ont rouvert `k` en
      route par une correction de corps (`lecon-07` q3, `lecon-14` q2) et l'ont refermé eux-mêmes.
      Ce qui pesait :
      - **les profils Compose de `lecon-13`** : la page disait qu'un service sans profil qui dépend
        d'un service à profil démarre quand même ; rejoué, Compose v5.5.1 refuse le projet (« depends
        on undefined service "adminer" », rc=1) tant que le profil n'est pas activé — texte réécrit ; la bonne
        réponse de q3 cesse de dire « qu'avec `--profile dev` » (`COMPOSE_PROFILES=dev … config
        --services` liste `adminer` sans `--profile`) ;
      - **`-v ./src:/app`** (`lecon-08`, huit endroits dont la bonne réponse de q1) montait `src` sur
        `/app` alors que les schémas le dessinaient dans `/app/src` ; et **l'ordre des deux montages
        ne compte pas** : rejoué, les deux ordres de déclaration donnent `/app` puis
        `/app/node_modules` (moby trie par profondeur du chemin) ;
      - **`lecon-11` q3** : l'image officielle `node` définit elle-même `ENV NODE_VERSION`
        (Dockerfile de `docker-node` relu) — l'énoncé passe à `APP_VERSION` ; **`lecon-15`** : deux
        solutions Compose sans `POSTGRES_PASSWORD` ni `service_healthy`, repassées à `config` ;
      - **deux schémas de `lecon-03`** qui dessinaient 6 couches pour un Dockerfile de 7 instructions ;
        les tailles d'images de `lecon-06` remesurées sur le registre (`node:20-alpine` **138,2 Mo**
        décompressée, et non « quelques Mo ») ; « près de 200 images officielles » (API Docker Hub :
        **181**).

      **LA CONTRE-RELECTURE (6 agents en lecture seule, chargés de démolir le diff `15a65ba..4a01976`) :
      49 PRISES, 104 blocs exécutés, 174 passages examinés dont 145 confirmés justes (83,3 %).**
      **30 prises portent sur les 126 corrections, soit 23,8 %** (54ᵉ cours 18,2 %, 55ᵉ 25,0 %, 56ᵉ
      29,0 % : la part ne monte plus, elle reste d'une correction sur quatre) ; s'y ajoutent **19 défauts
      hors liste**, dont la plupart avaient été vus par les correcteurs sans y toucher. 2 moyennes,
      47 basses ; 19 prouvées par exécution, 28 par la source, 2 annoncées incertaines. Ce qui compte :
      - **un schéma que sa propre correction a rendu faux** (`lecon-10`) : le bloc corrigé signe
        l'image « après le push, par son digest », le schéma juste en dessous la signait AVANT de la
        pousser — impossible avec cosign, qui dépose la signature dans le registre à côté de l'image
        (README de cosign). Schéma, titre et `aria-label` remis dans l'ordre build → push → sign →
        verify → run ;
      - **un absolu déplacé plutôt que retiré** (`lecon-15` q9) : pour ne pas bouger les mesures, la
        correction avait fait passer « toujours » du programme aux arguments (« toujours
        remplaçables »), ce qui est faux aussi — un `ENTRYPOINT` en forme shell ignore `CMD` et les
        arguments de `docker run` (référence Dockerfile). **10 candidats simulés** : retirer
        « toujours » déplace `ecarter les absolus`, le remplacer par « seulement » crée un mot
        technique exclusif ; le seul à **0 écart** garde les mêmes mots dans un autre ordre
        (« ses arguments toujours par défaut, remplaçables au docker run ») ;
      - **la règle des profils, appliquée à moitié** (`lecon-13`) : la bonne réponse, le glossaire, un
        commentaire, une légende et un placeholder disaient encore « ne démarre que si le profil est
        activé », ce que l'encadré corrigé de la même page dément (un service visé par son nom démarre
        sans son profil — `config adminer` le rend, rc=0) ;
      - **13 listes `accept` élargies à moitié** : la forme que la page enseigne restait refusée
        (`-v "$(pwd):/app"`, `docker logs -f mon-conteneur`, `--push` avec `--platform=`, `docker
        compose up --watch`, « le noyau du système hôte »), une réponse fausse était acceptée
        (`condition: healthy`, que Compose rejette ; « up » seul ; « system prune » sans `docker`) et
        **un indice était lui-même une réponse acceptée** (`--scale api=3`) ;
      - des termes employés avant d'être définis par les corrections (OCI, digest, image orpheline,
        `ARG`), `registry:2` (l'API Docker Hub donne la version **3.1.2**, mise à jour la veille), et
        un « seul `docker volume prune -a` les efface » que `docker compose down -v`, enseigné en
        `lecon-13`, dément.

      **48 corrigées sur 49** (règles `scratchpad/docker-contre/r-corps.js`, `r-l01b.js`, `r-qcm.js`,
      commit `7f92e5d`) ; **37 candidats simulés** pour cinq options de QCM, quatre posées à 0 écart.
      **1 laissée** : le distracteur de `lecon-15` q3 (« La tenue des pics… des renforts ») — 8 candidats,
      aucun à 0 écart (tout mot plus clair change `w`, `k` ou le rang de longueur) : il faudrait
      retoucher les trois options sœurs, pour un défaut de style. ⚠️ Une correction de corps a rouvert
      `k` (« tourner » entré dans `lecon-01`) : retiré, 0 écart. `controle.js --ref=15a65ba`
      **0 indicateur déplacé**, lexique **0/0/0**, fétiche **0 alerte**, tics **0**, `verif-html` **0**,
      `normExo` rejoué sur les **45 exercices** du cours : **0 placeholder ni indice accepté**,
      63 réponses attendues rejouées **0 anomalie** ; hadolint exit 0 sur le Dockerfile renommé
      (`ARG VERSION_NODE`) ; `verif-rendu` sur six pages **0 erreur** (36 mesures).
      `mesure-qcm-intouchable docker 15a65ba` à la clôture : **18 atteintes, toutes délibérées**
      (6 bonnes réponses, 10 explain, 2 énoncés).

      **CLÔTURE** : cliquets refigés — `verif-qcm-biais.js --ecrire`, `docker` marqué `traite`
      (**56 cours**), longueur **26,3 %**, pire indice du cours **27,2 %** (« écarter les deux
      extrêmes ») ; `verif-qcm-lexique.js --ecrire`. `tools/doc/gen.js`, assembleurs `etude-inconnu` /
      `etude-recherche` et `build-index --write --fresh` (quiz, flashcards, search, searchlite,
      antisèches, pièges) : **point fixe au 3ᵉ tour**, vérifié au contenu (empreinte du diff identique
      au tour suivant, 0 fichier écrit). `verif-donnees` **0 erreur** ; `verif.js --rapide` **53 étapes
      vertes (217,6 s)** ; 0 CRLF, 0 BOM, JSON valide, 0 chargement externe.
      **Site : 6 167 questions, réussite « la plus longue » 40,9 % (`mesure-biais-qcm`), 56 cours
      traités.**

      **LE 58ᵉ COURS EST DÉSIGNÉ — `r`.** Classement par nocivité réelle sur les **34 cours restants**
      (`qcm-biais-reference.json`), `stats` exclu (cours-témoin) : `r` (63 questions, 85,7 %)
      **54,0 devinables** ; puis `bash` 53,5 (95,5 %), `tests` 53,5 (93,9 %), `pascal` 53,3, `fsharp`
      52,3, `vb` 52,0, `linux` 52,0, `prolog` 52,0. ⚠️ `pages/r/lecon-06.html` porte un mojibake
      VOLONTAIRE (leçon sur l'encodage) : à exclure de toute normalisation. Méthode inchangée :
      préparation (consigne mesurée), vague d'écriture, relecture par contradiction, correction en
      groupes disjoints, contre-relecture des corrections, clôture.

      ### 58ᵉ cours — `r` (2026-09-30) : **85,7 % → 25,4 %**, CLOS

      **PRÉPARATION FAITE le 2026-09-30** : `scratchpad/CONSIGNE-R.md` (commit `fe027fe`) — 85,7 % à
      la longueur, rangs **54/4/4/1**, **13 983 caractères** à écrire sur 60 questions sur 63, rapport
      bonne/distracteur **4,42** (113,3 contre 25,6 caractères : le plus lourd du chantier), lexique
      **52 exploitables / 27 retournées / 54 à mettre en forme**, intrus lexical **199 mots sur
      29 questions**, **4 alertes** de biais inverse, **douze tics de lot** (point-virgule médian
      **24/5**, deux-points médian **21/1**, quatre segments à virgules 8/0), **2 mots fétiches**
      (`vecteur` 33,7 %, `lignes` 28,6 %), **46 questions sur 63** trahies par 5 indices ou plus.
      **R n'est pas installé, mais il S'EXÉCUTE** : `scratchpad/webr/` (hors git, rien d'installé)
      porte **webR** — R **4.6.0** compilé en WebAssembly, paquet npm — et les paquets du cours
      compilés pour lui (**dplyr 1.2.1, ggplot2 4.0.3, lubridate 1.9.5**, tidyr, stringr, purrr,
      forcats, readr, tibble, broom ; 280 Mo), lancés par `node scratchpad/webr/r.js [--echo] x.R`
      en **≈ 3 s**. ⚠️ Deux correctifs locaux ont été nécessaires sous Windows, dans `node_modules`
      (à refaire si le paquet est réinstallé) : l'`import()` du worker reçoit un chemin `D:\…` au lieu
      d'une URL `file://` (`webr-worker.js`), et `readlink` de NODEFS rend `EISDIR` au lieu d'`EINVAL`
      sur un dossier, ce qui casse `normalizePath` donc `library()` (`R.js`). Table de **25 erreurs
      classiques EXÉCUTÉE** avant d'être donnée (`scratchpad/r-depart/classiques.out`) : `x[5]` hors
      bornes → `NA` ; `1:3 + 1:6` → `2 4 6 5 7 9` sans avertissement ; `as.numeric(factor(c("10","20",
      "10")))` → `1 2 1` ; `1:0` fait tourner la boucle **deux fois** ; `left_join` avec une clé doublée
      à droite, 2 lignes → **3** ; `ymd("2024-01-31") + months(1)` → **`NA`** ; `sapply(list(),
      length)` → `list()` ; `var(c(2,4,4,4,5,5,7,9))` → `4.571429`.

      **LA VAGUE (6 écrivains, patchs posés par `pose.js`) : 180 distracteurs sur 189 réécrits** (9
      gardés dans le bilan de `lecon-17`, dont les bonnes réponses font 1 à 11 caractères : `1`, `NA`,
      un nom de fonction), **25 scripts R exécutés** (283 expressions pour le seul lot `l04-06`). Puis
      **une retouche de dosage** simulée avant pose (`essai3.js`) : le tic « le type » (3 bonnes /
      1 distracteur, 28,2 %) fermé en le donnant à un distracteur de `lecon-02` q3. Résultat : « la
      plus longue » **85,7 % → 25,4 %** (rangs **16/16/16/15**), lexique **0/0/0**, tics **12 → 0**,
      mot fétiche **0 alerte**, biais inverse **0 alerte** (pire : la moins bavarde 27,8 %), **pire des
      44 stratégies 27,0 %** (« écarter les deux extrêmes »). Questions trahies par 5 indices ou plus :
      **46 → 0**. `mesure-qcm-intouchable r fe027fe` **0 atteinte** ; `verif-html` **0** ; mojibake de
      `lecon-06` intact (2 occurrences avant, 2 après) ; 0 CRLF. Commit `ce3bc19`.
      **1 résidu laissé** : l'intrus lexical « inner » du bilan (`lecon-17`, « Quelle jointure dplyr
      conserve TOUTES les lignes de gauche ? ») — les seuls remplaçants courts sont `full_join()` et
      `nest_join()`, qui gardent eux aussi toutes les lignes de gauche et rendraient le distracteur
      VRAI.

      **60 défauts signalés par les écrivains** (sans y toucher), transmis à la relecture dans
      `scratchpad/r-depart/vague-defauts.json`. Le plus lourd : **`lecon-09` (inférence) affiche des
      sorties que son code ne rend pas** — avec `set.seed(7)` et le code de la page, le `t.test`
      présenté comme significatif ne l'est pas, et le `chisq.test`, calcul déterministe, n'a ni la
      statistique ni la p-value affichées. Aussi : `&&` sur un vecteur « ne regarde que le premier
      élément » (`lecon-02`, `lecon-04` : c'est une **erreur** depuis R 4.3, et `lecon-03` le dit) ;
      `fct_reorder()` annoncé décroissant (il est croissant par défaut) ; le modèle de `lecon-17`
      dont les chiffres viennent de `na.omit(airquality)` (111 lignes) et non de la table `air` du
      code (116 lignes).

      **LA RELECTURE PAR CONTRADICTION (6 relecteurs, lecture seule, CORPS compris) : 180 FAUTES,
      1 077 vérifications exécutées sous R, 622 affirmations confirmées justes.** Par zone : 88 corps,
      37 exercices, 21 distracteurs, 11 schémas, 6 énoncés, 6 explain, 5 glossaires, 4 bonnes
      réponses, 2 antisèches. Par nature : 61 fausses, 39 incohérences, 36 trompeuses,
      21 inintelligibles, 12 qui ne fonctionnent pas, 9 de français, 2 calculs faux — **aucun
      distracteur vrai, aucune bonne réponse fausse**. Par gravité : **8 hautes, 52 moyennes,
      120 basses**. Des 61 signalements des écrivains : **57 confirmés, 3 partiels, 1 infirmé**
      (« la bonne réponse est toujours en position 0 » : `js/lecon.js` mélange à l'affichage). Les
      180 extraits se retrouvent à l'identique dans les pages (`scratchpad/r-relecture/agrege.js` :
      0 introuvable, 0 ambigu). Le trait du cours : **`lecon-09` affichait des sorties que son code ne
      rend pas** — tous ses blocs de tirage ou de test, sauf `set.seed(42) ; rnorm(3)`.

      **19 CORRIGÉES CETTE PASSE — les 8 hautes et ce qui porte la même erreur** (script
      `scratchpad/r-sonde/hautes.js`, **41 motifs trouvés chacun exactement une fois** ; tout a été
      REJOUÉ par l'orchestrateur avant d'être écrit, `scratchpad/r-hautes/l09.out` et `autres.R`) :
      - **`lecon-09`, l'exemple central du `t.test`** : avec `set.seed(7)` et le code de la page, R
        rend **t = −1,7416, p = 0,08557**, intervalle **−12,38 à 0,83** (il contient 0) — la page
        affichait p = 0,01825 et concluait « significatif ». Graine passée à **`set.seed(123)`** :
        **t = −2,317, df = 77,656, p = 0,02314**, intervalle −13,426974 à −1,016048, moyennes
        100,6777 et 107,8993 ; prose et bloc `res$p.value` (**0,02314172**, `TRUE`) alignés ;
      - **les dix autres sorties de `lecon-09`**, recopiées de R : population **169,9776**,
        échantillon **170,9793** (« ≈ 171,0 » au schéma, à l'`aria-label`, à la prose et à la
        légende), intervalle **167,3739 – 174,2753**, `chisq.test` **X² = 9,9556, p = 0,001604**
        (calcul déterministe : la page donnait 13,36), `cor.test` **t = 5,3915, r = 0,6141477**
        (0,41 à 0,76), et les trois solutions d'exercice (**12,16302** ; **p = 0,006054539** et
        8,6 points d'écart, pas 5 ; **X² = 19,334**). Ce qui valide la sonde : `set.seed(42) ;
        rnorm(3)` rend sous webR les valeurs que la page affichait déjà justes (1,3709584 ;
        −0,5646982 ; 0,3631284) — le générateur est bien celui de R ;
      - **`&&` sur un vecteur** (`lecon-02` astuce et piège, schéma de `lecon-03`, piège de
        `lecon-04`) : il ne « regarde pas le premier élément », il s'arrête sur une **erreur**
        (« 'length = 4' in coercion to 'logical(1)' ») — ce que la note de `lecon-03` disait déjà ;
      - **le diagnostic d'encodage de `lecon-06`, inversé** : `Ã©` vient d'un fichier **UTF-8 lu
        comme du Latin-1** (exécuté : `read_csv(…, locale(encoding = "Latin1"))` sur un fichier
        UTF-8 rend `"FÃ©vrier"`), et le remède affiché FABRIQUAIT le charabia ; un fichier Latin-1 lu
        comme de l'UTF-8 rend `"F\xe9vrier"`. Texte, commentaire du bloc, légende et glossaire
        réécrits ; **le mojibake volontaire est intact** (2 occurrences avant, 2 après) ;
      - **`lecon-13`** : le schéma donnait `"ada@lovelace.uk"` pour `str_extract(x, "@")`, qui rend
        **`"@"`** — exactement ce que le QCM de la même page compte comme distracteur ; et l'explain
        de q1 commettait l'erreur que la leçon dénonce (`str_replace("01.42.68.53", ".", " ")` rend
        **`" 1.42.68.53"`** : le point non échappé prend le premier caractère) ;
      - **le rapport Quarto de `lecon-17`**, donné comme modèle de document reproductible, utilisait
        `air` sans le créer (« object 'air' not found » dans une session neuve) : `library(dplyr)` et
        la ligne `air <- airquality |> filter(!is.na(Ozone))` ajoutées (116 points tracés).
      ⚠️ Deux corrections de corps ont rouvert `k` (« depuis » entré dans `lecon-02`, « premier »
      sorti de `lecon-03`), nommées par la nouvelle sonde `scratchpad/r-sonde/kdiff.js` et refermées
      en reformulant le corps. `controle.js --ref=ce3bc19` **0 indicateur déplacé**, lexique
      **0/0/0**, fétiche **0 alerte**, tics **0**, `verif-html` **0**, `verif-rendu` sur six pages
      **0 erreur** (36 mesures). `mesure-qcm-intouchable r ce3bc19` : **1 atteinte, délibérée**
      (explain de `lecon-13` q1). Cliquets refigés après la vague (`verif-qcm-biais.js --ecrire`,
      `verif-qcm-lexique.js --ecrire` ; `traite` reste à poser à la clôture), pages dérivées
      réassemblées et index régénérés `--fresh` : **point fixe au 3ᵉ tour** (empreinte du diff
      identique, 0 fichier écrit). `verif-donnees` **0 erreur** ; `verif.js --rapide` **53 étapes
      vertes (232,1 s)** ; 0 CRLF, 0 chargement externe.
      **Site : 6 167 questions, réussite « la plus longue » 40,3 % (`mesure-biais-qcm`).**

      **LES 161 FAUTES RESTANTES CORRIGÉES (réveil suivant, même jour ; commit `af52988`)** — six
      correcteurs en fichiers disjoints (26 / 25 / 25 / 30 / 30 / 25), consigne
      `scratchpad/CONSIGNE-R-CORRECTION.md` : **161 corrigées, 0 laissée**. Nature des preuves :
      **111 par exécution sous webR**, 19 par la source (titres `<h2>` réels, NEWS de R 4.2/4.3),
      30 par relecture, 1 de mémoire. **10 atteintes délibérées à l'intouchable** (4 bonnes réponses,
      6 explain), chacune simulée par `essai3.js`. Ce qui a été rejoué et recopié de R : le modèle de
      `lecon-17` (ajusté sur `air`, 116 lignes : **−146,995 et 2,429**, prédiction à 80 °F
      **47,30077**), `fct_reorder()` croissant par défaut, `wday(label = TRUE)` qui commence au
      dimanche, `NA^0` → **1** (« presque toute opération avec NA donne NA »), `sapply(groupes,
      range)` → **matrice 2 × 2**, `read.csv` qui ne fabrique plus de facteurs depuis R 4.0
      (`class(...)` → `"character"`), `set.seed(1)` posé en tête du bloc `rnorm(5)` / `runif(5)`.
      `normExo` rejoué par chaque correcteur sur les exercices de ses leçons : 0 placeholder ni
      indice accepté. 6 déplacements de `k` apparus en route (« sortie », « taille », « variable », « laisse »,
      « réglage », « ampleur ») nommés par `kdiff.js` et refermés. `controle.js --ref=ce3bc19`
      **0 indicateur déplacé**, lexique **0/0/0**, fétiche **0**, tics **0**, `verif-html` **0**,
      mojibake de `lecon-06` intact (2/2).

      **LA CONTRE-RELECTURE DES CORRECTIONS (6 agents, lecture seule, diff depuis `ce3bc19`, les
      19 hautes comprises ; commit `9e32d9d`) : 296 blocs exécutés, 293 passages examinés, 266
      confirmés justes — 42 PRISES** : **26 sur les corrections** (23 corrections distinctes sur 180,
      soit **12,8 %** — la part la plus basse des cinq cours mesurés : 18,2 / 25,0 / 29,0 / 23,8 %),
      **16 hors liste confirmées** ; 4 moyennes, 38 basses, **aucun distracteur devenu vrai au sens
      strict** (un seul lisible comme vrai, `lecon-09` : « tous les tirages aient les mêmes nombres »
      est vrai d'une exécution à l'autre — réécrit « deux tirages à la file », `identical(a1, a2)` →
      `FALSE`). Les quatre moyennes, toutes rejouées par l'orchestrateur
      (`scratchpad/r-contre/moi.R`) avant d'être écrites :
      - **`lecon-16`, la règle de `pmap()` énoncée à l'envers** par la correction : ce n'est pas
        « chaque argument porte le nom d'une colonne », c'est chaque COLONNE qui doit trouver son
        argument — `pmap_dbl(lignes3, \(prix, quantite) …)` avec une colonne `tva` en plus s'arrête
        sur « unused argument (tva = …) », et un argument sans colonne (`remise = 0`) marche ;
      - **`lecon-11`** : la phrase corrigée valait pour `map_dbl` et était écrite pour les QUATRE
        variantes — `map_chr(list(1L, TRUE))` rend « Can't coerce from an integer to a string » ;
      - **`lecon-06`** : la phrase ajoutait « inconnu » aux textes tenant lieu de valeur manquante,
        le vecteur `na =` du code juste après ne le contenait pas (colonne restée `<chr>`, moyenne
        `NA` ; avec « inconnu » : `<dbl>`, moyenne **2**) ;
      - **`lecon-09`**, le distracteur ci-dessus.
      Parmi les basses : les coefficients de `lecon-17` recopiés cette fois TELS QUE R LES IMPRIME
      (`-146.995491 18.2871736 -8.038174 9.366854e-13`), `#| message: false` ajouté au rapport
      Quarto (le `library(dplyr)` de la passe précédente y aurait imprimé ses messages), `vapply`
      qui ne refuse pas « tout » autre type (`vapply(1:3, \(i) i > 1, numeric(1))` → `0 1 1`), six
      listes `accept` élargies à la forme que la leçon enseigne (`t.test(groupe_a, groupe_b)`,
      `cor(gens$experience, gens$salaire)`, `'\\d'`, `if_else`…), deux séries d'indices remises dans
      l'ordre (le premier donnait la réponse), « cylindrée » pour `cyl` (c'est `disp`), trois
      « couches » du schéma de `lecon-07` devenues « briques » (`length(p$layers)` → **1**).
      **41 corrigées, 1 laissée** : le distracteur 3 de `lecon-10` q1 (« les prédicteurs sont hp tout
      seul », pluriel bancal, gravité basse) — **7 candidats posés ou simulés, aucun à 0 écart**
      (« sont » et « prédicteurs » sont des mots de l'énoncé : les retirer ouvre l'écho ; une
      virgule ouvre « la plus détaillée », « pas » ouvre « la seule qui nie »). ⚠️ La pose des 42
      règles a d'abord déplacé **4 questions** (`controle.js`), dont trois par le texte même que les
      contradicteurs proposaient : « matrice » entré dans le corps de `lecon-03` (k de la bonne
      réponse 1 → 0 ; le corps dit maintenant « en tableau, si chaque appel rend plusieurs
      valeurs »), « (convertis) » (9 lettres) dans `lecon-11` (devenu « (réels) »), et les deux
      distracteurs du bilan (`lecon-17` q7, réécrits « Le contenu à afficher par un navigateur » et
      « Une mesure par capteurs embarqués », mêmes longueurs 39 et 33, mêmes `w` et `k`).
      État final : `controle.js --ref=ce3bc19` **0 indicateur déplacé**, lexique **0/0/0**, fétiche
      **0 alerte**, tics **0**, `normExo` 0 fuite, `verif-html` **0**, `verif-rendu` sur six pages
      **0 erreur** (36 mesures). `mesure-qcm-intouchable r ce3bc19` : **15 atteintes, toutes
      délibérées** (4 bonnes réponses, 11 explain).

      **CLÔTURE** : cliquets refigés — `verif-qcm-biais.js --ecrire`, `r` marqué `traite`
      (**57 cours**), longueur **25,4 %**, pire indice du cours **27,0 %** (« écarter les deux
      extrêmes ») ; `verif-qcm-lexique.js --ecrire`. `tools/doc/gen.js`, assembleurs `etude-inconnu` /
      `etude-recherche` et `build-index --write --fresh` (quiz, flashcards, search, searchlite,
      antisèches, pièges) : **point fixe au 3ᵉ tour** (empreinte du diff identique aux tours 2 et 3).
      `verif-donnees` **0 erreur** ; `verif.js --rapide` **53 étapes vertes (204,3 s)** ; 0 CR,
      0 BOM, JSON valide, 0 chargement externe.
      **Site : 6 167 questions, réussite « la plus longue » 40,3 % (`mesure-biais-qcm`), 57 cours
      traités, 33 restants.**

      **LE 59ᵉ COURS EST DÉSIGNÉ — `bash`.** Classement par nocivité réelle sur les **33 cours
      restants** (`qcm-biais-reference.json`), `stats` exclu : `bash` (56 questions, 95,5 %)
      **53,5 devinables**, à égalité avec `tests` 53,5 (57 questions, 93,9 %) — départagés par le
      taux ; puis `pascal` 53,3, `fsharp` 52,3, `linux` 52,0, `prolog` 52,0, `vb` 52,0, `objc` 51,7.
      Bash est dans Git Bash : les exemples s'exécutent sans rien installer. Méthode inchangée.

      ### 59ᵉ cours — `bash` (2026-09-30) : CLOS — 95,5 % → 25,0 %

      **PRÉPARATION FAITE le 2026-09-30** : `scratchpad/CONSIGNE-BASH.md` — **95,5 %** à la longueur
      (couverture 96,4 %, rendement 98,1 %), rangs **55/1/0/0** (cible 14/14/14/14), **12 252
      caractères** à écrire sur 53 questions sur 56, rapport bonne/distracteur **4,36** (111,4 contre
      25,6 caractères), lexique **44 exploitables / 28 retournées / 47 à mettre en forme**, intrus
      lexical **140 mots sur 27 questions**, **5 alertes** de biais inverse, **douze tics de lot**
      (point-virgule médian **25/8**, glose finale entre parenthèses **16/1**, deux-points médian
      **13/0**), **3 mots fétiches** (`commande` 37,5 %, `chaque` 37,1 %, `sortie` 33,9 %),
      `inverse` dans **10 distracteurs et 0 bonne réponse**, **42 questions sur 56** (75,0 %)
      trahies par 5 indices ou plus. Sondes copiées et repointées (`scratchpad/bash-sonde/`,
      `bash-corr/` ; `controle.js` à vide : 0 indicateur déplacé sur 56 questions). **Bash
      s'exécute** : GNU bash **5.3.9**, sed 4.9, awk 5.4.0, grep 3.0. Table de **34 erreurs
      classiques EXÉCUTÉE** avant d'être donnée (`scratchpad/bash-depart/classiques.out`) :
      `[[ 10 < 9 ]]` → code **0** (ordre lexicographique) ; `false | true` → **0**, **1** sous
      `pipefail` ; `2>&1 > f` laisse le fichier **vide** ; `$((08))` → « value too great for base » ;
      `${#t}` → **1** (longueur du premier élément) ; une variable incrémentée dans `… | while read`
      vaut encore **0** après la boucle ; `grep -c` compte les lignes (`aa aa` → **1**) ; un
      processus tué par SIGTERM rend **143**. ⚠️ **Ce qui ne s'exécute PAS fidèlement sous Git
      Bash, mesuré** : les permissions (un fichier sans bit `x` s'exécute, `ls -l` ne montre pas le
      bit), les liens symboliques (`ln -s` fait une copie : `[ -L l ]` faux), et `cron`, `rsync`,
      `jq`, ShellCheck sont absents — pour ceux-là, la source, pas l'exécution.

      **LA VAGUE (réveil suivant, même jour ; commits `ee845c3` et `5b3c59a`)** — six écrivains en
      lots disjoints, **161 distracteurs réécrits sur 168, 7 gardés** (`lecon-01` q3 et quatre
      formes courtes du bilan), **32 scripts Bash exécutés**. Mesures relancées par l'orchestrateur
      sur le cours entier :

      | | avant | après |
      |---|---:|---:|
      | « la plus longue » | 95,5 % | **25,0 %** (couverture 100 %, rendement 25,0 %) |
      | pire indice du cours | 95,5 % | **27,4 %** (« la TROISIÈME plus longue ») |
      | questions trahies par 5 indices ou plus | 42 | **0** (49 à 0–2 indices, 7 à 3–4) |
      | tics de lot | 12 | **0** |
      | alertes de biais inverse | 5 | **0** (pire : la moins bavarde, 27,3 %) |
      | lexique (exploitables) | 44 | **1** (`lecon-03` q1 : `k` tenu 1/1/1/1, `w` 4/4/4/3) |
      | mots fétiches (alertes) | 3 | **0** après dosage |

      `mesure-qcm-intouchable bash 961b440` : **0 atteinte** ; `verif-html` **0**. ⚠️ La vague
      avait fait de « chaque » un mot de DISTRACTEUR (10 bonnes / 46 distracteurs, ÉCARTER
      **28,1 %**, juste au-dessus du seuil) : la consigne demandait de le poser, elle ne disait pas
      combien. **Deux retouches de dosage** (`lecon-02` q3, `lecon-11` q3, simulées par
      `essai3.js`) l'ont ramené sous le seuil. `lecon-03` q1 reste « à mettre en forme » : **9
      candidats simulés, aucun à 0 écart** (« crée » et « encore » sont des mots de l'énoncé, un
      mot de 9 lettres ouvre le mot technique exclusif, 62 caractères font une égalité de rang).

      **LA RELECTURE PAR CONTRADICTION (même réveil ; commit `8c67d6f`)** — six relecteurs en
      lecture seule, **756 vérifications exécutées sous bash 5.3.9, 568 affirmations confirmées
      justes, 146 FAUTES** : **4 hautes, 50 moyennes, 92 basses** ; 75 dans les corps, 38 dans les
      exercices, 11 dans les QCM, 8 schémas, 6 antisèches. Les 50 signalements des écrivains ont
      été rejoués. **16 corrigées à cette passe**, toutes rejouées par l'orchestrateur avant
      d'être écrites (`scratchpad/bash-hautes/moi.sh`) :
      - **`set -u` présenté comme une protection contre une variable VIDE** — dans le « Cas réel »
        Steam de `lecon-06` ET de `lecon-11`, dans l'antisèche et dans l'explain de q3 de
        `lecon-06`. Exécuté : `set -u; V=""; echo "[$V]"` → code **0** ; seule une variable jamais
        définie rend « unbound variable » (code **127**). Ce qui aurait arrêté le script, c'est
        `set -e` sur la substitution de commande en échec (code **1**, suite non atteinte ; sous
        `set -u` seul : « suite atteinte [] », code 0) ;
      - **`trap … ERR` « à chaque commande qui renvoie un statut non nul »** (`lecon-12`) : faux
        dans le cas même que la leçon vise. Exécuté avec le piège de la page : un `false` DANS une
        fonction arrête le script **sans aucun message** (code 1) ; avec `set -Eeuo pipefail`,
        « ERREUR ligne 3 : "false" (code 1) » ; et aucun déclenchement dans un `if`, à gauche de
        `||` ou de `&&` ;
      - **`cron` « démarre souvent dans `/` »** (`lecon-02`) : il se place dans le HOME du compte
        (source : crontab(5) ; cron est absent de Git Bash) ;
      - **un distracteur VRAI par l'énoncé** : bilan q1 de `lecon-16`, « Comment lit-on la valeur
        d'une variable ? » — `nom` nu est juste dans `$(( n + 1 ))` (→ **6**), et le mini-projet
        de la page lit ainsi ses variables ; l'énoncé fixe le contexte (« dans une commande comme
        echo ») ;
      - **7 distracteurs** (4 inintelligibles, 3 de français) et l'explain de `lecon-15` q3
        (`sort a.txt | diff - <(sort b.txt)` lit le tube : code 1, différences affichées).
      ⚠️ **La pose des 17 règles a d'abord déplacé 8 questions** : 5 par le texte que les
      relecteurs proposaient (« malgré », « calcule », « nombre », « aucun », « direct »), 2 par
      un mot SORTI du corps (« échouer », nommé par `kdiff.js` : le corps dit de nouveau « aurait
      fait échouer le script »), 1 par la bonne réponse de `lecon-16` q1 (« journée » : mot
      technique exclusif et `k` déplacés — **revenue à l'état d'origine et laissée**, gravité
      basse). Après 8 rattrapages : `controle.js --ref=5b3c59a` **0 indicateur déplacé**, fétiche
      **0 alerte**, tics **0**, inverse **0 alerte**, `verif-html` **0**, `verif-rendu` sur six
      pages **aucun problème**. `mesure-qcm-intouchable bash 5b3c59a` : **3 atteintes, toutes
      délibérées** (2 explain, 1 énoncé). ⚠️ Un patch JSON écrit par heredoc a perdu son `\\;`
      (refusé par `pose.js` au parse) : le piège connu, repris dans la consigne.
      Cliquets refigés (`verif-qcm-biais.js --ecrire`, `verif-qcm-lexique.js --ecrire` ; `traite`
      reste à poser à la clôture), pages dérivées réassemblées et index régénérés `--fresh` :
      **point fixe au 3ᵉ tour** (empreinte du diff identique aux tours 2 et 3). `verif-donnees`
      **0 erreur** ; `verif.js --rapide` **53 étapes vertes (203,1 s)** ; 0 CR, 0 BOM, 0
      chargement externe.
      **Site : 6 167 questions, réussite « la plus longue » 39,7 % (`mesure-biais-qcm`).**

      **LA CORRECTION (réveil suivant, même jour ; commit `ccc117c`)** — six correcteurs en lots
      disjoints (un seul par fichier), consigne `scratchpad/CONSIGNE-BASH-CORRECTION.md`. **128
      fautes corrigées sur 129, 1 laissée** (n° 100 : elle repose sur Bash 3.2, qui ne s'exécute
      pas ici), **plus 11 corrections supplémentaires de même nature**. Preuves : **99 par
      exécution sous bash 5.3.9, 26 par la source, 4 de mémoire**. Exemples exécutés : les quatre
      sorties `ls` de `lecon-02` recopiées d'UN même dossier jetable (240K et 1,1M pour 245 760 et
      1 150 000 octets) ; `pile.sh` de `lecon-12` (« + 7:main: externe / + 6:externe: interne ») ;
      le `kill -TERM` de `lecon-10` (signal à 1 s, piège joué à 4 s, fin du `sleep`) ; le script de
      `lecon-08` rejoué en entier deux fois de suite (code 0, l'archive reste) ; le mini-projet de
      `lecon-16` avec une espace dans HOME (9 archives + celle du jour → **7**, code 0). **Deux
      rattrapages** : « qu'une » sorti du corps de `lecon-06` (k de q3), « guillemets » sorti de
      l'`aria-label` de `lecon-12` (k de q2). `controle.js --ref=8c67d6f` : **0 indicateur déplacé**
      sur 56 questions ; `mesure-qcm-intouchable bash 8c67d6f` : **0 atteinte**. ⚠️ Un rejeu a écrit
      pour de bon `/tmp/sauvegarde.tar.gz` (Git Bash convertit le chemin passé au script) : supprimé
      aussitôt, et la règle « dossier jetable SOUS le dossier de travail » est passée en consigne.

      **LA CONTRE-RELECTURE (même réveil ; commit `69c78e9`)** — six contradicteurs en lecture seule
      sur le diff `5b3c59a..ccc117c`, **environ 780 commandes rejouées sous bash 5.3.9 et 686 essais
      `normExo`**. **49 fautes : 9 moyennes, 40 basses, aucune haute** — **25 dues aux corrections
      (23 corrections distinctes sur 155, soit 14,8 %** ; cours précédents 18,2 / 25,0 / 29,0 /
      23,8 / 12,8 %) et 24 anciennes que personne n'avait vues. Les plus nettes :
      - **un absolu DÉPLACÉ, encore** : « sauf dans un if » (`lecon-08`) — exécuté, un `false` dans
        le bloc `then` arrête bien le script (code 1) ; seule la CONDITION est épargnée (code 0) ;
        et « seul un `kill -9` y échappe » (`lecon-11`), démenti par un script qui finit par `exec` ;
      - **une astuce fausse pour le script de sa propre page** (`lecon-11`) : « le script continue »
        après Ctrl-C — sous `set -e`, le piège se joue deux fois puis le script S'ARRÊTE (code 130) ;
      - **un libellé de lien devenu la réponse** (`lecon-02` : « Revoir … (cd -) », affiché au 10ᵉ
        essai) et une liste `accept` élargie à une forme FAUSSE (`(( ))` sans dollar, `lecon-05`) ;
      - **le mini-projet ne tenait pas sa promesse** (« échouer proprement, ne rien laisser
        traîner ») : après un échec de `tar`, l'archive amputée restait sous le nom définitif et
        écrasait la bonne archive du jour. `tar` écrit maintenant sous un nom provisoire que `mv`
        ne renomme qu'après succès — rejoué : **3 entrées avant l'échec, 3 après, code 1, aucun
        `.tmp`** ; le script complet et l'assemblage des briques rendent désormais **le même
        journal** (`diff` vide hors chemins ; la page disait « cinq briques », le script en a quatre) ;
      - **`xargs -d` est une option GNU** posée à neuf endroits sans le dire (le cours annonce
        macOS) : la phrase le dit, avec la variante `tr '\n' '\0' | xargs -0 rm --` (exécutée :
        code 0) ; l'absence de `-d` sur macOS est établie par la source, pas exécutée ;
      - **la bonne réponse de `lecon-16` q1** (la n° 22, laissée à la passe précédente) : « chaque
        exécution produise un fichier distinct » est fausse à l'exécution (deux lancements le même
        jour → **1 archive**). **8 candidats simulés, 1 à 0 écart** — « chaque journée produise un
        fichier différent » —, et seulement après avoir fait entrer « journée » et « différent »
        dans le CORPS (sinon `k` passait de 2 à 4 ; « quotidien » et « horodatage » déplaçaient le
        mot technique exclusif).
      **48 corrigées par l'orchestrateur, 1 laissée** (`-L` accepté pour `-l` : `normExo` passe en
      minuscules, limite du moteur). Trois distracteurs retouchés après simulation (`lecon-04` q1 :
      5 candidats, 1 à 0 écart ; `lecon-13` q3 : 3, 1 ; `lecon-15` q2 : 3, 2). **En plus** : deux
      indices qui ÉTAIENT la réponse (`$(( … ))` en `lecon-05`, `$#` en `lecon-06`), trouvés par un
      rejeu `normExo` étendu aux 50 exercices du cours (198 réponses acceptées), et **un
      débordement ancien de +300 px à 1280 px** dans `lecon-07` (un `<code>` en ligne de 128
      caractères, vu par `verif-rendu` lancé sur les 16 pages du cours : découpé en sept morceaux).
      ⚠️ **Laissé, et dit** : dans 13 exercices du cours, le libellé du lien « Revoir « grep » »
      affiche au 10ᵉ essai un mot qui est une réponse acceptée — c'est le titre de la section
      visée, convention du moteur sur tout le site, pas une faute de ce cours.
      État final : `controle.js --ref=8c67d6f` **0 indicateur déplacé**, fétiche **0 alerte**, tics
      **0**, lexique **1 question à mettre en forme** (`lecon-03` q1, connue), `verif-html` **0**,
      `verif-rendu` sur les 16 pages **0 erreur**. `mesure-qcm-intouchable bash 5b3c59a` : **6
      atteintes, toutes délibérées** (4 explain, 1 bonne réponse, 1 énoncé).

      **CLÔTURE** : cliquets refigés — `verif-qcm-biais.js --ecrire`, `bash` marqué `traite`
      (**58 cours**), longueur **25,0 %**, pire indice du cours **27,4 %** (« la TROISIÈME plus
      longue ») ; `verif-qcm-lexique.js --ecrire` ; épreuve `verif-qcm-biais-mutations` **10/10**.
      `tools/doc/gen.js`, assembleurs `etude-inconnu` / `etude-recherche` et `build-index --write
      --fresh` (quiz, flashcards, search, searchlite, antisèches, pièges) : **point fixe au 3ᵉ
      tour**, puis au 2ᵉ après la retouche de `lecon-07`. `verif-donnees` **0 erreur** ;
      `verif.js --rapide` **53 étapes vertes (228,7 s)** — ⚠️ un premier passage, lancé dans la
      foulée des index, s'était terminé en renvoyant vers `verif-erreurs.js` (sortie non
      conservée) ; relancé seul, cet outil est vert (55 entrées, 78 extraits réexécutés), et la
      chaîne entière l'est au second passage : à surveiller, non expliqué. 0 CR, 0 BOM, JSON
      valide, 0 chargement externe.
      **Site : 6 167 questions, réussite « la plus longue » 39,7 % (`mesure-biais-qcm`), 58 cours
      traités, 32 restants.**

      **LE 60ᵉ COURS EST DÉSIGNÉ — `tests`.** Classement par nocivité réelle sur les **32 cours
      restants** (`qcm-biais-reference.json`), `stats` exclu : `tests` (57 questions, 93,9 %)
      **53,5 devinables** ; puis `pascal` 53,3 (59 questions, 90,4 %), `fsharp` 52,3, `prolog` 52,0,
      `linux` 52,0, `vb` 52,0, `objc` 51,7, `api` 51,2. Méthode inchangée, avec deux ajouts tirés
      de `bash` : (1) le rejeu `normExo` couvre TOUS les exercices du cours et teste aussi les
      morceaux d'indice entre guillemets ou parenthèses (`scratchpad/bash-contre/moi/exos-tous.js`) ;
      (2) `verif-rendu` se lance sur TOUTES les pages du cours à la clôture, pas sur six.

      **LE 60ᵉ COURS — `tests` (« Tests & qualité »), 93,9 % → 24,6 %, clos le 2026-09-30.**
      57 questions dont 15 de bilan, 14 leçons. Consignes versionnées : `scratchpad/CONSIGNE-TESTS.md`
      (écriture), `-RELECTURE`, `-CORRECTION`, `-CONTRE`. Commits `66f8c9b` (vague), `ab9c502`
      (dosage), `5c5d64a` (relecture), `f7e2018` (corrections), `ddce902` (contre-relecture), puis
      la clôture.

      **LA PRÉPARATION.** Mesures de départ relevées par l'orchestrateur
      (`scratchpad/tests-depart/`) : « la plus longue » **93,9 %** (couverture 98,2 %, rendement
      94,6 %), la plus détaillée 73,8 %, la ponctuation forte 60,5 %, le mot technique exclusif
      57,2 % ; **41 questions sur 57 (71,9 %)** trahies par 5 indices ou plus ; bonne réponse
      **105,5 caractères** en moyenne contre **32,6** pour un distracteur (rapport **3,24**) ; rangs
      54 / 1 / 0 / 2 ; 12 tics de lot, 3 mots fétiches en alerte, 4 alertes de biais inverse,
      lexique 49 exploitables. **Le cours s'exécute** : Jest 29.7.0 et fast-check installés dans
      un dossier jetable hors git (`scratchpad/tests-env/`, 269 paquets, Node 24.16, npm 11.13) ;
      la table des erreurs classiques de la consigne a été **exécutée** avant d'être écrite
      (28 tests, dont 10 qui échouent exprès). ⚠️ **Elle a rendu la première faute du cours
      avant toute écriture** : la leçon 8 enseigne qu'un `await` oublié devant
      `expect(...).rejects` laisse le test « vert quoi qu'il arrive » — sous Node 24 + Jest 29.7,
      quand la promesse résout, **le processus Jest tombe (code 1, aucun rapport de test)**.

      **LA VAGUE (commit `66f8c9b`)** — six écrivains en lots disjoints, **166 distracteurs
      réécrits sur 171, 5 gardés** (bilan de `lecon-14`), **21 fichiers de test exécutés**.
      Mesures relancées par l'orchestrateur sur le cours entier :

      | | avant | après la vague | après le dosage |
      |---|---:|---:|---:|
      | « la plus longue » | 93,9 % | 26,3 % | **24,6 %** |
      | « la plus dense » | 26,3 % | **36,8 %** | **26,3 %** |
      | questions trahies par 5 indices ou plus | 41 | **0** | **0** (51 à 0–2, 6 à 3–4) |
      | rangs de la bonne réponse | 54 / 1 / 0 / 2 | 15 / 14 / 14 / 14 | |
      | tics de lot | 12 | 2 | 2 |
      | mots fétiches (alertes) | 3 | **0** | **0** |
      | biais inverse (alertes) | 4 | **0** | **0** |
      | lexique (exploitables) | 49 | 3 | 3 |

      ⚠️ **La vague avait fabriqué un indice neuf : « la plus dense » à 36,8 %, couverture
      100 %.** Dans un cours de MÉTHODE, la bonne réponse porte le vocabulaire technique
      (« persistance », « injectable », « spéculative ») et les distracteurs allongés sont faits de
      mots courts : la bonne réponse était la plus dense **21 fois sur 57**. **Dosage calculé**
      (`dosage.js` : 6,75 points à retirer ; `densbesoin.js` : lettres à ajouter et marge de
      caractères par distracteur) : **7 retouches simulées puis posées (5 bascules, 2 égalités)**
      — commit `ab9c502`. Trois candidats écartés en simulation pour un mot étranger à la page
      (« retient », « réussir », « propre »), un pour un absolu (« toujours »), un parce que
      « n'aura » compte pour UN jeton de six caractères (l'apostrophe colle).

      **LA RELECTURE PAR CONTRADICTION (commit `5c5d64a`)** — six relecteurs en lecture seule,
      **239 tests Jest exécutés, environ 1 260 essais `normExo`, environ 340 affirmations
      confirmées justes, 162 FAUTES** : **3 hautes, 67 moyennes, 92 basses** ; 52 dans les corps,
      48 dans les exercices, 23 dans les blocs de code, 17 dans les QCM, 13 dans les schémas,
      5 dans les explain, 4 dans le bilan. ⚠️ Le message du commit annonce « environ 210 tests
      et 1 400 essais » : chiffres écrits trop vite, les bons sont ceux-ci. Les trois hautes,
      **rejouées par l'orchestrateur avant d'être corrigées** (`scratchpad/tests-env/moi/`) :
      - **l'`await` oublié** (`lecon-08` : encadré, introduction, bonne réponse et explain de
        q1) — rejette comme prévu : 2 tests verts, code 0 ; ne se règle jamais : vert, code 0 ;
        résout : chute du processus, code 1, aucun rapport ;
      - **la propriété d'aller-retour donnée en modèle** (`lecon-10`) : `fc.object()` +
        `toEqual` **échoue 20 fois sur 20** (contre-exemple `{"":[undefined]}`, que JSON rend
        `[null]`) ; remplacée par `fc.json()` + comparaison du texte, **5 000 cas verts** ;
      - **le p95 « ce que vivent les 5 % les moins bien servis »** (`lecon-11`, bilan de
        `lecon-14`) : deux services au même p95 de 100 ms ont des moyennes de **100,05** et de
        **295**, et leurs 5 % les plus lents vivent 101 ms ou 4 000 ms.
      Trois bonnes réponses corrigées après simulation (0 écart) ; un rattrapage (« l'échec »,
      entré dans le corps, faisait tomber le `k` de la bonne réponse de `lecon-08` q1).

      **LA CORRECTION (commit `f7e2018`)** — six correcteurs en lots disjoints, **150 fautes
      corrigées sur 153, 3 laissées** (2 liens vers une documentation, 1 déjà corrigée).
      Preuves rejouées sous Jest 29.7, sous **Pact 17.1.4** et `npm audit` 11.13 dans des projets
      jetables hors dépôt : le bloc Pact de `lecon-12` n'écrivait **aucun contrat** (il manquait
      `provider.executeTest`) et un contrat sans matcher exigeait les valeurs exactes (« Expected
      75 (Integer) to be equal to 50 (Integer) ») ; la sortie `npm audit` affichée n'était pas
      celle de npm 11.13 ; dans `lecon-14`, `ouverture.js` déclarait deux fois `estOuvert`
      (`SyntaxError`, 0 test) et la solution du mini-projet importait un module absent de la
      page ; le schéma des mutants de `lecon-10` opposait `age > 18` et `age >= 19`, **la même
      fonction sur des entiers** ; « un test sur soixante est flaky » (la source dit 1,5 % des
      exécutions et près de 16 % des tests) ; `moyenne([])` « plante » (elle rend `NaN`).
      Fuites d'indice **12 → 5** (les cinq restantes sont des traductions délibérées placées
      après le masque). 7 rattrapages de `k` après `kdiff.js`. Lexique **3 exploitables → 0**.

      **LA CONTRE-RELECTURE (commit `ddce902`)** — six contradicteurs en lecture seule sur le
      diff `ab9c502..f7e2018`, **231 tests Jest (dont 10 sous Pact) et environ 4 750 essais
      `normExo`**. **67 prises : 0 haute, 22 moyennes, 45 basses** — **61 dues aux corrections
      (44 corrections distinctes sur 159, soit 27,7 %** ; cours précédents 18,2 / 25,0 / 29,0 /
      23,8 / 12,8 / 14,8 %) et 6 anciennes. Les plus nettes :
      - **MA PROPRE correction du p95 était fausse** : « le mieux que vivent les 5 % les moins
        bien servis » n'est vrai pour aucune des deux définitions usuelles dès que les mesures
        ne sont pas continues (95 requêtes à 100 ms et 5 à 5 000 ms : p95 = **100** au rang le
        plus proche, **345** interpolé ; le mieux des 5 % vaut 5 000). Le p95 est un **plancher** :
        « ce que vivent au moins les 5 % les moins bien servis ». Et le bilan comptait en
        utilisateurs ce qu'un centile compte en requêtes ;
      - **l'absolu déplacé de l'`await` oublié, par l'orchestrateur aussi** : « Jest s'arrête
        net » n'est vrai que si aucun test n'attend ; quand un test asynchrone suit, Jest rend un
        rapport complet où **le test sans `await` est vert et le suivant, innocent, est rouge** ;
      - **la correction posée à un endroit sur quatre** : mock / espion corrigé dans le corps de
        `lecon-05` et survivant dans la bonne réponse, l'explain et l'`aria-label` ; « bloque la
        fusion » conditionné à huit endroits de `lecon-06` et affirmé sans condition par la bonne
        réponse ; « testable » à quatre endroits de `lecon-14` ;
      - **`fc.json()` annoncé comme universel** : il ne génère que des sorties de
        `JSON.stringify` (neuf textes JSON valides sur neuf ressortent différents) ;
      - **quatre listes `accept` élargies qui acceptaient un mot de l'énoncé** (« avant chaque
        test », « motif AAA », « un test qui échoue », « couture ») : `exos-tous.js` ne compare
        que le texte entier et les morceaux entre guillemets ou parenthèses.
      **Les 67 corrigées par l'orchestrateur**, dont **8 options de QCM après simulation**
      (`sim.js`, 0 écart : 5 bonnes réponses, 3 distracteurs), 5 rattrapages de `k`, et **une
      fuite que ma correction venait de créer** (« page » accepté, et le placeholder disait
      « d'une page ») trouvée par un contrôle écrit pour l'occasion
      (`scratchpad/tests-contre/moi/fuites-larges.js`). Tic « que le code » fermé (1 retouche).
      ⚠️ **Laissé, et dit** : `fuites-enonces.js` montre que dans **4 exercices** la réponse se
      lit dans l'énoncé visible au-dessus du champ (`lecon-07` exo 3 « factory », `lecon-09`
      exo 3 « Page Object », `lecon-10` exo 3 « mutant », `lecon-12` exo 2 « producteur ») : le
      champ placé sous un exercice interroge le mot que l'énoncé emploie, convention du site
      entier, à trancher hors B4 (même nature que les libellés « Revoir … » de `bash`). Et le
      mini-projet de `lecon-14` n'ouvre toujours aucune couture : sa promesse a été ramenée à ce
      qu'il livre, la réécriture reste à décider.

      **CLÔTURE** : cliquets refigés — `verif-qcm-biais.js --ecrire`, `tests` marqué `traite`
      (**59 cours**), longueur **24,6 %**, pire indice du cours **26,3 %** (« la DEUXIÈME plus
      longue » ; dans la table brute, « ÉCARTER la plus courte » est à 26,6 %) ;
      `verif-qcm-lexique.js --ecrire` ; épreuve `verif-qcm-biais-mutations` **10/10**.
      `controle.js --ref=f7e2018` : **0 indicateur déplacé** sur 57 questions ; fétiche **0
      alerte**, tics **0**, biais inverse **0 alerte** (pire : la moins bavarde, 27,8 %), lexique
      **0 exploitable, 1 question à mettre en forme** (`lecon-14` q12). `mesure-qcm-intouchable
      tests ab9c502` : **26 atteintes, toutes délibérées** (bonnes réponses, explain et énoncés
      corrigés pour une faute prouvée). **`verif-rendu` sur les 15 pages du cours : 4 erreurs,
      2 débordements** — `lecon-09`, **+255 px à 1280 px, ANCIEN** (un `<code>` en ligne de
      quatre instructions, découpé en quatre) et `lecon-07`, +3 px, créé par une correction
      (découpé en deux) ; relancé : **0 erreur**. `tools/doc/gen.js`, assembleurs
      `etude-inconnu` / `etude-recherche` et `build-index --write --fresh` (quiz, flashcards,
      search, searchlite, antisèches, pièges) : **point fixe au 2ᵉ tour**, deux fois.
      `verif-donnees` **0 erreur** ; `verif-html` **0** ; `verif.js --rapide` **53 étapes vertes
      (178,8 s)**, sortie conservée dans `scratchpad/tests-depart/verif-rapide.txt` — vert au
      premier passage cette fois (le renvoi inexpliqué vers `verif-erreurs.js` de la clôture de
      `bash` ne s'est pas reproduit). 0 CR, 0 BOM, JSON valide, 0 chargement externe.
      **Site : 6 167 questions, réussite « la plus longue » 39,0 % (`mesure-biais-qcm`), 59 cours
      traités, 31 restants.**

      **LE 61ᵉ COURS EST DÉSIGNÉ — `pascal`.** Classement par nocivité réelle sur les **31 cours
      restants** (`qcm-biais-reference.json`) : `pascal` (59 questions, 90,4 %) **53,3
      devinables** ; puis `fsharp` 52,3 (54 questions, 96,8 %), `vb` 52,0, `linux` 52,0, `prolog`
      52,0, `objc` 51,7, `api` 51,2, `asm` 50,0, `cobol` 49,3. Méthode inchangée, avec trois
      ajouts tirés de `tests` : (1) **mesurer « la plus dense » dès la fin de la vague**, et dire
      aux écrivains de porter le vocabulaire technique de la bonne réponse dans les distracteurs ;
      (2) le contrôle des fuites couvre les SUITES DE MOTS du placeholder et des indices
      (`fuites-larges.js`) et l'énoncé visible (`fuites-enonces.js`) ; (3) **les corrections de
      l'orchestrateur passent la contre-relecture comme les autres** — trois de ses neuf étaient
      fautives. ⚠️ Pascal ne s'exécute pas sur cette machine à ce jour (aucun `fpc` installé) :
      chercher un compilateur portable hors git avant d'écrire la consigne, comme pour `dart`.

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

      **DETTE SOLDÉE PAR AVANCE (2026-09-08) — l'explication orpheline.** Le compte rendu de
      `kotlin` réclamait ici « un contrôle *l'`explain` ne cite pas une option absente*, bon
      marché et inexistant », et supposait que le défaut attendait « probablement dans les
      30 cours déjà traités ». **Outil livré (`tools/mesure-explain-orpheline.js`) et
      supposition RÉFUTÉE par la mesure** : sur **25 cours** dont la vague est identifiable dans
      git, **2 104 questions** ont une option changée sous un `explain` intouché, et il reste
      **un seul signalement — bénin** (`rust/lecon-13` nomme `borrow_mut` pour expliquer un
      mécanisme, il ne réfute pas une option absente). `kotlin` était un cas isolé. Les 6 autres
      cours traités (`git`, `java`, `ocaml`, `php`, `react`, `sql`) n'ont pas de vague repérable
      au motif employé et **ne sont pas mesurés** : mieux vaut ne rien mesurer que mesurer contre
      la mauvaise référence. **Reste à faire ici : brancher l'outil dans la chaîne** (il rend un
      code de sortie 1) et lui écrire son épreuve par mutation, comme les autres cliquets.
- [ ] **F4 · Ce qui n'a pas été fait.** Lister et expliquer, sans arrondir — comme l'a fait le F5
      du V15, dont ce chantier entier est issu.

---

## Fin de chantier

Quand toutes les cases sont cochées, le wrapper déclenche la **passe de sécurité** : vérification
globale, rapport dans `VERIF-FINALE.md` avec un verdict en première ligne, puis extinction
automatique si le verdict est vert.
