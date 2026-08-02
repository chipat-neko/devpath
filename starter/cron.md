# Le cron — avancer un gros chantier en autonomie

> Ce document explique la **méthode du cron** : faire avancer un gros projet **tout seul**, étape par
> étape, en programmant des « réveils » automatiques de l'assistant (Claude Code). C'est exactement
> ce qui a permis de construire les outils de ce projet (5 lots de 10 projets). Ce n'est **pas** un
> cron Unix système : c'est le **planificateur intégré à l'assistant**, qui le relance à intervalle
> régulier avec une consigne.

---

## 1. À quoi ça sert

Tu as un gros chantier découpable en **N étapes indépendantes** (ex. « créer 10 pages-outils »,
« migrer 50 fichiers », « rédiger 30 leçons »). Plutôt que de tout faire en une fois, tu :

1. écris un **plan** (la liste des étapes) dans un fichier ;
2. demandes à l'assistant de **programmer un cron** qui le réveille régulièrement ;
3. à chaque réveil, il fait **UNE étape**, la vérifie, note l'avancement, et s'arrête ;
4. au réveil suivant, il **reprend à la première étape non terminée**.

Résultat : le chantier avance par petits pas fiables, sans que tu aies à relancer manuellement.

---

## 2. Le principe à comprendre absolument

> **Chaque réveil est une session neuve.** L'assistant ne « se souvient » pas du réveil précédent :
> il relit le prompt du cron + les fichiers du projet + sa mémoire. **Tout le contexte doit donc être
> écrit quelque part**, pas gardé « en tête ».

Deux supports d'état, à tenir à jour à **chaque** étape :

- **Un plan** (ex. `PLAN.md`) : la liste des étapes et, pour chacune, « à faire / fait ».
- **Une note d'avancement** (mémoire du projet ou un `ETAT.md`) : « dernière étape faite = X,
  prochaine = Y », + le **numéro (ID) du cron** en cours.

---

## 3. Mise en place (ce que tu demandes à l'assistant)

Tu lui dis, en clair :

> « Mets en place un cron qui te réveille toutes les ~10 minutes pour avancer en autonomie le plan
> `PLAN.md` : une étape par réveil, vérifiée, en reprenant à la première non terminée. Tiens
> l'avancement à jour. »

Sous le capot, l'assistant utilise l'outil **`CronCreate`** avec :

| Paramètre | Rôle | Exemple |
|-----------|------|---------|
| `cron` | quand se déclencher (expression à 5 champs) | `3,13,23,33,43,53 * * * *` |
| `prompt` | le message de réveil (la consigne complète) | voir §5 |
| `recurring` | répété (vs une seule fois) | `true` |
| `durable` | survivre au redémarrage (⚠️ voir §6) | `true` |

Il renvoie un **identifiant de job** (ex. `a553721e`) — **à noter**, il sert à le supprimer/recréer.

Outils associés : **`CronList`** (voir les crons actifs) et **`CronDelete`** (en supprimer un par ID).

---

## 4. L'expression cron (les 5 champs)

```
┌───────── minute (0-59)
│ ┌─────── heure (0-23)
│ │ ┌───── jour du mois (1-31)
│ │ │ ┌─── mois (1-12)
│ │ │ │ ┌─ jour de la semaine (0-6, 0 = dimanche)
│ │ │ │ │
*  *  *  *  *
```

Exemples utiles :

| Expression | Signification |
|------------|---------------|
| `3,13,23,33,43,53 * * * *` | aux minutes 3,13,…,53 → **toutes les 10 min** |
| `*/15 * * * *` | toutes les 15 minutes |
| `0 * * * *` | au début de chaque heure |
| `0 9 * * 1` | tous les lundis à 9 h |

> Astuce cadence : viser **5 à 15 min** pour un chantier actif. Trop court = coûteux et le contexte
> n'a pas le temps de « refroidir » ; trop long = le chantier traîne.

---

## 5. Bien rédiger le prompt de réveil

Le prompt est **lu seul, à froid**, à chaque réveil. Il doit être **auto-suffisant**. Mets-y :

1. **Le projet et le dossier** (« projet X dans `D:\...` »).
2. **La tâche** et **où est le plan/l'état** (« avance `PLAN.md`, état dans `ETAT.md` »).
3. **La méthode** : UNE étape par réveil ; **reprendre à la première étape non terminée**.
4. **Les contrôles qualité** (ex. « vérifie : pas d'erreur, fichiers valides, etc. »).
5. **Les contraintes** (langue, style, « 100 % statique »…).
6. **« Mets à jour l'avancement après chaque étape. »**
7. **Messages minimaux** ; **pas de question** à chaque réveil.
8. **Quoi faire à la fin** : « si tout est terminé, fais une vérification légère et **n'invente pas de
   travail** — propose une suite ou mets en veille. »

Squelette réutilisable :

```
Réveil automatique — projet <NOM> (<chemin>). Continue EN AUTONOMIE le plan de <PLAN.md>.
UN élément à la fois ; reprends au PREMIER élément non terminé. Vérifie TOUJOURS (<critères>).
Réutilise l'existant. Mets à jour l'avancement (<ETAT.md>) après chaque élément.
Messages MINIMAUX, PAS de question aux réveils. Si TOUT est terminé : vérification légère, NE
FABRIQUE PAS de travail artificiel (propose une suite ou la mise en veille). Reprends où tu t'es arrêté.
```

---

## 6. Les erreurs à éviter (vécu sur ce projet)

- **`durable: true` n'est pas toujours honoré.** Le cron peut rester **« session-only »** : il
  **meurt quand l'assistant se ferme** et **expire au bout de 7 jours**. ➜ Considère qu'il faudra le
  **recréer** après un redémarrage ou au bout d'une semaine. Note-le dans ton `ETAT.md`.
- **Oublier de noter l'ID du job.** Sans l'ID (ou un `CronList`), tu ne peux pas le supprimer
  proprement. ➜ Écris l'ID dans ta note d'avancement dès la création.
- **Empiler les crons.** Quand tu changes de phase (nouveau lot, nouveau prompt), **supprime l'ancien
  cron AVANT d'en créer un nouveau** (`CronDelete` puis `CronCreate`), sinon **deux crons** tournent
  avec des consignes différentes. Vérifie avec `CronList`.
- **Prompt non auto-suffisant.** Si le prompt suppose un contexte « en tête », le réveil ne sait pas
  quoi faire. ➜ Tout le nécessaire dans le prompt + les fichiers.
- **Ne pas tenir l'état à jour.** Si l'avancement n'est pas écrit après chaque étape, le réveil
  suivant **refait** une étape ou **se perd**. ➜ Mémoire/`ETAT.md` mis à jour **systématiquement**.
- **Pas idempotent.** Sans « reprendre à la première étape non terminée », deux réveils proches
  peuvent traiter le même élément. ➜ La règle d'idempotence est obligatoire.
- **Fabriquer du travail quand tout est fini.** Le cron continue de te réveiller : il faut une
  **condition d'arrêt claire** (« si tout est terminé, ne rien inventer »). Sinon il « invente » des
  tâches. ➜ Mets la consigne de fin, et **coupe le cron** quand le chantier est bouclé.
- **Cadence trop agressive.** Réveiller toutes les minutes coûte cher et n'aide pas. ➜ 5-15 min.
- **Compter sur le cron pour des sous-tâches en parallèle.** Le cron sert à **séquencer** un gros
  chantier, pas à paralléliser. Une étape, puis la suivante.

---

## 7. Le cycle de vie (récap)

```
1. Écrire le PLAN + ETAT (avec la liste des étapes).
2. CronCreate  → note l'ID dans ETAT.md.
3. À chaque réveil : 1 étape → vérifier → mettre à jour PLAN/ETAT → s'arrêter.
4. Changement de phase ? CronDelete (ancien) → CronCreate (nouveau) → noter le nouvel ID.
5. Tout est fini ? Vérification légère → CronDelete → (option) produire un récap.
6. Doute ? CronList pour voir ce qui tourne.
```

---

## 8. Quand l'utiliser… et quand l'éviter

**Bon usage** : long chantier répétitif et découpable (créer N pages, migrer N fichiers, rédiger N
leçons, audit large), où chaque étape est indépendante et vérifiable.

**À éviter** : tâche unique et rapide (fais-la directement) ; travail qui exige des décisions humaines
à chaque pas (le cron n'est pas censé te solliciter à chaque réveil) ; chantier sans critère de fin
clair.

---

## 9. Et dans CE kit de démarrage ?

Le cron n'est **pas** nécessaire au fonctionnement du site : c'est un **outil de méthode** pour
**construire/faire grossir** le projet en autonomie. Si tu repars de ce kit pour un gros site de
cours, tu peux demander à l'assistant : « mets en place un cron pour rédiger les leçons une par une
selon `PLAN.md` » — et suivre les règles ci-dessus.

---

*Mémo de méthode — à adapter à n'importe quel gros chantier mené en autonomie avec l'assistant.*
