'use strict';
/**
 * tools/preuves/sonde-annonce-liee.js — L'ANNONCE PARLE-T-ELLE BIEN DE L'ERREUR OBTENUE ?
 *
 * POURQUOI
 * --------
 * Une erreur que la page ANNONCE en commentaire n'est pas une panne : c'est la leçon. Le
 * vérificateur des blocs JavaScript soustrait donc ces blocs à son verdict, sur deux
 * critères écrits dans `tools/lib/contexte-worker.js` :
 *   1. `ERREUR_ANNONCEE`, un motif FRANÇAIS : un commentaire quelconque du bloc contient
 *      « erreur », « throw », « lève », « refuse », « échoue », « plante », « invalide »…
 *   2. l'annonce PAR SON NOM technique (point B2b-13), qui exige le nom de l'erreur ET le
 *      début de son message dans un commentaire.
 *
 * Le second critère est lié à l'erreur obtenue. **Le premier ne l'est pas du tout** : il
 * suffit qu'un mot de la liste figure dans n'importe quel commentaire pour que N'IMPORTE
 * QUELLE erreur du bloc soit absoute. C'est un blanc-seing, et le point B2b-17 en a trouvé
 * un cas sur pièce : `projets-js/lecon-15` #6 écrit « demi-tour interdit … refuse » pour
 * décrire une règle du jeu de serpent, et se voyait pardonner un `etatInitial is not
 * defined` qui n'a rien à voir — l'apprenant, lui, lisait la panne.
 *
 * CE QUE LA SONDE MESURE, SANS RIEN CORRIGER
 * ------------------------------------------
 * Pour chaque bloc que le vérificateur range en « erreur annoncée », elle demande si
 * l'annonce est LIÉE à l'erreur obtenue. Le lien exigé est le plus simple qui soit
 * vérifiable : quand l'erreur nomme un identifiant (« X is not defined », « Cannot access
 * 'X' before initialization »), un commentaire du bloc doit citer **X**. Une leçon qui
 * montre volontairement qu'un nom n'existe pas l'écrit toujours ; un commentaire qui parle
 * d'autre chose, non.
 *
 *   LIÉE      l'annonce cite le nom en cause : la leçon montre bien cette erreur-là.
 *   NON-LIÉE  aucun commentaire ne cite le nom : le bloc est absous par un mot qui parle
 *             d'autre chose. Ce sont des pannes candidates, VUES PAR L'APPRENANT.
 *   SANS-NOM  l'erreur ne nomme pas d'identifiant (`TypeError` d'un `throw` de la leçon…).
 *
 * LES SANS-NOM SONT JUGÉES À LEUR TOUR (2026-09-09, point B2b-19). Elles étaient la moitié
 * du blanc-seing qui restait après B2b-18 : onze blocs absous sans que rien ne regarde. Deux
 * liens, vérifiables tous les deux, suffisent à les couvrir :
 *   CITÉE   un commentaire écrit le nom de l'erreur ET le début de son message (règle B2b-13) ;
 *   JETÉE   le message est un littéral du bloc lui-même, précédé d'un `throw` : c'est le code
 *           qui lève, la démonstration EST là (`js/lecon-63` #1 : `throw 'utilisateur
 *           introuvable'`, et l'apprenant lit « utilisateur introuvable ») ;
 *   REFUS   le message est celui que `js/runner.js` oppose au réseau : ni panne ni annonce,
 *           c'est une décision du site, comptée à part par le vérificateur ;
 *   NON-LIÉE-SANS-NOM   aucun des trois : le bloc était absous par un mot de vocabulaire.
 *
 * Elle sort en 0 quand elle atteint sa dernière ligne, en 3 sinon — la garde posée après
 * les sondes qui se sont arrêtées en silence (B2b-13, B2b-14, B2b-16).
 *
 *   node tools/preuves/sonde-annonce-liee.js
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

/* Les commentaires seuls : une annonce est faite AU LECTEUR. Un nom qui n'apparaît que
   dans le code n'annonce rien — c'est justement le code qui échoue. */
function commentairesDe(code) {
  var out = [];
  String(code).replace(/\/\*[\s\S]*?\*\//g, function (m) { out.push(m); return m; });
  String(code).replace(/(^|[^:\\])\/\/([^\n]*)/g, function (m, p, c) { out.push(c); return m; });
  return out.join('\n');
}

var lies = [], nonLies = [], citees = [], jetees = [], refus = [], nonLiesSansNom = [];

fichiers.forEach(function (f) {
  var rel = path.relative(RACINE, f).replace(/\\/g, '/');
  var blocs = REG.blocsJs(f);
  var ctx = REG.contexteLecon(blocs);
  var vus = 0;

  blocs.forEach(function (bloc, i) {
    var code = bloc.code;
    if (!code || !ctx.aUnBouton(code, ctx.navAvant[i])) return;
    var prefixe = ctx.aBouton.slice(0, vus);
    vus++;

    var msg = null;
    try {
      vm.runInContext(code, vm.createContext(CTX.contexteWorker([])), { timeout: DELAI, displayErrors: false });
    } catch (e) {
      msg = (e && e.name ? e.name + ': ' : '') + (e && e.message ? e.message : String(e));
    }
    if (!msg || /timed out/i.test(msg)) return;

    /* Le repli, à l'identique du vérificateur : un bloc réparé n'est pas « annoncé ». */
    if (prefixe.length && REG.meriteUnRepli(msg)) {
      var jouer = function (gardes) {
        var brut = CTX.contexteWorker([]);
        brut.__finDuPrelude = function () {};
        try {
          vm.runInContext(gardes.join('\n') + '\n;__finDuPrelude();\n' + REG.envelopperPourRepli(code),
            vm.createContext(brut), { timeout: DELAI, displayErrors: false });
        } catch (e2) {
          return (e2 && e2.name ? e2.name + ': ' : '') + (e2 && e2.message ? e2.message : String(e2));
        }
        return null;
      };
      var prf = prefixe, ancres = [];
      var gardes = REG.preambuleQuiCompile(prf, code, ancres);
      var err = gardes.length ? jouer(gardes) : 'préambule vide';
      while (err && gardes.length) {
        var suite = REG.prochainPrefixe(prf, err, ancres);
        if (!suite) break;
        gardes = REG.preambuleQuiCompile(suite.prefixe, code, ancres);
        if (!gardes.length) break;
        prf = suite.prefixe;
        err = jouer(gardes);
      }
      if (!err) return;
    }
    var ou = rel + ' #' + (i + 1) + (bloc.fichier ? '  [' + bloc.fichier + ']' : '');
    /* Le refus hors ligne du moteur est jugé AVANT tout : le vérificateur le compte à part,
       et c'est ici qu'un blanc-seing en absolvait un et laissait son jumeau en panne. */
    if (CTX.estRefusHorsLigne(msg)) { refus.push(ou + ' — ' + msg.split(',')[0]); return; }
    if (!CTX.erreurAnnoncee(code, msg)) return;   // pas rangé en « annoncée » : hors sujet

    var m = /^ReferenceError: (?:([A-Za-z_$À-ɏ][\w$À-ɏ]*) is not defined|Cannot access '([^']+)' before initialization)/.exec(msg);
    if (!m) {
      if (CTX.annonceCiteLeMessage(code, msg)) citees.push(ou + ' — ' + msg.split('\n')[0].slice(0, 60));
      else if (CTX.messageJeteParLeBloc(code, msg)) jetees.push(ou + ' — ' + msg.split('\n')[0].slice(0, 60));
      else nonLiesSansNom.push(ou + ' — ' + msg.split('\n')[0].slice(0, 60));
      return;
    }
    var nom = m[1] || m[2];
    var com = commentairesDe(code);
    if (new RegExp('(?:^|[^\\w$À-ɏ])' + nom.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '(?![\\w$À-ɏ])').test(com)) {
      lies.push(ou + ' — ' + nom);
    } else {
      nonLies.push(ou + ' — ' + nom + '  (annonce : ' + com.replace(/\s+/g, ' ').trim().slice(0, 60) + ')');
    }
  });
});

console.log('=== L\'ANNONCE PARLE-T-ELLE DE L\'ERREUR OBTENUE ? ===\n');
console.log('LIÉE (le commentaire cite le nom en cause) : ' + lies.length);
lies.forEach(function (o) { console.log('    ' + o); });
console.log('\nNON-LIÉE (aucun commentaire ne cite le nom) : ' + nonLies.length);
nonLies.forEach(function (o) { console.log('    ' + o); });
console.log('\n--- LES ERREURS QUI NE NOMMENT AUCUN IDENTIFIANT (point B2b-19) ---');
console.log('CITÉE (un commentaire écrit le nom de l\'erreur et le début du message) : ' + citees.length);
citees.forEach(function (o) { console.log('    ' + o); });
console.log('\nJETÉE (le message est un littéral que le bloc lève lui-même) : ' + jetees.length);
jetees.forEach(function (o) { console.log('    ' + o); });
console.log('\nREFUS HORS LIGNE (le moteur coupe le réseau et le dit : ni panne ni annonce) : ' + refus.length);
refus.forEach(function (o) { console.log('    ' + o); });
console.log('\nNON-LIÉE SANS NOM (absous par un mot de vocabulaire, rien d\'autre) : ' + nonLiesSansNom.length);
nonLiesSansNom.forEach(function (o) { console.log('    ' + o); });
console.log('\n  (sonde de RECENSEMENT : elle ne rend aucun verdict et ne corrige rien)');
process.exit(0);
