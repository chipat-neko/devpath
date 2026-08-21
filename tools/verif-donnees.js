#!/usr/bin/env node
'use strict';

/**
 * tools/verif-donnees.js — Vérificateur des DONNÉES du site Syntaxe.
 *
 * POURQUOI CE SCRIPT
 * ------------------
 * `tools/verif-html.js` regarde le HTML rendu d'une leçon (balises créées par
 * erreur dans un bloc de code). Il est aveugle à l'autre famille de défauts : la
 * cohérence des DONNÉES qui pilotent le site. Ces données sont dispersées dans
 * plusieurs globales (js/data.js, js/projets-data.js, js/cours.js, les
 * js/fil-rouge-*-data.js) et rien ne garantissait, jusqu'ici, qu'elles restent
 * d'accord entre elles ni avec les fichiers réellement présents sur le disque.
 * L'audit du 27/07/2026 (manque M1) recensait 16 invariants à contrôler ; ce
 * script les vérifie tous, sans aucune dépendance (Node seul).
 *
 * LES 12 INVARIANTS DE DONNÉES (audit M1) + 5 CONTRÔLES DE CONTENU
 * ---------------------------------------------------------------
 *   I1  courses ⇄ content   : bijection des id, dir et champs obligatoires.
 *   I2  content ⇄ durations : chaque leçon a une durée > 0, et réciproquement.
 *   I3  compte de leçons    : course.lessons == nombre réel de leçons.
 *   I4  numérotation        : file « lecon-NN.html », NN == num, séquence pleine.
 *   I5  unicité             : id de cours, dir, file (par cours) sans doublon.
 *   I6  fichier ⇄ disque    : chaque file existe sous pages/<dir>/, cours.html idem.
 *   I7  piège javascript/js : content[id].dir utilisé partout (id ≠ dir toléré).
 *   I8  related             : chaque related.course désigne un cours existant.
 *   I9  tracks              : chaque track.courses[] désigne un cours existant.
 *   I10 fils rouges         : FILS_ROUGES (cours.js) → cours + page existants,
 *                             aucune entrée morte ; fil-rouge-*-data.js cohérents ;
 *                             et CONCORDANCE des numéros d'étape entre la table et
 *                             le fil réel (V13-A4 : `kotlin` et `clojure` avaient
 *                             disparu de la table, rendant leur fil invisible).
 *   I11 projets             : chaque PROJETS.course existe, chaque cours couvert.
 *   I12 quiz bilan          : chaque cours a son QCM bilan (les 4 fusionnés : 2).
 *   I13 data-exos alignés   : aucun capstone ne reçoit de champ (piège A8), aucune
 *                             entrée en excès perdue.
 *   I14 grammaires Prism    : chaque language-XXX d'une leçon a sa grammaire
 *                             chargée dans la page ET présente dans le vendor.
 *   I15 JSON des blocs       : data-quiz / data-exos / data-quiz-bilan parsables.
 *   I16 orphelins            : leçon lecon-*.html sur disque non déclarée et non
 *                             redirection (simple avertissement).
 *   I17 doublons de QCM     : deux data-quiz d'un même cours avec la même bonne
 *                             réponse (ponctuation technique conservée ; bilans
 *                             exclus). ERREUR si réponse quasi identique, sinon
 *                             AVERTISSEMENT à examiner.
 *   I18 index non périmés   : build-index.js --strict (sous-processus) — ERREUR si
 *                             une entrée de l'ancien index doit être reprise (quiz/
 *                             flashcards/antisèches/pièges périmées). Purge : --write --fresh.
 *   I19 compteurs affichés  : « N cours/leçons/langages/parcours » de l'accueil, du
 *                             catalogue et d'« À propos » == décompte réel de data.js
 *                             (commentaires retirés d'abord). Trois pannes historiques.
 *   I20 titre ⇄ <h1>        : le title de data.js (catalogue, recherche, nav) ==
 *                             le <h1 class="lesson-header__title"> écrit en dur.
 *   I21 étiquette ⇄ contenu : AVERTISSEMENT — un bloc language-X sans marqueur de X
 *                             mais avec ≥2 marqueurs d'un autre (js/python/sql,
 *                             commentaires+chaînes retirés). Garde-fou, 0 aujourd'hui.
 *   I22 SQL mot réservé nu  : AVERTISSEMENT — colonne de CREATE TABLE ou alias « AS x »
 *                             qui est un mot réservé sans délimiteur (cas « end »).
 *   I23 hubs atteignables   : chaque page de LESSON_FOOTER_COLS (main.js, pied de
 *                             page injecté sur les 1463 leçons) existe sur le disque,
 *                             et les hubs de l'espace personnel — dont « Mes données »,
 *                             seule page de sauvegarde ET de réparation — sont liés
 *                             depuis la page Progression. Elle n'était atteignable
 *                             que par le pied de page de l'accueil (V12-B4).
 *   I24 repli sans JS       : chaque page transverse (pages/*.html) et l'accueil
 *                             portent un <noscript> expliquant que le contenu est
 *                             construit dans le navigateur. Sans lui, 18 fils rouges
 *                             tombaient sous 25 mots visibles, sans un mot (V12-B5).
 *   I25 index des pièges    : chaque entrée de js/pieges-data.js pointe une leçon qui
 *                             existe ET qui est déclarée dans data.js ; la page
 *                             pages/pieges.html charge bien l'index et son script.
 *                             AVERTISSEMENT : les cours sans aucun encadré d'erreur
 *                             (trou d'index, cf. V12-D1/D2).
 *   I26 source des cartes   : chaque carte de js/flashcards-data.js (révision ET
 *                             glossaire) porte la leçon d'où vient sa définition,
 *                             et ce fichier existe. Le générateur la connaissait
 *                             et la jetait : les deux pages ne renvoyaient que
 *                             vers le cours entier (V12-D3).
 *
 * USAGE
 * -----
 *   node tools/verif-donnees.js              rapport lisible, code de sortie 1 si erreur
 *   node tools/verif-donnees.js --json       sortie machine
 *   node tools/verif-donnees.js --root <dir> autre racine (ex. une sauvegarde)
 *   node tools/verif-donnees.js -h           cette aide
 *
 * Code de sortie : 1 si au moins une ERREUR (invariant violé), sinon 0.
 * Les AVERTISSEMENTS (contenu douteux mais non bloquant) ne changent pas le code.
 */

const fs = require('fs');
const path = require('path');

/* ------------------------------------------------------------------ options */
const argv = process.argv.slice(2);
const OPT = { json: false, root: path.resolve(__dirname, '..') };
for (let i = 0; i < argv.length; i++) {
  const a = argv[i];
  if (a === '--json') OPT.json = true;
  else if (a === '--root') OPT.root = path.resolve(argv[++i]);
  else if (a === '-h' || a === '--help' || a === '--aide') {
    console.log(fs.readFileSync(__filename, 'utf8').split('*/')[0].replace(/^[\s\S]*?\/\*\*/, ''));
    process.exit(0);
  }
}
const ROOT = OPT.root;
const JS = path.join(ROOT, 'js');
const PAGES = path.join(ROOT, 'pages');

/* --------------------------------------------------- lecture de window.* --- */
/* Les fichiers du site sont des scripts classiques qui posent une globale sur
   window. On fabrique un faux window et on les évalue — même procédé que
   tools/build-index.js. */
function loadGlobal(absFile, name) {
  if (!fs.existsSync(absFile)) return null;
  let code = fs.readFileSync(absFile, 'utf8');
  if (code.charCodeAt(0) === 0xfeff) code = code.slice(1); // BOM éventuel
  const win = {};
  // eslint-disable-next-line no-new-func
  new Function('window', code)(win);
  return win[name] || null;
}

/* Extraction d'un littéral tableau « var NOM = [ … ]; » depuis un fichier, en
   équilibrant les crochets et en ignorant chaînes et commentaires. Sert pour
   FILS_ROUGES, qui est une variable INTERNE de l'IIFE de cours.js (non exposée). */
function extractArrayLiteral(code, varName) {
  const re = new RegExp('var\\s+' + varName + '\\s*=\\s*\\[');
  const m = re.exec(code);
  if (!m) return null;
  const start = m.index + m[0].length - 1; // position du '['
  let depth = 0, str = null, i = start;
  for (; i < code.length; i++) {
    const ch = code[i];
    if (str) {
      if (ch === '\\') { i++; continue; }
      if (ch === str) str = null;
      continue;
    }
    if (ch === '"' || ch === "'" || ch === '`') { str = ch; continue; }
    if (ch === '/' && code[i + 1] === '/') { const nl = code.indexOf('\n', i); i = nl < 0 ? code.length : nl; continue; }
    if (ch === '/' && code[i + 1] === '*') { const e = code.indexOf('*/', i + 2); i = e < 0 ? code.length : e + 1; continue; }
    if (ch === '[') depth++;
    else if (ch === ']') { depth--; if (depth === 0) { i++; break; } }
  }
  const literal = code.slice(start, i);
  // eslint-disable-next-line no-new-func
  return new Function('return (' + literal + ');')();
}

/* --------------------------------------------------------- lecture disque */
const readCache = {};
function readPage(dir, file) {
  const key = dir + '/' + file;
  if (readCache[key] === undefined) {
    const abs = path.join(PAGES, dir, file);
    readCache[key] = fs.existsSync(abs) ? fs.readFileSync(abs, 'utf8') : null;
  }
  return readCache[key];
}
function isRedirect(html) {
  return /<meta[^>]+http-equiv=["']?refresh/i.test(html);
}

/* ------------------------------------------------------------- rapport --- */
const REPORT = [];
function check(code, titre) {
  const entry = { code, titre, errors: [], warns: [] };
  REPORT.push(entry);
  return {
    err: (m) => entry.errors.push(m),
    warn: (m) => entry.warns.push(m),
  };
}

/* ================================================== chargement des sources */
const DATA = loadGlobal(path.join(JS, 'data.js'), 'SITE_DATA');
if (!DATA || !DATA.content || !DATA.courses) {
  console.error('ERREUR fatale : js/data.js illisible ou sans SITE_DATA.{courses,content} — abandon.');
  process.exit(2);
}
const COURSES = DATA.courses;           // fiches du catalogue
const CONTENT = DATA.content;           // structure détaillée
const DURATIONS = DATA.durations || {}; // minutes par leçon
const TRACKS = DATA.tracks || [];
const COURSE_IDS = new Set(COURSES.map((c) => c.id));
const CONTENT_IDS = new Set(Object.keys(CONTENT));

/* Liste ordonnée { id, dir, lessons:[file], numByFile } depuis content. */
const LESSONS = {};
Object.keys(CONTENT).forEach((id) => {
  const c = CONTENT[id];
  const files = [];
  const numByFile = {};
  (c.modules || []).forEach((m) => {
    (m.lessons || []).forEach((l) => {
      if (l && l.file && l.file !== '#') { files.push(l.file); numByFile[l.file] = l.num; }
    });
  });
  LESSONS[id] = { dir: c.dir || id, files, numByFile };
});
const totalLessons = Object.keys(LESSONS).reduce((n, id) => n + LESSONS[id].files.length, 0);

/* =================================================== I1 courses ⇄ content */
(function () {
  const c = check('I1', 'courses ⇄ content');
  COURSES.forEach((co) => {
    if (!CONTENT_IDS.has(co.id)) c.err('cours « ' + co.id +' » présent dans courses[] mais absent de content{}');
  });
  Object.keys(CONTENT).forEach((id) => {
    if (!COURSE_IDS.has(id)) c.err('cours « ' + id + ' » présent dans content{} mais absent de courses[]');
  });
  COURSES.forEach((co) => {
    ['id', 'dir', 'title'].forEach((k) => { if (!co[k]) c.err('courses[' + co.id + '] : champ « ' + k + ' » manquant'); });
    const ct = CONTENT[co.id];
    if (ct) {
      if (ct.id && ct.id !== co.id) c.err('content[' + co.id + '].id (« ' + ct.id + ' ») ≠ id du cours');
      if ((ct.dir || co.id) !== co.dir) c.err('content[' + co.id + '].dir (« ' + ct.dir + ' ») ≠ courses.dir (« ' + co.dir + ' »)');
    }
  });
})();

/* =================================================== I2 content ⇄ durations */
(function () {
  const c = check('I2', 'content ⇄ durations');
  Object.keys(LESSONS).forEach((id) => {
    const d = DURATIONS[id];
    if (!d) { c.err('durations : aucune entrée pour le cours « ' + id + ' »'); return; }
    LESSONS[id].files.forEach((f) => {
      if (!(f in d)) c.err(id + '/' + f + ' : leçon sans durée dans durations[' + id + ']');
      else if (!(typeof d[f] === 'number' && d[f] > 0)) c.err(id + '/' + f + ' : durée invalide (' + d[f] + ')');
    });
    Object.keys(d).forEach((f) => {
      if (LESSONS[id].numByFile[f] === undefined) c.err('durations[' + id + '] cite « ' + f + ' » qui n\'est pas une leçon déclarée');
    });
  });
})();

/* =================================================== I3 compte de leçons */
(function () {
  const c = check('I3', 'compte de leçons (course.lessons)');
  COURSES.forEach((co) => {
    const real = LESSONS[co.id] ? LESSONS[co.id].files.length : 0;
    if (typeof co.lessons === 'number' && co.lessons !== real) {
      c.err(co.id + ' : courses.lessons = ' + co.lessons + ' mais ' + real + ' leçon(s) réelle(s) dans content');
    }
  });
})();

/* =================================================== I4 numérotation */
(function () {
  const c = check('I4', 'numérotation des leçons');
  Object.keys(LESSONS).forEach((id) => {
    const files = LESSONS[id].files;
    const nums = [];
    files.forEach((f) => {
      const m = /^lecon-(\d{2,})\.html$/.exec(f);
      if (!m) { c.err(id + ' : fichier « ' + f + ' » hors convention lecon-NN.html'); return; }
      const n = parseInt(m[1], 10);
      nums.push(n);
      const declared = LESSONS[id].numByFile[f];
      if (declared !== undefined && String(declared) !== m[1]) {
        c.err(id + '/' + f + ' : num déclaré « ' + declared + ' » ≠ numéro du fichier « ' + m[1] + ' »');
      }
    });
    // séquence pleine 1..N, sans trou ni doublon
    const sorted = nums.slice().sort((a, b) => a - b);
    for (let i = 0; i < sorted.length; i++) {
      if (sorted[i] !== i + 1) { c.err(id + ' : numérotation non contiguë (attendu ' + (i + 1) + ', trouvé ' + sorted[i] + ')'); break; }
    }
  });
})();

/* =================================================== I5 unicité */
(function () {
  const c = check('I5', 'unicité (id, dir, file)');
  const seenId = {}, seenDir = {};
  COURSES.forEach((co) => {
    if (seenId[co.id]) c.err('id de cours en double : « ' + co.id + ' »'); seenId[co.id] = 1;
    if (seenDir[co.dir]) c.err('dir en double : « ' + co.dir + ' » (' + seenDir[co.dir] + ' + ' + co.id + ')'); seenDir[co.dir] = co.id;
  });
  Object.keys(LESSONS).forEach((id) => {
    const seen = {};
    LESSONS[id].files.forEach((f) => { if (seen[f]) c.err(id + ' : file en double « ' + f + ' »'); seen[f] = 1; });
  });
})();

/* =================================================== I6 fichier ⇄ disque + I7 piège dir */
(function () {
  const c = check('I6', 'fichier cité ⇄ fichier disque (via dir)');
  Object.keys(LESSONS).forEach((id) => {
    const dir = LESSONS[id].dir;
    if (!fs.existsSync(path.join(PAGES, dir))) { c.err(id + ' : dossier pages/' + dir + '/ absent'); return; }
    if (readPage(dir, 'cours.html') === null) c.err(id + ' : pages/' + dir + '/cours.html absent');
    LESSONS[id].files.forEach((f) => {
      if (readPage(dir, f) === null) c.err(id + ' : pages/' + dir + '/' + f + ' cité mais absent du disque');
    });
  });
})();

/* =================================================== I8 related */
(function () {
  const c = check('I8', 'related → cours existant');
  Object.keys(CONTENT).forEach((id) => {
    (CONTENT[id].related || []).forEach((r) => {
      if (!r || !r.course) { c.err(id + ' : entrée related sans course'); return; }
      if (!COURSE_IDS.has(r.course)) c.err(id + ' : related vers « ' + r.course + ' » (cours inexistant)');
    });
  });
})();

/* =================================================== I9 tracks */
(function () {
  const c = check('I9', 'tracks → cours existant');
  TRACKS.forEach((t) => {
    (t.courses || []).forEach((cid) => {
      if (!COURSE_IDS.has(cid)) c.err('track « ' + (t.id || t.title) + ' » cite le cours inexistant « ' + cid + ' »');
    });
  });
})();

/* =================================================== I10 fils rouges */
(function () {
  const c = check('I10', 'fils rouges (FILS_ROUGES + fil-rouge-*-data.js)');
  let coursJs;
  try { coursJs = fs.readFileSync(path.join(JS, 'cours.js'), 'utf8'); }
  catch (e) { c.err('js/cours.js illisible : ' + e.message); return; }
  let fils;
  try { fils = extractArrayLiteral(coursJs, 'FILS_ROUGES'); }
  catch (e) { c.err('extraction de FILS_ROUGES impossible : ' + e.message); return; }
  if (!Array.isArray(fils)) { c.err('FILS_ROUGES introuvable dans cours.js'); return; }

  const atteignables = new Set(); // fils cités par au moins un cours existant
  fils.forEach((fr, idx) => {
    const nom = fr.page || ('#' + idx);
    // page HTML existante (page relative « ../fil-rouge-x.html » → à la racine)
    if (fr.page) {
      // « ../fil-rouge-x.html » est relatif à pages/<dir>/cours.html → pages/fil-rouge-x.html
      const rel = fr.page.replace(/^(\.\.\/)+/, '');
      if (!fs.existsSync(path.join(PAGES, rel))) c.err('FILS_ROUGES : page « ' + fr.page + ' » absente du disque');
    }
    const steps = [];
    Object.keys(fr.map || {}).forEach((cid) => {
      steps.push(fr.map[cid]);
      if (!COURSE_IDS.has(cid)) c.err('FILS_ROUGES (' + nom + ') : entrée morte, cours « ' + cid + ' » inexistant');
      else atteignables.add(nom); // ce fil est joignable depuis un cours réel
    });
    if (typeof fr.total === 'number' && steps.length && Math.max.apply(null, steps) > fr.total) {
      c.err('FILS_ROUGES (' + nom + ') : total=' + fr.total + ' < plus grande étape ' + Math.max.apply(null, steps));
    }
  });
  fils.forEach((fr, idx) => {
    const nom = fr.page || ('#' + idx);
    if (!atteignables.has(nom)) c.err('FILS_ROUGES (' + nom + ') : aucun cours existant ne le cite → inatteignable');
  });

  // fil-rouge-*-data.js : chaque étape pointe vers un cours réel
  let dataFiles = [];
  try { dataFiles = fs.readdirSync(JS).filter((f) => /^fil-rouge-.*-data\.js$/.test(f) || f === 'fil-rouge-data.js'); } catch (e) { /* ignore */ }
  dataFiles.forEach((f) => {
    let fr;
    try { fr = loadGlobal(path.join(JS, f), 'FIL_ROUGE'); } catch (e) { c.err(f + ' : illisible (' + e.message + ')'); return; }
    if (!fr || !Array.isArray(fr.etapes)) { c.warn(f + ' : pas de FIL_ROUGE.etapes exploitable'); return; }
    fr.etapes.forEach((e) => {
      if (e && e.course && !COURSE_IDS.has(e.course)) c.err(f + ' : étape ' + (e.n || '?') + ' cite le cours inexistant « ' + e.course + ' »');
    });
  });

  /* CONCORDANCE table ⇄ fil réel (V13-A4). Jusqu'ici, I10 vérifiait que la page
     existe et que les cours cités existent — jamais que les NUMÉROS d'étape
     concordent. Deux fils avaient ainsi dérivé en silence : `kotlin` (fil
     mobile) et `clojure` (fil jvm) étaient absents de la table, donc leur fil
     était INVISIBLE depuis leur page de cours. Un numéro périmé, lui, enverrait
     l'apprenant sur la mauvaise étape. C'est le garde-fou des chantiers qui
     renumérotent un fil (une insertion décale toutes les étapes suivantes).
     La page fait foi pour trouver les données : on lit le <script> qu'elle
     charge, ce qui détecte aussi une page branchée sur le mauvais fichier. */
  fils.forEach((fr) => {
    if (!fr.page) return;
    const rel = fr.page.replace(/^(\.\.\/)+/, '');
    const abs = path.join(PAGES, rel);
    if (!fs.existsSync(abs)) return; // déjà signalé plus haut
    const html = fs.readFileSync(abs, 'utf8');
    const m = html.match(/src="\.\.\/js\/(fil-rouge[a-z0-9-]*-data\.js)"/);
    if (!m) { c.err('FILS_ROUGES (' + fr.page + ') : la page ne charge aucun fil-rouge-*-data.js'); return; }
    let F;
    try { F = loadGlobal(path.join(JS, m[1]), 'FIL_ROUGE'); } catch (e) { return; }
    if (!F || !Array.isArray(F.etapes)) return;
    if (fr.total !== F.etapes.length) {
      c.err('FILS_ROUGES (' + fr.page + ') : total=' + fr.total + ' mais ' + m[1] + ' compte ' + F.etapes.length + ' étapes');
    }
    F.etapes.forEach((st) => {
      const vise = fr.map ? fr.map[st.course] : undefined;
      if (vise === undefined) {
        c.err('FILS_ROUGES (' + fr.page + ') : le cours « ' + st.course + ' » (étape ' + st.n +
          ') manque à la map → le fil est invisible depuis sa page de cours');
        return;
      }
      /* Un cours peut occuper DEUX étapes d'un même fil (python en 1 et 6 dans
         « donnees ») : la map ne peut en désigner qu'une, n'importe laquelle. */
      const occ = F.etapes.filter((x) => x.course === st.course).map((x) => x.n);
      if (occ.indexOf(vise) === -1) {
        c.err('FILS_ROUGES (' + fr.page + ') : « ' + st.course + ' » pointe l\'étape ' + vise +
          ' alors qu\'il occupe l\'étape ' + occ.join(' ou ') + ' dans ' + m[1]);
      }
    });
    Object.keys(fr.map || {}).forEach((cid) => {
      if (!F.etapes.some((x) => x.course === cid)) {
        c.err('FILS_ROUGES (' + fr.page + ') : la map cite « ' + cid +' », qui n\'est étape d\'aucune de ce fil');
      }
    });
  });
})();

/* =================================================== I11 projets */
(function () {
  const c = check('I11', 'projets (projets-data.js)');
  const P = loadGlobal(path.join(JS, 'projets-data.js'), 'PROJETS');
  if (!Array.isArray(P)) { c.err('js/projets-data.js illisible ou sans window.PROJETS'); return; }
  const seenId = {};
  const covered = new Set();
  P.forEach((p, i) => {
    if (!p || !p.id) c.err('projet #' + i + ' sans id');
    else { if (seenId[p.id]) c.err('projet en double : « ' + p.id + ' »'); seenId[p.id] = 1; }
    if (!p.course || !COURSE_IDS.has(p.course)) { c.err('projet « ' + (p && p.id) + ' » : course « ' + (p && p.course) + ' » inexistant'); return; }
    covered.add(p.course);
    const expectDir = CONTENT[p.course] ? (CONTENT[p.course].dir || p.course) : p.course;
    if (p.dir && p.dir !== expectDir) c.err('projet « ' + p.id + ' » : dir « ' + p.dir + ' » ≠ dir du cours « ' + expectDir + ' »');
  });
  COURSES.forEach((co) => { if (!covered.has(co.id)) c.warn('cours « ' + co.id + ' » : aucun projet contextualisé'); });
})();

/* ============================ balayage des leçons pour I12..I16 =========== */
const langAlias = { js: 'javascript', html: 'markup', xml: 'markup', svg: 'markup', mathml: 'markup', vb: 'visual-basic' };
const langNoGrammar = { plaintext: 1, text: 1, none: 1 };
const vendorDir = path.join(ROOT, 'assets', 'vendor', 'prism');
const vendorHas = {};
function vendorPresent(file) {
  if (vendorHas[file] === undefined) vendorHas[file] = fs.existsSync(path.join(vendorDir, file));
  return vendorHas[file];
}
/* Dépendances d'un composant Prism, LUES DANS LE VENDOR : un composant qui fait
   Prism.languages.extend('X', …) exige que X soit chargé avant lui. On les
   extrait du fichier minifié plutôt que de tenir une liste à la main, qui se
   périmerait au premier composant ajouté. Résultat mis en cache. */
const vendorDeps = {};
function prismDeps(file) {
  if (vendorDeps[file] !== undefined) return vendorDeps[file];
  const moi = /^prism-([a-z0-9-]+)\.min\.js$/.exec(file);
  const out = [];
  try {
    const src = fs.readFileSync(path.join(vendorDir, file), 'utf8');
    const re = /\.extend\(\s*["']([a-z0-9-]+)["']/g;
    let m;
    while ((m = re.exec(src)) !== null) {
      if (moi && m[1] === moi[1]) continue;          // un composant peut s'étendre lui-même
      if (out.indexOf(m[1]) === -1 && vendorPresent('prism-' + m[1] + '.min.js')) out.push(m[1]);
    }
  } catch (e) { /* composant illisible : traité comme sans dépendance */ }
  vendorDeps[file] = out;
  return out;
}

const cQuiz = check('I12', 'QCM bilan par cours (data-quiz-bilan)');
const cExos = check('I13', 'data-exos alignés (piège A8)');
const cPrism = check('I14', 'grammaires Prism chargées');
const cJson = check('I15', 'JSON des blocs data-*');

Object.keys(LESSONS).forEach((id) => {
  const dir = LESSONS[id].dir;
  const co = COURSES.find((x) => x.id === id);
  const multiLevel = co && Array.isArray(co.levels) && co.levels.length > 1;
  let bilans = 0;

  LESSONS[id].files.forEach((f) => {
    const html = readPage(dir, f);
    if (html === null) return; // déjà signalé par I6
    const where = dir + '/' + f;

    /* --- I15 JSON valide + comptage des bilans (I12) --- */
    const reBlk = /<script[^>]*type="application\/json"[^>]*\s(data-quiz-bilan|data-quiz|data-exos)[^>]*>([\s\S]*?)<\/script>/g;
    let mb, exosText = null;
    while ((mb = reBlk.exec(html)) !== null) {
      if (mb[1] === 'data-quiz-bilan') bilans++;
      if (mb[1] === 'data-exos') exosText = mb[2];
      try { JSON.parse(mb[2]); }
      catch (e) { cJson.err(where + ' : JSON invalide dans ' + mb[1] + ' — ' + e.message); }
    }

    /* --- I13 alignement data-exos ↔ .exercise (reproduit initExos) --- */
    if (exosText !== null) {
      let data = null;
      try { data = JSON.parse(exosText); } catch (e) { /* déjà signalé en I15 */ }
      if (Array.isArray(data)) {
        // libellés des blocs .exercise, dans l'ordre du DOM
        const labels = [];
        const reEx = /class="[^"]*\bexercise\b[^"]*"/g;
        let me;
        const positions = [];
        while ((me = reEx.exec(html)) !== null) positions.push(me.index);
        positions.forEach((pos, k) => {
          const next = positions[k + 1] || html.length;
          const seg = html.slice(pos, next);
          const mn = /<span class="exercise__num">([\s\S]*?)<\/span>/.exec(seg);
          labels.push(mn ? mn[1].replace(/<[^>]*>/g, '').trim() : '');
        });
        if (data.length > labels.length) {
          // Une entrée en excès NON-null perd un vrai exercice (erreur) ; une entrée
          // null en excès ne perd rien mais déclenche un warn console (avertissement).
          const excess = data.slice(labels.length);
          const perdus = excess.filter((e) => e !== null).length;
          if (perdus > 0) {
            cExos.err(where + ' : ' + perdus + ' entrée(s) data-exos non-null au-delà des ' + labels.length +
              ' bloc(s) .exercise → exercice(s) perdu(s)');
          } else {
            cExos.warn(where + ' : ' + excess.length + ' entrée(s) null superflue(s) en fin de data-exos ' +
              '(inoffensif à l\'écran mais déclenche un warn console — à retirer)');
          }
        }
        data.forEach((entry, k) => {
          if (entry && labels[k] !== undefined && !/^Exercice\b/.test(labels[k])) {
            cExos.err(where + ' : le bloc « ' + (labels[k] || '(sans titre)') + ' » (position ' + k +
              ') reçoit un champ interactif alors que ce n\'est pas un « Exercice N » (piège A8 : préfixer d\'un null)');
          }
        });
      }
    }

    /* --- I14 grammaires Prism --- */
    const langs = new Set();
    const reLang = /class="[^"]*\blanguage-([a-z0-9-]+)\b[^"]*"/g;
    let ml;
    while ((ml = reLang.exec(html)) !== null) langs.add(ml[1]);
    langs.forEach((lang) => {
      if (langNoGrammar[lang]) return;
      const gram = langAlias[lang] || lang;
      const file = 'prism-' + gram + '.min.js';
      if (!vendorPresent(file)) cPrism.err(where + ' : language-' + lang + ' mais ' + file + ' absent du vendor Prism');
      else if (html.indexOf(file) === -1) cPrism.err(where + ' : language-' + lang + ' utilisé mais ' + file + ' non chargé dans la page');
    });

    /* V13-B1 : la grammaire est là, mais ses DÉPENDANCES ? Un composant qui fait
       Prism.languages.extend('clike', …) lève « Cannot read properties of
       undefined (reading 'class-name') » si clike n'est pas chargé AVANT lui —
       et c'est la coloration de la page ENTIÈRE qui meurt. Aucun contrôle de
       source ne le voyait : il a fallu verif-rendu et un vrai navigateur pour le
       trouver sur les 3 premières leçons du cours `compilation` (36 exceptions).
       On lit les dépendances DANS le vendor (pas une liste écrite à la main, qui
       se périmerait), on suit la chaîne complète (cpp → c → clike), et on
       contrôle l'ORDRE. On parcourt TOUS les composants chargés, pas seulement
       ceux qu'un language-* réclame : un composant chargé pour rien plante tout
       autant. */
    const chargesRe = /prism-([a-z0-9-]+)\.min\.js/g;
    const charges = [];
    let mc;
    while ((mc = chargesRe.exec(html)) !== null) if (charges.indexOf(mc[1]) === -1) charges.push(mc[1]);
    charges.forEach((comp) => {
      if (comp === 'core') return;
      const file = 'prism-' + comp + '.min.js';
      const vus = {};
      const pile = prismDeps(file).slice();
      while (pile.length) {
        const dep = pile.shift();
        if (vus[dep]) continue;
        vus[dep] = 1;
        const depFile = 'prism-' + dep + '.min.js';
        const iDep = html.indexOf(depFile);
        if (iDep === -1) { cPrism.err(where + ' : ' + file + ' chargé sans sa dépendance ' + depFile + ' (la coloration plante)'); continue; }
        if (iDep > html.indexOf(file)) cPrism.err(where + ' : ' + depFile + ' chargé APRÈS ' + file + ' (une dépendance doit précéder)');
        prismDeps(depFile).forEach((d) => { if (!vus[d]) pile.push(d); });
      }
    });
  });

  /* --- I12 verdict par cours --- */
  if (bilans === 0) cQuiz.err(id + ' : aucun QCM bilan (data-quiz-bilan) sur l\'ensemble du cours');
  else if (bilans > 1 && !multiLevel) cQuiz.warn(id + ' : ' + bilans + ' blocs data-quiz-bilan (attendu 1 pour un cours mono-niveau)');
});

/* =================================================== I16 orphelins disque */
(function () {
  const c = check('I16', 'leçons orphelines sur le disque');
  const declared = new Set();
  Object.keys(LESSONS).forEach((id) => LESSONS[id].files.forEach((f) => declared.add(LESSONS[id].dir + '/' + f)));
  COURSES.forEach((co) => {
    const dir = co.dir;
    let entries;
    try { entries = fs.readdirSync(path.join(PAGES, dir)); } catch (e) { return; }
    entries.filter((f) => /^lecon-\d+\.html$/.test(f)).forEach((f) => {
      const key = dir + '/' + f;
      if (declared.has(key)) return;
      const html = readPage(dir, f);
      if (html !== null && isRedirect(html)) return; // redirection historique : normal
      c.warn(key + ' : présente sur le disque mais non déclarée dans data.js (ni redirection)');
    });
  });
})();

/* =================================================== I17 doublons de QCM */
/* Deux leçons d'un même cours posent parfois la MÊME question (même bonne
   réponse, simplement reformulée). verif-html et les 16 invariants sont aveugles
   à ce défaut éditorial ; ce contrôle le repère. Méthode éprouvée (chantier V6) :
     (a) normalisation CONSERVANT la ponctuation technique — sinon « . et + » se
         confondrait avec « .+ et .+? » (deux questions de regex sans rapport) ;
     (b) le signal FORT est la BONNE RÉPONSE au même contenu, pas seulement
         l'énoncé — le patron « quelle différence entre X et Y ? » rapproche à tort
         git add/commit de git am/apply, dont les réponses diffèrent ;
     (c) les blocs data-quiz-bilan (reprise voulue en fin de cours) sont EXCLUS —
         on ne lit que le data-quiz normal de chaque leçon.
   Deux niveaux : ERREUR (bloquante) au-delà de ERR_R = doublon quasi certain ;
   AVERTISSEMENT dès WARN_R = candidat à EXAMINER — car certains ne sont pas des
   doublons mais « deux faces complémentaires » d'une même notion (ex. go : le
   comma-ok des maps qui ne panique pas vs celui des assertions de type qui, lui,
   panique), ce que seul un humain tranche. Comparaison intra-cours uniquement. */
(function () {
  const c = check('I17', 'doublons de QCM (même bonne réponse)');
  const MIN_Q = 0.30;   // énoncés pas totalement étrangers (garde-fou léger)
  const WARN_R = 0.33;  // bonne réponse au contenu proche → à examiner
  const ERR_R = 0.50;   // bonne réponse quasi identique → doublon bloquant
  // Tokenisation qui GARDE la ponctuation technique (. + ? < > : ! / \\ _ {} () | $ # = [] * -).
  const norm = (s) => String(s).toLowerCase().replace(/<[^>]+>/g, ' ');
  const toks = (s) => new Set(norm(s).split(/[^a-z0-9<>?:!.\\\/_{}()+|$#=\[\]*à-ÿ-]+/).filter(Boolean));
  const jaccard = (a, b) => {
    const A = toks(a), B = toks(b);
    if (!A.size || !B.size) return 0;
    let inter = 0; A.forEach((x) => { if (B.has(x)) inter++; });
    return inter / (A.size + B.size - inter);
  };
  // data-quiz UNIQUEMENT (pas data-quiz-bilan : le « - » après quiz empêche le match).
  const reQuiz = /<script[^>]*type="application\/json"[^>]*\sdata-quiz>([\s\S]*?)<\/script>/;
  Object.keys(LESSONS).forEach((id) => {
    const dir = LESSONS[id].dir;
    const qs = [];
    LESSONS[id].files.forEach((f) => {
      const html = readPage(dir, f);
      if (html === null) return;
      const m = reQuiz.exec(html);
      if (!m) return;
      let arr; try { arr = JSON.parse(m[1]); } catch (e) { return; } // JSON cassé : déjà signalé par I15
      if (!Array.isArray(arr)) return;
      arr.forEach((q, i) => {
        if (q && Array.isArray(q.a) && typeof q.correct === 'number' && q.a[q.correct] != null) {
          qs.push({ ref: f.replace(/\.html$/, '') + '#' + i, q: q.q || '', ans: q.a[q.correct] });
        }
      });
    });
    for (let i = 0; i < qs.length; i++) {
      for (let j = i + 1; j < qs.length; j++) {
        const Q = jaccard(qs[i].q, qs[j].q);
        if (Q < MIN_Q) continue;
        const R = jaccard(qs[i].ans, qs[j].ans);
        if (R < WARN_R) continue;
        const msg = id + ' : ' + qs[i].ref + ' ↔ ' + qs[j].ref +
          ' (énoncé ' + Q.toFixed(2) + ' / réponse ' + R.toFixed(2) + ')';
        if (R >= ERR_R) c.err(msg + ' — même bonne réponse : doublon, n\'en garder qu\'une');
        else c.warn(msg + ' — à examiner (vrai doublon, ou deux faces d\'une même notion ?)');
      }
    }
  });
})();

/* ==================================== I18 index dérivés non périmés (--strict) */
/* build-index.js --strict sort en code 1 dès qu'une entrée de l'ancien index doit
   être REPRISE (question/carte réécrite ou supprimée qui survit dans l'index). On
   le lance en comparaison (n'écrit rien) : c'est le garde-fou qui ferme la famille
   de bugs « index périmé ». Purge : build-index.js --write --fresh. */
(function () {
  const c = check('I18', 'index dérivés non périmés (build-index --strict)');
  const { execFileSync } = require('child_process');
  const script = path.join(__dirname, 'build-index.js');
  try {
    execFileSync(process.execPath,
      [script, '--strict', '--root=' + ROOT, '--only=quiz,flashcards,antiseches,pieges'],
      { stdio: 'pipe' });
  } catch (e) {
    const out = (e.stdout ? e.stdout.toString() : '') + (e.stderr ? e.stderr.toString() : '');
    const n = (out.match(/(\d+) entrée\(s\) REPRISE/) || [])[1] || '?';
    c.err(n + ' entrée(s) d\'index périmée(s) reprises de l\'ancien index — purger via « build-index.js --write --fresh »');
    out.split('\n').filter((l) => /✗/.test(l)).slice(0, 4).forEach((l) => c.err('  ' + l.trim()));
  }
})();

/* ================================ I19 compteurs affichés ⇄ décompte réel */
/* Les chiffres de l'accueil, du catalogue et d'« À propos » sont écrits en dur : ils
   ont été FAUX trois fois (79/938, puis 1341, puis 13 pages de cours). On confronte
   chaque « N cours/leçons/langages/parcours » AFFICHÉ au décompte réel de data.js.
   On retire d'abord les COMMENTAIRES (le récit historique « 1336 leçons » d'un
   commentaire de main.js n'est pas un compteur affiché) pour ne pas crier à tort. */
(function () {
  const c = check('I19', 'compteurs affichés ⇄ décompte réel');
  const REEL = {
    cours: COURSES.length,
    lecons: totalLessons,
    langages: new Set(COURSES.map((x) => x.language).filter(Boolean)).size,
    parcours: TRACKS.length,
  };
  const LABEL = { cours: 'cours', lecons: 'leçons', langages: 'langages', parcours: 'parcours' };
  function sansComJs(code) {
    let out = '', str = null;
    for (let i = 0; i < code.length; i++) {
      const ch = code[i];
      if (str) { out += ch; if (ch === '\\') { out += (code[++i] || ''); continue; } if (ch === str) str = null; continue; }
      if (ch === '"' || ch === "'" || ch === '`') { str = ch; out += ch; continue; }
      if (ch === '/' && code[i + 1] === '/') { const nl = code.indexOf('\n', i); i = nl < 0 ? code.length : nl; out += '\n'; continue; }
      if (ch === '/' && code[i + 1] === '*') { const e = code.indexOf('*/', i + 2); i = e < 0 ? code.length : e + 1; continue; }
      out += ch;
    }
    return out;
  }
  function typeDe(mot) {
    mot = mot.toLowerCase();
    if (/^cours/.test(mot)) return 'cours';
    if (/^(leçon|lesson)/.test(mot)) return 'lecons';
    if (/^(langage|language)/.test(mot)) return 'langages';
    if (/^(parcours|path)/.test(mot)) return 'parcours';
    return null;
  }
  const re = /(\d{2,4})\s*(cours|leçons?|lessons?|langages?|languages?|parcours|paths?)\b/gi;
  const cibles = [
    { p: path.join(ROOT, 'index.html'), js: false, nom: 'index.html' },
    { p: path.join(PAGES, 'catalogue.html'), js: false, nom: 'pages/catalogue.html' },
    { p: path.join(PAGES, 'a-propos.html'), js: false, nom: 'pages/a-propos.html' },
    { p: path.join(JS, 'main.js'), js: true, nom: 'js/main.js' },
  ];
  const vus = {};
  cibles.forEach((cible) => {
    let src;
    try { src = fs.readFileSync(cible.p, 'utf8'); } catch (e) { return; }
    const clean = cible.js ? sansComJs(src) : src.replace(/<!--[\s\S]*?-->/g, ' ');
    let m; re.lastIndex = 0;
    while ((m = re.exec(clean))) {
      const type = typeDe(m[2]);
      if (!type) continue;
      const n = parseInt(m[1], 10);
      if (n !== REEL[type]) c.err(cible.nom + ' : « ' + n + ' ' + m[2] + ' » affiché mais ' + REEL[type] + ' ' + LABEL[type] + ' réel(le)s');
      else vus[type] = true;
    }
  });
  Object.keys(REEL).forEach((type) => {
    if (!vus[type]) c.warn('aucun compteur « ' + LABEL[type] + ' » (= ' + REEL[type] + ') trouvé dans les pages de stats — surveillance impossible');
  });
})();

/* ==================================== I20 titre data.js ⇄ <h1> affiché */
/* Le <h1 class="lesson-header__title"> est écrit EN DUR dans chaque leçon, alors
   que data.js déclare le title (celui du catalogue, de la recherche, de la nav).
   Rien ne les rapprochait : 4 divergences vivaient. On les confronte, entités
   HTML décodées. */
(function () {
  const c = check('I20', 'titre data.js ⇄ <h1> affiché');
  function norm(s) {
    return String(s == null ? '' : s)
      .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"')
      .replace(/&#0?39;/g, "'").replace(/&#x27;/gi, "'").replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&')
      .replace(/\s+/g, ' ').trim();
  }
  Object.keys(CONTENT).forEach((id) => {
    const cc = CONTENT[id];
    const dir = cc.dir || id;
    (cc.modules || []).forEach((m) => (m.lessons || []).forEach((l) => {
      if (!l || !l.file || l.file === '#') return;
      const html = readPage(dir, l.file);
      if (html == null || isRedirect(html)) return;
      const mm = html.match(/<h1[^>]*class="lesson-header__title"[^>]*>([\s\S]*?)<\/h1>/);
      if (!mm) { c.warn(id + '/' + l.file + ' : pas de <h1 class="lesson-header__title">'); return; }
      const h1 = norm(mm[1].replace(/<[^>]+>/g, ''));
      const titre = norm(l.title);
      if (h1 !== titre) c.err(id + '/' + l.file + ' : data.js « ' + titre + ' » ≠ <h1> « ' + h1 + ' »');
    }));
  });
})();

/* ============================= I21 étiquette de langage ⇄ contenu du bloc */
/* I14 vérifie que la grammaire Prism est chargée, jamais qu'elle CORRESPOND au
   contenu. Détecteur en AVERTISSEMENT (non bloquant) : un bloc language-X sans aucun
   marqueur EXCLUSIF de X mais avec ≥ 2 marqueurs exclusifs d'un autre langage. Les
   commentaires et les chaînes sont retirés d'abord (sinon « SELECT en commentaire »
   ou « import » partagé JS/Python déclenchent à tort). Ne juge que js/python/sql.
   NB : la mesure « 1 bloc sur 5 » de l'inventaire NE se reproduit pas (0 ici sur
   3071 blocs) — elle comptait HTML polyglotte, imports partagés, sorties, exemples
   en commentaire. C'est un garde-fou pour l'avenir, pas une dette existante. */
(function () {
  const c = check('I21', 'étiquette de langage ⇄ contenu (garde-fou)');
  function dec(s) { return s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#0?39;/g, "'").replace(/&amp;/g, '&'); }
  function strip(code) {
    let out = '', s = null;
    for (let i = 0; i < code.length; i++) {
      const ch = code[i];
      if (s) { if (ch === '\\') { i++; continue; } if (ch === s) s = null; continue; }
      if (ch === '"' || ch === "'" || ch === '`') { s = ch; continue; }
      if (ch === '/' && code[i + 1] === '/') { const n = code.indexOf('\n', i); i = n < 0 ? code.length : n; continue; }
      if (ch === '#') { const n = code.indexOf('\n', i); i = n < 0 ? code.length : n; continue; }
      if (ch === '-' && code[i + 1] === '-') { const n = code.indexOf('\n', i); i = n < 0 ? code.length : n; continue; }
      if (ch === '/' && code[i + 1] === '*') { const e = code.indexOf('*/', i + 2); i = e < 0 ? code.length : e + 1; continue; }
      out += ch;
    }
    return out;
  }
  const EXCL = {
    javascript: [/\bconsole\s*\.\s*log\b/, /=>/, /\bdocument\s*\./, /\b(let|var)\s+\w+\s*=/, /\bfunction\s*\w*\s*\(/],
    python: [/\bdef\s+\w+\s*\(/, /\belif\b/, /\bprint\s*\(/, /\b__\w+__\b/, /\bself\b/],
    sql: [/\bSELECT\b[\s\S]*\bFROM\b/i, /\bINSERT\s+INTO\b/i, /\bCREATE\s+TABLE\b/i, /\bGROUP\s+BY\b/i],
  };
  const sc = (code, S) => S.reduce((n, re) => n + (re.test(code) ? 1 : 0), 0);
  Object.keys(CONTENT).forEach((id) => {
    const cc = CONTENT[id];
    const dir = cc.dir || id;
    (cc.modules || []).forEach((m) => (m.lessons || []).forEach((l) => {
      if (!l || !l.file || l.file === '#') return;
      const html = readPage(dir, l.file);
      if (html == null || isRedirect(html)) return;
      const re = /<code class="language-([a-z0-9+#-]+)">([\s\S]*?)<\/code>/gi;
      let mm;
      while ((mm = re.exec(html))) {
        const lang = mm[1].toLowerCase();
        if (!EXCL[lang]) continue;
        const code = strip(dec(mm[2]));
        if (code.replace(/\s/g, '').length < 12) continue;
        const own = sc(code, EXCL[lang]);
        if (own > 0) continue;
        let best = null, bs = 0;
        for (const o of Object.keys(EXCL)) { if (o === lang) continue; const s = sc(code, EXCL[o]); if (s > bs) { bs = s; best = o; } }
        if (bs >= 2) c.warn(id + '/' + l.file + ' : bloc language-' + lang + ' sans marqueur ' + lang + ', ressemble à ' + best + ' (' + bs + ' marqueurs)');
      }
    }));
  });
})();

/* ============================= I22 SQL : mot réservé comme identifiant nu */
/* 353 blocs SQL, aucun contrôle jusqu'ici : l'audit V10 a dû trouver « end » comme
   nom de colonne À LA MAIN dans 5 leçons (depuis délimité "end"). AVERTISSEMENT
   (non bloquant) : une COLONNE de CREATE TABLE ou un ALIAS « AS x » qui est un mot
   RÉSERVÉ du standard SANS délimiteur ("x", `x`, [x]). 0 aujourd'hui — garde-fou.
   La COHÉRENCE DE DIALECTE n'est PAS contrôlée : les 2 seules leçons mêlant
   plusieurs marqueurs (sql/l18, bdd/l05) COMPARENT volontairement SERIAL/IDENTITY/
   AUTO_INCREMENT — la mixité y est pédagogique, la signaler serait un faux positif. */
(function () {
  const c = check('I22', 'SQL : mot réservé comme identifiant nu (garde-fou)');
  // Mots RÉSERVÉS stricts : erreur de syntaxe quasi garantie comme identifiant nu.
  // On ÉCARTE les « non-reserved » (key, level, row, range, rank, user, value, role,
  // name…), utilisables comme colonnes sans délimiteur dans MySQL/Postgres/SQLite.
  const RES = new Set(['end', 'order', 'group', 'table', 'column', 'default', 'check', 'index',
    'primary', 'foreign', 'references', 'constraint', 'desc', 'case', 'when', 'then', 'values',
    'natural', 'using', 'over', 'partition', 'window', 'limit', 'offset', 'having', 'union',
    'distinct', 'select', 'from', 'where', 'grant']);
  // Après « AS », ces mots introduisent une sous-requête/structure, pas un alias.
  const NON_ALIAS = new Set(['select', 'values', 'table', 'with', 'from']);
  function dec(s) { return s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#0?39;/g, "'").replace(/&amp;/g, '&'); }
  function splitTop(s) {          // split par virgule de premier niveau (hors parenthèses)
    const out = []; let depth = 0, cur = '';
    for (const ch of s) {
      if (ch === '(') depth++; else if (ch === ')') depth--;
      if (ch === ',' && depth === 0) { out.push(cur); cur = ''; } else cur += ch;
    }
    if (cur.trim()) out.push(cur);
    return out;
  }
  const TYPES = /^(INT|INTEGER|TEXT|VARCHAR|CHAR|REAL|FLOAT|DOUBLE|NUMERIC|DECIMAL|BOOLEAN|BOOL|DATE|TIME|TIMESTAMP|BLOB|SERIAL|BIGINT|SMALLINT|UUID|JSON|JSONB)\b/i;
  Object.keys(CONTENT).forEach((id) => {
    const cc = CONTENT[id];
    const dir = cc.dir || id;
    (cc.modules || []).forEach((m) => (m.lessons || []).forEach((l) => {
      if (!l || !l.file || l.file === '#') return;
      const html = readPage(dir, l.file);
      if (html == null || isRedirect(html)) return;
      const re = /<code class="language-sql">([\s\S]*?)<\/code>/gi;
      let mm;
      while ((mm = re.exec(html))) {
        const code = dec(mm[1]);
        // colonnes de CREATE TABLE (…)
        const ct = code.match(/CREATE\s+TABLE[^(]*\(([\s\S]*?)\)\s*;/i);
        if (ct) {
          splitTop(ct[1]).forEach((item) => {
            const t = item.trim();
            const w = t.match(/^([a-zA-Z_]\w*)\s+/);
            if (w && TYPES.test(t.slice(w[1].length).trim()) && RES.has(w[1].toLowerCase())) {
              c.warn(id + '/' + l.file + ' : colonne « ' + w[1] + ' » est un mot réservé SQL nu (délimiter : "' + w[1] + '")');
            }
          });
        }
        // alias AS x nu
        let a; const reA = /\bAS\s+(?!["`\[])([a-zA-Z_]\w*)/gi;
        while ((a = reA.exec(code))) {
          const w = a[1].toLowerCase();
          if (RES.has(w) && !NON_ALIAS.has(w)) c.warn(id + '/' + l.file + ' : alias « AS ' + a[1] + ' » est un mot réservé SQL nu');
        }
      }
    }));
  });
})();

/* ============================ I23 hubs de l'espace personnel atteignables */
/* Une page qu'on n'atteint que par le pied de page de l'accueil est une page
   morte : « Mes données » est pourtant l'unique endroit où l'on exporte, où l'on
   efface au détail, et où l'on récupère une sauvegarde mise de côté parce
   qu'elle était illisible (V12-B2). Deux contrôles, tous deux statiques :
     (a) toute page citée par LESSON_FOOTER_COLS existe bien dans pages/ ;
     (b) les hubs de l'espace personnel sont liés depuis progression.html. */
(function () {
  const c = check('I23', 'hubs de l\'espace personnel atteignables');
  let mainJs = '';
  try { mainJs = fs.readFileSync(path.join(JS, 'main.js'), 'utf8'); }
  catch (e) { c.err('js/main.js illisible'); return; }

  const bloc = /var LESSON_FOOTER_COLS = \[([\s\S]*?)\n  \];/.exec(mainJs);
  if (!bloc) { c.err('LESSON_FOOTER_COLS introuvable dans js/main.js'); return; }

  const cites = [];
  const re = /\["([a-z0-9-]+\.html)",\s*"([^"]+)"\]/g;
  let m;
  while ((m = re.exec(bloc[1]))) cites.push({ page: m[1], libelle: m[2] });
  if (!cites.length) { c.err('LESSON_FOOTER_COLS ne cite aucune page'); return; }

  cites.forEach((x) => {
    if (!fs.existsSync(path.join(PAGES, x.page))) {
      c.err('pied de page des leçons → pages/' + x.page + ' n\'existe pas');
    }
  });

  /* Les pages où l'on gère SES données doivent être atteignables depuis le
     tableau de bord, pas seulement depuis l'accueil. */
  const DEPUIS_PROGRESSION = ['donnees-perso.html'];
  let prog = '';
  try { prog = fs.readFileSync(path.join(PAGES, 'progression.html'), 'utf8'); }
  catch (e) { c.err('pages/progression.html illisible'); return; }
  DEPUIS_PROGRESSION.forEach((page) => {
    if (prog.indexOf(page) === -1) {
      c.err('pages/progression.html ne renvoie pas vers ' + page +
        ' — la page n\'est alors atteignable que par le pied de page de l\'accueil');
    }
    if (!cites.some((x) => x.page === page)) {
      c.err('pied de page des leçons (LESSON_FOOTER_COLS) ne cite pas ' + page);
    }
  });
})();

/* ================================== I24 repli <noscript> des pages transverses */
/* Le site n'a pas de serveur : catalogue, progression, QCM et exercices sont
   construits dans le navigateur. JavaScript coupé, les pages transverses
   n'affichent plus que leur texte fixe — mesuré sous Chrome, script désactivé :
   18 fils rouges tombaient à 14-22 mots, imprimer.html à 4 — et RIEN ne disait
   pourquoi. Le <noscript> le dit. Il ne peut pas être injecté par main.js (sans
   JavaScript, rien n'injecte) : il est écrit en dur, donc il faut le garder. */
(function () {
  const c = check('I24', 'repli <noscript> des pages transverses');
  const cibles = [];
  try {
    fs.readdirSync(PAGES).forEach((f) => {
      if (f.endsWith('.html')) cibles.push({ chemin: path.join(PAGES, f), nom: 'pages/' + f });
    });
  } catch (e) { c.err('dossier pages/ illisible'); return; }
  cibles.push({ chemin: path.join(ROOT, 'index.html'), nom: 'index.html' });

  cibles.forEach((x) => {
    let src = '';
    try { src = fs.readFileSync(x.chemin, 'utf8'); } catch (e) { c.err(x.nom + ' illisible'); return; }
    if (isRedirect(src)) return; /* une redirection n'a pas de contenu à expliquer */
    if (src.indexOf('<noscript') === -1) {
      c.err(x.nom + ' n\'a pas de <noscript> : sans JavaScript, la page ne dit pas pourquoi elle est vide');
    } else if (src.indexOf('noscript-avis') === -1) {
      c.warn(x.nom + ' a un <noscript> mais pas la classe noscript-avis (mise en forme perdue)');
    }
  });
})();

/* ================================== I25 index des pièges (V12-D1) ========= */
/* 1 773 encadrés « Piège fréquent » rassemblés depuis les leçons. Un index qui
   renverrait vers une leçon disparue serait pire que pas d'index : on vérifie
   que chaque entrée pointe un fichier réel ET déclaré, que la page le charge, et
   on signale (sans bloquer) les cours qui n'ont aucun encadré d'erreur — c'est
   un manque de contenu, pas une incohérence. */
(function () {
  const c = check('I25', 'index des pièges ⇄ leçons réelles');
  const arr = loadGlobal(path.join(JS, 'pieges-data.js'), 'PIEGES');
  if (!arr) { c.err('js/pieges-data.js illisible ou sans window.PIEGES'); return; }
  if (!arr.length) { c.err('js/pieges-data.js est vide'); return; }

  /* Fichiers DÉCLARÉS par data.js, par dossier de cours. */
  const declares = {};
  COURSES.forEach((co) => {
    const cont = CONTENT[co.id];
    if (!cont) return;
    declares[cont.dir] = declares[cont.dir] || {};
    (cont.modules || []).forEach((m) => {
      (m.lessons || []).forEach((l) => { declares[cont.dir][l.file] = 1; });
    });
  });

  let inconnus = 0, absents = 0, vides = 0;
  arr.forEach((p) => {
    if (!p || !p.c || !p.f) { vides++; return; }
    if (!declares[p.c] || !declares[p.c][p.f]) {
      if (inconnus < 5) c.err('pièges : ' + p.c + '/' + p.f + ' n\'est pas une leçon déclarée');
      inconnus++;
      return;
    }
    if (!fs.existsSync(path.join(PAGES, p.c, p.f))) {
      if (absents < 5) c.err('pièges : pages/' + p.c + '/' + p.f + ' est absent du disque');
      absents++;
    }
    if (!p.x || !String(p.x).trim()) vides++;
  });
  if (inconnus > 5) c.err('… et ' + (inconnus - 5) + ' autre(s) leçon(s) inconnue(s)');
  if (vides) c.err(vides + ' entrée(s) de piège sans texte');

  /* La page doit charger l'index ET son script, sinon elle reste vide. */
  let page = '';
  try { page = fs.readFileSync(path.join(PAGES, 'pieges.html'), 'utf8'); }
  catch (e) { c.err('pages/pieges.html illisible'); }
  if (page) {
    if (page.indexOf('pieges-data.js') === -1) c.err('pages/pieges.html ne charge pas js/pieges-data.js');
    if (page.indexOf('js/pieges.js') === -1) c.err('pages/pieges.html ne charge pas js/pieges.js');
    if (page.indexOf('id="piege-list"') === -1) c.err('pages/pieges.html n\'a pas de conteneur #piege-list');
  }

  /* Trou d'index : un cours sans le moindre encadré d'erreur. */
  const couverts = {};
  arr.forEach((p) => { couverts[p.c] = 1; });
  const sans = COURSES.map((co) => (CONTENT[co.id] || {}).dir).filter((d) => d && !couverts[d]);
  if (sans.length) {
    c.warn(sans.length + ' cours sans aucun encadré d\'erreur (trou dans l\'index) : ' + sans.join(', '));
  }
})();

/* ============================ I26 source des cartes de révision (V12-D3) === */
/* 10 678 cartes servent DEUX pages (révision et glossaire) et ne renvoyaient
   qu'au cours. Le champ « f » a été rétabli : on vérifie qu'il est là et qu'il
   pointe un fichier réel — « cours.html » est une source légitime (le glossaire
   de la page de cours). */
(function () {
  const c = check('I26', 'source des cartes de révision ⇄ fichiers réels');
  const arr = loadGlobal(path.join(JS, 'flashcards-data.js'), 'FLASHCARDS');
  if (!arr || !arr.length) { c.err('js/flashcards-data.js illisible ou vide'); return; }

  let sansSource = 0, introuvables = 0;
  const vus = new Set();
  arr.forEach((k) => {
    if (!k || !k.c) return;
    if (!k.f) { sansSource++; return; }
    const rel = k.c + '/' + k.f;
    if (vus.has(rel)) return;
    vus.add(rel);
    if (!fs.existsSync(path.join(PAGES, k.c, k.f))) {
      if (introuvables < 5) c.err('carte → pages/' + rel + ' est absent du disque');
      introuvables++;
    }
  });
  if (introuvables > 5) c.err('… et ' + (introuvables - 5) + ' autre(s) fichier(s) introuvable(s)');
  /* Une carte reprise d'un très vieil index peut ne pas avoir de source : on
     avertit tant que ça reste marginal, on bloque si l'information a disparu. */
  if (sansSource) {
    const part = sansSource / arr.length;
    if (part > 0.05) c.err(sansSource + ' carte(s) sur ' + arr.length + ' sans leçon d\'origine (> 5 %)');
    else c.warn(sansSource + ' carte(s) sans leçon d\'origine (reprises d\'un ancien index)');
  }
})();

/* ================================================================ sortie */
const totalErr = REPORT.reduce((n, e) => n + e.errors.length, 0);
const totalWarn = REPORT.reduce((n, e) => n + e.warns.length, 0);

if (OPT.json) {
  console.log(JSON.stringify({
    root: ROOT, cours: COURSES.length, lecons: totalLessons,
    erreurs: totalErr, avertissements: totalWarn, controles: REPORT,
  }, null, 2));
} else {
  console.log('Vérificateur de DONNÉES — ' + COURSES.length + ' cours, ' + totalLessons + ' leçons déclarées');
  console.log('Racine : ' + ROOT + '\n');
  REPORT.forEach((e) => {
    const etat = e.errors.length ? (e.errors.length + ' ERREUR(S)') : (e.warns.length ? e.warns.length + ' avert.' : 'OK');
    console.log('[' + e.code + '] ' + e.titre.padEnd(42, '.') + ' ' + etat);
    e.errors.forEach((m) => console.log('     ✗ ' + m));
    e.warns.forEach((m) => console.log('     · ' + m));
  });
  console.log('\n=== RÉSUMÉ ===');
  console.log('  contrôles ......... ' + REPORT.length);
  console.log('  ERREURS ........... ' + totalErr);
  console.log('  avertissements .... ' + totalWarn);
  if (!totalErr) console.log('\nAucune erreur d\'invariant. Les données sont cohérentes.');
  else console.log('\nDes invariants sont violés : corriger avant de publier.');
}

process.exitCode = totalErr ? 1 : 0;
