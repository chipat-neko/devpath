# C2 — cloud, 92,5 % → 25,5 %

Case C2 du chantier V18 (phase C), un seul agent, copie `D:\test-claude-c2-cloud`, branche
`v18/c2-cloud`, partie de `8d163bf`. Consigne du cours : `scratchpad/CONSIGNE-CLOUD.md`.

## ⚠️ En tête : les atteintes à l'intouchable et les fautes de fond corrigées

**Aucune bonne réponse n'a été changée.** Deux explications l'ont été, chacune prouvée :

1. **`lecon-10` q2 (disjoncteur), explain** : « … qu'un appel test sonde avant de **rouvrir** » →
   « … avant de **refermer le circuit** ». L'explain contredisait sa propre bonne réponse
   (« un appel test décide ensuite de **refermer** le circuit ») et le glossaire de la leçon (« coupe
   les appels … (**état ouvert**) ») : rouvrir le circuit, c'est couper de nouveau. Preuve :
   Martin Fowler, *CircuitBreaker* (« the breaker trips … a trial call … will either **reset** the
   breaker if successful ») ; automate exécuté sous Node (`scratchpad/c2-cloud/preuves/resilience.js`) :
   l'appel d'essai réussi fait passer de « ouvert » à « fermé ».
2. **`lecon-12` bilan q8 (base non exposée), explain** : « seule l'application (dans le même réseau)
   atteint la base » → « dans le réseau, c'est le groupe de sécurité de la base qui n'admet que
   l'application ». Le sous-réseau privé ne réserve pas la base à l'application : la **route locale**
   de chaque table relie tous les sous-réseaux du VPC (guide VPC d'AWS, *Route table concepts* :
   « Local route — A default route for communication within the VPC »), et ce sont les groupes de
   sécurité qui filtrent — ce que la leçon 08 enseigne elle-même (« Ce qui décide réellement de qui
   peut se connecter, ce sont les groupes de sécurité »).

`node tools/mesure-qcm-intouchable.js cloud 8d163bf` : voir § Vérifications (2 explain déclarées).

**Fautes du corps, corrigées** (aucune dans un encadré « Cas réel ») :

3. **`lecon-09`, encadré « Regarde la latence au 95e/99e centile »** : « une latence moyenne de
   100 ms peut cacher que 1 client sur 20 attend 3 secondes » est **impossible** : 1 requête sur 20 à
   3 000 ms impose une moyenne d'au moins 150 ms (exécuté, `preuves/dispo.js`). Corrigé en « 1 client
   sur **50** » : 49 autres à 40,8 ms donnent une moyenne de 100,0 ms, un p95 de 40,8 ms et un p99 de
   3 000 ms (exécuté). Même encadré : « la moyenne, **qu'une poignée** de requêtes rapides suffit à
   embellir » → « **que la masse** des requêtes rapides suffit à embellir » (c'est la masse des
   requêtes rapides qui dilue la queue lente, pas une poignée).
4. **`lecon-12`, introduction** : « repris par Azure et Google — propose six piliers » : le
   Well-Architected d'**Azure n'a que cinq piliers** (learn.microsoft.com, page *Pillars* : fiabilité,
   sécurité, optimisation des coûts, excellence opérationnelle, efficacité des performances — pas de
   durabilité) ; celui de Google en a six (docs.cloud.google.com, durabilité comprise). Corrigé en
   « repris par Google et, sans le pilier durabilité, par Azure ».
5. **`lecon-08`, solution de l'exercice 1** : « sans route Internet : seule l'application peut la
   joindre » → « sans route Internet ; son groupe de sécurité n'y laisse entrer que l'application »
   (même imprécision que l'explain du point 2 ; la solution de l'exercice 3 de la même page le disait
   déjà juste). `controle.js` : aucun indicateur déplacé.

## Avant / après

| indice | avant (`8d163bf`) | après | commande |
|---|---:|---:|---|
| la plus longue | **92,5 %** | **25,5 %** | `node tools/mesure-biais-qcm.js --seul=cloud` |
| pire des 44 stratégies | 92,5 % (la plus longue) | **26,1 %** (la QUATRIÈME plus longue) | idem |
| la plus détaillée | 77,2 % | 25,0 % (ne tranche plus) | idem |
| le mot technique exclusif | 66,5 % | 25,0 % (ne tranche plus) | idem |
| ponctuation forte (seule / RESTREINDRE) | 54,2 / 54,7 % | 25,0 / 25,0 % | idem |
| l'incise / RESTREINDRE à la parenthèse | 51,9 / 51,9 % | 25,0 / 25,0 % | idem |
| RESTREINDRE aux deux-points | 47,6 % | 25,0 % | idem |
| l'écho de la question | 37,4 % | 25,0 % | idem |
| la plus dense / ECARTER | 33,0 / 22,0 % | 24,2 / 24,8 % | idem |
| la moins bavarde / ECARTER | 1,1 / 37,6 % | 25,0 / 22,2 % | idem |
| ecarter les deux extrêmes | 3,3 % | 25,9 % | idem |
| questions trahies par 5 indices ou plus | 35 (66,0 %) | **0** (43 à 0-2 indices, 10 à 3-4) | idem |
| rangs de la bonne réponse | 49 / 1 / 3 / 0 | **14 / 13 / 13 / 13** (= cible) | `node tools/plan-rangs-qcm.js cloud` |
| lexique (exploitables / retournées / à mettre en forme) | 41 / 40 / 50 | **0 / 0 / 0** | `node tools/mesure-lexique-qcm.js --liste=cloud` |
| mots fétiches | 2 alertes (`application`, `chaque`) | **0** | `node tools/mesure-mot-fetiche.js cloud` |
| tics de lot | 5 (deux-points médian 47,2 %…) | **0** | `node tools/mesure-tics-lot.js cloud` |
| fenêtres de lots (`--lots`) | 70 lignes au-dessus des seuils | **0** | `node tools/mesure-biais-qcm.js --lots --cours=cloud` |
| biais inverse | 4 alertes | **0** (pire : la moins bavarde 25,8 %) | `node tools/mesure-biais-inverse.js --toutes cloud` |
| intrus lexical DÉFAUT / EXCÈS (direct, inverse, sûres) | 25,5 / 24,8 / 1 · 25,0 / 22,8 / 0 | 25,0 / 25,0 / 0 · 25,0 / 25,0 / 0 | `node tools/mesure-mot-question.js cloud` |

Sorties brutes : `scratchpad/c2-cloud/depart/` et `scratchpad/c2-cloud/fin/` (hors git).

## Ce qui a été écrit

- **155 distracteurs réécrits sur 159, 4 gardés** (`lecon-10` q1 « ~43 minutes » et « ~7 heures » ;
  bilan q2 « IaaS » et « SaaS »). Caractères des distracteurs : 5 009 → 14 879 (**+9 870** ;
  `plan-rangs-qcm` en demandait 7 875). 0 bonne réponse, 0 énoncé changés ; 2 explain (ci-dessus).
- Méthode : lots `01-03`, `04-06`, `07-09`, `10-11`, `12`, un commit par lot, puis un commit de
  dosage. Banc d'écriture `scratchpad/c2-cloud/sonde/atelier.js` (stratégies **chargées** depuis
  `tools/mesure-biais-qcm.js`, copies exactes des découpes de `mesure-lexique-qcm`,
  `mesure-mot-question`, `mesure-tics-lot` ; à l'état de départ il rendait au dixième près les
  chiffres des outils), `essai.js` (candidats évalués avant d'écrire), `vocab.js` (les mots longs
  présents dans la page : la règle du `k`), `pose.js` (applicateur : reparse chaque bloc, refuse le
  fichier au moindre refus ; `idem.js` a prouvé que la resérialisation rend les 13 blocs à l'octet
  près), `controle.js` (copie de `vue-sonde`, v2), `dose.js` (dosage des deux stratégies de densité).
- **Dosage calculé** : « la plus dense » 36,5 % (19 bonnes réponses seules les plus denses sur 53) →
  cible 13 ; 6 retouches choisies par l'écart au deuxième, puis 2 de plus pour les fenêtres ;
  « la moins bavarde » 33,2 % → 3 retouches ; « chaque » retiré de 7 distracteurs (`k = 0`, donc
  sans effet lexical) ; les 5 fenêtres de `--lots` fermées par 4 bascules de rang qui s'annulent
  deux à deux (rangs restés à 14 / 13 / 13 / 13).

## Exécuté / pas exécuté

**Exécuté** (`scratchpad/c2-cloud/preuves/`, hors git) : Node 26 — indisponibilité de 99 % à
99,999 % sur 30 / 30,44 / 31 jours (`lecon-09` q3, `lecon-10` q1, bilan q9 : 7,2 h, 43,2 min,
4,32 min, 25,9 s), la moyenne et les centiles du point 3, le pic de tentatives avec et sans jitter
(1 000 clients : 1 000 tentatives dans la même fenêtre de 100 ms sans jitter, 147 avec), l'automate
du disjoncteur ; Python 3 (`ipaddress`) — 10.0.0.0/16 = 65 536 adresses de 10.0.0.0 à 10.0.255.255,
10.0.1.0/24 = 256, chevauchement de deux /16 identiques.

**Non exécuté, vérifié dans la documentation officielle** (les fournisseurs ne s'exécutent pas
ici) : six piliers du Well-Architected d'AWS (aws.amazon.com/architecture/well-architected, « its
six pillars ») ; cinq chez Azure ; six chez Google ; sous-réseau public = route directe vers une
passerelle Internet, route locale (guide Amazon VPC) ; pas d'appairage entre VPC aux plages qui se
chevauchent (guide VPC peering : « You cannot create a VPC peering connection between VPCs that
have matching or overlapping IPv4 or IPv6 CIDR blocks ») ; passerelle NAT (connexions sortantes,
aucune entrante non sollicitée ; NAT publique placée dans un sous-réseau public) ; sondes readiness
/ liveness (kubernetes.io) ; démarrage à froid de Lambda (*Lambda execution environment lifecycle*).
**Non vérifié** : les distracteurs « hors fournisseur » (instances réservées sur 1 à 3 ans, egress
entrant gratuit) s'appuient sur le texte des leçons, pas sur une tarification consultée.

## Relecture par contradiction

Chaque option réécrite relue comme un apprenant et comme un expert ; corps relu en entier au
départ (les 5 fautes ci-dessus). Points qui ont demandé une retouche pendant la vague : trois
distracteurs sans thèse lisible (`lecon-12` bilan q3, « si une zone fuit, les autres chiffrent » et
ses deux voisins, remplacés par performance / facturation / sauvegarde), un distracteur VRAI par
accident (`lecon-03` q3 : la classe « archive » est bel et bien facturée — réécrit en « facturé plus
cher », ce qui est faux), et `lecon-12` bilan q2, où « On-premise » était le seul mot long et
étranger à la page des quatre options (« Sur site » le remplace, même sens).
Numérotation : `lecon-12` q1-q4 = QCM de la leçon, « bilan qN » = N-ième question du bloc bilan
(= q(N+4) dans le fichier). La contre-relecture indépendante prévue par la
phase C reste à faire par l'orchestrateur.

## Contre-relecture de mes propres corrections

Relues une à une après coup : les 22 retouches du dosage (densité, « chaque », fenêtres de lots),
les 2 explain et les 4 phrases de corps. Aucune ne rend un distracteur vrai ni ne contredit la
leçon ; deux restent lourdes (`lecon-12` q4 « quand la seule dépense le justifie enfin »,
`lecon-02` q3 « (ex. clé vide, champ faux, nom double) », télégraphique). Ce n'est pas une
contre-relecture indépendante : celle de la phase C reste à faire.

## Vérifications

| contrôle | résultat |
|---|---|
| `node tools/verif-html.js` | **Aucun problème** |
| `node tools/verif-contenu.js` | code 0 — 1 551 « Cas réel » conformes sur 1 551 |
| `node tools/verif-donnees.js` | 4 erreurs, toutes **I18** (index `quiz-index.js`, `search-index.js`, `search-lite.js` périmés : attendu, l'orchestrateur les régénère) ; 3 avertissements anciens (I17 `zig`, I19, I25 `doc`) |
| `node tools/mesure-qcm-intouchable.js cloud 8d163bf` | 155 distracteurs réécrits sur 159 ; **2 atteintes, les deux déclarées** (`lecon-10` bloc0 q2 et `lecon-12` bloc1 q8 : explain) ; 0 bonne réponse touchée |
| `node tools/mesure-explain-orpheline.js --depuis=8d163bf --seul=cloud` | aucune explication orpheline |
| `node tools/verif-qcm-biais.js` / `verif-qcm-lexique.js` | « progressé sans que le gain soit figé » (cloud 92,5 → 25,5 % ; STRICTE 36,4 → 0,0 %) : attendu, référence non refigée (règle de fusion) |
| blocs JSON | 13 blocs QCM + 12 blocs d'exercices reparsés par `pose.js` / `remplace.js` à chaque écriture ; 0 CR, 0 BOM dans les 13 pages |
| `scratchpad/c2-cloud/sonde/controle.js` (sur la retouche de corps) | aucun indicateur déplacé |
| `node tools/verif.js --rapide` (1 858 s, 54 étapes) | 4 signalées, **toutes attendues** : `donnees` (I18), `qcmbiai`, `qcmlexi`, `normatf` (chiffres mesurés sur tout le site) ; `doc-ref` et `etudes` vertes ; 0 fichier CRLF dans la copie (`git ls-files --eol`) |

## Les leçons de ce cours

- **La règle du `k` gouverne tout dans un cours dont chaque page a son propre vocabulaire** : les
  mots les plus naturels (« facture », « machines », « nombre », « serveur », « taille ») sont
  absents de telle ou telle page ; `vocab.js` + `essai.js` (candidats évalués avant d'écrire) ont
  divisé par trois le nombre d'allers-retours. Le bilan (`lecon-12`) est le plus dur : la page de
  référence est la leçon 12 seule, alors que les bonnes réponses parlent de toute la formation
  (`k` jusqu'à 5 sur 6 mots longs).
- **Fermer la longueur fabrique la densité** (36,5 % après la vague) : la bonne réponse, écrite
  avec le vocabulaire du cours, reste la plus dense ; le dosage se calcule (6 bascules, pas 19).
- **Le mot fétiche est né de la règle du `k`** : « chaque » (6 lettres, présent dans presque toutes
  les pages) servait à compléter le `w` ; 29 distracteurs pour 4 bonnes réponses.
- **Les fenêtres de lots voient ce que le cours noie** : après le dosage, toutes les stratégies du
  cours étaient entre 22 et 27 %, mais « la plus dense » valait 50 % sur les leçons 1-4.

## Ce qui reste, sans arrondir

- Pire stratégie : la QUATRIÈME plus longue **26,1 %** ; « ecarter les deux extrêmes » 25,9 % ;
  ECARTER la moins bavarde 22,2 %.
- `lecon-12` bilan q2 (PaaS / IaaS / SaaS / Sur site) : trois options de 4 lettres, ex æquo de
  longueur inévitable ; les stratégies de rang y donnent 1/3 à la bonne réponse.
- Quelques distracteurs au sens mince, tenus par les contraintes (`lecon-06` q3 « depuis un pays
  voisin », `lecon-12` q4 « quand la seule dépense le justifie enfin », `lecon-12` bilan q3
  « De la facturation : si une zone coûte, les autres compensent ») : faux, mais peu tentants.
- **Bonnes réponses discutables, signalées, non touchées** : `lecon-01` q1 « SaaS = logiciel prêt
  (tu ne gères rien) » (la leçon 06 dit « jamais jusqu'à 100 % » : en SaaS on gère encore comptes,
  accès et données) ; `lecon-05` q1 « le calcul, souvent le plus gros poste » (vrai en général,
  pas pour une charge de stockage) ; `lecon-12` exercice 2, indice « sixième pilier ajouté
  récemment » (décembre 2021 : se périme).
- Encadrés « Cas réel » : aucun touché, aucun contredit par un QCM (`verif-contenu` : 1 551
  conformes sur 1 551).
