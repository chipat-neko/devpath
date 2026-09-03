/* Chaque nombre cité dans la PROSE se retrouve-t-il dans une SORTIE publiée ?
   -------------------------------------------------------------------------
   C'est le contrôle que les trois relectures adversariales ont montré le plus
   rentable : les programmes étaient justes, et la prose qui les commente citait
   des chiffres qui n'en venaient pas — un « 845 » pour 846, un « 12 » pour 17,
   un « 5 031 » qui mesurait autre chose que ce qu'il annonçait.

   La version du module 2 travaillait sur une liste écrite à la main. Celle-ci
   fait l'inverse : elle extrait TOUS les nombres de la prose et exige que
   chacun soit soit présent dans une sortie, soit DÉCLARÉ ici avec sa raison.
   Un chiffre non déclaré et introuvable est une alerte.

   Usage : node scratchpad/v15-c3/verif-chiffres.js pages/maths/lecon-07.html … */
'use strict';
const fs = require('fs');

/* Les nombres qui n'ont pas à venir d'une exécution, chacun avec sa raison.
   Cette liste EST le rapport d'honnêteté de la page : si elle enfle, c'est que
   la page affirme plus qu'elle ne mesure. */
const DECLARES = {
  '2': 'petit entier de rédaction', '3': 'idem', '4': 'idem', '5': 'idem', '6': 'idem',
  '7': 'le modulo choisi comme exemple', '8': 'idem', '9': 'idem', '10': 'idem',
  '1': 'idem', '0': 'idem', '11': 'idem', '12': 'idem', '13': 'idem', '16': 'idem',
  '20': 'idem', '26': 'largeur en bits, règle mnémotechnique', '30': 'idem', '40': 'idem',
  '50': 'idem', '64': 'taille de table, choisie', '61': 'taille de table, choisie',
  '97': 'le modulo de l IBAN, fixé par la norme',
  '100': 'pourcentage', '1000': 'ordre de grandeur cité',
  '1024': 'taille de clé usuelle', '2048': 'taille de clé usuelle', '4096': 'mesuré ailleurs',
  '256': 'taille d empreinte usuelle', '128': 'taille d etat de generateur, source citee',
  '32': 'taille d entier usuelle', '52': 'bits de mantisse, norme IEEE 754',
  '53': 'bits de mantisse implicite, norme', '54': 'exposant cité', '55': 'exposant cité',
  '65537': 'exposant public usuel de RSA', '300': 'date historique', '250': 'date historique',
  '2012': 'date de publication citee', '1965': 'date de publication citee',
  '2020': 'date de publication citee', '1373653': 'borne citee de la litterature',
  '829': 'facteur de la borne citee', '1657': 'facteur de la borne citee',
  '617': 'nombre de chiffres de 2^2048, calcule dans une sortie',
  '308': 'exposant deduit de 617', '80': 'ordre de grandeur cite (atomes)',
  '76': 'exposant calcule dans une sortie', '590': 'exposant calcule dans une sortie',
  '2026': 'date', '1800': 'date historique', '1600': 'date historique',
  '99': 'pourcentage de rédaction', '95': 'taille d alphabet citee',
  '2003': 'annee', '1e9': 'ordre de grandeur',
  /* Ajouts du module 3, chacun justifié : ce sont des nombres de rédaction, des
     dates, des valeurs citées d'une source, ou de petits calculs faits sous les yeux
     du lecteur. Aucun n'est un résultat de mesure présenté comme tel. */
  '7,666': 'illustration arithmétique dans le texte (7 + 2/3)',
  '979': '97 x 10 + 9, calcul montré dans la phrase',
  '0,3': 'écart en points entre 7,22 % mesuré et 7,24 % prédit',
  '0,5': 'part des serveurs TLS touchés, chiffre de la source citée',
  '49999': 'borne de la boucle du programme, citée dans le texte',
  '0,333': 'illustration : un tiers en décimal', '0,333333': 'idem',
  '16383': '16 384 moins un, calcul montré dans la phrase',
  '3,998': 'la valeur ATTENDUE de la TVA, que le programme n obtient justement pas',
  '50,3': 'le chiffre ERRONÉ de la première version, cité comme repoussoir',
  '2008': 'année de révision de la norme IEEE 754',
  '7291736452811264009': 'identifiant fictif donné en exemple dans une question',
  /* Ajouts du module 4 : deux dates et deux tailles d énoncé. */
  '1736': 'date : Euler et les sept ponts de Königsberg',
  '1735': 'date : presentation du memoire d Euler a l Academie',
  '1916': 'date : théorème de Kőnig sur les graphes bipartis',
  '1998': 'date : modèle petit monde de Watts et Strogatz',
  '50000': 'taille de graphe posée dans une question d auto-évaluation',
  '300000': 'nombre d arêtes posé dans la même question',
};

const pages = process.argv.slice(2);
if (!pages.length) { console.log('usage : node verif-chiffres.js <page.html> …'); process.exit(1); }

let alertes = 0;
for (const page of pages) {
  const html = fs.readFileSync(page, 'utf8');

  /* 1. les SORTIES publiées : les blocs plaintext nommés *.txt */
  const sorties = (html.match(/data-file="[^"]+\.txt"><pre><code class="language-plaintext">([\s\S]*?)<\/code>/g) || [])
    .join('\n').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');

  /* 2. les PROGRAMMES publiés : un nombre écrit dans le code compte aussi comme mesuré */
  const progs = (html.match(/data-file="[^"]+\.js"[^>]*><pre><code class="language-javascript">([\s\S]*?)<\/code>/g) || [])
    .join('\n').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');

  /* 3. la PROSE : tout sauf les blocs de code, les scripts et les attributs */
  let prose = html
    .replace(/<figure class="code-block"[\s\S]*?<\/figure>/g, ' ')
    .replace(/<script[\s\S]*?<\/script>/g, ' ')
    .replace(/<svg[\s\S]*?<\/svg>/g, ' ')
    .replace(/<sup>[\s\S]*?<\/sup>/g, '^')       /* 10<sup>15</sup> ne doit pas devenir « 1015 » */
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ').replace(/&[a-z]+;/gi, ' ');

  /* Les nombres cités : chiffres, avec espaces de milliers ou virgule décimale. */
  /* Un séparateur de milliers regroupe TOUJOURS trois chiffres. Sans cette exigence,
     « ISBN-13 88,93 % » se lisait « 1388,93 » — un nombre qui n'existe nulle part. */
  const bruts = prose.match(/\d+(?:[  ]\d{3})*(?:[.,]\d+)?/g) || [];
  const vus = {};
  const introuvables = [];
  for (const b of bruts) {
    const net = b.replace(/[  ]/g, '').replace(/[.,]$/, '');
    if (!net || vus[net]) continue;
    vus[net] = 1;
    if (DECLARES[net]) continue;
    const variantes = [net, net.replace(/,/g, '.'), b.trim(), b.replace(/ /g, ' ').trim()];
    const trouve = variantes.some((v) => sorties.indexOf(v) !== -1 || progs.indexOf(v) !== -1);
    if (!trouve) introuvables.push(net);
  }
  console.log(page.split(/[\\/]/).pop() + '  ·  ' + Object.keys(vus).length + ' nombres distincts dans la prose, ' +
    introuvables.length + ' sans source');
  if (introuvables.length) {
    alertes += introuvables.length;
    console.log('   ⚠ ' + introuvables.join('  '));
  }
}
console.log('');
console.log(alertes + ' nombre(s) de prose sans source dans une sortie, un programme ou la liste déclarée.');
process.exit(alertes ? 1 : 0);
