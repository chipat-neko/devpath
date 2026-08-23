/* =============================================================================
   fil-rouge-systeme-data.js — 2e FIL ROUGE PROGRESSIF : « Construis ton propre
   langage de programmation », du prototype au métal. Le MÊME projet (un lexer,
   un parser, un interpréteur, puis une machine virtuelle à bytecode) ré-implémenté
   et approfondi à chaque cours : Python → algo → C → C++ → Rust → Zig → assembleur.
   Définit window.FIL_ROUGE → rendu par le moteur générique js/fil-rouge.js.
   Page : pages/fil-rouge-systeme.html. 100 % file://.
   ============================================================================= */
window.FIL_ROUGE = {
  id: "systeme",
  titre: "Construis ton propre langage de programmation",
  sousTitre: "Un même projet, de la théorie comprise jusqu'au métal — un lexer, un interpréteur, puis une machine virtuelle.",
  intro:
    "<p>Le projet le plus formateur de l'informatique : <strong>écrire ton propre langage</strong>. Tu commences par " +
    "<strong>comprendre la chaîne</strong> et par la construire une première fois en JavaScript, dans la page ; puis tu " +
    "<strong>ré-implémentes le même projet</strong> de plus en plus bas niveau — " +
    "structures de données, gestion mémoire manuelle, machine virtuelle à bytecode, sûreté garantie, contrôle total, " +
    "et enfin une routine en <strong>assembleur</strong>.</p>" +
    "<p>Le langage à interpréter reste simple (expressions, variables, <code>print</code>) : c'est l'<strong>implémentation</strong> " +
    "qui descend vers la machine à chaque étape. Chaque étape part du livrable précédent (au moins de sa conception) et " +
    "ajoute la dimension du cours.</p>",
  /* Le cours « compilation » a été inséré en étape 1 : les 7 étapes d'origine
     sont décalées de un. La progression étant stockée par NUMÉRO d'étape, il
     faut la convertir une fois, sinon les cases de python réapparaîtraient
     sous compilation. Mécanisme générique : js/fil-rouge.js, migrerStore(). */
  remapVersion: 1,
  remap: { "1": 2, "2": 3, "3": 4, "4": 5, "5": 6, "6": 7, "7": 8 },
  etapes: [
    {
      n: 1,
      course: "compilation",
      courseTitle: "Compilation",
      dir: "compilation",
      accent: "compilation",
      phase: "Comprendre (avant de coder)",
      titre: "La chaîne complète, expliquée puis construite",
      depart: "Rien — sinon l'envie de savoir ce qui se passe entre le texte que tu écris et ce qui s'affiche.",
      objectif:
        "<p>Ce fil demande d'écrire un lexer, un parser, un interpréteur puis une machine à pile. Cette étape " +
        "les <strong>explique</strong> et les fait <strong>construire une première fois</strong>, en JavaScript, " +
        "dans la page : le cours bâtit <em>Brindille</em>, un langage minuscule, du texte source jusqu'au résultat. " +
        "Les six étapes suivantes ré-implémentent ce même projet de plus en plus bas niveau — mais tu sauras " +
        "alors <strong>ce que</strong> tu ré-implémentes.</p>",
      ajoute: [
        "Un <strong>analyseur lexical</strong> qui découpe le texte en jetons, jette les espaces et les commentaires, et retient la <strong>position</strong> de chaque jeton.",
        "Une <strong>grammaire</strong> écrite, et l'analyseur par <strong>descente récursive</strong> qui en découle.",
        "Un <strong>arbre de syntaxe abstraite</strong> où la priorité et l'associativité sont inscrites dans la forme.",
        "Deux moteurs d'exécution&nbsp;: un <strong>évaluateur d'arbre</strong>, puis un <strong>générateur de bytecode</strong> et sa <strong>machine à pile</strong>.",
        "Une <strong>façade</strong> unique, des erreurs qui disent leur <strong>ligne et leur colonne</strong>, un pilote en ligne de commande et une batterie de tests.",
      ],
      criteres: [
        "Le lexique produit des jetons <strong>positionnés</strong>&nbsp;; espaces et commentaires ne laissent aucune trace.",
        "La priorité et l'associativité viennent de la <strong>grammaire</strong>&nbsp;: <code>2 + 3 * 4</code> vaut <strong>14</strong> et <code>10 - 3 - 2</code> vaut <strong>5</strong>.",
        "Les <strong>trois chemins</strong> — arbre, bytecode, bytecode plié — donnent le <strong>même écran</strong> sur le même programme.",
        "Une erreur de chacune des <strong>trois étapes</strong> (lexicale, syntaxique, exécution) est signalée avec sa <strong>ligne et sa colonne</strong>.",
        "Le langage se lance <strong>sur un fichier</strong> et rend un <strong>code de sortie</strong> non nul quand le programme est fautif.",
      ],
      livrable: "Un langage minuscule mais complet : lexique, analyseur, arbre, bytecode, machine, erreurs situées, pilote.",
    },
    {
      n: 2,
      course: "python",
      courseTitle: "Python",
      dir: "python",
      accent: "python",
      phase: "Concevoir (haut niveau)",
      titre: "Le prototype de l'interpréteur",
      depart: "Brindille, construit et compris à l'étape 1 : sa grammaire, son arbre, ses deux moteurs d'exécution.",
      objectif:
        "<p>Prototyper rapidement un <strong>interpréteur arborescent</strong> (<em>tree-walking</em>) en Python : du texte " +
        "source jusqu'au résultat, en passant par un lexer, un parser et un évaluateur.</p>",
      ajoute: [
        "Un <strong>lexer</strong> qui découpe le code source en <em>tokens</em>.",
        "Un <strong>parser</strong> qui construit un arbre de syntaxe (AST).",
        "Un <strong>évaluateur récursif</strong> de l'AST.",
        "Le support des <strong>variables</strong> et de l'affichage (<code>print</code>).",
        "Un petit programme de test (ex. <code>a = 2 + 3 * 4; print a</code>).",
      ],
      criteres: [
        "Le lexer produit une <strong>liste de tokens</strong> à partir du source.",
        "Le parser construit un <strong>AST</strong> (un arbre, pas juste une liste).",
        "L'évaluateur calcule l'arbre de façon <strong>récursive</strong>.",
        "Les <strong>variables</strong> et <code>print</code> fonctionnent.",
        "Le programme de test donne le <strong>bon résultat</strong> (14).",
      ],
      livrable: "Un interpréteur en Python qui exécute un mini-langage.",
    },
    {
      n: 3,
      course: "algo",
      courseTitle: "Algorithmes",
      dir: "algo",
      accent: "algo",
      phase: "Concevoir (haut niveau)",
      titre: "Structures de données & complexité",
      depart: "Le prototype d'interpréteur de l'étape 1.",
      objectif:
        "<p>Solidifier les fondations : un <strong>parsing rigoureux</strong> (priorité des opérateurs) et de vraies " +
        "<strong>structures de données</strong> pour les variables et l'évaluation.</p>",
      ajoute: [
        "Une <strong>table des symboles</strong> efficace pour les variables (dictionnaire / table de hachage).",
        "Un parsing par <strong>priorité d'opérateurs</strong> (descente récursive ou shunting-yard).",
        "Le support des <strong>parenthèses</strong> et de l'associativité.",
        "Une <strong>pile</strong> pour l'évaluation ou les appels.",
        "Une analyse de la <strong>complexité</strong> des opérations clés.",
      ],
      criteres: [
        "Les <strong>priorités</strong> sont correctes (<code>2 + 3 * 4</code> = 14, pas 20).",
        "Les <strong>parenthèses</strong> sont gérées (<code>(2 + 3) * 4</code> = 20).",
        "La <strong>table des symboles</strong> gère recherche et mise à jour efficacement.",
        "Une <strong>pile</strong> structure l'évaluation ou les appels.",
        "La <strong>complexité</strong> des opérations clés est annoncée (O(n)…).",
      ],
      livrable: "Un interpréteur aux fondations solides (parsing + structures correctes).",
    },
    {
      n: 4,
      course: "c",
      courseTitle: "C",
      dir: "c",
      accent: "c",
      phase: "Réimplémenter au bas niveau",
      titre: "Réécriture en C : la mémoire à la main",
      depart: "L'interpréteur (conception maîtrisée aux étapes 1-2).",
      objectif:
        "<p>Réécrire l'interpréteur en <strong>C</strong>, en <strong>gérant toi-même la mémoire</strong> : plus de ramasse-miettes, " +
        "tu alloues et tu libères chaque nœud de l'arbre.</p>",
      ajoute: [
        "Les tokens et l'AST modélisés en <code>struct</code>.",
        "L'<strong>allocation dynamique</strong> (<code>malloc</code>/<code>realloc</code>) des nœuds.",
        "Une <strong>table de hachage maison</strong> pour les variables.",
        "Les <strong>chaînes</strong> gérées à la main (taille, terminaison).",
        "La <strong>libération complète</strong> de la mémoire (<code>free</code>).",
      ],
      criteres: [
        "Des <code>struct</code> modélisent tokens et AST.",
        "La mémoire est <strong>allouée et libérée</strong> sans fuite (pas de <code>free</code> manquant).",
        "Une <strong>table de hachage maison</strong> stocke les variables.",
        "Aucun <strong>accès hors limites</strong> (pointeurs maîtrisés).",
        "Le programme <strong>compile</strong> (<code>-Wall</code>) et exécute le mini-langage.",
        "Aucune <strong>fuite mémoire</strong> (vérifiable avec un outil comme valgrind).",
      ],
      livrable: "L'interpréteur réécrit en C, mémoire gérée manuellement.",
    },
    {
      n: 5,
      course: "cpp",
      courseTitle: "C++",
      dir: "cpp",
      accent: "cpp",
      phase: "Réimplémenter au bas niveau",
      titre: "Une machine virtuelle à bytecode",
      depart: "L'interpréteur arborescent en C de l'étape 3.",
      objectif:
        "<p>Passer de l'interprétation d'arbre à une <strong>machine virtuelle à bytecode</strong> (plus rapide), en " +
        "<strong>C++ moderne</strong> avec la STL et le RAII.</p>",
      ajoute: [
        "Un <strong>compilateur</strong> qui transforme l'AST en <strong>bytecode</strong> (instructions simples).",
        "Une <strong>VM à pile</strong> qui exécute le bytecode.",
        "Un jeu d'<strong>opcodes</strong> (<code>PUSH</code>, <code>ADD</code>, <code>LOAD</code>, <code>STORE</code>…).",
        "Des <strong>conteneurs STL</strong> (<code>vector</code> pour le bytecode et la pile).",
        "La gestion automatique de la mémoire (classes, <strong>RAII</strong>).",
      ],
      criteres: [
        "L'AST est <strong>compilé en bytecode</strong> (un <code>vector</code> d'instructions).",
        "Une <strong>VM à pile</strong> exécute le bytecode.",
        "Au moins <strong>cinq opcodes</strong> sont implémentés.",
        "Des <strong>conteneurs STL</strong> sont utilisés.",
        "La mémoire est gérée par <strong>RAII</strong> (pas de <code>new</code>/<code>delete</code> crus).",
        "Le résultat est <strong>identique</strong> à l'interpréteur des étapes précédentes.",
      ],
      livrable: "Une machine virtuelle à bytecode en C++.",
    },
    {
      n: 6,
      course: "rust",
      courseTitle: "Rust",
      dir: "rust",
      accent: "rust",
      phase: "Sûreté, performance & métal",
      titre: "Une VM sûre et robuste en Rust",
      depart: "La machine virtuelle C++ de l'étape 4.",
      objectif:
        "<p>Réécrire la VM en <strong>Rust</strong> pour une <strong>sûreté mémoire garantie</strong> et une gestion d'erreurs " +
        "propre : plus de <em>segfault</em>, plus de fuite, des erreurs explicites.</p>",
      ajoute: [
        "Les tokens / AST / opcodes modélisés en <strong>enums</strong> (types algébriques).",
        "La gestion d'erreurs avec <code>Result</code> (syntaxe et exécution).",
        "Le <strong>pattern matching</strong> pour dispatcher les opcodes.",
        "L'<strong>ownership</strong> qui élimine fuites et accès invalides.",
        "Une exécution <strong>sans panique</strong> sur une entrée erronée.",
      ],
      criteres: [
        "Des <strong>enums</strong> modélisent tokens / AST / opcodes.",
        "Les erreurs sont gérées avec <code>Result</code> (pas d'<code>unwrap()</code> sauvage).",
        "Le <strong>pattern matching</strong> dispatche les opcodes (exhaustif).",
        "Aucun bloc <code>unsafe</code> n'est nécessaire.",
        "Le programme <strong>compile sans avertissement</strong> (<code>cargo</code>) et ne <em>panique</em> pas sur une entrée invalide.",
        "Les résultats sont <strong>identiques</strong> aux versions précédentes.",
      ],
      livrable: "La VM réécrite en Rust, sûre et robuste.",
    },
    {
      n: 7,
      course: "zig",
      courseTitle: "Zig",
      dir: "zig",
      accent: "zig",
      phase: "Sûreté, performance & métal",
      titre: "Contrôle total et performance en Zig",
      depart: "La VM sûre en Rust de l'étape 5.",
      objectif:
        "<p>Pousser le <strong>contrôle</strong> et la <strong>performance</strong> avec Zig : allocateurs explicites, " +
        "<code>comptime</code>, et optimisation de la boucle d'exécution.</p>",
      ajoute: [
        "La mémoire gérée via un <strong>allocateur explicite</strong> (passé en argument).",
        "L'usage de <code>comptime</code> (ex. générer la table de dispatch).",
        "La gestion d'erreurs avec les <strong>error unions</strong>.",
        "L'<strong>optimisation</strong> de la boucle d'interprétation du bytecode.",
        "Une <strong>mesure de performance</strong> comparée aux étapes précédentes.",
      ],
      criteres: [
        "La mémoire passe par un <strong>allocateur explicite</strong> (sans fuite).",
        "Les <strong>error unions</strong> gèrent les erreurs (<code>try</code>/<code>catch</code>).",
        "<code>comptime</code> est utilisé quelque part.",
        "La boucle d'exécution est <strong>optimisée</strong> (mesurée).",
        "Le programme <strong>compile</strong> (<code>zig</code>) et exécute le mini-langage.",
      ],
      livrable: "La VM en Zig, contrôle mémoire total et performances mesurées.",
    },
    {
      n: 8,
      course: "asm",
      courseTitle: "Assembleur",
      dir: "asm",
      accent: "asm",
      phase: "Sûreté, performance & métal",
      titre: "Le cœur en assembleur x86-64",
      depart: "La VM optimisée des étapes 5-6.",
      objectif:
        "<p>Descendre au plus près du métal : implémenter en <strong>assembleur x86-64</strong> la routine la plus critique " +
        "de la VM (la boucle de calcul, ou une opération arithmétique) et l'appeler depuis ton programme.</p>",
      ajoute: [
        "Une <strong>routine critique</strong> écrite en assembleur (calcul, ou cœur de la boucle).",
        "Le respect de la <strong>convention d'appel</strong> pour l'intégrer au code C / Zig.",
        "L'usage des <strong>registres</strong> et de la <strong>pile</strong>.",
        "Une <strong>comparaison de performance</strong> avec la version en langage de haut niveau.",
      ],
      criteres: [
        "Une <strong>routine critique</strong> est écrite en assembleur x86-64.",
        "Les <strong>registres</strong> respectent la convention d'appel (System V : <code>rdi</code>, <code>rsi</code>… ; retour dans <code>rax</code>).",
        "La <strong>pile</strong> est équilibrée (<code>push</code>/<code>pop</code>).",
        "La routine est <strong>appelée</strong> depuis le programme principal et donne le bon résultat.",
        "Le tout <strong>s'assemble et s'exécute</strong> correctement.",
      ],
      livrable: "🏁 Ton propre langage, du prototype Python à une routine en assembleur — un interpréteur construit de bout en bout, du plus haut niveau au métal !",
    },
  ],
};
