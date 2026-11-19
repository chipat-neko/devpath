# Reprise du cours `__COURS__` (case __CASE__ de la phase C du chantier V18) — le dosage qui reste

Un agent a réécrit les QCM du cours `__COURS__` du site Syntaxe pour qu'aucun indice de forme ne désigne
la bonne réponse. __ETAT__ Ta mission est PRÉCISE et BORNÉE : __MISSION__

**Les règles sont celles de la consigne du cours**, que tu lis d'abord en entier :
`__CONSIGNE__` — en particulier § 0 (ton dossier : `__DOSSIER__`, Git Bash `__DOSSIERBASH__`, branche
`__BRANCHE__` ; ton shell démarre dans `D:\test-claude`, donc chaque commande commence par
`cd __DOSSIERBASH__ || exit 1` ; tu n'écris RIEN dans `D:\test-claude\` ; pas de téléchargement en
arrière-plan), § 1 (la bonne réponse et son `explain` sont INTOUCHABLES sauf faute prouvée ; un
distracteur est une thèse fausse, précise, plausible, en bon français), § 6 (règles de fusion, git
avec `-c core.autocrlf=false`, commits `-F` signés `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`).
Lis aussi le rapport de l'auteur, `__RAPPORT__`.

**La méthode du dosage** (leçons de B4, à appliquer à la lettre) :
- mesure d'abord, dans la copie : `node tools/mesure-biais-qcm.js --json` (le cours `__COURS__` dans
  `parCours`), `node tools/mesure-lexique-qcm.js --liste=__COURS__` (règles du k et du w, écrites en tête
  de sa sortie), `node tools/mesure-biais-inverse.js`, `node tools/mesure-mot-fetiche.js`,
  `node tools/mesure-tics-lot.js`, `node tools/mesure-biais-qcm.js --lots` ;
- **calcule** combien de bascules il faut pour ramener chaque indice vers 25 % — pas « toutes les
  questions » : fermer un indice à fond le RETOURNE ;
- après CHAQUE retouche, remesure TOUT : fermer un indice en rouvre un autre (longueur → densité →
  lexique) ; la sonde `scratchpad/vue-sonde/controle.js` (copie-la dans ta copie et adapte-la) compare,
  question par question, ce que chaque stratégie désigne ;
- **une correction de contre-relecture déjà posée ne se défait pas** : son SENS reste (le distracteur
  qu'elle a rendu faux reste faux) ; tu peux en changer les mots pour le lexique et la densité, en
  gardant le sens ;
- relis chaque option retouchée comme un expert qui veut la démolir ; exécute ce qui peut l'être.

**Cible** : « la plus longue » vers 25 % ; aucune des 44 stratégies au-dessus de **27,5 %** ; lexique
**0 / 0 / 0** ; biais inverse, mot fétiche, tics de lot, `--lots` muets ; explications orphelines 0
(`node tools/mesure-explain-orpheline.js --depuis=__BASE__ --seul=__COURS__`) ; intouchable : seules les
atteintes déclarées (`node tools/mesure-qcm-intouchable.js __COURS__ __BASE__`) ; `node tools/verif-html.js`
0 ; `node tools/verif-contenu.js --cas-reel --cours=__COURS__` 0 ; chaque bloc JSON valide, 0 CR.

**Commits** : sur ta branche seulement, au moins un par étape (`V18/__CASE__ : __COURS__ -- reprise : …`, avec la
mesure). **Rapport** : ajoute à la fin de `__RAPPORT__` une section « Reprise » (avant / après de chaque
indice, retouches faites, ce qui reste) et commite-la.

**Ton dernier message (en français)** : tes commits, la mesure avant / après, chaque retouche de sens
(s'il y en a), ce qui reste.
