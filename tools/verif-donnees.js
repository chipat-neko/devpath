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
 *                             aucune entrée morte ; fil-rouge-*-data.js cohérents.
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
