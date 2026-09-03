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

- [ ] **A2 · `verif-sorties.js` : trancher la question que le V15 a laissée ouverte.** Il trouve de
      vraies fautes (une leçon dont les 4 lignes publiées rendent `undefined`, un dépassement de
      délai de 10 s dans le bac à sable `vm`). Le V15 refusait de l'intégrer sans avoir d'abord
      soldé ces deux cas. **Les solder, puis l'intégrer** — ou expliquer par la mesure pourquoi il
      doit rester dehors.

- [ ] **A3 · Faire entrer les vérificateurs classés « chaîne obligatoire ».** Un par un, en
      mesurant la durée ajoutée à `verif.js --rapide` et `--complet` à chaque fois. **Si le mode
      rapide dépasse une minute, il n'est plus rapide** : le dire et arbitrer.

- [ ] **A4 · Un mode `--mutations` pour les 7 épreuves par injection.** Elles prouvent que les
      vérificateurs voient vraiment les fautes — c'est le contrôle le plus précieux du projet et il
      n'est lancé par rien. **Exigence : chaque épreuve doit restaurer l'état initial même en cas
      d'échec**, et le mode doit le vérifier (`git status` propre à la sortie).

- [ ] **A5 · Le garde-fou qui manquait.** Un contrôle qui compare la liste des `tools/**/verif-*.js`
      à ceux que `verif.js` lance réellement, et **échoue** si un vérificateur n'est dans aucun mode
      sans être déclaré « hors chaîne assumé » avec sa raison. Sans ce garde-fou, le problème
      reviendra au chantier suivant.

---

## PHASE B — Le biais de longueur des QCM

**89,6 % de réussite en choisissant toujours la réponse la plus longue.** Un apprenant peut valider
presque tous les QCM du site sans rien comprendre. Six cours sont à 100 % : `archi`, `equipe`,
`iac`, `mobile`, `ux`, `zig`.

La cause est mécanique et sans malice : la bonne réponse porte l'explication, les distracteurs sont
expédiés. La correction ne consiste donc **pas** à raccourcir la bonne réponse — ce serait perdre le
contenu — mais à **étoffer les distracteurs** pour qu'ils soient plausibles.

- [ ] **B1 · Mesurer d'abord, et ne pas se fier au seul critère de longueur.** Relever aussi les
      autres indices qui trahissent la bonne réponse : présence d'un tiret d'explication, vocabulaire
      technique absent des autres choix, formulation prudente contre affirmation absolue. **Le
      biais de longueur n'est peut-être pas le seul, ni le pire.** Produire le tableau, choisir la
      cible chiffrée, et l'écrire ici.
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
