# Rapport V18 — case B9, lot 6 : les cours `vue` et `api` (copie `b9-vue-api`, branche `v18/b9-vue-api`)

Copie de travail `D:\test-claude-b9-vue-api`, partie de `c5b3e9d`. Part traitée : les **28 « Cas réel »**
des cours `vue` (14, un par leçon) et `api` (14, un par leçon). Pièces dans `scratchpad/b9-vue-api/`
(ignoré par git) : `cas/<cours>-NN.html` (les 28 corps d'encadrés), `appliquer.js` (remplace du titre de
l'encadré au `</div></div>` final, refuse une page à plusieurs « Cas réel », prouve que les octets hors de
l'encadré sont identiques, refuse tout CR et toute balise `div` dans le corps, exige la source en dernier),
`dump.js`, `texte.js` (texte et QCM d'une leçon), `tous.js` (tous les « Cas réel » du site, pour chercher
les sujets déjà pris), `extr.py` (texte d'une page téléchargée), les pages et RFC ouvertes, et `js/`
(Vue 3.3.13, 3.4.0, 3.5.45, Vue Test Utils 2.6.0 et jsdom, installés depuis npm dans le scratchpad, avec
les deux essais `computed.js` et `emits2.js`).

**En une phrase** : `node tools/verif-contenu.js --cas-reel` passe de **14 hors de la règle à 0** pour
`vue` et de **14 à 0** pour `api` ; sur les 28 cas trouvés, **aucun n'était VRAI tel quel et sourcé** :
1 INVENTÉ (`vue/lecon-09`, « Imagine un tableau de bord… »), au moins 4 INEXACTS sur un produit nommé,
2 sujets réels déjà racontés ou gardés par un autre cours, le reste INVÉRIFIABLE (récits anonymes, usages
généraux, affirmations non datées) ; **26 remplacés** par un cas réel daté et sourcé sur la même notion,
**2 corrigés sur leur sujet** (VueUse, Stripe et `Idempotency-Key`), **0 gardé tel quel**, **0 renommé
« Scénario »**.

**Commits** (branche `v18/b9-vue-api`) : `a814c09` (vue, 14 cas), `0ad1030` (api, 14 cas), puis le commit
de ce rapport.

## Méthode

- Seul l'intérieur de l'encadré change, du `<p class="callout__title">` au `</div></div>` (type `note`,
  icône, structure gardés). Aucun intertitre `<h2>`/`<h3>` « Cas réel » n'est collé au-dessus de ces 28
  encadrés (les intertitres qui les précèdent sont ceux des sections de la leçon) : rien à renommer.
- Forme : titre `Cas réel — sujet (année)`, dernier paragraphe `<p class="cas-reel__source">` daté et lié ;
  aucun lien dans le corps ; `&nbsp;` devant « : ; ? ! » et dans « » ; 120 à 187 mots par corps. Trois
  encadrés gardent un bloc de code : `vue/lecon-04` garde l'exemple `BoutonUI` d'origine, `vue/lecon-03`
  et `vue/lecon-05` prennent l'exemple de leur source (`isEven` du billet de Vue 3.4, `onWatcherCleanup`
  du billet de Vue 3.5, commentaires traduits).
- **Un sujet = un seul cours** : chaque sujet et chaque URL cherchés dans `foyers.md`, dans tout `pages/`
  (corps compris) et dans les 1 551 « Cas réel » du site, puis inscrits au fichier commun
  `b9-reservations.txt` (28 lignes ; l'orthographe « Marc-Andre » de ma ligne `api/lecon-10` corrigée sur
  place, sans toucher aux autres lignes, vérifié ensuite). Écartés parce qu'un autre cours les raconte déjà :
  l'API GraphQL de GitHub en 2016 (`graphql/lecon-06`), le limiteur de débit de GitHub (`lua/lecon-11`), le
  *secret scanning* de GitHub (`git/lecon-14`), le passage de Vue 3 au `Proxy` (`js/lecon-38`), la RFC 9457
  (`csharp/lecon-17`), le « 200 OK » de S3 (`php/lecon-12`), le Google Web Accelerator (`html/lecon-08`),
  l'étude de Wroblewski sur la validation en ligne (`html/lecon-43`), `import()` dynamique (`js/lecon-61`),
  la faille JWT `alg: none` (`securite/lecon-10`), les composants « conteneurs » de Dan Abramov
  (`react/lecon-14`), le SDK Facebook de 2020 (`ruby/lecon-19`), le versionnage par date de Stripe (raconté,
  sans source, par `formats/lecon-11`). `doublons.js` : toujours **2** sources partagées entre cours (les
  deux légitimes, hors de ma part).
- **Doublon interne corrigé** : `api/lecon-02` et `api/lecon-08` racontaient tous deux la clé
  d'idempotence de Stripe ; elle reste à `api/lecon-08` (leçon « Performance & fiabilité », section
  « L'idempotence »), et `api/lecon-02` passe à la RFC 5789 (PATCH, ni sûr ni idempotent). De même,
  `api/lecon-03` et `api/lecon-11` racontaient le même « 200 qui masque les erreurs » : ils deviennent la
  RFC 7725 (un code précis, le 451) et les Microsoft REST API Guidelines (un format d'erreur unique).
- **Comportements rejoués** :
  - `vue/lecon-03` — l'exemple du billet de Vue 3.4 (`count`, `isEven`, `watchEffect`), compteur passé
    à 2 puis à 4 : Vue 3.3.13 appelle l'effet **3 fois** (`[true,true,true]`), Vue 3.4.0 et 3.5.45 **une
    fois** (`[true]`).
  - `vue/lecon-13` — un bouton qui réémet `click` par `$emit` : sans `emits`, l'écouteur du parent est
    appelé **2 fois** pour un clic et `wrapper.emitted('click')` en compte 2 (Vue 3.5.45, Vue Test Utils
    2.6.0, jsdom) ; avec `emits: ['click']`, 1 et 1. Avertissement de Vue en développement : « Component
    emitted event "click" but it is neither declared in the emits option nor as an "onClick" prop ».
  - `api/lecon-01` — `GET https://api.weather.gov/points/39.7456,-97.0892` renvoie `application/geo+json`
    et l'adresse `…/gridpoints/TOP/32,81/forecast` ; ce second appel renvoie 14 périodes (sept jours de
    deux demi-journées) avec leurs températures ; **403** sans en-tête `User-Agent`.
  - `api/lecon-11` (vérification, non citée) : l'API Slack répond bien `HTTP 200` avec `{"ok":false}`,
    mais sa documentation ne le dit pas ; sujet écarté pour cette raison.
- **Dates prises dans l'historique** et non dans une description du jour : premiers commits de VueUse
  (`3c0a29c`, 14/12/2019, Anthony Fu) et de Pinia (`ca52775`, 18/11/2019, Eduardo San Martin Morote) par la
  dernière page de l'API des commits ; ouverture et fusion des RFC n° 112 et n° 187 sur leurs pages ;
  première version publiée des Microsoft REST API Guidelines (`9266b7c`, 19/07/2016, « [Guidelines]
  Publish file ») ; premier import de Standard Webhooks (`d80cbcb`, 27/08/2023) ; dates de publication de
  Vue 2.2.0, Vue 3.0.0, Vuetify 3.0.0 et OpenAPI 3.1.0-rc0 par l'API des versions de GitHub.
- **Le présent vérifié** : Vue 2 est en fin de vie depuis le 31 décembre 2023 (billet « Vue 2 is
  Approaching End Of Life », 15/12/2023) : ses notes et son guide sont racontés au passé (« le guide de
  Vue 2 l'écrivait ») ou doublés du guide de Vue 3 qui dit la même chose (`vue/lecon-02`) ; les Microsoft
  REST API Guidelines de 2016 sont dites obsolètes (avis en tête du document) ; VueUse ne prend plus en
  charge Vue 2 depuis sa v12 (non raconté) ; les RFC 5789, 6749 et 7725 ne sont pas rendues obsolètes
  (pages d'information de rfc-editor.org).
- **Cliquet lexical** : le premier jet faisait sortir 15 mots d'options et en faisait entrer 3
  (`lexique-diff.js` : 17 écarts). Chaque mot remis dans une phrase exacte de l'encadré, ou retiré :
  « accepté », « compte » (`api/07`, l'accès accepté par l'utilisateur, le mot de passe de son compte),
  « réponse », « machine » (`api/10`), « monitoring » (`api/11`, phrase de liaison sur un format unique),
  « restent » (`api/13`, les doublures restent fidèles), « saisie » (`vue/03`, `defineModel` et `v-model`,
  stabilisés dans la même version), « depuis » (`vue/04`), « serveur » (`vue/05`), « l'écran », « visible »
  (`vue/10`), « toutes » (`vue/11`, les formulaires qui se vident à l'envoi), « enveloppant » (`vue/12`),
  « chemin » (`vue/14`) ; « chacun », « dépasse », « complet » retirés : **0 écart**.

## Cas par cas — `vue`

| Cas | Trouvé | Action | Nouveau titre | Sources ouvertes |
|---|---|---|---|---|
| `pages/vue/lecon-01.html#1` | INVÉRIFIABLE, produit nommé : Evan You « alors chez Google », Nintendo, BMW, Louis Vuitton, GitLab « l'une des plus grandes applications » — aucune source citée, rien de vérifié de première main (le sujet GitLab est repris, sourcé) | remplacé par : GitLab choisit Vue (une trentaine de lignes jQuery contre une ligne) | Cas réel — GitLab choisit Vue (2016) | https://about.gitlab.com/blog/why-we-chose-vue/ |
| `pages/vue/lecon-02.html#1` | INVÉRIFIABLE, anonyme (la case cochée qui saute) | remplacé par : Vue 2.2.0 exige une `key` avec `v-for` sur un composant ; mise à jour « sur place » du guide | Cas réel — Vue 2.2 exige une key sur les composants (2017) | https://github.com/vuejs/vue/releases/tag/v2.2.0 ; https://v2.vuejs.org/v2/guide/list.html ; https://vuejs.org/guide/essentials/list.html#maintaining-state-with-key |
| `pages/vue/lecon-03.html#1` | INVÉRIFIABLE, général (barre de recherche) | remplacé par : Vue 3.4, un `computed` ne relance ses effets que si sa valeur change (rejoué) ; `defineModel` stable | Cas réel — Vue 3.4 rend computed plus économe (2023) | https://blog.vuejs.org/posts/vue-3-4 |
| `pages/vue/lecon-04.html#1` | INVÉRIFIABLE, général (« le principe des bibliothèques comme Vuetify ») | remplacé par : Vuetify 3.0, `size` et `variant` remplacent des props booléennes, `text` change de rôle | Cas réel — Vuetify 3 regroupe ses props (2022) | https://github.com/vuetifyjs/vuetify/blob/v3.0.0/packages/docs/src/pages/en/getting-started/upgrade-guide.md ; https://github.com/vuetifyjs/vuetify/releases/tag/v3.0.0 |
| `pages/vue/lecon-05.html#1` | INVÉRIFIABLE : le mécanisme interne de Google Docs et de Notion n'est documenté nulle part (et ils ne sont pas écrits en Vue) | remplacé par : Vue 3.5, `onWatcherCleanup()` annule la requête périmée d'un `watch` | Cas réel — Vue 3.5 et le nettoyage des watchers (2024) | https://blog.vuejs.org/posts/vue-3-5 ; https://vuejs.org/guide/essentials/watchers.html#side-effect-cleanup |
| `pages/vue/lecon-06.html#1` | INVÉRIFIABLE, général (le store `useAuth`) | remplacé par : Vue 3 devient la version par défaut (Vite, `<script setup>`, Volar, Pinia) | Cas réel — Vue 3 devient la version par défaut (2022) | https://blog.vuejs.org/posts/vue-3-as-the-new-default |
| `pages/vue/lecon-07.html#1` | INEXACT, produit nommé : `useDebouncedRef` n'existe pas dans VueUse (c'est `refDebounced`, alias `useDebounce` et `debouncedRef`) ; « d'innombrables applications » invérifiable ; « plus de 200 » vrai (badge : 280) | corrigé : même sujet, daté par le premier commit, fonctions vérifiées une à une, renvoi de la doc de Vue | Cas réel — VueUse, une collection de composables (2019) | https://github.com/vueuse/vueuse/commit/3c0a29c74f2c59dfab627530c384dfec9eefa68a ; https://vueuse.org/guide/ ; https://vueuse.org/core/useMouse/ ; https://vueuse.org/shared/refDebounced/ ; https://vuejs.org/guide/reusability/composables.html |
| `pages/vue/lecon-08.html#1` | INVÉRIFIABLE, général (B2 : idem) | remplacé par : la RFC n° 112, `<Teleport>` (z-index, contexte d'empilement, `<portal>` renommé) | Cas réel — Teleport entre dans Vue 3 (2020) | https://github.com/vuejs/rfcs/pull/112 ; https://github.com/vuejs/rfcs/blob/master/active-rfcs/0025-teleport.md |
| `pages/vue/lecon-09.html#1` | INVENTÉ : « Imagine un tableau de bord… », éditeur de 300 Ko | remplacé par : le plan front-end de GitLab, webpack et le code chargé à la demande (`modal.js`) | Cas réel — GitLab découpe son JavaScript (2017) | https://about.gitlab.com/blog/vue-big-plan/ |
| `pages/vue/lecon-10.html#1` | INVÉRIFIABLE, anonyme (le tableau de bord protégé) | remplacé par : la RFC n° 187 de Vue Router, les gardes renvoient une valeur (`meta.requiresAuth`, `redirectTo`) | Cas réel — Vue Router laisse les gardes renvoyer une valeur (2020) | https://github.com/vuejs/rfcs/pull/187 ; https://github.com/vuejs/rfcs/blob/master/active-rfcs/0037-router-return-guards.md |
| `pages/vue/lecon-11.html#1` | INVÉRIFIABLE, anonyme ; « le taux d'inscriptions abandonnées a nettement baissé » sans source | remplacé par : Baymard Institute, la validation prématurée frustre | Cas réel — Baymard et la validation trop pressée (2024) | https://baymard.com/blog/inline-form-validation |
| `pages/vue/lecon-12.html#1` | INVÉRIFIABLE, anonyme (la liste qui « sautait ») | remplacé par : Paul Lewis et FLIP, sur quoi s'appuie la classe `v-move` | Cas réel — Paul Lewis et la technique FLIP (2015) | https://aerotwist.com/blog/flip-your-animations/ ; https://v2.vuejs.org/v2/guide/transitions.html ; https://vuejs.org/guide/built-ins/transition-group.html |
| `pages/vue/lecon-13.html#1` | INVÉRIFIABLE, anonyme (`<BoutonPaiement>` et le double paiement) | remplacé par : le clic compté deux fois sans `emits` (guide de migration de Vue 3), rejoué avec Vue Test Utils | Cas réel — le clic compté deux fois de Vue 3 (2020) | https://v3-migration.vuejs.org/breaking-changes/emits-option.html ; https://blog.vuejs.org/posts/vue-3-one-piece |
| `pages/vue/lecon-14.html#1` | INVÉRIFIABLE, général (« d'innombrables projets Vue ») | remplacé par : Pinia, de l'expérience de 2019 à la recommandation officielle | Cas réel — Pinia, de l'expérience au store officiel (2019) | https://pinia.vuejs.org/introduction.html ; https://github.com/vuejs/pinia/commit/ca52775897684ce7c0324938eb079be8f2419791 ; https://vuex.vuejs.org/ |

Aussi ouverts pour vérifier : https://blog.vuejs.org/posts/vue-2-eol (fin de vie de Vue 2),
https://api.github.com/repos/vuejs/core/releases/tags/v3.0.0 et `…/vuejs/vue/releases/tags/v2.2.0` (dates).

## Cas par cas — `api`

| Cas | Trouvé | Action | Nouveau titre | Sources ouvertes |
|---|---|---|---|---|
| `pages/api/lecon-01.html#1` | INVÉRIFIABLE, général (B2 : idem ; l'appli météo, « GitHub, Google Maps, ta banque ») | remplacé par : l'API web du National Weather Service, appels rejoués | Cas réel — l'API météo du National Weather Service (doc. 2026) | https://www.weather.gov/documentation/services-web-api ; https://api.weather.gov/points/39.7456,-97.0892 |
| `pages/api/lecon-02.html#1` | INVÉRIFIABLE, anonyme (« sur un site marchand… ») ; doublon interne de `api/lecon-08` (Stripe) | remplacé par : la RFC 5789, PATCH ni sûr ni idempotent, requête conditionnelle | Cas réel — PATCH entre dans HTTP (RFC 5789, 2010) | https://www.rfc-editor.org/rfc/rfc5789 |
| `pages/api/lecon-03.html#1` | INVÉRIFIABLE, anonyme (« une équipe a longtemps renvoyé 200 ») ; même récit que `api/lecon-11` | remplacé par : la RFC 7725 et le code 451 (remerciements à Terence Eden et à Ray Bradbury, en-tête `Link: rel="blocked-by"`) | Cas réel — le code 451, quand la loi bloque une page (2016) | https://www.rfc-editor.org/rfc/rfc7725 |
| `pages/api/lecon-04.html#1` | INEXACT, produit nommé : `GET /v1/customers/{id}/invoices` n'existe pas chez Stripe (on liste par `GET /v1/invoices`, avec le client en paramètre) ; « appliquent ces règles à la lettre » invérifiable | remplacé par : le guide de conception d'API de Heroku (pluriels, imbrication minimale, `actions`) | Cas réel — Heroku publie son guide de conception d'API (2014) | https://www.heroku.com/blog/heroku-http-api-toolchain/ ; https://github.com/interagent/http-api-design ; https://docs.stripe.com/api/invoices/list |
| `pages/api/lecon-05.html#1` | INEXACT probable, produit nommé : la pagination « par curseur » de GitHub sur les commits et les notifications n'est pas confirmée (la doc dit `page`, `before`/`after` ou `since` selon le point d'accès) ; le versionnage par date de Stripe est raconté ailleurs (`formats/lecon-11`) | remplacé par : GitHub date les versions de son API REST (`X-GitHub-Api-Version: 2022-11-28`) | Cas réel — GitHub date les versions de son API (2022) | https://github.blog/developer-skills/github/to-infinity-and-beyond-enabling-the-future-of-githubs-rest-api-with-api-versioning/ ; https://docs.github.com/en/rest/using-the-rest-api/using-pagination-in-the-rest-api |
| `pages/api/lecon-06.html#1` | INEXACT, produit nommé : GitHub ne « révoque » pas « toute clé » repérée (généralisation) ; sujets gardés par `lua/lecon-11` (limiteur) et `git/lecon-14` (secret scanning) | remplacé par : Peloton, une API qui répondait sans authentification | Cas réel — l'API de Peloton répondait à tout le monde (2021) | https://www.pentestpartners.com/security-blog/tour-de-peloton-exposed-user-data/ |
| `pages/api/lecon-07.html#1` | INVÉRIFIABLE, général (« Se connecter avec Google ») | remplacé par : la RFC 6749, OAuth 2.0 et les problèmes du mot de passe confié | Cas réel — OAuth 2.0 devient la RFC 6749 (2012) | https://www.rfc-editor.org/rfc/rfc6749 |
| `pages/api/lecon-08.html#1` | INEXACT léger, produit nommé : « Stripe a popularisé » invérifiable, « mémorisé 24 h » (la doc dit : clés purgeables au bout d'au moins 24 h, API v1), « la protection visuelle ne suffit pas » absent de la source | corrigé : même sujet, daté et sourcé (trois pannes, `Idempotency-Key` sur les `POST`, résultat mis en cache, *backoff* et *jitter*, UUID v4) | Cas réel — Stripe et la clé d'idempotence (2017) | https://stripe.com/blog/idempotency ; https://docs.stripe.com/api/idempotent_requests |
| `pages/api/lecon-09.html#1` | VRAI dans les grandes lignes (GitHub ouvre une API GraphQL en 2016), mais sujet gardé par `graphql/lecon-06` | remplacé par : PayPal Checkout passe de REST à GraphQL (700 ms par aller-retour) | Cas réel — PayPal Checkout passe de REST à GraphQL (2018) | https://developer.paypal.com/community/blog/graphql-a-success-story-for-paypal-checkout/ |
| `pages/api/lecon-10.html#1` | INVÉRIFIABLE, produits nommés : « SDK officiels tous générés à partir du même contrat », « les SDK comme la doc suivent automatiquement » — non sourcé | remplacé par : GitHub publie la description OpenAPI de son API REST | Cas réel — GitHub décrit son API REST en OpenAPI (2020) | https://github.blog/news-insights/product-news/introducing-githubs-openapi-description/ ; https://docs.github.com/en/rest/using-the-rest-api/libraries-for-the-rest-api |
| `pages/api/lecon-11.html#1` | INVÉRIFIABLE, anonyme (« une équipe expose une API… ») | remplacé par : les Microsoft REST API Guidelines et leur format d'erreur unique (document aujourd'hui obsolète, dit comme tel) | Cas réel — Microsoft fixe un format d'erreur unique (2016) | https://github.com/microsoft/api-guidelines/blob/9266b7c82e79d1da1f510aaeb5a4ac8e7952e3ce/Guidelines.md ; https://github.com/microsoft/api-guidelines/blob/vNext/Guidelines.md ; https://github.com/microsoft/api-guidelines/commit/9266b7c82e79d1da1f510aaeb5a4ac8e7952e3ce |
| `pages/api/lecon-12.html#1` | Produits nommés (Stripe, GitHub), deux sujets en un, sans date ni source ; affirmations plausibles non vérifiées une à une | remplacé par : la spécification Standard Webhooks (réessais sur plusieurs jours, `webhook-id` comme clé d'idempotence, signature contre le rejeu) — évite aussi un deuxième cas Stripe dans le cours | Cas réel — Standard Webhooks, des règles communes (2023) | https://github.com/standard-webhooks/standard-webhooks/commit/d80cbcb55fcc2a2228c3a94f898106a66332b592 ; https://github.com/standard-webhooks/standard-webhooks/blob/main/spec/standard-webhooks.md ; https://www.standardwebhooks.com/ |
| `pages/api/lecon-13.html#1` | INVÉRIFIABLE, anonyme : la route `/factures` en centimes puis en euros, « cent fois trop cher » | remplacé par : Pact, né chez realestate.com.au (provider states, doublures fidèles) | Cas réel — Pact, le test de contrat né chez realestate.com.au (2013) | https://docs.pact.io/history ; https://docs.pact.io/ |
| `pages/api/lecon-14.html#1` | INVÉRIFIABLE, général (« un outil de gestion de projet, type Trello, Asana ») | remplacé par : OpenAPI 3.1.0 ajoute le champ `webhooks` | Cas réel — OpenAPI 3.1 décrit aussi les webhooks (2021) | https://spec.openapis.org/oas/v3.1.0.html ; https://github.com/OAI/OpenAPI-Specification/releases/tag/3.1.0-rc0 |

Aussi ouverts pour vérifier : https://www.rfc-editor.org/info/rfc5789, `…/rfc6749`, `…/rfc7725` (statut),
https://slack.com/api/auth.test et https://docs.slack.dev/apis/web-api/ (sujet écarté).

## Décomptes

| | vue | api | total |
|---|---:|---:|---:|
| « Cas réel » lus | 14 | 14 | 28 |
| conformes à la règle avant → après | 0 → 14 | 0 → 14 | 0 → 28 |
| remplacés | 13 | 13 | 26 |
| corrigés sur leur sujet | 1 | 1 | 2 |
| gardés tels quels | 0 | 0 | 0 |
| renommés « Scénario » | 0 | 0 | 0 |
| trouvés INVENTÉ | 1 | 0 | 1 |
| trouvés INEXACT (au moins) | 1 | 3 | 4 |

## Contrôles (sur la copie, après le dernier changement de page)

- `node tools/verif-contenu.js --cas-reel --cours=vue` → **0** (14 conformes) ;
  `--cours=api` → **0** (14 conformes).
- `node tools/verif-contenu.js --strict` → **0**.
- `node tools/verif-html.js` → **0**.
- `node tools/verif-domaines-interdits.js` → **0**.
- `node tools/verif-qcm-lexique.js` → **0** ; `node tools/verif-qcm-biais.js` → **0**.
- `node tools/cas-reels/lots/lexique-diff.js D:\test-claude-b9-vue-api c5b3e9d` → **0 écart** (28 pages).
- `node tools/cas-reels/lots/controle-branche.js D:/test-claude-b9-vue-api c5b3e9d` → **OK** (0 CR,
  0 domaine interdit, octets identiques hors « Cas réel », types gardés, signatures, copie propre).
- `node tools/cas-reels/lots/doublons.js` → 2 sources partagées (les deux légitimes connues).
- `node tools/verif.js --rapide` → **code 1**, 453,9 s, **48/54** étapes vertes ; les 6 rouges, tous attendus :
  - `donnees` : l'invariant **I18** seul en erreur (`quiz-index.js` et `search-index.js` à regénérer) ;
    I17 et I19 en simple avertissement — toléré, l'orchestrateur regénère.
  - `doc-ref`, `doc-rec`, `normatf` : les compteurs du cours `doc` mesurés sur tout le site (leçons
    qui renvoient à un document 119, cours concernés 42, leçons citant une RFC 29, parlant de la
    spécification 42, leçons qui citent la source de leur « Cas réel ») — mes 28 lignes de source et
    mes trois RFC les font bouger ; toléré par la consigne. Le second échec de `doc-rec`, « 8 leçons »
    qui nomment Stack Overflow ou un assistant, ne vient pas de cette part : aucune des 28 pages ne
    change ces mentions (comparé à `c5b3e9d` avec le motif de `tools/doc/mesures/recours.js`).
  - `etudes` et `etude-6` : **une seule cause**, la page dérivée `pages/etude-inconnu.html`, qui publie la
    mesure des blocs de code du site. L'encadré de `vue/lecon-03` remplace un bloc `language-markup` (le
    composant de recherche) par un bloc `language-javascript` (l'exemple du billet de Vue 3.4) : la mesure
    du jour donne `javascript(2184)` au lieu de 2183, `markup(524)` au lieu de 525, 6 561,8 Ko au lieu de
    6 561,9. Page dérivée, non touchée ici : à réassembler à la fusion (voir plus bas).

## Consignes de fusion

- Branche `v18/b9-vue-api` : trois commits au-dessus de `c5b3e9d`, seulement `pages/vue/lecon-01` à `14`,
  `pages/api/lecon-01` à `14` et ce rapport ; aucun autre fichier, aucun index dérivé.
- Après fusion : regénérer les index (`build-index.js --write --fresh`, I18), réassembler
  `pages/etude-inconnu.html` (son assembleur sous `tools/etudes/inconnu/`, sans `--verifier`), regénérer
  les pages du cours `doc` (compteurs de `doc-ref`, `doc-rec`, `normatf`), puis relancer `--rapide`.
- Registre `foyers.md` : y inscrire les 28 sujets de `b9-reservations.txt` pour `vue/` et `api/`
  (`foyers-ajouter.js`).
- Contre-relecture : les deux comportements rejoués (`vue/lecon-03`, `vue/lecon-13`) se rejouent avec
  `scratchpad/b9-vue-api/js/computed.js` et `emits2.js` (paquets npm dans `scratchpad/b9-vue-api/js/`).

## Ce qui reste ouvert

- **Ancres de fraîcheur** : trois marques `fraicheur` vivaient dans les anciens encadrés et sont parties
  avec eux (`vue/lecon-01` GitLab, `vue/lecon-04` Vuetify, `vue/lecon-07` VueUse « plus de 200
  composables ») ; leurs ancres restent dans `tools/fraicheur/releves/vue-lot-2026-11-11.json` (phase E).
  Les nouveaux encadrés ne disent rien au présent qui doive se dater, hors la documentation du NWS,
  datée dans sa ligne de source (« consultée le 17 novembre 2026 »).
- **Hors encadré, non touché** : `vue/lecon-11` affiche l'erreur dès qu'un champ n'est plus vide
  (`email && !emailValide`), ce que Baymard range dans la validation prématurée pour la plupart des champs
  (il conseille de vérifier à la sortie du champ) — l'encadré le dit, le corps de la leçon pourrait le
  dire aussi ; le tableau de `api/lecon-02` donne PATCH « (souvent) idempotent », la RFC 5789 dit « ni
  sûr ni idempotent » (une requête pouvant être émise de façon idempotente) — l'encadré nuance, le tableau
  pourrait le faire ; `api/lecon-13` cite Pact dans « Pour aller plus loin » juste après l'encadré qui
  raconte sa naissance (redondance, pas d'erreur).
- **Registre** (`foyers.md`) : sujets du lot que d'autres cours pourraient vouloir — la clé d'idempotence
  de Stripe (`api/lecon-08`), PATCH et la RFC 5789 (`api/lecon-02`), le code 451 (`api/lecon-03`),
  OAuth 2.0 et la RFC 6749 (`api/lecon-07`), PayPal et GraphQL (`api/lecon-09`), Teleport (`vue/lecon-08`),
  FLIP (`vue/lecon-12`), Pinia (`vue/lecon-14`), Pact (`api/lecon-13`, le cours `tests` l'enseigne en
  `tests/lecon-12`, dont le cas est Mars Climate Orbiter).
- **Deux cas GitLab** dans `vue` (2016, le choix de Vue ; 2017, le découpage du code) et **deux cas GitHub**
  dans `api` (2020, la description OpenAPI ; 2022, le versionnage) : sujets différents, sources
  différentes, laissés tels.
