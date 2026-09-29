# Audit qualité transversal — Syntaxe
Date : 2026-06-26
Cours : 80 · Leçons scannées : 938

**TOTAL anomalies brutes : 70** (après correction) — toutes analysées comme **faux positifs** (voir synthèse).

## Synthèse de l'analyse (PHASE 4)

L'audit a d'abord relevé **107 anomalies**. Analyse :

### ✅ 1 vrai défaut — CORRIGÉ
- **`duration-manquante` (37 occurrences, cours JavaScript)** : le grand cours JS a `id="javascript"` mais
  `dir="js"` (seul cours du site où id ≠ dir). Ses durées étaient stockées sous la clé `durations["js"]` (le dir),
  alors que `cours.js` les lit par `data-course` = l'**id** (`durations["javascript"]`). Résultat : aucune durée par
  leçon ne s'affichait dans l'accordéon du cours JS. **Correctif** : clé `durations` renommée `"js"` → `"javascript"`.
  Vérifié : `durations["javascript"]` = 37 clés, le code les trouve désormais.

### ⓘ 70 faux positifs — AUCUNE action (limites de l'outil naïf, pas des défauts du site)
- **`balises-desequilibrees` (46)** : exclusivement des leçons qui **enseignent le balisage** (html, html-avance,
  css, react, vue…). Elles contiennent des fragments `<html`, `<body`, `<nav`… dans des **exemples de code** (parfois
  échappés `&lt;html&gt;`, parfois en commentaire), que le comptage naïf de balises ne sait pas distinguer du balisage
  réel. Les blocs `data-quiz/exos/bilan` sont tous **JSON valides** (0 `json-invalide`), les pages se rendent correctement.
- **`lien-mort` (21)** : exclusivement dans les cours html/html-avance. Ce sont des `href="contact.html"`, `index.html`,
  `apropos.html`… **à l'intérieur d'exemples de code échappés** (`&lt;a href="contact.html"&gt;`) montrant comment écrire
  un lien. Le regex capture le texte du `href` dans le code, mais ce ne sont pas des liens de navigation réels.
- **`mojibake` (3)** : `formats/lecon-06`, `html/lecon-15`, `r/lecon-06` — trois leçons qui **expliquent justement
  le mojibake / l'encodage** et affichent volontairement « Ã© » comme **exemple pédagogique** du problème. Contenu correct.

### Catégories vérifiées **sans aucune anomalie**
content-manquant · dossier-manquant · cours-html-manquant · lessons-incoherent · fichier-lecon-manquant ·
duration-orpheline · related-invalide · **cours-sans-recap (0/80)** · **lecon-sans-quiz (0/938)** ·
**lecon-sans-exos (0/938)** · **json-invalide (0)** · bom (0).

**Conclusion : le site est sain.** Les 938 leçons ont toutes un `data-quiz` et un `data-exos` ; les 80 cours.html ont
tous leur `#recap` ; aucun lien interne réel cassé, aucun `related` invalide, aucun JSON cassé, aucun BOM, aucun
mojibake réel. Le seul défaut effectif (durées du cours JS) est corrigé.

---

## Détail brut de l'outil (référence)

## content-manquant — 0
_(aucun)_

## dossier-manquant — 0
_(aucun)_

## cours-html-manquant — 0
_(aucun)_

## lessons-incoherent — 0
_(aucun)_

## fichier-lecon-manquant — 0
_(aucun)_

## duration-manquante — 0
_(aucun)_

## duration-orpheline — 0
_(aucun)_

## related-invalide — 0
_(aucun)_

## cours-sans-recap — 0
_(aucun)_

## lecon-sans-quiz — 0
_(aucun)_

## lecon-sans-exos — 0
_(aucun)_

## json-invalide — 0
_(aucun)_

## balises-desequilibrees — 46
- js/lecon-10.html <ul> 4/3
- js/lecon-11.html <ul> 6/5
- html/lecon-01.html <div> 36/31
- html/lecon-01.html <nav> 10/5
- html/lecon-01.html <main> 2/1
- html/lecon-01.html <body> 6/1
- html/lecon-02.html <ul> 6/2
- html/lecon-02.html <ol> 7/2
- html/lecon-04.html <figure> 12/11
- html/lecon-11.html <div> 32/29
- html/lecon-11.html <section> 5/0
- html/lecon-11.html <article> 6/1
- html/lecon-11.html <nav> 6/5
- html/lecon-11.html <main> 5/1
- html/lecon-13.html <div> 34/29
- html/lecon-14.html <body> 2/1
- html/lecon-15.html <html> 2/1
- html/lecon-20.html <div> 42/41
- html/lecon-20.html <section> 1/0
- html/lecon-20.html <ul> 5/3
- html/lecon-20.html <ol> 4/2
- html/lecon-20.html <main> 3/1
- html/lecon-20.html <header> 3/2
- html-avance/lecon-01.html <details> 16/4
- html-avance/lecon-03.html <div> 36/35
- html-avance/lecon-07.html <div> 36/35
- html-avance/lecon-08.html <div> 29/28
- html-avance/lecon-08.html <figure> 8/7
- html-avance/lecon-08.html <details> 4/3
- html-avance/lecon-12.html <html> 6/1
- html-avance/lecon-17.html <details> 6/5
- css/lecon-01.html <body> 2/1
- css/lecon-02.html <ul> 5/4
- css/lecon-04.html <html> 2/1
- css/lecon-09.html <body> 2/1
- css/lecon-10.html <html> 2/1
- css-avance/lecon-02.html <section> 1/0
- css-avance/lecon-02.html <body> 2/1
- css-avance/lecon-06.html <body> 2/1
- css-avance/lecon-07.html <body> 2/1
- react/lecon-01.html <div> 33/31
- react/lecon-02.html <div> 30/29
- markdown/lecon-06.html <details> 8/5
- vue/lecon-01.html <footer> 2/1
- vue/lecon-01.html <body> 2/1
- vue/lecon-01.html <html> 2/1

## bom — 0
_(aucun)_

## mojibake — 3
- html/lecon-15.html
- formats/lecon-06.html
- r/lecon-06.html

## lien-mort — 21
- html/lecon-01.html → index.html
- html/lecon-01.html → contact.html
- html/lecon-01.html → apropos.html
- html/lecon-01.html → contact.html
- html/lecon-03.html → apropos.html
- html/lecon-03.html → blog/article.html
- html/lecon-03.html → ../index.html
- html/lecon-03.html → apropos.html
- html/lecon-03.html → index.html
- html/lecon-03.html → apropos.html
- html/lecon-03.html → blog.html
- html/lecon-03.html → contact.html
- html/lecon-03.html → tarifs.html
- html/lecon-03.html → index.html
- html/lecon-03.html → services.html
- html/lecon-03.html → blog.html
- html/lecon-03.html → contact.html
- html/lecon-13.html → chat.html
- html-avance/lecon-10.html → /etape-2.html
- html-avance/lecon-10.html → /etape-2.html
- html-avance/lecon-10.html → page.html

