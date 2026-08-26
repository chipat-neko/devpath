'use strict';
/**
 * tools/preuves/rejoue-elixir.js — RECALCULER les valeurs que les leçons Elixir affirment.
 *
 * POURQUOI. La règle du chantier V14 interdit d'écrire une valeur de tête : il faut la
 * faire tourner. Ni `elixir`, ni `iex`, ni `erl` ne sont installés ici (vérifié). Le
 * cours annonce ses résultats à la forme `# => valeur` : 107 annonces dans 56 blocs.
 * Celles qui portent une VALEUR PURE se rejouent fidèlement, à condition de reproduire
 * aussi ce qu'`inspect` ÉCRIT — car l'annonce n'est pas la valeur, c'est sa graphie :
 *
 *   · une map s'affiche CLÉS TRIÉES en ordre de terme, quel que soit l'ordre d'écriture :
 *     `%{nom: nom, email: email}` s'inspecte `%{email: ..., nom: ...}`. Idem pour les
 *     champs d'une struct. C'est ce point qui décide de plusieurs annonces du cours.
 *   · un flottant garde toujours une décimale : `10 / 2` vaut `5.0`, jamais `5` — et en
 *     Elixir l'opérateur `/` rend TOUJOURS un flottant, même sur deux entiers.
 *   · l'arithmétique flottante est celle d'IEEE 754, la même qu'en JavaScript : la
 *     transposition n'approxime rien, elle recalcule à l'identique.
 *   · `Float.round(x, 2)` arrondit au plus proche, il ne tronque pas.
 *   · un atome s'écrit `:enfant`, un tuple `{:ok, 30}`, une liste `[1, 2, 3]`, une
 *     chaîne entre guillemets — et `nil`, `true`, `false` sont des atomes.
 *   · les clauses de fonction et les gardes filtrent DANS L'ORDRE D'ÉCRITURE : c'est la
 *     première clause dont le motif ET la garde passent qui s'exécute.
 *
 * CE QUE ÇA PROUVE, ET CE QUE ÇA NE PROUVE PAS. Ça prouve que la VALEUR affirmée est
 * celle que produit le code, GRAPHIE COMPRISE. Ça ne prouve pas que l'Elixir se compile.
 * La transposition est écrite ci-dessous, lisible, et confrontée à l'annonce EXTRAITE du
 * HTML — jamais retapée.
 *
 * LE PÉRIMÈTRE EST DÉCLARÉ, PAS SILENCIEUX. Cinq leçons sur douze annoncent des valeurs
 * qu'aucune transposition ne peut honnêtement produire, et elles sont laissées dehors en
 * le disant : `lecon-08` (des PID, `#PID<0.110.0>`, qui changent à chaque démarrage),
 * `lecon-09` et `lecon-10` (sessions IEx écrites en commentaire, superviseurs, PID),
 * `lecon-12` et `lecon-16` (structures Ecto, une bibliothèque tierce), `lecon-15` (des
 * arbres de syntaxe abrégés par des `_`), `lecon-17` (un GenServer). À l'intérieur du
 * périmètre, quatre annonces sont écartées UNE PAR UNE, motif à l'appui : un abrégé par
 * `...`, une lecture de fichier, une glose.
 *
 * ⚠️ UN REJEU QUI NE TROUVE RIEN DOIT PROUVER QU'IL SAIT TROUVER. D'où les contre-
 * épreuves : chacune casse UNE règle et doit faire apparaître exactement les annonces
 * qui en dépendent, ni plus ni moins.
 *
 *   node tools/preuves/rejoue-elixir.js                 compare, sortie 0 si tout concorde
 *   node tools/preuves/rejoue-elixir.js --fausse=tri    les maps garderaient l'ordre d'écriture
 *   node tools/preuves/rejoue-elixir.js --fausse=flottant  un flottant entier perdrait son .0
 *   node tools/preuves/rejoue-elixir.js --fausse=arrondi   Float.round tronquerait
 *   node tools/preuves/rejoue-elixir.js --fausse=clause    la DERNIÈRE clause l'emporterait
 *   node tools/preuves/rejoue-elixir.js --fausse=paresse   Stream.take rendrait tout le flux
 *   node tools/preuves/rejoue-elixir.js --voir          affiche chaque valeur rejouée
 */
var fs = require('fs');
var RACINE = require('path').resolve(__dirname, '..', '..');
var FAUSSE = (process.argv.filter(function (a) { return a.indexOf('--fausse') === 0; })[0] || '').split('=')[1] || '';
var VOIR = process.argv.indexOf('--voir') !== -1;
function dec(s) {
  return s.replace(/\r\n?/g, '\n')
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'").replace(/&#x27;/gi, "'").replace(/&amp;/g, '&');
}

/* --- les termes d'Elixir, et ce qu'`inspect` en écrit ----------------------------- */
function A(nom) { return { atome: nom }; }                 // :ok, :enfant, true, false, nil
function T(items) { return { tuple: items }; }             // {:ok, 30}
function M(paires) { return { map: paires }; }             // %{a: 1} — paires [[cle, val], …]
function S(nom, champs) { return { struct: nom, champs: champs }; }  // %Utilisateur{…}
function F(x) { return { flottant: x }; }                  // 5.0, 12.57
function SAUT(motif) { return { saut: motif }; }           // annonce écartée, motif déclaré

var VRAI = A('true'), FAUX = A('false'), NIL = A('nil');

/** L'ordre de terme d'Elixir, restreint aux clés qu'emploie ce cours : nombres, puis
    atomes, puis chaînes. C'est LUI qui décide de la graphie d'une map. */
function rangType(v) {
  if (typeof v === 'number') return 0;
  if (v && v.flottant !== undefined) return 0;
  if (v && v.atome) return 1;
  return 2;                                   // chaîne
}
function cleBrute(v) {
  if (typeof v === 'number') return v;
  if (v && v.flottant !== undefined) return v.flottant;
  if (v && v.atome) return v.atome;
  return String(v);
}
function trierCles(paires) {
  if (FAUSSE === 'tri') return paires.slice();
  return paires.slice().sort(function (x, y) {
    var rx = rangType(x[0]), ry = rangType(y[0]);
    if (rx !== ry) return rx - ry;
    var a = cleBrute(x[0]), b = cleBrute(y[0]);
    if (typeof a === 'number') return a - b;
    return a < b ? -1 : a > b ? 1 : 0;
  });
}
/** Un atome s'écrit sans deux-points en position de clé : `%{age: 36}`. */
function estAtomeSimple(k) { return k && k.atome && /^[a-z_][A-Za-z0-9_]*[?!]?$/.test(k.atome); }

function inspect(v) {
  if (v === null || v === undefined) return 'nil';
  if (typeof v === 'number') return String(v);
  if (typeof v === 'string') return JSON.stringify(v);
  if (Array.isArray(v)) return '[' + v.map(inspect).join(', ') + ']';
  if (v.flottant !== undefined) {
    var x = v.flottant;
    if (FAUSSE === 'flottant') return String(x);
    return Number.isInteger(x) ? x + '.0' : String(x);
  }
  if (v.atome !== undefined) {
    return /^(true|false|nil)$/.test(v.atome) ? v.atome : ':' + v.atome;
  }
  if (v.tuple !== undefined) return '{' + v.tuple.map(inspect).join(', ') + '}';
  if (v.map !== undefined) {
    var p = trierCles(v.map);
    if (p.every(function (e) { return estAtomeSimple(e[0]); })) {
      return '%{' + p.map(function (e) { return e[0].atome + ': ' + inspect(e[1]); }).join(', ') + '}';
    }
    return '%{' + p.map(function (e) { return inspect(e[0]) + ' => ' + inspect(e[1]); }).join(', ') + '}';
  }
  if (v.struct !== undefined) {
    var c = trierCles(v.champs);
    return '%' + v.struct + '{' + c.map(function (e) { return e[0].atome + ': ' + inspect(e[1]); }).join(', ') + '}';
  }
  return String(v);
}

/* --- quelques fonctions de la bibliothèque standard, transposées ------------------ */
function floatRound(x, p) {
  var k = Math.pow(10, p);
  if (FAUSSE === 'arrondi') return Math.trunc(x * k) / k;
  return Math.round(x * k) / k;
}
/** Enum.frequencies : une map « valeur => nombre d'occurrences ». */
function frequencies(liste) {
  var vus = [], out = [];
  liste.forEach(function (v) {
    var i = vus.indexOf(v);
    if (i < 0) { vus.push(v); out.push([v, 1]); } else out[i][1]++;
  });
  return M(out);
}
/** Enum.group_by(liste, cle, valeur) : chaque groupe garde l'ordre d'apparition. */
function groupBy(liste, cle, val) {
  var cles = [], out = [];
  liste.forEach(function (e) {
    var k = cle(e), i = cles.indexOf(k);
    if (i < 0) { cles.push(k); out.push([k, [val(e)]]); } else out[i][1].push(val(e));
  });
  return M(out);
}
/** Enum.take sur un flux : `n` éléments, et seulement `n` — c'est la paresse. */
function take(generateur, n) {
  var out = [];
  if (FAUSSE === 'paresse') n = n + 3;
  for (var i = 0; i < n; i++) out.push(generateur(i));
  return out;
}
/** L'ordre des clauses : la PREMIÈRE qui matche gagne. La contre-épreuve inverse. */
function clauses(liste) {
  var l = FAUSSE === 'clause' ? liste.slice().reverse() : liste;
  for (var i = 0; i < l.length; i++) if (l[i][0]()) return l[i][1]();
  return undefined;
}

/* --- les blocs, transposés un à un ----------------------------------------------- */
/* Chaque fonction rend la LISTE des valeurs annoncées par son bloc, dans l'ordre. */
var BLOCS = {

  /* ================= lecon-03 — modules, fonctions, motifs ================= */
  '03/math': function () {
    var double = function (x) { return x * 2; }, triple = function (x) { return x * 3; };
    return [double(21), triple(10)];
  },
  '03/prix': function () {
    /* ht + tva(ht), avec tva = ht * 0.2 — 100.0 est un FLOTTANT, le résultat aussi. */
    var tva = function (ht) { return ht * 0.2; };
    var ttc = function (ht) { return ht + tva(ht); };
    return [F(ttc(100.0))];
  },
  '03/anonymes': function () {
    var double = function (x) { return x * 2; };
    var doubleCourt = function (x) { return x * 2; };
    return [double(21), doubleCourt(21), [1, 2, 3].map(double), [1, 2, 3].map(doubleCourt)];
  },
  '03/geometrie': function () {
    /* Trois clauses distinguées par la FORME du tuple. 3.14159 est un flottant, donc
       le cercle rend un flottant ; le rectangle et le carré restent entiers. */
    var aire = function (forme) {
      if (forme.tuple[0].atome === 'cercle') { var r = forme.tuple[1]; return F(3.14159 * r * r); }
      if (forme.tuple[0].atome === 'rectangle') return forme.tuple[1] * forme.tuple[2];
      return forme.tuple[1] * forme.tuple[1];
    };
    return [aire(T([A('cercle'), 10])), aire(T([A('rectangle'), 4, 5])), aire(T([A('carre'), 3]))];
  },
  '03/gardes': function () {
    var signe = function (n) {
      return clauses([
        [function () { return Number.isInteger(n) && n > 0; }, function () { return A('positif'); }],
        [function () { return Number.isInteger(n) && n < 0; }, function () { return A('negatif'); }],
        [function () { return n === 0; }, function () { return A('zero'); }]
      ]);
    };
    return [signe(42), signe(-7), signe(0)];
  },
  '03/defaut': function () {
    var saluer = function (nom, message) {
      if (message === undefined) message = 'Bonjour';
      return message + ', ' + nom + ' !';
    };
    return [saluer('Noah'), saluer('Noah', 'Salut')];
  },
  '03/pipe': function () {
    /* {:cercle, 2} |> Geo.aire() |> Geo.arrondir() : π·r² puis arrondi à 2 décimales. */
    var aire = function (r) { return Math.PI * r * r; };
    var arrondir = function (x) { return floatRound(x * 1.0, 2); };
    return [F(arrondir(aire(2)))];
  },
  '03/carre': function () {
    var carre = function (n) { return n * n; };
    return [carre(9), carre(9)];
  },
  '03/categorie': function () {
    var de = function (age) {
      return clauses([
        [function () { return age < 13; }, function () { return A('enfant'); }],
        [function () { return age >= 13 && age <= 17; }, function () { return A('ado'); }],
        [function () { return age >= 18; }, function () { return A('adulte'); }]
      ]);
    };
    return [de(8), de(15), de(40)];
  },
  '03/perimetre': function () {
    var perimetre = function (r) { return 2 * Math.PI * r; };
    var arrondir = function (x) { return floatRound(x * 1.0, 2); };
    return [F(arrondir(perimetre(3)))];
  },

  /* ================= lecon-05 — récursion, Enum, Stream ================= */
  '05/somme-recursive': function () {
    var somme = function (l) { return l.length === 0 ? 0 : l[0] + somme(l.slice(1)); };
    return [somme([1, 2, 3, 4])];
  },
  '05/somme-terminale': function () {
    var somme = function (l, acc) { return l.length === 0 ? acc : somme(l.slice(1), acc + l[0]); };
    return [somme([1, 2, 3, 4], 0)];
  },
  '05/map-maison': function () {
    var map = function (l, f) { return l.length === 0 ? [] : [f(l[0])].concat(map(l.slice(1), f)); };
    return [map([1, 2, 3], function (x) { return x * 10; })];
  },
  '05/enum': function () {
    var nombres = [5, 3, 8, 1, 9, 2, 8];
    return [
      nombres.map(function (n) { return n * 2; }),
      nombres.filter(function (n) { return n > 4; }),
      nombres.reduce(function (acc, n) { return n + acc; }, 0),
      nombres.reduce(function (a, b) { return a + b; }, 0),
      nombres.slice().sort(function (a, b) { return a - b; }),
      frequencies(nombres),
      A('ok')                                   // Enum.each ne rend que :ok
    ];
  },
  '05/personnes': function () {
    var personnes = [
      { nom: 'Ada', ville: 'Paris', age: 36 },
      { nom: 'Linus', ville: 'Lyon', age: 54 },
      { nom: 'Grace', ville: 'Paris', age: 41 }
    ];
    var enMap = function (p) { return M([[A('nom'), p.nom], [A('ville'), p.ville], [A('age'), p.age]]); };
    var trouve = personnes.filter(function (p) { return p.age > 50; })[0];
    return [
      SAUT('la leçon abrège la liste triée par des « ... » : ce n\'est pas la graphie complète'),
      groupBy(personnes, function (p) { return p.ville; }, function (p) { return p.nom; }),
      enMap(trouve)
    ];
  },
  '05/streams': function () {
    return [
      take(function (i) { return Math.pow(2, i); }, 5),
      take(function (i) { return ['rouge', 'vert'][i % 2]; }, 5),
      take(function (i) { return i * 10; }, 4)
    ];
  },
  '05/fichier': function () {
    return [SAUT('la valeur annoncée est une phrase, pas un terme : « les 10 premières lignes d\'erreur »')];
  },
  '05/comprehensions': function () {
    var carres = [];
    for (var x = 1; x <= 10; x++) if (x % 2 === 0) carres.push(x * x);
    var couples = [];
    [1, 2].forEach(function (a) { [A('a'), A('b')].forEach(function (b) { couples.push(T([a, b])); }); });
    /* Un motif dans le générateur FILTRE : les {:error, _} ne matchent pas. */
    var paires = [T([A('ok'), 1]), T([A('error'), 2]), T([A('ok'), 3])];
    var oks = paires.filter(function (p) { return p.tuple[0].atome === 'ok'; }).map(function (p) { return p.tuple[1]; });
    return [carres, couples, oks];
  },
  '05/longueur': function () {
    var longueur = function (l, acc) { return l.length === 0 ? acc : longueur(l.slice(1), acc + 1); };
    return [longueur([A('a'), A('b'), A('c'), A('d')], 0)];
  },
  '05/doublons': function () {
    var mots = ['chat', 'chien', 'rat', 'cheval', 'rat', 'chat'];
    var f = frequencies(mots);
    return [M(f.map.filter(function (e) { return e[1] >= 2; }))];
  },
  '05/premiers': function () {
    var premier = function (n) {
      if (n < 2) return false;
      if (n === 2) return true;
      for (var d = 2; d <= Math.trunc(Math.sqrt(n)); d++) if (n % d === 0) return false;
      return true;
    };
    var out = [], n = 2;
    while (out.length < 8) { if (premier(n)) out.push(n); n++; }
    return [out];
  },

  /* ================= lecon-07 — tuples de retour, with, erreurs ================= */
  '07/convention': function () {
    return [T([A('ok'), 30]), A('error'), T([A('error'), A('invalid_date')]), T([42, ''])];
  },
  '07/case': function () {
    return ['Âge : ' + 36, 'Échec : ' + 'invalid_date'];
  },
  '07/cond': function () {
    var categorie = function (age) {
      return clauses([
        [function () { return age < 0; }, function () { return T([A('error'), A('age_negatif')]); }],
        [function () { return age < 12; }, function () { return T([A('ok'), A('enfant')]); }],
        [function () { return age < 65; }, function () { return T([A('ok'), A('adulte')]); }],
        [function () { return true; }, function () { return T([A('ok'), A('senior')]); }]
      ]);
    };
    return [categorie(8), categorie(-3)];
  },
  '07/if-unless': function () {
    var message = (7 % 2 === 0) ? 'pair' : 'impair';
    var stock = 0;
    var dispo = !(stock > 0) ? 'Rupture' : 'Disponible';
    return [message, dispo];
  },
  '07/with': function () {
    var autoriser = function (login) {
      if (login !== 'ada') return T([A('error'), A('introuvable')]);
      var role = 'admin';
      return T([A('ok'), 'Bienvenue, rôle ' + role]);
    };
    return [autoriser('ada'), autoriser('bob')];
  },
  '07/inscription': function () {
    var valider = function (params) {
      var etapes = ['nom', 'email'], vals = {};
      for (var i = 0; i < etapes.length; i++) {
        var cle = etapes[i];
        if (!(cle in params)) return T([A('error'), T([A('manquant'), A(cle)])]);
        if (params[cle] === '') return T([A('error'), T([A('vide'), A(cle)])]);
        vals[cle] = params[cle];
      }
      /* La map est construite %{nom: …, email: …} ; inspect la rend clés TRIÉES. */
      return T([A('ok'), M([[A('nom'), vals.nom], [A('email'), vals.email]])]);
    };
    return [valider({ nom: 'Ada', email: 'ada@example.com' }), valider({ nom: '', email: 'ada@example.com' })];
  },
  '07/rescue': function () {
    /* String.to_integer("pas un nombre") lève ArgumentError, que le rescue convertit. */
    return [T([A('error'), A('format_invalide')])];
  },
  '07/fichiers': function () {
    return [
      SAUT('File.read dépend du disque de qui exécute'),
      SAUT('la leçon glose la valeur (« si présent ») : ce n\'est pas un terme')
    ];
  },
  '07/diviser': function () {
    /* En Elixir, `/` rend TOUJOURS un flottant : 10 / 2 vaut 5.0, jamais 5. */
    var diviser = function (a, b) {
      return b === 0 ? T([A('error'), A('division_par_zero')]) : T([A('ok'), F(a / b)]);
    };
    var dire = function (r) {
      return r.tuple[0].atome === 'ok' ? 'Résultat : ' + inspect(r.tuple[1]) : 'Impossible de diviser par zéro';
    };
    return [dire(diviser(10, 2)), dire(diviser(10, 0))];
  },
  '07/compte': function () {
    var creer = function (params) {
      if (!('nom' in params)) return T([A('error'), A('nom_manquant')]);
      if (params.nom === '') return T([A('error'), A('nom_vide')]);
      if (!('age' in params)) return T([A('error'), A('age_manquant')]);
      if (!(Number.isInteger(params.age) && params.age >= 18)) return T([A('error'), A('age_invalide')]);
      return T([A('ok'), M([[A('nom'), params.nom], [A('age'), params.age]])]);
    };
    return [creer({ nom: 'Ada', age: 36 }), creer({ nom: 'Ada', age: 15 }), creer({ age: 36 })];
  },
  '07/else': function () {
    return [T([A('error'), 'Le nom ne peut pas être vide.'])];
  },

  /* ================= lecon-13 — structs et protocoles ================= */
  '13/struct': function () {
    var u = S('Utilisateur', [[A('nom'), 'Ada'], [A('age'), 36], [A('admin'), FAUX]]);
    var u37 = S('Utilisateur', [[A('nom'), 'Ada'], [A('age'), 37], [A('admin'), FAUX]]);
    return [u, 'Ada', FAUX, u37];
  },
  '13/motif-struct': function () {
    var bandeau = function (nom, admin) { return admin ? nom + ' (admin)' : nom; };
    return [bandeau('Ada', true)];
  },
  '13/protocole': function () {
    return ['Ada, 36 ans', 'le nombre 42'];
  },
  '13/to-string': function () {
    return ['Bonjour Ada'];
  },
  '13/resume': function () {
    return ['Elixir (320 p.)'];
  },

  /* ================= lecon-14 — tâches et agents ================= */
  '14/task': function () {
    return [SAUT('la leçon abrège les trois résultats par des « ... »')];
  },
  '14/agent': function () {
    var etat = M([[A('total'), 0]]);
    var lire = function () { return etat.map[0][1]; };
    var d1 = lire();                                  // Agent.get -> 0
    etat = M([[A('total'), lire() + 5]]);             // Agent.update
    var d2 = lire();                                  // Agent.get -> 5
    var ancien = lire();                              // get_and_update rend l'ANCIEN
    etat = M([[A('total'), 0]]);
    return [d1, d2, ancien];
  },
  '14/compteur': function () {
    var n = 0;
    n = n + 1;
    return [n];
  }
};

/* --- les cibles : quel bloc de quelle leçon, et son motif d'identification -------- */
var CIBLES = [
  { cle: '03/math', lecon: '03', bloc: 'def triple(x), do: x * 3' },
  { cle: '03/prix', lecon: '03', bloc: 'defp tva(ht), do: ht * 0.2' },
  { cle: '03/anonymes', lecon: '03', bloc: 'double_court = &(&1 * 2)' },
  { cle: '03/geometrie', lecon: '03', bloc: 'def aire({:carre, c}), do: c * c' },
  { cle: '03/gardes', lecon: '03', bloc: 'def signe(n) when is_integer(n) and n > 0' },
  { cle: '03/defaut', lecon: '03', bloc: 'def saluer(nom, message ' },
  { cle: '03/pipe', lecon: '03', bloc: '@moduledoc "Calculs d\'aires de formes simples."' },
  { cle: '03/carre', lecon: '03', bloc: 'carre = &(&1 * &1)' },
  { cle: '03/categorie', lecon: '03', bloc: 'def de(age) when age < 13, do: :enfant' },
  { cle: '03/perimetre', lecon: '03', bloc: 'def perimetre_arrondi(forme) do' },

  { cle: '05/somme-recursive', lecon: '05', bloc: 'def somme([tete | reste]), do: tete + somme(reste)' },
  { cle: '05/somme-terminale', lecon: '05', bloc: 'defp somme([tete | reste], acc), do: somme(reste, acc + tete)' },
  { cle: '05/map-maison', lecon: '05', bloc: 'def map([tete | reste], fun), do: [fun.(tete) | map(reste, fun)]' },
  { cle: '05/enum', lecon: '05', bloc: 'nombres = [5, 3, 8, 1, 9, 2, 8]' },
  { cle: '05/personnes', lecon: '05', bloc: 'Enum.sort_by(personnes, fn p -> p.age end)' },
  { cle: '05/streams', lecon: '05', bloc: 'Stream.cycle(["rouge", "vert"])' },
  { cle: '05/fichier', lecon: '05', bloc: 'File.stream!()' },
  { cle: '05/comprehensions', lecon: '05', bloc: 'for x <- 1..10, rem(x, 2) == 0, do: x * x' },
  { cle: '05/longueur', lecon: '05', bloc: 'defp longueur([_tete | reste], acc), do: longueur(reste, acc + 1)' },
  { cle: '05/doublons', lecon: '05', bloc: 'mots = ["chat", "chien", "rat", "cheval", "rat", "chat"]' },
  { cle: '05/premiers', lecon: '05', bloc: 'def premier?(n) when n < 2, do: false' },

  { cle: '07/convention', lecon: '07', bloc: 'Map.fetch(%{age: 30}, :age)' },
  { cle: '07/case', lecon: '07', bloc: 'utilisateur = %{nom: "Ada", age: 36}' },
  { cle: '07/cond', lecon: '07', bloc: 'age < 0 -> {:error, :age_negatif}' },
  { cle: '07/if-unless', lecon: '07', bloc: 'message = if rem(7, 2) == 0' },
  { cle: '07/with', lecon: '07', bloc: 'def autoriser(profils, login) do' },
  { cle: '07/inscription', lecon: '07', bloc: 'defmodule Inscription do' },
  { cle: '07/rescue', lecon: '07', bloc: 'String.to_integer("pas un nombre")' },
  { cle: '07/fichiers', lecon: '07', bloc: 'File.read("absent.txt")' },
  { cle: '07/diviser', lecon: '07', bloc: 'def diviser(_a, 0), do: {:error, :division_par_zero}' },
  { cle: '07/compte', lecon: '07', bloc: 'defmodule Compte do' },
  { cle: '07/else', lecon: '07', bloc: 'defmodule CompteUI do' },

  { cle: '13/struct', lecon: '13', bloc: 'defstruct nom: "", age: 0, admin: false' },
  { cle: '13/motif-struct', lecon: '13', bloc: 'def bandeau(%Utilisateur{admin: true, nom: nom})' },
  { cle: '13/protocole', lecon: '13', bloc: 'defprotocol Descriptible do' },
  { cle: '13/to-string', lecon: '13', bloc: 'defimpl String.Chars, for: Utilisateur do' },
  { cle: '13/resume', lecon: '13', bloc: 'defprotocol Resume do' },

  { cle: '14/task', lecon: '14', bloc: 't1 = Task.async(fn -> appel_lent(:meteo) end)' },
  { cle: '14/agent', lecon: '14', bloc: 'Agent.get_and_update(pid, fn e ->' },
  { cle: '14/compteur', lecon: '14', bloc: 'def incrementer(pid), do: Agent.update(pid, &(&1 + 1))' }
];

/* Les leçons laissées HORS PÉRIMÈTRE, et pourquoi — comptées, pas tues. */
var HORS = [
  ['08', 'des PID (#PID<0.110.0>), qui changent à chaque démarrage'],
  ['09', 'sessions IEx écrites en commentaire, autour d\'un GenServer'],
  ['10', 'superviseurs et PID'],
  ['12', 'structures Ecto (bibliothèque tierce)'],
  ['15', 'arbres de syntaxe abrégés par des « _ »'],
  ['16', 'requêtes et changesets Ecto (bibliothèque tierce)'],
  ['17', 'un GenServer d\'inventaire, monté au fil de la leçon']
];

/* --- extraction des annonces ------------------------------------------------------ */
var RE_BLOC = /<code class="language-elixir">([\s\S]*?)<\/code>/g;
/** Même nettoyage que le générateur : on coupe la glose entre parenthèses finale. */
function valeurNette(s) { return String(s).trim().replace(/\s+\([^)]*\)\s*$/, '').trim(); }

function annoncesDe(lecon, motif) {
  var t = fs.readFileSync(RACINE + '/pages/elixir/lecon-' + lecon + '.html', 'utf8'), m;
  RE_BLOC.lastIndex = 0;
  while ((m = RE_BLOC.exec(t))) {
    var code = dec(m[1]);
    if (code.indexOf(motif) < 0) continue;
    var out = [];
    code.split('\n').forEach(function (l) {
      var i = l.indexOf('#');
      while (i >= 0 && !/^\s*=>/.test(l.slice(i + 1))) i = l.indexOf('#', i + 1);
      if (i < 0) return;
      out.push(valeurNette(l.slice(i + 1).replace(/^\s*=>\s*/, '')));
    });
    return out;
  }
  return undefined;
}

/* --- la passe --------------------------------------------------------------------- */
var ok = 0, ko = 0, absent = 0, sautees = 0, comparees = 0, divergences = [];
CIBLES.forEach(function (c) {
  var aff = annoncesDe(c.lecon, c.bloc);
  if (aff === undefined) { console.log('✗ ' + c.cle + ' : bloc introuvable (' + c.bloc + ')'); absent++; return; }
  var reel = BLOCS[c.cle]();
  if (aff.length !== reel.length) {
    console.log('✗ ' + c.cle + ' (lecon-' + c.lecon + ') : ' + aff.length + ' annonce(s) dans le bloc, ' +
      reel.length + ' valeur(s) rejouée(s)\n      annoncé : ' + JSON.stringify(aff));
    ko++; return;
  }
  var mauvais = 0;
  for (var i = 0; i < aff.length; i++) {
    if (reel[i] && reel[i].saut) {
      console.log('  · ' + c.cle + ' annonce ' + (i + 1) + ' — ÉCARTÉE : ' + reel[i].saut +
        ' (la leçon affirme ' + JSON.stringify(aff[i]) + ')');
      sautees++; continue;
    }
    comparees++;
    var vu = inspect(reel[i]);
    if (VOIR) console.log('    ' + c.cle + '#' + (i + 1) + ' → ' + vu);
    if (vu !== aff[i]) {
      mauvais++;
      divergences.push(c.cle + ' annonce ' + (i + 1) + ' : affirmé ' + JSON.stringify(aff[i]) + '  ≠  rejoué ' + JSON.stringify(vu));
    }
  }
  if (mauvais) { console.log('✗ ' + c.cle + ' (lecon-' + c.lecon + ') — ' + mauvais + ' divergence(s)'); ko++; }
  else { console.log('✓ ' + c.cle + ' (lecon-' + c.lecon + ') — ' + aff.length + ' annonce(s)'); ok++; }
});

if (divergences.length) {
  console.log('\n  DIVERGENCES :');
  divergences.forEach(function (d) { console.log('   · ' + d); });
}
console.log('\nHORS PÉRIMÈTRE, déclaré : ' + HORS.map(function (h) { return 'lecon-' + h[0]; }).join(', ') +
  ' — ' + HORS.map(function (h) { return h[1]; }).join(' ; ') + '.');
console.log(ok + ' bloc(s) conforme(s), ' + ko + ' divergent(s), ' + absent + ' non trouvé(s) — ' +
  comparees + ' annonces comparées, ' + sautees + ' écartées une par une.' +
  (FAUSSE ? '\n(contre-épreuve « ' + FAUSSE + ' » : une règle a été faussée exprès — des divergences sont ATTENDUES)' : ''));
process.exit(ko || absent ? 1 : 0);
