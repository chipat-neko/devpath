/* Assemble pages/etude-reecriture.html.

   Même principe que les trois études précédentes : la page ne contient aucun code
   recopié à la main, et aucun chiffre écrit de tête.

     - les deux programmes publiés sont RELUS dans v1.js et v2.js ;
     - la sortie publiée est celle qu'on obtient en les exécutant ;
     - les mesures publiées sortent de mesurer.js, exécuté ici ;
     - le banc publié est exécuté, et sa sortie est celle qu'il produit ;
     - la solution de l'exercice est appliquée aux deux versions avant publication.

   L'assemblage échoue — et n'écrit rien — si l'une de ces exécutions se dément. */

var fs = require("fs");
var cp = require("child_process");
var os = require("os");
var path = require("path");

var ICI = __dirname;
var RACINE = path.resolve(ICI, "..", "..", "..");

function echapper(txt) { return txt.replace(/&/g, "&amp;").replace(/</g, "&lt;"); }
function lireIci(f) { return fs.readFileSync(path.join(ICI, f), "utf8").replace(/\r\n/g, "\n"); }
function stop(quoi) { console.log("✗ " + quoi); process.exit(1); }

var mesurer = require("./mesurer.js");
var jeu = require("./jeu.js");
var modif5 = require("./modif5.js").CHANGEMENT_5;

var srcV1 = lireIci("v1.js").replace(/\n+$/, "");
var srcV2 = lireIci("v2.js").replace(/\n+$/, "");
var banc = lireIci("banc.js").replace(/\n+$/, "");

/* ------------------------------------------------------ 1. les deux programmes tournent */
function executer(source, etiquette) {
  var tmp = path.join(os.tmpdir(), "syntaxe-reecr-" + etiquette + "-" + process.pid + ".js");
  fs.writeFileSync(tmp, source);
  try {
    return cp.execSync('node "' + tmp + '"', { encoding: "utf8" }).replace(/\r\n/g, "\n").replace(/\n+$/, "");
  } finally { fs.unlinkSync(tmp); }
}

/* Le jeu d'essai est PUBLIÉ dans la page : on l'extrait de jeu.js à des bornes
   vérifiées, et c'est cet extrait — pas un JSON fabriqué ici — qui sert à produire la
   sortie publiée. La page contient donc de quoi tout rejouer : entrée, programme,
   sortie. */
var lignesJeu = lireIci("jeu.js").split("\n");
var iDebJeu = lignesJeu.indexOf("function vitrine() {");
var iFinJeu = iDebJeu === -1 ? -1 : lignesJeu.indexOf("}", iDebJeu);
if (iDebJeu === -1 || iFinJeu === -1) stop("la fonction vitrine() est introuvable dans jeu.js aux bornes attendues.");
var extraitJeu = lignesJeu.slice(iDebJeu, iFinJeu + 1).join("\n");
var nCommandes = extraitJeu.split("{ id:").length - 1;
if (nCommandes !== 14) stop("l'extrait du jeu contient " + nCommandes + " commandes, 14 attendues.");

var appel = "\n" + extraitJeu + "\nprocess.stdout.write(releve(vitrine()));\n";
var vitrine1 = executer(srcV1 + appel, "v1");
var vitrine2 = executer(srcV2 + appel, "v2");
if (vitrine1 !== vitrine2) {
  stop("les deux versions ne rendent PAS la même sortie sur le jeu de vitrine : rien n'est publié.");
}
console.log("✓ v1 et v2 exécutées séparément : " + vitrine1.split("\n").length + " lignes, sorties identiques");

/* ------------------------------------------------------------------ 2. les mesures */
var sortieMesures = cp.execSync('node "' + path.join(ICI, "mesurer.js") + '"', { encoding: "utf8" })
  .replace(/\r\n/g, "\n").replace(/\n+$/, "");
var m = mesurer.tout();

if (m.equivalence.differents !== 0) {
  stop("l'équivalence n'est PAS vérifiée : " + m.equivalence.differents + " lot(s) divergent.");
}
console.log("✓ équivalence : " + m.equivalence.commandes + " commandes, " +
            m.equivalence.differents + " écart");

/* Le quatrième changement est publié comme celui où la version 1 gagne : si ce n'était
   plus vrai, le texte de la page mentirait. On refuse alors de publier. */
var ch4 = m.changements[3];
if (!(ch4.v1.endroits < ch4.v2.endroits)) {
  stop("le 4e changement ne coûte plus moins cher à la v1 (v1 " + ch4.v1.endroits +
       " endroits, v2 " + ch4.v2.endroits + ") : la page affirmerait le contraire de la mesure.");
}
m.changements.forEach(function (c) {
  if (!c.memeResultat) stop("le changement « " + c.court + " » ne rend pas le même résultat dans les deux versions.");
  if (!c.change) stop("le changement « " + c.court + " » ne change rien au relevé : il ne prouve rien.");
});
console.log("✓ 4 changements appliqués aux deux versions, mêmes chiffres à chaque fois, " +
            "et le 4e coûte plus cher à la v2 (" + ch4.v2.endroits + " endroits contre " + ch4.v1.endroits + ")");

if (m.paysInconnu.v1.plante) stop("la v1 ne facture plus silencieusement un pays inconnu : le texte de la page est faux.");
if (!m.paysInconnu.v2.plante) stop("la v2 ne s'arrête plus sur un pays inconnu : le texte de la page est faux.");

/* ------------------------------------------------------------------- 3. le banc */
/* ⚠️ PIÈGE MESURÉ le 2026-09-02 (étude nº 3) : js/runner.js refuse de poser un bouton
   « Tester » sur un bloc contenant certains mots — dont « document » AU SINGULIER dans
   un commentaire français. On recopie donc son test, et on refuse de publier un banc
   qui n'aurait pas son bouton. */
var BROWSER_ONLY = /(?:^|[^\w$À-ɏ])(document|window|localStorage|sessionStorage|alert|prompt|confirm|location|navigator|process|Buffer|__dirname|__filename)(?![\w$À-ɏ])|require\s*\(|module\.exports|\bexports\.|\bglobalThis\b|node:|new Worker|postMessage|SharedArrayBuffer|Atomics|importScripts/;
var interdit = BROWSER_ONLY.exec(banc);
if (interdit) stop("le banc contient « " + interdit[0].trim() + " » : runner.js n'y mettrait pas de bouton « Tester ».");

var sortieBanc = executer(banc, "banc");
var bancDiff = /totaux différents \.+ (\d+)/.exec(sortieBanc);
if (!bancDiff) stop("le banc n'affiche pas le nombre de totaux différents.");
console.log("✓ banc exécuté : " + sortieBanc.split("\n").length + " lignes, " +
            bancDiff[1] + " totaux différents");

/* ------------------------------------------------ 4. la solution de l'exercice */
function codeDesPatchs(liste) {
  return liste.map(function (r) { return r.apres.replace(/\n+$/, ""); }).join("\n\n    /* … */\n\n");
}
var ex = m.exercice;
if (!ex.memes) stop("les deux correctifs de l'exercice ne rendent pas le même relevé.");
if (ex.change === 0) stop("le correctif de l'exercice ne change aucune commande : l'énoncé serait creux.");
console.log("✓ exercice vérifié : v1 " + ex.v1.touchees + " l./" + ex.v1.endroits + " end., v2 " +
            ex.v2.touchees + " l./" + ex.v2.endroits + " end., " + ex.change + "/" + ex.commandes + " commandes changées");

/* ---------------------------------------------------------------- 5. les tableaux */
function tableauMetriques() {
  var m1 = m.metriques.v1, m2 = m.metriques.v2;
  var lignes = [
    ["Lignes de code effectives", m1.effectives, m2.effectives],
    ["Fonctions", m1.fonctions, m2.fonctions],
    ["Lignes de la plus longue fonction", m1.plusLongue, m2.plusLongue],
    ["Imbrication maximale", m1.imbricationMax, m2.imbricationMax],
    ["Points de décision (if, for, &amp;&amp;, ?…)", m1.decisions, m2.decisions],
    ["Nombres écrits en clair dans le code", m1.magiques, m2.magiques],
    ["Endroits qui testent le pays", m1.testsDePays, m2.testsDePays]
  ];
  var out = ['<table class="etude-choix">',
             "  <thead>",
             "    <tr><th scope=\"col\">Mesure</th><th scope=\"col\">Version 1</th><th scope=\"col\">Version 2</th></tr>",
             "  </thead>", "  <tbody>"];
  lignes.forEach(function (l) {
    out.push('    <tr><th scope="row">' + l[0] + '</th>' +
             '<td data-libelle="Version 1">' + l[1] + "</td>" +
             '<td data-libelle="Version 2">' + l[2] + "</td></tr>");
  });
  out.push("  </tbody>", "</table>");
  return out.join("\n          ");
}

function tableauChangements() {
  var out = ['<table class="etude-choix">',
             "  <thead>",
             "    <tr><th scope=\"col\">Changement demandé</th><th scope=\"col\">Version 1</th><th scope=\"col\">Version 2</th></tr>",
             "  </thead>", "  <tbody>"];
  m.changements.forEach(function (c) {
    function cellule(d) { return d.touchees + " lignes<br />" + d.endroits + (d.endroits > 1 ? " endroits" : " endroit"); }
    out.push('    <tr><th scope="row">' + c.nom.replace(/&/g, "&amp;").replace(/</g, "&lt;") + "</th>" +
             '<td data-libelle="Version 1">' + cellule(c.v1) + "</td>" +
             '<td data-libelle="Version 2">' + cellule(c.v2) + "</td></tr>");
  });
  out.push("  </tbody>", "</table>");
  return out.join("\n          ");
}

/* ------------------------------------------------------------------- 6. la page */
var pct = (m.arrondi.touchees * 100 / m.arrondi.commandes).toFixed(1).replace(".", ",");
var CHIFFRES = {
  "@@N_LIGNES_V1@@": String(m.metriques.v1.lignesTotales),
  "@@N_LIGNES_V2@@": String(m.metriques.v2.lignesTotales),
  "@@N_EQUIV@@": String(m.equivalence.commandes),
  "@@N_DIFF@@": String(m.equivalence.differents),
  "@@EFF1@@": String(m.metriques.v1.effectives),
  "@@EFF2@@": String(m.metriques.v2.effectives),
  "@@ECART_LIGNES@@": String(m.metriques.v2.effectives - m.metriques.v1.effectives),
  "@@LONG1@@": String(m.metriques.v1.plusLongue),
  "@@IMBR1@@": String(m.metriques.v1.imbricationMax),
  "@@DEC1@@": String(m.metriques.v1.decisions),
  "@@DEC2@@": String(m.metriques.v2.decisions),
  "@@MAG1@@": String(m.metriques.v1.magiques),
  "@@MAG1_DISTINCTS@@": String(m.metriques.v1.magiquesDistincts),
  "@@PAYS1@@": String(m.metriques.v1.testsDePays),
  "@@PILE1@@": String(m.pile.v1),
  "@@PILE2@@": String(m.pile.v2),
  "@@ECART_PILE@@": String(m.pile.v2 - m.pile.v1),
  "@@TTC_ES@@": m.paysInconnu.v1.ttc.replace(".", ","),
  "@@ERREUR_V2@@": m.paysInconnu.v2.erreur.replace(/&/g, "&amp;").replace(/</g, "&lt;"),
  "@@OUBLI_MIN@@": String(Math.min.apply(null, m.oublis.map(function (o) { return o.fausses; }))),
  "@@OUBLI_MAX@@": String(Math.max.apply(null, m.oublis.map(function (o) { return o.fausses; }))),
  "@@CH4_V1_L@@": String(ch4.v1.touchees),
  "@@CH4_V1_E@@": String(ch4.v1.endroits),
  "@@CH4_V2_L@@": String(ch4.v2.touchees),
  "@@CH4_V2_E@@": String(ch4.v2.endroits),
  "@@ARR_TOUCHEES@@": String(m.arrondi.touchees),
  "@@ARR_PCT@@": pct,
  "@@ARR_MAX@@": String(m.arrondi.ecartMax),
  "@@ARR_CUMUL_EUR@@": (m.arrondi.totalEcart / 100).toFixed(2).replace(".", ","),
  "@@EX_NOM@@": modif5.nom,
  "@@EX_V1_L@@": String(ex.v1.touchees),
  "@@EX_V1_E@@": String(ex.v1.endroits),
  "@@EX_V2_L@@": String(ex.v2.touchees),
  "@@EX_V2_E@@": String(ex.v2.endroits),
  "@@EX_CHANGE@@": String(ex.change),
  "@@EX_SUR@@": String(ex.commandes)
};

var page = lireIci("gabarit.html")
  .replace("@@V1@@", echapper(srcV1))
  .replace("@@V2@@", echapper(srcV2))
  .replace("@@JEU@@", echapper(extraitJeu))
  .replace("@@VITRINE@@", echapper(vitrine1))
  .replace("@@BANC@@", echapper(banc))
  .replace("@@SORTIE_BANC@@", echapper(sortieBanc))
  .replace("@@SORTIE_MESURES@@", echapper(sortieMesures))
  .replace("@@TABLE_METRIQUES@@", tableauMetriques())
  .replace("@@TABLE_CHANGEMENTS@@", tableauChangements())
  .replace("@@SOLUTION_V1@@", echapper(codeDesPatchs(modif5.v1)))
  .replace("@@SOLUTION_V2@@", echapper(codeDesPatchs(modif5.v2)));

Object.keys(CHIFFRES).forEach(function (jeton) { page = page.split(jeton).join(CHIFFRES[jeton]); });

if (page.indexOf("@@") !== -1) {
  stop("il reste un jeton non remplacé : " + page.slice(page.indexOf("@@"), page.indexOf("@@") + 30));
}

/* Dernier garde-fou : la sortie publiée doit être celle qu'on vient d'obtenir. */
if (page.indexOf(echapper(vitrine1)) === -1) stop("la sortie publiée n'est pas celle qui vient d'être exécutée.");
if (page.indexOf(echapper(sortieBanc)) === -1) stop("la sortie du banc publiée n'est pas celle qui vient d'être exécutée.");

var cible = path.join(RACINE, "pages", "etude-reecriture.html");
fs.writeFileSync(cible, page);
console.log("✓ écrit : " + path.relative(RACINE, cible) + " (" + page.length + " octets)");
