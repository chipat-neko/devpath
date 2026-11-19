# Consigne d'écriture — les QCM du cours `cloud` (V18, case C2)

Préparée le 2026-11-19 dans la copie de travail `D:\test-claude-c2-cloud` (branche `v18/c2-cloud`,
partie de `8d163bf`). Un seul agent fait tous les rôles (écriture, dosage, relecture, contre-relecture).
Mesures de départ archivées dans `scratchpad/c2-cloud/depart/` (hors git) ; sondes dans
`scratchpad/c2-cloud/sonde/` : `controle.js` (copie de `vue-sonde`, repointée sur `pages/cloud/` : à
vide, **0 indicateur déplacé sur 53 questions**), `pose.js` (applicateur : reparse chaque bloc,
refuse tout le fichier au moindre refus, garde le format — `idem.js` prouve que la resérialisation
rend les 13 blocs à l'octet près), `aplat.js`, `lecture.js` et **`atelier.js`** (banc d'écriture :
un lot de patchs appliqué EN MÉMOIRE ; pour chaque question, toutes les stratégies de
`mesure-biais-qcm.js` qui tranchent — CHARGÉES par `require`, jamais recopiées —, le lexique `k`/`w`,
l'intrus lexical, les motifs de `mesure-tics-lot` ; pour le cours, les 44 stratégies, les rangs, le
lexique, l'intrus et les tics de lot, n-grammes compris. À l'état de départ il rend au dixième près
les chiffres des outils : 92,5 / 77,2 / 66,5 / 51,9 %, lexique 41 / 40 / 50, intrus 25,5 / 25,0 %).

Le cours : « Cloud & déploiement », 12 leçons, **53 questions** (dont 12 de bilan dans `lecon-12`) —
modèles de service (IaaS / PaaS / SaaS / serverless), responsabilité partagée, régions et zones,
stockage objet / bloc / fichier et bases gérées, calcul (VM, conteneurs, FaaS, démarrage à froid),
coûts (right-sizing, autoscaling, réservé / spot, egress, budgets), IAM et secrets, conception d'un
déploiement, VPC (CIDR, sous-réseaux, NAT, équilibreur, DNS), observabilité (journaux, métriques,
traces, SLI / SLO, budget d'erreur, centiles), haute disponibilité (neuf, SPOF, RPO / RTO, retry,
disjoncteur), conteneurs en production (registre, sondes, rolling / blue-green / canari), et le
Well-Architected Framework.

## 1. Mesures de départ (sur `8d163bf`, avant toute écriture)

`node tools/mesure-biais-qcm.js --seul=cloud` :

| indice | réussite | couverture | rendement |
|---|---:|---:|---:|
| **la plus longue** | **92,5 %** | 100,0 % | 92,5 % |
| la plus détaillée | 77,2 % | 71,7 % | 94,7 % |
| le mot technique exclusif | 66,5 % | 69,8 % | 78,4 % |
| ponctuation forte (seule / RESTREINDRE) | 54,2 / 54,7 % | 41,5 % | 95,5 % |
| l'incise entre parenthèses / RESTREINDRE à la parenthèse | 51,9 % | 35,8 % | **100,0 %** |
| RESTREINDRE aux deux-points | 47,6 % | 32,1 % | 94,1 % |
| ECARTER la moins bavarde | 37,6 % | 5,7 % | 66,7 % |
| l'écho de la question | 37,4 % | 34,0 % | 61,1 % |
| la seule avec une barre oblique | 34,4 % | 15,1 % | 87,5 % |
| la plus dense | 33,0 % | 98,1 % | 32,7 % |
| la seule qui nie | 31,1 % | 32,1 % | 41,2 % |
| le point-virgule (seul / RESTREINDRE) | 30,7 % | 7,5 % | **100,0 %** |

**35 questions sur 53 (66,0 %)** trahies par 5 indices ou plus. Rangs **49 / 1 / 3 / 0**, cible
**14 / 13 / 13 / 13** ; `plan-rangs-qcm cloud` demande **7 875 caractères** sur 51 questions.
Biais inverse (`mesure-biais-inverse --toutes cloud`) : **4 alertes** (rangs 2, 3, 4 et « la moins
bavarde », tous à 0,0 % en directe). Lexique (`mesure-lexique-qcm --liste=cloud`) : **41
exploitables, 40 retournées, 50 à mettre en forme**. Mots fétiches (`mesure-mot-fetiche cloud`) :
**2 alertes** — `application` (5 bonnes / 4 distracteurs, RESTREINDRE 29,7 %) et `chaque` (4 / 5,
28,3 %) ; `parce` est un mot de DISTRACTEUR (4 / 15). Intrus lexical : 25,5 / 25,0 %, 1 question sûre.
Tics de lot (`mesure-tics-lot cloud --exemples`) : **5** — deux-points médian **18 / 5** (GLOBAL
47,2 %), glose finale **5 / 0**, adverbe de reprise **5 / 0**, point-virgule médian **4 / 0**,
« de la » 5 / 5.

## 2. Ce qui a été prouvé AVANT d'écrire

Exécuté (sorties dans `scratchpad/c2-cloud/preuves/`, hors git) :

| affirmation | ce que l'exécution rend | fichier |
|---|---|---|
| 99 / 99,9 / 99,99 / 99,999 % sur un mois de 30 jours | 7,20 h ; 43,20 min ; 4,32 min ; 25,9 s (31 jours : 44,6 min et 4,46 min) | `dispo.js` |
| « une latence moyenne de 100 ms peut cacher que 1 client sur 20 attend 3 secondes » (corps de `lecon-09`) | **IMPOSSIBLE** : 1 sur 20 à 3 000 ms impose une moyenne d'au moins 150 ms | `dispo.js` |
| 10.0.0.0/16 = 65 536 adresses de 10.0.0.0 à 10.0.255.255 ; 10.0.1.0/24 = 256 | vrai (module `ipaddress` de Python) ; deux /16 identiques se chevauchent, 10.0.0.0/16 et 10.1.0.0/16 non | `cidr.py` |
| backoff exponentiel + jitter désynchronise les clients | 1 000 clients, 3 essais : pic de 1 000 tentatives dans la même fenêtre de 100 ms sans jitter (backoff ou non), 147 avec | `resilience.js` |
| le disjoncteur : ouvert après N échecs, échec immédiat, appel d'essai, puis REFERMÉ | automate exécuté : « ouvert » = la dépendance n'est plus appelée ; l'appel d'essai réussi REFERME le circuit | `resilience.js` |

Vérifié dans la documentation officielle (non exécutable ici) : six piliers du Well-Architected
d'AWS (page aws.amazon.com/architecture/well-architected, « its six pillars ») ; **cinq** piliers chez
Azure (learn.microsoft.com, pas de pilier durabilité) ; six chez Google (Well-Architected Framework,
durabilité comprise) ; sous-réseau public = route directe vers une passerelle Internet (guide VPC
d'AWS) ; la route LOCALE de chaque table relie tous les sous-réseaux du VPC ; pas d'appairage entre
VPC aux plages qui se chevauchent (guide VPC peering) ; NAT : connexions sortantes, aucune entrante
non sollicitée ; sondes readiness / liveness (kubernetes.io) ; démarrage à froid de Lambda ;
disjoncteur (Martin Fowler, « CircuitBreaker »).

## 3. ⚠️ LE PIÈGE PROPRE À CE COURS : LE GÉNÉRIQUE CONTRE LE FOURNISSEUR

Le cours est volontairement générique (« commande générique »). Un distracteur ne doit pas être
vrai chez UN fournisseur : « un sous-réseau privé ne peut rien télécharger » (faux avec une NAT,
mais vrai d'un sous-réseau « isolé » d'AWS), « le serverless ne garde jamais rien en mémoire »
(Lambda réutilise l'environnement), « le spot coûte toujours moins cher » (vrai en pratique : à ne
pas employer comme erreur). Erreurs nettes, utilisables : confondre IaaS / PaaS / SaaS ; région et
zone ; SLA (contrat) et SLO (cible interne) ; RPO (données perdues) et RTO (temps de reprise) ;
readiness (routage) et liveness (redémarrage) ; journaux / métriques / traces ; stockage objet /
bloc / fichier ; à la demande / réservé / spot ; public = « sans protection » (ce sont les groupes de
sécurité qui filtrent) ; NAT = traduction de noms (c'est le DNS) ; canari = bascule totale (c'est le
blue-green) ; egress = trafic entrant ; le disjoncteur qui réessaie ; le budget d'erreur compté en
alertes ; la moyenne contre le centile.

## 4. Ce que chaque question doit tenir (vérifié par `atelier.js`)

1. **Rang** de la bonne réponse = celui de `plan-rangs-qcm` (14 / 13 / 13 / 13 au total), sans ex
   æquo avec elle ; distracteurs dans 70-130 % de sa longueur ; rang en MOTS voisin du rang en
   caractères ; la bonne réponse ni toujours la plus dense, ni toujours la moins bavarde.
2. **Marques : les quatre options la portent, ou aucune** — `;`, `:`, parenthèse (même NOMBRE
   d'incises de 4 signes et plus), glose finale, tiret (`—`, ` - `), barre oblique (`/`,
   `CPU/mémoire`, `min/mois`), guillemets « », flèche, `=`, point interne, virgule décimale
   (`0,1 %`). **Même nombre de `, : ;`** dans les quatre (la plus détaillée).
3. **Absolus** (`uniquement`, `seulement`, `jamais`, `rien`, `aucun`, `toujours`…), **négation**
   (`ne`, `pas`, `n'`, `ni`, `non`…), **prudents** (`peut`, `permet`, `selon`, `souvent`…) : quatre
   porteurs ou aucun. La bonne réponse de `lecon-01` q1 porte « ne … rien », celle de `lecon-06` q2
   « jamais », `lecon-08` q1 « n'en a pas » : les trois distracteurs aussi.
4. **Écho** : même nombre de mots de l'énoncé (4 lettres et plus) dans les quatre. **Attaque** :
   jamais trois options qui commencent par le même mot et une quatrième par un autre.
5. **Majuscule d'emphase** : même nombre partout. ⚠️ Ne sont PAS des sigles pour l'outil : `IAM`,
   `VPC`, `SPOF`, `AZ`, `RH`, `IT`, `CRM`, `EC2`, `S3`, `FAAS` — et `TU`, `SORTANT` sont des cris.
6. **Mots de 9 lettres et plus** : chaque option en porte le même nombre d'exclusifs (le plus sûr :
   reprendre ceux de la bonne réponse dans deux distracteurs au moins).
7. **Lexique** : `k` (mots de 6 lettres et plus ABSENTS du corps de la page, en occurrences) égal
   dans les quatre ; si `k > 0`, `w` (mots de 6+ lettres) égal aussi. L'apostrophe colle
   (`l'application` est UN jeton, qui doit exister tel quel dans la page).
8. **Intrus lexical** (mots de 5+ lettres, l'apostrophe coupe) : aucun mot porté par exactement
   trois options ; chaque option a au moins un mot propre (ou aucune n'en a).
9. **Tics de forme** (copie exacte de `mesure-tics-lot`) : 0, 2 ou 4 porteurs — « est / sont /
   reste / garde / devient » OÙ QU'ILS SOIENT, « cette / ces / cet », « car / puisque / parce que »,
   « alors / ensuite / puis », « ne … que », « , et », trois virgules, « ex. », deux-points médian.
10. **Mots fétiches** : poser `application`, `chaque`, `données` dans des distracteurs là où la bonne
    réponse les porte ; ne pas multiplier `parce`, `nombre`, `fournisseur` dans les distracteurs.

Et par-dessus tout : **un distracteur est une phrase française qui énonce une thèse fausse,
précise et plausible** ; on doit pouvoir dire en une phrase pourquoi elle est fausse. Aucune
parenthèse ni queue de phrase de remplissage, aucun aveu final (« … et tout s'arrête »), aucun
référent orphelin. Si une contrainte oblige à écrire une phrase bancale, c'est la contrainte qui
cède.

## 5. Ordre de travail

Lots `01-03`, `04-06`, `07-09`, `10-11`, `12` ; patchs dans `scratchpad/c2-cloud/vague/<lot>.json`,
simulés par `atelier.js`, posés par `pose.js --ecrire`, commit après chaque lot. Puis mesure du cours
entier (`mesure-biais-qcm --seul=cloud`, `mesure-biais-inverse --toutes cloud`, `mesure-lexique-qcm
--liste=cloud`, `mesure-mot-fetiche cloud`, `mesure-tics-lot cloud`, `mesure-mot-question cloud`,
`mesure-biais-qcm --lots --cours=cloud`), dosage calculé, relecture par contradiction (QCM ET
corps), contre-relecture des corrections, mesure finale.
