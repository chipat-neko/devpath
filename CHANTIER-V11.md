# Chantier V11 — corriger les 73 points de l'audit V10

Plan de travail de l'autonomie. **Source de vérité : ce fichier.** Chaque réveil lit ce plan,
prend la **première case non cochée**, la traite entièrement, la coche avec un compte rendu chiffré,
puis passe à la suivante. Le chantier est fini quand il ne reste aucune case `- [ ]`.

**Origine** : l'audit indépendant du 2026-08-13 (`AUDIT-V10-2026-08-13.md`, 11 agents) sur les 7 cours
neufs du chantier V10. **61 constats, 56 confirmés, 1 seul réfuté, 13 problèmes rattrapés en plus.**

---

## ⚠️ LA CAUSE RACINE, ET CE QU'ELLE IMPOSE

Les quatre vérificateurs du site étaient **verts** pendant tout le chantier V10. Aucun n'a vu ces
erreurs, parce qu'aucun ne peut les voir : ils contrôlent la forme, pas la **vérité**.

Le diagnostic de l'audit est sans ambiguïté : **le raisonnement est juste, l'exécution numérique ne
l'est pas.** La doctrine statistique est exacte, la normalisation est solide, `loc`/`iloc` est bien
expliqué — mais les exemples chiffrés **n'ont jamais été exécutés**.

**CE QUE ÇA IMPOSE, ET QUI VAUT POUR CHAQUE POINT DE CE PLAN :**

> **Ne corrige jamais un calcul de tête. Fais-le tourner.**

- Un exemple **Python / pandas / statistics** → écris-le dans `scratchpad/` et **exécute-le** (python est disponible ; à défaut, refais le calcul pas à pas et montre les étapes dans le compte rendu).
- Une **requête SQL** → vérifie la syntaxe contre le dialecte annoncé, et les mots réservés.
- Un extrait **Swift / Kotlin / Dart** → relis-le en te demandant s'il compile ET s'il fait ce que le texte promet.
- Une **sortie annoncée en commentaire** (`# ~0.0000`, `# 95.0 107.0 132.0`) → recalcule-la.

Le compte rendu de chaque case doit citer **le chiffre obtenu par l'exécution**, pas une affirmation.

---

## Règles permanentes

- **Un point à la fois**, mené jusqu'à la vérification par le calcul.
- **Corriger PARTOUT** : ces erreurs sont propagées. Un chiffre faux apparaît dans la prose, dans un commentaire de code, dans un schéma SVG, dans un QCM **et dans son corrigé**. Balaye le cours entier avant de cocher.
- **Un commit par point ou par cours**, avec le chiffre corrigé dans le message.
- `node tools/verif.js --rapide` doit rester vert ; `node tools/verif-rendu.js` si tu touches à un SVG.
- **Contrainte fondatrice** : 100 % `file://`, aucun serveur, aucun module ES, aucun build.
- **⚠️ L'ÉCHAPPEMENT DANS LES BLOCS DE CODE** : tout `<` s'écrit `&lt;`, sans exception.
- **⚠️ JAMAIS de `&nbsp;` dans un bloc `<script type="application/json">`**.
- **INTERDIT** : réintroduire une URL vers `cdnjs.cloudflare.com`, `fonts.googleapis.com`, `fonts.gstatic.com`.
- **Si l'audit se trompe, dis-le.** Un vérificateur a déjà réfuté un constat. Si en refaisant le calcul tu trouves que la page avait raison, **ne corrige pas** : coche en expliquant, avec la mesure.

---

## PHASE A — Les trois erreurs graves

Un lecteur qui les rencontre apprend un fait faux. À traiter en premier, chacune isolément.

- [x] **A1 · `pandas/lecon-09` — un chiffre d'affaires arithmétiquement impossible.** La leçon affiche « Lyon 48,30 » alors que ses trois lignes lyonnaises valent 7,50 + 12,40 + 8,90 = **28,80**. Trois preuves internes le confirment : les parts de `transform` somment à 0,596 au lieu de 1 (Paris et Marseille font bien 1) ; la ventilation ville × catégorie exige 4 lignes lyonnaises quand `size()` en annonce 3 ; **les deux schémas SVG inventent encore deux autres jeux de chiffres** (40,80 et 19,50) pour retomber sur 48,30. La valeur est reprise **8 fois dans le corps et 3 fois dans les corrigés**. Corriger : Lyon = 28,80, moyenne 9,60, parts 0,260417 / 0,430556 / 0,309028, Papeterie n = 1 — **et redessiner les deux SVG**. C'est la démonstration centrale de `transform` : elle doit être juste de bout en bout.

  ✓ **Fait (2026-08-13), vérifié par exécution.** Calcul reproduit dans `scratchpad/a1_pandas.py` (groupby réécrit en Python pur — pandas indisponible sur Python 3.14). Résultats obtenus : Lyon **sum = 28,80**, **mean = 9,60**, count/size = 3 ; parts Lyon **0,260417 / 0,430556 / 0,309028** (somme de contrôle = **1,000000**) ; Lyon·Papeterie **ca = 7,50, n = 1** (une seule commande, C1001). Corrigé **partout** : les 4 tableaux du corps (sum, mean, `agg` liste, named agg), `agg` dict (montant 28,80 ; quantite 2,666667 inchangée, non concernée), les 2 ventilations ville×catégorie, `transform` head(6), `reset_index`, la prose (×2), et les corrigés des exercices 1/2/3. **Exercice 3** (piège du tri) : le `sort_values("part_ville", ascending=False).head()` fait **entrer C1006 (0,309028) et sortir C1001 (0,260417)** du top 5 — nouvel ordre C1003, C1002, C1005, C1004, C1006 (confirmé par le script). **3 SVG redessinés** : split-apply-combine (6 vraies lignes, plus de 40,80, résultat Lyon 28,80) ; agg/transform (3 lignes au lieu de 4, plus de 19,50, 28,80) ; grille ville×catégorie (case Lyon·Papeterie 27,00→7,50 + aria-label). Le DataFrame autonome `ex` (démo size vs count) **garde son 40,80 légitime** (non touché). Contrôles : `node tools/verif.js --rapide` **VERT** (source/données/contenu) ; `node tools/verif-rendu.js --pages=…/lecon-09.html` = **0 erreur / 0 avertissement** ; 0 URL interdite, pas de BOM, 19 `<svg>`/`</svg>` équilibrés. **Bonus** : corrigé un débordement horizontal **préexistant** (+309 px à 1280 px, présent aussi sur HEAD via `git stash`) dû à un `<code>` inline de 129 car. dans « Cas réel », scindé en fragments courts. ⚠️ **Repéré pour B2/C5** : incohérence entre `lecon-08` (C1002=8,90, C1003=24,00…) et `lecon-09` (C1002=17,80, C1003=6,00…) — le même `ventes.csv` porte des montants **différents** d'une leçon à l'autre ; à trancher dans un point pandas ultérieur (hors périmètre A1).

- [ ] **A2 · `stats/lecon-08` — la démonstration prouve l'inverse de ce qu'elle affirme.** La leçon conclut « hautement significatif (p minuscule) » avec `# ~0.0000`. Refait avec ses propres chiffres (n = 1 000 000, 8,00 % contre 8,05 %, p commun = 0,08025) : z = 1,3014 et **p = 0,1931** — non significatif à 5 %. L'erreur est figée **quatre fois** (l. 284, 296, 355, 363), dont dans l'énoncé **et** le corrigé d'un QCM. Deux issues au choix, à trancher et justifier : n = 10 000 000 (z = 4,12 ; p = 3,9e-05), ou garder n = 1 000 000 avec 8,00 % contre 8,20 % (z = 5,18 ; p = 2,2e-07). **Recalculer soi-même avant d'écrire.** Le propos de la leçon — « significatif n'est pas important » — reste juste et doit être préservé.

- [ ] **A3 · `stats/lecon-03` — les quartiles annoncés ne sont pas ceux que le code produit.** La leçon affiche `# 95.0 107.0 132.0` et un IQR de 37. `statistics.quantiles([88,92,95,101,104,110,118,132,640,910], n=4)` renvoie en réalité `[94.25, 107.0, 259.0]`, soit un **IQR de 164,75** : la démonstration de robustesse s'inverse, puisque l'IQR est gonflé par les extrêmes qu'il est censé ignorer. Propagé l. 154, 184, 187 (borne 1,5 × IQR), 328, 370. `method='inclusive'` donne `[96.5, 107.0, 128.5]` et un IQR de 32,0 — la seule voie qui sauve la démonstration sans changer l'échantillon. **Exécuter les deux variantes avant de choisir.**

---

## PHASE B — Les 28 points majeurs, cours par cours

Un lecteur qui applique ces exemples échoue. Une case = un cours = un commit.

- [ ] **B1 · `stats` (6 majeurs)** — après A2 et A3, reprendre le reste du cours : chaque chiffre, chaque sortie annoncée, chaque condition d'application de test.

- [ ] **B2 · `pandas` (4 majeurs)** — dont l'affirmation « Additionner, multiplier, **comparer** : dès qu'un NaN entre, il ressort » (`lecon-04:159`). Faux pour les comparaisons : `==`, `<`, `>`, `<=`, `>=` renvoient **False** et `!=` renvoie **True** (IEEE 754) — la leçon le démontre elle-même 13 lignes plus bas. C'est précisément pourquoi un filtre booléen exclut silencieusement les manquants : le dire.

- [ ] **B3 · `dataviz` (4 majeurs)** — dont « matplotlib **tronque par défaut** pour les barres, il faut forcer `set_ylim(0, …)` » (`lecon-09:194`, repris `lecon-14:218`). C'est l'inverse : `ax.bar` pose `sticky_edges.y = [0]`, donc l'autoscale inclut toujours zéro. L'axe tronqué vient d'un `set_ylim` explicite, d'un tableur ou d'une capture recadrée. **C'est pour les courbes** que le cadrage automatique ne montre pas zéro.

- [ ] **B4 · `data-eng` (4 majeurs)** — trois points lourds. (a) **`end` est un mot réservé SQL** (terminateur de `CASE … END`) et sert de nom de colonne dans **5 leçons**, posé dès `lecon-01:105` comme canon du fil rouge : `CREATE TABLE trajets (… end TIMESTAMP …)` échoue sur PostgreSQL et BigQuery. Renommer (`end_ts`, ou `fin` déjà utilisé côté silver), **ou** garder le nom dans le CSV et écrire `"end"` en SQL avec une note d'une ligne — c'est un excellent moment pédagogique sur les contrats de données. (b) `lecon-12:113-120` : une fonction de fenêtrage dans un `FILTER` — dépendance circulaire, refusée par PostgreSQL et DuckDB — et un mélange de dialectes (`FILTER` standard contre `DATE_DIFF` BigQuery). (c) `lecon-08:240-252` : la « clé déterministe » `cle_stable` n'est utilisée nulle part, la requête dédoublonne sur `trip_id` comme la leçon 3 — la technique annoncée ne démontre rien.

- [ ] **B5 · `mobile` (2 majeurs)** — (a) `lecon-10:172` : la charge JSON a six clés, la data class en déclare quatre, et l'instance `Json` par défaut de kotlinx.serialization refuse les clés inconnues → `SerializationException`. Ajouter `Json { ignoreUnknownKeys = true }` **et l'expliquer**, c'est la robustesse que la leçon prêche plus loin. (b) `lecon-05:262-268` : `navigationDestination` s'apparie **par type** ; le modèle déclare `UUID` là où la navigation passe un `Int`, donc aucune destination n'est enregistrée — le code compile et la tape ne fait rien. Le champ `lieu` n'existe pas non plus dans le modèle.

- [ ] **B6 · `bdd` (2 majeurs)** — reprendre les points confirmés par l'audit sur les index et les niveaux d'isolation.

- [ ] **B7 · `equipe` (1 majeur)** — `lecon-14:164, 165, 280` : la leçon impose un séparateur point-virgule (l. 159) puis affirme que « les noms avec une **virgule** cassent le CSV ». Avec `;`, une virgule est un caractère ordinaire — c'est le point-virgule qui casse. Le QCM enseigne la version fausse ; seul l'exercice 2 est juste. C'est le fil narratif de la leçon d'assemblage du cours.

- [ ] **B8 · Les 5 majeurs transverses** — points qui ne visent pas un cours mais l'intégration : composition des parcours, `related` croisés, chiffres écrits dans la prose. Voir le rapport.

---

## PHASE C — Les 42 points mineurs et cosmétiques

Regroupés par cours. Ils ne font échouer personne mais ternissent des cours neufs.

- [ ] **C1 · Transverse (16 points)** — la plus grosse poche : cohérence d'ensemble, chiffres en dur, liens croisés.
- [ ] **C2 · `mobile` (6)**
- [ ] **C3 · `dataviz` (5)**
- [ ] **C4 · `bdd` (4)**
- [ ] **C5 · `pandas` (3) et `stats` (3)**
- [ ] **C6 · `equipe` (3) et `data-eng` (2)**

---

## PHASE D — Empêcher que ça revienne

- [ ] **D1 · Les deux points incertains.** L'audit en a classé 2 comme relevant du choix pédagogique défendable plutôt que de l'erreur. Les trancher : corriger, ou écrire ici pourquoi la page a raison.

- [ ] **D2 · Contrôle final.** `node tools/verif.js` complet, les quatre vérificateurs verts. Puis **rejouer les calculs des trois erreurs graves** pour prouver qu'ils tombent désormais juste, en citant les valeurs obtenues.

---

## Fin de chantier

Quand toutes les cases sont cochées, le wrapper déclenche la **passe de sécurité** : vérification
globale, rapport dans `VERIF-FINALE.md` avec un verdict en première ligne, puis extinction automatique
si le verdict est vert. Le verdict n'est retenu que si le rapport a été **écrit pendant cette passe**.
