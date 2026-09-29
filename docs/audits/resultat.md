# Résultat : audit complet (lecture seule) — dossier `D:\test-claude`

## 0) Cadre et limites de l’audit
- Audit réalisé en **lecture seule** sur le contenu visible du dépôt `d:/test-claude`.
- Certaines analyses “globales” par recherche dans tout le dépôt (ex. ripgrep/regex cross-files) n’ont pas pu être exécutées car l’outil de recherche n’est pas disponible (ripgrep manquant). L’audit s’appuie donc sur :
  - lecture de fichiers structurants existants (`index.html`, `README.md`, `DESIGN_SYSTEM.md`, `PROGRESSION.md`, `PLAN-AMELIORATIONS.md`),
  - inspection des arborescences (CSS/JS/pages/outils/assets) via liste de dossiers,
  - constats déjà documentés dans `PLAN-AMELIORATIONS.md`.

## 1) Ce qui est globalement très bien (à préserver)
1. **Architecture simple et robuste** : HTML statique, CSS séparé, JS séparé, aucune étape de build.
2. **Compatibilité `file://`** : pas de `fetch` local, données en `js/data.js`.
3. **Moteurs d’interactivité** bien cadrés : thème via script externe `js/theme.js`, runner de code via `js/runner.js` / worker, aperçu HTML via iframe sandbox.
4. **Qualité éditoriale / design system** : identité claire dans `DESIGN_SYSTEM.md` et cohérence tokenisée.
5. **Intégrité générale annoncée** : `PLAN-AMELIORATIONS.md` affirme absence de liens cassés et alignement `data.js` ↔ fichiers de leçons.
6. **Accessibilité de base** : landmarks, skip-link, focus visible, responsive et thème clair/sombre.

## 2) Principaux problèmes détectés / risques
Les points ci-dessous correspondent à des constats déjà listés dans `PLAN-AMELIORATIONS.md` (qui semble provenir d’un audit outillé et “multi-agents”).

### 2.1 Quiz interactif inégal (fonction phare partiellement absent)
- Problème : le quiz auto-corrigé (`data-quiz`) n’est présent que sur une fraction des leçons.
- Impact : “feature” majeure passive pour le reste (listes ouvertes sans correction).
- Priorité : **P1**.

### 2.2 Échappements HTML / Prism : cas où le rendu peut être incorrect
- Problème : présence de `<` non échappés dans des blocs de code (masquage de texte).
- Impact : contenu affiché incorrect, risque de casser la lisibilité des comparaisons et des opérateurs.
- Priorité : **P1** (car visible et pédagogique).

### 2.3 Code “sur-échappé” (cas Haskell / HTML)
- Problème : échappement double / forme incorrecte dans le contenu de code affiché.
- Impact : le code affiché peut être faux (voire non compilable) et tromper l’apprenant.
- Priorité : **P1**.

### 2.4 Contraste du token `--gold` en thème clair
- Problème : contraste insuffisant sur certaines occurrences “gold” en thème clair.
- Impact : fail potentiel AA sur éléments importants (pastille, titres d’encadrés, numéros d’exercices).
- Priorité : **P1**.

### 2.5 Aucune balise Open Graph / Twitter Cards
- Problème : partage social sans aperçu.
- Impact : SEO social/UX. Moins critique en mode `file://`, mais important si hébergement web.
- Priorité : **P2 / M**.

## 3) Recommandations concrètes (ajouter / améliorer / supprimer)

### A — Ajouter (chantiers recommandés)
#### A1) Généraliser le quiz interactif (`data-quiz`) sur les leçons prioritaires
- Ajouter un bloc :
  - `<script type="application/json" data-quiz> ... </script>`
- Format à conserver : tableau JSON d’objets `q`, `a[]`, `correct`, `explain`.
- Stratégie : commencer par les cours “piliers” (JavaScript, Python, HTML/CSS, SQL, puis compilés).
- Gain : transforme le site en “vraie” plateforme d’auto-évaluation.

#### A2) Open Graph + Twitter Cards sur toutes les pages
- Ajouter dans le `<head>` :
  - `og:type`, `og:site_name`, `og:locale`, `og:title`, `og:description`, `og:image`
  - `twitter:card summary`
- Choisir `og:image` en ressources locales (ex. `assets/img/...`) pour rester cohérent `file://`.

#### A3) (P2) Accessibilité du quiz
- Rendre le feedback correct/incorrect **non-dépendant de la couleur**.
- Ajouter des textes/croix/labels et une `aria-live` pour l’explication.

#### A4) (P2) Charger Prism pour tous les langages secondaires réellement présents
- Actuellement, `index.html` charge uniquement un set minimal Prism.
- Les leçons ayant des blocs `language-bash` (et autres langages secondaires) risquent d’être non colorées.
- Action : stratégie scriptable pour inclure les composants Prism utilisés.

### B — Améliorer (corrections / qualité)
#### B1) Corriger les échappements `<` / `>` / `&` dans les `<code>`
- Remplacer `<` par `<` quand nécessaire.
- Vérifier aussi `&` et `>` pour éviter des cas ambigus.

#### B2) Corriger les cas de code sur-échappé
- Revenir aux formes simples : éviter les doubles `\\` dans les chaînes/regex quand le but est d’afficher une regex “normale”.
- Corriger également les blocs HTML ayant un inline mal échappé.

#### B3) Ajuster `--gold` pour atteindre AA en thème clair
- Ne pas toucher au thème sombre.
- Réviser :
  - `--gold` (couleur texte) et possiblement un dérivé `gold-weak` si présent.
- Valider les emplacements listés dans `PLAN-AMELIORATIONS.md` (variables.css + composants + pages).

#### B4) Accessibilité clavier / ARIA
- Menu mobile : s’assurer que les liens ne sont pas atteignables au tabbing quand le menu est fermé (via `hidden`/`inert`).
- Bascule de thème : `aria-pressed` + synchronisation au chargement.
- `aria-controls` sur les boutons de sous-navigation si manquant.

#### B5) Harmoniser l’UI / SEO technique avancé si déploiement web
- `canonical`, `JSON-LD` (Article + Breadcrumb), `sitemap.xml`, `robots.txt`.
- Important seulement si hébergement http.

### C — Supprimer / nettoyer
#### C1) Suppression d’une règle CSS morte
- `css/pages.css` contient une règle `[data-accent="html-css"]` sans cours associé.

#### C2) Documentation obsolète des totaux
- Mettre à jour README / docs si elles contiennent encore l’ancien nombre (ex. 51/714/45 vs 63/818/57 selon `README.md`).

### D — Ajouter un garde-fou (anti-régression)
#### D1) Script PowerShell “intégrité site”
- Objectif : éviter la réapparition de :
  - `<`/`&` non échappés,
  - JSON invalide `data-quiz`,
  - absence de composants Prism nécessaires,
  - divergence `data.js` ↔ fichiers réels,
  - présence de style/script inline interdits.
- À lancer après chaque série de changements.

## 4) Recommandation d’ordre d’exécution (efficacité)
1. **P1** : corrections d’échappement + sur-échappement + contraste `--gold`.
2. **P2** : amélioration accessibilité du quiz + resynchroniser ARIA clavier.
3. **P1 / énorme impact** : généraliser `data-quiz` (par lots de cours).
4. **P2** : Open Graph / Twitter Cards.
5. **P2** : Prism composants langages secondaires.
6. **P3** : nettoyage (règles CSS mortes, doc) + SEO technique avancé si hébergement web.
7. **Toujours** : lancer le script anti-régression après chaque étape.

## 5) Synthèse (statut actuel supposé d’après les fichiers de plan)
- Le socle design/JS/CSS est **solide**.
- Les lacunes sont surtout : **finition (échappements/contraste)** et **contenu/feature (quiz interactif)**.
- Les chantiers les plus rentables sont ceux indiqués en **P1** dans `PLAN-AMELIORATIONS.md`.

