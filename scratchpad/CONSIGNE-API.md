# Consigne d'écriture — les QCM du cours `api` (B4, passe parallèle du 2026-11-10)

Préparée à l'ouverture du cours, dans la copie de travail `D:\test-claude-b4\api` (branche
`b4/api`). Un seul rédacteur fait tous les rôles (écriture, dosage, relecture, contre-relecture).
Mesures de départ archivées dans `scratchpad/api-depart/` (hors git) ; sondes dans
`scratchpad/api-sonde/` (copiées de `tests-sonde`, pointées sur `pages/api/`, plus `etat.js`,
`aplat.js`, `texte.js`, `cibles.json`) et `scratchpad/api-corr/` ; preuves exécutées dans
`scratchpad/api-preuves/`.

Le cours : « API REST », 14 leçons, **57 questions** (dont 12 de bilan dans `lecon-14`) — HTTP,
verbes et CRUD, codes de statut, en-têtes, conception d'URL, pagination, versionnement,
authentification (clé, JWT, OAuth 2.0, refresh token), CORS, cache (ETag/304), rate limiting,
idempotence, GraphQL / gRPC / WebSockets, OpenAPI, Problem Details (RFC 9457), webhooks (HMAC),
tests d'API, projet fil rouge.

## 1. Mesures de départ (2026-11-10, sur la branche, avant toute écriture)

| indice | réussite | couverture | rendement |
|---|---:|---:|---:|
| **la plus longue** | **89,9 %** | 93,0 % | 94,3 % |
| la plus détaillée | 70,0 % | 57,9 % | **100,0 %** |
| RESTREINDRE à la parenthèse | 61,4 % | 49,1 % | **100,0 %** |
| la seule avec une PONCTUATION FORTE (et RESTREINDRE) | 60,5 % / 60,7 % | 47,4 % | **100,0 %** |
| l'incise entre parenthèses | 60,1 % | 47,4 % | **100,0 %** |
| le mot technique exclusif | 58,3 % | 61,4 % | 80,0 % |
| la seule avec un point-virgule | 46,1 % | 28,1 % | **100,0 %** |
| l'écho de la question | 42,8 % | 21,1 % | **100,0 %** |
| RESTREINDRE aux deux-points | 40,9 % | 21,1 % | **100,0 %** |
| ECARTER la moins bavarde | 36,4 % | 5,3 % | 66,7 % |
| ECARTER la plus courte | 34,4 % | 1,8 % | 100,0 % |
| la seule avec une barre oblique | 33,8 % | 14,0 % | 87,5 % |

**44 questions sur 57 (77,2 %)** trahies par 5 indices ou plus. Rangs **53 / 2 / 2 / 0**, cible
**15 / 14 / 14 / 14** ; `plan-rangs-qcm` demande **9 431 caractères** sur 54 questions. Bonne
réponse moyenne ≈ 3,4 fois un distracteur. Tics de lot : **9** (point-virgule médian **17 / 3**,
glose finale **13 / 2**, deux-points médian **14 / 5**, quatre segments à virgules **6 / 0**,
guillemets **5 / 0**…). Mots fétiches : **5 alertes** (`requête` 8 / 3, `ressource` 8 / 4,
`client` 7 / 6, `serveur` 7 / 10 — des mots de BONNE réponse ; `parce` 3 / **21** — un mot de
DISTRACTEUR). Biais inverse : **4 alertes** (rangs 2, 3, 4 et « la moins bavarde » à 0,0 % en
directe). Lexique : **46 exploitables, 33 retournées, 49 à mettre en forme** ; **29 bonnes réponses
portent au moins un mot de 6+ lettres absent de leur page** (k > 0 : la règle du `w` s'applique).

## 2. Ce qui a été prouvé AVANT d'écrire (et ce qui en a découlé)

Exécuté sous Node 24.16 (serveurs `http` sur 127.0.0.1, port `listen(0)`, refermés), curl 8.19 de
Git Bash, Chrome 157 headless (résolution DNS coupée hors 127.0.0.1). Aucun accès à Internet.

| affirmation | ce que l'exécution rend | fichier |
|---|---|---|
| CORS : « avec `*`, n'importe quel site pourrait appeler l'API depuis le navigateur d'un utilisateur connecté » (**bonne réponse** de `lecon-06` q2, son explain, le corps) | **FAUX.** La requête part de toute façon, cookie compris, même SANS aucun en-tête CORS. Avec `*` (et même `*` + `Allow-Credentials: true`), le navigateur REFUSE la réponse d'une requête avec cookies (`TypeError: Failed to fetch`). Sans cookies, `*` ne livre que la réponse anonyme. Le vrai danger : l'origine RENVOYÉE EN ÉCHO + `Allow-Credentials: true` (la page tierce lit `{"utilisateur":"lou","solde":1234}`) | `cors.js`, `cors.out` |
| `curl -d` sans `-H` envoie `application/x-www-form-urlencoded` (`lecon-03`) | vrai ; et les deux `curl -X PUT … -d '{"faite": true}'` de `lecon-14` partent donc en formulaire | `http.js`, `http.out` |
| `curl -I` fait un `HEAD` | vrai | idem |
| des filtres « dans le corps de la requête GET » | `fetch` REFUSE (« Request with GET/HEAD method cannot have body ») ; curl l'envoie | idem |
| `204` / `304` « vides » | Node retire le corps même si le code en écrit un | idem |
| ETag + `If-None-Match` → `304` | 1ʳᵉ requête 200 (27 octets), 2ᵉ 304 (0 octet) | idem |
| `http.STATUS_CODES[422]` | « Unprocessable Entity » (l'ancien nom ; RFC 9110 dit « Unprocessable Content ») | idem |
| JWT lisible sans le secret ; falsifier la charge casse la signature ; Base64**url** | vrai, vrai, vrai | `jetons.js`, `jetons.out` |
| la vérification HMAC de `lecon-12` | juste / corps modifié / mauvais secret / en-tête absent / JSON re-sérialisé : true / false / false / false / false ; sans le test de longueur, `timingSafeEqual` lève `RangeError` | idem |
| limit/offset « glisse » ; le curseur non | insertion en tête → doublon (21) ; suppression → élément jamais vu (20) ; curseur : aucun doublon | idem |

**Deuxième bonne réponse corrigée, par la norme** : `lecon-11` q1 disait « 400 est réservé à une
requête que le serveur n'arrive même pas à lire ». RFC 9110 §15.5.1 : « The 400 (Bad Request)
status code indicates that the server cannot or will not process the request due to something
that is perceived to be a client error » — le refus GÉNÉRIQUE, pas un code réservé. Corrigée en
« 400, plus général, sert d'abord à… » ; le cours lui-même (`lecon-03`) dit « 400 ou 422 ».

## 3. ⚠️ LE PIÈGE PROPRE À CE COURS : LA NORME CONTRE L'USAGE

Une affirmation HTTP peut être fausse selon la RFC et vraie en pratique, ou l'inverse. Un
distracteur doit être faux **des deux côtés** — sinon il est discutable. Exemples à NE PAS écrire :
- « `PUT` peut créer une ressource » (vrai : RFC 9110 §9.3.4, 201 Created) ;
- « `PATCH` n'est pas idempotent » (vrai par défaut, RFC 5789) ; « `PATCH` est idempotent » (faux
  en général mais vrai souvent : le cours écrit « souvent idempotent ») ;
- « gRPC sert au temps réel bidirectionnel » (vrai : flux bidirectionnels) — c'était un ancien
  distracteur de `lecon-09` q2 ;
- « un JWT chiffré » (vrai pour un JWE) ; « 400 pour toute donnée refusée » (conforme à la RFC) ;
- « le serveur ne garde aucune donnée » (faux, mais la leçon 01 le dit elle-même en encadré :
  à n'employer que contre le texte de la page).

Erreurs nettes, prouvées ou normées, utilisables : confondre 401 et 403 ; 4xx et 5xx ; ressource
et représentation ; `Content-Type` et `Accept` ; authentification et autorisation ; signé et
chiffré ; access token et refresh token ; `Cache-Control` et `ETag` ; idempotent et sûr ; limit/offset
et curseur ; GraphQL / gRPC / WebSocket / SSE ; contract-first et code-first ; 400 / 409 / 415 / 422 /
500 ; webhook et polling ; test d'intégration / de contrat / de charge ; croire qu'un `200` avec
`{"success": false}` est une erreur aux yeux d'un cache ; croire que CORS empêche la requête de
PARTIR (il empêche le JavaScript de LIRE la réponse).

## 4. Ce que chaque question doit tenir (vérifié par `node scratchpad/api-sonde/etat.js`)

1. **Rang** de la bonne réponse = `cibles.json` (15 / 14 / 14 / 14), sans ex æquo avec elle,
   distracteurs dans 70-130 % de sa longueur ; le **rang en mots** suit le rang en caractères.
2. **Marques : les quatre options la portent, ou aucune** — `;`, `:`, parenthèse, tiret
   (`—`, `–`, ` - `, « c'est-à-dire »), barre oblique (⚠️ une URL `/articles`, `4xx/5xx`,
   `HTTP/2`, `application/problem+json` en portent une), guillemets « », flèche, point interne
   (un point suivi d'une espace et d'une majuscule), virgule décimale, point final.
   **Même nombre de `, : ;`** dans les quatre (la plus détaillée) et **même nombre d'incises**.
3. **Absolus, négations, prudents** (`toujours`, `jamais`, `seulement`, `rien`, `aucun` ; `ne`, `pas`,
   `non`, `n'` ; `peut`, `permet`, `souvent`, `selon`, `notamment`) : quatre porteurs ou aucun.
4. **Écho** : même nombre de mots de l'énoncé (4+ lettres) dans les quatre. **Attaque** : jamais un
   seul mot d'attaque isolé (`Une` et `Un` sont deux attaques ; `Parce que` et `Parce qu'` aussi).
5. **MAJUSCULE d'emphase** : même nombre partout. Ne sont PAS dans la liste des sigles de l'outil :
   `SSE`, `PKCE`, `JWS`, `JWE`, `E2E`, `MD5`, `SHA256`, `SOAP`, `REMOVE`, `ACL`, `PCI`.
6. **Mots de 9+ lettres** : chaque option en porte le même nombre d'exclusifs ; le plus simple est de
   reprendre ceux de la bonne réponse dans les distracteurs.
7. **Lexique** : `k` (mots de 6+ lettres absents du corps de la page, en occurrences) égal dans les
   quatre ; si `k > 0`, `w` (mots de 6+ lettres) égal aussi. Un mot de moins de 6 lettres est libre.
   L'apostrophe colle (`l'offset`, `n'arrive` sont UN jeton).
8. **Intrus lexical** (mots de 5+ lettres) : chaque option a au moins un mot propre ; aucun mot porté
   par exactement trois options.
9. **Tics de forme** (copie exacte de `mesure-tics-lot`) : 0, 2 ou 4 porteurs — dont « est / sont /
   reste / garde / devient » où qu'ils soient, « cette / ces / cet », « car / puisque / parce que »,
   « alors / ensuite / puis », « ne … que », « (un/une/le… », « , et », « ex. ».
10. **Mots fétiches** au niveau du cours : poser `requête`, `ressource`, `client`, `serveur` dans des
    distracteurs ; retirer `parce` des distracteurs (sauf là où la bonne réponse commence ainsi).

Et par-dessus tout : **un distracteur est une phrase française qui énonce une thèse fausse,
précise et plausible** ; on doit pouvoir dire en une phrase pourquoi elle est fausse. Aucune
queue de phrase de remplissage, aucun référent orphelin.

## 5. Ordre de travail

Lot par lot (01-03, 04-06, 07-09, 10-13, 14), patchs au format de `pose.js`
(`scratchpad/api-lots/<lot>.json`), simulés par `etat.js <patchs> --f=…`, posés par `pose.js
--ecrire`, commit après chaque lot. Puis mesure du cours entier (`mesure-biais-qcm --seul=api`,
`mesure-biais-inverse --toutes api`, `mesure-lexique-qcm --liste=api`, `mesure-mot-fetiche api`,
`mesure-tics-lot api`, `mesure-mot-question api`, `mesure-point-interne`), dosage calculé, relecture
par contradiction (QCM ET corps), contre-relecture des corrections, mesure finale.
