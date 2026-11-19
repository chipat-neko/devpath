# Consigne d'écriture — les QCM du cours `groovy` (V18, case C10)

Préparée le 2026-11-19 dans la copie de travail `D:\test-claude-c10-groovy` (branche
`v18/c10-groovy`, partie de `8d163bf`). Un seul agent fait tous les rôles (écriture, dosage,
relecture, correction, contre-relecture). Mesures de départ archivées hors git dans
`scratchpad/c10-groovy/depart/` (sorties brutes des outils ; `questions.txt` : les 54 questions à
plat ; `texte-NN.txt` : le texte des 14 leçons ; `plan.json` : le plan des rangs figé au départ).
Sondes dans `scratchpad/c10-groovy/sonde/` : `controle.js` (copie de `vue-sonde`, repointée : à
vide, **0 indicateur déplacé sur 54 questions**), `pose.js` (applicateur sûr : reparse chaque bloc,
refuse la bonne réponse), `atelier.js` (banc d'écriture neuf : un lot de patchs appliqué EN
MÉMOIRE, puis pour chaque question tout ce qui désigne une option — rang et bande, mots, densité,
`, : ;`, incises, marques, `k`/`w`, mots de 9+ lettres exclusifs, écho, majuscules, attaque,
absolus / prudents / négation, tics de forme, intrus lexical — et pour le cours les 44
stratégies, le biais inverse, le lexique, l'intrus, les tics de lot et le mot fétiche, en copie
exacte des règles des outils), `corps.js` (remplacement littéral dans le corps, qui refuse un bloc
de quiz et un encadré « Cas réel »), `extrait.js` (une figure de code telle que la page l'affiche).

Le cours : Groovy — découverte et JVM (`01`), `def` et GString (`02`), vérité de Groovy et
opérateurs `?:` `?.` `<=>` (`03`), closures (`04`), collections (`05`), POGO et `@CompileStatic`
(`06`), métaprogrammation et builders (`07`), Gradle et Jenkins (`08`), écosystème (`09`), traits
(`10`), JSON / XML / GPath (`11`), Spock (`12`), DSL et `delegate` (`13`), projet de synthèse
(`14` : 3 questions + **12 de bilan**). 14 leçons, **54 questions, 162 distracteurs**.

## ✅ CE QUI SE PROUVE SE PROUVE — GROOVY S'EXÉCUTE ICI

Distributions binaires **officielles** d'Apache Groovy, **4.0.33** et **5.1.3**
(`downloads.apache.org`, SHA-256 vérifiés : `395a69a8…855d93d` et `9f53e2c2…f67a014`), extraites
dans `D:\outils-c\groovy\`, hors de tout dépôt ; Java 27.0.1. Lanceur :
`sh scratchpad/c10-groovy/preuves/lance.sh <4|5> <script.groovy>` ; scripts et sorties dans
`scratchpad/c10-groovy/preuves/` ; `figures.sh` extrait des pages et exécute 47 figures de code
telles qu'elles sont affichées.

**Fautes de CORPS trouvées par exécution, avant la vague** (corrigées, preuves dans `preuves/`) :

| où | ce que la page disait | ce que Groovy 4.0.33 et 5.1.3 rendent |
|---|---|---|
| `lecon-02`, figure `types.groovy` | `println 5.times { print "*" }   // *****` | affiche `*****null` (`times` rend `null`) |
| `lecon-06`, encadré Astuce | une propriété mal orthographiée dans le constructeur par map « échoue silencieusement » | `groovy.lang.MissingPropertyException: No such property: non for class: Produit` à l'exécution ; `@CompileStatic` la refuse à la compilation (« [Static type checking] - No such property: non ») |
| `lecon-10`, figure `etat.groovy` | `int incrementer() { ++n }` dans un trait | **ne compile pas** : « Prefix expressions on trait fields/properties are not supported in traits » ; `n += 1` compile et rend 2 |
| `lecon-11`, figure `xml.groovy` | `new XmlSlurper()` sans import | **ne compile pas** : « unable to resolve class XmlSlurper » (`groovy.xml` n'est pas importé d'office) |
| `lecon-11`, figure `builder.groovy` ; `lecon-13`, encadré Rappel | la sortie de `MarkupBuilder` écrite sur une ligne | sortie par défaut **indentée sur plusieurs lignes** (`<ul>`, puis `  <li>Groovy</li>`…) |

**Distracteur VRAI trouvé par exécution** : `lecon-14` (bilan) « Comment déclarer une variable sans
préciser le type ? » propose `var x = 5` comme mauvaise réponse — or `var x = 5` **compile et
s'exécute** sous Groovy 4.0.33 et 5.1.3 (`var` existe depuis Groovy 3) ; une variable `var` y accepte
même une valeur d'un autre type ensuite. À remplacer.

**Croyances fausses EXÉCUTÉES** (n'emploie dans un distracteur que celles que TA leçon établit) :

| croyance fausse | ce que Groovy rend (4.0.33 = 5.1.3) |
|---|---|
| `==` compare les références comme Java | `new String("abc") == new String("abc")` → `true`, `is()` → `false` |
| `==` appelle toujours `equals` | `new BigDecimal("1.0") == new BigDecimal("1.00")` → `true` alors que `equals` → `false` (Comparable : `compareTo`) — nuance de la bonne réponse de `lecon-01` q3, **signalée, non touchée** |
| `0.1 + 0.2` donne une approximation | `0.3`, un `java.math.BigDecimal` |
| les guillemets simples interpolent | `'Bonjour, $nom'` affiche `Bonjour, $nom` ; une chaîne à `$` est un `GStringImpl`, sans `$` un `String` |
| `def` fige le type | `def v = "Paris"; v = 100` passe, `v` devient un `Integer` |
| une liste vide est vraie | `[]`, `[:]`, `0`, `0.0`, `''`, `null` sont faux |
| `?.` lève une erreur sur null | `null?.length()` → `null` ; sans `?.` : `NullPointerException` |
| `3 <=> 5` rend un booléen | `-1` ; `5 <=> 5` → `0` ; `8 <=> 2` → `1` |
| définir une closure l'exécute | rien ne s'exécute avant `f()` ou `f.call()` ; sans argument, `it` vaut `null` |
| une closure copie la variable capturée | `compteur` passe de 0 à 2 après deux appels |
| `each` rend une liste transformée | `each` rend LA MÊME liste (`r.is(nombres)` → `true`) ; `collect` rend une nouvelle liste |
| `map::ada` lit la valeur | `ages::ada` rend une `MethodClosure` (référence de méthode, Groovy 3+) ; `ages(ada)` → `MissingPropertyException` |
| un trait ne porte pas d'état | `trait Compteur { private int n }` : un compteur par objet (2 et 1) |
| deux traits en conflit = erreur | `implements A, B` → `B`, `implements B, A` → `A` ; `A.super.qui() + B.super.qui()` → `AB` |
| `JsonSlurper` rend une chaîne ou un objet opaque | une `LazyMap` (objet JSON) et une `ArrayList` (tableau) |
| GPath : `equipe.membre[0].role()` lit l'attribut | `MissingMethodException` ; `equipe.get('role')` et `role(equipe.membre)` aussi ; `.@role` → `dev` |
| sans `DELEGATE_FIRST`, rien ne marche | stratégie par défaut `OWNER_FIRST` (0) ; sans délégué, `hote "x"` → `MissingMethodException` |
| `( x ) => …` est une closure Groovy | `=>` n'existe pas ; la lambda de Groovy 3+ s'écrit `(int z) -> z * 2` (rend 6) — ⚠️ donc **ne jamais écrire `(x) -> …` comme une syntaxe inexistante** |
| deux interfaces `default` en conflit | **diffère selon la version** : Groovy 4.0.33 prend la dernière (`J2`), Groovy 5.1.3 refuse à la compilation — ne pas s'en servir |

**Ce qui ne s'exécute PAS ici** : Gradle, Jenkins (pipelines déclaratif et scripté), Spock (le
moteur JUnit Platform n'est pas installé), `@Grab` (dépôt Maven distant). Pour ceux-là : la
documentation officielle, et « non exécuté » dans le rapport.

---

## Pourquoi ce travail — mesure de départ (`node tools/mesure-biais-qcm.js --seul=groovy`, `8d163bf`)

| indice | réussite | couverture | rendement |
|---|---:|---:|---:|
| **la plus longue** | **87,0 %** | 96,3 % | 88,5 % |
| la plus détaillée | 70,4 % | 63,0 % | 94,1 % |
| l'incise entre parenthèses / RESTREINDRE à la parenthèse | 69,0 % | 61,1 % | 97,0 % |
| le mot technique exclusif | 63,9 % | 59,3 % | 84,4 % |
| l'écho de la question | 54,5 % | 48,1 % | 84,6 % |
| ponctuation forte (seule / RESTREINDRE) | 52,3 / 53,1 % | 46,3 % | 84,0 % |
| ECARTER la moins bavarde | 49,5 % | 27,8 % | 73,3 % |
| RESTREINDRE aux deux-points | 43,4 % | 33,3 % | 77,8 % |
| le point-virgule (seul / RESTREINDRE) | 36,1 % | 14,8 % | **100,0 %** |

**38 questions sur 54 (70,4 %)** trahies par 5 indices ou plus. Rangs **48 / 5 / 0 / 1**, cible
**14 / 14 / 13 / 13** ; `plan-rangs-qcm` demande **9 373 caractères** sur 50 questions ; **133
distracteurs** hors de la bande 70-130 %. Biais inverse : **4 alertes** (rangs 2, 3, 4 et « la
moins bavarde »). Point interne : 1 question (`lecon-03` q1, la bonne réponse est en deux phrases).

### Les HUIT tics de lot (`node tools/mesure-tics-lot.js groovy --exemples`)

| tic | bonnes / distr. | tranchées | gain au cours |
|---|---|---:|---:|
| **deux-points médian** | **17 / 3** | 20 | **47,2 %** |
| **glose finale entre parenthèses** | **10 / 4** | 12 | **38,0 %** |
| **point-virgule médian** | **8 / 0** | 8 | **36,1 %** |
| verbe d'état (est / reste / garde…) | 11 / 14 | 11 | 32,9 % |
| parenthèse ouverte par un article | 4 / 0 | 4 | 30,6 % |
| quatre segments à virgules | 4 / 0 | 4 | 30,6 % |
| « de build », « pour les » | 4 / 0 | 4 | 30,6 % |

Le gabarit des bonnes réponses est « réponse : explication », « réponse ; conséquence » ou
« réponse (glose) » : **les trois distracteurs prennent le MÊME gabarit** (quatre porteurs, jamais
un ni trois), avec un contenu qui énonce une erreur précise.

### Mot fétiche (`node tools/mesure-mot-fetiche.js groovy`) : 1 alerte
**`groovy` : 14 bonnes réponses / 1 distracteur**, RESTREINDRE 43,5 %. Dans chaque question où la
bonne réponse porte « Groovy », **les trois distracteurs le portent aussi** ; ailleurs, ne
l'ajoute pas à un seul distracteur. À surveiller : `méthode` 3 / 3.

### Lexique (`node tools/mesure-lexique-qcm.js --liste=groovy`)
**45 exploitables, 19 retournées, 46 à mettre en forme sur 54.** Règle du `k` (en OCCURRENCES) :
les quatre options portent le même nombre de mots de 6 lettres et plus ABSENTS de la page (la page
entière hors blocs de quiz, attributs HTML compris). Règle du `w` : si `k > 0`, les quatre portent
aussi le même nombre de mots de 6+ lettres. Le levier : un mot de moins de 6 lettres ne compte ni
dans `w` ni dans `k` ; l'apostrophe et le tiret collent (`l'égalité`, `elle-même` = UN jeton). Le
moyen le plus sûr de tenir `k` : **reprendre dans les distracteurs les mots étrangers de la bonne
réponse**. `node scratchpad/c10-groovy/sonde/vocab.js lecon-NN.html` liste les mots de la page.

### Mot technique exclusif (63,9 %) et intrus lexical (EXCÈS 34,1 %, 5 questions sûres)
Chaque mot de **9 lettres et plus** est porté par **au moins deux** options (ou par aucune) :
reprends ceux de la bonne réponse dans un ou plusieurs distracteurs. Intrus (mots de 5+ lettres,
l'apostrophe SÉPARE ici) : chaque option a au moins un mot propre, et aucun mot n'est porté par
**exactement trois** options.

---

## La règle qui prime sur toutes les mesures

> **UN DISTRACTEUR EST UNE PHRASE FRANÇAISE QUI ÉNONCE UNE THÈSE FAUSSE, PRÉCISE ET PLAUSIBLE.**
> Si l'on ne peut pas dire en une phrase *pourquoi c'est faux*, ce n'est pas un distracteur.

Test de recevabilité pour CHAQUE distracteur : (1) l'erreur se nomme en une phrase ; (2) chaque
proposition a un référent ; (3) un débutant crédule pourrait le cocher ; (4) aucune parenthèse ni
queue de phrase de remplissage ; (5) aucune conjonction sans logique ; (6) aucun comportement de
Groovy annoncé sans avoir été EXÉCUTÉ (table ci-dessus) ou lu dans la page.

⚠️ **Les pièges propres à ce cours** :
- Groovy a **beaucoup grandi** : `var` (Groovy 3), lambdas `->` à la Java (Groovy 3), `::`
  (références de méthode, Groovy 3), `===` / `!in` / `?[ ]` (Groovy 3), interfaces `default` qui
  changent de comportement entre 4 et 5. Un distracteur « Groovy n'a pas X » est souvent VRAI pour
  une version récente : vérifier par exécution, sous 4 ET 5.
- Groovy est **un sur-ensemble proche de Java** : « ça ne compile pas » est faux pour beaucoup de
  code Java ; préférer une erreur de FAIT (ce que rend l'expression, quand c'est vérifié).
- Les écosystèmes cités (Gradle, Jenkins, Spock, Grails) ont des réglages : une phrase sur leur
  comportement n'est fausse que si elle l'est contre la page ET contre leur documentation.

**Préfère une erreur classique et nette à une élégance mesurée.** Un distracteur affirme sa thèse
POSITIVEMENT ; sa fausseté est dans le mécanisme décrit, jamais dans un aveu final.

## Ce que tu tiens, question par question (`atelier.js` le vérifie)

1. **Longueur et rangs** : la bande 70-130 % de la bonne réponse pour chaque distracteur, et le
   rang visé par `plan.json` (répartition plate, trois rangs distincts dans un fichier de trois
   questions) ; le rang en MOTS suit à peu près le rang en caractères.
2. **Marques — les quatre ou aucune** : `;`, `:`, incise entre parenthèses (même NOMBRE
   d'incises), glose finale, tiret, `/`, « », flèche (`->`, `→`), point interne (un point suivi
   d'une espace et d'une majuscule), virgule décimale. ⚠️ Le CODE porte des marques : `${...}` n'en
   porte pas, `.call()` est une parenthèse SANS incise (moins de 4 caractères) mais compte pour
   RESTREINDRE à la parenthèse, `CI/CD` est une barre oblique, `then:` un deux-points.
3. **Nombre de `, : ;`** : égal dans les quatre, ou la bonne réponse ni toujours au maximum ni
   toujours au minimum (dosé sur le cours).
4. **Écho** : même nombre de mots de l'énoncé (4+ lettres) dans les quatre options.
5. **Attaque** : les quatre options commencent par le même mot, ou par quatre mots différents —
   jamais trois pareils et un intrus. **Casse initiale** : si la bonne réponse commence par du
   code en minuscule (`def`, `it`, `collect`, `each`), les distracteurs aussi.
6. **Absolus** (toujours, jamais, uniquement, seulement, aucun, impossible, rien…) : pas dans un
   distracteur si la bonne réponse n'en porte pas. **Prudents** (peut, permet, souvent, selon,
   plutôt, notamment…) et **négation** (ne, pas, n', aucun, rien, ni, non) : les quatre ou aucune.
7. **Majuscule d'emphase** (`ET`, `DOUBLES`… hors sigles de l'outil) : même nombre partout.
8. **Fin d'option** : aucune ne finit par `.`, `!` ou `?`.
9. **Densité et nombre de mots** : allonger avec le vocabulaire technique de la leçon, pas avec
   des chevilles ; « la plus dense » et « la moins bavarde » dosées sur le cours vers 25 %.

## L'ordre de travail
1. Relire la leçon entière (le corps fixe le vocabulaire et ce qui est vrai).
2. Écrire les trois erreurs en une phrase chacune, les exécuter si elles portent sur Groovy.
3. Rédiger au gabarit de la bonne réponse, dans la bande ; passer `atelier.js <lot.json>
   --f=lecon-NN.html --signaux`, corriger jusqu'à ce que rien ne désigne la bonne réponse.
4. Poser par `pose.js <lot.json> --ecrire`, mesurer le cours entier, COMMITER le lot.
