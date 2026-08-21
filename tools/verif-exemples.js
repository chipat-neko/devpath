#!/usr/bin/env node
'use strict';

/**
 * tools/verif-exemples.js — Exécute réellement les exemples de code des leçons
 * et confronte leur SORTIE ANNONCÉE (écrite en commentaire) à la SORTIE RÉELLE.
 *
 * POURQUOI CE SCRIPT
 * ------------------
 * Les quatre autres vérificateurs lisent le SOURCE ; aucun n'exécute jamais un
 * exemple. Or l'inventaire du 2026-08-20 a trouvé, tous verts, CINQ exemples dont
 * la sortie annoncée était fausse — dont une leçon sur les regex affichant « // true »
 * sous un test renvoyant « false », visible par l'apprenant puisque runner.js pose
 * un bouton « ▶ Tester » sur ces blocs. 1 862 valeurs attendues sont écrites en
 * commentaire ; personne ne les confronte au réel. Ce script le fait.
 *
 * CE QU'IL FAIT
 * ------------
 *  1. Extrait les blocs <code class="language-…"> des leçons et décode les entités.
 *  2. Repère les VALEURS ATTENDUES écrites en commentaire, selon des marqueurs
 *     FIABLES : « //=> x », « // affiche : x », « // sortie : x » (et « # … » côté
 *     Python), plus l'inline « console.log(x); //=> y ».
 *  3. EXÉCUTE le bloc — JavaScript dans un contexte vm isolé (aucune dépendance),
 *     Python via l'interpréteur système s'il est présent — en capturant la sortie
 *     avec EXACTEMENT le même formatage que runner.js (ce que l'apprenant voit).
 *  4. Classe chaque bloc à valeur attendue en TROIS états, jamais confondus :
 *       • conforme     — la sortie réelle correspond à la sortie annoncée ;
 *       • divergent    — elles diffèrent (c'est le bug à corriger) ;
 *       • non vérifié  — fragment qui dépend d'un autre bloc, API navigateur/Node,
 *                        code asynchrone, erreur d'exécution, interpréteur absent…
 *                        Un « non vérifié » n'est JAMAIS compté comme conforme.
 *
 * PRUDENCE CONTRE LES FAUX POSITIFS (règle du chantier : un motif trop large casse
 * ce qui était juste). La comparaison ignore les espaces non significatifs, de sorte
 * que « [2, 4, 6] » (écrit par l'humain) et « [2,4,6] » (JSON.stringify) sont égaux.
 * Un verdict « divergent » n'est rendu QUE si le nombre de sorties produites égale le
 * nombre de valeurs annoncées ; sinon le bloc est « non vérifié (compte) », pas
 * divergent. On préfère taire un doute que crier une fausse alerte.
 *
 * USAGE
 *   node tools/verif-exemples.js                 tous les langages exécutables
 *   node tools/verif-exemples.js --lang js       JavaScript seulement
 *   node tools/verif-exemples.js --lang py       Python seulement
 *   node tools/verif-exemples.js --divergents    n'affiche que les divergences
 *   node tools/verif-exemples.js --details       affiche aussi les « non vérifié »
 *   node tools/verif-exemples.js --json          sortie machine
 *   node tools/verif-exemples.js --fichier <p>   un seul fichier
 *
 * CODE DE SORTIE : 1 s'il existe au moins un bloc DIVERGENT, sinon 0.
 * Un « non vérifié » n'est jamais bloquant : c'est une limite de l'outil, pas un bug
 * du contenu.
 */

const fs = require('fs');
const path = require('path');
const os = require('os');
const vm = require('vm');
const cp = require('child_process');

/* ------------------------------------------------------------------ */
/* Collecte des fichiers de leçon                                       */
/* ------------------------------------------------------------------ */

function listeLecons(dossier, sortie) {
  let entrees;
  try { entrees = fs.readdirSync(dossier, { withFileTypes: true }); } catch (e) { return sortie; }
  for (const e of entrees) {
    const p = path.join(dossier, e.name);
    if (e.isDirectory()) listeLecons(p, sortie);
    else if (/lecon-\d+\.html$/i.test(e.name)) sortie.push(p);
  }
  return sortie;
}

/* ------------------------------------------------------------------ */
/* Décodage des entités HTML utilisées dans les blocs de code           */
/* ------------------------------------------------------------------ */

function decode(s) {
  return s
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/&#x27;/gi, "'")
    .replace(/&#0?96;/g, '`')
    .replace(/&amp;/g, '&');   // en dernier
}

/* ------------------------------------------------------------------ */
/* Extraction des blocs <code class="language-…">                       */
/* ------------------------------------------------------------------ */

const RE_BLOCK = /<figure\b([^>]*)>\s*<pre><code class="language-([a-z0-9+#-]+)">([\s\S]*?)<\/code><\/pre>/gi;

function numLigne(src, offset) {
  let n = 1;
  for (let i = 0; i < offset && i < src.length; i++) if (src.charCodeAt(i) === 10) n++;
  return n;
}

function blocsDe(fichier) {
  const src = fs.readFileSync(fichier, 'utf8');
  const blocs = [];
  let m;
  RE_BLOCK.lastIndex = 0;
  while ((m = RE_BLOCK.exec(src))) {
    const attrs = m[1] || '';
    const lang = m[2].toLowerCase();
    const code = decode(m[3]);
    const df = attrs.match(/data-file="([^"]*)"/i);
    blocs.push({
      fichier, lang, code,
      dataFile: df ? df[1] : null,
      ligne: numLigne(src, m.index)
    });
  }
  return blocs;
}

/* ------------------------------------------------------------------ */
/* Extraction des valeurs attendues                                     */
/* ------------------------------------------------------------------ */

// Un littéral « valeur » plausible : nombre, chaîne, tableau, objet, booléen…
// Sert à distinguer « // affiche 42 » (valeur) de « // affiche le total » (glose).
const LITTERAL = /^(["'`\[{]|-?\d|true\b|false\b|null\b|undefined\b|NaN\b|Infinity\b|\/|\.|#)/;

// Détermine si le texte après un marqueur est bien une VALEUR (et pas une phrase).
function estValeur(txt, apresDeuxPoints) {
  const t = txt.trim();
  if (!t) return false;
  if (apresDeuxPoints) return true;                 // « affiche : X » → X est la valeur
  if (LITTERAL.test(t)) return true;                // commence par un littéral
  // un seul mot sans espace (identifiant, mot-clé) : on l'accepte (ex. « // sortie NaN »)
  if (/^\S+$/.test(t)) return true;
  return false;                                     // « le résultat », « la valeur »… : glose
}

// Marqueurs de sortie. Le préfixe de commentaire dépend du langage.
// Renvoie { valeur } si la ligne porte une valeur attendue, sinon null.
function attenduDeCommentaire(comment) {
  // comment = texte APRÈS le « // » ou le « # », déjà sans le préfixe.
  let m;
  // « => x »  /  « ➡ x »
  if ((m = comment.match(/^\s*(?:=>|➡️?|⇒)\s*(.*)$/))) {
    return { valeur: m[1].trim() };
  }
  // « affiche : x » / « affiche x » / « sortie … » / « résultat … » / « retourne … » / « renvoie … »
  m = comment.match(/^\s*(affiche|sortie|résultat|resultat|retourne|renvoie|renverra|donne|vaut|output)\b\s*(:)?\s*(.*)$/i);
  if (m) {
    const reste = (m[3] || '').trim();
    if (estValeur(reste, !!m[2])) return { valeur: reste };
  }
  return null;
}

// Une ligne « expression pure » est évaluable et loggable telle quelle : pas de
// mot-clé de statement en tête, pas d'assignation de premier niveau, délimiteurs
// équilibrés. C'est ce qui permet de traiter « /\d/.test("a1") // true » — le cas
// même de l'erreur regex de l'inventaire — en l'enveloppant dans un affichage.
function equilibre(s) {
  let p = 0, b = 0, c = 0, dans = null;
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    if (dans) { if (ch === '\\') { i++; continue; } if (ch === dans) dans = null; continue; }
    if (ch === '"' || ch === "'" || ch === '`') { dans = ch; continue; }
    if (ch === '(') p++; else if (ch === ')') p--;
    else if (ch === '[') b++; else if (ch === ']') b--;
    else if (ch === '{') c++; else if (ch === '}') c--;
    if (p < 0 || b < 0 || c < 0) return false;
  }
  return p === 0 && b === 0 && c === 0 && !dans;
}

function estExpressionPure(code) {
  const t = code.replace(/;\s*$/, '').trim();
  if (!t) return false;
  if (/^(const|let|var|function|class|if|else|for|while|do|switch|case|default|return|throw|try|catch|finally|import|export|from|break|continue|delete|void|debugger|with|async|def|print|assert|global|nonlocal|lambda|pass|raise|elif|while)\b/.test(t)) return false;
  const sansArrow = t.replace(/=>/g, '§').replace(/[!<>=]=/g, '§§');
  if (/(^|[^=!<>+\-*/%&|^])=(?![=])/.test(sansArrow)) return false;  // assignation de premier niveau
  if (t.indexOf(';') !== -1) return false;                           // plusieurs instructions
  return equilibre(t);
}

// Instrumente un bloc : renvoie le code à EXÉCUTER et la liste ordonnée des valeurs
// attendues (une par sortie affichée). Trois sources d'attendu, sans ambiguïté :
//   1. marqueur explicite  « //=> x », « // affiche : x » (inline ou ligne dédiée) ;
//   2. valeur nue après un affichage : « console.log(x); // true » ;
//   3. expression pure suivie d'une valeur : « expr // 42 » → enveloppée dans un log.
// Une glose (« // renvoie le total ») sur une ligne SANS affichage n'est jamais un
// attendu : c'est ce qui évitait le faux positif « pure.js ».
function instrumente(code, li) {
  const pre = li.comment;
  const lignes = code.split('\n');
  const attendus = [];
  const sortie = [];
  for (let i = 0; i < lignes.length; i++) {
    const ligne = lignes[i];
    const idx = indiceCommentaire(ligne, pre);
    if (idx < 0) { sortie.push(ligne); continue; }
    const avant = ligne.slice(0, idx);
    const comment = ligne.slice(idx + pre.length);
    const codeAvant = avant.trim();

    // 1. marqueur explicite
    const att = attenduDeCommentaire(comment);
    if (att) { attendus.push(att.valeur); sortie.push(ligne); continue; }

    // 2. et 3. commentaire « nu » : n'est retenu que si c'est une valeur machine
    const valNette = nettoieAttendu(comment);
    if (estValeurMachine(valNette)) {
      if (li.estAffichage(codeAvant)) {                 // console.log(x); // true
        attendus.push(comment.trim()); sortie.push(ligne); continue;
      }
      if (codeAvant && estExpressionPure(codeAvant)) {  // expr // 42  → on l'affiche
        const indent = (avant.match(/^\s*/) || [''])[0];
        sortie.push(indent + li.wrap(codeAvant.replace(/;\s*$/, '')));
        attendus.push(comment.trim()); continue;
      }
    }
    sortie.push(ligne);                                  // commentaire inerte (glose, annotation)
  }
  return { code: sortie.join('\n'), attendus };
}

// Trouve l'index du commentaire de fin de ligne, en évitant les « // » ou « # »
// contenus dans une chaîne de caractères. Heuristique simple mais suffisante :
// on parcourt en suivant l'état « dans une chaîne ».
function indiceCommentaire(ligne, pre) {
  let dans = null; // guillemet courant
  for (let i = 0; i < ligne.length; i++) {
    const c = ligne[i];
    if (dans) {
      if (c === '\\') { i++; continue; }
      if (c === dans) dans = null;
      continue;
    }
    if (c === '"' || c === "'" || c === '`') { dans = c; continue; }
    if (pre === '//') {
      if (c === '/' && ligne[i + 1] === '/') return i;
    } else { // '#'
      if (c === '#') return i;
    }
  }
  return -1;
}

/* ------------------------------------------------------------------ */
/* Formatage de sortie — IDENTIQUE à runner.js (ce que l'apprenant voit)*/
/* ------------------------------------------------------------------ */

function fmtJs(v) {
  if (typeof v === 'string') return v;
  if (v === undefined) return 'undefined';
  if (v === null) return 'null';
  if (typeof v === 'bigint') return String(v) + 'n';   // 1099511627776n, comme un vrai console.log
  if (typeof v === 'function') return v.toString();
  try { return JSON.stringify(v); } catch (e) { return String(v); }
}

/* ------------------------------------------------------------------ */
/* Exécution JavaScript dans un contexte vm isolé                       */
/* ------------------------------------------------------------------ */

// Marqueurs d'un bloc NON exécutable tel quel dans un worker/vm (repris de runner.js
// pour rester cohérent avec ce qui reçoit — ou non — un bouton « Tester »).
const BROWSER_ONLY = /\b(document|window|localStorage|sessionStorage|alert|prompt|confirm|location|navigator|process|Buffer|__dirname|__filename|require|module|exports|globalThis)\b|node:|new Worker|postMessage|SharedArrayBuffer|Atomics|importScripts|import\s|export\s/;

// Une sortie qui change à chaque exécution ne peut pas être confrontée à une valeur
// figée : l'annonce est alors un EXEMPLE de sortie, pas une prédiction. On ne crie
// jamais « divergent » là-dessus.
const NON_DETERMINISTE = /Date\.now|Math\.random|new\s+Date|performance\.now|Date\.parse|(?:^|[^.\w])Date\s*\(|crypto\./;

// Intl et les méthodes toLocale* dépendent des données CLDR/ICU de l'environnement
// (Node embarque des locales que tel navigateur n'a pas, et inversement). Le résultat
// n'est donc pas confrontable de façon portable : on ne crie jamais « divergent ».
const DEPEND_ENV = /\bIntl\b|toLocale(?:String|DateString|TimeString|LowerCase|UpperCase)/;

function executeJs(code) {
  if (BROWSER_ONLY.test(code)) return { etat: 'skip', motif: 'API navigateur/Node ou modules ES' };
  if (NON_DETERMINISTE.test(code)) return { etat: 'skip', motif: 'sortie non déterministe (Date/Math.random)' };
  if (DEPEND_ENV.test(code)) return { etat: 'skip', motif: 'dépend de la locale/ICU (Intl, toLocale*)' };
  const sortie = [];
  const push = (args) => sortie.push(Array.prototype.slice.call(args).map(fmtJs).join(' '));
  const consoleFake = {
    log: function () { push(arguments); },
    info: function () { push(arguments); },
    debug: function () { push(arguments); },
    warn: function () { push(arguments); },
    error: function () { push(arguments); }
  };
  const sandbox = { console: consoleFake };
  sandbox.globalThis = sandbox;
  vm.createContext(sandbox);
  try {
    const script = new vm.Script(code, { filename: 'exemple.js' });
    script.runInContext(sandbox, { timeout: 2000, displayErrors: false });
    return { etat: 'ok', sortie };
  } catch (e) {
    return { etat: 'erreur', motif: (e && e.name ? e.name + ': ' + e.message : String(e)), sortie };
  }
}

/* ------------------------------------------------------------------ */
/* Exécution Python via l'interpréteur système                          */
/* ------------------------------------------------------------------ */

let PYTHON = undefined;   // résolu paresseusement : chemin de l'interpréteur ou null
function trouvePython() {
  if (PYTHON !== undefined) return PYTHON;
  for (const cand of ['python', 'python3', 'py']) {
    try {
      const r = cp.spawnSync(cand, ['--version'], { encoding: 'utf8', timeout: 5000 });
      if (r.status === 0 || /Python\s+3/.test((r.stdout || '') + (r.stderr || ''))) { PYTHON = cand; return PYTHON; }
    } catch (e) { /* suivant */ }
  }
  PYTHON = null;
  return PYTHON;
}

function executePython(code) {
  const py = trouvePython();
  if (!py) return { etat: 'skip', motif: 'interpréteur Python absent' };
  if (code.indexOf('>>>') !== -1) return { etat: 'skip', motif: 'session REPL (>>>)' };
  const tmp = path.join(os.tmpdir(), 'verif-ex-' + process.pid + '-' + Math.floor(process.hrtime.bigint() % 1000000n) + '.py');
  try {
    fs.writeFileSync(tmp, code, 'utf8');
    const r = cp.spawnSync(py, [tmp], {
      encoding: 'utf8', timeout: 5000,
      env: Object.assign({}, process.env, { PYTHONIOENCODING: 'utf-8' })
    });
    if (r.error) return { etat: 'erreur', motif: String(r.error.message), sortie: [] };
    if (r.status !== 0) {
      const err = (r.stderr || '').trim().split('\n').pop() || 'erreur';
      return { etat: 'erreur', motif: err, sortie: (r.stdout || '').replace(/\r/g, '').split('\n') };
    }
    let out = (r.stdout || '').replace(/\r/g, '');
    if (out.endsWith('\n')) out = out.slice(0, -1);
    return { etat: 'ok', sortie: out === '' ? [] : out.split('\n') };
  } catch (e) {
    return { etat: 'erreur', motif: String(e.message), sortie: [] };
  } finally {
    try { fs.unlinkSync(tmp); } catch (e) { /* rien */ }
  }
}

/* ------------------------------------------------------------------ */
/* Normalisation pour comparaison                                       */
/* ------------------------------------------------------------------ */

// Comparaison tolérante : on ignore les espaces (l'humain écrit « [2, 4, 6] »,
// JSON.stringify écrit « [2,4,6] »), et on tolère guillemets simples/doubles.
function normalise(s) {
  return String(s).replace(/\s+/g, '').replace(/'/g, '"');
}

// Forme canonique d'un objet/tableau : l'humain écrit « { x: 4, y: 5 } » (littéral
// JS, clés nues) là où JSON.stringify — utilisé par runner.js — écrit
// « {"x":4,"y":5} ». Même valeur, représentation différente : on déquote les clés
// des deux côtés pour comparer le fond, pas la forme.
function normObj(s) {
  return normalise(s).replace(/"(\w+)":/g, '$1:');
}

// Égalité numérique tolérante : l'humain écrit « 23.1 » là où l'arithmétique
// flottante affiche « 23.099999999999998 ». Même structure, nombres proches à
// l'epsilon près → même valeur. Compare la charpente (nombres remplacés par #)
// puis chaque nombre avec une tolérance relative.
function memeAuFlottantPres(a, b) {
  const reNum = /-?\d+(?:\.\d+)?(?:e[+-]?\d+)?/gi;
  const na = a.match(reNum) || [], nb = b.match(reNum) || [];
  if (a.replace(reNum, '#') !== b.replace(reNum, '#')) return false;
  if (na.length !== nb.length) return false;
  for (let i = 0; i < na.length; i++) {
    const x = parseFloat(na[i]), y = parseFloat(nb[i]);
    if (Math.abs(x - y) > 1e-9 * Math.max(1, Math.abs(x), Math.abs(y))) return false;
  }
  return na.length > 0;
}

// L'humain annote souvent sa valeur : « 6  (3 valeurs × 2) », « 42 // total ».
// On retire cette glose de fin pour ne comparer que la valeur.
function nettoieAttendu(s) {
  let t = String(s).trim();
  t = t.replace(/\s{2,}\([^)]*\)\s*$/, '').trim();     // « 6  (3 valeurs × 2) » → « 6 »
  t = t.replace(/\s+[—–]\s.*$/, '').trim();            // « true — le sous-objet… » (tiret cadratin)
  t = t.replace(/\s{2,}-\s.*$/, '').trim();            // « x  - glose » (trait d'union : 2 espaces requis)
  return t;
}

// Retire une paire de guillemets englobants : l'humain écrit « // => "abc" » là où
// console.log("abc") affiche « abc » (sans guillemets). Ce n'est pas une divergence.
function retireGuillemets(s) {
  const t = s.trim();
  if (t.length >= 2 && ((t[0] === '"' && t[t.length - 1] === '"') ||
      (t[0] === "'" && t[t.length - 1] === "'") || (t[0] === '`' && t[t.length - 1] === '`'))) {
    return t.slice(1, -1);
  }
  return t;
}

// Une valeur « machine » reconnaissable : c'est la SEULE forme d'annoncé pour
// laquelle on ose crier « divergent ». Une phrase française (« les six parties »,
// « trois nombres proches de 10000 ») est une GLOSE : on la classe « non vérifié »,
// jamais « divergent ». Prudence maximale contre les faux positifs.
function estValeurMachine(s) {
  const t = s.trim();
  if (t === '') return false;
  if (/^-?\d+(?:[.,]\d+)?(?:e[+-]?\d+)?$/i.test(t)) return true;      // nombre
  if (/^(true|false|null|undefined|NaN|-?Infinity)$/.test(t)) return true;
  if (/^[[{][\s\S]*[\]}]$/.test(t)) return true;                      // tableau / objet
  if (/^".*"$/.test(t) || /^'.*'$/.test(t) || /^`.*`$/.test(t)) return true; // chaîne citée
  if (/^\S+$/.test(t)) return true;                                   // token unique (sans espace)
  return false;                                                       // sinon : glose
}

// L'humain tronque souvent une sortie longue par une ellipse : « // => ...reçoit 3
// bonbons » ou « [1, …, 10] ». On vérifie alors que les fragments réels apparaissent
// dans l'ordre plutôt que d'exiger l'égalité.
function matchEllipse(attendu, produit) {
  const A = retireGuillemets(nettoieAttendu(attendu));
  if (!/\.\.\.|…/.test(A)) return false;
  const parts = A.replace(/\s+/g, '').split(/\.{3,}|…/).filter(Boolean);
  if (!parts.length) return false;
  const np = String(produit).replace(/\s+/g, '');
  let idx = 0;
  for (const part of parts) {
    const f = np.indexOf(part, idx);
    if (f < 0) return false;
    idx = f + part.length;
  }
  return true;
}

// Compare une valeur annoncée à une sortie réelle. Renvoie 'conforme',
// 'divergent' ou 'glose' (annoncé non machine → indécidable, donc non vérifié).
function comparePaire(attendu, produit) {
  const a = nettoieAttendu(attendu);
  const p = String(produit).trim();
  if (normalise(a) === normalise(p)) return 'conforme';
  if (normalise(retireGuillemets(a)) === normalise(p)) return 'conforme';
  if (normObj(a) === normObj(p)) return 'conforme';                 // objets : fond, pas forme
  if (memeAuFlottantPres(normObj(a), normObj(p))) return 'conforme'; // 23.1 vs 23.0999…
  if (matchEllipse(a, p)) return 'conforme';                        // troncature volontaire
  return estValeurMachine(a) ? 'divergent' : 'glose';
}

function memeSortie(attendus, produits) {
  if (attendus.length !== produits.length) return { verdict: 'compte' };
  let glose = false;
  for (let i = 0; i < attendus.length; i++) {
    const v = comparePaire(attendus[i], produits[i]);
    if (v === 'divergent') return { verdict: 'divergent', i, attendu: attendus[i], produit: produits[i] };
    if (v === 'glose') glose = true;
  }
  return { verdict: glose ? 'glose' : 'conforme' };
}

/* ------------------------------------------------------------------ */
/* Traitement d'un bloc                                                 */
/* ------------------------------------------------------------------ */

const LANGS = {
  javascript: {
    comment: '//',
    estAffichage: (s) => /console\s*\.\s*(log|info|debug|warn|error)\s*\(/.test(s),
    wrap: (expr) => 'console.log((' + expr + '));',
    exec: executeJs
  },
  python: {
    comment: '#',
    estAffichage: (s) => /(^|[^.\w])print\s*\(/.test(s),
    wrap: (expr) => 'print((' + expr + '))',
    exec: executePython
  }
};

function traite(bloc) {
  const li = LANGS[bloc.lang];
  if (!li) return null;                                  // langage non exécuté ici
  const { code: codeExec, attendus } = instrumente(bloc.code, li);
  if (!attendus.length) return null;                     // pas de valeur annoncée → hors périmètre

  const res = li.exec(codeExec);
  const base = {
    fichier: bloc.fichier, lang: bloc.lang, ligne: bloc.ligne, dataFile: bloc.dataFile,
    nAttendus: attendus.length
  };

  if (res.etat === 'skip') return Object.assign(base, { etat: 'non-verifie', raison: res.motif });
  if (res.etat === 'erreur') return Object.assign(base, { etat: 'non-verifie', raison: 'exécution : ' + res.motif });

  const cmp = memeSortie(attendus, res.sortie);
  if (cmp.verdict === 'conforme') return Object.assign(base, { etat: 'conforme' });
  if (cmp.verdict === 'glose') {
    return Object.assign(base, {
      etat: 'non-verifie',
      raison: 'glose : valeur annoncée en français, non confrontable au réel'
    });
  }
  if (cmp.verdict === 'compte') {
    return Object.assign(base, {
      etat: 'non-verifie',
      raison: 'compte : ' + res.sortie.length + ' sortie(s) produite(s) pour ' + attendus.length + ' annoncée(s)',
      produits: res.sortie, attendus: attendus
    });
  }
  // divergent
  return Object.assign(base, {
    etat: 'divergent',
    index: cmp.i, attendu: cmp.attendu, produit: cmp.produit,
    produits: res.sortie, attendusListe: attendus
  });
}

/* ------------------------------------------------------------------ */
/* Programme principal                                                  */
/* ------------------------------------------------------------------ */

function main(argv) {
  const opt = { lang: 'all', json: false, divergents: false, details: false, fichiers: [], racine: path.resolve(__dirname, '..') };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--lang') opt.lang = String(argv[++i] || 'all').toLowerCase();
    else if (a === '--json') opt.json = true;
    else if (a === '--divergents') opt.divergents = true;
    else if (a === '--details') opt.details = true;
    else if (a === '--fichier') opt.fichiers.push(path.resolve(argv[++i]));
    else if (a === '--aide' || a === '-h' || a === '--help') {
      console.log(fs.readFileSync(__filename, 'utf8').split('*/')[0].replace(/^#![^\n]*\n/, ''));
      return 0;
    } else if (!a.startsWith('--')) opt.fichiers.push(path.resolve(a));
  }
  const langsVoulus = opt.lang === 'all' ? ['javascript', 'python']
    : opt.lang === 'js' ? ['javascript'] : opt.lang === 'py' ? ['python'] : [opt.lang];

  let fichiers = opt.fichiers;
  if (!fichiers.length) fichiers = listeLecons(path.join(opt.racine, 'pages'), []).sort();

  const t0 = Date.now();
  const resultats = [];
  let nBlocs = 0, nAvecAttendu = 0;
  for (const f of fichiers) {
    let blocs;
    try { blocs = blocsDe(f); } catch (e) { continue; }
    for (const b of blocs) {
      if (!langsVoulus.includes(b.lang)) continue;
      nBlocs++;
      const r = traite(b);
      if (r) { nAvecAttendu++; resultats.push(r); }
    }
  }
  const duree = (Date.now() - t0) / 1000;

  const par = (e) => resultats.filter(r => r.etat === e);
  const divergents = par('divergent');
  const conformes = par('conforme');
  const nonVerifies = par('non-verifie');

  if (opt.json) {
    console.log(JSON.stringify({
      fichiers: fichiers.length, blocs: nBlocs, avecAttendu: nAvecAttendu,
      conformes: conformes.length, divergents: divergents.length, nonVerifies: nonVerifies.length,
      secondes: duree, resultats
    }, null, 2));
    return divergents.length ? 1 : 0;
  }

  const rel = (f) => path.relative(opt.racine, f) || f;
  console.log('Vérificateur d\'exemples — exécute et confronte la sortie annoncée au réel');
  console.log('langages : ' + langsVoulus.join(', ') + '  ·  ' + fichiers.length + ' leçon(s)  ·  ' + duree.toFixed(1) + ' s');
  if (langsVoulus.includes('python')) {
    console.log('interpréteur Python : ' + (trouvePython() || 'ABSENT — blocs Python non vérifiés'));
  }

  if (divergents.length) {
    console.log('\n=== DIVERGENT — la sortie annoncée ne correspond pas au réel (' + divergents.length + ') ===');
    for (const d of divergents) {
      console.log('\n  ' + rel(d.fichier) + ':' + d.ligne + (d.dataFile ? '  (' + d.dataFile + ')' : '') + '  [' + d.lang + ']');
      console.log('    annoncé : ' + JSON.stringify(d.attendu));
      console.log('    réel    : ' + JSON.stringify(d.produit));
      if (d.produits && d.produits.length <= 8) {
        console.log('    (sortie complète : ' + JSON.stringify(d.produits) + ')');
        console.log('    (annoncé complet : ' + JSON.stringify(d.attendusListe) + ')');
      }
    }
  }

  if (opt.details && nonVerifies.length) {
    console.log('\n=== NON VÉRIFIÉ (' + nonVerifies.length + ') — limite de l\'outil, pas un bug du contenu ===');
    const parRaison = {};
    for (const n of nonVerifies) {
      const clef = n.raison.split(':')[0].trim();
      (parRaison[clef] = parRaison[clef] || []).push(n);
    }
    for (const clef of Object.keys(parRaison).sort((a, b) => parRaison[b].length - parRaison[a].length)) {
      console.log('  · ' + clef + ' : ' + parRaison[clef].length);
    }
  }

  console.log('\n=== RÉSUMÉ ===');
  console.log('  blocs ' + langsVoulus.join('/') + ' analysés ......... ' + nBlocs);
  console.log('  dont porteurs d\'une valeur attendue . ' + nAvecAttendu);
  console.log('  · conformes ......................... ' + conformes.length);
  console.log('  · DIVERGENTS ........................ ' + divergents.length);
  console.log('  · non vérifiés ...................... ' + nonVerifies.length +
    '  (fragments, API, async, erreurs — ' + (opt.details ? 'détail ci-dessus' : 'voir --details') + ')');
  console.log('  durée ............................... ' + duree.toFixed(1) + ' s');
  if (!divergents.length) console.log('\n  Aucune divergence : toutes les sorties exécutables correspondent à ce qui est annoncé.');
  else console.log('\n  ⚠ ' + divergents.length + ' exemple(s) affichent une sortie fausse à l\'apprenant. À corriger.');

  return divergents.length ? 1 : 0;
}

if (require.main === module) process.exitCode = main(process.argv.slice(2));
module.exports = { blocsDe, instrumente, executeJs, comparePaire, LANGS, decode };
