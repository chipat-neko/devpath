# Rapport V18 — case B10, lot 7 : les cours `llm` et `ml` (copie `b10-llm-ml`, branche `v18/b10-llm-ml`)

Copie de travail `D:\test-claude-b10-llm-ml`, partie de `01795b6`. Part traitée : les **24 « Cas réel »**
des cours `llm` (12, un par leçon) et `ml` (12, un par leçon). Pièces dans `scratchpad/b10-llm-ml/`
(ignoré par git) : `nouveaux.js` (les 24 titres et corps), `appliquer.js` (remplace du titre de l'encadré
au `</div></div>` final, refuse un titre absent ou en double et tout CR), `controle.js` (0 CR et octets
identiques à `01795b6` hors des encadrés), `dump.js`, `avant.js`, `texte.js`, `qcm-mot.js`, `pdftxt.py`
(`pypdf`), `bcw.py` (rejeu de `load_breast_cancer`), scikit-learn 1.9.1 et numpy dans `py/`
(`pip install --target`), et les pages et PDF ouverts (`mata.pdf`, `gpt3.pdf`, `toolformer.pdf`,
`react.pdf`, `greshake.pdf`, `greshake2.pdf`, `ovadia.pdf`, `ovadia1.pdf`, `rag.pdf`, `kapoor.pdf`,
`roelofs.pdf`, `breiman.pdf`, `ladder.pdf`, `lasso.html`, `aio.html`, `truffle.html`, `syco.html`,
`routellm.html`, `gmail2015.html`, `gmail2019.html`, `zech.html`, `zillow8k.htm`, `kaggle-cc.json`,
`kaggle-cc.html`, `skl-v020.html`, `skl-mixed.html`, `chen2012.html`, `gulshan-efetch.xml`,
`michelangelo.html`, `uci-bcw.html`, `skl-toy.html`…).

**En une phrase** : `node tools/verif-contenu.js --cas-reel` passe de **12 hors de la règle à 0** pour
`llm` et de **12 à 0** pour `ml` ; sur les 24 cas trouvés, **2 étaient VRAIS** mais à préciser
(Mata v. Avianca, RAG de Lewis 2020), **6 portaient un sujet réel mais INEXACT ou en partie non sourcé**,
**16 étaient des récits anonymes ou des usages généraux (INVÉRIFIABLES)**, dont un doublon interne
(`llm/lecon-08` racontait une seconde fois Mata v. Avianca) ; **8 corrigés sur leur sujet**, **16 remplacés**
par un cas réel daté et sourcé sur la même notion, **0 renommé « Scénario »**.

**Commits** (branche `v18/b10-llm-ml`) : `c71e020` (llm, 12 cas), `bf6712f` (ml, 12 cas), puis le commit
de ce rapport.

## Méthode

- Lu : la règle (`docs/enrichissements/NOUVEAUX-COURS.md`), les comptes rendus B1 à B3 et B9 du plan, les
  verdicts de B2 (`llm/lecon-01` VRAI, `ml/lecon-12` INEXACT), chaque leçon autour de son encadré.
- Seul l'intérieur de l'encadré change, du `<p class="callout__title">` au `</div></div>` final (types
  `note`, et `warn` pour `llm/lecon-07`, gardés). Aucun intertitre propre au récit n'est collé au-dessus :
  `llm/lecon-09`, `-10`, `-11` ont un `<h2>Cas réel</h2>` neutre, gardé tel quel ; les autres encadrés suivent
  un paragraphe, une figure ou un bloc de code. `controle.js` : **24 pages, 0 CR, octets identiques hors des
  encadrés** (comparés à `01795b6`).
- Forme : titre `Cas réel — sujet (année)`, dernier paragraphe `<p class="cas-reel__source">` daté et lié ;
  **aucun lien dans le corps** ; `&nbsp;` devant « : ; ? » et dans « ». Corps de 150 à 205 mots.
- **Un sujet = un seul cours** : chaque sujet et chaque URL cherchés dans `foyers.md` et dans tout `pages/`,
  puis inscrits au fichier commun `b10-reservations.txt` (24 lignes, aucune prise par un autre agent).
  `doublons.js` : toujours **2** sources partagées entre cours (les deux légitimes connues, hors de ma part).
  Écartés : Hugging Face et safetensors sont à `neurones/lecon-03` (autre sujet que les jetons exposés) ;
  Uber et sa clé AWS sont à `iac/lecon-10` (autre sujet que Michelangelo) ; les ImageNet de `neurones`
  (AlexNet, Goyal) sont d'autres sujets que celui envisagé pour `ml/lecon-06` (Baidu, abandonné, voir plus bas).
- Chaque affirmation relue contre la source ouverte ; PDF lus avec `pypdf` ; pages lues par `curl` quand
  l'outil web échouait (OpenAI, Uber), par l'outil web quand `curl` était refusé (JAMA) ; résumé du JAMA
  confirmé par les E-utilities du NCBI. Un comportement technique rejoué : `load_breast_cancer` (scikit-learn
  1.9.1, Python 3.14) donne (569, 30), 212 malins (cible 0) et 357 bénins (cible 1).

## Cas par cas

### llm

| Cas | Trouvé | Action | Nouveau titre | Sources ouvertes |
|---|---|---|---|---|
| `pages/llm/lecon-01.html#1` | Événement nommé, VRAI (B2), imprécis : « un avocat » alors que deux avocats et leur cabinet sont sanctionnés | Corrigé et précisé : texte du 1er mars 2023, Schwartz auteur, LoDuca signataire, ChatGPT qui affirme que ses décisions sont « vraies » et dans Westlaw et LexisNexis, amende de 5 000 $ et lettres aux juges, 22 juin 2023 | Cas réel — Mata c. Avianca, les fausses décisions de ChatGPT (2023) | https://storage.courtlistener.com/recap/gov.uscourts.nysd.575368/gov.uscourts.nysd.575368.54.0_3.pdf |
| `pages/llm/lecon-02.html#1` | Récit anonyme (« une équipe support »), INVÉRIFIABLE | Remplacé : GPT-3, zero-shot, one-shot, few-shot (10 à 100 exemples), WebQuestions 14,4 → 25,3 → 41,5 %, explication prudente des auteurs (style des réponses) | Cas réel — GPT-3 et l'apprentissage par quelques exemples (2020) | https://arxiv.org/abs/2005.14165 ; https://arxiv.org/pdf/2005.14165v1 |
| `pages/llm/lecon-03.html#1` | Usage général (clés poussées sur GitHub, « en quelques minutes »), INVÉRIFIABLE ; même récit que `http/lecon-10` (lot suivant) | Remplacé : Lasso Security, novembre 2023, 1 681 jetons Hugging Face valides, 723 organisations, 655 en écriture, Meta Llama 2, BigScience, EleutherAI, révocations le jour même | Cas réel — les jetons Hugging Face laissés sur GitHub (2023) | https://www.lasso.security/blog/1500-huggingface-api-tokens-were-exposed-leaving-millions-of-meta-llama-bloom-and-pythia-users-for-supply-chain-attacks |
| `pages/llm/lecon-04.html#1` | Illustration générale (assistant e-commerce, commande 4821), INVÉRIFIABLE | Remplacé : Toolformer (Meta AI Research, 9 février 2023), GPT-J 6,7 G paramètres, cinq outils, ASDiv 14,8 → 40,4, calculatrice pour 97,9 % des exemples | Cas réel — Toolformer apprend à appeler une calculatrice (2023) | https://arxiv.org/abs/2302.04761 ; https://arxiv.org/pdf/2302.04761v1 |
| `pages/llm/lecon-05.html#1` | Récit anonyme (support interne, note RH) + mention générale de Perplexity, INVÉRIFIABLE | Remplacé : AI Overviews de Google, billet d'Elizabeth Reid du 30 mai 2024 (liens vers les sources, cailloux, satire republiée, colle sur la pizza) | Cas réel — les AI Overviews de Google et les cailloux (2024) | https://blog.google/products/search/ai-overviews-update-may-2024/ |
| `pages/llm/lecon-06.html#1` | Usage général (assistants de code), INVÉRIFIABLE | Remplacé : ReAct (Yao et al., 6 octobre 2022) — la boucle que la leçon nomme déjà ReAct ; PaLM-540B, `search`/`lookup`/`finish`, +34 et +10 points sur ALFWorld et WebShop | Cas réel — ReAct, raisonner puis agir en boucle (2022) | https://arxiv.org/abs/2210.03629 ; https://arxiv.org/pdf/2210.03629v1 |
| `pages/llm/lecon-07.html#1` | Usage général (« factures de plusieurs milliers d'euros en une nuit »), INVÉRIFIABLE | Remplacé : Truffle Security, 25 février 2026 — clés Google du JavaScript public devenues valides pour Gemini, 2 863 clés dans Common Crawl de novembre 2025, chronologie du signalement à Google | Cas réel — des clés Google publiques devenues clés Gemini (2025-2026) | https://trufflesecurity.com/blog/google-api-keys-werent-secrets-but-then-gemini-changed-the-rules |
| `pages/llm/lecon-08.html#1` | Usage général (évals en CI) + **doublon interne** de Mata v. Avianca (`llm/lecon-01`) | Remplacé : OpenAI, mise à jour complaisante de GPT-4o (25 avril 2025, retour arrière le 28), analyse du 2 mai 2025 (évals hors ligne et A/B bons, aucune éval de complaisance, défauts de comportement désormais bloquants) | Cas réel — la mise à jour trop complaisante de GPT-4o (2025) | https://openai.com/index/expanding-on-sycophancy/ (lu par `curl`, l'outil web reçoit un 403) |
| `pages/llm/lecon-09.html#1` | Événement non nommé (« des chercheurs », « dès 2023 ») ; « C'est pourquoi l'OWASP a classé LLM01… » : lien de cause non sourcé | Corrigé sur le même sujet, nommé : Greshake et al. (v1 du 23 février 2023, v2 du 5 mai 2023), Bing Chat dans la barre d'Edge, commentaire HTML, nom demandé, hameçonnage « carte cadeau Amazon », ver par e-mail ; OWASP retiré | Cas réel — l'injection indirecte éprouvée sur Bing Chat (2023) | https://arxiv.org/abs/2302.12173 ; https://arxiv.org/pdf/2302.12173v1 ; https://arxiv.org/pdf/2302.12173v2 |
| `pages/llm/lecon-10.html#1` | Récit anonyme (« un classique », « facture divisée par cinq »), INVÉRIFIABLE | Remplacé : RouteLLM (LMSYS, 1er juillet 2024), routeur GPT-4 Turbo / Mixtral 8x7B, −85 % MT Bench, −45 % MMLU, −35 % GSM8K pour 95 % de la performance | Cas réel — RouteLLM, router entre un grand et un petit modèle (2024) | https://lmsys.org/blog/2024-07-01-routellm/ (ouvert aussi, non cité : https://arxiv.org/abs/2406.18665) |
| `pages/llm/lecon-11.html#1` | Récit anonyme (« une équipe support »), INVÉRIFIABLE | Remplacé : Ovadia et al. (Microsoft, 10 décembre 2023), fine-tuning non supervisé contre RAG, actualité d'août à novembre 2023, Mistral 7B 0,481 → 0,504 (FT) / 0,875 (RAG) | Cas réel — Microsoft compare fine-tuning et RAG (2023) | https://arxiv.org/abs/2312.05934 ; https://arxiv.org/pdf/2312.05934v1 ; https://arxiv.org/pdf/2312.05934v3 |
| `pages/llm/lecon-12.html#1` | Sujet nommé (Lewis et coll. 2020), VRAI sur le fond ; « presque tous » les assistants d'entreprise : généralisation non sourcée | Corrigé et précisé : BART + index Wikipédia + DPR, état de l'art sur trois tâches, index 2016/2018 échangé (82 dirigeants, 70 % et 68 %, 12 % et 4 % avec le mauvais index) | Cas réel — le RAG de Lewis et coll. (2020) | https://arxiv.org/abs/2005.11401 ; https://arxiv.org/pdf/2005.11401v1 |

### ml

| Cas | Trouvé | Action | Nouveau titre | Sources ouvertes |
|---|---|---|---|---|
| `pages/ml/lecon-01.html#1` | Produit nommé ; 99,9 % confirmé (2019) ; « apprend de milliards de messages » non sourcé | Corrigé : boutons « Report spam » / « Not spam » qui entraînent les filtres, réseau de neurones et goûts de chacun (2015), 99,9 % et 100 millions de spams de plus par jour avec TensorFlow (2019) | Cas réel — le filtre anti-spam de Gmail (2015-2019) | https://gmail.googleblog.com/2015/07/the-mail-you-want-not-spam-you-dont.html ; https://workspace.google.com/blog/product-announcements/ridding-gmail-of-100-million-more-spam-messages-with-tensorflow (redirigé depuis cloud.google.com) |
| `pages/ml/lecon-02.html#1` | Événement anonyme mais réel (Zech et al.), INEXACT : pas « un marquage propre au scanner », mais un jeton métallique posé par les manipulateurs — et pas seulement lui ; « ne repérait pas la maladie » exagéré | Corrigé et nommé (source donnée par la consigne) : 158 323 radios, NIH / Mount Sinai / Indiana, 3 comparaisons sur 5, AUC 0,931 → 0,815, hôpital reconnu à 99,95 %, prévalence 34,2 % contre 1,2 %, AUC 0,861 par le seul hôpital | Cas réel — les radios de pneumonie qui reconnaissaient l'hôpital (2018) | https://journals.plos.org/plosmedicine/article?id=10.1371/journal.pmed.1002683 |
| `pages/ml/lecon-03.html#1` | Récit anonyme (prix de logements, erreur « presque doublée »), INVÉRIFIABLE | Remplacé : Kapoor et Narayanan (14 juillet 2022), 17 domaines, 329 articles, 8 types de fuite, type L1.2 ; guerre civile, imputation commune avec 95 % de valeurs manquantes au test, forêt aléatoire pas meilleure une fois corrigée | Cas réel — la fuite de données dans la prédiction des guerres civiles (2022) | https://arxiv.org/abs/2207.07048 ; https://arxiv.org/pdf/2207.07048v1 |
| `pages/ml/lecon-04.html#1` | Événement nommé, INEXACT ou non sourcé : « En 2021, l'entreprise a voulu s'en servir » (le programme existait avant ; 2021 est l'année de son arrêt), Zestimate « par des modèles de régression sur des millions de ventes » non sourcé | Corrigé sur le communiqué du 2 novembre 2021 : arrêt de Zillow Offers, citation de Rich Barton, dépréciation de ~304 M$, 240 à 265 M$ de pertes prévues, ~25 % des effectifs ; Zestimate retiré | Cas réel — Zillow Offers et ses prix mal prédits (2021) | https://www.sec.gov/Archives/edgar/data/1617640/000161764021000085/q32021991.htm |
| `pages/ml/lecon-05.html#1` | Usage général (fraude bancaire), INVÉRIFIABLE | Remplacé : jeu de l'ULB et de Worldline, septembre 2013, 492 fraudes sur 284 807 (0,172 %), « toujours pas de fraude » = 284 315 / 284 807 = 99,83 % (calculé), AUPRC recommandée par les auteurs | Cas réel — 492 fraudes sur 284 807 paiements par carte (2013) | https://www.kaggle.com/datasets/mlg-ulb/creditcardfraud ; https://www.kaggle.com/api/v1/datasets/view/mlg-ulb/creditcardfraud (ouverts aussi, non cités : https://www.openml.org/api/v1/json/data/1597) |
| `pages/ml/lecon-06.html#1` | Sujet nommé (classements public et privé de Kaggle), INEXACT : « À chaque compétition, des équipes… dégringolent… à force de surapprendre » est démenti par la seule mesure à grande échelle | Corrigé sur le même sujet : Roelofs et al. (NeurIPS 2019), 120 compétitions, peu ou pas de surapprentissage en classification, effet < 1 % chez les meilleures, exceptions dues à des découpages non indépendants ou des tests minuscules (90 exemples publics) | Cas réel — le surapprentissage mesuré sur 120 compétitions Kaggle (2019) | https://papers.nips.cc/paper_files/paper/2019/file/ee39e503b6bedf0c98c388b7e8589aca-Paper.pdf (ouverts aussi, non cités : https://arxiv.org/abs/1502.04585, https://arxiv.org/abs/1501.02876) |
| `pages/ml/lecon-07.html#1` | Produit nommé (Titanic sur Kaggle), INVÉRIFIABLE : « la compétition d'initiation la plus suivie », et « le jeu passagers n'est pas fictif : c'est le jeu Titanic » (le script lit un `passagers.csv` aux colonnes francisées) | Remplacé, en gardant le lien avec le Titanic : scikit-learn 0.20 (25 septembre 2018 : `sklearn.impute`, `OneHotEncoder` sur texte, `ColumnTransformer`) et l'exemple officiel « Column Transformer with Mixed Types » sur le Titanic d'OpenML | Cas réel — scikit-learn 0.20 et le pipeline du Titanic (2018) | https://scikit-learn.org/stable/whats_new/v0.20.html ; https://scikit-learn.org/stable/auto_examples/compose/plot_column_transformer_mixed_types.html |
| `pages/ml/lecon-08.html#1` | Récit anonyme (site d'e-commerce, k = 4), INVÉRIFIABLE | Remplacé : Chen, Sain et Guo (27 août 2012), RFM sur 2011, échelles 0–12 / 1–169 / 3–88 125 à normaliser, k-means à 3, 4, 5 groupes, groupes de 188, 527 et 1 748 clients | Cas réel — un cybermarchand britannique segmenté par k-means (2012) | https://link.springer.com/article/10.1057/dbm.2012.17 (ouvert aussi : https://archive.ics.uci.edu/dataset/352/online+retail) |
| `pages/ml/lecon-09.html#1` | Usage général (dépistage contre anti-spam), INVÉRIFIABLE | Remplacé : Gulshan et al. (Google, *JAMA*, 13 décembre 2016), deux seuils, EyePACS-1 : 90,3 % / 98,1 % puis 97,5 % / 93,4 % (sensibilité / spécificité) | Cas réel — Google, la rétinopathie diabétique et deux seuils (2016) | https://jamanetwork.com/journals/jama/fullarticle/2588763 (outil web ; `curl` refusé, 403) ; https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&id=27898976&retmode=xml (résumé et auteurs) |
| `pages/ml/lecon-10.html#1` | Récit anonyme (banque, churn), INVÉRIFIABLE | Remplacé : Leo Breiman, « Random Forests » (janvier 2001) : bagging + variables tirées au hasard, vote, pas de surapprentissage en ajoutant des arbres, importance par permutation (diabète : variable 8 qui n'ajoute presque rien à la 2, 29,7 → 29,4 %) | Cas réel — les forêts aléatoires de Leo Breiman (2001) | https://www.stat.berkeley.edu/~breiman/randomforest2001.pdf |
| `pages/ml/lecon-11.html#1` | Récit anonyme (équipe data, `joblib.dump`), INVÉRIFIABLE | Remplacé : Michelangelo d'Uber (5 septembre 2017) : mêmes expressions de préparation à l'entraînement et à la prédiction, artefacts et expressions compilées dans une archive ZIP | Cas réel — Michelangelo, la plateforme de ML d'Uber (2017) | https://www.uber.com/blog/michelangelo-machine-learning-platform/ (lu par l'outil web et par `curl` avec des en-têtes de navigateur) |
| `pages/ml/lecon-12.html#1` | Produit nommé, INEXACT (B2) : les variables ne mesurent pas la tumeur | Corrigé : noyaux cellulaires d'une ponction à l'aiguille fine, dix grandeurs résumées en moyenne / erreur type / « pire », créateurs, don à l'UCI en 1995, 212 malins et 357 bénins rejoués | Cas réel — le jeu Breast Cancer Wisconsin (1995) | https://archive.ics.uci.edu/dataset/17/breast+cancer+wisconsin+diagnostic ; https://scikit-learn.org/stable/datasets/toy_dataset.html ; rejeu `load_breast_cancer` (scikit-learn 1.9.1) |

## Décomptes

| | `llm` | `ml` | total |
|---|---:|---:|---:|
| « Cas réel » lus | 12 | 12 | 24 |
| VRAI (à préciser) | 2 | 0 | 2 |
| INEXACT ou en partie non sourcé (sujet réel) | 1 | 5 | 6 |
| INVÉRIFIABLE (anonyme ou général) | 9 | 7 | 16 |
| INVENTÉ | 0 | 0 | 0 |
| Corrigés sur leur sujet | 3 | 5 | 8 |
| Remplacés | 9 | 7 | 16 |
| Renommés « Scénario » | 0 | 0 | 0 |
| Hors règle avant → après (`--cas-reel`) | 12 → 0 | 12 → 0 | 24 → 0 |

(`llm/lecon-08` est compté INVÉRIFIABLE : son « cas célèbre » était un doublon de `llm/lecon-01`.)

## Contrôles (codes de sortie)

- `node tools/verif-contenu.js --cas-reel --cours=llm` → **0** (12 conformes) ; `--cours=ml` → **0** (12 conformes).
- `node tools/verif-contenu.js --strict` → **0**.
- `node tools/verif-html.js` → **0**.
- `node tools/verif-domaines-interdits.js` → **0**.
- `node tools/verif-qcm-lexique.js` → **0** ; `node tools/verif-qcm-biais.js` → **0**.
- `node tools/cas-reels/lots/lexique-diff.js D:\test-claude-b10-llm-ml 01795b6` → **1 écart, connu** :
  « source » entre dans `llm/lecon-03` par la ligne « Source : ». Le mot est dans un **distracteur**
  (« En clair dans le code source, c'est plus simple ») : il rend ce distracteur plus présent dans la page,
  ce qui affaiblit l'indice lexical au lieu de le renforcer ; les deux cliquets restent verts. Les sept autres
  écarts du premier passage ont été fermés dans le texte des encadrés, par des phrases exactes :
  « mémoire » retiré de `llm/01`, « combine » retiré de `ml/10` ; « refuse » (`llm/08`, conseil de la leçon),
  « fournit » et « réduire » (`llm/12`), « prédictions » (`ml/11`, Michelangelo), « prédire » (`ml/12`) remis.
- `node tools/cas-reels/lots/doublons.js` → 2 sources partagées (les deux connues, hors de ma part).
- `scratchpad/b10-llm-ml/controle.js 01795b6` → 24 pages, 0 CR, octets identiques hors des encadrés.
- `node tools/verif.js --rapide` (lancé une fois, après les deux commits de pages) → **code 1**, 745,8 s,
  54 étapes sur 83, **6 signalées**, toutes expliquées :
  - `donnees` : invariant **I18** seulement (index de recherche périmé) — toléré, l'orchestrateur régénère ;
  - `doc-rec` : « 1 179 citent la source » et « 7 leçons » introuvables dans la page du cours `doc` — les
    compteurs que mes lignes de source font bouger, toléré ;
  - `erreurs` et `rj-bash` : environnement — `verif.js` lancé depuis PowerShell, `bash` y désigne le lanceur
    WSL (« aucune distribution installée ») ; rejoués seuls depuis Git Bash : `verif-erreurs.js` **0**
    (« Aucune faute »), `preuves/rejoue-bash.js` **0** (4 conformes) ;
  - `etude-4` et `etude-6` : « la page n'a pas fini de se construire » (Chrome sous charge, machine partagée) ;
    rejoués seuls : `preuves/etude-reecriture.js` **0**, `preuves/etude-inconnu.js` **0**.
  Aucune de ces étapes ne lit les cours `llm` ou `ml`.

## Doutes, et ce qui reste ouvert

- **`llm/lecon-08`, page d'OpenAI** : l'outil web reçoit un 403 ; la page a été lue par `curl` (texte complet,
  daté du 2 mai 2025). Le contre-relecteur devra faire de même.
- **`llm/lecon-10`** : le résumé arXiv **actuel** de RouteLLM (v4, février 2025) annonce « plus de 2 fois » moins
  cher ; les chiffres du cas (85 %, 45 %, 35 %, 95 %) sont ceux du **billet du 1er juillet 2024**, seule source
  citée. Écarté pour ce cas : le billet d'Anthropic sur le cache de prompt, dont la page affiche aujourd'hui
  « August 14, 2025 » alors que l'Internet Archive l'a enregistrée dès le 14 août 2024 (index CDX ouvert) — une
  date fausse sur la source primaire.
- **`ml/lecon-06`** : le premier choix était la disqualification de Baidu à l'ILSVRC (annonce d'ImageNet du
  2 juin 2015) ; `image-net.org` refusait toute connexion (ECONNREFUSED ou délai dépassé, outil web et `curl`, en https et en http, à plusieurs reprises),
  et le retrait de l'article de Baidu sur arXiv (1501.02876) ne dit que « a mistake related to ImageNet server
  submissions » : abandonné. Le cas retenu (Roelofs et al.) **dément** la généralisation de l'ancien texte ;
  il garde la notion de la leçon (test gardé caché, validation croisée).
- **`ml/lecon-07`** : la prose de l'exemple scikit-learn dit « mean-imputation », mais son code utilise
  `SimpleImputer(strategy="median")` ; le cas suit le code (« imputés par la médiane »).
- **`ml/lecon-12`** : l'UCI date le don du 31/10/1995, scikit-learn de « November, 1995 » : le cas écrit « en 1995 ».
- **`ml/lecon-09`** : article mis en ligne le 29 novembre 2016 (selon l'outil web), numéro du 13 décembre
  2016 (PubMed) : le corps dit « Fin 2016 », la ligne de source donne le numéro.
- **`ml/lecon-05`** : la page Kaggle demande de citer Dal Pozzolo et al. (IEEE, 2015), que je n'ai pas pu ouvrir
  (pas de copie libre trouvée) : la ligne de source ne cite que la page du jeu.
- **`llm/lecon-07`** : titre daté « (2025-2026) » (signalement en novembre 2025, publication en février 2026).
- **Hors encadré, rien à corriger relevé** dans les 24 leçons (seule trace des anciens récits : le commentaire
  « diagnostic de tumeurs » du code de `ml/lecon-12`, exact puisque la cible est le diagnostic).
- Les mots « documentation » des lignes de source (`ml/lecon-07`, `ml/lecon-12`) peuvent faire bouger les
  compteurs du cours `doc` (`doc-ref`, `doc-rec`) : l'orchestrateur régénère.

## Consignes de fusion

- Fusionner `v18/b10-llm-ml` avec `-c core.autocrlf=false` ; seuls `pages/llm/lecon-01..12.html`,
  `pages/ml/lecon-01..12.html` et ce rapport changent.
- Régénérer ensuite les pages dérivées et index (`search-index.js`, `etude-recherche.html`…), puis
  `verif-recherche`, `verif-doc` (`doc-ref`, `doc-rec`).
- Registre des foyers, sujets à inscrire : Mata v. Avianca (`llm/01`), GPT-3 few-shot (`llm/02`), jetons
  Hugging Face de Lasso (`llm/03`), Toolformer (`llm/04`), AI Overviews 2024 (`llm/05`), ReAct (`llm/06`),
  clés Google / Gemini de Truffle (`llm/07`), complaisance de GPT-4o (`llm/08`), Greshake et al. (`llm/09`),
  RouteLLM (`llm/10`), Ovadia et al. (`llm/11`), RAG de Lewis et al. (`llm/12`), Gmail anti-spam (`ml/01`),
  Zech et al. (`ml/02`), Kapoor et Narayanan (`ml/03`), Zillow Offers (`ml/04`), fraude ULB/Worldline (`ml/05`),
  Roelofs et al. / Kaggle (`ml/06`), scikit-learn 0.20 / Titanic (`ml/07`), Chen et al. RFM (`ml/08`),
  Gulshan et al. (`ml/09`), Breiman 2001 (`ml/10`), Michelangelo (`ml/11`), Breast Cancer Wisconsin (`ml/12`).
- `http/lecon-10` (lot B11) raconte encore les clés d'API poussées sur GitHub : `llm/03` a pris un sujet précis
  (Lasso), le récit générique reste libre pour `http` à condition d'y mettre un autre sujet daté.
