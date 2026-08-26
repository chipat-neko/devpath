'use strict';
/**
 * tools/preuves/rejoue-rust.js — RECALCULER les sorties que les leçons Rust affirment.
 *
 * POURQUOI. La règle du chantier V14 interdit d'écrire une valeur de tête : il faut la
 * faire tourner. Aucun compilateur Rust n'est disponible ici (`rustc` et `cargo` :
 * absents, vérifié). Mais les programmes visés sont de l'algorithmique déterministe sur
 * des entiers, des chaînes, des vecteurs et un flottant : leur sémantique se REJOUE
 * fidèlement, à condition de reproduire aussi ce que font `Display` et `Debug` — c'est
 * là que se cachent les pièges (un f64 4.0 s'affiche « 4 » avec `{}`, un Vec s'affiche
 * « [1, 2, 3] » avec `{:?}`, `str::len()` compte des OCTETS, `Option` s'affiche
 * « Some(10) » / « None »).
 *
 * CE QUE ÇA PROUVE, ET CE QUE ÇA NE PROUVE PAS. Ça prouve que la VALEUR affirmée par la
 * leçon est celle que produit l'algorithme, formatage compris. Ça ne prouve pas que le
 * Rust compile, ni que le borrow checker l'accepte : ce n'est pas un compilateur. La
 * transposition est écrite ci-dessous, lisible, et confrontée à la sortie EXTRAITE du
 * HTML — jamais retapée.
 *
 * ⚠️ LE PARALLÉLISME NE SE REJOUE PAS, ET C'EST UN CRITÈRE DE CHOIX. Deux des programmes
 * lancent des threads (`thread::spawn`, `Arc<Mutex>`, `mpsc`). Ils ne sont retenus que
 * parce que leur RÉSULTAT est indépendant de l'ordonnancement : un `join()` avant
 * l'affichage, ou une somme commutative. Un programme dont la SORTIE dépendrait de
 * l'ordre des threads (des `println!` concurrents) n'aurait rien à faire ici.
 *
 * ⚠️ UN REJEU QUI NE TROUVE RIEN DOIT PROUVER QU'IL SAIT TROUVER. D'où les deux
 * contre-épreuves ciblées : chacune casse UNE règle d'affichage et doit faire
 * apparaître exactement les programmes qui en dépendent, ni plus ni moins. Sans elles,
 * « 0 divergence » ne serait qu'un vert par vacuité de plus.
 *
 *   node tools/preuves/rejoue-rust.js                compare, sortie 0 si tout concorde
 *   node tools/preuves/rejoue-rust.js --fausse=float  le Display d'un f64 écrit « 4.0 »
 *   node tools/preuves/rejoue-rust.js --fausse=debug  le Debug d'une séquence perd
 *                                                     l'espace après la virgule
 */
var fs = require('fs');
var RACINE = require('path').resolve(__dirname, '..', '..');
var FAUSSE = (process.argv.filter(function (a) { return a.indexOf('--fausse') === 0; })[0] || '').split('=')[1] || '';
function dec(s) {
  return s.replace(/\r\n?/g, '\n')
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'").replace(/&#x27;/gi, "'").replace(/&amp;/g, '&');
}

/* --- `Display` (`{}`) et `Debug` (`{:?}`) de Rust, pour les types en jeu ------------
   Display d'un flottant : Rust écrit la représentation décimale la plus courte qui
   revient à la même valeur, SANS zéro final — 4.0_f64 s'affiche « 4 ». (C'est `{:?}`
   qui écrirait « 4.0 ».) Debug d'une tranche ou d'un Vec : crochets, virgule + espace.
   Debug d'une Option : « Some(v) » ou « None ». */
function disp(v, flottant) {
  /* `flottant` dit que la valeur est un f64 côté Rust — en JS, 4.0 et 4 sont le même
     nombre, donc l'information ne peut venir que du programme transposé. La contre-
     épreuve « float » ne doit toucher QUE ces valeurs-là. */
  if (typeof v === 'number') {
    if (flottant && FAUSSE === 'float') return v.toFixed(1);
    return String(v);
  }
  return String(v);
}
function dbg(v) {
  if (Array.isArray(v)) return '[' + v.map(dbg).join(FAUSSE === 'debug' ? ',' : ', ') + ']';
  if (v && v.__option) return v.val === null ? 'None' : 'Some(' + dbg(v.val) + ')';
  if (typeof v === 'number') return Number.isInteger(v) ? String(v) : String(v);
  if (typeof v === 'string') return '"' + v + '"';
  return String(v);
}
function Some(v) { return { __option: 1, val: v }; }
var None = { __option: 1, val: null };

/* --- les programmes, transposés un à un ---------------------------------------- */
var PROGRAMMES = {

  /* lecon-01 — les trois formes de `println!` : Display, Debug, et l'argument nommé
     directement dans les accolades. Le piège est le `{:?}` : un tableau ne s'affiche
     pas comme une liste de valeurs séparées par des espaces, mais entre crochets. */
  '01/format': function () {
    var nom = 'Noah', age = 28, scores = [10, 7, 15];
    return ['Bonjour ' + nom + ', tu as ' + disp(age) + ' ans.',
            'Scores : ' + dbg(scores),
            nom + ' a ' + disp(age) + ' ans.'];
  },

  /* lecon-02 — `let` est immuable par défaut ; seul `y` est `mut` et peut être
     réaffecté. La valeur affichée est celle d'APRÈS l'incrément. */
  '02/mut': function () {
    var x = 5;
    var y = 10;
    y = y + 1;
    return ['x vaut ' + disp(x), 'y vaut ' + disp(y)];
  },

  /* lecon-05 — `repeter` consomme son argument ; l'appelant clone pour garder `mot`.
     Le calcul à rejouer est la construction de la chaîne : l'espace n'est ajoutée
     qu'à partir du deuxième tour, donc 3 répétitions donnent 2 espaces, pas 3. */
  '05/repeter': function () {
    function repeter(mot, fois) {
      var resultat = '';
      for (var i = 0; i < fois; i++) {
        if (i > 0) resultat += ' ';
        resultat += mot;
      }
      return resultat;
    }
    var mot = 'écho';
    var phrase = repeter(mot, 3);
    return ['mot conservé : ' + mot, 'résultat      : ' + phrase];
  },

  /* lecon-07 — `split('.')` coupe AU point : le premier segment ne contient donc pas
     le point final. C'est là qu'est la prédiction. */
  '07/extrait': function () {
    var roman = 'Appelez-moi Ismaël. Il y a quelques années...';
    var premiere = roman.split('.')[0];
    return ['Extrait : ' + premiere];
  },

  /* lecon-07 — `str::len()` compte des OCTETS, et `lines().next()` s'arrête au premier
     saut de ligne. « Titre » est de l'ASCII pur : 5 octets pour 5 caractères. */
  '07/entete': function () {
    var texte = 'Titre\nCorps du document...';
    var premiere = texte.split('\n')[0];
    var octets = Buffer.byteLength(premiere, 'utf8');
    return ['« ' + premiere + ' » fait ' + disp(octets) + ' octets'];
  },

  /* lecon-12 — un canal mpsc : le thread envoie 1 à 5 puis abandonne `tx`, ce qui ferme
     le canal et termine la boucle `for recu in rx`. La somme ne dépend pas de l'ordre
     d'ordonnancement — elle est reçue dans l'ordre d'envoi, et l'addition est
     commutative de toute façon. */
  '12/mpsc': function () {
    var somme = 0;
    for (var i = 1; i <= 5; i++) somme += i;
    return ['Somme = ' + disp(somme)];
  },

  /* lecon-12 — 5 threads × 1000 incréments sous un `Mutex` partagé par un `Arc`. Le
     `join()` de tous les threads précède l'affichage, et le verrou sérialise les
     incréments : le total est déterministe. */
  '12/arc-mutex': function () {
    var compteur = 0;
    for (var t = 0; t < 5; t++) for (var k = 0; k < 1000; k++) compteur += 1;
    return ['Total = ' + disp(compteur)];
  },

  /* lecon-14 — une liste « cons » en Box, sommée récursivement : 1 + 2 + 3 + 0. */
  '14/box-liste': function () {
    var Nil = null;
    function Cons(v, suite) { return { v: v, suite: suite }; }
    function somme(l) { return l === Nil ? 0 : l.v + somme(l.suite); }
    var liste = Cons(1, Cons(2, Cons(3, Nil)));
    return ['somme = ' + disp(somme(liste))];
  },

  /* lecon-14 — `Rc<RefCell<Vec>>` : les deux vues désignent LE MÊME vecteur, donc les
     deux `push` s'accumulent au lieu de porter sur des copies. */
  '14/rc-refcell': function () {
    var partage = [1, 2, 3];
    var vue_a = partage, vue_b = partage;      // Rc::clone ne duplique pas la valeur
    vue_a.push(4);
    vue_b.push(5);
    return [dbg(partage)];
  },

  /* lecon-16 — filtrage des pairs de 1 à 10, puis somme : 2+4+6+8+10. */
  '16/pairs': function () {
    var data = [];
    for (var i = 1; i <= 10; i++) data.push(i);
    var somme = data.filter(function (n) { return n % 2 === 0; })
                    .reduce(function (a, b) { return a + b; }, 0);
    return [disp(somme)];
  },

  /* lecon-16 — `couper` découpe la tranche à l'indice `mid` : les deux moitiés font
     respectivement `mid` et `len - mid` éléments, et `{:?}` les écrit entre crochets. */
  '16/couper': function () {
    function couper(v, mid) { return [v.slice(0, mid), v.slice(mid)]; }
    var data = [1, 2, 3, 4];
    var deux = couper(data, 2);
    return [dbg(deux[0]) + ' | ' + dbg(deux[1])];
  },

  /* lecon-16 — appel FFI de `sqrt` : le résultat est un f64 valant 4.0, et le Display
     d'un flottant n'écrit pas le zéro final. C'EST le piège de l'exercice. */
  '16/ffi-sqrt': function () {
    var r = Math.sqrt(16.0);
    return ['sqrt(16.0) = ' + disp(r, true)];
  },

  /* lecon-16 — deux appels FFI à la libc. `abs(-7)` rend 7 ; `strlen` s'arrête au NUL,
     donc le littéral b"rust\0" (5 octets) rend 4 : le terminateur n'est pas compté. */
  '16/ffi-libc': function () {
    var texte = 'rust' + String.fromCharCode(0);   // b"rust" : 5 octets, NUL compris
    var n = texte.indexOf(String.fromCharCode(0)); // ce que fait strlen : compter JUSQU'AU NUL
    return ['abs(-7) = ' + disp(Math.abs(-7)), 'strlen = ' + disp(n)];
  },

  /* lecon-16 — `{:?}` sur une Option : « Some(10) » puis « None » pour la tranche vide,
     car la fonction teste `is_empty()` avant tout accès. */
  '16/option-debug': function () {
    function premier(v) { return v.length === 0 ? None : Some(v[0]); }
    return [dbg(premier([10, 20, 30])), dbg(premier([]))];
  }
};

/* --- les cibles : quel bloc de quelle leçon porte la sortie affirmée ------------- */
var CIBLES = [
  { cle: '01/format',      lecon: '01', bloc: 'println!("Scores : {:?}", scores)' },
  { cle: '02/mut',         lecon: '02', bloc: 'let mut y = 10;' },
  { cle: '05/repeter',     lecon: '05', bloc: 'fn repeter(mot: String, fois: usize)' },
  { cle: '07/extrait',     lecon: '07', bloc: 'struct Extrait<\'a>' },
  { cle: '07/entete',      lecon: '07', bloc: 'struct Entete<\'a>' },
  { cle: '12/mpsc',        lecon: '12', bloc: 'tx.send(i).unwrap()' },
  { cle: '12/arc-mutex',   lecon: '12', bloc: 'for _ in 0..1000' },
  { cle: '14/box-liste',   lecon: '14', bloc: 'fn somme(liste: &List)' },
  { cle: '14/rc-refcell',  lecon: '14', bloc: 'vue_b.borrow_mut().push(5)' },
  { cle: '16/pairs',       lecon: '16', bloc: 'fn somme_pairs(v: &[u64])' },
  { cle: '16/couper',      lecon: '16', bloc: 'fn couper(v: &mut [i32], mid: usize)' },
  { cle: '16/ffi-libc',    lecon: '16', bloc: 'fn strlen(s: *const c_char) -> usize;' },
  { cle: '16/ffi-sqrt',    lecon: '16', bloc: 'fn sqrt(x: f64) -> f64;' },
  { cle: '16/option-debug', lecon: '16', bloc: 'v.get_unchecked(0)' }
];

var RE = /<code class="language-([\w+#-]+)">([\s\S]*?)<\/code>/g;
var RE_TETE = /^\s*\/\/\s*Sortie\s*:(.*)$/;
var RE_COM = /^\s*\/\/\s?/;

function sortieAffirmee(lecon, motif) {
  var t = fs.readFileSync(RACINE + '/pages/rust/lecon-' + lecon + '.html', 'utf8'), m;
  RE.lastIndex = 0;
  while ((m = RE.exec(t))) {
    if (m[1] !== 'rust') continue;
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
  /* On ne compare QUE les lignes que le rejeu produit : une leçon peut gloser sa
     dernière ligne (« libération de A   (ordre inverse) ») — ce n'est plus de la sortie. */
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
  (FAUSSE ? '\n(contre-épreuve « ' + FAUSSE + ' » : une règle d\'affichage a été faussée exprès — des divergences sont ATTENDUES)' : ''));
process.exit(ko || absent ? 1 : 0);
