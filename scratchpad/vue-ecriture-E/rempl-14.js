"use strict";
var fs = require("fs"), path = require("path");
var f = path.join(__dirname, "..", "..", "pages", "vue", "lecon-14.html");
var src = fs.readFileSync(f, "utf8");
var R = [
  // ---- quiz principal ----
  ["Pour une copie par composant : le composant copie les données d'un espace central dans son script, avec un suivi fait à la main",
   "Pour que chaque composant garde une copie des données et la mette à jour tout seul dans son script, sans action ni getter du store"],
  ["Pour un rendu bien plus vif : ce composant relit sans cesse ces données, plutôt que leurs copies déjà désynchronisées dans chaque vue en cours",
   "Pour que le store garde une copie des données dans chaque composant, et que les copies désynchronisées restent à jour sans autre code"],
  ["Pour qu'une donnée persiste : le module la détient après écriture, avec un composant qui la relit au début de la vue courante",
   "Pour que le store affiche toujours les données à la place du composant : chaque vue se contente de lire, sans getter ni actions"],
  ["Un getter est une fonction (filtre) que le script appelle ; une action est sa valeur dérivée en cache",
   "Un getter est une fonction que le script appelle à chaque lecture ; une action est une valeur mise en cache"],
  ["Un getter est un computed (lecture) sans cache ; une action est sa valeur stable",
   "Un getter est un computed en lecture ; une action est aussi une valeur dérivée"],
  ["Par le routeur : quel chemin, et quelles données montrer ; le rendu passe après le composant piloté",
   "Par le routeur : quel chemin, et quelles vues montrer ; l'état et le composant passent après le rendu"],
  ["Par les tests : quel script, et quelles erreurs montrer ; les données passent plus tard",
   "Par les tests : quelles erreurs montrer, et quelle action ajouter ; le reste passe après"],
  ["Il retire la ligne de son tableau local (sans action) ; le store ne montre pas la mutation de la liste",
   "Il masque sa ligne avec une variable du script : le store garde la tâche, et personne n'est prévenu"],
  ["Il change le tableau du store à la main (hors des actions) ; le parent et la vue ne suivent pas",
   "Il supprime la tâche du tableau du store à la main, dans son script, sans passer par une action"],
  // ---- quiz bilan ----
  ["Un fichier .html qui porte le template (script)",
   "Un fichier .html avec le template et le script"],
  ["Un .json décrit (template entier)",
   "Un fichier .json (template complet)"],
  ["v-for:clic (tour)", "v-for:clic (liste)"],
  ["v-key:clic (saisie)", "v-key:clic (unique)"],
  ["Pinia, module des mutations (partagé)", "Pinia, un espace partagé pour l'application"],
  ["Vitest, la vérification (essais)", "Vitest, contrôle des composants"],
  ["Vite, le chargement des briques (partagé)", "Vite, qui sert et construit les fichiers du projet"],
  ["<Fondu> (avec :key stable et une file de transitions lourdes)",
   "<Transition> (avec :key stable), qui anime aussi le retrait de la liste"],
  ["<Fade> (avec :key stable et des transform bien lentes)",
   "<KeepAlive> (avec :key stable), qui anime le retrait dans la liste"],
  ["<Duo> (avec :key stable et mutations lentes)",
   "<Teleport> (:key stable), qui anime les composants"],
  ["le trigger('nom') du wrapper au test", "wrapper.trigger('nom') à la fin du test"],
  ["console('nom') du résultat au test", "console.log('nom') après le trigger"],
  ["un parent montre('nom') au test", "un parent monté qui écoute 'nom'"],
];
R.forEach(function (p, i) {
  var n = src.split(p[0]).length - 1;
  if (n !== 1) { console.error("!! motif " + i + " trouve " + n + " fois : " + p[0].slice(0, 60)); process.exit(1); }
  src = src.replace(p[0], p[1]);
});
fs.writeFileSync(f, src);
console.log("lecon-14 : " + R.length + " options reecrites");
