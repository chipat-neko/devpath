# Rapport V18 — case B4 (lot 1), passe de dédoublonnage : `sql` et `react`

Copie de travail `D:\test-claude-dd-sql-react`, branche `v18/b4-dd-sql-react`, partie de `8fd5290`.
Scripts dans `scratchpad/b4-dd-sql-react/` de la copie (ignoré par git) : `nouveaux.js` (le texte
de chaque cas), `remplacer.js` (remplacement de l'encadré seul, du titre à la ligne de source ;
préfixe et suffixe de la page prouvés identiques à l'octet, 0 CR relu après écriture),
`test_strict.py` (le comportement de SQLite essayé), `html2txt.py` et `pdfgrep.py` (lecture des
pages et des PDF téléchargés : rapport JPMorgan, synthèse de l'audit Tenon).

## 1. La mission

Sept « Cas réel » du lot 1, EXACTS et contre-relus, mais dont le **sujet** appartient à un autre
cours (règle « un sujet = un seul cours », registre `tools/cas-reels/lots/foyers.md`). Chacun est
**remplacé** par un autre vrai cas, sur la même notion que sa leçon, dont le sujet et la source ne
figurent nulle part ailleurs sur le site.

Avant chaque choix : registre des foyers lu ; sujet **et** URL de la source cherchés dans tout
`pages/` (`grep -ril`, puis à la casse exacte quand `-i` attrapait du bruit : `MOVEit` dans
`removeItem`, `Tenon` dans « tenons ») ; ligne ajoutée au fichier commun des réservations
`D:\test-claude\scratchpad\v18-parallele\dd-reservations.txt` **avant** d'écrire, puis fichier
relu (aucun autre agent n'avait pris ces sujets ; l'agent `php` a pris Drupalgeddon, que j'avais
écarté pour `sql/lecon-14`). `node tools/cas-reels/lots/doublons.js` : **19 → 14** sources
partagées entre cours après la passe ; aucune des sept leçons n'y figure plus.

## 2. Cas par cas

### `pages/sql/lecon-04.html#1` — leçon « Fonctions et expressions » (section `CAST`)
- **État trouvé** : VRAI (événement daté, contre-relu au lot 1) ; sujet gardé par `python/lecon-02`.
- **Action** : remplacé par **SQLite 3.37 et les tables `STRICT`** (2021), sur la même notion :
  la conversion implicite décide à ta place, le `CAST` explicite dit ce que tu veux.
- **Nouveau titre** : `Cas réel — SQLite 3.37 et les tables STRICT (2021)`
- **Sources ouvertes** : https://www.sqlite.org/stricttables.html (texte de la doc : `'123'` →
  `123`, `'xyz'` gardé en texte, types permis, `SQLITE_CONSTRAINT_DATATYPE`, exemple `'000123'`,
  « as of version 3.37.0 (2021-11-27) ») ; https://www.sqlite.org/releaselog/3_37_0.html (date).
- **Comportement essayé** (SQLite 3.50.4 par Python) : table ordinaire, `'000123'` dans une colonne
  `ANY` → `integer 123` ; table `STRICT` → `text '000123'` ; `'xyz'` dans `INTEGER STRICT` →
  « cannot store TEXT value in INTEGER column ».
- **Effet de bord corrigé** (commit `4edc50e`) : la ligne de source disait d'abord « documentation
  officielle ». Le contrôle 6 bis de `tools/doc/verif-doc.js` compte les leçons qui emploient ces
  mots, et la page `pages/doc/cours.html` en publie le nombre (106 leçons, 38 cours) : la ligne les
  portait à 107 et 39, `verif.js --rapide` rougissait sur `doc`. Elle dit maintenant « documentation
  de SQLite ». ⚠️ Pour les lots suivants : ne pas écrire « documentation officielle », « doc
  officielle », « MDN », « la spécification » ni « RFC nnnn » dans une ligne de source sans
  regénérer la page du cours `doc`.

### `pages/sql/lecon-14.html#1` — « Performance, sécurité & bonnes pratiques » (injection SQL)
- **État trouvé** : VRAI ; sujet gardé par `securite/lecon-03`.
- **Action** : remplacé par **MOVEit Transfer et l'injection SQL exploitée par CL0P** (2023).
- **Nouveau titre** : `Cas réel — MOVEit Transfer et l'injection SQL de CL0P (2023)`
- **Source ouverte** : FBI et CISA, alerte AA23-158A, 7 juin 2023 —
  https://www.cisa.gov/news-events/cybersecurity-advisories/aa23-158a (auteurs, 27 mai 2023, « previously
  unknown SQL injection », Progress Software, LEMURLOOT, `human2.aspx` / `human.aspx`, vol des
  données, compte administrateur, « Prioritize patching known exploited vulnerabilities in
  internet-facing systems »). Aucun nombre de victimes : l'alerte n'en donne pas pour MOVEit.

### `pages/sql/lecon-21.html#1` — « Dates, temps et séries temporelles »
- **État trouvé** : VRAI ; sujet (Azure, 29 février 2012) gardé par `python/lecon-17`.
- **Action** : remplacé par **le courrier bloqué d'Exchange Server au 1er janvier 2022** (fichier de
  signatures FIP-FS, « Can't convert "2201010001" to long »).
- **Nouveau titre** : `Cas réel — Le courrier bloqué d'Exchange Server (2022)`
- **Sources ouvertes** : The Exchange Team, « Email Stuck in Exchange On-premises Transport
  Queues », 1er janvier 2022, mis à jour le 11 —
  https://techcommunity.microsoft.com/blog/exchange/email-stuck-in-exchange-on-premises-transport-queues/3049447
  (l'ancienne adresse `/t5/exchange-team-blog/…/ba-p/3049447` y redirige) ; Microsoft, « Data Type
  Ranges » — https://learn.microsoft.com/en-us/cpp/cpp/data-type-ranges (`long` : 4 octets,
  jusqu'à 2 147 483 647).
- **Doute, et comment je l'ai traité** : le billet ne dit ni que le numéro de version est bâti sur
  la date, ni que la variable fait 32 bits. Le cas ne l'affirme donc pas : il cite le message
  d'erreur, écrit « le billet ne détaille pas le code », et pose seulement deux faits vérifiables
  (la borne d'un `long` chez Microsoft, et 2 201 010 001 qui la dépasse). La phrase de liaison
  parle « d'un nombre qui en imite les chiffres » : c'est la leçon, pas une affirmation sur le code
  de Microsoft. Intertitre : aucun « Cas réel » collé au-dessus de l'encadré.

### `pages/sql/lecon-24.html#1` — « Projet : un rapport analytique de bout en bout »
- **État trouvé** : VRAI ; sujet (Reinhart et Rogoff) gardé par `python/lecon-22`.
- **Action** : remplacé par **le modèle de VaR de JPMorgan Chase tenu dans des feuilles Excel
  copiées à la main** (2012), même argument : un calcul cellule par cellule se vérifie mal, une
  chaîne de requêtes se relit et se rejoue.
- **Nouveau titre** : `Cas réel — JPMorgan Chase et son modèle de risque sur tableur (2012)`
- **Source ouverte** : JPMorgan Chase & Co., « Report of JPMorgan Chase & Co. Management Task
  Force Regarding 2012 CIO Losses », 16 janvier 2013 — copie de l'université Yale,
  https://elischolar.library.yale.edu/ypfs-documents/454 (PDF lu avec `pypdf` : p. 17, 109, 124-129
  du rapport — « series of Excel spreadsheets… copying and pasting », « error prone », automatisation
  exigée pour le 31 janvier 2012 et jamais faite, « divided by their sum instead of their average »,
  « muting volatility by a factor of two »). La copie officielle (`files.shareholder.com`) répond
  403 ; le dépôt 8-K de la SEC (https://www.sec.gov/Archives/edgar/data/19617/000001961713000077/0000019617-13-000077.txt,
  ouvert) annonce le rapport sans le contenir.
- **Point d'attention** : le rapport date l'**abandon** du modèle de début mai 2012, et dit que
  l'erreur de la somme a été trouvée « following that decision », sans date. Le cas écrit « une
  fois le modèle abandonné, en mai, on y trouve… » : « en mai » porte sur l'abandon.

### `pages/react/lecon-23.html#1` — « Des formulaires robustes » (valider en couches)
- **État trouvé** : VRAI ; sujet (CRMEB) gardé par `php/lecon-16`. J'ai écarté aussi la page
  CWE-602 du MITRE, qui est la source de `php/lecon-16`.
- **Action** : remplacé par **Coinbase et l'ordre de vente accepté sans contrôle du compte source**
  (2022) : le service de validation vérifiait le solde, pas la cohérence compte/actif, et la requête
  se modifiait à la main.
- **Nouveau titre** : `Cas réel — Coinbase et l'ordre de vente mal vérifié (2022)`
- **Source ouverte** : Coinbase, « Retrospective: Recent Coinbase Bug Bounty Award », 18 février
  2022 — https://www.coinbase.com/en-fr/blog/retrospective-recent-coinbase-bug-bounty-award .
  ⚠️ L'adresse sans `en-fr` est derrière un défi Cloudflare (403) ; celle-ci répond 200 à `curl` avec
  un en-tête de navigateur (c'est là que redirige l'ancienne adresse `blog.coinbase.com`).

### `pages/react/lecon-24.html#1` — « L'accessibilité des composants »
- **État trouvé** : VRAI ; sujet (Robles contre Domino's) gardé par `html/lecon-32`. Écartés aussi :
  Target (`a11y/lecon-06`) et le rapport WebAIM Million (déjà dans `html/lecon-13`, `a11y`, `ux`).
- **Action** : remplacé par **l'audit d'accessibilité de l'éditeur Gutenberg de WordPress**
  (WPCampus et Tenon, 2019) : un HTML produit propre, mais une interface faite de composants que le
  clavier et le lecteur d'écran pilotent mal (clavier 13 défauts, focus visible 13, nom-rôle-valeur 7,
  étiquettes 5, messages d'état 4) — les sujets mêmes de la leçon.
- **Nouveau titre** : `Cas réel — L'audit d'accessibilité de l'éditeur Gutenberg (2019)`
- **Sources ouvertes** : WPCampus, 1er mai 2019 — https://wpcampus.org/blog/2019/05/gutenberg-audit-results/
  (31 200 dollars, Tenon, WordPress 5.0.3) ; https://wpcampus.org/learning/audit/ (calendrier) ;
  Tenon, « Executive Summary: Gutenberg Accessibility Audit », 2 avril 2019 —
  https://documents.wpcampus.org/gutenberg/audit/Gutenberg_Executive_Summary.pdf (PDF lu : 6 décembre
  2018, tests du 15 janvier au 1er mars 2019, 9 participants, 63 %, 90 défauts sur 16 composants,
  tableau 14 des critères WCAG, « step backwards for users with disabilities over the legacy editor »).
- Le cas ne dit pas que Gutenberg est écrit en React : la page du manuel de l'éditeur que j'ai
  ouverte ne le dit pas en toutes lettres.

### `pages/react/lecon-25.html#1` — « Animations et transitions » (`prefers-reduced-motion`)
- **État trouvé** : VRAI ; même source que `css/lecon-12` (billet WebKit de 2017), qui garde le sujet.
  Écarté aussi : iOS 7 et son réglage « Reduce Motion », déjà raconté par `css/lecon-12`.
- **Action** : remplacé par **Motion (la bibliothèque que cite la leçon) et son option
  `reducedMotion`** : `useReducedMotion` en 1.7.0 (12 décembre 2019), `MotionConfig reducedMotion`
  en 6.2.0 (21 janvier 2022), `height` et `top` bloqués en 11.16.6 (10 janvier 2025) ; en mode
  `"user"`, transformations et mise en page coupées, opacité et couleur de fond gardées.
- **Nouveau titre** : `Cas réel — Motion et son option reducedMotion (2022)`
- **Sources ouvertes** : https://raw.githubusercontent.com/motiondivision/motion/main/CHANGELOG.md
  (la page GitHub du même fichier ne se lit pas avec l'outil web ; le fichier brut, oui) ;
  https://motion.dev/docs/react-accessibility (« disable transform and layout animations, while
  preserving… opacity and backgroundColor » ; « even inducing motion sickness in some people ») ;
  https://motion.dev/docs/react (« previously Framer Motion », non cité dans le cas).

## 3. Décomptes

| cours | cas de la part | vérifiés tels quels | corrigés | remplacés | renommés « Scénario » |
|---|---:|---:|---:|---:|---:|
| `sql` | 4 | 0 | 0 | 4 | 0 |
| `react` | 3 | 0 | 0 | 3 | 0 |
| **total** | **7** | **0** | **0** | **7** | **0** |

État trouvé : 7 VRAI (contre-relus au lot 1), tous doublons d'un sujet ou d'une source d'un autre
cours. Nature des sept nouveaux cas : 3 événements datés (MOVEit, Exchange, Coinbase), 1 rapport
d'enquête (JPMorgan), 1 audit publié (Gutenberg), 2 notes de version et documentations (SQLite,
Motion). Longueur des récits : 154 à 185 mots.

## 4. Contrôles (codes de sortie, sur la copie, avant le dernier commit)

| contrôle | code |
|---|---:|
| `node tools/verif-contenu.js --cas-reel --cours=sql` (24 lus, 24 conformes) | **0** |
| `node tools/verif-contenu.js --cas-reel --cours=react` (26 lus, 26 conformes) | **0** |
| `node tools/verif-contenu.js --strict` | **0** |
| `node tools/verif-html.js` | **0** |
| `node tools/verif-domaines-interdits.js` | **0** |
| `node tools/verif-qcm-lexique.js` | **0** |
| `node tools/verif-qcm-biais.js` | **0** |
| `node tools/cas-reels/lots/lexique-diff.js D:\test-claude-dd-sql-react 8fd5290` | **0 écart** sur 7 pages |
| `node tools/doc/verif-doc.js` | **41/41** (39/41 avant le commit `4edc50e`, § 2) |
| `node tools/verif.js --rapide` | 1 (53/54 OK, 247,1 s) |

`verif.js --rapide` : le **seul rouge** est l'étape `donnees`, invariant **I18** (`search-index.js`
publié 4 314 440 o, regénéré 4 314 986 o) — l'index de recherche périmé par le nouveau texte, que
l'orchestrateur régénère après la fusion ; toléré par la consigne. Premier passage (avant `4edc50e`) :
deux rouges, `donnees` (I18) et `doc` (§ 2), corrigé.

Autres preuves : 0 CR dans les 7 pages et dans ce rapport (relu par node) ; `git diff --numstat` :
1 ligne changée par page (l'encadré seul) ; octets hors de l'encadré identiques (prouvé par
`remplacer.js` avant écriture) ; `doublons.js` : 19 → 14 sources partagées entre cours, aucune des
sept leçons parmi elles.

## 5. Ce qui reste ouvert

- **Registre des foyers** : à l'orchestrateur d'y ajouter, s'il le juge utile, les sept nouveaux
  sujets — SQLite `STRICT` (`sql/lecon-04`), MOVEit 2023 (`sql/lecon-14`), Exchange au 1er janvier
  2022 (`sql/lecon-21`), le modèle de VaR de JPMorgan (`sql/lecon-24`), Coinbase 2022
  (`react/lecon-23`), l'audit de Gutenberg (`react/lecon-24`), Motion `reducedMotion`
  (`react/lecon-25`). Le fichier `foyers.md` n'a pas été touché.
- **Hors encadré, non traité** (déjà signalé au lot 1) : le corps de `react/lecon-25` dit « on
  coupe les mouvements superflus ». Le nouveau cas (Motion garde l'opacité, coupe le mouvement) ne
  le contredit pas, mais la phrase reste plus large que ce que disent les sources.
- **Sources fragiles** : Coinbase (variante `en-fr` seule lisible sans navigateur), JPMorgan (copie
  de Yale, l'adresse officielle répond 403), journal de Motion (fichier brut de GitHub). Les trois
  s'ouvrent avec `curl` et un en-tête de navigateur.
- La contre-relecture annoncée doit confronter les sept récits à ces sources.

## 6. Commits et fusion

Branche `v18/b4-dd-sql-react`, partie de `8fd5290` :
- `55d7480` — `sql` : 4 cas remplacés ;
- `fad04c0` — `react` : 3 cas remplacés ;
- `4edc50e` — `sql/lecon-04` : ligne de source sans « documentation officielle » (verif-doc) ;
- le commit de ce rapport.

Fusion : seuls `pages/sql/lecon-04|14|21|24.html`, `pages/react/lecon-23|24|25.html` et ce rapport
changent (une ligne par page). Après fusion, régénérer les index dérivés (I18, `search-index.js`),
puis rejouer `doublons.js` et compléter `tools/cas-reels/lots/foyers.md` (§ 5).
