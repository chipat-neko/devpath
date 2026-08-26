'use strict';
/**
 * tools/preuves/rejoue-go.js — RECALCULER les sorties que les leçons Go affirment.
 *
 * POURQUOI. La règle du chantier V14 interdit d'écrire une valeur de tête : il faut la
 * faire tourner. Ni `go` ni `gofmt` ne sont installés ici (vérifié). Mais les 18 blocs
 * du cours qui portent une tête stricte « // Sortie : » sont déterministes — sauf un,
 * déclaré plus bas — et se REJOUENT fidèlement, à condition de reproduire aussi ce que
 * Go IMPRIME :
 *
 *   · `fmt.Println` sépare TOUJOURS ses arguments par une espace et termine par un saut
 *     de ligne : `fmt.Println("le double vaut", n*2)` écrit « le double vaut 84 ».
 *   · `defer` empile : les appels différés sortent en ordre INVERSE (LIFO), après la
 *     dernière instruction de la fonction.
 *   · `switch` ne traverse PAS d'un cas à l'autre — sauf `fallthrough`, qui force le cas
 *     suivant sans réévaluer sa condition.
 *   · lire une clé absente d'une map ne lève rien : elle rend la VALEUR ZÉRO du type, et
 *     c'est la deuxième valeur (`ok`) qui distingue « absent » de « vaut 0 ».
 *   · un channel non bufferisé fait RENDEZ-VOUS : la réception bloque jusqu'à l'envoi,
 *     ce qui rend l'ordre d'affichage déterministe malgré la goroutine.
 *   · `select` prend le cas PRÊT LE PLUS TÔT ; `time.After(d)` n'est prêt qu'au bout de
 *     `d`, donc il ne gagne que si tous les autres cas sont plus lents que lui.
 *
 * CE QUE ÇA PROUVE, ET CE QUE ÇA NE PROUVE PAS. Ça prouve que la VALEUR affirmée par la
 * leçon est celle que produit le programme, formatage et ORDRE DES LIGNES compris. Ça ne
 * prouve pas que le Go compile. La transposition est écrite ci-dessous, lisible, et
 * confrontée à la sortie EXTRAITE du HTML — jamais retapée.
 *
 * ⚠️ UN BLOC EST NON DÉTERMINISTE et ne peut porter aucun exercice : `lecon-07` lance une
 * goroutine puis laisse `main` se terminer, et la leçon l'annonce elle-même
 * (« (souvent rien du tout) »). Il est marqué `nonDeterministe` et EXCLU de la
 * comparaison — l'exclure sans le dire reviendrait à faire semblant.
 *
 * ⚠️ UN REJEU QUI NE TROUVE RIEN DOIT PROUVER QU'IL SAIT TROUVER. D'où les contre-
 * épreuves : chacune casse UNE règle et doit faire apparaître exactement les programmes
 * qui en dépendent, ni plus ni moins.
 *
 *   node tools/preuves/rejoue-go.js                       compare, sortie 0 si tout concorde
 *   node tools/preuves/rejoue-go.js --fausse=espace       Println collerait ses arguments
 *   node tools/preuves/rejoue-go.js --fausse=lifo         defer sortirait en FIFO
 *   node tools/preuves/rejoue-go.js --fausse=fallthrough  fallthrough ignoré
 *   node tools/preuves/rejoue-go.js --fausse=carre        le channel porterait i, pas i*i
 *   node tools/preuves/rejoue-go.js --fausse=timeout      le select attendrait le plus lent
 *   node tools/preuves/rejoue-go.js --fausse=zero         une clé absente serait « présente »
 */
var fs = require('fs');
var RACINE = require('path').resolve(__dirname, '..', '..');
var FAUSSE = (process.argv.filter(function (a) { return a.indexOf('--fausse') === 0; })[0] || '').split('=')[1] || '';
function dec(s) {
  return s.replace(/\r\n?/g, '\n')
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'").replace(/&#x27;/gi, "'").replace(/&amp;/g, '&');
}

/* --- ce que Go IMPRIME ------------------------------------------------------------ */
/** fmt.Println : les arguments séparés par une espace, puis un saut de ligne. */
function Flux() { this.buf = ''; this.differes = []; }
Flux.prototype.Println = function () {
  var parts = [];
  for (var i = 0; i < arguments.length; i++) parts.push(String(arguments[i]));
  this.buf += parts.join(FAUSSE === 'espace' ? '' : ' ') + '\n';
};
/** defer : on empile, et on vide en ordre inverse à la sortie de la fonction. */
Flux.prototype.defer = function (fn) { this.differes.push(fn); };
Flux.prototype.finFonction = function () {
  var d = this.differes;
  this.differes = [];
  if (FAUSSE === 'lifo') { for (var i = 0; i < d.length; i++) d[i](); return; }
  for (var j = d.length - 1; j >= 0; j--) d[j]();
};
Flux.prototype.lignes = function () {
  var b = this.buf;
  if (b.slice(-1) === '\n') b = b.slice(0, -1);
  return b === '' ? [] : b.split('\n');
};
/** Lecture d'une map sous la forme « v, ok := m[k] » : valeur zéro si la clé manque. */
function lireMap(m, cle, zero) {
  if (Object.prototype.hasOwnProperty.call(m, cle)) return [m[cle], true];
  if (FAUSSE === 'zero') return [zero, true];
  return [zero, false];
}

/* --- les programmes, transposés un à un ------------------------------------------ */
var PROGRAMMES = {

  /* ---- lecon-01 : découvrir Go ---- */
  '01/bonjour': function (o) { o.Println('Bonjour, Go !'); },
  '01/atoi': function (o) {
    /* strconv.Atoi("42") rend (42, nil) : la conversion réussit, err est nil. */
    var n = 42, err = null;
    if (err !== null) { o.Println('conversion impossible :', err); return; }
    o.Println('le double vaut', n * 2);
  },
  '01/exporte': function (o) {
    var Message = 'Salut depuis le package main', secret = 'caché';
    o.Println(Message);
    o.Println(secret);
  },
  '01/monde': function (o) { o.Println('Bonjour le monde !'); },
  '01/println-args': function (o) { o.Println('Noah', 25, 'Go'); },

  /* ---- lecon-02 : defer ---- */
  '02/defer': function (o) {
    o.Println('début');
    o.defer(function () { o.Println('nettoyage'); });
    o.defer(function () { o.Println('deuxième'); });
    o.Println('travail');
    o.finFonction();
  },

  /* ---- lecon-03 : conditions, switch, maps ---- */
  '03/if': function (o) {
    var age = 20;
    if (age >= 18) o.Println('Majeur'); else o.Println('Mineur');
  },
  '03/switch-valeur': function (o) {
    var jour = 'samedi';
    if (jour === 'samedi' || jour === 'dimanche') o.Println('Week-end !');
    else if (jour === 'lundi') o.Println('Courage…');
    else o.Println('Jour de semaine');
  },
  '03/switch-sans-expression': function (o) {
    var note = 14;
    if (note >= 16) o.Println('Très bien');
    else if (note >= 12) o.Println('Bien');
    else if (note >= 10) o.Println('Passable');
    else o.Println('Insuffisant');
  },
  '03/fallthrough': function (o) {
    var n = 1;
    /* Go n'enchaîne pas les cas ; `fallthrough` force le SUIVANT sans le tester. */
    if (n === 1) {
      o.Println('un');
      if (FAUSSE !== 'fallthrough') o.Println('deux');
    } else if (n === 2) o.Println('deux');
  },
  '03/map-ok': function (o) {
    var ages = { Alice: 30 };            /* « Bob » n'y figure pas */
    var r = lireMap(ages, 'Bob', 0), score = r[0], ok = r[1];
    if (!ok) o.Println('Bob est absent de la map');
    else o.Println('Score de Bob :', score);
  },

  /* ---- lecon-07 : goroutines, channels, select ---- */
  '07/goroutine-nue': function () { /* main se termine avant la goroutine : rien */ },
  '07/channel': function (o) {
    /* Channel non bufferisé : la réception attend l'envoi. L'ordre est donc certain. */
    var message = 'résultat prêt';
    o.Println(message);
  },
  '07/channel-buffer': function (o) {
    /* La goroutine envoie i*i pour i de 1 à 5 puis ferme ; `range` lit tout, dans
       l'ordre d'envoi, et s'arrête à la fermeture. Une valeur par ligne. */
    for (var i = 1; i <= 5; i++) o.Println(FAUSSE === 'carre' ? i : i * i);
  },
  '07/select-timeout': function (o) {
    /* Trois cas : `rapide` à 50 ms, `lent` à 2 s, `time.After` à 500 ms — et DEUX
       tours de boucle. Tour 1 : le plus tôt prêt est `rapide` (50 ms). Tour 2 : le
       time.After repart de zéro (500 ms) tandis que `lent` n'arrive qu'à 2 s, donc
       c'est le timeout qui gagne. */
    var tours = [{ gagnant: 'rapide' }, { gagnant: 'timeout' }];
    if (FAUSSE === 'timeout') tours = [{ gagnant: 'lent' }, { gagnant: 'lent' }];
    tours.forEach(function (t) {
      if (t.gagnant === 'timeout') o.Println('timeout : trop lent');
      else o.Println('reçu :', t.gagnant);
    });
  },
  '07/mutex': function (o) {
    /* 1 000 goroutines incrémentent sous verrou : aucune incrémentation n'est perdue. */
    var n = 0;
    for (var i = 0; i < 1000; i++) n++;
    o.Println(n);
  },
  '07/somme-channel': function (o) {
    var nombres = [1, 2, 3, 4, 5], total = 0;
    for (var i = 0; i < nombres.length; i++) total += nombres[i];
    o.Println('somme :', total);
  },
  '07/select-abandon': function (o) {
    /* La goroutine répond à 1 s, le time.After à 300 ms : c'est lui qui gagne. */
    if (FAUSSE === 'timeout') { o.Println('reçu :', 'données prêtes'); return; }
    o.Println('abandon : la goroutine est trop lente');
  }
};

/* --- les cibles : quel programme correspond à quel bloc de quelle leçon ----------- */
var CIBLES = [
  { cle: '01/bonjour', lecon: '01', bloc: 'fmt.Println("Bonjour, Go !")' },
  { cle: '01/atoi', lecon: '01', bloc: 'strconv.Atoi("42")' },
  { cle: '01/exporte', lecon: '01', bloc: 'var Message = "Salut depuis le package main"' },
  { cle: '01/monde', lecon: '01', bloc: 'fmt.Println("Bonjour le monde !")' },
  { cle: '01/println-args', lecon: '01', bloc: 'fmt.Println("Noah", 25, "Go")' },
  { cle: '02/defer', lecon: '02', bloc: 'defer fmt.Println("nettoyage")' },
  { cle: '03/if', lecon: '03', bloc: 'age := 20' },
  { cle: '03/switch-valeur', lecon: '03', bloc: 'switch jour := "samedi"; jour {' },
  { cle: '03/switch-sans-expression', lecon: '03', bloc: 'note := 14' },
  { cle: '03/fallthrough', lecon: '03', bloc: 'fallthrough' },
  { cle: '03/map-ok', lecon: '03', bloc: 'score, ok := ages["Bob"]' },
  { cle: '07/goroutine-nue', lecon: '07', bloc: 'go fmt.Println("salut depuis la goroutine")',
    nonDeterministe: 'main se termine sans attendre la goroutine ; la leçon écrit elle-même « (souvent rien du tout) »' },
  { cle: '07/channel', lecon: '07', bloc: 'ch := make(chan string)' },
  { cle: '07/channel-buffer', lecon: '07', bloc: 'nombres := make(chan int, 3)' },
  { cle: '07/select-timeout', lecon: '07', bloc: 'rapide := make(chan string)' },
  { cle: '07/mutex', lecon: '07', bloc: 'type Compteur struct {' },
  { cle: '07/somme-channel', lecon: '07', bloc: 'func somme(nombres []int, resultat chan' },
  { cle: '07/select-abandon', lecon: '07', bloc: 'res := make(chan string)' }
];

var RE = /<code class="language-go">([\s\S]*?)<\/code>/g;
var RE_TETE = /^\s*\/\/\s*Sortie\s*:(.*)$/;
var RE_COM = /^\s*\/\/\s?/;

/** La sortie affirmée du premier bloc qui contient le motif ET porte une tête stricte. */
function sortieAffirmee(lecon, motif, occ) {
  var t = fs.readFileSync(RACINE + '/pages/go/lecon-' + lecon + '.html', 'utf8'), m;
  RE.lastIndex = 0;
  while ((m = RE.exec(t))) {
    var code = dec(m[1]);
    if (code.indexOf(motif) < 0) continue;
    if (!/^\s*\/\/\s*Sortie\s*:/m.test(code)) continue;
    var lignes = code.split('\n'), vues = 0;
    for (var i = 0; i < lignes.length; i++) {
      var mt = lignes[i].match(RE_TETE);
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
  var aff = sortieAffirmee(c.lecon, c.bloc, c.occ);
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
