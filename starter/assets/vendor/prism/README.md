# assets/vendor/prism

**Prism 1.29.0** — coloration syntaxique des blocs de code, servi **en local**.

## Pourquoi ce dossier existe

Le site charge Prism depuis un CDN jusqu'au 31/07/2026. C'était une régression
silencieuse : la promesse fondatrice est un usage 100 % `file://`, sans serveur ni
connexion, or **hors ligne aucun bloc de code n'était coloré** (mesure : 0 élément
`.token` sur 24 leçons testées, moteur de rendu Chrome, résolution DNS bloquée).
Les 55 lignes de thème `.token.*` de `css/components.css` étaient donc totalement
inertes. Depuis, tout est ici et la coloration fonctionne sans réseau.

## Contenu

- `prism-core.min.js` — le moteur (7 422 octets). **Toujours chargé en premier.**
- `prism-<langage>.min.js` — 61 grammaires, une par langage réellement employé dans
  les leçons (relevé des classes `language-*` présentes dans les pages).

Total : 62 fichiers, 136 291 octets (~133 Ko). Fichiers **inchangés**, tels que
publiés par cdnjs — ne jamais les réécrire à la main ni les re-minifier.

## Ordre de chargement : le piège à connaître

Une grammaire qui en requiert une autre ne s'enregistre pas si la dépendance n'est
pas déjà chargée. L'ordre des `<script>` dans chaque page respecte donc les
dépendances déclarées par Prism (`components.json`) :

- `c` ← `clike`, puis `cpp` ← `c`
- `javascript` ← `clike` (et modifie `markup`, qui doit venir avant s'il est chargé)
- `jsx` ← `markup` + `javascript`, puis `tsx` ← `jsx` + `typescript`
- `php`, `twig` ← `markup-templating` ← `markup`
- `erb` ← `ruby` + `markup-templating`
- `scala` ← `java` ← `clike` ; `scss` ← `css` ; `objectivec` ← `c` ; `fsharp` ← `clike`

Chaque page ne charge **que** les grammaires de ses propres blocs de code, plus leurs
dépendances. Les alias sont résolus vers le vrai composant : `html`/`xml` → `markup`,
`js` → `javascript`, `vb` → `visual-basic`. Les blocs `plaintext`/`text` n'ont besoin
d'aucun fichier, Prism les gère nativement.

## Thème

Il n'y a **pas** de feuille de style Prism ici, et il ne faut pas en ajouter : le thème
est maison, dans `css/components.css` (règles `.token.*`), accordé aux variables du
site. Ajouter un thème Prism l'écraserait.

## Chemins relatifs

- depuis `pages/<cours>/lecon-NN.html` → `../../assets/vendor/prism/…`
- depuis `pages/<page>.html` → `../assets/vendor/prism/…`

## Mise à jour

Les fichiers viennent de `https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/`.
Pour changer de version, retélécharger les 62 fichiers **et** vérifier que les
dépendances de `components.json` n'ont pas bougé (exemple réel : en 1.29, `php` ne
requiert plus `clike`, seulement `markup-templating`).

Licence Prism : MIT (Lea Verou et contributeurs).
