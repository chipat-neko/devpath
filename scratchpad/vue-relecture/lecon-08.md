# Fautes relevees par la relecture adversariale — pages/vue/lecon-08.html

## 1. [serieuse] distracteur-vrai
**Question** : Quel problème provide/inject résout-il ?
**Constat** : Le 4e distracteur — « Le « couplage explicite » : passer une donnée à un descendant avec un lien déclaré dans chaque composant » — décrit mot pour mot le prop drilling (la donnée descend, déclarée à chaque niveau), c'est-à-dire le problème même que provide/inject résout et que la bonne réponse (index 0) énonce. Le seul écart est l'étiquette entre guillemets ; l'exercice 2 de la page confirme d'ailleurs que le lien par props est le couplage explicite, provide/inject étant l'implicite.
**Correction proposee** : Remplacer par : « Le « couplage explicite » : deux composants frères qui doivent partager un état sans passer par leur parent commun »

## 2. [serieuse] distracteur-inintelligible
**Question** : Dans quel cas utiliser Teleport ?
**Constat** : Le 4e distracteur empile trois repères temporels vides : « Pour charger un contenu plus tard (modale, info-bulle), à un moment donné par la suite (ex. dans une page qui tarde), en gardant un chargement allégé » — « à un moment donné par la suite » ne dit rien de plus que « plus tard », et « une page qui tarde » n'a aucun sens.
**Correction proposee** : Remplacer par : « Pour différer le rendu d'un contenu lourd (modale, info-bulle) jusqu'à ce que l'utilisateur l'ouvre, afin d'alléger le premier affichage de la page »

## 3. [mineure] distracteur-inintelligible
**Question** : À quoi servent les slots en Vue ?
**Constat** : Le 4e distracteur se termine par une énumération incohérente : « À styler le composant enfant à insérer, rendant le parent libre de modifier sa bordure ou sa couleur (padding, contrôle) » — « contrôle » n'est pas une propriété de style, et « le composant enfant à insérer » laisse le lieu d'insertion indéterminé.
**Correction proposee** : Remplacer par : « À exposer le style interne d'un composant enfant, pour que le parent puisse en modifier la bordure et les couleurs depuis sa propre feuille »

## 4. [mineure] distracteur-inintelligible
**Question** : Dans quel cas utiliser Teleport ?
**Constat** : Le 3e distracteur contient une parenthèse de remplissage sans référent : « à un z-index plus fort (ex. dans un contexte) » — un z-index « dans un contexte » ne désigne rien de précis, alors que le corps de la leçon parle bien de « contextes d'empilement ».
**Correction proposee** : Remplacer par : « Pour placer l'élément au-dessus de la page (modale, info-bulle) en lui appliquant automatiquement le plus haut z-index de l'application, sans déplacer son rendu dans le DOM »

## 5. [mineure] distracteur-vrai
**Question** : À quoi sert defineAsyncComponent ?
**Constat** : Le 2e distracteur — « À réduire le code total du projet (lazy-loading) : son composant n'est plus chargé du tout au moment du démarrage » — utilise « son » sans antécédent (le « son » recopie celui de la bonne réponse), et sa seconde moitié est exactement vraie : le composant n'est effectivement pas chargé au démarrage. Seule la thèse initiale est fausse.
**Correction proposee** : Remplacer par : « À réduire le poids total du projet (lazy-loading) : le code du composant est retiré du build tant qu'aucune page ne l'affiche »
