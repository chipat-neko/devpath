# Rapport V18 — case B4, cours `html` (copie `b4-html`, branche `v18/b4-html`)

Copie de travail `D:\test-claude-b4-html`, partie de `a244d0f`. Part traitée : les **48 « Cas réel »**
du cours `html` (47 leçons ; `lecon-38` en a deux). Scripts et pièces dans `scratchpad/b4-html/`
(ignoré par git) : `dump.js` (lecture des cas), `cas-html-1.js` et `cas-html-2.js` (les 48 textes),
`appliquer.js` (remplacement octet par octet), `preuve-octets.js` (preuve indépendante),
`orig/` (les 47 pages avant modification), PDF et pages téléchargés pour lecture.

Commits : `21ac5a3` (les 47 leçons), puis ce rapport. Rien d'autre n'est modifié : ni QCM, ni
`js/`, ni index dérivé, ni page du cours `doc`.

**En une phrase** : les 48 encadrés tiennent la règle (`verif-contenu.js --cas-reel --cours=html`
**0 hors règle**, code 0) ; **39 remplacés** par un vrai cas daté et sourcé sur la même notion,
**9 corrigés** à leur source, **0 gardés tels quels**, **0 renommés « Scénario »** ; chaque
affirmation écrite a été relue dans une source ouverte (URL ci-dessous) ; aucun octet hors des
encadrés n'a changé, `lecon-15` (mojibake volontaire) compris.

---

## 1. Méthode

1. Chaque cas lu avec sa leçon et l'intertitre qui le précède (`section.js`) : le nouveau cas
   illustre la notion de cette section.
2. Sujet nommé : chaque affirmation confrontée à une source primaire ; corrigé ou retiré si la source
   ne la porte pas. Sujet anonyme ou usage général : remplacé par un cas réel daté, à source
   primaire ouverte (norme, décision de justice, note de version, blog d'ingénierie officiel,
   étude de cas, article original).
3. Rien d'écrit que la source ne dise ; citations traduites seulement quand la source contient la
   phrase. Les phrases qui relient le cas à la leçon (« C'est le réglage de cette leçon… ») sont
   les seules qui ne viennent pas de la source, et elles ne contiennent aucun fait nouveau.
4. Forme de la règle : `Cas réel — sujet (année)` + dernier paragraphe
   `<p class="cas-reel__source">Source : …</p>` avec lien(s) ouverts. `&nbsp;` devant « : ; ! ? % »
   et dans les guillemets ; `<` échappé dans le code.
5. Remplacement par `appliquer.js` : décodage UTF-8 vérifié sans perte, encadré d'origine à
   2 paragraphes exigé, épissure **en octets** (préfixe et suffixe recopiés), 0 CR ; puis
   `preuve-octets.js`, écrit à part, compare `orig/` et la page octet par octet.

Sources : une page qui bloquait l'outil web a été lue par `curl` (texte HTML) ou par `pypdf`
(PDF) ; une seule source secondaire : TechCrunch, pour la date de l'annonce de l'Open Graph à f8
(le billet de Facebook de 2010 n'a pas été retrouvé ; le protocole lui-même est cité à sa source,
ogp.me). Les textes de loi européens ont été lus dans le Formex officiel de l'Office des
publications (EUR-Lex ne répondait qu'une page JavaScript) : pour eux, la ligne de source nomme le
Journal officiel, sans lien.

## 2. Cas par cas

État trouvé : **VRAI**, **INEXACT** (ce qui est faux), **INVÉRIFIABLE** (aucun sujet ou aucune
source possible), **INVENTÉ** ; nature : événement, produit nommé, récit anonyme, usage général.

| id | état trouvé (nature) | action | nouveau titre | sources ouvertes |
|---|---|---|---|---|
| `pages/html/lecon-01.html#1` | INVÉRIFIABLE (usage général : un bouton « Ajouter au panier ») | remplacé par : la page « Tags used in HTML » du projet WWW (1992) | Cas réel — « Tags used in HTML », le HTML de 1992 | https://www.w3.org/History/19921103-hypertext/hypertext/WWW/MarkUp/Tags.html ; https://www.w3.org/History.html |
| `pages/html/lecon-02.html#1` | **INEXACT** (produit nommé) : « le sommaire affiché en haut de l'article » — depuis l'habillage Vector 2022 (Wikipédia en français pilote dès 2020, nouveau sommaire en mai 2022), le sommaire est hors du texte ; « le titre est un `<h1>` » non vérifié (MediaWiki : niveau 1 = nom de la page) | corrigé : niveaux de titres, sommaire construit à partir des titres (seuil classique : plus de trois), Vector 2022 | Cas réel — le sommaire de Wikipédia (2022) | https://www.mediawiki.org/wiki/Help:Section ; https://www.mediawiki.org/wiki/Help:Formatting ; https://www.mediawiki.org/wiki/Reading/Web/Desktop_Improvements |
| `pages/html/lecon-03.html#1` | VRAI mais sans source possible (le menu de Syntaxe porte bien `aria-current="page"`, vérifié dans `index.html`) | remplacé par : `aria-current` dans WAI-ARIA 1.1 et le gabarit de navigation de GOV.UK | Cas réel — aria-current, de WAI-ARIA 1.1 (2017) au menu de GOV.UK | https://www.w3.org/TR/wai-aria-1.1/ ; https://raw.githubusercontent.com/alphagov/govuk-frontend/main/packages/govuk-frontend/src/govuk/components/service-navigation/template.njk ; https://design-system.service.gov.uk/components/service-navigation/ |
| `pages/html/lecon-04.html#1` | INVÉRIFIABLE (usage général : une fiche produit de 30 photos) | remplacé par : le chargement différé natif de Chrome et ses mesures | Cas réel — le chargement différé natif de Chrome (2019) | flux du Chromium Blog, billet du 24/10/2019 « Automatically lazy-loading offscreen images & iframes for Lite mode users » (https://blog.chromium.org/feeds/posts/default) ; https://web.dev/articles/browser-level-image-lazy-loading |
| `pages/html/lecon-05.html#1` | INVÉRIFIABLE (usage général) | remplacé par : la directive 5 de WCAG 1.0 | Cas réel — les tableaux dans WCAG 1.0 (1999) | https://www.w3.org/TR/WAI-WEBCONTENT/ |
| `pages/html/lecon-06.html#1` | INVÉRIFIABLE (produits nommés, affirmation vague : Netflix et YouTube « reposent sur le même principe ») | remplacé par : l'accord NAD c. Netflix sur le sous-titrage | Cas réel — Netflix et le sous-titrage pour les sourds (2012) | https://dredf.org/wp-content/uploads/2011/06/netflix-consent-decree-10-10-12.pdf |
| `pages/html/lecon-07.html#1` | INVÉRIFIABLE (usage général : cartes et vidéos intégrées) | remplacé par : `loading` sur `<iframe>` dans Firefox 121, gains mesurés par Chrome | Cas réel — loading="lazy" sur les iframes (2023) | https://developer.mozilla.org/en-US/docs/Mozilla/Firefox/Releases/121 ; https://web.dev/articles/iframe-lazy-loading |
| `pages/html/lecon-08.html#1` | INVÉRIFIABLE en l'état (usage général sur Google, sans source) | remplacé par : le Google Web Accelerator qui « cliquait » les liens de suppression | Cas réel — le Google Web Accelerator (2005) | https://signalvnoise.com/archives2/google_web_accelerator_hey_not_so_fast_an_alert_for_web_app_designers ; https://www.rfc-editor.org/rfc/rfc2616.txt |
| `pages/html/lecon-09.html#1` | INVÉRIFIABLE (usage général : claviers mobiles) | remplacé par : GOV.UK abandonne `type="number"` | Cas réel — GOV.UK abandonne type="number" (2020) | https://technology.blog.gov.uk/2020/02/24/why-the-gov-uk-design-system-team-changed-the-input-type-for-numbers/ |
| `pages/html/lecon-10.html#1` | INVÉRIFIABLE (usage général ; même verdict en B2) | remplacé par : la validation interactive arrive dans WebKit/Safari | Cas réel — Safari bloque enfin l'envoi invalide (2017) | https://webkit.org/blog/7099/html-interactive-form-validation/ ; https://webkit.org/blog/7477/new-web-features-in-safari-10-1/ |
| `pages/html/lecon-11.html#1` | INVÉRIFIABLE (usage général), avec une affirmation sans appui : « c'est cette structure que Google lit pour… bien classer la page » | remplacé par : Hickson, l'étude de Google et `<header>`/`<footer>` | Cas réel — l'étude de Google et les balises de HTML5 (2006) | https://lists.whatwg.org/pipermail/whatwg-whatwg.org/2006-January/047889.html |
| `pages/html/lecon-12.html#1` | INVÉRIFIABLE (usage général : prix barré) | remplacé par : la règle européenne du « prix antérieur » | Cas réel — le prix barré encadré par l'Union européenne (2022) | Formex officiel de la directive 2019/2161 : https://publications.europa.eu/resource/celex/32019L2161.FRA.fmx4.L_2019328FR.01000701.xml |
| `pages/html/lecon-13.html#1` | INVÉRIFIABLE (usage général : boutons-icônes) | remplacé par : le rapport WebAIM Million 2026, qui chiffre l'affirmation | Cas réel — le rapport WebAIM Million (2026) | https://webaim.org/projects/million/ |
| `pages/html/lecon-14.html#1` | INVÉRIFIABLE (produits nommés, sans source : WhatsApp, LinkedIn, Google) | remplacé par : le protocole Open Graph | Cas réel — le protocole Open Graph de Facebook (2010) | https://ogp.me/ ; https://techcrunch.com/2010/04/21/hacking-the-graph-live-from-facebooks-f8-conference (presse, faute du billet de Facebook) |
| `pages/html/lecon-15.html#1` | INVÉRIFIABLE (usage général : le validateur) | remplacé par : WCAG 2.2 retire le critère 4.1.1 « Parsing » ; **remplacement exact de l'encadré seul, octets hors encadré prouvés identiques** (§ 4) | Cas réel — WCAG 2.2 retire le critère « Parsing » (2023) | https://www.w3.org/TR/WCAG22/ ; https://www.w3.org/WAI/WCAG22/Understanding/parsing.html |
| `pages/html/lecon-16.html#1` | INVÉRIFIABLE (chiffre sans source : « 2 à 3 fois plus légères ») | remplacé par : Netflix évalue AVIF | Cas réel — Netflix évalue le format AVIF (2020) | https://netflixtechblog.com/avif-for-next-generation-image-coding-b1d75675fe4 |
| `pages/html/lecon-17.html#1` | INVÉRIFIABLE (usage général : `<progress>`, `<meter>`) | remplacé par : GitHub passe d'une police d'icônes au SVG inline (notion de la leçon : SVG ; aucun cas sourcé trouvé sur `<meter>`) | Cas réel — GitHub passe ses icônes en SVG (2016) | https://github.blog/engineering/user-experience/delivering-octicons-with-svg/ |
| `pages/html/lecon-18.html#1` | INVÉRIFIABLE (usage général : « quelques attributs font baisser le taux d'abandon ») | remplacé par : les chiffres de l'autofill de Chrome au paiement | Cas réel — le remplissage automatique de Chrome au paiement (2024) | https://blog.google/products/chrome/chrome-autofill/ |
| `pages/html/lecon-19.html#1` | INVÉRIFIABLE (usage général ; « mieux indexée » sans source) | remplacé par : l'accord NAD c. Harvard | Cas réel — NAD contre Harvard (2019) | https://www.cohenmilstein.com/wp-content/uploads/2023/07/NAD-v-Harvard-Motion-for-Preliminary-Approval-of-Settlement-11272020.pdf |
| `pages/html/lecon-20.html#1` | INVÉRIFIABLE (récit anonyme ; même verdict en B2, constat technique exact) | remplacé par : Outlook 2007 et le moteur de rendu de Word | Cas réel — Outlook 2007 et le moteur de Word (2006) | https://learn.microsoft.com/en-us/previous-versions/office/developer/office-2007/aa338201(v=office.12) |
| `pages/html/lecon-21.html#1` | INVÉRIFIABLE (récit anonyme : une boutique qui migre) | remplacé par : Unicode devient l'encodage le plus fréquent du web | Cas réel — Unicode devient l'encodage n° 1 du web (2007) | flux de l'Official Google Blog, billet « Moving to Unicode 5.1 » du 05/05/2008 (https://googleblog.blogspot.com/feeds/posts/default) ; https://googleblog.blogspot.com/2008/05/moving-to-unicode-51.html |
| `pages/html/lecon-22.html#1` | INVÉRIFIABLE (récit anonyme : une équipe support) | remplacé par : Chrome 97 rend les `<details>` fermés cherchables | Cas réel — Chrome rend les `<details>` fermés trouvables (2021) | flux du Chromium Blog, billet du 18/11/2021 (https://blog.chromium.org/2021/11/chrome-97-webtransport-new-array-static.html) |
| `pages/html/lecon-23.html#1` | INVÉRIFIABLE (récit anonyme : un blog de cuisine) | remplacé par : le lancement de schema.org | Cas réel — le lancement de Schema.org (2011) | https://developers.google.com/search/blog/2011/06/introducing-schemaorg-search-engines ; https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data |
| `pages/html/lecon-24.html#1` | INVÉRIFIABLE (usage général : « les grands design systems ») | remplacé par : Photoshop sur le web, Lit et Spectrum Web Components | Cas réel — Photoshop sur le web (2021) | https://web.dev/articles/ps-on-the-web |
| `pages/html/lecon-25.html#1` | INVÉRIFIABLE (récit anonyme : un site e-commerce) | remplacé par : le test A/B de Vodafone | Cas réel — le test A/B de Vodafone sur le LCP (2021) | https://web.dev/case-studies/vodafone |
| `pages/html/lecon-26.html#1` | INVÉRIFIABLE (récit anonyme : « la FAQ réécrite trois fois ») | remplacé par : l'accordéon exclusif (`name`) dans Firefox 130 | Cas réel — l'accordéon exclusif dans tous les navigateurs (2024) | https://developer.mozilla.org/en-US/docs/Mozilla/Firefox/Releases/130 ; https://developer.chrome.com/docs/css-ui/exclusive-accordion |
| `pages/html/lecon-27.html#1` | INVÉRIFIABLE (récit anonyme : « la suppression fantôme », mesure « dans Chrome 152 » sans source) | remplacé par : `<dialog>` dans Firefox 98 et Safari 15.4 | Cas réel — `<dialog>` arrive dans Firefox et Safari (2022) | https://developer.mozilla.org/en-US/docs/Mozilla/Firefox/Releases/98 ; https://webkit.org/blog/12445/new-webkit-features-in-safari-15-4/ |
| `pages/html/lecon-28.html#1` | INVÉRIFIABLE (récit anonyme : « le menu prisonnier de l'overflow ») | remplacé par : l'API Popover, sa « Baseline 2024 » et l'erratum de 2025 | Cas réel — l'API Popover et sa « Baseline » trop tôt annoncée (2024) | https://web.dev/blog/popover-api ; https://web.dev/blog/popover-baseline |
| `pages/html/lecon-29.html#1` | INVÉRIFIABLE (récit anonyme ; même verdict en B2) | remplacé par : le bilan Trusted Types de Google sur les XSS du DOM | Cas réel — Google et les failles XSS du DOM (2021) | https://storage.googleapis.com/gweb-research2023-media/pubtools/6259.pdf ; https://web.dev/articles/trusted-types |
| `pages/html/lecon-30.html#1` | VRAI en partie (produit nommé) : `<relative-time>` et son repli sans JavaScript confirmés ; `<clipboard-copy>`, `<details-menu>` non vérifiés | corrigé : recentré sur le billet de GitHub (éléments qu'il nomme) et le README de `relative-time-element` | Cas réel — les Web Components de GitHub (2021) | https://github.blog/engineering/architecture-optimization/how-we-use-web-components-at-github/ ; https://github.com/github/relative-time-element |
| `pages/html/lecon-31.html#1` | INVÉRIFIABLE en partie (produits nommés) : contrôles natifs en shadow DOM exact pour `<video>` ; « `<clipboard-copy>`, Salesforce Lightning… reposent sur cette encapsulation » non vérifié | remplacé par : Firefox 63 livre les Web Components (et confirme `<video>`) | Cas réel — Firefox 63 livre le Shadow DOM (2018) | https://hacks.mozilla.org/2018/10/firefox-63-tricks-and-treats/ |
| `pages/html/lecon-32.html#1` | **INEXACT** (événement) : « Domino's a perdu en justice (2019) » — en 2019, la cour d'appel juge seulement que l'ADA s'applique et renvoie l'affaire, sans dire si le site est conforme ; la Cour suprême refuse le recours. RGAA et bibliothèques (Radix…) non vérifiés | corrigé : récit tiré de l'arrêt du 9e circuit et du dossier de la Cour suprême ; le reste retiré | Cas réel — Robles contre Domino's Pizza (2019) | https://cdn.ca9.uscourts.gov/datastore/opinions/2019/01/15/17-55504.pdf ; https://www.supremecourt.gov/docket/docketfiles/html/public/18-1539.html |
| `pages/html/lecon-33.html#1` | INVÉRIFIABLE (produits nommés sans source : toasts de Gmail et GitHub en `role="status"` ; Primer déconseille même les toasts) | remplacé par : le critère 4.1.3 de WCAG 2.1, et la position de Primer | Cas réel — le critère « Messages d'état » de WCAG 2.1 (2018) | https://www.w3.org/TR/WCAG21/ ; https://www.w3.org/WAI/WCAG21/Understanding/status-messages.html ; https://primer.style/accessibility/toasts/ |
| `pages/html/lecon-34.html#1` | **INEXACT** (produits nommés) : les « questions dépliables d'une page d'aide (`FAQPage`) » ne s'affichent plus, depuis août 2023, que pour des sites gouvernementaux et de santé ; Marmiton, Fnac, Amazon non vérifiés | remplacé par : le changement de Google sur les FAQ et HowTo enrichis | Cas réel — Google restreint les FAQ enrichies (2023) | https://developers.google.com/search/blog/2023/08/howto-faq-changes |
| `pages/html/lecon-35.html#1` | INVÉRIFIABLE (usage général ; « 100 à 300 ms » sans source — web.dev donne 100 à 500 ms) ; la phrase sur les polices de ce site est vraie (aucun `preconnect` dans le `<head>`, vérifié) | remplacé par : le cloisonnement du cache HTTP de Chrome ; la phrase vraie sur ce site est gardée | Cas réel — Chrome cloisonne son cache HTTP (2020) | https://developer.chrome.com/blog/http-cache-partitioning ; (lu, non cité : https://web.dev/articles/preconnect-and-dns-prefetch) |
| `pages/html/lecon-36.html#1` | INVÉRIFIABLE (usage général : une fiche produit) | remplacé par : l'essai Fetch Priority sur Google Flights | Cas réel — l'image LCP de Google Flights (web.dev, 2023) | https://web.dev/articles/fetch-priority |
| `pages/html/lecon-37.html#1` | INVÉRIFIABLE (« les grandes plateformes enveloppent systématiquement chaque nom dans `<bdi>` », sans source) | remplacé par : l'usurpation d'adresse par RLO dans Evolution | Cas réel — l'adresse e-mail retournée par RLO dans Evolution (2009) | https://bugzilla.gnome.org/show_bug.cgi?id=601172 |
| `pages/html/lecon-38.html#1` | INVÉRIFIABLE (usage général : Trello, projets GitHub) | remplacé par : le critère 2.5.7 de WCAG 2.2 | Cas réel — WCAG 2.2 et les mouvements de glissement (2023) | https://www.w3.org/TR/WCAG22/ ; https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements.html |
| `pages/html/lecon-38.html#2` | INVÉRIFIABLE (produits nommés, sans source : Gmail, Twitter/X, GitHub) | remplacé par : le « tree slider » de GitHub et `pushState` | Cas réel — le « tree slider » de GitHub (2010) | https://github.blog/news-insights/the-library/the-tree-slider/ |
| `pages/html/lecon-39.html#1` | VRAI en partie (événements) : polyfill.io confirmé ; British Airways (« 380 000 transactions ») non vérifié à une source ouverte ; « un simple `integrity` aurait figé le contenu… le navigateur l'aurait refusé » est une affirmation contrefactuelle sans source | corrigé : polyfill.io détaillé d'après Sansec ; BA et le contrefactuel retirés ; SRI décrit d'après la norme | Cas réel — l'attaque de polyfill.io (2024) | https://sansec.io/research/polyfill-supply-chain-attack ; https://www.w3.org/TR/2016/REC-SRI-20160623/ |
| `pages/html/lecon-40.html#1` | INVÉRIFIABLE (produits nommés sans source : fils de Twitter/X, Instagram, LinkedIn) | remplacé par : IntersectionObserver dans Firefox 55 | Cas réel — IntersectionObserver arrive dans Firefox (2017) | https://hacks.mozilla.org/2017/08/intersection-observer-comes-to-firefox/ |
| `pages/html/lecon-41.html#1` | VRAI en partie (produits nommés) : vscode.dev et son repli confirmés ; Excalidraw et Photopea non vérifiés | corrigé : recentré sur vscode.dev | Cas réel — vscode.dev et l'API File System Access (2021) | https://code.visualstudio.com/blogs/2021/10/20/vscode-dev |
| `pages/html/lecon-42.html#1` | VRAI en partie (produit nommé) : Twitter Lite et sa coquille en cache confirmés ; « network-first » absent de la source ; Spotify, Starbucks non vérifiés | corrigé : recentré sur l'étude de cas (étapes, chiffres) | Cas réel — Twitter Lite, la PWA de Twitter (2017) | https://web.dev/case-studies/twitter |
| `pages/html/lecon-43.html#1` | INVÉRIFIABLE (produits nommés sans source : Stripe Checkout, inscription GitHub) | remplacé par : l'étude de Luke Wroblewski sur la validation en ligne | Cas réel — l'étude de Luke Wroblewski sur la validation en ligne (2009) | https://alistapart.com/article/inline-validation-in-web-forms/ |
| `pages/html/lecon-44.html#1` | VRAI (produits nommés ; même verdict en B2), mais sans date et avec des généralités non sourcées (« livreurs et banques », « jeux 2D ») | remplacé par un cas daté : Google Docs passe au canvas ; signature_pad (vérifié) gardé | Cas réel — Google Docs passe au rendu canvas (2021) | flux de Google Workspace Updates, billet du 11/05/2021 (https://workspaceupdates.googleblog.com/2021/05/Google-Docs-Canvas-Based-Rendering-Update.html) ; https://github.com/szimek/signature_pad |
| `pages/html/lecon-45.html#1` | **INEXACT** (produits nommés ; même verdict en B2) : « assainissement systématique côté serveur avant stockage » contredit pour GitHub (le Markdown brut est stocké, le HTML filtré au rendu) ; le ver Samy est exact | corrigé : l'affirmation fausse retirée, le cas recentré sur le ver Samy d'après son auteur | Cas réel — le ver Samy sur MySpace (2005) | https://sa.my/myspace/ ; https://sa.my/myspace/tech.html |
| `pages/html/lecon-46.html#1` | VRAI en partie (produits nommés) : Lit SSR et dates (spécification revue en 2023, Firefox en 2024) confirmés ; Shoelace/Web Awesome et le gain de LCP non vérifiés | corrigé : recentré sur Firefox 123, l'histoire de l'attribut et Lit | Cas réel — le Declarative Shadow DOM dans Firefox 123 (2024) | https://developer.mozilla.org/en-US/docs/Mozilla/Firefox/Releases/123 ; https://web.dev/articles/declarative-shadow-dom ; https://lit.dev/docs/ssr/overview/ |
| `pages/html/lecon-47.html#1` | VRAI en partie (événement) : l'European Accessibility Act s'applique bien depuis le 28 juin 2025 ; les onglets de Spectrum, Primer et Shoelace non vérifiés | corrigé : recentré sur la directive (champ, principes, exemption des microentreprises) | Cas réel — l'acte européen sur l'accessibilité entre en application (2025) | Formex officiel de la directive 2019/882 : https://publications.europa.eu/resource/celex/32019L0882.FRA.fmx4.L_2019151FR.01007001.xml |

## 3. Décomptes

- **États trouvés** (48) : VRAI 2 (`lecon-03` sans source possible, `lecon-44`) · VRAI en partie 6
  (`30`, `39`, `41`, `42`, `46`, `47`) · **INEXACT 4** (`02`, `32`, `34`, `45`) · INVÉRIFIABLE 36 ·
  INVENTÉ 0 (aucun cas ne se déclare fictif ; plusieurs récits anonymes — `26`, `27`, `28` —
  en ont l'allure, mais rien ne le prouve).
- **Actions** (48) : **remplacé 39** · **corrigé 9** (`02`, `30`, `32`, `39`, `41`, `42`, `45`,
  `46`, `47`) · vérifié tel quel 0 · renommé « Scénario » 0.
- Longueur des récits : 107 à 172 mots (`scratchpad/b4-html/verif-donnees.js`).
- Les quatre cas déjà vus en B2 (`10`, `20`, `29` INVÉRIFIABLE ; `44` VRAI ; `45` INEXACT) : verdicts
  retrouvés à l'identique ; leurs sources ont été rouvertes ou remplacées.

## 4. Le mojibake de `lecon-15`, et les octets hors encadrés

`appliquer.js` remplace chaque encadré par épissure d'octets (préfixe et suffixe recopiés tels
quels) après avoir vérifié que la page se décode en UTF-8 sans perte. `preuve-octets.js`, écrit à
part, compare ensuite les 47 originaux (`scratchpad/b4-html/orig/`) aux pages modifiées : pour
chaque page, la seule zone qui diffère commence et finit **dans** l'encadré « Cas réel » d'origine.

```
lecon-15.html : 1 encadré(s), diff octets [7853,8262) dans l'encadré : OUI, préfixe identique 7853 o,
  suffixe identique 28963 o, CR 0, séquences de mojibake avant/après : 1/1
lecon-38.html : 2 encadré(s), diff octets [21315,30963) dans l'encadré : OUI, segment entre encadrés intact : OUI
PREUVE OK : aucun octet modifié hors des encadrés, 0 CR.
```

## 5. Contrôles (sur l'état commité)

| contrôle | code | sortie |
|---|---:|---|
| `node tools/verif-contenu.js --cas-reel --cours=html` | **0** | 48 lus, 48 conformes, 0 hors de la règle (avant : 48 hors règle, code 1) |
| `node tools/verif-contenu.js --strict` | **0** | toutes les leçons tiennent le standard ; 1 « maigre » (`os/lecon-04`), déjà signalée avant ce travail (vérifié en remettant les 47 originaux) |
| `node tools/verif-html.js` | **0** | aucun problème détecté |
| `node tools/verif-domaines-interdits.js` | **0** | aucune référence réelle aux trois domaines |
| `node tools/verif-qcm-lexique.js` | **0** | sortie identique à l'octet à celle d'avant les changements |
| `node tools/verif-qcm-biais.js` | **0** | sortie identique à l'octet à celle d'avant les changements |
| `node tools/verif.js --rapide` | **1** | 54 étapes, 612,3 s ; **3 signalées**, toutes trois des chiffres DÉRIVÉS du contenu, expliquées ci-dessous ; les 51 autres OK |

Les trois étapes rouges de `--rapide` :

1. **`donnees`** — l'invariant **I18** seul (2 erreurs = 1 index divergent) : `js/search-index.js`
   publié 4 274 431 o, regénéré 4 280 856 o (+6 425 o), parce que le texte de 47 leçons a changé.
   C'est le rouge toléré : l'orchestrateur régénère l'index après la fusion.
2. **`doc-ref`** (`tools/doc/verif-doc.js`, contrôle 6 bis) — `pages/doc/cours.html` publie
   « 85 leçons de ce site » qui renvoient à un document (motifs `MDN`, `RFC nnnn`, « la
   spécification », « documentation officielle ») ; le recompte en trouve **88** : `lecon-07`,
   `lecon-27` et `lecon-46` citent maintenant MDN dans leur ligne de source (et `lecon-46` écrit
   « la spécification »). Le chiffre est vrai ; c'est la page engendrée qui est en retard.
3. **`doc-rec`** (`tools/doc/verif-recherche.js`) — `pages/doc/lecon-04.html` publie « 11 portent
   un lien vers l'extérieur » ; le recompte en trouve **54** : les lignes de source des « Cas réel »
   portent des liens. Même nature : chiffre de corpus, page engendrée en retard.

Les deux pages du cours `doc` sont **engendrées** par `node tools/doc/gen.js` (marqueurs
`@@RECHNB:…@@` et `@@MESURE:…@@`) : elles ne sont pas touchées ici, pour ne pas créer de conflit
avec les six autres copies dont les sources ajoutent aussi des liens ; à régénérer après la fusion
de tous les lots (§ 6). Le rouge de `doc-ref` aurait pu être évité en renommant le lien « MDN » :
écarté, ce serait truquer un compte qui est juste.

`node tools/verif.js --mutations` n'a pas été lancé (consigne).

## 6. Ce qui reste ouvert

- Les index dérivés (`js/search-index.js`, `js/quiz-index.js`, `pages/etude-recherche.html`…) ne
  sont pas régénérés : le texte de 47 leçons a changé, l'orchestrateur les régénère après fusion.
- **Le cours `doc` est à réassembler** (`node tools/doc/gen.js`) après la fusion de tous les lots :
  ses chiffres de corpus (`doc-ref` 85 → 88 ici ; `doc-rec` 11 → 54 ici) bougent avec chaque lot.
  ⚠️ Et pas seulement les chiffres : `tools/doc/corps/l4.html` écrit, après le nombre de leçons qui
  portent un lien vers l'extérieur, « **Ce site est une île.** » Avec une source liée par « Cas
  réel », la phrase deviendra fausse quand les lots B4 à B12 seront fusionnés (rien que ce lot
  porte le compte de 11 à 54 leçons) : la prose de ce gabarit est à revoir, pas seulement son
  chiffre. Non touché ici (hors de ma part).
- `lecon-17` : le cas d'origine portait sur `<progress>`/`<meter>` ; aucun cas réel sourcé n'a été
  trouvé sur ces éléments, le nouveau cas illustre l'autre notion de la section (le SVG inline).
- `lecon-36` : la date de l'essai sur Google Flights n'est pas donnée par la source ; le titre porte
  l'année de la page (« web.dev, 2023 ») et le texte ne date pas l'essai.
- `lecon-14` : la date de l'annonce de l'Open Graph vient de la presse (TechCrunch, compte rendu en
  direct du 21 avril 2010), faute d'avoir retrouvé le billet de Facebook.
- `lecon-33` : la page de Primer sur les toasts n'est pas datée (citée par lien, fait secondaire du cas).
- Les phrases de liaison à la leçon (dernière phrase de la plupart des cas) sont des explications
  pédagogiques, pas des faits de la source : la contre-relecture peut les distinguer ainsi.
