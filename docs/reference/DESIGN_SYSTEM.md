# Design System — « Syntaxe. »

Direction artistique **éditoriale-technique** : un magazine de développement croisé avec une
plateforme d'apprentissage. Volontairement à l'écart du « défaut IA » (pas de dégradé
violet→bleu, pas de gris + bleu Bootstrap, pas d'ombres molles partout).

## Parti pris
- **Papier chaud, pas blanc clinique.** Le fond clair est un blanc cassé chaud (bone). Le texte
  est une encre très sombre légèrement chaude. Sensation de revue imprimée premium.
- **Accent rare et net.** Un cobalt profond pour l'interactif (liens, boutons, focus) ; un miel
  ambré pour les surlignages éditoriaux (filets, accents de titre). Les accents sont *rares*.
- **Signature monospace.** Les « kickers » / yeux / métadonnées sont en monospace, capitales,
  interlettrage, préfixés façon commentaire (`// Module 01`, `01 / 12`). C'est le fil rouge visuel.
- **Numérotation partout.** Modules et leçons numérotés (`01`, `02`…) en monospace.
- **Blocs de code « éditeur ».** Barre de titre discrète (nom de fichier + pastilles), gouttière,
  bouton copier. Tasteful, pas skeuomorphe.
- **Filets plutôt qu'ombres.** Le relief vient surtout de bordures de 1px et de surfaces, pas
  d'ombres floues génériques. Ombres réservées aux éléments réellement « au-dessus ».

## Couleurs (tokens — voir css/variables.css)
Thème clair :
- Fond papier `--bg` ≈ `#F4F1EA`, surface `--surface` ≈ `#FBFAF6`, surface alt `#EFEBE1`
- Encre `--ink` ≈ `#1A1713`, encre douce `--ink-2` ≈ `#544E45`, encre faible `--ink-3` ≈ `#7C7468`
- Accent cobalt `--accent` ≈ `#2540F0`, accent fort `#1B30C4`
- Miel `--gold` ≈ `#C98A1E` (texte) / `#E8B24A` (filets)
- Bordure `--line` ≈ `#DED7C9`
- Sémantique : succès `#1E7F4F`, info `#2540F0`, attention `#B5651D`, danger `#C0392B`

Thème sombre (`[data-theme="dark"]`) :
- Fond `--bg` ≈ `#16140F`, surface `#1F1C16`, surface alt `#272219`
- Encre `--ink` ≈ `#ECE6DA`, douce `#B6AE9F`, faible `#8A8273`
- Accent cobalt clair `#7E93FF`, miel `#E8B24A`, bordure `#332E25`

Contraste visé : AA (corps ≥ 4.5:1, grand texte ≥ 3:1) dans les deux thèmes.

## Typographie
- Display / titres : **Space Grotesk** (700/600/500) — géométrique, caractère technique.
- Corps / UI : **Inter** (400/500/600).
- Code / mono : **JetBrains Mono** (400/500/700).
- Fallbacks système si CDN indisponible (voir variables.css).
- Échelle (modulaire ~1.2 / 1.25) : 0.78 / 0.875 / 1 / 1.125 / 1.33 / 1.66 / 2.1 / 2.8 / 3.6 rem.
- Corps 1.0625rem, interligne 1.7, mesure 62–72 caractères sur les pages de lecture.

## Espacement (échelle 4px)
`--sp-1`=4, `2`=8, `3`=12, `4`=16, `5`=24, `6`=32, `7`=48, `8`=64, `9`=96, `10`=128.

## Rayons / ombres
- Rayons : `--r-sm`=6, `--r-md`=10, `--r-lg`=16, `--r-pill`=999. (Mesurés, pas « 8px partout ».)
- Ombres : `--shadow-1` (carte au survol), `--shadow-2` (éléments flottants : menu, code copier).

## Composants réutilisables (css/components.css)
Boutons (primaire/secondaire/fantôme), cartes (cours, fonctionnalité, leçon), badges de statut
(Complet/Aperçu/Bientôt), puces de niveau, kicker mono, encadrés (note/piège/astuce/plus-loin),
blocs de code + barre + copier, sommaire (TOC) avec scrollspy, barre de progression, nav
précédent/suivant, fil d'Ariane, champ de recherche, bascule de thème, menu mobile.

### `.variante` — « Une autre façon de le faire »
Encadré de leçon qui montre une **seconde façon d'écrire la même chose**. Structure imposée, et
contrôlée par `node tools/verif-alternatives.js` (mode `--mutations` pour éprouver le contrôle) :

```html
<aside class="variante" aria-label="Une autre façon de le faire">
  <div class="variante__head"><svg class="variante__icon" … aria-hidden="true">…</svg>
    <p class="variante__title">Une autre façon de le faire</p></div>
  <p class="variante__lead">…ce qu'est la variante, en une phrase…</p>
  <figure class="code-block" data-file="…"><pre><code class="language-…">…</code></pre></figure>
  <dl class="variante__facts">
    <div><dt>Ce qu'elle coûte</dt><dd>…</dd></div>
    <div><dt>Ce qu'elle apporte</dt><dd>…</dd></div>
    <div><dt>Quand la préférer</dt><dd>…</dd></div>
  </dl>
</aside>
```

Règles : les trois libellés sont **fixes et dans cet ordre** ; chaque réponse fait au moins
80 caractères et cite une **mesure**, jamais une impression ; pas de titre `<h…>` dans le bloc
(il polluerait le sommaire) ; au plus 3 blocs par leçon. L'accent suit la couleur du cours
(`var(--accent)`), donc le bloc change de teinte d'un cours à l'autre sans réglage.

## Boucle qualité
Chaque type de page est rendu via Chrome headless (`tools/shot.ps1`) en desktop (1440) et mobile
(390), critiqué sur les 8 axes (hiérarchie, espacement, alignement, typo, contraste, couleur,
fidélité système, réalisme), corrigé, re-capturé. Captures dans `tools/shots/`.
