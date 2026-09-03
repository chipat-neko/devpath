'use strict';

/**
 * tools/fraicheur/calibrer.js — UN MOTIF NE VAUT QUE CE QUE VAUT SA PRÉCISION.
 *
 * E3 doit « signaler les affirmations périssables non datées ». E1 a montré
 * qu'un détecteur par motifs crie au loup ; E2 a chiffré l'autre bord : 87 % du
 * périssable réel n'a aucun motif. Reste une question qui se tranche par la
 * mesure et non par l'opinion : **existe-t-il un petit noyau de formulations
 * assez précises pour valoir un signalement ?**
 *
 * Le cours `react` fournit la seule VÉRITÉ TERRAIN du site : ses 26 leçons ont
 * été lues intégralement et ses 52 affirmations périssables sont marquées. On
 * peut donc, pour chaque motif candidat, compter ses occurrences DANS une
 * marque (vrai positif) et HORS marque (faux positif) — et calculer sa
 * précision au lieu de la supposer.
 *
 * USAGE : node tools/fraicheur/calibrer.js [--cours=react] [--seuil=60] [--tout]
 */

var fs = require('fs');
var path = require('path');

var RACINE = path.resolve(__dirname, '..', '..');
var args = process.argv.slice(2);
function opt(n, d) {
  for (var i = 0; i < args.length; i++) if (args[i].indexOf('--' + n + '=') === 0) return args[i].slice(n.length + 3);
  return d;
}
var COURS = opt('cours', 'react');
var SEUIL = Number(opt('seuil', '60'));
var TOUT = args.indexOf('--tout') !== -1;

/* Les candidats : des FORMULATIONS, pas des mots-clés. Elles viennent des 52
   affirmations relevées à la lecture, généralisées à la main. */
var CANDIDATS = [
  ['des bibliothèques comme', /\b(?:des|les) biblioth[eè]ques? (?:comme|dédiées?|tierces?)\b/gi],
  ['une bibliothèque nommée en exemple', /\bbiblioth[eè]que\b[^.]{0,40}\((?:[A-Z][\w.-]+(?:, ?| ou )?){1,4}\)/g],
  ['des outils comme', /\b(?:des|les) outils? (?:comme|tels que)\b/gi],
  ['la référence / les références', /\b(?:la|les|une) r[ée]f[ée]rences?\b(?! est de| de la documentation)/gi],
  ['le plus courant / la plus courante', /\b(?:le|la) plus courante?s?\b/gi],
  ['gagne du terrain', /\bgagnent? du terrain\b/gi],
  ['les nouveautés', /\b(?:les|des) nouveaut[ée]s\b/gi],
  ['la direction que prend', /\bla direction que prend\b/gi],
  ['en pratique, on utilise', /\ben pratique,? on (?:utilise|prend|choisit)\b/gi],
  ['on s’appuie sur', /\bon s['’]appuie sur\b/gi],
  ['quasi systématiquement / presque toujours', /\b(?:quasi[- ]syst[ée]matiquement|presque toujours)\b/gi],
  ['la plus demandée', /\bla plus demand[ée]e?\b/gi],
  ['X moderne (React moderne, JS moderne…)', /\b[A-Z][\w.+#-]* moderne\b/g],
  ['deux noms propres reliés par « ou »', /\b[A-Z][\w.+#-]{2,} (?:ou|et) [A-Z][\w.+#-]{2,}\b/g],
  ['aujourd’hui / actuellement', /\b(?:aujourd['’]hui|actuellement|à ce jour|de nos jours)\b/gi],
  ['la plupart des', /\bla plupart (?:des|du)\b/gi],
  ['à connaître', /\b[àa] conna[iî]tre\b/gi],
  ['la majorité / le plus utilisé', /\b(?:le|la) plus (?:utilis[ée]|populaire|r[ée]pandue?)\b/gi],
  ['numéro de version d’un outil', /\b[A-Z][\w.+#-]{2,} v?\d+(?:\.\d+)?\b/g],
  ['un chiffre de millisecondes', /\b\d+(?:[.,]\d+)?\s*(?:ms|millisecondes?)\b/gi],
];

/* --------------------------------------------------------------- le corpus -- */
function lecons(cours) {
  var dir = path.join(RACINE, 'pages', cours);
  return fs.readdirSync(dir).filter(function (f) { return /^lecon-\d+\.html$/.test(f); })
    .map(function (f) { return path.join(dir, f); });
}

/* On travaille sur la PROSE de l'article, en gardant trace des intervalles
   marqués — l'index doit rester comparable, donc on remplace les balises par
   des espaces de MÊME LONGUEUR au lieu de les supprimer. */
function proseEtMarques(html) {
  var art = /<article class="prose"[\s\S]*?<\/article>/.exec(html);
  if (!art) return null;
  var s = art[0];
  /* Les marques, repérées AVANT de neutraliser les balises. */
  var zones = [];
  var re = /<span class="fraicheur"[^>]*>([\s\S]*?)<\/span>/g, m;
  while ((m = re.exec(s))) zones.push([m.index, m.index + m[0].length]);
  /* On efface le CODE (mêmes longueurs) : un exemple n'est pas une affirmation. */
  var t = s.replace(/<figure class="code-block"[\s\S]*?<\/figure>/gi, function (x) { return ' '.repeat(x.length); })
    .replace(/<pre[\s\S]*?<\/pre>/gi, function (x) { return ' '.repeat(x.length); })
    .replace(/<script[\s\S]*?<\/script>/gi, function (x) { return ' '.repeat(x.length); })
    .replace(/<code[\s\S]*?<\/code>/gi, function (x) { return ' '.repeat(x.length); })
    .replace(/<[^>]*>/g, function (x) { return ' '.repeat(x.length); })
    .replace(/&nbsp;/g, '      ');
  return { texte: t, zones: zones };
}

/* ---------------------------------------------------------------- la mesure - */
var fichiers = lecons(COURS);
var resultats = CANDIDATS.map(function (c) { return { nom: c[0], re: c[1], vp: 0, fp: 0, exFP: [], exVP: [] }; });
var marquesTotal = 0;
var marquesCouvertes = {};

fichiers.forEach(function (f) {
  var d = proseEtMarques(fs.readFileSync(f, 'utf8'));
  if (!d) return;
  marquesTotal += d.zones.length;
  var rel = path.relative(RACINE, f).replace(/\\/g, '/');
  resultats.forEach(function (r) {
    var re = new RegExp(r.re.source, r.re.flags.indexOf('g') >= 0 ? r.re.flags : r.re.flags + 'g');
    var m;
    while ((m = re.exec(d.texte))) {
      var deb = m.index, fin = deb + m[0].length;
      var z = d.zones.findIndex(function (zz) { return deb >= zz[0] && fin <= zz[1]; });
      if (z >= 0) {
        r.vp++;
        marquesCouvertes[rel + '#' + z] = true;
        if (r.exVP.length < 2) r.exVP.push(m[0]);
      } else {
        r.fp++;
        if (r.exFP.length < 3) r.exFP.push(m[0] + '  (' + rel.split('/').pop() + ')');
      }
    }
  });
});

resultats.forEach(function (r) {
  r.total = r.vp + r.fp;
  r.precision = r.total ? Math.round((r.vp / r.total) * 100) : 0;
});
resultats.sort(function (a, b) { return b.precision - a.precision || b.vp - a.vp; });

console.log('calibrer.js — vérité terrain : cours « ' + COURS +' », ' + fichiers.length +
  ' leçons lues intégralement, ' + marquesTotal + ' affirmations marquées\n');
console.log('  précision = occurrences DANS une marque / occurrences totales dans la prose\n');
console.log('  ' + 'motif'.padEnd(44) + 'dans  hors   précision');
resultats.forEach(function (r) {
  if (!TOUT && r.total === 0) return;
  console.log('  ' + r.nom.padEnd(44) + String(r.vp).padStart(4) + String(r.fp).padStart(6) +
    String(r.precision + ' %').padStart(11) + (r.precision >= SEUIL && r.vp >= 3 ? '   ← retenu' : ''));
});

var retenus = resultats.filter(function (r) { return r.precision >= SEUIL && r.vp >= 3; });
var couvertes = Object.keys(marquesCouvertes).length;
console.log('\n  motifs au-dessus de ' + SEUIL + ' % avec au moins 3 occurrences utiles : ' + retenus.length);
console.log('  affirmations marquées touchées par AU MOINS un candidat : ' + couvertes +
  ' / ' + marquesTotal + '  (' + Math.round((couvertes / marquesTotal) * 100) + ' %)');

if (args.indexOf('--exemples') !== -1) {
  console.log('\n  QUELQUES FAUX POSITIFS, motif par motif :');
  resultats.forEach(function (r) {
    if (!r.exFP.length) return;
    console.log('   · ' + r.nom + ' :');
    r.exFP.forEach(function (x) { console.log('       ' + x); });
  });
}
