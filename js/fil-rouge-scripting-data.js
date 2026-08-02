/* =============================================================================
   fil-rouge-scripting-data.js — FIL ROUGE « Automatiser le système ».
   UNE même mission d'automatisation menée sur trois terrains : on scripte sous
   Unix/Linux (Bash), on automatise Windows (PowerShell), puis on traite du texte
   en masse (Perl) : bash → powershell → perl.
   Définit window.FIL_ROUGE → moteur générique js/fil-rouge.js.
   Page : pages/fil-rouge-scripting.html. 100 % file://.
   ============================================================================= */
window.FIL_ROUGE = {
  id: "scripting",
  titre: "Automatiser le système",
  sousTitre: "Une même corvée, automatisée sur trois terrains : la ligne de commande Unix, Windows, puis le traitement de texte de masse.",
  intro:
    "<p>Les tâches répétitives — renommer des fichiers, analyser des journaux, sauvegarder, générer des rapports — sont " +
    "exactement ce qu'un ordinateur devrait faire <strong>à ta place</strong>. Ce fil rouge prend une mission " +
    "d'<strong>automatisation</strong> et la décline sur trois terrains complémentaires, pour découvrir la culture et les " +
    "forces de chaque outil.</p>" +
    "<p>On commence par le <strong>shell Unix</strong> (Bash), socle de l'automatisation côté serveur, puis on passe à " +
    "<strong>PowerShell</strong> et son approche par <strong>objets</strong> pour Windows, et on finit avec <strong>Perl</strong>, " +
    "spécialiste du <strong>traitement de texte</strong>. Trois philosophies pour un même but : ne plus jamais refaire à la " +
    "main ce qu'on peut scripter.</p>",
  etapes: [
    {
      n: 1,
      course: "bash",
      courseTitle: "Bash",
      dir: "bash",
      accent: "bash",
      phase: "Unix",
      titre: "Scripter la ligne de commande (Bash)",
      depart: "Un dossier de fichiers à organiser et des journaux (logs) à analyser sur une machine Unix/Linux.",
      objectif:
        "<p>Automatiser des tâches courantes au <strong>shell</strong> : enchaîner des commandes, parcourir des fichiers, " +
        "filtrer du texte avec les outils classiques (<code>grep</code>, <code>sed</code>, <code>awk</code>) et en faire un " +
        "<strong>script réutilisable</strong>.</p>",
      ajoute: [
        "Un <strong>script shell</strong> avec variables, conditions et boucles.",
        "Le parcours de fichiers et l'usage des <strong>tubes</strong> (<code>|</code>) et redirections.",
        "Le filtrage de texte avec <strong>grep/sed/awk</strong>.",
        "Des <strong>arguments</strong> de script et un code de sortie correct.",
      ],
      criteres: [
        "Le script s'exécute et <strong>automatise</strong> réellement la tâche manuelle de départ.",
        "Il utilise <strong>variables, conditions et boucles</strong> à bon escient.",
        "Le texte est filtré avec les <strong>outils Unix</strong> chaînés par des tubes.",
        "Le script accepte des <strong>arguments</strong> et renvoie un <strong>code de sortie</strong> cohérent.",
        "Il est <strong>réutilisable</strong> (pas de chemins ni de valeurs en dur inutiles).",
      ],
      livrable: "Un script Bash qui automatise une tâche d'organisation/analyse sur un système Unix.",
    },
    {
      n: 2,
      course: "powershell",
      courseTitle: "PowerShell",
      dir: "powershell",
      accent: "powershell",
      phase: "Windows",
      titre: "Automatiser Windows par objets (PowerShell)",
      depart: "La même mission d'automatisation, mais côté Windows.",
      objectif:
        "<p>Refaire l'automatisation avec <strong>PowerShell</strong>, dont la force est de manipuler des <strong>objets</strong> " +
        "(et non du texte brut) : des <strong>cmdlets</strong> reliées par un pipeline qui transmet des objets typés, filtrés " +
        "et triés par leurs propriétés.</p>",
      ajoute: [
        "Un script PowerShell utilisant des <strong>cmdlets</strong> (Verbe-Nom) et le pipeline.",
        "Le filtrage/tri par <strong>propriétés d'objets</strong> (<code>Where-Object</code>, <code>Sort-Object</code>).",
        "Des <strong>variables</strong>, des conditions et une fonction paramétrée.",
        "Une <strong>sortie structurée</strong> (objets, export CSV/JSON) plutôt que du texte plat.",
      ],
      criteres: [
        "Le script automatise la <strong>même mission</strong> qu'en Bash, côté Windows.",
        "Il manipule des <strong>objets</strong> via le pipeline (pas du parsing de texte fragile).",
        "Le filtrage/tri se fait sur les <strong>propriétés</strong> des objets.",
        "La logique est encapsulée dans une <strong>fonction</strong> paramétrée et réutilisable.",
        "La sortie est <strong>structurée</strong> (exploitable par un autre outil).",
      ],
      livrable: "Un script PowerShell qui réalise la même automatisation par objets sous Windows.",
    },
    {
      n: 3,
      course: "perl",
      courseTitle: "Perl",
      dir: "perl",
      accent: "perl",
      phase: "Texte",
      titre: "Traiter le texte en masse (Perl)",
      depart: "Un gros volume de texte (journaux, exports) à transformer et à résumer.",
      objectif:
        "<p>Exploiter la force historique de <strong>Perl</strong> : le <strong>traitement de texte</strong> et les " +
        "<strong>expressions régulières</strong>. Lire de gros fichiers ligne à ligne, extraire des motifs, transformer et " +
        "produire un <strong>rapport</strong> synthétique.</p>",
      ajoute: [
        "La lecture de fichiers <strong>ligne à ligne</strong> et le parcours efficace de gros volumes.",
        "Des <strong>expressions régulières</strong> pour extraire et transformer des motifs.",
        "Des structures de données (<strong>tableaux, tables de hachage</strong>) pour agréger.",
        "La génération d'un <strong>rapport</strong> final (comptes, totaux, anomalies).",
      ],
      criteres: [
        "Le programme lit et traite un <strong>gros volume</strong> de texte sans tout charger en mémoire.",
        "Les <strong>expressions régulières</strong> extraient correctement les motifs visés.",
        "Les données sont <strong>agrégées</strong> dans des structures adaptées (hachages).",
        "Un <strong>rapport</strong> clair et juste est produit en sortie.",
        "Le script reste <strong>lisible</strong> malgré la densité (commenté là où c'est utile).",
      ],
      livrable: "🏁 Une même automatisation maîtrisée sur trois terrains : Unix (Bash), Windows (PowerShell) et le texte (Perl) !",
    },
  ],
};
