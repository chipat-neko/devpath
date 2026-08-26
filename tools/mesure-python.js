/* =============================================================================
   mesure-python.js — De quel Python ce site a-t-il RÉELLEMENT besoin ?

   A servi à trancher le point A4 du chantier V14 : avant de décider si l'on
   embarquait Pyodide ou si l'on écrivait un mini-interpréteur, il fallait savoir
   quelle part du langage les blocs de ce site emploient vraiment. Verdict rendu le
   2026-08-26 : Pyodide, embarqué en 8,27 Mo (+10,6 %) dans assets/vendor/pyodide/.
   L'outil reste utile pour suivre ce que le moteur couvre au fil des leçons neuves.

   L'outil lit le SOURCE des leçons, extrait tous les blocs `language-python`,
   et relève pour chacun : les modules importés, les constructions du langage
   employées, et les fonctions natives appelées. Il classe ensuite chaque bloc
   par NIVEAU DE LANGAGE requis — c'est ce classement qui chiffre la décision.

   Aucune dépendance. Lancement : node tools/mesure-python.js [--details] [--csv]
   ============================================================================= */
"use strict";
const fs = require("fs");
const path = require("path");

const RACINE = path.join(__dirname, "..");
const PAGES = path.join(RACINE, "pages");

function decodeEntites(s) {
  return s.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"')
          .replace(/&#39;/g, "'").replace(/&amp;/g, "&");
}

/* Un bloc n'a de sens « exécutable » que s'il produit quelque chose d'observable.
   La règle du site (runner.js) : la sortie, c'est print(). */
function aUneSortie(code) { return /\bprint\s*\(/.test(code); }

/* --- Constructions du langage, du plus simple au plus coûteux à implémenter --
   Le tri en niveaux est la matière de la décision : un mini-interpréteur qui
   s'arrête au niveau N couvre les blocs dont TOUTES les constructions sont <= N. */
const CONSTRUCTIONS = [
  // niveau 1 : le noyau que tout mini-interpréteur devrait couvrir
  { nom: "affectation",        n: 1, re: /^\s*[A-Za-z_]\w*\s*=[^=]/m },
  { nom: "print",              n: 1, re: /\bprint\s*\(/ },
  { nom: "if/elif/else",       n: 1, re: /^\s*(if|elif|else)\b/m },
  { nom: "for",                n: 1, re: /^\s*for\s+/m },
  { nom: "while",              n: 1, re: /^\s*while\s+/m },
  { nom: "def",                n: 1, re: /^\s*def\s+/m },
  { nom: "return",             n: 1, re: /^\s*return\b/m },
  { nom: "liste litterale",    n: 1, re: /\[[^\]]*\]/ },
  { nom: "dict litteral",      n: 1, re: /\{\s*['"][^'"]*['"]\s*:/ },
  { nom: "tuple",              n: 1, re: /=\s*\([^)]*,[^)]*\)|,\s*\)/ },
  { nom: "indexation/tranche", n: 1, re: /\w\s*\[\s*[-\w:'"]/ },
  { nom: "f-string",           n: 1, re: /\bf['"]/ },
  { nom: "methode de chaine",  n: 1, re: /\.(upper|lower|strip|split|join|replace|startswith|endswith|find|title|capitalize|count|format)\s*\(/ },
  { nom: "methode de liste",   n: 1, re: /\.(append|extend|insert|remove|pop|sort|reverse|index|clear|copy)\s*\(/ },
  { nom: "methode de dict",    n: 1, re: /\.(keys|values|items|get|update|setdefault)\s*\(/ },

  // niveau 2 : idiomes courants, encore raisonnables
  { nom: "comprehension",      n: 2, re: /\[[^\]\n]*\bfor\b[^\]\n]*\]|\{[^}\n]*\bfor\b[^}\n]*\}/ },
  { nom: "lambda",             n: 2, re: /\blambda\b/ },
  { nom: "try/except",         n: 2, re: /^\s*(try|except|finally)\b/m },
  { nom: "raise",              n: 2, re: /^\s*raise\b/m },
  { nom: "with",               n: 2, re: /^\s*with\s+/m },
  { nom: "class",              n: 2, re: /^\s*class\s+/m },
  { nom: "args/kwargs",        n: 2, re: /def\s+\w+\s*\([^)]*\*\*?\w/ },
  { nom: "decorateur",         n: 2, re: /^\s*@\w/m },
  { nom: "yield",              n: 2, re: /\byield\b/ },
  { nom: "global/nonlocal",    n: 2, re: /^\s*(global|nonlocal)\b/m },
  { nom: "walrus :=",          n: 2, re: /:=/ },
  { nom: "match/case",         n: 2, re: /^\s*match\s+.*:\s*$/m },
  { nom: "annotation de type", n: 2, re: /def\s+\w+\s*\([^)]*:\s*(int|str|float|bool|list|dict|List|Dict|Optional)\b|->\s*[A-Za-z\[]/ },

  // niveau 3 : ce qui exige une bibliothèque ou un runtime réel
  { nom: "import",             n: 3, re: /^\s*(import|from)\s+/m },
  { nom: "async/await",        n: 3, re: /\b(async\s+def|await)\b/ },
  { nom: "open(fichier)",      n: 3, re: /\bopen\s*\(/ },
  { nom: "input()",            n: 3, re: /\binput\s*\(/ },
  { nom: "__name__",           n: 3, re: /__name__/ },
];

const NATIVES = ["len","range","sum","min","max","sorted","enumerate","zip","abs","round",
  "int","str","float","bool","list","dict","set","tuple","map","filter","reversed","type",
  "isinstance","any","all","input","open","format","repr","divmod","pow","chr","ord",
  "super","getattr","setattr","hasattr","dir","id","hash","iter","next","frozenset","bytes"];

/* --- Ce que le Pyodide EMBARQUÉ fournit ------------------------------------
   La liste des 185 modules réellement importables a été obtenue en EXÉCUTANT
   `sys.builtin_module_names` + `pkgutil.iter_modules()` dans le moteur embarqué,
   puis inscrite dans js/runner.js (PY_MODULES). On la LIT ici plutôt que de la
   recopier : deux listes de 185 noms dériveraient en silence. Tout le reste —
   numpy, pandas, matplotlib, scikit-learn — est un paquet séparé, qui ne
   s'obtient que par le réseau : inutilisable en file://. */
const STDLIB = (function () {
  const src = fs.readFileSync(path.join(RACINE, "js", "runner.js"), "utf8");
  const m = src.match(new RegExp('var PY_MODULES = \\(([^;]*?)\\)\\.split'));
  if (!m) throw new Error("PY_MODULES introuvable dans js/runner.js");
  return new Set(m[1].split(/[^A-Za-z0-9_]+/).filter(Boolean));
})();

function lecons() {
  const out = [];
  for (const cours of fs.readdirSync(PAGES)) {
    const dir = path.join(PAGES, cours);
    if (!fs.statSync(dir).isDirectory()) continue;
    for (const f of fs.readdirSync(dir)) {
      if (/^lecon-\d+\.html$/.test(f)) out.push({ cours: cours, fichier: path.join(dir, f) });
    }
  }
  return out;
}

const modules = new Map();
const construits = new Map();
const natives = new Map();
const parCours = new Map();
const parCoursNiveau = new Map();
let total = 0, avecPrint = 0;
const parNiveau = { 1: 0, 2: 0, 3: 0 };
const blocsNiveau3 = [];
/* croisements qui tranchent la décision */
let sansImportDuTout = 0, sansImportEtPrint = 0;
let stdlibSeule = 0, stdlibSeuleEtPrint = 0;
let exigeUnWheel = 0, exigeUnWheelEtPrint = 0;
let n12EtPrint = 0;
const tiersVus = new Map();

function inc(m, k) { m.set(k, (m.get(k) || 0) + 1); }

for (const item of lecons()) {
  const src = fs.readFileSync(item.fichier, "utf8");
  const re = /<code class="language-python">([\s\S]*?)<\/code>/g;
  let m;
  while ((m = re.exec(src))) {
    const code = decodeEntites(m[1]);
    total++;
    inc(parCours, item.cours);
    if (aUneSortie(code)) avecPrint++;

    let niveauMax = 1;
    const trouveesN3 = [];
    for (const c of CONSTRUCTIONS) {
      if (c.re.test(code)) {
        inc(construits, c.nom);
        if (c.n === 3) trouveesN3.push(c.nom);
        if (c.n > niveauMax) niveauMax = c.n;
      }
    }
    parNiveau[niveauMax]++;
    if (!parCoursNiveau.has(item.cours)) parCoursNiveau.set(item.cours, { 1: 0, 2: 0, 3: 0 });
    parCoursNiveau.get(item.cours)[niveauMax]++;
    if (niveauMax === 3) {
      blocsNiveau3.push({ f: path.relative(RACINE, item.fichier), c: trouveesN3 });
    }

    let mm;
    const reImp = /^\s*(?:import\s+([\w.]+)|from\s+([\w.]+)\s+import)/gm;
    const importsDuBloc = [];
    while ((mm = reImp.exec(code))) {
      const mod = (mm[1] || mm[2]).split(".")[0];
      inc(modules, mod);
      importsDuBloc.push(mod);
    }
    const sortie = aUneSortie(code);
    const horsStdlib = importsDuBloc.filter(function (x) { return !STDLIB.has(x); });
    if (importsDuBloc.length === 0) {
      sansImportDuTout++;
      if (sortie) sansImportEtPrint++;
    } else if (horsStdlib.length === 0) {
      stdlibSeule++;
      if (sortie) stdlibSeuleEtPrint++;
    } else {
      exigeUnWheel++;
      if (sortie) exigeUnWheelEtPrint++;
      for (const t of horsStdlib) inc(tiersVus, t);
    }
    if (niveauMax <= 2 && sortie) n12EtPrint++;

    for (const n of NATIVES) {
      if (new RegExp("(?:^|[^\\w.])" + n + "\\s*\\(").test(code)) inc(natives, n);
    }
  }
}

function tri(m) { return [...m.entries()].sort(function (a, b) { return b[1] - a[1]; }); }

if (process.argv.indexOf("--csv") !== -1) {
  console.log("categorie;cle;blocs");
  for (const e of tri(modules)) console.log("module;" + e[0] + ";" + e[1]);
  for (const e of tri(construits)) console.log("construction;" + e[0] + ";" + e[1]);
  for (const e of tri(natives)) console.log("native;" + e[0] + ";" + e[1]);
  process.exit(0);
}

const L = "=".repeat(74);
console.log(L);
console.log("  BLOCS PYTHON DU SITE — " + total + " blocs, " + parCours.size + " cours");
console.log(L);
console.log("blocs contenant un print() (donc a sortie observable) : " + avecPrint +
            "  (" + (avecPrint * 100 / total).toFixed(1) + " %)");
console.log("");
console.log("-- repartition par NIVEAU DE LANGAGE requis ---------------------------");
console.log("  n1 (noyau : variables, controle, fonctions, listes/dicts) : " +
            String(parNiveau[1]).padStart(5) + "  (" + (parNiveau[1] * 100 / total).toFixed(1) + " %)");
console.log("  n2 (classes, comprehensions, exceptions, generateurs)     : " +
            String(parNiveau[2]).padStart(5) + "  (" + (parNiveau[2] * 100 / total).toFixed(1) + " %)");
console.log("  n3 (imports, fichiers, input, async — runtime reel)       : " +
            String(parNiveau[3]).padStart(5) + "  (" + (parNiveau[3] * 100 / total).toFixed(1) + " %)");
console.log("");
console.log("-- CE QUE CHAQUE OPTION COUVRIRAIT ------------------------------------");
console.log("  (b) mini-interpreteur, niveaux 1+2, blocs avec print() : " +
            String(n12EtPrint).padStart(4) + "  (" + (n12EtPrint * 100 / total).toFixed(1) + " % des blocs)");
console.log("  (a) Pyodide NU (stdlib incluse, aucun wheel) :");
console.log("        blocs sans aucun import          : " + String(sansImportDuTout).padStart(4) +
            "  dont avec print() : " + sansImportEtPrint);
console.log("        blocs n'important que la stdlib  : " + String(stdlibSeule).padStart(4) +
            "  dont avec print() : " + stdlibSeuleEtPrint);
console.log("        => couverts par Pyodide nu       : " + String(sansImportDuTout + stdlibSeule).padStart(4) +
            "  (" + ((sansImportDuTout + stdlibSeule) * 100 / total).toFixed(1) + " %)" +
            "  dont avec print() : " + (sansImportEtPrint + stdlibSeuleEtPrint));
console.log("        blocs EXIGEANT un paquet tiers   : " + String(exigeUnWheel).padStart(4) +
            "  (" + (exigeUnWheel * 100 / total).toFixed(1) + " %)  dont avec print() : " + exigeUnWheelEtPrint);
console.log("        paquets tiers en cause : " + tri(tiersVus).slice(0, 12)
            .map(function (e) { return e[0] + " " + e[1]; }).join(", "));
console.log("");
console.log("-- MODULES importes (" + modules.size + " distincts) -------------------------------");
for (const e of tri(modules)) if (e[1] >= 2) console.log("  " + e[0].padEnd(22) + String(e[1]).padStart(5));
console.log("  (" + tri(modules).filter(function (e) { return e[1] === 1; }).length + " modules n'apparaissent qu'une fois)");
console.log("");
console.log("-- CONSTRUCTIONS du langage -------------------------------------------");
for (const e of tri(construits)) {
  let n = 0; for (const k of CONSTRUCTIONS) if (k.nom === e[0]) n = k.n;
  console.log("  [n" + n + "] " + e[0].padEnd(22) + String(e[1]).padStart(5) +
              "  (" + (e[1] * 100 / total).toFixed(0) + " %)");
}
console.log("");
console.log("-- FONCTIONS NATIVES appelees -----------------------------------------");
const nat = tri(natives);
console.log("  " + nat.length + " distinctes ; les 20 plus employees :");
console.log("  " + nat.slice(0, 20).map(function (e) { return e[0] + " " + e[1]; }).join(", "));
console.log("");
console.log("-- par COURS (blocs ; n1 / n2 / n3) -----------------------------------");
for (const e of tri(parCours)) {
  const d = parCoursNiveau.get(e[0]);
  console.log("  " + e[0].padEnd(20) + String(e[1]).padStart(5) + "   " +
              d[1] + " / " + d[2] + " / " + d[3]);
}

if (process.argv.indexOf("--details") !== -1) {
  console.log("");
  console.log("-- blocs de niveau 3 (les 40 premiers) --------------------------------");
  for (const b of blocsNiveau3.slice(0, 40)) console.log("  " + b.f + "  <- " + b.c.join(", "));
}
