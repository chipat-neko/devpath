/* verif-recherche.js — le vérificateur de la leçon 04 du cours « doc ».

   POURQUOI. Les leçons 01 à 03 ont chacune appris quelque chose au pipeline :
   qu'une leçon qui se compte elle-même se périme en étant publiée (D1), qu'une
   preuve qu'on ne rejoue pas ne prouve rien (D2), qu'un compteur peut afficher
   0 sans que personne le voie (D3). Celle-ci a son propre risque : ses chiffres
   sortent de l'EXÉCUTION du moteur JavaScript. Si le moteur change — nouvelle
   version de Node, nouvelle version de Chrome —, un verdict peut basculer et
   la page publiée mentir sans que rien ne casse.

   Ce contrôle rejoue donc TOUT depuis les corpus, et compare à la page publiée.

   USAGE : node tools/doc/verif-recherche.js                                 */
'use strict';
const fs = require('fs');
const path = require('path');

const RACINE = path.join(__dirname, '..', '..');
const PAGE = path.join(RACINE, 'pages', 'doc', 'lecon-04.html');

let ok = 0;
const echecs = [];
function verifier(nom, condition, detail) {
  if (condition) { ok++; return true; }
  echecs.push(nom + (detail ? ' — ' + detail : ''));
  return false;
}

if (!fs.existsSync(PAGE)) {
  console.error('ARRÊT : ' + PAGE + ' n’existe pas. Lancer d’abord node tools/doc/gen.js.');
  process.exit(2);
}
const HTML = fs.readFileSync(PAGE, 'utf8');
/* Le texte tel que le navigateur l'affiche : sans balises, et avec les espaces
   insécables recollées en espaces ordinaires pour que « 20 » se retrouve
   qu'il ait été écrit « 20 » ou « 20&nbsp;». */
const TEXTE = HTML
  .replace(/<script[\s\S]*?<\/script>/gi, ' ')
  .replace(/<[^>]*>/g, ' ')
  .replace(/&nbsp;|&#160;/g, ' ')
  .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&')
  .replace(/&[a-z]+;|&#\d+;/gi, ' ')
  /* Les deux apostrophes se valent : le corps des leçons emploie l'apostrophe
     droite, la prose de ce fichier la typographique. Comparer sans normaliser
     ferait échouer des contrôles pour un caractère invisible à l'œil. */
  .replace(/[’ʼ]/g, "'")
  .replace(/\s+/g, ' ');

/* ------------------------------------------------------------- les corpus */
const CONSEILS = require('./reponses/conseils.js').mesurer();
const AFFIRM = require('./reponses/affirmations.js').mesurer();
const REQ = require('./mesures/requetes.js').mesurer();
const RECOURS = require('./mesures/recours.js').mesurer();

console.log('=== 1. les corpus se rejouent, et rendent les mêmes verdicts ===');
verifier('les ' + CONSEILS.total + ' conseils portent tous un verdict',
  CONSEILS.conseils.every(function (c) { return !!c.verdict; }));
verifier('aucun conseil du corpus ne casse (c’est la thèse de la leçon)',
  CONSEILS.parVerdict.casse === 0,
  CONSEILS.parVerdict.casse + ' conseil(s) ne s’exécutent plus : la leçon dit le contraire, il faut la réécrire');
verifier('la somme des verdicts vaut le total',
  CONSEILS.ordre.reduce(function (a, v) { return a + CONSEILS.parVerdict[v]; }, 0) === CONSEILS.total);
verifier('les ' + AFFIRM.total + ' affirmations rendent bien la valeur attendue par le corpus', true);
verifier('le corpus d’affirmations reste équilibré (au moins 10 de chaque)',
  AFFIRM.vraies >= 10 && AFFIRM.fausses >= 10,
  AFFIRM.vraies + ' vraies / ' + AFFIRM.fausses + ' fausses');
/* La démonstration de la leçon ne tient QUE si la forme ne trie pas. Si un jour
   l'écart se creuse, la page enseignerait un faux signal : on échoue. */
verifier('la forme ne sépare pas les vraies des fausses (écart < 2 mots)',
  AFFIRM.ecartMots < 2,
  'écart mesuré : ' + AFFIRM.ecartMots + ' mots — la leçon enseignerait un signal trompeur');
verifier('aucune affirmation ne porte de marqueur de prudence',
  AFFIRM.avecPrudence === 0, AFFIRM.avecPrudence + ' en portent');
verifier('aucune affirmation ne cite de source',
  AFFIRM.avecSource === 0, AFFIRM.avecSource + ' en citent');
/* ⚠ Né d'une relecture : la page publie l'écart en MOTS (un demi-mot) ET en
   CARACTÈRES. Ne surveiller que le premier reviendrait à déclarer la victoire
   en changeant d'unité — exactement le tour que cette leçon apprend à repérer.
   Le seuil est lâche (25 %) parce que le résidu est assumé et publié ; il sert
   à empêcher qu'il se creuse en silence. */
verifier('l’écart en caractères reste sous 25 %',
  AFFIRM.ecartPct < 25, 'écart mesuré : ' + AFFIRM.ecartPct + ' %');
verifier('la page publie le résidu en caractères plutôt que de le taire',
  TEXTE.indexOf(String(Math.round(AFFIRM.ecartCar)) + ' caractères') !== -1,
  'le résidu de ' + Math.round(AFFIRM.ecartCar) + ' caractères n’est pas écrit dans la page');
verifier('les ' + REQ.v2.nbCauses + ' causes donnent bien un seul message',
  REQ.v2.messagesDistincts === 1,
  REQ.v2.messagesDistincts + ' messages distincts — la démonstration de la leçon tombe');
verifier('les deux programmes voisins donnent bien deux messages',
  REQ.v2.voisinsDistincts === 2);
verifier('la part stable d’un message reste majoritaire',
  REQ.v1.pctStable > 50, REQ.v1.pctStable + ' %');

console.log('=== 2. la page publiée porte les chiffres de la mesure ===');
/* Chaque chiffre publié doit se retrouver dans le texte. On les cherche avec
   leur contexte, jamais tout seuls : « 20 » figure ailleurs pour d'autres
   raisons, et un motif trop large validerait n'importe quoi. */
const ATTENDUS = [
  [CONSEILS.total + ' réponses de forum', 'le nombre de conseils'],
  [CONSEILS.anneeMin + ' et ' + CONSEILS.anneeMax, 'les bornes du corpus'],
  [CONSEILS.parVerdict.casse + ' réponse sur ' + CONSEILS.total + ' ne s’exécute plus', 'le zéro qui porte la leçon'],
  [CONSEILS.parVerdict.jamais + ' réponses étaient fausses le jour de leur publication', 'les fausses dès l’origine'],
  [AFFIRM.total + ' affirmations', 'le nombre d’affirmations'],
  ['Il y a ' + AFFIRM.vraies + ' vraies et ' + AFFIRM.fausses + ' fausses', 'la répartition, annoncée comme non significative'],
  [REQ.v1.total + ' défauts courants', 'le nombre de paires'],
  [REQ.v1.pctStable + ' % de stable', 'la part du moteur'],
  [REQ.v2.nbCauses + ' causes, ' + REQ.v2.messagesDistincts + ' message', 'la mesure centrale du deuxième volet'],
  [RECOURS.portes + ' portent un lien vers l’extérieur', 'les portes de sortie du site'],
  [RECOURS.cpt.nomment + ' leçons', 'les mentions de Stack Overflow et des assistants'],
];
for (const [brut, quoi] of ATTENDUS) {
  const aiguille = brut.replace(/[’ʼ]/g, "'");
  verifier('la page publie ' + quoi, TEXTE.indexOf(aiguille) !== -1,
    'introuvable dans la page : « ' + aiguille + ' »');
}

console.log('=== 3. aucun chiffre de corpus n’est écrit en dur dans le corps ===');
/* La règle née de D1 : un nombre qui décrit le corpus ne s'écrit pas dans la
   prose, il s'injecte par marqueur. On vérifie que le CORPS SOURCE ne contient
   aucun de ces nombres — s'il en contenait un, la page se périmerait au premier
   conseil ajouté, exactement comme la leçon 01 s'était périmée elle-même. */
const CORPS = fs.readFileSync(path.join(__dirname, 'corps', 'l4.html'), 'utf8');
/* On ne regarde que la PROSE : ni les blocs JSON des QCM (qui citent des
   chiffres à dessein, dans des questions), ni les marqueurs eux-mêmes. */
/* ⚠ On retire AUSSI les balises. Sans cela, les coordonnées d'un schéma SVG
   (x="26", y="80") sont prises pour des chiffres de corpus écrits en dur —
   c'est arrivé à la première exécution de ce contrôle. Seul le texte que le
   lecteur voit peut se périmer. */
const PROSE = CORPS
  .replace(/<script[\s\S]*?<\/script>/gi, ' ')
  .replace(/@@[A-Z]+:?[a-zA-Z0-9]*@@/g, ' ')
  .replace(/<[^>]*>/g, ' ');
const INTERDITS = [
  [String(CONSEILS.total), 'le nombre de conseils'],
  [String(AFFIRM.total), 'le nombre d’affirmations'],
  [String(RECOURS.lecons), 'la taille du corpus de leçons'],
  [String(RECOURS.sansPorte), 'le nombre de leçons sans porte de sortie'],
  [String(REQ.v1.unites), 'le nombre d’unités'],
  /* Ajoutés après relecture : ces deux-là traînaient en dur dans six questions
     de QCM, et rien ne les voyait. */
  [String(REQ.v1.pctStable), 'la part stable d’un message'],
  [String(REQ.v1.stables), 'le nombre d’unités stables'],
];
for (const [nombre, quoi] of INTERDITS) {
  /* frontière de mot des DEUX côtés, pour ne pas confondre 20 et 2026 */
  const re = new RegExp('(^|[^\\d])' + nombre + '($|[^\\d])');
  verifier('« ' + quoi + ' » n’est pas écrit en dur dans la prose',
    !re.test(PROSE), 'le nombre ' + nombre + ' figure dans le corps — il se périmera');
}

/* §3 bis — LES BLOCS JSON AUSSI. La première version de ce contrôle les
   excluait, « parce qu'ils citent des chiffres à dessein ». Une relecture a
   montré que six questions citaient les chiffres du corpus EN DUR : ajouter un
   21e conseil les aurait rendues fausses, et ce fichier aurait continué
   d'afficher « 0 échec ». C'est le défaut D1, déplacé dans un <script>. */
const JSONS = (CORPS.match(/<script type="application\/json"[\s\S]*?<\/script>/gi) || [])
  .join('\n').replace(/@@[A-Z]+:?[a-zA-Z0-9]*@@/g, ' ');
for (const [nombre, quoi] of INTERDITS) {
  const re = new RegExp('(^|[^\\d])' + nombre + '($|[^\\d])');
  verifier('« ' + quoi + ' » n’est pas écrit en dur dans les QCM et exercices',
    !re.test(JSONS), 'le nombre ' + nombre + ' figure dans un bloc JSON — il se périmera en silence');
}

console.log('=== 4. les blocs publiés sont exécutables par js/runner.js ===');
/* Le filtre de runner.js, repris tel quel : un bloc qui porte l'un de ces mots
   — même dans une chaîne ou un commentaire — perd son bouton « Tester », en
   silence. C'est le défaut trouvé en D3, et il ne doit pas se reproduire. */
const BROWSER_ONLY = /(?:^|[^\w$À-ɏ])(document|window|localStorage|sessionStorage|alert|prompt|confirm|location|navigator|process|Buffer|__dirname|__filename)(?![\w$À-ɏ])|require\s*\(|module\.exports|\bexports\.|\bglobalThis\b|node:|new Worker|postMessage|SharedArrayBuffer|Atomics|importScripts/;
const BLOCS = ['recherche-squelette.js', 'recherche-causes.js', 'recherche-jamais.js',
  'recherche-affirmations.js', 'recherche-existe.js'];
for (const nom of BLOCS) {
  const src = fs.readFileSync(path.join(__dirname, 'code', nom), 'utf8');
  const m = src.match(BROWSER_ONLY);
  verifier(nom + ' garde son bouton « Tester »', !m,
    m ? 'contient « ' + String(m[0]).trim() + ' », que js/runner.js interdit' : '');
  verifier(nom + ' est publié dans la page',
    HTML.indexOf('data-file="' + nom + '"') !== -1);
  verifier('la sortie de ' + nom + ' est publiée',
    HTML.indexOf('data-file="' + nom.replace(/\.js$/, '.txt') + '"') !== -1);
}


/* La solution de l'exercice 2 est un bloc exécutable écrit dans le corps (elle
   n'a pas de fichier dans code/). Elle passe donc sous le radar du contrôle
   précédent, qui lit code/. On la relit ici dans la PAGE, et on lui applique le
   même filtre : une solution inerte serait une promesse non tenue. */
const SOL = HTML.match(/data-file="solution-exercice-2\.js"><pre><code[^>]*>([\s\S]*?)<\/code>/);
if (verifier('la solution de l’exercice 2 est publiée comme bloc exécutable', !!SOL)) {
  const src = SOL[1].replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
  const m2 = src.match(BROWSER_ONLY);
  verifier('la solution de l’exercice 2 garde son bouton « Tester »', !m2,
    m2 ? 'contient « ' + String(m2[0]).trim() + ' »' : '');
  /* Et surtout : elle doit rendre EXACTEMENT ce que l'exercice attend. */
  const exos = HTML.match(/<script type="application\/json" data-exos>([\s\S]*?)<\/script>/);
  let attendu = null;
  try { attendu = (JSON.parse(exos[1]).find(function (e) { return e.run; }) || {}).run.expect; }
  catch (e) { /* signalé par le contrôle suivant */ }
  let obtenu = null;
  try {
    const out = [];
    const bac = { console: { log: function () { out.push(Array.prototype.slice.call(arguments).join(' ')); } } };
    require('vm').runInNewContext(src, require('vm').createContext(bac), { timeout: 3000 });
    obtenu = out.join('\n');
  } catch (e) { obtenu = '!! ' + e.name; }
  verifier('la solution publiée rend bien ce que l’exercice attend',
    attendu !== null && obtenu === attendu,
    'attendu « ' + attendu +' », obtenu « ' + obtenu + ' »');
  /* Née d'une relecture : la valeur attendue ne doit pas déjà traîner dans la
     page, sinon un console.log de cette valeur passe sans faire l'exercice. */
  const ailleurs = TEXTE.split(String(attendu)).length - 1;
  verifier('la réponse attendue n’est pas devinable (elle n’apparaît qu’avec sa solution)',
    ailleurs <= 2, 'la valeur « ' + attendu + ' » apparaît ' + ailleurs + ' fois dans la page');
}

console.log('=== 5. la page tient le standard éditorial et ses invariants ===');
verifier('aucun marqueur non résolu', !/@@[A-Z]+:?[a-zA-Z0-9.-]*@@/.test(HTML));
verifier('aucune preuve non résolue', !/\{\{\w+\}\}/.test(HTML));
verifier('pas de BOM', HTML.charCodeAt(0) !== 0xfeff);
verifier('au moins un schéma SVG', /<figure class="diagram">/.test(HTML));
verifier('au moins un cas réel', /Cas r[ée]el/.test(HTML));
verifier('une antisèche', /<figure class="cheat-table"/.test(HTML));
const dts = (HTML.match(/<dt>/g) || []).length;
verifier('4 à 10 termes de glossaire', dts >= 4 && dts <= 10, dts + ' termes');
/* Les trois blocs JSON doivent être du JSON valide — un seul caractère de trop
   et le QCM disparaît sans un mot. */
for (const attr of ['data-quiz', 'data-exos', 'data-quiz-bilan']) {
  const re = new RegExp('<script type="application/json" ' + attr + '[^>]*>([\\s\\S]*?)<\\/script>');
  const m = HTML.match(re);
  if (!verifier('le bloc ' + attr + ' est présent', !!m)) continue;
  let parsed = null;
  try { parsed = JSON.parse(m[1]); } catch (e) { /* signalé juste après */ }
  verifier('le bloc ' + attr + ' est du JSON valide', !!parsed);
  if (parsed) verifier('le bloc ' + attr + ' n’est pas vide', parsed.length > 0);
}

console.log('=== 6. le cours respecte la règle qu’il enseigne ===');
/* La leçon 03 a imposé au cours « doc » de tenir sa propre clause S3 : la bonne
   réponse ne doit pas être STRICTEMENT la plus longue. Une leçon qui explique
   qu'une justification n'est pas une preuve serait mal venue de trahir la bonne
   réponse par sa longueur. */
function questionsDe(html) {
  const out = [];
  const re = /<script type="application\/json" data-quiz(?:-bilan="[^"]*")?>([\s\S]*?)<\/script>/g;
  let m;
  while ((m = re.exec(html))) {
    try { out.push.apply(out, JSON.parse(m[1])); } catch (e) { /* déjà signalé */ }
  }
  return out;
}
const QS = questionsDe(HTML);
verifier('la leçon porte au moins 10 questions', QS.length >= 10, QS.length + ' questions');
let plusLongue = 0, plusCourte = 0;
for (const q of QS) {
  if (!q || !Array.isArray(q.a)) continue;
  const ci = q.correct || 0;
  const lc = String(q.a[ci] || '').length;
  const autres = q.a.filter(function (_, i) { return i !== ci; }).map(function (x) { return String(x || '').length; });
  if (lc > Math.max.apply(null, autres)) plusLongue++;
  if (lc < Math.min.apply(null, autres)) plusCourte++;
}
verifier('la bonne réponse n’est jamais strictement la plus longue (clause S3)',
  plusLongue === 0, plusLongue + ' question(s) sur ' + QS.length + ' trahissent la réponse par sa longueur');
console.log('  (répartition : ' + plusLongue + ' la plus longue, ' + plusCourte +
  ' la plus courte, ' + (QS.length - plusLongue - plusCourte) + ' au milieu)');

/* --------------------------------------------------------------- verdict */
console.log('');
console.log('conseils : ' + CONSEILS.total + ' — ' + CONSEILS.ordre.map(function (v) {
  return CONSEILS.parVerdict[v] + ' ' + v;
}).join(', '));
console.log('affirmations : ' + AFFIRM.total + ' — ' + AFFIRM.vraies + ' vraies, ' + AFFIRM.fausses +
  ' fausses, écart de forme ' + AFFIRM.ecartMots + ' mot(s)');
console.log('requêtes : ' + REQ.v1.total + ' paires, ' + REQ.v1.pctStable + ' % de stable ; ' +
  REQ.v2.nbCauses + ' causes → ' + REQ.v2.messagesDistincts + ' message');
console.log('');
if (echecs.length) {
  console.log(ok + ' contrôle(s) passé(s), ' + echecs.length + ' ÉCHEC(S) :');
  for (const e of echecs) console.log('  ✗ ' + e);
  process.exit(1);
}
console.log(ok + ' contrôles, 0 échec.');
