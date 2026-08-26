/* =============================================================================
   verif-git-modele-mutations.js — la contre-epreuve de tools/verif-git-modele.js (V14, point D1).

   Un vert ne prouve rien tant qu'on n'a pas montre que le rouge est atteignable.
   Ici on ABIME volontairement une regle du modele, une a la fois, dans une COPIE
   temporaire, et on exige que le verificateur s'en apercoive. Une mutation non
   detectee designe un trou dans le controle, pas un detail.

   Usage : node tools/verif-git-modele-mutations.js
   Code de sortie : 0 si TOUTES les fautes injectees sont vues, 1 sinon.
   ============================================================================= */
"use strict";

var cp = require("child_process");
var fs = require("fs");
var os = require("os");
var path = require("path");

var RACINE = path.join(__dirname, "..");
var SOURCE = path.join(RACINE, "js", "git-modele.js");
var OUTIL = path.join(RACINE, "tools", "verif-git-modele.js");
var original = fs.readFileSync(SOURCE, "utf8");

var MUTATIONS = [
  {
    nom: "SHA-1 : une rotation de 29 au lieu de 30",
    de: "c = rotl(b, 30);",
    a: "c = rotl(b, 29);"
  },
  {
    nom: "en-tete d'objet : oublier le type dans le hache",
    de: 'var entete = utf8(type + " " + corps.length + "\\u0000");',
    a: 'var entete = utf8(corps.length + "\\u0000");'
  },
  {
    nom: "UTF-8 : hacher les caracteres, pas les octets",
    de: "if (c < 0x80) out.push(c);\n      else if (c < 0x800)",
    a: "if (c < 0x100) out.push(c);\n      else if (c < 0x800)"
  },
  {
    nom: "tri des arbres : oublier le / des repertoires",
    de: 'var ca = utf8(a.nom + (a.mode === MODE_ARBRE ? "/" : ""));\n      var cb = utf8(b.nom + (b.mode === MODE_ARBRE ? "/" : ""));',
    a: "var ca = utf8(a.nom);\n      var cb = utf8(b.nom);"
  },
  {
    nom: "tri des arbres : comparer des chaines et non des octets",
    de: "return comparerOctets(ca, cb);",
    a: "return a.nom < b.nom ? -1 : a.nom > b.nom ? 1 : 0;"
  },
  {
    nom: "mode d'arbre : 040000 au lieu de 40000",
    de: 'var MODE_ARBRE = "40000";',
    a: 'var MODE_ARBRE = "040000";'
  },
  {
    nom: "message de commit : ne pas garantir le saut de ligne final",
    de: 'if (message.slice(-1) !== "\\n") message += "\\n";',
    a: ""
  },
  {
    nom: "commit : ordre des parents inverse",
    de: "for (var i = 0; i < parents.length; i++) texte += \"parent \" + parents[i] + \"\\n\";",
    a: "for (var i = parents.length - 1; i >= 0; i--) texte += \"parent \" + parents[i] + \"\\n\";"
  },
  {
    nom: "HEAD~n : suivre le deuxieme parent",
    de: "oid = c.parents.length ? c.parents[0] : null;",
    a: "oid = c.parents.length ? c.parents[c.parents.length - 1] : null;"
  },
  {
    nom: "HEAD^n : decalage d'un rang",
    de: "oid = cc.parents.length >= s.nombre ? cc.parents[s.nombre - 1] : null;",
    a: "oid = cc.parents.length > s.nombre ? cc.parents[s.nombre] : null;"
  },
  {
    nom: "base de fusion : rendre le plus VIEIL ancetre commun",
    de: "if (!domine) bases.push(communs[i]);",
    a: "if (domine) bases.push(communs[i]);"
  },
  {
    nom: "statut : ignorer les fichiers non suivis",
    de: 'if (!this.index[chemin]) { suivis.push(chemin); continue; }',
    a: "if (!this.index[chemin]) { continue; }"
  },
  {
    nom: "statut : confondre indexe et modifie",
    de: "if (Depot.empreinteBlob(this.travail[chemin]) !== this.index[chemin].oid) modifies.push(chemin);",
    a: ""
  },
  {
    nom: "index : indexer le nom au lieu du contenu",
    de: "var oid = this.ecrireBlob(this.travail[chemin]);",
    a: "var oid = this.ecrireBlob(chemin);"
  },
  {
    nom: "diff d'arbres : oublier les suppressions",
    de: 'if (!b[chemin]) out.push({ chemin: chemin, etat: "supprimé", avant: a[chemin].oid, apres: null });',
    a: ""
  },
  {
    nom: "relecture d'arbre : ne pas descendre dans les sous-repertoires",
    de: "if (mode === MODE_ARBRE) {",
    a: "if (false) {"
  },
  {
    nom: "en-tete d'objet : un espace au lieu de l'octet nul",
    de: 'corps.length + "\\u0000");',
    a: 'corps.length + " ");'
  },
  {
    nom: "export : perdre le dernier octet de chaque objet",
    de: "objets[oid] = { type: this.objets[oid].type, corps: octetsVersHex(this.objets[oid].corps) };",
    a: "objets[oid] = { type: this.objets[oid].type, corps: octetsVersHex(this.objets[oid].corps.slice(0, -1)) };"
  }
];

var dossier = fs.mkdtempSync(path.join(os.tmpdir(), "syntaxe-mut-"));
var detectees = 0, ratees = [];

console.log("Contre-epreuve de verif-git-modele.js : " + MUTATIONS.length + " fautes injectees.\n");

MUTATIONS.forEach(function (m, i) {
  if (original.indexOf(m.de) === -1) {
    ratees.push({ nom: m.nom, pourquoi: "motif introuvable dans le modele (mutation caduque)" });
    console.log("  " + (i + 1) + ". " + m.nom + " → MOTIF INTROUVABLE");
    return;
  }
  var mute = original.replace(m.de, m.a);
  var chemin = path.join(dossier, "modele-" + (i + 1) + ".js");
  fs.writeFileSync(chemin, mute, "utf8");
  var res = cp.spawnSync(process.execPath, [OUTIL, "--modele=" + chemin], { encoding: "utf8" });
  var sortie = (res.stdout || "") + (res.stderr || "");
  var vu = res.status !== 0;
  if (vu) detectees++;
  else ratees.push({ nom: m.nom, pourquoi: "le verificateur reste vert" });
  var nb = /(\d+) comparaisons, (\d+) ecart/.exec(sortie);
  console.log("  " + (i + 1) + ". " + m.nom + " → " + (vu ? "DETECTEE" : "*** NON DETECTEE ***") +
    (nb ? " (" + nb[2] + " ecart(s))" : res.status !== 0 ? " (le modele leve une erreur)" : ""));
});

console.log("\n  " + detectees + "/" + MUTATIONS.length + " mutations detectees.");
if (ratees.length) {
  ratees.forEach(function (r) { console.log("  TROU · " + r.nom + " : " + r.pourquoi); });
}
try { fs.rmSync(dossier, { recursive: true, force: true }); } catch (e) { /* rien */ }
process.exit(ratees.length ? 1 : 0);
