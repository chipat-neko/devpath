# Chantier V7 — les défauts mineurs de l'audit

Plan de travail de l'autonomie. **Source de vérité : ce fichier.** Chaque réveil lit ce plan,
prend la **première case non cochée**, la traite entièrement, la coche avec un compte rendu chiffré,
puis passe à la suivante. Le chantier est fini quand il ne reste aucune case `- [ ]`.

**Origine** : l'audit de contrôle du 2026-08-01 (`AUDIT-2026-08-01.md`, 11 agents, 46 constats
confirmés). Les défauts **bloquants et majeurs ont tous été corrigés**, ainsi que les doublons de QCM
et les redondances éditoriales. Restent les **mineurs**, jamais traités. Aucun n'empêche d'utiliser le
site ; tous se voient à l'usage.

**Le projet est désormais sous git.** Avant chaque case, `git status` doit être propre ; après chaque
case, fais un commit dont le message décrit la correction ET sa mesure. C'est le premier chantier qui
peut se vérifier au diff : sers-t'en (`git diff --stat`) pour prouver qu'une correction n'a touché que
ce qu'elle devait.

## Règles permanentes

- **Un point à la fois**, mené jusqu'à la vérification chiffrée. Un point clos et prouvé vaut mieux que trois à moitié faits.
- **Vérifier avant de corriger** : les mesures datent du 01/08 et le site a beaucoup bougé depuis (palette, index régénérés, doublons traités). Reproduis la mesure ; si le point est déjà réglé, coche-le en le signalant.
- **Outils** : `node tools/verif-html.js` (doit rester à 0), `node tools/verif-donnees.js` (16 invariants), `node tools/build-index.js` (comparaison par défaut, `--write --only=…` pour écrire).
- **Contrainte fondatrice** : 100 % `file://`, aucun serveur, aucun module ES, aucun build.
- **⚠️ ORDRE DES FEUILLES CSS** : `variables.css`, `base.css`, `layout.css`, `components.css`, `pages.css`. Une règle de même spécificité placée dans un fichier antérieur est **écrasée**. Ce piège s'est déjà produit deux fois (`.xp-badge`, `.accent-picker`) : mets la règle là où le sélecteur est défini.
- **⚠️ JAMAIS de `&nbsp;` dans un bloc `<script type="application/json">`** : il s'afficherait en toutes lettres. Exception légitime : `pages/html/lecon-21.html`, la leçon sur les entités.
- **⚠️ VISIBILITÉ D'UN ÉLÉMENT** : `getComputedStyle(el).display` ment quand c'est un **ancêtre** qui porte `hidden`. Utilise `offsetParent === null` et `closest("[hidden]")`.
- **INTERDIT** : réintroduire une URL vers `cdnjs.cloudflare.com`, `fonts.googleapis.com` ou `fonts.gstatic.com`.
- **Tester avec une progression semée** dans `localStorage` : un test avec un stockage vide ment.
- **En cas de doute réel : ne force pas.** Laisse la case décochée et écris ce qui bloque.

---

## PHASE A — Finir les nouveautés du chantier V5

- [x] **A1 · La palette : cinq défauts de finition.** (a) **`Échap` cesse de fermer** dès qu'un clic tombe dans une zone morte du dialogue (l'icône loupe, le fond de la liste, la barre) : le focus part sur `BODY` et le gestionnaire, posé sur l'input, ne le voit plus. Corriger en écoutant aussi au niveau du dialogue. (b) **Le raccourci `/` est détourné sur le catalogue** : deux gestionnaires `document` le réclament (`js/main.js` et `js/catalogue.js`) sans que l'un arrête la propagation. (c) **La ligne active ne se voit pas** : `.cmdk__item.is-active` ne diffère du fond que de **1,15:1** (seuil 3:1) — ajouter un repère non chromatique en plus de la teinte. (d) **Le lien de l'état vide est inatteignable au clavier** : le piège de tabulation ne connaît que l'input et le lien de pied. (e) **ARIA** : `aria-expanded="true"` est codé en dur même liste vide, et les `<li class="cmdk__empty">` sont des enfants sans `role` d'un `role="listbox"`.
  - **FAIT le 2026-08-02.** Les 5 défauts reproduits puis corrigés (`js/main.js`, `js/catalogue.js`, `css/components.css` ; diff = 3 fichiers, +64/−20). **(a)** ajout d'un `keydown` sur l'overlay (Échap + Tab écoutés au niveau du dialogue, donc actifs même si le focus a fui l'input) + `mousedown` sur zone morte fait `preventDefault` pour garder le focus dans le dialogue. **(b)** `js/catalogue.js` écoute désormais « / » en **phase capture** + `stopPropagation()` : le champ local gagne de façon déterministe (capture précède le bubble de la palette). **Décision assumée** : sur le catalogue, « / » cible le champ visible de la page (moindre surprise, comportement historique) ; la palette reste ouvrable via **Ctrl+K** et le **bouton loupe** (aucune capacité perdue). **(c)** repère non chromatique = barre latérale `box-shadow: inset 3px 0 0 0 var(--accent-strong)` (contraste ≥ 6,7:1, forme et non couleur). **(d)** piège de tabulation rendu **générique** (`focusables()` : input → lien d'état vide → lien de pied), donc le lien « recherche plein-texte » de l'état « aucun résultat » devient atteignable au clavier. **(e)** `aria-expanded` recalculé à chaque `render()` (`true` avec options, `false` sinon) + `role="presentation"` sur tous les `<li class="cmdk__empty">`.
  - **Vérifs** : `node --check` OK sur les 2 JS ; `verif-html` = 0 ; `verif-donnees` = 0 err. **14/14 assertions** d'un test piloté (Chrome headless, index préchargé) valident (a)(d)(e). Le fix (b) prouvé sur le **vrai `catalogue.html`** via iframe : « / » → focus `#catalogue-search`, palette non ouverte, **Ctrl+K ouvre toujours** la palette (3/3 PASS). Sémantique capture+`stopPropagation` confirmée en isolation.

- [ ] **A2 · Les antisèches : quatre défauts.** (a) **« N résultats dans M cours » est faux** (`js/antiseches.js`) : le nombre de cours est calculé sur les 50 fiches affichées, le nombre de fiches sur le total. (b) **« Imprimer cette fiche » sort 50 fiches** quand une recherche est en cours, alors que la page promet « la fiche affichée ». (c) **Une fiche fantôme** : l'entrée `nosql/lecon-11.html` porte le titre « Projet : une base NoSQL de bout en bout » alors que la leçon traite des séries temporelles — vérifier si le générateur ou la source est en cause. (d) **Cliquer un titre de groupe déjà ancré ne fait rien** (le code ne réagit qu'à `hashchange`), cas atteint dès qu'on arrive depuis une page de cours.

- [ ] **A3 · La recherche jette les jetons d'un caractère.** `js/recherche.js` ignore les termes d'une lettre : « 3.14 » ne cherche donc que « 14 » et renvoie **333 résultats pour 102 occurrences réelles**. Corriger sans casser la performance ni le format v2 de l'index (mesurer avant/après sur 15 requêtes témoins, dont des termes à ponctuation).

---

## PHASE B — Données et contenu

- [ ] **B1 · Numérotation réaffectée dans 6 cours.** Des leçons ont été insérées **avant** le capstone lors des étoffements : `a11y/lecon-11`, `docker/lecon-11`, `nosql/lecon-11`, `os/lecon-11` et deux autres portent aujourd'hui un contenu différent de celui qu'un lien ou une progression enregistrée pouvait désigner. Mesurer l'ampleur réelle, puis décider : soit renuméroter proprement avec des redirections, soit assumer et documenter. **Point délicat : la progression des utilisateurs est indexée par nom de fichier.** Ne rien casser sans table de compatibilité, sur le modèle de `ANCIENS_IDS` dans `js/projets.js`.

- [ ] **B2 · `tools/build-index.js` masque sa propre péremption.** Ses trois branches de reprise réinjectent telles quelles les entrées de l'**ancien** index absentes du contenu actuel — un titre supprimé survit donc indéfiniment dans les index. Ajouter un mode **`--strict`** qui sort en code 1 dès qu'une entrée doit être reprise, et l'utiliser dans les vérifications. C'est le point qui ferme définitivement la famille de bugs « index périmé », déjà rencontrée trois fois.

- [ ] **B3 · 367 durées affichées contredisent `data.js`** (26,9 % des leçons, 45 cours, 26 h d'écart cumulé). Défaut **préexistant** aux chantiers récents, confirmé par comparaison avec la sauvegarde. Décider de la source de vérité — `data.js` selon toute logique — et aligner les pages, ou l'inverse si la mesure montre que les pages ont raison.

- [ ] **B4 · Trois titres incohérents entre `js/data.js` et la page.** `data.js` dit « SSG **&** hydratation », la page dit « et » ; deux autres écarts sur `a11y`. Aligner sur `data.js`, puis régénérer les index.

- [ ] **B5 · Densité éditoriale du lot du 01/08.** Les 15 leçons ajoutées à `docker`, `a11y` et `perf-web` ont une médiane de **2 encadrés et 10 SVG**, contre **5 et 14** pour les 1 347 autres. Elles respectent le standard mais sont plus maigres. Les enrichir jusqu'à la médiane du site, une leçon à la fois, sans remplissage : un encadré ne vaut que s'il apporte un cas réel, un piège ou une nuance.

---

## PHASE C — Défauts d'usage préexistants

- [ ] **C1 · Le meilleur score de QCM ignore le nombre de questions.** `js/lecon.js` compare `good > prev.best` sans regarder `total` : un **8/8 parfait n'écrase pas un ancien 9/10**, et le certificat s'appuie sur cette valeur. Comparer des ratios.

- [ ] **C2 · Le surlignage des résultats casse les entités HTML.** `highlight()` s'applique **après** `esc()` dans `js/recherche.js` et dans la palette (`js/main.js`) : chercher « amp » abîme 108 champs. Surligner avant d'échapper, ou travailler sur le texte brut.

- [ ] **C3 · « 630 résultats » annoncés, 60 affichés, aucune mention.** `js/recherche.js` tronque sans le dire. La page antisèches écrit « · 50 affichées » : le motif existe déjà dans le site, le reprendre.

- [ ] **C4 · Écrasement entre deux onglets.** `js/mes-qcm.js`, `revision.js` et `playground.js` chargent leur tableau une fois puis le réécrivent en entier : deux onglets ouverts, et le travail du premier est perdu. Relire avant d'écrire, ou écouter l'événement `storage`.

- [ ] **C5 · Échec silencieux quand `localStorage` est saturé.** `js/lecon.js` avale l'exception dans un `catch` vide : le clic ne fait rien et ne dit rien. **56 `catch (e) {}` vides pour 30 `setItem`** dans `js/`. Au minimum, prévenir l'utilisateur quand une sauvegarde échoue.

- [ ] **C6 · Une donnée corrompue casse le calcul d'XP.** `syntaxe-progress = {"html":null}` — JSON valide, donc invisible aux `try/catch` — fait planter `computeXP` sur **9 pages**, avec une exception en cascade sur la progression et le bilan. Se prémunir des valeurs nulles.

- [ ] **C7 · Contradictions du tableau de bord.** « Tu n'as pas encore commencé de cours » s'affiche au-dessus de « 1362 / 1362 leçons terminées ». Vérifier d'abord : le vérificateur de l'audit a nuancé ce constat, reproduis-le avant de corriger.

- [ ] **C8 · Impression d'une leçon.** 22 boutons « ▶ Tester » et le bouton « Marquer comme terminée » sortent sur le papier : `css/pages.css` masque `.code-block__copy` à l'impression mais pas ceux-là.

- [ ] **C9 · Le champ de réponse des exercices perd sa question.** Le libellé est générique (« Ta réponse : ») et la vraie micro-question est dans le `placeholder`, **qui s'efface à la première frappe**. L'utilisateur ne sait plus ce qu'on lui demande. Mettre la question dans le libellé.

- [ ] **C10 · La page glossaire est lourde.** 9 726 entrées rendues d'un bloc, 49 800 nœuds DOM, **782 ms de chargement** contre 29 à 58 ms ailleurs. Pas gelée, mais nettement au-dessus du reste. Rendre progressivement ou paginer, sans perdre la recherche interne.

---

## PHASE D — Accessibilité

- [ ] **D1 · `role="tab"` sans le comportement attendu.** 28 onglets sur 6 pages déclarent `role="tab"` et `aria-selected`, mais il n'y a **0 `tabpanel`, 0 `aria-controls`, aucun `tabindex` roving** et les flèches ne naviguent pas. Un lecteur d'écran annonce des onglets qui ne se comportent pas comme tels. Soit implémenter le motif complet, soit retirer les rôles et rester sur des boutons simples — **choisir et justifier**.

- [ ] **D2 · Divers accessibilité.** `pages/mes-qcm.html` est le seul jeu d'onglets sans `role="tablist"` alors que 6 autres pages l'ont ; sauts de titre H1 → H3 sur le catalogue et la progression ; 6 champs de saisie n'ont pour tout nom accessible qu'un `placeholder`, qui disparaît à la frappe.

---

## Fin de chantier

Quand **toutes** les cases sont cochées, le wrapper déclenche la **passe de sécurité** : vérification
globale, rapport dans `VERIF-FINALE.md` avec un verdict en première ligne, puis extinction automatique
de la tâche si le verdict est vert.
