'use strict';
/**
 * tools/etudes/inconnu/mesure-langages.js
 *
 * POURQUOI CET OUTIL EXISTE. L'étude nº 6 affirme que « la structure d'un programme se
 * devine, même dans un langage qu'on n'a jamais vu ». C'est le genre de phrase qu'on lit
 * partout et que personne ne mesure. Ici on la mesure : le site contient des blocs de
 * code dans des dizaines de langages ; on compte, marqueur par marqueur, dans combien de
 * langages il apparaît RÉELLEMENT — et dans quelle proportion de leurs blocs.
 *
 * CE QUI EST COMPTÉ. Tout `<code class="language-XXX">` des leçons de `pages/`. Le langage
 * est celui de la classe, PAS celui du dossier : un bloc `language-bash` dans le cours Go
 * compte pour bash. Les entités HTML sont décodées avant analyse (sinon `&gt;` masquerait
 * tous les `>`), et les chaînes littérales + commentaires sont NEUTRALISÉS avant de
 * chercher un mot-clé — sinon le mot « for » d'une phrase française en commentaire
 * ferait croire que le langage a une boucle `for`.
 *
 *   node tools/etudes/inconnu/mesure-langages.js            tableau lisible
 *   node tools/etudes/inconnu/mesure-langages.js --json     données brutes
 */

const fs = require('fs');
const path = require('path');

const RACINE = path.resolve(__dirname, '..', '..', '..');
const PAGES = path.join(RACINE, 'pages');

/* ------------------------------------------------------------------ collecte */

// ⚠️ Tous les `lecon-NN.html` ne sont pas des leçons : quatre dossiers d'anciens noms
// (js-avance, html-avance, css-avance, python-avance) ne contiennent que des pages de
// REDIRECTION de quelques centaines d'octets, sans un seul bloc de code. Les compter
// ferait annoncer un nombre de leçons supérieur à celui que la page d'accueil publie.
//
// ⚠️ ET LE PREMIER FILTRE ÉCRIT ICI ÉTAIT TROP LARGE, exactement comme le prévient la
// règle du chantier. Chercher `http-equiv="refresh"` n'importe où dans le fichier
// écartait aussi `pages/html/lecon-35.html` — 41 Ko, 10 blocs de code — dont le seul
// tort est d'ENSEIGNER cette balise, en l'écrivant échappée (`&lt;meta …`). D'où deux
// conditions : la balise doit être présente pour de vrai (non échappée) ET le fichier
// doit être minuscule. On passe alors de 90 pages écartées à 89, et le compte de
// leçons retombe sur celui que la page d'accueil publie.
const TAILLE_REDIRECTION = 4096;

function estRedirection(html) {
  return html.length < TAILLE_REDIRECTION &&
    /<meta[^>]*http-equiv\s*=\s*["']refresh["']/i.test(html);
}

function listerLecons() {
  const out = [];
  let redirections = 0;
  for (const d of fs.readdirSync(PAGES, { withFileTypes: true })) {
    if (!d.isDirectory()) continue;
    const dir = path.join(PAGES, d.name);
    for (const f of fs.readdirSync(dir)) {
      if (!/^lecon-\d+\.html$/.test(f)) continue;
      const complet = path.join(dir, f);
      if (estRedirection(fs.readFileSync(complet, 'utf8'))) { redirections++; continue; }
      out.push(complet);
    }
  }
  out.redirections = redirections;
  return out.sort();
}

function decode(s) {
  return s
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&');
}

// Extrait les blocs <code class="language-XXX">...</code> d'un fichier HTML.
const RE_BLOC = /<code class="language-([a-z0-9+#_-]+)"[^>]*>([\s\S]*?)<\/code>/g;

function blocsDe(fichier) {
  const html = fs.readFileSync(fichier, 'utf8');
  const out = [];
  let m;
  RE_BLOC.lastIndex = 0;
  while ((m = RE_BLOC.exec(html))) {
    out.push({ langue: m[1], code: decode(m[2]) });
  }
  return out;
}

/* ------------------------------------------- neutralisation chaines/commentaires
 * On remplace le CONTENU des chaînes et des commentaires par des espaces, en gardant
 * la longueur, pour ne pas décaler les lignes.
 *
 * ⚠️ CE QUI A ÉTÉ CORRIGÉ ICI, ET POURQUOI C'EST LE CŒUR DE L'OUTIL. La première
 * version traitait tous les langages pareil : `//`, `#`, `--`, `;;`. Résultat mesuré :
 * l'ASSEMBLEUR passait pour un langage possédant « un mot pour si », parce que ses
 * commentaires commencent par `;` SEUL — non reconnu — et qu'ils sont écrits en
 * FRANÇAIS : « jge .fin  ; si i >= 5, sortir ». Le mot « si » d'une phrase française
 * était compté comme mot-clé du langage. Le marqueur « si » était alors donné pour
 * présent dans 40 langages sur 40 ; il ne l'est pas.
 *
 * Le caractère de commentaire dépend donc du LANGAGE. Impossible de généraliser : le
 * `;` qui ouvre un commentaire en assembleur et en Lisp TERMINE une instruction en C,
 * et le blanchir partout effacerait la moitié du code C.
 */
const COMM_DEFAUT = { ligne: ['//'], bloc: [['/*', '*/']], chaines: ['"', "'", '`'] };
const COMMENTAIRES = {
  // dièse
  python: { ligne: ['#'], bloc: [['"""', '"""']], chaines: ['"', "'"] },
  bash: { ligne: ['#'], bloc: [], chaines: ['"', "'"] },
  ruby: { ligne: ['#'], bloc: [], chaines: ['"', "'"] },
  perl: { ligne: ['#'], bloc: [], chaines: ['"', "'"] },
  r: { ligne: ['#'], bloc: [], chaines: ['"', "'"] },
  powershell: { ligne: ['#'], bloc: [['<#', '#>']], chaines: ['"', "'"] },
  julia: { ligne: ['#'], bloc: [], chaines: ['"'] },
  elixir: { ligne: ['#'], bloc: [], chaines: ['"'] },
  yaml: { ligne: ['#'], bloc: [], chaines: ['"', "'"] },
  hcl: { ligne: ['#', '//'], bloc: [['/*', '*/']], chaines: ['"'] },
  docker: { ligne: ['#'], bloc: [], chaines: ['"', "'"] },
  toml: { ligne: ['#'], bloc: [], chaines: ['"', "'"] },
  ini: { ligne: ['#', ';'], bloc: [], chaines: ['"'] },
  makefile: { ligne: ['#'], bloc: [], chaines: ['"', "'"] },
  cmake: { ligne: ['#'], bloc: [], chaines: ['"'] },
  graphql: { ligne: ['#'], bloc: [], chaines: ['"'] },
  // double tiret
  haskell: { ligne: ['--'], bloc: [['{-', '-}']], chaines: ['"'] },
  lua: { ligne: ['--'], bloc: [['--[[', ']]']], chaines: ['"', "'"] },
  sql: { ligne: ['--'], bloc: [['/*', '*/']], chaines: ["'", '"'] },
  ada: { ligne: ['--'], bloc: [], chaines: ['"'] },
  // point-virgule (assembleur, Lisp)
  nasm: { ligne: [';'], bloc: [], chaines: ['"', "'"] },
  lisp: { ligne: [';'], bloc: [], chaines: ['"'] },
  clojure: { ligne: [';'], bloc: [], chaines: ['"'] },
  // pour cent
  prolog: { ligne: ['%'], bloc: [['/*', '*/']], chaines: ["'", '"'] },
  erlang: { ligne: ['%'], bloc: [], chaines: ['"', "'"] },
  // divers
  fortran: { ligne: ['!'], bloc: [], chaines: ['"', "'"] },
  vb: { ligne: ["'"], bloc: [], chaines: ['"'] },      // en VB, l'apostrophe COMMENTE
  cobol: { ligne: ['*>'], bloc: [], chaines: ['"', "'"], colonne7: true },
  pascal: { ligne: ['//'], bloc: [['{', '}'], ['(*', '*)']], chaines: ["'"] },
  ocaml: { ligne: [], bloc: [['(*', '*)']], chaines: ['"'] },
  fsharp: { ligne: ['//'], bloc: [['(*', '*)']], chaines: ['"'] },
  markup: { ligne: [], bloc: [['<!--', '-->']], chaines: ['"', "'"] },
  html: { ligne: [], bloc: [['<!--', '-->']], chaines: ['"', "'"] },
  xml: { ligne: [], bloc: [['<!--', '-->']], chaines: ['"', "'"] },
  markdown: { ligne: [], bloc: [], chaines: ['`'] },
  css: { ligne: [], bloc: [['/*', '*/']], chaines: ['"', "'"] },
  scss: { ligne: ['//'], bloc: [['/*', '*/']], chaines: ['"', "'"] },
  json: { ligne: [], bloc: [], chaines: ['"'] },
  plaintext: { ligne: [], bloc: [], chaines: [] },
  text: { ligne: [], bloc: [], chaines: [] },
  csv: { ligne: [], bloc: [], chaines: ['"'] },
  regex: { ligne: [], bloc: [], chaines: [] },
  http: { ligne: [], bloc: [], chaines: ['"'] },
};

function reglesDe(langue) {
  return COMMENTAIRES[langue] || COMM_DEFAUT;
}

// Langages où l'apostrophe n'est PAS un délimiteur de chaîne fiable.
//  · Rust : `&'static str`, `struct Entete<'a>` — l'apostrophe y ouvre une DURÉE DE VIE.
//    Traitée comme une chaîne, elle effaçait la fin de la ligne, et donc le `=`, la
//    flèche `->` et l'accolade de tout bloc Rust à durée de vie.
//  · markup / html / xml : le texte d'une page en français en est plein
//    (« J'aime la photo »), et blanchir jusqu'à la suivante mangeait les balises.
// Dans ces langages, on n'ouvre sur `'` que si la fermeture arrive tout de suite
// (un vrai littéral de caractère, `'a'`) ou, pour le balisage, si l'apostrophe suit
// un `=` (valeur d'attribut).
const APOSTROPHE_PRUDENTE = new Set(['rust', 'markup', 'html', 'xml', 'ocaml', 'fsharp', 'haskell']);

function neutraliser(code, langue) {
  const R = reglesDe(langue);
  const prudente = APOSTROPHE_PRUDENTE.has(langue);
  const balisage = langue === 'markup' || langue === 'html' || langue === 'xml';
  const n = code.length;
  const out = code.split('');
  let i = 0, mange = 0, mangeComm = 0;
  // `mange` ne compte QUE les caractères réellement changés : blanchir une espace qui
  // était déjà une espace ne neutralise rien, et le compter gonflait le taux publié.
  const blanc = (a, b, estComm) => {
    for (let k = a; k < b && k < n; k++) {
      if (out[k] !== '\n' && out[k] !== ' ') { out[k] = ' '; mange++; if (estComm) mangeComm++; }
      else if (out[k] !== '\n') { out[k] = ' '; }
    }
  };
  const jusquAuSaut = (start) => {
    const j = code.indexOf('\n', start);
    return j < 0 ? n : j;
  };
  // COBOL : tout ce qui suit un '*' en 7e colonne est un commentaire (format fixe).
  if (R.colonne7) {
    let pos = 0;
    while (pos < n) {
      const fin = jusquAuSaut(pos);
      const c7 = code[pos + 6];
      if (c7 === '*' || c7 === '/') blanc(pos, fin, true);
      pos = fin + 1;
    }
  }
  while (i < n) {
    const reste = code.slice(i, i + 4);
    let pris = false;
    for (const [ouv, fer] of R.bloc) {
      if (reste.startsWith(ouv)) {
        let j = code.indexOf(fer, i + ouv.length);
        j = j < 0 ? n : j + fer.length;
        blanc(i, j, true); i = j; pris = true; break;
      }
    }
    if (pris) continue;
    for (const marque of R.ligne) {
      if (reste.startsWith(marque)) {
        const j = jusquAuSaut(i);
        blanc(i, j, true); i = j; pris = true; break;
      }
    }
    if (pris) continue;
    const c = code[i];
    if (R.chaines.includes(c)) {
      if (c === "'" && prudente) {
        // Durée de vie Rust, apostrophe française : on n'ouvre que sur un vrai
        // littéral de caractère, ou sur une valeur d'attribut en balisage.
        const fermeture = code.indexOf("'", i + 1);
        const court = fermeture !== -1 && fermeture - i <= 4 && code.indexOf('\n', i + 1) > fermeture;
        const attribut = balisage && code[i - 1] === '=';
        if (!court && !attribut) { i++; continue; }
      }
      let j = i + 1;
      while (j < n && code[j] !== c) {
        if (code[j] === '\\') j++;
        if (code[j] === '\n' && c !== '`') break;
        j++;
      }
      blanc(i + 1, j, false); i = Math.min(j + 1, n); continue;
    }
    i++;
  }
  return { code: out.join(''), mange, mangeComm };
}

/* ------------------------------------------------------------------ marqueurs */

const mot = (w) => new RegExp('(^|[^A-Za-z0-9_$])' + w + '([^A-Za-z0-9_$]|$)');
const unDes = (liste) => (c) => liste.some((w) => mot(w).test(c));

// Certains mots ne désignent une fonction QUE dans certains langages. `sub` définit
// une fonction en Perl et en Visual Basic ; en assembleur, `sub ecx, 8` est
// l'instruction de SOUSTRACTION. Le retirer partout créait un faux négatif sur Perl,
// le garder partout un faux positif sur l'assembleur : il doit dépendre du langage.
const MOTS_PAR_LANGUE = {
  fonction: { perl: ['sub'], vb: ['sub'], powershell: ['function'], ruby: ['def'] },
};
const unDesSelonLangue = (id, liste) => (c, langue) => {
  const extra = (MOTS_PAR_LANGUE[id] && MOTS_PAR_LANGUE[id][langue]) || [];
  return liste.concat(extra).some((w) => mot(w).test(c));
};

// Les mots-clés qui prennent une parenthèse ne sont PAS des appels de fonction :
// `if (x)` ressemble à `f(x)` et n'en est pas un.
const MOTS_A_PARENTHESE = /(^|[^A-Za-z0-9_$])(if|for|while|switch|catch|elif|elseif|foreach|until|unless|when|with|return|print|match|do)\s*\(/;

// Chaque marqueur est cherché dans le code NEUTRALISÉ, sauf ceux marqués brut:true
// (les chaînes, l'indentation : on veut justement les voir) et ceux marqués
// comm:true, qui interrogent ce que la NEUTRALISATION a effacé.
//
// ⚠️ CHAQUE LISTE DE MOTS CI-DESSOUS A ÉTÉ ÉLAGUÉE APRÈS CONTRE-MESURE, et ce qu'on
// en a retiré vaut la peine d'être lu : `void` faisait passer un type de retour pour
// un mot désignant une fonction ; `sub` faisait de l'instruction de SOUSTRACTION de
// l'assembleur (`sub ecx, 8`) un mot désignant une fonction ; `do` faisait de
// `defmodule Truc do` d'Elixir — qui n'a aucune boucle — un langage à boucle, et de
// la notation `nom = do` de Haskell aussi ; `let` confondait la déclaration d'une
// variable en JavaScript avec la définition d'une fonction en OCaml. Un mot-clé qui
// existe dans plusieurs langages n'y a pas le même sens : c'est le sujet même de
// cette étude, et l'outil s'y était laissé prendre.
const MARQUEURS = [
  { id: 'fonction',  nom: 'un mot pour « fonction »',              test: unDesSelonLangue('fonction', ['function', 'func', 'fn', 'def', 'defn', 'defun', 'fun', 'proc', 'procedure', 'PROCEDURE', 'Function', 'Sub', 'lambda']) },
  { id: 'if',        nom: 'un mot pour « si »',                   test: unDes(['if', 'If', 'IF', 'si', 'when', 'cond', 'unless']) },
  { id: 'boucle',    nom: 'un mot pour « répéter »',              test: unDes(['for', 'For', 'FOR', 'while', 'While', 'WHILE', 'foreach', 'loop', 'repeat']) },
  { id: 'return',    nom: 'un mot pour « rendre »',               test: unDes(['return', 'Return', 'RETURN', 'ret', 'yield']) },
  { id: 'accolades', nom: 'des accolades { }',                    test: (c) => c.includes('{') && c.includes('}') },
  { id: 'parenth',   nom: 'des parenthèses ( )',                  test: (c) => c.includes('(') && c.includes(')') },
  {
    id: 'appel', nom: 'un appel de la forme nom(arguments)',
    // On efface d'abord les mots-clés à parenthèse, puis on cherche un appel.
    test: (c) => {
      let s = c;
      for (let k = 0; k < 60; k++) {
        const avant = s;
        s = s.replace(MOTS_A_PARENTHESE, '$1(');
        if (s === avant) break;
      }
      return /[A-Za-z_$][A-Za-z0-9_$]*\s*\(/.test(s);
    },
  },
  // `:=` affecte en Pascal, en Ada et en Go ; `=>` n'affecte nulle part.
  { id: 'egal',      nom: 'un = qui affecte',                     test: (c) => /:=/.test(c) || /[^=!<>+\-*/%&|^:]=[^=>]/.test(c) },
  { id: 'egalite',   nom: 'un opérateur == (deux signes égal)',   test: (c) => c.includes('==') },
  { id: 'pointvirg', nom: 'des ; en fin de ligne',                test: (c) => /;[ \t]*(\n|$)/.test(c) },
  { id: 'point',     nom: 'un point qui accède : a.b',            test: (c) => /[A-Za-z0-9_)\]]\.[A-Za-z_]/.test(c) },
  { id: 'crochets',  nom: 'des crochets [ ]',                     test: (c) => c.includes('[') && c.includes(']') },
  { id: 'chaine',    nom: 'une chaîne entre guillemets',          brut: true, test: (c) => /"[^"\n]*"/.test(c) || /'[^'\n]*'/.test(c) },
  // Ce marqueur ne se cherche pas par expression régulière : il DEMANDE à la
  // neutralisation si elle a effacé un commentaire, ce qui garantit qu'il emploie
  // exactement les marques de commentaire du langage lu.
  { id: 'commtr',    nom: 'un commentaire',                       comm: true },
  { id: 'indent',    nom: 'des lignes indentées',                 brut: true, test: (c) => /\n[ \t]+\S/.test(c) },
  // Ce qui NE se devine PAS : marqueurs propres à une minorité de langages.
  { id: 'typemot',   nom: 'un nom de type écrit en clair (int, bool…)', test: (c) => /(^|[^A-Za-z0-9_$])(int|float|double|char|bool|boolean|long|short|String|str|unsigned|integer|Integer|INTEGER|Int|Bool|Float|Double|Char)([^A-Za-z0-9_$]|$)/.test(c) },
  { id: 'fleche',    nom: 'une flèche -> ou =>',                  test: (c) => c.includes('->') || c.includes('=>') },
  // Un vrai sigil est SYSTÉMATIQUE : on en exige trois dans le bloc, et on écarte le
  // `@` en tête de ligne (annotations Java/Python/Scala) ainsi que le `%` et le `$`
  // qui suivent une parenthèse ou un crochet fermants (sélecteur Fortran, accès R).
  {
    id: 'sigil', nom: 'un préfixe collé aux noms ($ @ %)',
    test: (c) => {
      const trouves = c.match(/(^|[^A-Za-z0-9_)\]\n])[$@%][A-Za-z_]/gm) || [];
      return trouves.length >= 3;
    },
  },
  { id: 'etoile',    nom: 'une & ou une * collée à un nom',       test: (c) => /[^A-Za-z0-9_ \t][&*][A-Za-z_][A-Za-z0-9_]*/.test(c) },
  // Volontairement nommé par sa FORME et non par son sens : `::` sépare une portée en
  // C++, annonce un type en Haskell et en Julia, déclare en Fortran, et désigne le pas
  // d'une tranche en Python. Le compter comme « portée » serait faux quatre fois.
  { id: 'deuxpts',   nom: 'deux deux-points ::',                  test: (c) => c.includes('::') },
];

/* --------------------------------------------------- programmes ou pas ?
 * Toutes les valeurs de `language-…` ne désignent pas un langage de programmation.
 * Le critère retenu N'EST PAS « ça ne s'exécute pas » — ce serait faux pour SQL, que
 * ce site exécute pour de bon dans le navigateur : c'est « on n'y écrit pas de flot
 * de contrôle », pas de branchement, pas de boucle, pas d'appel de fonction que
 * l'auteur définirait lui-même. La distinction est faite ici à la main, une fois, et
 * elle est publiée : annoncer « N langages emploient des guillemets » sans dire que
 * plusieurs d'entre eux ne sont pas des langages, ce serait gonfler le chiffre.
 */
const NON_PROGRAMMES = new Set([
  'plaintext', 'markup', 'html', 'css', 'scss', 'json', 'yaml', 'markdown',
  'regex', 'http', 'docker', 'hcl', 'graphql', 'sql', 'text', 'toml', 'csv',
  'ini', 'cmake', 'makefile', 'xml', 'erb', 'twig',
]);

/* ⚠️ ÉTIQUETTES ÉCARTÉES parce qu'elles ne désignent AUCUN langage précis.
 * `clike` est la classe de repli de Prism : sous cette seule étiquette, le site
 * mélange du Zig (les 18 leçons de `pages/zig/`), du Rust et du C (`pages/wasm/`),
 * du Protocol Buffers et un schéma Prisma. Une ligne de mesure « clike » agrégerait
 * cinq langages et ne voudrait rien dire — et Zig, faute d'étiquette à lui, ne
 * figure dans aucune ligne. C'est un défaut du balisage des leçons, pas de la
 * mesure ; on l'écarte en le disant plutôt que de publier un chiffre composite.
 */
const ETIQUETTES_FLOUES = new Set(['clike', 'js', 'tsx']);

/* ------------------------------------------------------------------ programme */

// Un bloc « substantiel » : au moins SEUIL_LIGNES lignes non vides. Un extrait d'une
// ligne ne peut pas montrer de boucle ; le compter dirait surtout que les extraits du
// site sont courts, pas que le langage n'a pas de boucle.
const SEUIL_LIGNES = 5;
const lignesUtiles = (code) => code.split('\n').filter((l) => l.trim() !== '').length;

function mesurer() {
  const fichiers = listerLecons();
  const parLangue = new Map();
  let totalBlocs = 0, totalOctets = 0, totalMange = 0, totalSubst = 0;

  for (const f of fichiers) {
    for (const b of blocsDe(f)) {
      totalBlocs++; totalOctets += b.code.length;
      const neut = neutraliser(b.code, b.langue);
      totalMange += neut.mange;
      const subst = lignesUtiles(b.code) >= SEUIL_LIGNES;
      if (subst) totalSubst++;
      if (!parLangue.has(b.langue)) {
        parLangue.set(b.langue, { langue: b.langue, blocs: 0, substantiels: 0, octets: 0, hits: {}, hitsSub: {} });
      }
      const L = parLangue.get(b.langue);
      L.blocs++; L.octets += b.code.length;
      if (subst) L.substantiels++;
      for (const m of MARQUEURS) {
        // Un marqueur `comm` ne se cherche pas : il DEMANDE à la neutralisation si
        // elle a effacé un commentaire, avec les marques propres à ce langage-là.
        const vu = m.comm ? neut.mangeComm > 0 : m.test(m.brut ? b.code : neut.code, b.langue);
        if (vu) {
          L.hits[m.id] = (L.hits[m.id] || 0) + 1;
          if (subst) L.hitsSub[m.id] = (L.hitsSub[m.id] || 0) + 1;
        }
      }
    }
  }

  // Un langage n'entre dans la mesure que s'il a au moins SEUIL_BLOCS blocs
  // substantiels : conclure « le langage X n'a pas de boucle » sur 2 extraits d'une
  // ligne serait du bruit.
  const SEUIL_BLOCS = 20;
  const tous = [...parLangue.values()].filter((L) => !ETIQUETTES_FLOUES.has(L.langue));
  const floues = [...parLangue.values()].filter((L) => ETIQUETTES_FLOUES.has(L.langue))
    .sort((a, b) => b.substantiels - a.substantiels);
  const retenus = tous.filter((L) => L.substantiels >= SEUIL_BLOCS).sort((a, b) => b.substantiels - a.substantiels);
  const ecartes = tous.filter((L) => L.substantiels < SEUIL_BLOCS).sort((a, b) => b.substantiels - a.substantiels);

  const programmes = retenus.filter((L) => !NON_PROGRAMMES.has(L.langue));
  const formats = retenus.filter((L) => NON_PROGRAMMES.has(L.langue));

  // Deux chiffres différents, et l'étude doit dire lequel elle cite :
  //  · « possède »  = le marqueur apparaît AU MOINS UNE FOIS dans le langage ;
  //  · « courant »  = il apparaît dans au moins un TIERS de ses blocs substantiels.
  const SEUIL_PART = 1 / 3;
  const resumer = (groupe) => MARQUEURS.map((m) => {
    const possede = groupe.filter((L) => (L.hitsSub[m.id] || 0) > 0);
    const courants = groupe.filter((L) => (L.hitsSub[m.id] || 0) / L.substantiels >= SEUIL_PART);
    return {
      id: m.id, nom: m.nom,
      possede: possede.length,
      courant: courants.length,
      sur: groupe.length,
      absentDe: groupe.filter((L) => !(L.hitsSub[m.id] > 0)).map((L) => L.langue),
      courantDans: courants.map((L) => L.langue),
    };
  }).sort((a, b) => b.possede - a.possede || b.courant - a.courant);

  const nu = (L) => ({ langue: L.langue, blocs: L.blocs, substantiels: L.substantiels, octets: L.octets, hits: L.hits, hitsSub: L.hitsSub });

  return {
    fichiers: fichiers.length,
    redirections: fichiers.redirections || 0,
    blocs: totalBlocs,
    blocsSubstantiels: totalSubst,
    octets: totalOctets,
    partNeutralisee: totalOctets ? totalMange / totalOctets : 0,
    langagesVus: parLangue.size,
    seuilBlocs: SEUIL_BLOCS,
    seuilLignes: SEUIL_LIGNES,
    seuilPart: SEUIL_PART,
    programmes: programmes.map(nu),
    formats: formats.map(nu),
    ecartes: ecartes.map((L) => ({ langue: L.langue, blocs: L.blocs, substantiels: L.substantiels })),
    floues: floues.map((L) => ({ langue: L.langue, blocs: L.blocs, substantiels: L.substantiels })),
    marqueurs: resumer(programmes),
    marqueursFormats: resumer(formats),
  };
}

function main() {
  const d = mesurer();
  if (process.argv.includes('--json')) { console.log(JSON.stringify(d, null, 2)); return; }

  console.log(`${d.fichiers} leçons lues (${d.redirections} pages de redirection écartées) · ${d.blocs} blocs de code · ${(d.octets / 1024).toFixed(1)} Ko`);
  console.log(`${d.blocsSubstantiels} blocs d'au moins ${d.seuilLignes} lignes non vides (les seuls comptés ci-dessous)`);
  console.log(`${d.langagesVus} valeurs de class="language-…" rencontrées, dont ${d.programmes.length} langages de programmation`);
  console.log(`et ${d.formats.length} formats de données ou de mise en forme, avec au moins ${d.seuilBlocs} blocs substantiels chacun`);
  console.log(`neutralisation (chaînes + commentaires) : ${(d.partNeutralisee * 100).toFixed(1)} % des caractères effectivement changés avant recherche des mots-clés`);
  console.log('étiquettes floues écartées : ' + (d.floues.map((L) => `${L.langue}(${L.substantiels})`).join(' ') || 'aucune') + '\n');
  console.log(`SUR LES ${d.programmes.length} LANGAGES DE PROGRAMMATION            possèdent    courant dans`);
  for (const m of d.marqueurs) {
    console.log(
      '  ' + m.nom.padEnd(48) +
      String(m.possede).padStart(4) + '/' + m.sur +
      String(m.courant).padStart(11) + '/' + m.sur
    );
  }
  console.log('\nLANGAGES : ' + d.programmes.map((L) => `${L.langue}(${L.substantiels})`).join(' '));
  console.log('\nFORMATS (pas des programmes) : ' + d.formats.map((L) => `${L.langue}(${L.substantiels})`).join(' '));
  console.log('\nÉCARTÉS (< ' + d.seuilBlocs + ' blocs substantiels) : ' + d.ecartes.map((L) => `${L.langue}(${L.substantiels})`).join(' '));
}

if (require.main === module) main();
module.exports = { listerLecons, blocsDe, neutraliser, mesurer, MARQUEURS };
