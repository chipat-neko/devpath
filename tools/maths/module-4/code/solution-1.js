/* Exercice 1 — combien de morceaux séparés dans ce réseau ?
   Un parc de 14 machines, des câbles entre certaines d'entre elles. */

const ARETES = [
  ['srv1', 'srv2'], ['srv2', 'srv3'], ['srv3', 'srv1'], ['srv3', 'srv4'],
  ['bdd1', 'bdd2'], ['bdd2', 'bdd3'],
  ['cache1', 'cache2'], ['cache2', 'cache3'], ['cache3', 'cache4'], ['cache4', 'cache1'],
  ['relais1', 'relais2'],
];
const MACHINES = ['srv1', 'srv2', 'srv3', 'srv4', 'bdd1', 'bdd2', 'bdd3',
  'cache1', 'cache2', 'cache3', 'cache4', 'relais1', 'relais2', 'sonde'];

const adj = new Map(MACHINES.map((m) => [m, []]));
for (const [a, b] of ARETES) { adj.get(a).push(b); adj.get(b).push(a); }

/* Une COMPOSANTE CONNEXE, c'est un groupe où tout le monde peut se joindre.
   On part d'une machine non encore vue, on visite tout ce qu'elle atteint, et on recommence. */
const vues = new Set();
const composantes = [];
for (const depart of MACHINES) {
  if (vues.has(depart)) continue;
  const groupe = [], file = [depart];
  vues.add(depart);
  while (file.length) {
    const s = file.shift();
    groupe.push(s);
    for (const v of adj.get(s)) if (!vues.has(v)) { vues.add(v); file.push(v); }
  }
  composantes.push(groupe);
}

composantes.forEach(function (g, i) {
  console.log('composante ' + (i + 1) + ' (' + g.length + ' machine' + (g.length > 1 ? 's' : '') + ') : ' + g.join(', '));
});

/* Contrôle : la somme des tailles doit redonner le parc entier, sans doublon. */
const total = composantes.reduce((s, g) => s + g.length, 0);
const distinctes = new Set(composantes.flat()).size;
console.log('');
console.log('somme des tailles : ' + total + ' , machines distinctes : ' + distinctes +
  ' , parc : ' + MACHINES.length);
console.log('coherent : ' + (total === MACHINES.length && distinctes === MACHINES.length ? 'oui' : 'NON'));

/* Une machine seule est une composante à elle toute seule : c'est le cas de « sonde »,
   qui n'apparaît dans AUCUNE arête. Un piège classique : construire le graphe uniquement
   à partir des arêtes fait disparaître les sommets isolés, donc sous-compte les composantes. */
const parLesAretesSeules = new Set(ARETES.flat());
console.log('');
console.log('sommets vus si on ne lit que les aretes : ' + parLesAretesSeules.size +
  ' sur ' + MACHINES.length + '  -> ' + (MACHINES.length - parLesAretesSeules.size) + ' machine(s) oubliee(s)');

console.log('');
console.log(composantes.length);
