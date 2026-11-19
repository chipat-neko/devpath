# C3 — reseaux, 92,9 % → 23,6 %

Copie de travail `D:\test-claude-c3-reseaux`, branche `v18/c3-reseaux`, partie de `8d163bf`.
Un seul agent pour tous les rôles (mesure, preuve, écriture, dosage, relecture, contre-relecture),
**sans relecteur indépendant** : la contre-relecture indépendante de C1 (b) reste à faire.
Rien n'a été écrit dans le dépôt principal `D:\test-claude\`.

Sondes et preuves (hors git, `scratchpad/c3-reseaux/`) : `depart/` (mesures brutes de départ,
`questions.txt`), `sonde/` (`controle.js`, `pose.js`, `simule.js`, `essai2.js` copiés de
`vue-sonde` et repointés ; neuves : **`atelier.js`**, `cand.js`, `dosage.js`, `fetiche.js`,
`majuscules.js`, `aplat.js`, `texte.js`, `vocab.js`, `pagevoc.js`, `carac.js`, `liste.js`,
`cibles.json`), `lots/` (tous
les patchs posés), `preuves/` (programmes exécutés et leurs `.out`), `mesures/` (mesures
intermédiaires et finales). Consigne du cours : `scratchpad/CONSIGNE-RESEAUX.md` (versionnée).

**Atteintes à l'intouchable : 0** (`node tools/mesure-qcm-intouchable.js reseaux 8d163bf` :
« Aucune atteinte : q / correct / explain / bonne reponse intacts »). Aucune bonne réponse ni
explication n'a été prouvée fausse ; six sont **signalées** (§ 4.2), aucune n'a été touchée.

## 1. Avant / après

| indice | avant (`8d163bf`) | après (`HEAD`) | commande |
| --- | ---: | ---: | --- |
| **la plus longue** | **92,9 %** | **23,6 %** | `node tools/mesure-biais-qcm.js --seul=reseaux` |
| pire stratégie des 44 | la plus longue 92,9 % | **la moins bavarde 27,4 %** | idem |
| la plus détaillée | 77,6 % | 25,0 % | idem |
| le mot technique exclusif / son inverse | 61,4 % / 8,2 % | 24,0 % / 25,3 % | idem |
| ponctuation forte (seule / restreindre) | 61,1 / 61,5 % | 25,0 / 25,0 % | idem |
| restreindre aux deux-points | 51,4 % | 25,0 % | idem |
| l'incise entre parenthèses | 45,2 % | 25,0 % | idem |
| l'écho de la question / son inverse | 38,5 % / 19,9 % | 25,0 % / 25,0 % | idem |
| la seule avec un point-virgule | 36,5 % | 25,0 % | idem |
| la plus dense / son inverse | 23,7 % / 25,3 % (après la vague : **42,8 %** / 19,7 %) | 25,5 % / 25,2 % | idem |
| la moins bavarde / son inverse | 1,6 % / 38,5 % | 27,4 % / 23,2 % | idem |
| écarter les deux extrêmes | 3,4 % | 26,4 % | idem |
| questions trahies par 5 indices ou plus | 36 sur 52 (69,2 %) | **0** | idem |
| **rangs** de longueur de la bonne réponse | 49 / 3 / 0 / 0 | **13 / 13 / 13 / 13** | `node tools/plan-rangs-qcm.js reseaux` |
| **lexique** (exploitables / retournées / à mettre en forme) | 45 / 22 / 48 | **0 / 0 / 0** | `node tools/mesure-lexique-qcm.js --liste=reseaux` |
| lexique, couvertures STRICTE / PROPORTION / INVERSE | 32,7 / 57,7 / 46,2 % | 0,0 / 0,0 / 0,0 % | `node tools/mesure-lexique-qcm.js --seul=reseaux` |
| **mot fétiche** | 6 alertes (`adresse` 35,3 %, `machine`, `serveur`, `connexion`, `réseau`, `chaque`) | **0 alerte** (pire : `connexion` 27,9 %) | `node tools/mesure-mot-fetiche.js reseaux` |
| **tics de lot** | 10 (deux-points médian 51,0 %, point-virgule médian 36,5 %…) | **0** | `node tools/mesure-tics-lot.js reseaux` |
| **biais inverse** | 4 alertes (rangs 2, 3, 4, la moins bavarde) | **0 alerte** (pire 25,3 %) | `node tools/mesure-biais-inverse.js --toutes reseaux` |
| intrus lexical DÉFAUT / EXCÈS, questions sûres | 28,8 % / 26,4 %, 5 sûres | 25,0 % / 25,0 %, **0 sûre** | `node tools/mesure-mot-question.js reseaux --liste` |
| fenêtres de lots (`--lots`, `--lots=3`) | — | aucune fenêtre `reseaux` signalée | `node tools/mesure-biais-qcm.js --lots=3` |
| explications orphelines | — | **0** (6 cas indicatifs, mots du français, relus) | `node tools/mesure-explain-orpheline.js --depuis=8d163bf --travail --seul=reseaux` |

## 2. Ce qui a été écrit

- **155 distracteurs réécrits sur 156** ; un gardé tel quel : `lecon-07` q3 « 192.168.1.4/26 ».
  Caractères des distracteurs : **5 224 → 14 893** (+9 669 ; `plan-rangs-qcm` en demandait 7 855 ;
  compté par `scratchpad/c3-reseaux/sonde/carac.js 8d163bf`).
- Huit commits de contenu : quatre lots d'écriture (`01-03`, `04-06`, `07-09`, `10-11`), le
  dosage, la relecture par contradiction, la contre-relecture, une seconde contre-relecture
  (`acf1a12`) ; puis ce rapport. Chaque bloc JSON reparsé avant écriture
  (`pose.js`), fins de ligne LF gardées (0 CR, 0 BOM sur les 12 pages).
- Chaque question passée à `atelier.js` (rang visé, bande 70-130 %, marques des quatre ou d'aucune,
  `k` / `w`, intrus DÉFAUT / EXCÈS, formes des tics) avant d'être posée.
- **Rangs visés** : ceux de `plan-rangs-qcm`, plus `lecon-06` q2 (rang 0) et `lecon-11` q7 (rang 1)
  que l'outil ne planifie pas ; puis quatre permutations dans le bilan (`lecon-11` q5 et q6 contre
  q7 et q10) pour pouvoir écrire des distracteurs justes : répartition finale 13 / 13 / 13 / 13.
- **Une phrase de corps ajoutée sans faute à corriger** : `lecon-10`, glossaire « Filtrage à
  état », « …, tout en refusant les nouvelles connexions venues de l'extérieur ». Elle répète ce que
  la section « Un pare-feu à état » dit déjà, et fait entrer dans la page les deux mots de la bonne
  réponse de q3 qui en étaient absents (sans elle, chaque distracteur devait porter exactement
  douze mots longs dont deux étrangers à la page).
- `lecon-06` q2 : le distracteur « ping » est **remis** (« ping (ou fping) ») parce que l'explain
  intouchable le cite (« ping teste la joignabilité »).

## 3. Fautes de fond trouvées et corrigées

Aucune bonne réponse, aucune explication prouvée fausse. **Deux phrases de corps prouvées
fausses, corrigées** :

1. **`lecon-07`, légende du schéma** : « Deux adresses sont **toujours** confisquées ». Faux pour
   /31 (RFC 3021, liaisons point à point) et /32. Python 3.14, `ipaddress` (`preuves/cidr31.py`) :
   `/30` 4 adresses, 2 utilisables ; `/31` 2 adresses, **2** utilisables ; `/32` 1 adresse, **1**
   utilisable. Devient « Deux adresses sont confisquées (sauf dans les cas limites /31 et /32) ».
   (Le mémo de la même page disait déjà « /32 : une seule machine ».)
2. **`lecon-06`, exemple de référence du mini-projet** : « Le navigateur lit le HTML, puis REFAIT
   2→5 pour CSS, JS, images. » Faux quand la connexion est réutilisée (RFC 9112 § 9.3, connexions
   persistantes par défaut ; RFC 9113 § 9.1, une connexion HTTP/2 par origine). Node 26
   (`preuves/keepalive.js`) : 4 requêtes HTTP/1.1 persistantes → **1** connexion TCP ; 4 requêtes
   HTTP/2 en parallèle → **1** connexion ; témoin « Connection: close » → 4. Devient « REFAIT 5
   pour CSS, JS, images (et 3→4 seulement s'il ouvre une connexion neuve) ». La ligne du schéma
   « Et souvent, on recommence (2→5) » est gardée : « souvent » la rend juste (ressources servies
   par une autre origine).

**Distracteurs qui étaient vrais ou défendables, réécrits à la relecture** :
`lecon-08` q4 « Aucune adresse DHCP n'est libre » (une plage DHCP épuisée donne bien une adresse en
169.254) ; `lecon-11` q7 « Du côté de l'antivirus » (un filtrage DNS par un logiciel de sécurité
se défend) ; `lecon-11` q12, seconde moitié « il ne dissimule pas l'identité » (VRAIE, elle
doublait la bonne réponse). Dans les distracteurs d'origine, le même défaut existait déjà à
`lecon-06` q2 (« ping » affiche l'adresse résolue) : gardé, l'explain le classe en joignabilité.

**Deux autres trouvés par une seconde relecture des 52 questions, faite après le premier jet de
ce rapport, alors que toutes les mesures étaient vertes** (commit `acf1a12`) :
`lecon-11` q12 opt2 « Le VPN ne chiffre pas du tout le trajet **de bout en bout** » (lue sans
« du tout », la moitié est VRAIE : un VPN ne chiffre que jusqu'à son serveur) → « Le VPN ne
chiffre pas du tout le tunnel qu'il ouvre, il fait juste disparaître l'adresse de l'abonné » ;
`lecon-11` q8 opt0 « Que le contenu est **véritable** » (« véritable » se lit aussi
« authentique », et HTTPS garantit bien l'intégrité de ce qui est reçu) → « Que le contenu est
précis ». Mêmes rangs, mêmes `k` / `w`, toutes les mesures rejouées à l'identique (§ 1).

## 4. Exécuté, non exécuté, signalé

### 4.1 Exécuté (sorties dans `scratchpad/c3-reseaux/preuves/`)

- **Python 3.14.5, `ipaddress`** (`adresses.py`) : plages privées RFC 1918 (`is_private`), 8.8.8.8
  et 172.32.0.1 publiques ; /24 = 255.255.255.0 ; /26 : 64 adresses, 62 utilisables ; /24 : 256 et
  254, réseau .0, diffusion .255 ; les quatre /26 de 192.168.1.0/24 (.0, .64, .128, .192) ;
  192.168.1.4/26 et .25/26 refusés (« has host bits set ») ; 0.0.0.0/0 = 4 294 967 296 adresses ;
  169.254.14.7 `is_link_local`. Plus `cidr31.py` (§ 3).
- **Node 26.13.1, `net`** (`tcp.js`) : port fermé → `ECONNREFUSED` en 3 ms ; port ouvert →
  connexion en 1 ms ; 192.0.2.1 (RFC 5737) → aucune réponse en 5 000 ms. Confirme `lecon-10` q4.
- **Node, `dns`** (`dns.js`, résolveur de la machine) : A → IPv4, AAAA → IPv6, CNAME
  (`www.github.com` → `github.com`), MX (`gmail.com`, 5 serveurs), NS (`com` → 13 serveurs).
- **Python, calcul** (`wifi.py`) : canaux 2,4 GHz (centre 2407 + 5 n MHz) et trios sans
  chevauchement (§ 4.2) ; conversion dBm → mW : −75 dBm = 3,162e-08 mW, 316 fois moins que
  −50 dBm (sert à `lecon-09` q3).
- **Node, `http` / `http2`** (`keepalive.js`, § 3).

### 4.2 Non exécuté (norme citée) et signalé sans être touché

Jugés sur la norme, non exécutés : la poignée de main TCP (RFC 9293 § 3.5), UDP sans renvoi et son
en-tête de 8 octets contre 20 pour TCP (RFC 768, RFC 9293 — sert à `lecon-03` q4), TLS et ses
trois garanties, QUIC sur UDP avec TLS intégré (RFC 9000, 9001, 9114), DHCP et ses options
(RFC 2131, 2132), ARP (RFC 826), le saut de fréquence de Bluetooth sur toute la bande 2,4 GHz
(sert à `lecon-09` q2), les comportements de VPN (aucun tunnel monté), le seuil « −75 dBm =
faible » (repère du cours, rien de mesuré sur une borne), le débit TCP et le chiffrement Wi-Fi
(`lecon-09` q4), un pare-feu qui **rejette** (il faudrait des droits d'administrateur pour poser
la règle), le vrai trafic HTTPS d'un navigateur (`keepalive.js` simule le client).

**Bonnes réponses ou explications discutables, signalées, non touchées** :

1. **`lecon-09` q2** et le corps (« seuls les canaux 1, 6 et 11 ne se marchent pas dessus ») :
   `wifi.py` montre qu'à 22 MHz de large, 1-6-11 est le **seul trio** dans les canaux 1 à 11
   (plan nord-américain), mais que 2-7-12 et 3-8-13 existent dans 1 à 13 (autorisés en France),
   et 1-5-9-13 à 20 MHz. « Les seuls » est vrai du trio en 1..11, faux pris à la lettre en Europe.
2. **`lecon-01` q4** (« souvent un pare-feu qui bloque ») et son explain : un pare-feu qui JETTE
   donne un délai dépassé (`tcp.js`), seul un pare-feu qui REJETTE donne « connexion refusée » ;
   `lecon-10` q4 et son explain disent l'inverse du « souvent ». Pas faux (le corps de `lecon-10`
   cite les deux cas), mais en tension.
3. **`lecon-05` q1** « Sur TCP » : la même leçon enseigne HTTP/3 sur QUIC/UDP (q4). Vrai de
   HTTP/1.1 et 2, daté pour HTTP/3.
4. **`lecon-06` q4, explain** « le navigateur répète le cycle (connexion/HTTP) pour chacune » :
   imprécis (§ 3, `keepalive.js`), mais le « d'où l'intérêt de HTTP/2 » le rend défendable pour
   HTTP/1.1 sans réutilisation ; non touché.
5. **`lecon-03` q1** « TCP garantit la livraison complète » : simplification (TCP garantit la
   livraison ou signale l'échec).
6. **`lecon-02` q2** : trois distracteurs décrivent des fonctions que la box remplit AUSSI
   (pare-feu, DHCP, relais DNS) ; ils restent faux pour le **rôle** de passerelle, que la question
   demande. Choix assumé, comme les distracteurs d'origine.

Non vérifié : `lecon-04`, « 13 identités répliquées en **des centaines** d'exemplaires » (le
nombre réel d'instances n'a pas été consulté).

## 5. Les leçons de ce cours

- **La vague a fabriqué « la plus dense »** (23,7 % → **42,8 %**) : les distracteurs, allongés à
  rang et `w` fixés, portaient plus de petits mots que la bonne réponse. Fermé par **neuf
  bascules calculées** (`dosage.js` : crédit 22,25 pour une cible de 13), sans rien rouvrir.
- **Ma propre correction a fabriqué un mot fétiche** : « chaque » (6 lettres, présent dans
  toutes les pages) servait à ajuster le `w` ; il est passé de **4 distracteurs à 41**, et
  écarter les options qui le portent rendait 31,3 %. Retiré de 20 distracteurs (« tout »,
  « toute », mot de compensation de la page quand le `w` devait rester égal) : 21 distracteurs le
  portent encore, 0 alerte. C'est la règle du `k` qui fait converger le vocabulaire (même leçon
  que `swift`).
- **Le mot technique exclusif ne se ferme pas question par question** quand une bonne réponse
  porte quatre à sept mots de 9 lettres exclusifs (`lecon-05` q2, `lecon-11` q3) : je l'ai **dosé
  au cours** — cinq questions où il désigne un distracteur seul, une où il désigne la bonne
  réponse (`lecon-11` q3) : 24,0 % en direct, 25,3 % en inverse.
- **Le bilan coûte le plus** : la page de référence est `lecon-11` (VPN), si bien que les bonnes
  réponses portent jusqu'à quatre mots étrangers (`lecon-11` q5 : k = 4, w = 5), et chaque
  distracteur doit en porter exactement autant.
- **Le diagnostic « la bonne réponse n'a pas de mot propre »** (intrus EXCÈS) revenait chaque
  fois qu'un distracteur reprenait tous les mots longs de la bonne réponse ; et **les égalités de
  longueur entre distracteurs** ouvraient « écarter les deux extrêmes ».
- **Relire après les mesures vertes rapporte, et relire une deuxième fois aussi** : trois
  distracteurs vrais ou défendables à la relecture, puis deux encore à la seconde relecture,
  toutes mesures à 25 %. Les cinq ont la même forme : une option à DEUX moitiés dont une seule
  est fausse, ou un mot à deux sens (« véritable »). Aucun outil ne lit le sens d'une option.

## 6. Ce qui reste, sans arrondir

- **La moins bavarde 27,4 %** (rendement 28,6 %) : la bonne réponse est SEULE à avoir le moins
  de mots dans 19,2 % des questions (10 sur 52), et la stratégie tombe sur des ex aequo dans
  32,7 % ; chaque bascule essayée cassait la bande de longueur ou le `w`. Écarter les deux extrêmes
  **26,4 %** (égalités numériques de `lecon-07` q3 : deux options de 14 caractères).
- `lecon-11` q9 : options numériques hors de la bande 70-130 % (65 534 / 254 / 32 / 8) ; aucune
  stratégie ne le voit, l'atelier le signale.
- `lecon-01` q2 : quatre permutations de même longueur (égalité complète, neutre).
- Mots portés par les seuls distracteurs, sous le seuil d'alerte (28,0 %) : « toute » 9
  distracteurs / 0 bonne (écarter rend 26,6 %), « clair » 9 / 0 (26,4 %), « chiffre » 7 / 0
  (26,1 %) ; « chaque » 21 distracteurs / 4 bonnes (26,3 %).
- Tournures faibles gardées faute de mieux sous contraintes : `lecon-04` q1 « (box ou serveur) »,
  `lecon-07` q4 « dédiée aux imprimantes isolées », `lecon-09` q3 « exactement dans le couloir »,
  `lecon-11` q5 « ne traçant que la route entière de la machine ».
- Le message du commit de relecture (`ebbeace`) dit « 5 distracteurs réécrits » : il y en a **4**
  (`lecon-08` q4, `lecon-11` q7 et deux de `lecon-11` q12, l'un posé deux fois).
- **Contre-relecture indépendante à faire** (consigne de C1) : la mienne a trouvé 1 correction
  fautive sur 6 (`lecon-08` q4), puis la seconde relecture 2 distracteurs défendables de plus ;
  les phases B et B4 trouvaient 13 à 30 % de fautes après l'auteur.

## 7. Vérifications de fin

- `node tools/verif-html.js` : aucun problème détecté.
- `node tools/verif-contenu.js` : 1 551 « Cas réel » conformes sur 1 551, code 0 ; aucun encadré
  « Cas réel » touché.
- `node tools/verif-donnees.js` : 4 erreurs, toutes **I18** (index dérivés périmés, attendu :
  `quiz-index.js`, `flashcards-data.js`, `search-index.js` non régénérés, règle de fusion) ;
  3 avertissements anciens (I17 `zig`, I19 pages d'étude, I25 `doc`).
- `node tools/verif.js --rapide`, rejoué sur l'état final (`acf1a12`) : **50 OK, 4 SIGNALE**
  en 821,3 s, code 1 (`scratchpad/c3-reseaux/mesures/verif-rapide-2.txt`). Les quatre sont dans
  la liste attendue :
  - `donnees` : les 4 erreurs I18 ci-dessus ;
  - `qcmbiai` : « référence périmée, cours reseaux : le cours a PROGRESSÉ (longueur 93,0 % →
    23,6 %, pire indice 93,0 % → 26,4 %) sans que le gain soit figé » ;
  - `qcmlexi` : « 1 cours a progressé sans que le gain soit figé ». Figer les deux cliquets
    revient à l'orchestrateur (`tools/` m'est interdit) ;
  - `normatf` : 67 contrôles OK, 8 en échec, tous sur les chiffres de conformité S3 / S4 que la
    page `doc` publie pour le site entier (13,1 %, 802, 5 301, 86,9 %, 69 / 89 cours…), que toute
    retouche de QCM déplace ; la page `doc` n'est pas à moi.

  `doc-ref`, `doc-rec` et `etudes`, annoncés comme signaux possibles, sont **OK**. Un premier
  passage, lancé avec `timeout 590`, a été coupé par mon propre délai (code 124) pendant le
  22ᵉ vérificateur (`doc-rec`) ; un deuxième, complet (1 123,7 s), donnait les mêmes 4 signaux sur l'état
  d'avant `acf1a12`.
- 0 CR, 0 BOM, tous les blocs `data-quiz` / `data-quiz-bilan` / `data-exos` reparsés.
