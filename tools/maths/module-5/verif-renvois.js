/* Les renvois croisés vers le cours de mathématiques tiennent-ils ?
   ----------------------------------------------------------------
   Un encart « Les mathématiques derrière » promet deux choses : que la leçon
   citée existe, et que le chiffre cité s'y trouve. Les deux se cassent en
   silence — un fichier renommé, une mesure corrigée dans la leçon d'origine et
   pas dans le renvoi. Le second cas s'est déjà produit sur ce chantier : la
   page de cours a porté pendant un commit cinq chiffres antérieurs à la
   relecture adversariale.

   Ce script relit chaque encart, vérifie que chaque cible existe, et exige que
   CHAQUE nombre cité dans l'encart se retrouve dans l'une des leçons citées —
   dans sa prose ou dans un bloc de sortie.

   Usage : node tools/maths/module-5/verif-renvois.js */
'use strict';
const fs = require('fs');
const path = require('path');

const RACINE = path.join(__dirname, '..', '..', '..');
const TITRE = 'Les mathématiques derrière';

/* Les nombres qui n'ont pas à venir de la leçon citée : petits entiers de
   rédaction, et les tailles posées par la phrase elle-même. */
const DECLARES = new Set(['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10',
  '11', '12', '13', '26', '32', '62', '2048', '100']);

function texteVisible(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/g, ' ')
    .replace(/<svg[\s\S]*?<\/svg>/g, ' ')
    .replace(/<sup>[\s\S]*?<\/sup>/g, '^')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&').replace(/&[a-z]+;/gi, ' ');
}

/* Toutes les leçons portant un encart de renvoi. */
const pages = [];
fs.readdirSync(path.join(RACINE, 'pages')).forEach((d) => {
  const dir = path.join(RACINE, 'pages', d);
  if (!fs.statSync(dir).isDirectory() || d === 'maths') return;
  fs.readdirSync(dir).forEach((f) => {
    if (!/^lecon-\d+\.html$/.test(f)) return;
    const h = fs.readFileSync(path.join(dir, f), 'utf8');
    if (h.indexOf(TITRE) >= 0) pages.push('pages/' + d + '/' + f);
  });
});

let encarts = 0, liens = 0, chiffres = 0, pbs = 0;
pages.forEach((rel) => {
  const html = fs.readFileSync(path.join(RACINE, rel), 'utf8');
  /* L'encart : du titre jusqu'à la fermeture du callout. */
  const i = html.indexOf(TITRE);
  const j = html.indexOf('</div></div>', i);
  if (j < 0) { console.log('  ✗ ' + rel + ' : encart mal fermé'); pbs++; return; }
  const bloc = html.slice(i, j);
  encarts++;

  const cibles = (bloc.match(/href="\.\.\/maths\/([a-z0-9-]+\.html)"/g) || [])
    .map((m) => m.replace(/.*maths\//, '').replace(/".*/, ''));
  if (!cibles.length) { console.log('  ✗ ' + rel + ' : aucun lien vers le cours de mathématiques'); pbs++; return; }

  let corpus = '';
  cibles.forEach((c) => {
    const abs = path.join(RACINE, 'pages', 'maths', c);
    liens++;
    if (!fs.existsSync(abs)) { console.log('  ✗ ' + rel + ' → maths/' + c + ' : cible inexistante'); pbs++; return; }
    /* La cible est DÉCODÉE avant la recherche : « 77 000 » y est écrit avec une
       espace insécable, que le nombre cité dans l'encart n'a pas. Sans cette
       ligne, deux chiffres pourtant présents étaient déclarés absents. */
    corpus += texteVisible(fs.readFileSync(abs, 'utf8')) + '\n';
  });

  /* Le nombre cherché est écrit SANS séparateur de milliers ; la cible, elle,
     écrit « 77 000 ». On construit donc une seconde lecture de la cible où les
     groupes de trois chiffres sont recollés — sinon un chiffre présent cinq
     fois dans la leçon est déclaré absent. */
  let recolle = corpus;
  for (let k = 0; k < 4; k++) recolle = recolle.replace(/(\d)[  ](\d{3})(?![\d])/g, '$1$2');
  const cherchable = corpus + '\n' + recolle;

  const prose = texteVisible(bloc);
  const nombres = (prose.match(/\d+(?:[  ]\d{3})*(?:[.,]\d+)?/g) || [])
    .map((b) => b.replace(/[  ]/g, '').replace(/[.,]$/, ''));
  const vus = new Set();
  const orphelins = [];
  nombres.forEach((n) => {
    if (!n || vus.has(n) || DECLARES.has(n)) return;
    vus.add(n);
    chiffres++;
    const variantes = [n, n.replace(/,/g, '.'), n.replace(/,/g, ' ')];
    const trouve = variantes.some((v) => {
      const e = v.replace(/[.]/g, '[.]').replace(/,/g, '[,]');
      return new RegExp('(?<![0-9])(?<![0-9][.,])(?:' + e + ')(?![0-9])(?![.,][0-9])').test(cherchable);
    });
    if (!trouve) orphelins.push(n);
  });

  console.log('  ' + rel.padEnd(30) + ' → ' + cibles.join(', ').padEnd(40) +
    ' ' + vus.size + ' chiffre(s)' + (orphelins.length ? '   ⚠ absents de la cible : ' + orphelins.join(' ') : ''));
  if (orphelins.length) pbs += orphelins.length;
});

console.log('');
console.log('encarts « ' + TITRE + ' » : ' + encarts + ' · liens : ' + liens + ' · chiffres confrontés : ' + chiffres);
if (pbs) { console.log(pbs + ' problème(s).'); process.exit(1); }
console.log('Chaque renvoi pointe vers une leçon qui existe, et chaque chiffre cité s y retrouve.');
