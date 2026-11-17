# Rapport V18 — case B10J, lot 7 : le cas `java/lecon-04#1` (copie `b10j-java`, branche `v18/b10j-java`)

Copie de travail `D:\test-claude-b10j-java`, partie de `173c2cd`. Part traitée : **un seul « Cas réel »**,
`pages/java/lecon-04.html#1`. Les 22 autres « Cas réel » du cours `java` ont été vérifiés et contre-relus
au lot 1 : je n'y ai pas touché, je ne les ai ni recomptés ni réservés. Pièces dans `scratchpad/b10j-java/`
(ignoré par git) : le message de la liste téléchargé (`msg-002630.html`), les deux tickets JDK lus par l'API
REST de Jira (`jdk-6880672.json`, `jdk-6896573.json`) et leur lecteur `lire-jira.py`, les Javadoc de Java 7,
25 et 27 (`arrays7.html`, `arrays25.html`, `arrays27.html`), les sources de `Arrays.java` et
`DualPivotQuicksort.java` extraites du `src.zip` du JDK 27 installé (`src27/`), le journal de
`verif.js --rapide`.

**En une phrase** : le cas racontait le billet de Joshua Bloch sur la recherche dichotomique de
`java.util.Arrays` (Google Research, 2 juin 2006), dont le **foyer est `algo/lecon-03`** (tranché au lot 7,
inscrit au registre) ; il est **remplacé** par un autre vrai cas, daté et sourcé, sur la notion de sa section
(« La classe utilitaire Arrays », `Arrays.sort` qui trie sur place) : **le tri rapide à deux pivots proposé
par Vladimir Yaroslavskiy pour `java.util.Arrays` (2009)**.

**Commits** (branche `v18/b10j-java`) : `b45f378` (la page, 1 cas remplacé), puis le commit de ce rapport.

## Le cas

| | |
|---|---|
| Identifiant | `pages/java/lecon-04.html#1` (encadré `callout--note`, section `<h2>` « La classe utilitaire Arrays » ; aucun intertitre « Cas réel » au-dessus, rien à renommer) |
| État trouvé | **VRAI** dans l'ensemble (événement daté, personne et produit nommés), mais **sujet gardé par un autre cours** : le même billet de Bloch a son foyer à `algo/lecon-03#1` (registre `tools/cas-reels/lots/foyers.md`, ligne « Joshua Bloch, recherche binaire de java.util.Arrays… — FOYER tranché au lot 7 ») |
| Action | **remplacé** |
| Ancien titre | `Cas réel — Arrays.binarySearch (2006)` |
| Nouveau titre | `Cas réel — le tri à deux pivots d'Arrays.sort (2009)` |
| Longueur | 167 mots (titre et corps, hors ligne de source) ; l'ancien en comptait environ 150 |

**Ce que dit le nouveau cas, phrase par phrase, et où la source le dit** :

1. *Le 11 septembre 2009, Vladimir Yaroslavskiy propose, sur la liste `core-libs-dev` d'OpenJDK, de remplacer
   le tri des tableaux de types primitifs de `java.util.Arrays`* — message du 11 septembre 2009 (« Fri Sep 11
   10:35:22 UTC 2009 », auteur Vladimir Yaroslavskiy), sujet « Replacement of Quicksort in java.util.Arrays
   with new Dual-Pivot Quicksort » : « I'd like to propose to replace the JDK's Quicksort implementation by
   new one ». « Tableaux de types primitifs » : description du ticket JDK-6880672, « The sorting algorithm used
   for sorting primitive arrays in j.u.Arrays is a quicksort… ».
2. *un tri rapide (quicksort) adapté d'un article de Jon Bentley et M. Douglas McIlroy paru en 1993* — même
   description du ticket : « adapted from Jon L. Bentley and M. Douglas McIlroy's "Engineering a Sort
   Function", Software-Practice and Experience, Vol. 23(11) P. 1249-1265 (November 1993) » ; le message dit
   aussi « current implementation of Quicksort in JDK (L. Bentley and M. Douglas McIlroy) ».
3. *au lieu de répartir le tableau autour d'un pivot, le couper en trois parts autour de deux pivots
   P1 ≤ P2* — message : « But all of them use *one* pivot » ; « Assume that P1 <= P2 » ; « Reorder the array
   into three parts ».
4. *Avec la JVM « client », ses mesures donnent 5,31 contre 9,08 pour l'ancien code sur des données déjà
   triées* — tableau « Client VM » du message, colonne « ascend » : Dual-Pivot 5.31, Bentley's 9.08. (Je n'ai
   pas écrit « plus rapide partout » : sous la JVM « Server », l'ancien code gagne sur trois colonnes,
   « organ pipes » 16.72 contre 17.14, « 010101 » 1.82 contre 1.96, « 0..4 random » 3.39 contre 3.41.)
   Le message ne donne pas d'unité : le cas n'en donne pas non plus.
5. *Joshua Bloch et Jon Bentley l'aident à l'améliorer* — message : « feedback from Joshua Bloch and Jon
   Bentley who spent a lot of time investigating this algorithm, who gave me many advices and tips how to make
   new Quicksort better » ; le commit porte « Co-authored-by: Joshua Bloch » et « Co-authored-by: Jon
   Bentley », « Reviewed-by: jjb ».
6. *le code entre dans le dépôt du JDK 7 le 29 octobre 2009 (ticket JDK-6880672)* — commit `43f93f6` du
   dépôt `openjdk/jdk` (miroir GitHub de l'historique Mercurial), auteur Vladimir Yaroslavskiy, daté du
   2009-10-29 11:18:37 UTC, message « 6880672: Replace quicksort in java.util.Arrays with dual-pivot
   implementation » (ajoute `DualPivotQuicksort.java`, modifie `Arrays.java`) ; le ticket : version
   corrigée « 7 », commentaire d'Alan Bateman du 29 octobre 2009 qui pointe le changeset `b05abb410c52` de
   `jdk7/tl/jdk`. (La page Mercurial `hg.openjdk.org` répond 403 : je ne la cite pas.)
7. *Pour un `int[]` comme celui de l'exemple ci-dessus, la Javadoc de Java 27 annonce toujours, pour
   `Arrays.sort`, un « Dual-Pivot Quicksort » de Yaroslavskiy, Bentley et Bloch* — Javadoc de Java 27,
   `sort(int[] a)` : « Implementation Note: The sorting algorithm is a Dual-Pivot Quicksort by Vladimir
   Yaroslavskiy, Jon Bentley, and Joshua Bloch ». Même phrase dans la Javadoc de Java 7 (« toujours ») et de
   Java 25, et dans le `src.zip` du JDK 27.0.1 installé (`Arrays.sort(int[])` appelle
   `DualPivotQuicksort.sort(a, 0, 0, a.length)`). L'exemple de la leçon est bien un `int[]`
   (`int[] valeurs = {5, 1, 4, 2, 3}; Arrays.sort(valeurs);`).
8. *C'est l'intérêt d'une méthode de bibliothèque : ton appel ne change pas quand son algorithme s'améliore* —
   phrase qui relie le cas à la notion (comme la dernière phrase de l'ancien cas), pas une affirmation de
   source.

**Sources ouvertes** :

- Vladimir Yaroslavskiy, « Replacement of Quicksort in java.util.Arrays with new Dual-Pivot Quicksort »,
  core-libs-dev, 11 septembre 2009 : https://mail.openjdk.org/pipermail/core-libs-dev/2009-September/002630.html
  (téléchargée et lue en entier ; les réponses 002631 à 002635 vérifiées pour l'ordre du fil).
- Ticket JDK-6880672, « Replace quicksort in java.util.Arrays with dual-pivot implementation » (créé le
  10 septembre 2009, résolu « Fixed » le 24 novembre 2009, version 7), lu par
  https://bugs.openjdk.org/rest/api/2/issue/JDK-6880672?expand=changelog (changelog vide, deux
  commentaires) ; page citée : https://bugs.openjdk.org/browse/JDK-6880672 (répond 200).
- Commit : https://github.com/openjdk/jdk/commit/43f93f6ba68c2986d1b3f7ad95bc99b26be6ca4e (lu par `gh api`).
- Javadoc de Java 27 : https://docs.oracle.com/en/java/javase/27/docs/api/java.base/java/util/Arrays.html ;
  contrôles : https://docs.oracle.com/javase/7/docs/api/java/util/Arrays.html et
  https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/Arrays.html.
- Lu mais **pas** utilisé dans le cas : JDK-6896573 (« Arrays.sort(long[]) fails with StackOverflowError »,
  ouvert le 29 octobre 2009, correctif `b36e33e` du 30 octobre 2009 qui ajoute `Sorting.java`) — une
  régression de ce même changement, laissée de côté pour garder le cas court et centré sur `Arrays.sort`.

**Un sujet = un seul cours** : « Dual-Pivot », « Yaroslavskiy », « deux pivots », « 6880672 »,
« core-libs-dev », « 002630 » et le commit cherchés dans tout `pages/`, dans `foyers.md` et dans tous les
fichiers de réservations de `D:/test-claude/scratchpad/v18-parallele/` (dont `b10j-` et `b11-`) : aucune
occurrence. Écartés parce qu'un autre cas du site les tient déjà : TimSort et sa preuve par de Gouw
(`java/lecon-18`, même cours), le changement de comportement de TimSort dans Java 7 (trop proche de
`java/lecon-18`), l'adversaire « tueur » de McIlroy (`algo/lecon-06`), `Class.getSigners` et le tableau
renvoyé sans copie (`java/lecon-05`). Ligne réservée dans `b10j-reservations.txt`.
`node tools/cas-reels/lots/doublons.js` : code 0, 3 sources partagées entre cours, toutes hors de ma part et
déjà connues (notes de Debian 12, billet de react.dev, notes de Safari 15.4).

## Décomptes

| cours | « Cas réel » traités | gardés tels quels | corrigés | remplacés | renommés « Scénario » |
|---|---:|---:|---:|---:|---:|
| `java` (ma part : `lecon-04#1` seul) | 1 | 0 | 0 | 1 | 0 |

État trouvé : 1 VRAI, mais dont le sujet a son foyer dans un autre cours (`algo/lecon-03`).

## Contrôles (sur la branche, après le commit de la page)

| contrôle | code |
|---|---|
| `node tools/verif-contenu.js --cas-reel --cours=java` | **0** (23 lus, 23 conformes) |
| `node tools/verif-contenu.js --strict` | **0** |
| `node tools/verif-html.js` | **0** |
| `node tools/verif-domaines-interdits.js` | **0** |
| `node tools/verif-qcm-lexique.js` | **0** |
| `node tools/verif-qcm-biais.js` | **0** |
| `node tools/cas-reels/lots/lexique-diff.js D:\test-claude-b10j-java 173c2cd` | **0** (1 page comparée, 0 écart) |
| `node tools/cas-reels/lots/doublons.js` | **0** |
| `node tools/verif.js --rapide` | **1** (54 étapes, 6 signalées, 720,3 s ; détail ci-dessous) |

Les six étapes signalées par `verif.js --rapide`, et pourquoi aucune ne vient d'une faute de ma branche :

- `donnees` : **seul l'invariant I18** est en erreur (index dérivés périmés : `search-index.js` publié
  4 431 618 o contre 4 456 083 o regénéré, écart +24 465 o ; `search-lite.js` +4 o). L'écart dépasse de loin
  ma retouche (une ligne) : l'index était déjà périmé à `173c2cd`. Toléré, l'orchestrateur régénère.
- `doc-ref` (`verif-doc.js` : « nombre de leçons qui renvoient à un document = 123 ») et `doc-rec`
  (`verif-recherche.js` : « 1 296 citent la source », « 7 leçons » pour Stack Overflow et les assistants) :
  chiffres du cours `doc` mesurés sur tout le site. Tolérés.
- `normatf` (`verif-normatif.js` : la page cite 29 leçons qui citent une RFC) : ni l'ancien cas ni le nouveau
  ne mentionnent de RFC ; c'est la dérive des lots fusionnés, que la consigne range avec `doc-ref` et
  `doc-rec` (« l'orchestrateur régénère »).
- `etudes` (`verif-etudes.js`) et `etude-6` (`preuves/etude-inconnu.js`) : **même cause, antérieure à ma
  branche**. L'étude `pages/etude-inconnu.html` publie « 10623 blocs de code », la mesure du jour en trouve
  10620. Ce compte ne lit que les blocs `<code class="language-…">` d'au moins 5 lignes non vides
  (`tools/etudes/inconnu/mesure-langages.js`) ; mon diff contre `173c2cd` ne touche aucun bloc de ce genre
  (0 ligne `language-`, seulement 10 `<code>` sans classe, 0 `<pre>`). La page d'étude est donc périmée
  depuis une fusion antérieure ; je ne l'ai pas régénérée (index et pages dérivés : à l'orchestrateur).
  `verif-etudes.js` relancé seul : code 1, seule `etude-inconnu.html` périmée, les six autres à jour (dont
  `etude-recherche.html`).

Fins de ligne : 0 CR dans `pages/java/lecon-04.html` (vérifié avec node). Seul l'intérieur de l'encadré a
changé (`git diff --stat` : 1 ligne).

## Ce qui reste ouvert

- Le registre `foyers.md` peut accueillir le nouveau sujet (« Vladimir Yaroslavskiy, Dual-Pivot Quicksort
  de java.util.Arrays, core-libs-dev, 11 septembre 2009 ; JDK-6880672 » → `java/lecon-04#1`) à la fusion.
- Index dérivés (`js/search-index.js`, etc.) non régénérés, comme demandé : à l'orchestrateur après la fusion.
- Un fichier de journal, `D:\b10j-strict.log`, a été écrit par erreur à la racine de `D:` (une redirection
  `../` depuis la copie) ; sa suppression a été refusée par le garde-fou de l'outil : à effacer à la main.
  Il ne touche ni `D:\test-claude` ni aucune copie.
