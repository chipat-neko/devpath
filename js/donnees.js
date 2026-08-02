/* =============================================================================
   donnees.js — Générateur de données de test (S5, Lot 4). Produit N lignes de
   données factices (id, prénom, nom, e-mail, ville, pays, âge, date, actif,
   entreprise) et les exporte en JSON ou CSV. 100 % file://.
   Page : pages/donnees.html.
   ============================================================================= */
(function () {
  "use strict";

  var PRENOMS = ["Emma", "Louis", "Jade", "Gabriel", "Louise", "Raphaël", "Alice", "Arthur", "Chloé", "Hugo", "Léa", "Jules", "Manon", "Adam", "Camille", "Liam", "Sarah", "Noah", "Inès", "Nathan"];
  var NOMS = ["Martin", "Bernard", "Dubois", "Thomas", "Robert", "Petit", "Durand", "Leroy", "Moreau", "Simon", "Laurent", "Lefebvre", "Garcia", "David", "Bertrand", "Roux", "Vincent", "Fournier", "Morel", "Girard"];
  var VILLES = ["Paris", "Lyon", "Marseille", "Toulouse", "Nice", "Nantes", "Strasbourg", "Montpellier", "Bordeaux", "Lille", "Rennes", "Reims", "Grenoble", "Dijon", "Angers"];
  var PAYS = ["France", "Belgique", "Suisse", "Canada", "Maroc", "Sénégal", "Tunisie", "Luxembourg", "Algérie", "Côte d'Ivoire"];
  var DOMAINES = ["exemple.fr", "mail.com", "courriel.net", "test.org", "demo.io"];
  var ENTREPRISES = ["Acme", "Globex", "Initech", "Umbrella", "Hooli", "Stark Industries", "Wayne Corp", "Wonka", "Nakatomi", "Cyberdyne", "Soylent", "Massive Dynamic"];

  var FIELDS = [
    { id: "id", label: "ID", def: true },
    { id: "prenom", label: "Prénom", def: true },
    { id: "nom", label: "Nom", def: true },
    { id: "email", label: "E-mail", def: true },
    { id: "ville", label: "Ville", def: true },
    { id: "pays", label: "Pays", def: false },
    { id: "age", label: "Âge", def: true },
    { id: "date", label: "Inscription", def: false },
    { id: "actif", label: "Actif", def: false },
    { id: "entreprise", label: "Entreprise", def: false },
  ];

  var countEl = document.getElementById("dg-count");
  var fieldsEl = document.getElementById("dg-fields");
  var genBtn = document.getElementById("dg-gen");
  var previewEl = document.getElementById("dg-preview");
  var msgEl = document.getElementById("dg-msg");
  if (!fieldsEl || !genBtn || !previewEl) return;

  var rows = [];

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }
  function rand(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }
  function slug(s) {
    return String(s)
      .toLowerCase()
      .replace(/[àâä]/g, "a")
      .replace(/[éèêë]/g, "e")
      .replace(/[îï]/g, "i")
      .replace(/[ôö]/g, "o")
      .replace(/[ûüù]/g, "u")
      .replace(/ç/g, "c")
      .replace(/[^a-z0-9]/g, "");
  }
  function randDate() {
    var start = new Date(2018, 0, 1).getTime();
    var end = new Date().getTime();
    var d = new Date(start + Math.random() * (end - start));
    var m = d.getMonth() + 1,
      j = d.getDate();
    return d.getFullYear() + "-" + (m < 10 ? "0" + m : m) + "-" + (j < 10 ? "0" + j : j);
  }

  function selectedFields() {
    var out = [];
    var boxes = fieldsEl.querySelectorAll("input[type=checkbox]");
    for (var i = 0; i < boxes.length; i++) if (boxes[i].checked) out.push(boxes[i].value);
    return out;
  }

  function genRow(i, fields) {
    var prenom = rand(PRENOMS);
    var nom = rand(NOMS);
    var row = {};
    fields.forEach(function (f) {
      if (f === "id") row.id = i + 1;
      else if (f === "prenom") row.prenom = prenom;
      else if (f === "nom") row.nom = nom;
      else if (f === "email") row.email = slug(prenom) + "." + slug(nom) + "@" + rand(DOMAINES);
      else if (f === "ville") row.ville = rand(VILLES);
      else if (f === "pays") row.pays = rand(PAYS);
      else if (f === "age") row.age = 18 + Math.floor(Math.random() * 50);
      else if (f === "date") row.inscription = randDate();
      else if (f === "actif") row.actif = Math.random() > 0.3;
      else if (f === "entreprise") row.entreprise = rand(ENTREPRISES);
    });
    return row;
  }

  function generate() {
    var n = Math.max(1, Math.min(500, parseInt(countEl.value, 10) || 10));
    var fields = selectedFields();
    if (!fields.length) {
      msg("Coche au moins un champ.", false);
      return;
    }
    rows = [];
    for (var i = 0; i < n; i++) rows.push(genRow(i, fields));
    msg(n + " ligne" + (n > 1 ? "s" : "") + " générée" + (n > 1 ? "s" : "") + " ✓", true);
    renderPreview();
  }

  function renderPreview() {
    if (!rows.length) {
      previewEl.innerHTML = "";
      return;
    }
    var keys = Object.keys(rows[0]);
    var head = "<tr>" + keys.map(function (k) { return "<th>" + esc(k) + "</th>"; }).join("") + "</tr>";
    var shown = rows.slice(0, 50);
    var body = shown
      .map(function (r) {
        return "<tr>" + keys.map(function (k) { return "<td>" + esc(fmtVal(r[k])) + "</td>"; }).join("") + "</tr>";
      })
      .join("");
    previewEl.innerHTML =
      '<div class="dg-tablewrap"><table class="dg-table"><thead>' + head + "</thead><tbody>" + body + "</tbody></table></div>" +
      (rows.length > 50 ? '<p class="dg-more">Aperçu des 50 premières lignes sur ' + rows.length + ".</p>" : "");
  }
  function fmtVal(v) {
    return typeof v === "boolean" ? (v ? "true" : "false") : v;
  }

  function toCsv() {
    if (!rows.length) return "";
    var keys = Object.keys(rows[0]);
    var cell = function (v) {
      v = String(fmtVal(v));
      if (/[",\n]/.test(v)) v = '"' + v.replace(/"/g, '""') + '"';
      return v;
    };
    var lines = [keys.join(",")];
    rows.forEach(function (r) {
      lines.push(keys.map(function (k) { return cell(r[k]); }).join(","));
    });
    return lines.join("\n");
  }

  function msg(t, ok) {
    if (!msgEl) return;
    msgEl.textContent = t || "";
    msgEl.className = "dg-msg" + (t ? (ok ? " is-ok" : " is-err") : "");
  }
  function copy(text) {
    if (!text) return msg("Génère d'abord des données.", false);
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () {
        msg("Copié dans le presse-papiers ✓", true);
      }, function () {});
    }
  }
  function download(text, name, type) {
    if (!text) return msg("Génère d'abord des données.", false);
    var blob = new Blob([text], { type: type });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.setTimeout(function () {
      URL.revokeObjectURL(url);
    }, 1000);
  }

  /* Cases à cocher des champs. */
  fieldsEl.innerHTML +=
    FIELDS.map(function (f) {
      return (
        '<label class="dg-field"><input type="checkbox" value="' + f.id + '"' + (f.def ? " checked" : "") +
        "> " + esc(f.label) + "</label>"
      );
    }).join("");

  genBtn.addEventListener("click", generate);
  document.getElementById("dg-copy-json").addEventListener("click", function () {
    copy(rows.length ? JSON.stringify(rows, null, 2) : "");
  });
  document.getElementById("dg-copy-csv").addEventListener("click", function () {
    copy(toCsv());
  });
  document.getElementById("dg-dl-json").addEventListener("click", function () {
    download(rows.length ? JSON.stringify(rows, null, 2) : "", "donnees.json", "application/json");
  });
  document.getElementById("dg-dl-csv").addEventListener("click", function () {
    download(toCsv(), "donnees.csv", "text/csv");
  });

  generate();
})();
