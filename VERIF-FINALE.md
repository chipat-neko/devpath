VERDICT: VERT

# Passe de sécurité de fin de chantier — 2026-08-14

Site **Syntaxe** (`d:\test-claude`). Contrôle de bout en bout, non interactif, **sans ajout de
contenu**. Réveil automatique (tâche planifiée). Chantier détecté terminé : aucun cours `-avance`
actif, toutes les leçons enrichies, plan coché. **Aucune correction n'a été nécessaire ce
réveil** : le site était déjà cohérent (les compteurs `modules · leçons` avaient été corrigés
lors de la passe du 2026-08-13). Tous les contrôles sont **verts**.

Chiffres de référence (vérité terrain, `js/data.js` = source) : **83 cours · 1463 leçons**, tous
en statut « complet », **75 langages** distincts. Cohérence prouvée par trois voies indépendantes :
`content` (somme des leçons) ⇄ `courses[].lessons` (somme des champs) ⇄ fichiers `lecon-*.html`
sur le disque → **1463 partout**.

> Note : le brief de réveil citait « 1425 leçons / 139 pages » ; ce sont des chiffres périmés.
> La réalité mesurée est 1463 leçons et 146 pages de rendu (échantillon leçons + toutes les pages
> hors-cours). Aucun écart réel, seulement un brief non à jour.

---

## 0) Les trois outils du projet — tous en code 0

| Outil | Portée | Résultat |
|---|---|---|
| `node tools/verif-html.js` | 1552 fichiers (source, balises dans les blocs de code) | **0 grave / 0 attention** — exit 0 |
| `node tools/verif-donnees.js` | 17 invariants (courses/content/durations, liens, index, doublons QCM) | **0 erreur**, 1 avertissement non bloquant — exit 0 |
| `node tools/verif-rendu.js --tout --lecons` | 146 pages × largeur × thème = **876 mesures** (débordement, contraste, focus, aria, console, réseau) | **0 erreur / 0 avertissement** — exit 0 |

Le seul signalement est l'**avertissement I17** de `verif-donnees` (non bloquant, l'outil sort en 0) :
`zig lecon-06#2 ↔ lecon-14#1`, similarité 0.33 (énoncé et bonne réponse). Déjà connu et documenté
comme « à juger » (vrai doublon, ou deux faces d'une même notion). Le corriger reviendrait à
**réécrire un QCM = production de contenu**, exclue par la consigne de ce réveil. Laissé en réserve
(cf. §Problèmes restants).

---

## 1) Contrôles complémentaires (scripts jetables `scratchpad/vf-*.js`)

| # | Contrôle | Mesure | Résultat |
|---|---|---|---|
| a | **Syntaxe JS** — `node --check` sur tout `js/` | 81 fichiers | ✅ 0 erreur |
| b | **JSON des blocs** `data-quiz` / `data-exos` / `data-quiz-bilan` | 3009 blocs (1463 + 1463 + 83) | ✅ tous valides |
| c | **Encodage** — BOM + mojibake | 1919 fichiers | ✅ 0 BOM ; mojibake **volontaire** uniquement (leçons encodage/formats) |
| d | **Liens** — content⇄disque, redirections, nav interne | 1463 fichiers + 24 095 liens de nav | ✅ 0 manquant, 0 orphelin, 0 cassé |
| e | **search-index** — 1 entrée par leçon, 0 `-avance` | 1463 docs | ✅ 0 manquante, 0 en trop, 0 doublon |
| f | **Durées** — 1 entrée par leçon par cours | 83 cours | ✅ 0 incohérence |
| g | **Niveaux** — level sur html/css/js/python, 0 résidu `-avance` | 4 cours, 68 modules | ✅ tous les modules portent un `level` (déb/int/expert) |
| h | **Redirections** `-avance` → leçon réelle | 93 fichiers | ✅ toutes valides, décalages exacts |
| i | **Compteurs affichés** cours / leçons / langages | accueil + catalogue + 4 pages | ✅ 83 / 1463 / 75 partout |

### Détails notables

- **(c) Mojibake volontaire** : 6 fichiers du site contiennent des `Ã©`, `GenÃ¨ve`, « le fameux Ã© »
  etc. — ce sont des **démonstrations pédagogiques** d'encodage cassé (`pages/formats/lecon-06`,
  `pages/r/lecon-06`, `pages/html/lecon-15`, `pages/perl/lecon-13`, `pages/pandas/lecon-13`, et
  `js/quiz-index.js` qui en dérive le QCM). Aucun mojibake **involontaire**. Les `.md` de la racine
  (rapports de chantier) ne sont pas servis.
- **(d) Faux positifs écartés** : un premier passage naïf signalait 154 « liens cassés », **tous**
  situés dans des exemples de code (`<pre><code>` à chevrons échappés mais guillemets réels) et des
  `<text>` SVG illustrant du code (`contact.html`, `styles.css`, `app.js`…). Après retrait des zones
  de code/SVG/JSON, **0 lien de navigation réel cassé** sur 24 095.
- **(e) Piège `dir` ≠ `id`** : le cours `javascript` a `dir: "js"` ; `search-index` indexe par
  **dossier**. Comparaison faite sur `dir` → parfaite correspondance 1463/1463.
- **(g) `-avance` résiduel** : les seules occurrences de `-avance` dans `js/` sont **légitimes** —
  `main.js` (table de redirection des 4 anciens dossiers), `projets.js` (alias d'anciennes URL de
  projets, valeurs sans `-avance`), `pill--avance` (badge de niveau « Avancé »), et `data.js`
  `id:"front-avance"` = **identifiant de parcours** « Front-end : au-delà des bases » (≠ cours
  fusionné). `catalogue.js`, `cours.js`, `flashcards-data.js`, `quiz-index.js`, `logos.js`,
  `projets-data.js` et les `fil-rouge-*` sont **totalement propres**.
- **(h) Redirections** : `html-avance`(+25), `css-avance`(+25), `js-avance`(+42→`js`),
  `python-avance`(+28), soit 22+22+23+22 = **89 leçons + 4 `cours.html` = 93 pages**, chacune avec
  `meta refresh` + `canonical` cohérents pointant vers une leçon réellement présente.
- **(i) Compteurs de cours** (`pages/<dir>/cours.html`, « N modules · M leçons ») : **83/83**
  cohérents avec `content` (77 au format standard, 6 en format alterné vérifiés à la main :
  python 17/50, css 15/47, git 7/24, sql 8/24, react 8/26, projets-js …/24).

---

## Corrections effectuées

**Aucune.** Le site était déjà cohérent de bout en bout. Ce réveil est un contrôle pur ; aucun
fichier du site n'a été modifié.

## Problèmes restants

1. **Avertissement I17 (zig)** — `lecon-06#2 ↔ lecon-14#1`, similarité 0.33 sur l'énoncé et la bonne
   réponse. **Non bloquant** (les trois outils sortent en 0). Trancher « vrai doublon » vs « deux
   faces d'une notion » puis réécrire l'un des deux QCM relève d'une **production de contenu**, hors
   périmètre d'une passe de sécurité. À reprendre dans un chantier QCM (Phase E de V6), pas ici.

Aucun autre problème. **VERDICT : VERT.**
