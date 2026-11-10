# LE NNᵉ COURS — `api` (« API REST »), 89,9 % → 24,6 %

Branche `b4/api`, copie de travail `D:\test-claude-b4\api`, passe parallèle du 2026-11-10, un seul
rédacteur pour tous les rôles (écriture, dosage, relecture, contre-relecture). 14 leçons,
**57 questions dont 12 de bilan** (`lecon-14`). Consigne versionnée : `scratchpad/CONSIGNE-API.md`.
Aucun fichier du dépôt principal `D:\test-claude\` n'a été modifié (lectures seulement : les sondes
de `scratchpad/tests-sonde/`, copiées dans la copie de travail).

## ⚠️ EN TÊTE : DEUX BONNES RÉPONSES PROUVÉES FAUSSES, CORRIGÉES (commit `7f5bb68`)

1. **`lecon-06` q2 (CORS), prouvée fausse PAR EXÉCUTION.** La bonne réponse disait « avec
   `Access-Control-Allow-Origin: *`, n'importe quel site pourrait appeler l'API depuis le navigateur
   d'un utilisateur connecté ». Rejoué sous **Chrome 157 headless** contre deux serveurs Node sur
   127.0.0.1 (ports `listen(0)`, DNS coupé hors 127.0.0.1) — `scratchpad/api-preuves/cors.js`, sortie
   `cors.out` :
   - avec `*` et les cookies : **le navigateur REFUSE la réponse** (`TypeError: Failed to fetch`),
     même avec `Access-Control-Allow-Credentials: true` ;
   - avec `*` sans cookies : seule la réponse anonyme est lue (`{"public":true}`) ;
   - **sans aucun en-tête CORS, la requête part quand même, cookie compris** : CORS n'empêche pas
     d'« appeler », il empêche le JavaScript de LIRE ;
   - le vrai danger : l'origine **renvoyée en écho** avec `Allow-Credentials: true` (la page tierce
     lit `{"utilisateur":"lou","solde":1234}`).
   Corrigés : la bonne réponse (« Parce que, si l'en-tête vaut *, le navigateur refuse de livrer à
   JavaScript la réponse d'une requête qui porte les cookies ; on déclare l'origine exacte du front »),
   son explain, et le paragraphe « Point de vigilance » du corps, qui disait la même chose fausse.
2. **`lecon-11` q1, prouvée fausse PAR LA NORME.** « 400 est réservé à une requête que le serveur
   n'arrive même pas à lire » : RFC 9110 §15.5.1, « The 400 (Bad Request) status code indicates that
   the server cannot or will not process the request due to something that is perceived to be a client
   error » — le refus générique, pas un code réservé (le cours lui-même, `lecon-03`, dit « 400 ou
   422 »). Corrigée en « 400, plus général, sert d'abord à une requête que le serveur n'arrive même pas
   à lire » ; explain ajusté (« le refus générique, employé d'abord pour… ») ; le corps de `lecon-11`
   dit maintenant ce que dit la RFC.

`node tools/mesure-qcm-intouchable.js api a6a45f2` : **159 distracteurs réécrits sur 171, 4
atteintes, toutes délibérées** (ces deux bonnes réponses et leurs deux explain).

## Avant / après

| indice (commande) | départ (`a6a45f2`) | arrivée (`ce74c6e`) |
|---|---:|---:|
| « la plus longue » (`mesure-biais-qcm --seul=api`) | **89,9 %** (couv. 93,0 %, rend. 94,3 %) | **24,6 %** (rend. 26,0 %) — 22,8 % avant la fin du dosage |
| rangs de la bonne réponse (`plan-rangs-qcm api`) | 53 / 2 / 2 / 0 | **16 / 14 / 13 / 14** (15 / 15 / 13 / 14 avant la fin du dosage) |
| questions trahies par 5 indices ou plus | 44 sur 57 (77,2 %) | **0** (46 à 0–2, 11 à 3–4) |
| la plus détaillée / ponctuation forte / incise / point-virgule / écho / guillemets / absolus / négation / prudente / majuscule / point interne / barre oblique / attaque | 70,0 / 60,5 / 60,1 / 46,1 / 42,8 / 31,6 / 27,9 / 32,2 / 29,4 / 29,8 / 27,6 / 33,8 / 28,9 % | **25,0 % chacune, couverture 0,0 %** |
| le mot technique exclusif | 58,3 % | **25,4 %** (1 question, `lecon-14` q9) |
| la DEUXIÈME / TROISIÈME / QUATRIÈME plus longue | 4,8 / 3,1 / 2,2 % | **25,4 / 23,7 / 26,3 %** (27,2 / 23,7 / 26,3 % avant la fin du dosage) |
| écarter les deux extrêmes / ECARTER la plus courte | — | 25,0 / 25,1 % |
| **la plus dense (mots longs)** | 31,1 % | **26,3 %** (rend. 25,9 %) — 70,2 % après la vague, 42,1 % après `fdb7c7d`, 38,6 % après `7fcbbf1` |
| **la moins bavarde (peu de mots)** | 4,5 % | **25,4 %** (rend. 23,9 %) — 43,3 % après la vague, 39,2 % après `fdb7c7d`, 34,8 % après `7fcbbf1` |
| ECARTER la plus dense / ECARTER la moins bavarde | — | 24,3 / 24,0 % |
| **pire indice des 44 stratégies** | la plus longue, 89,9 % | **26,3 %** (ex æquo : la plus dense et la QUATRIÈME plus longue) |
| biais inverse (`mesure-biais-inverse --toutes api`) | 4 alertes | **0 alerte** (pire : la moins bavarde, 25,4 %) |
| lexique (`mesure-lexique-qcm --liste=api`) | 46 exploitables, 33 retournées, 49 à mettre en forme | **0 / 0 / 0** |
| mots fétiches (`mesure-mot-fetiche api`) | 5 alertes (`requête`, `ressource`, `client`, `parce`, `serveur`) | **0** (au plus près : `serveur` ECARTER 27,9 %, `chaque` ECARTER 27,6 %) |
| tics de lot (`mesure-tics-lot api`) | 9 (point-virgule médian 17/3, glose finale 13/2, deux-points 14/5…) | **0** |
| intrus lexical (`mesure-mot-question api`) | — | DÉFAUT 25,0 / 25,0 %, EXCÈS 24,6 / 24,9 %, 0 question sûre |

Sorties brutes : `scratchpad/api-depart/` (départ) et `scratchpad/api-final/` (arrivée ; `*-v2.txt` après
`ce74c6e`), hors git.

**Écriture** : 159 distracteurs réécrits sur 171, 12 gardés (bilan : `GET/POST/PUT/DELETE`,
`404/200/500/301`, et un distracteur de q6, q7, q10 ; `lecon-13` q1 « Les tests unitaires »).
**11 486 caractères écrits** (4 865 → 16 351 pour les distracteurs). Cinq lots commités
(`d058849`, `4cd66b0`, `4e5746e`, `adec41f`, `0aa32ee`), un dosage en trois temps (`fdb7c7d`,
`7fcbbf1`, puis `ce74c6e` : 15 options sur 15 questions, distracteurs 16 341 → 16 298 caractères).

**Le corps des leçons a reçu les mots de 6 lettres et plus que les bonnes réponses étaient seules à
porter** (règle du `k` : 20 bonnes réponses sur 57 en avaient), toujours dans une phrase qui dit
quelque chose de juste : « une interface qui permet… », « `PATCH` n'applique qu'une modification
partielle », « une imbrication qui dépasserait deux niveaux deviendrait illisible », « `401
Unauthorized` / `403 Forbidden` », « exploitable par un attaquant », « sans que l'application
connaisse son mot de passe », « des résultats sont sautés ou dupliqués », « évite d'enchaîner
plusieurs appels », la phrase RFC 9110 sur le 400, « ce 200 trompe les clients », « l'endpoint
recalcule… n'a pas été modifiée », « un double effet », « garantis, donc testés », « attrapant le
champ manquant ou le type changé », « (anciennement Swagger) », « un test de contrat valide chaque
réponse contre le schéma ». Ensuite, chaque distracteur n'emploie que des mots de la page (ou de
moins de 6 lettres) : lexique 0 / 0 / 0. Fin du dosage (`ce74c6e`) : une phrase de plus, cette fois
pour un DISTRACTEUR — `lecon-14`, étape « Créer » du mini-projet : « `201` + un en-tête `Location`
pointant vers la tâche créée » (au lieu de « `201` + `Location` »). Vrai : c'est le rôle de
`Location` dans une réponse `201` (RFC 9110 §15.3.2, citée de mémoire ; la solution de l'exercice 2
de la même page le dit déjà : « il pointe vers l'URL de la nouvelle ressource »). Ajout seulement,
aucun mot retiré du corps : le `k` des autres questions de la page ne peut que baisser, il était à 0.

## Ce qui a été exécuté, et ce qui ne l'a pas été

Exécuté (Node 24.16, curl 8.19 de Git Bash, Chrome 157 headless ; serveurs sur 127.0.0.1, port
`listen(0)`, refermés ; aucun accès à Internet) — `scratchpad/api-preuves/` :
- `cors.js` / `cors.out` : les cinq cas ci-dessus ;
- `http.js` / `http.out` : `curl -d` sans `-H` envoie `application/x-www-form-urlencoded` (vrai :
  piège de `lecon-03`) — **et les deux `PUT` du projet de `lecon-14` partaient donc en formulaire** ;
  `curl -I` fait un `HEAD` ; `fetch` refuse un `GET` avec corps (« Request with GET/HEAD method cannot
  have body ») ; Node retire le corps d'un `204` et d'un `304` ; ETag + `If-None-Match` → 200 (27
  octets) puis 304 (0 octet) ; `http.STATUS_CODES[422]` vaut encore « Unprocessable Entity » ;
- `jetons.js` / `jetons.out` : la charge d'un JWT HS256 se lit sans le secret, la falsifier casse la
  signature, le jeton est en Base64**url** ; la fonction `webhookValide` de `lecon-12` recopiée :
  juste / corps modifié / mauvais secret / en-tête absent / JSON re-sérialisé → true / false / false /
  false / false, et sans le test de longueur `timingSafeEqual` lève `RangeError` ; limit/offset sur
  une insertion en tête → doublon (21), sur une suppression → élément jamais vu (20) ; curseur → aucun
  doublon.

Établi par la source, non exécuté : RFC 9110 §15.5.1 et §15.5.21 (lues sur rfc-editor.org) ; la règle
« `*` interdit avec les identifiants » du standard Fetch (de mémoire, confirmée par l'exécution
Chrome) ; « Se connecter avec Google » repose sur OpenID Connect (de mémoire) ; GitHub qui pagine par
curseur via `Link` (`lecon-05`), Stripe qui garde la clé d'idempotence 24 h (`lecon-08`), GitHub qui
révoque « toute clé » repérée (`lecon-06`) : **non vérifiés, laissés**. Les blocs supertest / Ajv /
Newman de `lecon-13` et `lecon-14` n'ont pas été exécutés (aucun paquet installé : la consigne interdit
d'appeler Internet, `npm install` compris).

## Relecture par contradiction (commit `740ace1`) — 27 corrections

Hautes et moyennes :
- **`lecon-14`, le projet fil rouge enseignait l'erreur que le cours dénonce deux fois** : l'étape 2
  et la solution du mini-projet faisaient `curl -X PUT … -d '{"faite": true}'` — un objet PARTIEL
  (or `PUT` remplace tout : piège de `lecon-02`, « le titre et le contenu, absents du corps, sont
  effacés ») et SANS `Content-Type` (piège de `lecon-03`, prouvé par `http.out`). Objet complet et
  en-tête ajoutés aux deux endroits ; étape « Terminer » reformulée.
- `lecon-06`, exercice : n'acceptait que `400` pour un e-mail invalide, quand la leçon 11 (q1) et
  l'exercice rédigé de la même page enseignent `422` → `422` accepté, `400` toléré, indices réécrits.
- `lecon-04`, exercice : acceptait `/users` (la collection) pour LIRE l'utilisateur 3 → retiré.
- `lecon-07` : « Se connecter avec Google est du pur OAuth 2.0 » contredisait la page (« OAuth 2.0
  n'est pas une méthode de connexion ») → « repose sur OAuth 2.0 (complété par OpenID Connect) ».
- 4 indices donnaient une réponse acceptée AVANT le dernier (« « Delete » en anglais », « JSON Web
  Token », « Too Many Requests », « « Accepted » ») et un `accept` était élargi au mot du placeholder
  (`lecon-05`, « filtre ») — rejoué avec `normExo` (`scratchpad/api-contre/exos-tous.js`, copie
  repointée de celle de `bash`) : 36 exercices, 109 réponses acceptées, **8 fuites restantes, toutes
  au dernier indice ou dans un libellé « Revoir … »** (convention du site, déjà laissée sur `bash` et
  `tests`).
Basses : `422 Unprocessable Content` (RFC 9110) au lieu de l'ancien nom (`lecon-03`, `lecon-06`),
« 500 Internal Server Error », Base64url, renvoi « `?page=3`, vue en leçon 5 » (la leçon 5 montre
limit/offset), trois masques d'indice de mauvaise longueur, « sept briques » sans compte juste,
« Cette dernière leçon » (`lecon-06` n'est pas la dernière), trois fautes de français, « les deux
media types ».

QCM, distracteurs écartés en écrivant parce que **vrais par accident** : « gRPC pour le temps réel
bidirectionnel » (flux bidirectionnels gRPC), « un JWT chiffré » sans conclusion fausse (JWE),
« 400 : toute donnée refusée est un 400 » (conforme à la RFC), « une page vide » pour limit/offset
(vrai après une suppression), « tests de charge / de fumée » pour « frappe une vraie route ».

## Contre-relecture (commit `9b58f8d`)

Le diff `a6a45f2..HEAD` relu passage par passage, corps puis QCM : **1 correction fautive sur 28**
(`lecon-14`, « `PUT /taches/1` renvoie la tâche complète » se lisait comme la réponse du serveur →
« envoie »). `controle.js --ref=HEAD` après chaque lot de corrections : **0 indicateur déplacé**.
⚠️ Limite à dire : relecture et contre-relecture faites par le même rédacteur que l'écriture — sur
les cours précédents, des contradicteurs indépendants prenaient 13 à 30 % des corrections ; ce chiffre
n'est pas comparable.

## Contrôles

`verif-html` : **0** (1 629 fichiers). `verif-rendu` sur les **15 pages** du cours : **0 erreur, 0
avertissement** (`scratchpad/api-depart/verif-rendu.txt`). JSON des blocs valide (reparsé à chaque
pose), 0 BOM, fins de ligne LF comme l'index git. `mesure-explain-orpheline --depuis=a6a45f2
--seul=api` : 6 signalements, tous bénins (l'explain nomme une notion, il ne réfute pas une option
absente). `verif-donnees` : **7 erreurs, toutes [I18]** (index dérivés périmés : `quiz-index.js`,
`antiseches-data.js`, `search-index.js`, `search-lite.js`) — attendues, l'orchestrateur régénère.
`verif.js --rapide` **non lancé** (faute de temps ; les cliquets `qcmbiai` / `qcmlexi` et I18
signaleraient comme prévu).

Après la fin du dosage (`ce74c6e`) : `verif-html` **0** (1 629 fichiers) ; `verif-rendu
--pages=` sur les **7 pages touchées** (`lecon-02`, `03`, `06`, `07`, `08`, `09`, `14`) : **0 erreur,
0 avertissement** sur 42 mesures (2 mesures « non stabilisées après 3 s », `lecon-03` 320 px sombre et
`lecon-07` 1 280 px sombre, mesurées quand même) ; JSON reparsé à chaque pose par `pose.js` ;
`mesure-qcm-intouchable api a6a45f2` : **4 atteintes**, les mêmes (les deux bonnes réponses corrigées
et leurs explain) ; `mesure-explain-orpheline --depuis=c5c337e --seul=api` : **0 orpheline**, 1 cas
indicatif (`lecon-14` q15 : l'explain dit « valide la forme complète de la réponse », l'option
effacée disait « validation complète de chaque réponse » — c'est justement pourquoi elle a été
remplacée, voir plus bas) ; `verif-donnees` : les mêmes **7 erreurs [I18]** (index périmés), rien
d'autre de nouveau.

## Les leçons de ce cours

1. **La règle du `k` fabrique « la plus dense » et « la moins bavarde ».** Pour que chaque mot de 6
   lettres et plus d'un distracteur soit dans la page, on écrit avec des mots courts : la bonne
   réponse, technique, devient la plus dense. Mesuré après la vague : « la plus dense » **70,2 %**,
   « la moins bavarde » **43,3 %**, toutes les autres stratégies à couverture 0. C'est le constat de
   `tests` (36,8 %), en bien pire. La parade efficace, trouvée tard : **reprendre les mots longs de
   la bonne réponse dans un distracteur rédigé en style télégraphique** (`lecon-09` q2 : 6,13 → un
   distracteur à 6,67 ; `lecon-10` q2 : 6,44 → 6,46) — un mot partagé n'est exclusif pour personne,
   il est dans la page, et il est long.
2. **Les apostrophes et les nombres comptent comme des mots** (`l'`, `d'`, `qu'`, `401`, `HTTP/1.1` =
   quatre jetons courts) : ils plombent la densité d'un distracteur plus que n'importe quel article.
3. **Écrire le corps avant les distracteurs a fermé le lexique d'un coup** : 20 bonnes réponses
   portaient un mot absent de leur page ; une phrase juste ajoutée au corps a mis `k` à 0 partout, et
   les 0 / 0 / 0 ont tenu jusqu'au bout.
4. **Une bonne réponse « de cours » peut être fausse et le cours ne le voit pas** : la phrase CORS
   était écrite trois fois (corps, bonne réponse, explain), cohérente avec elle-même, fausse dans un
   vrai navigateur.
5. **Le blocage de la densité n'était pas structurel : il venait des questions où la bonne réponse
   est la plus COURTE.** Là, le distracteur doit être à la fois plus long en caractères et plus court
   en mots, donc fait de mots de 7 à 9 lettres. Là où la bonne réponse est au rang 0, 1 ou 2, un
   distracteur plus COURT qu'elle peut être plus dense sans contrainte de longueur : 4 des 7 bascules
   de `ce74c6e` y sont (`lecon-02` q3, `lecon-07` q2, `lecon-08` q2, `lecon-09` q3). Sur les 3 autres
   (rang 3), un jeton de moins et deux à quatre lettres de plus suffisaient : « à chaque origine du
   web et tombe vite » → « à toutes les origines hostiles et tombe », « qui ouvre … prêt à » → « qui
   protège … censé », « qui pointe » → « pointant ». Calculer d'abord
   `lettres ≥ densité × mots` ET `caractères = lettres + mots − 1 + signes` donne la cible exacte ;
   chercher à l'œil ne la donne pas.
6. **Raccourcir le distracteur le plus long d'une question au rang 1 fait coup triple** (`lecon-02`
   q3) : la bonne réponse passe au rang 0, ce qui remonte « la plus longue » (22,8 → 24,6 %, elle
   était SOUS la cible) et redescend « la DEUXIÈME plus longue » (27,2 → 25,4 %), et le distracteur
   raccourci en mots devient à la fois le plus dense et le moins bavard.
7. **Défaire un ex æquo de longueur peut rouvrir le biais inverse ailleurs.** En raccourcissant
   `lecon-14` q3, les deux distracteurs les plus courts ont cessé d'être à égalité : « écarter les deux
   extrêmes » n'y désignait plus la bonne réponse seule, et son inverse est monté à **29,2 %** (8
   questions tranchées, 1 seule sur la bonne). `controle.js` le montre question par question, mais
   seul `mesure-biais-inverse --toutes` en donne le chiffre : il faut le relancer après CHAQUE lot.
   Rattrapé en défaisant un autre ex æquo, sans effet sur la bonne réponse (`lecon-14` q15, 59/59).
8. **Relire en contradicteur l'option qu'on retouche pour le compteur** : la seule que je comptais
   changer d'un mot (`lecon-14` q15, « chaque » → « toute ») était presque VRAIE — « Un test de
   fonction (validation complète de chaque réponse) » attrape bel et bien un champ disparu, et l'explain
   dit « valide la forme complète de la réponse ». Remplacée par une thèse franchement fausse.

## Ce qui reste, sans arrondir

- **REPRISE DU DOSAGE à la demande de l'orchestrateur (commit `7fcbbf1`)**. Dosage calculé avant
  de retoucher : « la plus dense » valait un crédit de 24,00 sur 57 (cible 14,25 ; 15,7 pour 27,5 %),
  il fallait donc **8,3 à 9,8 bascules** ; « la moins bavarde » 22,33 (cible 14,25), **6,7 à 8**.
  Fait : `lecon-04` q3 (un distracteur court reprend « deviendrait » de la bonne réponse ; un second
  distracteur le porte aussi pour qu'il reste à 4 porteurs et que l'intrus lexical ne tranche pas),
  `lecon-12` q3, `lecon-13` q2 (resserrés d'un mot) → **38,6 %** et **34,8 %**. `controle.js
  --ref=HEAD` : seuls ces deux indicateurs et leurs « ECARTER » ont bougé (plus un échange de rang
  entre deux distracteurs de `lecon-12` q3, sans effet sur la bonne réponse). Tout le reste tient :
  la plus longue 22,8 %, inverse 0 alerte, fétiche 0, tics 0, lexique 0, intrus 0 sûr.
- **FIN DU DOSAGE (commit `ce74c6e`) : « la plus dense » 38,6 → 26,3 %, « la moins bavarde » 34,8 →
  25,4 %.** Dosage recalculé avant d'écrire : crédit de densité 22,0 sur 57 (cible 14,25 ; 15,7 pour
  27,5 %), donc **7 bascules** pour 26,3 % ; crédit du nombre de mots 19,83, donc **≈ 5,3** pour
  25,4 %. Sonde ajoutée : `scratchpad/api-sonde/var.js` (essaie plusieurs variantes d'une option, une
  par une, et affiche caractères / mots / densité, les deux crédits et les alertes d'`etat.js`) et
  `ajoute.js` ; patchs dans `scratchpad/api-lots/dosage4.json` et `dosage5.json` (hors git).
  - **Les 7 bascules de densité** (le distracteur nommé devient plus dense que la bonne réponse) :
    `lecon-02` q3 d1 (« POST passe sans corps : … et risque une ressource vide », 17 mots, 4,76 contre
    4,72 ; raccourci SOUS la bonne réponse, qui passe au rang 0 — voulu, voir leçon 6), `lecon-06` q2
    d1 (« … répondre à toutes les origines hostiles et tombe ; … », 4,33 contre 4,20), `lecon-07` q2
    d3 (« … (JSON signé + profil) accepté sans contrôle par le serveur ; … donc on garde le même »,
    4,68 contre 4,67), `lecon-08` q1 d3 (« … le jeton qui protège la réponse ; … (jeton admis), censé
    retransmettre tout le contenu », 4,16 contre 4,13), `lecon-08` q2 d3 (« … répond 503 aux autres
    clients », 4,05 contre 3,96), `lecon-09` q3 d2 (« Ils ouvrent un canal direct vers un cache
    bidirectionnel : le client peut recevoir les messages en mémoire, sans serveur », 5,21 contre
    5,18, « peut » gardé), `lecon-14` q1 d3 (« 302 Found, avec un en-tête Location pointant vers la
    nouvelle ressource », 4,92 contre 4,82 — « pointant » entré d'abord dans le corps).
  - **Nombre de mots** (la bonne réponse cesse d'être la moins bavarde, seule ou à égalité) :
    `lecon-02` q3 et `lecon-07` q2 (mêmes options), `lecon-03` q3 d1 (« pas de donnée ici »), `lecon-06`
    q2 (égalité à 30 mots), `lecon-08` q4 d2 (« … et souvent plus robuste aux abus »), `lecon-09` q1 d1
    (« … met en cache chaque objet et les champs voulus du client, au lieu de recalculer par
    requête »), `lecon-14` q2 d3, q3 d1 (« Une tâche créée (tache.creation) »), q4 d3 (« Des flux
    (TCP) bruts très longs »), q13 d2 (« HTML Fault (application/html+xml, RFC 9110) ») ; `lecon-14`
    q15 dans l'autre sens (+0,5, voir ci-dessous).
  - **Deux rattrapages** : (1) `mesure-biais-inverse --toutes api` a sonné après le premier lot —
    « écarter les deux extrêmes » à 29,2 % en inverse (leçon 7) ; `lecon-14` q15 d3 sort de son ex æquo
    de la plus longue (59/59) : 7 questions tranchées, non mesurable, **0 alerte**. (2) Ce même
    distracteur, relu en contradicteur, était presque vrai (leçon 8) → « Un test de sécurité
    (validation du jeton Bearer requis partout) ». Il compte 10 mots, la bonne réponse redevient la
    moins bavarde seule (+0,5), compensé par `lecon-14` q2 d3 (« Pour que l'API n'ait qu'un format à
    produire en validation comme en panne, des pages HTML », 19 mots).
  - `controle.js --ref=c5c337e` : seuls bougent la densité, le nombre de mots, leurs deux « ECARTER »,
    `w` (le `k` reste à 0 partout) et la famille des rangs (échanges entre distracteurs, plus le rang
    voulu de `lecon-02` q3). Tout le reste tient : lexique 0 / 0 / 0, fétiche 0 alerte (`chaque`
    ECARTER 27,9 → 27,6 % : deux « chaque » de distracteur retirés), tics 0, intrus 0 sûr, inverse 0.
- **Ce qui reste, après `ce74c6e`** : plus aucun indice au-dessus de 27,5 %. Le pire est à **26,3 %**,
  à égalité entre « la plus dense » et « la QUATRIÈME plus longue » ; « la plus longue » 24,6 %,
  « la DEUXIÈME » 25,4 %. Questions où la bonne réponse reste la plus dense (17 sur 57, dont 3 à égalité,
  `lecon-14` q8, q10, q11) : on pourrait encore en basculer une (24,6 %), mais ce serait viser sous 25 %
  pour un indice déjà dans la cible ; non fait. Laissées, avec leur raison chiffrée :
  - `lecon-02` q2 : la bonne réponse vaut 5,41 lettres par mot sur 17 mots ; un distracteur plus
    long (≥ 113 caractères) en moins de 17 mots exige des mots de 9 lettres (`collection`) qui
    deviennent EXCLUSIFS (mot technique exclusif rouvert) ou des mots absents de la page (`listes`,
    `existant` : k = 2, lexique rouvert) ; la meilleure variante simulée rendait 5,75 mais k = 2 et
    l'intrus « ressource » à 3 porteurs ;
  - `lecon-05` q1 (rang 1, 4,40) : le distracteur doit rester sous 114 caractères avec au moins 4,45
    lettres par mot ; « dans un autre sens » n'a pas d'équivalent court de la page (`inversée`,
    `désordonnée`, `renversée` absents ; `décroissant` et `croissant` ont 9 lettres et deviendraient
    exclusifs ; « à l'inverse » ajoute deux jetons d'une lettre) ;
  - `lecon-13` q2 (rang 0) : le préfixe commun « Parce que les refus (401, 403, 404, 422) » vaut 3,5
    lettres par mot ; il faudrait une suite de 9 mots à 5,1 lettres de moyenne, sans mot de 9 lettres
    ni mot absent de la page — aucune phrase naturelle trouvée ;
  - `lecon-13` q3, `lecon-07` q4, `lecon-10` q1, `lecon-09` q4 (bonne réponse la plus courte et
    dense) : il faut 5 à 17 lettres de plus à nombre de mots égal ; possible seulement avec des mots de
    7 à 9 lettres que la page n'a pas (`fourni`, `superflu`, `indiquant`, `permanente`…) ; on pourrait
    les faire entrer dans le corps comme « pointant », non fait faute de besoin ;
  - `lecon-08` q4 (5,71), `lecon-06` q1 (plan croisé Authorization/Accept × 401/403), `lecon-14` q9
    (« Unauthorized », 12 lettres), q3 et q12 (formes de cinq mots, « terminée », « spécification »),
    q13 (« Request Details » égale la bonne réponse au centième et à la longueur ; « Problem
    Responses » porterait un mot de 9 lettres exclusif ; « messages » absent de la page), q7 (une
    forme d'un mot, `DELETE` : « OPTIONS » rouvrirait le rang) ; `lecon-14` q8, q10, q11 : égalités
    de formes d'un mot ou de quatre mots, déjà au hasard ou à demi.
- `lecon-14` q9 : « le mot technique exclusif » tranche (`Unauthorized` / `Forbidden`, 50 %) ;
  q5, q7 : l'intrus EXCÈS désigne `DELETE` / `{DELETE, PATCH}` (formes d'un mot) — laissés.
- Non vérifiés (voir plus haut) : GitHub et la pagination par curseur, Stripe 24 h, « toute clé »
  révoquée, le `Referer` qui porterait encore la query string (les navigateurs récents la retirent par
  défaut en cross-origin) ; supertest / Ajv / Newman non exécutés.
- Incident sans conséquence sur les fichiers : un `chrome.exe --version` lancé pour connaître la
  version a ouvert une fenêtre dans la session Chrome existante de la machine (sous Windows,
  `--version` n'affiche rien) ; aucun fichier touché.
