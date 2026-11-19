# C10 — groovy, 87,0 % → 25,0 % (23,8 % à la fin de la vague ; reprise § 8)

Copie de travail `D:\test-claude-c10-groovy`, branche `v18/c10-groovy`, partie de `8d163bf`. Un seul
agent pour tous les rôles. Aucun fichier modifié sous `D:\test-claude\`. Pièces de travail (hors git)
dans `scratchpad/c10-groovy/` : `depart/` et `fin/` (sorties brutes des outils avant et après),
`vague/` (les lots de patchs), `preuves/` (scripts Groovy exécutés et leurs sorties `-g4.out` /
`-g5.out`), `sonde/` (`atelier.js`, `cand.js`, `dosage.js`, `controle.js`, `pose.js`, `corps.js`,
`extrait.js`, `vocab.js`, `lots.js`, `bilan.js`). Consigne du cours versionnée :
`scratchpad/CONSIGNE-GROOVY.md`.

**Aucune atteinte à l'intouchable** : `node tools/mesure-qcm-intouchable.js groovy 8d163bf` →
« 54 questions, 162 distracteurs, 157 réécrits. Aucune atteinte : q / correct / explain / bonne
réponse intacts. » Aucune bonne réponse ni aucun explain n'a été prouvé faux (voir § 4, deux
imprécisions signalées et laissées).

## 1. Avant / après

| indice | avant (`8d163bf`) | après (`5b89054`) | commande |
|---|---:|---:|---|
| la plus longue | **87,0 %** | **23,8 %** | `node tools/mesure-biais-qcm.js --seul=groovy` |
| pire des 44 stratégies | 87,0 % (la plus longue) | **26,2 %** (ECARTER la plus dense) | id. |
| la plus détaillée / incise / point-virgule | 70,4 / 69,0 / 36,1 % | 25,0 / 25,0 / 25,0 % | id. |
| mot technique exclusif / écho | 63,9 / 54,5 % | 24,7 / 25,0 % | id. |
| la plus dense / la moins bavarde | 21,6 / 4,8 % | 24,7 / 26,1 % | id. |
| questions trahies par 5 indices ou plus | 38 sur 54 | **0** | id. |
| rangs de la bonne réponse (0 = la plus longue) | 48 / 5 / 0 / 1 | 16 / 15 / 11 / 12 | `node tools/plan-rangs-qcm.js groovy` |
| rangs 2, 3, 4 (réussite) | 7,4 / 1,9 / 3,7 % | 25,6 / 24,7 / 25,9 % | `mesure-biais-qcm` |
| distracteurs hors de la bande 70-130 % | 133 | 0 | `atelier.js --resume` |
| lexique (exploitables / retournées / à mettre en forme) | 45 / 19 / 46 | **0 / 0 / 0** | `node tools/mesure-lexique-qcm.js --liste=groovy` |
| mot fétiche | 1 alerte (`groovy` 14 / 1, 43,5 %) | 0 | `node tools/mesure-mot-fetiche.js groovy` |
| tics de lot | 8 | 0 | `node tools/mesure-tics-lot.js groovy --exemples` |
| biais inverse | 4 alertes (rangs 2, 3, 4, moins bavarde) | 0 | `node tools/mesure-biais-inverse.js --toutes groovy` |
| intrus lexical DÉFAUT / EXCÈS (sûres) | 23,6 % / 34,1 % (5 sûres) | 24,5 % / 24,5 % (0) | `node tools/mesure-mot-question.js groovy --liste` |
| point interne | 1 question (100 %) | 0 | `node tools/mesure-point-interne.js` |
| `--lots` et `--lots=3` | non mesuré (cours non marqué) | **muets** | `node scratchpad/c10-groovy/sonde/lots.js` ¹ |
| explications orphelines | — | 0 | `node tools/mesure-explain-orpheline.js --depuis=8d163bf --seul=groovy` |

¹ `--lots` ne regarde que les cours marqués `traite` : `lots.js` marque `groovy` dans
`tools/qcm-biais-reference.json` le temps de la mesure et remet le fichier **octet pour octet**
(vérifié par le script ; `git status` propre ensuite).

## 2. Ce qui a été écrit

- **157 distracteurs réécrits sur 162**, 3 021 → 14 265 caractères (+11 244) ; **5 gardés** :
  `lecon-09` q3 « RSpec », `lecon-14` q6 « let x = 5 », q12 « JsonOutput », q13 « RSpec », q15
  « owner ». (`node scratchpad/c10-groovy/sonde/bilan.js 8d163bf`)
- Ordre suivi : mesure, preuves, consigne, vague par lots commités (A : 01-04, B : 05-08, C : 09-13,
  D : 14), dosage calculé (`dosage.js` : la marge à combler, question par question), relecture par
  contradiction, fermeture du tic de lot révélé par `--lots`, contre-relecture.
- Commits : `89bf9d9` (consigne + corps), `98becbf`, `bcc66e5`, `f5813c0`, `2ff578d` (vague),
  `0575393` (dosage), `d53361f` (relecture), `5b89054` (tic de lot).

## 3. Fautes de fond trouvées et corrigées (toutes exécutées, Groovy 4.0.33 ET 5.1.3)

Corps des leçons (`scratchpad/c10-groovy/preuves/p01.groovy`, `p05.groovy`, `p06cs.groovy`,
`p10.groovy`, `p10b.groovy`, `p11xml.groovy`, `p07.groovy`) :

1. `lecon-02`, figure `types.groovy` : `println 5.times { print "*" }   // *****` affiche en réalité
   `*****null` (`times` rend `null`). → `5.times { print "*" }`.
2. `lecon-06`, encadré Astuce : une propriété mal orthographiée dans le constructeur par map
   « échoue silencieusement ». Faux : `groovy.lang.MissingPropertyException: No such property: non
   for class: Produit` à l'exécution ; sous `@CompileStatic`, « [Static type checking] - No such
   property: non for class: Produit2 » à la compilation. → « ne se voit qu'à l'exécution, par une
   `MissingPropertyException`… sauf si tu actives `@CompileStatic` ».
3. `lecon-10`, figure `etat.groovy` : `int incrementer() { ++n }` dans un trait **ne compile pas** :
   « Prefix expressions on trait fields/properties are not supported in traits ». →
   `n += 1` (rend 2, une copie par objet : 2 et 1).
4. `lecon-11`, figure `xml.groovy` : `new XmlSlurper()` sans import **ne compile pas** (« unable to
   resolve class XmlSlurper », `groovy.xml` n'est pas importé d'office en Groovy 4 et 5). → import
   ajouté ; la figure, extraite de la page, s'exécute (Ada / ops / Ada / Lin).
5. `lecon-11`, figure `builder.groovy`, et `lecon-13`, encadré Rappel : la sortie de `MarkupBuilder`
   était écrite sur une ligne ; la sortie par défaut est **indentée sur plusieurs lignes** (exécuté).

QCM :

6. `lecon-14` bilan q6 : le distracteur « `var x = 5` » était **VRAI** — `var` existe depuis
   Groovy 3 ; exécuté, il compile et rend 5 (et accepte ensuite une valeur d'un autre type). →
   « `val x = 5` » (« unable to resolve class val »).
7. `lecon-14` q3 : l'explain cite `JsonSlurper` ; une fois l'option `JsonSlurper` réécrite,
   `mesure-explain-orpheline` voyait une explication orpheline → une option `JsonSlurper` est revenue
   (« `JsonSlurper.prettyPrint(rapport).collect()` », `MissingMethodException`, exécuté).

Toutes les figures de code autonomes des pages (47) ont été extraites telles qu'affichées et exécutées
sous Groovy 5.1.3 (`preuves/figures.sh`, `figures-g5.out`) : après correction, chacune donne la sortie
annoncée (les deux sans sortie sont une classe sans `main` et un builder sans `println`, attendu).

## 4. Signalé, non touché

- `lecon-01` q3, **bonne réponse** « L'égalité de contenu (il appelle equals et gère null) » :
  simplification. Pour un `Comparable`, `==` passe par `compareTo` : `new BigDecimal("1.0") ==
  new BigDecimal("1.00")` vaut `true` alors que `equals` vaut `false` (exécuté). La documentation de
  Groovy dit elle-même « it is calling equals » : non prouvée fausse, laissée.
- `lecon-11` q3, **explain** « `page.ul { li 'x' }` produit `<ul><li>x</li></ul>` » : l'arbre est
  juste, la chaîne produite est indentée (`"<ul>\n  <li>x</li>\n</ul>"`, exécuté). Intouchable,
  laissée ; le corps, lui, a été corrigé (§ 3, 5).
- `lecon-14` bilan q5, explain « Les apostrophes simples ne font pas d'interpolation » : aucune
  option ne parle plus des apostrophes (les mots `apostrophes` et `simples` sont absents de la page
  `lecon-14` et rouvraient le lexique). Cas « indicatif » de `mesure-explain-orpheline`, non bloquant.
- Corps, simplifications non prouvées fausses : `lecon-09` « bytecode JVM identique à celui de Java :
  à l'exécution, ils sont indiscernables » (le bytecode de Groovy passe par ses sites d'appel
  dynamiques) ; `lecon-10` « Chaque classe qui l'implémente reçoit sa propre copie de cet état » (la
  copie est par OBJET, ce que dit la phrase suivante) ; `lecon-12` Piège « Spock enregistre l'attente
  dans then, puis la confronte » (Spock déplace l'interaction avant le `when:`) ; `lecon-08`
  exercice 3 « l'ancien Maven » (Maven est toujours courant).
- `lecon-14` q11 : « mixin » est un concept (le glossaire de `lecon-10` le définit), pas un mot-clé
  de Groovy — le distracteur est faux comme « mot-clé », mais un apprenant pourrait le discuter.

## 5. Exécuté / non exécuté

**Exécuté** : distributions binaires **officielles** d'Apache Groovy **4.0.33** et **5.1.3**
(`downloads.apache.org`, SHA-256 vérifiés `395a69a8…855d93d` et `9f53e2c2…f67a014`), extraites dans
`D:\outils-c\groovy\`, sous Java 27.0.1. Chaque comportement affirmé par un distracteur l'a été :
`p_lotA.groovy` (lot A), `p_lotB.groovy`, `p_l10q3.groovy` et `p_lotC.groovy`, `p_lotD.groovy`,
`p_lotD2.groovy`, `p_lotD3.groovy`, `p_dosage.groovy`, `p_q3.groovy`, `p_releve.groovy`. Sorties
identiques sous 4 et 5, sauf un point relevé et non employé : deux interfaces `default` en conflit
(Groovy 4 prend la dernière, Groovy 5 refuse à la compilation). `groovy -e "println 2 ** 10"` → 1024.

**Non exécuté** (documentation seulement) : Gradle (`build.gradle`, tâches, wrapper), Jenkins
(pipelines déclaratif et scripté), **Spock** (blocs, `where`, Mock / Stub : le moteur JUnit Platform
n'est pas installé), `@Grab` (dépôt Maven distant), groovyConsole, groovysh, SDKMAN!.

## 6. Ce que ce cours a appris

- **Le distracteur VRAI venait du temps qui passe** : `var` (Groovy 3) a rendu juste un distracteur
  écrit pour Groovy 2. Dans un langage qui grandit, une « syntaxe inexistante » s'exécute avant
  d'être écrite (la consigne le dit pour `var`, `->`, `::`, `===`).
- **La règle du `k` sur une page de bilan** : la page de référence de `lecon-14` ne contient pas le
  vocabulaire des autres leçons (`dynamique`, `typage`, `statique`, `optionnel`, `gradle`,
  `automatisation` y sont absents) ; les bonnes réponses du bilan ont donc `k` = 2 à 4, et les
  distracteurs ont repris exactement ces mots étrangers (règle `k/k/k/k` et `w` égal).
- **Fermer l'intrus lexical par ÉCHANGE, pas par retrait** : chaque fois qu'un mot était porté par
  trois options, l'ajout au quatrième ou le retrait d'un deuxième a dû garder un mot propre à la
  bonne réponse — sinon la lecture EXCÈS désigne les trois distracteurs et l'inverse devient sûr.
- **La densité se concentre par lot** : après le dosage, « la plus dense » valait 25 % sur le cours
  et **58,3 % sur la fenêtre `lecon-02` à `05`** (les bonnes réponses de ces leçons sont des phrases
  techniques denses). Le cours ne le voyait pas ; `--lots` (cours marqué le temps de la mesure) l'a vu.
  Trois bascules dans 02-05, deux compensations dans 13-14 : fenêtres muettes à 4 et à 3 leçons.
- **Un explain cite une option** : réécrire tous les distracteurs d'une question peut effacer ce que
  l'explication commente (`JsonSlurper`) ; `mesure-explain-orpheline` l'a vu, la relecture non.
- **Le dosage se calcule** : 26 retouches choisies par l'écart au seuil (`dosage.js`) ont ramené « la
  plus dense » de 37,0 à 24,7 % et « la moins bavarde » de 33,5 à 26,1 % sans rouvrir d'autre indice ;
  les égalités de longueur (rangs ex æquo) faussaient « la plus longue » vers le bas (19,8 %) avant
  d'être cassées.

## 7. Ce qui reste, sans arrondir

- Pire stratégie : **ECARTER la plus dense 26,2 %** ; la moins bavarde **26,1 %** ; QUATRIÈME plus
  longue 25,9 %. Rangs 16 / 15 / 11 / 12 en comptage strict (des égalités de longueur dans les
  questions à jetons du bilan comptent au rang 0) : la plus longue 23,8 %.
- Signaux locaux sans effet sur le cours : `lecon-14` q12 (« le mot technique exclusif » désigne
  3 options sur 4 : `JsonSlurper`, `JsonOutput`, `JsonGenerator`), q2 (intrus EXCÈS désigne le seul
  `collect`), q8 (« RESTREINDRE à la parenthèse » désigne le seul `$(…)`).
- Les cliquets `verif-qcm-biais.js` et `verif-qcm-lexique.js` signalent « progressé sans que le gain
  soit figé » (87,0 → 24,7 % ; STRICTE 63,6 → 0,0 %) : à refiger par l'orchestrateur à la fusion.
  `verif-donnees` : 3 erreurs I18 (index `quiz-index.js` et `search-index.js` périmés, attendu) et
  3 avertissements anciens hors `groovy` (I17 `zig`, I19, I25 `doc`). `verif-html` : 0 problème.
  `verif-contenu` : 1 551 « Cas réel » conformes sur 1 551 (aucun encadré touché).
- `node tools/verif.js --rapide` (926,6 s, sans `--mutations`) : **6 signalés**. Cinq attendus :
  `donnees` (I18), `qcmbiai`, `qcmlexi`, `etudes` et `normatf` (8 contrôles en échec sur 75, chiffres
  mesurés sur tout le site). Le sixième, `etude-6` (`preuves/etude-inconnu.js`), est de la même
  famille : la taille du corpus mesurée sur **le site entier** passe de 6560.6 à 6560.7 Ko parce que
  les distracteurs sont plus longs (+11 244 caractères) ; la page dérivée publiée porte l'ancien
  chiffre et se reproduit à la fusion par l'orchestrateur (pages dérivées hors de mon périmètre).
- **Contre-relecture indépendante** : à faire par l'orchestrateur. La mienne : la relecture par
  contradiction a reformulé 9 distracteurs (`d53361f`) ; la contre-relecture de mes propres
  retouches en a repris 3 — `lecon-07` q2 « comme les méthodes » (raccourci pour le dosage, devenu
  obscur, rendu à « comme pour les méthodes »), `lecon-09` q1 (la relecture avait créé une égalité de
  longueur, cassée), `lecon-14` q1 (« rend une map » sans sujet, rendu à « elle rend »).

## 8. Reprise — le dosage qui restait après la contre-relecture

La contre-relecture indépendante (`71ccc28`) a corrigé 16 fautes, dont cinq distracteurs vrais par
accident, et une explication (`lecon-11` q3). Ces corrections justes avaient rouvert l'indice lexical.
La reprise (`c51a39f`) le referme **sans défaire le sens d'une seule de ces corrections** : chaque
distracteur qu'elles ont rendu faux le reste, seuls les mots ont changé. Sorties brutes :
`scratchpad/c10-groovy/reprise/avant/` et `apres1/` ; banc et garde-fou : `sonde/atelier.js` et
`sonde/controle.js --ref=HEAD` (8 questions déplacées, toutes voulues).

### Avant / après

| indice | avant (`71ccc28`) | après (`c51a39f`) | commande |
|---|---:|---:|---|
| lexique (exploitables / retournées / à mettre en forme) | **6 / 4 / 7** | **0 / 0 / 0** | `node tools/mesure-lexique-qcm.js --liste=groovy` |
| la plus longue | 23,1 % (rendement 22,4 %) | **25,0 %** (rendement 24,5 %) | `node tools/mesure-biais-qcm.js --seul=groovy` |
| pire des 44 stratégies | 26,2 % (DEUXIÈME plus longue) | **25,9 %** (la plus dense) | id. |
| DEUXIÈME / TROISIÈME / QUATRIÈME plus longue | 26,2 / 25,3 / 25,3 % | 24,4 / 25,3 / 25,3 % | id. |
| la plus dense / la moins bavarde / ECARTER la plus dense | 25,9 / 25,6 / 25,6 % | 25,9 / 25,6 / 25,6 % | id. |
| le mot technique exclusif (couverture) | 23,8 % (5,6 %) | 24,7 % (3,7 %) | id. |
| questions trahies par 5 indices ou plus | 0 | 0 | id. |
| rangs de la bonne réponse | 15 / 16 / 11 / 12 | 16 / 15 / 11 / 12 | `node tools/plan-rangs-qcm.js groovy` |
| biais inverse | 0 alerte (pire 25,9 %) | 0 alerte (pire 25,8 %) | `node tools/mesure-biais-inverse.js --toutes groovy` |
| mot fétiche | 0 alerte | 0 alerte | `node tools/mesure-mot-fetiche.js groovy` |
| tics de lot | 0 | 0 | `node tools/mesure-tics-lot.js groovy --exemples` |
| `--lots` et `--lots=3` | muets | muets | `node scratchpad/c10-groovy/sonde/lots.js` (référence remise octet pour octet) |
| intrus DÉFAUT direct / inverse | 23,1 / 25,6 % | 24,1 / 25,3 % | `node tools/mesure-mot-question.js groovy --liste` |
| intrus EXCÈS direct / inverse | 24,1 / 25,3 % (1 question sûre par l'inverse : `lecon-06` q3) | 25,0 / 23,8 % (0) | id. (l'inverse sûr : `sonde/atelier.js`) |
| explications orphelines | 0 (2 indicatives) | 0 (les 2 mêmes indicatives) | `node tools/mesure-explain-orpheline.js --depuis=8d163bf --seul=groovy` |
| intouchable | 1 atteinte, déclarée (`lecon-11` q3, explain) | la même, aucune autre | `node tools/mesure-qcm-intouchable.js groovy 8d163bf` |
| `verif-html` / « Cas réel » | 0 / 14 sur 14 | 0 / 14 sur 14 | `node tools/verif-html.js` ; `node tools/verif-contenu.js --cas-reel --cours=groovy` |
| blocs JSON / CR / BOM | 29 valides / 0 / 0 | 29 valides / 0 / 0 | contrôle node sur `pages/groovy/*` |

### Les retouches (8 distracteurs, 1 ligne de corps)

Chaque comportement affirmé a été **exécuté** sous Groovy 4.0.33 et 5.1.3 (Java 27.0.1) :
`scratchpad/c10-groovy/preuves/p_reprise.groovy`, sorties `p_reprise-g4.out` et `-g5.out`.

1. `lecon-05` q3 (correction de la contre-relecture : `map.get('ada')` rendait 36) — `map.getAda()` →
   `map.ada()` : le jeton `getada` était étranger à la page. Même thèse (une notation d'appel de
   méthode qui ne lit pas la clé) : exécuté, `MissingMethodException` sous 4 et 5 (comme `getAda()`).
2. `lecon-06` q3 (correction : la description de `@TypeChecked`) — « vérifié à la compilation » →
   « vérifié par le compilateur », « ce qui la rend plus sûre » → « ce qui apporte la sûreté » : w 10 → 12
   (`apporte`, `sûreté`, `compilateur` sont dans la page). Effet voulu : la bonne réponse retrouve un mot
   propre (`compilation`), et l'intrus EXCÈS ne la désigne plus par élimination (elle était la seule
   option sans mot propre : écarter les trois autres la donnait à coup sûr). Non exécuté (même sens).
3. `lecon-07` q1 (correction : la classe `String` reste intacte) — « sans toucher les chaînes
   existantes » → « sauf pour les chaînes existantes » : w 12 → 11, même nombre de mots, densité gardée.
   Exécuté : une chaîne créée AVANT `String.metaClass.crier = …` reçoit la méthode (« ADA ! »).
4. `lecon-09` q1 (correction : la classe du JDK déjà sur le classpath) — « dans le script, sans la
   télécharger » → « dans le script Groovy, sans télécharger » : w 9 → 10, et `groovy`, porté par les
   trois autres options, désignait celle-ci (intrus DÉFAUT). Non exécuté (`@Grab` : dépôt distant).
5. `lecon-10` q1 (correction : une propriété `static` est bien partagée) — « (ses propriétés d'objet) »
   → « (les propriétés des objets) » : `d'objet` était étranger à la page. Exécuté : `x.n = 5`, `y.n` vaut
   toujours 0 (une copie par objet).
6. `lecon-14` q8 (correction : l'explication orpheline « apostrophes simples ») — l'option de la
   contre-relecture est gardée **mot pour mot**. Les mots `apostrophes` et `simples` manquaient à la page :
   une ligne ajoutée au mémo du corps, « Ne pas interpoler — `'${expr}'` (apostrophes simples : le texte
   reste tel quel) », exécutée (`'${nom}'` reste `${nom}`, une `String`). Et le distracteur `%s` passe
   des guillemets doubles aux apostrophes simples (`'%s'` reste `%s`, exécuté) : deux options de chaque
   côté, l'intrus (DÉFAUT et EXCÈS) et le mot technique exclusif (`apostrophes`) ne désignent plus rien.
7. `lecon-14` q10 (correction de français : « rendu côté navigateur ») — « Scripts de pages web à
   afficher côté navigateur (React) et styles (Sass) » : w 3 → 4 (`afficher` est dans la page). Un premier
   essai avec `affichage` (9 lettres) ouvrait le mot technique exclusif ; un deuxième, avec une virgule,
   ouvrait « la plus détaillée » : tous deux écartés par le banc avant d'écrire.
8. `lecon-01` q3 (pas une correction de la contre-relecture ; le dosage de la longueur) — « L'égalité
   des classes (il appelle equals sur leur type) » → « L'égalité de type (il appelle equals sur la
   classe) » : 106 → 102 caractères, la bonne réponse (104) devient la plus longue. Une seule bascule
   calculée : « la plus longue » 12,5 → 13,5 sur 54 (25,0 %) et la DEUXIÈME 14,17 → 13,17 (24,4 %). Même
   thèse, exécutée : `'a' == 'b'` vaut `false` pour deux objets de la même classe.

Aucune bonne réponse, aucun explain touché. Aucune correction de sens.

### Ce qui reste, sans arrondir

- Pire stratégie : **la plus dense 25,9 %** ; la moins bavarde et ECARTER la plus dense 25,6 %.
  ECARTER la plus dense tranche UNE question (`lecon-14` q14, Spock : trois distracteurs de 32
  caractères ex æquo, la bonne en a 31) et y rend 100 % — le même cas que « la QUATRIÈME plus longue »
  sur toute question de rang 3 ; laissé.
- Intrus, signaux locaux sans effet sur le cours : `lecon-05` q1 (DÉFAUT désigne `sort` seul :
  `nouvelle` et `liste` partagés par les trois autres depuis la contre-relecture), `lecon-14` q2 (EXCÈS
  désigne le seul `collect`), `lecon-14` q3 (DÉFAUT désigne le seul `JsonSlurper`). Tous désignent un
  distracteur : l'écarter rend 33,3 % sur la question.
- `verif-donnees` I18 : la ligne ajoutée au mémo de `lecon-14` rend aussi `antiseches-data.js` périmé
  (en plus de `quiz-index.js` et `search-index.js`) : index dérivés, à régénérer à la fusion. Les cliquets
  `verif-qcm-biais.js` (87,0 → 25,0 %, pire 25,9 %) et `verif-qcm-lexique.js` (STRICTE 63,6 → 0,0 %)
  signalent « progressé sans que le gain soit figé » : à refiger à la fusion. `verif.js --rapide` non
  relancé pour la reprise.
