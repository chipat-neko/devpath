'use strict';
/**
 * tools/doc/verif-normatif.js — la leçon 03 dit-elle vrai ?
 *
 * POURQUOI CE SCRIPT EXISTE
 * -------------------------
 * La leçon 03 publie une spécification et affirme que les milliers de questions
 * de QCM du site la respectent. C'est une affirmation qui se périme à chaque
 * question ajoutée, et que personne ne rejouerait spontanément.
 *
 * Il reprend d'emblée les trois contrôles nés des défauts de la leçon 02 :
 * l'exercice de code est RÉSOLU indépendamment de son énoncé, le biais de
 * longueur des QCM est mesuré, et aucun chiffre de la prose n'est cru sur
 * parole — tous sont recalculés et retrouvés dans la page.
 *
 * CE QU'IL CONTRÔLE
 *   1. Le document publié est LITTÉRALEMENT le fichier de référence.
 *   2. Les clauses annoncées existent dans le document, au bon niveau.
 *   3. La conformité publiée est celle que rend la mesure d'aujourd'hui.
 *   4. Les blocs de sortie sont ceux de l'exécution des programmes.
 *   5. Chaque bloc de code publié GARDE SON BOUTON « Tester » — le défaut qui a
 *      rendu un programme inerte sans que rien ne le signale.
 *   6. L'exercice de code : sa valeur attendue est résolue ici, à part.
 *   7. Le biais de longueur des QCM reste sous le seuil.
 *
 * USAGE :  node tools/doc/verif-normatif.js
 */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const RACINE = path.join(__dirname, '..', '..');
const PAGE = path.join(RACINE, 'pages', 'doc', 'lecon-03.html');
const REF = path.join(__dirname, 'reference', 'quiz-format.txt');
const conformite = require('./mesures/conformite-quiz.js');

let ok = 0, ko = 0;
function verdict(cond, libelle, detail) {
  if (cond) { ok++; console.log('  OK   ' + libelle); }
  else { ko++; console.log('  ÉCHEC ' + libelle + (detail ? '  — ' + detail : '')); }
}
function dech(s) {
  return s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'").replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&');
}

const page = fs.existsSync(PAGE) ? fs.readFileSync(PAGE, 'utf8') : null;
const visible = page ? dech(page.replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<[^>]*>/g, ' ')).replace(/\s+/g, ' ') : '';
const spec = fs.readFileSync(REF, 'utf8').replace(/\n+$/, '');

/* ---- 1. le document publié est le fichier de référence -------------------- */
console.log('1. Le document publié ⇄ tools/doc/reference/quiz-format.txt');
verdict(!!page, 'pages/doc/lecon-03.html existe');
if (page) {
  const bloc = page.match(/<figure class="code-block" data-file="quiz-format\.txt"><pre><code class="language-plaintext">([\s\S]*?)<\/code><\/pre><\/figure>/);
  verdict(!!bloc, 'le document est publié dans la page');
  if (bloc) {
    verdict(dech(bloc[1]) === spec, 'il est identique au fichier de référence',
      'écart de ' + Math.abs(dech(bloc[1]).length - spec.length) + ' caractères');
  }
}

/* ---- 2. les clauses annoncées existent, au bon niveau --------------------- */
console.log('2. Les clauses ⇄ le texte du document');
const ATTENDUES = [
  ['MUST', 'MUST be an array of at least two strings'],
  ['MUST', 'The options MUST be distinct from one another'],
  ['MUST', 'MUST be less than the length'],
  ['MUST', 'MUST shuffle the options'],
  ['MUST NOT', 'MUST NOT refer to its own position'],
  ['SHOULD', 'SHOULD offer exactly four options'],
  ['SHOULD', 'It SHOULD be present'],
  ['SHOULD NOT', 'SHOULD NOT be shorter than 70% or longer than 130%'],
  ['MAY', 'It MAY be omitted'],
];
/* Le document est mis en page sur 72 colonnes : une clause y tient sur deux
   lignes. Chercher une phrase telle qu'on l'a en tête echouerait sur la coupure
   — on compare donc les espaces normalisés. */
const specPlat = spec.replace(/\s+/g, ' ');
for (const [niveau, phrase] of ATTENDUES) {
  verdict(specPlat.indexOf(phrase) !== -1, niveau + ' : « ' + phrase.slice(0, 46) + ' … »');
}
/* et l'inverse : la section 2 doit définir les cinq mots-clés.
   ⚠ Le titre « Requirements Language » apparaît DEUX fois : dans le sommaire et
   en tête de section. Une recherche naïve tombait sur le sommaire, et
   l'intervalle mesuré était vide — six faux échecs d'un coup. */
/* Le titre figure DEUX fois : sommaire, puis section. On prend la dernière —
   un « chercher à partir de l'octet 2000 » est un repère qui bouge avec le
   texte, et il a rendu -1 dès que le sommaire s'est allongé. */
const debutS2 = spec.lastIndexOf('2.  Requirements Language');
const finS2 = spec.indexOf('3.  Terminology', debutS2 + 10);
verdict(debutS2 > 0 && finS2 > debutS2, 'la section 2 est repérée hors du sommaire',
  'de ' + debutS2 + ' à ' + finS2);
for (const mot of ['MUST', 'MUST NOT', 'SHOULD', 'SHOULD NOT', 'MAY']) {
  verdict(debutS2 > 0 && finS2 > debutS2 && spec.slice(debutS2, finS2).indexOf(mot) !== -1,
    'la section 2 définit « ' + mot + ' »');
}

/* ---- 3. la conformité publiée est celle d aujourd hui --------------------- */
console.log('3. La conformité publiée ⇄ la mesure d aujourd hui');
const r = conformite.mesurer();
const fmt = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
const must = r.clauses.filter((c) => c.niveau === 'MUST');
const echecsMust = must.reduce((a, c) => a + c.echecs, 0);
const s3 = r.clauses.find((c) => c.id === 'S3');
verdict(visible.indexOf(fmt(r.questions)) !== -1, 'la page cite le nombre de questions = ' + fmt(r.questions));
verdict(visible.indexOf(String(r.cours)) !== -1, 'la page cite le nombre de cours = ' + r.cours);
verdict(echecsMust === 0, 'aucune question du site ne viole un MUST', echecsMust + ' manquement(s)');
verdict((r.rejets || []).length === 0, 'aucun bloc portant data-quiz n est rejeté en silence',
  (r.rejets || []).map((x) => x.fichier).join(', '));
const pct = ((s3.echecs / s3.total) * 100).toFixed(1).replace('.', ',');
verdict(visible.indexOf(pct) !== -1, 'la page cite le taux de manquement à S3 = ' + pct + ' %');
verdict(visible.indexOf(fmt(s3.echecs)) !== -1, 'la page cite le nombre de manquements à S3 = ' + fmt(s3.echecs));
/* la clause M6 doit VOIR une vraie violation : sans ce témoin, « 0 manquement »
   ne prouverait rien — c'est le vérificateur qui avalait ses pannes en D1. */
const M6 = conformite.CLAUSES.find((c) => c.id === 'M6');
const temoinsFaux = [
  ['toutes les réponses ci-dessus', 'a', 'b', 'c'],
  ['a', 'aucune des propositions précédentes', 'b', 'c'],
  ['Réponse A', 'b', 'c', 'd'],
];
const temoinsVrais = [
  ['aucune des deux ReLU', 'b', 'c', 'd'],
  ['les deux premiers éléments du tableau', 'b', 'c', 'd'],
  ['on sert la dernière réponse mise en cache', 'b', 'c', 'd'],
  ['filtre la réponse côté client', 'b', 'c', 'd'],
];
/* ⚠️ AJOUTÉ le 2026-09-06, sur une prise de relecture adversariale : S3 était la
   SEULE clause dont l'implémentation venait d'être réécrite, et la seule sans
   témoin. Si « n < bonne * 0.7 » avait été tapé « n < bonne * 0.07 », les 62
   contrôles seraient restés verts. Un contrôle qui vérifie qu'une page cite le
   nombre que l'outil vient de calculer est un contrôle de FRAÎCHEUR ; il ne dit
   rien de la justesse de la règle. Les témoins, eux, la disent. */
const S3 = conformite.CLAUSES.find((c) => c.id === 'S3');
const s3Faux = [
  /* bonne = 100 car., un distracteur à 60 (60 %) : hors bande, doit être VU */
  ['x'.repeat(100), 'y'.repeat(60), 'z'.repeat(95), 'w'.repeat(105)],
  /* bonne = 100 car., un distracteur à 140 (140 %) : hors bande, doit être VU */
  ['x'.repeat(100), 'y'.repeat(90), 'z'.repeat(140), 'w'.repeat(105)],
];
const s3Vrais = [
  /* tout dans la bande 70-130 % : ne doit PAS crier */
  ['x'.repeat(100), 'y'.repeat(70), 'z'.repeat(130), 'w'.repeat(100)],
  /* bonne réponse de 3 caractères : la section 7 exempte, ne doit PAS crier */
  ['any', 'unknown', 'object', 'never'],
];
const s3Vues = s3Faux.filter((a) => !S3.test({ q: 'x', a, correct: 0 })).length;
const s3FauxPos = s3Vrais.filter((a) => !S3.test({ q: 'x', a, correct: 0 })).length;
verdict(s3Vues === s3Faux.length, 'la clause S3 voit les ' + s3Faux.length + ' violations témoins',
  s3Vues + ' vue(s)');
verdict(s3FauxPos === 0, 'la clause S3 ne crie pas sur les ' + s3Vrais.length + ' cas légitimes',
  s3FauxPos + ' fausse(s) alerte(s)');
/* S4 est une clause de POPULATION : son témoin est un COURS, pas une question. */
verdict(r.s4 && r.s4.cours > 0, 'la mesure de population S4 porte sur des cours',
  r.s4 ? r.s4.cours + ' cours' : 'absente');
verdict(r.s4 && r.s4.conformes < r.s4.cours,
  'la mesure S4 voit au moins un cours non conforme (sinon elle ne mesure rien)',
  r.s4 ? r.s4.echecs + ' non conforme(s)' : 'absente');
const vues = temoinsFaux.filter((a) => !M6.test({ q: 'x', a, correct: 0 })).length;
const fauxPos = temoinsVrais.filter((a) => !M6.test({ q: 'x', a, correct: 0 })).length;
verdict(vues === temoinsFaux.length, 'la clause M6 voit les ' + temoinsFaux.length + ' violations témoins', vues + ' vue(s)');
verdict(fauxPos === 0, 'la clause M6 ne crie pas au loup sur ' + temoinsVrais.length + ' phrases légitimes', fauxPos + ' faux positif(s)');

/* ---- 3 bis. les compteurs de mentions, recalculés ------------------------- */
/* Ce contrôle vient d'un accident : un script d'édition avait laissé de vrais
   caractères BACKSPACE (U+0008) à la place des « \\b » dans deux motifs de
   gen.js. Les compteurs affichaient « 0 leçon cite une RFC » au lieu de 18, et
   « 0 leçon emploie MUST » au lieu de 1. Aucun outil ne l'a vu : le caractère
   est invisible, le fichier reste du JavaScript valide, et un compteur à zéro
   ressemble à une mesure. Seule une capture d'écran l'a révélé.
   On recalcule donc ici, avec des motifs écrits indépendamment. */
console.log('3 bis. Les compteurs de mentions, recalculés');
{
  const lib = require('./mesures/corpus-lib.js');
  const MOTIFS = {
    'leçons citant une RFC': /RFC[ ]?[0-9]{3,5}/,
    'leçons parlant de la spécification': /la sp[ée]cification/i,
    'leçons employant MUST ou SHOULD': /MUST|SHOULD/,
  };
  const compte = {};
  for (const k in MOTIFS) compte[k] = 0;
  for (const f of lib.fichiersLecons()) {
    const html = fs.readFileSync(f, 'utf8');
    const art = html.match(/<article class="prose"[\s\S]*?<\/article>/);
    if (!art) continue;
    for (const k in MOTIFS) if (MOTIFS[k].test(art[0])) compte[k]++;
  }
  for (const k in MOTIFS) {
    verdict(compte[k] > 0, k + ' : la mesure rend un compte non nul', String(compte[k]));
    verdict(visible.indexOf(String(compte[k])) !== -1,
      'la page cite ce compte (' + compte[k] + ') — ' + k);
  }
}

/* ---- 3 ter. le MUST du lecteur, vérifié dans js/lecon.js ------------------ */
/* La section 6 exige que le lecteur MÉLANGE les options — et c'est de là que
   vient toute la clause M6. Rien ne le vérifiait : si « shuffle(opts) »
   disparaissait de js/lecon.js, la chaîne entière serait restée verte et la
   leçon aurait continué d'enseigner une justification devenue fausse. */
console.log('3 ter. Le MUST du lecteur ⇄ js/lecon.js');
{
  const lecon = fs.readFileSync(path.join(RACINE, 'js', 'lecon.js'), 'utf8');
  const build = lecon.match(/function buildQuiz\([\s\S]*?\n  \}/);
  verdict(!!build, 'buildQuiz() est trouvée dans js/lecon.js');
  if (build) {
    verdict(/opts\s*=\s*shuffle\(opts\)/.test(build[0]),
      'buildQuiz mélange les options, comme la section 6 l exige');
    verdict(/escapeHTML\(item\.q\)/.test(build[0]) && /escapeHTML\(o\.text\)/.test(build[0]),
      'buildQuiz échappe la question et les options, comme la section 5.1 l annonce');
    verdict(/item\.correct \|\| 0/.test(build[0]),
      'un « correct » absent vaut zéro, comme la section 5.3 l annonce');
  }
  const shuffle = lecon.match(/function shuffle\([\s\S]*?\n  \}/);
  verdict(!!shuffle && /Math\.random/.test(shuffle[0]),
    'le mélange est bien aléatoire (donc refait à chaque chargement)');
}

/* ---- 4. les blocs de sortie ⇄ l exécution --------------------------------- */
console.log('4. Les blocs de sortie ⇄ l exécution des programmes');
const PROGRAMMES = ['normatif-mots.js', 'normatif-conformite.js', 'normatif-versions.js'];
function fmtVal(v) {
  if (typeof v === 'string') return v;
  if (v === undefined) return 'undefined';
  if (v === null) return 'null';
  if (typeof v === 'function') return v.toString();
  try { return JSON.stringify(v); } catch (e) { return String(v); }
}
/* on relit le code TEL QU IL EST PUBLIÉ, marqueurs déjà résolus. */
function codePublie(nom) {
  const re = new RegExp('data-file="' + nom.replace('.', '\\.') + '"><pre><code class="language-javascript">([\\s\\S]*?)</code>');
  const m = page && page.match(re);
  return m ? dech(m[1]) : null;
}
function executer(src) {
  const out = [];
  const push = function () { out.push(Array.prototype.slice.call(arguments).map(fmtVal).join(' ')); };
  const bac = { console: { log: push, warn: push, error: push, info: push, debug: push } };
  bac.globalThis = bac;
  vm.runInNewContext(src, vm.createContext(bac), { timeout: 5000 });
  return out.join('\n');
}
/* ---- 5. et le bouton « Tester » de chacun --------------------------------- */
const BROWSER_ONLY = /(?:^|[^\w$À-ɏ])(document|window|localStorage|sessionStorage|alert|prompt|confirm|location|navigator|process|Buffer|__dirname|__filename)(?![\w$À-ɏ])|require\s*\(|module\.exports|\bexports\.|\bglobalThis\b|node:|new Worker|postMessage|SharedArrayBuffer|Atomics|importScripts/;

for (const nom of PROGRAMMES) {
  const src = codePublie(nom);
  verdict(!!src, 'le code de ' + nom + ' est publié');
  if (!src) continue;
  let sortie = null, incident = null;
  try { sortie = executer(src); } catch (e) { incident = e.message; }
  verdict(!incident, nom + ' s exécute sans erreur', incident);
  const bloc = page.match(new RegExp('data-file="' + nom.replace('.js', '\\.txt') +
    '"><pre><code class="language-plaintext">([\\s\\S]*?)</code>'));
  verdict(!!bloc, 'le bloc de sortie de ' + nom + ' est présent');
  if (bloc && sortie !== null) {
    verdict(dech(bloc[1]) === sortie, nom + ' : la sortie publiée est celle de l exécution',
      'publié ' + dech(bloc[1]).split('\n').length + ' lignes, obtenu ' + sortie.split('\n').length);
  }
  /* LE contrôle né du défaut de cette leçon : un bloc peut être parfait et
     inerte. js/runner.js ne pose pas de bouton sur un bloc qui contient
     « document », même dans une chaîne — et rien ne le signale. */
  const interdit = src.match(BROWSER_ONLY);
  verdict(!interdit, nom + ' garde son bouton « Tester »',
    interdit ? 'contient « ' + interdit[0].trim() +' », que runner.js refuse' : '');
}

/* ---- 6. l exercice de code, résolu indépendamment de son énoncé ------------ */
console.log('6. L exercice de code, résolu à part');
if (page) {
  const me = page.match(/<script type="application\/json" data-exos>([\s\S]*?)<\/script>/);
  const exos = me ? JSON.parse(dech(me[1])) : [];
  const codes = exos.filter((e) => e.type === 'code' && e.run && e.run.expect);
  verdict(codes.length > 0, 'la leçon a un exercice de code');
  /* La consigne : combien, parmi ces cinq versions, sont ANTÉRIEURES à 1.9.3 ?
     Résolu ici sans lire l'énoncé — la leçon 02 avait publié un « 7 » là où la
     réponse était 6, et déclarait en échec l'apprenant qui avait juste. */
  function comparer(a, b) {
    const na = a.split('.').map(Number), nb = b.split('.').map(Number);
    for (let i = 0; i < 3; i++) if ((na[i] || 0) !== (nb[i] || 0)) return (na[i] || 0) < (nb[i] || 0) ? -1 : 1;
    return 0;
  }
  const attendu = ['1.9.0', '1.10.0', '1.2', '1.2.0', '1.0.10'].filter((v) => comparer(v, '1.9.3') < 0).length;
  for (const e of codes) {
    verdict(String(attendu) === e.run.expect, 'la valeur attendue est celle que rend le programme juste',
      'attendu « ' + e.run.expect + ' », obtenu ' + attendu);
  }
}

/* ---- 7. le biais de longueur des QCM -------------------------------------- */
console.log('7. Le biais de longueur des QCM de la leçon');
if (page) {
  const blocs = [...page.matchAll(/<script type="application\/json" data-quiz(?:-bilan="[^"]*")?>([\s\S]*?)<\/script>/g)];
  let questions = 0, plusLongue = 0, plusCourte = 0;
  for (const b of blocs) {
    let lot;
    try { lot = JSON.parse(dech(b[1])); }
    catch (e) { verdict(false, 'un bloc de QCM est du JSON valide', e.message); continue; }
    for (const q of lot) {
      questions++;
      const L = q.a.map((x) => x.length);
      const bonne = L[q.correct || 0];
      if (bonne === Math.max.apply(null, L)) plusLongue++;
      if (bonne === Math.min.apply(null, L)) plusCourte++;
    }
  }
  const seuil = Math.ceil(questions * 0.5);
  verdict(questions > 0, 'les QCM se relisent', questions + ' questions');
  verdict(plusLongue <= seuil, 'la bonne réponse n est pas systématiquement la plus LONGUE',
    plusLongue + '/' + questions + ' (seuil ' + seuil + ')');
  verdict(plusCourte <= seuil, 'la bonne réponse n est pas systématiquement la plus COURTE',
    plusCourte + '/' + questions + ' (seuil ' + seuil + ')');

  /* ⚠ EXIGENCE STRICTE, et elle ne vaut que pour ce cours-ci : il PUBLIE la
     règle S3, il doit donc la tenir à zéro manquement. Ses trois leçons la
     violaient 15 fois sur 48 — un cours qui enseigne une règle et l'enfreint
     n'enseigne rien. Le reste du site reste sous le régime du seuil. */
  const S3clause = conformite.CLAUSES.find((c) => c.id === 'S3');
  /* ⚠ `lecon-04.html` MANQUAIT A CETTE LISTE, et c'est un angle mort de la meme
     famille que ceux du chantier : un controle strict qui laisse dehors un
     quart de son corpus protege moins qu'il ne le laisse croire. La quatrieme
     lecon porte en plus le QCM BILAN du cours -- celui que l'apprenant passe en
     bloc, donc l'endroit ou un indice de lot paie le plus. Verifie avant de
     l'ajouter : les quatre lecons sont a zero manquement (2026-09-06), donc la
     liste s'etend sans rien faire rougir. */
  for (const f of ['lecon-01.html', 'lecon-02.html', 'lecon-03.html', 'lecon-04.html']) {
    const chemin = path.join(RACINE, 'pages', 'doc', f);
    if (!fs.existsSync(chemin)) continue;
    const h = fs.readFileSync(chemin, 'utf8');
    let total = 0, viole = 0;
    for (const b of h.matchAll(/<script type="application\/json" data-quiz(?:-bilan(?:="[^"]*")?)?>([\s\S]*?)<\/script>/g)) {
      let lot;
      try { lot = JSON.parse(dech(b[1])); } catch (e) { continue; }
      for (const q of lot) { total++; if (!S3clause.test(q)) viole++; }
    }
    verdict(viole === 0, 'doc/' + f + ' respecte la règle S3 qu il publie',
      viole + ' manquement(s) sur ' + total);
  }

  /* LA BONNE REPONSE QUI DISAIT LE CONTRAIRE DE SON EXPLICATION (trouve le
     2026-09-06). `lecon-03` q6 demande l'ecart entre les MUST et le SHOULD S3.
     Son explication affiche le taux MESURE ; sa bonne reponse, elle, etait
     ECRITE A LA MAIN : « pres de NEUF cas sur dix » quand la mesure disait
     68,1 %. Les deux ont diverge en silence a mesure que le chantier B4
     assainissait le site, et la question s'est retrouvee SANS AUCUNE option
     vraie. La bonne reponse est desormais engendree (@@NORMNB:s3EnMots@@) ;
     ce controle interdit qu'on la reecrive un jour a la main. */
  const l3 = path.join(RACINE, 'pages', 'doc', 'lecon-03.html');
  if (fs.existsSync(l3)) {
    const MOTS = ['zéro', 'un', 'deux', 'trois', 'quatre', 'cinq',
                  'six', 'sept', 'huit', 'neuf', 'dix'];
    const taux = s3.echecs / s3.total;
    const veut = MOTS[Math.round(taux * 10)];
    const dit = (fs.readFileSync(l3, 'utf8')
      .match(/ignorée dans près de ([a-zéèA-Z]+) cas sur dix/) || [])[1];
    verdict(dit === veut,
      'doc/lecon-03 : la bonne réponse chiffrée suit la mesure',
      'la page dit « ' + dit + ' cas sur dix », la mesure dit « ' + veut + ' » ('
        + (taux * 100).toFixed(1).replace('.', ',') + ' %)');
  }
}

console.log('\n' + ok + ' contrôle(s) OK, ' + ko + ' en échec.');
process.exit(ko === 0 ? 0 : 1);
