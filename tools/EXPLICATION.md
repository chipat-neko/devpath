# tools/ — les outils du projet (hors site)

Rien ici n'est chargé par le site : ce sont les outils qui **vérifient**, **mesurent** et
**génèrent** son contenu. Ils tournent avec Node, sans dépendance installée (Chrome est piloté
directement pour les mesures de rendu).

## Les points d'entrée

| Commande | Rôle |
|---|---|
| `node tools/verif.js --rapide` | **La chaîne de vérification** : 53 étapes, environ 4 minutes. Autres modes : sans argument, `--complet` (plusieurs heures), `--strict`, `--mutations`, `--lister`. |
| `node tools/verif-html.js` | Balises créées par erreur dans les blocs de code des leçons (doit rester à 0). |
| `node tools/verif-donnees.js` | Les invariants de données : `js/data.js`, leçons déclarées contre fichiers réels, index, doublons de QCM. |
| `node tools/verif-rendu.js` | Ce que le navigateur affiche : débordement, contraste, focus clavier, aria, console (pilote Chrome ; `CHROME_PATH` si Chrome n'est pas au chemin standard). |
| `node tools/build-index.js` | Régénère les index de `js/` (comparaison par défaut, `--write` pour écrire, `--only=quiz,…`). |
| `node tools/mesures-prompt.js` | Les chiffres du site mesurés (cours, leçons, parcours, langages). |
| `node tools/usage-anthropic.js etat` | Le quota Claude réellement consommé (hebdomadaire et fenêtre de 5 h). |
| `powershell -File tools/sante-autonomie.ps1` | Diagnostic de l'autonomie ; réécrit `en-cours/ETAT-AUTONOMIE.md` (lancé chaque heure par la tâche `Syntaxe-Sante`). |

## Les familles de fichiers (à la racine de `tools/`)

- **`verif-*.js`** (47) : les vérificateurs. **Chacun doit être lancé par un mode de `verif.js`,
  ou déclaré dans `hors-chaine.json` avec sa raison** — sinon le garde-fou (`recense-chaine.js`,
  étape `gardech`) échoue. Un outil qu'on doit penser à lancer ne protège rien.
- **`mesure-*.js`** (15) : les mesures, dont `mesure-biais-qcm.js` et ses **44 stratégies de
  devinette** des QCM (le cœur du point B4 du chantier V16), `mesure-lexique-qcm.js`,
  `mesure-mot-fetiche.js`, `mesure-tics-lot.js`, `plan-rangs-qcm.js`…
- **`build-*.js`** (7) : les générateurs d'index et de livrables (`build-starter-zip.ps1` écrit le
  kit dans `sorties/`).
- **`wf-*.js`** (34) : les scripts d'orchestration multi-agents qui ont **rédigé** les cours
  (historiques, gardés pour la méthode).

## Les sous-dossiers

| Dossier | Contenu |
|---|---|
| `content/` | Le contenu source des cours de langages, un dossier par langage. |
| `specs/`, `specs-full/` | Les spécifications JSON de cours de langages générés (nom du langage, coloration Prism, dossier de sortie, fiches des leçons). |
| `doc/` | Le générateur et les vérificateurs du cours `doc` (spécification publiée, vocabulaire). |
| `maths/` | Les modules et les preuves du cours de mathématiques. |
| `etudes/` | Les études de cas (`pages/etude-*.html`) et leurs assembleurs : une page d'étude doit être celle que son assembleur produit. |
| `fraicheur/` | Les marques de fraîcheur des cours qui vieillissent (convention dans `CONVENTION.md`). |
| `preuves/` | Les épreuves : ce qui prouve qu'un comportement tient (exercices, décodeur d'erreurs, Git…). |
| `lib/` | Le code partagé (pilotage de Chrome, profil, lots de leçons). |
| `anciens/` | Des scripts retirés, gardés pour mémoire (`verif-lecon.js` est **neutralisé** : il refuse de tourner). |
| `sorties/`, `shots/`, `scratchpad/` | Sorties régénérables et brouillons : **ignorés par git**. |

⚠️ Après toute modification de `tools/`, revérifier qu'aucune URL vers un CDN n'a été
réintroduite : le piège s'est déjà présenté trois fois.
