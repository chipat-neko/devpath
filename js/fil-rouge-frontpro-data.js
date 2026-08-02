/* =============================================================================
   fil-rouge-frontpro-data.js — FIL ROUGE « Un front-end de pro ».
   UNE page web qu'on hisse au niveau professionnel, couche par couche : on la rend
   ACCESSIBLE à tous (a11y), on la rend RAPIDE et bien référencée (perf-web), puis on
   DÉLÈGUE le calcul lourd à WebAssembly pour garder une UX fluide : a11y → perf-web → wasm.
   Définit window.FIL_ROUGE → moteur générique js/fil-rouge.js.
   Page : pages/fil-rouge-frontpro.html. 100 % file://.
   ============================================================================= */
window.FIL_ROUGE = {
  id: "frontpro",
  titre: "Un front-end de pro",
  sousTitre: "Prends une page qui marche et hisse-la au niveau pro : accessible à tous, rapide et bien référencée, puis capable de calcul lourd sans ramer.",
  intro:
    "<p>Une page « qui s'affiche » n'est pas une page <strong>professionnelle</strong>. Le niveau pro se construit en " +
    "<strong>couches</strong> : être utilisable par <em>tout le monde</em>, se charger <em>vite</em>, et rester " +
    "<em>fluide</em> même quand le travail devient lourd. Ce fil rouge prend une page existante et la fait monter en " +
    "qualité sur ces trois fronts.</p>" +
    "<p>On commence par l'<strong>accessibilité</strong> (la base d'un web pour tous), puis la <strong>performance</strong> " +
    "et le <strong>référencement</strong> (une page rapide qu'on trouve), et enfin l'usage de <strong>WebAssembly</strong> " +
    "pour confier le calcul intensif au bon outil sans figer l'interface. Chaque étape s'appuie sur la précédente : " +
    "accessible <em>et</em> rapide <em>et</em> performante.</p>",
  etapes: [
    {
      n: 1,
      course: "a11y",
      courseTitle: "Accessibilité web",
      dir: "a11y",
      accent: "a11y",
      phase: "Rendre accessible",
      titre: "Rendre l'interface accessible à tous",
      depart: "Une page web fonctionnelle, mais pensée « à la souris » et sans souci d'accessibilité.",
      objectif:
        "<p>Ouvrir la page à <strong>tous les utilisateurs</strong>, y compris au clavier et aux lecteurs d'écran : une " +
        "structure <strong>sémantique</strong>, une navigation <strong>clavier</strong> complète, des <strong>contrastes</strong> " +
        "suffisants et des <strong>alternatives textuelles</strong> pour les images.</p>",
      ajoute: [
        "Une structure <strong>HTML sémantique</strong> (titres hiérarchisés, repères <code>main</code>/<code>nav</code>…).",
        "Une <strong>navigation au clavier</strong> complète, avec un <strong>focus visible</strong>.",
        "Des <strong>contrastes</strong> de couleur suffisants (niveau AA) et un texte redimensionnable.",
        "Des <strong>alternatives textuelles</strong> pertinentes et des libellés de formulaire associés.",
      ],
      criteres: [
        "La page se parcourt <strong>entièrement au clavier</strong>, dans un ordre logique, focus visible.",
        "La <strong>structure sémantique</strong> est correcte (un seul h1, hiérarchie des titres, repères).",
        "Les <strong>contrastes</strong> respectent au moins le niveau AA.",
        "Chaque image porteuse de sens a une <strong>alternative textuelle</strong> ; les champs ont un libellé.",
        "Un audit (axe / Lighthouse a11y) ne signale plus d'erreur <strong>majeure</strong>.",
      ],
      livrable: "Une page utilisable par tous : clavier, lecteur d'écran, contrastes — l'accessibilité comme socle.",
    },
    {
      n: 2,
      course: "perf-web",
      courseTitle: "Performance & SEO web",
      dir: "perf-web",
      accent: "perf-web",
      phase: "Rendre rapide",
      titre: "Accélérer le chargement et soigner le référencement",
      depart: "La page accessible de l'étape 1, mais lente à charger et peu optimisée pour les moteurs.",
      objectif:
        "<p>Faire de la page une page <strong>rapide</strong> et <strong>trouvable</strong> : optimiser les <strong>Web " +
        "Vitals</strong> (LCP, CLS, INP), alléger images et JavaScript, exploiter le cache, et poser les bases du " +
        "<strong>SEO technique</strong>.</p>",
      ajoute: [
        "Des <strong>images optimisées</strong> (formats modernes, dimensions, <strong>lazy-loading</strong>).",
        "Un <strong>chemin critique</strong> allégé (JS/CSS différés, moins de blocage du rendu).",
        "Une stabilité visuelle (éviter les sauts de mise en page → <strong>CLS</strong> faible).",
        "Les bases du <strong>SEO technique</strong> : balises <code>title</code>/meta, titres, données structurées.",
      ],
      criteres: [
        "Les <strong>Web Vitals</strong> sont bons (LCP rapide, CLS faible, interactions réactives).",
        "Les <strong>images</strong> sont optimisées et chargées paresseusement quand c'est pertinent.",
        "Le <strong>JavaScript</strong> ne bloque plus le rendu initial (différé/scindé).",
        "Le <strong>SEO de base</strong> est en place (titres, métadonnées, structure).",
        "Un audit <strong>Lighthouse</strong> montre un score performance nettement amélioré.",
      ],
      livrable: "Une page rapide et bien référencée, sans rien sacrifier de l'accessibilité acquise.",
    },
    {
      n: 3,
      course: "wasm",
      courseTitle: "WebAssembly",
      dir: "wasm",
      accent: "wasm",
      phase: "Accélérer le calcul",
      titre: "Déléguer le calcul lourd à WebAssembly",
      depart: "La page accessible et rapide, mais une fonctionnalité de calcul intensif (image, données…) la fait ramer.",
      objectif:
        "<p>Garder l'interface <strong>fluide</strong> même sur du calcul lourd : porter la portion intensive en " +
        "<strong>WebAssembly</strong>, la charger et l'appeler depuis JavaScript, et <strong>mesurer</strong> le gain — JS " +
        "orchestre la page, Wasm calcule.</p>",
      ajoute: [
        "Un <strong>module Wasm</strong> (compilé depuis C/Rust) pour la portion de calcul intensif.",
        "Le <strong>chargement</strong> et l'<strong>appel</strong> du module depuis JavaScript (<code>instance.exports</code>).",
        "Une <strong>comparaison chronométrée</strong> JS vs Wasm pour justifier le choix.",
        "Le maintien d'une <strong>UX fluide</strong> (calcul hors du fil principal si besoin : Web Worker).",
      ],
      criteres: [
        "Le calcul lourd est <strong>réellement délégué</strong> à WebAssembly, appelé depuis JS.",
        "L'interface reste <strong>fluide</strong> pendant le calcul (pas de gel perceptible).",
        "Le <strong>gain</strong> est mesuré (comparaison JS vs Wasm, chargement compris).",
        "Le choix de Wasm est <strong>justifié</strong> : le calcul était bien le goulot d'étranglement.",
        "<strong>JS orchestre</strong> (DOM, interface), <strong>Wasm calcule</strong> — chacun à sa place.",
      ],
      livrable: "🏁 Un front-end de pro : accessible à tous, rapide et bien référencé, et fluide même sur du calcul lourd !",
    },
  ],
};
