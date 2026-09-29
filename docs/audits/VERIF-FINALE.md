VERDICT: VERT

# Passe de sécurité de fin de chantier — 2026-09-03

Site **Syntaxe** (`d:\test-claude`). Contrôle de bout en bout, non interactif, **sans ajout de
contenu**. Réveil automatique (tâche planifiée), chantier V15 détecté terminé (32/32).

**Vérité terrain mesurée** (`js/data.js` chargée dans un contexte `vm`, aucune soustraction) :
**90 cours · 1 540 leçons · 82 langages · 25 parcours · 19 fils rouges**. Trois voies
indépendantes concordent : somme des `courses[].lessons` = 1 540, somme des leçons de
`content[*].modules` = 1 540, fichiers `lecon-*.html` sur le disque hors redirections
(1 629 − 89) = 1 540.

> Le brief de réveil citait « 1 425 leçons / 139 pages » : chiffres périmés, pas un écart réel.
> La mesure du jour donne 1 540 leçons et 166 pages de rendu.

**Ce réveil n'a pas été blanc** : 12 constats ont été trouvés, 11 confirmés par un agent
adversarial chargé de les démolir, 1 réfuté, plus **1 défaut découvert en propre** pendant les
corrections (l'étude « recherche » citait un extrait du fichier que je venais de corriger).
**Tout ce qui a été confirmé a été corrigé.**

---

## 0) Les trois outils du projet — tous en code 0

| Outil | Portée mesurée | Résultat |
|---|---|---|
| `node tools/verif-html.js` | **1 629** fichiers de leçon (balise créée par erreur dans un bloc de code) | **0 grave / 0 attention** — exit 0 |
| `node tools/verif-donnees.js` | **25** invariants (courses/content/durations, liens, index, doublons de QCM) | **0 erreur**, 2 avertissements non bloquants — exit 0 |
| `node tools/verif-rendu.js --tout --lecons` | **166** pages × largeur × thème = **996 mesures** (débordement, contraste, focus, aria, console, réseau) | **0 erreur / 0 avertissement** — exit 0 |

`verif-html` n'a pas été cru sur parole : une faute injectée (`<b>` ouvert dans un `<pre>` d'une
copie de leçon) lui fait bien rendre `element-dans-code ×2`. Le fichier témoin a été supprimé
aussitôt après.

> **Incident non reproduit.** Le tout premier lancement de `verif-rendu` s'est arrêté à
> 126/166 en code 1 sans message d'erreur (Chrome). Les deux lancements suivants complets sont
> allés au bout en code 0. À surveiller si cela se reproduit ; rien à corriger aujourd'hui.

Les 2 avertissements de `verif-donnees` sont **antérieurs à ce réveil et non bloquants** (l'outil
sort en 0) : `[I17]` deux QCM de `zig` (lecon-06#2 ↔ lecon-14#1) partagent 0,33 d'énoncé et de
réponse — deux faces d'une même notion, pas un doublon ; `[I25]` le cours `doc` n'a aucun encadré
« Piège fréquent » (trou dans l'index des pièges, pas une erreur de données).

---

## 1) Les neuf contrôles hors outils — chiffre par chiffre

Mesurés en parallèle par 8 agents (un par dimension), puis **chaque constat remis à un second
agent chargé de le démolir**. Un constat non reproduit n'entre pas dans ce rapport.

| # | Contrôle | Mesure | Verdict |
|---|---|---|---|
| a | **Syntaxe JS** | 97 fichiers de `js/` passés **un par un** à `node --check` → 97 OK / 0 échec (harnais prouvé par un témoin cassé) | ✅ |
| b | **JSON embarqué** | 1 540 `data-quiz` + 1 540 `data-exos` + 99 `data-quiz-bilan` = **3 179 blocs** à `JSON.parse` → 0 échec, 0 bloc non-tableau, 0 `<script>` non fermé (2 fautes injectées, 2 vues) | ✅ |
| c | **Encodage** | 2 551 fichiers `.html/.js/.css/.json/.webmanifest` → **0 BOM** ; 22 occurrences de mojibake, **22 pédagogiques** (cours sur les encodages) et 0 accidentelle ; 1 802 pages HTML, 0 sans `<meta charset>` ; 1 seul U+00AD du dépôt → corrigé (voir §2) | ✅ |
| d | **Liens** | 1 630 références de `data.js` (1 540 leçons + 90 `cours.html`) → 0 manquante ; **37 362** liens relatifs `href`/`src` résolus au fichier sur 1 723 pages → **0 cassé** ; 0 vraie leçon orpheline (les 89 non référencées sont les redirections) ; harnais prouvé (2 liens cassés injectés, 2 vus) | ✅ |
| e | **Index de recherche** | **1 614 entrées** = 1 540 leçons + 74 pages transverses ; 0 doublon, 0 entrée vers un dossier `-avance`, 0 entrée vers un fichier absent, 0 leçon absente ; `search-lite.js` expose exactement les mêmes 1 614 documents. **Régénéré ce réveil** (voir §2) | ✅ |
| f | **Durées** | 90 cours, 90 clés de `content`, 90 clés de `lessonDurations` — ensembles **strictement identiques** ; comparaison faite sur les **noms de fichiers**, pas seulement sur les comptes : 0 écart sur 90 cours ; piège vérifié explicitement (`javascript` ≠ dossier `js`, 65 leçons / 65 durées, aucune clé `"js"`) ; somme 62 993 min | ✅ |
| g | **Niveaux** | 68 modules sur les 4 cours fusionnés, **0 sans `level`**, les 3 valeurs présentes partout (html 3/5/8, css 3/5/7, javascript 5/8/7, python 3/6/8), **ordre croissant strict, 0 inversion** ; **0 identifiant de cours en `-avance`** dans les 27 fichiers ciblés (la seule occurrence, `front-avance`, est un identifiant de **parcours**) | ✅ |
| h | **Redirections** | **93 pages** (89 leçons + 4 `cours.html`) × 3 références (meta refresh + canonical + lien de secours) = **279 cibles**, **0 inexistante**, 0 incohérence avec la table `COURS_FUSIONNES` de `main.js` ; couverture exacte (html 26→47, css 26→47, javascript 43→65, python 29→50, sans trou) ; **10 redirections rejouées dans un vrai Chrome** en `file://` atterrissent sur la bonne leçon | ✅ |
| i | **Compteurs affichés** | 2 401 fichiers balayés, 381 occurrences « nombre + cours/leçons/parcours » ; **11 nombres en dur divergeaient** → 10 corrigés, 1 réfuté (voir §3) ; recontrôle ciblé sur les 75 pages transverses : **0 écart réel restant** | ✅ |

---

## 2) Corrections appliquées (12 défauts, 21 fichiers)

Toutes ont été faites **à la cause**, pas au symptôme : les pages qui se mesurent elles-mêmes ont
été **régénérées par leur propre assembleur**, pas retouchées à la main.

**Compteurs du site écrits en dur** (7)

| Où | Avant | Après |
|---|---|---|
| `pages/a-propos.html` « Le catalogue en chiffres » | 86 cours / 1500 leçons / 77 langages | **90 / 1540 / 82** |
| `index.html` bandeau d'accueil | 89 cours / 81 langages (la même page disait 90 et 82) | **90 / 82** |
| `index.html` section fils rouges | « Dix-huit fils rouges » | **« Dix-neuf »** (19 pages, 19 fichiers de données, 19 entrées `FILS_ROUGES`) |
| `pages/recherche.html` (+ en-tête `js/recherche.js`) | « les 1523 leçons » | **1540** |
| `js/main.js` palette Ctrl+K | « 1540 leçons et 64 pages » | **74 pages** (corpus réel de `search-lite.js`) |
| `pages/antiseches.html` méta (+ commentaire, `js/cours.js`) | « les antisèches des 88 cours » | **90** (1 577 fiches sur 90 cours) |
| `pages/pieges.html` méta (+ en-tête `js/pieges.js`) | 1 893 pièges / 1 057 leçons / 65 cours | **1 908 / 1 070 / 89** |

**Pages qui se mesurent elles-mêmes** (3, régénérées par leurs outils)

- `pages/etude-moteur-exos.html` : l'assembleur **refusait de publier** (garde-fou : `js/lecon.js`
  fait 2 019 lignes, l'étude en annonçait 1 899). Garde-fou mis à jour dans
  `tools/etudes/moteur-exos/assembler.js`, **8 extraits relus et revalidés**, page réassemblée :
  1 899→2 019 lignes, 48→49 fonctions, 4 608→**4 659** exercices, 1 523→**1 540** leçons.
- `pages/etude-inconnu.html` : réassemblée — 12 919→**13 174** blocs, 10 364→**10 610** blocs
  substantiels, 1 523→**1 540** leçons. Les 9 contrôles internes de l'assembleur repassent.
- `pages/etude-recherche.html` : **défaut trouvé en propre**, absent des 12 constats. La page cite
  l'en-tête de `js/recherche.js` — que je venais de corriger — et ses propres mesures étaient
  périmées (1 595→**1 614** documents, 44 137→**45 958** mots, 905 469→**928 599** couples).
  Réassemblée.
- `pages/etudes.html` (hub) : sa carte annonçait « 1899 lignes » ; `tools/etudes/hub.js` mis à
  jour puis hub régénéré (son garde-fou vérifie que chaque chiffre mis en avant existe bien dans
  la page correspondante). Les 3 autres études (euclide, journal, réécriture) se régénèrent
  **à l'identique** : elles n'étaient pas périmées.

**Contenu** (2)

- `pages/data-eng/lecon-05.html` : un **U+00AD** (trait d'union conditionnel) coupait le mot
  « recharge » en plein texte français. Seul U+00AD du dépôt, supprimé.
- 3 indices d'exercice affichaient des entités HTML brutes parce que `js/lecon.js:1343` les pose
  par `textContent` : `pages/a11y/lecon-08.html` (`&lt;______&gt;` → `<______>`),
  `pages/a11y/lecon-10.html` (idem avec `kind="captions"`), `pages/clojure/lecon-17.html`
  (`-&gt;&gt;` → `->>`, sans toucher à la liste `accept` où la forme échappée est une réponse
  tolérée).

**Index dérivés régénérés** (`node tools/build-index.js --write --fresh --only=search,searchlite`)

`search-index.js` et `search-lite.js` contenaient encore l'ancien texte de `recherche.html`
(« 1523 leçons »). **Angle mort mesuré** : `build-index --strict` — donc l'invariant `[I18]` de
`verif-donnees` — répondait « aucune entrée périmée » alors que l'extrait d'une **page
transverse** l'était ; le garde-fou ne surveille que les leçons. Après régénération : 1 614
documents, 45 958 mots, 0 extrait périmé, et deux régénérations d'affilée donnent des fichiers
**identiques au bit près** (`md5sum`).

> **Point de méthode à retenir.** Corriger `recherche.js` change l'index, qui change l'étude qui
> mesure l'index, qui change… l'index. La boucle a été **itérée jusqu'au point fixe** (2 tours) :
> l'étude cite 45 958, l'index en contient 45 958, et le tour suivant ne réécrit plus rien. Une
> correction ponctuelle sans cette itération aurait laissé le site incohérent d'un cran.

---

## 3) Le constat réfuté (non corrigé, à dessein)

`js/main.js:235-237` — le dictionnaire **anglais** fige les mêmes compteurs faux
(`89 courses`, `81 languages`). Le réfuteur a démontré que la branche est **morte, pas
dormante** : `applyI18n` n'a qu'un seul appel, `applyI18n("fr")` en dur, `getLang()` n'est appelé
nulle part et le bouton EN a été retiré. Ces chaînes ne sont affichées par aucun chemin de code.
Elles n'ont donc **pas** été modifiées — les toucher aurait été traiter un symptôme dans du code
inatteignable.

---

## 4) Ce qui reste ouvert

Rien de bloquant. Trois points, tous connus et volontairement non traités par un réveil de
contrôle :

1. **`[I17]`** — QCM `zig` lecon-06#2 ↔ lecon-14#1 (0,33 de similarité) : demande un arbitrage
   éditorial, pas une correction mécanique.
2. **`[I25]`** — le cours `doc` n'a aucun encadré « Piège fréquent ». Le combler serait **écrire
   du contenu**, ce que ce réveil s'interdit.
3. **Angle mort d'outillage** — `build-index --strict` (et donc `verif-donnees [I18]`) ne détecte
   pas la péremption des **74 pages transverses** de l'index : il n'a rien vu du « 1523 » périmé
   trouvé ici à la main. Un vérificateur qui ne couvre qu'une partie de son corpus donne
   l'illusion de protéger l'autre. Correction d'outillage à faire dans un chantier, pas dans une
   passe de contrôle.

---

## 5) Fichiers modifiés (21)

```
index.html
js/cours.js  js/main.js  js/pieges.js  js/recherche.js
js/search-index.js  js/search-lite.js
pages/a-propos.html  pages/antiseches.html  pages/pieges.html  pages/recherche.html
pages/etudes.html  pages/etude-inconnu.html  pages/etude-moteur-exos.html  pages/etude-recherche.html
pages/a11y/lecon-08.html  pages/a11y/lecon-10.html  pages/clojure/lecon-17.html
pages/data-eng/lecon-05.html
tools/etudes/hub.js  tools/etudes/moteur-exos/assembler.js
```

Aucune leçon ni aucun cours n'a été ajouté. Après corrections, les trois outils du projet sortent
tous en **code 0**.
