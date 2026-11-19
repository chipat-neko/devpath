# Consigne d'écriture — les QCM du cours `llm` (phase C du V18, case C8)

Préparée le 2026-11-19 dans la copie de travail `D:\test-claude-c8-llm` (branche `v18/c8-llm`,
partie de `8d163bf`). Un seul agent fait tous les rôles (écriture, dosage, relecture, contre-
relecture). Mesures de départ archivées dans `scratchpad/c8-llm/depart/` (sorties brutes des
outils ; `questions.txt` : les 48 questions à plat ; `plan.json` : le plan des rangs figé au
départ). ⚠️ Écrite d'abord sous forme de notes de travail, mise au propre ici après la vague :
l'ordre de la case (consigne avant vague) n'a pas été tenu à la lettre, et le rapport le dit.

Le cours : « Développer avec l'IA & les LLM », 12 leçons — fonctionnement d'un LLM (tokens,
fenêtre de contexte, température), prompt engineering, appel d'API, sorties structurées et tool
use, RAG, agents, petite application, évaluation (LLM-as-judge), sécurité (injection de prompt),
coût et latence, adapter un modèle (prompt → RAG → fine-tuning), projet final (`lecon-12` :
3 questions + **12 de bilan**). **48 questions, 144 distracteurs.**

## Ce qui se prouve ici, et comment

Pas de modèle à exécuter : les articles d'origine et la documentation officielle font foi ; les
calculs se rejouent en Python 3.14 (`scratchpad/c8-llm/preuves/preuves.py`, sortie dans
`preuves.out`) :

| affirmation du cours | ce que le calcul rend |
|---|---|
| softmax et température (exemple canapé 0,42 / lit 0,30 / sol 0,12) | T = 1 : 0,50 / 0,36 / 0,14 ; T = 0,2 : 0,84 / 0,16 / 0,002 ; T = 0,05 : 0,999 — seule T = 0 est gloutonne |
| `cout(2000, 400)` = 0,0016 € ; exercice : 0,00225 € et 225 €/jour | exact |
| `1893 × 4127 = 7812411` (lecon-04) | exact |
| `usage` : 12 + 3 = 15 tokens (lecon-03) | exact |
| `appel_robuste(essais=3)` attend « 1 s, 2 s, 4 s » (lecon-10) | **faux** : 1 s puis 2 s, le 3ᵉ échec bascule sur le repli |
| « une hausse de 1 % sur 20 cas » (lecon-08) | **impossible** : un cas pèse 5 points ; 15/20 → 16/20 : p = 0,500 (Fisher exact) |
| « Bonjour le monde ≈ 4 tokens » | 3 tokens avec le tokenizer de Qwen2.5 (l'exemple est illustratif et marqué « ≈ ») |
| OWASP Top 10 LLM, n°1 = injection de prompt | confirmé (LLM01:2025, genai.owasp.org) |

## La règle qui prime sur toutes les mesures

> **UN DISTRACTEUR EST UNE PHRASE FRANÇAISE QUI ÉNONCE UNE THÈSE FAUSSE, PRÉCISE ET PLAUSIBLE.**

Les pièges propres à ce cours, où un distracteur devient vrai par accident :
- **les fonctions côté fournisseur** : outils serveur (recherche web, exécution de code) et
  connecteurs MCP distants existent ; un distracteur « l'API du fournisseur exécute ta fonction »
  peut se lire vrai. Préférer « elle calcule seulement la réponse », « le modèle lance l'outil ».
- **l'état côté serveur** : certaines API gardent un fil de conversation ; ne pas écrire « le
  serveur garde l'historique » sans que l'énoncé pose l'API sans mémoire (lecon-03 q1 le pose).
- **le cache de prompt** a une durée de vie (5 min, 1 h) : « elle garde le contexte une heure »
  frôle le vrai ; l'éviter.
- **few-shot et faits** : glisser l'information dans des exemples la donne au modèle ; un
  distracteur few-shot « pour les faits » doit rester sans information.
- **température** : « basse = déterministe » est la formule du cours (signalée, non touchée) ;
  ne pas bâtir de distracteur sur la nuance T = 0,2 / T = 0.

## Mesure de départ (`node tools/mesure-biais-qcm.js --seul=llm`, sur `8d163bf`)

| indice | réussite | couverture | rendement |
|---|---:|---:|---:|
| la plus longue | **97,9 %** | 100,0 % | 97,9 % |
| la plus détaillée | 71,5 % | 64,6 % | 93,5 % |
| le mot technique exclusif | 66,0 % | 64,6 % | 80,6 % |
| l'incise entre parenthèses | 60,9 % | 47,9 % | 100,0 % |
| ponctuation forte (seule / RESTREINDRE) | 54,7 % | 39,6 % | 100,0 % |
| RESTREINDRE aux deux-points | 45,8 % | 27,1 % | 100,0 % |
| ECARTER la moins bavarde | 40,3 % | 4,2 % | 100,0 % |

Rangs **47 / 1 / 0 / 0**, cible 12 / 12 / 12 / 12 (8 269 caractères demandés). Lexique : **42
exploitables, 30 retournées, 46 à mettre en forme** ; **35 bonnes réponses sur 48 ont k > 0**
(règle du w). Tics de lot : **11** (deux-points médian 15 / 4, point-virgule médian 8 / 5, glose
finale 5 / 0, quatre segments 5 / 0, « à chaque », « au modèle », « message système », « le
prompt », « l'historique à chaque »…). Mots fétiches : **5 alertes** (`données`, `tokens`,
`système`, `prompt`, `modèle`). Biais inverse : 4 alertes (rangs 1, 2, 3, la moins bavarde).

## Ce que chaque question tient (vérifié par `scratchpad/c8-llm/sonde/atelier.js`)

1. **Rang** de la bonne réponse = `depart/plan.json`, avec 6 échanges déclarés dans `atelier.js`
   (`SURCHARGE`) : `lecon-12` réparti PAR BLOC (le bloc quiz reçoit trois rangs distincts au lieu
   de 3 / 3 / 3), et `lecon-03`, `lecon-05`, `lecon-06`, `lecon-07` échangent q1 et q3 là où le
   plan rendait la contrainte du `w` intenable. Bande 70-130 %, aucun ex æquo.
2. **Gabarit de la bonne réponse** repris dans les trois distracteurs : même attaque (« Parce
   que », « Pour », « Dans », « En … »), mêmes marques (`:` `;` `—` `→` `/` « » incise, glose
   finale, « ex. »), même nombre de `, : ;`, mêmes absolus / prudents / négations (0 ou 4).
3. **Lexique** : `k` égal dans les quatre ; si `k > 0`, `w` égal aussi. Le levier le plus sûr :
   reprendre dans les distracteurs les mots étrangers de la bonne réponse (« l'ensemble »,
   « renvoyant », « seulement », « parade », « appliquer »…). Quand c'était impossible, faire
   entrer le mot dans le corps, à sens égal (six phrases, toutes dites dans le rapport).
4. **Intrus lexical** : chaque mot de 5 lettres et plus porté par 0, 1 (s'il y a un mot propre à
   chaque option), 2 ou 4 options — jamais 3.
5. **Écho** : même nombre de mots de l'énoncé dans les quatre (souvent 0 : éviter « modèle »,
   « agent », « pour », « dans », « tests » quand l'énoncé les porte).
6. **Motifs de forme** (copie exacte de `mesure-tics-lot`) : 0, 2 ou 4 porteurs, dont « est /
   reste / garde » et la parenthèse ouverte par un article.

## Le dosage, calculé (pas « toutes les questions »)

- **la plus dense** : 22 questions où la bonne réponse était seule la plus dense → 13 visées
  (≈ un quart) ; 9 bascules, chacune en rendant un distracteur plus dense (moins de petits mots)
  à longueur, rang, `w` et `k` constants.
- **la moins bavarde** : les mêmes retouches ôtent des mots ; 5 ex æquo ou bascules en plus.
- **le mot technique exclusif** : viser 1 désignation de la bonne pour 3 de distracteurs (sinon
  l'INVERSE dépasse 28 % : c'est arrivé, 28,1 %, corrigé en ramenant trois désignations de
  distracteurs à l'égalité).
- **mots fétiches** : ôter `modèle` et `chaque` des distracteurs là où la bonne réponse ne les
  porte pas (remplacés par `LLM`, `système`, `plusieurs`… sans changer `w`) ; poser `données`
  là où seule la bonne réponse le portait.

Chaque retouche passe par `diff.js` (signature complète contre le disque) avant d'être posée ; la
sonde `controle.js` (v2, stratégies chargées depuis l'outil) contrôle chaque lot contre `HEAD`.
