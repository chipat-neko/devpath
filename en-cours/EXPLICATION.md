# en-cours/ — l'état du travail, maintenant

Le seul dossier « vivant » de la racine : ce qui dit **où en est le projet aujourd'hui**.

| Fichier | Ce que c'est | Mis à jour par |
|---|---|---|
| **[`EN-COURS.md`](EN-COURS.md)** | **À lire en premier.** Le mode de l'autonomie, le chantier en cours (V16, point B4), les cours faits et à faire avec leur taux mesuré, les cases restantes, les règles absolues, où sont les choses. | À la main, à chaque changement de cap |
| [`ETAT-AUTONOMIE.md`](ETAT-AUTONOMIE.md) | Le tableau de bord : cases faites par plan, plan courant, dernière passe, anomalies éventuelles. | **Automatiquement, chaque heure**, par la tâche `Syntaxe-Sante` (`tools/sante-autonomie.ps1`) |

⚠️ **Ne pas renommer ni déplacer `ETAT-AUTONOMIE.md`** : son chemin est écrit dans
`tools/sante-autonomie.ps1`. Et comme il change chaque heure, il apparaît presque toujours comme
« modifié » dans `git status` — c'est normal.
