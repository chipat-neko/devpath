'use strict';
/**
 * tools/preuves/rejoue-cpp.js — RECALCULER les sorties que les leçons C++ affirment.
 *
 * POURQUOI. La règle du chantier interdit d'écrire une valeur de tête : il faut la faire
 * tourner. Aucun compilateur C++ n'est disponible ici (g++, clang, cl : absents ; dotnet
 * n'a que le runtime). Mais les programmes visés sont de l'algorithmique déterministe sur
 * des entiers, des chaînes et des doubles : leur sémantique se REJOUE fidèlement, à
 * condition de reproduire aussi ce que fait `std::cout` — c'est là que se cachent les
 * pièges (un bool s'affiche 1, un double 7.0 s'affiche 7, un size_t compte des octets).
 *
 * CE QUE ÇA PROUVE, ET CE QUE ÇA NE PROUVE PAS. Ça prouve que la VALEUR affirmée par la
 * leçon est celle que produit l'algorithme, opérateur d'affichage compris. Ça ne prouve
 * pas que le C++ compile : ce n'est pas un compilateur. La transposition est écrite
 * ci-dessous, lisible, et confrontée à la sortie EXTRAITE du HTML — jamais retapée.
 */
var fs = require('fs');
var RACINE = require('path').resolve(__dirname, '..', '..');
function dec(s){return s.replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&#0?39;/g,"'").replace(/&#x27;/gi,"'").replace(/&amp;/g,'&');}

/* --- l'opérateur << de std::ostream, pour les types en jeu ---------------------
   Règles reproduites : un bool sort en 0/1 (pas de boolalpha) ; un double sort en
   « defaultfloat » avec precision(6), c'est-à-dire 6 CHIFFRES SIGNIFICATIFS, sans
   zéro final ni point si la partie décimale disparaît (7.0 -> « 7 », -2.0 -> « -2 »,
   41/3 -> « 13.6667 »). */
function cout(v) {
  if (typeof v === 'boolean') return v ? '1' : '0';
  if (typeof v === 'number') {
    if (Number.isInteger(v) && Math.abs(v) < 1e15) return String(v);
    var s = v.toPrecision(6);
    if (s.indexOf('e') < 0 && s.indexOf('.') >= 0) s = s.replace(/0+$/, '').replace(/\.$/, '');
    return s;
  }
  return String(v);
}

/* --- les programmes, transposés un à un ---------------------------------------- */
var PROGRAMMES = {

  /* lecon-01, bloc « surcharge » : une référence modifie n, puis deux surcharges de
     doubler — l'entière rend 6, la flottante rend 7.0 que cout affiche « 7 ». */
  '01/surcharge': function () {
    var n = 5; n = 7;                       // int& alias = n; alias = 7;
    var doublerInt = function (x) { return x * 2; };        // int -> int
    var doublerDouble = function (x) { return x * 2.0; };   // double -> double
    return ['n = ' + cout(n), cout(doublerInt(3)) + ' et ' + cout(doublerDouble(3.5))];
  },

  /* lecon-01, bloc « auto » : actif est un bool, donc affiché 1. */
  '01/auto': function () {
    var compteur = 42, prix = 19.99, message = 'Salut', actif = true;
    return [message + ' : ' + cout(compteur) + ' à ' + cout(prix) + '€, actif=' + cout(actif)];
  },

  /* lecon-02, bloc « const& » : std::string::size() compte des OCTETS. La chaîne est
     de l'ASCII pur, donc octets == caractères ; on compte les octets pour être fidèle. */
  '02/taille': function () {
    var texte = 'Bonjour le C++';
    var octets = Buffer.byteLength(texte, 'utf8');
    return ['[' + texte + '] (' + cout(octets) + ' caracteres)'];
  },

  /* lecon-02, bloc « map » : std::map est TRIÉE par clé — l'ordre d'insertion
     ({Noah, Lina}) n'est pas l'ordre d'affichage. */
  '02/map': function () {
    var ages = [['Noah', 17], ['Lina', 22]];
    ages.sort(function (a, b) { return a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0; });
    return ages.map(function (p) { return p[0] + ' a ' + cout(p[1]) + ' ans'; });
  },

  /* lecon-05, bloc « règle de trois » : le constructeur de copie duplique le tableau,
     donc modifier b ne touche pas a. */
  '05/copie': function () {
    function Buf(n) { this.data = new Array(n).fill(0); }
    Buf.prototype.copie = function () { var b = new Buf(this.data.length); b.data = this.data.slice(); return b; };
    var a = new Buf(2); a.data[0] = 7;
    var b = a.copie();  b.data[0] = 99;
    return ['a[0]=' + cout(a.data[0]) + '  b[0]=' + cout(b.data[0])];
  },

  /* lecon-07, bloc « operator+ / operator* / == par défaut » : (1,2)+(3,4) et (1,2)*3,
     affichés par l'operator<< maison sous la forme « (x, y) ». */
  '07/ops': function () {
    var pt = function (x, y) { return { x: x, y: y }; };
    var aff = function (v) { return '(' + cout(v.x) + ', ' + cout(v.y) + ')'; };
    var a = pt(1.0, 2.0), b = pt(3.0, 4.0);
    var plus = pt(a.x + b.x, a.y + b.y), fois = pt(a.x * 3.0, a.y * 3.0);
    var eq = function (u, v) { return u.x === v.x && u.y === v.y; };   // == par défaut
    return ['a + b   = ' + aff(plus), 'a * 3   = ' + aff(fois),
            'a == b  = ' + (eq(a, b) ? 'true' : 'false'),               // std::boolalpha
            'a == a  = ' + (eq(a, a) ? 'true' : 'false')];
  },

  /* lecon-08, bloc « copie coûteuse » : 1'000'000 est UN littéral (le ' sépare les
     chiffres depuis C++14) ; la copie a la même taille que l'original. */
  '08/copie': function () {
    var a = new Array(1000000).fill(42);
    var b = a.slice();
    return [cout(a.length) + ' ' + cout(b.length)];
  },

  /* lecon-11, bloc « lambdas » : tri DÉCROISSANT, puis count_if des pairs et find_if
     du premier > 4 — sur le vecteur DÉJÀ TRIÉ, ce qui change la réponse. */
  '11/lambdas': function () {
    var v = [5, 2, 8, 1, 9];
    v.sort(function (a, b) { return a > b ? -1 : a < b ? 1 : 0; });
    var pairs = v.filter(function (x) { return x % 2 === 0; }).length;
    var prem = v.filter(function (x) { return x > 4; })[0];
    return ['elements pairs : ' + cout(pairs), 'premier > 4 : ' + cout(prem)];
  },

  /* lecon-13, bloc « optional » : stoi("abc") lève, on rend nullopt, et value_or(-1)
     donne -1 — tandis que *a déréférence l'optional plein. */
  '13/optional': function () {
    var versEntier = function (s) { return /^-?\d+$/.test(s) ? parseInt(s, 10) : null; };
    var a = versEntier('42'), b = versEntier('abc');
    var out = [];
    if (a !== null) out.push('a = ' + cout(a));
    out.push('b = ' + cout(b === null ? -1 : b));
    return out;
  },

  /* lecon-16, bloc « fold expressions » : somme(1.5, 2.5) vaut 4.0 que cout affiche
     « 4 », et le fold sur << affiche true comme 1. */
  '16/fold': function () {
    var somme = function () { return Array.prototype.slice.call(arguments).reduce(function (a, b) { return a + b; }); };
    return [cout(somme(1, 2, 3, 4)), cout(somme(1.5, 2.5)),
            'x = ' + cout(42) + ', ok=' + cout(true)];
  },

  /* lecon-17, bloc « ranges » : filter puis transform sur 1..8. */
  '17/ranges': function () {
    var v = [1, 2, 3, 4, 5, 6, 7, 8];
    return [v.filter(function (n) { return n % 2 === 0; })
             .map(function (n) { return n * n; }).map(cout).join(' ')];
  },

  /* lecon-17, bloc « generator » : compteur(4) rend 0,1,2,3 — il part de 0. */
  '17/generator': function () {
    var out = [];
    for (var i = 0; i < 4; i++) out.push(cout(i));
    return [out.join(' ')];
  }
};

/* --- où trouver, dans le site, la sortie affirmée de chaque programme ------------ */
var CIBLES = [
  { cle: '01/surcharge', lecon: '01', bloc: 'int& alias = n;' },
  { cle: '01/auto',      lecon: '01', bloc: 'auto prix = 19.99;' },
  { cle: '02/taille',    lecon: '02', bloc: 'void afficher(const std::string& texte)' },
  { cle: '02/map',       lecon: '02', bloc: 'std::map<std::string, int> ages' },
  { cle: '05/copie',     lecon: '05', bloc: 'Buffer& operator=(const Buffer& autre)' },
  { cle: '07/ops',       lecon: '07', bloc: 'bool operator==(const Vecteur2D&) const = default;' },
  { cle: '08/copie',     lecon: '08', bloc: "fabrique(1'000'000)" },
  { cle: '11/lambdas',   lecon: '11', bloc: 'std::count_if(v.begin(), v.end()' },
  { cle: '13/optional',  lecon: '13', bloc: 'std::optional<int> vers_entier' },
  { cle: '16/fold',      lecon: '16', bloc: '(std::cout << ... << args)' },
  { cle: '17/ranges',    lecon: '17', bloc: 'rv::filter' },
  { cle: '17/generator', lecon: '17', bloc: 'co_yield i;' }
];

var RE = /<code class="language-([\w+#-]+)">([\s\S]*?)<\/code>/g;
var RE_TETE = /^\s*\/\/\s*Sortie\s*:(.*)$/;
var RE_COM = /^\s*\/\/\s?/;

function sortieAffirmee(lecon, motif) {
  var t = fs.readFileSync(RACINE + '/pages/cpp/lecon-' + lecon + '.html', 'utf8'), m;
  RE.lastIndex = 0;
  while ((m = RE.exec(t))) {
    if (m[1] !== 'cpp') continue;
    var code = dec(m[2]);
    if (code.indexOf(motif) < 0) continue;
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
       souvent l'extrait court AVANT le programme complet. Sans ce « continue », le
       rejeu concluait « pas de tête Sortie : » alors que le bon bloc était plus bas. */
  }
  return undefined;
}

var ok = 0, ko = 0, absent = 0, lignesComparees = 0;
CIBLES.forEach(function (c) {
  var aff = sortieAffirmee(c.lecon, c.bloc);
  if (aff === undefined) { console.log('✗ ' + c.cle + ' : bloc introuvable (' + c.bloc + ')'); absent++; return; }
  if (aff === null)      { console.log('✗ ' + c.cle + ' : pas de tête « // Sortie : » stricte'); absent++; return; }
  var reel = PROGRAMMES[c.cle]();
  /* On ne compare QUE les lignes que le rejeu produit : une leçon peut gloser la
     dernière ligne (« detruit (x3, ordre inverse) ») — ce n'est plus de la sortie. */
  var n = Math.min(aff.length, reel.length);
  var diff = [];
  for (var i = 0; i < n; i++) {
    lignesComparees++;
    if (aff[i].trim() !== reel[i].trim()) diff.push('    ligne ' + (i + 1) + ' : affirmé ' + JSON.stringify(aff[i].trim()) + '  ≠  rejoué ' + JSON.stringify(reel[i].trim()));
  }
  if (aff.length !== reel.length) diff.push('    comptes de lignes : affirmé ' + aff.length + ', rejoué ' + reel.length);
  if (diff.length) { console.log('✗ ' + c.cle + ' (lecon-' + c.lecon + ')'); diff.forEach(function (d) { console.log(d); }); ko++; }
  else { console.log('✓ ' + c.cle + ' (lecon-' + c.lecon + ') — ' + n + ' ligne(s) : ' + JSON.stringify(aff.slice(0, n))); ok++; }
});
console.log('\n' + ok + ' programme(s) conforme(s), ' + ko + ' divergent(s), ' + absent + ' non trouvé(s) — ' + lignesComparees + ' lignes de sortie comparées.');
process.exit(ko || absent ? 1 : 0);
