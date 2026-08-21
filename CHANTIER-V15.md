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

- [ ] **A1 · Le format et la première étude.** Créer le gabarit (page, CSS, navigation) et la première étude de cas de bout en bout : un programme JavaScript d'environ 150 lignes, exécutable dans le site. Le gabarit compte autant que le contenu : les six suivantes s'y couleront.
- [ ] **A2 · Lire le code de ce site (1) — le moteur d'exercices.** `js/lecon.js` : comment une leçon devient interactive. Le meilleur code à lire est celui dont on utilise le résultat tous les jours.
- [ ] **A3 · Lire le code de ce site (2) — la recherche.** `js/recherche.js` et l'index généré : pourquoi un index pré-calculé, ce qu'il coûte, ce qu'il évite.
- [ ] **A4 · Un programme mal écrit, et sa réécriture.** Le même besoin, deux fois : la version qui marche mais qu'on ne peut pas maintenir, puis la version propre. Nommer précisément ce qui change, sans jamais dire seulement « c'est plus propre ».
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
