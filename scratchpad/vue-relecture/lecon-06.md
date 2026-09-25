# Fautes relevees par la relecture adversariale — pages/vue/lecon-06.html

## 1. [serieuse] distracteur-inintelligible
**Question** : Quelle est la différence entre la Composition API et l'Optio
**Constat** : Le distracteur « Deux outils rivaux : la Composition API (un compteur, une page) laisse le navigateur monter un seul style à la fois ; l'Options API (le style ancien) devient ingérable dès qu'un import utilise ref, et tout le code doit alors changer, ligne après ligne » est incompréhensible : « laisse le navigateur monter un seul style à la fois » et la parenthèse « (un compteur, une page) » ne renvoient à rien.
**Correction proposee** : Remplacer par : « Deux API incompatibles : une application doit choisir l'une ou l'autre, car <script setup> et l'objet export default ne peuvent pas cohabiter dans un même projet ».

## 2. [serieuse] distracteur-inintelligible
**Question** : Quelle est la différence entre la Composition API et l'Optio
**Constat** : Dans « Deux façons inégales : la Composition API (computed, watch) produit seule la donnée réactive ; l'Options API (data et events) laisse tout ce rôle au template, et le développement se fait alors à la main, sans gestion automatique », « laisse tout ce rôle au template » ne veut rien dire, et « (data et events) » nomme une option qui n'existe pas dans la page (elle cite data, methods, computed).
**Correction proposee** : Remplacer par : « Deux façons inégales : seule la Composition API rend les données réactives (ref, computed) ; avec l'Options API (data, methods), il faut remettre le template à jour à la main après chaque changement ».

## 3. [mineure] distracteur-inintelligible
**Question** : Quel problème résout Pinia ?
**Constat** : Dans « La liaison des URL : un magasin unique associe les chemins aux composants à monter, et la navigation change l'affichage de la page (les routes du store) », la parenthèse finale « (les routes du store) » est un ajout de remplissage sans référent.
**Correction proposee** : Remplacer par : « La liaison des URL : un magasin unique associe chaque chemin au composant à afficher, et la navigation change le contenu de la page sans rechargement ».

## 4. [mineure] distracteur-inintelligible
**Question** : Quel problème résout Pinia ?
**Constat** : « Le départ du projet : la commande officielle propose la configuration des composants, puis ajoute ESLint (npm create vue@latest) » : « la configuration des composants » ne correspond à rien dans la page, qui écrit « avec options pour Router, Pinia, TypeScript, tests ».
**Correction proposee** : Remplacer par : « Le départ du projet : la commande officielle crée la structure du projet et propose d'ajouter Router, ESLint et des tests (npm create vue@latest) ».

## 5. [mineure] francais-fautif
**Question** : À quoi sert Vue Router ?
**Constat** : Deux options rompent la construction ouverte par « À quoi sert… » : « À chercher au serveur la page complète par chemin, l'affichage précédent se vide (rechargement total), et le bouton retour du navigateur sort de cette application » et « À produire le rendu côté serveur pour la recherche, une brique génère un site complet… » — l'infinitif est abandonné au profit d'une proposition indépendante (anacoluthe).
**Correction proposee** : Garder l'infinitif partout : « À demander au serveur la page complète à chaque chemin, donc à vider l'affichage précédent (rechargement total) et à faire sortir le bouton retour de l'application » ; « À produire le rendu côté serveur pour le référencement et à générer un site complet avec un routage automatique (méta-framework) ».
