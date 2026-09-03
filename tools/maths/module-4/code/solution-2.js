/* Exercice 2 — répartir des tâches sur DEUX machines sans mettre ensemble deux tâches
   qui se gênent. Le graphe des conflits est-il coloriable en deux couleurs ?

   La question a un nom : le graphe est-il BIPARTI ? Et un test : un parcours en largeur
   qui donne alternativement les deux couleurs, en vérifiant qu'aucune arête ne les relie
   deux fois à la même. */

function deuxCouleurs(adj, n) {
  const couleur = new Array(n).fill(-1);
  const conflits = [], deja = new Set();
  for (let depart = 0; depart < n; depart++) {
    if (couleur[depart] !== -1) continue;
    couleur[depart] = 0;
    const file = [depart];
    while (file.length) {
      const s = file.shift();
      for (const v of adj[s]) {
        if (couleur[v] === -1) { couleur[v] = 1 - couleur[s]; file.push(v); }
        else if (couleur[v] === couleur[s]) {
          /* On range la PAIRE, pas l'incidence : sans cela, chaque arête fautive
             serait comptée deux fois — une fois vue depuis chacune de ses extrémités. */
          const cle = Math.min(s, v) + '-' + Math.max(s, v);
          if (!deja.has(cle)) { deja.add(cle); conflits.push([Math.min(s, v), Math.max(s, v)]); }
        }
      }
    }
  }
  return { couleur: couleur, conflits: conflits, biparti: conflits.length === 0 };
}

/* Six tâches, et les paires qui ne peuvent pas tourner sur la même machine. */
const TACHES = ['import', 'export', 'index', 'sauvegarde', 'rapport', 'purge'];
const CONFLITS = [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 0]];
const adj = Array.from({ length: 6 }, () => []);
for (const [a, b] of CONFLITS) { adj[a].push(b); adj[b].push(a); }

const r = deuxCouleurs(adj, 6);
console.log('taches : ' + TACHES.length + ' , conflits : ' + CONFLITS.length);
console.log('biparti : ' + (r.biparti ? 'oui' : 'non'));
console.log('machine A : ' + TACHES.filter((_, i) => r.couleur[i] === 0).join(', '));
console.log('machine B : ' + TACHES.filter((_, i) => r.couleur[i] === 1).join(', '));

/* On ne CROIT pas la répartition : on la vérifie, conflit par conflit. */
let mal = 0;
for (const [a, b] of CONFLITS) if (r.couleur[a] === r.couleur[b]) mal++;
console.log('conflits mal separes : ' + mal + ' sur ' + CONFLITS.length);

/* On ajoute UNE tâche en conflit avec deux tâches déjà en conflit entre elles. */
const CONFLITS2 = CONFLITS.concat([[0, 2]]);
const adj2 = Array.from({ length: 6 }, () => []);
for (const [a, b] of CONFLITS2) { adj2[a].push(b); adj2[b].push(a); }
const r2 = deuxCouleurs(adj2, 6);
console.log('');
console.log('-- apres avoir ajoute le conflit import / index --');
console.log('biparti : ' + (r2.biparti ? 'oui' : 'non') + ' , aretes fautives : ' + r2.conflits.length +
  ' sur ' + CONFLITS2.length);
console.log('detail : ' + r2.conflits.map(function (c) { return TACHES[c[0]] + '/' + TACHES[c[1]]; }).join(' , '));

/* Quelles longueurs de cycles le graphe contient-il, avant et apres ? Le critere porte
   sur l EXISTENCE d un cycle impair, pas sur la disparition du cycle pair. */
function longueursDeCycles(adj, n) {
  const trouvees = new Set();
  for (let d = 0; d < n; d++) {
    const chemin = [], dans = new Array(n).fill(false);
    (function marcher(s) {
      dans[s] = true; chemin.push(s);
      for (const v of adj[s]) {
        if (v === d && chemin.length >= 3) trouvees.add(chemin.length);
        else if (!dans[v] && v > d) marcher(v);
      }
      dans[s] = false; chemin.pop();
    })(d);
  }
  return Array.from(trouvees).sort(function (a, b) { return a - b; });
}
console.log('longueurs de cycles AVANT : ' + longueursDeCycles(adj, 6).join(', '));
console.log('longueurs de cycles APRES : ' + longueursDeCycles(adj2, 6).join(', ') +
  '   -> le 6-cycle subsiste, des cycles impairs APPARAISSENT a cote');

/* La raison profonde : un graphe est biparti EXACTEMENT quand il n'a aucun cycle de
   longueur impaire. On le vérifie sur 2 000 graphes tirés au sort, avec une seconde
   méthode qui ne partage rien avec la première : la recherche directe d'un cycle impair. */
function rng(g) { let x = g >>> 0; return function () { x ^= x << 13; x >>>= 0; x ^= x >> 17; x ^= x << 5; x >>>= 0; return x / 4294967296; }; }

function aUnCycleImpair(adj, n) {                  // par énumération des chemins simples
  for (let d = 0; d < n; d++) {
    let trouve = false;
    (function marcher(s, longueur, vus) {
      if (trouve) return;
      for (const v of adj[s]) {
        if (v === d && longueur >= 2 && (longueur + 1) % 2 === 1) { trouve = true; return; }
        if (!vus.has(v)) { vus.add(v); marcher(v, longueur + 1, vus); vus.delete(v); }
      }
    })(d, 0, new Set([d]));
    if (trouve) return true;
  }
  return false;
}

let essais = 0, accord = 0, desaccord = 0, bipartis = 0;
for (let t = 0; t < 2000; t++) {
  const al = rng(4000 + t * 65537);
  const n = 7;
  const A = Array.from({ length: n }, () => []);
  for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) if (al() < 0.3) { A[i].push(j); A[j].push(i); }
  const parCouleurs = deuxCouleurs(A, n).biparti;
  const parCycles = !aUnCycleImpair(A, n);
  essais++;
  if (parCouleurs === parCycles) accord++; else desaccord++;
  if (parCouleurs) bipartis++;
}
console.log('');
console.log('sur ' + essais + ' graphes tires au sort :');
console.log('  bipartis : ' + bipartis + ' (' + (bipartis / essais * 100).toFixed(1) + ' %)');
console.log('  accords entre « deux couleurs » et « aucun cycle impair » : ' + accord);
console.log('  desaccords : ' + desaccord);

console.log('');
console.log(bipartis);
