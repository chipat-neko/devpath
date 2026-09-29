# Audit UI/UX — Site « Syntaxe »

> Audit réalisé avec le skill **ui-ux-pro-max** (référentiel de 99 règles UX réparties en
> 10 catégories de priorité). Date : 2026-06-29. Périmètre : `d:\test-claude`
> (site de cours en HTML/CSS/JS pur, 1080 pages, 81 dossiers de cours, ~8 900 lignes de CSS).

## 0. Verdict général

**Le site est déjà très au-dessus de la moyenne.** Le design system maison (`css/variables.css`,
`DESIGN_SYSTEM.md`) est cohérent, tokenisé et délibérément éloigné du « défaut IA » : papier chaud,
accent cobalt rare, signature monospace, thème clair/sombre, contraste visé AA, `prefers-reduced-motion`
géré, `skip-link`, `:focus-visible`, attributs ARIA présents.

> ⚠️ Note méthodologique : le moteur de recommandation du skill propose pour la requête « plateforme
> de cours » un style **Claymorphism rose / App Store** — **inadapté** à ce site éditorial-technique.
> Sa recommandation de *style* a donc été écartée ; seul son **référentiel de règles** (accessibilité,
> tactile, performance, hiérarchie, typo) a servi de grille d'audit. Le design system existant reste
> la source de vérité.

L'audit ne liste donc **pas** une refonte, mais une série d'**améliorations ciblées**, classées par
priorité, avec pour chacune : sévérité, effort, fichiers concernés et marche à suivre concrète.

Légende — **Sévérité** : 🔴 à corriger / 🟠 recommandé / 🟡 polish. **Effort** : ⏱️ rapide (<30 min) /
⏳ moyen / ⌛ conséquent.

---

## 1. 🔴 Crédibilité — chiffres périmés sur l'accueil

**Sévérité : 🔴 à corriger · Effort : ⏱️ rapide · Fichier : `index.html`**

L'accueil annonce **« 65 cours / 832 leçons / 59 langages »** à **6 endroits**, alors que le site
compte aujourd'hui **80 cours / 938 leçons** (cf. campagnes d'enrichissement). Un visiteur qui voit
65 cours puis en découvre 80 au catalogue perçoit un site mal tenu : c'est le défaut le plus visible.

Emplacements (`index.html`) :
- ligne 9 : `<meta name="description">` (« 65 cours … 832 leçons »)
- ligne 105-106 : « **65 cours** entièrement rédigés »
- ligne 118-120 : bloc `hero__meta` (`65` / `832` / `59`)
- ligne 138 : « 59 langages au total »
- ligne 505 : « Explorer les **65 cours** du catalogue »

### Marche à suivre
1. Recompter la vérité terrain :
   ```bash
   # nb de cours = nb de dossiers contenant un cours.html
   find pages -maxdepth 2 -name cours.html | wc -l
   # nb de leçons
   find pages -name 'lecon-*.html' | wc -l
   ```
2. Remplacer les 6 occurrences par les valeurs réelles (et arrondir : « 80 cours », « 930+ leçons »).
3. **Pérenniser** : exposer ces chiffres via `js/data.js` (qui connaît déjà la liste des cours) et les
   injecter au chargement, pour qu'ils ne périment plus jamais :
   ```html
   <div><strong data-stat="courses">—</strong> cours complets</div>
   <div><strong data-stat="lessons">—</strong> leçons rédigées</div>
   ```
   ```js
   // home.js — source unique : data.js
   const n = Object.keys(window.COURSES).length;
   document.querySelectorAll('[data-stat="courses"]').forEach(el => el.textContent = n);
   ```

---

## 2. 🟠 Accessibilité — cibles tactiles sous 44 px (règle CRITIQUE du skill)

**Sévérité : 🟠 recommandé · Effort : ⏱️ rapide · Fichiers : `css/components.css`, `css/layout.css`**

Le skill classe la taille des cibles tactiles en **priorité 2 (CRITICAL)** : minimum **44×44 px**.
Trois boutons d'en-tête sont à **42×42 px** :
- `.theme-toggle` — `components.css:525-526`
- `.accent-toggle` — `components.css:548-549`
- `.nav-toggle` (hamburger mobile) — `layout.css:122-123`

C'est juste en dessous : sur mobile, l'écart augmente le risque de tap manqué.

### Marche à suivre
Passer ces trois boutons à **44 px** (l'icône interne reste à sa taille, seul le hit-area grandit) :
```css
.theme-toggle, .accent-toggle, .nav-toggle { width: 44px; height: 44px; }
```
Vérifier ensuite que la hauteur d'en-tête (`--header-h: 68px`) reste équilibrée (elle l'est : 44 + marges).

---

## 3. 🟠 Hiérarchie visuelle — le pied de page « Explorer » est en surcharge

**Sévérité : 🟠 recommandé · Effort : ⏳ moyen · Fichier : `index.html` (lignes 639-685) + `js/main.js`**

La colonne **« Explorer »** du footer aligne **~40 liens à plat**, sans regroupement. Conséquences :
- **Déséquilibre visuel** : cette colonne est 4× plus haute que les autres (`Cours`, `À propos`).
- **Surcharge cognitive** : 40 cibles équivalentes, aucune hiérarchie — l'œil ne sait pas où aller.
- Va à l'encontre de la règle `whitespace-balance` / `visual-hierarchy` (priorité 5-6 du skill).

### Marche à suivre
Scinder « Explorer » en **3-4 sous-groupes titrés** (chaque groupe = un `<nav>` avec un `<h4>`), ou
réduire à 6-8 liens « vedettes » + un lien « Tout voir » vers une page plan du site. Proposition de
regroupement :

| Sous-groupe | Liens |
|-------------|-------|
| **Pratiquer** | Bac à sable, Console, Défis, Projets, Fils rouges, Examen blanc |
| **Réviser** | Recherche, Flashcards, Mes notes, Mes QCM, Glossaire, Antisèches |
| **Outils dev** | Boîte à outils, Regex, JSON, Convertisseur, Comparateur, Couleurs |
| **Référence** | Structures de données, Fiches, Lexique, Carte des cours |

Visuellement : garder 4 colonnes équilibrées, titres de sous-groupes en `.kicker` (mono, déjà au style).

---

## 4. 🟡 Cohérence des icônes — glyphes texte mélangés

**Sévérité : 🟡 polish · Effort : ⏳ moyen · Fichier : `index.html` (cartes parcours), `js/logos.js`**

Les cartes de cours utilisent deux familles de glyphes incohérentes :
- **Logos** (bien) : `data-course-logo="javascript"` → rendu typographique cohérent (`JS`, `Py`, `Rs`…).
- **Glyphes symboliques** (à harmoniser) : `★`, `</>`, `{ }`, `O(n)` en texte brut (lignes 350, 359, 368, 377).

Le `★` notamment est un **caractère Unicode utilisé comme icône** — exactement l'anti-pattern
`no-emoji-icons` (priorité 4 du skill : « utiliser des SVG, pas des glyphes/émojis comme icônes
structurelles »). Rendu variable selon la police système, non contrôlable par les tokens.

### Marche à suivre
1. Remplacer `★` / `</>` / `{ }` / `O(n)` des cartes **Parcours** par des icônes SVG inline (même
   famille stroke 2px que le reste du site — cf. les `<svg class="icon">` déjà partout).
2. Idéalement, dériver ces glyphes du même mécanisme `data-course-logo` que les autres cartes pour
   une cohérence totale.

---

## 5. 🟡 Performance perçue — chargement des polices

**Sévérité : 🟡 polish · Effort : ⏳ moyen · Fichiers : `index.html` (head), `css/`**

Les polices viennent du **CDN Google Fonts** avec `display=swap` (bien : pas de texte invisible).
Améliorations possibles (règles `font-preload`, `font-loading`, priorité 3) :
- **Précharger** uniquement la police critique du corps (Inter) pour réduire le FOUT au premier rendu.
- **Self-hoster** les 3 familles (`assets/fonts/`) : supprime la dépendance réseau tierce, accélère et
  évite tout décalage si le CDN est lent/bloqué. Le repli système est déjà prévu dans `variables.css`.

### Marche à suivre (option préchargement, rapide)
```html
<link rel="preload" as="font" type="font/woff2" crossorigin
      href="https://fonts.gstatic.com/s/inter/...woff2" />
```
(Option self-host = ⌛ plus longue : télécharger les `.woff2`, écrire les `@font-face`, retirer le `<link>` CDN.)

---

## 6. 🟡 Rythme & profondeur visuelle (opportunités de polish)

**Sévérité : 🟡 polish · Effort : ⏳ moyen · Fichiers : `css/pages.css`, `css/components.css`**

Le site est volontairement sobre (filets plutôt qu'ombres). Quelques touches peuvent renforcer le
caractère « revue premium » sans trahir le parti pris :

- **Micro-interaction sur les cartes** : un léger `translateY(-2px)` + passage à `--shadow-1` au survol
  (≤200 ms, `transform`/`box-shadow` uniquement — conforme `transform-performance` et `duration-timing`).
  Vérifier qu'il existe déjà ; sinon l'ajouter à `.course-card:hover` / `.home-tool:hover`.
- **Hero — densité visuelle** : la colonne `hero__visual` (grille de langages) est efficace ; on peut
  l'enrichir d'un mini-bloc « éditeur » (barre de titre + 4-5 lignes de code colorées) cohérent avec la
  signature « blocs de code éditeur » du design system. Renforce le message « on code pour de vrai ».
- **Stagger d'apparition** : faire apparaître les cartes d'une grille avec un décalage de 30-50 ms par
  carte (règle `stagger-sequence`), **derrière `prefers-reduced-motion`**. Effet « pro » discret.
- **Filets dorés** : le miel (`--gold-line`) est sous-exploité hors titres ; un filet de 2px sous les
  `kicker` de section accentuerait le rythme éditorial.

---

## 7. ✅ Points déjà conformes (à préserver)

Ces éléments passent l'audit — **ne pas régresser** lors des modifications ci-dessus :

- [x] **Tokens** : couleurs/typo/espacements/rayons centralisés (`variables.css`), pas de magie en dur
      (les hex de `pages.css` sont des **couleurs de marque par langage** — usage légitime).
- [x] **Contraste** visé AA dans les deux thèmes ; encres `--ink-2` / `--ink-3` calibrées.
- [x] **Thème sombre** conçu en parallèle (tons désaturés, pas une inversion brutale).
- [x] **`:focus-visible`** avec anneau 2.5px ; `:focus:not(:focus-visible)` propre.
- [x] **`prefers-reduced-motion`** : animations/scroll neutralisés (`base.css:23-33`).
- [x] **`skip-link`**, `aria-current`, `aria-expanded/controls`, `aria-label` sur boutons icône.
- [x] **Échelle d'espacement 4px** et type scale modulaire respectées.
- [x] **Pas de dégradé violet→bleu** ni d'ombres molles génériques (anti « défaut IA »).
- [x] **Icônes SVG stroke 2px** cohérentes (sauf cas du §4).

---

## 8. Plan d'action recommandé (ordre conseillé)

| # | Action | Sévérité | Effort |
|---|--------|----------|--------|
| 1 | Corriger les stats 65/832/59 → 80/938 (+ injection auto via `data.js`) | 🔴 | ⏱️ |
| 2 | Boutons d'en-tête 42 → 44 px | 🟠 | ⏱️ |
| 3 | Restructurer le footer « Explorer » en sous-groupes | 🟠 | ⏳ |
| 4 | Harmoniser les glyphes de cartes (SVG au lieu de `★`, `</>`…) | 🟡 | ⏳ |
| 5 | Précharger / self-host les polices | 🟡 | ⏳ |
| 6 | Polish : hover cartes, bloc éditeur du hero, stagger, filets dorés | 🟡 | ⏳ |

**Note sur le périmètre** : les corrections 1-2 sont locales et sûres. Les 3-6 touchent des composants
partagés répétés sur de nombreuses pages — **régénérer `search-index.js` n'est pas nécessaire** (rien
ne change côté contenu de leçon), mais toute modif d'un composant partagé doit être **vérifiée sur les
3 types de page** (accueil, page cours, page leçon) et en mobile (390 px) via `tools/shot.ps1`, comme
le prévoit déjà la « boucle qualité » du `DESIGN_SYSTEM.md`.

---

## 8 bis. Suivi d'application (2026-06-29)

Les 6 actions du plan ont été appliquées et vérifiées (rendu Chrome headless desktop 1440 +
mobile 390, `node --check` JS, équilibre des accolades CSS).

| # | Action | Statut | Fichiers modifiés |
|---|--------|--------|-------------------|
| 1 | Stats 65/832/59 → **80/938/73** (FR + i18n EN) | ✅ | `index.html`, `js/main.js`, `pages/a-propos.html`, `pages/catalogue.html`, `pages/recherche.html`, `js/recherche.js` |
| 2 | Contrôles d'en-tête 42 → **44 px** (toggle thème/accent/langue/menu + xp-badge) | ✅ | `css/components.css`, `css/layout.css` |
| 3 | Footer « Explorer » (40 liens) → **3 colonnes titrées** + À propos sous la marque ; grille 5 col responsive | ✅ | `index.html`, `css/layout.css` |
| 4 | Glyphes `★ </> { } O(n)` → **icônes SVG** (rocket / code / database / cpu) | ✅ | `index.html` |
| 5 | **Préchargement** de la feuille de polices (URL stable, sans hash fragile) | ✅ | `index.html` |
| 6 | **Hover** des cartes-outils (`.home-tool`) — manque réel comblé | ✅ | `css/pages.css` |

**Choix de portée assumés :**
- Libellé du 3ᵉ chiffre = « **langages & technologies** » (le champ `language` de `data.js` compte
  73 valeurs dont des technos : Docker, Kubernetes, CI/CD… — « 73 langages » seul serait faux).
  Cohérent avec le libellé déjà présent sur `a-propos`.
- **#5** : self-hosting des polices NON fait (URL gstatic à hash = fragile, et self-host = chantier
  binaire à part). Préchargement de la CSS retenu comme gain sûr.
- **#6** : sur demande explicite, le **bloc « éditeur » du hero** et un **stagger sobre** ont
  finalement été ajoutés (voir ci-dessous). Les **filets dorés globaux** restent écartés (parti pris
  de retenue). L'éditeur réutilise le composant `.code-block` existant — le CSS du hero prévoyait
  d'ailleurs déjà un emplacement « fenêtre de code décorative » (`.hero__visual .code-block`).
- `starter/` (kit téléchargeable) laissé tel quel : contenu réduit avec ses propres chiffres.

**Ajouts #6 (2ᵉ passe) :**
- 🖥️ **Bloc éditeur du hero** (`index.html` + `.hero-editor` dans `pages.css`) : fenêtre `syntaxe.js`
  avec coloration syntaxique (tokens existants), au-dessus de la mosaïque. **Masqué sous 880 px**
  pour garder le mobile épuré.
- ✨ **Stagger d'apparition** des tuiles de langage (`@keyframes hero-fade-up`), **scopé dans
  `@media (prefers-reduced-motion: no-preference)`** : si l'utilisateur réduit les animations, les
  tuiles restent simplement visibles (pas de disparition).

**Fausse alerte levée (honnêteté) :**
- Le « débordement mobile » de la mosaïque suspecté lors de la 1ʳᵉ passe était un **artefact de la
  capture headless** : à `--window-size=390`, Chrome rend en réalité à `innerWidth≈484 px` mais écrit
  une image de 390 px de large → le côté droit est coupé dans l'image, pas à l'écran. Vérifié par
  mesure directe. **Aucun débordement réel** sur un vrai appareil 390 px (`.container`=342 px → la
  mosaïque tient). Le breakpoint 2 colonnes d'origine (`420 px`) est conservé.

---

## 9. Check-list de vérification avant livraison (issue du skill)

- [ ] Aucun glyphe/émoji utilisé comme icône structurelle (SVG partout)
- [ ] Toutes les cibles tactiles ≥ 44×44 px
- [ ] Contraste texte ≥ 4.5:1 (corps) / 3:1 (grand) — **dans les deux thèmes**
- [ ] `:focus-visible` visible sur tout élément interactif
- [ ] `prefers-reduced-motion` respecté par les nouvelles animations
- [ ] Hover/active des cartes en `transform`/`opacity` uniquement (pas de width/height)
- [ ] Testé à 390 px (mobile) et en thème sombre
- [ ] Chiffres affichés = vérité terrain (pas de valeur figée périmée)
