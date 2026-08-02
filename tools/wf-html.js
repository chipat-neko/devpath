export const meta = {
  name: 'syntaxe-html',
  description: 'Rédige les leçons HTML 02 à 15 (cours complet) et assemble le HTML',
  phases: [{ title: 'Rédaction' }, { title: 'Relecture' }],
};

function buildLesson(p) {
  const objectives = p.objectives.map((o) => '                  <li>' + o + '</li>').join('\n');
  return `<!DOCTYPE html>
<html lang="fr" data-theme="light">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${p.title} — Leçon ${p.num} · HTML · Syntaxe</title>
    <meta name="description" content="${p.metaDesc}" />
    <link rel="icon" type="image/svg+xml" href="../../assets/img/favicon.svg" />

    <script src="../../js/theme.js"></script>

    <link rel="stylesheet" href="../../css/fonts.css" />

    <link rel="stylesheet" href="../../css/variables.css" />
    <link rel="stylesheet" href="../../css/base.css" />
    <link rel="stylesheet" href="../../css/layout.css" />
    <link rel="stylesheet" href="../../css/components.css" />
    <link rel="stylesheet" href="../../css/pages.css" />
  </head>

  <body data-course="html" data-lesson="lecon-${p.num}.html">
    <a class="skip-link" href="#contenu">Aller au contenu</a>

    <header class="site-header">
      <div class="container--wide container site-header__inner">
        <a class="brand" href="../../index.html" aria-label="Syntaxe — accueil">
          <svg class="brand__mark" viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <rect x="3" y="3" width="26" height="26" rx="8" /><path d="M13 12 L9 16 L13 20" /><path d="M19 12 L23 16 L19 20" />
          </svg>
          <span>Syntaxe<span class="brand__dot" aria-hidden="true">.</span></span>
        </a>
        <button class="nav-toggle" data-nav-toggle aria-expanded="false" aria-controls="primary-nav" aria-label="Ouvrir le menu de navigation">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M3 6h18M3 12h18M3 18h18" /></svg>
        </button>
        <nav class="primary-nav" id="primary-nav" aria-label="Navigation principale">
          <a href="../../index.html">Accueil</a>
          <a href="../catalogue.html">Catalogue</a>
          <a href="../js/cours.html">Cours JavaScript</a>
          <a href="../../index.html#pourquoi">Notre approche</a>
        </nav>
        <div class="header-actions">
          <button class="theme-toggle" data-theme-toggle aria-label="Activer le thème sombre">
            <svg class="icon icon-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" /></svg>
            <svg class="icon icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="4.5" /><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4" /></svg>
          </button>
        </div>
      </div>
    </header>

    <div class="reading-progress" data-reading-progress aria-hidden="true"></div>

    <main id="contenu">
      <div class="container container--wide">
        <nav class="breadcrumb-nav" aria-label="Fil d'Ariane">
          <ol class="breadcrumb">
            <li><a href="../../index.html">Accueil</a></li>
            <li><a href="../catalogue.html">Catalogue</a></li>
            <li><a href="cours.html">HTML</a></li>
            <li aria-current="page">Leçon ${p.num}</li>
          </ol>
        </nav>

        <div class="lesson-layout">
          <aside class="lesson-rail lesson-coursenav" data-coursenav-host aria-label="Plan du cours">
            <button class="coursenav-toggle" data-coursenav-toggle aria-expanded="false">
              <span>Plan du cours</span>
              <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M6 9l6 6 6-6" /></svg>
            </button>
            <div class="coursenav-panel"><div data-coursenav></div></div>
          </aside>

          <div class="lesson-main">
            <header class="lesson-header">
              <p class="kicker">Module ${p.modNum} · ${p.modName} — Leçon ${p.num}</p>
              <h1 class="lesson-header__title">${p.title}</h1>
              <div class="meta-row">
                <span class="duration">
                  <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
                  ~${p.durationMin} min
                </span>
                <span class="dot-sep"><span class="pill pill--debutant">Débutant</span></span>
                <span class="dot-sep">${p.prereq}</span>
              </div>

              <div class="objectives">
                <p class="objectives__title">À la fin de cette leçon, tu sauras</p>
                <ul>
${objectives}
                </ul>
              </div>
            </header>

            <details class="toc-inline" open>
              <summary>Sommaire de la leçon</summary>
              <nav class="toc" aria-label="Sommaire de la leçon"><div data-toc></div></nav>
            </details>

            <article class="prose">
${p.body}

              <button class="btn btn--primary" data-complete-toggle aria-pressed="false">
                <span>Marquer comme terminée</span>
              </button>

              <nav class="lesson-nav" data-lesson-nav aria-label="Navigation entre leçons"></nav>
            </article>
          </div>

          <aside class="lesson-rail lesson-toc-rail" aria-label="Sommaire">
            <p class="toc__title">Sur cette page</p>
            <nav class="toc" aria-label="Sommaire de la leçon"><div data-toc></div></nav>
          </aside>
        </div>
      </div>
    </main>

    <footer class="site-footer">
      <div class="container">
        <div class="site-footer__bottom">
          <span>© <span data-year>2026</span> Syntaxe. Projet de démonstration.</span>
          <span><a href="cours.html">← Retour au programme du cours</a></span>
        </div>
      </div>
    </footer>

    <script src="../../js/data.js" defer></script>
    <script src="../../js/main.js" defer></script>
    <script src="../../js/lecon.js" defer></script>
    <script src="../../js/runner.js" defer></script>
    <script src="../../assets/vendor/prism/prism-core.min.js" defer></script>
    <script src="../../assets/vendor/prism/prism-clike.min.js" defer></script>
    <script src="../../assets/vendor/prism/prism-markup.min.js" defer></script>
    <script src="../../assets/vendor/prism/prism-css.min.js" defer></script>
  </body>
</html>
`;
}

const ICON_NOTE = '<svg class="callout__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M12 8h.01M11 12h1v4h1" /></svg>';
const ICON_WARN = '<svg class="callout__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" /><path d="M12 9v4M12 17h.01" /></svg>';
const ICON_TIP = '<svg class="callout__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12c.7.7 1 1.2 1 2h6c0-.8.3-1.3 1-2a7 7 0 0 0-4-12Z" /></svg>';
const ICON_MORE = '<svg class="callout__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 3v14M5 10l7 7 7-7M5 21h14" /></svg>';

const INSTRUCTIONS = `Tu rédiges une leçon du cours « HTML : structurer le web » (site Syntaxe). Public : grands DÉBUTANTS.
La leçon 1 (« Structurer une page en HTML ») a déjà posé : ce qu'est le HTML, la notion de balise, le
squelette d'un document (doctype, html, head, body), les titres/paragraphes, une intro aux balises
sémantiques, et les listes/liens/images survolés. Tu approfondis à partir de là.
Français, tutoiement, ton clair et concret, du connu vers l'inconnu.

ATOUT DE CE COURS : sur chaque bloc de code HTML, un bouton « 👁 Aperçu » permet au lecteur de VOIR le
rendu en direct (l'éditeur intégré). Écris donc des exemples HTML COMPLETS et AUTONOMES qui rendent
quelque chose de visible, et invite explicitement (une fois, via un encadré Astuce) à cliquer « Aperçu ».

TU PRODUIS UNIQUEMENT { metaDesc, objectives, body } :
- metaDesc : ~150 caractères.
- objectives : 3 à 4 chaînes (« savoir faire X »), HTML inline autorisé (<code>, <strong>). «&nbsp;;» puis «.» pour la dernière.
- body : HTML INTÉRIEUR de <article class="prose"> (sans la balise article, sans bouton « terminer », sans nav — ajoutés automatiquement).

STRUCTURE du body (≈1100–1600 mots) :
1. 1–2 <p> d'intro.
2. 5 à 8 sections <h2> courtes (alimentent le sommaire), chacune avec un exemple de code HTML commenté.
3. <h2>Pièges fréquents</h2>.
4. <h2>Pour aller plus loin</h2>.
5. <h2>Récap et vérification</h2> : résumé en <ul> + bloc lesson-check (3 questions).
6. <h2>Exercices</h2> : exactement 3 exercices gradués (Échauffement, Application, Défi) avec solution repliable.

COMPOSANTS HTML EXACTS (n'invente pas d'autres classes) :
- Code HTML : <figure class="code-block" data-file="index.html"><pre><code class="language-markup">CODE_HTML_ÉCHAPPÉ</code></pre></figure>.
- Code CSS (si vraiment utile pour illustrer) : class="language-css".
- Légende : <p class="code-caption">…</p>
- Note : <div class="callout callout--note">${ICON_NOTE}<div class="callout__body"><p class="callout__title">Note</p><p>…</p></div></div>
- Piège : <div class="callout callout--warn">${ICON_WARN}<div class="callout__body"><p class="callout__title">Piège fréquent</p><p>…</p></div></div>
- Astuce : <div class="callout callout--tip">${ICON_TIP}<div class="callout__body"><p class="callout__title">Astuce</p><p>…</p></div></div>
- Pour aller plus loin : <div class="callout callout--more">${ICON_MORE}<div class="callout__body"><p class="callout__title">Pour aller plus loin</p><p>…</p></div></div>
- Vérification : <div class="lesson-check"><p class="kicker kicker--gold">Vérifie ta compréhension</p><ol><li>…</li><li>…</li><li>…</li></ol></div>
- Exercice : <div class="exercise"><div class="exercise__head"><span class="exercise__num">Exercice 1</span><span class="exercise__level">Échauffement</span></div><p>…</p><details><summary>Voir une solution</summary><figure class="code-block" data-file="solution.html"><pre><code class="language-markup">…</code></pre></figure></details></div>

ÉCHAPPEMENT (CRITIQUE — beaucoup de balises) : DANS un <code>, toute balise HTML d'exemple DOIT être échappée :
« < » → « &lt; », « > » → « &gt; » (ex. « &lt;p&gt;Texte&lt;/p&gt; »), et « & » → « &amp; ». N'écris JAMAIS une balise
réelle non échappée dans un bloc de code, sinon elle casserait la page.

RÈGLES : aucun style inline (pas d'attribut style=) dans les exemples HTML — privilégie les classes ou,
si une démo a besoin d'un peu de style, une balise &lt;style&gt; échappée dans l'exemple. HTML d'exemple
VALIDE, SÉMANTIQUE et ACCESSIBLE (alt sur les images, label sur les champs, scope sur les th, etc.).
Pas de <script>/<style>/style= dans la PAGE elle-même (ton body ne contient que de la prose + des blocs de code).`;

const SCHEMA = {
  type: 'object', additionalProperties: false,
  required: ['metaDesc', 'objectives', 'body'],
  properties: {
    metaDesc: { type: 'string' },
    objectives: { type: 'array', items: { type: 'string' }, minItems: 3, maxItems: 4 },
    body: { type: 'string' },
  },
};

const SPECS = [
  { num: '02', modNum: '01', modName: 'Les fondations', durationMin: 26, title: 'Le texte : titres, paragraphes, listes', prereq: 'Leçon 01 recommandée',
    brief: `Sujet : structurer le contenu textuel d'une page.
Sections : (1) Les titres &lt;h1&gt; à &lt;h6&gt; : une HIÉRARCHIE (h1 = titre principal, un seul par page), ne pas sauter de niveaux, choisir le niveau pour le SENS (pas pour la taille — ça c'est le CSS). (2) Les paragraphes &lt;p&gt; ; le saut de ligne &lt;br&gt; (à réserver aux adresses/poèmes, pas pour espacer) ; la ligne de séparation thématique &lt;hr&gt;. (3) Les listes NON ORDONNÉES &lt;ul&gt;&lt;li&gt; (puces) et ORDONNÉES &lt;ol&gt;&lt;li&gt; (numérotées, attribut start/type). (4) Les listes IMBRIQUÉES (un &lt;ul&gt; dans un &lt;li&gt;). (5) Les listes de DÉFINITIONS &lt;dl&gt;&lt;dt&gt;&lt;dd&gt; (terme/définition). (6) Les CITATIONS : &lt;blockquote&gt; (bloc) et &lt;q&gt; (en ligne), &lt;cite&gt; pour la source ; le texte préformaté &lt;pre&gt;.
Donne un exemple complet et VISIBLE (titre + paragraphes + une liste) et invite à cliquer « 👁 Aperçu ».
Pièges : choisir un niveau de titre pour sa TAILLE ; abuser de &lt;br&gt; pour espacer ; listes mal imbriquées (le &lt;ul&gt; enfant va DANS un &lt;li&gt;) ; sauter de h2 à h4.
Pour aller plus loin : le « plan » du document (document outline) formé par les titres, l'importance pour l'accessibilité et le SEO.
Exercices : (1) écrire un titre h1 et deux paragraphes ; (2) créer une liste ordonnée de 3 étapes ; (3) construire une liste à puces contenant une sous-liste imbriquée.`,
  },
  { num: '03', modNum: '01', modName: 'Les fondations', durationMin: 26, title: 'Liens et navigation', prereq: 'Leçon 02 recommandée',
    brief: `Sujet : créer des liens et une navigation.
Sections : (1) Le lien &lt;a href="..."&gt;texte&lt;/a&gt; : la base du web. (2) Liens INTERNES (vers une autre page du site : href="apropos.html") vs EXTERNES (href="https://...") ; chemins RELATIFS vs ABSOLUS. (3) Les ANCRES : href="#section" saute vers l'élément d'id="section" sur la page ; lien vers une ancre d'une autre page (page.html#section). (4) Les liens SPÉCIAUX : mailto:adresse, tel:numero. (5) Ouvrir dans un nouvel onglet : target="_blank" — toujours avec rel="noopener noreferrer" (sécurité). (6) Télécharger : attribut download. (7) La NAVIGATION : une &lt;nav&gt; contenant une &lt;ul&gt; de liens.
Exemple visible (un petit menu de navigation) + invite « 👁 Aperçu ».
Pièges : texte de lien non descriptif (« cliquez ici ») — mauvais pour l'accessibilité et le SEO ; target="_blank" sans rel="noopener" ; ancre vers un id inexistant ; chemin relatif cassé.
Pour aller plus loin : les états d'un lien (:link/:visited/:hover, côté CSS), aria-current="page" pour le lien actif, les liens d'évitement (skip links).
Exercices : (1) créer un lien externe qui s'ouvre dans un nouvel onglet en toute sécurité ; (2) faire un sommaire avec des ancres vers des sections ; (3) écrire un menu &lt;nav&gt; de 4 liens.`,
  },
  { num: '04', modNum: '01', modName: 'Les fondations', durationMin: 28, title: 'Images et médias visuels', prereq: 'Leçon 03 recommandée',
    brief: `Sujet : insérer des images correctement.
Sections : (1) &lt;img src="..." alt="..."&gt; : src = la source, alt = le texte alternatif (DÉCRIT l'image pour les lecteurs d'écran et si l'image ne charge pas). Image décorative : alt="" (vide, volontaire). (2) Préciser width et height (évite le décalage de mise en page au chargement — CLS). (3) Les FORMATS : JPEG (photos), PNG (transparence), WebP/AVIF (modernes, légers), SVG (vectoriel, logos/icônes). (4) &lt;figure&gt; + &lt;figcaption&gt; pour une image avec légende. (5) Le RESPONSIVE : srcset + sizes (servir une image adaptée à l'écran) ; &lt;picture&gt; + &lt;source&gt; (changer de format ou d'image selon les conditions). (6) Le chargement différé : loading="lazy".
Exemple visible (une figure avec image — utilise une URL d'image publique ou un placeholder, + une légende) ; invite « 👁 Aperçu ».
Pièges : alt manquant (inaccessible) ou inutile (« image1.jpg ») ; images énormes non optimisées ; oublier width/height ; mettre du texte important dans une image.
Pour aller plus loin : art direction avec &lt;picture&gt;, formats modernes, images de fond (CSS) vs &lt;img&gt; (contenu).
Exercices : (1) insérer une image avec un alt pertinent ; (2) entourer une image d'une &lt;figure&gt; avec &lt;figcaption&gt; ; (3) marquer une image décorative avec alt="" et expliquer pourquoi.`,
  },
  { num: '05', modNum: '02', modName: 'Contenu riche', durationMin: 28, title: 'Tableaux de données', prereq: 'Module 1 recommandé',
    brief: `Sujet : présenter des données tabulaires.
Sections : (1) Un tableau sert aux DONNÉES (pas à la mise en page !). Structure : &lt;table&gt;, lignes &lt;tr&gt;, cellules &lt;td&gt;. (2) Les en-têtes &lt;th&gt; avec scope="col" (colonne) ou scope="row" (ligne) — essentiel pour l'accessibilité. (3) La &lt;caption&gt; (titre du tableau, premier enfant). (4) Les sections &lt;thead&gt;, &lt;tbody&gt;, &lt;tfoot&gt; (en-tête, corps, pied). (5) Fusionner des cellules : colspan (colonnes) et rowspan (lignes). (6) Exemple complet et VISIBLE : un petit tableau (3 colonnes, en-têtes, 2-3 lignes) avec caption ; invite « 👁 Aperçu » (le rendu montre les bordures grâce au style de base de l'aperçu).
Pièges : utiliser un tableau pour la MISE EN PAGE (interdit, inaccessible) ; oublier &lt;th&gt; et scope ; pas de &lt;caption&gt; ; cellules mal alignées (colspan/rowspan).
Pour aller plus loin : tableaux responsives (défilement horizontal, CSS), tris/filtres (JS), associer th et td complexes (headers/id).
Exercices : (1) créer un tableau de 2 colonnes avec en-têtes ; (2) ajouter une &lt;caption&gt; et &lt;thead&gt;/&lt;tbody&gt; ; (3) fusionner deux cellules avec colspan.`,
  },
  { num: '06', modNum: '02', modName: 'Contenu riche', durationMin: 26, title: 'Audio et vidéo', prereq: 'Leçon 05 recommandée',
    brief: `Sujet : intégrer des médias audio et vidéo.
Sections : (1) La VIDÉO : &lt;video controls width="..." poster="..."&gt; ... &lt;/video&gt; ; controls = affiche les commandes ; poster = image d'aperçu. (2) L'AUDIO : &lt;audio controls&gt; ... &lt;/audio&gt;. (3) Plusieurs FORMATS avec &lt;source src="film.webm" type="video/webm"&gt; (le navigateur prend le premier qu'il sait lire) + un texte de repli entre les balises. (4) Les SOUS-TITRES &lt;track kind="subtitles" src="..." srclang="fr" label="Français"&gt; — accessibilité. (5) Les attributs : autoplay (à ÉVITER, surtout avec du son), muted, loop, preload. (6) Exemple complet (une vidéo avec controls et une source ; pour l'aperçu, on peut utiliser une URL de vidéo de test ou expliquer). Invite « 👁 Aperçu ».
Pièges : autoplay avec son (rejeté par les navigateurs, agressif) ; un seul format (compatibilité) ; pas de sous-titres (inaccessible) ; vidéos lourdes.
Pour aller plus loin : streaming, &lt;iframe&gt; YouTube (leçon suivante), l'API média (JS), formats et codecs.
Exercices : (1) intégrer une vidéo avec controls et un poster ; (2) proposer deux &lt;source&gt; de formats différents ; (3) ajouter une piste de sous-titres &lt;track&gt;.`,
  },
  { num: '07', modNum: '02', modName: 'Contenu riche', durationMin: 26, title: 'Contenu intégré (iframe, SVG)', prereq: 'Leçon 06 recommandée',
    brief: `Sujet : intégrer du contenu externe ou graphique.
Sections : (1) L'&lt;iframe&gt; : intègre une AUTRE page dans la tienne (carte, vidéo YouTube, formulaire externe). Attributs : src, title (OBLIGATOIRE pour l'accessibilité), width/height, loading="lazy", sandbox (restreint ce que la page intégrée peut faire — sécurité), allow. (2) Exemple : intégrer une carte ou une vidéo via iframe (avec title). (3) Le SVG INLINE : dessiner des formes/icônes directement dans le HTML (&lt;svg&gt;&lt;circle/&gt;&lt;path/&gt;&lt;/svg&gt;) — net à toute taille, stylable en CSS. Exemple : une petite icône SVG VISIBLE (invite « 👁 Aperçu »). (4) SVG inline vs &lt;img src="icone.svg"&gt; (quand préférer l'un ou l'autre). (5) &lt;embed&gt; / &lt;object&gt; (PDF, contenu externe) en bref. (6) &lt;canvas&gt; (dessin via JS) en une phrase.
Pièges : iframe sans title (inaccessible) ; intégrer du contenu tiers sans sandbox (sécurité) ; trop d'iframes (performance) ; SVG inline énorme illisible (préférer un fichier).
Pour aller plus loin : sandbox en détail, lazy-loading des iframes, animer un SVG (CSS/JS), accessibilité du SVG (role, title).
Exercices : (1) intégrer une iframe avec un title ; (2) écrire un petit SVG inline qui affiche un cercle coloré ; (3) ajouter sandbox et loading="lazy" à une iframe et expliquer.`,
  },
  { num: '08', modNum: '03', modName: 'Les formulaires', durationMin: 28, title: 'Les formulaires : structure et envoi', prereq: 'Module 2 recommandé',
    brief: `Sujet : la structure d'un formulaire et son envoi.
Sections : (1) À quoi sert un formulaire : recueillir des données (connexion, contact, recherche). (2) La balise &lt;form action="..." method="..."&gt; : action = où envoyer, method = GET (données dans l'URL, recherches) ou POST (dans le corps, données sensibles/longues). (3) Le couple LABEL + CHAMP : &lt;label for="email"&gt;E-mail&lt;/label&gt; &lt;input id="email" name="email"&gt; — le for relie le label au champ (clic = focus, lecteurs d'écran). (4) L'attribut name : la CLÉ sous laquelle la valeur est envoyée (sans name, le champ n'est pas envoyé). (5) Le &lt;button type="submit"&gt; (envoyer), "reset" (réinitialiser), "button" (neutre). (6) Regrouper avec &lt;fieldset&gt; + &lt;legend&gt;. (7) Exemple complet : un mini formulaire de contact (nom, email, message, bouton) VISIBLE ; invite « 👁 Aperçu ».
Pièges : un champ sans &lt;label&gt; (inaccessible) ; oublier name (valeur non envoyée) ; &lt;button&gt; sans type dans un form (type=submit par défaut, peut envoyer par surprise) ; mauvais method.
Pour aller plus loin : où vont les données (un serveur, hors périmètre), formspree/services, l'envoi en JavaScript (fetch), CSRF (mention).
Exercices : (1) créer un champ avec son label associé ; (2) écrire un formulaire POST avec nom + email + bouton submit ; (3) regrouper des champs dans un fieldset avec legend.`,
  },
  { num: '09', modNum: '03', modName: 'Les formulaires', durationMin: 30, title: 'Les champs de saisie', prereq: 'Leçon 08 recommandée',
    brief: `Sujet : la palette des champs de formulaire.
Sections : (1) &lt;input type="..."&gt; et ses nombreux types : text, email, password, number, tel, url, search, date, time, color, range, file, hidden. Chaque type adapte le clavier mobile et la validation. (2) Les CASES À COCHER &lt;input type="checkbox"&gt; (plusieurs choix indépendants) et les BOUTONS RADIO &lt;input type="radio" name="..."&gt; (un seul choix — le name COMMUN les regroupe). (3) La zone de texte multiligne &lt;textarea&gt;&lt;/textarea&gt; (rows/cols). (4) La liste déroulante &lt;select&gt;&lt;option value="..."&gt;&lt;/select&gt;, groupée par &lt;optgroup&gt;, option par défaut selected. (5) Les suggestions &lt;datalist&gt;. (6) placeholder (indice, PAS un remplacement du label) ; value (valeur initiale). (7) Exemple : un formulaire VISIBLE mêlant plusieurs types (invite « 👁 Aperçu »).
Pièges : utiliser placeholder à la place du &lt;label&gt; (disparaît à la saisie, inaccessible) ; radios sans name commun (sélection multiple non voulue) ; type="text" pour tout (perte de la validation/clavier adaptés) ; oublier value sur les &lt;option&gt;.
Pour aller plus loin : autocomplete, inputmode, accept (file), multiple, le stylage des contrôles (CSS).
Exercices : (1) créer un groupe de 3 boutons radio exclusifs ; (2) une liste déroulante de 4 options ; (3) un champ email avec un placeholder ET un label.`,
  },
  { num: '10', modNum: '03', modName: 'Les formulaires', durationMin: 28, title: 'La validation native des formulaires', prereq: 'Leçon 09 recommandée',
    brief: `Sujet : valider les saisies sans JavaScript.
Sections : (1) Le navigateur peut VALIDER avant l'envoi, gratuitement. (2) required : champ obligatoire. (3) Les contraintes de longueur minlength / maxlength ; de valeur min / max / step (number, date, range). (4) Le format avec pattern="[expression régulière]" (ex. un code postal &lt;input pattern="\\d{5}"&gt;) + title pour le message d'aide. (5) La validation par TYPE : type="email" et type="url" vérifient automatiquement le format. (6) Le retour visuel : les pseudo-classes :valid / :invalid / :required (côté CSS, mention). (7) Exemple : un formulaire avec required, email, pattern — VISIBLE, invite « 👁 Aperçu » et à tester l'envoi.
Pièges : se fier à la validation CLIENT SEULE — le serveur DOIT toujours revalider (sécurité) ; pattern trop strict (rejette des saisies valides) ; messages d'erreur par défaut peu clairs (utiliser title) ; oublier que required sur un radio s'applique au groupe.
Pour aller plus loin : la Constraint Validation API (setCustomValidity, en JS), novalidate, les messages personnalisés, l'accessibilité des erreurs (aria-invalid, aria-describedby).
Exercices : (1) rendre un champ obligatoire et de type email ; (2) limiter un champ à 5 chiffres avec pattern ; (3) imposer un nombre entre 1 et 10 avec min/max.`,
  },
  { num: '11', modNum: '04', modName: 'La sémantique', durationMin: 28, title: 'Les balises sémantiques de structure', prereq: 'Module 3 recommandé',
    brief: `Sujet : structurer une page avec du sens (au-delà des &lt;div&gt;).
Sections : (1) Pourquoi la sémantique : le navigateur, les lecteurs d'écran et les moteurs de recherche COMPRENNENT mieux une page faite de balises qui ont un sens, qu'une « soupe de div ». (2) &lt;header&gt; (en-tête d'une page ou d'une section), &lt;nav&gt; (navigation principale), &lt;main&gt; (le contenu principal, UN SEUL par page), &lt;footer&gt; (pied). (3) &lt;article&gt; (contenu autonome, réutilisable : un billet, une carte produit) vs &lt;section&gt; (regroupement thématique, normalement AVEC un titre). (4) &lt;aside&gt; (contenu lié mais secondaire : encadré, pub). (5) Exemple : le squelette sémantique complet d'une page (header/nav/main/article/aside/footer) — VISIBLE, invite « 👁 Aperçu ». (6) Quand &lt;div&gt; reste légitime (regroupement purement stylistique sans valeur sémantique).
Pièges : tout mettre en &lt;div&gt; ; plusieurs &lt;main&gt; ; une &lt;section&gt; sans titre ; confondre &lt;article&gt; et &lt;section&gt; ; mettre la &lt;nav&gt; n'importe où.
Pour aller plus loin : le « plan » (outline) du document, les landmarks pour lecteurs d'écran, &lt;search&gt; (récent), imbriquer header/footer dans un article.
Exercices : (1) transformer une page en div en version sémantique ; (2) écrire une &lt;section&gt; avec un titre h2 ; (3) structurer un billet de blog avec &lt;article&gt;, header et footer internes.`,
  },
  { num: '12', modNum: '04', modName: 'La sémantique', durationMin: 26, title: 'La sémantique du texte', prereq: 'Leçon 11 recommandée',
    brief: `Sujet : donner du sens aux mots, pas seulement un style.
Sections : (1) Le principe : préférer la balise qui exprime le SENS, le style viendra du CSS. (2) Importance et emphase : &lt;strong&gt; (importance forte) vs &lt;b&gt; (gras visuel sans importance) ; &lt;em&gt; (emphase, accent à l'oral) vs &lt;i&gt; (italique visuel : terme étranger, titre d'œuvre). (3) &lt;mark&gt; (surlignage/pertinence), &lt;small&gt; (mentions légales), &lt;del&gt;/&lt;ins&gt; (supprimé/ajouté). (4) Données : &lt;time datetime="2026-06-08"&gt; (date lisible par la machine), &lt;abbr title="..."&gt; (abréviation), &lt;cite&gt; (titre d'œuvre/source). (5) Code et entrées : &lt;code&gt;, &lt;kbd&gt; (touche), &lt;samp&gt; (sortie). (6) &lt;sub&gt;/&lt;sup&gt; (indice/exposant), &lt;q&gt; (citation en ligne). (7) Exemple VISIBLE mêlant plusieurs de ces balises ; invite « 👁 Aperçu ».
Pièges : utiliser &lt;b&gt;/&lt;i&gt; là où le SENS compte (préférer strong/em) ; &lt;abbr&gt; sans title ; &lt;time&gt; sans datetime au bon format ; détourner &lt;blockquote&gt; pour indenter.
Pour aller plus loin : la différence b/strong et i/em pour les lecteurs d'écran, les microdonnées, l'attribut lang sur un passage en langue étrangère.
Exercices : (1) baliser une date avec &lt;time&gt; ; (2) marquer une abréviation avec son title ; (3) réécrire un paragraphe en remplaçant &lt;b&gt;/&lt;i&gt; par &lt;strong&gt;/&lt;em&gt; là où c'est justifié.`,
  },
  { num: '13', modNum: '05', modName: 'Accessibilité, métadonnées & qualité', durationMin: 30, title: "L'accessibilité (a11y, ARIA)", prereq: 'Module 4 recommandé',
    brief: `Sujet : rendre une page utilisable par TOUS.
Sections : (1) Pourquoi : des personnes utilisent un lecteur d'écran, naviguent au clavier, ont une basse vision… L'accessibilité (a11y) profite à tout le monde. (2) La base, c'est le HTML SÉMANTIQUE : titres hiérarchisés, &lt;button&gt; pour les actions (pas une &lt;div&gt; cliquable), &lt;a&gt; pour naviguer, &lt;label&gt; pour les champs, alt sur les images, lang sur &lt;html&gt;. (3) Le CLAVIER : tout doit être atteignable et utilisable au clavier (Tab), l'ordre du DOM = l'ordre de tabulation, un focus VISIBLE. Les liens d'évitement (skip links). (4) ARIA, quand le HTML ne suffit pas : role, aria-label / aria-labelledby (nommer), aria-hidden (masquer du décoratif), aria-expanded (état), aria-live (annoncer un changement). (5) La RÈGLE D'OR : « pas d'ARIA vaut mieux qu'un mauvais ARIA » — toujours préférer l'élément HTML natif. (6) Le contraste des couleurs (côté CSS, mention AA). (7) Exemple : un composant accessible (ex. un bouton avec aria-label, une image décorative aria-hidden) ; invite « 👁 Aperçu ».
Pièges : &lt;div onclick&gt; au lieu de &lt;button&gt; (pas focusable/clavier) ; ARIA qui CONTREDIT le HTML ; images sans alt ; supprimer le contour de focus sans le remplacer ; titres utilisés pour la taille.
Pour aller plus loin : WCAG (niveaux A/AA/AAA), tester au clavier et au lecteur d'écran, les outils (axe, Lighthouse), le focus management (JS).
Exercices : (1) remplacer une &lt;div&gt; cliquable par un &lt;button&gt; ; (2) donner un nom accessible à un bouton-icône (aria-label) ; (3) marquer une image purement décorative comme ignorée par les lecteurs d'écran.`,
  },
  { num: '14', modNum: '05', modName: 'Accessibilité, métadonnées & qualité', durationMin: 28, title: 'Métadonnées, SEO et partage', prereq: 'Leçon 13 recommandée',
    brief: `Sujet : ce qui se passe dans le &lt;head&gt; et le référencement.
Sections : (1) Le rôle du &lt;head&gt; : des informations SUR la page, non affichées dans le corps. (2) &lt;title&gt; : le titre de l'onglet ET le titre dans les résultats de recherche (crucial pour le SEO, unique par page). (3) &lt;meta name="description" content="..."&gt; : le résumé affiché sous le titre dans Google. (4) Les meta techniques : &lt;meta charset="utf-8"&gt;, &lt;meta name="viewport" content="width=device-width, initial-scale=1"&gt; (responsive), lang sur &lt;html&gt;. (5) Les &lt;link&gt; : rel="icon" (favicon), rel="stylesheet" (CSS), rel="canonical" (URL de référence). (6) Le PARTAGE SOCIAL : Open Graph (&lt;meta property="og:title"&gt;, og:description, og:image, og:url) et Twitter Cards — l'aperçu quand on partage un lien. (7) &lt;meta name="robots"&gt; (indexation). Données structurées (JSON-LD) en mention.
Pièges : &lt;title&gt; générique ou identique partout ; pas de meta description ; viewport manquant (page non responsive) ; og:image absente (partage moche) ; charset mal placé.
Pour aller plus loin : les données structurées (schema.org), le sitemap, robots.txt, les performances comme facteur SEO.
Exercices : (1) écrire un &lt;head&gt; complet (title, description, charset, viewport, lang) ; (2) ajouter les balises Open Graph de base ; (3) relier un favicon et une feuille de style.`,
  },
  { num: '15', modNum: '05', modName: 'Accessibilité, métadonnées & qualité', durationMin: 28, title: 'Bonnes pratiques, validation & structure', prereq: 'Leçon 14 recommandée',
    brief: `Sujet : écrire du HTML propre, valide et maintenable — et synthèse du cours.
Sections : (1) HTML VALIDE : passer sa page au validateur du W3C ; pourquoi ça compte (compatibilité, robustesse). (2) Une bonne STRUCTURE : un seul &lt;h1&gt;, une hiérarchie de titres cohérente, le « plan » du document. (3) Lisibilité du code : indentation, minuscules pour balises/attributs, guillemets autour des valeurs, fermer les balises, commentaires &lt;!-- ... --&gt;. (4) Encodage UTF-8 et caractères spéciaux (&amp;amp; &amp;lt; &amp;copy; ...). (5) La SÉPARATION des responsabilités (rappel) : HTML = structure, CSS = présentation, JS = comportement ; charger le CSS dans le head, le JS avec defer. (6) Performance de base : images optimisées, scripts différés. (7) &lt;h2&gt;Et après&lt;/h2&gt; : la suite naturelle, c'est le CSS pour mettre en forme — renvoyer au cours CSS — puis JavaScript pour l'interactivité. Encourager.
Remplace « Pièges fréquents » par une CHECKLIST DE QUALITÉ (liste à puces de points à vérifier avant publication). GARDE « Pour aller plus loin », « Récap et vérification » et « Exercices ».
Exercices : (1) repérer et corriger 3 erreurs dans un extrait HTML donné (balise non fermée, attribut sans guillemets, h1 multiple) ; (2) écrire une page minimale parfaitement valide ; (3) établir sa propre checklist de publication en 5 points.`,
  },
];

log('Rédaction de ' + SPECS.length + ' leçons (HTML)…');

const results = await pipeline(
  SPECS,
  (s) =>
    agent(
      INSTRUCTIONS +
        '\n\n=== LEÇON À RÉDIGER ===\nNuméro : ' + s.num + ' | Module ' + s.modNum + ' (' + s.modName + ')\nTitre : ' + s.title +
        '\n\nBRIEF DÉTAILLÉ (intègre fidèlement le contenu et les exemples ; échappe toutes les balises ; rends les exemples visibles) :\n' + s.brief,
      { label: 'écrit L' + s.num, phase: 'Rédaction', schema: SCHEMA }
    ),
  (parts, s) =>
    agent(
      INSTRUCTIONS +
        '\n\n=== RELECTURE CRITIQUE (corrige et renvoie la version finale, même schéma) ===\nLeçon ' + s.num + ' « ' + s.title + ' ».\n' +
        '1. EXACTITUDE du HTML : exemples corrects, sémantiques, ACCESSIBLES (alt, label, scope, title sur iframe…).\n' +
        '2. ÉCHAPPEMENT (essentiel) : DANS les blocs de code, toute balise est échappée — « < »→« &lt; », « > »→« &gt; », « & »→« &amp; ». Vérifie qu\'AUCUNE balise réelle ne traîne dans un &lt;code&gt;.\n' +
        '3. EXEMPLES VISIBLES : les blocs HTML doivent rendre quelque chose au clic « 👁 Aperçu » ; un encadré invite à l\'essayer.\n' +
        '4. STRUCTURE : intro, 5–8 sections <h2>, Pièges fréquents (sauf L15 : checklist), Pour aller plus loin, Récap et vérification (lesson-check), Exercices (3 gradués avec solutions).\n' +
        '5. AUCUN style=, &lt;style&gt; ou &lt;script&gt; réel dans la page ; pas de style inline dans les exemples (classes ou &lt;style&gt; échappé).\n\n' +
        'BRIEF DE RÉFÉRENCE :\n' + s.brief + '\n\nBROUILLON (JSON) :\n' + JSON.stringify(parts),
      { label: 'relit L' + s.num, phase: 'Relecture', schema: SCHEMA }
    ).then((fixed) => {
      const p = fixed || parts;
      const html = buildLesson({
        num: s.num, modNum: s.modNum, modName: s.modName, durationMin: s.durationMin,
        title: s.title, prereq: s.prereq, metaDesc: p.metaDesc, objectives: p.objectives, body: p.body,
      });
      return { file: 'lecon-' + s.num + '.html', html, num: s.num };
    })
);

const ok = results.filter(Boolean);
log('Leçons assemblées : ' + ok.length + '/' + SPECS.length);
return ok;
