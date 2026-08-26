/* =============================================================================
   mesure-alternatives.js — OU le site montre-t-il UNE seule facon de faire alors
   que plusieurs se defendent ? (chantier V14, phase E, point E1). Node pur, ZERO
   dependance, rejouable.

   POURQUOI CET OUTIL EXISTE
   « Repere les lecons ou plusieurs approches se defendent » est une consigne qui
   invite a repondre de tete — et de tete, on cite les lecons dont on se souvient.
   Cet outil lit les 1 523 lecons, cherche dans leurs BLOCS DE CODE des tournures
   dont l'alternative est un classique du metier, et ecarte celles qui en parlent
   DEJA. Ce qu'il rend n'est pas une decision : c'est la liste des candidats,
   ordonnee, avec le motif exact qui l'a fait entrer.

   CE QU'IL NE FAIT PAS : juger si l'alternative vaut la peine d'etre montree.
   Un `for` de trois lignes dans une lecon qui enseigne justement la boucle n'a
   pas besoin d'une variante fonctionnelle. C'est pour cela que l'outil affiche
   le TITRE de la lecon et le motif : le choix reste editorial.

   Usage :
     node tools/mesure-alternatives.js              # le tableau par cours
     node tools/mesure-alternatives.js --detail     # + chaque lecon candidate
     node tools/mesure-alternatives.js --cours=js   # un seul cours
     node tools/mesure-alternatives.js --deja       # celles qui en parlent deja
   ============================================================================= */
"use strict";

var fs = require("fs");
var path = require("path");

var RACINE = path.join(__dirname, "..");
var PAGES = path.join(RACINE, "pages");
var DETAIL = process.argv.indexOf("--detail") >= 0;
var DEJA = process.argv.indexOf("--deja") >= 0;
var COURS = (process.argv.slice(2).filter(function (a) { return a.indexOf("--cours=") === 0; })[0] || "").slice(8);

/* --- ce qui compte comme « plusieurs facons » -------------------------------
   Chaque entree dit : dans QUEL langage, QUEL motif de code, et QUELLE
   alternative canonique. Les motifs sont volontairement etroits : mieux vaut
   manquer une lecon que noyer la liste. */
var PAIRES = [
  { langue: "javascript", cle: "boucle-index",
    motif: /for\s*\(\s*(?:var|let)\s+\w+\s*=\s*0\s*;[^)]*\.length\s*;/,
    quoi: "boucle indexee sur un tableau",
    autre: "map / filter / reduce, ou for…of",
    cours: ["js", "javascript", "projets-js", "algo", "nodejs", "vue", "react", "typescript"] },
  { langue: "javascript", cle: "accumulation",
    motif: /(?:var|let|const)\s+\w+\s*=\s*\[\s*\]\s*;[\s\S]{0,200}?\.push\s*\(/,
    quoi: "tableau accumule par push dans une boucle",
    autre: "map ou filter, qui disent l'intention",
    cours: ["js", "javascript", "projets-js", "algo", "nodejs"] },
  { langue: "javascript", cle: "chaine-concat",
    motif: /["'][^"'\n]*["']\s*\+\s*\w+\s*\+\s*["']/,
    quoi: "chaine assemblee par concatenation",
    autre: "litteral gabarit (backticks)",
    cours: ["js", "javascript", "projets-js"] },
  { langue: "javascript", cle: "then",
    motif: /\.then\s*\(/,
    quoi: "promesse chainee par .then",
    autre: "async / await",
    cours: ["js", "javascript", "nodejs", "api", "projets-js"] },
  { langue: "python", cle: "boucle-accumulation",
    motif: /\w+\s*=\s*\[\s*\][\s\S]{0,200}?\.append\s*\(/,
    quoi: "liste accumulee par append",
    autre: "comprehension de liste",
    cours: ["python", "python-avance", "pandas", "data-eng", "ml"] },
  { langue: "python", cle: "range-len",
    motif: /for\s+\w+\s+in\s+range\s*\(\s*len\s*\(/,
    quoi: "boucle sur range(len(...))",
    autre: "enumerate, ou l'iteration directe",
    cours: ["python", "python-avance", "pandas", "data-eng", "ml"] },
  { langue: "python", cle: "open-sans-with",
    motif: /^\s*\w+\s*=\s*open\s*\(/m,
    quoi: "fichier ouvert sans `with`",
    autre: "with open(...) as f",
    cours: ["python", "python-avance", "data-eng"] },
  { langue: "sql", cle: "sous-requete-in",
    motif: /IN\s*\(\s*SELECT/i,
    quoi: "sous-requete dans un IN",
    autre: "jointure, ou EXISTS",
    cours: ["sql", "bdd", "data-eng", "nosql"] },
  { langue: "sql", cle: "sous-requete-select",
    motif: /SELECT[\s\S]{0,120}?\(\s*SELECT/i,
    quoi: "sous-requete dans la liste des colonnes",
    autre: "jointure avec agregat",
    cours: ["sql", "bdd", "data-eng"] },
  { langue: "css", cle: "float",
    motif: /float\s*:\s*(left|right)/i,
    quoi: "mise en page par float",
    autre: "flexbox ou grid",
    cours: ["css", "css-avance", "sass", "html", "frontpro"] },
  { langue: "css", cle: "position-absolute",
    motif: /position\s*:\s*absolute/i,
    quoi: "placement en position absolue",
    autre: "grid, qui garde le flux",
    cours: ["css", "css-avance", "sass"] },
  { langue: "bash", cle: "boucle-find",
    motif: /for\s+\w+\s+in\s+\$\(\s*(ls|find)/,
    quoi: "boucle sur la sortie de ls ou find",
    autre: "find -exec, ou xargs -0",
    cours: ["bash", "linux", "devops"] },
  { langue: "java", cle: "boucle-index",
    motif: /for\s*\(\s*int\s+\w+\s*=\s*0\s*;[^)]*(?:\.size\(\)|\.length)/,
    quoi: "boucle indexee",
    autre: "for-each, ou l'API Stream",
    cours: ["java", "kotlin", "scala", "groovy"] },
  { langue: "csharp", cle: "boucle-index",
    motif: /for\s*\(\s*int\s+\w+\s*=\s*0\s*;[^)]*(?:\.Count|\.Length)/,
    quoi: "boucle indexee",
    autre: "foreach, ou LINQ",
    cours: ["csharp", "dotnet"] },
  { langue: "php", cle: "boucle-index",
    motif: /for\s*\(\s*\$\w+\s*=\s*0\s*;[^)]*count\s*\(/,
    quoi: "boucle indexee",
    autre: "foreach, array_map, array_filter",
    cours: ["php"] },
  { langue: "go", cle: "boucle-index",
    motif: /for\s+\w+\s*:=\s*0\s*;[^{]*len\s*\(/,
    quoi: "boucle indexee",
    autre: "for … range",
    cours: ["go"] },
  { langue: "rust", cle: "boucle-index",
    motif: /for\s+\w+\s+in\s+0\s*\.\.\s*\w+\.len\s*\(\s*\)/,
    quoi: "boucle sur les indices",
    autre: "iter() et les adaptateurs",
    cours: ["rust"] },
  { langue: "*", cle: "recursion",
    motif: /\b(\w+)\s*\([^)]*\)[\s\S]{0,300}?\breturn\b[^;\n]*\b\1\s*\(/,
    quoi: "fonction recursive",
    autre: "version iterative, avec une pile explicite si besoin",
    cours: ["algo", "python", "js", "javascript", "haskell", "ocaml", "elixir", "clojure", "patterns"] }
];

/* Une lecon qui DIT DEJA qu'il y a plusieurs facons n'a pas besoin qu'on le lui
   apprenne : ces tournures sont celles qu'emploie le site. */
/* ⚠️ PREMIERE VERSION DE CE MOTIF : BEAUCOUP TROP LARGE. Elle capturait
   « plut[oô]t que », « au lieu de », « variante », « alternative » — 2 496
   occurrences dans 203 lecons, dont l'immense majorite sont des conseils
   ordinaires : « choisis prix plutot que p », « anime transform plutot que des
   proprietes qui declenchent un reflow ». Mesure faite avant de s'en servir :
   un filtre qui ecarte a tort est pire qu'un filtre absent, parce qu'il rend
   une liste COURTE, donc rassurante. Ne restent que les tournures qui annoncent
   une SECONDE FACON D'ECRIRE LA MEME CHOSE. */
var DEJA_DIT = /une autre fa[çc]on de|la m[eê]me chose (?:avec|en|autrement)|on aurait pu (?:aussi )?[ée]crire|on peut aussi (?:l')?[ée]crire|deux fa[çc]ons d'[ée]crire|version [ée]quivalente|[ée]crit autrement|s'[ée]crit aussi|autre [ée]criture|m[eê]me r[ée]sultat (?:avec|en)/i;

function lireLecons() {
  var out = [];
  var cours = fs.readdirSync(PAGES, { withFileTypes: true })
    .filter(function (e) { return e.isDirectory(); })
    .map(function (e) { return e.name; });
  cours.forEach(function (c) {
    if (COURS && c !== COURS) return;
    var dir = path.join(PAGES, c);
    fs.readdirSync(dir).forEach(function (f) {
      if (!/^lecon-\d+\.html$/.test(f)) return;
      out.push({ cours: c, fichier: f, chemin: path.join(dir, f) });
    });
  });
  return out;
}

/* Les blocs de code, avec leur langage. On ne cherche QUE la, jamais dans la
   prose : « for » dans une phrase francaise ne prouve rien. */
function blocs(html) {
  var out = [], re = /<pre[^>]*><code class="language-([a-z0-9+#-]+)"[^>]*>([\s\S]*?)<\/code><\/pre>/g, m;
  while ((m = re.exec(html))) {
    out.push({ langue: m[1], code: m[2].replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;/g, "'") });
  }
  return out;
}

function titreDe(html) {
  var m = /<h1[^>]*>([\s\S]*?)<\/h1>/.exec(html);
  return m ? m[1].replace(/<[^>]+>/g, "").trim() : "(sans titre)";
}

function prose(html) {
  /* La prose SANS les blocs de code : c'est la qu'une lecon annonce une
     alternative. */
  return html.replace(/<pre[\s\S]*?<\/pre>/g, " ").replace(/<[^>]+>/g, " ");
}

var lecons = lireLecons();
var candidats = [], parlentDeja = 0, lus = 0, blocsLus = 0;

lecons.forEach(function (l) {
  var html = fs.readFileSync(l.chemin, "utf8");
  lus++;
  var bs = blocs(html);
  blocsLus += bs.length;
  var trouves = {};
  bs.forEach(function (b) {
    PAIRES.forEach(function (pa) {
      /* ⚠️ UNE ALTERNATIVE NE COMPTE QUE LA OU LA NOTION EST ENSEIGNEE. Sans
         ce filtre, le classement remontait les lecons de `crypto` et
         d'`offensive` : elles sont longues, leur code manipule des octets dans
         des boucles indexees — et une comprehension de liste n'y apprendrait
         rien a personne. Le poids mesurait la LONGUEUR, pas le choix. */
      if (pa.cours && pa.cours.indexOf(l.cours) < 0) return;
      if (pa.langue !== "*" && pa.langue !== b.langue) return;
      if (pa.langue === "*" && !/^(javascript|python|java|csharp|php|go|rust|c|cpp|ruby|kotlin|scala|swift)$/.test(b.langue)) return;
      if (!pa.motif.test(b.code)) return;
      if (!trouves[pa.cle]) trouves[pa.cle] = { quoi: pa.quoi, autre: pa.autre, n: 0 };
      trouves[pa.cle].n++;
    });
  });
  var cles = Object.keys(trouves);
  if (!cles.length) return;
  var deja = DEJA_DIT.test(prose(html));
  if (deja) parlentDeja++;
  if (deja && !DEJA) return;
  if (!deja && DEJA) return;
  candidats.push({
    cours: l.cours, fichier: l.fichier, titre: titreDe(html),
    motifs: cles.map(function (k) { return k + " x" + trouves[k].n; }),
    detail: cles.map(function (k) { return trouves[k]; }),
    poids: cles.length * 10 + cles.reduce(function (a, k) { return a + trouves[k].n; }, 0)
  });
});

candidats.sort(function (a, b) {
  return b.poids - a.poids || (a.cours < b.cours ? -1 : 1);
});

var parCours = {};
candidats.forEach(function (c) {
  if (!parCours[c.cours]) parCours[c.cours] = [];
  parCours[c.cours].push(c);
});

console.log("mesure-alternatives.js — " + lus + " lecon(s) lue(s), " + blocsLus + " bloc(s) de code, "
  + PAIRES.length + " motifs.");
console.log((DEJA ? "Lecons qui parlent DEJA d'une alternative" : "Lecons candidates (elles n'en parlent pas)")
  + " : " + candidats.length + "   [" + parlentDeja + " lecon(s) en parlent deja]\n");

Object.keys(parCours).sort(function (a, b) { return parCours[b].length - parCours[a].length; })
  .forEach(function (c) {
    console.log("  " + (c + "                    ").slice(0, 20) + " " + String(parCours[c].length).padStart(3) + " lecon(s)");
  });

if (DETAIL) {
  console.log("");
  candidats.forEach(function (c) {
    console.log("  " + c.cours + "/" + c.fichier + "  [" + c.poids + "]  " + c.titre);
    console.log("      " + c.motifs.join(", "));
  });
}
