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
  /* Petits entiers de rédaction : on ne demande pas à « deux », « trois » ou
     « 100 % » de venir d'une exécution. */
  '0': 'petit entier de rédaction', '1': 'idem', '2': 'idem', '3': 'idem', '4': 'idem',
  '5': 'idem', '6': 'idem', '7': 'idem', '8': 'idem', '9': 'idem', '10': 'idem',
  '11': 'idem', '12': 'idem', '13': 'idem', '16': 'idem', '20': 'idem', '30': 'idem',
  '40': 'idem', '50': 'idem', '64': 'idem', '100': 'pourcentage',
  /* Notations de la leçon 12 */
  '200': 'terme constant du coût 3n^2 + 50n + 200, posé par le texte',
  '256': 'valeur de seuil essayée par le programme',
  '99': 'centile cité (99e)', '99,99': 'centile cité', '99,983': 'part mesurée, dans la sortie',
  '2': 'idem',
  '2026': 'date',
  /* Tailles et durées posées dans les questions d auto-évaluation, qui ne sont
     PAS des mesures : ce sont des énoncés inventés pour faire réfléchir. */
  '50000': 'taille posée dans une question d auto-évaluation',
  '200000': 'taille posée dans la même question',
  '190': 'durée posée dans la même question',
  '4096': 'taille du banc du tri hybride, choisie',
  '1000': 'taille d entrée choisie',
  '10000': 'taille d entrée choisie',
  '16000': 'taille du banc de chrono.js, choisie',
  '20260903': 'graine du générateur, choisie',
  '20260912': 'graine du générateur, choisie',
  '20260913': 'graine du générateur, choisie',
  '20260917': 'graine du générateur, choisie',
  '0,55': 'probabilité d enfilement de l exercice 3, posée par l énoncé',
  '125': 'taille du banc de l exercice 1, choisie',
  '250': 'idem', '500': 'idem', '5000': 'taille d entrée choisie',
  /* Leçon 13 */
  '7776': 'taille de la liste de mots de la méthode aux dés, citée',
  '95': 'taille d alphabet imprimable, citée',
  '26': 'taille de l alphabet latin minuscule',
  '62': 'taille d alphabet alphanumérique',
  '128': 'taille de clé citée', '2048': 'taille d exposant citée',
  '38': 'taille posée dans une question d auto-évaluation',
  '45': 'idem', '4,311': 'constante de la littérature sur la hauteur des arbres aléatoires',
  '1,953': 'terme correctif de la même formule',
  '2,718': 'valeur de e, citée',
  '1101': 'écriture binaire de 13, montrée dans la phrase',
  '150': 'ordre de grandeur cité dans une question',
  '4999': 'borne d un intervalle d identifiants posée par l énoncé de l exercice 2',
  /* Les deux valeurs que Node et Chrome donnent pour Math.log(9)/Math.log(3).
     Elles NE PEUVENT PAS venir d une sortie publiée, puisque c est justement
     leur divergence qui interdit de les publier : c est tools/verif-clic.js
     qui les a relevées, en cliquant sur le bouton « Tester » dans un vrai
     navigateur. La leçon 13 les cite en nommant leur source. */
  '2,00000000000000044': 'valeur Node de log(9)/log(3), relevée par verif-clic.js',
  '2,00000000000000000': 'valeur Chrome de la même expression, idem',
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
    /* La recherche doit être BORNÉE, pas une simple sous-chaîne : « 45 000 »
       se trouve à l'intérieur de « 145 000 », et une faute injectée à 45 000
       passait donc inaperçue. On exige qu'aucun chiffre, ni séparateur de
       milliers, ni virgule décimale ne touche les bords du nombre cherché. */
    const variantes = [net, net.replace(/,/g, '.'), b.trim(), b.replace(/ /g, ' ').trim()];
    const borne = (foin, aiguille) => {
      /* L'aiguille n'est jamais qu'un nombre : chiffres, espaces, point, virgule.
         Seuls le point et la virgule sont des métacaractères, on n'échappe qu'eux.
         Les bornes doivent refuser un CHIFFRE collé, et un point ou une virgule
         SUIVIS D'UN CHIFFRE — mais pas la ponctuation de fin de phrase, qui
         terminerait sinon tous les nombres en fin de ligne d'une sortie. */
      const e = aiguille.replace(/[.]/g, '[.]').replace(/,/g, '[,]');
      return new RegExp('(?<![0-9])(?<![0-9][.,])(?:' + e + ')(?![0-9])(?![.,][0-9])').test(foin);
    };
    const trouve = variantes.some((v) => borne(sorties, v) || borne(progs, v));
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
