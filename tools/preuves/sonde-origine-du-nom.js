'use strict';
/**
 * tools/preuves/sonde-origine-du-nom.js — POUR CHAQUE BLOC ENCORE EN PANNE, OÙ LE NOM
 * MANQUANT EST-IL ÉCRIT DANS LA LEÇON ?
 *
 * POURQUOI
 * --------
 * Les points B2b-1 à B2b-16 ont vidé les lots homogènes : modules ES, fichiers de données,
 * suites de tests, fragments de serveur, DOM, service workers, blocs qui ne compilent pas,
 * fragments orphelins, héritage du navigateur, préambule ré-ancré puis élagué. Il reste
 * 42 blocs, et leur liste par CAUSE ne dit plus rien d'exploitable : 36 messages différents
 * pour 42 blocs, presque tous « X is not defined » avec un X à chaque fois nouveau.
 *
 * La bonne question n'est donc plus « quelle erreur ? » mais « D'OÙ VIENDRAIT LE NOM ? ».
 * Le repli (B2b-7) rejoue un bloc tombé sur un nom manquant derrière les blocs À BOUTON qui
 * le précèdent. S'il échoue quand même, c'est pour une de ces raisons, et ce sont elles que
 * la sonde compte, sans en corriger aucune :
 *
 *   BOUTON-AVANT  le nom EST déclaré dans un bloc à bouton antérieur — le repli aurait dû
 *                 le fournir. C'est une anomalie du MOTEUR, la seule catégorie qui accuse
 *                 l'outil plutôt que le contenu.
 *   MUET-AVANT    le nom est déclaré dans un bloc antérieur SANS bouton (écarté par une des
 *                 règles). Le préambule ne peut pas le donner, par construction.
 *   PLUS-BAS      le nom n'est déclaré qu'APRÈS le bloc. Le repli ne remonte pas le temps.
 *   NULLE-PART    aucune déclaration de ce nom dans la page entière. C'est un fragment
 *                 orphelin que `estUnFragmentOrphelin` ne voit pas, parce qu'elle n'examine
 *                 que les identifiants en TÊTE DE LIGNE (`^([A-Za-z_$…])`) : un nom employé
 *                 au milieu d'une ligne lui échappe.
 *   AUTRE         l'erreur n'est pas « X is not defined » (return illégal, TypeError…).
 *
 * ⚠️ ELLE NE CORRIGE RIEN ET NE REMPLACE AUCUN VERDICT. Elle sort en 0 quand elle atteint sa
 * dernière ligne, en 3 sinon — c'est la garde posée après les trois sondes qui se sont
 * arrêtées en silence (B2b-13, B2b-14, B2b-16). Les règles du bouton et le repli sont pris
 * dans `tools/lib/regles-bouton.js`, qui les LIT dans `js/runner.js` : la sonde et le
 * vérificateur décident donc exactement pareil, ce qui est tout l'objet de ce module.
 *
 *   node tools/preuves/sonde-origine-du-nom.js            # tout le site
 *   node tools/preuves/sonde-origine-du-nom.js pages/js   # un dossier ou un fichier
 */
var path = require('path');
var vm = require('vm');

var REG = require('../lib/regles-bouton.js');
var CTX = require('../lib/contexte-worker.js');
var RACINE = REG.RACINE;
var DELAI = 5000;

process.on('uncaughtException', function (e) {
  console.error('SONDE INTERROMPUE : ' + (e && e.stack ? e.stack : e));
  process.exit(3);
});

var cibles = process.argv.slice(2).filter(function (a) { return a.indexOf('--') !== 0; });
var fichiers = [];
if (cibles.length) cibles.forEach(function (c) { fichiers = fichiers.concat(REG.lecons(c)); });
else fichiers = REG.lecons(null);

/* La déclaration d'un nom, telle que `estUnFragmentOrphelin` la reconnaît (B2b-10) : une
   déclaration lexicale, ou une affectation. On reprend SES deux motifs, mot pour mot, pour
   que les deux instruments s'accordent sur ce que « fourni » veut dire. */
function fournitLeNom(bloc, nom) {
  var n = nom.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  var decl = new RegExp('(?:const|let|var|class|function)\\s+' + n + '(?![\\w$À-ɏ])');
  var affect = new RegExp('(?:^|[^\\w$.À-ɏ])' + n + '\\s*=(?!=)');
  return decl.test(bloc) || affect.test(bloc);
}

var classes = { 'BOUTON-AVANT': [], 'MUET-AVANT': [], 'PLUS-BAS': [], 'NULLE-PART': [], 'AUTRE': [] };
var examines = 0;

fichiers.forEach(function (f) {
  var rel = path.relative(RACINE, f).replace(/\\/g, '/');
  var blocs = REG.blocsJs(f);
  var ctx = REG.contexteLecon(blocs);
  var vus = 0;

  blocs.forEach(function (bloc, i) {
    var code = bloc.code;
    if (!code) return;
    if (!ctx.aUnBouton(code, ctx.navAvant[i])) return;
    var prefixe = ctx.aBouton.slice(0, vus);
    vus++;

    /* On rejoue exactement ce que fait `verif-js.js` : le bloc seul, puis le repli. */
    var sorties = [];
    var msg = null;
    try {
      vm.runInContext(code, vm.createContext(CTX.contexteWorker(sorties)),
        { timeout: DELAI, displayErrors: false });
    } catch (e) {
      msg = (e && e.name ? e.name + ': ' : '') + (e && e.message ? e.message : String(e));
    }
    if (!msg) return;
    if (/timed out/i.test(msg)) return;

    if (msg && prefixe.length && REG.meriteUnRepli(msg)) {
      var jouerDerriere = function (gardes) {
        var s2 = [], brut = CTX.contexteWorker(s2);
        brut.__finDuPrelude = function () {};
        try {
          vm.runInContext(gardes.join('\n') + '\n;__finDuPrelude();\n' + REG.envelopperPourRepli(code),
            vm.createContext(brut), { timeout: DELAI, displayErrors: false });
        } catch (e2) {
          return { err: (e2 && e2.name ? e2.name + ': ' : '') + (e2 && e2.message ? e2.message : String(e2)) };
        }
        return { err: null };
      };
      var prf = prefixe, ancres = [];
      var gardes = REG.preambuleQuiCompile(prf, code, ancres);
      var essai = gardes.length ? jouerDerriere(gardes) : { err: 'préambule vide' };
      while (essai.err && gardes.length) {
        var suite = REG.prochainPrefixe(prf, essai.err, ancres);
        if (!suite) break;
        gardes = REG.preambuleQuiCompile(suite.prefixe, code, ancres);
        if (!gardes.length) break;
        prf = suite.prefixe;
        essai = jouerDerriere(gardes);
      }
      if (!essai.err) return;                    // réparé par le repli : rien à classer
      /* ⚠️ ON GARDE LE MESSAGE D'ORIGINE, PAS CELUI DU REPLI ÉCHOUÉ. Un premier jet de cette
         sonde retenait `essai.err` : elle classait alors 43 blocs là où `verif-js.js` en
         compte 42, et nommait `utilisateur introuvable` un bloc que le vérificateur range
         sous `surlignerChamp is not defined`. Deux instruments, deux verdicts sur les mêmes
         blocs — le défaut même que `tools/lib/regles-bouton.js` vient de fermer. `verif-js.js`
         est la référence : il juge sur le message du bloc SEUL. */
    }
    if (CTX.erreurAnnoncee(code, msg)) return;   // c'est la leçon, pas une panne
    if (CTX.estHorsPortee(msg)) return;          // globale du Worker que Node n'a pas

    examines++;
    var oublie = msg.match(/^ReferenceError: ([A-Za-z_$À-ɏ][\w$À-ɏ]*) is not defined/);
    var ou = rel + ' #' + (i + 1) + (bloc.fichier ? '  [' + bloc.fichier + ']' : '');
    if (!oublie) { classes['AUTRE'].push(ou + ' — ' + msg.slice(0, 70)); return; }
    var nom = oublie[1];

    var avantBouton = false, avantMuet = false, apres = false;
    blocs.forEach(function (b2, j) {
      if (!b2.code || j === i) return;
      if (!fournitLeNom(b2.code, nom)) return;
      if (j < i) { if (ctx.aUnBouton(b2.code, ctx.navAvant[j])) avantBouton = true; else avantMuet = true; }
      else apres = true;
    });
    var etiq = avantBouton ? 'BOUTON-AVANT' : avantMuet ? 'MUET-AVANT' : apres ? 'PLUS-BAS' : 'NULLE-PART';
    classes[etiq].push(ou + ' — ' + nom);
  });
});

console.log('=== D\'OÙ VIENDRAIT LE NOM MANQUANT ? ' + examines + ' bloc(s) en panne examiné(s) ===\n');
Object.keys(classes).forEach(function (k) {
  console.log(k + ' : ' + classes[k].length);
  classes[k].forEach(function (o) { console.log('    ' + o); });
  console.log('');
});
console.log('  (sonde de RECENSEMENT : elle ne rend aucun verdict et ne corrige rien)');
process.exit(0);
