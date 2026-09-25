# Fautes relevees par la relecture adversariale — pages/vue/lecon-09.html

## 1. [bloquante] distracteur-inintelligible
**Question** : Pourquoi éviter de placer v-if et v-for sur le même élémen
**Constat** : Le 4e distracteur est une suite de démonstratifs sans antécédent : « v-for garde cette key stable sur ce même élément, et ce duo est alors rentable ; v-if écarte ensuite ces entrées masquées tour à tour, donc leur filtre reste facultatif, voire nuisible pour cette mise à jour » — quelle key ? quelles entrées masquées ? quel filtre ? quelle mise à jour ? Impossible de nommer l'erreur en une phrase.
**Correction proposee** : Remplacer par : « Combiner v-if et v-for sur un même élément est recommandé dès que la liste dépasse quelques dizaines d'entrées : Vue met alors en cache les éléments masqués et le filtrage par un computed devient inutile »

## 2. [serieuse] version-invérifiable
**Question** : Pourquoi éviter de placer v-if et v-for sur le même élémen
**Constat** : La bonne réponse (index 0) affirme « v-for s'évalue pour chaque élément, même ceux que v-if masque », et l'explain répète « Sur un même élément, Vue parcourt toute la liste avant d'écarter des entrées avec v-if ». C'est la priorité de Vue 2 ; en Vue 3 — la version enseignée par tout le cours (script setup, Teleport, defineAsyncComponent) — c'est v-if qui a la priorité la plus haute sur v-for, si bien que la boucle n'est PAS parcourue et que la variable de boucle n'est même pas dans la portée de v-if. Le corps de la leçon, lui, n'écrit aucune priorité : il dit seulement « c'est ambigu et coûteux ».
**Correction proposee** : La bonne réponse étant intouchable, signaler au propriétaire du lot et rendre l'énoncé indépendant de la version : remplacer la justification par « la priorité entre les deux directives est implicite et a changé entre Vue 2 et Vue 3, ce qui rend le rendu difficile à prévoir ; mieux vaut filtrer la liste en amont dans un computed, puis boucler dessus », et corriger l'explain en conséquence (supprimer « Vue parcourt toute la liste avant d'écarter des entrées »).

## 3. [serieuse] distracteur-vrai
**Question** : Pourquoi éviter de placer v-if et v-for sur le même élémen
**Constat** : Le 3e distracteur s'ouvre sur « v-if s'évalue d'abord, sur le même élément » — ce qui est exactement le comportement de Vue 3 (v-if prioritaire sur v-for), donc vrai, et en contradiction directe avec la bonne réponse ; la suite est par ailleurs inintelligible : « cette directive assure le tri de la liste avant que v-for démarre ; seul le rendu retenu de l'entrée est parcouru, et le computed en amont reste vain » (un « tri » qui n'est pas un filtre, « le rendu retenu de l'entrée » sans antécédent).
**Correction proposee** : Remplacer par : « Vue réordonne automatiquement les deux directives pour ne boucler que sur les entrées visibles ; le rendu est donc déjà optimal, et extraire un computed déjà filtré n'apporte aucun gain »

## 4. [serieuse] distracteur-inintelligible
**Question** : Que produit le build de production (Vite) ?
**Constat** : Le 4e distracteur s'ouvre sur un comparant absent : « Un module identique (sans splitting), servi brut (peu élagué et peu minifié), en un fichier source unique et énorme » — identique à quoi ? Et « servi brut » comme « peu élagué et peu minifié » sont des remplissages qui empêchent de nommer l'erreur.
**Correction proposee** : Remplacer par : « Une copie du dossier source, recompilée à chaque requête par le serveur qui la sert, sans minification ni découpage »

## 5. [serieuse] distracteur-inintelligible
**Question** : Que produit le build de production (Vite) ?
**Constat** : Le 3e distracteur se termine par deux groupes nominaux posés sans verbe ni lien logique : « Un rendu serveur de chaque module (assuré par Nuxt), sans tree-shaking (morceaux visibles), référencement immédiat » — « (morceaux visibles) » ne veut rien dire et « référencement immédiat » flotte en fin de phrase.
**Correction proposee** : Remplacer par : « Un rendu HTML de chaque page, généré à l'avance par Nuxt pour le référencement, à la place des fichiers JavaScript »

## 6. [serieuse] distracteur-inintelligible
**Question** : Quand Pinia (état centralisé) est-il justifié ?
**Constat** : Le 4e distracteur — « ses getters (état/getters/actions) gardent une lecture recalculée et cohérente pour chaque écran du projet concerné » — accole à « ses getters » une parenthèse « (état/getters/actions) » qui ne s'y rapporte pas, et termine par un remplissage (« du projet concerné ») ; de plus la proposition est VRAIE (les getters d'un store sont bien recalculés et cohérents), ce qui ne laisse la fausseté que dans la première moitié.
**Correction proposee** : Remplacer par : « Sitôt qu'un état est lu par deux écrans, Pinia devient le bon outil — un store rend inutile tout ref local, puisqu'il héberge aussi l'état interne de chaque composant »

## 7. [mineure] distracteur-inintelligible
**Question** : Quand Pinia (état centralisé) est-il justifié ?
**Constat** : Le 2e distracteur justifie sa thèse par une phrase sans référent : « il évite de recréer un getter purement local dans chaque composant parent » — un menu déroulant n'a pas de getter, et « chaque composant parent » ne désigne rien. La parenthèse « (état/mutations) » emprunte en outre le vocabulaire de Vuex alors que la page et le glossaire parlent d'« état / getters / actions ».
**Correction proposee** : Remplacer par : « Un magasin central est justifié pour tout état, même l'ouverture d'un menu déroulant — centraliser rend l'application plus facile à déboguer que des refs éparpillées »

## 8. [mineure] distracteur-inintelligible
**Question** : Quel est le principal levier de performance perçue au démar
**Constat** : Le 3e distracteur se clôt sur un verbe sans complément : « Nuxt renvoie l'affichage initial (le navigateur n'a plus à télécharger) » — télécharger quoi ? La parenthèse ne dit rien de vérifiable.
**Correction proposee** : Remplacer par : « Le levier tient au rendu serveur : Nuxt renvoie le HTML initial, ce qui dispense l'application d'envoyer son JavaScript »

## 9. [mineure] distracteur-inintelligible
**Question** : Quel est le principal levier de performance perçue au démar
**Constat** : Le 2e distracteur — « splitting et tree-shaking ne gardent plus de composants morts (dossier élagué) » — parle de « composants morts » là où la page dit « code mort », et ajoute une parenthèse purement décorative, « (dossier élagué) », qui ne complète rien.
**Correction proposee** : Remplacer par : « Le levier est le build minifié : le tree-shaking retire le code mort, ce qui suffit à réduire le temps d'affichage initial »

## 10. [mineure] francais-fautif
**Question** : Que produit le build de production (Vite) ?
**Constat** : Le 2e distracteur se termine par un adjectif suspendu qui ne qualifie rien : « Un serveur rapide (mode permissif), lancé pour un aperçu du dossier source (sans fichiers optimisés), lisible ».
**Correction proposee** : Remplacer par : « Un serveur de développement rapide et permissif, qui sert le dossier source tel quel, sans minification ni découpage »
