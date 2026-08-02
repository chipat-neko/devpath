/* =============================================================================
   raccourcis.js — Aide-mémoire des raccourcis clavier (S8, Lot 4). Données +
   moteur de recherche/filtre. Touches Windows / Linux. 100 % file://.
   Page : pages/raccourcis.html.
   ============================================================================= */
(function () {
  "use strict";

  var DATA = [
    /* ----- Ce site -----
       Placés en tête : c'est la seule catégorie que le lecteur peut essayer
       immédiatement, sans quitter la page. */
    { cat: "Ce site", keys: "/", desc: "Ouvrir la recherche rapide depuis n'importe quelle page" },
    { cat: "Ce site", keys: "Ctrl+K", desc: "Ouvrir la recherche rapide, même en train d'écrire dans un champ" },
    { cat: "Ce site", keys: "Haut / Bas", desc: "Parcourir les résultats de la recherche rapide" },
    { cat: "Ce site", keys: "Entrée", desc: "Ouvrir la leçon sélectionnée" },
    { cat: "Ce site", keys: "Échap", desc: "Fermer la recherche rapide et revenir où on en était" },

    /* ----- VS Code ----- */
    { cat: "VS Code", keys: "Ctrl+P", desc: "Ouvrir un fichier par son nom" },
    { cat: "VS Code", keys: "Ctrl+Shift+P", desc: "Palette de commandes" },
    { cat: "VS Code", keys: "Ctrl+Shift+F", desc: "Rechercher dans tous les fichiers" },
    { cat: "VS Code", keys: "Ctrl+B", desc: "Afficher / masquer la barre latérale" },
    { cat: "VS Code", keys: "Ctrl+/", desc: "Commenter / décommenter la ligne" },
    { cat: "VS Code", keys: "Alt+Bas", desc: "Déplacer la ligne vers le bas" },
    { cat: "VS Code", keys: "Alt+Haut", desc: "Déplacer la ligne vers le haut" },
    { cat: "VS Code", keys: "Shift+Alt+Bas", desc: "Dupliquer la ligne en dessous" },
    { cat: "VS Code", keys: "Ctrl+D", desc: "Sélectionner l'occurrence suivante" },
    { cat: "VS Code", keys: "Ctrl+Shift+L", desc: "Sélectionner toutes les occurrences" },
    { cat: "VS Code", keys: "F2", desc: "Renommer le symbole (partout)" },
    { cat: "VS Code", keys: "F12", desc: "Aller à la définition" },
    { cat: "VS Code", keys: "Ctrl+Espace", desc: "Déclencher les suggestions" },
    { cat: "VS Code", keys: "Ctrl+Shift+K", desc: "Supprimer la ligne" },
    { cat: "VS Code", keys: "Ctrl+G", desc: "Aller à une ligne précise" },
    { cat: "VS Code", keys: "Ctrl+ù", desc: "Ouvrir le terminal intégré" },
    { cat: "VS Code", keys: "Ctrl+K Ctrl+S", desc: "Ouvrir les raccourcis clavier" },
    { cat: "VS Code", keys: "Ctrl+Shift+E", desc: "Aller à l'explorateur de fichiers" },

    /* ----- Navigateur ----- */
    { cat: "Navigateur", keys: "Ctrl+T", desc: "Nouvel onglet" },
    { cat: "Navigateur", keys: "Ctrl+W", desc: "Fermer l'onglet" },
    { cat: "Navigateur", keys: "Ctrl+Shift+T", desc: "Rouvrir le dernier onglet fermé" },
    { cat: "Navigateur", keys: "Ctrl+L", desc: "Aller à la barre d'adresse" },
    { cat: "Navigateur", keys: "F5", desc: "Recharger la page" },
    { cat: "Navigateur", keys: "Ctrl+Shift+R", desc: "Recharger en ignorant le cache" },
    { cat: "Navigateur", keys: "F12", desc: "Ouvrir les outils de développement" },
    { cat: "Navigateur", keys: "Ctrl+Shift+J", desc: "Ouvrir la console JavaScript" },
    { cat: "Navigateur", keys: "Ctrl+F", desc: "Rechercher dans la page" },
    { cat: "Navigateur", keys: "Ctrl+Plus", desc: "Zoomer" },
    { cat: "Navigateur", keys: "Ctrl+Moins", desc: "Dézoomer" },
    { cat: "Navigateur", keys: "Ctrl+Shift+N", desc: "Fenêtre de navigation privée" },
    { cat: "Navigateur", keys: "Ctrl+H", desc: "Ouvrir l'historique" },
    { cat: "Navigateur", keys: "Ctrl+J", desc: "Ouvrir les téléchargements" },

    /* ----- Terminal ----- */
    { cat: "Terminal", keys: "Ctrl+C", desc: "Interrompre le programme en cours" },
    { cat: "Terminal", keys: "Ctrl+L", desc: "Effacer l'écran" },
    { cat: "Terminal", keys: "Ctrl+A", desc: "Aller au début de la ligne" },
    { cat: "Terminal", keys: "Ctrl+E", desc: "Aller à la fin de la ligne" },
    { cat: "Terminal", keys: "Ctrl+U", desc: "Effacer du curseur au début de la ligne" },
    { cat: "Terminal", keys: "Ctrl+K", desc: "Effacer du curseur à la fin de la ligne" },
    { cat: "Terminal", keys: "Ctrl+W", desc: "Effacer le mot précédent" },
    { cat: "Terminal", keys: "Ctrl+R", desc: "Recherche dans l'historique des commandes" },
    { cat: "Terminal", keys: "Ctrl+D", desc: "Fin de saisie (EOF) / quitter le shell" },
    { cat: "Terminal", keys: "Tab", desc: "Autocompléter une commande ou un chemin" },
    { cat: "Terminal", keys: "Haut", desc: "Commande précédente dans l'historique" },
    { cat: "Terminal", keys: "Ctrl+Z", desc: "Suspendre le programme (puis bg / fg)" },
  ];

  var searchEl = document.getElementById("rc-search");
  var catEl = document.getElementById("rc-cat");
  var listEl = document.getElementById("rc-list");
  var countEl = document.getElementById("rc-count");
  if (!listEl) return;

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }
  function norm(s) {
    return String(s || "")
      .toLowerCase()
      .replace(/[àâä]/g, "a")
      .replace(/[éèêë]/g, "e")
      .replace(/[îï]/g, "i")
      .replace(/[ôö]/g, "o")
      .replace(/[ûüù]/g, "u")
      .replace(/ç/g, "c");
  }
  function keysHtml(keys) {
    return keys
      .split(" ")
      .map(function (combo) {
        return combo
          .split("+")
          .map(function (k) {
            return "<kbd>" + esc(k) + "</kbd>";
          })
          .join("<span class='rc-plus'>+</span>");
      })
      .join(" ");
  }

  function render() {
    var q = norm(searchEl ? searchEl.value.trim() : "");
    var cf = catEl ? catEl.value : "all";
    var rows = DATA.filter(function (r) {
      if (cf !== "all" && r.cat !== cf) return false;
      if (q && norm(r.desc + " " + r.keys + " " + r.cat).indexOf(q) === -1) return false;
      return true;
    });
    var cats = {};
    rows.forEach(function (r) {
      (cats[r.cat] = cats[r.cat] || []).push(r);
    });
    var html = "";
    ["VS Code", "Navigateur", "Terminal"].forEach(function (cat) {
      if (!cats[cat]) return;
      html +=
        '<h2 class="rc-cat">' + esc(cat) + "</h2><div class=\"rc-grid\">" +
        cats[cat]
          .map(function (r) {
            return (
              '<div class="rc-item"><span class="rc-keys">' + keysHtml(r.keys) + "</span>" +
              '<span class="rc-desc">' + esc(r.desc) + "</span></div>"
            );
          })
          .join("") +
        "</div>";
    });
    listEl.innerHTML = html || '<p class="rc-empty">Aucun raccourci ne correspond.</p>';
    if (countEl) countEl.textContent = rows.length + " raccourci" + (rows.length > 1 ? "s" : "") + " sur " + DATA.length;
  }

  if (searchEl) searchEl.addEventListener("input", render);
  if (catEl) catEl.addEventListener("change", render);
  render();
})();
