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
- [ ] **A5 · Lire un algorithme historique.** Un algorithme du domaine public (Dijkstra, Huffman, ou l'algorithme d'Euclide étendu — qui resservira en cryptographie), lu comme du code, pas comme une formule.
- [ ] **A6 · Lire du code dans un langage qu'on ne connaît pas.** La compétence réelle : deviner ce que fait un programme Go ou Rust quand on ne fait que du Python. Ce qui se devine, ce qui ne se devine pas, et par quoi commencer.
- [ ] **A7 · Le hub des études de cas** et les renvois depuis les cours concernés. Ajouter la page à la navigation et au catalogue.

---

## PHASE B — Voir un programme s'exécuter

Le site explique la pile d'appels dans 48 leçons et ne la montre jamais. `js/visualisations.js` prouve
pourtant que la technique est maîtrisée : il instrumente un algorithme en une liste d'étapes, puis
rejoue l'animation. Il ne sait faire que les tris.

- [ ] **B1 · Choisir la technique, en la mesurant.** Trois options, à évaluer honnêtement avant d'écrire une ligne : (a) un **mini-interpréteur JavaScript** qui exécute pas à pas — le plus puissant, le plus long ; (b) une **réécriture du source** qui insère des points d'arrêt — plus court, mais fragile sur les cas tordus ; (c) des **scénarios pré-enregistrés**, comme le fait déjà `visualisations.js` — modeste, éprouvé, et suffisant pour enseigner. **Écrire la recommandation et son raisonnement ici, puis appliquer.** Si le V14 a produit un interpréteur, le réutiliser plutôt qu'en écrire un second.
- [ ] **B2 · L'affichage.** Le code à gauche avec la ligne courante surlignée, à droite les variables, la pile d'appels, et ce qui a été affiché. Boutons : pas suivant, pas précédent, tout dérouler. C'est le cœur : soigner la lisibilité avant d'ajouter des fonctions.
- [ ] **B3 · La récursivité.** La pile qui monte et qui redescend — la seule façon de comprendre vraiment, et la notion sur laquelle butent le plus d'apprenants. Factorielle, Fibonacci, parcours d'arbre.
- [ ] **B4 · Portée, fermetures, `this`.** Trois notions que le site explique bien mais que voir tranche définitivement.
- [ ] **B5 · L'asynchrone.** La file des tâches, la boucle d'événements, l'ordre réel d'exécution d'un `setTimeout` et d'une promesse. Purement JavaScript, donc exécutable en `file://`.
- [ ] **B6 · Relier aux leçons.** Chaque leçon qui parle de pile, de portée, de récursivité ou d'asynchrone renvoie au visualiseur, avec l'exemple pré-chargé. Un visualiseur qu'on ne trouve pas ne sert à personne.

---

## PHASE C — Les mathématiques de l'informatique

Cours neuf, **un module par case**, environ 13 leçons. Il ne s'agit pas d'un cours de mathématiques :
il s'agit des mathématiques **dont on se sert**, chacune reliée à un endroit du site où elle sert
déjà. Chaque notion s'accompagne de code qui la met en œuvre — et ce code est **exécuté** avant
d'être publié.

Ce cours est aussi la fondation manquante de trois cours du V13 : la cryptographie a besoin de
l'arithmétique modulaire, les réseaux de neurones de l'algèbre linéaire et des dérivées, les systèmes
distribués de la théorie des graphes.

- [ ] **C1 · Module 1 — Logique et booléens** (3 leçons) : propositions, tables de vérité, lois de De Morgan, ce qu'un `if` complexe veut vraiment dire. Renvoie aux leçons de conditions de tous les cours.
- [ ] **C2 · Module 2 — Ensembles, dénombrement, probabilités** (3 leçons) : ce qui fonde les tables de hachage, les collisions, et l'incertitude en apprentissage automatique.
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
