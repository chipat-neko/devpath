# Syntaxe — Feuille de route des « gros projets »

Programme décidé par Noah (2026-06-16). À mener **en autonomie**, **un chantier à la fois**, sans
rien casser, en vérifiant chaque étape (délimiteurs équilibrés, 0 BOM, 0 mojibake réel). Le cron de
réveil sert de relais entre les sessions : **reprendre au premier chantier non terminé**.

Principe du site à préserver autant que possible : **statique, vanilla (HTML/CSS/JS sans framework),
ouvrable en `file://`, progression privée en `localStorage`, aucun fetch**. Les chantiers qui
dérogent à ce principe sont signalés ⚠️.

---

## Ordre d'exécution (du plus sûr/fondateur au plus lourd)

### G1 — Export / import de progression  ✅ priorité immédiate, 100 % statique
La brique « synchronisation sans serveur ». Sur la page *Ma progression* : bouton **Exporter**
(télécharge un JSON de `syntaxe-progress` + `syntaxe-quiz` + `syntaxe-last`) et **Importer**
(relit un JSON, fusionne dans `localStorage`, recharge). Téléchargement via `Blob` +
`URL.createObjectURL` + `<a download>` ; import via `<input type="file">` + `FileReader`.
Fichiers : `progression.html`, `progression.js`, CSS. **Faisable file://.**

### G2 — Recherche plein-texte de tout le contenu  ✅ FAIT (2026-06-16)
Index pré-généré `js/search-index.js` = `window.SEARCH_INDEX` (832 entrées `{d,f,t,x}`, ~8 Mo,
texte intégral nettoyé de chaque `<article class="prose">`, JSON valide vérifié). Page dédiée
`pages/recherche.html` + moteur `js/recherche.js` (normalisation NFD, tokens AND, score titre>texte,
snippets surlignés `<mark>`, `?q=` partageable, debounce 180 ms, focus auto). CSS `.fts-*` dans
`pages.css`. Lien depuis `catalogue.html` (`.catalogue-toolbar__foot` + `.fts-cta`). 100 % statique.
**⚠️ Régénérer `search-index.js` quand le contenu des leçons change** (script PowerShell : lit
`<h1 class="lesson-header__title">` + `<article class="prose">`, nettoie, échappe `\` et `"`, écrit
UTF-8 sans BOM ; voir l'historique de session / la mémoire pour le script exact).

### G3 — Playground « bac à sable »  ✅ FAIT (2026-06-16)
`pages/playground.html` (3 `<textarea>` HTML/CSS/JS + `<iframe sandbox="allow-scripts">`) +
`js/playground.js` : construit un document complet et l'injecte via `frame.srcdoc`, aperçu en direct
(debounce 300 ms), **sauvegarde en `localStorage` `syntaxe-playground`**, bouton « Réinitialiser
l'exemple » (exemple par défaut HTML/CSS/JS). CSS `.playground`/`.pg-*` (grid 2 colonnes, aperçu
collant, responsive < 860px). Liens ajoutés au **footer de l'accueil** (Recherche + Bac à sable).
Partage par URL non implémenté (URLs base64 trop longues) — la persistance locale suffit. **file:// OK.**

### G4 — Export d'un cours complet en PDF  ✅ FAIT (2026-06-16)  ⚠️ HTTP recommandé
Page générique `pages/imprimer.html?cours=<dir>` + `js/imprimer.js` : lit la liste des leçons dans
`SITE_DATA`, **fetch** chaque `<dir>/lecon-XX.html`, extrait le `.prose` + titre via `DOMParser`,
assemble en sections, puis `window.print()` (réutilise le `@media print`). Lien « Version imprimable
du cours (PDF) » ajouté par `cours.js` (`renderPrintLink` → `.start-card__print`). CSS `.print-*`.
**Choix : assemblage côté client (pas 65 fichiers dupliqués = ~15 Mo évités).** ⚠️ `fetch` bloqué en
`file://` → **repli clair** (message « sers le site en HTTP, ex. `python -m http.server` » + liste de
liens vers chaque leçon, dont l'impression individuelle marche déjà en file://). Variante EPUB : plus tard.

### G5 — Exercices exécutables multi-langages  ⚠️ nécessite HTTP (pas file://)
Étendre l'exécution au-delà du JS (déjà fait via `runner.js`).
- **G5a — Python (Pyodide) ✅ FAIT (2026-06-16).** `runner.js` étendu (purement additif) : détecte
  `code.language-python` (sauf sessions REPL `>>>`) → bouton « Tester » → `activatePython` →
  `runPython` exécute dans un **Web Worker** (`PY_WORKER_SRC`) qui `importScripts` Pyodide
  v0.26.2 depuis le CDN jsDelivr, `loadPackagesFromImports` (auto-charge numpy… des imports) puis
  `runPythonAsync`, capture `setStdout`/`setStderr`. Timeout 15 s → `terminate` (anti-boucle).
  Worker partagé (Pyodide chargé une fois). Repli clair si chargement KO (file:// / hors-ligne).
  Actif sur les 23 leçons `python` + 17 `python-avance` (runner.js déjà chargé partout) — **0 HTML édité**.
  ⚠️ **Non testé** (pas de navigateur/HTTP dans l'environnement cron) → à valider en servant le site
  en HTTP. Équilibre vérifié ({}119/119, l'écart de 1 paren = `\(` du regex BROWSER_ONLY).
- **G5b — SQL (sql.js) ✅ FAIT (2026-06-16).** `runner.js` étendu : blocs `code.language-sql`
  contenant une vraie requête (SELECT/INSERT/CREATE/…) → bouton « Exécuter » → `activateSql`/`runSql`
  dans un **Web Worker** (`SQL_WORKER_SRC`) qui `importScripts` sql.js v1.10.3 (jsDelivr/npm),
  `initSqlJs` + db SQLite. **Base de démo seedée** (`SEED_SQL` : clients/produits/commandes/
  lignes_commande, reconstituée des `CREATE TABLE` réels des leçons) chargée **quand le bloc ne crée
  pas ses propres tables** (`/CREATE TABLE/i` → db vide, sinon seed) → les SELECT des leçons marchent.
  db neuve par exécution (état prévisible). Résultats rendus en `<table class="runner-table">`
  (CSS dans components.css, thème sombre). Timeout 10 s, repli file://. Actif sur les 19 leçons `sql`,
  **0 HTML édité**. ⚠️ **Non testé** (HTTP requis). Équilibre runner.js OK ({}181/181).
- **G5c — brancher sur les exercices `data-exos`** (type:code Python/SQL avec `run:{expect}`) : optionnel, plus tard.

### G6 — Internationalisation (multilingue)  ✅ INFRASTRUCTURE FAITE (2026-06-16)
Fondation i18n dans `js/main.js` (chargé partout, aucun fichier i18n séparé → 100 % file://) :
- Bouton **FR/EN** (`.lang-toggle`) injecté dans `.header-actions` de chaque page ; langue mémorisée
  en `localStorage` `syntaxe-lang`.
- `applyI18n(lang)` : (a) traduit les éléments `[data-i18n="clé"]` via le dico `I18N` (le FR d'origine
  est sauvegardé dans `data-i18n-fr` pour revenir en arrière) ; (b) traduit **navigation, fil d'Ariane,
  pied de page** via `NAV_FR_EN` par leur **texte FR d'origine** — donc **sans éditer les 70+ pages**.
- Démo : l'accueil (`index.html`) est instrumenté (`data-i18n` sur kicker, titre, accroche, 2 CTA, 3 stats).
- CSS `.lang-toggle` (components.css).

**Limite assumée** : seuls l'UI commune + l'accueil sont traduits. La traduction du **contenu des 832
leçons** est colossale et **peu pertinente pour un public francophone** (Noah) → laissée comme chantier
progressif. L'infrastructure est prête si on veut instrumenter d'autres pages (ajouter `data-i18n` +
entrées dans `I18N`). Non testé en navigateur (vérif statique : main.js équilibré 137/137).

### G7 — Comptes & synchronisation cloud  ✅ ABSTRACTION + DOC FAITES (2026-06-16)  ⚠️ backend = hors autonomie
La progression suivrait l'utilisateur sur tous ses appareils. **Impossible sans backend** (que je ne
peux pas héberger). Livré la part faisable :
- **`js/sync.js`** (= `window.SyntaxeSync`, **non chargé par défaut** — retiré de `progression.html` au point C3 car code mort sans backend ; ré-ajouter la balise `<script>` pour l'activer) : `snapshot()` (lit toute la
  progression locale : progress + quiz + last + lang), `merge(local, remote)` (**fusion sans perte** :
  union des leçons faites, **meilleur** score de QCM par créneau, langue/last conservés), `restore(snap)`
  (réécrit en local), `setAdapter({pull, push})` + `sync()` (pull distant → merge → restore → push).
  Aucun appel réseau par défaut (statique). C'est la version « sans serveur » ; l'export/import (G1) en
  est déjà la synchro **manuelle**.
- **Contrat backend à implémenter (côté Noah/hébergeur) pour activer la synchro auto :**
  - Un adaptateur JS : `pull(): Promise<snapshot>` (GET l'état du compte), `push(snapshot): Promise`
    (PUT l'état fusionné). Le brancher : `SyntaxeSync.setAdapter(monAdapter); SyntaxeSync.sync();`.
  - Serveur minimal : auth par utilisateur (token/session, **HTTPS**), 2 routes — `GET /api/progress`
    → renvoie le dernier `snapshot` du compte ; `PUT /api/progress` ← reçoit le `snapshot` fusionné et
    le stocke. Un *backend-as-a-service* (table `users` + colonne JSON `snapshot`) suffit.
  - Flux : à la connexion → `setAdapter` + `sync()` ; après chaque leçon terminée / QCM → `sync()` (ou
    `push(snapshot())`). La fusion garantit qu'aucune progression n'est perdue entre appareils.
- **Non testé** (pas de backend) ; `sync.js` vérifié statiquement ({}44/44). Le **serveur réel reste à
  la charge de Noah / d'un hébergeur** — c'est la seule partie non réalisable en autonomie.

---

## Suivi — Lot 1
- **G1→G7 : ✅ TERMINÉS** (dans la limite du faisable en autonomie). + extensions : console Python/SQL,
  audit de cohérence, README à jour. Restes hors autonomie : backend (G7), validation HTTP de G4/G5.

---

# LOT 2 — 10 nouveaux gros projets (Noah, 2026-06-17)

Même méthode : **un projet à la fois**, soigneusement, tout vérifié (délimiteurs équilibrés, 0 BOM,
0 mojibake, `ConvertFrom-Json` des blocs JSON). 100 % statique / `file://` sauf mention ⚠️. Le cron
reprend **au premier projet P non terminé**. Tout s'appuie sur l'existant (progression `localStorage`,
glossaires, QCM, runner, recherche…).

### P1 — Gamification : XP, niveaux & succès  ✅ FAIT (2026-06-17)
Logique dans **`main.js`** (chargé partout, comme l'i18n) → `window.SyntaxeXP` : `compute()` (XP =
leçons terminées ×10 + scores QCM ×2 / bilans ×3, **calculé depuis `syntaxe-progress` + `syntaxe-quiz`**,
aucune nouvelle clé) et `levelInfo(xp)` (niveaux progressifs `50·(L-1)²`, titres Curieux→Maître).
`initXP()` injecte un **badge « ★ Niv. N » + mini-barre** dans `.header-actions` de chaque page (si
XP>0 ; lien vers progression via le href de la nav). **`progression.js`** `renderGamification()` →
panneau `.xp-panel` (niveau, titre, barre XP, « X/Y vers niveau N+1 ») + grille de **10 succès**
`.achievements` (Premiers pas, Studieux, Marathonien, Encyclopédiste, Premier cours, Polyglotte,
Sans faute, As des QCM, Niveau 5, Niveau 10) dérivés de l'état. CSS `.xp-badge` (components.css) +
`.xp-panel`/`.achievements` (pages.css). Conteneur `#dash-gamification` dans progression.html.
100 % file://. Vérifié (équilibré, 0 BOM/mojibake). ⚠️ Les succès « cours terminés » nécessitent
`SITE_DATA` (présent sur progression.html) ; le badge en-tête, lui, marche partout (XP seul).

### P2 — Flashcards & révision espacée  ✅ FAIT (2026-06-17)
Index `js/flashcards-data.js` = `window.FLASHCARDS` (**455 cartes** `{c:dir, ct:titre, t:terme, d:déf HTML}`
générées par script depuis les `<dl class="glossary">` des 65 `cours.html` ; ~60 Ko ; JSON validé).
Page `pages/revision.html` + `js/revision.js` : **système de Leitner** (5 boîtes, intervalles
`[0,1,3,7,16]` jours), échéances en `localStorage` `syntaxe-revision` (`{cardId:{box,due}}`,
cardId = `dir|terme`). Filtre par cours, carte recto (terme) → « Voir la définition » → verso (déf, avec
`<code>`) → auto-évaluation **« À revoir »** (box→1) / **« Je savais »** (box+1, échéance repoussée).
Stats de session. CSS `.rev-*` (+ `.container--narrow`) dans pages.css. Lien depuis le footer accueil.
100 % file://. Vérifié (équilibré, 0 BOM/mojibake). ⚠️ Régénérer `flashcards-data.js` si les glossaires changent.

### P3 — Tableau de bord statistiques enrichi  ✅ FAIT (2026-06-17)
`lecon.js` `recordLast()` **logge l'activité par jour** dans `localStorage` `syntaxe-activity`
(`{"AAAA-MM-JJ": count}`, +1 par visite de leçon). `progression.js` `renderStatsCharts()` (conteneur
`#dash-charts` ajouté à progression.html, rendu en tête) : **heatmap SVG maison** des 13 dernières
semaines (grille 13×7, intensité `hm-l0..4` en couleur), **série en cours** (`currentStreak`, jours
consécutifs, tolère « aujourd'hui pas encore actif ») et **jours actifs** (réutilise `stat()`). CSS
`.heatmap`/`.hm-l*`/`.heatmap__legend` (fill SVG + légende) dans pages.css. La heatmap se remplit avec
le temps (pas d'historique rétroactif). 100 % file://. Vérifié (équilibré, 0 BOM/mojibake).

### P4 — Annotations & notes personnelles  ✅ FAIT (2026-06-17)
Intégré dans **`lecon.js`** `initNotes()` (pas de fichier séparé → 0 édition des 832 leçons) :
- **Surlignage** : sélectionner un passage de `.prose` fait apparaître un **bouton flottant
  « Surligner »** (`.hl-fab`) ; le **texte** sélectionné est stocké (robuste, pas de position DOM) et
  ré-appliqué au chargement via `highlightText()` (TreeWalker + `range.surroundContents`). Clic sur un
  `<mark class="user-hl">` → confirmation → suppression.
- **Note libre** : panneau repliable « Ma note » (`<details class="lesson-note">` + textarea) inséré
  après le contenu, sauvegarde auto (debounce 400 ms).
- Stockage `localStorage` `syntaxe-notes` = `{courseId:{lessonFile:{note, hl:[textes]}}}` (entrée
  supprimée si vide). Page récap **`pages/notes.html`** + **`js/notes-page.js`** (groupé par cours,
  titres via `SITE_DATA`, liens vers les leçons). CSS `.lesson-note`/`.hl-fab`/`mark.user-hl`/`.notes-*`.
  `@media print` masque `.lesson-note`/`.hl-fab`. Lien footer accueil. 100 % file://. Vérifié.

### P5 — Parcours de défis / katas auto-corrigés  ✅ FAIT (2026-06-17, JS)
`js/defis-data.js` = `window.DEFIS` (**10 défis JS progressifs** Échauffement→Défi : inverse, somme,
maxi, pairs, voyelles, palindrome, capitaliser, sansDoublons, fizzbuzz, factorielle ; chacun `{id,
titre, niveau, enonce(HTML), fn, depart(code), tests:[{args, expect}]}`). Page `pages/defis.html`
(liste + zone défi) + `js/defis.js` : éditeur, bouton **Valider** → exécution du code + tests dans un
**Web Worker isolé** (`TEST_WORKER` : `eval` le code, récupère `fn`, compare `JSON.stringify(got)` vs
`expect`), coupe-circuit 3 s. Résultats test par test (✓/✗, attendu/obtenu), **défi marqué résolu**
(`localStorage` `syntaxe-defis`) quand tous passent. CSS `.defis-*`. Lien footer accueil. 100 % file://
(JS). Vérifié (équilibré, 0 BOM/mojibake ; defis-data.js = JS à clés non quotées, pas du JSON pur →
valider par délimiteurs, pas ConvertFrom-Json). ⚠️ Variante Python/SQL des défis (Pyodide/sql.js) = HTTP, non faite.

### P6 — Examen blanc chronométré (QCM transversal)  ✅ FAIT (2026-06-17)
`js/quiz-index.js` = `window.QUIZ_BANK` (**3015 questions** `{q, a:[], k:correct, e:explain, c:dir}`
extraites par script des **897 blocs** `data-quiz`/`data-quiz-bilan` des 832 leçons ; ~1,45 Mo ; JSON
validé). Page `pages/examen.html` (charge data.js pour les titres + quiz-index.js) + `js/examen.js` :
écran **réglages** (10/20/30 questions, filtre par cours), puis **quiz chronométré** (30 s/question,
minuteur décompté, options mélangées, navigation préc./suiv., barre de progression), puis **résultat**
(score, %, message) + **correction détaillée** (✓/✗, ta réponse, bonne réponse, explication). CSS
`.exam-*`. Lien footer accueil. 100 % file://. Vérifié (JSON valide ; les écarts ()/[] = ponctuation
dans le texte des questions ; 1 « mojibake » = question pédagogique « CafÃ© » sur l'encodage = OK).
⚠️ Régénérer `quiz-index.js` si les blocs `data-quiz` changent.

### P7 — Comparateur de syntaxe multi-langages  ✅ FAIT (2026-06-17)
`js/syntaxes.js` = `window.SYNTAXES` (`langs` [JavaScript, Python, Java, C, Go, Rust] × `tasks` [8 :
print, var, if, for, func, array, while, string] = **48 snippets** dans `code[task][lang]`). Page
`pages/comparateur.html` + `js/comparateur.js` : barre de **tâches** (boutons), au clic → **grille**
d'une carte par langage (`.cmp-card` : nom + `<pre>` du code, fond sombre, `white-space:pre`). CSS
`.cmp-*`. Lien footer accueil (a remplacé « Git & GitHub » déjà présent en colonne Cours). 100 % file://.
Vérifié (syntaxes.js {} 61/61 () 55/55 — snippets équilibrés, 0 BOM/mojibake). Extensible : ajouter
une tâche/un langage = éditer `syntaxes.js`.

### P8 — Fiches de révision (antisèches) imprimables  ✅ FAIT (2026-06-17)
Page unique `pages/antiseches.html` avec **4 antisèches** (JavaScript, Python, HTML, CSS), chacune un
`<article class="cheat" data-sheet>` contenant un **`.cheat-grid` multi-colonnes** (CSS `columns:280px`,
`break-inside:avoid`) de ~7-8 `.cheat-card` thématiques (`<dl>` terme→`<code>`). `js/antiseches.js` :
**onglets** (`.cheat-tab` affiche une fiche, masque les autres) + bouton **« Imprimer cette fiche »**
(`window.print()`). `@media print` masque `.cheat-bar` → seule la fiche affichée s'imprime (les autres
sont `hidden`). CSS `.cheat-*`. Lien footer accueil. 100 % file://. Vérifié (équilibré, dt/dd 83/83,
0 BOM/mojibake). Extensible : ajouter un `<article>` + un onglet pour un nouveau langage. (Choix : 4
langages phares plutôt qu'une fiche par cours — au-delà des glossaires déjà présents sur les 65 cours.)

### P9 — Visualisations interactives d'algorithmes  ✅ FAIT (2026-06-17)
`pages/visualisations.html` + `js/visualisations.js` : **visualiseur de tris animés** maison (DOM, sans
lib) — **3 algos** (tri à bulles, par sélection, par insertion). Méthode : on **instrumente** l'algo
(`genBubble/Selection/Insertion` → liste d'étapes `{t:cmp|swap|sorted|allSorted, i, j}`) puis on
**rejoue** l'animation sur 34 barres (`.viz-bar`, hauteur = valeur) : barres comparées en or
(`is-active`), triées en vert (`is-sorted`), compteurs comparaisons/échanges en direct. Contrôles :
choix de l'algo (+ description), **vitesse** réglable, « Mélanger », « Lancer/Pause/Reprendre/
Recommencer ». CSS `.viz-*`. Lié au cours `algo` + footer accueil. 100 % file://. Vérifié (équilibré,
0 BOM/mojibake). (Choix : tris animés — les plus visuels ; graphes/arbres/hachage = extension future.)

### P10 — PWA & vrai hors-ligne  ✅ FAIT (2026-06-17)  ⚠️ SW = HTTP requis
`manifest.webmanifest` (racine : name, icons SVG favicon, `display:standalone`, theme/background,
`start_url`/`scope`) + `sw.js` (racine : service worker — pré-cache de la **coquille** [index, 5 CSS,
theme/main/data.js, favicon] à l'install, puis **cache à la volée** des pages/ressources visitées au
fetch ; stratégie cache-first + MAJ réseau ; nettoie les vieux caches à l'activate). Enregistrement
dans `main.js` `initPWA()` : **injecte le manifest** dynamiquement (préfixe vers la racine déduit du
href du favicon → couvre les 70+ pages sans les éditer) et **enregistre le SW uniquement en http(s)**
(jamais en `file://`). ⚠️ **Non testable ici** (file://) — à valider en servant le site en HTTP/HTTPS
(le SW ne s'enregistre qu'en HTTPS ou http://localhost). Vérifié statiquement (main.js {} 69/69, sw.js
{} 15/15, manifest JSON valide, 0 BOM/mojibake).

### Suivi Lot 2
- **P1→P10 : ✅ TOUS FAITS (2026-06-17).** Gamification, flashcards, stats/heatmap, notes/surlignage,
  katas, examen, comparateur, antisèches, visualisations de tris, PWA. ⚠️ À valider en HTTP : P5
  (variante Python/SQL), P10 (SW). Voir `gros-projets-roadmap.md`.

---

# LOT 3 — 10 nouveaux gros projets (Noah, 2026-06-17)

Même méthode : **un projet à la fois** (notés **R1→R10**), soigneusement, tout vérifié (délimiteurs,
0 BOM, 0 mojibake, ConvertFrom-Json des blocs JSON). 100 % statique / `file://` (aucun ⚠️HTTP ce lot).
Réutilise l'existant. Le cron reprend **au premier projet R non terminé**.

### R1 — Boîte à outils du développeur  ✅ FAIT (2026-06-17)
`pages/outils.html` + `js/outils.js` : **6 mini-outils** dans une grille `.tools-grid`, chacun une IIFE
autonome — formateur/validateur **JSON** (`JSON.parse`+`stringify`, formater/compacter), **Base64**
(UTF-8 via `TextEncoder`/`btoa`), **URL** (`encode/decodeURIComponent`), **convertisseur de bases**
(bin/oct/déc/hex via `parseInt`/`toString` + validation par regex), **compteur** caractères/mots/lignes
(en direct), **générateur de mot de passe** (longueur réglable, options maj/chiffres/symboles, sans
caractères ambigus, copie presse-papiers). CSS `.tool-*`. Lien footer accueil. 100 % file://. Vérifié
(outils.js {} 40/40 () 179/179, 0 BOM/mojibake).

### R2 — Testeur de regex interactif  ✅ FAIT (2026-06-17)
`pages/regex-test.html` + `js/regex-test.js` (lié au cours `regex`) : champ **motif** + **drapeaux**
(g/i/m/s, cases à cocher) + **texte** → correspondances **surlignées** en direct (`<mark>`, surlignage
calculé sur intervalles puis échappement HTML), **liste des correspondances** avec index et **groupes
capturés** (« (non capturé) » si `undefined`), **gestion des motifs invalides** (try/catch sur
`new RegExp`), garde anti-boucle (5000 + `lastIndex++` sur match vide). Aide-mémoire des symboles
repliable. CSS `.rx-*`. Lien footer + renvoi au cours regex. 100 % file://. Vérifié (regex-test.js
{} 16/16 () 71/71, 0 BOM/mojibake).

### R3 — Visualiseur de structures de données  ✅ FAIT (2026-06-17)
`pages/structures.html` + `js/structures.js` : **4 structures** via onglets `.ds-tab` —
**pile** (empiler/dépiler, sommet marqué), **file** (enfiler/défiler, tête/queue marquées), **liste
chaînée** (ajouter tête/queue, retirer tête ; maillons `valeur|→ … null`), **arbre binaire de
recherche** (insérer / insérer au hasard ; rendu **SVG** avec layout in-order pour X + profondeur pour
Y, arêtes + cercles, lecture infixe triée affichée). Champ valeur partagé (vide = au hasard), bouton
Vider, message d'état par opération. CSS `.ds-*`. Lien footer accueil + cours algo. 100 % file://.
Vérifié (structures.js {} 55/55 () 188/188 [] 34/34, 0 BOM/mojibake).

### R4 — Plus de visualisations de tris/recherche  ✅ FAIT (2026-06-17)
`js/visualisations.js` étendu (P9) + 3 options dans le `<select id="viz-algo">` : **tri rapide**
(quicksort Lomuto — cmp/swap/sorted), **tri fusion** (merge sort top-down — nouveau type d'étape
**`set(i,val)`** pour les écritures) et **recherche binaire** animée (flag `presort` → on trie `display`
avant ; nouveaux types **`target`/`range`/`mid`/`found`** ; les barres hors plage passent en `is-dim`,
le milieu en actif, la cible trouvée en vert). `tick()`/`paint()`/`updateStats()`/`finish()`/`start()`
étendus (variables `dimmed`, `target`). CSS `.viz-bar.is-dim`. 100 % file://. Vérifié (visualisations.js
{} 103/103 () 194/194 [] 71/71, 0 BOM/mojibake).

### R5 — Méta-glossaire interactif  ✅ FAIT (2026-06-17)
`pages/glossaire.html` + `js/glossaire.js` : rassemble **les 455 termes** des 65 glossaires (réutilise
`js/flashcards-data.js` → `window.FLASHCARDS`), triés alphabétiquement, **recherche instantanée
insensible aux accents** (clé pré-normalisée NFD `[̀-ͯ]` sur terme + définition détaguée),
**filtre par cours** (select), **lien vers le cours** d'origine sur chaque entrée. Compteur « X termes
sur 455 ». `<dl>`/`.gl-entry` (dt terme + dd définition HTML). CSS `.gl-*`. Lien footer accueil.
100 % file://. Vérifié (glossaire.js {} 20/20 () 63/63, 0 BOM, 0 caractère combinant, 0 mojibake).

### R6 — Thèmes de couleur  ✅ FAIT (2026-06-17)
**6 palettes d'accent** (Indigo défaut, Émeraude, Ambre, Framboise, Cyan, Violet) en plus du clair/
sombre existant. `theme.js` : applique `data-accent` tôt (anti-FOUC) depuis `localStorage`
`syntaxe-theme-color` + API `window.SyntaxeAccent` (get/set/list). `variables.css` : surcharges
`[data-accent="X"]` (mode clair) et `[data-theme="dark"][data-accent="X"]` (mode sombre, couleurs
éclaircies) des variables `--accent`/`--accent-strong`/`--accent-weak`/`--btn-bg`. `main.js`
`initAccent()` injecte un **bouton palette + menu de pastilles** (`.accent-picker`) dans
`.header-actions`. CSS `.accent-*` dans components.css. Global (toutes les pages), pas de nouvelle page.
100 % file://. Vérifié (variables.css {} 12/12, main.js {} 82/82, 0 BOM/mojibake).

### R7 — Plan d'étude & objectifs  ✅ FAIT (2026-06-17)
`progression.js` `renderGoal()` (conteneur `#dash-goal` ajouté en tête de progression.html) : on se
fixe un **objectif quotidien** (boutons 1/2/3/5 leçons), suivi du jour `done / objectif` lu dans
`syntaxe-activity` (P3, `a[ymd(today)]`), **barre d'avancement** (verte si atteint) et **message
d'encouragement** contextuel. Store `localStorage` `syntaxe-goal` = `{daily:N}`. Réutilise `ymd()` de
P3. CSS `.goal-*`. Intégré à *Ma progression* (pas de nouvelle page). 100 % file://. Vérifié
(progression.js {} 108/108 () 286/286, 0 BOM/mojibake).

### R8 — Carte des cours (graphe)  ✅ FAIT (2026-06-17)
`pages/carte.html` + `js/carte.js` : les **65 cours en cercle** (SVG, nœud = pastille `accent` + glyph)
reliés par leurs liens **`related`** (`SITE_DATA.content[id].related`, arêtes dédupliquées). Survol /
focus clavier / clic d'un nœud → `focusNode()` met en avant le cours + ses voisins (`is-on`/`is-focus`,
le reste estompé via `.is-focusing`) et un **panneau d'info** (`#map-info`) affiche niveau, titre,
**lien « Ouvrir le cours »** et la liste des cours liés avec leurs notes. Entrée/Espace = navigation.
Layout 2 colonnes (panneau sticky), responsive. CSS `.map-*`. Lien footer accueil. 100 % file://.
Vérifié (carte.js {} 32/32 () 101/101 [] 26/26, 0 BOM/mojibake).

### R9 — Mode diaporama d'une leçon  ✅ FAIT (2026-06-17)
`lecon.js` `initSlideshow()` ajoute un bouton **« Mode diapo »** (à côté d'Imprimer). `openSlideshow()` :
`buildSlides()` découpe `.prose` en **diapos** (1 diapo de **couverture** avec le titre `<h1>`, puis 1
diapo par section `<h2>` — nœuds clonés, code coloré conservé) ; **overlay plein écran** (`.slideshow`,
barre + compteur + Quitter + nav précédent/suivant) ; **navigation clavier** ←/→ (+ PageUp/Down) et
**Échap** pour fermer ; `body` scroll bloqué pendant la présentation. CSS `.lesson-slides`/`.slideshow*`/
`.slide-cover` ; `@media print` masque le bouton. Intégré aux leçons (pas de nouvelle page). 100 %
file://. Vérifié (lecon.js {} 218/218 () 656/656, 0 BOM/mojibake).

### R10 — Générateur de QCM personnel  ✅ FAIT (2026-06-17)
`pages/mes-qcm.html` + `js/mes-qcm.js` : **onglets** « Mes questions » / « S'entraîner ». Création via
formulaire (énoncé + jusqu'à 4 options, radio = bonne réponse ; les options vides sont ignorées et
l'index `correct` recalculé). **Liste** des questions (bonne réponse en vert) avec suppression.
**Quiz auto-corrigé** : questions et options **mélangées**, bouton **Corriger** → score + feedback par
question (cadre vert/rouge + bonne réponse), bouton Recommencer. **Export** JSON (Blob + lien
`download`) et **import** JSON (`FileReader`, filtré/validé, ajout au jeu). Store `localStorage`
`syntaxe-mes-qcm`. CSS `.mq-*`. Lien footer accueil. 100 % file://. Vérifié (mes-qcm.js {} 47/47
() 175/175, 0 BOM/mojibake).

### Suivi Lot 3
- **R1→R10 : ✅ TOUS FAITS (2026-06-17).** Boîte à outils dev, testeur de regex, visualiseur de
  structures, quicksort/mergesort/recherche binaire, méta-glossaire, thèmes de couleur, plan d'étude,
  carte des cours, mode diaporama, générateur de QCM perso. **100 % file://, tout vérifié.**

---

# LOT 4 — 10 nouveaux gros projets (Noah, 2026-06-17)

Même méthode : **un projet à la fois** (notés **S1→S10**), soigneusement, tout vérifié (délimiteurs,
0 BOM, 0 mojibake, ConvertFrom-Json des blocs JSON). 100 % statique / `file://`. Réutilise l'existant.
Le cron reprend **au premier projet S non terminé**.

### S1 — Éditeur Markdown avec aperçu en direct  ✅ FAIT (2026-06-17)
`pages/markdown.html` + `js/markdown.js` (lié au cours `markdown`) : **split** éditeur (textarea) /
**aperçu live** (`.md-preview.prose`, rendu à chaque `input`). **Parseur Markdown maison** : titres
`#`→`<h1..6>`, **gras** `**`, *italique* `*`/`_`, `code` en ligne, **blocs ``` ```** (isolés/échappés),
listes `-`/`*`/`+` et `1.`, citations `>`, **liens** `[t](url)`, **images** `![alt](url)`, séparateurs
`---`, paragraphes. Échappement HTML systématique (sans `eval`/innerHTML d'entrée brute). Bouton
**Copier le HTML** (presse-papiers). CSS `.md-*`. Lien footer accueil. 100 % file://. Vérifié
(markdown.js {} 27/27 ; écarts ()/[] = classes regex `[^)]`/`[^\]]`, syntaxe saine ; 0 BOM/mojibake).

### S2 — Studio de couleurs  ✅ FAIT (2026-06-17)
`pages/couleurs.html` + `js/couleurs.js` (lié à `css`) : **convertisseur** hex ↔ rgb ↔ hsl (saisie hex
+ sélecteur natif `<input type=color>`, sorties sélectionnables), **échelle de teintes** (8 niveaux de
luminosité HSL, pastilles cliquables → recharge la couleur), **vérificateur de contraste WCAG**
(luminance relative sRGB maison → ratio + verdicts **AA/AAA** texte normal et grand, ✓/✗) avec aperçu
texte sur fond. Calculs maison (`hexToRgb`/`rgbToHsl`/`hslToRgb`/`luminance`/`contrast`). CSS `.col-*`.
Lien footer accueil. 100 % file://. Vérifié (couleurs.js {} 27/27 () 145/145 [] 8/8, 0 BOM/mojibake).

### S3 — Évaluateur d'expressions  ✅ FAIT (2026-06-17)
`pages/expression.html` + `js/expression.js` : saisie d'une **expression arithmétique/booléenne** →
**résultat** + **notation postfixe (RPN)** + **évaluation étape par étape**. Pipeline maison **sans
`eval`** : `tokenize()` (nombres, `true`/`false`, opérateurs), `toRPN()` = **shunting-yard** (table de
priorités `PREC`, associativité `RIGHT`, **moins unaire** `u-` détecté par contexte, parenthèses),
`evalRPN()` (pile, étapes enregistrées). Opérateurs : `+ - * / % **`, `< > <= >= == !=`, `&& || !`.
Gestion d'erreurs (parenthèses, opérandes manquants, caractères/mots inconnus). En direct. CSS
`.expr-*`. Lien footer. 100 % file://. Vérifié (expression.js {} 48/48 [] 25/25 ; écart () = chaînes
tokens `"("`/`")"`, structure saine ; 0 BOM/mojibake).

### S4 — Minuteur Pomodoro  ✅ FAIT (2026-06-17)
`pages/pomodoro.html` + `js/pomodoro.js` : minuteur **25 / 5 / 15** (travail / pause courte / pause
longue tous les 4 cycles), **anneau de progression SVG** (`stroke-dasharray`/`dashoffset`, vert en
pause), **bip de fin** (WebAudio `OscillatorNode`, sans fichier), boutons Démarrer/Pause/Reprendre,
Passer, Réinitialiser + onglets de mode. **Compteur de pomodoros du jour** (`localStorage`
`syntaxe-pomodoro` = `{jour:count}`) ; le titre de l'onglet affiche le temps restant. CSS `.pomo-*`.
Lien footer accueil + renvoi à l'objectif d'étude (R7). 100 % file://. Vérifié (pomodoro.js {} 34/34
() 111/111, 0 BOM/mojibake).

### S5 — Générateur de données de test  ✅ FAIT (2026-06-17)
`pages/donnees.html` + `js/donnees.js` : choix des **champs** (cases : id, prénom, nom, e-mail, ville,
pays, âge, inscription, actif, entreprise) + **nombre de lignes** (1–500) → **génération** de données
factices (pools `PRENOMS`/`NOMS`/`VILLES`/`PAYS`/`ENTREPRISES` ; e-mail dérivé via `slug()` qui retire
les accents par table ; date aléatoire ; booléen). **Aperçu tableau** (50 premières lignes), **export
JSON et CSV** (CSV échappé) via **copier** (presse-papiers) et **télécharger** (Blob). CSS `.dg-*`.
Lien footer accueil. 100 % file://. Vérifié (donnees.js {} 46/46 () 175/175 [] 29/29, 0 BOM/mojibake).

### S6 — Comparateur de textes (diff)  ✅ FAIT (2026-06-17)
`pages/diff.html` + `js/diff.js` : deux zones de texte → **diff ligne à ligne** en direct. Algorithme
**LCS maison** (`diffLines` : table `dp` O(n·m) remplie à rebours + **backtrack** → suite de
`same`/`del`/`add`), garde-fou `MAX = 1200` lignes/côté. Rendu unifié (préfixes ` `/`−`/`+`, lignes
ajoutées en vert, supprimées en rouge via `rgba`), **statistiques** (nb ajouts/suppressions, « textes
identiques »). CSS `.diff-*`. Lien footer accueil. 100 % file://. Vérifié (diff.js {} 23/23 () 53/53
[] 32/32, 0 BOM/mojibake).

### S7 — Convertisseur tout-en-un  ✅ FAIT (2026-06-17)
`pages/convertir.html` + `js/convertir.js` : **4 convertisseurs** (cartes `.tool-card` de R1, chacun une
IIFE) — **unités CSS** (px ↔ rem ↔ em, base px configurable), **tailles d'octets** (o/Ko/Mo/Go/To,
base 1024, conversion croisée), **timestamps** (epoch ms ↔ epoch s ↔ ISO ↔ local fr, bouton
« Maintenant »), **couleur** (hex ↔ rgb ↔ hsl + `<input type=color>`, renvoi vers le Studio S2). Tout
en direct, conversion bidirectionnelle. CSS `.cv-*`. Lien footer accueil. 100 % file://. Vérifié
(convertir.js {} 36/36 () 184/184 [] 7/7, 0 BOM/mojibake).

### S8 — Aide-mémoire des raccourcis clavier  ✅ FAIT (2026-06-17)
`pages/raccourcis.html` + `js/raccourcis.js` : **~44 raccourcis** (Windows/Linux) en 3 catégories —
**VS Code** (18), **Navigateur** (14), **Terminal** (12) — dans `DATA` (`{cat, keys, desc}`).
**Recherche** insensible aux accents (sur desc/keys/cat) + **filtre par catégorie**, rendu **groupé**
avec les combinaisons en `<kbd>` (touches stylées, séparées par `+` ; séquences type `Ctrl+K Ctrl+S`
gérées). Compteur « X sur 44 ». CSS `.rc-*` (+ style `kbd`). Lien footer accueil + cours `vscode`.
100 % file://. Vérifié (raccourcis.js {} 58/58 () 65/65 [] 14/14, 0 BOM/mojibake).

### S9 — Devine la sortie  ✅ FAIT (2026-06-17)
`pages/devine.html` + `js/devine-data.js` (`window.DEVINE` = **16 extraits** JS/Python/Java/C, pièges
classiques : `typeof null`, `0.1+0.2`, `2**3**2`, division entière… avec **sortie pré-calculée** + une
explication, AUCUNE exécution) + `js/devine.js` : quiz mélangé, une question à la fois (extrait en
`<pre>` mono, QCM **options mélangées**), au clic → **correction** (bonne en vert, choix faux en rouge)
+ **explication**, bouton suivant, puis **score** final + message + rejouer. CSS `.devine-*`. Lien
footer accueil. 100 % file://. Vérifié (devine-data.js {} 17/17, devine.js {} 19/19, 0 BOM/mojibake).

### S10 — Bilan d'apprentissage imprimable  ✅ FAIT (2026-06-17)
`pages/bilan.html` + `js/bilan.js` : **« bulletin »** synthétisant tout le parcours — leçons terminées
/ total et cours commencés/maîtrisés (recalcul via `SITE_DATA.content` + `syntaxe-progress`, même
logique que progression.js), **niveau & XP** (`window.SyntaxeXP`), **série** + jours actifs
(`syntaxe-activity`), **défis résolus** (`syntaxe-defis`), **notes & surlignages** (`syntaxe-notes`),
cartes en révision (`syntaxe-revision`). Deux rangées de stats + **barres de progression par cours**
triées + date d'édition. Bouton **« Imprimer / PDF »** (masqué via `@media print`, qui rend déjà la
page proprement). CSS `.bilan-*`. Lien footer accueil. 100 % file://. Vérifié (bilan.js {} 29/29
() 95/95, 0 BOM/mojibake).

### Suivi Lot 4
- **S1→S10 : ✅ TOUS FAITS (2026-06-17).** Éditeur Markdown, studio de couleurs, évaluateur
  d'expressions, Pomodoro, générateur de données, diff, convertisseur, raccourcis clavier, devine la
  sortie, bilan imprimable. **100 % file://, tout vérifié.**

---

# LOT 5 — 10 nouveaux gros projets (Noah, 2026-06-17)

Même méthode : **un projet à la fois** (notés **T1→T10**), soigneusement, tout vérifié (délimiteurs,
0 BOM, 0 mojibake, ConvertFrom-Json des blocs JSON). 100 % statique / `file://`. Réutilise l'existant.
Le cron reprend **au premier projet T non terminé**.

### T1 — Visualiseur Flexbox & Grid  ✅ FAIT (2026-06-17)
`pages/flexbox.html` + `js/flexbox.js` (lié à `css`) : **onglets Flexbox / Grid**. Panneau de
**propriétés** généré dynamiquement (`CONTROLS` par mode : flex-direction/justify-content/align-items/
flex-wrap/gap/count en Flexbox ; cols/gap/justify-items/align-items/count en Grid) via `<select>` et
curseurs `range` → **aperçu live** (cases numérotées, styles inline) + **code CSS généré** dans `<pre>`
+ bouton **Copier**. État par mode dans `state`. CSS `.fx-*`. Lien footer accueil. 100 % file://.
Vérifié (flexbox.js {} 38/38 () 71/71 [] 33/33, 0 BOM/mojibake).

### T2 — Générateur de dégradés CSS  ✅ FAIT (2026-06-17)
`pages/degrade.html` + `js/degrade.js` (lié à `css`) : type **linéaire / radial**, **angle** réglable
(curseur, masqué en radial), **arrêts de couleur** (`<input type=color>` + position en %, **ajout**
d'un arrêt, **suppression** si >2, tri par position), **aperçu** plein cadre + **code `background`**
(`linear-gradient`/`radial-gradient`) copiable. Rendu optimisé (label de position mis à jour sans
re-render complet). CSS `.gr-*`. Lien footer accueil. 100 % file://. Vérifié (degrade.js {} 26/26
() 87/87 [] 8/8, 0 BOM/mojibake).

### T3 — Visualiseur d'arbre DOM  ✅ FAIT (2026-06-17)
`pages/arbre-dom.html` + `js/arbre-dom.js` (lié à `html`) : on colle du **HTML** → analyse via
**`DOMParser`** (text/html, **n'exécute aucun script**) → **arbre pliable** (`renderNode` récursif :
éléments en `<details>` ouverts, attributs colorés, nœuds texte tronqués, commentaires). Indentation
par `.dom-children` (bordure gauche). Coloration syntaxique `.dom-tag`/`.dom-attr`/`.dom-val`. Compteur
éléments/nœuds texte. En direct. Tout échappé (pas d'injection). CSS `.dom-*`. Lien footer accueil.
100 % file://. Vérifié (arbre-dom.js {} 12/12 () 44/44, 0 BOM/mojibake).

### T4 — Visualiseur de JSON (arbre pliable)  ✅ FAIT (2026-06-17)
`pages/json.html` + `js/json.js` : on colle du **JSON** → `JSON.parse` → **arbre dépliable**
(`renderValue` récursif : objets/tableaux en `<details>` avec compte de clés/éléments, valeurs typées
**colorées** — clé/index, `jv-str` vert, `jv-num` doré, `jv-bool`, `jv-null` ; vides `{ }`/`[ ]`).
**Gestion d'erreur** (message rouge avec le détail du parse), compteur de valeurs, indicateur valide/
invalide. En direct. CSS `.jv-*`. Lien footer accueil. 100 % file://. Vérifié (json.js {} 16/16 () 52/52,
0 BOM/mojibake).

### T5 — Convertisseur de casse & texte  ✅ FAIT (2026-06-17)
`pages/texte.html` + `js/texte.js` : **10 transformations en place** (s'enchaînent) — MAJUSCULES,
minuscules, **Title Case**, **camelCase**, **snake_case**, **kebab-case** (via `words()` qui découpe
sur espaces/`_`/`-`/transitions camel), **Inverser**, **Trier les lignes**, **Dédoublonner**,
**Nettoyer les espaces**. Boutons générés depuis `OPS`. **Compteurs** caractères/mots/lignes en direct,
boutons **Copier**/**Vider**. CSS `.tx-*`. Lien footer accueil. 100 % file://. Vérifié (texte.js
{} 51/51 () 133/133, 0 BOM/mojibake).

### T6 — Générateur de Lorem Ipsum  ✅ FAIT (2026-06-17)
`pages/lorem.html` + `js/lorem.js` : génère du faux texte depuis une banque de **mots latins** —
**paragraphes** (3-6 phrases), **phrases** (6-14 mots, virgules aléatoires), **mots**, ou **liste à
puces** ; quantité 1-100 ; option **« Commencer par Lorem ipsum… »**. Rendu en `<p>` (paragraphes) ou
`<pre>` (reste), bouton **Copier** (texte brut). CSS `.lo-*`. Lien footer accueil. 100 % file://.
Vérifié (lorem.js {} 26/26 () 96/96, 0 BOM/mojibake).

> **⚠️ Consigne Noah (2026-06-17, pendant T6) : à la fin du Lot 5 (quand T10 est fait), NE PAS poser de
> questionnaire — COUPER le cron (`CronDelete a553721e`) et produire un fichier `.md` RÉCAPITULATIF de
> TOUT ce qui a été mis en place au total (les 5 lots + l'ensemble du site).**

### T7 — Table de vérité booléenne  ✅ FAIT (2026-06-17)
`pages/verite.html` + `js/verite.js` : **expression booléenne** (variables d'une lettre, `&&`/`||`/`!`,
parenthèses, `true`/`false`) → **table de vérité** complète, en direct. Pipeline maison **sans `eval`**
(adapté de S3) : `tokenize` → `toRPN` (shunting-yard, `PREC` `!`>`&&`>`||`, `!` associatif à droite) →
`evalRPN(rpn, env)` évalué pour les **2ⁿ combinaisons** (bits MSB = 1ʳᵉ variable). Variables détectées
et triées, **max 6** (garde-fou), gestion d'erreurs (parenthèses/opérandes/caractères), résumé
vrai/faux. Table `.tv-*` (V/F colorés). Lien footer accueil. 100 % file://. Vérifié (verite.js {} 46/46
[] 27/27 ; écart () = chaînes tokens `"("`/`")"`, structure saine ; 0 BOM/mojibake).

### T8 — Lexique anglais de la programmation  ✅ FAIT (2026-06-17)
`pages/lexique.html` + `js/lexique-data.js` (`window.LEXIQUE` = **64 termes** EN→FR `{en, fr, ex}` :
loop/array/statement/closure… avec un court exemple en anglais) + `js/lexique.js` : **onglets**
Lexique / Quiz. Lexique = **recherche** insensible aux accents (EN+FR) + liste `<dl>` (EN coloré, FR,
exemple). Quiz de **traduction** = 10 termes tirés au hasard, QCM (bonne réponse + 3 distracteurs FR
mélangés), correction vert/rouge, score, rejouer. CSS `.lx-*`. Lien footer accueil. 100 % file://.
Vérifié (lexique-data.js {} 65/65 — 64 entrées, lexique.js {} 26/26, 0 BOM/mojibake).

### T9 — Fiches de référence  ✅ FAIT (2026-06-17)
`pages/reference.html` + `js/reference-data.js` + `js/reference.js` : **4 onglets** — **ASCII** (95
caractères 32-126 **générés** côté JS : déc/hex/car/nom), **codes HTTP** (25), **entités HTML** (25),
**syntaxe Markdown** (15) (`window.REFERENCE`). Moteur générique : chaque onglet définit ses colonnes/
clés, **recherche** insensible aux accents sur toutes les colonnes, table cherchable (en-tête sticky,
1ʳᵉ colonne colorée), compteur. CSS `.ref-*`. Lien footer accueil. 100 % file://. Vérifié
(reference-data.js {} 66/66, reference.js {} 25/25 () 80/80, 0 BOM/mojibake).

### T10 — Gestionnaire de mes données  ✅ FAIT (2026-06-17)
`pages/donnees-perso.html` + `js/donnees-perso.js` : liste **toutes les clés `localStorage`** du site
(préfixe `syntaxe-`, **labels** lisibles via `LABELS`) avec leur **taille** (`Blob().size`, total
affiché), **export global JSON** (Blob/téléchargement), **import** (`FileReader`, ne restaure que les
clés `syntaxe-*`), **effacement sélectif** (par entrée) et **total**, les deux avec **confirmation**.
CSS `.dp-*`. Lien footer accueil. 100 % file://. Vérifié (donnees-perso.js {} 41/41 () 126/126,
0 BOM/mojibake).

### Suivi Lot 5
- **T1→T10 : ✅ TOUS FAITS (2026-06-17).** Flexbox/Grid, dégradés CSS, arbre DOM, JSON pliable, casse &
  texte, Lorem Ipsum, table de vérité, lexique anglais, fiches de référence, gestionnaire de données.
  **100 % file://, tout vérifié.** Cron `a553721e` à couper + récap `.md` global (consigne Noah).

### Suivi Lot 5
- T1→T10 : à venir, dans l'ordre, via le cron. Voir `gros-projets-roadmap.md` pour l'état.
