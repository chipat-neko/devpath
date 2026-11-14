# Rapport V18 — case B4 (lot 1), passe de dédoublonnage : `js` et `html` (copie `b4-dd-js-html`)

Copie de travail `D:\test-claude-dd-js-html`, branche `v18/b4-dd-js-html`, partie de `8fd5290`.
Part traitée : **10 « Cas réel »** (8 en `js`, 2 en `html`), tous EXACTS après la contre-relecture
du lot 1, mais dont le **sujet** est gardé par un autre cours (registre
`tools/cas-reels/lots/foyers.md`) ou, pour `js/lecon-42`, auto-référent. Plus, hors encadré, le
**corps** de `pages/html/lecon-12.html` (`<del>`/`<ins>` → `<s>` pour un ancien prix).
Scripts et copies texte des sources : `scratchpad/b4-dd-js-html/` (ignoré par git) — `nouveaux.js`
(les 10 textes), `remplace.js` (remplacement à l'octet, refuse s'il ne trouve pas exactement un
encadré, vérifie que tout le reste du fichier est identique), `html12.py` (le corps de `html/12`),
`*.txt` (texte des sources ouvertes).

**En une phrase** : les **10 cas sont remplacés** par un vrai cas, sur la même notion, daté et
sourcé à une source primaire ouverte, dont le sujet n'est raconté nulle part ailleurs sur le site ;
`--cas-reel` reste à **0** pour `javascript` et `html`, `lexique-diff` à **0 écart**.

---

## 1. Méthode

1. **Choisir un sujet libre** : lecture de `foyers.md` ; recherche du sujet **et** de l'URL de sa
   source dans tout `pages/` (`grep -ril`) ; `node tools/cas-reels/lots/doublons.js` ; puis
   **réservation** dans le fichier commun `D:\test-claude\scratchpad\v18-parallele\dd-reservations.txt`
   (10 lignes ajoutées, fichier relu après : aucun conflit). Sujets écartés parce que déjà pris :
   l'annulation de fetch (`js/47`), Safari et les sept jours (`js/32`), la lenteur de localStorage
   (`js/12`), le chargement différé natif (`html/04`, `html/07`), Twitter et `scroll` (`js/34`),
   Photoshop sur le web (`html/24`), Node 15 et les rejets non gérés (`js/63`), CrowdStrike
   (`js/30`), la panne Google Cloud de 2025 (`java/19`).
2. **Vérifier chaque phrase** contre la source ouverte (texte enregistré) ; un comportement
   technique se teste : sous Node 24, `node --enable-experimental-regexp-engine` rend `null` pour
   `/(a*)*b/l.exec('a'.repeat(100))` en 3 ms, alors que sans le moteur linéaire `/(a*)*b/` double
   de temps à chaque « a » ajouté (n = 24 : 196 ms ; n = 26 : 772 ms). Le résumé d'un outil de lecture
   web s'est trompé une fois (année de publication d'*Error Cause* donnée « 2023 ») : relu dans le
   fichier brut de TC39, c'est **2022**.
3. **La forme** de la règle (titre `Cas réel — sujet (année)`, source en dernier paragraphe, lien
   seulement dans la ligne de source), structure et type de l'encadré gardés (`callout--note`).
   L'intertitre `<h2>` collé au-dessus de `js/lecon-42` est adapté.
4. **Lexique** : après une première écriture, `lexique-diff` donnait **15 écarts** (mots de
   distracteurs entrés — « cookies », « échoue », « retient », « écouteur », « toutes », « façons »,
   « événement » — ou sortis — « conteneur », « nettoyage », « reconstruire », « lui-même »,
   « passage », « observée », « arrive », « recopie ») ; textes reformulés jusqu'à **0 écart**.

## 2. Cas par cas

| Identifiant | État trouvé | Action | Nouveau titre | Sources ouvertes |
|---|---|---|---|---|
| `pages/js/lecon-11.html#1` | VRAI (contre-relu), produit nommé ; sujet gardé par `react/lecon-07` | remplacé par : jQuery et `.live()` | Cas réel — jQuery renonce à .live() (2011) | https://api.jquery.com/live/ ; https://blog.jquery.com/2011/11/03/jquery-1-7-released/ ; (lu, non cité) https://jquery.com/upgrade-guide/1.9/ |
| `pages/js/lecon-15.html#1` | VRAI, événement daté ; sujet gardé par `python/lecon-17` | remplacé par : Maggie Pint et les défauts de `Date`, puis Temporal | Cas réel — Maggie Pint et les défauts de Date (2017) | https://maggiepint.com/2017/04/09/fixing-javascript-date-getting-started/ ; https://github.com/tc39/proposal-temporal (README) ; https://developer.mozilla.org/en-US/docs/Mozilla/Firefox/Releases/139 ; (lu, non cité) https://developer.chrome.com/release-notes/144 |
| `pages/js/lecon-25.html#1` | VRAI, événement daté ; sujet gardé par `ada/lecon-07` | remplacé par : l'option `cause` des erreurs | Cas réel — l'option cause des erreurs JavaScript (2021) | https://v8.dev/features/error-cause ; https://github.com/tc39/proposals/blob/main/finished-proposals.md |
| `pages/js/lecon-27.html#1` | VRAI, événement daté ; sujet gardé par `regex/lecon-06` | remplacé par : le moteur d'expressions régulières linéaire de V8 | Cas réel — le moteur de regex linéaire de V8 (2021) | https://v8.dev/blog/non-backtracking-regexp |
| `pages/js/lecon-35.html#1` | VRAI, produit nommé ; sujet gardé par `react/lecon-01` | remplacé par : Rich Harris, « Virtual DOM is pure overhead » | Cas réel — Svelte et le coût du DOM virtuel (2018) | https://svelte.dev/blog/virtual-dom-is-pure-overhead |
| `pages/js/lecon-36.html#1` | VRAI, produit nommé ; sujet gardé par `react/lecon-10` | remplacé par : John Hann et l'origine du `debounce` (requêtes XHR) | Cas réel — John Hann et le debounce (2009) | http://web.archive.org/web/20090327060828/http://unscriptable.com:80/index.php/2009/03/20/debouncing-javascript-methods/ (copie archivée du billet) |
| `pages/js/lecon-42.html#1` | VRAI mais **auto-référent** (le site cité comme « Cas réel », source = son propre code) | remplacé par : le composant `dark-mode-toggle` de Google Chrome Labs ; intertitre `<h2>` « Cas réel : le thème de ce site » → « Cas réel : un bouton de thème qui se souvient » | Cas réel — le composant dark-mode-toggle de Google (2019) | https://github.com/GoogleChromeLabs/dark-mode-toggle (README) ; https://github.com/GoogleChromeLabs/dark-mode-toggle/blob/main/src/dark-mode-toggle.mjs (lu dans sa version brute) ; date du dépôt par l'API GitHub (créé le 14/06/2019) et le registre npm |
| `pages/js/lecon-60.html#1` | VRAI, événement daté ; sujet gardé par `wasm/lecon-01` | remplacé par : `source-map` réécrit en Rust/WebAssembly, la réponse de V. Egorov en JavaScript, et la réplique de N. Fitzgerald | Cas réel — source-map, Rust contre JavaScript (2018) | https://hacks.mozilla.org/2018/01/oxidizing-source-maps-with-rust-and-webassembly/ ; https://mrale.ph/blog/2018/02/03/maybe-you-dont-need-rust-to-speed-up-your-js.html ; https://fitzgen.com/2018/02/26/speed-without-wizardry.html ; (nom de l'auteur) https://mrale.ph/ |
| `pages/html/lecon-40.html#1` | VRAI, événement daté ; sujet (IntersectionObserver) gardé par `js/lecon-62` | remplacé par : Chrome annonce le retrait des événements de mutation au profit de `MutationObserver` | Cas réel — Chrome retire les événements de mutation (2023) | https://developer.chrome.com/blog/mutation-events-deprecation (« Last updated 2023-05-31 » ; première copie archivée le 31/05/2023) |
| `pages/html/lecon-45.html#1` | VRAI, événement daté ; sujet gardé par `securite/lecon-04` | remplacé par : l'étude de Michał Bentkowski sur le copier-coller dans les éditeurs riches | Cas réel — Michał Bentkowski et le copier-coller piégé (2020) | http://web.archive.org/web/20200630182726/https://research.securitum.com/the-curious-case-of-copy-paste/ (l'URL d'origine redirige aujourd'hui vers une autre page de Securitum : copie archivée citée) |

Ce que chaque nouveau cas affirme, et d'où :

- **js/11** — `.live()` (jQuery 1.3) attache des écouteurs délégués à `document`, pour les éléments
  « présents et à venir » ; défauts listés par sa documentation : chemin « le plus long et le plus
  lent », `stopPropagation()` sans effet sur les écouteurs plus bas, clic qui ne remonte pas au `body`
  sur iOS pour la plupart des éléments ; jQuery 1.7 (3/11/2011, Dave Methvin) unifie `.on()`/`.off()`,
  `.on()` avec sélecteur délègue ; `.live()` dépréciée en 1.7, retirée en 1.9 (doc).
- **js/15** — billet de Maggie Pint (9/4/2017, SRE Azure chez Microsoft) : Eich, en 1995, « make it
  like Java », copie de `java.util.Date` dont presque toutes les méthodes sont dépréciées en Java 1.1
  (1997) ; les six défauts dans l'ordre du billet ; mutabilité et analyse non corrigibles (« web
  compatibility and web reality ») ; README de Temporal : Maggie Johnson-Pint parmi les porteurs
  (*champions*), le billet cité pour les motivations, « All Temporal objects are immutable »,
  Firefox 139 le 27/05/2025 (aussi MDN), Chrome 144 le 13/01/2026.
- **js/25** — page « Error causes » (Victor Gomes, 7/7/2021) : le problème des deux traitements, la
  classe d'erreur maison « laborieuse », aucun outil capable d'un diagnostic utile, « a standard way to
  chain errors », V8 9.3, Chrome 93, Firefox 91, Safari 15 ; TC39 : *Error Cause*, publication 2022.
- **js/27** — billet de Martin Bidlingmaier (11/1/2021) : moteur expérimental depuis V8 8.8, Irregexp
  à retour arrière, `/(a*)*b/.exec('a'.repeat(100))` qui ne finit pas « within our lifetimes »,
  temps linéaire garanti, pas de références arrière ni de *lookahead*/*lookbehind*, Irregexp des
  ordres de grandeur plus rapide sur la plupart des motifs, drapeau `l` et secours après 50 000
  retours arrière par défaut.
- **js/35** — billet de Rich Harris (27/12/2018) : opérations du DOM virtuel « in addition to » celles
  du vrai DOM, « usually fast enough », l'exemple `HelloMessage` (« world » → « everybody »), les trois
  étapes du diff, seule la troisième utile « in the vast majority of updates », Svelte compilateur et
  le code `if (changed.name) text.data = name` « almost exactly » généré.
- **js/36** — billet de John Hann (20/3/2009) : application de 2006, panneau latéral chargé par XHR à
  chaque champ (jusqu'à plus de 100 kB), centaines de champs, touche Tab, serveur « hammered »,
  l'anti-rebond venu de l'électronique, debounce ≠ throttle, le `setTimeout` annulé et relancé à chaque
  appel, ses tests : debounce meilleur que throttle pour réduire les requêtes XHR.
- **js/42** — dépôt de Google Chrome Labs (© 2019) : élément personnalisé, suit `prefers-color-scheme`
  par défaut, attribut `permanent` ; dans le code : clé `dark-mode-toggle`, `getItem` à
  l'initialisation avec contrôle `"dark"`/`"light"`, `setItem` quand le mode change et que
  `permanent` est posé, `removeItem` quand la case est décochée, chaque accès dans un `try…catch`
  qui ne fait rien (« Do nothing. The user probably blocks cookies. »).
- **js/60** — Nick Fitzgerald (Mozilla Hacks, 18/1/2018) : avec Tom Tromey, les parties de l'analyseur
  sensibles à la performance réécrites en Rust → WebAssembly, `source-map` téléchargée 10 M de fois
  par semaine, « up to 5.89 times faster » sur des *source maps* réelles ; Vyacheslav Egorov
  (février 2018 ; « Feb 3 » en tête, « publication of this post on February 19th » dans le texte,
  d'où « février ») : tri de sous-tableaux, moyenne V8 4 810 → 1 143,5 ms, « factor of 4 », refuse de
  déclarer la parité ; Fitzgerald (26/2/2018) : Egorov « specializes in JIT compilers », allocations
  évitées, chemins rapides du JIT, Rust/Wasm encore accéléré, 5,3× Chrome, 10,8× Firefox,
  9,4× Safari, performance fiable sans « wizard-level shenanigans ».
- **html/40** — billet de Mason Freed (mis à jour le 31/5/2023) : liste des événements, « very old part
  of the DOM level 2 spec », trois défauts (trop fréquents, un par nœud retiré ; lents ; plantages et
  failles), dépréciés en 2011, `MutationObserver` construit en 2012 pour les remplacer et pris en
  charge par tous les navigateurs modernes depuis 2013, retrait prévu à partir de Chrome 127 (stable
  le 23/7/2024), un seul appel pour toutes les mutations d'un arbre. ⚠️ Première écriture : « La
  spécification les a dépréciés » — le motif `/la sp[ée]cification/i` fait entrer la leçon dans deux
  compteurs que publie le cours `doc` (« leçons parlant de la spécification » 39 → 40, « leçons qui
  renvoient à un document » 106 → 107) : `verif-doc` et `verif-normatif` rougissaient. Reformulé
  (« La norme les a dépréciés ») : les deux compteurs reviennent à leur valeur publiée.
- **html/45** — étude de Michał Bentkowski (2/6/2020, Securitum) : le scénario (Gmail en exemple),
  `preventDefault()` + `clipboardData.setData('text/html', …)` dans un gestionnaire de copie,
  assainissement au collage, au moins un contournement dans Chromium, Firefox, Safari et l'ancien
  Edge, éditeurs JavaScript fautifs même sur un navigateur sûr, `--!>` ignoré par TinyMCE et
  CKEditor 4, Froala et ses expressions régulières (« almost always a bad idea »), 4 + 5 failles,
  plus de 30 000 $ de primes.

## 3. Hors encadré : le corps de `pages/html/lecon-12.html`

Norme ouverte : WHATWG, https://html.spec.whatwg.org/multipage/text-level-semantics.html#the-s-element
(« The s element represents contents that are no longer accurate or no longer relevant » ; « not
appropriate when indicating document edits » ; exemple d'un prix de vente conseillé barré) et
https://html.spec.whatwg.org/multipage/edits.html (« The ins and del elements represent edits to the
document »).

- Section 3 : intertitre « 3. mark, small, del et ins » → « 3. mark, small, s, del et ins » ; la phrase
  de présentation dit maintenant « Quatre besoins » et présente `<s>` (« un contenu qui n'est plus
  exact ou plus pertinent, comme un ancien prix ») puis `<del>`/`<ins>` (« une modification du
  document : un texte supprimé du document, un texte ajouté au document »).
- L'exemple : `<p>Prix : <s>30&nbsp;€</s> 19&nbsp;€.</p>` (le nouveau prix reste du texte) ; son
  `<title>` devient « mark, small, s » ; sa légende : « surligne en jaune et barre l'ancien prix ».
- Antisèche de la leçon : ligne `<s>` ajoutée (« Contenu qui n'est plus exact (ancien prix) ») ;
  `<del>`/`<ins>` : « Texte supprimé du document / ajouté ». Récapitulatif : `<s>` ajouté
  (« contenu périmé et modifications du document »).
- Fiche d'atelier de la section 7 **gardée** (un tarif modifié sur la fiche est une modification du
  document). Sa légende comptait « sept balises sémantiques » : la fiche en utilise **neuf** de cette
  leçon (`abbr`, `strong`, `time`, `del`, `ins`, `mark`, `kbd`, `small`, `cite`) → « neuf balises
  sémantiques de cette leçon ».
- Glossaire inchangé (« Marquent un contenu supprimé (barré) et un contenu ajouté » ne contredit pas).
- QCM (3 questions) et exercices (`data-exos`, 3) : aucun ne porte sur `<del>`, `<ins>` ou `<s>` ;
  rien à changer. L'antisèche du site (`js/antiseches-data.js`) est un index dérivé du tableau de la
  leçon : non touché, à régénérer.
- L'encadré « Cas réel » de la leçon (corrigé au lot 1) disait déjà que la norme prend `<s>` pour un
  ancien prix : le corps et l'encadré sont maintenant d'accord.

## 4. Décomptes

- « Cas réel » traités : **10** — remplacés **10**, corrigés 0, gardés tels quels 0, renommés
  « Scénario » 0. État trouvé : 10 VRAIS (9 gardés ailleurs par un autre cours, 1 auto-référent).
- Nature des nouveaux sujets : 6 produits ou fonctionnalités datés (jQuery, `Error.cause`, moteur
  V8, `dark-mode-toggle`, Temporal par le billet fondateur, retrait des événements de mutation),
  4 récits ou études d'auteurs nommés (Pint, Harris, Hann, Bentkowski) et un débat en trois billets
  (`source-map`).
- Sources citées dans les encadrés : **17 URL**, toutes ouvertes (dont 2 copies archivées : billets
  dont l'URL d'origine n'existe plus ou redirige). Ouvertes en plus pour vérifier : guide de migration
  de jQuery 1.9, notes de version de Chrome 144, page d'accueil de mrale.ph (nom de l'auteur), article
  web.dev sur `prefers-color-scheme` (ne nomme pas `localStorage` : non cité), API GitHub et registre
  npm (date du dépôt `dark-mode-toggle`), norme WHATWG § 4.5.5 et § 4.7 (pour `html/12`).
- Longueur des récits : 143 à 195 mots, titre compris.
- Commits : `46cb775` (js, 8 cas), `67969ef` (html, 2 cas + corps de `html/12`), puis un dernier
  commit (reformulation de `html/40` pour les compteurs du cours `doc`, et ce rapport).

## 5. Contrôles (sur la copie, après le dernier changement de page)

| Contrôle | Code |
|---|---|
| `node tools/verif-contenu.js --cas-reel --cours=javascript` | 0 (66 conformes) |
| `node tools/verif-contenu.js --cas-reel --cours=html` | 0 (48 conformes) |
| `node tools/verif-contenu.js --strict` | 0 |
| `node tools/verif-html.js` | 0 |
| `node tools/verif-domaines-interdits.js` | 0 |
| `node tools/verif-qcm-lexique.js` | 0 |
| `node tools/verif-qcm-biais.js` | 0 |
| `node tools/cas-reels/lots/lexique-diff.js D:\test-claude-dd-js-html 8fd5290` | 0 écart (11 pages) |
| `node tools/cas-reels/lots/controle-branche.js D:\test-claude-dd-js-html 8fd5290` | 1 seul « problème » : `html/lecon-12.html` diffère hors « Cas réel » — c'est le changement de corps demandé |
| 0 CR dans les 11 pages modifiées (node) | oui |
| `node tools/doc/verif-doc.js` · `node tools/doc/verif-normatif.js` | 41/41 · 75/75 (après la reformulation de `html/40`) |
| `node tools/verif.js --rapide` | 1 — 53/54 verts (233,2 s) ; seul rouge : `donnees`, invariant **I18** (5 erreurs, toutes « index dérivé périmé » : `search-index.js` et `antiseches-data.js` divergent du contenu regénéré, entrée de l'antisèche « Mémo : les balises de texte en ligne » de `html/12`) — toléré, régénéré par l'orchestrateur. Premier passage, avant la reformulation de `html/40` : 3 rouges (`donnees` I18, `doc-ref`, `normatf`, voir § 2) |

## 6. Doutes, et ce qui reste ouvert

- **`js/lecon-42`** : le nouveau sujet est le code d'un produit, pas un événement ; sa date tient à
  l'en-tête « © 2019 » du fichier et à la création du dépôt (API GitHub, 14/06/2019). Le README ne
  nomme pas `localStorage` : tout ce qui touche au stockage vient du code source (version actuelle de
  `main`), cité par lien.
- **`html/lecon-40`** : la page de Chrome ne donne qu'une date de mise à jour (31/05/2023) ; le texte
  dit donc « mis à jour le 31 mai 2023 » et « prévoit de les retirer » : je n'ai pas ouvert de source
  primaire qui confirme le retrait effectif dans Chrome 127.
- **`js/lecon-60`** : date du billet d'Egorov ambiguë (3 ou 19 février 2018) → « février 2018 ».
- **`js/lecon-27`** : le moteur linéaire de V8 parle de retour arrière, comme le foyer `regex/lecon-06`
  (Cloudflare) ; sujet différent (un moteur JavaScript), mais le lot du cours `regex` (B11) ne devra
  pas le reprendre.
- **`html/lecon-12`** : j'ai aussi changé l'intertitre de la section 3 (il nomme maintenant `s`) et
  corrigé le compte de la légende de la fiche (sept → neuf), qui était faux avant ce lot.
- **Sources partagées restantes** vues par `doublons.js`, hors de ma part : `js/lecon-04` et
  `js/lecon-29` citent encore https://react.dev/blog/2023/03/16/introducing-react-dev, comme
  `react/lecon-10` (sujets différents : à trancher par l'orchestrateur).

## 7. Pour la fusion

- Branche `v18/b4-dd-js-html`, partie de `8fd5290` ; 11 pages (`js/11, 15, 25, 27, 35, 36, 42, 60`,
  `html/12, 40, 45`) et ce rapport. Seul écart hors « Cas réel » : le corps de `html/lecon-12` (voulu).
- Régénérer les index dérivés : `node tools/build-index.js --write --only=quiz,flashcards,search,antiseches`
  (le tableau de `html/12` change l'antisèche ; les textes changent l'index de recherche).
- À ajouter au registre `foyers.md` (sujets que d'autres cours pourraient vouloir) :
  jQuery `.live()` (`js/lecon-11`) ; Maggie Pint et Temporal (`js/lecon-15`) ; `Error.cause`
  (`js/lecon-25`) ; moteur de regex linéaire de V8 (`js/lecon-27`) ; « Virtual DOM is pure overhead »
  (`js/lecon-35`) ; le debounce de John Hann (`js/lecon-36`) ; `dark-mode-toggle` (`js/lecon-42`) ;
  `source-map` Rust/Wasm contre JavaScript (`js/lecon-60`) ; retrait des événements de mutation
  (`html/lecon-40`) ; le copier-coller de Bentkowski (`html/lecon-45`).
- La contre-relecture peut partir des copies texte des sources, dans `scratchpad/b4-dd-js-html/`.
