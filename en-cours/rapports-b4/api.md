# LE NNᵉ COURS — `api` (« API REST »), 89,9 % → 22,8 %

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

| indice (commande) | départ (`a6a45f2`) | arrivée |
|---|---:|---:|
| « la plus longue » (`mesure-biais-qcm --seul=api`) | **89,9 %** (couv. 93,0 %, rend. 94,3 %) | **22,8 %** (rend. 24,5 %) |
| rangs de la bonne réponse (`plan-rangs-qcm api`) | 53 / 2 / 2 / 0 | **15 / 15 / 13 / 14** |
| questions trahies par 5 indices ou plus | 44 sur 57 (77,2 %) | **0** (39 à 0–2, 18 à 3–4) |
| la plus détaillée / ponctuation forte / incise / point-virgule / écho / guillemets / absolus / négation / prudente / majuscule / point interne / barre oblique / attaque | 70,0 / 60,5 / 60,1 / 46,1 / 42,8 / 31,6 / 27,9 / 32,2 / 29,4 / 29,8 / 27,6 / 33,8 / 28,9 % | **25,0 % chacune, couverture 0,0 %** |
| le mot technique exclusif | 58,3 % | **25,4 %** (1 question, `lecon-14` q9) |
| la DEUXIÈME / TROISIÈME / QUATRIÈME plus longue | 4,8 / 3,1 / 2,2 % | 27,2 / 23,7 / 26,3 % |
| **la plus dense (mots longs)** | 31,1 % | **42,1 %** ⚠️ (70,2 % après la vague, voir plus bas) |
| **la moins bavarde (peu de mots)** | 4,5 % | **39,2 %** ⚠️ (43,3 % après la vague) |
| biais inverse (`mesure-biais-inverse --toutes api`) | 4 alertes | **0 alerte** (pire : écarter les deux extrêmes, 25,9 %) |
| lexique (`mesure-lexique-qcm --liste=api`) | 46 exploitables, 33 retournées, 49 à mettre en forme | **0 / 0 / 0** |
| mots fétiches (`mesure-mot-fetiche api`) | 5 alertes (`requête`, `ressource`, `client`, `parce`, `serveur`) | **0** |
| tics de lot (`mesure-tics-lot api`) | 9 (point-virgule médian 17/3, glose finale 13/2, deux-points 14/5…) | **0** |
| intrus lexical (`mesure-mot-question api`) | — | DÉFAUT 25,0 / 25,0 %, EXCÈS 24,6 / 24,9 %, 0 question sûre |

Sorties brutes : `scratchpad/api-depart/` (départ) et `scratchpad/api-final/` (arrivée), hors git.

**Écriture** : 159 distracteurs réécrits sur 171, 12 gardés (bilan : `GET/POST/PUT/DELETE`,
`404/200/500/301`, et un distracteur de q6, q7, q10 ; `lecon-13` q1 « Les tests unitaires »).
**11 486 caractères écrits** (4 865 → 16 351 pour les distracteurs). Cinq lots commités
(`d058849`, `4cd66b0`, `4e5746e`, `adec41f`, `0aa32ee`), un dosage (`fdb7c7d`).

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
moins de 6 lettres) : lexique 0 / 0 / 0.

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

## Ce qui reste, sans arrondir

- **« la plus dense » 42,1 % et « la moins bavarde » 39,2 %** : nettement au-dessus de 25 %. Il
  faudrait environ **13 bascules de densité de plus** (crédit 24,0 → ~14,3) et ~10 de nombre de mots
  (21,8 → ~14,3). Questions où la bonne réponse est encore la plus dense, avec ce qu'il manque au
  distracteur le plus proche (`node scratchpad/api-sonde/besoin.js`) : `lecon-02` q2 (+26 lettres),
  q3 (+3), `lecon-03` q1 (+8), `lecon-04` q3 (+14), `lecon-05` q1 (+8), `lecon-06` q1 (+4, plan croisé),
  q2 (+4), `lecon-07` q2 (+10), q4 (+7), `lecon-08` q1 (+6), q2 (+4), q4 (+17), `lecon-09` q3 (+8),
  q4 (+17), `lecon-10` q1 (+5), `lecon-12` q3 (+7), `lecon-13` q2 (+10), q3 (+5), `lecon-14` q1 (+3),
  q3, q9, q12, q13 (formes courtes du bilan). Méthode : la leçon 1 ci-dessus.
- `lecon-14` q9 : « le mot technique exclusif » tranche (`Unauthorized` / `Forbidden`, 50 %) ;
  q5, q7 : l'intrus EXCÈS désigne `DELETE` / `{DELETE, PATCH}` (formes d'un mot) — laissés.
- Non vérifiés (voir plus haut) : GitHub et la pagination par curseur, Stripe 24 h, « toute clé »
  révoquée, le `Referer` qui porterait encore la query string (les navigateurs récents la retirent par
  défaut en cross-origin) ; supertest / Ajv / Newman non exécutés.
- Incident sans conséquence sur les fichiers : un `chrome.exe --version` lancé pour connaître la
  version a ouvert une fenêtre dans la session Chrome existante de la machine (sous Windows,
  `--version` n'affiche rien) ; aucun fichier touché.
