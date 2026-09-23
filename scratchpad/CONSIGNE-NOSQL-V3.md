# Consigne de RÉPARATION — les QCM du cours `nosql` (B4, 50ᵉ cours, troisième vague)

Tu réécris des **distracteurs** du cours `nosql` du site Syntaxe (`D:\test-claude`, 100 % `file://`).

**Un seul agent écrit dans un fichier donné.** Tu ne touches qu'aux leçons de TON lot, tu ne fais
**aucun commit**. Scratch : `scratchpad/nosql-r<ton lot>/`.

---

## ⚠️⚠️⚠️ CE QUI S'EST PASSÉ, ET POURQUOI CETTE VAGUE EXISTE

Deux vagues ont réécrit les 172 distracteurs de ce cours. **Les mesures sont excellentes** :

| mesure | départ | maintenant |
|---|---:|---:|
| « la plus longue » | 99,1 % | **26,3 %** |
| rangs de longueur | 57 / 0 / 0 / 0 | **15 / 14 / 14 / 14** |
| les 46 stratégies de forme | jusqu'à 78,1 % | **couverture 0,0 %** |
| indice lexical (3 variantes) | 42 / 60 / 54 % | **0,0 % / 0,0 % / 0,0 %** |
| mots fétiches, intrus lexical, biais inverse | 3 + 2 + 4 alertes | **0 / 0 / 0** |

**Et une vague de contradiction a trouvé que le texte ne veut plus rien dire.** Verbatim des
relecteurs, chiffres à l'appui :

> « 15 distracteurs sur 27 ne veulent rien dire. Sur 4 questions des 9, **les trois** distracteurs
> contiennent une proposition inintelligible. La consigne *« choisis la seule option qui a un sens »*
> tranche à 100 % sans rien connaître au NoSQL. »

> « 13 des 18 distracteurs de mon périmètre contiennent au moins une proposition qui ne veut rien
> dire, une question entière est devenue inutilisable, et **4 questions sur 6 offrent une paire de
> distracteurs auto-éliminatrice**. »

Exemples réels, à lire à voix haute :

- « le réglage **y protège le solde à la fin de la nuit** »
- « le « tout ou rien » peut alors **protéger gratuitement le tout dernier numéro** »
- « un robot chiffre **toutes ses copies personnelles de production** »
- « le moteur peut donc **unir ses listes par leur seul nom exact** »
- « la collection tient la place d'une colonne, **un champ du tableau hiérarchique (une valeur de
  données par ligne)** »
- « Entre la durabilité (D) et la réponse des serveurs, **car la règle inévitable ne peut plus valoir
  sur un virement** »

**C'est le défaut du 39ᵉ cours (`scala`, 30 prises sur 54) et du 45ᵉ (`securite`, neuf contrôles
verts sur une salade de mots), reproduit à l'identique.** Le biais de longueur a été remplacé par un
**biais de cohérence sémantique : il se mesure au même endroit, et aucun des 46 outils ne le voit.**

⚠️ Un relecteur l'a dit mieux que le tableau : la vague a échangé **trois erreurs pédagogiques nettes
et instructives** (« Une collection est une colonne, un document une table ») contre **trois
non-phrases**. Du point de vue de l'apprenant, le QCM est devenu PIRE qu'avant, alors que toutes les
mesures se sont améliorées.

---

## LA RÈGLE DE CETTE VAGUE, ET ELLE PRIME SUR TOUTES LES MESURES

> **UN DISTRACTEUR EST UNE PHRASE FRANÇAISE QUI ÉNONCE UNE THÈSE FAUSSE, PRÉCISE ET PLAUSIBLE.**
> Si tu ne peux pas dire en une phrase *pourquoi c'est faux*, ce n'est pas un distracteur.

Test de recevabilité, à appliquer à CHAQUE distracteur que tu écris — les quatre à la fois :

1. **Je peux nommer l'erreur.** « Il confond réplication et partitionnement. » « Il croit qu'un index
   accélère les écritures. » Si la réponse est « il ne dit rien de précis », réécris.
2. **Chaque proposition a un référent.** Pas de « y » qui ne renvoie à rien, pas de « cette notation »
   sans antécédent, pas de « le compteur » jamais introduit, pas de « le même gain » sans comparant.
3. **Un débutant crédule pourrait le cocher.** Un distracteur absurde ne piège personne.
4. **Aucune parenthèse de remplissage.** « (gestion, profils, usages) », « (rigueur, charge) »,
   « (cache, index, volume) » : ces gloses ne veulent rien dire, elles servaient à tenir un compte de
   caractères. **Supprime-les ou remplace-les par un contenu qui dit quelque chose.**
5. **Aucune conjonction sans logique.** « car la règle inévitable ne peut plus valoir » : la
   subordonnée doit justifier la principale, même faussement.

**PRÉFÈRE UNE ERREUR CLASSIQUE ET NETTE À UNE ÉLÉGANCE MESURÉE.** Les erreurs vraiment commises en
NoSQL sont listées dans `scratchpad/CONSIGNE-NOSQL.md` (section « (c) ») : sers-t'en.

---

## LES TROIS AUTRES DÉFAUTS QUE LA CONTRADICTION A MESURÉS

### (A) LA PAIRE AUTO-ÉLIMINATRICE — jusqu'à 4 questions sur 6

Deux distracteurs qui portent la **même thèse** s'éliminent l'un l'autre : l'apprenant sait qu'aucun
des deux ne peut être l'unique bonne réponse, et il lui reste 50 %. Cas relevés :

- « Parce qu'**un document garde ses verrous** » / « Parce qu'**une écriture verrouille le document** »
- « le partitionnement **sert la disponibilité (la relève)** » / « le partitionnement **conditionne la
  disponibilité** des données **(la relève)** »
- deux options qui décrivent toutes deux le **clé-valeur** (« panier, session » / « cache, sessions,
  compteurs, paniers »)
- « Le délai fixe **le nombre** des écritures » / « Le délai limite **le nombre** de clés »

**Règle : les trois distracteurs d'une question portent TROIS erreurs DIFFÉRENTES.** Écris-les
côte à côte et vérifie qu'on ne peut pas les résumer par la même phrase.

Cas particulier, aussi grave : **le miroir exact de la bonne réponse.** « On accède **uniquement par
la clé** » (bonne) contre « On cherche la valeur par son contenu, **jamais par sa clé** » — le couple
désigne la bonne réponse sans aucune connaissance du sujet.

### (B) LE DISTRACTEUR À MOITIÉ VRAI, OU QUI ENSEIGNE LA RÉPONSE

- « horizontale = ajouter … par le **sharding** des serveurs » : après correction de « serveurs » en
  « données », la proposition devient **la définition exacte de la page**.
- « le moteur **obligerait** à citer `$match` en première position, **et qu'il peut sinon rendre le
  calcul des accumulateurs bien plus coûteux** » : la seconde moitié **est** la raison de la bonne
  réponse.
- « risque : la **migration globale** devient le prix de tout champ neuf … du modèle **fixe** » : c'est
  exactement ce que la page enseigne du modèle fixe ; l'option n'est fausse que parce qu'elle
  l'attribue au schéma flexible.

**Règle : la fausseté est dans la THÈSE, dès la première proposition.** Pas dans un mot-clé placé en
fin de phrase, pas dans une nuance (« sans retard » contre « en quelques secondes »).

### (C) LES TICS DE LOT — mesurés, tranchants, invisibles aux 46 outils

La passe `julia` avait annoncé ce risque. Les relecteurs en ont mesuré **cinq**, tous fabriqués par
l'écriture :

| tic | bonnes / distracteurs | questions tranchées | rendement |
|---|---|---:|---:|
| **parenthèse ouverte par un article** `(un …)`, `(le …)`, `(des …)` | **3 / 45** | **13** | **84,6 %** |
| la même, en **fin d'option** | **1 / 22** | **7** | **100 %** |
| **`, et `** (virgule avant « et ») | 0 / 6 | 2 | **100 %** |
| **« de données »** en collocation de rallonge | — | 1 | **100 %** |
| **« y » adverbial** sans antécédent | 1 / 10 | — | 91 % |
| mots jamais employés ailleurs dans le cours (`panier`, `Redis`) | 0 / 3 et 0 / 2 | 2 | **100 %** |

**Règle : aucune tournure, aucun signe, aucun gabarit de phrase ne doit être le privilège des
distracteurs.** Après écriture, **cherche tes propres tics au `grep`** et compare bonnes réponses
contre distracteurs, sur TON lot ET sur le cours entier. Le contrôle existe désormais : **`node tools/mesure-tics-lot.js nosql --exemples`**, écrit pour cette
passe justement parce qu'aucun des 46 outils ne voyait ces indices. Il liste les questions tranchées.

⚠️ **La parenthèse à article est le tic dominant : 45 distracteurs contre 3 bonnes réponses.** Le
plus simple est d'en **supprimer la plupart** — ces parenthèses sont précisément les gloses de
remplissage du point 4 ci-dessus. Les deux défauts se corrigent d'un seul geste.

---

## CE QUI NE DOIT PAS BOUGER

1. **La bonne réponse, l'énoncé `q`, le champ `correct` et l'`explain` sont INTOUCHABLES.** Contrôle
   de l'orchestrateur : `node tools/mesure-qcm-intouchable.js nosql a943c2f` doit rendre
   « Aucune atteinte ».
2. **Les rangs de longueur.** `node tools/plan-rangs-qcm.js nosql` doit continuer à rendre
   **« questions a retoucher : 0/57 »**. Tes réécritures doivent rester dans la bande de chaque
   option. C'est la contrainte la plus dure de cette vague : **tu réécris le SENS à longueur
   constante**, à quelques caractères près.
3. **Les égalisations acquises** : compte de `, : ;` égal sur les quatre options ; marques de
   ponctuation « les quatre ou aucune » ; `k` (mots de 6+ lettres absents de la page) égal sur les
   quatre ; `w` (mots de 6+ lettres) égal sur les quatre ; échos de l'énoncé égaux ; mots fétiches
   « les quatre ou aucune » (`chaque`, `données`).
   Contrôle : `node tools/mesure-biais-qcm.js --seul=nosql` ne doit faire remonter aucune stratégie
   au-dessus de **0,0 % de couverture** (hors rangs de longueur et densité, qui sont à 25 % voulu).
4. **Aucun distracteur ne doit devenir vrai**, et **aucun conseil dangereux** (exposer un port,
   désactiver l'authentification, « les sauvegardes sont inutiles »).
5. **JSON valide, 0 BOM, 0 CRLF, 0 URL externe.** N'écris pas ton JSON par heredoc : l'outil Bash
   mange un niveau d'antislash même dans un heredoc quoté. Édite avec l'outil d'édition.

---

## RÈGLE DE PREUVE

**Ce cours ne s'exécute pas** (aucun moteur NoSQL installé). Tu n'écris que ce que **TA page**
établit. Tout ce que tu ne peux pas fonder — un chiffre de latence, un message d'erreur, un
comportement de version de MongoDB / Redis / Cassandra / Neo4j / Elasticsearch, un mécanisme absent
de la page (quorum, journalisation sur disque, compression automatique) — **tu ne l'écris pas** : tu
le listes dans ton compte rendu.

Si tu crois qu'une **bonne réponse** est fausse : tu ne la corriges pas, tu la remontes avec la
citation de la page qui la contredit. C'est l'orchestrateur qui tranche.

---

## L'ORDRE DE TRAVAIL

1. Lis **TES** leçons en entier, et le rapport de contradiction de ton lot (il t'est donné dans ton
   prompt) : il liste les options à refaire, avec la citation qui prouve le défaut.
2. Pour chaque question : écris les **trois erreurs** que tu veux enseigner, en une phrase chacune,
   **avant** de rédiger. Trois erreurs différentes, aucune n'étant le miroir de la bonne réponse.
3. Rédige à la longueur imposée par `plan-rangs-qcm`. Si tu manques de caractères, **étoffe l'erreur**
   (son mécanisme faux, sa conséquence fausse) — jamais par une parenthèse de remplissage.
4. Relis les quatre options **à voix haute**, dans l'ordre. Si une phrase te fait buter, elle est
   mauvaise.
5. Relance les contrôles et cite les chiffres.

## LE CONTRÔLE D'APRÈS, à citer dans ton compte rendu

```
node tools/plan-rangs-qcm.js nosql              (0/57 attendu)
node tools/mesure-biais-qcm.js --seul=nosql
node tools/mesure-lexique-qcm.js --seul=nosql
node tools/mesure-mot-question.js nosql
node tools/mesure-mot-fetiche.js nosql
node tools/mesure-tics-lot.js nosql --exemples   (les tics de lot — 0 alerte attendue)
node tools/verif-html.js
```
