# Chantier V9 — le parcours de l'apprenant

Plan de travail de l'autonomie. **Source de vérité : ce fichier.** Chaque réveil lit ce plan,
prend la **première case non cochée**, la traite entièrement, la coche avec un compte rendu chiffré,
puis passe à la suivante. Le chantier est fini quand il ne reste aucune case `- [ ]`.

**Origine** : le dernier manque de l'audit du 2026-08-01 jamais traité (M5), plus ce qu'une mesure du
2026-08-12 a révélé en observant ce que le site **dit réellement** à trois moments du parcours —
vierge, en cours, tout terminé.

Le site est techniquement sain : les quatre vérificateurs sont verts, les 1 362 leçons tiennent le
standard éditorial. **Ce qui manque n'est plus de la qualité, c'est de l'attention à celui qui
apprend.** Le site sait tout compter et ne dit jamais rien.

---

## Ce que la mesure a montré (reproduire avant de corriger)

**Méthode** : semer `localStorage` (`syntaxe-progress`) à trois états, charger les pages clés dans
Chrome headless, relever les phrases adressées à l'apprenant. Une sonde jetable suffit ; le piège
habituel s'applique — **un test avec un stockage vide ment**.

| État | Ce que le site dit aujourd'hui |
|---|---|
| **Vierge** | L'accueil affiche « Reprends où tu t'es arrêté » et un bouton **Reprendre** sans destination |
| **En cours** | Cohérent dans l'ensemble |
| **Tout terminé** (1362/1362, 76 cours) | L'accueil dit encore « **Reprends où tu t'es arrêté — Zig 18/18** ». La page Progression affiche « 76 cours terminés · Niveau 21 » **et** « Aucun cours en cours pour l'instant ». Les parcours affichent 205/205 sans un mot. Le bilan ne dit rien. |

**Vérifié et NON défectueux, ne pas y toucher** : le certificat fonctionne (le sélecteur se remplit,
77 options quand tout est fini, le certificat se rend, le bouton d'impression apparaît). Seul son
**texte d'introduction** est figé.

---

## Règles permanentes

- **Un point à la fois**, mené jusqu'à la mesure. Le compte rendu cite ce que le site disait avant et ce qu'il dit après, aux trois états.
- **Vérifier avant de corriger** : reproduis la mesure. Si un point est déjà réglé, coche-le en le signalant.
- **Outils** : `node tools/verif.js --rapide` doit rester vert ; `node tools/verif-rendu.js` dès que tu touches à du CSS.
- **Un commit par point**, avec la mesure dans le message.
- **Contrainte fondatrice** : 100 % `file://`, aucun serveur, aucun module ES, aucun build.
- **⚠️ ORDRE DES FEUILLES CSS** : `variables` → `base` → `layout` → `components` → `pages`. Une règle de même spécificité placée dans un fichier antérieur est **écrasée**.
- **⚠️ `.tag` et `.module` percutent les jetons Prism** : toute classe portant un nom de jeton doit exclure `.token`.
- **⚠️ JAMAIS de `&nbsp;` dans un bloc `<script type="application/json">`**.
- **INTERDIT** : réintroduire une URL vers `cdnjs.cloudflare.com`, `fonts.googleapis.com` ou `fonts.gstatic.com`.
- Contenu et commentaires **en français, accents corrects**.

---

## ⚠️ LE TON JUSTE

Ce chantier écrit des messages que l'apprenant va lire à des moments qui comptent. Deux écueils
symétriques, aussi mauvais l'un que l'autre :

- **La froideur** : « 1362/1362 » sans un mot est ce qu'on a aujourd'hui.
- **L'excès** : confettis, superlatifs, « BRAVO CHAMPION !!! ». Le site s'adresse à des gens qui
  apprennent à programmer, pas à des enfants.

Le ton du site est **sobre, précis et respectueux** — regarde n'importe quelle leçon. Un message de
fin réussi **constate un fait et propose une suite** : ce qui a été accompli, en chiffres, et ce
qu'on peut en faire maintenant. Pas d'emphase, pas de familiarité forcée.

---

## PHASE A — Les trois moments du parcours

- [x] **A1 · Le bandeau « Reprendre » ment à l'état vierge.** — FAIT (mesuré par sonde CDP `tools/sonde-parcours.js`, 4 états). **Correction de la mesure du plan** : à l'état *strictement* vierge (ni `syntaxe-progress` ni `syntaxe-last`) le bandeau était déjà **masqué** (`hidden`, `visible=false`) — le « bouton sans destination » ne se reproduit pas. Le vrai défaut est à l'état **visite** : `recordLast()` (`lecon.js:1275`) pose `syntaxe-last` dès qu'on *ouvre* une leçon, donc avec 0 leçon validée le bandeau affichait « **Reprends où tu t'es arrêté — 0 / 47 leçons / Reprendre** » (inviter à reprendre ce qui n'a jamais commencé). **Fait** : `js/home.js` restructuré en 3 étapes avec un `mode` — l'étape 1 (dernière leçon) n'est retenue que si le cours est réellement en cours (`done>0 && done<total`) ; nouvelle étape 3 « invitation » quand une leçon a été ouverte sans rien valider. Markup : `data-resume-kicker` + `<span data-resume-cta>` ajoutés dans `index.html`. **Après (sonde)** : vierge → masqué ; visite → « **Reprends ta lecture** / [cours] / **Continuer** » (plus de faux compteur) ; en cours 32/65 → « Reprends où tu t'es arrêté · 32 / 65 leçons / Reprendre » (inchangé) ; tout terminé → n'invite plus à « reprendre Zig », masqué (l'état d'achèvement viendra en A4). Vérif : `verif.js --rapide` vert (source/données/contenu 0), `verif-rendu.js index.html` 0 erreur / 0 avertissement.

- [x] **A2 · Le site ne reconnaît pas la fin d'un cours.** — FAIT (mesuré à l'état « html 100 % »). **Correction de la mesure du plan** : un état de fin de cours existe déjà. Page cours (`cours.js` `renderCompletionBadge`) → badge « **Cours terminé** » / « Cours maîtrisé » + lien certificat, et `renderProjetLink` liste déjà « Projet à réaliser ». Leçon (`lecon.js` `paintCert`, dès `countDone===flat.length`, sur n'importe quelle leçon) → « **🎓 Tu as terminé ce cours ! Génère ton certificat de réussite.** ». Donc « ce qui est terminé » + « certificat » étaient présents des deux côtés ; **seule manquait la SUITE sur la leçon** (le prev/next y affiche juste « Fin du cours » désactivé). **Fait** : enrichi `paintCert` avec le lien vers le projet — réutilise le pattern de `renderProjetLink` (`../projets.html#course=<id>`, couverture 100 % vérifiée) et `courseId` déjà disponible. **Après (sonde)** : leçon à 100 % → « 🎓 Tu as terminé ce cours ! Génère ton certificat de réussite, **ou passe à la pratique avec le projet du cours.** » ; page cours inchangée (terminé + certificat + projet déjà là). CSS non touché (encart `.lesson-cert` et style `.lesson-cert a` existants). Vérif : `node --check js/lecon.js` OK ; `verif.js --rapide` vert.

- [x] **A3 · Le site ne reconnaît pas la fin d'un parcours.** — FAIT (mesuré à l'état tout). **Avant** : `parcours.html` affichait « PROGRESSION DU PARCOURS / **205 / 205** » et chaque cours « 47 / 47 · terminé ✓ », mais le parcours à 100 % ne disait rien. **Fait** : `parcours.js` `render()` calcule `nCourses` et, quand `tDone === tTotal`, ajoute un encart `.track-done` (nouveau CSS dans `pages.css`, même trio vert `--ok`/`--ok-bg` que `.lesson-cert`/`.course-done`, aligné en flex pour la coche). Suite à l'échelle du parcours = un **projet fil rouge** (un projet qui enchaîne plusieurs cours, exactement la maille « parcours »), lien `fils-rouges.html` (hub, couvre tous les thèmes ; les `tracks` n'ont pas de fil rouge nommé → mapping évité). **Après (sonde)** : les 11 parcours affichent « **Parcours terminé : X cours, Y leçons. Passe à la pratique avec un projet fil rouge.** » à l'état tout (ex. web-frontend 5 cours / 205 leçons), et **rien** à l'état en cours. Vérif : `node --check js/parcours.js` OK ; `verif.js --rapide` vert ; `verif-rendu.js parcours.html` 0/0 ; sonde à **320 px** état tout → **débordement aucun** (encart `.track-done` visible) ; contraste garanti (couple de couleurs déjà audité).

- [x] **A4 · L'état « tout terminé » n'existe pas.** — FAIT sur les 3 pages (mesuré à l'état tout ; nombres calculés dynamiquement, jamais codés en dur). Définition partagée : `totalLessons > 0 && doneLessons === totalLessons` (aligné sur le « X / X » affiché). **Accueil** (`home.js`) : le bandeau, masqué depuis A1 à cet état, devient « **Parcours terminé / Tu as terminé les 76 cours du site / 1362 leçons / Voir mon bilan** » (→ `pages/bilan.html`) — plus de « Reprends… Zig 18/18 ». **Progression** (`progression.js` + `.html`) : le `<h1>` « Reprends là où tu t'es arrêté » devient « **Tu as tout parcouru** » et l'accroche perd « le bouton pour repartir aussitôt » (data-attr `data-dash-hero-title/lead`) ; la zone reprendre affiche « **Tu as terminé l'intégralité du site — 76 cours, 1362 leçons. Entretiens tes acquis avec la révision, ou construis avec un projet fil rouge.** » (au lieu de « Reprendre : Zig ») ; la liste « Cours en cours » vide dit « **Tous les cours sont terminés — il n'y en a plus en cours.** » (au lieu de « Aucun cours en cours pour l'instant »). **Bilan** (`bilan.js` + `.css` `.bilan-complete`) : pendant du message vierge → « **Parcours complet : les 76 cours du site sont terminés — 1362 leçons.** » en tête du bulletin. **Non-régression** (sonde) : états en cours / visite / vierge inchangés partout ; à l'état vierge le bilan garde « Aucun cours commencé… c'est le moment de te lancer ! ». Vérif : `node --check` (home/progression/bilan) OK ; `verif.js --rapide` vert ; `verif-rendu.js` sur les 3 pages **0/0** ; débordement à **320 px** état tout = **aucun** sur les 3 ; contrastes garantis (réutilisation `.dash-empty` et trio `--ok`/`--ok-bg` déjà audités).

---

## PHASE B — Ce que le site raconte de la progression

- [x] **B1 · Le texte du certificat est figé.** — FAIT (mesuré aux états vierge / fini-1cours / presque / tout). **Avant** : le `<p class="hero__lead">` statique « Termine un cours (toutes ses leçons) pour débloquer son certificat. Choisis un cours ci-dessous… » était identique aux 3 états, même avec 76 certificats débloqués. **Fait** : `certificat.js` `updateLead(finished)` (appelée dans `init`, **mécanisme select/show/print inchangé**) réécrit le lead selon le nombre de cours certifiables (`total > 0`, = 76) et `finished.length` ; ancre `data-cert-lead` ajoutée au HTML. **Après (sonde)** : 0 → « Termine un cours (toutes ses leçons) pour débloquer son certificat. » ; 1 → « **1 certificat débloqué sur 76.** Choisis un cours ci-dessous… » ; 74 → « **74 certificats débloqués sur 76. Il te reste Assembleur x86-64 … et Zig ….** » (les manquants nommés seulement si ≤ 3, sinon liste interminable) ; 76 → « **Tes 76 certificats sont débloqués, un par cours terminé.** Choisis-en un ci-dessous… ». Vérif : `node --check js/certificat.js` OK ; `verif.js --rapide` vert ; débordement à **320 px** (lead le plus long) = **aucun** ; CSS non touché.

- [x] **B2 · La page Progression se contredit encore.** — FAIT (mesuré aux 3 états). La contradiction citée (« 76 cours terminés » vs « Aucun cours en cours pour l'instant ») était **déjà levée par A4** (`dash-started` vide → « Tous les cours sont terminés — il n'y en a plus en cours »). La mesure des 3 situations a révélé le dernier point : à l'état **vierge**, le `<h1>` « Reprends là où tu t'es arrêté » et l'accroche « le bouton pour repartir aussitôt » **contredisaient** le corps « Tu n'as pas encore commencé de cours ». **Fait** : `progression.js` réécrit `data-dash-hero-title/lead` selon 3 cas — vierge → « **Commence ton apprentissage** » + « Ta progression s'enregistrera… Ouvre un cours : tes leçons terminées et tes acquis s'afficheront ici. » ; en cours → **HTML par défaut conservé** (« Reprends là où tu t'es arrêté ») ; tout fini → « Tu as tout parcouru » (A4). **Après (sonde)** : vierge cohérent (titre invite / corps explique), en cours inchangé, tout fini cohérent — **aucun message ne se contredit** sur les 3 états. Vérif : `node --check js/progression.js` OK ; `verif.js --rapide` vert ; débordement à **320 px** état vierge = **aucun** ; CSS non touché.

- [x] **B3 · Les paliers ne sont annoncés nulle part.** — FAIT. **Vérification de l'existant** (pour ne pas dupliquer) : le site a déjà un badge XP permanent dans l'en-tête (`main.js` `initXP` → « Niv. N » + barre), la page Progression (niveau, succès, objectif quotidien) et un système de toast accessible (`window.SyntaxeToast`, `role=status`). **Ce qui manquait** : aucun signal AU MOMENT où un palier est franchi — le badge affiche le niveau courant en continu, sans jamais marquer la montée. **Ajouté** : `main.js` `signalerMonteeNiveau(lv)`, appelée dans `initXP`, mémorise le dernier niveau annoncé (`syntaxe-xp-level`) et, s'il a augmenté, l'annonce **une seule fois** via le toast en place — « **Niveau N atteint — [titre].** » (sobre, factuel). **Choix de conception** : le check est dans `initXP`, donc badge et toast sont rendus au **même chargement** → toujours cohérents (jamais « Niv. 4 » sous « Niveau 5 atteint ») ; premier passage **silencieux** (pas d'historique → on ne réannonce pas un niveau déjà acquis) ; garde `window.SITE_DATA` (l'XP n'est fiable qu'avec `data.js`, sinon clés orphelines) ; logique **centralisée**, zéro duplication. **Après (sonde, toasts relevés dans le DOM)** : montée (mémorisé 3, courant 4) → « **Niveau 4 atteint — Apprenti.** » ; mémorisé ≥ courant → **aucun** toast ; premier passage → **aucun** toast (mémorise) ; vierge (xp 0) → **aucun** toast. Vérif : `node --check js/main.js` OK ; `verif.js --rapide` vert ; CSS non touché (`.toast` déjà en place et audité).

---

## PHASE C — Trancher la question de l'anglais

- [x] **C1 · Le bouton EN est un mensonge, et il nuit.** — FAIT, **option (b) retenue : bouton retiré entièrement**. **Mesure** (grep + sonde) : 1782 pages HTML ; **1 seule** (`index.html`) porte des `data-i18n` (8 éléments) ; **1505** portent le bouton (`.header-actions`). Effet réel sur `lang` : cliquer EN posait `lang="en"` **uniquement** sur `index.html` (et même là, seuls 8 éléments traduits — cartes et sections restaient FR) ; sur les 1504 autres, `lang` restait **`"fr"`** → **l'échec WCAG 3.1.1 décrit par le plan était déjà corrigé** (garde `contentTranslated` dans `applyI18n`). Le fond reste vrai : le bouton promettait un bilinguisme inexistant (≈13 libellés de nav traduits sur un contenu 100 % français). **Justification (b) vs (a)** : traduire les 1362 leçons est explicitement hors sujet ; (a) laisserait un bouton incohérent sur la seule `index.html`, elle-même massivement française ; (b) assume l'identité francophone du site — honnête, sobre, cohérent avec le ton V9. **Fait** : `initI18n` ne crée plus le bouton et force `applyI18n("fr")` (ignore une préférence « en » persistée) ; CSS `.lang-toggle` retiré ; fondation i18n (`applyI18n`, tables, garde WCAG) **conservée dormante** pour une traduction future. **Après (sonde)** : sur index / leçon / catalogue, même avec `syntaxe-lang=en` forcé → **bouton absent, `lang="fr"`, nav FR (« Accueil »)**. Vérif : `node --check js/main.js` OK ; `verif.js --rapide` vert ; `verif-rendu.js` 4 pages **0/0** (en-tête sans bouton) ; **0 requête réseau** (aucun CDN réintroduit).

---

## PHASE D — Contrôle

- [x] **D1 · Les trois états, revérifiés.** — FAIT (sonde, 6 pages × 3 états). **Aucun message ne se contredit.** Synthèse :
  | Page | Vierge | En cours | Tout terminé |
  |---|---|---|---|
  | Accueil | bandeau **masqué** | « Reprends où tu t'es arrêté · JavaScript 32/65 · Reprendre » | « **Parcours terminé** · Tu as terminé les 76 cours · Voir mon bilan » |
  | Progression | « **Commence ton apprentissage** » + « Tu n'as pas encore commencé » | « Reprends là où tu t'es arrêté · Reprendre : JavaScript » | « **Tu as tout parcouru** · intégralité du site 76/1362 · plus en cours » |
  | Parcours | intro seule (étapes 0/N) | étapes partielles | « **Parcours terminé : X cours, Y leçons** » (×11) |
  | Bilan | « Aucun cours commencé — c'est le moment de te lancer ! » | stats | « **Parcours complet : les 76 cours … — 1362 leçons.** » |
  | Certificat | « Termine un cours … pour débloquer » | idem (0 terminé) | « **Tes 76 certificats sont débloqués** » |
  | Cours | « Commencer la leçon 1 » | (nav) | « **Cours terminé** » + certificat |
  
  `<html lang>` = **`fr`** et **bouton EN absent** sur les 6 pages aux 3 états. **Deux observations mineures, hors périmètre des cases V9** (libellés éditoriaux **constants**, donc non contradictoires, à décider un jour) : l'encart fil rouge de `cours.html` (« Reprends ton portfolio full-stack ici. ») et le CTA de bas d'accueil (« Le meilleur moment pour commencer, c'est maintenant. ») ne s'adaptent pas à l'état — même défaut d'esprit qu'A1 mais côté **fils rouges**, non listé dans ce chantier ; corriger proprement suppose d'analyser `fil-rouge.js`.

- [x] **D2 · Non-régression.** — FAIT. `node tools/verif.js` **complet, les 4 vérificateurs verts** : source (0), données (0 erreur d'invariant), contenu (0 maigre / 0 redondance), **rendu 0/0** (débordement / contraste / focus / aria / console / réseau ; Chrome, 106 s). **`&nbsp;` en bloc JSON** : `0` bloc `type="application/json"` dans les HTML touchés (index / progression / certificat) → aucun risque ; les `&nbsp;` présents y sont **préexistants** et hors JSON. **Compteurs** : aucun `76` / `1362` / `205` codé en dur dans le code (seule occurrence = un commentaire de `certificat.js`) — tous calculés dynamiquement (`finished.length`, `totalLessons`, `doneLessons`, `tTotal`, `nCourses`) et confirmés exacts par la sonde (76 cours, 1362 leçons, 205/205, etc.).

---

## Fin de chantier

Quand toutes les cases sont cochées, le wrapper déclenche la **passe de sécurité** : vérification
globale, rapport dans `VERIF-FINALE.md` avec un verdict en première ligne, puis extinction automatique
si le verdict est vert. ⚠️ Depuis le 2026-08-12, le verdict n'est retenu que si le rapport a été
**écrit pendant cette passe** — un rapport périmé vaut échec.
