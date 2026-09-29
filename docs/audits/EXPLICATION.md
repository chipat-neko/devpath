# docs/audits/ — audits, inventaire et contrôles

Les regards extérieurs portés sur le site, à des dates précises. Ce sont des **photographies** :
les chiffres qu'ils donnent datent de leur jour, et la plupart des constats ont été corrigés par
les chantiers qui en sont issus (voir `../chantiers/`).

| Fichier | Ce que c'est | A donné |
|---|---|---|
| `AUDIT-2026-07-27.md` | Audit complet du site (66 points) | Chantier V4 |
| `AUDIT-2026-08-01.md` | Audit de contrôle, 11 agents, 46 constats | Chantier V7 |
| `AUDIT-QUALITE.md` | Audit qualité automatisé de juin (1 vrai défaut, 70 faux positifs) | Correctif des durées du cours JS |
| `AUDIT-UI-UX-PRO-MAX.md` | Audit visuel de l'accueil (compétence ui-ux-pro-max) | 8 correctifs visuels |
| `AUDIT-V10-2026-08-13.md` | Audit indépendant des 7 cours du V10, 11 agents | Chantier V11 |
| `INVENTAIRE-2026-08-20.md` | « Ce qui manque à Syntaxe » : inventaire de 11 agents | Chantiers V12 à V15 |
| `VERIF-FINALE.md` | Rapport de la dernière **passe de sécurité** (verdict en 1ʳᵉ ligne) | Réécrit à chaque fin de chaîne |
| `resultat.md` | Audit complet en lecture seule du dossier | — |

⚠️ **`VERIF-FINALE.md` est écrit par l'autonomie** : quand toutes les cases de la chaîne sont
cochées, le wrapper lance une passe de sécurité qui y écrit `VERDICT: VERT` ou `VERDICT: ROUGE`
en première ligne. Son chemin est codé dans `.autonomie/autonomie.ps1` (`$rapport`) : ne pas le
déplacer sans modifier le wrapper.
