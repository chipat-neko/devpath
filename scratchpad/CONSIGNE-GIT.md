# Consigne d'écriture — cours `git`, point B4 du CHANTIER-V16

## Ce qu'on corrige et pourquoi

Dans le cours `git`, un apprenant qui ne comprend RIEN réussit **93,8 %** des QCM en
choisissant toujours la réponse la plus longue. La cause est mécanique : la bonne réponse
porte l'explication, les distracteurs sont expédiés. **On ne raccourcit PAS la bonne
réponse** (ce serait perdre le contenu) : on **étoffe les distracteurs**.

Autres indices mesurés sur ce cours, à faire baisser aussi :
« la plus détaillée » 82,5 %, « l'incise entre parenthèses » 72,8 %,
« l'écho de la question » 66,3 %, « le mot technique exclusif » 65,4 %.

## Le plan, question par question

    node tools/plan-rangs-qcm.js git --json

Le champ `travaux` liste chaque question à retoucher :
`fichier`, `bloc`, `bilan`, `question` (index 1-based DANS le bloc), `correcte` (index de la
bonne option), `texteBon`, `rangActuel`, `rangCible`, et `options[]` avec pour chacune :
`option` (index dans le tableau `a`), `longueur` actuelle, `cible` = `[min, max]` en
caractères, `sens` (ALLONGER / RESSERRER), `texte` actuel.

**Le rang visé compte autant que la bande.** `rangCible` = combien de distracteurs doivent
être PLUS LONGS que la bonne réponse. La cible du cours n'est pas « la bonne réponse n'est
jamais la plus longue » — ce serait déplacer le biais d'un rang — c'est **une répartition
plate : la bonne réponse tombe à chaque rang une fois sur quatre**.

## Les règles, dans l'ordre de priorité

1. **CHAQUE DISTRACTEUR RÉÉCRIT DOIT RESTER FAUX.** C'est le piège de cette phase : en
   allongeant un mauvais choix, on le rend facilement vrai, ou ambigu. Un distracteur dont
   la fausseté dépend d'une lecture bienveillante est un défaut, pas un distracteur.
   **Git 2.54.0 est installé sur cette machine.** Quand un distracteur porte sur un
   comportement de commande, PROUVE-LE dans un dépôt jetable (`mktemp -d`, `git init`),
   ne le déduis pas de mémoire. C'est la règle absolue du chantier : on ne corrige ni
   n'écrit un fait de tête, on le fait tourner.
2. **Respecter la fenêtre `cible`** : longueur finale du texte entre `min` et `max`
   caractères, mesurée comme `.length` en JS (un `é` compte pour 1).
3. **Ne jamais toucher** : l'énoncé `q`, le champ `correct`, l'ordre des options, ni le
   texte de la BONNE réponse. Le champ `explain` ne se touche que s'il cite mot pour mot
   un distracteur que tu as réécrit.
4. **Ne pas fabriquer d'indice de forme.** Après réécriture, dans CHAQUE question, la bonne
   réponse ne doit être la SEULE à porter aucun de ces traits :
   - un tiret d'explication, un point-virgule, un deux-points ;
   - plus de virgules que toutes les autres ;
   - une incise entre parenthèses ;
   - un terme technique absent des trois autres options ;
   - la reprise des mots-clés de l'énoncé ;
   - une majuscule d'emphase, un point final là où les autres n'en ont pas.
   Si la bonne réponse a une parenthèse, mets-en une dans un distracteur (ou fais l'inverse).
5. **Varier d'une question à l'autre.** Un lot écrit d'une seule main crée un tic : même mot
   d'attaque, même longueur de phrase, même ponctuation finale. Ça a déjà été mesuré sur
   trois cours du site, et un tic de lot vaut 100 % sur son lot. Alterne les tournures
   (« Git ... », « La commande ... », « Le fichier ... », une phrase nominale, une question
   rhétorique), et n'aligne pas tes distracteurs sur un même gabarit.
6. **Format** : chaque bloc `<script type="application/json" data-quiz...>` doit rester du
   JSON valide. Pas de `&nbsp;` ni d'entité HTML (le bloc est du *raw text* : l'apprenant
   lirait `&nbsp;` littéralement) — utilise le caractère U+00A0 si tu veux une espace
   insécable. Accents corrects, jamais d'ASCII à la place d'un accent. Pas de BOM.
   Fins de ligne **LF** : l'outil d'édition écrit parfois en CRLF, vérifie après coup avec
   `grep -c $'\r' <fichier>` (doit rendre 0) et corrige si besoin.

## Vérifier avant de rendre

    node tools/plan-rangs-qcm.js git --json   # tes questions ne doivent plus y figurer
    node tools/verif-html.js                  # doit rester à 0
    node -e "…"                               # chaque bloc JSON de tes fichiers parse

## Ce que tu ne fais PAS

- Tu ne touches **qu'aux fichiers de ton lot**. Un autre agent écrit dans les autres au
  même moment ; deux écritures dans un même fichier se détruisent.
- **Aucun `git add`, `git commit`, `git stash`, `git checkout`** dans le dépôt du projet.
  Les commits sont faits par l'orchestrateur. (`git stash` convertirait tout l'arbre en CRLF.)

---

# VAGUE 2 — contradiction et fermeture de l'incise (2026-09-06)

La première vague a fait tomber « la plus longue » de **93,8 % à 25,0 %** (le hasard exact,
rangs 20/20/20/20) et « la plus détaillée » de 82,5 % à 37,4 %. Deux choses restent.

## 1. CONTREDIRE — c'est la mission principale

Trente-six distracteurs par lot viennent d'être allongés. **Le risque connu de cette phase est
qu'un distracteur allongé devienne VRAI, ou seulement ambigu.** Sur les cours déjà traités,
ce fan-out a rendu jusqu'à 22 distracteurs devenus vrais sur 135. Cherche-les.

Cherche aussi le défaut fondateur de la chaîne : **une bonne réponse qui est fausse**, ou un
`explain` qui annonce un comportement que git ne produit pas. Il a été trouvé dans un corps de
leçon, dans un `<svg>`, dans un schéma — pas seulement dans les options.

**Git 2.54.0 est installé. PROUVE, ne déduis pas.** Dépôt jetable, `git init`, tu rejoues.
Un verdict « c'est faux de mémoire » ne vaut rien ici : cinq exemples faux ont traversé quatre
vérificateurs verts, et c'est ce qui a fondé tout ce chantier.

## 2. Fermer « l'incise entre parenthèses »

    node tools/plan-rangs-qcm.js git --incise

**52,1 % sur ce cours**, désormais son pire indice, et le pire RENDEMENT du site (89,7 %).
Le mode liste les questions où la bonne réponse est en tête sur le nombre d'incises entre
parenthèses d'au moins 4 caractères, avec la fenêtre de longueur de chaque distracteur.

La cible n'est **pas** « aucune parenthèse » : c'est que la bonne réponse ne soit pas seule en
tête. Une question dont les quatre options portent une incise est neutre. Deux voies :
- ajouter une incise à un distracteur, **à longueur quasi constante** (« A et B » → « A (et B) »,
  2 caractères) pour ne pas défaire le travail de rang ;
- ou retirer l'incise de la bonne réponse en gardant le sens **et** la longueur.

⚠️ **Le rang et la bande priment.** Après ta passe, `node tools/plan-rangs-qcm.js git` doit
toujours afficher `questions a retoucher : 0/80`. Si un de tes ajustements sort une option de
sa fenêtre, tu l'as cassé.

⚠️ **Et ne déplace pas le biais une troisième fois** : vérifie `--ponctuation` (18,8 % au
départ de la vague 2, sous le hasard) — il ne doit pas remonter au-dessus de 30 %.
