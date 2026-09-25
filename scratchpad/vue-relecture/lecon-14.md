# Fautes relevees par la relecture adversariale — pages/vue/lecon-14.html

## 1. [bloquante] distracteur-inintelligible
**Question** : Quel composant anime l'ajout et le retrait d'elements d'une l
**Constat** : Les trois distracteurs du bilan sont des noms de composants inventes suivis d'un remplissage sans contenu : "<Fondu> (avec :key stable et une file de transitions lourdes)", "<Fade> (avec :key stable et des transform bien lentes)", "<Duo> (avec :key stable et mutations lentes)". Aucune erreur nommable : ni « une file de transitions lourdes », ni « des transform bien lentes », ni « mutations lentes » ne designent quoi que ce soit en Vue, et <Duo> n'existe pas.
**Correction proposee** : Remplacer par des composants Vue REELS mal employes : « <Transition> (avec :key stable), qui gere aussi une liste entiere », « <KeepAlive> (avec :key stable), qui anime les elements conserves », « <Teleport> (avec :key stable), qui anime les elements deplaces ».

## 2. [bloquante] distracteur-inintelligible
**Question** : Comment verifier qu'un composant a emis un evenement, dans un
**Constat** : Les trois distracteurs du bilan ne sont pas du francais et ne designent aucune API : "le trigger('nom') du wrapper au test", "console('nom') du resultat au test", "un parent montre('nom') au test" — « un parent montre('nom') » melange un verbe francais conjugue et une syntaxe d'appel, et « console('nom') du resultat » n'existe ni en JS ni dans la page.
**Correction proposee** : « wrapper.trigger('nom'), qui declenche puis enregistre l'evenement », « console.log(wrapper.vm.nom) pour lire l'evenement au passage », « un composant parent qui ecoute nom et compte les appels ».

## 3. [bloquante] distracteur-inintelligible
**Question** : Comment s'appelle le composant monofichier de Vue ?
**Constat** : Le distracteur "Un .json decrit (template entier)" n'est pas une phrase francaise : « Un .json decrit » n'a pas de complement et « (template entier) » ne se rattache a rien. Meme defaut, plus leger, sur "Un fichier .html qui porte le template (script)", ou la parenthese « (script) » pend.
**Correction proposee** : « Un fichier .json qui decrit le template et les donnees du composant » ; et pour l'autre : « Un fichier .html qui contient a la fois le template et son script ».

## 4. [bloquante] distracteur-inintelligible
**Question** : Pourquoi faire du store Pinia la source de verite de l'applic
**Constat** : "Pour un rendu bien plus vif : ce composant relit sans cesse ces donnees, plutot que leurs copies deja desynchronisees dans chaque vue en cours" : « ce composant » et « ces donnees » n'ont aucun antecedent (aucun composant n'est nomme dans l'enonce), « leurs copies » renvoie a des donnees qui ne sont pas les leurs, et « en cours » ne qualifie rien. S'y ajoute un gain de performance (« bien plus vif ») que la page n'ecrit nulle part, donc inverifiable.
**Correction proposee** : « Pour accelerer le rendu : lire un store central coute moins cher que recevoir la donnee en prop depuis le parent. »

## 5. [bloquante] distracteur-inintelligible
**Question** : Quelle est la difference entre un getter et une action dans u
**Constat** : "Un getter est une fonction (filtre) que le script appelle ; une action est sa valeur derivee en cache" : le possessif « sa » ne peut renvoyer qu'au getter, ce qui donne « une action est la valeur derivee du getter » — enonce qui ne veut rien dire. Une action est une fonction, jamais une valeur.
**Correction proposee** : « Un getter est une fonction qu'on appelle a la main a chaque lecture ; une action est mise en cache. »

## 6. [bloquante] distracteur-inintelligible
**Question** : Quelle est la difference entre un getter et une action dans u
**Constat** : "Un getter est un computed (lecture) sans cache ; une action est sa valeur stable" : meme defaut, aggrave — « sa valeur stable » ne renvoie a rien (ni le getter ni l'etat ne sont poses comme possesseur) et « valeur stable » n'est pas une notion du cours.
**Correction proposee** : « Un getter est un computed recalcule a chaque lecture ; une action memorise le resultat du calcul. »

## 7. [serieuse] distracteur-inintelligible
**Question** : Comment un composant LigneTache presentiel signale-t-il qu'on
**Constat** : "Il retire la ligne de son tableau local (sans action) ; le store ne montre pas la mutation de la liste" contredit le corps de la page, qui ecrit « LigneTache recoit une tache en prop » : LigneTache n'a pas de « tableau local », il n'a qu'UNE tache. Et « le store ne montre pas la mutation » n'a pas de sens : un store ne « montre » rien.
**Correction proposee** : « Il masque sa propre ligne avec un booleen local, sans jamais prevenir le store. »

## 8. [serieuse] distracteur-inintelligible
**Question** : Par quoi vaut-il mieux commencer pour concevoir une petite ap
**Constat** : "Par les tests : quel script, et quelles erreurs montrer ; les donnees passent plus tard" : « quel script » et « quelles erreurs montrer » ne decrivent aucune demarche de conception ; le groupe est calque sur la bonne reponse (« quel etat, et quelles actions ») sans que le calque veuille dire quoi que ce soit.
**Correction proposee** : « Par les tests : ecrire d'abord les assertions attendues ; l'etat et l'interface en decoulent. »

## 9. [serieuse] distracteur-inintelligible
**Question** : Pourquoi faire du store Pinia la source de verite de l'applic
**Constat** : "Pour qu'une donnee persiste : le module la detient apres ecriture, avec un composant qui la relit au debut de la vue courante" : « le module » n'a pas d'antecedent et « au debut de la vue courante » ne designe aucun moment identifiable. Pire, l'enonce est a moitie vrai (un store detient bien la donnee apres ecriture et un composant la relit) : la these est floue au lieu d'etre fausse.
**Correction proposee** : « Pour que les donnees survivent au rechargement de la page : un store Pinia les ecrit sur le disque. » — clairement faux, la page renvoyant la persistance a localStorage ou a une API.

## 10. [serieuse] autre
**Question** : Comment un composant LigneTache presentiel signale-t-il qu'on
**Constat** : "Il change le tableau du store a la main (hors des actions) ; le parent et la vue ne suivent pas" enseigne un fait FAUX sur Vue : muter directement store.taches depuis un composant declenche bel et bien la reactivite, donc la vue suit. Le distracteur n'est rejetable que pour une raison inexacte.
**Correction proposee** : « Il appelle store.taches.splice() depuis son script, en contournant les actions du store. » — faux comme reponse a « comment SIGNALE-t-il », sans affirmer a tort que la reactivite se casse.

## 11. [mineure] distracteur-inintelligible
**Question** : Par quoi vaut-il mieux commencer pour concevoir une petite ap
**Constat** : "Par le routeur : quel chemin, et quelles donnees montrer ; le rendu passe apres le composant pilote" : « le composant pilote » n'a pas d'antecedent, et « le rendu passe apres le composant » ne dit rien (le rendu EST le composant affiche).
**Correction proposee** : « Par le routeur : definir d'abord les URL et les vues ; l'etat et les composants suivent. »

## 12. [mineure] distracteur-inintelligible
**Question** : Pourquoi faire du store Pinia la source de verite de l'applic
**Constat** : "Pour une copie par composant : le composant copie les donnees d'un espace central dans son script, avec un suivi fait a la main" : l'amorce presente comme un OBJECTIF ce que la bonne reponse pose comme le defaut evite, et « avec un suivi fait a la main » est un ajout de remplissage sans objet (un suivi de quoi ?).
**Correction proposee** : « Pour que chaque composant garde sa propre copie de l'etat et la resynchronise lui-meme. »

## 13. [mineure] distracteur-inintelligible
**Question** : Quel outil associe une URL a un composant (les vues de l'app)
**Constat** : Les trois distracteurs du bilan sont des etiquettes tronquees, dont deux finissent par la meme parenthese vide : "Pinia, module des mutations (partage)", "Vitest, la verification (essais)", "Vite, le chargement des briques (partage)". « le chargement des briques » et « la verification (essais) » ne decrivent aucun role reel, et « (partage) » repete ne distingue rien.
**Correction proposee** : « Pinia, qui stocke l'etat partage de l'application », « Vitest, qui lance les tests des composants », « Vite, qui sert et compile les fichiers du projet ».

## 14. [mineure] distracteur-inintelligible
**Question** : Quelle directive reagit a un evenement ?
**Constat** : Les parentheses des distracteurs du bilan ne veulent rien dire : "v-for:clic (tour)" et "v-key:clic (saisie)" — « (tour) » et « (saisie) » ne glosent rien et ne rendent pas l'option plus plausible.
**Correction proposee** : « v-for:clic (repetition au clic) » et « v-key:clic (raccourci clavier) », ou plus simplement supprimer les parentheses : « v-for:clic », « v-key:clic ».
