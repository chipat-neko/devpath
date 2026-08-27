'use strict';

/**
 * tools/verif-alternatives.js — Le bloc « Une autre façon de le faire », contrôlé.
 *
 * POURQUOI CE SCRIPT EXISTE
 * -------------------------
 * La phase E du chantier V14 ajoute UN format et un seul : un encadré qui montre une
 * SECONDE façon d'écrire la même chose, avec trois faits obligatoires — ce qu'elle
 * coûte, ce qu'elle apporte, quand la préférer. Un format n'a de valeur que s'il est
 * le même partout : sans contrôle, la troisième leçon écrira « Avantages », la
 * dixième oubliera le coût, et le lecteur ne saura plus quoi attendre du cadre.
 *
 * Deux fautes de ce chantier ont dicté la forme de cet outil :
 *  · une classe mal orthographiée ne se voit PAS — le bloc se rend en texte nu et
 *    reste « joli » (V13 : un jeton de fond employé comme couleur de texte). On
 *    vérifie donc que chaque classe employée existe VRAIMENT dans le CSS.
 *  · un contrôle qui teste moins que la chose contrôlée rend un vert par vacuité
 *    (V14/B5 : 142 cas mesurés contre 144 joués). D'où le mode `--mutations` :
 *    il injecte des fautes connues et exige que chacune soit VUE.
 *
 * CE QU'IL VÉRIFIE, bloc par bloc
 *   1. l'aside porte `class="variante"` ET un nom accessible (`aria-label`) ;
 *   2. l'en-tête : une icône décorative (`aria-hidden`) + le titre exact ;
 *   3. une phrase d'annonce non vide qui dit CE QU'EST la variante ;
 *   4. au moins un bloc de code nommé (`data-file`) et surligné (`language-…`) ;
 *   5. les TROIS faits, dans l'ordre, avec des libellés exacts et une réponse
 *      d'au moins 80 caractères chacune ;
 *   6. aucun titre `<h…>` dedans (le bloc ne doit pas polluer le sommaire) ;
 *   7. les balises du bloc sont équilibrées, et le bloc vit dans `<article class="prose">` ;
 *   8. au plus 3 blocs par leçon : ce format montre un choix, pas un catalogue.
 *
 * USAGE
 *   node tools/verif-alternatives.js              tout le site
 *   node tools/verif-alternatives.js --liste      + la liste des leçons couvertes
 *   node tools/verif-alternatives.js --mutations  s'éprouve sur des fautes injectées
 * Code de sortie : 1 s'il reste une faute (ou une mutation non vue).
 */

var fs = require('fs');
var path = require('path');

var RACINE = path.resolve(__dirname, '..');
var PAGES = path.join(RACINE, 'pages');

var TITRE = 'Une autre façon de le faire';
var FAITS = ['Ce qu’elle coûte', 'Ce qu’elle apporte', 'Quand la préférer'];
var MIN_LEAD = 60;
var MIN_FAIT = 80;
var MAX_PAR_LECON = 3;

/* --------------------------------------------------------------- utilitaires */

function lire(f) { return fs.readFileSync(f, 'utf8'); }

function lecons() {
  var out = [];
  fs.readdirSync(PAGES).forEach(function (d) {
    var dir = path.join(PAGES, d);
    var st;
    try { st = fs.statSync(dir); } catch (e) { return; }
    if (!st.isDirectory()) return;
    fs.readdirSync(dir).forEach(function (f) {
      if (/^lecon-\d+\.html$/.test(f)) out.push(path.join(dir, f));
    });
  });
  return out.sort();
}

/* Extrait les <aside class="variante"> … </aside> en comptant les <aside>
   imbriqués : une regex non gloutonne couperait au premier </aside> venu. */
function extraireBlocs(html) {
  var blocs = [];
  var re = /<aside\b[^>]*\bclass="([^"]*)"[^>]*>/g;
  var m;
  while ((m = re.exec(html))) {
    if (!/(^|\s)variante(\s|$)/.test(m[1])) continue;
    var i = m.index;
    var prof = 0;
    var tag = /<\/?aside\b/g;
    tag.lastIndex = i;
    var t, fin = -1;
    while ((t = tag.exec(html))) {
      if (t[0] === '<aside') prof++;
      else if (--prof === 0) { fin = t.index + '</aside>'.length; break; }
    }
    if (fin === -1) { blocs.push({ debut: i, fin: html.length, html: html.slice(i), tronque: true }); break; }
    blocs.push({ debut: i, fin: fin, html: html.slice(i, fin), tronque: false });
  }
  return blocs;
}

function texteNu(s) {
  return s.replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos;|&#39;/g, '’')
    .replace(/\s+/g, ' ').trim();
}

/* Apostrophes : le site mélange ' et ’ ; on compare sur une forme normalisée. */
function norm(s) { return texteNu(s).replace(/['’ʼ]/g, '’'); }

/* Les classes réellement définies dans le CSS (sélecteurs `.variante…`). */
function classesCss() {
  var css = lire(path.join(RACINE, 'css', 'components.css'));
  var set = Object.create(null);
  var re = /\.(variante[\w-]*)/g, m;
  while ((m = re.exec(css))) set[m[1]] = true;
  return set;
}

/* ------------------------------------------------------------------ contrôle */

function controler(html, rel, defs) {
  var fautes = [];
  var blocs = extraireBlocs(html);
  var dansProse = html.indexOf('<article class="prose">');

  if (blocs.length > MAX_PAR_LECON) {
    fautes.push(rel + ' : ' + blocs.length + ' blocs « variante » (maximum ' + MAX_PAR_LECON + ' : un choix, pas un catalogue)');
  }

  blocs.forEach(function (b, n) {
    var ou = rel + ' [bloc ' + (n + 1) + ']';
    var h = b.html;

    if (b.tronque) { fautes.push(ou + ' : <aside> jamais refermé'); return; }
    if (dansProse === -1 || b.debut < dansProse) {
      fautes.push(ou + ' : le bloc est hors de <article class="prose">');
    }

    /* 1. nom accessible */
    var ouverture = h.slice(0, h.indexOf('>') + 1);
    var aria = /aria-label="([^"]*)"/.exec(ouverture);
    if (!aria) fautes.push(ou + ' : <aside> sans aria-label (le repère complémentaire n’a pas de nom)');
    else if (norm(aria[1]) !== norm(TITRE)) fautes.push(ou + ' : aria-label = « ' + aria[1] + ' » au lieu de « ' + TITRE + ' »');

    /* 2. en-tête : icône décorative + titre exact */
    var svg = /<svg\b[^>]*class="[^"]*\bvariante__icon\b[^"]*"[^>]*>/.exec(h);
    if (!svg) fautes.push(ou + ' : pas d’icône .variante__icon dans l’en-tête');
    else if (svg[0].indexOf('aria-hidden="true"') === -1) fautes.push(ou + ' : l’icône n’est pas aria-hidden (elle serait lue par le lecteur d’écran)');

    var titre = /<p class="[^"]*\bvariante__title\b[^"]*">([\s\S]*?)<\/p>/.exec(h);
    if (!titre) fautes.push(ou + ' : pas de <p class="variante__title">');
    else if (norm(titre[1]) !== norm(TITRE)) fautes.push(ou + ' : titre = « ' + texteNu(titre[1]) + ' » au lieu de « ' + TITRE + ' »');

    /* 3. phrase d'annonce */
    var lead = /<p class="[^"]*\bvariante__lead\b[^"]*">([\s\S]*?)<\/p>/.exec(h);
    if (!lead) fautes.push(ou + ' : pas de <p class="variante__lead"> (la variante n’est pas annoncée)');
    else if (texteNu(lead[1]).length < MIN_LEAD) {
      fautes.push(ou + ' : annonce trop courte (' + texteNu(lead[1]).length + ' caractères, minimum ' + MIN_LEAD + ')');
    }

    /* 4. le code de la variante */
    var codes = h.match(/<figure class="code-block"[^>]*>/g) || [];
    if (!codes.length) fautes.push(ou + ' : aucun <figure class="code-block"> (une variante se MONTRE)');
    codes.forEach(function (f) {
      if (f.indexOf('data-file="') === -1) fautes.push(ou + ' : bloc de code sans data-file');
    });
    if (codes.length && !/<code class="language-[\w-]+"/.test(h)) {
      fautes.push(ou + ' : bloc de code sans class="language-…" (pas de coloration)');
    }

    /* 5. les trois faits, dans l'ordre */
    var dl = /<dl class="[^"]*\bvariante__facts\b[^"]*">([\s\S]*?)<\/dl>/.exec(h);
    if (!dl) {
      fautes.push(ou + ' : pas de <dl class="variante__facts"> (les trois faits manquent)');
    } else {
      var dts = (dl[1].match(/<dt>([\s\S]*?)<\/dt>/g) || []).map(function (x) { return norm(x); });
      var dds = (dl[1].match(/<dd>([\s\S]*?)<\/dd>/g) || []).map(function (x) { return texteNu(x); });
      if (dts.length !== 3 || dds.length !== 3) {
        fautes.push(ou + ' : ' + dts.length + ' libellé(s) et ' + dds.length + ' réponse(s) — il en faut exactement 3 de chaque');
      }
      FAITS.forEach(function (attendu, k) {
        if (dts[k] === undefined) return;
        if (dts[k] !== norm(attendu)) fautes.push(ou + ' : fait ' + (k + 1) + ' = « ' + dts[k] + ' » au lieu de « ' + attendu + ' »');
      });
      dds.forEach(function (d, k) {
        if (d.length < MIN_FAIT) fautes.push(ou + ' : fait ' + (k + 1) + ' répondu en ' + d.length + ' caractères (minimum ' + MIN_FAIT + ')');
      });
    }

    /* 6. pas de titre : le bloc ne doit pas entrer dans le sommaire */
    if (/<h[1-6]\b/.test(h)) fautes.push(ou + ' : un titre <h…> dans le bloc (il polluerait le sommaire de la leçon)');

    /* 7. balises équilibrées */
    ['div', 'p', 'dl', 'dt', 'dd', 'figure', 'aside'].forEach(function (t) {
      var o = (h.match(new RegExp('<' + t + '\\b', 'g')) || []).length;
      var c = (h.match(new RegExp('</' + t + '>', 'g')) || []).length;
      if (o !== c) fautes.push(ou + ' : ' + o + ' <' + t + '> pour ' + c + ' </' + t + '>');
    });

    /* 8. toute classe `variante…` employée doit exister dans le CSS */
    var re = /class="([^"]*)"/g, m;
    while ((m = re.exec(h))) {
      m[1].split(/\s+/).forEach(function (cl) {
        if (cl.indexOf('variante') === 0 && !defs[cl]) {
          fautes.push(ou + ' : classe « ' + cl + ' » absente de css/components.css (le bloc se rendrait en texte nu)');
        }
      });
    }
  });

  return { blocs: blocs.length, fautes: fautes };
}

/* ------------------------------------------------------------- les mutations */

/* Chaque mutation est une faute que le contrôle DOIT voir. Une mutation qui passe
   inaperçue est un trou du contrôle, pas un détail. */
/* Les libellés sont cherchés avec l'une ou l'autre apostrophe : le site écrit
   tantôt « qu'elle », tantôt « qu’elle ». Un motif figé sur une seule forme ne
   muterait rien — et une mutation qui ne mute rien est un contrôle qui ment. */
function dtRe(i) {
  return new RegExp('<dt>' + FAITS[i].replace(/[’']/g, '[’\']') + '</dt>');
}

var MUTATIONS = [
  ['titre changé', function (h) { return h.replace('>' + TITRE + '<', '>Autrement<'); }],
  ['aria-label retiré', function (h) { return h.replace(/ aria-label="[^"]*"/, ''); }],
  ['libellé de fait réécrit', function (h) { return h.replace(dtRe(0), '<dt>Inconvénients</dt>'); }],
  ['ordre des faits inversé', function (h) {
    return h.replace(dtRe(0), '<dt>@@</dt>')
      .replace(dtRe(1), '<dt>' + FAITS[0] + '</dt>')
      .replace('<dt>@@</dt>', '<dt>' + FAITS[1] + '</dt>');
  }],
  ['un fait supprimé', function (h) { return h.replace(new RegExp('<div>\\s*' + dtRe(2).source + '[\\s\\S]*?</div>'), ''); }],
  ['fait répondu en trois mots', function (h) { return h.replace(new RegExp('(' + dtRe(2).source + '\\s*<dd>)[\\s\\S]*?(</dd>)'), '$1Quand tu veux.$2'); }],
  ['annonce vidée', function (h) { return h.replace(/(<p class="variante__lead">)[\s\S]*?(<\/p>)/, '$1Une variante.$2'); }],
  ['bloc de code retiré', function (h) { return h.replace(/<figure class="code-block"[\s\S]*?<\/figure>/, ''); }],
  ['data-file oublié', function (h) { return h.replace(/(<figure class="code-block")[^>]*(>)/, '$1$2'); }],
  ['classe mal orthographiée', function (h) { return h.replace('class="variante__lead"', 'class="variante__intro"'); }],
  ['icône lue par le lecteur d’écran', function (h) { return h.replace(/(<svg class="variante__icon"[^>]*) aria-hidden="true"/, '$1'); }],
  ['titre <h3> ajouté dans le bloc', function (h) { return h.replace('<dl class="variante__facts">', '<h3>Comparatif</h3><dl class="variante__facts">'); }],
  ['aside jamais refermé', function (h) { return h.replace(/<\/aside>$/, ''); }],
  ['classe inexistante ajoutée', function (h) { return h.replace('class="variante__facts"', 'class="variante__facts variante__grille"'); }],
  ['div déséquilibré', function (h) { return h.replace('<dl class="variante__facts">', '<div><dl class="variante__facts">'); }]
];

function mutations(defs) {
  var fichiers = lecons().filter(function (f) { return lire(f).indexOf('class="variante"') !== -1; });
  if (!fichiers.length) { console.log('Aucun bloc « variante » : rien à muter.'); return 0; }
  var src = lire(fichiers[0]);
  var rel = path.relative(RACINE, fichiers[0]).replace(/\\/g, '/');
  var base = controler(src, rel, defs);
  console.log('verif-alternatives.js --mutations — fautes injectées dans ' + rel);
  console.log('  version saine : ' + base.fautes.length + ' faute(s)\n');
  var manquees = 0;
  MUTATIONS.forEach(function (mu) {
    var b = extraireBlocs(src)[0];
    var mute = src.slice(0, b.debut) + mu[1](b.html) + src.slice(b.fin);
    if (mute === src) { console.log('  ?????? ' + mu[0] + ' — la mutation n’a rien changé (motif obsolète)'); manquees++; return; }
    var r = controler(mute, rel, defs);
    var vue = r.fautes.length > base.fautes.length;
    console.log('  ' + (vue ? 'vue    ' : 'MANQUÉE') + ' · ' + mu[0] + (vue ? '\n           → ' + r.fautes[base.fautes.length] : ''));
    if (!vue) manquees++;
  });
  console.log('\n  ' + (MUTATIONS.length - manquees) + '/' + MUTATIONS.length + ' fautes injectées détectées.');
  return manquees;
}

/* ---------------------------------------------------------------------- main */

function main() {
  var argv = process.argv.slice(2);
  var defs = classesCss();

  if (argv.indexOf('--mutations') !== -1) {
    process.exit(mutations(defs) ? 1 : 0);
  }

  var fichiers = lecons();
  var fautes = [], couvertes = [], total = 0;
  fichiers.forEach(function (f) {
    var html = lire(f);
    if (html.indexOf('class="variante"') === -1) return;
    var rel = path.relative(RACINE, f).replace(/\\/g, '/');
    var r = controler(html, rel, defs);
    total += r.blocs;
    couvertes.push(rel + ' (' + r.blocs + ')');
    r.fautes.forEach(function (x) { fautes.push(x); });
  });

  console.log('verif-alternatives.js — le format « ' + TITRE + ' »');
  console.log('  leçons lues .......................... ' + fichiers.length);
  console.log('  leçons portant un bloc ............... ' + couvertes.length);
  console.log('  blocs contrôlés ...................... ' + total);
  console.log('  fautes de format ..................... ' + fautes.length);
  if (argv.indexOf('--liste') !== -1) {
    console.log('\n  ' + couvertes.join('\n  '));
  }
  if (fautes.length) {
    console.log('\n=== FAUTES ===');
    fautes.forEach(function (x) { console.log('  · ' + x); });
    process.exit(1);
  }
  console.log('\n  Format respecté partout.');
}

main();
