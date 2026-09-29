# .autonomie/ — le moteur de l'autonomie

L'autonomie fait avancer le site sans intervention : la tâche planifiée Windows
**`Syntaxe-Autonomie`** lance `autonomie.ps1`, qui lance `claude.exe` en mode non interactif sur
le premier plan de chantier qui a encore une case vide, puis replanifie la passe suivante
**5 minutes après la fin**. Mode actuel : **autonomie totale** (voir `en-cours/EN-COURS.md`).

## Les scripts (versionnés)

| Fichier | Rôle |
|---|---|
| `autonomie.ps1` | **Le wrapper.** La liste des plans (`$CHAINE`, chemins relatifs vers `docs\chantiers\`), le modèle (`claude-opus-5-5`, effort `high`), les deux prompts (travail, et passe de sécurité en fin de chaîne), les verrous (anti-chevauchement par PID, quota, limite de session), le journal et le bilan de chaque passe. |
| `lib-reset.ps1` | Les fonctions partagées : lecture de la date de remise à zéro du quota, assemblage et **relecture du prompt avant envoi**, description de la chaîne, verrou par PID, drapeau de fin. |
| `epreuve-reset.ps1` | L'épreuve de `lib-reset.ps1` : `powershell -File .autonomie\epreuve-reset.ps1`. |
| `arret.ps1` | **Arrêter proprement** : coupe le wrapper puis `claude.exe`, pose l'arrêt volontaire. |
| `seuil-hebdo.txt` | Le seuil de pause automatique en % du quota hebdomadaire (**99**) ; 0 le désactive. |

## Les fichiers d'exécution (ignorés par git)

`journal.log` (tout ce qui s'est passé, passe par passe), `lock` (PID de la passe en cours),
`arret-volontaire.txt` (**sa présence bloque tout réveil**), `pause-hebdo.txt` et
`limite-hebdo.txt` (pause de quota en cours), `usage-cache.json`, `conso.csv`.

⚠️ Deux pièges déjà payés :
- **Ne pas surveiller `journal.log` avec `tail -f`** : sous Windows, cela verrouille le fichier et le
  wrapper écrit alors dans le vide, sans erreur visible.
- Les prompts sont des here-strings `@'…'@` qui **ne doivent contenir aucun guillemet droit** (la
  ligne de commande passée à `claude.exe` serait mal découpée) : vérifier avec le parseur
  PowerShell après toute modification.
