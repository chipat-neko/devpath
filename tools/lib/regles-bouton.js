'use strict';
/**
 * tools/lib/regles-bouton.js — LES RÈGLES DU BOUTON « Tester », LUES DANS `js/runner.js`,
 * ÉCRITES UNE SEULE FOIS POUR TOUS LES OUTILS.
 *
 * POURQUOI CE MODULE EXISTE
 * -------------------------
 * `tools/verif-js.js` lisait ces règles dans `js/runner.js` — jamais recopiées, c'est la
 * discipline du chantier. Mais toute SONDE qui veut raisonner sur les mêmes blocs devait
 * refaire cette lecture chez elle, et le point B2b-15 a mesuré ce que cela coûte :
 * `sonde-repli-manque.js` avait sa propre copie du contexte du Worker, les deux avaient
 * divergé, et les deux instruments rendaient des verdicts différents sur les mêmes blocs.
 * Le contexte est depuis dans `tools/lib/contexte-worker.js` ; les RÈGLES DU BOUTON, elles,
 * étaient encore chez `verif-js.js` seul. Elles sont ici.
 *
 * ⚠️ CE QUI REND LA LECTURE FRAGILE, ET COMMENT ON S'EN PROTÈGE. Une fonction lue par
 * `eval` s'exécute dans la portée de CE module : si elle en appelle une autre, cette autre
 * doit y être lue aussi. Le point B2b-16 l'a payé — `prochainPrefixe` avait été lue sans
 * les trois fonctions qu'elle appelle, et la sonde mourait sur une `ReferenceError` MUETTE.
 * Toutes les règles qui s'appellent entre elles sont donc lues ensemble, ici, et jamais
 * séparément.
 */
var fs = require('fs');
var path = require('path');

var RACINE = path.resolve(__dirname, '..', '..');
var SRC = fs.readFileSync(path.join(RACINE, 'js', 'runner.js'), 'utf8');

/* Un MOTIF (`var X = /…/;`) lu dans runner.js, jamais recopié. */
function lireMotif(nom) {
  var m = SRC.match(new RegExp('var ' + nom + ' = (/[\\s\\S]*?/);'));
  if (!m) throw new Error(nom + ' introuvable dans js/runner.js');
  return eval(m[1]);
}

/* Une FONCTION lue dans runner.js. Le corps est repris tel quel, jusqu'à l'accolade
   fermante indentée de deux espaces — la convention d'écriture du fichier. */
function lireFonction(nom) {
  var i = SRC.indexOf('function ' + nom + '(');
  if (i < 0) throw new Error(nom + ' introuvable dans js/runner.js');
  var j = SRC.indexOf('\n  }', i);
  if (j < 0) throw new Error('fin de ' + nom + ' introuvable');
  return eval('(' + SRC.slice(i, j + 4) + ')');
}

var BROWSER_ONLY = lireMotif('BROWSER_ONLY');
var estUnFichierJson = lireFonction('estUnFichierJson');
var estUneSuiteDeTests = lireFonction('estUneSuiteDeTests');
var estUnFragmentServeur = lireFonction('estUnFragmentServeur');
var estDuDomDePage = lireFonction('estDuDomDePage');
var estUnServiceWorker = lireFonction('estUnServiceWorker');
var neCompilePas = lireFonction('neCompilePas');
var heriteDuNavigateur = lireFonction('heriteDuNavigateur');
var estUnFragmentOrphelin = lireFonction('estUnFragmentOrphelin');
var estLaSuiteDunFichierDeNavigateur = lireFonction('estLaSuiteDunFichierDeNavigateur');
var meriteUnRepli = lireFonction('meriteUnRepli');
var envelopperPourRepli = lireFonction('envelopperPourRepli');
var preambuleQuiCompile = lireFonction('preambuleQuiCompile');
var preambuleReAncre = lireFonction('preambuleReAncre');
var preambuleElague = lireFonction('preambuleElague');
var prochainPrefixe = lireFonction('prochainPrefixe');

function dec(s) {
  return s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"')
          .replace(/&#39;/g, "'").replace(/&amp;/g, '&');
}

/* On récupère le bloc ET son `data-file`. ⚠️ LE MOTIF EST BORNÉ PAR `</figure>` (B2b-15) :
   sans cela le `[\s\S]*?` traverse les figures et l'on attribue au bloc le nom de fichier
   de la figure PRÉCÉDENTE — 629 blocs sur 1 987 étaient dans ce cas. */
function blocsJs(fichier) {
  var src = fs.readFileSync(fichier, 'utf8'), out = [];
  var re = /<figure class="code-block"([^>]*)>([\s\S]*?)<\/figure>/g, m;
  while ((m = re.exec(src))) {
    var code = m[2].match(/<code class="language-javascript">([\s\S]*?)<\/code>/);
    if (!code) continue;
    var df = (m[1] || '').match(/data-file="([^"]*)"/);
    out.push({ code: dec(code[1]).trim(), fichier: df ? df[1] : '' });
  }
  return out;
}

function lecons(cible) {
  var out = [];
  var base = cible ? path.resolve(RACINE, cible) : path.join(RACINE, 'pages');
  (function marche(d) {
    var st; try { st = fs.statSync(d); } catch (e) { return; }
    if (st.isFile()) { if (/\.html$/.test(d)) out.push(d); return; }
    for (var f of fs.readdirSync(d)) marche(path.join(d, f));
  })(base);
  return out.filter(function (f) { return /lecon-\d+\.html$/.test(f); });
}

/* LE CONTEXTE D'UNE LEÇON, tel que `init()` le construit dans runner.js : pour chaque
   bloc, ce qui le PRÉCÈDE côté navigateur (`heriteDuNavigateur`), la page ENTIÈRE
   (`estUnFragmentOrphelin`), et la liste des blocs qui reçoivent VRAIMENT un bouton —
   celle-là, et pas une autre, sert de préambule au repli. */
function contexteLecon(blocsDuFichier) {
  var navAvant = [], vusNav = [], tousJs = [];
  /* Depuis le point B2b-23, deux listes de plus, construites exactement comme `init()` :
     les blocs de navigateur precedents PORTANT LE MEME `data-file`, et les blocs
     precedents qui ne sont PAS du navigateur (la garde de la regle). */
  var navFichierAvant = [], vusNavFichier = [], autresAvant = [], vusAutres = [];
  blocsDuFichier.forEach(function (bloc) {
    navAvant.push(vusNav.slice());
    autresAvant.push(vusAutres.slice());
    var fic = bloc.fichier || '';
    navFichierAvant.push(vusNavFichier.filter(function (o) { return fic && o.f === fic; })
                                      .map(function (o) { return o.t; }));
    if (!bloc.code) return;
    tousJs.push(bloc.code);
    if (BROWSER_ONLY.test(bloc.code) || estDuDomDePage(bloc.code)) {
      vusNav.push(bloc.code);
      vusNavFichier.push({ f: fic, t: bloc.code });
    } else vusAutres.push(bloc.code);
  });
  /* ⚠️ LA SIGNATURE PREND MAINTENANT LE RANG DU BLOC, ET NON PLUS SON CONTEXTE (B2b-23).
     Trois regles ont besoin d'un contexte different (ce qui precede cote navigateur, la
     page entiere, les blocs du meme fichier) : les passer une a une aux appelants revenait
     a reecrire `init()` dans chaque sonde, et c'est ainsi que les copies divergent. */
  function aUnBouton(code, i) {
    return !(BROWSER_ONLY.test(code) || estUnFichierJson(code) || estUneSuiteDeTests(code) ||
      estUnFragmentServeur(code) || estDuDomDePage(code) || estUnServiceWorker(code) ||
      neCompilePas(code) || heriteDuNavigateur(code, navAvant[i]) ||
      estLaSuiteDunFichierDeNavigateur(code, navFichierAvant[i], autresAvant[i]) ||
      estUnFragmentOrphelin(code, tousJs));
  }
  var aBouton = [], aBoutonIdx = [];
  blocsDuFichier.forEach(function (bloc, i) {
    if (bloc.code && aUnBouton(bloc.code, i)) { aBouton.push(bloc.code); aBoutonIdx.push(i); }
  });
  return { navAvant: navAvant, tousJs: tousJs, aBouton: aBouton, aBoutonIdx: aBoutonIdx,
           navFichierAvant: navFichierAvant, autresAvant: autresAvant,
           aUnBouton: aUnBouton };
}

module.exports = {
  RACINE: RACINE,
  lireMotif: lireMotif, lireFonction: lireFonction,
  BROWSER_ONLY: BROWSER_ONLY,
  estUnFichierJson: estUnFichierJson,
  estUneSuiteDeTests: estUneSuiteDeTests,
  estUnFragmentServeur: estUnFragmentServeur,
  estDuDomDePage: estDuDomDePage,
  estUnServiceWorker: estUnServiceWorker,
  neCompilePas: neCompilePas,
  heriteDuNavigateur: heriteDuNavigateur,
  estUnFragmentOrphelin: estUnFragmentOrphelin,
  estLaSuiteDunFichierDeNavigateur: estLaSuiteDunFichierDeNavigateur,
  meriteUnRepli: meriteUnRepli,
  envelopperPourRepli: envelopperPourRepli,
  preambuleQuiCompile: preambuleQuiCompile,
  preambuleReAncre: preambuleReAncre,
  preambuleElague: preambuleElague,
  prochainPrefixe: prochainPrefixe,
  dec: dec, blocsJs: blocsJs, lecons: lecons, contexteLecon: contexteLecon
};
