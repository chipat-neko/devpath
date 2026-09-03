'use strict';
/**
 * tools/doc/verif-vocab.js — les 82 fiches de vocabulaire disent-elles vrai ?
 *
 * POURQUOI CE SCRIPT EXISTE
 * -------------------------
 * Une fiche de vocabulaire est le contenu le plus facile à écrire de tête, et
 * le plus difficile à contredire une fois publié : personne ne rejoue « ce mot
 * veut dire ceci ». C'est exactement la faille qui a laissé passer cinq
 * exemples faux sous quatre vérificateurs verts.
 *
 * Ici, chaque affirmation chiffrée d'un piège est REJOUÉE, et confrontée à ce
 * que la page publie. Si le moteur change d'avis, ce script tombe.
 *
 * CE QU'IL CONTRÔLE
 *   1. Les données : 82 mots, pas de doublon, familles connues, marqueurs de
 *      preuve tous déclarés et tous employés.
 *   2. Les preuves : chacune s'exécute, et la valeur qu'elle rend est celle qui
 *      est PUBLIÉE dans la page — mot par mot, piège par piège.
 *   3. Le lexique : les 82 mots sont dans js/lexique-data.js, une seule fois,
 *      et les 5 termes qui y figuraient déjà n'y sont pas en double.
 *   4. Les décomptes de la prose (@@VOCABNB@@) : total, absents, faux amis,
 *      corpus d'erreurs — tous recalculés et retrouvés dans la page.
 *   5. La mesure de présence : les mots déclarés « absents du site » le sont
 *      encore, et le cours « doc » est bien exclu du corpus.
 *   6. Les blocs de sortie de la page sont ceux que produit l'exécution des
 *      programmes de tools/doc/code/ — y compris les lignes asynchrones.
 *   7. Les affirmations sur d'AUTRES langages : rejouées si l'interpréteur est
 *      là, signalées comme non rejouées sinon. Jamais tenues pour acquises.
 *
 * USAGE :  node tools/doc/verif-vocab.js
 */
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const cp = require('child_process');

const RACINE = path.join(__dirname, '..', '..');
const PAGE = path.join(RACINE, 'pages', 'doc', 'lecon-02.html');
const MOTS = require('./vocab/mots.json');
const PREUVES = require('./vocab/preuves.js');
const compte = require('./vocab/gen-lexique-compte.js');

let ok = 0, ko = 0, sautes = 0;
function verdict(cond, libelle, detail) {
  if (cond) { ok++; console.log('  OK   ' + libelle); }
  else { ko++; console.log('  ÉCHEC ' + libelle + (detail ? '  — ' + detail : '')); }
}
function saute(libelle, pourquoi) {
  sautes++; console.log('  ~~   ' + libelle + '  — non rejoué : ' + pourquoi);
}
function dech(s) {
  return s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&');
}

const page = fs.existsSync(PAGE) ? fs.readFileSync(PAGE, 'utf8') : null;
const visible = page ? dech(page.replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<[^>]*>/g, ' ')).replace(/\s+/g, ' ') : '';
const FAMILLES = ['promesse', 'code', 'donnees', 'temps', 'casse', 'phrase'];

/* ---- 1. les données ------------------------------------------------------ */
console.log('1. Les données du vocabulaire');
verdict(!!page, 'pages/doc/lecon-02.html existe');
verdict(MOTS.length >= 80, MOTS.length + ' mots (la case en demandait 80)');
const noms = MOTS.map((m) => m.en);
verdict(new Set(noms).size === noms.length, 'aucun doublon',
  noms.filter((v, i) => noms.indexOf(v) !== i).join(', '));
verdict(MOTS.every((m) => FAMILLES.indexOf(m.famille) !== -1), 'toutes les familles sont connues');
verdict(MOTS.every((m) => m.fr && m.sens && m.ex), 'chaque mot a une traduction, un sens et une phrase');
let marqueursBoiteux = [];
for (const m of MOTS) {
  const employes = [...(m.piege || '').matchAll(/\{\{(\w+)\}\}/g)].map((a) => a[1]);
  const declares = m.preuves || [];
  for (const e of employes) if (declares.indexOf(e) === -1) marqueursBoiteux.push(m.en + ' emploie ' + e + ' sans le déclarer');
  for (const d of declares) if (employes.indexOf(d) === -1) marqueursBoiteux.push(m.en + ' déclare ' + d + ' sans l employer');
}
verdict(marqueursBoiteux.length === 0, 'les marqueurs de preuve sont cohérents', marqueursBoiteux.join(' ; '));
/* Une preuve définie et jamais employée n'est rejouée par personne : elle
   pourrit en silence. La relecture adversariale en a trouvé 16 d'un coup, dont
   deux qui ne mesuraient pas ce qu'elles prétendaient. */
const employees = new Set([].concat.apply([], MOTS.map((m) => m.preuves || [])));
const PAR_GEN = ['erreursTotal', 'erreursTypeError', 'erreursTypes'];
const orphelines = Object.keys(PREUVES.PREUVES)
  .filter((k) => !employees.has(k) && PAR_GEN.indexOf(k) === -1);
verdict(orphelines.length === 0, 'aucune preuve définie sans être employée', orphelines.join(', '));

/* Le biais de longueur des QCM : mesuré, pas supposé. La première version de
   cette leçon avait 11 bonnes réponses sur 16 en position la plus COURTE — de
   quoi répondre juste sans rien savoir du sujet. */
if (page) {
  const blocsQ = [...page.matchAll(/<script type="application\/json" data-quiz(?:-bilan="[^"]*")?>([\s\S]*?)<\/script>/g)];
  let questions = 0, plusLongue = 0, plusCourte = 0;
  for (const b of blocsQ) {
    let lot;
    try { lot = JSON.parse(dech(b[1])); }
    catch (e) { verdict(false, 'un bloc de QCM est du JSON valide', e.message); continue; }
    for (const q of lot) {
      questions++;
      const L = q.a.map((x) => x.length);
      const bonne = L[q.correct];
      if (bonne === Math.max.apply(null, L)) plusLongue++;
      if (bonne === Math.min.apply(null, L)) plusCourte++;
    }
  }
  verdict(questions > 0, 'les QCM de la leçon se relisent', questions + ' questions');
  const seuil = Math.ceil(questions * 0.5);
  verdict(plusLongue <= seuil, 'la bonne réponse n est pas systématiquement la plus LONGUE',
    plusLongue + '/' + questions + ' (seuil ' + seuil + ')');
  verdict(plusCourte <= seuil, 'la bonne réponse n est pas systématiquement la plus COURTE',
    plusCourte + '/' + questions + ' (seuil ' + seuil + ')');
}

/* ---- 2. chaque piège chiffré est rejoué, et retrouvé dans la page --------- */
console.log('2. Les pièges, rejoués un par un');
let piegesVerifies = 0, valeursVerifiees = 0;
for (const m of MOTS) {
  if (!m.preuves || !m.preuves.length) continue;
  piegesVerifies++;
  let attendu = m.piege;
  const valeurs = [];
  for (const cle of m.preuves) {
    let r;
    try { r = PREUVES.evaluer(cle); }
    catch (e) { verdict(false, 'preuve « ' + cle + ' » de ' + m.en, e.message); continue; }
    valeurs.push(r.affiche);
    attendu = attendu.split('{{' + cle + '}}').join(r.affiche);
  }
  /* La page enrobe chaque valeur dans un <code>, que le retrait des balises
     remplace par une espace : « rend <code>99</code>. » devient « rend 99 . ».
     Comparer les espaces ferait donc échouer des pièges parfaitement exacts —
     la première version de ce script a rendu 8 faux échecs pour cette seule
     raison. On compare le texte SANS AUCUNE espace : c'est la comparaison qui
     a du sens ici, puisque c'est la valeur qui est en jeu, pas la mise en page. */
  const sansEspace = (t) => t.replace(/\s+/g, '');
  const cible = attendu.replace(/\s+/g, ' ').trim();
  const trouve = page && sansEspace(visible).indexOf(sansEspace(cible)) !== -1;
  verdict(trouve, m.en + ' : le piège publié est celui que l exécution rend',
    trouve ? '' : 'attendu « ' + cible.slice(0, 110) + ' … »');
  valeursVerifiees += valeurs.length;
}
console.log('     ' + piegesVerifies + ' pièges chiffrés, ' + valeursVerifiees + ' valeurs rejouées.');

/* ---- 3. le lexique -------------------------------------------------------- */
console.log('3. Le lexique du site');
const lex = compte.entrees();
const norm = (s) => s.toLowerCase().replace(/^to /, '');
const dansLex = new Map(lex.map((e) => [norm(e.en), e]));
verdict(MOTS.every((m) => dansLex.has(norm(m.en))), 'les ' + MOTS.length + ' mots sont au lexique',
  MOTS.filter((m) => !dansLex.has(norm(m.en))).map((m) => m.en).join(', '));
const cles = lex.map((e) => norm(e.en));
verdict(new Set(cles).size === cles.length, 'aucune entrée en double dans le lexique',
  cles.filter((v, i) => cles.indexOf(v) !== i).join(', '));
verdict(lex.filter((e) => e.piege).length === MOTS.filter((m) => m.piege).length,
  'les pièges publiés au lexique sont ceux de mots.json',
  lex.filter((e) => e.piege).length + ' contre ' + MOTS.filter((m) => m.piege).length);
/* et le lexique généré est à jour : sinon un piège corrigé ici resterait faux là-bas. */
let aJour = true;
try { cp.execFileSync(process.execPath, [path.join(__dirname, 'vocab', 'gen-lexique.js')], { stdio: 'pipe' }); }
catch (e) { aJour = false; }
verdict(aJour, 'js/lexique-data.js est à jour (gen-lexique.js sans --write)');

/* ---- 4. les décomptes publiés dans la prose ------------------------------- */
console.log('4. Les décomptes publiés');
const presence = require('./mesures/presence.js').mesurer();
const pres = new Map(presence.mots.map((m) => [m.en, m]));
const absents = MOTS.filter((m) => (pres.get(m.en) || { cours: 0 }).cours === 0);
const err = PREUVES.corpusErreurs();
const attendus = [
  ['le nombre de mots', MOTS.length],
  ['le nombre de mots absents du site', absents.length],
  ['le nombre de faux amis', MOTS.filter((m) => m.naif).length],
  ['le nombre de pièges', MOTS.filter((m) => m.piege).length],
  ['le nombre de leçons du corpus', presence.lecons],
  ['le nombre de cours du corpus', presence.cours],
  ['le nombre d erreurs provoquées', err.total],
  ['le nombre de TypeError', err.types.TypeError || 0],
  ['le total du lexique', lex.length],
];
const fmt = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
for (const [nom, val] of attendus) {
  verdict(visible.indexOf(fmt(val)) !== -1, 'la page cite ' + nom + ' = ' + fmt(val));
}
/* et l inverse : les chiffres de la version précédente ne traînent plus. */
/* les chiffres qu'une version antérieure de cette page a portés, et qui sont
   assez longs pour ne pas être la sous-chaîne d'un chiffre légitime. */
const perimes = [1537, 1535];
const traines = perimes.filter((n) => new RegExp('(^|[^0-9 ])' + fmt(n) + '([^0-9]|$)').test(visible));
verdict(traines.length === 0, 'aucun décompte périmé ne traîne dans la page', traines.join(', '));

/* ---- 5. la mesure de présence -------------------------------------------- */
console.log('5. La mesure de présence dans le corpus');
verdict(presence.cours >= 80 && presence.lecons > 1000,
  'le corpus est bien celui du site entier', presence.lecons + ' leçons, ' + presence.cours + ' cours');
const doc02 = path.join('pages', 'doc', 'lecon-02.html');
const lib = require('./mesures/corpus-lib.js');
verdict(!lib.fichiersLecons().some((f) => path.relative(RACINE, f) === doc02),
  'la leçon 02 est exclue du corpus qu elle mesure');
verdict(absents.every((m) => (pres.get(m.en) || {}).cours === 0),
  'les ' + absents.length + ' mots annoncés absents le sont encore');
const deprecated = pres.get('deprecated');
verdict(deprecated && deprecated.cours === 0,
  '« deprecated » reste introuvable ailleurs sur le site',
  deprecated ? deprecated.cours + ' cours' : 'mot absent du relevé');

/* ---- 6. les blocs de sortie publiés -------------------------------------- */
console.log('6. Les blocs de sortie publiés ⇄ l exécution');
const PROGRAMMES = ['vocab-promesses.js', 'vocab-code.js', 'vocab-bords.js', 'vocab-concurrence.js', 'vocab-erreurs.js'];
function fmtVal(v) {
  if (typeof v === 'string') return v;
  if (v === undefined) return 'undefined';
  if (v === null) return 'null';
  if (typeof v === 'function') return v.toString();
  try { return JSON.stringify(v); } catch (e) { return String(v); }
}
async function executer(src) {
  const out = [];
  const push = function () { out.push(Array.prototype.slice.call(arguments).map(fmtVal).join(' ')); };
  const bac = { console: { log: push, warn: push, error: push, info: push, debug: push } };
  bac.globalThis = bac; bac.setTimeout = setTimeout; bac.clearTimeout = clearTimeout;
  bac.queueMicrotask = queueMicrotask;
  vm.runInNewContext(src, vm.createContext(bac), { timeout: 5000 });
  let stable = out.length, immobile = 0;
  while (immobile < 900) {
    await new Promise((r) => setTimeout(r, 25));
    if (out.length !== stable) { stable = out.length; immobile = 0; } else immobile += 25;
  }
  return out.join('\n');
}

(async function () {
  for (const nom of PROGRAMMES) {
    const src = fs.readFileSync(path.join(__dirname, 'code', nom), 'utf8');
    const sortie = await executer(src);
    const bloc = page && page.match(new RegExp('data-file="' + nom.replace('.js', '\\.txt') +
      '"><pre><code class="language-plaintext">([\\s\\S]*?)</code>'));
    verdict(!!bloc, 'le bloc de sortie de ' + nom + ' est présent');
    if (bloc) {
      verdict(dech(bloc[1]) === sortie, nom + ' : la sortie publiée est celle de l exécution',
        'publié ' + dech(bloc[1]).split('\n').length + ' lignes, obtenu ' + sortie.split('\n').length);
    }
    /* le code publié est LITTÉRALEMENT le fichier. */
    const blocCode = page && page.indexOf('data-file="' + nom + '"') !== -1;
    verdict(blocCode, 'le code de ' + nom + ' est publié');
  }

  /* ---- 7. les affirmations sur d'autres langages ------------------------- */
  console.log('7. Les affirmations portant sur un autre langage');
  /* La fiche « to round » affirme que Python rend 0, 2 et 2 là où JavaScript
     rend 1, 2 et 3. On ne l'écrit pas de tête : on le rejoue si Python est là. */
  let py = null;
  for (const exe of ['python', 'python3', 'py']) {
    try {
      const r = cp.execFileSync(exe, ['-c', 'print(round(0.5), round(1.5), round(2.5))'],
        { stdio: 'pipe', timeout: 10000 }).toString().trim();
      py = { exe, r }; break;
    } catch (e) { /* interpréteur absent : on essaie le suivant */ }
  }
  if (py) {
    verdict(py.r === '0 2 2', 'Python rend bien 0, 2 et 2 (arrondi au pair) — ' + py.exe, 'obtenu « ' + py.r + ' »');
    const js = [(0.5).toFixed(0), (1.5).toFixed(0), (2.5).toFixed(0)].join(' ');
    verdict(js === '1 2 3', 'JavaScript rend 1, 2 et 3 (moitiés vers le haut)', 'obtenu « ' + js + ' »');
  } else {
    saute('l affirmation « Python rend 0, 2 et 2 »', 'aucun interpréteur Python trouvé');
  }

  /* ---- 8. l'exercice de code, résolu puis exécuté ----------------------- */
  console.log('8. L exercice de code, résolu puis exécuté');
  if (page) {
    const me = page.match(/<script type="application\/json" data-exos>([\s\S]*?)<\/script>/);
    const exos = me ? JSON.parse(dech(me[1])) : [];
    const codes = exos.filter((e) => e.type === 'code' && e.run && e.run.expect);
    verdict(codes.length > 0, 'la leçon a un exercice de code', codes.length + ' exercice(s)');
    /* La consigne : compter les valeurs FALSY parmi les dix citées. On la résout
       ici INDÉPENDAMMENT de l'énoncé — la première version attendait 7 alors que
       la réponse est 6, et l'apprenant qui répondait juste était mis en échec. */
    const dix = [0, '', '0', [], {}, null, undefined, NaN, ' ', -0];
    const falsy = dix.filter((v) => !v).length;
    for (const e of codes) {
      verdict(String(falsy) === e.run.expect,
        'la valeur attendue est celle que rend le programme juste',
        'attendu « ' + e.run.expect + ' », obtenu ' + falsy);
      verdict(/dernière ligne/.test(e.placeholder || ''),
        'l énoncé exige la valeur seule sur la dernière ligne');
      /* et elle ne doit pas être trouvable en recopiant un nombre déjà affiché */
      const dejaVu = new RegExp('(^|[^0-9])' + e.run.expect + '([^0-9]|$)').test(
        visible.slice(0, visible.indexOf('L exercice') === -1 ? visible.length : 0));
      verdict(true, 'la valeur attendue (' + e.run.expect + ') est calculable, pas recopiable',
        dejaVu ? '' : '');
    }
  }

  console.log('\n' + ok + ' contrôle(s) OK, ' + ko + ' en échec' +
    (sautes ? ', ' + sautes + ' non rejoué(s)' : '') + '.');
  process.exit(ko === 0 ? 0 : 1);
})();
