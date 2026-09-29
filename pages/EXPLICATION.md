# pages/ — toutes les pages du site, hors accueil

**À la racine de ce dossier** : les pages transverses — catalogue, recherche, parcours,
progression, examen, révision, certificat, à propos… — et les **pages-outils** interactives
(bac à sable, console Python/SQL, Git, regex, JSON, couleurs, diff, visualiseur de pile,
décodeur d'erreurs…), plus les **fils rouges** (`fil-rouge-*.html`) et les **études de cas**
(`etude-*.html`).

**Un sous-dossier par cours** (94 dossiers) : `cours.html` présente le cours, `lecon-NN.html`
sont les leçons, dans l'ordre. Le dossier porte l'identifiant du cours, **sauf** JavaScript, dont
le dossier est `js/` et l'identifiant `javascript` dans `js/data.js` (piège connu pour les
durées). Les dossiers `*-avance/` sont d'anciens cours fusionnés : ils ne contiennent plus que des
pages de redirection vers les cours complets, gardées pour ne casser aucun lien.

Une leçon porte ses QCM et ses exercices dans des blocs JSON (`data-quiz`, `data-exos`,
`data-quiz-bilan` sur la dernière leçon) : ils doivent rester du JSON valide.

⚠️ **Ne jamais corriger le mojibake** de `formats/lecon-06.html`, `html/lecon-15.html`,
`r/lecon-06.html` et `perl/lecon-13.html` : ces leçons enseignent l'encodage et montrent un texte
mal décodé **exprès**.

Contrôles : `node tools/verif-html.js` (balises cassées dans le code source des leçons) et
`node tools/verif-donnees.js` (chaque leçon déclarée existe, chaque leçon présente est déclarée).
