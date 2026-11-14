# Rapport V18 — case B4 (lot 1) : les « Cas réel » des cours `react` et `sql`

Copie de travail `D:\test-claude-b4-react-sql`, branche `v18/b4-react-sql`, partie de `a244d0f`.
Scripts : `scratchpad/b4-react-sql/` de la copie (ignoré par git) — `appliquer.js` (remplacement de
l'encadré seul, préfixe et suffixe de la page prouvés identiques à l'octet), `donnees-react.js` et
`donnees-sql.js` (le texte de chaque cas), `stricte.js` et `inverse.js` (indice lexical question par
question, avant/après). Les PDF lus avec `pypdf` y sont aussi (Codd, Gray, ACIDRain, Robles,
Herndon-Ash-Pollin).

## 1. Ce qui a été fait

**50 « Cas réel » lus** (26 `react`, 24 `sql`), chacun avec sa leçon. **Aucun n'était vrai et
sourcé** : 48 étaient des récits anonymes ou des illustrations générales (« sur une boutique en
ligne… », « une équipe… »), donc INVÉRIFIABLES ; deux portaient un détail faux (INEXACT, § 3).
Aucun INVENTÉ déclaré.

**Méthode** : pour chaque leçon, la notion enseignée d'abord, puis un vrai cas daté sur la même
notion, vérifié à une source ouverte (blog officiel, notes de version, documentation, ticket,
décision de justice, article original). Le texte ne dit que ce que dit la source ; les chiffres
sont recopiés de la source, jamais arrondis à la main ; aucune citation traduite sans la phrase
d'origine dans la source. La dernière phrase relie le cas à la notion de la leçon, comme le faisait
l'original. Forme de la règle partout : `Cas réel — sujet (année)` et
`<p class="cas-reel__source">` en dernier paragraphe, avec un lien vers chaque page ouverte.

**Décomptes par action** :

| cours | lus | vérifiés tels quels | corrigés | remplacés | renommés « Scénario » |
|---|---:|---:|---:|---:|---:|
| `react` | 26 | 0 | 1 | 25 | 0 |
| `sql` | 24 | 0 | 0 | 24 | 0 |
| **total** | **50** | **0** | **1** | **49** | **0** |

**État trouvé** : VRAI 0 · INEXACT 2 (`react/lecon-06`, `react/lecon-22`) · INVÉRIFIABLE 48 ·
INVENTÉ 0. Par nature : 1 produit nommé (`react/lecon-22`), 49 anonymes ou généraux (dont
`sql/lecon-16` et `sql/lecon-20`, qui citent des produits mais pour un usage général non sourcé).

Aucun cas n'a été renommé « Scénario » : chaque leçon a trouvé un vrai cas sourcé sur sa notion.
Aucun sujet n'est repris d'une autre leçon du même cours (vérifié par `grep` dans `pages/react/`
et `pages/sql/` avant d'écrire) ; seul `gh-ost` revient deux fois en `sql`, pour deux faits
distincts (§ 4).

## 2. Cas par cas — `react`

Tous les identifiants sont `#1` (une leçon = un encadré). « Remplacé » = le récit d'origine est
retiré et un vrai cas, sur la même notion, prend sa place.

| leçon | notion | état trouvé (nature) | action | nouveau titre | sources ouvertes |
|---|---|---|---|---|---|
| `pages/react/lecon-01.html#1` | composant, JSX | INVÉRIFIABLE (général : « Meta, GitHub ou Airbnb maintiennent des design systems ») | remplacé | Cas réel — Pourquoi React est né (2013) | https://legacy.reactjs.org/blog/2013/06/05/why-react.html |
| `pages/react/lecon-02.html#1` | JSX = sucre syntaxique | INVÉRIFIABLE (général ; « l'un des bugs les plus signalés » introuvable, déjà noté par B2) ; doublon du piège du `0` de la leçon 05 | remplacé | Cas réel — La nouvelle transformation JSX de React 17 (2020) | https://legacy.reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html |
| `pages/react/lecon-03.html#1` | props, valeurs par défaut | INVÉRIFIABLE (général : « 10 000 produits ») | remplacé | Cas réel — React 19 et les props par défaut (2024) | https://react.dev/blog/2024/04/25/react-19-upgrade-guide |
| `pages/react/lecon-04.html#1` | `key`, pas l'index | INVÉRIFIABLE (général ; technique juste) | remplacé | Cas réel — « Index as a key is an anti-pattern » (2015) | https://robinpokorny.com/blog/index-as-a-key-is-an-anti-pattern/ |
| `pages/react/lecon-05.html#1` | `&&` et le `0` | INVÉRIFIABLE (général : « le piège le plus fréquemment signalé en revue de code », introuvable) | remplacé | Cas réel — Le « 0 » livré en production chez PayPal (2020) | https://kentcdodds.com/blog/use-ternaries-rather-than-and-and-in-jsx |
| `pages/react/lecon-06.html#1` | forme fonction de `setState` | **INEXACT** (anonyme) : « il perd des clics quand l'utilisateur tape vite » est faux pour des clics distincts — React ne regroupe pas plusieurs événements volontaires, chaque clic est traité à part (react.dev, « Queueing a Series of State Updates ») ; « beaucoup d'équipes en font une règle » introuvable | remplacé | Cas réel — Le compteur bloqué à 1 de Dan Abramov (2019) | https://overreacted.io/a-complete-guide-to-useeffect/ (et, pour le constat d'inexactitude : https://react.dev/learn/queueing-a-series-of-state-updates) |
| `pages/react/lecon-07.html#1` | événements | INVÉRIFIABLE (général ; technique juste) | remplacé | Cas réel — Les événements de React 17 (2020) | https://legacy.reactjs.org/blog/2020/08/10/react-v17-rc.html |
| `pages/react/lecon-08.html#1` | champ contrôlé | INVÉRIFIABLE (général) | remplacé | Cas réel — Le curseur qui saute, ticket n° 955 de React (2014) | https://github.com/facebook/react/issues/955 |
| `pages/react/lecon-09.html#1` | nettoyage d'effet | INVÉRIFIABLE (général : messagerie) | remplacé | Cas réel — Le double montage du mode strict de React 18 (2022) | https://react.dev/blog/2022/03/29/react-v18 |
| `pages/react/lecon-10.html#1` | course des requêtes | INVÉRIFIABLE (général : « les équipes ajoutent systématiquement ») | remplacé | Cas réel — La « course » des requêtes dans la doc de React (2023) | https://react.dev/learn/you-might-not-need-an-effect ; https://react.dev/blog/2023/03/16/introducing-react-dev |
| `pages/react/lecon-11.html#1` | lever l'état | INVÉRIFIABLE (général : panier) | remplacé | Cas réel — « Thinking in React » (2013) | https://raw.githubusercontent.com/facebook/react/v0.8.0/docs/_posts/2013-11-05-thinking-in-react.md (l'ancienne adresse du billet redirige vers react.dev) |
| `pages/react/lecon-12.html#1` | `useRef`, `useContext` | INVÉRIFIABLE (général : « la plupart des applications ont un ThemeContext et un AuthContext ») | remplacé | Cas réel — React 16.3, le contexte et les refs (2018) | https://legacy.reactjs.org/blog/2018/03/29/react-v-16-3.html ; https://react.dev/reference/react/useContext |
| `pages/react/lecon-13.html#1` | `useReducer`, hooks personnalisés | INVÉRIFIABLE (général) | remplacé | Cas réel — React 16.8, la version des hooks (2019) | https://legacy.reactjs.org/blog/2019/02/06/react-v16.8.0.html |
| `pages/react/lecon-14.html#1` | découper en composants (présentation / conteneur) | INVÉRIFIABLE (anonyme : « 600 lignes », « bundle sous 200 Ko ») | remplacé | Cas réel — Dan Abramov et les composants « conteneurs » (2015) | https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0 (403 à l'outil web : téléchargée par `curl`, date lue dans `datePublished`) |
| `pages/react/lecon-15.html#1` | routage | INVÉRIFIABLE (général) | remplacé | Cas réel — React Router v6 (2021) | https://remix.run/blog/react-router-v6 |
| `pages/react/lecon-16.html#1` | mémoïsation | INVÉRIFIABLE (anonyme : « 5 000 lignes », « 180 ms ») | remplacé | Cas réel — React Compiler 1.0, la mémoïsation automatique (2025) | https://react.dev/blog/2025/10/07/react-compiler-1 |
| `pages/react/lecon-17.html#1` | error boundaries | INVÉRIFIABLE (anonyme, déjà noté par B2) | remplacé | Cas réel — React 16 et les error boundaries de Messenger (2017) | https://legacy.reactjs.org/blog/2017/07/26/error-handling-in-react-16.html |
| `pages/react/lecon-18.html#1` | Context à l'échelle | INVÉRIFIABLE (anonyme) | remplacé | Cas réel — React-Redux 7 renonce au Context pour son état (2019) | https://github.com/reduxjs/react-redux/releases/tag/v7.0.1 (date confirmée par l'API GitHub : 2019-04-09) |
| `pages/react/lecon-19.html#1` | données serveur, `useOptimistic` | INVÉRIFIABLE (anonyme) | remplacé | Cas réel — React 19 : Actions et useOptimistic (2024) | https://react.dev/blog/2024/12/05/react-19 |
| `pages/react/lecon-20.html#1` | limites d'une SPA, frameworks | INVÉRIFIABLE (anonyme : un média) | remplacé | Cas réel — React abandonne Create React App (2025) | https://react.dev/blog/2025/02/14/sunsetting-create-react-app |
| `pages/react/lecon-21.html#1` | typer les props | INVÉRIFIABLE (anonyme, déjà noté par B2) | remplacé | Cas réel — Airbnb passe son code React à TypeScript (2020) | https://medium.com/airbnb-engineering/ts-migrate-a-tool-for-migrating-to-typescript-at-scale-cd23bfeb5cc (403 à l'outil web : téléchargée par `curl`) |
| `pages/react/lecon-22.html#1` | composants composés | **INEXACT** (produits nommés) : la syntaxe donnée, `<Dialog><Dialog.Trigger/><Dialog.Content/></Dialog>`, n'est pas celle de Radix, dont la racine est `Dialog.Root` et le contenu passe par `Dialog.Portal` ; « Radix, Headless UI, Reach UI, React Aria sont bâties sur ce motif » reste général | **corrigé** : recentré sur un seul produit, Radix UI, avec l'anatomie exacte de sa documentation | Cas réel — Le Dialog de Radix UI (2022) | https://www.radix-ui.com/primitives/docs/components/dialog ; https://www.radix-ui.com/primitives/docs/overview/releases (1.0.0 le 21/07/2022 ; cohérent avec le registre npm, publication 2022-07-20 UTC) |
| `pages/react/lecon-23.html#1` | valider aussi côté serveur | INVÉRIFIABLE (anonyme : tunnel de paiement) | remplacé | Cas réel — Les coupons illimités de CRMEB (2024) | https://cveawg.mitre.org/api/cve/CVE-2024-50653 ; https://cwe.mitre.org/data/definitions/602.html |
| `pages/react/lecon-24.html#1` | accessibilité des composants | INVÉRIFIABLE (anonyme : une boutique auditée ; la date de l'European Accessibility Act n'a pas été vérifiée, le cas étant remplacé) | remplacé | Cas réel — Robles contre Domino's Pizza (2019) | https://cdn.ca9.uscourts.gov/datastore/opinions/2019/01/15/17-55504.pdf (lu avec `pypdf`) ; https://www.supremecourt.gov/search.aspx?filename=/docket/docketfiles/html/public/18-1539.html |
| `pages/react/lecon-25.html#1` | `prefers-reduced-motion` | INVÉRIFIABLE (anonyme) | remplacé | Cas réel — WebKit et prefers-reduced-motion (2017) | https://webkit.org/blog/7551/responsive-design-for-motion/ |
| `pages/react/lecon-26.html#1` | bibliothèque de composants | INVÉRIFIABLE (anonyme : « quinze variantes de bouton ») | remplacé | Cas réel — L'inventaire d'interface de Brad Frost (2013) | https://bradfrost.com/blog/post/interface-inventory/ |

## 3. Cas par cas — `sql`

| leçon | notion | état trouvé (nature) | action | nouveau titre | sources ouvertes |
|---|---|---|---|---|---|
| `pages/sql/lecon-01.html#1` | `ORDER BY`, ordre non garanti | INVÉRIFIABLE (général : un site d'annonces) | remplacé | Cas réel — MySQL 8.0 et l'ordre jamais garanti (2019) | https://bugs.mysql.com/bug.php?id=94433 ; https://dev.mysql.com/blog-archive/removal-of-implicit-and-explicit-sorting-for-group-by/ |
| `pages/sql/lecon-02.html#1` | `WHERE`, `NULL` contre la chaîne | INVÉRIFIABLE (général) | remplacé | Cas réel — Monsieur Null, le nom que les formulaires refusent (2015) | https://www.wired.com/2015/11/null/ (bloquée à l'outil web : téléchargée par `curl`) — **presse**, mais c'est le récit à la première personne de l'intéressé |
| `pages/sql/lecon-03.html#1` | `LIMIT` / `OFFSET` | INVÉRIFIABLE (général, déjà noté par B2) | remplacé | Cas réel — Slack abandonne la pagination par OFFSET (2017) | https://slack.engineering/evolving-api-pagination-at-slack/ |
| `pages/sql/lecon-04.html#1` | conversions, `CAST` | INVÉRIFIABLE (général : un back-office) | remplacé | Cas réel — Les gènes qu'Excel change en dates (2016) | https://www.ebi.ac.uk/europepmc/webservices/rest/PMC4994289/fullTextXML (texte intégral ; la page de l'éditeur redirige vers une authentification) |
| `pages/sql/lecon-05.html#1` | règle d'or du `GROUP BY` | INVÉRIFIABLE (général : « Google Analytics ou Matomo repose entièrement… ») | remplacé | Cas réel — MySQL 5.7.5 et la règle d'or du GROUP BY (2014) | https://dev.mysql.com/doc/relnotes/mysql/5.7/en/news-5-7-5.html ; https://dev.mysql.com/doc/refman/5.7/en/group-by-handling.html (sert aujourd'hui la version 9.7 du manuel) |
| `pages/sql/lecon-06.html#1` | clé primaire, clé étrangère | INVÉRIFIABLE (général) | remplacé | Cas réel — E. F. Codd et le modèle relationnel (1970) | https://www.seas.upenn.edu/~zives/03f/cis550/codd.pdf (copie de l'article ; lu avec `pypdf`) |
| `pages/sql/lecon-07.html#1` | `INNER` / `LEFT JOIN` | INVÉRIFIABLE (général) | remplacé | Cas réel — La norme SQL de 1992 et ses jointures (1992) | https://www.contrib.andrew.cmu.edu/~shadow/sql/sql1992.txt (version proposée de juillet 1992, § 7.5) |
| `pages/sql/lecon-08.html#1` | `FULL OUTER JOIN` et son émulation | INVÉRIFIABLE (général) | remplacé | Cas réel — SQLite ajoute enfin RIGHT et FULL OUTER JOIN (2022) | https://www.sqlite.org/releaselog/3_39_0.html ; https://dev.mysql.com/doc/refman/8.4/en/join.html |
| `pages/sql/lecon-09.html#1` | CTE | INVÉRIFIABLE (général) | remplacé | Cas réel — PostgreSQL 12 et les CTE intégrées à la requête (2019) | https://www.postgresql.org/docs/release/12.0/ |
| `pages/sql/lecon-10.html#1` | `DELETE` qui touche trop | INVÉRIFIABLE (général) | remplacé | Cas réel — La suppression massive d'Atlassian (2022) | https://www.atlassian.com/engineering/post-incident-review-april-2022-outage |
| `pages/sql/lecon-11.html#1` | clé étrangère dans le DDL | INVÉRIFIABLE (anonyme) | remplacé | Cas réel — SQLite et ses clés étrangères désactivées par défaut (2009) | https://www.sqlite.org/foreignkeys.html |
| `pages/sql/lecon-12.html#1` | transactions, ACID | INVÉRIFIABLE (général : billet de train) | remplacé | Cas réel — Jim Gray et le concept de transaction (1981) | https://jimgray.azurewebsites.net/papers/thetransactionconcept.pdf (lu avec `pypdf`) |
| `pages/sql/lecon-13.html#1` | fonctions de fenêtrage | INVÉRIFIABLE (général) | remplacé | Cas réel — SQLite 3.25 adopte les fonctions de fenêtrage (2018) | https://www.sqlite.org/releaselog/3_25_0.html ; https://www.sqlite.org/windowfunctions.html |
| `pages/sql/lecon-14.html#1` | injection SQL | INVÉRIFIABLE (général : « des fuites massives… » ; l'affirmation sur le classement OWASP n'a pas été vérifiée, le cas étant remplacé) | remplacé | Cas réel — TalkTalk et l'injection SQL (2015) | https://ico.org.uk/about-the-ico/media-centre/talktalk-cyber-attack-how-the-ico-investigation-unfolded/ (l'avis de sanction PDF, ancienne adresse, répond 404) |
| `pages/sql/lecon-15.html#1` | triggers, leurs inconvénients | INVÉRIFIABLE (général) | remplacé | Cas réel — GitHub renonce aux triggers pour migrer ses tables (2016) | https://github.blog/news-insights/company-news/gh-ost-github-s-online-migration-tool-for-mysql/ |
| `pages/sql/lecon-16.html#1` | plein-texte | INVÉRIFIABLE (produits nommés pour un usage général : « en quelques millisecondes ») | remplacé | Cas réel — PostgreSQL 8.3 intègre la recherche plein-texte (2008) | https://www.postgresql.org/docs/release/8.3.0/ ; https://www.postgresql.org/docs/current/textsearch-intro.html |
| `pages/sql/lecon-17.html#1` | lire un plan, index | INVÉRIFIABLE (anonyme : « douze millions de lignes », « 6 s → 3 ms ») | remplacé | Cas réel — Mattermost lit son plan d'exécution (2024) | https://mattermost.com/blog/making-a-postgres-query-1000-times-faster/ |
| `pages/sql/lecon-18.html#1` | intégrité, clés étrangères | INVÉRIFIABLE (anonyme, déjà noté par B2) | remplacé | Cas réel — GitHub et ses tables sans clés étrangères (2016) | https://github.com/github/gh-ost/issues/331 |
| `pages/sql/lecon-19.html#1` | vues matérialisées | INVÉRIFIABLE (anonyme : « 40 millions de ventes », « 9 secondes ») | remplacé | Cas réel — PostgreSQL et ses vues matérialisées (2013) | https://www.postgresql.org/docs/release/9.3.0/ ; https://www.postgresql.org/docs/release/9.4.0/ |
| `pages/sql/lecon-20.html#1` | `ROLLUP`, `CUBE`, `GROUPING()` | INVÉRIFIABLE (général ; « Metabase, Power BI génèrent ce SQL » non sourcé) | remplacé | Cas réel — PostgreSQL 9.5 adopte ROLLUP et CUBE (2016) | https://www.postgresql.org/docs/release/9.5.0/ ; https://www.postgresql.org/docs/current/queries-table-expressions.html |
| `pages/sql/lecon-21.html#1` | calcul de dates | INVÉRIFIABLE (anonyme) | remplacé | Cas réel — La panne d'Azure du 29 février (2012) | https://azure.microsoft.com/en-us/blog/summary-of-windows-azure-service-disruption-on-feb-29th-2012/ |
| `pages/sql/lecon-22.html#1` | concurrence, `FOR UPDATE` | INVÉRIFIABLE (général : billet de concert) | remplacé | Cas réel — ACIDRain, la concurrence comme arme (2017) | https://www.bailis.org/papers/acidrain-sigmod2017.pdf (lu avec `pypdf`) |
| `pages/sql/lecon-23.html#1` | expand/contract | INVÉRIFIABLE (anonyme : « 90 secondes », « vague de 500 ») | remplacé | Cas réel — Stripe migre ses abonnements sans interruption (2017) | https://stripe.com/blog/online-migrations |
| `pages/sql/lecon-24.html#1` | rapport rejouable de bout en bout | INVÉRIFIABLE (anonyme : « rapport du lundi ») | remplacé | Cas réel — L'erreur de tableur de Reinhart et Rogoff (2013) | https://peri.umass.edu/images/WP322.pdf (lu avec `pypdf`) |

## 4. Les cas où j'ai douté (à regarder en premier à la contre-relecture)

- **`react/lecon-10`** est un cas de **documentation** (la page « You Might Not Need an Effect »),
  pas un incident : aucun post-mortem public de « course » de requêtes trouvé. La date du titre est
  celle de la mise en ligne de react.dev (16/03/2023), que le billet d'annonce confirme ; la page
  elle-même n'est pas datée.
- **`react/lecon-23`** : CVE-2024-50653 illustre « le client est contournable » par une limite de
  coupon tenue côté interface, pas par un champ de formulaire. La fiche CVE est laconique ; le
  remède cité est celui de CWE-602, qui range explicitement ce CVE dans ses exemples. Le lien
  du dépôt du découvreur n'a pas été ouvert, et le texte n'en dit rien.
- **`react/lecon-08`** : les deux mainteneurs du ticket n° 955 ne sont désignés que comme
  « un mainteneur du projet » : la page ne donne que leurs pseudonymes, pas leurs noms.
- **`react/lecon-16`** : les gains du Meta Quest Store sont ceux qu'annonce Meta (avec sa propre
  réserve « les gains varient », reprise dans le texte).
- **`sql/lecon-17`** : l'article de Mattermost écrit « 50 fois plus lent » pour MySQL, mais ses
  propres mesures donnent 0,18 s et 5,46 s (≈ 30 fois). Le texte donne **les deux mesures**, pas le
  rapport. L'auteur n'est signé que « Alejandro ».
- **`sql/lecon-07`** : la source est la version **proposée** de juillet 1992 (texte publié par
  CMU), pas le texte ISO payant ; « approuvée en 1992 » vient de l'introduction de ce texte. La
  forme `table [type] JOIN table` omet volontairement `NATURAL` (optionnel dans la grammaire).
- **`sql/lecon-15` et `sql/lecon-18`** citent tous deux `gh-ost` de GitHub, pour deux faits
  distincts (les triggers, le billet du 01/08/2016 ; les clés étrangères, le ticket n° 331 de
  décembre 2016). Pas de reprise du même cas, mais le même outil.
- **`sql/lecon-18`** prend le contre-pied apparent de la leçon (GitHub n'utilise aucune clé
  étrangère) : je l'ai gardé parce qu'il montre l'arbitrage réel et ce qu'il coûte (l'application
  hérite du travail de la contrainte), ce que dit la section « le bon mécanisme d'intégrité ».
- **`sql/lecon-02`** (Wired) est un article de presse, mais c'est le témoignage de l'intéressé
  lui-même ; aucune autre source primaire n'existe pour ce récit.
- **`sql/lecon-04`** : les noms des auteurs sont donnés en initiales (M. Ziemann, Y. Eren,
  A. El-Osta), seule forme lue dans la source ouverte (Europe PMC).
- **`sql/lecon-24`** : le cas (un tableur d'économistes) éclaire « un rapport rejouable » par
  l'exemple inverse ; aucun cas de rapport SQL d'entreprise documenté de façon primaire n'a été
  trouvé.

## 5. L'indice lexical des QCM

Premier passage : `verif-qcm-lexique.js` en **1**, non par régression mais parce que `react`
**progressait** sans être figé (STRICTE 85,7 % → 81,8 %) ; et `sql` dérivait de +0,9 à +1,3 point
(dans la latitude). Mesure question par question (avant/après, `--liste` sur l'arbre de `a244d0f`
reconstitué dans le scratchpad) : les mots retirés des anciens encadrés comptent autant que les
mots ajoutés. Six mots rendus aux encadrés ou ôtés, sans changer leur sens :

- `sql` : « qu'une » (L06), « orphelines » (L11), « résultats » (L13), « nouvelle » (L15),
  « stockée » (L04) rendus ; « basculer » (L23, mot de la bonne réponse de la q3, qui la rendait
  désignable par STRICTE), « remplace » (L07) et `NATURAL` (L07) ôtés.
- `react` : « fourni » (L12), « résultat » (L14) rendus ; « doivent » (L13) et « qu'elle » (L14)
  ôtés.

Résultat : **`sql` revient exactement à sa référence** sur les six dimensions (INVERSE 3,8 % → 3,7 %,
seule différence, à la baisse). **`react` progresse sur cinq dimensions** (STRICTE 85,7 → 81,8 ;
PROPORTION 71,6 → 70,3 ; RESTREINT STRICTE 78,2 → 75,3 ; RESTREINT PROPORTION 68,3 → 67,1 ;
RESTREINT INVERSE 5,2 → 4,8) **et monte de 0,05 point sur la sixième** (INVERSE 3,23 → 3,28 %,
loin sous la latitude de 2 points et sous le hasard). Le gain est
**figé pour `react` seulement** : `--ecrire` réécrivait aussi `nodejs` (INVERSE 4,76 → 4,84 %, dérive
déjà présente dans `a244d0f`, étrangère à cette case) et un arrondi de `reseaux` ; je n'ai reporté
dans `tools/qcm-lexique-reference.json` **que l'entrée `react`**, et j'ai laissé la date de la
référence au 2026-11-10 pour ne pas créer de conflit avec les autres copies.

## 6. Contrôles avant le dernier commit

| commande | code |
|---|---:|
| `node tools/verif-contenu.js --cas-reel --cours=react` | **0** (26/26 conformes) |
| `node tools/verif-contenu.js --cas-reel --cours=sql` | **0** (24/24 conformes) |
| `node tools/verif-contenu.js --strict` | **0** |
| `node tools/verif-html.js` | **0** |
| `node tools/verif-domaines-interdits.js` | **0** |
| `node tools/verif-qcm-lexique.js` | **0** |
| `node tools/verif-qcm-biais.js` | **0** |
| `node tools/verif.js --rapide` | **1** — 54 étapes, 52 OK, 2 signalent (900,5 s) |

Les deux rouges de `--rapide`, expliqués :

- **`donnees`** : seul l'invariant **I18** est rouge (`js/search-index.js` périmé, écart +5 737 o),
  le rouge toléré par la consigne ; `node tools/verif-donnees.js` seul le confirme (2 erreurs, toutes
  deux sous I18, rien d'autre).
- **`doc-rec`** (`node tools/doc/verif-recherche.js`, 75 contrôles OK, 1 échec) : « la page publie
  les portes de sortie du site — introuvable dans la page : « 61 portent un lien vers
  l'extérieur » ». `pages/doc/lecon-04.html` publie **11** leçons à lien externe ; les 50 lignes de
  source de cette case en ajoutent un chacune (11 + 50 = 61). Conséquence directe de la règle de
  B3 (le lien est permis), pas une faute de la case ; voir § 7. Un premier passage, lancé pendant
  que je rejouais les remplacements, signalait aussi `doc-ref` : rejoué seul sur l'arbre stable,
  `node tools/doc/verif-doc.js` sort en 0 (41 contrôles OK), et le second passage complet l'a
  vu vert.

Fins de ligne : les 51 fichiers modifiés ont **0 CR** (vérifié par node). Chaque remplacement a
été prouvé par `appliquer.js` : tout ce qui précède et suit l'encadré est identique à l'octet. Aucune
leçon à mojibake volontaire n'est dans cette part. Ni QCM, ni `js/data.js`, ni index dérivé touché.
Jamais `verif.js --mutations`.

## 7. Ce qui reste ouvert

- **`pages/sql/lecon-13.html`** porte un intertitre `<h2>Cas réel : le classement « Top-N par
  groupe »</h2>` qui annonce une section d'exemple travaillé, pas un fait réel. L'extraction ne le
  compte pas (il enveloppe l'encadré « Cas réel », désormais conforme). Je n'y ai pas touché (la
  consigne limite le travail à l'encadré) ; à renommer, par exemple « Cas d'usage : … ».
- **`pages/sql/lecon-08.html`** (corps de leçon, non touché) : « les anciens MySQL ne le
  supportent pas » laisse entendre que les récents gèrent `FULL OUTER JOIN` ; la grammaire du manuel
  8.4 n'en a toujours pas (vu en sourçant le cas).
- **Index de recherche** périmé (I18) : à régénérer par l'orchestrateur après la fusion.
- **`pages/doc/lecon-04.html`** publie « sur les 1 536 leçons de ce site, 11 portent un lien vers
  l'extérieur » (mesure `tools/doc/mesures/recours.js`, contrôlée par l'étape `doc-rec`). Les
  lignes de source de cette case portent des liens (la règle de B3 le permet) : la mesure donne
  désormais **61** (11 + 50), et `doc-rec` signale l'écart. Ce n'est pas une faute de la case
  mais une conséquence de la règle, que chaque lot B4 à B12 aggravera : le chiffre (et la phrase
  « ce site est une île ») est à reprendre une fois les lots fusionnés — soit en régénérant la
  page, soit en excluant les `<p class="cas-reel__source">` de la mesure. Je n'ai pas touché au
  cours `doc`, hors de ma part.
- **Référence lexicale** : la dérive de `nodejs` (INVERSE 4,76 → 4,84 %) existe dans `a244d0f`,
  hors de cette case ; non figée ici.

## 8. Consignes de fusion

- Branche `v18/b4-react-sql`, trois commits au-dessus de `a244d0f` : `ece8b2f` (`react` : 26 leçons
  + l'entrée `react` de `tools/qcm-lexique-reference.json`), `893ce7d` (`sql` : 24 leçons), puis ce
  rapport. Rien n'est poussé.
- Fichiers touchés : `pages/react/lecon-01.html` à `lecon-26.html`, `pages/sql/lecon-01.html` à
  `lecon-24.html`, `tools/qcm-lexique-reference.json` (bloc `react` seul, date inchangée),
  `en-cours/rapports-v18/b4-react-sql.md`. Aucun autre.
- Conflit possible : `tools/qcm-lexique-reference.json`, si d'autres copies y figent leurs cours —
  garder chaque bloc de cours de sa branche, puis relancer `node tools/verif-qcm-lexique.js` sur
  l'arbre fusionné (et `--ecrire` seulement après avoir lu ce qui bouge).
- Après fusion : régénérer les index dérivés (`node tools/build-index.js --write …`), reprendre le
  chiffre des liens externes de `pages/doc/lecon-04.html` une fois tous les lots fusionnés (§ 7),
  puis `verif.js --rapide`.
