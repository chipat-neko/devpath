# La convention de datation — ce qui périme, et comment on le dit

**Statut** : arrêtée le 2026-09-03 (chantier V15, point E2). Toute page ajoutée ou reprise après
cette date s'y conforme. `tools/verif-fraicheur.js` (point E3) la contrôle.

---

## Pourquoi une convention, et pas un détecteur

Le point E1 a mesuré le périssable du site par motifs. Trois passes successives, chacune
échantillonnée : **1 540 → 748 → 677 → 537 pages**, et le résidu contenait *encore* des faux
positifs structurels — « ~8 % des hommes ont une forme de daltonisme » (un fait stable), « Chrome
512 » (un effectif de visiteurs dans une leçon de statistiques), « COBOL 1000-INITIALISER » (un
numéro de paragraphe). La cause est structurelle : **les mêmes mots servent à décrire le déroulement
d'un algorithme, un fait permanent, et une affirmation sur l'état du monde. Seule la troisième
périme, et les distinguer suppose de lire la phrase.**

Un vérificateur fondé sur des motifs produirait donc une majorité de faux positifs, et serait ignoré
en une semaine. **On inverse la charge** : c'est celui qui écrit qui marque, une fois, à la main ; le
vérificateur ne cherche plus le périssable — il contrôle que les marques posées sont bien formées et
qu'aucune n'a dépassé son âge.

## La marque

```html
<span class="fraicheur" data-arrete="2026-09-03">les deux références sont Next.js et React Router</span>
```

| Attribut | Rôle | Obligatoire |
|---|---|---|
| `class="fraicheur"` | déclenche le rendu | oui |
| `data-arrete="AAAA-MM-JJ"` | **jour où l'affirmation a été écrite ou relue** | oui |
| `data-duree="N"` | durée de validité présumée, **en mois** (défaut : `18`) | non |

**`data-arrete`, pas `data-verifie`.** Le site ne consulte rien en ligne : il ne *peut pas* vérifier
qu'une version est encore la dernière. La date dit ce qu'elle dit — *l'état des choses arrêté à ce
jour-là*, comme on arrête des comptes. Prétendre « vérifié » serait faux, et l'honnêteté de la
mesure est la règle fondatrice de tout ce chantier.

**Durées d'usage** : `12` pour un paysage d'outils ou une part de marché (ça bouge vite), `18` par
défaut, `36` pour ce qui bouge lentement (une pratique de métier, un ordre de grandeur matériel).

## Ce que ça donne à l'écran

- **Sans JavaScript** : un simple soulignement pointillé, comme un `abbr`. Rien d'autre. La page
  reste lisible.
- **Avec JavaScript** : le soulignement, l'**année en exposant** juste après le passage — quatre
  chiffres minuscules, l'information sans survol ni clic —, une infobulle au survol, et une
  alternative textuelle complète pour les lecteurs d'écran.
- **En bas de l'article** : un `<details>` replié, « **Fraîcheur de cette page** — N affirmations
  datées », qui liste les passages et leur date. C'est ce qui rend l'information accessible sans
  survol : l'infobulle est un bonus, jamais le seul chemin.
- **À l'impression** et **en `prefers-reduced-motion`** : rien de particulier à prévoir, la marque
  est statique.

Le moteur est `initFraicheur()` dans `js/main.js` — donc présent sur **toutes** les pages du site,
sans avoir à ajouter une balise `<script>` à 1 782 fichiers.

## Ce qu'on marque

Une **affirmation sur l'état du monde** au moment où on l'écrit, qui deviendra fausse sans que rien
ne casse et sans que personne ne s'en aperçoive :

- un paysage d'outils : « les deux références sont Next.js et React Router » ;
- une version présentée comme le présent : « les nouveautés de React 19 », « la direction que prend
  React » ;
- une domination, une part de marché : « le plus utilisé », « 70 % des sites » ;
- une pratique dominante du moment : « aujourd'hui, on type plutôt avec TypeScript » ;
- un chiffre de performance **sans provenance** : « 180 ms par frappe ».

## Ce qu'on ne marque pas

- **Un fait de compatibilité.** « React 19 introduit `use()` » restera vrai quand React 25 sortira.
  C'est de l'histoire, pas de l'actualité. *C'est le plus fréquent des faux positifs.*
- **Un fait historique daté** : « en 2020, le pipeline de SolarWinds est compromis ».
- **Un nom figé, un millésime de norme** : ES2015, HTTP/2, C++17, Ada 2012, UTF-8, PEP 8.
- **La description du programme ou de l'interface** : « l'élément actuellement sélectionné ».
- **Un marqueur pédagogique** : « tu sais désormais auditer une page ».
- **Un nombre de démonstration** : « la forme courte suffit dans 99 % des cas », « 5 % des
  utilisateurs » dans un scénario inventé.
- **Tout ce qui est dans un bloc de code** (`<figure class="code-block">`, `<pre>`, `<code>`). Un
  `python:3.12` dans un Dockerfile est un exemple, pas une affirmation sur le monde — et une balise
  ouverte dans un bloc de code fait rougir `tools/verif-html.js`.
- **Une mesure déjà sourcée** : « 162 à 165 ms (Node 24.16.0, médiane de 5 essais) ». Elle porte sa
  provenance ; c'est le modèle, pas la dette.

## La règle de parcimonie — elle prime sur tout le reste

**Une marque par affirmation, pas par occurrence.** Une page qui écrit « React 19 » douze fois pour
parler des mêmes nouveautés porte **une** affirmation à dater — celle qui la pose —, pas douze. Une
page peut n'en porter aucune, et c'est un résultat, pas un oubli.

Le but est de dater ce qui périme, **pas** de consteller le texte. Si une page compte plus de trois
ou quatre marques, c'est presque toujours que la même affirmation a été marquée plusieurs fois.

## Où poser la marque, concrètement

- Sur un **segment de texte pur**, court (2 à 10 mots), à l'intérieur d'un `<p>`, d'un `<li>` ou
  d'une cellule.
- **Jamais à cheval sur une balise** : `<span class="fraicheur" …>les <strong>deux</strong>
  références</span>` est correct, `<span …>les <strong>deux</span> références</strong>` ne l'est pas.
- Jamais dans un attribut (`title`, `alt`, `content` d'un `<meta>`), jamais dans un bloc JSON
  (`data-quiz`, `data-exos`, `data-quiz-bilan`).

## Ce que le vérificateur contrôle (E3, écrit le 2026-09-03)

1. `data-arrete` présent, au format `AAAA-MM-JJ`, et **pas dans le futur** ;
2. `data-duree` entier positif s'il est là ;
3. l'âge de chaque marque contre sa durée → **avertissement** au-delà, erreur au double ;
4. aucune marque dans un bloc de code, un attribut ou un bloc JSON ;
5. le nombre de marques par page (garde-fou de parcimonie).

Il ne dit **jamais** si la version citée est à jour — il n'a pas de réseau. Il dit qu'on **sait**
quand on l'a écrite.

`node tools/verif-fraicheur.js` — 16ᵉ étape de `tools/verif.js`. L'option `--date=AAAA-MM-JJ` permet
de **se projeter dans le temps** et de voir ce qui arrivera à échéance ; `--strict` fait rougir dès
le premier avertissement.

## Pourquoi il n'existe pas de détecteur automatique — la mesure

La question « ne pourrait-on pas *trouver* les affirmations non datées ? » a été tranchée par la
mesure, pas par une opinion. `tools/fraicheur/calibrer.js` confronte 20 formulations candidates à la
seule **vérité terrain** du site — les 26 leçons de `react`, lues intégralement, dont les 52
affirmations périssables sont marquées — et compte, pour chaque motif, ses occurrences *dans* une
marque et *hors* marque :

| motif | dans | hors | précision |
|---|---:|---:|---:|
| des bibliothèques comme | 3 | 1 | **75 %** (le seul retenu) |
| le plus courant / la plus courante | 2 | 5 | 29 % |
| la référence / les références | 1 | 7 | 13 % |
| **un numéro de version d'un outil** | **4** | **99** | **4 %** |

Et les vingt candidats **réunis** ne touchent que **20 des 52** affirmations marquées (38 %). Un
détecteur bâti là-dessus signalerait deux pages sur trois à tort tout en manquant six affirmations
sur dix. On n'en écrit donc pas. La mesure se rejoue d'une commande :
`node tools/fraicheur/calibrer.js --cours=react --exemples`.
