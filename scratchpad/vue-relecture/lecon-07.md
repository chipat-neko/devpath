# Fautes relevees par la relecture adversariale — pages/vue/lecon-07.html

## 1. [serieuse] distracteur-vrai
**Question** : Quel est un piège de réactivité courant à éviter ?
**Constat** : Le 2e distracteur — « Utiliser .value dans le template, où Vue affiche la valeur dépaquetée (rendu cassé) » — énonce une erreur bien réelle, que la page elle-même désigne comme telle : « on lit/écrit sa valeur via .value dans le script (mais pas dans le template, où elle est dépaquetée) », et l'explain de la question le confirme encore : « Avec ref, on accède à .value dans le script (pas dans le template) ». La question a donc deux réponses défendables.
**Correction proposee** : Remplacer par : « Appeler .value sur une ref à l'intérieur d'un computed, ce qui crée une dépendance circulaire et fige le calcul »

## 2. [serieuse] distracteur-inintelligible
**Question** : Quel est un piège de réactivité courant à éviter ?
**Constat** : Le 4e distracteur — « Privilégier une ref dans le script, là où reactive manipule mieux l'objet (ce qui perd tout) » — n'énonce aucune thèse identifiable : « là où reactive manipule mieux l'objet » compare sans comparant, et « (ce qui perd tout) » n'a pas d'objet (perd quoi ?).
**Correction proposee** : Remplacer par : « Créer une ref à l'intérieur d'une fonction appelée hors du setup, ce qui empêche Vue de la suivre »

## 3. [serieuse] distracteur-inintelligible
**Question** : Qu'est-ce qu'un composable en Vue ?
**Constat** : Le 4e distracteur — « Une source de données (soit la réutilisation d'un état réactif entre plusieurs composants), donc lisible par chacun » — est une salade : une « source de données » qui serait « la réutilisation d'un état », puis un « donc lisible par chacun » dont le sujet est introuvable.
**Correction proposee** : Remplacer par : « Un module qui expose un état réactif unique, partagé par tous les composants qui l'importent, à la manière d'un petit store »

## 4. [serieuse] distracteur-inintelligible
**Question** : Quel est l'intérêt principal de la Composition API par rapp
**Constat** : Le 4e distracteur — « Écarter le .value du script (Vue peut rendre l'état tout de suite sans éparpiller la logique de methods/computed), ce qui facilite la réutilisation d'un même état d'un bout à l'autre » — enchaîne trois idées sans lien : la parenthèse ne justifie pas la thèse (« rendre l'état tout de suite » n'a rien à voir avec .value), et « d'un bout à l'autre » ne désigne rien.
**Correction proposee** : Remplacer par : « Supprimer le besoin de .value dans le script, puisque Vue déballe lui-même les refs déclarées dans script setup, ce qui rend le code plus court qu'avec data et methods »

## 5. [mineure] francais-fautif
**Question** : À quoi sert computed dans la Composition API ?
**Constat** : Le 3e distracteur écrit « recalculée automatiquement par chaque rendu du template réactif » : la préposition est fautive (« à chaque rendu », non « par chaque rendu »), et « le template réactif » déplace l'adjectif sur le mauvais mot.
**Correction proposee** : Remplacer par : « À définir une valeur calculée, recalculée à chaque rendu du template, que ses sources aient changé ou non »

## 6. [mineure] francais-fautif
**Question** : Quel est un piège de réactivité courant à éviter ?
**Constat** : Le 3e distracteur écrit « (ce qui perd le réactif) » : « le réactif » n'est pas un substantif en français ; il faut « la réactivité ». La formulation « Passer les refs dans le composable » ne dit pas non plus d'où les refs viennent, alors que le corps parle de composables « qui retournent les refs ».
**Correction proposee** : Remplacer par : « Faire retourner à un composable ses refs plutôt que des valeurs brutes, ce qui casse la réactivité »

## 7. [mineure] distracteur-inintelligible
**Question** : Quel est l'intérêt principal de la Composition API par rapp
**Constat** : La parenthèse du 2e distracteur n'est pas une justification mais un remplissage : « Vue peut exécuter moins de code à chaque fois que la logique d'une fonctionnalité tient dans un bloc » — le fait de regrouper du code dans un bloc n'a aucun rapport avec la quantité de code exécutée.
**Correction proposee** : Remplacer par : « Accélérer le rendu des composants, car Vue compile le bloc script setup en une seule fonction et évite le coût des options data, methods et computed »
