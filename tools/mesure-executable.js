/* =============================================================================
   mesure-executable.js — Combien de code ce site fait-il RÉELLEMENT exécuter ?

   Répond au point A1 du chantier V14 : pour chaque langage, combien de blocs de
   code existent, combien portent aujourd'hui un bouton d'exécution, et combien
   d'exercices sont auto-corrigés en EXÉCUTANT la réponse plutôt qu'en la
   comparant à un mot-clé.

   Aucune dépendance : lit le SOURCE des leçons et applique les mêmes règles que
   js/runner.js (garde-fou BROWSER_ONLY) et js/lecon.js (un exercice n'est
   exécuté que s'il porte un champ « run »).

   Lancement : node tools/mesure-executable.js   [--csv]
   ============================================================================= */
"use strict";
const fs = require("fs");
const path = require("path");

const RACINE = path.join(__dirname, "..");

/* LA RÈGLE DU SITE, recopiée de `js/lecon.js` (initExos) — et elle a changé depuis
   que cet outil a été écrit pour A1. À l'époque, seul `type:"code"` portant un champ
   `run` était exécuté. Les phases B1, B2 et B5 ont ajouté trois moteurs — SQLite,
   CPython et le juge d'expressions régulières — que cet outil comptait encore parmi
   les exercices « corrigés par mot-clé » : il annonçait 290 exercices exécutés là où
   le site en exécutait 354, soit 64 de moins (26 regex, 25 python, 13 sql).
   ⚠️ UN OUTIL DE MESURE SE PÉRIME QUAND CE QU'IL MESURE ÉVOLUE. Le contrôle qui le
   révèle : compter les `type` du site (`text`, `code`, `python`, `sql`, `regex`) et
   vérifier que la somme des types exécutables tombe sur le chiffre annoncé. */
function executeParLeSite(e) {
  if (!e) return false;
  if (e.run) return true;                                   // type:"code" et type:"python"
  if (e.type === "regex" && e.cases) return true;           // juge d'expressions régulières
  if (e.type === "sql" && e.attendu) return true;           // requête posée dans SQLite
  return false;
}
const PAGES = path.join(RACINE, "pages");

/* Règle EXACTE de js/runner.js : un bloc JavaScript qui touche une API de page
   ou de Node ne tourne pas dans le Web Worker, donc il n'a pas de bouton. */
const BROWSER_ONLY =
  /(?:^|[^\w$À-ɏ])(document|window|localStorage|sessionStorage|alert|prompt|confirm|location|navigator|process|Buffer|__dirname|__filename)(?![\w$À-ɏ])|require\s*\(|module\.exports|\bexports\.|\bglobalThis\b|node:|new Worker|postMessage|SharedArrayBuffer|Atomics|importScripts/;

/* Ce que runner.js sait faire aujourd'hui, par classe Prism. */
const MOTEUR = {
  javascript: "worker JS",
  js: "worker JS",
  markup: "aperçu HTML",
  html: "aperçu HTML",
  python: "CPython 3.12 embarqué",
  sql: "SQLite embarqué",
};

/* Règles EXACTES de js/runner.js pour SQL. Un bloc n'a de bouton que s'il contient une
   vraie instruction, et s'il n'est pas écrit pour un autre SGBD que SQLite. */
const SQL_INSTRUCTION = /\b(SELECT|INSERT|UPDATE|DELETE|CREATE|DROP|ALTER|WITH)\b/i;
const AUTRE_SGBD = /\$\$|\bLANGUAGE\s+plpgsql\b|\bCREATE\s+(?:OR\s+REPLACE\s+)?(?:FUNCTION|PROCEDURE|TRIGGER)\b|\bMATERIALIZED\s+VIEW\b|\bFOR\s+(?:UPDATE|SHARE)\b|\bGROUPING\s+SETS\b|\bQUALIFY\b|\bMERGE\s+INTO\b|\bGENERATED\s+(?:ALWAYS|BY\s+DEFAULT)\s+AS\s+IDENTITY\b|\bISOLATION\s+LEVEL\b|\bAUTO_INCREMENT\b|\bENGINE\s*=|\bSERIAL\b|\bTRUNCATE\b|\b(?:DATE|TIMESTAMP|INTERVAL)\s+'|::|\bEXPLAIN\s+ANALYZE\b|\bSET\s+search_path\b|\bILIKE\b|\bSHOW\s+(?:TABLES|DATABASES)\b/i;

/* Règles EXACTES de js/runner.js pour Python. La liste des modules embarqués est LUE
   dans runner.js plutôt que recopiée : 185 noms dupliqués dériveraient en silence. */
const PAS_DU_PYTHON = /^[ \t]*\$[ \t]+[a-z]|^[ \t]*(?:pip|pip3|python|python3|pytest|ruff|mypy|black|flake8|poetry|conda|jupyter|uv|source|venv|deactivate)[ \t]+[-\w.\/]|^[ \t]*\[(?:build-system|project|tool)[\w.]*\][ \t]*$|[├└│]|^[ \t]*\/\/|^[ \t]*\w*(?:Error|Exception):[ \t]/m;

const PY_MODULES = (function () {
  const src = fs.readFileSync(path.join(RACINE, "js", "runner.js"), "utf8");
  const m = src.match(/var PY_MODULES = \(([\s\S]*?)\)\.split\(" "\);/);
  if (!m) throw new Error("PY_MODULES introuvable dans js/runner.js");
  return new Set(m[1].replace(/["+\n\r]/g, " ").split(/\s+/).filter(Boolean));
})();

function pyModuleAbsent(code) {
  const re = /^[ \t]*(?:import|from)[ \t]+([A-Za-z_][\w.]*)/gm;
  let m;
  while ((m = re.exec(code))) {
    if (!PY_MODULES.has(m[1].split(".")[0])) return m[1].split(".")[0];
  }
  return null;
}

function decodeEntites(s) {
  return s
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&");
}

function lecons() {
  const out = [];
  for (const cours of fs.readdirSync(PAGES)) {
    const dir = path.join(PAGES, cours);
    if (!fs.statSync(dir).isDirectory()) continue;
    for (const f of fs.readdirSync(dir)) {
      if (/^lecon-\d+\.html$/.test(f)) out.push({ cours, fichier: path.join(dir, f) });
    }
  }
  return out;
}

const parLangue = new Map();
const parCours = new Map();

function bump(m, k, init) {
  if (!m.has(k)) m.set(k, init());
  return m.get(k);
}

let totalExosCode = 0;
let totalExosText = 0;
let totalExosNul = 0;
let leconsAvecExos = 0;
let jsonCasse = 0;
const sansExos = [];

const liste = lecons();
for (const item of liste) {
  const cours = item.cours;
  const src = fs.readFileSync(item.fichier, "utf8");
  const c = bump(parCours, cours, function () {
    return { blocs: new Map(), exos: { code: 0, text: 0, nul: 0 }, lecons: 0 };
  });
  c.lecons++;

  /* --- blocs de code ------------------------------------------------------ */
  const re = /<code class="language-([\w-]+)">([\s\S]*?)<\/code>/g;
  let m;
  while ((m = re.exec(src))) {
    const langue = m[1];
    const code = decodeEntites(m[2]);
    const L = bump(parLangue, langue, function () {
      return { blocs: 0, executables: 0, bloquesParGarde: 0, cours: new Set() };
    });
    L.blocs++;
    L.cours.add(cours);
    c.blocs.set(langue, (c.blocs.get(langue) || 0) + 1);

    if (langue === "javascript" || langue === "js") {
      if (BROWSER_ONLY.test(code)) L.bloquesParGarde++;
      else L.executables++;
    } else if (langue === "markup" || langue === "html") {
      L.executables++; // aperçu HTML : disponible en file://
    } else if (langue === "python") {
      /* CPython 3.12 est embarqué depuis le 2026-08-26 (A4). Trois gardes : les
         sessions REPL, les paquets non embarqués, et ce qui n'est pas du Python. */
      if (code.indexOf(">>>") !== -1 || pyModuleAbsent(code) || PAS_DU_PYTHON.test(code)) L.bloquesParGarde++;
      else L.executables++;
    } else if (langue === "sql") {
      /* SQLite est embarqué depuis le 2026-08-26 (A2/A3). */
      if (!SQL_INSTRUCTION.test(code) || AUTRE_SGBD.test(code)) L.bloquesParGarde++;
      else L.executables++;
    }
  }

  /* --- exercices ---------------------------------------------------------- */
  const mx = src.match(/<script type="application\/json" data-exos>([\s\S]*?)<\/script>/);
  if (mx) {
    leconsAvecExos++;
    let data;
    try {
      data = JSON.parse(mx[1]);
    } catch (e) {
      jsonCasse++;
      console.error("JSON data-exos invalide : " + item.fichier);
      continue;
    }
    for (const e of data) {
      if (!e) {
        c.exos.nul++;
        totalExosNul++;
      } else if (executeParLeSite(e)) {
        c.exos.code++;
        totalExosCode++;
      } else {
        /* un type:code SANS champ run est corrigé par mot-clé, comme un type:text */
        c.exos.text++;
        totalExosText++;
      }
    }
  } else {
    sansExos.push({ cours: cours, fichier: item.fichier });
  }
}

/* ---------------------------------------------------------------- affichage */
const langues = [...parLangue.entries()].sort(function (a, b) {
  return b[1].blocs - a[1].blocs;
});
const totalBlocs = langues.reduce(function (s, e) { return s + e[1].blocs; }, 0);
const totalExec = langues.reduce(function (s, e) { return s + e[1].executables; }, 0);

if (process.argv.indexOf("--csv") !== -1) {
  console.log("langage;blocs;cours;executables_aujourdhui;moteur");
  for (const e of langues) {
    console.log([e[0], e[1].blocs, e[1].cours.size, e[1].executables, MOTEUR[e[0]] || "aucun"].join(";"));
  }
  process.exit(0);
}

console.log("=".repeat(78));
console.log("  BLOCS DE CODE PAR LANGAGE — " + liste.length + " lecons lues");
console.log("=".repeat(78));
console.log(
  "langage".padEnd(16) + "blocs".padStart(7) + "cours".padStart(7) +
  "execut.".padStart(9) + "  moteur actuel"
);
console.log("-".repeat(78));
for (const e of langues) {
  if (e[1].blocs < 5) continue; // sous 5 blocs, le bruit n'oriente aucune decision
  console.log(
    e[0].padEnd(16) + String(e[1].blocs).padStart(7) + String(e[1].cours.size).padStart(7) +
    String(e[1].executables).padStart(9) + "  " + (MOTEUR[e[0]] || "aucun")
  );
}
const petits = langues.filter(function (e) { return e[1].blocs < 5; });
console.log(
  "-".repeat(78) + "\n" + petits.length + " autres langages sous 5 blocs (" +
  petits.reduce(function (s, e) { return s + e[1].blocs; }, 0) + " blocs au total)"
);
console.log(
  "\nTOTAL : " + totalBlocs + " blocs, dont " + totalExec +
  " executables aujourd'hui en file:// (" + ((100 * totalExec) / totalBlocs).toFixed(1) + " %)"
);
const jsL = parLangue.get("javascript");
if (jsL) {
  console.log(
    "  . JavaScript : " + jsL.executables + " executables, " + jsL.bloquesParGarde +
    " prives de bouton par le garde-fou BROWSER_ONLY"
  );
}

console.log("\n" + "=".repeat(78));
console.log("  EXERCICES — correction par EXECUTION contre correction par MOT-CLE");
console.log("=".repeat(78));
const totalExos = totalExosCode + totalExosText;
console.log("exercices executes (run, regex, sql)   : " + totalExosCode);
console.log("exercices compares a un mot-cle      : " + totalExosText);
console.log("entrees null (pas de champ)          : " + totalExosNul);
console.log(
  "PART REELLEMENT AUTO-CORRIGEE        : " +
  ((100 * totalExosCode) / totalExos).toFixed(2) + " % (" + totalExosCode + " / " + totalExos + ")"
);
console.log("lecons portant un bloc data-exos     : " + leconsAvecExos);
if (jsonCasse) console.log("! blocs JSON invalides : " + jsonCasse);

console.log("\n--- cours ayant au moins un exercice execute ---");
const gagnants = [...parCours.entries()]
  .filter(function (e) { return e[1].exos.code > 0; })
  .sort(function (a, b) { return b[1].exos.code - a[1].exos.code; });
for (const e of gagnants) {
  console.log("  " + e[0].padEnd(18) + String(e[1].exos.code).padStart(4) + " executes");
}
console.log("  -> " + gagnants.length + " cours sur " + parCours.size);

/* --- combien d'exercices chaque moteur rendrait executable ------------------
   Un exercice appartient au langage DOMINANT de son cours : c'est ce langage
   qu'il fait ecrire. On regroupe donc les exercices corriges par mot-cle selon
   le moteur qui pourrait, demain, les executer. */
const MOTEUR_CANDIDAT = {
  javascript: "worker JS (deja disponible)",
  js: "worker JS (deja disponible)",
  jsx: "worker JS (deja disponible)",
  tsx: "worker JS (deja disponible)",
  typescript: "worker JS (deja disponible)",
  markup: "apercu HTML (deja disponible)",
  html: "apercu HTML (deja disponible)",
  css: "apercu HTML (deja disponible)",
  scss: "apercu HTML (deja disponible)",
  sql: "sql.js a embarquer",
  python: "Python a trancher (A4)",
};
const parMoteur = new Map();
for (const e of parCours.entries()) {
  const dom = [...e[1].blocs.entries()].sort(function (a, b) { return b[1] - a[1]; })[0];
  const cle = dom ? MOTEUR_CANDIDAT[dom[0]] || "aucun moteur possible -> prediction (A5)"
                  : "aucun moteur possible -> prediction (A5)";
  const M = bump(parMoteur, cle, function () {
    return { cours: 0, exosMotCle: 0, exosExecutes: 0, blocs: 0 };
  });
  M.cours++;
  M.exosMotCle += e[1].exos.text;
  M.exosExecutes += e[1].exos.code;
  M.blocs += [...e[1].blocs.values()].reduce(function (s, n) { return s + n; }, 0);
}
console.log("\n--- ce que chaque moteur rendrait executable ---");
console.log(
  "moteur".padEnd(38) + "cours".padStart(6) + "blocs".padStart(7) +
  "exos mot-cle".padStart(14) + "deja exec.".padStart(12)
);
const moteurs = [...parMoteur.entries()].sort(function (a, b) {
  return b[1].exosMotCle - a[1].exosMotCle;
});
for (const e of moteurs) {
  console.log(
    e[0].padEnd(38) + String(e[1].cours).padStart(6) + String(e[1].blocs).padStart(7) +
    String(e[1].exosMotCle).padStart(14) + String(e[1].exosExecutes).padStart(12)
  );
}

/* --- lecons totalement depourvues d'exercices ------------------------------ */
if (sansExos.length) {
  console.log("\n--- lecons SANS aucun bloc data-exos ---");
  const grp = new Map();
  for (const f of sansExos) grp.set(f.cours, (grp.get(f.cours) || 0) + 1);
  for (const e of [...grp.entries()].sort(function (a, b) { return b[1] - a[1]; })) {
    console.log("  " + e[0].padEnd(18) + String(e[1]).padStart(4) + " lecons");
  }
  console.log("  -> " + sansExos.length + " lecons sur " + liste.length + " n'ont AUCUN exercice");
}

console.log("\n--- les 20 cours au plus fort potentiel (aucun exercice execute) ---");
const potentiel = [...parCours.entries()]
  .map(function (e) {
    const dom = [...e[1].blocs.entries()].sort(function (a, b) { return b[1] - a[1]; })[0] || ["-", 0];
    return { cours: e[0], langue: dom[0], blocs: dom[1], exec: e[1].exos.code, exos: e[1].exos.text };
  })
  .filter(function (x) { return x.exec === 0; })
  .sort(function (a, b) { return b.blocs - a.blocs; })
  .slice(0, 20);
console.log("cours".padEnd(18) + "langage dominant".padEnd(18) + "blocs".padStart(6) + "  exos mot-cle");
for (const p of potentiel) {
  console.log(
    p.cours.padEnd(18) + p.langue.padEnd(18) + String(p.blocs).padStart(6) + String(p.exos).padStart(14)
  );
}
