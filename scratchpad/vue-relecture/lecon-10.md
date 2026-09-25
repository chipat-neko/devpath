# Fautes relevees par la relecture adversariale — pages/vue/lecon-10.html

## 1. [bloquante] distracteur-inintelligible
**Question** : Comment changer de page depuis le code, après une action r
**Constat** : L'option 2 : « useRouter().back() ('/merci') » — cette écriture n'existe pas : back() ne prend pas d'argument, et la parenthèse « ('/merci') » collée derrière l'appel ne signifie rien.
**Correction proposee** : Remplacer par : « useRouter().back() ramène à la page /merci précédemment visitée »

## 2. [serieuse] distracteur-inintelligible
**Question** : Que fait une garde router.beforeEach qui renvoie '/connexi
**Constat** : L'option 3 : « Elle annule le changement et laisse l'écran sur /connexion (zone privée sans retour) » — la logique ne tient pas : si la garde annule le changement, l'écran reste sur la page courante, pas sur /connexion ; et « (zone privée sans retour) » est un remplissage sans antécédent.
**Correction proposee** : Remplacer par : « Elle annule la navigation et laisse l'écran sur la page courante, exactement comme si la garde avait renvoyé false. »

## 3. [serieuse] distracteur-inintelligible
**Question** : Pour l'URL /produit/42 avec la route path: '/produit/:id',
**Constat** : L'option 2 : « params.id visible (vaut « 42 ») » — « params.id visible » n'est ni du code ni une phrase ; on ne peut nommer aucune erreur. Pire, comme la valeur est bien dans params.id, l'option frôle la bonne réponse amputée de useRoute().
**Correction proposee** : Remplacer par : « this.params.id, injecté dans le composant (vaut « 42 ») »

## 4. [mineure] francais-fautif
**Question** : À quoi sert le composant <RouterView> ?
**Constat** : L'option 2 écrit « change l'URL sans recharger le composant » alors que le corps de la leçon dit « il change l'URL sans recharger la page » : « recharger le composant » ne veut rien dire ici.
**Correction proposee** : Écrire : « Il remplace la balise <a> du gabarit et change l'URL sans recharger la page »

## 5. [mineure] distracteur-inintelligible
**Question** : Comment changer de page depuis le code, après une action r
**Constat** : L'option 4 : « le path seul ('/merci') » — fragment nominal sans verbe ; on ne sait pas ce qu'on est censé faire du « path seul ».
**Correction proposee** : Remplacer par : « affecter le chemin à route.path ('/merci') »

## 6. [mineure] distracteur-inintelligible
**Question** : Que fait une garde router.beforeEach qui renvoie '/connexi
**Constat** : Les parenthèses des options 2 et 4 sont du remplissage sans antécédent : « (un test lancé après tout l'affichage) » et « (un retour visible à l'écran) » — de quel « test » et de quel « retour » parle-t-on ?
**Correction proposee** : Supprimer les parenthèses et garder la thèse seule : « Elle affiche la vue, puis redirige vers /connexion une fois le rendu terminé » et « Elle demande au navigateur de charger /connexion, ce qui recharge toute l'application »
