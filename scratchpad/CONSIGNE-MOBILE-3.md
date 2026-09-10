# Consigne — 3ᵉ vague sur `mobile` : réparer ce que la contrainte lexicale a cassé

## Ce que quatre relecteurs adversariaux ont trouvé

Les deux premières vagues ont fermé **tous** les biais de forme mesurables du cours : l'indice
lexical ne tranche plus dans aucun de ses trois sens (0,0 % de couverture), les rangs de longueur
sont à 19/18/18/18, et le point-virgule, la parenthèse, les deux-points, le tiret et la MAJUSCULE
sont à 0,0 % de couverture. **Ces acquis ne doivent pas bouger.**

Mais le prix payé est lourd, et il est de trois ordres :

1. **Des distracteurs sont devenus VRAIS ou défendables.** En réécrivant avec le vocabulaire du
   cours, on finit par réciter le cours.
2. **Une quinzaine de phrases ne veulent plus rien dire.** La substitution lexicale mécanique
   (« la commande de la machine » pour *la console*, « déserte la file », « inscrit dans l'état du
   HAUT », « sans case de côté ») produit du français qui n'en est pas.
3. **Et ça fabrique un biais NEUF, non mesuré par aucun outil** : la bonne réponse est souvent
   **la seule option grammaticalement intelligible**. Un apprenant qui écarte ce qui ne veut rien
   dire gagne sans rien savoir. C'est exactement le défaut qu'on prétendait corriger, déplacé de la
   longueur vers la lisibilité.

## LA RÈGLE QUI PRIME MAINTENANT SUR TOUTES LES AUTRES

> **Un distracteur doit être du français naturel, lisible, et plausible pour qui n'a pas lu la
> leçon — et FAUX pour qui l'a lue.**

Si tenir une contrainte de forme (mot du cours, longueur, marque) t'oblige à écrire une phrase
bancale, **c'est la contrainte de forme qui cède**, et tu rattrapes ailleurs dans la même option.
Une option illisible est un indice plus fort que tous ceux qu'on vient de fermer.

Deuxième règle, tirée du même rapport : **ne fais pas un distracteur qui se dénonce lui-même.**
Sur les leçons 06 à 10, **13 distracteurs sur 60** finissent par une clause qui condamne l'option
(« ne sert plus à rien », « le processeur chauffe », « on perd en fluidité », « le spinner tourne
indéfiniment »). La bonne réponse ne le fait presque jamais. Un distracteur affirme sa thèse
**positivement** ; sa fausseté est dans le mécanisme décrit, pas dans un aveu final.

## Ce qui ne doit pas bouger — à revérifier après CHAQUE question

1. `node tools/mesure-lexique-qcm.js --liste=mobile` : **0 question à mettre en forme**. La règle du
   `k` (deux distracteurs à zéro mot étranger, un à exactement k) doit tenir après tes corrections.
   L'outil te dit exactement où tu en es.
2. `node tools/plan-rangs-qcm.js mobile` : **19/18/18/18, 0 question à retoucher**, y compris en
   `--incise` et en `--ponctuation`.
3. `node tools/mesure-qcm-intouchable.js mobile` : **vert**. `q`, `correct`, `explain` et le texte de
   la bonne réponse restent intacts, octet pour octet.
4. `node tools/verif-html.js` : **0 problème**.
5. JSON valide, UTF-8 sans BOM, pas de `&nbsp;` ni d'espace insécable dans un bloc `data-quiz`.
   ⚠️ `core.autocrlf=true` : l'arbre de travail est en **CRLF**. Écris par **substitution de chaîne
   exacte** dans le source brut, jamais en régénérant le bloc.
6. Aucun `git add`, `git commit` ni `git checkout`.

## Méthode conseillée pour une réparation

Beaucoup de défauts viennent d'avoir réécrit **de zéro** une option qui était bonne. Pour ces cas,
`git show HEAD:pages/mobile/lecon-NN.html` donne le texte d'avant les deux vagues : repars de lui et
n'applique que l'ajustement nécessaire, plutôt que de réinventer.

Simule avant d'écrire : longueur (`[...].length`), marques, et mots de 6 lettres et plus absents de
la page. Un script Node jetable qui vérifie les trois coûte moins cher qu'une reprise.

## Les défauts de CORPS DE LEÇON

Les relecteurs en ont trouvé plusieurs, antérieurs aux vagues. **Corrige-les aussi** : c'est le
défaut fondateur de toute cette chaîne de chantiers (un contenu faux que quatre vérificateurs verts
n'ont jamais vu). Ils sont listés dans ton lot. Attention : modifier le corps d'une leçon change le
vocabulaire de la page, donc **relance `--liste=mobile` après** — un mot que tu ajoutes au corps peut
faire tomber à zéro un distracteur qui devait être à k.
