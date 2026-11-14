# Rapport V18 — case B7, lot 4 : les cours `neurones` et `a11y` (copie `b7-neurones-a11y`, branche `v18/b7-neurones-a11y`)

Copie de travail `D:\test-claude-b7-neurones-a11y`, partie de `13eabe3`. Part traitée : les **27 « Cas réel »**
des cours `neurones` (12, un par leçon ; `lecon-12` est une **section** `<h2>`) et `a11y` (15, un par leçon).
Scripts et pièces dans `scratchpad/b7-neurones-a11y/` (ignoré par git) : `cas-neurones.js` et `cas-a11y.js`
(les 27 textes), `appliquer.js` (remplace le seul intérieur du `div.callout__body` — ou, pour une section,
de l'intertitre au `<h2>` suivant —, prouve que les octets hors de la zone sont identiques, refuse tout CR,
juge la règle), `contexte.js` (mots d'options de QCM présents seulement dans l'encadré, et mots d'options
absents de la page), `typo.js`, `arxiv.py`, et les PDF et pages ouverts.

**En une phrase** : `node tools/verif-contenu.js --cas-reel` passe de **12 hors de la règle à 0** pour
`neurones` et de **15 à 0** pour `a11y` ; sur les 27 cas trouvés, **0 était VRAI tel quel et conforme** :
les 12 de `neurones` étaient des récits anonymes bâtis sur les chiffres de la leçon (« une équipe… »),
9 de `a11y` des récits anonymes ou des illustrations générales, 3 racontaient un sujet gardé par un autre
cours (WebAIM Million deux fois, Robles contre Domino's), et plusieurs portaient un détail faux.
**25 remplacés** par un cas réel daté et sourcé sur la même notion, **2 corrigés sur leur sujet**
(`a11y/03` Nielsen Norman Group, `a11y/12` WCAG 2.0 critère 3.3.1), **0 gardé tel quel**, **0 « Scénario »**.

**Commits** : `b881f6c` (neurones, 12 cas), `15045f7` (a11y, 15 cas), puis ce rapport.

## Méthode

- Seul l'intérieur du `div.callout__body` change (types `note` et `warn` gardés, icônes et structure
  gardées). Les onze `<h2>Cas réel</h2>` qui enveloppent les encadrés de `neurones` (01 à 11) n'annoncent
  pas l'ancien récit : inchangés. La section `neurones/lecon-12` reçoit l'intertitre
  `Cas réel — la conférence OCR du recensement américain (1992)`.
- Forme : titre `Cas réel — sujet (année)`, dernier paragraphe `<p class="cas-reel__source">` daté et lié ;
  aucun lien dans le corps ; `&nbsp;` devant « : ; ? ! » et dans « » (`typo.js` : 0 faute hors des
  titres anglais cités tels quels).
- **Un sujet = un seul cours** : chaque sujet cherché dans `foyers.md`, dans tout `pages/` (texte et
  URL), dans la liste des titres de `doublons.js --titres`, et inscrit dans
  `scratchpad/v18-parallele/b7-reservations.txt` (aucun conflit). Écartés parce qu'un autre cours les
  garde : WebAIM Million (`html/lecon-13`), Robles contre Domino's (`html/lecon-32`), l'acte européen sur
  l'accessibilité (`html/lecon-47`), les sous-titres de Netflix et de Harvard (`html/lecon-06`, `-19`),
  `<dialog>` (`html/lecon-27`), le Design System de GOV.UK et sa validation (`css/lecon-18`,
  `js/lecon-33`), `prefers-reduced-motion` chez WebKit (`css/lecon-12`), Kaggle (`ml/lecon-06`).
  `doublons.js` : toujours **2** sources partagées entre cours (les deux légitimes déjà connues).
- **Écartés pour une autre raison** : Legendre et les moindres carrés (1805) et Cauchy et la descente de
  gradient (1847), d'abord écrits pour `neurones/04` et `05` — l'outil ne lit une année de titre qu'entre
  1950 et 2039 (`RE_ANNEE`) ; réservations annulées par une ligne « ABANDON ». Minsky et Papert lus à
  travers l'avant-propos de Bottou, le livre étant en accès restreint sur archive.org. La page MNIST de
  LeCun n'existe plus (`yann.lecun.com/exdb/mnist/` est un index vide) et le texte du PDF de LeCun 1998
  est illisible (police encodée) : remplacé par le rapport NIST d'origine. L'annonce d'ImageNet sur Baidu
  (2015) inaccessible (refus de connexion, Wayback limité) ; Huber 1964 (Project Euclid bloqué) ; la
  fiche du Mark I Perceptron au Smithsonian (403) ; l'épisode « Pocket Monster » (1997), sourcé par
  PubMed, abandonné pour `a11y/10` parce que le corps de la leçon le raconte déjà.

## Cas par cas — `neurones`

| Cas | État trouvé | Action | Nouveau titre | Sources ouvertes |
|---|---|---|---|---|
| `pages/neurones/lecon-01.html#1` | INVÉRIFIABLE — récit anonyme (alerte à points, règle en OU exclusif) | remplacé par : *Perceptrons*, de Minsky et Papert | Cas réel — *Perceptrons*, de Minsky et Papert (1969) | https://leon.bottou.org/publications/pdf/perceptrons-2017.pdf (avant-propos de Léon Bottou à la réédition MIT Press, 16/02/2017) |
| `pages/neurones/lecon-02.html#1` | INVÉRIFIABLE — récit anonyme (activation par défaut `identite`) | remplacé par : Leshno, Lin, Pinkus et Schocken, l'activation non polynomiale | Cas réel — Leshno, Lin, Pinkus et Schocken : l'activation ne doit pas être un polynôme (1992) | https://archive.nyu.edu/handle/2451/14329 et le PDF IS-92-13 (mars 1992) ; https://api.crossref.org/works/10.1016/S0893-6080(05)80131-5 (Neural Networks 6(6), 1993, p. 861-867) |
| `pages/neurones/lecon-03.html#1` | INVÉRIFIABLE — récit anonyme (fichier de poids envoyé à une autre équipe) | remplacé par : le format safetensors de Hugging Face et son audit | Cas réel — le format safetensors de Hugging Face (2023) | https://github.com/huggingface/safetensors (README, § Format) ; https://huggingface.co/blog/safetensors-security-audit (23/05/2023) |
| `pages/neurones/lecon-04.html#1` | INVÉRIFIABLE — récit anonyme (durées de livraison) | remplacé par : AlexNet, la log-probabilité qu'on maximise et les taux d'erreur qu'on publie | Cas réel — AlexNet : on règle une perte, on publie des taux d'erreur (2012) | https://papers.nips.cc/paper_files/paper/2012/file/c399862d3b9d6b76c8436e924a68c45b-Paper.pdf (§ 2, 3.5, 6) ; page du résumé (voir « doutes ») |
| `pages/neurones/lecon-05.html#1` | INVÉRIFIABLE — récit anonyme (perte qui monte) | remplacé par : Goyal et al. (Facebook), règle linéaire du taux et montée progressive | Cas réel — Facebook entraîne un réseau sur ImageNet en une heure (2017) | https://arxiv.org/abs/1706.02677 (PDF, § 2.1, 2.2, 5, tableau 1) |
| `pages/neurones/lecon-06.html#1` | INVÉRIFIABLE — récit anonyme (facteur d'activation oublié) | remplacé par : Rumelhart, Hinton et Williams dans *Nature* | Cas réel — Rumelhart, Hinton et Williams publient la rétropropagation (1986) | https://www.nature.com/articles/323533a0 (résumé ; reçu 01/05, accepté 31/07, numéro du 09/10/1986) |
| `pages/neurones/lecon-07.html#1` | INVÉRIFIABLE — récit anonyme (capteur, époque 397) | remplacé par : Zhang et al., des étiquettes tirées au hasard | Cas réel — des réseaux qui apprennent des étiquettes tirées au hasard (2017) | https://arxiv.org/abs/1611.03530 (PDF : § 1, 2.1, tableau 1, annexe A) |
| `pages/neurones/lecon-08.html#1` | INVÉRIFIABLE — récit anonyme (chiffre de test livré dans un contrat) | remplacé par : Krogh et Hertz, la pénalité sur les poids, NetTalk | Cas réel — Krogh et Hertz expliquent la pénalité sur les poids (1991) | https://papers.nips.cc/paper/1991/hash/8eefcfdf5990e441f0fb6f3fad709e21-Abstract.html et le PDF (§ 1, 6, 7) |
| `pages/neurones/lecon-09.html#1` | INVÉRIFIABLE — récit anonyme (dix couches sigmoïdes) | remplacé par : Glorot et Bengio, saturation des sigmoïdes | Cas réel — Glorot et Bengio, des réseaux profonds qui n'apprennent pas (2010) | https://proceedings.mlr.press/v9/glorot10a.html et le PDF (§ 2.3, 3.1, 4.2.1) |
| `pages/neurones/lecon-10.html#1` | INVÉRIFIABLE — récit anonyme (vignettes 28 × 28) | remplacé par : Azulay et Weiss, un pixel de décalage | Cas réel — Azulay et Weiss décalent les images d'un pixel (2019) | https://jmlr.org/papers/v20/19-519.html ; https://arxiv.org/abs/1805.12177 (PDF, § 1, 2, 3) |
| `pages/neurones/lecon-11.html#1` | INVÉRIFIABLE — récit anonyme (journaux et alerte) | remplacé par : *Attention Is All You Need* et l'encodage de position | Cas réel — *Attention Is All You Need*, le Transformer (2017) | https://arxiv.org/abs/1706.03762 (PDF, § 1, 3.5, 4, tableau 1) |
| `pages/neurones/lecon-12.html#1` (section) | INVÉRIFIABLE — mise en situation du classifieur de la leçon (verdict de B2 confirmé) | remplacé par : la première conférence OCR du recensement américain, SD3 contre TD1 | Cas réel — la conférence OCR du recensement américain (1992) | https://nvlpubs.nist.gov/nistpubs/Legacy/IR/nistir4912.pdf (NISTIR 4912, août 1992, § 2, 2.1, 2.3, 2.6) |

## Cas par cas — `a11y`

| Cas | État trouvé | Action | Nouveau titre | Sources ouvertes |
|---|---|---|---|---|
| `pages/a11y/lecon-01.html#1` | INEXACT et sujet gardé ailleurs — Robles contre Domino's (foyer `html/lecon-32`) ; « la Cour suprême a laissé la décision favorable : un site marchand doit être accessible au même titre qu'un magasin physique » généralise un arrêt d'appel (lien du site avec les restaurants physiques, conformité renvoyée en première instance) que la Cour suprême a refusé d'examiner — d'après le cas sourcé de `html/lecon-32`, non rouvert ici | remplacé par : la NFB contre Target (déplacé depuis `a11y/06`, sourcé à l'ordonnance) | Cas réel — la National Federation of the Blind contre Target (2006-2008) | https://www.govinfo.gov/content/pkg/USCOURTS-cand-3_06-cv-01802/pdf/USCOURTS-cand-3_06-cv-01802-0.pdf (ordonnance du 06/09/2006) ; https://dralegal.org/press/national-federation-of-the-blind-and-target-agree-to-class-action-settlement/ (27/08/2008) ; vérification : https://dralegal.org/wp-content/uploads/2012/09/settlementagreement_2.pdf |
| `pages/a11y/lecon-02.html#1` | INEXACT et sujet gardé ailleurs — WebAIM Million (foyer `html/lecon-13`) ; « la grande majorité » est juste (95,9 % en 2026), mais titres mal hiérarchisés et repères absents ne sont **pas** parmi les erreurs les plus fréquentes (sauts de niveau sur 41,8 % des pages) | remplacé par : WebAIM, Screen Reader User Survey #10 | Cas réel — WebAIM interroge les utilisateurs de lecteurs d'écran (2024) | https://webaim.org/projects/screenreadersurvey10/ ; vérification : https://webaim.org/projects/million/ |
| `pages/a11y/lecon-03.html#1` | INEXACT — produit nommé : l'article date du 11/05/2014 (pas « entre 2015 et 2018 ») ; « tests sans appel », « conclusion mesurée : plus d'erreurs, plus d'abandons » et « les lecteurs d'écran n'annoncent plus rien » absents de la source (elle dit : « tous ne lisent pas ») | corrigé : daté, ramené aux sept raisons et aux trois problèmes d'accessibilité de l'article | Cas réel — le Nielsen Norman Group contre les placeholders (2014) | https://www.nngroup.com/articles/form-design-placeholders/ |
| `pages/a11y/lecon-04.html#1` | VRAI sur le chiffre (pages avec ARIA : 59,1 erreurs contre 42 en 2026), INEXACT sur la cause (WebAIM écrit que cela ne prouve pas qu'ARIA cause les erreurs) ; sujet gardé par `html/lecon-13` | remplacé par : les quatre règles de « Using ARIA » (W3C) | Cas réel — les quatre règles de « Using ARIA », au W3C (2013-2026) | https://www.w3.org/TR/using-aria/ (Discontinued Draft du 24/02/2026) ; https://www.w3.org/standards/history/using-aria/ |
| `pages/a11y/lecon-05.html#1` | INVÉRIFIABLE — illustration générale (applications de bourse, « ~8 % des hommes », jeux vidéo) | remplacé par : les réglages de contraste de *The Last of Us Part II* | Cas réel — les réglages de contraste de *The Last of Us Part II* (2020) | https://blog.playstation.com/2020/06/09/the-last-of-us-part-ii-accessibility-features-detailed/ |
| `pages/a11y/lecon-06.html#1` | VRAI pour l'essentiel mais sans source, et les griefs de la plainte donnés pour des faits (Target n'a rien reconnu) ; l'acte européen est gardé par `html/lecon-47` | remplacé par : l'audit des sites publics britanniques par le GDS (Target déplacé en `a11y/01`) | Cas réel — l'audit des sites publics britanniques par le GDS (2022-2024) | https://www.gov.uk/government/publications/accessibility-monitoring-of-public-sector-websites-and-mobile-apps-from-2022-to-2024/accessibility-monitoring-of-public-sector-websites-and-mobile-apps-from-2022-to-2024 (17/12/2024) |
| `pages/a11y/lecon-07.html#1` | INVÉRIFIABLE — récit anonyme (« une boutique », bouton panier) | remplacé par : l'arbre d'accessibilité complet de Chrome DevTools | Cas réel — Chrome DevTools montre l'arbre d'accessibilité complet (2021) | https://developer.chrome.com/blog/full-accessibility-tree (et sa version `.md.txt` ; « Last updated 2021-12-13 ») |
| `pages/a11y/lecon-08.html#1` | INVÉRIFIABLE — récit anonyme (newsletter en fausse modale) | remplacé par : l'attribut `inert` (Safari 15.5, Firefox 112) | Cas réel — l'attribut inert arrive dans Safari et Firefox (2022-2023) | https://webkit.org/blog/12669/new-webkit-features-in-safari-15-5/ ; https://developer.mozilla.org/en-US/docs/Mozilla/Firefox/Releases/112 ; https://web.dev/articles/inert |
| `pages/a11y/lecon-09.html#1` | INVÉRIFIABLE — récit anonyme (billetterie, « 12 concerts trouvés ») | remplacé par : GOV.UK et la région live de sa recherche | Cas réel — GOV.UK fait annoncer le nombre de résultats de sa recherche (2014) | https://technology.blog.gov.uk/2014/08/14/improving-accessibility-on-gov-uk-search/ |
| `pages/a11y/lecon-10.html#1` | INVÉRIFIABLE — récit anonyme (site de voyage en parallaxe, « le taux de rebond a baissé ») | remplacé par : les sous-titres automatiques de YouTube | Cas réel — YouTube ajoute des sous-titres automatiques (2009) | https://googleblog.blogspot.com/2009/11/automatic-captions-in-youtube.html |
| `pages/a11y/lecon-11.html#1` | INVÉRIFIABLE — illustration générale (mode d'emploi d'`aria-sort`, juste techniquement) | remplacé par : Maguire contre le SOCOG, les tableaux de résultats des Jeux de Sydney | Cas réel — Maguire contre le comité des Jeux de Sydney (2000) | https://independentliving.org/docs5/sydney-olympics-blind-accessibility-decision.html (motifs du 24/08/2000, reproduits) ; https://www.w3.org/WAI/business-case/archive/socog-case-study ; vérification : https://www.judgments.fedcourt.gov.au/judgments/Judgments/fca/single/2000/2000fca1112 |
| `pages/a11y/lecon-12.html#1` | VRAI sur le critère 3.3.1, mais sans date ni source, et « NVDA ou VoiceOver n'annoncent alors l'erreur qu'au moment où… » non sourcé | corrigé : daté (WCAG 2.0, 11/12/2008), raison tirée de l'Understanding, annonces des lecteurs tirées de la technique ARIA21 | Cas réel — WCAG 2.0 et l'identification des erreurs (2008) | https://www.w3.org/TR/WCAG20/ ; https://www.w3.org/TR/UNDERSTANDING-WCAG20/minimize-error-identified.html ; https://www.w3.org/TR/WCAG20-TECHS/ARIA21.html (+ https://www.w3.org/TR/WCAG20-TECHS/ pour la date de la note) |
| `pages/a11y/lecon-13.html#1` | INVÉRIFIABLE — illustration générale, juste techniquement (verdict de B2 confirmé) | remplacé par : « a role is a promise », APG 1.1 du W3C | Cas réel — « un rôle est une promesse », dans le guide ARIA du W3C (2019) | https://www.w3.org/TR/2019/NOTE-wai-aria-practices-1.1-20190814/ (§ 2.1, § 3.5) ; https://www.w3.org/WAI/ARIA/apg/practices/read-me-first/ |
| `pages/a11y/lecon-14.html#1` | INVÉRIFIABLE — illustration générale (axe-core en CI ; « axe ne voit qu'un tiers des critères » sans source) | remplacé par : le GDS et dix outils sur « la page la moins accessible du monde » | Cas réel — le GDS teste dix outils sur « la page la moins accessible du monde » (2017) | https://accessibility.blog.gov.uk/2017/02/24/what-we-found-when-we-tested-tools-on-the-worlds-least-accessible-webpage/ |
| `pages/a11y/lecon-15.html#1` | INVÉRIFIABLE — récit anonyme (verdict de B2 confirmé) | remplacé par : la FTC contre accessiBe | Cas réel — la FTC contre accessiBe (2025) | https://www.ftc.gov/news-events/news/press-releases/2025/04/ftc-approves-final-order-requiring-accessibe-pay-1-million (22/04/2025 ; lu par l'outil web, curl reçoit un 404) |

## Décomptes

| cours | « Cas réel » | VRAI tel quel | INEXACT | INVÉRIFIABLE | INVENTÉ | remplacés | corrigés | gardés | « Scénario » | conformes avant → après |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|
| `neurones` | 12 | 0 | 0 | 12 | 0 | 12 | 0 | 0 | 0 | 0 → 12 |
| `a11y` | 15 | 0 | 4 (01, 02, 03, 04) | 11 | 0 | 13 | 2 | 0 | 0 | 0 → 15 |
| **total** | **27** | **0** | **4** | **23** | **0** | **25** | **2** | **0** | **0** | **0 → 27** |

(`a11y/06` et `a11y/12`, VRAIS pour l'essentiel mais non sourcés et chacun avec un point faux ou non
sourcé, sont comptés INVÉRIFIABLES ; `a11y/06` est en outre double : Target et l'acte européen.)

## Le cliquet lexical : douze écarts acceptés, et pourquoi

`lexique-diff.js` donne **12 écarts**, tous « GAGNÉS », sur trois pages. Le mot **« source »** entre dans
`a11y/03`, `07` et `08` par la **classe obligatoire** `cas-reel__source` (l'outil lit le HTML brut :
`cas-reel__source` y donne le mot `source`) ; il est dans une option de QCM de ces trois pages
(« source: intacte », « Le code source… », « l'ordre du code source »). Sans retouche, le cliquet
`verif-qcm-lexique.js` rougissait (`a11y` STRICTE 0,0 % → 50,0 %, puis INVERSE/restr. 0,0 % → 33,3 %).
Remède, sans toucher aux QCM : remettre à égalité les mots étrangers des quatre options des questions
touchées, en faisant entrer dans l'encadré les mots des autres options — `fournir`, `contrasté`, `lisible`
(`a11y/03`, tous trois dits par l'article de NN/g), `dérivé`, `dessine`, `fichier` (`a11y/07` ; « dérivé »
traduit la source), `grille`, `montant`, `déclare` (`a11y/08`, dans une phrase d'exemple sur `inert`).
Après : `verif-qcm-lexique.js` **0**, `verif-qcm-biais.js` **0**. `neurones` : **0 écart**.

## Contrôles (codes de sortie, sur la copie après les deux commits de contenu)

- `node tools/verif-contenu.js --cas-reel --cours=neurones` → **0** (12/12 conformes)
- `node tools/verif-contenu.js --cas-reel --cours=a11y` → **0** (15/15 conformes)
- `node tools/verif-contenu.js --strict` → **0** (« 1 maigre », déjà présent à la base `13eabe3`)
- `node tools/verif-html.js` → **0**
- `node tools/verif-domaines-interdits.js` → **0**
- `node tools/verif-qcm-lexique.js` → **0** ; `node tools/verif-qcm-biais.js` → **0**
- `node tools/cas-reels/lots/lexique-diff.js D:\test-claude-b7-neurones-a11y 13eabe3` → 12 écarts expliqués ci-dessus
- `node tools/cas-reels/lots/doublons.js` → 2 sources partagées (inchangé)
- 0 CR dans les 27 pages modifiées ; octets identiques hors des zones remplacées (`appliquer.js`, puis
  `controle-branche.js`)
- `node tools/verif.js --rapide` → **1**, et **51 étapes vertes sur 54** (1 856 s, machine chargée par les autres agents) ; les trois signalements sont ceux que la consigne tolère : `donnees` pour le seul invariant **I18** (`search-index.js` périmé, 2 erreurs, toutes deux sous I18 ; 0 autre erreur), `doc-ref` et `doc-rec` (chiffres du cours `doc` que les lignes de source font bouger). `qcmbiai` et `qcmlexi` verts dans la chaîne.

## Doutes, et ce qui reste ouvert

- `neurones/04` : la page du résumé de NeurIPS donne pour AlexNet 39,7 % / 18,9 % et 500 000 neurones ;
  l'article PDF donne 37,5 % / 17,0 % et 650 000 neurones. Le cas cite le PDF (lien) et ses chiffres.
- `neurones/05` : Goyal et al. parlent de SGD par lots, pas de descente « pure » ; le cas dit ce que
  disent les auteurs (taux, montée progressive), la leçon fait le lien.
- `neurones/12` : que le CD d'entraînement de plus de 300 000 images soit SD3 se déduit du § 2 et du
  § 2.1 du rapport (le second dit que SD3 a été envoyé « pour usage possible comme données
  d'entraînement »).
- `a11y/07` : la page de Chrome n'affiche que « Last updated 2021-12-13 » ; le titre dit 2021, le texte
  ne date pas le lancement.
- `a11y/08` : la dernière phrase (une grille de produits derrière une modale) est un exemple d'usage, pas
  un fait rapporté ; elle porte aussi trois mots de rééquilibrage lexical.
- `a11y/11` : les motifs de la décision ne sont lus que dans une reproduction (Independent Living
  Institute) ; AustLII et le site de la commission refusent l'outil. L'étude de cas du W3C donne une
  audience en « juillet 2000 », les motifs « 8 et 11 août 2000 » : le cas ne date pas l'audience. Les
  20 000 dollars australiens ne sont que dans l'étude du W3C (décision ultérieure, non ouverte).
- `a11y/15` : ftc.gov répond 404 à curl ; la page a été lue par l'outil web (date, vote 3-0, termes).
- **Hors encadré, non traité** : le corps de `a11y/lecon-14` dit qu'un audit automatique « ne détecte
  qu'environ un tiers des critères — l'ordre de 30 à 40 % » (non sourcé ; l'audit du GDS cité dans le
  cas trouve 17 à 41 % des barrières selon l'outil). Le corps de `a11y/lecon-10` raconte déjà l'épisode
  de 1997 (« des centaines d'enfants ») : les sources ouvertes disent environ 700 personnes, surtout des
  enfants (Takahashi et Tsukahara, *Acta Paediatrica Japonica* 40(6), 1998, PMID 9893306).
- Registre `foyers.md` à compléter par l'orchestrateur avec les 27 sujets (réservations du lot 4).
