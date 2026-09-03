/* COÛT AMORTI : quand une opération coûte cher de temps en temps, et rien
   le reste du temps. Le tableau dynamique en est l’exemple fondateur —
   c’est ce qui se passe sous chaque push() que tu écris. */

/* Un tableau à capacité fixe, réalloué selon une stratégie donnée.
   On compte les RECOPIES : c’est le seul travail non constant. */
function simuler(n, croissance) {
  let capacite = 1, taille = 0, recopies = 0, reallocations = 0;
  const couts = [];
  for (let i = 0; i < n; i++) {
    let cout = 1;                     // écrire la valeur
    if (taille === capacite) {
      const neuve = croissance(capacite);
      recopies += taille; cout += taille;   // recopier tout l’existant
      reallocations++;
      capacite = neuve;
    }
    taille++;
    couts.push(cout);
  }
  return { recopies: recopies, reallocations: reallocations, capacite: capacite, couts: couts };
}

const N = 100000;
const STRATEGIES = [
  { nom: 'capacité + 1', f: (c) => c + 1 },
  { nom: 'capacité + 100', f: (c) => c + 100 },
  { nom: 'capacité × 1,5', f: (c) => Math.ceil(c * 1.5) },
  { nom: 'capacité × 2', f: (c) => c * 2 },
  { nom: 'capacité × 4', f: (c) => c * 4 },
];

console.log(N + ' insertions, selon la stratégie d’agrandissement');
console.log('');
console.log('stratégie          réallocations      recopies   recopies/insertion   mémoire finale');
console.log('---------------    -------------   -----------   ------------------   --------------');
STRATEGIES.forEach(function (s) {
  const r = simuler(N, s.f);
  console.log(s.nom.padEnd(18) + String(r.reallocations).padStart(13) + '   ' +
    String(r.recopies).padStart(11) + '   ' + (r.recopies / N).toFixed(3).padStart(18) + '   ' +
    (String(r.capacite) + ' (' + (100 * r.capacite / N).toFixed(0) + ' %)').padStart(14));
});

/* Une seule taille flatte ou pénalise chaque stratégie selon la place de n
   entre deux agrandissements : à n = 100 000, « ×2 » vient de doubler et « ×1,5 »
   non, ce qui fait passer ×1,5 pour dominée. On moyenne donc sur 96 tailles. */
console.log('');
console.log('LA MÊME COMPARAISON, MOYENNÉE SUR LES TAILLES DE 50 000 À 145 000');
console.log('');
console.log('stratégie          recopies/insertion   mémoire occupée   part gaspillée');
console.log('---------------    ------------------   ---------------   --------------');
function coutSeul(n, croissance) {          // sans garder le détail par insertion
  let capacite = 1, taille = 0, recopies = 0;
  for (let i = 0; i < n; i++) {
    if (taille === capacite) { const neuve = croissance(capacite); recopies += taille; capacite = neuve; }
    taille++;
  }
  return { recopies: recopies, capacite: capacite };
}
STRATEGIES.forEach(function (s) {
  let sr = 0, sm = 0, k = 0;
  for (let n = 50000; n < 146000; n += 1000) { const r = coutSeul(n, s.f); sr += r.recopies / n; sm += r.capacite / n; k++; }
  const occupe = 100 * sm / k;
  console.log(s.nom.padEnd(18) + (sr / k).toFixed(3).padStart(18) + '   ' +
    (occupe.toFixed(0) + ' %').padStart(15) + ((occupe - 100).toFixed(0) + ' %').padStart(17));
});
console.log('');
console.log('LE COMPROMIS, EN UNE LIGNE : plus on agrandit gros, moins on recopie,');
console.log('et plus on gaspille de mémoire. Moyennées, les stratégies s’ordonnent');
console.log('proprement — et « ×2 » est le point d’équilibre usuel.');

/* --- pourquoi « amorti » et non « moyen » -------------------------------- */
const d = simuler(N, (c) => c * 2);
const cher = d.couts.filter((c) => c > 1).length;
/* Math.max.apply déborde la pile d’un Worker de navigateur au-delà de
   quelques dizaines de milliers d’arguments : on boucle. */
let plusCher = 0;
d.couts.forEach(function (c) { if (c > plusCher) plusCher = c; });
const rangDuPire = d.couts.indexOf(plusCher);
console.log('');
console.log('STRATÉGIE « ×2 », INSERTION PAR INSERTION');
console.log('  insertions à coût 1 ......... : ' + (N - cher) + ' sur ' + N +
  ' (' + (100 * (N - cher) / N).toFixed(3) + ' %)');
console.log('  insertions qui recopient .... : ' + cher);
console.log('  la plus chère ............... : ' + plusCher + ' unités, à l’insertion n° ' + (rangDuPire + 1));
console.log('  coût total .................. : ' + d.couts.reduce((a, b) => a + b, 0));
console.log('  coût moyen par insertion .... : ' + (d.couts.reduce((a, b) => a + b, 0) / N).toFixed(3));
console.log('');
console.log('  Le coût amorti est CONSTANT — moins de 3 unités par insertion en moyenne —');
console.log('  alors que le pire cas d’UNE insertion vaut ' + plusCher + ', soit ' +
  Math.round(plusCher / (d.couts.reduce((a, b) => a + b, 0) / N)) + ' fois la moyenne.');
console.log('  « Amorti » veut dire : sur une suite d’opérations, jamais sur une seule.');

/* La démonstration : le total des recopies est borné par 2n. */
console.log('');
console.log('POURQUOI C’EST BORNÉ : les recopies valent 1 + 2 + 4 + … + 2^k, une somme');
console.log('géométrique qui vaut 2^(k+1) − 1, donc au plus 2n − 1. Vérifié :');
[1000, 10000, 65537, 100000, 1000000].forEach(function (n) {
  const r = simuler(n, (c) => c * 2);
  console.log('  n = ' + String(n).padStart(7) + '   recopies = ' + String(r.recopies).padStart(7) +
    '   recopies/n = ' + (r.recopies / n).toFixed(5) + '   < 2n : ' + (r.recopies < 2 * n));
});
console.log('  Le rapport dépend de la place de n entre deux puissances de 2. Il FRÔLE 2');
console.log('  juste après un doublement — n = 65 537 le montre — et retombe vers 1 juste');
console.log('  avant le suivant. Il ne le dépasse jamais : il est BORNÉ, donc constant en O().');

/* --- ce que l’amortissement CACHE --------------------------------------- */
console.log('');
console.log('CE QUE L’AMORTISSEMENT CACHE');
const trie = d.couts.slice().sort((a, b) => a - b);
/* Le rang se calcule sur des ENTIERS : écrit « p / 100 * n », le 99,99e centile
   de 100 000 valeurs donne 99989.99999999999, donc le rang 99989 au lieu de
   99990 — et un centile faux. C'est un piège de la leçon 9 de ce cours. */
function centile(millieme) { return trie[Math.min(trie.length - 1, Math.floor(millieme * trie.length / 10000))]; }
console.log('  coût médian ..... : ' + centile(5000));
console.log('  99e centile ..... : ' + centile(9900));
console.log('  99,9e centile ... : ' + centile(9990));
console.log('  99,99e centile .. : ' + centile(9999));
console.log('  maximum ......... : ' + plusCher);
console.log('');
console.log('  Un serveur qui mesure sa latence au 99e centile ne verra RIEN.');
console.log('  Le pic est ' + plusCher + ' fois plus cher qu’une insertion ordinaire, mais il ne');
console.log('  concerne que ' + cher + ' requêtes sur ' + N + '. C’est là que les « pics inexpliqués »');
console.log('  se cachent : dans une moyenne parfaitement rassurante.');
