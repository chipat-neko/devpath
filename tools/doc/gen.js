/* Générateur des leçons du cours « doc » (Lire la documentation).
   POURQUOI un générateur : les blocs de code publiés sont LITTÉRALEMENT les
   fichiers de tools/doc/code/, et les blocs de sortie sont LITTÉRALEMENT ce que
   leur exécution produit. Aucune sortie n'est écrite à la main.
   EN PLUS : le marqueur @@SLUGIFY@@ relit la fonction slugify() dans js/lecon.js
   à CHAQUE assemblage. Le code lu par l'apprenant est donc le code du site, pas
   une copie qui pourrait dériver. */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const RACINE = path.join(__dirname, '..', '..');
const CODE = path.join(__dirname, 'code');

/* ---- la fonction du site, relue à chaque assemblage ---------------------- */
function sourceSlugify() {
  const src = fs.readFileSync(path.join(RACINE, 'js', 'lecon.js'), 'utf8');
  const m = src.match(/function slugify\(s\) \{[\s\S]*?\n  \}/);
  if (!m) { console.error('ARRÊT : slugify() introuvable dans js/lecon.js.'); process.exit(1); }
  /* le fichier l'indente de 2 espaces (elle vit dans une IIFE) : on désindente. */
  return m[0].split('\n').map((l, i) => (i === 0 ? l : l.replace(/^ {2}/, ''))).join('\n');
}
const SLUGIFY = sourceSlugify();

/* Le formateur EXACT du Web Worker de js/runner.js — c'est ce que l'apprenant voit. */
function fmt(v) {
  if (typeof v === 'string') return v;
  if (v === undefined) return 'undefined';
  if (v === null) return 'null';
  if (typeof v === 'function') return v.toString();
  try { return JSON.stringify(v); } catch (e) { return String(v); }
}

const PLAFOND_MS = 5000;
const PLAFOND_NAVIGATEUR_MS = 3000;   // js/runner.js interrompt un bloc après 3 s
const MARGE_MS = 1500;
const DUREES = {};

/* Le navigateur, lui, n'arrête pas à la dernière ligne synchrone : js/runner.js
   attend encore 900 ms après le « done » du Worker, et affiche donc tout ce
   qu'une promesse ou un minuteur produit dans cet intervalle. Un générateur qui
   s'arrêterait au retour de runInNewContext publierait une sortie PLUS COURTE
   que celle que l'apprenant voit — l'exacte divergence que ce chantier traque.
   On draine donc la boucle d'événements tant que la sortie bouge. */
const ATTENTE_MS = 900;      // le même délai que js/runner.js
async function drainer(out, deja) {
  let stable = out.length, immobile = 0;
  while (immobile < ATTENTE_MS) {
    await new Promise((r) => setTimeout(r, 25));
    if (out.length !== stable) { stable = out.length; immobile = 0; } else immobile += 25;
  }
  return out.length - deja;
}

async function executer(src, nom) {
  const out = [];
  const push = function () { out.push(Array.prototype.slice.call(arguments).map(fmt).join(' ')); };
  const bac = { console: { log: push, warn: push, error: push, info: push, debug: push } };
  bac.globalThis = bac;
  bac.setTimeout = setTimeout; bac.clearTimeout = clearTimeout;
  bac.queueMicrotask = queueMicrotask;
  const t0 = Date.now();
  let incident = null;
  try { vm.runInNewContext(src, vm.createContext(bac), { timeout: PLAFOND_MS }); }
  catch (e) { incident = e.name + ': ' + e.message; out.push('!! ' + incident); }
  const ms = Date.now() - t0;
  if (!incident) {
    const tardives = await drainer(out, out.length);
    if (tardives) console.log('  ' + nom + ' : ' + tardives + ' ligne(s) produite(s) après la fin du code synchrone');
  }
  DUREES[nom || '?'] = ms;
  if (incident) {
    console.error('ARRÊT : ' + nom + ' a levé « ' + incident + ' ». Rien n a été écrit.');
    process.exit(1);
  }
  if (ms > PLAFOND_NAVIGATEUR_MS - MARGE_MS) {
    console.error('ARRÊT : ' + nom + ' a mis ' + ms + ' ms, trop près du plafond de ' +
      PLAFOND_NAVIGATEUR_MS + ' ms de js/runner.js.');
    process.exit(1);
  }
  return out.join('\n');
}

/* La règle qui a détruit des pages de ce site : tout « < » d'un bloc de code
   s'écrit &lt;. On échappe aussi & et > par symétrie. */
function ech(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
function blocCode(nom, src, langue) {
  return '<figure class="code-block" data-file="' + nom + '"><pre><code class="language-' +
    (langue || 'javascript') + '">' + ech(src.replace(/\n+$/, '')) + '</code></pre></figure>';
}
function blocSortie(nom, sortie) {
  return '<figure class="code-block" data-file="' + nom + '"><pre><code class="language-plaintext">' +
    ech(sortie) + '</code></pre></figure>';
}

const MESURES = {};
/* @@SPEC:x.txt@@ dans un BLOC DE CODE : le document de tools/doc/reference/ est
   injecte dans le programme sous forme de chaine JS. Le programme publie analyse
   donc le texte exact publie juste au-dessus de lui, jamais une copie. */
function litteralJs(texte) {
  return JSON.stringify(texte);
}
/* Le filtre BROWSER_ONLY de js/runner.js refuse de poser un bouton « Tester »
   sur un bloc contenant « document », « window », « process »… — y compris dans
   une CHAINE. Le document normatif publie contient le mot « document » : un
   programme qui l'embarquerait entier perdrait son bouton en silence.
   Mesure faite avant de conclure : assouplir ce filtre pour qu'il ignore les
   chaines ferait changer de verdict 96 blocs du site, dont des blocs Node qui
   gagneraient un bouton qu'ils ne peuvent pas honorer (« node:fs » vit dans une
   chaine). runner.js n'est donc PAS touche : on injecte les seules LIGNES
   NORMATIVES, et un garde-fou verifie qu'aucune ne porte un mot interdit. */
const BROWSER_ONLY_RUNNER = /(?:^|[^\w$À-ɏ])(document|window|localStorage|sessionStorage|alert|prompt|confirm|location|navigator|process|Buffer|__dirname|__filename)(?![\w$À-ɏ])|require\s*\(|module\.exports|\bexports\.|\bglobalThis\b|node:|new Worker|postMessage|SharedArrayBuffer|Atomics|importScripts/;

function lignesNormatives() {
  const texte = fs.readFileSync(path.join(__dirname, 'reference', 'quiz-format.txt'), 'utf8');
  const MOTS = ['MUST NOT', 'MUST', 'SHOULD NOT', 'SHOULD', 'MAY'];
  /* ⚠ le fichier se termine par un saut de ligne : split() rend une derniere
     entree VIDE, et le compte annoncait une ligne de plus que ce que le lecteur
     voit dans le bloc publie. Trouve par relecture adversariale. */
  const lignes = texte.replace(/\n$/, '').split(String.fromCharCode(10));
  const sections = [];
  lignes.forEach(function (l, i) {
    const m = l.match(/^(\d+(?:\.\d+)?)\.?\s+(\S.*)$/);
    if (m) sections.push({ cle: m[1] + '. ' + m[2].trim(), ligne: i + 1 });
  });
  const out = [];
  lignes.forEach(function (l, i) {
    if (!MOTS.some(function (m) { return l.indexOf(m) !== -1; })) return;
    let courante = '(hors section)';
    for (const s of sections) if (s.ligne <= i + 1) courante = s.cle;
    out.push({ ligne: i + 1, section: courante, texte: l.trim() });
  });
  const brut = out.map(function (o) { return o.section + ' ' + o.texte; }).join(' ');
  const interdit = brut.match(BROWSER_ONLY_RUNNER);
  if (interdit) {
    console.error('ARRÊT : les lignes normatives injectées contiennent « ' + interdit[0].trim() +
      ' », que js/runner.js interdit — le bloc publié perdrait son bouton « Tester ».');
    process.exit(1);
  }
  return { lignes: out, total: lignes.length, sections: sections.length };
}

function lireCode(fichier) {
  let brut = fs.readFileSync(path.join(CODE, fichier), 'utf8');
  if (brut.indexOf('/*@@SLUGIFY@@*/') !== -1) brut = brut.replace('/*@@SLUGIFY@@*/', SLUGIFY);
  brut = brut.replace(/\/\*@@SPEC@@\*\/null/g, function () {
    const r = lignesNormatives();
    return JSON.stringify(r, null, 1).split(String.fromCharCode(10)).join(String.fromCharCode(10));
  });
  return brut;
}
/* @@MESURE:cle@@ — un CHIFFRE DE CORPUS, calculé à l'assemblage et jamais écrit
   dans la prose. Né d'une relecture adversariale : les chiffres avaient été
   codés en dur, et la publication de la leçon les avait périmés le jour même,
   puisqu'elle s'ajoutait au corpus qu'elle décrivait. Désormais le corpus exclut
   le cours « doc », et la prose ne contient plus un seul de ces nombres. */
const RELEVE = require('./mesures/corpus-lib.js').releve();
const MENTIONS = (function () {
  const fsx = require('fs');
  const lib = require('./mesures/corpus-lib.js');
  const MOTIFS = [/documentation officielle/gi, /\bdoc officielle/gi, /\bMDN\b/g,
    /la sp[ée]cification/gi, /\bRFC\s?\d{3,5}\b/g];
  const pages = new Set(), cours = new Set();
  for (const f of lib.fichiersLecons()) {
    const html = fsx.readFileSync(f, 'utf8');
    const art = html.match(/<article class="prose"[\s\S]*?<\/article>/);
    if (!art) continue;
    if (MOTIFS.some((re) => re.test(art[0]))) {
      const rel = path.relative(lib.RACINE, f).replace(/\\/g, '/');
      pages.add(rel); cours.add(rel.split('/')[1]);
    }
    MOTIFS.forEach((re) => { re.lastIndex = 0; });
  }
  return { lecons: pages.size, cours: cours.size };
})();

function milliers(n) {
  return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '&nbsp;');
}
const MESURES_CORPUS = {
  lecons: milliers(RELEVE.lecons),
  redirections: milliers(RELEVE.redirections),
  titres: milliers(RELEVE.titres),
  avecId: milliers(RELEVE.avecId),
  horsAscii: milliers(RELEVE.horsAscii),
  pctHorsAscii: String(Math.round((RELEVE.horsAscii / RELEVE.sansId) * 100)),
  ligature: milliers(RELEVE.ligature),
  distincts: milliers(RELEVE.distincts),
  vides: milliers(RELEVE.vides.length),
  collisions: milliers(RELEVE.collisions.length),
  lignesFonction: milliers(RELEVE.lignesFonction),
  circonflexe: milliers(RELEVE.circonflexe),
  mentionsLecons: milliers(MENTIONS.lecons),
  mentionsCours: milliers(MENTIONS.cours),
};
function remplirMesures(corps) {
  return corps.replace(/@@MESURE:([a-zA-Z]+)@@/g, function (_, cle) {
    if (!MESURES_CORPUS.hasOwnProperty(cle)) {
      console.error('ARRÊT : mesure inconnue « ' + cle +' ».');
      process.exit(1);
    }
    return MESURES_CORPUS[cle];
  });
}

/* ------------------------------------------------------- VOCABULAIRE (D2) */
/* Les 82 fiches de la leçon 02 ne sont pas écrites dans le corps : elles sont
   ASSEMBLÉES depuis tools/doc/vocab/mots.json, et les chiffres de leurs pièges
   viennent de tools/doc/vocab/preuves.js — par exécution. Deux marqueurs :
     @@VOCAB:famille@@   le tableau d'une famille de mots ;
     @@VOCABNB:clé@@     un décompte du relevé (total, familles, absents…).   */
const MOTS = require('./vocab/mots.json');
const PREUVES = require('./vocab/preuves.js');
const PRESENCE = require('./mesures/presence.js').mesurer();
const PRES = new Map(PRESENCE.mots.map(function (m) { return [m.en, m]; }));

function resoudrePreuves(texte, ou) {
  return texte.replace(/\{\{(\w+)\}\}/g, function (_, cle) {
    try { return '<code>' + ech(PREUVES.evaluer(cle).affiche) + '</code>'; }
    catch (e) {
      console.error('ARRÊT : ' + ou + ' cite la preuve inconnue « ' + cle + ' ».');
      process.exit(1);
    }
  });
}

const FAMILLES = {
  promesse: 'Ce que la doc promet — et ce qu’elle ne promet pas',
  code: 'Ce que le code fait',
  donnees: 'Les données et leurs bords',
  temps: 'Le temps, l’ordre et la concurrence',
  casse: 'Quand ça casse',
  phrase: 'Les mots qui renversent la phrase',
};

function tableauVocab(famille) {
  const mots = MOTS.filter(function (m) { return m.famille === famille; });
  if (!mots.length) { console.error('ARRÊT : famille de vocabulaire inconnue « ' + famille + ' ».'); process.exit(1); }
  const lignes = mots.map(function (m) {
    const p = PRES.get(m.en) || { cours: 0 };
    const presence = p.cours === 0
      ? '<span class="vocab-abs" title="Ce mot n’apparaît dans aucune leçon du site.">absent du site</span>'
      : '<span class="vocab-pres">' + p.cours + ' cours</span>';
    return '                <tr>\n' +
      '                  <td><code>' + ech(m.en) + '</code>' + (m.naif
        ? '<br /><span class="vocab-naif">faux ami : ' + ech(m.naif) + '</span>' : '') + '</td>\n' +
      '                  <td><strong>' + ech(m.fr) + '</strong><br />' + resoudrePreuves(ech(m.sens), m.en) + '</td>\n' +
      '                  <td>' + (m.piege ? resoudrePreuves(ech(m.piege), m.en) : '—') + '</td>\n' +
      '                  <td class="vocab-presence">' + presence + '</td>\n' +
      '                </tr>';
  });
  return '              <div class="table-wrap">\n' +
    '                <table class="vocab-table">\n' +
    '                  <caption>' + FAMILLES[famille] + ' — ' + mots.length + ' mots. La dernière colonne dit dans combien des ' +
    PRESENCE.cours + ' autres cours du site le mot apparaît déjà.</caption>\n' +
    '                  <thead><tr><th scope="col">Mot</th><th scope="col">Sens technique</th><th scope="col">Le piège</th><th scope="col">Sur ce site</th></tr></thead>\n' +
    '                  <tbody>\n' + lignes.join('\n') + '\n                  </tbody>\n' +
    '                </table>\n' +
    '              </div>';
}

const VOCAB_NB = (function () {
  const absents = MOTS.filter(function (m) { return (PRES.get(m.en) || { cours: 0 }).cours === 0; });
  const avecPiege = MOTS.filter(function (m) { return !!m.piege; });
  const avecPreuve = MOTS.filter(function (m) { return m.preuves && m.preuves.length; });
  const fauxAmis = MOTS.filter(function (m) { return !!m.naif; });
  const err = PREUVES.corpusErreurs();
  const nbPreuves = new Set([].concat.apply([], MOTS.map(function (m) { return m.preuves || []; }))).size;
  return {
    total: MOTS.length,
    communs: MOTS.filter(function (m) { return m.dejaAuLexique; }).length,
    familles: Object.keys(FAMILLES).length,
    absents: absents.length,
    listeAbsents: absents.map(function (m) { return '<code>' + ech(m.en) + '</code>'; }).join(', '),
    avecPiege: avecPiege.length,
    avecPreuve: avecPreuve.length,
    preuves: nbPreuves,
    fauxAmis: fauxAmis.length,
    leconsCorpus: milliers(PRESENCE.lecons),
    coursCorpus: String(PRESENCE.cours),
    erreurs: String(err.total),
    erreursTypes: String(Object.keys(err.types).length),
    erreursTypeError: String(err.types.TypeError || 0),
    erreursIsNotA: String(err.isNotA),
    erreursCannot: String(err.cannot),
    lexiqueTotal: String(require('./vocab/gen-lexique-compte.js').total()),
    lexiqueBase: String(require('./vocab/gen-lexique-compte.js').base()),
  };
})();

/* ------------------------------------------------------- NORMATIF (D3) */
/* La lecon 03 confronte une SPECIFICATION aux 6 000 QCM du site. Comme pour le
   vocabulaire, aucun de ces chiffres n'est ecrit dans la prose : @@NORMNB:cle@@
   les injecte a l'assemblage, et verif-normatif echoue s'ils divergent. */
const CONF = require('./mesures/conformite-quiz.js').mesurer();
const SPEC_TXT = fs.readFileSync(path.join(__dirname, 'reference', 'quiz-format.txt'), 'utf8');
/* Le nombre de lignes du document, tel que le lecteur le compte : sans la
   chaine vide que split() ajoute apres le dernier saut de ligne. */
const NB_LIGNES_SPEC = SPEC_TXT.replace(/\n$/, '').split(String.fromCharCode(10)).length;

/* Les obligations (MUST et MUST NOT) des sections 4 a 6 — celles que la section
   8 rend obligatoires. A ne pas confondre avec le nombre de CLAUSES que l'outil
   sait tester : il en teste moins, et la lecon dit desormais pourquoi. */
const OBLIGATIONS_46 = (function () {
  const i4 = SPEC_TXT.lastIndexOf('4.  Block Syntax');
  const i7 = SPEC_TXT.lastIndexOf('7.  Authoring Recommendations');
  if (i4 < 0 || i7 < i4) {
    console.error('ARRÊT : sections 4 a 6 introuvables dans la specification.');
    process.exit(1);
  }
  let reste = SPEC_TXT.slice(i4, i7);
  let n = 0, pos;
  for (const mot of ['MUST NOT', 'MUST']) {
    while ((pos = reste.indexOf(mot)) !== -1) {
      n++;
      reste = reste.slice(0, pos) + ' '.repeat(mot.length) + reste.slice(pos + mot.length);
    }
  }
  return n;
})();

const NORM_NB = (function () {
  const cl = {};
  for (const c of CONF.clauses) {
    cl[c.id] = c;
  }
  const must = CONF.clauses.filter(function (c) { return c.niveau === 'MUST'; });
  const should = CONF.clauses.filter(function (c) { return c.niveau === 'SHOULD'; });
  const compteMot = function (mot) {
    let n = 0, reste = SPEC_TXT, pos;
    while ((pos = reste.indexOf(mot)) !== -1) { n++; reste = reste.slice(pos + mot.length); }
    return n;
  };
  const mustNot = compteMot('MUST NOT');
  const shouldNot = compteMot('SHOULD NOT');
  /* les mentions du site : combien de lecons renvoient a un document normatif */
  const libx = require('./mesures/corpus-lib.js');
  const M = { rfc: /\bRFC\s?\d{3,5}\b/g, spec: /la sp[ée]cification/gi,
    changelog: /changelog|journal des modifications/gi,
    semver: /semver|versionnage s[ée]mantique|version s[ée]mantique/gi,
    motsCles: /\bMUST\b|\bSHOULD\b/g };
  const cpt = {};
  for (const k in M) cpt[k] = 0;
  for (const f of libx.fichiersLecons()) {
    const html = fs.readFileSync(f, 'utf8');
    const art = html.match(/<article class="prose"[\s\S]*?<\/article>/);
    if (!art) continue;
    for (const k in M) { M[k].lastIndex = 0; if (M[k].test(art[0])) cpt[k]++; }
  }
  return {
    questions: milliers(CONF.questions),
    coursQuiz: String(CONF.cours),
    clausesMust: String(must.length),
    clausesShould: String(should.length),
    mustEchecs: String(must.reduce(function (a, c) { return a + c.echecs; }, 0)),
    s3Conformes: milliers(cl.S3.conformes),
    s3Echecs: milliers(cl.S3.echecs),
    s3Pct: ((cl.S3.conformes / cl.S3.total) * 100).toFixed(1).replace('.', ','),
    s3PctEchec: ((cl.S3.echecs / cl.S3.total) * 100).toFixed(1).replace('.', ','),
    s2Echecs: String(cl.S2.echecs),
    s1Conformes: milliers(cl.S1.conformes),
    a1Employe: milliers(cl.A1.total - cl.A1.echecs),
    lignesSpec: String(NB_LIGNES_SPEC),
    lignesNormatives: String(lignesNormatives().lignes.length),
    pctNormatif: String(Math.round((lignesNormatives().lignes.length / NB_LIGNES_SPEC) * 100)),
    /* Ce que le DOCUMENT porte comme obligations dans les sections que la
       section 8 rend obligatoires, et ce que l'outil sait en tester. Les deux
       chiffres different, et la lecon le dit maintenant : trois obligations de
       la section 4 lient le BLOC, deux de la section 6 lient le LECTEUR, et
       celle de la 5.1 porte sur une intention. */
    obligationsDoc: String(OBLIGATIONS_46),
    clausesTestables: String(must.length),
    motMust: String(compteMot('MUST') - mustNot),
    motMustNot: String(mustNot),
    motShould: String(compteMot('SHOULD') - shouldNot),
    motShouldNot: String(shouldNot),
    motMay: String(compteMot('MAY')),
    leconsRfc: String(cpt.rfc),
    leconsSpec: String(cpt.spec),
    leconsChangelog: String(cpt.changelog),
    leconsSemver: String(cpt.semver),
    leconsMotsCles: String(cpt.motsCles),
  };
})();

/* ------------------------------------------------------- RECHERCHE (D4) */
/* La leçon 04 confronte des réponses de forum DATÉES au moteur d'aujourd'hui,
   et des affirmations sans source à leur propre exécution. Comme partout dans
   ce cours, aucun de ces chiffres n'est écrit dans la prose : @@RECHNB:clé@@
   les injecte à l'assemblage, et verif-recherche échoue s'ils divergent.
   Trois tableaux sont montés de la même façon :
     @@CONSEILS@@      les réponses datées et leur verdict, calculé ;
     @@AFFIRMATIONS@@  les affirmations sans source et ce qu'elles obtiennent ;
     @@SQUELETTES@@    le message d'erreur, sa part stable et sa part à toi.  */
const CONSEILS_M = require('./reponses/conseils.js').mesurer();
const AFFIRM_M = require('./reponses/affirmations.js').mesurer();
const REQ_M = require('./mesures/requetes.js').mesurer();
const RECOURS_M = require('./mesures/recours.js').mesurer();

/* Un décimal à la française. Les chiffres de ce site s'écrivent avec une
   virgule, jamais avec un point. */
function decimal(n, chiffres) {
  return n.toFixed(chiffres === undefined ? 1 : chiffres).replace('.', ',');
}

const LIB_COURT = {
  casse: 'ne s’exécute plus',
  jamais: 'faux dès l’origine',
  piege: 'marche, mais troué',
  raison: 'la raison a disparu',
  depasse: 'il existe plus court',
  bon: 'toujours bon',
};

function tableauConseils() {
  const lignes = CONSEILS_M.conseils.map(function (c) {
    const detail = [];
    if (c.jamais) detail.push(c.jamais.quoi);
    if (c.contre) detail.push(c.contre.quoi);
    if (c.raisonMorte) detail.push(c.raisonMorte.texte);
    if (c.autreRaison) detail.push(c.autreRaison.texte);
    if (c.remplacant) detail.push('aujourd’hui : <code>' + ech(c.remplacant.nom) + '</code>');
    const classe = (c.verdict === 'bon') ? 'vocab-pres' : 'vocab-abs';
    return '                <tr>\n' +
      '                  <td>' + c.annee + '</td>\n' +
      '                  <td><em>' + ech(c.question) + '</em><br /><code>' + c.code + '</code></td>\n' +
      '                  <td><span class="' + classe + '">' + LIB_COURT[c.verdict] + '</span></td>\n' +
      '                  <td>' + (detail.length ? detail.join('&nbsp;; ') : '—') + '</td>\n' +
      '                </tr>';
  });
  return '              <div class="table-wrap">\n' +
    '                <table class="vocab-table">\n' +
    '                  <caption>Les ' + CONSEILS_M.total + ' réponses du corpus, de ' + CONSEILS_M.anneeMin +
    ' à ' + CONSEILS_M.anneeMax + ', et le verdict rendu par l’exécution — pas par l’opinion. ' +
    'Aucune n’est recopiée&nbsp;: elles sont rédigées ici dans la forme de l’époque, et c’est le ' +
    '<strong>code conseillé</strong> qui est réel.</caption>\n' +
    '                  <thead><tr><th scope="col">Année</th><th scope="col">La question, et le code conseillé</th>' +
    '<th scope="col">Verdict</th><th scope="col">Ce que l’exécution montre</th></tr></thead>\n' +
    '                  <tbody>\n' + lignes.join('\n') + '\n                  </tbody>\n' +
    '                </table>\n' +
    '              </div>';
}

function tableauAffirmations() {
  const lignes = AFFIRM_M.affirmations.map(function (a) {
    const classe = a.vraie ? 'vocab-pres' : 'vocab-abs';
    return '                <tr>\n' +
      '                  <td>' + a.texte + '</td>\n' +
      '                  <td><span class="' + classe + '">' + (a.vraie ? 'vraie' : 'fausse') + '</span></td>\n' +
      '                  <td>' + (a.vraie ? '—' : '<code>' + ech(a.annonce) + '</code> annoncé, <code>' +
        ech(a.obtenu) + '</code> obtenu' + (a.leve ? ' <em>(elle lève)</em>' : '')) + '</td>\n' +
      '                </tr>';
  });
  return '              <div class="table-wrap">\n' +
    '                <table class="vocab-table">\n' +
    '                  <caption>Les ' + AFFIRM_M.total + ' affirmations du corpus, et ce que le moteur en fait. ' +
    'Elles sont écrites ici, dans le registre assuré de ce qui ne cite pas sa source&nbsp;: la ' +
    '<strong>proportion</strong> de fausses ne mesure donc rien — c’est celle qu’on a choisie. Ce qui est mesuré ' +
    'est en dessous du tableau.</caption>\n' +
    '                  <thead><tr><th scope="col">L’affirmation</th><th scope="col">Verdict</th>' +
    '<th scope="col">L’écart</th></tr></thead>\n' +
    '                  <tbody>\n' + lignes.join('\n') + '\n                  </tbody>\n' +
    '                </table>\n' +
    '              </div>';
}

function tableauSquelettes() {
  const lignes = REQ_M.v1.paires.map(function (p) {
    return '                <tr>\n' +
      '                  <td>' + ech(p.nom) + '</td>\n' +
      '                  <td><code>' + ech(p.messageA) + '</code></td>\n' +
      '                  <td><code>' + ech(p.squelette) + '</code></td>\n' +
      '                  <td>' + p.pctStable + '&nbsp;%</td>\n' +
      '                </tr>';
  });
  return '              <div class="table-wrap">\n' +
    '                <table class="vocab-table">\n' +
    '                  <caption>' + REQ_M.v1.total + ' défauts provoqués <strong>deux fois</strong>, avec des ' +
    'noms de variables sans rapport. La troisième colonne est ce qui survit à la comparaison des deux ' +
    'messages&nbsp;: c’est la requête à taper, et elle est calculée, pas rédigée. ' +
    '<strong>Le nom de la famille</strong> (<code>TypeError</code>, <code>ReferenceError</code>) ' +
    '<strong>n’y figure pas</strong>&nbsp;: la console l’affiche devant chaque message, et l’ajouter ' +
    'à la requête restreint utilement la recherche.</caption>\n' +
    '                  <thead><tr><th scope="col">Le défaut</th><th scope="col">Le message, sans son type</th>' +
    '<th scope="col">Ce qu’il faut chercher</th><th scope="col">Part du moteur</th></tr></thead>\n' +
    '                  <tbody>\n' + lignes.join('\n') + '\n                  </tbody>\n' +
    '                </table>\n' +
    '              </div>';
}

const RECH_NB = (function () {
  const c = CONSEILS_M, a = AFFIRM_M, r = REQ_M, s = RECOURS_M;
  return {
    /* les réponses datées */
    conseils: String(c.total),
    anneeMin: String(c.anneeMin),
    anneeMax: String(c.anneeMax),
    /* ⚠ Pas de clé « ageMax » ici, et c'est délibéré. Elle a existé, calculée
       avec new Date().getFullYear() : dans une page GÉNÉRÉE PUIS COMMITÉE, un
       tel nombre est faux dès le 1er janvier suivant, sans que rien ne casse
       ni qu'aucun vérificateur le voie. La leçon parle des bornes du corpus
       (anneeMin, anneeMax), qui sont des faits, pas des durées depuis
       aujourd'hui. C'est très exactement le sujet de la phase E du chantier. */
    conseilsCasse: String(c.parVerdict.casse),
    conseilsJamais: String(c.parVerdict.jamais),
    conseilsPiege: String(c.parVerdict.piege),
    conseilsRaison: String(c.parVerdict.raison),
    conseilsDepasse: String(c.parVerdict.depasse),
    conseilsBon: String(c.parVerdict.bon),
    conseilsARevoir: String(c.aRevoir),
    conseilsRemplacant: String(c.avecRemplacant),
    /* les affirmations sans source */
    aff: String(a.total),
    affVraies: String(a.vraies),
    affFausses: String(a.fausses),
    affLevent: String(a.fausesQuiLevent),
    affMotsVraies: decimal(a.motsVraies),
    affMotsFausses: decimal(a.motsFausses),
    affEcartMots: decimal(a.ecartMots),
    affEcartCar: String(Math.round(a.ecartCar)),
    affEcartPct: decimal(a.ecartPct),
    affCarVraies: String(Math.round(a.carVraies)),
    affCarFausses: String(Math.round(a.carFausses)),
    affPrudence: String(a.avecPrudence),
    affSource: String(a.avecSource),
    /* la formulation d'une requête */
    reqPaires: String(r.v1.total),
    reqUnites: String(r.v1.unites),
    reqStables: String(r.v1.stables),
    reqVariables: String(r.v1.variables),
    reqPctStable: String(r.v1.pctStable),
    reqPctVariable: String(100 - r.v1.pctStable),
    reqIdentiques: String(r.v1.identiques),
    causes: String(r.v2.nbCauses),
    causesDistincts: String(r.v2.messagesDistincts),
    voisins: String(r.v2.voisins.length),
    voisinsDistincts: String(r.v2.voisinsDistincts),
    /* Ce que le site fait déjà. ⚠ Ces clés ont été REFAITES DEUX FOIS : les
       premières comptaient « 80 leçons qui renvoient l'apprenant ailleurs », un
       chiffre fabriqué par des faux positifs (« stack overflow » = débordement
       de pile, « assistant de configuration », « ne cherche pas la
       documentation » compté comme un renvoi). Ne restent que des faits DURS,
       échantillonnés à la main — voir l'en-tête de mesures/recours.js. */
    siteLecons: milliers(s.lecons),
    sitePortes: String(s.portes),
    siteCoursPortes: String(s.coursPorte),
    sitePourMille: String(s.pourMille).replace('.', ','),
    siteSansPorte: milliers(s.sansPorte),
    siteNomment: String(s.cpt.nomment),
  };
})();

function remplirRecherche(corps) {
  return corps
    .replace(/@@CONSEILS@@/g, function () { return tableauConseils(); })
    .replace(/@@AFFIRMATIONS@@/g, function () { return tableauAffirmations(); })
    .replace(/@@SQUELETTES@@/g, function () { return tableauSquelettes(); })
    .replace(/@@RECHNB:([a-zA-Z0-9]+)@@/g, function (_, cle) {
      if (!RECH_NB.hasOwnProperty(cle)) {
        console.error('ARRÊT : décompte de recherche inconnu « ' + cle + ' ».');
        process.exit(1);
      }
      return RECH_NB[cle];
    });
}

function remplirNorm(corps) {
  return corps.replace(/@@NORMNB:([a-zA-Z0-9]+)@@/g, function (_, cle) {
    if (!NORM_NB.hasOwnProperty(cle)) {
      console.error('ARRÊT : décompte normatif inconnu « ' + cle + ' ».');
      process.exit(1);
    }
    return NORM_NB[cle];
  });
}

function remplirVocab(corps) {
  return corps
    .replace(/@@VOCAB:([a-z]+)@@/g, function (_, f) { return tableauVocab(f); })
    .replace(/@@VOCABNB:([a-zA-Z]+)@@/g, function (_, cle) {
      if (!VOCAB_NB.hasOwnProperty(cle)) {
        console.error('ARRÊT : décompte de vocabulaire inconnu « ' + cle + ' ».');
        process.exit(1);
      }
      return VOCAB_NB[cle];
    });
}

/* @@TEXTE:x.txt@@ — un document lu tel quel dans tools/doc/reference/. C'est ainsi
   que la page de référence en anglais est publiée : elle vit dans un fichier, elle
   est vérifiée dans ce fichier, et la page ne peut pas en dériver. */
function remplirTextes(corps) {
  return corps.replace(/@@TEXTE:([a-z0-9-]+\.txt)@@/g, function (_, fichier) {
    const t = fs.readFileSync(path.join(__dirname, 'reference', fichier), 'utf8');
    return blocSortie(fichier, t.replace(/\n+$/, ''));
  });
}

/* asynchrone depuis D2 : une sortie peut arriver après la dernière ligne
   synchrone, et il faut l'attendre (voir drainer()). On remplace donc en deux
   temps — repérer, exécuter, puis substituer. */
async function remplirMarqueurs(corps) {
  let texte = remplirRecherche(remplirNorm(remplirVocab(remplirTextes(remplirMesures(corps)))));
  const marqueurs = [...texte.matchAll(/@@(CODE|SORTIE):([a-z0-9-]+\.js)@@/g)];
  const remplacements = new Map();
  for (const m of marqueurs) {
    if (remplacements.has(m[0])) continue;
    const src = lireCode(m[2]);
    if (m[1] === 'CODE') { remplacements.set(m[0], blocCode(m[2], src)); continue; }
    const sortie = await executer(src, m[2]);
    MESURES[m[2]] = sortie.split('\n').length;
    remplacements.set(m[0], blocSortie(m[2].replace(/\.js$/, '.txt'), sortie));
  }
  for (const [cle, val] of remplacements) texte = texte.split(cle).join(val);
  return texte;
}

/* ------------------------------------------------------------------ gabarit */
function page(m, corps) {
  const nav = m.num;
  const S = '<' + '/script>';
  return '<!DOCTYPE html>\n' +
'<html lang="fr" data-theme="light">\n' +
'  <head>\n' +
'    <meta charset="utf-8" />\n' +
'    <meta name="viewport" content="width=device-width, initial-scale=1" />\n' +
'    <title>' + m.titreTexte + ' — Leçon ' + nav + ' · Cours Lire la documentation — Syntaxe</title>\n' +
'    <meta name="description" content="' + m.description + '" />\n' +
'    <link rel="icon" type="image/svg+xml" href="../../assets/img/favicon.svg" />\n' +
'\n' +
'    <script src="../../js/theme.js">' + S + '\n' +
'\n' +
'    <link rel="stylesheet" href="../../css/fonts.css" />\n' +
'\n' +
'    <link rel="stylesheet" href="../../css/variables.css" />\n' +
'    <link rel="stylesheet" href="../../css/base.css" />\n' +
'    <link rel="stylesheet" href="../../css/layout.css" />\n' +
'    <link rel="stylesheet" href="../../css/components.css" />\n' +
'    <link rel="stylesheet" href="../../css/pages.css" />\n' +
'  </head>\n' +
'\n' +
'  <body data-course="doc" data-lesson="lecon-' + nav + '.html">\n' +
'    <a class="skip-link" href="#contenu">Aller au contenu</a>\n' +
'\n' +
'    <header class="site-header">\n' +
'      <div class="container--wide container site-header__inner">\n' +
'        <a class="brand" href="../../index.html" aria-label="Syntaxe — accueil">\n' +
'          <svg class="brand__mark" viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">\n' +
'            <rect x="3" y="3" width="26" height="26" rx="8" /><path d="M13 12 L9 16 L13 20" /><path d="M19 12 L23 16 L19 20" />\n' +
'          </svg>\n' +
'          <span>Syntaxe<span class="brand__dot" aria-hidden="true">.</span></span>\n' +
'        </a>\n' +
'        <button class="nav-toggle" data-nav-toggle aria-expanded="false" aria-controls="primary-nav" aria-label="Ouvrir le menu de navigation">\n' +
'          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M3 6h18M3 12h18M3 18h18" /></svg>\n' +
'        </button>\n' +
'        <nav class="primary-nav" id="primary-nav" aria-label="Navigation principale">\n' +
'          <a href="../../index.html">Accueil</a>\n' +
'          <a href="../catalogue.html">Catalogue</a>\n' +
'        </nav>\n' +
'        <div class="header-actions">\n' +
'          <button class="theme-toggle" data-theme-toggle aria-label="Activer le thème sombre">\n' +
'            <svg class="icon icon-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" /></svg>\n' +
'            <svg class="icon icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="4.5" /><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4" /></svg>\n' +
'          </button>\n' +
'        </div>\n' +
'      </div>\n' +
'    </header>\n' +
'\n' +
'    <div class="reading-progress" data-reading-progress aria-hidden="true"></div>\n' +
'\n' +
'    <main id="contenu">\n' +
'      <div class="container container--wide">\n' +
'        <nav class="breadcrumb-nav" aria-label="Fil d\'Ariane">\n' +
'          <ol class="breadcrumb">\n' +
'            <li><a href="../../index.html">Accueil</a></li>\n' +
'            <li><a href="../catalogue.html">Catalogue</a></li>\n' +
'            <li><a href="cours.html">Lire la documentation</a></li>\n' +
'            <li aria-current="page">Leçon ' + nav + '</li>\n' +
'          </ol>\n' +
'        </nav>\n' +
'\n' +
'        <div class="lesson-layout">\n' +
'          <aside class="lesson-rail lesson-coursenav" data-coursenav-host aria-label="Plan du cours">\n' +
'            <button class="coursenav-toggle" data-coursenav-toggle aria-expanded="false">\n' +
'              <span>Plan du cours</span>\n' +
'              <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M6 9l6 6 6-6" /></svg>\n' +
'            </button>\n' +
'            <div class="coursenav-panel"><div data-coursenav></div></div>\n' +
'          </aside>\n' +
'\n' +
'          <div class="lesson-main">\n' +
'            <header class="lesson-header">\n' +
'              <p class="kicker">' + m.module + '</p>\n' +
'              <h1 class="lesson-header__title">' + m.titre + '</h1>\n' +
'              <div class="meta-row">\n' +
'                <span class="duration">\n' +
'                  <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>\n' +
'                  ~' + m.minutes + ' min\n' +
'                </span>\n' +
'                <span class="dot-sep"><span class="pill pill--' + m.niveau + '">' + m.niveauTexte + '</span></span>\n' +
'                <span class="dot-sep">' + m.prerequis + '</span>\n' +
'              </div>\n' +
'\n' +
'              <div class="objectives">\n' +
'                <p class="objectives__title">À la fin de cette leçon, tu sauras</p>\n' +
'                <ul>\n' +
m.objectifs.map(function (o) { return '                  <li>' + o + '</li>'; }).join('\n') + '\n' +
'                </ul>\n' +
'              </div>\n' +
'            </header>\n' +
'\n' +
'            <details class="toc-inline" open>\n' +
'              <summary>Sommaire de la leçon</summary>\n' +
'              <nav class="toc" aria-label="Sommaire de la leçon"><div data-toc></div></nav>\n' +
'            </details>\n' +
'\n' +
'            <article class="prose">\n' +
corps + '\n' +
'\n' +
'              <button class="btn btn--primary" data-complete-toggle aria-pressed="false">\n' +
'                <span>Marquer comme terminée</span>\n' +
'              </button>\n' +
'\n' +
'              <nav class="lesson-nav" data-lesson-nav aria-label="Navigation entre leçons"></nav>\n' +
'            </article>\n' +
'          </div>\n' +
'\n' +
'          <aside class="lesson-rail lesson-toc-rail" aria-label="Sommaire">\n' +
'            <p class="toc__title">Sur cette page</p>\n' +
'            <nav class="toc" aria-label="Sommaire de la leçon"><div data-toc></div></nav>\n' +
'          </aside>\n' +
'        </div>\n' +
'      </div>\n' +
'    </main>\n' +
'\n' +
'    <footer class="site-footer">\n' +
'      <div class="container">\n' +
'        <div class="site-footer__bottom">\n' +
'          <span>© <span data-year>2026</span> Syntaxe. Projet de démonstration.</span>\n' +
'          <span><a href="cours.html">← Retour au programme du cours</a></span>\n' +
'        </div>\n' +
'      </div>\n' +
'    </footer>\n' +
'\n' +
'    <script src="../../js/data.js" defer>' + S + '\n' +
'    <script src="../../js/main.js" defer>' + S + '\n' +
'    <script src="../../js/lecon.js" defer>' + S + '\n' +
'    <script src="../../js/runner.js" defer>' + S + '\n' +
'    <script src="../../assets/vendor/prism/prism-core.min.js" defer>' + S + '\n' +
'    <script src="../../assets/vendor/prism/prism-clike.min.js" defer>' + S + '\n' +
'    <script src="../../assets/vendor/prism/prism-javascript.min.js" defer>' + S + '\n' +
'  </body>\n' +
'</html>\n';
}

/* ---------------------------------------------------------------- métadonnées */
const META = require('./meta.json');
const sortie = path.join(RACINE, 'pages', 'doc');
if (!fs.existsSync(sortie)) fs.mkdirSync(sortie, { recursive: true });

(async function () {
  for (const m of META) {
    const src = path.join(__dirname, 'corps', 'l' + Number(m.num) + '.html');
    if (!fs.existsSync(src)) { console.log('corps absent, leçon ' + m.num + ' non générée'); continue; }
    const corps = await remplirMarqueurs(fs.readFileSync(src, 'utf8'));
    const reste = corps.match(/@@[A-Z]+:[^@]*@@/);
    if (reste) { console.error('ARRÊT : marqueur non résolu « ' + reste[0] + ' » dans la leçon ' + m.num + '.'); process.exit(1); }
    if (/\{\{\w+\}\}/.test(corps)) {
      console.error('ARRÊT : preuve non résolue dans la leçon ' + m.num + '.'); process.exit(1);
    }
    const html = page(m, corps.replace(/\n+$/, ''));
    const cible = path.join(sortie, 'lecon-' + m.num + '.html');
    fs.writeFileSync(cible, html, 'utf8');
    const visible = html.replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ')
      .replace(/<[^>]*>/g, ' ').replace(/&[a-z]+;|&#\d+;/gi, ' ').replace(/\s+/g, ' ').trim();
    console.log('écrit ' + cible + '  ' + Math.round(html.length / 1024) + ' Ko, ' + visible.split(/\s+/).length + ' mots visibles');
  }
  console.log('lignes de sortie insérées : ' + JSON.stringify(MESURES));
  const lent = Object.keys(DUREES).sort(function (a, b) { return DUREES[b] - DUREES[a]; }).slice(0, 3);
  console.log('le plus lent : ' + lent.map(function (n) { return n + ' ' + DUREES[n] + ' ms'; }).join(', ') +
    '  (plafond du navigateur : ' + PLAFOND_NAVIGATEUR_MS + ' ms)');
})();
