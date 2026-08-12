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

- [ ] **A1 · Le bandeau « Reprendre » ment à l'état vierge.** Sur l'accueil, quand rien n'a été commencé, le bandeau s'affiche quand même avec un bouton sans destination. Il doit soit disparaître, soit devenir une vraie invitation à commencer (proposer un premier cours ou un parcours). Vérifier `js/home.js` et la clé `syntaxe-last`.

- [ ] **A2 · Le site ne reconnaît pas la fin d'un cours.** Quand un cours passe à 100 %, rien ne le marque au moment où ça arrive — ni sur la dernière leçon, ni sur la page du cours. C'est le premier vrai palier d'un apprenant, et le plus fréquent (76 occasions). Ajouter un état de fin de cours **sobre** : ce qui vient d'être terminé, le certificat désormais disponible, et la suite logique (le cours suivant du parcours, ou le projet du cours).

- [ ] **A3 · Le site ne reconnaît pas la fin d'un parcours.** Les parcours affichent « 205/205 » sans un mot. Même traitement qu'en A2, à l'échelle du parcours.

- [ ] **A4 · L'état « tout terminé » n'existe pas.** À 76/76 cours, l'accueil invite à « reprendre » Zig et la page Progression dit « Aucun cours en cours pour l'instant ». C'est le seul moment du parcours où le site n'a rien à dire, et c'est le plus fort. Écrire cet état : sur l'accueil (le bandeau devient un état d'achèvement), sur Progression (remplacer le message d'état vide), sur le bilan. **Attention** : `bilan.html` a déjà un message pour l'état vierge (« Aucun cours commencé — c'est le moment de te lancer ! ») ; le pendant pour l'état plein manque.

---

## PHASE B — Ce que le site raconte de la progression

- [ ] **B1 · Le texte du certificat est figé.** « Termine un cours (toutes ses leçons) pour débloquer son certificat » s'affiche même quand 76 certificats sont débloqués. Le rendre conditionnel : combien sont disponibles, et lesquels manquent le cas échéant. **Ne pas toucher au mécanisme**, qui fonctionne — seulement au texte.

- [ ] **B2 · La page Progression se contredit encore.** « 76 cours terminés » et « Aucun cours en cours pour l'instant » coexistent. Reprendre les messages d'état de cette page pour qu'ils décrivent la situation réelle : rien commencé, en cours, tout fini.

- [ ] **B3 · Les paliers ne sont annoncés nulle part.** Le site calcule un niveau (« Niveau 21 »), des séries, un objectif quotidien — mais l'apprenant ne l'apprend qu'en visitant la page Progression. Vérifier ce qui existe déjà (`js/progression.js`, `js/main.js`) et **ne pas dupliquer** ; s'il manque un signal au moment où le palier est franchi, l'ajouter, discrètement.

---

## PHASE C — Trancher la question de l'anglais

- [ ] **C1 · Le bouton EN est un mensonge, et il nuit.** Il est injecté sur **1 501 pages** alors qu'**une seule** porte des `data-i18n` (`index.html`, 8 éléments). Pire : il pose `lang="en"` sur des pages entièrement françaises, donc un lecteur d'écran les prononce en anglais (échec WCAG 3.1.1). **Deux issues, choisir et justifier** : (a) ne montrer le bouton que sur les pages réellement traduites ; (b) le retirer entièrement. Traduire 1 362 leçons n'est pas à l'ordre du jour — ne pas s'y engager. Mesurer avant : combien de pages, combien de clés, quel effet réel sur `lang`.

---

## PHASE D — Contrôle

- [ ] **D1 · Les trois états, revérifiés.** Reprendre la mesure d'ouverture (vierge / en cours / tout terminé) sur les six pages clés et consigner ce que le site dit désormais à chacun. Aucun message ne doit se contredire.

- [ ] **D2 · Non-régression.** `node tools/verif.js` complet, les quatre vérificateurs verts. Vérifier en particulier qu'aucun texte ajouté n'a introduit de `&nbsp;` littéral dans un bloc JSON, et que les compteurs affichés restent exacts.

---

## Fin de chantier

Quand toutes les cases sont cochées, le wrapper déclenche la **passe de sécurité** : vérification
globale, rapport dans `VERIF-FINALE.md` avec un verdict en première ligne, puis extinction automatique
si le verdict est vert. ⚠️ Depuis le 2026-08-12, le verdict n'est retenu que si le rapport a été
**écrit pendant cette passe** — un rapport périmé vaut échec.
