# Fautes relevees par la relecture adversariale — pages/vue/lecon-03.html

## 1. [bloquante] distracteur-inintelligible
**Question** : Quel est l'intérêt d'une computed par rapport à une simple m
**Constat** : Le distracteur « Cette méthode garde son résultat en cache : Vue ne la rappelle plus tant que ses sources restent les mêmes, alors qu'une computed se recalcule pour chaque rendu — le cache sert donc aux méthodes et cette computed au calcul » se clôt sur une clause vide de sens (« le cache sert donc aux méthodes et cette computed au calcul ») et s'ouvre sur un démonstratif sans antécédent (« Cette méthode »).
**Correction proposee** : Remplacer par : « C'est la méthode qui est mise en cache : Vue ne la rappelle que si ses sources changent, alors qu'une computed est réévaluée à chaque rendu ».

## 2. [bloquante] distracteur-inintelligible
**Question** : Quel est l'intérêt d'une computed par rapport à une simple m
**Constat** : Le distracteur « La computed sert à lancer un effet de bord : elle écrit dans le stockage dès que ses sources changent, alors qu'une méthode ne rend qu'une donnée déjà produite — le cache tient donc au stockage et l'intention du code s'y lit bien » finit sur une salade de mots : « le cache tient donc au stockage et l'intention du code s'y lit bien » n'énonce rien, et le pronom « s'y » n'a pas d'antécédent.
**Correction proposee** : Remplacer par : « La computed sert à déclencher un effet de bord (écrire dans le localStorage, appeler une API) quand ses sources changent, alors qu'une méthode se contente de renvoyer une valeur ».

## 3. [bloquante] distracteur-inintelligible
**Question** : Quel est l'intérêt d'une computed par rapport à une simple m
**Constat** : Le distracteur « La computed se modifie à la main comme une ref : on lui donne un total que Vue garde et propage, alors qu'une méthode ne se modifie pas dans le template — ce total calculé garde ses sources en cache et rend tout le recalcul plus direct et lisible » est incompréhensible : « ce total calculé garde ses sources en cache » inverse le mécanisme (c'est le résultat qui est mis en cache, pas les sources) et « rend tout le recalcul plus direct » ne veut rien dire.
**Correction proposee** : Remplacer par : « La computed s'écrit à la main comme une ref : on lui affecte directement un total, que Vue conserve ensuite, alors qu'une méthode est en lecture seule ».

## 4. [serieuse] distracteur-inintelligible
**Question** : Avec une ref en Vue, quand écrit-on .value et quand ne l'écr
**Constat** : Dans « Dans le TEMPLATE, .value lit/écrit le nombre (compteur.value++) ; une chaîne réactive se déballe automatiquement, sans .value (au SCRIPT) », la règle inventée dépendrait du TYPE de la donnée (nombre contre chaîne), et la parenthèse finale « (au SCRIPT) » contredit le sujet de la phrase, qui parlait du template : l'erreur n'est pas nommable en une phrase.
**Correction proposee** : Remplacer par : « Dans le TEMPLATE, on écrit .value (ex. {{ compteur.value }}) ; dans le SCRIPT, Vue déballe la ref tout seul, on écrit directement compteur++ ».

## 5. [mineure] distracteur-inintelligible
**Question** : Que fait v-model sur un champ de formulaire ?
**Constat** : Dans « Il valide le champ à chaque frappe : la validation tient la donnée à jour, et le code lit un texte déjà tout prêt », la seconde proposition (« le code lit un texte déjà tout prêt ») est un remplissage sans contenu vérifiable ; seule la première moitié énonce une thèse.
**Correction proposee** : Remplacer par : « Il valide le champ à chaque frappe et n'enregistre la saisie dans la donnée que si elle est jugée valide ».
