'use strict';
/**
 * tools/etudes/inconnu/transcription.js — la TRANSCRIPTION JavaScript d'inventaire.go.
 *
 * ⚠️ CE QUE CE FICHIER EST, ET CE QU'IL N'EST PAS.
 *
 * Ni `go` ni `gofmt` ne sont installés sur la machine qui fabrique ce site (vérifié :
 * `go version` ne répond pas). Publier « voici ce que ce programme Go affiche » serait
 * donc écrire un résultat de tête — exactement la faute qui a fondé tous ces chantiers.
 *
 * Ce fichier prend l'autre voie, celle que `tools/preuves/rejoue-go.js` emploie déjà pour
 * les 18 blocs du cours Go : on RÉÉCRIT le programme en JavaScript, en reproduisant à la
 * main ce que Go imprime, et on exécute la réécriture. Ce qui est alors prouvé, c'est que
 * la sortie publiée est celle que produit **cette transcription**, dont les règles sont
 * écrites en toutes lettres ci-dessous et vérifiables une par une. Ce n'est PAS une preuve
 * que le Go compile.
 *
 * LES RÈGLES DE GO REPRODUITES ICI, ET POURQUOI ELLES NE SE DEVINENT PAS :
 *
 *  · `strings.Fields` découpe autour de toute suite de blancs et JETTE les champs vides :
 *    "a   b" fait deux champs, pas quatre. (Un `split(" ")` naïf en ferait quatre.)
 *  · `strconv.Atoi` n'accepte QUE des chiffres, avec un signe facultatif, et refuse en
 *    plus tout entier qui ne tiendrait pas dans un int64. "12.5", "12 ", "douze" et ""
 *    échouent — et l'échec est une VALEUR de retour, pas une exception.
 *  · `fmt.Println` insère une espace entre TOUS ses opérandes et termine par un saut de
 *    ligne. (`fmt.Print`, lui, n'en met qu'entre deux opérandes dont aucun n'est une
 *    chaîne — ce n'est pas la même règle, et c'est une source d'erreur classique.)
 *  · `%q` produit un littéral de chaîne Go : guillemets doubles, antislash et guillemet
 *    échappés, et caractères de contrôle rendus visibles sous leur forme Go.
 *  · `%-10s` cale à GAUCHE sur 10 caractères, `%6d` cale à DROITE sur 6.
 *  · `defer` empile : les appels différés partent en ordre INVERSE, au retour de la
 *    fonction — y compris si elle panique.
 *  · `sort.Strings` compare les chaînes OCTET PAR OCTET en UTF-8, pas selon
 *    l'alphabet français : "ecrou" se range avant "vis", mais "écrou" se rangerait APRÈS.
 *  · lire une clé absente d'une map rend la VALEUR ZÉRO du type des VALEURS, ici 0 :
 *    `stock[k] += n` n'a besoin d'aucune initialisation d'entrée. En revanche la map
 *    elle-même doit exister : c'est `make` qui la crée, et écrire dans une map nulle
 *    ferait paniquer le programme.
 *
 * CE QUE LA TRANSCRIPTION REFUSE DE DEVINER, ET CE QU'ELLE APPROXIME.
 *
 * Le remplissage de `%-10s` compte les *runes* et non les octets — c'est vrai dans la
 * bibliothèque standard de Go, mais nous ne pouvons pas le VÉRIFIER ici. Plutôt que de
 * parier, `caler` lève une erreur si on lui demande de caler une valeur non ASCII, et le
 * programme lu n'en contient aucune aux emplacements calés. Ce qu'on ne peut pas
 * prouver, on l'évite au lieu de l'affirmer.
 *
 * Une approximation subsiste, et elle est écrite ici plutôt que tue : les « blancs » de
 * `stringsFields` sont ceux du `\s` de JavaScript, qui ne coïncide pas exactement avec
 * `unicode.IsSpace` de Go (deux caractères exotiques diffèrent, U+0085 et U+FEFF). Aucun
 * n'apparaît dans le journal fourni ; un lecteur qui collerait l'un des deux dans le banc
 * obtiendrait un résultat que Go ne donnerait pas.
 *
 *   node tools/etudes/inconnu/transcription.js          affiche la sortie transcrite
 */

/* @@DEBUT_BANC@@ */
// ---------------------------------------------------------------------------
// Ce que Go IMPRIME, reproduit à la main. Chaque fonction porte la règle qu'elle
// applique : c'est elle qu'il faut contester si la sortie surprend.
// ---------------------------------------------------------------------------

// strings.Fields : découpe sur les blancs, jette les champs vides.
function stringsFields(s) {
  var out = [];
  s.split(/\s+/).forEach(function (x) { if (x !== '') out.push(x); });
  return out;
}

// strconv.Atoi : chiffres et signe facultatif, rien d'autre. Rend une PAIRE
// {n, err} comme Go rend deux valeurs — l'erreur n'est pas une exception.
//
// Go refuse AUSSI ce qui ne tient pas dans un int64, avec une erreur « value out of
// range » distincte de « invalid syntax ». Sans cette borne, la transcription
// acceptait « 99999999999999999999 » là où Go rejette la ligne — et pire, elle
// arrondissait silencieusement 9007199254740993 (les entiers de JavaScript perdent
// l'exactitude au-delà de 2^53), donnant un solde faux sans lever la moindre erreur.
var INT64_MAX = 9223372036854775807;   // borne de Go
var SUR_JS = 9007199254740991;         // borne d'exactitude de JavaScript
function strconvAtoi(s) {
  if (!/^[+-]?[0-9]+$/.test(s)) {
    return { n: 0, err: 'strconv.Atoi: parsing "' + s + '": invalid syntax' };
  }
  var v = parseInt(s, 10);
  if (v > INT64_MAX || v < -INT64_MAX - 1) {
    return { n: 0, err: 'strconv.Atoi: parsing "' + s + '": value out of range' };
  }
  if (Math.abs(v) > SUR_JS) {
    // Go répondrait juste ; nous, non. On refuse plutôt que de rendre un chiffre faux.
    return { n: 0, err: 'strconv.Atoi: parsing "' + s + '": hors du domaine exact de cette transcription' };
  }
  return { n: v, err: null };
}

// %q : Go y applique strconv.Quote, qui produit un LITTÉRAL de chaîne Go. Il n'échappe
// pas seulement l'antislash et le guillemet : il rend visibles tous les caractères de
// contrôle sous leur forme Go. Sans cela, une ligne du journal contenant une tabulation
// aurait fait apparaître une VRAIE tabulation dans le message d'erreur, là où Go écrit
// les deux caractères « \ » et « t » ; et un saut de ligne aurait cassé le rapport en
// deux. Le journal fourni n'en contient pas — mais le banc invite à le modifier.
var ECHAPPES = { 7: 'a', 8: 'b', 9: 't', 10: 'n', 11: 'v', 12: 'f', 13: 'r' };
function goQuote(s) {
  var out = '"';
  var texte = String(s);
  for (var i = 0; i < texte.length; i++) {
    var c = texte[i], code = texte.charCodeAt(i);
    if (c === '\\') { out += '\\\\'; }
    else if (c === '"') { out += '\\"'; }
    else if (ECHAPPES[code]) { out += '\\' + ECHAPPES[code]; }
    else if (code < 0x20 || code === 0x7F) { out += '\\x' + (code < 16 ? '0' : '') + code.toString(16); }
    else { out += c; }
  }
  return out + '"';
}

// Le remplissage de Go compte les runes. Nous ne pouvons pas le vérifier sans
// compilateur Go : plutôt que de parier, on refuse de caler une valeur non ASCII.
function caler(texte, largeur, aGauche) {
  var s = String(texte);
  if (largeur > 0 && /[^\x20-\x7E]/.test(s)) {
    throw new Error('refus de caler une valeur non ASCII : ' + JSON.stringify(s));
  }
  while (s.length < largeur) { s = aGauche ? s + ' ' : ' ' + s; }
  return s;
}

// fmt.Printf, restreint aux verbes employés par le programme lu : %s %d %q %%,
// avec une largeur facultative et un - pour caler à gauche.
//
// ⚠️ La conversion de la séquence antislash-n du format se fait AVANT la substitution
// des arguments. La faire après revenait à convertir aussi ce que les arguments
// contenaient : une ligne de journal citant un chemin Windows « c:\notes » se voyait
// couper en deux dans son propre message d'erreur.
function goPrintf(format, args) {
  var i = 0;
  var modele = format.replace(/\\n/g, '\n').replace(/\\t/g, '\t');
  return modele.replace(/%(-?)(\d*)([sdq%])/g, function (_, gauche, largeur, verbe) {
    if (verbe === '%') return '%';
    var v = args[i++];
    var w = largeur ? parseInt(largeur, 10) : 0;
    if (verbe === 'q') return caler(goQuote(v), w, gauche === '-');
    if (verbe === 'd') return caler(String(v), w, gauche === '-');
    return caler(String(v), w, gauche === '-');
  });
}

// fmt.Println : une espace entre TOUS les opérandes, puis un saut de ligne.
function goPrintln(args) {
  return args.map(String).join(' ') + '\n';
}

// sort.Strings : comparaison OCTET par OCTET de la forme UTF-8.
function octetsUtf8(s) {
  var out = [];
  for (var i = 0; i < s.length; i++) {
    var c = s.codePointAt(i);
    if (c > 0xFFFF) i++;
    if (c < 0x80) { out.push(c); }
    else if (c < 0x800) { out.push(0xC0 | (c >> 6), 0x80 | (c & 63)); }
    else if (c < 0x10000) { out.push(0xE0 | (c >> 12), 0x80 | ((c >> 6) & 63), 0x80 | (c & 63)); }
    else { out.push(0xF0 | (c >> 18), 0x80 | ((c >> 12) & 63), 0x80 | ((c >> 6) & 63), 0x80 | (c & 63)); }
  }
  return out;
}
function sortStrings(tab) {
  return tab.slice().sort(function (a, b) {
    var x = octetsUtf8(a), y = octetsUtf8(b);
    for (var i = 0; i < Math.min(x.length, y.length); i++) {
      if (x[i] !== y[i]) return x[i] - y[i];
    }
    return x.length - y.length;
  });
}

// ---------------------------------------------------------------------------
// Le programme lu, transcrit ligne à ligne. Les noms sont ceux du fichier Go.
// ---------------------------------------------------------------------------

var seuilAlerte = 5;

function analyser(ligne) {
  var champs = stringsFields(ligne);
  if (champs.length !== 2) {
    return { m: null, err: goPrintf('ligne mal formée : %q', [ligne]) };
  }
  var a = strconvAtoi(champs[1]);
  if (a.err !== null) {
    return { m: null, err: goPrintf('quantité illisible dans %q', [ligne]) };
  }
  return { m: { Article: champs[0], Quantite: a.n }, err: null };
}

// ⚠️ `Object.create(null)` et non `{}` : un objet JavaScript ordinaire HÉRITE de
// Object.prototype, si bien qu'un article nommé « toString » n'y serait pas absent —
// il vaudrait une fonction, que `|| 0` laisserait passer, et l'addition deviendrait
// une CONCATÉNATION. Pire : `stock['__proto__'] = 5` est purement ignoré, l'article
// disparaîtrait du rapport. Une map de Go, elle, n'a pas de clés héritées. (Le même
// piège avait déjà été mesuré dans l'étude de cas nº 1.)
function soldes(lignes) {
  var stock = Object.create(null);
  var rejets = [];
  lignes.forEach(function (ligne) {
    var r = analyser(ligne);
    if (r.err !== null) { rejets.push(r.err); return; }
    // clé absente = valeur zéro du type, donc 0 : rien à initialiser.
    stock[r.m.Article] = (stock[r.m.Article] || 0) + r.m.Quantite;
  });
  return { stock: stock, rejets: rejets };
}

function inventaire(journal) {
  var sortie = '';
  var differes = [];   // la pile des `defer`
  differes.push(function () { sortie += goPrintln(['-- fin du rapport --']); });

  var r = soldes(journal);
  var stock = r.stock, rejets = r.rejets;

  var articles = sortStrings(Object.keys(stock));

  sortie += goPrintf('%-10s %6s %s\\n', ['ARTICLE', 'SOLDE', 'ÉTAT']);
  articles.forEach(function (article) {
    var etat = 'ok';
    if (stock[article] < 0) { etat = 'IMPOSSIBLE'; }
    else if (stock[article] <= seuilAlerte) { etat = 'à recommander'; }
    sortie += goPrintf('%-10s %6d %s\\n', [article, stock[article], etat]);
  });

  rejets.forEach(function (x) { sortie += goPrintln(['rejeté :', x]); });

  sortie += goPrintf('%d articles, %d lignes rejetées sur %d\\n',
    [articles.length, rejets.length, journal.length]);

  // defer : dépilé en ordre inverse, après la dernière instruction.
  while (differes.length) { differes.pop()(); }
  return sortie;
}

var JOURNAL = [
  'clou +120',
  'vis 40',
  'clou -35',
  'boulon 12',
  'vis -38',
  'rondelle',
  'clou -90',
  'boulon -7',
  'ecrou douze',
  'rondelle 8',
  'ecrou 3'
];
/* @@FIN_BANC@@ */

if (require.main === module) {
  process.stdout.write(inventaire(JOURNAL));
}

module.exports = {
  inventaire: inventaire, soldes: soldes, analyser: analyser,
  stringsFields: stringsFields, strconvAtoi: strconvAtoi,
  goPrintf: goPrintf, goPrintln: goPrintln, sortStrings: sortStrings,
  JOURNAL: JOURNAL
};
