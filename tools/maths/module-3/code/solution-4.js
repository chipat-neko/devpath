/* Exercice 1 (leçon 8) — les premiers jumeaux, comptés avec un crible. */
function crible(n) {
  const compose = new Array(n + 1).fill(false);
  for (let p = 2; p * p <= n; p++) {
    if (compose[p]) continue;
    for (let k = p * p; k <= n; k += p) compose[k] = true;
  }
  const premiers = [];
  for (let i = 2; i <= n; i++) if (!compose[i]) premiers.push(i);
  return premiers;
}

const N = 100000;
const premiers = crible(N);
const jumeaux = [];
for (let i = 1; i < premiers.length; i++) {
  if (premiers[i] - premiers[i - 1] === 2) jumeaux.push([premiers[i - 1], premiers[i]]);
}

console.log('premiers jusqu\'a ' + N + ' : ' + premiers.length);
console.log('paires de jumeaux         : ' + jumeaux.length);
console.log('les cinq premieres        : ' + jumeaux.slice(0, 5).map((p) => '(' + p.join(',') + ')').join(' '));
console.log('la derniere sous ' + N + '   : (' + jumeaux[jumeaux.length - 1].join(',') + ')');

// La densité des jumeaux tombe plus vite que celle des premiers. On le montre.
console.log('');
console.log('jusqu\'a       premiers   jumeaux   jumeaux pour 1000 premiers');
for (const b of [1000, 10000, 100000]) {
  const p = premiers.filter((x) => x <= b);
  let j = 0;
  for (let i = 1; i < p.length; i++) if (p[i] - p[i - 1] === 2) j++;
  console.log(String(b).padEnd(14) + String(p.length).padEnd(11) + String(j).padEnd(10) +
    (1000 * j / p.length).toFixed(1));
}

// Le seul écart de 1 entre deux premiers, et pourquoi il est unique.
const ecart1 = [];
for (let i = 1; i < premiers.length; i++) if (premiers[i] - premiers[i - 1] === 1) ecart1.push(premiers[i - 1] + ' et ' + premiers[i]);
console.log('');
console.log('paires de premiers separees de 1 : ' + (ecart1.length ? ecart1.join(', ') : 'aucune') +
  '  -> sur 2 et 3 uniquement : au-dela, l\'un des deux serait pair.');
console.log('couples trouves : ' + ecart1.length);

// La réponse demandée, seule sur la dernière ligne.
console.log(jumeaux.length);
