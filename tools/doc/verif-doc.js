'use strict';
/**
 * tools/doc/verif-doc.js — la page de référence est-elle VRAIE ?
 *
 * POURQUOI CE SCRIPT EXISTE
 * -------------------------
 * La leçon 01 du cours « doc » publie une page de référence en anglais, et
 * demande à l'apprenant de s'y fier. Une page de doc fausse serait pire que pas
 * de page du tout — et c'est exactement l'accident qui a fondé ce chantier :
 * cinq exemples dont la sortie annoncée était fausse, quatre vérificateurs verts.
 *
 * CE QU'IL CONTRÔLE
 *   1. Le code de slugify() publié dans la leçon est LITTÉRALEMENT celui de
 *      js/lecon.js (à l'indentation près).
 *   2. Chaque ligne « slugify(...) // "..." » de la rubrique Examples est
 *      exécutée, et sa sortie comparée au commentaire.
 *   3. Les promesses de « Return value » sont rejouées sur les 12 288 premiers
 *      points de code : alphabet de sortie, pas de tiret aux bords, chaîne vide.
 *   4. « Exceptions » et « Notes » : TypeError sur null/undefined/sans méthode,
 *      objet String ACCEPTÉ, lettres barrées perdues comme œ et ß, NFKD qui ne
 *      sauve ni œ ni ß mais sauve ﬁ et Ⅻ, accent circonflexe ASCII effacé avant
 *      l'étape 4, écriture non latine seule vs titre mixte.
 *   5. Le document publié dans la page est identique au fichier de référence.
 *   6. Les CHIFFRES DE CORPUS publiés dans la leçon sont ceux que rend le relevé
 *      d'aujourd'hui — c'est ce contrôle qui manquait quand la leçon, en étant
 *      publiée, a périmé ses propres mesures.
 *   7. Le nombre de contrôles annoncé dans la leçon est celui qui s'exécute ici.
 *
 * USAGE :  node tools/doc/verif-doc.js
 */
const fs = require('fs');
const path = require('path');
const lib = require('./mesures/corpus-lib.js');

const RACINE = lib.RACINE;
const PAGE = path.join(RACINE, 'pages', 'doc', 'lecon-01.html');
const REF = path.join(__dirname, 'reference', 'slugify.txt');

let ok = 0, ko = 0;
function verdict(cond, libelle, detail) {
  if (cond) { ok++; console.log('  OK   ' + libelle); }
  else { ko++; console.log('  ÉCHEC ' + libelle + (detail ? '  — ' + detail : '')); }
}
function dech(s) {
  return s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
}

const { source, fn: slugify } = lib.slugifyDuSite();
const refTexte = fs.readFileSync(REF, 'utf8').replace(/\n+$/, '');
const page = fs.existsSync(PAGE) ? fs.readFileSync(PAGE, 'utf8') : null;

/* ---- 1. le code publié est celui du site ---------------------------------- */
console.log('1. Le code publié est celui de js/lecon.js');
const attendu = source.split('\n').map((l, i) => (i === 0 ? l : l.replace(/^ {2}/, ''))).join('\n');
if (!page) {
  verdict(false, 'pages/doc/lecon-01.html existe', 'page absente');
} else {
  const blocs = [...page.matchAll(/<figure class="code-block" data-file="([a-z0-9.-]+)"><pre><code class="language-javascript">([\s\S]*?)<\/code><\/pre><\/figure>/g)];
  const porteurs = blocs.filter((b) => dech(b[2]).indexOf('function slugify(s)') !== -1);
  verdict(porteurs.length > 0, 'au moins un bloc publie le code de slugify()', porteurs.length + ' bloc(s)');
  let identiques = 0;
  for (const b of porteurs) {
    const extrait = dech(b[2]).match(/function slugify\(s\) \{[\s\S]*?\n\}/);
    if (extrait && extrait[0] === attendu) identiques++;
    else console.log('       divergence dans ' + b[1]);
  }
  verdict(identiques === porteurs.length,
    'les ' + porteurs.length + ' copies publiées sont identiques au fichier source',
    identiques + '/' + porteurs.length);
}

/* ---- 2. les exemples de la page de référence ------------------------------ */
console.log('2. Rubrique « Examples » de la page de référence');
const exemples = [...refTexte.matchAll(/slugify\((".*?")\)\s*\/\/\s*("(?:[^"\\]|\\.)*")/g)];
verdict(exemples.length >= 4, 'des exemples sont présents', exemples.length + ' exemple(s)');
for (const e of exemples) {
  const entree = JSON.parse(e[1]);
  const annonce = JSON.parse(e[2]);
  const reel = slugify(entree);
  verdict(reel === annonce, 'slugify(' + e[1] + ') === ' + e[2], 'obtenu ' + JSON.stringify(reel));
}

/* ---- 3. les promesses de « Return value » -------------------------------- */
console.log('3. Rubrique « Return value »');
const LIMITE = 0x3000;
let horsAlphabet = 0, auxBords = 0, videsSeuls = 0, eprouves = 0;
for (let c = 0; c < LIMITE; c++) {
  const s = slugify('x' + String.fromCharCode(c) + 'y');
  eprouves++;
  if (!/^[a-z0-9-]*$/.test(s)) horsAlphabet++;
  if (/^-|-$/.test(s)) auxBords++;
  if (slugify(String.fromCharCode(c)) === '') videsSeuls++;
}
verdict(horsAlphabet === 0, '« only a-z, 0-9 and U+002D » sur ' + eprouves + ' points de code', horsAlphabet + ' contre-exemple(s)');
verdict(auxBords === 0, '« neither starts nor ends with a hyphen »', auxBords + ' contre-exemple(s)');
verdict(videsSeuls > 0, '« the empty string is returned » est atteignable', videsSeuls + ' caractères la produisent seuls');

/* ---- 4. « Exceptions » et « Notes » -------------------------------------- */
console.log('4. Rubriques « Exceptions » et « Notes and known limitations »');
for (const v of [null, undefined, 42, true, [], {}]) {
  let leve = false, nom = '';
  try { slugify(v); } catch (e) { leve = true; nom = e.name; }
  verdict(leve && nom === 'TypeError', 'TypeError sur ' + (v === undefined ? 'undefined' : JSON.stringify(v)), leve ? nom : 'rien levé');
}
/* la nuance que la première rédaction taisait : « not a string » était trop fort. */
let objetString = null, incidentObjet = null;
try { objetString = slugify(new String('Les tableaux')); } catch (e) { incidentObjet = e.name; }
verdict(objetString === 'les-tableaux' && !incidentObjet,
  'un objet String est ACCEPTÉ, comme l annonce la rubrique Exceptions',
  incidentObjet || JSON.stringify(objetString));

verdict(slugify('cœur') === 'c-ur', '« returns c-ur for the French word for heart »', JSON.stringify(slugify('cœur')));
verdict(slugify('Łódź') === 'odz', '« returns odz for the Polish city Lodz »', JSON.stringify(slugify('Łódź')));
verdict(slugify('Øst') === 'st' && slugify('Đà Nẵng') === 'a-nang',
  'les lettres barrées (Ø, Đ) sont perdues comme œ et ß',
  JSON.stringify(slugify('Øst')) + ' / ' + JSON.stringify(slugify('Đà Nẵng')));
verdict(slugify('日本語') === '', 'une écriture non latine SEULE rend la chaîne vide', JSON.stringify(slugify('日本語')));
verdict(slugify('日本語 v2') === 'v2', 'un titre MIXTE garde sa partie ASCII', JSON.stringify(slugify('日本語 v2')));
verdict(slugify('a^b') === 'ab' && slugify('C`est') === 'cest',
  'l accent circonflexe ASCII est effacé à l étape 3, pas transformé en tiret',
  JSON.stringify(slugify('a^b')) + ' / ' + JSON.stringify(slugify('C`est')));
verdict(/\p{Diacritic}/u.test('^') && /\p{Diacritic}/u.test('`'),
  'U+005E et U+0060 portent bien la propriété Diacritic');
verdict('œ'.normalize('NFD') === 'œ' && 'ß'.normalize('NFD') === 'ß',
  'ni œ ni ß n ont de décomposition canonique');
verdict('œ'.normalize('NFKD') === 'œ' && 'ß'.normalize('NFKD') === 'ß',
  'NFKD ne les décomposerait pas davantage',
  JSON.stringify('œ'.normalize('NFKD')) + ' / ' + JSON.stringify('ß'.normalize('NFKD')));
verdict('ﬁ'.normalize('NFKD') === 'fi' && 'Ⅻ'.normalize('NFKD') === 'XII',
  'NFKD décompose en revanche U+FB01 et U+216B',
  JSON.stringify('ﬁ'.normalize('NFKD')) + ' / ' + JSON.stringify('Ⅻ'.normalize('NFKD')));

/* ---- 5. le document publié est le fichier de référence -------------------- */
console.log('5. Le document publié est le fichier de référence');
if (page) {
  const bloc = page.match(/<figure class="code-block" data-file="slugify\.txt"><pre><code class="language-plaintext">([\s\S]*?)<\/code><\/pre><\/figure>/);
  verdict(!!bloc, 'le bloc slugify.txt est présent dans la page');
  if (bloc) verdict(dech(bloc[1]) === refTexte, 'il est identique à tools/doc/reference/slugify.txt',
    'écart de ' + Math.abs(dech(bloc[1]).length - refTexte.length) + ' caractères');
}

/* ---- 6. les chiffres de corpus publiés sont ceux d aujourd hui ------------ */
console.log('6. Les chiffres de corpus publiés ⇄ le relevé d aujourd hui');
if (page) {
  const r = lib.releve();
  const visible = page.replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/&nbsp;/g, ' ').replace(/<[^>]*>/g, ' ');
  const fmt = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  const attendus = [
    ['titres h2 du corpus', r.titres],
    ['leçons du corpus', r.lecons],
    ['titres hors ASCII', r.horsAscii],
    ['titres à ligature', r.ligature],
    ['fragments distincts', r.distincts],
  ];
  for (const [nom, val] of attendus) {
    verdict(visible.indexOf(fmt(val)) !== -1, 'la page cite ' + nom + ' = ' + fmt(val));
  }
  /* et l inverse : aucun chiffre PÉRIMÉ ne traîne dans la page. */
  /* on ne teste que des nombres assez longs pour ne pas être une sous-chaîne
     d un chiffre légitime : « 75 » se retrouverait dans « 9 575 ». */
  const perimes = [17114, 9583, 9018, 1625];
  const traines = perimes.filter((n) => new RegExp('(^|[^0-9  ])' + fmt(n) + '([^0-9]|$)').test(visible));
  verdict(traines.length === 0, 'aucun chiffre de corpus périmé ne traîne dans la page',
    traines.join(', '));
}

/* ---- 6 bis. LA PAGE DE COURS, qu'aucun outil ne lisait (point C2 du V17) ---
   `pages/doc/cours.html` annonçait « 74 leçons de ce site » quand la mesure en
   comptait 82, et `lecon-01.html` disait 82. Les deux pages étaient cohérentes à
   leur écriture (`785940f`) : c'est le corpus qui a bougé sous elles. Le défaut
   n'était pas le chiffre, c'était le MÉCANISME — `gen.js` n'écrivait que
   `lecon-<num>.html`, `tools/doc/corps/` n'avait que `l1..l4.html`, et la page
   qu'on ouvre EN PREMIER n'avait ni gabarit ni contrôle. Elle a maintenant les
   deux : son gabarit porte des `@@MESURE:…@@`, et ce qui suit vérifie que la
   page publiée dit bien ce que la mesure dit aujourd'hui.
   ⚠️ Ce contrôle NE REMPLACE PAS le gabarit : il attrape le cas où quelqu'un
   modifie `pages/doc/cours.html` à la main sans repasser par `gen.js`, qui est
   très exactement ce qui s'était produit. */
console.log('6 bis. La page de cours ⇄ la mesure du corpus');
{
  const fCours = path.join(RACINE, 'pages', 'doc', 'cours.html');
  verdict(fs.existsSync(path.join(__dirname, 'corps', 'cours.html')),
    'la page de cours a un gabarit sous tools/doc/corps/');
  const vis = fs.existsSync(fCours)
    ? fs.readFileSync(fCours, 'utf8').replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ')
    : '';
  /* Le compte est REFAIT ICI, et non emprunté à `gen.js` : deux implémentations
     qui tombent sur le même nombre valent mieux qu'une seule vérifiée par
     elle-même. ⚠️ Pas de drapeau `g` sur ces motifs — `test()` ferait avancer
     `lastIndex` et une leçon sur deux serait sautée en silence. C'est le piège
     que `gen.js` neutralise par un reset explicite ; ici on l'évite. */
  const MOTIFS = [/documentation officielle/i, /\bdoc officielle/i, /\bMDN\b/,
    /la sp[ée]cification/i, /\bRFC\s?\d{3,5}\b/];
  const pages = new Set(), coursCites = new Set();
  for (const f of lib.fichiersLecons()) {
    const art = fs.readFileSync(f, 'utf8').match(/<article class="prose"[\s\S]*?<\/article>/);
    if (!art) continue;
    if (!MOTIFS.some((re) => re.test(art[0]))) continue;
    const rel = path.relative(lib.RACINE, f).replace(/\\/g, '/');
    pages.add(rel); coursCites.add(rel.split('/')[1]);
  }
  const mille = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  verdict(vis.indexOf(mille(pages.size) + ' leçons de ce site') !== -1,
    'la page de cours cite le nombre de leçons qui renvoient à un document = ' + pages.size);
  verdict(vis.indexOf(mille(coursCites.size) + ' cours') !== -1,
    'la page de cours cite le nombre de cours concernés = ' + coursCites.size);
  /* Le même relevé que la leçon 1, par le même chemin : deux pages du même cours
     ne doivent pas pouvoir annoncer deux chiffres différents. */
  const rel = lib.releve();
  verdict(vis.indexOf(mille(rel.ligature) + ' titres du site') !== -1,
    'la page de cours cite le nombre de titres à fragment amputé = ' + rel.ligature);
}

/* ---- 7. le nombre de contrôles annoncé est le nombre réel ----------------- */
/* ⚠️ ET DANS LA PAGE DE COURS AUSSI (point C2 du V17). Ce contrôle ne lisait que
   `lecon-01.html` ; `cours.html` annonce le MÊME nombre, dans les mêmes termes,
   et pouvait le démentir sans que rien ne bouge. Trouvé en éprouvant les quatre
   contrôles ajoutés juste au-dessus : l'injection « 40 → 39 contrôles » dans la
   page de cours sortait en 0. Une injection qui ne rougit pas est une lacune,
   pas une bonne nouvelle. */
console.log('7. Le nombre de contrôles annoncé dans la leçon et dans la page de cours');
{
  const fCours = path.join(RACINE, 'pages', 'doc', 'cours.html');
  const cibles = [['la leçon', page]];
  if (fs.existsSync(fCours)) cibles.push(['la page de cours', fs.readFileSync(fCours, 'utf8')]);
  const total = ok + ko + cibles.filter(function (c) { return c[1]; }).length;  // + ceux-ci
  for (const [nom, html] of cibles) {
    if (!html) continue;
    const visible = html.replace(/<[^>]*>/g, ' ');
    verdict(new RegExp('\\b' + total + '\\b(?=[^0-9]{0,40}contrôle)').test(visible) ||
            visible.indexOf(total + ' contrôles') !== -1,
      nom + ' annonce bien ' + total + ' contrôles');
  }
}

console.log('\n' + ok + ' contrôle(s) OK, ' + ko + ' en échec.');
process.exit(ko === 0 ? 0 : 1);
