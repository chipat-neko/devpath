'use strict';
/**
 * tools/preuves/rejoue-c.js — RECALCULER les sorties que les leçons C affirment.
 *
 * POURQUOI. La règle du chantier V14 interdit d'écrire une valeur de tête : il faut la
 * faire tourner. Aucun compilateur C n'est disponible ici (`gcc`, `cc`, `clang`, `tcc` :
 * absents, vérifié). Mais les 26 blocs du cours qui portent une tête stricte
 * « // Sortie : » sont de l'algorithmique déterministe sur des entiers, des chaînes,
 * des tableaux, des structures et quelques flottants : leur sémantique se REJOUE
 * fidèlement, à condition de reproduire aussi ce que C IMPRIME — et c'est là que se
 * cachent les pièges :
 *
 *   · `printf` écrit dans un FLUX, pas en lignes : `printf("%d ", x)` répété puis un
 *     `printf("\n")` final ne font qu'UNE ligne. D'où le petit flux ci-dessous, et un
 *     mini-`printf` qui traite `%d`, `%ld`, `%lld`, `%s`, `%.Nf` et `%%`.
 *   · `%.2f` ARRONDIT et complète les décimales (15.5 s'imprime « 15.50 »).
 *   · la première constante d'un `enum` vaut 0, pas 1 (MERCREDI vaut 2).
 *   · `ptr->champ = v` modifie l'ORIGINAL, alors qu'un paramètre `Point p` reçoit une
 *     copie qui ne remonte pas.
 *   · le `switch` sur `case 6: case 7:` partage un corps sans le dupliquer.
 *
 * CE QUE ÇA PROUVE, ET CE QUE ÇA NE PROUVE PAS. Ça prouve que la VALEUR affirmée par la
 * leçon est celle que produit l'algorithme, formatage compris. Ça ne prouve pas que le C
 * compile, ni ce que fait un comportement indéfini. La transposition est écrite
 * ci-dessous, lisible, et confrontée à la sortie EXTRAITE du HTML — jamais retapée.
 *
 * TROIS TRANSCRIPTIONS PARTIELLES, déclarées et non maquillées (mêmes champs que le
 * rejeu C# pour sa glose « (2 secondes plus tard) ») :
 *   · `glose`      — la leçon ajoute un commentaire DANS la ligne de sortie
 *                    (`Somme = 60   (10 + 20 + 30)`) : ce n'est pas de la sortie.
 *   · `invite`     — le programme écrit une invite de saisie avant sa sortie
 *                    (`Combien d'entiers ? `), que la leçon transcrit en « Entrée : ».
 *   · `videEnTete` — le programme émet une ligne vide initiale (`printf("\nBilan…")`)
 *                    qu'un commentaire ne peut pas montrer.
 *
 * ⚠️ UN REJEU QUI NE TROUVE RIEN DOIT PROUVER QU'IL SAIT TROUVER. D'où les contre-
 * épreuves ciblées : chacune casse UNE règle et doit faire apparaître exactement les
 * programmes qui en dépendent, ni plus ni moins.
 *
 *   node tools/preuves/rejoue-c.js                   compare, sortie 0 si tout concorde
 *   node tools/preuves/rejoue-c.js --fausse=espace   `printf("%d ")` perd son séparateur
 *   node tools/preuves/rejoue-c.js --fausse=arrondi  `%.Nf` tronque au lieu d'arrondir
 *   node tools/preuves/rejoue-c.js --fausse=enum     la 1re constante d'un enum vaut 1
 *   node tools/preuves/rejoue-c.js --fausse=fleche   `ptr->champ = v` modifie une copie
 */
var fs = require('fs');
var RACINE = require('path').resolve(__dirname, '..', '..');
var FAUSSE = (process.argv.filter(function (a) { return a.indexOf('--fausse') === 0; })[0] || '').split('=')[1] || '';
function dec(s) {
  return s.replace(/\r\n?/g, '\n')
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'").replace(/&#x27;/gi, "'").replace(/&amp;/g, '&');
}

/* --- ce que C IMPRIME ------------------------------------------------------------ */
var SEP = FAUSSE === 'espace' ? '' : ' ';   // l'espace littéral de `printf("%d ", …)`
var E0 = FAUSSE === 'enum' ? 1 : 0;         // valeur de la première constante d'un enum

function ffix(v, p) {
  if (FAUSSE === 'arrondi') { var k = Math.pow(10, p); return String(Math.trunc(v * k) / k); }
  return v.toFixed(p);
}
function fmt(f, args) {
  var i = 0;
  return f.replace(/%(?:(%)|(?:\.(\d+))?(?:ll|l|z)?([dsfu]))/g, function (m, pct, prec, conv) {
    if (pct) return '%';
    var v = args[i++];
    if (conv === 'd' || conv === 'u') return String(Math.trunc(v));
    if (conv === 's') return String(v);
    return ffix(v, prec === undefined ? 6 : Number(prec));
  });
}
function Flux() { this.buf = ''; }
Flux.prototype.printf = function (f) { this.buf += fmt(f, [].slice.call(arguments, 1)); };
Flux.prototype.lignes = function () {
  var b = this.buf;
  if (b.slice(-1) === '\n') b = b.slice(0, -1);
  return b.split('\n');
};

/* --- les programmes, transposés un à un ------------------------------------------ */
var PROGRAMMES = {

  /* ---- lecon-03 : conditions, boucles, sauts ---- */
  '03/mentions': function (o) {
    var note = 14;
    if (note >= 16) o.printf('Mention tres bien\n');
    else if (note >= 14) o.printf('Mention bien\n');
    else if (note >= 10) o.printf('Admis\n');
    else o.printf('Recale\n');
    var x = -7;
    if (x) o.printf('x vaut %d, donc la condition est vraie\n', x);   // toute valeur non nulle est vraie
  },
  '03/ternaire': function (o) {
    var a = 8, b = 5;
    var max = (a > b) ? a : b;
    o.printf('max = %d\n', max);
    var n = 4;
    o.printf('%d est %s\n', n, (n % 2 === 0) ? 'pair' : 'impair');
  },
  '03/switch-jour': function (o) {
    var jour = 6;
    switch (jour) {
      case 1: case 2: case 3: case 4: case 5:
        o.printf('Jour de semaine\n'); break;
      case 6:
      case 7:                                    // fall-through volontaire : un seul corps
        o.printf('Week-end\n'); break;
      default:
        o.printf('Jour invalide\n'); break;
    }
  },
  '03/trois-boucles': function (o) {
    for (var i = 0; i < 3; i++) o.printf('for i = %d\n', i);
    var n = 3;
    while (n > 0) { o.printf('while n = %d\n', n); n--; }
    var m = 0;
    do { o.printf('do...while m = %d\n', m); m++; } while (m < 2);
  },
  '03/continue-break': function (o) {
    for (var i = 1; i <= 10; i++) {
      if (i % 2 !== 0) continue;
      if (i > 6) break;
      o.printf('%d' + SEP, i);
    }
    o.printf('\n');
  },
  '03/court-circuit': function (o) {
    var p = null;
    if (p !== null && p.val > 0) o.printf('valeur positive\n');
    else o.printf('pointeur nul ou valeur non positive\n');
    var n = 4;
    if (n !== 0 && Math.trunc(100 / n) > 10) o.printf('100/n vaut plus de 10\n');
  },
  '03/goto': function (o) {
    var a = 10, b = 20;   // les deux malloc réussissent : le chemin d'erreur n'est pas pris
    o.printf('a + b = %d\n', a + b);
  },
  '03/flottants': function (o) {
    var r = 0.1 + 0.2;
    if (r === 0.3) o.printf("egal (ne s'affiche pas)\n");
    if (Math.abs(r - 0.3) < 1e-9) o.printf('egal a la tolerance pres\n');
  },
  '03/switch-char': function (o) {
    var choix = 'b';
    switch (choix) {
      case 'a': o.printf('Ajouter\n'); break;
      case 'b': o.printf('Modifier\n'); break;
      case 's': o.printf('Supprimer\n'); break;
      case 'q': o.printf('Quitter\n'); break;
      default: o.printf('Choix invalide\n'); break;
    }
  },
  '03/puissance': function (o) {
    var base = 2, exp = 10;
    var resultat = 1;
    for (var i = 0; i < exp; i++) resultat *= base;
    o.printf('%d^%d = %lld\n', base, exp, resultat);
  },

  /* ---- lecon-07 : allocation dynamique ---- */
  '07/malloc': function (o) {
    var t = [];
    for (var i = 0; i < 5; i++) t[i] = i * i;
    for (i = 0; i < 5; i++) o.printf('%d' + SEP, t[i]);
    o.printf('\n');
  },
  '07/calloc': function (o) {
    var c = [0, 0, 0, 0];        // calloc met tout à zéro, c'est garanti
    c[2] += 1;
    for (var i = 0; i < 4; i++) o.printf('%d' + SEP, c[i]);
    o.printf('\n');
  },
  '07/realloc': function (o) {
    var t = [10, 20];
    t[2] = 30; t[3] = 40;        // realloc conserve t[0] et t[1]
    for (var i = 0; i < 4; i++) o.printf('%d' + SEP, t[i]);
    o.printf('\n');
  },
  '07/taille-execution': function (o) {
    var n = 3;                   // « Entrée : 3 »
    o.printf("Combien d'entiers ? ");
    var tab = [], somme = 0;
    for (var i = 0; i < n; i++) { tab[i] = (i + 1) * 10; somme += tab[i]; }
    o.printf('Somme = %ld\n', somme);
  },
  '07/realloc-6': function (o) {
    var t = [];
    for (var i = 0; i < 3; i++) t[i] = i + 1;
    for (i = 3; i < 6; i++) t[i] = (i + 1) * 10;
    for (i = 0; i < 6; i++) o.printf('%d' + SEP, t[i]);
    o.printf('\n');
  },
  '07/fuites': function (o) {
    var a = [];
    for (var i = 0; i < 4; i++) a[i] = i;
    o.printf('%d\n', a[0]);      // on LIT avant de libérer
  },

  /* ---- lecon-08 : structures et énumérations ---- */
  '08/point': function (o) {
    var p = { x: 3, y: 7 };
    o.printf('p = (%d, %d)\n', p.x, p.y);
    var q = { x: 10, y: 20 };
    o.printf('q = (%d, %d)\n', q.x, q.y);
  },
  '08/typedef': function (o) {
    var p = { x: 1, y: 2 };
    o.printf('(%d, %d)\n', p.x, p.y);
  },
  '08/fleche': function (o) {
    var p = { x: 4, y: 9 };
    var ptr = FAUSSE === 'fleche' ? { x: p.x, y: p.y } : p;   // -> agit sur l'ORIGINAL
    o.printf('%d\n', ptr.x);      // (*ptr).x
    o.printf('%d\n', ptr.x);      // ptr->x : strictement équivalent
    ptr.y = 100;
    o.printf('p.y = %d\n', p.y);
  },
  '08/passage': function (o) {
    function afficher(p) { o.printf('(%d, %d)\n', p.x, p.y); }          // par valeur : une copie
    function afficherPtr(p) { o.printf('(%d, %d)\n', p.x, p.y); }       // par pointeur const
    function decaler(p, dx, dy) {
      var cible = FAUSSE === 'fleche' ? { x: p.x, y: p.y } : p;
      cible.x += dx; cible.y += dy;
    }
    var p = { x: 1, y: 1 };
    afficher({ x: p.x, y: p.y });
    decaler(p, 5, 3);
    afficherPtr(p);
  },
  '08/imbriquee': function (o) {
    var sommets = [{ x: 0, y: 0 }, { x: 4, y: 0 }, { x: 2, y: 3 }];
    for (var i = 0; i < 3; i++) o.printf('sommet %d : (%d, %d)\n', i, sommets[i].x, sommets[i].y);
    var r = { bg: { x: 0, y: 0 }, hd: { x: 10, y: 5 } };
    var largeur = r.hd.x - r.bg.x;
    o.printf('largeur = %d\n', largeur);
  },
  '08/enum': function (o) {
    var MERCREDI = E0 + 2, SAMEDI = E0 + 5;    // la 1re constante vaut 0
    var HTTP_NOT_FOUND = 404;                  // valeur explicite : l'implicite ne joue pas
    var j = MERCREDI;
    if (j < SAMEDI) o.printf('Jour ouvre (valeur %d)\n', j);
    var c = HTTP_NOT_FOUND;
    o.printf('code = %d\n', c);
  },
  '08/etudiant': function (o) {
    var e = { nom: 'Noah', age: 20, moyenne: 15.5 };
    o.printf('%s, %d ans, moyenne %.2f\n', e.nom, e.age, e.moyenne);
  },
  '08/tri': function (o) {
    var t = [{ nom: 'Alice', moyenne: 12.0 }, { nom: 'Bob', moyenne: 17.5 }, { nom: 'Chloe', moyenne: 14.0 }];
    var n = 3;
    for (var i = 0; i < n - 1; i++) {
      for (var j = 0; j < n - 1 - i; j++) {
        if (t[j].moyenne < t[j + 1].moyenne) { var tmp = t[j]; t[j] = t[j + 1]; t[j + 1] = tmp; }
      }
    }
    for (i = 0; i < n; i++) o.printf('%d. %s (%.1f)\n', i + 1, t[i].nom, t[i].moyenne);
  },
  '08/feu': function (o) {
    var ROUGE = E0 + 0, VERT = E0 + 1, ORANGE = E0 + 2;
    function suivant(f) {
      switch (f) {
        case ROUGE: return VERT;
        case VERT: return ORANGE;
        case ORANGE: return ROUGE;
        default: return ROUGE;
      }
    }
    function nom(f) {
      switch (f) {
        case ROUGE: return 'ROUGE';
        case VERT: return 'VERT';
        case ORANGE: return 'ORANGE';
        default: return '?';
      }
    }
    var f = ROUGE;
    for (var i = 0; i < 5; i++) { o.printf('%s\n', nom(f)); f = suivant(f); }
  },

  /* ---- lecon-16 : un mini banc de tests ---- */
  '16/verifier': function (o) {
    var passes = 0, echoues = 0;
    function verifier(cond, texte) {
      if (cond) passes++;
      else { echoues++; o.printf('ÉCHEC ligne %d : %s\n', 0, texte); }
    }
    function additionner(a, b) { return a + b; }
    verifier(additionner(2, 3) === 5, 'additionner(2, 3) == 5');
    verifier(additionner(-1, 1) === 0, 'additionner(-1, 1) == 0');
    verifier(additionner(0, 0) === 0, 'additionner(0, 0) == 0');
    o.printf('\nBilan : %d réussis, %d échoués\n', passes, echoues);
  }
};

/* --- où chaque programme est cité dans le site ----------------------------------- */
var CIBLES = [
  { cle: '03/mentions', lecon: '03', bloc: 'Mention tres bien' },
  { cle: '03/ternaire', lecon: '03', bloc: 'int max = (a > b) ? a : b;' },
  { cle: '03/switch-jour', lecon: '03', bloc: 'Fall-through volontaire' },
  { cle: '03/trois-boucles', lecon: '03', bloc: 'for : compteur explicite' },
  { cle: '03/continue-break', lecon: '03', bloc: 'ignore les impairs' },
  { cle: '03/court-circuit', lecon: '03', bloc: 'Grace au court-circuit' },
  { cle: '03/goto', lecon: '03', bloc: 'goto liberer_a;' },
  { cle: '03/flottants', lecon: '03', bloc: 'compare a une tolerance' },
  { cle: '03/switch-char', lecon: '03', bloc: "char choix = 'b';" },
  { cle: '03/puissance', lecon: '03', bloc: 'long long resultat = 1;' },
  { cle: '07/malloc', lecon: '07', bloc: 'int *t = malloc(5 * sizeof(int));' },
  { cle: '07/calloc', lecon: '07', bloc: 'calloc(4, sizeof *compteurs)' },
  { cle: '07/realloc', lecon: '07', bloc: 'on adopte la nouvelle zone' },
  { cle: '07/taille-execution', lecon: '07', bloc: "Combien d'entiers ?", invite: "Combien d'entiers ? ", glose: /\s*\(10 \+ 20 \+ 30\)\s*$/ },
  { cle: '07/realloc-6', lecon: '07', bloc: 'adoption de la nouvelle zone' },
  { cle: '07/fuites', lecon: '07', bloc: 'on LIT avant de liberer', blocAlt: 'on LIT avant de libérer' },
  { cle: '08/point', lecon: '08', bloc: "declaration d'une variable de type struct Point" },
  { cle: '08/typedef', lecon: '08', bloc: 'Point est desormais un alias' },
  { cle: '08/fleche', lecon: '08', bloc: 'dereferencement explicite' },
  { cle: '08/passage', lecon: '08', bloc: 'void decaler(Point *p, int dx, int dy)' },
  { cle: '08/imbriquee', lecon: '08', bloc: 'Point coin_bas_gauche;' },
  { cle: '08/enum', lecon: '08', bloc: 'HTTP_NOT_FOUND  = 404,' },
  { cle: '08/etudiant', lecon: '08', bloc: 'double moyenne;\n} Etudiant;' },
  { cle: '08/tri', lecon: '08', bloc: 'tri a bulles, moyenne decroissante' },
  { cle: '08/feu', lecon: '08', bloc: 'typedef enum { ROUGE, VERT, ORANGE } Feu;' },
  { cle: '16/verifier', lecon: '16', bloc: '#define VERIFIER(condition)', videEnTete: 1 }
];

var RE = /<code class="language-c">([\s\S]*?)<\/code>/g;
var RE_TETE = /^\s*\/\/\s*Sortie\s*:(.*)$/;
var RE_COM = /^\s*\/\/\s?/;

function sortieAffirmee(lecon, motif, motifAlt) {
  var t = fs.readFileSync(RACINE + '/pages/c/lecon-' + lecon + '.html', 'utf8'), m;
  RE.lastIndex = 0;
  while ((m = RE.exec(t))) {
    var code = dec(m[1]);
    if (code.indexOf(motif) < 0 && (!motifAlt || code.indexOf(motifAlt) < 0)) continue;
    var lignes = code.split('\n');
    for (var i = 0; i < lignes.length; i++) {
      var mt = lignes[i].match(RE_TETE);
      if (!mt) continue;
      if (mt[1].trim()) return [mt[1].trim()];
      var out = [];
      for (var j = i + 1; j < lignes.length; j++) {
        if (!RE_COM.test(lignes[j])) { if (!lignes[j].trim()) continue; break; }
        out.push(lignes[j].replace(RE_COM, '').replace(/\s+$/, ''));
      }
      return out;
    }
    /* ⚠️ On ne s'arrête PAS au premier bloc qui contient le motif : une leçon montre
       souvent l'extrait court AVANT le programme complet qui porte la sortie. */
  }
  return undefined;
}

var ok = 0, ko = 0, absent = 0, lignesComparees = 0;
CIBLES.forEach(function (c) {
  var aff = sortieAffirmee(c.lecon, c.bloc, c.blocAlt);
  if (aff === undefined) { console.log('✗ ' + c.cle + ' : bloc introuvable (' + c.bloc + ')'); absent++; return; }
  if (c.glose) aff = aff.map(function (l) { return l.replace(c.glose, ''); });
  var flux = new Flux();
  PROGRAMMES[c.cle](flux);
  if (c.invite) flux.buf = flux.buf.replace(c.invite, '');
  var reel = flux.lignes();
  if (c.videEnTete) reel = reel.slice(c.videEnTete);
  var n = Math.min(aff.length, reel.length);
  var diff = [];
  for (var i = 0; i < n; i++) {
    lignesComparees++;
    if (aff[i].trim() !== reel[i].trim()) {
      diff.push('    ligne ' + (i + 1) + ' : affirmé ' + JSON.stringify(aff[i].trim()) +
        '  ≠  rejoué ' + JSON.stringify(reel[i].trim()));
    }
  }
  if (aff.length !== reel.length) diff.push('    comptes de lignes : affirmé ' + aff.length + ', rejoué ' + reel.length +
    '\n      affirmé : ' + JSON.stringify(aff) + '\n      rejoué  : ' + JSON.stringify(reel));
  if (diff.length) { console.log('✗ ' + c.cle + ' (lecon-' + c.lecon + ')'); diff.forEach(function (d) { console.log(d); }); ko++; }
  else { console.log('✓ ' + c.cle + ' (lecon-' + c.lecon + ') — ' + n + ' ligne(s) : ' + JSON.stringify(aff.slice(0, n))); ok++; }
});
console.log('\n' + ok + ' programme(s) conforme(s), ' + ko + ' divergent(s), ' + absent +
  ' non trouvé(s) — ' + lignesComparees + ' lignes de sortie comparées.' +
  (FAUSSE ? '\n(contre-épreuve « ' + FAUSSE + ' » : une règle a été faussée exprès — des divergences sont ATTENDUES)' : ''));
process.exit(ko || absent ? 1 : 0);
