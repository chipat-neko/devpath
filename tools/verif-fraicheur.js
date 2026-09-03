'use strict';

/**
 * tools/verif-fraicheur.js — CE QU'ON SAIT DE L'ÂGE DE CE QU'ON A ÉCRIT.
 *
 * POURQUOI IL NE CHERCHE PAS LE PÉRISSABLE
 * ----------------------------------------
 * Le point E1 a mesuré : sur ce corpus, un détecteur par motifs produit une
 * majorité de faux positifs, parce que les mêmes mots décrivent le déroulement
 * d'un algorithme, un fait permanent et une affirmation sur l'état du monde.
 * E2 l'a chiffré sur un cours entier lu à la main : **45 des 52 affirmations
 * réellement périssables de `react` (87 %) n'ont ni numéro de version, ni date,
 * ni superlatif** — aucun motif ne pouvait les voir. Et réciproquement, des 34
 * occurrences que le détecteur d'E1 signalait, 7 seulement étaient de vraies
 * dettes.
 *
 * La charge est donc INVERSÉE : celui qui écrit marque, une fois, à la main
 * (convention : `tools/fraicheur/CONVENTION.md`), et ce vérificateur contrôle
 * que les marques posées sont bien formées, bien placées, et qu'aucune n'a
 * dépassé son âge. **Il ne dit jamais si une version est à jour — il n'a pas de
 * réseau. Il dit qu'on SAIT quand on l'a écrite.**
 *
 * CE QU'IL CONTRÔLE
 *   F1  `data-arrete` présent, au format AAAA-MM-JJ, jour réel, pas dans le futur
 *   F2  `data-duree` entier positif s'il est présent
 *   F3  l'ÂGE : au-delà de la durée → avertissement ; au-delà du double → ERREUR
 *   F4  aucune marque dans un bloc de code, un <head>, un bloc JSON ou un attribut
 *   F5  aucune marque imbriquée dans une autre
 *   F6  balises appariées à l'intérieur de la marque
 *   F7  aucune marque hors de <article class="prose"> (le bilan ne la listerait pas)
 *   F8  parcimonie : au-delà de 4 marques sur une page, avertissement
 *   F9  le contenu marqué n'est pas vide et fait moins de 200 caractères
 *
 * USAGE
 *   node tools/verif-fraicheur.js                # tout le site
 *   node tools/verif-fraicheur.js --cours=react  # un cours
 *   node tools/verif-fraicheur.js --date=2029-01-01   # se projeter dans le temps
 *   node tools/verif-fraicheur.js --strict       # sortir en 1 dès le premier avertissement
 * Code de sortie : 1 s'il existe au moins une erreur (ou, en --strict, un avertissement).
 */

var fs = require('fs');
var path = require('path');
var A = require('./fraicheur/appliquer.js');

var RACINE = path.resolve(__dirname, '..');
var args = process.argv.slice(2);
function opt(n, d) {
  for (var i = 0; i < args.length; i++) {
    if (args[i].indexOf('--' + n + '=') === 0) return args[i].slice(n.length + 3);
  }
  return d;
}
var STRICT = args.indexOf('--strict') !== -1;
var COURS = opt('cours', '');
var AUJOURDHUI = opt('date', '');
var MAINTENANT = AUJOURDHUI ? new Date(AUJOURDHUI + 'T12:00:00Z') : new Date();
if (isNaN(MAINTENANT.getTime())) { console.error('--date : format attendu AAAA-MM-JJ'); process.exit(2); }

var DUREE_DEFAUT = 18;      // mois — cf. CONVENTION.md
var MAX_PAR_PAGE = 4;       // au-delà, c'est presque toujours la même affirmation marquée deux fois

/* -------------------------------------------------------------- le corpus --- */
function pagesHtml() {
  var out = [];
  (function walk(dir) {
    fs.readdirSync(dir, { withFileTypes: true }).sort(function (a, b) { return a.name < b.name ? -1 : 1; })
      .forEach(function (e) {
        var p = path.join(dir, e.name);
        if (e.isDirectory()) return walk(p);
        if (/\.html$/.test(e.name)) out.push(p);
      });
  })(path.join(RACINE, 'pages'));
  var racine = fs.readdirSync(RACINE).filter(function (f) { return /\.html$/.test(f); })
    .map(function (f) { return path.join(RACINE, f); });
  return out.concat(racine);
}

/* Combien de mois pleins séparent une date d'aujourd'hui ? */
function moisEcoules(iso) {
  var d = new Date(iso + 'T12:00:00Z');
  var m = (MAINTENANT.getUTCFullYear() - d.getUTCFullYear()) * 12 +
    (MAINTENANT.getUTCMonth() - d.getUTCMonth());
  if (MAINTENANT.getUTCDate() < d.getUTCDate()) m--;
  return m;
}

/* ------------------------------------------------------------- le contrôle -- */
var erreurs = [], avertissements = [];
var pages = 0, marques = 0, pagesMarquees = 0;
var plusVieille = null, ages = [];

pagesHtml().forEach(function (abs) {
  var rel = path.relative(RACINE, abs).replace(/\\/g, '/');
  if (COURS && rel.indexOf('pages/' + COURS + '/') !== 0) return;
  var html = fs.readFileSync(abs, 'utf8');
  pages++;
  if (html.indexOf('class="fraicheur"') < 0) return;
  pagesMarquees++;

  var zones = A.zonesInterdites(html);
  var bals = A.balises(html);
  var codes = A.codesInline(html);
  var art = /<article class="prose"[\s\S]*?<\/article>/.exec(html);

  /* Toutes les ouvertures de marque, y compris mal formées : on veut voir
     celles qui n'ont PAS de data-arrete, pas seulement celles qui en ont un. */
  var re = /<span class="fraicheur"([^>]*)>([\s\S]*?)<\/span>/g;
  var m, n = 0;
  var positions = [];
  while ((m = re.exec(html))) {
    n++; marques++;
    var attrs = m[1] || '';
    var dedans = m[2] || '';
    var ou = rel + ' :: « ' + dedans.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim().slice(0, 48) + ' »';

    /* F1 — la date */
    var mArr = /\bdata-arrete="([^"]*)"/.exec(attrs);
    if (!mArr) { erreurs.push('[F1] ' + ou + ' : pas de data-arrete'); continue; }
    var pb = A.verifierDate(mArr[1]);
    if (pb) { erreurs.push('[F1] ' + ou + ' : data-arrete « ' + mArr[1] + ' » — ' + pb); continue; }

    /* F2 — la durée */
    var duree = DUREE_DEFAUT;
    var mDur = /\bdata-duree="([^"]*)"/.exec(attrs);
    if (mDur) {
      var v = Number(mDur[1]);
      if (!/^\d+$/.test(mDur[1]) || !(v > 0)) {
        erreurs.push('[F2] ' + ou + ' : data-duree « ' + mDur[1] + ' » n’est pas un entier positif');
        continue;
      }
      duree = v;
    }

    /* F3 — l'âge */
    var age = moisEcoules(mArr[1]);
    ages.push({ page: rel, iso: mArr[1], age: age, duree: duree });
    if (!plusVieille || age > plusVieille.age) plusVieille = { page: rel, iso: mArr[1], age: age };
    if (age > duree * 2) {
      erreurs.push('[F3] ' + ou + ' : ' + age + ' mois pour une durée de ' + duree +
        ' — plus du double, à relire d’urgence (arrêté au ' + mArr[1] + ')');
    } else if (age > duree) {
      avertissements.push('[F3] ' + ou + ' : ' + age + ' mois pour une durée de ' + duree +
        ' — à relire (arrêté au ' + mArr[1] + ')');
    }

    /* F4 / F5 / F6 / F7 — la place */
    var deb = m.index, fin = m.index + m[0].length;
    if (A.zonesInterdites && zones.some(function (z) { return deb < z[1] && fin > z[0]; })) {
      erreurs.push('[F4] ' + ou + ' : marque dans un bloc de code, un <head> ou un bloc JSON');
    }
    if (bals.some(function (z) { return (deb > z[0] && deb < z[1]) || (fin > z[0] && fin < z[1]); })) {
      erreurs.push('[F4] ' + ou + ' : marque à cheval sur une balise (attribut)');
    }
    if (codes.some(function (z) { return deb >= z[0] && fin <= z[1]; })) {
      erreurs.push('[F4] ' + ou + ' : marque à l’intérieur d’un <code>');
    }
    if (/<span class="fraicheur"/.test(dedans)) {
      erreurs.push('[F5] ' + ou + ' : marque imbriquée dans une autre');
    }
    if (!A.balisesAppariees(dedans)) {
      erreurs.push('[F6] ' + ou + ' : balises non appariées à l’intérieur de la marque');
    }
    if (art && (deb < art.index || fin > art.index + art[0].length)) {
      erreurs.push('[F7] ' + ou + ' : marque hors de <article class="prose"> — le bilan ne la listera pas');
    }

    /* F9 — le contenu marqué */
    var texte = dedans.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
    if (!texte) erreurs.push('[F9] ' + ou + ' : marque vide');
    else if (texte.length > 200) {
      avertissements.push('[F9] ' + rel + ' : marque de ' + texte.length +
        ' caractères — une marque désigne une affirmation, pas un paragraphe');
    }
    positions.push(deb);
  }

  /* F8 — parcimonie */
  if (n > MAX_PAR_PAGE) {
    avertissements.push('[F8] ' + rel + ' : ' + n + ' marques sur la page (au-delà de ' +
      MAX_PAR_PAGE + ', c’est presque toujours la même affirmation marquée plusieurs fois)');
  }
});

/* ------------------------------------------------------------------ sortie -- */
console.log('verif-fraicheur.js — ' + pages + ' page(s) lue(s), ' + pagesMarquees +
  ' marquée(s), ' + marques + ' marque(s)');
console.log('  date de référence : ' + MAINTENANT.toISOString().slice(0, 10) +
  (AUJOURDHUI ? '  (--date)' : '') + '  ·  durée par défaut : ' + DUREE_DEFAUT + ' mois');
if (plusVieille) {
  console.log('  la plus ancienne : ' + plusVieille.page + ' — arrêtée au ' + plusVieille.iso +
    ' (' + plusVieille.age + ' mois)');
}
/* Combien de marques arriveront à échéance dans les 6 mois : c'est le chiffre
   qui sert à planifier, pas celui qui rougit. */
var bientot = ages.filter(function (a) { return a.age <= a.duree && a.age > a.duree - 6; }).length;
console.log('  à échéance dans moins de 6 mois : ' + bientot);

if (erreurs.length) {
  console.log('\n  ERREURS (' + erreurs.length + ') :');
  erreurs.forEach(function (e) { console.log('    · ' + e); });
}
if (avertissements.length) {
  console.log('\n  AVERTISSEMENTS (' + avertissements.length + ') :');
  avertissements.forEach(function (e) { console.log('    · ' + e); });
}
if (!erreurs.length && !avertissements.length) {
  console.log('\n  Rien à signaler : toutes les marques sont bien formées et dans leur durée.');
}
console.log('\n  ⚠ Ce contrôle ne dit PAS si une version citée est à jour : il n’a pas de réseau.');
console.log('    Il dit qu’on SAIT quand chaque affirmation a été écrite.');

process.exit(erreurs.length || (STRICT && avertissements.length) ? 1 : 0);
