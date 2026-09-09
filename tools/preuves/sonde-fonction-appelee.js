'use strict';
/**
 * tools/preuves/sonde-fonction-appelee.js — MESURER une piste laissée ouverte par B2b-8,
 * puis par B2b-25 : la FONCTION DÉCLARÉE PAR LE BLOC ET APPELÉE PAR LUI.
 *
 * CE QUI RESTE APRÈS B2b-25. Les deux règles d'héritage exigent que le nom hérité d'un bloc
 * de navigateur soit lu au NIVEAU RACINE du bloc. Le lot qui reste dans `projets-js` a une
 * autre forme, parfaitement homogène :
 *
 *     function rendre() {
 *       const cases = grille.querySelectorAll(".case");   // `grille` vient d'un bloc écarté
 *       …
 *     }
 *     rendre();                                            // …et le bloc l'appelle
 *
 * Le nom est lu à la profondeur 1, donc la règle l'épargne — c'est la précaution mesurée en
 * B2b-8 : « un nom cité dans le corps d'une fonction que le bloc n'appelle jamais ne fait
 * rien échouer ». Mais ici le bloc l'appelle. L'erreur est-elle alors aussi certaine que si
 * le nom ouvrait la ligne ? C'est ce que cette sonde mesure, et rien d'autre.
 *
 * TROIS VARIANTES, de la plus large à la plus prudente :
 *   1. le nom hérité est cité dans le corps d'une fonction déclarée par le bloc ;
 *   2. … et cette fonction est APPELÉE au niveau racine du bloc ;
 *   3. … et la citation n'est sous aucun `if`/`else`/`?:`/`&&`/`||` dans ce corps
 *      (une lecture conditionnelle peut ne jamais avoir lieu).
 *
 * Le statut de chaque bloc est DEMANDÉ à `verif-js.js`, jamais recalculé (leçon de B2b-15).
 *
 *   node tools/verif-js.js > statuts.txt
 *   node tools/preuves/sonde-fonction-appelee.js statuts.txt
 *
 * Sonde de MESURE : elle ne rend aucun verdict et ne corrige rien.
 */
var fs = require('fs');
var path = require('path');
var RACINE = path.resolve(__dirname, '..', '..');
var REG = require(path.join(RACINE, 'tools', 'lib', 'regles-bouton.js'));

var fStatuts = process.argv[2];
if (!fStatuts) { console.log('usage : node tools/preuves/sonde-fonction-appelee.js <sortie de verif-js.js>'); process.exit(2); }
var statut = {};
fs.readFileSync(fStatuts, 'utf8').split(/\r?\n/).forEach(function (l) {
  var m = /^  (OK |REP|ANN|KO |HP |RHL|\?\?\?) (\S+) #(\d+)/.exec(l);
  if (m) statut[m[2] + ' #' + m[3]] = m[1].trim();
});

/* Commentaires, chaînes et gabarits neutralisés caractère par caractère : le code d'un
   `${…}` reste du code, et aucune regex ne suit cette imbrication. */
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
    if (c === '"' || c === "'" || c === '`') {
      var q = c, prof = 0; out += ' '; i++;
      while (i < n) {
        if (t[i] === '\\') { out += '  '; i += 2; continue; }
        if (q === '`' && t[i] === '$' && t[i + 1] === '{') { prof++; out += '  '; i += 2; continue; }
        if (q === '`' && prof > 0 && t[i] === '}') { prof--; out += ' '; i++; continue; }
        if (prof > 0) { out += t[i]; i++; continue; }
        if (t[i] === q) { out += ' '; i++; break; }
        out += (t[i] === '\n' ? '\n' : ' '); i++;
      }
      continue;
    }
    out += c; i++;
  }
  return out;
}

/* LES FONCTIONS DÉCLARÉES EN COLONNE ZÉRO, avec les bornes de leur corps. On ne suit que
   `function nom(…) { … }` : une flèche affectée à un `const` demanderait de suivre
   l'expression, et le lot mesuré n'en contient pas. */
function fonctionsDuBloc(net) {
  var out = [], re = /^function\s+([A-Za-z_$À-ɏ][\w$À-ɏ]*)\s*\(/gm, m;
  while ((m = re.exec(net))) {
    var i = net.indexOf('{', m.index + m[0].length);
    if (i < 0) continue;
    var prof = 0, j = i;
    for (; j < net.length; j++) {
      if (net[j] === '{') prof++;
      else if (net[j] === '}') { prof--; if (prof === 0) break; }
    }
    if (j >= net.length) continue;
    /* LES PARAMÈTRES MASQUENT LE NOM DU DEHORS, et c'est la mesure qui l'a imposé :
       `nodejs/lecon-09` #12 est `function lireOptions(args) { … for (const arg of args) }`
       — `args` y est le paramètre, pas la globale d'un bloc de navigateur. Sans cette
       liste, la variante « appelée » visait 2 blocs VIVANTS. */
    var params = net.slice(m.index + m[0].length, net.indexOf(')', m.index + m[0].length))
      .split(',').map(function (p) { return (p.match(/[A-Za-z_$À-ɏ][\w$À-ɏ]*/) || [''])[0]; })
      .filter(Boolean);
    out.push({ nom: m[1], debut: i, fin: j, params: params });
  }
  return out;
}
function profondeurs(net) {
  var prof = [], p = 0;
  for (var k = 0; k < net.length; k++) {
    if (net[k] === '{') { prof[k] = p; p++; }
    else if (net[k] === '}') { p--; prof[k] = p; }
    else prof[k] = p;
  }
  return prof;
}
function ech(nom) { return nom.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }
/* La fonction est-elle APPELÉE au niveau racine du bloc ? */
function appeleeALaRacine(net, prof, nom) {
  var re = new RegExp('(?:^|[^\\w$.À-ɏ])' + ech(nom) + '\\s*\\(', 'g'), m;
  while ((m = re.exec(net))) {
    var pos = m.index + m[0].length - nom.length - 1;
    while (pos < net.length && !/[A-Za-z_$À-ɏ]/.test(net[pos])) pos++;
    if (!prof[pos]) {
      /* la déclaration elle-même n'est pas un appel */
      var avant = net.slice(Math.max(0, pos - 20), pos);
      if (/function\s*$/.test(avant)) continue;
      return true;
    }
  }
  return false;
}
/* La citation est-elle sous une condition dans le corps ? Approximation VOLONTAIREMENT
   grossière et prudente : on regarde si le texte du corps, avant la citation, ouvre un
   `if`/`else`/`?`/`&&`/`||` non refermé au même niveau. On préfère une variante trop
   prudente à une variante qui promet ce qu'elle ne tient pas. */
function sousCondition(corps, posDansCorps) {
  var avant = corps.slice(0, posDansCorps);
  return /(?:^|[^\w$À-ɏ])(?:if|else)\s*[({]|\?|&&|\|\|/.test(avant);
}

var VARIANTES = [
  { cle: 'corps', libelle: 'nom hérité cité dans un corps de fonction du bloc' },
  { cle: 'appelee', libelle: '… et la fonction est APPELÉE au niveau racine' },
  { cle: 'inconditionnel', libelle: '… et la citation n\'est sous aucune condition' }
];
var res = {}; VARIANTES.forEach(function (v) { res[v.cle] = { vises: [], vivants: [] }; });

REG.lecons(null).forEach(function (f) {
  var rel = path.relative(RACINE, f).split(path.sep).join('/');
  var blocs = REG.blocsJs(f);
  var ctx = REG.contexteLecon(blocs);
  /* Les noms déclarés en colonne zéro par les blocs de NAVIGATEUR qui précèdent. */
  var navAvant = ctx.navAvant, autresAvant = ctx.autresAvant;
  blocs.forEach(function (b, i) {
    if (!b.code || !ctx.aUnBouton(b.code, i)) return;
    var cle = rel + ' #' + (i + 1);
    var st = statut[cle];
    if (!st) return;
    var net = neutraliser(b.code);
    var prof = profondeurs(net);
    var fns = fonctionsDuBloc(net);
    if (!fns.length) return;
    var noms = [];
    (navAvant[i] || []).forEach(function (src) {
      var re = /^(?:const|let|var|class|async\s+function|function)\s+([A-Za-z_$À-ɏ][\w$À-ɏ]*)/gm, m;
      while ((m = re.exec(src))) if (noms.indexOf(m[1]) < 0) noms.push(m[1]);
    });
    noms = noms.filter(function (n) {
      var e = ech(n);
      /* le bloc le déclare ou l'affecte lui-même : autonome */
      if (new RegExp('(?:const|let|var|function|class)\\s+' + e + '(?![\\w$À-ɏ])').test(net)) return false;
      if (new RegExp('(?:^|[^\\w$.À-ɏ])' + e + '\\s*=(?!=)').test(net)) return false;
      /* un bloc précédent NON navigateur le déclare : le repli peut le fournir */
      var decl = new RegExp('^(?:const|let|var|class|async\\s+function|function)\\s+' + e + '(?![\\w$À-ɏ])', 'm');
      for (var a = 0; a < (autresAvant[i] || []).length; a++) if (decl.test(autresAvant[i][a])) return false;
      return true;
    });
    if (!noms.length) return;
    var trouve = { corps: [], appelee: [], inconditionnel: [] };
    noms.forEach(function (n) {
      var re = new RegExp('(?:^|[^\\w$.À-ɏ])' + ech(n) + '(?![\\w$À-ɏ])', 'g'), m;
      while ((m = re.exec(net))) {
        var pos = m.index + m[0].length - n.length;
        if (/^\s*:/.test(net.slice(pos + n.length))) continue;   /* clé d'objet ou étiquette */
        for (var k = 0; k < fns.length; k++) {
          var fn = fns[k];
          if (pos <= fn.debut || pos >= fn.fin) continue;
          if (fn.params.indexOf(n) >= 0) continue;   /* masqué par un paramètre */
          if (trouve.corps.indexOf(n) < 0) trouve.corps.push(n);
          if (appeleeALaRacine(net, prof, fn.nom)) {
            if (trouve.appelee.indexOf(n) < 0) trouve.appelee.push(n);
            if (!sousCondition(net.slice(fn.debut, fn.fin), pos - fn.debut) &&
                trouve.inconditionnel.indexOf(n) < 0) trouve.inconditionnel.push(n);
          }
        }
      }
    });
    VARIANTES.forEach(function (v) {
      if (!trouve[v.cle].length) return;
      var ligne = cle + '  [' + trouve[v.cle].join(', ') + ']  ' + st;
      res[v.cle].vises.push(ligne);
      if (st === 'OK' || st === 'REP') res[v.cle].vivants.push(ligne);
    });
  });
});

console.log('=== LA FONCTION DÉCLARÉE PAR LE BLOC ET APPELÉE PAR LUI ===\n');
console.log('| critère | blocs visés | dont **VIVANTS** |');
console.log('|---|---|---|');
VARIANTES.forEach(function (v) {
  console.log('| ' + v.libelle + ' | ' + res[v.cle].vises.length + ' | **' + res[v.cle].vivants.length + '** |');
});
VARIANTES.forEach(function (v) {
  console.log('\n--- ' + v.cle + ' : ' + res[v.cle].vises.length + ' visé(s) ---');
  res[v.cle].vises.forEach(function (l) { console.log('   ' + l); });
});
console.log('\n(statut demandé à verif-js.js : OK/REP = vivant — un vivant visé est rédhibitoire)');
