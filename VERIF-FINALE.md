VERDICT: VERT

# Passe de sécurité de fin de chantier — 2026-08-13

Site **Syntaxe** (`d:\test-claude`). Contrôle de bout en bout, non interactif, sans ajout de
contenu. Une famille de défauts trouvée (compteurs « modules · leçons » périmés dans 13 pages
de cours, laissés en arrière par les ajouts de leçons du chantier V10), **corrigée à la cause et
re-vérifiée**. Tous les contrôles sont verts après correction.

Chiffres de référence (vérité terrain, `js/data.js` = source) : **83 cours · 1463 leçons**,
tous en statut « complet ». Cohérence prouvée : `content` ⇄ `courses[].lessons` ⇄ fichiers sur
le disque, les trois donnent 1463 partout.

---

## 1. Outils du projet (les trois en sortie 0)

| Outil | Résultat |
|---|---|
| `node tools/verif-html.js` | 1552 fichiers, **0 grave / 0 attention**. Exit 0. |
| `node tools/verif-donnees.js` | 17 invariants, **0 erreur, 1 avertissement non bloquant** (I17 : zig lecon‑06 ↔ lecon‑14, Jaccard 0.33 — cas « deux faces d'une notion » déjà documenté, pas un vrai doublon). Exit 0. |
| `node tools/verif-rendu.js --tout --lecons` | 146 pages × 3 largeurs × 2 thèmes = **876 mesures, 0 erreur, 0 avertissement** (débordement horizontal, contraste, focus clavier, aria, console, réseau). Exit 0. |

## 2. Vérifications complémentaires (scripts jetables `scratchpad/vf-*.js`)

| # | Contrôle | Résultat |
|---|---|---|
| a | Syntaxe JS | `node --check` sur **81** fichiers de `js/` → tous OK. |
| b | Blocs de données | **3013** blocs `data-quiz` / `data-exos` / `data-quiz-bilan` → **0 JSON invalide** (recoupe I15). |
| c | Encodage | **Aucun BOM** sur tout le site. **3** leçons contiennent `U+FFFD` (`�`) — **toutes volontaires** : go/lecon‑15, php/lecon‑17, js/lecon‑57 illustrent le « caractère de remplacement » dans des leçons sur l'encodage. Aucun mojibake accidentel. |
| d | Liens | Liens relatifs des **cours.html** : 1791 vérifiés, **0 cassé**. Liens des **leçons** : 33019 vérifiés ; 0 vrai lien cassé (les 153 « cassés » du 1er scan étaient tous des exemples de code dans `<pre>/<code>` + 2 étiquettes de texte dans un SVG pédagogique de html/lecon‑03). Recoupe I6/I16 et le contrôle réseau de verif-rendu. |
| e | Index | `search-index.js` = **1463 docs** (= 1 par leçon réelle), **0 entrée `-avance`**. I18 (`build-index --strict`) vert. |
| f | Durées | I2 (`content` ⇄ `durations`) + I3 verts ; recoupé par la vérité terrain (content = course.lessons = fichiers). |
| g | Niveaux | html **16/16**, css **15/15**, javascript **20/20**, python **17/17** modules porteurs d'un `level`, répartis `debutant`/`intermediaire`/`expert`. **Aucun identifiant de cours `-avance`** résiduel dans data/catalogue/cours/projets-data/flashcards-data/quiz-index/logos/fil-rouge (les mentions dans `main.js` et `projets.js` sont les tables de redirection/compat, volontaires). |
| h | Redirections | **93** pages `pages/*-avance/*.html` (meta‑refresh + noindex + canonical) → **0 cible manquante**. |
| i | Compteurs affichés | Accueil, catalogue, à‑propos, recherche, antisèches : **83 cours / 1463 leçons** — conformes. Voir §3 pour les compteurs par cours corrigés. |

## 3. Correction appliquée (simple et sûre : compteurs)

Les ajouts de leçons du chantier V10 (fusions `-avance` + « compléments ») avaient laissé
périmés les compteurs codés en dur `<h2>N modules · M leçons</h2>`, la meta description et les
phrases de présentation de **13 pages `pages/<cours>/cours.html`**. **20 remplacements** (chacun
validé pour matcher exactement 1×, sinon fichier laissé intact) remettent les nombres à la
vérité terrain :

| Cours | Avant → Après (modules · leçons) |
|---|---|
| javascript (`js`) | 12 · 37 → **20 · 65** |
| python | 8 · 23 → **17 · 50** |
| react | 7 · 21 → **8 · 26** |
| sql | 7 · 19 → **8 · 24** |
| git | 6 · 19 → **7 · 24** |
| algo | 7 · 23 → **8 · 28** |
| nodejs | 8 · 22 → **9 · 27** |
| typescript | 5 · 15 → **6 · 20** |
| java | 6 · 18 → **7 · 23** |
| cpp | 6 · 18 → **7 · 23** |
| c | 5 · 16 → **6 · 21** |
| php | 5 · 16 → **6 · 21** |
| go | 4 · 13 → **5 · 18** |

Re-vérifié après correction : **0 mention de compteur périmée** restante (35 mentions → 0),
`verif-html` toujours à 0 problème. (html et css étaient déjà à jour à 47 leçons ; `projets-js`
affiche « 15 projets · 24 leçons » — le « 24 leçons » est correct, « 15 projets » est un libellé
éditorial, non touché.)

Fichiers modifiés (non commités — la passe ne commite pas sans demande) :
`pages/{js,python,react,sql,git,algo,nodejs,typescript,java,cpp,c,php,go}/cours.html`.

## 4. Réserves signalées (non bloquantes, non corrigées volontairement)

- **« 73 langages »** (catalogue) : le champ `language` de `data.js` compte **75** valeurs
  distinctes. L'écart n'est pas tranchable automatiquement (« langage » est un terme éditorial ;
  certaines valeurs ne sont pas des langages de programmation). Hors du périmètre strict du
  point i (cours + leçons, tous deux conformes). Laissé tel quel.
- **Commentaires internes datés** : quelques commentaires de code non affichés à l'utilisateur
  citent d'anciens totaux (`main.js`, `recherche.js`, `tools/*` : « 1336/1376 leçons », « 77
  cours »). Aucun impact visible ; hors périmètre « compteurs affichés » ; non modifiés (contrôle,
  pas production).
- **I17 zig** (avertissement verif-donnees) : conservé tel quel, cas « deux faces d'une notion »
  déjà analysé.

---

**Conclusion : VERDICT VERT.** Les trois outils sortent en 0, les neuf contrôles complémentaires
sont conformes, l'unique famille de défauts (compteurs par cours) est corrigée à la cause et
re-vérifiée. Aucun problème bloquant restant.
