# Fautes relevees par la relecture adversariale — pages/vue/lecon-05.html

## 1. [serieuse] distracteur-inintelligible
**Question** : Quand utilise-t-on watch plutôt que computed ?
**Constat** : Le distracteur « watch quand la donnée tient en cache (total, filtre) ; computed quand le calcul déclenche une valeur (frappe, clic) sans vérification » ne formule aucune thèse : « la donnée tient en cache », « le calcul déclenche une valeur » et « sans vérification » sont des mots assemblés, pas une inversion lisible de la bonne réponse.
**Correction proposee** : Remplacer par : « watch quand on veut une valeur dérivée mise en cache (un total, un filtre) ; computed quand on veut déclencher un appel réseau à chaque changement ».

## 2. [serieuse] distracteur-inintelligible
**Question** : À quoi sert le hook onMounted dans un composant Vue ?
**Constat** : Dans « À lancer du code avant que Vue ajoute le composant dans le DOM (juste avant le montage) — le gestionnaire du formulaire existe déjà pendant que le template reste vide », la seconde partie parle d'un « gestionnaire du formulaire » qui n'existe ni dans la question ni dans la leçon.
**Correction proposee** : Remplacer par : « À lancer du code avant que Vue insère le composant dans le DOM, juste avant le montage : le template est alors déjà rendu, mais pas encore attaché à la page ».

## 3. [serieuse] distracteur-inintelligible
**Question** : À quoi sert le hook onMounted dans un composant Vue ?
**Constat** : Dans « À relancer le code du composant dans le DOM après un changement de l'état (Vue le relance automatiquement) — la requête part donc une fois de plus à la saisie au clavier et le champ perd son texte », la chute « et le champ perd son texte » est une conséquence inventée, sans rapport avec un hook de cycle de vie.
**Correction proposee** : Remplacer par : « À réexécuter du code après chaque mise à jour de l'état du composant : Vue rappelle ce hook à chaque nouveau rendu, et pas seulement au premier ».

## 4. [mineure] distracteur-inintelligible
**Question** : Quand utilise-t-on watch plutôt que computed ?
**Constat** : Dans « watch quand une donnée change rarement (clic, entrée) ; computed quand elle change vite (le calcul déclenche, sans cache) et reste automatique », la parenthèse « (le calcul déclenche, sans cache) » est un verbe sans complément, et « reste automatique » n'a pas de sujet identifiable.
**Correction proposee** : Remplacer par : « watch quand la donnée change rarement (un clic, une validation) ; computed quand elle change à chaque frappe, car computed recalcule à chaque lecture sans passer par un cache ».

## 5. [mineure] francais-fautif
**Question** : Quand utilise-t-on watch plutôt que computed ?
**Constat** : Dans « watch quand la donnée vient du clavier dans un formulaire (un champ, une case) ; computed quand elle vient du serveur (réseau ou stockage), la requête déclenche la mise en cache », la dernière proposition est juxtaposée sans lien logique (virgule pour « parce que ») et énonce un mécanisme flou.
**Correction proposee** : Remplacer la fin par : « … ; computed quand elle vient du serveur (réseau ou stockage), parce que seule une valeur déjà chargée peut être mise en cache ».

## 6. [mineure] distracteur-inintelligible
**Question** : Comment un composant enfant fait-il remonter une informatio
**Constat** : Dans « Il surveille sa donnée (un événement part seul) ; le changement prévient aussitôt le parent », la parenthèse « (un événement part seul) » est du remplissage : rien ne dit d'où partirait cet événement.
**Correction proposee** : Remplacer par : « Il place un watch sur sa donnée ; Vue transmet alors automatiquement le changement au parent, qui n'a rien à écouter ».
