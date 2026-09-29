# starter/ — le kit de démarrage

Une copie **minimale et réutilisable** du système Syntaxe (une page d'accueil, un cours d'exemple,
le CSS et le JavaScript de base) pour lancer un autre site de cours sur le même modèle. Ce n'est
pas le site : rien ici n'est chargé par `index.html`.

- **`README.md`** explique comment l'utiliser, pas à pas.
- **`cron.md`** décrit la méthode du cron : faire avancer un gros chantier tout seul, étape par
  étape, comme l'autonomie le fait pour Syntaxe.
- Le détail de chaque réglage est dans `docs/reference/paramettre.md`.
- Le kit se distribue en zip : `powershell -File tools/build-starter-zip.ps1` le régénère dans
  `tools/sorties/starter-kit.zip`. **À relancer après toute modification de ce dossier**, sinon le
  zip se périme sans rien dire.

⚠️ Après une modification ici, revérifier qu'aucune URL vers un CDN n'a été réintroduite.
