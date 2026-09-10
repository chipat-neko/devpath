# Consigne — 2ᵉ vague sur `mobile` : refermer l'indice lexical INVERSE

## Ce qui s'est passé, mesuré

La 1ʳᵉ vague a appliqué la consigne « ZÉRO mot étranger dans les quatre options ». Elle l'a tenue :
les 219 distracteurs sont à zéro mot étranger, et les deux variantes connues de l'indice lexical
sont tombées de **100,0 % et 88,4 % à « ne tranche plus du tout »** (0,0 % de couverture).

**Et le cours est resté devinable à 100 %.** La bonne réponse étant INTOUCHABLE, ses mots étrangers
à elle sont restés. Il suffit à l'apprenant de **retourner la règle** — « choisis l'option qui
contient un mot ABSENT de la page » — pour avoir juste **37 fois sur 37**.

    INVERSE lexical sur mobile : tranche sur 50,7 % des questions, rendement 100,0 %

C'est la même leçon que l'écho de `data-eng` : **une correction qui pousse un indice à fond le
retourne au lieu de le fermer.**

## LA RÈGLE, qui ferme les trois variantes d'un coup

Soit **k** = le nombre de mots étrangers de la **bonne réponse** (intouchable, donc k est une donnée).

- **k = 0** → les trois distracteurs à **zéro** mot étranger. *(Déjà fait par la 1ʳᵉ vague : ces
  36 questions sont closes, n'y touche pas.)*
- **k > 0** → **DEUX distracteurs à zéro**, et **LE TROISIÈME à EXACTEMENT k**.

Alors STRICTE voit deux zéros (elle exige un seul), PROPORTION voit deux parts à 1,0 ex æquo, et
INVERSE voit deux maxima ex æquo : **aucune des trois ne tranche**. C'est arithmétique.

## L'outil te donne le travail, question par question

    node tools/mesure-lexique-qcm.js --liste=mobile

Il imprime pour chaque question non conforme : `k`, les distracteurs visés (`0 / 0 / k`), ceux
d'aujourd'hui, et le détail option par option. **Ton lot est fini quand aucune de tes questions n'y
apparaît plus.** Il reste 37 questions à mettre en forme sur 73.

## Comment on ajoute exactement k mots étrangers à UN distracteur

Choisis **un seul** des trois distracteurs (de préférence celui où le remplacement est le plus
naturel) et remplace **k** de ses mots par des synonymes **absents de la page**, de longueur voisine.

- La page dit `magasin` → écris `boutique`. Elle dit `appareil` → écris `terminal`. Elle dit
  `écran` → écris `affichage`. Elle dit `réseau` → écris `connexion`.
- Le mot ajouté doit faire **6 lettres ou plus** (sinon il n'est pas mesuré) et être du **français
  correct, avec les accents**. Ce n'est pas un mot inventé : c'est un synonyme légitime que la leçon
  n'emploie simplement pas.
- **Vérifie qu'il est bien absent** : `mots(page)` de la leçon, apostrophes comprises. `l'appareil`
  et `appareil` sont deux mots différents pour l'outil.
- Les deux autres distracteurs **restent à zéro**. Ne les touche pas.

## CE QUI NE DOIT PAS BOUGER — revérifie après chaque question

1. **INTOUCHABLE : `q`, `correct`, `explain`, texte de la bonne réponse.**
   `node tools/mesure-qcm-intouchable.js mobile` doit rester vert.
2. **Le distracteur reste FAUX.** Tu changes des mots, pas le sens. Si le synonyme change le sens au
   point de rendre l'affirmation vraie, choisis-en un autre.
3. **Les rangs de longueur.** `node tools/plan-rangs-qcm.js mobile` est aujourd'hui à
   **19/18/18/18 = la cible exacte, 0 question à retoucher**. Il doit le rester : prends un synonyme
   de longueur proche, et resimule (`[...].length`) avant d'écrire.
4. **Les marques.** `--incise` et `--ponctuation` ne listent aucune question : ça doit le rester.
   N'ajoute ni `;` ni `(` ni `:` ni tiret cadratin ni MAJUSCULE en remplaçant un mot.
5. **JSON valide, UTF-8 sans BOM, pas de `&nbsp;` ni d'espace insécable dans un bloc `data-quiz`.**
   ⚠️ Le dépôt est en `core.autocrlf=true` : l'arbre de travail est en **CRLF**. Écris par
   **substitution de chaîne exacte** dans le source brut, pas en régénérant le bloc — sinon le
   fichier bascule en LF et le diff explose.
6. **Aucun `git add`, aucun `git commit`, aucun `git checkout`.**

## Compte rendu attendu

Questions traitées, mot(s) ajouté(s) par question avec la preuve qu'ils sont absents de la page,
état de `--liste=mobile` sur tes fichiers, rangs après coup, et ce que tu n'as pas pu tenir.
