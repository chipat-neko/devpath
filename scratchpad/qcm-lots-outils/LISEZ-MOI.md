# Outils d'orchestration de la phase C du CHANTIER-V18 (lots de QCM)

Versés au premier lot (C2 à C10, 2026-11-19). Ils écrivent leurs sorties À CÔTÉ d'eux : pour un
nouveau lot, copie ce dossier dans le dossier de travail de la session, et lance-les depuis la copie.

| outil | rôle |
|---|---|
| `consignes.js <base>` | remplit `tools/qcm-lots/consigne-ecriture.md` pour chaque cours du lot (liste et indications d'exécution DANS le script : à adapter) ; la mesure de départ est relue par `mesure-biais-qcm.js --json` |
| `cr-consignes.js <n> <cours> <base> "<part 1>" "<part 2>"` | remplit `tools/qcm-lots/consigne-contre-relecture.md` (relecteur indépendant, en lecture seule, AVEC pré-mesure) |
| `qcm-appliquer.js <copie> <cours> <verdicts.json>... [--sec]` | applique les verdicts `A_CORRIGER` (refuse un `avant` ambigu ou un JSON cassé, n'écrit alors rien) et remesure le cours ; `--sec` : à blanc |
| `reprises.js <n> <cours> "<état>" "<mission>"` + `consigne-reprise-modele.md` | consigne d'une REPRISE de dosage, quand des corrections justes ont rouvert un indice |
| `voir-q.js <copie> <page> <bloc> <i>...` | affiche une question (options, bonne réponse) |
| `controle-c.js <n> <cours> [base]` | contrôle avant fusion : fichiers du seul cours, 0 CR, JSON valide, commits signés, copie propre |
| `fusion.js <n> <cours> "<résumé>" ...` | `merge --no-ff` des branches `v18/c<n>-<cours>` dans `master` |
| `refiger-lot.js` | après `verif-qcm-biais --ecrire` et `verif-qcm-lexique --ecrire` : ne garde la référence neuve QUE pour les cours du lot (les dérives hors lot, dans la tolérance, reprennent leur entrée de HEAD) et marque le lot `traite` |

Leçon du premier lot : six contre-relectures sur sept ont ROUVERT l'indice lexical (3 à 10 questions
par cours) ; la seule qui avait pré-mesuré ses propositions n'a rien rouvert. D'où la pré-mesure
obligatoire dans la consigne de contre-relecture, et une reprise dédiée quand il le faut.
