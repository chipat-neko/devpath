# Fautes relevees par la relecture adversariale — pages/vue/lecon-12.html

## 1. [bloquante] distracteur-inintelligible
**Question** : Pourquoi privilégier l'animation de opacity et transform ?
**Constat** : L'option 3 : « Elles évitent la déclaration de durée, donc transform passe sans étape de plus : le composant gagne en douceur » — « éviter la déclaration de durée » n'a aucun lien logique avec ce qui suit, « sans étape de plus » n'a pas de comparant, et « le composant gagne en douceur » est du remplissage.
**Correction proposee** : Remplacer par : « Elles sont animées par le moteur CSS sans passer par le compositeur, ce qui supprime l'étape de peinture : l'effet reste fluide. »

## 2. [serieuse] distracteur-inintelligible
**Question** : Comment respecter le choix « animations réduites » d'un ut
**Constat** : L'option 4 : « En donnant la préférence au JavaScript (animation courte : effet visible) » — « donner la préférence au JavaScript » ne répond pas à la question, et la parenthèse « animation courte : effet visible » n'énonce aucune thèse.
**Correction proposee** : Remplacer par : « En animant en JavaScript via les hooks @enter et @leave, qui coupent d'eux-mêmes l'effet quand le système demande moins de mouvement. »

## 3. [serieuse] distracteur-vrai
**Question** : Comment respecter le choix « animations réduites » d'un ut
**Constat** : L'option 2 « En raccourcissant chaque transition (pour tous : moins de glissement) » est validée par la page elle-même : le callout écrit « Respecte ce choix en neutralisant ou en raccourcissant les transitions », et l'explain répète « on y désactive ou raccourcit les transitions ». Raccourcir est donc une réponse exacte : la question a deux bonnes réponses.
**Correction proposee** : Remplacer par : « En raccourcissant chaque transition pour tout le monde, puisque le navigateur ignore la préférence système tant qu'aucune media query ne la lit. » — ou rendre l'option franchement fausse : « En écoutant l'événement reducedmotionchange sur window pour couper les transitions. »

## 4. [serieuse] distracteur-inintelligible
**Question** : Pourquoi privilégier l'animation de opacity et transform ?
**Constat** : L'option 2 : « Elles passent par le processeur, puis par la disposition : opacity gagne en douceur » — la conclusion contredit la prémisse (passer par la disposition, c'est justement ce qui saccade), et « opacity gagne en douceur » n'a pas de comparant.
**Correction proposee** : Remplacer par : « Elles passent par l'étape de disposition avant la peinture, ce qui laisse au navigateur le temps de lisser chaque image. »

## 5. [serieuse] distracteur-inintelligible
**Question** : Quel composant anime l'ajout et le retrait d'éléments dans
**Constat** : L'option 4 : « Le suffixe -enter, qui exige la :key et déclenche la sortie » — un suffixe de classe n'est pas un composant, et « -enter … déclenche la sortie » se contredit (l'entrée déclencherait la sortie).
**Correction proposee** : Remplacer par : « <TransitionList>, le composant de liste qui pose la :key et anime chaque ligne »

## 6. [mineure] distracteur-inintelligible
**Question** : Sur quelle classe place-t-on la déclaration transition ?
**Constat** : L'option 4 : « Sur la classe -move (liste-move / tache-move), qui règle le départ des voisines pendant la sortie » — « le départ des voisines » est ambigu (leur sortie ? leur point de départ ?) et la page dit seulement que -move anime leur repositionnement ; la subordonnée n'énonce pas de thèse vérifiable.
**Correction proposee** : Remplacer par : « Sur la classe -move (liste-move / tache-move), la seule qui accepte une déclaration transition dans un TransitionGroup. »

## 7. [mineure] version-invérifiable
**Question** : Sur quelle classe place-t-on la déclaration transition ?
**Constat** : L'option 3 s'appuie sur « (attribut name/duration) » : l'attribut duration de <Transition> n'est écrit nulle part dans la page (ni dans l'antisèche, ni dans le glossaire) ; sa fausseté n'est donc pas décidable à la lecture de la leçon.
**Correction proposee** : Remplacer la parenthèse par un élément que la page écrit : « Sur le composant enveloppant, via son attribut name, qui applique la durée à chacune des six classes. »
