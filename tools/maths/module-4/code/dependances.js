/* Un graphe ORIENTÉ : les flèches ne se remontent pas. Le cas le plus banal du métier,
   celui que toute installation de paquets résout : « que faut-il installer avant quoi ? » */

/* dependances[p] = ce que p exige d'avoir AVANT lui. */
const dependances = {
  'app':        ['ui', 'api'],
  'ui':         ['moteur-rendu', 'utils'],
  'api':        ['http', 'utils'],
  'http':       ['sockets'],
  'moteur-rendu': ['utils'],
  'rapport':    ['app'],                      // dépend de app, et rien ne dépend de lui
  'sockets':    [],
  'utils':      [],
};
const paquets = Object.keys(dependances);

/* On compte, pour chaque paquet, COMBIEN de choses il attend : son « degré entrant ».
   Un paquet prêt à installer est un paquet qui n'attend plus rien. */
function ordreInstallation(dep) {
  const noms = Object.keys(dep);
  const attend = new Map(noms.map((p) => [p, dep[p].length]));
  const debloque = new Map(noms.map((p) => [p, []]));
  for (const p of noms) for (const d of dep[p]) debloque.get(d).push(p);

  const prets = noms.filter((p) => attend.get(p) === 0).sort();
  const ordre = [];
  while (prets.length) {
    const p = prets.shift();
    ordre.push(p);
    for (const suivant of debloque.get(p)) {
      attend.set(suivant, attend.get(suivant) - 1);
      if (attend.get(suivant) === 0) { prets.push(suivant); prets.sort(); }
    }
  }
  /* Si des paquets restent bloqués, c'est qu'ils s'attendent en rond. */
  const bloques = noms.filter((p) => attend.get(p) > 0);
  return { ordre: ordre, bloques: bloques };
}

const r = ordreInstallation(dependances);
console.log('paquets : ' + paquets.length);
console.log("ordre d'installation : " + r.ordre.join(' > '));
console.log('bloques : ' + (r.bloques.length ? r.bloques.join(', ') : 'aucun'));

/* Un ordre valide, c'est un ordre où AUCUNE dépendance n'arrive après celui qui l'exige.
   On ne le suppose pas : on le vérifie, dépendance par dépendance. */
function verifier(ordre, dep) {
  const rang = new Map(ordre.map((p, i) => [p, i]));
  let violations = 0, total = 0;
  for (const p of Object.keys(dep)) for (const d of dep[p]) {
    total++;
    if (!(rang.get(d) < rang.get(p))) violations++;
  }
  return { total: total, violations: violations };
}
const v = verifier(r.ordre, dependances);
console.log('dependances verifiees : ' + v.total + ' , violations : ' + v.violations);

/* Il n'y a pas UN ordre valide, il y en a plusieurs. On les compte tous, par énumération. */
function compterOrdres(dep) {
  const noms = Object.keys(dep);
  let total = 0;
  (function poser(place) {
    if (place.length === noms.length) { total++; return; }
    for (const p of noms) {
      if (place.includes(p)) continue;
      if (dep[p].every((d) => place.includes(d))) poser(place.concat([p]));
    }
  })([]);
  return total;
}
console.log("ordres d'installation valides, tous comptes : " + compterOrdres(dependances));
const fact = paquets.reduce(function (f, _, i) { return f * (i + 1); }, 1);
console.log('ordres possibles si on ignorait les dependances (' + paquets.length + '!) : ' + fact);

/* LE CYCLE. On ajoute une seule ligne : utils finit par dépendre de app. */
const casse = JSON.parse(JSON.stringify(dependances));
casse['utils'] = ['app'];
const rc = ordreInstallation(casse);
console.log('');
console.log('-- apres avoir ajoute : utils depend de app --');
console.log('installes : ' + (rc.ordre.length ? rc.ordre.join(' > ') : 'aucun'));
console.log('bloques   : ' + rc.bloques.join(', ') + '   (' + rc.bloques.length + ' paquets)');

/* Dire « il y a un cycle » ne suffit pas : il faut savoir LESQUELS, et lesquelles de leurs
   arêtes il faut casser. On énumère TOUS les cycles élémentaires, sans en oublier un. */
function tousLesCycles(dep) {
  const noms = Object.keys(dep), vus = new Set(), out = [];
  for (const depart of noms) {
    const chemin = [], dans = new Set();
    (function descendre(p) {
      if (p === depart && chemin.length) { 
        const k = chemin.slice().sort().join('|');
        if (!vus.has(k)) { vus.add(k); out.push(chemin.concat([depart])); }
        return;
      }
      if (dans.has(p)) return;
      dans.add(p); chemin.push(p);
      for (const q of dep[p]) descendre(q);
      dans.delete(p); chemin.pop();
    })(depart);
  }
  return out;
}
const cycles = tousLesCycles(casse);
console.log('');
console.log('cycles elementaires trouves : ' + cycles.length);
cycles.forEach(function (c) { console.log('  ' + c.join(' -> ') + '   (' + (c.length - 1) + ' aretes)'); });

/* Quelles arêtes suffisent, à elles seules, à tout débloquer ? On les ESSAIE, une par une. */
const aretesDuCycle = [];
cycles.forEach(function (c) {
  for (let i = 0; i + 1 < c.length; i++) {
    const cle = c[i] + ' -> ' + c[i + 1];
    if (aretesDuCycle.indexOf(cle) === -1) aretesDuCycle.push(cle);
  }
});
const suffisantes = aretesDuCycle.filter(function (cle) {
  const [a, b] = cle.split(' -> ');
  const d = JSON.parse(JSON.stringify(casse));
  d[a] = d[a].filter(function (x) { return x !== b; });
  return ordreInstallation(d).bloques.length === 0;
});
console.log('');
console.log('aretes impliquees dans un cycle : ' + aretesDuCycle.length);
console.log('aretes qui, a elles seules, debloquent tout : ' + suffisantes.length + '  -> ' + suffisantes.join(' , '));
console.log('nommer UN cycle ne suffit donc pas : sur ses ' + (cycles[0].length - 1) +
  ' aretes, ' + cycles[0].slice(0, -1).map(function (a, i) { return a + ' -> ' + cycles[0][i + 1]; })
    .filter(function (c) { return suffisantes.indexOf(c) !== -1; }).length + ' debloque(nt) tout.');

/* Enfin : les paquets bloqués sont-ils tous DANS un cycle, ou certains le sont-ils seulement
   parce qu'ils en dépendent ? On calcule les composantes fortement connexes pour trancher. */
function fortementConnexes(dep) {
  const noms = Object.keys(dep);
  const atteint = {};
  noms.forEach(function (d) {
    const vus = new Set(), file = [d];
    while (file.length) { const s = file.shift(); for (const q of dep[s]) if (!vus.has(q)) { vus.add(q); file.push(q); } }
    atteint[d] = vus;
  });
  const groupes = [], place = new Set();
  noms.forEach(function (a) {
    if (place.has(a)) return;
    const g = noms.filter(function (b) { return b === a || (atteint[a].has(b) && atteint[b].has(a)); });
    g.forEach(function (x) { place.add(x); });
    groupes.push(g);
  });
  return groupes;
}
const groupes = fortementConnexes(casse).filter(function (g) { return g.length > 1; });
const dansUnCycle = groupes.reduce(function (a, g) { return a.concat(g); }, []);
const bloquesHorsCycle = rc.bloques.filter(function (p) { return dansUnCycle.indexOf(p) === -1; });
console.log('');
console.log('paquets DANS un cycle          : ' + dansUnCycle.join(', ') + '   (' + dansUnCycle.length + ')');
console.log('paquets bloques SANS y etre    : ' + (bloquesHorsCycle.join(', ') || 'aucun') +
  '   (' + bloquesHorsCycle.length + ')');
console.log('total bloque : ' + rc.bloques.length + ' sur ' + paquets.length +
  ' , pour un cycle qui n en contient que ' + (cycles[0].length - 1));
