# Rapport V18 — case B4 (lot 1) : les « Cas réel » du cours `javascript`

Copie de travail `D:\test-claude-b4-js`, branche `v18/b4-js`, partie de `a244d0f`.
Portée : les **66 « Cas réel »** du cours `javascript` (`pages/js/lecon-01` à `lecon-65` :
65 encadrés `callout--note`, dont deux dans la leçon 04, et une section `<h2>` dans la leçon 55).
Scripts de travail : `scratchpad/b4-js/` de la copie (ignoré par git) — `dump.js` (lecture des
cas), `src.py` (lecture des sources : téléchargement puis contexte des mots-clés), `cas-a.js` et
`cas-b.js` (les nouveaux textes), `appliquer.js` (remplacement exact de chaque encadré, avec
contrôle que la région remplacée ne contient que des paragraphes), `retouches.js` (8 retouches de
relecture, plus 6 corrections faites à la main : trois titres « ES2020/ES2025 » dont l'année
n'était pas reconnue par `\b`, deux opérateurs mis en `<code>` dans un titre, le titre exact de
la page Node.js 15), `gen-rapport.js` (le tableau ci-dessous). Les anciens textes sont gardés dans
`scratchpad/b4-js/anciens.json`.

## Méthode

1. Lecture de chaque cas **et** des intertitres de sa leçon (notion enseignée).
2. Chaque affirmation d'un cas ancré (sujet nommé) confrontée à une source **ouverte** :
   téléchargement de la page (`curl`), puis lecture du texte autour des mots-clés ; un PDF lu avec
   `pypdf` (rapport CrowdStrike, ECMA-402, avis de l'ICO) ; un PDF scanné illisible (rapport du GAO
   sur le Patriot) a fait **abandonner** ce sujet plutôt que de le citer sans l'avoir lu.
3. Cas anonyme, général ou non sourçable → **remplacé** par un vrai cas daté, sur la même notion,
   à source primaire (post-mortem, blog d'ingénierie officiel, documentation officielle, norme,
   décision d'un régulateur, note de version). Aucun sujet repris deux fois dans le cours
   (les doublons Vue 3 des leçons 45 et 65 ont été retirés).
4. Forme de la règle : `Cas réel — sujet (année)` + `<p class="cas-reel__source">` en dernier
   paragraphe, liens vers les documents ouverts. Les chiffres calculés (et non tirés d'une
   source) ont été vérifiés avec Node : `850 * 77.1` → `65534.99999999999` (leçon 14) ;
   `new Date(2012, 1, 29)` puis `setFullYear(2013)` → 1<sup>er</sup> mars 2013 (leçon 15).
5. Sources : primaires partout ; quatre pages lues **par leur copie archivée** (Wayback Machine)
   parce que l'original a disparu ou bloque les robots — Excel 2007 (blogs.msdn.com), YUI (2007),
   Meteor (2013, page Medium bloquée par Cloudflare), avis de sanction de l'ICO (PDF hors ligne) ;
   deux pages archivées servent à **dater** une page sans date (React « Composition vs
   Inheritance » le 3 novembre 2016, GOV.UK « Recover from validation errors » le 11 mai 2020).
   Le rapport d'enquête d'Ariane 501 est lu dans sa copie intégrale hébergée par l'université du
   Minnesota (son en-tête donne l'adresse d'origine sur le site de l'ESRIN de l'ESA) ; le communiqué de l'ESA n° 33-1996
   en confirme la conclusion. Aucune source de presse.

## Ce qui a été touché hors des encadrés (à signaler)

- `pages/js/lecon-55.html` : la section « Cas réel » est un `<h2>` : son **intertitre** est passé
  de « Cas réel : lire un en-tête de fichier » à « Cas réel — l'en-tête d'un fichier PNG (norme
  W3C, 2025) », son paragraphe d'introduction rattache chaque fait à la norme PNG, et une ligne
  `cas-reel__source` est ajoutée **après** la légende du code (fin de la section). Le code et sa
  légende sont intacts. Aucune autre page ne cite l'ancien intertitre.
- Les intertitres `<h2>` qui **enveloppent** un encadré (leçons 38, 40, 41, 42) n'ont pas été
  touchés : les nouveaux cas restent sur leur sujet (« la réactivité de Vue 3 », « garder 60 images
  par seconde », « parcourir une API paginée », « le thème de ce site »).
- Aucun QCM, aucun `data-*`, aucun index dérivé touché.

## Cas par cas

État trouvé : VRAI / INEXACT (quoi) / INVÉRIFIABLE, et nature. Action : vérifié / corrigé /
remplacé par. Les URL sont celles **ouvertes** pendant la vérification (chaque cas cite les
mêmes dans sa ligne de source).

| identifiant | état trouvé | nature | action | nouveau titre | sources ouvertes |
|---|---|---|---|---|---|
| `pages/js/lecon-01.html#1` | INVÉRIFIABLE | général (la console, outil quotidien) | remplacé par : alerte self-XSS « allow pasting » de Chrome 120 | Cas réel — l'alerte « allow pasting » de Chrome (2023) | <https://developer.chrome.com/blog/new-in-devtools-120> |
| `pages/js/lecon-02.html#1` | INVÉRIFIABLE | général (saisie "25" + 3, vrai mais sans sujet) | remplacé par : typeof null (MDN) | Cas réel — typeof null (1995) | <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/typeof><br><https://developer.mozilla.org/en-US/docs/Glossary/JavaScript> |
| `pages/js/lecon-03.html#1` | INVÉRIFIABLE | général (modulo, tableau zébré, carrousel) | remplacé par : l'opérateur ** (ES2016, TC39 + MDN) | Cas réel — l'opérateur ** entre dans JavaScript (2016) | <https://github.com/tc39/proposal-exponentiation-operator><br><https://github.com/tc39/proposals/blob/main/finished-proposals.md><br><https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Exponentiation> |
| `pages/js/lecon-04.html#1` | INEXACT : « si nonLus vaut 0, rien ne s'affiche » — React affiche le 0 (piège documenté) | produit nommé (React) | corrigé : le piège du 0 avec &&, sourcé à react.dev | Cas réel — le « 0 » qui s'affiche dans React (2023) | <https://react.dev/learn/conditional-rendering><br><https://react.dev/blog/2023/03/16/introducing-react-dev> |
| `pages/js/lecon-04.html#2` | INVÉRIFIABLE | récit d'illustration (réglage de volume), technique juste | remplacé par : la proposition TC39 ?? (ES2020) | Cas réel — l'opérateur ?? (ECMAScript 2020) | <https://github.com/tc39/proposal-nullish-coalescing><br><https://github.com/tc39/proposals/blob/main/finished-proposals.md> |
| `pages/js/lecon-05.html#1` | INVÉRIFIABLE (B2 : INVÉRIFIABLE) | général (panier) | remplacé par : Cloudbleed, Cloudflare 2017 | Cas réel — Cloudbleed, la fin de tampon ratée (2017) | <https://blog.cloudflare.com/incident-report-on-memory-leak-caused-by-cloudflare-parser-bug/> |
| `pages/js/lecon-06.html#1` | INVÉRIFIABLE | anonyme (« une boutique en ligne ») | remplacé par : paramètres par défaut d'ES2015 (ECMA-262 + MDN) | Cas réel — les paramètres par défaut d'ES2015 (2015) | <https://262.ecma-international.org/5.1/><br><https://262.ecma-international.org/6.0/><br><https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Default_parameters> |
| `pages/js/lecon-07.html#1` | INVÉRIFIABLE | général (panier = tableau) | remplacé par : Change Array by Copy (ES2023) | Cas réel — les copies de tableau d'ES2023 (2023) | <https://github.com/tc39/proposal-change-array-by-copy><br><https://github.com/tc39/proposals/blob/main/finished-proposals.md> |
| `pages/js/lecon-08.html#1` | INVÉRIFIABLE : « la logique derrière une liste de résultats d'Amazon » sans source | général + produit nommé non sourcé | remplacé par : le tri stable de V8 7.0 (2018) | Cas réel — le tri devient stable dans V8 (2018) | <https://v8.dev/blog/array-sort> |
| `pages/js/lecon-09.html#1` | INVÉRIFIABLE : « des milliards de fois par jour » sans source | général | remplacé par : JSON et la RFC 8259 (2017) | Cas réel — JSON et la RFC 8259 (2017) | <https://www.rfc-editor.org/rfc/rfc8259.html> |
| `pages/js/lecon-10.html#1` | INVÉRIFIABLE | général (fil d'actualité) | remplacé par : GitHub retire jQuery (2018) | Cas réel — GitHub se passe de jQuery (2018) | <https://github.blog/engineering/engineering-principles/removing-jquery-from-github-frontend/> |
| `pages/js/lecon-11.html#1` | INVÉRIFIABLE | anonyme (« une boutique en ligne ») | remplacé par : la délégation d'événements de React 17 (2020) | Cas réel — la délégation d'événements de React (2020) | <https://legacy.reactjs.org/blog/2020/08/10/react-v17-rc.html> |
| `pages/js/lecon-12.html#1` | INVÉRIFIABLE (sauf la phrase sur le thème du site, vraie) | général | remplacé par : Mozilla Hacks sur localStorage (2012) | Cas réel — Mozilla et la lenteur de localStorage (2012) | <https://hacks.mozilla.org/2012/03/there-is-no-simple-solution-for-local-storage/> |
| `pages/js/lecon-13.html#1` | INVÉRIFIABLE | général (barre de recherche, slugs) | remplacé par : left-pad (npm, 2016) et padStart (ES2017) | Cas réel — left-pad (2016) | <https://blog.npmjs.org/post/141577284765/kik-left-pad-and-npm><br><https://www.npmjs.com/package/left-pad><br><https://github.com/tc39/proposals/blob/main/finished-proposals.md> |
| `pages/js/lecon-14.html#1` | INVÉRIFIABLE (titre « 0,30 € de trop » sans rapport avec le texte) | anonyme (« une boutique en ligne ») | remplacé par : le bug d'affichage d'Excel 2007 | Cas réel — le bug d'affichage d'Excel 2007 (2007) | <https://web.archive.org/web/20071006040406/http://blogs.msdn.com:80/excel/archive/2007/09/25/calculation-issue-update.aspx><br><https://learn.microsoft.com/en-us/archive/blogs/nickmac/fix-for-issue-in-excel-2007-involving-calculation-of-numbers-around-65535> |
| `pages/js/lecon-15.html#1` | INVÉRIFIABLE (mécanisme UTC exact) | anonyme (« une application ») | remplacé par : la panne d'Azure du 29 février 2012 | Cas réel — la panne d'Azure du 29 février (2012) | <https://azure.microsoft.com/en-us/blog/summary-of-windows-azure-service-disruption-on-feb-29th-2012/> |
| `pages/js/lecon-16.html#1` | INVÉRIFIABLE | anonyme (« un site marchand ») | remplacé par : le module pattern du blog YUI (2007) | Cas réel — le « module pattern » de Yahoo! (2007) | <https://web.archive.org/web/20080124051246/http://yuiblog.com:80/blog/2007/06/12/module-pattern> |
| `pages/js/lecon-17.html#1` | VRAI pour l'essentiel ; « recopiée dans des milliers de constructeurs » et la phrase sur les Hooks sans source | produit nommé (React) | corrigé : généralités retirées, daté (React 0.13, 2015), sourcé | Cas réel — React et les classes ES6 (2015) | <https://legacy.reactjs.org/blog/2015/01/27/react-v0.13.0-beta-1.html><br><https://legacy.reactjs.org/docs/handling-events.html> |
| `pages/js/lecon-18.html#1` | INVÉRIFIABLE : l'implémentation de Reddit et Hacker News n'est pas documentée | produits nommés non sourcés | remplacé par : les appels terminaux de WebKit (2016) | Cas réel — les appels terminaux dans WebKit (2016) | <https://webkit.org/blog/6240/ecmascript-6-proper-tail-calls-in-webkit/> |
| `pages/js/lecon-19.html#1` | VRAI pour l'essentiel ; « des milliers de sites » non sourcé (la FAQ dit « de nombreux sites en production »), mécanisme simplifié | événement daté | corrigé : mécanisme exact (non-énumérabilité, copie for…in), sourcé | Cas réel — le « SmooshGate » (2018) | <https://developer.chrome.com/blog/smooshgate> |
| `pages/js/lecon-20.html#1` | VRAI mais non daté ; « même les éléments natifs fonctionnent exactement sur ce principe » non sourcé | produit nommé (Web Components, Lit) | corrigé : daté (Custom Elements v1, Chrome 54, 2016), Lit et la phrase sur les éléments natifs retirés | Cas réel — les Custom Elements v1 (2016) | <https://blog.chromium.org/2016/09/chrome-54-beta-custom-elements-v1.html><br><https://web.dev/articles/custom-elements-v1> |
| `pages/js/lecon-21.html#1` | VRAI (chaîne d'héritage du DOM) mais général, sans date ni document | général | remplacé par : la recommandation « composition plutôt qu'héritage » de React (2016) | Cas réel — React préfère la composition (2016) | <https://legacy.reactjs.org/docs/composition-vs-inheritance.html><br><https://web.archive.org/web/20161103110849/https://facebook.github.io/react/docs/composition-vs-inheritance.html> |
| `pages/js/lecon-22.html#1` | INVÉRIFIABLE | anonyme (« un tableau de bord ») | remplacé par : INP devient Core Web Vital (2024) | Cas réel — INP, la réactivité mesurée par Google (2024) | <https://web.dev/blog/inp-cwv-march-12><br><https://web.dev/articles/inp> |
| `pages/js/lecon-23.html#1` | INVÉRIFIABLE (B2 : INVÉRIFIABLE) | anonyme (« une fiche produit ») | remplacé par : Promise.allSettled (V8, 2019 ; ES2020) | Cas réel — Promise.allSettled (ECMAScript 2020) | <https://v8.dev/features/promise-combinators> |
| `pages/js/lecon-24.html#1` | INVÉRIFIABLE (B2 : INVÉRIFIABLE) | anonyme (« un formulaire d'inscription ») | remplacé par : fetch et les codes d'erreur HTTP (web.dev 2015, MDN) | Cas réel — fetch et les codes d'erreur HTTP (2015) | <https://web.dev/articles/introduction-to-fetch><br><https://developer.mozilla.org/en-US/docs/Web/API/Window/fetch> |
| `pages/js/lecon-25.html#1` | INVÉRIFIABLE | anonyme (« une boutique en ligne ») | remplacé par : Ariane 5, vol 501 (rapport Lions, 1996) | Cas réel — Ariane 5, vol 501 (1996) | <https://www-users.cse.umn.edu/~arnold/disasters/ariane5rep.html> |
| `pages/js/lecon-26.html#1` | INVÉRIFIABLE | général (npm, React, Vite) | remplacé par : les modules ES dans tous les navigateurs (V8, 2018) | Cas réel — les modules ES dans tous les navigateurs (2018) | <https://v8.dev/features/modules> |
| `pages/js/lecon-27.html#1` | INVÉRIFIABLE | général (pattern, recherche, journaux) | remplacé par : la panne de Cloudflare du 2 juillet 2019 | Cas réel — la panne mondiale de Cloudflare (2019) | <https://blog.cloudflare.com/details-of-the-cloudflare-outage-on-july-2-2019/> |
| `pages/js/lecon-28.html#1` | INVÉRIFIABLE | général (visiteurs uniques) | remplacé par : les méthodes de Set (ES2025) | Cas réel — les nouvelles méthodes de Set (ECMAScript 2025) | <https://github.com/tc39/proposal-set-methods><br><https://github.com/tc39/proposals/blob/main/finished-proposals.md> |
| `pages/js/lecon-29.html#1` | VRAI (B2 : VRAI) | produit nommé (React) | vérifié, daté et sourcé (react.dev, 2023) ; texte resserré sur la doc | Cas réel — la doc de React sur les tableaux d'état (2023) | <https://react.dev/learn/updating-arrays-in-state><br><https://react.dev/reference/react/useState><br><https://react.dev/blog/2023/03/16/introducing-react-dev> |
| `pages/js/lecon-30.html#1` | INVÉRIFIABLE : « VS Code ou React » sans source | général (CI) | remplacé par : la panne CrowdStrike (2024) | Cas réel — la panne CrowdStrike (2024) | <https://www.crowdstrike.com/wp-content/uploads/2024/08/Channel-File-291-Incident-Root-Cause-Analysis-08.06.2024.pdf> |
| `pages/js/lecon-31.html#1` | INVÉRIFIABLE : « l'architecture de milliers d'applications » sans source | général (React/Redux) | remplacé par : Flux, Facebook (2014) | Cas réel — Facebook et l'architecture Flux (2014) | <https://legacy.reactjs.org/blog/2014/05/06/flux.html><br><https://facebookarchive.github.io/flux/docs/in-depth-overview> |
| `pages/js/lecon-32.html#1` | INVÉRIFIABLE : « Gmail et la plupart des webmails » sans source | anonyme + produit non sourcé | remplacé par : Safari efface le stockage au bout de 7 jours (WebKit, 2020) | Cas réel — Safari efface le stockage au bout de sept jours (2020) | <https://webkit.org/blog/10218/full-third-party-cookie-blocking-and-more/> |
| `pages/js/lecon-33.html#1` | INVÉRIFIABLE | anonyme (« un formulaire de commande ») | remplacé par : GOV.UK désactive la validation HTML5 (2020) | Cas réel — GOV.UK désactive la validation HTML5 (2020) | <https://design-system.service.gov.uk/patterns/validation/><br><https://web.archive.org/web/20200511072946/https://design-system.service.gov.uk/patterns/validation/> |
| `pages/js/lecon-34.html#1` | INVÉRIFIABLE | anonyme (« une barre de recherche ») | remplacé par : Twitter et l'événement scroll (John Resig, 2011) | Cas réel — Twitter et l'événement scroll (2011) | <https://johnresig.com/blog/learning-from-twitter/> |
| `pages/js/lecon-35.html#1` | INVÉRIFIABLE | anonyme (« un tableau de bord ») | remplacé par : React et la réconciliation (2013) | Cas réel — React et la réconciliation (2013) | <https://legacy.reactjs.org/blog/2013/06/05/why-react.html> |
| `pages/js/lecon-36.html#1` | INVÉRIFIABLE : implémentations de GitHub, Google Maps, Gmail non documentées | produits nommés non sourcés | remplacé par : la race condition décrite par react.dev (2023) | Cas réel — la « race condition » décrite par React (2023) | <https://react.dev/learn/you-might-not-need-an-effect><br><https://react.dev/blog/2023/03/16/introducing-react-dev> |
| `pages/js/lecon-37.html#1` | INVÉRIFIABLE | général (Netlify, Vercel) | remplacé par : le post-mortem d'is-promise (2020) | Cas réel — la mise à jour cassée d'is-promise (2020) | <https://medium.com/@forbeslindesay/is-promise-post-mortem-cab807f18dcc> |
| `pages/js/lecon-38.html#1` | VRAI pour l'essentiel ; « plus simple et plus fiable » non sourcé | produit nommé (Vue) | corrigé : retrait, daté (Vue 3.0, 18/09/2020), sourcé aux docs Vue 2 et Vue 3 | Cas réel — Vue 3 passe au Proxy (2020) | <https://v2.vuejs.org/v2/guide/reactivity.html><br><https://vuejs.org/guide/extras/reactivity-in-depth.html><br><https://github.com/vuejs/core/releases/tag/v3.0.0> |
| `pages/js/lecon-39.html#1` | INVÉRIFIABLE : « les conventions de 200 pays » sans source | anonyme (« une boutique en ligne ») | remplacé par : ECMA-402, 1re édition (2012) | Cas réel — la naissance de l'API Intl (ECMA-402, 2012) | <https://ecma-international.org/wp-content/uploads/ECMA-402_1st_edition_december_2012.pdf> |
| `pages/js/lecon-40.html#1` | INVÉRIFIABLE : « Figma applique des filtres et des exports dans des workers » introuvable dans les écrits de Figma | produit nommé non sourcé | remplacé par : PROXX, Google (web.dev, 2019) | Cas réel — PROXX, un jeu qui reste fluide (2019) | <https://web.dev/articles/off-main-thread> |
| `pages/js/lecon-41.html#1` | INEXACT : Stripe ne renvoie pas « un lien vers la page suivante » (curseurs has_more/starting_after) ; « ce que font les SDK officiels » sans source | produits nommés | corrigé : recentré sur Stripe et son auto-pagination (stripe-node 6.11.0, 2018) | Cas réel — l'auto-pagination de la bibliothèque Stripe (2018) | <https://docs.stripe.com/api/pagination><br><https://github.com/stripe/stripe-node><br><https://raw.githubusercontent.com/stripe/stripe-node/master/CHANGELOG.md> |
| `pages/js/lecon-42.html#1` | VRAI pour le site (vérifié dans js/theme.js) ; panier, brouillon, bannière de cookies = généralités | produit nommé (ce site) | corrigé : généralités retirées, mécanisme exact (clé syntaxe-theme, chargement bloquant), sourcé au code + web.dev 2019 | Cas réel — le thème de ce site (2026) | <js/theme.js (code du site)><br><https://web.dev/articles/prefers-color-scheme> |
| `pages/js/lecon-43.html#1` | INEXACT depuis React 19 : le symbole est Symbol.for("react.transitional.element") | produit nommé (React) | corrigé : historique 0.14 (2015) → 19 (2024), sourcé | Cas réel — le $$typeof de React (2015) | <https://raw.githubusercontent.com/facebook/react/main/CHANGELOG.md><br><https://overreacted.io/why-do-react-elements-have-typeof-property/> |
| `pages/js/lecon-44.html#1` | VRAI dans les grandes lignes, non daté ; « fichier de plusieurs gigaoctets … sans le charger en mémoire » non sourcé | produits nommés (SDK OpenAI, readline, Octokit) | corrigé : recentré sur readline (Node.js 11.4.0, 2018), OpenAI et Octokit retirés | Cas réel — readline et for await…of dans Node.js (2018) | <https://nodejs.org/api/readline.html><br><https://raw.githubusercontent.com/nodejs/node/main/doc/changelogs/CHANGELOG_V11.md> |
| `pages/js/lecon-45.html#1` | VRAI pour l'essentiel ; « cas d'usage industriel n° 1 de Proxy » non sourcé ; doublon de la leçon 38 (Vue 3) | produits nommés (Vue 3, MobX) | remplacé par : Immer et ses brouillons (2018) | Cas réel — Immer et ses brouillons (2018) | <https://medium.com/hackernoon/introducing-immer-immutability-the-easy-way-9d73d8f71cb3> |
| `pages/js/lecon-46.html#1` | INVÉRIFIABLE (le plafond de ~6 connexions est exact) | anonyme (« une galerie ») | remplacé par : les limites de connexions de HTTP/1.1 (RFC 2616, 7230, 6585 ; Chrome DevTools) | Cas réel — la limite de connexions de HTTP/1.1 (1999) | <https://www.rfc-editor.org/rfc/rfc2616.html><br><https://www.rfc-editor.org/rfc/rfc7230.html><br><https://www.rfc-editor.org/rfc/rfc6585.html><br><https://developer.chrome.com/docs/devtools/network/reference> |
| `pages/js/lecon-47.html#1` | INVÉRIFIABLE : implémentations de GitHub, Google Maps, Gmail non documentées | produits nommés non sourcés | remplacé par : l'annulation de fetch (Jake Archibald, 2017) | Cas réel — l'annulation de fetch arrive enfin (2017) | <https://developer.chrome.com/blog/abortable-fetch> |
| `pages/js/lecon-48.html#1` | INEXACT : Stripe ne pagine pas par l'en-tête Link ; l'affichage de ChatGPT/Claude par ReadableStream non sourcé | produits nommés | remplacé par : ReadableStream itérable dans Firefox 110 (2023) | Cas réel — ReadableStream devient itérable dans Firefox (2023) | <https://developer.mozilla.org/en-US/docs/Mozilla/Firefox/Releases/110><br><https://developer.mozilla.org/en-US/docs/Web/API/Response/body> |
| `pages/js/lecon-49.html#1` | VRAI (général), non daté ; « la moitié du web » non sourcé | produits nommés (DOM, Node, Redux) | corrigé : DOM Level 2 Events (W3C, 2000) et doc Node events ; Redux retiré | Cas réel — addEventListener, un observateur normalisé (2000) | <https://www.w3.org/TR/DOM-Level-2-Events/><br><https://nodejs.org/api/events.html> |
| `pages/js/lecon-50.html#1` | INVÉRIFIABLE | anonyme (« un tableau de bord analytics ») | remplacé par : Reselect (2015) | Cas réel — Reselect, des sélecteurs mémorisés (2015) | <https://github.com/reduxjs/reselect><br><https://registry.npmjs.org/reselect> |
| `pages/js/lecon-51.html#1` | INVÉRIFIABLE | anonyme (« un tableau de bord d'entreprise ») | remplacé par : la fuite de mémoire de Meteor (2013) | Cas réel — la fuite de mémoire de Meteor (2013) | <https://web.archive.org/web/20191002184003/https://blog.meteor.com/an-interesting-kind-of-javascript-memory-leak-8b47d2e7f156> |
| `pages/js/lecon-52.html#1` | INVÉRIFIABLE : remplacement $<nom> dans VS Code non documenté | produit nommé non sourcé | remplacé par : les groupes nommés d'ES2018 (proposition TC39) | Cas réel — les groupes nommés d'ES2018 (2018) | <https://github.com/tc39/proposal-regexp-named-groups><br><https://github.com/tc39/proposals/blob/main/finished-proposals.md> |
| `pages/js/lecon-53.html#1` | INVÉRIFIABLE : Airbnb et Booking non sourcés | produits nommés non sourcés | remplacé par : U+202F et ICU 72, ticket Mozilla 1806042 (2022) | Cas réel — l'espace qui a cassé des sites (2022) | <https://bugzilla.mozilla.org/show_bug.cgi?id=1806042> |
| `pages/js/lecon-54.html#1` | VRAI (ces décorateurs existent) mais non daté, et sans la nuance décorateurs expérimentaux / standard | produits nommés (Angular, NestJS, TypeORM) | remplacé par : les décorateurs standard de TypeScript 5.0 (2023) | Cas réel — les décorateurs de TypeScript 5.0 (2023) | <https://devblogs.microsoft.com/typescript/announcing-typescript-5-0/> |
| `pages/js/lecon-55.html#1` | VRAI (signature PNG et offsets 16/20 exacts) mais exemple d'école sans source | section h2, illustration | corrigé : intertitre conforme, faits rattachés à la norme PNG du W3C (2025), source ajoutée | Cas réel — l'en-tête d'un fichier PNG (norme W3C, 2025) | <https://www.w3.org/TR/png-3/> |
| `pages/js/lecon-56.html#1` | INVÉRIFIABLE : « Figma déporte son moteur de rendu hors du thread principal », Google Sheets, Photopea non sourcés | produits nommés non sourcés | remplacé par : SharedArrayBuffer et Spectre (Mozilla 2018, Chrome 2021) | Cas réel — SharedArrayBuffer et Spectre (2018) | <https://blog.mozilla.org/security/2018/01/03/mitigations-landing-new-class-timing-attack/><br><https://developer.chrome.com/blog/enabling-shared-array-buffer> |
| `pages/js/lecon-57.html#1` | INVÉRIFIABLE : implémentations de ChatGPT, Claude, Gemini non documentées | produits nommés non sourcés | remplacé par : les streams dans fetch (Jake Archibald, 2016) | Cas réel — les streams arrivent dans fetch (2016) | <https://jakearchibald.com/2016/streams-ftw/> |
| `pages/js/lecon-58.html#1` | INVÉRIFIABLE | anonyme (« un tableau de bord ») | remplacé par : la falaise de performance V8 dans React (2019) | Cas réel — une chute de performance de V8 dans React (2019) | <https://v8.dev/blog/react-cliff> |
| `pages/js/lecon-59.html#1` | INEXACT : pas un « script tiers » mais un fichier JavaScript du site de BA modifié après intrusion ; 429 612 personnes (ICO), pas « environ 380 000 transactions » ; « une vingtaine de lignes », Magecart et « l'auraient stoppé » absents de la source primaire | événement daté | corrigé à l'avis de sanction de l'ICO (16/10/2020) | Cas réel — British Airways (2018) | <https://web.archive.org/web/20250424225256id_/https://ico.org.uk/media/action-weve-taken/mpns/2618421/ba-penalty-20201016.pdf><br><https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy/connect-src> |
| `pages/js/lecon-60.html#1` | INEXACT : « toute l'orchestration reste en JavaScript » et « milliers de vecteurs à 60 images/s » non sourcés ; le gain (chargement ×3) ne valait alors que pour Firefox | produit nommé (Figma) | corrigé aux deux billets d'Evan Wallace (2015, 2017) | Cas réel — Figma passe à WebAssembly (2017) | <https://www.figma.com/blog/building-a-professional-design-tool-on-the-web/><br><https://www.figma.com/blog/webassembly-cut-figmas-load-time-by-3x/> |
| `pages/js/lecon-61.html#1` | INVÉRIFIABLE : « 60 à 80 % de JavaScript en moins », « chaque 100 ms … conversions » sans source | produits nommés (React Router, Next.js) | remplacé par : l'import() dynamique présenté par V8 (2017) | Cas réel — l'import() dynamique présenté par V8 (2017) | <https://v8.dev/features/dynamic-import> |
| `pages/js/lecon-62.html#1` | INVÉRIFIABLE : implémentations d'Instagram, X, LinkedIn non documentées | produits nommés non sourcés | remplacé par : IntersectionObserver (web.dev, 2016) | Cas réel — IntersectionObserver arrive (2016) | <https://web.dev/articles/intersectionobserver> |
| `pages/js/lecon-63.html#1` | VRAI (B2 : VRAI) | événement daté (Node.js 15) | vérifié et sourcé ; la phrase « des applications se sont mises à planter » (sourcée en B2 par un ticket tiers) remplacée par la conséquence documentée (arrêt du processus, code 1) | Cas réel — Node.js 15 et les rejets non gérés (2020) | <https://nodejs.org/en/blog/release/v15.0.0><br><https://raw.githubusercontent.com/nodejs/node/main/doc/changelogs/CHANGELOG_V15.md><br><https://nodejs.org/api/process.html> |
| `pages/js/lecon-64.html#1` | INVÉRIFIABLE : « Gmail te déconnecte … via BroadcastChannel » non documenté | produit nommé non sourcé | remplacé par : BroadcastChannel dans Safari 15.4 (2022) | Cas réel — BroadcastChannel arrive dans Safari (2022) | <https://webkit.org/blog/12445/new-webkit-features-in-safari-15-4/> |
| `pages/js/lecon-65.html#1` | VRAI pour l'essentiel (API de Zustand et de Redux exactes) | produits nommés (Zustand, Redux, Vue 3) | corrigé : daté, sourcé ; Vue 3 retiré (doublon des leçons 38 et 45) | Cas réel — le store de Zustand (2019) | <https://github.com/pmndrs/zustand><br><https://registry.npmjs.org/zustand><br><https://redux.js.org/api/store><br><https://registry.npmjs.org/redux> |

## Décomptes

**État trouvé** (66 « Cas réel ») :

| état | nombre | cas |
|---|---:|---|
| VRAI (dont « pour l'essentiel », avec des généralisations non sourcées) | 14 | 17, 19, 20, 21, 29, 38, 42, 44, 45, 49, 54, 55, 63, 65 |
| INEXACT | 6 | 04#1 (React n'affiche pas « rien » mais 0), 41 et 48 (Stripe ne pagine ni par lien ni par en-tête `Link`), 43 (symbole renommé dans React 19), 59 (British Airways : pas un script tiers, 429 612 personnes et non 380 000 transactions), 60 (Figma : gain ×3 au chargement, alors seulement dans Firefox ; « l'orchestration reste en JS » non sourcé) |
| INVÉRIFIABLE | 46 | tous les autres : 33 récits anonymes ou usages généraux, et 13 affirmations sur le fonctionnement interne de produits nommés que rien ne documente (Gmail, Google Maps, GitHub, Instagram, ChatGPT, Airbnb, Figma, VS Code…) |
| INVENTÉ | 0 | — |

Les 6 cas du cours tirés par B2 retrouvent leur verdict (63 et 29 VRAI ; 23, 24, 05, 01
INVÉRIFIABLE).

**Action** :

| action | nombre |
|---|---:|
| vérifié, gardé (forme de la règle, source ajoutée, texte resserré sur la source) | 2 (29, 63) |
| corrigé, même sujet | 14 (04#1, 17, 19, 20, 38, 41, 42, 43, 44, 49, 55, 59, 60, 65) |
| remplacé par un vrai cas sourcé sur la même notion | 50 |
| renommé « Scénario » | 0 |

Chaque leçon garde au moins un « Cas réel » conforme (aucune n'en avait deux à part la 04, qui
garde ses deux).

**Remplacements, ancien sujet → nouveau sujet** : voir la colonne « action » du tableau ; les
50 sont distincts entre eux et de ceux déjà présents dans le cours.

**Cas où j'ai douté** :
- **42 (le thème de ce site)** : gardé comme « Cas réel » parce qu'il est vrai et vérifiable par
  l'apprenant lui-même ; sa source principale est le code du site (`js/theme.js`, daté « 2026 »),
  complétée par l'article web.dev de 2019. Si l'orchestrateur juge qu'un site ne peut pas être sa
  propre source, il faut changer **aussi** l'intertitre `<h2>Cas réel : le thème de ce site</h2>`
  qui l'enveloppe.
- **55 (en-tête PNG)** : c'est un exemple de code, devenu « Cas réel » parce que chaque fait
  (signature, ordre des blocs, offsets, ordre des octets) est désormais rattaché à la norme du
  W3C ; l'année du titre est celle de l'édition consultée (2025), pas celle de la première norme
  PNG, que je n'ai pas ouverte.
- **21 (composition plutôt qu'héritage)** : la page de React n'est pas datée ; « 2016 » vient de
  sa plus ancienne copie archivée que j'ai ouverte (3 novembre 2016). L'ancien cas (chaîne
  d'héritage du DOM) était **vrai** mais général ; il a été remplacé faute de date.
- **33 (GOV.UK)** : même méthode de datation (copie archivée du 11 mai 2020) ; la consigne
  existait peut-être avant.
- **06 (paramètres par défaut)** : « ECMAScript 5.1 n'en avait pas » repose sur la grammaire des
  deux normes (5.1 : `FormalParameterList : Identifier` ; 2015 : `FormalParameter :
  BindingElement` avec `Initializer`), lue dans le texte des normes.
- **14 (Excel 2007)** : la phrase « 77,1 n'a pas d'écriture binaire exacte » n'est pas de
  l'équipe Excel (un commentateur du billet le dit) ; elle est présentée comme un fait
  mathématique, appuyé par le calcul `850 * 77.1` fait avec Node.
- **59 (British Airways)** : le lien vers la directive `connect-src` est une phrase de rattachement
  à la leçon, sourcée par MDN ; je n'affirme **pas** qu'une CSP aurait arrêté l'attaque (l'ICO ne
  le dit pas).
- **Sujet abandonné** : le missile Patriot de Dhahran (1991), pour la leçon 14 — le rapport du GAO
  (IMTEC-92-26) n'est disponible qu'en PDF scanné, illisible avec les outils de la session ; je ne
  l'ai donc pas cité.

## Contrôles (après la dernière modification, avant le dernier commit)

Tous lancés dans `D:\test-claude-b4-js` sur l'arbre du commit `e36c45e` :

| contrôle | code |
|---|---:|
| `node tools/verif-contenu.js --cas-reel --cours=javascript` | **0** (66 lus, 66 conformes) |
| `node tools/verif-contenu.js --strict` | **0** (le seul « maigre » est `os/lecon-04`, hors lot) |
| `node tools/verif-html.js` | **0** |
| `node tools/verif-domaines-interdits.js` | **0** |
| `node tools/verif-qcm-lexique.js` | **0** |
| `node tools/verif-qcm-biais.js` | **0** |
| fins de ligne : `\r` dans les 65 leçons de `pages/js/` (compté avec Node) | **0** |
| `node tools/verif.js --rapide` | **1** : 54 vérificateurs, 4 signalés, expliqués ci-dessous |

Les quatre rouges de `--rapide` (journal : `scratchpad/.verif-journal/2026-11-14T05-02-38/`) :

1. **`donnees` (I18)** — `search-index.js` divergent du contenu regénéré (+7 577 octets) : le
   rouge toléré, l'index est régénéré par l'orchestrateur.
2. **`doc-ref`** (`tools/doc/verif-doc.js`, § 6 bis) — la page `pages/doc/cours.html` annonce
   « 85 leçons de ce site » qui renvoient à un document (MDN, RFC, « la spécification »…) ; la
   mesure en trouve désormais 92.
3. **`doc-rec`** (`tools/doc/verif-recherche.js`) — la page du cours `doc` annonce « 11 portent un
   lien vers l'extérieur » et « 10 leçons » qui nomment Stack Overflow ou un assistant ; la mesure
   trouve 76 et 8.

   Ces deux rouges sont **causés par ce lot, et attendus** : ce sont des chiffres du corpus que le
   cours `doc` publie. Mesuré sur les seules leçons `pages/js/`, avant (`HEAD` d'origine) et après
   (script `scratchpad/b4-js/mesure-doc.js`) : leçons qui citent un document 6 → 13 (+7, d'où
   85 → 92) ; leçons avec un lien externe 0 → 65 (d'où 11 → 76) ; leçons qui nomment ChatGPT
   2 → 0 (les leçons 48 et 57 ne parlent plus de ChatGPT, d'où 10 → 8). Ces pages sont produites
   par `tools/doc/gen.js` depuis les gabarits de `tools/doc/corps/` : je ne les ai **pas**
   régénérées, puisque chacun des six autres lots du B4 change les mêmes chiffres (chaque ligne de
   source porte un lien). À régénérer **une fois**, après la fusion de tous les lots.
4. **`gitcmdp`** (`tools/preuves/git-commandes.js`) — « Chrome n'a pas écrit son port dans
   30 s : rien n'a pu être mesuré » (machine chargée par les agents parallèles) ; **relancé seul
   ensuite : code 0**, 13 valeurs comparées, 0 écart.

Après ce passage de `--rapide`, trois phrases (leçons 19, 21, 61) et le titre d'une source
(leçon 63) ont encore été retouchés ; les six contrôles du tableau ont été relancés **après**
ces retouches (codes ci-dessus).

## Consignes de fusion

- Branche `v18/b4-js` : deux commits, `e36c45e` (les 65 leçons) puis celui de ce rapport. Elle ne
  touche que `pages/js/lecon-*.html` et `en-cours/rapports-v18/b4-js.md` : aucun conflit possible
  avec les autres lots du B4.
- Après la fusion de **tous** les lots : régénérer les index dérivés (`node tools/build-index.js
  --write --fresh`, I18), puis les pages du cours `doc` qui publient des mesures du corpus
  (`tools/doc/gen.js`), et relancer `verif-doc.js` et `verif-recherche.js`.
- La contre-relecture peut partir des URL du tableau : toutes ont été ouvertes ; six sont des
  copies archivées (Wayback Machine) et quatre des fichiers bruts de GitHub
  (`raw.githubusercontent.com`) — les pages GitHub de ces journaux ne s'affichent pas sans
  JavaScript.

## Ce qui reste ouvert

- Les chiffres du cours `doc` (85/92, 11/76, 10/8) : à régénérer après fusion, voir plus haut.
  ⚠️ **Plus qu'un chiffre** : `pages/doc/lecon-04.html` en tire un argument — « sur les 1 536
  leçons de ce site, 11 portent un lien vers l'extérieur […] 1 525 n'en portent aucun. Ce site est
  une île » —, et cite comme exemples de mentions d'assistants « l'affichage d'une réponse au fil
  des mots », c'est-à-dire les anciens cas des leçons `js/48` et `js/57`, retirés ici. Une fois
  tous les lots fusionnés (chaque « Cas réel » porte désormais un lien), ce paragraphe sera faux
  même avec des chiffres régénérés : il est à **réécrire**, pas seulement à régénérer.
- Le cas 42 (le site comme sa propre source) et la datation par copie archivée des cas 21 et 33 :
  choix à confirmer par l'orchestrateur (voir « Cas où j'ai douté »).
- Une contre-relecture indépendante de chaque affirmation, prévue par la consigne.
