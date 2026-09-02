# Chantier V15 — comprendre ce qu'on ne voit pas

Plan de travail de l'autonomie. **Source de vérité : ce fichier.** Chaque réveil lit ce plan,
prend la **première case non cochée**, la traite entièrement, la coche avec un compte rendu chiffré,
puis passe à la suivante. Le chantier est fini quand il ne reste aucune case `- [ ]`.

**À traiter APRÈS `CHANTIER-V14.md`**, qui doit être entièrement coché.

---

## Le constat qui fonde ce chantier

Les trois chantiers précédents complètent le site sur ses propres bases : outiller (V12), écrire les
cours qui manquent (V13), faire pratiquer (V14). Celui-ci s'attaque à quatre angles morts que
**aucun** des 83 cours ne couvre, et qui ont été vérifiés un par un avant d'écrire ce plan :

| Angle mort | Ce que le site fait aujourd'hui | Mesure |
|---|---|---:|
| **Lire le code des autres** | On apprend à écrire du code. Jamais à en lire. | **0** étude de cas |
| **Voir un programme s'exécuter** | La pile d'appels est *expliquée*… mais jamais *montrée* en marche. Le visualiseur ne connaît que les tris et la recherche binaire. | expliquée dans **48** leçons, montrée **0** fois |
| **Les mathématiques du métier** | Aucun cours. Or la cryptographie, les réseaux de neurones et les graphes du V13 en dépendent. | **0** cours sur 83 |
| **Lire la documentation officielle** | Elle est en anglais, le site est en français, et il ne dit jamais comment franchir ce pas. | **20** pages y renvoient sans jamais l'enseigner |

Le point commun : ce sont les compétences qui **survivent aux langages**. Un cours de framework
périme en trois ans ; savoir lire un programme qu'on n'a pas écrit ne périme jamais. C'est
exactement le genre de contenu qui justifie d'y passer du temps.

La dernière phase traite le revers de cette pièce : **ce qui périme quand même**, et que rien ne
surveille aujourd'hui — 51 pages citent un numéro de version, 4 portent une date.

---

## Règles permanentes

- **Un point à la fois**, mené jusqu'à la mesure.
- **NE JAMAIS ÉCRIRE UN CALCUL DE TÊTE, LE FAIRE TOURNER.** C'est la règle née des cinq exemples faux trouvés alors que les quatre vérificateurs étaient verts. Elle vaut doublement ici : une phase entière est mathématique, et un résultat faux dans un cours de maths décrédibilise tout le reste.
- **Un motif de remplacement trop large casse ce qui était juste.** Rejouer le scénario complet après correction.
- **Un commit par point**, avec la mesure dans le message.
- `node tools/verif.js --rapide` vert ; `verif-exemples.js` et `verif-rendu.js` selon ce qui est touché.
- **Contrainte fondatrice** : 100 % `file://`, aucun serveur, aucun module ES, aucun build, aucune dépendance installée.
- **INTERDIT** : réintroduire une URL vers `cdnjs.cloudflare.com`, `fonts.googleapis.com`, `fonts.gstatic.com`.
- **⚠️ LICENCE.** Ce chantier fait lire du code. On ne recopie **pas** le code source d'un projet tiers : on écrit du code réaliste pour l'occasion, ou on lit **le code de ce site**, qui nous appartient. Un extrait externe n'est admis que s'il est du domaine public et cité.
- **En cas de doute réel : ne force pas.** Laisse la case décochée et écris ce qui bloque.

---

## PHASE A — Lire le code des autres

C'est ce que fait un développeur 80 % du temps, et le site n'en dit rien. Une étude de cas, ce n'est
pas un exercice : c'est **un vrai programme qui marche**, donné en entier, puis décortiqué — ce qu'il
fait, comment il est organisé, pourquoi tel choix, et où on irait chercher si on devait le modifier.

**Format à tenir** : le programme complet d'abord (l'apprenant doit pouvoir le lire seul et échouer),
puis la lecture guidée, puis **une modification à faire soi-même** — parce qu'on n'a compris un code
que le jour où on arrive à le changer sans le casser.

- [x] **A1 · Le format et la première étude.** ✅ **2026-09-02. Le format existe, la première étude est écrite — et elle est la première page du site dont la sortie publiée est COMPARÉE, dans le navigateur, à ce que le programme produit vraiment : 19 lignes publiées, 19 lignes rendues, 0 écart.**

  **Mesure de départ, reproduite** : `grep` sur `pages/` et `js/` → **0 étude de cas**, comme l'annonçait le cadrage. Le point était donc bien à faire.

  **A · CE QUI EST LIVRÉ**

  | | |
  |---|---|
  | `pages/etude-journal.html` | l'étude nº 1, **39,8 Ko**, 5 sections ancrées, 7 blocs de code |
  | `tools/etudes/journal/` | les SOURCES versionnées : le programme lu (**152 lignes** de JavaScript, un analyseur de journal d'accès HTTP), le gabarit, et un `assembler.js` qui **re-mesure la sortie à chaque assemblage** — la page publiée ne peut donc pas contenir une sortie périmée. Reconstruction vérifiée : même page à l'octet près (39 754). |
  | `css/pages.css` | **8 classes neuves** `.etude-*` (bandeau de méta, encadré de questions, partie de lecture guidée numérotée + repère de lignes, tableau des décisions replié en fiches sous 640 px) |
  | `tools/preuves/etude-journal.js` | la preuve, **21ᵉ étape de `verif.js`** hors mode rapide (la chaîne passe à 22 en `--complet`) |

  **Le format, en quatre temps** — c'est lui que les six études suivantes reprendront : **(1)** le programme entier, *exécutable et modifiable sur place* ; **(2)** quatre questions à se poser AVANT toute explication, puis la sortie réelle ; **(3)** la lecture guidée en **7 parties**, chacune ancrée sur des **numéros de ligne** du programme ; **(4)** les **décisions nommées** dans un tableau à trois colonnes dont la dernière est *ce que l'autre choix coûterait* — la règle de A4 (« jamais seulement : c'est plus propre ») appliquée dès la première étude ; **(5)** une modification à faire soi-même, avec sa sortie attendue et sa solution.

  **Rien de neuf n'a été écrit côté moteur** : un `<figure class="code-block">` suffit pour que `js/main.js` pose la barre et `js/runner.js` le bouton « Tester » + l'éditeur. Les six extraits de la lecture guidée portent `data-runner="skip"` — un attribut que `runner.js` respectait déjà et que le contenu n'employait jamais — pour qu'un fragment non exécutable ne propose pas un bouton qui ne rendrait rien. **Mesuré dans Chrome : 7 blocs, exactement 1 exécutable, 6 volontairement inertes.**

  **B · CE QUI EST PROUVÉ, ET COMMENT** — `node tools/preuves/etude-journal.js`, Chrome headless, `file://`, `--host-resolver-rules="MAP * ~NOTFOUND"` :

  | ce qui est affirmé à l'apprenant | mesure |
  |---|---|
  | « ce programme marche » | le bouton « Tester » l'exécute : **0 exception de page** |
  | « voici ce qu'il affiche » | **19 lignes publiées / 19 rendues, 0 écart** ligne à ligne |
  | « voici la solution » | la solution **publiée**, appliquée au programme **publié**, relus tous deux dans la page, rend `taux d'échec ....... 31.3 %` — exactement la ligne annoncée |
  | le sommaire | 5 sections ancrées, **0 lien mort** |
  | hors réseau | **0 requête distante** |

  Et la preuve n'est pas verte pour rien : **épreuve d'injection faite** — un seul chiffre changé dans la sortie publiée (`18` → `19`), l'étape rougit en désignant la ligne 2 et les deux valeurs. C'est la leçon de V14-F4 appliquée le jour même.

  **C · TROIS CHOSES QUE J'AI DÛ CORRIGER AVANT DE PUBLIER, ET C'EST LE VRAI RÉSULTAT DU POINT**

  1. **Un commentaire du programme affirmait une contre-vérité.** Il justifiait le départage des ex æquo par « sinon deux exécutions rendraient deux classements différents ». **Faux, mesuré en le retirant : trois exécutions de suite rendent le même classement** — le tri de JavaScript est stable depuis 2019. Le vrai motif est autre, et il est plus intéressant : sans départage, les ex æquo sortent dans l'ordre de leur *première apparition dans le journal* (`/index.html` passe alors devant `/cours/sql`). Le commentaire ET la partie 6 de la lecture guidée disent maintenant cela — et l'étude s'en sert pour enseigner « vérifie plutôt que crois ».
  2. **Une affirmation sur `Map` vs objet ordinaire a été exécutée avant d'être écrite**, et la mesure est plus forte que ce que j'allais publier : `o["constructor"] = (o["constructor"] || 0) + 1` rend `"function Object() { [native code] }1"` — une **concaténation**, pas un compte ; et `o["__proto__"] = 1` est **purement ignoré**, la clé n'apparaissant même pas dans `Object.keys`, si bien que ce chemin **disparaîtrait du rapport**. La sortie brute de cette mesure est publiée telle quelle dans la partie 4.
  3. **Deux fautes trouvées par les outils du site, pas par moi.** `verif-rendu.js` a rendu **9 erreurs de contraste** sur 6 mesures : mon encadré de questions employait `var(--surface-inset)`, qui est **volontairement sombre dans les deux thèmes** (c'est le fond des blocs de code) — texte sombre sur fond sombre, **1,19:1 pour un seuil de 4,5**. Corrigé en `--surface-2` → **0 erreur sur 6 mesures** (3 largeurs × 2 thèmes). Et la carte « pour continuer » renvoyait à `js/lecon-19.html` que je croyais consacrée aux tableaux : son `<h1>` dit « Objets avancés et prototypes ». Remplacée par `lecon-08` (map/filter/reduce, sujet de la partie 5) et `lecon-28` (Map et Set, sujet de la partie 4), les deux titres relus sur disque.

  **D · CONTRÔLES.** `verif.js --rapide` **vert (14 étapes, 201,2 s)** · `verif-html.js --tous` **1 776 fichiers, 0 GRAVE, 0 ATTENTION** · `verif-donnees.js` **25 contrôles, 0 erreur** · `verif-rendu.js --echantillon` **20 pages, 120 mesures, 0 erreur** · équilibre des balises **1 776 pages / 1 480 453 balises / 0 déséquilibre** · 0 BOM, 0 mojibake, 0 URL de CDN · accolades du CSS équilibrées (1 517 / 1 517), aucune `var(--x)` inexistante introduite. `search-index` et `search-lite` régénérés : **66 → 67 pages transverses**, la page est donc **déjà trouvable par la recherche** (vérifié : son titre y figure).

  🔵 **Ce qui reste à A7, et qui n'est pas un oubli** : le **hub**, l'entrée dans la **navigation** et dans le **catalogue**, ainsi que les renvois depuis les cours concernés. A1 ne livre que le gabarit et la première étude ; aujourd'hui, **aucune page du site ne pointe vers elle** : on ne la rejoint que par la recherche (mesuré : son titre est bien dans `search-lite`). Les quatre cartes « pour continuer » de l'étude partent d'elle vers les leçons, jamais l'inverse. **C'est le seul manque de ce point, et il est explicitement le sujet de A7.**
- [x] **A2 · Lire le code de ce site (1) — le moteur d'exercices.** ✅ **2026-09-02. L'étude nº 2 est écrite, et elle ne contient PAS UNE LIGNE de code recopiée : ses 6 extraits sont relus dans `js/lecon.js` à chaque assemblage, et une preuve les recompare au fichier sur disque — 6 publiés, 6 retrouvés tels quels.**

  **Mesure de départ, reproduite** : `grep -rl "etude-moteur"` → **0** avant ce point ; une seule étude de cas existait (A1). Le point était bien à faire.

  **A · L'ANGLE, ET POURQUOI IL DIFFÈRE D'A1.** A1 donnait un programme de 152 lignes lu d'un bout à l'autre. Ce n'est pas la situation ordinaire. Celle-ci l'est : **un fichier que personne ne lit en entier**. L'étude 2 enseigne donc l'inverse — cartographier, entrer par un point, suivre **un seul fil**, et **savoir ce qu'on ne lit pas**. Le fichier lu est `js/lecon.js`, **1 899 lignes, 48 fonctions**, dont `initExos` (**218 lignes, 1223–1440**) qui fait tourner **4 608 exercices sur 1 523 leçons** (4 254 `text`, 290 `code`, 26 `regex`, 25 `python`, 13 `sql` — mesuré, pas estimé).

  **B · CE QUI EST LIVRÉ**

  | | |
  |---|---|
  | `pages/etude-moteur-exos.html` | l'étude nº 2, **50 126 octets**, 6 sections ancrées, 11 blocs de code dont **exactement 1 exécutable** |
  | `tools/etudes/moteur-exos/carte.js` | dresse la **carte** du fichier (fonctions, tailles, bornes) — la sortie publiée est la sienne |
  | `tools/etudes/moteur-exos/inventaire.js` | compte ce que le moteur traite **réellement** sur le site (leçons, exercices, types) |
  | `tools/etudes/moteur-exos/banc.js` | le **banc d'essai** publié : 14 cas passés à `normExo` et `uneLigneEgale`, **extraites de `js/lecon.js` à l'assemblage** |
  | `tools/etudes/moteur-exos/assembler.js` | vérifie **8 repères de lignes** (début ET fin de chaque extrait), exécute le banc, exécute la variante modifiée, et refuse de publier si un chiffre du texte ne colle plus |
  | `tools/preuves/etude-moteur-exos.js` | la preuve, **22ᵉ étape de `verif.js`** hors mode rapide |

  **Aucun CSS neuf** : les 8 classes `.etude-*` créées par A1 ont suffi — c'est ce qu'on attend d'un format réutilisable. **`verif-rendu.js` sur la page : 6 mesures (3 largeurs × 2 thèmes), 0 erreur**, sans avoir eu à corriger un contraste comme en A1.

  **C · CE QUI EST PROUVÉ** — `node tools/preuves/etude-moteur-exos.js`, Chrome headless, `file://`, DNS coupé :

  | ce qui est affirmé à l'apprenant | mesure |
  |---|---|
  | « ces extraits sont ceux de `js/lecon.js` » | **6 publiés / 6 retrouvés tels quels** dans le fichier sur disque |
  | « ce banc marche » | le bouton « Tester » l'exécute : **0 exception de page** |
  | « voici ce qu'il affiche » | **21 lignes publiées / 21 rendues, 0 écart** ligne à ligne |
  | « en retirant cette ligne, N verdicts basculent » | **2 annoncés, 2 mesurés** dans le navigateur |
  | le sommaire | 6 sections ancrées, **0 lien mort** |
  | hors réseau | **0 requête distante** |

  **Épreuve d'injection faite**, trois fautes posées d'un coup : un chiffre de la sortie publiée (`10 acceptés` → `11`), le nombre de bascules annoncé (`2` → `3`), et un mot dans un extrait (`"code"` → `"CODE"`). **Trois fautes vues, chacune nommée précisément** — dont « extrait nº 3 introuvable tel quel dans js/lecon.js ».

  **D · CE QUE LA MESURE M'A APPRIS, ET QUE JE N'AURAIS PAS ÉCRIT DE TÊTE**

  1. **La modification proposée fait basculer 2 verdicts, pas 1 ni 3 — et lesquels n'était pas devinable.** En rendant `normExo` strict sur les accents, `eleve` et `ELEVE` tombent, mais **`ÉLÈVE` reste accepté** : la casse est traitée par `toLowerCase()`, sur une autre ligne. Deux tolérances qu'on croirait liées sont indépendantes. L'assembleur **exige** désormais que les cas basculés soient exactement ceux que la page nomme, sinon il refuse de publier.
  2. **`innerText` sur la console du runner SAUTE les lignes vides** : ma première mesure annonçait 18 lignes rendues contre 21 publiées, et l'écart était **entièrement faux**. Un `<div>` sans texte ne produit aucun saut de ligne pour `innerText`, alors qu'à l'écran la ligne existe — `.runner-output__line::before` lui pose un chevron « › ». **Ce n'est donc pas un défaut du site, c'est un défaut de la mesure** : la preuve relève maintenant les lignes **une par une**, par `textContent`. Sans cette vérification, j'aurais « corrigé » `runner.js` pour rien, sur 1 523 leçons.
  3. **Trois caractères invisibles enseignés parce qu'ils sont là.** `normExo` contient `.replace(/ /g, " ")` — le premier caractère est une **espace insécable** (U+00A0) — et une plage de **diacritiques combinants** (U+0300–U+036F) qui se posent sur le crochet qui les précède. Ces deux lignes existent parce que ce site écrit sa typographie en insécables et guillemets courbes : **sans elles, une réponse juste copiée depuis l'énoncé serait refusée sans que l'apprenant voie la moindre différence à l'écran**. Le banc le démontre en deux cas.

  **E · CONTRÔLES.** `verif.js --rapide` **vert (14 étapes, 294,9 s)** · `verif-html.js --tous` **1 777 fichiers, 0 GRAVE, 0 ATTENTION** · `verif-donnees.js` **25 contrôles, 0 erreur** (1 avertissement préexistant, doublon de QCM `zig`) · `verif-rendu.js` sur la page **6 mesures, 0 erreur** · `node --check` sur les 4 fichiers JS neufs + `tools/verif.js` · 0 BOM, 0 mojibake, 0 URL de CDN. `search-index` et `search-lite` régénérés : **67 → 68 pages transverses**, la page est donc trouvable par la recherche.

  🔵 **Ce qui reste à A7** : comme pour A1, **aucune page du site ne pointe encore vers cette étude** (vérifié : les seules mentions hors `tools/` sont dans `search-index` et `search-lite`). Le hub, la navigation et les renvois depuis les cours sont explicitement le sujet d'A7.
- [x] **A3 · Lire le code de ce site (2) — la recherche.** ✅ **2026-09-02. L'étude nº 3 est écrite — et son vrai résultat est qu'elle DEMANDE À L'APPRENANT DE METTRE EN DÉFAUT LA MESURE QU'ELLE VIENT DE PUBLIER : le rapport annoncé passe de 61× à 45× quand on compte le travail oublié, mesuré en appliquant la correction, pas estimé.**

  **A · CE QUI EST LIVRÉ**

  | | |
  |---|---|
  | `pages/etude-recherche.html` | l'étude nº 3, **43 750 octets**, 6 sections ancrées, 9 blocs de code dont **exactement 1 exécutable** |
  | `tools/etudes/recherche/mesures.js` | mesure l'index réel : taille des deux fichiers, clefs, couples, et **recalcule l'économie de l'encodage** en réécrivant la même entrée sous forme naïve |
  | `tools/etudes/recherche/banc.js` | le banc publié : décode une **vraie entrée de l'index** avec la fonction `postings` extraite de `js/recherche.js`, puis compare balayage et index sur un corpus reproductible |
  | `tools/etudes/recherche/assembler.js` | 4 repères de lignes vérifiés (début ET fin), banc exécuté, **modification appliquée et rejouée**, et refus de publier si le rapport ne change pas |
  | `tools/preuves/etude-recherche.js` | la preuve, **23ᵉ étape de `verif.js`** hors mode rapide |

  **Les chiffres publiés, tous mesurés** : index complet **3,96 Mo**, index réduit **767 Ko**, **1 592 documents**, **43 911 mots distincts**, **901 711 couples mot × leçon**. Sur l'entrée témoin (`hoisting`), l'encodage en écarts base 36 fait **38 % de moins** que des identifiants absolus en base 10.

  **B · CE QUI EST PROUVÉ** — Chrome headless, `file://`, DNS coupé :

  | affirmation | mesure |
  |---|---|
  | « ces extraits sont ceux de `js/recherche.js` » | **3 publiés / 3 retrouvés tels quels** |
  | « la fonction du banc est celle du site » | `postings`, **18 lignes, identique** une fois l'indentation retirée |
  | « voici ce qu'il affiche » | **25 lignes publiées / 25 rendues, 0 écart** |
  | « le rapport tombe de 61× à 45× » | solution publiée appliquée au banc publié dans le navigateur : **61 → 45**, les deux chiffres |
  | hors réseau | **0 requête distante**, 0 exception |

  **Épreuve d'injection faite**, trois fautes d'un coup : un chiffre de la sortie (`61` → `70`), le rapport annoncé (`45` → `50`), et une valeur du décodage (`var prev = 0` → `1`). **Trois fautes vues**, la troisième signalée à la fois par les 6 lignes de leçons décalées et par le contrôle d'identité de `postings`.

  **C · DEUX CHOSES TROUVÉES EN MESURANT, ET QUI ONT CHANGÉ LA PAGE**

  1. **La page est indexée dans l'index dont elle parle — et il fallait prouver que la boucle converge.** Le mot témoin `hoisting` était dans 6 leçons ; depuis que cette étude l'emploie, il est dans **7**, la 7ᵉ étant la page elle-même (document nº 1543, vérifié dans `search-index.js`). Assembler la page change donc l'index, qui change les chiffres de la page. **Bouclé pour de vrai : assembler → régénérer → assembler… l'index redevient identique octet pour octet au 3ᵉ tour.** Le point fixe est atteint, il est publié dans la page avec sa date, et l'encadré qui l'explique enseigne la règle générale : *quand un outil produit une donnée dont il dépend, cherche le point fixe et prouve qu'il existe*.
  2. **Le mot « document » au SINGULIER dans un commentaire français fait disparaître le bouton « Tester ».** `js/runner.js` refuse d'exécuter un bloc contenant `document`, `window`, `require`… et la regex ne demande pas de délimiteur de mot à gauche : « chaque mot de chaque document. » suffit. Mesuré au premier assemblage : **9 blocs, 0 exécutable** au lieu de 1. Le test de `runner.js` est désormais **recopié dans les deux assembleurs d'études**, qui refusent de publier un banc non exécutable — le piège ne peut plus passer en silence.

  **D · CONTRÔLES.** `verif.js --rapide` **vert (14 étapes, 141,3 s)** · `verif-html.js --tous` **1 778 fichiers, 0 GRAVE, 0 ATTENTION** · `verif-donnees.js` **25 contrôles, 0 erreur** · `verif-rendu.js` sur la page **6 mesures, 0 erreur** (aucun CSS neuf : les classes `.etude-*` d'A1 ont resservi une deuxième fois) · `node --check` sur les 4 fichiers JS neufs · 0 BOM, 0 mojibake, 0 URL de CDN · `search-index`/`search-lite` au point fixe, **1 592 documents**.

  🔵 **Toujours à A7** : aucune page du site ne pointe vers les trois études ; elles ne se rejoignent que par la recherche et par les liens qu'elles se font entre elles.
- [x] **A4 · Un programme mal écrit, et sa réécriture.** ✅ **2026-09-02. L'étude nº 4 est écrite — et elle ne dit jamais « c'est plus propre » : elle applique QUATRE changements réels aux DEUX versions et publie ce qu'ils coûtent, y compris le quatrième, où c'est la version mal écrite qui gagne (4 lignes en 2 endroits contre 7 en 3).**

  **A · CE QUI EST LIVRÉ**

  | | |
  |---|---|
  | `pages/etude-reecriture.html` | l'étude nº 4, **53 635 octets**, 8 sections ancrées, 9 blocs de code dont **exactement 1 exécutable** |
  | `tools/etudes/reecriture/v1.js` · `v2.js` | le même besoin écrit deux fois — un relevé de facturation pour 4 pays (remises, port, TVA, arrondis). Écrits pour l'occasion : **aucun code tiers recopié** |
  | `tools/etudes/reecriture/jeu.js` | 14 commandes de vitrine (publiées dans la page) + un tirage à graine fixe, paramétrable en pays et en quantités |
  | `tools/etudes/reecriture/metriques.js` | 7 comptages sur un source JS, **commentaires et chaînes retirés d'abord** — sans quoi le `if` d'un commentaire compterait comme une décision |
  | `tools/etudes/reecriture/modifs.js` · `modif4.js` · `modif5.js` | 5 changements applicables aux deux versions, avec un diff (plus longue sous-séquence commune) qui compte lignes **et endroits non contigus** |
  | `tools/etudes/reecriture/mesurer.js` | produit **tous** les chiffres de la page en exécutant : équivalence, métriques, coût des changements, oublis, pile, arrondi |
  | `tools/etudes/reecriture/banc.js` | le banc publié : où arrondit-on ? |
  | `tools/etudes/reecriture/assembler.js` | relit les sources, exécute tout, et **refuse d'écrire** si une affirmation de la page ne se reproduit pas |
  | `tools/preuves/etude-reecriture.js` | la preuve, **24ᵉ étape de `verif.js`** hors mode rapide |

  **B · CE QUI EST MESURÉ, ET PUBLIÉ TEL QUEL**

  | mesure | version 1 | version 2 |
  |---|---:|---:|
  | lignes de code effectives | 93 | **103** (la réécriture est PLUS longue) |
  | fonctions · plus longue | 1 · 93 l. | 23 · 20 l. |
  | imbrication · points de décision | 5 · 31 | 3 · 13 |
  | nombres écrits en clair | 58 (21 distincts) | 7 |
  | endroits qui testent le pays | 9 | 0 |
  | cadres de pile quand un centime s'arrondit | 15 | **22** (le prix de l'indirection) |

  **Équivalence prouvée** : **10 000 commandes** tirées à graine fixe, les deux sorties comparées caractère par caractère → **0 écart**.

  **Coût des 4 changements, patchs appliqués et rejoués** (les deux versions doivent rendre les mêmes chiffres, sinon l'assemblage échoue) : ajouter un pays **6 l./3 endroits vs 3 l./1** · changer un taux **4/2 vs 2/1** · ajouter un palier **4/1 vs 3/1** · **déplacer un avantage client 4 l./2 endroits vs 7 l./3** — la v1 gagne, parce que ce changement coupe en travers du découpage de la v2. L'assembleur **refuse de publier** si ce 4ᵉ résultat s'inversait : la page affirmerait le contraire de la mesure.

  **C · TROIS CHOSES TROUVÉES EN MESURANT**

  1. **Oublier un des trois endroits ne provoque AUCUNE erreur.** En retirant un patch à la fois : **178, 160 et 4** commandes sur 1 000 facturées faux, sans une seule exception. Le plus rare est le plus dangereux — 4 pour mille, c'est ce qu'aucun test ne rattrape.
  2. **Le `else` fourre-tout facture l'Espagne au taux suisse** : **66,38 €**, relevé d'apparence normale. La v2, elle, s'arrête net (`TypeError`). Les deux comportements sont publiés côte à côte.
  3. **Déplacer un arrondi « sans rien changer » change 2 478 commandes sur 10 000** (24,8 %), au plus 2 centimes chacune, **25,02 € cumulés**. Invisible à la relecture ; visible en comparant deux sorties.

  **D · CE QUE LA PREUVE VÉRIFIE** — Chrome headless, `file://`, DNS coupé, **rien n'est relu sur le disque** : les trois blocs (jeu, v1, v2) sont pris **dans le HTML** et exécutés dans le navigateur.

  | affirmation | mesure |
  |---|---|
  | « voici ce que le programme imprime » | **72 lignes publiées / 72 rendues, 0 écart** |
  | « la version 2 rend la même sortie » | les deux textes publiés, exécutés : **identiques** |
  | « le banc affiche ceci » | **18 / 18, 0 écart** |
  | prose ⇄ bloc de mesures | 2 478 des deux côtés |
  | hors réseau | **0 requête distante, 0 exception** |

  **Épreuve d'injection faite**, trois fautes d'un coup : un chiffre de la sortie (`42.10` → `42.19`), une constante du code publié (`REMISE_FIDELITE = 3` → `4`) et le chiffre de la prose (`2478` → `2500`). **Trois fautes vues** (4 messages), la première avec sa ligne exacte. Page restaurée **octet pour octet par réassemblage**.

  **Trouvé par la preuve, et corrigé à la source** : le bloc de mesures portait **deux fois le même libellé** « commandes dont le total change » pour deux mesures différentes (l'exercice : 37 ; l'arrondi : 2 478), et le contrôle comparait la prose au mauvais chiffre. Libellés distingués, et la preuve ne cherche plus que dans sa section.

  **E · CONTRÔLES.** `verif.js --rapide` **vert (21 étapes, 140,3 s)** · `verif-html.js --tous` **1 779 fichiers, 0 GRAVE, 0 ATTENTION** · `verif-donnees.js` **25 contrôles, 0 erreur** · `verif-rendu.js` sur la page **6 mesures, 0 erreur, 0 avertissement** (aucun CSS neuf : les classes `.etude-*` d'A1 servent une troisième fois) · `node --check` sur les 8 fichiers JS neufs · 0 BOM, 0 mojibake, 0 URL de CDN · `search-index`/`search-lite` régénérés, **1 593 documents** (point fixe atteint en une passe).

  🔵 **Toujours à A7** : aucune page du site ne pointe vers les quatre études.
- [x] **A5 · Lire un algorithme historique.** ✅ **2026-09-02. L'étude nº 5 lit l'algorithme d'Euclide étendu COMME DU CODE — et son résultat le plus utile est qu'un algorithme de vingt-trois siècles se vérifie exactement comme le reste : 90 000 paires confrontées à une force brute qui ne sait rien d'Euclide, 0 écart, et 3 familles d'entrées où il ment sans lever d'erreur.**

  **A · CE QUI EST LIVRÉ**

  | | |
  |---|---|
  | `pages/etude-euclide.html` | l'étude nº 5, **39 722 octets**, 7 sections ancrées, 8 blocs de code dont **exactement 1 exécutable** |
  | `tools/etudes/euclide/algo.js` | les 4 fonctions (soustraction, reste, étendu, inverse modulaire), **73 lignes**, chacune avec son invariant et sa décroissance écrits |
  | `tools/etudes/euclide/mesures.js` | confronte Euclide à une **référence bête** (tous les diviseurs essayés), vérifie Bézout, cherche le pire cas, compare reste et soustraction, teste les inverses |
  | `tools/etudes/euclide/domaine.js` | les bords : ce que le code rend hors de son domaine, puis un garde-fou et la preuve qu'il ne casse rien |
  | `tools/etudes/euclide/banc.js` | le banc publié : Bézout, le pire cas, et **un RSA minuscule dont la clé privée sort de l'algorithme** |
  | `tools/etudes/euclide/assembler.js` | vérifie que les paires **nommées dans les phrases** sont celles que la mesure désigne, et refuse d'écrire sinon |
  | `tools/preuves/etude-euclide.js` | la preuve, **25ᵉ étape de `verif.js`** hors mode rapide |

  **B · CE QUI EST MESURÉ**

  | affirmation | mesure |
  |---|---|
  | « Euclide dit la même chose que la force brute » | **90 000 paires, 0 écart** |
  | « l'identité de Bézout tient » | **90 000 vérifiées, 0 fausse** (plus grand \|u\| rencontré : 149) |
  | « le pire cas, ce sont deux Fibonacci consécutifs » | **(89, 55) · (987, 610) · (6765, 4181)** — et c'est **le programme** qui calcule la suite et le confirme, pas l'œil |
  | « sur Fibonacci, le reste ne gagne rien » | (46368, 28657) : **22 tours avec le reste, 22 avec la soustraction** — le quotient y vaut toujours 1 |
  | « ailleurs, il gagne tout » | pgcd(1000000, 1) : **1 tour contre 999 999** |
  | « il sert à fabriquer une clé privée » | RSA jouet : **d = 2753** en 5 tours, 65 → 2790 → **65** |
  | inverses modulo 1009 et 1000 | **1008 et 400 attendus, autant trouvés, 0 faux** |

  **C · CE QUE L'ÉTUDE APPORTE ET QUE LES QUATRE PRÉCÉDENTES N'AVAIENT PAS**

  1. **La méthode de lecture d'une boucle en deux phrases** — ce qui ne change pas (l'invariant) dit pourquoi c'est juste, ce qui décroît dit pourquoi ça s'arrête. Appliquée aux 4 fonctions.
  2. **« Constater d'abord, nommer ensuite »** : le pire cas est *cherché par le programme*, puis rattaché au théorème de Lamé — et la page se corrige elle-même en précisant que **18 paires** atteignent le record à 10 000, pas seulement celle de Fibonacci.
  3. **Le domaine de validité, qui n'est écrit nulle part.** Mesuré aux bords : un négatif rend un « plus grand diviseur commun » **NÉGATIF** (l'invariant tient, la spécification non) ; **au-delà de 2⁵³** l'identité de Bézout devient fausse et l'entrée est déjà altérée ; `pgcd(10.5, 3)` rend **1.5**. Garde-fou de 3 lignes : **4 familles hors domaine refusées sur 4**, **90 000 paires rejouées, 0 résultat changé**.

  **D · CE QUE LA PREUVE VÉRIFIE** — Chrome headless, `file://`, DNS coupé. Le code est pris **dans le HTML** et jugé par une **force brute écrite dans la preuve elle-même** : sans référence indépendante, on ne vérifierait Euclide que par Euclide.

  **14 400 paires jugées, 0 écart de pgcd, 0 identité fausse, 96 inverses modulo 97 tous justes** · banc **21 lignes publiées / 21 rendues, 0 écart** · prose ⇄ banc : d, message et chiffré identiques · **0 requête distante, 0 exception**.

  **Épreuve d'injection faite**, trois fautes : une condition du code publié (`r.d !== 1` → `!== 2`, dans le SEUL bloc complet), un chiffre de la sortie publiée (2753 → 2757) et le chiffre de la prose (2753 → 2751). **Les trois vues** (4 messages), page restaurée **octet pour octet par réassemblage**. ⚠️ Au premier essai, le motif d'injection `var reste = a - q * b;` existait **3 fois** dans la page (fichier complet, extrait, banc) — le piège du motif trop large, évité en injectant dans une tranche délimitée.

  **E · CONTRÔLES.** `verif.js --rapide` **vert (21 étapes, 140,3 s)** · `verif-html.js --tous` **0 GRAVE, 0 ATTENTION** · `verif-donnees.js` **25 contrôles, 0 erreur** · `verif-rendu.js` **6 mesures, 0 erreur, 0 avertissement** · `node --check` sur les 6 fichiers JS neufs · 0 BOM, 0 mojibake, 0 URL de CDN · `search-index`/`search-lite` régénérés, **1 594 documents**, point fixe atteint.

  🔵 **Toujours à A7** : les cinq études ne sont reliées qu'entre elles.
- [x] **A6 · Lire du code dans un langage qu'on ne connaît pas.** ✅ **2026-09-02. La voie nº 2 du relevé a été retenue et appliquée : « ce qui se devine » n'est plus une impression, c'est un compte — 39 langages de programmation, 20 marqueurs, 10 364 blocs de code. Et l'étude publie du Go SANS jamais prétendre savoir ce qu'il affiche.**

  **Mesure de départ, reproduite** : `go version` et `rustc --version` ne répondent toujours pas ; seuls Node et Python sont installés. Le relevé de la passe précédente tient. La voie nº 3 (installer un compilateur) reste écartée.

  **A · CE QUI EST LIVRÉ**

  | | |
  |---|---|
  | `pages/etude-inconnu.html` | l'étude nº 6, **58 031 octets**, 7 sections ancrées, 6 blocs de code dont **exactement 1 exécutable** |
  | `tools/etudes/inconnu/mesure-langages.js` | l'outil qui COMPTE : relit les 1 523 leçons, extrait 12 919 blocs, en garde 10 364 d'au moins 5 lignes, les range par langage et y cherche 20 marqueurs |
  | `tools/etudes/inconnu/inventaire.go` | le programme lu, **115 lignes** de Go écrites pour l'occasion (aucun code tiers) |
  | `tools/etudes/inconnu/transcription.js` | sa transcription JavaScript exécutable, chaque règle d'impression de Go écrite en commentaire |
  | `tools/etudes/inconnu/modif.js` | la modification demandée à l'apprenant, exécutée à l'assemblage pour produire la sortie attendue |
  | `tools/etudes/inconnu/assembler.js` | refuse d'écrire si un chiffre du texte ne colle plus à la mesure — **et si l'avertissement disparaît** |
  | `tools/preuves/etude-inconnu.js` | la preuve, **26ᵉ étape de `verif.js`** hors mode rapide |

  **Aucun CSS neuf** : les classes `.etude-*` d'A1 et `.etude-choix` d'A4 ont suffi. `verif-rendu.js` : **6 mesures (3 largeurs × 2 thèmes), 0 erreur, 0 avertissement**, sans correctif de contraste.

  **B · CE QUE LA MESURE DONNE** — et ce chiffre-là n'existait nulle part :

  | | |
  |---|---:|
  | marqueurs présents dans **les 39 langages** | **3** — un commentaire, des lignes indentées, une chaîne entre guillemets |
  | marqueurs à **38 / 39** | **3** — parenthèses, appel `nom(arguments)`, `=` qui affecte — et il leur manque **le même** langage |
  | l'accolade, qu'on croit universelle | **32 / 39** |
  | le point-virgule en fin de ligne | **23 / 39** |
  | le langage qui manque le plus de marqueurs | **l'assembleur : 15 sur 20** (2ᵉ : COBOL, 11) |
  | Prolog | ni mot pour « fonction », ni « si », ni boucle |

  **C · LA MESURE A MENTI TROIS FOIS, ET C'EST LE VRAI RÉSULTAT DU POINT**

  1. **Le mot « si » d'un commentaire FRANÇAIS compté comme mot-clé.** La première version effaçait les commentaires de tous les langages pareil (`//`, `#`, `--`). Les commentaires de l'assembleur commencent par un `;` seul, non reconnu : `jge .fin ; si i >= 5, sortir` faisait passer nasm pour un langage doté d'un `if`, et le marqueur ressortait **présent partout, sans exception**. Il a fallu donner à chaque langage **ses** marques de commentaire — le `;` qui commente en assembleur *termine* une instruction en C. Après correction : **37 / 39**.
  2. **Un fan-out adversarial de 4 agents a rendu 16 griefs sur l'outil, dont 5 bloquants**, et ils étaient justes. `clike` n'est pas un langage : c'est la classe de repli de la coloration, sous laquelle le site mélange **137 blocs de cinq langages** (l'essentiel du **Zig**, plus du Rust, du C, du Protocol Buffers, un schéma Prisma) — publier « 40 langages » était donc faux, c'est **39**, et le Zig n'apparaît nulle part faute d'étiquette à lui (défaut de balisage des leçons, signalé dans la page). `void` faisait passer un type de retour pour un mot désignant une fonction, et `sub ecx, 8` — la SOUSTRACTION de l'assembleur — aussi ; `do` faisait de `defmodule … do` d'Elixir, qui n'a aucune boucle, un langage à boucle. Le marqueur « == ou = » ne cherchait jamais le `=` seul, celui de Pascal et d'Ada. Le marqueur « type après le nom » attrapait le ternaire de C et le `for (int n : notes)` de Java. Tout cela est corrigé, marqueur par marqueur, et **ce qui a été retiré de chaque liste est écrit dans le fichier** : c'est le sujet même de l'étude — un mot-clé qui existe dans plusieurs langages n'y a pas le même sens.
  3. **Mon propre filtre était trop large, exactement comme le prévient la règle du chantier.** Écarter les pages de redirection en cherchant `http-equiv="refresh"` n'importe où écartait aussi `pages/html/lecon-35.html` — 41 Ko, 10 blocs — dont le seul tort est d'**enseigner** cette balise, échappée. Deux conditions au lieu d'une (balise non échappée **et** fichier minuscule) : on passe de 90 pages écartées à 89, et le compte tombe sur **1 523 leçons — le nombre exact que publie la page d'accueil**. L'assembleur relit désormais ce nombre dans `index.html` et refuse d'écrire s'ils divergent.

  **D · TROIS BUGS RÉELS DANS LA TRANSCRIPTION, DÉMONTRÉS PAR EXÉCUTION** (mêmes agents, axe transcription) :

  - `var stock = {}` héritait de `Object.prototype` : un article nommé `toString` valait une **fonction** que `|| 0` laissait passer, et l'addition devenait une **concaténation** (`function toString() { [native code] }5`) ; un article `__proto__` **disparaissait** du rapport. Une map de Go n'a aucune clé héritée → `Object.create(null)`. *C'est le même piège que l'étude nº 1 avait déjà mesuré.*
  - `goPrintf` convertissait les sauts de ligne **après** substitution des arguments : une ligne de journal citant un chemin Windows se coupait en deux dans son propre message d'erreur. La conversion se fait maintenant sur le format seul.
  - `strconv.Atoi` acceptait `99999999999999999999` là où Go rejette la ligne, et arrondissait silencieusement au-delà de 2⁵³ — un solde **faux sans aucune erreur**. Bornes ajoutées ; au-delà du domaine exact de JavaScript, la transcription **refuse** plutôt que de répondre faux.
  - `%q` n'échappait pas les caractères de contrôle : complété. Il reste **une** approximation, écrite dans la page plutôt que tue : les « blancs » du découpage sont ceux de JavaScript, qui diffèrent de ceux de Go sur deux caractères exotiques.

  **Quatre affirmations du programme Go ont aussi été corrigées** : « pas d'exception dans ce langage » (`panic`/`recover` existe, mais est réservé aux fautes de programmation) ; `defer` « quoi qu'il arrive » (`os.Exit` l'en empêche) ; « valeur zéro de son type » (du type des **valeurs** — et le `make` n'est pas facultatif, écrire dans une map nulle fait paniquer) ; la majuscule qui exporte (vraie, mais **sans effet observable ici**, un paquet `main` n'étant importable par personne). **L'axe « le Go compile-t-il » a rendu 0 grief.**

  **E · CE QUE LA PREUVE VÉRIFIE** — Chrome headless, `file://`, DNS coupé. Son contrôle central ne porte pas sur un chiffre mais **sur une phrase** : la page doit DIRE qu'aucun compilateur Go n'a tourné. Une sortie non prouvée publiée sans cet aveu serait précisément la faute qui a fondé cette chaîne de chantiers.

  **Go publié = fichier `.go` : 115 lignes / 115, 0 écart** · **tableau des marqueurs : 20 lignes retrouvées / 20, 0 discordance** avec la mesure recalculée · banc **10 lignes publiées / 10 rendues, 0 écart** · prose ⇄ banc : nombre de lignes et dernière ligne concordants · modification : même nombre de lignes, mêmes articles, colonne MVTS présente · **0 requête distante, 0 exception**.

  **Épreuve d'injection faite, 3 fautes, 3 vues** : un chiffre du tableau (39 → 38, injecté dans une **tranche délimitée** — le piège du motif trop large, `39` figurant partout), une ligne de la sortie publiée (solde 5 → 6), et **l'avertissement retiré**. Page restaurée octet pour octet.

  **F · CONTRÔLES.** `verif.js --rapide` **vert (16 étapes, 155,0 s)** · `verif-html.js --tous` **0 GRAVE, 0 ATTENTION** · `verif-donnees.js` **25 contrôles, 0 erreur** · `verif-rendu.js` **6 mesures, 0 erreur, 0 avertissement** · `node --check` sur les 6 fichiers JS neufs · 0 BOM, 0 URL de CDN · `search-index`/`search-lite` régénérés, **71 → 72 pages transverses**, point fixe atteint.

  🔵 **Toujours à A7** : les six études ne sont reliées qu'entre elles.

- [x] **A7 · Le hub des études de cas** et les renvois depuis les cours concernés. ✅ **2026-09-02. Les six études ne sont plus orphelines : hub, entrée de menu sur les 1 782 pages, encarts sur 8 cours, et retour au hub depuis chacune — le tout vérifié DANS LE NAVIGATEUR, parce que ces chemins n'existent dans aucun fichier HTML.**

  **Mesure de départ, reproduite** : avant ce point, `grep` sur `index.html`, `pages/` et `js/` → **0 page du site ne pointait vers une étude**. On ne les rejoignait que par la recherche. Les six comptes rendus d'A1 à A6 le signalaient chacun ; le point était bien à faire.

  **A · CE QUI EST LIVRÉ**

  | | |
  |---|---|
  | `pages/etudes.html` | le hub, **13 734 octets**, 6 cartes + « comment lire une étude » en 4 temps |
  | `tools/etudes/hub.js` | l'assembleur du hub : il **extrait** les titres et les numéros des 6 pages d'étude, refuse d'écrire si le dossier `pages/` et sa table ne listent pas les mêmes études, si les numéros ne se suivent pas, ou **si le chiffre mis en avant sur une carte ne se retrouve pas dans la page** |
  | `tools/etudes/hub-gabarit.html` | le gabarit, sans un seul titre d'étude recopié |
  | `js/main.js` | une entrée de plus dans `MENU` → « Études de cas » apparaît sur **toutes** les pages, `aria-current` compris sur les pages `etude-*` |
  | `js/cours.js` | table `ETUDES` + `renderEtudeLink()` : l'encart « Étude de cas » sur les cours concernés, sur le moule exact des fils rouges (un cours peut en porter **plusieurs**) |
  | `css/pages.css` | **aucune règle neuve** : `.start-card__etude` ajouté aux 4 sélecteurs groupés existants |
  | `index.html` | une carte dans « Outils » + une ligne dans le pied de page |
  | les 6 gabarits d'étude | le fil d'Ariane ramène au hub — les 6 pages **réassemblées**, pas éditées à la main |
  | `tools/preuves/etudes-hub.js` | la preuve, **27ᵉ étape de `verif.js`** hors mode rapide |

  **B · POURQUOI CE POINT AVAIT BESOIN D'UNE PREUVE DANS LE NAVIGATEUR.** Les deux chemins qui comptent le plus n'existent **dans aucun fichier HTML** : le menu est reconstruit à l'exécution par `initMainNav` (il déduit la profondeur du chemin depuis le lien « Accueil »), et les encarts sont posés par `renderEtudeLink`. Un `grep` ne verrait rien, et un contrôle de source rendrait un vert qui ne veut rien dire. La preuve ouvre donc les pages pour de bon.

  | ce qui est affirmé | mesure |
  |---|---|
  | « le hub liste toutes les études » | **6 cartes / 6 études sur le disque**, 0 lien mort |
  | « le menu y mène de partout » | testé aux **4 profondeurs de chemin** — racine, `pages/`, `pages/<cours>/cours.html`, `pages/<cours>/lecon-01.html` — 4/4, avec le bon nombre de `../` |
  | « les cours concernés y renvoient » | 8 cours, **11 encarts**, chacun avec le compte attendu (js 2, algo 2, patterns 2, crypto/go/tests/bdd/compilation 1) |
  | « et seulement eux » | **2 cours témoins** (cobol, ux) : **0 encart**. Sans témoin, un encart posé partout passerait pour vert. |
  | « on peut revenir » | fil d'Ariane → hub sur les **6 études, 6/6** |
  | hors réseau | **0 requête distante, 0 exception** |

  **Épreuve d'injection faite, 3 fautes, 3 vues** : l'entrée de menu retirée de `main.js` (vue aux 4 profondeurs d'un coup), un cours retiré de la table de `cours.js` (`crypto` → « 0 encart, 1 attendu »), et le retour au hub retiré d'une étude. Fichiers restaurés, `git status` inchangé.

  **C · DEUX CHOSES QUE LES OUTILS ONT ATTRAPÉES, ET PAS MOI**

  1. **Le contrôle du hub a rejeté mes propres chiffres au premier essai.** J'avais écrit sur les cartes des formules de mémoire (« 19 lignes publiées », « 6 publiés / 6 retrouvés ») : aucune n'existait telle quelle dans les études. L'assembleur a refusé d'écrire. Deux causes distinctes — des formules qui n'étaient dans aucune page, et des chiffres bien présents mais écrits avec une **espace insécable** (`90&nbsp;000`), invisible à une comparaison brute. Le contrôle normalise désormais les insécables, et les six formules citées sont celles des pages.
  2. **Le menu passe de 7 à 8 entrées** — un vrai risque de débordement horizontal, que rien dans le code ne signale. `verif-rendu.js` lancé sur **les 13 pages touchées** — le hub, l'accueil, les 8 pages de cours qui portent un encart et trois études : **84 mesures (13 pages × 3 largeurs × 2 thèmes), 0 erreur, 0 avertissement**.

  **D · CONTRÔLES.** `verif.js --rapide` **vert (16 étapes, 156,7 s)** · `verif-html.js --tous` **1 782 fichiers, 0 GRAVE, 0 ATTENTION** · `verif-donnees.js` **25 contrôles, 0 erreur** · `node --check` sur `main.js`, `cours.js`, `hub.js`, `etudes-hub.js` · accolades de `pages.css` **1 517 / 1 517** · 0 BOM, 0 URL de CDN · `verif-rendu.js` **84 mesures, 0 erreur** · `search-index`/`search-lite` régénérés, **72 → 73 pages transverses**, point fixe atteint.

  ✅ **La phase A est close** : 7 cases sur 7, six études de cas écrites, prouvées et désormais **atteignables**.

---

## PHASE B — Voir un programme s'exécuter

Le site explique la pile d'appels dans 48 leçons et ne la montre jamais. `js/visualisations.js` prouve
pourtant que la technique est maîtrisée : il instrumente un algorithme en une liste d'étapes, puis
rejoue l'animation. Il ne sait faire que les tris.

- [x] **B1 · Choisir la technique, en la mesurant.** ✅ **2026-09-02. Le mini-interpréteur est écrit ET PROUVÉ : 116 programmes exécutés DEUX FOIS — dans le moteur maison et dans un vrai processus Node —, 367 lignes de sortie comparées, 21 893 pas d'exécution, 0 écart. Mais le vrai résultat de ce point n'est pas ce zéro : c'est que le premier corpus était DÉJÀ vert (62 programmes, 0 écart) quand quatre relectures adversariales ont écrit 145 autres programmes et trouvé 67 écarts, soit 25 causes racines.**

  **Mesures de départ, reproduites** : `js/visualisations.js` ne sait générer que **6** séquences (5 tris + recherche binaire), toutes écrites à la main ; **50** leçons parlent de la pile d'appels (le plan en annonçait 48 — le site a grossi depuis), **24** de récursivité, **163** de fermetures, **13** de la boucle d'événements ; **1** seule leçon montre quelque chose « pas à pas ». `grep` sur `CHANTIER-V14.md` : **0** occurrence d'« interpréteur » — le V14 n'en a pas produit, il a embarqué Pyodide et sql.js. Il n'y avait donc rien à réutiliser.

  **A · LA RECOMMANDATION, ET POURQUOI ELLE NE TIENT PAS À UNE PRÉFÉRENCE.** Option **(a), le mini-interpréteur** — écrit dans `js/interpreteur.js` (2 200 lignes, UMD, zéro dépendance, ni `eval` ni `new Function`).

  Le critère qui tranche n'est ni la puissance ni la longueur : c'est la **vérifiabilité**.
  - **(c) scénarios pré-enregistrés** : une liste d'étapes écrite à la main *est une affirmation*. Rien ne distingue, à la lecture, un scénario juste d'un scénario qui a l'air juste — exactement ce qui a laissé passer les cinq exemples faux sous quatre vérificateurs verts. Et la technique ne franchit pas B4/B5 : on n'enregistre pas « une fermeture ».
  - **(b) réécriture du source + vrai moteur** : plus courte, mais elle interdit ce que les points B4 et B5 réclament. On ne peut pas lire **de l'extérieur** l'environnement capturé par une fermeture, ni l'ordre réel des microtâches : le moteur ne les expose pas.
  - **(a) mini-interpréteur** : on possède la chaîne des portées, la pile, les deux files de tâches — donc on peut les **montrer**. Et surtout, son résultat se **confronte à une vérité de terrain** : le vrai moteur JavaScript. C'est la seule des trois qui se réfute.

  **B · L'OUTIL DE PREUVE.** `tools/verif-interpreteur.js` exécute chaque programme deux fois. Le témoin n'est **pas** un bac à sable `vm` : c'est un **vrai processus `node`**, avec sa vraie boucle d'événements et ses vrais minuteurs — un ordonnancement inventé ne passerait pas. Les deux côtés formatent avec la **même** fonction (`Interpreteur.representer`, chargée par le témoin lui-même), donc un écart est toujours sémantique et jamais cosmétique. Modes : `--seul=`, `--fichier=` (un programme quelconque), `--trace` (cohérence de la trace), `--navigateur`.

  **C · LA CONTRADICTION, ET CE QU'ELLE A RENDU.** Corpus initial : **62 programmes, 0 écart**. Quatre agents ont alors reçu une seule consigne — *prouver que l'interpréteur est faux* — sur quatre domaines. Résultat : **145 programmes écrits, 67 en écart, 25 causes racines.** Les plus graves :
  - **`for (var … of …)` créait une portée par tour** : il affichait `10 20 30` là où le vrai moteur affiche `30 30 30`. Le visualiseur montrait **à l'envers** le piège des fermetures que le cours enseigne.
  - **L'ordre d'évaluation d'une affectation était inversé**, et la référence évaluée **deux fois** : `b[i++] += 100` lisait `b[0]` et **écrivait dans `b[1]`**. Pas un affichage faux — une écriture dans la mauvaise case mémoire.
  - **La zone morte temporelle**, revendiquée en tête du fichier, ne protégeait que la lecture : `C = 7` avant `const C = 1` passait en silence *et déverrouillait la constante*.
  - **Aucune conversion d'objet** (`ToPrimitive`) : `[5] * 2` rendait `NaN`, et `[] == false` / `[1] == 1` — les deux exemples que tout cours cite contre `==` — rendaient `false`.
  - **`.finally(f)` n'appelait jamais `f`** ; **un rejet non traité** était ignoré alors que Node s'arrête ; **l'aplatissement d'une promesse** coûtait un tour de microtâche au lieu de deux ; **les délais `setTimeout`** n'étaient pas ramenés à 1 ms.
  - **`call` / `apply` / `bind` n'existaient pas** — dans le visualiseur de `this`.
  - **`var x;` sans initialiseur écrasait** la valeur existante, y compris une fonction hissée.
  - Un agent a aussi démoli **l'outil** : sa promesse « un écart est toujours sémantique » était fausse, `representer` n'étant pas symétrique entre nos instances et celles de Node ; et `this` au plus haut niveau comparait un *script* à un *module*.

  **D · CE QUI A ÉTÉ CORRIGÉ, ET CE QUI NE L'EST PAS.** Tout ce qui précède est corrigé, côté moteur comme côté outil. Les **50 contre-exemples** sont versés dans `tools/preuves/interpreteur-contre-exemples.js`, chacun avec la faute qu'il a révélée en commentaire — un test dont on oublie la raison finit par être « corrigé » dans le mauvais sens. **Trois limites restent, assumées et déclarées** : les méthodes `toString`/`valueOf` écrites par l'apprenant (la conversion arrive hors de la machine à pas → le moteur **refuse bruyamment** au lieu d'afficher « [object Object] » en silence), et le texte source exact d'une fonction. L'outil **vérifie que ces trois-là s'écartent toujours** : le jour où l'une cesse de s'écarter, la limite a disparu et la documentation est périmée.

  **E · CONTRÔLES.** `verif-interpreteur.js --trace --navigateur` : **116 programmes, 367 lignes comparées, 21 893 pas, 0 écart, 3 limites tenues, 0 trace incohérente** · **116 programmes rejoués dans Chrome sans fenêtre, en `file://`, sans serveur → 0 écart avec Node** (`tools/preuves/interpreteur-navigateur.html`) · `verif-html.js --tous` **1 782 fichiers, 0 GRAVE, 0 ATTENTION** · `verif-donnees.js` **25 contrôles, 0 erreur** · `node --check` sur les 3 fichiers JS neufs · **0 BOM**, **0 URL de CDN** ajoutée (le dépôt en compte toujours 7, toutes pédagogiques ou documentaires) · ni `eval`, ni `new Function`, ni module ES.

  **F · CE QUI RESTE À B2.** Le moteur produit déjà, pour chaque pas : la ligne courante, la pile d'appels avec la ligne de chaque cadre, la chaîne complète des portées avec la valeur de chaque variable (et la mention « non initialisée » en zone morte), et le nombre de lignes affichées à cet instant. B2 n'a plus qu'à **montrer** cette trace.
- [x] **B2 · L'affichage.** ✅ **2026-09-02. La page existe, et elle est la première du site dont l'AFFICHAGE est confronté pas à pas au moteur, dans un vrai Chrome : 6 exemples pilotés, 227 pas cliqués, 908 comparaisons page ⇄ moteur, 221 reculs joués, 182 contrôles de défilement, 0 écart. Et le vérificateur lui-même a été mis à l'épreuve : 10 fautes injectées dans `js/execution.js`, 10 vues — mais seulement après correction d'un angle mort que la 1re passe de mutation a révélé.**

  **A · CE QUI EST LIVRÉ.** `pages/execution.html` + `js/execution.js` (visualiseur) + `js/execution-exemples.js` (6 programmes) + ~380 lignes de CSS `.vex-*` dans `pages.css` + un jeton `--surface-inset-2` dans `variables.css`. Le code à gauche, la ligne courante surlignée ; à droite la pile d'appels (dernier appelé en haut), les variables **portée par portée** avec leur valeur, et ce qui a été affiché. Boutons **Début · Précédent · Suivant · Tout dérouler**, plus les **flèches du clavier**. Une phrase en français explique chaque pas (« *appel* — `decrire(7)` », « *retour* — `doubler` retourne 14 »).

  **B · UN CHOIX D'ARCHITECTURE QUI SE JUSTIFIE PAR UN BOUTON.** Le visualiseur n'exécute rien : le moteur a tout exécuté et rendu une **trace**, une liste de pas. C'est ce qui rend « pas **précédent** » possible — un moteur qu'on met en pause ne sait pas revenir en arrière, une liste si. La séparation permet aussi de prouver les deux moitiés séparément : le moteur par `verif-interpreteur.js`, l'affichage par `verif-execution.js`.

  **C · CE QUE MESURE `tools/verif-execution.js`** (client CDP maison, la **vraie** page ouverte en `file://`, les **vrais** boutons cliqués — une page d'essai prouverait que le code marche, pas que la page l'emploie) : à chaque pas, la ligne surlignée, la hauteur de la pile, le nombre de lignes affichées **et la liste des variables avec leurs valeurs** sont comparés à la trace recalculée dans Node ; la **réversibilité** (avancer de N pas puis reculer de N doit rejouer la même suite à l'envers) ; « Tout dérouler » atteint bien le dernier pas et la sortie affichée y est **exactement** celle du programme ; un programme invalide affiche un message **qui cite sa ligne** ; **0 requête hors `file://`** et **0 erreur de console**.

  **D · LE VERT A ÉTÉ MIS À L'ÉPREUVE, ET IL A CÉDÉ UNE FOIS.** `tools/verif-execution-mutations.js` injecte 10 fautes connues (ligne décalée d'un cran, sortie figée, « Précédent » qui ne recule pas, « Tout dérouler » qui revient au début, un cadre de pile perdu, une erreur qui ne s'affiche plus, le clavier mort, les portées effacées, la fenêtre de code qui ne défile plus, le compteur qui ment d'une unité) et exige que chacune fasse rougir le vérificateur. **Première passe : 8 vues sur 9.** La faute passée inaperçue — « les portées ne sont plus dessinées » — a montré que le vérificateur *comptait* les portées sans jamais *comparer* leur contenu : un panneau entièrement vide passait pour vert. Corrigé (comparaison nom par nom, valeur par valeur), puis une 10ᵉ faute ajoutée avec le contrôle qui va avec, **seconde passe : 10/10**.

  **E · TROIS DÉFAUTS TROUVÉS PAR LA MESURE, PAS PAR LA RELECTURE.**
  1. **Le défilement automatique visait le mauvais conteneur** (`elLignes.parentNode` au lieu de `elLignes`, la boîte qui défile étant la liste elle-même) — et il mesurait avec `offsetTop`, faux dès que l'ancêtre positionné n'est pas celui qu'on croit. Corrigé avec `getBoundingClientRect`, et gardé par le 9ᵉ contrôle de mutation. Un 6ᵉ exemple **plus long que l'écran** a été ajouté au sélecteur, sans quoi ce contrôle n'aurait jamais rien mesuré : la fenêtre ne défilait pas.
  2. **Six erreurs de contraste**, relevées par `verif-rendu.js` : `--surface-inset` est **sombre dans les deux thèmes**, et j'y avais posé du texte `--ink-3` (2,66:1, seuil 4,5). Réaligné sur les jetons prévus, `--ink-on-dark` / `--ink-on-dark-2`.
  3. **La règle globale `:not(pre) > code` de `base.css`** donne à tout code en ligne une pastille CLAIRE (fond, bordure, marge). Sur fond sombre, cela mettait du texte clair sur une pastille claire : **1,04:1**. Trois passes de mesure ont été nécessaires — les deux premières corrections portaient sur les mauvais éléments, parce que je raisonnais sur le CSS que j'avais écrit au lieu de lire le style **calculé**. Une sonde jetable dans Chrome a tranché en une mesure : `background: rgb(239,234,222)` sur le `<code>` lui-même. Neutralisé. Le voile translucide essayé entre-temps a été remplacé par un jeton opaque `--surface-inset-2`, dont les contrastes sont **calculés et non estimés** : 9,35:1 en thème clair, 13,16:1 en sombre.

  **F · CONTRÔLES.** `verif-execution.js` **6 exemples, 227 pas, 908 comparaisons, 221 reculs, 182 contrôles de défilement, 16 requêtes toutes en `file://`, 0 erreur de console, 0 problème** · `verif-execution-mutations.js` **10/10 fautes vues** · `verif-rendu.js` sur la page **6 mesures (3 largeurs × 2 thèmes), 0 erreur**, et **--echantillon 20 pages / 120 mesures, 0 erreur** après modification de `variables.css` · `verif-html.js --tous` **1 783 fichiers, 0 GRAVE, 0 ATTENTION** · `verif-donnees.js` **25 contrôles, 0 erreur** · `node --check` sur les 4 fichiers JS neufs · accolades **1 577 / 1 577** (`pages.css`) et **12 / 12** (`variables.css`), aucune variable `var(--x)` inexistante · **0 BOM**, **0 URL de CDN** · `search-index` / `search-lite` régénérés, **73 → 74 pages transverses**, point fixe atteint · la page est liée depuis l'accueil (l'orphelinat était l'erreur que la phase A a dû réparer).

  **G · CE QUI RESTE À FAIRE.** Les 6 exemples sont volontairement élémentaires : B3 (récursivité), B4 (portée, fermetures, `this`) et B5 (asynchrone) ajouteront les leurs à `js/execution-exemples.js`, et chacun sera automatiquement piloté par `verif-execution.js`. B6 posera les liens depuis les leçons (`execution.html#identifiant` charge déjà l'exemple visé).
- [x] **B3 · La récursivité.** ✅ **2026-09-02. Six programmes récursifs au visualiseur, et surtout un contrôle qui exige qu'ils MONTRENT quelque chose : la pile doit monter à 3 cadres au moins, puis redescendre à 1. La plus haute mesurée atteint 221 cadres. 12 exemples pilotés, 710 pas cliqués, 2 840 comparaisons page ⇄ moteur, 0 écart.**

  **A · LES SIX PROGRAMMES**, tous exécutés avant d'être publiés — aucune sortie n'est écrite de tête :
  | id | ce qu'il montre | sortie mesurée | pile max |
  |---|---|---|---:|
  | `recursion-somme` | un cas d'arrêt, un appel plus petit, rien d'autre | `13` | 5 |
  | `factorielle` | cinq cadres s'empilent avant le moindre calcul | `120` | 6 |
  | `fibonacci` | deux appels par cadre ; le programme compte lui-même ses appels | `fib(6) = 8` puis `appels : 25` | 7 |
  | `hanoi` | deux appels autour d'un déplacement | `7 coups` puis `A->C A->B C->B A->C B->A B->C A->C` | 5 |
  | `arbre` | la profondeur de la pile **est** la hauteur de l'arbre | `1 3 6 8 10 14` puis `hauteur : 3` | 6 |
  | `recursion-sans-fin` | le cas d'arrêt est faux : la pile grossit jusqu'à céder | `RangeError` ligne 5 | **221** |

  **B · LE POINT QUI COMPTE : `recursion-sans-fin` DOIT échouer.** Un exemple dont l'erreur est le contenu ne peut pas être traité comme un exemple cassé. Il le déclare (`erreurAttendue: "RangeError"`) et `verif-execution.js` **exige** alors l'erreur, son type, **et** que la page l'affiche avec son numéro de ligne — un exemple qui cesserait d'échouer serait tout aussi faux qu'un exemple qui casse.

  **C · UN CONTRÔLE QUI EMPÊCHE UN EXEMPLE DE NE RIEN MONTRER.** Ajouter des programmes ne prouve pas qu'ils enseignent la récursivité. Le vérificateur mesure donc, sur chaque exemple du groupe, la **profondeur maximale de la pile** (≥ 3 exigés) et le fait qu'elle **redescende à 1**. Mis à l'épreuve : en remplaçant `fact(5)` par `fact(1)`, il répond « *factorielle : la pile ne dépasse pas 2 cadres — cet exemple ne montre aucune récursivité* ». Sans ce contrôle, un exemple dégradé serait resté au catalogue en n'enseignant rien.

  **D · CONTRÔLES.** `verif-execution.js` **12 exemples, 710 pas, 2 840 comparaisons, 698 reculs, 383 contrôles de défilement, 6 exemples récursifs (pile la plus haute : 221 cadres), 0 requête hors `file://`, 0 erreur de console, 0 problème** · `verif-execution-mutations.js` **10/10 fautes vues** · `verif-rendu.js` sur la page **6 mesures, 0 erreur** · `verif-html.js --tous` **1 783 fichiers, 0/0** · `verif-donnees.js` **25 contrôles, 0 erreur** · `node --check` · **0 BOM** · index de recherche **identiques** (aucun contenu de leçon touché).
- [x] **B4 · Portée, fermetures, `this`.** ✅ **2026-09-02. Sept programmes de plus, et le panneau des portées devient l'argument : `this` y figure comme une variable ordinaire — ce qu'il est. 19 exemples pilotés, 869 pas cliqués, 3 476 comparaisons page ⇄ moteur, chaîne de portées la plus longue mesurée : 5 niveaux, 0 écart.**

  **A · LES SEPT PROGRAMMES**, tous exécutés avant publication :
  | id | ce qu'il montre | sortie mesurée |
  |---|---|---|
  | `portee-chainee` | trois portées empilées, le nom cherché de la plus proche à la plus lointaine | `global > externe > interne` |
  | `portee-bloc` | le même nom dans trois portées différentes | `bloc`, `fonction`, `global` |
  | `fermeture-compteur` | `faireCompteur` a rendu la main, et son `n` existe encore — deux compteurs indépendants | `1 2 3` puis `1` |
  | `let-vs-var` | **le** piège de la boucle | `var : 3 3 3` / `let : 0 1 2` |
  | `zone-morte` | le nom existe déjà dans la portée, mais est inutilisable tant qu'il n'est pas initialisé | `ReferenceError` ligne 4 |
  | `this-methode` | `this` en méthode, en fonction fléchée, en fonction nue | `compteur = 1`, `compteur = 2`, `flechee : compteur`, `nue : undefined` |
  | `this-impose` | `call`, `apply`, `bind` — et une fonction liée qui **ne change plus jamais** de `this` | `Bonjour, Ada` · `Salut, Alan` · `Coucou, Ada` · `Et maintenant, Ada` |

  **B · CE QUE LE VISUALISEUR APPORTE ICI, ET QU'UN TEXTE NE PEUT PAS.** `this` n'est pas expliqué : il est **affiché**, dans la portée de fonction, à côté des paramètres. Un apprenant qui voit `this = { nom: 'Ada' }` changer de valeur d'un appel à l'autre n'a plus besoin qu'on lui dise que « `this` dépend de la manière dont on appelle ». De même, `zone-morte` montre la variable **présente et marquée « non initialisée »** avant sa déclaration : la zone morte cesse d'être une formule.

  **C · DEUX CONTRÔLES DE PLUS, ET TOUS DEUX MIS À L'ÉPREUVE.**
  - **La chaîne des portées doit exister** (2 niveaux au minimum) et, pour les exemples qui l'annoncent (`montreThis`), une portée doit afficher `this` **avec une valeur**.
  - **Certains exemples n'existent que pour l'ÉCART entre deux de leurs lignes** (`lignesDifferentes`). Si `let-vs-var` se mettait à afficher deux fois la même chose, il enseignerait le contraire de son titre. Épreuve : en remplaçant `let j` par `var j`, l'outil répond « *les deux lignes censées différer disent la même chose — « var : 3 3 3 » / « let : 3 3 3 »* ».

  **D · CONTRÔLES.** `verif-execution.js` **19 exemples, 869 pas, 3 476 comparaisons, 850 reculs, 484 contrôles de défilement, 6 exemples récursifs (pile max 221), 7 exemples de portée (chaîne max 5), 1 contraste exigé, 0 requête hors `file://`, 0 erreur de console, 0 problème** · `verif-execution-mutations.js` **10/10 fautes vues** · `verif-rendu.js` **6 mesures, 0 erreur** · `verif-html.js --tous` **1 783 fichiers, 0/0** · `verif-donnees.js` **25 contrôles, 0 erreur** · `node --check` · **0 BOM**.
- [x] **B5 · L'asynchrone.** ✅ **2026-09-02. Le visualiseur montre désormais LES DEUX FILES, à chaque pas — et c'est ce qui manquait : sans elles, on voyait bien qu'une microtâche s'exécutait, jamais POURQUOI elle passait devant un minuteur inscrit plus tôt. 26 exemples pilotés, 1 040 pas, 5 200 comparaisons page ⇄ moteur, 0 écart ; 12/12 fautes injectées vues.**

  **A · CE QUI A ÉTÉ AJOUTÉ AU MOTEUR.** Chaque pas de la trace porte maintenant l'état des deux files : le nombre de **microtâches** en attente, et la liste des **minuteurs** rendue *dans l'ordre où la boucle les prendra* — échéance croissante, puis ordre d'inscription. Un nouveau panneau les affiche, avec le prochain minuteur mis en avant.

  **B · LES SEPT PROGRAMMES**, tous exécutés avant publication :
  | id | ce qu'il montre | sortie mesurée |
  |---|---|---|
  | `async-ordre` | le minuteur à 0 ms arrive **bon dernier** | `1 · 2 · 3 microtâche · 4 minuteur` |
  | `async-microtaches-dabord` | toutes les microtâches, **puis** un seul minuteur | `synchrone · micro 1-2-3 · macro 1-2` |
  | `async-chaines-paralleles` | trois chaînes avancent **d'un cran chacune, à tour de rôle** | `synchrone · a1 b1 c1 a2 b2 c2` (file de microtâches à **3**) |
  | `async-minuteurs` | la file se réordonne toute seule | `a - 0 ms · b - 10 ms · c - 20 ms` |
  | `async-await` | la pile de la fonction **disparaît** pendant l'attente, puis revient | `debut · la suite ne l'a pas attendue · recu 10 · recu 20 · total 30` |
  | `async-then-promesse` | rendre une promesse dans un `then` coûte **deux** tours, pas un | `A1 · B1 · B2 · B3 · A2 · B4` |
  | `async-rejet` | un rejet que personne n'attrape **arrête le programme** | `debut · fin du script`, puis `Error` |

  **C · LE CONTRÔLE QUI VAUT LE PLUS.** Le panneau affirme : « *la boucle d'événements vide TOUTES les microtâches avant de reprendre un seul minuteur* ». L'outil vérifie cette phrase — à chaque pas de genre « tâche », le compteur de microtâches doit valoir **zéro**. Si le moteur reprenait un minuteur trop tôt, le visualiseur enseignerait le contraire de ce qu'il affiche. S'y ajoute la comparaison, pas par pas, des deux files affichées avec celles du moteur, et l'exigence que chaque exemple asynchrone les **exerce** vraiment.

  **D · UN CHIFFRE QUI A FAIT AJOUTER UN PROGRAMME.** La première mesure donnait « microtâches en attente max : **1** » : une chaîne de `.then` n'en met qu'une à la fois dans la file, donc le panneau n'aurait jamais rien eu à montrer. D'où `async-chaines-paralleles`, trois chaînes indépendantes, qui fait monter la file à **3**. Sans la mesure, le panneau serait resté décoratif.

  **E · CONTRÔLES.** `verif-execution.js` **26 exemples, 1 040 pas, 5 200 comparaisons, 1 014 reculs, 525 contrôles de défilement, 6 récursifs (pile max 221), 7 de portée (chaîne max 5), 7 asynchrones (microtâches max 3, minuteurs max 3), 0 requête hors `file://`, 0 erreur de console, 0 problème** · `verif-execution-mutations.js` **12/12** · `verif-interpreteur.js --trace --navigateur` rejoué après modification du moteur : **116 programmes, 0 écart, 3 limites tenues, 0 écart Chrome ⇄ Node** · `verif-rendu.js` **6 mesures, 0 erreur** · `verif-html.js --tous` **1 783 fichiers, 0/0** · `verif-donnees.js` **25 contrôles, 0 erreur** · accolades **1 590 / 1 590** · balises de la page **47 / 47** · **0 BOM**.
- [x] **B6 · Relier aux leçons.** ✅ **2026-09-02. 19 leçons mènent au visualiseur avec l'exemple pré-chargé — et 23 leçons qui parlaient pourtant du sujet en ont été ÉCARTÉES à dessein. 53 liens vérifiés dans un vrai Chrome, 8 mises en garde exigées, 6 témoins négatifs tenus, 8/8 fautes injectées vues. Un défaut réel trouvé au passage : la page ne réagissait pas à un changement d'ancre.**

  **A · LE CHOIX DES LEÇONS EST UNE MESURE, PAS UNE INTUITION.** Une recherche dans le CORPS des leçons rendait plus de 100 candidates, presque toutes hors sujet (`Promise` apparaît dans presque toute leçon de Node). La recherche dans le **titre** — c'est-à-dire les leçons dont c'est le SUJET — en rend **42**. C'est de cette liste qu'on part.

  **B · ET 23 DE CES 42 SONT ÉCARTÉES, PARCE QUE LE VISUALISEUR EXÉCUTE DU JAVASCRIPT.** L'`asyncio` de Python, les coroutines de Kotlin, les acteurs de Swift, le `core.async` de Clojure, la récursion de Prolog ou de Haskell **ne se ramènent pas** à la pile d'appels et à la boucle d'événements de JavaScript. Y renvoyer aurait enseigné un modèle faux. Trois de ces exclusions sont inscrites comme **témoins négatifs** dans le vérificateur, avec leur raison : le jour où quelqu'un ajoutera `python/lecon-26` à la table, l'outil rougira en rappelant pourquoi elle n'y était pas.

  **C · CE QUI RESTE : 19 LEÇONS**, dont **8 hors famille JavaScript** (`algo`, `compilation`, `pascal`, `lua`, `perl`, `swift`, `dart`, `groovy`) — des langages dont la pile d'appels et les fermetures se comportent vraiment comme celles de JavaScript. Pour celles-là, l'encart le **dit** : « *le visualiseur exécute du JavaScript : la syntaxe diffère de ce cours, le mécanisme est le même* ». Une leçon Pascal qui renverrait vers du JS sans le dire serait un piège — et l'outil exige cette phrase, comme il exige son ABSENCE sur les 11 leçons de la famille JavaScript.

  **D · POURQUOI IL A FALLU OUVRIR LES PAGES.** L'encart n'existe dans **aucun** fichier HTML : `js/lecon.js` le construit à l'exécution et déduit sa profondeur (`../`) de l'URL courante. Un `grep` sur les pages rendrait zéro ; un `grep` sur la table rendrait un vert qui ne prouve rien. `tools/verif-execution-liens.js` ouvre donc **les 19 leçons et les 6 témoins** dans Chrome et lit le DOM obtenu — c'est exactement la leçon du point A7.

  **E · UN DÉFAUT RÉEL, TROUVÉ PAR L'OUTIL ET NON À LA RELECTURE.** La page ne réagissait **pas** à un changement d'ancre : `execution.html#autre` sur une page déjà ouverte ne rechargeait rien, donc revenir en arrière dans l'historique laissait l'apprenant sur l'exemple précédent. Corrigé par un écouteur `hashchange`, et l'outil essaie désormais trois ancres.

  **F · LE VÉRIFICATEUR MIS À L'ÉPREUVE.** `tools/verif-execution-liens-mutations.js` injecte 8 fautes dans `js/lecon.js` — identifiant inexistant, titre recopié faux, encart jamais posé, profondeur de lien fausse, mise en garde retirée, encart posé **partout**, un seul lien dessiné, libellés vidés. **8/8 vues.**

  **G · CONTRÔLES.** `verif-execution-liens.js` **19 leçons ouvertes, 53 liens, 8 mises en garde, 6 témoins négatifs, 3 ancres, 0 problème** · `verif-execution-liens-mutations.js` **8/8** · `verif-execution.js` **26 exemples, 0 problème** · `verif-rendu.js` sur `js/lecon-16`, `pascal/lecon-12` et la page du visualiseur : **12 mesures, 0 erreur** · `verif-html.js --tous` **1 783 fichiers, 0/0** · `verif-donnees.js` **25 contrôles, 0 erreur** · `node --check` sur `lecon.js` et `execution.js` · accolades **1 592 / 1 592** · `search-index` régénéré, **point fixe atteint**.

  🏁 **La phase B est close : 6 cases sur 6.** Le site n'explique plus seulement la pile d'appels dans 50 leçons — il la montre, et 19 d'entre elles y mènent.

---

## PHASE C — Les mathématiques de l'informatique

Cours neuf, **un module par case**, environ 13 leçons. Il ne s'agit pas d'un cours de mathématiques :
il s'agit des mathématiques **dont on se sert**, chacune reliée à un endroit du site où elle sert
déjà. Chaque notion s'accompagne de code qui la met en œuvre — et ce code est **exécuté** avant
d'être publié.

Ce cours est aussi la fondation manquante de trois cours du V13 : la cryptographie a besoin de
l'arithmétique modulaire, les réseaux de neurones de l'algèbre linéaire et des dérivées, les systèmes
distribués de la théorie des graphes.

- [x] **C1 · Module 1 — Logique et booléens** (3 leçons). ✅ **2026-09-02. Le cours `maths` existe, et ses 21 blocs de sortie sont ce que l'apprenant obtient EN CLIQUANT dans un vrai Chrome — 21 blocs cliqués, 0 divergence. La relecture adversariale a rendu 48 défauts, dont un chiffre du cours qui était faux parce que le PROGRAMME comptait mal.**

  **Mesure de départ, reproduite** : `js/data.js` déclarait **88 cours, 0 de mathématiques** — ni dans les `id`, ni dans les titres, ni dans les `language`. Le point était bien à faire.

  **CE QUI A ÉTÉ PRODUIT, MESURÉ** : `lecon-01` « Propositions, connecteurs et tables de vérité » **6 319 mots** (52 min, 56 Ko) · `lecon-02` « Les lois de l'algèbre de Boole, et De Morgan » **5 833** (50 min, 55 Ko) · `lecon-03` « Ce qu'un `if` complexe veut vraiment dire » **6 065** (54 min, 64 Ko). Total **18 217 mots visibles**. Par leçon : **1 schéma SVG**, **1 antisèche**, **10 termes de glossaire**, **3 exercices**, **4 à 7 encadrés**, **5 ou 6 questions de QCM**, plus un **bilan de module de 10 questions** sur la leçon 3. `verif-contenu --cours=maths` : **0 sous le standard, 0 maigre, 0 redondance de prose**, rythme **106 mots/minute** (médiane du site : dans la plage).

  **LES BLOCS PUBLIÉS SONT LES FICHIERS EXÉCUTÉS, PAR CONSTRUCTION.** Les 21 programmes vivent dans `scratchpad/v15-c1/code/` ; un générateur (`gen.js`) les insère dans les pages **et exécute chacun avec le formateur exact du Web Worker de `runner.js`** pour produire le bloc de sortie voisin. Aucune recopie à la main, donc aucune divergence possible entre le publié et le réel. Contrôles : `verif-sorties` **21 rejoués, 21 identiques au caractère près**, `verif-clic` **21 boutons « Tester » cliqués dans Chrome, 0 divergence, 0 fragment, 0 bloc sans sortie**.

  **⚠️ DEUX BLOCS AFFICHAIENT UNE ERREUR AU CLIC, ET SEULE LA MESURE L'A VU.** `formes.js` (leçon 2) levait `ReferenceError: estAdmin is not defined` et `garde-api.js` (leçon 3) `SyntaxError: Illegal return statement` : deux fragments d'illustration sur lesquels `runner.js` pose pourtant un bouton. Le premier est devenu de la prose, le second un programme complet qui teste la garde sur **6 utilisateurs**. C'est ce qui fait passer le compte de « 21 cliqués, 1 sans sortie, 1 illustration » à **21 cliqués, 0 non jugé**.

  **48 DÉFAUTS TROUVÉS PAR RELECTURE ADVERSARIALE, TOUS REVÉRIFIÉS PAR MOI AVANT CORRECTION** (3 relecteurs en lecture seule, un par leçon, chargés de démolir ; 3 programmes de contre-vérification dans `scratchpad/v15-c1/contre-l*.js`). Les plus graves :
    – **le compteur du programme mentait, dans une leçon dont la thèse est qu'on ne publie pas un chiffre non mesuré.** `lois.js` additionnait 2ⁿ à chaque proposition, y compris quand la comparaison s'était arrêtée au premier écart : il annonçait **4 lignes** pour des réfutations qui n'en avaient regardé que **2**, et un total de **78** pour **76** réellement évaluées. Le programme a été corrigé — il compte désormais ce qu'il a fait — et la **réciproque** a été ajoutée comme second témoin négatif, puisque l'antisèche la donnait comme vérifiée sans qu'elle l'ait jamais été. Nouveau relevé, publié : **19 propositions, 17 vérifiées, 2 réfutées, 78 lignes réellement évaluées**, dont **74 pour les seules lois** ;
    – **le schéma de De Morgan ne dessinait rien de ce que son texte alternatif promettait.** Aucune hachure, aucun remplissage : le seul élément accentué était un doublon du disque A en `fill-opacity="0"`, donc un **contour bleu autour de A seul** — un lecteur en déduisait ¬(A∧B) = A. Les deux panneaux dessinaient les mêmes cercles, et le fond opaque de `.d-box` effaçait la lentille d'intersection. Refait avec un **masque SVG** qui peint vraiment la zone ; vérifié **au pixel** (`pixels-svg.js` sérialise le SVG avec ses styles calculés, le dessine dans un canvas et lit 7 points) : **7/7 conformes** — A seul peint à gauche et nu à droite, lentille nue des deux côtés ;
    – **un trait barrait un titre** dans le schéma de la leçon 3 (pointillé à y=168, encre du titre y∈[169,176], segment vertical x=95 tombant dans le mot), et l'ordre 2 n'avait **qu'une flèche sur deux** : la boîte « TypeError » n'avait aucune entrée. Corrigé et recapturé ;
    – **les champs de réponse ne correspondaient pas à leur exercice.** `lecon.js` pose le champ n° i sous l'énoncé n° i ; les entrées 2 et 3 des **trois** leçons portaient sur autre chose. Le pire : sous un exercice dont la solution dit explicitement « ce n'est pas l'absorption », le champ demandait « absorption ». Les 6 entrées ont été réécrites ;
    – **`document.all` est une neuvième valeur fausse**, et c'est un objet : la leçon 3 affirmait « tout le reste est vrai, sans exception » et « tout objet est vrai ». Mesuré dans un vrai Chrome sur la page elle-même. Le programme ne pouvait pas le voir — il tourne dans un worker sans `document` —, ce qui est devenu un encadré : *un programme ne mesure que ce que son environnement contient* ;
    – **« 5 lignes sur 16, toutes celles où l'utilisateur est banni »** : il y a **8** lignes bannies et **5** écarts ; sur 3 d'entre elles la condition refusait déjà pour une autre raison. Le défaut était donc invisible sur une partie des cas qu'il concerne — ce qui vaut d'être dit ;
    – **la table de vérité présentée comme « le seul moyen de prouver »**, sans sa condition de validité : elle énumère les combinaisons *comme si les variables étaient indépendantes*. Mesuré : `age >= 18 && age >= 21` et `age >= 21` coïncident sur les **201 âges de 0 à 200**, alors que leur table diffère sur une ligne — impossible dans la réalité. Un encadré le dit maintenant ;
    – **deux options de QCM désignaient des positions** (« les deux premières réponses ») alors que `lecon.js` mélange les options à chaque affichage, et **trois distracteurs étaient factuellement vrais** ; **un `accept` refusait la réponse que son propre indice dictait** (« coalescence des nuls ») ; **un énoncé était syntaxiquement ambigu** (« A et B ou C » — l'autre lecture donne 7 cas sur 16 au lieu de 3), dans la leçon même qui apprend à repérer cette ambiguïté ;
    – et une série d'affirmations trop larges, toutes mesurées : « on peut **toujours** essayer toutes les lignes » (2⁴⁰ = 1 099 511 627 776), « `||` est le ou inclusif **dans tous les langages** » (en SQL, `SELECT 1 || 1` rend `'11'`), « presque toujours vrai » pour `18 < age < 65` (**toujours** vrai, mesuré sur 14 valeurs dont NaN et les infinis), « `&&` convertit en booléen » (`0 && 1` rend `0`), « le ET est un produit et le OU une somme, ils se comportent comme tels » (le OU distribue sur le ET, la somme non), et six superlatifs sans mesure.

  **⚠️ UNE LEÇON DE MÉTHODE, PAYÉE COMPTANT** : ma première lecture de la capture du schéma corrigé m'a fait croire qu'il peignait encore la mauvaise zone. C'est la mesure au pixel qui a tranché — l'image était juste, mon œil non. Une capture se regarde ; elle ne se juge pas à l'œil seul.

  **INTÉGRATION, COMPLÈTE** : `js/data.js` (cours en `apercu`, **5 modules / 13 leçons** dont 10 en `bientot`, durées 52/50/54, parcours **`fondamentaux`** en tête), **5 `related` réciproques** (`algo`, `crypto`, `neurones`, `distribue`, `stats`), accent **`#702070` / `#e0a8dc`**, logo (une table de vérité au trait), catalogue (« Outils, pratiques & transversaux »), projet contextualisé (« Un vérificateur de conditions pour les revues de code »), page de cours. **L'accent a été mesuré, pas choisi** : recherche systématique sur la grille RGB sous contrainte de contraste et de chroma, puis distance CIELAB contre les **88** teintes claires et les **89** sombres — le couple retenu est à **dE 21,6** de son plus proche voisin en clair (`julia`) et **14,4** en sombre (`elixir`), contrastes **8,22 à 9,44** et **7,83 à 9,47** sur les fonds réels. **Compteurs** : 88 → **89 cours**, 1523 → **1526 leçons**, 80 → **81 langages**, i18n EN comprise — et la phrase « **tous** entièrement rédigés » de l'accueil et du catalogue, qui devenait fausse, dit maintenant « dont 88 entièrement rédigés ».

  **CE QUE LE NAVIGATEUR AFFICHE POUR UN COURS EN APERÇU**, mesuré avec une progression **semée** dans `localStorage` (`verif-cours-progression.js`) : **3 leçons cliquables**, **10 marquées « Bientôt »**, **0 lien mort**, progression **0/13** à vide puis **3/13** semée, la leçon 3 annonce « Suivant → Bientôt disponible » avec **un seul** lien de navigation, la leçon 1 annonce « Début du cours ». **Tous les contrôles passent.**

  **VERDICT** : `verif.js --rapide` **tout vert (157,9 s)** · `verif-html --tous` **1 787 fichiers, 0/0** · `verif-donnees` **25 contrôles, 0 erreur** (l'avertissement restant, `zig`, préexiste) · `verif-rendu` sur les 4 pages du cours **24 mesures, 0 erreur, 0 avertissement**, plus 30 mesures sur les pages transverses touchées · `verif-clic` **21/21** · `verif-sorties` **21/21** · `verif-stockage` **25/25** · les **3 `run.expect`** confirmés en rejouant la solution publiée avec le juge exact de `lecon.js` · `node --check` sur les 5 JS touchés · **0 BOM, 0 mojibake, 0 URL de CDN**. Index régénérés : quiz **+26**, flashcards **+30**, antisèches **+3** (purge `--fresh` : 3 légendes périmées par les corrections traînaient dans l'index), pièges **+3**, recherche **1 526 leçons**.

  **CE QUI RESTE POUR C2 À C6** : le cours reste en `status: "apercu"` tant que les modules 2 à 5 ne sont pas écrits. `courses.lessons` vaut **3** (exigé par I3, qui compte les leçons réelles) tandis que la fiche de cours annonce **13** : le catalogue dira donc « 3 leçons » et la page de cours « 13 » — les deux sont vrais dans leur contexte, le badge du hero le dit explicitement (« 3 leçons sur 13 »), mais **c'est à revoir si l'écart gêne**. Le générateur `scratchpad/v15-c1/gen.js` et les outils écrits ici (`pixels-svg.js`, `verif-expect.js`, `verif-cours-progression.js`, `capture-svg.js`) resservent tels quels aux modules suivants.
- [x] **C2 · Module 2 — Ensembles, dénombrement, probabilités** (3 leçons). ✅ **2026-09-03. 18 741 mots, 18 blocs cliqués dans un vrai Chrome sans une divergence — et 91 défauts rendus par la relecture adversariale, dont une COURBE qui ne suivait pas sa propre fonction et un « 50 % » né d'un arrondi de 0,7 à 1.**

  **CE QUI A ÉTÉ PRODUIT, MESURÉ** : `lecon-04` « Ensembles : ce que `Set` sait faire, et ce qu'il coûte » **5 507 mots** (48 min, 52 Ko) · `lecon-05` « Compter sans énumérer » **6 770** (50 min, 61 Ko) · `lecon-06` « Probabilités, collisions et paradoxe des anniversaires » **6 464** (52 min, 67 Ko). **18 programmes** exécutés avant rédaction, **18 blocs de sortie**, 3 schémas, 3 antisèches, 33 termes de glossaire, 16 questions de QCM, 9 exercices, et un **bilan de 14 questions** qui couvre désormais les deux modules — celui du module 1 a été retiré de `lecon-03`, I12 n'admettant qu'un bilan par cours, et **4 de ses questions y sont reprises**. `verif-contenu --cours=maths` sur les 6 leçons : **0 sous le standard, 0 maigre, 0 redondance**.

  **CONTRÔLES** : `verif-clic` **18 boutons cliqués dans Chrome, 0 divergence, 0 fragment** · `verif-sorties` **18/18 identiques au caractère près** · `verif-html --tous` **0/0** · `verif-donnees` **25 contrôles, 0 erreur** · `verif-rendu` **24 mesures, 0 erreur, 0 avertissement** · `verif.js --rapide` **tout vert** · rendu du cours en aperçu avec progression semée : **6 leçons cliquables, 7 « Bientôt », 0 lien mort, 0/13 puis 6/13**. Un contrôle neuf (`verif-chiffres.js`) confronte les nombres cités dans la PROSE aux sorties publiées&nbsp;: il a trouvé un « 31 769 » qui ne venait d'aucun programme de la page — il en vient d'un maintenant.

  **91 DÉFAUTS TROUVÉS PAR RELECTURE ADVERSARIALE** (3 relecteurs en lecture seule, un par leçon), **tous revérifiés par programme avant correction** (`contre-l4.js`, `contre-l5.js`). Les plus graves :
    – **la courbe du paradoxe des anniversaires avait été tracée à l'œil.** Mesurée : jusqu'à **4,85 points** au-dessus de la vraie probabilité, franchissant 50 % à n = 21,8 au lieu de 23, s'aplatissant précisément là où la pente est maximale, et ne passant pas par l'intersection de ses propres repères. Elle est désormais **calculée point par point** (`svg-l6.js`, 71 points, prolongement continu par lnΓ), et le script **mesure et imprime son propre écart** : **0,041 point**, franchissement à **22,76**, soit la valeur exacte ;
    – **« il faut descendre à 0,001 % pour qu'une alerte sur deux dise vrai » était un artefact d'arrondi** : `Math.round(0.7)` valait 1, d'où un « 50,0 % » qui vaut en réalité 58,8 %. Le vrai taux est **0,0014 %**, et le facteur annoncé passe de 1 000 à **700** ;
    – **`1 - Math.exp(...)` rendait ZÉRO EXACT sur 4 cellules du tableau des collisions** — le verdict « négligeable » n'était juste que par accident. Corrigé en `-Math.expm1(...)`, qui rend 9,4 × 10⁻³² là où l'autre rendait 0. Ironie : le paragraphe qui expliquait cette précaution se trompait de moitié du problème ;
    – **MD5 n'est pas tombé par recherche d'anniversaire**, mais par cryptanalyse différentielle à ~2³⁹, des milliards de fois sous la borne générique. La leçon enseignait la bonne borne avec le mauvais exemple. Et **la distinction collision / préimage manquait** là où elle décide du sens de la phrase : « SHA-256 offre 128 bits » est faux sans « face aux collisions » ;
    – **« écarts inférieurs à 0,25 point » était une propriété de la graine**, pas de la méthode : 68,5 % des graines dépassent ce seuil. Le programme emploie désormais **une graine par valeur de n** — sans quoi les quatre lignes rejouaient le même flux — et publie l'**écart type attendu**, qui vaut 0,23 point à n = 10 mais 0,05 à n = 60 ;
    – **le contrôle de l'exercice 2 était aveugle à l'erreur qu'il prétendait attraper** : son jeu d'essai avait |A∩C| et |A∩B∩C| **nuls**, donc inverser leur signe ne changeait rien. Jeu refait, et le programme **essaie** les trois erreurs au lieu qu'on l'affirme : **3 sur 3 détectées** ;
    – **« la longueur bat l'alphabet » n'est vrai qu'à partir d'une dizaine de caractères.** Mesuré : depuis 8 minuscules, imposer symboles et chiffres multiplie l'espace par **31 769**, contre **676** pour deux caractères de plus — diversifier gagne 47 fois. La thèse, un QCM et une question d'auto-évaluation en dépendaient ; les trois sont corrigés, et le programme affiche désormais la comparaison ;
    – **l'exercice 1 de la leçon 4 n'était pas corrigible** (aucune liste dans l'énoncé, et les seules listes de la page ont 2 éléments communs quand le champ en attend 3) ; **« n = 10, trop grand pour être énuméré »** était faux — 1 024 sous-ensembles s'énumèrent en 1 ms, la vraie cause était un tableau de 5 lettres. Le programme va maintenant jusqu'à **n = 16** ;
    – **« huit minutes »** pour 1,6 milliard de comparaisons, dans la section qui vient d'interdire les chronomètres : mesuré, **3,5 s**. Retiré ;
    – et une série de corrections de fond : `SameValueZero` (NaN et −0 dans un `Set`), l'ordre d'insertion **garanti** par la norme là où la leçon disait de s'en méfier, le complémentaire sans référentiel, `git log A..B` = **B  A**, « au moins un tiroir en contient **au moins** deux », les durées **arrondies** au lieu d'être tronquées (« 1 heure » valait 1 h 50), 4 mots Diceware = **52 bits** et non 51, le 29 février qui joue dans le sens **inverse** de ce qui était écrit, trois distracteurs de QCM factuellement vrais, et deux `accept` qui refusaient la réponse dictée par leur propre indice.

  **INTÉGRATION** : `js/data.js` (3 leçons `complet`, durées 48/50/52, `lessons` 3 → 6), page de cours mise au niveau du module 2 en **10 points** (badge, méta-description, objectifs, programme, récapitulatif, glossaire, compte des blocs) — c'est le piège du V13-D3, que rien ne surveille. Compteurs **1526 → 1529 leçons**. Index régénérés : quiz **6015 → 6035**, flashcards **11 394 → 11 427**, antisèches **1566**, pièges **1899**, recherche **1529 leçons**.

  **CE QUI RESTE** : le cours garde `status: "apercu"` (6 leçons écrites sur 13). Le module 3 — arithmétique modulaire, nombres premiers, `0.1 + 0.2` — est le prochain.
- [ ] **C3 · Module 3 — Arithmétique et nombres en machine** (3 leçons) : arithmétique modulaire (→ cryptographie), nombres premiers, et **pourquoi `0.1 + 0.2 ≠ 0.3`** — la question la plus posée de toute l'informatique. **Vérifier avant d'écrire** si le site la traite déjà quelque part ; si oui, approfondir plutôt que répéter.
- [ ] **C4 · Module 4 — Graphes et matrices** (2 leçons) : représenter un réseau, une carte, un réseau de neurones. Le lien entre matrice et graphe, qui rend les deux évidents.
- [ ] **C5 · Module 5 — Croissance et complexité** (2 leçons) : ce que veut dire O(n²) quand on a un million de lignes. Chiffres réels, mesurés dans le navigateur, pas des ordres de grandeur récités.
- [ ] **C6 · Intégration** : page de cours, QCM bilan, glossaire, antisèche, projet, place dans les parcours, et **renvois croisés** depuis cryptographie, réseaux de neurones, algo et systèmes distribués.

---

## PHASE D — Lire la documentation officielle

Le site est en français. La documentation qui fait autorité est en anglais. Entre les deux, il y a un
mur que personne n'aide à franchir — et un apprenant qui ne lit pas la doc restera dépendant des
tutoriels toute sa vie.

- [ ] **D1 · Anatomie d'une page de documentation.** Une page de référence réelle, décortiquée : la signature, les paramètres, la valeur de retour, les exceptions, les notes de compatibilité, les exemples. Ce qu'on lit d'abord, ce qu'on saute.
- [ ] **D2 · Le vocabulaire minimal.** Les 80 mots anglais qui reviennent partout, avec leur sens **technique** — `deprecated`, `throws`, `optional`, `overload`, `mutable`, `race condition`… Traduction et piège associé quand il y en a un. Relier au lexique existant plutôt que d'en créer un second : **vérifier `js/lexique-data.js` avant d'écrire**.
- [ ] **D3 · Les documents normatifs.** Ce qu'est une RFC, une spécification, un changelog, une note de version. Comment on y trouve une réponse sans tout lire.
- [ ] **D4 · Chercher efficacement.** Formuler une question, lire une réponse, juger si elle est encore valable, se méfier d'une réponse de 2013 — et de ce qu'affirme un assistant sans citer sa source.

---

## PHASE E — Ce qui périme

Le revers de tout le reste. Un site de 1 400 leçons qui cite des versions vieillit sans prévenir :
**51 pages citent un numéro de version, 4 portent une date.**

- [ ] **E1 · Mesurer le périssable.** Relever toutes les affirmations datables : numéros de version, « aujourd'hui », « récemment », « la dernière version », parts de marché, chiffres de performance. Produire le tableau par cours. C'est lui qui décide de la suite.
- [ ] **E2 · La convention de datation.** Marquer une affirmation périssable de façon uniforme et discrète, sans alourdir la lecture. Décider la forme, l'appliquer d'abord sur un cours, juger le rendu, puis généraliser.
- [ ] **E3 · Le vérificateur.** `tools/verif-fraicheur.js` : signale les affirmations périssables non datées et celles dont la date dépasse un seuil. Hors réseau — il ne vérifie pas si la version est à jour, il vérifie qu'on **sait** quand on l'a écrite.
- [ ] **E4 · Passer les cours les plus exposés.** Ceux qui bougent vite en premier — frameworks, outils, cloud, conteneurs.

---

## PHASE F — Contrôle final

- [ ] **F1 · Non-régression.** Les cinq vérificateurs verts, `--strict` compris.
- [ ] **F2 · Les mathématiques rejouées.** Tous les calculs du cours de la phase C ré-exécutés depuis zéro, par un contrôle indépendant qui ne fait pas confiance à ce qui est écrit. Un chiffre faux ici est plus grave qu'ailleurs.
- [ ] **F3 · Le visualiseur, éprouvé.** Chaque exemple pré-chargé s'ouvre et se déroule jusqu'au bout, réseau coupé.
- [ ] **F4 · Mesure globale.** Études de cas publiées, notions visualisées, leçons de maths, pages datées. Comparer aux chiffres du constat en tête de ce fichier.
- [ ] **F5 · Ce qui n'a pas été fait.** Lister et expliquer, sans arrondir.

---

## Fin de chantier

Quand toutes les cases sont cochées, le wrapper déclenche la **passe de sécurité** : vérification
globale, rapport dans `VERIF-FINALE.md` avec un verdict en première ligne, puis extinction automatique
si le verdict est vert.
