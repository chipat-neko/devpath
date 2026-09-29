# Enrichissement v2 du site Syntaxe — plan d'exécution (pour le cron)

Chantier autonome **suivant** le chantier ENRICHISSEMENT.md (100 % terminé : site 75 cours / 900 leçons / 14 fils rouges,
certificat + badges). Demande de Noah (2026-06-26) : les **4 axes**, « étapes par étapes avec un cron », en autonomie.
Même méthode que `NOUVEAUX-COURS.md` et le chantier précédent. Français correct (accents). 100 % file://. Messages MINIMAUX.

## Méthode (UN item par réveil)
À chaque réveil : reprendre au PREMIER item non coché ci-dessous. Vérifier TOUJOURS avant de finir :
`node --check` (chaque JS touché) ; `JSON.parse` de chaque bloc `data-quiz`/`data-exos`/`data-quiz-bilan` ; 0 BOM ;
0 mojibake (`Ã©|Ã¨|Ã |Ã§|Â |Ã´|Ã®|Ã¹`) ; balises HTML équilibrées ; `file` de content existants. Cocher l'item fait
ici + MAJ `memory/enrichissement-cron-2.md`. Quand un COURS est complété (toutes leçons) → régénérer `js/search-index.js`
(script idempotent du scratchpad, cf. chantier précédent). **PAS de questionnaire aux réveils.**

Méthode fil rouge : `js/fil-rouge-<id>-data.js` (window.FIL_ROUGE : id/titre/sousTitre/intro/etapes[] ; chaque étape
course/courseTitle/dir/accent/phase/titre/depart/objectif/ajoute[]/criteres[]/livrable, 🏁 sur la dernière) +
`pages/fil-rouge-<id>.html` (copier un fil existant, adapter titre/breadcrumb/`<script ...-data.js>`) + entrée EN FIN de
`js/cours.js` FILS_ROUGES (page/total/label/map) + carte dans `pages/fils-rouges.html` (data-accent, data-fr-key=`syntaxe-fil-rouge-<id>`, data-fr-total).
Méthode cours / module avancé : cf. `NOUVEAUX-COURS.md` (data.js courses[]+content{}+lessonDurations{}, cours.html, leçons, accent CSS, catalogue.js, logo, brief).

---

## PHASE 1 — Compléter les fils rouges (intégrer les cours orphelins)
17 cours sans fil rouge. On crée de NOUVEAUX fils thématiques cohérents (vérifier la compo à chaque réveil, ≥2 cours/fil).
- [x] 1.1 Fil **« Un front-end de pro »** ✅ : a11y → perf-web → wasm (id `frontpro`). Hub 14→15 fils. Vérifié (node/objet/balises/0 BOM-mojibake).
- [x] 1.2 Fil **« Concevoir & déployer à l'échelle »** ✅ : archi → cloud → iac (id `echelle`). Hub 15→16 fils. Vérifié.
- [x] 1.3 Fil **« Construire une app d'IA »** ✅ : ml → llm → graphql (id `ia`). Compo validée (graphql = exposer l'IA via API). Hub 16→17 fils. Vérifié.
- [x] 1.4 Fil **« Systèmes fiables & concurrents »** ✅ : ada → erlang (id `fiabilite`, 2 étapes — pas de 3e orphelin pertinent ; rust/go/elixir déjà pris). Hub 17→18 fils. Vérifié.
- [x] 1.5 Cas solidity & vb ✅ : **laissés en PROJET AUTONOME** (décision motivée). solidity = aucun autre cours blockchain/Web3 (un fil forcé avec javascript serait artificiel) ; vb = aucun compagnon orphelin (csharp/.NET et powershell déjà pris). Les 2 ont déjà leur brief dans projets-data.js. Conforme au principe « ne pas forcer un fil ». **→ PHASE 1 TERMINÉE : 4 nouveaux fils (frontpro, echelle, ia, fiabilite), 14→18 fils rouges.**

## PHASE 2 — Nouveaux cours (trous thématiques restants)
- [x] 2.0 **AUDIT FAIT** : catalogue très complet côté langages (33) ; les vrais trous sont des thèmes **transversaux/système**. Liste retenue (5 cours, 6 leçons chacun, → 75→80 cours). Modèle = cours CONCEPTUEL (style a11y/archi/cloud). Accents à finaliser à la création (éviter doublons visuels).
- [x] 2.1 **`linux`** ✅ — « Linux & administration système » (6 leçons, accent #6d8b3c). search-index 900→906. **Site 75→76 cours.** Vérifié (node, JSON dont bilan, 0 BOM/mojibake, balises, 6 fichiers OK).
- [x] 2.2 **`reseaux`** ✅ — « Réseaux : comment marche Internet » (6 leçons, accent #3a56b0/#7088e0 — corrigé vs collision vscode/kubernetes). search-index 906→912. **Site 76→77 cours.** Vérifié.
- [x] 2.3 **`ux`** ✅ — « UX & design d'interface » (6 leçons, accent #c75b9e/#e183bf). search-index 912→918. **Site 77→78 cours.** Vérifié.
- [x] 2.4 **`observabilite`** ✅ — « Observabilité & SRE » (6 leçons, accent #3a8fb0/#5fb0cf). search-index 918→924. **Site 78→79 cours.** Vérifié.
- [x] 2.5 **`os`** ✅ — « Systèmes d'exploitation : les fondations » (6 leçons, accent #7a6f9c/#9c91be). search-index 924→930. **Site 79→80 cours.** Vérifié. **→ PHASE 2 TERMINÉE (5 cours : linux, reseaux, ux, observabilite, os).**
- Méthode par cours = NOUVEAUX-COURS.md (data.js courses[]+content{}+durations, cours.html, leçons data-quiz+data-exos type:text + capstone/data-quiz-bilan sur L6, accent CSS clair+sombre, catalogue.js, logo logos.js, brief projets-data.js, fil rouge si pertinent). Régénérer search-index quand le cours est complet. 1 cours = plusieurs réveils (ossature+L01, puis 2 leçons/réveil, puis capstone+bilan+index).

## PHASE 3 — Approfondir d'autres cours phares (modules avancés)
- [x] 3.0 **AUDIT FAIT** : les candidats initiaux (react/typescript/nodejs/go/java/csharp) ont TOUS déjà un module « en profondeur » / « Hooks avancés » (13-22 leçons) → approfondir serait redondant. Audit élargi → vrais trous = **vue (6 leç), api (6 leç), sass (7 leç)**, sans module avancé (html/css ont leur cours -avance). Retenus : vue, api, sass. Méthode = MODULE avancé ajouté au cours existant (PAS un nouveau cours, PAS de capstone/bilan — cf. v1 securite) : content.<id>.modules += 1 module + leçons pages/<id>/lecon-NN.html (data-quiz + data-exos type:text) + durations + courses[].lessons/hours + régénérer search-index du dir.
- [x] 3.1 **`vue`** ✅ (6→9) — module M4 « Vue confirmé » : L07 Composition API & composables · L08 Patterns de composants avancés (slots, provide/inject, async, Teleport) · L09 État (Pinia), performance & production. search-index 930→933. **Site → 933 leçons.** Vérifié.
- [x] 3.2 **`api`** ✅ (6→9) — module M4 « API à l'échelle » : L07 Auth avancée (OAuth2/JWT/refresh) · L08 Performance & fiabilité (cache HTTP/ETag, rate limiting, idempotence, pagination curseur) · L09 Au-delà de REST (GraphQL/gRPC/WebSockets). search-index 933→936. **Site → 936 leçons.** Vérifié.
- [x] 3.3 **`sass`** ✅ (7→9) — module M4 « Sass à l'échelle » : L08 Architecture CSS (7-1, BEM, spécificité plate) · L09 Design system (maps/tokens, génération d'utilitaires @each, thématisation Sass+custom properties). Prism css+scss. search-index 936→938. **Site → 938 leçons.** ⚠️ bilan laissé sur L07 (1 seul par cours, comme vue/api). Vérifié. **→ PHASE 3 TERMINÉE (3 modules avancés : vue, api, sass).**

## PHASE 4 — Audit qualité transversal
- [x] 4.0 **AUDIT automatisé ✅** : script Node `scratchpad/audit-qualite.js` (parcourt data.js + 80 cours.html + 938 lecon-*.html). Rapport → `D:\test-claude\AUDIT-QUALITE.md`. 107 anomalies brutes → analyse : **1 vrai défaut** + 70 faux positifs (limites de l'outil naïf). Vérifié 0 : leçon sans quiz/exos, cours sans #recap, JSON invalide, BOM, related invalide, lessons incohérent, fichier manquant.
- [x] 4.1 **CORRECTION ✅** : le cours JS (`id="javascript"`, `dir="js"`, seul cours id≠dir) avait ses durées sous la clé `durations["js"]` (le dir) alors que `cours.js` lit `durations[data-course]` = l'**id** → durées invisibles. **Clé renommée `"js"`→`"javascript"`** (37 durées). Vérifié. Les 70 restants = faux positifs (balises/liens/mojibake = exemples de code des cours HTML, leçons sur l'encodage) → aucune action justifiée. **PHASE 4 TERMINÉE.**

---

## Reprise & fin
À chaque réveil : reprendre au PREMIER item `[ ]`. Quand TOUT est coché : vérif légère globale, régénérer
`js/search-index.js` si des leçons ont changé, MAJ mémoire, **supprimer le cron** (CronDelete), n'inventer aucun travail.
Messages MINIMAUX, PAS de questionnaire aux réveils. Français correct. 100 % file://.
