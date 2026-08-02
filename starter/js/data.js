/* =============================================================================
   data.js — Données du site (kit de démarrage). TOUT le catalogue est ici, en
   global (aucun fetch). Duplique le cours « mon-cours » et remplis-le.
   Voir paramettre.md (§1) pour le détail de chaque champ.
   ============================================================================= */
window.SITE_DATA = (function () {
  "use strict";

  /* Niveaux (servent aussi de classes CSS : pill--debutant, …) */
  var LEVELS = {
    debutant: "Débutant",
    intermediaire: "Intermédiaire",
    avance: "Avancé",
  };

  /* ---- Cartes du catalogue : une entrée par cours -------------------------- */
  var courses = [
    {
      id: "mon-cours",            // identifiant unique (utilisé partout, dont la progression)
      dir: "mon-cours",           // dossier sous pages/  →  pages/mon-cours/cours.html
      title: "Mon premier cours",
      glyph: "MC",                // 2-3 lettres de la pastille
      language: "Exemple",
      level: "debutant",          // debutant | intermediaire | avance
      status: "complet",          // complet | apercu | bientot
      accent: "#2540f0",          // couleur de marque du cours
      lessons: 2,
      hours: 1,
      tagline: "Un cours d'exemple à dupliquer et remplir.",
      tags: ["Démo"],
    },
  ];

  /* ---- Structure détaillée de chaque cours (modules + leçons) -------------- */
  var content = {
    "mon-cours": {
      id: "mon-cours",
      dir: "mon-cours",
      title: "Mon premier cours",
      glyph: "MC",
      accent: "#2540f0",
      overview: "cours.html",
      related: [], // cross-références vers d'autres cours : [{ course:"id", note:"…" }]
      modules: [
        {
          num: "01",
          title: "Premier module",
          sub: "De quoi parle ce module",
          lessons: [
            { num: "01", title: "Première leçon", file: "lecon-01.html", status: "complet" },
            { num: "02", title: "Deuxième leçon", file: "lecon-02.html", status: "complet" },
          ],
        },
      ],
    },
  };

  /* ---- Parcours (itinéraires de cours conseillés) ------------------------- */
  var tracks = [
    // { id:"mon-parcours", title:"Mon parcours", glyph:"→", tagline:"…", courses:["mon-cours"] }
  ];

  /* ---- Durée de chaque leçon (en minutes) --------------------------------- */
  var durations = {
    "mon-cours": { "lecon-01.html": 10, "lecon-02.html": 12 },
  };

  return { LEVELS: LEVELS, courses: courses, content: content, tracks: tracks, durations: durations };
})();
