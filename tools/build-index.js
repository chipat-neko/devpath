/* =============================================================================
   build-index.js — Generateur unique des index derives du site Syntaxe.
   Node, ZERO dependance (aucun require hors modules internes fs/path).

   POURQUOI ce fichier : les trois index (js/quiz-index.js, js/flashcards-data.js,
   js/search-index.js) etaient produits a la main. Ils avaient donc decroche du
   contenu reel (audit du 27/07/2026, section 3.1 : 15 cours totalement absents,
   1162 questions et ~9500 termes manquants). Un generateur rejouable supprime la
   cause racine : on relit data.js + les lecons, et on reemet les index.

   QUATRIEME INDEX (manque M6 de l'audit) : js/antiseches-data.js agrege PAR COURS
   les blocs <figure class="cheat-table"> deja ecrits dans les lecons. La
   page pages/antiseches.html n'en presentait que 4, ecrites a la main.

   SOURCE DE VERITE : js/data.js (window.SITE_DATA.content) donne les 77 cours,
   leur dossier, leur titre et la liste ordonnee de leurs lecons. On ne
   balaye JAMAIS le disque a l'aveugle : les 89 pages de redirection et les 4
   dossiers « -avance » historiques doivent rester hors index.

   PIEGE A CONNAITRE : la clef de cours des index est le DOSSIER, pas l'id du
   cours. Le seul cours ou les deux diffèrent est javascript (dossier « js »).
   On utilise donc toujours content[id].dir.

   FILET DE REPRISE : par defaut, le generateur relit l'index existant et REPREND
   les entrees de l'ancien index absentes du contenu actuel (lecons reecrites,
   cours « -avance » fusionnes). C'etait concu pour ne rien perdre, mais ce filet
   MASQUE aussi la peremption : une question supprimee/reecrite survit indefiniment.
   Deux garde-fous ferment la famille de bugs « index perime » :
     --fresh   ignore l'ancien index (ne reprend rien) → PURGE les orphelines.
     --strict  sort en code 1 en listant toute entree qui DOIT etre reprise.
   Regle : apres un changement de contenu, regenerer avec --fresh ; la verification
   (verif-donnees I18) lance --strict pour garantir un index a jour.

   USAGE
     node tools/build-index.js                       # comparaison seule, n'ecrit RIEN
     node tools/build-index.js --write               # ecrit quiz + flashcards
     node tools/build-index.js --write --only=search --out=<dossier>
     node tools/build-index.js --only=quiz,flashcards,search,antiseches,searchlite,pieges
     node tools/build-index.js --write --only=antiseches
     node tools/build-index.js --write --only=search,searchlite   # index de recherche
   Options
     --write        autorise l'ecriture (sans elle, mode comparaison pur)
     --fresh        ignore l'ancien index (ne reprend rien) : purge les orphelines
     --strict       code 1 si une entree doit etre reprise (garde-fou anti-peremption)
     --only=a,b     sous-ensemble parmi quiz, flashcards, search, antiseches, pieges,
                    searchlite (defaut : quiz,flashcards)
     --out=DIR      dossier de sortie (defaut : <racine>/js)
     --root=DIR     racine du site (defaut : dossier parent de tools/)
   ============================================================================= */
"use strict";

var fs = require("fs");
var path = require("path");

/* ------------------------------------------------------------------ options */
var args = process.argv.slice(2);
function flag(name) {
  return args.indexOf("--" + name) !== -1;
}
function opt(name, def) {
  for (var i = 0; i < args.length; i++) {
    if (args[i].indexOf("--" + name + "=") === 0) return args[i].slice(name.length + 3);
  }
  return def;
}
var ROOT = path.resolve(opt("root", path.join(__dirname, "..")));
var OUT = path.resolve(opt("out", path.join(ROOT, "js")));
var WRITE = flag("write");
/* --fresh : ignore l'ancien index (ne REPREND rien) → purge les entrées orphelines
   (questions/cartes réécrites ou supprimées qui n'existent plus dans le HTML).
   --strict : sort en code 1 dès qu'une entrée DOIT être reprise, et liste laquelle.
   C'est le garde-fou contre les index périmés (utilisé par verif-donnees, I18). */
var FRESH = flag("fresh");
var STRICT = flag("strict");
var ONLY = opt("only", "quiz,flashcards").split(",").map(function (s) {
  return s.trim();
}).filter(Boolean);
function wanted(name) {
  return ONLY.indexOf(name) !== -1;
}

/* --------------------------------------------------- lecture de window.* --- */
/* Les fichiers du site sont des scripts classiques qui posent une globale sur
   window. On fabrique donc un faux window et on les evalue. */
function loadGlobal(file, name) {
  var abs = path.join(ROOT, file);
  if (!fs.existsSync(abs)) return null;
  var code = fs.readFileSync(abs, "utf8");
  if (code.charCodeAt(0) === 0xfeff) code = code.slice(1); // BOM eventuel
  var sandbox = { window: {} };
  /* eslint-disable no-new-func */
  new Function("window", code)(sandbox.window);
  return sandbox.window[name] || null;
}

var DATA = loadGlobal("js/data.js", "SITE_DATA");
if (!DATA || !DATA.content) {
  console.error("ERREUR : js/data.js illisible ou sans SITE_DATA.content — abandon.");
  process.exit(1);
}

/* Liste ordonnee des cours : { id, dir, title, lessons:[fichier], meta }.
   meta[fichier] = { num, title } : le numero et le titre de la lecon, tels que
   data.js les declare (l'index des antiseches les recopie pour eviter que la
   page ait besoin de charger data.js en plus).
   Tri par dossier, c'est la convention des index existants. */
var COURSES = Object.keys(DATA.content).map(function (id) {
  var c = DATA.content[id];
  var lessons = [];
  var meta = {};
  (c.modules || []).forEach(function (m) {
    (m.lessons || []).forEach(function (l) {
      /* file « # » = lecon annoncee au programme mais pas encore ecrite
         (status "bientot", cf. l'en-tete de js/data.js). Ce n'est pas une page
         manquante : la sauter ici evite 10 faux « lecon absente du disque »
         par cours en cours d'ecriture, bruit qui masquerait un vrai trou. */
      if (l && l.file && l.file !== "#") {
        lessons.push(l.file);
        meta[l.file] = { num: l.num || "", title: l.title || "" };
      }
    });
  });
  return { id: id, dir: c.dir || id, title: c.title || id, lessons: lessons, meta: meta };
});
COURSES.sort(function (a, b) {
  return a.dir < b.dir ? -1 : a.dir > b.dir ? 1 : 0;
});

/* --------------------------------------------------------- outils de texte */
/* Table d'entites reprise telle quelle de scratchpad/gen-search-a11y.js, dont
   l'algorithme d'extraction avait ete valide au bit pres sur 129 entrees. */
var NAMED = {
  nbsp: " ", amp: "&", lt: "<", gt: ">", quot: '"', apos: "'",
  rarr: "→", larr: "←", harr: "↔", rArr: "⇒",
  hellip: "…", mdash: "—", ndash: "–", times: "×",
  divide: "÷", copy: "©", reg: "®", deg: "°",
  laquo: "«", raquo: "»", lsquo: "‘", rsquo: "’",
  ldquo: "“", rdquo: "”", euro: "€", pound: "£",
  middot: "·", bull: "•", sup2: "²", sup3: "³",
  frac12: "½", plusmn: "±", le: "≤", ge: "≥",
  ne: "≠", infin: "∞", check: "✓", para: "¶",
  szlig: "ß", agrave: "à", eacute: "é", egrave: "è",
  ecirc: "ê", ccedil: "ç", ocirc: "ô", ucirc: "û",
  icirc: "î", iuml: "ï", acirc: "â", ograve: "ò",
  Eacute: "É", Agrave: "À", Ccedil: "Ç"
};
function decodeEntities(str) {
  return String(str).replace(/&(#x?[0-9a-fA-F]+|[a-zA-Z][a-zA-Z0-9]*);/g, function (m, e) {
    if (e[0] === "#") {
      var cp = e[1] === "x" || e[1] === "X" ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10);
      return isFinite(cp) && cp > 0 ? String.fromCodePoint(cp) : m;
    }
    return Object.prototype.hasOwnProperty.call(NAMED, e) ? NAMED[e] : m;
  });
}
function collapse(s) {
  return String(s).replace(/\s+/g, " ").trim();
}
function stripTags(s) {
  return String(s).replace(/<[^>]*>/g, "");
}
/* Texte lisible d'un fragment HTML, balise SUPPRIMEE SANS ESPACE.
   POURQUOI : sur un terme de glossaire, la balise colle au texte voisin
   (« stderr (<code>&gt;&amp;2</code>) » doit donner « stderr (>&2) », pas
   « stderr ( >&2 ) »). Mesure : sur les 11 016 <dt> du site, les deux variantes
   divergent 526 fois, et c'est toujours celle-ci qui a raison. */
function plain(s) {
  return collapse(decodeEntities(stripTags(s)));
}
/* Texte lisible d'un fragment HTML, balise REMPLACEE PAR UN ESPACE.
   POURQUOI : sur un corps de lecon, deux mots separes uniquement par des balises
   (</code><code>) doivent rester deux mots, sinon la recherche ne les trouve plus.
   C'est la variante de scratchpad/gen-search-a11y.js, validee au bit pres. */
function plainSpaced(s) {
  return collapse(decodeEntities(String(s).replace(/<[^>]*>/g, " ")));
}
/* Clef de dedoublonnage : insensible a la casse et aux accents. */
function fold(s) {
  return String(s).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

/* --------------------------------------------------------- lecture disque */
var readCache = {};
function readPage(dir, file) {
  var key = dir + "/" + file;
  if (readCache[key] === undefined) {
    var abs = path.join(ROOT, "pages", dir, file);
    readCache[key] = fs.existsSync(abs) ? fs.readFileSync(abs, "utf8") : null;
  }
  return readCache[key];
}

/* --------------------------------------------------------- extractions --- */
/* Blocs <script type="application/json" data-quiz> et data-quiz-bilan.
   L'ancien index melangeait les deux : on conserve cette convention. */
function quizBlocks(html, attr) {
  var re = new RegExp('<script[^>]*type="application/json"[^>]*\\s' + attr + "[^>]*>([\\s\\S]*?)</script>", "g");
  var out = [];
  var m;
  while ((m = re.exec(html))) out.push(m[1]);
  return out;
}
function readQuiz(html, where, problems) {
  var list = [];
  [["data-quiz(?![-\\w])", "data-quiz"], ["data-quiz-bilan", "data-quiz-bilan"]].forEach(function (pair) {
    quizBlocks(html, pair[0]).forEach(function (txt) {
      var arr;
      try {
        arr = JSON.parse(txt);
      } catch (e) {
        problems.push("JSON invalide (" + pair[1] + ") dans " + where + " : " + e.message);
        return;
      }
      if (!Array.isArray(arr)) return;
      arr.forEach(function (q) {
        if (!q || typeof q.q !== "string" || !Array.isArray(q.a)) return;
        list.push(q);
      });
    });
  });
  return list;
}

/* Paires <dt>/<dd> des <dl class="glossary"> (cours.html ET lecons).
   t = texte lisible du <dt> ; d = HTML INTERIEUR du <dd> conserve tel quel,
   car glossaire.js et revision.js injectent la definition en HTML (<code>…). */
function readGlossary(html) {
  var out = [];
  var reDl = /<dl[^>]*class="[^"]*\bglossary\b[^"]*"[^>]*>([\s\S]*?)<\/dl>/g;
  var m;
  while ((m = reDl.exec(html))) {
    var re = /<dt[^>]*>([\s\S]*?)<\/dt>\s*<dd[^>]*>([\s\S]*?)<\/dd>/g;
    var n;
    while ((n = re.exec(m[1]))) {
      var t = plain(n[1]);
      var d = collapse(n[2]);
      if (t && d) out.push({ t: t, d: d });
    }
  }
  return out;
}

/* Entree de recherche : t = titre h1, x = tout le texte de <article class="prose">
   sans <script>/<style>, SANS AUCUNE TRONCATURE (le bug des 20 lecons de HTML
   coupees a 2000 caracteres venait d'une limite au moment de la saisie). */
function readSearch(html) {
  var t = "";
  var mt = html.match(/<h1[^>]*class="lesson-header__title"[^>]*>([\s\S]*?)<\/h1>/);
  if (mt) t = plainSpaced(mt[1]);
  var ma = html.match(/<article class="prose">([\s\S]*?)<\/article>/);
  var body = ma ? ma[1] : "";
  body = body.replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<style[\s\S]*?<\/style>/gi, " ");
  return { t: t, x: plainSpaced(body) };
}

/* Les pages TRANSVERSES (outils, hubs, espace perso) n'etaient indexees nulle
   part : la palette clavier et la recherche ne connaissaient que les 1 463
   lecons, si bien que « bac a sable », « antiseches » ou « mes donnees » ne se
   trouvaient pas au clavier (V12-E1). Elles n'ont ni <h1 class="lesson-header__
   title"> ni <article class="prose"> : il leur faut leur propre lecteur.
   Le bloc <noscript> ajoute en B5 est retire, sinon « JavaScript est desactive »
   polluerait chaque extrait. */
function readSearchPage(html) {
  var t = "";
  var mt = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/);
  if (mt) t = plainSpaced(mt[1]);
  /* Le <h1> d'une page transverse est une phrase d'accroche (« Ecris du code,
     vois le resultat ») ; le NOM que l'apprenant tape est dans le kicker
     (« Bac a sable »). On indexe les deux, kicker d'abord, sinon la page reste
     introuvable au clavier — ce qui est exactement le defaut a corriger. */
  var mk = html.match(/<p class="kicker">([\s\S]*?)<\/p>/);
  if (mk) {
    var k = plainSpaced(mk[1]);
    if (k && k !== t) t = t ? k + " — " + t : k;
  }
  var ma = html.match(/<main[^>]*>([\s\S]*?)<\/main>/);
  var body = ma ? ma[1] : "";
  body = body
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<nav[\s\S]*?<\/nav>/gi, " ");
  return { t: t, x: plainSpaced(body) };
}

/* Blocs <figure class="cheat-table"> des lecons : la matiere des antiseches.
   Forme constatee sur les 1358 blocs du site, sans aucune exception :
     <figure class="cheat-table"><table>
       <caption>…</caption>
       <thead><tr><th scope="col">…</th>…</tr></thead>
       <tbody><tr><td>…</td>…</tr>…</tbody>
     </table></figure>
   Les cellules contiennent du balisage en ligne (code, strong, em, kbd, sup,
   sub, s) qu'il FAUT conserver : « t.push(4) » sans son <code> perd son sens.
   On les reinjecte donc en HTML cote page, exactement comme revision.js le fait
   pour les definitions de flashcards — d'ou le nettoyage ci-dessous.

   ASSAINISSEMENT : liste blanche de balises sans le moindre attribut. Toute
   autre balise disparait en laissant son texte ; script/style partent avec leur
   contenu. Le seul attribut utile (colspan, 4 cellules sur 56 746) est rendu
   autrement : une ligne plus courte que l'en-tete voit sa derniere cellule
   etiree par la page. */
var CELL_TAGS = { code: 1, strong: 1, em: 1, kbd: 1, sup: 1, sub: 1, s: 1, br: 1, abbr: 1 };
function safeInline(html) {
  var s = String(html)
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "");
  s = s.replace(/<(\/?)([a-zA-Z][a-zA-Z0-9]*)([^>]*)>/g, function (m, slash, tag) {
    var t = tag.toLowerCase();
    return Object.prototype.hasOwnProperty.call(CELL_TAGS, t) ? "<" + slash + t + ">" : "";
  });
  /* Un « < » restant ne peut plus etre une balise : on le neutralise. */
  s = s.replace(/<(?![a-zA-Z\/])/g, "&lt;");
  return collapse(s);
}
/* Les encadrés « Piège fréquent » sont la convention éditoriale la plus suivie
   du site — 1 743 encadrés sur 949 leçons — et aucune page ne les rassemblait.
   « Erreur fréquente » (28) est la même chose sous un autre nom : on prend les
   deux, et rien d'autre : « Attention », « Note » ou « Astuce » ne décrivent pas
   une erreur reproductible.
   ATTENTION à l'extraction : un callout contient un <div class="callout__body">,
   donc une regex non gourmande s'arrêterait au PREMIER </div>. On équilibre. */
var TITRES_PIEGE = { "piege frequent": 1, "erreur frequente": 1 };

function blocEquilibre(html, depart) {
  /* depart = index du '<' de la balise ouvrante. Renvoie l'index de fin (exclu). */
  var i = depart, prof = 0;
  var re = /<(\/?)div\b[^>]*>/g;
  re.lastIndex = depart;
  var m;
  while ((m = re.exec(html))) {
    if (m[1]) {
      prof--;
      if (prof === 0) return m.index + m[0].length;
    } else {
      prof++;
    }
    i = re.lastIndex;
  }
  return -1;
}

function readPieges(html, where, problems) {
  var out = [];
  var re = /<div[^>]*class="[^"]*\bcallout\b[^"]*"[^>]*>/g;
  var m;
  while ((m = re.exec(html))) {
    var fin = blocEquilibre(html, m.index);
    if (fin === -1) { problems.push("pieges : callout non ferme dans " + where); continue; }
    var bloc = html.slice(m.index, fin);
    var t = /<p class="callout__title">([\s\S]*?)<\/p>/.exec(bloc);
    if (!t) continue; /* callout sans titre : ce n'est pas un piège nommé */
    var titre = safeInline(t[1]).replace(/&nbsp;/g, " ").trim();
    if (!TITRES_PIEGE[fold(titre).replace(/\s+/g, " ").trim()]) continue;

    /* Corps = les paragraphes qui suivent le titre. Le code d'illustration est
       laissé de côté : un index doit rester lisible d'un coup d'œil, et la
       leçon est à un clic. */
    var corps = bloc.slice(t.index + t[0].length);
    var textes = [];
    var reP = /<p[^>]*>([\s\S]*?)<\/p>/g;
    var p;
    while ((p = reP.exec(corps))) {
      var txt = safeInline(p[1]).trim();
      if (txt) textes.push(txt);
    }
    var x = textes.join(" ").trim();
    if (!x) { problems.push("pieges : encadre « " + titre + " » sans texte dans " + where); continue; }
    out.push({ t: titre, x: x });
    /* Reprendre la recherche APRÈS le bloc : un callout ne s'imbrique pas. */
    re.lastIndex = fin;
  }
  return out;
}

function readCheats(html, where, problems) {
  var out = [];
  var reFig = /<figure[^>]*class="[^"]*\bcheat-table\b[^"]*"[^>]*>([\s\S]*?)<\/figure>/g;
  var m;
  while ((m = reFig.exec(html))) {
    var block = m[1];
    var cap = block.match(/<caption[^>]*>([\s\S]*?)<\/caption>/);
    var title = cap ? safeInline(cap[1]) : "";
    if (!title) problems.push("antiseches : bloc cheat-table sans caption dans " + where);

    var head = [];
    var mh = block.match(/<thead[^>]*>([\s\S]*?)<\/thead>/);
    if (mh) {
      var reH = /<th[^>]*>([\s\S]*?)<\/th>/g;
      var h;
      while ((h = reH.exec(mh[1]))) head.push(safeInline(h[1]));
    }

    var rows = [];
    var body = block.match(/<tbody[^>]*>([\s\S]*?)<\/tbody>/);
    var scope = body ? body[1] : block.replace(/<thead[\s\S]*?<\/thead>/, "");
    var reTr = /<tr[^>]*>([\s\S]*?)<\/tr>/g;
    var tr;
    while ((tr = reTr.exec(scope))) {
      var cells = [];
      var reTd = /<(td|th)[^>]*>([\s\S]*?)<\/\1>/g;
      var td;
      while ((td = reTd.exec(tr[1]))) cells.push(safeInline(td[2]));
      if (cells.length) rows.push(cells);
    }
    if (!rows.length) {
      problems.push("antiseches : bloc cheat-table sans ligne de donnees dans " + where);
      continue;
    }
    out.push({ t: title, h: head, r: rows });
  }
  return out;
}

/* ------------------------------------------------------------- ecriture --- */
/* JSON.stringify suffit pour echapper guillemets, antislashs et sauts de ligne.
   Restent U+2028/U+2029, que JSON laisse bruts alors qu'ils sont des fins de
   ligne pour les vieux moteurs : on les echappe pour garantir du JS valide. */
function toJs(globalName, arr, trailingNewline) {
  var json = JSON.stringify(arr).replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
  return "window." + globalName + " = " + json + ";" + (trailingNewline ? "\n" : "");
}
function emit(fileName, globalName, arr, trailingNewline, oldCount) {
  var target = path.join(OUT, fileName);
  var text = toJs(globalName, arr, trailingNewline);
  var before = fs.existsSync(target) ? fs.readFileSync(target, "utf8") : "";
  var same = before === text;
  console.log(
    "  " + fileName + " : " + arr.length + " entrees" +
    (oldCount != null ? " (ancien : " + oldCount + ", ecart " + (arr.length - oldCount >= 0 ? "+" : "") + (arr.length - oldCount) + ")" : "") +
    " | " + (text.length / 1024).toFixed(0) + " Ko | " + (same ? "identique au fichier cible" : "different du fichier cible")
  );
  if (!WRITE) {
    console.log("    (mode comparaison : rien ecrit)");
    return;
  }
  if (same) {
    console.log("    inchange, pas de reecriture");
    return;
  }
  fs.mkdirSync(OUT, { recursive: true });
  fs.writeFileSync(target, text, "utf8");
  console.log("    ecrit -> " + target);
}
/* Variante pour un index qui n'est pas un tableau plat (search-index.js v2 est
   un objet {v, docs, inv}). Meme logique d'ecriture / comparaison. */
function emitObject(fileName, globalName, obj, count) {
  var target = path.join(OUT, fileName);
  var text = toJs(globalName, obj, true);
  var before = fs.existsSync(target) ? fs.readFileSync(target, "utf8") : "";
  var same = before === text;
  console.log(
    "  " + fileName + " : " + count + " lecons | " +
    (text.length / 1048576).toFixed(2) + " Mo | " +
    (same ? "identique au fichier cible" : "different du fichier cible")
  );
  if (!WRITE) { console.log("    (mode comparaison : rien ecrit)"); return; }
  if (same) { console.log("    inchange, pas de reecriture"); return; }
  fs.mkdirSync(OUT, { recursive: true });
  fs.writeFileSync(target, text, "utf8");
  console.log("    ecrit -> " + target);
}

/* ============================================================ QUIZ_BANK === */
/* Enregistrement : {q, a, k, e, c, f}
   q = enonce, a = reponses, k = index de la bonne (champ « correct » en page),
   e = explication (champ « explain »), c = DOSSIER du cours,
   f = fichier de la lecon (nouveau : permet un lien « revoir cette lecon »). */
function buildQuiz(problems) {
  var old = FRESH ? [] : (loadGlobal("js/quiz-index.js", "QUIZ_BANK") || []);
  var oldByCourse = {};
  old.forEach(function (q) {
    (oldByCourse[q.c] = oldByCourse[q.c] || []).push(q);
  });

  var out = [];
  var carried = [];
  var dupes = [];
  COURSES.forEach(function (co) {
    var seen = {};
    var group = [];
    co.lessons.forEach(function (file) {
      var html = readPage(co.dir, file);
      if (html === null) {
        problems.push("lecon absente du disque : pages/" + co.dir + "/" + file);
        return;
      }
      readQuiz(html, co.dir + "/" + file, problems).forEach(function (q) {
        var key = fold(q.q);
        if (seen[key]) {
          dupes.push(co.dir + " | " + seen[key] + " + " + file + " | " + q.q);
          return; // meme enonce deja pris dans ce cours : un examen ne doit pas le poser deux fois
        }
        seen[key] = file;
        group.push({
          q: q.q,
          a: q.a.map(function (x) { return String(x); }),
          k: typeof q.correct === "number" ? q.correct : 0,
          e: typeof q.explain === "string" ? q.explain : "",
          c: co.dir,
          f: file
        });
      });
    });
    /* Reprise des questions de l'ancien index qui n'existent plus sur le disque. */
    (oldByCourse[co.dir] || []).forEach(function (q) {
      var key = fold(q.q);
      if (seen[key]) return;
      seen[key] = "(ancien index)";
      carried.push(co.dir + " | " + q.q);
      group.push({ q: q.q, a: q.a, k: q.k, e: q.e || "", c: co.dir, f: q.f || "" });
    });
    out = out.concat(group);
  });

  /* Les cours de l'ancien index qui ne sont plus dans data.js seraient perdus. */
  var known = {};
  COURSES.forEach(function (c) { known[c.dir] = 1; });
  Object.keys(oldByCourse).forEach(function (dir) {
    if (!known[dir]) problems.push("quiz : cours « " + dir + " » present dans l ancien index mais absent de data.js");
  });

  console.log("QUIZ_BANK : " + out.length + " questions, " + COURSES.length + " cours");
  console.log("  doublons d enonce ecartes : " + dupes.length + " | questions reprises de l ancien index : " + carried.length);
  return { arr: out, old: old, dupes: dupes, carried: carried };
}

/* =========================================================== FLASHCARDS === */
/* Enregistrement : {c, ct, t, d}
   c = DOSSIER du cours, ct = titre du cours (data.js, donc jamais perime),
   t = terme en texte brut, d = definition en HTML.
   Ordre de balayage : cours.html d abord (c est la source des cartes
   historiques, on les preserve donc au mot pres), puis les lecons dans l ordre.
   Dedoublonnage par (cours, terme replie sans casse ni accents). */
function buildFlashcards(problems) {
  var old = FRESH ? [] : (loadGlobal("js/flashcards-data.js", "FLASHCARDS") || []);
  var oldByCourse = {};
  old.forEach(function (c) {
    (oldByCourse[c.c] = oldByCourse[c.c] || []).push(c);
  });

  var out = [];
  var carried = [];
  var dropped = 0;
  COURSES.forEach(function (co) {
    var seen = {};
    var group = [];
    var sources = ["cours.html"].concat(co.lessons);
    sources.forEach(function (file) {
      var html = readPage(co.dir, file);
      if (html === null) {
        if (file !== "cours.html") problems.push("page absente : pages/" + co.dir + "/" + file);
        return;
      }
      /* V12-D3 : le generateur CONNAIT le fichier d'origine et le jetait. Une
         carte de revision et une entree de glossaire ne renvoyaient donc que
         vers le cours entier, alors que la definition vient d'une lecon
         precise. On garde f (et le numero + titre de la lecon quand ils
         existent : « cours.html » n'en a pas). */
      var meta = co.meta[file] || { num: "", title: "" };
      readGlossary(html).forEach(function (e) {
        var key = fold(e.t);
        if (seen[key]) { dropped++; return; }
        seen[key] = 1;
        var carte = { c: co.dir, ct: co.title, t: e.t, d: e.d, f: file };
        if (meta.num) carte.n = meta.num;
        if (meta.title) carte.lt = meta.title;
        group.push(carte);
      });
    });
    /* Reprise des cartes de l ancien index absentes du contenu actuel. */
    (oldByCourse[co.dir] || []).forEach(function (card) {
      var key = fold(card.t);
      if (seen[key]) return;
      seen[key] = 1;
      carried.push(co.dir + " | " + card.t);
      /* Une carte reprise d'un ancien index peut ne pas avoir de source : on
         n'en invente pas. */
      var repris = { c: co.dir, ct: co.title, t: card.t, d: card.d };
      if (card.f) repris.f = card.f;
      if (card.n) repris.n = card.n;
      if (card.lt) repris.lt = card.lt;
      group.push(repris);
    });
    out = out.concat(group);
  });

  var known = {};
  COURSES.forEach(function (c) { known[c.dir] = 1; });
  Object.keys(oldByCourse).forEach(function (dir) {
    if (!known[dir]) problems.push("flashcards : cours « " + dir + " » present dans l ancien index mais absent de data.js");
  });

  console.log("FLASHCARDS : " + out.length + " cartes, " + COURSES.length + " cours");
  console.log("  termes en double ecartes : " + dropped + " | cartes reprises de l ancien index : " + carried.length);
  return { arr: out, old: old, carried: carried, dropped: dropped };
}

/* ================================================================ PIEGES === */
/* Enregistrement : {c, ct, f, n, lt, t, x}
   c = DOSSIER du cours, ct = titre du cours, f = fichier, n = numero de lecon,
   lt = titre de la lecon, t = intitule de l'encadre, x = son texte. */
function buildPieges(problems) {
  var old = FRESH ? [] : (loadGlobal("js/pieges-data.js", "PIEGES") || []);
  var oldByCourse = {};
  old.forEach(function (p) { (oldByCourse[p.c] = oldByCourse[p.c] || []).push(p); });

  var out = [];
  var carried = [];
  var dropped = 0;
  var empty = [];
  COURSES.forEach(function (co) {
    var seen = {};
    var group = [];
    function keyOf(p) { return fold(p.x); }
    co.lessons.forEach(function (file) {
      var html = readPage(co.dir, file);
      if (html === null) {
        problems.push("pieges : lecon absente du disque : pages/" + co.dir + "/" + file);
        return;
      }
      var meta = co.meta[file] || { num: "", title: "" };
      readPieges(html, co.dir + "/" + file, problems).forEach(function (p) {
        var key = keyOf(p);
        if (seen[key]) { dropped++; return; } /* meme piege repete dans le cours */
        seen[key] = 1;
        group.push({
          c: co.dir, ct: co.title, f: file, n: meta.num, lt: meta.title,
          t: p.t, x: p.x
        });
      });
    });
    (oldByCourse[co.dir] || []).forEach(function (p) {
      var key = keyOf(p);
      if (seen[key]) return;
      seen[key] = 1;
      carried.push(co.dir + " | " + String(p.x).slice(0, 60));
      group.push(p);
    });
    if (!group.length) empty.push(co.dir);
    out = out.concat(group);
  });

  var known = {};
  COURSES.forEach(function (c) { known[c.dir] = 1; });
  Object.keys(oldByCourse).forEach(function (dir) {
    if (!known[dir]) problems.push("pieges : cours « " + dir + " » present dans l ancien index mais absent de data.js");
  });
  /* Un cours sans le moindre encadre d'erreur est un TROU dans l'index : on le
     dit, sans bloquer (c'est un manque de contenu, pas une incoherence). */
  if (empty.length) problems.push("pieges : cours sans aucun encadre d erreur (" + empty.length + ") : " + empty.join(", "));

  var couverts = {};
  out.forEach(function (p) { couverts[p.c] = 1; });
  console.log("PIEGES : " + out.length + " encadres, " + Object.keys(couverts).length + "/" + COURSES.length + " cours couverts");
  console.log("  doublons ecartes : " + dropped + " | repris de l ancien index : " + carried.length);
  return { arr: out, old: old, carried: carried };
}

/* ============================================================ ANTISECHES === */
/* Enregistrement : {c, ct, f, n, lt, t, h, r}
   c  = DOSSIER du cours (js, pas javascript), ct = titre du cours (data.js),
   f  = fichier de la lecon, n = son numero, lt = son titre (data.js),
   t  = legende du tableau (HTML en ligne assaini), h = en-tetes (idem),
   r  = lignes, chacune un tableau de cellules (idem).
   L'ordre suit data.js : cours par dossier, puis lecons dans l'ordre du cours,
   puis blocs dans l'ordre de la page. Un cours = un groupe contigu, ce qui
   permet a la page de decouper l'index sans le trier.
   Dedoublonnage : deux blocs de MEME legende et MEME contenu dans un meme cours
   ne sont gardes qu'une fois (une legende identique sur un tableau different
   reste, elle : ce sont deux memos distincts). */
function buildCheats(problems) {
  var old = FRESH ? [] : (loadGlobal("js/antiseches-data.js", "ANTISECHES") || []);
  var oldByCourse = {};
  old.forEach(function (s) {
    (oldByCourse[s.c] = oldByCourse[s.c] || []).push(s);
  });

  var out = [];
  var carried = [];
  var dropped = 0;
  var empty = [];
  COURSES.forEach(function (co) {
    var seen = {};
    var group = [];
    function keyOf(s) {
      return fold(s.t) + "##" + fold(JSON.stringify(s.r));
    }
    co.lessons.forEach(function (file) {
      var html = readPage(co.dir, file);
      if (html === null) {
        problems.push("antiseches : lecon absente du disque : pages/" + co.dir + "/" + file);
        return;
      }
      var meta = co.meta[file] || { num: "", title: "" };
      readCheats(html, co.dir + "/" + file, problems).forEach(function (s) {
        var key = keyOf(s);
        if (seen[key]) { dropped++; return; }
        seen[key] = 1;
        group.push({
          c: co.dir, ct: co.title, f: file, n: meta.num, lt: meta.title,
          t: s.t, h: s.h, r: s.r
        });
      });
    });
    /* Reprise des fiches de l'ancien index absentes du contenu actuel. */
    (oldByCourse[co.dir] || []).forEach(function (s) {
      var key = keyOf(s);
      if (seen[key]) return;
      seen[key] = 1;
      carried.push(co.dir + " | " + s.t);
      group.push(s);
    });
    if (!group.length) empty.push(co.dir);
    out = out.concat(group);
  });

  var known = {};
  COURSES.forEach(function (c) { known[c.dir] = 1; });
  Object.keys(oldByCourse).forEach(function (dir) {
    if (!known[dir]) problems.push("antiseches : cours « " + dir + " » present dans l ancien index mais absent de data.js");
  });
  if (empty.length) problems.push("antiseches : cours sans aucune fiche : " + empty.join(", "));

  var couverts = {};
  out.forEach(function (s) { couverts[s.c] = 1; });
  console.log("ANTISECHES : " + out.length + " fiches, " + Object.keys(couverts).length + "/" + COURSES.length + " cours couverts");
  console.log("  fiches en double ecartees : " + dropped + " | fiches reprises de l ancien index : " + carried.length);
  return { arr: out, old: old, carried: carried, dropped: dropped };
}

/* ========================================================= SEARCH_INDEX === */
/* Format compact v2 (point A2 du chantier V5). L'ancien index embarquait le
   texte integral des 1350 lecons : 16 Mo, ~71 ms d'analyse et 104 Mo de RAM au
   chargement (mesure Chrome). On emet desormais un index INVERSE :
     window.SEARCH_INDEX = {
       v: 2,
       docs: [ [d, f, t, s], ... ],           // dossier, fichier, titre, extrait (<=160c)
       inv:  { "mot": "D0[.tf],D1[.tf],..." }  // mot normalise -> postings
     }
   Un posting = delta de l'id de lecon en base36, suivi de « .tf » (base36) SI la
   frequence du terme dans la lecon depasse 1 (tf=1 implicite). tf est plafonne a
   25, car recherche.js plafonne deja le score de frequence a 25 : plafonner ici
   est sans effet sur le classement. L'ordre des docs suit data.js.
   La recherche « sous-chaine du texte » de l'ancien moteur est reproduite cote
   page en cherchant la sous-chaine sur les CLEFS de « inv » : un terme purement
   alphanumerique est sous-chaine du texte SSI il est sous-chaine d'un mot du
   texte. VERIFIE : meme ENSEMBLE de resultats et meme top-60 que l'ancien
   plein-texte sur 15 requetes temoins (scratchpad/proto-search.js). 16 -> 2,8 Mo. */
function searchNorm(s) {
  return String(s || "").toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "");
}
/* Longueur de l'extrait embarque dans search-lite. Elle decide de DEUX choses a
   la fois : ce qu'on AFFICHE sous chaque resultat de la palette, et ce dans quoi
   la palette CHERCHE (elle n'a pas l'index inverse complet, trop lourd a charger).
   A 160 caracteres, la recherche etait quasi limitee aux titres : << garbage
   collector >> ne renvoyait rien alors que la recherche plein-texte trouve
   12 lecons. A 420, le rappel remonte nettement pour un cout maitrise, l'index
   restant charge EN DIFFERE a la premiere ouverture (donc zero cout au
   chargement des pages). L'affichage, lui, tronque a 160 en CSS. */
var SNIPPET_MAX = 420;
function searchSnippet(x) {
  x = String(x || "");
  if (x.length <= SNIPPET_MAX) return x;
  var cut = x.slice(0, SNIPPET_MAX);
  var sp = cut.lastIndexOf(" ");
  if (sp > SNIPPET_MAX * 0.75) cut = cut.slice(0, sp);
  return cut + "…";
}
function buildInverted(texts) {
  /* Dictionnaires indexes par MOT : Object.create(null) obligatoire, sinon un
     terme comme « constructor », « tostring » ou « valueof » (frequents dans les
     cours de code) heurte une methode heritee de Object.prototype. */
  var invTf = Object.create(null);
  texts.forEach(function (x, i) {
    var tf = Object.create(null);
    /* On garde « + » et « # » dans les mots pour indexer c++, c#, f#, #include…
       Les décimaux et versions (« 3.14 », « 1,5 ») sont RECOLLÉS avant le
       découpage : sinon « 3.14 » donnerait « 3 » (jeté car < 2 car) + « 14 », et
       la recherche de « 3.14 » se réduirait à « 14 » (334 leçons pour ~100 vraies).
       On ne retire le séparateur qu'ENTRE DEUX CHIFFRES — « array.map », « os.path »
       restent découpés. La requête applique la même règle (js/recherche.js). */
    searchNorm(x).replace(/(?<=\d)[.,](?=\d)/g, "").split(/[^a-z0-9+#]+/).forEach(function (w) {
      if (w.length >= 2) tf[w] = (tf[w] || 0) + 1;
    });
    for (var w in tf) { (invTf[w] = invTf[w] || []).push([i, tf[w]]); }
  });
  var inv = Object.create(null);
  Object.keys(invTf).sort().forEach(function (w) {
    var prev = 0, enc = [];
    invTf[w].forEach(function (p) {
      var d = (p[0] - prev).toString(36);
      var tf = Math.min(25, p[1]);
      enc.push(tf > 1 ? d + "." + tf.toString(36) : d);
      prev = p[0];
    });
    inv[w] = enc.join(",");
  });
  return inv;
}
function buildSearch(problems) {
  var docs = [];
  var texts = [];
  var courses = {};
  COURSES.forEach(function (co) {
    courses[co.dir] = co.title;
    co.lessons.forEach(function (f) {
      var html = readPage(co.dir, f);
      if (html === null) { problems.push("search : page absente pages/" + co.dir + "/" + f); return; }
      var g = readSearch(html);
      if (!g.t) problems.push("search : titre h1 introuvable dans pages/" + co.dir + "/" + f);
      docs.push([co.dir, f, g.t, searchSnippet(g.x)]);
      texts.push(g.x);
    });
  });
  /* Pages transverses : dossier vide dans le doc, ce qui vaut « pages/<f> »
     cote affichage (une lecon vaut « pages/<cours>/<f> »). Les redirections
     sont ecartees : elles n'ont pas de contenu. */
  var transverses = 0;
  var DOSSIER_PAGES = path.join(ROOT, "pages");
  fs.readdirSync(DOSSIER_PAGES).filter(function (f) { return /\.html$/.test(f); }).sort()
    .forEach(function (f) {
      var abs = path.join(DOSSIER_PAGES, f);
      var html;
      try { html = fs.readFileSync(abs, "utf8"); } catch (e) { return; }
      /* Une redirection n'a pas de contenu a indexer. */
      if (/<meta[^>]+http-equiv=["']?refresh/i.test(html)) return;
      var g = readSearchPage(html);
      if (!g.t) { problems.push("search : titre h1 introuvable dans pages/" + f); return; }
      docs.push(["", f, g.t, searchSnippet(g.x)]);
      texts.push(g.x);
      transverses++;
    });
  courses[""] = "Page du site";

  var inv = buildInverted(texts);
  console.log("SEARCH_INDEX : " + (docs.length - transverses) + " lecons + " + transverses +
    " pages transverses, " + Object.keys(inv).length + " mots indexes");
  /* full = index inversé complet (recherche plein-texte de recherche.html).
     lite = docs + titres de cours seulement (palette clavier A1, chargée sur
     toutes les pages : ~300 Ko, pas de « inv »). */
  return {
    full: { v: 2, docs: docs, inv: inv },
    lite: { v: 1, courses: courses, docs: docs },
    count: docs.length
  };
}

/* ================================================================ main === */
console.log("build-index.js — racine " + ROOT + " | sortie " + OUT + " | " + (WRITE ? "MODE ECRITURE" : "MODE COMPARAISON") + " | cibles : " + ONLY.join(", "));
console.log(COURSES.length + " cours, " + COURSES.reduce(function (n, c) { return n + c.lessons.length; }, 0) + " lecons declarees dans data.js");

var problems = [];
var carriedAll = []; // entrées reprises de l'ancien index (périmées) — pour --strict
if (wanted("quiz")) {
  var q = buildQuiz(problems);
  q.carried.forEach(function (x) { carriedAll.push("quiz       | " + x); });
  emit("quiz-index.js", "QUIZ_BANK", q.arr, false, q.old.length);
}
if (wanted("flashcards")) {
  var f = buildFlashcards(problems);
  f.carried.forEach(function (x) { carriedAll.push("flashcards | " + x); });
  emit("flashcards-data.js", "FLASHCARDS", f.arr, false, f.old.length);
}
if (wanted("antiseches")) {
  var a = buildCheats(problems);
  a.carried.forEach(function (x) { carriedAll.push("antiseches | " + x); });
  emit("antiseches-data.js", "ANTISECHES", a.arr, false, a.old.length);
}
if (wanted("pieges")) {
  var pg = buildPieges(problems);
  pg.carried.forEach(function (x) { carriedAll.push("pieges     | " + x); });
  emit("pieges-data.js", "PIEGES", pg.arr, false, pg.old.length);
}
if (wanted("search") || wanted("searchlite")) {
  var s = buildSearch(problems);
  if (wanted("search")) emitObject("search-index.js", "SEARCH_INDEX", s.full, s.count);
  if (wanted("searchlite")) emitObject("search-lite.js", "SEARCH_LITE", s.lite, s.count);
}

if (problems.length) {
  console.log("\nAVERTISSEMENTS (" + problems.length + ") :");
  problems.forEach(function (p) { console.log("  - " + p); });
} else {
  console.log("\nAucun avertissement.");
}

/* --strict : un index à jour ne reprend RIEN. Toute reprise = entrée périmée
   (question/carte réécrite ou supprimée qui survit dans l'index). On la signale
   et on sort en erreur, pour fermer la famille de bugs « index périmé ». */
if (STRICT && carriedAll.length) {
  console.log("\n[--strict] " + carriedAll.length + " entrée(s) REPRISE(S) de l'ancien index (périmées : absentes du contenu actuel) :");
  carriedAll.slice(0, 60).forEach(function (x) { console.log("  ✗ " + x); });
  if (carriedAll.length > 60) console.log("  … et " + (carriedAll.length - 60) + " autre(s).");
  console.log("Purge : relance avec --write --fresh (ignore l'ancien index). Index périmé → échec strict.");
  process.exit(1);
}
if (STRICT) console.log("\n[--strict] OK : aucune entrée périmée, l'index est aligné sur le contenu.");
