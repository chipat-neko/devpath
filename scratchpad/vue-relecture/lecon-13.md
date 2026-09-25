# Fautes relevees par la relecture adversariale — pages/vue/lecon-13.html

## 1. [bloquante] distracteur-inintelligible
**Question** : Que signifie « tester le comportement plutot que l'implementa
**Constat** : "Lire les variables internes du composant monte, pour des tests tres precis, meme si le wrapper ne verifie pas le montage ni le clic reel" : la concessive n'a aucune logique — un wrapper ne « verifie » rien (c'est expect qui verifie), et « ne verifie pas le montage » contredit le corps, qui dit que mount « monte reellement un composant ».
**Correction proposee** : « Lire les variables internes du composant monte, parce qu'elles seules donnent un test vraiment precis. »

## 2. [serieuse] distracteur-inintelligible
**Question** : Que renvoie la fonction mount de Vue Test Utils ?
**Constat** : "Les variables du script : le compteur (valeur), la saisie (message), a lire et a modifier sans inspecter" : « a lire et a modifier sans inspecter » n'a pas de complement (inspecter quoi ?), et « la saisie (message) » invente un champ de saisie absent du composant Compteur de la page, qui n'a qu'un bouton.
**Correction proposee** : « Les variables du script, comme le compteur n, que le test peut alors lire et modifier directement. »

## 3. [serieuse] distracteur-inintelligible
**Question** : Que signifie « tester le comportement plutot que l'implementa
**Constat** : "Refactoriser les tests des que le code bouge, pour couvrir la structure exacte du wrapper monte, non son contrat de sortie" : « la structure exacte du wrapper » ne designe rien — le wrapper est une poignee, il n'a pas de structure a couvrir ; la page parle, elle, de « la structure exacte du HTML ».
**Correction proposee** : « Reecrire les tests a chaque refonte, pour qu'ils collent a la structure exacte du HTML rendu. »

## 4. [serieuse] distracteur-inintelligible
**Question** : Que renvoie la fonction mount de Vue Test Utils ?
**Constat** : "Le composant monte : ses variables (props, entrees) et ses sorties (emitted), a modifier" : l'apposition finale « a modifier » pend (on ne modifie pas des « sorties ») et « (props, entrees) » est une glose de remplissage qui ne distingue rien.
**Correction proposee** : « L'instance du composant elle-meme, sur laquelle le test appelle directement ses methodes. »

## 5. [serieuse] distracteur-inintelligible
**Question** : Comment verifie-t-on qu'un composant a emis l'evenement « val
**Constat** : "Dans le rendu (wrapper.text), qui affiche valider et ses variables" : le possessif « ses variables » n'a pas d'antecedent — ni l'evenement valider ni le rendu n'ont de « variables » — et « qui affiche valider » laisse le nom d'evenement nu, sans guillemets ni code.
**Correction proposee** : « Dans le texte rendu : wrapper.text() contient le nom de chaque evenement emis. »

## 6. [serieuse] distracteur-inintelligible
**Question** : Pourquoi ecrire await devant wrapper.find('button').trigger('
**Constat** : "Pour un controle du clic : await le rend asynchrone, donc sur" : la conclusion « donc sur » est vide (sur de quoi ?) et le pronom « le » est ambigu (le clic ? le trigger ?). L'option ne porte aucune these verifiable.
**Correction proposee** : « Parce que await transforme le clic en action asynchrone, ce que trigger exige. »

## 7. [mineure] version-invérifiable
**Question** : Pourquoi ecrire await devant wrapper.find('button').trigger('
**Constat** : "Pour un retard : sans await, le clic du bouton part trop tot et le DOM de Vue se met a jour une fois sur deux" : la logique est inversee (ce n'est pas le clic qui part trop tot, c'est l'assertion qui arrive trop tot), et « une fois sur deux » est un chiffre de comportement que la page n'ecrit pas et que rien ici ne permet de verifier.
**Correction proposee** : « Parce que sans await, l'environnement de test perd un clic sur deux avant le rendu. »
