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

- [ ] **A1 · Trier les 24, avant de toucher à quoi que ce soit.** Lancer chacun, relever son code de
      sortie, sa durée, ce qu'il mesure, et s'il modifie des fichiers. Produire le tableau et
      classer : *chaîne obligatoire*, *mode dédié*, *hors chaîne assumé*. **Écrire le classement dans
      ce plan** — c'est lui qui décide de A2 à A5, pas l'intuition. Un outil qui échoue aujourd'hui
      est un renseignement, pas un obstacle : le noter.

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
