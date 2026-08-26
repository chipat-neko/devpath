'use strict';
/**
 * tools/preuves/rejoue-csharp.js — RECALCULER les sorties que les leçons C# affirment.
 *
 * POURQUOI. La règle du chantier V14 interdit d'écrire une valeur de tête : il faut la
 * faire tourner. Et ici on ne PEUT pas : `dotnet` est installé, mais il n'a que le
 * RUNTIME, aucun SDK (`dotnet --list-sdks` : vide, `dotnet --list-runtimes` :
 * Microsoft.NETCore.App 8.0.19). Sans SDK, pas de `dotnet run`, pas de compilation :
 * C# n'est pas plus exécutable ici que le C++ ou le Rust. La transposition reste donc
 * la seule voie — et c'est celle qui a déjà trouvé deux sorties fausses côté Java.
 *
 * CE QUE ÇA PROUVE, ET CE QUE ÇA NE PROUVE PAS. Ça prouve que la VALEUR affirmée par la
 * leçon est celle que produit l'algorithme, formatage compris. Ça ne prouve pas que le
 * C# compile. La transposition est écrite ci-dessous, lisible, et confrontée à la
 * sortie EXTRAITE du HTML — jamais retapée.
 *
 * CE QU'IL FAUT REPRODUIRE, ET QUI EST LE PIÈGE : ce que C# IMPRIME. Un `decimal`
 * s'affiche sans zéro superflu (120m → « 120 »), un `double` entier aussi (12.0 → « 12 »),
 * `Console.Write` n'ajoute pas de saut de ligne (trois `Write` font UNE ligne), et une
 * propriété statique est partagée par toutes les instances (le compteur `Total`).
 *
 * ⚠️ UNE LIGNE DE « SORTIE » QUI N'EN EST PAS. `lecon-12` intercale « (2 secondes plus
 * tard) » au milieu de la sortie de son programme asynchrone : c'est une GLOSE, pas ce
 * que le programme imprime. Le champ `glose` la retire de la comparaison au lieu de
 * faire semblant de la produire — et c'est aussi pourquoi ce bloc ne peut pas porter
 * d'exercice de prédiction.
 *
 * ⚠️ UN REJEU QUI NE TROUVE RIEN DOIT PROUVER QU'IL SAIT TROUVER. D'où les contre-
 * épreuves ciblées : chacune casse UNE règle et doit faire apparaître exactement les
 * programmes qui en dépendent, ni plus ni moins.
 *
 *   node tools/preuves/rejoue-csharp.js                 compare, sortie 0 si tout concorde
 *   node tools/preuves/rejoue-csharp.js --fausse=write  Console.Write saute une ligne
 *   node tools/preuves/rejoue-csharp.js --fausse=zero   un decimal garde ses décimales
 *   node tools/preuves/rejoue-csharp.js --fausse=static un membre static devient d'instance
 */
var fs = require('fs');
var RACINE = require('path').resolve(__dirname, '..', '..');
var FAUSSE = (process.argv.filter(function (a) { return a.indexOf('--fausse') === 0; })[0] || '').split('=')[1] || '';
function dec(s) {
  return s.replace(/\r\n?/g, '\n')
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'").replace(/&#x27;/gi, "'").replace(/&amp;/g, '&');
}

/* --- ce que C# IMPRIME ------------------------------------------------------------
   `num` : un decimal ou un double dont la partie décimale est nulle s'imprime sans
   zéro final — 120m donne « 120 », 12.0 donne « 12 ». D'où la contre-épreuve « zero ».
   `Sortie` : un tampon qui distingue Write (pas de saut) de WriteLine. */
function num(v) {
  if (FAUSSE === 'zero' && Number.isInteger(v)) return v.toFixed(2);
  return String(v);
}
function Sortie() {
  var lignes = [], courante = '';
  return {
    write: function (s) {
      courante += s;
      if (FAUSSE === 'write') { lignes.push(courante); courante = ''; }
    },
    line: function (s) { lignes.push(courante + (s === undefined ? '' : s)); courante = ''; },
    fin: function () { if (courante) lignes.push(courante); return lignes; }
  };
}

/* --- les programmes, transposés un à un ---------------------------------------- */
var PROGRAMMES = {

  /* ---- lecon-01 : premiers programmes ---- */
  '01/top-level': function () { return ['Bonjour, C#!']; },
  '01/classique': function () { return ['Bonjour, C#!']; },
  /* Trois Write d'affilée ne font qu'UNE ligne : c'est WriteLine qui la termine. */
  '01/write': function () {
    var o = Sortie();
    o.write('Bonjour ');
    o.write('C#');
    o.line('!');
    o.line('Ligne suivante.');
    return o.fin();
  },
  '01/interpolation': function () {
    var prenom = 'Noah', age = 17;
    return ['Bonjour ' + prenom + ', tu as ' + age + ' ans.',
            "L'an prochain, tu en auras " + (age + 1) + '.'];
  },
  '01/commentaires': function () { return ["Le code, lui, s'exécute."]; },
  '01/premier': function () { return ['Mon premier programme C#']; },
  '01/carte': function () { return ['Prénom  : Noah', 'Langage : C#', 'Ville   : Lyon']; },

  /* ---- lecon-04 : tableaux ---- */
  /* ⚠️ SORTIE INCOMPLÈTE DANS LA LEÇON, exactement comme son jumeau `java/lecon-04` :
     trois WriteLine précèdent la boucle, la leçon n'annonçait que les deux rangées.
     `Write($"{...} ")` laisse une espace en fin de rangée — invisible en commentaire,
     non transcrite (réserve assumée). */
  '04/grille': function () {
    var grille = [[1, 2, 3], [4, 5, 6]], o = Sortie();
    o.line(String(grille[1][2]));
    o.line(String(grille.length));
    o.line(String(grille[0].length));
    for (var i = 0; i < grille.length; i++) {
      for (var j = 0; j < grille[i].length; j++) o.write(grille[i][j] + ' ');
      o.line();
    }
    return o.fin().map(function (l) { return l.replace(/\s+$/, ''); });
  },

  /* ---- lecon-05 : classes et objets ---- */
  '05/compteur': function () {
    var valeur = 0;
    valeur++; valeur++;
    return ['Valeur : ' + valeur];
  },
  /* Le constructeur à un argument CHAÎNE vers le principal avec 100 : Lina a donc
     100 PV sans qu'aucun appel ne les écrive. */
  '05/constructeurs': function () {
    function Joueur(nom, pv) { this.nom = nom; this.pv = pv === undefined ? 100 : pv; }
    Joueur.prototype.decrire = function () { return this.nom + ' (' + this.pv + ' PV)'; };
    var a = new Joueur('Noah', 100), b = new Joueur('Lina');
    return [a.decrire() + ' | ' + b.decrire()];
  },
  '05/propriete-validee': function () {
    var nom = 'Souris', prix = 25;
    return [nom + ' a ' + num(prix) + ' EUR'];
  },
  /* Le compteur est STATIQUE : un seul pour toute la classe. u1 prend 1, u2 prend 2,
     et Total reste à 2. D'où la contre-épreuve « static ». */
  '05/static': function () {
    var Total = 0;
    function creer() { if (FAUSSE === 'static') return { Id: 1 }; Total++; return { Id: Total }; }
    var u1 = creer(), u2 = creer();
    var t = FAUSSE === 'static' ? 1 : Total;
    return [u1.Id + ', ' + u2.Id + ', total = ' + t];
  },
  '05/init': function () {
    var perso = { Nom: 'Aria', Niveau: 5 };
    return [perso.Nom + ' niveau ' + perso.Niveau];
  },
  '05/primary-constructor': function () {
    var hote = 'localhost', port = 8080;
    return [hote + ':' + port];
  },
  /* 50 + 100 − 30 = 120 : un decimal sans décimale s'imprime « 120 ». */
  '05/encapsulation': function () {
    var titulaire = 'Noah', solde = 50;
    solde += 100;
    solde -= 30;
    return [titulaire + ' : ' + num(solde) + ' EUR'];
  },
  /* 3 × 4 = 12 : un double entier s'imprime « 12 », pas « 12.0 ». */
  '05/propriete-calculee': function () {
    var largeur = 3, hauteur = 4;
    return ['Aire = ' + num(largeur * hauteur)];
  },
  '05/init-only': function () {
    var livre = { Titre: 'Le Petit Prince', Auteur: 'Saint-Exupery' };
    return [livre.Titre + ' — ' + livre.Auteur];
  },
  '05/note-validee': function () {
    var nom = 'Noah', note = 17;
    return [nom + ' : ' + num(note) + '/20'];
  },

  /* ---- lecon-09 : exceptions ---- */
  '09/filtre-when': function () { return ['Délai dépassé, on réessaiera plus tard.']; },
  '09/catch-ordonnes': function () {
    var chemin = 'inexistant.txt';
    return ['Fichier introuvable : ' + chemin];
  },
  '09/exception-maison': function () {
    var age = 200;
    var message = 'Âge invalide : ' + age + '. Il doit être entre 0 et 130.';
    return [message + ' (valeur reçue : ' + age + ')'];
  },

  /* ---- lecon-12 : asynchrone ---- */
  /* `await` SÉQUENTIALISE : « Fin » ne s'imprime qu'après « Cafe pret ! ». La ligne
     « (2 secondes plus tard) » de la leçon est une glose, retirée par `glose`. */
  '12/async': function () {
    return ['Debut', 'Je lance la machine...', 'Cafe pret !', 'Fin'];
  }
};

/* --- les blocs du site, désignés par un motif ---------------------------------- */
var CIBLES = [
  { cle: '01/top-level',    lecon: '01', bloc: '// Forme moderne : top-level statements' },
  { cle: '01/classique',    lecon: '01', bloc: '// Forme classique équivalente' },
  { cle: '01/write',        lecon: '01', bloc: 'Console.Write("Bonjour ");' },
  { cle: '01/interpolation', lecon: '01', bloc: 'var prenom = "Noah";' },
  { cle: '01/commentaires', lecon: '01', bloc: 'Commentaire de documentation' },
  { cle: '01/premier',      lecon: '01', bloc: 'Console.WriteLine("Mon premier programme C#");' },
  { cle: '01/carte',        lecon: '01', bloc: '// Affiche une carte de visite sur trois lignes' },
  { cle: '04/grille',       lecon: '04', bloc: 'int[,] grille =' },
  { cle: '05/compteur',     lecon: '05', bloc: 'var compteur = new Compteur();' },
  { cle: '05/constructeurs', lecon: '05', bloc: 'public Joueur(string nom) : this(nom, 100) { }' },
  { cle: '05/propriete-validee', lecon: '05', bloc: 'var p = new Produit { Nom = "Souris" };' },
  { cle: '05/static',       lecon: '05', bloc: 'public static int Total { get; private set; }' },
  { cle: '05/init',         lecon: '05', bloc: 'var perso = new Personnage' },
  { cle: '05/primary-constructor', lecon: '05', bloc: 'class Serveur(string hote, int port)' },
  { cle: '05/encapsulation', lecon: '05', bloc: 'var compte = new Compte("Noah", 50m);' },
  { cle: '05/propriete-calculee', lecon: '05', bloc: 'var r = new Rectangle(3, 4);' },
  { cle: '05/init-only',    lecon: '05', bloc: 'var livre = new Livre' },
  { cle: '05/note-validee', lecon: '05', bloc: 'var e = new Etudiant("Noah");' },
  { cle: '09/filtre-when',  lecon: '09', bloc: 'catch (HttpRequestException e) when' },
  { cle: '09/catch-ordonnes', lecon: '09', bloc: 'void AfficherFichier(string chemin)' },
  { cle: '09/exception-maison', lecon: '09', bloc: 'class AgeInvalideException : Exception' },
  { cle: '12/async',        lecon: '12', bloc: 'async Task PreparerCafeAsync()', glose: /^\(.*\)$/ }
];

var RE = /<code class="language-([\w+#-]+)">([\s\S]*?)<\/code>/g;
var RE_TETE = /^\s*\/\/\s*Sortie\s*:(.*)$/;
var RE_COM = /^\s*\/\/\s?/;

function sortieAffirmee(lecon, motif) {
  var t = fs.readFileSync(RACINE + '/pages/csharp/lecon-' + lecon + '.html', 'utf8'), m;
  RE.lastIndex = 0;
  while ((m = RE.exec(t))) {
    if (m[1] !== 'csharp') continue;
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

var ok = 0, ko = 0, absent = 0, lignesComparees = 0, glosees = 0;
CIBLES.forEach(function (c) {
  var aff = sortieAffirmee(c.lecon, c.bloc);
  if (aff === undefined) { console.log('✗ ' + c.cle + ' : bloc introuvable (' + c.bloc + ')'); absent++; return; }
  if (c.glose) {
    var avant = aff.length;
    aff = aff.filter(function (l) { return !c.glose.test(l.trim()); });
    glosees += avant - aff.length;
  }
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
  ' non trouvé(s) — ' + lignesComparees + ' lignes de sortie comparées, ' + glosees + ' glose(s) écartée(s).' +
  (FAUSSE ? '\n(contre-épreuve « ' + FAUSSE + ' » : une règle a été faussée exprès — des divergences sont ATTENDUES)' : ''));
process.exit(ko || absent ? 1 : 0);
