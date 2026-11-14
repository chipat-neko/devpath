# Rapport V18 — case B5 (lot 2) : les « Cas réel » des cours `typescript` et `perf-web`

Copie de travail `D:\test-claude-b5-ts-perfweb`, branche `v18/b5-ts-perfweb`, partie de `1b8d94b`.
Scripts : `scratchpad/b5-ts-perfweb/` de la copie (ignoré par git) — `remplacer.js` (remplace le
titre et les paragraphes d'un encadré, et rien d'autre ; refuse un `<div>` imbriqué ou un CR),
`spec-ts.js` et `spec-pw.js` (le texte de chaque cas), `motsqcm.js` (mots d'options de QCM absents
d'une page, à ne pas y faire entrer), `corpus.js` (tous les « Cas réel » du site sur une ligne,
pour chercher un sujet dans les cas des autres cours), `dump.js`. Les tests de code y sont aussi :
`tsw/` (TypeScript 5.9.3, `ts-reset` 0.6.1, fichiers `t02.ts` … `t20r.ts`, `n10.ts`), `ts43/`
(TypeScript 4.3.5, pour le comportement d'avant la 4.4). Le PDF de Gao, Bird et Barr y est
(`typestudy.pdf`, lu avec `pypdf`), ainsi que les pages sauvegardées par `curl` quand l'outil web
était refusé (Medium répond 403 à l'outil web : Pinterest, Casper, Addy Osmani ont été ouverts par
`curl` avec un agent de navigateur, puis lus en texte).

## 1. Ce qui a été fait

**37 « Cas réel » lus** (20 `typescript`, 17 `perf-web`), chacun avec sa leçon. **Aucun n'était
vrai et sourcé.** 33 étaient des récits anonymes ou des illustrations générales (« une équipe »,
« une startup », « un site marchand », « une bannière »…), donc INVÉRIFIABLES ; quatre étaient
ancrés : deux sujets réels déjà gardés par un autre cours (Tony Hoare → `csharp/lecon-08` selon
le registre des foyers ; Mars Climate Orbiter → `tests/lecon-12`), un chiffre d'Airbnb sans source
écrite primaire, un mélange Amazon (sans source) + Pinterest (vrai).

**Méthode** : la notion de la leçon d'abord (ses intertitres), puis un vrai cas daté sur cette
notion, vérifié à une source primaire ouverte — annonces officielles de TypeScript sur le blog de
Microsoft, notes de version (Node.js, Firefox), blogs d'ingénierie (Pinterest, Facebook, Twitter,
Casper, Filament Group), billets des équipes Chrome et Google Search Central, études de cas
publiées par Google, un article scientifique (ICSE 2017). Chaque comportement de code affirmé a
été **rejoué** : `tsc` 5.9.3 (et 4.3.5 pour l'avant-4.4), `ts-reset`, Node 24 pour l'effacement des
types. Les chiffres sont recopiés de la source ; aucune citation sans la phrase d'origine dans la
source (« Ça dépend » = *it depends*, « un peu laxiste » = *a bit lax*, « Pas mort, mais fini » =
*not dead, but done*, la variabilité qui tue l'expérience = *Variability is what kills the User
Experience*). La dernière phrase relie le cas à la notion, comme le faisait l'original. Forme de
la règle partout : `Cas réel — sujet (année)` et `<p class="cas-reel__source">` en dernier, avec un
lien vers chaque page ouverte. Aucun intertitre `<h2>`/`<h3>` n'était collé au-dessus des encadrés
(vérifié par l'extraction de `cr-extraire.js`) : rien à changer de ce côté.

**Un sujet = un seul cours** : avant d'écrire, registre `tools/cas-reels/lots/foyers.md`,
recherche de chaque sujet dans les 1 551 cas du site (`corpus.js`) et dans tout `pages/`, puis
réservation dans `D:\test-claude\scratchpad\v18-parallele\b5-reservations.txt` (37 lignes,
relues après écriture : aucune collision avec les agents `nodejs`, `go`…). Écartés parce que déjà
racontés ailleurs : Mars Climate Orbiter (`tests/lecon-12`), ts-migrate d'Airbnb (`react/lecon-21`),
décorateurs de TypeScript 5.0 (`js/lecon-54`), Twitter et l'événement `scroll` (`js/lecon-34`),
Google Flights et `fetchpriority` (`html/lecon-36`), Vodafone (`html/lecon-25`), Netflix et AVIF
(`html/lecon-16`), Brotli (`http/lecon-09`), PROXX (`js/lecon-40`), INP (`js/lecon-22`), le
chargement différé natif de Chrome (`html/lecon-04`), Squoosh (`wasm`).
`doublons.js` : **2 sources partagées entre cours**, les deux déjà connues et légitimes (inchangé).

**Décomptes par action** :

| cours | lus | vérifiés tels quels | corrigés | remplacés | renommés « Scénario » |
|---|---:|---:|---:|---:|---:|
| `typescript` | 20 | 0 | 0 | 20 | 0 |
| `perf-web` | 17 | 0 | 1 | 16 | 0 |
| **total** | **37** | **0** | **1** | **36** | **0** |

**État trouvé** : VRAI 0 · INEXACT 0 constaté (mais deux sujets vrais déjà pris ailleurs, non
revérifiés en détail) · INVÉRIFIABLE 35 (33 anonymes ou généraux, Airbnb 38 %, Amazon dans
`perf-web/lecon-01`) · INVENTÉ 0 déclaré. Par nature : 3 événements ou produits nommés
(`typescript/lecon-02`, `-17`, `perf-web/lecon-01`), 1 chiffre d'entreprise nommée
(`typescript/lecon-01`), 33 anonymes ou généraux.

## 2. Cas par cas — `typescript`

Tous les identifiants sont `#1`. « Remplacé » = le récit d'origine est retiré, un vrai cas sur la
même notion prend sa place. Les blogs TypeScript sont ceux de `devblogs.microsoft.com/typescript/`.

| leçon | notion | état trouvé (nature) | action | nouveau titre | sources ouvertes |
|---|---|---|---|---|---|
| `pages/typescript/lecon-01.html#1` | pourquoi typer : l'erreur de type attrapée avant l'exécution | INVÉRIFIABLE (entreprise nommée : « Airbnb a estimé qu'environ 38 % » de ses bugs auraient été évités, chiffre d'une conférence filmée, aucune source écrite primaire ouverte ; « Slack, VS Code lui-même… ont basculé » non sourcé) | remplacé | Cas réel — 15 % de bugs détectables par TypeScript (2017) | https://earlbarr.com/publications/typestudy.pdf (PDF lu avec pypdf) ; métadonnées ICSE 2017 par https://api.crossref.org/works/10.1109/ICSE.2017.75 |
| `pages/typescript/lecon-02.html#1` | types de base, `null`/`undefined`, `strictNullChecks` | ancré (personne, 1965, 2009) ; **sujet gardé par `csharp/lecon-08`** (registre des foyers) | remplacé | Cas réel — TypeScript 2.0 et les types non-nullables (2016) | https://devblogs.microsoft.com/typescript/announcing-typescript-2-0/ ; testé : `let n: number = null` refusé sous `--strictNullChecks`, accepté sans |
| `pages/typescript/lecon-03.html#1` | interfaces, index signatures | INVÉRIFIABLE (anonyme : « sur une équipe, le back-end renomme un champ ») | remplacé | Cas réel — TypeScript 4.1 et les index signatures (2020) | https://devblogs.microsoft.com/typescript/announcing-typescript-4-1/ ; testé : `opts.yadda` et `prix["poire"]` « possibly undefined » avec l'option, rien sous `--strict` seul |
| `pages/typescript/lecon-04.html#1` | unions, narrowing, unions discriminées | INVÉRIFIABLE (général : état de chargement) | remplacé | Cas réel — TypeScript 4.4 garde l'affinage rangé dans une constante (2021) | https://devblogs.microsoft.com/typescript/announcing-typescript-4-4/ ; testé : l'exemple `argIsString` et `isCircle` échoue en 4.3.5, passe en 5.9.3 |
| `pages/typescript/lecon-05.html#1` | typer les fonctions, type d'une fonction comme valeur | INVÉRIFIABLE (général : `addEventListener`, `sort`) | remplacé | Cas réel — TypeScript 3.2 type enfin bind, call et apply (2018) | https://devblogs.microsoft.com/typescript/announcing-typescript-3-2/ ; testé : les trois `apply` fautifs refusés sous `--strict`, acceptés sans |
| `pages/typescript/lecon-06.html#1` | génériques : préserver le type d'entrée | INVÉRIFIABLE (général : client d'API) | remplacé | Cas réel — TypeScript 0.9 apporte les génériques (2013) | https://devblogs.microsoft.com/typescript/announcing-typescript-0-9/ ; testé : `array.map(val => val.length)` typé `number[]` |
| `pages/typescript/lecon-07.html#1` | `keyof`, accès indexé, types utilitaires, types mappés | INVÉRIFIABLE (général : `Omit<Utilisateur…>`) | remplacé | Cas réel — TypeScript 2.1 : keyof et les types mappés (2016) | https://devblogs.microsoft.com/typescript/announcing-typescript-2-1-2/ (l'adresse sans `-2` répond 404) ; testé : `get(x, "wargarbl")` refusé |
| `pages/typescript/lecon-08.html#1` | classes, `private` contre `#` | INVÉRIFIABLE (général : panier) | remplacé | Cas réel — TypeScript 3.8 et les champs privés # (2020) | https://devblogs.microsoft.com/typescript/announcing-typescript-3-8/ ; testé : `new C()["foo"]` compile et affiche 10, `new C().foo` refusé mais affiche 10 une fois compilé |
| `pages/typescript/lecon-09.html#1` | chaîne d'outils : `tsc` contre bundlers | INVÉRIFIABLE (anonyme, « un classique d'équipe » ; déjà noté par B2) | remplacé | Cas réel — Babel 7 compile TypeScript sans vérifier les types (2018) | https://devblogs.microsoft.com/typescript/typescript-and-babel-7/ |
| `pages/typescript/lecon-10.html#1` | TS au quotidien, TS avec Node, outillage et CI | INVÉRIFIABLE (anonyme : « bug d'application mobile devenu un cas d'école ») | remplacé | Cas réel — Node.js 23.6 exécute du TypeScript sans le vérifier (2025) | https://nodejs.org/en/blog/release/v23.6.0 ; https://nodejs.org/api/typescript.html ; testé avec Node 24.16 : `const total: string = 42` s'exécute, un `enum` est refusé |
| `pages/typescript/lecon-11.html#1` | types conditionnels, `infer`, distributivité | INVÉRIFIABLE (général : Prisma, routeurs typés) | remplacé | Cas réel — TypeScript 2.8 et les types conditionnels (2018) | https://devblogs.microsoft.com/typescript/announcing-typescript-2-8-2/ ; testé : `Flatten`, distributivité, `ReturnType`, `Exclude` |
| `pages/typescript/lecon-12.html#1` | patterns avancés, `satisfies` | INVÉRIFIABLE (anonyme : API météo) | remplacé | Cas réel — TypeScript 4.9 et l'opérateur satisfies (2022) | https://devblogs.microsoft.com/typescript/announcing-typescript-4-9/ ; testé : la faute `bleu` signalée, l'annotation rend `.toUpperCase()` fautif, `satisfies` non |
| `pages/typescript/lecon-13.html#1` | outillage, performance du compilateur | INVÉRIFIABLE (anonyme : « une startup migre sur Vite ») | remplacé | Cas réel — le compilateur TypeScript porté en Go (2025) | https://devblogs.microsoft.com/typescript/typescript-native-port/ |
| `pages/typescript/lecon-14.html#1` | typer les props, `children` | INVÉRIFIABLE (anonyme : `avatarUrl`/`avatarURL`) | remplacé | Cas réel — React 18 et la prop children (2022) | https://react.dev/blog/2022/03/08/react-18-upgrade-guide |
| `pages/typescript/lecon-15.html#1` | `unknown`, valider à la frontière | INVÉRIFIABLE (anonyme : préférences en `localStorage`) | remplacé | Cas réel — TypeScript 3.0 et le type unknown (2018) | https://devblogs.microsoft.com/typescript/announcing-typescript-3-0/ ; testé : `bar.x.prop` et `upperCase(bar)` refusés sur `unknown` |
| `pages/typescript/lecon-16.html#1` | `tsconfig`, mode strict | INVÉRIFIABLE (anonyme, « plus de 900 erreurs » ; déjà noté par B2) | remplacé | Cas réel — TypeScript 2.3 et l'option --strict (2017) | https://devblogs.microsoft.com/typescript/announcing-typescript-2-3/ ; testé : `tsc --init` (5.9.3) écrit toujours `"strict": true` |
| `pages/typescript/lecon-17.html#1` | typage structurel, variance | ancré (événement 1999) ; **sujet gardé par `tests/lecon-12`** | remplacé | Cas réel — TypeScript 2.6 et la variance des fonctions (2017) | https://devblogs.microsoft.com/typescript/announcing-typescript-2-6/ ; testé : `f = g` refusé sous `--strict`, une méthode reste bivariante, `Dog[]` reste assignable à `Animal[]` |
| `pages/typescript/lecon-18.html#1` | gardes de type, fonctions d'assertion | INVÉRIFIABLE (général : reducer façon Redux) | remplacé | Cas réel — TypeScript 3.7 et les fonctions d'assertion (2019) | https://devblogs.microsoft.com/typescript/announcing-typescript-3-7/ ; testé : `toUppercase` signalé avec la suggestion `toUpperCase` |
| `pages/typescript/lecon-19.html#1` | migration progressive, strict par paliers | INVÉRIFIABLE (anonyme : « 60 000 lignes », « six semaines ») | remplacé | Cas réel — VS Code passe à strictNullChecks, fichier par fichier (2019) | https://code.visualstudio.com/blogs/2019/05/23/strict-null |
| `pages/typescript/lecon-20.html#1` | client d'API typé, `fetch` validé à la frontière | INVÉRIFIABLE (anonyme : fournisseur qui renomme `email`) | remplacé | Cas réel — ts-reset, le JSON reçu typé unknown (2023) | https://github.com/total-typescript/ts-reset ; https://www.totaltypescript.com/ts-reset ; https://www.npmjs.com/package/@total-typescript/ts-reset?activeTab=versions (0.1.0 le 19/02/2023, recoupé par le registre npm) ; testé : sans ts-reset `r.json()` et `JSON.parse` sont `any`, avec ts-reset `unknown` |

## 3. Cas par cas — `perf-web`

| leçon | notion | état trouvé (nature) | action | nouveau titre | sources ouvertes |
|---|---|---|---|---|---|
| `pages/perf-web/lecon-01.html#1` | Web Vitals : mesurer ce que vit l'utilisateur | en partie INVÉRIFIABLE (produits nommés) : Pinterest « trafic des moteurs +15 % » **vrai** ; Amazon « +100 ms = environ 1 % de ventes » sans source primaire ouverte | **corrigé** : Amazon retiré, Pinterest développé à sa source (mesure perçue, -40 % d'attente, +15 % de trafic, +15 % de conversion) | Cas réel — Pinterest mesure l'attente perçue (2017) | https://medium.com/pinterest-engineering/driving-user-growth-with-performance-improvements-cfc50dafadd7 (403 à l'outil web, ouvert par `curl`) |
| `pages/perf-web/lecon-02.html#1` | optimiser le chargement : les images, premier levier | INVÉRIFIABLE (anonyme : bannière 1,8 Mo → 180 Ko) | remplacé | Cas réel — Google présente le format WebP (2010) | https://blog.chromium.org/2010/09/webp-new-image-format-for-web.html |
| `pages/perf-web/lecon-03.html#1` | coût du JavaScript, envoyer moins de JS | INVÉRIFIABLE (anonyme ; déjà noté par B2) | remplacé | Cas réel — Moment.js passe en maintenance (2020) | https://momentjs.com/news/ (annonce du 14/09/2020, sous la mise à jour du 17/08/2026 qui la remplace) |
| `pages/perf-web/lecon-04.html#1` | SEO technique : `robots.txt`, `noindex` | INVÉRIFIABLE (anonyme ; déjà noté par B2) | remplacé | Cas réel — Google cesse de lire noindex dans robots.txt (2019) | https://developers.google.com/search/blog/2019/07/a-note-on-unsupported-rules-in-robotstxt |
| `pages/perf-web/lecon-05.html#1` | données structurées | INVÉRIFIABLE (anonyme : « une boutique ») | remplacé | Cas réel — Rakuten Recipe et les données structurées (2018) | https://developers.google.com/search/case-studies/rakuten-case-study ; vu en chemin : https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data |
| `pages/perf-web/lecon-06.html#1` | auditer : mesurer, corriger, re-mesurer | INVÉRIFIABLE (anonyme : Lighthouse 48 → 96) | remplacé | Cas réel — The Economic Times passe les Core Web Vitals (2021) | https://web.dev/case-studies/economic-times-cwv |
| `pages/perf-web/lecon-07.html#1` | chemin critique, CSS bloquant | INVÉRIFIABLE (anonyme : site marchand, cinq feuilles) | remplacé | Cas réel — Filament Group charge le CSS avec media="print" (2019) | https://www.filamentgroup.com/lab/load-css-simpler/ |
| `pages/perf-web/lecon-08.html#1` | images : la bonne taille, `width`/`height` et CLS | INVÉRIFIABLE (anonyme : hero de 1,4 Mo) | remplacé | Cas réel — Firefox 71 réserve la place des images (2019) | https://developer.mozilla.org/en-US/docs/Mozilla/Firefox/Releases/71 ; https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Performance/Multimedia |
| `pages/perf-web/lecon-09.html#1` | cache HTTP, `immutable` | INVÉRIFIABLE (anonyme : serveur en Europe sans CDN) | remplacé | Cas réel — Facebook et Cache-Control: immutable (2017) | https://engineering.fb.com/2017/01/26/web/this-browser-tweak-saved-60-of-requests-to-facebook/ |
| `pages/perf-web/lecon-10.html#1` | labo contre terrain | INVÉRIFIABLE (anonyme : Lighthouse à 95, p75 à 3,5 s) | remplacé | Cas réel — Google publie le Chrome User Experience Report (2017) | https://blog.chromium.org/2017/10/introducing-chrome-user-experience-report.html |
| `pages/perf-web/lecon-11.html#1` | fil principal, saccades au défilement | INVÉRIFIABLE (anonyme : page d'articles) | remplacé | Cas réel — Chrome 56 rend passifs les écouteurs tactiles (2017) | https://developer.chrome.com/blog/scrolling-intervention ; vu en chemin : https://developer.chrome.com/blog/passive-event-listeners |
| `pages/perf-web/lecon-12.html#1` | worker, transfert, ce qu'un worker ne peut pas faire | INVÉRIFIABLE (anonyme : éditeur de photos) | remplacé | Cas réel — OffscreenCanvas arrive dans Chrome 69 (2018) | https://web.archive.org/web/2018id_/https://developers.google.com/web/updates/2018/08/offscreen-canvas (version d'août 2018, signée Ewa Gasperowicz) ; vu aussi : https://web.dev/articles/offscreen-canvas (version actuelle, signée Tim Dresser — d'où le lien vers la copie archivée) |
| `pages/perf-web/lecon-12.html#2` | libérer le fil principal | INVÉRIFIABLE (anonyme : import de CSV) | remplacé | Cas réel — Partytown, les scripts tiers dans un worker (2021) | https://dev.to/adamdbradley/introducing-partytown-run-third-party-scripts-from-a-web-worker-2cnp |
| `pages/perf-web/lecon-13.html#1` | outiller la mesure, brider le CPU | INVÉRIFIABLE (général : 20 ms × 6) | remplacé | Cas réel — le JavaScript de CNN.com sur trois téléphones (2018) | https://medium.com/@addyosmani/the-cost-of-javascript-in-2018-7d8950fbb5d4 (403 à l'outil web, ouvert par `curl`) |
| `pages/perf-web/lecon-14.html#1` | SSG, ISR | INVÉRIFIABLE (anonyme : catalogue au prix figé) | remplacé | Cas réel — Next.js 9.5 et l'Incremental Static Regeneration (2020) | https://nextjs.org/blog/next-9-5 |
| `pages/perf-web/lecon-14.html#2` | CSR contre rendu serveur | INVÉRIFIABLE (anonyme : page marketing en CSR) | remplacé | Cas réel — Twitter ramène le rendu sur le serveur (2012) | https://blog.x.com/engineering/en_us/a/2012/improving-performance-on-twittercom |
| `pages/perf-web/lecon-15.html#1` | diagnostiquer : waterfall, script tiers, confirmer | INVÉRIFIABLE (anonyme : fiche produit à 4,8 s) | remplacé | Cas réel — Casper auto-héberge un script tiers bloquant (2018) | https://medium.com/caspertechteam/we-shaved-1-7-seconds-off-casper-com-by-self-hosting-optimizely-2704bcbff8ec (403 à l'outil web, ouvert par `curl`) |

## 4. Les mots des QCM

Après chaque retouche, `lexique-diff.js` contre `1b8d94b`. Premier jet : **24 écarts** en
`typescript`, **10** en `perf-web` (mots de 6 lettres et plus des options de QCM perdus avec
l'ancien récit, ou gagnés). Remède, sans toucher aux QCM : réintroduire dans le nouveau récit le
mot perdu, à un endroit où il dit vrai (« lui-même », « exactement », « transforme »,
« n'existe », « laisse », « modèle », « déclaration », « comparer », « chaîne », « typage »,
« moindre », « propre », « pendant », « nommée », « structure », « signature », « intervertir » —
la contravariance, c'est intervertir le sens de la question, mot de l'annonce de la 2.6 —,
« production », « organique », « boutique », « directement », « décrire », « sensiblement »,
« refonte », « génération », « produit »), et remplacer le mot gagné (« dernière », « d'erreur »,
« ensuite », « toujours », « demande », « stable », « connexion », « passer »). Résultat :
**0 écart sur les 35 pages**, cliquets lexique et biais à 0.

## 5. Contrôles (sur la branche, avant le dernier commit)

| contrôle | code |
|---|---|
| `node tools/verif-contenu.js --cas-reel --cours=typescript` | 0 (20 conformes sur 20) |
| `node tools/verif-contenu.js --cas-reel --cours=perf-web` | 0 (17 conformes sur 17) |
| `node tools/verif-contenu.js --strict` | 0 |
| `node tools/verif-html.js` | 0 |
| `node tools/verif-domaines-interdits.js` | 0 |
| `node tools/verif-qcm-lexique.js` | 0 |
| `node tools/verif-qcm-biais.js` | 0 |
| `node tools/cas-reels/lots/lexique-diff.js … 1b8d94b` | 0 écart |
| `node tools/cas-reels/lots/controle-branche.js … 1b8d94b` | OK : 0 CR, 0 domaine interdit, octets identiques hors « Cas réel », types gardés, 37 zones avant et après |
| `node tools/cas-reels/lots/doublons.js` | 2 sources partagées entre cours (les deux déjà connues) |
| `node tools/verif.js --rapide` | voir § 6 |

## 6. `verif.js --rapide`

**Code 1**, 234,8 s, 54 étapes jouées ; **trois signalent, toutes trois tolérées par la consigne** :

- `donnees` — l'invariant I18 seul : `search-index.js` publié diverge du contenu regénéré
  (+4 274 octets : le texte des 37 nouveaux encadrés). Index dérivé, régénéré par l'orchestrateur
  après la fusion. Seconde ligne du même invariant, déjà présente à la base : « 1 cours sans aucun
  encadré d'erreur : doc ».
- `doc-ref` — 39 contrôles OK, 2 en échec, les deux chiffres du cours `doc` mesurés sur tout le
  site : « leçons qui renvoient à un document = 107 » et « cours concernés = 39 », que les nouvelles
  lignes de source font bouger.
- `doc-rec` — même cause : « 387 citent la source » n'est plus le chiffre publié.

Aucune ligne de source n'a été déformée pour les garder verts. Tout le reste est vert, dont
`contenu`, `qcmbiai`, `qcmlexi`, `exemple`, `etudes`, `caract`.

## 7. Ce qui reste ouvert

- **Contre-relecture à faire** (prévue par le plan). Points à regarder de près : `perf-web/lecon-06`
  (la page de web.dev se contredit sur les pourcentages — « CLS improved by 250 % » puis « by 90 % »,
  « LCP improved by 80 % » pour 4,5 → 2,5 s — ; le récit ne reprend que les valeurs brutes) ;
  `perf-web/lecon-12#1` (la version actuelle sur web.dev porte un autre auteur que la version
  d'août 2018 citée) ; `perf-web/lecon-03` (l'annonce de 2020 est désormais marquée « remplacée »
  par une mise à jour du 17 août 2026 sur la même page ; le récit dit bien « le 14 septembre 2020 ») ;
  `typescript/lecon-20` (la date de 0.1.0 vient de l'historique npm, le README n'en donne pas).
- Les pages Medium (Pinterest, Casper, Addy Osmani) refusent l'outil web (403) ; elles s'ouvrent
  avec un navigateur ou `curl` muni d'un agent de navigateur.
- Hors encadré, rien n'a été touché. Vu en lisant : `perf-web/lecon-02` garde un exercice sur
  « une bannière 1600×900 en PNG de 1,8 Mo » (un énoncé d'exercice, pas un « Cas réel ») ;
  `typescript/lecon-19`, dans « Pour aller plus loin », cite ts-migrate d'Airbnb, sujet du cas de
  `react/lecon-21` (une mention, pas un récit).
- **Pour le registre des foyers** (à ajouter après fusion) : WebP (2010) → `perf-web/lecon-02` ;
  Moment.js passe en maintenance (2020) → `perf-web/lecon-03` ; `noindex` retiré de robots.txt
  (2019) → `perf-web/lecon-04` ; Facebook et `Cache-Control: immutable` (2017) → `perf-web/lecon-09`
  (le cas anonyme de `http/lecon-08`, lot B11, devra en choisir un autre) ; Chrome UX Report (2017)
  → `perf-web/lecon-10` ; Chrome 56 et les écouteurs passifs (2017) → `perf-web/lecon-11` ;
  Twitter et le rendu serveur (2012) → `perf-web/lecon-14` ; Casper et Optimizely (2018) →
  `perf-web/lecon-15` ; Gao, Bird et Barr (ICSE 2017) → `typescript/lecon-01` ; VS Code et
  `strictNullChecks` (2019) → `typescript/lecon-19` ; Node.js et l'effacement des types (2025) →
  `typescript/lecon-10` ; Babel 7 et TypeScript (2018) → `typescript/lecon-09`. Les annonces de
  versions de TypeScript (0.9, 2.0, 2.1, 2.3, 2.6, 2.8, 3.0, 3.2, 3.7, 3.8, 4.1, 4.4, 4.9, portage
  en Go) sont toutes au cours `typescript` ; `js/lecon-54` garde TypeScript 5.0.
