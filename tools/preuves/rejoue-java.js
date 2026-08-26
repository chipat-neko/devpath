'use strict';
/**
 * tools/preuves/rejoue-java.js — RECALCULER les sorties que les leçons Java affirment.
 *
 * POURQUOI. La règle du chantier V14 interdit d'écrire une valeur de tête : il faut la
 * faire tourner. Aucun JDK n'est disponible ici (`javac` et `java` : absents, vérifié).
 * Mais les programmes visés sont de l'algorithmique déterministe sur des entiers, des
 * chaînes, des tableaux et quelques flottants : leur sémantique se REJOUE fidèlement, à
 * condition de reproduire aussi ce que Java IMPRIME — c'est là que se cachent les
 * pièges (la division ENTIÈRE `17 / 4` vaut 4, `System.out.print` n'ajoute pas de saut
 * de ligne, `printf("%.2f")` arrondit, un `break` ÉTIQUETÉ sort des DEUX boucles).
 *
 * CE QUE ÇA PROUVE, ET CE QUE ÇA NE PROUVE PAS. Ça prouve que la VALEUR affirmée par la
 * leçon est celle que produit l'algorithme, formatage compris. Ça ne prouve pas que le
 * Java compile. La transposition est écrite ci-dessous, lisible, et confrontée à la
 * sortie EXTRAITE du HTML — jamais retapée.
 *
 * ⚠️ CE REJEU A TROUVÉ DEUX SORTIES FAUSSES DANS LE SITE, sur des blocs verts pour les
 * quatre vérificateurs :
 *   · `lecon-03` (boucles étiquetées) annonçait « 0,0 / 0,1 / 1,0 » — c'est la sortie
 *     d'un `break` SIMPLE. Avec le `break externe` qu'écrit la leçon, la sortie est
 *     « 0,0 / 0,1 » : l'exemple CONTREDISAIT le commentaire « sort des DEUX boucles ».
 *   · `lecon-04` (tableau à deux dimensions) annonçait « 1 2 3 / 4 5 6 » alors que le
 *     programme affiche CINQ lignes : trois `println` (6, 2, 3) précèdent la boucle.
 *
 * ⚠️ UN REJEU QUI NE TROUVE RIEN DOIT PROUVER QU'IL SAIT TROUVER. D'où les contre-
 * épreuves ciblées : chacune casse UNE règle et doit faire apparaître exactement les
 * programmes qui en dépendent, ni plus ni moins.
 *
 *   node tools/preuves/rejoue-java.js                  compare, sortie 0 si tout concorde
 *   node tools/preuves/rejoue-java.js --fausse=divent  la division de deux int rend un réel
 *   node tools/preuves/rejoue-java.js --fausse=arrondi %.2f tronque au lieu d'arrondir
 *   node tools/preuves/rejoue-java.js --fausse=label   `break label` ne sort que d'une boucle
 */
var fs = require('fs');
var RACINE = require('path').resolve(__dirname, '..', '..');
var FAUSSE = (process.argv.filter(function (a) { return a.indexOf('--fausse') === 0; })[0] || '').split('=')[1] || '';
function dec(s) {
  return s.replace(/\r\n?/g, '\n')
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'").replace(/&#x27;/gi, "'").replace(/&amp;/g, '&');
}

/* --- ce que Java IMPRIME ---------------------------------------------------------
   `idiv` : la division de deux int est ENTIÈRE et tronque vers zéro. C'est le pivot de
   `lecon-03` (17 / 4 vaut 4, pas 4.25) — d'où la contre-épreuve « divent ».
   `f2` : `printf(Locale.US, "%.2f")` arrondit à deux décimales, point décimal forcé.
   `jbool` : un boolean s'imprime « true » / « false », en toutes lettres. */
function idiv(a, b) { return FAUSSE === 'divent' ? a / b : Math.trunc(a / b); }
function f2(v) {
  if (FAUSSE === 'arrondi') return String(Math.trunc(v * 100) / 100);
  return v.toFixed(2);
}
function jbool(b) { return b ? 'true' : 'false'; }

/* --- les programmes, transposés un à un ---------------------------------------- */
var PROGRAMMES = {

  /* ---- lecon-01 : premiers programmes ---- */
  '01/conventions': function () {
    var nomClient = 'Lea';
    return [nomClient];
  },
  '01/hello': function () { return ['Hello, World!']; },
  '01/carte': function () { return ['Noah', 'Java', String(2026)]; },

  /* ---- lecon-03 : conditions, switch, boucles ---- */
  '03/if-else': function () {
    var note = 14;
    if (note >= 16) return ['Très bien'];
    if (note >= 12) return ['Bien'];
    if (note >= 10) return ['Passable'];
    return ['Insuffisant'];
  },
  '03/et-logique': function () {
    var age = 20, aBillet = true, out = [];
    if (age >= 18 && aBillet) out.push('Entrée autorisée');
    return out;
  },
  '03/ternaire': function () {
    var age = 17;
    return [(age >= 18) ? 'majeur' : 'mineur'];   // la tête « Sortie : » n'annonce que celle-ci
  },
  '03/switch-classique': function () {
    var jour = 3, out = [];
    switch (jour) {
      case 1: out.push('Lundi'); break;
      case 3: out.push('Mercredi'); break;
      case 4: out.push('Jeudi'); break;
      default: out.push('Autre jour');
    }
    return out;
  },
  '03/switch-fleche': function () {
    var jour = 6, type;
    switch (jour) {
      case 1: case 2: case 3: case 4: case 5: type = 'Semaine'; break;
      case 6: case 7: type = 'Week-end'; break;
      default: type = 'Inconnu';
    }
    return [type];
  },
  /* LE PIÈGE : `note / 4` est une division d'entiers — 17 / 4 vaut 4, donc le case 4
     s'exécute, imprime, puis `yield` la mention. */
  '03/switch-yield': function () {
    var note = 17, out = [], mention;
    switch (idiv(note, 4)) {
      case 4: out.push('Excellent travail !'); mention = 'Très bien'; break;
      case 3: mention = 'Bien'; break;
      default: mention = 'À revoir';
    }
    out.push(mention);
    return out;
  },
  '03/for': function () {
    var out = [];
    for (var i = 0; i < 3; i++) out.push('Tour numéro ' + i);
    return out;
  },
  /* `do...while` teste APRÈS : n vaut 5 au premier tour, puis 4 ; à 3 la condition
     (n > 3) est fausse et la boucle s'arrête — 4 est donc la dernière ligne. */
  '03/while-dowhile': function () {
    var out = [], compteur = 0;
    while (compteur < 3) { out.push('while : ' + compteur); compteur++; }
    var n = 5;
    do { out.push('do...while : ' + n); n--; } while (n > 3);
    return out;
  },
  '03/somme-tableau': function () {
    var notes = [12, 8, 15, 18], total = 0;
    for (var i = 0; i < notes.length; i++) total += notes[i];
    return ['Total : ' + total];
  },
  '03/continue-break': function () {
    var out = [];
    for (var i = 1; i <= 6; i++) {
      if (i === 4) break;
      if (i % 2 === 0) continue;
      out.push(String(i));
    }
    return out;
  },
  /* ⚠️ LE BLOC QUI ÉTAIT FAUX. `break externe` quitte la boucle ÉTIQUETÉE, donc les
     deux boucles d'un coup : à i=0, j=2, la somme vaut 2 et tout s'arrête. La leçon
     annonçait « 1,0 » en troisième ligne — la sortie d'un `break` SIMPLE. */
  '03/label': function () {
    var out = [];
    externe:
    for (var i = 0; i < 3; i++) {
      for (var j = 0; j < 3; j++) {
        if (i + j === 2) { if (FAUSSE === 'label') break; else break externe; }
        out.push(i + ',' + j);
      }
    }
    return out;
  },
  '03/portee': function () {
    var out = [];
    for (var i = 0; i < 3; i++) out.push(String(i));
    var j = 0;
    while (j < 3) j++;
    out.push('j vaut ' + j);
    return out;
  },
  '03/switch-jours': function () {
    var jour = 5, noms = { 1: 'Lundi', 2: 'Mardi', 3: 'Mercredi', 4: 'Jeudi', 5: 'Vendredi', 6: 'Samedi', 7: 'Dimanche' };
    return [noms[jour] || 'Inconnu'];
  },
  '03/factorielle': function () {
    var n = 5, factorielle = 1;
    for (var i = 2; i <= n; i++) factorielle *= i;
    return [n + '! = ' + factorielle];
  },

  /* ---- lecon-04 : méthodes et tableaux ---- */
  /* ⚠️ LE SECOND BLOC FAUX. Trois `println` précèdent la boucle : la sortie complète
     fait CINQ lignes, la leçon n'en annonçait que deux. `print` n'ajoute pas de saut
     de ligne, donc chaque rangée finit par une espace — invisible en commentaire, et
     non transcrite dans la leçon (réserve assumée, écrite dans le compte rendu). */
  '04/grille': function () {
    var grille = [[1, 2, 3], [4, 5, 6]], out = [];
    out.push(String(grille[1][2]));
    out.push(String(grille.length));
    out.push(String(grille[0].length));
    for (var i = 0; i < grille.length; i++) {
      var l = '';
      for (var k = 0; k < grille[i].length; k++) l += grille[i][k] + ' ';
      out.push(l.replace(/\s+$/, ''));   // l'espace finale n'est pas transcrite
    }
    return out;
  },
  '04/surcharge': function () {
    var out = [];
    function afficher(texte, repetitions) {
      if (repetitions === undefined) { out.push(texte); return; }
      for (var i = 0; i < repetitions; i++) out.push(texte);
    }
    afficher('Salut');
    afficher('Java', 3);
    return out;
  },

  /* ---- lecon-06 : héritage, polymorphisme, equals ---- */
  '06/heritage': function () {
    var nom = 'Rex';
    return ['Je suis ' + nom, nom + ' fait Wouf !'];
  },
  '06/redefinition': function () { return ['Wouf', 'Miaou']; },
  /* π×2² + 3² = 12.566370614… + 9 = 21.566370614…, que %.2f arrondit à 21.57. */
  '06/aire-totale': function () {
    var total = Math.PI * 2 * 2 + 3 * 3;
    return ['Aire totale : ' + f2(total)];
  },
  '06/equals': function () {
    var a = { x: 1, y: 2 }, b = { x: 1, y: 2 };
    return ['Point(' + a.x + ', ' + a.y + ')',
            jbool(a.x === b.x && a.y === b.y),
            jbool(a === b)];
  },
  /* π×1² = 3.14159…, arrondi à 3.14. */
  '06/abstraite': function () {
    return ['rouge, aire = ' + f2(Math.PI * 1 * 1)];
  },
  '06/instanceof': function () { return ['Wouf', 'Animal inconnu']; },
  '06/tableau-polymorphe': function () { return ['Wouf', 'Miaou']; },
  '06/livre': function () {
    var a = { titre: 'Java 1re ed.', isbn: '978-1' }, b = { titre: 'Java 2e ed.', isbn: '978-1' };
    return ['Livre[titre=' + a.titre + ', isbn=' + a.isbn + ']', jbool(a.isbn === b.isbn)];
  },
  /* π×2² = 12.566… contre 3×3 = 9 : le cercle gagne, et %.2f rend 12.57. */
  '06/comparer': function () {
    var c = Math.PI * 2 * 2, r = 3 * 3;
    return ['Plus grande aire : ' + f2(c >= r ? c : r)];
  }
};

/* --- les blocs du site, désignés par un motif ---------------------------------- */
var CIBLES = [
  { cle: '01/conventions',      lecon: '01', bloc: 'public class CompteBancaire {' },
  { cle: '01/hello',            lecon: '01', bloc: 'System.out.println("Hello, World!");' },
  { cle: '01/carte',            lecon: '01', bloc: '// Mon prenom' },
  { cle: '03/if-else',          lecon: '03', bloc: 'int note = 14;' },
  { cle: '03/et-logique',       lecon: '03', bloc: 'boolean aBillet = true;' },
  { cle: '03/ternaire',         lecon: '03', bloc: 'String statut = (age >= 18)' },
  { cle: '03/switch-classique', lecon: '03', bloc: 'int jour = 3;' },
  { cle: '03/switch-fleche',    lecon: '03', bloc: 'int jour = 6;' },
  { cle: '03/switch-yield',     lecon: '03', bloc: 'switch (note / 4)' },
  { cle: '03/for',              lecon: '03', bloc: '"Tour numéro "' },
  { cle: '03/while-dowhile',    lecon: '03', bloc: 'int compteur = 0;' },
  { cle: '03/somme-tableau',    lecon: '03', bloc: 'int[] notes = {12, 8, 15, 18};' },
  { cle: '03/continue-break',   lecon: '03', bloc: 'for (int i = 1; i <= 6; i++)' },
  { cle: '03/label',            lecon: '03', bloc: 'break externe;' },
  { cle: '03/portee',           lecon: '03', bloc: 'déclaré AVANT la boucle' },
  { cle: '03/switch-jours',     lecon: '03', bloc: 'case 7 -> "Dimanche";' },
  { cle: '03/factorielle',      lecon: '03', bloc: 'long factorielle = 1;' },
  { cle: '04/grille',           lecon: '04', bloc: 'int[][] grille = {' },
  { cle: '04/surcharge',        lecon: '04', bloc: 'static void afficher(String texte, int repetitions)' },
  { cle: '06/heritage',         lecon: '06', bloc: 'protected String nom;' },
  { cle: '06/redefinition',     lecon: '06', bloc: '// meme signature -> redefinition' },
  { cle: '06/aire-totale',      lecon: '06', bloc: 'List<Forme> formes = List.of(' },
  { cle: '06/equals',           lecon: '06', bloc: 'return "Point(" + x + ", " + y + ")";' },
  { cle: '06/abstraite',        lecon: '06', bloc: 'new Cercle("rouge", 1)' },
  { cle: '06/instanceof',       lecon: '06', bloc: 'if (a instanceof Chien c)' },
  { cle: '06/tableau-polymorphe', lecon: '06', bloc: 'Animal[] animaux = {' },
  { cle: '06/livre',            lecon: '06', bloc: 'class Livre' },
  { cle: '06/comparer',         lecon: '06', bloc: 'Forme comparer(Forme autre)' }
];

var RE = /<code class="language-([\w+#-]+)">([\s\S]*?)<\/code>/g;
var RE_TETE = /^\s*\/\/\s*Sortie\s*:(.*)$/;
var RE_COM = /^\s*\/\/\s?/;

function sortieAffirmee(lecon, motif) {
  var t = fs.readFileSync(RACINE + '/pages/java/lecon-' + lecon + '.html', 'utf8'), m;
  RE.lastIndex = 0;
  while ((m = RE.exec(t))) {
    if (m[1] !== 'java') continue;
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
       souvent l'extrait court AVANT le programme complet qui porte la sortie. */
  }
  return undefined;
}

var ok = 0, ko = 0, absent = 0, lignesComparees = 0;
CIBLES.forEach(function (c) {
  var aff = sortieAffirmee(c.lecon, c.bloc);
  if (aff === undefined) { console.log('✗ ' + c.cle + ' : bloc introuvable (' + c.bloc + ')'); absent++; return; }
  var reel = PROGRAMMES[c.cle]();
  var n = Math.min(aff.length, reel.length);
  var diff = [];
  for (var i = 0; i < n; i++) {
    lignesComparees++;
    if (aff[i].trim() !== reel[i].trim()) {
      diff.push('    ligne ' + (i + 1) + ' : affirmé ' + JSON.stringify(aff[i].trim()) +
        '  ≠  rejoué ' + JSON.stringify(reel[i].trim()));
    }
  }
  if (aff.length !== reel.length) diff.push('    comptes de lignes : affirmé ' + aff.length + ', rejoué ' + reel.length);
  if (diff.length) { console.log('✗ ' + c.cle + ' (lecon-' + c.lecon + ')'); diff.forEach(function (d) { console.log(d); }); ko++; }
  else { console.log('✓ ' + c.cle + ' (lecon-' + c.lecon + ') — ' + n + ' ligne(s) : ' + JSON.stringify(aff.slice(0, n))); ok++; }
});
console.log('\n' + ok + ' programme(s) conforme(s), ' + ko + ' divergent(s), ' + absent +
  ' non trouvé(s) — ' + lignesComparees + ' lignes de sortie comparées.' +
  (FAUSSE ? '\n(contre-épreuve « ' + FAUSSE + ' » : une règle a été faussée exprès — des divergences sont ATTENDUES)' : ''));
process.exit(ko || absent ? 1 : 0);
