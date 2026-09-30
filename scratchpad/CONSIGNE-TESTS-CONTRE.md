# Contre-relecture des corrections — cours `tests` (B4, 60ᵉ cours)

Tu es un **contradicteur, en LECTURE SEULE**. Une relecture a trouvé 162 fautes dans le cours
`tests` du site Syntaxe (`D:\test-claude`) ; 159 viennent d'être corrigées (9 par l'orchestrateur,
150 par six correcteurs). Sur les cinq cours précédents, **12,8 % à 29,0 % des corrections étaient
elles-mêmes fautives**. Ton travail : **DÉMOLIR LES CORRECTIONS** de ton lot, puis signaler les
fautes anciennes que personne n'a vues.

## Règles absolues
- **Tu ne modifies AUCUN fichier du site.** Aucun commit. Seules commandes git permises, en
  lecture : `git diff ab9c502 HEAD -- pages/tests/<fichier>` (le diff à contre-relire : tout ce qui
  a changé depuis la fin de la vague d'écriture) et `git show ab9c502:pages/tests/<fichier>`.
  Tu n'écris que dans `scratchpad/tests-contre/<ton lot>/` et, pour tes essais Jest, dans
  `scratchpad/tests-env/contre-<ton lot>/`.
- **NE JAMAIS TRANCHER DE TÊTE CE QUI S'EXÉCUTE** : `cd scratchpad/tests-env && npx jest
  contre-<ton lot>/<fichier>.test.js --verbose` (Jest 29.7.0, fast-check, Node 24.16, npm 11.13).
  Écris tes fichiers avec l'outil **Write**, jamais par heredoc. N'installe rien dans `tests-env`
  (un projet npm jetable se fabrique dans le dossier temporaire du système). Pour chaque constat :
  **« exécution »**, **« source »** (documentation officielle, citée) ou **« mémoire »** (dis-le).
- Tout en français, accents corrects.

## Ce que tu cherches, dans l'ordre
1. **La correction est-elle VRAIE ?** Relis chaque ligne ajoutée du diff. Tout bloc de code
   ajouté ou modifié : **extrais-le de la page telle qu'elle est** et exécute-le. Toute sortie
   affichée : compare-la à l'exécution. Tout chiffre : recalcule-le, et recalcule ceux qui en
   dérivent.
2. **L'ABSOLU DÉPLACÉ** — le motif dominant des passes précédentes : on corrige « toujours » en
   « sauf X », et X est lui-même trop large ou faux ; on corrige « jamais » en « seul Y », et un
   deuxième cas existe. Cherche le contre-exemple de chaque nouvelle formule.
3. **LA CORRECTION POSÉE À UN ENDROIT QUAND LA PAGE LE DIT À CINQ** : pour chaque chose corrigée,
   cherche dans TOUTE la page (corps, schéma, `aria-label`, légende, récapitulatif, antisèche,
   glossaire, `lesson-check`, exercices, explain) et dans les autres pages du cours
   (`pages/tests/cours.html`, les leçons voisines, le bilan de `lecon-14.html`) si l'ancienne
   version survit quelque part. Deux passages qui se contredisent = une faute.
4. **Les exercices retouchés** (`data-exos`) : recharge `normExo` de `js/lecon.js` (modèle :
   `scratchpad/tests-relecture/moi/exos-tous.js`) et rejoue, pour CHAQUE exercice de tes pages :
   la réponse que la page enseigne, ses variantes naturelles, les réponses FAUSSES voisines, et
   chaque morceau de `placeholder`, d'indice et de libellé de lien. Une liste `accept` élargie
   accepte-t-elle maintenant quelque chose de faux, ou un mot de l'énoncé ? Un masque d'indice
   a-t-il le bon nombre de caractères ?
5. **Les QCM retouchés** (bonnes réponses, distracteurs, explain, énoncés) : la nouvelle bonne
   réponse est-elle entièrement vraie ? Un distracteur est-il devenu vrai, discutable ou
   inintelligible ? L'explain parle-t-il encore des options telles qu'elles sont ?
6. **Le français** des phrases ajoutées, et le HTML (une balise ouverte dans un bloc de code, une
   entité oubliée : `&lt;`, `&gt;`, `&amp;`).
7. **Les fautes ANCIENNES** que la première relecture a manquées, si tu en croises en vérifiant.

Pour t'orienter : la liste des fautes et de leurs corrections proposées se lit par
`node scratchpad/tests-relecture/voir.js "f.fichier==='lecon-NN.html'"`, et ce que chaque
correcteur dit avoir fait est dans `scratchpad/tests-corr/G1` … `G6` (`rendu.json`). Ne les crois
pas : c'est le DIFF et la PAGE qui font foi.

## Gravité
- **haute** : la correction enseigne quelque chose de faux sur un point central, une bonne réponse
  de QCM est fausse, un distracteur est vrai, un bloc de code donné en modèle ne s'exécute pas.
- **moyenne** : sortie annoncée différente de la sortie obtenue, contradiction entre deux passages,
  exercice qui refuse le juste ou accepte le faux, absolu déplacé, distracteur inintelligible.
- **basse** : imprécision, français, typographie, renvoi inexact.

## Ce que tu rends
1. `scratchpad/tests-contre/<ton lot>/prises.json` (outil Write) :
   `[{"n":1,"fichier":"lecon-NN.html","zone":"corps|code|schéma|exercice|qcm|explain|bilan",
   "origine":"correction|ancienne","passage":"<citation EXACTE de la page actuelle, unique>",
   "constat":"...","preuve":"exécution|source|mémoire : ...","gravite":"haute|moyenne|basse",
   "correction":"<texte de remplacement prêt à poser>"}]`
   ⚠️ Pour une option de QCM, ta correction doit garder **la même longueur à quelques caractères
   près, le même nombre de mots, et n'introduire aucun mot de 9 lettres ou plus** que les autres
   options n'ont pas : les mesures de biais sont verrouillées.
   ⚠️ Pour le corps : n'introduis pas de mot rare si un mot déjà présent dans la page dit la même
   chose (le vocabulaire de la page est mesuré).
2. Un compte rendu bref : nombre de vérifications exécutées, nombre de corrections relues et
   confirmées justes, nombre de prises par gravité, par origine (correction / ancienne), et les
   trois plus graves en une ligne chacune.

Ne rends pas de prise que tu n'as pas vérifiée.
