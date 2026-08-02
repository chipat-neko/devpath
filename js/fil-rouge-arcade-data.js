/* =============================================================================
   fil-rouge-arcade-data.js — FIL ROUGE « Un casse-briques, du prototype au moteur ».
   Le même jeu d'arcade (raquette, balle, briques) construit puis ré-implémenté
   de plus en plus loin : Python → algo → JavaScript → projets canvas → Lua → C++.
   Définit window.FIL_ROUGE → moteur générique js/fil-rouge.js.
   Page : pages/fil-rouge-arcade.html. 100 % file://.
   ============================================================================= */
window.FIL_ROUGE = {
  id: "arcade",
  titre: "Un casse-briques, du prototype au moteur",
  sousTitre: "Le même jeu d'arcade, du prototype Python à un moteur natif — en passant par le navigateur et un moteur 2D.",
  intro:
    "<p>Un <strong>casse-briques</strong> (une raquette, une balle, des briques à détruire) est le jeu d'apprentissage " +
    "parfait : assez simple pour démarrer, assez riche pour grandir. Tu le <strong>prototypes</strong> en Python, tu " +
    "soignes sa <strong>physique</strong>, tu le portes dans le <strong>navigateur</strong> (canvas), tu en fais un vrai " +
    "jeu, puis tu passes aux <strong>moteurs</strong> (Lua/LÖVE, puis C++).</p>" +
    "<p>Les règles ne changent pas (la balle rebondit, les briques disparaissent, le score monte) : c'est la " +
    "<strong>technique de jeu</strong> qui monte en puissance à chaque étape. ⚠️ Les étapes moteur (Lua, C++) se réalisent " +
    "hors navigateur.</p>",
  etapes: [
    {
      n: 1,
      course: "python",
      courseTitle: "Python",
      dir: "python",
      accent: "python",
      phase: "Concevoir",
      titre: "Le prototype de la logique",
      depart: "Une idée de casse-briques (raquette, balle, briques).",
      objectif:
        "<p>Prototyper rapidement la <strong>logique du jeu</strong> en Python : l'état (positions, vitesses), le " +
        "déplacement de la balle et de la raquette, et la disparition des briques touchées.</p>",
      ajoute: [
        "L'<strong>état du jeu</strong> : raquette, balle (position + vitesse), liste de briques.",
        "La <strong>boucle de jeu</strong> qui met à jour les positions.",
        "Le <strong>déplacement</strong> de la raquette (entrée clavier) et de la balle.",
        "La disparition d'une brique <strong>touchée</strong> et le score.",
      ],
      criteres: [
        "L'état du jeu est modélisé avec des <strong>structures</strong> claires (dicts/listes ou classes).",
        "Une <strong>boucle</strong> fait avancer le jeu pas à pas.",
        "La <strong>raquette</strong> et la <strong>balle</strong> se déplacent.",
        "Une brique <strong>touchée disparaît</strong> et le score augmente.",
        "Le programme <strong>tourne</strong> (console ou pygame).",
      ],
      livrable: "Un prototype jouable de la logique, en Python.",
    },
    {
      n: 2,
      course: "algo",
      courseTitle: "Algorithmes",
      dir: "algo",
      accent: "algo",
      phase: "Concevoir",
      titre: "Collisions & physique",
      depart: "Le prototype Python de l'étape 1.",
      objectif:
        "<p>Soigner le <strong>cœur algorithmique</strong> : la détection de <strong>collisions</strong> (balle/raquette, " +
        "balle/briques, balle/murs) et les <strong>rebonds</strong> corrects.</p>",
      ajoute: [
        "La <strong>détection de collision</strong> rectangle/cercle (briques, raquette).",
        "Les <strong>rebonds</strong> (inversion de la composante de vitesse selon la face touchée).",
        "Une structure efficace pour parcourir les <strong>briques restantes</strong>.",
        "Une analyse de la <strong>complexité</strong> de la mise à jour.",
      ],
      criteres: [
        "La <strong>collision</strong> balle/brique et balle/raquette est correcte.",
        "Les <strong>rebonds</strong> changent la bonne composante de vitesse.",
        "Les briques restantes sont parcourues <strong>efficacement</strong>.",
        "Les <strong>cas limites</strong> (coin, double collision) sont gérés.",
        "La <strong>complexité</strong> de la boucle est annoncée.",
      ],
      livrable: "Une physique de jeu correcte (collisions, rebonds).",
    },
    {
      n: 3,
      course: "javascript",
      courseTitle: "JavaScript",
      dir: "js",
      accent: "javascript",
      phase: "Le jeu dans le navigateur",
      titre: "Le jeu dans le navigateur (canvas)",
      depart: "La logique et la physique (étapes 1-2).",
      objectif:
        "<p>Porter le jeu dans le <strong>navigateur</strong> : dessiner sur un <code>&lt;canvas&gt;</code>, animer avec " +
        "<code>requestAnimationFrame</code> et réagir au <strong>clavier</strong>.</p>",
      ajoute: [
        "Le rendu sur <code>&lt;canvas&gt;</code> (raquette, balle, briques).",
        "La <strong>boucle d'animation</strong> avec <code>requestAnimationFrame</code>.",
        "Le contrôle de la raquette au <strong>clavier</strong> (ou à la souris).",
        "L'affichage du <strong>score</strong> et d'un état « gagné / perdu ».",
      ],
      criteres: [
        "Le jeu se dessine sur un <code>&lt;canvas&gt;</code>.",
        "L'animation tourne avec <code>requestAnimationFrame</code> (fluide).",
        "La raquette répond aux <strong>événements</strong> clavier/souris.",
        "Le <strong>score</strong> et la fin de partie s'affichent.",
        "Aucune erreur dans la console.",
      ],
      livrable: "Le casse-briques jouable dans le navigateur.",
    },
    {
      n: 4,
      course: "projets-js",
      courseTitle: "Projets JavaScript",
      dir: "projets-js",
      accent: "projets-js",
      phase: "Le jeu dans le navigateur",
      titre: "Un vrai jeu : niveaux, score, polish",
      depart: "Le casse-briques canvas de l'étape 3.",
      objectif:
        "<p>Transformer la démo en <strong>vrai jeu</strong> : plusieurs niveaux, vies, sons, effets et un cycle de jeu " +
        "complet (menu → partie → game over → rejouer).</p>",
      ajoute: [
        "Plusieurs <strong>niveaux</strong> (dispositions de briques) et une difficulté croissante.",
        "Des <strong>vies</strong>, un <strong>score</strong> persistant (meilleur score en <code>localStorage</code>).",
        "Du <strong>son</strong> (rebonds, brique cassée) et de petits <strong>effets</strong> visuels.",
        "Un <strong>cycle complet</strong> : écran titre, partie, game over, rejouer.",
      ],
      criteres: [
        "Au moins <strong>deux niveaux</strong> jouables s'enchaînent.",
        "Les <strong>vies</strong> et le <strong>score</strong> fonctionnent ; le meilleur score est mémorisé.",
        "Le jeu a un <strong>cycle complet</strong> (titre → jeu → fin → rejouer).",
        "Du <strong>son</strong> ou des effets renforcent le retour de jeu.",
        "Le jeu se <strong>réinitialise</strong> sans recharger la page.",
      ],
      livrable: "Un casse-briques complet et soigné, dans le navigateur.",
    },
    {
      n: 5,
      course: "lua",
      courseTitle: "Lua",
      dir: "lua",
      accent: "lua",
      phase: "Vers le moteur",
      titre: "Le jeu avec un moteur 2D (Lua / LÖVE)",
      depart: "Le jeu web complet (étapes 1-4).",
      objectif:
        "<p>Refaire le jeu avec un <strong>moteur dédié</strong> : Lua est le langage de script des jeux. Avec LÖVE 2D, tu " +
        "structures le jeu autour de la boucle <code>update</code>/<code>draw</code>.</p>",
      ajoute: [
        "L'organisation autour des fonctions du moteur (<code>love.load</code>, <code>love.update</code>, <code>love.draw</code>).",
        "Les <strong>entités</strong> (raquette, balle, briques) décrites par des <strong>tables</strong> Lua.",
        "La gestion des <strong>entrées</strong> et du temps (delta-time).",
        "Le <strong>rendu</strong> et éventuellement les sons via le moteur.",
      ],
      criteres: [
        "Le jeu s'organise autour de <code>update</code>/<code>draw</code>.",
        "Les <strong>entités</strong> sont des <strong>tables</strong> Lua.",
        "Le mouvement utilise le <strong>delta-time</strong> (indépendant du framerate).",
        "Les <strong>entrées</strong> contrôlent la raquette.",
        "Le jeu <strong>tourne</strong> dans le moteur (LÖVE).",
      ],
      livrable: "Le casse-briques porté sur un moteur 2D (Lua / LÖVE).",
    },
    {
      n: 6,
      course: "cpp",
      courseTitle: "C++",
      dir: "cpp",
      accent: "cpp",
      phase: "Vers le moteur",
      titre: "Un moteur natif performant en C++",
      depart: "Le jeu sur moteur 2D (étapes 1-5).",
      objectif:
        "<p>Descendre au natif : un petit <strong>moteur de jeu en C++</strong>, avec une boucle de jeu maîtrisée, des " +
        "entités en classes et un rendu performant (SDL/SFML).</p>",
      ajoute: [
        "Une <strong>boucle de jeu</strong> à pas de temps maîtrisé (entrées → mise à jour → rendu).",
        "Les <strong>entités</strong> en classes (RAII, conteneurs STL).",
        "Le rendu via une bibliothèque (SDL ou SFML) — conceptuel.",
        "Une attention à la <strong>performance</strong> (pas d'allocation par image).",
      ],
      criteres: [
        "La <strong>boucle de jeu</strong> sépare entrées, mise à jour et rendu.",
        "Les <strong>entités</strong> sont des classes, gérées en <strong>RAII</strong> (pas de fuite).",
        "Des <strong>conteneurs STL</strong> portent les briques/objets.",
        "Le jeu reste <strong>fluide</strong> (pas d'allocation inutile par image).",
        "Le programme <strong>compile</strong> (<code>-std=c++17</code>) et tourne.",
      ],
      livrable: "🏁 Un casse-briques, du prototype Python à un moteur natif C++ — toute la chaîne du jeu !",
    },
  ],
};
