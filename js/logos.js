/* =============================================================================
   logos.js — Icônes de langage en SVG inline (monochrome, currentColor).
   Aucune requête réseau (file:// OK). Icônes ORIGINALES et génériques
   (badges à lettres + formes évocatrices), pas de reproduction de marque.

   - window.courseLogo(id)  -> chaîne SVG pour un id de cours (ou "" si aucun)
   - au chargement : remplit les éléments [data-course-logo] (hero, cartes statiques)
   - catalogue.js / cours.js appellent courseLogo() directement (rendu dynamique)
   ============================================================================= */
(function () {
  "use strict";

  var SVG = '<svg viewBox="0 0 24 24" class="lang-logo" aria-hidden="true" focusable="false"';

  /* Badge : carré arrondi au trait + texte centré (style des logos « à lettres ») */
  function badge(label, fs) {
    return (
      SVG + ' fill="none">' +
      '<rect x="2.5" y="2.5" width="19" height="19" rx="4.5" stroke="currentColor" stroke-width="1.7"/>' +
      '<text x="12" y="12.6" text-anchor="middle" dominant-baseline="central" font-size="' + fs + '" fill="currentColor">' +
      label +
      "</text></svg>"
    );
  }

  /* Forme au trait (cohérente avec les autres icônes du site) */
  function stroke(inner, extra) {
    return (
      SVG + ' fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"' +
      (extra || "") + ">" + inner + "</svg>"
    );
  }

  var LOGOS = {
    /* Familles « à lettres » */
    javascript: badge("JS", 8.5),
    typescript: badge("TS", 8.5),
    c: badge("C", 11),
    cpp: badge("C++", 7),
    csharp: badge("C#", 9),
    go: badge("Go", 8.5),
    php: SVG + ' fill="none"><rect x="1.5" y="6" width="21" height="12" rx="6" stroke="currentColor" stroke-width="1.6"/><text x="12" y="12.4" text-anchor="middle" dominant-baseline="central" font-size="6.6" fill="currentColor">php</text></svg>',

    /* Formes évocatrices */
    /* Python : serpent stylisé (double courbe + tête) */
    python: stroke(
      '<path d="M8.5 5.5c2.4 0 3.5 1.1 3.5 3.2 0 2-1.2 3.3-3.5 3.3-2.6 0-3.9 1.3-3.9 3.4 0 2.2 1.4 3.4 3.9 3.4"/>' +
      '<circle cx="8.6" cy="5.6" r="0.2"/><path d="M15.5 18.5c-2.4 0-3.5-1.1-3.5-3.2"/><circle cx="9.4" cy="8.4" r="0.9" fill="currentColor" stroke="none"/>'
    ),
    /* React / composants : atome (3 ellipses + noyau) */
    react: SVG + ' fill="none" stroke="currentColor" stroke-width="1.4"><circle cx="12" cy="12" r="1.7" fill="currentColor" stroke="none"/><ellipse cx="12" cy="12" rx="10" ry="4.1"/><ellipse cx="12" cy="12" rx="10" ry="4.1" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="10" ry="4.1" transform="rotate(120 12 12)"/></svg>',
    /* Node : hexagone + N */
    nodejs: SVG + ' fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"><path d="M12 2.6 20.4 7.3v9.4L12 21.4 3.6 16.7V7.3z"/><text x="12" y="12.8" text-anchor="middle" dominant-baseline="central" font-size="7.5" fill="currentColor" stroke="none">N</text></svg>',
    /* Java : tasse de café + vapeur */
    java: stroke(
      '<path d="M5 11h12v3a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4z"/><path d="M17 12h1.5a2 2 0 1 1 0 4H17"/>' +
      '<path d="M9 4c-.8 1 .8 1.8 0 2.8M13 3.6c-.9 1.1.9 2 0 3.1"/>'
    ),
    /* Rust : engrenage à dents (système / mécanique) */
    rust: stroke(
      '<path d="M10.32 4.32c.43-1.76 2.93-1.76 3.36 0a1.72 1.72 0 0 0 2.57 1.06c1.54-.94 3.31.83 2.37 2.37a1.72 1.72 0 0 0 1.06 2.57c1.76.43 1.76 2.93 0 3.36a1.72 1.72 0 0 0-1.06 2.57c.94 1.54-.83 3.31-2.37 2.37a1.72 1.72 0 0 0-2.57 1.06c-.43 1.76-2.93 1.76-3.36 0a1.72 1.72 0 0 0-2.57-1.06c-1.54.94-3.31-.83-2.37-2.37a1.72 1.72 0 0 0-1.06-2.57c-1.76-.43-1.76-2.93 0-3.36a1.72 1.72 0 0 0 1.06-2.57c-.94-1.54.83-3.31 2.37-2.37a1.72 1.72 0 0 0 2.57-1.06z"/>' +
      '<circle cx="12" cy="12" r="3"/>'
    ),
    /* HTML : balises code dans un écusson */
    html: stroke(
      '<path d="M4 3h16l-1.4 15.5L12 21l-6.6-2.5z"/><path d="M9.3 8.5 7.5 11l1.8 2.5M14.7 8.5 16.5 11l-1.8 2.5"/>'
    ),
    /* CSS : pinceau (mise en forme) */
    css: stroke(
      '<path d="M14.5 4.5 19.5 9.5"/><path d="M16.5 6.5 9 14a3.5 3.5 0 0 1-1.2.8l-3.3 1.1 1.1-3.3A3.5 3.5 0 0 1 6.4 11l7.5-7.5z" transform="translate(.3 .3)"/><path d="M4.5 20c1.5.3 3-.2 3.6-1.6.5-1.2-.2-2.5-1.4-2.9-1.2-.4-1.9.4-2.2 1.3-.3.9-.7 1.6-1.5 1.7 .6.9 1.4 1.4 1.5 1.5z"/>'
    ),
    /* Git : branche (gestion de versions) */
    git: stroke(
      '<circle cx="6" cy="6" r="2.3"/><circle cx="6" cy="18" r="2.3"/><circle cx="17.5" cy="9.5" r="2.3"/>' +
      '<path d="M6 8.3v7.4M7.9 7.9l8 0" /><path d="M15.5 11.3a8 8 0 0 1-7.3 4.6" transform="translate(0 0)"/>'
    ),
    /* SQL : cylindre de base de données */
    sql: stroke(
      '<ellipse cx="12" cy="5.5" rx="7.5" ry="2.8"/>' +
      '<path d="M4.5 5.5v13c0 1.55 3.36 2.8 7.5 2.8s7.5-1.25 7.5-2.8v-13"/>' +
      '<path d="M4.5 12c0 1.55 3.36 2.8 7.5 2.8s7.5-1.25 7.5-2.8"/>'
    ),
    /* Bash : fenêtre de terminal */
    bash: stroke(
      '<rect x="2.5" y="4.5" width="19" height="15" rx="2.5"/>' +
      '<path d="m6.5 10 3 2.5-3 2.5M12.8 15.5H17"/>'
    ),

    /* ---- Langages des vagues 1 à 3 ---- */
    /* Ruby : gemme taillée */
    ruby: stroke(
      '<path d="M7 4h10l4 6-9 10L3 10z"/><path d="M3 10h18M7 4l5 6 5-6M12 10v10"/>'
    ),
    kotlin: badge("Kt", 8.5),
    swift: badge("Sw", 8.5),
    r: badge("R", 11),
    pandas: badge("pd", 9.5),
    dataviz: badge("dv", 9.5),
    stats: badge("st", 9.5),
    "data-eng": badge("de", 9.5),
    /* Concevoir une BDD : deux tables reliées (schéma entité-association) */
    bdd: stroke(
      '<rect x="2.5" y="3" width="9" height="8.5" rx="1.2"/><path d="M2.5 5.6h9"/><path d="M4.4 7.7h5M4.4 9.4h5"/>' +
      '<rect x="12.5" y="12.5" width="9" height="8.5" rx="1.2"/><path d="M12.5 15.1h9"/><path d="M14.4 17.2h5M14.4 18.9h5"/>' +
      '<path d="M11.5 9.4c3.2 0 2 5.4 5 5.4"/>'
    ),
    /* Mobile : smartphone stylisé (écouteur, corps, barre d'accueil) */
    mobile: stroke(
      '<rect x="6.5" y="2.5" width="11" height="19" rx="2.4"/>' +
      '<path d="M10.5 5h3"/><path d="M10 18.5h4"/>'
    ),
    /* Équipe : deux personnes côte à côte (travail collectif) */
    equipe: stroke(
      '<circle cx="9" cy="8" r="3.1"/>' +
      '<path d="M3.5 19.5a5.5 5.5 0 0 1 11 0"/>' +
      '<path d="M16 5.2a3.1 3.1 0 0 1 0 5.7"/>' +
      '<path d="M17.4 13.6a5.5 5.5 0 0 1 3.1 5.9"/>'
    ),
    dart: badge("Da", 8.5),
    /* Lua : croissant de lune (« lua » = lune) */
    lua: stroke('<path d="M19.5 14.2A8.2 8.2 0 1 1 9.8 4.5a6.6 6.6 0 0 0 9.7 9.7z"/>'),
    /* Assembleur : puce (CPU) */
    asm: stroke(
      '<rect x="6" y="6" width="12" height="12" rx="2"/><rect x="9.6" y="9.6" width="4.8" height="4.8"/>' +
      '<path d="M9 6V3M15 6V3M9 21v-3M15 21v-3M6 9H3M6 15H3M21 9h-3M21 15h-3"/>'
    ),
    haskell: badge("λ", 11),
    /* Elixir : goutte */
    elixir: stroke('<path d="M12 3c3.5 4.2 6.5 7.6 6.5 11a6.5 6.5 0 1 1-13 0C5.5 10.6 8.5 7.2 12 3z"/>'),
    scala: badge("Sc", 8.5),
    powershell: badge("PS", 8.5),
    perl: badge("Pl", 8.5),
    cobol: badge("Cb", 8.5),
    fortran: badge("F", 11),
    julia: badge("Jl", 8.5),
    zig: badge("Zg", 8.5),
    lisp: badge("( )", 8),
    ocaml: badge("Oc", 8.5),
    fsharp: badge("F#", 9),
    clojure: badge("Cj", 8.5),
    prolog: badge("?-", 9.5),
    ada: badge("Ada", 7),
    pascal: badge("Pa", 8.5),
    vb: badge("VB", 8.5),
    objc: badge("[ ]", 8.5),
    erlang: badge("Er", 8.5),
    groovy: badge("Gv", 8.5),
    solidity: badge("So", 8.5),

    /* ---- Cours modernes ---- */
    /* Machine Learning : nuage de points + droite de régression */
    ml: stroke(
      '<path d="M4 4v16h16"/>' +
      '<path d="M6.5 17 17.5 7.5"/>' +
      '<circle cx="8" cy="16" r="1" fill="currentColor" stroke="none"/>' +
      '<circle cx="11" cy="13.2" r="1" fill="currentColor" stroke="none"/>' +
      '<circle cx="14" cy="11" r="1" fill="currentColor" stroke="none"/>' +
      '<circle cx="16.8" cy="8.4" r="1" fill="currentColor" stroke="none"/>'
    ),
    /* Kubernetes : roue de gouvernail (orchestration) */
    kubernetes: stroke(
      '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="2.6"/>' +
      '<path d="M12 3.5v3M12 17.5v3M3.5 12h3M17.5 12h3"/>' +
      '<path d="m6.1 6.1 2.1 2.1M17.9 6.1l-2.1 2.1M6.1 17.9l2.1-2.1M17.9 17.9l-2.1-2.1"/>'
    ),
    /* GraphQL : graphe de nœuds reliés (triangle) */
    graphql: stroke(
      '<path d="M12 4.5 19 16.5H5z"/>' +
      '<circle cx="12" cy="4.5" r="1.7" fill="currentColor" stroke="none"/>' +
      '<circle cx="19" cy="16.5" r="1.7" fill="currentColor" stroke="none"/>' +
      '<circle cx="5" cy="16.5" r="1.7" fill="currentColor" stroke="none"/>'
    ),
    /* LLM : bulle de dialogue + étincelle (IA générative) */
    llm: stroke(
      '<path d="M3.5 5.5h17a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H10l-4 3v-3H3.5a1 1 0 0 1-1-1v-8a1 1 0 0 1 1-1z"/>' +
      '<path d="m13 8 .9 2.1 2.1.9-2.1.9L13 14l-.9-2.1-2.1-.9 2.1-.9z" fill="currentColor" stroke="none"/>'
    ),
    /* Accessibilité : pictogramme universel (personnage bras écartés dans un cercle) */
    a11y: stroke(
      '<circle cx="12" cy="12" r="9.2"/>' +
      '<circle cx="12" cy="6.7" r="1.35" fill="currentColor" stroke="none"/>' +
      '<path d="M6.6 9.4h10.8"/><path d="M12 9.2v4M12 13.2 9.6 17.6M12 13.2l2.4 4.4"/>'
    ),
    /* Performance : compteur de vitesse (arc + aiguille) */
    "perf-web": stroke(
      '<path d="M3.5 17a8.5 8.5 0 0 1 17 0"/>' +
      '<path d="M12 17l4.6-4.1"/>' +
      '<circle cx="12" cy="17" r="1.2" fill="currentColor" stroke="none"/>' +
      '<path d="M4.6 13.5l1.5.6M19.4 13.5l-1.5.6M12 8.5v1.6"/>'
    ),
    /* Cloud : nuage stylisé */
    cloud: stroke(
      '<path d="M7 18a4 4 0 0 1-.5-7.97A5.5 5.5 0 0 1 17 9.5a3.75 3.75 0 0 1 .3 8.5z"/>'
    ),
    /* Infrastructure as Code : blocs reliés (infra modulaire en code) */
    iac: stroke(
      '<rect x="3.5" y="3.5" width="7" height="7" rx="1"/><rect x="13.5" y="3.5" width="7" height="7" rx="1"/>' +
      '<rect x="3.5" y="13.5" width="7" height="7" rx="1"/><rect x="13.5" y="13.5" width="7" height="7" rx="1"/>' +
      '<path d="M10.5 7h3M7 10.5v3M17 10.5v3M10.5 17h3"/>'
    ),
    /* Architecture : couches empilées (architecture en couches) */
    archi: stroke(
      '<path d="M12 3 21 7.5 12 12 3 7.5z"/>' +
      '<path d="M3 12l9 4.5 9-4.5M3 16.5l9 4.5 9-4.5"/>'
    ),
    /* WebAssembly : badge à lettres */
    wasm: badge("Wa", 8.5),
    /* Linux : badge à lettres */
    linux: badge("Lx", 8.5),
    /* Réseaux : badge à lettres */
    reseaux: badge("Net", 7),
    /* UX & design : badge à lettres */
    ux: badge("UX", 8.5),
    /* Observabilité : badge à lettres */
    observabilite: badge("Obs", 7),
    /* Systèmes d'exploitation : badge à lettres */
    os: badge("OS", 8.5),
    /* Compilation : un arbre de syntaxe — la racine, deux branches, les feuilles */
    compilation: stroke(
      '<circle cx="12" cy="5" r="2.2"/><circle cx="6" cy="19" r="2.2"/><circle cx="18" cy="19" r="2.2"/>' +
      '<path d="M10.5 6.6 7.5 17.3M13.5 6.6l3 10.7"/>'
    ),
  };

  /* id de cours -> clé de logo (les variantes partagent le logo du langage) */
  var ID_TO_LOGO = {
    javascript: "javascript", algo: "javascript", "projets-js": "javascript",
    python: "python",
    html: "html",
    css: "css",
    git: "git", sql: "sql", react: "react", nodejs: "nodejs", typescript: "typescript",
    bash: "bash", java: "java", c: "c", cpp: "cpp", csharp: "csharp", go: "go", rust: "rust", php: "php",
    ruby: "ruby", kotlin: "kotlin", swift: "swift", r: "r", dart: "dart", lua: "lua",
    asm: "asm", haskell: "haskell", elixir: "elixir", scala: "scala", powershell: "powershell", perl: "perl",
    cobol: "cobol", fortran: "fortran", julia: "julia", zig: "zig", lisp: "lisp", ocaml: "ocaml",
    fsharp: "fsharp", clojure: "clojure", prolog: "prolog", ada: "ada", pascal: "pascal", vb: "vb",
    objc: "objc", erlang: "erlang", groovy: "groovy", solidity: "solidity",
    ml: "ml", pandas: "pandas", dataviz: "dataviz", stats: "stats", "data-eng": "data-eng", bdd: "bdd", mobile: "mobile", equipe: "equipe", kubernetes: "kubernetes", graphql: "graphql", llm: "llm", a11y: "a11y",
    "perf-web": "perf-web", cloud: "cloud", iac: "iac", archi: "archi", wasm: "wasm", linux: "linux", reseaux: "reseaux", ux: "ux", observabilite: "observabilite", os: "os", compilation: "compilation",
  };

  function courseLogo(id) {
    var key = ID_TO_LOGO[id];
    return (key && LOGOS[key]) || "";
  }
  window.courseLogo = courseLogo;
  window.SITE_LOGOS = LOGOS;

  /* Remplit les éléments statiques [data-course-logo="<id>"] (hero, cartes accueil) */
  function fillStatic() {
    var els = document.querySelectorAll("[data-course-logo]");
    Array.prototype.forEach.call(els, function (el) {
      var svg = courseLogo(el.getAttribute("data-course-logo"));
      if (svg) el.innerHTML = svg; // sinon, on garde le texte de repli
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", fillStatic);
  } else {
    fillStatic();
  }
})();
