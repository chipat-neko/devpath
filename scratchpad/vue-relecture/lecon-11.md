# Fautes relevees par la relecture adversariale — pages/vue/lecon-11.html

## 1. [bloquante] distracteur-inintelligible
**Question** : Quel type de valeur v-model dépose-t-il dans l'état selon
**Constat** : L'option 3 n'est pas une phrase : « La case à cocher ou la liste saisie à l'écran, un objet du DOM, que le script doit ouvrir pour y lire le booléen » — aucun verbe principal, « la liste saisie à l'écran » ne veut rien dire, et on ne peut nommer aucune erreur en une phrase.
**Correction proposee** : Remplacer par : « L'élément du DOM lui-même : v-model dépose le noeud input dans l'état, et le script lit ensuite sa propriété value ou checked. »

## 2. [bloquante] distracteur-inintelligible
**Question** : Comment n'afficher un message d'erreur qu'après une saisie
**Constat** : L'option 3 : « Le bouton désactivé : ce texte rouge reste DISCRET » — « ce texte rouge » n'a aucun antécédent, et « rester discret » n'est pas une réponse à « comment n'afficher l'erreur qu'après une saisie ».
**Correction proposee** : Remplacer par : « L'attribut :disabled sur le bouton : tant que le formulaire est invalide, Vue masque aussi les messages d'erreur du formulaire. »

## 3. [bloquante] distracteur-inintelligible
**Question** : Comment n'afficher un message d'erreur qu'après une saisie
**Constat** : L'option 2 : « Le test "!valide" seul : ce formulaire attend DÉJÀ un choix » — « ce formulaire attend déjà un choix » n'a aucun rapport avec le test proposé ; la subordonnée ne justifie rien.
**Correction proposee** : Remplacer par : « Le test "!valide" seul : tant que le champ est vide, la règle computed renvoie true, donc aucun message ne s'affiche. »

## 4. [serieuse] distracteur-inintelligible
**Question** : Quel type de valeur v-model dépose-t-il dans l'état selon
**Constat** : L'option 2 se contredit elle-même : « Une chaîne partout, même pour une case à cocher ou pour un select, le booléen obtenu reste une simple donnée réactive » — si c'est « une chaîne partout », il n'y a pas de « booléen obtenu » ; la fin est un remplissage incohérent.
**Correction proposee** : Remplacer par : « Une chaîne partout, y compris pour une case à cocher, qui dépose "true" ou "false" sous forme de texte dans l'état. »

## 5. [serieuse] distracteur-inintelligible
**Question** : La validation faite dans le navigateur suffit-elle à sécur
**Constat** : L'option 4 : « Oui : les suffixes .trim et .number nettoient toujours la saisie ; aucun pseudo ne reste » — « aucun pseudo ne reste » n'a aucun antécédent ni aucun sens (le mot « pseudo » vient d'un exemple sans rapport de la page).
**Correction proposee** : Remplacer par : « Oui : les modificateurs .trim et .number assainissent la saisie avant l'envoi, donc aucune donnée malformée n'atteint le serveur. »

## 6. [mineure] distracteur-inintelligible
**Question** : Quel type de valeur v-model dépose-t-il dans l'état selon
**Constat** : L'option 4 : « Un objet qui combine chaque saisie et sa clé, remis d'un coup au moment de l'envoi vers le serveur, avec le booléen de la case à cocher » — la queue « avec le booléen de la case à cocher » est plaquée et contredit l'idée d'un envoi groupé au serveur.
**Correction proposee** : Remplacer par : « Un objet unique qui regroupe toutes les saisies du formulaire par leur nom, constitué seulement au moment de l'envoi. »

## 7. [mineure] distracteur-inintelligible
**Question** : Pourquoi ajouter .number à v-model sur un champ de nombre
**Constat** : L'option 2 : « … ; .number garde seulement un nombre correct » — « un nombre correct » n'est défini par rien dans la page ; la seconde proposition n'ajoute aucune thèse nommable à la première.
**Correction proposee** : Remplacer par : « Parce que le champ bloque alors chaque frappe hors chiffre ; .number refuse les caractères non numériques à la saisie. »
