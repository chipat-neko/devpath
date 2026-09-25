# Fautes relevees par la relecture adversariale — pages/vue/lecon-04.html

## 1. [bloquante] distracteur-inintelligible
**Question** : Pourquoi un composant enfant ne doit-il pas modifier une pro
**Constat** : Le distracteur « Parce que Vue produit une erreur dure et coupe le rendu (sans délai) ; modifier une prop casserait la balise déjà posée, et la source de vérité du parent appartient alors au template (tout est perdu pour ce rendu) » est une salade de mots : « casserait la balise déjà posée », « la source de vérité du parent appartient alors au template » et « (tout est perdu pour ce rendu) » n'énoncent aucune thèse nommable.
**Correction proposee** : Remplacer par : « Parce que Vue interrompt le rendu du composant et affiche une erreur bloquante dans la console : une prop est gelée, et toute écriture dessus annule le rendu en cours du parent ».

## 2. [bloquante] distracteur-inintelligible
**Question** : Pourquoi un composant enfant ne doit-il pas modifier une pro
**Constat** : Le distracteur « Parce que le flux prévisible monte de la balise vers le parent (un seul sens) ; modifier une prop double la source du parent, et il relit ensuite sa propre donnée (un état à deux) » est inintelligible : « modifier une prop double la source du parent » et « (un état à deux) » ne désignent aucun mécanisme.
**Correction proposee** : Remplacer par : « Parce que les données remontent de l'enfant vers le parent : le parent relirait la valeur modifiée puis la renverrait à l'enfant, ce qui ferait boucler le rendu indéfiniment ».

## 3. [bloquante] distracteur-inintelligible
**Question** : Pourquoi un composant enfant ne doit-il pas modifier une pro
**Constat** : Le distracteur « Parce que modifier une prop coupe les événements que le parent reçoit (la remontée passe par la prop) ; elle sert de canal unique vers le haut, le parent y perd sa donnée source (le retour tombe) » finit sur « (le retour tombe) », qui ne veut rien dire ; avec les deux autres options, la question se tranche par « choisis la seule phrase qui a un sens ».
**Correction proposee** : Remplacer par : « Parce que la prop sert aussi de canal de remontée : une écriture dessus consomme l'événement que l'enfant aurait émis, et le parent ne reçoit plus rien ».

## 4. [serieuse] distracteur-inintelligible
**Question** : À quoi servent les props en Vue ?
**Constat** : Dans « À signaler un événement du composant enfant au composant parent, pour que le parent décide ensuite de ses différents boutons et de leur libellé déjà affiché », la subordonnée finale est du remplissage : « décide ensuite de ses différents boutons » et « leur libellé déjà affiché » n'ont aucun antécédent dans la question ni dans la page.
**Correction proposee** : Remplacer par : « À signaler un événement du composant enfant au composant parent, pour que le parent mette à jour sa donnée et la réaffiche dans son propre template ».

## 5. [mineure] distracteur-inintelligible
**Question** : À quoi servent les props en Vue ?
**Constat** : « À configurer le style du composant parent dans le composant enfant, pour qu'un même composant garde une variante propre à chaque page du site » inverse le sens sans le dire (on ne configure pas « le style du parent dans l'enfant ») et « garde une variante propre à chaque page » est vide.
**Correction proposee** : Remplacer par : « À appliquer au composant enfant les classes CSS définies dans le composant parent, pour qu'un même composant change d'apparence à chaque page du site ».
