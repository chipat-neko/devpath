/* =============================================================================
   fil-rouge-fiabilite-data.js — FIL ROUGE « Systèmes fiables & concurrents ».
   Deux philosophies COMPLÉMENTAIRES de la fiabilité : la prévenir par la rigueur
   à la conception (Ada, systèmes critiques), puis y SURVIVRE en production grâce à
   la concurrence et à la supervision (Erlang, tolérance aux pannes) :
   ada → erlang.
   Définit window.FIL_ROUGE → moteur générique js/fil-rouge.js.
   Page : pages/fil-rouge-fiabilite.html. 100 % file://.
   ============================================================================= */
window.FIL_ROUGE = {
  id: "fiabilite",
  titre: "Systèmes fiables & concurrents",
  sousTitre: "Deux façons complémentaires de bâtir des systèmes qui ne tombent pas : prévenir les erreurs par la rigueur, puis survivre aux pannes par la concurrence.",
  intro:
    "<p>Un logiciel <strong>fiable</strong> ne s'obtient pas par chance. Deux grandes stratégies s'opposent et se " +
    "complètent : <strong>empêcher</strong> les erreurs avant qu'elles n'arrivent (rigueur, types forts, contrats), et " +
    "<strong>survivre</strong> à celles qui surviennent quand même (isolation, supervision, redémarrage). Ce fil rouge " +
    "explore les deux, à travers deux langages emblématiques.</p>" +
    "<p>On commence par <strong>Ada</strong>, conçu pour les systèmes <strong>critiques</strong> (aéronautique, ferroviaire) " +
    "où l'on prévient l'erreur par la <strong>rigueur</strong> ; puis <strong>Erlang</strong>, conçu pour les systèmes " +
    "<strong>télécoms</strong> qui ne s'arrêtent jamais, où l'on accepte la panne et où l'on s'organise pour y " +
    "<strong>résister</strong> (« <em>let it crash</em> », processus isolés, arbres de supervision). Prévenir et résister : " +
    "les deux faces de la fiabilité.</p>",
  etapes: [
    {
      n: 1,
      course: "ada",
      courseTitle: "Ada",
      dir: "ada",
      accent: "ada",
      phase: "Prévenir",
      titre: "Prévenir l'erreur par la rigueur (Ada)",
      depart: "Un composant où une erreur n'est pas acceptable (calcul critique, contrôle d'un équipement).",
      objectif:
        "<p>Découvrir comment Ada vise la fiabilité <strong>dès la conception</strong> : un <strong>typage fort</strong> et " +
        "des <strong>types contraints</strong>, des <strong>contrats</strong> (préconditions/postconditions) et des " +
        "vérifications qui attrapent les erreurs <strong>tôt</strong> — à la compilation plutôt qu'en production.</p>",
      ajoute: [
        "Des <strong>types forts et contraints</strong> (intervalles, unités) qui interdisent les valeurs absurdes.",
        "Des <strong>contrats</strong> : préconditions, postconditions, invariants explicites.",
        "Une gestion claire des <strong>erreurs</strong> et des cas limites, sans zone d'ombre.",
        "Un code <strong>lisible et explicite</strong>, pensé pour être relu et audité.",
      ],
      criteres: [
        "Les <strong>types</strong> empêchent par construction des états invalides (intervalles respectés).",
        "Les <strong>contrats</strong> (pré/postconditions) expriment et vérifient les hypothèses.",
        "Les erreurs sont détectées <strong>au plus tôt</strong> (compilation / vérifications), pas en production.",
        "Le code est <strong>explicite et auditable</strong> (rien d'implicite ni d'ambigu).",
        "On sait expliquer pourquoi ce composant est <strong>digne de confiance</strong>.",
      ],
      livrable: "Un composant rigoureux où l'erreur est prévenue par les types et les contrats.",
    },
    {
      n: 2,
      course: "erlang",
      courseTitle: "Erlang",
      dir: "erlang",
      accent: "erlang",
      phase: "Résister",
      titre: "Résister aux pannes par la concurrence (Erlang)",
      depart: "Un service qui doit rester disponible en continu, malgré des erreurs inévitables en production.",
      objectif:
        "<p>Adopter la philosophie d'Erlang : plutôt que de tout prévenir, <strong>isoler</strong> les défaillances et s'en " +
        "<strong>remettre</strong>. Des <strong>processus légers</strong> qui ne partagent rien, le principe « <strong>let it " +
        "crash</strong> », et des <strong>arbres de supervision</strong> qui redémarrent ce qui tombe.</p>",
      ajoute: [
        "Des <strong>processus légers</strong> isolés qui communiquent par <strong>messages</strong> (rien de partagé).",
        "Le principe « <strong>let it crash</strong> » : on laisse échouer proprement plutôt que de tout blinder.",
        "Des <strong>superviseurs</strong> qui surveillent et <strong>redémarrent</strong> les processus défaillants.",
        "Une disponibilité maintenue <strong>malgré</strong> les erreurs (tolérance aux pannes).",
      ],
      criteres: [
        "Le travail est réparti en <strong>processus isolés</strong> communiquant par messages.",
        "Une défaillance reste <strong>localisée</strong> et ne fait pas tomber tout le système.",
        "Un <strong>superviseur</strong> redémarre proprement les processus en échec.",
        "Le service reste <strong>disponible</strong> malgré des erreurs en cours d'exécution.",
        "On comprend la complémentarité avec l'étape 1 : <strong>prévenir</strong> ET <strong>résister</strong>.",
      ],
      livrable: "🏁 Deux faces de la fiabilité maîtrisées : prévenir l'erreur (Ada) et résister à la panne (Erlang) !",
    },
  ],
};
