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
- [x] **C3 · Module 3 — Arithmétique et nombres en machine** (3 leçons). ✅ **2026-09-03. 34 000 mots, 28 blocs cliqués dans un vrai Chrome sans une divergence — et un vérificateur neuf qui confronte les 288 chiffres de la PROSE aux sorties publiées : 0 sans source. La relecture adversariale a rendu une bonne vingtaine de défauts par leçon, dont un schéma qui pointait la mauvaise case du cadran et un chiffre spectaculaire qui ne mesurait pas ce qu'il prétendait.**

  **Mesure de départ, reproduite** : `grep` sur `pages/` → **21 leçons** mentionnent déjà `0.1 + 0.2`, et `pages/js/lecon-14` montre la structure d'un flottant 64 bits. Toutes s'arrêtent à « ne compare pas avec `===` ». Le point demandait donc d'**approfondir**, pas de répéter — ce que l'encadré d'ouverture de la leçon 9 dit explicitement à l'apprenant.

  **CE QUI A ÉTÉ PRODUIT** : `lecon-07` « Arithmétique modulaire : l'horloge des cryptographes » (52 min, 79 Ko) · `lecon-08` « Nombres premiers, PGCD et algorithme d'Euclide » (54 min, 94 Ko) · `lecon-09` « Pourquoi 0.1 + 0.2 ne fait pas 0.3 » (55 min, 93 Ko). **28 programmes** exécutés avant rédaction, 28 blocs de sortie, 3 schémas, 3 antisèches, 40 termes de glossaire, 18 questions de QCM, 9 exercices. `verif-contenu --cours=maths` sur les 9 leçons : **0 sous le standard, 0 maigre, 0 redondance**.

  **UN VÉRIFICATEUR NEUF, ET C'EST LUI QUI A LE PLUS RENDU.** `verif-chiffres.js` (versionné dans `tools/maths/module-3/`) extrait **tous** les nombres de la prose et exige que chacun soit présent dans une sortie, dans un programme publié, ou **déclaré avec sa raison**. Premier passage : **44 nombres sans source**. Après correction — en faisant calculer par les programmes ce que la prose affirmait — il en reste **0 sur 288**, et la liste des exceptions déclarées (dates, tailles de clé usuelles, deux bornes citées de la littérature) est devenue le rapport d'honnêteté de la page. Éprouvé par mutation : **3 fautes injectées, 3 vues**.

  **CE QUE LA RELECTURE ADVERSARIALE A RENDU** (3 agents en lecture seule, un par leçon), **tous revérifiés par exécution avant correction**. Les plus graves :
    – **le schéma du cadran pointait la mauvaise position.** Son texte alternatif annonçait « 17 pas mènent à la position 3 » et l'arc s'arrêtait à **199,1°** — entre la 3 (154,3°) et la 4 (205,7°), donc visuellement sur la **4** — et à **57,7 du centre au lieu de 60**, donc même pas sur le cercle. Mon propre contrôle géométrique (`geom-svg.js`, écrit pour l'occasion) ne l'avait pas vu : il comparait les textes aux traits, pas les textes **entre eux**, et l'agent a mesuré dans Chrome que les étiquettes « 3 » et « 4 » étaient **entièrement recouvertes** par la légende. Corrigé, `viewBox` agrandi, 0 alerte ;
    – **« la division ne passe pas au reste » était un homme de paille.** Le programme comparait `(a/b) mod m` à une *division de restes*, qui donne 0,5 — et concluait « 72 des 229 essais échouent ». Or la division modulo 7 existe parfaitement : le programme la refait par **multiplication par l'inverse** et obtient **229 sur 229**. Ce n'est pas l'arithmétique modulaire qui échoue, c'est l'idée de poser une division entre deux restes ;
    – **le seuil de débordement publié était faux.** La boucle ne testait que des modulos de la forme 2ᵏ−1 : elle trouvait une *largeur en bits*, pas une borne. La condition exacte est (m−1)² ≤ 2⁵³−1, soit **m ≤ 94 906 266** — 41 % plus loin que les 2²⁶ annoncés, et **à 2²⁶ le calcul est encore juste**. Au passage, sept valeurs de k étaient **comptées comme justes alors que `2ᵏ−1` n'était déjà plus représentable** : le programme comparait un nombre corrompu à lui-même, dans la section qui parle précisément de corruption silencieuse ;
    – **« il essaie TOUTES les fautes de frappe » : non.** Le banc ignorait les transpositions **à saut** (`aXb → bXa`). Ajoutées : **0 % de détection**, sur 6 312 essais pour Luhn et 4 927 pour l'ISBN-13 — les positions *i* et *i*+2 ont la même parité, donc le même poids, et la somme est rigoureusement inchangée. C'est le trou béant de ces clés, et le glossaire l'affirmait à l'envers ;
    – **1/ln(n) prédit la densité LOCALE, pas la proportion cumulée.** La leçon opposait 7,24 % prédits à 7,85 % « mesurés » et concluait à 8 % d'erreur. Les deux grandeurs sont différentes : la densité locale autour de 10⁶ vaut **7,22 %**, soit **0,3 %** d'écart avec la prédiction. Le programme publie désormais les deux colonnes ;
    – **le tableau de Fermat prouvait le contraire de ce qu'il montrait.** « Aucun imposteur ne survit aux bases 2, 3, 5 et 7 » — mais le programme note maintenant *pourquoi* chacun tombe : **8 par un vrai témoin de Fermat, 8 parce qu'une base les DIVISE**. Et les **cinq nombres de Carmichael** sous 5 000 sont tous dans la seconde catégorie : ce « 0 » est une division d'essai déguisée ;
    – **le chiffre le plus spectaculaire de la leçon 9 ne mesurait pas ce qu'il annonçait.** « 22 037 répartitions sur 30 000 échouent en euros arrondis » servait à démontrer le danger des flottants. Refait en **centimes entiers**, sans le moindre flottant : **22 037 échecs, sur exactement les mêmes cas** — ceux où le total n'est pas divisible. Les trois colonnes coïncident **30 000 fois sur 30 000**. `BigDecimal` ne changerait rien. Le programme publie les trois, et le piège dit maintenant ce qu'il prouve ;
    – **la référence de l'exercice 3 de la leçon 9 était la méthode jugée elle-même** (`exact = neumaier(petits)`), et son garde-fou ne pouvait structurellement pas se déclencher. Elle est désormais calculée en **rationnels exacts** (chaque double est un entier fois une puissance de 2, sommés en `BigInt`) : le verdict **200 / 199 / 0** est inchangé, mais il est enfin prouvé ;
    – **Kahan ne repose pas sur le lemme de Sterbenz** mais sur **Fast2Sum**, qui exige |somme| ≥ |y| — l'hypothèse que l'exercice 3 met justement en défaut trois écrans plus bas. Les deux lemmes sont maintenant mesurés dans la page : **9 942 soustractions exactes sur 9 942** dans l'intervalle de Sterbenz, et la compensation de Kahan qui vaut **0** quand un géant arrive sur une petite somme ;
    – **48,0 % et non 50,3 %** : le relevé des arrondis *calculait* `i/100 + 0.005` au lieu d'*écrire* le littéral « x,xx5 » — deux arrondis de plus, et un flottant différent dans **3 259 cas sur 10 000**. Il mesurait ce qu'on calcule, pas ce qu'on écrit ;
    – et une série de corrections de fond : **846** chiffres pour 7¹⁰⁰⁰ et non 845, **17** chiffres qui survivent à `Number` et non 12, « mille milliards » pour 10¹⁵ (c'est **un million de milliards**), l'écart de débordement qui n'est « d'une ou deux unités » que sur le jeu d'essai choisi (**68 719 476 736** mesuré sur des opérandes quelconques), le débordement d'un entier **signé** en C qui est un *comportement indéfini* et non un enroulement, `Math.random()` dont l'état de **128 bits** se reconstitue *algébriquement* et non par force brute, Euclide qui n'est pas « le plus rapide qu'on connaisse » (Stein le bat), « 14,2 fois plus vite » qui est un rapport d'**opérations** et non de temps, le relevé de 2012 qui a factorisé des **dizaines** et non des centaines de milliers de clés, l'attaque par PGCD qui coûte **10 878 étapes** et perd contre la force brute à cette échelle, le semi-premier **équilibré** que le glossaire confondait avec le semi-premier tout court, la borne 1 373 653 = **829 × 1 657** qui est le premier menteur et non la dernière valeur sûre, quatre lignes de schéma sans accents, « PGCD » développé en « plus grand diviseur commun », et six distracteurs de QCM factuellement vrais.

  **⚠️ UN DÉFAUT QUE J'AI TROUVÉ SEUL, AVANT LES AGENTS, ET QUI VALAIT LE DÉTOUR** : les **9 champs de réponse auto-corrigés** ne correspondaient pas à leur exercice. `lecon.js` pose le champ nº *i* sous l'énoncé nº *i* ; le champ de l'exercice sur l'IBAN demandait le reste de 10¹⁵ modulo 7, celui sur Diffie-Hellman un compte de multiplications, celui sur la répartition d'argent un dénombrement de fractions exactes. Les 9 ont été réécrits, et les 3 solutions publiées finissent désormais par la valeur attendue seule sur la dernière ligne : `verif-expect` confirme **3/3** avec le juge exact de `lecon.js`. C'est le même défaut qu'au module 1 — il ne suffit donc pas de l'avoir corrigé une fois, il faudrait un contrôle qui l'attrape.

  **CONTRÔLES** : `verif-clic` **28 boutons cliqués dans Chrome, 0 divergence, 0 fragment** · `verif-sorties` **67/67 sur le cours entier, identiques au caractère près** · `verif-chiffres` **288 nombres, 0 sans source** · `verif-rendu` **24 mesures sur 4 pages, 0 erreur** — il a trouvé un **débordement de 39 px à 320 px** sur la page de cours, isolé par dichotomie jusqu'à la ligne fautive (une valeur de 24 caractères insécables) · `verif.js --rapide` **tout vert, 167 s** · `verif-html --tous` **1 621 fichiers, 0/0** · `verif-donnees` **25 contrôles, 0 erreur** · rendu du cours avec progression **semée** : 9 leçons cliquables, 4 « Bientôt », 0 lien mort, 9/13 · `geom-svg` **0 alerte** · `node --check` sur les JS touchés · **0 BOM, 0 URL de CDN**.

  **INTÉGRATION** : `js/data.js` (3 leçons `complet`, durées 52/54/55, `lessons` 6 → 9), page de cours mise au niveau du module 3 en **8 points** (badges, méta-description, objectifs, programme, récapitulatif, glossaire, compte des blocs de sortie 39 → 67). Compteurs **1529 → 1532 leçons**. Index régénérés **en `--fresh`** : quiz 6034, flashcards 11 467, antisèches 1569, pièges 1902, recherche 1532 leçons.

  **CE QUI CHANGE POUR LA SUITE** : les sources sont désormais **versionnées** dans `tools/maths/module-3/` (251 Ko : les 28 programmes, les 3 corps, le générateur, et 5 vérificateurs). Les modules 1 et 2 ne le sont pas — leurs sources ne vivent que dans `scratchpad/`, qui est ignoré par git : **si ce dossier disparaît, les leçons 1 à 6 ne sont plus régénérables**. À reprendre. Le cours garde `status: "apercu"` (9 leçons écrites sur 13) ; les modules 4 (graphes et matrices) et 5 (croissance et complexité) restent à écrire.
- [x] **C4 · Module 4 — Graphes et matrices** (2 leçons). ✅ **2026-09-03. 32 000 mots, 17 blocs cliqués dans un vrai Chrome sans une divergence, 186 chiffres de prose dont AUCUN n'est sans source — et une relecture adversariale qui a rendu 24 défauts sur la leçon 10 et 18 sur la leçon 11, dont deux qui faisaient dire aux programmes le contraire de ce qu'ils mesuraient.**

  **Mesure de départ, reproduite** : `grep` sur `pages/` → les graphes sont *employés* dans plusieurs cours (algo, distribué) mais aucune page ne pose la matrice d'adjacence, le seuil de densité ni le lien A<sup>k</sup> ⇄ chemins. Les deux titres étaient déjà déclarés `status: "bientot"` dans `js/data.js` : le point consistait à les écrire, pas à les inventer.

  **CE QUI A ÉTÉ PRODUIT** : `lecon-10` « Représenter un réseau : graphes et matrices d'adjacence » (62 min, 125 Ko) · `lecon-11` « Matrices : une seule opération pour une carte et un réseau » (64 min, 127 Ko). **17 programmes** exécutés avant rédaction, 17 blocs de sortie, 2 schémas SVG **générés par programme** avec contrôle géométrique (0 alerte), 2 antisèches, 38 termes de glossaire, 17 questions de QCM, 6 exercices. `verif-contenu --cours=maths` : **0 sous le standard**.

  **CE QUE LA RELECTURE ADVERSARIALE A RENDU** (2 agents en lecture seule, un par leçon), **tous revérifiés par exécution avant correction**. Les plus graves :
    – **le vecteur propre publié n'était le vecteur propre d'aucune matrice présentée.** La leçon disait « on applique la matrice, encore et encore », mais le programme itère G(v) = (1−d)/n + d × T × v, pas T. Appliquer T au vecteur obtenu donne des rapports allant de **0,167 à 1,078** — un vecteur propre les exigerait tous égaux. Le programme publie désormais ces rapports, **et** le vrai vecteur propre de T, obtenu en **46** pas au lieu de 34, différent de **0,0477**, et où *archive* tombe à **0,0000**. Quatre endroits (prose, antisèche, QCM, glossaire) affirmaient la même chose fausse ;
    – **« la liste des quatre arêtes fautives dit exactement laquelle casser » : non.** Le graphe contient **trois** cycles élémentaires, pas un — l'algorithme s'arrête au premier. Sur les **7** arêtes impliquées, **une seule** débloque tout, et sur les 4 arêtes du cycle affiché, casser l'une des trois autres laisse un cycle en place. Le programme les essaie maintenant une par une ;
    – **l'exemple censé montrer qu'un cycle contamine ses dépendants ne le montrait pas** : les 5 paquets bloqués formaient *exactement* la composante fortement connexe, donc tous étaient dans un cycle. Un paquet hors cycle (`rapport`) a été ajouté, et le programme calcule les composantes fortement connexes pour séparer les deux causes : **6 bloqués sur 8, dont 5 dans un cycle et 1 qui n'y est pas** ;
    – **« couper 90 % des liaisons proches ne change presque rien » était faux dans le modèle même de la leçon** : l'agent l'a mesuré — le graphe passe de 1 composante de 1 000 à **439 composantes**, la plus grosse à 99, et 98,6 % des paires deviennent injoignables. Affirmation retirée, remplacée par la conclusion que le tableau soutient réellement ;
    – **« 4 arêtes fautives » en comptait 2** : le parcours voyait chaque arête depuis ses deux extrémités et comptait des *incidences*. Le même programme comptait correctement dix lignes plus haut. Corrigé à **2 sur 7**, et le programme énumère maintenant les longueurs de cycles : **3, 5 et 6** — le 6-cycle n'a pas « changé de longueur », des cycles impairs sont apparus à côté ;
    – **« 475 réseaux sur 500 ont un pont » portait sur une population qui n'existe pas** : **332 de ces 500 étaient déjà en morceaux** avant toute panne. Le programme publie désormais le chiffre honnête — **155 sur 168** réseaux connexes, soit 92,3 % — et c'est lui que le champ auto-corrigé attend ;
    – **la démonstration expérimentale du OU exclusif était vide** : à tolérance 0,5, l'identité affine impose l'échec, qui était donc acquis avant la boucle. « Tolérance très généreuse » était l'inverse de la vérité. Le programme publie la table des tolérances — 0 à 0,5 ; 0 à 0,6 ; **6** à 0,75 ; **40** à 1 — et la prose dit que le tirage *illustre* le théorème sans le démontrer ;
    – **« pire écart 1,00 × 10⁻⁹ pixel » mesurait la graduation de l'instrument** : les deux côtés de la comparaison étaient arrondis au même quantum. Sans arrondi, l'écart réel vaut **8,04 × 10⁻¹⁴** — quatre ordres de grandeur plus petit ;
    – **un distracteur de QCM marqué faux était exact** : « l'associativité n'est vraie qu'à un arrondi près en virgule flottante ». Le programme le vérifiait sur des entiers, où elle est exacte. Refait sur des décimaux : **0 résultat identique au bit près sur 2 000**, écart 10⁻¹⁶. Distracteur remplacé, prose et glossaire corrigés ;
    – **« 535 818 poids » comptait les poids ET les biais** : le mot juste est *paramètres*. La séparation publiée (**535 040** poids, **778** biais) fait apparaître une coïncidence utile — il y a exactement un poids par multiplication ;
    – **« 2,91 % de commutation » était du bruit d'échantillonnage** : la loi étant finie, le programme énumère les **390 625** paires et obtient la valeur exacte, **2,66 %** — dont **66 %** de cas triviaux ;
    – **« 4 tours de multiplication » mélangeait trois grandeurs** : c'était l'*exposant* atteint, pour **3** produits effectués dont **2** utiles, et la borne citée (6) portait sur l'exposant, pas sur les produits (5) ;
    – **le taux de non-commutativité des transformations n'était expliqué qu'au cinquième** : le détail par type montre que ce ne sont pas « les rotations » qui commutent mais **tout ce qui ne mélange pas une translation avec autre chose** — 0 % pour quatre catégories, 99,5 % et 99,9 % pour les deux qui en contiennent une ;
    – et une série de corrections de fond : la somme des degrés qui vaut 2*m* **dans un graphe non orienté** seulement, la réciproque fausse du glossaire (un graphe orienté *peut* avoir une matrice symétrique), le 68,3 % donné nu alors qu'il dépend de la famille de graphes (de 18 % à 97 % selon la taille et la densité), le parcours en largeur qui ne « devient pas faux » avec des poids mais répond à une autre question, « un siècle d'algorithmes » pour trois siècles, Euler daté avec la nuance 1735/1736, Kőnig et son double accent hongrois, le `undefined` du piège des dimensions qui n'existe pas, la métaphore du jeton « réparti » alors que le total passe de 1 à 36, « une multiplication » pour obtenir A³ qui en demande deux, le « contre-exemple minimal », « trois observations » suivies de quatre, et la liste d'arêtes opposée à la liste d'adjacence alors que les deux valent 2*m* par construction.

  **⚠️ CE QUE J'AI TROUVÉ SEUL, ET QUI VALAIT LE DÉTOUR** : les **énoncés des exercices 2 et 3 ne contenaient pas de quoi être résolus** — six tâches non nommées et aucune liste de conflits pour l'un, aucun réseau donné pour l'autre. Les deux sont réécrits avec leurs données complètes, y compris les graines des bancs, pour qu'un lecteur puisse retrouver la valeur attendue sans ouvrir la solution.

  **CONTRÔLES** : `verif-clic` **17 boutons cliqués dans Chrome, 0 divergence, 0 fragment** · `verif-sorties` **17/17 identiques au caractère près** · `verif-chiffres` **186 nombres de prose, 0 sans source**, éprouvé par mutation (**3 fautes injectées, 3 vues**) · `verif-expect` **2/2** avec le juge exact de `lecon.js` · `verif-rendu` **18 mesures sur 3 pages, 0 erreur** · `verif.js --rapide` **tout vert, 173 s** · `verif-html` **1 623 fichiers, 0/0** · `verif-donnees` **25 contrôles, 0 erreur** · rendu du cours dans Chrome avec progression **semée** : **11 leçons cliquables, 0 lien mort, 2 « Bientôt », badge « 11 leçons sur 13 », barre à 8/13** · contrôle géométrique des 2 schémas **0 alerte** · `node --check` sur les JS touchés · **0 BOM, 0 URL de CDN**.

  **INTÉGRATION** : `js/data.js` (2 leçons `complet`, durées 62/64, `lessons` 9 → 11, `hours` 9 → 10), page de cours mise au niveau du module 4 en **9 points** (badge, méta-description, objectifs propres au module, programme, récapitulatif, glossaire, compte des blocs de sortie 67 → 86). Compteurs **1532 → 1534 leçons**. Index régénérés **en `--fresh`** : quiz 6051, flashcards 11 508, antisèches 1571, pièges 1905, recherche 1534 leçons.

  **CE QUI RESTE** : le cours garde `status: "apercu"` (11 leçons écrites sur 13). Le module 5 — croissance et complexité — est le prochain, et le point **C6** d'intégration l'attend. Les sources sont versionnées dans `tools/maths/module-4/` (les 17 programmes, les 2 corps, le générateur, les 2 générateurs de schéma et 3 vérificateurs). **⚠️ `tools/maths/module-3/verif-cours-progression.js` ne charge plus les pages** (Chrome rend « Impossible d'accéder à votre fichier ») : le contrôle a été refait avec une sonde CDP écrite pour l'occasion, qui, elle, fonctionne. À réparer ou à remplacer.
- [x] **C5 · Module 5 — Croissance et complexité** (2 leçons). ✅ **2026-09-03. 34 500 mots, 22 blocs cliqués dans un vrai Chrome sans une divergence, 321 chiffres de prose dont AUCUN n'est sans source — et trois défauts que SEUL le navigateur pouvait voir, dont un `Math.log` qui ne donne pas les mêmes derniers bits sous Node et sous Chrome.**

  **Mesure de départ, reproduite** : les deux titres étaient déjà déclarés `status: "bientot"` dans `js/data.js` ; `grep` sur `pages/` → la complexité est *employée* partout (algo, compilation, distribué) mais aucune page ne pose la définition de O() avec son *c* et son *n*<sub>0</sub>, ni le test du doublement, ni la distinction pire cas / cas moyen / coût amorti. Le point consistait à les écrire.

  **CE QUI A ÉTÉ PRODUIT** : `lecon-12` « Ordres de grandeur : mesurer la croissance » (60 min, 141 Ko) · `lecon-13` « Logarithmes et exponentielles, vus du code » (62 min, 130 Ko). **22 programmes** exécutés avant rédaction, 21 blocs de sortie publiés, 2 schémas SVG **générés par programme** avec contrôle géométrique (0 alerte), 2 antisèches, 33 termes de glossaire, 19 questions de QCM, 6 exercices. `verif-contenu` : **0 leçon sous le standard**, sur tout le site.

  **⚠️ TROIS DÉFAUTS QUE NODE NE POUVAIT PAS VOIR**, trouvés en cliquant sur « ▶ Tester » dans un vrai Chrome — c'est-à-dire par le seul contrôle qui reproduit ce que fait l'apprenant :
    – **`Math.max.apply(null, tableau)` déborde la pile d'un Worker de navigateur** au-delà de quelques dizaines de milliers d'arguments. Node avalait les 100 000 coûts d'insertion sans broncher ; Chrome rendait `RangeError: Maximum call stack size exceeded` à la ligne 13 de `amorti.js` et à la première ligne de `solution-3.js`. **Deux programmes sur douze étaient inutilisables dans la page**, et toute la vérification sous Node était verte ;
    – **compter les comparaisons de `Array.prototype.sort` mesure le MOTEUR, pas l'algorithme.** La colonne « tri + passage » de `echelle.js` donnait 4312 sous Node et 4293 sous Chrome, et les cinq lignes du tableau divergeaient. Le tri est désormais écrit dans le programme ;
    – **`Math.log(9)/Math.log(3)` vaut 2,00000000000000044 sous Node et 2,00000000000000000 sous Chrome.** `solution-5.js` publiait ce quotient et comptait les couples où l'arrondi supérieur ajoute un niveau : le décompte passait de **4 sur 9** à **1 sur 9** selon le moteur. La bibliothèque mathématique n'est pas spécifiée au dernier bit. Le quotient a été retiré de la sortie, remplacé par une démonstration qui ne dépend d'aucune bibliothèque (`Math.ceil(2)` contre `Math.ceil(2 + 1e-15)`), et la leçon publie le désaccord en nommant l'outil qui l'a trouvé.

  **CE QUE LA RELECTURE ADVERSARIALE A RENDU** (2 agents en lecture seule, un par leçon), **tous revérifiés par exécution avant correction** — 24 défauts sur la leçon 12, 21 sur la leçon 13. Les plus graves :
    – **la leçon affirmait « cette page ne publie aucune durée » alors qu'elle en publie 38**, et le QCM 1 posait une question dont la prémisse était fausse. La distinction voulue — durée *chronométrée* contre durée *convertie depuis un compte d'opérations à un débit posé* — n'était écrite nulle part. Elle l'est ;
    – **le 99,99<sup>e</sup> centile publié valait 65 par un artefact de virgule flottante** : `99.99 / 100 * 100000` rend 99989.99999999999, donc `Math.floor` prend le rang 99989 au lieu de 99990. La vraie valeur est **129**. Le rang se calcule désormais en entiers ;
    – **« le tri fusion ne gagne qu'à partir de n = 12 » : le programme ne mesurait pas 9, 10 ni 11.** Les tailles ajoutées donnent le vrai croisement, **10**, et il se joue à 0,1 opération près (56,4 contre 56,5) ;
    – **« le seuil de rentabilité de la dichotomie est de 34 recherches » était présenté comme mesuré alors qu'il venait d'un modèle.** En triant pour de vrai, le tri fusion fait **1 536 190** comparaisons et non les 1 660 964 du modèle *n*·log₂*n* — 1,081 fois trop —, et le seuil tombe à **31**. Le programme trie désormais, et publie l'écart entre le modèle et la mesure ;
    – **le bloc de sortie affirmait le contraire de ses propres chiffres** : « quatre mots valent 51,7 bits, **plus qu'**un mot de passe de 8 caractères (52,6 bits) ». C'est moins. Corrigé, et l'écart exact publié (**0,86** bit, **1,81** fois moins de possibilités) ;
    – **l'extrapolation du tri à un million de lignes appliquait un correctif de 8 % qui n'est pas constant.** L'excédent n'était pas dû aux « fins de fusion » mais entièrement au **passage final** de *n*−1 comparaisons — un terme *additif*, dont le poids relatif décroît. Le modèle *n*·log₂*n* + (*n*−1) colle à **0,1 %** au lieu de 8 %, et l'extrapolation obtenue (2,09 × 10⁷) coïncide avec une exécution indépendante à un million d'éléments (2,0951 × 10⁷) ;
    – **« n + (n−1) + … + 1 cellules, soit 319 600 »** : cette somme vaut 320 400. `slice(1)` d'un tableau de *k* cases en alloue *k*−1, donc la vraie somme est (*n*−1) + … + 0 = *n*(*n*−1)/2. La formule et l'énumération se contredisaient dans la même phrase, à trois endroits ;
    – **« la mauvaise solution est vingt fois plus rapide » à 200 éléments** : c'est **12,7** fois. Le « vingt » venait de *n* = 100, où le rapport vaut d'ailleurs 22 et non 20. Les deux chiffres sont maintenant calculés par le programme ;
    – **le rang du croisement était décalé d'une unité** : A gagne *jusqu'à* 3 987, donc B ne passe devant qu'à **3 988**. La prose disait « ce rang vaut 3 987 » et enchaînait sur « ce n'est qu'à 10⁶ que le rapport s'inverse », ce qui contredisait la phrase précédente ;
    – **« ×2 est le point d'équilibre, et cette table dit pourquoi » : la table disait le contraire.** À *n* = 100 000, « ×1,5 » est dominée sur les deux axes à la fois — artefact d'une mesure prise juste après un doublement. Une seconde table moyenne sur **96 tailles**, et le compromis réapparaît proprement (2,437 recopies pour 122 % de mémoire, 1,419 pour 142 %, 0,790 pour 237 %) ;
    – **« le tri par insertion reste le meilleur choix connu sur une entrée presque triée » n'était étayé par aucune mesure** — le programme n'essayait que « triée », « à l'envers », « au hasard » et « toutes égales ». Un cas « presque triée » (1 % permuté) a été ajouté : **11 558** opérations, soit **43** fois moins que sur du désordre et **34,2** fois moins que le tri rapide sur la même entrée ;
    – **le compteur de l'exercice 4 comptait des tours de boucle, pas des évaluations** : le test qui *échoue* est une évaluation lui aussi, et c'est celui-là qui arrête la boucle. **51** et non 50 ;
    – **le contrôle de l'exercice 5 ne pouvait pas échouer** : ses deux colonnes testaient la même condition écrite deux fois. Dit tel quel désormais — « elle écarte une faute de frappe, pas une faute de raisonnement » ;
    – **le modèle de nœud annoncé ne correspondait pas au programme** (« *m*−1 clés » contre *m*<sup>*h*</sup> capacité) : deux lignes du tableau différaient d'une unité. Les deux modèles sont maintenant publiés côte à côte ;
    – **un distracteur de QCM dont le libellé et le nombre ne s'accordaient pas** : « 1 297 éléments, soit 41 × la racine cubique de 1000 » — c'est 410 ;
    – **un indice d'exercice donnait 27 quand la réponse acceptée valait 26** : le compte exact est (*L*−1) carrés + un produit par bit à 1, pas *L* carrés ;
    – et une série de corrections de fond : « plus lent que 2ⁿ » qui disait l'inverse de ce qu'il fallait comprendre (φⁿ croît **moins vite**, 577 fois moins à *n* = 30), l'égalité exacte à *n* = 20 présentée comme une domination, « 4,00 trois fois de suite » quand la sortie en montre quatre, « 2^15,0 » pour 2^14,95, « la réessai » au féminin dans un bloc publié, un en-tête « QUAND n AUGMENTE DE 1 » sur une boucle qui avance de 2, « un seul caractère les sépare » pour un `.slice(1)` qui en fait neuf, les durées de cassage de mot de passe données sur la mauvaise colonne, deux énoncés d'exercice qui autorisaient deux comptages différents pour une seule réponse acceptée, et la définition du glossaire qui confondait log₂(*n*) et sa partie entière.

  **⚠️ CE QUE J'AI TROUVÉ SEUL** : un **débordement horizontal de 948 px** sur la leçon 12 à 1280 px, dans les deux thèmes — l'énoncé de l'exercice 1 mettait 200 caractères de code dans un `<code>` **en ligne**, qui ne peut pas se replier. Passé en bloc de code.

  **LE VÉRIFICATEUR DE CHIFFRES, ÉPROUVÉ PUIS RÉPARÉ** : `verif-chiffres-mutations.js` injecte 5 fautes dans la prose ; la première passe n'en a vu que **4**. La cinquième — un seuil arrondi de 44 722 à 45 000 — passait parce que l'outil cherchait par **sous-chaîne** : « 45 000 » se trouve à l'intérieur de « 145 000 ». La recherche est désormais bornée (aucun chiffre collé, aucun point ou virgule *suivi d'un chiffre*, mais la ponctuation de fin de phrase reste admise). **5/5** après réparation.

  **CONTRÔLES** : `verif-clic` **22 boutons cliqués dans Chrome, 0 divergence** · `verif-sorties` **21/21 identiques au caractère près** · `verif-chiffres` **321 nombres de prose, 0 sans source**, éprouvé par mutation (**5/5**) · `verif-expect` **2/2** avec le juge exact de `lecon.js` · `verif-accept` **4/4** (nouveau : les champs `accept` des exercices `type:text` confrontés à la dernière ligne de leur solution) · `verif-rendu` **18 mesures sur 3 pages, 0 erreur** · `verif-cours-progression` (nouveau, sonde CDP maison) **13 leçons rendues, 0 lien mort, 0 « bientôt », barre à 5 / 13 avec une progression semée** · `verif.js --rapide` **tout vert, 188 s** · `verif-html --tous` **1 797 fichiers, 0/0** · `verif-donnees` **25 contrôles, 0 erreur** · contrôle géométrique des 2 schémas **0 alerte** · `node --check` sur tous les JS touchés · **0 BOM, 0 URL de CDN**.

  **INTÉGRATION** : `js/data.js` (2 leçons `complet`, durées 60/62, `lessons` 11 → 13, `hours` 10 → 12, **`status` du cours `apercu` → `complet`**), page de cours mise au niveau en **10 points** (badges, méta-description, objectifs propres au module 5, programme, récapitulatif enrichi de 11 points, glossaire enrichi de 8 termes, compte des blocs de sortie 86 → 107). Compteurs **1534 → 1536 leçons**, et **89 cours sur 89 entièrement rédigés** — la mention « dont 88 » a été corrigée sur l'accueil, le catalogue, la page À propos et la traduction anglaise. Index régénérés **en `--fresh`** : quiz 6070, flashcards 11 543, antisèches 1573, pièges 1908, recherche 1536 leçons, **point fixe atteint**.

  🏁 **Le cours de mathématiques est complet : 13 leçons sur 13, cinq modules.** Les sources sont versionnées dans `tools/maths/module-5/` (les 22 programmes, les 2 corps, le générateur, les 2 générateurs de schéma et 5 vérificateurs). Reste le point **C6**, l'intégration transverse : QCM bilan, projet, place dans les parcours et renvois croisés depuis cryptographie, réseaux de neurones, algo et systèmes distribués.
- [x] **C6 · Intégration.** ✅ **2026-09-03. Le QCM bilan de fin de cours est RENDU et CORRIGÉ dans un vrai Chrome — 17 bonnes réponses cochées donnent 17/17, 17 distracteurs donnent 0/17 —, 8 renvois croisés posés dans les leçons qui emploient vraiment la notion, et un dépassement de délai SILENCIEUX trouvé dans le générateur.**

  **Mesure de départ, reproduite** : `grep '\.\./maths/' pages/*/lecon-*.html` → **0 lien**. Les entrées `related` de `js/data.js` existaient bien (5 cours pointent vers `maths`), mais elles ne s'affichent que sur la page de **cours** : aucune leçon de cryptographie, de réseaux de neurones, d'algorithmique ou de systèmes distribués ne renvoyait au module qui pose la notion qu'elle emploie. Le QCM bilan du cours, lui, s'arrêtait aux modules 1 et 2 (14 questions sur `lecon-06`).

  **CE QUI A ÉTÉ PRODUIT**
    – **QCM bilan de fin de cours** (`lecon-13`) : **17 questions** couvrant les modules 3, 4 et 5, dont chaque explication cite un chiffre **mesuré** dans la leçon concernée. Rééquilibré après mesure : la bonne réponse était la plus longue dans **17 cas sur 17**, avec **5 questions « flagrantes »** au sens de `verif-contenu` (≥ 1,8× et +25 caractères) ; après étoffement de 17 distracteurs, **0 flagrante** ;
    – **8 renvois croisés** « Les mathématiques derrière », posés dans les leçons qui manient réellement la notion — `crypto/lecon-03` (RSA → arithmétique modulaire, Euclide étendu, exponentiation rapide), `crypto/lecon-07` (mots de passe → mur exponentiel et bits d'entropie), `neurones/lecon-03` (couches → matrices), `algo/lecon-01` (Big O → définition, test du doublement), `algo/lecon-10` (arbres → hauteur selon l'ordre d'insertion), `algo/lecon-12` (graphes → représentations et seuil de densité), `distribue/lecon-08` (partitionner → collisions et principe des tiroirs), `distribue/lecon-09` (quorum → intersection d'ensembles). **12 liens, 14 chiffres cités**, chacun confronté à la leçon citée ;
    – **place dans les parcours corrigée** : dans « fondamentaux », le cours de maths était **en tête**, donc treize leçons de mathématiques avant la moindre ligne de code — alors qu'il annonce lui-même « prérequis : savoir lire un `if` ». Il passe **après python**. Et il est **ajouté au parcours « ia »**, où il est un prérequis dur : le cours sur les réseaux de neurones est une suite de produits de matrices ;
    – **second projet contextualisé** : « Un profileur qui classe un programme sans lire son code » (test du doublement, compteur par `Proxy`, aveu d'ignorance quand le rapport ne tranche pas). Le cours en avait un, sur la logique du module 1 ; le module 5 a désormais le sien. **93 → 94 projets** ;
    – **récapitulatif et glossaire de la page de cours** : déjà enrichis au point C5, mais ils portaient **cinq chiffres antérieurs à la relecture adversariale** (19,9 ms pour 20,0 ; « jusqu'à 3 987 » sans la nuance du rang suivant ; « trois cas » pour quatre ; le 99<sup>e</sup> centile pour le 99,9<sup>e</sup> ; 34 recherches pour 31). Corrigés.

  **⚠️ CE QUE CE POINT A TROUVÉ, ET QUI VALAIT LE DÉTOUR**
    – **`gen.js` publiait un bloc TRONQUÉ sans rien dire.** La sortie de `solution-4.js` s'est retrouvée coupée sur « `!! Error: Script execution timed out` » : le programme mettait **4 130 ms** dans le bac à sable, contre 5 000 ms de plafond — et **0,3 s** en exécution directe. La cause : dans un contexte `vm`, chaque lecture de `Math` traverse le proxy du contexte, et la boucle témoin en fait quarante millions. Sortir `Math.log2` dans une variable locale ramène à **318 ms**. Seul `verif-chiffres` l'a vu, et par ricochet — un chiffre de la prose n'était plus dans sa sortie. **Un garde-fou a été ajouté** : `gen.js` refuse désormais d'écrire quoi que ce soit si un programme lève une erreur, dépasse le délai, ou s'approche à moins de 1 500 ms du **plafond de 3 000 ms de `js/runner.js`** — le seul qui compte, puisque c'est celui que l'apprenant subit. Éprouvé par mutation : une boucle de 2 s injectée dans `chrono.js` fait sortir le générateur en erreur, sans rien écrire ;
    – **deux chiffres du renvoi vers `distribue/lecon-08` n'étaient pas dans la leçon citée** : le principe des tiroirs (65 536 cases, 16 clés) vit dans `maths/lecon-05`, pas dans `lecon-06`. Le lien manquant a été ajouté — trouvé par `verif-renvois.js`, pas à la relecture.

  **OUTILS NEUFS** : `verif-bilan.js` (ouvre la page dans Chrome, coche les bonnes réponses du QCM bilan par leur **texte** — les options sont mélangées à l'affichage —, exige un score parfait, **puis recharge et coche un distracteur partout en exigeant 0**) et `verif-renvois.js` (chaque encart de renvoi : la cible existe, et **chaque chiffre cité s'y retrouve**, séparateurs de milliers et espaces insécables recollés).

  **CONTRÔLES** : `verif-bilan` **2 pages, 17/17 et 14/14 en positif, 0/17 et 0/14 en témoin négatif** · `verif-renvois` **8 encarts, 12 liens, 14 chiffres, 0 orphelin** · `verif-cours-progression` **13 leçons, 0 lien mort, 0 « bientôt », barre à 5 / 13** · `verif-clic` **22 blocs, 0 divergence** · `verif-sorties` **21/21** · `verif-chiffres` **321 nombres, 0 sans source** · `verif-rendu` **42 mesures sur 7 pages, 0 erreur** · `verif.js --rapide` **tout vert, 197 s** · `verif-html --tous` **1 797 fichiers, 0/0** · `verif-donnees` **25 contrôles, 0 erreur** · index régénérés en `--fresh`, **point fixe atteint** (quiz 6070 → **6087**).

  🏁 **La phase C est close : 6 cases sur 6.** Le cours de mathématiques existe, il est complet, et il est relié — dans les deux sens — aux quatre cours qui en dépendent.

---

## PHASE D — Lire la documentation officielle

Le site est en français. La documentation qui fait autorité est en anglais. Entre les deux, il y a un
mur que personne n'aide à franchir — et un apprenant qui ne lit pas la doc restera dépendant des
tutoriels toute sa vie.

- [x] **D1 · Anatomie d'une page de documentation.** ✅ **2026-09-03. La page de référence est écrite, et elle est le premier document de ce site dont CHAQUE affirmation est rejouée : 36 contrôles, 0 échec — et deux de ces affirmations étaient fausses avant de passer au banc d'essai.**

  **CE QUI A ÉTÉ FAIT.** Le cours **`doc` — « Lire la documentation : l'anglais et les sources du métier »** est créé (90ᵉ cours du site), avec sa **leçon 01, complète** : 73 Ko, **6 956 mots visibles**, 8 rubriques décortiquées, 6 programmes exécutables, 10 questions de QCM, 6 de bilan, 3 exercices corrigés, une antisèche et un glossaire de 13 entrées. Le contrainte de licence est tenue **sans rien emprunter** : la page de référence, en anglais, documente `slugify()` — la fonction de `js/lecon.js` qui fabrique les ancres du sommaire de chaque leçon du site. Elle est donc à la fois réelle, à nous, et **exécutable dans la page**.

  **LE PIPELINE.** `tools/doc/gen.js` assemble la leçon : les blocs de code sont *littéralement* les fichiers de `tools/doc/code/`, les blocs de sortie *littéralement* ce que leur exécution produit, le code de `slugify()` est **relu dans `js/lecon.js` à chaque assemblage** (jamais recopié), et le document anglais est lu tel quel dans `tools/doc/reference/slugify.txt`. Le garde-fou du dépassement de délai hérité de C5 est repris tel quel.

  **CONTRÔLES** : `verif-doc` **36 contrôles, 0 échec** · `verif-clic` (vrai Chrome, bouton « Tester » cliqué) **6 blocs, 0 divergence** · `verif-rendu` **12 mesures sur 2 pages, 0 erreur, réseau coupé** · `verif-cours-progression` avec **progression semée** **1/1 leçon, 0 lien mort, 0 « bientôt »** · `verif-html --tous` **1 799 fichiers, 0/0** · `verif-donnees` **25 contrôles, 0 erreur** · `verif.js --rapide` **tout vert, 169 s** · index régénérés en `--fresh`, **point fixe atteint** (quiz 6 087 → **6 103**, flashcards **11 561**, antisèches **1 574 — 90/90 cours couverts**).

  **CE QUE LA RELECTURE ADVERSARIALE A RENDU** (4 agents en lecture seule, ~60 défauts, tous traités) :
  - **La leçon se comptait elle-même.** Publiée, elle s'ajoutait au corpus qu'elle décrivait : ses chiffres étaient périmés le jour même (17 101 → 17 114). Corrigé à la racine — le corpus **exclut le cours `doc`**, les **89 pages de redirection** ne sont plus comptées comme des leçons (« 1 625 » → **1 536**, l'écart exact), **plus aucun de ces nombres n'est écrit dans la prose** (marqueur `@@MESURE:@@` injecté à l'assemblage), et `verif-doc` **échoue** si la page et le relevé divergent, ou si un chiffre périmé y traîne.
  - **« NFKD ne décompose que les ligatures typographiques » : faux.** Mesuré : `"Ⅻ"` donne `"XII"`, `"㎏"` donne `"kg"`. Passer à NFKD **sauverait** le chiffre romain que la leçon donne pour perdu — sans rien changer au sort du `œ`. La doc avait raison sur la conclusion et tort sur la raison.
  - **« Thrown if s is not a string » : faux.** Un objet `String` passe sans erreur (`typeof` vaut `"object"`). La rubrique promettait un refus que le code ne fait pas ; c'est devenu un enseignement de la leçon — *une doc qui promet trop est aussi fausse qu'une doc qui se trompe*.
  - **Le vérificateur publié avalait ses pannes** : sans `slugify`, il affichait « 0 contre-exemple » trois fois, c'est-à-dire trois promesses tenues par du néant. Il compte désormais ses incidents et dit combien d'entrées ont été jugées.
  - **16 QCM sur 16 avaient la bonne réponse en position la plus longue** (133 caractères contre 59 en moyenne). Après équilibrage : la plus longue **4 fois**, la plus courte **4 fois**, au milieu **8 fois**. *(À noter : `verif-contenu` mesure le même biais sur **89,6 % des 6 119 questions du site** — dette globale, hors périmètre de ce point.)*
  - **L'exercice de code attendait « 0 »**, valeur déjà publiée trois fois dans la page : `console.log(0)` passait. Il attend maintenant **39**, le nombre de tirets des dix fragments réels — calculable, non publié.
  - Corrigés aussi : « à gauche » pour un sommaire qui est à droite, « 90 % des visites » écrit de tête, `obsolete` présenté comme « déjà cassé » (`<center>` et `<marquee>` fonctionnent toujours), le vocabulaire attribué à Rust qui n'a ni `Syntax` ni `Parameters`, et une leçon annoncée qui n'existe pas encore.
  - **Le cas limite que personne n'avait vu venir** : le `^` ASCII **porte la propriété Unicode `Diacritic`**, donc `"a^b"` rend `"ab"` et non `"a-b"` — l'étape 3 l'efface avant que l'étape 4 puisse le voir. **3 titres du site** sont dans ce cas (OCaml, Elixir, Prolog).

  **INTÉGRATION** : `data.js` (courses/content/durations), `pages/doc/cours.html`, accent `#3d5a80` clair et sombre, catalogue, projet contextualisé, QCM bilan, antisèche, et **3 renvois entrants** depuis `javascript`, `html` et `markdown`. Compteurs du site remis d'équerre : **90 cours, 1 537 leçons, 82 langages**. Outil `verif-cours-progression` rendu **paramétrable** (`--cours=`, `--terminees=`, `--attendues=`) sans régression sur `maths` (5/13 toujours lu).
- [x] **D2 · Le vocabulaire minimal.** ✅ **2026-09-03. 88 mots de documentation, dont 13 n'apparaissaient dans AUCUNE des 1 536 leçons du site — à commencer par `deprecated`. Et 82 pièges qui ne sont pas racontés mais JOUÉS : 61 preuves exécutées à l'assemblage, dont quatre que la relecture adversariale a démontrées fausses.**

  **CE QUI A ÉTÉ FAIT.** La **leçon 02 du cours `doc`** est écrite : 107 Ko, **9 802 mots visibles**, 88 fiches rangées en 6 familles — ce que la doc promet, ce que le code fait, les données et leurs bords, le temps et la concurrence, quand ça casse, et les charnières qui renversent une phrase. Chaque fiche porte sa traduction, son sens **technique**, son faux ami quand il y en a un, et **son piège**. 5 programmes cliquables, un schéma, un cas réel, 10 questions de QCM, 6 de bilan, 3 exercices, une antisèche et un glossaire.

  **LA MESURE QUI FONDE LA LEÇON.** Les 88 mots ont été confrontés au reste du site — `tools/doc/mesures/presence.js`, corpus de **1 536 leçons dans 89 cours**, blocs de code compris, ce cours-ci exclu. Résultat : **13 mots n'y apparaissent nulle part**. Le premier de la liste est `deprecated`, probablement le mot le plus fréquent de toute documentation logicielle. Un second corpus, **provoqué et non recopié** : `tools/doc/mesures/messages-erreur.js` déclenche **26 erreurs réelles** et relève leurs messages tels que le moteur les écrit — **5 familles, 14 `TypeError`, 6 messages en « Cannot … », 4 en « … is not a … »**.

  **LE LEXIQUE, RELIÉ ET NON DOUBLÉ** (ce que la case demandait). Mesure préalable : sur les **64 entrées** du lexique existant, **5 seulement** recoupaient les mots de cette leçon — les deux ensembles sont deux moitiés d'un même besoin (écrire / lire). `js/lexique-data.js` passe à **147 entrées**, est désormais **généré** depuis `tools/doc/vocab/mots.json` avec les valeurs de preuve résolues, et la page gagne des **filtres par famille**, les faux amis et les pièges.

  **CE QUE LA RELECTURE ADVERSARIALE A RENDU** (4 agents en lecture seule, tenus de rejouer avant d'accuser ; ~55 défauts, tous recontrôlés puis traités) :
  - **L'exercice de code attendait `7`. La réponse est `6`** — parmi `0, "", "0", [], {}, null, undefined, NaN, " "` et `-0`, six sont *falsy*. L'apprenant qui répondait juste était **déclaré en échec** par le moteur d'exercices.
  - **La preuve de `shadowing` ne masquait rien** : elle déclarait `n` dehors et `n2` dedans. Deux noms différents ne se masquent pas — elle prouvait exactement zéro chose.
  - **La preuve de `throws` était circulaire** : la garde du programme publié avait été *écrite* pour accepter un objet `String`. Elle appelle maintenant la **vraie `slugify()` de `js/lecon.js`**, qui ne contrôle aucun type et rend `"ada-lovelace"`.
  - **La preuve de `race condition` ne pouvait pas changer d'avis** : la perte de mise à jour était écrite en ligne droite. Deux générateurs et un ordonnanceur maison la remplacent — **entrelacés : 1 ; une tâche après l'autre : 2**. Le résultat dépend enfin de l'ordre.
  - **« `aire(3)` rend `NaN` » : le bloc publié affichait `null`.** `JSON.stringify(NaN)` vaut `"null"`, et le bac à sable sérialise en JSON pour transporter la sortie. La ligne montre désormais **les deux formes**, et le piège est devenu un enseignement de la leçon : *un affichage n'est pas une valeur*.
  - **`triStable` triait trois éléments** — l'ancien tri instable de V8 rendait la même réponse. Seize éléments à deux clés séparent les deux comportements.
  - **`depassement` mesurait la précision, pas la capacité.** Deux vraies preuves : `MAX_VALUE * 2` → `Infinity`, `2^31 | 0` → `-2147483648`.
  - **La leçon annonçait 5 familles d'erreurs puis en commentait quatre** : `URIError` n'était nommée nulle part. Et deux explications causales étaient fausses : « `TypeError`, presque toujours `undefined` » (**1 message sur 14**) et « `SyntaxError` à l'exécution ⇒ presque toujours `JSON.parse` » (**1 sur 3**).
  - **« `is not a …` est la tournure la plus fréquente » : faux — 4 contre 6** pour « Cannot … ». La leçon publiait les deux chiffres et concluait l'inverse, deux lignes plus bas.
  - **Q10 illustrait les 13 absents par `deprecated`** — qui figurait justement **déjà** au lexique du site. **Q4 décrivait un résultat impossible** (« affiche 0 » : l'énumération des 6 entrelacements ne donne que 1 ou 2). **Le bilan Q5 était démenti par sa propre explication.**
  - Fiches réécrites d'après la mesure : `obsolete` (le faux ami annoncé *était* la bonne traduction), `to round` (**`Math.round` et `toFixed` suivent deux règles différentes** sur les négatifs — `-0` contre `"-1"`), `to truncate` (c'est `floor` qui diverge, pas « arrondir »), `to cast` (un cast de **valeur** convertit vraiment ; seul le cast de **pointeur** réinterprète), `abstract` (« le seul mot de cette liste » était faux 8 fois sur 8), `idempotent` (`replace` avec `/g` **est** idempotent).
  - **+6 mots (82 → 88)** : `truthy`, `falsy`, `greedy`, `precision`, `NaN`, `nullable`. Ils emploient les **16 preuves qui dormaient** sans être rejouées par personne.
  - **Biais des QCM, mesuré deux fois** : 11 bonnes réponses sur 16 étaient la plus **courte** ; après une première correction, 11 étaient la plus **longue**. État final : **5 longues, 1 courte, 10 au milieu**.
  - **Le titre ne compte plus rien.** « Les 82 mots » aurait périmé au premier mot ajouté — c'est arrivé le jour même. Seule la prose compte, et par marqueur.

  **OUTILS NEUFS** : `tools/doc/vocab/preuves.js` (61 preuves employées, 0 orpheline), `mots.json` (la source unique des 88 fiches), `gen-lexique.js` (génère `js/lexique-data.js`, valeurs résolues par exécution), `mesures/presence.js`, `mesures/messages-erreur.js`, `verif-vocab.js` et `verif-lexique-clic.js` — ce dernier **clique dans un vrai Chrome**, parce que les 147 entrées du lexique et ses filtres n'existent dans **aucun** fichier HTML : aucun vérificateur de source ne pouvait les voir.

  **UN DÉFAUT D'OUTILLAGE TROUVÉ EN CHEMIN** : `gen.js` s'arrêtait à la **dernière ligne synchrone**, alors que `js/runner.js` attend encore **900 ms** après le « done » du Worker. Le bloc sur la *race condition* aurait été publié amputé de ses 4 dernières lignes — celles qui montrent la mise à jour perdue. Le générateur draine désormais la boucle d'événements comme le navigateur.

  **CONTRÔLES** : `verif-vocab` **79 contrôles, 0 échec** · `verif-lexique-clic` **12 contrôles dans Chrome, 0 échec** · `verif-clic` **5 blocs cliqués, 0 divergence** · `verif-rendu` **18 mesures à 320/768/1280 px, 2 thèmes, réseau coupé, 0 erreur** · `verif-html` **1 627 fichiers, 0/0** · `verif-donnees` **25 contrôles, 0 erreur** · `verif-contenu` la leçon **au standard éditorial** · `verif.js --rapide` **tout vert, 168,3 s** · index régénérés en `--fresh`, **point fixe atteint** (quiz **6 119**, flashcards **11 569**, antisèches **1 575**). Site : **90 cours, 1 538 leçons**.

  **⚠ RESTE OUVERT** : `pages/doc/lecon-01.html` est encore sous le standard éditorial (0 schéma SVG, 0 « cas réel ») — hérité de D1, hors périmètre de cette case.
- [x] **D3 · Les documents normatifs.** ✅ **2026-09-03. Une spécification écrite pour l'occasion, puis CONFRONTÉE aux 6 103 questions de QCM du site : 6 obligations vérifiables tenues 6 103 fois sur 6 103, une recommandation ignorée 89,8 % du temps — et une VRAIE violation trouvée dans le corpus, corrigée.**

  **CE QUI A ÉTÉ FAIT.** La **leçon 03 du cours `doc`** est écrite : 84 Ko, **9 110 mots visibles**. Elle publie **une spécification complète en anglais** (198 lignes, dans la forme d'une RFC : *Abstract*, *Requirements Language*, *Terminology*, *Conformance*, *Security Considerations*, *Known Limitations*) — celle du format `data-quiz` que **toutes** les leçons du site emploient. Puis elle confronte ce document au corpus qu'il décrit. 3 programmes cliquables, un schéma, deux cas réels, 10 questions de QCM, 6 de bilan, 3 exercices, une antisèche et un glossaire.

  **LE TROU, MESURÉ D'ABORD.** **29 leçons** du site parlent de « la spécification », **18** citent une RFC par son numéro — et **une seule** emploie `MUST` ou `SHOULD`. On renvoyait à ces documents sans jamais dire ce qu'on y trouve.

  **LA MESURE CENTRALE** (`tools/doc/mesures/conformite-quiz.js`) : les **6 103 questions** des **89 autres cours**, clause par clause. **Les 6 obligations vérifiables : 6 103 / 6 103.** La recommandation `S3` — « la bonne réponse n'est pas strictement la plus longue » — : **625 conformes, 5 478 manquements, 10,2 %**. Et la faculté offerte par `A1` (omettre `correct`) : **jamais employée**. Trois résultats, trois enseignements — un format simple se respecte tout seul, une recommandation qui coûte un effort d'écriture ne se respecte pas, et *une facilité que personne n'emploie n'aurait peut-être pas dû être offerte*.

  **DEUX DÉFAUTS TROUVÉS EN ÉCRIVANT, ET RACONTÉS DANS LA LEÇON.**
  - **La clause `M6` a demandé trois rédactions.** Première : **11 manquements, les onze faux** (« aucune des deux ReLU », « les deux premiers éléments du tableau » parlent du *sujet*, pas des options). Deuxième : **4**, faux. Troisième : **2**, et leur cause mérite d'être connue — en JavaScript, `\b` ne connaît que `[A-Za-z0-9_]`, donc « filtre la réponse **c**ôté client » ressemble à « réponse C ». **17 manquements annoncés, zéro réel** : c'était la clause qui était fautive, jamais le corpus.
  - **Un programme parfait et inerte.** `normatif-mots.js` embarquait le document entier ; il perdait donc son bouton « Tester », car `js/runner.js` refuse tout bloc contenant `document` — **même dans une chaîne**. **Mesuré avant de corriger** : assouplir ce filtre ferait changer de verdict **96 blocs** du site, dont des blocs Node qui gagneraient un bouton qu'ils ne peuvent pas honorer. `runner.js` n'a donc **pas** été touché : le programme ne reçoit plus que les lignes normatives, et le générateur refuse d'assembler si l'une d'elles porte un mot interdit.

  **UN COMPTEUR AFFICHAIT 0 AU LIEU DE 18** — et rien ne l'a vu. Six caractères **backspace (U+0008)** s'étaient glissés dans `gen.js` à la place des `\b`, laissés par un script d'édition Python. `node --check` passe, le fichier reste valide, la relecture ne montre rien : le caractère est invisible. **C'est une capture d'écran de la page qui l'a révélé.** Trois parades : **`tools/verif-controles.js`** (neuf) balaie les 2 483 fichiers du dépôt et n'admet que **deux** emplois voulus, déclarés nommément ; un contrôle « 3 bis » **recalcule** les compteurs avec des motifs écrits à part ; et aucun compteur publié ne peut plus valoir 0 sans faire tomber le contrôle.

  **CE QUE LA RELECTURE ADVERSARIALE A RENDU** (3 agents, ~45 défauts, tous recontrôlés puis traités) :
  - **La chute de la leçon était fausse.** « La section *Requirements Language* n'impose rien, c'est la seule qu'on peut sauter » : elle porte **deux `MUST`**, dont « *a reader MUST be prepared for both* » — une obligation qui pèse sur le lecteur et **n'est écrite nulle part ailleurs**. La leçon dit maintenant l'inverse, et c'est un meilleur enseignement : *la seule section qu'on croyait pouvoir sauter coûte une obligation*.
  - **« Obligations réelles : 28 »** : les 28 mots-clés hors section 2 sont 15 `MUST`, 2 `MUST NOT`, 6 `SHOULD`, 1 `SHOULD NOT`, 4 `MAY`. **Les obligations sont 17.** Une leçon dont la thèse est qu'un `MAY` n'oblige à rien les additionnait.
  - **« Les six obligations »** : les sections 4 à 6 en portent **15** ; l'outil en teste **6**. Les autres lient le **bloc**, le **lecteur**, ou portent sur une *intention* — et une intention ne se mesure pas. La clause de conformité, qui mélangeait les trois, a été réécrite.
  - **199 lignes annoncées, 198 publiées** : `split()` comptait la chaîne vide qui suit le dernier saut de ligne.
  - **L'exercice 1 citait la section 8** pour une phrase qui est en section 2.
  - **Le glossaire SemVer se contredisait** ; « 1.2 » n'est pas une version sémantique valide, donc « quatre comparaisons sur cinq » devient **trois sur quatre**.
  - **`normatif-conformite.js` criait au loup** : sur un bloc dont `correct` vaut 7, `L[7]` est `undefined` et `S3` se déclarait violé alors que les deux options font un caractère. Les `SHOULD` ne sont plus évalués si un `MUST` tombe.
  - **Affirmations sur les RFC nuancées et signalées comme NON REJOUÉES** (la machine n'a pas de réseau) : la RFC 2119 définit plus de trois mots-clés, la règle des majuscules vient de la **RFC 8174**, et une RFC peut être *updated by* et pas seulement *obsoleted by*.
  - **Le cours respecte désormais la règle qu'il publie** : ses trois leçons violaient `S3` **15 fois sur 48**. Quinze distracteurs rallongés, et `verif-normatif` exige maintenant **zéro manquement** sur les trois leçons du cours (le reste du site garde le seuil).
  - **UNE VRAIE VIOLATION TROUVÉE DANS LE CORPUS** : en resserrant `M6`, la mesure a fini par trouver un `MUST` violé pour de bon — `pages/ml/lecon-01.html` proposait « *Aucune de ces réponses* », vide de sens une fois les options mélangées. Réécrite. **C'est le seul usage qui justifie d'écrire un document normatif** : il ne décrit pas ce qui est, il permet de trouver ce qui cloche.
  - **L'extracteur de corpus ignorait des blocs en silence** (attributs inversés, apostrophes simples) : il repère maintenant *tout* script portant `data-quiz`, puis rejette **avec un message**. Et `verif-normatif` **lit `js/lecon.js`** : il échoue si `buildQuiz` cesse de mélanger les options, d'échapper les chaînes, ou de traiter un `correct` absent comme zéro.

  **CONTRÔLES** : `verif-normatif` (neuf) **60 contrôles, 0 échec** · `verif-controles` (neuf) **2 483 fichiers, 0 accident** · `verif-doc` **36/0** et `verif-vocab` **79/0** sans régression · `verif-clic` **3 blocs cliqués dans Chrome, 0 divergence** · `verif-rendu` **16 mesures sur 4 pages, 0 erreur** · `verif-html` **0/0** · `verif-donnees` **25 contrôles, 0 erreur** · `verif-contenu` la leçon **au standard éditorial** · `verif.js --rapide` **tout vert, 124,3 s** · index régénérés en `--fresh` (quiz **6 151**, antisèches **1 576**, 90/90 cours). Site : **90 cours, 1 539 leçons**.
- [x] **D4 · Chercher efficacement.** ✅ **2026-09-03. Vingt réponses de forum de 2008 à 2015 exécutées dans le moteur d'aujourd'hui : ZÉRO ne casse — et cinq ne faisaient déjà pas ce qu'elles promettaient le jour de leur publication. « Se méfier d'une réponse de 2013 » est donc un mauvais réflexe, et c'est la leçon elle-même qui le démontre contre son propre titre.**

  **CE QUI A ÉTÉ FAIT.** La **leçon 04 du cours `doc`** est écrite : 94 Ko, **9 009 mots visibles**, et elle clôt la phase D. Elle prend trois gestes — formuler, juger, vérifier — et les mesure au lieu de les raconter. 5 programmes cliquables, un schéma, deux cas réels, 16 questions de QCM, 4 exercices, une antisèche et un glossaire de 7 entrées.

  **LES MESURES, toutes calculées, aucune écrite à la main.**
  - **Les 20 réponses datées** (`tools/doc/reponses/conseils.js`) portent chacune jusqu'à cinq *sondes* — de petites expressions qui interrogent le moteur — et leur verdict est **déduit** de ces booléens par `verdictDe()`, jamais rédigé : **0 ne s'exécute plus · 5 fausses dès l'origine · 6 marchent mais sont trouées · 4 tiennent pour une raison disparue · 2 sont dépassées · 3 sont toujours bonnes.** Le générateur **refuse d'assembler** si une sonde annoncée rend `false` — et il l'a fait dès le premier essai (voir plus bas).
  - **Le squelette d'un message d'erreur, CALCULÉ et non deviné** (`mesures/requetes.js`) : le même défaut est provoqué **deux fois**, avec des noms de variables sans rapport, et l'on garde la plus longue sous-séquence commune. Sur **8 défauts** : **60 unités porteuses de sens, 53 écrites par le moteur, 7 par toi — 88 % de stable.** Ce sont ces 7 unités qui rendent une recherche stérile.
  - **6 causes sans rapport → 1 seul message**, au caractère près ; et deux programmes qui ne diffèrent que par `null` au lieu d'`undefined` en donnent **2**.
  - **26 affirmations sans source** : 13 vraies, 13 fausses, **0,5 mot d'écart** de forme entre les deux moitiés, **aucune** avec marqueur de prudence, **aucune** avec source.

  **CE QUE LA RELECTURE ADVERSARIALE A RENDU** (4 agents en lecture seule, tenus de rejouer avant d'accuser ; ~60 défauts, tous recontrôlés puis traités) :
  - **LA PREMIÈRE MESURE DE LA LEÇON ÉTAIT FABRIQUÉE.** Son paragraphe d'ouverture publiait « **80 leçons renvoient l'apprenant chercher ailleurs** ». Échantillonnés un par un, les matchs étaient le *sujet* et non le geste : « stack overflow » désignait un **débordement de pile** dans 8 leçons sur 18, « assistant de » attrapait l'assistant de configuration de Vue et **l'assistant de preuve Coq**, `LLM` attrapait les douze leçons du cours qui *enseigne* les LLM, et `href="http` matchait des liens **échappés dans des blocs de code**. Motifs resserrés → 23 leçons, réchantillonnées → **encore faux** : `compilation/lecon-11` dit « **ne cherche pas** la documentation », et le motif comptait l'exact contraire d'un renvoi. **On a donc changé de mesure plutôt que de forcer le motif** — ce que la leçon enseigne par ailleurs. Ne restent que des faits durs : **11 leçons sur 1 536 portent un lien vers l'extérieur** (7,2 ‰, dans 8 cours), **1 525 n'en portent aucun**. Le site est une île. L'histoire est racontée dans l'en-tête de `recours.js`.
  - **« Ces trois-là sont des méthodes qui n'existent pas » : faux.** Sur les 3 affirmations fausses qui *lèvent*, deux nomment une méthode inexistante — mais `replaceAll` **existe** et lève parce qu'elle refuse une expression régulière sans `g`. Aucun `typeof` ne l'aurait vue. La page publiait la contradiction elle-même, quelques écrans plus bas.
  - **Le `for…in` était démontré sur un objet qui n'est PAS un tableau.** La sortie publiée montrait `length` parmi les clés visitées : un artefact de la substitution, puisque sur un vrai tableau `length` n'est pas énumérable. Refait sur `[10, 20]` avec la propriété parasite posée là où une bibliothèque la poserait, sur `Array.prototype`.
  - **L'exercice 3 affichait un énoncé et un champ de réponse sans rapport** (le moteur apparie par index) ; **l'exercice 1 REFUSAIT la réponse que la leçon enseigne** — elle demande de mettre la requête entre guillemets, et le correcteur ne les acceptait pas.
  - **« Rien, dans la forme, ne trie » était plus fort que la mesure.** L'écart tient en un demi-**mot**, mais il reste **14 caractères** (12,7 %) — et l'encadré voisin qualifie 24 caractères de biais fatal. Déclarer la victoire en changeant d'unité est précisément le tour que cette leçon apprend à repérer. Le résidu est désormais **publié**, et `verif-recherche` le surveille.
  - **6 questions de QCM citaient les chiffres du corpus EN DUR** — le défaut D1 (« un contenu qui mesure se périme en étant publié ») simplement **déplacé dans un `<script>`**, que le contrôle §3 excluait explicitement. Passées par marqueurs, et un **§3 bis** balaie maintenant les blocs JSON.
  - **12 QCM sur 16 trahissaient la bonne réponse par sa longueur** : après étoffement des distracteurs, **0 la plus longue, 0 la plus courte, 16 au milieu**.
  - **Un âge calculé avec `new Date().getFullYear()`** dans une page générée *puis commitée* : faux dès le 1er janvier suivant, sans que rien ne casse. La clé a été **supprimée**, avec la raison écrite à sa place.
  - **Géométrie du schéma SVG** : la flèche 4→5 entrait de 10 px dans sa boîte, la flèche de retour traversait la boîte 4 sur toute sa hauteur, et le mot « souvent » chevauchait un bord. Corrigé et revérifié par le calcul.
  - Corrigés aussi : « les 6 réponses trouées tombent **toutes** sur une entrée de cette liste » (**3 sur 6** ; les autres demandent de varier la *structure*, pas la valeur), le bloc cliquable des 8 affirmations qui **reprenait 8/8** du tableau publié plus haut (le pari était mort-né — 8 inédites), l'histoire du renommage de `flatten` en `flat` **signalée comme non rejouée** (pas de réseau), la colonne « le message que TU vois » qui omettait le préfixe `TypeError`, l'absence de réserve sur le fait que **tous ces messages sont ceux de V8**, et le titre qui promettait « vérifier » sans qu'aucun `h2` ne le porte.

  **OUTILS NEUFS** : `tools/doc/reponses/conseils.js` (le corpus daté, ses sondes et `verdictDe()`), `reponses/affirmations.js` (le garde-fou `dit` séparé du verdict `annonce` : il **lève** si le moteur change), `mesures/requetes.js`, `mesures/recours.js` et `verif-recherche.js`.

  **CONTRÔLES** : `verif-recherche` **75 contrôles, 0 échec** (59 avant la relecture) · `verif-clic` (vrai Chrome, bouton « Tester » cliqué) **6 blocs, 0 divergence** — les messages d'erreur de Node 24 et de Chrome concordent au caractère près · `verif-rendu` **12 mesures sur 2 pages, 0 erreur, 0 avertissement, réseau coupé** · `verif-doc` **36/0**, `verif-vocab` **79/0**, `verif-normatif` **60/0** sans régression · `verif-cours-progression` avec **progression semée** **4/4 leçons, 0 lien mort, barre à 2/4** · `verif-donnees` **25 contrôles, 0 erreur** · `verif-html` **1 629 fichiers, 0/0** · `verif-controles` **0 accident** · `verif-contenu` la leçon **au standard éditorial** · `verif.js --rapide` **tout vert, 143,7 s** · index régénérés en `--fresh`, **point fixe atteint** (quiz **6 135 → 6 151**, antisèches **1 577**, 90/90 cours). Site : **90 cours, 1 540 leçons**.

  **⚠ RESTE OUVERT** : `pages/doc/lecon-01.html` demeure sous le standard éditorial (0 schéma SVG, 0 « cas réel ») — dette héritée de D1, déjà signalée par D2, hors périmètre de cette case.

  🏁 **La phase D est close : 4 cases sur 4.** Le cours `doc` a ses quatre leçons — la page de référence, le vocabulaire, les documents normatifs, et la recherche.

---

## PHASE E — Ce qui périme

Le revers de tout le reste. Un site de 1 400 leçons qui cite des versions vieillit sans prévenir :
**51 pages citent un numéro de version, 4 portent une date.**

- [x] **E1 · Mesurer le périssable.** ✅ **2026-09-03. Le tableau existe — 537 pages sur 1 540 (35 %) portent une affirmation datable — mais le vrai résultat est ailleurs, et il décide de la suite de la phase : LE PÉRISSABLE N'EST PAS DÉTECTABLE PAR MOTIF. Trois passes successives, chacune après échantillonnage : 1 540 → 748 → 677 → 537, et le résidu contient encore des faux positifs structurels.**

  **L'OUTIL** : `tools/releve-perissable.js` (neuf), et le tableau par cours dans `tools/releve-perissable.csv` (90 lignes, une par cours).

  **LA MESURE, catégorie par catégorie** (occurrences « nues », c'est-à-dire ce qui reste après écartement contextuel) :

| Catégorie | Brut | Écarté par le contexte | Dette | Pages |
|---|---:|---|---:|---:|
| numéro de version d'une techno qui bouge | 439 | compat 152, provenance 18 | **269** | 112 |
| affirmation de récence | 401 | locution 32, pédago 11 | **358** | 249 |
| domination / part de marché | 289 | — | **289** | 145 |
| chiffre de performance | 877 | provenance 142 | **735** | 105 |
| date récente (2020+) | 56 | — | **56** | 47 |

  **3 cours sur 90 n'en portent aucune** (`iac`, `kubernetes`, `regex`). Les plus exposés : `js` 29 pages, `css` 20, `php` 15, `python` 15, `react` 13. **49 pages citent une version dans un BLOC DE CODE**, comptées à part : un `python:3.12` dans un Dockerfile est un exemple, pas une affirmation sur le monde.

  **LES TROIS PASSES, ET CE QUE CHACUNE A APPRIS** — la règle née de D4 (« un motif qu'on n'a pas échantillonné n'est pas une mesure ») a été appliquée dès la première ligne, et elle a servi trois fois :
  1. **Motif naïf « `<Mot en majuscule> <nombre>` » → 1 540 pages sur 1 540.** Il attrapait « Exercice 2 » **1 538 fois**, plus « Top 10 », « Les 10 », « Sac 40 », « Taux 0 » et « CONST 3 ».
  2. **Liste blanche de technologies → 748 pages.** Échantillonné, le motif recouvrait **trois choses qui n'appellent pas le même traitement** : « Ada 2012 » et « Fortran 90 » sont des **millésimes de norme** (ils ne vieilliront pas) ; « depuis Bash 4 » est un **fait de compatibilité** (il restera vrai quand Bash 6 sortira) ; et « Node 24.16.0, médiane de 5 essais » est une **provenance de mesure** — c'est-à-dire exactement ce que la phase E veut généraliser, donc un **modèle et non une dette**.
  3. **Sous-classement par contexte → 677, puis 537** après retrait de deux motifs que l'échantillon a condamnés : **« désormais »** est presque toujours un connecteur de raisonnement (« le pivot est désormais figé à l'indice 1 », « chaque élément traîne désormais un objet ») et **« la majorité des »** une généralité (« la majorité des cas réels »). À eux deux ils gonflaient le relevé de plusieurs centaines d'occurrences sans en désigner une seule vraie.

  **ET LE RÉSIDU N'EST TOUJOURS PAS PROPRE**, ce qui est le point : « ~8 % des hommes ont une forme de daltonisme » est un fait **stable**, « Chrome 512 » un **effectif de visiteurs** dans une leçon de statistiques, « COBOL 1000-INITIALISER » un **numéro de paragraphe**. La cause est structurelle : les mêmes mots servent à décrire le déroulement d'un algorithme, un fait permanent et une affirmation sur l'état du monde. **Seule la troisième périme, et les distinguer suppose de lire la phrase.**

  **CE QUE CELA IMPOSE À LA SUITE.**
  - **E3 ne peut pas être un détecteur.** Un vérificateur fondé sur des motifs produirait, sur ce corpus, une majorité de faux positifs — il serait ignoré en une semaine. Il faut **inverser la charge** : E2 pose une convention de **marquage explicite**, et E3 contrôle que les marques sont là où on les a mises, et qu'aucune n'a dépassé son seuil d'âge. C'est ce que l'énoncé de E3 pressentait (« il vérifie qu'on **sait** quand on l'a écrite ») ; ce relevé le **démontre**.
  - **E4 doit viser étroit.** La seule cible franche et sans ambiguïté du site est le **tableau de support navigateur** : `css/lecon-40`, `41` et `42` — **les trois seules pages du site qui en portent un** — plus les versions citées dans les exemples de CI et de Docker (`cicd`, `docker`).
  - **Le modèle existe déjà dans le site** : les leçons d'`algo` écrivent « 162 à 165 ms en récursif contre 85 à 87 ms en bottom-up (Node 24.16.0, médiane de 5 essais, un seul algorithme par processus) ». La mesure y est **datée, sourcée et rejouable**. C'est cette forme que E2 doit généraliser, plutôt qu'inventer.

  **⚠ LE CHIFFRE DE CE PLAN NE SE REPRODUIT PAS.** Le constat en tête de la phase E annonce « **51 pages citent un numéro de version, 4 portent une date** ». Le relevé donne **112** et **47**. L'écart vient de la méthode (liste blanche de technologies, prose séparée du code, dates récentes seules retenues), pas d'une évolution du site. Il est écrit ici plutôt que tu.

  **CONTRÔLES** : `node --check` sur l'outil · `verif-html` **0/0** · `verif-donnees` **25 contrôles, 0 erreur** · aucune page modifiée (ce point est un relevé, pas une correction).
- [x] **E2 · La convention de datation.** ✅ **2026-09-03. La convention existe, elle est appliquée sur un cours entier et prouvée dans un vrai Chrome — mais le résultat qui compte est ce qu'elle a révélé : sur les 52 affirmations réellement périssables du cours `react`, 45 (87 %) sont INVISIBLES aux motifs d'E1. Le périssable de ce site n'est presque jamais un numéro de version : c'est un NOM D'OUTIL.**

  **LA CONVENTION**, arrêtée et écrite dans `tools/fraicheur/CONVENTION.md` :

  ```html
  <span class="fraicheur" data-arrete="2026-09-03" data-duree="12">les deux références sont Next.js et React Router</span>
  ```

  - **`data-arrete`, et non `data-verifie`.** Le site ne consulte rien en ligne : il ne *peut pas* vérifier qu'une version est encore la dernière. La date dit donc ce qu'elle dit — *l'état des choses arrêté à ce jour-là*, comme on arrête des comptes. Écrire « vérifié » aurait été faux, et c'est exactement ce que E3 pressentait (« il vérifie qu'on **sait** quand on l'a écrite »).
  - `data-duree` (mois, défaut 18) donne à E3 un seuil différencié : **12** pour un paysage d'outils ou une part de marché, **36** pour ce qui bouge lentement.
  - **Le rendu.** Sans JavaScript : un soulignement pointillé, rien d'autre — la page reste lisible. Avec : **l'année en exposant** juste après le passage (quatre chiffres, l'information *sans survol ni clic*), une infobulle, une alternative `.sr-only`, et **un `<details>` replié en fin d'article** qui liste les passages datés — c'est lui le chemin accessible, l'infobulle n'est jamais le seul.
  - Le moteur est `initFraicheur()` dans `js/main.js` : il couvre donc les **1 782 pages** du site sans qu'un seul fichier HTML ait à charger un script de plus.
  - **Règle de parcimonie, qui prime** : *une marque par affirmation, pas par occurrence.* Une page qui écrit « React 19 » douze fois pour les mêmes nouveautés porte **une** affirmation à dater, pas douze.

  **LE COURS PILOTE : `react`, 26 leçons LUES EN ENTIER** (six relecteurs, lecture seule, aucun n'écrit — seul le pilote écrit). Rendu : **54 affirmations périssables retenues, 264 faux positifs nommés avec leur raison, et 62 affirmations qu'aucun motif n'aurait vues.**

  **CE QUE LE RELEVÉ DIT, ET QUI ORIENTE E4.** Répartition des 54 affirmations :

| Nature | Nombre |
|---|---:|
| **paysage d'outils** (« React Hook Form ou Formik », « TanStack Query ou SWR », « Radix UI, MUI ou Chakra ») | **32** |
| affirmation de récence (« les nouveautés de React 19 », « la direction que prend React ») | 9 |
| domination (« la pratique la plus courante », « la combinaison la plus demandée ») | 9 |
| **numéro de version** | **2** |
| chiffre de performance sans provenance | 2 |

  E1 comptait « 269 dettes de version » sur tout le site. À la lecture, sur le cours le plus exposé, **il y en a deux**. Ce qui périme, ce sont les **noms de bibliothèques tierces** qu'on cite comme « le » choix courant — et aucune de ces phrases ne contient de numéro, de date ni de superlatif.

  **52 MARQUES POSÉES SUR 23 PAGES.** Deux affirmations ont été écartées à la relecture : la citation mot pour mot d'un message d'erreur de React (dater un message n'a pas de sens) et un compte interne (traité autrement, voir plus bas). **Trois leçons n'en portent aucune** — et c'est un résultat, pas un oubli. Durées : **29** à 12 mois, **15** à 18, **8** à 36.

  **LA MESURE QUI TRANCHE, dans les deux sens** (`tmp/recouvrement.js`, motifs d'E1 rejoués sur le texte de chaque passage marqué) :
  - **45 des 52 marques (87 %) sont invisibles aux motifs.** « ton outil de build (Babel) », « des bibliothèques comme *react-use* ou *usehooks-ts* », « la référence est React Hook Form » : ni version, ni date, ni superlatif reconnu.
  - Et réciproquement : des **34** occurrences « nues » que le détecteur d'E1 signalait dans `react`, **7** seulement recouvrent une vraie dette. **Le détecteur se trompait quatre fois sur cinq, et ratait presque neuf dettes sur dix.** E1 avait conclu qu'un vérificateur par motifs serait ignoré en une semaine ; cette mesure le chiffre.

  **L'OUTIL D'APPLICATION** — `tools/fraicheur/appliquer.js`, qui posera aussi les marques d'E4. Il travaille par **ancre exacte** et applique la règle du chantier (« un motif de remplacement trop large casse ce qui était juste ») jusqu'au bout : **c'est tout le lot ou rien**, et il refuse une ancre qui est trouvée un nombre de fois différent de 1, qui tombe dans un bloc de code / un `<head>` / un bloc JSON, qui commence ou finit à l'intérieur d'une balise, qui est à cheval sur une balise, qui recoupe une marque déjà posée, qui vit hors de `<article class="prose">`, ou dont la date est mal formée, impossible (`2026-02-31`) ou dans le futur.

  **⚠ ET IL A ÉTÉ CORRIGÉ TROIS FOIS PAR SES PROPRES FAUX REFUS**, chacun trouvé en le faisant tourner :
  1. il traitait **toute balise** comme une zone à ne pas chevaucher, et refusait donc `… sont <strong>Next.js</strong> et <strong>React Router</strong>` — pourtant légitime. Une ancre peut *contenir* des balises appariées ; ce qu'elle ne peut pas, c'est *commencer ou finir* dans l'une ;
  2. il traitait `<code>` **inline** comme un bloc de code, et refusait « La plupart des applications React ont ainsi un `ThemeContext` » — de la prose contenant un identifiant. La bonne règle : refuser une ancre *contenue* dans un `<code>`, accepter celle qui en *contient* un ;
  3. rien n'interdisait de poser une marque **à l'intérieur d'une marque existante** — le cas s'est présenté dès la première application (une ancre proposée était une sous-chaîne d'une marque déjà posée) et aurait produit une imbrication comptée deux fois à l'affichage.

  **LA PREUVE D'AFFICHAGE.** Une marque de fraîcheur **n'existe pas dans le HTML** : le source ne porte qu'un `<span>`, tout le reste est construit dans le navigateur. Aucun vérificateur lisant des fichiers ne peut donc en dire quoi que ce soit. `tools/fraicheur/verif-affichage.js` ouvre un vrai Chrome et compare, marque par marque : **23 pages, 52 marques, 0 écart** — exposant, année, `aria-hidden`, alternative pour lecteur d'écran, infobulle, identifiant, bilan (compte annoncé, nombre d'entrées, liens qui atteignent leur cible, note), et débordement horizontal. La date en toutes lettres y est **recalculée par une implémentation indépendante** (`Intl`), pas par la table de mois de `main.js` : sinon le contrôle ne prouverait rien.

  **ET LE VÉRIFICATEUR A ÉTÉ ÉPROUVÉ** — `verif-affichage-mutations.js` : **14 fautes injectées une à une dans `js/main.js`, 14 vues, 0 angle mort** (mauvaise année, `aria-hidden` retiré, exposant non inséré, classe `.sr-only` perdue, date absente de l'alternative, infobulle vide, identifiant supprimé, table de mois décalée, bilan absent, bilan déplié, compte faux, lien mort, entrée manquante, note trafiquée), fichier restauré et re-contrôlé vert.

  **⚠ UNE MESURE PRISE TROP TÔT MENT.** La toute première exécution du contrôle a annoncé **6 écarts sur une page qui n'en avait aucun** : Chrome créait son profil, `js/main.js` (chargé en `defer`) n'avait pas encore tourné, et la sonde a lu une page nue. Un délai fixe ne suffit pas — l'outil attend maintenant la **preuve** que le moteur a tourné avant de mesurer quoi que ce soit.

  **TROIS CHIFFRES FAUX TROUVÉS EN CHEMIN, ET CORRIGÉS.** Un relecteur a signalé « C'est la première des **17 leçons** du cours » dans `react/lecon-01` : le cours en compte **26** dans `data.js`. La mesure généralisée (`tmp/compte-lecons.js`, comptes annoncés confrontés à `data.js`) donne **8 occurrences de « N leçons » dans le site, dont 3 fausses** : `react/lecon-01` (17 → 26), `react/lecon-20` (« Pendant 17 leçons » — c'est la 20ᵉ ; la phrase a été débarrassée de son compte) et `html/lecon-42` (« tu as fini les 14 leçons », dans un cours qui en a 47 ; compte retiré). Après correction : **6 occurrences, 0 fausse.** Ce n'est pas une dette de fraîcheur et ça n'a donc **pas** été marqué — un compte interne ne se date pas, il se corrige et se contrôle. **Le périssable le plus sûr d'un site est ce qu'il dit de lui-même**, et c'est exactement le piège de D1.

  **DETTE SIGNALÉE, PAS TRAITÉE** : `react/lecon-26` déclare **3 exercices dans `data-exos` pour 4 blocs `.exercise`** — le 4ᵉ reste sans champ de réponse. Vérifié sur la version d'avant ce point : **préexistant**, sans rapport avec les marques. À traiter en phase F.

  **CONTRÔLES** : `verif.js --rapide` **15 vérificateurs verts (312 s)** · `verif-html` **0 grave / 0 remarque sur 1 629 fichiers** · `verif-donnees` **25 contrôles, 0 erreur** · `verif-rendu` sur 5 leçons marquées × 3 largeurs × 2 thèmes : **0 débordement, 0 contraste insuffisant, 0 repère de focus manquant** (les seules erreurs de console sont les 20 occurrences du défaut préexistant de `lecon-26`) · `node --check` sur `main.js` et les trois outils · CSS : **315 accolades ouvrantes = 315 fermantes, 0 variable `var(--x)` inexistante** · `search-index.js` et `search-lite.js` régénérés, quiz / flashcards / antisèches **identiques** · **0 URL vers `cdnjs`, `fonts.googleapis` ou `fonts.gstatic`** réellement chargée (les deux occurrences de `html/lecon-25` et `lecon-35` sont du texte échappé qui *enseigne* `preconnect`) · **rendu revérifié avec une progression semée dans `localStorage`** (`--progression` : `syntaxe-progress`, `syntaxe-xp`, `syntaxe-quiz`, puis rechargement) — **23 pages, 52 marques, 0 écart**, et la graine est *prouvée présente* (le contrôle échoue si `localStorage` est vide ou si la pastille XP n'apparaît pas : sans cela, « tester avec une progression » aurait été un placebo, ce qu'il était à la première tentative).

- [x] **E3 · Le vérificateur.** ✅ **2026-09-03. `tools/verif-fraicheur.js` existe, il est la 16ᵉ étape de `verif.js` (0,2 s) et 13 fautes injectées sur 13 lui font rougir. Mais son apport principal est un REFUS, et ce refus est MESURÉ : il ne cherche pas le périssable, parce que le meilleur noyau de motifs qu'on puisse construire ne toucherait que 38 % des affirmations réellement périssables — et que le motif central du relevé E1, « un numéro de version », a une précision de 4 %.**

  **CE QU'IL CONTRÔLE** — 9 familles, sur les 1 798 pages HTML du site :

| | contrôle | verdict |
|---|---|---|
| F1 | `data-arrete` présent, format `AAAA-MM-JJ`, jour réel, pas dans le futur | erreur |
| F2 | `data-duree` entier positif s'il est là | erreur |
| F3 | **l'âge** : au-delà de la durée → avertissement ; au-delà du **double** → erreur | les deux |
| F4 | aucune marque dans un bloc de code, un `<head>`, un bloc JSON, un attribut ou un `<code>` | erreur |
| F5 | aucune marque imbriquée dans une autre | erreur |
| F6 | balises appariées à l'intérieur de la marque | erreur |
| F7 | aucune marque hors de `<article class="prose">` (le bilan ne la listerait pas) | erreur |
| F8 | parcimonie : au-delà de 4 marques sur une page | avertissement |
| F9 | marque non vide, et plus courte que 200 caractères | erreur / avert. |

  **L'ÉTAT DU SITE AUJOURD'HUI** : **1 798 pages lues, 23 marquées, 52 marques, 0 erreur, 0 avertissement.** L'outil publie aussi ce qui sert à *planifier* plutôt qu'à rougir : la marque la plus ancienne, et le nombre de marques **à échéance dans moins de six mois** (0 aujourd'hui, elles viennent d'être posées).

  **IL SE PROJETTE DANS LE TEMPS** (`--date=AAAA-MM-JJ`), et c'est ce qui prouve que le seuil d'âge fonctionne vraiment — les 52 marques se répartissent en 29 durées de 12 mois, 15 de 18 et 8 de 36 :

| date de référence | à échéance < 6 mois | avertissements | erreurs |
|---|---:|---:|---:|
| 2026-09-03 (aujourd'hui) | 0 | 0 | 0 |
| 2027-10-03 (13 mois) | 15 | **29** | 0 |
| 2028-04-03 (19 mois) | 0 | **44** | 0 |
| 2029-10-03 (37 mois) | 0 | 8 | **44** |

  Chaque chiffre tombe exactement sur une classe de durée : 29 à 13 mois, 29+15 à 19 mois, et à 37 mois les 44 marques de 12 et 18 mois ont dépassé le double quand les 8 de 36 mois ne sont qu'en avertissement.

  **ÉPROUVÉ PAR L'INJECTION** — `tools/fraicheur/verif-fraicheur-mutations.js` : **13 fautes, 13 vues, 0 angle mort**, page restaurée et re-contrôlée verte. Les fautes : `data-arrete` absent, date au format français, 31 février, date dans le futur, `data-duree` à 0, `data-duree` en toutes lettres, marque imbriquée, marque vide, balises non appariées, marque hors de l'article, marque dans un bloc de code, affirmation deux fois trop vieille, et six marques sur une page.

  **LA SECONDE MOITIÉ DE L'ÉNONCÉ, TRANCHÉE PAR LA MESURE.** Le point demandait aussi de « signaler les affirmations périssables **non datées** ». Plutôt que de trancher d'opinion, on a mesuré : `tools/fraicheur/calibrer.js` confronte **20 formulations candidates** à la seule **vérité terrain** dont dispose le site — les 26 leçons de `react`, lues intégralement, dont les 52 affirmations périssables sont marquées. Pour chaque motif, on compte ses occurrences **dans** une marque et **hors** marque, dans la prose seule (le code est neutralisé). Résultat :

| motif | dans | hors | précision |
|---|---:|---:|---:|
| des bibliothèques comme | 3 | 1 | **75 %** ← le seul retenu |
| quasi systématiquement / presque toujours | 2 | 2 | 50 % |
| « X moderne » (React moderne…) | 2 | 4 | 33 % |
| le plus courant / la plus courante | 2 | 5 | 29 % |
| la plupart des | 1 | 4 | 20 % |
| la référence / les références | 1 | 7 | 13 % |
| deux noms propres reliés par « ou » | 1 | 8 | 11 % |
| **un numéro de version d'un outil** | **4** | **99** | **4 %** |

  Cinq motifs affichent 100 %, mais avec **une ou deux** occurrences : statistiquement, ils ne disent rien. **Un seul candidat sur vingt** dépasse 60 % avec au moins trois occurrences utiles. Et surtout : **les vingt candidats RÉUNIS ne touchent que 20 des 52 affirmations marquées, soit 38 %** — les 62 % restants n'ont ni version, ni date, ni superlatif, ni nom propre reconnaissable.

  **Un détecteur bâti là-dessus signalerait donc environ deux pages sur trois à tort, tout en manquant six affirmations sur dix.** Il serait désactivé dans la semaine, et sa présence donnerait la fausse assurance que le périssable est surveillé. `verif-fraicheur.js` ne le fait pas, et `calibrer.js` reste dans le dépôt pour que ce refus soit **rejouable** plutôt que décrété — et pour qu'on puisse le rouvrir le jour où un autre corpus sera étiqueté (`--cours=`, `--seuil=`, `--exemples`).

  **⚠ RÉSERVE, ÉCRITE PLUTÔT QUE TUE** : cette calibration ne vaut que pour `react`. C'est le cours le plus exposé du site et le seul dont la vérité terrain existe ; rien ne garantit que les mêmes motifs se comporteraient ainsi sur `cloud` ou `docker`. E4 étiquettera d'autres cours — la mesure se rejouera d'une commande.

  **CONTRÔLES** : `node --check` sur les trois fichiers · `verif.js --rapide` **16 étapes, tout vert (298 s)** · `verif-fraicheur` **0 erreur / 0 avertissement** en `--strict` · `verif-html` **0/0** · aucune page modifiée par ce point (le vérificateur ne corrige rien, il constate).

- [x] **E4 · Passer les cours les plus exposés.** ✅ **2026-09-03. Les cinq cours d'infrastructure sont passés : `docker`, `cloud`, `cicd`, `kubernetes`, `iac` — 61 leçons lues en entier, 97 marques posées sur 52 pages, 0 écart dans un vrai Chrome. Et le relevé a rendu autre chose que du périssable : DOUZE RENVOIS INTERNES DEVENUS FAUX parce que les cours ont grandi — des leçons qui se présentent encore comme « la dernière du cours » alors que cinq autres les suivent. Ils sont corrigés.**

  **CE QUI A ÉTÉ PASSÉ, ET POURQUOI CEUX-LÀ.** L'énoncé disait « ceux qui bougent vite en premier — frameworks, outils, cloud, conteneurs ». `react` l'avait été en E2 (le cours de framework le plus exposé du site). Ce point traite le versant infrastructure, **en entier** :

| cours | leçons | marques | leçons sans aucune marque |
|---|---:|---:|---:|
| `docker` | 15 | **27** | 2 |
| `cloud` | 12 | **22** | 1 |
| `cicd` | 11 | **18** | 2 |
| `kubernetes` | 12 | **17** | 0 |
| `iac` | 11 | **13** | 4 |
| **total** | **61** | **97** | **9** |

  Six relecteurs ont lu les 61 leçons intégralement (lecture seule ; un seul écrivain, le pilote). Ils ont rendu **98 affirmations périssables, 382 faux positifs nommés avec leur raison, 101 affirmations qu'aucun motif n'aurait vues, et 12 erreurs factuelles**. Une marque a été écartée à la relecture : `docker/lecon-01` en portait cinq, dont deux disaient la même chose (« Docker est central ») — la règle de parcimonie tranche, on garde la plus précise et la plus fragile (« la brique de base des orchestrateurs comme Kubernetes », que le retrait de dockershim a déjà entamée).

  **LA MESURE DE E2 SE CONFIRME, EN PLUS NET.** Répartition des 98 affirmations relevées :

| nature | nombre |
|---|---:|
| **paysage d'outils** (« Docker Hub est le registre public », « Terraform ou Pulumi ») | **58** |
| domination (« un outil incontournable », « la pratique courante ») | 17 |
| **offre commerciale** (produit, quota, palier de facturation, canal d'installation) | **11** |
| affirmation de récence | 9 |
| chiffre de performance sans provenance | 2 |
| **numéro de version** | **1** |

  **Un seul numéro de version sur 98.** E1 comptait « 269 dettes de version » sur le site ; sur les cinq cours d'infrastructure — précisément ceux où l'on s'attendait à en trouver — il y en a **un**. Et le versant `offre` apparaît ici et n'existait pas dans `react` : Docker Desktop qui change de licence, un quota de registre, un palier de facturation cloud. C'est du périssable pur, et aucun motif ne le voit.

  **SUR L'ENSEMBLE DU SITE MAINTENANT : 149 marques, dont 140 (94 %) invisibles aux motifs d'E1.** La proportion monte de 87 % (react seul) à 94 % : les cours d'infrastructure sont encore plus faits de noms d'outils que les cours de framework.

  **LES DOUZE RENVOIS FAUX, ET CE QU'ILS DISENT.** Le relevé demandait aussi de signaler ce qui est **déjà faux aujourd'hui**. Les relecteurs ont trouvé douze affirmations, toutes de la même famille — **le contenu qui se décrit lui-même, périmé quand le cours a grandi** :

  - `docker/lecon-15` : « **Onze leçons plus tôt**, Docker était un mot mystérieux » — quatorze la précèdent. Et son énumération des acquis s'arrêtait à la leçon 10, ignorant ENTRYPOINT/ARG/ENV, BuildKit, la pile Compose et la gestion de l'espace ;
  - `docker/lecon-06` : « le cours se referme sur un projet de synthèse (**leçon 11**) » — la 11 est « Configurer l'image », le projet est la 15 ;
  - `docker/lecon-03` : le build multi-étapes annoncé comme « l'objet de **la dernière leçon** » — il est enseigné à la leçon 6 ;
  - `cicd/lecon-06` : « **Cette dernière leçon** rassemble les pratiques… » — cinq leçons la suivent. La même page renvoyait les *feature flags* aux sujets « à approfondir » hors du cours, alors qu'ils sont **la leçon 10 du même cours** ;
  - `iac/lecon-06` : « **Dernière étape** […] C'est la synthèse de tout le cours » — la synthèse est la leçon 11, et la page l'admet elle-même plus bas ;
  - `cloud/lecon-07` : « **Dernière étape** : relier toutes les briques » — cinq leçons du même cours suivent ;
  - `kubernetes/lecon-04` : les sondes « qu'on verra **au capstone** » — elles sont enseignées à la leçon 7 ; vestige de la version à 7 leçons ;
  - `iac/lecon-11` : « le projet assemble **les 4 modules** du cours » — il y en a cinq (le cinquième étant ce projet).

  **Les douze sont corrigés**, et à chaque fois qu'un compte pouvait disparaître, il a disparu plutôt que d'être mis à jour : « Onze leçons plus tôt » est devenu « Au début de ce cours ». Un compte interne ne se date pas — il se supprime ou il se contrôle. C'est très exactement le défaut trouvé sur `react` en E2 (« 17 leçons » pour 26) : **il n'était pas isolé, il est systémique, et il frappe toujours les leçons de fin de cours d'un cours qui s'est allongé.**

  **CE QUI N'A PAS ÉTÉ FAIT, ET POURQUOI** — écrit plutôt que tu. Les cours d'écosystème **front** (`nodejs`, `typescript`, `vue`, `sass`, `graphql`, `ml`, `llm`, `data-eng`, `dataviz`) n'ont pas été passés. La raison est nette : le relevé exige une **lecture intégrale** — c'est la conclusion d'E1 et la mesure d'E2 —, chaque vague de six relecteurs couvre une soixantaine de leçons, et le réveil en autorise deux. `react` + les cinq cours d'infrastructure sont ces deux vagues. La suite se fait à l'identique, cours par cours : `tools/fraicheur/appliquer.js` et les relevés archivés dans `tools/fraicheur/releves/` donnent la recette et le format.

  **CONTRÔLES** : `verif-affichage` **75 pages, 149 marques, 0 écart** dans un vrai Chrome · `verif-fraicheur --strict` **0 erreur, 0 avertissement** (1 798 pages lues, 75 marquées) · `verif.js --rapide` **16 étapes, tout vert (283 s)** · `verif-html` **0/0** · `verif-donnees` **25 contrôles, 0 erreur** · `verif-rendu` sur 5 leçons marquées × 3 largeurs × 2 thèmes : **0 erreur, 0 avertissement** · les 8 fichiers corrigés relus : **UTF-8, sans BOM** · comptes « N leçons » du site : **6 occurrences, 0 en désaccord avec `data.js`** · `search-index.js` et `search-lite.js` régénérés.


  🏁 **La phase E est close : 4 cases sur 4.** Le site sait désormais **dire quand il a écrit ce qui périme** — 149 marques sur 75 pages, six cours passés à la lecture, un vérificateur qui se projette dans le temps — et il a découvert au passage que son périssable le plus sûr était ce qu'il disait de **lui-même** : quinze comptes et renvois internes devenus faux parce que les cours ont grandi.

---

## PHASE F — Contrôle final

- [x] **F1 · Non-régression.** ✅ **2026-09-03. La chaîne complète en `--strict` — 28 vérificateurs, 698 s, dont 15 qui pilotent Chrome — rendait DEUX signalements. Les deux étaient réels, et le second était le plus intéressant : un vérificateur qui rougissait en fonction de la charge de la machine.**

  **Mesure de départ, reproduite** : `node tools/verif.js --strict` → **26 étapes vertes, 2 qui signalent** (`contenu` et `stockag`). Les 26 autres — source, données, exemples, motifs, requête, python, erreurs, les quatre du bac à sable Git, alternatives, moteurs, fraîcheur, rendu, err-sql, dec-lec, sql-lec, py-lec, les six études de cas et le hub — sont vertes sans retouche.

  **1 · `contenu --strict` : une leçon sous le standard éditorial.** `doc/lecon-01.html` n'avait **ni schéma SVG (0/1) ni cas réel (0/1)**, seuls critères bloquants de l'outil. Ce n'était pas un faux positif : la leçon la plus dense du cours `doc` était **entièrement faite de tableaux et de prose**, sans un seul schéma, alors que son sujet — l'ordre dans lequel on lit une page de référence — est précisément spatial.
  - Le cours `doc` est **engendré** (`tools/doc/gen.js` depuis `tools/doc/corps/l1.html`), donc la correction est faite dans la SOURCE, jamais dans la page. Un schéma a été écrit : les **huit rubriques dans leur ordre d'écriture** à gauche, les **quatre questions réelles** à droite, et quatre flèches qui montrent que **trois des quatre se règlent sans jamais ouvrir la `Description`** — ce que la prose affirmait déjà sans le montrer. `aria-label` complet, `currentColor` partout (le schéma vit dans les deux thèmes).
  - Le « cas réel » n'a pas été inventé pour satisfaire l'outil : il **existait déjà** sous un titre qui ne le disait pas. La section qui confronte les limites documentées de `slugify()` au corpus du site — **56 titres à l'ancre amputée par une ligature, 0 fragment vide, 0 collision** — est un cas réel de ce dépôt, trouvé en lisant la rubrique `Notes`. Elle s'appelle désormais « Cas réel : … ». Vérifié avant de renommer : **0 lien interne** ne visait l'ancre d'origine.
  - Réassemblage complet du cours : les 4 leçons réécrites, **seule la 01 a changé** (les 3 autres octet pour octet — le générateur est stable). Ses chiffres de corpus sont **recalculés à l'assemblage**, jamais écrits à la main : 1 536 leçons, 74 mentions dans 36 cours, 17 101 titres, 9 575 hors ASCII, 56 ligatures, 9 006 fragments distincts.
  - **Contrôles** : `verif-contenu --strict` **0 leçon sous le standard** (code 0) · `verif-doc` **36/36** · `verif-vocab` **79/79** · `verif-normatif` **60/60** · `verif-html` **1 629 fichiers, 0 grave / 0 attention** · `verif-donnees` **25 contrôles, 0 erreur** · `verif-rendu` sur les 2 leçons `doc` × 3 largeurs × 2 thèmes = **12 mesures, 0 erreur, 0 avertissement** · page relue : **UTF-8 sans BOM, 12 `<svg>` ouverts / 12 fermés, 15 `<figure>` / 15, aucune URL interdite**.

  **2 · `verif-stockage` : 24/25 — et le scénario en échec n'avait RIEN de cassé.** Le scénario « un QCM raté note QUELLES questions » rendait `rates : null`, c'est-à-dire *aucune écriture du tout*. Relancé seul, immédiatement après : **`{"best":1,"total":3,"rates":[0,2]}`, conforme.** Le site n'avait pas bougé — c'est l'outil qui mentait.

  **La cause, et elle vaut d'être retenue** : après `Page.navigate`, l'outil attendait **1 100 ms fixes**, puis cliquait. Ce délai a tenu deux chantiers. Il a cédé le jour où l'outil a tourné en **20ᵉ position d'une chaîne de 28 vérificateurs**, sur une machine qui pilotait Chrome depuis dix minutes : la leçon n'avait pas fini de monter son QCM, le geste a cliqué dans le vide, et le scénario a rougi pour une raison qui n'existait pas dans le site. **Un vérificateur dont le verdict dépend de la charge de la machine ne vérifie plus rien : il tire à pile ou face** — et dans l'autre sens il verdirait tout aussi bien à tort.

  **Correction** : on n'attend plus une DURÉE, on attend un ÉTAT. `attendrePret()` sonde toutes les 100 ms, jusqu'à 15 s, que `document.readyState` vaille `complete` **et** que la condition propre au scénario soit remplie — **16 conditions posées** : `[data-complete-toggle]`, `textarea`, `window.SyntaxeStore`, `window.SyntaxeTheme`, `#exam-start`, `#exam-c`, `.dp-del`, `.course-reset`, et pour le QCM `document.querySelectorAll('.quiz .quiz__q').length === 3`. Si l'état n'arrive jamais, le scénario est **KO en le disant** (« page jamais prête (…) — geste non joué ») : jamais un geste joué à l'aveugle, jamais un vert par patience insuffisante.

  **Un piège rencontré en chemin, qui illustre la règle du chantier** : la première version recopiait la condition du scénario dans un littéral de chaîne pour le message d'erreur. Les conditions contiennent des apostrophes (`querySelector('…')`) → l'expression injectée **ne compilait pas**, ne rendait aucune valeur, et les **25** scénarios sont tombés en « page jamais prête » alors que la page l'était depuis le début. `JSON.stringify`, et relevé explicite de `exceptionDetails` : une expression refusée par la page se lit maintenant comme telle, pas comme une lenteur.

  **Épreuve d'injection faite** : la condition du premier scénario remplacée par `#pas-cet-element-la` → `KO … page jamais prête (condition du scénario non remplie : !!document.querySelector('#pas-cet-element-la')) après 15000 ms — geste non joué`. Fichier restauré, relancé : **25 scénarios, 25 conformes, 0 non conforme.**

  **CE QUI RESTE SIGNALÉ ET NE BLOQUE PAS**, dit sans arrondir — ce sont des jauges éditoriales, pas des fautes, et `verif-contenu` les classe explicitement non bloquantes :
  - **1 leçon « maigre »** : `sass/lecon-09.html`, 4 critères sous la médiane (svg 2<3, encadrés 3<5, glossaire 7<8, mots 2 129<2 159). La jauge est *relative à la médiane du site* : la vider durablement est un objectif qui se déplace tout seul, et la leçon n'a aucun défaut de fond.
  - **biais de longueur des QCM** : sur 6 167 questions, la bonne réponse est strictement la plus longue dans **5 478 (88,8 %)**, « nettement » la plus longue dans **4 315 (70,0 %)**. C'est un chantier éditorial connu (étoffer les distracteurs, jamais raccourcir la bonne réponse). Les options sont mélangées à l'affichage, donc la position ne trahit rien — mais la longueur, si.
  - **rythme des durées** : 90 cours, médiane 54 mots/minute annoncée, **13 cours hors du facteur 2** (de `powershell` à 26 jusqu'à `crypto` à 371). Calibrage, ni erreur ni urgence.
- [x] **F2 · Les mathématiques rejouées.** ✅ **2026-09-03. Les 13 leçons du cours de maths recalculées par une AUTRE méthode que celle qui les a écrites — 6 groupes, 237 contrôles, 8 801 lignes de code de contrôle qui ne lisent jamais le code du cours. Quatre faits publiés étaient faux, dont un que la leçon enseignait deux paragraphes plus haut. Et le contrôle a été mis à l'épreuve : 13 fautes injectées, 13 vues.**

  **POURQUOI UN CINQUIÈME CONTRÔLE.** Le cours `maths` était déjà tenu par deux vérificateurs, et ils ont le même angle mort. `verif-sorties` rejoue le programme publié et compare sa sortie au bloc publié ; `verif-chiffres` exige que chaque nombre de la prose vienne d'une sortie. **Les deux font confiance au PROGRAMME.** S'il calcule faux, il calcule faux des deux côtés et tout reste vert — c'est arrivé au module 1, où `lois.js` annonçait 78 propositions évaluées pour 76 sous deux contrôles verts.

  `tools/maths/verif-verite.js` ne lit pas le code du cours. Il **recalcule les faits** — énumération exhaustive, force brute, arithmétique exacte en BigInt, décodage binaire des flottants, élimination de Gauss — puis confronte le résultat au **texte publié**. Quand le cours dit « 253 paires », il compte les paires ; quand il dit qu'un nombre est premier, il essaie tous les diviseurs ; quand il dit « seuil exact », il cherche le seuil un entier à la fois. `verite/lib.js` ne fournit que l'accès au HTML publié : **aucune arithmétique n'y vit**, pour qu'aucun contrôle ne puisse emprunter sa réponse.

  **A · LES QUATRE FAITS FAUX, ET CE QU'ILS ONT EN COMMUN**

  | leçon | ce qui était publié | ce que le recalcul rend |
  |---|---|---|
  | **04** · `set-vs-tableau.js` | « chercher u0 … Set : **0 accès**, trouvé=true » | **1 accès.** Le programme imprimait `(accesSet === 0 ? 0 : 1)` — une expression évaluée **avant** l'appel qui incrémente le compteur. La première ligne annonçait donc zéro accès pour une recherche qui en coûte un, **dans la leçon même qui enseigne qu'elle en coûte un, toujours**. |
  | **06** · `collisions.js` | colonne « **seuil 50 %** » : 301 à 16 bits, 77 162 à 32 bits | **302 et 77 164.** La colonne n'était pas un seuil, c'était l'approximation 1,1774·√N tronquée — elle **sous-estime** de 1 et de 2. Le tableau posait pourtant une question exacte : « combien de valeurs tirées avant qu'une collision devienne plus probable qu'improbable ». |
  | **02** · prose | « **18** propositions, 17 vérifiées, **1** réfutée » | `lois.txt` publie lui-même « **19** propositions testées, 17 vérifiées, **2** réfutée(s) ». |
  | **cours.html** · récapitulatif | idem, « 18 / 17 / 1 » | idem. Le même chiffre faux, recopié dans la page de cours. |

  Le point commun des quatre : **aucun outil du dépôt ne pouvait les voir.** Les deux premiers sont des programmes qui calculent faux — `verif-sorties` compare la sortie au programme, et le programme était d'accord avec lui-même. Les deux derniers sont de la prose qui contredit une sortie **du même fichier** : personne ne recomptait.

  **Corrections.** Leçon 04 : l'écart du compteur est **affiché**, jamais un chiffre posé à la main (`accesSet - avantCe`), et le commentaire du programme raconte la faute. Leçon 06 : le tableau a désormais **deux colonnes séparées**, « seuil exact » et « approché », et le programme **cherche vraiment** le seuil exact tant qu'il est atteignable (plafond de 10⁶ tirages) ; au-delà de 32 bits il écrit **« hors portée »** au lieu de faire passer un ordre de grandeur pour une réponse, et cinq lignes de prose disent pourquoi. Vérifié en exécutant : 302 et 77 164 sont bien les plus petits k tels que p(collision) ≥ ½, décidés par comparaison d'**entiers** (2·∏(N−i) ≤ N^k), sans un seul flottant.

  **B · CE QUI EST MESURÉ**

  | | |
  |---|---|
  | `tools/maths/verite/groupe-1..6.js` | **237 contrôles**, 6 groupes (01-03, 04-06, 07-08, 09, 10-11, 12-13), **470 Ko** de code — plus gros que le cours qu'il juge |
  | `node tools/maths/verif-verite.js` | **237 contrôles, 237 concordants, 0 divergent** en 17,5 s |
  | `verif-sorties` sur les 13 leçons | **105 blocs de sortie rejoués, 105 identiques au caractère près, 0 divergent** |
  | régénération des modules 3, 4 et 5 | les **7 leçons engendrées (07→13) reproduites à l'octet près** : les sources et les pages ne divergent pas |
  | `verif-rendu` sur les 4 pages touchées | 4 pages × 3 largeurs × 2 thèmes = **24 mesures, 0 erreur, 0 avertissement** (le tableau de la leçon 06 est passé de 78 à 92 colonnes : vérifié qu'il ne déborde pas à 320 px) |

  **C · L'ÉPREUVE — parce qu'un contrôle toujours vert ne prouve rien.** `tools/maths/preuve-injection.js` abîme le cours, une leçon à la fois : il remplace un fait chiffré par un fait faux dans la page **publiée**, relance le groupe qui couvre cette leçon, et **exige qu'il rougisse**. Puis il restaure la page et **relit le fichier** pour vérifier qu'elle est revenue à l'octet près.

  Les treize fautes sont choisies dans treize leçons et treize familles de faits : un nombre de la prose (2^20 = 1 048 579), un compteur d'appels (« estValide appelée 3 fois »), un résultat de dénombrement (475 000 destinataires), une colonne entière (l'approximation recopiée sous « seuil exact »), un reste modulaire (−5 mod 3 = 2), une densité de premiers (78 598 sous un million), un compte de décimales IEEE 754 (56 au lieu de 55), un nombre d'arêtes (11 au lieu de 10), une somme de colonne stochastique (1,5 au lieu de 1), un rang de bascule (n = 1 655), un logarithme (9,976). **Résultat : 13 posées, 13 VUES, 0 manquée**, et chaque page restaurée à l'identique.

  Deux des injections méritent d'être citées. Celle de la leçon 11 n'a pas été inventée : le réveil précédent avait laissé `archive=7.000` dans `marche.txt` — une injection non restaurée. **Le contrôle l'a trouvée sans qu'on la lui annonce**, en recalculant que la colonne d'une page-puits somme à 1. Celle de la leçon 06 vise le contrôle **écrit ce réveil** : il exige désormais « hors portée » dans la colonne exacte au-delà de 64 bits, précisément pour que le défaut corrigé ne puisse pas revenir.

  **D · LES DEUX CONTRÔLES ENTRENT DANS LA CHAÎNE.** `verif.js` passe de 16 à **17 vérificateurs** en `--rapide` (nouvelle étape `maths`, 17,5 s, aucun navigateur), et l'épreuve d'injection rejoint `mutants` en `--complet` sous le nom `mathinj` — les deux seules étapes qui **jugent les autres**. Chaîne relancée en entier : `node tools/verif.js --rapide` → **17 étapes, tout vert, 348 s**.

  **CONTRÔLES** : `verif-html` **1 629 fichiers, 0 grave / 0 attention** · `verif-donnees` **25 contrôles, 0 erreur** · `node --check` sur les 9 fichiers JS écrits · **0 BOM**, UTF-8 sur les 4 pages et les 9 outils · **0 URL interdite** dans `pages/maths/` et `tools/maths/` · index dérivés régénérés (`search-index.js`, et `flashcards-data.js` qui était **resté périmé depuis E4** — une marque de fraîcheur d'`iac` n'y était pas ; `search-lite` et `antiseches` étaient déjà à jour).

  **CE QUI N'A PAS ÉTÉ FAIT, ET QUI EST UNE VRAIE TROUVAILLE.** En lançant `verif-sorties` sur **tout** le site pour situer le cours de maths, deux divergences apparaissent **hors** du cours — et elles survivent parce que **`verif-sorties` n'est dans aucun mode de `verif.js`**, pas même `--strict` (F1 a passé 28 étapes sans lui) :
  - `pages/doc/lecon-02.html` · `vocab-concurrence.txt` : **4 lignes publiées, 4 lignes rendues `undefined`** — la sortie est produite de façon asynchrone et le banc ne la capte pas ;
  - `pages/offensive/lecon-07.html` · `cout.txt` : **dépassement du délai de 10 s** dans le bac à sable `vm` — le piège connu (le `vm` peut être dix fois plus lent que le navigateur), donc probablement pas une faute de contenu, mais un bloc **non jugé** en pratique.

  Aucune des deux ne touche les mathématiques, donc aucune n'entre dans F2 ; les deux sont reportées à **F5**, avec la question qui les commande : **faut-il faire entrer `verif-sorties` dans la chaîne ?** Tant qu'il n'y est pas, 449 blocs de sortie du site ne sont rejoués que si quelqu'un y pense.
- [ ] **F3 · Le visualiseur, éprouvé.** Chaque exemple pré-chargé s'ouvre et se déroule jusqu'au bout, réseau coupé.
- [ ] **F4 · Mesure globale.** Études de cas publiées, notions visualisées, leçons de maths, pages datées. Comparer aux chiffres du constat en tête de ce fichier.
- [ ] **F5 · Ce qui n'a pas été fait.** Lister et expliquer, sans arrondir.

---

## Fin de chantier

Quand toutes les cases sont cochées, le wrapper déclenche la **passe de sécurité** : vérification
globale, rapport dans `VERIF-FINALE.md` avec un verdict en première ligne, puis extinction automatique
si le verdict est vert.
