'use strict';
/**
 * tools/preuves/sonde-heritage-profondeur.js — MESURER une variante de la règle
 * `heriteDuNavigateur` (point B2b-8) : et si l'usage du nom n'était plus exigé EN COLONNE
 * ZÉRO, mais à la PROFONDEUR ZÉRO d'accolades ?
 *
 * POURQUOI CETTE QUESTION. La règle actuelle écarte un bloc qui OUVRE une ligne sur un nom
 * né d'un `document.querySelector` d'un bloc précédent. Elle rate `pages/js/lecon-33.html`
 * #3, où le nom est lu au MILIEU d'une ligne racine (`const fd = new FormData(form);`) :
 * l'expression est pourtant évaluée au niveau racine, donc l'erreur est aussi certaine que
 * si le nom ouvrait la ligne. Le point B2b-8 avait mesuré « usage n'importe où » (100 visés,
 * 50 VIVANTS — rejeté, car un nom cité dans le CORPS d'une fonction jamais appelée ne fait
 * rien échouer). La profondeur d'accolades est exactement ce qui sépare les deux cas.
 *
 * CE QU'ELLE MESURE. Pour chaque variante : combien de blocs à bouton seraient écartés, et
 * combien d'entre eux sont VIVANTS aujourd'hui. Le statut n'est pas recalculé ici : il est
 * DEMANDÉ au vérificateur (`node tools/verif-js.js`, lignes `OK`/`REP`/`ANN`/`KO`…), pour
 * qu'aucune logique d'exécution ne soit dupliquée — c'est le défaut soldé en B2b-15.
 *
 *   node tools/verif-js.js > statuts.txt
 *   node tools/preuves/sonde-heritage-profondeur.js statuts.txt
 *
 * ⚠️ LE TABLEAU CITÉ AU POINT B2b-23 A ÉTÉ RELEVÉ AVANT que la variante retenue n'entre
 * dans `js/runner.js`. Depuis, les 4 blocs qu'elle vise n'ont plus de bouton, donc plus de
 * statut : relancée aujourd'hui, la sonde rend 0 pour la dernière ligne. C'est le résultat
 * attendu, pas une contradiction — elle mesure ce qu'une règle AJOUTERAIT à l'état courant.
 *
 * Sonde de MESURE : elle ne rend aucun verdict et ne corrige rien.
 */
var fs = require('fs');
var path = require('path');
var RACINE = path.resolve(__dirname, '..', '..');
var REG = require(path.join(RACINE, 'tools', 'lib', 'regles-bouton.js'));

var fStatuts = process.argv[2];
if (!fStatuts) { console.log('usage : node tools/preuves/sonde-heritage-profondeur.js <sortie de verif-js.js>'); process.exit(2); }
var statut = {};
fs.readFileSync(fStatuts, 'utf8').split(/\r?\n/).forEach(function (l) {
  var m = /^  (OK |REP|ANN|KO |HP |RHL|\?\?\?) (\S+) #(\d+)/.exec(l);
  if (m) statut[m[2] + ' #' + m[3]] = m[1].trim();
});

/* Neutraliser commentaires, chaînes et gabarits — caractère par caractère, comme
   `estUnFragmentOrphelin` : aucune regex ne suit l'imbrication d'un `${…}`. Le contenu est
   remplacé par des espaces, donc les positions et les retours à la ligne sont conservés. */
function neutraliser(src) {
  var t = String(src), n = t.length, out = '', i = 0;
  while (i < n) {
    var c = t[i];
    if (c === '/' && t[i + 1] === '/') { while (i < n && t[i] !== '\n') { out += ' '; i++; } continue; }
    if (c === '/' && t[i + 1] === '*') {
      out += '  '; i += 2;
      while (i < n && !(t[i] === '*' && t[i + 1] === '/')) { out += (t[i] === '\n' ? '\n' : ' '); i++; }
      out += '  '; i += 2; continue;
    }
    if (c === '"' || c === "'") {
      var q = c; out += ' '; i++;
      while (i < n && t[i] !== q) { if (t[i] === '\\') { out += ' '; i++; } out += (t[i] === '\n' ? '\n' : ' '); i++; }
      out += ' '; i++; continue;
    }
    if (c === '`') {
      out += ' '; i++;
      while (i < n && t[i] !== '`') {
        if (t[i] === '\\') { out += ' '; i++; out += (t[i] === '\n' ? '\n' : ' '); i++; continue; }
        if (t[i] === '$' && t[i + 1] === '{') {          /* le code d'un ${…} reste du code */
          var prof = 0; out += '  ';
          i += 2; prof = 1;
          while (i < n && prof > 0) {
            if (t[i] === '{') prof++;
            else if (t[i] === '}') { prof--; if (!prof) break; }
            out += t[i]; i++;
          }
          out += ' '; i++; continue;
        }
        out += (t[i] === '\n' ? '\n' : ' '); i++;
      }
      out += ' '; i++; continue;
    }
    out += c; i++;
  }
  return out;
}

/* Les positions du nom lu dans le texte, avec la profondeur d'accolades à cet endroit.
   Une lecture ne compte pas si elle est précédée d'un point (propriété) ou suivie de `:`
   (clé d'objet ou étiquette). */
function lecturesDe(net, nom) {
  var re = new RegExp('(^|[^\\w$.À-ɏ])(' + nom.replace(/[$]/g, '\\$&') + ')(?![\\w$À-ɏ])', 'g');
  var m, res = [], prof = 0, i = 0;
  var profA = new Array(net.length);
  for (i = 0; i < net.length; i++) {
    if (net[i] === '{') { profA[i] = prof; prof++; }
    else if (net[i] === '}') { prof--; profA[i] = prof; }
    else profA[i] = prof;
  }
  while ((m = re.exec(net))) {
    var pos = m.index + m[1].length;
    var apres = net.slice(pos + nom.length).match(/^\s*:/);
    if (apres) continue;
    res.push(profA[pos] || 0);
  }
  return res;
}

/* La flèche sans accolades : `const f = () => form.value` est à la profondeur 0 et n'est
   pourtant PAS évaluée. On repère les têtes de flèche et on marque tout ce qui suit
   jusqu'à la fin de l'instruction comme « différé ». Variante mesurée séparément. */
function coupeApresFleches(net) {
  var out = net.split('\n').map(function (ligne) {
    var i = ligne.indexOf('=>');
    if (i < 0) return ligne;
    if (/^\s*\{/.test(ligne.slice(i + 2))) return ligne;   /* corps entre accolades : déjà traité par la profondeur */
    return ligne.slice(0, i);
  });
  return out.join('\n');
}

/* Les LISTES DE PARAMÈTRES sont à la profondeur 0 d'accolades et ne sont pourtant pas des
   lectures : `function rendre(etat)` déclare `etat`, il ne le lit pas. C'est le faux positif
   qui rendait `projets-js/lecon-02` #3 « visé » alors qu'il aboutit seul. Même chose pour
   `catch (e)` et pour la tête d'une flèche. */
function sansParametres(net) {
  return net
    .replace(/(function\s*[\w$À-ɏ]*\s*|catch\s*|[\w$À-ɏ]\s*)\(([^()]*)\)(\s*(?:=>|\{))/g,
      function (m, av, dedans, ap) { return av + '(' + dedans.replace(/[^\n]/g, ' ') + ')' + ap; })
    .replace(/\(([^()]*)\)(\s*=>)/g, function (m, dedans, ap) { return '(' + dedans.replace(/[^\n]/g, ' ') + ')' + ap; });
}

var variantes = [
  { nom: 'colonne 0 (règle ACTUELLE)', test: function (net, nom) { return new RegExp('^' + nom.replace(/[$]/g, '\\$&') + '(?![\\w$À-ɏ])', 'm').test(net); } },
  { nom: 'profondeur 0 d\'accolades', test: function (net, nom) { return lecturesDe(net, nom).indexOf(0) >= 0; } },
  { nom: 'profondeur 0, flèches courtes coupées', test: function (net, nom) { return lecturesDe(coupeApresFleches(net), nom).indexOf(0) >= 0; } },
  { nom: 'n\'importe où', test: function (net, nom) { return lecturesDe(net, nom).length > 0; } },
  /* LE MÊME FICHIER (`data-file` identique) : le bloc est annoncé par la PAGE comme la
     suite du précédent, pas comme un programme à part. L'usage n'est alors plus exigé en
     colonne zéro — c'est l'étiquette de la page qui porte le lien, pas une regex. */
  { nom: 'MÊME data-file + usage n\'importe où', memeFichier: true, test: function (net, nom) { return lecturesDe(net, nom).length > 0; } },
  { nom: 'MÊME data-file + profondeur 0', memeFichier: true, test: function (net, nom) { return lecturesDe(net, nom).indexOf(0) >= 0; } },
  { nom: 'MÊME data-file + profondeur 0, PARAMÈTRES neutralisés', memeFichier: true,
    test: function (net, nom) { return lecturesDe(sansParametres(net), nom).indexOf(0) >= 0; } },
  { nom: '… + le nom absent des blocs à BOUTON précédents (le repli ne peut rien)', memeFichier: true, horsPreambule: true,
    test: function (net, nom) { return lecturesDe(sansParametres(net), nom).indexOf(0) >= 0; } },
  /* La garde ci-dessus est CIRCULAIRE si on l'écrit dans le moteur : la liste des blocs à
     bouton dépend des règles du bouton, dont celle-ci. La garde retenue est donc plus large
     et calculable sans rien décider : le nom n'est déclaré dans AUCUN bloc précédent qui ne
     soit pas du navigateur. Elle épargne au moins autant de blocs, jamais moins. */
  { nom: '… garde ÉLARGIE : absent de tout bloc précédent NON navigateur', memeFichier: true, horsNonNav: true,
    test: function (net, nom) { return lecturesDe(sansParametres(net), nom).indexOf(0) >= 0; } }
];

var resultats = variantes.map(function () { return { vises: [], vivants: [] }; });

REG.lecons(null).forEach(function (f) {
  var rel = path.relative(RACINE, f).replace(/\\/g, '/');
  var blocs = REG.blocsJs(f);
  var navAvant = [], vusNav = [], tousJs = [];
  blocs.forEach(function (b) {
    navAvant.push(vusNav.slice());
    if (!b.code) return;
    tousJs.push(b.code);
    if (REG.BROWSER_ONLY.test(b.code) || REG.estDuDomDePage(b.code)) vusNav.push({ code: b.code, fichier: b.fichier || '' });
  });
  /* LE PRÉFIXE : les blocs à BOUTON qui précèdent, c'est-à-dire ce dont le repli dispose.
     Un nom qu'ils déclarent peut être fourni au bloc ; le retirer serait une perte. */
  var aBouton = [], vus = 0, prefixeDe = [], nonNavDe = [], nonNav = [];
  blocs.forEach(function (b, i) {
    prefixeDe[i] = aBouton.slice();
    nonNavDe[i] = nonNav.slice();
    if (!b.code) return;
    if (!(REG.BROWSER_ONLY.test(b.code) || REG.estDuDomDePage(b.code))) nonNav.push(b.code);
    if (!(REG.BROWSER_ONLY.test(b.code) || REG.estUnFichierJson(b.code) || REG.estUneSuiteDeTests(b.code) ||
          REG.estUnFragmentServeur(b.code) || REG.estDuDomDePage(b.code) || REG.estUnServiceWorker(b.code) ||
          REG.neCompilePas(b.code) || REG.heriteDuNavigateur(b.code, (navAvant[i] || []).map(function (o) { return o.code; })) ||
          REG.estUnFragmentOrphelin(b.code, tousJs))) aBouton.push(b.code);
  });
  blocs.forEach(function (b, i) {
    if (!b.code) return;
    var code = b.code;
    /* Seuls les blocs qui ONT un bouton aujourd'hui peuvent en perdre un. */
    if (REG.BROWSER_ONLY.test(code) || REG.estUnFichierJson(code) || REG.estUneSuiteDeTests(code) ||
        REG.estUnFragmentServeur(code) || REG.estDuDomDePage(code) || REG.estUnServiceWorker(code) ||
        REG.neCompilePas(code) || REG.estUnFragmentOrphelin(code, tousJs)) return;
    var cle = rel + ' #' + (i + 1);
    var st = statut[cle];
    if (!st) return;                        /* déjà écarté par heriteDuNavigateur : pas de ligne */
    var net = neutraliser(code);
    var noms = [], nomsMemeFichier = [];
    (navAvant[i] || []).forEach(function (src) {
      var re = /^(?:const|let|var|class|async\s+function|function)\s+([A-Za-z_$À-ɏ][\w$À-ɏ]*)/gm, m;
      while ((m = re.exec(src.code))) {
        if (noms.indexOf(m[1]) < 0) noms.push(m[1]);
        if (src.fichier && b.fichier && src.fichier === b.fichier && nomsMemeFichier.indexOf(m[1]) < 0) nomsMemeFichier.push(m[1]);
      }
    });
    noms = noms.filter(function (n) {
      var e = n.replace(/[$]/g, '\\$&');
      if (new RegExp('(?:const|let|var|function|class)\\s+' + e + '(?![\\w$À-ɏ])').test(net)) return false;
      if (new RegExp('(?:^|[^\\w$.À-ɏ])' + e + '\\s*=(?!=)').test(net)) return false;
      return true;
    });
    nomsMemeFichier = nomsMemeFichier.filter(function (n) { return noms.indexOf(n) >= 0; });
    var declareDans = function (liste, n) {
      var e = n.replace(/[$]/g, '\\$&');
      var d = new RegExp('^(?:const|let|var|class|async\\s+function|function)\\s+' + e + '(?![\\w$À-ɏ])', 'm');
      return (liste || []).some(function (t) { return d.test(t); });
    };
    var declareAvantAvecBouton = function (n) { return declareDans(prefixeDe[i], n); };
    variantes.forEach(function (v, k) {
      var liste = v.memeFichier ? nomsMemeFichier : noms;
      if (v.horsPreambule) liste = liste.filter(function (n) { return !declareAvantAvecBouton(n); });
      if (v.horsNonNav) liste = liste.filter(function (n) { return !declareDans(nonNavDe[i], n); });
      for (var j = 0; j < liste.length; j++) {
        if (v.test(net, liste[j])) {
          resultats[k].vises.push(cle + '  [' + liste[j] + ']  ' + st);
          if (st === 'OK' || st === 'REP') resultats[k].vivants.push(cle + '  [' + liste[j] + ']');
          return;
        }
      }
    });
  });
});

console.log('=== HÉRITAGE DU NAVIGATEUR : QUEL USAGE DU NOM RETENIR ? ===');
console.log('(blocs qui ont ENCORE un bouton après la règle actuelle — statut demandé au vérificateur)\n');
console.log('| critère | blocs visés | dont VIVANTS |');
console.log('|---|---|---|');
variantes.forEach(function (v, k) {
  console.log('| ' + v.nom + ' | ' + resultats[k].vises.length + ' | ' + resultats[k].vivants.length + ' |');
});
variantes.forEach(function (v, k) {
  console.log('\n--- ' + v.nom + ' : ' + resultats[k].vises.length + ' visé(s) ---');
  resultats[k].vises.forEach(function (o) { console.log('   ' + o); });
});
