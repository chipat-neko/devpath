'use strict';
/**
 * tools/preuves/rejoue-php.js — RECALCULER les sorties que les leçons PHP affirment.
 *
 * POURQUOI. La règle du chantier V14 interdit d'écrire une valeur de tête : il faut la
 * faire tourner. Aucun interpréteur PHP n'est disponible ici (`php`, `php8` : absents,
 * vérifié). Mais les 15 blocs du cours qui portent une tête stricte « // Sortie : » sont
 * déterministes — sauf un, traité plus bas — et se REJOUENT fidèlement, à condition de
 * reproduire aussi ce que PHP IMPRIME :
 *
 *   · `echo` d'un FLOTTANT de valeur entière n'écrit PAS de décimale : `100 * (1 + 0.20)`
 *     vaut 120.0 et s'affiche « 120 ». Idem pour un `int` retourné par une fonction
 *     déclarée `: float` : `diviser(10, 2)` s'affiche « 5 », pas « 5.0 ».
 *   · l'arithmétique flottante de PHP est celle d'IEEE 754, la même que celle de
 *     JavaScript : `100 * (1 + 0.20)` se replie EXACTEMENT sur 120, ce n'est pas une
 *     approximation d'affichage. Cela se rejoue donc à l'identique, sans triche.
 *   · `round($x, 2)` arrondit (12.56636 donne 12.57), il ne tronque pas.
 *   · `json_encode` n'insère AUCUNE espace, et `49.9` reste `49.9`.
 *   · l'interpolation `"{$this->nom}"` et l'opérateur `<=>` se transposent tels quels.
 *
 * CE QUE ÇA PROUVE, ET CE QUE ÇA NE PROUVE PAS. Ça prouve que la VALEUR affirmée par la
 * leçon est celle que produit le programme, formatage compris. Ça ne prouve pas que le
 * PHP s'analyse sans erreur. La transposition est écrite ci-dessous, lisible, et
 * confrontée à la sortie EXTRAITE du HTML — jamais retapée.
 *
 * ⚠️ UN BLOC EST NON DÉTERMINISTE et ne peut porter aucun exercice : `lecon-09` affiche
 * `date("Y-m-d")`, donc la date du jour. Il est ici marqué `nonDeterministe` et EXCLU de
 * la comparaison — l'exclure sans le dire reviendrait à faire semblant.
 *
 * ⚠️ UN REJEU QUI NE TROUVE RIEN DOIT PROUVER QU'IL SAIT TROUVER. D'où les contre-
 * épreuves ciblées : chacune casse UNE règle et doit faire apparaître exactement les
 * programmes qui en dépendent, ni plus ni moins.
 *
 *   node tools/preuves/rejoue-php.js                    compare, sortie 0 si tout concorde
 *   node tools/preuves/rejoue-php.js --fausse=flottant  echo d'un float entier écrit « 120.0 »
 *   node tools/preuves/rejoue-php.js --fausse=arrondi   round() tronque au lieu d'arrondir
 *   node tools/preuves/rejoue-php.js --fausse=json      json_encode aère avec des espaces
 */
var fs = require('fs');
var RACINE = require('path').resolve(__dirname, '..', '..');
var FAUSSE = (process.argv.filter(function (a) { return a.indexOf('--fausse') === 0; })[0] || '').split('=')[1] || '';
function dec(s) {
  return s.replace(/\r\n?/g, '\n')
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'").replace(/&#x27;/gi, "'").replace(/&amp;/g, '&');
}

/* --- ce que PHP IMPRIME ---------------------------------------------------------- */
/** La conversion en chaîne d'un nombre : un flottant de valeur entière perd sa décimale. */
function s(v) {
  if (typeof v !== 'number') return String(v);
  if (FAUSSE === 'flottant' && !Number.isInteger(v * 1)) return String(v);
  if (FAUSSE === 'flottant' && Number.isInteger(v)) return v.toFixed(1);
  return String(v);
}
function round2(v, p) {
  var k = Math.pow(10, p);
  if (FAUSSE === 'arrondi') return Math.trunc(v * k) / k;
  return Math.round(v * k) / k;
}
function jsonEncode(v) {
  var t = JSON.stringify(v);
  return FAUSSE === 'json' ? t.replace(/,/g, ', ').replace(/:/g, ': ') : t;
}
function Flux() { this.buf = ''; }
Flux.prototype.echo = function () { for (var i = 0; i < arguments.length; i++) this.buf += s(arguments[i]); };
Flux.prototype.lignes = function () {
  var b = this.buf;
  if (b.slice(-1) === '\n') b = b.slice(0, -1);
  return b.split('\n');
};

/* --- les programmes, transposés un à un ------------------------------------------ */
var PROGRAMMES = {

  /* ---- lecon-02 : variables, chaînes, constantes ---- */
  '02/interpolation': function (o) {
    var nom = 'Léa';
    o.echo("Bonjour, je m'appelle " + nom + '.');
  },
  '02/concatenation': function (o) {
    var prenom = 'Léa', nom = 'Martin';
    o.echo(prenom + ' ' + nom);
  },
  '02/constantes': function (o) {
    var TVA = 0.20, SITE_NOM = 'Ma Boutique';
    var prixHT = 100;
    var prixTTC = prixHT * (1 + TVA);   // IEEE 754 : se replie exactement sur 120
    o.echo(SITE_NOM + ' — total : ' + s(prixTTC));
  },
  '02/accent': function (o) {
    var ville = 'Lyon';
    o.echo("J'habite à " + ville + '.');
  },
  '02/coalescence': function (o) {
    var pseudo;                       // non défini
    var affichage = (pseudo !== undefined && pseudo !== null) ? pseudo : 'Invité';
    o.echo('Bonjour, ' + affichage + ' !');
  },
  '02/coalescence-defini': function (o) {
    var pseudo = 'Léa';
    var affichage = (pseudo !== undefined && pseudo !== null) ? pseudo : 'Invité';
    o.echo('Bonjour, ' + affichage + ' !');
  },

  /* ---- lecon-09 : POO avancée ---- */
  '09/parent': function (o) {
    function Animal(nom) { this.nom = nom; }
    Animal.prototype.decrire = function () { return 'Je suis ' + this.nom + '.'; };
    function Chien(nom) { Animal.call(this, nom); }
    Chien.prototype = Object.create(Animal.prototype);
    Chien.prototype.decrire = function () { return Animal.prototype.decrire.call(this) + ' Wouf !'; };
    o.echo(new Chien('Rex').decrire());
  },
  '09/abstraite': function (o) {
    function Cercle(r) { this.rayon = r; }
    Cercle.prototype.aire = function () { return 3.14159 * Math.pow(this.rayon, 2); };
    Cercle.prototype.decrire = function () { return 'Aire = ' + s(round2(this.aire(), 2)); };
    o.echo(new Cercle(2).decrire());
  },
  '09/interfaces': function (o) {
    var p = { nom: 'Stylo', prix: 1.5 };
    o.echo(p.nom + ';' + s(p.prix));
  },
  '09/trait': function () { /* non déterministe : date("Y-m-d") */ },
  '09/namespace': function (o) {
    var u = { nom: 'Noah' };
    o.echo(u.nom);
  },
  '09/autoload': function (o) {
    var u = { nom: 'Noah' };
    o.echo(u.nom);
  },
  '09/exceptions': function (o) {
    function diviser(a, b) {
      if (b === 0) { var e = new Error('Division par zéro interdite.'); e.type = 'InvalidArgument'; throw e; }
      return a / b;   // `: float` — mais 10/2 s'affiche « 5 »
    }
    try {
      o.echo(diviser(10, 2), '\n');
      o.echo(diviser(10, 0), '\n');
    } catch (e) {
      o.echo('Erreur : ' + e.message);
    } finally {
      o.echo('\nCalcul terminé.');
    }
  },
  '09/exception-perso': function (o) {
    function retirer(solde, montant) {
      if (montant > solde) { var e = new Error('Solde insuffisant.'); throw e; }
      return solde - montant;
    }
    try { retirer(50, 80); } catch (e) { o.echo(e.message); }
  },
  '09/capstone': function (o) {
    function Article(titre) {
      if (titre.trim() === '') throw new Error('Titre vide interdit.');
      this.titre = titre;
    }
    function publier(a) { return 'Article publié : ' + a.titre; }
    try { o.echo(publier(new Article('POO avancée'))); }
    catch (e) { o.echo('Erreur : ' + e.message); }
  },

  /* ---- lecon-12 : une petite API JSON ---- */
  '12/json': function (o) {
    var produits = [
      { id: 1, nom: 'Clavier', prix: 49.9 },
      { id: 2, nom: 'Souris', prix: 19.9 }
    ];
    o.echo(jsonEncode(produits));   // JSON_UNESCAPED_UNICODE : rien à échapper ici
  }
};

/* --- où chaque programme est cité dans le site ----------------------------------- */
var CIBLES = [
  { cle: '02/interpolation', lecon: '02', bloc: "echo \"Bonjour, je m'appelle $nom.\";" },
  { cle: '02/concatenation', lecon: '02', bloc: '$complet = $prenom . " " . $nom;' },
  { cle: '02/constantes', lecon: '02', bloc: 'define("SITE_NOM", "Ma Boutique");' },
  { cle: '02/accent', lecon: '02', bloc: '$ville = "Lyon";' },
  { cle: '02/coalescence', lecon: '02', bloc: "n'est pas défini ici" },
  { cle: '02/coalescence-defini', lecon: '02', bloc: "n'est pas défini ici", occ: 2 },
  { cle: '09/parent', lecon: '09', bloc: 'parent::decrire()' },
  { cle: '09/abstraite', lecon: '09', bloc: 'abstract class Forme' },
  { cle: '09/interfaces', lecon: '09', bloc: 'interface Exportable' },
  { cle: '09/trait', lecon: '09', bloc: 'trait Horodatable', nonDeterministe: 'date("Y-m-d") : la date du jour' },
  { cle: '09/namespace', lecon: '09', bloc: 'Sans le "use", il faudrait' },
  { cle: '09/autoload', lecon: '09', bloc: "l'autoloader généré par Composer" },
  { cle: '09/exceptions', lecon: '09', bloc: 'function diviser(int $a, int $b): float' },
  { cle: '09/exception-perso', lecon: '09', bloc: 'class SoldeInsuffisantException' },
  { cle: '09/capstone', lecon: '09', bloc: 'use App\\Services\\Publication;' },
  { cle: '12/json', lecon: '12', bloc: 'JSON_UNESCAPED_UNICODE' }
];

var RE = /<code class="language-php">([\s\S]*?)<\/code>/g;
var RE_TETE = /^\s*\/\/\s*Sortie\s*:(.*)$/;
var RE_TETE_LARGE = /^\s*\/\/\s*Sortie\b[^:]*:(.*)$/;
var RE_COM = /^\s*\/\/\s?/;

/** La n-ième annonce « // Sortie : » du premier bloc qui contient le motif.
    `large` accepte aussi « // Sortie typique : » — la tête que le site réserve aux
    sorties non déterministes, et que la tête STRICTE du générateur refuse à dessein. */
function sortieAffirmee(lecon, motif, occ, large) {
  var t = fs.readFileSync(RACINE + '/pages/php/lecon-' + lecon + '.html', 'utf8'), m;
  RE.lastIndex = 0;
  while ((m = RE.exec(t))) {
    var code = dec(m[1]);
    if (code.indexOf(motif) < 0) continue;
    var lignes = code.split('\n'), vues = 0;
    for (var i = 0; i < lignes.length; i++) {
      var mt = lignes[i].match(large ? RE_TETE_LARGE : RE_TETE);
      if (!mt) continue;
      vues++;
      if (vues < (occ || 1)) continue;
      if (mt[1].trim()) return [mt[1].trim()];
      var out = [];
      for (var j = i + 1; j < lignes.length; j++) {
        if (!RE_COM.test(lignes[j])) { if (!lignes[j].trim()) continue; break; }
        out.push(lignes[j].replace(RE_COM, '').replace(/\s+$/, ''));
      }
      return out;
    }
  }
  return undefined;
}

var ok = 0, ko = 0, absent = 0, ecartes = 0, lignesComparees = 0;
CIBLES.forEach(function (c) {
  var aff = sortieAffirmee(c.lecon, c.bloc, c.occ, !!c.nonDeterministe);
  if (aff === undefined) { console.log('✗ ' + c.cle + ' : bloc introuvable (' + c.bloc + ')'); absent++; return; }
  if (c.nonDeterministe) {
    console.log('· ' + c.cle + ' (lecon-' + c.lecon + ') — ÉCARTÉ, non déterministe : ' + c.nonDeterministe +
      ' ; la leçon affirme ' + JSON.stringify(aff));
    ecartes++; return;
  }
  var flux = new Flux();
  PROGRAMMES[c.cle](flux);
  var reel = flux.lignes();
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
  ' non trouvé(s), ' + ecartes + ' écarté(s) — ' + lignesComparees + ' lignes de sortie comparées.' +
  (FAUSSE ? '\n(contre-épreuve « ' + FAUSSE + ' » : une règle a été faussée exprès — des divergences sont ATTENDUES)' : ''));
process.exit(ko || absent ? 1 : 0);
