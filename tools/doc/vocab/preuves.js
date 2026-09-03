/* tools/doc/vocab/preuves.js — les PIÈGES du vocabulaire, joués et non racontés.
 *
 * POURQUOI CE FICHIER EXISTE
 * --------------------------
 * La leçon 02 affirme, pour chaque mot anglais, ce qu'il veut dire ET ce qu'il
 * ne veut PAS dire. Une affirmation de ce genre est exactement le type de phrase
 * qu'on écrit de tête et qu'on ne rejoue jamais — la cause des cinq exemples
 * faux qui ont traversé quatre vérificateurs verts.
 *
 * Ici, chaque piège est une FONCTION. Elle rend une valeur. La prose de la leçon
 * ne cite jamais cette valeur : elle porte un marqueur {{clé}} que le générateur
 * remplace à l'assemblage. Si le moteur change d'avis, la leçon change avec lui,
 * ou le vérificateur tombe.
 *
 * Chaque preuve rend { valeur, affiche } :
 *   valeur  — ce que le programme obtient réellement ;
 *   affiche — la forme lisible qui sera injectée dans la prose.
 */
'use strict';

function txt(v) {
  if (typeof v === 'string') return '"' + v + '"';
  if (Array.isArray(v)) return '[' + v.map(txt).join(', ') + ']';
  return String(v);
}
/* Une preuve : un libellé, un calcul, et la forme publiée. */
function p(calcul, forme) {
  return function () {
    const v = calcul();
    return { valeur: v, affiche: forme ? forme(v) : txt(v) };
  };
}

const PREUVES = {

  /* ---- ce que la doc promet ---------------------------------------------- */

  /* « deprecated » ne veut pas dire « retiré ». escape() est déconseillée
     depuis 1999 (annexe B de la norme) et répond toujours. */
  escapeVit: p(() => (typeof escape === 'function' ? escape('é') : 'absente')),
  substrVit: p(() => 'abcdef'.substr(1, 2)),

  /* « optional » : absent et undefined ne sont PAS la même chose pour tout le
     monde. La valeur par défaut les confond ; arguments.length les distingue. */
  optionnelAbsent: p(() => { function f(a = 1) { return arguments.length; } return f(); }),
  optionnelUndefined: p(() => { function f(a = 1) { return arguments.length; } return f(undefined); }),
  optionnelNull: p(() => { function f(a = 1) { return a; } return f(null); }),

  /* « throws » est une promesse, et une promesse peut être trop large : la doc
     de slugify() annonçait un refus pour « not a string ». Un objet String
     passe pourtant : son typeof vaut "object", mais il a bien .normalize(). */
  throwsTropLarge: p(() => typeof new String('x')),

  /* ---- ce que le code fait ------------------------------------------------ */

  /* « overload » : en JavaScript, il n'y a pas de surcharge. La seconde
     définition ÉCRASE la première, sans un mot. */
  surchargeEcrase: p(() => {
    /* eslint-disable no-func-assign */
    function g() { return 'A'; }
    function g(x) { return 'B' + (x === undefined ? '' : x); }
    return g();
  }),

  /* « mutable » : const parle du LIEN, jamais du contenu. */
  constMuable: p(() => { const t = []; t.push(1); t.push(2); return t; }),

  /* « shadowing » : le nom de l'intérieur gagne, sans avertissement. */
  masquage: p(() => { const n = 'externe'; return (function () { const n2 = 'interne'; return n2; })() + '/' + n; }),

  /* « hoisting » : var existe avant sa ligne, let n'existe pas. */
  remonteeVar: p(() => (function () { return typeof x; /* eslint-disable-next-line */ var x = 1; })()),
  remonteeLet: p(() => (function () { try { return typeof y; } catch (e) { return e.name; } /* eslint-disable-next-line */ let y = 1; })()),

  /* « lazy » : un générateur ne calcule rien tant qu'on ne lui demande rien. */
  paresseux: p(() => {
    let tours = 0;
    function* g() { for (let i = 0; i < 1e6; i++) { tours++; yield i; } }
    const it = g(); const avant = tours; it.next();
    return [avant, tours];
  }, (v) => v[0] + ' tour avant le premier next(), ' + v[1] + ' après'),

  /* ---- les données et leurs bords ---------------------------------------- */

  /* « exclusive » : la borne de fin ne fait pas partie du résultat. */
  borneExclue: p(() => [1, 2, 3, 4].slice(1, 3)),
  borneCombien: p(() => [1, 2, 3, 4].slice(1, 3).length),

  /* « zero-based » : le premier indice vaut 0, donc « if (i) » rate le premier. */
  indiceZero: p(() => [10, 20, 30].indexOf(10)),
  indiceAbsent: p(() => [10, 20, 30].indexOf(99)),

  /* « shallow copy » : la copie de surface partage tout ce qui est en dessous. */
  copieSuperficielle: p(() => {
    const src = { n: 1, sous: { x: 1 } };
    const copie = Object.assign({}, src);
    copie.sous.x = 99;
    return src.sous.x;
  }),

  /* « greedy » : par défaut, un quantificateur prend tout ce qu'il peut. */
  gourmand: p(() => '<a><b>'.match(/<.+>/)[0]),
  econome: p(() => '<a><b>'.match(/<.+?>/)[0]),

  /* « truthy » n'est pas « == true ». [] est vrai dans un si, et égal à false. */
  tableauVrai: p(() => ([] ? 'vrai' : 'faux')),
  tableauEgalFaux: p(() => [] == false),          // eslint-disable-line eqeqeq
  zeroTexteVrai: p(() => ('0' ? 'vrai' : 'faux')),
  zeroTexteEgalFaux: p(() => '0' == false),        // eslint-disable-line eqeqeq

  /* « coercion » : le même signe + ne fait pas la même chose selon les types. */
  conversionMoins: p(() => '5' - 2),
  conversionPlus: p(() => '5' + 2),

  /* « overflow » : au-delà de 2^53, deux entiers voisins deviennent égaux. */
  depassement: p(() => Number.MAX_SAFE_INTEGER + 1 === Number.MAX_SAFE_INTEGER + 2),

  /* « unsigned » : le même motif de bits lu sans signe change de valeur. */
  nonSigne: p(() => -1 >>> 0),
  signe: p(() => -1 >> 0),

  /* « rounding » : arrondir n'est pas tronquer, et JS arrondit vers le haut,
     pas « au pair le plus proche » comme printf en C ou round() en Python. */
  arrondiDemi: p(() => [(0.5).toFixed(0), (1.5).toFixed(0), (2.5).toFixed(0)]),
  /* et Math.round(-0.5) ne rend pas 0 : il rend -0, que console.log affiche
     comme un zéro ordinaire. Object.is est le seul à faire la différence. */
  arrondiNegatif: p(() => Math.round(-0.5), (v) => (Object.is(v, -0) ? '-0' : String(v))),
  troncature: p(() => [Math.trunc(-1.5), Math.floor(-1.5)]),

  /* « precision » : la somme la plus célèbre du métier. */
  precision: p(() => 0.1 + 0.2),

  /* « NaN » : la seule valeur qui n'est pas égale à elle-même, et son type ment. */
  nanInegal: p(() => NaN !== NaN),                 // eslint-disable-line no-self-compare
  nanType: p(() => typeof NaN),
  nulType: p(() => typeof null),

  /* « case-insensitive » : passer en majuscules peut RALLONGER le texte. */
  casseUnicode: p(() => 'ß'.toUpperCase()),
  casseLongueur: p(() => ['ß'.length, 'ß'.toUpperCase().length]),

  /* « length » compte des unités de code, pas des caractères. */
  longueurEmoji: p(() => '👍'.length),
  longueurReelle: p(() => [...'👍'].length),

  /* « normalization » : deux textes identiques à l'œil, différents en mémoire. */
  normalisationEgal: p(() => 'é' === 'é'),
  normalisationApres: p(() => 'é'.normalize('NFD') === 'é'.normalize('NFD')),

  /* « blank » n'est pas « empty ». */
  blancLongueur: p(() => '   '.length),
  blancVide: p(() => '   '.trim() === ''),
  blancVrai: p(() => ('   ' ? 'vrai' : 'faux')),

  /* « escape » : deux fonctions au nom voisin, deux résultats différents. */
  echappeVieux: p(() => (typeof escape === 'function' ? escape('é') : 'absente')),
  echappeUri: p(() => encodeURIComponent('é')),

  /* ---- le temps, l'ordre, la concurrence ---------------------------------- */

  /* « stable » : un tri stable garde l'ordre d'arrivée des ex æquo. */
  triStable: p(() => {
    const v = [{ n: 'a', k: 1 }, { n: 'b', k: 1 }, { n: 'c', k: 0 }];
    return v.sort((x, y) => x.k - y.k).map((o) => o.n).join('');
  }),
  /* et le tri par défaut ne compare pas des nombres : il compare des textes. */
  triLexical: p(() => [10, 9, 1].sort()),

  /* « idempotent » : appliquer deux fois donne le même résultat qu'une fois. */
  idempotent: p(() => {
    const t = '  a  ';
    return t.trim() === t.trim().trim();
  }),
  nonIdempotent: p(() => {
    const une = 'aaa'.replace('a', '');
    const deux = 'aaa'.replace('a', '').replace('a', '');
    return [une, deux];
  }),

  /* « race condition » : deux tâches qui lisent avant d'écrire perdent une
     mise à jour. Deux incréments, un seul compté. */
  concurrence: p(() => {
    /* rejoué de façon SYNCHRONE : la microtâche est simulée en séquence
       lire → (bascule) → écrire, ce que fait exactement le await ci-dessous.
         async function inc() { const v = c; await null; c = v + 1; }
       Le résultat est mesuré pour de vrai par le programme cliquable de la
       leçon ; ici on montre le mécanisme sans dépendre de l'ordonnanceur. */
    let c = 0;
    const luA = c;              // tâche A lit
    const luB = c;              // tâche B lit, avant que A n'ait écrit
    c = luA + 1;                // A écrit
    c = luB + 1;                // B écrit, en écrasant A
    return c;
  }),
  concurrenceAttendu: p(() => 2),

  /* « pending / fulfilled / rejected » : les trois états d'une promesse. */
  etatsPromesse: p(() => ['pending', 'fulfilled', 'rejected']),

  /* ---- quand ça casse : le corpus B, provoqué et compté ------------------- */
  erreursTotal: p(() => corpusErreurs().total),
  erreursIsNotA: p(() => corpusErreurs().isNotA),
  erreursCannot: p(() => corpusErreurs().cannot),
  erreursTypeError: p(() => corpusErreurs().types.TypeError || 0),
  erreursTypes: p(() => Object.keys(corpusErreurs().types).length),
};

/* Les mots présents dans les MESSAGES D'ERREUR du moteur — corpus B. */
function corpusErreurs() {
  const { relever, motsFrequents } = require('../mesures/messages-erreur.js');
  const messages = relever();
  const freq = motsFrequents(messages);
  const parType = {};
  for (const m of messages) parType[m.type] = (parType[m.type] || 0) + 1;
  return {
    messages,
    total: messages.length,
    types: parType,
    isNotA: messages.filter((m) => /is not a[n]? /.test(m.message)).length,
    cannot: messages.filter((m) => /\bCannot\b/.test(m.message)).length,
    mustBe: messages.filter((m) => /\bmust be\b/.test(m.message)).length,
    freq,
  };
}

function evaluer(cle) {
  if (!PREUVES.hasOwnProperty(cle)) throw new Error('preuve inconnue : ' + cle);
  return PREUVES[cle]();
}

module.exports = { PREUVES, evaluer, corpusErreurs, txt };

if (require.main === module) {
  for (const cle of Object.keys(PREUVES)) {
    const r = evaluer(cle);
    console.log(cle.padEnd(22) + ' => ' + r.affiche);
  }
  const e = corpusErreurs();
  console.log('\ncorpus d erreurs : ' + e.total + ' messages, ' +
    Object.entries(e.types).map(([t, n]) => t + ' ' + n).join(', '));
  console.log('  « is not a » : ' + e.isNotA + '  « Cannot » : ' + e.cannot + '  « must be » : ' + e.mustBe);
}
