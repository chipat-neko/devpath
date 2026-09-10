'use strict';
/**
 * tools/etudes/hub.js — assemble pages/etudes.html, le hub des études de cas.
 *
 * POURQUOI UN ASSEMBLEUR POUR UNE PAGE DE LIENS. Un hub écrit à la main périme le jour
 * où une étude change de titre, et personne ne s'en aperçoit : c'est une page qu'on ne
 * relit jamais. Ici, rien n'est recopié — les titres, les sous-titres et les liens sont
 * EXTRAITS des six pages d'étude au moment de l'assemblage.
 *
 * Ce qui reste écrit à la main est éditorial (l'accent de couleur, la phrase « ce que tu
 * y apprends », le chiffre mis en avant) — et même ce chiffre est vérifié : l'outil
 * REFUSE d'écrire si la formule citée sur une carte ne se retrouve pas telle quelle dans
 * la page de l'étude. Une vitrine qui annoncerait un chiffre que l'étude ne contient plus
 * serait pire que pas de vitrine du tout.
 *
 *   node tools/etudes/hub.js
 */

const fs = require('fs');
const path = require('path');

const ICI = __dirname;
const RACINE = path.resolve(ICI, '..', '..');
const PAGES = path.join(RACINE, 'pages');

function stop(quoi) { console.log('✗ ' + quoi); process.exit(1); }
function lireIci(f) { return fs.readFileSync(path.join(ICI, f), 'utf8').replace(/\r\n/g, '\n'); }

/* La table éditoriale. Une entrée par étude, dans l'ordre de lecture conseillé.
   `preuve` est la formule qui sera affichée ET cherchée dans la page : si elle n'y est
   plus, l'assemblage échoue. */
const ETUDES = [
  {
    fichier: 'etude-journal.html', accent: 'javascript',
    badge: 'Un programme entier',
    apprend: 'La situation la plus simple, et la plus rare : un programme court, donné en entier, qu\'on peut lire d\'un bout à l\'autre. Le format des six études est posé ici — lire d\'abord, questions ensuite, puis une modification à faire soi-même.',
    preuve: '152 lignes',
    preuveTexte: 'un programme de 152 lignes, dont la sortie publiée a été comparée ligne à ligne à celle du navigateur',
  },
  {
    fichier: 'etude-moteur-exos.html', accent: 'typescript',
    badge: 'Un fichier trop gros',
    apprend: 'La situation ordinaire : un fichier que personne ne lit en entier. On y apprend à cartographier plutôt qu\'à lire, à entrer par un point, à suivre un seul fil — et à savoir ce qu\'on ne lit pas.',
    preuve: '2019 lignes',
    preuveTexte: 'un fichier de 2 019 lignes, dont les extraits publiés sont relus dans le code du site à chaque assemblage',
  },
  {
    fichier: 'etude-recherche.html', accent: 'sql',
    badge: 'Une décision de conception',
    apprend: 'Lire du code, c\'est aussi lire un choix : pourquoi celui qui a écrit ceci a-t-il pré-calculé au lieu de chercher à la volée ? L\'étude publie une mesure, puis demande de la mettre en défaut.',
    preuve: '61×',
    preuveTexte: '61× annoncé, 45× une fois compté le travail oublié — les deux rejoués dans le navigateur',
  },
  {
    fichier: 'etude-reecriture.html', accent: 'java',
    badge: 'Deux versions du même programme',
    apprend: 'Le même programme écrit deux fois, et sept mesures pour départager — au lieu de « c\'est plus propre ». Y compris le cas où c\'est la version mal écrite qui gagne.',
    preuve: '10 000 commandes',
    preuveTexte: '10 000 commandes passées dans les deux versions, 0 écart de résultat',
  },
  {
    fichier: 'etude-euclide.html', accent: 'c',
    badge: 'Un algorithme célèbre',
    apprend: 'Une boucle se lit en deux phrases : ce qui ne change pas dit pourquoi le résultat est juste, ce qui décroît dit pourquoi elle s\'arrête. Et trois familles d\'entrées où ce programme ment sans lever d\'erreur.',
    preuve: '90 000 paires',
    preuveTexte: '90 000 paires jugées par une force brute qui ignore tout d\'Euclide, 0 écart',
  },
  {
    fichier: 'etude-inconnu.html', accent: 'go',
    badge: 'Un langage étranger',
    apprend: 'Ce qui se devine dans un langage qu\'on n\'a jamais ouvert — non pas d\'après une impression, mais compté sur tous les langages de ce site. Puis un programme Go lu par quelqu\'un qui n\'en fait pas.',
    preuve: '39 langages',
    preuveTexte: '39 langages mesurés : 3 marqueurs seulement sont présents dans tous',
  },
];

/* ------------------------------------------------------- lecture des six études */

function extraire(fichier) {
  const complet = path.join(PAGES, fichier);
  if (!fs.existsSync(complet)) stop('étude introuvable : pages/' + fichier);
  const html = fs.readFileSync(complet, 'utf8');
  const titre = /<title>([^<]*)<\/title>/.exec(html);
  const h1 = /<h1>([^<]*)<\/h1>/.exec(html);
  const num = /Étude de cas (\d+)/.exec(titre ? titre[1] : '');
  const lead = /<p class="hero__lead">([\s\S]*?)<\/p>/.exec(html);
  if (!titre || !h1 || !num) stop('pages/' + fichier + ' : titre, h1 ou numéro d’étude illisible.');
  return {
    fichier: fichier,
    numero: Number(num[1]),
    titre: h1[1].trim(),
    lead: lead ? lead[1].replace(/\s+/g, ' ').trim() : '',
    html: html,
    octets: html.length,
  };
}

/* Aucune étude ne doit manquer à la table, et la table ne doit citer aucune étude
   disparue : c'est le contrôle qui empêche le hub de vieillir en silence. */
const surDisque = fs.readdirSync(PAGES).filter(function (f) { return /^etude-.*\.html$/.test(f); }).sort();
const dansTable = ETUDES.map(function (e) { return e.fichier; }).slice().sort();
if (surDisque.join(',') !== dansTable.join(',')) {
  stop('le hub ne liste pas les mêmes études que le dossier pages/.\n     disque : ' +
       surDisque.join(', ') + '\n     table  : ' + dansTable.join(', '));
}

const lues = ETUDES.map(function (e) {
  const info = extraire(e.fichier);
  // ⚠️ Comparer sur le HTML brut ne marcherait pas : le site écrit « 90 000 » avec une
  // ESPACE INSÉCABLE (`&nbsp;`), et « 39 langages » de même. On normalise les insécables
  // et les suites d'espaces avant de chercher — sinon le contrôle rejetterait des
  // chiffres pourtant présents, ce qu'il a fait au premier essai.
  const normalise = info.html.replace(/&nbsp;| /g, ' ').replace(/\s+/g, ' ');
  if (normalise.indexOf(e.preuve) === -1) {
    stop('la carte de ' + e.fichier + ' met en avant « ' + e.preuve + ' », introuvable dans la page.');
  }
  return Object.assign({}, e, info);
});

/* Les numéros doivent être uniques et se suivre : deux études nº 3 passeraient inaperçues. */
const numeros = lues.map(function (e) { return e.numero; });
numeros.slice().sort(function (a, b) { return a - b; }).forEach(function (n, i) {
  if (n !== i + 1) stop('les numéros d’étude ne se suivent pas : ' + numeros.join(', '));
});
console.log('✓ ' + lues.length + ' études lues, numéros 1 à ' + lues.length + ', chiffres mis en avant retrouvés dans chaque page');

/* ------------------------------------------------------------------- assemblage */

function echapper(t) { return t.replace(/&(?!(amp|lt|gt|quot|#\d+|nbsp);)/g, '&amp;').replace(/</g, '&lt;'); }

const cartes = lues.map(function (e) {
  return [
    '            <article class="card frhub-card" data-accent="' + e.accent + '">',
    '              <div class="frhub-card__head">',
    '                <span class="badge">' + echapper(e.badge) + '</span>',
    '                <span class="frhub-card__steps">Étude nº&nbsp;' + e.numero + '</span>',
    '              </div>',
    '              <h2 class="frhub-card__title">' + echapper(e.titre) + '</h2>',
    '              <p class="frhub-card__desc">' + echapper(e.apprend) + '</p>',
    '              <ul class="frhub-card__phases">',
    '                <li><strong>Mesuré</strong> — ' + echapper(e.preuveTexte) + '</li>',
    '              </ul>',
    '              <a class="btn btn--primary btn--block" href="' + e.fichier + '">Ouvrir cette étude →</a>',
    '            </article>',
  ].join('\n');
}).join('\n\n');

var page = lireIci('hub-gabarit.html')
  .replace('@@CARTES@@', cartes)
  .split('@@N_ETUDES@@').join(String(lues.length));

if (page.indexOf('@@') !== -1) {
  stop('jeton non remplacé : ' + page.slice(page.indexOf('@@'), page.indexOf('@@') + 30));
}

const cible = path.join(PAGES, 'etudes.html');
require("../lib/publier-etude.js").publier(cible, page, RACINE);
console.log('  ' + lues.length + ' carte(s) assemblée(s)');
