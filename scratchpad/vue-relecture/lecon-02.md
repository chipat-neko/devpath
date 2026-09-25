# Fautes relevees par la relecture adversariale — pages/vue/lecon-02.html

## 1. [serieuse] distracteur-vrai
**Question** : Quand utilise-t-on l'interpolation {{ }} et quand utilise-t-
**Constat** : Le distracteur « La moustache insère la valeur d'une DONNÉE ; :attribut (v-bind) affiche ce TEXTE de l'élément » commence par une affirmation EXACTE (la moustache insère bien la valeur d'une donnée, cf. le corps : « Vue remplace l'expression par sa valeur »), et sa seconde moitié, « affiche ce TEXTE de l'élément », utilise un démonstratif sans antécédent.
**Correction proposee** : Remplacer par : « La moustache {{ }} remplit les attributs HTML ; :attribut (v-bind) sert, lui, au contenu texte de l'élément ».

## 2. [serieuse] distracteur-inintelligible
**Question** : Quand utilise-t-on l'interpolation {{ }} et quand utilise-t-
**Constat** : Dans « :attribut (v-bind) recopie le TEXTE de l'expression dans l'attribut ; la moustache y met la valeur de la DONNÉE », le pronom « y » n'a pas d'antécédent utilisable (l'attribut ? l'expression ?) et les deux propositions se recouvrent : on ne peut pas nommer l'erreur en une phrase.
**Correction proposee** : Remplacer par : « :attribut (v-bind) insère la valeur de l'attribut comme texte littéral ; la moustache {{ }} évalue l'expression et la place dans l'attribut ».

## 3. [serieuse] distracteur-inintelligible
**Question** : Quand utilise-t-on l'interpolation {{ }} et quand utilise-t-
**Constat** : Dans « Le :attribut (v-bind) recopie la valeur de l'ATTRIBUT dans la DONNÉE ; il affiche l'expression en texte », le pronom « il » ne renvoie à rien de clair et les deux propositions prêtent au même outil deux comportements contradictoires.
**Correction proposee** : Remplacer par : « Le :attribut (v-bind) recopie la valeur de l'attribut HTML dans la donnée, et la moustache {{ }} ne fonctionne que dans les attributs ».

## 4. [bloquante] distracteur-inintelligible
**Question** : Quelle est la différence entre v-if et v-show ?
**Constat** : Le distracteur « v-if ajoute l'élément que v-show masque ou retire ; le DOM garde bien réellement le même affichage dans les deux cas (display:none) — v-if est préférable que la page bascule souvent ou rarement » ne veut rien dire : « l'élément que v-show masque ou retire » n'a pas de référent, « le même affichage dans les deux cas » contredit la proposition précédente, et la conclusion ne distingue plus rien.
**Correction proposee** : Remplacer par : « v-if et v-show font exactement la même chose : tous deux retirent l'élément du DOM, seul le nom de la directive change ».

## 5. [serieuse] distracteur-inintelligible
**Question** : Quelle est la différence entre v-if et v-show ?
**Constat** : Dans « v-if masque son affichage en CSS (display:none) et le garde de côté ; v-show retire réellement l'élément du DOM puis en ajoute un neuf — c'est donc bien v-show qui est préférable si la page bascule souvent », le « donc » ne suit pas de ses propres prémisses (une directive qui détruit puis recrée l'élément ne saurait être préférable pour des bascules fréquentes), et cette conclusion répète le conseil JUSTE de la bonne réponse ; « son affichage » et « le garde de côté » sont du remplissage.
**Correction proposee** : Remplacer par : « v-if masque l'élément en CSS (display:none) alors que v-show le retire du DOM ; v-if est donc préférable quand on bascule souvent l'affichage ».

## 6. [serieuse] distracteur-vrai
**Question** : Quelle est la différence entre v-if et v-show ?
**Constat** : Dans « v-show est préférable si l'affichage bascule rarement ; il garde la page et la masque en CSS pour de bon (display:none) — v-if ajoute ou retire réellement l'élément trop souvent », la proposition « v-if ajoute ou retire réellement l'élément » est exactement VRAIE (c'est la définition du corps de la leçon), tandis que « il garde la page », « pour de bon » et « trop souvent » sont du remplissage sans référent.
**Correction proposee** : Remplacer par : « v-show est préférable si l'affichage change rarement, car il détruit l'élément une fois pour toutes, alors que v-if se contente de lui appliquer display:none ».

## 7. [bloquante] distracteur-vrai
**Question** : Pourquoi faut-il fournir une :key unique avec v-for ?
**Constat** : Le distracteur « Pour que Vue suive l'index de la liste et trie chaque élément sur sa clé lors des mises à jour ; sans clé stable, elle réutilise mal le DOM et refuse de recréer intelligemment tout l'affichage » cumule une proposition VRAIE (« sans clé stable, elle réutilise mal le DOM », exactement ce que dit la bonne réponse) et une proposition vide de sens (« refuse de recréer intelligemment tout l'affichage »).
**Correction proposee** : Remplacer par : « Pour que Vue affiche les éléments dans l'ordre croissant des clés : sans :key, la liste apparaît dans un ordre aléatoire à chaque rendu ».

## 8. [bloquante] distracteur-inintelligible
**Question** : Pourquoi faut-il fournir une :key unique avec v-for ?
**Constat** : Le distracteur « Pour que Vue suive la liste et remplace tout élément ; sans clé stable, elle refuse les mises à jour et réutilise un affichage à bugs subtils sans même le recréer » est une salade de mots : « remplace tout élément », « refuse les mises à jour » et « réutilise un affichage à bugs subtils sans même le recréer » n'énoncent aucune erreur nommable.
**Correction proposee** : Remplacer par : « Pour que Vue recrée tous les nœuds de la liste à chaque changement : sans :key, elle conserve l'ancien DOM et ignore les nouvelles données ».

## 9. [bloquante] distracteur-inintelligible
**Question** : Pourquoi faut-il fournir une :key unique avec v-for ?
**Constat** : Dans « Pour que tout élément suive son rang dans l'index ; sans clé stable, Vue remplace l'affichage au lieu de le recréer et réutilise mal les mises à jour », l'opposition « remplace l'affichage au lieu de le recréer » ne distingue rien (remplacer et recréer désignent ici la même opération) et « réutilise mal les mises à jour » n'a pas de sens.
**Correction proposee** : Remplacer par : « Pour que chaque élément conserve sa position d'origine : sans :key, Vue réordonne la liste par ordre alphabétique à chaque mise à jour ».
